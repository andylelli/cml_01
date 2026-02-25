# 06 Workflow

## Overview

This document describes the current implementation of the mystery generation workflow, including user actions, API endpoints, events, and CML content handling.

## User Actions → API Endpoints

### 1. Create Project
- **Endpoint**: `POST /api/projects`
- **Action**: Creates a new project with `idle` status
- **Response**: `{ id, name, status }`

### 1b. List Projects
- **Endpoint**: `GET /api/projects`
- **Action**: Returns existing projects for reload dropdown
- **Response**: `{ projects: [{ id, name, status, createdAt? }] }`

### 2. Save Spec
- **Endpoint**: `POST /api/projects/:id/specs`
- **Action**: Stores user input specification (decade, cast size, tone, clue density, etc.)
- **Notes**: Spec may include an optional theme prompt to steer plot direction.
- **Response**: `{ id, projectId, spec }`

### 3. Run Pipeline
- **Endpoint**: `POST /api/projects/:id/run`
- **Action**: Initiates the full mystery generation pipeline
- **Response**: `{ status: "running", projectId, runId }`
- **Side Effects**: Creates a run record, sets project status to `running`
- **Requirement**: Azure OpenAI credentials must be configured; no deterministic fallback artifacts are produced.
- **UI Behavior**: Generate auto-saves the latest spec before starting the run.

### 4. Regenerate Artifact
- **Endpoint**: `POST /api/projects/:id/regenerate`
- **Body**: `{ scope: "setting" | "cast" | "character_profiles" | "cml" | "clues" | "outline" | "prose" | "game_pack" | "fair_play_report" }`
- **Action**: Regenerates LLM-backed artifacts. Currently supported only for `character_profiles`; other scopes require a full pipeline run.
- **Response**: `{ status: "ok", scope }` or `{ error }` when regeneration requires a full run.

### 5. Clear Persistence (Admin)
- **Endpoint**: `POST /api/admin/clear-store`
- **Action**: Wipes the JSON/Postgres persistence store and resets projects/specs/artifacts/runs/logs
- **Response**: `{ status: "ok" }`

### 6. Fetch Scoring Reports (Phase 4)
- **Endpoint**: `GET /api/projects/:projectId/runs/:runId/report`
- **Action**: Returns the stored scoring report for a specific run
- **Response**: `GenerationReport`

### 7. Fetch Scoring Report History (Phase 4)
- **Endpoint**: `GET /api/projects/:projectId/reports/history?limit=N`
- **Action**: Returns most recent scoring reports for a project
- **Response**: `{ projectId, limit, count, reports[] }`

### 8. Fetch Aggregate Scoring Stats (Phase 4)
- **Endpoint**: `GET /api/reports/aggregate`
- **Action**: Returns aggregate scoring metrics across all stored reports
- **Response**: `AggregateStats`

## Pipeline Execution Flow

When a user triggers the pipeline via `POST /api/projects/:id/run`, the system executes the following LLM-backed steps:
No deterministic stub artifacts are created; each artifact is stored as the corresponding LLM step completes.

### Step 1: Setting Generation
- **Derives**: `{ decade, locationPreset, weather, socialStructure, institution }`
- **Artifacts Created**:
  - `setting` - The derived setting data
  - `setting_validation` - Validation result
- **Event**: `setting_done` - "Setting generated"
- **Guardrail**: Non-empty anachronisms/implausibilities trigger retry and block pipeline if unresolved

### Step 2: Cast Generation
- **Derives**: `{ size, detectiveType, victimArchetype, suspects[] }`
- **Artifacts Created**:
  - `cast` - The derived cast data with suspect names
  - `cast_validation` - Validation result
- **Event**: `cast_done` - "Cast generated"
- **Guardrail**: Non-empty stereotypeCheck triggers retry and block pipeline if unresolved

