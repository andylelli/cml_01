# Quality Tab: Info Process and Display — Step-by-Step Reference

This document traces the complete lifecycle of quality data: from its creation in the scoring pipeline, through the API, to the browser UI.

---

## 1. Access Requirements

The Quality tab is a sub-tab within the **Advanced** main tab. It is only visible when the user has enabled **Advanced mode** (or Expert mode). The Advanced tab itself is disabled until at least one of those modes is active.

Tab definition (App.vue):
```typescript
const advancedTabs = computed<Tab[]>(() => [
  { id: "cml", label: "CML" },
  { id: "artifacts", label: "Artifacts" },
  { id: "logs", label: "LLM Logs" },
  { id: "samples", label: "Samples" },
  { id: "history", label: "History" },
  { id: "quality", label: "Quality" },  // <-- this tab
]);
```

---

## 2. Where Quality Data Comes From (Pipeline Side)

### Step 2.1 — Worker generates the `GenerationReport`

During a pipeline run, the worker (agent9 / scoring orchestrator) evaluates the generated story against a scoring rubric. It creates a `GenerationReport` JSON object with:

- `run_id` — matches the run that produced this story
- `overall_score` (0–100) and `overall_grade` (A–F)
- `passed` (boolean) — true if score meets the threshold
- `run_outcome` — `"passed"` | `"failed"` | `"aborted"` | `"infra_failure"`
- `phases: ScoringPhaseReport[]` — one entry per pipeline agent that was scored
- `summary` — `{ phases_passed, phases_failed, total_phases, pass_rate, weakest_phase, strongest_phase }`
- `total_duration_ms`, `total_cost`, `generated_at`
- `threshold_config: { mode }` — scoring mode used

### Step 2.2 — Report is written to disk

The `FileReportRepository` writes the report to:
```
apps/api/data/reports/{projectId}/{runId}.json
```

Partial/in-progress reports may be written after each agent phase (when `savePartialReport()` is called), so data can appear incrementally before the run finishes.

### Step 2.3 — Orphan recovery on server restart

When the API server starts, it scans all projects for any run still marked `"running"`. If found (i.e., the server was killed mid-pipeline), it resets the run status to `"idle"`. This prevents the scoring endpoint from indefinitely blocking report delivery.

---

## 3. API Routes

### 3.1 — Single run report

```
GET /api/projects/:projectId/runs/:runId/report
```

Handler behaviour:
1. Calls `getReportRepository()` which searches candidate directories for `apps/api/data/reports`
2. Looks up `{projectId}/{runId}.json` via `FileReportRepository.get()`
3. If report not found → tries a **fallback**: scans the project's report directory for the most recent completed report (or partial if none), and serves it with `stale: true` + `stale_reason`
4. If the found report has `in_progress: true` → attempts the same fallback
5. Returns the report JSON with 200, or 404 if nothing at all is available

Client-side (`fetchScoringReport` in api.ts):
```typescript
GET /api/projects/${projectId}/runs/${runId}/report
```
- 202 response → returns `null` (run still in progress — not yet written)
- Non-ok response → throws error
- `data.status === "in_progress"` → returns `null` (partial snapshot, not usable yet)
- Otherwise returns the report object

### 3.2 — History (last N reports)

```
GET /api/projects/:projectId/reports/history?limit=N
```

Returns the most recent N `GenerationReport` objects for the project, sorted newest first (default limit = 10, max = 100).

Client-side (`fetchScoringHistory` in api.ts):
```typescript
GET /api/projects/${projectId}/reports/history?limit=${limit}
```
Returns `data.reports` array.

### 3.3 — Aggregate stats

```
GET /api/reports/aggregate
```

Used by `fetchScoringAggregate()` — cross-project aggregate statistics (not the main quality tab flow).

---

## 4. Client-Side State (App.vue)

These reactive refs hold the quality data in the frontend:

| Ref | Type | Purpose |
|-----|------|---------|
| `scoringReport` | `GenerationReport \| null` | Current run's report |
| `scoringHistory` | `GenerationReport[]` | History list (last 10) |
| `isScoringReportLoading` | `boolean` | Controls loading spinner |

Tab status indicator:
```typescript
const advancedTabStatuses = computed<Record<string, TabStatus>>(() => ({
  quality: isRunning.value || isStartingRun.value ? "in-progress" : "available",
}));
```
When a run is active, the Quality tab badge shows a spinner/pulse via the `"in-progress"` status.

---

## 5. Loading Triggers

There are **five independent paths** that cause the quality data to refresh:

