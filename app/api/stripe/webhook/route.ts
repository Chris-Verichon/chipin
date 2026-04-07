import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { supabase } from "@/lib/supabase";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("[webhook] Signature verification failed:", err);
    return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      default:
        // Ignore unhandled event types
        break;
    }
  } catch (err) {
    console.error(`[webhook] Error handling event ${event.type}:`, err);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

// ============================================================
// checkout.session.completed — contribution OR fundraiser creation
// ============================================================
async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  const { metadata } = session;
  if (!metadata) return;

  // ── Contribution ──────────────────────────────────────────
  if (metadata.type === "contribution") {
    // Only process if payment actually succeeded
    if (session.payment_status !== "paid") return;
    const { cagnotte_id, participant_email, participant_name, amount, message, is_anonymous } = metadata;

    if (!cagnotte_id || !participant_email || !amount) {
      throw new Error("[webhook] Missing required contribution metadata");
    }

    const isAnon = is_anonymous === "true";
    const amountFloat = parseFloat(amount);

    // Insert participation as paid
    const { error: insertError } = await supabase.from("participations").insert({
      cagnotte_id,
      participant_name: isAnon ? "Anonyme" : participant_name,
      participant_email,
      amount: amountFloat,
      message: message || null,
      stripe_payment_intent_id: session.payment_intent as string,
      status: "paid",
      is_anonymous: isAnon,
    });

    if (insertError) {
      // Duplicate = webhook already processed (Stripe retry), safe to ignore
      if (insertError.code === "23505") return;
      throw new Error(`Failed to insert participation: ${insertError.message}`);
    }

    // Increment total_raised on the fundraiser
    const { error: raisedError } = await supabase.rpc("increment_total_raised", {
      cagnotte_id,
      amount_cents: Math.round(amountFloat * 100),
    });

    if (raisedError) {
      console.error("[webhook] Failed to increment total_raised:", raisedError.message);
    }

    return;
  }

  // ── Fundraiser creation ─────────────────────────────────────
  // Only handle sessions created for fundraiser creation (mode: "payment", type: "creation")
  if (!metadata || metadata.type !== "creation") return;

  const { creator_id, title, description, goal, slug } = metadata;

  if (!creator_id || !title || !slug) {
    throw new Error("[webhook] Missing required metadata for fundraiser creation");
  }

  // Insert the fundraiser
  const { data: cagnotte, error: cagnotteError } = await supabase
    .from("cagnottes")
    .insert({
      slug,
      title,
      description: description ?? null,
      goal: goal ? parseFloat(goal) : null,
      creator_id,
      stripe_checkout_session_id: session.id,
      is_active: true,
    })
    .select("id")
    .single();

  if (cagnotteError) {
    // Duplicate = webhook already processed (Stripe retry), safe to ignore
    if (cagnotteError.code === "23505") return;
    throw new Error(`Failed to create fundraiser: ${cagnotteError.message}`);
  }

  // Record the €4.99 creation fee
  const { error: feeError } = await supabase.from("cagnotte_fees").insert({
    creator_id,
    cagnotte_id: cagnotte.id,
    stripe_checkout_session_id: session.id,
    amount: (session.amount_total ?? 499) / 100,
    status: "paid",
  });

  if (feeError) {
    throw new Error(`Failed to record creation fee: ${feeError.message}`);
  }
}
