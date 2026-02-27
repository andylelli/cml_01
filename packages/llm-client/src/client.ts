/**
 * Azure OpenAI client wrapper with retry logic and rate limiting
 */

import { OpenAIClient, AzureKeyCredential } from "@azure/openai";
import type { ChatOptions, ChatResponse, Message } from "./types.js";
import { withRetry, CircuitBreaker, defaultRetryConfig } from "./retry.js";
import { RateLimiter } from "./ratelimit.js";
import { CostTracker } from "./cost-tracker.js";
import { LLMLogger } from "./logger.js";

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
    const temperature = options.temperature ?? 0.7;
    const maxTokens = options.maxTokens ?? 4000;

    // Wait for rate limit capacity
    await this.rateLimiter.waitForCapacity();

    const startTime = Date.now();

    // Log request
    if (options.logContext) {
      const promptHash = LLMLogger.hashContent(JSON.stringify(options.messages));
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
