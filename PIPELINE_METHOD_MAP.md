# Mystery Generation Pipeline - Complete Method Map

This document traces all methods/functions used in the mystery generation pipeline from start to finish.

## Entry Point

### Main Orchestrator
- **`generateMystery()`** - `apps/worker/src/jobs/mystery-orchestrator.ts:970`
  - Main pipeline coordinator
  - Orchestrates all 9 agents + validation + guardrails
  - Returns: `MysteryGenerationResult`

- **`generateMysterySimple()`** - `apps/worker/src/jobs/mystery-orchestrator.ts:2163`
  - Convenience wrapper with default settings
  - Calls `generateMystery()` with theme + defaults

---

## Pipeline Stages (in execution order)

### Stage 0: Preparation & Setup

#### Validation Framework (NEW - Phase 1)
- **`withValidationRetry()`** - `packages/prompts-llm/src/utils/validation-retry-wrapper.ts`
  - Generic retry wrapper for agent validation
  - Validates artifact against schema after generation
  - Retries with validation error feedback on failure
  - Tracks cost across attempts and returns detailed validation results
  - Used by Agents 2b, 2c, 2d, 2e, 3b

- **`buildValidationFeedback()`** - `packages/prompts-llm/src/utils/validation-retry-wrapper.ts`
  - Formats validation errors into prompt feedback
  - Helps LLM correct schema violations on retry

#### Configuration Helpers
- **`resolveLocationPreset()`** - `apps/worker/src/jobs/mystery-orchestrator.ts:994` (inline)
  - Maps location preset strings to structured location data
  - Returns: `{ location: string, institution: string }`

- **`normalizePrimaryAxis()`** - `apps/worker/src/jobs/mystery-orchestrator.ts:92`
  - Converts user-facing axis names to CML axis names
  - Maps: `"social"` → `"authority"`, `"psychological"` → `"behavioral"`, etc.

- **`deriveHardLogicDirectives()`** - `apps/worker/src/jobs/mystery-orchestrator.ts:154`
  - Analyzes theme + location to derive mechanism families and modes
  - Detects locked-room, inheritance, temporal patterns from text
  - Returns: `HardLogicDirectives`

- **`mergeHardLogicDirectives()`** - `apps/worker/src/jobs/mystery-orchestrator.ts:110`
  - Merges base directives with Agent 3b device hints
  - Builds unified mechanism family + mode lists
  - Returns: `HardLogicDirectives`

#### Seed & Novelty Setup
- **`loadSeedCMLFiles()`** - `packages/prompts-llm/src/agent8-novelty.ts` (exported from index)
  - Reads all `.yaml` files from examples directory
  - Parses CML seed patterns for novelty comparison
  - Returns: `Array<{ filename: string; cml: CaseData }>`

- **`buildNoveltyConstraints()`** - `apps/worker/src/jobs/mystery-orchestrator.ts:892`
  - Extracts titles, eras, locations, false assumptions from seeds
  - Builds divergence areas list
  - Returns: `{ divergeFrom, areas, avoidancePatterns }`

---

### Stage 1: Era & Setting Refinement (Agent 1)

**Progress: 0% → 12%**

- **`refineSetting()`** - `packages/prompts-llm/src/agent1-setting.ts` (exported)
  - LLM call: Refines decade, location, institution into detailed setting
  - Checks anachronisms and implausibilities
  - Returns: `SettingRefinementResult` with `{ setting, cost }`
  - **Validation:** Errors on anachronisms/implausibilities → pipeline abort

---

### Stage 2: Cast & Motive Design (Agent 2)

**Progress: 12% → 25%**

- **`designCast()`** - `packages/prompts-llm/src/agent2-cast.ts` (exported)
  - LLM call: Generates 6-12 characters with motives, roles, relationships
  - Runs stereotype checks
  - Returns: `CastDesignResult` with `{ cast, cost }`
  - **Validation:** Errors on stereotype violations → pipeline abort

---

### Stage 3: Background Context (Agent 2e)

**Progress: 25% → 28%**