### Trigger 1 — User switches to the Quality tab
```typescript
watch(activeAdvancedTab, (newTab) => {
  if (activeMainTab.value === "advanced") {
    setView(newTab as View);
    if (newTab === "quality") {
      void loadScoringReport();
      void loadScoringHistory();
    }
  }
}, { immediate: true });
```
Both `loadScoringReport()` and `loadScoringHistory()` are called immediately when the user selects the Quality tab.

### Trigger 2 — New run ID detected
```typescript
watch(latestRunId, async (newRunId) => {
  if (!newRunId || !projectId.value) return;
  await loadScoringReport();
  await loadScoringHistory();
});
```
When the Pinia store detects a new run ID (from polling run events), both loads fire.

### Trigger 3 — Active run polling interval (8 seconds)
```typescript
watch(isRunning, (running) => {
  if (qualityPollInterval) {
    clearInterval(qualityPollInterval);
    qualityPollInterval = null;
  }
  if (running) {
    qualityPollInterval = setInterval(() => {
      if (activeMainTab.value === "advanced" && activeAdvancedTab.value === "quality") {
        void loadScoringReport();
      }
    }, 8000);
  }
});
```
While `isRunning` is true **and** the user is on the Quality tab, the report is polled every 8 seconds. This shows incremental phase results as they are written to disk. History is not re-fetched on this interval.

### Trigger 4 — Run completion via SSE
```typescript
// Success path:
void pollScoringReport();
void loadScoringHistory();

// Failure path (pipeline_error / run_failed):
void pollScoringReport();
void loadScoringHistory();
```
Both paths call `pollScoringReport()` (the retry version) and `loadScoringHistory()`. This handles both successful runs and aborted runs that may have partial scoring data.

### Trigger 5 — Passive refresh during run events polling (3 seconds)
```typescript
const loadRunEventsForProject = async () => {
  // ...
  void loadScoringReport();  // <-- included in every 3s cycle
  // ...
};
```
`loadRunEventsForProject()` runs every 3 seconds during an active run. It calls `loadScoringReport()` on every cycle, so the Quality tab stays reactive even without the user switching to it.

---

## 6. `loadScoringReport()` — Detailed Flow

```typescript
const loadScoringReport = async () => {
  if (!projectId.value) return;
  isScoringReportLoading.value = true;
  try {
    const runId = latestRunId.value ?? (await fetchLatestRun(projectId.value).catch(() => null))?.id ?? null;
    if (runId) {
      const report = await fetchScoringReport(projectId.value, runId);
      if (report) {
        scoringReport.value = report as GenerationReport;
        return;
      }
    }
    // Fallback: history endpoint reads directly from disk with no run-status gating
    const history = await fetchScoringHistory(projectId.value, 1);
    if (history.length > 0) scoringReport.value = history[0] as GenerationReport;
  } catch {
    // Do not clear existing data on failure — keep showing the last known report.
    if (!scoringReport.value) {
      scoringReport.value = null;
    }
  } finally {
    isScoringReportLoading.value = false;
  }
};
```

Key behaviours:
- If there is no `latestRunId`, it fetches the latest run from the API first
- Primary path: `GET /api/projects/{id}/runs/{runId}/report`
- Fallback path (if primary returns null, e.g. during run): `GET /api/projects/{id}/reports/history?limit=1`
- On error: **does not clear** existing `scoringReport` — the last known data stays visible
- Always resets `isScoringReportLoading` to `false` via `finally`

---

## 7. `pollScoringReport()` — Retry After Run Completion

```typescript
const pollScoringReport = async (attempts = 10, delayMs = 1500) => {
  if (!projectId.value || !latestRunId.value) return;
  isScoringReportLoading.value = true;
  for (let attempt = 0; attempt < attempts; attempt++) {
    if (!projectId.value || !latestRunId.value) break;
    try {
      const report = await fetchScoringReport(projectId.value, latestRunId.value);
      if (report) {
        scoringReport.value = report as GenerationReport;
        isScoringReportLoading.value = false;
        return;
      }
    } catch {
      // report not written yet — keep retrying
    }
    if (attempt < attempts - 1) {
      await new Promise<void>((resolve) => setTimeout(resolve, delayMs));
    }
  }
  // All attempts exhausted — fall back to history
  try {
    const history = await fetchScoringHistory(projectId.value, 1);
    if (history.length > 0) scoringReport.value = history[0] as GenerationReport;
  } catch { /* best-effort */ }
  isScoringReportLoading.value = false;
};
```

- Called after SSE signals run completion (both success and failure)
- Retries up to 10 times with 1500ms delay between attempts
- Stops as soon as a non-null report is returned
- If all attempts fail, falls back to the history endpoint
- This handles the race between SSE arriving and the report file being written to disk

