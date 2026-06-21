# ANALYSIS_42 - False-Green Pass and Deterministic Prose Regression Deep Dive

Date: 2026-06-16

## 0. Implementation Progress Tracker (Chunked Execution)

This section operationalizes ANALYSIS_42 into testable change workflows. Execute one chunk at a time, validate, then decide go/no-go before moving to the next chunk.

### 0.1 Status Board

- [ ] Chunk 1 (P0): pre-prose temporal coherence gate across Agent 3b/3/7 (iteration 1 review invalidated by pre-change run; rerun required)
- [ ] Chunk 2 (P0): remove prose-hostile locked-fact sentence injection
- [ ] Chunk 3 (P0): quarantine fallback from clean-pass scoring/release
- [ ] Chunk 4 (P1): harden deterministic fallback quality and leakage rejection
- [ ] Chunk 5 (P1): align scoring with narrative-quality failure modes
- [ ] Chunk 6 (P1/P2): deterministic micro-polish + end-to-end calibration

### 0.2 KPI Tracker

| KPI | Baseline (bdaf4d70) | Target After Chunks 1-3 | Target After Chunks 4-6 | Current |
|---|---:|---:|---:|---:|
| Pre-prose timeline contradiction block rate (known bad fixture) | 0% | 100% | 100% | not yet measured on post-change run |
| Locked-fact generic injection count (`The time was recorded as ...` / `The elapsed time was confirmed as ...`) | >0 | 0 | 0 | >0 (both phrases still present in committed prose) |
| Fallback-committed runs classified as clean `passed` | possible | 0 | 0 | 0/1 in reviewed run (run outcome aborted) |
| Fallback instruction-leakage incidents in committed prose | >0 | reduced | 0 | not primary in this run; repetition artifacts still present |
| Deterministic malformed suspect-clearance constructions | >0 | reduced | 0 | >0 (`could not have been Evelyn Ashford`) |
| External review score average (rolling sample) | mid-50s to high-60s (observed poor runs) | low/mid-70s | 80+ | TBD |

### 0.3 Chunk Execution Rules

1. Implement exactly one chunk per change workflow.
2. Run focused tests for touched modules first, then package builds.
3. Update this tracker before starting the next chunk.
4. Do not run canary unless explicitly requested.
5. Escalate to redesign (not micro-tweaks) if a chunk fails twice on the same root cause.

### 0.4 Six-Chunk Implementation Plan

#### Chunk 1 - Pre-Prose Temporal Coherence Gate (Workstream A, P0)

Goal:
- fail fast when Agent 3b locked facts conflict with Agent 3 CML or Agent 7 narrative timing anchors.

Primary touchpoints:
- `apps/worker/src/jobs/agents/agent9-run.ts`
- pre-prose integrity logic currently around `apps/worker/src/jobs/agents/agent9-run.ts:2239-2272`
- temporal/scoring adapter tests in worker

Implementation notes:
- broaden from clue-text overlap checks to explicit cross-artifact reconciliation.
- emit structured conflict diagnostics (source, field, value, conflicting value).
- preserve existing clue-level mismatch checks; add cross-artifact checks as a superset.

Tests:
- add/extend worker unit tests with contradictory 3b vs 3/7 fixtures.
- assert run is blocked before prose generation starts.

Acceptance criteria:
- runs like `bdaf4d70` are blocked pre-prose with actionable conflict details.
- non-conflicting fixtures continue normally.

#### Chunk 2 - Remove Prose-Hostile Locked-Fact Injection (Workstream B, P0)

Goal:
- eliminate worker-side generic sentence prepends that damage narrative voice.

Primary touchpoints:
- `apps/worker/src/jobs/agents/agent9-run.ts`
- current injection templates and logic around `:810-816` and `:1036-1114`
- `apps/worker/src/__tests__/agent9-locked-facts.test.ts`

Implementation notes:
- remove generic prepend templates from commit path.
- allow only targeted in-text normalization/replacement where safe.
- if recovery cannot be done safely, fail chapter/batch for retry rather than injecting report prose.

Tests:
- extend locked-facts tests to assert banned template phrases never appear.
- assert existing word-form repair still works where intended.

Acceptance criteria:
- no committed prose contains generic locked-fact injection phrases.
- locked-fact recovery remains functional without narrative-hostile inserts.

#### Chunk 3 - Quarantine Fallback from Clean-Pass Status (Workstream C, P0)

Goal:
- prevent fallback-committed chapters from normalizing into plain `A/passed` outcomes.

Primary touchpoints:
- `apps/worker/src/jobs/agents/agent9-run.ts` (release-gate diagnostic payload)
- `packages/story-validation/src/scoring/aggregator.ts`
- `packages/story-validation/src/scoring/report-invariants.ts`
- score/invariant tests under `packages/story-validation/src/scoring/__tests__` and `packages/story-validation/src/__tests__`

