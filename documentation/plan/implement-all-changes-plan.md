# Implementation Plan: Agent65 Reliability and Agent9 First-Pass Stability

Date: 2026-05-14  
Owner: CML pipeline engineering

## Scope

Implement and validate the full change set requested:
1. Ensure Agent65 reliably passes without avoidable retries.
2. Perform second-pass analysis on first-pass failures.
3. Assess why Agent9 prose generator often fails first-pass validation.
4. Define prompt-level and procedural fixes.
5. Decide whether to add LLM self-validation after each attempt.

## Workstream 1 — Agent65 “pass every time” hardening

### Objectives
1. Eliminate schema-omission retries by deterministic pre-schema normalization.
2. Keep semantic quality gates strict while removing structural fragility.

### Tasks
1. Normalize required top-level fields before schema validation.
2. Sanitize malformed array payloads before gating.
3. Ensure deterministic completion of required structure for:
   - `validationConfirmations`
   - `breakMoment`
   - `revealImplications`
   - `storyEmotionalArc`
   - `humourPlacementMap`
4. Add and maintain focused unit tests for each repaired failure mode.

### Exit criteria
1. Known Agent65 first-pass structural failures no longer trigger retries.
2. Agent65 targeted test suite passes consistently.

## Workstream 2 — Second-pass reliability review

### Objectives
1. Confirm first-pass findings with a second analysis pass.
2. Distinguish deterministic-fix candidates from pure prompt-compliance issues.

### Tasks
1. Review recent prompt/response artifacts for first-pass and retry signatures.
2. Classify each failure as:
   - structural/deterministic
   - prompt-contract clarity
   - model-behavior/style drift
3. Update documentation with first-pass vs second-pass conclusions.

### Exit criteria
1. Final findings document clearly separates root causes and recommended fix type.

## Workstream 3 — Agent9 first-pass failure analysis

### Objectives
1. Identify why Agent9 fails first-pass despite retry feedback mechanisms.
2. Reduce template-linter collisions and retry-loop behavior.

### Tasks
1. Analyze late-act chapters for repeated fingerprint/n-gram failures.
2. Audit obligation block complexity and retry feedback payload size.
3. Identify where checklist overload degrades prose variance.

### Exit criteria
1. Clear, prioritized root-cause list for Agent9 first-pass failures.

## Workstream 4 — Prompt and procedural improvements

### Prompt-level candidates
1. Tighten first-pass anti-boilerplate instructions for confrontation/reveal chapters.
2. Separate must-pass structural obligations from stylistic guidance.
3. Add concise inline “before finalizing output, verify obligations” reminder.

### Procedural candidates
1. Keep deterministic validators authoritative for hard constraints.
2. Improve retry packets to minimize directive overload.
3. Evaluate act-aware template-linter thresholds for constrained reveal scenes.

### Exit criteria
1. Proposed prompt/procedural changes are documented with expected impact and risk.

## Workstream 5 — LLM self-validation decision

### Decision framework
1. Use self-validation only if it improves pass-rate without replacing deterministic checks.
2. Prefer inline low-cost self-checks over extra model round-trips.

### Recommendation target
1. No separate extra LLM validation call by default after each try.
2. Optional inline self-check for obligation completeness where useful (especially Agent9).

### Exit criteria
1. Final recommendation documented with rationale and operational boundaries.

## Verification plan

1. Run targeted package build/tests for modified components.
2. Keep canary evidence collection enabled where credentials/environment permit.
3. Track first-pass success rate, retry count, and failure class distribution before/after.

## Deliverables

1. This implementation plan (`documentation/plan/implement-all-changes-plan.md`).
2. Updated findings plan documenting pass-1 and pass-2 outcomes.
3. Code changes and tests for Agent65 reliability hardening.
4. Agent9 mitigation proposal covering prompt and procedural paths.
