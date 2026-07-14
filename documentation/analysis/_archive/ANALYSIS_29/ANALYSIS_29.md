# ANALYSIS_29 — Azure 500 Cascade, Zombie State, llm-client Code Audit, and Post-Rebuild Runs
*Date: 2026-05-29 | Runs: mystery-1780067978907 (failed) · run_76027844 (validation fail) · run_668d76eb (ongoing) · mystery-1779998607579 (reference) | Model: gpt-4.1-mini*

---

## 1. Context

This document covers the **29 May session**, which began with a successful completed run from the previous evening (mystery-1779998607579) and was followed by a new run (mystery-1780067978907) that **failed completely** at Agent1 due to a sustained Azure infrastructure degradation. The session also produced a proactive audit of the `llm-client` package, uncovering four pre-existing silent correctness bugs.

**Runs covered:**

| Run ID | Project | Outcome | Exit cause |
|--------|---------|---------|------------|
| mystery-1779998607579 | (previous project) | Completed — 10 chapters | Chapter 6 first-attempt retry |
| mystery-1780067978907 | Golden Age Prototype 1 | **Failed at Agent1** | 3× Azure 500, maxAttempts exhausted |
| run_76027844 | Project 25 | **Validation failure** — 10 chapters generated | 1 critical + 4 major validation issues |
| run_668d76eb 🔴 | Golden Age Prototype 1 | **In progress** at time of writing | — |

---

## 2. Primary Failure: Azure 500 Cascade (mystery-1780067978907)

### 2.1 Timeline

The run started at 15:19 UTC and was abandoned at 15:27 UTC — 7 minutes 40 seconds of wall time, all spent retrying a single Agent1-SettingRefiner request.

| Attempt | Request sent | Error returned | Latency | Error message |
|---------|-------------|----------------|---------|---------------|
| Retry 1 | 15:19:39 | 15:21:47 | **2m 8s** | "The server had an error while processing your request." |
| Retry 2 | 15:21:47 | 15:24:24 | **2m 36s** | "The server had an error while processing your request." |
| Retry 3 | 15:24:24 | 15:27:20 | **2m 56s** | "The server had an error while processing your request." |
| **Total** | — | — | **7m 40s** | maxAttempts (4) reached after retry 3 |

Note: `retryAttempt` values in the log are 1-indexed relative to the first request. The initial attempt (retry 0) is not captured in the log as it was a pre-existing warm-up request from a prior partial run. The configured `maxAttempts` is 4; only 3 recorded here suggests one earlier attempt was not logged or occurred before the log stream opened.

### 2.2 Root Cause

**Azure Sweden Central transient degradation.** All three failures share the same error string, same affected deployment (`gpt-4.1-mini` at `openai-ds1sweden.cognitiveservices.azure.com`), and progressively increasing server-side latency (2m 8s → 2m 36s → 2m 56s). This pattern is characteristic of an overloaded upstream node accepting connections but failing to produce completions — not a network timeout, not an auth error, not a quota error.

**Confirmed recovery:** Later in the same session the connectivity harness was run against `gpt-4.1-mini` and received a clean HTTP 200 in 1.4 seconds with a valid response. The degradation was fully transient and self-resolved within approximately 30 minutes of the final failure.

**Why each attempt took 2–3 minutes:** The Azure endpoint was accepting the connection and holding it open before returning 500. This is slow-fail behaviour — the upstream compute node was receiving the request but unable to complete the inference. There is no local timeout firing here; the SDK waited for the server to close the response.

### 2.3 Impact on Project State

The run record `run_668d76eb-84ec-44e1-92c8-983847bfe020` was persisted to `data/store.json` with `status: "running"`. The corresponding project "Golden Age Prototype 1" (`proj_1b04b300-22bb-4793-9b2c-a2c7829205da`) also retained `status: "running"`.

After the worker process terminated, neither the run nor the project was cleaned up — they became **zombie state** indefinitely blocking the project from accepting new runs.

**Resolution:** The zombie cleanup routine in `createRepository()` (db.ts) runs at API startup and resets all `running` → `idle`. Restarting the API cleared the state.

**Note:** `run_668d76eb` remains in the store with `status: "running"` — only the project status was reset to `idle` by the zombie sweep. The run record itself is orphaned. This is pre-existing behaviour and a separate concern.

### 2.4 Retry Configuration at Time of Failure

