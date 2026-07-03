/**
 * The general "scaffold-not-prose" detector (Agent 9 first-principles LLD §6.4 / P3.2).
 *
 * The whack-a-mole (A_57 D4 → A_58 #1 → A_59 #1/#4) is N per-template detectors chasing one
 * structural fault: the deterministic injection layer emits reasoning/validation scaffolding that a
 * human reads as leakage. This replaces the per-template approach with ONE detector over the *shape*
 * — a sentence that is `subject + reasoning-verb + raw key-terms` with no scene grounding — seeded
 * with the exact signatures the current injectors emit. It is the seam between detection and repair:
 * a hit becomes a `scaffold_not_prose` defect that FIRES the scoped micro-regen, rather than only
 * capping the score after the fact.
 *
 * High-precision by construction: the seed signatures are fixed template strings emitted by
 * `deterministic-repair.ts` / `agent9-run.ts`, and the one generalised shape rule requires a
 * reasoning verb adjacent to a reasoning-connective, which genuine dramatized prose does not produce.
 * Complements (does not duplicate) `detectTemplateLeakage` — that catches metadata/audit/comma-table
 * leakage; this catches the deductive-scaffold family.
 */

import type { Validator } from "./types.js";

export interface ScaffoldHit {
  /** The matched fragment (capped), for telemetry and the regen instruction. */
  fragment: string;
  /** Which signature fired — drives the regen instruction and lets us track which mole is live. */
  rule: string;
}

/**
 * Verbatim signatures emitted by the current deterministic injectors. Each maps to a named pass in the
 * LLD §3.3 inventory so a hit names the mole. These are the seed; the shape rule below generalises them.
 */
const SEED_SIGNATURES: Array<{ rule: string; re: RegExp }> = [
  // A1 — clue/inference surfacing (deterministic-repair.ts:283/300)
  { rule: "A1:pressed_on", re: /\bpressed on to the next concrete detail\b/i },
  { rule: "A1:laid_facts_out", re: /\blaid the facts out plainly where the others could see them\b/i },
  { rule: "A1:trail_bent_toward", re: /\bthe trail bent toward\b/i },
  { rule: "A1:account_weaker", re: /\bthe standing account looked weaker for it\b/i },
  { rule: "A1:shifted_reasoning", re: /\b(?:that detail|those details) shifted the reasoning\b/i },
  // A2 — discriminating-test scaffold (deterministic-repair.ts:375)
  { rule: "A2:two_competing_readings", re: /\bset out the two competing readings\b/i },
  { rule: "A2:ran_test_in_full_view", re: /\bran that test in full view\b/i },
  // A3 — clearance patch (deterministic-repair.ts:487)
  { rule: "A3:accounted_for_movements", re: /\baccounted for [^.;!?]{0,40}\bmovements elsewhere\b/i },
  // B5 — culprit-evidence injection (agent9-run.ts:2160)
  { rule: "B5:beyond_reasonable_doubt", re: /\bwas responsible, and the evidence placed the matter beyond all reasonable doubt\b/i },
  // B7 — suspect-elimination injection (agent9-run.ts:2077)
  { rule: "B7:thoroughly_cleared", re: /\bwas thoroughly cleared by the evidence\b/i },
  // detective self-clearance report frame (A_57 D4; mirrors detectReportStyleClearance)
  { rule: "D4:as_for_myself", re: /\bas for (?:myself|my own)\b\s*[—,-]/i },
  { rule: "D4:which_proves_not_responsible", re: /\bwhich proves [^.!?]{0,40}\b(?:could not|cannot) have been (?:responsible|the killer)\b/i },
];

// Reasoning verbs and reasoning-connectives whose ADJACENCY is the deductive-scaffold shape. A
// dramatized scene puts a physical action or line of dialogue between observation and inference; the
// injector puts a reasoning verb straight into a reasoning-connective.
const REASONING_VERB = /\b(?:weighed|considered|reasoned|deduced|noted|surfaced|judged|treated)\b/i;
const REASONING_CONNECTIVE = /\b(?:the trail bent toward|shifted the reasoning|the reasoning shifted|narrowed the field toward|pointed the deduction toward|the standing (?:account|explanation) (?:weakened|looked weaker))\b/i;

