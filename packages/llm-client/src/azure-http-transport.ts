/**
 * REVIEW_02 §2.1 / §4.1 — the transport that reaches the wire.
 *
 * WHY THIS EXISTS. `@azure/openai@1.0.0-beta.13` is a 2024-era package. Its chat serializer
 * (`dist-esm/src/api/operations.js:136`) rebuilds the response-format object from scratch:
 *
 *     response_format: !body.responseFormat ? undefined : { type: body.responseFormat?.["type"] }
 *
 * Only `type` survives. R3/R4 shipped a `json_schema` payload — name, schema, strict — that the SDK
 * discarded before serialization, so `AGENT7_STRUCTURED_OUTPUT=true` would have sent a MALFORMED
 * request (`{"type":"json_schema"}` with no schema) and taken a non-retryable 400 at pipeline stage
 * 13, after the full upstream spend. Twelve unit tests passed because every one of them asserted the
 * OBJECT WE BUILT, never the bytes we send. The same SDK gap hides `prompt_tokens_details`, which is
 * the metric R8's prefix-ordering probe is defined against — so that probe was unmeasurable too.
 *
 * WHAT THIS IS. A direct POST to the deployment's chat/completions endpoint. Deliberately NOT a new
 * vendor dependency: every durability concern this project cares about — retry budget, circuit
 * breaker, rate limiting, request deadline, cost accounting, content-filter tallying — already lives
 * in `AzureOpenAIClient`, not in the SDK. The SDK contributed an auth header and a serializer, and
 * the serializer is the defect. What is left is small enough to own, and owning it means the request
 * body is a value this project can assert on.
 *
 * THE RULE IT ENCODES (REVIEW_02 §7): for anything crossing a process boundary, the test asserts
 * what goes over the wire, not the object handed to the client. `buildChatWireRequest` and
 * `parseChatWireResponse` are pure and exported for exactly that reason.
 */

/**
 * Structured outputs (`response_format: {type: "json_schema"}`) reached Azure OpenAI in
 * `2024-08-01-preview`. An older api-version rejects the request — a second, independent blocker
 * from the SDK one, and the reason `.env.local`'s `2024-02-15-preview` could never have worked.
 */
export const MIN_JSON_SCHEMA_API_VERSION = "2024-08-01-preview";

/** Sent when no `AZURE_OPENAI_API_VERSION` is configured. GA, and new enough for json_schema. */
export const DEFAULT_HTTP_API_VERSION = "2024-10-21";

/**
 * Azure api-versions sort as dates: `YYYY-MM-DD` optionally followed by `-preview`. Compare the date
 * only — `2024-08-01-preview` and `2024-08-01` both carry the feature, and a preview suffix has
 * never meant "older".
 */
const apiVersionDate = (apiVersion: string): string | undefined => {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(apiVersion.trim());
  return match ? `${match[1]}-${match[2]}-${match[3]}` : undefined;
};

/**
 * Can this api-version carry a `json_schema` response format?
 *
 * Unparseable input returns FALSE. A capability check that cannot read the version must not claim
 * the capability — guessing "probably fine" here is what produces a 400 at stage 13.
 */
export const supportsJsonSchema = (apiVersion: string | undefined): boolean => {
  if (!apiVersion) return false;
  const date = apiVersionDate(apiVersion);
  const floor = apiVersionDate(MIN_JSON_SCHEMA_API_VERSION);
  return date !== undefined && floor !== undefined && date >= floor;
};

/**
 * Runtime getter, never a module const (`module-const-flags-frozen-before-dotenv`: a const is frozen
 * before dotenv loads, so the flag silently never fires).
 *
 * Default OFF. Swapping transports changes error shapes and header handling for every LLM call in
 * the pipeline, which is a behaviour change under the corpus regime — probed, not assumed.
 */
export const isHttpTransportEnabled = (env: NodeJS.ProcessEnv = process.env): boolean =>
  env.LLM_HTTP_TRANSPORT === "true" || env.LLM_HTTP_TRANSPORT === "1";

