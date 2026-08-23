/**
 * Azure OpenAI client wrapper with retry logic and rate limiting
 */

import { OpenAIClient, AzureKeyCredential } from "@azure/openai";
import type { ChatOptions, ChatResponse, Message } from "./types.js";
import { withRetry, CircuitBreaker, defaultRetryConfig } from "./retry.js";
import { RateLimiter } from "./ratelimit.js";
import { CostTracker } from "./cost-tracker.js";
import { ContentFilterTracker } from "./content-filter.js";
import { LLMLogger } from "./logger.js";
import {
  MIN_JSON_SCHEMA_API_VERSION,
  buildChatWireRequest,
  isHttpTransportEnabled,
  postChatCompletion,
  supportsJsonSchema,
} from "./azure-http-transport.js";

// Retry salt (ANALYSIS_49 follow-up): escalate the sampling temperature on each *retry* so a call that
// reproduces the same failing response gets pushed out of its sampling basin. Most valuable for the
// low-temperature loops (e.g. the temp-0.2 prose polish and structural validators), where identical
// input reliably yields identical output. `retryAttempt` is 1-based (attempt 1 = first try, so a real
// retry is attempt >= 2); the bump is modest and capped so it doesn't wreck structure adherence.
// Opt out with LLM_RETRY_TEMP_ESCALATION=off.
const RETRY_TEMP_STEP = 0.12;
const RETRY_TEMP_CAP = 0.9;
export const escalateRetryTemperature = (base: number, retryAttempt: number): number => {
  const retriesSoFar = (retryAttempt ?? 0) - 1; // 1-based: attempt 1 = first try → no escalation
  if (retriesSoFar <= 0) return base;
  if (/^(0|off|false|no)$/i.test(process.env.LLM_RETRY_TEMP_ESCALATION ?? "")) return base;
  return Math.min(RETRY_TEMP_CAP, Math.max(base, base + RETRY_TEMP_STEP * retriesSoFar));
};

// ── A_62 RC-6: per-request timeout ───────────────────────────────────────────────────────────────
// WHY: `getChatCompletions` was called with NO abortSignal and NO requestOptions.timeout, so a
// stalled or severed response blocked the run FOREVER. Observed twice, same signature both times —
// CPU 0, socket to Azure still ESTABLISHED, request logged with no response:
//   * run mystery-1784231640128 (2026-07-16): Agent9-Regen-Ch7 hung >15 min until killed by hand.
//   * run mystery-1784150843898 (2026-07-15): Agent9 Ch7 hung 4h28m across a machine standby and
//     then COMPLETED on wake — proving the client will wait on a dead socket indefinitely rather
//     than fail fast and retry.
// Between them these cost 4 lost runs, each of which had to be hand-diagnosed to tell "interrupted"
// (count-safe) from "aborted" (restarts the M1 count).
//
// The bitter part: `defaultRetryConfig.retryableErrors` has listed "timeout" / "ETIMEDOUT" /
// "connection_error" all along — that retry path was simply UNREACHABLE, because nothing ever timed
// out. Setting a deadline makes the existing retry machinery live; it is not new behaviour so much
// as behaviour that was always intended.
//
// Chosen default 240s: the slowest healthy Agent-9 chapter call observed is ~30s, and the slowest
// whole run (M1-6 clock) was 72 min across ~100 calls. 240s is ~8x the slowest single call — long
// enough never to cut off a legitimately slow generation, short enough that a hang costs one retry
// rather than a night. Override with LLM_REQUEST_TIMEOUT_MS; 0/off disables (restores the old hang).
const DEFAULT_REQUEST_TIMEOUT_MS = 240_000;
export const resolveRequestTimeoutMs = (raw = process.env.LLM_REQUEST_TIMEOUT_MS): number => {
  if (raw === undefined || raw.trim() === "") return DEFAULT_REQUEST_TIMEOUT_MS;
  if (/^(off|false|no)$/i.test(raw.trim())) return 0; // 0 = no deadline (opt out)
  const parsed = Number(raw);
  if (!Number.isFinite(parsed) || parsed < 0) return DEFAULT_REQUEST_TIMEOUT_MS;
  return Math.floor(parsed);
};

