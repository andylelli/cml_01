# Agent File Split Plan

**Date:** 2026-03-11  
**Goal:** Extract every file that currently contains code spanning multiple agents into one file per agent. Strict one-agent-per-file rule throughout the worker and prompts-llm surface. Each split is pure structural movement — zero logic changes.

---

## Scope

Two files contain mixed-agent code. `agent9-prose.ts` is deliberately out of scope (see decision note).

| File | Lines | Problem |
|---|---|---|
| `apps/worker/src/jobs/scoring-adapters.ts` | 1,128 | All 10 per-agent adapter functions in one file |
| `apps/worker/src/jobs/mystery-orchestrator.ts` | 5,687 | All 12 agent invocation blocks inside one `generateMystery()` function |
| `packages/prompts-llm/src/agent9-prose.ts` | 2,304 | One agent, 4 concerns — **out of scope** (see decision note below) |

---

## Decision: `agent9-prose.ts` — OUT OF SCOPE

This file owns exactly one agent. The proposed 4-way split into `types/`, `prompt-builder/`, `linter/`, `generator/` produces tightly coupled files with no reduction in conceptual complexity. All active outstanding bug fixes (P2-C, P2-D, B2, B4) concentrate in this file — splitting first increases change surface for no functional gain. Defer until post-bug-fix stabilisation.

---

## AS-IS directory/file structure

```
apps/
  worker/
    src/
      jobs/
        index.ts
        mystery-orchestrator.ts      ← 5,687 lines; all agents in one function
        runtime-paths.ts
        scoring-adapters.ts          ← 1,128 lines; 10 per-agent adapters mixed
        scoring-logger.ts

packages/
  prompts-llm/
    src/
      agent1-setting.ts              (350 lines — OK)
      agent2-cast.ts                 (653 lines — OK)
      agent2b-character-profiles.ts  (190 lines — OK)
      agent2c-location-profiles.ts   (362 lines — OK)
      agent2d-temporal-context.ts    (397 lines — OK)
      agent2e-background-context.ts  (192 lines — OK)
      agent3-cml.ts                  (960 lines — OK)
      agent3b-hard-logic-devices.ts  (306 lines — OK)
      agent4-revision.ts             (748 lines — OK)
      agent5-clues.ts                (549 lines — OK)
      agent6-fairplay.ts             (503 lines — OK)
      agent7-narrative.ts            (661 lines — OK)
      agent8-novelty.ts              (441 lines — OK)
      agent9-prose.ts                ← 2,304 lines; types + prompt + linter + loop mixed
      index.ts
      shared/
        constraints.ts
        schemas.ts
        system.ts
      types/
        narrative-state.ts
      utils/
        name-generator.ts
        seed-loader.ts
        validation-retry-wrapper.ts

  story-validation/
    src/
      scoring/
        phase-scorers/
          agent1-setting-refinement-scorer.ts   (OK — already per-agent)
          agent2-cast-scorer.ts
          agent2b-character-profiles-scorer.ts
          agent2c-location-profiles-scorer.ts
          agent2d-temporal-context-scorer.ts
          agent2e-background-scorer.ts
          agent4-hard-logic-scorer.ts
          agent7-narrative-scorer.ts
          agent9-prose-scorer.ts
        aggregator.ts
        index.ts
        report-invariants.ts
        retry-feedback.ts
        retry-manager.ts
        scorer-utils.ts
        thresholds.ts
        types.ts
```

---

## TO-BE directory/file structure

