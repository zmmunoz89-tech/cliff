import { money, pct, type Quote } from "@/lib/cliff/money";
import { tropeById } from "@/lib/cliff/market";
import type { Assumptions, Series } from "@/lib/cliff/types";

export function seriesMarkdown(series: Series, buyer: boolean, assumptions: Assumptions, quote: Quote) {
  const trope = tropeById(series.tropeId);
  const header = buyer
    ? "CLIFF slate — prepared for a buyer."
    : "CLIFF desk draft. Not a circulating script.";
  const lines: string[] = [
    `# ${series.title}`,
    "",
    header,
    "",
    `${trope.name} · ${series.city} · ${series.episodes.length} episodes · ${series.tone === "whip" ? "Whiplash" : "Slow burn"}`,
    "",
    "## Logline",
    series.logline,
    "",
    "## Promise",
    series.promise,
    "",
    `Audience: ${series.audience}`,
    `Buyer: ${series.buyer}`,
    "",
    "## Cast",
  ];
  for (const person of series.cast) {
    lines.push(`- **${person.name}** — ${person.role}. Wants: ${person.want} Wound: ${person.wound}`);
  }
  lines.push("", "## Episodes");
  for (const ep of series.episodes) {
    lines.push(
      "",
      `### ${String(ep.n).padStart(2, "0")} — ${ep.title}`,
      ep.slug,
      "",
      `Cold open: ${ep.coldOpen}`,
      `Turn: ${ep.turn}`,
      `Button: ${ep.button}`,
      "Beats:",
      ...ep.beats.map((beat) => `- ${beat}`),
    );
  }
  lines.push(
    "",
    "## Desk math",
    `Model: ${assumptions.model === "buyout" ? "Flat buyout" : "Unlock share"}`,
    `Episodes: ${quote.episodes}. Cost ${money(quote.cost)}. Receipts ${money(quote.gross)}. Net ${money(quote.net)} (${pct(quote.margin)}).`,
    quote.verdictLine,
    "Desk estimate. Not a forecast.",
    "",
  );
  return lines.join("\n");
}
