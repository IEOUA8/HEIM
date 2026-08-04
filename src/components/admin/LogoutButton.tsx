"use client";

import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();
  return (
    <button
      onClick={async () => {
        await fetch("/api/admin/logout", { method: "POST" });
        router.replace("/admin/login");
        router.refresh();
      }}
      className="text-sm font-medium text-brand-ivory/70 hover:text-brand-ivory"
    >
      Cerrar sesión
    </button>
  );
}
