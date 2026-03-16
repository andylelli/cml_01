/**
 * Azure OpenAI client wrapper with retry logic and rate limiting
 */
import { OpenAIClient, AzureKeyCredential } from "@azure/openai";
import { withRetry, CircuitBreaker, defaultRetryConfig } from "./retry.js";
import { RateLimiter } from "./ratelimit.js";
import { CostTracker } from "./cost-tracker.js";
import { LLMLogger } from "./logger.js";
export class AzureOpenAIClient {
    client;
    circuitBreaker;
    rateLimiter;
    costTracker;
    logger;
    defaultModel;
    constructor(config) {
        this.client = new OpenAIClient(config.endpoint, new AzureKeyCredential(config.apiKey), {
            apiVersion: config.apiVersion || "2024-02-15-preview"
        });
        this.defaultModel = config.defaultModel || process.env.AZURE_OPENAI_DEPLOYMENT_NAME;
        this.circuitBreaker = new CircuitBreaker(parseInt(process.env.CIRCUIT_BREAKER_FAILURE_THRESHOLD || "5"), parseInt(process.env.CIRCUIT_BREAKER_RESET_TIMEOUT_MS || "60000"));
        this.rateLimiter = new RateLimiter({
            requestsPerMinute: config.requestsPerMinute || 60,
            tokensPerMinute: config.tokensPerMinute,
        });
        this.costTracker = new CostTracker();
        this.logger = config.logger || new LLMLogger();
    }
    async chat(options) {
        const model = options.model || this.defaultModel;
        const temperature = options.temperature ?? 0.7;
        const maxTokens = options.maxTokens ?? 4000;
        // Wait for rate limit capacity
        await this.rateLimiter.waitForCapacity();
        const startTime = Date.now();
        // Log request
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
            const response = await this.client.getChatCompletions(model, options.messages.map((msg) => ({
                role: msg.role,
                content: msg.content,
            })), {
                temperature,
                maxTokens,
                responseFormat: options.jsonMode ? { type: "json_object" } : undefined,
            });
            const latencyMs = Date.now() - startTime;
            const usage = {
                promptTokens: response.usage?.promptTokens || 0,
                completionTokens: response.usage?.completionTokens || 0,
                totalTokens: response.usage?.totalTokens || 0,
            };
            const estimatedCost = this.costTracker.trackCost(model, usage, options.logContext?.agent);
            const content = response.choices[0]?.message?.content || "";
            const finishReason = response.choices[0]?.finishReason || "stop";
            const chatResponse = {
                content,
                usage,
                model, // Use deployment name since response may not have model property
                finishReason,
                latencyMs,
            };
            // Log response
            if (options.logContext) {
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
        }
        catch (error) {
            const latencyMs = Date.now() - startTime;
            // Log error
            if (options.logContext) {
                await this.logger.logError({
                    ...options.logContext,
                    operation: "chat_error",
                    model,
                    errorMessage: error.message,
                    errorCode: error.code,
                    timestamp: new Date().toISOString(),
                    promptHash: LLMLogger.hashContent(JSON.stringify(options.messages)),
                });
            }
            throw error;
        }
    }
    async chatWithRetry(options) {
        return await this.circuitBreaker.execute(() => withRetry(() => this.chat(options), defaultRetryConfig));
    }
    getCostTracker() {
        return this.costTracker;
    }
    getRateLimiter() {
        return this.rateLimiter;
    }
    getCircuitBreaker() {
        return this.circuitBreaker;
    }
    getLogger() {
        return this.logger;
    }
}
//# sourceMappingURL=client.js.map