/**
 * R3 — resolve the Azure `responseFormat` from the caller's options.
 *
 * Exported for testing: the whole value of structured outputs is that the schema actually reaches
 * the API, and that is exactly the kind of wiring this codebase has repeatedly got wrong silently.
 */
export const resolveResponseFormat = (options: {
  jsonMode?: boolean;
  jsonSchema?: { name: string; schema: Record<string, unknown>; strict?: boolean };
}):
  | { type: "json_object" }
  | { type: "json_schema"; json_schema: { name: string; schema: Record<string, unknown>; strict: boolean } }
  | undefined => {
  if (options.jsonSchema && options.jsonMode) {
    // Throw rather than pick one. Silently preferring a format would mask a caller bug and produce
    // output that looks fine but was never schema-constrained — the exact failure mode R3 exists
    // to remove.
    throw new Error(
      "ChatOptions: `jsonMode` and `jsonSchema` are mutually exclusive — pass only one " +
        `(jsonSchema.name="${options.jsonSchema.name}")`,
    );
  }
  if (options.jsonSchema) {
    return {
      type: "json_schema" as const,
      json_schema: {
        name: options.jsonSchema.name,
        schema: options.jsonSchema.schema,
        strict: options.jsonSchema.strict ?? true,
      },
    };
  }
  return options.jsonMode ? { type: "json_object" as const } : undefined;
};

/**
 * R3 — a schema-constrained call can come back unusable in ways an unconstrained one cannot.
 * `length` means the JSON is truncated mid-object; `content_filter` means nothing usable arrived.
 * Both would otherwise surface downstream as a parse failure, which sends the reader hunting for a
 * schema bug that does not exist.
 */
export class StructuredOutputError extends Error {
  constructor(
    readonly reason: "truncated" | "filtered",
    readonly schemaName: string,
    readonly finishReason: string,
  ) {
    super(
      reason === "truncated"
        ? `Structured output "${schemaName}" was truncated (finish_reason=${finishReason}) — the JSON is incomplete. Raise maxTokens.`
        : `Structured output "${schemaName}" was blocked by the content filter (finish_reason=${finishReason}).`,
    );
    this.name = "StructuredOutputError";
  }
}

export class AzureOpenAIClient {
  private client: OpenAIClient;
  private circuitBreaker: CircuitBreaker;
  private rateLimiter: RateLimiter;
  private costTracker: CostTracker;
  private contentFilterTracker: ContentFilterTracker;
  private logger: LLMLogger;
  private defaultModel: string;
  // REVIEW_02 §4.1 — kept for the direct-HTTP transport, which needs the URL and key the SDK hides.
  private endpoint: string;
  private apiKey: string;
  private apiVersion: string;

  constructor(config: {
    apiKey: string;
    endpoint: string;
    apiVersion?: string;
    defaultModel?: string;
    requestsPerMinute?: number;
    tokensPerMinute?: number;
    logger?: LLMLogger;
    /**
     * Inject a shared cost tracker.
     *
     * `AnthropicClient` has accepted one since it was written, and the Agent 9 polish provider depends
     * on that to fold Anthropic spend into the run's ledger. This client silently ignored it: the field
     * was not on the config type, so a caller that passed one got no error and no data, and read zeros
     * back from its own instance. **One capability, two clients, one wired** — the recurring shape
     * (X84 was the same defect in the polish pass).
     *
     * MEASURED: `judge-pairwise.mjs` and `judge-ab.mjs` both construct a tracker, pass it here, and
     * report `totalCost: 0` at the end of a paid experiment. Omitted ⇒ a private tracker, reachable
     * via `getCostTracker()`, exactly as before.
     */
    costTracker?: CostTracker;
  }) {
    this.endpoint = config.endpoint;
    this.apiKey = config.apiKey;
    this.apiVersion = config.apiVersion || "2024-02-15-preview";

    this.client = new OpenAIClient(
      config.endpoint,
      new AzureKeyCredential(config.apiKey),
      {
        apiVersion: this.apiVersion
      }
    );

    this.defaultModel = config.defaultModel || process.env.AZURE_OPENAI_DEPLOYMENT_NAME!;

    this.circuitBreaker = new CircuitBreaker(
      parseInt(process.env.CIRCUIT_BREAKER_FAILURE_THRESHOLD || "5"),
      parseInt(process.env.CIRCUIT_BREAKER_RESET_TIMEOUT_MS || "60000")
    );

    this.rateLimiter = new RateLimiter({
      requestsPerMinute: config.requestsPerMinute || 60,
      tokensPerMinute: config.tokensPerMinute,
    });

    this.costTracker = config.costTracker || new CostTracker();
    this.contentFilterTracker = new ContentFilterTracker();

    this.logger = config.logger || new LLMLogger();
  }

