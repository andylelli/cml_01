# Agent 2b - Character Profiles

## 1) Role in the Pipeline
Agent 2b expands cast entries into prose-ready character dossiers (voice, motive psychology, behavioural texture, and paragraph blocks) that are used by world-building and final prose generation.

Worker runner:
- `apps/worker/src/jobs/agents/agent2b-run.ts`

Prompt/generation implementation:
- `packages/prompts-llm/src/agent2b-character-profiles.ts`

Scoring adapter:
- `apps/worker/src/jobs/scoring-adapters/agent2b-scoring-adapter.ts`

Scorer implementation:
- `packages/story-validation/src/scoring/phase-scorers/agent2b-character-profiles-scorer.ts`

## 2) Prompt Design
### 2.1 Prompt Inputs
Worker passes these effective inputs to `generateCharacterProfiles()`:
- `caseData` (full CML)
- `cast` (Agent 2 output)
- `tone` (`ctx.inputs.narrativeStyle` with optional retry feedback appended)
- `targetWordCount` (currently `1000`)
- `runId`
- `projectId`

Default generation config source:
- `getGenerationParams().agent2b_profiles.params` in `packages/story-validation/src/generation-params.ts`
- defaults: `temperature=0.6`, `max_tokens=4000`, `default_max_attempts=2`

### 2.2 Prompt Structure
`buildProfilesPrompt()` composes:
- `system` block: profile-writer role, no-new-facts rule, JSON-only rule
- `developer` block: strict schema contract, enum constraints, detective personal-stake requirement, humour system requirements, quality bar, checklist
- `user` block: title/era/setting/cast summary and serialized cast detail payload

Runtime message shape:
- system message = `system + developer`
- user message = `user`

### 2.3 Prompt Semantics and Hard Requirements
The prompt enforces:
- one profile per cast member
- 4-6 `paragraphs` per profile
- exact enum values for `motiveStrength` and `humourStyle`
- numeric `humourLevel` in `0.0-1.0`
- detective must include both `internalConflict` and `personalStakeInCase`

On validation retries, prior schema errors are injected into the prompt via `buildValidationFeedback()` (errors are rewritten to character-name-targeted instructions when possible).

## 3) Output Contract
Primary return type:
- `CharacterProfilesResult`

Top-level fields:
- `status` (`draft|final`)
- `tone` (optional)
- `targetWordCount` (optional)
- `profiles[]`
- `note` (optional)
- `cost`
- `durationMs`

Schema:
- `schema/character_profiles.schema.yaml`

Per-profile key fields include:
- identity and motive/alibi fields
- humour metadata (`humourStyle`, `humourLevel`)
- voice/behaviour fields (`speechMannerisms`, optional `physicalMannerisms`)
- depth fields (`internalConflict`, `personalStakeInCase`, optional `privateLonging`)
- required `paragraphs[]`

## 4) Scoring and Pass Criteria
Generation-level validation is wrapped by:
- `withValidationRetry()` in `packages/prompts-llm/src/utils/validation-retry-wrapper.ts`

Validation function:
- `validateArtifact("character_profiles", payload)`

Important behavior:
- wrapper retries generation with prior validation errors when invalid
- if max attempts are exhausted, wrapper returns last result plus invalid status (does not hard-throw unless no result exists)

Targeted post-pass repair:
- if any profile has missing `paragraphs`, `repairMissingParagraphs()` runs a focused single-character repair call (`Agent2b-ProfileRepair`) to fill that profile only

Worker-level validation behavior in `agent2b-run.ts`:
- runs `validateArtifact("character_profiles", ctx.characterProfiles)`
- logs failures/warnings into `ctx.warnings`
- does not hard-fail pipeline on validation errors in this stage

## 5) Retry Behavior and Prompt Differences
Scoring orchestration:
- `executeAgentWithRetry()` in `apps/worker/src/jobs/agents/shared.ts`

Adapter mapping:
- `adaptCharacterProfilesForScoring()` maps profile objects into scorer format and enriches text fields (for depth scoring) and humour-style descriptions

Scorer:
- `CharacterProfilesScorer` in `packages/story-validation/src/scoring/phase-scorers/agent2b-character-profiles-scorer.ts`

Weighted scoring components:
- validation: 40%
- quality: 30%
- completeness: 20%
- consistency: 10%

Scorer-level pass gate:
- no critical failures
- total score >= 60

Global threshold gate (aggregator):
- `agent2b-character-profiles` threshold is 75 (`packages/story-validation/src/scoring/thresholds.ts`)
- component minimums:
- validation >= 60
- quality >= 50
- completeness >= 60
- consistency >= 50

## 6) Downstream Consumers
Agent 2b has three practical retry layers.

### 6.1 Layer A: Validation-wrapper retries (inside `generateCharacterProfiles`)
Trigger:
- schema validation failure (`character_profiles`)
- generation exceptions (treated as retryable in wrapper)

