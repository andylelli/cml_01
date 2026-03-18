# ANALYSIS_10: Agent 2b `paragraphs` Missing on Last Profile; Agent 2c DNS Failure

## Overview

Two distinct errors observed in the same run, one at each of the first two "2-series" expansion agents:

| # | Error | Agent | Outcome |
|---|-------|-------|---------|
| A | `profiles[4].paragraphs is required` (both attempts) | Agent 2b — Character Profiles | Soft fail; pipeline continues with incomplete data |
| B | `getaddrinfo ENOTFOUND openai-ds1sweden.openai.azure.com` | Agent 2c — Location Profiles | Hard fail; no location data produced |

---

## Error A — `profiles[4].paragraphs is required`

### What the error means

`profiles[4]` is zero-indexed. In a 5-character cast, this means the **fifth and final character** in the `profiles` array is missing its `paragraphs` field entirely. The error originates in `validateArtifact("character_profiles", ...)`, which checks against `schema/character_profiles.schema.yaml`. That schema declares `paragraphs` as `required: true` on every profile item:

```yaml
# schema/character_profiles.schema.yaml
paragraphs:
  type: array
  required: true
  items: string
```

The model knows the field is required — the developer block in `buildProfilesPrompt` shows it explicitly in the JSON example:

```json
"paragraphs": ["Paragraph 1", "Paragraph 2", "Paragraph 3", "Paragraph 4"]
```

### Why the model omits it

The model is asked to generate five full character profiles, each targeting approximately 1,000 words and 4–6 paragraphs. Total expected output is 5,000+ words of dense, structured JSON. This is close to the practical generation ceiling for most model configurations. The most probable cause:

1. **Token budget exhaustion on the last profile.** The model works through profiles 0–3 successfully, consuming the majority of its token budget. By the time it reaches profile 4, the remaining budget is too small to emit the `paragraphs` array. The JSON is either truncated before `paragraphs` is written, or the model omits it intentionally to close the JSON object within the remaining tokens.

2. **Anchor effect.** The five profiles are generated in a single call in declared order. The model allocates roughly equal draft length to each, but the system-plus-developer blocks consume non-trivial context up front, compressing available generation space. The last profile is most exposed to this compression.

### Why the retry also fails

`withValidationRetry` passes the error list to `buildProfilesPrompt` on attempt 2 via `buildValidationFeedback(previousErrors)`, which injects:

```
IMPORTANT: Your previous response had validation errors. Please fix these issues:
1. profiles[4].paragraphs is required

Ensure all fields match the required schema exactly.
```

This feedback has two structural weaknesses:

**It uses an index, not a name.** `profiles[4]` is an internal JSON path. The model does not know which cast member is at index 4 unless it tracks the order in which it writes them. When the model regenerates all five profiles from scratch (which it does — there is no partial re-generation), it may not associate `profiles[4]` with any specific character.

**Regeneration hits the same constraint.** On retry the model starts from scratch. The same token budget, the same five-profile task, the same generation ceiling. Without a structural change (e.g., generating profiles in separate calls, or explicitly forcing the token allocation for the last profile), the model will encounter the same terminal-compression problem on its second pass and emit incomplete output for the fifth profile again.

### What happens after two failures

`generateCharacterProfiles` in `agent2b-character-profiles.ts` completes the `withValidationRetry` loop and then checks:

```typescript
if (!retryResult.validationResult.valid) {
  console.error(
    `[Agent 2b] Character profiles failed validation after ${resolvedMaxAttempts} attempts:\n` +
    retryResult.validationResult.errors.map(e => `- ${e}`).join("\n")
  );
}
// ... returns the invalid result regardless
return {
  ...validatedResult,
  cost: retryResult.totalCost,
  durationMs,
};
```

This is a **soft fail**. The function returns the invalid artifact. The orchestrator receives an incomplete `CharacterProfilesResult` where `profiles[4].paragraphs` is `undefined` or absent. The pipeline continues with Agent 2c.

### Downstream impact

- The fifth character's narrative paragraphs are absent from every downstream context that injects character profiles into the prose agent.
- The scoring adapter for Agent 2b (`agent2b-character-profiles-scorer.ts`) will compute metrics on 5 profiles but profile 4 will score zero on any paragraph-based dimension (word count, depth, humour richness).
- When Agent 9 constructs its prompt, if it reads `profiles[4].paragraphs`, it receives `undefined`. Prose generation for scenes involving the fifth character relies on reduced context.

