import { createServerClient } from "@/lib/supabase/server";
import { decryptDocument, maskDocument } from "@/lib/security/document";

export type RegistrationRow = {
  id: string;
  registration_code: string;
  status: string;
  full_name: string;
  phone_e164: string;
  email: string | null;
  attends_with_pet: boolean;
  internal_attention_level: string;
  created_at: string;
  pets: { name: string; size: string; requires_muzzle: boolean }[] | null;
};

export async function getDashboardMetrics() {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("registrations")
    .select("attends_with_pet, status, internal_attention_level, pets(size)");

  if (error || !data) return null;

  const total = data.length;
  const withPet = data.filter((r) => r.attends_with_pet).length;
  const attention = data.filter((r) => r.internal_attention_level !== "normal").length;

  const byStatus: Record<string, number> = {};
  const bySize: Record<string, number> = {};
  let totalPets = 0;
  for (const r of data) {
    byStatus[r.status] = (byStatus[r.status] ?? 0) + 1;
    const pets = (r.pets ?? []) as { size: string }[];
    for (const p of pets) {
      totalPets++;
      bySize[p.size] = (bySize[p.size] ?? 0) + 1;
    }
  }

  return {
    total,
    withPet,
    withoutPet: total - withPet,
    attention,
    totalPets,
    byStatus,
    bySize,
  };
}

export type RegistrationDetail = {
  id: string;
  registration_code: string;
  status: string;
  full_name: string;
  phone_e164: string;
  email: string | null;
  document_type: string | null;
  document_masked: string;
  attends_with_pet: boolean;
  safety_accepted: boolean;
  privacy_accepted: boolean;
  marketing_accepted: boolean;
  image_consent_accepted: boolean;
  internal_attention_level: string;
  created_at: string;
  submitted_at: string | null;
  pet: {
    name: string;
    breed: string | null;
    size: string;
    behavior_tags: string[] | null;
    behavior_notes: string | null;
    health_status: string | null;
    health_notes: string | null;
    requires_muzzle: boolean;
  } | null;
  history: {
    previous_status: string | null;
    new_status: string;
    reason: string | null;
    created_at: string;
  }[];
  notes: { id: string; note: string; created_at: string }[];
};

export async function getRegistrationDetail(id: string): Promise<RegistrationDetail | null> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("registrations")
    .select(
      "*, pets(name, breed, size, behavior_tags, behavior_notes, health_status, health_notes, requires_muzzle), registration_status_history(previous_status, new_status, reason, created_at), registration_notes(id, note, created_at)",
    )
    .eq("id", id)
    .single();

  if (error || !data) return null;

  // Documento cifrado → mostrar solo enmascarado en el panel (§4, §17).
  let masked = "—";
  try {
    if (data.document_number_encrypted) {
      masked = maskDocument(decryptDocument(data.document_number_encrypted));
    }
  } catch {
    masked = "—";
  }

  const history = (data.registration_status_history ?? []).sort(
    (a: { created_at: string }, b: { created_at: string }) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );
  const notes = (data.registration_notes ?? []).sort(
    (a: { created_at: string }, b: { created_at: string }) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );

  return {
    id: data.id,
    registration_code: data.registration_code,
    status: data.status,
    full_name: data.full_name,
    phone_e164: data.phone_e164,
    email: data.email,
    document_type: data.document_type,
    document_masked: masked,
    attends_with_pet: data.attends_with_pet,
    safety_accepted: data.safety_accepted,
    privacy_accepted: data.privacy_accepted,
    marketing_accepted: data.marketing_accepted,
    image_consent_accepted: data.image_consent_accepted,
    internal_attention_level: data.internal_attention_level,
    created_at: data.created_at,
    submitted_at: data.submitted_at,
    pet: data.pets?.[0] ?? null,
    history,
    notes,
  };
}

export type RegistrationFilters = {
  q?: string;
  status?: string;
  pet?: "with" | "without";
  size?: string;
  attention?: string;
};

