/**
 * Locked-fact value SHAPE analysis: is a value atomic, and which two atomic values form the story's
 * single canonical contradiction?
 *
 * WHY THIS IS A LEAF MODULE (S6 prerequisite, architecture/REVIEW_01.md).
 * These functions were defined in `agent9-prose/prompt-builder.ts` and imported by `world-state.ts`,
 * which sits OUTSIDE `agent9-prose/`. Meanwhile fourteen modules inside `agent9-prose/` import from
 * the package root (`../story-bible.js`, `../agent5-clues.js`, …). That made the dependency between
 * `agent9-prose/` and its parent BIDIRECTIONAL, which is why S6 — "extract agent9-prose into its own
 * package" — could not be done as written: the extraction would have produced a package cycle, not a
 * layer. REVIEW §5.5 asserts "the engine consumes prompts; it is not one"; that was true in one
 * direction only.
 *
 * Moving these three symbols to a leaf that imports NOTHING removes one of the two back-edges. The
 * behaviour is unchanged — this is a move, verified by the compiler and by the existing A_57/A_58
 * tests, not a rewrite. `prompt-builder.ts` re-exports them so every existing importer still works.
 *
 * Everything here is PARAMETER-GENERIC: it keys off a value's shape, never its content, so it works
 * across a clock, a tide table, a thermometer, or a ledger.
 */

// A_58 review: a CLOCK TIME requires a number/number-word around the preposition — not a bare `to`/
// `half`/`quarter`, which match ordinary English ("pinned TO the door", "a QUARTER of the estate",
// "the HALF-open door"). The old `\b(?:past|to|quarter|half)\b` test mis-classified such descriptive
// values as atomic (D1) and could pair them as a bogus discriminating contradiction (D2). Matches:
// "3:30", "4.20", "ten o'clock", "half past three", "quarter to nine", "twenty minutes past four",
// "thirteen minutes to midnight". Does NOT match a bare preposition with no clock number on both sides.
const TIME_NUM =
  "(?:zero|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty|thirty|forty|fifty|sixty|noon|midnight|midday|quarter|half)";

const CLOCK_TIME_RE = new RegExp(
  "\\d{1,2}\\s*[:.]\\s*\\d{2}" + // 3:30 / 4.20
    "|\\b[\\w-]+\\s+o[’']clock\\b" + // ten o'clock
    `|\\b(?:${TIME_NUM}|\\d{1,2})(?:[-\\s]${TIME_NUM})*\\s+(?:minutes?\\s+)?(?:past|to)\\s+(?:the\\s+)?(?:${TIME_NUM}|\\d{1,2})\\b`, // half past three / twenty minutes past four / thirteen minutes to midnight
  "i",
);

// Canonical singular for each measurement unit, so a staged/true pair of the SAME scale merges even
// across irregular plurals ("ten feet" vs "twelve foot"; "metres" vs "meters").
const UNIT_CANON: Record<string, string> = {
  minutes: "minute", minute: "minute", hours: "hour", hour: "hour", seconds: "second", second: "second",
  degrees: "degree", degree: "degree", feet: "foot", foot: "foot", metres: "metre", metre: "metre",
  meters: "metre", meter: "metre", yards: "yard", yard: "yard", inches: "inch", inch: "inch",
  paces: "pace", pace: "pace", miles: "mile", mile: "mile", pounds: "pound", pound: "pound",
  ounces: "ounce", ounce: "ounce", stone: "stone", grains: "grain", grain: "grain",
};

const UNIT_RE =
  /\b(minutes?|hours?|seconds?|degrees?|feet|foot|metres?|meters?|yards?|inches?|paces?|miles?|pounds?|ounces?|stone|grains?)\b/i;

/**
 * A_57 D1 — is a locked-fact value ATOMIC (a time / number / measurement that must be reproduced
 * verbatim) vs DESCRIPTIVE (a log entry / weather note / document clause that must be paraphrased, not
 * spliced in verbatim)? Parameter-generic: keys off the value's shape, never its content. Exported so
 * the prose prompt and the worker's locked-fact presence enforcer agree on which facts are verbatim.
 */
export const isAtomicLockedFactValue = (raw: string): boolean => {
  const v = String(raw ?? "").trim();
  if (!v) return false;
  // A clue-critical time may carry a trailing day-part ("…past four in the afternoon"); it is still an
  // atomic time and must stay verbatim. Strip that qualifier before the length check so a pure time of 7+
  // words ("twenty minutes past four in the afternoon") is not misread as a descriptive clause and routed
  // to the paraphrase block — which would lose fidelity on the single most clue-critical value.
  const core = v.replace(/[,\s]+(?:in\s+the\s+(?:morning|afternoon|evening)|at\s+night)\.?$/i, "").trim();
  const words = core.split(/\s+/).filter(Boolean);
  if (words.length > 6) return false; // a clause/sentence is descriptive
  if (/\d/.test(core) || CLOCK_TIME_RE.test(core) || UNIT_RE.test(core)) {
    return true; // time / measurement / quantity
  }
  if (
    words.length <= 3 &&
    /^(?:one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty|thirty|forty|fifty|sixty)\b/i.test(
      core,
    )
  ) {
    return true; // a short number-word amount
  }
  return false;
};

/**
 * A_57 D2 — the discriminating dimension of an atomic locked-fact value: a clock-time, else a measurement
 * unit, used to pair a STAGED value against a TRUE value of the SAME scale. Bare counts (no unit, no time)
 * return null: two unrelated tallies ("three drops", "two letters") are NOT a comparable contradiction, so
 * they must never be paired. Parameter-generic — keys off the value's shape, never its content.
 */