### Step 3: CML Generation
- **Derives**: Full CML 2.0 structure including:
  - Case metadata (title, author, era, setting, crime class)
  - Cast with detailed character attributes
  - Culpability (culprit count and identities)
  - Surface model (narrative, accepted facts, inferred conclusions)
  - Hidden model (mechanism, delivery path, outcome)
  - False assumption (type, reasoning, what it hides)
  - Constraint space (time, access, physical, social)
  - Inference path
  - Discriminating test
  - Fair play checklist
  - Quality controls (inference path requirements, clue visibility targets, discriminating test timing)
- **Validation**: Uses `@cml/cml` validator
  - If validation fails, retries once with temporal axis
- **Artifacts Created**:
  - `cml` - The complete CML document
  - `cml_validation` - Validation result `{ valid, errors }`
- **Events**: 
  - `cml_retry` - "CML failed validation; retrying" (if needed)
  - `cml_validated` - "CML validated"
- **Spec adherence**: CML generation must honor the spec parameters (decade, location preset, tone, theme, cast size/names, primary axis).
- **Grounding split**: CML generation consumes `background_context` for backdrop coherence and `hard_logic_devices` for mechanism proof logic.

### Step 2e (pre-step): Background Context Generation (LLM)
- **Derives**: canonical backdrop context from setting + cast anchors + theme via LLM Agent 2e (not deterministic assembly)
- **Validation**: `background_context.schema.yaml` must pass before CML generation proceeds
- **Artifacts Created**:
  - `background_context` - `{ status, backdropSummary, era, setting, castAnchors, theme? }`
- **Event**: `background_context_done` - "Background context generated"

### Step 3 (pre-step): Hard-Logic Device Ideation
- **Derives**: 3–5 novel mechanism concepts, each with title, principle type, illusion/reality, fair-play clues, anti-trope rationale, and escalation variation
- **Validation**: `hard_logic_devices.schema.yaml` must pass before CML generation proceeds
- **Artifacts Created**:
  - `hard_logic_devices` - `{ status, overview, devices[] }`
- **Event**: `hard_logic_devices_done` - "Hard-logic devices generated (<count>)"

### Step 3b: Character Profile Generation
- **Derives**: Per-character narrative profiles from cast (LLM)
  - Each profile: `{ name, summary, publicPersona, privateSecret, motiveSeed, paragraphs[] }`
- **Artifacts Created**:
  - `character_profiles` - `{ status, tone, targetWordCount, profiles[], note }`
- **Event**: `character_profiles_done` - "Character profiles generated"

### Step 4: Synopsis Generation
- **Derives**: `{ status, title, summary }` from CML metadata
- **Artifacts Created**:
  - `synopsis` - Brief case summary
- **Event**: `synopsis_done` - "Synopsis generated"

### Step 5: Novelty Audit
- **Current Implementation**: LLM-based similarity audit against seed CMLs
- **Artifacts Created**:
  - `novelty_audit` - `{ status: "pass"|"warning"|"fail", seedIds: [], patterns: [], highestSimilarity, recommendations[] }`
- **Event**: `novelty_audit_done` - "Novelty audit: <status>" with summary and top-match details when available
- **Guardrail**: CML generation includes explicit divergence constraints from seed patterns.
- **Configuration**: Similarity threshold is configurable via `NOVELTY_SIMILARITY_THRESHOLD` (default 0.9, higher values are more lenient). Set `NOVELTY_SKIP=true` (or use a threshold >= 1.0) to skip the novelty check. Use `NOVELTY_HARD_FAIL=true` to make similarity failures block the pipeline; otherwise failures continue as warnings.
- **Normalization**: Weighted overall similarity is recomputed from the category scores, and pass/warn/fail status is enforced from the threshold.
- **Feedback Loop**: On novelty failure, the system regenerates CML once with stronger divergence constraints, then re-audits

### Step 6: Clues Generation
- **Derives**: `{ status, density, axis, summary, items[] }`
  - Each clue item: `{ id, category, text, pointsTo, redHerring, revealChapter }`
  - Includes both genuine clues and red herrings (depending on density)
