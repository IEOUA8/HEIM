import { createBrowserClient } from "@supabase/ssr";

/** Cliente Supabase para el navegador (login del panel, §11.1). */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
