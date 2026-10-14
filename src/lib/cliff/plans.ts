import type { PlanId } from "@/lib/cliff/types";

export type Plan = {
  id: PlanId;
  name: string;
  price: number;
  series: number;
  episodes: number;
  polishes: number;
  line: string;
};

export const PLANS: Record<PlanId, Plan> = {
  reader: {
    id: "reader",
    name: "Reader",
    price: 0,
    series: 1,
    episodes: 8,
    polishes: 0,
    line: "One room. Eight episodes. Enough to see if the hook holds.",
  },
  room: {
    id: "room",
    name: "Room",
    price: 19,
    series: 6,
    episodes: 30,
    polishes: 12,
    line: "A licensable season. Sharper cliffhangers. Six rooms on the slate.",
  },
  slate: {
    id: "slate",
    name: "Slate",
    price: 49,
    series: 24,
    episodes: 60,
    polishes: 40,
    line: "Full seasons, buyer-facing exports, and a desk that can hold a year.",
  },
};

export const PLAN_ORDER: PlanId[] = ["reader", "room", "slate"];

export const RANK: Record<PlanId, number> = { reader: 0, room: 1, slate: 2 };