- **`generateBackgroundContext()`** - `packages/prompts-llm/src/agent2e-background-context.ts` (exported)
  - LLM call: Generates setting/era/social backdrop prose
  - **NEW: Schema validation with retry** - Validates against `background_context.schema.yaml`
  - Ensures castAnchors is non-empty array of strings
  - Automatically retries up to 2 times if validation fails with error feedback
  - Returns: `BackgroundContextArtifact` with `{ backgroundContext, cost }`
  - **Schema validation:** `validateArtifact("background_context", ...)` from `@cml/cml`

---

### Stage 4: Hard-Logic Device Ideation (Agent 3b)

**Progress: 28% → 31%**

- **`generateHardLogicDevices()`** - `packages/prompts-llm/src/agent3b-hard-logic-devices.ts` (exported)
  - LLM call: Generates 3-5 novel hard-logic device concepts
  - Uses novelty constraints to avoid seed patterns
  - **NEW: Schema validation with retry** - Validates against `hard_logic_devices.schema.yaml`
  - Enforces principleType enum and minimum device count (3 devices)
  - Automatically retries up to 3 times if validation fails with error feedback
  - Returns: `HardLogicDeviceResult` with `{ devices, cost }`
  - **Schema validation:** `validateArtifact("hard_logic_devices", ...)`

---

### Stage 5: CML Generation + Auto-Revision (Agent 3 + Agent 4)

**Progress: 31% → 50%**

#### CML Generation
- **`generateCML()`** - `packages/prompts-llm/src/agent3-cml.ts` (exported)
  - LLM call: Generates full mystery structure (CML)
  - Includes inference path, constraint space, false assumption, discriminating test
  - Grounds structure in hard-logic devices
  - **NEW: Generates prose_requirements section (Phase 2):**
    - Specifies exact act/scene positions for discriminating test, suspect clearances, culprit revelation
    - Includes identity rules (before/after reveal reference patterns)
    - Maps clues to specific scenes with delivery methods
    - Used by Agents 7 and 9 to place validation-critical content correctly
  - Returns: `CMLGenerationResult` with `{ cml, validation, cost, revisedByAgent4, attempt, revisionDetails }`
  - **Internal calls:**
    - `buildCMLPrompt()` - `packages/prompts-llm/src/agent3-cml.ts`
    - `validateCaseData()` - `@cml/cml` package
  - **Auto-revision:** If validation fails, triggers Agent 4 internally

#### CML Revision (Agent 4)
- **`reviseCml()`** - `packages/prompts-llm/src/agent4-revision.ts` (exported)
  - LLM call: Revises invalid CML based on validation errors
  - Used internally by `generateCML()` and by orchestrator for fair-play failures
  - Returns: `{ cml, cost }`

---

### Stage 6: Novelty Audit (Agent 8) — OPTIONAL

**Progress: 50% → 58%**

- **`auditNovelty()`** - `packages/prompts-llm/src/agent8-novelty.ts` (exported)
  - LLM call: Compares generated CML to seed patterns
  - Calculates weighted similarity scores
  - Returns: `NoveltyAuditResult` with `{ status, highestSimilarity, mostSimilarSeed, violations, warnings, cost }`
  - **Retry logic:** If status is `"fail"`, regenerates CML with stronger constraints
  - **Skipped if:** `inputs.skipNoveltyCheck === true` or `similarityThreshold >= 1.0`

---

### Stage 7: Clue Distribution (Agent 5)

**Progress: 58% → 62%**

#### Clue Generation
- **`extractClues()`** - `packages/prompts-llm/src/agent5-clues.ts` (exported)
  - LLM call: Generates clue catalog from CML
  - Maps clues to timeline positions (early/mid/late)
  - Returns: `ClueDistributionResult` with `{ clues, redHerrings, clueDensity, cost }`

