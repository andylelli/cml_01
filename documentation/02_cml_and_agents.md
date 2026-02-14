# CML 2.0 Alignment and Agent Design

## CML’s role
- CML is the internal source of truth and always exists for every mystery.
- CML is not the primary user interface; it is hidden by default.
- Pipeline execution requires Azure OpenAI credentials; deterministic fallback artifacts are not produced.

## CML 2.0 schema alignment
Use schema/cml_2_0.schema.yaml. Generated CML must include:
- CML_VERSION = 2.0
- meta, surface_model, hidden_model, false_assumption, constraint_space, inference_path, discriminating_test, fair_play, quality_controls
- false_assumption.type in {temporal, spatial, identity, behavioral, authority}
- discriminating_test.method in {reenactment, trap, constraint_proof, administrative_pressure}
- crime_class.category in {murder, theft, disappearance, fraud}

If additional values are needed, update schema explicitly or normalize to allowed values.

## Sample CML awareness
- Load examples/ at startup.
- Use samples as structural inspiration only (classic crime structure), never copy content or plot.
- Use samples as quality baselines and regression tests.
- Flag and normalize schema deviations if any.
- Use grabber/ instructions to create new open-source seed CMLs before adding to examples/.

## Information access levels (docs must match UI)
- **Level 1 — User (Default):** no raw CML; only friendly projections.
- **Level 2 — Advanced (Opt-in):** read-only CML viewer and export.
- **Level 3 — Expert (Explicit Opt-in):** direct CML editing with full validation and regeneration scope control.

## Agent responsibilities
### Validation Framework (NEW - Phase 1 Implemented)
**All artifact-generating agents (2b, 2c, 2d, 2e, 3b) now include schema validation + automatic retry:**
- Each agent validates its output against the corresponding schema immediately after generation
- If validation fails, the agent automatically retries with validation error feedback (up to 2 attempts by default)
- Validation errors are fed back into the prompt on retry attempts to guide the LLM toward correct output
- Validation warnings are logged but do not block the pipeline
- After all retry attempts are exhausted, the agent logs errors but continues (allowing downstream handling)
- This prevents malformed artifacts (e.g., enum violations, wrong data types) from propagating through the pipeline

**Validation Retry Wrapper:**
- Utility: `packages/prompts-llm/src/utils/validation-retry-wrapper.ts`
- Provides generic retry logic for any agent
- Tracks cost across attempts
- Records retry history for debugging
- Returns detailed validation results (errors, warnings, attempt count)

### Agent 1 — Era & Setting
Outputs era constraints: tech, policing, social norms, travel, communication.
Guardrail: non-empty anachronisms/implausibilities trigger retry and block the pipeline if unresolved.
Uniqueness: prompts include a per-run uniqueness seed (runId/projectId) to encourage varied settings.
Period accuracy: prompts include 2–3 period-accurate anchors (politics, science, current affairs).

### Agent 2 — Cast & Motive
Outputs cast list, secrets, motives, and access plausibility.
Guardrail: non-empty stereotypeCheck triggers retry and blocks the pipeline if unresolved.
Uniqueness: prompts include a per-run uniqueness seed (runId/projectId) to encourage varied casts.

### Agent 2b — Character Profiles (LLM)
Generates rich psychological profiles from the cast (post-CML) including:
- Public persona and private secrets
- Personality traits and voice hints (formal vs informal, class-based speech patterns)
- 4-6 narrative paragraphs per character (~1000 words)
- **Schema validation with retry:** Validates against `character_profiles.schema.yaml`
  - Enforces `motiveStrength` enum: weak | moderate | strong | compelling (not descriptive text)
  - Enforces `humourStyle` enum values
  - Enforces `humourLevel` as number 0.0-1.0 (not string)
  - Automatically retries if validation fails with error feedback
- **Character humour system (implemented):** Each profile now includes:
  - `humourStyle` — one of: understatement, dry_wit, polite_savagery, self_deprecating, observational, deadpan, sardonic, blunt, none
  - `humourLevel` — 0.0 to 1.0 scale (0 = humourless, 0.4-0.6 = occasional, 0.7+ = frequently witty)
  - `speechMannerisms` — speech rhythm, verbal tics, formality level, and how humour manifests in dialogue
