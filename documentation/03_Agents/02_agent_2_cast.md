# Agent 2 - Cast and Motive Designer

## 1) Role in the Pipeline
Agent 2 creates the cast-design artifact that seeds suspect logic, relationship topology, and detective/victim candidate selection for the rest of the pipeline.

Worker runner:
- `apps/worker/src/jobs/agents/agent2-run.ts`

Prompt/generation implementation:
- `packages/prompts-llm/src/agent2-cast.ts`

Scoring adapter:
- `apps/worker/src/jobs/scoring-adapters/agent2-scoring-adapter.ts`

Scorer implementation:
- `packages/story-validation/src/scoring/phase-scorers/agent2-cast-scorer.ts`

## 2) Prompt Design
### 2.1 Prompt Inputs
Worker passes these effective inputs to `designCast()`:
- `characterNames` (if provided) or generated names via `generateCastNames()`
- `castSize` (resolved to total cast size)
- `setting` (formatted string: `<decade> - <location description>`)
- `crimeType` (currently `Murder`)
- `tone` (base tone or retry-augmented tone)
- `socialContext` (joined social norms from Agent 1)
- `detectiveType`
- `runId`
- `projectId`

Optional schema-repair input:
- `qualityGuardrails` (in schema-repair retry path)

### 2.2 Prompt Structure
`buildCastPrompt()` produces:
- `system` block: role, objective, non-negotiable constraints
- `developer` block: schema details, process order, quality bar, output contract
- `user` block: run-specific variation directives, cast requirements, detective entry mandate, hard completeness rules

Runtime message shape:
- system message = `system + developer`
- user message = `user`

### 2.3 Prompt Semantics and Hard Requirements
The prompt enforces:
- exactly requested cast size
- exactly one detective role
- minimum culprit-candidate count
- role-archetype diversity floor
- enum-constrained fields (`motiveStrength`, `accessPlausibility`, `gender`)
- empty stereotype-check list in final output

It also injects deterministic variation by run hash:
- naming pool family
- first-name initial constraints
- relationship style emphasis
- motive distribution guidance
- social-dynamic guidance

## 3) Output Contract
Primary return type:
- `CastDesignResult`

Primary payload:
- `cast: CastDesign`
- plus metadata: `attempt`, `latencyMs`, `cost`

Schema:
- `schema/cast_design.schema.yaml`

Top-level required sections:
- `characters[]`
- `relationships.pairs[]`
- `diversity`
- `crimeDynamics`
- `cost`
- `latencyMs`

## 4) Scoring and Pass Criteria
Before schema validation, the worker normalizes common LLM shape drift in `normaliseCastOutput()`:
- snake_case to camelCase for `crimeDynamics` keys
- ensures required `crimeDynamics` arrays exist, deriving defaults from characters when needed
- normalizes `relationships` array into `{ pairs: [...] }`

Prompt-layer generation also normalizes/guards:
- retries when character count is short (before final attempt)
- final-attempt placeholder padding/truncation to exact count
- coercion of near-miss `accessPlausibility` values to allowed enum
- final-attempt required-field default fill
- role-archetype diversity deterministic fallback (`diversifyRoleArchetypes`) on final attempt
- gender normalization to `male|female|non-binary|undefined`

Hard fail guardrail in worker:
- non-empty `cast.cast.diversity.stereotypeCheck` throws and stops pipeline

## 5) Retry Behavior and Prompt Differences
Scoring orchestration:
- `executeAgentWithRetry()` in `apps/worker/src/jobs/agents/shared.ts`

Adapter mapping:
- `adaptCastForScoring()` in `apps/worker/src/jobs/scoring-adapters/agent2-scoring-adapter.ts`

Scorer:
- `CastDesignScorer` in `packages/story-validation/src/scoring/phase-scorers/agent2-cast-scorer.ts`

Weighted scoring components:
- validation: 40%
- quality: 30%
- completeness: 20%
- consistency: 10%

Scorer-level pass gate:
- no critical failures
- total score >= 60

Global threshold gate (aggregator):
- `agent2-cast` threshold is 75 (`packages/story-validation/src/scoring/thresholds.ts`)
- component minimums:
- validation >= 60
- quality >= 50
- completeness >= 60
- consistency >= 50

## 6) Downstream Consumers
Agent 2 has three retry layers.

### 6.1 Layer A: Internal generation retries (`designCast`)
Triggers include:
- JSON parse failure
- too few characters (before final attempt)
- insufficient culprit candidates
- insufficient archetype diversity (before final attempt)

Prompt delta vs normal attempt:
- none explicit; same base prompt is retried with same inputs for that generation call

### 6.2 Layer B: Scoring-driven retries (`executeAgentWithRetry`)
Trigger:
- score below threshold or component minima failure

Prompt delta vs normal attempt:
- retry feedback from `buildRetryFeedback()` is appended to `tone` using `appendRetryFeedback()`
- appended format includes `Retry guidance:` plus failed components/tests summary

Retry policy source:
- `apps/worker/config/retry-limits.yaml` (`agent2_cast`: max retries 3, linear backoff 500ms)

### 6.3 Layer C: Schema-repair retry (worker post-check)
Trigger:
- `validateArtifact("cast_design", payload)` fails in `agent2-run.ts`

