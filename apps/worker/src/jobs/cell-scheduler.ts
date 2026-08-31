/**
 * cell-scheduler.ts — ANALYSIS_74 §8 **DE5**. The engine's actual mechanism.
 *
 * ── THE ARGUMENT, IN ONE PARAGRAPH ───────────────────────────────────────────────────────────────
 *
 * "Avoid X" has an INFINITE satisfying set, and a model asked to satisfy it moves the minimum
 * distance required. Told to diverge from seven sundials, the minimum-edit satisfying answer is a
 * bell tower — which is a *correct* answer to the constraint as posed. That is the whole of A_74
 * §6.4's caution ("divergence from a monoculture stays inside the monoculture") restated as a property
 * of constraint satisfaction rather than a mystery about LLM behaviour, and it predicts that a
 * STRONGER prohibition produces the same move with more words. This project has already paid for that
 * lesson once: X95's closed vocabulary produced *"certified wave crest hour"*.
 *
 * The repair is not a better prohibition. It is to replace the prohibition with an OBLIGATION.
 * "Do not write another clock story" has an infinite satisfying set. "This run is
 * `epistemic` x `poison_delayed` x `chemical_timing`" has a small one, and every member of it is
 * somewhere the pipeline has never been.
 *
 * ── WHY A DETERMINISTIC WALK AND NOT SAMPLING ────────────────────────────────────────────────────
 *
 * The addressable space is `axis (6) x mechanism_family (14) x discriminating_test_shape (6)` = 504
 * cells. Seven shipped runs have occupied ONE axis. Asking a model to "diverge" is Monte Carlo with a
 * strong prior, and at N=7 a strong prior wins every time. A low-discrepancy walk — Halton/Sobol in
 * spirit, least-recently-used in practice — fills a space evenly at SMALL N, which is the only N this
 * project will ever have. It also costs nothing, is reproducible from the ledger, and makes repetition
 * IMPOSSIBLE rather than discouraged.
 *
 * ── THE TWO-COORDINATE RULE ──────────────────────────────────────────────────────────────────────
 *
 * The next cell must differ from the previous run in at least TWO of the three coordinates. One
 * coordinate is how a monoculture drifts while satisfying its constraint: sundial -> bell tower is a
 * different `deathMethod` string, the same axis, the same family, the same test shape. Requiring two
 * makes that move unavailable.
 *
 * ── WHAT THIS DOES NOT DO ────────────────────────────────────────────────────────────────────────
 *
 * It does not judge quality, and it must not be read as claiming that an unused cell is a better
 * story. It claims only that the pipeline has never been there, which is a fact about coverage. A_74
 * §8.6 states the negative control plainly: if a scheduled `epistemic` x `poison_delayed` case scores
 * the same as the clock cases, that is the most useful result available and it redirects the whole
 * engine at §8.4's craft levers. Nothing here should make that answer hard to hear.
 *
 * Flag: `NOVELTY_CELL_SCHEDULER` (off | shadow | on), **default off**. `shadow` computes and logs the
 * cell without changing any input — which is how DE7 answers "does this thing pick sensibly?" before
 * a single paid run depends on it.
 */

import type { PriorRunRecord } from "./novelty-ledger.js";
import { familyOfRecord } from "./novelty-dispersion.js";
import { loadSeedFingerprints } from "@cml/novelty";

export const SCHEDULER_AXES = ["temporal", "spatial", "identity", "behavioral", "authority"] as const;
export type SchedulerAxis = (typeof SCHEDULER_AXES)[number];

/**
 * The families the scheduler is allowed to ASK FOR.
 *
 * `@cml/novelty`'s vocabulary has 14 values; this list is 12. `substituted_body` and
 * `unconscious_act` are omitted deliberately — Agent 3b's prompt bans the twins-as-solution trope and
 * the schema's plausibility bar rejects hypnosis-as-method, so scheduling them would produce a run
 * that fights its own validators. A scheduler that can request an impossible cell converts a coverage
 * gap into a retry storm.
 */
