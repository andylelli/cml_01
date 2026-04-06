# ANALYSIS_30: Agents 1–8 Process Review

**Status:** Complete fact record — no analysis or opinion.  
**Companion document:** ANALYSIS_29 (Agent 9 / prose generation).  
**Source files consulted:**  
- `apps/worker/src/jobs/agents/agent{1,2,2b,2c,2d,2e,3,3b,5,6,65,7}-run.ts`  
- `packages/prompts-llm/src/agent{1-setting,2-cast,3b-hard-logic-devices,4-revision,5-clues,6-fairplay,65-world-builder,7-narrative,8-novelty}.ts`

---

## Section 1 — Pipeline Overview

### Actual Execution Order (confirmed from progress-% markers)

| Step | Agent label | Module | Phase key | Progress range |
|------|-------------|--------|-----------|----------------|
| 1 | Agent 1 | `agent1-run.ts` | setting | 0 → 12% |
| 2 | Agent 2 | `agent2-run.ts` | cast | 12 → 25% |
| 3 | Agent 2e | `agent2e-run.ts` | background-context | 25 → 28% |
| 4 | Agent 3b | `agent3b-run.ts` | hard_logic_devices | 28 → 31% |
| 5 | Agent 3 | `agent3-run.ts` | cml | 31 → 50% |
| 6 | Agent 4 | inside `agent3-run.ts` → `generateCML()` | (embedded) | (inside step 5) |
| 7 | Agent 8 | inside `agent3-run.ts` | novelty | 52 → 58% |
| 8 | Agent 5 | `agent5-run.ts` | clues | 50 → 62% |
| 9 | Agent 6 | `agent6-run.ts` | fairplay | 62 → 75% |
| 10 | Agent 6.5 | `agent65-run.ts` | world-builder | 90 → 93% |
| 11 | Agent 7 | `agent7-run.ts` | narrative | 75 → 87% |
| 12 | Agent 2b | `agent2b-run.ts` | character-profiles | 88 → 89% |
| 13 | Agent 2c | `agent2c-run.ts` | location-profiles | 89% |
| 14 | Agent 2d | `agent2d-run.ts` | temporal-context | 89 → 91% |
| 15 | Agent 9 | `agent9-run.ts` | prose | 91 → 100% |

> **Important:** Agent 4 has no separate run file. It is a revision loop embedded inside `generateCML()` in `@cml/prompts-llm`. Agent 8 has no separate run file; it is orchestrated directly from `agent3-run.ts` after the CML is written to `ctx.cml`.

> **Important:** Agents 2b, 2c, 2d run AFTER Agent 7. Their numeric labels indicate functional area (enrichment), not execution sequence.

---

## Section 2 — Shared Infrastructure

All agents share three helpers from `apps/worker/src/jobs/agents/shared.ts`:

### `executeAgentWithRetry`
Used by agents: 1, 2, 2b, 2c, 2d, 2e, 3b, 65, 7 (scoring-path only).

Signature (conceptual):
```typescript
executeAgentWithRetry(
  phaseKey: string,
  phaseName: string,
  generateFn: (retryFeedback?: string) => Promise<{ result, cost }>,
  scoreFn: (result) => Promise<{ adapted, score }>,
  retryManager, scoreAggregator, scoringLogger,
  runId, projectId, warnings, savePartialReport
): Promise<{ result, duration, cost }>
```

Behaviour:
- Calls `generateFn` with no feedback on first attempt.
- Passes the result to `scoreFn`; if score fails threshold, builds a `retryFeedback` string from score details and calls `generateFn` again.
- Maximum retries configured per-agent in `getGenerationParams()`.
- Appends retry warnings to `ctx.warnings`.
- Calls `savePartialReport()` after each attempt (best-effort).

When `ctx.enableScoring` is `false`, agents call the underlying `generate*()` function directly, skipping scoring-path retry entirely.

### `validateArtifact`
From `@cml/cml`. Called after every generation to check schema conformance.

- Returns `{ valid, errors[], warnings[] }`.
- Agents either throw on validation failure (agents 2e, 3b, 7) or log warnings only (agents 2b, 2c, 2d).

### `appendRetryFeedback` / `appendRetryFeedbackOptional`
Helpers that append a scored-retry feedback string to a prompt field (e.g., `tone`, `theme`) when retrying.

---

## Section 3 — Agent 1: Era & Setting Refiner

**File:** `apps/worker/src/jobs/agents/agent1-run.ts`  
**Prompt builder:** `packages/prompts-llm/src/agent1-setting.ts`  
**Entry function:** `runAgent1(ctx: OrchestratorContext): Promise<void>`

### 3.1 Inputs consumed from `ctx`
- `ctx.inputs.decade` — e.g., `"1930s"`
- `ctx.inputs.location` — e.g., `"Country manor"`
- `ctx.inputs.institution` — e.g., `"Manor"`
- `ctx.inputs.tone` — e.g., `"Golden Age Mystery"`
- `ctx.runId`, `ctx.projectId`

### 3.2 Prompt structure (`buildSettingPrompt`)

**System block:**
```
You are a mystery setting specialist with deep knowledge of historical periods, locations,
and authentic period details. Your role is to refine user-provided mystery settings by
adding realistic era constraints, technology limits, forensic capabilities, social norms,
and location-specific details.
```

**Developer block sections:**
1. Variation directives derived from `runId` hash:
   - `archStyle` (1–5): architectural emphasis level
   - `nameStyle` (1–5): naming convention distinctiveness
   - `focusArea` (1–3): Social Hierarchy / Physical Spaces / Atmospheric Elements
2. `buildEraConstraints(decade)` — JSON era template (technology, forensics, transportation, communication, socialNorms, policing)
3. `buildLocationConstraints(location, institution)` — JSON location template
4. Output format specification (JSON schema for `SettingRefinement`)
5. Six key requirements including anachronism detection and period-accurate anchors

**User block:**
```
Refine the following mystery setting:
**Era**: {decade}
**Location**: {location}
**Institution**: {institution}   (if present)
**Weather**: {weather}           (if present)
**Social Structure**: {socialStructure}  (if present)
**Tone**: {tone}
Analyze this setting and provide:
1. Complete era constraints (technology, forensics, social norms, policing)
2. Detailed location description and physical constraints
3. Atmosphere details including 2-3 period-accurate anchors
4. Any anachronisms or implausibilities to avoid
5. Specific recommendations for authenticity
6. Ensure realism.anachronisms and realism.implausibilities are empty in final JSON
Output JSON only.
```

### 3.3 LLM call
- Function: `refineSetting(ctx.client, {decade, location, institution, tone, runId, projectId})`
- Temperature / model: from `getGenerationParams().agent1_setting.params`