```
apps/
  worker/
    src/
      jobs/
        index.ts                         (unchanged)
        mystery-orchestrator.ts          ← Reduced to ≤500 lines: public types,
        │                                   generateMystery() coordinator shell,
        │                                   generateMysterySimple(), __testables.
        │                                   No agent-specific logic remains.
        runtime-paths.ts                 (unchanged)
        scoring-logger.ts                (unchanged)
        │
        agents/                          ← NEW DIRECTORY
        │  shared.ts                     ← OrchestratorContext, AgentRunResult,
        │  │                                executeAgentWithRetry<T>(), delay(),
        │  │                                appendRetryFeedback(), describeError(),
        │  │                                applyAbortedRunMetadata() — used by ≥2 run files
        │  agent1-run.ts                 ← Agent 1: setting refiner block (L2193–2291)
        │  agent2-run.ts                 ← Agent 2: cast designer block (L2292–2488)
        │  agent2b-run.ts                ← Agent 2b: character profiles block (L3771–3840)
        │  agent2c-run.ts                ← Agent 2c: location profiles block (L3840–3914)
        │  agent2d-run.ts                ← Agent 2d: temporal context block (L3914–3988)
        │  agent2e-run.ts                ← Agent 2e: background context block (within L2426–2490)
        │  agent3-run.ts                 ← Agent 3: CML generator + Agent 4 revision (L2576–2878)
        │  agent3b-run.ts                ← Agent 3b: hard logic devices (L2489–2575)
        │  agent5-run.ts                 ← Agent 5: clue distribution (L2879–3074)
        │  agent6-run.ts                 ← Agent 6: fair play auditor (L3075–3453)
        │  agent7-run.ts                 ← Agent 7: narrative outline (L3454–3770)
        │  agent8-run.ts                 ← Agent 8: novelty auditor (L2674–2784, called within agent3)
        │  agent9-run.ts                 ← Agent 9: prose + identity repair + repair retry (L4073–4900)
        │  index.ts                      ← Re-exports all runAgentN() functions
        │
        scoring-adapters/                ← NEW DIRECTORY (replaces scoring-adapters.ts)
           shared.ts                     ← ClueRef, ClueEvidenceAnchor,
           │                                ClueEvidenceState, ClueEvidenceExtractionResult
           │                                (used by agent7 and agent9 adapters)
           agent1-scoring-adapter.ts     ← SettingRefinementOutput, buildSpatialLayout(),
           │                                buildKeyFeatures(), adaptSettingForScoring()
           agent2-scoring-adapter.ts     ← CastMember, CastDesignOutput, adaptCastForScoring()
           agent2b-scoring-adapter.ts    ← HUMOUR_DESCRIPTIONS, CharacterProfile,
           │                                CharacterProfilesOutput, adaptCharacterProfilesForScoring()
           agent2c-scoring-adapter.ts    ← LocationProfile, LocationProfilesOutput,
           │                                adaptLocationsForScoring()
           agent2d-scoring-adapter.ts    ← ScorerTemporalContextOutput,
           │                                adaptTemporalContextForScoring()
           agent2e-scoring-adapter.ts    ← BackgroundContextOutput, adaptBackgroundContextForScoring()
           agent3b-scoring-adapter.ts    ← HardLogicDevice, HardLogicOutput, adaptHardLogicForScoring()
           agent7-scoring-adapter.ts     ← ScorerChapter, ScorerNarrativeOutlineOutput,
           │                                buildCastNameMap(), resolveCharacterName(),
           │                                adaptNarrativeForScoring()
           │                                (imports ClueRef from ./shared.js)
           agent9-scoring-adapter.ts     ← ChapterProse, ProseOutput,
           │                                DISCRIMINATING_PROSE_RE, SPOILER_PROSE_RE,
           │                                all token/semantic helpers,
           │                                collectClueEvidenceFromProse(),
           │                                adaptProseForScoring()
           │                                (imports ClueEvidenceAnchor/State/Result from ./shared.js)
           index.ts                      ← Re-exports everything; identical public API
                                            to the original scoring-adapters.ts
```

---

## Phase A — `scoring-adapters.ts` split (lowest risk)

**Principle:** Pure file movement. No logic changes. The barrel `index.ts` preserves the identical public API so every current consumer (`mystery-orchestrator.ts`, any future test) requires only one import path change.

**Call site to update:** `apps/worker/src/jobs/mystery-orchestrator.ts` line 74:
```
} from "./scoring-adapters.js";
→
} from "./scoring-adapters/index.js";
```

### A0 — Create directory and shared.ts

Create `apps/worker/src/jobs/scoring-adapters/shared.ts`.

Contents — types used by ≥2 adapter files:
```typescript
export type ClueEvidenceState = "introduced" | "hinted" | "explicit" | "confirmed";

export interface ClueEvidenceAnchor {
  clue_id: string;
  chapter_number: number;
  evidence_quote: string;
  evidence_offset: { chapter: number; paragraph: number; sentence: number };
  confidence: number;
  state: ClueEvidenceState;
}

export interface ClueEvidenceExtractionResult {
  visibleClueIds: string[];
  evidenceByClue: Record<string, ClueEvidenceAnchor[]>;
  evidenceByChapter: Record<number, string[]>;
  clueStateById: Record<string, ClueEvidenceState>;
}

// Used as a parameter type in adaptNarrativeForScoring (agent7) and
// as data fed to agent9 adapter at the orchestrator call site.
export interface ClueRef {
  id: string;
  placement?: 'early' | 'mid' | 'late';
}
```

