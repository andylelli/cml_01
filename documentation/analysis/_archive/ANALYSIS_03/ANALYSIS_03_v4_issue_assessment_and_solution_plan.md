# ANALYSIS_03 v4 Issue Assessment And Solution Plan

Date: 2026-04-24  
Scope: Assessment of current Agent5 harness replay failures after prompt v4 hardening, plus an implementation plan.

## 1) Current State Snapshot

Latest replay artifact:
- apps/worker/logs/agent5-template-populated-last-run-v4.json

Outcome:
- pass=false
- guardrailsCritical=false
- deterministicError=yes
- coverageCritical=0

Interpretation:
- We are close. Hard critical coverage failures are cleared.
- The remaining pass blocker is deterministic source-path legality.
- Secondary quality gaps remain in non-critical coverage warnings.

## 2) Individual Issue Assessment

### Issue 1: Deterministic source-path gate failure (blocking)
Observed:
- Agent 5 source-path gate failed with 3 invalid source path(s).

Invalid paths emitted:
1. CASE.inference_path.steps[1].mechanism
2. CASE.inference_path.steps[1].elimination
3. CASE.inference_path.steps[2].elimination

Root cause:
- These paths are not in the allowed pattern list and do not resolve in CML.
- The model is inventing semantic leaf names that look plausible but are illegal.

Impact:
- Hard fail (pass=false), regardless of other check improvements.

Remediation:
1. In prompt, replace broad source-path guidance with an explicit legal leaf shortlist for this run.
2. Require sourceInCML to be selected from that shortlist only.
3. Add explicit mapping examples from each clue type to legal leaf paths.
4. Add fail-fast instruction: if no legal leaf exists, keep status fail but still choose nearest legal source path instead of inventing one.

Verification target:
- deterministicContracts.passed=true
- source-path invalid count = 0

---

### Issue 2: Step 3 contradiction coverage warning (non-critical)
Observed:
- Inference step 3 has no contradiction clue.

Root cause:
- Model used supportsInferenceStep=2 heavily; step 3 did not receive mapped contradiction evidence.

Impact:
- Non-critical warning now, but indicates brittle deductive completeness.

Remediation:
1. Add mandatory clue slot: one contradiction clue with supportsInferenceStep=3.
2. Bind that clue to a legal step-3 correction/required_evidence path.
3. Add self-check line: each step must contain at least one contradiction clue by supportsInferenceStep.

Verification target:
- allIssues no longer includes step-3 contradiction missing.

---

### Issue 3: Step 3 mapped clue count warning (non-critical)
Observed:
- Inference step 3 has only 0 mapped clue(s).

Root cause:
- supportsInferenceStep assignments did not cover step 3.

Impact:
- Non-critical currently, but indicates model is not distributing clues across inference path as intended.

Remediation:
1. Add step allocation table in prompt:
- Step 1 minimum mapped clues
- Step 2 minimum mapped clues
- Step 3 minimum mapped clues
2. Require at least one observation and one contradiction mapped to step 3.
3. Add self-check for step-level mapped counts before output.

Verification target:
- step 3 mapped clue count >= 1.

---

### Issue 4: Yvette elimination/alibi parity warning (non-critical)
Observed:
- 1 suspect (Yvette Brabazon) referenced but lacks elimination/alibi evidence.

Root cause:
- Yvette appears in elimination text, but source path and/or evidence typing do not satisfy suspect parity logic.

Impact:
- Non-critical warning now; still reduces confidence in elimination chain quality.

Remediation:
1. Add dedicated Yvette elimination clue requirement:
- evidenceType=elimination
- suspect explicitly named in description and pointsTo
- legal sourceInCML from Yvette cast/alibi evidence fields.
2. Include corroborator/time-window phrasing in pointsTo.

Verification target:
- no weak elimination/suspect parity warnings for Yvette.

---

### Issue 5: Late clue minimum warning (non-blocking)
Observed:
- Late clue count 0 is below preferred minimum 1.

Root cause:
- Model prioritized essential early/mid contracts and omitted optional late clue.

Impact:
- Warning only; not currently a blocker.

Remediation:
1. Add one optional late clue slot with non-essential criticality.
2. Explicitly forbid late placement for essential clues.

Verification target:
- late clue warning cleared without harming structural constraints.

## 3) What Improved From v3 To v4

1. clueCount improved from 11 to 12.
2. invalid source paths dropped from 11 to 3.
3. guardrails critical issues dropped from true to false.
4. coverage critical issues dropped from non-empty to empty.

Conclusion:
- v4 is directionally successful. Remaining work is concentrated and actionable.

## 4) Solution Plan

## Phase 1: LLM-Only v5 Contract Tightening (Primary)

Goal:
- Eliminate final deterministic source-path failures and clear residual non-critical coverage warnings.

