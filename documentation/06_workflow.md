# 06 Workflow

## Overview

This document describes the current implementation of the mystery generation workflow, including user actions, API endpoints, events, and CML content handling.

## User Actions → API Endpoints

### 1. Create Project
- **Endpoint**: `POST /api/projects`
- **Action**: Creates a new project with `idle` status
- **Response**: `{ id, name, status }`

### 2. Save Spec
- **Endpoint**: `POST /api/projects/:id/specs`
- **Action**: Stores user input specification (decade, cast size, tone, clue density, etc.)
- **Response**: `{ id, projectId, spec }`

### 3. Run Pipeline
- **Endpoint**: `POST /api/projects/:id/run`
- **Action**: Initiates the full mystery generation pipeline
- **Response**: `{ status: "running", projectId, runId }`
- **Side Effects**: Creates a run record, sets project status to `running`

### 4. Regenerate Artifact
- **Endpoint**: `POST /api/projects/:id/regenerate`
- **Body**: `{ scope: "setting" | "cast" | "cml" | "clues" | "outline" | "prose" | "game_pack" | "fair_play_report" }`
- **Action**: Re-generates a specific artifact type using the latest spec
- **Response**: `{ status: "ok", scope }`

## Pipeline Execution Flow

When a user triggers the pipeline via `POST /api/projects/:id/run`, the system executes the following steps synchronously:

### Step 1: Setting Generation
- **Derives**: `{ decade, locationPreset, weather, socialStructure, institution }`
- **Artifacts Created**:
  - `setting` - The derived setting data
  - `setting_validation` - Validation result
- **Event**: `setting_done` - "Setting generated"

### Step 2: Cast Generation
- **Derives**: `{ size, detectiveType, victimArchetype, suspects[] }`
- **Artifacts Created**:
  - `cast` - The derived cast data with suspect names
  - `cast_validation` - Validation result
- **Event**: `cast_done` - "Cast generated"

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
- **Validation**: Uses `@cml/cml` validator
  - If validation fails, retries once with temporal axis
- **Artifacts Created**:
  - `cml` - The complete CML document
  - `cml_validation` - Validation result `{ valid, errors }`
- **Events**: 
  - `cml_retry` - "CML failed validation; retrying" (if needed)
  - `cml_validated` - "CML validated"

### Step 4: Synopsis Generation
- **Derives**: `{ status, title, summary }` from CML metadata
- **Artifacts Created**:
  - `synopsis` - Brief case summary
- **Event**: `synopsis_done` - "Synopsis generated"

### Step 5: Novelty Audit
- **Current Implementation**: Stub that always passes
- **Artifacts Created**:
  - `novelty_audit` - `{ status: "pass", seedIds: [], patterns: [] }`
- **Event**: `novelty_audit` - "Novelty audit passed (no seeds selected)"

### Step 6: Clues Generation
- **Derives**: `{ status, density, axis, summary, items[] }`
  - Each clue item: `{ id, category, text, pointsTo, redHerring, revealChapter }`
  - Includes both genuine clues and red herrings (depending on density)
- **Artifacts Created**:
  - `clues` - All clue data
  - `clues_validation` - Validation result
- **Event**: `clues_done` - "Clues generated"

### Step 7: Fair Play Report Generation
- **Derives**: Validation checks from CML + clues:
  - `all_clues_visible` - All clues are visible
  - `no_late_information` - No late information
  - `reader_can_solve` - Reader can solve with given clues
  - `red_herrings_controlled` - Red herrings are clearly flagged
- **Artifacts Created**:
  - `fair_play_report` - `{ status, summary, checks[] }`
- **Event**: `fair_play_report_done` - "Fair-play report generated"

### Step 8: Outline Generation
- **Derives**: `{ status, tone, chapters, summary }`
- **Artifacts Created**:
  - `outline` - Story structure outline
  - `outline_validation` - Validation result
- **Event**: `outline_done` - "Outline generated"

### Step 9: Prose Generation
- **Derives**: Chapter-by-chapter narrative from outline + cast
  - Each chapter: `{ title, summary, paragraphs[] }`
- **Artifacts Created**:
  - `prose` - `{ status, tone, chapters[], cast[], note }`
- **Event**: `prose_done` - "Prose generated"

### Step 10: Game Pack Generation
- **Derives**: Interactive game materials from CML + cast
  - `{ title, suspects[], hostPacket, materials[] }`
- **Artifacts Created**:
  - `game_pack` - Complete game pack data
- **Event**: `game_pack_done` - "Game pack generated"

### Pipeline Completion
- After 5 seconds, project status returns to `idle`
- **Event**: `run_finished` - "Pipeline run finished"

## Run Events

All pipeline steps emit events that are stored and queryable:

- **Create Event**: `repo.addRunEvent(runId, step, message)`
- **Query Events**: `GET /api/runs/:id/events`
- **Response**: `{ runId, events: [{ step, message }] }`

Events provide a complete audit trail of what happened during a pipeline run.

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
- `GET /api/projects/:id/clues/latest`
- `GET /api/projects/:id/outline/latest`
- `GET /api/projects/:id/prose/latest`
- `GET /api/projects/:id/synopsis/latest`
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
- ✅ If Azure OpenAI credentials are missing, the pipeline falls back to deterministic placeholder generation

### What's Stubbed
- ⚠️ **LLM pipeline requires Azure OpenAI credentials** - Without credentials, generation falls back to deterministic placeholders
- ⚠️ **Worker jobs are placeholders** - All return `notImplemented`
- ⚠️ **Novelty audit always passes** - No actual similarity checking
- ⚠️ **In-memory storage** - No persistent database (data lost on restart)

### Architecture Readiness
The system is architected for:
- Async job execution (worker registry in place)
- Background processing (job context with runId/projectId)
- Event-driven workflows (SSE infrastructure)
- Scalable storage (repository pattern with db.ts interface)

The transition from deterministic to LLM-powered generation will primarily involve:
1. Implementing actual job handlers in `apps/worker/src/jobs/index.ts`
2. Integrating prompts from `@cml/prompts` package
3. Calling LLM APIs within each job
4. Potentially switching to async job queue (vs. synchronous pipeline)

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