#### Deterministic Guardrails (WP3)
- **`applyClueGuardrails()`** - `apps/worker/src/jobs/mystery-orchestrator.ts:267`
  - Runs deterministic checks on clue set
  - Calls: `normalizeClueTimeline()`, `getCaseQualityControls()`
  - Checks: duplicate IDs, detector-only access, essential clue timing, timeline balance
  - Returns: `{ fixes: string[], issues: GuardrailIssue[], hasCriticalIssues: boolean }`
  - **Retry:** If `hasCriticalIssues === true`, regenerates clues once

- **`normalizeClueTimeline()`** - `apps/worker/src/jobs/mystery-orchestrator.ts:259`
  - Ensures every clue has `timeline: "early" | "mid" | "late"`
  - Auto-fixes missing timeline values

- **`getCaseQualityControls()`** - `apps/worker/src/jobs/mystery-orchestrator.ts:253`
  - Extracts CML discriminating test type
  - Returns: `{ discriminatingTestType: string }`

#### Inference Path Coverage Gate (WP4)
- **`checkInferencePathCoverage()`** - `apps/worker/src/jobs/mystery-orchestrator.ts:409`
  - Checks if every inference step has at least one clue
  - Returns: `{ uncoveredSteps, hasCriticalGaps, issues }`

- **`checkContradictionPairs()`** - `apps/worker/src/jobs/mystery-orchestrator.ts:495`
  - Ensures every observation has a paired contradiction clue
  - Returns: `GuardrailIssue[]`

- **`checkFalseAssumptionContradiction()`** - `apps/worker/src/jobs/mystery-orchestrator.ts:531`
  - Verifies at least one clue contradicts the false assumption
  - Returns: `GuardrailIssue[]`

- **`checkDiscriminatingTestReachability()`** - `apps/worker/src/jobs/mystery-orchestrator.ts:573`
  - Ensures test conclusion is supported by clues
  - Returns: `GuardrailIssue[]`

- **`checkSuspectElimination()`** - `apps/worker/src/jobs/mystery-orchestrator.ts:618`
  - Checks clue coverage for eliminating each suspect
  - Returns: `GuardrailIssue[]`

**Retry:** If coverage gaps found, regenerates clues with feedback

---

### Stage 8: Fair Play Audit (Agent 6)

**Progress: 62% → 75%**

#### Fair Play Audit
- **`auditFairPlay()`** - `packages/prompts-llm/src/agent6-fairplay.ts` (exported)
  - LLM call: Audits mystery for fair-play compliance
  - Checks: clue visibility, information parity, logical deducibility, solution support
  - Returns: `FairPlayAuditResult` with `{ overallStatus, violations, warnings, recommendations, cost }`
  - **Retry loop:** Up to 2 attempts; regenerates clues if audit fails

#### Blind Reader Simulation (WP5B)
- **`blindReaderSimulation()`** - `packages/prompts-llm/src/agent6-fairplay.ts` (exported)
  - LLM call: Simulates a reader with ONLY clue access (no CML)
  - Reader must identify culprit using logic
  - Returns: `BlindReaderResult` with `{ suspectedCulprit, confidenceLevel, reasoning, missingInformation, cost }`
  - **Retry:** If reader fails or suspects wrong person, regenerates clues

#### Fair-Play Failure Classification (WP6)
- **`classifyFairPlayFailure()`** - `apps/worker/src/jobs/mystery-orchestrator.ts:361`
  - Analyzes audit + coverage results to diagnose failure type
  - Returns: `"inference_path_abstract"` | `"constraint_space_insufficient"` | `"clue_distribution_fixable"` | `"unknown"`
  - **CML Retry (WP6B):** If structural failure detected, calls `reviseCml()` to fix upstream CML

---

### Stage 9: Narrative Outline (Agent 7)

**Progress: 75% → 87%**

- **`formatNarrative()`** - `packages/prompts-llm/src/agent7-narrative.ts` (exported)
  - LLM call: Generates act/scene structure with dramatic beats
  - **NEW: Prose requirements integration (Phase 2):**
    - `buildProseRequirements()` extracts prose_requirements from CML and formats for prompt
    - Includes discriminating test scene, suspect clearance scenes, culprit revelation scene
    - Warns LLM that missing specified scenes will cause validation failures
    - Ensures outline includes validation-critical content at exact act/scene positions
  - Returns: `NarrativeOutline` with `{ acts, totalScenes, estimatedTotalWords, cost }`

