# LLM & AI Integration Plan (Azure OpenAI)

## Goals
- Centralize model access and logging
- Enforce strict JSON outputs per agent
- Support reproducibility and traceability
- Guarantee CML-first ordering and fair-play constraints
- Enforce novelty vs seed CMLs and prevent copying
- Pipeline runs require Azure OpenAI credentials; no deterministic fallback artifacts are produced.
- Scoring-driven retries now inject structured phase feedback into subsequent retry prompts for scored agents.

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
**Input:** setting bible + cast + background context artifact + logic knobs + hard-logic ideation artifact
**Output:** full CML 2.0 draft including false_assumption, discriminating_test, and quality_controls targets for fair-play and clue visibility
**Validation:** schema + checklist, and “one primary axis” rule
**Setting fidelity:** enforce a setting lock in CML generation so all downstream artifacts stay in the specified location type.
**Spec adherence:** CML generation explicitly incorporates the spec parameters (decade, location preset, tone, theme, cast size/names, primary axis) and must reflect them in meta and narrative summary.
**Novelty:** seeds may guide abstract structure only (axis, mechanism families, cadence); never copy specific characters, events, clue wording, reveal logic, or inference paths. Similarity threshold is configurable via `NOVELTY_SIMILARITY_THRESHOLD` (default 0.9, lenient). Set `NOVELTY_SKIP=true` (or use a threshold >= 1.0) to skip the novelty check entirely. Returned similarity scores are normalized by recomputing the weighted overall similarity and enforcing pass/warn/fail thresholds, and the math is logged to run events and LLM logs.
**Imagination:** the CML generator must use inventive, non-obvious combinations of setting details, false assumptions, access paths, and discriminating tests while staying fair-play and era-accurate.
**Divergence constraints:** CML generation receives explicit divergence constraints derived from seed patterns (era/location, method, false assumption, discriminating test) to avoid overlap.
**Hard-logic constraints:** CML prompt requires contradiction-driven mechanism design based on physical law, mathematics, cognitive bias, or social logic; no post-1945 tech/science.
**Grounding:** Agent 3 consumes generated `hard_logic_devices` concepts (surface illusion, underlying reality, fair-play clues, anti-trope rationale) and grounds the final mechanism in one selected/coherent hybrid device.
**Background grounding:** Agent 3 separately consumes `background_context` (era, setting, social backdrop, cast anchors) and keeps this distinct from mechanism proof logic.
**Escalation modes:** theme phrases `increase difficulty` and `make it brutal` raise complexity and require multi-step inference / near-impossible but rigorously logical constructions.
**Recovery:** If novelty audit fails, CML is regenerated once with stronger divergence constraints, then re-audited.
**Parsing safety:** JSON parsing attempts include JSON repair and extraction of the outermost JSON object; if that fails, YAML output is sanitized to strip trailing inline text after quoted values before retrying.
**Output guardrails:** Agent 3 includes a required YAML skeleton to avoid missing mandatory fields.
**Inference path quality (implemented):** CML generation now enforces minimum 3 inference steps, observation length >= 20 characters, required_evidence and reader_observable fields per step, and no duplicate observations. The YAML skeleton includes full inference path step fields.
**Schema normalization:** After parsing, missing required fields are filled with safe defaults before validation to stabilize runs.

### 3b) Hard-logic device ideation (new)
**Purpose:** Generate novel hard-logic mechanism devices before CML drafting.
**Input:** setting context + theme + axis + hard-logic tags + novelty constraints.
**Output:** `hard_logic_devices` artifact with 3–5 concepts containing title, principle type, illusion vs reality, fair-play clues, anti-trope note, and escalation variation.
**Validation:** artifact must pass `hard_logic_devices.schema.yaml` before Agent 3 executes.
**Guardrail:** ensures novelty mechanisms are explicitly generated, rather than inferred only from keyword parsing.

