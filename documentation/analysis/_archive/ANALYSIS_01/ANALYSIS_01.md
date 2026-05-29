# ANALYSIS_01 - Canary Agent6 Loop Failures (Last Runs)

Date: 2026-04-20
Scope: Last three Agent6 canary loop runs
- `logs/canary-loops/canary-loop-260420-1332`
- `logs/canary-loops/canary-loop-260420-1302`
- `logs/canary-loops/canary-loop-260420-1256`

## 1) Issues Observed

1. Loop non-convergence at iteration cap.
- Run `canary-loop-260420-1332` reached max iterations (12) with no stable resolution.
- Run `canary-loop-260420-1302` also reached max iterations (12).

2. Signature oscillation instead of monotonic progress.
- Frequent switching among:
  - `agent5.red_herring_overlap`
  - `agent6.fairplay_structural_critical`
  - `canary.execution_failure`
  - `agent5.discriminating_id_coverage`
- Oscillation is visible in `canary-attempt-history.md` for `260420-1332`.

3. Recurrent fallback/generalized failure classes.
- `canary.execution_failure` appears as terminal class in the newest run.
- `unknown.pipeline_failure` appears intermittently in `260420-1302`.

4. High warning volume and repeated patch attempts.
- `260420-1332` reports `warningTotal: 156` with `12` changed-file attempts.
- Indicates repeated adaptation without sustained stabilization.

## 2) Evidence Summary

### Run: `canary-loop-260420-1256`
- 2 iterations.
- `cml.required_evidence_missing -> agent6.fairplay_structural_critical -> canary.execution_failure`.
- Early signal that fixing CML evidence only was insufficient to stabilize Agent6 path.

### Run: `canary-loop-260420-1302`
- 12 iterations, stop at max iterations.
- Dominant class: `agent6.fairplay_structural_critical` with periodic `unknown.pipeline_failure`.
- Playbook repeatedly applied: `pb.code.agent6.structural-escalation-and-null-guard`.

### Run: `canary-loop-260420-1332`
- 12 iterations, stop at max iterations.
- New mixed pattern: Agent5 and Agent6 signatures alternate.
- Sequence includes:
  - `cml.required_evidence_missing -> agent5.red_herring_overlap`
  - repeated `agent5.red_herring_overlap`
  - intermittent `agent6.fairplay_structural_critical`
  - `agent5.discriminating_id_coverage`
  - terminal `canary.execution_failure`

## 3) Analysis

1. The system moved from a mostly Agent6-structural failure mode (`1302`) into a cross-agent oscillation mode (`1332`).
- This is a partial improvement in breadth of reachable states, but not convergence.

2. Playbook application is active but not producing durable state transitions.
- Prompt-side red-herring separation and retry packet hardening are repeatedly triggered.
- Resulting outputs re-enter adjacent failure classes instead of closing violations.

3. Deterministic success exists outside loop pressure.
- A direct boundary run (`node scripts/canary-agent-boundary.mjs --agent 6 ...`) succeeded with `CANARY_FORCE_FRESH_UPSTREAM=true`.
- This indicates that core boundary execution can succeed, while loop orchestration remains unstable under iterative mutation and classification.

## 4) Root Cause

Primary root cause:
- Iterative remediation is under-constrained at the Agent5 <-> Agent6 seam, causing remediation churn rather than invariant-preserving progression.

Contributing causes:
1. Upstream hydration lineage fragility (historical prompt artifacts vs. fresh synthesis) increased variance in loop behavior.
2. Agent5 red-herring and discriminating-ID constraints are not enforced as strict postconditions, allowing regressions between iterations.
3. Canary terminal classes (`canary.execution_failure`, `unknown.pipeline_failure`) are too generic, reducing targeted fix precision.

## 5) Solution / Fix Plan

## 5.1 Already Implemented

1. Fresh upstream synthesis switch in boundary runner:
- `CANARY_FORCE_FRESH_UPSTREAM=true`
- Prevents stale prompt-run hydration by regenerating upstream context from current code.
- Implemented in `scripts/canary-agent-boundary.mjs`.

2. CML required-evidence auto-repair and revalidation:
- Implemented in `apps/worker/src/jobs/agents/agent3-run.ts`.
- Removes one recurring early blocker (`cml.required_evidence_missing`).

## 5.2 Next High-Impact Fixes (Prevention > Cure)

1. Add hard postcondition gates for Agent5 outputs before Agent6 invocation.
- Block handoff unless:
  - red-herring lexical overlap score is below strict threshold,
  - discriminating-test evidence IDs are complete and resolvable,
  - clue-to-inference traceability is complete.
- On failure, perform in-agent deterministic repair pass (not loop-level prompt retries only).

2. Introduce invariant snapshot checks across iterations.
- Persist normalized metrics each iteration:
  - overlap score,
  - ID coverage ratio,
  - fair-play violation count by type.
- Reject edits that worsen any critical metric unless offset by a stronger improvement rule.

3. Decompose generic execution signatures.
- Replace `canary.execution_failure` / `unknown.pipeline_failure` with stage-specific machine-readable reason codes.
- Enables deterministic playbook targeting and avoids retry packet overuse.

4. Add convergence stop policy based on oscillation detection.
- Detect repeating signature cycles (A->B->A or A->B->C->A).
- Auto-escalate to structural repair mode instead of continuing broad prompt mutations.

5. Run discipline for reproducibility.
- Rebuild worker before loop runs after source edits.
- Keep `CANARY_FORCE_FRESH_UPSTREAM=true` during Agent6 stabilization until hydration source is unified.

## 6) Expected Outcome After Fixes

1. Reduced cross-agent churn between Agent5 and Agent6.
2. Lower warning totals and fewer max-iteration stops.
3. Improved determinism: failures become stage-specific and directly actionable.
4. Higher probability that Agent6 canary loops converge within configured iteration limits.

## 7) Action Checklist

- [ ] Implement Agent5 hard postcondition gate (overlap + ID coverage + traceability).
- [ ] Add structured stage-level failure codes in canary boundary/orchestrator.
- [ ] Add oscillation detector and escalation policy.
- [ ] Rerun Agent6 canary loop with fresh upstream synthesis and compare against `260420-1332` baseline.
- [ ] Accept fix only if convergence improves (not only signature changes).