"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/brand/Logo";

export default function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      router.replace("/admin");
      router.refresh();
    } else {
      setError("Contraseña incorrecta.");
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <form
        onSubmit={submit}
        className="w-full max-w-sm space-y-5 rounded-[28px] bg-white p-8 shadow-[0_24px_60px_-24px_rgba(35,63,53,0.25)]"
      >
        <div className="flex flex-col items-center gap-3 text-center">
          <Logo size={64} />
          <div>
            <h1 className="text-xl font-bold text-brand-forest">Panel administrativo</h1>
            <p className="text-sm text-brand-forest/60">Acceso privado · Caminata HEIM</p>
          </div>
        </div>
        <div className="space-y-1.5">
          <label htmlFor="pw" className="block text-sm font-medium text-brand-forest">
            Contraseña
          </label>
          <input
            id="pw"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border-2 border-brand-forest/15 bg-white px-4 py-3 text-base focus:border-brand-lilac focus:outline-none"
          />
        </div>
        {error && <p className="text-sm text-brand-orange">{error}</p>}
        <button
          type="submit"
          disabled={loading || !password}
          className="w-full rounded-full bg-brand-forest px-6 py-3 font-semibold text-brand-ivory disabled:opacity-50"
        >
          {loading ? "Ingresando…" : "Ingresar"}
        </button>
      </form>
    </main>
  );
}
