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
 *   AGENT9_MODEL_REGEN      — scoped micro-regens (cheap/fast)
 *   AGENT9_MODEL_POLISH     — post-pass / cross-chapter polish line-edits (A_69 Increment 2)
 *
 * A_69 §5 Increment 2 — why `polish` earns its own tier: the polish passes emit a small fraction of
 * total generation output, so routing ONLY them to a stronger deployment buys frontier sentence-craft
 * at a fraction of the bill, and leaves generation's reliability profile untouched. Unset → identical
 * behaviour to today (falls back to the caller's prose deployment).
 */

export type Agent9Stage = "generate" | "rewrite" | "regen" | "polish";

const ENV_BY_STAGE: Record<Agent9Stage, string> = {
  generate: "AGENT9_MODEL_GENERATE",
  rewrite: "AGENT9_MODEL_REWRITE",
  regen: "AGENT9_MODEL_REGEN",
  polish: "AGENT9_MODEL_POLISH",
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
