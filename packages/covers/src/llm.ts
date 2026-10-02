import { AnthropicClient, AzureOpenAIClient, type LLMLogger } from "@cml/llm-client";
import type { CoverChatClient } from "./types.js";

/**
 * The text model for the anchor step. Env read at CALL time (ADR-0004).
 *
 *   CML_COVER_LLM_PROVIDER   azure (default) | anthropic — "Claude-based" covers use the latter.
 *   CML_COVER_LLM_MODEL      Azure deployment or Claude model id. Defaults: AZURE_OPENAI_DEPLOYMENT_NAME / claude-sonnet-5.
 *
 * Returns `{ error }` instead of throwing: without a text model the anchors fall back to the inputs and
 * the cover is still made.
 */
export const createCoverLlmFromEnv = (
  env: NodeJS.ProcessEnv = process.env,
  logger?: LLMLogger,
): { client?: CoverChatClient; provider?: string; model?: string; error?: string } => {
  const provider = (env.CML_COVER_LLM_PROVIDER ?? "").trim().toLowerCase() || "azure";
  const model = (env.CML_COVER_LLM_MODEL ?? "").trim();
  if (provider === "anthropic" || provider === "claude") {
    const apiKey = (env.ANTHROPIC_API_KEY ?? "").trim();
    if (!apiKey) return { error: "CML_COVER_LLM_PROVIDER=anthropic but ANTHROPIC_API_KEY is unset" };
    const m = model || "claude-sonnet-5";
    return { client: new AnthropicClient({ apiKey, defaultModel: m, logger }) as unknown as CoverChatClient, provider: "anthropic", model: m };
  }
  if (provider !== "azure") return { error: `CML_COVER_LLM_PROVIDER="${provider}" is not azure or anthropic` };
  const endpoint = (env.AZURE_OPENAI_ENDPOINT ?? "").trim();
  const apiKey = (env.AZURE_OPENAI_API_KEY ?? "").trim();
  const m = model || (env.AZURE_OPENAI_DEPLOYMENT_NAME ?? "").trim();
  if (!endpoint || !apiKey || !m) return { error: "Azure chat config incomplete (AZURE_OPENAI_ENDPOINT / _API_KEY / _DEPLOYMENT_NAME)" };
  const client = new AzureOpenAIClient({
    endpoint,
    apiKey,
    defaultModel: m,
    apiVersion: (env.AZURE_OPENAI_API_VERSION ?? "").trim() || "2024-10-21",
    logger,
  });
  return { client: client as unknown as CoverChatClient, provider: "azure", model: m };
};