### 4) CML revision
**Purpose:** Fix validator failures in a targeted manner.
**Input:** failed validation report + current CML
**Output:** corrected CML; no new facts outside constraint space
**Validation:** rerun schema + checklist, plus novelty audit vs selected seeds
**Schema normalization:** Agent 4 normalizes parsed CML to fill required fields, including inference_path step fields (observation/correction/effect) and valid discriminating_test.method enums before validation.
**Parsing safety:** If strict JSON parsing fails, Agent 4 attempts JSON repair and YAML sanitization before retrying.
**Fair-play-driven revision (implemented):** Agent 4 is now also invoked when fair-play audit failures are classified as structural (inference_path_abstract or constraint_space_insufficient). Revision instructions target the specific structural weakness identified by the failure classifier.

### 5) Clue & red herring generation
**Purpose:** Derive fair-play clue list from CML.
**Input:** validated CML + clue density + red-herring budget
**Output:** clues grouped by category; red herrings tied to false assumption
**Validation:** all clues grounded in CML facts; no new facts added
**Quality controls:** uses CML quality_controls targets (essential clue minimums and placement counts) when present
**Deterministic guardrails:** enforce no late essential clues, unique clue IDs, and no detective-only/private clue phrasing; a failed guardrail triggers one targeted clue regeneration.
**Inference path coverage (implemented):** The clue extraction prompt now includes a full dump of all inference_path steps with mandatory coverage instructions. Each clue carries optional supportsInferenceStep (boolean) and evidenceType (physical/testimonial/circumstantial/documentary) fields.
**Post-extraction validation (implemented):** After LLM returns clues, defaults are applied for missing supportsInferenceStep fields, and noNewFactsIntroduced is verified by checking each clue against the actual CML source text.
**Deterministic coverage gate (implemented):** Five guardrail functions run after clue extraction:
1. checkInferencePathCoverage — verifies each inference step has supporting clue(s)
2. checkContradictionPairs — ensures clues both support and contradict the false assumption
3. checkFalseAssumptionContradiction — checks for explicit false-assumption-naming clue
4. checkDiscriminatingTestReachability — verifies clue references to discriminating test design
5. checkSuspectElimination — confirms each non-culprit has eliminating clue(s)
Critical gaps trigger one Agent 5 retry with violation feedback before proceeding to fair-play audit.
**Explicit requirements approach (implemented):** Agent 5 uses explicit requirements generation — TypeScript pre-analyzes the CML to create a concrete checklist of required clues (inference path coverage, discriminating test evidence, suspect elimination), then the LLM fulfills each requirement creatively without programmatic stubs or fallbacks.
**Semantic validation fallback (implemented):** Clue prose validators use regex patterns for speed, with LLM-based semantic validation as a fallback when rigid regex rejects semantically correct prose (e.g., natural phrasing of discriminating test evidence or suspect elimination logic).
**Token optimization (implemented):** Agent 5 prompt structure optimized for brevity (~58% reduction from ~600 to ~250 tokens) while preserving all essential information: compact requirement format, condensed context/guidance sections, minimal examples, and focused instructions.

