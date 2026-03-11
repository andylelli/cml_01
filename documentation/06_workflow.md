# 06 Workflow

## Overview

This document describes the current implementation of the mystery generation workflow, including user actions, API endpoints, events, and CML content handling.

## User Actions → API Endpoints

### 1. Create Project
- **Endpoint**: `POST /api/projects`
- **Action**: Creates a new project with `idle` status
- **Performance note**: project creation remains metadata-only in the Project tab; broad artifact loading is deferred until artifact/review views are requested.
- **Response**: `{ id, name, status }`

### 1b. List Projects
- **Endpoint**: `GET /api/projects`
- **Action**: Returns existing projects for reload dropdown
- **Response**: `{ projects: [{ id, name, status, createdAt? }] }`

### 1c. Latest Run (Project)
- **Endpoint**: `GET /api/projects/:id/runs/latest`
- **Action**: Returns latest run metadata for the project
- **Response**:
  - `200` with run object when a run exists
  - `200 { run: null }` when the project has no runs yet
- **UI behavior**: when latest run is null, the frontend does not fan out artifact `/latest` requests, avoiding expected new-project 404 noise.

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
- **Response**:
  - `200`: `GenerationReport` (includes `diagnostics[]` snapshots when available)
  - `202`: `{ status: "in_progress", projectId, runId }` when the run is active and the report is not yet materialized
  - `200` stale fallback (`stale_reason: "incomplete_report"`): when the requested run report is still marked `in_progress: true` but the run is no longer active, the endpoint returns the latest finalized project report instead of serving the incomplete snapshot
  - `200` stale fallback: when the requested run report is unreadable but another valid report exists for the same project, returns latest valid report plus `stale: true`, `stale_reason`, and `requested_run_id`
  - `409`: when the run is no longer active and only an `in_progress` snapshot exists (no finalized fallback report available)
  - Agent 9 diagnostics include `nsd_transfer_trace` entries showing batch-by-batch NarrativeState handoff (before/after tails, clue propagation, and clue evidence anchors).
  - `release_gate_summary` includes `nsd_visibility_divergence` to surface mismatches between NSD-revealed clues and clues with prose evidence.

Report status semantics:
- Treat `run_outcome` as authoritative for run status (`passed | failed | aborted`).
- Treat `overall_score`/`overall_grade` as scoring context, not final release truth.
- Use `validation_snapshots.pre_repair`, `validation_snapshots.post_repair`, and `validation_snapshots.release_gate` to interpret issue-count deltas (`validation_reconciliation`).
- Treat post-generation prose metrics as scoped fields: `prose_duration_ms_first_pass` / `prose_duration_ms_total` and `prose_cost_first_pass` / `prose_cost_total`; use `rewrite_pass_count`, `repair_pass_count`, and `per_pass_accounting` for lifecycle attribution.
- Treat `template_linter_*` fields in `post_generation_summary` as online prose anti-template telemetry (batch checks run/failed plus entropy, fingerprint, and n-gram failure breakdown).
- Treat `fair_play_*` fields in `post_generation_summary` (`fair_play_all_clues_visible`, `fair_play_discriminating_test_complete`, `fair_play_no_solution_spoilers`, `fair_play_component_score`) as the component-level prose fair-play breakdown used to diagnose recurring 60% outcomes.
- Treat `clue_visibility_expected_ids`, `clue_visibility_extracted_ids`, `clue_visibility_missing_expected_ids`, and `clue_visibility_unexpected_extracted_ids` as the primary expected-vs-observed clue-visibility triage payload in post-generation and release-gate diagnostics.
- Treat clue-state telemetry as canonical progression data: `clue_state_by_id` now uses `introduced|hinted|explicit|confirmed` in NSD transfer steps and release-gate divergence diagnostics.
- Report writes now pass a hard invariant check before persistence/export; contradictory status payloads are rejected (for example: aborted runs missing reason, or template-linter abort reason with zero template-linter failed checks in diagnostics).
- Report writes now also reject NSD trace contradictions: if `newly_revealed_clue_ids` are present without matching `clue_evidence_anchors`, persistence fails.
- Story-validation now includes fixed-seed replay benchmarks for prose scoring that assert deterministic chapter-level outcomes from selected quality-report fixtures before changes are accepted.
- Story-validation now also provides an A/B prompt harness utility for variant evaluation on paired seeds; winner selection is gated by minimum sample size, minimum effect size, and paired sign-test statistical significance.
- Prose per-chapter scoring traces now include component-level chapter metrics (validation, quality, completeness, consistency) for both first-pass and repair-pass chapter series, and these are surfaced in Quality dashboard chapter tables.

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
- **Schema gate (implemented)**: Setting payload is now validated against `setting_refinement.schema.yaml` in-worker before downstream phases proceed. If validation fails, the setting is regenerated once before abort.
- **Fair-play retry strategy (implemented)**: The audit runs twice (initial + 1 clue regen). If still failing, the failure is classified: `inference_path_abstract`/`constraint_space_insufficient` → CML structural revision; `clue_only` → a third targeted clue regeneration pass. The CML Validation Gate only hard-stops on structurally-blocking violations (`Clue Visibility`, `Logical Deducibility`, `No Withholding`). `Information Parity` and `Solution Uniqueness` violations are clue-phrasing issues that produce warnings and allow prose to proceed.

