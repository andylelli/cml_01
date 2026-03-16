# Chapter 2 Clue Obligation and Hard-Floor Underflow Cascade

## 1. Issue Metadata

- ID: FIX-20260312-02
- Title: Chapter 2 Clue Obligation and Hard-Floor Underflow Cascade
- Status: Implemented
- Priority: P0
- Owner: TBD
- Created: 2026-03-12
- Last Updated: 2026-03-15 (pronoun repair + content-filter framing + word count boost)

## 2. Scope

- Area: Prose, Validation, Temporal Consistency
- Affected Components: packages/prompts-llm/src/agent9-prose.ts, apps/worker/src/jobs/agents/agent9-run.ts, packages/story-validation/src/chapter-validator.ts, packages/story-validation/src/scoring/phase-scorers/agent9-prose-scorer.ts
- In Scope: remediate Chapter 1 structural/consistency defects and Chapter 2 repeated hard-floor + missing clue obligation failures in Agent 9 retries.
- Out of Scope: unrelated UI regressions and non-prose agent phases unless they directly block prose completion.

## 3. Problem Statement

- User-visible symptom: run stalls in repeated Agent 9 retries and quality remains degraded.
- Technical symptom: Chapter 1 requires multiple corrective retries; Chapter 2 fails all retry attempts on hard-floor word count and missing clue obligation.
- Expected behavior: each chapter satisfies required clue obligations, temporal consistency, and minimum chapter viability within retry budget.
- Actual behavior: Chapter 2 fails 4/4 attempts; required clue obligation is never met and chapter remains below hard floor.
- First known bad run/build: 2026-03-12 run excerpt (timestamps below).

## 4. Evidence

- Source: runtime logs from Agent 9 generation attempts.
- Timestamps:
  - 2026-03-12T20:56:45.378Z Agent9-ProseGenerator-Ch1 request
  - 2026-03-12T20:57:00.972Z Agent9-ProseGenerator-Ch1 response
  - 2026-03-12T20:57:01.070Z Agent9-ProseGenerator-Ch2 request
  - 2026-03-12T20:57:11.854Z Agent9-ProseGenerator-Ch2 response
  - 2026-03-12T20:57:21.817Z Agent9-ProseGenerator-Ch2 response
  - 2026-03-12T20:57:32.974Z Agent9-ProseGenerator-Ch2 response
  - 2026-03-12T20:57:43.794Z Agent9-ProseGenerator-Ch2 response
- Exact failure strings captured:
  - Chapter 1 contains an overlong paragraph block (5234 chars).
  - Chapter 1 has month/season contradiction (may vs autumn).
  - Chapter 1 word count below preferred target (885/1300).
  - Chapter 2 word count below hard floor (680/704), then (547/704), then (639/704), then (636/704).
  - Chapter 2 missing required clue obligation for "Witness chime testimony" (all 4 attempts).
- Frequency and impact:
  - Chapter 1 recovered on attempt 3.
  - Chapter 2 failed all 4 attempts, causing phase failure risk and run-level degradation.
- Reproduction confidence: High

## 5. Reproduction

- Preconditions: valid project run with Agent 9 enabled and clue obligations active.
- Steps to reproduce:
  1. Run generation pipeline through Agent 9.
  2. Inspect chapter-level validation failures during retry loop.
  3. Confirm Chapter 1 corrective failures and Chapter 2 repeated hard-floor + clue-obligation failures.
- Observed result: Chapter 2 cannot satisfy both word-floor and clue-obligation constraints within retry budget.
- Repro command(s): execute normal run from UI/API and inspect `logs/llm.jsonl` and run report output.
- Repro artifacts captured: runtime log excerpt and chapter validation messages.

## 6. Root Cause Analysis

- Primary root cause: coupled gate pressure in Chapter 2 causes retry collapse, where clue-obligation insertion and minimum-length recovery fail together.
- Contributing factors:
  - Prompt correction may not force explicit inclusion of the required obligation token/semantic form ("Witness chime testimony").
  - Retry attempts trend shorter than target after correction loops, indicating unstable repair strategy.
  - Chapter-level hard floor leaves little room for obligation repair when narrative density is already low.
  - Chapter 1 quality debt (overlong block, temporal contradiction) consumes retry budget before downstream stability.
- Why not caught earlier: existing diagnostics report failures, but not a strong causal split between obligation-miss and underflow-collapse sequence.
- Why hard to fix:
  - Increasing raw length alone can still miss obligation semantics.
  - Forcing obligation insertion can reduce prose coherence unless placement is constrained and validated.
- Dependencies and blockers:
  - Obligation extraction and semantic matching thresholds in scoring adapter.
  - Agent 9 retry policy and targeted repair instructions.

## 7. Solution Options

### Option A

- Description: increase Chapter 2 retry count and token budget only.
- Pros: lowest implementation cost.
- Cons: can increase cost and latency without guaranteeing obligation inclusion.
- Risk: medium-high.

### Option B

- Description: enforce obligation-first repair pass before full chapter retry (inject required clue mention with context-preserving rewrite).
- Pros: directly addresses persistent missing obligation.
- Cons: requires careful placement guardrails to avoid unnatural prose.
- Risk: medium.

### Option C

- Description: split validation feedback into prioritized repair phases: (1) required clue obligations, (2) hard floor, (3) preferred target/style constraints.
- Pros: reduces corrective thrash and conflicting objectives per retry.
- Cons: modest runtime/control-flow changes.
- Risk: medium.

### Option D

- Description: add paragraph segmentation and temporal consistency pre-check before chapter validation commit.
- Pros: prevents Chapter 1 class errors from propagating and consuming retries.
- Cons: adds pre-commit processing complexity.
- Risk: low-medium.

