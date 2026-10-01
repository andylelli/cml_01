/**
 * model-tiers.ts — central per-agent model tier resolution (FIX 1, hybrid model strategy).
 *
 * The pipeline shares one LLM client whose `defaultModel` is the cheap base deployment.
 * To run reasoning-heavy creative agents on a stronger model without paying premium prices
 * for the mechanical agents, each agent resolves its model via the tier helpers below.
 *
 * Tiers (env vars are Azure deployment names):
 *   - base     → AZURE_OPENAI_DEPLOYMENT_NAME            (mechanical: profiles, temporal, etc.)
 *   - design   → AZURE_OPENAI_DEPLOYMENT_NAME_DESIGN     (CML, clues, fair-play, outline)
 *   (the v1 prose tier, AZURE_OPENAI_DEPLOYMENT_NAME_PROSE, went with v1; v2 routes per role via PROSE_V2_*)
 *   - a set AGENTn_MODEL outranks either tier for that agent (owner decision 12, ORC-Q07)
 *
 * Each premium tier falls back to the base deployment when its env var is unset, so the
 * default behaviour is unchanged until an operator opts in. This makes the model swap a
 * pure configuration change (the recommended premium tier is gpt-4.1).
 */

const baseDeployment = (): string | undefined =>
  process.env.AZURE_OPENAI_DEPLOYMENT_NAME || undefined;

/** Model for reasoning-heavy mystery-design + fair-play agents (3, 3b, 5, 6, 7). */
export function resolveDesignModel(): string | undefined {
  return process.env.AZURE_OPENAI_DEPLOYMENT_NAME_DESIGN || baseDeployment();
}