const lockedFactDimension = (raw: string): string | null => {
  const v = String(raw ?? "").trim().toLowerCase();
  if (!v) return null;
  if (CLOCK_TIME_RE.test(v)) return "time"; // a real clock time, not a bare to/half/quarter (A_58 review)
  const unit = v.match(UNIT_RE);
  if (unit) return `unit:${UNIT_CANON[unit[1].toLowerCase()] ?? unit[1].toLowerCase().replace(/s$/, "")}`;
  return null; // a bare count is not a comparable dimension — never pair on it
};

export interface DiscriminatingContradictionPair {
  /** the two contradicting locked-fact values (a staged value and the true value), in registry order */
  values: [string, string];
  /** their locked-fact descriptions, for the obligation text */
  descriptions: [string, string];
}

/**
 * A_57 D2 — find the "single canonical contradiction" pair among the locked facts. A discriminating
 * timeline/quantity mystery turns on a STAGED value and a TRUE value of the SAME dimension (two
 * clock-times, two readings). When the prose states both as flat parallel truths instead of ONE
 * contradiction, a human reads "the central clue contradicts itself" (ChatGPT's biggest problem on run
 * 09168377). Returning the pair lets the chapter obligation require them to appear AS A CONTRAST.
 *
 * Conservative: groups the ATOMIC locked facts by dimension (clock-time / measurement unit) and returns a
 * pair ONLY when exactly one dimension holds exactly two DISTINCT values. Any ambiguity (no such
 * dimension, three+ same-dimension values, or several candidate pairs) → null, so a wrong contrast is
 * never forced onto unrelated facts. Parameter-generic across clock, tide table, thermometer, or ledger.
 */
export const findDiscriminatingContradictionPair = (
  lockedFacts: ReadonlyArray<{ description?: string; value?: string }> | undefined,
): DiscriminatingContradictionPair | null => {
  if (!Array.isArray(lockedFacts)) return null;
  const byDim = new Map<string, Array<{ description: string; value: string }>>();
  for (const f of lockedFacts) {
    const value = String(f?.value ?? "").trim();
    if (!value || !isAtomicLockedFactValue(value)) continue;
    const dim = lockedFactDimension(value);
    if (!dim) continue;
    const list = byDim.get(dim) ?? [];
    if (!list.some((x) => x.value.toLowerCase() === value.toLowerCase())) {
      list.push({ description: String(f?.description ?? "").trim(), value });
      byDim.set(dim, list);
    }
  }
  const candidates = [...byDim.values()].filter((list) => list.length === 2);
  if (candidates.length !== 1) return null; // none, or ambiguous (multiple candidate pairs)
  const [a, b] = candidates[0];
  return { values: [a.value, b.value], descriptions: [a.description, b.description] };
};

/**
 * A_72 C2 — what the WRITER is told a locked fact is called.
 *
 * ── THE DEFECT, QUOTED FROM THE PAGE ─────────────────────────────────────────────────────────────
 *
 * Every locked fact carries an authored `description` — internal metadata, written for the pipeline:
 *
 *     "The official high tide time on the murder day as per hotel tide charts"
 *
 * Three prompt sites rendered that straight to Agent 9 as `description: "value"`. It is prose, so the
 * writer treated it as prose, and — under the simultaneous instruction never to repeat a phrase — it
 * came back paraphrased and worse than itself in the shipped 2026-08-23 manuscript:
 *
 *     "The CERTIFIED WAVE CREST HOUR atop the murder day AS PER INNKEEPER'S TIDE CHARTS was clear."
 *
 * `as per … tide charts` and `the murder day` are lifted from the description; *official high tide
 * time* became *certified wave crest hour* because repeating it was forbidden. **That is the mechanism
 * behind "generated validation language"** — the complaint attached to `prose` in read after read, and
 * the reason that manuscript scored `prose` 6/10 (A_72 §5).
 *
 * ── THE FIX: A LABEL IS NOT A SENTENCE ───────────────────────────────────────────────────────────
 *
 * The writer needs to know which fact is which. It does not need the pipeline's sentence about it. The
 * `id` is already exactly that — a short, neutral name — so `high_tide_time` becomes **"high tide
 * time"**. There is nothing there to paraphrase into purple, because it is not written in a voice.
 *
 * The description is NOT deleted from the registry, the artifact, or any validator: it stays wherever
 * humans and gates read it. This is only about what crosses into the writer's prompt.
 *
 * Falls back to the description when a fact has no usable id — truncated to its first few words, so a
 * malformed fact degrades to something short rather than reintroducing the paragraph.
 */
export const lockedFactLabel = (fact: { id?: unknown; description?: unknown }): string => {
  const id = String(fact?.id ?? "").trim();
  if (id.length > 0) {
    const humanised = id
      .replace(/[_\-.]+/g, " ")
      // camelCase / PascalCase ids read as words too: `highTideTime` -> `high Tide Time`.
      .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase();
    if (humanised.length >= 2) return humanised;
  }
  // No usable id. Keep the first few words of the description rather than the whole sentence: short
  // enough not to read as prose, long enough to identify the fact.
  const words = String(fact?.description ?? "").trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "locked value";
  return words.slice(0, 5).join(" ").replace(/[.,;:]$/, "");
};