**Compile checkpoint:** none yet (file not imported anywhere).

---

### A1 — agent1-scoring-adapter.ts

**Move from** `scoring-adapters.ts` lines 23–195.  
**Contents:**
- Interface `SettingRefinementOutput`
- Private helpers: `buildSpatialLayout()`, `buildKeyFeatures()`
- Export: `adaptSettingForScoring(setting: SettingRefinement): SettingRefinementOutput`

**Imports needed:**
```typescript
import type { SettingRefinement } from "@cml/prompts-llm";
```

---

### A2 — agent2-scoring-adapter.ts

**Move from** `scoring-adapters.ts` lines 196–262.  
**Contents:**
- Interfaces `CastMember`, `CastDesignOutput`
- Export: `adaptCastForScoring(castDesign: CastDesign): CastDesignOutput`

**Imports needed:**
```typescript
import type { CastDesign } from "@cml/prompts-llm";
```

---

### A3 — agent2b-scoring-adapter.ts

**Move from** `scoring-adapters.ts` lines 263–330.  
**Contents:**
- `const HUMOUR_DESCRIPTIONS` (private map)
- Interfaces `CharacterProfile`, `CharacterProfilesOutput`
- Export: `adaptCharacterProfilesForScoring(profiles: CharacterProfileOutput[]): CharacterProfilesOutput`

**Imports needed:**
```typescript
import type { CharacterProfileOutput } from "@cml/prompts-llm";
```

---

### A4 — agent2c-scoring-adapter.ts

**Move from** `scoring-adapters.ts` lines 331–398.  
**Contents:**
- Interfaces `LocationProfile`, `LocationProfilesOutput`
- Export: `adaptLocationsForScoring(locResult: LocationProfilesResult): LocationProfilesOutput`

**Imports needed:**
```typescript
import type { KeyLocation, LocationProfilesResult } from "@cml/prompts-llm";
```

---

### A5 — agent2d-scoring-adapter.ts

**Move from** `scoring-adapters.ts` lines 399–513.  
**Contents:**
- Interface `ScorerTemporalContextOutput`
- Export: `adaptTemporalContextForScoring(temporal: TemporalContextResult, setting?: SettingRefinement): ScorerTemporalContextOutput`

**Imports needed:**
```typescript
import type { TemporalContextResult, SettingRefinement } from "@cml/prompts-llm";
```

---

### A6 — agent2e-scoring-adapter.ts

**Move from** `scoring-adapters.ts` lines 514–571.  
**Contents:**
- Interface `BackgroundContextOutput`
- Export: `adaptBackgroundContextForScoring(bg: BackgroundContextArtifact, setting: SettingRefinement): BackgroundContextOutput`

**Imports needed:**
```typescript
import type { BackgroundContextArtifact, SettingRefinement } from "@cml/prompts-llm";
```

---

### A7 — agent3b-scoring-adapter.ts

**Move from** `scoring-adapters.ts` lines 572–654.  
**Contents:**
- Interfaces `HardLogicDevice`, `HardLogicOutput`
- Export: `adaptHardLogicForScoring(devices: HardLogicDeviceIdea[]): HardLogicOutput`

**Imports needed:**
```typescript
import type { HardLogicDeviceIdea } from "@cml/prompts-llm";
```

---

### A8 — agent7-scoring-adapter.ts

**Move from** `scoring-adapters.ts` lines 655–949.  
**Contents:**
- Interfaces `ScorerChapter`, `ScorerNarrativeOutlineOutput`
- Private helpers: `buildCastNameMap()`, `resolveCharacterName()`
- `const DISCRIMINATING_KEYWORDS` regex
- Export: `adaptNarrativeForScoring(narrative, castMembers?, clueList?): ScorerNarrativeOutlineOutput`

**Imports needed:**
```typescript
import type { NarrativeOutline, Scene } from "@cml/prompts-llm";
import type { ClueRef } from "./shared.js";
```

Note: `ClueRef` moves from this file's current inline declaration to `shared.ts`. Remove it from here.

---

### A9 — agent9-scoring-adapter.ts

