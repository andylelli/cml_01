# ANALYSIS_07 - Simplification Plan with Remedial Attention (Recent Runs)

Date: 2026-05-07
Scope: Convert recurring failures from recent runs into a targeted simplification plan that removes avoidable orchestration complexity while preserving fair-play and quality gates.

## Objective

Reduce repeated failure loops and wasted pipeline work by simplifying retry logic, decoupling overloaded agent control paths, and tightening prevention-first contracts where failures recur.

## Recent-Run Signals Requiring Remedial Attention

### Run pattern set (last few analyzed runs)

1. mystery-1778174459488 (ANALYSIS_07)
- Fair-play structural abort before prose.
- Novelty telemetry/scoring mismatch (stage pass message vs scored fail).
- Downstream profile/location/temporal generation continued after unrecoverable fair-play class.
- Zero-story output with non-trivial runtime/cost.

2. mystery-1777806442972 (ANALYSIS_06)
- Agent 9 Chapter 1 generation failed after 4 attempts (required clue-evidence plus immediate inference paragraph not satisfied).
- Repeated Agent 5 clue repair/sanitizer passes and deterministic backfill.
- Residual fair-play parity/uniqueness failures persisted into prose stage.
- Novelty critical similarity signal remained present.

3. run_20f9ca27 family (ANALYSIS_56, ANALYSIS_57)
- Agent 4 required-evidence contract/checklist only partially closed.
- Historical signal of required-evidence missing persisted in canary suggest path.
- Indicates non-trivial residual complexity in Agent 4 correction path and acceptance governance.

4. run_34d713c0 and run_71e31ebd families (ANALYSIS_55, ANALYSIS_54)
- Agent 5 discriminating-test evidence mapping and suspect/elimination coverage failures remained recurrent.

5. run_27958eec and run_970b323c families (ANALYSIS_53, ANALYSIS_52)
- Pre-prose CML integrity contradiction aborts and Agent 9 runtime-level instability.

## Root Simplicity Deficits

1. Retry systems are duplicated and layered across agents with overlapping failure classes.
2. Critical structural checks are spread across Agent 5, Agent 6, Agent 4, and orchestration stages, creating retry cascades.
3. Abort boundaries are late, so non-essential downstream stages can run after hard-fail classes are already known.
4. Telemetry semantics are not strictly unified (status parity drift between progress and scoring outcomes).
5. Agent 9 still carries heavy first-chapter obligation risk that should be caught or constrained earlier.

## Simplification Plan

## Workstream A - Retry and Gate Consolidation (Highest Priority)

Goal: Remove repeated branch complexity and shorten fail loops.

Actions:
1. Introduce one shared retry orchestrator contract for agents that currently duplicate validation/scoring/schema retry patterns.
2. Replace serial micro-gates with one phase-level composite gate per phase (with sub-check details but one retry decision).
3. Bound each phase to a single bundled remediation cycle unless a structural class explicitly requires upstream revision.

Remedial attention targets:
- Agent 5 and Agent 6 repeated clue/fair-play retry ladders.
- Agent 2x profile/context variants with near-identical retry wrappers.

Acceptance criteria:
- 30%+ reduction in retry-branch count across Agent 2x/5/6 code paths.
- No more than one bundled retry cycle for clue/fair-play before explicit escalate-or-abort decision.

## Workstream B - Early Abort and Cost Containment

Goal: Stop expensive work once unrecoverable structural classes are confirmed.

Actions:
1. Move hard-stop boundary immediately after structural fair-play classification failure.
2. Declare non-essential downstream stages skipped with explicit reason codes.
3. Add run accounting fields for "avoidable downstream cost prevented".

Remedial attention targets:
- mystery-1778174459488 downstream work after critical persistence.
- Similar future zero-output runs with high runtime/cost.

Acceptance criteria:
- For structural fair-play hard-fail class, no profile/location/temporal or later stages execute.
- 0 runs with total words = 0 and avoidable downstream stages executed after hard-fail classification.

## Workstream C - Agent 4 and Agent 5 Structural Contract Closure

Goal: Eliminate repeated required-evidence and discriminating-evidence repair churn.

