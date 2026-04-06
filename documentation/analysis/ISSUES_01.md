# ISSUES_01 — Outstanding Errors & Unproved Fixes

**Run reference:** log captured 2026-04-04 ~17:15–17:19 UTC  
**Status as of 2026-04-04**

---

## Active errors from the latest run

### ISSUE-01 — Agent 2c: Atmosphere object fields persistently missing (FULLY ANALYSED & FIXED)

#### Observed failure sequence

```
Attempt 1 — 5 errors:
  atmosphere.timeFlow is required
  atmosphere.mood is required
  atmosphere.eraMarkers is required
  atmosphere.sensoryPalette is required
  atmosphere.paragraphs is required

Attempt 2 — 3 errors:
  atmosphere.sensoryPalette.dominant is required
  atmosphere.sensoryPalette.secondary is required
  atmosphere.paragraphs is required

Warning on attempt 2:
  atmosphere.sensoryPalette. is not defined in schema (unexpected field)
  (trailing dot = LLM created a malformed empty-key object instead of { dominant, secondary })
```

Agent 2c only has 2 max attempts → validation failed → run continued with broken atmosphere data.

#### Schema

`schema/location_profiles.schema.yaml` → `atmosphere` is a top-level `required: true` object with 7 required fields:

| Field | Type | Required |
|-------|------|---------|
| `era` | string | ✅ |
| `weather` | string | ✅ |
| `timeFlow` | string | ✅ |
| `mood` | string | ✅ |
| `eraMarkers` | string[] | ✅ |
| `sensoryPalette` | `{ dominant: string, secondary: string[] }` | ✅ |
| `paragraphs` | string[] | ✅ |

The validator (`packages/cml/src/artifact-validator.ts → validateNode`) reports every missing required field as `"<path> is required"`. It reports every unexpected key as a warning — hence `"atmosphere.sensoryPalette. is not defined in schema"` (the LLM produced `sensoryPalette: { "": ... }` or `sensoryPalette: {}` with a spurious key).

#### Root cause 1 (PRIMARY): Token budget exhaustion — `max_tokens: 4500`

This is the dominant cause. The JSON object agent 2c must produce is large:

| Section | Approx tokens at min required verbosity |
|---------|-----------------------------------------|
| `status` + `tone` + `primary` (4 paragraphs) | ~400–600 |
| `keyLocations` × 4 (sensoryDetails + sensoryVariants × 3 + paragraphs × 2 per location) | ~2,400–3,600 |
| `atmosphere` | ~200–350 |
| **Total** | **~3,000–4,550** |

The `keyLocations` section is explicitly required to be verbose — "Each sensory detail entry MUST be a full 2-sentence description (minimum 20 words per entry)." With 4 minimum locations × 4 sensory fields × 2 entries × 20-word minimum per entry = 640 words minimum for sensory arrays alone, plus sensoryVariants, paragraphs, etc.

**The `atmosphere` object is placed LAST in the JSON template.** When `keyLocations` consumes most of the token budget the model either: (a) truncates the `atmosphere` block completely, or (b) writes only the first two fields (`era` and `weather`) before stopping — which is exactly what the attempt 1 errors show. Note that `era` and `weather` happen to be the **first two fields** in the template and are pre-interpolated with literal values, making them the most likely to be written before truncation.

Evidence: `atmosphere.era` and `atmosphere.weather` are **not** in the error list for attempt 1, meaning they are present. All five subsequent fields are absent. This is the token-exhaustion truncation pattern.

Comparator: `agent2b_profiles` (character profiles, similar structural complexity) has `max_tokens: 8000` and `default_max_attempts: 3`. Agent 2c was given only 4500 / 2 — an unexplained asymmetry.

#### Root cause 2: Atmosphere placed last in template

The JSON template in the `developer` prompt had the order:
```
{ status, tone, primary, keyLocations [ ... large block ... ], atmosphere, note }
```
LLMs produce output fields in the order they appear in the template. Placing `atmosphere` after the 
enormous `keyLocations` block guarantees it is the first casualty of truncation.

#### Root cause 3: `missingSubfields` regex truncated dotted paths (FIXED 2026-04-04)

The attempt-2 retry feedback logic extracts field names from error strings:
```ts
// BEFORE (bug):
const matches = e.match(/atmosphere\.(\w+)/gi) ?? [];
// For "atmosphere.sensoryPalette.dominant is required" → extracts "sensoryPalette" (not ".dominant")
```
The feedback told the LLM: "add `sensoryPalette`" — but `sensoryPalette` was already present (as an empty/malformed object). The LLM saw no action needed and left it unchanged. Fixed to `atmosphere\.(\w[\w.]*)` to capture full dotted paths.

#### Root cause 4: Only 2 retry attempts

For an output of this structural complexity, 2 attempts is insufficient. One attempt may produce a truncated atmosphere; the second can correct most fields but still fail on the innermost sub-structure (`sensoryPalette.dominant`, `paragraphs`) especially under continued token pressure. A 3rd attempt with the corrected regex feedback is required.

#### Root cause 5: No structural guard for `atmosphere` in `generateFn`

The `generateFn` basic-validation block checked `primary.paragraphs` and `keyLocations.length` but had no check for the `atmosphere` object. When atmosphere was absent or malformed, this went silently into `validateArtifact` which returned errors, but since those errors don't throw they don't interrupt the retry loop's "produce result → validate → record errors" cycle differently than any other error. Adding an explicit throw ensures the retry loop surfaces a clear message alongside normal schema errors.