---

## Error B — `getaddrinfo ENOTFOUND openai-ds1sweden.openai.azure.com`

### What the error means

This is a Node.js DNS resolution failure. The system call `getaddrinfo` could not resolve the hostname `openai-ds1sweden.openai.azure.com` to any IP address. `openai-ds1sweden` is the resource name for an Azure OpenAI deployment in the Sweden Central region. No network connection to Azure was made — the failure occurs before any HTTP request is sent.

See [ANALYSIS_08](./ANALYSIS_08_azure_endpoint_dns_failure.md) for the general technical analysis of `ENOTFOUND` in Azure OpenAI calls. This analysis focuses on what is specific to Agent 2c failing here, mid-run, while Agent 2b succeeded earlier in the same run.

### The 38-minute gap

Agent 2b completed at **21:42**. Agent 2c failed at **22:20** — a 38-minute gap in the same run. This is significant:

1. **If Agent 2b and Agent 2c use the same configured endpoint**, then the endpoint was reachable at 21:42 but unreachable at 22:20. This points to either a transient Azure outage in Sweden Central during that window, or the worker's DNS cache expiring between the two calls and the subsequent live lookup failing. An intermediate rate-limit queue or long model wait could account for the gap.

2. **If Agent 2b and Agent 2c use different model deployments** (e.g., different Azure OpenAI resources), then Agent 2b succeeding tells us nothing about whether `openai-ds1sweden` was ever reachable. In that case the endpoint for Agent 2c may simply be misconfigured or decommissioned. All agents currently receive the same `AzureOpenAIClient` instance, which uses a single `AZURE_OPENAI_ENDPOINT` env var — so the hostname should be identical for both. The 38-minute gap is the more likely explanation for why one succeeded and one did not.

### How the error surfaces

`ENOTFOUND` is thrown synchronously-equivalent inside `client.chat(...)` before any model response is received. It propagates up through `generateFn` inside `withValidationRetry`. The retry wrapper does not distinguish between network errors and validation errors — it relies on `generateFn` throwing to abort an attempt. Since `ENOTFOUND` is thrown, attempt 1 fails and the wrapper's `generateFn` call re-throws.

The LLM client's own retry layer (`packages/llm-client/src/retry.ts`) attempts up to its configured retry count before re-throwing. DNS resolution failure does not become resolvable across these retries — all requests go to the same non-resolving hostname. This is consistent with the behaviour documented in ANALYSIS_08: retry budget is consumed without any chance of recovery.

### This is a hard fail, unlike Error A

Agent 2b soft-fails and returns a partial result. Agent 2c throws — no `LocationProfilesResult` is produced. The orchestrator receives an exception from the agent 2c runner. Depending on whether `agent2c-run.ts` wraps the call in a try/catch with a fallback, this either:

1. Propagates to the orchestrator and aborts the pipeline with a run-level error, or
2. Is caught and a null/empty location profiles artifact is injected, with the run continuing.

Either outcome means prose generation and scoring have no location sensory data, no sensory variants, and no atmosphere profile for any chapter.

### Relationship to Error A

The two errors are independent. Error A is a generation quality problem (token budget + weak retry feedback). Error B is a network configuration problem. They both happen to fire in the same run because:

- The pipeline is sequential through the 2-series agents
- Agent 2b's soft fail does not abort the pipeline, so Agent 2c is reached
- Agent 2c then encounters an unrelated DNS failure on its own LLM call

If Error B had occurred at Agent 2b, Error A would never have been observed. If Error A had been a hard fail (e.g., by throwing instead of soft-failing), Agent 2c would never have been reached.

---

---

## Solutions

### Error A — Proposed fixes (ordered by impact and effort)

#### A1. Raise `max_tokens` for Agent 2b (root fix, zero code change)

The `generation-params.yaml` config sets `max_tokens: 4000` for `agent2b_profiles`. This is the primary structural cause of the truncation.

Token budget accounting for a 5-character cast:

| Component | Approx. tokens |
|---|---|
| JSON structure + field names | ~600 |
| Structured fields per profile (name, summary, publicPersona, privateSecret, etc.) × 5 | ~700 |
| `paragraphs` arrays (4 × ~250 words per profile × 1.3 tokens/word) × 5 | ~6 500 |
| **Total** | **~7 800** |

