import Link from "next/link";
import { getRegistrations } from "@/lib/admin/data";
import { STATUS_LABELS } from "@/lib/registration/status";
import { PrintButton } from "@/components/admin/PrintButton";

export const dynamic = "force-dynamic";

const SIZE_LABELS: Record<string, string> = {
  small: "Pequeño",
  medium: "Mediano",
  large: "Grande",
  giant: "Gigante",
  unknown: "—",
};

function fmt(iso: string) {
  return new Date(iso).toLocaleDateString("es-CO", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export default async function PrintRegistrations() {
  const rows = await getRegistrations();
  const withPet = rows.filter((r) => r.attends_with_pet).length;

  return (
    <div className="mx-auto max-w-5xl bg-white p-8 text-black print:p-0">
      <div className="mb-4 flex items-center justify-between print:hidden">
        <Link href="/admin/inscripciones" className="text-sm text-brand-forest/60 hover:text-brand-forest">
          ← Volver
        </Link>
        <PrintButton />
      </div>

      {/* Encabezado del documento */}
      <header className="mb-6 border-b-2 border-brand-forest pb-4">
        <h1 className="text-2xl font-bold text-brand-forest">Caminata por los animales · HEIM</h1>
        <p className="text-sm text-brand-forest/70">
          Lista de inscritos · 6 de septiembre de 2026 · Circasia, Quindío
        </p>
        <p className="mt-1 text-xs text-brand-forest/60">
          Total: {rows.length} inscripciones · {withPet} con mascota · {rows.length - withPet} sin
          mascota · Generado el {fmt(new Date().toISOString())}
        </p>
      </header>

      <table className="w-full border-collapse text-left text-xs">
        <thead>
          <tr className="border-b border-black/40">
            <th className="py-2 pr-2 font-semibold">#</th>
            <th className="py-2 pr-2 font-semibold">Código</th>
            <th className="py-2 pr-2 font-semibold">Participante</th>
            <th className="py-2 pr-2 font-semibold">Teléfono</th>
            <th className="py-2 pr-2 font-semibold">Mascota</th>
            <th className="py-2 pr-2 font-semibold">Tamaño</th>
            <th className="py-2 pr-2 font-semibold">Atención</th>
            <th className="py-2 pr-2 font-semibold">Estado</th>
            <th className="py-2 font-semibold">Asistencia</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => {
            const pet = r.pets?.[0];
            return (
              <tr key={r.id} className="border-b border-black/10">
                <td className="py-1.5 pr-2 text-black/50">{i + 1}</td>
                <td className="py-1.5 pr-2 font-mono">{r.registration_code}</td>
                <td className="py-1.5 pr-2">{r.full_name}</td>
                <td className="py-1.5 pr-2">{r.phone_e164}</td>
                <td className="py-1.5 pr-2">{pet?.name ?? "—"}</td>
                <td className="py-1.5 pr-2">{pet ? SIZE_LABELS[pet.size] : "—"}</td>
                <td className="py-1.5 pr-2">
                  {r.internal_attention_level !== "normal" ? "⚠ " + r.internal_attention_level : "—"}
                </td>
                <td className="py-1.5 pr-2">{STATUS_LABELS[r.status] ?? r.status}</td>
                {/* Casilla para marcar asistencia a mano en la impresión */}
                <td className="py-1.5">☐</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {rows.length === 0 && (
        <p className="py-8 text-center text-black/50">Aún no hay inscripciones.</p>
      )}
    </div>
  );
}
