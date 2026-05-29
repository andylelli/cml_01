# ANALYSIS_03 Agent5 Harness Error Remediation Plan (LLM-Only Scope)

Date: 2026-04-24  
Scope: LLM-contract and prompt remediations only for the direct Agent5 harness replay failures  
Run context: template_populated_last_run_20260424 / run_a2a462c9-9818-4f7d-b7c1-a6b7b41898e4

## 1) Scope Guard

This document intentionally covers only what can be changed in LLM behavior and prompt contracts.

In scope:
- Prompt constraints
- Output schema requirements
- Fail-fast status rules in model instructions
- In-prompt self-audit and generation order

Out of scope for this document:
- Harness/runtime code changes
- File path handling
- BOM-safe JSON parser hardening

## 2) LLM-Changeable Remediation by Failure Item

### Item A: Deterministic source-path gate failure (13 invalid paths)
Observed:
- Agent 5 source-path gate failed with 13 invalid source path(s).

LLM-side cause:
- Clues were emitted without reliable sourceInCML, pointsTo, and supportsInferenceStep fields tied to allowed paths.

LLM remediation:
1. Make clue object fields mandatory and non-empty:
- sourceInCML
- pointsTo
- supportsInferenceStep
2. Enforce source legality in prompt:
- sourceInCML must exactly match one entry from VALID_SOURCE_PATHS.
3. Add fail-fast model rule:
- If any clue lacks required fields or has illegal sourceInCML, output status="fail".

Prompt addition:
- Every clue must include sourceInCML, pointsTo, and supportsInferenceStep.
- sourceInCML must be copied exactly from VALID_SOURCE_PATHS, character-for-character.
- If any clue cannot be grounded to an allowed path, do not guess; set status="fail" and list it under audit.invalidSourcePaths.

---

### Item B: No contradiction clue coverage for inference steps 1, 2, 3
Observed:
- Inference step 1 has no contradiction clue
- Inference step 2 has no contradiction clue
- Inference step 3 has no contradiction clue

LLM-side cause:
- Contradiction clues were not explicitly bound per step in a way the downstream checks recognize.

LLM remediation:
1. Require one contradiction clue per inference step in this scenario.
2. Require supportsInferenceStep alignment:
- Step 1 contradiction must set supportsInferenceStep=1
- Step 2 contradiction must set supportsInferenceStep=2
- Step 3 contradiction must set supportsInferenceStep=3
3. Require contradiction source anchoring:
- Prefer CASE.inference_path.steps[N].correction when available.

Prompt addition:
- For each inference step N in [1..3], include at least one contradiction clue mapped to step N.
- Do not claim contradiction coverage without both supportsInferenceStep and sourceInCML present.

---

### Item C: 0 mapped clues for inference steps 1, 2, 3
Observed:
- Inference step 1 has only 0 mapped clue(s)
- Inference step 2 has only 0 mapped clue(s)
- Inference step 3 has only 0 mapped clue(s)

LLM-side cause:
- Mapping fields were absent or not internally consistent.

LLM remediation:
1. Add per-step mapping quota in prompt:
- At least one mapped clue per inference step.
2. Enforce field consistency:
- supportsInferenceStep must match sourceInCML step index.
3. Require model-side self-check before final output.

Prompt addition:
- Self-check: every inference step has >=1 clue with matching supportsInferenceStep and sourceInCML.
- If self-check fails, status must be fail.

---

### Item D: Suspect reference without elimination/alibi evidence
Observed:
- 1 suspect (Alison Waldegrave) referenced without elimination/alibi evidence.

LLM-side cause:
- Suspect mention appeared without paired elimination clue grounded to corroborated evidence.

LLM remediation:
1. Add suspect parity rule:
- Any referenced non-culprit suspect must have at least one elimination clue.
2. Make elimination clue structure strict:
- pointsTo must explicitly state elimination logic
- sourceInCML must point to valid cast/alibi evidence path
3. Add fail-fast rule for parity gaps.

Prompt addition:
- If a non-culprit is named anywhere in clues, include elimination evidence for that suspect or mark status="fail".

---

### Item E: Guardrail warning for no late clue
Observed:
- Late clue count 0 is below preferred minimum 1.

LLM-side cause:
- Model concentrated all clues in early/mid placements.

LLM remediation:
1. Preserve essential early/mid constraint.
2. Add one late supporting or optional clue only.
3. Explicitly forbid late essential clues.

