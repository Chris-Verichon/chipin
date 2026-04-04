import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { supabase } from "@/lib/supabase";
import Stripe from "stripe";

// Stripe requires the raw body to verify webhook signature
export const config = { api: { bodyParser: false } };

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
      case "payment_intent.succeeded":
        await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent);
        break;

      case "payment_intent.payment_failed":
        await handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent);
        break;

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
// payment_intent.succeeded — mark participation as paid
// ============================================================
async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  // Fetch the participation to get cagnotte_id and amount
  const { data: participation, error: fetchError } = await supabase
    .from("participations")
    .select("id, cagnotte_id, amount")
    .eq("stripe_payment_intent_id", paymentIntent.id)
    .single();

  if (fetchError || !participation) {
    throw new Error(`Failed to fetch participation: ${fetchError?.message}`);
  }

  // Mark participation as paid
  const { error: updateError } = await supabase
    .from("participations")
    .update({ status: "paid" })
    .eq("id", participation.id);

  if (updateError) {
    throw new Error(`Failed to mark participation as paid: ${updateError.message}`);
  }

  // Increment total_raised on the fundraiser (amount stored in cents)
  const amountCents = Math.round(participation.amount * 100);
  const { error: raisedError } = await supabase.rpc("increment_total_raised", {
    cagnotte_id: participation.cagnotte_id,
    amount_cents: amountCents,
  });

  if (raisedError) {
    // Non-fatal: log but don't fail the webhook
    console.error("[webhook] Failed to increment total_raised:", raisedError.message);
  }
}

// ============================================================
// payment_intent.payment_failed — mark participation as failed
// ============================================================
async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
  const { error } = await supabase
    .from("participations")
    .update({ status: "failed" })
    .eq("stripe_payment_intent_id", paymentIntent.id);

  if (error) {
    throw new Error(`Failed to mark participation as failed: ${error.message}`);
  }
}

// ============================================================
// checkout.session.completed — create fundraiser + fee record
// ============================================================
async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  const { metadata } = session;

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
