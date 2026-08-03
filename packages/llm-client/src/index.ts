/**
 * LLM Client Package - Azure OpenAI integration with retry, rate limiting, and logging
 */

export { AzureOpenAIClient, resolveResponseFormat, StructuredOutputError } from "./client.js";
export { AnthropicClient, DEFAULT_ANTHROPIC_MODEL, extractJsonPayload } from "./anthropic-client.js";
export { LLMLogger } from "./logger.js";
export { CostTracker, defaultCostConfig } from "./cost-tracker.js";
export { RateLimiter } from "./ratelimit.js";
export { withRetry, CircuitBreaker, defaultRetryConfig, isRetryableError } from "./retry.js";
export {
  ContentFilterTracker,
  isContentFilterRefusal,
  contentFilterFamily,
} from "./content-filter.js";
export type { ContentFilterRefusal, ContentFilterSummary } from "./content-filter.js";
// REVIEW_02 §2.1 — the wire-capable transport. `supportsJsonSchema` is exported because the worker's
// t=0 flag guard has to answer "can this configuration carry a schema?" without opening a socket.
export {
  DEFAULT_HTTP_API_VERSION,
  MIN_JSON_SCHEMA_API_VERSION,
  AzureHttpError,
  buildChatWireRequest,
  isHttpTransportEnabled,
  parseChatWireResponse,
  postChatCompletion,
  supportsJsonSchema,
} from "./azure-http-transport.js";
export type { ChatWireRequest, ParsedChatWireResponse, WireResponseFormat } from "./azure-http-transport.js";

export type {
  Message,
  TokenUsage,
  ChatOptions,
  ChatResponse,
  ChatCapableClient,
  LogContext,
  LLMLogEntry,
  RetryConfig,
  RateLimitConfig,
  CostConfig,
} from "./types.js";

export { LogLevel } from "./types.js";