#### Outline Quality Gate
- **`evaluateOutlineCoverage()`** - `apps/worker/src/jobs/mystery-orchestrator.ts:759`
  - Checks for discriminating test scene + suspect closure scene in outline
  - Returns: `OutlineCoverageIssue[]`

- **`buildOutlineRepairGuardrails()`** - `apps/worker/src/jobs/mystery-orchestrator.ts:848`
  - Converts outline issues into targeted quality instructions
  - Returns: `string[]` (guardrail prompts)
  - **Retry:** If issues found, regenerates outline with guardrails

---

### Stage 10: Character Profiles (Agent 2b)

**Progress: 88% → 89%**

- **`generateCharacterProfiles()`** - `packages/prompts-llm/src/agent2b-character-profiles.ts` (exported)
  - LLM call: Generates rich character profiles with humour styles, voice, motivations
  - **NEW: Schema validation with retry** - Validates against `character_profiles.schema.yaml`
  - Enforces enum constraints (motiveStrength, humourStyle) and type constraints (humourLevel as number)
  - Automatically retries up to 2 times if validation fails with error feedback
  - Logs warnings for non-critical validation issues
  - Returns: `CharacterProfilesResult` with `{ profiles, cost }`
  - **New fields (character humour system):**
    - `humourStyle` (enum: dry_wit, sardonic, deadpan, etc.)
    - `humourLevel` (0.0–1.0)
    - `speechMannerisms` (free text)
  - **Schema validation:** `validateArtifact("character_profiles", ...)`

---

### Stage 11: Location Profiles (Agent 2c)

**Progress: 89% → 89%**

- **`generateLocationProfiles()`** - `packages/prompts-llm/src/agent2c-location-profiles.ts` (exported)
  - LLM call: Generates detailed location descriptions
  - **NEW: Schema validation with retry** - Validates against `location_profiles.schema.yaml`
  - Enforces keyLocations as array of objects (not strings)
  - Validates sensoryDetails structure and type enums
  - Automatically retries up to 2 times if validation fails with error feedback
  - Returns: `LocationProfilesResult` with `{ keyLocations, cost }`
  - **Schema validation:** `validateArtifact("location_profiles", ...)`

---

### Stage 12: Temporal Context (Agent 2d)

**Progress: 89% → 91%**

- **`generateTemporalContext()`** - `packages/prompts-llm/src/agent2d-temporal-context.ts` (exported)
  - LLM call: Generates specific date, season, weather timeline
  - **NEW: Schema validation with retry** - Validates against `temporal_context.schema.yaml`
  - Validates nested structures (seasonal, fashion, currentAffairs, cultural)
  - Automatically retries up to 2 times if validation fails with error feedback
  - Returns: `TemporalContextResult` with `{ specificDate, seasonalDetails, cost }`
  - **Schema validation:** `validateArtifact("temporal_context", ...)`

---

### Stage 13: Prose Generation (Agent 9)

**Progress: 91% → 94%**

#### Writing Guides Loader
- **`loadWritingGuides()`** - `apps/worker/src/jobs/mystery-orchestrator.ts:653`
  - Reads markdown writing guides from `notes/` directory
  - Files: `DEFINITIVE_GUIDE_TO_HUMOUR.md`, `WHAT_MAKES_A_GOOD_WHODUNNIT.md`
  - Returns: `{ humour?: string, craft?: string }`