Implementation notes:
- promote committed fallback telemetry to explicit degraded-state signal.
- require downgrade when `validation_status=needs_review` plus major issues and/or fallback committed.
- support an explicit override path if a clean pass must be allowed (must include reason).

Tests:
- add aggregator tests proving fallback-committed runs cannot yield clean pass.
- add invariant tests for contradictions: `needs_review` + major/fallback + `run_outcome=passed`.

Acceptance criteria:
- no fallback-committed run surfaces as plain clean pass.
- report diagnostics and outcome are internally consistent.

#### Chunk 4 - Harden Deterministic Fallback Quality + Leakage Rejection (Workstream D, P1)

Goal:
- make fallback minimally readable and block prompt/instruction leakage from commit.

Primary touchpoints:
- `packages/prompts-llm/src/agent9-prose/deterministic-repair.ts`
- `packages/prompts-llm/src/agent9-prose/generate.ts`
- fallback validation and commit filters

Implementation notes:
- enforce fallback phrase hygiene for suspect-clearance grammar.
- block scene-objective/prompt fragments (for example imperative instruction strings) from committed prose.
- dedupe repeated expansion beats before commit.
- keep final-reveal fallback constrained to motive + opportunity/access + method + exclusion chain.

Tests:
- extend `packages/prompts-llm/src/__tests__/agent9-prose.test.ts` with leakage and malformed-clearance regressions.
- assert fallback validation fails for known leakage phrases.

Acceptance criteria:
- no malformed deterministic clearance constructions.
- no instruction-shaped fallback strings in committed prose.
- repetition dedupe verified in tests.

#### Chunk 5 - Align Scoring/Release with Human-Visible Defects (Workstream E, P1)

Goal:
- ensure narrative corruption affects pass status, not just structural diagnostics.

Primary touchpoints:
- `packages/story-validation/src/scoring/phase-scorers/agent9-prose-scorer.ts`
- `packages/story-validation/src/scoring/aggregator.ts`
- release/invariant tests

Implementation notes:
- add penalties/signals for fallback-template saturation, deterministic seam density, leakage, malformed clearance text, unresolved contradiction markers.
- feed these into top-level outcome logic, not diagnostics-only.

Tests:
- extend scorer tests with fallback-heavy and leakage-heavy fixtures.
- confirm downgraded score/outcome behavior in aggregation tests.

Acceptance criteria:
- structurally valid but narratively corrupted prose cannot retain a clean pass profile.

#### Chunk 6 - Deterministic Micro-Polish + End-to-End Calibration (Roadmap Waves 3-4)

Goal:
- improve readability of deterministic inserts and validate that quality movement is real.

Primary touchpoints:
- `packages/prompts-llm/src/agent9-prose/post-pass-polish.ts`
- `packages/prompts-llm/src/agent9-prose/generate.ts`
- worker release diagnostics for before/after comparison

Implementation notes:
- enable quality-only micro-polish on deterministic insert spans, not only already-passing whole chapters.
- keep hard logic locked while polishing language.
- verify external-review proxy movement using the KPI tracker above.

Tests:
- add micro-polish regression tests to ensure no logic drift.
- run focused package tests/builds; optionally run one controlled end-to-end validation sample when requested.

Acceptance criteria:
- late-chapter readability improves without contract regressions.
- tracker metrics show sustained improvement trend.

### 0.5 Suggested Validation Commands Per Chunk

1. Worker-focused chunks:
  - `npm run -w @cml/worker test -- src/__tests__/agent9-locked-facts.test.ts src/__tests__/scoring-adapters-temporal.test.ts`
2. Prompt/fallback chunks:
  - `npm run -w @cml/prompts-llm test -- src/__tests__/agent9-prose.test.ts`
3. Scoring/report chunks:
  - `npm run -w @cml/story-validation test -- src/scoring/__tests__/scoring.test.ts src/scoring/__tests__/agent9-prose-scorer.test.ts src/__tests__/report-invariants.test.ts`
4. Build gates after each chunk:
  - `npm run -w @cml/prompts-llm build`
  - `npm run -w @cml/story-validation build`
  - `npm run -w @cml/worker build`

### 0.6 Chunk Analysis Loop (Manual Run by User)

This workflow is the operating mode for each chunk going forward.

Process:
1. I implement one chunk only.
2. We run focused tests/builds for that chunk.
3. You run one manual pipeline run (credit-saving path).
4. I assess the run output against the chunk acceptance criteria and KPI tracker.
5. If not good enough, we iterate the same chunk.
6. Only when the chunk is good do we mark it complete and move to the next chunk.

Non-negotiable gate:
- No progression to next chunk until the current chunk passes both:
  - code-level validation (tests/builds)
  - run-level quality checks (manual run assessment)

#### 0.6.1 What You Provide After Each Manual Run

Required run context:
- `run_id`
- timestamp
- story/output path
- quality report path (if generated)
- short note on visible prose quality (especially chapter 7-9)

