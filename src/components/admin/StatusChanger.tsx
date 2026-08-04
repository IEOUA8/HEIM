"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MANAGEABLE_STATUSES, STATUS_LABELS } from "@/lib/registration/status";
import { StatusBadge } from "./StatusBadge";

export function StatusChanger({ id, current }: { id: string; current: string }) {
  const router = useRouter();
  const [target, setTarget] = useState("");
  const [reason, setReason] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const apply = async () => {
    if (!target) return;
    setSaving(true);
    setError(null);
    const res = await fetch(`/api/admin/registrations/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: target, reason }),
    });
    if (res.ok) {
      setTarget("");
      setReason("");
      router.refresh();
    } else {
      setError("No se pudo cambiar el estado.");
    }
    setSaving(false);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-sm text-brand-forest/60">Estado actual:</span>
        <StatusBadge status={current} />
      </div>
      <div className="flex flex-col gap-2 sm:flex-row">
        <select
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          className="rounded-xl border-2 border-brand-forest/15 bg-white px-3 py-2 text-sm focus:border-brand-lilac focus:outline-none"
        >
          <option value="">Cambiar a…</option>
          {MANAGEABLE_STATUSES.filter((s) => s !== current).map((s) => (
            <option key={s} value={s}>
              {STATUS_LABELS[s]}
            </option>
          ))}
        </select>
        <input
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Motivo (opcional)"
          className="flex-1 rounded-xl border-2 border-brand-forest/15 bg-white px-3 py-2 text-sm focus:border-brand-lilac focus:outline-none"
        />
        <button
          onClick={apply}
          disabled={!target || saving}
          className="rounded-full bg-brand-forest px-5 py-2 text-sm font-semibold text-brand-ivory disabled:opacity-40"
        >
          {saving ? "Guardando…" : "Aplicar"}
        </button>
      </div>
      {error && <p className="text-sm text-brand-orange">{error}</p>}
    </div>
  );
}