**Move from** `scoring-adapters.ts` lines 950–1128.  
**Contents:**
- Interfaces `ChapterProse`, `ProseOutput`
- Regex constants: `DISCRIMINATING_REASONING_RE`, `DISCRIMINATING_PROSE_RE`, `SPOILER_PROSE_RE`
- Rank/merge helpers: `clueStateRank`, `mergeClueState()`
- Token helpers: `CLUE_TOKEN_STOPWORDS`, `tokenizeForClueSignature()`, `tokenizeSemanticTerms()`, `hasSemanticCoverage()`
- Private builders: `getKnownClueIds()`, `getDiscriminatingEvidenceClueIds()`, `buildDiscriminatingSemanticTokens()`, `buildClueSignatures()`, `sentenceIndexForParagraph()`, `evidenceQuoteFromParagraph()`
- Detection: `isDiscriminatingTestChapter()`
- Exports: `collectClueEvidenceFromProse()`, `adaptProseForScoring()`

**Imports needed:**
```typescript
import type { ClueDistributionResult } from "@cml/prompts-llm";
import type { ClueEvidenceAnchor, ClueEvidenceState, ClueEvidenceExtractionResult } from "./shared.js";
```

Note: `ClueEvidenceAnchor`, `ClueEvidenceState`, `ClueEvidenceExtractionResult` move from this file's current inline declarations to `shared.ts`. Remove them from here; import instead.

---

### A10 — scoring-adapters/index.ts (barrel)

```typescript
// shared types
export type { ClueRef, ClueEvidenceState, ClueEvidenceAnchor, ClueEvidenceExtractionResult } from "./shared.js";
// per-agent adapters + their output types
export * from "./agent1-scoring-adapter.js";
export * from "./agent2-scoring-adapter.js";
export * from "./agent2b-scoring-adapter.js";
export * from "./agent2c-scoring-adapter.js";
export * from "./agent2d-scoring-adapter.js";
export * from "./agent2e-scoring-adapter.js";
export * from "./agent3b-scoring-adapter.js";
export * from "./agent7-scoring-adapter.js";
export * from "./agent9-scoring-adapter.js";
```

**This index must export every symbol that `scoring-adapters.ts` currently exports.** Verify with:
```powershell
Select-String -Path "apps/worker/src/jobs/scoring-adapters.ts" -Pattern "^export" | Select-Object Line
```

---

### A11 — Update orchestrator import

In `apps/worker/src/jobs/mystery-orchestrator.ts`, line 74, change:
```typescript
} from "./scoring-adapters.js";
```
to:
```typescript
} from "./scoring-adapters/index.js";
```

---

### A12 — Delete original file and compile

```powershell
Remove-Item apps/worker/src/jobs/scoring-adapters.ts
cd apps/worker ; npx tsc --noEmit
cd ../..
cd packages/story-validation ; npx tsc --noEmit
```

**Expected:** zero errors. Any error at this step indicates a missing re-export in `index.ts` or a missed type declaration — fix before proceeding to Phase B.

---

## Phase B — `mystery-orchestrator.ts` agent block extraction (highest risk)

**Principle:** Each agent's invocation block, plus any constants/helpers used exclusively by that agent, move into a dedicated `agentN-run.ts` file. The block is converted into an exported `runAgentN(ctx: OrchestratorContext): Promise<AgentNRunResult>` function. `generateMystery()` becomes a thin sequential coordinator.

**Risk:** This is a 5,687-line file with inter-agent data flow (results from one agent feed into the next). The `OrchestratorContext` type must carry all shared state correctly, or TypeScript will catch it.

**Rollback plan:** `git checkout apps/worker/src/jobs/mystery-orchestrator.ts` restores the original at any point. Phase B steps are individually revertible because each step is a single file addition + one function removal from the orchestrator.

---

### B0 — Define OrchestratorContext and shared utilities

Create `apps/worker/src/jobs/agents/shared.ts`.

**Contents:**