Optional but helpful:
- screenshots/snippets of the worst paragraphs
- any unexpected warnings/errors from worker/api logs

#### 0.6.2 What I Will Assess Per Chunk

For every manual run, I will produce:
1. Pass/fail against that chunk's acceptance criteria.
2. Delta against baseline (what improved, what regressed, what stayed flat).
3. Root-cause classification for remaining failures.
4. A tight fix list for the next iteration of the same chunk.
5. A move-forward recommendation: `iterate chunk` or `advance to next chunk`.

#### 0.6.3 Chunk Evaluation Template

Use this template for each completed manual run review:

```md
Chunk: <1-6>
Iteration: <n>
Run ID: <run_id>

Acceptance Criteria Status:
- Criterion A: pass/fail + evidence
- Criterion B: pass/fail + evidence
- Criterion C: pass/fail + evidence

KPI Delta:
- KPI 1: baseline -> current
- KPI 2: baseline -> current
- KPI 3: baseline -> current

Residual Defects:
- severity + file/path + symptom

Decision:
- iterate chunk / advance to next chunk

Next Actions:
1. ...
2. ...
3. ...
```

#### 0.6.4 Definition of "Chunk Is Good"

A chunk is "good" only when all are true:
- all chunk-specific acceptance criteria are met
- no new P0/P1 regressions were introduced
- KPI trend for the chunk is neutral-to-positive (no hidden quality tradeoff)
- run outcome/reporting behavior is consistent with observed prose quality

If any one of these fails, we keep iterating the same chunk.

### 0.7 Chunk 1 Review - Iteration 1 (Corrected Validation)

Chunk: 1
Iteration: 1
Run ID: `run_31cd3a45-0230-4079-b7d5-c0c4f6c841af`

Validation correction (what went wrong in our review):
- The reviewed run `run_31cd3a45-0230-4079-b7d5-c0c4f6c841af` started at `18:44` and completed around `18:58` (prompt bundle/report timestamps), while the Chunk 1 code edit time on `apps/worker/src/jobs/agents/agent9-run.ts` is `20:10`.
- Therefore that run could not have executed the current Chunk 1 implementation; using it as a run-level verdict for Chunk 1 was invalid.

Acceptance Criteria Status (corrected):
- Criterion A (bad contradictory fixtures block pre-prose): **inconclusive** (no post-change manual run yet).
- Criterion B (actionable conflict details emitted before prose): **inconclusive** (no post-change manual run yet).
- Criterion C (non-conflicting fixtures continue normally): **pass at code-level only** (tests/builds passed).

KPI Delta:
- KPI 1 (pre-prose contradiction block): `0% -> pending` (await post-change manual run).
- KPI 2 (generic locked-fact injection phrases): `>0 -> >0` (still present: `The time was recorded as...` and `The elapsed time was confirmed as...` in `stories/story_20260616-1845/generated_in_scene_batches_7_batch_es_required_r.md:9` and `:133`).
- KPI 3 (fallback-committed clean pass): `possible -> not observed this run` (run aborted, not clean passed) in `apps/api/data/reports/proj_bead9a89-783d-4da8-a8de-0717d17f239f/run_31cd3a45-0230-4079-b7d5-c0c4f6c841af.json:10`.

Residual Defects / Risks (validated against code):
- P0 process defect: run-level validation used a pre-change run (invalid sample for Chunk 1).
- P0 code risk: `detectCrossArtifactTemporalConflicts` currently scans selected CML fields but not `CASE.inference_path`, where explicit time anchors commonly appear in real runs.
- P1 quality defect persists independently of Chunk 1: locked-fact generic injections and deterministic repetitive tails still degrade late chapters.
- P2 UI log noise (`latest_not_ready` 404 polling) remains expected non-blocking behavior.

Decision:
- **iterate chunk** (with corrected validation protocol)

Next Actions (revised fix plan):
1. Re-run manual pipeline on post-change code only (restart worker/api or ensure latest source loaded), then evaluate Chunk 1 against that run.
2. Expand Chunk 1 source coverage in `detectCrossArtifactTemporalConflicts` to include `CASE.inference_path` (and keep existing `false_assumption`, `constraint_space.time`, `discriminating_test`, `prose_requirements`, `narrative_outline`, `narrative.acts`).
3. Add run-shaped regression fixture for the `ten minutes past eleven` vs `three o'clock/three-thirty` family where conflicting anchor appears under `inference_path`.
4. Upgrade association from description-token overlap to event-anchor mapping:
  - classify locked-fact event class (`clock_face_time`, `tamper_delta`, `witness_claim_time`, etc.)
  - compare only semantically matching candidate paths
  - avoid accidental misses from sparse or generic descriptions.
5. Emit a dedicated pre-prose contradiction diagnostic in report/checkpoint payload (source field path, canonical value, conflicting value, mismatch type, event class) for deterministic debugging.

