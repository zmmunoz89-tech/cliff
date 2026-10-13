import { useState } from "react";
import { tropeById } from "@/lib/cliff/market";
import { seriesMarkdown } from "@/lib/cliff/markdown";
import { quoteAssumptions } from "@/lib/cliff/money";
import { applyPolish, polishSeries } from "@/lib/cliff/polish";
import type { Assumptions, PlanId, Series } from "@/lib/cliff/types";
import { PLANS } from "@/lib/cliff/plans";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { cn } from "@/lib/utils";

export function Room({
  series,
  active,
  plan,
  polishesLeft,
  assumptions,
  onSelect,
  onRemove,
  onUpdate,
  onSpend,
  onPlans,
  onHeat,
}: {
  series: Series[];
  active: Series | null;
  plan: PlanId;
  polishesLeft: number;
  assumptions: Assumptions;
  onSelect: (id: string) => void;
  onRemove: (id: string) => void;
  onUpdate: (id: string, next: Series) => void;
  onSpend: () => void;
  onPlans: () => void;
  onHeat: () => void;
}) {
  const [episodeN, setEpisodeN] = useState(1);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!active) {
    return (
      <div className="rise max-w-xl">
        <p className="font-mono text-xs tracking-widest text-faint uppercase">Writer's room</p>
        <h1 className="mt-2 text-3xl text-fg">No room on the desk.</h1>
        <p className="mt-3 text-pretty text-muted">
          Pick a trope that's actually selling and draft eight episodes. The bible, the cast, and
          the button at the end of each one stay on this device.
        </p>
        <Button className="mt-6" onClick={onHeat}>
          Open the heat board
        </Button>
      </div>
    );
  }

  const trope = tropeById(active.tropeId);
  const selected = active.episodes.find((ep) => ep.n === episodeN) ?? active.episodes[0];
  const cap = PLANS[plan];

  async function sharpen() {
    if (!active) return;
    if (plan === "reader" || cap.polishes === 0) {
      onPlans();
      return;
    }
    if (polishesLeft < 1) {
      setError("No sharpens left on this plan.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const result = await polishSeries({
        data: {
          title: active.title,
          trope: trope.name,
          city: active.city,
          logline: active.logline,
          episodes: active.episodes.slice(0, 12).map((ep) => ({
            n: ep.n,
            title: ep.title,
            coldOpen: ep.coldOpen,
            button: ep.button,
          })),
        },
      });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      const next = applyPolish(active, result);
      onUpdate(active.id, { ...active, ...next, polished: true });
      onSpend();
    } catch {
      setError("The rewrite didn't come back. Your draft is intact.");
    } finally {
      setBusy(false);
    }
  }

  function pack() {
    if (!active) return "";
    return seriesMarkdown(active, plan === "slate", assumptions, quoteAssumptions(assumptions));
  }

  async function copyPack() {
    const text = pack();
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setError("Couldn't copy from this browser. Download the pack instead.");
    }
  }

  function download() {
    if (!active) return;
    const blob = new Blob([pack()], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${active.title.replace(/[^\w]+/g, "-").replace(/^-|-$/g, "").toLowerCase() || "cliff"}.md`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="rise">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 max-w-2xl">
          <p className="font-mono text-xs tracking-widest text-faint uppercase">
            {trope.name} · {active.city} · {active.tone === "whip" ? "Whiplash" : "Slow burn"}
            {active.polished ? " · Sharpened" : " · Desk draft"}
          </p>
          <h1 className="mt-2 text-3xl text-fg">{active.title}</h1>
          <p className="mt-3 text-pretty text-muted">{active.logline}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => void sharpen()} disabled={busy}>
            {busy ? "Sharpening…" : plan === "reader" ? "Sharpen is a Room tool" : "Sharpen"}
          </Button>
          <Button variant="ghost" onClick={() => void copyPack()}>
            {copied ? "Copied" : "Copy pack"}
          </Button>
          <Button variant="ghost" onClick={download}>
            Download
          </Button>
          <Button variant="quiet" onClick={() => setConfirmDelete(true)}>
            Delete
          </Button>
        </div>
      </header>
      {error ? <p className="mt-3 text-sm text-pretty text-bad">{error}</p> : null}
      {plan !== "reader" ? (
        <p className="mt-2 text-sm text-faint tabular-nums">
          {polishesLeft} sharpen{polishesLeft === 1 ? "" : "s"} left
          {active.episodes.length > 12 ? " · rewrites the logline and the first 12 buttons" : ""}
        </p>
      ) : null}

      {series.length > 1 ? (
        <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
          {series.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                onSelect(item.id);
                setEpisodeN(1);
              }}
              className={cn(
                "min-h-11 shrink-0 rounded-lg border px-3 text-sm",
                item.id === active.id ? "border-paper bg-subtle text-fg" : "border-line text-muted",
              )}
            >
              {item.title}
            </button>
          ))}
        </div>
      ) : null}

      <div className="mt-6 grid gap-4 lg:grid-cols-5">
        <div className="lg:col-span-2 lg:max-h-[70dvh] lg:overflow-y-auto">
          <ol className="grid gap-2">
            {active.episodes.map((ep) => {
              const on = ep.n === selected?.n;
              return (
                <li key={ep.n}>
                  <button
                    type="button"
                    aria-current={on ? "true" : undefined}
                    onClick={() => setEpisodeN(ep.n)}
                    className={cn(
                      "w-full rounded-lg border px-3 py-3 text-left",
                      on ? "border-paper bg-subtle" : "border-line bg-elevated hover:bg-subtle",
                    )}
                  >
                    <span className="font-mono text-xs text-faint tabular-nums">
                      {String(ep.n).padStart(2, "0")}
                    </span>
                    <span className="mt-1 block text-fg">{ep.title}</span>
                    <span className="mt-1 line-clamp-2 block text-sm text-muted">{ep.button}</span>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>
        {selected ? (
          <div className="lg:col-span-3 lg:sticky lg:top-20 lg:self-start">
            <article className="rounded-2xl bg-paper p-5 text-ink sm:p-6">
              <p className="font-mono text-xs tracking-widest text-ink-soft uppercase">{selected.slug}</p>
              <h2 className="mt-2 text-2xl">
                {String(selected.n).padStart(2, "0")} — {selected.title}
              </h2>
              <h3 className="mt-5 font-sans text-sm font-medium tracking-wide text-ink-soft uppercase">
                Cold open
              </h3>
              <p className="mt-1 text-pretty">{selected.coldOpen}</p>
              <h3 className="mt-4 font-sans text-sm font-medium tracking-wide text-ink-soft uppercase">
                Turn
              </h3>
              <p className="mt-1 text-pretty">{selected.turn}</p>
              <h3 className="mt-4 font-sans text-sm font-medium tracking-wide text-ink-soft uppercase">
                Button
              </h3>
              <p className="mt-1 text-pretty">{selected.button}</p>
              <h3 className="mt-4 font-sans text-sm font-medium tracking-wide text-ink-soft uppercase">
                Shoot notes
              </h3>
              <ul className="mt-1 grid gap-1 text-sm text-ink-soft">
                {selected.beats.map((beat) => (
                  <li key={beat}>{beat}</li>
                ))}
              </ul>
            </article>
            <div className="mt-4 rounded-xl border border-line p-4">
              <h2 className="text-lg text-fg">Promise</h2>
              <p className="mt-2 text-sm text-pretty text-muted">{active.promise}</p>
              <h2 className="mt-4 text-lg text-fg">Who pays</h2>
              <p className="mt-2 text-sm text-pretty text-muted">{active.buyer}</p>
              <ul className="mt-4 grid gap-3">
                {active.cast.map((person) => (
                  <li key={person.name}>
                    <p className="text-fg">
                      {person.name}{" "}
                      <span className="text-faint">· {person.role}</span>
                    </p>
                    <p className="text-sm text-pretty text-muted">{person.want}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : null}
      </div>

      <Modal
        open={confirmDelete}
        onOpenChange={setConfirmDelete}
        title="Delete this room?"
        description="The bible leaves this device. Nothing is stored anywhere else."
      >
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={() => {
              onRemove(active.id);
              setConfirmDelete(false);
              setEpisodeN(1);
            }}
          >
            Delete room
          </Button>
          <Button variant="ghost" onClick={() => setConfirmDelete(false)}>
            Keep it
          </Button>
        </div>
      </Modal>
    </div>
  );
}
