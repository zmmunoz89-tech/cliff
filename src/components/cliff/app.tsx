import { useEffect, useState } from "react";
import { Clapperboard, Gauge, Scale } from "lucide-react";
import { Heat } from "@/components/cliff/heat";
import { Room } from "@/components/cliff/room";
import { Desk } from "@/components/cliff/desk";
import { activeSeries, useCliff } from "@/lib/cliff/store";
import { PLANS } from "@/lib/cliff/plans";
import { tropeById } from "@/lib/cliff/market";
import type { PlanId, Tone, TropeId, View } from "@/lib/cliff/types";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/field";
import { Modal } from "@/components/ui/modal";
import { cn } from "@/lib/utils";
import { startCheckout } from "@/lib/cliff/start-checkout";

const TABS: { id: View; label: string; icon: typeof Gauge }[] = [
  { id: "heat", label: "Heat", icon: Gauge },
  { id: "room", label: "Room", icon: Clapperboard },
  { id: "desk", label: "Desk", icon: Scale },
];

const LENGTHS = [
  { n: 8, plan: "reader" as const, hint: "Reader" },
  { n: 30, plan: "room" as const, hint: "Room" },
  { n: 60, plan: "slate" as const, hint: "Slate" },
];

export function CliffApp() {
  const plan = useCliff((s) => s.plan);
  const series = useCliff((s) => s.series);
  const activeId = useCliff((s) => s.activeId);
  const view = useCliff((s) => s.view);
  const assumptions = useCliff((s) => s.assumptions);
  const caseLabel = useCliff((s) => s.caseLabel);
  const polishesLeft = useCliff((s) => s.polishesLeft);
  const setView = useCliff((s) => s.setView);
  const applyPlan = useCliff((s) => s.applyPlan);
  const draft = useCliff((s) => s.draft);
  const remove = useCliff((s) => s.remove);
  const select = useCliff((s) => s.select);
  const updateSeries = useCliff((s) => s.updateSeries);
  const spendPolish = useCliff((s) => s.spendPolish);
  const setAssumptions = useCliff((s) => s.setAssumptions);
  const runCase = useCliff((s) => s.runCase);
  const priceLength = useCliff((s) => s.priceLength);
  const resetCase = useCliff((s) => s.resetCase);

  const [plansOpen, setPlansOpen] = useState(false);
  const [draftTrope, setDraftTrope] = useState<TropeId | null>(null);

  useEffect(() => {
    void Promise.resolve(useCliff.persist.rehydrate());
  }, []);  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("upgraded") !== "1") return;

    const planParam = params.get("plan") || "";
    if (planParam.startsWith("room")) {
      applyPlan("room");
    } else if (planParam.startsWith("slate")) {
      applyPlan("slate");
    }

    window.history.replaceState({}, "", window.location.pathname);
  }, [applyPlan]);

  const active = activeSeries(series, activeId);
  const cap = PLANS[plan];

  return (
    <div className="min-h-dvh bg-bg text-fg">
      <header className="sticky top-0 z-30 border-b border-line bg-bg">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
          <button type="button" onClick={() => setView("heat")} className="min-h-11 text-left">
            <span className="block font-display text-xl leading-none text-fg">CLIFF</span>
            <span className="text-xs text-faint">Short-drama desk</span>
          </button>
          <nav className="ml-4 hidden gap-1 sm:flex" aria-label="Sections">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                aria-current={view === tab.id ? "page" : undefined}
                onClick={() => setView(tab.id)}
                className={cn(
                  "min-h-11 rounded-lg px-3 text-sm",
                  view === tab.id ? "bg-subtle text-fg" : "text-muted hover:text-fg",
                )}
              >
                {tab.label}
              </button>
            ))}
          </nav>
          <button
            type="button"
            onClick={() => setPlansOpen(true)}
            className="ml-auto min-h-11 rounded-lg border border-line px-3 text-left text-sm"
          >
            <span className="text-fg">
              {cap.name}
              {cap.price ? ` · $${cap.price}` : ""}
            </span>
            <span className="block text-xs text-faint tabular-nums">
              {series.length}/{cap.series} rooms
            </span>
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 pt-6 pb-28 sm:pb-12">
        {view === "heat" ? (
          <Heat
            onDraft={(id) => {
              void Promise.resolve(useCliff.persist.rehydrate()).then(() => setDraftTrope(id));
            }}
            onCase={(label, unlocks) => {
              void Promise.resolve(useCliff.persist.rehydrate()).then(() => runCase(label, unlocks));
            }}
          />
        ) : null}
        {view === "room" ? (
          <Room
            series={series}
            active={active}
            plan={plan}
            polishesLeft={polishesLeft}
            assumptions={assumptions}
            onSelect={select}
            onRemove={remove}
            onUpdate={updateSeries}
            onSpend={spendPolish}
            onPlans={() => setPlansOpen(true)}
            onHeat={() => setView("heat")}
          />
        ) : null}
        {view === "desk" ? (
          <Desk
            assumptions={assumptions}
            caseLabel={caseLabel}
            series={series}
            onChange={setAssumptions}
            onReset={resetCase}
            onPrice={priceLength}
          />
        ) : null}
      </main>

      <nav
        className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-bg pb-[env(safe-area-inset-bottom)] sm:hidden"
        aria-label="Sections"
      >
        <div className="grid grid-cols-3">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const on = view === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                aria-current={on ? "page" : undefined}
                onClick={() => setView(tab.id)}
                className={cn(
                  "flex min-h-12 flex-col items-center justify-center gap-0.5 text-xs",
                  on ? "text-fg" : "text-faint",
                )}
              >
                <Icon className="size-4" aria-hidden="true" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </nav>

      <Composer
        tropeId={draftTrope}
        plan={plan}
        atCap={series.length >= cap.series}
        onClose={() => setDraftTrope(null)}
        onPlans={() => {
          setDraftTrope(null);
          setPlansOpen(true);
        }}
        onDraft={(input) => {
          const result = draft(input);
          if (result.ok) setDraftTrope(null);
          return result;
        }}
      />
      <Plans open={plansOpen} current={plan} onClose={() => setPlansOpen(false)} onPick={applyPlan} />
    </div>
  );
}

