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
 *   - prose    → AZURE_OPENAI_DEPLOYMENT_NAME_PROSE       (Agent 9 prose)
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

/** Model for prose generation (Agent 9). */
export function resolveProseModel(): string | undefined {
  return process.env.AZURE_OPENAI_DEPLOYMENT_NAME_PROSE || baseDeployment();
}

/** Model for mechanical agents — the shared client default. */
export function resolveBaseModel(): string | undefined {
  return baseDeployment();
}
