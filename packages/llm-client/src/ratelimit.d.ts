/**
 * Rate limiting for Azure OpenAI requests
 */
import type { RateLimitConfig } from "./types.js";
export declare class RateLimiter {
    private config;
    private requestTimestamps;
    private tokenCounts;
    constructor(config: RateLimitConfig);
    waitForCapacity(tokenCount?: number): Promise<void>;
    private sleep;
    getStats(): {
        requestsInLastMinute: number;
        tokensInLastMinute: number;
    };
    reset(): void;
}
