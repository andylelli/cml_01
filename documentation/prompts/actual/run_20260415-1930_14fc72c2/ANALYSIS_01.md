# ANALYSIS_01: Why Agent 5 Keeps Failing

## Objective
Deep-dive root-cause analysis of recurring Agent 5 failures, with emphasis on why retries are not converging and what to change for durable stability.

## Evidence Base
This analysis uses:
- `documentation/prompts/actual/run_20260415-1930_14fc72c2/RUN_ANALYSIS.md`
- `documentation/prompts/actual/run_20260415-1852_b69725ad/RUN_ANALYSIS.md`
- `documentation/prompts/actual/run_20260415-1737_0cbde23a/RUN_ANALYSIS.md`
- `documentation/prompts/actual/run_20260415-1930_14fc72c2/06_Agent5-ClueExtraction_request.md`
- `documentation/prompts/actual/run_20260415-1930_14fc72c2/06_Agent5-ClueExtraction_response.md`
- `documentation/prompts/actual/run_20260415-1930_14fc72c2/08_Agent5-ClueExtraction_retry1_request.md`
- `documentation/prompts/actual/run_20260415-1930_14fc72c2/08_Agent5-ClueExtraction_retry1_response.md`
- `documentation/prompts/actual/run_20260415-1930_14fc72c2/.actual-run-state.json`
- `packages/prompts-llm/src/agent5-clues.ts`
- `apps/worker/src/jobs/agents/agent5-run.ts`

## Recurrence Pattern
Across recent runs, Agent 5 failures are not random. They cluster around the same classes:

1. Persistent red-herring overlap with true-solution correction language.
2. Invalid or mismatched `sourceInCML` paths despite explicit legality instructions.
3. Model self-audit arrays claiming clean output (`invalidSourcePaths: []`) while deterministic checks find defects.
4. Retry observability gaps (response-only records with missing request/empty body capture).

Observed outcomes:
- `run_0cbde23a`: failed suspect-coverage gate after retries.
- `run_b69725ad`: failed red-herring overlap gate after retries.
- `run_14fc72c2`: failed red-herring overlap gate after retry.

## Root Causes (Deep Dive)

### 1) Contract Conflict Inside the Prompt (High Confidence)
Agent 5 prompt frequently asks for a high number of mandatory clue requirements while also enforcing low clue-density targets.

Evidence:
- In `packages/prompts-llm/src/agent5-clues.ts`, the developer prompt emits:
  - `Mandatory Clue Requirements (${requiredClues.length} required)`
  - plus density instruction like minimal `5-8` total.
- In the latest run request (`06_Agent5-ClueExtraction_request.md`), there were 10 mandatory requirements while density still constrained the output range.

Why this matters:
- The model is forced into an optimization conflict: satisfy many hard targets but keep total clue count low.
- Under conflict, the model tends to compress or hallucinate source paths, and retries become unstable rather than corrective.

### 2) Objective Conflict: Red Herring Design vs Overlap Gate (High Confidence)
The prompt asks red herrings to support a temporal false assumption, but the overlap gate penalizes lexical/phrase proximity to inference corrections that often share the same temporal lexicon.

Evidence:
- Latest run false assumption is clock/timeline-centric.
- Red herrings naturally mention clock/time/witness context.
- Runtime overlap detector in `apps/worker/src/jobs/agents/agent5-run.ts` uses token + phrase overlap and a calibrated threshold.
- Stop-word set does not remove domain anchors like `clock`, `time`, `stopped`, so red herrings can trip overlap even when they remain plausible misdirection.

Why this matters:
- The model is asked to do two partially incompatible things in temporal-axis cases:
  - stay close enough to the false assumption to be plausible,
  - stay far enough from correction language to avoid overlap fail.
- Retries keep circling in the same semantic neighborhood.

### 3) Source Path Drift is Structural, Not Cosmetic (High Confidence)
Model outputs repeatedly include illegal or mismatched paths:
- out-of-range arrays (for example `contradictions[1]`, `contradictions[2]` when only `[0]` exists),
- name-index/path mismatches (clue text names one suspect but source points to another cast index).

Evidence:
- Latest run responses (`06` and `08`) include invalid indices while `audit.invalidSourcePaths` remains empty.
- Similar pattern appears in prior failed runs.

Why this matters:
- This is not solved by “more warnings” in prompt text.
- The model is treating path constraints as soft, while runtime treats them as hard.