### 0.8 Root-Cause Validation Against Code Changes

Validated findings:
- The prior run assessment mismatch was primarily **process drift**: run artifacts preceded code changes.
- Chunk 1 code exists and abort wiring is present in `apps/worker/src/jobs/agents/agent9-run.ts` pre-prose integrity path.
- Likely remaining logic blind spot: missing `CASE.inference_path` traversal in cross-artifact candidate collection.

Implementation-quality guardrails for next iteration:
- Do not accept run-level conclusions from any run whose timestamp is older than touched-file `LastWriteTime` for chunk files.
- Require one dedicated post-change run per chunk iteration before pass/fail decision.
- Record run id + file mtimes in this tracker for auditability.

## 1. Scope

This analysis explains why run `run_bdaf4d70-5779-437f-9746-955280c63e69` was scored and released as a clean pass while the saved prose clearly regressed in narrative quality and internal coherence.

In scope:
- final saved story output
- Agent 3 / 3b / 7 upstream timeline inputs
- Agent 9 retry, fallback, polish, and atmosphere-repair behavior
- worker-side post-processing and release-gate behavior
- scoring/report discrepancies

Out of scope:
- broad style tuning beyond the specific regression paths in this run
- unrelated cast-schema cleanup already covered by `ANALYSIS_41`

Primary sources reviewed:
- `stories/story_20260616-1845/generated_in_scene_batches_7_batch_es_required_r.md`
- `stories/story_20260616-1845/chatgpt-review.txt`
- `documentation/prompts/actual/run_20260615-2137_bdaf4d70/INDEX.md`
- `documentation/prompts/actual/run_20260615-2137_bdaf4d70/04_Agent3b-HardLogicDeviceGenerator_response.md`
- `documentation/prompts/actual/run_20260615-2137_bdaf4d70/05_Agent3-CMLGenerator_response.md`
- `documentation/prompts/actual/run_20260615-2137_bdaf4d70/13_Agent7-NarrativeFormatter_response.md`
- `documentation/prompts/actual/run_20260615-2137_bdaf4d70/14_Agent9-ProseGenerator-Ch1_request.md`
- `documentation/prompts/actual/run_20260615-2137_bdaf4d70/15_Agent9-PostPassPolish-Ch1_response.md`
- `documentation/prompts/actual/run_20260615-2137_bdaf4d70/54_Agent9-AtmosphereRepair-Ch9_response.md`
- `apps/worker/src/jobs/agents/agent9-run.ts`
- `packages/prompts-llm/src/agent9-prose/deterministic-repair.ts`
- `packages/prompts-llm/src/agent9-prose/post-pass-polish.ts`
- `packages/prompts-llm/src/retry-protocol.ts`
- `C:\Users\andyl\Downloads\quality-report-run_bdaf4d70-5779-437f-9746-955280c63e69.json`

## 2. Executive Summary

This was not a simple "the model wrote worse prose" regression.

The run passed because the system optimized for structural completion and validator compliance, then scored the result through gates that did not meaningfully penalize deterministic prose corruption.

The regression comes from four interacting failures:

1. Upstream timeline inputs are internally contradictory before Agent 9 writes prose.
2. Worker post-processing force-injects locked-fact sentences in stiff, report-like phrasing.
3. Late chapters fall into deterministic fallback scaffolds that satisfy contract shape but not narrative quality.
4. Scoring and release gates still normalize that degraded deterministic output into a successful pass.

Net effect:
- `ANALYSIS_40` improved validator alignment inside Agent 9.
- `ANALYSIS_41` improved retry persistence and some contract hygiene.
- But neither addressed the larger "false-green" path where contradictory inputs plus deterministic repair still produce output that passes release.

So the system is moving forward on "finish the run" while moving backward on "produce publishable mystery prose."

## 3. Key Evidence Snapshot

Run-level contradiction:
- The quality report says the run scored `97`, grade `A`, `passed: true`, and `run_outcome: "passed"` in `quality-report-run_bdaf4d70-5779-437f-9746-955280c63e69.json:7-19`.
- The same report records `validation_status: "needs_review"` with `1` major and `7` moderate issues in `quality-report-run_bdaf4d70-5779-437f-9746-955280c63e69.json:6321-6355`.
- The same report records deterministic fallback telemetry for chapter 9 in `quality-report-run_bdaf4d70-5779-437f-9746-955280c63e69.json:6550-6559`.

Saved prose quality:
- Chapter 1 contains three different time anchors in the opening sequence in `generated_in_scene_batches_7_batch_es_required_r.md:9-19`.
- Chapter 8 contains deterministic suspect-clearance boilerplate embedded directly into scene prose in `generated_in_scene_batches_7_batch_es_required_r.md:111-123`.
- Chapter 9 is dominated by fallback-template language, duplicated beats, and instruction leakage in `generated_in_scene_batches_7_batch_es_required_r.md:127-145`.