export type WireResponseFormat =
  | { type: "json_object" }
  | { type: "json_schema"; json_schema: { name: string; schema: Record<string, unknown>; strict: boolean } };

export interface WireChatMessage {
  role: string;
  content: string;
}

export interface ChatWireRequest {
  url: string;
  body: Record<string, unknown>;
}

/**
 * Build the exact URL and JSON body that will be POSTed. Pure — no key, no fetch, no clock — so a
 * test can assert the bytes rather than the intent.
 *
 * The API key is deliberately NOT part of this value: it is added by `postChatCompletion` at send
 * time, so no test fixture, snapshot or debug dump of a request can carry a credential.
 */
export const buildChatWireRequest = (args: {
  endpoint: string;
  deployment: string;
  apiVersion: string;
  messages: ReadonlyArray<WireChatMessage>;
  temperature: number;
  maxTokens: number;
  responseFormat?: WireResponseFormat;
}): ChatWireRequest => {
  const base = args.endpoint.replace(/\/+$/, "");
  const url =
    `${base}/openai/deployments/${encodeURIComponent(args.deployment)}/chat/completions` +
    `?api-version=${encodeURIComponent(args.apiVersion)}`;

  const body: Record<string, unknown> = {
    messages: args.messages.map((m) => ({ role: m.role, content: m.content })),
    temperature: args.temperature,
    max_tokens: args.maxTokens,
  };
  // Spread verbatim. The whole defect being fixed here was a serializer that rebuilt this object
  // field by field and dropped the one that mattered.
  if (args.responseFormat) body.response_format = args.responseFormat;

  return { url, body };
};

export interface WireUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  /**
   * R8's metric. Azure reports automatic prompt-cache hits under
   * `usage.prompt_tokens_details.cached_tokens`; the beta SDK's `CompletionsUsage` has three fields
   * and no details object, which is why "cached tokens rising from ch2" was unobservable.
   */
  cachedPromptTokens: number;
}

export interface ParsedChatWireResponse {
  content: string;
  finishReason: string;
  /**
   * Whether the wire actually CARRIED a finish_reason, as opposed to this parser defaulting it.
   *
   * FOUND 2026-09-11 on run `mystery-1789105355374`. `finishReason` below defaults an absent value to
   * `"stop"`, which is correct for keeping downstream branches unchanged and wrong for anything that
   * needs to know the difference. Agent 7's truncation guard (`agent7-narrative.ts`, "jsonrepair can
   * reconstruct truncated JSON but leaves required fields null/absent … aborting the pipeline with a
   * misleading error") fires on `finishReason === "length"` — so a default of `"stop"` disables it
   * silently, and the run aborts claiming a schema failure.
   *
   * MEASURED on that run: both Agent 7 responses were cut mid-string with four unclosed braces each
   * (26,650 and 21,400 chars, 61/57 and 47/43 braces), and the guard did not fire.
   *
   * This is the same rule the `cachedPromptTokens` field in this file already states: an absent value
   * must never be written as a present one. The default stays for compatibility; this flag carries
   * the fact, so a caller can tell "the model stopped" from "nobody said why".
   */
  finishReasonPresent: boolean;
  usage: WireUsage;
  /** A_86 item 9 — quota state on a SUCCESSFUL response; absent when the deployment emits no headers. */
  rateLimit?: RateLimitSnapshot;
}

const num = (value: unknown): number => (typeof value === "number" && Number.isFinite(value) ? value : 0);

/**
 * Parse the raw JSON body. Snake_case throughout — this is the REST contract, not the SDK's
 * camelCased view of it, and confusing the two is how `.pairs` and `phases[].name` happened.
 */