### Step 2: Cast Generation
- **Derives**: `{ size, detectiveType, victimArchetype, suspects[] }`
- **Artifacts Created**:
  - `cast` - The derived cast data with suspect names
  - `cast_validation` - Validation result
- **Event**: `cast_done` - "Cast generated"
- **Guardrail**: Non-empty stereotypeCheck triggers retry and block pipeline if unresolved
- **Scoring guardrails** (implemented): Phase fails if `completeness_score < 60`, which requires ≥ 5 characters (when 7 requested), ≥ 3 eligible suspects, and role-archetype diversity aligned to scorer thresholds (>=70% unique archetypes).
- **Retry hardening (implemented):** Agent 2 now retries not only for character-count/suspect shortfalls but also for low archetype diversity; on final attempt, a deterministic non-protected role-archetype diversification fallback runs first, and the agent now hard-fails if diversity still remains below threshold.
- **Schema gate (implemented)**: Cast payload is validated against `cast_design.schema.yaml` (aligned to runtime `crimeDynamics` keys and `latencyMs`). If validation fails, the cast is regenerated once with targeted schema-repair guardrails before abort.

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
- **Schema gate (implemented)**: Outline payload is validated against `narrative_outline.schema.yaml` in-worker.
- **Schema-repair retry (implemented)**: if the first outline fails schema validation, Agent 7 is regenerated once with targeted schema-fix guardrails before the run is aborted.
- **Clue pacing gate (implemented)**: Before prose generation, the worker enforces `cluesRevealed` coverage in at least 60% of scenes.
  - Runs deterministic clue pre-assignment first (mapping-aware, essential-clue anchoring, gap-filling, act-balanced threshold fill).
  - Falls back to one LLM outline retry only if deterministic repair is still below threshold, then applies a final deterministic pass on the retry result.
- **Scene-count lock (implemented)**: Outline retries (coverage or pacing) include exact count guardrails and are rejected if total scenes or any act's scene count differs from the baseline outline.

### Step 9: Prose Generation
- **Derives**: Chapter-by-chapter narrative from outline + cast (LLM)
  - Each chapter: `{ title, summary, paragraphs[] }`
