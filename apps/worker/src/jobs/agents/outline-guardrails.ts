/**
 * Outline repair guardrails (Agents 7 and 9).
 *
 * Moved verbatim from `shared.ts` (code review ORC-06), which re-exports it.
 */
import type { CaseData } from "@cml/cml";

export type OutlineCoverageIssue = {
  type: "missing_discriminating_test_scene" | "missing_suspect_closure_scene";
  message: string;
};

// ============================================================================
// Outline quality gate helpers — used by Agent 7 and Agent 9 run files
// ============================================================================

export const buildOutlineRepairGuardrails = (
  issues: OutlineCoverageIssue[],
  cml: CaseData,
): string[] => {
  const guardrails: string[] = [];
  const cmlCase = (cml as any)?.CASE ?? {};

  if (issues.some((i) => i.type === "missing_discriminating_test_scene")) {
    const discrimTest = cmlCase.discriminating_test;
    const method = discrimTest?.method ?? "constraint_proof";
    const design = discrimTest?.design ?? "";
    const designClause = design ? " (" + design + ")" : "";
    guardrails.push(
      "Include a dedicated discriminating test scene in late Act II or early Act III where the detective explicitly stages a " + method + designClause + " that rules out at least one suspect using on-page evidence. The scene summary MUST contain words like test/experiment/re-enactment AND ruled out/eliminated/excluded AND evidence/proof/because.",
    );
  }

  const culpritsList: string[] = cmlCase.culpability?.culprits ?? [];
  const culpritClause = culpritsList.length > 0 ? " (" + culpritsList.join(", ") + ")" : "";

  // The FLOOR: the outline has no closure language at all, so ask for some.
  if (issues.some((i) => i.type === "missing_suspect_closure_scene")) {
    guardrails.push(
      "In Act III, include at least one scene where the detective explains why each non-culprit suspect is cleared with explicit elimination language (cleared, ruled out, alibi confirmed) and evidence references. The culprit" + culpritClause + " must be identified with a complete evidence chain.",
    );
  }

  // THE CEILING (X32) USED TO ADD A FOLD INSTRUCTION HERE. It does not any more, and the reason is
  // worth keeping: this text only ever reached the model as part of an outline RETRY, and putting the
  // repair on the retry path is what kept `AGENT9_FOLD_SUSPECT_CLEARANCES` switched off — 11 of 32
  // archived outlines allocate the clearance job more than once, so the flag re-rolled a third of all
  // outlines at a fresh Agent 7 call each, to fix a defect a re-roll may simply reproduce.
  //
  // The fold is now deterministic: `applySuspectClearanceGate` marks the scene that OWNS the job and
  // the prose prompt tells every other chapter not to re-argue it. No retry, no LLM call, and the
  // instruction lands on the writer rather than on the outliner. See
  // `packages/story-validation/src/suspect-clearance-gate.ts`.

  return guardrails;
};
