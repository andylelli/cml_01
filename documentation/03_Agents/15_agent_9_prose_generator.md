# Agent 9 - Prose Generator

## 1) Role in the Pipeline
Agent 9 is the final narrative synthesis phase, producing chapter prose from structured pipeline artifacts.

Worker runner:
- `apps/worker/src/jobs/agents/agent9-run.ts`

Prompt/generation implementation:
- `packages/prompts-llm/src/agent9-prose.ts`

## 2) Prompt Design
### 2.1 Prompt Inputs
Core inputs include:
- `caseData`
- `outline`
- `cast`
- optional context artifacts (`characterProfiles`, `locationProfiles`, `temporalContext`, `worldDocument`)
- prose controls (`targetLength`, `narrativeStyle`, `detectiveType`)
- `qualityGuardrails`
- `lockedFacts`
- `clueDistribution`
- `narrativeState`
- `runId`, `projectId`

Runtime orchestration adds:
- `narrativeState` transfer between chapter batches.
- `writingGuides` from `notes/DEFINITIVE_GUIDE_TO_HUMOUR.md` and `notes/WHAT_MAKES_A_GOOD_WHODUNNIT.md` when present.
- Batch callbacks (`onBatchComplete`, `onAtomsSelected`) used for NSD/asset tracking and incremental scoring telemetry.

### 2.2 Prompt Outputs
Primary return type:
- `ProseGenerationResult`

Core payload:
- `chapters[]`

## 3) Output Contract
Schema:
- `schema/prose.schema.yaml`

Validation path:
- Initial artifact validation via `validateArtifact("prose", prose)`.
- On schema failure, one schema-repair prose regeneration is executed and revalidated.
- Full story-level validation then runs through `StoryValidationPipeline` prior to final acceptance.

Schema vs runtime fields:
- `schema/prose.schema.yaml` validates core prose fields (`status`, `tone`, `chapters`, `cast`, `note`, `cost`, `durationMs`).
- Additional runtime telemetry fields (`prompt_fingerprints`, `validationDetails`) can appear in `ProseGenerationResult` but are not part of schema validation.

## 4) Scoring and Pass Criteria
Adapter:
- `apps/worker/src/jobs/scoring-adapters/agent9-scoring-adapter.ts`

Scorer:
- `ProseScorer` from `@cml/story-validation`

Pass criteria in runner:
- Prose can continue despite a low first-pass score (warning path), but must pass downstream validation/release gates.
- Hard-stop release conditions (for example: temporal contradictions, suspect-elimination failure, encoding corruption, severe clue-visibility divergence) abort the run.
- Validation failures in `StoryValidationPipeline` with critical/major blockers throw and stop output finalization.

## 5) Retry Behavior and Prompt Differences
- Internal batch retries occur inside `generateProse(...)` for chapter-generation validation failures.
- Batch-level failures are recorded in `validationDetails.failureHistory` and surfaced in runner warnings/logs.
- Runner-level schema retry: if `prose` schema fails, performs one schema-repair full regeneration pass.
- No full-phase global rewrite loop in `runAgent9`; instead it relies on targeted guardrails, deterministic repair passes, and hard release gates.
- Deterministic post-processing includes text sanitation, chapter-title normalization, pronoun repair, locked-fact word-form repair, and location normalization.
- Validation feedback and context signals (fair-play, novelty, setting/background constraints) are pushed back into prose guardrails on retries.

## 6) Downstream Consumers
- Final output consumer is the story artifact/reporting pipeline.

## 7) Runtime Traceability
Best-prompt reference:
- `documentation/prompts/best/AGENT_9_PROSE_BEST_PROMPT.md`

## 8) Full Field Glossary (Returned Artifact)
Top-level returned fields (`ProseGenerationResult`):

| Field | Type | Required | Meaning |
|---|---|---|---|
| `status` | `"draft" \| "final"` | yes | Generation status flag from prose generator. |
| `tone` | `string` | no | Optional declared prose tone. |
| `chapters` | `ProseChapter[]` | yes | Final generated chapters in order. |
| `cast` | `string[]` | yes | Character names present in prose payload. |
| `note` | `string` | no | Optional generation note metadata. |
| `cost` | `number` | yes | Agent-attributed generation cost. |
| `durationMs` | `number` | yes | End-to-end prose generation duration. |
| `prompt_fingerprints` | `Array<{ chapter, hash, section_sizes }>` | no | Runtime telemetry field (not schema-validated) for per-chapter prompt traceability. |
| `validationDetails` | `object` | no | Runtime telemetry field (not schema-validated) with batch retry/linter/underflow/provisional-scoring details. |

Nested fields (`ProseChapter`):

| Field | Type | Required | Meaning |
|---|---|---|---|
| `title` | `string` | yes | Chapter title (normalized to stable format downstream). |
| `summary` | `string` | no | Optional short chapter summary. |
| `paragraphs` | `string[]` | yes | Chapter body paragraphs in final order. |

Nested fields (`validationDetails`):

| Field | Type | Required | Meaning |
|---|---|---|---|
| `totalBatches` | `number` | yes | Number of prose batches attempted. |
| `batchesWithRetries` | `number` | yes | Batches requiring retry before acceptance. |
| `failureHistory` | `Array<{ batchIndex, chapterRange, attempt, errors[] }>` | yes | Detailed retry failure history by batch. |
| `linter` | `{ checksRun, failedChecks, openingStyleEntropyFailures, openingStyleEntropyBypasses, paragraphFingerprintFailures, ngramOverlapFailures }` | yes | Template/linter quality telemetry. |
| `underflow` | `object` | no | Chapter word-count floor/target miss telemetry and expansions. |
| `provisionalChapterScores` | `Array<{ chapter, score, deficits[], directives[] }>` | no | Interim chapter scoring directives used to steer later chapters. |

## 9) Produced Files and Prompt Artifacts
Related produced files:
- `PROSE` artifact (validated by `schema/prose.schema.yaml`)
- Story-validation report (`ctx.validationReport`) and release-gate diagnostics in run scoring logs
- Chapter batch validation/telemetry metadata in run outputs (`validationDetails`, NSD transfer trace)
- Agent 9 prompt snapshots in `documentation/prompts/actual/<run-id>/` (when capture is enabled)
- Agent 9 response snapshots in `documentation/prompts/actual/<run-id>/` (when capture is enabled)