export async function getRegistrations(filters: RegistrationFilters = {}): Promise<RegistrationRow[]> {
  const supabase = createServerClient();
  let query = supabase
    .from("registrations")
    .select(
      "id, registration_code, status, full_name, phone_e164, email, attends_with_pet, internal_attention_level, created_at, pets(name, size, requires_muzzle)",
    )
    .order("created_at", { ascending: false });

  if (filters.q) {
    const q = filters.q.replace(/[%,]/g, "");
    query = query.or(
      `full_name.ilike.%${q}%,phone_e164.ilike.%${q}%,email.ilike.%${q}%,registration_code.ilike.%${q}%`,
    );
  }
  if (filters.status) query = query.eq("status", filters.status);
  if (filters.pet === "with") query = query.eq("attends_with_pet", true);
  if (filters.pet === "without") query = query.eq("attends_with_pet", false);
  if (filters.attention) query = query.eq("internal_attention_level", filters.attention);

  const { data, error } = await query;
  if (error || !data) return [];

  let rows = data as RegistrationRow[];
  // El tamaño vive en la mascota: se filtra en memoria (dataset acotado por evento).
  if (filters.size) rows = rows.filter((r) => r.pets?.some((p) => p.size === filters.size));
  return rows;
}

/** Fila completa para exportación (§20), con documento descifrado y enmascarado. */
export type ExportRow = {
  registration_code: string;
  created_at: string;
  status: string;
  full_name: string;
  phone_e164: string;
  email: string | null;
  document_type: string | null;
  document_masked: string;
  attends_with_pet: boolean;
  pet_name: string;
  pet_breed: string;
  pet_size: string;
  behavior: string;
  requires_muzzle: boolean;
  behavior_notes: string;
  health_status: string;
  safety_accepted: boolean;
  privacy_accepted: boolean;
  marketing_accepted: boolean;
  image_consent_accepted: boolean;
  internal_attention_level: string;
};

export async function getRegistrationsForExport(
  filters: RegistrationFilters = {},
): Promise<ExportRow[]> {
  const supabase = createServerClient();
  let query = supabase
    .from("registrations")
    .select(
      "*, pets(name, breed, size, behavior_tags, behavior_notes, health_status, requires_muzzle)",
    )
    .order("created_at", { ascending: false });

  if (filters.q) {
    const q = filters.q.replace(/[%,]/g, "");
    query = query.or(
      `full_name.ilike.%${q}%,phone_e164.ilike.%${q}%,email.ilike.%${q}%,registration_code.ilike.%${q}%`,
    );
  }
  if (filters.status) query = query.eq("status", filters.status);
  if (filters.pet === "with") query = query.eq("attends_with_pet", true);
  if (filters.pet === "without") query = query.eq("attends_with_pet", false);
  if (filters.attention) query = query.eq("internal_attention_level", filters.attention);

  const { data, error } = await query;
  if (error || !data) return [];

  let rows = data as Record<string, unknown>[];
  if (filters.size) {
    rows = rows.filter((r) =>
      ((r.pets as { size: string }[]) ?? []).some((p) => p.size === filters.size),
    );
  }

  return rows.map((r) => {
    const pet = ((r.pets as Record<string, unknown>[]) ?? [])[0];
    let masked = "—";
    try {
      if (r.document_number_encrypted) {
        masked = maskDocument(decryptDocument(r.document_number_encrypted as string));
      }
    } catch {
      masked = "—";
    }
    return {
      registration_code: r.registration_code as string,
      created_at: r.created_at as string,
      status: r.status as string,
      full_name: r.full_name as string,
      phone_e164: r.phone_e164 as string,
      email: (r.email as string) ?? "",
      document_type: (r.document_type as string) ?? "",
      document_masked: masked,
      attends_with_pet: r.attends_with_pet as boolean,
      pet_name: (pet?.name as string) ?? "",
      pet_breed: (pet?.breed as string) ?? "",
      pet_size: (pet?.size as string) ?? "",
      behavior: ((pet?.behavior_tags as string[]) ?? []).join("; "),
      requires_muzzle: (pet?.requires_muzzle as boolean) ?? false,
      behavior_notes: (pet?.behavior_notes as string) ?? "",
      health_status: (pet?.health_status as string) ?? "",
      safety_accepted: r.safety_accepted as boolean,
      privacy_accepted: r.privacy_accepted as boolean,
      marketing_accepted: r.marketing_accepted as boolean,
      image_consent_accepted: r.image_consent_accepted as boolean,
      internal_attention_level: r.internal_attention_level as string,
    };
  });
}

/** Detecta una inscripción activa con el mismo teléfono (§8, evita duplicados). */
export async function findActiveByPhone(phone: string): Promise<{ code: string } | null> {
  const supabase = createServerClient();
  const { data } = await supabase
    .from("registrations")
    .select("registration_code, status")
    .eq("phone_e164", phone)
    .neq("status", "CANCELADA")
    .limit(1)
    .maybeSingle();
  return data ? { code: data.registration_code } : null;
}
