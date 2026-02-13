# LLM & AI Integration Plan (Azure OpenAI)

## Goals
- Centralize model access and logging
- Enforce strict JSON outputs per agent
- Support reproducibility and traceability
- Guarantee CML-first ordering and fair-play constraints
- Enforce novelty vs seed CMLs and prevent copying
- Pipeline runs require Azure OpenAI credentials; no deterministic fallback artifacts are produced.

## Where LLM interaction is required (by pipeline stage)

### 1) Setting generation
**Purpose:** Generate era constraints, setting bible, and realism constraints.
**Input:** decade + location preset + user notes
**Output:** setting bible (constraints on tech, travel, policing, social norms)
**Validation:** check for anachronisms/implausibilities; non-empty realism lists trigger retry and block pipeline
**Uniqueness:** prompts include a per-run uniqueness seed (runId/projectId) to encourage varied settings within the spec.
**Period accuracy:** prompts require 2–3 period-accurate anchors (politics, science, current affairs) in atmosphere/recommendations.

### 2) Cast generation
**Purpose:** Generate cast list with secrets, motives, alibis, and access.
**Input:** cast size + roles + relationship preset
**Output:** cast section matching schema; uses culpability = unknown until CML is finalized
**Validation:** required fields present; no stereotype or protected-class harm
**Fallbacks:** if the model returns too few characters or missing fields, the system pads and normalizes the cast with safe defaults to keep the pipeline moving.
**Guardrail:** non-empty stereotypeCheck triggers retry and blocks pipeline if unresolved.
**Uniqueness:** prompts include a per-run uniqueness seed (runId/projectId) to encourage varied casts within the spec.


### 3) CML generation (core)
**Purpose:** Generate CML 2.0-compliant case.
**Input:** setting bible + cast + logic knobs
**Output:** full CML 2.0 draft including false_assumption, discriminating_test, and quality_controls targets for fair-play and clue visibility
**Validation:** schema + checklist, and “one primary axis” rule
**Setting fidelity:** enforce a setting lock in CML generation so all downstream artifacts stay in the specified location type.
**Spec adherence:** CML generation explicitly incorporates the spec parameters (decade, location preset, tone, theme, cast size/names, primary axis) and must reflect them in meta and narrative summary.
**Novelty:** seeds may guide abstract structure only (axis, mechanism families, cadence); never copy specific characters, events, clue wording, reveal logic, or inference paths. Similarity threshold is configurable via `NOVELTY_SIMILARITY_THRESHOLD` (default 0.9, lenient). Set `NOVELTY_SKIP=true` (or use a threshold >= 1.0) to skip the novelty check entirely. Returned similarity scores are normalized by recomputing the weighted overall similarity and enforcing pass/warn/fail thresholds, and the math is logged to run events and LLM logs.
**Imagination:** the CML generator must use inventive, non-obvious combinations of setting details, false assumptions, access paths, and discriminating tests while staying fair-play and era-accurate.
**Divergence constraints:** CML generation receives explicit divergence constraints derived from seed patterns (era/location, method, false assumption, discriminating test) to avoid overlap.
**Recovery:** If novelty audit fails, CML is regenerated once with stronger divergence constraints, then re-audited.
**Parsing safety:** JSON parsing attempts include JSON repair and extraction of the outermost JSON object; if that fails, YAML output is sanitized to strip trailing inline text after quoted values before retrying.
**Output guardrails:** Agent 3 includes a required YAML skeleton to avoid missing mandatory fields.
**Schema normalization:** After parsing, missing required fields are filled with safe defaults before validation to stabilize runs.

### 4) CML revision
**Purpose:** Fix validator failures in a targeted manner.
**Input:** failed validation report + current CML
**Output:** corrected CML; no new facts outside constraint space
**Validation:** rerun schema + checklist, plus novelty audit vs selected seeds
**Schema normalization:** Agent 4 normalizes parsed CML to fill required fields, including inference_path step fields (observation/correction/effect) and valid discriminating_test.method enums before validation.
**Parsing safety:** If strict JSON parsing fails, Agent 4 attempts JSON repair and YAML sanitization before retrying.

### 5) Clue & red herring generation
**Purpose:** Derive fair-play clue list from CML.
**Input:** validated CML + clue density + red-herring budget
**Output:** clues grouped by category; red herrings tied to false assumption
**Validation:** all clues grounded in CML facts; no new facts added
**Quality controls:** uses CML quality_controls targets (essential clue minimums and placement counts) when present

