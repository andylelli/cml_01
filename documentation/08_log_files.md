# 08 — Log Files & Data Files Reference

Complete reference for every file the system writes to disk during normal operation. Includes format, default path, env override, and the API endpoint (if any) that serves the file.

---

## Quick Reference

| File | Written by | Format | API endpoint |
|------|-----------|--------|-------------|
| `c:\CML\logs\llm.jsonl` | API server LLM client | JSONL | `GET /api/llm-logs` |
| `c:\CML\apps\api\logs\llm.jsonl` | Worker LLM client | JSONL | `GET /api/llm-logs` |
| `c:\CML\logs\llm-prompts-full.jsonl` | API server LLM client | JSONL | — |
| `c:\CML\logs\activity.jsonl` | API server | JSONL | — |
| `c:\CML\apps\worker\logs\scoring.jsonl` | Worker scoring system | JSONL | — |
| `c:\CML\data\store.json` | API database layer | JSON | (via REST endpoints) |
| `c:\CML\apps\api\data\reports\{proj}\{run}.json` | Worker orchestrator | JSON | `GET /api/projects/:p/runs/:r/report` |
| `c:\CML\stories\project_{token}.txt` | API server | plain text | — |
| *(browser download — not written to disk)* | `POST /api/projects/:id/export` | JSON | (inline download) |
| `c:\CML\validation\quality-report-{run}.json` | Manual / test fixtures | JSON | — |
| `c:\CML\apps\worker\logs\run_{YYYYMMDD}_{shortRunId}.json` | Worker orchestrator (`RunLogger`) | JSON | — |

---

## 1 · `logs/llm.jsonl` — API Server LLM Summary Log

**Source:** `packages/llm-client`, initialised in `apps/api/src/server.ts` line 416.  
**Default path:** `{workspace}/logs/llm.jsonl` (`path.resolve(process.cwd(), "logs", "llm.jsonl")`)  
**Env override:** `LOG_FILE_PATH`  
**Format:** JSONL — one JSON object per LLM call, appended in real time.  
**API endpoint:** `GET /api/llm-logs?projectId=&limit=200` (served by `apps/api/src/server.ts`).

### Fields per entry

| Field | Type | Description |
|-------|------|-------------|
| `timestamp` | ISO string | When the call completed |
| `agent` | string | Agent name (e.g. `Agent9-ProseGenerator-Ch1`) |
| `operation` | string | `chat_request` or `chat_request_retry` |
| `model` | string | Model name used |
| `promptTokens` | number | Input token count |
| `completionTokens` | number | Output token count |
| `totalTokens` | number | Sum of above |
| `latencyMs` | number | Wall-clock duration |
| `estimatedCost` | number | USD cost estimate |
| `projectId` | string | Project ID |
| `runId` | string | Run ID |
| `errorMessage` | string? | Error text if call failed |
| `retryAttempt` | number | Retry index (0 = first attempt) |
| `promptHash` | string | Short hash of the prompt (for cross-referencing `llm-prompts-full.jsonl`) |

### Notes
- `LOG_TO_FILE` env (default `true`) enables/disables writing.
- `LOG_LEVEL` env controls minimum log level.
- Only the most recent `limit` entries are returned by the API — the file itself grows unbounded.
- This file is **not** per-run; all runs for all projects append to the same file.

---

## 2 · `apps/api/logs/llm.jsonl` — Worker LLM Summary Log

**Source:** `packages/llm-client`, initialised in `apps/worker/src/jobs/index.ts` line 43.  
**Default path:** `apps/api/logs/llm.jsonl` (hardcoded relative to workspace root in worker code).  
**Env override:** `LOG_FILE_PATH` (same env as API server — set this to merge both into one file).  
**Format:** Identical schema to §1.

### Notes
- The API server and the worker use different default paths unless `LOG_FILE_PATH` is explicitly set.
- To unify both streams set `LOG_FILE_PATH=logs/llm.jsonl` in the environment.
- The `GET /api/llm-logs` endpoint reads whichever path `LOG_FILE_PATH` resolves to (defaults to `logs/llm.jsonl`, i.e. the API server default).

