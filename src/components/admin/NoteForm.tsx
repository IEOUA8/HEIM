"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function NoteForm({ id }: { id: string }) {
  const router = useRouter();
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    if (!note.trim()) return;
    setSaving(true);
    const res = await fetch(`/api/admin/registrations/${id}/notes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ note }),
    });
    if (res.ok) {
      setNote("");
      router.refresh();
    }
    setSaving(false);
  };

  return (
    <div className="space-y-2">
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        rows={3}
        placeholder="Agregar una nota interna…"
        maxLength={1000}
        className="w-full resize-none rounded-xl border-2 border-brand-forest/15 bg-white px-3 py-2 text-sm focus:border-brand-lilac focus:outline-none"
      />
      <button
        onClick={submit}
        disabled={!note.trim() || saving}
        className="rounded-full bg-brand-forest px-5 py-2 text-sm font-semibold text-brand-ivory disabled:opacity-40"
      >
        {saving ? "Guardando…" : "Agregar nota"}
      </button>
    </div>
  );
}