```
maxAttempts:    4
initialDelayMs: 1500
maxDelayMs:     30000
retryableErrors: ["rate_limit_exceeded", "server had an error",
                  "the server had an error", "500", "timeout", ...]
```

The configuration is correct — the 500 was correctly identified as retryable. The failure was caused by the degradation outlasting `maxAttempts`, not by a configuration defect.

**Consideration:** Given that each Azure 500 takes ~2–3 minutes to resolve (slow fail), 4 attempts × 3 minutes ≈ 12 minutes before Agent1 gives up. This is already a substantial wait for a single LLM call. Increasing `maxAttempts` further would compound zombie risk. The appropriate mitigation is a **per-attempt timeout** on the Azure SDK call itself, so slow-fail connections are cut after (e.g.) 60 seconds rather than waiting for the server to close them.

---

## 3. Reference Run: mystery-1779998607579 (28 May — Completed)

### 3.1 Summary

The prior-evening run completed successfully. Relevant observations for continuity:

| Metric | Value |
|--------|-------|
| Chapters generated | 10/10 |
| Batches requiring retry | 2/10 |
| AtmosphereRepair runs | 10 |
| Final model | gpt-4.1-mini |

### 3.2 Chapter 6 Validation Failure

The only first-attempt failure was **Chapter 6**, flagged by the chapter completeness gate:

```
Chapter 6: clue evidence "A blackmail threat from the victim's estate manager
to Dr. Mallory Finch is found, showing premeditation and motive." is absent.
Include an on-page observation or reference to this clue (reveals: Shows
Dr. Mallory Finch's motive and planning before confrontation.) before the
chapter ends.
```

- **Attempt 1:** Failed (`chapter_validation_failure`, attempt 1)
- **Attempt 2:** Not explicitly logged as pass — but the final batch_validation log records only `2/10 batch(es) required retry`, confirming Chapter 6 was one of the two and was eventually resolved.

**Pattern:** This is the second consecutive run where a blackmail/motive clue placement fails on first attempt in the middle chapters. The clue is being placed too late (Ch9/Ch10 context) rather than at the required Ch6 insertion point. This may be a prompt contract ambiguity around the phrase "found" — the model may be staging the reveal for the denouement rather than planting the physical evidence in Ch6.

### 3.3 AtmosphereRepair — Cross-Chapter Phrase Repetition

The same recurring phrase from ANALYSIS_28 persists in this run:

| Phrase fixed | Chapters affected |
|---|---|
| `"in the village from half past ten"` / alibi time variants | Ch2, Ch3, Ch4, Ch7, Ch8, Ch9 |
| `"scent of beeswax polish mingled with the"` | Ch1, Ch8 |
| `"lips pressed into a thin line"` | Ch4, Ch9 |
| `"stopped time of ten minutes past eleven"` | Ch5, Ch6, Ch7, Ch8, Ch9 |

Six chapters contained some variant of the alibi time phrasing — indicating the narrative outline's temporal anchor (`"half past ten"`) is propagating into the prose verbatim across all chapters that mention Dr. Finch's alibi. AtmosphereRepair fixed these but used inconsistent substitution strings (e.g. "10:30" in Ch2, "around 10:30" in Ch4, "since shortly after ten" in Ch4), which may introduce minor inconsistency across chapters.

**Recommendation:** The narrative outline agent should emit the alibi time in varied prose forms rather than one canonical string, matching the same approach recommended in ANALYSIS_28 for the clock phrase.

---

## 4. llm-client Code Audit — Four Silent Bugs Fixed

A proactive audit of the `packages/llm-client` source files was conducted following the Azure failure diagnosis. Four pre-existing silent correctness bugs were identified and fixed.

### 4.1 RateLimiter — tokenCounts Index Corruption (`ratelimit.ts`)

**Bug:** When expired entries are removed, `requestTimestamps` was filtered first, then `tokenCounts` was iterated using the index of the *already-shortened* `requestTimestamps` array. After the first expiry cycle, `tokenCounts[i]` was selecting the wrong token count for each slot.

**Symptom:** Token-per-minute rate limit calculations silently drifted over time. The longer a session ran and the more entries expired, the more incorrect the remaining token total became. In a long pipeline run (~30+ requests) the accumulated drift could cause the limiter to either allow too many tokens (under-counting) or refuse valid requests (over-counting).

