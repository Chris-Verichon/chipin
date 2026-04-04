import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { supabase } from "@/lib/supabase";

// POST /api/stripe/checkout
// Creates a Stripe PaymentIntent for a contribution, and saves a pending participation row
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { cagnotte_id, participant_name, participant_email, amount, message, is_anonymous } = body;

  // email and amount are always required
  // participant_name is only required when not anonymous
  if (!cagnotte_id || !participant_email || !amount) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  if (!is_anonymous && !participant_name) {
    return NextResponse.json({ error: "Name is required unless anonymous" }, { status: 400 });
  }

  const amountInCents = Math.round(parseFloat(amount) * 100);
  if (amountInCents < 100) {
    return NextResponse.json({ error: "Minimum contribution is €1.00" }, { status: 400 });
  }

  // Verify the fundraiser exists and is active
  const { data: cagnotte, error: cagnotteError } = await supabase
    .from("cagnottes")
    .select("id, title")
    .eq("id", cagnotte_id)
    .eq("is_active", true)
    .single();

  if (cagnotteError || !cagnotte) {
    return NextResponse.json({ error: "Fundraiser not found or inactive" }, { status: 404 });
  }

  // Create Stripe PaymentIntent
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amountInCents,
    currency: "eur",
    description: `Contribution to "${cagnotte.title}"`,
    metadata: {
      cagnotte_id,
      participant_email,
    },
  });

  // Save pending participation row in Supabase
  const { error: insertError } = await supabase.from("participations").insert({
    cagnotte_id,
    participant_name: is_anonymous ? "Anonyme" : participant_name,
    participant_email,
    amount: parseFloat(amount),
    message: message ?? null,
    stripe_payment_intent_id: paymentIntent.id,
    status: "pending",
    is_anonymous: !!is_anonymous,
  });

  if (insertError) {
    console.error("[checkout] Failed to insert participation:", insertError.message);
    return NextResponse.json({ error: "Failed to create participation" }, { status: 500 });
  }

  return NextResponse.json({ clientSecret: paymentIntent.client_secret });
}