Upstream target incoherence:
- Agent 3b locked facts say the stopped clock is `ten minutes past eleven`, the clock was wound back `forty minutes`, witness time is `a quarter past ten`, and actual death time is `twenty minutes past ten` in `04_Agent3b-HardLogicDeviceGenerator_response.md:48-51`.
- Agent 3 says the clock shows `quarter to nine` and contradicts a noise heard at `quarter past eight` in `05_Agent3-CMLGenerator_response.md:207-212`.
- Agent 7 carries that `quarter to nine` / `quarter past eight` contradiction into chapter planning in `13_Agent7-NarrativeFormatter_response.md:46`.

## 4. Severity-Ranked Findings

### F1 - P0 Blocking: the run target is temporally self-contradictory before prose generation

Evidence:
- `04_Agent3b-HardLogicDeviceGenerator_response.md:48-51`
- `05_Agent3-CMLGenerator_response.md:207-212`
- `13_Agent7-NarrativeFormatter_response.md:46`
- `14_Agent9-ProseGenerator-Ch1_request.md:375-380`

What is happening:
- Hard-logic locked facts and CML/narrative planning describe different clock states and witness-time anchors.
- Agent 9 is then instructed to preserve all of them as if they are simultaneously canonical.
- Current code does contain a narrow pre-prose integrity check in `apps/worker/src/jobs/agents/agent9-run.ts:2239-2272`, but it only compares locked-fact values against clue text with `>= 2` keyword overlap and only fires when the clue contains a parseable digit-form time.

Why this matters:
- No amount of retry-brief tuning or post-pass polish can produce a clean timeline if the writing target itself is inconsistent.
- This explains why the ChatGPT review correctly identifies timeline contradictions, even though some of the criticized wording is downstream deterministic damage.

Conclusion:
- This is an upstream contract failure, not primarily an Agent 9 phrasing failure.
- The real gap is not "no guard exists." The real gap is that the existing guard is too narrow to reconcile Agent 3b locked facts against Agent 3 / Agent 7 narrative summaries before prose generation.

### F2 - P0 Blocking: worker post-processing injects prose-hostile locked-fact sentences directly into chapters

Evidence:
- Injection templates are defined in `apps/worker/src/jobs/agents/agent9-run.ts:810-816`.
- Injection logic is applied in `apps/worker/src/jobs/agents/agent9-run.ts:1036-1114`.
- The exact injected phrases appear in the story at `generated_in_scene_batches_7_batch_es_required_r.md:9`, `:15`, `:59`, `:85`, `:115`, and `:133`.

What is happening:
- Missing locked-fact values are repaired by prepending generic sentences such as:
  - `The time was recorded as ...`
  - `The elapsed time was confirmed as ...`
- The trigger is token-overlap with fact descriptions, not a scene-aware prose decision.

Why this matters:
- These insertions are not stylistically neutral.
- They add courtroom/report language into Victorian mystery narration.
- They can reintroduce contradictory times into chapters that previously read more naturally.

Conclusion:
- This is a direct regression source in saved prose, independent of the model's original output.

### F3 - P0 Blocking: deterministic fallback for late chapters is structurally complete but narratively broken

Evidence:
- Fallback prose builders live in `packages/prompts-llm/src/agent9-prose/deterministic-repair.ts:528-576` and `:726-834`.
- Deterministic clearance prose lives in `packages/prompts-llm/src/agent9-prose/deterministic-repair.ts:409-425`.
- Chapter 9 matches fallback-template wording in `generated_in_scene_batches_7_batch_es_required_r.md:129-145`.
- The report records fallback telemetry for chapter 9 in `quality-report-run_bdaf4d70-5779-437f-9746-955280c63e69.json:6550-6559`.

What is happening:
- When retries fail, the system commits a deterministic fallback chapter with:
  - generic opening/location scaffolds
  - deterministic clue paragraphs
  - deterministic suspect-clearance paragraphs
  - deterministic final-reveal boilerplate
  - repeated expansion beats to hit floor word counts

Why this matters:
- This path can satisfy structural validators while still producing obviously synthetic prose.
- Chapter 9 shows instruction leakage and malformed semantic joins:
  - `could not have been Evelyn Ashford`
  - `Confront the true culprit with evidence`
  - duplicated `The same contradiction was tested again...`

Conclusion:
- The fallback path is a completion mechanism, not a publishable prose mechanism, and it is currently being treated as both.

### F4 - P1 High: release-gate and scoring logic produce a false-green pass

