import type { StoryCoverInput, StyleCard, StyleChoice } from "./types.js";

/** FNV-1a — a stable hash so the same story picks the same palette on every machine and every run. */
export const stableHash = (s: string): number => {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h >>> 0;
};

const norm = (s: string | undefined) => (s ?? "").toLowerCase().replace(/[^a-z0-9]+/g, "");

/** Either side containing the other: "CountryHouse" ~ "country house estate", "Seaside" ~ "seaside". */
const fuzzy = (a: string | undefined, b: string) => {
  const x = norm(a);
  const y = norm(b);
  return !!x && !!y && (x.includes(y) || y.includes(x));
};

/**
 * How well a card suits a story. Axis 2, location 2, tone 1. Deliberately small and inspectable — the
 * score is printed in the harness so a surprising choice can be read off, not reverse-engineered.
 */
export const scoreCard = (card: StyleCard, input: StoryCoverInput): number => {
  let score = 0;
  if (card.suits.axis.some((a) => fuzzy(input.primaryAxis, a))) score += 2;
  if (card.suits.location.some((l) => fuzzy(input.locationPreset, l) || fuzzy(input.setting, l))) score += 2;
  if (card.suits.tone.some((t) => fuzzy(input.tone, t))) score += 1;
  return score;
};

/** Cards ranked best-first; ties keep the cards' id order. */
export const rankCards = (cards: StyleCard[], input: StoryCoverInput) =>
  cards
    .map((card, i) => ({ card, score: scoreCard(card, input), i }))
    .sort((a, b) => b.score - a.score || a.i - b.i);

/**
 * Parse a style request into choices.
 *   "auto"                       → the single best card
 *   "auto:3"                     → the top 3 cards
 *   "all"                        → every card
 *   "flat-travel-poster,deco-portrait"  → each card on its own
 *   "flat-travel-poster+magazine-illustration" → one BLEND: palette+medium from the first, composition from the second
 * `variants` repeats each choice with the next palette in the card's list.
 */
export const resolveStyleChoices = (
  spec: string,
  cards: StyleCard[],
  input: StoryCoverInput,
  variants = 1,
): StyleChoice[] => {
  const byId = new Map(cards.map((c) => [c.id, c]));
  const get = (id: string) => {
    const c = byId.get(id.trim());
    if (!c) throw new Error(`unknown cover style "${id}" — known: ${[...byId.keys()].join(", ")}`);
    return c;
  };
  const s = (spec || "auto").trim();
  let picks: Array<{ primary: StyleCard; secondary?: StyleCard }>;
  if (s === "all") picks = cards.map((primary) => ({ primary }));
  else if (/^auto(:\d+)?$/.test(s)) {
    const n = Math.max(1, Number(s.split(":")[1] ?? 1));
    picks = rankCards(cards, input).slice(0, n).map(({ card }) => ({ primary: card }));
  } else {
    picks = s.split(",").filter(Boolean).map((part) => {
      const [a, b] = part.split("+");
      return { primary: get(a), secondary: b ? get(b) : undefined };
    });
  }
  const out: StyleChoice[] = [];
  for (const p of picks) {
    const base = stableHash(`${input.title}|${p.primary.id}`);
    for (let v = 0; v < Math.max(1, variants); v++) {
      const palette = p.primary.palettes[(base + v) % p.primary.palettes.length];
      out.push({ ...p, palette });
    }
  }
  return out;
};
