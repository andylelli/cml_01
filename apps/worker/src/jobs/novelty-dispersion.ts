/**
 * novelty-dispersion.ts — ANALYSIS_74 §8 **DE2** and **DE4**.
 *
 * ── DE2: THE STATISTIC THE ENGINE WAS MISSING ────────────────────────────────────────────────────
 *
 * `judgeNovelty` (packages/novelty/src/compare.ts) is a NEAREST-NEIGHBOUR criterion: it returns the
 * worst single neighbour and asks "am I a clone of some one prior case?". That question cannot detect
 * a monoculture, because a minimum-pairwise-distance test is satisfied by points spread along a line
 * and has no term for the dimensions the points never leave.
 *
 * Measured on the shipped ledger (`apps/api/data/novelty-ledger.json`, 7 records) at the time this
 * was written:
 *
 *     axis            7 / 7   temporal          <- the only enum field recorded
 *     crimeSubtype    7 / 7   distinct strings  <- "perfect variety", by construction
 *     deathMethod     7 / 7   distinct strings  <- "perfect variety", by construction
 *
 * Every PAIR of those seven shares `axis` and nothing else, so `sharedFields` returns length 1 and
 * every pair scores `distinct` — in a corpus that is 100% temporal. Under uniform sampling from six
 * axes, P(seven identical) = 6 x (1/6)^7 ~ 1.4e-5, so this is not sampling variation.
 *
 * The fix is a SECOND statistic, not a replacement: separation answers "is this one a copy?",
 * dispersion answers "is the corpus collapsing?". Normalised Shannon entropy over a trailing window,
 * one number per field, in [0, 1] where 1 = perfectly even coverage and 0 = one value only.
 *
 * **No threshold is set here, deliberately.** A threshold chosen before the number has ever been
 * observed is a guess, and this repo has paid for guessed thresholds before. Publish first.
 *
 * ── DE4: ONE FAMILY VOCABULARY ───────────────────────────────────────────────────────────────────
 *
 * Six vocabularies exist for "what kind of trick is this", and none of them ever classified a SHIPPED
 * run:
 *
 *     @cml/novelty      Axis                       6 values, includes `epistemic`
 *     @cml/device-library CmlAxis                  5 values, NO `epistemic`
 *     @cml/novelty      MechanismFamily           14 values  <- canonical here (most expressive)
 *     @cml/device-library MechanismFamily          5 values
 *     agent3b           MECHANISM_FAMILY_KEYWORDS  8 values, used ONLY for theme coherence
 *     agents/shared.ts  FAMILY_AXIS                free text ("schedule contradiction")
 *
 * That is why the ledger records `deathMethod: "struck with a heavy brass choir bell clapper"` and
 * calls it novel: it stores a free-text string that is guaranteed to differ, and stores nothing that
 * could reveal the eight consecutive time-of-death tricks underneath.
 *
 * `classifyMechanismFamily` maps a shipped run's own text onto `@cml/novelty`'s 14-value
 * `MechanismFamily` — the widest of the six vocabularies, and the one the structural judge already
 * compares on. It is deliberately a KEYWORD classifier, not an LLM call: it runs on the existing
 * ledger with no spend, it is reproducible, and a wrong answer is visible in the same log line as the
 * text it was derived from. `"unclassified"` is a first-class outcome and is NEVER silently folded
 * into a real family — an unclassified run is a gap in the vocabulary and must read as one.
 */

import type { MechanismFamily } from "@cml/novelty";
import type { PriorRunRecord } from "./novelty-ledger.js";

/** `@cml/novelty`'s 14 values, plus the honest escape hatch. */
export type LedgerFamily = MechanismFamily | "unclassified";

/**
 * Keyword rules, most specific first. Order matters: `poison_delayed` must beat `poison_substitution`
 * when both could match, and both must beat a bare `poison` mention elsewhere in the sentence.
 *
 * Stems are chosen the way `MECHANISM_FAMILY_KEYWORDS` chooses them — specific enough not to fire on
 * ordinary mystery prose. "the heat of the moment" must not classify as a thermal device.
 */