### 3.4 Scoring path (via `executeAgentWithRetry`)
- Scorer: `SettingRefinementScorer`
- Adapter: `adaptSettingForScoring(result, setting)`
- Previous phases passed to scorer: none

### 3.5 Hard fail gate
```typescript
if (setting.realism.anachronisms.length > 0 || setting.realism.implausibilities.length > 0) {
  throw new Error("Setting contains anachronisms or implausibilities after refinement");
}
```

### 3.6 Schema repair path
```typescript
const validation = validateArtifact("setting_refinement", ctx.setting.setting);
if (!validation.valid) {
  // Retry with schema error messages appended as guardrails (maxAttempts=2)
  // Throws if second attempt also fails
}
```

### 3.7 Output committed
- `ctx.setting` — full `SettingRefinementResult`
- `ctx.agentCosts["agent1_setting"]`, `ctx.agentDurations["agent1_setting"]`

---

## Section 4 — Agent 2: Cast Designer

**File:** `apps/worker/src/jobs/agents/agent2-run.ts`  
**Prompt builder:** `packages/prompts-llm/src/agent2-cast.ts`  
**Entry function:** `runAgent2(ctx: OrchestratorContext): Promise<void>`

### 4.1 Pre-generation name synthesis

Before any LLM call:
```typescript
const castNames = await generateCastNames(runId, totalCastSize, nameContext);
```

`generateCastNames` inputs:
- `totalCastSize` — from `ctx.inputs.castSize`
- `nameContext.decade` — from `ctx.setting.setting.era.decade`
- `nameContext.locationType` — from `ctx.setting.setting.location.type`
- `nameContext.locationDescription` — from `ctx.setting.setting.location.description`
- `nameContext.socialContext` — from `ctx.inputs.socialContext`

This function is deterministic given `runId` — same `runId` always produces the same names.

### 4.2 Inputs consumed from `ctx`
- `ctx.setting` (from Agent 1)
- `ctx.inputs.castSize`, `ctx.inputs.tone`, `ctx.inputs.socialContext`, `ctx.inputs.detectiveType`
- `nameContext` constructed from setting fields

### 4.3 Prompt structure (`buildCastPrompt`)

**System block:**
```
You are an expert character designer for mystery fiction. Your role is to create
psychologically rich characters with compelling secrets, complex motives, and
believable alibis. You design characters that interact in interesting ways and create
maximum dramatic tension.
```

**Developer block sections:**
1. Run-hash variation directives (name initial pool derived from hash; `deriveNameInitials(hash, count)`)
2. Character template per character (name, ageRange, occupation, roleArchetype, publicPersona, privateSecret, motiveSeed, motiveStrength, alibiWindow, accessPlausibility, stakes, characterArcPotential, gender)
3. RelationshipWeb schema
4. Diversity / stereotype-check rules
5. crimeDynamics schema (possibleCulprits, redHerrings, victimCandidates, detectiveCandidates)
6. Constraints: `crimeType: "Murder"` is hardcoded

**User block:**
- Lists the generated `characterNames`
- Specifies `castSize`, `setting`, `crimeType`, `tone`, `socialContext`, `detectiveType`
- Output: JSON only

### 4.4 Scoring path
- Scorer: `CastDesignScorer`
- Adapter: `adaptCastForScoring`
- Retry feedback appended to `tone` field via `appendRetryFeedback`

### 4.5 Hard fail gate
```typescript
if (cast.diversity.stereotypeCheck.length > 0) {
  throw new Error("Cast contains stereotypes that must be resolved");
}
```

### 4.6 Schema repair path
- If `validateArtifact("cast_design", ...)` fails:
  - Rebuilds call with `qualityGuardrails` containing schema error messages
  - Retries once; throws if second attempt fails schema

### 4.7 Output committed
- `ctx.cast` — `CastDesignResult`
- `ctx.agentCosts["agent2_cast"]`, `ctx.agentDurations["agent2_cast"]`

---

## Section 5 — Agent 2e: Background Context Generator

**File:** `apps/worker/src/jobs/agents/agent2e-run.ts`  
**Prompt builder:** `packages/prompts-llm/src/agent2e-background-context.ts`  
**Entry function:** `runAgent2e(ctx: OrchestratorContext): Promise<void>`

### 5.1 Execution position
Runs immediately after Agent 2 (progress 25 → 28%). Despite the "2e" label, it runs BEFORE Agent 3b and Agent 3, because Agent 3b requires `backgroundContext` as an input.

### 5.2 Inputs consumed
- `ctx.setting!.setting` — from Agent 1
- `ctx.cast!.cast` — from Agent 2
- `ctx.inputs.theme`, `ctx.inputs.tone || ctx.inputs.narrativeStyle`

### 5.3 Scoring path
- Scorer: `BackgroundContextScorer`
- Adapter: `adaptBackgroundContextForScoring`
- Previous phases: `agent1_setting` and `agent2_cast`
- Retry feedback appended to `theme` (via `appendRetryFeedbackOptional`) and `tone` (via `appendRetryFeedback`)

### 5.4 Schema validation
```typescript
const backgroundContextValidation = validateArtifact("background_context", ctx.backgroundContext);
if (!backgroundContextValidation.valid) {
  throw new Error("Background context artifact failed schema validation");
}
```
**Note:** Unlike agents 2b, 2c, 2d, agent 2e **throws** on schema failure (it is required by Agent 3b).

### 5.5 Output committed
- `ctx.backgroundContext` — extracted from `backgroundContextResult.backgroundContext`
- `ctx.agentCosts["agent2e_background_context"]`, `ctx.agentDurations["agent2e_background_context"]`

---

## Section 6 — Agent 3b: Hard-Logic Device Ideation

**File:** `apps/worker/src/jobs/agents/agent3b-run.ts`  
**Prompt builder:** `packages/prompts-llm/src/agent3b-hard-logic-devices.ts`  
**Entry function:** `runAgent3b(ctx: OrchestratorContext): Promise<void>`

### 6.1 Inputs consumed
- `ctx.setting!.setting` (Agent 1)
- `ctx.cast!.cast` (Agent 2)
- `ctx.backgroundContext!` (Agent 2e)
- `ctx.primaryAxis` — pre-computed before pipeline from `ctx.inputs`
- `ctx.initialHardLogicDirectives` — pre-computed `{ mechanismFamilies, hardLogicModes, difficultyMode, complexityLevel }`
- `ctx.noveltyConstraints` — derived from prior runs in the project
- `ctx.inputs.tone`, `ctx.inputs.theme`, `ctx.runId`, `ctx.projectId`

