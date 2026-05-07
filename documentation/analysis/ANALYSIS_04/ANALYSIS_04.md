# ANALYSIS_04 - Generic Prompt Hardening and Deterministic Contracts

Date: 2026-04-25  
Scope: Explain the failure class, define how prompt templates should become generic, and specify what must be deterministic.

## 1) Executive Summary

The recent failures were not primarily caused by a missing v6 prompt template. The core guardrails were present, but outcomes still failed because the system depended on non-deterministic clue realization quality. In short: prompt quality was necessary but not sufficient.

The fix direction is to separate concerns:
1. Keep one generic, reusable prompt template per agent responsibility.
2. Move strict correctness requirements into deterministic contracts that are validated before and after model calls.
3. Use retries only to repair specific contract violations, not to re-negotiate the whole mystery logic.

## 2) What The Actual Issue Is

## 2.1 Not a simple template-missing bug

The failing runs already included the major v6-style clauses. That means this failure class cannot be solved by repeating or slightly rewording instruction text.

## 2.2 Core failure mechanism

The recurring failure pattern is:
1. LLM returns clues that are format-valid but semantically weak for fair-play proof.
2. Coverage is patchy across inference steps, timing, and parity.
3. Retry prompts become larger and more corrective, but still rely on LLM interpretation.
4. Final audit still fails structural rules (Clue Visibility, Logical Deducibility, No Withholding).
5. Pre-prose gate correctly aborts.

## 2.3 Why this keeps recurring

There is a contract placement problem:
- Critical proof constraints are still partially encoded as natural-language instructions.
- Natural-language constraints are interpreted probabilistically.
- Structural fair-play pass requires deterministic satisfiability, not probabilistic compliance.

Bottom line: the prompt is good guidance, but the architecture still asks the model to decide too much of what should be machine-checked invariants.

## 3) How The Prompt Should Change To Be More Generic

## 3.1 Split template into invariant core + runtime contract block

Use a stable generic template with placeholders, not case-specific wording.

Template layers:
1. Role and objective (stable, reusable).
2. Output schema and allowed operations (stable, reusable).
3. Runtime contract block (injected deterministic policy and per-run mappings).
4. Case payload (CML facts only, no policy).

This removes overfitting to one run while keeping strictness.

## 3.2 Convert "advice" wording into explicit protocol

The generic prompt should require the model to follow protocol semantics, for example:
1. Use only provided `allowed_source_paths`.
2. Satisfy required ID-to-source mappings exactly.
3. Meet per-step evidence floors.
4. If any requirement cannot be met, return `CONTRACT_UNSATISFIED` with violation codes.

This avoids silent degradation and forces explicit failure signaling.

## 3.3 Separate generation from remediation

Do not mix first-pass generation and complex remediation in one monolithic instruction block.

Recommended pattern:
1. First pass template: produce best valid clue graph under strict contracts.
2. Retry template: apply only targeted deltas from deterministic violation codes.

This keeps retry behavior generic and controlled.

## 3.4 Keep language generic, keep constraints typed

Generic language examples:
- "Maintain reader-visible pre-test evidence parity with detective reasoning."
- "Do not output any clue derived from audit prose or violation narrative text."

Typed constraints should carry the specificity, not prose:
- arrays of allowed source paths
- required clue IDs
- required step coverage entries
- placement floors (early/mid/late)

## 4) What Must Be Deterministic (Non-Negotiable)

The following must not depend on model judgment.

## 4.1 Source legality and identity

1. Source path whitelist enforcement.
2. Required ID-to-source mapping enforcement.
3. Rejection of unknown IDs or unknown roots.

## 4.2 Inference-path coverage

1. Each required inference step must have minimum clue coverage.
2. Required contradiction chain coverage must be present.
3. Required elimination/discriminating evidence must be present before test resolution.

## 4.3 Temporal and parity guarantees

1. Pre-test reader visibility for mechanism-critical clues.
2. No detective-only knowledge dependencies.
3. No withholding of decisive facts used in final deduction.

## 4.4 Output shape and normalization

1. Strict JSON schema validation.
2. Deterministic ID normalization rules.
3. Deterministic duplicate and overlap handling.

## 4.5 Retry control

1. Retry triggers must come from machine-readable violation codes.
2. Retry patch scope must be bounded (do not regenerate entire clue set unless explicitly required).
3. Max retry budget and fail-fast behavior must remain deterministic.

## 5) Deterministic Pre/Post Gates To Add or Strengthen

## 5.1 Pre-LLM gate (before Agent5 call)

Build and validate contract payload:
1. `allowed_source_paths`
2. `required_id_to_source_mappings`
3. `required_step_coverage_floors`
4. `required_discriminating_evidence`
5. `placement_floors`

Fail immediately if contract payload is incomplete or contradictory.

## 5.2 Post-LLM gate (after Agent5 response, before Agent6 audit)

Validate returned clues deterministically:
1. path legality
2. mapping compliance
3. step coverage
4. timing/parity prerequisites
5. no meta-audit clue text

If fail, produce a targeted retry plan from violation codes.

## 5.3 Orchestrator gate (already strict, keep it)

Retain structural hard-stop semantics for:
1. Clue Visibility
2. Logical Deducibility
3. No Withholding

This remains correct and should not be softened.

## 6) Generic Template Contract Sketch

```text
SYSTEM: You generate fair-play clue sets from validated CML facts.

DEVELOPER:
- Allowed operations: create/update clues only.
- Forbidden operations: invent facts, use non-whitelisted paths, emit meta-audit prose.
- Required deterministic contracts:
  - allowed_source_paths = [...]
  - required_id_to_source_mappings = [...]
  - required_step_coverage_floors = [...]
  - required_discriminating_evidence = [...]
  - required_placement_floors = {...}
- If unsatisfied, return CONTRACT_UNSATISFIED + violation codes only.

USER:
- Case payload (CML excerpt, cast facts, inference path, clue budget).
- Emit JSON matching schema X.
```

## 7) Implementation Priority (Decisive Sequence)

1. Promote strict contract fields into production prompt builder and worker payload wiring for first pass and retry.
2. Add deterministic pre/post validators as hard gates around Agent5.
3. Ensure retry planner is violation-code driven and bounded.
4. Keep Agent6 for auditing stable outputs, not as primary structural repair mechanism.
5. Preserve report/telemetry parity so pass/fail reasons are traceable.

## 8) Definition Of Done

Done means production runs (without replay prompt files) achieve:
1. deterministic contract pass on first attempt for stable scenarios,
2. zero meta-audit clue synthesis,
3. materially reduced structural fair-play abort rate,
4. unchanged hard-stop safety semantics,
5. consistent JSON + markdown telemetry reporting of violations and remediation.

## 9) Final Position

The prompt template is directionally good, but it is currently overburdened. Make the template generic and reusable, then move structural correctness into deterministic contracts and validators. That is the durable fix for this failure class.
