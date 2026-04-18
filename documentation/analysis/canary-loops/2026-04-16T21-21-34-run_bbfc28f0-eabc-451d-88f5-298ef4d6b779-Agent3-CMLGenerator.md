# Canary Loop Ledger

## Iteration 1
- timestamp: `2026-04-16T21:27:07.803Z`
- input signature: `cml.required_evidence_missing`
- confidence: `0.88`
- decision: `continue`
- planned actions:
  - Classified failure as cml.required_evidence_missing (error) at stage cml-revision.
  - Root cause hypothesis (llm_output_shape): CML output shape constraints are not enforced strongly enough before downstream validation.
  - Selected playbook(s): pb.prompt.retry-packet-contract-harden
  - Must-fix count: 1
  - Escalation stage: prompt.
  - Selection rationale: Prompt-first policy active: run prompt-mode remediation before deterministic code fallback.
  - Cache applied: cache-hit:Agent3-CMLGenerator|cml.required_evidence_missing|llm_output_shape.
- retry packet must_fix: 1
- retry packet warnings_to_clear: 0

## Iteration 2
- timestamp: `2026-04-16T21:32:46.578Z`
- input signature: `agent5.time_style_violation`
- confidence: `0.75`
- decision: `stop`
- stop reason: New higher-severity failure class detected (agent5.time_style_violation -> agent5.red_herring_overlap).
- planned actions:
  - Classified failure as agent5.time_style_violation (warning) at stage clues.
  - Root cause hypothesis (prompt_contract): Prompt contract and retry constraints for clue extraction are underspecified for this failure class.
  - Selected playbook(s): pb.prompt.retry-packet-contract-harden
  - Warnings-to-clear count: 1
  - Escalation stage: prompt.
  - Selection rationale: Prompt-first policy active: run prompt-mode remediation before deterministic code fallback.
- retry packet must_fix: 0
- retry packet warnings_to_clear: 1