Prompt delta vs normal attempt:
- validation errors are appended through `buildValidationFeedback(previousErrors)` into the prompt instructions

### 6.2 Layer B: Scoring-driven retries (worker `executeAgentWithRetry`)
Trigger:
- score below threshold/component minima when scoring is enabled

Prompt delta vs normal attempt:
- retry feedback generated from scoring is appended to `tone` via `appendRetryFeedback()`
- appended text includes `Retry guidance:` plus failed component/test details

Retry policy source:
- `apps/worker/config/retry-limits.yaml` (`agent2b_profiles`: max retries 3, linear backoff 500ms)

### 6.3 Layer C: Targeted single-profile repair
Trigger:
- one or more profiles missing required `paragraphs`

Prompt delta vs normal attempt:
- dedicated one-character repair prompt with strict output shape `{"paragraphs": [...]}`

## 7) Runtime Traceability
Direct consumers:
- Agent 6.5 world builder (`apps/worker/src/jobs/agents/agent65-run.ts`)
- Agent 9 prose generator (`apps/worker/src/jobs/agents/agent9-run.ts`)

Scoring-context usage in prose path:
- passed as `agent2b_character_profiles` in previous-phase scoring context for Agent 9 runs

## 8) Full Field Glossary (Returned Artifact)
Best-prompt reference:
- `documentation/prompts/best/AGENT_2B_CHARACTER_PROFILES_BEST_PROMPT.md`

Observed runtime agent labels:
- `Agent2b-CharacterProfiles`
- `Agent2b-ProfileRepair`

Prompt capture note:
- prompt/response captures for this agent depend on the run path and capture settings; use `documentation/prompts/actual/<run-id>/INDEX.md` to locate exact 2b filenames for a run.

## 9) Produced Files and Prompt Artifacts
This glossary describes the returned `CharacterProfilesResult` payload from Agent 2b.

Top-level fields:

| Field | Type | Required | Meaning |
|---|---|---|---|
| `status` | `"draft" \| "final"` | yes | Artifact lifecycle marker for this profile set. |
| `tone` | `string` | no | Narrative tone applied during profile generation. |
| `targetWordCount` | `number` | no | Target words per profile used by prompt constraints. |
| `profiles` | `CharacterProfileOutput[]` | yes | Per-character narrative profile list. |
| `note` | `string` | no | Optional generator note. |
| `cost` | `number` | yes | Accumulated generation cost tracked for this agent. |
| `durationMs` | `number` | yes | End-to-end generation duration in milliseconds. |

`profiles[]` item fields:

| Field | Type | Required | Meaning |
|---|---|---|---|
| `name` | `string` | yes | Character name, expected to map to Agent 2 cast member. |
| `summary` | `string` | no | Brief high-level character summary. |
| `publicPersona` | `string` | no | Public-facing identity and social presentation. |
| `privateSecret` | `string` | no | Hidden fact/pressure relevant to character behavior. |
| `motiveSeed` | `string` | no | Core motive premise tied to case incentives. |
| `motiveStrength` | `"weak" \| "moderate" \| "strong" \| "compelling"` | no | Enum-based motive intensity. |
| `alibiWindow` | `string` | no | Claimed timing/location window around key events. |
| `accessPlausibility` | `string` | no | Access feasibility descriptor for opportunity framing. |
| `stakes` | `string` | no | Personal consequences if truth is exposed. |
| `humourStyle` | `"understatement" \| "dry_wit" \| "polite_savagery" \| "self_deprecating" \| "observational" \| "deadpan" \| "sardonic" \| "blunt" \| "none"` | no | Structured humour mode for dialogue/personality contrast. |
| `humourLevel` | `number` | no | Humor intensity scale `0.0-1.0`. |
| `speechMannerisms` | `string` | no | Dialogue cadence, diction, and verbal habits. |
| `internalConflict` | `string` | no | Character's internal moral or psychological tension. |
| `personalStakeInCase` | `string` | no | Why this specific case matters personally. |
| `paragraphs` | `string[]` | yes | Main narrative profile body; expected 4-6 paragraphs. |
| `order` | `number` | no | Optional stable display/order index. |

Schema-accepted optional profile fields (may appear in payload):

| Field | Type | Required | Meaning |
|---|---|---|---|
| `physicalMannerisms` | `string` | no | Physical tells/body-language behavior under stress. |
| `privateLonging` | `string` | no | Non-case personal desire driving subtext and humanity. |
| `gender` | `"male" \| "female" \| "non-binary"` | no | Gender label carried for downstream context coherence. |

Related produced files:
- `CHARACTER_PROFILES` artifact (validated against `schema/character_profiles.schema.yaml`)
- Agent 2b prompt snapshots in `documentation/prompts/actual/<run-id>/` (when capture is enabled)
- Agent 2b response snapshots in `documentation/prompts/actual/<run-id>/` (when capture is enabled)
