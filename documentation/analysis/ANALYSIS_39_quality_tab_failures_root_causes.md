# ANALYSIS 39: Quality Tab Failures — Root Causes

**Date:** 2026-04-04  
**Scope:** Why the Quality tab shows "No quality report available" after all FIX-11/FIX-12 remediations were applied.  
**Constraint:** Analysis only — no code changes.

---

## 1. Investigation Baseline

After the prior session applied startup recovery (`db.ts`), 202 null guard (`api.ts`), ScoreCard null guard, and store.json zombie-status cleanup, the user confirmed quality was still not working. This analysis identifies all remaining causes.

**Confirmed env state:** `.env.local` EXISTS at workspace root and contains `ENABLE_SCORING=true` plus Azure credentials. The API's `index.ts` loads `.env.local` correctly. Previous session analysis that identified this as a root cause was **INCORRECT** — the env loading path is fine.

**Data state at investigation time:**
- `data/store.json`: All projects/runs show `status: "idle"` ✓
- Active projects (most recently run):
  - **Project 10** (`proj_52dbbdf9`): latest run `run_12a82a65` — crashed mid-pipeline, zombie report
  - **Project 11** (`proj_61d18c6e`): latest run `run_d9bee8a5` — aborted at cast stage

---

## 2. Root Cause Summary

| ID | Root Cause | Effect | Scope |
|----|-----------|--------|-------|
| RC-1 | `run_12a82a65.json` on disk has `in_progress: True` | Server returns 409 for Project 10's quality request | Quality tab: Project 10 |
| RC-2 | `@cml/story-validation` NOT in `start-app.bat` build | Stale `report-repository.js` dist; `list()` in_progress filter never compiled | History tab (all projects) |
| RC-3 | No completed full-pipeline report for Project 10 | Even after fixing RC-1, there is no valid report to display | Quality tab: Project 10 |
| RC-4 | Project 11 run aborted at cast stage | Quality shows partial data (2 of N phases); may appear "broken" | Quality tab: Project 11 |
| RC-5 | Server must be restarted to pick up compiled dist changes | Code fixes only take effect after stop/start cycle | All tabs |

---

## 3. Root Cause Details

### RC-1: `run_12a82a65.json` Has `in_progress: True` On Disk

**File:** `apps/api/data/reports/proj_52dbbdf9-f02c-400b-965d-92fee5c53107/run_12a82a65-*.json`  
**Field:** `"in_progress": true`

The worker crashed mid-run and wrote a partial snapshot with `in_progress: True`. The run's `status` in `store.json` has been fixed to `"idle"`. But the physical report file on disk was never updated.

**Server path (when Quality tab is opened for Project 10):**
1. `reportRepo.get(proj_52dbbdf9, run_12a82a65)` → reads file → returns object with `in_progress: true`
2. Server checks `report.in_progress === true` → TRUE
3. `isKnownActiveRun()` → latest run status is `"idle"` → returns **FALSE**
4. `sendLatestValidFallback()` → scans directory → only `run_12a82a65.json` → `in_progress: true` → SKIP → no valid candidate → returns **FALSE**
5. Server emits **409**
6. `fetchScoringReport` throws (409 is not ok)
7. `loadScoringReport` catch runs → `scoringReport.value = null`
8. ScoreCard renders "No quality report available"

**Fix required:** Either patch `run_12a82a65.json` to set `in_progress: false` (with a valid `run_outcome`), OR run a fresh successful pipeline for Project 10 to produce a new non-partial report.

---

### RC-2: `@cml/story-validation` Not Built by `start-app.bat`

**File:** `start-app.bat`

`start-app.bat` builds the following packages in order:
```
@cml/cml
@cml/llm-client
@cml/prompts-llm
@cml/worker
@cml/api
```

`@cml/story-validation` is **absent** from this build sequence.

**Consequence:** Any source-level changes to `packages/story-validation/src/*.ts` are silently ignored at runtime. The Junction `node_modules/@cml/story-validation` → `packages/story-validation/` means the stale `dist/` is what everything imports.

**Filename evidence:**
- `packages/story-validation/src/report-repository.ts` — last modified 11:29:15 (our in_progress list filter)
- `packages/story-validation/dist/report-repository.js` — compiled 08:21:23 (**3 hours 8 minutes before our change**)
- `node_modules/@cml/story-validation/dist/report-repository.js` — same file via junction, same 08:21 timestamp

**Affected code:** Our `list()` change adds:
```typescript
if ((parsed as Record<string, unknown>).in_progress === true) continue;
```
This is only in source. The running server uses the 08:21 compiled version and returns in_progress partial snapshots in history.