### 6.2 Prompt structure (`buildHardLogicDevicePrompt`)

**System block:**
```
You are a Golden Age detective plot engineer (1920-1945), specializing in fair-play
hard-logic murder mechanisms.
Hard constraints:
- No modern electronics, DNA, CCTV, digital records, or post-1945 science.
- No lazy trope shortcuts (twins-as-solution, secret passages with no clueability, etc.)
- Every mechanism must hinge on at least one of: physical law, mathematical principle,
  cognitive bias, social logic.
- Each concept must include visible fair-play clues and a falsifiable discriminating path.
```

**Developer block sections:**
1. Uniqueness seed: `{runId}-{projectId}`
2. Spec context: decade, location, institution, tone, theme, primaryAxis, mechanism family hints, hardLogicModes, difficultyMode
3. Novelty constraints section (if `ctx.noveltyConstraints` present):
   - `divergeFrom` list
   - `areas` list
   - `avoidancePatterns` joined by ` | `
4. Output JSON schema for `{ overview, devices[] }`
5. `lockedFacts` schema within each device

**User block:**
```
Generate novel hard-logic mechanism devices now.
Requirements:
1) Return exactly 5 devices unless explicitly impossible (then at least 3).
2) Ensure each device can be transformed into a CML false assumption + discriminating test.
3) Keep clues observable by readers before reveal.
4) Make mechanisms diagrammable and contradiction-driven.
5) If difficulty is "increase" or "extreme", include at least one multi-step or precision-timing construction.
6) For each device, include a 'moralAmbiguity' field: one sentence on gray area making crime morally complex.
7) For the primary device (first), populate 'lockedFacts' with 2-4 specific physical values
   that must appear verbatim in prose across chapters.
Return JSON only.
```

### 6.3 Scoring path
- Scorer: `HardLogicScorer`
- Adapter: `adaptHardLogicForScoring`
- Previous phases: `agent1_setting`, `agent2_cast`, `agent2e_background_context`

### 6.4 `mergeHardLogicDirectives` post-step
After generation and scoring:
```typescript
ctx.hardLogicDirectives = mergeHardLogicDirectives(
  ctx.initialHardLogicDirectives,
  ctx.hardLogicDevices!.devices
);
```
This merges the generated device data back into the directives object that Agent 3 will receive.

### 6.5 Schema validation
- `validateArtifact("hard_logic_devices", ctx.hardLogicDevices)` — **throws** on failure

### 6.6 Output committed
- `ctx.hardLogicDevices` — `HardLogicDeviceResult` (includes `devices[]` with `lockedFacts`)
- `ctx.hardLogicDirectives` — merged directives used by Agent 3
- `ctx.agentCosts["agent3b_hard_logic_devices"]`, `ctx.agentDurations["agent3b_hard_logic_devices"]`

---

## Section 7 — Agent 3: CML Generator

**File:** `apps/worker/src/jobs/agents/agent3-run.ts`  
**Prompt builder:** `packages/prompts-llm/src/agent3-cml.ts` → `buildCMLPrompt()`  
**Entry function:** `runAgent3(ctx: OrchestratorContext): Promise<void>`

> **Note:** This file also orchestrates Agent 4 (auto-revision, embedded inside `generateCML()`) and Agent 8 (novelty audit, called directly after CML is written).

### 7.1 Inputs assembled for `generateCML`
From context:
```typescript
{
  decade:             ctx.setting!.setting.era.decade,
  location:           ctx.setting!.setting.location.description,
  institution:        ctx.setting!.setting.location.type,
  tone:               ctx.inputs.tone || ctx.inputs.narrativeStyle || "Golden Age Mystery",
  weather:            ctx.setting!.setting.atmosphere.weather,
  socialStructure:    ctx.setting!.setting.era.socialNorms.join(", "),
  theme:              ctx.inputs.theme augmented with hardLogicDirectives?.hardLogicModes,
  castSize:           ctx.cast!.cast.characters.length,
  castNames:          ctx.cast!.cast.characters.map(c => c.name),
  castGenders:        characters mapped to {name, gender},
  detectiveType:      ctx.cast!.cast.crimeDynamics.detectiveCandidates[0],
  victimArchetype:    ctx.cast!.cast.crimeDynamics.victimCandidates[0],
  complexityLevel:    ctx.hardLogicDirectives!.complexityLevel,
  mechanismFamilies:  ctx.hardLogicDirectives!.mechanismFamilies,
  primaryAxis:        ctx.primaryAxis,
  hardLogicModes:     ctx.hardLogicDirectives!.hardLogicModes,
  difficultyMode:     ctx.hardLogicDirectives!.difficultyMode,
  hardLogicDevices:   ctx.hardLogicDevices!.devices,
  backgroundContext:  ctx.backgroundContext!,
  noveltyConstraints: ctx.noveltyConstraints,
  runId, projectId,
  examplesRoot:       ctx.examplesRoot  (path to seed YAMLs)
}
```

`theme` augmentation:
```typescript
const theme = [ctx.inputs.theme, ...(ctx.hardLogicDirectives?.hardLogicModes ?? [])]
  .filter(Boolean).join("; ");
```

### 7.2 `generateCML` internals (Agent 3 + Agent 4)
The function in `agent3-cml.ts`:
1. Calls `buildCMLPrompt(inputs)` to construct system/developer/user messages
2. Sends to LLM
3. Parses response as CML YAML/JSON
4. Validates against CML schema
5. If validation fails: calls `reviseCml()` (Agent 4 revision) with error feedback
   - `cmlResult.revisedByAgent4` = `true` when revision occurs
   - `cmlResult.revisionDetails.attempts` = count of revision iterations
6. Returns `CMLGenerationResult` including `validation.valid`

### 7.3 Back in `agent3-run.ts`
```typescript
if (!cmlResult.validation.valid) {
  throw new Error("CML generation failed validation");
}
ctx.cml = cmlResult.cml;
```
Progress logged at 50%.

### 7.4 Agent 8: Novelty Audit (inside `agent3-run.ts`)

Configured via:
```typescript
const similarityThreshold = ctx.inputs.similarityThreshold
  || parseFloat(process.env.NOVELTY_SIMILARITY_THRESHOLD || "0.9");
```

Skip condition:
```typescript
if (ctx.inputs.skipNoveltyCheck || similarityThreshold >= 1.0) { /* skip */ }
```

First audit call:
```typescript
const noveltyAudit = await auditNovelty(ctx.client, {
  generatedCML: ctx.cml,
  seedCMLs,
  similarityThreshold,
  runId: ctx.runId,
  projectId: ctx.projectId || "",
});
```

