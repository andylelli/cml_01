/**
 * X95 — the opening-grounding vocabulary, in ONE place.
 *
 * ── THE TWO-BODY PROBLEM, FOUND FOR THE EIGHTH TIME ──────────────────────────────────────────────
 *
 * The sensory and atmosphere wordlists that gate every chapter opening existed in **six** places when
 * this file was written: the validator that enforces them (`chapter-validator.ts`), the scene-grounding
 * checklist in the prompt (`context-management.ts`), two retry-repair directives and one from-scratch
 * feedback block (`generate.ts` ×3), and the per-chapter obligation block (`obligation-block.ts`).
 *
 * They had drifted, and in the direction that costs a retry: **`context-management.ts` offered the
 * model "weather", which the validator does not accept.** A chapter grounded on the word the prompt
 * suggested fails the gate that suggested it. Two of the `generate.ts` copies also show a SHORTER
 * atmosphere list than the validator counts (no `pale`, `chill`, `crisp`, `damp`, `drizzle`, `haze`,
 * `lamplight`, `firelight`), which is safe but is the same drift running the other way.
 *
 * X61, X67, X74, X75 and X79 each bought this lesson already. **The durable fix is one list.**
 *
 * ── MATCHING IS SUBSTRING, AND THAT IS LOAD-BEARING ──────────────────────────────────────────────
 *
 * The validator asks `openingBlockText.includes(term)`, not a word-boundary regex. `sound` therefore
 * matches "sounds", `light` matches "lighting" and "lamplight", `warm` matches "warmth". Changing this
 * to `\b…\b` would silently tighten a gate that drives retries on every chapter of every run, so the
 * behaviour is preserved exactly and stated here rather than left to be rediscovered.
 *
 * ── WHY THE LIST BEING CLOSED IS ITSELF A FINDING ────────────────────────────────────────────────
 *
 * Measured over the 35 archived manuscripts with an external read: `chill` appears in 26% of first
 * sentences, `damp` in 23%, `faint` in 23%. The same 18 words are presented, identically, on every
 * chapter of every run, and enforced — so the model converges on the same handful. `opening_hook` and
 * `atmosphere` between them account for two of the five categories no reader has ever given a 9.
 *
 * `groundingPaletteFor` is the answer to that: the VALIDATOR keeps accepting the whole list, and the
 * PROMPT leads with a rotating subset. Nothing can fail that did not fail before — a subset of an
 * accepted list is still accepted — and two stories stop being told to reach for the same five words.
 */

/**
 * The 18 sensory markers, grouped by sense.
 *
 * Grouped rather than flat because two of the six former copies rendered them as
 * "Smell/scent: … · Sound: … · Tactile: … · Visual/light: …" and one rendered them flat; deriving the
 * flat list from the groups is what stops those two renderings drifting apart again.
 *
 * ORDER IS PART OF THE DATA: `groundingPaletteFor` walks it, so reordering changes which words each
 * chapter is shown first.
 */
export const OPENING_SENSORY_GROUPS: ReadonlyArray<{ label: string; terms: readonly string[] }> = [
  { label: "Smell/scent", terms: ["smell", "scent", "odor", "fragrance"] },
  { label: "Sound", terms: ["sound", "echo", "silence", "whisper", "creak"] },
  { label: "Tactile", terms: ["cold", "warm", "damp", "rough", "smooth"] },
  { label: "Visual/light", terms: ["glow", "shadow", "flicker", "dim"] },
];

/** The flat list, DERIVED from the groups — so the grouped and flat renderings cannot disagree. */
export const OPENING_SENSORY_MARKERS: readonly string[] = OPENING_SENSORY_GROUPS.flatMap((g) => g.terms);

/**
 * The atmosphere/time markers. One must appear in a chapter's first two paragraphs.
 *
 * ── THE DIVERGENCE, AND WHY IT IS CLOSED THIS WAY ROUND ──────────────────────────────────────────
 *
 * `context-management.ts` was offering the model two words this list does not contain: `weather` and
 * `lighting`. `lighting` is harmless — `light` matches it by substring. `weather` was not: a chapter
 * grounded on the word the prompt suggested failed the gate that suggested it.
 *
 * The first fix here added `weather` to the gate, on the reasoning that a gate accepting MORE can
 * never cause a retry that did not already happen. **A test said otherwise, and the test was right.**
 * `chapter-validator.test.ts` grounds its negative fixture on the sentence *"No one commented on the
 * room or the weather"* — deliberately using the abstract noun to show what does NOT count as
 * atmosphere. Naming the weather is not weather; the gate was correct and the PROMPT was wrong, so the
 * word came out of the prompt instead. Closing a two-body divergence still requires deciding which
 * body was right.
 */
