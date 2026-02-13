# @cml/llm-client

Azure OpenAI client library with retry logic, rate limiting, comprehensive logging, and cost tracking for the CML mystery generation system.

## Features

- **Azure OpenAI Integration**: Wrapper around @azure/openai with production-ready error handling
- **Retry Logic**: Exponential backoff with configurable retry policies
- **Circuit Breaker**: Prevents cascading failures with automatic recovery
- **Rate Limiting**: Token and request-based rate limiting
- **Cost Tracking**: Real-time token usage and cost calculation by model and agent
- **Comprehensive Logging**: Structured logging with JSONL file output and console support
- **TypeScript**: Full type safety with exported interfaces

## Installation

```bash
npm install @cml/llm-client
```

## Configuration

Create a `.env.local` file (see `.env.local.example`):

```bash
AZURE_OPENAI_API_KEY=your_api_key_here
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
AZURE_OPENAI_API_VERSION=2024-02-15-preview
AZURE_OPENAI_DEPLOYMENT_GPT4=gpt-4
AZURE_OPENAI_DEPLOYMENT_GPT35=gpt-35-turbo

LOG_LEVEL=info
LOG_TO_FILE=true
LOG_FILE_PATH=./logs/llm.jsonl
LOG_TO_CONSOLE=true

LLM_TIMEOUT_MS=30000
LLM_MAX_RETRIES=3
LLM_RATE_LIMIT_PER_MINUTE=60
```

## Usage

### Basic Chat Request

```typescript
import { AzureOpenAIClient } from "@cml/llm-client";

const client = new AzureOpenAIClient({
  apiKey: process.env.AZURE_OPENAI_API_KEY!,
  endpoint: process.env.AZURE_OPENAI_ENDPOINT!,
  defaultModel: "gpt-4",
  requestsPerMinute: 60,
});

const response = await client.chat({
  messages: [
    { role: "system", content: "You are a helpful assistant." },
    { role: "user", content: "What is the capital of France?" },
  ],
  temperature: 0.7,
  maxTokens: 100,
});

console.log(response.content); // "The capital of France is Paris."
console.log(response.usage); // { promptTokens: 20, completionTokens: 8, totalTokens: 28 }
```

### With Retry Logic

```typescript
const response = await client.chatWithRetry({
  messages: [
    { role: "user", content: "Generate a mystery plot." },
  ],
  model: "gpt-4",
  logContext: {
    runId: "run-123",
    projectId: "proj-456",
    agent: "Agent3-CMLGenerator",
  },
});
```

### Cost Tracking

```typescript
const costTracker = client.getCostTracker();

// After some requests
const summary = costTracker.getSummary();
console.log(`Total cost: $${summary.totalCost.toFixed(4)}`);
console.log(`Cost by model:`, summary.byModel);
console.log(`Cost by agent:`, summary.byAgent);
```

### Rate Limiting

```typescript
const rateLimiter = client.getRateLimiter();

// Check current rate limit status
const stats = rateLimiter.getStats();
console.log(`Requests in last minute: ${stats.requestsInLastMinute}`);
console.log(`Tokens in last minute: ${stats.tokensInLastMinute}`);
```

### Circuit Breaker

```typescript
const circuitBreaker = client.getCircuitBreaker();

// Check circuit breaker state
console.log(`Circuit breaker state: ${circuitBreaker.getState()}`);
// States: "closed" (normal), "open" (too many failures), "half-open" (testing recovery)
```

### Custom Logging

```typescript
import { LLMLogger } from "@cml/llm-client";

const logger = new LLMLogger({
  logLevel: "debug",
  logToConsole: true,
  logToFile: true,
  logFilePath: "./logs/custom.jsonl",
});

const client = new AzureOpenAIClient({
  apiKey: process.env.AZURE_OPENAI_API_KEY!,
  endpoint: process.env.AZURE_OPENAI_ENDPOINT!,
  logger,
});
```

## API Reference

### AzureOpenAIClient

#### Constructor Options

```typescript
{
  apiKey: string;              // Azure OpenAI API key
  endpoint: string;            // Azure OpenAI endpoint URL
  apiVersion?: string;         // API version (default: "2024-02-15-preview")
  defaultModel?: string;       // Default model (default: "gpt-4")
  requestsPerMinute?: number;  // Rate limit (default: 60)
  tokensPerMinute?: number;    // Token rate limit (optional)
  logger?: LLMLogger;          // Custom logger instance
}
```

#### Methods

- `chat(options: ChatOptions): Promise<ChatResponse>` - Single chat request
- `chatWithRetry(options: ChatOptions): Promise<ChatResponse>` - Chat with automatic retry
- `getCostTracker(): CostTracker` - Get cost tracking instance
- `getRateLimiter(): RateLimiter` - Get rate limiter instance
- `getCircuitBreaker(): CircuitBreaker` - Get circuit breaker instance
- `getLogger(): LLMLogger` - Get logger instance

### Types

#### ChatOptions

```typescript
{
  messages: Message[];       // Conversation messages
  model?: string;           // Model override
  temperature?: number;     // 0.0-2.0 (default: 0.7)
  maxTokens?: number;       // Max completion tokens (default: 4000)
  jsonMode?: boolean;       // Force JSON output (default: false)
  logContext?: LogContext;  // Logging context
}
```

#### ChatResponse

```typescript
{
  content: string;         // Response text
  usage: TokenUsage;       // Token counts
  model: string;           // Model used
  finishReason: string;    // "stop", "length", etc.
  latencyMs: number;       // Request duration
}
```

#### LLMLogEntry

Complete log structure with 20+ fields including request tracking, performance metrics, token usage, costs, errors, and validation status. All logs are written as JSONL for easy parsing.

## Testing

```bash
npm test          # Run tests once
npm run test:watch # Run tests in watch mode
```

## Architecture

- **client.ts**: Main Azure OpenAI client wrapper
- **retry.ts**: Retry logic and circuit breaker pattern
- **ratelimit.ts**: Request and token rate limiting
- **cost-tracker.ts**: Token cost calculation and tracking
- **logger.ts**: Structured logging infrastructure
- **types.ts**: Shared TypeScript interfaces

## Error Handling

The client automatically retries on:
- Rate limit exceeded (429)
- Service unavailable (503)
- Timeout errors
- Connection errors

Non-retryable errors (e.g., invalid API key, malformed request) fail immediately.

Circuit breaker opens after 5 consecutive failures and resets after 60 seconds.

## Cost Optimization

Costs are calculated in GBP based on the default config in `cost-tracker.ts`:
- **GPT-4**: £0.0237/1K prompt tokens, £0.0474/1K completion tokens
- **GPT-4o-mini (default)**: £0.00013035/1K prompt tokens, £0.00052140/1K completion tokens
- **GPT-3.5-turbo**: £0.000395/1K prompt tokens, £0.001185/1K completion tokens

Track costs by agent to optimize prompt design and model selection.

## License

MIT