---

## 3 · `logs/llm-prompts-full.jsonl` — Full LLM Prompt Log

**Source:** API server LLM client (`apps/api/src/server.ts` line 419–420).  
**Default path:** `{workspace}/logs/llm-prompts-full.jsonl`  
**Env override:** `FULL_PROMPT_LOG_FILE_PATH`  
**Format:** JSONL — same fields as §1 but with a `messages[]` array containing the full system and user message content.  
**API endpoint:** None — file-only.

### Fields (additional to §1)

| Field | Type | Description |
|-------|------|-------------|
| `messages` | array | Full `[{role, content}]` array sent to the LLM |

### Notes
- Use `promptHash` from `llm.jsonl` to locate the matching entry here.
- Contains sensitive prompt content — not served via API.
- Referenced in ANALYSIS documents to reconstruct reconstructed LLM inputs for failed runs.
- Written by the **API server only**, not the worker.

---

## 4 · `logs/activity.jsonl` — API Server Activity Log

**Source:** `appendActivityLog()` in `apps/api/src/server.ts` line 829–834.  
**Default path:** `{workspace}/logs/activity.jsonl` (hardcoded — no env override).  
**Format:** JSONL.  
**API endpoint:** None — file-only.

### Events recorded

| Event | Trigger |
|-------|---------|
| `run_started` | Pipeline triggered |
| `run_completed` | Pipeline completed successfully |
| `run_failed` | Pipeline error |
| `log_entry` | Each `POST /api/logs` call from the UI |

### Fields per entry

| Field | Type | Description |
|-------|------|-------------|
| `timestamp` | ISO string | Event time |
| `event` | string | Event name |
| `projectId` | string? | Project ID if applicable |
| `runId` | string? | Run ID if applicable |

---

## 5 · `apps/worker/logs/scoring.jsonl` — Worker Scoring Log

**Source:** `ScoringLogger` class in `apps/worker/src/jobs/scoring-logger.ts`.  
**Default path:** `apps/worker/logs/scoring.jsonl` (constructed in `ScoringLogger` constructor with `WORKER_APP_ROOT/logs`).  
**Format:** JSONL.  
**API endpoint:** None — file-only.  
**Condition:** Only written when `ENABLE_SCORING=true`.

### Event types

| `event_type` | Description | Key fields |
|-------------|-------------|-----------|
| `phase_score` | Score for one scoring phase | `agent`, `phase_name`, `score`, `grade`, `passed`, `duration_ms`, `cost`, `validation_score`, `quality_score`, `completeness_score`, `consistency_score`, `component_failures` |
| `retry_attempt` | LLM retry within a phase | `agent`, `attempt`, `reason`, `backoff_ms`, `max_retries` |
| `scoring_error` | Exception during scoring | `agent`, `error_message`, `error_stack` |
| `report_generated` | Final report assembled | `overall_grade`, `passed_count`, `failed_count`, `total_phases`, `average_score`, `duration_ms`, `total_cost` |
| `phase_diagnostic` | Structured diagnostic snapshot | `agent`, `diagnostic_type`, `details` |
| `validation_failure` | Full story-validation error list | `status`, `summary.{totalIssues,critical,major,moderate,minor}`, `errors[]` |

### `phase_diagnostic` for prose (agent9_prose_post_generation_summary)

The `details` object of the `phase_diagnostic` entry emitted by Agent 9 includes:

| Field | Description |
|-------|-------------|
| `chapter_word_counts` | `[{chapter: N, words: N}, ...]` — actual word count per committed chapter |
| `underflow_hard_floor_misses` | Chapters that fell below the hard floor |
| `underflow_preferred_target_misses` | Chapters that missed the preferred target |
| `underflow_hard_floor_miss_chapters` | Chapter numbers with hard-floor misses |
| `underflow_preferred_target_miss_chapters` | Chapter numbers with preferred-target misses |
| `underflow_expansion_attempts` | Total expansion attempts triggered |
| `underflow_expansion_recovered` | Chapters recovered by expansion |
| `underflow_expansion_failed` | Chapters still short after expansion |
| `fair_play_*` | Fair-play check results |
| `nsd_transfer_trace` | Narrative state transfer trace |

