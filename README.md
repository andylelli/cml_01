# CML 2.0 — Crime Modeling Language

CML 2.0 is a formal, fair-play specification for modeling mystery logic.

It encodes **why a crime is misunderstood**, not how it is narrated.

## What CML Is For
- Designing fair-play detective fiction
- Validating mystery plots
- Generating solvable cases with AI
- Separating logic from prose

## What CML Is Not
- A plot outline
- A character sheet
- A trope list
- A story generator

## Core Idea
Every mystery fails because of **one mistaken belief**.

CML makes that belief explicit.

## Pipeline (Mandatory Order)

Spec → CML → Validate → Clues → Outline → Prose

Never reverse this order.

## Design Guarantees
- One primary deception axis
- No hidden evidence
- No confessions
- Reader-solvable logic

## Who This Is For
- Mystery writers who care about fairness
- Game designers building deduction systems
- AI researchers generating reasoning puzzles
- Editors and validators checking logic integrity

## Status

Phase 2 complete (Postgres-backed persistence, validation endpoints, artifact previews, run events).
Phase 3 complete (LLM pipeline execution, run events, novelty audit placeholder; no deterministic fallback artifacts).
Phase 4: Export packaging implemented (UI ExportPanel and backend export API endpoint allow users to download selected artifacts as a JSON file).
Phase 5: Prose and character profiles are LLM-generated; game pack generation is planned and not yet available without LLM support.
V1 complete: clue list with red herrings, fair-play report, simple suspect cards, and granular regenerate controls are now visible in the UI.
V2 complete: play mode chapter reveal, printable party kit PDF download, and community templates are available.
Story length selection is available in the spec (short/medium/long), and generated prose lengths can be exported as PDFs (single selected version or all available versions).
Deterministic fair-play guardrails now run before/after clue regeneration; one fair-play retry is attempted, and unresolved violations continue as warnings so downstream generation can complete.
Theme prompts can steer hard-logic construction (locked-room, timetable/math, botanical, acoustics, inheritance) and accept escalation phrases (`increase difficulty`, `make it brutal`) for more complex mechanism design.
Novel hard-logic device ideation is now a dedicated LLM stage: the pipeline generates a `hard_logic_devices` artifact first, while a separate `background_context` artifact captures backdrop context. CML generation consumes both with explicit separation (background coherence vs mechanism proof).
The web UI now surfaces this artifact in Review (Hard Logic tab), Advanced raw artifacts, and export selection.
Schema/flow remediation is in progress: retry-wrapper end-state behavior fixed (no extra post-failure generation), Agent 2b/2c/2d false missing-field validation errors resolved, worker path resolution hardened for API-launched runs, and runtime schema validation expanded for setting/cast/outline/prose artifacts.
Narrative clue pacing hardening is implemented: before prose, the worker now applies deterministic clue pre-assignment to enforce >=60% clue-bearing scenes (mapping-aware and act-balanced), using LLM outline retry only as fallback.
Narrative retry scene-count locking is implemented: outline retries now carry total/per-act count guardrails and are rejected if they shrink structure versus the baseline outline.
Month/season guardrail hardening is implemented: Agent 9 now derives season from temporal month, enforces a hard prompt lock, and deterministically normalizes conflicting season labels in month-anchored chapters before chapter validation.
Agent 9 prompt-contract hardening is implemented: each prose batch now includes a per-chapter obligation contract, frozen timeline-state block, explicit season allow-list, stronger overshoot-oriented underflow expansion guidance, optional self-audit stripping, and a targeted post-pass atmosphere repair for repeated cross-chapter phrasing.
Temporal validator contradiction-matrix hardening is implemented: story-validation now applies a shared month-to-forbidden-season matrix and normalized seasonal phrase detection (for example, `springtime`, `autumnal`, `wintry`) across both chapter-level and narrative-continuity checks, including dialogue references.
Suspect-elimination guardrail alignment is implemented: prose repair retries and release-gate hard-stops now share alias-aware validation failure classification, so key-name drift does not skip suspect-closure/case-chain repair instructions.
Prose template-leakage hardening is implemented: deterministic worker post-processing now rewrites scaffold-signature leakage and replaces repeated long boilerplate paragraphs with chapter-specific variants before release-gate checks.
Agent 9 now applies a deterministic pre-commit completeness gate: chapter minimum-word thresholds and chapter-level required clue obligations are validated before commit, with targeted retries when obligations are missing.
Prose clue-visibility expectation sourcing is now additive across CML clue mapping, clue distribution IDs, discriminating-test evidence clues, and clue registry IDs to reduce false critical completeness failures caused by partial mappings.
Agent 9 retries now include explicit error-class micro-prompts for clue visibility, word-count, and scene-grounding failures, improving correction specificity on follow-up attempts.
Agent 9 post-generation and release-gate diagnostics now persist expected-vs-extracted clue visibility sets (including missing/unexpected IDs) to accelerate root-cause triage.
Clue evidence/state semantics are now unified across scorer extraction and NSD diagnostics via a shared progression lattice: `introduced`, `hinted`, `explicit`, `confirmed`.
Agent 9 prompt assembly now uses token-budget accounting per context block with deterministic truncation/pruning, preserving critical constraints while preventing prompt overflow.
Validation-driven prose repair hardening is implemented: full-prose repair now starts with a fresh NarrativeState baseline, uses chapter-granular retries (`batchSize=1`, up to 3 attempts/chapter), and applies a softened early-chapter opening-style entropy gate while retaining fingerprint/ngram leakage checks.
Prose entropy hardening is now adaptive in standard mode: opening-style entropy thresholds ramp by chapter progress, and entropy-only residual failures no longer hard-abort prose after retry exhaustion.
Aborted-run observability is hardened: when a run fails after prose has started, a partial `post_generation_summary` diagnostic snapshot is now persisted before writing the aborted report.
Identity continuity remediation is optimized: role-alias drift now triggers chapter-targeted prose regeneration first, with full-story regeneration only as fallback.
Cast role-diversity hardening is implemented: Agent 2 enforces >=70% unique role archetypes, retries low-diversity outputs, and applies deterministic non-protected role diversification on the final attempt.
Full activity logging is enabled for API requests and UI actions (see /api/logs).
The UI restores the last project/spec/session state after refresh.
Spec draft supports optional comma-separated cast names for future LLM conditioning (no deterministic overrides).