/** The generalised shape: a reasoning verb and a reasoning-connective within one short sentence. */
function detectScaffoldShape(prose: string): ScaffoldHit[] {
  const hits: ScaffoldHit[] = [];
  const sentences = prose.match(/[^.!?]+[.!?]+/g) ?? [prose];
  for (const s of sentences) {
    if (REASONING_VERB.test(s) && REASONING_CONNECTIVE.test(s)) {
      hits.push({ fragment: s.trim().slice(0, 160), rule: "shape:reasoning_verb+connective" });
    }
  }
  return hits;
}

/**
 * Detect deductive-scaffold leakage anywhere in the prose. Returns one hit per fired signature/shape,
 * each carrying the matched fragment and the rule that fired. Empty array = clean.
 */
export function detectScaffoldNotProse(prose: string): ScaffoldHit[] {
  const text = String(prose ?? "");
  if (!text.trim()) return [];
  const hits: ScaffoldHit[] = [];
  const seen = new Set<string>();
  for (const { rule, re } of SEED_SIGNATURES) {
    const m = re.exec(text);
    if (m && !seen.has(rule)) {
      seen.add(rule);
      hits.push({ fragment: m[0].trim().slice(0, 160), rule });
    }
  }
  for (const h of detectScaffoldShape(text)) {
    if (!seen.has(h.rule)) {
      seen.add(h.rule);
      hits.push(h);
    }
  }
  return hits;
}

/**
 * Validator gating against deductive-scaffold leakage. Used both as a `mutateThenValidate` guard (a
 * regen that re-introduces scaffold is reverted) and, in the regen loop, as the trigger that turns a
 * hit into a `scaffold_not_prose` defect. Each hit costs 100/Nmax of the score so partial cleanups
 * still register as improvements.
 */
export const noScaffoldValidator: Validator<string> = (prose) => {
  const hits = detectScaffoldNotProse(prose);
  return {
    ok: hits.length === 0,
    score: Math.max(0, 100 - hits.length * 20),
    violations: hits.map((h) => `scaffold_not_prose:${h.rule}`),
  };
};

/**
 * A_57 D4 — a suspect clearance written as a passive VERDICT ("X was cleared because …"), the
 * deterministic clearance-patch signature ("… placed X outside the fatal sequence …"), or the detective
 * clearing himself ("As for myself—"). Reads as validation output, not dramatized deduction. Generic.
 *
 * Single source of truth: `@cml/rubric-score` imports this so the regen validator and the score cap
 * fire on the exact same shape — clearing the regen provably clears the `report-style clearance` cap.
 */
export function detectReportStyleClearance(prose: string): boolean {
  const text = String(prose ?? "");
  return (
    /\b(?:was|were|is|are|been)\s+cleared\s+(?:because|by|due\s+to)\b/i.test(text) ||
    /\bplaced\s+[A-Z][^.!?]{0,40}\boutside\s+the\s+(?:fatal\s+sequence|sequence\s+of\s+events)\b/i.test(text) ||
    /\bestablished\s+by\s+the\s+evidence\s+and\s+the\s+timeline\b/i.test(text) ||
    /\bas\s+for\s+(?:myself|my\s+own)\b\s*[—,-]/i.test(text)
  );
}

/**
 * Validator form of the report-style-clearance detector, for the regen loop: a chapter that states a
 * clearance as a verdict fails; a witnessed, dramatized deduction passes.
 */
export const noReportStyleClearanceValidator: Validator<string> = (prose) => {
  const hit = detectReportStyleClearance(prose);
  return {
    ok: !hit,
    score: hit ? 0 : 100,
    violations: hit ? ["report_style_clearance"] : [],
  };
};