### 6) Fair-play audit
**Purpose:** Evaluate fairness and reader-solvability against CML + clue distribution.
**Input:** validated CML + clues
**Output:** structured audit (overall status, checklist items, violations, summary)
**Validation:** required fields and status enums; missing fields cause a hard failure. `fail` or `needs-revision` triggers a single clue-regeneration pass with audit feedback.
**Hard gate:** critical violations in clue visibility/information parity/no-withholding/logical deducibility fail the pipeline after retry.
**Blind reader simulation (implemented):** After the audit, a separate LLM call receives ONLY the clue list (no solution, no inference path) and attempts to identify the culprit. Returns suspected culprit, reasoning, confidence level, and missing information. If the simulated reader cannot identify the correct suspect (confidence "impossible" or wrong suspect), Agent 5 is re-run with blind reader feedback.
**Failure classification (implemented):** Fair-play failures are classified into four categories: inference_path_abstract (steps too vague), constraint_space_insufficient (not enough suspects/evidence), clue_coverage (clues exist but miss steps), and clue_only (minor clue adjustments needed).
**CML-level feedback loop (implemented):** Structural failures (inference_path_abstract or constraint_space_insufficient) escalate to Agent 4 CML revision with targeted repair instructions. The revised CML is re-run through Agent 5 + Agent 6.
**Pipeline hard stop (implemented):** Persistent critical failures after CML retry abort the pipeline with a descriptive error.
**Cost circuit breaker (implemented):** Fair-play retry LLM cost is capped at $0.15 (MAX_FAIR_PLAY_RETRY_COST). If the cap is exceeded, the pipeline aborts to prevent runaway spend on irrecoverable failures.
**Prevention measures (implemented):** To prevent fair play violations from being generated in the first place, architectural constraints are enforced in both narrative outline (Agent 7) and prose generation (Agent 9):
  - **Agent 7 (Narrative Outline)**: Explicit clue sequencing rules enforce minimum scene spacing between clue revelation and clue usage. Clue revelation scenes must occur in Act I or early-mid Act II. Investigation/processing scenes must occur AFTER clues are revealed. Discriminating test scene must be in late Act II or early Act III and can ONLY use clues already revealed. Confrontation scene must be at least 1-2 scenes AFTER discriminating test. Violation examples and correct sequencing patterns provided.
  - **Agent 9 (Prose Generation)**: Fair play guardrails prevent within-chapter violations. If clue discovered in chapter N, detective can only analyze/use it in chapter N+1 or later. Reader must see all clues BEFORE detective uses them. Discriminating test can only use clues revealed at least 1 chapter earlier. Confrontation cannot surprise reader with withheld facts. These guardrails ensure proper information parity even when narrative structure is correct.
**Release gate enforcement (implemented):** Fair play scores <60/100 or any 0-score dimension violations abort the run at release gate before marking complete (see Architecture Backend documentation for details).

### 7) Outline generation
**Purpose:** Build chapter/act outline with proper clue placement.
**Input:** validated CML + clues + cast
**Output:** outline with clue placement markers
**Validation:** load-bearing clues appear before solution; discriminating test placed late
**Deterministic pacing repair (implemented):** If the outline under-populates `cluesRevealed` (<60% of scenes), the worker performs deterministic clue pre-assignment (mapping-aware and act-balanced) before prose; LLM retry is fallback-only.
**Scene-count lock (implemented):** Outline retries now carry explicit scene-count guardrails (total + per-act) and are discarded if they shrink structure relative to the baseline outline.
**Setting fidelity:** all scenes must remain within the CML setting; no location-type drift.
**CML compatibility:** downstream agents derive context from CML 2.0 fields when legacy setup/crime fields are missing.
**Parsing safety:** narrative outline parsing uses JSON repair and JSON extraction when needed.
**Fallbacks:** if totals are missing, total scenes/words are derived from scene estimates to avoid run failure.

### 7b) Character profile generation (optional)
**Purpose:** Produce rich psychological character profiles for prose generation.
**Input:** cast list + CML + setting tone
**Output:** per-character profiles (4-6 paragraphs, ~1000 words each) including:
  - Public persona and private secrets
  - Personality traits and emotional stakes
  - Voice hints (formal vs informal, class-based speech patterns)
  - Motive context and alibi windows
**Validation:** must not introduce new facts or contradict CML; private details must align with cast/CML; validates against character_profiles.schema.yaml
**Usage:** Agent 9 uses profiles to create distinct character voices, dialogue patterns, humour styles, and emotional subtext
**Character humour system (implemented):** Each profile includes structured humour attributes:
  - `humourStyle` (understatement, dry_wit, polite_savagery, self_deprecating, observational, deadpan, sardonic, blunt, none)
  - `humourLevel` (0.0-1.0 scale controlling wit frequency)
  - `speechMannerisms` (verbal tics, rhythm, formality, humour delivery)
  The LLM is given detailed humour assignment guidelines (style-to-personality mapping, contrast requirements, detective voice constraints) and must ensure not all characters are humorous
