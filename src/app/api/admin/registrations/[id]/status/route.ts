import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/supabase/ssr";
import { createServerClient } from "@/lib/supabase/server";
import { isValidStatus } from "@/lib/registration/status";

export const runtime = "nodejs";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getAdminUser();
  if (!user) return NextResponse.json({ error: "No autorizado." }, { status: 401 });

  const { id } = await params;
  const { status, reason } = (await request.json().catch(() => ({}))) as {
    status?: string;
    reason?: string;
  };
  if (!status || !isValidStatus(status)) {
    return NextResponse.json({ error: "Estado inválido." }, { status: 422 });
  }

  const supabase = createServerClient();

  const { data: current, error: readError } = await supabase
    .from("registrations")
    .select("status")
    .eq("id", id)
    .single();
  if (readError || !current) {
    return NextResponse.json({ error: "Inscripción no encontrada." }, { status: 404 });
  }
  if (current.status === status) {
    return NextResponse.json({ ok: true, status });
  }

  const { error: updateError } = await supabase
    .from("registrations")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (updateError) {
    return NextResponse.json({ error: "No se pudo actualizar." }, { status: 500 });
  }

  // Todo cambio manual queda en el historial (§11.5, §22.9).
  await supabase.from("registration_status_history").insert({
    registration_id: id,
    previous_status: current.status,
    new_status: status,
    changed_by: user.id,
    reason: reason || null,
  });

  return NextResponse.json({ ok: true, status });
}
