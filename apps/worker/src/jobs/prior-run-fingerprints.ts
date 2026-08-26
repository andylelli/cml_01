/**
 * prior-run-fingerprints.ts — ANALYSIS_74 §8 **DE3**, the bridge that was missing.
 *
 * The pipeline has two novelty organs and until now they were wired to different worlds:
 *
 *     the LEDGER          sees prior runs        speaks only in free-text avoidance lines to a prompt
 *     the SKELETON JUDGE  sees a FIXED corpus    speaks a structured verdict, in shadow, to a console
 *
 * `loadReferenceCorpus()` was called with no arguments, so the judge compared each candidate against
 * 14 seeds and a cliche ledger and was never shown a run this pipeline had produced. Meanwhile
 * `CORPUS_SPECIFICITY` in that same loader ranks `prior_run` highest — the design always expected
 * these; nobody ever built them. This module builds them.
 *
 * ── WHAT A LEDGER RECORD CAN AND CANNOT SUPPLY ───────────────────────────────────────────────────
 *
 * A `Fingerprint` has five fields. A `PriorRunRecord` can honestly supply three:
 *
 *     axis                        DIRECT      already canonicalised by `mapToNoveltyAxis`
 *     mechanism_family            DE4         classified from the run's own text
 *     discriminating_test_shape   DERIVED     keyword-mapped from `discrimMethod` / `discrimDesign`
 *     false_assumption_pattern    ABSENT      the ledger stores a full sentence, not a snake label
 *     inference_shape             ABSENT      never recorded at all
 *
 * The two absent fields are left EMPTY rather than filled with a snake-cased sentence. That choice is
 * the whole point of the module and it costs something, so it is worth stating plainly: `sharedFields`
 * compares by exact string equality, so a snake-cased sentence would never match an LLM's short label
 * anyway — but it would LOOK like a populated field to anyone reading the corpus. An empty field that
 * is documented as empty is honest; a populated field that can never match is a decoy, and this repo
 * has been bitten by exactly that (A_74 §8.1.3).
 *
 * ── WHAT THIS WILL AND WILL NOT CHANGE, PREDICTED IN ADVANCE ─────────────────────────────────────
 *
 * It will NOT flip the verdict on its own, and expecting it to would be a misreading of `severity`.
 * A candidate sharing `axis` + `mechanism_family` with a prior run scores `shared.length === 2`,
 * `sharesBelief === false`, `trickShared === 1` — which falls through both branches to **`distinct`**.
 * Eight consecutive time-of-death tricks would each be pronounced distinct from the last.
 *
 * That is not a reason to skip DE3; it is the reason `cellRepeatDepth` below exists. The verdict
 * label is a threshold decision with a wide blast radius and it stays untouched while the judge is in
 * shadow. The REPEAT DEPTH is the number that actually answers the question, it needs no threshold,
 * and it is reported next to the verdict precisely so a "distinct" printed beside a depth of 8 reads
 * as the indictment of `severity` that it is.
 */

import type { DiscriminatingTestShape, Fingerprint, MechanismFamily } from "@cml/novelty";
import type { PriorRunRecord } from "./novelty-ledger.js";
import { familyOfRecord } from "./novelty-dispersion.js";

/**
 * `discriminating_test_shape` from the recorded test text. Ordered most-specific first for the same
 * reason the family rules are: `chemical_timing` must beat a bare `timetable` mention.
 */
const TEST_SHAPE_RULES: ReadonlyArray<{ shape: DiscriminatingTestShape; re: RegExp }> = [
  { shape: "chemical_timing", re: /\b(chemical|toxicolog|assay|dose|onset|analys[ei]s of the|residue)\b/i },
  { shape: "timetable_contradiction", re: /\b(timetable|schedule|train time|clock|chime|tide table|hour of|time of death)\b/i },
  { shape: "identity_disambiguation", re: /\b(identif|impersonat|disguise|which of the two|handwriting|fingerprint)\b/i },
  { shape: "reconstruction", re: /\b(reconstruct|re-enact|reenact|demonstrat|staged test|repeat the)\b/i },
  { shape: "behavioral_tell", re: /\b(slip of the tongue|knew (something|a fact)|betrayed himself|betrayed herself|reaction|tell)\b/i },
  { shape: "physical_trace", re: /\b(trace|soot|scratch|mark|fibre|fiber|stain|smear|impression|scrape)\b/i },
];

const testShapeOf = (r: PriorRunRecord): DiscriminatingTestShape => {
  const hay = [r.discrimMethod, r.discrimDesign].filter(Boolean).join(" | ");
  for (const rule of TEST_SHAPE_RULES) if (rule.re.test(hay)) return rule.shape;
  // `physical_trace` is the genre's default test and the least informative guess, which makes it the
  // right fallback: it is the shape most likely to be shared by coincidence, so a match on it carries
  // the least weight in `severity` — the failure mode of a wrong guess here is a false ALARM, not a
  // missed one, and a false alarm in shadow is cheap.
  return "physical_trace";
};

/**
 * Project shipped-run records into the judge's corpus shape.
 *
 * Records whose family could not be classified are DROPPED, not admitted as `"unclassified"`: an
 * unclassified record would collide with every other unclassified record on `structuralKey` and the
 * loader's de-duplication would silently collapse them into one. Dropping is visible in the count;
 * collapsing is not.
 */
export const priorRunFingerprints = (records: PriorRunRecord[], windowN = 20): Fingerprint[] => {
  const out: Fingerprint[] = [];
  for (const r of records.slice(-windowN)) {
    const family = familyOfRecord(r);
    if (family === "unclassified") continue;
    out.push({
      id: r.id || r.title || "prior-run",
      corpus: "prior_run",
      axis: (r.axis || "behavioral") as Fingerprint["axis"],
      mechanism_family: family as MechanismFamily,
      // Deliberately empty — see the header. An unmatchable value is worse than an absent one.
      false_assumption_pattern: "",
      discriminating_test_shape: testShapeOf(r),
      inference_shape: "",
      premise: r.premise || undefined,
      source: "cross-run ledger",
    });
  }
  return out;
};

export interface CellRepeat {
  axis: string;
  family: string;
  /** How many of the recent shipped runs occupied this exact (axis, family) cell. */
  depth: number;
  /** How many runs were considered. */
  window: number;
  /** Runs since the cell was last used; `null` when it has never been used. */
  sinceLastUse: number | null;
}

/**
 * How worn is the cell this candidate is about to occupy?
 *
 * This is the question `severity` cannot answer and the one that matters. It needs no threshold, no
 * corpus tuning and no LLM call — it is a count over a file that already exists.
 */
export const cellRepeatDepth = (
  records: PriorRunRecord[],
  axis: string,
  family: string,
  windowN = 20,
): CellRepeat => {
  const recent = records.slice(-windowN);
  let depth = 0;
  let lastIndex = -1;
  recent.forEach((r, i) => {
    if (r.axis === axis && familyOfRecord(r) === family) {
      depth += 1;
      lastIndex = i;
    }
  });
  return {
    axis,
    family,
    depth,
    window: recent.length,
    sinceLastUse: lastIndex < 0 ? null : recent.length - 1 - lastIndex,
  };
};