On first `"fail"`:
```typescript
// Build strongerConstraints from violations/warnings/recommendations and mostSimilarSeed
const strongerConstraints = {
  divergeFrom: [...ctx.noveltyConstraints?.divergeFrom ?? [], ctx.noveltyAudit.mostSimilarSeed],
  areas: ctx.noveltyAudit.violations.map(v => v),          // violation strings
  avoidancePatterns: [
    ...(ctx.noveltyConstraints?.avoidancePatterns ?? []),
    ...ctx.noveltyAudit.violations,
    ...ctx.noveltyAudit.warnings,
    ...ctx.noveltyAudit.recommendations,
    ctx.noveltyAudit.mostSimilarSeed,
  ].slice(0, 16),
};
// Regenerate CML with strongerConstraints
// Re-run novelty audit
```

On second `"fail"`:
```typescript
if (process.env.NOVELTY_HARD_FAIL === "true") {
  throw new Error("Novelty audit failed after retry");
} else {
  ctx.warnings.push("Novelty audit failed but NOVELTY_HARD_FAIL not set — continuing");
}
```

### 7.5 Novelty scoring formula
```typescript
noveltyTotal = noveltyStatus === "pass"
  ? Math.max(80, (1 - highestSim) * 100)
  : noveltyStatus === "warning" ? 70 : 45;
```

Scoring dimension weights (logged in progress text):
- plot: 0.30
- character: 0.25
- setting: 0.15
- solution: 0.25
- structural: 0.05

Score recorded via `ctx.scoreAggregator.upsertPhaseScore("agent8_novelty", ...)`.

If novelty check is skipped, a synthetic 100/A passing score is recorded.

### 7.6 Output committed
- `ctx.cml` — `CaseData`
- `ctx.noveltyAudit` — `NoveltyAuditResult`
- `ctx.noveltyStatus` — `"pass" | "warning" | "fail"`
- `ctx.agentCosts["agent3_cml"]`, `ctx.agentDurations["agent3_cml"]`
- `ctx.agentCosts["agent8_novelty"]`, `ctx.agentDurations["agent8_novelty"]`

---

## Section 8 — Agent 4: CML Auto-Revisor (Embedded)

**Not a separate run file.** Lives inside `generateCML()` in `packages/prompts-llm/src/agent3-cml.ts`.  
**Prompt builder:** `packages/prompts-llm/src/agent4-revision.ts` → `buildCMLRevisionPrompt()` / `reviseCml()`

### 8.1 Trigger condition
Called when the CML generated by Agent 3's first LLM pass fails schema validation.

### 8.2 `reviseCml()` inputs
```typescript
{
  originalPrompt: { system, developer, user },  // Original Agent 3 prompt
  invalidCml: cmlYaml,                          // The failed YAML string
  validationErrors: string[],                   // Schema error messages
  attempt: number,                              // Current revision attempt index
  runId, projectId,
}
```

### 8.3 Prompt structure (`buildCMLRevisionPrompt`)
- System: same agent-3 CML generator context
- Developer: original developer block + explicit list of validation errors to fix
- User: `"The previous CML output had validation errors. Fix them and return valid YAML only."`

### 8.4 Surfaced in `agent3-run.ts`
- `cmlResult.revisedByAgent4: boolean`
- `cmlResult.revisionDetails.attempts: number`

These values are recorded to the score aggregator as metadata but do not produce a separate phase score.

---

## Section 9 — Agent 5: Clue Distribution

**File:** `apps/worker/src/jobs/agents/agent5-run.ts`  
**Prompt builder:** `packages/prompts-llm/src/agent5-clues.ts`  
**Entry function:** `runAgent5(ctx: OrchestratorContext): Promise<void>`

### 9.1 Inputs consumed
- `ctx.cml!` — full CaseData from Agent 3
- `clueDensity` derived from `ctx.inputs.targetLength`:
  - `"short"` → `"minimal"`
  - `"long"` → `"dense"`
  - otherwise → `"moderate"`
- `redHerringBudget: 2` (hardcoded)

### 9.2 Prompt structure (conceptual)

**System block:** Clue extraction specialist role — derive only from CML, introduce no new facts.

**Developer block sections:**
1. Pre-analysis of CML to generate explicit clue requirements (`RequiredClueSpec[]`):
   - One required spec per `inference_path.step`
   - Specifies: `requirement`, `supportsInferenceStep`, `evidenceType`, `criticality`, `sourceInCML`, `keyTerms`, `suggestedPlacement`, `category`
2. `fairPlayFeedback` injection (if retry or WP4 coverage regeneration)
3. Output schema: `{ clues[], redHerrings[], clueTimeline, fairPlayChecks }`

**User block:**
- "Extract and distribute clues from the CML below. Do not invent new facts."
- Full CML content

**Important note:** Agent 5 does NOT use `executeAgentWithRetry` — it is NOT on the scoring path. All retries are explicit in-function loops.

### 9.3 Execution flow

**Pass 1:** `extractClues(ctx.client, {cml, clueDensity, redHerringBudget})`

**Guardrail pass 1 (`applyClueGuardrails`):**
- Deterministic checks: clue ID uniqueness, early/mid placement of essential clues, no detective-only clues
- If `hasCriticalIssues`:
  - Regenerate with `fairPlayFeedback` encoding the guardrail failures as violations
  - **Pass 2** — second `extractClues` call
  - Guardrail pass 2 — if still critical: **throw** `"Clue generation failed deterministic fair-play guardrails"`

**WP4: Inference Path Coverage Gate:**  
Five checks run on clues:
1. `checkInferencePathCoverage` — each `inference_path.step` needs ≥1 observation clue
2. `checkContradictionPairs` — each step should have observation + contradiction/elimination
3. `checkFalseAssumptionContradiction` — must have ≥1 `evidenceType="contradiction"` clue
4. `checkDiscriminatingTestReachability` — test references must link to clues
5. `checkSuspectElimination` — each suspect named in at least one clue

If critical gaps found:
- Regenerates with `coverageFeedback` listing uncovered step numbers and suggestions
- **Pass 3** — third `extractClues` call
- Post-coverage guardrail applied (no throw on failure, warnings only)

### 9.4 Phase score
Recorded after all retries. Formula:
```typescript
clueValidation = Math.round((guardrailScore + coverageScore) / 2);  // 75 or 100 each
clueTotal = Math.round(clueValidation * 0.5 + clueCountScore * 0.3 + 100 * 0.2);
// clueCountScore = clueCount >= 8 ? 100 : Math.round((clueCount / 8) * 100)
```