```typescript
// ── Shared parameter bag ────────────────────────────────────────────────────
// Every runAgentN() function receives this. Add fields as agents are extracted.
export interface OrchestratorContext {
  inputs: MysteryGenerationInputs;
  llm: AzureOpenAIClient;
  reportProgress: ProgressCallback;
  runId: string;
  // Accumulated results — populated progressively as agents complete
  settingResult?: SettingRefinementResult;
  castResult?: CastDesignResult;
  backgroundResult?: BackgroundContextResult;
  hardLogicResult?: HardLogicDeviceResult;
  cmlResult?: CMLGenerationResult;
  noveltyResult?: NoveltyAuditResult;
  clueResult?: ClueDistributionResult;
  fairPlayResult?: FairPlayResult;
  narrativeResult?: NarrativeOutline;
  characterProfilesResult?: CharacterProfilesResult;
  locationProfilesResult?: LocationProfilesResult;
  temporalContextResult?: TemporalContextResult;
  proseResult?: ProseGenerationResult;
  // Mutable state accumulated across agent blocks
  errors: string[];
  warnings: string[];
  report: GenerationReport;
}

// ── Base result type ─────────────────────────────────────────────────────────
export interface AgentRunResult {
  warnings: string[];
  errors: string[];
}

// ── Shared low-level utilities (moved verbatim from mystery-orchestrator.ts) ─
export async function delay(ms: number): Promise<void> { ... }
export function appendRetryFeedback(...) { ... }
export function appendRetryFeedbackOptional(...) { ... }
export function describeError(error: unknown): string { ... }
export function applyAbortedRunMetadata(...) { ... }
export async function executeAgentWithRetry<T>(...): Promise<...> { ... }
```

The type imports at the top of `shared.ts` pull from `@cml/prompts-llm`, `@cml/llm-client`, and the local orchestrator types (some of which stay in `mystery-orchestrator.ts` as public exports).

**Compile checkpoint:** `cd apps/worker ; npx tsc --noEmit` — shared.ts must compile cleanly before any run file is created.

---

### B1 — Extract Agent 1 (setting refiner)

**Source:** `mystery-orchestrator.ts` lines 2193–2291  
**Destination:** `agents/agent1-run.ts`

```typescript
import { OrchestratorContext, AgentRunResult, executeAgentWithRetry } from "./shared.js";
import { refineSetting } from "@cml/prompts-llm";

export interface Agent1RunResult extends AgentRunResult {
  setting: SettingRefinementResult;
  durationMs: number;
  cost: number;
}

export async function runAgent1(ctx: OrchestratorContext): Promise<Agent1RunResult> { ... }
```

Remove the extracted block from `generateMystery()`. Replace with `const a1 = await runAgent1(ctx)`.  
**Compile checkpoint:** `cd apps/worker ; npx tsc --noEmit`

---

### B2 — Extract Agent 2e (background context)

**Source:** Within the cast block, lines ~2426–2490  
**Note:** Agent 2e is called inside the Agent 2 section. Extract it first so Agent 2's block can be cleanly defined.  
**Destination:** `agents/agent2e-run.ts`

```typescript
export async function runAgent2e(ctx: OrchestratorContext): Promise<Agent2eRunResult> { ... }
```

**Compile checkpoint:** `npx tsc --noEmit`

---

### B3 — Extract Agent 2 (cast designer)

**Source:** Lines 2292–2488 (minus the Agent 2e sub-block just extracted)  
**Destination:** `agents/agent2-run.ts`  
**Compile checkpoint:** `npx tsc --noEmit`

---

### B4 — Extract Agent 3b (hard logic devices)

**Source:** Lines 2489–2575  
**Destination:** `agents/agent3b-run.ts`  
**Compile checkpoint:** `npx tsc --noEmit`

---

### B5 — Extract Agent 8 (novelty auditor)

**Note:** Agent 8 is called inside the Agent 3 block. Extract it first.  
**Source:** Lines 2674–2784  
**Destination:** `agents/agent8-run.ts`  
**Compile checkpoint:** `npx tsc --noEmit`

---

### B6 — Extract Agent 3 + Agent 4 (CML generator + auto-revision)

**Source:** Lines 2576–2878 (minus Agent 8 sub-block extracted in B5)  
**Note:** Agent 4 revision is inline within Agent 3's retry loop and stays in `agent3-run.ts` — they are structurally inseparable at the invocation level.  
**Destination:** `agents/agent3-run.ts`  
**Compile checkpoint:** `npx tsc --noEmit`

---

### B7 — Extract Agent 5 (clue distribution)

**Source:** Lines 2879–3074  
**Destination:** `agents/agent5-run.ts`  
**Compile checkpoint:** `npx tsc --noEmit`

---

### B8 — Extract Agent 6 (fair play auditor)

