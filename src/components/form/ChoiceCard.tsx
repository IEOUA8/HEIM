import { cn } from "@/lib/cn";

/**
 * Tarjeta seleccionable (§7 Pasos 1, 7, 8). Soporta selección simple y múltiple.
 * Estado seleccionado con relleno suave brand-lilac (§5.2) + icono, no solo color (§5.3).
 */
export function ChoiceCard({
  selected,
  onSelect,
  title,
  description,
  icon,
  multiple = false,
}: {
  selected: boolean;
  onSelect: () => void;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  multiple?: boolean;
}) {
  return (
    <button
      type="button"
      role={multiple ? "checkbox" : "radio"}
      aria-checked={selected}
      onClick={onSelect}
      className={cn(
        "flex w-full items-start gap-3 rounded-2xl border-2 p-4 text-left transition-colors duration-200",
        "min-h-[44px]", // objetivo táctil mínimo (§5.3)
        selected
          ? "border-brand-lilac bg-brand-lilac/10"
          : "border-brand-forest/12 bg-white hover:border-brand-forest/30",
      )}
    >
      {icon && <span className="mt-0.5 shrink-0 text-brand-forest">{icon}</span>}
      <span className="flex-1">
        <span className="block font-semibold text-brand-forest">{title}</span>
        {description && (
          <span className="mt-0.5 block text-sm text-brand-forest/70">
            {description}
          </span>
        )}
      </span>
      <span
        aria-hidden
        className={cn(
          "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center border-2 text-white",
          multiple ? "rounded-md" : "rounded-full",
          selected
            ? "border-brand-lilac bg-brand-lilac"
            : "border-brand-forest/25 bg-transparent",
        )}
      >
        {selected && (
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
            <path
              fillRule="evenodd"
              d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.3 3.29 6.8-6.8a1 1 0 0 1 1.4 0Z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </span>
    </button>
  );
}
