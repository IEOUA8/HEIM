import Link from "next/link";
import { notFound } from "next/navigation";
import { getRegistrationDetail } from "@/lib/admin/data";
import { StatusChanger } from "@/components/admin/StatusChanger";
import { NoteForm } from "@/components/admin/NoteForm";
import { AttentionBadge } from "@/components/admin/StatusBadge";
import { STATUS_LABELS } from "@/lib/registration/status";

export const dynamic = "force-dynamic";

const SIZE_LABELS: Record<string, string> = {
  small: "Pequeño",
  medium: "Mediano",
  large: "Grande",
  giant: "Gigante",
  unknown: "Sin definir",
};
const DOC_LABELS: Record<string, string> = {
  cc: "Cédula de ciudadanía",
  ce: "Cédula de extranjería",
  passport: "Pasaporte",
  other: "Otro",
};
const BEHAVIOR_LABELS: Record<string, string> = {
  friendly: "Amigable y sociable",
  needs_space: "Necesita espacio",
  muzzle: "Usará bozal",
  reactive_dogs: "Reactivo con perros",
  reactive_people: "Reactivo con personas",
  wants_to_talk: "Quiere conversar con el equipo",
};
const HEALTH_LABELS: Record<string, string> = {
  healthy: "En buen estado de salud",
  observation: "Con observación",
};

function fmt(iso: string) {
  return new Date(iso).toLocaleString("es-CO", { dateStyle: "medium", timeStyle: "short" });
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl bg-white p-6 shadow-[0_10px_30px_-12px_rgba(35,63,53,0.18)]">
      <h2 className="mb-4 font-semibold text-brand-forest">{title}</h2>
      {children}
    </section>
  );
}

function Field({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="flex justify-between gap-4 border-b border-brand-forest/5 py-2 text-sm last:border-0">
      <span className="text-brand-forest/60">{label}</span>
      <span className="text-right font-medium text-brand-forest">{value || "—"}</span>
    </div>
  );
}

export default async function RegistrationDetailPage({ params }: PageProps<"/admin/inscripciones/[id]">) {
  const { id } = await params;
  const r = await getRegistrationDetail(id);
  if (!r) notFound();

  const yesNo = (b: boolean) => (b ? "Sí" : "No");

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link href="/admin/inscripciones" className="text-sm text-brand-forest/60 hover:text-brand-forest">
            ← Inscripciones
          </Link>
          <h1 className="mt-1 flex items-center gap-3 text-2xl font-bold text-brand-forest">
            {r.full_name}
            <AttentionBadge level={r.internal_attention_level} />
          </h1>
          <p className="font-mono text-xs text-brand-forest/50">{r.registration_code}</p>
        </div>
      </header>

      <Card title="Estado de la inscripción">
        <StatusChanger id={r.id} current={r.status} />
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Datos del participante">
          <Field label="Nombre" value={r.full_name} />
          <Field label="Teléfono" value={r.phone_e164} />
          <Field label="Correo" value={r.email} />
          <Field label="Tipo de documento" value={r.document_type ? DOC_LABELS[r.document_type] : "—"} />
          <Field label="Documento" value={r.document_masked} />
          <Field label="Registro" value={fmt(r.created_at)} />
        </Card>

        {r.attends_with_pet && r.pet ? (
          <Card title="Datos de la mascota">
            <Field label="Nombre" value={r.pet.name} />
            <Field label="Raza / mezcla" value={r.pet.breed} />
            <Field label="Tamaño" value={SIZE_LABELS[r.pet.size]} />
            <Field label="Requiere bozal" value={yesNo(r.pet.requires_muzzle)} />
          </Card>
        ) : (
          <Card title="Mascota">
            <p className="text-sm text-brand-forest/50">Asiste sin mascota.</p>
          </Card>
        )}
      </div>

      {r.attends_with_pet && r.pet && (
        <Card title="Comportamiento y salud declarada">
          <div className="mb-3 flex flex-wrap gap-2">
            {(r.pet.behavior_tags ?? []).map((t) => (
              <span key={t} className="rounded-full bg-brand-sky/20 px-3 py-1 text-xs font-medium text-brand-forest">
                {BEHAVIOR_LABELS[t] ?? t}
              </span>
            ))}
          </div>
          <Field label="Observaciones de comportamiento" value={r.pet.behavior_notes} />
          <Field label="Estado de salud" value={r.pet.health_status ? HEALTH_LABELS[r.pet.health_status] : "—"} />
          <Field label="Observaciones de salud" value={r.pet.health_notes} />
        </Card>
      )}

      <Card title="Compromisos y consentimientos">
        <Field label="Compromisos de seguridad" value={yesNo(r.safety_accepted)} />
        <Field label="Tratamiento de datos (operativo)" value={yesNo(r.privacy_accepted)} />
        <Field label="Marketing / futuras actividades" value={yesNo(r.marketing_accepted)} />
        <Field label="Uso de imagen" value={yesNo(r.image_consent_accepted)} />
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Historial de cambios">
          {r.history.length === 0 ? (
            <p className="text-sm text-brand-forest/50">Sin cambios de estado registrados.</p>
          ) : (
            <ul className="space-y-3">
              {r.history.map((h, i) => (
                <li key={i} className="text-sm">
                  <div className="text-brand-forest">
                    {h.previous_status ? `${STATUS_LABELS[h.previous_status]} → ` : ""}
                    <span className="font-semibold">{STATUS_LABELS[h.new_status] ?? h.new_status}</span>
                  </div>
                  {h.reason && <div className="text-brand-forest/60">{h.reason}</div>}
                  <div className="text-xs text-brand-forest/40">{fmt(h.created_at)}</div>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card title="Notas internas">
          <NoteForm id={r.id} />
          {r.notes.length > 0 && (
            <ul className="mt-4 space-y-3">
              {r.notes.map((n) => (
                <li key={n.id} className="rounded-xl bg-brand-ivory p-3 text-sm">
                  <p className="text-brand-forest">{n.note}</p>
                  <p className="mt-1 text-xs text-brand-forest/40">{fmt(n.created_at)}</p>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
