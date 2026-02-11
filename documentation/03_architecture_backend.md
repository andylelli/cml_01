# Architecture and Backend Implementation

## Repository structure (monorepo)
- /apps/web (Vue 3 + Vite + Tailwind + Headless UI)
- /apps/api (Node/TS API + orchestrator)
- /apps/worker (queue workers)
- /packages/cml (shared schema + validators)
- /packages/prompts (agent prompts)
- /packages/utils (logging, retries, rate limits)
- /examples, /schema, /validation

## API surface

### Artifacts
- GET /api/projects/:id/cml/latest (Advanced/Expert only)
- POST /api/projects/:id/cml/validate (Advanced/Expert only)
- GET /api/projects/:id/cml/validation/latest (Advanced/Expert only)
- GET /api/projects/:id/setting/latest
- GET /api/projects/:id/setting/validation/latest
- GET /api/projects/:id/cast/latest
- GET /api/projects/:id/cast/validation/latest
- GET /api/projects/:id/clues/latest
- GET /api/projects/:id/clues/validation/latest
- GET /api/projects/:id/outline/latest
- GET /api/projects/:id/outline/validation/latest
- GET /api/projects/:id/prose/latest
- GET /api/projects/:id/game-pack/latest
- GET /api/projects/:id/fair-play/latest
- GET /api/projects/:id/game-pack/pdf
- GET /api/projects/:id/synopsis/latest

### Projects
- POST /api/projects
- GET /api/projects
- GET /api/projects/:id

### Admin
- POST /api/admin/clear-store — clears JSON/Postgres persistence (projects, specs, artifacts, runs, logs)
- GET /api/llm-logs?projectId=&limit= — returns recent LLM log entries from the JSONL log file

### Export
- POST /api/projects/:id/export — Download a JSON file containing the latest version of selected artifacts (setting, cast, cml, clues, outline, fair_play_report, prose, game_pack). Accepts `{ artifactTypes: string[] }` in the body and returns a downloadable file. Used by the ExportPanel UI.

### Regenerate
- POST /api/projects/:id/regenerate — Regenerate a single artifact scope from the latest spec. Accepts `{ scope: string }` where scope is one of: setting, cast, cml, clues, outline, prose, game_pack, fair_play_report.

### Samples
- GET /api/samples
- GET /api/samples/:name
  - returns sample metadata and raw YAML content from examples/ for community templates

### Logging
- POST /api/logs — Record UI or system activity logs (scope/message/payload).
- GET /api/logs?projectId=... — Retrieve logs for debugging.
- HTTP requests with status >= 400 are also recorded with scope `http_error`.
- Activity logs are also appended to `apps/api/logs/activity.jsonl` for file-based inspection.

## Access control (conceptual)
- `mode = user | advanced | expert`
- Default UI and APIs return friendly projections only.
- CML endpoints exist but are not used by default UI.
- Direct CML editing endpoints are Expert-only with explicit warnings.
 - Phase 1 API skeleton reads `x-cml-mode` header to gate CML endpoints.
 - Phase 2 adds a CML validation endpoint that stores a `cml_validation` artifact.

## Orchestration pattern
State machine with retries:
SPEC_READY → SETTING_DONE → CAST_DONE → CML_DRAFT → CML_VALIDATED → CLUES_DONE → OUTLINE_DONE → PROSE_DONE

Phase 2 placeholder behavior:
- Run initiation stores a stub CML, validation result, and placeholder artifacts for clues/outline/prose.
Phase 3 start:
- Setting/cast/CML/clues/outline deterministic artifacts are derived from the latest saved spec when present.
Phase 3 completion:
- Pipeline executes deterministic step order with run events and stores a novelty audit artifact (pass when no seeds selected).

Phase 5 completion:
- Prose and game pack artifacts are generated deterministically (placeholder content) after outline.
- Game pack artifact is available via a dedicated API endpoint.

Artifact roles:
- **Canonical:** CML (always generated and stored).
- **Derived:** clues, outline, prose, and all friendly projections.
- UI defaults to derived artifacts; CML is hidden unless Advanced/Expert mode is enabled.

Spec extensions:
- `castNames` (optional array or comma-separated string) overrides the placeholder cast list in deterministic generation.
- If `castNames` is omitted, the API generates a default list of readable names.

