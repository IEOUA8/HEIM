"use client";

import { useState } from "react";
import { eventConfig } from "@/config/event";
import { Logo } from "@/components/brand/Logo";
import { FormModal } from "@/components/form/FormModal";

export default function Home() {
  const [open, setOpen] = useState(false);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-xl flex-col justify-center gap-8 px-6 py-12">
      <div className="flex flex-col items-center gap-5 text-center">
        <Logo size={148} />
        <p className="inline-flex rounded-full bg-brand-lilac/15 px-3 py-1 text-xs font-semibold text-brand-lilac">
          {eventConfig.shortName}
        </p>
      </div>

      <div className="space-y-4">
        <h1 className="text-4xl font-bold leading-tight text-brand-forest text-balance">
          Camina con nosotros por quienes aún esperan un hogar
        </h1>
        <p className="inline-flex items-center gap-2 rounded-full bg-brand-forest px-4 py-2 text-sm font-semibold text-brand-ivory">
          <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden>
            <path
              d="M7 3v3m10-3v3M4 8h16M5 6h14a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Domingo 06 de septiembre de 2026
        </p>
        <p className="text-lg text-brand-forest/75">{eventConfig.purposeText}</p>
      </div>

      <div className="space-y-3">
        <h2 className="text-lg font-bold text-brand-forest">¿Qué incluye tu inscripción?</h2>
        <ul className="space-y-2">
          {eventConfig.includes.map((item) => (
            <li key={item} className="flex items-center gap-3 text-brand-forest/85">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-lime">
                <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 text-brand-forest" aria-hidden>
                  <path d="m5 13 4 4L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      <p className="text-sm text-brand-forest/60">
        Los fondos recaudados serán invertidos en la esterilización de los animales
        albergados en el hogar de paso Ángeles de la Calle.
      </p>

      <div>
        <button
          onClick={() => setOpen(true)}
          className="inline-flex w-full items-center justify-center rounded-full bg-brand-forest px-8 py-4 text-lg font-semibold text-brand-ivory transition-colors hover:bg-brand-forest/90 sm:w-auto"
        >
          Comenzar inscripción
        </button>
      </div>

      <FormModal open={open} onClose={() => setOpen(false)} />
    </main>
  );
}
