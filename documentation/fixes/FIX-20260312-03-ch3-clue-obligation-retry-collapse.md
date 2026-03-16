# Chapter 3 Clue Obligation Retry Collapse

## 1. Issue Metadata

- ID: FIX-20260312-03
- Title: Chapter 3 Clue Obligation Retry Collapse
- Status: Implemented
- Priority: P0
- Owner: TBD
- Created: 2026-03-12
- Last Updated: 2026-03-15 (pronoun repair + content-filter framing + word count boost)

## 2. Scope

- Area: Prose, Validation
- Affected Components: packages/prompts-llm/src/agent9-prose.ts, apps/worker/src/jobs/agents/agent9-run.ts
- In Scope: remediate persistent Chapter 3 missing clue obligation plus word-count instability across all retry attempts.
- Out of Scope: unrelated UI/API issues and non-prose phases unless directly blocking this failure pattern.

## 3. Problem Statement

- User-visible symptom: generation stalls and Chapter 3 fails after all retries.
- Technical symptom: repeated missing required clue obligations (`hourglass_position`, `clock_time`, `witness_statements`) combined with word-target misses and eventual hard-floor failure.
- Expected behavior: Chapter 3 should satisfy required clue obligation and pass minimum/prose quality checks within retry budget.
- Actual behavior: Chapter 3 fails attempts 1-4, ending with hard-floor underflow and unresolved required clue obligations.
- First known bad run/build: 2026-03-12 run excerpt (timestamps below).

## 4. Evidence

- Run IDs: run_f79c3a54-c28e-442f-8066-33e19804fb50
- Report paths:
  - apps/api/data/reports/**/*.json
  - validation/quality-report-run_*.json
- Log paths:
  - logs/llm.jsonl
- Error strings (exact):
  - Chapter 3: missing required clue obligation for "hourglass_position"
  - Chapter 3: missing required clue obligation for "clock_time"
  - Chapter 3: missing required clue obligation for "witness_statements"
  - Chapter 3: word count below preferred target (720/1300)
  - Chapter 3: word count below hard floor (591/704)
  - Chapter 3: word count below hard floor (662/704)
  - Chapter 3: word count below hard floor (653/704)
- Frequency / impact:
  - All three required clue obligations remain missing in all 4 attempts.
  - Preferred target miss appears in attempt 1.
  - Hard-floor miss appears in attempts 2-4, causing terminal failure on attempt 4.
  - Agent 9 prompt hash changed each retry (feedback injected), but failure signature persisted.
- Reproduction confidence: High

## 5. Reproduction

- Preconditions: scoring-enabled run with Agent 9 chapter validation and clue obligations active.
- Steps to reproduce:
  1. Run generation pipeline until Agent 9 Chapter 3 batch.
  2. Observe retry loop for Chapter 3.
  3. Confirm `hourglass_position`, `clock_time`, and `witness_statements` remain unsatisfied across all attempts and final attempt drops below hard floor.
- Observed result: chapter fails after 4 attempts with unresolved obligation and hard-floor underflow.
- Repro command(s): run standard pipeline and inspect `logs/llm.jsonl` + run report.
- Repro artifacts captured: timestamped Agent 9 retry logs from 2026-03-12T21:42:55Z through 21:43:30Z.

## 6. Root Cause Analysis

- Primary root cause: FIX-03 improved retry messaging/escalation, but did not guarantee that chapter-local corrective paths actually execute and clear obligations before the next full regeneration.
- Contributing factors:
  - The failing run shows repeated `Agent9-ProseGenerator-Ch3` prompt cycles with changing hashes, confirming feedback injection, but no corresponding `Agent9-ClueObligationRepair-Ch3` or `Agent9-UnderflowExpansion-Ch3` telemetry for that run.
  - As a result, retries behaved like repeated full rewrites under stronger instructions, not deterministic obligation repair plus validation closure.
  - Missing obligations persisted (`hourglass_position`, `clock_time`, `witness_statements`) while word-count compliance regressed from preferred-target miss to hard-floor misses.
  - FIX-03 test coverage validated retry-feedback ordering/persistence signals, but did not include an end-to-end assertion that missing-clue runs trigger and complete chapter-local repair branches.
