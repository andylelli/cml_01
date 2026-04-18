# Canary Loop Ledger

## Iteration 1
- timestamp: `2026-04-16T19:49:15.676Z`
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
  - Cache applied: cache-hit:Agent5-ClueExtraction|cml.required_evidence_missing|llm_output_shape.
- retry packet must_fix: 1
- retry packet warnings_to_clear: 0

## Iteration 2
- timestamp: `2026-04-16T19:54:22.194Z`
- input signature: `agent5.red_herring_overlap`
- confidence: `0.95`
- decision: `continue`
- planned actions:
  - Classified failure as agent5.red_herring_overlap (error) at stage clues.
  - Root cause hypothesis (prompt_contract): Prompt contract and retry constraints for clue extraction are underspecified for this failure class.
  - Selected playbook(s): pb.prompt.red-herring-lexical-separation
  - Must-fix count: 1
  - Escalation stage: prompt.
  - Selection rationale: No compatible code-mode playbook for signature class.
- retry packet must_fix: 1
- retry packet warnings_to_clear: 0

## Iteration 3
- timestamp: `2026-04-16T19:59:20.953Z`
- input signature: `agent5.red_herring_overlap`
- confidence: `0.95`
- decision: `continue`
- planned actions:
  - Classified failure as agent5.red_herring_overlap (error) at stage clues.
  - Root cause hypothesis (prompt_contract): Prompt contract and retry constraints for clue extraction are underspecified for this failure class.
  - Selected playbook(s): pb.prompt.red-herring-lexical-separation
  - Must-fix count: 1
  - Escalation stage: prompt.
  - Selection rationale: No compatible code-mode playbook for signature class.
  - Cache applied: cache-hit:Agent5-ClueExtraction|agent5.red_herring_overlap|prompt_contract.
- retry packet must_fix: 1
- retry packet warnings_to_clear: 0

## Iteration 4
- timestamp: `2026-04-16T20:04:21.585Z`
- input signature: `agent5.time_style_violation`
- confidence: `0.75`
- decision: `continue`
- planned actions:
  - Classified failure as agent5.time_style_violation (warning) at stage clues.
  - Root cause hypothesis (prompt_contract): Prompt contract and retry constraints for clue extraction are underspecified for this failure class.
  - Selected playbook(s): pb.prompt.retry-packet-contract-harden
  - Warnings-to-clear count: 1
  - Escalation stage: prompt.
  - Selection rationale: Prompt-first policy active: run prompt-mode remediation before deterministic code fallback.
  - Cache applied: cache-hit:Agent5-ClueExtraction|agent5.time_style_violation|prompt_contract.
- retry packet must_fix: 0
- retry packet warnings_to_clear: 1

