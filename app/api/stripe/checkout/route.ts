import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { supabase } from "@/lib/supabase";

// POST /api/stripe/checkout
// Creates a Stripe Checkout Session for a contribution and returns the hosted URL
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

  // Verify the fundraiser exists and is active — also fetch creator's stripe account
  const { data: cagnotte, error: cagnotteError } = await supabase
    .from("cagnottes")
    .select("id, title, slug, creator_id, users(stripe_account_id)")
    .eq("id", cagnotte_id)
    .eq("is_active", true)
    .single();

  if (cagnotteError || !cagnotte) {
    return NextResponse.json({ error: "Fundraiser not found or inactive" }, { status: 404 });
  }

  // @ts-expect-error — Supabase join type
  const stripeAccountId: string | null = cagnotte.users?.stripe_account_id ?? null;

  const origin = req.headers.get("origin") ?? process.env.NEXTAUTH_URL ?? "http://localhost:3000";

  // Platform fee: configurable via env, default 5%
  const feePercent = parseFloat(process.env.PLATFORM_FEE_PERCENT ?? "5") / 100;
  const applicationFeeAmount = Math.round(amountInCents * feePercent);

  // Build Stripe Checkout Session params
  const sessionParams: Parameters<typeof stripe.checkout.sessions.create>[0] = {
    mode: "payment",
    customer_email: participant_email,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "eur",
          unit_amount: amountInCents,
          product_data: {
            name: `Contribution à « ${cagnotte.title} »`,
          },
        },
      },
    ],
    metadata: {
      type: "contribution",
      cagnotte_id,
      participant_name: participant_name ?? "",
      participant_email,
      amount: String(amount),
      message: message ?? "",
      is_anonymous: is_anonymous ? "true" : "false",
    },
    success_url: `${origin}/cagnotte/${cagnotte.slug}/succes`,
    cancel_url: `${origin}/cagnotte/${cagnotte.slug}`,
  };

  // If the creator has linked their Stripe account, route the payment to them
  if (stripeAccountId) {
    sessionParams.payment_intent_data = {
      application_fee_amount: applicationFeeAmount,
      transfer_data: { destination: stripeAccountId },
    };
  }

  const session = await stripe.checkout.sessions.create(sessionParams);

  return NextResponse.json({ url: session.url });
}
