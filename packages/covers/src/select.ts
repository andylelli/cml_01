import { LIGHTS, MYSTERY_TOUCHES, chooseFraming, pick, shuffle, weightedPick, type Rng } from "./framings.js";
import type { CoverAnchors, StoryCoverInput, StyleCard, StyleChoice } from "./types.js";

/** FNV-1a — kept for callers that want a stable hash of a string. */
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

/** How well a card suits a story. Axis 2, location 2, tone 1. Printed by the harness. */
export const scoreCard = (card: StyleCard, input: StoryCoverInput): number => {
  let score = 0;
  if (card.suits.axis.some((a) => fuzzy(input.primaryAxis, a))) score += 2;
  if (card.suits.location.some((l) => fuzzy(input.locationPreset, l) || fuzzy(input.setting, l))) score += 2;
  if (card.suits.tone.some((t) => fuzzy(input.tone, t))) score += 1;
  return score;
};

/** Cards ranked best-first; ties keep the cards' id order. */
export const rankCards = (cards: StyleCard[], input: StoryCoverInput) =>
  cardsForEra(cards, input.era)
    .map((card, i) => ({ card, score: scoreCard(card, input), i }))
    .sort((a, b) => b.score - a.score || a.i - b.i);

/** "1940s", "the 1940s", "1941", "1940" → 1940; anything else → null. */
export const decadeOf = (era: string | undefined): number | null => {
  const m = (era ?? "").match(/(1[89]\d|20\d)(\d)s?/);
  return m ? Number(m[1]) * 10 : null;
};

/**
 * TRUE TO THE DECADE (owner, 2026-10-03): a story draws only from cards tagged with its own decade. With none,
 * the NEAREST tagged decade wins (a 1950s story gets the 1940s cards, never the 1920s ones); with no era at all,
 * every card is eligible. Named cards ("a,b", "a+b") are an explicit override and are not filtered.
 */
export const cardsForEra = (cards: StyleCard[], era: string | undefined): StyleCard[] => {
  const d = decadeOf(era);
  if (d === null) return cards;
  const dist = (c: StyleCard) => Math.min(...c.decades.map((x) => Math.abs((decadeOf(x) ?? 9999) - d)));
  const best = Math.min(...cards.map(dist));
  return cards.filter((c) => dist(c) === best);
};

/** Share of "auto" covers that blend two cards (palette+medium from one, layout+motifs from the other). */
export const BLEND_CHANCE = 0.35;

/**
 * Parse a style request into choices. EVERY random decision draws from `rng`, so one recorded seed
 * reproduces a cover exactly and a fresh seed makes a different one.
 *
 *   "auto" / "auto:N" → N covers, each card a weighted random pick (weight = fit score + 1, so a good fit is
 *                       likelier but never certain); BLEND_CHANCE of them blend in a second card
 *   "all"             → every card of the story's decade once
 *   "a,b"             → each named card
 *   "a+b"             → one explicit blend
 * Per cover the rng also draws the palette, the FRAMING (what/where — framings.ts), two mystery touches,
 * the light and the object. Within one call, covers do not repeat a framing until all have been used.
 */
export const resolveStyleChoices = (
  spec: string,
  cards: StyleCard[],
  input: StoryCoverInput,
  variants = 1,
  rng: Rng = Math.random,
  anchors?: CoverAnchors,
): StyleChoice[] => {
  const byId = new Map(cards.map((c) => [c.id, c]));
  const get = (id: string) => {
    const c = byId.get(id.trim());
    if (!c) throw new Error(`unknown cover style "${id}" — known: ${[...byId.keys()].join(", ")}`);
    return c;
  };
  const weightOf = (c: StyleCard) => scoreCard(c, input) + 1;
  const s = (spec || "auto").trim();
  const eraCards = cardsForEra(cards, input.era);
  let picks: Array<{ primary: StyleCard; secondary?: StyleCard }>;
  if (s === "all") picks = eraCards.map((primary) => ({ primary }));
  else if (/^auto(:\d+)?$/.test(s)) {
    const n = Math.max(1, Number(s.split(":")[1] ?? 1));
    picks = Array.from({ length: n }, () => {
      const primary = weightedPick(rng, eraCards, weightOf);
      const others = eraCards.filter((c) => c.id !== primary.id);
      const secondary = others.length && rng() < BLEND_CHANCE ? weightedPick(rng, others, weightOf) : undefined;
      return { primary, secondary };
    });
  } else {
    picks = s.split(",").filter(Boolean).map((part) => {
      const [a, b] = part.split("+");
      return { primary: get(a), secondary: b ? get(b) : undefined };
    });
  }

  const objects = anchors?.clue_candidates?.length ? anchors.clue_candidates : anchors ? [anchors.clue_object] : [];
  const usedFramings = new Set<string>();
  const out: StyleChoice[] = [];
  for (const p of picks) {
    const palettes = shuffle(rng, p.primary.palettes);
    for (let v = 0; v < Math.max(1, variants); v++) {
      if (usedFramings.size >= 10) usedFramings.clear();
      const framing = chooseFraming(rng, input.primaryAxis, usedFramings);
      usedFramings.add(framing.id);
      out.push({
        ...p,
        palette: palettes[v % palettes.length],
        framing,
        touches: shuffle(rng, MYSTERY_TOUCHES).slice(0, 2),
        light: framing.light ?? pick(rng, LIGHTS),
        object: objects.length ? pick(rng, objects) : undefined,
      });
    }
  }
  return out;
};
