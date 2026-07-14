# ANALYSIS_31 — Golden Age Prototype 06: Scene-Count Lock Failure at Narrative Stage
*Date: 2026-05-30 | Project: Golden Age Prototype 06 (`proj_da6562ea`) | Model: gpt-4.1-mini*

---

## 1. Context

The primary run for Golden Age Prototype 06 (`run_eb0dd67d`) reached the narrative outline stage — the furthest the pipeline had progressed in this project — before failing on a scene-count lock violation during pre-commit remediation. This document records the failure, its root cause, and regression status against known-good runs.

**Run covered:**

| Run ID (short) | Events | Last step recorded | Failure mode |
|----------------|--------|--------------------|--------------|
| `run_eb0dd67d` | 49 | `pipeline_error` | Scene-count lock: remediation changed 9 → 10 scenes |

No scoring report was saved (the report endpoint's `in_progress` fallback was active for this session; a server-side fix was applied during this session to allow partial reports through).

---

## 2. Run Detail: `run_eb0dd67d` — Scene-Count Lock Failure

### 2.1 Full pipeline timeline

This was the most complete run — 49 events, all stages through to narrative:

| Stage | Events | Result |
|-------|--------|--------|
| Setting (Agent1) | ✅ | Refined |
| Cast (Agent2) | ✅ | 5 characters designed |
| Background context (Agent2e) | ✅ | Generated |
| Hard logic devices (Agent3b) | ✅ | 5 novel devices |
| CML structure (Agent3) | ✅ | Generated and validated |
| Novelty check | ✅ | Skipped (threshold ≥ 1.0) |
| Clues (Agent5) | ✅ | 17 clues distributed; discriminating test seeded |
| Fair play audit | ✅ | PASS; blind reader simulation PASS |
| Character profiles (Agent6) | ✅ | 5 profiles |
| Location profiles | ✅ | 4 locations |
| Temporal context | ✅ | October 1943 |
| World builder (Agent65) | ✅ | World document complete |
| Narrative / outline (Agent7) | ❌ | **FAILED** |

### 2.2 Failure: scene-count lock

```
Pipeline failed: Mystery generation failed:
Outline pre-commit remediation failed scene-count lock:
scene-count changed (10 != 9).
```

**Sequence of events in the narrative stage:**
1. Agent7-NarrativeFormatter produced an initial outline: **9 scenes, ~20 100 words**.
2. The pipeline detected completeness gaps and triggered **bundled remediation** ("fixing outline completeness gaps").
3. Remediation ran and the resulting outline had **10 scenes**.
4. The pre-commit scene-count lock checked `actual (10) != locked (9)` and **aborted the run**.
5. All prior artifacts were persisted as partial snapshots (`*_partial_done` events for every completed stage).

The `run_failed` event appears in the event log *before* the profile completion events, indicating that partial persistence ran concurrently/sequentially with the error handler while the story compilation was still writing its results. This ordering is expected; it does not indicate a second failure.

### 2.3 LLM log: Agent7 retries

The LLM log shows multiple WorldBuilder / NarrativeFormatter pairs (many attempts) spanning roughly 09:27–09:48 (based on today's log timestamps). The formatter made several two-call passes (request → response × 2) before the final attempt that triggered remediation. All calls returned `ok=True` from the model — the failure was in the post-processing validation gate, not in the LLM itself.

### 2.4 Root cause analysis

The pre-commit scene-count lock enforces `actual == locked` strictly. However, **the bundled remediation step is explicitly designed to add or restructure scenes** when completeness gaps are detected. These two mechanisms are in direct conflict:

- If remediation needs to add a scene to cover a gap → scene count changes → lock fires → failure.
- The lock was presumably introduced to prevent an LLM from arbitrarily changing a settled scene structure, which is a valid concern.

**The gap:** The lock does not distinguish between a remediation-driven change (legitimate) and an unprompted LLM drift (illegitimate).

---

## 3. Agent2 Cast Over-Count (Non-Fatal Warning)

During an earlier session the API terminal showed:

```
Attempt 1: Final attempt — expected 5 characters, got 6. Padding with placeholders.
```

Agent2-CastDesigner returned a 6-character cast when the spec called for 5. The retry/fallback pathway handled this by padding (truncating to 5). The run continued. This is a known non-fatal validation issue; the workaround works but the output cast may include a placeholder character rather than a coherently designed one.

---

## 4. No Partial Quality Scores Available

The Quality tab showed "Awaiting scoring data" because the report endpoint was returning the prior run's complete report (with `stale: true`) whenever the current run's in-progress partial report existed. Guard 2 in `loadScoringReport` correctly blocked stale reports, leaving the tab empty.

**Fix applied this session:** `apps/api/src/server.ts` was changed to return partial (`in_progress: true`) reports directly rather than falling back to the old run's report. The client was updated with:
- Corrected placeholder text: "Generating — scores for each stage will appear here as they complete."
- Amber banner shown when a partial report is displayed: "Partial scores — updating as each stage completes."

---

## 5. Regression Check vs. Known-Good Runs

Reference baselines: `mystery-1779998607579` (28 May, 10/10 chapters, completed), `run_668d76eb` (29 May, 20/20 chapters, 97/100, failed only at story validation gate).

### 5.1 Pipeline stages 1–8 — No regression detected

Every stage that ran to completion in `run_eb0dd67d` behaved identically to reference runs:

| Stage | Reference | run_eb0dd67d | Status |
|-------|-----------|--------------|--------|
| Setting (Agent1) | ✅ | ✅ | ✓ |
| Cast (Agent2) | ✅ | ✅ | ✓ |
| Background context (Agent2e) | ✅ | ✅ | ✓ |
| Hard logic devices (Agent3b) | ✅ | ✅ | ✓ |
| CML structure (Agent3) | ✅ | ✅ | ✓ |
| Clues (Agent5) — discriminating test seed | ✅ | ✅ | ✓ |
| Fair play gate | PASS | PASS | ✓ |
| Character profiles (Agent6) | ✅ | ✅ | ✓ |
| Location profiles | ✅ | ✅ | ✓ |
| Temporal context | ✅ | ✅ | ✓ |
| World builder (Agent65) | ✅ | ✅ | ✓ |

No quality degradation observed in the stages that ran. The pipeline is healthy up to and including the world-document stage.

### 5.2 Scene-count lock: mode shift from ANALYSIS_30, not a regression

ANALYSIS_30 documented that the remediation path was **blocked by a `retriesEnabled` guard**, meaning remediation never ran and the pipeline threw immediately. That guard was subsequently removed (current `agent7-run.ts` line ~1248: *"Run unconditionally regardless of retriesEnabled"*). ANALYSIS_30's fix is correctly in place.

The current failure is **different**: remediation now runs successfully, but the LLM **ignores the scene-count guardrails** embedded in the remediation prompt and adds a 10th scene anyway. This is a new failure mode introduced by unblocking the remediation path — the guard prevented both the success case and this new failure. It is not a regression from a previously working state; it is a forward-failure in code that was previously gated off.

**Specifically**, the remediation prompt includes `buildNarrativeSceneCountGuardrails(sceneCountLock, ...)` which instructs: *"keep EXACT total scene count at 9"* and per-act counts. The LLM received this instruction and still returned 10 scenes, indicating the guardrail is insufficiently weighted relative to the completeness task.

### 5.3 llm-client bugs from ANALYSIS_29 — NOT fixed (regressions)

ANALYSIS_29 (29 May) documented two silent bugs as "identified and fixed." The current source does not contain either fix:

**RateLimiter token index corruption (`packages/llm-client/src/ratelimit.ts` line 19):**
```typescript
// Current (buggy):
this.requestTimestamps = this.requestTimestamps.filter((ts) => ts > oneMinuteAgo);
this.tokenCounts = this.tokenCounts.filter((_, i) => this.requestTimestamps[i] !== undefined);
// ↑ requestTimestamps has already been shortened before tokenCounts is filtered,
//   so index i in the second filter maps to the wrong (non-expired) entry.
```
The `keep`-mask fix described in ANALYSIS_29 is absent. Token-per-minute rate limit calculations remain silently incorrect in long sessions.

**CostTracker gpt-4.1-mini pricing (`packages/llm-client/src/cost-tracker.ts` line 30):**
```typescript
// Current (buggy — no isGpt41Mini branch):
const isGpt4oMini = modelName.includes("gpt-4o-mini") || modelName.includes("4o-mini");
const isGpt4o    = !isGpt4oMini && (modelName.includes("gpt-4o") || modelName.includes("4o"));
// "gpt-4.1-mini" matches neither → falls through to GPT-3.5 pricing
```
`gpt-4.1-mini` does not contain the substring `"4o"` or `"4o-mini"`, so both flags are false and the GPT-3.5 fallback rates are used. All `estimatedCost` values in `llm.jsonl` for today's runs are therefore incorrect (GPT-3.5 rates applied to a GPT-4.1-mini model).

Both of these bugs should be considered open items. Their absence from the source suggests either the fixes were not committed, were lost in a subsequent overwrite, or the ANALYSIS_29 text described intended fixes that were not applied.

### 5.4 Agent2 cast over-count — intermittent, pre-existing

The "expected 5 characters, got 6. Padding with placeholders" warning appeared during this session. This is an intermittent LLM over-generation. It is not new: the padding path has existed for several sessions and the output is handled non-fatally. No reference run shows this as a hard failure. Not a regression.

---

## 6. Open Issues

| # | Issue | Priority | % Likelihood to improve scores |
|---|-------|----------|---------------------------------|
| 1 | **Scene-count lock vs. remediation conflict** — remediation legitimately adds scenes but the lock hard-fails on any scene count change. Fix: either (a) suppress the scene-count lock during a remediation pass, or (b) allow the lock a ±1 tolerance only when the remediation flag is active. | High | **90%** |
| 2 | **Agent2 cast over-count** — LLM returns N+1 characters despite explicit spec. Add a pre-validation schema constraint on cast array length and enforce it before the placeholder-padding path so it triggers a retry instead. | Medium | **65%** |
| 3 | **llm-client RateLimiter index corruption** — `keep`-mask fix from ANALYSIS_29 not present in source; token-per-minute calculations silently incorrect in long sessions. | Medium | **15%** |
| 4 | **llm-client CostTracker gpt-4.1-mini pricing** — model falls through to GPT-3.5 rates; all cost log entries for this model are understated. Add `isGpt41Mini` detection before `isGpt4oMini`. | Low | **5%** |
| 5 | **No `createdAt` timestamps on runs** — All run records in `store.json` have `createdAt: null`, making chronological ordering of runs impossible. | Low | **5%** |

---

## 7. Fix Progress Summary

### 7.1 Session fixes (this session) — applied ✅

| Fix | Source change | Status |
|-----|---------------|--------|
| Partial quality scores (Section 4) | `apps/api/src/server.ts` — return `in_progress` reports directly | ✅ 100% working |
| Remediation guard removal (Section 5.2) | `agent7-run.ts` — remediation now runs unconditionally | ✅ 100% applied (unblocked path; exposed Issue #1) |

### 7.2 Open issues — score improvement likelihood

| Issue # | Description | Blocking? | % Likelihood to improve scores | Rationale |
|---------|-------------|-----------|--------------------------------|-----------|
| 1 | Scene-count lock vs. remediation | **Yes** — hard abort | **90%** | Fix unblocks pipeline completion; remediation pass then closes the completeness gaps that directly lower outline/clue-coverage scores |
| 2 | Agent2 cast over-count | No — padding fallback | **65%** | Placeholder characters degrade character-profile quality scores; a retry gate would replace them with coherent LLM-designed cast members |
| 3 | RateLimiter index corruption | No — silent miscalculation | **15%** | Token-rate miscounting can cause unnecessary mid-session waits but does not corrupt output content; small chance of preventing timeout-related partial responses in very long sessions |
| 4 | CostTracker gpt-4.1-mini pricing | No — log inaccuracy only | **5%** | Purely a cost-reporting fix; no effect on LLM calls or output quality |
| 5 | No `createdAt` on runs | No — UX / ordering only | **5%** | Purely a data completeness fix; no effect on pipeline or quality |

**Overall fix completion: 2/7 known issues resolved (29%) — both are session-scope fixes applied during this session. 0/5 open issues resolved.**