---

## 6 · `data/store.json` — Primary Application Database

**Source:** `apps/api/src/db.ts` — JSON flat-file database.  
**Default path:** `{workspace}/data/store.json`  
**Env override:** `CML_JSON_DB_PATH`  
**Format:** JSON (atomic write — written to `.tmp` then renamed into place).  
**Backup:** `data/store.json.bak` is written before each save.  
**API endpoint:** Read/write via all standard REST endpoints (`/api/projects`, `/api/runs`, `/api/artifacts`, etc.).

### Top-level schema

```json
{
  "projects":   { "<projectId>": { "id", "name", "status" } },
  "specs":      { "<specId>":    { "id", "projectId", "spec" } },
  "specOrder":  [{ "id", "projectId" }],
  "runs":       { "<runId>":     { "id", "projectId", "status" } },
  "runOrder":   [{ "id", "projectId" }],
  "runEvents":  [{ "runId", "step", "message" }],
  "artifacts":  [{ "id", "projectId", "type", "payload" }],
  "logs":       [{ "id", "projectId", "scope", "message", "payload", "createdAt" }]
}
```

### Notes
- All pipeline artifact payloads (setting, cast, CML, clues, outline, prose, etc.) are stored inside `artifacts`.
- `runEvents` is the sole runtime progress log used by the UI polling loop and the `GET /api/runs/:id/events` endpoint.
- Test runs set `CML_JSON_DB_PATH` to a temp file so they never touch `data/store.json`.

---

## 7 · `apps/api/data/reports/{projectId}/{runId}.json` — Quality Reports

**Source:** `FileReportRepository.save()` in `packages/story-validation/src/report-repository.ts`, called from `apps/worker/src/jobs/mystery-orchestrator.ts`.  
**Default path:** `apps/api/data/reports/{projectId}/{runId}.json` (resolved relative to workspace root — `WORKSPACE_ROOT/apps/api/data/reports`).  
**Format:** JSON (atomic write — `.tmp` file then rename).  
**API endpoints:**
- `GET /api/projects/:projectId/runs/:runId/report` — fetch specific report
- `GET /api/projects/:projectId/reports/history?limit=N` — list recent reports
- `GET /api/scoring/aggregate` — aggregate stats across all reports

### Top-level fields

| Field | Description |
|-------|-------------|
| `project_id` | Project ID |
| `run_id` | Run ID |
| `generated_at` | ISO timestamp |
| `overall_score` | 0–100 |
| `overall_grade` | A / B / C / D / F |
| `total_duration_ms` | Total wall-clock duration |
| `total_cost` | USD cost of the run |
| `phases[]` | Per-phase `PhaseScore` objects |
| `diagnostics[]` | Structured diagnostic objects (includes NSD trace, validation failures, prose post-generation summary) |

### Notes
- `savePartialReport()` is called after each agent batch — the file may be read while still in progress.
- Reports are written **only** when `ENABLE_SCORING=true`.
- The API server falls back through several legacy directory paths when resolving reports — see `getReportRepository()` in `apps/api/src/server.ts`.

---

## 8 · `stories/project_{token}.txt` — Human-Readable Story Text

**Source:** `saveReadableStoryText()` in `apps/api/src/server.ts` line 598–611.  
**Default path:** `{workspace}/stories/project_{token}.txt` where `token` is derived from the project ID.  
**Format:** UTF-8 plain text.  
**API endpoint:** None — file-only.  
**Git tracking:** Excluded via `.gitignore`.

