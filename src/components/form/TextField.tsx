import { useId } from "react";
import { cn } from "@/lib/cn";

/**
 * Campo de texto accesible (§18): label asociado, error vinculado con
 * aria-describedby, teclado adecuado según inputMode.
 */
export function TextField({
  label,
  value,
  onChange,
  help,
  error,
  type = "text",
  inputMode,
  autoComplete,
  placeholder,
  maxLength,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  help?: string;
  error?: string;
  type?: React.HTMLInputTypeAttribute;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  autoComplete?: string;
  placeholder?: string;
  maxLength?: number;
}) {
  const id = useId();
  const helpId = `${id}-help`;
  const errorId = `${id}-error`;

  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-brand-forest">
        {label}
      </label>
      <input
        id={id}
        type={type}
        inputMode={inputMode}
        autoComplete={autoComplete}
        placeholder={placeholder}
        maxLength={maxLength}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={!!error}
        aria-describedby={cn(error && errorId, help && helpId) || undefined}
        className={cn(
          "w-full rounded-xl border-2 bg-white px-4 py-3 text-base text-brand-forest",
          "placeholder:text-brand-forest/35 focus:outline-none",
          error
            ? "border-brand-orange focus:border-brand-orange"
            : "border-brand-forest/15 focus:border-brand-lilac",
        )}
      />
      {help && !error && (
        <p id={helpId} className="text-sm text-brand-forest/60">
          {help}
        </p>
      )}
      {error && (
        <p id={errorId} className="flex items-center gap-1.5 text-sm text-brand-orange">
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 shrink-0" aria-hidden>
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm1-11a1 1 0 1 0-2 0v4a1 1 0 1 0 2 0V7Zm-1 7.5a1.1 1.1 0 1 0 0-2.2 1.1 1.1 0 0 0 0 2.2Z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}