- **Post-processing**: Prose is sanitized before persistence (Unicode NFC normalization, mojibake cleanup, system-residue stripping).
- **Readability formatting (implemented)**: pipeline now writes a readable plain-text story file in `stories/project_*.txt` with normalized chapter spacing, summary/body separation, and paragraph breaks.
- **Worker readability reflow (implemented)**: prose chapters are deterministically reflowed before release checks (hard-wrap collapse + sentence-boundary splitting of overlong paragraph blocks).
- **Encoding hardening (implemented)**: sanitization strips illegal control characters while preserving valid multibyte Unicode content.
- **Scene-grounding backfill (implemented)**: if a chapter opening misses required location/sensory/atmosphere grounding signals, worker post-processing prepends a location-profile-based grounding lead.
- **Template-leakage prevention hardening (implemented)**: worker post-processing now rewrites known scaffold-signature leakage and replaces repeated long paragraphs with deterministic chapter-specific variants before release-gate checks.
- **Chapter validation (implemented)**: generation retries now include readability density checks and scene-grounding checks (location anchor + sensory + atmosphere cues) in addition to existing consistency checks.
- **Pre-commit completeness gate (implemented)**: before each chapter batch is committed, Agent 9 now enforces deterministic completeness checks (minimum words by target length and required clue-obligation coverage per chapter from CML mapping + scene clue assignments). Any missing obligation forces retry rather than persisting incomplete prose.
- **Error-class retry micro-prompts (implemented)**: retry attempts now include targeted corrective directives for clue visibility, word-count, and scene-grounding failures instead of generic retry text.
- **Prompt budgeting (implemented)**: Agent 9 now assembles prompts from priority-tagged context blocks with token estimation, per-block caps, and deterministic pruning (`optional` -> `medium` -> `high`; critical blocks preserved).
- **Entropy hardening (implemented)**: opening-style entropy now uses an adaptive threshold in standard prose generation (lower early-chapter floor, canonical later floor), and entropy-only residual failures no longer hard-abort prose after retry exhaustion.
- **Baseline prose guardrails (implemented)**: every prose generation pass includes strict cast-name enforcement (no invented titled placeholders), explicit suspect-elimination coverage requirements, and explicit culprit evidence-chain requirements.
- **Prose clue-visibility scoring hardening (implemented)**: prose scoring adaptation now detects clue coverage via semantic clue signatures (Agent 5 clue description/points-to keywords) in addition to literal clue IDs, so fair-play completeness is measured on surfaced evidence content rather than ID token echo.
- **Discriminating-test component validation (implemented)**: story validation now requires all four discriminating-test components (setup action, evidence usage, elimination logic, outcome declaration). Missing pieces are reported as specific error types with scene/paragraph mapping to support targeted chapter rewrites.
- **Scene-grounding opening-block hardening (implemented)**: chapter validation now requires the opening block (first 1-2 paragraphs) to contain a named location anchor and minimum sensory plus atmosphere/time markers; delayed grounding is flagged for rewrite.
- **Character validator hardening (implemented)**: story validation now treats configured aliases as canonical cast references, applies pronoun agreement checks through immediate follow-up sentence context, and flags titled out-of-cast named walk-ons as major issues.
- **Month/season lock hardening (implemented)**: prose generation derives canonical season from temporal month and enforces it in two layers: (1) prompt-level hard season-lock instructions, and (2) deterministic chapter-text normalization before per-chapter validation when locked-month chapters include conflicting seasonal labels.
- **Temporal contradiction matrix hardening (implemented)**: story-validation now uses a shared month/season contradiction analyzer across chapter validation and narrative continuity validation, with explicit month-to-forbidden-season mapping and normalized season phrase detection (including dialogue phrases and variants such as `springtime`, `autumnal`, and `wintry`).
- **Per-chapter provisional scoring feedback (implemented)**: Agent 9 now computes provisional chapter scores during batch validation and carries chapter-local deficits/directives forward into the next batch prompt, so weak chapter-N signals (for example thin paragraph structure or clue surfacing drift) are actively corrected in chapter N+1 generation constraints.
- **Batch retry telemetry fix (implemented)**: Agent 9 validation details now track true batch counts (`totalBatches = ceil(sceneCount / batchSize)`) and batch-level retry incidence (`batchesWithRetries`) instead of chapter-level counts when multi-scene batching is enabled.
- **Validation-repair trigger (implemented)**: prose repair regeneration now runs when validation returns `needs_revision` as well as hard failure states.
- **Repair-mode batching (implemented)**: validation-driven full-prose repair runs chapter-by-chapter (`batchSize=1`) with higher per-chapter retry budget (up to 3 attempts), reducing broad reruns when a single chapter fails.
- **Aborted-run observability hardening (implemented)**: if a run fails after prose has started but before final prose scoring completes, the worker now persists a partial `post_generation_summary` diagnostic snapshot before writing the aborted partial report.
- **Repair-mode linter profile (implemented)**: early repair chapters use a softened opening-style entropy gate (warm-up + lower threshold) while paragraph-fingerprint and n-gram overlap checks remain strict.
- **Repair-run NarrativeState reset (implemented)**: full-prose repair starts from a fresh NarrativeState baseline (locked facts + pronouns) so failed-pass style history does not contaminate repair startup.
- **No full-phase prose retry (implemented)**: the worker no longer re-runs Agent 9 end-to-end via generic phase retry. Prose now runs once per pipeline pass, with reliability handled by chapter-batch retries inside Agent 9 plus targeted validation/identity/schema repair paths.
- **Re-score accounting hardening (implemented)**: identity/schema replacement-prose re-scoring now uses a shared updater that preserves accumulated Agent 9 cost/duration attribution in quality telemetry.
- **Suspect-elimination alignment (implemented)**: repair-trigger classification and release-gate hard-stop now use the same alias-aware suspect-elimination detector (type + message), preventing guardrail misses when validator key strings vary.
- **Guardrail**: If post-reveal chapters drift into role-only culprit aliasing after arrest/confession, worker first regenerates only drifted chapters, then falls back to one full-prose regeneration if needed; unresolved drift fails the run.
- **Artifacts Created**:
  - `prose_<length>` - `{ status, tone, chapters[], cast[], note }` where `<length>` is `short`, `medium`, or `long`