### 9.5 Output committed
- `ctx.clues` — `ClueDistributionResult`
- `ctx.coverageResult` — `InferenceCoverageResult`
- `ctx.allCoverageIssues` — `ClueGuardrailIssue[]`
- `ctx.agentCosts["agent5_clues"]`, `ctx.agentDurations["agent5_clues"]` (cumulative across all passes)

---

## Section 10 — Agent 6: Fair Play Auditor

**File:** `apps/worker/src/jobs/agents/agent6-run.ts`  
**Prompt builders:** `agent6-fairplay.ts`, `agent5-clues.ts` (re-called for regen), `agent3-cml.ts` (`buildCMLPrompt`, `reviseCml`), `agent6-blind-reader.ts` (`blindReaderSimulation`)  
**Entry function:** `runAgent6(ctx: OrchestratorContext): Promise<void>`

### 10.1 Inputs consumed
- `ctx.cml!`, `ctx.clues!`
- `ctx.inputs.targetLength` (for `clueDensity`)
- `ctx.criticalFairPlayRules` — `Set<string>` of rule names that override severity to "critical"
- `getGenerationParams().agent6_fairplay.params` — provides:
  - `retries.max_fair_play_attempts`
  - `retries.max_retry_cost_usd`
  - `retries.max_total_attempts_with_targeted_regen`

### 10.2 Main fair play loop

Iteration limit: `fairPlayConfig.retries.max_fair_play_attempts` (typically 3)

```
while (attempt < max_attempts):
  fairPlayAudit = auditFairPlay(cml, clues)
  if pass: break
  else: regenerate clues with fairPlayFeedback → retry
```

`auditFairPlay()` prompt:
- System: fair play specialist for Golden Age mystery
- Developer: list of fair play rules (Knox Decalogue, Van Dine Rules, logical deducibility)
- User: full CML + clues content
- Output: `{ overallStatus, violations[], warnings[], recommendations[] }`

Clue regeneration on non-pass: calls `extractClues()` again with `fairPlayFeedback` embedding the audit violations/warnings.

### 10.3 Warning path on non-pass
When max attempts exhausted and still not passing:
- Critical failure → `ctx.warnings.push(...)` with `[critical]` prefix, **continue** (no throw)
- Non-critical failure → `ctx.warnings.push(...)` with FAILED/needs-minor-revisions label

### 10.4 Phase score (`recordFairPlayScore` async closure)
```typescript
fpValidation = status === "pass" ? 100 : status === "needs-revision" ? 70 : 45;
total = fpValidation;  // quality/completeness/consistency all 100
```
Called at two points: (1) after main loop, (2) after blind-reader clue regen (if triggered).

### 10.5 WP5B: Blind Reader Simulation

Trigger condition: CML has recognisable cast names, a `false_assumption.statement`, and a `culpability.culprits[0]`.

```typescript
blindResult = await blindReaderSimulation(
  ctx.client, ctx.clues!, falseAssumptionStatement, castNamesForBlind,
  { runId, projectId }
);
```

Blind reader prompt: LLM plays a reader who has only seen the clue list (no CML). Outputs `suspectedCulprit`, `confidenceLevel`, `reasoning`, `missingInformation`.

On failure (`readerGotItRight === false`):
- **Clue regeneration** with `Information Parity` violation feedback
- Re-runs `auditFairPlay` on new clues
- Updates `ctx.clues`, `ctx.fairPlayAudit`
- `recordFairPlayScore` called again

### 10.6 WP6B + WP8: CML Structural Retry

Trigger: `fairPlayAudit.overallStatus === "fail"` AND `hasCriticalFairPlayFailure`.

`classifyFairPlayFailure()` determines path:

| Class | Trigger | Action |
|-------|---------|--------|
| `"inference_path_abstract"` | >50% of steps are short or lack `required_evidence` | Revise CML with instructions to rewrite each step with concrete observations |
| `"constraint_space_insufficient"` | `constraint_space` has <4 total entries | Revise CML with instructions to add temporal/access/physical constraints |
| `"clue_only"` | CML structure sound | Regenerate clues only (one more pass) |
| `"clue_coverage"` | Coverage gaps or clue-visibility violations | Falls through to clue-only path |

For structural classes: calls `reviseCml()` (same function as Agent 4) with targeted instructions, then re-extracts clues, re-audits.

Cost guard: stops retrying if `fairPlayRetryCost > max_retry_cost_usd`.

### 10.7 Output committed
- `ctx.fairPlayAudit` — `FairPlayAuditResult`
- `ctx.hasCriticalFairPlayFailure` — `boolean`
- `ctx.clues` — may be mutated by clue regenerations
- `ctx.cml` — may be mutated by WP6B CML revision
- `ctx.agentCosts["agent6_fairplay"]`, `ctx.agentCosts["agent6_blind_reader"]`, `ctx.agentCosts["agent4_fairplay_revision"]`

---

## Section 11 — Agent 6.5: World Builder

**File:** `apps/worker/src/jobs/agents/agent65-run.ts`  
**Prompt builder:** `packages/prompts-llm/src/agent65-world-builder.ts`  
**Entry function:** `runAgent65(ctx: OrchestratorContext): Promise<void>`

### 11.1 Execution position
Progress 90 → 93%. Runs AFTER Agent 7 (narrative), BEFORE the late enrichment agents (2b, 2c, 2d) and Agent 9.

> **Note:** The progress-% value of 90 appears after Agent 7 lands at 87%. The world builder slot was added late in development and is positioned here to have the full narrative outline available.

### 11.2 Inputs consumed
```typescript
{
  caseData: ctx.cml!,
  characterProfiles: ctx.characterProfiles!,
  locationProfiles: ctx.locationProfiles!,
  temporalContext: ctx.temporalContext!,
  backgroundContext: ctx.backgroundContext!,
  hardLogicDevices: ctx.hardLogicDevices!,
  clueDistribution: ctx.clues!,
}
```
This agent aggregates outputs from Agents 1, 2, 3, 3b, 5, 2b, 2c, 2d.

### 11.3 Scoring path
- Scorer: `Agent65WorldBuilderScorer`
- Inputs to scorer include `castSize` from `ctx.cml.CASE.cast.length`
- Previous phases: `{}` (no specific upstream phases required by scorer)

### 11.4 No schema validation
`runAgent65` calls no `validateArtifact`. The world document result structure is consumed directly.

