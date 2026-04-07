import { NextRequest, NextResponse } from "next/server";

// GET /api/stripe/connect/callback
// This route is no longer used — Stripe Account Links redirect directly to /dashboard?connect=success
// Kept as a safety fallback redirect
export async function GET(req: NextRequest) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  return NextResponse.redirect(`${appUrl}/dashboard?connect=success`);
}