## Scoring & Quality Reports

The pipeline includes an opt-in scoring system that evaluates each generation phase against measurable thresholds and produces a structured quality report.

### Enabling Scoring

Add to your `.env.local`:

```
ENABLE_SCORING=true
```

When disabled (default), the pipeline runs normally with no overhead. All scoring code is fully backward-compatible.

### How It Works

After each of the 9 generation agents completes, a scorer evaluates the output across four categories:

| Category | Weight | Description |
|---|---|---|
| Validation | 40% | Structural and logical correctness |
| Quality | 30% | Richness, specificity, and depth |
| Completeness | 20% | Required fields and sections present |
| Consistency | 10% | Internal coherence |

A phase score (0–100) is computed as a weighted sum. A phase **passes** if:
- Composite score ≥ phase threshold (default 75; strict phases use 85)
- All four category scores meet their minimum floors: validation ≥ 60, quality ≥ 50, completeness ≥ 60, consistency ≥ 50

### Retry Behaviour

If a phase fails its threshold, the pipeline automatically retries the LLM call with structured feedback injected into the prompt explaining which tests failed and what is required. Retry limits are configured in `apps/worker/config/retry-limits.yaml`:

- Per-phase retry limits: 2–4 retries depending on phase complexity
- Global cap: 15 total retries across all phases
- Backoff: exponential, linear, or none (per-phase config)
- `abort_on_max_retries: true` — hard-fails the generation if a phase exhausts all retries