**Current build:** LLM-generated profiles with voice/personality extraction (implemented).

Validation/remediation update:
- Retry-time validation now evaluates telemetry-complete shapes for Agent 2b/2c/2d outputs to avoid false `cost`/`durationMs` schema failures.
- Generic retry wrapper returns the actual last-attempt artifact after retry exhaustion (no extra post-failure generation call).

### 7c) Location profile generation (optional)
**Purpose:** Generate comprehensive location profiles with sensory details.
**Input:** setting refinement + CML + narrative outline
**Output:** location profiles including:
  - Primary location with geographic specificity (place, country)
  - 2-3 key locations with full sensory palettes (sights, sounds, smells, tactile details)
  - Atmospheric context (mood, weather, era markers)
  - 3-6 paragraphs per location
**Validation:** must align with setting refinement and CML; validates against location_profiles.schema.yaml
**Usage:** Agent 9 uses sensory palettes for scene-setting and multi-sensory immersion
**Current build:** LLM-generated profiles with comprehensive sensory details (implemented).

### 7d) Temporal context generation (optional)
**Purpose:** Generate rich temporal/cultural context for period authenticity.
**Input:** setting refinement + CML (decade from meta.era)
**Output:** temporal context including:
  - Specific date (month + year) and season with weather patterns
  - Period fashion (formal/casual/accessories for men and women)
  - Cultural touchstones (popular music, films, theater)
  - Typical prices and daily life details
  - Current affairs and major events
  - Social attitudes (class, gender, general norms)
**Validation:** must be historically accurate for the specified date; validates against temporal_context.schema.yaml
**Usage:** Agent 9 uses for fashion descriptions, cultural references, and period-authentic details
**Current build:** LLM-generated context with comprehensive period details (implemented).
**Optional-field depth hardening (implemented):** Agent 2d prompt now enforces concrete richness in optional temporal fields (specific fashion detail, seasonal activities, daily-life prices/rituals) to reduce thin but schema-valid outputs.

### 8) Prose generation (optional)
**Purpose:** Produce novel-quality narrative prose with full context integration.
**Input:** outline + CML + cast + character profiles + location profiles + temporal context
**Output:** prose chapters (3-6 paragraphs each, varied pacing)
**Context integration:**
  - Character profiles provide personality traits, humour styles, speech mannerisms, and voice data for distinct dialogue (replaces legacy keyword-sniffing voice inference with structured humourStyle/humourLevel/speechMannerisms data)
  - Location profiles provide sensory palettes (sights, sounds, smells, tactile) and geographic specificity (place, country)
  - Temporal context provides fashion details, cultural touchstones, period prices, current events
  - All context injected into system prompt with usage guidelines
  - Writing guides (implemented): Two authorial style guides are loaded from `notes/` and distilled into focused LLM prompt instructions:
    - **Humour guide** (`DEFINITIVE_GUIDE_TO_HUMOUR.md`): structural humour principles, approved styles (understatement, dry wit, polite savagery, character-driven contrast, precision cruelty), puzzle camouflage technique, detective voice rules, rhythm/placement, running gags as structural devices, emotional humour, and explicit prohibitions
    - **Whodunnit craft guide** (`WHAT_MAKES_A_GOOD_WHODUNNIT.md`): emotional resonance principles — murder meaning, suspect wounds, detective stakes, texture-building pauses, subtext-rich dialogue, moral complexity, sensory atmosphere, emotional breaks, and reveal impact