### 6) Fair-play audit
**Purpose:** Evaluate fairness and reader-solvability against CML + clue distribution.
**Input:** validated CML + clues
**Output:** structured audit (overall status, checklist items, violations, summary)
**Validation:** required fields and status enums; missing fields cause a hard failure. `fail` or `needs-revision` triggers a single clue-regeneration pass with audit feedback, then continues with warnings.

### 7) Outline generation
**Purpose:** Build chapter/act outline with proper clue placement.
**Input:** validated CML + clues + cast
**Output:** outline with clue placement markers
**Validation:** load-bearing clues appear before solution; discriminating test placed late
**Setting fidelity:** all scenes must remain within the CML setting; no location-type drift.
**CML compatibility:** downstream agents derive context from CML 2.0 fields when legacy setup/crime fields are missing.
**Parsing safety:** narrative outline parsing uses JSON repair and JSON extraction when needed.
**Fallbacks:** if totals are missing, total scenes/words are derived from scene estimates to avoid run failure.

### 7b) Character profile generation (optional)
**Purpose:** Produce full character profiles without altering CML logic.
**Input:** cast list (+ optional setting tone)
**Output:** per-character narrative profiles (target ~1000 words each), including private secrets and motive context
**Validation:** must not introduce new facts or contradict CML; private details must align with cast/CML
**Current build:** LLM-generated profiles (implemented).

### 8) Prose generation (optional)
**Purpose:** Produce narrative prose without altering logic.
**Input:** outline + style capture
**Output:** prose chapters
**Validation:** must not introduce new facts; style must not copy copyrighted text
**Setting fidelity:** prose must stay consistent with the CML setting (e.g., a liner remains a liner).
**Completeness:** prose must include one chapter per outline scene; missing chapters trigger a retry.
Long outlines are generated in scene batches to ensure all chapters are produced within token limits.
**Current build:** LLM-generated prose from outline + cast (implemented).
**CML compatibility:** narrative context is built from CML 2.0 structures when legacy fields are absent.

### 9) Game pack generation (optional)
**Purpose:** Create suspect cards and host packet.
**Input:** CML + cast
**Output:** printable assets
**Validation:** all facts consistent with CML
**Current build:** game pack generation is planned and not yet available without LLM support.
**CML compatibility:** novelty/fair-play context tolerates missing legacy fields by falling back to CML 2.0 fields.

### 10) Sample CML analysis (optional)
**Purpose:** Summarize or normalize examples for seeds and regression tests.
**Input:** examples/ CML files
**Output:** summaries, normalized variants (if required)
**Validation:** schema compatibility checks
**Constraint:** outputs must not be used as templates or copied into generated CMLs
**Resilience:** missing or empty examples directories are handled gracefully (no error, no seed patterns).

---

## Model access layer
- Single `AzureOpenAIClient` used across API and worker
- Handles retries, timeouts, rate limits, and logging
- Supports model routing per agent (e.g., reasoning model for CML validation, fast model for outline)
- Enforces JSON mode and schema constraints
- The deployment name is always taken from `AZURE_OPENAI_DEPLOYMENT_NAME` (set to GPT-4o-mini)

## Prompting strategy
- System + developer instructions per agent
- Strict JSON schema in prompt output section
- No-new-facts rule for downstream agents
- Role separation: generative agents cannot override validator outputs
- Seed usage: structural inspiration only, never content copying

## Output validation
- All LLM outputs validated against schemas
- Reject and retry if invalid
- Log raw responses for audit
- Diff checker: detect unintended changes outside requested sections
- Novelty audit: compare generated CML to selected seeds (configurable similarity threshold) and force regeneration with stronger divergence constraints if too similar to any single seed. Set `NOVELTY_HARD_FAIL=true` to make similarity failures block the pipeline; otherwise failures continue as warnings.
- Schema validation implementation is staged via a shared package (Phase 2) and now validates required fields, types, and allowed enums based on the custom CML schema format.

## Safety & compliance
- Avoid copyrighted text replication
- Style capture applied to prose only
- Input sanitization to prevent prompt injection
- Instruct model not to output personal data

## Telemetry & observability
- Log model name, prompt version, latency, token usage
- Store request/response hashes for diffing
- Attach run_id and artifact_id to each response
- LLM logging uses environment configuration (LOG_LEVEL, LOG_TO_FILE, LOG_FILE_PATH, LOG_TO_CONSOLE)
- API loads .env.local at startup to populate Azure OpenAI and logging settings
- Cost tracking uses model-aware rates (GPT-4, GPT-4o, GPT-4o-mini) to avoid inflated estimates when running mini deployments
- Current defaults use Sweden Central GPT-4o-mini regional rates in GBP
- Advanced UI exposes LLM operational logs (metadata only; raw prompts/responses are not stored)

