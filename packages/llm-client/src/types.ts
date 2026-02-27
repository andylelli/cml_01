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
}

export interface ChatOptions {
  messages: Message[];
  model?: string;
  temperature?: number;
  maxTokens?: number;
  jsonMode?: boolean;
  logContext?: LogContext;
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
  gpt35PromptCostPer1k: number;
  gpt35CompletionCostPer1k: number;
}