**Source:** Lines 3075–3453  
**Destination:** `agents/agent6-run.ts`  
**Note:** This block contains private helpers (`classifyFairPlayFailure`, `checkInferencePathCoverage`, `checkContradictionPairs`, `checkFalseAssumptionContradiction`, `checkDiscriminatingTestReachability`, `checkSuspectElimination`) defined at the top of `mystery-orchestrator.ts` lines ~430–737. Move all of those private helpers into `agent6-run.ts` if they are used only by this block. If any are shared, they move to `agents/shared.ts`.  
**Compile checkpoint:** `npx tsc --noEmit`

---

### B9 — Extract Agent 7 (narrative outline)

**Source:** Lines 3454–3770  
**Note:** This block contains multiple private helper functions defined at the top of `mystery-orchestrator.ts` (lines ~738–1420): `SceneRef`, `DeterministicClueAssignmentStats`, `NarrativeSceneCountSnapshot`, `getPlacementForAct`, `flattenNarrativeScenes`, `captureNarrativeSceneCountSnapshot`, `buildNarrativeSceneCountGuardrails`, `checkNarrativeSceneCountFloor`, `applyDeterministicCluePreAssignment`, `evaluateOutlineCoverage`, `buildOutlineRepairGuardrails`, `buildNoveltyConstraints`, and the `OUTLINE_ELIMINATION_TERMS_RE` regex. Move all into `agent7-run.ts`.  
**Destination:** `agents/agent7-run.ts`  
**Compile checkpoint:** `npx tsc --noEmit`

---

### B10 — Extract Agents 2b, 2c, 2d (profiles phase)

These three sequential profile agents share the same pattern and can be extracted together in one step.

| Agent | Source lines | Destination |
|---|---|---|
| 2b character profiles | 3771–3840 | `agents/agent2b-run.ts` |
| 2c location profiles | 3840–3914 | `agents/agent2c-run.ts` |
| 2d temporal context | 3914–3988 | `agents/agent2d-run.ts` |

**Compile checkpoint:** `npx tsc --noEmit`

---

### B11 — Extract Agent 9 (prose generator)

**Source:** Lines 4073–4900 (the prose generation block including identity drift detection, targeted repair, and full repair retry)  
**Destination:** `agents/agent9-run.ts`  
**Note:** Move prose-evaluation helpers (`evaluateProseReadability`, `evaluateSceneGroundingCoverage`, `evaluateTemplateLeakage`, `evaluateSensoryVariety`, `evaluateTemporalConsistency`, `evaluatePlaceholderLeakage`, `evaluateChapterHeadingArtifacts`) from the orchestrator's top-level declarations (lines ~1626–1850) into `agent9-run.ts`.  
**Compile checkpoint:** `npx tsc --noEmit`

---

### B12 — Create agents/index.ts barrel

```typescript
export { runAgent1 } from "./agent1-run.js";
export { runAgent2 } from "./agent2-run.js";
export { runAgent2b } from "./agent2b-run.js";
export { runAgent2c } from "./agent2c-run.js";
export { runAgent2d } from "./agent2d-run.js";
export { runAgent2e } from "./agent2e-run.js";
export { runAgent3 } from "./agent3-run.js";
export { runAgent3b } from "./agent3b-run.js";
export { runAgent5 } from "./agent5-run.js";
export { runAgent6 } from "./agent6-run.js";
export { runAgent7 } from "./agent7-run.js";
export { runAgent8 } from "./agent8-run.js";
export { runAgent9 } from "./agent9-run.js";
```

---

### B13 — Strip generateMystery() to thin coordinator

After all agent blocks are extracted, `generateMystery()` becomes:
```typescript
const a1  = await runAgent1(ctx);   ctx.settingResult = a1.setting;
const a2e = await runAgent2e(ctx);  ctx.backgroundResult = a2e.background;
const a2  = await runAgent2(ctx);   ctx.castResult = a2.cast;
const a3b = await runAgent3b(ctx);  ctx.hardLogicResult = a3b.hardLogic;
const a3  = await runAgent3(ctx);   ctx.cmlResult = a3.cml;
const a5  = await runAgent5(ctx);   ctx.clueResult = a5.clues;
const a6  = await runAgent6(ctx);   ctx.fairPlayResult = a6.fairPlay;
const a7  = await runAgent7(ctx);   ctx.narrativeResult = a7.narrative;
const a2b = await runAgent2b(ctx);  ctx.characterProfilesResult = a2b.profiles;
const a2c = await runAgent2c(ctx);  ctx.locationProfilesResult = a2c.locations;
const a2d = await runAgent2d(ctx);  ctx.temporalContextResult = a2d.temporal;
const a9  = await runAgent9(ctx);   ctx.proseResult = a9.prose;
```