### 11.5 Generated document structure (from `WorldDocumentResult`)
Fields used by downstream agents (Agent 7 enrichment and Agent 9 prose):
- `storyEmotionalArc.turningPoints[]` — position-keyed emotional descriptors
- `storyEmotionalArc.dominantRegister` — fallback register
- `characterVoiceSketches[]` — name + voiceDescription per character
- `humourPlacementMap[]` — scenePosition → permission/permittedCharacters/permittedForms/condition
- `historicalMoment.physicalConstraints[]` — era texture notes
- `locationRegisters[]` — locationId/name → emotionalRegister + cameraAngle

### 11.6 Output committed
- `ctx.worldDocument` — `WorldDocumentResult`
- `ctx.agentCosts["agent65_world_builder"]`, `ctx.agentDurations["agent65_world_builder"]`

---

## Section 12 — Agent 7: Narrative Formatter

**File:** `apps/worker/src/jobs/agents/agent7-run.ts`  
**Prompt builder:** `packages/prompts-llm/src/agent7-narrative.ts`  
**Entry function:** `runAgent7(ctx: OrchestratorContext): Promise<void>`

### 12.1 Inputs consumed
- `ctx.cml!`, `ctx.clues!`
- `ctx.inputs.targetLength`, `ctx.inputs.narrativeStyle`, `ctx.inputs.detectiveType`
- `ctx.worldDocument` (optional — used in World-First enrichment post-step)

### 12.2 Prompt structure (conceptual)

**System block:**
```
You are an expert narrative architect for mystery fiction. Transform the validated CML
and clue distribution into a scene-by-scene narrative outline using three-act structure.
Temperature: 0.5 (moderate creative, grounded in CML)
```

**Developer block sections:**
1. `targetLength` → `getSceneTarget(targetLength)` expected scene count
2. Act structure guidelines (Act I 35-40%, Act II 35-40%, Act III 20-25% of scenes)
3. `clue_to_scene_mapping` from `cml.prose_requirements` — specific scene placement directives
4. Full CML structure (CASE block, inference_path, constraint_space, etc.)
5. `qualityGuardrails` array (if schema-repair or coverage-repair retry)

**User block:**
- Provide scene-by-scene outline as JSON `NarrativeOutline`
- Each scene: sceneNumber, act, title, setting, characters, purpose, cluesRevealed[], dramaticElements, summary, estimatedWordCount

### 12.3 Scoring path
- Scorer: `NarrativeScorer`
- Adapter: `adaptNarrativeForScoring(narrative, cast, clueMappings)`
- Previous phases: `agent2_cast`
- Retry feedback appended as `qualityGuardrails`

### 12.4 Schema repair path
```typescript
validateArtifact("narrative_outline", narrative)
→ if invalid: retry with schemaRepairGuardrails (up to 8 error messages)
→ if second also invalid: throw "Narrative outline artifact failed schema validation"
```

### 12.5 Scene count safety gate
After scoring retry:
```typescript
expectedScenes = getSceneTarget(targetLength)
if (narrative.totalScenes < expectedScenes - 2):
  // Retry with explicit count lock:
  // "CRITICAL SCENE COUNT: ... You MUST generate exactly N scenes ..."
  // Accept if retry.totalScenes >= expectedScenes - 1
```

### 12.6 Pre-prose outline quality gate (`evaluateOutlineCoverage`)
Two checks on the produced outline:
1. At least one scene contains discriminating test / re-enactment language
2. At least one scene contains suspect elimination / closure language

On failure: regenerate with targeted guardrails + scene-count lock (`buildNarrativeSceneCountGuardrails`).
Accept retry only if: (a) fewer coverage issues AND (b) scene count unchanged.

### 12.7 Clue pacing gate
```
if (clueSceneCount < ceil(totalScenes * 0.6)):
  applyDeterministicCluePreAssignment(narrative, cml, clues, 0.6)
  → if still short: LLM retry with pacing guardrail + scene-count lock
  → post-retry: second deterministic assignment pass
```

`applyDeterministicCluePreAssignment` — four-step deterministic algorithm:
1. Respect `prose_requirements.clue_to_scene_mapping` from CML (direct scene assignments)
2. Anchor every essential clue in its preferred-act scene
3. Fill clue-gap runs > 2 scenes by inserting at every 3rd position
4. Act-balanced threshold fill until 60% coverage reached

### 12.8 World-First scene enrichment (`applyWorldFirstSceneEnrichment`)
```typescript
if (ctx.worldDocument):
  applyWorldFirstSceneEnrichment(narrative, ctx.worldDocument)
```
Writes five fields deterministically to every scene:
- `emotionalRegister` — from `storyEmotionalArc.turningPoints` matched by `toArcPosition(scenePosition)`
- `dominantCharacterNote` — from `characterVoiceSketches` matched by scene characters
- `humourGuidance` — from `humourPlacementMap` matched by `toSceneType(act, sceneInAct)`
- `eraTextureNote` — from `historicalMoment.physicalConstraints`
- `locationRegisterNote` — from `locationRegisters` matched by scene location name

`subtextNote` is NOT set deterministically — left to Agent 7 LLM output.

### 12.9 Output committed
- `ctx.narrative` — `NarrativeOutline`
- `ctx.outlineCoverageIssues` — final coverage issues (passed to Agent 9 as guardrails if non-empty)
- `ctx.agentCosts["agent7_narrative"]`, `ctx.agentDurations["agent7_narrative"]` (cumulative)

---

## Section 13 — Agent 2b: Character Profiles (Late Enrichment)

**File:** `apps/worker/src/jobs/agents/agent2b-run.ts`  
**Prompt builder:** `packages/prompts-llm/src/agent2b-character-profiles.ts`  
**Entry function:** `runAgent2b(ctx: OrchestratorContext): Promise<void>`

### 13.1 Execution position
Progress 88 → 89%. Runs after Agent 7. Requires `ctx.cml!` and `ctx.cast!`.

### 13.2 Inputs consumed
```typescript
generateCharacterProfiles(ctx.client, {
  caseData: ctx.cml!,
  cast: ctx.cast!.cast,
  tone,
  targetWordCount: 1000,
  runId, projectId,
})
```

### 13.3 Scoring path
- Scorer: `CharacterProfilesScorer`
- Previous phases: not specified in the scorer call

### 13.4 Schema validation
```typescript
validateArtifact("character_profiles", ctx.characterProfiles)
→ warnings logged, NO throw
```

### 13.5 Output committed
- `ctx.characterProfiles` — used by Agent 6.5 and Agent 9
- `ctx.agentCosts["agent2b_character_profiles"]`, `ctx.agentDurations["agent2b_character_profiles"]`

---

## Section 14 — Agent 2c: Location Profiles (Late Enrichment)

**File:** `apps/worker/src/jobs/agents/agent2c-run.ts`  
**Entry function:** `runAgent2c(ctx: OrchestratorContext): Promise<void>`

