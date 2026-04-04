import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

// PATCH /api/cagnotte/[id]/toggle
// Toggles is_active on a cagnotte. Only the owner (or admin) can toggle.
export async function PATCH(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  // Fetch current state — also validates ownership
  const { data: cagnotte, error: fetchError } = await supabase
    .from("cagnottes")
    .select("id, is_active, creator_id")
    .eq("id", id)
    .single();

  if (fetchError || !cagnotte) {
    return NextResponse.json({ error: "Fundraiser not found" }, { status: 404 });
  }

  // Only owner or admin can toggle
  if (session.user.role !== "admin" && cagnotte.creator_id !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { data: updated, error: updateError } = await supabase
    .from("cagnottes")
    .update({ is_active: !cagnotte.is_active })
    .eq("id", id)
    .select("id, is_active")
    .single();

  if (updateError) {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }

  return NextResponse.json({ is_active: updated.is_active });
}
