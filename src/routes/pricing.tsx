import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { startCheckout } from "@/lib/cliff/start-checkout";
import { cn } from "@/lib/utils";
import type { PlanKey } from "@/lib/cliff/checkout";

export const Route = createFileRoute("/pricing")({
  component: PricingPage,
});

const PLANS = [
  {
    id: "reader",
    name: "Reader",
    price: 0,
    description: "One room. Eight episodes. Enough to see if the hook holds.",
    features: ["1 active series", "8 episodes max", "Local storage only", "Watermarked exports"],
    cta: "Current plan",
    disabled: true,
  },
  {
    id: "room",
    name: "Room",
    price: 19,
    yearlyPrice: 15,
    description: "A licensable season. Sharper cliffhangers. Five rooms on the slate.",
    features: [
      "5 active series",
      "40 episodes",
      "20 polishes / month",
      "Cloud save",
      "Clean PDF + Final Draft",
      "Platform Package export",
    ],
    cta: "Upgrade to Room",
    highlighted: true,
    monthlyKey: "room_monthly" as PlanKey,
    yearlyKey: "room_yearly" as PlanKey,
  },
  {
    id: "slate",
    name: "Slate",
    price: 49,
    yearlyPrice: 39,
    description: "Full seasons, buyer-facing exports, and a desk that can hold a year.",
    features: [
      "Unlimited series",
      "100 episodes",
      "60 polishes / month",
      "Up to 3 team seats",
      "Advanced Desk scenarios",
      "Priority polish queue",
    ],
    cta: "Upgrade to Slate",
    monthlyKey: "slate_monthly" as PlanKey,
    yearlyKey: "slate_yearly" as PlanKey,
  },
] as const;

function PricingPage() {
  const [annual, setAnnual] = useState(false);

  return (
    <div className="min-h-dvh bg-bg text-fg">
      <div className="mx-auto max-w-5xl px-4 py-16">
        <header className="mx-auto max-w-2xl text-center">
          <p className="font-mono text-xs tracking-widest text-faint uppercase">Pricing</p>
          <h1 className="mt-3 font-display text-4xl text-fg sm:text-5xl">
            Choose the desk that fits your slate
          </h1>
          <p className="mt-4 text-pretty text-muted">
            Cancel anytime. Annual billing saves ~20%.
          </p>

          <div className="mt-8 inline-flex items-center gap-3 rounded-full border border-line bg-elevated p-1">
            <button
              type="button"
              onClick={() => setAnnual(false)}
              className={cn(
                "rounded-full px-4 py-1.5 text-sm transition",
                !annual ? "bg-paper text-ink" : "text-muted hover:text-fg",
              )}
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => setAnnual(true)}
              className={cn(
                "rounded-full px-4 py-1.5 text-sm transition",
                annual ? "bg-paper text-ink" : "text-muted hover:text-fg",
              )}
            >
              Annual <span className="text-faint">(~20% off)</span>
            </button>
          </div>
        </header>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {PLANS.map((plan) => {
            const price = annual && "yearlyPrice" in plan ? plan.yearlyPrice : plan.price;
            const key =
              annual && "yearlyKey" in plan
                ? plan.yearlyKey
                : "monthlyKey" in plan
                  ? plan.monthlyKey
                  : undefined;

            return (
              <article
                key={plan.id}
                className={cn(
                  "flex flex-col rounded-2xl border p-6",
                  "highlighted" in plan && plan.highlighted
                    ? "border-paper bg-elevated"
                    : "border-line bg-bg",
                )}
              >
                <div>
                  <h2 className="font-display text-2xl text-fg">{plan.name}</h2>
                  <p className="mt-2 text-sm text-pretty text-muted">{plan.description}</p>
                </div>

                <div className="mt-6">
                  <span className="font-display text-4xl text-fg">${price}</span>
                  {plan.price > 0 && <span className="text-muted">/mo</span>}
                  {annual && plan.price > 0 && (
                    <p className="mt-1 text-xs text-faint">billed yearly</p>
                  )}
                </div>

                <ul className="mt-6 flex-1 space-y-2 text-sm text-muted">
                  {plan.features.map((f) => (
                    <li key={f} className="flex gap-2">
                      <span className="text-good">✓</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8">
                  {"disabled" in plan && plan.disabled ? (
                    <Button variant="ghost" disabled className="w-full">
                      {plan.cta}
                    </Button>
                  ) : (
                    <Button className="w-full" onClick={() => key && startCheckout(key)}>
                      {plan.cta}
                    </Button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