Evidence:
- Top-level pass and grade are in `quality-report-run_bdaf4d70-5779-437f-9746-955280c63e69.json:7-19`.
- Release-gate summary shows `needs_review` with `1` major and `7` moderate issues in `quality-report-run_bdaf4d70-5779-437f-9746-955280c63e69.json:6321-6355`.
- Release-gate audit still reports `status: "passed"` in `quality-report-run_bdaf4d70-5779-437f-9746-955280c63e69.json:6601-6641`.
- Agent 9 scoring already records a fallback trust cap of `88` for `committed_fallback_chapter` in `quality-report-run_bdaf4d70-5779-437f-9746-955280c63e69.json:3495-3504`.
- Aggregation still promotes the run to `passed` when there are no hard stops and `validation_status` is not literally `failed` in `packages/story-validation/src/scoring/aggregator.ts:233-259`.
- Report invariants only reject `run_outcome=passed` when release-gate status is `failed` or failed phases exist; they do not reject `passed` plus `needs_review` plus committed fallback telemetry in `packages/story-validation/src/scoring/report-invariants.ts:229-245`.

What is happening:
- The scoring/report layer treats this output as a clean pass despite:
  - known validation issues
  - deterministic fallback telemetry
  - recurring phrase counts
  - visible prose corruption in the committed artifact
- At phase level, the prose scorer does notice some of the damage and caps Agent 9 to `88`.
- But top-level aggregation still computes `run_outcome: "passed"` because:
  - `validation_status: "needs_review"` is treated as informational rather than degrading
  - `release_gate_warning_count` is `0`
  - committed fallback telemetry is not converted into release warnings, hard stops, or a terminal downgrade

Why this matters:
- The system is now capable of shipping obviously degraded prose while generating reassuring green metrics.
- That makes human review and tuning slower because the dashboards point the wrong way.

Conclusion:
- This is not just a generation bug. It is also an observability and acceptance bug.

### F5 - P1 High: post-pass polish improves passing chapters, but the worst chapters never reach it

Evidence:
- Polish only runs after a chapter already passes in `packages/prompts-llm/src/agent9-prose/post-pass-polish.ts:131-224`.
- The run index shows polish for chapters 1, 2, 3, and 5, but no polish for chapters 4, 6, 7, 8, or 9 in `INDEX.md:23-63`.
- Chapter 1's polish output is cleaner than the final saved chapter in `15_Agent9-PostPassPolish-Ch1_response.md`.

What is happening:
- Phase 2 quality work is operating on the most successful chapters.
- The most degraded late chapters bypass polish entirely because they never entered the "already valid" path.

Why this matters:
- The codebase can look improved in unit tests and early-chapter artifacts while the user-facing story still gets worse overall.

Conclusion:
- The polish step is not the regression source. It is simply not reaching the chapters that need rescue.

### F6 - P2 Contextual: ANALYSIS_41 retry changes amplify visibility of bad fallback, but are not the primary root cause

Evidence:
- `final reveal completeness` is mapped to `fair_play` in `packages/prompts-llm/src/retry-protocol.ts:35`.
- `fair_play` gets full-budget retry treatment in `packages/prompts-llm/src/retry-protocol.ts:68-85` and `:196-207`.

What is happening:
- The system now spends more time trying to salvage difficult late-stage chapters.
- When those retries still fail, the user sees the deterministic fallback output more often.

Why this matters:
- This can look like "ANALYSIS_41 made prose worse."
- In reality, it mostly exposed the low-quality fallback path instead of aborting earlier.

Conclusion:
- Retry persistence is not the core bug.
- The problem is what happens after persistence fails.

## 5. Root-Cause Synthesis

The regression path for this run is:

1. Agent 3b establishes one clock timeline.
2. Agent 3 / 7 establish a different clock timeline.
3. Agent 9 is prompted with both.
4. Early chapters partially succeed and sometimes get polished.
5. Mid/late chapters accumulate retries.
6. Worker post-processing injects locked-fact sentences into already fragile prose.
7. Chapter 9 falls into deterministic fallback.
8. Atmosphere repair performs only phrase substitutions and does not meaningfully improve the fallback chapter.
9. Scoring/release layers mark the run as a strong pass despite visible degradation.

This is why the user experience feels like regression:
- the system is succeeding more often according to internal gates
- while producing worse output according to any human reading test

## 6. Prioritized Fix Workstreams

### Workstream A (P0): Broaden pre-prose temporal coherence gating across Agent 3b, Agent 3, and Agent 7 artifacts

Goal:
- fail fast when hard-logic locked facts and narrative summaries describe incompatible times for the same event/device

Primary touchpoints:
- Agent 3b hard-logic output contract
- Agent 3 CML generation
- Agent 7 narrative formatter
- worker pre-prose integrity checks

Acceptance criteria:
- runs like `bdaf4d70` are blocked before prose generation
- the gate reports exact conflicting fields and values
- Agent 9 never receives mutually incompatible time anchors as canonical truths
- existing clue-level mismatch detection is preserved, but supplemented with direct Agent 3b vs Agent 3 / Agent 7 cross-artifact checks

### Workstream B (P0): remove or heavily constrain locked-fact sentence injection

Goal:
- stop worker-side prose mutation from inserting report-style sentences into narrative chapters