### Threshold Modes

| Mode | Threshold | Used for |
|---|---|---|
| Strict | 85 | Hard Logic, Prose |
| Standard | 75 | Most phases |
| Lenient | 70 | Background, Temporal |

### Quality Tab in the UI

After a generation run completes, open the **Advanced → Quality** tab to view:

- **Score card** — overall grade (A–F), pass/fail summary, weakest/strongest phases, total retries
- **Phase breakdown table** — all 9 phases with scores, grades, expandable category details, test results, and retry history
- **Trend chart** — score history across the last 10 runs with pass/fail coloring and threshold reference line

The Quality tab is only populated when `ENABLE_SCORING=true` is set and at least one run has completed.

For Agent 9 prose phases, the Quality table now shows two chapter-by-chapter series when a full prose rerun happens: first pass and second run.
Agent 9 generation now also applies a provisional chapter-scoring loop during batch validation, feeding chapter-specific deficits forward as corrective directives so chapter N influences chapter N+1 prompt constraints before final scoring.

Quality reports now include a `diagnostics` section with structured runtime snapshots (for example, Agent 9 post-generation and release-gate diagnostics) so root-cause context is preserved alongside phase scores. Agent 9 post-generation diagnostics use scoped prose lifecycle metrics (`prose_duration_ms_first_pass`, `prose_duration_ms_total`, `prose_cost_first_pass`, `prose_cost_total`) and pass accounting (`rewrite_pass_count`, `repair_pass_count`, `per_pass_accounting`), plus online anti-template linter counters (`template_linter_checks_run`, `template_linter_failed_checks`, `template_linter_opening_style_entropy_failures`, `template_linter_paragraph_fingerprint_failures`, `template_linter_ngram_overlap_failures`).
Quality report persistence now includes a hard invariant gate in `@cml/story-validation` (`validateGenerationReportInvariants` / `assertGenerationReportInvariants`), so contradictory report payloads are rejected before storage/export (status mismatches, missing abort reason, template-linter abort contradiction).
The same invariant gate now also rejects NSD trace entries where clues are marked as newly revealed but no matching clue evidence anchors are present.
Discriminating-test validation is now component-based in `@cml/story-validation`: setup action, evidence usage, elimination logic, and outcome declaration are all required, and missing components are emitted with scene/paragraph pointers.
Scene-grounding validation now enforces opening-block requirements in `@cml/story-validation`: first-paragraph location anchoring plus sensory and atmosphere/time markers are required, and delayed grounding is flagged explicitly.
Character consistency validation now resolves cast aliases to canonical names, extends pronoun agreement checks into immediate follow-up sentence context, and flags titled out-of-cast named walk-ons (`illegal_named_walk_on`).
Known-bad report contradictions are replay-tested in the story-validation suite to prevent regression.
Fixed-seed prose benchmarks are now replay-tested in `@cml/story-validation` using deterministic run fixtures, with chapter-level expected outcome assertions (prose total + per-chapter score signatures) to catch scoring regressions early.
A/B prompt harness support is now available in `@cml/story-validation` (`comparePromptVariants`), with statistical winner selection gated by paired-seed sample size, minimum effect size, and a two-sided paired sign-test p-value threshold.
Quality dashboard prose chapter tables now include component-level chapter metrics (`V`, `Q`, `C`, `Co`) sourced from per-chapter scoring traces, including second-run repair series when present.

### API Endpoints

```
GET /api/projects/:projectId/runs/:runId/report    — Full report for a single run (or 202 in_progress while run is active)
GET /api/projects/:projectId/reports/history       — Last N reports for a project (?limit=N, default 10)
GET /api/reports/aggregate                         — Cross-project aggregate stats (success rate, grade distribution, common failures)
```

