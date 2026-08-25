/**
 * Per-agent model router.
 *
 * WHY. `resolveStageModel` (prompts-llm/agent9-prose/model-tiering.ts) tiers Agent 9 into
 * generate / regen / polish. Every OTHER agent — 1, 2, 2b, 2c, 2d, 2e, 3, 3b, 5, 6, 6.5, 7, 8, and
 * the rubric judge — passes no `model` at all and falls through to the caller's default deployment.
 * So a run has one knob for its most expensive stage and none for the other twenty.
 *
 * MEASURED on `mystery-1787681973166` (2026-08-25, £1.78 / $2.26 total):
 *
 *     Agent65-WorldBuilder      $0.193   9%      Agent2-CastDesigner    $0.097   4%
 *     Agent3-CMLGenerator       $0.128   6%      Agent7-Narrative       $0.084   4%
 *     …and 12 more smaller stages                              non-Agent-9 total: 28% of the run
 *
 * Moving all of that to `gpt-4.1-mini` saves **$0.63 (£0.50), 28% of the run**. Whether it SHOULD
 * move is a per-agent judgement — Agent 3 authors the case and Agent 7 the outline, and plot and
 * clues both sit at 8 in the reader's rubric, so downgrading them to save pennies is a bad trade.
 * The enrichment tail (2b/2c/2d/2e/8, the blind reader, the novelty judge) is a different question
 * and totals ~£0.10 with far less at stake. **This module supplies the knob; it does not decide.**
 *
 * WHERE IT PLUGS IN, AND WHY THERE. Upstream agents call `client.chat({...})` WITHOUT a model and
 * with `logContext.agent` set — the same label the cost audit attributes spend by. So the router
 * resolves inside the client at the one line where the model is chosen, and no agent call site
 * changes. Fifteen edits become one, and an agent added tomorrow is routed without being told to be.
 *
 * PRECEDENCE, deliberately: an explicit `options.model` always wins. Agent 9's stage tiering passes
 * its model explicitly, so this router can never override a decision that layer already made.
 *
 * NAMING. `Agent2c-LocationProfiles` → `AGENT2C_MODEL`; `Agent65-WorldBuilder` → `AGENT65_MODEL`;
 * `RubricScorer` → `RUBRIC_SCORER_MODEL`. Unset → the caller's default, so with nothing configured
 * behaviour is byte-identical to today.
 */

/**
 * The env var for an agent label. Exported for the flag register and for tests: a naming rule that
 * only exists inside a regex is a rule nobody can check.
 */
export const agentModelEnvVar = (agentLabel: string): string | null => {
  const label = String(agentLabel ?? "").trim();
  if (!label) return null;

  // `RubricScorer`, `NoveltySkeletonJudge` — no agent number, so snake-case the whole label.
  const numbered = /^Agent([0-9]+[a-z]?)\b/i.exec(label);
  if (numbered) return `AGENT${numbered[1]!.toUpperCase()}_MODEL`;

  const snake = label
    .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
    .replace(/[^A-Za-z0-9]+/g, "_")
    .toUpperCase()
    .replace(/^_+|_+$/g, "");
  return snake ? `${snake}_MODEL` : null;
};

/**
 * Resolve the deployment for one call.
 *
 * Read at CALL time, never at module load — the dotenv-freeze trap this repo has paid for more than
 * once. Never returns an empty string in place of a real default.
 */
export const resolveAgentModel = (
  agentLabel: string | undefined,
  fallback: string,
  env: NodeJS.ProcessEnv = process.env,
): string => {
  if (!agentLabel) return fallback;
  const key = agentModelEnvVar(agentLabel);
  if (!key) return fallback;
  const override = typeof env[key] === "string" ? env[key]!.trim() : "";
  return override.length > 0 ? override : fallback;
};
