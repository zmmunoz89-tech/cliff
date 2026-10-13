import { compact, money, normalizeAssumptions, pct, quoteAssumptions } from "@/lib/cliff/money";
import type { Assumptions, PayModel, Series } from "@/lib/cliff/types";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/field";

export function Desk({
  assumptions,
  caseLabel,
  series,
  onChange,
  onReset,
  onPrice,
}: {
  assumptions: Assumptions;
  caseLabel: string | null;
  series: Series[];
  onChange: (patch: Partial<Assumptions>) => void;
  onReset: () => void;
  onPrice: (episodes: number, label: string) => void;
}) {
  const quote = quoteAssumptions(assumptions);
  const clean = normalizeAssumptions(assumptions);

  return (
    <div className="rise">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-xl">
          <p className="font-mono text-xs tracking-widest text-faint uppercase">License desk</p>
          <h1 className="mt-2 text-3xl text-fg">Price the season before you shoot it.</h1>
        </div>
        <Button variant="ghost" onClick={onReset}>
          Reset to a thin slate
        </Button>
      </header>

      <section className="mt-6 rounded-2xl bg-paper p-5 text-ink sm:p-6">
        <p className="font-mono text-xs tracking-widest text-ink-soft uppercase">
          {caseLabel ? `Case · ${caseLabel}` : "Case · thin slate"}
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <Stat label="Cost" value={money(quote.cost)} />
          <Stat label="Receipts" value={money(quote.gross)} />
          <Stat label="Net" value={money(quote.net)} />
        </div>
        <p className="mt-5 text-pretty text-ink">{quote.verdictLine}</p>
        <p className="mt-2 text-sm text-pretty text-ink-soft">
          {quote.paybackEpisode
            ? `Cost is covered at episode ${quote.paybackEpisode} of ${quote.episodes}. `
            : "These numbers never cover cost. "}
          Margin {pct(quote.margin)}.{" "}
          {quote.breakEvenUnlocks !== null
            ? `You need ${compact(quote.breakEvenUnlocks)} unlocks on each paid episode to break even.`
            : `Buyout pays ${money(clean.buyoutPerEp)} an episode, free episodes included.`}
        </p>
        <p className="mt-3 text-sm text-ink-soft">Desk estimate. Not a forecast. Hits clear this. Most seasons do not.</p>
      </section>

      <div className="mt-6 flex flex-wrap gap-2">
        <ModelButton
          current={clean.model}
          id="unlock"
          label="Unlock share"
          onChange={onChange}
        />
        <ModelButton current={clean.model} id="buyout" label="Flat buyout" onChange={onChange} />
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <Num
          id="episodes"
          label="Episodes shot"
          value={clean.episodes}
          min={1}
          max={120}
          onChange={(episodes) => onChange({ episodes })}
        />
        <Num
          id="cost"
          label="Cost per episode ($)"
          value={clean.costPerEp}
          min={0}
          max={100000}
          onChange={(costPerEp) => onChange({ costPerEp })}
        />
        {clean.model === "unlock" ? (
          <>
            <Num
              id="free"
              label="Free episodes (the trailer)"
              value={clean.freeEpisodes}
              min={0}
              max={clean.episodes}
              onChange={(freeEpisodes) => onChange({ freeEpisodes })}
            />
            <Num
              id="price"
              label="Unlock price ($)"
              value={clean.unlockPrice}
              min={0}
              max={20}
              step={0.05}
              onChange={(unlockPrice) => onChange({ unlockPrice })}
            />
            <Num
              id="unlocks"
              label="Unlocks per paid episode"
              value={clean.unlocks}
              min={0}
              max={5000000}
              step={1000}
              onChange={(unlocks) => onChange({ unlocks })}
            />
            <Num
              id="share"
              label="Your share (%)"
              value={clean.sharePct}
              min={0}
              max={100}
              onChange={(sharePct) => onChange({ sharePct })}
            />
          </>
        ) : (
          <Num
            id="buyout"
            label="Buyout per episode ($)"
            value={clean.buyoutPerEp}
            min={0}
            max={500000}
            onChange={(buyoutPerEp) => onChange({ buyoutPerEp })}
          />
        )}
      </div>

      <section className="mt-8">
        <h2 className="text-xl text-fg">Rooms on this device</h2>
        {series.length === 0 ? (
          <p className="mt-2 max-w-xl text-sm text-pretty text-muted">
            No rooms yet. Draft one from the heat board, or run a hot case and see the net move
            before you name a character.
          </p>
        ) : (
          <ul className="mt-3 grid gap-2">
            {series.map((item) => (
              <li
                key={item.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-elevated px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-fg">{item.title}</p>
                  <p className="text-sm text-faint tabular-nums">{item.episodes.length} episodes</p>
                </div>
                <Button variant="ghost" onClick={() => onPrice(item.episodes.length, item.title)}>
                  Price this length
                </Button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-sm text-ink-soft">{label}</p>
      <p className="mt-1 font-display text-3xl text-ink tabular-nums">{value}</p>
    </div>
  );
}

function ModelButton({
  current,
  id,
  label,
  onChange,
}: {
  current: PayModel;
  id: PayModel;
  label: string;
  onChange: (patch: Partial<Assumptions>) => void;
}) {
  const on = current === id;
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={() => onChange({ model: id })}
      className={
        on
          ? "min-h-11 rounded-lg bg-paper px-4 text-sm font-medium text-ink"
          : "min-h-11 rounded-lg border border-line px-4 text-sm text-fg hover:bg-subtle"
      }
    >
      {label}
    </button>
  );
}

function Num({
  id,
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
}: {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (n: number) => void;
}) {
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        inputMode="decimal"
        type="number"
        min={min}
        max={max}
        step={step}
        value={Number.isFinite(value) ? value : 0}
        onChange={(event) => {
          const next = Number(event.target.value);
          if (!Number.isFinite(next)) return;
          onChange(Math.min(max, Math.max(min, next)));
        }}
      />
    </div>
  );
}