const FAMILY_RULES: ReadonlyArray<{ family: MechanismFamily; re: RegExp }> = [
  { family: "locked_room_timing", re: /\b(clock|chime|pendulum|timepiece|horolog|sundial|gnomon|hourglass|bell tower|tide|tidal|sluice|thermal|heat expansion|fuse|candle|burn(ed|t) down)\b/i },
  { family: "locked_room_key", re: /\b(locked (room|door|study)|bolt|latch|key|sealed (room|study)|string and pulley|pulley)\b/i },
  { family: "poison_delayed", re: /\b(delayed (dose|onset|poison)|slow[- ]acting|aconite|digitalis|onset|incubat)\b/i },
  { family: "poison_substitution", re: /\b(poison|toxin|venom|arsenic|cyanide|strychnine|dosage|toxicolog)\b/i },
  { family: "recorded_presence", re: /\b(gramophone|phonograph|recording|recorded|wireless|loudspeaker|acoustic|echo chamber|soundproof)\b/i },
  { family: "impersonation", re: /\b(impersonat|disguise|masquerade|double identity|passed himself|passed herself)\b/i },
  { family: "substituted_body", re: /\b(substituted body|wrong body|misidentified (corpse|body)|body swap)\b/i },
  { family: "alibi_fabrication", re: /\b(alibi|corroborat|vouched for|witness statement|timetable|train time)\b/i },
  { family: "staged_scene", re: /\b(staged|arranged the (scene|body)|moved the body|rearranged|tableau)\b/i },
  { family: "hidden_accomplice", re: /\b(accomplice|confederate|second pair of hands|working together)\b/i },
  { family: "secret_will_inheritance", re: /\b(will|codicil|inherit|legacy|bequest|estate settlement)\b/i },
  { family: "information_leak", re: /\b(overheard|letter|telegram|note|leaked|intercepted (post|mail))\b/i },
  { family: "disguised_natural_agent", re: /\b(natural causes|allerg|bee sting|heart failure|apparent accident)\b/i },
  { family: "unconscious_act", re: /\b(sleepwalk|somnambul|hypnot|drugged into|no memory of)\b/i },
];

/**
 * Classify one shipped run's free text into the canonical vocabulary.
 *
 * The caller passes every text field that could carry the mechanism — subtype, manner of death, the
 * discriminating test, the premise. A device is described in different fields on different runs and a
 * classifier that reads only one of them inherits that lottery.
 */
export const classifyMechanismFamily = (...texts: Array<string | undefined>): LedgerFamily => {
  const hay = texts.filter(Boolean).join(" | ");
  if (!hay.trim()) return "unclassified";
  for (const rule of FAMILY_RULES) if (rule.re.test(hay)) return rule.family;
  return "unclassified";
};

/** Classify a ledger record from whichever of its fields carry mechanism text. */
export const familyOfRecord = (r: PriorRunRecord): LedgerFamily =>
  r.mechanismFamily && r.mechanismFamily !== "unclassified"
    ? (r.mechanismFamily as LedgerFamily)
    : classifyMechanismFamily(r.crimeSubtype, r.deathMethod, r.discrimMethod, r.discrimDesign, r.falseAssumption, r.premise);

// ── DE2: dispersion ──────────────────────────────────────────────────────────────────────────────

export interface FieldDispersion {
  field: string;
  /** Distinct values observed in the window. */
  distinct: number;
  /** Size of the vocabulary this field is drawn from, when it has one. `null` for free text. */
  vocabulary: number | null;
  /**
   * Normalised Shannon entropy in [0, 1]. Normalised by `log(vocabulary)` when the field has a closed
   * vocabulary, else by `log(n)` — because for FREE TEXT the achievable maximum is "every run
   * different", which is exactly the degenerate case that made `crimeSubtype` look healthy. A
   * free-text field near 1.0 therefore means nothing at all, and the `vocabulary: null` marker in the
   * output is what says so.
   */
  entropy: number;
  /** Most common value and its share, so a collapse names its own cause. */
  top: { value: string; count: number; share: number } | null;
}