When a specific run report is unreadable, the report endpoint now falls back to the latest valid project report and marks it with `stale: true` and `stale_reason: "report_read_error"` instead of returning an opaque 500.
If a requested run report is still marked `in_progress: true` after the run is no longer active, the endpoint now avoids serving that incomplete snapshot as final output; it returns a finalized stale fallback (`stale_reason: "incomplete_report"`) or `409` when no finalized fallback exists.

`GenerationReport` now includes canonical run-status fields (`run_outcome`, `run_outcome_reason`) plus explicit `scoring_outcome` and `release_gate_outcome` blocks so score headlines and release outcomes are not conflated.
It also carries stage-aware validation snapshots (`pre_repair`, `post_repair`, `release_gate`) plus `validation_reconciliation` deltas for count lineage.
Release gating now fail-stops on unresolved clue-visibility divergence when NSD-revealed clues lack prose evidence anchors (`revealed_without_evidence > 0`).

Export packaging also supports `quality_report` (alias `scoring_report`) in `POST /api/projects/:id/export` so the latest quality report is included in artifact exports.
Export packaging also supports `narrative_state_trace` in `POST /api/projects/:id/export` so chapter-to-chapter NSD transfer data is directly inspectable without digging through the full report.

Reports are stored as JSON files in `apps/api/data/reports/{projectId}/{runId}.json`.

Pull requests welcome.

## Database (Postgres)
This project uses PostgreSQL as the system of record. You can run Postgres in Docker and point the API/worker to it with a standard connection string.

If `DATABASE_URL` is not set, the API falls back to a simple JSON file-backed store (default `data/store.json`, configurable via `CML_JSON_DB_PATH`).
The JSON store now writes directly to `store.json` (with retry handling for transient file-lock errors on Windows) and cleans up any legacy `store.json.*.tmp` files on startup.

Recommended environment variables:
- `DATABASE_URL` (e.g., `postgres://user:password@localhost:5432/cml`)
- `PGHOST`, `PGPORT`, `PGUSER`, `PGPASSWORD`, `PGDATABASE` (optional split vars)

Notes:
- Migrations/schema setup are handled by the backend service once implemented.
- The database is required for projects, specs, artifacts, and run history.

## Local startup (Windows)
- Run start-app.bat to install dependencies, build packages, and start API/worker/web.
- If starting manually, build @cml/cml and @cml/worker first (`npm run -w @cml/cml build` and `npm run -w @cml/worker build`) before running @cml/api dev.
- The API loads .env.local automatically at startup (Azure OpenAI + logging settings).
- Prose-only model routing is supported: set `AZURE_OPENAI_DEPLOYMENT_NAME_PROSE` to use a separate deployment for Agent 9 prose generation; all other agents continue using `AZURE_OPENAI_DEPLOYMENT_NAME`.

## Adding open-source seed CMLs
Use the grabber/ folder to generate CML 2.0 samples from public-domain or open-source whodunnits.
Outputs should be saved to examples/ as *_cml2.yaml files.

## Current Hardening Plan (2026-02-13)

### Cross-cutting mandate — Extended CML first
- Every new capability in this plan must be represented in an extended CML model first (no prose-only features).
- For each addition, update or create schema artifacts as needed.
- Integrate new fields/artifacts end-to-end across the process:
	- generation prompts/agents
	- orchestrator sequencing and artifact persistence
	- validation pipeline and gates
	- API retrieval/export surfaces
	- prose consumption/rendering
- No feature is considered complete until CML + schema + orchestration + validation are all wired.

