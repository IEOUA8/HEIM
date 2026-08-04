import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/supabase/ssr";
import { createServerClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getAdminUser();
  if (!user) return NextResponse.json({ error: "No autorizado." }, { status: 401 });

  const { id } = await params;
  const { note } = (await request.json().catch(() => ({}))) as { note?: string };
  if (!note || note.trim().length === 0) {
    return NextResponse.json({ error: "La nota está vacía." }, { status: 422 });
  }

  const supabase = createServerClient();
  const { error } = await supabase.from("registration_notes").insert({
    registration_id: id,
    author_user_id: user.id,
    note: note.trim().slice(0, 1000),
  });
  if (error) {
    return NextResponse.json({ error: "No se pudo guardar la nota." }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