`mystery-orchestrator.ts` retains only:
- All `export interface` / `export type` public declarations
- The context builder (construct the initial `OrchestratorContext`)
- The `generateMystery()` coordinator above
- `generateMysterySimple()`
- `__testables`

**Target:** ≤500 lines.  
**Compile checkpoint:** `npx tsc --noEmit`

---

### B14 — Final validation

```powershell
# TypeScript across all packages
cd packages/cml          ; npx tsc --noEmit ; cd ../..
cd packages/prompts-llm  ; npx tsc --noEmit ; cd ../..
cd packages/story-validation ; npx tsc --noEmit ; cd ../..
cd apps/worker           ; npx tsc --noEmit ; cd ../..
cd apps/api              ; npx tsc --noEmit ; cd ../..
cd apps/web              ; npx tsc --noEmit ; cd ../..

# Existing test suite
cd packages/story-validation ; npx jest ; cd ../..
```

Then: full generation run. Confirm quality report structure is identical to a pre-split baseline.

---

## Risk register

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| `OrchestratorContext` missing a field needed by an agent run file | High | Compile error (caught immediately) | TypeScript will catch at each checkpoint — fix before moving to next agent |
| Helper function used by 2 agents — moved into one agent's file | Medium | Compile error in the other agent's file | Audit usages with `Select-String` before moving each helper |
| Circular import between `agents/shared.ts` and a run file | Low | Compile error | Keep `shared.ts` free of imports from agent run files |
| Import path `.js` vs `.ts` extension mismatch (ESM project) | Medium | Runtime module-not-found | Always use `.js` in import paths for ESM TypeScript projects |
| `generateMystery()` coordinator has an inter-agent dependency not visible in the block boundaries | Medium | Logic regression | Run a full generation test after B13; compare with pre-split quality report |

---

## Acceptance criteria

- [ ] `scoring-adapters.ts` (root) deleted; all adapter functions + cross-adapter types reachable via `scoring-adapters/index.ts` with identical signatures.
- [ ] `scoring-adapters/shared.ts` holds `ClueRef`, `ClueEvidenceAnchor`, `ClueEvidenceState`, `ClueEvidenceExtractionResult` — the four types used by ≥2 adapter files.
- [ ] `agents/shared.ts` holds `OrchestratorContext`, `AgentRunResult`, `executeAgentWithRetry`, `delay`, `appendRetryFeedback`, `appendRetryFeedbackOptional`, `describeError`, `applyAbortedRunMetadata`.
- [ ] Each file under `agents/` contains code for exactly one agent (agent3-run.ts may include the inline Agent 4 revision as an exception).
- [ ] `mystery-orchestrator.ts` is ≤500 lines.
- [ ] `tsc --noEmit` passes with zero errors across all 7 packages/apps.
- [ ] Existing test suite passes with no changes to test files.
- [ ] A full generation run produces the same quality report structure as before the split (no behavioral change).
- [ ] `agent9-prose.ts` untouched.

---

## Rollback strategy

- **Phase A rollback:** `git checkout apps/worker/src/jobs/scoring-adapters.ts` + revert the import change in `mystery-orchestrator.ts` + `Remove-Item apps/worker/src/jobs/scoring-adapters/ -Recurse`
- **Phase B rollback (per-step):** `git checkout apps/worker/src/jobs/mystery-orchestrator.ts` restores the full original. Delete `apps/worker/src/jobs/agents/` directory. No other files are affected.

---

## Files NOT touched

- `packages/prompts-llm/src/agent1-setting.ts` through `agent9-prose.ts` — all single-agent
- `packages/story-validation/src/scoring/phase-scorers/agent*.ts` — already per-agent
- `packages/story-validation/src/` validators — not agent invocation code
- `apps/api/src/server.ts` — imports from `mystery-orchestrator.ts` public interface only; that interface is unchanged
- `apps/worker/src/jobs/scoring-logger.ts` — cross-cutting telemetry, not an agent file
