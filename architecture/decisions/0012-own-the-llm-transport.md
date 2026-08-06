# 0012 — Own the HTTP call to the model provider

**Status:** Proposed · **Decided:** 2026-08-02 (REVIEW_02 §4.1) · **Supersedes nothing; scopes [0008](0008-azure-primary-anthropic-polish.md)** · **Ratified as PROPOSED:** 2026-08-06 (owner) — probe owed

> **Ratification note, 2026-08-06.** Deliberately **not** promoted to Accepted, and that is the
> decision rather than a deferral. MEASURED: `LLM_HTTP_TRANSPORT` is unset and this record's own probe
> — *one run per arm on a fixed premise, artifacts equivalent, no new error classes* — has never run.
> Promoting it would be promoting an unprobed lever **by documentation**, which is the act
> [0004](0004-flag-gated-default-off.md) and [0011](0011-measurement-before-promotion.md) forbid,
> performed on the ADR that cites them.
>
> The cheap route to Accepted is a ride-along, not a probe of its own: the transport arm is settled by
> *artifact equivalence*, not prose quality, so it can share a premise with a future run rather than
> buying one. It cannot share a *run* — a transport change and a behaviour lever together is the
> batching [REVIEW_05 §10.8](../REVIEW_05.md) forbids.

## Context

Every LLM call went through `@azure/openai@1.0.0-beta.13`. On 2026-08-02 an audit found that its chat
serializer rebuilds the response-format object field by field:

```js
response_format: !body.responseFormat ? undefined : { type: body.responseFormat?.["type"] }
```

Only `type` survives. The `json_schema` payload that R3/R4 had built — name, schema, `strict` — was
discarded before the request was serialized, so a flag documented as "structured outputs" would have
sent a malformed request and taken a non-retryable 400 at pipeline stage 13, after ~£1.40 of a ~£1.50
run. Twelve unit tests passed throughout, because every one of them asserted the object we built
rather than the bytes we send.

The same SDK version omits `prompt_tokens_details` from its usage type, so cached-prompt-token counts
— the metric R8's prefix-ordering probe is defined against — were unreadable. **One dependency was
silently gating two of the project's open probes.**

Two ways out. Take the official `openai` SDK's `AzureOpenAI` client, or issue the HTTP request
ourselves. The relevant question is not which is more modern; it is **what the vendor package is
actually doing for us**. Auditing that: retry budget, circuit breaker, rate limiting, request
deadline, cost accounting, content-filter tallying and logging all live in `AzureOpenAIClient`,
because each was built here in response to a specific incident. The SDK contributed an auth header,
URL construction, and the serializer — and the serializer is the defect.

## Decision

**Issue the chat-completions request ourselves, behind `LLM_HTTP_TRANSPORT` (runtime-read,
default-OFF), and take no new vendor dependency for it.**

[`azure-http-transport.ts`](../../packages/llm-client/src/azure-http-transport.ts) is one POST.
`buildChatWireRequest` and `parseChatWireResponse` are pure and exported, so **the request body is a
value the test suite can assert on** — which is the property whose absence caused this.

The SDK path remains and stays the default until the transport has a probed run behind it
([0004](0004-flag-gated-default-off.md)).

## Consequences

- **Structured outputs became possible.** Verified against the live endpoint 2026-08-02: `schemaSent:
  PRESENT` in `llm-prompts-full.jsonl`, schema-valid JSON returned.
- **R8's metric became readable.** Same probe: an identical 1,909-token prompt returned `cached: 0`
  then `cached: 1792`. On the SDK path the field is **absent rather than 0**, so "not reported" can
  never be mistaken for "no cache hit".
- **We own HTTP-level failure semantics.** `AzureHttpError` preserves the raw response body, because
  `ContentFilterTracker` classifies refusals by matching text — a sanitized message would silently
  empty a tally that A_71 built. This is a maintenance burden we are choosing.
- **We own api-version compatibility.** `supportsJsonSchema()` is a capability check, and the
  orchestrator refuses at t=0 rather than discovering incompatibility at stage 13.
- **Two transports exist during the probe window.** That is a genuine cost — a bug can now be
  transport-specific — and it is why `transport` is recorded on every logged request.
- **The prompt log gained `response_format`.** The project's own verification rule ("find its effect
  in `llm-prompts-full.jsonl`") had no field to read for this class. Now it does.

## What would change our mind

- **The vendor SDK catching up.** If a maintained Azure SDK carries `response_format` verbatim and
  exposes `prompt_tokens_details`, the argument for owning this collapses — the remaining code is
  auth and URL building. Adopt it and delete the transport.
- **A second provider needing the same treatment.** `AnthropicClient` already exists separately. If a
  third arrives, "each provider gets a hand-rolled POST" stops scaling and a thin abstraction over
  vendor SDKs becomes the better trade.
- **Evidence the direct path is less reliable in production.** The probe is: one run per arm on a
  fixed premise, artifacts equivalent, no new error classes. If the direct path shows retry or TLS
  behaviour the SDK handled better, revert to the SDK and confine the schema payload to a
  special-cased call.

## The rule this encodes

> For anything crossing a process boundary, the test asserts what goes over **the wire**, not the
> object handed to the client.

Stated because the failure here was not a missing test. It was a suite of tests that could not have
caught the defect no matter how many were added, because they all stopped one layer above it.
