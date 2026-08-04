import { getDashboardMetrics } from "@/lib/admin/data";

export const dynamic = "force-dynamic";

const SIZE_LABELS: Record<string, string> = {
  small: "Pequeño",
  medium: "Mediano",
  large: "Grande",
  giant: "Gigante",
  unknown: "Sin definir",
};

function Kpi({ label, value, accent }: { label: string; value: number; accent?: string }) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-[0_10px_30px_-12px_rgba(35,63,53,0.18)]">
      <p className={`text-3xl font-bold ${accent ?? "text-brand-forest"}`}>{value}</p>
      <p className="mt-1 text-sm text-brand-forest/60">{label}</p>
    </div>
  );
}

export default async function AdminDashboard() {
  const m = await getDashboardMetrics();

  if (!m) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-brand-forest">Resumen</h1>
        <p className="mt-4 text-brand-orange">
          No se pudo conectar con la base de datos. Revisa las variables de Supabase.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold text-brand-forest">Resumen</h1>
        <p className="text-sm text-brand-forest/60">Caminata por los animales · 6 de septiembre 2026</p>
      </header>

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Kpi label="Inscripciones" value={m.total} />
        <Kpi label="Con mascota" value={m.withPet} />
        <Kpi label="Sin mascota" value={m.withoutPet} />
        <Kpi label="Perros registrados" value={m.totalPets} />
        <Kpi label="Atención especial" value={m.attention} accent="text-brand-orange" />
        <Kpi label="Confirmadas" value={m.byStatus["CONFIRMADA"] ?? 0} />
        <Kpi label="Enviadas" value={m.byStatus["ENVIADA"] ?? 0} />
        <Kpi label="En revisión" value={m.byStatus["PENDIENTE_REVISION"] ?? 0} accent="text-brand-orange" />
      </section>

      <section className="rounded-2xl bg-white p-6 shadow-[0_10px_30px_-12px_rgba(35,63,53,0.18)]">
        <h2 className="mb-4 font-semibold text-brand-forest">Distribución por tamaño de mascota</h2>
        {m.totalPets === 0 ? (
          <p className="text-sm text-brand-forest/50">Aún no hay perros registrados.</p>
        ) : (
          <div className="space-y-2">
            {Object.entries(SIZE_LABELS).map(([key, label]) => {
              const count = m.bySize[key] ?? 0;
              const pct = m.totalPets ? Math.round((count / m.totalPets) * 100) : 0;
              return (
                <div key={key} className="flex items-center gap-3">
                  <span className="w-24 shrink-0 text-sm text-brand-forest/70">{label}</span>
                  <div className="h-3 flex-1 overflow-hidden rounded-full bg-brand-sky/20">
                    <div className="h-full rounded-full bg-brand-lilac" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="w-8 shrink-0 text-right text-sm font-medium text-brand-forest">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
