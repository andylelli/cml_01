# Agent 6.5 - World Builder

## 1) Role in the Pipeline
Agent 6.5 synthesizes prior structured artifacts into a consolidated world document.

Worker runner:
- `apps/worker/src/jobs/agents/agent65-run.ts`

Prompt/generation implementation:
- `packages/prompts-llm/src/agent65-world-builder.ts`

## 2) Prompt Design
### 2.1 Prompt Inputs
- `caseData`
- `characterProfiles`
- `locationProfiles`
- `temporalContext`
- `backgroundContext`
- `hardLogicDevices`
- `clueDistribution`
- `runId`
- `projectId`

Prompt internals in `buildWorldBuilderUserMessage(...)`:
- consumes complete upstream artifacts and locked facts (`hardLogicDevices.lockedFacts` path-aware extraction)
- enforces strict minimum-content constraints in prompt (theme/arc/reveal implications length, humour map completeness)
- retry-mode adds explicit corrective checklist after failed attempts (missing fields, cast order, humour rationale, length gates)

### 2.2 Prompt Outputs
Primary return type:
- `WorldDocumentResult`

Core payload:
- `worldDocument`

## 3) Output Contract
Schema:
- `schema/world_document.schema.yaml`

Runtime contract in `generateWorldDocument(...)`:
- parses with `jsonrepair` before JSON parse
- validates schema via `validateArtifact("world_document", parsed)`
- enforces additional runtime gates beyond schema:
	- cast coverage counts + exact cast-order name matching
	- humour map completeness, uniqueness, and non-empty rationale for all required scene positions
	- all `validationConfirmations.*` must be `true`
	- minimum word-count and structure gates (`storyTheme`, `storyEmotionalArc.arcDescription`, `revealImplications`)

## 4) Scoring and Pass Criteria
Orchestrated via:
- `apps/worker/src/jobs/agents/shared.ts`

Scorer usage in runner:
- `Agent65WorldBuilderScorer` from `@cml/story-validation`

Runner behavior in `apps/worker/src/jobs/agents/agent65-run.ts`:
- when scoring is enabled, runs through `executeAgentWithRetry(...)` with scoring feedback append on retries
- persists phase score via shared retry/scoring orchestration
- writes `ctx.worldDocument`, `ctx.agentCosts["agent65_world_builder"]`, `ctx.agentDurations["agent65_world_builder"]`

## 5) Retry Behavior and Prompt Differences
- Uses validation retry wrapper for schema errors.
- Uses scoring retry loop through shared orchestrator.

Implemented retry layers:
- inner generation loop in `generateWorldDocument(...)`: up to 3 attempts with parse/schema/content-gate feedback
- outer orchestrator retry layer in `runAgent65(...)` via `executeAgentWithRetry(...)` (scoring-guided retries when enabled)
- retry guidance is injected as explicit user feedback with mandatory correction checklist

## 6) Downstream Consumers
- Agent 7: `apps/worker/src/jobs/agents/agent7-run.ts`
- Agent 9: `apps/worker/src/jobs/agents/agent9-run.ts`

## 7) Runtime Traceability
Best-prompt reference:
- `documentation/prompts/best/AGENT_65_WORLD_BUILDER_BEST_PROMPT.md`

## 8) Full Field Glossary (Returned Artifact)
Top-level returned fields (`WorldDocumentResult`):

| Field | Type | Required | Meaning |
|---|---|---|---|
| `status` | `"draft" \| "final"` | yes | Artifact lifecycle status. |
| `storyTheme` | `string` | yes | Governing thematic sentence for world/prose tone. |
| `historicalMoment` | `object` | yes | Date-anchored era context and constraints. |
| `characterPortraits` | `object[]` | yes | Per-cast historical/emotional portraits. |
| `characterVoiceSketches` | `object[]` | yes | Per-cast voice model with register fragments. |
| `locationRegisters` | `object[]` | yes | Emotional and camera-angle guidance per key location. |
| `storyEmotionalArc` | `object` | yes | Global emotional trajectory and turning-point map. |
| `humourPlacementMap` | `object[]` | yes | Scene-position humour permission matrix with rationale. |
| `breakMoment` | `object` | yes | Defined emotional-control break scene anchor. |
| `revealImplications` | `string` | yes | Retroactive recontextualization guidance for reveal impact. |
| `validationConfirmations` | `object` | yes | Self-declared invariant checks consumed by runtime gate. |
| `cost` | `number` | yes | Agent-attributed generation cost. |
| `durationMs` | `number` | yes | End-to-end generation duration in milliseconds. |

`historicalMoment` fields:

| Field | Type | Required | Meaning |
|---|---|---|---|
| `specificDate` | `string` | yes | Concrete date anchor (month/year). |
| `eraRegister` | `string` | yes | Lived-experience description of that exact moment. |
| `currentTensions` | `string[]` | yes | Active period pressures relevant to cast/story. |
| `physicalConstraints` | `string[]` | yes | Era-imposed movement/communication constraints. |
| `emotionalRegister` | `string` | yes | Dominant social emotional tone. |
| `wartimeServiceContext` | `object` | no | Optional wartime service/social texture details. |

`storyEmotionalArc` fields:

| Field | Type | Required | Meaning |
|---|---|---|---|
| `dominantRegister` | `string` | yes | Overall emotional character of story. |
| `arcDescription` | `string` | yes | Multi-paragraph emotional journey narrative across structure. |
| `turningPoints` | `object[]` | yes | Position-keyed emotional shift descriptors. |
| `endingNote` | `string` | yes | Emotional residue target for ending. |

`validationConfirmations` fields:

| Field | Type | Required | Meaning |
|---|---|---|---|
| `noNewCharacterFacts` | `boolean` | yes | Confirms no invented character facts beyond inputs. |
| `noNewPlotFacts` | `boolean` | yes | Confirms no invented plot facts beyond inputs. |
| `castComplete` | `boolean` | yes | Confirms all cast members are represented. |
| `eraSpecific` | `boolean` | yes | Confirms historical section is date-specific, not generic. |
| `lockedFactsPreserved` | `boolean` | yes | Confirms hard-logic locked facts are preserved. |
| `humourMapComplete` | `boolean` | yes | Confirms full humour map coverage across required positions. |

## 9) Produced Files and Prompt Artifacts
Related produced files:
- `WORLD_DOCUMENT` artifact (validated by `schema/world_document.schema.yaml`)
- Agent 6.5 prompt snapshots in `documentation/prompts/actual/<run-id>/` (when capture is enabled)
- Agent 6.5 response snapshots in `documentation/prompts/actual/<run-id>/` (when capture is enabled)
