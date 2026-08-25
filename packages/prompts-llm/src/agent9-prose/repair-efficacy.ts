/**
 * agent9-prose/repair-efficacy.ts — does the repair machinery change anything?
 *
 * WHY THIS EXISTS. Measured on `mystery-1787690700056` (step 2, 2026-08-25, £1.51):
 *
 *     Agent 9 FIRST-PASS prose   $0.615   32%   10 calls
 *     Agent 9 REWORK             $0.582   30%   11 calls
 *
 * **More Agent-9 calls were spent repairing than writing**, and rework cost nearly as much as the
 * prose. `run-cost-audit.mjs` reported that as "repeat calls 11%", because it only counts a SECOND
 * call under the same agent label and every repair pass carries its own label
 * (`Agent9-PostPassPolish-Ch4`, `Agent9-AtmosphereRepair-Ch4`) — so the first call of each books as
 * fresh work. The true share is ~30%.
 *
 * WHAT IS NOT KNOWN, AND IS THE POINT OF THIS FILE. Most of that rework is UNCONDITIONAL: polish and
 * atmosphere passes fire per chapter whether or not anything is wrong. `AGENT9_POLISH_HIGH_LEAKAGE_CHAPTERS`
 * is default-ON, which lifts polish off its `attempt === 1` guard, and polish ran 7 times across 10
 * chapters. Nobody has ever measured what fraction of those calls CHANGED THE TEXT.
 *
 * The distinction that matters for the bill, and the three outcomes recorded here:
 *
 *   changed      the pass ran and the committed text differs        — the machinery working
 *   no_change    the pass ran, cost money, and changed nothing      — pure waste
 *   rolled_back  the pass ran and its output was DISCARDED          — waste, and a signal the
 *                                                                     guard is rejecting repairs
 *
 * A pass that is mostly `no_change` should be gated on a trigger rather than run per chapter. A pass
 * that is mostly `rolled_back` is being reverted by a validator and needs the A_73 §32 treatment, not
 * a bigger budget. Neither question is answerable today, on a stage that is 30% of the run.
 *
 * Module-level, reset per run, exactly like the clue/clearance paste tallies — see the note there on
 * why one story per process is the standing precondition.
 */

export type RepairOutcome = "changed" | "no_change" | "rolled_back";

interface PassTally {
  calls: number;
  changed: number;
  no_change: number;
  rolled_back: number;
  /** Distinct reasons a rollback was recorded, for the passes that supply one. */
  reasons: string[];
}

const tallies = new Map<string, PassTally>();

const tallyFor = (pass: string): PassTally => {
  const existing = tallies.get(pass);
  if (existing) return existing;
  const fresh: PassTally = { calls: 0, changed: 0, no_change: 0, rolled_back: 0, reasons: [] };
  tallies.set(pass, fresh);
  return fresh;
};

export const recordRepairOutcome = (
  pass: string,
  outcome: RepairOutcome,
  reason?: string,
): void => {
  const t = tallyFor(pass);
  t.calls += 1;
  t[outcome] += 1;
  if (reason && !t.reasons.includes(reason)) t.reasons.push(reason);
};

/**
 * Compare two chapters by their committed text. Whitespace-normalised, because a pass that only
 * re-wrapped paragraphs has not changed the book and must not be counted as if it had — the same
 * reasoning as `preserveOriginalParagraphsValidator`'s `normPara`.
 */
export const textOfChapter = (chapter: { paragraphs?: string[] } | null | undefined): string =>
  (chapter?.paragraphs ?? []).map((p) => String(p ?? "").replace(/\s+/g, " ").trim()).join("\n");

/** Record by comparing before and after, for passes that do not report their own outcome. */
export const recordRepairByDiff = (
  pass: string,
  before: { paragraphs?: string[] } | null | undefined,
  after: { paragraphs?: string[] } | null | undefined,
): void => {
  recordRepairOutcome(pass, textOfChapter(before) === textOfChapter(after) ? "no_change" : "changed");
};

export interface RepairEfficacyReport {
  totalCalls: number;
  totalChanged: number;
  totalNoChange: number;
  totalRolledBack: number;
  byPass: Record<string, PassTally>;
}

export const getRepairEfficacy = (): RepairEfficacyReport => {
  const byPass: Record<string, PassTally> = {};
  let totalCalls = 0, totalChanged = 0, totalNoChange = 0, totalRolledBack = 0;
  for (const [pass, t] of tallies) {
    byPass[pass] = { ...t, reasons: [...t.reasons] };
    totalCalls += t.calls;
    totalChanged += t.changed;
    totalNoChange += t.no_change;
    totalRolledBack += t.rolled_back;
  }
  return { totalCalls, totalChanged, totalNoChange, totalRolledBack, byPass };
};

export const resetRepairEfficacy = (): void => tallies.clear();

/** One line per pass, so the answer is in the run log without opening a report. */
export const logRepairEfficacy = (): void => {
  const report = getRepairEfficacy();
  if (report.totalCalls === 0) return;
  const pct = (n: number) => (report.totalCalls ? `${Math.round((100 * n) / report.totalCalls)}%` : "0%");
  console.warn(
    `[Agent 9][A_73] repair efficacy: ${report.totalCalls} repair call(s) — ` +
      `${report.totalChanged} changed the text (${pct(report.totalChanged)}), ` +
      `${report.totalNoChange} changed nothing, ${report.totalRolledBack} rolled back. ` +
      `Rework is ~30% of a run's spend; this is how much of it bought anything.`,
  );
  for (const [pass, t] of Object.entries(report.byPass)) {
    console.warn(
      `  · ${pass}: ${t.calls} call(s) — changed ${t.changed}, no-change ${t.no_change}, ` +
        `rolled back ${t.rolled_back}${t.reasons.length ? ` (${t.reasons.join(", ")})` : ""}`,
    );
  }
};
