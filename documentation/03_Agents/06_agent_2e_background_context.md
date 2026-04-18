# Agent 2e - Background Context

## 1) Role in the Pipeline
Agent 2e creates canonical backdrop context used to anchor CML ideation and downstream world/prose phases.

Worker runner:
- `apps/worker/src/jobs/agents/agent2e-run.ts`

Prompt/generation implementation:
- `packages/prompts-llm/src/agent2e-background-context.ts`

## 2) Prompt Design
### 2.1 Prompt Inputs
- `settingRefinement`
- `cast`
- `theme` (optional)
- `tone`
- `runId`
- `projectId`

### 2.2 Prompt Outputs
Primary payload:
- `backgroundContext`

## 3) Output Contract
Schema:
- `schema/background_context.schema.yaml`

Key sections:
- backdrop summary
- era and setting anchors
- cast anchors
- theme carry-through

## 4) Scoring and Pass Criteria
Orchestrated via:
- `apps/worker/src/jobs/agents/shared.ts`

Adapter:
- `apps/worker/src/jobs/scoring-adapters/agent2e-scoring-adapter.ts`

Scorer:
- `BackgroundContextScorer` from `@cml/story-validation`

## 5) Retry Behavior and Prompt Differences
- Validation retry wrapper is used for schema corrections.
- Scoring retry feedback is appended into retry context through tone/theme fields.

## 6) Downstream Consumers
- Agent 3: `apps/worker/src/jobs/agents/agent3-run.ts`
- Agent 3b: `apps/worker/src/jobs/agents/agent3b-run.ts`
- Agent 6.5: `apps/worker/src/jobs/agents/agent65-run.ts`

## 7) Runtime Traceability
Best-prompt reference:
- `documentation/prompts/best/AGENT_2E_BACKGROUND_CONTEXT_BEST_PROMPT.md`

## 8) Full Field Glossary (Returned Artifact)
This glossary describes the returned `BackgroundContextResult` payload from Agent 2e.

Top-level fields:

| Field | Type | Required | Meaning |
|---|---|---|---|
| `backgroundContext` | `BackgroundContextArtifact` | yes | Canonical backdrop artifact for downstream CML/world/prose grounding. |
| `cost` | `number` | yes | Agent-attributed generation cost. |
| `durationMs` | `number` | yes | End-to-end generation duration in milliseconds. |
| `attempt` | `number` | yes | Validation-retry attempt count used to produce final artifact. |

`backgroundContext` fields:

| Field | Type | Required | Meaning |
|---|---|---|---|
| `status` | `"ok"` | yes | Success marker expected by worker guards. |
| `backdropSummary` | `string` | yes | One-sentence social backdrop premise anchoring cast and setting. |
| `era` | `object` | yes | Era-level context for period and social structure. |
| `setting` | `object` | yes | Canonical location and institutional frame. |
| `castAnchors` | `string[]` | yes | Selected cast names used as narrative anchor references. |
| `theme` | `string` | no | Optional thematic phrase carried into downstream generation. |

`backgroundContext.era` fields:

| Field | Type | Required | Meaning |
|---|---|---|---|
| `decade` | `string` | yes | Era decade label, aligned with setting refinement. |
| `socialStructure` | `string` | no | Class/institution dynamics and social pressure summary. |

`backgroundContext.setting` fields:

| Field | Type | Required | Meaning |
|---|---|---|---|
| `location` | `string` | yes | Canonical location descriptor for backdrop continuity. |
| `institution` | `string` | yes | Institutional container (estate, school, club, etc.) for case arena. |
| `weather` | `string` | no | Optional weather anchor propagated from setting context. |

## 9) Produced Files and Prompt Artifacts
Related produced files:
- `BACKGROUND_CONTEXT` artifact (validated by `schema/background_context.schema.yaml`)
- Agent 2e prompt snapshots in `documentation/prompts/actual/<run-id>/` (when capture is enabled)
- Agent 2e response snapshots in `documentation/prompts/actual/<run-id>/` (when capture is enabled)