- The LLM is instructed to create humour contrast across the cast (not everyone should be funny) and to match style to personality while occasionally surprising
- Must not introduce new facts beyond cast/CML
- Used by Agent 9 to create distinct character voices and dialogue patterns

### Agent 2c — Location Profiles (LLM)
Generates comprehensive location profiles including:
- Primary location with geographic specificity (place, country)
- Key locations with full sensory palettes (sights, sounds, smells, tactile)
- Atmospheric context (mood, weather, era markers)
- 3-6 paragraphs per location
- **Schema validation with retry:** Validates against `location_profiles.schema.yaml`
  - Enforces keyLocations as array of objects (not strings)
  - Validates sensoryDetails structure (sights, sounds, smells, tactile arrays)
  - Enforces type enum: interior | exterior | transitional
  - Automatically retries if validation fails with error feedback
- Used by Agent 9 for scene-setting and sensory immersion

### Agent 2d — Temporal Context (LLM)
Generates rich temporal/cultural context including:
- Specific date (month + year) and season
- Period fashion (formal/casual/accessories for men and women)
- Cultural touchstones (music, films, theater, prices)
- Current affairs and social attitudes
- Atmospheric details for the specific time period
- **Schema validation with retry:** Validates against `temporal_context.schema.yaml`
  - Validates nested object structures (seasonal, fashion, currentAffairs, cultural)
  - Ensures all required fields are present and correctly typed
  - Automatically retries if validation fails with error feedback
- Used by Agent 9 for period authenticity and cultural references

### Agent 2e — Background Context (LLM)
Generates a dedicated `background_context` artifact before CML generation:
- Canonical backdrop summary (era + setting + mood coherence)
- Era/social-structure anchor for scene grounding
- Setting anchor (location/institution/weather)
- Cast anchors (existing cast names only; no new names)
- Theme carry-through for narrative backdrop consistency
- **Schema validation with retry:** Validates against `background_context.schema.yaml`
  - Ensures castAnchors is non-empty array of strings
  - Validates status field and required nested objects
  - Automatically retries if validation fails with error feedback
- Consumed by Agent 3 separately from hard-logic ideation

### Agent 3 — Crime Designer (CML generator)
Produces a full CML 2.0-compliant draft that is novel and not traceable to any single seed.
Uses seed CMLs for abstract structure patterns only (axis, mechanism families, cadence), never for specific characters, events, or clue chains.
Applies explicit divergence constraints from seed patterns (era/location, method, false assumption, discriminating test) to reduce similarity.
Uses inventive, non-obvious combinations of setting details, false assumptions, access paths, and discriminating tests while staying fair-play and era-accurate.
Consumes the `hard_logic_devices` artifact generated by Agent 3b and grounds the mechanism backbone in one selected (or coherently hybridized) device concept.
Supports escalation directives from theme text:
- `increase difficulty` → multi-step reasoning with fair cognitive misdirection
- `make it brutal` → near-impossible appearance with rigorous timing/geometry logic

### Agent 3b — Hard-Logic Device Ideation
Generates a dedicated `hard_logic_devices` artifact before CML generation.
Output includes 3–5 novel device concepts with required fields:
- title
- core principle + principle type (physical law, mathematical principle, cognitive bias, social logic)
- surface illusion vs underlying reality
- fair-play clues
- anti-trope justification
- variation/escalation option

**Schema validation with retry:** Validates against `hard_logic_devices.schema.yaml`
- Enforces principleType enum: physical_law | mathematical_principle | cognitive_bias | social_logic
- Validates minimum device count (at least 3 devices required)
- Ensures all required fields are present and correctly typed
- Automatically retries if validation fails with error feedback (up to 3 attempts)
- Artifact must pass validation before Agent 3 proceeds

### Agent 4 — CML Validator
Validates schema + checklist (validation/VALIDATION_CHECKLIST.md), checks contradictions and fair-play guarantees.
Runs a novelty/similarity audit against selected seeds; if too similar to a single seed, regeneration is required with explicit divergence constraints.