### 4) Self-Audit is Non-Authoritative (High Confidence)
The model can output `status: pass` with empty audit arrays even when objective defects exist.

Evidence:
- Latest run: status stayed `pass` and `invalidSourcePaths` empty despite clear invalid paths in clue payload.

Why this matters:
- If the same generator both creates and self-judges, audit reliability is weak unless externally recomputed.
- Retry prompts that trust model audit can miss real defects.

### 5) Retry Loop Signals Are Too Coarse (Medium-High Confidence)
Retry instructions indicate what category failed, but not always exact immutable repair constraints that force a different token/phrase solution manifold.

Evidence:
- Retry request in latest run asks for rewrites/non-overlap justifications but still leaves broad freedom in lexical choices.

Why this matters:
- The model can “comply in form” (new wording) while remaining semantically close enough to fail deterministic overlap scoring.

### 6) Observability Gap Masks Failure Dynamics (Medium Confidence)
A response-only record (`sequence 7`, retryAttempt 0, empty promptHash) appears in repeated runs.

Evidence:
- `.actual-run-state.json` and `INDEX.md` in recent run folders show missing request entries.

Why this matters:
- Lost request/response continuity blocks precise attribution of which prompt revision introduced or repeated a defect.
- Debug cycles become slower and less deterministic.

### 7) Score/Outcome Misalignment Encourages Wrong Optimization (Medium Confidence)
Runs can report high aggregate score (for example 99.6, grade A) while still aborting on a hard gate.

Why this matters:
- Team intuition can drift toward “quality looks high” when release-critical gate behavior is actually unstable.
- Agent 5 needs gate-first success criteria, not blended score-first interpretation.

## Why It "Keeps" Failing
It is a feedback-loop problem, not a single bug:

1. Prompt contract conflicts force compromise behavior.
2. Compromise behavior increases path drift and lexical overlap risk.
3. Model self-audit under-reports these defects.
4. Retry prompts are corrective but still underconstrained for deterministic gates.
5. Missing retry artifacts reduce debugging precision.
6. Same failure families recur run-over-run.

## Stabilization Plan (Decisive)

### Phase A: Remove Internal Prompt Contradictions
1. Cap mandatory requirements by density target, or auto-escalate density when required set exceeds target.
2. Resolve hard precedence explicitly:
   - path legality
   - step/index bounds
   - discriminating-test IDs
   - suspect elimination coverage
   - then optional texture.
3. In retry mode, pass exact legal index bounds and name-index map in a compact machine-like block.

Acceptance signal:
- No run where mandatory clue count exceeds declared density envelope without automatic density escalation.

### Phase B: Make Overlap Repair Deterministic
1. For red-herring retries, provide an explicit forbidden lexical set derived from correction phrases.
2. Require each red herring to include at least one false-assumption anchor that is not in forbidden set.
3. Add a pre-emit overlap self-check step in prompt and require a rewrite loop until score is below threshold.

Acceptance signal:
- No red-herring overlap hard-fail in 10 consecutive temporal-axis runs.

### Phase C: Treat Model Audit as Advisory Only
1. Runtime remains source of truth for path validity, missing discriminating IDs, and weak elimination.
2. Retry feedback must be generated from deterministic recomputation, not model-provided audit arrays.

Acceptance signal:
- Zero cases where model audit says clean but runtime finds critical path/index defects without automatic retry correction.

### Phase D: Fix Retry Observability Contract
1. Enforce atomic logging per attempt:
   - request captured,
   - response captured,
   - non-empty body,
   - stable retry attempt numbering.
2. Fail logging step loudly if artifact is missing.

Acceptance signal:
- No missing request/response pair in any retry sequence for 20 consecutive runs.

### Phase E: Gate-First Reporting
1. Promote gate status over aggregate score in run summaries.
2. Include explicit “Release blocked by Agent 5 gate” even when grade is high.

Acceptance signal:
- Human triage no longer interprets high score as pass when gate-fail exists.

## Immediate Next Checks
1. Run a 10-run temporal-axis batch and track only:
   - red-herring overlap hard-fail count,
   - invalid source path count post-retry,
   - missing artifact count.
2. Compare fail rate before/after Phase A+B changes.
3. Freeze prompt changes until observability is clean enough to attribute causality.

