import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { stripe, CREATION_FEE_AMOUNT } from "@/lib/stripe";
import { supabase } from "@/lib/supabase";
import { nanoid } from "nanoid";

// POST /api/stripe/creation-checkout
// Creates a Stripe Checkout Session for the €4.99 fundraiser creation fee.
// On payment success, the webhook (checkout.session.completed) creates the actual fundraiser in DB.
export async function POST(req: NextRequest) {
  const session = await getServerSession();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Only creators (and admins) can create fundraisers
  if (session.user.role !== "creator" && session.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const { title, description, goal } = body;

  if (!title || typeof title !== "string" || title.trim().length < 3) {
    return NextResponse.json({ error: "Title must be at least 3 characters" }, { status: 400 });
  }

  // Generate a unique slug from the title
  const baseSlug = title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);

  const slug = `${baseSlug}-${nanoid(6)}`;

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  // ── Admin bypass: create cagnotte directly, no payment required ──
  if (session.user.role === "admin") {
    const { error: cagnotteError } = await supabase
      .from("cagnottes")
      .insert({
        slug,
        title: title.trim(),
        description: description?.trim() ?? null,
        goal: goal ? parseFloat(goal) : null,
        creator_id: session.user.id,
        is_active: true,
      });

    if (cagnotteError) {
      return NextResponse.json({ error: cagnotteError.message }, { status: 500 });
    }

    return NextResponse.json({ url: `${appUrl}/dashboard?creation=success` });
  }

  // ── Creator: Stripe Checkout Session for €4.99 ──
  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "eur",
          unit_amount: CREATION_FEE_AMOUNT,
          product_data: {
            name: "Fundraiser creation",
            description: `Create "${title.trim()}"`,
          },
        },
        quantity: 1,
      },
    ],
    // Pass fundraiser data as metadata — recovered by the webhook
    metadata: {
      type: "creation",
      creator_id: session.user.id,
      title: title.trim(),
      description: description?.trim() ?? "",
      goal: goal ? String(goal) : "",
      slug,
    },
    success_url: `${appUrl}/dashboard?creation=success`,
    cancel_url: `${appUrl}/dashboard?creation=cancelled`,
  });

  return NextResponse.json({ url: checkoutSession.url });
}
