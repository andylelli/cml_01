# Agent 6 - Fair Play Auditor

## 1) Role in the Pipeline
Agent 6 audits whether the case can be solved fairly from reader-visible evidence.

Worker runner:
- `apps/worker/src/jobs/agents/agent6-run.ts`

Prompt/generation implementation:
- `packages/prompts-llm/src/agent6-fairplay.ts`

## 2) Prompt Design
### 2.1 Prompt Inputs
- `caseData`
- `clues`
- `runId`
- `projectId`

Prompt internals in `buildFairPlayPrompt(...)`:
- developer context includes `surface_model`, `hidden_model`, `false_assumption`, full inference steps, discriminating test, clue timeline, constraint space, and quality-control targets
- audit request enforces concrete citations (clue IDs/CML locations) and structured severity
- separate blind-reader prompt is used by `blindReaderSimulation(...)` for post-audit solvability testing from clues alone

### 2.2 Prompt Outputs
Primary return type:
- `FairPlayAuditResult`

Core sections:
- `overallStatus`
- `checks[]`
- `violations[]`
- `recommendations[]`
- `warnings[]`
- `summary`

## 3) Output Contract
- Structured fair-play report consumed by orchestration control flow.

Runtime contract in `auditFairPlay(...)` + `runAgent6(...)`:
- `auditFairPlay(...)` requires parseable JSON with required fields `overallStatus`, `checks`, and `summary`
- result is augmented with runtime telemetry (`cost`, `durationMs`)
- worker stores `ctx.fairPlayAudit` and `ctx.hasCriticalFairPlayFailure` after retry/escalation logic

## 4) Scoring and Pass Criteria
- No standalone scoring adapter.
- Critical fair-play failures can trigger retries/escalation and may abort pipeline.

Phase scoring behavior in `apps/worker/src/jobs/agents/agent6-run.ts`:
- status-driven validation score: `pass=100`, `needs-revision=70`, `fail=45`
- violations are embedded as failing tests with severity-aware weights
- partial report save is attempted after each scoring update (including re-audits)

## 5) Retry Behavior and Prompt Differences
- Can trigger one clue-regeneration pass (Agent 5) with audit-derived feedback.
- For structural failures, can escalate to Agent 4 revision through Agent 3 path.
- Includes blind-reader simulation as additional feasibility signal in flow.

Implemented retry/escalation sequence in `runAgent6(...)`:
- bounded fair-play audit loop with clue regeneration feedback (`requiredCluePhrases`) between attempts
- blind-reader gate with confidence threshold; can run bounded remediation cycles with targeted clue feedback
- structural failure classification (`clue_coverage`, `inference_path_abstract`, `constraint_space_insufficient`, `clue_only`)
- if structural critical failure persists, can escalate to Agent 4 CML revision, then re-run clues + fair-play audit
- if classified `clue_only`, can run a targeted final clue regeneration attempt
- tracks retry spend against max configured retry cost

## 6) Downstream Consumers
- Agent 7 guidance path: `apps/worker/src/jobs/agents/agent7-run.ts`
- Agent 9 guardrail path: `apps/worker/src/jobs/agents/agent9-run.ts`

## 7) Runtime Traceability
Best-prompt reference:
- `documentation/prompts/best/AGENT_6_FAIRPLAY_BEST_PROMPT.md`

## 8) Full Field Glossary (Returned Artifact)
Top-level returned fields (`FairPlayAuditResult`):

| Field | Type | Required | Meaning |
|---|---|---|---|
| `overallStatus` | `"pass" \| "fail" \| "needs-revision"` | yes | Overall fair-play verdict used for orchestration decisions. |
| `checks` | `FairPlayCheck[]` | yes | Rule-by-rule audit outcomes. |
| `violations` | `FairPlayViolation[]` | yes | Structured violations with severity, location, and fix suggestion. |
| `warnings` | `string[]` | yes | Non-critical concerns or caveats. |
| `recommendations` | `string[]` | yes | Suggested remediation actions. |
| `summary` | `string` | yes | One-paragraph overall audit assessment. |
| `cost` | `number` | yes | Agent-attributed audit cost. |
| `durationMs` | `number` | yes | Audit duration in milliseconds. |

`checks[]` fields (`FairPlayCheck`):

| Field | Type | Required | Meaning |
|---|---|---|---|
| `rule` | `string` | yes | Audited fair-play rule label. |
| `status` | `"pass" \| "fail" \| "warning"` | yes | Rule result. |
| `details` | `string` | yes | Concrete reasoning for the result. |
| `recommendations` | `string[]` | no | Rule-specific fix suggestions. |

`violations[]` fields (`FairPlayViolation`):

| Field | Type | Required | Meaning |
|---|---|---|---|
| `severity` | `"critical" \| "moderate" \| "minor"` | yes | Violation severity used in orchestration and scoring. |
| `rule` | `string` | yes | Violated fair-play rule. |
| `description` | `string` | yes | What is wrong. |
| `location` | `string` | yes | Where issue appears (CML/clue location). |
| `suggestion` | `string` | yes | Concrete remediation guidance. |

## 9) Produced Files and Prompt Artifacts
Related produced files:
- `FAIR_PLAY_AUDIT` logical artifact in pipeline context
- Agent 6 prompt snapshots in `documentation/prompts/actual/<run-id>/` (when capture is enabled)
- Agent 6 response snapshots in `documentation/prompts/actual/<run-id>/` (when capture is enabled)
