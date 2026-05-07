# ANALYSIS_02 - Requested Checklist and Subsequent Issue

Date: 2026-04-24
Scope: User-provided Agent 4/Agent 6 hardening checklist and the latest subsequent issue.

## 1) Requested Checklist (as provided)

1. Lock the target failure contract in agent4-revision.ts.
- Deliverable: add a dedicated required-evidence-missing prompt branch with explicit output invariants for inference_path steps.
- Pass criteria: prompt branch exists and is selected when validationErrors contain required_evidence missing signals.

2. Add hard structural invariants directly in the Agent 4 prompt body in agent4-revision.ts.
- Deliverable: clear rules that every inference step must retain required_evidence, with 2 to 4 concrete entries, and no abstract placeholders.
- Pass criteria: invariants are explicit and unambiguous in prompt text, not implied.

3. Add a mandatory self-check block before output in agent4-revision.ts.
- Deliverable: internal checklist instruction requiring the model to verify each step has required_evidence before emitting final JSON.
- Pass criteria: self-check explicitly references all inference_path steps and required_evidence cardinality.

4. Tighten non-negotiable output format constraints in agent4-revision.ts.
- Deliverable: "full corrected document only", "no partial output", "no field omission for brevity", "JSON only".
- Pass criteria: prompt contains these exact constraints in one dedicated output contract section.

5. Add prompt contract tests alongside existing prompt tests near agent5-clues.test.ts and agent6-fairplay.test.ts.
- Deliverable: new Agent 4 prompt tests with exact test names:
  - agent4 prompt includes required-evidence hard invariants
  - agent4 prompt includes pre-output required-evidence self-check
  - agent4 prompt forbids abstract required-evidence placeholders
- Pass criteria: all 3 tests fail before prompt changes and pass after.

6. Add first-attempt behavior test for Agent 4 revision loop near agent4-revision.ts.
- Deliverable: test fixture matching historical failure pattern from 13_Agent4-Revision_retry1_request.md:45.
- Pass criteria: revised CML validates with attempt equal to 1 and no required_evidence missing errors.

7. Replay canary in non-apply mode for Agent 6 boundary path and verify signature disappearance.
- Deliverable: run suggest mode replay against the same run family used in canary-ledger-2026-04-24T16-18-52-run_20f9ca27-9933-4c85-bb51-9146f093c292-Agent6-FairPlay.md.
- Pass criteria: no cml.required_evidence_missing signature on first revision cycle.

8. Add a regression gate in canary test coverage for this class in sprint3-regressions.test.mjs.
- Deliverable: assertion that required-evidence-missing class maps to prompt-hardening playbook and is expected to be prevented by first-pass Agent 4 prompt contract.
- Pass criteria: regression test passes and fails if playbook or class mapping drifts.

9. Update behavior docs so runtime and prompt policy stay aligned in 05_llm_ai.md and 07_workflow.md.
- Deliverable: short section stating first-pass required_evidence contract and "retry is fallback, not normal path".
- Pass criteria: docs explicitly match implemented prompt contract language.

10. Final acceptance gate.
- Deliverable: one summary report with:
  - targeted prompt tests green
  - Agent 4 first-attempt test green
  - suggest-mode replay green without cml.required_evidence_missing
- Pass criteria: all three green in one run; otherwise do not mark fixed.

## 2) Subsequent Issue (Latest)

Issue: agent5.time_style_violation became the latest terminal signature in apply-mode canary loop execution.

Evidence:
- logs/canary-loops/canary-loop-260424-1634/canary-ledger-2026-04-24T16-34-11-run_20f9ca27-9933-4c85-bb51-9146f093c292-Agent6-FairPlay.md
- Iteration 1 terminal classification reports:
  - input signature: agent5.time_style_violation
  - decision: stop
  - stop reason: Reached max iterations (1)

Related note:
- The suggest-mode replay still showed cml.required_evidence_missing in the planning/classification cycle for the same run family.