### Phase 0 — Immediate hotfix
Status: implemented (2026-02-13).
- Clean prose before save/export:
	- remove system residue (e.g., “Generated in scene batches.”)
	- normalize mojibake (`â`, `faˆ§ade`, odd spacing chars)
	- strip illegal control characters while preserving valid multibyte Unicode text (UTF-8-safe behavior)
	- apply deterministic worker-side paragraph reflow (unwrap hard wraps, split overlong blocks, preserve whitespace readability)
	- apply deterministic worker-side scene-grounding backfill when chapter openings miss location/sensory/atmosphere anchors
	- optionally strip `Summary:` scaffolding for final prose mode
	- persist a readable plain-text story file in `stories/project_*.txt` with normalized chapter/summary/paragraph spacing
	- split overlong paragraph blocks for plain-text readability
	- enforce chapter scene grounding (named location + sensory + atmosphere cues) during prose retries
- Patch identity continuity bug pattern:
	- detect same entity renamed as role alias after arrest/confession
	- force regeneration of affected chapters when detected

Target areas:
- `apps/api/src/server.ts`
- `apps/worker/src/jobs/mystery-orchestrator.ts`

### Phase 1 — Story logic reliability
- Enforce disappearance→murder bridge as explicit narrative transition.
- Require discriminating test content:
	- at least one falsifiable test excluding all but one suspect
	- reject confrontation-only resolution without evidential exclusion
- Require suspect elimination ledger:
	- each prime suspect explicitly cleared with evidence
	- culprit tied by non-ambiguous evidence chain

Target areas:
- `packages/prompts-llm/src/agent9-prose.ts`
- `packages/story-validation/src`

### Phase 1.5 — Narrative foundation depth (new)
- Add victim profile artifact (dedicated profile for the victim):
	- identity, social role, reputation
	- relationships to each prime cast member
	- routines/habits, vulnerabilities, known conflicts
	- why this victim matters to the case stakes
- Require prose context to include victim profile signals early (so readers understand who was lost and why).
- Add victim profile into extended CML references and quality controls.

Target areas:
- `packages/prompts-llm/src` (new victim-profile agent/prompt)
- `schema` (new victim-profile schema)
- `apps/worker/src/jobs/mystery-orchestrator.ts` (pipeline integration)
- `packages/story-validation/src` (victim profile consistency checks)

Background-context agent status: implemented (LLM Agent 2e now active in pipeline).
- Added a background-context agent (story backdrop and cast ties):
	- why all cast are present at this setting/event
	- shared history and social ties among cast
	- pre-case tensions, obligations, and dependency web
	- location-anchored context (why this exact place, local customs, geography, routines)
	- setting-specific social context used for scene grounding
	- explicit links to location profile data (rooms/areas, access patterns, travel constraints)
- This artifact is used to improve opening chapters and scene-setting depth.
- Background-context outputs are persisted as CML-linked artifacts and validated against schema.

Target areas:
- `packages/prompts-llm/src` (new background-context agent)
- `schema` (new background-context schema)
- `apps/worker/src/jobs/mystery-orchestrator.ts` (pipeline placement before prose)
- `packages/prompts-llm/src/agent2c-location-profiles.ts` (location tie-in contract)
- `packages/prompts-llm/src/agent9-prose.ts` (consume background context)

### Phase 2 — Validation expansion
Status: implemented (2026-02-13).
- Add validators:
	- `NarrativeContinuityValidator`
	- `CaseTransitionValidator`
	- `DiscriminatingTestValidator`
	- `SuspectClosureValidator`
- Integrate all into `StoryValidationPipeline`.
- Strengthen encoding validator:
	- expanded replacement map
	- Unicode normalization (NFC)

Target areas:
- `packages/story-validation/src/index.ts`
- `packages/story-validation/src/pipeline.ts`
- `packages/story-validation/src/encoding-validator.ts`

### Phase 3 — Prompt/style quality
- Reduce repetitive atmospheric language:
	- anti-repetition thresholds
	- lexical variety across adjacent chapters
- Normalize dialogue punctuation (quotes/apostrophes) post-generation.

Target areas:
- `packages/prompts-llm/src/agent9-prose.ts`
- `apps/worker/src/jobs/mystery-orchestrator.ts`

