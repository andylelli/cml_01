/**
 * The hard-cap engine (aligning-the-scoring-system.md §4, scoring-approach.md § Hard Caps + Major
 * Penalty Rules). Applied **after** the LLM critic scores, deterministically, so a cap can never be
 * "forgotten" and the final number is provably consistent with the story's facts. This is what makes
 * an LLM-judge trustworthy enough to gate on: the model proposes, the checker enforces.
 *
 * Each cap clamps one or more category marks and/or imposes an overall ceiling; both are taken as the
 * MINIMUM across all fired caps. The rubric's "usually should not exceed N" is implemented as a hard
 * ceiling of N (the conservative, reproducible reading).
 */

import type { CappedScore, Category, CategoryMark, RubricScore, StoryFacts } from "./types.js";
import { bandFor } from "./bands.js";

export function applyHardCaps(raw: RubricScore, facts: StoryFacts): CappedScore {
  const catCap = new Map<Category, number>();
  const ceilings: number[] = [];
  const capsApplied: string[] = [];

  const capCat = (cat: Category, max: number, reason: string): void => {
    const cur = catCap.get(cat);
    if (cur === undefined || max < cur) catCap.set(cat, max);
    capsApplied.push(`${reason} → ${cat} ≤ ${max}`);
  };
  const ceil = (max: number, reason: string): void => {
    ceilings.push(max);
    capsApplied.push(`${reason} → overall ≤ ${max}`);
  };

  const leakHits = (facts.templateLeakageHits ?? []).length;

  // ── Character Clarity caps (§ Category 4 + § Major Penalty Rules) ────────────
  if (facts.deadVictimAppearsAlive) {
    capCat("character_clarity", 3, "dead victim appears alive");
    capCat("plot_structure", 5, "dead victim appears alive");
    capCat("clues", 6, "dead victim appears alive");
    capCat("ending", 4, "dead victim appears alive");
    ceil(60, "dead victim appears alive");
    if (facts.deadVictimIsCulprit) {
      capCat("character_clarity", 2, "dead victim is the culprit");
      capCat("ending", 3, "dead victim is the culprit");
      ceil(55, "dead victim is the culprit");
    }
  }
  if (facts.culpritIsVictim) {
    capCat("character_clarity", 2, "culprit = victim");
    capCat("ending", 3, "culprit = victim");
    ceil(55, "culprit = victim");
  }
  if (facts.victimIsInvestigator) capCat("character_clarity", 3, "victim = investigator");
  if (facts.victimIdentityUnclear) capCat("character_clarity", 4, "victim identity unclear");
  if (facts.multipleRoleChanges) capCat("character_clarity", 4, "multiple characters change roles");
  if (facts.pronounsUnstable) {
    capCat("character_clarity", 5, "pronoun instability");
    capCat("prose", 5, "pronoun instability");
    ceil(69, "pronoun instability"); // rubric: "should usually stay below 70"
  }

  // ── Ending caps (§ Category 9 Hard Caps + § Final Reveal) ────────────────────
  if (facts.culpritConfessesTamperingOnly) capCat("ending", 6, "culprit confesses to tampering, not death");
  if (facts.revealUsesUnplantedEvidence) capCat("ending", 5, "reveal uses evidence not planted earlier");
  // K2: a mechanism explained BEFORE the discriminating-test scene spoils the test (fair-play / pacing).
  // Only fires when CONFIRMED by the structural verifier (a false "too early" flag is vetoed in score.ts).
  if (facts.mechanismExplainedTooEarly) {
    capCat("plot_structure", 6, "mechanism explained too early (before the discriminating-test scene)");
    capCat("pacing", 6, "mechanism explained too early (before the discriminating-test scene)");
  }
  if (facts.noResolution) capCat("ending", 5, "no confession / exposure / arrest / consequence");
  if (facts.endingContradictsEarlier) capCat("ending", 4, "ending contradicts earlier chapters");

  // ── Prose / structural penalties (§ Major Penalty Rules) ─────────────────────
  if (leakHits > 0) {
    capCat("prose", 4, "prompt / template / validation-text leakage");
    // Per the rubric ("...unless leakage is very minor"), the OVERALL ceiling applies only to MATERIAL
    // leakage (≥2 distinct fragments). A single note-like line is a Prose penalty, not a global cap.
    if (leakHits >= 2) ceil(65, "significant prompt / template / validation-text leakage");
  }
  // A_57 D1 — garbled evidence surfacing (a locked-fact value spliced into prose with a stray
  // apostrophe/no space). A human reads these as broken prose; the LLM judge under-detects them. Cap
  // prose, with a global ceiling when material (≥3 fragments) — mirrors the leakage rule.
  const malformedHits = (facts.malformedEvidenceSurfacing ?? []).length;
  if (malformedHits > 0) {
    capCat("prose", malformedHits >= 3 ? 4 : 5, "garbled evidence surfacing (malformed locked-fact splice)");
    if (malformedHits >= 3) ceil(70, "material garbled evidence surfacing");
  }
  // A_57 D4 — report-style clearance ("X was cleared because …"): reads as validation output, not
  // dramatized deduction. Hurts polish and the reveal.
  if (facts.reportStyleClearance) {
    capCat("prose", 6, "report-style clearance (verdict, not dramatized deduction)");
    capCat("ending", 7, "report-style clearance in the reveal");
  }
  // A_57 D2 — the central clue's staged & true values are stated as two flat parallel truths with no
  // contrast connective ("the central clue contradicts itself" — ChatGPT's biggest problem). Cap clues.
  if (facts.dualValueNoContrast) {
    capCat("clues", 6, "central clue stated as two flat values, not one contradiction");
  }
  if (facts.victimUnnamed) ceil(72, "victim unnamed");
  if (facts.weakMurderMethod) {
    capCat("ending", 6, "weak murder method (concealment explained, death not)");
    ceil(75, "weak murder method (concealment explained, death not)");
  }

  // ── apply ────────────────────────────────────────────────────────────────────
  const categories: CategoryMark[] = raw.categories.map((c) => {
    const max = catCap.get(c.category);
    return max !== undefined && c.mark > max ? { ...c, mark: max, capped: true } : c;
  });

  // A_55 (defensive): if categories came back EMPTY (a malformed judge payload the parser couldn't
  // reshape into the 10-category array), do NOT report a false 0 — fall back to the judge's own
  // reported `total`. The primary fix is in parseJudgeResult (object-map shape); this guard catches any
  // other unknown shape so a present-but-unparseable score is never silently zeroed. (Caps can't apply
  // without categories, so the fallback total is uncapped — acceptable for an already-degraded payload.)
  const categoriesEmpty = raw.categories.length === 0;
  const rawTotal = categoriesEmpty
    ? clamp(typeof raw.total === "number" ? raw.total : 0, 0, 100)
    : clamp(raw.categories.reduce((s, c) => s + c.mark, 0), 0, 100);
  let total = categoriesEmpty ? rawTotal : categories.reduce((s, c) => s + c.mark, 0);
  for (const ceiling of ceilings) total = Math.min(total, ceiling);
  total = clamp(total, 0, 100);

  return {
    final: total,
    band: bandFor(total),
    capsApplied: [...new Set(capsApplied)],
    categories,
    rawTotal,
  };
}

const clamp = (n: number, lo: number, hi: number): number => Math.max(lo, Math.min(hi, n));
