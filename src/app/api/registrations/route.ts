import { NextResponse } from "next/server";
import { z } from "zod";
import { createServerClient } from "@/lib/supabase/server";
import { encryptDocument } from "@/lib/security/document";
import { generateRegistrationCode, deriveAttentionLevel } from "@/lib/registration/code";
import { eventConfig } from "@/config/event";

export const runtime = "nodejs";

// Validación de servidor (§13). Refleja el estado del formulario (§16).
const payloadSchema = z.object({
  attendsWithPet: z.boolean(),
  participant: z.object({
    fullName: z.string().trim().min(3).max(100),
    phone: z.string().trim().min(6).max(20),
    email: z.string().trim().email().optional().or(z.literal("")),
    documentType: z.enum(["cc", "ce", "passport", "other"]),
    documentNumber: z.string().trim().min(4).max(30),
  }),
  pet: z
    .object({
      name: z.string().trim().min(1).max(60),
      breed: z.string().trim().max(80).optional(),
      size: z.enum(["small", "medium", "large", "giant", "unknown"]),
      behaviorTags: z.array(z.string()),
      behaviorNotes: z.string().trim().max(300).optional(),
      healthStatus: z.enum(["healthy", "observation"]),
      healthNotes: z.string().trim().max(300).optional(),
    })
    .optional(),
  consents: z.object({
    safety: z.literal(true),
    privacy: z.literal(true),
    marketing: z.boolean(),
    imageUse: z.boolean(),
  }),
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Cuerpo inválido." }, { status: 400 });
  }

  const parsed = payloadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Datos incompletos o inválidos.", issues: parsed.error.flatten() },
      { status: 422 },
    );
  }
  const data = parsed.data;

  try {
    const supabase = createServerClient();

    // Evento asociado (§22.1).
    const { data: event, error: eventError } = await supabase
      .from("events")
      .select("id")
      .eq("slug", eventConfig.slug)
      .single();
    if (eventError || !event) {
      return NextResponse.json({ error: "Evento no encontrado." }, { status: 404 });
    }

    const code = generateRegistrationCode();
    const attention = data.pet ? deriveAttentionLevel(data.pet.behaviorTags) : "normal";

    const { data: registration, error: regError } = await supabase
      .from("registrations")
      .insert({
        event_id: event.id,
        registration_code: code,
        status: attention === "high" ? "PENDIENTE_REVISION" : "ENVIADA",
        full_name: data.participant.fullName,
        phone_e164: data.participant.phone,
        email: data.participant.email || null,
        document_type: data.participant.documentType,
        document_number_encrypted: encryptDocument(data.participant.documentNumber),
        attends_with_pet: data.attendsWithPet,
        safety_accepted: data.consents.safety,
        privacy_accepted: data.consents.privacy,
        marketing_accepted: data.consents.marketing,
        image_consent_accepted: data.consents.imageUse,
        internal_attention_level: attention,
        submitted_at: new Date().toISOString(),
      })
      .select("id, registration_code")
      .single();

    if (regError || !registration) {
      console.error("registration insert failed", regError?.message);
      return NextResponse.json({ error: "No pudimos guardar tu inscripción." }, { status: 500 });
    }

    if (data.attendsWithPet && data.pet) {
      const { error: petError } = await supabase.from("pets").insert({
        registration_id: registration.id,
        name: data.pet.name,
        breed: data.pet.breed || null,
        size: data.pet.size,
        behavior_tags: data.pet.behaviorTags,
        behavior_notes: data.pet.behaviorNotes || null,
        health_status: data.pet.healthStatus,
        health_notes: data.pet.healthNotes || null,
        requires_muzzle: data.pet.behaviorTags.includes("muzzle"),
        requires_review: attention === "high",
      });
      if (petError) console.error("pet insert failed", petError.message);
    }

    return NextResponse.json({ code: registration.registration_code }, { status: 201 });
  } catch (err) {
    console.error("registration error", err);
    return NextResponse.json({ error: "Error del servidor." }, { status: 500 });
  }
}
