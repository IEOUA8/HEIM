/** Código único de inscripción: HEIM-2026-000184 (§7 Paso 13). */
export function generateRegistrationCode(year = new Date().getFullYear()): string {
  const serial = String(Math.floor(Math.random() * 900000) + 100000);
  return `HEIM-${year}-${serial}`;
}

/** Nivel de atención derivado del comportamiento (§8). */
export function deriveAttentionLevel(tags: string[]): "normal" | "medium" | "high" {
  if (tags.some((t) => ["muzzle", "reactive_dogs", "reactive_people"].includes(t))) {
    return "high";
  }
  if (tags.includes("needs_space") || tags.includes("wants_to_talk")) {
    return "medium";
  }
  return "normal";
}
