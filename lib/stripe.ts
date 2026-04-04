import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("Missing STRIPE_SECRET_KEY environment variable.");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-02-24.acacia",
  typescript: true,
});

// Creation fee amount in cents — configurable via env
export const CREATION_FEE_AMOUNT = parseInt(
  process.env.CREATION_FEE_AMOUNT ?? "499",
  10
);