export const SCHEDULER_FAMILIES = [
  "locked_room_key",
  "locked_room_timing",
  "alibi_fabrication",
  "impersonation",
  "poison_delayed",
  "poison_substitution",
  "staged_scene",
  "disguised_natural_agent",
  "hidden_accomplice",
  "information_leak",
  "recorded_presence",
  "secret_will_inheritance",
  // A_79 §7.1 — both are now servable: the device library has behavioral patterns from the corpus,
  // and neither fights a validator the way `substituted_body` and `unconscious_act` do.
  "role_invisibility",
  "investigative_blind_spot",
] as const;
export type SchedulerFamily = (typeof SCHEDULER_FAMILIES)[number];

export const SCHEDULER_TEST_SHAPES = [
  "physical_trace",
  "timetable_contradiction",
  "behavioral_tell",
  "identity_disambiguation",
  "reconstruction",
  "chemical_timing",
] as const;
export type SchedulerTestShape = (typeof SCHEDULER_TEST_SHAPES)[number];

/**
 * A_79 C — WHAT AN EMPTY CELL ACTUALLY MEANS.
 *
 * Until now this module walked a space defined only by our own shipped runs, so "unoccupied" meant
 * THIS PIPELINE HAS NOT BEEN THERE. It said nothing about whether the genre had. MEASURED against the
 * 102-run ledger and the 12-work corpus on 2026-08-31:
 *
 *   grid                     70 cells (5 axes x 14 families)
 *   occupied by both          5
 *   occupied by canon only    5   <- proven to support a novel; we have never been
 *   occupied by us only      12
 *   occupied by neither      48
 *
 * The scheduler's pick that day was behavioral x alibi_fabrication — drawn from the 48, a cell no
 * canonical work occupies. That is not necessarily wrong, but it was not a choice: the module could
 * not see the difference between a cell the genre has proven and a cell nobody has ever tried.
 *
 * A cell canon occupies carries evidence that a whole novel can stand on it. A cell in the 48 carries
 * none, and some of them are empty because they do not work. So canon-occupancy breaks ties BELOW
 * depth, never above it: avoiding our own repetition stays the first duty — 44 of those 102 runs sit
 * in `temporal x locked_room_timing` alone.
 */
export interface CorpusCell {
  axis: string;
  family: string;
  /** The work occupying it, for the log line — a claim about the corpus should name its evidence. */
  work: string;
}

/**
 * Corpus cells from the DERIVED fingerprint ledger.
 *
 * Read through `@cml/novelty` rather than by walking `library/works/` directly, for two reasons: the
 * worker has no YAML dependency and should not acquire one for this, and A_79 A2 made that ledger a
 * genuinely generated artifact (`scripts/corpus-sync-fingerprints.mjs`, with a `--check` mode). Going
 * to the same source means there is no third copy of the corpus to drift — which is the failure A_77
 * §4.3 measured at eleven disagreements in fourteen.
 *
 * Flag `NOVELTY_CELL_SCHEDULER_CORPUS`, **default off**. Off returns `[]`, and an empty corpus makes
 * `scheduleCell` byte-identical to its previous behaviour.
 */
export const corpusSchedulingEnabled = (env: NodeJS.ProcessEnv = process.env): boolean =>
  /^(1|true|yes|on)$/i.test(String(env.NOVELTY_CELL_SCHEDULER_CORPUS ?? "").trim());

export const loadCorpusCells = (): CorpusCell[] => {
  if (!corpusSchedulingEnabled()) return [];
  try {
    return loadSeedFingerprints()
      .filter((f) => f.axis && f.mechanism_family)
      .map((f) => ({ axis: String(f.axis), family: String(f.mechanism_family), work: String(f.id) }));
  } catch (err) {
    // A corpus we cannot read is a corpus we schedule without. It must not take a paid run down.
    console.warn(`[DE5 scheduler] corpus fingerprints unreadable, scheduling corpus-blind: ${String(err)}`);
    return [];
  }
};

