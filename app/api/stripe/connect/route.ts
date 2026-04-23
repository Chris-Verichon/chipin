import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
import { supabase } from "@/lib/supabase";

// GET /api/stripe/connect
// Creates (or reuses) a Stripe Connect account and redirects to the onboarding link
export async function GET() {
  const session = await getServerSession();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  // Fetch existing stripe_account_id if any
  const { data: userData } = await supabase
    .from("users")
    .select("stripe_account_id")
    .eq("id", session.user.id)
    .single();

  let stripeAccountId = userData?.stripe_account_id ?? null;

  // Create a new Express connected account if none exists
  if (!stripeAccountId) {
    const account = await stripe.accounts.create({
      type: "express",
      email: session.user.email ?? undefined,
      capabilities: {
        transfers: { requested: true },
      },
    });

    stripeAccountId = account.id;

    await supabase
      .from("users")
      .update({ stripe_account_id: stripeAccountId })
      .eq("id", session.user.id);
  }

  // Create a one-time onboarding link
  const accountLink = await stripe.accountLinks.create({
    account: stripeAccountId,
    refresh_url: `${appUrl}/api/stripe/connect`,     // regenerates a fresh link if expired
    return_url: `${appUrl}/dashboard?connect=success`,
    type: "account_onboarding",
  });

  return NextResponse.redirect(accountLink.url);
}
