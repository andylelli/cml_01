# Agent 5 - Clues and Red Herrings

## 1) Role in the Pipeline
Agent 5 derives clue distribution and red herrings from CML logic and supports fair-play closure.

Worker runner:
- `apps/worker/src/jobs/agents/agent5-run.ts`

Prompt/generation implementation:
- `packages/prompts-llm/src/agent5-clues.ts`

## 2) Prompt Design
### 2.1 Prompt Inputs
- `cml`
- `clueDensity`
- `redHerringBudget`
- `fairPlayFeedback` (optional)
- `runId`
- `projectId`
- `retryAttempt`

Prompt internals implemented in `buildCluePrompt(...)`:
- pre-analysis generates explicit mandatory clue requirements from `inference_path.steps`, `discriminating_test`, and suspect elimination needs
- deterministic bounds and legal source-path families are injected into prompt context
- retry-mode payload can include forbidden terms, preferred terms, required replacements, and red-herring IDs to rewrite
- hard contract requires status-based self-audit (`missingDiscriminatingEvidenceIds`, `weakEliminationSuspects`, `invalidSourcePaths`)

### 2.2 Prompt Outputs
Primary return type:
- `ClueDistributionResult`

## 3) Output Contract
- Integrated into CML and downstream checks.
- Uses clue/red-herring structures aligned with core CML schema usage.

Runtime contract (`extractClues(...)` + `runAgent5(...)`):
- model output is parsed as JSON with `jsonrepair` fallback
- output is normalized into:
	- `clues[]`
	- `redHerrings[]`
	- optional `status`
	- optional `audit`
	- computed `clueTimeline` (`early/mid/late` arrays of clue IDs)
	- computed `fairPlayChecks`
- no standalone schema file is used for this artifact; deterministic gates in `agent5-run.ts` are the primary acceptance contract

## 4) Scoring and Pass Criteria
- No dedicated scoring adapter in the scoring-adapters folder.
- Deterministic guardrails enforce structural coverage and fairness prerequisites.

Phase score behavior in `apps/worker/src/jobs/agents/agent5-run.ts`:
- computes weighted score from validation, quality, completeness, and consistency
- applies retry penalties for coverage, suspect-coverage, and red-herring overlap retries
- hard-gate failures record explicit failing phase score and abort (`failAgent5` path)

## 5) Retry Behavior and Prompt Differences
- Re-run can be triggered from fair-play failures (Agent 6 feedback).
- Retry prompt may include required clue phrases and violation-derived constraints.

Implemented retry/gate sequence in `runAgent5(...)`:
- initial extraction (with JSON-parse retry on syntax failure)
- deterministic guardrail retry when critical issues or source-path legality failures are detected
- inference-coverage retry when steps/contradictions/discriminating reachability are critically under-covered
- suspect-coverage retry for uncovered or weakly eliminated eligible non-culprit suspects
- red-herring overlap retry with lexical constraints; severe persistent overlap can hard-fail
- discriminating-test ID-contract retry when required evidence clue IDs are missing
- deterministic synthesis/backfill can create missing required evidence clues before final hard gate
- final hard gates fail on unresolved critical coverage, illegal paths, out-of-range step indices, cast-path inconsistencies, audit mismatch, era-time style violations, locked-fact time conflicts, or missing culprit-discriminating clues

## 6) Downstream Consumers
- Agent 6: `apps/worker/src/jobs/agents/agent6-run.ts`
- Agent 7: `apps/worker/src/jobs/agents/agent7-run.ts`
- Agent 6.5: `apps/worker/src/jobs/agents/agent65-run.ts`
- Agent 9: `apps/worker/src/jobs/agents/agent9-run.ts`

## 7) Runtime Traceability
Best-prompt reference:
- `documentation/prompts/best/AGENT_5_CLUES_BEST_PROMPT.md`

## 8) Full Field Glossary (Returned Artifact)
Top-level returned fields (`ClueDistributionResult`):

| Field | Type | Required | Meaning |
|---|---|---|---|
| `clues` | `Clue[]` | yes | Reader-visible clues mapped to inference steps and legal CML evidence paths. |
| `redHerrings` | `RedHerring[]` | yes | Plausible but misleading artifacts constrained not to reinforce true-solution correction logic. |
| `status` | `"pass" \| "fail"` | no | Model-declared audit status (worker still applies deterministic gates). |
| `audit` | `ClueExtractionAudit` | no | Model-reported unresolved issues used in retry and consistency checks. |
| `clueTimeline` | `object` | yes | Placement index of clue IDs by phase (`early/mid/late`). |
| `fairPlayChecks` | `object` | yes | Basic extraction-level fair-play checks (`allEssentialCluesPresent`, `noNewFactsIntroduced`, `redHerringsDontBreakLogic`). |
| `latencyMs` | `number` | yes | Generation latency in milliseconds. |
| `cost` | `number` | yes | Agent-attributed generation cost. |

`clues[]` fields (`Clue`):

| Field | Type | Required | Meaning |
|---|---|---|---|
| `id` | `string` | yes | Stable clue identifier used by downstream mapping and discriminating-test contracts. |
| `category` | `"temporal" \| "spatial" \| "physical" \| "behavioral" \| "testimonial"` | yes | Clue evidence category. |
| `description` | `string` | yes | Reader-visible clue content. |
| `sourceInCML` | `string` | yes | Legal CML path proving traceability and no-new-facts compliance. |
| `pointsTo` | `string` | yes | What the clue implies without direct reveal. |
| `placement` | `"early" \| "mid" \| "late"` | yes | Act-level placement intent. |
| `criticality` | `"essential" \| "supporting" \| "optional"` | yes | Solvability importance level. |
| `supportsInferenceStep` | `number` | no | 1-based inference-step mapping when clue supports a specific step. |
| `evidenceType` | `"observation" \| "contradiction" \| "elimination"` | no | Logical role of clue in inference chain. |

`redHerrings[]` fields (`RedHerring`):

| Field | Type | Required | Meaning |
|---|---|---|---|
| `id` | `string` | yes | Red-herring identifier. |
| `description` | `string` | yes | Reader-facing misleading surface evidence. |
| `supportsAssumption` | `string` | yes | False-assumption support statement. |
| `misdirection` | `string` | yes | How this herring diverts inference while preserving fair-play legality. |

`audit` fields (`ClueExtractionAudit`, when present):

| Field | Type | Required | Meaning |
|---|---|---|---|
| `missingDiscriminatingEvidenceIds` | `string[]` | no | Required discriminating-test clue IDs not present in `clues[].id`. |
| `weakEliminationSuspects` | `string[]` | no | Suspects lacking adequate elimination/alibi clue support. |
| `invalidSourcePaths` | `string[]` | no | `sourceInCML` values outside legal path contract. |

## 9) Produced Files and Prompt Artifacts
Related produced files:
- `CLUE_DISTRIBUTION` logical artifact in pipeline context
- `RED_HERRINGS` logical artifact in pipeline context
- Agent 5 prompt snapshots in `documentation/prompts/actual/<run-id>/` (when capture is enabled)
- Agent 5 response snapshots in `documentation/prompts/actual/<run-id>/` (when capture is enabled)