export const parseChatWireResponse = (raw: unknown): ParsedChatWireResponse => {
  const root = (raw ?? {}) as Record<string, unknown>;
  const choices = Array.isArray(root.choices) ? (root.choices as Array<Record<string, unknown>>) : [];
  const choice = choices[0] ?? {};
  const message = (choice.message ?? {}) as Record<string, unknown>;
  const usage = (root.usage ?? {}) as Record<string, unknown>;
  const details = (usage.prompt_tokens_details ?? {}) as Record<string, unknown>;

  return {
    content: typeof message.content === "string" ? message.content : "",
    // `stop` matches the SDK path's default, so downstream finish-reason branches are unchanged.
    finishReason: typeof choice.finish_reason === "string" && choice.finish_reason ? choice.finish_reason : "stop",
    finishReasonPresent: typeof choice.finish_reason === "string" && choice.finish_reason.length > 0,
    usage: {
      promptTokens: num(usage.prompt_tokens),
      completionTokens: num(usage.completion_tokens),
      totalTokens: num(usage.total_tokens),
      cachedPromptTokens: num(details.cached_tokens),
    },
  };
};

/** Raised for a non-2xx reply. The body text is preserved — see the note in `postChatCompletion`. */
/**
 * A_86 item 2 — `Retry-After`, in ms, from a 429 response. Both wire forms are accepted: a
 * delta-seconds integer and an HTTP-date. Anything unparseable or negative yields null and the
 * caller falls back to its own backoff — a malformed header must never stall a run.
 */
export const parseRetryAfterMs = (headerValue: string | null | undefined, now = Date.now()): number | null => {
  const raw = String(headerValue ?? "").trim();
  if (!raw) return null;
  if (/^\d+$/.test(raw)) {
    const seconds = Number(raw);
    return Number.isFinite(seconds) && seconds >= 0 ? seconds * 1000 : null;
  }
  const at = Date.parse(raw);
  if (!Number.isFinite(at)) return null;
  // A sanity window, because `Date.parse` accepts far more than an HTTP-date: "-5" parses as a
  // year and clamped to 0, i.e. "retry immediately", which is the opposite of what a Retry-After
  // asks for. Anything outside "just now" to "24h from now" is treated as malformed. (Caught by
  // the accompanying test, not by reading.)
  const deltaMs = at - now;
  if (deltaMs < -60_000 || deltaMs > 24 * 60 * 60 * 1000) return null;
  return Math.max(0, deltaMs);
};

/**
 * A_86 items 9 & 82 — the deployment's own quota state, read off the response headers.
 *
 * WHY IT IS TELEMETRY AND NOT YET A LEVER. A_86 item 8 proposed a per-deployment rate limiter, on
 * the reasoning that a prose 429 should not stall regen calls. That is only safe if the deployments
 * hold SEPARATE quotas — if they share one, splitting the limiter doubles the request rate and buys
 * MORE 429s, which is the opposite of the intent. Nothing in this repo records which it is, so item
 * 8 is deferred behind this measurement rather than guessed at. These headers answer it for free:
 * they ride on responses the run already pays for.
 *
 * Azure emits `x-ratelimit-remaining-requests` / `-tokens` on success and, on a 429, `retry-after`.
 * Every field is optional — a deployment that emits none yields an empty object, never a zero, so an
 * absent header can never be read as "quota exhausted" (the A_70/A_71 rule).
 */
export interface RateLimitSnapshot {
  remainingRequests?: number;
  remainingTokens?: number;
  limitRequests?: number;
  limitTokens?: number;
}

const numericHeader = (headers: Headers | undefined, name: string): number | undefined => {
  if (!headers || typeof headers.get !== "function") return undefined;
  const raw = headers.get(name);
  if (raw === null || raw === undefined || String(raw).trim() === "") return undefined;
  const value = Number(String(raw).trim());
  return Number.isFinite(value) ? value : undefined;
};

