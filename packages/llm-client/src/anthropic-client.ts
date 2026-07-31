/**
 * Anthropic (Claude) client — a `chat()`-compatible sibling of AzureOpenAIClient.
 *
 * WHY THIS EXISTS (documentation/15_claude_migration §6):
 * Agent 9's post-pass polish is a line-edit on a chapter that has ALREADY passed every hard gate.
 * It is a small fraction of total output tokens, so routing only that stage to a frontier model buys
 * sentence-craft at a fraction of the bill — measured: ~$0.25–0.85 per run on top of a ~$4 run.
 * This class exists so that routing is a client swap at one call site, not a rewrite of Agent 9.
 *
 * It deliberately implements the SAME `ChatCapableClient` surface as AzureOpenAIClient — same
 * `ChatOptions` in, same `ChatResponse` out, same LLMLogger operations — so `logs/llm.jsonl` and
 * `logs/llm-prompts-full.jsonl` stay uniform and the existing A/B tooling keeps working across
 * providers with no changes.
 *
 * THREE THINGS THAT ARE NOT LIKE AZURE, each load-bearing:
 *
 * 1. `temperature` is DROPPED, never forwarded. Current Claude models (Sonnet 5, Opus 5, Opus 4.7/4.8)
 *    return a 400 for `temperature`/`top_p`/`top_k`. Every Agent 9 call site sets a temperature — the
 *    polish paths use 0.2/0.3 — so forwarding it would fail every call. A line edit wants no sampling
 *    variance anyway, so dropping it is also the semantically correct choice here. The retry-temperature
 *    escalation in client.ts has no equivalent on this provider; the transport retry below is unaffected
 *    because a network failure says nothing about the sampling basin (same reasoning as A_62 RC-6.2).
 *
 * 2. Thinking is DISABLED by default. Sonnet 5 runs adaptive thinking when the field is omitted, and
 *    thinking tokens bill at the OUTPUT rate while sharing the `max_tokens` budget with the response.
 *    Left on, a 2.7k-token chapter rewrite under the existing `maxTokens: 5000` can truncate mid-edit
 *    and surface as `stop_reason: "max_tokens"` — i.e. a silent rollback every time. Opt back in with
 *    ANTHROPIC_THINKING=adaptive.
 *
 * 3. There is no schema-free JSON mode. `jsonMode` maps to an explicit instruction plus a defensive
 *    extraction of the outermost JSON object from the reply (fences, preamble). Callers keep using
 *    `parseProseResponse` unchanged.
 */

import Anthropic from "@anthropic-ai/sdk";
import type { ChatOptions, ChatResponse, Message } from "./types.js";
import { withRetry, defaultRetryConfig } from "./retry.js";
import { RateLimiter } from "./ratelimit.js";
import { CostTracker } from "./cost-tracker.js";
import { LLMLogger } from "./logger.js";
import { resolveRequestTimeoutMs } from "./client.js";

export const DEFAULT_ANTHROPIC_MODEL = "claude-sonnet-5";

/**
 * Floor for `max_tokens`. Callers were tuned against Azure, where the cap bounds response text only.
 * On Claude the cap bounds thinking + text together, so a caller-supplied 5000 is uncomfortably close
 * to a ~2.7k-token chapter rewrite. Raising the CAP costs nothing — output is billed on tokens actually
 * produced — while a truncated reply costs the whole call.
 */
const MIN_MAX_TOKENS = 8192;

/** Only "adaptive" turns thinking on; anything else (incl. unset) leaves it disabled. See §2 above. */
const resolveThinkingMode = (raw = process.env.ANTHROPIC_THINKING): "adaptive" | "disabled" =>
  raw?.trim().toLowerCase() === "adaptive" ? "adaptive" : "disabled";

/**
 * Pull the outermost JSON object out of a reply. Claude has no `response_format: json_object`, so a
 * reply may arrive fenced or with a sentence of preamble. Returns the input unchanged when it already
 * parses or when no object is found — `parseProseResponse` still has its `jsonrepair` fallback behind
 * this, so this is a first line of defence, not the only one.
 */
export const extractJsonPayload = (raw: string): string => {
  const text = (raw ?? "").trim();
  if (!text) return text;
  try {
    JSON.parse(text);
    return text;
  } catch {
    // fall through to extraction
  }
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = (fenced?.[1] ?? text).trim();
  const start = candidate.indexOf("{");
  const end = candidate.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) return candidate;
  return candidate.slice(start, end + 1);
};

const JSON_MODE_INSTRUCTION =
  "Respond with a single valid JSON object and nothing else. No prose before or after it, no markdown code fences.";

export class AnthropicClient {
  private client: Anthropic;
  private rateLimiter: RateLimiter;
  private costTracker: CostTracker;
  private logger: LLMLogger;
  private defaultModel: string;

  constructor(config: {
    apiKey: string;
    defaultModel?: string;
    baseURL?: string;
    requestsPerMinute?: number;
    tokensPerMinute?: number;
    logger?: LLMLogger;
    costTracker?: CostTracker;
  }) {
    this.client = new Anthropic({
      apiKey: config.apiKey,
      ...(config.baseURL ? { baseURL: config.baseURL } : {}),
      // Transport retry lives in withRetry below, exactly as it does for Azure. Letting the SDK retry
      // too would multiply the attempt budget — the nested-retry trap called out at client.ts RC-6.2.
      maxRetries: 0,
    });
    this.defaultModel = config.defaultModel || process.env.ANTHROPIC_MODEL || DEFAULT_ANTHROPIC_MODEL;
    this.rateLimiter = new RateLimiter({
      requestsPerMinute: config.requestsPerMinute || 50,
      tokensPerMinute: config.tokensPerMinute,
    });
    this.costTracker = config.costTracker || new CostTracker();
    this.logger = config.logger || new LLMLogger();
  }

