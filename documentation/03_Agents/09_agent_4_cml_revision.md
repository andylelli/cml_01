# Agent 4 - CML Revision

## 1) Role in the Pipeline
Agent 4 is an embedded revision agent used by Agent 3 when generated CML fails validation.

Execution context:
- Embedded in `apps/worker/src/jobs/agents/agent3-run.ts`

Prompt/generation implementation:
- `packages/prompts-llm/src/agent4-revision.ts`

## 2) Prompt Design
### 2.1 Prompt Inputs
- `originalPrompt`
- `invalidCml`
- `validationErrors[]`
- `attempt`
- `runId`
- `projectId`

Prompt internals implemented in `buildRevisionPrompt(...)`:
- error categorization into `missingRequired`, `typeErrors`, `allowedValueErrors`
- error grouping by section path (for targeted fixes)
- revision strategy constraints: minimal/surgical edits, preserve narrative intent, enforce schema enums/types
- explicit output contract instruction: return complete corrected JSON document

### 2.2 Prompt Outputs
Primary return type:
- `RevisionResult`

Core payload:
- revised `cml`
- validation metadata
- `revisionsApplied[]` change log

## 3) Output Contract
- Revised CML is validated against `schema/cml_2_0.schema.yaml` by Agent 3 flow.

Runtime parse/normalization contract in `reviseCml(...)`:
- first parse path: JSON (`JSON.parse`) with `jsonrepair` fallback
- second parse path: sanitized YAML parse (`js-yaml`) if JSON parsing fails
- structural normalization step (`normalizeCml`) enforces required top-level and nested defaults before validation

## 4) Scoring and Pass Criteria
- No standalone scoring adapter.
- Outcome quality is folded into Agent 3 quality handling.
- If Agent 4 revision is required, Agent 3 quality score is penalized (`cmlQualityScore = 60` vs `100` when no revision is needed) in `apps/worker/src/jobs/agents/agent3-run.ts`.

## 5) Retry Behavior and Prompt Differences
- Revision attempts run inside Agent 3 loop (multiple attempts).
- Retry prompts include accumulated validation failures and targeted revision constraints.
- On each failed revision attempt, errors are updated to the latest validation set and passed back into the next prompt.
- If model output cannot be parsed, parse errors are injected into retry error context.
- Loop terminates on first valid CML or throws after configured max attempts.

## 6) Downstream Consumers
- Agent 3 only (`apps/worker/src/jobs/agents/agent3-run.ts`)

## 7) Runtime Traceability
Best-prompt reference:
- `documentation/prompts/best/AGENT_4_CML_VALIDATOR_BEST_PROMPT.md`

## 8) Full Field Glossary (Returned Artifact)
Top-level returned fields (`RevisionResult`):

| Field | Type | Required | Meaning |
|---|---|---|---|
| `cml` | `object` | yes | Revised CML candidate produced from invalid input plus validation feedback. |
| `validation` | `object` | yes | Post-revision validation status used by Agent 3 control flow. |
| `revisionsApplied` | `string[]` | yes | Attempt-by-attempt revision log (parse retries, error reductions, and final fix summary). |
| `attempt` | `number` | yes | Revision attempt index. |
| `latencyMs` | `number` | yes | Revision latency in milliseconds. |
| `cost` | `number` | yes | Agent-attributed revision cost. |

`validation` fields:

| Field | Type | Required | Meaning |
|---|---|---|---|
| `valid` | `boolean` | yes | Whether revised CML passed schema validation. |
| `errors` | `string[]` | yes | Remaining validation errors (empty on success path). |

## 9) Produced Files and Prompt Artifacts
Related produced files:
- No standalone persisted artifact; produces revised CML candidate consumed by Agent 3.
- Agent 4 prompt snapshots in `documentation/prompts/actual/<run-id>/` (when capture is enabled)
- Agent 4 response snapshots in `documentation/prompts/actual/<run-id>/` (when capture is enabled)
