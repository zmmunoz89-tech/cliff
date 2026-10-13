import type { Assumptions } from "@/lib/cliff/types";

export const DEFAULT_ASSUMPTIONS: Assumptions = {
  episodes: 30,
  freeEpisodes: 6,
  costPerEp: 2400,
  unlockPrice: 0.35,
  unlocks: 25000,
  sharePct: 35,
  buyoutPerEp: 3800,
  model: "unlock",
};

export type Verdict = "loss" | "thin" | "clears";

export type Quote = {
  episodes: number;
  freeEpisodes: number;
  paidEpisodes: number;
  cost: number;
  gross: number;
  net: number;
  margin: number;
  perPaid: number;
  breakEvenUnlocks: number | null;
  paybackEpisode: number | null;
  verdict: Verdict;
  verdictLine: string;
};

function clamp(n: number, min: number, max: number, fallback: number) {
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, n));
}

export function normalizeAssumptions(input: Assumptions): Assumptions {
  const episodes = Math.round(clamp(input.episodes, 1, 120, 30));
  const freeEpisodes = Math.round(clamp(input.freeEpisodes, 0, episodes, 6));
  return {
    episodes,
    freeEpisodes,
    costPerEp: clamp(input.costPerEp, 0, 100000, 2400),
    unlockPrice: clamp(input.unlockPrice, 0, 20, 0.35),
    unlocks: Math.round(clamp(input.unlocks, 0, 5_000_000, 25000)),
    sharePct: clamp(input.sharePct, 0, 100, 35),
    buyoutPerEp: clamp(input.buyoutPerEp, 0, 500000, 3800),
    model: input.model === "buyout" ? "buyout" : "unlock",
  };
}

export function quoteAssumptions(raw: Assumptions): Quote {
  const a = normalizeAssumptions(raw);
  const paidEpisodes = Math.max(0, a.episodes - a.freeEpisodes);
  const cost = a.episodes * a.costPerEp;
  const share = a.sharePct / 100;
  const perPaid =
    a.model === "buyout" ? a.buyoutPerEp : a.unlocks * a.unlockPrice * share;
  const gross =
    a.model === "buyout" ? a.episodes * a.buyoutPerEp : paidEpisodes * perPaid;
  const net = gross - cost;
  const margin = gross > 0 ? net / gross : 0;
  const denom = paidEpisodes * a.unlockPrice * share;
  const breakEvenUnlocks =
    a.model === "unlock" && denom > 0 ? Math.ceil(cost / denom) : null;

  let cum = 0;
  let paybackEpisode: number | null = null;
  for (let ep = 1; ep <= a.episodes; ep++) {
    const earned = a.model === "buyout" ? a.buyoutPerEp : ep <= a.freeEpisodes ? 0 : perPaid;
    cum += earned;
    if (paybackEpisode === null && cum >= cost && cost > 0) paybackEpisode = ep;
  }
  if (cost === 0) paybackEpisode = 1;

  let verdict: Verdict = "clears";
  let verdictLine = "It clears cost with room. Still a bet, not a salary.";
  if (net <= 0) {
    verdict = "loss";
    verdictLine = "This slate loses money on these numbers.";
  } else if (net < cost * 0.2) {
    verdict = "thin";
    verdictLine = "It clears cost. One bad week of unlocks and it doesn't.";
  }

  return {
    episodes: a.episodes,
    freeEpisodes: a.freeEpisodes,
    paidEpisodes,
    cost,
    gross,
    net,
    margin,
    perPaid,
    breakEvenUnlocks,
    paybackEpisode,
    verdict,
    verdictLine,
  };
}

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const num = new Intl.NumberFormat("en-US");

export function money(n: number) {
  if (!Number.isFinite(n)) return "—";
  return usd.format(Math.round(n));
}

export function compact(n: number) {
  if (!Number.isFinite(n)) return "—";
  return num.format(Math.round(n));
}

export function pct(n: number) {
  if (!Number.isFinite(n)) return "—";
  return `${Math.round(n * 100)}%`;
}
