/**
 * Azure OpenAI client wrapper with retry logic and rate limiting
 */

import { OpenAIClient, AzureKeyCredential } from "@azure/openai";
import type { ChatOptions, ChatResponse, Message } from "./types.js";
import { withRetry, CircuitBreaker, defaultRetryConfig } from "./retry.js";
import { RateLimiter } from "./ratelimit.js";
import { CostTracker } from "./cost-tracker.js";
import { LLMLogger } from "./logger.js";

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

export class AzureOpenAIClient {
  private client: OpenAIClient;
  private circuitBreaker: CircuitBreaker;
  private rateLimiter: RateLimiter;
  private costTracker: CostTracker;
  private logger: LLMLogger;
  private defaultModel: string;

  constructor(config: {
    apiKey: string;
    endpoint: string;
    apiVersion?: string;
    defaultModel?: string;
    requestsPerMinute?: number;
    tokensPerMinute?: number;
    logger?: LLMLogger;
  }) {
    this.client = new OpenAIClient(
      config.endpoint,
      new AzureKeyCredential(config.apiKey),
      {
        apiVersion: config.apiVersion || "2024-02-15-preview"
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

    this.costTracker = new CostTracker();

    this.logger = config.logger || new LLMLogger();
  }

  async chat(options: ChatOptions): Promise<ChatResponse> {
    const model = options.model || this.defaultModel;
    const baseTemperature = options.temperature ?? 0.7;
    // Salt repeated retries by escalating temperature (logged value reflects the escalated temp).
    const temperature = escalateRetryTemperature(baseTemperature, options.logContext?.retryAttempt ?? 0);
    const maxTokens = options.maxTokens ?? 4000;

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

    try {
      const response = await this.client.getChatCompletions(
        model,
        options.messages.map((msg) => ({
          role: msg.role as "system" | "user" | "assistant",
          content: msg.content,
        })),
        {
          temperature,
          maxTokens,
          responseFormat: options.jsonMode ? { type: "json_object" as const } : undefined,
        }
      );

      const latencyMs = Date.now() - startTime;

      const usage = {
        promptTokens: response.usage?.promptTokens || 0,
        completionTokens: response.usage?.completionTokens || 0,
        totalTokens: response.usage?.totalTokens || 0,
      };

      const estimatedCost = this.costTracker.trackCost(
        model,
        usage,
        options.logContext?.agent
      );

      const content = response.choices[0]?.message?.content || "";
      const finishReason = response.choices[0]?.finishReason || "stop";

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
          estimatedCost,
          success: true,
          timestamp: new Date().toISOString(),
        });
      }

      return chatResponse;
    } catch (error) {
      const latencyMs = Date.now() - startTime;

      // Log error
      if (options.logContext) {
        await this.logger.logError({
          ...options.logContext,
          operation: "chat_error",
          model,
          errorMessage: (error as Error).message,
          errorCode: (error as any).code,
          timestamp: new Date().toISOString(),
          promptHash: LLMLogger.hashContent(JSON.stringify(options.messages)),
        });
      }

      throw error;
    }
  }

  async chatWithRetry(options: ChatOptions): Promise<ChatResponse> {
    return await this.circuitBreaker.execute(() =>
      withRetry(() => this.chat(options), defaultRetryConfig)
    );
  }

  getCostTracker(): CostTracker {
    return this.costTracker;
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