### Format conventions
- One blank line between paragraphs.
- Chapter number and title as a heading line.
- Summary in italics block before body paragraphs.
- Smart quotes, en-dashes, and ellipses normalised to ASCII equivalents for text-editor compatibility.

---

## 9 · `export_{projectId}_{timestamp}.json` — User Artifact Export (browser download)

**Source:** `POST /api/projects/:id/export` in `apps/api/src/server.ts` line 1792–1860.  
**Path on disk:** **Not written to disk.** The file is streamed directly as an HTTP attachment.  
**Format:** JSON (pretty-printed with 2-space indentation).  
**Filename pattern:** `export_{projectId}_{timestamp}.json`

### Selectable artifact types

| UI label | `artifactType` value | Notes |
|----------|---------------------|-------|
| Quality report | `quality_report` | Latest `GenerationReport` |
| Narrative state trace | `narrative_state_trace` | NSD trace extracted from latest report diagnostic |
| Setting | `setting` | Raw artifact payload |
| Cast | `cast` | Raw artifact payload |
| Clues | `clues` | Raw artifact payload |
| Outline | `outline` | Raw artifact payload |
| Prose | `prose` | Sanitised (secrets stripped) |
| Character profiles | `character_profiles` | Raw artifact payload |
| Hard-logic devices | `hard_logic_devices` | Raw artifact payload |
| CML | `cml` | Raw artifact payload (Advanced/Expert only) |
| Fair-play report | `fair_play_report` | Raw artifact payload |
| Game pack | `game_pack` | Raw artifact payload |

---

## 10 · `apps/worker/logs/run_{YYYYMMDD}_{shortRunId}.json` — Per-Run Operational Log

**Source:** `RunLogger` class in `apps/worker/src/jobs/run-logger.ts`, instantiated in `apps/worker/src/jobs/mystery-orchestrator.ts`.  
**Default path:** `c:\CML\apps\worker\logs\run_{YYYYMMDD}_{shortRunId}.json` (one file per run, created at pipeline start).  
**Env override:** None — always written.  
**Format:** JSON (pretty-printed, rewritten in full after every update).  
**API endpoint:** None — file-only.  
**Condition:** Always active — not gated on `ENABLE_SCORING`.

### Top-level schema

```json
{
  "runId":       "<runId>",
  "projectId":  "<projectId or null>",
  "startedAt":  "<ISO timestamp>",
  "completedAt": "<ISO timestamp or null>",
  "status":     "running | complete | failed",
  "durationMs": "<number or null>",
  "stages": [
    { "stage": "setting", "message": "...", "completedAt": "..." }
  ],
  "wordCounts": {
    "chapters": [{ "chapter": 1, "words": 1842 }],
    "total": 18420
  },
  "warnings": ["..."],
  "errors":   ["..."]
}
```

### Fields

| Field | Type | Description |
|-------|------|-------------|
| `runId` | string | Run identifier |
| `projectId` | string \| null | Project identifier |
| `startedAt` | ISO string | When the run began |
| `completedAt` | ISO string \| null | When the run ended (null if still running) |
| `status` | `"running"` \| `"complete"` \| `"failed"` | Final state |
| `durationMs` | number \| null | Total wall-clock duration when complete |
| `stages[]` | array | One entry per pipeline stage boundary (every `reportProgress()` call) |
| `stages[].stage` | string | Stage name, e.g. `setting`, `cast`, `prose`, `complete` |
| `stages[].message` | string | Human-readable progress message |
| `stages[].completedAt` | ISO string | Timestamp of this stage boundary |
| `wordCounts.chapters[]` | array | Per-chapter word counts, updated as each chapter batch commits |
| `wordCounts.total` | number | Running total across all committed chapters |
| `warnings[]` | string[] | Snapshot of all warnings accumulated up to the last stage |
| `errors[]` | string[] | Snapshot of all errors accumulated up to the last stage |

