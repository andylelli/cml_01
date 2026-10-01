/**
 * The Agent7Run state, the initial outline call, schema repair, and re-scoring an adopted outline.
 * 
 * Moved verbatim from agent7-run.ts (code review A7-01 / CR-24), which re-exports what it exported.
 */
import { validateArtifact, verifiedFixesEnabled } from "@cml/cml";
import type { NarrativeOutline } from "@cml/prompts-llm";
import { formatNarrative } from "@cml/prompts-llm";
import { scoreRealNarrative } from "@cml/story-validation";
import { scoreNarrativePhase } from "../phase-scoring.js";
import {
type LockedFactRegistry,
type OrchestratorContext,
runStage,
} from "../shared.js";
import { honestScore } from "../stage-runner.js";
import {
coerceNarrativeSceneBeats,
fillMissingActPurposes,
hoistMisplacedSceneFields,
recordAgent7Coercion,
recordOutlineCoercions,
} from "./normalize.js";

export async function rescoreNarrative(ctx: OrchestratorContext, narrative: NarrativeOutline) {
  if (!ctx.enableScoring || !ctx.scoreAggregator) return;
  try {
    // Owner decision 8: the honest scorer. This re-score used the vanity NarrativeScorer, so after a repair it
    // overwrote the phase's honest score even under HONEST_SCORERS=enforce.
    const score = honestScore(() => scoreRealNarrative(narrative, ctx.inputs.targetLength ?? "medium"), "agent7-narrative");
    ctx.scoreAggregator.upsertPhaseScore(
      "agent7_narrative",
      "Narrative Outline",
      score,
      ctx.agentDurations["agent7_narrative"] ?? 0,
      1
    );
  } catch { /* re-scoring is best-effort; never abort */ }
}

/**
 * A7-01 — the read-only state runAgent7's phases share, besides `ctx` and the outline itself. Each phase
 * below is `(ctx, run, narrative) => narrative`, extracted from the one 1,000-line function it was.
 */
export interface Agent7Run {
  minClueSceneRatio: number;
  pacingGuardrails: string[];
  lockedFactsSpread: { lockedFacts?: LockedFactRegistry };
  completenessSpread: { enableOutlineCompleteness?: true; characterBundle?: any };
}

/**
 * CR-21 (ORC-02): the one formatNarrative input. It was written out at seven call sites (first
 * attempt, schema repair, outline coverage, completeness, scene count, two clue-pacing retries) that
 * differed only in their own guardrails, which always precede the run's pacing guardrails.
 */
export function narrativeInputs(ctx: OrchestratorContext, run: Agent7Run, guardrails: string[]): Parameters<typeof formatNarrative>[1] {
  return {
    caseData: ctx.cml!,
    clues: ctx.clues!,
    targetLength: ctx.inputs.targetLength,
    narrativeStyle: ctx.inputs.narrativeStyle,
    detectiveType: ctx.inputs.detectiveType,
    qualityGuardrails: [...guardrails, ...run.pacingGuardrails],
    runId: ctx.runId,
    projectId: ctx.projectId || "",
    ...run.lockedFactsSpread,
    ...run.completenessSpread,
  };
}

export async function generateInitialOutline(ctx: OrchestratorContext, run: Agent7Run): Promise<NarrativeOutline> {
  const narrative = await runStage(ctx, {
    agentId: "agent7_narrative",
    phaseName: "Narrative Outline",
    generate: async () => {
      const narrativeResult = await formatNarrative(ctx.client, narrativeInputs(ctx, run, []));
      recordOutlineCoercions(ctx, narrativeResult); // A7-11
      return { result: narrativeResult, cost: narrativeResult.cost };
    },
    score: async (narrativeResult) => scoreNarrativePhase(narrativeResult, ctx.cml!, ctx.cast!.cast, ctx.inputs.targetLength, ctx.warnings),
  });
  return narrative;
}

export async function ensureSchemaValid(ctx: OrchestratorContext, run: Agent7Run, narrative: NarrativeOutline) {
  let narrativeSchemaValidation = validateArtifact("narrative_outline", narrative);
  if (!narrativeSchemaValidation.valid) {
    ctx.warnings.push(
      "Narrative outline failed schema validation on first attempt; retrying outline generation with schema repair guardrails"
    );
    const schemaRepairGuardrails = [
      "Return a valid narrative_outline artifact that strictly matches required schema fields and types.",
      ...narrativeSchemaValidation.errors.slice(0, 8).map((error) => `Schema fix required: ${error}`),
    ];

    const narrativeSchemaRetryStart = Date.now();
    const retriedNarrative = await formatNarrative(ctx.client, narrativeInputs(ctx, run, schemaRepairGuardrails));
    recordOutlineCoercions(ctx, retriedNarrative); // A7-11

    ctx.agentCosts["agent7_narrative"] =
      retriedNarrative.cost; // cumulative byAgent total (A_53 P3) — assign, never add (CR-06 / ORC-D03)
    ctx.agentDurations["agent7_narrative"] =
      (ctx.agentDurations["agent7_narrative"] || 0) + (Date.now() - narrativeSchemaRetryStart);

    // The retry is a fresh LLM generation and can re-emit out-of-enum beats, so it needs the
    // same deterministic coercion as the first attempt — otherwise a beat-only defect on the
    // retry still hard-aborts at the last gate before failure.
    if ((retriedNarrative as { truncationWarning?: string; }).truncationWarning) {
      ctx.warnings.push(
        `[Agent 7] RETRY ALSO TRUNCATED — ${(retriedNarrative as { truncationWarning?: string; }).truncationWarning}`
      );
    }

    const retryBeatCoercion = coerceNarrativeSceneBeats(retriedNarrative);
    recordAgent7Coercion(ctx, {
      beatsCoerced: retryBeatCoercion.coerced,
      beatsDropped: retryBeatCoercion.dropped,
    });
    if (retryBeatCoercion.coerced > 0 || retryBeatCoercion.dropped > 0) {
      ctx.warnings.push(
        `Narrative beat coercion (retry): mapped ${retryBeatCoercion.coerced} synonym beat(s), dropped ${retryBeatCoercion.dropped} unrecognised beat(s) before schema validation.`
      );
    }
    recordAgent7Coercion(ctx, { fieldsHoisted: hoistMisplacedSceneFields(retriedNarrative).hoisted });
    // A7-D02 (owner decision 12, CML_VERIFIED_FIXES): attempt 1 fills a missing act purpose in
    // normalizeRawOutline; the retry did not, so a retry omitting one hard-aborted below.
    if (verifiedFixesEnabled()) fillMissingActPurposes(ctx, retriedNarrative);

    const retryValidation = validateArtifact("narrative_outline", retriedNarrative);
    if (!retryValidation.valid) {
      retryValidation.errors.forEach((error) => ctx.errors.push(`Outline schema failure: ${error}`));
      ctx.failedNarrative = retriedNarrative; // capture the failing retry candidate for the partial-artifact snapshot
      throw new Error("Narrative outline artifact failed schema validation");
    }

    narrative = retriedNarrative;
    narrativeSchemaValidation = retryValidation;
    ctx.warnings.push("Narrative outline schema-repair retry succeeded");
    await rescoreNarrative(ctx, narrative);
  }
  narrativeSchemaValidation.warnings.forEach((warning) => ctx.warnings.push(`Outline schema warning: ${warning}`)
  );
  return narrative;
}