export interface Cell {
  axis: SchedulerAxis;
  family: SchedulerFamily;
  testShape: SchedulerTestShape;
}

export interface ScheduledCell extends Cell {
  /** Runs since any of the three coordinates was last used; `null` = never used. */
  lastUse: { axis: number | null; family: number | null; testShape: number | null };
  /** How many recent runs occupied this exact cell. Should be 0 for a well-chosen cell. */
  depth: number;
  /** Coordinates that differ from the previous run. Length >= 2 by construction. */
  differsFromPrevious: string[];
  /**
   * Who has occupied this cell. `unknown` means the corpus was not consulted (flag off), and is
   * deliberately NOT spelled `neither` — "nobody has been here" and "we did not look" are different
   * claims, and collapsing them is how a blind scheduler reads as a confident one.
   */
  corpusOccupancy: "canon-and-us" | "canon-not-us" | "us-only" | "neither" | "unknown";
  /** Canonical works occupying this cell, if any. */
  corpusWorks: string[];
  /** Human-readable reason, for the run log. */
  reason: string;
}

export type SchedulerMode = "off" | "shadow" | "on";

export const resolveSchedulerMode = (env: NodeJS.ProcessEnv = process.env): SchedulerMode => {
  const raw = String(env.NOVELTY_CELL_SCHEDULER ?? "").trim().toLowerCase();
  if (raw === "on" || raw === "true" || raw === "1" || raw === "active") return "on";
  if (raw === "shadow" || raw === "warn") return "shadow";
  return "off";
};

/**
 * Index of the most recent use of each coordinate value, counted in "runs ago".
 * `null` means the value has never appeared, which sorts ahead of every used value.
 */
const lastUseMap = <T extends string>(values: readonly T[], used: string[]): Map<T, number | null> => {
  const m = new Map<T, number | null>();
  for (const v of values) {
    let ago: number | null = null;
    for (let i = used.length - 1; i >= 0; i -= 1) {
      if (used[i] === v) {
        ago = used.length - 1 - i;
        break;
      }
    }
    m.set(v, ago);
  }
  return m;
};

/** Never-used sorts first; otherwise longest-ago first. Ties broken by declaration order, so the walk is reproducible. */
const byStalest = <T extends string>(m: Map<T, number | null>, order: readonly T[]) =>
  [...order].sort((a, b) => {
    // `Map.get` widens to `| undefined`; a missing key means the value was never used, which is the
    // same thing `null` means here. Collapsing them keeps the ordering total.
    const av = m.get(a) ?? null;
    const bv = m.get(b) ?? null;
    if (av === null && bv === null) return order.indexOf(a) - order.indexOf(b);
    if (av === null) return -1;
    if (bv === null) return 1;
    if (av !== bv) return bv - av;
    return order.indexOf(a) - order.indexOf(b);
  });

/**
 * Choose the next cell: the stalest feasible `(axis, family, testShape)` that differs from the
 * previous run in at least two coordinates.
 *
 * With an EMPTY ledger every coordinate is unused, the two-coordinate rule is vacuous, and the walk
 * starts at the head of each declaration order. That is deliberate and it is why the orders above are
 * not alphabetical: the first scheduled run should be a plain one, not the strangest cell in the
 * space, because the first run is the one most likely to be diagnosing something else.
 */