The model is being asked to emit ~7 800 tokens against a 4 000-token ceiling. Four profiles consume approximately 3 000–3 600 tokens, leaving only 400–1 000 tokens for the fifth. That is enough for every scalar field but not the `paragraphs` array.

**Fix**: In `apps/worker/config/generation-params.yaml`, raise `agent2b_profiles.params.model.max_tokens` from `4000` to `8000`. This is a configuration-only change with no code impact.

If 8 000 tokens still feels tight on larger casts (e.g., 6–7 characters), scale to `N × 1700` where N is the cast size, capped at the Azure deployment limit for the configured model.

#### A2. Improve retry feedback: map JSON index to character name (targeted quality fix)

`buildValidationFeedback` in `packages/prompts-llm/src/utils/validation-retry-wrapper.ts` injects raw errors as-is:

```
1. profiles[4].paragraphs is required
```

The model sees an abstract JSON path. It does not know which cast member is at index 4 unless it tracks insertion order during generation.

**Fix**: In `agent2b-character-profiles.ts`, intercept the `previousErrors` passed to `buildProfilesPrompt` and rewrite index references to character names before passing them on:

```typescript
// Before calling buildProfilesPrompt on retry, rewrite "profiles[N]..." errors:
const namedErrors = (previousErrors ?? []).map((err) => {
  const match = err.match(/^profiles\[(\d+)\]\.(.*)/);
  if (match) {
    const idx = parseInt(match[1], 10);
    const character = inputs.cast.characters[idx];
    const name = character?.name ?? `character at index ${idx}`;
    return `The profile for "${name}" is missing or incomplete: ${match[2]} — ensure this character has a full "paragraphs" array of 4–6 narrative paragraphs (~${inputs.targetWordCount ?? 1000} words total).`;
  }
  return err;
});
```

This converts abstract paths into named, actionable directives that the model can act on precisely when regenerating that specific profile.

#### A3. Targeted single-profile repair pass (structural fix, eliminates the failure class)

Full regeneration on retry is the wrong repair strategy when only a specific profile is incomplete. The retry loop regenerates all N profiles from scratch and hits the same token ceiling.

**Fix**: After `withValidationRetry` exhausts its attempts and the result is still invalid, add a post-retry repair pass in `generateCharacterProfiles`:

```typescript
// After withValidationRetry, if still invalid:
if (!retryResult.validationResult.valid) {
  const incompleteProfiles = retryResult.result.profiles
    .map((p, i) => ({ index: i, profile: p, character: inputs.cast.characters[i] }))
    .filter(({ profile }) => !profile.paragraphs || profile.paragraphs.length === 0);

  for (const { index, profile, character } of incompleteProfiles) {
    // Single-profile repair call — token budget for one profile only
    const repaired = await generateSingleProfile(client, inputs, character, config);
    retryResult.result.profiles[index] = repaired;
  }
}
```

A `generateSingleProfile` helper makes a targeted call for one character with the full JSON schema but only that one character as the subject, requiring only ~1 000–1 500 tokens of output.

This turns every `profiles[N].paragraphs is required` failure into a recoverable error regardless of cast size or token ceiling.

#### A4. Increase `default_max_attempts` to 3

The current setting is 2. If A1 (token increase) is applied, the token ceiling stops being the constraint and the retry feedback quality (A2) becomes the limiting factor. Giving the model a third attempt, with named error feedback on attempt 3, gives a much higher probability of full recovery.

---

### Error B — Proposed fixes (ordered by impact and effort)

#### B1. Add a try/catch with graceful degradation in `agent2c-run.ts` (highest-impact, lowest-effort)

`runAgent2c` currently has no error handling around `generateLocationProfiles`. The ENOTFOUND error throws uncaught, propagating to the orchestrator and aborting the entire pipeline with no location data and a failed run status.

Agent 2b already establishes the precedent of soft-failing with a warning. Location profiles are rich context for prose, but they are not structurally required for the pipeline to produce a mystery. Scenes can be generated with reduced sensory precision.

**Fix**: Wrap the agent call in `agent2c-run.ts` in a try/catch that intercepts network-level errors and substitutes a minimal skeleton:

```typescript
try {
  ctx.locationProfiles = await generateLocationProfiles(...);
} catch (err: unknown) {
  const msg = err instanceof Error ? err.message : String(err);
  if (msg.includes("ENOTFOUND") || msg.includes("ECONNREFUSED") || msg.includes("ETIMEDOUT")) {
    ctx.warnings.push(`[Agent 2c] Network failure — location profiles unavailable: ${msg}`);
    ctx.locationProfiles = buildFallbackLocationProfiles(ctx.setting!.setting);
  } else {
    throw; // re-throw non-network errors
  }
}
```

