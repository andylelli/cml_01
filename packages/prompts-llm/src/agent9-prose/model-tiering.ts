/**
 * Per-stage model router (first-principles LLD §8 / phase P6).
 *
 * Spend the budget where craft lives: the strongest model on Generation and the critique→rewrite pass;
 * a cheaper/faster model on micro-regens, classification, and the scaffold detector. Resolution is
 * env-driven and ALWAYS falls back to the caller's default deployment, so when nothing is configured
 * every stage uses today's model (no behaviour change). Pure.
 *
 *   AGENT9_MODEL_GENERATE   — chapter generation (strong)
 *   AGENT9_MODEL_REWRITE    — critique→rewrite (strong)
 *   AGENT9_MODEL_CRITIQUE   — the critique half (may be cheaper than the rewrite half)
 *   AGENT9_MODEL_REGEN      — scoped micro-regens (cheap/fast)
 */

export type Agent9Stage = "generate" | "rewrite" | "critique" | "regen";

const ENV_BY_STAGE: Record<Agent9Stage, string> = {
  generate: "AGENT9_MODEL_GENERATE",
  rewrite: "AGENT9_MODEL_REWRITE",
  critique: "AGENT9_MODEL_CRITIQUE",
  regen: "AGENT9_MODEL_REGEN",
};

/**
 * Resolve the deployment for a stage: the stage env override if set and non-empty, else the caller's
 * default (the prose deployment). Never returns an empty string in place of a real default.
 */
export function resolveStageModel(stage: Agent9Stage, fallback?: string): string | undefined {
  const override = process.env[ENV_BY_STAGE[stage]];
  const trimmed = typeof override === "string" ? override.trim() : "";
  return trimmed.length > 0 ? trimmed : fallback;
}