**Quality requirements:**
  1. Scene-setting with atmospheric description using location/temporal context
  2. Show-don't-tell with concrete physical details
  3. Varied sentence structure for pacing control
  4. Character-revealing dialogue with distinct voices per character
  5. Multi-sensory immersion (2-3 senses per scene minimum)
  6. Strong paragraph structure (hook, develop, close)
  7. Pacing variation (short for action, long for atmosphere)
  8. Emotional subtext using character secrets and stakes
  9. Scene grounding contract (implemented): each chapter opening anchors to a named location, includes 2+ sensory cues, and includes at least one atmosphere marker.
**Validation:** must not introduce new facts; style must not copy copyrighted text; validates against prose.schema.yaml
**Setting fidelity:** prose references specific geographic location (e.g., "Little Middleton, England") and stays within CML setting type
**Period authenticity:** fashion descriptions, cultural references, and prices match temporal context; no anachronisms
**Completeness:** prose must include one chapter per outline scene; missing chapters trigger a retry.
Long outlines are generated in scene batches to ensure all chapters are produced within token limits.
**Chapter-by-chapter validation (implemented):** Each batch of chapters is validated immediately after generation before moving to the next batch. Validation checks:
  - Character name consistency (no invented names, matches CML cast)
  - Setting fidelity (no location type drift, maintains CML setting)
  - Discriminating test presence (late chapters must include test scene)
  - Prose quality (paragraph count, length variation, sentence variety)
  - Two-tier chapter word policy: relaxed hard floor (`STORY_LENGTH_TARGETS.chapterMinWords * 0.9`, currently 720/1080/1350) and stricter preferred target (prose density target)
Underflow policy (implemented):
  - Below hard floor is a retry-blocking failure.
  - Between hard floor and preferred target is a soft miss that feeds retry directives/provisional scoring, not an immediate hard-stop.
  - If hard-floor underflow is the only blocking error, Agent 9 performs a chapter-local expansion pass before failing the batch retry cycle.
