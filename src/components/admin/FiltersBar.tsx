"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { MANAGEABLE_STATUSES, STATUS_LABELS } from "@/lib/registration/status";

const SIZES = [
  { value: "small", label: "Pequeño" },
  { value: "medium", label: "Mediano" },
  { value: "large", label: "Grande" },
  { value: "giant", label: "Gigante" },
];

const selectClass =
  "rounded-xl border-2 border-brand-forest/15 bg-white px-3 py-2 text-sm text-brand-forest focus:border-brand-lilac focus:outline-none";

export function FiltersBar() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [q, setQ] = useState(params.get("q") ?? "");
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  const setParam = useCallback(
    (key: string, value: string) => {
      const next = new URLSearchParams(params.toString());
      if (value) next.set(key, value);
      else next.delete(key);
      router.push(`${pathname}?${next.toString()}`);
    },
    [params, pathname, router],
  );

  // Búsqueda con debounce (§21).
  useEffect(() => {
    if (debounce.current) clearTimeout(debounce.current);
    debounce.current = setTimeout(() => {
      if ((params.get("q") ?? "") !== q) setParam("q", q);
    }, 350);
    return () => {
      if (debounce.current) clearTimeout(debounce.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  const hasFilters = ["q", "status", "pet", "size", "attention"].some((k) => params.get(k));

  return (
    <div className="flex flex-wrap items-center gap-2">
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Buscar nombre, teléfono, correo o código…"
        className={`${selectClass} min-w-[240px] flex-1`}
      />
      <select
        value={params.get("status") ?? ""}
        onChange={(e) => setParam("status", e.target.value)}
        className={selectClass}
      >
        <option value="">Todos los estados</option>
        {["ENVIADA", ...MANAGEABLE_STATUSES].map((s) => (
          <option key={s} value={s}>
            {STATUS_LABELS[s]}
          </option>
        ))}
      </select>
      <select
        value={params.get("pet") ?? ""}
        onChange={(e) => setParam("pet", e.target.value)}
        className={selectClass}
      >
        <option value="">Con o sin mascota</option>
        <option value="with">Con mascota</option>
        <option value="without">Sin mascota</option>
      </select>
      <select
        value={params.get("size") ?? ""}
        onChange={(e) => setParam("size", e.target.value)}
        className={selectClass}
      >
        <option value="">Todos los tamaños</option>
        {SIZES.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>
      <select
        value={params.get("attention") ?? ""}
        onChange={(e) => setParam("attention", e.target.value)}
        className={selectClass}
      >
        <option value="">Toda atención</option>
        <option value="high">Atención alta</option>
        <option value="medium">Atención media</option>
        <option value="normal">Normal</option>
      </select>
      {hasFilters && (
        <button
          onClick={() => {
            setQ("");
            router.push(pathname);
          }}
          className="text-sm font-medium text-brand-forest/60 underline-offset-2 hover:text-brand-forest hover:underline"
        >
          Limpiar
        </button>
      )}
    </div>
  );
}