Prompt delta vs normal attempt:
- second call to `designCast()` adds `qualityGuardrails` containing schema-fix instructions
- if retry still fails schema, worker throws with schema failure summary

## 7) Runtime Traceability
Direct consumers of `ctx.cast!.cast` include:
- Agent 2b (`apps/worker/src/jobs/agents/agent2b-run.ts`)
- Agent 2e (`apps/worker/src/jobs/agents/agent2e-run.ts`)
- Agent 3 (`apps/worker/src/jobs/agents/agent3-run.ts`)
- Agent 3b scoring context (`apps/worker/src/jobs/agents/agent3b-run.ts`)
- Agent 7 scoring/consistency context (`apps/worker/src/jobs/agents/agent7-run.ts`)
- Agent 9 prose/scoring context (`apps/worker/src/jobs/agents/agent9-run.ts`)

Indirect logic usage:
- detective/victim candidate selections are passed into CML generation inputs
- cast genders are mapped into Agent 3 `castGenders` for downstream pronoun handling

## 8) Full Field Glossary (Returned Artifact)
Best-prompt reference:
- `documentation/prompts/best/AGENT_2_CAST_BEST_PROMPT.md`

Observed prompt-capture naming pattern:
- `documentation/prompts/actual/<run-id>/02_Agent2-CastDesigner_request.md`
- `documentation/prompts/actual/<run-id>/02_Agent2-CastDesigner_response.md`
- retry captures may include suffixes like `_retry1_...`

## 9) Produced Files and Prompt Artifacts
This glossary describes the returned `CastDesignResult` payload from Agent 2.

Top-level fields:

| Field | Type | Required | Meaning |
|---|---|---|---|
| `cast` | `CastDesign` | yes | Full cast artifact used by downstream agents. |
| `attempt` | `number` | yes | Generation attempt index for the returned result. |
| `latencyMs` | `number` | yes | Generation latency in milliseconds. |
| `cost` | `number` | yes | Agent-attributed generation cost. |

`cast` fields:

| Field | Type | Required | Meaning |
|---|---|---|---|
| `characters` | `CharacterProfile[]` | yes | Suspect/detective/victim candidate roster with motive/opportunity attributes. |
| `relationships` | `RelationshipWeb` | yes | Pairwise relationship graph and tension map. |
| `diversity` | `object` | yes | Stereotype checks and cast-diversity recommendations. |
| `crimeDynamics` | `object` | yes | Culprit/red-herring/victim/detective candidate lists. |

`cast.characters[]` fields:

| Field | Type | Required | Meaning |
|---|---|---|---|
| `name` | `string` | yes | Character identifier used across downstream phases. |
| `ageRange` | `string` | yes | Age-band descriptor for characterization realism. |
| `occupation` | `string` | yes | Role profession/social function in-case world. |
| `roleArchetype` | `string` | yes | Narrative role label (detective/suspect/witness style archetype). |
| `publicPersona` | `string` | yes | Public-facing behavior/reputation. |
| `privateSecret` | `string` | yes | Hidden information driving suspicion and motive nuance. |
| `motiveSeed` | `string` | yes | Core motive premise. |
| `motiveStrength` | `"weak" \| "moderate" \| "strong" \| "compelling"` | yes | Enum motive intensity. |
| `alibiWindow` | `string` | yes | Claimed timeline/location window around crime events. |
| `accessPlausibility` | `"impossible" \| "unlikely" \| "possible" \| "easy"` | yes | Opportunity feasibility enum. |
| `stakes` | `string` | yes | Personal consequences tied to case outcome. |
| `characterArcPotential` | `string` | yes | Potential narrative trajectory for prose/outlining. |
| `gender` | `"male" \| "female" \| "non-binary"` | no | Optional gender attribute propagated to downstream pronoun handling. |

`cast.relationships.pairs[]` fields:

| Field | Type | Required | Meaning |
|---|---|---|---|
| `character1` | `string` | yes | First endpoint character name. |
| `character2` | `string` | yes | Second endpoint character name. |
| `relationship` | `string` | yes | Relationship type descriptor. |
| `tension` | `"none" \| "low" \| "moderate" \| "high"` | yes | Relationship tension intensity enum. |
| `sharedHistory` | `string` | yes | Backstory context linking pair dynamics to motive pressure. |

`cast.diversity` fields:

| Field | Type | Required | Meaning |
|---|---|---|---|
| `stereotypeCheck` | `string[]` | yes | Guardrail violations; must be empty for successful worker pass. |
| `recommendations` | `string[]` | yes | Suggestions for diversity/representation improvements. |

`cast.crimeDynamics` fields:

| Field | Type | Required | Meaning |
|---|---|---|---|
| `possibleCulprits` | `string[]` | yes | Candidate culprits for inference-path construction. |
| `redHerrings` | `string[]` | yes | Plausible but misleading suspect focus points. |
| `victimCandidates` | `string[]` | yes | Victim candidate names for case framing. |
| `detectiveCandidates` | `string[]` | yes | Investigator candidate names for role assignment. |

Related produced files:
- `CAST_DESIGN` artifact (validated by `schema/cast_design.schema.yaml`)
- `documentation/prompts/actual/<run-id>/02_Agent2-CastDesigner_request.md` (when capture is enabled)
- `documentation/prompts/actual/<run-id>/02_Agent2-CastDesigner_response.md` (when capture is enabled)