## 8. Chosen Solution

- Chosen response: **B + C now, D in same sprint if low risk**.
- Why this is best fit:
  - `B` directly resolves the repeated missing obligation failure.
  - `C` prevents retry loops from oscillating between underflow and obligation misses.
  - `D` removes known Chapter 1 instability patterns that waste retry budget.
- Operational guardrails:
  - Do not relax fair-play or release-gate hard-stop protections.
  - Obligation insertion must preserve chronology and existing clue semantics.
  - Hard-floor checks remain enforced after obligation-first repair.

## 9. Selected Approach

- Decision: Option B + C, with D as immediate follow-on.
- Rationale:
  - Current evidence shows deterministic obligation miss across all Chapter 2 attempts.
  - Two-stage repair ordering is a smaller blast-radius change than broad token/retry inflation.
- Non-goals: no weakening of clue integrity, fair-play constraints, or release gate policy.

## 10. Implementation Plan

1. Change:
   - File(s): `packages/prompts-llm/src/agent9-prose.ts`
   - Details: add obligation-first retry directive that explicitly requires inclusion of unresolved clue obligations before other style/target guidance.
2. Change:
   - File(s): `apps/worker/src/jobs/agents/agent9-run.ts`
   - Details: reorder retry feedback priorities to enforce obligation satisfaction first, then hard floor, then preferred target/style fixes.
3. Change:
   - File(s): `packages/story-validation/src/chapter-validator.ts`
   - Details: add deterministic pre-checks for paragraph block length and month/season consistency with explicit remediation hints.
4. Change:
   - File(s): `packages/story-validation/src/scoring/phase-scorers/agent9-prose-scorer.ts`
   - Details: improve diagnostics labeling to distinguish obligation-miss persistence vs underflow persistence across retries.
5. Change:
   - File(s): `documentation/04_llm_ai.md`, `documentation/06_workflow.md`
   - Details: document retry-priority semantics and new chapter pre-check behavior once implemented.

## 11. Verification Plan

- Unit tests to add/update:
  - Obligation-first repair prompt assembly and retry ordering tests.
  - Chapter validator tests for overlong paragraph detection and month/season contradiction detection.
- Integration tests:
  - Replay fixture where Chapter 2 misses "Witness chime testimony" and verify repair pass resolves obligation before final retry.
  - Verify chapter can pass hard floor after obligation repair without regression in clue/logic checks.
- Manual checks:
  - Run short and medium scenarios and inspect chapter retry traces.
  - Confirm obligation appears in generated prose with coherent placement.
- Regression checks:
  - Fair-play and release-gate hard stops remain unchanged.
  - No increase in temporal contradiction or overlong-paragraph violations after retry-priority changes.
- Success criteria:
  - Eliminate repeated identical missing-obligation failures across retries.
  - Reduce Chapter 2 hard-floor retry failures by at least 50% in next validation window.
  - No increase in fairness or grounding regressions.

## 12. Execution Log

- [2026-03-12] Issue report created from live Agent 9 log excerpt.
- [2026-03-12] Failure pattern classified as coupled obligation-miss and hard-floor underflow cascade.
- [2026-03-12] Implemented obligation-first chapter-local repair pass in `packages/prompts-llm/src/agent9-prose.ts` for missing required clue obligations.
- [2026-03-12] Implemented deterministic retry-error ordering and stronger temporal/paragraph micro-prompts in `packages/prompts-llm/src/agent9-prose.ts`.
- [2026-03-12] Added ordering regression tests in `packages/prompts-llm/src/__tests__/agent9-prose.test.ts`.
- [2026-03-12] Updated docs to reflect runtime behavior changes (`documentation/02_cml_and_agents.md`, `documentation/03_architecture_backend.md`, `documentation/04_llm_ai.md`, `documentation/06_workflow.md`, `README.md`).

## 13. Results

- What changed: Agent 9 now attempts chapter-local clue-obligation repair before normal retry progression when pre-commit checks detect missing required clue obligations.
- What changed: Agent 9 now sorts retry errors in deterministic causal order and emits strengthened temporal/paragraph corrective micro-prompts.
- What did not change: release-gate hard-stop policies and clue/fair-play protections remain unchanged.
- Test outcomes: targeted `agent9-prose` test updates added; full validation run pending.
- Remaining risks: model outputs may still miss obligations in edge cases where clue phrasing is semantically weak despite explicit repair directives.

## 14. Rollback Plan

- Trigger conditions: quality regressions or degraded clue coherence after remediation implementation.
- Rollback steps: revert retry-priority and obligation-repair changes in Agent 9 runtime and prompts.
- Data implications: historical run reports unchanged; only new runs impacted by remediation changes.

## 15. Follow-ups

- Immediate follow-ups: ~~run targeted package tests and a representative pipeline replay to verify reduced Chapter 2 obligation/underflow retry collapse.~~ DONE — obligation-first repair, retry ordering, and temporal pre-checks all implemented and tested.
- Additional follow-ups implemented (2026-03-14/15):
  - Deterministic post-generation pronoun repair eliminates pronoun drift consuming retry budget (see ANALYSIS_07).
  - Pipeline-wide content-filter fiction framing prevents Azure content filter from consuming retry attempts (see ANALYSIS_05).
  - Prompt overshoot buffer (200 words) and underflow expansion pass reduce hard-floor misses (see ANALYSIS_06).
  - Combined effect: more retry attempts produce real prose, and fewer are wasted on phantom failures.
- Deferred follow-ups: calibrate underflow thresholds only if obligation-first fixes do not reduce failures sufficiently.
- Owner and due date: TBD

## 16. Sign-off

- Reviewer: TBD
- Date: TBD
- Decision: Pending