## Bottom Line
Agent 5 is failing repeatedly because it is being asked to satisfy partially conflicting objectives under strict deterministic gates, with weakly authoritative model self-audit and imperfect retry observability. The durable fix is to remove contract conflicts, constrain retry rewrites with deterministic lexical bounds, and make runtime validation plus artifact integrity the single source of truth.

## Technical Fix Plan (Implementation-Ready)

### Scope and Non-Goals
1. Scope: stabilize Agent 5 generation and retry convergence for temporal-axis cases first, then generalize to all axes.
2. Scope: improve prompt contracts, deterministic runtime validation, retry payload specificity, and artifact observability.
3. Non-goal: redesign full scoring framework; only gate/report alignment changes needed for clear release-readiness.

### Workstream 1: Prompt Contract Normalization
Target files:
- `packages/prompts-llm/src/agent5-clues.ts`

Changes:
1. Add a requirement-budget resolver:
- Compute `requiredClues.length` and density range.
- If required count exceeds range max, auto-escalate effective density for that run or explicitly allow overrun in prompt with precedence order.
2. Emit a hard precedence block in developer prompt:
- `sourceInCML legality` > `index bounds` > `discriminating ID coverage` > `suspect elimination quality` > `red herring quality` > `optional texture`.
3. Emit a deterministic bounds block from CML:
- `inference_path.steps`: exact 1-based and 0-based ranges.
- `constraint_space.time.anchors`: explicit legal index range.
- `constraint_space.time.contradictions`: explicit legal index range.
- `cast`: explicit name->index map.
4. Add retry-only structured correction payload section:
- `must_fix[]` with exact IDs/paths/phrases.
- `forbidden_terms[]` for red-herring overlap retries.
- `required_replacements[]` with `old -> new` lexical substitutions.

Definition of done:
1. No prompt can simultaneously instruct fewer total clues than mandatory required clues.
2. Retry prompt always includes explicit legal index ranges and cast name->index map.

### Workstream 2: Runtime Deterministic Checks and Retry Guidance
Target files:
- `apps/worker/src/jobs/agents/agent5-run.ts`

Changes:
1. Add deterministic name-path consistency validator:
- For elimination clues mentioning suspect X, validate `sourceInCML` cast index resolves to suspect X when cast path is used.
2. Strengthen retry feedback specificity:
- Include exact invalid paths found.
- Include expected replacement path candidates (or expected index ranges) when possible.
- Include overlap trigger terms/phrases by red-herring ID.
3. Add conflict detector for overlap repair:
- If false-assumption lexicon and correction lexicon intersect heavily, send a narrowed allowed-term list for red-herring text to avoid ambiguous space.
4. Enforce gate-first state marking:
- Persist a release-blocked indicator in run context/report payload whenever Agent 5 hard gate fails, independent of aggregate score.

Definition of done:
1. Retry payload is fully machine-actionable, not category-only.
2. Name-index mismatches are caught as deterministic critical issues.

### Workstream 3: Observability and Artifact Integrity
Target files:
- Prompt artifact writer/logging path used by run capture (`documentation/prompts/actual/*` generation path in worker/api pipeline)

Changes:
1. Make request/response recording atomic per attempt:
- Write request file before model call.
- Write response file and body before marking attempt complete.
- Fail attempt finalization if either side is missing.
2. Normalize attempt numbering:
- No `retryAttempt: 0` synthetic entries for completed attempts.
- Ensure monotonic attempt sequence across retries.
3. Add run-level integrity summary:
- `missing_request_count`
- `missing_response_count`
- `empty_response_body_count`

Definition of done:
1. No response-only record in completed retry chains.
2. Every recorded attempt is reconstructable from artifacts alone.

### Workstream 4: Test Plan
Target files:
- `apps/worker/src/__tests__/agent5-run.test.ts`
- `packages/prompts-llm/__tests__/agent5.test.ts`

Required test additions:
1. Prompt contract tests:
- requirement-budget conflict resolution behavior.
- presence of bounds map and cast name->index map.
- retry payload structure includes `must_fix`, `forbidden_terms`, and replacement directives.
2. Runtime validator tests:
- cast name-index mismatch flagged as critical.
- out-of-range source paths always fail, regardless of model audit fields.
- overlap retry feedback includes triggering phrase evidence.
3. Observability tests:
- simulated missing request or response causes attempt integrity failure.
- attempt numbering monotonicity across retries.