Prompt addition:
- Include exactly one late clue with criticality=supporting or optional.
- Essential clues remain early or mid only.

---

### Item F: Model status said pass despite downstream failure
Observed:
- Model returned status=pass while deterministic checks failed.

LLM-side cause:
- Model status was not derived from a strict internal checklist tied to hard constraints.

LLM remediation:
1. Add explicit status derivation contract:
- status=pass only if all audit arrays are empty and all hard checks pass.
2. Require model to populate audit arrays deterministically.
3. Add fail-fast precedence order in prompt.

Prompt addition:
- status must be fail if any of the following are non-empty:
- audit.invalidSourcePaths
- audit.missingDiscriminatingEvidenceIds
- audit.weakEliminationSuspects

---

### Item G: Response key drift risk (red_herrings vs redHerrings)
Observed:
- Model emitted red_herrings in one run, while canonical schema expects redHerrings.

LLM-side cause:
- Output schema drift under complex instruction pressure.

LLM remediation:
1. Reassert exact JSON key names in the prompt schema.
2. Add explicit forbidden variant list:
- Do not emit red_herrings.
3. Add final self-check line for exact top-level keys.

Prompt addition:
- Top-level keys must be exactly: status, clues, redHerrings, audit.

## 3) Holistic LLM-Only Fix Plan

### Phase 1: Contract Tightening in Prompt
1. Promote hard fields to mandatory with no defaults:
- sourceInCML, pointsTo, supportsInferenceStep.
2. Enforce exact VALID_SOURCE_PATHS membership for every clue.
3. Keep fixed IDs and discriminating evidence coverage as hard requirements.

Outcome:
- Structural omissions and illegal path guesses reduce sharply.

### Phase 2: Generation Order and Internal Discipline
1. Force generation sequence:
- Build ids + sourceInCML + supportsInferenceStep first
- Validate source legality and bounds
- Then write description and pointsTo
- Then build red herrings
- Finally compute status
2. Add explicit instruction to avoid prose-first drafting.

Outcome:
- Better field completeness and lower schema drift.

### Phase 3: In-Prompt Self-Audit Before Final JSON
1. Require the model to run a hidden checklist before output:
- per-step mapping
- contradiction-per-step
- suspect elimination parity
- exact key names
2. If any check fails, require status=fail and filled audit arrays.

Outcome:
- status value aligns with hard constraints instead of optimistic pass.

### Phase 4: Replay Validation Loop (Prompt-Only Iteration)
1. Re-run harness replay with updated prompt contract.
2. Compare output artifact against acceptance criteria.
3. Refine only prompt wording and constraints between runs.

Outcome:
- Maximum quality gains from LLM-side changes before touching code.

## 4) Suggested Prompt Patch Blocks

Use these blocks in the developer or user prompt sections.

Block 1 - Required clue fields:
- Every clue must include id, category, description, sourceInCML, pointsTo, placement, criticality, supportsInferenceStep, evidenceType.
- Missing any required field is a hard failure.

Block 2 - Source legality:
- sourceInCML must exactly equal one VALID_SOURCE_PATHS entry.
- Never invent or transform a source path.

Block 3 - Per-step obligations:
- For each inference step in range, output at least one mapped clue and at least one contradiction clue.

Block 4 - Suspect parity:
- Any named non-culprit suspect requires at least one elimination clue with explicit logic and corroborated evidence source.

Block 5 - Exact JSON shape:
- Top-level keys: status, clues, redHerrings, audit.
- Do not output red_herrings.

Block 6 - Status rule:
- status=pass only if all audit arrays are empty and all hard contracts are satisfied.
- Otherwise status=fail.

## 5) LLM-Only Acceptance Criteria

A rerun is considered improved by LLM changes if all are true:
1. All clues contain valid sourceInCML, pointsTo, supportsInferenceStep.
2. No invalid source path entries are emitted.
3. Each inference step has mapped coverage and contradiction coverage.
4. Non-culprit suspect mentions include elimination/alibi evidence parity.
5. Output uses canonical key redHerrings and exact top-level shape.
6. status aligns with audit arrays and hard-rule outcomes.

## 6) Residual Risk Note

Even with perfect LLM prompting, operational reliability issues can still fail runs (for example path resolution and BOM parsing). Those remain outside this LLM-only document and should be tracked in the separate engineering remediation plan.