**Fix:** Both arrays are now filtered together via a shared `keep` mask:
```typescript
const keep = this.requestTimestamps.map((ts) => ts > oneMinuteAgo);
this.requestTimestamps = this.requestTimestamps.filter((_, i) => keep[i]);
this.tokenCounts       = this.tokenCounts.filter((_, i) => keep[i]);
```

**Severity:** Medium. Silent correctness issue; no crash or thrown error.

---

### 4.2 CostTracker — gpt-4.1-mini Priced as GPT-3.5 (`cost-tracker.ts`)

**Bug:** The model detection logic checked for `gpt-4o-mini` and `gpt-4o` but had no branch for `gpt-4.1-mini`. The string `"gpt-4.1-mini"` matched neither pattern and fell through to the GPT-3.5 fallback (`$0.0005/$0.0015 per 1K tokens`).

**Actual gpt-4.1-mini pricing:** `$0.40/$1.60 per 1M tokens` = `$0.000400/$0.001600 per 1K tokens` — approximately 0.8× the GPT-3.5 rate on input but 1.1× on output. The pricing is similar enough that the reported totals were not dramatically wrong, but tracked costs were systematically inaccurate.

**Impact on cost log:** All `estimatedCost` values in `llm.jsonl` for `gpt-4.1-mini` runs are slightly off. The session-reported total of $17.02 should be treated as approximate; the true figure is likely within 10–15% of that number.

**Fix:** Added explicit `isGpt41Mini` detection before the existing `isGpt4oMini` check, with `4.1-mini` pricing applied first:
```typescript
const isGpt41Mini = modelName.includes("gpt-4.1-mini") || modelName.includes("4.1-mini");
const isGpt4oMini = !isGpt41Mini && (modelName.includes("gpt-4o-mini") || ...);
```

**Severity:** Low-medium. Affects cost reporting accuracy only; no operational impact.

---

### 4.3 Client — waitForCapacity Called with 0 Tokens (`client.ts`)

**Bug:** In the `chat()` method, `this.rateLimiter.waitForCapacity(0)` was called instead of `this.rateLimiter.waitForCapacity(maxTokens)`. The rate limiter's token budget check was comparing `0 + pendingTokens <= tokensPerMinute`, which is always true regardless of `tokensPerMinute` setting.

**Symptom:** The `tokensPerMinute` rate limit was completely bypassed. Every request was immediately approved by the token budget check regardless of configured limits. Only the `requestsPerMinute` limit was effectively enforced.

**Fix:**
```typescript
// Before:
await this.rateLimiter.waitForCapacity(0);
// After:
await this.rateLimiter.waitForCapacity(maxTokens);
```

**Severity:** Medium. Could allow token rate limit violations on Azure deployments with strict TPM quotas; no crash.

---

### 4.4 Client — Stale API Version Fallback (`client.ts`)

**Bug:** The fallback `apiVersion` value was `"2024-02-15-preview"` — a version from over two years ago. If the `AZURE_OPENAI_API_VERSION` environment variable was ever absent or empty, all requests would use this stale version, which lacks support for newer model features and may behave differently.

**Fix:** Updated fallback to `"2024-12-01-preview"` (the current production version used in `.env`).

**Severity:** Low. The `.env` always provides the correct version; only affects misconfigured deployments.

---

## 5. Post-Rebuild Runs (Project 25 + Golden Age Prototype 1)

After the API was restarted and all packages rebuilt (~17:00 UTC), two new runs were started. Neither run appears in `llm.jsonl` — see §6 for the logging breakage finding.

### 5.1 Project 25 (run_76027844) — Validation Failure

**Project:** Project 25 (`proj_3536a346`), created 16:57 UTC  
**Story:** 1940s transatlantic ocean liner; detective Alice Turnbull; culprit Frank Barlow; hard logic device: brass cabin door latch thermal expansion delay.  
**Outcome:** All 10 chapters generated. Pipeline completed. Final validation gate: **FAILED** (1 critical, 4 major).

**Pipeline stage latencies (from store artifacts):**

| Stage | Latency |
|-------|---------|
| Agent 1 — Setting refinement | 68.4 s |
| Agent 2 — Cast design | **180.9 s (3 min)** |
| Agent 4 — Hard logic devices | 36.4 s |
| Agent 5 — Clues | 30.1 s |

The 3-minute cast latency indicates Azure was still degraded when this run started, approximately 90 minutes after the last recorded 500 error.