export const scheduleCell = (
  records: PriorRunRecord[],
  windowN = 20,
  corpus: CorpusCell[] = [],
): ScheduledCell => {
  const recent = records.slice(-windowN);
  const usedAxes = recent.map((r) => String(r.axis ?? ""));
  const usedFamilies = recent.map((r) => String(familyOfRecord(r)));
  // Test shape is not stored on a ledger record; absent history it is treated as never used, which
  // makes it the weakest of the three coordinates. Stated rather than hidden: this coordinate cannot
  // currently carry the two-coordinate rule on its own.
  const usedShapes: string[] = [];

  const axisLast = lastUseMap(SCHEDULER_AXES, usedAxes);
  const familyLast = lastUseMap(SCHEDULER_FAMILIES, usedFamilies);
  const shapeLast = lastUseMap(SCHEDULER_TEST_SHAPES, usedShapes);

  const axisOrder = byStalest(axisLast, SCHEDULER_AXES);
  const familyOrder = byStalest(familyLast, SCHEDULER_FAMILIES);
  const shapeOrder = byStalest(shapeLast, SCHEDULER_TEST_SHAPES);

  const prev = recent.length > 0 ? recent[recent.length - 1] : null;
  const prevAxis = prev ? String(prev.axis ?? "") : null;
  const prevFamily = prev ? String(familyOfRecord(prev)) : null;

  const depthOf = (axis: string, family: string) =>
    recent.filter((r) => String(r.axis ?? "") === axis && String(familyOfRecord(r)) === family).length;

  // A_79 C — canonical occupancy, keyed the same way `depthOf` keys ours.
  const canonWorks = new Map<string, string[]>();
  for (const c of corpus) {
    const key = `${c.axis}|${c.family}`;
    canonWorks.set(key, [...(canonWorks.get(key) ?? []), c.work]);
  }
  const consulted = corpus.length > 0;
  const worksAt = (axis: string, family: string) => canonWorks.get(`${axis}|${family}`) ?? [];

  /**
   * Candidates are now ENUMERATED and ranked rather than short-circuited at the first depth-0 hit,
   * because the tie among depth-0 cells is exactly where corpus evidence belongs and the old loop
   * resolved that tie by declaration order before anything could look at it.
   *
   * Ranking, in order: our own depth (repetition is still the first duty), then whether canon has
   * proven the cell, then the existing stalest-first walk. With `corpus` empty the second key is
   * constant for every candidate, so the ranking collapses to the nested walk the loop performed and
   * the chosen cell is unchanged — which is what makes the flag-off path provably a no-op.
   */
  const shape = shapeOrder[0];
  const candidates: ScheduledCell[] = [];
  for (const axis of axisOrder) {
    for (const family of familyOrder) {
      const differs: string[] = [];
      if (prevAxis === null || axis !== prevAxis) differs.push("axis");
      if (prevFamily === null || family !== prevFamily) differs.push("family");
      // The test shape always counts as differing when there is no previous run to compare against.
      if (prev === null) differs.push("testShape");
      if (prev !== null && differs.length < 2) continue;
      const depth = depthOf(axis, family);
      const works = worksAt(axis, family);
      candidates.push({
        axis,
        family,
        testShape: shape,
        lastUse: { axis: axisLast.get(axis) ?? null, family: familyLast.get(family) ?? null, testShape: shapeLast.get(shape) ?? null },
        depth,
        differsFromPrevious: differs,
        corpusOccupancy: !consulted
          ? "unknown"
          : works.length > 0
            ? depth > 0
              ? "canon-and-us"
              : "canon-not-us"
            : depth > 0
              ? "us-only"
              : "neither",
        corpusWorks: works,
        reason: "",
      });
    }
  }

  const rankIn = <T extends string>(order: readonly T[], v: string) => order.indexOf(v as T);
  candidates.sort(
    (a, b) =>
      a.depth - b.depth ||
      Number(b.corpusWorks.length > 0) - Number(a.corpusWorks.length > 0) ||
      rankIn(axisOrder, a.axis) - rankIn(axisOrder, b.axis) ||
      rankIn(familyOrder, a.family) - rankIn(familyOrder, b.family),
  );
  let best: ScheduledCell | null = candidates[0] ?? null;

  // Unreachable with the vocabularies above (5 axes x 12 families = 60 cells, at most 20 in the
  // window), but a scheduler that can return undefined is a scheduler that will one day return
  // undefined at 2am in a paid run.
  if (best === null) {
    best = {
      axis: axisOrder[0],
      family: familyOrder[0],
      testShape: shapeOrder[0],
      lastUse: { axis: null, family: null, testShape: null },
      depth: 0,
      differsFromPrevious: ["axis", "family"],
      corpusOccupancy: "unknown",
      corpusWorks: [],
      reason: "",
    };
  }

  const describe = (n: number | null) => (n === null ? "never used" : `${n} run(s) ago`);
  best.reason =
    `axis ${best.axis} (${describe(best.lastUse.axis)}), family ${best.family} (${describe(best.lastUse.family)}), ` +
    `test ${best.testShape}; differs from the previous run in [${best.differsFromPrevious.join(", ")}]; ` +
    `this exact cell has been shipped ${best.depth} time(s) in the last ${recent.length} run(s)` +
    (best.corpusOccupancy === "unknown"
      ? "; corpus not consulted"
      : best.corpusWorks.length > 0
        ? `; canon occupies it (${best.corpusWorks.join(", ")})`
        : "; no canonical work occupies it");
  return best;
};

