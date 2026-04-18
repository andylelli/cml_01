# Canary Loop Ledger

## Iteration 1
- timestamp: `2026-04-18T15:30:29.809Z`
- input signature: `cml.required_evidence_missing`
- confidence: `0.88`
- decision: `pass`
- stop reason: Canary passed with zero unresolved warnings.
- planned actions:
  - Classified failure as cml.required_evidence_missing (error) at stage cml-revision.
  - Root cause hypothesis (llm_output_shape): CML output shape constraints are not enforced strongly enough before downstream validation.
  - Selected playbook(s): pb.prompt.retry-packet-contract-harden
  - Must-fix count: 1
  - Escalation stage: prompt.
  - Selection rationale: Prompt-first policy active: run prompt-mode remediation before deterministic code fallback.
- retry packet must_fix: 1
- retry packet warnings_to_clear: 0