- **Artifacts Created**:
  - `clues` - All clue data
  - `clues_validation` - Validation result
- **Event**: `clues_done` - "Clues generated"
- **Feedback Loop**: If the fair-play audit fails, clues are regenerated once using the audit’s violations and recommendations before re-auditing.
- **Deterministic Guardrails**: Before fair-play audit, clues are checked for early/mid essential placement, unique clue IDs, and detective-only/private clue phrasing; critical guardrail failures trigger one targeted clue regeneration and then fail if still unresolved.

### Step 7: Fair Play Report Generation
- **Derives**: LLM-based fair-play audit from CML + clues, including:
  - overall status (pass/fail/needs-revision)
  - checklist items with per-rule status
  - violations and recommendations
- **Artifacts Created**:
  - `fair_play_report` - `{ overallStatus, summary, checks[], violations[], warnings[], recommendations[] }`
- **Event**: `fair_play_report_done` - "Fair-play report generated"
- **Guardrail**: overallStatus of fail/needs-revision triggers one automatic clue-regeneration attempt and re-audit.
- **Continuation rule**: If violations remain after retry, they are surfaced as warnings and the pipeline continues to later stages.

### Step 8: Outline Generation
- **Derives**: `{ status, tone, chapters, summary }`
- **Artifacts Created**:
  - `outline` - Story structure outline
  - `outline_validation` - Validation result
- **Event**: `outline_done` - "Outline generated"

### Step 9: Prose Generation
- **Derives**: Chapter-by-chapter narrative from outline + cast (LLM)
  - Each chapter: `{ title, summary, paragraphs[] }`
- **Post-processing**: Prose is sanitized before persistence (Unicode NFC normalization, mojibake cleanup, system-residue stripping).
- **Guardrail**: If post-reveal chapters drift into role-only culprit aliasing after arrest/confession, prose regenerates once; unresolved drift fails the run.
- **Artifacts Created**:
  - `prose_<length>` - `{ status, tone, chapters[], cast[], note }` where `<length>` is `short`, `medium`, or `long`
- **Event**: `prose_done` - "Prose generated (<length> format)"

### Step 10: Game Pack Generation
**Status:** Planned. Game pack generation is not yet available without LLM support and is not produced in the current pipeline run.

### Pipeline Completion
- After the pipeline finishes (success or failure), project status returns to `idle`
- **Event**: `run_finished` - "Pipeline run finished"
- **Release Gate**: when any of the following remain (critical continuity issue, mojibake artifact, missing discriminating test scene, missing suspect-elimination coverage), the pipeline emits release-gate warnings and continues to completion for review.

## Run Events

All pipeline steps emit events that are stored and queryable:

- **Create Event**: `repo.addRunEvent(runId, step, message)`
- **Query Events**: `GET /api/runs/:id/events`
- **Response**: `{ runId, events: [{ step, message }] }`

Events provide a complete audit trail of what happened during a pipeline run.
Cost values in run events are reported in GBP.
The web UI polls the latest run events while a run is active to show live progress in Run History.
Progress indicators in the UI advance based on the latest run-event stage.
Novelty run events include a `novelty_math` step that records the weighting, threshold, and most-similar seed score.

## Server-Sent Events (SSE)

Real-time project status updates are delivered via SSE:

- **Endpoint**: `GET /api/projects/:id/events`
- **Mechanism**: Polls project status every 15 seconds
- **Event Type**: `ping`
- **Payload**: `{ projectId, status }`
- **Client**: Web app subscribes via `subscribeToRunEvents()`

The SSE connection stays open and sends periodic updates until the client disconnects.

## CML Content & Access Control

CML artifacts are protected by access level gating based on the `x-cml-mode` header:

### Access Modes
- **`user`** (default): Cannot access CML endpoints (403 Forbidden)
- **`advanced`**: Can view CML and validation results (read-only)
- **`expert`**: Can view and validate CML