- Why not caught earlier: unit coverage focused on helper behavior (error ordering/persistence extraction), not runtime evidence that repair subcalls are invoked and effective under real retry pressure.
- Why hard to fix: current loop mixes soft prompt steering with hard validation gates; without a mandatory repair-branch contract, the model can oscillate between clue coverage and length constraints.
- Dependencies/blockers:
  - Reliable execution telemetry for chapter-local repair branches.
  - Repair-branch entry/exit conditions tied to missing-clue IDs.
  - Obligation matching behavior for `hourglass_position`, `clock_time`, and `witness_statements`.

## 7. Solution Options

Option A
- Description: increase retry count only.
- Pros: minimal code change.
- Cons: higher cost/latency; does not address repeated obligation persistence.
- Risk: high.

Option B
- Description: strengthen obligation-first repair pass for required clue IDs with explicit multi-obligation retention checks before hard-floor enforcement.
- Pros: directly targets recurring failure signature.
- Cons: requires careful prompt and validation tuning.
- Risk: medium.

Option C
- Description: add chapter-local minimum-expansion guardrail that preserves obligation-bearing text while restoring chapter length above hard floor.
- Pros: reduces hard-floor collapse while keeping required clue text intact.
- Cons: adds additional deterministic processing path.
- Risk: medium.

## 8. Selected Approach

- Decision: Option B + C.
- Rationale: this failure pattern is dominated by unresolved clue obligation across retries with secondary prose-shape degradation.
- Non-goals: no reduction of hard-floor requirements or fair-play integrity checks.

## 9. Implementation Plan

1. Change:
  - File(s): `packages/prompts-llm/src/agent9-prose.ts`
  - Details: harden obligation-first Chapter 3 repair for required clue IDs and enforce post-repair multi-obligation retention checks before retry continuation.
2. Change:
   - File(s): `packages/story-validation/src/chapter-validator.ts`
  - Details: strengthen missing-obligation diagnostics so required clue IDs and failure persistence are emphasized in retry loops.
3. Change:
   - File(s): `apps/worker/src/jobs/agents/agent9-run.ts`
   - Details: improve retry diagnostics so repeated missing obligations across attempts are explicitly surfaced as persistent root-cause signals.

## 10. Verification Plan

- Unit tests to add/update:
  - Agent 9 retry-order and obligation-retention tests for persistent clue failures (`hourglass_position`, `clock_time`, `witness_statements`).
  - Add tests that assert missing-clue errors force chapter-local repair path execution (and verify telemetry marker emission).
- Integration tests:
  - Replay fixture with repeated Chapter 3 clue-obligation failure and verify obligation is satisfied before final attempt.
  - Assert runtime logs contain at least one `Agent9-ClueObligationRepair-Ch*` event when missing-clue obligations are present.
- Manual checks:
  - Run a short/medium generation and inspect Chapter 3 retry history for obligation resolution.
- Regression checks:
  - Fair-play and release-gate hard-stop behavior unchanged.
  - No increase in hard-floor failures after changes.
- Success criteria:
  - Eliminate repeated unresolved required clue obligations across all retries for this failure class.
  - Prevent final-attempt drop below hard floor in obligation-repair scenarios.

## 11. Execution Log

- [2026-03-12] Captured Chapter 3 retry failure sequence from runtime logs.
- [2026-03-12] Logged FIX-20260312-03 from template with full evidence and remediation plan.
- [2026-03-12] Implemented Agent 9 retry hardening in `packages/prompts-llm/src/agent9-prose.ts`:
  - Added attempt-history-aware retry feedback escalation for persistent clue-obligation misses.
  - Added clue-description context injection to clue-visibility retry directives.
  - Added strict second-pass obligation repair when first repair does not clear missing clues.
