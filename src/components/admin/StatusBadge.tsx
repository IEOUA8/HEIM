const STYLES: Record<string, string> = {
  ENVIADA: "bg-brand-sky/25 text-brand-forest",
  CONFIRMADA: "bg-brand-lime/40 text-brand-forest",
  PENDIENTE_REVISION: "bg-brand-orange/15 text-brand-orange",
  CANCELADA: "bg-brand-forest/10 text-brand-forest/60",
  ASISTIO: "bg-brand-lime/40 text-brand-forest",
  NO_ASISTIO: "bg-brand-forest/10 text-brand-forest/60",
};

const LABELS: Record<string, string> = {
  ENVIADA: "Enviada",
  CONFIRMADA: "Confirmada",
  PENDIENTE_REVISION: "Revisión",
  CANCELADA: "Cancelada",
  ASISTIO: "Asistió",
  NO_ASISTIO: "No asistió",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${STYLES[status] ?? "bg-brand-forest/10 text-brand-forest/70"}`}
    >
      {LABELS[status] ?? status}
    </span>
  );
}

const ATTENTION_LABELS: Record<string, string> = {
  medium: "Atención media",
  high: "Atención alta",
};

export function AttentionBadge({ level }: { level: string }) {
  if (level === "normal") return null;
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-brand-orange/15 px-2 py-0.5 text-xs font-semibold text-brand-orange">
      ⚠ {ATTENTION_LABELS[level] ?? level}
    </span>
  );
}
