# CML System Integrity Checks

> **Purpose:** Complete reference of all checks that must be performed after any code, schema, type, prompt, or configuration change. Run these checks in the order listed — earlier sections gate later ones.

---

## Table of Contents

1. [TypeScript Compilation](#1-typescript-compilation)
2. [CML Schema Validation](#2-cml-schema-validation)
3. [Artifact Schema Alignment](#3-artifact-schema-alignment)
4. [TypeScript Interface Alignment](#4-typescript-interface-alignment)
5. [Package Export Alignment](#5-package-export-alignment)
6. [Scoring System Alignment](#6-scoring-system-alignment)
7. [Story Validation Pipeline](#7-story-validation-pipeline)
8. [Automated Tests](#8-automated-tests)
9. [Agent Prompt ↔ Schema Alignment](#9-agent-prompt--schema-alignment)
10. [Orchestrator Wiring Checks](#10-orchestrator-wiring-checks)
11. [Cross-Package Dependency Checks](#11-cross-package-dependency-checks)
12. [Data Flow Integrity](#12-data-flow-integrity)
13. [Narrative State (NSD) Checks](#13-narrative-state-nsd-checks)
14. [Prose Consistency Validator Checks](#14-prose-consistency-validator-checks)
15. [Examples and CML Files](#15-examples-and-cml-files)
16. [Change-Class Quick Reference](#16-change-class-quick-reference)

---

## 1. TypeScript Compilation

**Every change must pass zero-error TS compilation across all packages before anything else is checked.**

### Packages to compile
| Package | Build command |
|---------|--------------|
| `@cml/cml` | `cd packages/cml && tsc --noEmit` |
| `@cml/llm-client` | `cd packages/llm-client && tsc --noEmit` |
| `@cml/prompts-llm` | `cd packages/prompts-llm && tsc --noEmit` |
| `@cml/story-validation` | `cd packages/story-validation && tsc --noEmit` |
| `apps/worker` | `cd apps/worker && tsc --noEmit` |
| `apps/api` | `cd apps/api && tsc --noEmit` |
| `apps/web` | `cd apps/web && tsc --noEmit` |

### What to check
- Zero errors (warnings are acceptable but must be reviewed).
- No implicit `any` introduced without corresponding JSDoc or interface.
- No `as any` casts added to work around a type mismatch — fix the underlying type instead.
- If a cast is truly unavoidable, add a comment explaining why.

---

## 2. CML Schema Validation

**File:** `schema/cml_2_0.schema.yaml` | **Validator:** `packages/cml/src/validator.ts` (`validateCml`)

### Structural rules (enforced by `validateNode`)
- All `required: true` fields must be present and typed correctly.
- All `allowed` enumerations must match (`type`, `allowed` arrays in schema).
- Array items typed as objects must have their child fields present if `required: true`.

### Enhanced quality rules (enforced by `validateInferencePathQuality`)
- Each `CASE.inference_path.steps[n].observation` must be ≥ 20 characters.
- Each step must have `required_evidence` (non-empty array).
- `reader_observable` must be `true` on each step.
- No two steps may share an identical (case-normalised) observation.

### Cross-reference rules (enforced by `validateCrossReferences`)
- `discriminating_test.design` should use vocabulary overlapping with inference path steps.
- `fair_play.explanation` should be substantive (≥ 50 chars).

### When to run
- After editing `schema/cml_2_0.schema.yaml`.
- After editing `packages/cml/src/validator.ts`.
- After any change to `CASE` structure produced by Agent 3 or Agent 4.
- After editing Agent 3 (`agent3-cml.ts`) or Agent 4 (`agent4-revision.ts`) prompts.

### Programmatic check
```typescript
import { validateCml } from '@cml/cml';
const result = validateCml(yourCmlObject);
// result.valid === true, result.errors === []
```

---

## 3. Artifact Schema Alignment

**Location:** `schema/*.schema.yaml` | **Validator:** `packages/cml/src/artifact-validator.ts` (`validateArtifact`)

### Artifact schemas and their consuming agents

| Schema file | Artifact type string | Producing agent | TS result interface |
|-------------|---------------------|-----------------|---------------------|
| `setting_refinement.schema.yaml` | `"setting_refinement"` | Agent 1 | `SettingRefinement` |
| `cast_design.schema.yaml` | `"cast_design"` | Agent 2 | `CastDesign` + envelope |
| `character_profiles.schema.yaml` | `"character_profiles"` | Agent 2b | `CharacterProfilesResult` |
| `location_profiles.schema.yaml` | `"location_profiles"` | Agent 2c | `LocationProfilesResult` |
| `temporal_context.schema.yaml` | `"temporal_context"` | Agent 2d | `TemporalContextResult` |
| `background_context.schema.yaml` | `"background_context"` | Agent 2e | `BackgroundContextArtifact` |
| `hard_logic_devices.schema.yaml` | `"hard_logic_devices"` | Agent 3b | `HardLogicDeviceResult` |
| `narrative_outline.schema.yaml` | `"narrative_outline"` | Agent 7 | `NarrativeOutline` |
| `prose.schema.yaml` | `"prose"` | Agent 9 | `ProseGenerationResult` |

### For each artifact schema, verify

1. **Every required field** in the YAML has a corresponding non-optional property in the TS interface.
2. **Every optional field** in the YAML (`required: false`) has a `?` on the TS property — not a required property with type `string` etc.
3. **Every `allowed` enum** in the YAML is a union literal in the TS interface (or a `type` alias).
4. **All nested object fields** are reflected in nested interfaces or inline object types.
5. **Array item schemas** match the TypeScript array element type.
6. **Top-level envelope fields** (`cost`, `durationMs` / `latencyMs`, `status`) are present in **both** the schema and the interface.

### Envelope fields required by validator in orchestrator
Each artifact passed to `validateArtifact()` in the orchestrator must carry these top-level fields (check schema declares them as `required: true`):

| Artifact | Envelope fields expected |
|----------|-------------------------|
| `cast_design` | `cost`, `latencyMs` |
| `character_profiles` | `cost`, `durationMs` |
| `location_profiles` | `cost`, `durationMs` |
| `temporal_context` | `cost`, `durationMs` |
| `background_context` | (status only — no cost/duration) |
| `hard_logic_devices` | `cost`, `latencyMs` |
| `narrative_outline` | `cost`, `durationMs` |
| `prose` | `cost`, `durationMs` |
| `setting_refinement` | (no cost/duration in schema) |

### Special: `sensoryVariants` on `keyLocations`
`location_profiles.schema.yaml` declares `sensoryVariants` as `required: false`. Each item must have:
`id` (string, required), `timeOfDay` (string, required), `weather` (string, required), `sights` (array, required), `sounds` (array, required), `smells` (array, required), `mood` (string, required).

Confirm the `SensoryVariant` interface in `agent2c-location-profiles.ts` matches these exactly.

### Contract-drift test
After any schema or TS interface change, check that `packages/story-validation/src/__tests__/artifact-contract-drift.test.ts` still passes. Add a new test case if a new artifact type is introduced.

---

## 4. TypeScript Interface Alignment

These are the cross-cutting checks on the TS types themselves — independent of YAML schemas.

### 4.1 `CMLData` in `packages/story-validation/src/types.ts`
`CMLData` is the contract passed to every validator. Verify it exposes:
- `CASE.meta` (with `era.decade`, `setting.location`, `crime_class`)
- `CASE.cast[]` (with `name`, `role_archetype`, `gender?`)
- `CASE.crime_scene?` (with `primary_location`, `location_type`)
- `CASE.discriminating_test?` (with `method?`, `design?`, `pass_condition?`)
- `CASE.culpability?` (with `culprits: string[]`)
- `lockedFacts?` — array of `{ id, value, description, appearsInChapters? }` — passed alongside CML in validation pipeline calls

If the orchestrator passes additional ad-hoc fields via `{ ...cml, someField: value }` to the pipeline, those fields must be declared on `CMLData` to avoid `as any` casts.

### 4.2 `ValidationError` in `types.ts`
When a new error type string is added (e.g. in a new validator), confirm the `type` value is documented and is a string literal rather than a free-form string. The downstream `buildConsistencyReport` filters by `type` — undocumented types will be silently excluded from the consistency report.

### 4.3 `CharacterProfileOutput` vs `CharacterProfile`
- `CharacterProfile` (Agent 2 output) — all fields mandatory.
- `CharacterProfileOutput` (Agent 2b output) — most fields optional; must include `motiveStrength?` with the same union as `CharacterProfile`.

Any field added to `CharacterProfile` that downstream consumers (Agent 2b, Agent 9) rely on must be propagated to `CharacterProfileOutput`.

### 4.4 `PrimaryLocationProfile`
`place` and `country` are `required: false` in the location schema and must be `place?: string` and `country?: string` in the TS interface. Consumers (orchestrator, accessor, Agent 9) must use safe fallback access (`?.`).

### 4.5 `HardLogicDeviceIdea` in `packages/prompts-llm/src/types.ts`
Must match `HardLogicDeviceResult.devices[]` exactly, including:
- `lockedFacts?: Array<{ id, value, description, appearsInChapters? }>` — same shape used by `ProseConsistencyValidator`.
- `moralAmbiguity?: string` — optional.
- `modeTags?: string[]` — optional.

### 4.6 `BackgroundContextInput` vs `BackgroundContextArtifact`
Both exist in different packages with slightly different names. They must remain structurally identical (same fields, same optionality). Check if one is changed without updating the other.

### 4.7 `ProseConsistencyReport` in `types.ts`
Must align with what `buildConsistencyReport()` in `pipeline.ts` actually populates. If a new error type is added to any validator, add a corresponding counter to `ProseConsistencyReport` and update the builder.

---

## 5. Package Export Alignment

### `@cml/prompts-llm` — `packages/prompts-llm/src/index.ts`
Every public interface used across package boundaries must be exported here. Check:
- All agent result types (`*Result`, `*Inputs`) are exported as `export type`.
- All shared types (`HardLogicDeviceIdea`, `BackgroundContextInput`, `NarrativeState`, `LockedFact`) are exported.
- All runtime exports (functions like `initNarrativeState`, `updateNSD`) are `export { ... }` (not `export type`).
- After adding a new agent or type, add its export here before using it from another package.

### `@cml/cml` — `packages/cml/src/index.ts`
Must export:
- `validateCml` (and alias `validateCaseData`)
- `validateArtifact`, `validateArtifacts`, `getArtifactTypes`
- All accessor classes: `CharacterProfileAccessor`, `LocationProfileAccessor`, `TemporalContextAccessor`, `ArtifactAccessor`
- All named sub-structure interfaces: `InferenceStep`, `InferencePath`, `FairPlayBlock`
- `getInferencePath()`
- `CaseData` type alias

### `@cml/story-validation` — `packages/story-validation/src/index.ts`
- All types from `types.ts` (via `export * from './types.js'`)
- All validator classes
- `StoryValidationPipeline`
- `ValidationReport`, `ProseConsistencyReport`
- All scoring exports via `export * from './scoring/index.js'`

---

## 6. Scoring System Alignment

### 6.1 Phase scorer coverage
Every agent that the orchestrator runs must have a corresponding phase scorer:

| Agent | Scorer file | `agent` key in `DEFAULT_THRESHOLDS` |
|-------|------------|-------------------------------------|
| Agent 1 | `agent1-setting-refinement-scorer.ts` | `'agent1-setting-refinement'` |
| Agent 2 | `agent2-cast-scorer.ts` | `'agent2-cast'` |
| Agent 2b | `agent2b-character-profiles-scorer.ts` | `'agent2b-character-profiles'` |
| Agent 2c | `agent2c-location-profiles-scorer.ts` | `'agent2c-location-profiles'` |
| Agent 2d | `agent2d-temporal-context-scorer.ts` | `'agent2d-temporal-context'` |
| Agent 2e | `agent2e-background-scorer.ts` | `'agent2e-background'` |
| Agent 3b | `agent4-hard-logic-scorer.ts` | `'agent4-hard-logic'` |
| Agent 7 | `agent7-narrative-scorer.ts` | `'agent7-narrative-outline'` |
| Agent 9 | `agent9-prose-scorer.ts` | `'agent9-prose'` |

Note: Agent 3 (CML gen), Agent 4 (revision), Agent 5 (clues), Agent 6 (fair-play), Agent 8 (novelty) — confirm whether they are scored or only their outputs validated. If a new agent is added, a scorer entry in `thresholds.ts` and a scorer file must be created.

### 6.2 `ThresholdConfig` defaults
- If a phase `agent` key in `DEFAULT_THRESHOLDS` does not match the `agent` field set inside the scorer class, that phase will use the global default threshold (not the intended value). Verify alignment.
- `COMPONENT_MINIMUMS` apply to all phases. If a component is added to `PhaseScore`, add a corresponding minimum.

### 6.3 `ScoringContext` fields
If the orchestrator adds a new field to the context passed to scorers, `ScoringContext` in `scoring/types.ts` must declare it. Check that `previous_phases` contains keys corresponding to every prior agent's output that any scorer reads from.

### 6.4 `sensoryVariants` in location scorer
`agent2c-location-profiles-scorer.ts` must handle `sensoryVariants` as optional (not required for a passing score). Confirm scoring does not penalise its absence.

---

## 7. Story Validation Pipeline

**File:** `packages/story-validation/src/pipeline.ts`

### 7.1 Validator registration order
Validators run in order; `CharacterConsistencyValidator` is the only early-exit gate. Verify the constructor array matches the intended order:
1. `EncodingValidator`
2. `CharacterConsistencyValidator` ← early-exit on critical error
3. `ProseConsistencyValidator`
4. `NarrativeContinuityValidator`
5. `CaseTransitionValidator`
6. `DiscriminatingTestValidator`
7. `SuspectClosureValidator`
8. `PhysicalPlausibilityValidator`
9. `EraAuthenticityValidator`

Any new validator added must be inserted in the constructor. Validators are not auto-discovered.

### 7.2 `validateArtifact` calls in orchestrator
The orchestrator calls `validateArtifact(type, payload)` for every artifact. Confirm:
- The artifact type string matches a `*.schema.yaml` filename (minus `.schema.yaml`).
- The payload passed is the actual artifact object (not a wrapper), plus any required envelope fields (`cost`, `latencyMs`/`durationMs`).
- The schema file exists in `schema/`.

### 7.3 `ValidationReport` completeness
After adding or removing fields from `ValidationReport`, verify:
- All callers of `validate()` that destructure the result are updated.
- `GenerationReport` in the scoring aggregator (if it wraps `ValidationReport`) is updated.
- The web UI or API layer that reads `ValidationReport` fields is updated.

### 7.4 `ProseConsistencyReport` counter completeness
`buildConsistencyReport()` counts by `error.type`. When a new `type` string is added to any validator's `ValidationError`, check whether it should be counted in `ProseConsistencyReport`. If so, add a counter field and update `buildConsistencyReport`.

---

## 8. Automated Tests

**Run all tests before and after any change that touches validation, scoring, or schema logic.**

```powershell
# From repo root
cd packages/story-validation
npm test

# Or from root if a test script is wired:
npm --workspace=packages/story-validation test
```

### Test files and their coverage

| Test file | What it covers |
|-----------|---------------|
| `validators.test.ts` | `NarrativeContinuityValidator`, `CaseTransitionValidator`, `DiscriminatingTestValidator`, `SuspectClosureValidator` |
| `artifact-contract-drift.test.ts` | `cast_design` schema against known good and bad payloads — catches schema drift |
| `chapter-validator.test.ts` | `ChapterValidator` tightening rules; victim identity in chapter 1 |
| `name-sanitizer.test.ts` | `anonymizeUnknownTitledNames` behaviour |
| `report-repository.test.ts` | `FileReportRepository` save/get/list/aggregate |

### After schema changes
- If `cast_design.schema.yaml` changes, update `artifact-contract-drift.test.ts` to reflect new required fields.
- If a new artifact schema is added, add a new contract-drift test file for it.

### After adding a new validator
- Add unit tests covering at least: no-error path, `critical` error path, `moderate` error path.

---

## 9. Agent Prompt ↔ Schema Alignment

Every agent that produces a structured JSON artifact has a schema block embedded in its developer prompt. These must stay in sync with the YAML schemas.

### Check for each agent

| Agent | File | Output schema section to verify |
|-------|------|--------------------------------|
| Agent 1 | `agent1-setting.ts` | JSON example vs `setting_refinement.schema.yaml` |
| Agent 2 | `agent2-cast.ts` | JSON example vs `cast_design.schema.yaml` |
| Agent 2b | `agent2b-character-profiles.ts` | JSON example vs `character_profiles.schema.yaml` |
| Agent 2c | `agent2c-location-profiles.ts` | JSON example + `sensoryVariants` object vs `location_profiles.schema.yaml` |
| Agent 2d | `agent2d-temporal-context.ts` | JSON example vs `temporal_context.schema.yaml` |
| Agent 2e | `agent2e-background-context.ts` | JSON example vs `background_context.schema.yaml` |
| Agent 3b | `agent3b-hard-logic-devices.ts` | `lockedFacts` object structure vs `hard_logic_devices.schema.yaml` |
| Agent 7 | `agent7-narrative.ts` | Scene JSON example vs `narrative_outline.schema.yaml` |
| Agent 9 | `agent9-prose.ts` | Chapter JSON example vs `prose.schema.yaml` |

### Specific things to check in each prompt

1. **Required field names** — snake_case vs camelCase must match schema consistently.
2. **Enum values** — e.g. `"weak|moderate|strong|compelling"` in the prompt must list all and only the values in `allowed:`.
3. **Optional fields** — documented in the prompt as optional must be `required: false` in schema.
4. **`sensoryVariants` prompt block** — must show all 7 object fields (`id`, `timeOfDay`, `weather`, `sights`, `sounds`, `smells`, `mood`) in the JSON example.
5. **`lockedFacts` prompt block** — must show `id`, `value`, `description`, `appearsInChapters?` structure.

### Enum alignment quick-checks

| Field | Allowed values |
|-------|---------------|
| `motiveStrength` | `"weak"`, `"moderate"`, `"strong"`, `"compelling"` |
| `accessPlausibility` | `"impossible"`, `"unlikely"`, `"possible"`, `"easy"` |
| `gender` | `"male"`, `"female"`, `"non-binary"` |
| `tension` (relationships) | `"none"`, `"low"`, `"moderate"`, `"high"` |
| `humourStyle` | `"understatement"`, `"dry_wit"`, `"polite_savagery"`, `"self_deprecating"`, `"observational"`, `"deadpan"`, `"sardonic"`, `"blunt"`, `"none"` |
| `principleType` (HLD) | `"physical_law"`, `"mathematical_principle"`, `"cognitive_bias"`, `"social_logic"` |
| `type` (keyLocation) | `"interior"`, `"exterior"`, `"transitional"` |
| `act` (scene) | `1`, `2`, `3` |
| `timeOfDay` (sensoryVariant) | `"morning"`, `"afternoon"`, `"evening"`, `"night"` |
| `seasonal.season` | `"spring"`, `"summer"`, `"fall"`, `"winter"` |
| `discriminating_test.method` | `"reenactment"`, `"trap"`, `"constraint_proof"`, `"administrative_pressure"` |

---

## 10. Orchestrator Wiring Checks

**File:** `apps/worker/src/jobs/mystery-orchestrator.ts`

### 10.1 Every agent output must be validated
Check that every agent call is followed by a `validateArtifact()` call. Current coverage:

| Agent | Orchestrator `validateArtifact` call |
|-------|--------------------------------------|
| Agent 1 (setting) | ✅ line ~1787 |
| Agent 2 (cast) | ✅ line ~1907 |
| Agent 2b (char profiles) | ✅ line ~3247 |
| Agent 2c (location profiles) | ✅ line ~3321 |
| Agent 2d (temporal context) | ✅ line ~3390 |
| Agent 2e (background context) | ✅ line ~2004 |
| Agent 3b (hard logic) | ✅ line ~2086 |
| Agent 7 (narrative) | ✅ line ~3050 |
| Agent 9 (prose) | ✅ line ~3874 |

If a new agent is added, it must have a `validateArtifact` call with a matching schema.

### 10.2 `lockedFacts` propagation chain
The facts must flow correctly end-to-end:
1. Agent 3b generates `devices[].lockedFacts` in `HardLogicDeviceResult`.
2. `normalizeDevice()` in `agent3b-hard-logic-devices.ts` must preserve `lockedFacts`.
3. Orchestrator extracts them into `proseLockedFacts` before the prose call.
4. `generateProse()` receives them as `inputs.lockedFacts`.
5. `buildProsePrompt()` in `agent9-prose.ts` injects a `lockedFactsBlock` into the system prompt.
6. Orchestrator passes `{ ...cml, lockedFacts: proseLockedFacts }` to `validationPipeline.validate()`.
7. `ProseConsistencyValidator.checkLockedFacts()` reads `cml.lockedFacts` (no `as any`).

If any link in this chain is changed, verify the whole chain.

### 10.3 `narrativeState` propagation
1. `initNarrativeState()` called before the first prose call.
2. `narrativeState` passed into all prose `onBatchComplete` calls.
3. `updateNSD()` called inside `onBatchComplete` with the newly generated chapters.
4. Updated `narrativeState` passed to each subsequent prose batch call.

Verify no batch call reuses a stale state reference.

### 10.4 Scoring integration
If `enableScoring` is true, `executeAgentWithRetry()` must be called for each agent instead of the bare agent function. Any new agent added to the scoring path must be wrapped in `executeAgentWithRetry()` with the correct scorer key.

### 10.5 Sensory palette selection (inline in `buildProsePrompt`)
The former `selectSensoryPaletteForChapter()` helper was removed (P1-D, dead code). Sensory palette selection is now done entirely inline inside `buildProsePrompt()` in `agent9-prose.ts`:
- Reads `scene.setting.location`, `scene.setting.timeOfDay`, `scene.setting.atmosphere` (not `scene.timeOfDay` / `scene.weather` / `scene.setting.name`).
- Uses a `variants.find()` guard that only fires when at least one of `sceneTimeOfDay` or `sceneWeather` is non-empty; otherwise falls back to cycling by chapter number.
- If `sensoryVariants` is absent for a location, the block is silently omitted — no crash.

---

## 11. Cross-Package Dependency Checks

### Dependency graph (no cycles allowed)
```
@cml/llm-client          (no internal deps)
       ↓
@cml/cml                 (depends on llm-client for types only)
       ↓
@cml/prompts-llm         (depends on cml, llm-client)
@cml/story-validation    (depends on cml, llm-client)
       ↓
apps/worker              (depends on all packages)
apps/api                 (depends on story-validation, cml)
apps/web                 (UI only — no direct package deps)
```

### Rules
- `@cml/story-validation` must NOT import from `@cml/prompts-llm` (would create a cycle — `prompts-llm`→`story-validation`→`prompts-llm`).
- `@cml/cml` must NOT import from `@cml/prompts-llm` or `@cml/story-validation`.
- If a type is needed in both directions, extract it into `@cml/cml` (the shared base).
- Note: `classifyOpeningStyle()` is duplicated by necessity in `prose-consistency-validator.ts` to avoid the cycle — do not remove this duplication.

### Check after adding a new import
Run `tsc --noEmit` for every package that transitively depends on the changed package. Look for circular import errors.

---

## 12. Data Flow Integrity

### 12.1 Gender chain
Gender must flow unchanged from Agent 2 through to prose:
```
Agent 2 CastDesign.characters[].gender
  → CML CASE.cast[].gender
  → Agent 3 / 4 preserves gender in output
  → Agent 9 ProseGenerationInputs.cast (CastDesign)
  → buildProsePrompt() gender block in system prompt
  → ChapterValidator.checkVictimGender()
  → CharacterConsistencyValidator.checkPronounConsistency()
  → ProseConsistencyValidator.checkPronounDrift()
```

After any change touching cast, CML generation, or prose prompt construction, verify this chain.

### 12.2 `lockedFacts` chain
Described in §10.2 above.

### 12.3 Setting consistency chain
The `location` and `era` produced by Agent 1 must flow consistently:
```
Agent 1 SettingRefinement
  → Agent 2 (cast inputs: setting string)
  → Agent 2c (location profiles: settingRefinement input)
  → Agent 2d (temporal context: settingRefinement input)
  → Agent 3 CML CASE.meta.setting
  → Agent 7 NarrativeOutline scene.setting.location
  → Agent 9 `buildContextSummary()` setting lock line
```

### 12.4 `sensoryVariants` palette chain
```
Agent 2c generates keyLocations[].sensoryVariants[]
  → Stored in LocationProfilesResult
  → agent9-prose.ts buildProsePrompt() reads scene.setting.location/timeOfDay/atmosphere
  → Matches against sensoryVariants inline (find() guard only fires when timeOfDay/atmosphere non-empty)
  → Falls back to cycling by chapter number when no match
  → Formats as:
       "Chapter N (Location, morning / rain — mood):\n  Sights: ...\n  Sounds: ...\n  Smells: ..."
  → Injected into prose system prompt
```

### 12.5 `NarrativeState` chain (NSD)
```
initNarrativeState()
  → passed to generateProse() as narrativeState
  → agent9-prose.ts buildNSDBlock() formats current NSD into prompt
  → each chapter generated with NSD context
  → onBatchComplete() calls updateNSD(narrativeState, newChapters)
  → updated narrativeState passed to next prose batch
```

---

## 13. Narrative State (NSD) Checks

**File:** `packages/prompts-llm/src/types/narrative-state.ts`

### Interface completeness
`NarrativeState` must declare:
- `version: 1` — struct version sentinel
- `lockedFacts: LockedFact[]` — ground-truth physical evidence values (from Agent 3b)
- `characterPronouns: Record<string, string>` — map of character name → pronoun string
- `usedOpeningStyles: string[]` — last 8 opening-sentence style buckets (oldest first)
- `usedSensoryPhrases: string[]` — last 20 sensory phrases (oldest first, for repetition avoidance)
- `cluesRevealedToReader: string[]` — clue IDs from outline scenes already completed
- `chapterSummaries: Array<{ chapterNumber: number; summary: string }>` — accumulated summaries

### `updateNSD` correctness
After calling `updateNSD(state, chapters, startChapterNumber)`, verify:
- `usedOpeningStyles` keeps only the last 8 entries (sliced) — not unbounded.
- `usedSensoryPhrases` keeps only the last 20 entries (sliced).
- `chapterSummaries` is appended to — all accumulated summaries are preserved.
- `cluesRevealedToReader` is NOT updated by `updateNSD` — it is merged separately in `onBatchComplete` by the orchestrator after cross-referencing outline scenes for the completed batch.

### Export check
`initNarrativeState`, `updateNSD`, `NarrativeState`, `LockedFact` (note: different from story-validation's `LockedFact` — these are the NSD-local types) must all be exported from `packages/prompts-llm/src/index.ts`.

---

## 14. Prose Consistency Validator Checks

**File:** `packages/story-validation/src/prose-consistency-validator.ts`

### 14.1 Four check methods — all must be called from `validate()`
```typescript
validate(story, cml) {
  errors.push(...this.checkLockedFacts(story, cml));     // ✅
  errors.push(...this.checkPronounDrift(story, cml));    // ✅
  errors.push(...this.checkOpeningStyles(story));        // ✅
  errors.push(...this.checkContextLeakage(story));       // ✅
}
```

### 14.2 `checkLockedFacts` — reads `cml.lockedFacts` (no `as any`)
After any `CMLData` change, confirm this still compiles without a cast.

### 14.3 `checkOpeningStyles` — 7 style buckets
The classification regex list must match the 7 buckets in `classifyOpeningStyle()` (also duplicated in `narrative-state.ts`). If a bucket is added in one place, update both.

Buckets: `dialogue-open`, `noun-phrase-atmosphere`, `expository-setup`, `temporal-subordinate`, `character-action`, `time-anchor`, `general-descriptive`.

### 14.4 `checkContextLeakage` thresholds
- Pattern 1 (major): `"At The [A-Z]... in [A-Z]..."` — verbatim template phrase.
- Pattern 2 (minor): > 40-word sentence with `(room) + (country/estate) + (sensory word)`.
If the location profile template format changes, update pattern 1.

### 14.5 `buildConsistencyReport` in `pipeline.ts`
Must receive `cml: CMLData | undefined` (not just errors) so `lockedFactsChecked` can be populated from `cml?.lockedFacts?.length ?? 0`.

---

## 15. Examples and CML Files

**Location:** `examples/*.yaml`

### After schema changes
- Load each example file and run `validateCml()` on it.
- Errors in example files indicate either: (a) the schema tightened a rule that examples violate, or (b) an example was not updated after a deliberate constraint change.
- Example files are read-only reference material and should not be changed unless the schema change is backward-incompatible and intentional.

### After inference-path quality rule changes
Run each example through `validateInferencePathQuality()` to confirm they still pass the enhanced checks. If they do not, document why (e.g. legacy format) rather than silently weakening the rule.

---

## 16. Change-Class Quick Reference

Use this table to identify which sections above apply to your specific change.

| Change type | Sections to check |
|-------------|-------------------|
| Edit a YAML schema file (`schema/*.schema.yaml`) | §2 or §3, §4, §9, §8, §15 |
| Edit a TS interface in any agent file | §4, §1, §5 |
| Edit `CMLData` in `story-validation/src/types.ts` | §4.1, §7, §14.2, §1 |
| Edit `ValidationError` type or add new `type` string | §4.2, §7.4, §14 |
| Add or remove a field from `ValidationReport` | §7.3, §5 |
| Add or modify `ProseConsistencyReport` | §4.7, §7.4, §14.5 |
| Edit any agent prompt (system/developer/user section) | §9, §2, §3 |
| Edit `mystery-orchestrator.ts` | §10, §12, §7.2 |
| Add a new agent | §3, §5, §6.1, §9, §10.1, §8 |
| Edit `prose-consistency-validator.ts` | §14, §1, §8 |
| Edit `pipeline.ts` | §7, §14.5, §1 |
| Edit `narrative-state.ts` | §13, §1, §5 |
| Edit `thresholds.ts` or any scorer | §6, §1 |
| Edit `artifact-validator.ts` | §3, §8 |
| Edit `validator.ts` (CML validator) | §2, §8, §15 |
| Add a new package or change `package.json` deps | §11, §1 |
| Edit `artifact-accessors.ts` | §4.4, §1 |

---

## Appendix A — Files Most Likely to Drift

These files are edited frequently and have the highest risk of drift. Review them in every PR:

1. `packages/story-validation/src/types.ts` — `CMLData` and `ValidationError`
2. `packages/story-validation/src/pipeline.ts` — validator registration, `ValidationReport`, `buildConsistencyReport`
3. `packages/story-validation/src/prose-consistency-validator.ts` — four check methods
4. `packages/prompts-llm/src/agent2c-location-profiles.ts` — `SensoryVariant`, `KeyLocation`, `PrimaryLocationProfile`
5. `packages/prompts-llm/src/agent2b-character-profiles.ts` — `CharacterProfileOutput` vs `CharacterProfile`
6. `apps/worker/src/jobs/mystery-orchestrator.ts` — all `validateArtifact` calls, `lockedFacts` propagation, scoring wiring
7. `packages/prompts-llm/src/index.ts` — export completeness

## Appendix B — One-Shot Integrity Check Command

Run this sequence in PowerShell from the repo root to do the fastest full-sweep:

```powershell
# 1. Compile all packages
foreach ($pkg in @("packages/cml","packages/llm-client","packages/prompts-llm","packages/story-validation","apps/worker","apps/api")) {
    Write-Host "=== Compiling $pkg ===" -ForegroundColor Cyan
    Push-Location $pkg
    npx tsc --noEmit 2>&1 | Where-Object { $_ -match "error TS" }
    Pop-Location
}

# 2. Run all tests
Write-Host "=== Running tests ===" -ForegroundColor Cyan
Push-Location packages/story-validation
npm test
Pop-Location

# 3. Check for unsafe casts in validation layer
Write-Host "=== Checking for as-any casts in validation ===" -ForegroundColor Yellow
Select-String -Path "packages/story-validation/src/*.ts" -Pattern "as any" | ForEach-Object { $_.Line }
```

Any `as any` reported in step 3 in the validation layer is a flag for a potential type-gap — investigate whether a proper type declaration is missing.
