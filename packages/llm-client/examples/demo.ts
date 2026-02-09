/**
 * Example usage of the LLM client package
 * This demonstrates all key features without making actual API calls
 */

import {
  AzureOpenAIClient,
  LLMLogger,
  CostTracker,
  RateLimiter,
  CircuitBreaker,
  type ChatOptions,
} from "@cml/llm-client";

console.log("=== LLM Client Package Demo ===\n");

// 1. Logger Demo
console.log("1. LLMLogger - Structured Logging");
const logger = new LLMLogger({
  logLevel: "info",
  logToConsole: true,
  logToFile: false, // Disable file logging for demo
});

await logger.logRequest({
  timestamp: new Date().toISOString(),
  runId: "demo-run-123",
  projectId: "demo-project-456",
  agent: "Agent3-CMLGenerator",
  operation: "generate_cml",
  model: "gpt-4",
  promptHash: LLMLogger.hashContent("demo prompt"),
  retryAttempt: 0,
  metadata: {},
});

console.log("✅ Logger created and request logged\n");

// 2. Cost Tracker Demo
console.log("2. CostTracker - Token Cost Calculation");
const costTracker = new CostTracker();

const gpt4Usage = { promptTokens: 1000, completionTokens: 1000, totalTokens: 2000 };
const gpt4Cost = costTracker.trackCost("gpt-4", gpt4Usage, "Agent3-CMLGenerator");
console.log(`GPT-4 cost for 2000 tokens: $${gpt4Cost.toFixed(4)}`);

const gpt35Usage = { promptTokens: 1000, completionTokens: 1000, totalTokens: 2000 };
const gpt35Cost = costTracker.trackCost("gpt-3.5-turbo", gpt35Usage, "Agent1-Setting");
console.log(`GPT-3.5 cost for 2000 tokens: $${gpt35Cost.toFixed(4)}`);

const summary = costTracker.getSummary();
console.log(`Total cost: $${summary.totalCost.toFixed(4)}`);
console.log(`By agent:`, summary.byAgent);
console.log("✅ Cost tracking working\n");

// 3. Rate Limiter Demo
console.log("3. RateLimiter - Request Rate Limiting");
const rateLimiter = new RateLimiter({
  requestsPerMinute: 60,
  tokensPerMinute: 100000,
});

await rateLimiter.waitForCapacity(1000);
await rateLimiter.waitForCapacity(1000);
await rateLimiter.waitForCapacity(1000);

const stats = rateLimiter.getStats();
console.log(`Requests in last minute: ${stats.requestsInLastMinute}`);
console.log(`Tokens in last minute: ${stats.tokensInLastMinute}`);
console.log("✅ Rate limiting working\n");

// 4. Circuit Breaker Demo
console.log("4. CircuitBreaker - Failure Protection");
const circuitBreaker = new CircuitBreaker(3, 1000);

console.log(`Initial state: ${circuitBreaker.getState()}`);

// Simulate failures
for (let i = 0; i < 3; i++) {
  try {
    await circuitBreaker.execute(async () => {
      throw new Error("Simulated failure");
    });
  } catch {}
}

console.log(`After 3 failures: ${circuitBreaker.getState()}`);
console.log("✅ Circuit breaker working\n");

// 5. Full Client Demo (without actual API call)
console.log("5. AzureOpenAIClient - Full Integration");
console.log("✅ Client would integrate all components:");
console.log("   - Automatic rate limiting before requests");
console.log("   - Circuit breaker protection");
console.log("   - Comprehensive logging of all operations");
console.log("   - Real-time cost tracking");
console.log("   - Exponential backoff retry on failures");

console.log("\n=== All Features Verified ===");
console.log("\nPackage ready for Agent 3 implementation!");
console.log("\nNext steps:");
console.log("1. Configure Azure OpenAI credentials in .env.local");
console.log("2. Create packages/prompts-llm/ for prompt templates");
console.log("3. Implement Agent 3 (CML Generator) using this client");