Before validation runs, Agent 9 applies a defensive prose sanitization pass that replaces invented titled names not present in cast (e.g., `Detective Harlow`, `Inspector Reed`) with anonymous role phrases (`the detective`, `an inspector`). This reduces phantom-name retry loops while preserving narrative flow.
This logic is centralized in a shared `@cml/story-validation` utility so detection and sanitization use the exact same matching rules.
Agent 9 prose generation now uses a lower creativity setting (temperature 0.45) to reduce recurrent genre-attractor phantom names in early/late chapters.
Chapter validation now also checks readability density (minimum paragraph structure, overlong wall-of-text blocks), scene-grounding quality, and chapter-level encoding integrity (mojibake/illegal control characters) so retries can repair these issues before full-story persistence.
Discriminating-test chapter validation now parses structured `discriminating_test.design` objects (description/test type/required elements) in addition to plain strings, preventing no-op key-term extraction on object payloads.
Online anti-template linter (implemented): before each chapter batch is committed, Agent 9 now runs deterministic style checks and retries the batch on failure: opening-style entropy threshold, repeated long-paragraph fingerprint detection, and high-overlap n-gram similarity against prior accepted chapters.
Opening-style entropy gating now ramps by chapter progress in standard mode (lower threshold in early chapters, canonical threshold later) to reduce false early hard-fails without weakening late-stage anti-template controls.
Repair-mode anti-template behavior (implemented): during validation-driven full-prose repair, Agent 9 uses a softened early-chapter entropy gate (warm-up chapters + lower threshold) to avoid false hard-fails on chapter 1 while preserving fingerprint/ngram leakage checks.
If retries are exhausted and the only remaining blocker is opening-style entropy (with no other critical/major chapter violations), Agent 9 now accepts the batch with an explicit entropy warning instead of aborting the full run.
NarrativeState propagation hardening (implemented): Agent 9 now updates a live in-call NarrativeState after each committed batch, so subsequent prompts use current opening-style and sensory history.
Month/season lock hardening (implemented): Agent 9 derives a canonical season from the temporal month and injects a hard constraint into the prompt. Before per-chapter validation, prose text is deterministically normalized when a chapter mentions the locked month but uses conflicting seasonal labels.
Temporal lock-aware validation (implemented): chapter validation receives the temporal month lock from context so month/season contradictions are caught consistently across initial and retry batches.
Template-leakage hardening (implemented): after each prose pass (including repair retries), worker post-processing rewrites known scaffold-leakage signatures and deterministically replaces repeated long paragraphs with chapter-specific variants before release-gate evaluation.
Critical/major issues trigger automatic batch regeneration with specific feedback about what failed. Retry feedback now uses prompt-provided discriminating-test requirements (no hardcoded chapter-number heuristic). Standard prose uses up to 3 attempts per batch; validation-driven repair uses chapter-granular batches (`batchSize=1`) and up to 3 attempts per chapter.
Telemetry (implemented): Agent 9 now records per-run underflow diagnostics (`hardFloorMisses`, `preferredTargetMisses`, affected chapter indexes, and chapter-local expansion attempt/recovery/failure counts) in `validationDetails` for downstream report diagnostics.
Scoring diagnostics (implemented): Agent 9 completeness scoring now includes explicit subtest diagnostics for `word_count_target` and `clue_visibility` (raw counts/ratios plus dominant subfailure attribution), and adapter output now carries clue-visibility diagnostics (`expected_clue_ids_count`, `visible_clue_ids_count`, `clue_visibility_ratio`, `missing_clue_ids`) for report-level triage.
Clue visibility reconciliation hardening (implemented): adapter/scorer clue ID matching now normalizes separator variants (`clue_id`, `clue-id`, `clue id`) before visibility comparison, and the adapter derives conservative multi-token semantic signatures from clue IDs when clue-distribution descriptions are unavailable.
Runtime parameterization (implemented): Agent generation/scoring tuning values are centrally loaded from a single YAML file (`apps/worker/config/generation-params.yaml`; optional override via `CML_GENERATION_PARAMS_PATH`) instead of hardcoded constants. In addition to Agent 9 prose/scoring knobs (word policy, underflow expansion, prose model temperature/batch cap, anti-template linter thresholds, scoring-adapter semantic matching thresholds, fair-play spoiler window ratio, completeness scorer cutoffs), Agent 1-8 runtime knobs are also consumed from the same YAML (model temperature/max tokens, retry/attempt limits, inference-step defaults, fair-play retry budget/cost caps, narrative pacing ratios, and novelty thresholds/weights).
**Current build:** LLM-generated prose with full artifact context integration and per-batch content validation (implemented).
**CML compatibility:** narrative context is built from CML 2.0 structures when legacy fields are absent.
**Prompt-contract hardening (implemented):** Agent 9 now injects a positive chapter-obligation contract and a frozen timeline-state block into each prose batch. These explicitly enumerate required clue IDs, locked evidence phrases, location anchors, suspect-clearance beats, discriminating-test obligations, and month/season constraints.
**Season-lock hardening (implemented):** the prose prompt and pre-submit checklist now use an exclusive seasonal allow-list tied to the canonical month-derived season, rather than only warning against contradictions.
**Repetition-repair hardening (implemented):** after generation, Agent 9 detects cross-chapter recurring atmospheric n-grams and performs a targeted repair pass to replace templated phrasing while preserving plot facts and clue logic.
**Self-audit strip path (implemented):** the prose JSON schema accepts an optional `audit` object for model self-checking, but Agent 9 strips it before persistence so storage remains canonical.

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
- Non-prose agents use `AZURE_OPENAI_DEPLOYMENT_NAME` (default deployment)
- Prose generation (Agent 9) uses `AZURE_OPENAI_DEPLOYMENT_NAME_PROSE` when set; otherwise it falls back to `AZURE_OPENAI_DEPLOYMENT_NAME`

### Per-agent model parameters (`apps/worker/config/generation-params.yaml`)

All values are runtime-loaded and range-clamped. Override path via `CML_GENERATION_PARAMS_PATH`.

