# Agent 8 - Novelty Auditor

## 1) Role in the Pipeline
Agent 8 evaluates similarity between generated CML and seed corpus to flag novelty risk and steer regeneration when patterns are too close.

Execution context:
- Embedded in `apps/worker/src/jobs/agents/agent3-run.ts`

Prompt/generation implementation:
- `packages/prompts-llm/src/agent8-novelty.ts`

## 2) Prompt Design
### 2.1 Prompt Inputs
- `generatedCML`
- `seedCMLs`
- `similarityThreshold`
- `runId`
- `projectId`

### 2.2 Prompt Outputs
Primary return type:
- `NoveltyAuditResult`

Core sections:
- `status`
- weighted similarity metrics by seed
- violations/warnings/recommendations
- novelty summary and scoring metadata

## 3) Output Contract
- Structured novelty audit consumed by Agent 3 orchestration.

Validation and normalization behavior:
- Model output JSON is parsed and required fields enforced (`status`, `similarityScores`, `summary`).
- Similarity dimensions are clamped to `[0,1]`, and `overallSimilarity` is recomputed deterministically from configured weights.
- Final `status` is recalculated from threshold logic (`pass`/`warning`/`fail`) using `similarityThreshold` and fail delta.

## 4) Scoring and Pass Criteria
- No standalone retry manager/scoring adapter for Agent 8 itself; scoring is assigned in Agent 3 phase accounting.
- Agent 3 derives novelty phase score from `ctx.noveltyAudit.status` and `highestSimilarity`.
- Pass/fail runtime behavior:
	- `pass`: proceeds.
	- `warning`: proceeds with warnings.
	- `fail`: either hard-fails (if `NOVELTY_HARD_FAIL=true`) or downgraded to warning and continues.

## 5) Retry Behavior and Prompt Differences
- Agent 3 runs novelty audit once on initial CML.
- On novelty `fail`, Agent 3 performs one CML regeneration with stronger divergence constraints, then reruns novelty audit.
- Strengthened constraints incorporate prior `violations`, `warnings`, `recommendations`, and most-similar-seed context.
- Novelty step is skipped entirely when `skipNoveltyCheck=true` or `similarityThreshold >= 1.0`.

## 6) Downstream Consumers
- Agent 3 orchestration state and reporting (`apps/worker/src/jobs/agents/agent3-run.ts`)
- Downstream prose guardrails may include novelty warning/violation signals passed from context.

## 7) Runtime Traceability
Best-prompt reference:
- `documentation/prompts/best/AGENT_8_NOVELTY_BEST_PROMPT.md`

## 8) Full Field Glossary (Returned Artifact)
Top-level returned fields (`NoveltyAuditResult`):

| Field | Type | Required | Meaning |
|---|---|---|---|
| `status` | `"pass" \| "warning" \| "fail"` | yes | Novelty verdict used to continue, warn, or retry Agent 3 generation. |
| `overallNovelty` | `number` | yes | Novelty score (`1 - highestSimilarity`), clamped to `[0,1]`. |
| `highestSimilarity` | `number` | yes | Maximum similarity score against seed corpus. |
| `mostSimilarSeed` | `string` | yes | Identifier/name of the closest seed case. |
| `similarityScores` | `SimilarityScore[]` | yes | Per-seed weighted similarity breakdown used to compute top match. |
| `violations` | `string[]` | yes | Novelty failure reasons used for stronger retry constraints. |
| `warnings` | `string[]` | yes | Moderate-similarity issues that do not necessarily hard-fail run. |
| `recommendations` | `string[]` | yes | Concrete divergence guidance for regeneration. |
| `summary` | `string` | yes | Human-readable novelty decision summary. |
| `cost` | `number` | yes | Agent-attributed audit cost. |
| `durationMs` | `number` | yes | End-to-end novelty audit runtime. |

Nested fields (`SimilarityScore`):

| Field | Type | Required | Meaning |
|---|---|---|---|
| `seedTitle` | `string` | yes | Seed case identifier/title. |
| `overallSimilarity` | `number` | yes | Deterministic weighted similarity for this seed. |
| `plotSimilarity` | `number` | yes | Plot-level similarity subscore. |
| `characterSimilarity` | `number` | yes | Character-level similarity subscore. |
| `settingSimilarity` | `number` | yes | Setting-level similarity subscore. |
| `solutionSimilarity` | `number` | yes | Solution-pattern similarity subscore. |
| `structuralSimilarity` | `number` | yes | Structural similarity subscore. |
| `concerningMatches` | `string[]` | yes | Concrete matched elements driving risk. |

## 9) Produced Files and Prompt Artifacts
Related produced files:
- `NOVELTY_AUDIT` logical artifact in pipeline context
- Novelty math/progress diagnostics in run logs (`novelty_math`, status updates)
- Agent 8 prompt snapshots in `documentation/prompts/actual/<run-id>/` (when capture is enabled)
- Agent 8 response snapshots in `documentation/prompts/actual/<run-id>/` (when capture is enabled)
