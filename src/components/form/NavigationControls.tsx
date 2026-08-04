import { cn } from "@/lib/cn";

/**
 * Controles de navegación (§6.1): botón primario "Siguiente" de ancho completo
 * en móvil y enlace "Volver" a partir del segundo paso.
 * El avance solo se habilita cuando la respuesta actual es válida.
 */
export function NavigationControls({
  onNext,
  onBack,
  canGoBack,
  canGoNext,
  nextLabel = "Siguiente",
  isSubmitting = false,
}: {
  onNext: () => void;
  onBack?: () => void;
  canGoBack: boolean;
  canGoNext: boolean;
  nextLabel?: string;
  isSubmitting?: boolean;
}) {
  return (
    <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
      {canGoBack ? (
        <button
          type="button"
          onClick={onBack}
          className="text-sm font-medium text-brand-forest/70 underline-offset-4 hover:text-brand-forest hover:underline"
        >
          ← Volver
        </button>
      ) : (
        <span className="hidden sm:block" />
      )}

      <button
        type="button"
        onClick={onNext}
        disabled={!canGoNext || isSubmitting}
        className={cn(
          "inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3 text-base font-semibold sm:w-auto",
          "min-h-[44px] transition-colors duration-200",
          canGoNext && !isSubmitting
            ? "bg-brand-forest text-brand-ivory hover:bg-brand-forest/90"
            : "cursor-not-allowed bg-brand-forest/30 text-white/80",
        )}
      >
        {isSubmitting && (
          <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden>
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4Z" />
          </svg>
        )}
        {isSubmitting ? "Guardando tu inscripción…" : nextLabel}
      </button>
    </div>
  );
}
