/**
 * Per-stage model router (first-principles LLD §8 / phase P6).
 *
 * Spend the budget where craft lives: the strongest model on Generation; a cheaper/faster model on
 * micro-regens, classification, and the scaffold detector. Resolution is env-driven and ALWAYS falls
 * back to the caller's default deployment, so when nothing is configured every stage uses today's
 * model (no behaviour change). Pure.
 *
 *   AGENT9_MODEL_GENERATE   — chapter generation (strong)
 *   AGENT9_MODEL_REGEN      — scoped micro-regens (cheap/fast)
 *   AGENT9_MODEL_POLISH     — post-pass / cross-chapter polish line-edits (A_69 Increment 2)
 *
 * REVIEW_02 §2.3 — the `rewrite` tier was REMOVED 2026-08-02. Its only consumer was the
 * critique→rewrite pass deleted by S1 on 2026-08-01; the tier, its env var and this comment outlived
 * it, so `.env.local` carried `AGENT9_MODEL_REWRITE=gpt-4.1` — a model choice read by nothing. That
 * is the same shape FLAG-AUDIT recorded for `AGENT9_MODEL_REGEN` and called "the third instance of
 * this defect in this document". A deleted pass must take its config surface with it.
 *
 * A_69 §5 Increment 2 — why `polish` earns its own tier: the polish passes emit a small fraction of
 * total generation output, so routing ONLY them to a stronger deployment buys frontier sentence-craft
 * at a fraction of the bill, and leaves generation's reliability profile untouched. Unset → identical
 * behaviour to today (falls back to the caller's prose deployment).
 */

export type Agent9Stage = "generate" | "regen" | "polish";

const ENV_BY_STAGE: Record<Agent9Stage, string> = {
  generate: "AGENT9_MODEL_GENERATE",
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