Actions:
1. Finalize Agent 4 required-evidence checklist closure items as hard acceptance conditions.
2. Shift Agent 5 discriminating-test evidence ID and step-coverage obligations to first-pass strict contract with deterministic pre-commit verifier.
3. Reduce post-hoc clue synthesis to minimum safety-only backstop, not primary recovery strategy.

Remedial attention targets:
- ANALYSIS_57 open checklist items.
- ANALYSIS_55/54 recurring evidence mapping and suspect coverage failures.

Acceptance criteria:
- Required-evidence checklist reaches full DONE state in one verified replay.
- 2 consecutive canary runs without discriminating-test evidence ID backfill warnings.
- 2 consecutive canary runs without strict-step fallback synthetic clue insertion.

## Workstream D - Agent 9 First-Chapter Reliability

Goal: Prevent Chapter 1 hard abort class seen in recent runs.

Actions:
1. Enforce pre-generation obligation checklist for Chapter 1 (required clue observation + immediate inference paragraph) before finalizing batch output.
2. Add deterministic preflight validator using outline + clue obligations before prose generation starts.
3. Add targeted regression fixture for the exact Chapter 1 failure class from mystery-1777806442972.

Remedial attention targets:
- ANALYSIS_06 Chapter 1 retry exhaustion.
- Previous Agent 9 runtime instability class (ANALYSIS_52).

Acceptance criteria:
- No Chapter 1 aborts for missing required clue observation/inference pattern over 3 consecutive core runs.
- Agent 9 retries reduce for Chapter 1 by at least 40% from baseline sample.

## Workstream E - Status Parity and Telemetry Governance

Goal: Ensure operational decisions rely on one coherent truth model.

Actions:
1. Define canonical phase outcome contract (pass/warn/fail/aborted) with one authoritative source.
2. Validate progress-event messages against scored/reported outcomes before persistence.
3. Add parity regression tests for novelty and fair-play status signaling.

Remedial attention targets:
- Novelty pass-message vs scored-fail mismatch seen in mystery-1778174459488.

Acceptance criteria:
- 0 parity mismatches between stage progress and scored/report outcomes in regression suite.
- Report invariant checks fail fast on contradictory status payloads.

## Delivery Sequence (Recommended)

### Phase 0 (Immediate containment, 1-2 days)
1. Early hard-stop after structural fair-play failure.
2. Status-parity guard for novelty and fair-play outputs.
3. Add run-level skip reason logging for non-executed downstream stages.

### Phase 1 (Structural simplification, 3-5 days)
1. Shared retry orchestrator rollout for Agent 2x, Agent 5, Agent 6.
2. Composite phase gates replacing serial micro-gates.
3. Agent 4 required-evidence acceptance closure.

### Phase 2 (Reliability hardening, 5-10 days)
1. Agent 5 first-pass strict coverage verifier + minimized synthesis fallback.
2. Agent 9 Chapter 1 preflight obligation validator and regression fixtures.
3. Full core canary validation runs and before/after retry/cost delta report.

## Success Metrics

1. Abort efficiency
- No post-hard-fail downstream stage execution in structural fair-play failure class.

2. Retry complexity
- 30%+ reduction in aggregate retry branches in targeted agents.

3. Signal integrity
- 0 telemetry/status parity mismatches in CI regression checks.

4. Fair-play stability
- 2 consecutive core runs with no critical fair-play violations after retry budget.

5. Prose reliability
- 3 consecutive core runs with successful Chapter 1 completion and no required-clue-obligation abort.

## Risks and Controls

1. Risk: Over-simplifying may remove useful recovery paths.
- Control: Keep one bounded bundled remediation cycle and explicit escalation classes.

2. Risk: Contract hardening may increase immediate fail rate before quality improves.
- Control: Track fail-rate plus avoidable-cost metric together; accept short-term fail increase if wasted downstream work drops.

3. Risk: Decoupling embedded control paths may temporarily reduce adaptation quality.
- Control: Roll out behind canary flags and compare A/B run outcomes before full adoption.

## Final Recommendation

Prioritize simplification where recent runs show repeated pain:
1. Early abort boundary (stop avoidable work),
2. Agent 4/5 structural contract closure (stop evidence/backfill churn),
3. Agent 9 first-chapter reliability guard (stop zero-output abort class),
4. Status parity governance (stop misleading operations signals).

These four changes deliver the fastest reduction in failure churn and cost while maintaining strict fair-play guarantees.