export const OPENING_ATMOSPHERE_MARKERS: readonly string[] = [
  "rain", "wind", "fog", "storm", "mist", "thunder",
  "evening", "morning", "night", "dawn", "dusk", "season",
  "afternoon", "midday", "noon", "midnight", "twilight",
  "sunrise", "sunset", "daylight", "sunlight", "overcast",
  "cloudy", "bright", "grey", "gray", "dark", "light",
  "pale", "cold", "warm", "chill", "crisp", "damp",
  "drizzle", "haze", "lamplight", "firelight",
];

/** Look a group up by label — the groups are the source, so nothing here re-types a term. */
const groupTerms = (label: string): readonly string[] =>
  OPENING_SENSORY_GROUPS.find((g) => g.label === label)?.terms ?? [];

/**
 * The two half-lists the final-attempt repair directive uses when it dictates a two-sentence opening.
 * Derived, not re-typed: that directive is the LAST thing a chapter sees before it is abandoned, and a
 * stale copy there fails the chapter it was written to rescue.
 */
export const SENSORY_SOUND_AND_TACTILE: readonly string[] = [...groupTerms("Sound"), ...groupTerms("Tactile")];
export const SENSORY_VISUAL_AND_SMELL: readonly string[] = [...groupTerms("Visual/light"), ...groupTerms("Smell/scent")];

/** How many of `markers` appear in `text`. Substring semantics — see the header. */
export function countGroundingMarkers(text: string, markers: readonly string[]): number {
  const haystack = text.toLowerCase();
  return markers.filter((term) => haystack.includes(term)).length;
}

/** Render a list for a prompt. One renderer, so the prompts cannot drift from each other either. */
export function formatGroundingMarkers(markers: readonly string[], separator = " / "): string {
  return markers.join(separator);
}

/**
 * A deterministic rotating subset, for the PROMPT only.
 *
 * Same seeding discipline as the opening-style rotation (X94): an FNV-1a hash of a per-story string,
 * never `Math.random`, because runs in this project are replayed and A/B'd and a random palette makes
 * two runs of one case incomparable.
 *
 * The stride must be COPRIME to the list length, and "make it odd" is not enough — that was the first
 * version and it shipped short palettes. `n = 18` with a stride of 3, 9 or 15 walks only `18 / gcd`
 * distinct indices, so the loop exhausts after 6 and returns 6 words where 8 were asked for.
 *
 * FOUND BY READING THE SHIPPED PROMPT of the first run that carried this (2026-08-23,
 * `run_20260823-1558`): the checklist offered *"choose from shadow/rough/cold/silence/fragrance/smell"*
 * — six, not eight. Harmless in itself, and it is exactly the class of defect this project keeps
 * finding: a function that quietly returns less than it was asked for, with a test that happened to
 * pick a seed where it did not. The stride is now advanced until `gcd(stride, n) === 1`.
 */
export function groundingPaletteFor(
  chapterNumber: number,
  seed: string | undefined,
  markers: readonly string[],
  size: number,
): string[] {
  const n = markers.length;
  const take = Math.max(1, Math.min(size, n));
  let h = 0x811c9dc5;
  for (let i = 0; i < (seed ?? "").length; i += 1) {
    h ^= (seed as string).charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  const offset = h % n;
  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
  let stride = (h % Math.max(1, n - 1)) + 1;
  // Walk up to a stride coprime with n, so the cycle visits every index before repeating one.
  for (let guard = 0; gcd(stride, n) !== 1 && guard < n; guard += 1) stride = (stride % n) + 1;
  const start = (offset + chapterNumber * take) % n;
  const out: string[] = [];
  const seen = new Set<number>();
  for (let k = 0; out.length < take && k < n * 2; k += 1) {
    const idx = (((start + k * stride) % n) + n) % n;
    if (seen.has(idx)) continue;
    seen.add(idx);
    out.push(markers[idx]!);
  }
  return out;
}