#### Fixes applied (2026-04-04)

| # | Fix | File | Description |
|---|-----|------|-------------|
| F1 | Raise `max_tokens` 4500 → 8000 | `apps/worker/config/generation-params.yaml` | Matches agent2b. Prevents token truncation of atmosphere block. |
| F2 | Raise `default_max_attempts` 2 → 3 | `apps/worker/config/generation-params.yaml` | Extra retry available after F3 regex fix produces correct sub-field feedback. |
| F3 | Fix `missingSubfields` regex | `packages/prompts-llm/src/agent2c-location-profiles.ts` | `atmosphere\.(\w[\w.]*)` captures full dotted paths like `sensoryPalette.dominant`. |
| F4 | Move `atmosphere` before `keyLocations` in JSON template | `packages/prompts-llm/src/agent2c-location-profiles.ts` | Ensures atmosphere is written before the large keyLocations block. |
| F5 | Add `atmosphere` structural guard in `generateFn` | `packages/prompts-llm/src/agent2c-location-profiles.ts` | Explicit throw with descriptive message if atmosphere is absent, missing required sub-fields, or `sensoryPalette` is malformed. Causes a proper retry message rather than silent schema error accumulation. |
| F6 | Wrap `generateFn` in try/catch inside `withValidationRetry` | `packages/prompts-llm/src/utils/validation-retry-wrapper.ts` | **Critical fix.** F5 (and all existing structural guards in agents 2b, 2d, 2e, 6, 7, 8, 9) threw errors that were _not_ caught by the retry loop — they escaped and crashed the agent immediately. Now `try/catch` around `generateFn` records the error message in `retryHistory` and continues the loop; only re-throws if all attempts are exhausted with no result. Validated by existing `validation-retry-wrapper.test.ts` (2/2 pass). |

**Status: All 6 fixes applied. 0 TypeScript errors. `packages/story-validation` dist rebuilt. 366/375 targeted tests pass (2 pre-existing snapshot failures unrelated to this issue). Not yet proved in a live run.**

---

### ISSUE-02 — Agent 2d: DNS lookup failure not retried (INFRA — FIXED)

**Symptom:**  
```
ERROR: getaddrinfo ENOTFOUND openai-ds1sweden.openai.azure.com
```
Agent 2d (TemporalContext) threw a `chat_error` immediately. No further log entries — the run was abandoned.

**Root cause:**  
`ENOTFOUND` (Node.js DNS resolution failure) was not in the `retryableErrors` list inside `packages/llm-client/src/retry.ts`. The LLM client's `withRetry` wrapper treats any error not in that list as immediately fatal and rethrows without back-off.

The Azure OpenAI endpoint is a DNS-routed hostname. Transient DNS failures (sub-second blips, momentary routing hiccups) would all cause immediate abort rather than triggering the 3-attempt exponential back-off already in place for `ECONNRESET`, `ETIMEDOUT`, etc.

**Fix applied (2026-04-04):**  
Added `"ENOTFOUND"` to `defaultRetryConfig.retryableErrors`.

**Files changed:**
- `packages/llm-client/src/retry.ts`

**Caveat:** If the Azure endpoint hostname itself is misconfigured in `.env.local` (`AZURE_OPENAI_ENDPOINT`), all three retries will also fail with `ENOTFOUND`. The error will still reach the caller as a fatal error — but after 3 retries rather than instantly. Verify the hostname is correct if this persists.

**Status: Fixed. Not yet proved.**

---

## Unproved fixes from prior sessions

All pronoun fixes implemented in response to run `run_ea73d9f2`. 185/185 tests pass, 0 TypeScript errors.

| ID | Fix | File(s) |
|----|-----|---------|
| C1 | Competing-entity name guard in `findIncorrectPronouns` | `character-validator.ts` |
| C2 | `checkPronounDrift` competing-entity guard | `prose-consistency-validator.ts` |
| C3 | Detective names derived from cast manifest | `character-validator.ts` |
| C1-bis | Backward sentence extension + correct-pronoun-in-context (Guard 2) | `character-validator.ts` |
| Gap A | Repair inheritance corruption — full cast + `onlyNames` option | `pronoun-repair.ts`, `agent9-prose.ts` |
| Gap B | Guard 1 widened to ±4-sentence window | `character-validator.ts` |
| Gap C | Sentence-boundary guard with full-text fallback (Guard 3) | `character-validator.ts` |

If the next live run still shows `pronoun_gender_mismatch` aborts, create `ANALYSIS_42` with the new run log.

---

## Pre-existing test failures (unrelated to above)

| Test file | Failure brief |
|-----------|--------------|
| `packages/prompts-llm/__tests__/agent2-cast-diversity.test.ts` | Archetype-diversity retry threshold snapshot mismatch |
| `apps/api/src/__tests__/server.test.ts` | Aggregate stats shape assertion |
| `apps/worker/src/__tests__/scoring-adapters-character-profiles.test.ts` | `motive_and_alibi` paragraph content assertion |
| `packages/prompts-llm/src/__tests__/agent9-prose.test.ts` | Positive locked-fact phrasing snapshot mismatch |

None affect runtime behaviour of the pronoun pipeline or location profile generation.
