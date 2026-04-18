# Agent 3b - Hard Logic Devices

## 1) Role in the Pipeline
Agent 3b generates hard-logic mechanism candidates that ground Agent 3's case design.

Worker runner:
- `apps/worker/src/jobs/agents/agent3b-run.ts`

Prompt/generation implementation:
- `packages/prompts-llm/src/agent3b-hard-logic-devices.ts`

## 2) Prompt Design
### 2.1 Prompt Inputs
- setting fields (`decade`, `location`, `institution`, `tone`)
- logic directives (`primaryAxis`, `mechanismFamilies`, `hardLogicModes`, `difficultyMode`)
- `theme`
- novelty constraints
- `runId`, `projectId`

### 2.2 Prompt Outputs
Primary return type:
- `HardLogicDeviceResult`

Core payload:
- `devices[]`

## 3) Output Contract
Schema:
- `schema/hard_logic_devices.schema.yaml`

## 4) Scoring and Pass Criteria
Orchestrated via:
- `apps/worker/src/jobs/agents/shared.ts`

Adapter:
- `apps/worker/src/jobs/scoring-adapters/agent3b-scoring-adapter.ts`

Scorer:
- `HardLogicScorer` from `@cml/story-validation`

## 5) Retry Behavior and Prompt Differences
- Validation retry wrapper handles schema and type normalization issues.
- Scoring retry can append retry feedback to tone/theme context.

## 6) Downstream Consumers
- Agent 3: `apps/worker/src/jobs/agents/agent3-run.ts`
- Agent 6.5: `apps/worker/src/jobs/agents/agent65-run.ts`
- Agent 9 (locked facts usage path): `apps/worker/src/jobs/agents/agent9-run.ts`

## 7) Runtime Traceability
Best-prompt reference:
- `documentation/prompts/best/AGENT_3B_HARD_LOGIC_DEVICES_BEST_PROMPT.md`

## 8) Full Field Glossary (Returned Artifact)
Top-level returned fields (`HardLogicDeviceResult`):

| Field | Type | Required | Meaning |
|---|---|---|---|
| `status` | `"ok"` | yes | Success marker for generation result. |
| `overview` | `string` | yes | High-level summary of generated hard-logic strategy. |
| `devices` | `HardLogicDeviceIdea[]` | yes | Generated mechanism candidates used to ground Agent 3 CML logic. |
| `rawResponse` | `string` | yes | Raw model JSON text captured for traceability/debugging. |
| `attempt` | `number` | yes | Attempt index for the final returned payload. |
| `latencyMs` | `number` | yes | Generation latency in milliseconds. |
| `cost` | `number` | yes | Agent-attributed generation cost. |

`devices[]` fields (`schema/hard_logic_devices.schema.yaml`):

| Field | Type | Required | Meaning |
|---|---|---|---|
| `title` | `string` | yes | Short device identifier/name. |
| `corePrinciple` | `string` | yes | Fundamental mechanism logic behind the device. |
| `principleType` | `"physical_law" \| "mathematical_principle" \| "cognitive_bias" \| "social_logic"` | yes | Canonical principle class used for validation and variation balance. |
| `surfaceIllusion` | `string` | yes | What appears impossible or misleading on the surface. |
| `underlyingReality` | `string` | yes | Hidden fair-play mechanism that resolves the illusion. |
| `fairPlayClues` | `string[]` | yes | Observable clues that make the mechanism deducible. |
| `whyNotTrope` | `string` | yes | Justification for novelty relative to stock mystery shortcuts. |
| `variationEscalation` | `string` | yes | Suggested complexity escalation while preserving solvability. |
| `mechanismFamilyHints` | `string[]` | yes | Mechanism family tags for downstream alignment. |
| `modeTags` | `string[]` | no | Optional mode metadata (difficulty/focus tags). |
| `moralAmbiguity` | `string` | no | One-sentence moral gray-area framing for emotional complexity. |
| `lockedFacts` | `object[]` | no | Optional ground-truth values that must remain consistent in prose. |

`devices[].lockedFacts[]` fields:

| Field | Type | Required | Meaning |
|---|---|---|---|
| `id` | `string` | yes | Stable identifier for the locked fact. |
| `value` | `string` | yes | Canonical value to preserve verbatim in prose continuity. |
| `description` | `string` | yes | Human-readable explanation of what the value encodes. |
| `appearsInChapters` | `string[]` | no | Optional chapter-reference hints for placement. |

## 9) Produced Files and Prompt Artifacts
Related produced files:
- `HARD_LOGIC_DEVICES` artifact (validated by `schema/hard_logic_devices.schema.yaml`)
- `documentation/prompts/actual/<run-id>/08_Agent3b-HardLogicDevices_request.md` (when capture is enabled)
- `documentation/prompts/actual/<run-id>/08_Agent3b-HardLogicDevices_response.md` (when capture is enabled)