### Notes
- The file is created at the very start of the pipeline and flushed synchronously after every update, so partial data is available immediately if the run crashes mid-way.
- Each entry in `stages[]` overwrites a prior entry with the same stage name, so the file always shows the latest message per stage (no duplicates).
- Word counts are written incrementally — after each prose batch completes — so the file reflects chapters generated so far even when prose is still running.
- `warnings[]` and `errors[]` are deduplicated; repeated pushes of the same string are stored only once.
- File not cleaned up automatically — old run logs persist in `apps/worker/logs/`.

---

## 11 · `validation/quality-report-{runId}.json` — Benchmark Test Fixtures

**Source:** Not written at runtime — manually curated copies of quality reports placed here for use by replay tests.  
**Path:** `{workspace}/validation/quality-report-{runId}.json`  
**Format:** JSON (same schema as §7).  
**Consumers:**
- `packages/story-validation/src/__tests__/fixed-seed-benchmark.replay.test.ts`
- `packages/story-validation/src/__tests__/report-invariants.replay.test.ts`

### Notes
- These files serve as golden references for deterministic scoring benchmarks.
- They are **not** created by the running application — they are copied from `apps/api/data/reports/` after a known-good run.
- `report-invariants.replay.test.ts` asserts that specific invariants hold against the pinned report `quality-report-run_9b2fcacd-99b6-4b55-ae52-30bb7e5fd263.json`.

---

## Environment Variable Reference

| Variable | Default | Affects |
|----------|---------|---------|
| `LOG_FILE_PATH` | `logs/llm.jsonl` (API) / `apps/api/logs/llm.jsonl` (worker) | §1, §2 |
| `FULL_PROMPT_LOG_FILE_PATH` | `logs/llm-prompts-full.jsonl` | §3 |
| `LOG_TO_FILE` | `true` | §1, §2 (disables LLM file logging when `false`) |
| `LOG_TO_CONSOLE` | `true` | LLM call console output |
| `LOG_LEVEL` | `info` | Minimum log level for LLM client |
| `CML_JSON_DB_PATH` | `data/store.json` | §6 |
| `ENABLE_SCORING` | `false` | §5, §7 (both disabled when `false`) |

> **§10 (run log) has no env controls** — it is unconditionally enabled and always writes to `apps/worker/logs/run_{YYYYMMDD}_{shortRunId}.json`.

---

## How to Query Specific Log Data

### Per-run chapter word counts (after a run with ENABLE_SCORING=true)

```powershell
Get-Content apps\worker\logs\scoring.jsonl |
  Where-Object { $_ -match '"phase_diagnostic"' } |
  ForEach-Object { $_ | ConvertFrom-Json } |
  Where-Object { $_.runId -eq "run_XXXX" } |
  Select-Object -ExpandProperty details |
  Select-Object chapter_word_counts, underflow_expansion_attempts
```

### All LLM calls for a specific run

```powershell
Get-Content logs\llm.jsonl |
  ForEach-Object { try { $_ | ConvertFrom-Json } catch {} } |
  Where-Object { $_.runId -eq "run_XXXX" } |
  Select-Object timestamp, agent, model, totalTokens, estimatedCost, errorMessage
```

### Run events from the database

```powershell
$j = Get-Content data\store.json -Raw | ConvertFrom-Json
$j.runEvents | Where-Object { $_.runId -eq "run_XXXX" } |
  ForEach-Object { "$($_.step): $($_.message)" }
```

### Current state of a specific run log

```powershell
Get-Content "apps\worker\logs\run_YYYYMMDD_XXXXXXXX.json" -Raw | ConvertFrom-Json |
  Select-Object status, durationMs, warnings, errors,
    @{N='chapters'; E={ $_.wordCounts.chapters }},
    @{N='totalWords'; E={ $_.wordCounts.total }}
```

### Full prompt for a specific hash

```powershell
Get-Content logs\llm-prompts-full.jsonl |
  ForEach-Object { try { $_ | ConvertFrom-Json } catch {} } |
  Where-Object { $_.promptHash -eq "HASH_HERE" } |
  Select-Object -ExpandProperty messages
```