/**
 * The POSITIVE directive, which is the point of the whole module. Not "avoid the clock" — an
 * instruction with an infinite satisfying set — but "be this", which has a small one.
 *
 * The wording asks for the mechanism to be REALIZED rather than mentioned, because the failure mode of
 * a family instruction is a story that name-checks poison in chapter 2 and turns on a clock in chapter
 * 9. The `divergeFrom` machinery still runs alongside this; it is now a supplement to an obligation
 * rather than the only constraint in the prompt.
 */
export const cellDirective = (cell: Cell): string =>
  `MECHANISM ASSIGNMENT (this run, non-negotiable): the case MUST turn on a ` +
  `**${cell.family.replace(/_/g, " ")}** mechanism, on the **${cell.axis}** axis, and the ` +
  `discriminating test MUST take the form of a **${cell.testShape.replace(/_/g, " ")}**. ` +
  `This is an assignment, not a suggestion, and it replaces any default the theme implies. ` +
  `The mechanism must be REALIZED — it is what the murder actually depends on and what the ` +
  `final deduction actually proves — not merely mentioned in passing while the case turns on ` +
  `something else. Every fair-play constraint stated elsewhere still applies unchanged.`;

/**
 * Recover the assigned family from a theme string written by `cellDirective`.
 *
 * The assignment travels in the THEME, because that is the field the generated config carries and the
 * field a human reading `scratchpad/scheduled/*.yaml` can see. Downstream agents therefore need a way
 * to read it back, and a regex over the exact marker `cellDirective` writes is the least fragile
 * option available — the alternative is threading a new typed field through four agent boundaries for
 * one string.
 *
 * Returns null for an ordinary (unscheduled) theme, which is the common case and not an error.
 */
export const assignedFamilyFromTheme = (theme: string | undefined): SchedulerFamily | null => {
  if (!theme) return null;
  const m = new RegExp("MECHANISM ASSIGNMENT[\\s\\S]{0,200}?\\*\\*([a-z ]+)\\*\\*", "i").exec(theme);
  if (!m) return null;
  const slug = m[1].trim().replace(/ /g, "_");
  return (SCHEDULER_FAMILIES as readonly string[]).includes(slug) ? (slug as SchedulerFamily) : null;
};

/** One line in the run log, whether the scheduler is shadow or on. */
export const logScheduledCell = (cell: ScheduledCell, mode: SchedulerMode): void => {
  console.warn(`[DE5 scheduler ${mode.toUpperCase()}] ${cell.axis} x ${cell.family} x ${cell.testShape}`);
  console.warn(`  · ${cell.reason}`);
  console.warn(`  · corpus occupancy: ${cell.corpusOccupancy}`);
  if (mode === "shadow") console.warn("  · SHADOW: computed only. No input was changed by this.");
};
