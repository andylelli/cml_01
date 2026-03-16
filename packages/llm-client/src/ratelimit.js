/**
 * Rate limiting for Azure OpenAI requests
 */
export class RateLimiter {
    config;
    requestTimestamps = [];
    tokenCounts = [];
    constructor(config) {
        this.config = config;
    }
    async waitForCapacity(tokenCount = 0) {
        const now = Date.now();
        const oneMinuteAgo = now - 60000;
        // Remove timestamps older than 1 minute
        this.requestTimestamps = this.requestTimestamps.filter((ts) => ts > oneMinuteAgo);
        this.tokenCounts = this.tokenCounts.filter((_, i) => this.requestTimestamps[i] !== undefined);
        // Check request rate limit
        if (this.requestTimestamps.length >= this.config.requestsPerMinute) {
            const oldestTimestamp = this.requestTimestamps[0];
            const waitTime = oldestTimestamp + 60000 - now;
            if (waitTime > 0) {
                await this.sleep(waitTime);
                return this.waitForCapacity(tokenCount);
            }
        }
        // Check token rate limit if configured
        if (this.config.tokensPerMinute) {
            const recentTokens = this.tokenCounts.reduce((sum, count) => sum + count, 0);
            if (recentTokens + tokenCount > this.config.tokensPerMinute) {
                const oldestTimestamp = this.requestTimestamps[0];
                const waitTime = oldestTimestamp + 60000 - now;
                if (waitTime > 0) {
                    await this.sleep(waitTime);
                    return this.waitForCapacity(tokenCount);
                }
            }
        }
        // Record this request
        this.requestTimestamps.push(now);
        this.tokenCounts.push(tokenCount);
    }
    sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
    getStats() {
        const now = Date.now();
        const oneMinuteAgo = now - 60000;
        const recentTimestamps = this.requestTimestamps.filter((ts) => ts > oneMinuteAgo);
        const recentTokens = this.tokenCounts
            .filter((_, i) => this.requestTimestamps[i] > oneMinuteAgo)
            .reduce((sum, count) => sum + count, 0);
        return {
            requestsInLastMinute: recentTimestamps.length,
            tokensInLastMinute: recentTokens,
        };
    }
    reset() {
        this.requestTimestamps = [];
        this.tokenCounts = [];
    }
}
//# sourceMappingURL=ratelimit.js.map