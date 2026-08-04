"use client";

export function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="rounded-full bg-brand-forest px-5 py-2 text-sm font-semibold text-brand-ivory print:hidden"
    >
      Imprimir / Guardar PDF
    </button>
  );
}
