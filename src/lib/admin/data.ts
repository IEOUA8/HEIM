import { createServerClient } from "@/lib/supabase/server";

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

export async function getRegistrations(): Promise<RegistrationRow[]> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("registrations")
    .select(
      "id, registration_code, status, full_name, phone_e164, email, attends_with_pet, internal_attention_level, created_at, pets(name, size, requires_muzzle)",
    )
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return data as RegistrationRow[];
}
