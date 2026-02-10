# LLM & AI Integration Plan (Azure OpenAI)

## Goals
- Centralize model access and logging
- Enforce strict JSON outputs per agent
- Support reproducibility and traceability
- Guarantee CML-first ordering and fair-play constraints
- Enforce novelty vs seed CMLs and prevent copying

## Where LLM interaction is required (by pipeline stage)

### 1) Setting generation
**Purpose:** Generate era constraints, setting bible, and realism constraints.
**Input:** decade + location preset + user notes
**Output:** setting bible (constraints on tech, travel, policing, social norms)
**Validation:** check for anachronisms; must not alter user inputs

### 2) Cast generation
**Purpose:** Generate cast list with secrets, motives, alibis, and access.
**Input:** cast size + roles + relationship preset
**Output:** cast section matching schema; uses culpability = unknown until CML is finalized
**Validation:** required fields present; no stereotype or protected-class harm

### 3) CML generation (core)
**Purpose:** Generate CML 2.0-compliant case.
**Input:** setting bible + cast + logic knobs
**Output:** full CML 2.0 draft including false_assumption and discriminating_test
**Validation:** schema + checklist, and “one primary axis” rule
**Novelty:** seeds may guide abstract structure only (axis, mechanism families, cadence); never copy specific characters, events, clue wording, reveal logic, or inference paths.
**Parsing safety:** JSON parsing attempts include extraction of the outermost JSON object; if that fails, YAML output is sanitized to strip trailing inline text after quoted values before retrying.
**Output guardrails:** Agent 3 includes a required YAML skeleton to avoid missing mandatory fields.
**Schema normalization:** After parsing, missing required fields are filled with safe defaults before validation to stabilize runs.

### 4) CML revision
**Purpose:** Fix validator failures in a targeted manner.
**Input:** failed validation report + current CML
**Output:** corrected CML; no new facts outside constraint space
**Validation:** rerun schema + checklist, plus novelty audit vs selected seeds
**Schema normalization:** Agent 4 normalizes parsed CML to fill required fields, including inference_path step fields (observation/correction/effect) and valid discriminating_test.method enums before validation.
**Parsing safety:** If strict JSON parsing fails, Agent 4 sanitizes and parses YAML output before retrying.

### 5) Clue & red herring generation
**Purpose:** Derive fair-play clue list from CML.
**Input:** validated CML + clue density + red-herring budget
**Output:** clues grouped by category; red herrings tied to false assumption
**Validation:** all clues grounded in CML facts; no new facts added

### 6) Outline generation
**Purpose:** Build chapter/act outline with proper clue placement.
**Input:** validated CML + clues + cast
**Output:** outline with clue placement markers
**Validation:** load-bearing clues appear before solution; discriminating test placed late

### 7) Prose generation (optional)
**Purpose:** Produce narrative prose without altering logic.
**Input:** outline + style capture
**Output:** prose chapters
**Validation:** must not introduce new facts; style must not copy copyrighted text
**Current build:** deterministic placeholder prose (multi-paragraph per chapter) is generated from outline and cast (no LLM yet).

### 8) Game pack generation (optional)
**Purpose:** Create suspect cards and host packet.
**Input:** CML + cast
**Output:** printable assets
**Validation:** all facts consistent with CML
**Current build:** deterministic placeholder game pack is generated from CML and cast (no LLM yet).

### 9) Sample CML analysis (optional)
**Purpose:** Summarize or normalize examples for seeds and regression tests.
**Input:** examples/ CML files
**Output:** summaries, normalized variants (if required)
**Validation:** schema compatibility checks
**Constraint:** outputs must not be used as templates or copied into generated CMLs

---

## Model access layer
- Single `AzureOpenAIClient` used across API and worker
- Handles retries, timeouts, rate limits, and logging
- Supports model routing per agent (e.g., reasoning model for CML validation, fast model for outline)
- Enforces JSON mode and schema constraints

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
- Novelty audit: compare generated CML to selected seeds and force regeneration if too similar to any single seed
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
- CML 2.0 case draft
- CML corrections after validation
- Clue list and red herrings
- Outline with clue placement
- Prose chapters (optional)
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