**Agent 5 / Agent 6 pre-audit (from pipeline_failure_snapshot warnings):**
- Red herring overlap detected: `rh_1` and `rh_2` both shared inference tokens (`latch`, `engaged`, `status`) with the true solution. Deterministic sanitiser fired and cleaned both.
- Temporal lexical collision: `engaged`, `latch` appeared in both the false-assumption and correction lexicons.
- Agent 5 synthesised `clue_culprit_direct_frank_barlow` (cloned from clue_11) and ran strict phrasing + source repair.
- Agent 6 structural pre-audit: **PASS** — all 4 inference steps covered, 3 evidence clues verified in early/mid.

**Final validation errors:**

| Severity | Type | Detail |
|----------|------|--------|
| Critical | `identity_role_alias_break` | Post-reveal scene Ch9 uses role aliasing instead of stable identity references |
| Major | `locked_fact_missing_value` × 3 | `"ten minutes past eleven"` absent in Ch6, Ch7, Ch9 |
| Major | `locked_fact_missing_value` × 1 | `"forty minutes"` (clock wind-back) absent in Ch3 |
| Moderate | `opening_style_repetition` | `general-descriptive` opener in 7/10 chapters (70%), exceeds 50% threshold |

3 of 10 generation batches required validation retries.

**Root cause — locked_fact_missing_value:**  
The clock time (`ten minutes past eleven`) and wind-back amount (`forty minutes`) are canonical locked facts from the hard logic device. Their absence across 4 chapters suggests the locked-fact injection in the chapter prompt is not reliably propagating numeric values into prose — the LLM paraphrases or omits the exact figure. This is the same class of issue noted in ANALYSIS_28 §2.4.

**Root cause — identity_role_alias_break (critical):**  
Ch9 is the suspect clearance chapter. After the reveal, the template appears to be passing a role label (`culprit`) into the prose context rather than the stable character name (`Frank Barlow`). This is a post-reveal aliasing bug in the chapter context binding.

---

### 5.2 Golden Age Prototype 1 (run_668d76eb) — In Progress

**Project:** Golden Age Prototype 1 (`proj_1b04b300`), created 17:10 UTC  
**Status:** `running` — checkpoint last saved at 17:34 UTC with **19 completed chapters** (count was growing between observations).

The story is a manor mystery set with a clockwork anomaly device, featuring characters Margaret Blythe, Henry, Evelyn, and Inspector Hargraves. Chapter titles indicate a conventional structure progressing through discovery, alibi scrutiny, red herrings, discriminating test, and clearance. No artifacts in the store yet (pipeline stages still committing). No LLM log entries.

This run will be covered in a follow-up once it completes.

---

## 6. LLM Logging Broken Post-Rebuild

`llm.jsonl` was last written at **15:27 UTC** (the final Azure 500 entry). All subsequent runs — Project 25 (10 chapters, completed) and Golden Age Prototype 1 (19+ chapters, in progress) — have **zero LLM log entries**.

**Impact:**
- Token usage, latency, estimated cost, and retry counts unavailable for all post-rebuild runs
- Quality analysis of Project 25 relies solely on the `pipeline_failure_snapshot` artifact
- The cost tracker and token rate limiter fixes (§4.1–4.3) cannot be verified as active via logs

**Probable cause:** `LLMLogger` opens an append stream to `logs/llm.jsonl` at module initialisation. During this session, `node apps/api/dist/index.js` was invoked directly and failed with `EADDRINUSE` because the original process was still holding the file stream. When the old process was killed and the API restarted, the new process may have failed to re-open the stream — either due to a file lock not being released, or a path resolution change between working directories.

**Immediate action required:** Inspect `packages/llm-client/src/logger.ts` stream initialisation. Add a startup sentinel write (`{"event":"logger_init"}`) so logging health is verifiable on every restart.

---

## 7. Infrastructure Issues

### 7.1 EADDRINUSE on Port 3005

When `node apps/api/dist/index.js` was invoked directly from the terminal, it failed with:

```
Error: listen EADDRINUSE: address already in use 0.0.0.0:3005
```

This was not a bug — the API was already running in an async terminal session from the previous start. The direct invocation attempt was a diagnostic step. The existing API instance was already serving correctly. No action required.

### 7.2 Connectivity Harness — New Diagnostic Tool

A new diagnostic tool was created at `apps/worker/src/harness/llm-connectivity-harness.ts`. It performs four checks:

