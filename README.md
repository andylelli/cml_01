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
Full activity logging is enabled for API requests and UI actions (see /api/logs).
The UI restores the last project/spec/session state after refresh.
Spec draft supports optional comma-separated cast names for future LLM conditioning (no deterministic overrides).

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
	- optionally strip `Summary:` scaffolding for final prose mode
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

- Add a new background-context agent (story backdrop and cast ties):
	- why all cast are present at this setting/event
	- shared history and social ties among cast
	- pre-case tensions, obligations, and dependency web
	- location-anchored context (why this exact place, local customs, geography, routines)
	- setting-specific social context used for scene grounding
	- explicit links to location profile data (rooms/areas, access patterns, travel constraints)
- Use this artifact to improve opening chapters and scene-setting depth.
- Persist background-context outputs as CML-linked artifacts and validate against schema.

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
- Release gate fails publication when any are true:
	- critical continuity issue
	- mojibake artifact present
	- no valid discriminating test
	- missing suspect elimination coverage
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