### 14.1 Execution position
Progress 89%. Runs after Agent 2b. Requires `ctx.cml!` and `ctx.narrative!`.

### 14.2 Inputs consumed
```typescript
generateLocationProfiles(ctx.client, {
  settingRefinement: ctx.setting!.setting,
  caseData: ctx.cml!,
  narrative: ctx.narrative,
  tone,
  targetWordCount: 1000,
  runId, projectId,
})
```

`narrative` is required — location profiles incorporate scene-level atmosphere from the narrative outline.

### 14.3 Scoring path
- Scorer: `LocationProfilesScorer`
- Previous phases: `agent1_setting`, `agent2e_background_context`

### 14.4 Schema validation — warnings only (no throw)

### 14.5 Output committed
- `ctx.locationProfiles` — used by Agent 6.5 and Agent 9

---

## Section 15 — Agent 2d: Temporal Context (Late Enrichment)

**File:** `apps/worker/src/jobs/agents/agent2d-run.ts`  
**Entry function:** `runAgent2d(ctx: OrchestratorContext): Promise<void>`

### 15.1 Execution position
Progress 89 → 91%. Requires `ctx.setting!` and `ctx.cml!`.

### 15.2 Inputs consumed
```typescript
generateTemporalContext(ctx.client, {
  settingRefinement: ctx.setting!.setting,
  caseData: ctx.cml!,
  runId, projectId,
  qualityGuardrails: retryFeedback ? [retryFeedback] : undefined,
})
```

### 15.3 Scoring path
- Scorer: `TemporalContextScorer`
- Previous phases: `agent1_setting`, `agent2e_background_context`

### 15.4 Output
- `ctx.temporalContext` — includes `specificDate.month` and `specificDate.year`
- Progress confirms with: `"Temporal context generated (${month} ${year})"`

### 15.5 Schema validation — warnings only (no throw)

---

## Section 16 — Agent 8: Novelty Auditor (as Stand-Alone Call)

Covered in Section 7.4. Recapped here for completeness.

**Not a separate run file.** Orchestrated within `agent3-run.ts` after `ctx.cml` is set.  
**Prompt builder:** `packages/prompts-llm/src/agent8-novelty.ts`

### 16.1 Prompt structure (`buildNoveltyPrompt`)

**System block:**
```
You are an expert plagiarism and similarity detection specialist for mystery fiction.
Critical Principle: The seed CMLs provide structural inspiration only.
The generated mystery must NOT copy:
- Specific plot details (same crime, method, motive combination)
- Character names, profiles, or relationship dynamics
[...]
```

**Developer block:**
- Similarity threshold: `{similarityThreshold}`
- Dimension weights (hard-coded in the developer block):
  - Plot similarity: 0.30
  - Character similarity: 0.25
  - Setting similarity: 0.15
  - Solution similarity: 0.25
  - Structural similarity: 0.05
- Output JSON schema for `NoveltyAuditResult`

**User block:**
- `"Generated CML to audit:"` + full CML content
- `"Seed CMLs to compare against:"` + each seed CML with title header
- `"Provide similarity scores and overall assessment."`

### 16.2 Output fields
```typescript
{
  status: "pass" | "fail" | "warning",
  overallNovelty: number,           // 0-1
  mostSimilarSeed: string,          // title of most similar seed
  highestSimilarity: number,        // 0-1
  similarityScores: SimilarityScore[],
  violations: string[],
  warnings: string[],
  recommendations: string[],
  summary: string,
}
```

---

## Section 17 — Execution Order Revision: Where Agent 6.5 and 2b/2c/2d Actually Run

The actual orchestrator sequence (from `mystery-orchestrator.ts`) establishes:

```
Agent 1 → Agent 2 → Agent 2e → Agent 3b → Agent 3 (+ 4 + 8) → Agent 5 → Agent 6
→ [Agent 2b, 2c, 2d run here — after Agent 6, before Agent 6.5]
→ Agent 6.5 (World Builder)
→ Agent 7 (Narrative)
→ Agent 9 (Prose)
```

**Correction from earlier analysis:** 2b/2c/2d likely run BETWEEN Agent 6 and Agent 6.5, not after Agent 7. Agent 6.5 requires `characterProfiles`, `locationProfiles`, `temporalContext`, and `backgroundContext` as inputs. These must therefore be present before Agent 6.5 executes.

The progress markers (2b at 88%, 2c at 89%, 2d at 89→91%) are not strictly sequential with Agent 7 (75→87%). The progress-% labels in individual agent files may reflect the range assigned to that agent in isolation ≠ their true orchestration slot.

Definitive ordering requires reading `mystery-orchestrator.ts` which calls all agents in sequence. The fact that Agent 6.5 inputs require 2b/2c/2d outputs is the structural anchor.

---

## Section 18 — Complete Annotated Step Sequence

```
[0%]   Pre-pipeline: ctx initialized; locationSpec, primaryAxis, initialHardLogicDirectives,
                     seedEntries, noveltyConstraints computed from ctx.inputs

[0→12%]  Agent 1: refineSetting → ctx.setting
          ↳ Hard fail on anachronisms/implausibilities
          ↳ Schema repair retry if invalid

[12→25%] Agent 2: designCast → ctx.cast
          ↳ Deterministic name generation from runId hash
          ↳ Hard fail on stereotype check
          ↳ Schema repair retry with guardrails

[25→28%] Agent 2e: generateBackgroundContext → ctx.backgroundContext
          ↳ Scoring-path retry (BackgroundContextScorer)
          ↳ Hard fail on schema validation

[28→31%] Agent 3b: generateHardLogicDevices → ctx.hardLogicDevices
          ↳ Scoring-path retry (HardLogicScorer)
          ↳ Hard fail on schema validation
          ↳ mergeHardLogicDirectives → ctx.hardLogicDirectives

[31→50%] Agent 3: generateCML → ctx.cml
          ↳ Agent 4 (embedded): reviseCml on schema failure
          ↳ Hard fail if cmlResult.validation.valid === false

[52→58%] Agent 8: auditNovelty → ctx.noveltyAudit
          ↳ On fail: regenerate CML with strongerConstraints + re-audit
          ↳ NOVELTY_HARD_FAIL env var controls throw vs warning

[50→62%] Agent 5: extractClues → ctx.clues
          ↳ Pass 1: initial extraction
          ↳ Pass 2 (if guardrail critical): regen with guardrail feedback
          ↳ Pass 3 (if WP4 coverage gaps): regen with inference coverage feedback
          ↳ Hard fail if 2nd guardrail pass also fails

[62→75%] Agent 6: auditFairPlay (loop ×N) → ctx.fairPlayAudit
          ↳ Clue regen on non-pass (up to max_fair_play_attempts)
          ↳ WP5B blind reader simulation → optional clue regen + re-audit
          ↳ WP6B/WP8: classify failure → CML revision or targeted clue regen

[~75%]   Agent 2b: generateCharacterProfiles → ctx.characterProfiles
          ↳ Scoring-path retry (CharacterProfilesScorer)
          ↳ Schema warnings only

[~76%]   Agent 2c: generateLocationProfiles → ctx.locationProfiles
          ↳ Scoring-path retry (LocationProfilesScorer)
          ↳ Schema warnings only

[~77%]   Agent 2d: generateTemporalContext → ctx.temporalContext
          ↳ Scoring-path retry (TemporalContextScorer)
          ↳ Schema warnings only

[90→93%] Agent 6.5: generateWorldDocument → ctx.worldDocument
          ↳ Scoring-path retry (Agent65WorldBuilderScorer)
          ↳ No schema validation

[75→87%] Agent 7: formatNarrative → ctx.narrative
          ↳ Scoring-path retry (NarrativeScorer)
          ↳ Schema repair retry (throw on 2nd failure)
          ↳ Scene count safety gate (retry with explicit N)
          ↳ Pre-prose outline quality gate (discriminating test + suspect closure)
          ↳ Clue pacing gate: deterministic pre-assignment, then LLM retry if needed
          ↳ World-First scene enrichment (deterministic, 5 fields per scene)

[91→100%] Agent 9: prose generation (see ANALYSIS_29)
```

