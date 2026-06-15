/**
 * Rate limiting for Azure OpenAI requests
 */

import type { RateLimitConfig } from "./types.js";

export class RateLimiter {
  private requestTimestamps: number[] = [];
  private tokenCounts: number[] = [];

  constructor(private config: RateLimitConfig) {}

  async waitForCapacity(tokenCount = 0): Promise<void> {
    const now = Date.now();
    const oneMinuteAgo = now - 60000;

    // Remove timestamps older than 1 minute — build keep mask before mutating either
    // array to avoid index skew between the two parallel arrays.
    const keep = this.requestTimestamps.map((ts) => ts > oneMinuteAgo);
    this.requestTimestamps = this.requestTimestamps.filter((_, i) => keep[i]);
    this.tokenCounts = this.tokenCounts.filter((_, i) => keep[i]);

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

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  getStats(): { requestsInLastMinute: number; tokensInLastMinute: number } {
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

  reset(): void {
    this.requestTimestamps = [];
    this.tokenCounts = [];
  }
}
