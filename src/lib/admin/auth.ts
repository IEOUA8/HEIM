/**
 * Autenticación mínima del panel admin (§11.1) mediante cookie firmada.
 * Etapa inicial con contraseña compartida (ADMIN_PASSWORD); la migración a
 * Supabase Auth con roles queda pendiente (ver README). Usa Web Crypto para
 * funcionar tanto en el runtime edge (middleware) como en Node (route handlers).
 */

export const ADMIN_COOKIE = "heim_admin";
const SESSION_TTL_MS = 1000 * 60 * 60 * 12; // 12 h

function toHex(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function hmac(payload: string): Promise<string> {
  const secret = process.env.ADMIN_AUTH_SECRET;
  if (!secret) throw new Error("Falta ADMIN_AUTH_SECRET.");
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
  return toHex(sig);
}

export async function signSession(): Promise<string> {
  const payload = `admin:${Date.now()}`;
  return `${payload}.${await hmac(payload)}`;
}

export async function verifySession(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  const idx = token.lastIndexOf(".");
  if (idx < 0) return false;
  const payload = token.slice(0, idx);
  const sig = token.slice(idx + 1);
  if ((await hmac(payload)) !== sig) return false;
  const issuedAt = Number(payload.split(":")[1]);
  return Number.isFinite(issuedAt) && Date.now() - issuedAt < SESSION_TTL_MS;
}
