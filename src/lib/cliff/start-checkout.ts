import { createCheckoutSession, type PlanKey } from "@/lib/cliff/checkout";

export async function startCheckout(plan: PlanKey) {
  try {
    const result = await createCheckoutSession({ data: { plan } });
    window.location.href = result.url;
  } catch (err) {
    console.error(err);
    alert("Could not start checkout. Please try again in a moment.");
  }
}