- **Event**: `prose_done` - "Prose generated (<length> format)"
- **Schema gate (implemented)**: Prose payload is validated against `prose.schema.yaml` in-worker prior to final validation pipeline execution. If validation fails, the prose is regenerated once with targeted schema-repair guardrails before abort.

### Retry/config path reliability (implemented)
- Worker no longer derives retry config/log/examples paths from `process.cwd()`.
- Paths now resolve from workspace root via module path, preventing API-launched ENOENT drift (e.g., `apps/api/apps/worker/...`).

### Step 10: Game Pack Generation
**Status:** Planned. Game pack generation is not yet available without LLM support and is not produced in the current pipeline run.

### Pipeline Completion
- After the pipeline finishes (success or failure), project status returns to `idle`
- **Event**: `run_finished` - "Pipeline run finished"
- **Release Gate (hard-stop)**: pipeline aborts completion when critical prose defects remain after repair (mojibake artifact, illegal-character encoding corruption, template-leakage scaffolds/duplicate long blocks, month/season contradictions, unresolved placeholder-token leakage, duplicate chapter-heading artifacts, suspect-elimination coverage missing).
- **Release Gate (hard-stop)**: pipeline aborts completion when NSD/prose clue-visibility divergence remains unresolved (`revealed_without_evidence > 0`), in addition to the defects above.
- **Release Gate (warning mode)**: readability density and scene-grounding coverage gaps are surfaced as warnings for review and do not block completion.

## Run Events

All pipeline steps emit events that are stored and queryable:

- **Create Event**: `repo.addRunEvent(runId, step, message)`
- **Query Events**: `GET /api/runs/:id/events`
- **Response**: `{ runId, events: [{ step, message }] }`

Events provide a complete audit trail of what happened during a pipeline run.
Validation events now distinguish chapter-level prose validation from the post-generation full-story validation gate (for example, `Full-story validation ...` messages), so run history semantics remain clear during repair cycles.
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
  - Supports `quality_report` (alias `scoring_report`) to include the latest scoring report with diagnostics.
  - Supports `narrative_state_trace` to include a flattened chapter-to-chapter NSD handoff trace for scrutiny.

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
