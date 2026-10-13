import { createServerFn } from "@tanstack/react-start";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-08-27.basil",
});

export const PRICE_IDS = {
  room_monthly: "price_1UQ9RV3TFKyEHEzqauYzmyDE",
  room_yearly: "price_1UQ9Ty3TFKyEHEzqqBQgyZRB",
  slate_monthly: "price_1UQ9SC3TFKyEHEzqSD6Jr1br",
  slate_yearly: "price_1UQ9Uy3TFKyEHEzqWfFz5ImC",
} as const;

export type PlanKey = keyof typeof PRICE_IDS;

export const createCheckoutSession = createServerFn({ method: "POST" })
  .validator((input: unknown) => {
    const body = input as { plan: PlanKey };
    if (!body.plan || !(body.plan in PRICE_IDS)) {
      throw new Error("Invalid plan");
    }
    return body;
  })
  .handler(async ({ data }) => {
    const origin = process.env.APP_URL || "http://localhost:8080";

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: PRICE_IDS[data.plan], quantity: 1 }],
      success_url: `${origin}/?upgraded=1&plan=${data.plan}`,
      cancel_url: `${origin}/pricing`,
      allow_promotion_codes: true,
    });

    if (!session.url) throw new Error("No checkout URL");
    return { url: session.url };
  });
