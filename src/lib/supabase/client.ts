import { createClient } from "@supabase/supabase-js";

/**
 * Cliente de Supabase para el navegador (§14 Backend y datos).
 *
 * Requiere las variables de entorno en `.env.local` (ver `.env.example`).
 * Mientras no existan, `isSupabaseConfigured` permite que la app arranque en
 * modo demostración sin romper.
 */

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(url && anonKey);

export const supabase = isSupabaseConfigured
  ? createClient(url!, anonKey!)
  : null;