### CML-Protected Endpoints
- `GET /api/projects/:id/cml/latest` - Fetch the latest CML document
- `POST /api/projects/:id/cml/validate` - Validate a CML payload
- `GET /api/projects/:id/cml/validation/latest` - Fetch latest validation results

All CML endpoints require `x-cml-mode: advanced` or `x-cml-mode: expert` header.

## Artifact Retrieval

All generated artifacts are accessible via GET endpoints:

### Public Artifacts (no access control)
- `GET /api/projects/:id/setting/latest`
- `GET /api/projects/:id/cast/latest`
- `GET /api/projects/:id/background-context/latest`
- `GET /api/projects/:id/hard-logic-devices/latest`
- `GET /api/projects/:id/character-profiles/latest`
- `GET /api/projects/:id/clues/latest`
- `GET /api/projects/:id/outline/latest`
- `GET /api/projects/:id/prose/latest`
- `GET /api/projects/:id/prose/all`
- `GET /api/projects/:id/synopsis/latest`
- `GET /api/projects/:id/prose/pdf` (optional query `length=short|medium|long`)
- `GET /api/projects/:id/fair-play/latest`
- `GET /api/projects/:id/game-pack/latest`

### Validation Artifacts
- `GET /api/projects/:id/setting/validation/latest`
- `GET /api/projects/:id/cast/validation/latest`
- `GET /api/projects/:id/clues/validation/latest`
- `GET /api/projects/:id/outline/validation/latest`

### Special Endpoints
- `GET /api/projects/:id/game-pack/pdf` - Download game pack as PDF
- `POST /api/projects/:id/export` - Export selected artifacts as JSON

## Regeneration Workflow

Users can regenerate individual artifacts without re-running the entire pipeline:

1. **Trigger**: `POST /api/projects/:id/regenerate` with `{ scope: "artifact_type" }`
2. **Fetch Latest Spec**: System retrieves the most recent spec for the project
3. **Regenerate**: Derives new artifact using current derivation logic
4. **Dependencies**: Some artifacts require dependencies:
   - `prose` requires `outline` and `cast`
  - `character_profiles` requires `cast` (uses LLM when Azure credentials are configured)
   - `game_pack` requires `cml` and `cast`
   - `fair_play_report` requires `cml` and `clues`
5. **Event**: If a run exists, adds event `${scope}_regenerated`

## Current Implementation State

### What's Working
- ✅ All API endpoints are functional
- ✅ Pipeline executes all steps synchronously
- ✅ Events are generated and stored
- ✅ Artifacts are created and queryable
- ✅ SSE provides real-time status updates
- ✅ CML access control is enforced
- ✅ Validation is performed at each step
- ✅ Character profiles and prose are LLM-generated when Azure credentials are configured
- ✅ Worker job registry handlers are implemented and invoke the full pipeline with a default theme

### What's Stubbed
- ⚠️ **In-memory storage** - No persistent database (data lost on restart)

### Architecture Readiness
The system is architected for:
- Async job execution (worker registry in place)
- Background processing (job context with runId/projectId)
- Event-driven workflows (SSE infrastructure)
- Scalable storage (repository pattern with db.ts interface)

Future scaling work will primarily involve:
1. Adding a job queue and async processing model
2. Passing user specs into worker jobs (rather than a default theme)
3. Implementing persistent storage for runs and artifacts

## Activity Logging

All HTTP requests and custom events are logged:

- **Create Log**: `POST /api/logs`
  - Body: `{ projectId?, scope, message, payload? }`
- **Query Logs**: `GET /api/logs?projectId=...`
- **Response**: `{ logs: [{ id, projectId, scope, message, payload, createdAt }] }`

Logs provide observability for debugging and audit purposes.

## Sample CML Files

The system includes reference CML examples:

- **List Samples**: `GET /api/samples`
  - Returns: `{ samples: [{ id, name, filename }] }`
- **Get Sample**: `GET /api/samples/:id`
  - Returns: `{ id, name, content }`

Sample files are located in `examples/` directory and provide inspiration (not direct copying) for mystery structure.
