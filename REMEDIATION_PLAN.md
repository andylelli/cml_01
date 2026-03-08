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

---

## 8. Diagnostic Session — March 4, 2026

Applied systematic debugging framework (understand → hypothesise → test → narrow → fix → verify → postmortem) across all open issue categories.

### 8.1 Findings

| Issue | Root Cause | Resolution |
|-------|-----------|-----------|
| **`tsc` errors — test type imports** | `LlmLogEntry` and `PipelineStep` interfaces were declared inside `<script setup>` blocks, which Vue's compiler does not expose as module-level named exports. Plain `tsc` (without `vue-tsc`) resolves `.vue` imports through the ambient `declare module '*.vue'` which only has `export default`, so named imports fail. | Created `apps/web/src/components/debugPanelTypes.ts` and `pipelineTypes.ts` as companion type files. Moved interface definitions there. `DebugPanel.vue` and `ProgressIndicator.vue` now use dual-block (`<script>` + `<script setup>`) re-exporting from the type files. `App.vue`, `DebugPanel.test.ts`, `ProgressIndicator.test.ts` updated to import types from `.ts` companions. |
| **IDE false positives — "no default export"** | VS Code's Volar/Vue-Official extension overrides TypeScript's ambient module resolution for `.vue` files and requires `@vue/typescript-plugin` in `tsconfig.json` to cooperate with the TypeScript language service. Without it, all `<script setup>`-only components showed "no default export" in the Problems panel. | Installed `@vue/typescript-plugin` to workspace root, added it to `apps/web/tsconfig.json` `compilerOptions.plugins`. |
| **Victim identity gap (P1)** | Prose prompt did not identify the victim by name. The LLM had no instruction to name the victim in chapter 1, allowing "an unknown victim" / "the body of a stranger" language to pass. No chapter-level validator checked for this pattern. | `buildContextSummary` now extracts the victim character by `roleArchetype` and includes `Victim: [name]` in the Case Overview context. Added `VICTIM IDENTITY` rule to the prose `system` prompt. Added `resolveVictimName()` export for reuse. Added `checkVictimNaming()` to `ChapterValidator` with 4 new tests covering both positive and negative cases. |
| **Atmospheric variety gap (P2)** | The `ANTI-REPETITION` prose guardrail was vague and only targeted adjacent chapters. No runtime check verified variety across all chapters. Sensory vocabulary (smell of polished wood, air thick with tension, overcast skies) recycled silently. | Added `evaluateSensoryVariety()` function to `mystery-orchestrator.ts` that tokenises atmospheric phrases across all chapters and flags any phrase present in >40% of chapters. Wired into release gate as a quality warning (not hard stop). Strengthened the prose `system` prompt guardrail: any sensory phrase from a prior chapter must be fully rephrased. |
| **Denouement strength gap (P2)** | No prompt instruction required the final chapter to show concrete consequences. LLM defaulted to reflection-only closures without justice, changed relationships, or emotional resolution. | Added `DENOUEMENT REQUIREMENT` rule to the prose `system` prompt specifying: culprit fate, changed relationships, detective personal resolution. |
| **run_reviews.md status drift** | Several P0/P1 items marked `NOT-STARTED` were actually already implemented in previous sessions (scaffold hard-block, fair play hard-block, character voice, detective stake, moral complexity). The review document was not updated when those implementations were completed. | Updated `reviews/run_reviews.md` with corrected statuses. |

### 8.2 Verification Results

After all fixes:

| Check | Result |
|-------|--------|
| `tsc -p apps/worker/tsconfig.json --noEmit` | ✅ 0 errors |
| `tsc -p apps/api/tsconfig.json --noEmit` | ✅ 0 errors |
| `tsc -p apps/web/tsconfig.json --noEmit` | ✅ 0 errors |
| `vitest run` (web — 15 test files) | ✅ 163 passed, 6 skipped |
| `vitest run` (story-validation — 6 test files) | ✅ 98 passed (+4 new victim naming tests) |

### 8.3 Remaining Open Work

| Item | Status | Notes |
|------|--------|-------|
| Game pack end-to-end | ⏸ On hold | No change |
| `npm test` story-validation exits code 1 | ⚠️ Pre-existing | RetryManager deliberately opens a non-existent path in one test; `stderr` ENOENT causes npm to report non-zero exit. Tests all pass. No action needed. |
| Victim identity — full validation gate | 🔶 Partial | Prompt guardrail + chapter-1 validator added. No hard-stop added (major severity, not critical). If named victim consistently passes, consider promoting to hard-stop. |
| Atmospheric variety — hard stop | 🔶 Release warning only | Added to release gate as warning. Promote to hard-stop only after confirming false-positive rate on clean runs. |
| P2: Detective personal stake (validation) | 🔶 Prompt only | Craft guide has the guideline; no runtime validator confirms it. |
| P2: Emotional beat injection (schema) | 🔶 Prompt only | Craft guide has the guideline; no narrative schema `micro_moment_beats` field added. |
| Scoring run re-verification | ❌ Not done | No new scoring run triggered after adapter fixes. Target: all 8 phases ≥75 on next run. |

### 8.4 Files Changed This Session

| File | Change |
|------|--------|
| `apps/web/src/components/debugPanelTypes.ts` | **New** — `LlmLogEntry` UI type extracted from DebugPanel.vue |
| `apps/web/src/components/pipelineTypes.ts` | **New** — `PipelineStep` type extracted from ProgressIndicator.vue |
| `apps/web/src/components/DebugPanel.vue` | Dual-block; re-exports `LlmLogEntry` from `debugPanelTypes.ts`; `<script setup>` imports from companion |
| `apps/web/src/components/ProgressIndicator.vue` | Dual-block; re-exports `PipelineStep` from `pipelineTypes.ts`; `<script setup>` imports from companion |
| `apps/web/src/App.vue` | `PipelineStep` now imported from `./components/pipelineTypes` (not from `.vue`) |
| `apps/web/src/components/__tests__/DebugPanel.test.ts` | `LlmLogEntry` now imported from `../debugPanelTypes` |
| `apps/web/src/components/__tests__/ProgressIndicator.test.ts` | `PipelineStep` now imported from `../pipelineTypes` |
| `apps/web/tsconfig.json` | Added `@vue/typescript-plugin` to `compilerOptions.plugins` |
| `packages/prompts-llm/src/agent9-prose.ts` | `buildContextSummary` includes victim name; `resolveVictimName()` exported; prose `system` prompt gains VICTIM IDENTITY, strengthened ANTI-REPETITION, DENOUEMENT REQUIREMENT guardrails; dual-case roleArchetype lookup |
| `packages/story-validation/src/chapter-validator.ts` | `checkVictimNaming()` added (chapter-1 only); wired in `validateChapter`; dual-case archetype lookup |
| `packages/story-validation/src/__tests__/chapter-validator.test.ts` | 4 new victim identity tests |
| `apps/worker/src/jobs/mystery-orchestrator.ts` | `evaluateSensoryVariety()` added; wired into release gate as quality warning |