  // ── A_62 RC-6.2: transport retry lives HERE, at the choke point ─────────────────────────────────
  // Found via M1v4 run 3 (mystery-1784236058900): a ~30s DNS outage (getaddrinfo ENOTFOUND, 3 hits
  // 16s/6s/6s apart) aborted the run at Agent-9 Ch9. The log's 18-MILLISECOND gap between error and
  // next request was the tell: withRetry's delays never ran, because **23 pipeline call sites call
  // chat() directly** (agents 2,2b-e,3b-judge,4,5,6,6.5,7,8 and all seven Agent-9 prose paths) —
  // only agents 1/3/3b ever used chatWithRetry(). So `defaultRetryConfig.retryableErrors` — and the
  // RC-6 timeout normalization built to feed it — was dead code on most of the pipeline, and every
  // transport blip fell through to the AGENTS' content-retry loops, burning 3-attempt budgets in
  // seconds and converting a network hiccup into an abort class.
  //
  // The fix puts the invariant where every caller inherits it: public chat() wraps a single-attempt
  // chatOnce() in withRetry. Per-attempt logging (chat_request / chat_error, full prompts) stays
  // inside chatOnce so the diagnostic contract is unchanged — one log line per real network attempt
  // (run 3's forensics depended on exactly that). Temperature escalation stays keyed to the CALLER'S
  // content-retry attempt (logContext.retryAttempt), never the transport attempt — a network failure
  // says nothing about the sampling basin.
  async chat(options: ChatOptions): Promise<ChatResponse> {
    return withRetry(() => this.chatOnce(options), options.retryConfig ?? defaultRetryConfig);
  }

