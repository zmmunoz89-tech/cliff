import { TROPES } from "@/lib/cliff/market";
import { compact } from "@/lib/cliff/money";
import type { TropeId } from "@/lib/cliff/types";
import { Button } from "@/components/ui/button";

export function Heat({
  onDraft,
  onCase,
}: {
  onDraft: (id: TropeId) => void;
  onCase: (label: string, unlocks: number) => void;
}) {
  return (
    <div className="rise">
      <header className="max-w-2xl">
        <p className="font-mono text-xs tracking-widest text-faint uppercase">
          October desk · vertical series
        </p>
        <h1 className="mt-3 text-hero text-fg">Short drama is where the downloads went.</h1>
        <p className="mt-4 max-w-xl text-pretty text-muted">
          Vertical series — seventy-second episodes, a cliffhanger you pay to resolve — are the
          fastest-growing app category by downloads. CLIFF turns a trope into a bible and a quote,
          before anyone books a crew.
        </p>
      </header>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {TROPES.map((trope) => (
          <article key={trope.id} className="flex flex-col rounded-xl border border-line bg-elevated p-4">
            <div className="flex items-baseline justify-between gap-3">
              <h2 className="text-xl text-fg">{trope.name}</h2>
              <p className="font-mono text-sm text-muted tabular-nums">{trope.heat}</p>
            </div>
            <p className="mt-2 text-sm text-pretty text-muted">{trope.pitch}</p>
            <div className="mt-4 h-px bg-line" aria-hidden="true">
              <div className="h-px bg-paper" style={{ width: `${trope.heat}%` }} />
            </div>
            <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div>
                <dt className="text-faint">Still watching at ep 10</dt>
                <dd className="mt-1 text-fg tabular-nums">{trope.completion}%</dd>
              </div>
              <div>
                <dt className="text-faint">Hot-case unlocks</dt>
                <dd className="mt-1 text-fg tabular-nums">{compact(trope.hotUnlocks)}</dd>
              </div>
            </dl>
            <p className="mt-3 text-sm text-pretty text-muted">{trope.why}</p>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              <Button onClick={() => onDraft(trope.id)}>Draft a room</Button>
              <Button variant="ghost" onClick={() => onCase(trope.name, trope.hotUnlocks)}>
                Run the hot case
              </Button>
            </div>
          </article>
        ))}
      </div>
      <p className="mt-6 max-w-2xl text-sm text-pretty text-faint">
        Heat, completion, and unlocks are desk estimates for packaging a season — not a promise that
        a platform will buy it. A 30-episode shoot at $2,400 an episode costs $72,000. The desk on
        the next tab tells you how many paid unlocks that requires.
      </p>
    </div>
  );
}