function Composer({
  tropeId,
  plan,
  atCap,
  onClose,
  onPlans,
  onDraft,
}: {
  tropeId: TropeId | null;
  plan: PlanId;
  atCap: boolean;
  onClose: () => void;
  onPlans: () => void;
  onDraft: (input: {
    tropeId: TropeId;
    heroine: string;
    lead: string;
    city: string;
    tone: Tone;
    episodes: number;
    title?: string;
  }) => { ok: true } | { ok: false; reason: string };
}) {
  const trope = tropeId ? tropeById(tropeId) : null;
  const [heroine, setHeroine] = useState("Mara Ellison");
  const [lead, setLead] = useState("Julian Voss");
  const [city, setCity] = useState(trope?.city ?? "");
  const [title, setTitle] = useState("");
  const [tone, setTone] = useState<Tone>("whip");
  const [episodes, setEpisodes] = useState(8);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!trope) return;
    setCity(trope.city);
    setTitle("");
    setTone("whip");
    setEpisodes(8);
    setError(null);
  }, [trope]);

  return (
    <Modal
      open={trope !== null}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      title={trope ? trope.name : "New room"}
      description="Names stay on this device. The desk writes her as the protagonist. Both leads are adults."
    >
      {trope ? (
        <form
          className="grid gap-4"
          onSubmit={(event) => {
            event.preventDefault();
            if (atCap) {
              setError(`${PLANS[plan].name} is full.`);
              return;
            }
            if (episodes > PLANS[plan].episodes) {
              onPlans();
              return;
            }
            const result = onDraft({
              tropeId: trope.id,
              heroine,
              lead,
              city,
              tone,
              episodes,
              title,
            });
            if (!result.ok) setError(result.reason);
          }}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="heroine">Her</Label>
              <Input id="heroine" value={heroine} onChange={(e) => setHeroine(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="lead">Him</Label>
              <Input id="lead" value={lead} onChange={(e) => setLead(e.target.value)} />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="city">City</Label>
              <Input id="city" value={city} onChange={(e) => setCity(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="title">Title, if you have one</Label>
              <Input
                id="title"
                value={title}
                placeholder="Leave blank and the desk names it"
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
          </div>
          <fieldset>
            <legend className="mb-1 text-sm text-muted">Pace</legend>
            <div className="grid grid-cols-2 gap-2">
              {(
                [
                  ["whip", "Whiplash"],
                  ["slow", "Slow burn"],
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  aria-pressed={tone === id}
                  onClick={() => setTone(id)}
                  className={cn(
                    "min-h-11 rounded-sm border text-sm",
                    tone === id ? "border-paper bg-paper text-ink" : "border-line text-fg",
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend className="mb-1 text-sm text-muted">Length</legend>
            <div className="grid grid-cols-3 gap-2">
              {LENGTHS.map((item) => {
                const locked = item.n > PLANS[plan].episodes;
                const on = episodes === item.n;
                return (
                  <button
                    key={item.n}
                    type="button"
                    aria-pressed={on}
                    onClick={() => {
                      if (locked) {
                        onPlans();
                        return;
                      }
                      setEpisodes(item.n);
                    }}
                    className={cn(
                      "min-h-11 rounded-sm border px-2 text-sm",
                      on ? "border-paper bg-paper text-ink" : "border-line text-fg",
                    )}
                  >
                    <span className="block tabular-nums">{item.n}</span>
                    {locked ? <span className="block text-xs text-faint">{item.hint}</span> : null}
                  </button>
                );
              })}
            </div>
          </fieldset>
          {error ? <p className="text-sm text-bad">{error}</p> : null}
          {atCap ? (
            <p className="text-sm text-muted">
              {PLANS[plan].name} is full. Delete a room or move up a plan.
            </p>
          ) : null}
          <div className="flex flex-wrap gap-2">
            <Button type="submit">{atCap ? "Room is full" : "Draft the room"}</Button>
            {atCap ? (
              <Button type="button" variant="ghost" onClick={onPlans}>
                See plans
              </Button>
            ) : null}
          </div>
        </form>
      ) : null}
    </Modal>
  );
}

function Plans({
  open,
  current,
  onClose,
  onPick,
}: {
  open: boolean;
  current: PlanId;
  onClose: () => void;
  onPick: (plan: PlanId) => void;
}) {
  return (
    <Modal
      open={open}
      onOpenChange={(next) => {
        if (!next) onClose();
      }}
      title="What the desk costs"
      description="Free plan stays on this device. Paid plans open Stripe Checkout."
    >
      <div className="grid gap-3">
        {(["reader", "room", "slate"] as const).map((id) => {
          const item = PLANS[id];
          const on = current === id;
          return (
            <article key={id} className="rounded-xl border border-line p-4">
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="text-xl text-fg">{item.name}</h3>
                <p className="text-fg tabular-nums">{item.price === 0 ? "Free" : `$${item.price}/mo`}</p>
              </div>
              <p className="mt-2 text-sm text-pretty text-muted">{item.line}</p>
              <p className="mt-2 text-sm text-faint tabular-nums">
                {item.series} {item.series === 1 ? "room" : "rooms"} · {item.episodes} episodes ·{" "}
                {item.polishes} sharpens
              </p>
              <Button
                className="mt-4"
                variant={on ? "ghost" : "primary"}
                onClick={() => {
                  if (id === "reader") {
                    onPick(id);
                    onClose();
                  } else if (id === "room") {
                    void startCheckout("room_monthly");
                  } else {
                    void startCheckout("slate_monthly");
                  }
                }}
              >
                {on ? "Current plan" : id === "reader" ? `Use ${item.name}` : `Upgrade to ${item.name}`}
              </Button>
            </article>
          );
        })}
      </div>
      <p className="mt-4 text-center text-sm text-faint">
        Prefer annual billing?{" "}
        <a href="/pricing" className="text-fg underline underline-offset-2">
          See full pricing
        </a>
      </p>
    </Modal>
  );
}
