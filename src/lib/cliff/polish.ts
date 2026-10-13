import { createServerFn } from "@tanstack/react-start";

type EpIn = { n: number; title: string; coldOpen: string; button: string };
type Input = { title: string; trope: string; city: string; logline: string; episodes: EpIn[] };
export type EpOut = { n: number; title: string; coldOpen: string; button: string };
export type PolishResult =
  | { ok: true; logline: string; episodes: EpOut[] }
  | { ok: false; error: string };

function clip(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function parseInput(input: unknown): Input {
  if (!input || typeof input !== "object") throw new Error("Bad request");
  const body = input as Record<string, unknown>;
  const raw = Array.isArray(body.episodes) ? body.episodes.slice(0, 12) : [];
  const episodes: EpIn[] = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const ep = item as Record<string, unknown>;
    const n = typeof ep.n === "number" ? Math.round(ep.n) : 0;
    if (n < 1 || n > 60) continue;
    episodes.push({
      n,
      title: clip(ep.title, 90),
      coldOpen: clip(ep.coldOpen, 420),
      button: clip(ep.button, 420),
    });
  }
  if (!episodes.length) throw new Error("Nothing to sharpen");
  return {
    title: clip(body.title, 90) || "Untitled",
    trope: clip(body.trope, 48),
    city: clip(body.city, 40),
    logline: clip(body.logline, 500),
    episodes,
  };
}

function extractJson(text: string): unknown {
  const trimmed = text.trim();
  try {
    return JSON.parse(trimmed);
  } catch {
    /* fall through */
  }
  const fence = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fence?.[1]) return JSON.parse(fence[1]);
  const start = trimmed.indexOf("{");
  const end = trimmed.lastIndexOf("}");
  if (start >= 0 && end > start) return JSON.parse(trimmed.slice(start, end + 1));
  throw new Error("empty");
}

function readResult(value: unknown, fallbackLogline: string): PolishResult {
  if (!value || typeof value !== "object") return { ok: false, error: "The rewrite came back empty." };
  const body = value as Record<string, unknown>;
  const logline = clip(body.logline, 420) || fallbackLogline;
  if (!Array.isArray(body.episodes)) return { ok: false, error: "The rewrite missed the episodes." };
  const episodes: EpOut[] = [];
  for (const item of body.episodes) {
    if (!item || typeof item !== "object") continue;
    const ep = item as Record<string, unknown>;
    const n = typeof ep.n === "number" ? Math.round(ep.n) : 0;
    if (n < 1) continue;
    const title = clip(ep.title, 90);
    const coldOpen = clip(ep.coldOpen, 420);
    const button = clip(ep.button, 420);
    if (!title && !coldOpen && !button) continue;
    episodes.push({ n, title, coldOpen, button });
  }
  if (!episodes.length) return { ok: false, error: "The rewrite didn't include usable episodes." };
  return { ok: true, logline, episodes };
}

async function complete(apiKey: string, payload: Input, jsonMode: boolean) {
  const maxTokens = Math.min(2200, 420 + payload.episodes.length * 130);
  const res = await fetch("https://api.x.ai/v1/chat/completions", {
    method: "POST",
    signal: AbortSignal.timeout(28000),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "grok-4.5",
      temperature: 0.7,
      max_tokens: maxTokens,
      ...(jsonMode ? { response_format: { type: "json_object" } } : {}),
      messages: [
        {
          role: "system",
          content:
            "You are the head writer of a vertical short-drama desk. Episodes are 60–80 seconds, adult, concrete, and end on a cliffhanger. No voiceover clichés, no 'little did she know'. Return JSON only with keys logline and episodes. episodes is an array of {n, title, coldOpen, button}. Keep every n you were given. Do not add episodes.",
        },
        {
          role: "user",
          content: `Sharpen this ${payload.trope} series set in ${payload.city}. Title: ${payload.title}. Current logline: ${payload.logline}. Rewrite the logline in 35 words or fewer, and rewrite each episode's title (6 words or fewer), coldOpen (one or two filmable sentences), and button (one cliffhanger sentence).\n${JSON.stringify(payload.episodes)}`,
        },
      ],
    }),
  });
  return res;
}

export const polishSeries = createServerFn({ method: "POST" })
  .validator((input: unknown): Input => parseInput(input))
  .handler(async ({ data }): Promise<PolishResult> => {
    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) return { ok: false, error: "Sharpening is unavailable right now. The draft still stands." };

    let res = await complete(apiKey, data, true);
    if (res.status === 400) res = await complete(apiKey, data, false);
    if (!res.ok) return { ok: false, error: "The rewrite didn't come back. Your draft is intact." };

    const body = (await res.json()) as { choices?: { message?: { content?: string } }[] };
    const text = body.choices?.[0]?.message?.content ?? "";
    try {
      return readResult(extractJson(text), data.logline);
    } catch {
      return { ok: false, error: "The rewrite wasn't readable. Your draft is intact." };
    }
  });

export function applyPolish<T extends { n: number; title: string; coldOpen: string; button: string }>(
  series: { logline: string; episodes: T[] },
  result: { logline: string; episodes: EpOut[] },
): { logline: string; episodes: T[] } {
  const map = new Map(result.episodes.map((ep) => [ep.n, ep]));
  return {
    logline: result.logline || series.logline,
    episodes: series.episodes.map((ep) => {
      const next = map.get(ep.n);
      if (!next) return ep;
      return {
        ...ep,
        title: next.title || ep.title,
        coldOpen: next.coldOpen || ep.coldOpen,
        button: next.button || ep.button,
      };
    }),
  };
}
