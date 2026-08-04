import Link from "next/link";
import { getRegistrations } from "@/lib/admin/data";
import { StatusBadge, AttentionBadge } from "@/components/admin/StatusBadge";

export const dynamic = "force-dynamic";

const SIZE_LABELS: Record<string, string> = {
  small: "Pequeño",
  medium: "Mediano",
  large: "Grande",
  giant: "Gigante",
  unknown: "—",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-CO", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function AdminRegistrations() {
  const rows = await getRegistrations();

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-brand-forest">Inscripciones</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-brand-forest/60">{rows.length} registros</span>
          {rows.length > 0 && (
            <Link
              href="/admin/inscripciones/imprimir"
              className="rounded-full bg-brand-forest px-4 py-2 text-sm font-semibold text-brand-ivory"
            >
              Imprimir / PDF
            </Link>
          )}
        </div>
      </header>

      {rows.length === 0 ? (
        <div className="rounded-2xl bg-white p-8 text-center text-brand-forest/50 shadow-[0_10px_30px_-12px_rgba(35,63,53,0.18)]">
          Aún no hay inscripciones. Cuando alguien complete el formulario aparecerá aquí.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl bg-white shadow-[0_10px_30px_-12px_rgba(35,63,53,0.18)]">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-brand-forest/10 text-xs uppercase tracking-wide text-brand-forest/50">
                <th className="px-4 py-3 font-semibold">Código</th>
                <th className="px-4 py-3 font-semibold">Participante</th>
                <th className="px-4 py-3 font-semibold">Teléfono</th>
                <th className="px-4 py-3 font-semibold">Mascota</th>
                <th className="px-4 py-3 font-semibold">Estado</th>
                <th className="px-4 py-3 font-semibold">Registro</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => {
                const pet = r.pets?.[0];
                return (
                  <tr
                    key={r.id}
                    className="border-b border-brand-forest/5 transition-colors last:border-0 hover:bg-brand-ivory/60"
                  >
                    <td className="px-4 py-3 font-mono text-xs">
                      <Link
                        href={`/admin/inscripciones/${r.id}`}
                        className="text-brand-lilac underline-offset-2 hover:underline"
                      >
                        {r.registration_code}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-brand-forest">{r.full_name}</div>
                      {r.email && <div className="text-xs text-brand-forest/50">{r.email}</div>}
                    </td>
                    <td className="px-4 py-3 text-brand-forest/80">{r.phone_e164}</td>
                    <td className="px-4 py-3">
                      {pet ? (
                        <div className="flex flex-col gap-1">
                          <span className="text-brand-forest">
                            {pet.name}{" "}
                            <span className="text-brand-forest/50">· {SIZE_LABELS[pet.size]}</span>
                          </span>
                          <AttentionBadge level={r.internal_attention_level} />
                        </div>
                      ) : (
                        <span className="text-brand-forest/40">Sin mascota</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={r.status} />
                    </td>
                    <td className="px-4 py-3 text-xs text-brand-forest/60">
                      {formatDate(r.created_at)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
