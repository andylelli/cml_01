/**
 * Shared types for LLM client package
 */

export interface Message {
  role: "system" | "user" | "assistant" | "developer";
  content: string;
}

export interface TokenUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  /**
   * REVIEW_02 §2.2 — prompt tokens served from Azure's automatic cache, the metric R8's
   * prefix-ordering probe is defined against.
   *
   * ABSENT means "this transport does not report it" — the `@azure/openai` SDK's `CompletionsUsage`
   * carries three fields and no `prompt_tokens_details`, which is why the probe was unmeasurable.
   * Only the direct-HTTP transport (`LLM_HTTP_TRANSPORT=true`) populates it. Absent is NOT zero:
   * reading it as a cache miss would turn "we cannot see" into "we looked and there was nothing",
   * which is the A_70 measurement class this project keeps paying for.
   */
  cachedPromptTokens?: number;
}

export interface ChatOptions {
  messages: Message[];
  model?: string;
  temperature?: number;
  maxTokens?: number;
  jsonMode?: boolean;
  /**
   * R3 (architecture/REVIEW_01.md) — STRUCTURED OUTPUTS.
   *
   * `jsonMode` guarantees the reply parses as JSON. It does NOT guarantee it matches your shape,
   * which is why this codebase carries ~55 coercion sites and five `jsonrepair` call sites: the
   * recurring defects are shape drift (`relationships` as a bare array vs `{pairs}`, scene fields
   * nested under `setting`, `role_archetype` vs `roleArchetype`), and every one of them failed
   * SILENTLY. Azure OpenAI supports schema-constrained decoding on gpt-4.1: the schema shapes the
   * token distribution during generation rather than being checked afterwards.
   *
   * Mutually exclusive with `jsonMode` — passing both throws, because the two response formats
   * cannot both be sent and silently preferring one would hide a caller bug.
   *
   * Azure's supported schema subset is narrower than full JSON Schema:
   *   - every object needs `additionalProperties: false`
   *   - every property must appear in `required` (use a nullable type for optional fields)
   *   - no recursive `$ref`
   *   - no `minLength`/`maximum`/`pattern`-style constraints
   * A schema outside the subset is rejected by the API at request time, not silently ignored.
   */
  jsonSchema?: {
    /** Schema name sent to the API; also used in error messages. */
    name: string;
    schema: Record<string, unknown>;
    /** Defaults to true — the entire point is the guarantee. */
    strict?: boolean;
  };
  logContext?: LogContext;
  /**
   * A_62 RC-6.2 — override the TRANSPORT retry budget for this call (attempts/delays over network
   * failures inside `chat()`). Defaults to `defaultRetryConfig`. Content-level retries (an agent
   * re-prompting on a bad draft) are the caller's loop and unrelated to this knob.
   */
  retryConfig?: RetryConfig;
}

export interface ChatResponse {
  content: string;
  usage: TokenUsage;
  model: string;
  finishReason: string;
  latencyMs: number;
}

export interface LogContext {
  runId: string;
  projectId: string;
  agent: string;
  retryAttempt?: number;
}

export enum LogLevel {
  DEBUG = "debug",
  INFO = "info",
  WARN = "warn",
  ERROR = "error",
  CRITICAL = "critical",
}

export interface LLMLogEntry {
  // Request tracking
  timestamp: string;
  runId: string;
  projectId: string;
  agent: string;
  operation: string;

  // LLM details
  model: string;
  promptVersion?: string;
  temperature?: number;
  maxTokens?: number;

  // Request/response
  promptHash: string;
  responseHash?: string;
  prompt?: string; // Full prompt for debugging
  response?: string; // Full response for debugging

  // Performance
  latencyMs?: number;
  promptTokens?: number;
  completionTokens?: number;
  totalTokens?: number;
  /** REVIEW_02 §2.2 — absent unless the direct-HTTP transport reported it. Absent is not zero. */
  cachedPromptTokens?: number;
  estimatedCost?: number;

  // Outcome
  success: boolean;
  errorCode?: string;
  errorMessage?: string;
  stackTrace?: string;
  retryAttempt: number;
  validationStatus?: "pass" | "fail";

  // Context
  metadata: Record<string, unknown>;
}

export interface RetryConfig {
  maxAttempts: number;
  initialDelayMs: number;
  maxDelayMs: number;
  backoffMultiplier: number;
  retryableErrors: string[];
}

export interface RateLimitConfig {
  requestsPerMinute: number;
  tokensPerMinute?: number;
}

export interface CostConfig {
  gpt4oPromptCostPer1k: number;
  gpt4oCompletionCostPer1k: number;
  gpt4oMiniPromptCostPer1k: number;
  gpt4oMiniCompletionCostPer1k: number;
  gpt41PromptCostPer1k: number;
  gpt41CompletionCostPer1k: number;
  gpt41MiniPromptCostPer1k: number;
  gpt41MiniCompletionCostPer1k: number;
  gpt35PromptCostPer1k: number;
  gpt35CompletionCostPer1k: number;
  claudeSonnetPromptCostPer1k: number;
  claudeSonnetCompletionCostPer1k: number;
  claudeOpusPromptCostPer1k: number;
  claudeOpusCompletionCostPer1k: number;
  claudeHaikuPromptCostPer1k: number;
  claudeHaikuCompletionCostPer1k: number;
}

/**
 * The minimum surface Agent 9 needs from a provider. Both AzureOpenAIClient and AnthropicClient
 * satisfy it structurally, so a stage can be routed to either without widening any call site's
 * concrete client type.
 */
export interface ChatCapableClient {
  chat(options: ChatOptions): Promise<ChatResponse>;
}
