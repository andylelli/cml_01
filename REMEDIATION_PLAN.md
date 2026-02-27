# CML Remediation Plan

> Generated from a full audit of save/reload correctness, validation pipeline gaps,
> History/Quality UI, prose configuration, and real-time prose feedback.

---

## 1. Bugs Fixed This Session

| # | Issue | Root Cause | Fix Applied |
|---|-------|-----------|------------|
| 1 | **Projects dropdown empty** | `process.cwd()` resolved to `apps/api/` when the API was launched via npm workspaces, so the default store path became `apps/api/data/store.json` (empty file) instead of the root `data/store.json`. | Added `CML_JSON_DB_PATH=C:\CML\data\store.json` to `.env.local`. |
| 2 | **Spec not restored on project load** | No `GET /api/projects/:id/specs/latest` endpoint existed; `handleLoadProject` only fetched project metadata, not the saved spec. | Added the endpoint to `server.ts`, added `fetchLatestSpec()` to `api.ts`, and updated `handleLoadProject` in `App.vue` to call it and merge the spec back. |
| 3 | **4 phantom 404s on every project load** | `projectStore.ts` called `fetchSettingValidation`, `fetchCastValidation`, `fetchCluesValidation`, and `fetchOutlineValidation`, but the pipeline never wrote these artifacts, guaranteeing four 404s per load. These 404s were included in the failure counter, which pushed healthy projects into an incorrect `"error"` status. | Removed the four dead fetches from `projectStore.ts` as a first-pass fix. (Proper fix: items 4–5 below.) |
| 4 | **Validation artifacts never saved by pipeline** | `runPipeline()` in `server.ts` called `generateMystery()` and saved the returned fields, but never saved `setting_validation`, `cast_validation`, `clues_validation`, or `outline_validation`. The orchestrator computed the underlying data (realism checks, stereotype checks, inference-coverage gaps, outline-coverage gaps) but only surfaced them as `warnings[]` strings, not as persisted artifacts. | Added four `createArtifact` calls in `runPipeline()` that derive each validation artifact from data already present in the `MysteryGenerationResult`: see details in §3. |
| 5 | **Validation panel always shows "valid"** | After fix 3 removed the fetches, `allValidation` defaulted to `{ valid: true }` for all four items, hiding real issues. | Restored the four fetches in `projectStore.ts` and updated `allValidation.value` to use the real artifact payloads (falls back to the valid default only if the artifact is genuinely absent, e.g. on legacy projects). |
| 6 | **No per-chapter progress events without scoring** | When `ENABLE_SCORING=false` (the default), `generateProse` was called without `onBatchComplete`, so the run history panel showed no chapter-level progress during prose generation. | Added an `onBatchComplete` callback to the non-scoring branch of the prose call in `mystery-orchestrator.ts`. Each completed chapter now emits a `reportProgress("prose", ...)` event, which the server converts to a run event visible in the History tab. |

---

## 2. How Validation Artifacts Are Now Derived

The orchestrator does not explicitly return validation sub-results for setting, cast, clues, and outline. The pipeline data is rich enough to derive them in `runPipeline()` without modifying the orchestrator interface:

### `setting_validation`
```
result.setting.setting.realism.anachronisms[]   → error strings
result.setting.setting.realism.implausibilities[] → error strings
valid = both arrays empty
```

### `cast_validation`
```
result.cast.cast.diversity.stereotypeCheck[] → error strings
result.cast.cast.diversity.recommendations[] → warning strings
valid = stereotypeCheck empty
```

### `clues_validation`
```
result.warnings[] filtered for lines starting with:
  "Inference coverage:"  or  "Agent 5: Guardrail"
Lines containing "[critical]" → errors
Remaining filtered lines     → warnings
valid = no critical lines
```

### `outline_validation`
```
result.warnings[] filtered for lines starting with "Outline coverage gap:"
All matching lines → warnings (none escalated to errors)
valid = no matching lines
```

All four artifacts are saved with type `setting_validation`, `cast_validation`, `clues_validation`, `outline_validation` respectively, matching the existing API routes and frontend fetch functions.

---

## 3. Open Work — Implemented This Session

### 3.1 Prose Batch Size Configurable via YAML / Spec

**Status:** ✅ Implemented.

**Changes made:**
1. Added `proseBatchSize?: number` to `MysteryGenerationInputs` in `mystery-orchestrator.ts`.
2. Added `proseBatchSize` passed from `specPayload?.proseBatchSize` in `runPipeline()` (`server.ts`).
3. Added `batchSize?: number` to `ProseGenerationInputs` in `packages/prompts-llm/src/agent9-prose.ts`.
4. Refactored `generateProse` — the per-chapter loop is now batch-aware: scenes are chunked into groups of `batchSize` and each group is sent to the LLM in a single call. Each chapter in the batch is validated individually; if any fail, the whole batch retries (max 2 attempts).
5. Added `proseBatchSize` number input (1–10, default 1) to the spec form in `App.vue`.
6. `batchSize` passed to all 4 `generateProse` call sites: scoring branch, non-scoring branch, identity alias retry, and prose repair retry.

---

### 3.2 Real-Time Per-Chapter Validation Details in UI

**Status:** ✅ Implemented.

**Changes made:**
1. `onBatchComplete` in `agent9-prose.ts` now passes `lastBatchErrors` as a fourth argument — these are the validation issues from any failed attempts for the batch.
2. `ProseGenerationInputs.onBatchComplete` signature updated to `(chapters, batchStart, batchEnd, validationIssues: string[])`.
3. Both orchestrator `onBatchComplete` handlers (scoring and non-scoring) updated to accept and emit the 4th arg: when `validationIssues.length > 0`, a `⚠ Chapter N required retry — M issue(s): …` `reportProgress("prose", …)` event is emitted, which the server converts to a run event visible in the History tab.