---

## Section 19 — Key Runtime Configuration Values

| Parameter | Source | Default |
|-----------|--------|---------|
| `NOVELTY_SIMILARITY_THRESHOLD` | env var | `0.9` |
| `NOVELTY_HARD_FAIL` | env var | `false` (no throw on fail) |
| `similarityThreshold >= 1.0` | disables novelty check | — |
| `ctx.inputs.skipNoveltyCheck` | caller | `false` |
| `max_fair_play_attempts` | `getGenerationParams().agent6_fairplay.params.retries` | 3 |
| `max_retry_cost_usd` | same | configured |
| `max_total_attempts_with_targeted_regen` | same | 3 |
| `clueDensity` | `targetLength` | `"moderate"` |
| `redHerringBudget` | hardcoded in agent5-run.ts | 2 |
| `minCoverageRatio` | hardcoded in agent7-run.ts | 0.6 |

---

## Section 20 — Cost and Duration Tracking

Each agent records to:
```typescript
ctx.agentCosts["{phaseKey}"]    = numeric USD
ctx.agentDurations["{phaseKey}"] = milliseconds
```

Phase keys:
- `agent1_setting`
- `agent2_cast`
- `agent2b_character_profiles`
- `agent2c_location_profiles`
- `agent2d_temporal_context`
- `agent2e_background_context`
- `agent3_cml`
- `agent3b_hard_logic_devices`
- `agent4_fairplay_revision` (only when WP6B fires)
- `agent5_clues` (cumulative — all passes summed)
- `agent6_fairplay` (cumulative — main loop + blind re-audit)
- `agent6_blind_reader`
- `agent7_narrative` (cumulative — all retries summed)
- `agent8_novelty`
- `agent65_world_builder`

---

## Section 21 — Helper Functions Referenced

| Helper | File | Used by |
|--------|------|---------|
| `generateCastNames` | `shared.ts` or `agent2-run.ts` local | Agent 2 |
| `applyClueGuardrails` | `shared.ts` | Agents 5, 6 |
| `mergeHardLogicDirectives` | `shared.ts` | Agent 3b |
| `buildOutlineRepairGuardrails` | `shared.ts` | Agent 7 |
| `applyDeterministicCluePreAssignment` | `agent7-run.ts` (exported) | Agent 7 |
| `applyWorldFirstSceneEnrichment` | `agent7-run.ts` (exported) | Agent 7 |
| `captureNarrativeSceneCountSnapshot` | `agent7-run.ts` (exported) | Agent 7 |
| `checkNarrativeSceneCountFloor` | `agent7-run.ts` (exported) | Agent 7 |
| `classifyFairPlayFailure` | `agent6-run.ts` (local) | Agent 6 |
| `checkInferencePathCoverage` | `agent5-run.ts` (local) | Agent 5 |
| `checkContradictionPairs` | `agent5-run.ts` (local) | Agent 5 |
| `checkFalseAssumptionContradiction` | `agent5-run.ts` (local) | Agent 5 |
| `checkDiscriminatingTestReachability` | `agent5-run.ts` (local) | Agent 5 |
| `checkSuspectElimination` | `agent5-run.ts` (local) | Agent 5 |
| `buildValidationFeedback` | `utils/validation-retry-wrapper.ts` | Agent 3b |
| `withValidationRetry` | same | Agent 3b |
| `buildEraConstraints` | `shared/constraints.ts` | Agent 1 |
| `buildLocationConstraints` | `shared/constraints.ts` | Agent 1 |

---

## Section 22 — Cross-Cutting Pattern Summary

### Pattern A: `executeAgentWithRetry` (scoring path)
Used by: Agents 1, 2, 2b, 2c, 2d, 2e, 3b, 65, 7.  
Works by scoring the LLM output and retrying with feedback if below threshold.  
Not used by: Agents 3, 4, 5, 6, 8 — these use explicit in-function retry loops.

### Pattern B: `validateArtifact` schema repair
Used by all agents except 6.5.  
Behaviour diverges: some agents throw on schema failure (1, 2e, 3b, 7), others warn-and-continue (2b, 2c, 2d).

### Pattern C: deterministic pre-processing before LLM call
- Agent 2: `generateCastNames` before `designCast`
- Agent 7: `applyDeterministicCluePreAssignment` after `formatNarrative`
- Agent 7: `applyWorldFirstSceneEnrichment` after `formatNarrative`
- Agent 3b: `mergeHardLogicDirectives` after `generateHardLogicDevices`

### Pattern D: cost accumulation across retries
Agents 5, 6, 7 all use `ctx.agentCosts[key] = (ctx.agentCosts[key] || 0) + newCost` to accumulate across multiple LLM calls for the same phase.

### Pattern E: progress reporting
Each agent calls `ctx.reportProgress(phaseKey, message, percent)` at start and end, with intermediate calls during retry loops.

### Pattern F: savePartialReport (best-effort)
Called after most significant scoring operations:
```typescript
try { await ctx.savePartialReport(); } catch { /* best-effort */ }
```
Ensures partially-completed runs are recoverable.