### Phase 4 — QA gate + acceptance
Status: implemented (release gate checks active in pipeline).
- Release gate now hard-stops completion when critical prose defects remain:
	- mojibake/encoding artifact present
	- illegal control-character encoding corruption
	- template/scaffold leakage (duplicate long boilerplate blocks)
	- month/season contradiction in chapter text
	- severe placeholder token leakage (e.g., article+role+surname artifacts or repeated named placeholders)
	- duplicate chapter heading artifacts in generated titles
	- missing suspect elimination coverage
- Generic role phrase overuse (e.g., repeated "an inspector") is flagged as a warning; severe placeholder leakage still hard-stops.
- Agent 9 now applies baseline prose guardrails on every generation pass (canonical cast names only, explicit suspect-elimination ledger, explicit culprit evidence chain).
- Validation-guided prose repair now runs for both `needs_revision` and hard `failed` validation states (not only failed), reducing release-gate hard-stops from unresolved suspect-closure defects.
- Readability density and scene-grounding shortfalls continue as warnings for review.
- Emit compact per-run report.

Acceptance criteria:
- Zero encoding artifacts
- Zero identity/role continuity breaks
- Explicit disappearance→murder bridge present
- One clear discriminating test scene
- Every major suspect explicitly resolved

### Suggested execution order
1. Phase 0
2. Phase 2 (validators)
3. Phase 1 (prompt logic)
4. Phase 1.5 (victim + background agents)
5. Phase 3 (style)
6. Phase 4 (gate)

## Golden Age Hard-Logic Idea Generator Spec (captured)

This project now tracks the full hard-logic generator brief as implementation requirements.

### Role and objective
- Role: Golden Age detective plot engineer for 1920–1945 fair-play mysteries.
- Objective: generate novel, logically airtight murder mechanisms that are period-solvable.

### Core constraints
- Avoid overused trope shortcuts (e.g., twins-as-solution, generic gimmicks).
- No modern technology, electronics, modern forensics, or post-1945 science.
- Mechanism must hinge on at least one of:
	- physical law
	- mathematical principle
	- cognitive bias
	- social-logic mechanism
- Resolution must be contradiction-driven, such as:
	- testimony vs physical law
	- assumption vs measurable fact
	- habit vs observation
	- probability vs reality

### Required output shape per generated device
- Title of device
- Core principle
- Surface illusion
- Underlying reality
- Fair-play clues embedded in story
- Why it is not a trope
- Variation/escalation option

### Optional parameter support
- locked-room
- train journey
- seaside setting
- inheritance plot
- impossible crime
- pure mathematics
- botanical/medical angle
- multi-layer deception
- minimalist elegance
- diabolical construction
- cozy tone
- dark psychological tone

Default behavior when unspecified:
- generate 5 varied concepts.

### Style requirements
- precise
- economical
- no melodrama
- no filler
- no cliché motives unless structurally transformed
- diagrammable physical constructions
- avoid generic poison beats unless chemically novel and justified

### Escalation directives
- `increase difficulty`:
	- multi-step reasoning
	- combine two principles
	- at least one fair cognitive misdirection
- `make it brutal`:
	- near-impossible appearance
	- precision timing/geometry constructions
	- probability-based impossibilities
	- supernatural-seeming surface with rigorous logical core

### Implementation status

Implemented:
- Theme/location directive parsing into hard-logic mechanism families.
- Escalation phrase parsing (`increase difficulty`, `make it brutal`).
- Agent 3 hard-logic prompt constraints and contradiction-driven framing.
- Dedicated Agent 3b hard-logic ideation step that generates novel device concepts and persists `hard_logic_devices`.
- Agent 3 now consumes generated hard-logic devices as explicit grounding context.

Planned (next):
- Add trope-blocklist checks and novelty scoring for mechanism proposals.
- Add optional-parameter routing tests (locked-room/train/seaside/math/botanical/etc.).
- Add style lint pass for precision/economy and anti-filler enforcement.