### Agent 5 — Clue & Red Herrings
Derives clue list by category and creates red herrings that support the false assumption without breaking fairness.
Quality loop: if deterministic clue guardrails or fair-play audit fail, Agent 5 regenerates clues once using violations and recommendations.
Guardrails: essential clues are forced to early/mid placement, clue IDs must be unique, and detective-only/private clue phrasing is rejected.
Each clue now carries optional supportsInferenceStep (number, 1-indexed) and evidenceType (observation/contradiction/elimination) fields to map clues back to inference path steps.
**Explicit requirements approach (implemented):** Before prompting the LLM, TypeScript analyzes the CML to generate a concrete list of required clues (inference step coverage, discriminating test evidence, suspect elimination). The prompt presents these as mandatory requirements with specific goals, ensuring the LLM knows exactly what to generate rather than relying on passive "remember to cover all steps" instructions. The LLM generates creative, specific clue descriptions fulfilling each requirement. If validation fails, the entire agent retries with specific feedback - no programmatic stubs or fallbacks.
Post-extraction validation defaults supportsInferenceStep where the LLM omits it and verifies noNewFactsIntroduced by checking each clue against the CML source text.


### Deterministic Coverage Gate (after Agent 5, before Agent 6)
Five deterministic guardrail functions run after clue extraction to catch structural gaps before the LLM-based fair-play audit:
1. **checkInferencePathCoverage** — verifies each inference_path step has at least one supporting clue; flags uncovered steps as critical.
2. **checkContradictionPairs** — ensures at least one clue supports the false assumption AND at least one contradicts it.
3. **checkFalseAssumptionContradiction** — checks that a clue explicitly names the false assumption and provides contradicting evidence.
4. **checkDiscriminatingTestReachability** — verifies clues reference the discriminating test design, ensuring it is reachable from reader-visible evidence.
5. **checkSuspectElimination** — confirms each non-culprit suspect has at least one eliminating clue.
If critical gaps are found, Agent 5 is retried once with specific violation feedback before proceeding to the fair-play audit.
### Agent 6 — Fair Play Auditor
Produces a structured fair-play audit (overall status, checklist items, violations, summary) based on CML + clue distribution.
Missing required fields cause the pipeline to fail fast.
Guardrail: overallStatus of fail or needs-revision triggers a single clue-regeneration pass and re-audit.
Critical fair-play violations (Clue Visibility, Information Parity, No Withholding, Logical Deducibility) now fail the pipeline after retry instead of continuing with warnings.
**Blind reader simulation (implemented):** After the fair-play audit, a separate LLM call receives ONLY the clue list (no solution, no inference path) and attempts to identify the culprit. If the simulated reader cannot identify the correct suspect (confidence "impossible" or wrong suspect), Agent 5 is re-run with blind reader feedback to strengthen clue coverage.
**CML-level feedback loop (implemented):** When fair-play failures are classified as structural (inference_path_abstract or constraint_space_insufficient), the pipeline escalates to Agent 4 CML revision with targeted repair instructions, then re-runs Agent 5 + Agent 6 on the revised CML.
**Hard stop (implemented):** Persistent critical fair-play failures after CML retry abort the pipeline with a clear error instead of producing an unsolvable mystery.
**Cost circuit breaker (implemented):** Fair-play retry cost is capped at $0.15 to prevent runaway LLM spend on irrecoverable failures.

### Agent 7 — Narrative Outliner
Creates outline with clue placement and discriminating test timing.
- Accepts optional `qualityGuardrails` parameter to steer outline generation.
- **Pre-prose outline quality gate (implemented)**: After outline generation, a deterministic checker (`evaluateOutlineCoverage`) scans all scene fields (title, purpose, summary, dramatic elements) for two categories:
  1. **Discriminating test coverage** — requires test/experiment/re-enactment language co-occurring with exclusion and evidence terms, or an explicit "discriminating test" mention.
  2. **Suspect closure coverage** — requires elimination/cleared/ruled-out language co-occurring with evidence terms (when CML has non-culprit suspects).