| Agent                 | temperature | max_tokens | default_max_attempts | Notes                              |
|-----------------------|:-----------:|:----------:|:--------------------:|------------------------------------|
| Agent 1 (Setting)     | 0.6         | 2 000      | 3                    |                                    |
| Agent 2 (Cast)        | 0.75        | 6 000      | 3                    | 6 000 for 7-char fully-detailed output |
| Agent 2b (Profiles)   | 0.6         | 8 000      | 3                    |                                    |
| Agent 2c (Locations)  | 0.6         | 4 500      | 2                    |                                    |
| Agent 2d (Temporal)   | 0.7         | 4 500      | 2                    |                                    |
| Agent 2e (Background) | 0.4         | 1 200      | 2                    | Low temp — factual grounding       |
| Agent 3 (CML)         | —           | —          | 3                    | Uses default deployment            |
| Agent 3b (HLD)        | 0.7         | 2 600      | 3                    |                                    |
| Agent 4 (CML Revision)| 0.5         | 8 000      | 5                    | More retries for structural fix    |
| Agent 5 (Clues)       | 0.4         | 3 000      | —                    |                                    |
| Agent 6 audit model   | 0.3         | 2 500      | —                    | max retries: 2 (3 with targeted)   |
| Agent 6 blind reader  | 0.2         | 1 500      | —                    | Fair-play cost cap: $0.15          |
| Agent 7 (Narrative)   | 0.5         | 16 000     | —                    | Scene-count lock on retry          |
| Agent 8 (Novelty)     | 0.3         | 2 500      | —                    |                                    |
| Agent 9 (Prose)       | 0.42        | —          | 4                    | `DEPLOYMENT_NAME_PROSE` if set     |

### Agent 9 prose word policy

```
hard_floor = floor(preferred_chapter_words × hard_floor_relaxation_ratio)
           = floor(preferred × 0.6),  min 600 words

preferred_chapter_words:
  short:  1 300 words/chapter
  medium: 1 600 words/chapter
  long:   2 400 words/chapter

Underflow expansion hint: +260 … +900 words, temperature 0.18, max_tokens 3 000
```

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
- CML validation now includes validateInferencePathQuality (min 3 steps, observation length, required_evidence, reader_observable, no duplicates) and validateCrossReferences (discriminating_test vs inference_path overlap, fair_play explanation brevity). Cross-reference checks are non-blocking (advisory) to avoid breaking LLM-generated content in revision loops.
- Story validation now includes `NarrativeContinuityValidator`, `CaseTransitionValidator`, `DiscriminatingTestValidator`, and `SuspectClosureValidator`.
- Narrative continuity checks now also detect month/season temporal contradictions and investigator-role drift without explicit handoff scenes.
- **Semantic validation fallback**: Validators use a hybrid approach: regex keyword validation first (fast, zero cost), then LLM-based semantic validation if regex fails (preserves natural prose quality while ensuring correctness). This allows Agent 9 to write naturally without forcing keywords like "eliminated", "ruled out", "therefore" while still catching actual logic errors. Semantic validation costs ~$0.001-0.003 per scene when triggered.
- Before final release-gate evaluation, prose generation now runs a preventive repair pass when validation flags discriminating-test gaps, suspect-closure gaps, missing case-transition bridge, or identity alias continuity breaks; the repair pass adds explicit quality guardrails to Agent 9 instructions.
- Suspect-elimination/case-closure failures are now classified through shared alias-aware matching (error type and message semantics), so repair guardrails still trigger if validator key names change.
- Agent 9 now applies baseline guardrails on every prose call (canonical cast names only, explicit suspect-elimination coverage, explicit culprit evidence chain), even before validation retries are needed.
- Preventive prose repair now runs for `needs_revision` validation outcomes in addition to hard `failed` outcomes.
- Identity-alias continuity remediation now uses chapter-targeted prose regeneration first and escalates to full-prose regeneration only if drift remains after targeted repair.
- Release gate enforcement now hard-stops on critical prose defects (mojibake/encoding corruption, template leakage, temporal contradictions, unresolved placeholder-token leakage, duplicate chapter-heading artifacts, unresolved suspect-closure gaps) and keeps readability/scene-grounding shortfalls as warnings for review.
- Release gate enforcement now also hard-stops when NSD marks clue reveals that prose evidence extraction cannot anchor (`revealed_without_evidence > 0`).

