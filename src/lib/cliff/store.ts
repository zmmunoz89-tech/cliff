import { create } from "zustand";
import { persist } from "zustand/middleware";
import { draftSeries, type DraftInput } from "@/lib/cliff/engine";
import { DEFAULT_ASSUMPTIONS } from "@/lib/cliff/money";
import { PLANS, RANK } from "@/lib/cliff/plans";
import type { Assumptions, PlanId, Series, View } from "@/lib/cliff/types";

type CliffState = {
  plan: PlanId;
  polishesLeft: number;
  series: Series[];
  activeId: string | null;
  view: View;
  assumptions: Assumptions;
  caseLabel: string | null;
  setView: (view: View) => void;
  applyPlan: (plan: PlanId) => void;
  draft: (input: DraftInput) => { ok: true } | { ok: false; reason: string };
  remove: (id: string) => void;
  select: (id: string) => void;
  updateSeries: (id: string, next: Series) => void;
  spendPolish: () => void;
  setAssumptions: (patch: Partial<Assumptions>) => void;
  runCase: (label: string, unlocks: number) => void;
  priceLength: (episodes: number, label: string) => void;
  resetCase: () => void;
};

export const useCliff = create<CliffState>()(
  persist(
    (set, get) => ({
      plan: "reader",
      polishesLeft: 0,
      series: [],
      activeId: null,
      view: "heat",
      assumptions: DEFAULT_ASSUMPTIONS,
      caseLabel: null,
      setView: (view) => set({ view }),
      applyPlan: (plan) => {
        const current = get();
        const upgrade = RANK[plan] > RANK[current.plan];
        set({
          plan,
          polishesLeft: upgrade
            ? Math.max(current.polishesLeft, PLANS[plan].polishes)
            : current.polishesLeft,
        });
      },
      draft: (input) => {
        const current = get();
        const cap = PLANS[current.plan];
        if (current.series.length >= cap.series) {
          const noun = cap.series === 1 ? "room" : "rooms";
          return { ok: false, reason: `${cap.name} holds ${cap.series} ${noun}.` };
        }
        const episodes = Math.min(Math.max(1, input.episodes), cap.episodes);
        const series = draftSeries({ ...input, episodes });
        set({
          series: [series, ...current.series],
          activeId: series.id,
          view: "room",
        });
        return { ok: true };
      },
      remove: (id) => {
        const current = get();
        const series = current.series.filter((item) => item.id !== id);
        set({
          series,
          activeId: current.activeId === id ? (series[0]?.id ?? null) : current.activeId,
        });
      },
      select: (id) => set({ activeId: id, view: "room" }),
      updateSeries: (id, next) =>
        set((current) => ({
          series: current.series.map((item) => (item.id === id ? next : item)),
        })),
      spendPolish: () =>
        set((current) => ({ polishesLeft: Math.max(0, current.polishesLeft - 1) })),
      setAssumptions: (patch) =>
        set((current) => {
          const next = { ...current.assumptions, ...patch };
          if (next.freeEpisodes > next.episodes) next.freeEpisodes = next.episodes;
          if (next.freeEpisodes < 0) next.freeEpisodes = 0;
          return { assumptions: next };
        }),
      runCase: (label, unlocks) =>
        set((current) => ({
          view: "desk",
          caseLabel: label,
          assumptions: {
            ...current.assumptions,
            model: "unlock",
            episodes: 30,
            freeEpisodes: 6,
            unlocks,
          },
        })),
      priceLength: (episodes, label) =>
        set((current) => {
          const count = Math.max(1, Math.round(episodes));
          const free = Math.min(current.assumptions.freeEpisodes, Math.max(0, count - 1));
          return {
            caseLabel: label,
            view: "desk",
            assumptions: { ...current.assumptions, episodes: count, freeEpisodes: free },
          };
        }),
      resetCase: () => set({ assumptions: DEFAULT_ASSUMPTIONS, caseLabel: null }),
    }),
    { name: "cliff-desk-v1", skipHydration: true },
  ),
);

export function activeSeries(series: Series[], activeId: string | null) {
  return series.find((item) => item.id === activeId) ?? series[0] ?? null;
}