#### Prose Generation
- **`generateProse()`** - `packages/prompts-llm/src/agent9-prose.ts` (exported)
  - LLM call: Generates full prose chapters from outline + profiles + context
  - Injects writing guides into system prompt
  - Injects character humour data (style + level + mannerisms) into personality context
  - **NEW: Prose requirements integration (Phase 2):**
    - `buildProseRequirements()` extracts prose_requirements from CML (filtered to current chapter batch)
    - Formats as "CRITICAL PROSE REQUIREMENTS" section with:
      - Discriminating test scene (act, scene, tests, required elements, outcome)
      - Suspect clearance scenes (suspect, act/scene, method, clues)
      - Culprit revelation scene (act/scene, method, clues)
      - Identity rules (before/after reveal patterns)
      - Clue-to-scene mapping (which clues appear in which scenes)
    - Warns LLM that missing requirements cause $5-8 regeneration cost
    - Per-chapter extraction ensures only relevant requirements shown in each batch
  - Returns: `ProseGenerationResult` with `{ chapters, cost }`
  - **Inputs:**
    - `caseData`, `outline`, `cast`, `characterProfiles`, `locationProfiles`, `temporalContext`
    - `writingGuides` (humour + craft markdown)
    - `qualityGuardrails` (optional outline repair instructions)

