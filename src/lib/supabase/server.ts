import { createClient } from "@supabase/supabase-js";

/**
 * Cliente Supabase de servidor con la clave `service_role`.
 * SOLO debe importarse en código de servidor (route handlers, server
 * components, server actions). Nunca en el cliente: la service_role omite RLS.
 */
export function createServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error("Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY.");
  }
  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