- [2026-03-12] Added persistent retry-collapse diagnostics to `apps/worker/src/jobs/agents/agent9-run.ts` (`persistent_clue_obligation_ranges`, `persistent_hard_floor_ranges`).
- [2026-03-12] Added unit tests for retry persistence signal extraction in `packages/prompts-llm/src/__tests__/agent9-prose.test.ts`.
- [2026-03-12] Validation run complete:
  - `npm run -w @cml/prompts-llm test -- agent9-prose` passed (17/17).
  - `npm run -w @cml/prompts-llm build` passed.
  - `npm run -w @cml/worker build` passed.
- [2026-03-12] Regression evidence captured from `run_f79c3a54-c28e-442f-8066-33e19804fb50`:
  - Attempt 1 (`logs/llm.jsonl`): missing `hourglass_position`, `clock_time`, `witness_statements`; preferred target underflow (720/1300).
  - Attempt 2: same missing obligations; hard floor underflow (591/704).
  - Attempt 3: same missing obligations; hard floor underflow (662/704).
  - Attempt 4: same missing obligations; hard floor underflow (653/704).
  - Retry prompt hashes changed across attempts (`fc2543...`, `279128...`, `bfc66b...`, `3a916d...`), confirming retry feedback injection but ineffective correction.
- [2026-03-12] Implemented FIX-03 follow-up runtime invariant in `packages/prompts-llm/src/agent9-prose.ts`:
  - Missing required clue IDs are now derived deterministically from chapter obligation checks (not retry-error string parsing).
  - Agent 9 now enforces mandatory chapter-local clue-repair execution before additional full-regeneration attempts when missing obligations are present.
  - Added repair telemetry counters (`mandatoryRepair.triggered`, `mandatoryRepair.executed`, `mandatoryRepair.invariantViolations`) to prose validation details.
- [2026-03-12] Surfaced mandatory repair telemetry in `apps/worker/src/jobs/agents/agent9-run.ts` diagnostics:
  - Added run-diagnostic fields for mandatory clue-repair trigger/execution/invariant-violation counts.
  - Added explicit warning/log emission when invariant violations are detected.

## 12. Results

- What changed: runtime retry/repair logic and post-generation diagnostics include explicit handling for persistent clue-obligation collapse patterns.
- What did not change: chapter-validator paragraph guidance remained stable (already deterministic/actionable).
- Test outcomes: targeted Agent 9 tests and package builds passed.
- Remaining risks: end-to-end evidence now shows a still-open regression where retry feedback is present but chapter-local repair execution/effectiveness is not guaranteed under hard-floor pressure.

## 13. Rollback Plan

- Trigger conditions: regressions after implementing obligation/paragraph retry hardening.
- Rollback steps: revert targeted Agent 9/chapter-validation retry changes.
- Data implications: historical reports remain unchanged; only future runs affected.

## 14. Follow-ups

- Immediate follow-ups: ~~add hard runtime invariant that if missing-clue errors are detected, at least one chapter-local repair pass must execute and emit telemetry before consuming another full-regeneration attempt.~~ DONE — mandatory clue-repair execution enforced with telemetry counters.
- Additional follow-ups implemented (2026-03-14/15):
  - Deterministic pronoun repair eliminates pronoun failures consuming retry budget (see ANALYSIS_07).
  - Pipeline-wide content-filter fiction framing prevents Azure content filter from blocking retry attempts (see ANALYSIS_05).
  - Prompt overshoot buffer and underflow expansion pass reduce hard-floor misses (see ANALYSIS_06).
  - Auto-detected retry mode: surgical revision when previous attempt produced valid prose, fresh regeneration when it didn't (see ANALYSIS_04).
  - Combined effect: retry budget is now spent on genuine quality defects rather than phantom failures.
- Deferred follow-ups: calibrate preferred-target behavior only if obligation-first corrections still drift under hard floor.
- Owner + due date: TBD

## 15. Sign-off

- Reviewer: TBD
- Date: TBD
- Decision: Pending