  private async chatOnce(options: ChatOptions): Promise<ChatResponse> {
    const model = options.model || this.defaultModel;
    const baseTemperature = options.temperature ?? 0.7;
    // Salt repeated retries by escalating temperature (logged value reflects the escalated temp).
    const temperature = escalateRetryTemperature(baseTemperature, options.logContext?.retryAttempt ?? 0);
    const maxTokens = options.maxTokens ?? 4000;

    // REVIEW_02 §2.1 — resolve the response format BEFORE anything is logged or sent, and refuse a
    // schema the active transport cannot carry. Without this the request goes out as
    // `{"type":"json_schema"}` with the schema stripped by the SDK serializer and comes back a
    // non-retryable 400 from stage 13 — expensive, and indistinguishable from a schema bug. The
    // orchestrator has a t=0 guard for the same condition (`assertFlagCapabilities`); this is the
    // backstop for the direct-to-agent harnesses that never touch the orchestrator.
    const responseFormat = resolveResponseFormat(options);
    const useHttpTransport = isHttpTransportEnabled();
    if (options.jsonSchema) {
      if (!useHttpTransport) {
        throw new Error(
          `Structured output "${options.jsonSchema.name}" was requested, but the @azure/openai SDK ` +
            `transport DROPS the json_schema payload (operations.js rebuilds response_format as ` +
            `{type} only). Set LLM_HTTP_TRANSPORT=true to send it. Refusing rather than sending a ` +
            `malformed request — see architecture/REVIEW_02.md §2.1.`,
        );
      }
      if (!supportsJsonSchema(this.apiVersion)) {
        throw new Error(
          `Structured output "${options.jsonSchema.name}" requires api-version ` +
            `${MIN_JSON_SCHEMA_API_VERSION} or later; AZURE_OPENAI_API_VERSION is "${this.apiVersion}". ` +
            `Refusing rather than sending a request this endpoint will reject.`,
        );
      }
    }

    // Wait for rate limit capacity
    await this.rateLimiter.waitForCapacity();

    const startTime = Date.now();

    // Log request (including full prompt)
    const promptHash = LLMLogger.hashContent(JSON.stringify(options.messages));
    await this.logger.logFullPrompt({
      runId: options.logContext?.runId || "",
      projectId: options.logContext?.projectId || "",
      agent: options.logContext?.agent || "",
      operation: "chat_request_full_prompt",
      model,
      temperature,
      maxTokens,
      promptHash,
      retryAttempt: options.logContext?.retryAttempt || 0,
      messages: options.messages,
      // REVIEW_02 §2.1 — the project's rule is that a flag is verified only by finding its effect in
      // `llm-prompts-full.jsonl`. That rule could not be applied to structured outputs because the
      // field was never logged. Now it is: `json_schema` here means the schema was actually sent.
      responseFormat,
      transport: useHttpTransport ? "http" : "azure-sdk",
    });
    if (options.logContext) {
      await this.logger.logRequest({
        ...options.logContext,
        operation: "chat_request",
        model,
        temperature,
        maxTokens,
        promptHash,
        timestamp: new Date().toISOString(),
      });
    }

    // A_62 RC-6: bound the request. Without this the call blocks forever on a stalled socket (see
    // resolveRequestTimeoutMs). Declared outside the try so the catch can attribute an abort to it.
    const timeoutMs = resolveRequestTimeoutMs();

    try {
      const wire = useHttpTransport
        ? await postChatCompletion({
            request: buildChatWireRequest({
              endpoint: this.endpoint,
              deployment: model,
              apiVersion: this.apiVersion,
              messages: options.messages,
              temperature,
              maxTokens,
              responseFormat,
            }),
            apiKey: this.apiKey,
            ...(timeoutMs > 0 ? { signal: AbortSignal.timeout(timeoutMs) } : {}),
          })
        : await (async () => {
            const response = await this.client.getChatCompletions(
              model,
              options.messages.map((msg) => ({
                role: msg.role as "system" | "user" | "assistant",
                content: msg.content,
              })),
              {
                temperature,
                maxTokens,
                responseFormat,
                ...(timeoutMs > 0 ? { abortSignal: AbortSignal.timeout(timeoutMs) } : {}),
              }
            );
            return {
              content: response.choices[0]?.message?.content || "",
              finishReason: response.choices[0]?.finishReason || "stop",
              usage: {
                promptTokens: response.usage?.promptTokens || 0,
                completionTokens: response.usage?.completionTokens || 0,
                totalTokens: response.usage?.totalTokens || 0,
                // The SDK's CompletionsUsage has no details object; 0 means "not reported by this
                // transport", NOT "no cache hit". Only the http transport can carry a real figure.
                cachedPromptTokens: 0,
              },
            };
          })();

      const latencyMs = Date.now() - startTime;

      const usage = {
        promptTokens: wire.usage.promptTokens,
        completionTokens: wire.usage.completionTokens,
        totalTokens: wire.usage.totalTokens,
        ...(useHttpTransport ? { cachedPromptTokens: wire.usage.cachedPromptTokens } : {}),
      };

      const estimatedCost = this.costTracker.trackCost(
        model,
        usage,
        options.logContext?.agent
      );

      const content = wire.content;
      const finishReason = wire.finishReason;

      // R3 — a schema-constrained reply that stopped early is NOT a parse problem, and must not be
      // reported as one. Only raised for jsonSchema calls: the unconstrained paths have their own
      // completion-first fallbacks that depend on receiving partial content.
      if (options.jsonSchema) {
        if (finishReason === "length") {
          throw new StructuredOutputError("truncated", options.jsonSchema.name, finishReason);
        }
        if (finishReason === "content_filter") {
          throw new StructuredOutputError("filtered", options.jsonSchema.name, finishReason);
        }
      }

      const chatResponse: ChatResponse = {
        content,
        usage,
        model, // Use deployment name since response may not have model property
        finishReason,
        latencyMs,
      };

      // Log response
      if (options.logContext) {
        const promptHash = LLMLogger.hashContent(JSON.stringify(options.messages));
        const responseHash = LLMLogger.hashContent(content);
        await this.logger.logResponse({
          ...options.logContext,
          operation: "chat_response",
          model,
          promptHash,
          responseHash,
          response: content,
          latencyMs,
          promptTokens: usage.promptTokens,
          completionTokens: usage.completionTokens,
          totalTokens: usage.totalTokens,
          // Only present on the http transport — see TokenUsage.cachedPromptTokens on why an absent
          // value must never be written as 0.
          ...(usage.cachedPromptTokens !== undefined ? { cachedPromptTokens: usage.cachedPromptTokens } : {}),
          estimatedCost,
          success: true,
          timestamp: new Date().toISOString(),
        });
      }

      return chatResponse;
    } catch (error) {
      const latencyMs = Date.now() - startTime;

      // A_62 RC-6: normalize our own deadline into a RETRYABLE error.
      // `isRetryableError` substring-matches on error.message, and the abort paths do NOT say
      // "timeout": AbortSignal.timeout raises a DOMException named "TimeoutError", while the Azure
      // pipeline surfaces it as an AbortError whose message is "The operation was aborted." — neither
      // matches any entry in defaultRetryConfig.retryableErrors. Left raw, the deadline would convert
      // an indefinite HANG into a hard FAILURE, which is strictly worse: a hang is count-safe
      // (interrupted), an unretried failure aborts the run and restarts the M1 count. Re-throwing with
      // "timeout" in the message routes it into withRetry's existing backoff, which is the whole point
      // of setting a deadline. We are the only signal source on this call, so an abort here can only
      // be ours.
      const err = error as Error & { name?: string };
      const isOurDeadline =
        timeoutMs > 0 && (err?.name === "TimeoutError" || err?.name === "AbortError");
      const normalized = isOurDeadline
        ? Object.assign(
            new Error(
              `timeout: LLM request exceeded the ${timeoutMs}ms deadline after ${latencyMs}ms (${err.name}) — retryable`,
            ),
            { code: "ETIMEDOUT", cause: err },
          )
        : error;

      // A_71 (A_70 §5) — count Azure content-filter refusals at the one place every call passes
      // through. The 07-27 run took 10, all on `Agent9-Regen-Ch*-missing_clue` prompts carrying the
      // pipeline's own prose, and the only trace was raw log text. The refusal is NOT retryable
      // (the same prompt earns the same refusal), so this records rather than recovers — a
      // softening policy is a separate increment that should be designed against these counts.
      this.contentFilterTracker.record(normalized, options.logContext?.agent, model);

      // Log error
      if (options.logContext) {
        await this.logger.logError({
          ...options.logContext,
          operation: "chat_error",
          model,
          errorMessage: (normalized as Error).message,
          errorCode: (normalized as any).code,
          timestamp: new Date().toISOString(),
          promptHash: LLMLogger.hashContent(JSON.stringify(options.messages)),
        });
      }

      throw normalized;
    }
  }

  // A_62 RC-6.2: chat() now retries internally, so this must NOT wrap it in withRetry again —
  // nested retry would multiply to 16 worst-case attempts. What remains here is the circuit
  // breaker (agents 1/3/3b keep their fail-fast-after-sustained-outage behavior; the breaker
  // counts whole exhausted-retry failures, so it opens only after ~5 fully-failed calls).
  async chatWithRetry(options: ChatOptions): Promise<ChatResponse> {
    return await this.circuitBreaker.execute(() => this.chat(options));
  }

  getCostTracker(): CostTracker {
    return this.costTracker;
  }

  /** A_71 — per-run tally of Azure content-filter refusals (A_70 §5). */
  getContentFilterTracker(): ContentFilterTracker {
    return this.contentFilterTracker;
  }

  getRateLimiter(): RateLimiter {
    return this.rateLimiter;
  }

  getCircuitBreaker(): CircuitBreaker {
    return this.circuitBreaker;
  }

  getLogger(): LLMLogger {
    return this.logger;
  }
}
