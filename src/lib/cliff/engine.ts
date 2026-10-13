import { FILL, SPINE, type RawBeat } from "@/lib/cliff/beats";
import { tropeById } from "@/lib/cliff/market";
import type { CastMember, Episode, Series, Tone, TropeId } from "@/lib/cliff/types";

export type DraftInput = {
  tropeId: TropeId;
  heroine: string;
  lead: string;
  city: string;
  tone: Tone;
  episodes: number;
  title?: string;
};

const RIVALS = [
  "Adrian Cole",
  "Soren Hale",
  "Victor Lang",
  "Helena Voss",
  "Cassian Reed",
  "Ivy Trent",
  "Dominic Shaw",
  "Marisol Peck",
];

const ALLIES = [
  "Priya Shah",
  "Noah Ellis",
  "June Park",
  "Elena Cho",
  "Samir Adeyemi",
  "Ruth Keller",
  "Owen Blake",
  "Mina Alvarez",
];

type Ctx = {
  h: string;
  l: string;
  r: string;
  a: string;
  hs: string;
  ls: string;
  city: string;
  seed: string;
};

function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function clean(raw: string, fallback: string, max = 42) {
  const t = raw
    .replace(/[{}]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
  return t || fallback;
}

function splitName(full: string) {
  const parts = full.split(" ");
  const first = parts[0] || full;
  const last = parts.length > 1 ? parts.slice(1).join(" ") : first;
  return { first, last };
}

function apply(template: string, c: Ctx, n: number) {
  return template
    .replaceAll("{hs}", c.hs)
    .replaceAll("{ls}", c.ls)
    .replaceAll("{city}", c.city)
    .replaceAll("{h}", c.h)
    .replaceAll("{l}", c.l)
    .replaceAll("{r}", c.r)
    .replaceAll("{a}", c.a)
    .replaceAll("{n}", String(n));
}

function layout(total: number, spineLen: number) {
  type Slot = { kind: "spine"; index: number } | { kind: "fill" };
  if (total <= 1) return [{ kind: "spine", index: 0 }] as Slot[];
  const slots: Array<Slot | null> = Array.from({ length: total }, () => null);
  for (let s = 0; s < spineLen; s++) {
    const at = Math.round((s * (total - 1)) / (spineLen - 1));
    slots[at] = { kind: "spine", index: s };
  }
  slots[0] = { kind: "spine", index: 0 };
  slots[total - 1] = { kind: "spine", index: spineLen - 1 };
  for (let i = 0; i < total; i++) {
    if (!slots[i]) slots[i] = { kind: "fill" };
  }
  return slots as Slot[];
}

function beatToEpisode(raw: RawBeat, c: Ctx, n: number, used: Set<string>): Episode {
  let title = apply(raw.title, c, n);
  if (used.has(title)) title = `${title} (${n})`;
  used.add(title);
  return {
    n,
    slug: apply(raw.slug, c, n),
    title,
    coldOpen: apply(raw.cold, c, n),
    turn: apply(raw.turn, c, n),
    button: apply(raw.button, c, n),
    beats: raw.beats.map((b) => apply(b, c, n)),
  };
}

export function draftSeries(input: DraftInput): Series {
  const trope = tropeById(input.tropeId);
  const heroine = clean(input.heroine, "Mara Ellison");
  const lead = clean(input.lead, "Julian Voss");
  const city = clean(input.city, trope.city, 32);
  const tone: Tone = input.tone === "slow" ? "slow" : "whip";
  const episodes = Math.round(Math.min(60, Math.max(1, input.episodes || 8)));
  const h = splitName(heroine);
  const l = splitName(lead);
  const seed = `${trope.id}|${heroine}|${lead}|${city}|${tone}|${episodes}`;
  const n = hash(seed);
  const rival = RIVALS[n % RIVALS.length] ?? RIVALS[0];
  const ally = ALLIES[(n >>> 8) % ALLIES.length] ?? ALLIES[0];
  const r = splitName(rival);
  const a = splitName(ally);
  const ctx: Ctx = { h: h.first, l: l.first, r: r.first, a: a.first, hs: h.last, ls: l.last, city, seed };

  const spine = SPINE[trope.id];
  const fill = FILL[trope.id];
  const used = new Set<string>();
  const episodeList: Episode[] = layout(episodes, spine.length).map((slot, i) => {
    const num = i + 1;
    if (slot.kind === "spine") return beatToEpisode(spine[slot.index] ?? spine[0], ctx, num, used);
    const salt = hash(`${seed}:${num}`);
    const raw = fill[salt % fill.length] ?? fill[0];
    return beatToEpisode(raw, ctx, num, used);
  });

  const cast = (name: string, role: string, want: string, wound: string): CastMember => ({
    name,
    role: apply(role, ctx, 1),
    want: apply(want, ctx, 1),
    wound: apply(wound, ctx, 1),
  });

  const customTitle = input.title ? clean(input.title, "", 72) : "";

  return {
    id: `s_${Date.now().toString(36)}_${(n % 46656).toString(36)}`,
    createdAt: Date.now(),
    tropeId: trope.id,
    tone,
    title: customTitle || trope.titles[tone],
    city,
    logline: apply(trope.logline[tone], ctx, 1),
    promise: apply(trope.promise[tone], ctx, 1),
    audience: trope.audience,
    buyer: trope.buyer,
    cast: [
      cast(heroine, trope.heroineRole, trope.heroineWant, trope.heroineWound),
      cast(lead, trope.leadRole, trope.leadWant, trope.leadWound),
      cast(rival, trope.rivalRole, trope.rivalWant, "They intend to win in public."),
      cast(ally, trope.allyRole, trope.allyWant, "Loyalty, so far, has been a private habit."),
    ],
    episodes: episodeList,
    polished: false,
  };
}
