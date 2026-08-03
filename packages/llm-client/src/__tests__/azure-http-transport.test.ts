/**
 * REVIEW_02 §2.1 / §7 — tests that assert THE WIRE, not the object we handed the client.
 *
 * The defect these exist to prevent is not hypothetical: `structured-outputs.test.ts` has twelve
 * green tests over `resolveResponseFormat`, and every one of them passed while the SDK serializer
 * dropped `json_schema` before the request left the process. A pure-function test proves the object
 * is well formed. Only a body assertion proves it was sent.
 */

import { afterEach, describe, expect, it, vi } from "vitest";

import { AzureOpenAIClient } from "../client.js";
import {
  AzureHttpError,
  MIN_JSON_SCHEMA_API_VERSION,
  buildChatWireRequest,
  isHttpTransportEnabled,
  parseChatWireResponse,
  postChatCompletion,
  supportsJsonSchema,
} from "../azure-http-transport.js";

const SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["chapters"],
  properties: { chapters: { type: "array", items: { type: "string" } } },
};

const okResponse = (body: unknown) =>
  ({
    ok: true,
    status: 200,
    json: async () => body,
    text: async () => JSON.stringify(body),
  }) as unknown as Response;

afterEach(() => {
  delete process.env.LLM_HTTP_TRANSPORT;
  vi.restoreAllMocks();
});

describe("buildChatWireRequest — the bytes", () => {
  const base = {
    endpoint: "https://example.openai.azure.com/",
    deployment: "gpt-4.1",
    apiVersion: "2024-10-21",
    messages: [{ role: "user", content: "hello" }],
    temperature: 0.5,
    maxTokens: 100,
  };

  it("carries the json_schema payload VERBATIM — the exact field the SDK dropped", () => {
    const { body } = buildChatWireRequest({
      ...base,
      responseFormat: { type: "json_schema", json_schema: { name: "outline", schema: SCHEMA, strict: true } },
    });

    // Asserted through a JSON round trip: a field that survives object construction but not
    // serialization is precisely the bug being fixed.
    const wire = JSON.parse(JSON.stringify(body));
    expect(wire.response_format).toEqual({
      type: "json_schema",
      json_schema: { name: "outline", schema: SCHEMA, strict: true },
    });
    expect(wire.response_format.json_schema.schema.properties.chapters.items.type).toBe("string");
  });

  it("sends snake_case max_tokens — the REST contract, not the SDK's camelCase view", () => {
    const { body } = buildChatWireRequest(base);
    expect(body).toMatchObject({ max_tokens: 100, temperature: 0.5 });
    expect(body).not.toHaveProperty("maxTokens");
  });

  it("omits response_format entirely when none was requested", () => {
    expect(buildChatWireRequest(base).body).not.toHaveProperty("response_format");
  });

  it("builds the deployment URL with the api-version, tolerating a trailing slash", () => {
    const { url } = buildChatWireRequest(base);
    expect(url).toBe(
      "https://example.openai.azure.com/openai/deployments/gpt-4.1/chat/completions?api-version=2024-10-21",
    );
  });

  it("keeps the api key OUT of the request value — it is added at send time only", () => {
    const serialized = JSON.stringify(buildChatWireRequest(base));
    expect(serialized).not.toMatch(/api-key/i);
  });
});

describe("supportsJsonSchema", () => {
  it("rejects the version this project actually had configured", () => {
    expect(supportsJsonSchema("2024-02-15-preview")).toBe(false);
  });

  it("accepts the floor and anything later, preview or GA", () => {
    expect(supportsJsonSchema(MIN_JSON_SCHEMA_API_VERSION)).toBe(true);
    expect(supportsJsonSchema("2024-10-21")).toBe(true);
    expect(supportsJsonSchema("2026-01-01-preview")).toBe(true);
  });

  it("returns FALSE for unreadable input rather than assuming capability", () => {
    expect(supportsJsonSchema(undefined)).toBe(false);
    expect(supportsJsonSchema("")).toBe(false);
    expect(supportsJsonSchema("latest")).toBe(false);
  });
});

describe("isHttpTransportEnabled", () => {
  it("is OFF by default and reads the env at call time", () => {
    expect(isHttpTransportEnabled({} as NodeJS.ProcessEnv)).toBe(false);
    expect(isHttpTransportEnabled({ LLM_HTTP_TRANSPORT: "true" } as unknown as NodeJS.ProcessEnv)).toBe(true);
    expect(isHttpTransportEnabled({ LLM_HTTP_TRANSPORT: "false" } as unknown as NodeJS.ProcessEnv)).toBe(false);
  });
});

