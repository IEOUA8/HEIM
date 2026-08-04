import { cn } from "@/lib/cn";

/** Indicador de progreso (§6.2). Combina brand-sky y brand-lime (§5.2). */
export function ProgressIndicator({
  current,
  total,
}: {
  current: number;
  total: number;
}) {
  const pct = Math.round((current / total) * 100);
  return (
    <div className="w-full">
      <div
        className="h-2 w-full overflow-hidden rounded-full bg-brand-sky/30"
        role="progressbar"
        aria-valuenow={current}
        aria-valuemin={0}
        aria-valuemax={total}
        aria-label={`Paso ${current} de ${total}`}
      >
        <div
          className={cn(
            "h-full rounded-full bg-brand-lime transition-[width] duration-300 ease-out",
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