---

### 3.3 Prose Repair Retry — Missing onBatchComplete

**Status:** ✅ Implemented.

**Changes made:**
- Added `onBatchComplete` callback (and `batchSize`) to both the **prose repair retry** `generateProse` call and the **identity alias retry** `generateProse` call in `mystery-orchestrator.ts`. Both now emit `[Repair]` / `[Identity fix]` chapter progress events during regeneration.

---

### 3.4 Validation Artifacts for Legacy Projects

**Status:** ✅ Migration script created.

**Location:** `apps/api/src/scripts/migrate-validation-artifacts.ts`

**Usage:**
```bash
cd apps/api
npx tsx src/scripts/migrate-validation-artifacts.ts
```

- Iterates all projects in the store.
- For each project, checks for the four validation artifacts.
- `setting_validation` / `cast_validation` — derived from the existing `setting` / `cast` artifacts (realism and diversity sub-objects).
- `clues_validation` / `outline_validation` — set to `{ valid: true, errors: [], warnings: [], note: "Migrated — assuming passed" }` since the original pipeline warnings are not stored in the DB.
- Idempotent — projects that already have all four artifacts are untouched.

---

## 4. Quality UI Audit — No Bugs Found

All Quality tab components were audited:

| Component | Status | Notes |
|-----------|--------|-------|
| `RunHistory.vue` | ✅ Correct | Simple event list, wired correctly via `latestRunId` |
| `ScoreCard.vue` | ✅ Correct | Shows grade, score, pass/fail; correctly renders "no report" when `ENABLE_SCORING=false` |
| `PhaseBreakdownTable.vue` | ✅ Correct | Used with `scoringReport.phases` |
| `ScoreTrendChart.vue` | ✅ Correct | Only rendered when `scoringHistory.length >= 2` — correct guard |
| `loadScoringReport()` | ✅ Correct | Called when quality tab is opened and after run completion |
| `loadScoringHistory()` | ✅ Correct | Called when quality tab is opened and after run completion |

The Quality tab is entirely dependent on `ENABLE_SCORING=true` being set in `.env.local`. This is documented in the UI and in `README.md`. No issues found.

---

## 5. Save / Reload Completeness Audit

After all fixes, the following data is correctly saved on pipeline completion and restored on project load:

| Artifact | Saved by Pipeline | Restored on Load |
|----------|------------------|-----------------|
| `setting` | ✅ | ✅ |
| `setting_validation` | ✅ *(new)* | ✅ *(new)* |
| `cast` | ✅ | ✅ |
| `cast_validation` | ✅ *(new)* | ✅ *(new)* |
| `background_context` | ✅ | ✅ |
| `hard_logic_devices` | ✅ | ✅ |
| `cml` | ✅ | ✅ |
| `cml_validation` | ✅ (CML validate route) | ✅ |
| `character_profiles` | ✅ | ✅ |
| `location_profiles` | ✅ | ✅ |
| `temporal_context` | ✅ | ✅ |
| `synopsis` | ✅ | ✅ |
| `clues` | ✅ | ✅ |
| `clues_validation` | ✅ *(new)* | ✅ *(new)* |
| `fair_play_report` | ✅ | ✅ |
| `outline` | ✅ | ✅ |
| `outline_validation` | ✅ *(new)* | ✅ *(new)* |
| `novelty_audit` | ✅ (conditional) | ✅ |
| `prose_{length}` | ✅ | ✅ |
| `game_pack` | ⏸ On hold | ⏸ On hold |
| **Spec** | ✅ (via `/specs`) | ✅ *(new — added this session)* |

---

## 6. Priority Order for Remaining Work

| Priority | Task | Effort | Status |
|----------|------|--------|--------|
| High | §3.3 — Add `onBatchComplete` to prose repair retry | Low | ✅ Done |
| Medium | §3.2 — Stream per-chapter validation errors in real-time | Medium-High | ✅ Done |
| Medium | §3.1 — Prose batch size configurable via YAML/spec | Medium | ✅ Done |
| Low | §3.4 — Migration script for legacy validation artifacts | Low | ✅ Done |
| Backlog | Game pack end-to-end (on hold) | TBD | ⏸ On hold |

---

## 7. Files Changed

| File | Change |
|------|--------|
| `c:\CML\.env.local` | Added `CML_JSON_DB_PATH=C:\CML\data\store.json` |
| `apps/api/src/server.ts` | Added `GET /api/projects/:id/specs/latest` endpoint; added 4 `createArtifact` calls for validation artifacts; added `proseBatchSize` passthrough |
| `apps/web/src/services/api.ts` | Added `fetchLatestSpec()` |
| `apps/web/src/App.vue` | Restored spec on project load via `fetchLatestSpec`; added `proseBatchSize` spec field and UI input (1–10) |
| `apps/web/src/stores/projectStore.ts` | Restored 4 validation fetch imports and calls; updated `allValidation.value` to use real payloads |
| `apps/worker/src/jobs/mystery-orchestrator.ts` | Added `proseBatchSize` to `MysteryGenerationInputs`; updated scoring/non-scoring `onBatchComplete` to 4-arg; added `batchSize` + `onBatchComplete` to identity-alias retry and repair retry `generateProse` calls; validation issue events emitted |
| `packages/prompts-llm/src/agent9-prose.ts` | Added `batchSize?: number` to `ProseGenerationInputs`; updated `onBatchComplete` to 4-arg signature; refactored `generateProse` loop to be batch-aware (batchSize scenes per LLM call, per-chapter validation, batch retry) |
| `apps/api/src/scripts/migrate-validation-artifacts.ts` | New script — §3.4 one-time migration for legacy validation artifacts |
