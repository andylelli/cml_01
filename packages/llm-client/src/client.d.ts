/**
 * Azure OpenAI client wrapper with retry logic and rate limiting
 */
import type { ChatOptions, ChatResponse } from "./types.js";
import { CircuitBreaker } from "./retry.js";
import { RateLimiter } from "./ratelimit.js";
import { CostTracker } from "./cost-tracker.js";
import { LLMLogger } from "./logger.js";
export declare class AzureOpenAIClient {
    private client;
    private circuitBreaker;
    private rateLimiter;
    private costTracker;
    private logger;
    private defaultModel;
    constructor(config: {
        apiKey: string;
        endpoint: string;
        apiVersion?: string;
        defaultModel?: string;
        requestsPerMinute?: number;
        tokensPerMinute?: number;
        logger?: LLMLogger;
    });
    chat(options: ChatOptions): Promise<ChatResponse>;
    chatWithRetry(options: ChatOptions): Promise<ChatResponse>;
    getCostTracker(): CostTracker;
    getRateLimiter(): RateLimiter;
    getCircuitBreaker(): CircuitBreaker;
    getLogger(): LLMLogger;
}