Actions:
1. Add explicit legal source leaf shortlist for this run inside populated prompt.
2. Add clue-to-source mapping table:
- mechanism visibility clue -> legal step observation/correction path
- elimination clues -> legal CASE.cast[N].alibi_window or evidence_sensitivity path
3. Add step-quota table:
- Step 1 mapped >= 1 and contradiction >= 1
- Step 2 mapped >= 1 and contradiction >= 1
- Step 3 mapped >= 1 and contradiction >= 1
4. Add explicit discriminating ID exactness table:
- clue_1, clue_2, clue_3 must appear exactly.
5. Add full object schema reminder directly before output section.
6. Keep anti-collapse rule (status fail allowed, but clues non-empty).

Deliverables:
- ANALYSIS_03_perfect_llm_prompt_for_pass_v5.md
- ANALYSIS_03_perfect_llm_prompt_for_pass_populated_last_run_v5.md

Success criteria:
- deterministic error removed
- pass=true (or pass=false only for non-deterministic reasons)

## Phase 2: Replay Verification

Goal:
- Validate that v5 prompt resolves current blockers under live LLM conditions.

Command pattern:
- npm run -w @cml/worker harness:agent5:direct -- --cml <cml> --promptFile <v5-populated> --runId <new-id> --projectId <project> --out <artifact>

Checks to extract:
1. checks.deterministicContracts.passed
2. checks.coverageSnapshot.criticalIssues
3. checks.coverageSnapshot.allIssues
4. checks.guardrails.hasCriticalIssues
5. pass

## Phase 3: Escalation (Only If v5 Still Fails)

Goal:
- Add minimal deterministic fallback protections if LLM-only convergence stalls.

Escalation options:
1. Add strict source-path picker utility in runtime (nearest legal leaf substitution).
2. Auto-map missing step contradictions when evidence text matches correction anchors.
3. Auto-fill weak elimination parity for referenced non-culprit suspects.

Note:
- This phase is optional and should only be used if v5 cannot clear deterministic failures.

## 5) Priority Order

1. Fix Issue 1 (source-path legality) - hard blocker.
2. Fix Issue 2 and Issue 3 (step 3 contradiction/mapping) - quality and robustness.
3. Fix Issue 4 (Yvette parity) - elimination completeness.
4. Fix Issue 5 (late clue) - cosmetic warning cleanup.

## 6) Definition Of Done

Done when a replay run with v5 shows:
1. deterministicContracts.passed = true
2. source-path invalid count = 0
3. coverageSnapshot.criticalIssues = []
4. no step 3 contradiction/mapping warnings
5. no Yvette elimination parity warning
6. pass = true

## 7) Validation Results (Executed)

Validated run:
- Artifact: apps/worker/logs/agent5-template-populated-last-run-v5.json
- Run ID: template_populated_last_run_v5_20260424

Observed outcome:
- pass=true
- deterministicContracts.passed=true
- coverageSnapshot.criticalIssues=[]
- coverageSnapshot.allIssues=[]
- guardrails.hasCriticalIssues=false

Issue-by-issue validation status:

### Issue 1: Deterministic source-path gate failure
Status: Resolved

Evidence:
- deterministicContracts.passed=true
- no source-path error emitted

### Issue 2: Step 3 contradiction coverage warning
Status: Resolved

Evidence:
- coverageSnapshot.allIssues=[]

### Issue 3: Step 3 mapped clue count warning
Status: Resolved

Evidence:
- coverageSnapshot.allIssues=[]

### Issue 4: Yvette elimination/alibi parity warning
Status: Resolved

Evidence:
- coverageSnapshot.allIssues=[]

### Issue 5: Late clue minimum warning
Status: Not fully resolved (warning persists)

Evidence:
- guardrails issue remains: "Late clue count 0 is below preferred minimum 1"

Notes:
- This is warning-only and does not block pass.
- Deterministic warnings include one auto-synthesis event for culprit direct evidence, indicating residual dependence on runtime repair:
	- "Agent 5 culprit-evidence deterministic synthesis: clue_culprit_direct_1: synthesized direct culprit evidence for Auberon Warenne"

## 8) Final Assessment

The core solution set is validated as effective for blocking failures:
1. Hard blocker removed (deterministic source-path gate).
2. Coverage critical issues cleared.
3. End-to-end pass achieved in live harness replay.

Remaining work is optional quality cleanup only (late clue preference and reducing reliance on deterministic synthesis).

## 9) Warning Remediation Validation (v6)

Validated run:
- Artifact: apps/worker/logs/agent5-template-populated-last-run-v6.json
- Run ID: template_populated_last_run_v6_20260424

Result:
- pass=true
- guardrails.hasCriticalIssues=false
- guardrails.issues=[]
- deterministicContracts.passed=true
- deterministicContracts.warnings=[]
- coverageSnapshot.criticalIssues=[]
- coverageSnapshot.allIssues=[]

Warning-specific outcomes:
1. Late clue warning resolved
- Previously: "Late clue count 0 is below preferred minimum 1"
- v6: late timeline now includes clue_late_texture_1 and guardrails issues are empty.

2. Culprit deterministic synthesis warning resolved
- Previously: "Agent 5 culprit-evidence deterministic synthesis: clue_culprit_direct_1 ..."
- v6: deterministic warnings array is empty, and model output includes clue_culprit_direct_auberon directly.

Conclusion:
- All previously reported warnings are now resolved in the validated v6 replay run.
