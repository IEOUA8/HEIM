/** Encabezado de cada paso (§6.2): sección, pregunta principal y ayuda. */
export function StepHeader({
  eyebrow,
  title,
  help,
}: {
  eyebrow?: string;
  title: string;
  help?: string;
}) {
  return (
    <header className="space-y-2">
      {eyebrow && (
        <p className="text-xs font-semibold uppercase tracking-wide text-brand-lilac">
          {eyebrow}
        </p>
      )}
      <h2 className="text-2xl font-bold leading-snug text-brand-forest text-balance">
        {title}
      </h2>
      {help && <p className="text-sm text-brand-forest/70">{help}</p>}
    </header>
  );
}
