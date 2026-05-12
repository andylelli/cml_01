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
- Optional bottom-up redesign path behind `AGENT9_REDESIGN_V1` (default enabled), including chapter request-contract validation and class-based retry escalation.

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
- Retry classification now groups failures into canonical classes (`encoding`, `structure`, `completeness`, `continuity`, `clue_timing`, `template`, `tone_pacing`, `fair_play`) and can stop early on non-convergent repeat classes.
- Deterministic mitigation hooks are applied on repeated classes: `split_chapter`, `freshen_atoms`, and `tighten_obligation`; mixed clue+template failures can trigger combined mitigation parameters in a single retry packet.
- Template-linter failures are deferred as hard blockers while narrative hard errors remain in the same attempt, then re-applied once narrative obligations clear.
- Clue-obligation validation supports semantic anchor fallback (derived from clue description + pointsTo) to reduce false-negative phrase matching while preserving timing/order constraints.
- Runner-level schema retry: if `prose` schema fails, performs one schema-repair full regeneration pass.
- No full-phase global rewrite loop in `runAgent9`; instead it relies on targeted guardrails, deterministic repair passes, and hard release gates.
- Deterministic post-processing includes text sanitation, chapter-title normalization, pronoun repair, locked-fact word-form repair, and location normalization.
- Validation feedback and context signals (fair-play, novelty, setting/background constraints) are pushed back into prose guardrails on retries.

## 6) Rollback Control

- Runtime flag: `AGENT9_REDESIGN_V1`
- `true` (default): bottom-up request-contract + retry-protocol path enabled.
- `false`: legacy path remains active without removing new code.
- This is the primary rollback switch for canary and production orchestration.

## 7) Downstream Consumers
- Final output consumer is the story artifact/reporting pipeline.

## 8) Runtime Traceability
Best-prompt reference:
- `documentation/prompts/best/AGENT_9_PROSE_BEST_PROMPT.md`

## 9) Full Field Glossary (Returned Artifact)
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
| `requestContractViolations` | `Array<{ chapterRange, errors[] }>` | no | Bottom-up request-contract failures captured before LLM generation. |
| `retryPackets` | `Array<{ chapterRange, attempt, failureClass, shouldEscalate }>` | no | Class-based retry packet telemetry for convergence diagnostics. |
| `batchCommitRecords` | `Array<BatchCommitRecord>` | no | Per-batch commit trace: attempt count, gate outcomes, clue deltas, deployed atoms, prompt fingerprint hash, duration, and cost. |

## 10) Produced Files and Prompt Artifacts
Related produced files:
- `PROSE` artifact (validated by `schema/prose.schema.yaml`)
- Story-validation report (`ctx.validationReport`) and release-gate diagnostics in run scoring logs
- Chapter batch validation/telemetry metadata in run outputs (`validationDetails`, NSD transfer trace)
- Release-gate contract snapshot (`release_gate_audit`) in `agent9_prose_release_gate_summary` diagnostics
- Agent 9 prompt snapshots in `documentation/prompts/actual/<run-id>/` (when capture is enabled)
- Agent 9 response snapshots in `documentation/prompts/actual/<run-id>/` (when capture is enabled)
