import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import type { UserRole } from "@/lib/database.types";

// PATCH /api/admin/users/[id]/role
// Body: { role: "admin" | "creator" }
// Admin only.
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession();

  if (!session?.user?.id || session.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const body = await req.json();
  const { role } = body;

  if (role !== "admin" && role !== "creator") {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  }

  // Prevent admin from demoting themselves
  if (id === session.user.id && role !== "admin") {
    return NextResponse.json({ error: "Cannot change your own role" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("users")
    .update({ role: role as UserRole })
    .eq("id", id)
    .select("id, email, role")
    .single();

  if (error) {
    return NextResponse.json({ error: "Failed to update role" }, { status: 500 });
  }

  return NextResponse.json(data);
}
