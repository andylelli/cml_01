import { describe, expect, it, vi } from "vitest";
import { AzureOpenAIClient } from "../client.js";

// A_62 RC-6.2 — transport retry must live inside chat(), the choke point every caller shares.
//
// The defect (M1v4 run 3, mystery-1784236058900): 23 pipeline call sites called chat() directly,
// so withRetry/retryableErrors never applied to them. A ~30s DNS outage (getaddrinfo ENOTFOUND)
// hit Agent-9 Ch9, fell straight through to the chapter loop's 3 CONTENT attempts — 18ms apart,
// no transport delays — and aborted the run. These tests reproduce exactly that failure shape
// against the real client with a stubbed SDK transport.

const stubLogger = {
  logFullPrompt: async () => {},
  logRequest: async () => {},
  logResponse: async () => {},
  logError: async () => {},
} as any;

const makeClient = () =>
  new AzureOpenAIClient({
    apiKey: "test-key",
    endpoint: "https://unit-test.invalid",
    defaultModel: "gpt-test",
    logger: stubLogger,
  });

const enotfound = () =>
  Object.assign(new Error("getaddrinfo ENOTFOUND openai-ds1sweden.cognitiveservices.azure.com"), {
    code: "ENOTFOUND",
  });

const okResponse = {
  choices: [{ message: { content: "recovered prose" }, finishReason: "stop" }],
  usage: { promptTokens: 10, completionTokens: 5, totalTokens: 15 },
};

// Fast, real-timer retry budget for tests — semantics identical to defaultRetryConfig.
const FAST = {
  maxAttempts: 4,
  initialDelayMs: 1,
  maxDelayMs: 2,
  backoffMultiplier: 2,
  retryableErrors: ["ENOTFOUND", "timeout", "503"],
};

describe("chat() transport retry — A_62 RC-6.2", () => {
  it("survives the exact run-3 failure: DNS dies twice, third attempt succeeds", async () => {
    const client = makeClient();
    const sdk = vi
      .fn()
      .mockRejectedValueOnce(enotfound())
      .mockRejectedValueOnce(enotfound())
      .mockResolvedValueOnce(okResponse);
    (client as any).client = { getChatCompletions: sdk };

    const res = await client.chat({
      messages: [{ role: "user", content: "ch9" }],
      retryConfig: FAST,
    });

    expect(res.content).toBe("recovered prose");
    expect(sdk).toHaveBeenCalledTimes(3); // two transport failures absorbed INSIDE chat()
  });

  it("direct chat() callers now inherit retry — the 23-call-site class is closed at the choke point", async () => {
    const client = makeClient();
    const sdk = vi.fn().mockRejectedValueOnce(enotfound()).mockResolvedValueOnce(okResponse);
    (client as any).client = { getChatCompletions: sdk };

    // Exactly how generate.ts:2462 / regen-llm.ts:88 call it — plain chat(), no wrapper.
    const res = await client.chat({ messages: [{ role: "user", content: "x" }], retryConfig: FAST });
    expect(res.content).toBe("recovered prose");
    expect(sdk).toHaveBeenCalledTimes(2);
  });

  it("chatWithRetry does NOT nest retries: an always-dead transport costs exactly maxAttempts calls", async () => {
    const client = makeClient();
    const sdk = vi.fn().mockRejectedValue(enotfound());
    (client as any).client = { getChatCompletions: sdk };

    await expect(
      client.chatWithRetry({ messages: [{ role: "user", content: "x" }], retryConfig: FAST }),
    ).rejects.toThrow(/Max retry attempts \(4\) exceeded/);
    // The old shape was withRetry(withRetry(chatOnce)) → up to 16 SDK calls. The breaker must not
    // multiply attempts: exactly 4.
    expect(sdk).toHaveBeenCalledTimes(4);
  });

  it("a NON-retryable error still fails fast — no retry burn on genuine 4xx", async () => {
    const client = makeClient();
    const sdk = vi.fn().mockRejectedValue(new Error("400 invalid request: content filter"));
    (client as any).client = { getChatCompletions: sdk };

    await expect(
      client.chat({ messages: [{ role: "user", content: "x" }], retryConfig: FAST }),
    ).rejects.toThrow(/400 invalid request/);
    expect(sdk).toHaveBeenCalledTimes(1);
  });
});