describe("parseChatWireResponse", () => {
  it("reads cached prompt tokens — the metric the SDK cannot report", () => {
    const parsed = parseChatWireResponse({
      choices: [{ message: { content: "text" }, finish_reason: "stop" }],
      usage: {
        prompt_tokens: 22292,
        completion_tokens: 1913,
        total_tokens: 24205,
        prompt_tokens_details: { cached_tokens: 14848 },
      },
    });
    expect(parsed.usage.cachedPromptTokens).toBe(14848);
    expect(parsed.usage.promptTokens).toBe(22292);
    expect(parsed.content).toBe("text");
  });

  it("reports 0 cached tokens when the endpoint omits the details object", () => {
    const parsed = parseChatWireResponse({
      choices: [{ message: { content: "x" }, finish_reason: "length" }],
      usage: { prompt_tokens: 5, completion_tokens: 1, total_tokens: 6 },
    });
    expect(parsed.usage.cachedPromptTokens).toBe(0);
    expect(parsed.finishReason).toBe("length");
  });

  it("survives a junk body without throwing", () => {
    const parsed = parseChatWireResponse({});
    expect(parsed).toEqual({
      content: "",
      finishReason: "stop",
      usage: { promptTokens: 0, completionTokens: 0, totalTokens: 0, cachedPromptTokens: 0 },
    });
  });
});

describe("postChatCompletion", () => {
  it("POSTs the schema and sends the key as a header, never in the URL", async () => {
    const fetchImpl = vi.fn(async () =>
      okResponse({ choices: [{ message: { content: "{}" }, finish_reason: "stop" }], usage: {} }),
    );
    const request = buildChatWireRequest({
      endpoint: "https://example.openai.azure.com",
      deployment: "gpt-4.1",
      apiVersion: "2024-10-21",
      messages: [{ role: "user", content: "hi" }],
      temperature: 0.2,
      maxTokens: 50,
      responseFormat: { type: "json_schema", json_schema: { name: "outline", schema: SCHEMA, strict: true } },
    });

    await postChatCompletion({ request, apiKey: "SECRET-KEY", fetchImpl: fetchImpl as unknown as typeof fetch });

    const [url, init] = fetchImpl.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).not.toContain("SECRET-KEY");
    expect((init.headers as Record<string, string>)["api-key"]).toBe("SECRET-KEY");
    // The assertion that matters: the schema is in the serialized body.
    expect(JSON.parse(init.body as string).response_format.json_schema.schema).toEqual(SCHEMA);
  });

  it("preserves the raw error body so content-filter refusals stay classifiable", async () => {
    const body = '{"error":{"code":"content_filter","innererror":{"code":"ResponsibleAIPolicyViolation"}}}';
    const fetchImpl = vi.fn(
      async () => ({ ok: false, status: 400, text: async () => body }) as unknown as Response,
    );
    const request = buildChatWireRequest({
      endpoint: "https://example.openai.azure.com",
      deployment: "gpt-4.1",
      apiVersion: "2024-10-21",
      messages: [],
      temperature: 0,
      maxTokens: 1,
    });

    await expect(
      postChatCompletion({ request, apiKey: "k", fetchImpl: fetchImpl as unknown as typeof fetch }),
    ).rejects.toThrow(/ResponsibleAIPolicyViolation/);
  });

  it("marks 429 with a retryable code", async () => {
    const err = new AzureHttpError(429, "rate limited", "https://x/y");
    expect((err as unknown as { code?: string }).code).toBe("429");
  });
});

describe("AzureOpenAIClient — refusal instead of a malformed request", () => {
  const client = () =>
    new AzureOpenAIClient({
      apiKey: "k",
      endpoint: "https://example.openai.azure.com",
      apiVersion: "2024-02-15-preview",
      defaultModel: "gpt-4.1",
    });

  it("REFUSES a jsonSchema call on the SDK transport rather than sending a schema-less request", async () => {
    delete process.env.LLM_HTTP_TRANSPORT;
    await expect(
      client().chat({ messages: [{ role: "user", content: "x" }], jsonSchema: { name: "outline", schema: SCHEMA } }),
    ).rejects.toThrow(/LLM_HTTP_TRANSPORT=true/);
  });

  it("REFUSES a jsonSchema call when the api-version predates the feature", async () => {
    process.env.LLM_HTTP_TRANSPORT = "true";
    await expect(
      client().chat({ messages: [{ role: "user", content: "x" }], jsonSchema: { name: "outline", schema: SCHEMA } }),
    ).rejects.toThrow(/2024-08-01-preview or later/);
  });

  it("does NOT refuse an ordinary jsonMode call on either transport", async () => {
    delete process.env.LLM_HTTP_TRANSPORT;
    // Reaches the network layer (and fails there), which is proof the guard let it past.
    await expect(
      client().chat({ messages: [{ role: "user", content: "x" }], jsonMode: true, retryConfig: { maxAttempts: 1, initialDelayMs: 1, maxDelayMs: 1, backoffMultiplier: 1, retryableErrors: [] } }),
    ).rejects.not.toThrow(/LLM_HTTP_TRANSPORT/);
  });
});
