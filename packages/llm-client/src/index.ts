/**
 * LLM Client Package - Azure OpenAI integration with retry, rate limiting, and logging
 */

export { AzureOpenAIClient } from "./client.js";
export { LLMLogger } from "./logger.js";
export { CostTracker, defaultCostConfig } from "./cost-tracker.js";
export { RateLimiter } from "./ratelimit.js";
export { withRetry, CircuitBreaker, defaultRetryConfig, isRetryableError } from "./retry.js";

export type {
  Message,
  TokenUsage,
  ChatOptions,
  ChatResponse,
  LogContext,
  LLMLogEntry,
  RetryConfig,
  RateLimitConfig,
  CostConfig,
} from "./types.js";

export { LogLevel } from "./types.js";