---

## 8. Display: `ScoreCard` Component

Receives props:
- `report: GenerationReport | null`
- `loading?: boolean`

### Empty state
When `!report || !report.summary`:
- Shows "No quality report available" message
- Notes `ENABLE_SCORING` env variable if scoring was not enabled

### When a report is present

**Header row:**
- Grade badge: letter grade (A–F) + numeric score / 100, coloured by grade
- Outcome badge: "Passed" (green) / "Failed" (red) / "Aborted" (amber) / "Infra Failure" (gray)
- Export JSON button: downloads the raw `GenerationReport` as a `.json` file
- Generated-at date and scoring mode label

**Score bar:**
Horizontal progress bar coloured by score threshold:
| Score | Colour |
|-------|--------|
| ≥ 90 | Emerald |
| ≥ 80 | Blue |
| ≥ 70 | Amber |
| ≥ 60 | Orange |
| < 60 | Rose |

**Stats grid (4 columns):**
- Phases: `{phases_passed}✓ / {phases_failed}✗ of {total_phases}`
- Pass rate: `{pass_rate}%`
- Duration: formatted from `total_duration_ms`
- Cost: formatted from `total_cost` (USD)

**Weakest / Strongest phase:**
Human-readable labels derived from agent IDs via `phaseLabel()`:
- `agent9_prose` → "Prose Generation"
- etc.

**Phase breakdown table** (`PhaseBreakdownTable`) is rendered below, receiving `report.phases`.

---

## 9. Display: `PhaseBreakdownTable` Component

Receives: `phases: ScoringPhaseReport[]`

Renders a table with one row per phase. Each row shows:
- Phase name (mapped from agent ID)
- Score bar (coloured by score)
- Total score / 100
- Letter grade badge

**Expand/collapse per phase:**
Clicking a row toggles `expandedPhase`. When expanded, shows individual test results:

| Category | Weight |
|----------|--------|
| validation | 40% |
| quality | 30% |
| completeness | 20% |
| consistency | 10% |

Each test shows: name, pass/fail icon, score, weight.

**Prose phase special handling:**
For the prose phase (`agent9_prose`), `readChapterScoreSeries()` reads chapter-by-chapter score breakdown from `phase.diagnostics`, showing how individual chapters contributed to the phase score.

---

## 10. Display: `ScoreTrendChart` Component

Receives the `scoringHistory` array (`GenerationReport[]`). Renders a line/bar chart showing how `overall_score` has changed across the last N runs. Provides historical context for whether quality is improving or regressing.

---

## 11. `GenerationReport` TypeScript Shape

Defined in `apps/web/src/components/types.ts`:

```typescript
interface GenerationReport {
  run_id: string;
  overall_score: number;           // 0–100
  overall_grade: string;           // "A" | "B" | "C" | "D" | "F"
  passed: boolean;
  run_outcome: "passed" | "failed" | "aborted" | "infra_failure";
  phases: ScoringPhaseReport[];
  summary: {
    phases_passed: number;
    phases_failed: number;
    total_phases: number;
    pass_rate: number;
    weakest_phase: string;
    strongest_phase: string;
  };
  total_duration_ms: number;
  total_cost: number;
  generated_at: string;            // ISO timestamp
  threshold_config: { mode: string };
}

interface ScoringPhaseReport {
  phase_id: string;
  phase_name: string;
  agent: string;
  score: {
    total: number;
    validation?: number;
    quality?: number;
    completeness?: number;
    consistency?: number;
  };
  tests: ScoringTestResult[];
}

interface ScoringTestResult {
  name: string;
  category: "validation" | "quality" | "completeness" | "consistency";
  passed: boolean;
  score: number;
  weight: number;
}
```

---

## 12. End-to-End Timing Summary

| Event | What happens |
|-------|-------------|
| Run starts | Quality tab badge changes to "in-progress" (spinner) |
| Every 3s (run events poll) | `loadScoringReport()` fires; 404 from API silently ignored |
| User opens Quality tab mid-run | `loadScoringReport()` fires immediately; 8s interval starts |
| Every 8s (quality poll, tab open) | `loadScoringReport()` fires |
| SSE "idle" received (run complete) | `pollScoringReport()` retries up to 10× (1.5s apart); `loadScoringHistory()` fetches updated list |
| Report file written to disk | Next `fetchScoringReport()` call returns the data; `scoringReport` ref updates; `ScoreCard` renders |
| User opens Quality tab post-run | `loadScoringReport()` + `loadScoringHistory()` fire immediately from tab-change watcher |
