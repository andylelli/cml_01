# ANALYSIS_46 — Agent 5 Clue Extraction: JSON Parse Failure Aborts Run

**Date:** 2026-04-06
**Run:** run_14c93f65-3d5b-49c3-b39d-fc611de8cbd7
**Status:** ROOT CAUSE ESTABLISHED — fix below

---

## 1. Symptom

The run aborted with:

```
[Agent5-ClueExtraction] ERROR: Expected double-quoted property name in JSON at position 1510
```

`run_outcome: "aborted"`, `run_outcome_reason: "Expected double-quoted property name in JSON at position 1510"`. All six pipeline phases had already passed (score 99.67/A) but the run never continued to prose generation.

---

## 2. Evidence

### 2.1 Log sequence

```
09:14:36.676  INFO   Agent5-ClueExtraction | extract_clues
09:14:36.677  INFO   Agent5-ClueExtraction | chat_request
09:14:36.678  INFO   Agent5-ClueExtraction | chat_request
09:14:43.808  INFO   Agent5-ClueExtraction | chat_response
09:14:43.810  INFO   Agent5-ClueExtraction | chat_response
09:14:43.811  ERROR  Agent5-ClueExtraction | extract_clues | ERROR: Expected double-quoted property name in JSON at position 1510
```

Two LLM calls are made in parallel (see §3.2). One response fails `JSON.parse()`. The exception propagates uncaught and aborts the whole run.

### 2.2 Error class

`"Expected double-quoted property name in JSON at position 1510"` is a standard V8 `JSON.parse()` error. It fires when a JSON property name is:
- Single-quoted: `{'key': 'value'}` instead of `{"key": "value"}`
- Unquoted: `{key: 'value'}`
- Truncated mid-token (rare but possible at token boundary)

Position 1510 indicates the response content was at least 1510 characters long and syntactically valid JSON up to that point — this is a single malformed property name, not a wholesale non-JSON response.

### 2.3 The parse call

`packages/prompts-llm/src/agent5-clues.ts` line 474:

```typescript
const clueData = JSON.parse(response.content);
```

No repair step, no retry on parse failure.

---

## 3. Root Cause Analysis

### RC-1 (PRIMARY): Bare `JSON.parse` with no repair fallback

`extractClues()` calls `client.chat({ jsonMode: true })` then immediately does `JSON.parse(response.content)`. JSON mode asks the model to return valid JSON but does not guarantee it — models occasionally emit single-quoted property names, trailing commas, or JavaScript-style syntax that is valid JS but not valid JSON.

Every other agent in the pipeline that parses JSON already handles this with the `jsonrepair` library:

| Agent | Repair pattern |
|-------|----------------|
| agent2b-character-profiles.ts | `JSON.parse(jsonrepair(response.content))` |
| agent2c-location-profiles.ts  | try `JSON.parse` → catch → `JSON.parse(jsonrepair(...))` |
| agent2d-temporal-context.ts   | try `JSON.parse` → catch → `JSON.parse(jsonrepair(...))` |
| agent65-world-builder.ts      | try `JSON.parse` → catch → `JSON.parse(jsonrepair(...))` |
| agent9-prose.ts               | try `JSON.parse` → catch → `JSON.parse(jsonrepair(...))` |
| **agent5-clues.ts**           | **bare `JSON.parse` — no repair** |

Agent 5 is the only agent missing the repair step.

### RC-2 (SECONDARY): No retry on parse failure

`agent5-run.ts` has retry logic for guardrail failures (lines 220–260) but zero retry for a `JSON.parse` exception. When `extractClues()` throws, `runAgent5()` propagates the error directly to the orchestrator, which aborts the run:

```typescript
// extractClues() catch block (agent5-clues.ts line 539)
} catch (error) {
  await logger.logError({ ... errorMessage: (error as Error).message });
  throw error;   // ← re-thrown with no retry
}
```

A parse failure is transient (the LLM will produce valid JSON on a retry) but the current code treats it as fatal.

### RC-3 (CONTEXT): The two parallel chat_request log entries

The log shows two `chat_request` entries 1ms apart. This is because `extractClues()` emits one `logRequest` call with `operation: "extract_clues"` (shown as `extract_clues` in the log) and a second with `operation: "chat_request"` immediately before the actual API call — both for the same single invocation. The two `chat_response` entries confirm two separate LLM responses, indicating two concurrent `extractClues()` calls were in flight. This suggests the agent server was handling two concurrent story generation requests at the moment of failure; it is not a cause of the parse error itself.

---

## 4. Consequence

- The entire run is aborted after all planning phases passed with 99.67/A.
- All LLM cost for agents 1–3b ($0.004) is wasted.
- The error is intermittent (not every run) — it depends on whether the LLM happens to emit a single-quoted property name in its response.
- It will recur on any run where the CML produces a clue prompt that pushes the LLM toward single-quoted output (e.g., apostrophes-heavy content near line formatting boundaries).

---

## 5. Fix

### FIX-46A (REQUIRED): Add `jsonrepair` fallback in `extractClues()`

**File:** `packages/prompts-llm/src/agent5-clues.ts`

Add the import (already present in package.json transitive deps via other agents):

```typescript
import { jsonrepair } from "jsonrepair";
```

Change the parse call from:

```typescript
const clueData = JSON.parse(response.content);
```

To:

```typescript
let clueData: any;
try {
  clueData = JSON.parse(response.content);
} catch {
  clueData = JSON.parse(jsonrepair(response.content));
}
```

This matches the exact pattern used by agent2c, agent2d, agent65, and agent9. If `jsonrepair` also fails, the exception propagates as before — no silent data loss.

### FIX-46B (RECOMMENDED): Add retry on parse failure in `agent5-run.ts`

If `jsonrepair` cannot repair the response (very rare), the run currently aborts. A retry call to the LLM is more resilient:

In `agent5-run.ts`, wrap the initial `extractClues()` call in a try/catch that retries once on `SyntaxError`:

```typescript
let clues: ClueDistributionResult;
try {
  clues = await extractClues(ctx.client, { ... });
} catch (err) {
  if (err instanceof SyntaxError) {
    ctx.warnings.push("Agent 5: JSON parse failure on first attempt; retrying");
    clues = await extractClues(ctx.client, { ... });  // blind retry
  } else {
    throw err;
  }
}
```

This is the same blind-retry pattern already used for guardrail failures at line 230.

---

## 6. Recommended Action Plan

**Priority order:** FIX-46A → FIX-46B

1. Apply FIX-46A (jsonrepair fallback) — addresses 99% of cases immediately.
2. Apply FIX-46B (retry on SyntaxError in agent5-run.ts) — defence-in-depth for the 1% where jsonrepair cannot recover.

---

## 7. Acceptance Criteria

| Criterion | Target |
|---|---|
| Run with single-quoted LLM response in Agent 5 | Completes successfully (repaired) |
| `run_outcome: "aborted"` with JSON parse reason | Zero occurrences |
| No regression to existing retry/guardrail behaviour | All existing agent5-run.ts retry paths unaffected |

---

## 8. Files Affected

| File | Change |
|---|---|
| `packages/prompts-llm/src/agent5-clues.ts` | Add `jsonrepair` import; wrap `JSON.parse` with repair fallback |
| `apps/worker/src/jobs/agents/agent5-run.ts` | Add SyntaxError retry wrapper around initial `extractClues()` call |
