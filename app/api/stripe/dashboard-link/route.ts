import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
import { supabase } from "@/lib/supabase";

// GET /api/stripe/dashboard-link
// Generates a one-time Stripe Express dashboard login link and redirects to it.
// Only available for creators who have completed Express onboarding.
export async function GET() {
  const session = await getServerSession();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: userData } = await supabase
    .from("users")
    .select("stripe_account_id")
    .eq("id", session.user.id)
    .single();

  const stripeAccountId = userData?.stripe_account_id ?? null;

  if (!stripeAccountId) {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
    return NextResponse.redirect(`${appUrl}/dashboard?connect=missing`);
  }

  try {
    const loginLink = await stripe.accounts.createLoginLink(stripeAccountId);
    return NextResponse.redirect(loginLink.url);
  } catch {
    // Account may not be fully onboarded yet — send them through onboarding again
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
    const accountLink = await stripe.accountLinks.create({
      account: stripeAccountId,
      refresh_url: `${appUrl}/api/stripe/connect`,
      return_url: `${appUrl}/dashboard?connect=success`,
      type: "account_onboarding",
    });
    return NextResponse.redirect(accountLink.url);
  }
}
