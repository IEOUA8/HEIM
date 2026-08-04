import { getAdminUser } from "@/lib/supabase/ssr";
import { getRegistrationsForExport, type RegistrationFilters } from "@/lib/admin/data";
import { STATUS_LABELS } from "@/lib/registration/status";

export const runtime = "nodejs";

const SIZE_LABELS: Record<string, string> = {
  small: "Pequeño",
  medium: "Mediano",
  large: "Grande",
  giant: "Gigante",
  unknown: "Sin definir",
};

function csvCell(value: string | boolean | null): string {
  const s = typeof value === "boolean" ? (value ? "Sí" : "No") : (value ?? "");
  // Escapar comillas y envolver siempre para soportar comas y saltos de línea.
  return `"${String(s).replace(/"/g, '""')}"`;
}

export async function GET(request: Request) {
  const user = await getAdminUser();
  if (!user) return new Response("No autorizado", { status: 401 });

  const url = new URL(request.url);
  const filters: RegistrationFilters = {
    q: url.searchParams.get("q") ?? undefined,
    status: url.searchParams.get("status") ?? undefined,
    pet: (url.searchParams.get("pet") as "with" | "without" | null) ?? undefined,
    size: url.searchParams.get("size") ?? undefined,
    attention: url.searchParams.get("attention") ?? undefined,
  };

  const rows = await getRegistrationsForExport(filters);

  const headers = [
    "Código", "Fecha de registro", "Estado", "Nombre", "Teléfono", "Correo",
    "Tipo de documento", "Documento", "Participa con mascota", "Mascota", "Raza",
    "Tamaño", "Comportamiento", "Requiere bozal", "Observaciones", "Estado de salud",
    "Seguridad", "Tratamiento de datos", "Marketing", "Uso de imagen", "Nivel de atención",
  ];

  const lines = [headers.map(csvCell).join(",")];
  for (const r of rows) {
    lines.push(
      [
        r.registration_code,
        new Date(r.created_at).toLocaleString("es-CO"),
        STATUS_LABELS[r.status] ?? r.status,
        r.full_name,
        r.phone_e164,
        r.email,
        r.document_type,
        r.document_masked,
        r.attends_with_pet,
        r.pet_name,
        r.pet_breed,
        SIZE_LABELS[r.pet_size] ?? r.pet_size,
        r.behavior,
        r.requires_muzzle,
        r.behavior_notes,
        r.health_status,
        r.safety_accepted,
        r.privacy_accepted,
        r.marketing_accepted,
        r.image_consent_accepted,
        r.internal_attention_level,
      ].map(csvCell).join(","),
    );
  }

  // BOM UTF-8 para que Excel muestre bien las tildes.
  const csv = "﻿" + lines.join("\r\n");
  const date = new Date().toISOString().slice(0, 10);

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="inscripciones-heim-${date}.csv"`,
    },
  });
}
