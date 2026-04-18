# Agent 2d - Temporal Context

## 1) Role in the Pipeline
Agent 2d produces temporal and cultural context used to lock month/season realism and period authenticity.

Worker runner:
- `apps/worker/src/jobs/agents/agent2d-run.ts`

Prompt/generation implementation:
- `packages/prompts-llm/src/agent2d-temporal-context.ts`

## 2) Prompt Design
### 2.1 Prompt Inputs
- `settingRefinement`
- `caseData`
- `runId`
- `projectId`
- `qualityGuardrails` (optional)

### 2.2 Prompt Outputs
Primary return type:
- `TemporalContextResult`

Core payload:
- temporal context object (season/month/fashion/current affairs/culture)

## 3) Output Contract
Schema:
- `schema/temporal_context.schema.yaml`

## 4) Scoring and Pass Criteria
Orchestrated via:
- `apps/worker/src/jobs/agents/shared.ts`

Adapter:
- `apps/worker/src/jobs/scoring-adapters/agent2d-scoring-adapter.ts`

Scorer:
- `TemporalContextScorer` from `@cml/story-validation`

## 5) Retry Behavior and Prompt Differences
- Validation retry wrapper handles schema failures.
- Scoring retries can include additional quality guardrails in subsequent attempts.

## 6) Downstream Consumers
- Agent 6.5: `apps/worker/src/jobs/agents/agent65-run.ts`
- Agent 9: `apps/worker/src/jobs/agents/agent9-run.ts`

## 7) Runtime Traceability
Best-prompt reference:
- `documentation/prompts/best/AGENT_2D_TEMPORAL_CONTEXT_BEST_PROMPT.md`

## 8) Full Field Glossary (Returned Artifact)
This glossary describes the returned `TemporalContextResult` payload from Agent 2d.

Top-level fields:

| Field | Type | Required | Meaning |
|---|---|---|---|
| `status` | `"draft" \| "final"` | yes | Artifact lifecycle marker for temporal context output. |
| `specificDate` | `object` | yes | Canonical date anchor used to constrain historical realism. |
| `seasonal` | `object` | yes | Month/season-level environmental and social activity context. |
| `fashion` | `object` | yes | Period-authentic clothing and social presentation norms. |
| `currentAffairs` | `object` | yes | Political/economic/social and international context for the period. |
| `cultural` | `object` | yes | Entertainment, literature, technology, and daily life grounding. |
| `socialAttitudes` | `object` | yes | Era-specific class/gender/race norms and broad social expectations. |
| `atmosphericDetails` | `string[]` | yes | Reusable sensory details for scene-level prose grounding. |
| `paragraphs` | `string[]` | yes | Narrative synthesis paragraphs for this temporal backdrop. |
| `note` | `string` | no | Optional generator note. |
| `cost` | `number` | yes | Agent-attributed generation cost. |
| `durationMs` | `number` | yes | End-to-end generation duration in milliseconds. |

`specificDate` fields:

| Field | Type | Required | Meaning |
|---|---|---|---|
| `year` | `number` | yes | Specific year selected within the decade. |
| `month` | `string` | yes | Specific month name used as historical anchor. |
| `day` | `number` | no | Optional day-of-month precision. |
| `era` | `string` | yes | Era/decade label for this context set. |

`seasonal` fields:

| Field | Type | Required | Meaning |
|---|---|---|---|
| `season` | `"spring" \| "summer" \| "fall" \| "winter"` | yes | Seasonal classification aligned to the chosen month. |
| `month` | `string` | yes | Month label repeated for seasonal consistency checks. |
| `weather` | `string[]` | yes | Concrete weather descriptors for the period and location. |
| `daylight` | `string` | yes | Daylight/sunset-style environmental timing details. |
| `holidays` | `string[]` | yes | Relevant holiday observances for the chosen month. |
| `seasonalActivities` | `string[]` | yes | Typical month-specific social or practical activities. |
| `time_of_day_of_crime` | `string` | no | Optional crime-time phrase used for temporal scene framing. |