`buildFallbackLocationProfiles` constructs a minimal `LocationProfilesResult` from the setting refinement (name, type, era, basic atmosphere tone) with empty `paragraphs` and `sensoryVariants`. Prose generation proceeds with coarser location context; the run completes as `degraded` rather than `failed`.

#### B2. Exclude `ENOTFOUND` from `withRetry` retryable list (confirm and lock)

`packages/llm-client/src/retry.ts` defines `defaultRetryConfig.retryableErrors`. `ENOTFOUND` is currently **not** in this list, which means `isRetryableError` correctly returns `false` for DNS failures and `withRetry` throws immediately rather than burning retry budget.

However this is implicit. If someone adds `"ENOTFOUND"` or `"connection"` to the retryable list in the future (or if a different error message wrapping passes through), the behaviour regresses silently.

**Fix**: Add an explicit `NON_RETRYABLE_ERRORS` export alongside the retryable list, and check it before `isRetryableError`:

```typescript
export const NON_RETRYABLE_ERRORS = ["ENOTFOUND", "ECONNREFUSED"] as const;

// In withRetry — before the retryable check:
if (NON_RETRYABLE_ERRORS.some(code => lastError.message.includes(code))) {
  throw new Error(`Non-retryable network error: ${lastError.message}`);
}
```

This makes the fast-fail behaviour explicit, documented, and test-able.

#### B3. Pre-flight DNS check before pipeline starts

The store.json entry at run level shows `"Pipeline failed: Mystery generation failed: getaddrinfo ENOTFOUND openai-ds1sweden.openai.azure.com"`. The run was written to the store and partially initialised before the failure was discovered at Agent 2c (~22:20), 38 minutes after the pipeline started.

**Fix**: In the orchestrator startup sequence (before Agent 1 runs), do a one-time DNS resolution of the configured `AZURE_OPENAI_ENDPOINT` hostname using `dns.lookup`. If it fails, abort immediately with a clear, user-visible error rather than discovering the problem mid-pipeline:

```typescript
import { lookup } from "dns/promises";
const endpoint = process.env.AZURE_OPENAI_ENDPOINT ?? "";
const hostname = new URL(endpoint).hostname;
await lookup(hostname); // throws ENOTFOUND early with a descriptive abort message
```

This is the strategy recommended in ANALYSIS_08 for Agent 1 failures and applies equally here. It converts a mid-run hard failure into a pre-run configuration error.

#### B4. Use the existing `CircuitBreaker` class from `retry.ts`

`packages/llm-client/src/retry.ts` already exports a `CircuitBreaker` class (state: `closed` / `open` / `half-open`, configurable failure threshold and reset timeout). It is not currently wired into any agent runner.

After one `ENOTFOUND` failure from an agent, a circuit breaker would cause all subsequent agent calls in the same run to fast-fail immediately rather than each attempting its own DNS resolution. Combined with the graceful-degradation approach (B1), this would allow agents with fallback paths to skip their generation cleanly and let the pipeline document which agents were affected.

---

## Summary Table

| Dimension | Error A (Agent 2b) | Error B (Agent 2c) |
|---|---|---|
| Error type | Schema validation failure | Network DNS failure |
| Error source | `validateArtifact("character_profiles", ...)` | `getaddrinfo` / Node.js DNS |
| Root cause | Token budget exhaustion on last of N profiles | Azure endpoint unreachable (transient or misconfigured) |
| Retry? | Yes — 2 attempts; second attempt fails identically | Retry attempted by LLM client; all attempts hit same DNS failure |
| Retry failure cause | `buildValidationFeedback` uses JSON path, not character name; regeneration hits same token ceiling | DNS is not recoverable by retrying the same hostname |
| Pipeline outcome | Soft fail — invalid artifact returned; pipeline continues | Hard fail — no artifact produced |
| Affected downstream | Profile[4] missing `paragraphs`; prose context and scoring degraded for character 5 | No location profiles; sensory data, atmosphere, and sensory variants absent for all chapters |
| Already analysed? | No | General DNS analysis in ANALYSIS_08; this is the mid-run / Agent 2c specific occurrence |