- If either check fails, the outline is regenerated once with targeted `qualityGuardrails` derived from the specific CML data (method, design, culprit names). The retried outline replaces the original if coverage improves; otherwise guardrails propagate to prose generation.
- **Prose requirements integration (Phase 2):** Agent 7 now extracts `prose_requirements` from CML and adds them as a prominent section in the outline generation prompt. This ensures the outline includes scenes at the exact act/scene positions specified for discriminating test, suspect clearance, and culprit revelation. Missing these requirements will cause downstream validation failures.

### Agent 8 — Novelty Auditor
Scores similarity vs selected seed CMLs and summarizes novelty risks.
Guardrail: status fail blocks the pipeline.

### Agent 9 — Prose Generator (LLM)
Generates novel-quality prose with full context integration:
- Input: outline + CML + cast + character profiles + location profiles + temporal context
- Output: 3-6 paragraphs per chapter with varied pacing
- **Outline gap passthrough**: If the outline quality gate (Agent 7) detected coverage gaps, the initial prose call receives targeted `qualityGuardrails` so the LLM is explicitly instructed to include missing discriminating-test or suspect-closure beats.
- **Prose requirements integration (Phase 2):** Agent 9 now extracts `prose_requirements` from CML and injects them as a "CRITICAL PROSE REQUIREMENTS" section in the generation prompt. This specifies exactly which validation-critical scenes must appear in which chapters, including:
  - Discriminating test scene (act, scene, tests, required elements, outcome)
  - Suspect clearance scenes (each suspect, act, scene, method, required clues)
  - Culprit revelation scene (act, scene, method, required clues)
  - Identity rules (before/after reveal reference patterns)
  - Clue-to-scene mapping (which clues must appear in which scenes via which delivery methods)
- The prose requirements are extracted per-chapter batch during chunked generation, ensuring each prose call only sees relevant requirements
- Agent 9 is warned that missing requirements will cause validation failures costing $5-8 to regenerate
- **Chapter-by-chapter validation (Phase 3 Implemented):** Each batch of chapters is validated immediately after generation:
  - Validates against `prose.schema.yaml` using `validateArtifact("prose", batch)`
  - If validation fails, the batch is regenerated with specific error feedback (up to 2 attempts)
  - Validation feedback: "Previous attempt had validation errors: [list]. Please regenerate these chapters with corrections."
  - If batch fails all retries, logs critical error but continues (non-blocking, allows manual review)
  - Cost savings: Only regenerates failed batches (~$0.50-1.00) instead of entire story (~$5-8)
  - Batch validation history tracked in result metadata
- Character voice: Distinct speech patterns, humour styles, and verbal mannerisms (from structured humour and voice data in character profiles — replaces legacy keyword-sniffing voice inference)
- Sensory immersion: Multi-sensory scene descriptions using location sensory palettes
- Period authenticity: Fashion, cultural references, prices from temporal context
- Geographic grounding: References specific place + country naturally
- Emotional subtext: Hidden secrets and stakes inform character interactions
- Scene-setting: Atmospheric openings with time, weather, lighting, sensory details
- 8 quality requirements: scene-setting, show-don't-tell, varied structure, character-revealing dialogue, sensory immersion, paragraph structure, pacing variation, emotional subtext
- Validates against prose.schema.yaml
- Must not introduce new facts or override CML logic
- **Writing guides (implemented):** Prose generation now ingests two authorial style guides from `notes/`:
  - Humour guide: structural humour, approved styles (understatement, dry wit, polite savagery, character contrast, precision cruelty), puzzle camouflage, detective voice, rhythm, running gags, emotional humour, prohibitions
  - Whodunnit craft guide: emotional resonance (murder meaning, suspect wounds, detective stakes, texture pauses, subtext dialogue, moral complexity, sensory atmosphere, emotional breaks, reveal impact)
  - Guides are conditionally injected — present when the notes files exist, gracefully absent otherwise
  - All three `generateProse` call sites (initial, identity-alias retry, validation repair retry) receive the guides
- Post-generation guardrail detects role-alias identity drift after confession/arrest and triggers a one-time prose regeneration; unresolved drift is surfaced as a warning.
- Validation-guided repair pass: when validation flags missing discriminating-test realization or suspect-elimination/closure gaps, Agent 9 regenerates prose once with explicit guardrails for on-page test execution and suspect ledger closure.