**Note:** This only affects the *history* tab's `list()` call, not the `get()` call used by the quality tab. The quality tab's read path is unaffected by this staleness.

---

### RC-3: No Completed Report Exists for Project 10

This is the structural root cause beneath RC-1. Even if RC-1 were patched, Project 10 has **no completed non-partial report** on disk — there is only the single crashed mid-run snapshot.

To display quality data for Project 10, a new full pipeline run must complete successfully. The current partial snapshot cannot be repaired into a meaningful quality report.

---

### RC-4: Project 11 Run Aborted Mid-Pipeline

**Run:** `run_d9bee8a5-60a0-463c-b676-f48113ed0a5d`  
**Outcome:** `run_outcome: "aborted"`, `abort_reason` set, pipeline failed at cast stage

The report file is structurally valid:
- `in_progress: False` ✓
- `passed: False`
- `overall_score: 100` (scores from 2 completed phases averaged)
- `overall_grade: "A"`
- `phases: [Setting Refinement ✓, Cast Design ✓]` — 2 items with real data
- `summary` present ✓
- `total_cost: 0.0005`, `total_duration_ms: 37188`

**Server behavior for Project 11:** `in_progress !== true` → server returns **200** with the full report object. The quality tab **should** render correctly for Project 11 via ScoreCard.

**Why it may still appear broken:** The run aborted at cast stage, so only 2 phases of the expected 7–9 total ran. The user might see a valid-but-partial ScoreCard showing "■ Aborted" and expect more phase data. This is correct behavior, not a bug — but could be misread as "not working."

---

### RC-5: Running Server Must Be Restarted to Pick Up Our Compiled Changes

Several code fixes were compiled in the prior session:
- `apps/api/dist/db.js` — recompiled at 11:36:27 (contains startup recovery)
- `apps/api/dist/server.js` — recompiled at 11:36:27 (contains 409 fallback path)

However, `node dist/index.js` is a static Node.js process. It does not hot-reload compiled files. If the server was started before 11:36:27 and not restarted, the OLD code is still running and none of the FIX-11/FIX-12 server changes are active.

**Check:** If the process was started via `start-app.bat` (which does kill and restart), this is satisfied. If run in a separate terminal and never restarted since our changes, it is not.

---

## 4. Current State vs. Expected State

| Project | Latest Run | Report Status | Quality Tab Expected |
|---------|-----------|--------------|---------------------|
| Project 10 (`proj_52dbbdf9`) | `run_12a82a65` | `in_progress: True` on disk | **409 → "No quality report available"** |
| Project 11 (`proj_61d18c6e`) | `run_d9bee8a5` | `in_progress: False`, aborted, 2 phases | **200 → ScoreCard renders (■ Aborted, 2 phases)** |

Project 11's quality tab should work if the server is running and current. Project 10's quality tab cannot work without a new successful run.

---

## 5. The History Tab Has a Separate Failure

Even if the quality tab is fixed, the history tab has its own remaining issue:

`report-repository.js` (dist, compiled 08:21) does NOT contain our in_progress filter in `list()`. The history endpoint returns all reports including `in_progress: true` partial snapshots. The `fetchScoringHistory` call in `api.ts` does not filter these out. The history tab may show the partial Project 10 snapshot as a "completed" run.

**Fix required:** Build `@cml/story-validation` (add to `start-app.bat` or run manually: `npm run -w @cml/story-validation build`).

---

## 6. Actionable Remediation Steps

In priority order:

1. **Add `@cml/story-validation` to `start-app.bat`** — ensures source changes are compiled on every restart. Without this, story-validation changes are silently invisible to the running server.

2. **Patch `run_12a82a65.json`** — set `in_progress: false` and `run_outcome: "aborted"` on disk so the server stops returning 409 for Project 10. The report will show as aborted with partial data rather than blocking entirely.

3. **Restart server** — after any code compilation, to ensure all compiled changes are active.

4. **Run a new full pipeline for Project 10** — to get a real completed quality report. The patched file from step 2 gives an interim fallback.

5. **Verify Project 11 quality tab** (no code change needed) — it should already show the aborted report once the server is running. If it still doesn't, investigate the frontend's `loadScoringReport` trigger path.

---

## 7. What Was NOT a Root Cause

- **`.env.local` missing**: False. The file exists at workspace root with `ENABLE_SCORING=true` and Azure creds. API loads it correctly.
- **ScoreCard crash on null summary**: Fixed by prior session's null guard `v-if="!report || !report.summary"`.
- **202 in_progress response stored in scoringReport**: Fixed by prior session's `fetchScoringReport` null return guard.
- **Zombie status in store.json**: Fixed in prior session; all projects/runs show `status: "idle"`.
