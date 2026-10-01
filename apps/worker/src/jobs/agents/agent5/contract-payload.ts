/**
 * A5-11 / A5-D04 (owner decision 12, CML_VERIFIED_FIXES) — the strict structural contract and the locked
 * facts that Agent 5's FIRST extraction sends, built once from the same sources so every regeneration
 * payload (the red-herring floor, Agent 6's fair-play / post-revision / targeted / blind-reader
 * regenerations) can carry them too. Before this, only the first payload had them, so a regeneration
 * was free to drop the required ids, the direct-culprit clue, the late slot and the canonical values.
 */
import { buildStrictPromptFeedback } from "../../clue-contracts/contracts.js";
import type { OrchestratorContext } from "../shared.js";

type StrictPromptFeedbackBase = ReturnType<typeof buildStrictPromptFeedback>;

export const strictPromptContractsEnabled = (): boolean => {
  // Strict prompt-contract feedback is active by default for all core reliability paths.
  // Set AGENT5_STRICT_PROMPT_CONTRACTS=off to disable (diagnostic/testing only).
  const value = String(process.env.AGENT5_STRICT_PROMPT_CONTRACTS ?? "").trim().toLowerCase();
  if (value === "0" || value === "false" || value === "no" || value === "off") return false;
  return true;
};

/** The `strictContract` field of the first-pass payload, from the strict feedback base. */
export function buildAgent5StrictContract(base: StrictPromptFeedbackBase) {
  return base
    ? {
      strictSourcePaths: base.strictSourcePaths,
      requiredIdToSourceMappings: base.requiredIdToSourceMappings,
      requiredStepCoverageFloors: base.requiredStepCoverageFloors,
      requiredLateClueSlot: base.requiredLateClueSlot,
      requiredDirectCulpritClue: base.requiredDirectCulpritClue,
    }
    : undefined;
}

/** The `lockedFacts` spread of the first-pass payload (Pillar 1). */
export function buildAgent5LockedFactsPayload(ctx: OrchestratorContext) {
  return ctx.inputs.enableLockedFactRegistry && ctx.lockedFactRegistry && ctx.lockedFactRegistry.length > 0
    ? { lockedFacts: ctx.lockedFactRegistry }
    : {};
}

/**
 * The strict feedback base for the CURRENT CML, built exactly as runAgent5 builds it. After an Agent 4
 * revision that is the revised case, which is what Agent 6's regenerated clues must satisfy.
 */
export function currentAgent5StrictBase(ctx: OrchestratorContext): StrictPromptFeedbackBase {
  return ctx.cml && strictPromptContractsEnabled() ? buildStrictPromptFeedback(ctx.cml) : undefined;
}

/**
 * What a regeneration payload adds. Empty with CML_VERIFIED_FIXES OFF is the CALLER's job (each call
 * site gates on the flag so the OFF payload is byte-identical).
 */
export function buildAgent5RegenerationContract(ctx: OrchestratorContext, base: StrictPromptFeedbackBase) {
  const strictContract = buildAgent5StrictContract(base);
  return {
    ...(strictContract ? { strictContract } : {}),
    ...buildAgent5LockedFactsPayload(ctx),
  };
}