Regression command set:
1. `npm run -w @cml/prompts-llm test -- __tests__/agent5.test.ts`
2. `npm run -w @cml/worker test -- src/__tests__/agent5-run.test.ts`
3. `npm run -w @cml/prompts-llm type-check`
4. `npm run -w @cml/worker build`

### Workstream 5: Rollout Strategy
1. Stage 1 (canary): enable fixes only for temporal-axis cases for 10 runs.
2. Stage 2 (broaden): enable all axes after canary success.
3. Stage 3 (enforce): convert overlap-repair soft diagnostics to hard acceptance thresholds once stability is verified.

Canary success criteria:
1. Red-herring overlap hard-fail rate reduced by at least 80% from current baseline.
2. Invalid source path criticals after final retry reduced to zero.
3. Missing artifact records reduced to zero.

### Risks and Mitigations
1. Risk: stricter overlap constraints reduce red-herring creativity.
Mitigation: keep semantic variety constraints while enforcing forbidden correction phrases only.
2. Risk: density auto-escalation increases token/cost.
Mitigation: only escalate when mandatory requirement count exceeds density max; log delta cost.
3. Risk: tighter validation increases early hard-fail counts short-term.
Mitigation: treat early increase as expected quality surfacing; track convergence over 10-run windows.

### Ownership and Sequencing
1. Prompt contract normalization first (Workstream 1).
2. Runtime deterministic retry guidance second (Workstream 2).
3. Observability integrity third (Workstream 3).
4. Tests and rollout gating integrated throughout (Workstream 4 and 5).

Execution order rationale:
1. Eliminate instruction conflicts first so retries have a solvable objective.
2. Improve deterministic guidance second so retries become corrective.
3. Guarantee observability third so failures are diagnosable if they persist.

## Scoring Assessment (Quality-Test Harmony)

### Current State
1. Agent 5 phase scoring in `apps/worker/src/jobs/agents/agent5-run.ts` currently hardcodes:
- `quality_score: 100`
- `consistency_score: 100`
2. Validation scoring uses only coarse booleans:
- `guardrailTriggered ? 75 : 100`
- `coverageGapsFound ? 75 : 100`
3. Report-level outcomes can show high `overall_score` on aborted runs while `run_outcome=aborted` and `passed=false`.

Implication:
- The score can look excellent even when deterministic gates fail hard.
- This violates the intended harmony principle: good quality should naturally pass good tests, and failing critical tests should materially depress quality score.

### Root Misalignment
1. Score components do not fully price in deterministic critical defects (path invalidity, overlap hard-fail, suspect-coverage hard-fail).
2. Phase quality signals can remain inflated because two dimensions are fixed at 100.
3. Aggregate score combines many strong upstream phases, masking gate-fatal downstream defects.

### Harmony Design Principle
1. Deterministic hard-gate failures must always dominate phase scoring.
2. Quality score must be evidence-driven, not default-constant.
3. A run that fails release-critical tests should not present as high-quality in top-line score.

### Technical Scoring Changes
Target files:
- `apps/worker/src/jobs/agents/agent5-run.ts`
- report generation/gate mapping path in worker where `release_gate_outcome` is populated

Changes:
1. Replace fixed `quality_score: 100` and `consistency_score: 100` with computed metrics:
- `quality_score` derived from residual warning density and overlap severity after final retry.
- `consistency_score` derived from source-path validity, name-index consistency, and audit-consistency agreement.
2. Add hard-gate score cap:
- If any Agent 5 critical gate fails in final state, cap Agent 5 total at <=60 and force `passed=false` for phase score.
3. Add run-level score cap rule:
- If `run_outcome` is `failed|aborted`, cap report-level `scoring_outcome.passed_threshold=false` (already present) and cap displayed quality band so top-line score cannot imply success.
4. Improve release gate clarity:
- Populate `release_gate_outcome.status='failed'` with `hard_stop_count>0` when Agent 5 gate throws, rather than leaving `unknown`.

### Success Criteria For Scoring Harmony
1. No run with Agent 5 hard-gate failure reports `overall_score >= 95` without explicit score-capped signaling.
2. Agent 5 phase score drops materially when deterministic defects persist post-retry.
3. Stakeholders can infer pass/fail correctly from scorecard without reading deep logs.

### Validation Queries
1. Correlate `run_outcome` with score bands over last 50 runs.
2. Measure false-positive quality signal rate:
- `% of failed/aborted runs with score >= threshold`
3. Track post-change reduction in score/outcome contradictions.