`fashion` fields:

| Field | Type | Required | Meaning |
|---|---|---|---|
| `mensWear` | `object` | yes | Men's period dress profile. |
| `womensWear` | `object` | yes | Women's period dress profile. |
| `trendsOfTheMoment` | `string[]` | yes | Time-specific fashion trends and signals. |
| `socialExpectations` | `string[]` | yes | Dress-code and presentation expectations by context/class. |

`fashion.mensWear` and `fashion.womensWear` fields:

| Field | Type | Required | Meaning |
|---|---|---|---|
| `formal` | `string[]` | yes | Formal attire details. |
| `casual` | `string[]` | yes | Casual/everyday attire details. |
| `accessories` | `string[]` | yes | Accessories and finishing details. |

`currentAffairs` fields:

| Field | Type | Required | Meaning |
|---|---|---|---|
| `majorEvents` | `string[]` | yes | Major events influencing social background pressure. |
| `politicalClimate` | `string` | yes | Political context summary. |
| `economicConditions` | `string` | yes | Economic context summary. |
| `socialIssues` | `string[]` | yes | Social tensions/debates active in this period. |
| `internationalNews` | `string[]` | yes | Relevant global developments known to characters. |

`cultural` fields:

| Field | Type | Required | Meaning |
|---|---|---|---|
| `entertainment` | `object` | yes | Popular media and leisure context. |
| `literature` | `object` | yes | Publishing and reading-culture context. |
| `technology` | `object` | yes | Inventions, everyday devices, and emerging trends. |
| `dailyLife` | `object` | yes | Practical social/economic habits and routines. |

`cultural.entertainment` fields:

| Field | Type | Required | Meaning |
|---|---|---|---|
| `popularMusic` | `string[]` | yes | Music references and listening culture markers. |
| `films` | `string[]` | yes | Film references relevant to the date and audience. |
| `theater` | `string[]` | yes | Theater/live-performance references. |
| `radio` | `string[]` | yes | Radio programming/audio culture references. |

`cultural.literature` fields:

| Field | Type | Required | Meaning |
|---|---|---|---|
| `recentPublications` | `string[]` | yes | Recent books/publications shaping discourse. |
| `popularGenres` | `string[]` | yes | Dominant reading genres for the period. |

`cultural.technology` fields:

| Field | Type | Required | Meaning |
|---|---|---|---|
| `recentInventions` | `string[]` | yes | Newly introduced inventions around this period. |
| `commonDevices` | `string[]` | yes | Everyday technologies characters commonly use. |
| `emergingTrends` | `string[]` | yes | Early/transitioning technology or social-tech trends. |

`cultural.dailyLife` fields:

| Field | Type | Required | Meaning |
|---|---|---|---|
| `typicalPrices` | `string[]` | yes | Price examples for period-realistic economic grounding. |
| `commonActivities` | `string[]` | yes | Typical routines/recreation for daily life scenes. |
| `socialRituals` | `string[]` | yes | Social conventions and repeated interpersonal rituals. |

`socialAttitudes` fields:

| Field | Type | Required | Meaning |
|---|---|---|---|
| `class` | `string[]` | yes | Class hierarchy assumptions and pressures. |
| `gender` | `string[]` | yes | Gender-role assumptions active in the era. |
| `race` | `string[]` | yes | Race-related social attitudes and boundaries. |
| `generalNorms` | `string[]` | yes | Broader social norms governing behavior and reputation. |

## 9) Produced Files and Prompt Artifacts
Related produced files:
- `TEMPORAL_CONTEXT` artifact (validated by `schema/temporal_context.schema.yaml`)
- Agent 2d prompt snapshots in `documentation/prompts/actual/<run-id>/` (when capture is enabled)
- Agent 2d response snapshots in `documentation/prompts/actual/<run-id>/` (when capture is enabled)