Primary touchpoints:
- `apps/worker/src/jobs/agents/agent9-run.ts`

Acceptance criteria:
- `The time was recorded as ...` and `The elapsed time was confirmed as ...` no longer appear as deterministic repair prose
- locked-fact recovery prefers:
  - targeted replacement of existing time phrases
  - or chapter failure / retry
  - not sentence injection

### Workstream C (P0): quarantine deterministic fallback from clean-pass scoring

Goal:
- do not allow a chapter generated through deterministic fallback to be scored/released as if it were a normal prose success

Primary touchpoints:
- worker fallback telemetry
- release-gate summary
- scoring normalization

Acceptance criteria:
- any committed fallback chapter downgrades run status to at least warning / degraded pass
- dashboards expose fallback-committed runs clearly
- a run with fallback chapter 9 cannot surface as a plain `A / passed / zero warnings`
- `validation_status: "needs_review"` with major issues or committed fallback telemetry cannot normalize to `run_outcome: "passed"` without an explicit override path

### Workstream D (P1): harden deterministic fallback quality and reject instruction leakage

Goal:
- make fallback prose minimally human-readable when it must be used

Primary touchpoints:
- `packages/prompts-llm/src/agent9-prose/deterministic-repair.ts`
- final validation/release filters

Acceptance criteria:
- deterministic clearance paragraphs cannot produce malformed constructions like `could not have been Evelyn Ashford`
- fallback text cannot contain scene-objective phrases or prompt fragments such as `Confront the true culprit with evidence`
- repeated expansion beats are deduplicated before commit

### Workstream E (P1): align scoring/release with actual prose quality failure modes

Goal:
- make the quality report reflect narrative corruption, not only structural validity

Primary touchpoints:
- prose quality diagnostics
- release-gate aggregation
- final report normalization

Acceptance criteria:
- repeated deterministic insertions, fallback-template saturation, and instruction leakage reduce pass status
- `needs_review` with major issues cannot normalize to a clean pass without an explicit override reason

## 7. Verification Plan

1. Reproduce this run's artifact state from saved prompts and final story output.
2. Add a regression fixture with:
- conflicting clock facts across hard-logic and CML
- a fallback-committed chapter
- locked-fact injection candidates
3. Assert pre-prose coherence gate blocks the run before Agent 9.
4. Assert worker no longer injects generic time/duration sentences into prose.
5. Assert fallback-committed runs surface as degraded in the quality report.
6. Add scorer/invariant coverage proving:
- `needs_review` plus major issues cannot normalize to clean `passed`
- committed fallback telemetry forces a degraded top-level status or score cap
7. Re-run one end-to-end canary and manually inspect:
- opening timeline clarity
- late-chapter reveal quality
- release status vs actual prose condition

## 8. Decision Summary

This run should not be interpreted as "ANALYSIS_40 Phase 2 made prose worse" in isolation.

The deeper diagnosis is:
- `ANALYSIS_40` improved local validator alignment
- `ANALYSIS_41` improved persistence and contract enforcement
- but the system still lacks:
  - broad upstream temporal coherence enforcement
  - safe locked-fact recovery
  - a degraded-state model for deterministic fallback
  - honest scoring when prose is technically complete but artistically broken

That is the gap `ANALYSIS_42` closes.

## 9. Roadmap To 80/100 In ChatGPT Review

This section translates the engineering findings above into a practical roadmap for reaching `80/100` consistently in the external human-review frame represented by `stories/story_20260616-1845/chatgpt-review.txt`.

### 9.1 What `80/100` actually means

For this pipeline, `80/100` does not require literary brilliance.

It requires consistent competence across five visible dimensions:

1. One coherent timeline from chapter 1 to the reveal
2. Clean character reference handling with near-zero pronoun/name slips
3. Clues surfaced naturally instead of by visible repair scaffolding
4. A final reveal that explains motive, opportunity, and method without sounding templated
5. Prose that reads as intentionally authored rather than validator-patched

In practice, that means the target should be:

- Premise / concept: `7+`
- Opening hook: `7+`
- Plot structure: `8+`
- Character clarity: `8+`
- Dialogue: `7+`
- Atmosphere / setting: `7+`
- Mystery clues: `8+`
- Pacing: `8+`
- Ending / reveal potential: `8+`
- Prose / polish: `7+`

That profile yields a stable `77-83` range even without exceptional style.

### 9.2 Why we are below `80` now

The current system loses points in the same places repeatedly:

- Plot structure drops because timeline facts conflict before prose generation.
- Character clarity drops because deterministic fallback still introduces pronoun and subject-reference distortion.
- Mystery clues drop because clue compliance is achieved through injected or obvious patch prose.
- Ending / reveal drops because the final chapter can be structurally complete but emotionally and logically mechanical.
- Prose / polish drops because worker-side post-processing and fallback scaffolds leave visible synthetic seams.