  async chat(options: ChatOptions): Promise<ChatResponse> {
    return withRetry(() => this.chatOnce(options), options.retryConfig ?? defaultRetryConfig);
  }

  private async chatOnce(options: ChatOptions): Promise<ChatResponse> {
    const model = options.model || this.defaultModel;
    const maxTokens = Math.max(options.maxTokens ?? 4000, MIN_MAX_TOKENS);
    const thinkingMode = resolveThinkingMode();

    // Claude takes the system prompt as a top-level field, not a message role. Multiple system
    // messages are joined so a caller that emits several keeps all of them.
    const systemPrompt = options.messages
      .filter((m) => m.role === "system" || m.role === "developer")
      .map((m) => m.content)
      .concat(options.jsonMode ? [JSON_MODE_INSTRUCTION] : [])
      .join("\n\n")
      .trim();

    const turns = options.messages
      .filter((m): m is Message & { role: "user" | "assistant" } => m.role === "user" || m.role === "assistant")
      .map((m) => ({ role: m.role, content: m.content }));

    if (turns.length === 0) {
      throw new Error("AnthropicClient.chat: at least one user or assistant message is required");
    }

    await this.rateLimiter.waitForCapacity();
    const startTime = Date.now();

    const promptHash = LLMLogger.hashContent(JSON.stringify(options.messages));
    await this.logger.logFullPrompt({
      runId: options.logContext?.runId || "",
      projectId: options.logContext?.projectId || "",
      agent: options.logContext?.agent || "",
      operation: "chat_request_full_prompt",
      model,
      // Logged as undefined on purpose: no temperature was sent. A log line claiming 0.2 when the
      // provider never saw it would make the A/B unreadable.
      temperature: undefined,
      maxTokens,
      promptHash,
      retryAttempt: options.logContext?.retryAttempt || 0,
      messages: options.messages,
    });
    if (options.logContext) {
      await this.logger.logRequest({
        ...options.logContext,
        operation: "chat_request",
        model,
        maxTokens,
        promptHash,
        timestamp: new Date().toISOString(),
      });
    }

    const timeoutMs = resolveRequestTimeoutMs();

    try {
      const response = await this.client.messages.create(
        {
          model,
          max_tokens: maxTokens,
          ...(systemPrompt ? { system: systemPrompt } : {}),
          messages: turns,
          ...(thinkingMode === "disabled"
            ? { thinking: { type: "disabled" as const } }
            : { thinking: { type: "adaptive" as const } }),
          // NOTE: temperature/top_p/top_k are intentionally absent — see the header, item 1.
        },
        timeoutMs > 0 ? { timeout: timeoutMs } : {},
      );

      const latencyMs = Date.now() - startTime;

      const usage = {
        promptTokens: response.usage?.input_tokens ?? 0,
        completionTokens: response.usage?.output_tokens ?? 0,
        totalTokens: (response.usage?.input_tokens ?? 0) + (response.usage?.output_tokens ?? 0),
      };

      const estimatedCost = this.costTracker.trackCost(model, usage, options.logContext?.agent);

      const rawText = (response.content ?? [])
        .filter((block): block is Anthropic.TextBlock => block.type === "text")
        .map((block) => block.text)
        .join("");
      const content = options.jsonMode ? extractJsonPayload(rawText) : rawText;

      // `refusal` is a normal 200 on current models, and `max_tokens` means a truncated reply. Neither
      // throws, so a caller that only reads `.content` would parse a fragment. Surfacing both through
      // finishReason keeps that decision with the caller (polish rolls back on either).
      const finishReason = response.stop_reason ?? "end_turn";

      if (options.logContext) {
        await this.logger.logResponse({
          ...options.logContext,
          operation: "chat_response",
          model,
          promptHash,
          responseHash: LLMLogger.hashContent(content),
          response: content,
          latencyMs,
          promptTokens: usage.promptTokens,
          completionTokens: usage.completionTokens,
          totalTokens: usage.totalTokens,
          estimatedCost,
          success: true,
          timestamp: new Date().toISOString(),
        });
      }

      return { content, usage, model, finishReason, latencyMs };
    } catch (error) {
      const latencyMs = Date.now() - startTime;
      const err = error as Error & { name?: string; status?: number };

      // Same normalization contract as client.ts: our own deadline must read as retryable, or an
      // indefinite hang gets converted into a hard failure — strictly worse than a hang.
      const isOurDeadline = timeoutMs > 0 && (err?.name === "TimeoutError" || err?.name === "AbortError");
      const normalized = isOurDeadline
        ? Object.assign(
            new Error(
              `timeout: Anthropic request exceeded the ${timeoutMs}ms deadline after ${latencyMs}ms (${err.name}) — retryable`,
            ),
            { code: "ETIMEDOUT", cause: err },
          )
        : error;

      if (options.logContext) {
        await this.logger.logError({
          ...options.logContext,
          operation: "chat_error",
          model,
          errorMessage: (normalized as Error).message,
          errorCode: (normalized as any).code ?? (err?.status ? String(err.status) : undefined),
          timestamp: new Date().toISOString(),
          promptHash,
        });
      }

      throw normalized;
    }
  }

  getCostTracker(): CostTracker {
    return this.costTracker;
  }
}