const shannon = (counts: number[], n: number): number => {
  let h = 0;
  for (const c of counts) {
    if (c <= 0) continue;
    const p = c / n;
    h -= p * Math.log(p);
  }
  return h;
};

const dispersionOf = (field: string, values: string[], vocabulary: number | null): FieldDispersion => {
  const present = values.map((v) => (v ?? "").trim().toLowerCase()).filter((v) => v.length > 0);
  const n = present.length;
  if (n === 0) return { field, distinct: 0, vocabulary, entropy: 0, top: null };
  const counts = new Map<string, number>();
  for (const v of present) counts.set(v, (counts.get(v) ?? 0) + 1);
  const h = shannon([...counts.values()], n);
  // Normalise by the achievable maximum: log(vocabulary) for a closed set, log(n) for free text.
  const denom = Math.log(Math.max(2, vocabulary ?? Math.max(2, n)));
  const [topValue, topCount] = [...counts.entries()].sort((a, b) => b[1] - a[1])[0];
  return {
    field,
    distinct: counts.size,
    vocabulary,
    entropy: Math.min(1, h / denom),
    top: { value: topValue, count: topCount, share: topCount / n },
  };
};

export interface LedgerDispersion {
  window: number;
  fields: FieldDispersion[];
}

/** The six novelty axes and the fourteen mechanism families are the two closed vocabularies. */
const AXIS_VOCABULARY = 6;
const FAMILY_VOCABULARY = 14;

/**
 * Dispersion over the most recent `window` shipped runs.
 *
 * `axis` and `mechanismFamily` carry a vocabulary size; `crimeSubtype`, `deathMethod` and `location`
 * are free text and are reported with `vocabulary: null` so nobody reads their near-1.0 entropy as
 * health. That misreading is the whole reason this file exists.
 */
export const ledgerDispersion = (records: PriorRunRecord[], window = 20): LedgerDispersion => {
  const recent = records.slice(-window);
  return {
    window: recent.length,
    fields: [
      dispersionOf("axis", recent.map((r) => r.axis), AXIS_VOCABULARY),
      dispersionOf("mechanismFamily", recent.map((r) => familyOfRecord(r)), FAMILY_VOCABULARY),
      dispersionOf("crimeSubtype", recent.map((r) => r.crimeSubtype), null),
      dispersionOf("deathMethod", recent.map((r) => r.deathMethod), null),
      dispersionOf("location", recent.map((r) => r.location), null),
      dispersionOf("era", recent.map((r) => r.era), null),
    ],
  };
};

/**
 * One block in the run log. Prints the free-text fields too, marked `(free text)`, precisely so the
 * contrast between a closed vocabulary at 0.00 and free text at 1.00 is visible in one glance — that
 * contrast IS the finding.
 */
export const logLedgerDispersion = (records: PriorRunRecord[], window = 20): void => {
  const d = ledgerDispersion(records, window);
  if (d.window === 0) {
    console.warn("[DE2 dispersion] ledger is EMPTY — no dispersion to report. See the novelty-ledger warning above.");
    return;
  }
  console.warn(`[DE2 dispersion] corpus coverage over the last ${d.window} shipped run(s) — 1.00 = even, 0.00 = one value only`);
  for (const f of d.fields) {
    const vocab = f.vocabulary === null ? "(free text)" : `of ${f.vocabulary}`;
    const top = f.top ? `top "${f.top.value}" ${Math.round(f.top.share * 100)}%` : "no values";
    console.warn(
      `  · ${f.field.padEnd(16)} H=${f.entropy.toFixed(2)}  ${String(f.distinct).padStart(2)} distinct ${vocab.padEnd(11)} ${top}`,
    );
  }
};