### Validation types

```typescript
// packages/story-validation/src/types.ts
interface ValidationError {
  type:        string;
  message:     string;
  severity:   'critical' | 'major' | 'moderate' | 'minor';
  sceneNumber?:  number;
  lineNumber?:   number;
  suggestion?:   string;
  cmlReference?: string;
}

interface ValidationResult {
  valid: boolean;
  errors:    ValidationError[];
  warnings?: ValidationError[];
}
```

### Story validation pipeline validators

| Validator                         | File                                       | Fatal on failure? |
|-----------------------------------|--------------------------------------------|:-----------------:|
| `ChapterValidator`                | `chapter-validator.ts`                     | Yes (retry)       |
| `CharacterValidator`              | `character-validator.ts`                   | Yes               |
| `NarrativeContinuityValidator`    | `narrative-continuity-validator.ts`        | Yes               |
| `CaseTransitionValidator`         | `case-transition-validator.ts`             | Yes               |
| `DiscriminatingTestValidator`     | `discriminating-test-validator.ts`         | Yes               |
| `SuspectClosureValidator`         | `suspect-closure-validator.ts`             | Yes               |
| `ProseConsistencyValidator`       | `prose-consistency-validator.ts`           | Moderate/Critical |
| `EraValidator`                    | `era-validator.ts`                         | Yes               |
| `PhysicalValidator`               | `physical-validator.ts`                    | Yes               |
| `EncodingValidator`               | `encoding-validator.ts`                    | Yes               |
| `TimelineValidator`               | `timeline-validator.ts`                    | Advisory          |

`StoryValidationPipeline.validate()` runs all validators and returns a `ValidationReport` with `status: 'passed' | 'needs_revision' | 'failed'`.

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

### Cost accounting fields (`GenerationReport`)

```typescript
// Post-generation summary in diagnostics[].details
{
  prose_duration_ms_first_pass: number;
  prose_duration_ms_total:      number;
  prose_cost_first_pass:        number;
  prose_cost_total:             number;
  rewrite_pass_count:           number;
  repair_pass_count:            number;
  per_pass_accounting:          Array<{ pass: string; cost: number; duration_ms: number }>;
}
```

### Story length targets (single source of truth: `packages/story-validation/src/story-length-targets.ts`)

```typescript
const STORY_LENGTH_TARGETS = {
  short:  { scenes: 20, chapters: 20, minWords: 15_000, maxWords:  25_000, chapterMinWords:   800, chapterIdealWords: 1_000 },
  medium: { scenes: 30, chapters: 30, minWords: 40_000, maxWords:  60_000, chapterMinWords: 1_200, chapterIdealWords: 1_700 },
  long:   { scenes: 42, chapters: 42, minWords: 70_000, maxWords: 100_000, chapterMinWords: 1_500, chapterIdealWords: 2_200 },
} as const;
```

`scenes === chapters` is enforced by a compile-time TypeScript assertion. All packages must import these values from this file; do not hardcode scene/chapter counts elsewhere.

### Novelty audit weights (`agent8_novelty`)

| Category   | Weight |
|------------|:------:|
| `plot`     | 0.30   |
| `character`| 0.25   |
| `solution` | 0.25   |
| `setting`  | 0.15   |
| `structural`| 0.05  |

Default threshold: 0.9 (higher = more lenient). `fail_delta`: 0.1 above threshold triggers hard fail when `NOVELTY_HARD_FAIL=true`.

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
