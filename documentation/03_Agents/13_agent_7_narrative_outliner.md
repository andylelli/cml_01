# Agent 7 - Narrative Outliner

## 1) Role in the Pipeline
Agent 7 converts validated case logic and clue distribution into a scene-by-scene narrative outline used as the chapter plan for prose generation.

Worker runner:
- `apps/worker/src/jobs/agents/agent7-run.ts`

Prompt/generation implementation:
- `packages/prompts-llm/src/agent7-narrative.ts`

## 2) Prompt Design
### 2.1 Prompt Inputs
- `caseData`
- `clues`
- `targetLength`
- `narrativeStyle`
- `detectiveType`
- `qualityGuardrails` (optional)
- `runId`
- `projectId`

Prompt behavior details:
- Uses exact per-act scene counts derived from `targetLength` and generation params (not loose ranges).
- Injects fair-play sequencing rules (reveal first, use later), minimum clue-bearing scene ratio, and discriminating-test placement constraints.
- Enforces detective-entry logic by type (`police` vs `private` vs `amateur`) directly in prompt instructions.
- Incorporates CML prose requirements (`discriminating_test_scene`, suspect clearances, culprit reveal, identity rules, clue-to-scene mapping).

### 2.2 Prompt Outputs
Primary output type:
- `NarrativeOutline`

## 3) Output Contract
Schema:
- `schema/narrative_outline.schema.yaml`

Runtime validation path:
- `validateArtifact("narrative_outline", narrative)` in `apps/worker/src/jobs/agents/agent7-run.ts`.
- If schema fails on first pass, runner performs a schema-repair regeneration with explicit guardrails and re-validates.

## 4) Scoring and Pass Criteria
Orchestrated via:
- `apps/worker/src/jobs/agents/shared.ts`

Adapter:
- `apps/worker/src/jobs/scoring-adapters/agent7-scoring-adapter.ts`

Scorer:
- `NarrativeScorer` from `@cml/story-validation`

Key pass logic in runner:
- Scene-count gate is tolerance-based using `getSceneTarget()` and `getChapterTargetTolerance()`.
- Outlines outside tolerance are retried with exact Act I/II/III count constraints; persistent out-of-tolerance results abort the phase.
- Additional deterministic gates evaluate outline coverage and clue pacing before committing result to `ctx.narrative`.

## 5) Retry Behavior and Prompt Differences
- Primary scoring-aware retry uses `executeAgentWithRetry(...)` when scoring is enabled.
- Schema retry: if `narrative_outline` validation fails, regenerates with schema-error-derived guardrails.
- Scene-count final gate retry: if outside tolerance, regenerates once with strict exact-count instructions.
- Coverage retry: if pre-prose outline coverage issues exist, regenerates with targeted guardrails and scene-count lock; accepted only if issue count improves and scene count remains locked.
- Clue-pacing retry: if clue-bearing scenes are below threshold, attempts narrative regeneration; if still short and remaining gap is small enough, applies bounded deterministic clue anchoring (`applyDeterministicCluePreAssignment`) to recover coverage.
- World-first enrichment pass: if world document exists, deterministic enrichment fields are injected into scenes before handoff.

## 6) Downstream Consumers
- Agent 9: `apps/worker/src/jobs/agents/agent9-run.ts`

## 7) Runtime Traceability
Best-prompt reference:
- `documentation/prompts/best/AGENT_7_NARRATIVE_BEST_PROMPT.md`

## 8) Full Field Glossary (Returned Artifact)
Top-level returned fields (`NarrativeOutline` result payload):

| Field | Type | Required | Meaning |
|---|---|---|---|
| `acts` | `ActStructure[]` | yes | Three-act narrative blocks containing ordered scene definitions. |
| `totalScenes` | `number` | yes | Total scene count (runner recalculates from `acts[*].scenes`). |
| `estimatedTotalWords` | `number` | yes | Total estimated prose length across all scenes. |
| `pacingNotes` | `string[]` | yes | Narrative pacing notes generated with the outline. |
| `cost` | `number` | yes | Agent-attributed generation cost. |
| `durationMs` | `number` | yes | End-to-end generation latency for Agent 7 call. |

Nested fields (`ActStructure`):

| Field | Type | Required | Meaning |
|---|---|---|---|
| `actNumber` | `1 \| 2 \| 3` | yes | Act identifier. |
| `title` | `string` | yes | Act title. |
| `purpose` | `string` | yes | High-level act purpose in mystery progression. |
| `scenes` | `Scene[]` | yes | Ordered scenes in the act. |
| `estimatedWordCount` | `number` | yes | Estimated words for this act. |

Nested fields (`Scene`):

| Field | Type | Required | Meaning |
|---|---|---|---|
| `sceneNumber` | `number` | yes | Global scene index (maps to chapter index downstream). |
| `act` | `1 \| 2 \| 3` | yes | Scene's act number. |
| `title` | `string` | yes | Scene title. |
| `setting` | `{ location, timeOfDay, atmosphere }` | yes | Scene setting block. |
| `characters` | `string[]` | yes | Character names present in scene. |
| `purpose` | `string` | yes | Why the scene exists narratively. |
| `cluesRevealed` | `string[]` | yes | Clue IDs revealed in this scene. |
| `dramaticElements` | `object` | yes | Conflict/tension/revelation/misdirection/micro-moment beats. |
| `summary` | `string` | yes | 2-3 sentence scene summary. |
| `estimatedWordCount` | `number` | yes | Estimated prose words for scene. |
| `emotionalRegister` | `string` | no | World-first emotional arc guidance (if world doc applied). |
| `dominantCharacterNote` | `{ name, voiceRegister }` | no | World-first dominant POV/voice guidance. |
| `humourGuidance` | `{ permission, character?, form?, condition? }` | no | World-first humor permission constraints. |
| `eraTextureNote` | `string` | no | Era-specific texture cue from world document. |
| `locationRegisterNote` | `string` | no | Location emotional/tonal register cue. |
| `subtextNote` | `string` | no | Scene-level subtext intent (if provided by model). |

## 9) Produced Files and Prompt Artifacts
Related produced files:
- `NARRATIVE_OUTLINE` artifact (validated by `schema/narrative_outline.schema.yaml`)
- `ctx.outlineCoverageIssues` runtime coverage diagnostics (in-memory orchestration state)
- Agent 7 prompt snapshots in `documentation/prompts/actual/<run-id>/` (when capture is enabled)
- Agent 7 response snapshots in `documentation/prompts/actual/<run-id>/` (when capture is enabled)
