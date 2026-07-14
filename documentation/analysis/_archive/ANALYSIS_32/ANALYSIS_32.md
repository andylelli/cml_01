# ANALYSIS_32 — Project 37: Immediate Cast Schema Abort
*Date: 2026-05-30 | Project: Project 37 (`proj_c2a0baa9`) | Run: `run_95b2eea2` | Model: gpt-4.1-mini*

---

## 1. Context

This analysis covers the latest run after store/log cleanup. The run failed early at Agent2 (cast design) with a schema enum violation and terminated before downstream generation stages.

**Run covered:**

| Run ID (short) | Events | Last step recorded | Failure mode |
|----------------|--------|--------------------|--------------|
| `run_95b2eea2` | 10 | `pipeline_error` | Cast schema enum mismatch (`motiveStrength = "N/A"`) |

---

## 2. Run Detail

### 2.1 Event timeline

| Seq | Step | Message |
|-----|------|---------|
| 1 | `run_started` | Pipeline run started |
| 2 | `pipeline_started` | Starting mystery generation pipeline |
| 3 | `setting` | Refining era and setting... |
| 4 | `setting` | Era and setting refined |
| 5 | `cast` | Designing cast and motives... |
| 6 | `setting_partial_done` | Partial setting artifact persisted after failure |
| 7 | `cast_partial_done` | Partial cast artifact persisted after failure |
| 8 | `pipeline_failure_snapshot_done` | Failure snapshot persisted |
| 9 | `pipeline_error` | Pipeline failed: Cast artifact failed schema validation ... |
| 10 | `run_failed` | Pipeline failed |

### 2.2 Concrete schema failure evidence

From the persisted cast artifact:

- Character count: `5`
- Character #5: `Helen Ogden`
- Role: `Police Detective / Inspector`
- Offending value: `motiveStrength = "N/A"`

Failure snapshot errors:

1. `Cast schema failure: characters[4].motiveStrength must be one of [weak, moderate, strong, compelling], got "N/A"`
2. `Pipeline failure: Cast artifact failed schema validation (deterministic mode: schema retry disabled): ...`

---

## 3. Why It Failed Immediately

Root cause is a contract mismatch under deterministic mode:

1. Agent2 generated a near-miss enum value (`"N/A"`) for `motiveStrength`.
2. `cast_design` schema requires strict enum values only: `weak|moderate|strong|compelling`.
3. Pre-Agent9 retry path was disabled (`deterministic mode`), so schema-repair retry did not execute.
4. The worker hard-aborted at Agent2 validation.

So this was not a model timeout issue; it was a strict validation + no-retry policy collision with a common LLM enum drift value.

---

## 4. Data Limitations During This Analysis

`logs/llm.jsonl` had been deleted during cleanup, so per-call request/response latency evidence for this specific run was unavailable in file logs.

This analysis therefore relies on:

- `data/store.json` run events
- persisted `cast` artifact payload
- persisted `pipeline_failure_snapshot` artifact payload

---

## 5. Post-Run Remediation Implemented

The issue has been fixed in code after this run.

### 5.1 Prompt/output layer hardening

`packages/prompts-llm/src/agent2-cast.ts`

Added enum sanitization before validation/final return for:

- `motiveStrength`
- `accessPlausibility`
- `gender`
- relationship `tension`

Also aligned `CharacterProfile.gender` type with schema (`male|female|non-binary`).

### 5.2 Worker pre-validation hardening

`apps/worker/src/jobs/agents/agent2-run.ts`

Added defensive normalization before `validateArtifact("cast_design", ...)` for the same enum set:

- `motiveStrength`
- `accessPlausibility`
- `gender`
- relationship `tension`

This prevents deterministic-mode hard aborts on common enum near-misses.

---

## 6. Expected Impact

| Area | Before | After |
|------|--------|-------|
| Cast enum drift (`N/A`, `likely`, etc.) | Immediate run abort possible | Normalized to valid schema values |
| Deterministic mode robustness | Fragile to minor enum drift | Resistant to common enum drift |
| Story-type/parameter coverage | Narrow (exact output only) | Broad (sanitization is parameter-agnostic) |

Confidence that this specific failure class is addressed: **high**.

---

## 7. Verification Plan (Next Run)

1. Start a fresh run with same model (`gpt-4.1-mini`) and normal parameters.
2. Confirm Agent2 reaches `cast designed` and no `motiveStrength` enum abort occurs.
3. If any new schema enum mismatch appears, extend the same sanitizer pattern to that field immediately.

---

## 8. Summary

`run_95b2eea2` failed quickly because Agent2 produced `motiveStrength = "N/A"` and deterministic mode skipped schema-repair retry.

A dual-layer enum sanitization fix is now implemented for all cast enum fields most likely to drift. This should eliminate this immediate-abort class across story types and parameter combinations.