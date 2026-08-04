"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/browser";

export function LogoutButton() {
  const router = useRouter();
  return (
    <button
      onClick={async () => {
        await createClient().auth.signOut();
        router.replace("/admin/login");
        router.refresh();
      }}
      className="text-sm font-medium text-brand-ivory/70 hover:text-brand-ivory"
    >
      Cerrar sesión
    </button>
  );
}