This means we are not one fix away from `80`.
We need a layered improvement plan that removes the biggest review-visible failures first.

### 9.3 Non-negotiable floor before style work

The system will not reach `80/100` consistently until these are true:

1. Pre-prose coherence:
   - no contradictory timeline facts across Agent 3b, Agent 3, and Agent 7
2. No prose-hostile worker injection:
   - no generic `The time was recorded as ...` / `The elapsed time was confirmed as ...` repairs
3. Fallback cannot masquerade as success:
   - fallback chapters must downgrade run quality status
4. Final reveal must either pass a stronger quality contract or force reroute:
   - no more structurally valid but visibly templated closing chapters

Without these floors, style improvements will keep getting overwritten by deterministic corruption.

### 9.4 Four-wave roadmap

#### Wave 1 - stop the obvious review-killers

Goal:
- eliminate the failure modes that push stories into the `50s` and `60s`

Scope:
- add pre-prose timeline coherence gate
- disable generic locked-fact sentence injection
- add explicit degraded-pass flag for fallback-committed runs
- block prompt/instruction leakage in committed prose

Expected score effect:
- `+10 to +15` on bad runs

Why:
- this directly improves plot structure, mystery clue coherence, and prose polish

#### Wave 2 - make late chapters genuinely readable

Goal:
- prevent chapter 7-9 quality collapse

Scope:
- rewrite deterministic fallback paragraphs to be shorter, less repetitive, and scene-specific
- separate "logic completion scaffolds" from "publishable prose fallback"
- add final-reveal-specific fallback that must name:
  - motive
  - opportunity window
  - method
  - exclusion chain
- deduplicate repeated expansion beats before commit

Expected score effect:
- `+6 to +10`

Why:
- this is where current runs lose the most reviewer trust

#### Wave 3 - improve natural clue and interrogation writing

Goal:
- move clue compliance from visible scaffolding into natural scene prose

Scope:
- make required-clue prompts more scene-local and less checklist-shaped
- improve dialogue constraints for interrogation scenes
- add targeted prose-quality checks for:
  - over-explaining the clock too early
  - repeated inference phrasing
  - suspect-clearance boilerplate
- allow micro-polish on deterministic inserts only, not just whole passing chapters

Expected score effect:
- `+4 to +8`

Why:
- this lifts dialogue, pacing, clue handling, and prose polish together

#### Wave 4 - align scoring to human quality so regressions are caught automatically

Goal:
- stop shipping false-green `A` runs with visibly weak prose

Scope:
- add quality penalties for:
  - fallback-template saturation
  - repeated deterministic insertions
  - instruction leakage
  - malformed suspect-clearance constructions
  - unresolved timeline contradiction markers
- create a "review-likelihood" or "human-quality" diagnostic alongside structural pass/fail
- classify fallback-heavy runs as degraded even when technically releasable

Expected score effect:
- not directly additive to prose quality, but critical for consistency

Why:
- we cannot reach `80/100 consistently` if internal scoring keeps rewarding `60/100` prose

### 9.5 Definition of consistent `80/100`

The system should be considered to have reached the target only when all of the following are true over a meaningful sample, not a single showcase run.

Recommended consistency gate:

- minimum sample: `20` completed story runs
- average external review score: `80+`
- no run below `74`
- at least `80%` of runs in the `78-85` band
- `0` false-green runs where release says clean pass but human review says severe regression

Recommended internal proxy metrics:

- pre-prose timeline contradiction rate: `< 1%`
- fallback-committed final chapters: `< 10%`
- locked-fact sentence injection count: `0`
- deterministic suspect-clearance malformed output rate: `0`
- pronoun/name legality violations in committed prose: `< 1 per 10 runs`

### 9.6 Suggested execution order

Recommended order:

1. Workstream A from this analysis: pre-prose coherence gate
2. Workstream B: remove locked-fact sentence injection
3. Workstream C: quarantine fallback from clean-pass scoring
4. Workstream D: rewrite fallback prose and dedupe expansion beats
5. Add final-reveal-specific quality gate and fallback
6. Add micro-polish for deterministic inserts
7. Align scoring/reporting with human-visible prose defects

Why this order:
- it removes the biggest score destroyers before tuning surface style
- it prevents us from polishing prose that will later be overwritten by deterministic degradation
- it gives faster feedback on whether each wave is moving the external review score

### 9.7 Bottom-line expectation

Realistically:

- Waves 1 and 2 should move the system from "false-green but often mid-50s to high-60s in human review" to "mostly low- to mid-70s."
- Wave 3 is what should push stable runs into the `78-83` range.
- Wave 4 is what makes that level trustworthy and repeatable instead of accidental.

So the path to `80/100 consistently` is not "more retries" or "stronger polish prompts."

It is:
- coherent upstream facts
- less destructive deterministic recovery
- better late-chapter prose fallback
- scoring that reflects what readers actually notice
