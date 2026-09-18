/**
 * PROSE ENGINE v2 — THE FOUR ROLES AND WHO PLAYS THEM (ANALYSIS_99 §10.10).
 *
 * v2 has four LLM jobs and they are not the same job: the WRITER drafts, the CRITIC finds, the EDITOR
 * repairs, the JUDGE breaks a tie the instruments cannot. Each resolves to `provider:model` from its
 * own environment variable, so the frontier-writer experiment (M6) is a variable change rather than a
 * branch, and so the cheap roles stay cheap while the expensive one is tested.
 *
 * ── WHY THIS IS A WORKER FILE AND NOT A PACKAGE ONE ──────────────────────────────────────────────
 *
 * `@cml/prose-engine` is pure on purpose: every decision it makes is replayable over the archive for
 * £0. Provider wiring is the opposite kind of thing — keys, clients, rate limits — so it lives here,
 * beside the orchestrator that already owns the Azure client.
 *
 * ── THE CLAUDE DIFFERENCES, MEASURED IN 15_llm §3 ────────────────────────────────────────────────
 *
 *   - `temperature` returns 400 on Opus 5, Sonnet 5, Opus 4.8 and 4.7. It is omitted, never sent.
 *   - there is no schema-free JSON mode; the critic and editor prompts ask for JSON in words and the
 *     parsers are total, which is what they have to be for either provider.
 *   - a missing API key must not abort a run: the role falls back to the Azure client with a warning,
 *     exactly as the polish provider does, because a run that reached the prose stage has already
 *     paid for everything upstream.
 */

import { AnthropicClient, type ChatCapableClient, type CostTracker, type LLMLogger } from "@cml/llm-client";

export type RoleName = "writer" | "critic" | "editor" | "judge";

export interface ResolvedRole {
  name: RoleName;
  provider: "azure" | "anthropic";
  client: ChatCapableClient;
  /** Provider-native model id, or an Azure deployment name. Undefined means the client's default. */
  model?: string;
  /** The cap the segmentation plan is sized against. */
  maxOutputTokens: number;
  /** False for every current Claude model — the parameter is rejected, not ignored. */
  supportsTemperature: boolean;
}

const ENV_BY_ROLE: Record<RoleName, string> = {
  writer: "PROSE_V2_WRITER",
  critic: "PROSE_V2_CRITIC",
  editor: "PROSE_V2_EDITOR",
  judge: "PROSE_V2_JUDGE",
};

const DEFAULT_BY_ROLE: Record<RoleName, string> = {
  writer: "azure:gpt-4.1",
  critic: "azure:gpt-4.1",
  editor: "azure:gpt-4.1",
  judge: "azure:gpt-4.1-mini",
};

/** Output caps, by model family. Overridable per role with `<ENV>_MAX_TOKENS`. */
const DEFAULT_CAP: Record<string, number> = {
  "gpt-4.1": 32_768,
  "gpt-4.1-mini": 16_384,
  "claude-opus-5": 32_000,
  "claude-sonnet-5": 32_000,
  "claude-haiku-4-5": 16_000,
};

let anthropicCache: { key: string; client: AnthropicClient } | undefined;
let missingKeyWarned = false;

/** Test seam — drops the memoized client so a suite can flip env between cases. */
export const resetRoleCache = (): void => {
  anthropicCache = undefined;
  missingKeyWarned = false;
};

export interface RoleTelemetry {
  logger?: LLMLogger;
  costTracker?: CostTracker;
}

/**
 * Resolve one role. Never throws and never returns nothing: an unusable Anthropic configuration
 * degrades to the Azure client the run already holds, with one warning.
 */
export const resolveRole = (
  name: RoleName,
  azure: ChatCapableClient,
  telemetry: RoleTelemetry = {},
): ResolvedRole => {
  const configured = (process.env[ENV_BY_ROLE[name]] ?? "").trim();
  /**
   * An unset variable in Node is the STRING "undefined" if something assigned `undefined` to it, and
   * a malformed value is just a string. Either way the parse below yields no known model, and the
   * first cut then fell back to a blind 16,384-token cap — which silently re-segmented a book that
   * fits one call into three, because `planSegments` is sized against exactly this number. FOUND BY
   * THE DRY RUN, where a test's own env restore wrote "undefined" and the plan quietly changed.
   *
   * So an unrecognised configuration falls back to the ROLE'S DEFAULT and says so, rather than to a
   * number nobody chose.
   */
  const raw = configured && configured.toLowerCase() !== "undefined" ? configured : DEFAULT_BY_ROLE[name];
  const [providerRaw, ...modelParts] = raw.split(":");
  const provider = (providerRaw ?? "azure").trim().toLowerCase();
  let model = modelParts.join(":").trim() || undefined;
  if (!model || DEFAULT_CAP[model] === undefined) {
    const fallback = DEFAULT_BY_ROLE[name].split(":").slice(1).join(":");
    if (raw !== DEFAULT_BY_ROLE[name]) {
      console.warn(
        `[Agent 9 v2] ${ENV_BY_ROLE[name]}="${raw}" names no model this build knows a cap for; ` +
          `using ${fallback} and its cap. Set ${ENV_BY_ROLE[name]}_MAX_TOKENS to override.`,
      );
    }
    model = model ?? fallback;
  }
  const capOverride = Number((process.env[`${ENV_BY_ROLE[name]}_MAX_TOKENS`] ?? "").trim());
  const cap =
    Number.isFinite(capOverride) && capOverride > 0
      ? capOverride
      : DEFAULT_CAP[model] ?? DEFAULT_CAP[DEFAULT_BY_ROLE[name].split(":").slice(1).join(":")] ?? 16_384;

  if (provider === "anthropic") {
    const apiKey = (process.env.ANTHROPIC_API_KEY ?? "").trim();
    if (!apiKey) {
      if (!missingKeyWarned) {
        console.warn(
          `[Agent 9 v2] ${ENV_BY_ROLE[name]} asks for anthropic and ANTHROPIC_API_KEY is unset — the role falls back to Azure.`,
        );
        missingKeyWarned = true;
      }
    } else {
      const baseURL = (process.env.ANTHROPIC_BASE_URL ?? "").trim();
      const key = `${model}|${baseURL}|${apiKey.slice(-6)}`;
      if (!anthropicCache || anthropicCache.key !== key) {
        anthropicCache = {
          key,
          client: new AnthropicClient({
            apiKey,
            ...(model ? { defaultModel: model } : {}),
            ...(baseURL ? { baseURL } : {}),
            ...(telemetry.logger ? { logger: telemetry.logger } : {}),
            ...(telemetry.costTracker ? { costTracker: telemetry.costTracker } : {}),
          }),
        };
      }
      return {
        name,
        provider: "anthropic",
        client: anthropicCache.client,
        model,
        maxOutputTokens: cap,
        // 15_llm §3.1 — temperature is a 400 on every current Claude model, not a no-op.
        supportsTemperature: false,
      };
    }
  }

  return { name, provider: "azure", client: azure, model, maxOutputTokens: cap, supportsTemperature: true };
};

/** The agent label every call carries, so the cost tracker can attribute v2 by role (L9). */
export const roleLabel = (name: RoleName, detail = ""): string =>
  `Agent9v2-${name[0]!.toUpperCase()}${name.slice(1)}${detail ? `-${detail}` : ""}`;