Derived friendly projections now include:
- `fair_play_report` (overall status, summary, checklist items, violations, warnings)
- `synopsis` (readable summary derived from CML)

## Prose + game pack (Phase 5)
- Prose generation is currently deterministic placeholder output derived from outline and cast.
- Game pack generation is currently deterministic placeholder output derived from CML and cast.

Functional policies:
- One active run per project (queue additional runs)
- Regenerate scopes map to specific artifacts
- Retry policy by step with max attempts
- Partial failure behavior: rollback or keep last valid artifact

## Worker jobs
- settingJob
- castJob
- cmlJob
- validateCmlJob
- cluesJob
- outlineJob
- proseJob
- gamePackJob

Each job reads prior artifact, calls Azure OpenAI, validates output, writes new artifact version, emits SSE.

## Azure OpenAI integration
- Centralized client for model routing and telemetry
- Per-agent prompt templates and strict JSON output enforcement
- Retries, rate limits, and timeouts

## Data model (Postgres)
- projects(id, name, created_at)
- spec_versions(id, project_id, spec_json, created_at)
- artifact_versions(id, project_id, type, payload_json, created_at, source_spec_id)
- runs(id, project_id, status, started_at, finished_at)
- run_events(id, run_id, step, message, created_at)
- activity_logs(id, project_id, scope, message, payload_json, created_at)

## Database runtime (Postgres in Docker)
- Postgres is the primary datastore and is expected to run in Docker in local dev.
- Services connect via `DATABASE_URL` (preferred) or split `PG*` environment variables.
- The DB stores canonical CML, derived artifacts, versions, and run history.
- When `DATABASE_URL` is not set, the API uses a simple JSON file-backed repository (default `data/store.json`, override with `CML_JSON_DB_PATH`).
- The JSON file-backed repository writes via temporary files with retry logic for missing directories and Windows file-lock errors (EPERM/EBUSY), falling back to copy+unlink when rename fails.

Provenance fields to add if needed:
- artifact_versions.prompt_version
- artifact_versions.model_name
- artifact_versions.parent_artifact_id
- artifact_versions.seed_ids
- artifact_versions.seed_patterns

## Diagrams
### Conceptual flow
```mermaid
flowchart TD
  U["User Inputs\nSetting Cast Logic Output Style"] --> S[MysterySpec]
  S --> CML["CML 2 0 Draft"]
  CML --> V["Validator\nSchema and Checklist"]
  V -->|Pass| CL["Clues and Red Herrings"]
  V -->|Fail| CML
  CL --> O[Outline]
  O --> P["Prose optional"]
  CML --> ADV["Advanced/Expert CML Viewer"]
  CL --> UI["Friendly Projections"]
  O --> UI
  P --> UI
  UI --> E["Exports and Play Kit"]

## Export packaging
- The backend supports packaging selected artifacts into a downloadable JSON file via the export API endpoint.
- The UI ExportPanel allows users to select which artifacts to include and triggers the download.
```

### Technical architecture
```mermaid
flowchart LR
  subgraph Web["Vue 3 and Tailwind UI"]
    W1[Builder Wizard]
    W2[Advanced/Expert CML Viewer]
    W3[Clue Board]
    W4[Outline Viewer]
    W5[Samples Gallery]
  end

  subgraph API["Node TS API"]
    A1[SpecService]
    A2[CmlService]
    A3[ClueService]
    A4[OutlineService]
    A5[Run Orchestrator]
    A6[SampleCmlService]
  end

  subgraph Worker[Queue Worker]
    J1[Setting Job]
    J2[Cast Job]
    J3[CML Job]
    J4[Validate Job]
    J5[Clues Job]
    J6[Outline Job]
    J7[Prose Job]
  end

  subgraph Shared["Shared Packages"]
    P1["CML Schema and Validators"]
    P2[Prompt Library]
    P3[Azure OpenAI Client]
  end

  subgraph Storage[Storage]
    DB[(Postgres)]
    FS[(examples and schema)]
  end

  W1 --> A1
  W2 --> A2
  W3 --> A3
  W4 --> A4
  W5 --> A6
  A5 --> Worker
  Worker --> P3
  API --> DB
  A6 --> FS
  Worker --> P1
  Worker --> DB
  API --> P1
  API --> P2
```