export const readRateLimitSnapshot = (headers: Headers | undefined): RateLimitSnapshot => {
  const snapshot: RateLimitSnapshot = {};
  const remainingRequests = numericHeader(headers, "x-ratelimit-remaining-requests");
  const remainingTokens = numericHeader(headers, "x-ratelimit-remaining-tokens");
  const limitRequests = numericHeader(headers, "x-ratelimit-limit-requests");
  const limitTokens = numericHeader(headers, "x-ratelimit-limit-tokens");
  if (remainingRequests !== undefined) snapshot.remainingRequests = remainingRequests;
  if (remainingTokens !== undefined) snapshot.remainingTokens = remainingTokens;
  if (limitRequests !== undefined) snapshot.limitRequests = limitRequests;
  if (limitTokens !== undefined) snapshot.limitTokens = limitTokens;
  return snapshot;
};

export class AzureHttpError extends Error {
  /** A_86 item 2 — server-supplied wait, in ms, when the response carried `Retry-After`. */
  readonly retryAfterMs?: number;
  /** A_86 item 82 — the deployment's quota state at the moment it refused. */
  readonly rateLimit?: RateLimitSnapshot;

  constructor(
    readonly status: number,
    readonly bodyText: string,
    url: string,
    retryAfterMs?: number,
    rateLimit?: RateLimitSnapshot,
  ) {
    // The RAW body is part of the message on purpose: ContentFilterTracker classifies refusals by
    // matching `ResponsibleAIPolicyViolation` / `content_filter ... prompt` against error text, and
    // a sanitized message would silently empty that tally (A_71 §5). The URL carries no secret —
    // the key travels in a header, never the query string.
    super(`Azure chat completion failed: HTTP ${status} at ${url} — ${bodyText.slice(0, 2000)}`);
    this.name = "AzureHttpError";
    if (typeof retryAfterMs === "number" && Number.isFinite(retryAfterMs) && retryAfterMs >= 0) {
      this.retryAfterMs = retryAfterMs;
    }
    if (rateLimit && Object.keys(rateLimit).length > 0) this.rateLimit = rateLimit;
    // 429 and 5xx must stay retryable through `isRetryableError`, which substring-matches messages.
    (this as unknown as { code?: string }).code = status === 429 ? "429" : `HTTP_${status}`;
  }
}

/**
 * POST one chat completion. Timeout, retry, rate limiting and cost accounting are the CALLER's —
 * this function does exactly one network round trip.
 */
export const postChatCompletion = async (args: {
  request: ChatWireRequest;
  apiKey: string;
  signal?: AbortSignal;
  fetchImpl?: typeof fetch;
}): Promise<ParsedChatWireResponse> => {
  const doFetch = args.fetchImpl ?? fetch;
  const response = await doFetch(args.request.url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "api-key": args.apiKey,
    },
    body: JSON.stringify(args.request.body),
    ...(args.signal ? { signal: args.signal } : {}),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    // A_86 item 2 — carry the server's own wait through to withRetry.
    const retryAfterMs =
      parseRetryAfterMs(
        typeof response.headers?.get === "function" ? response.headers.get("retry-after") : null,
      ) ?? undefined;
    const rateLimit = readRateLimitSnapshot(response.headers);
    if (response.status === 429) {
      // A_86 item 82 — say which deployment refused, what it still had, and how long it asked for.
      // This is the record that decides whether item 8 (a per-deployment limiter) is safe to build.
      console.warn(
        `[llm-client][A_86 item 82] 429 from ${args.request.url.split("/deployments/")[1]?.split("/")[0] ?? "?"} — ` +
          `retry-after ${retryAfterMs === undefined ? "(absent)" : `${Math.round(retryAfterMs / 1000)}s`}, ` +
          `quota ${Object.keys(rateLimit).length === 0 ? "(no headers)" : JSON.stringify(rateLimit)}.`,
      );
    }
    throw new AzureHttpError(response.status, text, args.request.url, retryAfterMs, rateLimit);
  }

  const parsed = parseChatWireResponse(await response.json());
  // A_86 item 9 — carry the quota snapshot up with the response it rode in on.
  const successRateLimit = readRateLimitSnapshot(response.headers);
  return Object.keys(successRateLimit).length > 0 ? { ...parsed, rateLimit: successRateLimit } : parsed;
};
