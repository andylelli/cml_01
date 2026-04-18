# Agent 2c - Location Profiles

## 1) Role in the Pipeline
Agent 2c generates structured location profiles and sensory variants for setting-grounded narrative generation.

Worker runner:
- `apps/worker/src/jobs/agents/agent2c-run.ts`

Prompt/generation implementation:
- `packages/prompts-llm/src/agent2c-location-profiles.ts`

## 2) Prompt Design
### 2.1 Prompt Inputs
- `settingRefinement`
- `caseData`
- `narrative` (optional; may be absent when Agent 2c runs before Agent 7)
- `tone`
- `targetWordCount`
- `runId`
- `projectId`

### 2.2 Prompt Outputs
Primary return type:
- `LocationProfilesResult`

Core payload:
- `locationProfiles` / key locations with sensory detail blocks

## 3) Output Contract
Schema:
- `schema/location_profiles.schema.yaml`

Key structures:
- location records, sensory detail arrays, optional `sensoryVariants`

## 4) Scoring and Pass Criteria
Orchestrated via:
- `apps/worker/src/jobs/agents/shared.ts`

Adapter:
- `apps/worker/src/jobs/scoring-adapters/agent2c-scoring-adapter.ts`

Scorer:
- `LocationProfilesScorer` from `@cml/story-validation`

## 5) Retry Behavior and Prompt Differences
- Validation retry wrapper provides schema-error feedback and regeneration.
- Scoring retry can rerun generation with retry guidance in context.

## 6) Downstream Consumers
- Agent 6.5: `apps/worker/src/jobs/agents/agent65-run.ts`
- Agent 9: `apps/worker/src/jobs/agents/agent9-run.ts`

## 7) Runtime Traceability
Best-prompt reference:
- `documentation/prompts/best/AGENT_2C_LOCATION_PROFILES_BEST_PROMPT.md`

## 8) Full Field Glossary (Returned Artifact)
This glossary describes the returned `LocationProfilesResult` payload from Agent 2c.

Top-level fields:

| Field | Type | Required | Meaning |
|---|---|---|---|
| `status` | `"draft" \| "final"` | yes | Artifact lifecycle marker for this location profile set. |
| `tone` | `string` | no | Narrative tone used for profile generation. |
| `primary` | `PrimaryLocationProfile` | yes | Primary location profile for the case setting. |
| `keyLocations` | `KeyLocation[]` | yes | Structured set of key scene locations used downstream. |
| `atmosphere` | `AtmosphereProfile` | yes | Global atmospheric context for prose grounding. |
| `note` | `string` | no | Optional generator note. |
| `cost` | `number` | yes | Agent-attributed generation cost. |
| `durationMs` | `number` | yes | End-to-end generation duration in milliseconds. |

`primary` fields:

| Field | Type | Required | Meaning |
|---|---|---|---|
| `name` | `string` | yes | Primary location name. |
| `type` | `string` | yes | Primary location type/category label. |
| `place` | `string` | no | Specific town/city/village identifier. |
| `country` | `string` | no | Country identifier for geographic grounding. |
| `summary` | `string` | yes | Short high-level location summary. |
| `visualDescription` | `string` | yes | Visual scene framing details. |
| `atmosphere` | `string` | yes | Brief mood descriptor for the primary location. |
| `paragraphs` | `string[]` | yes | Narrative description paragraphs for primary location. |

`keyLocations[]` fields:

| Field | Type | Required | Meaning |
|---|---|---|---|
| `id` | `string` | yes | Stable location identifier. |
| `name` | `string` | yes | Human-readable location name. |
| `type` | `"interior" \| "exterior" \| "transitional"` | yes | Location environment class enum. |
| `purpose` | `string` | yes | Narrative/investigative function of location. |
| `visualDetails` | `string` | yes | Visual specificity for scene composition. |
| `sensoryDetails` | `object` | yes | Core sensory palette by modality. |
| `accessControl` | `string` | yes | Who can access location and under what constraints. |
| `sensoryVariants` | `SensoryVariant[]` | no | Optional alternate palettes for time/weather variation. |
| `paragraphs` | `string[]` | yes | Narrative paragraphs describing this key location. |

`keyLocations[].sensoryDetails` fields:

| Field | Type | Required | Meaning |
|---|---|---|---|
| `sights` | `string[]` | yes | Visual sensory details. |
| `sounds` | `string[]` | yes | Auditory sensory details. |
| `smells` | `string[]` | yes | Olfactory sensory details. |
| `tactile` | `string[]` | yes | Touch/texture/temperature sensory details. |

`keyLocations[].sensoryVariants[]` fields (when present):

| Field | Type | Required | Meaning |
|---|---|---|---|
| `id` | `string` | yes | Variant identifier. |
| `timeOfDay` | `string` | yes | Variant time-of-day key (expected morning/afternoon/evening/night semantics). |
| `weather` | `string` | yes | Variant weather condition label. |
| `sights` | `string[]` | yes | Variant-specific visual cues. |
| `sounds` | `string[]` | yes | Variant-specific auditory cues. |
| `smells` | `string[]` | yes | Variant-specific olfactory cues. |
| `mood` | `string` | yes | Variant mood descriptor. |

`atmosphere` fields:

| Field | Type | Required | Meaning |
|---|---|---|---|
| `era` | `string` | yes | Era label for atmospheric framing. |
| `weather` | `string` | yes | Global weather baseline. |
| `timeFlow` | `string` | yes | Temporal progression context for story duration/rhythm. |
| `mood` | `string` | yes | Global emotional register. |
| `eraMarkers` | `string[]` | yes | Period-authentic details used for grounding. |
| `sensoryPalette` | `object` | yes | Dominant and secondary sensory profile. |
| `paragraphs` | `string[]` | yes | Global atmosphere narrative paragraphs. |

`atmosphere.sensoryPalette` fields:

| Field | Type | Required | Meaning |
|---|---|---|---|
| `dominant` | `string` | yes | Primary sensory impression. |
| `secondary` | `string[]` | yes | Supporting sensory impressions. |

## 9) Produced Files and Prompt Artifacts
Related produced files:
- `LOCATION_PROFILES` artifact (validated by `schema/location_profiles.schema.yaml`)
- Agent 2c prompt snapshots in `documentation/prompts/actual/<run-id>/` (when capture is enabled)
- Agent 2c response snapshots in `documentation/prompts/actual/<run-id>/` (when capture is enabled)