#### Prose Sanitization
- **`sanitizeProseResult()`** - `apps/worker/src/jobs/mystery-orchestrator.ts:698`
  - Cleans mojibake encoding artifacts (Ã¢â‚¬â„¢ → ', etc.)
  - Calls: `sanitizeProseText()` on all text fields
  - Returns: cleaned `ProseGenerationResult`

- **`sanitizeProseText()`** - `apps/worker/src/jobs/mystery-orchestrator.ts:684`
  - Applies regex replacements from `proseMojibakeReplacements`
  - Returns: cleaned string

- **`proseMojibakeReplacements`** - `apps/worker/src/jobs/mystery-orchestrator.ts:672`
  - Array of `[RegExp, string]` pairs for encoding fixes

#### Identity Continuity Guardrail
- **`detectIdentityAliasBreaks()`** - `apps/worker/src/jobs/mystery-orchestrator.ts:709`
  - Checks if post-reveal chapters use role-only aliases ("the killer") without naming culprit
  - Returns: `string[]` (issue descriptions)
  - **Retry:** If issues found, regenerates prose once

---

### Stage 14: Story Validation

**Progress: 96% → 98%**

#### Validation Pipeline
- **`StoryValidationPipeline`** - `@cml/story-validation` package
  - Class that orchestrates all validation rules
  - **Methods:**
    - `validate(story, cml)` - Runs all validators
    - `autoFix(story)` - Applies encoding fixes

- **Validation Rules** (all in `packages/story-validation/src/rules/`):
  - `discriminating-test-validator.ts` - Ensures test scene exists in prose
  - `suspect-closure-validator.ts` - Ensures each suspect is explicitly cleared
  - `culprit-evidence-validator.ts` - Ensures culprit identification scene exists
  - `identity-continuity-validator.ts` - Detects role-alias breaks
  - `case-transition-validator.ts` - Checks for conclusion bridge scenes
  - `encoding-validator.ts` - Detects mojibake

**Returns:** `ValidationReport` with `{ status, summary, errors, warnings }`

#### Prose Repair Retry
If validation fails, orchestrator:
1. Extracts error types (missing test, suspect closure, culprit evidence)
2. Builds targeted guardrails from errors
3. Regenerates prose with `qualityGuardrails`
4. Re-validates

#### Release Gate Check
- **Inline logic** - `apps/worker/src/jobs/mystery-orchestrator.ts:2073`
  - Checks for critical blockers:
    - Identity/role alias breaks
    - Missing case transition bridge
    - Mojibake still present
    - Missing discriminating test
    - Suspect elimination coverage incomplete
  - Adds warnings but does NOT abort pipeline

---

## Supporting Infrastructure

### Schema Validation
- **`validateCaseData()`** - `@cml/cml` package
  - Validates full CML structure against `cml_2_0.schema.yaml`
  - Returns: `{ valid: boolean, errors: string[] }`

- **`validateArtifact()`** - `@cml/cml` package
  - Validates individual artifacts (character_profiles, location_profiles, etc.)
  - Returns: `{ valid: boolean, errors: string[], warnings: string[] }`

### LLM Client
- **`AzureOpenAIClient`** - `@cml/llm-client` package
  - Handles all LLM API calls (Azure OpenAI)
  - Provides: `chat()`, streaming, cost tracking

### Progress Reporting
- **`reportProgress()`** - `apps/worker/src/jobs/mystery-orchestrator.ts:982` (inline)
  - Calls user-provided `onProgress` callback
  - Format: `{ stage, message, percentage, timestamp }`

---

## Data Flow Summary

```
User Inputs (theme, era, location, cast size, etc.)
   ↓
┌─────────────────────────────────────────────────────────────┐
│ PREPARATION                                                 │
│ - resolveLocationPreset()                                   │
│ - normalizePrimaryAxis()                                    │
│ - deriveHardLogicDirectives()                               │
│ - loadSeedCMLFiles()                                        │
│ - buildNoveltyConstraints()                                 │
└─────────────────────────────────────────────────────────────┘
   ↓
┌─────────────────────────────────────────────────────────────┐
│ AGENT 1: refineSetting()                                    │
│   → SettingRefinementResult                                 │
└─────────────────────────────────────────────────────────────┘
   ↓
┌─────────────────────────────────────────────────────────────┐
│ AGENT 2: designCast()                                       │
│   → CastDesignResult                                        │
└─────────────────────────────────────────────────────────────┘
   ↓
┌─────────────────────────────────────────────────────────────┐
│ AGENT 2e: generateBackgroundContext()                      │
│   → BackgroundContextArtifact                               │
└─────────────────────────────────────────────────────────────┘
   ↓
┌─────────────────────────────────────────────────────────────┐
│ AGENT 3b: generateHardLogicDevices()                        │
│   → HardLogicDeviceResult                                   │
│   ↓                                                          │
│ mergeHardLogicDirectives()                                  │
│   → Updated HardLogicDirectives                             │
└─────────────────────────────────────────────────────────────┘
   ↓
┌─────────────────────────────────────────────────────────────┐
│ AGENT 3: generateCML() + buildCMLPrompt()                   │
│   → CMLGenerationResult                                     │
│   ↓ (if invalid)                                            │
│ AGENT 4: reviseCml()                                        │
│   → Corrected CML                                           │
└─────────────────────────────────────────────────────────────┘
   ↓
┌─────────────────────────────────────────────────────────────┐
│ AGENT 8: auditNovelty() [OPTIONAL]                          │
│   → NoveltyAuditResult                                      │
│   ↓ (if fail)                                               │
│ Regenerate CML with stronger constraints                    │
└─────────────────────────────────────────────────────────────┘
   ↓
┌─────────────────────────────────────────────────────────────┐
│ AGENT 5: extractClues()                                     │
│   → ClueDistributionResult                                  │
│   ↓                                                          │
│ WP3: applyClueGuardrails()                                  │
│   - normalizeClueTimeline()                                 │
│   - Check duplicate IDs, timing, balance                    │
│   ↓ (if critical issues)                                    │
│ Regenerate clues                                            │
│   ↓                                                          │
│ WP4: Inference Coverage Gate                                │
│   - checkInferencePathCoverage()                            │
│   - checkContradictionPairs()                               │
│   - checkFalseAssumptionContradiction()                     │
│   - checkDiscriminatingTestReachability()                   │
│   - checkSuspectElimination()                               │
│   ↓ (if critical gaps)                                      │
│ Regenerate clues with coverage feedback                     │
└─────────────────────────────────────────────────────────────┘
   ↓
┌─────────────────────────────────────────────────────────────┐
│ AGENT 6: auditFairPlay()                                    │
│   → FairPlayAuditResult                                     │
│   ↓ (retry loop up to 2x)                                   │
│ If fail: regenerate clues with feedback                     │
│   ↓                                                          │
│ WP5B: blindReaderSimulation()                               │
│   → BlindReaderResult                                       │
│   ↓ (if reader fails)                                       │
│ Regenerate clues with blind reader feedback                 │
│   ↓                                                          │
│ WP6: classifyFairPlayFailure()                              │
│   ↓ (if structural issue)                                   │
│ WP6B: reviseCml() to fix upstream structure                 │
│   → Re-run extractClues() + auditFairPlay()                 │
└─────────────────────────────────────────────────────────────┘
   ↓
┌─────────────────────────────────────────────────────────────┐
│ AGENT 7: formatNarrative()                                  │
│   → NarrativeOutline                                        │
│   ↓                                                          │
│ Outline Quality Gate:                                       │
│   - evaluateOutlineCoverage()                               │
│   - buildOutlineRepairGuardrails()                          │
│   ↓ (if issues)                                             │
│ Regenerate outline with guardrails                          │
└─────────────────────────────────────────────────────────────┘
   ↓
┌─────────────────────────────────────────────────────────────┐
│ AGENT 2b: generateCharacterProfiles()                       │
│   → CharacterProfilesResult                                 │
│   (includes humourStyle, humourLevel, speechMannerisms)     │
└─────────────────────────────────────────────────────────────┘
   ↓
┌─────────────────────────────────────────────────────────────┐
│ AGENT 2c: generateLocationProfiles()                        │
│   → LocationProfilesResult                                  │
└─────────────────────────────────────────────────────────────┘
   ↓
┌─────────────────────────────────────────────────────────────┐
│ AGENT 2d: generateTemporalContext()                         │
│   → TemporalContextResult                                   │
└─────────────────────────────────────────────────────────────┘
   ↓
┌─────────────────────────────────────────────────────────────┐
│ loadWritingGuides()                                         │
│   → { humour, craft }                                       │
└─────────────────────────────────────────────────────────────┘
   ↓
┌─────────────────────────────────────────────────────────────┐
│ AGENT 9: generateProse()                                    │
│   (with writingGuides + humour data)                        │
│   → ProseGenerationResult                                   │
│   ↓                                                          │
│ sanitizeProseResult()                                       │
│   - sanitizeProseText()                                     │
│   ↓                                                          │
│ detectIdentityAliasBreaks()                                 │
│   ↓ (if issues)                                             │
│ Regenerate prose                                            │
└─────────────────────────────────────────────────────────────┘
   ↓
┌─────────────────────────────────────────────────────────────┐
│ VALIDATION                                                  │
│ StoryValidationPipeline.validate()                          │
│   - discriminating-test-validator                           │
│   - suspect-closure-validator                               │
│   - culprit-evidence-validator                              │
│   - identity-continuity-validator                           │
│   - case-transition-validator                               │
│   - encoding-validator                                      │
│   → ValidationReport                                        │
│   ↓ (if failed)                                             │
│ Build repair guardrails from errors                         │
│ Regenerate prose with guardrails                            │
│ Re-validate                                                 │
│   ↓                                                          │
│ StoryValidationPipeline.autoFix()                           │
│   → Apply encoding fixes                                    │
│   ↓                                                          │
│ Release Gate Check (inline)                                 │
│   - Check critical blockers                                 │
│   - Add warnings (no abort)                                 │
└─────────────────────────────────────────────────────────────┘
   ↓
┌─────────────────────────────────────────────────────────────┐
│ COMPLETE                                                    │
│ Return MysteryGenerationResult:                             │
│   - cml                                                     │
│   - clues                                                   │
│   - fairPlayAudit                                           │
│   - narrative                                               │
│   - characterProfiles                                       │
│   - locationProfiles                                        │
│   - temporalContext                                         │
│   - backgroundContext                                       │
│   - hardLogicDevices                                        │
│   - prose                                                   │
│   - noveltyAudit                                            │
│   - validationReport                                        │
│   - metadata (cost, duration, agent stats)                  │
│   - status, warnings, errors                                │
└─────────────────────────────────────────────────────────────┘
```

---

## Agent Module Locations

All agent implementations are in `packages/prompts-llm/src/`:

- **Agent 1** - `agent1-setting.ts` - Era & setting refinement
- **Agent 2** - `agent2-cast.ts` - Cast & motive design
- **Agent 2b** - `agent2b-character-profiles.ts` - Character profiles (with humour system)
- **Agent 2c** - `agent2c-location-profiles.ts` - Location profiles
- **Agent 2d** - `agent2d-temporal-context.ts` - Temporal context (date/season)
- **Agent 2e** - `agent2e-background-context.ts` - Background/setting prose
- **Agent 3** - `agent3-cml.ts` - CML generation
- **Agent 3b** - `agent3b-hard-logic-devices.ts` - Hard-logic device ideation
- **Agent 4** - `agent4-revision.ts` - CML revision
- **Agent 5** - `agent5-clues.ts` - Clue distribution
- **Agent 6** - `agent6-fairplay.ts` - Fair-play audit + blind reader simulation
- **Agent 7** - `agent7-narrative.ts` - Narrative outline formatting
- **Agent 8** - `agent8-novelty.ts` - Novelty audit + seed CML loading
- **Agent 9** - `agent9-prose.ts` - Full prose generation (with writing guides & humour)

All agents are exported from `packages/prompts-llm/src/index.ts`.

---

## Key Package Locations

- **Orchestrator:** `apps/worker/src/jobs/mystery-orchestrator.ts`
- **All Agents:** `packages/prompts-llm/src/agent*.ts`
- **CML Package:** `packages/cml/src/` (schema validation)
- **Story Validation:** `packages/story-validation/src/` (post-prose validators)
- **LLM Client:** `packages/llm-client/src/` (Azure OpenAI wrapper)
- **CML Schema:** `schema/cml_2_0.schema.yaml`
- **Writing Guides:** `notes/DEFINITIVE_GUIDE_TO_HUMOUR.md`, `notes/WHAT_MAKES_A_GOOD_WHODUNNIT.md`

---

## Retry & Feedback Loops

The pipeline includes **10 retry/feedback mechanisms**:

1. **Agent 3 → Agent 4:** CML validation failure triggers auto-revision
2. **Agent 8:** Novelty failure triggers CML regeneration with stronger constraints
3. **Agent 5 → WP3:** Clue guardrail critical issues trigger clue regeneration
4. **Agent 5 → WP4:** Inference coverage gaps trigger clue regeneration
5. **Agent 6:** Fair-play audit failure triggers clue regeneration (up to 2 attempts)
6. **Agent 6 → WP5B:** Blind reader failure triggers clue regeneration
7. **Agent 6 → WP6B:** Structural fair-play failure triggers CML revision
8. **Agent 7:** Outline coverage gaps trigger narrative regeneration
9. **Agent 9:** Identity continuity breaks trigger prose regeneration
10. **Validation:** Story validation failure triggers prose regeneration with repair guardrails

---

## Cost & Duration Tracking

Every agent result includes:
- `cost` (USD from LLM API)
- Duration calculated in orchestrator via `Date.now()` deltas

Aggregated in final result:
- `metadata.agentCosts` - Cost per agent
- `metadata.agentDurations` - Duration per agent (ms)
- `metadata.totalCost` - Sum of all agent costs
- `metadata.totalDurationMs` - Total pipeline runtime

---

## Error Handling

- **Validation Errors:** Agent 1, Agent 2 abort pipeline on critical validation failures
- **Schema Errors:** Background context, hard-logic devices, character profiles, location profiles, temporal context validate against schemas; log warnings but continue
- **Fair-Play Failures:** Downgraded to warnings after all retry attempts; pipeline continues
- **Catastrophic Failures:** `try/catch` block in `generateMystery()` catches all errors, logs to `errors[]`, and throws

---

## Environment Variables

- `NOVELTY_SIMILARITY_THRESHOLD` (default: 0.9) - Novelty pass/fail threshold
- `NOVELTY_HARD_FAIL` (default: false) - Whether to abort on novelty failure
- Fair-play retry cost limit: $0.15 (hardcoded in orchestrator)

---

*Generated: 2026-02-14*  
*Pipeline version: Post-Phase 3 (with character humour system)*