## Failure handling
- Retry policy with exponential backoff
- Circuit breaker for repeated failures
- Human review path for persistent validation errors

## Acceptance workflow
- LLM outputs are drafts until user accepts
- Rejected outputs are archived but not active
- Accepted outputs lock downstream steps unless explicitly regenerated

---

## UI component AI-need checklist

### ProjectDashboard
- AI needed: No
- Notes: Displays existing data and run history only

### BuilderWizard
- AI needed: Indirect (runs pipeline)
- Notes: Wizard itself is UI; AI runs when user clicks Run Pipeline

### SettingForm
- AI needed: Optional
- Notes: “Suggest setting” action can call LLM for setting bible draft

### CastForm
- AI needed: Optional
- Notes: “Generate cast” calls LLM; user accepts/rejects each entry

### LogicForm
- AI needed: Optional
- Notes: “Suggest logic axis/mechanisms” can call LLM; validation still enforced

### OutputForm
- AI needed: No
- Notes: Pure configuration; style text is user-provided

### CmlTreeView
- AI needed: No
- Notes: Displays generated CML in Advanced/Expert modes only; no LLM required

### ValidationChecklistPanel
- AI needed: No
- Notes: Uses deterministic checklist + schema validator

### ClueTable
- AI needed: Optional
- Notes: “Generate clues” uses LLM; editing clues is manual

### OutlineTimeline
- AI needed: Optional
- Notes: “Generate outline” uses LLM; re-ordering is manual

### ArtifactVersionTimeline
- AI needed: No
- Notes: Shows history and provides rollback/compare

### SampleCard / SamplesGallery
- AI needed: Optional
- Notes: “Summarize sample” can use LLM; loading samples is non-AI

### SpoilerToggle
- AI needed: No

### RunStatusBanner
- AI needed: No
- Notes: Shows pipeline status from SSE

---

## Appendix: Input ownership

### User input required
- Project name and description
- MysterySpec settings (decade, location preset, tone)
- Cast constraints (size, roles, relationship preset, secret intensity)
- Logic constraints (primary axis, mechanism families, fair-play toggles)
- Output preferences (format, POV, length)
- Writing style capture (sample or descriptor)
- Sample selection (seed patterns only; no copying of sample content)
- Regeneration scope (which artifacts to rebuild)
- Manual edits to CML (Expert-only), clues, outline, or prose (if allowed)
- Accept/reject decisions for each AI-generated artifact
- Export packaging choices (which artifacts to include)
- Safety preferences (e.g., avoid stereotypes, explicitness level)
- Accept/reject decisions for each AI-generated artifact

### AI-generated outputs
- Setting bible and realism constraints
- Cast list with secrets, motives, and access notes
- Character profiles (optional, implemented)
- CML 2.0 case draft
- CML corrections after validation
- Clue list and red herrings
- Outline with clue placement
- Prose chapters (optional, implemented)
- Game pack assets (optional)
- Sample summaries or normalized variants (optional)

---

## Appendix: When each interaction happens

### Spec creation (pre-run)
- User inputs: project name, MysterySpec settings, cast constraints, logic constraints, output preferences, style capture, safety preferences
- Optional AI: suggest setting/cast/logic (user accepts/rejects)

### Run start (pipeline initiation)
- User selects regenerate scope and confirms run
- System locks current accepted spec version

### Setting stage
- AI generates setting bible and realism constraints
- User accepts/rejects or edits generated setting

### Cast stage
- AI generates cast list
- User accepts/rejects cast entries or edits

### CML generation stage
- AI generates CML draft using accepted setting/cast/logic
- Validator runs schema + checklist
- Validator runs novelty audit vs selected seeds
- If fail: AI revises CML with explicit divergence constraints; loop until pass or manual intervention

### Clue stage
- AI derives clues and red herrings
- User accepts/rejects/edit clues

### Outline stage
- AI builds outline with clue placement
- User accepts/rejects/edit outline

### Prose stage (optional)
- AI writes prose using outline + style capture
- User accepts/rejects/edit prose

### Game pack stage (optional)
- AI creates suspect cards and host packet
- User accepts/rejects/edit assets

### Export stage
- User selects artifacts for export and packaging options
- System produces export bundle