1. **DNS + TLS reachability** — HTTPS GET to the Azure endpoint root
2. **Auth validation** — POST with an invalid key, expects 401 (not network error)
3. **Real LLM call** — `chatWithRetry()` with "Reply with PONG", 10 max tokens
4. **Raw HTTP probe** — Direct HTTPS POST to the deployment completions endpoint

**Usage:** `npm run -w @cml/worker harness:llm:check`

**Last result (post-recovery):** All 4 checks passed, `gpt-4.1-mini` responded in 1.4 seconds.

---

## 8. Fixes Applied and Build Status

| File | Fix | Rebuilt |
|------|-----|---------|
| `packages/llm-client/src/ratelimit.ts` | Parallel array filtering via `keep` mask | ✅ |
| `packages/llm-client/src/cost-tracker.ts` | gpt-4.1-mini pricing + detection | ✅ |
| `packages/llm-client/src/client.ts` | `waitForCapacity(maxTokens)` + API version fallback | ✅ |
| `apps/api` | Rebuilt after llm-client rebuild | ✅ |
| `apps/worker` | Rebuilt after llm-client rebuild | ✅ |

All five builds completed with exit code 0. The connectivity harness confirmed LLM is healthy post-rebuild.

---

## 9. Open Items

| # | Issue | Severity | Status |
|---|-------|----------|--------|
| 1 | Per-attempt SDK timeout missing — slow-fail Azure 500s hold connection for 2–3 min | Medium | Open |
| 2 | `run_668d76eb` in store with `status: "running"` (zombie if it fails) | Low | Open |
| 3 | Alibi time phrase propagation from narrative outline (6 chapters affected) | Low-medium | Open (recurring) |
| 4 | Chapter 6 blackmail clue placement fails on first attempt (second consecutive run) | Medium | Open |
| 5 | Cost totals for prior gpt-4.1-mini runs are ~10–15% inaccurate (pre-fix data) | Low | Accepted |
| 6 | **LLM logging broken** — no entries for any post-rebuild run | **High** | **Open** |
| 7 | `identity_role_alias_break` (critical) in Project 25 Ch9 | High | Open |
| 8 | `locked_fact_missing_value` for clock time/wind-back across 4 chapters (Project 25) | Medium | Open (recurring) |
| 9 | `opening_style_repetition` — general-descriptive opener in 7/10 chapters | Low | Open (recurring) |
| 10 | Golden Age Prototype 1 outcome unknown at time of writing | — | Pending |

---

## 10. Recommendations

### 10.1 Add per-attempt SDK timeout
The current configuration relies entirely on Azure returning an error response. For slow-fail 500s, this takes 2–3 minutes per attempt. Add an `AbortSignal` with a 60-second timeout to each Azure OpenAI SDK call. If the signal fires, treat it as a retryable error and proceed to the next attempt without waiting for the server. This caps the worst-case per-attempt wait without reducing `maxAttempts`.

### 10.2 Clarify blackmail clue placement in Ch6 prompt contract
The clue `"A blackmail threat from the victim's estate manager to Dr. Mallory Finch is found"` has failed first-attempt placement in consecutive runs. The prompt contract's obligation block for Ch6 should add an explicit physical placement instruction: e.g. `"A document (letter, note, or ledger entry) referencing [CLUE] must be directly observed or handled by [DETECTIVE] within this chapter, not merely alluded to."` The word "found" is ambiguous — the LLM stages it for the denouement.

### 10.3 Emit alibi time variants from the narrative outline
Rather than emitting a single canonical time string (e.g. `"half past ten"`), the narrative outline agent should provide 2–3 pre-approved variants (e.g. `"half past ten"`, `"10:30"`, `"thirty minutes past ten"`). AtmosphereRepair will still catch missed instances but will have fewer to fix, and cross-chapter consistency will be stronger.

### 10.4 Fix LLM logging stream initialisation
Inspect `logger.ts` to ensure the file append stream is opened fresh on each process start and is not blocked by a stale handle from a prior session. Add a startup sentinel write (`{"event":"logger_init","timestamp":"..."}`) to `llm.jsonl` immediately on API start. If the sentinel is absent after a clean restart, the logging breakage is confirmed and the stream lifecycle code needs fixing.

### 10.5 Fix identity_role_alias_break in post-reveal chapters
The Ch9 chapter template must resolve all role aliases (`culprit`, `suspect`, `killer`) to the canonical character name before prose generation. Add an explicit substitution pass or a binding in the chapter context: `"In this and all subsequent chapters, refer to the culprit only as [character name], never by role label."`