### Prose Requirements System (Phase 2 Implemented)
**Purpose:** Prevent prose validation errors by embedding validation requirements directly in CML during design, then enforcing them during outline and prose generation.

**CML Schema Extension:**
- Added `prose_requirements` section to `cml_2_0.schema.yaml` with five subsections:
  1. `discriminating_test_scene`: Specifies act/scene number, tested assumption elements, required elements, outcome
  2. `suspect_clearance_scenes`: Array of suspect clearances (suspect name, act/scene, method, required clues)
  3. `culprit_revelation_scene`: Act/scene number, revelation method, required clues
  4. `identity_rules`: Before/after reveal reference patterns, reveal act/scene
  5. `clue_to_scene_mapping`: Maps each clue ID to specific act/scene and delivery method

**Agent 3 (CML Generator) Changes:**
- Updated prompt to include prose_requirements example structure
- Added requirement #17: "Include prose_requirements section specifying discriminating test scene, suspect clearance scenes, culprit revelation scene, identity rules, and clue-to-scene mapping"
- CML now generates explicit scene positions for all validation-critical content

**Agent 7 (Narrative Outline) Changes:**
- Added `buildProseRequirements()` function to extract and format prose requirements from CML
- Injected prose requirements as prominent section in outline generation prompt
- Added "CRITICAL: Follow Prose Requirements" instruction block warning that missing specified scenes will cause validation failure
- Outline must include discriminating test, suspect clearances, and culprit revelation at exact act/scene positions

**Agent 9 (Prose Generator) Changes:**
- Added `buildProseRequirements()` function to extract prose requirements relevant to current chapter batch
- Injected as "CRITICAL PROSE REQUIREMENTS" section in prose generation prompt
- Warns Agent 9 that missing requirements cause $5-8 regeneration cost
- Per-chapter extraction ensures only relevant requirements appear in each generation call

**Validation Flow:**
- Agent 3 generates CML with prose_requirements → Agent 7 uses requirements to structure outline → Agent 9 uses requirements to place validation-critical content in correct chapters → Story validation verifies presence of discriminating test scene, suspect clearances, and culprit revelation
- If prose validation still fails, existing validation-repair pass uses guardrails to regenerate prose (this is now a backup mechanism rather than primary correction)

### Prose (LLM) & Game Pack (planned)
Prose is generated from outline + CML + cast using an LLM (implemented). Game pack generation is planned and not yet available without LLM support.

## Schema System
All artifacts validate against YAML schemas in schema/ directory:
- **cml_2_0.schema.yaml** - Core CML structure with place/country fields in meta.setting
- **character_profiles.schema.yaml** - Character psychological profiles
- **location_profiles.schema.yaml** - Location profiles with sensory details and geographic context
- **temporal_context.schema.yaml** - Date, fashion, cultural context
- **background_context.schema.yaml** - Canonical backdrop context for CML grounding
- **hard_logic_devices.schema.yaml** - Novel hard-logic device ideation artifact
- **cast_design.schema.yaml** - Character design and relationships
- **setting_refinement.schema.yaml** - Era constraints
- **narrative_outline.schema.yaml** - Scene-by-scene structure
- **prose.schema.yaml** - Final prose chapters

Validation occurs automatically after artifact generation:
- Errors logged as warnings in pipeline output
- Type-safe accessors (CharacterProfileAccessor, LocationProfileAccessor, TemporalContextAccessor) provide safe field access
- Schemas serve as documentation for all artifact structures

## Validator gates
- Structural integrity
- Axis dominance
- Epistemic integrity
- False assumption test
- Inference path validity
- Inference path quality (min 3 steps, observation length >= 20 chars, required_evidence, reader_observable, no duplicates)
- Cross-reference consistency (discriminating_test vs inference_path overlap, fair_play explanation brevity)
- Discriminating test soundness
- Fair-play guarantees
- Novelty audit vs selected seed CMLs (regenerate if too similar)
- Narrative continuity (including identity-alias continuity after reveal)
- Case transition bridge checks (disappearance→murder)
- Suspect closure ledger coverage and culprit evidence-chain checks
