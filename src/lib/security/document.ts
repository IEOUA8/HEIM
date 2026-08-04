import crypto from "crypto";

/**
 * Cifrado del número de documento (§17). AES-256-GCM con clave de 32 bytes
 * (hex) en DOCUMENT_ENCRYPTION_KEY. Formato almacenado: iv:tag:ciphertext (hex).
 * Solo se usa en servidor.
 */

function getKey(): Buffer {
  const hex = process.env.DOCUMENT_ENCRYPTION_KEY;
  if (!hex || hex.length !== 64) {
    throw new Error("DOCUMENT_ENCRYPTION_KEY debe ser 32 bytes en hex (64 caracteres).");
  }
  return Buffer.from(hex, "hex");
}

export function encryptDocument(plain: string): string {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", getKey(), iv);
  const enc = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return [iv.toString("hex"), tag.toString("hex"), enc.toString("hex")].join(":");
}

export function decryptDocument(stored: string): string {
  const [ivHex, tagHex, dataHex] = stored.split(":");
  const decipher = crypto.createDecipheriv("aes-256-gcm", getKey(), Buffer.from(ivHex, "hex"));
  decipher.setAuthTag(Buffer.from(tagHex, "hex"));
  return decipher.update(Buffer.from(dataHex, "hex")).toString("utf8") + decipher.final("utf8");
}

/** Muestra parcial para el panel: ••••1234 (§4 Paso 4). */
export function maskDocument(plain: string): string {
  const last4 = plain.slice(-4);
  return `••••${last4}`;
}
