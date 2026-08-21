/**
 * agent9-prose/polish-provider.ts
 *
 * Routes ONLY the post-pass polish stage to Anthropic (Claude Sonnet 5 by default), leaving every
 * other Agent 9 stage on the existing Azure deployment.
 *
 * WHY ONLY THIS STAGE (documentation/15_llm_model_and_cost §6):
 * `polishPassingChapter` fires at exactly one place — generate.ts, under `chapterErrors.length === 0`
 * — i.e. only once a chapter has already cleared every hard gate. It is therefore a pure quality lift
 * on known-good material: it can never be asked to *fix* a failing chapter, and its output is
 * validate-then-rollback guarded, so the worst case is the chapter we already accepted. That makes it
 * the one stage where swapping in a frontier model is both cheap (measured ~$0.25–0.85/run on top of
 * a ~$4 run) and risk-bounded.
 *
 * Flag-gated, default OFF (§2.8 corpus-era regime): unset AGENT9_POLISH_PROVIDER reproduces today's
 * behaviour byte for byte — the resolver returns undefined and the caller keeps its Azure client.
 *
 *   AGENT9_POLISH_PROVIDER=anthropic   — opt in (anything else, incl. unset → off)
 *   AGENT9_POLISH_ANTHROPIC_MODEL      — model id (default claude-sonnet-5)
 *   ANTHROPIC_API_KEY                  — required when opted in
 *   ANTHROPIC_BASE_URL                 — optional (e.g. a Foundry endpoint)
 *
 * Env is read at CALL time, never captured in a module const — the import-hoisting trap where a
 * module-level flag freezes before dotenv runs and the lever silently never fires.
 */

import { AnthropicClient, type ChatCapableClient, type CostTracker, type LLMLogger } from "@cml/llm-client";

/**
 * Telemetry the alternate provider MUST share with the rest of the pipeline.
 *
 * Both are load-bearing, and both were wrong in the first cut of this file:
 *  - `logger`: AnthropicClient defaults to `new LLMLogger()`, whose defaults are logToFile:false and
 *    logFullPromptsToFile:false. Left to default, every Sonnet 5 polish call would be ABSENT from
 *    logs/llm.jsonl and logs/llm-prompts-full.jsonl — the two files every A/B and cost audit reads.
 *    The pass would appear to do nothing while silently billing.
 *  - `costTracker`: a private tracker means the spend never reaches `client.getCostTracker()`, which
 *    is what Agent 9 and the orchestrator read for per-agent cost attribution.
 *
 * Passing the host client's instances makes the alternate provider indistinguishable from the default
 * one at the telemetry layer — the whole point of matching the ChatCapableClient surface.
 */
export interface PolishProviderTelemetry {
  logger?: LLMLogger;
  costTracker?: CostTracker;
}

export interface PolishProvider {
  client: ChatCapableClient;
  /** Provider-native model id. NOT an Azure deployment name — the stage tier does not apply here. */
  model: string;
}

export const DEFAULT_POLISH_ANTHROPIC_MODEL = "claude-sonnet-5";

export const isAnthropicPolishEnabled = (): boolean =>
  (process.env.AGENT9_POLISH_PROVIDER ?? "").trim().toLowerCase() === "anthropic";

export const resolvePolishAnthropicModel = (): string => {
  const raw = (process.env.AGENT9_POLISH_ANTHROPIC_MODEL ?? "").trim();
  return raw.length > 0 ? raw : DEFAULT_POLISH_ANTHROPIC_MODEL;
};

/** Cached across chapters so a 10-chapter run builds one client, not ten. Keyed so env flips re-resolve. */
let cached:
  | { key: string; logger?: LLMLogger; costTracker?: CostTracker; provider: PolishProvider }
  | undefined;
let missingKeyWarned = false;

/** Test seam — drops the memoized client so a suite can flip env between cases. */
export const resetPolishProviderCache = (): void => {
  cached = undefined;
  missingKeyWarned = false;
};

/**
 * Returns the polish provider when opted in and usable, else undefined (caller keeps its own client).
 *
 * A missing API key must NOT abort the run. Polish is a quality-only lift on a chapter that already
 * passed; degrading to the existing provider costs some craft, whereas throwing would kill a run that
 * is otherwise complete. Warn once, continue.
 */
export const resolvePolishProvider = (
  telemetry: PolishProviderTelemetry = {},
): PolishProvider | undefined => {
  if (!isAnthropicPolishEnabled()) return undefined;

  const apiKey = (process.env.ANTHROPIC_API_KEY ?? "").trim();
  if (!apiKey) {
    if (!missingKeyWarned) {
      console.warn(
        "[Agent 9] AGENT9_POLISH_PROVIDER=anthropic but ANTHROPIC_API_KEY is unset — post-pass polish falls back to the default provider.",
      );
      missingKeyWarned = true;
    }
    return undefined;
  }

  const model = resolvePolishAnthropicModel();
  const baseURL = (process.env.ANTHROPIC_BASE_URL ?? "").trim();
  const key = `${model}|${baseURL}|${apiKey.slice(-6)}`;
  // Identity-compare the telemetry too: a cached client wired to a previous run's logger would write
  // this run's polish calls into the wrong destination (or nowhere).
  if (cached?.key === key && cached.logger === telemetry.logger && cached.costTracker === telemetry.costTracker) {
    return cached.provider;
  }

  const provider: PolishProvider = {
    client: new AnthropicClient({
      apiKey,
      defaultModel: model,
      ...(baseURL ? { baseURL } : {}),
      ...(telemetry.logger ? { logger: telemetry.logger } : {}),
      ...(telemetry.costTracker ? { costTracker: telemetry.costTracker } : {}),
    }),
    model,
  };
  cached = { key, logger: telemetry.logger, costTracker: telemetry.costTracker, provider };
  console.warn(`[Agent 9] Post-pass polish routed to Anthropic model \`${model}\` (passing chapters only).`);
  return provider;
};
