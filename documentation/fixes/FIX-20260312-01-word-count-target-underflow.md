# Word Count Target Underflow Across Runs

## 1. Issue Metadata

- ID: FIX-20260312-01
- Title: Word Count Target Underflow Across Runs
- Status: Open
- Priority: P0
- Owner: TBD
- Created: 2026-03-12
- Last Updated: 2026-03-12 (implemented hard-floor relaxation)

## 2. Scope

- Area: Prose, Scoring
- Affected Components: packages/prompts-llm/src/agent9-prose.ts, apps/worker/src/jobs/agents/agent9-run.ts, apps/worker/src/jobs/scoring-adapters/agent9-scoring-adapter.ts, packages/story-validation/src/scoring/phase-scorers/agent9-prose-scorer.ts, packages/story-validation/src/chapter-validator.ts
- In Scope: isolate and remediate this specific failure signature across stored runs.
- Out of Scope: unrelated UI issues and non-prose phases unless they are direct blockers.

## 3. Problem Statement

- User-visible symptom: prose phase fails or scores below threshold.
- Technical symptom: recurring signature appears in reports.
- Expected behavior: prose completes with passing completeness and validation targets.
- Actual behavior: this signature recurs across stored runs.
- First known bad run/build: see evidence table below.

## 4. Evidence

- Run IDs: see documentation/prose-generation.md section Historical Error Catalog (All Stored Runs).
- Report paths:
  - apps/api/data/reports/**/*.json
  - validation/quality-report-run_*.json
- Log paths: logs/llm.jsonl (when enabled), run event logs in API data reports.
- Exact error strings: Word Count Target Underflow Across Runs signature as cataloged.
- Frequency and impact: raw occurrences = 180 (non-deduplicated; mirrored report stores may duplicate entries).
- Reproduction confidence: High

## 5. Reproduction

- Preconditions: valid project and spec; run pipeline through Agent 9.
- Steps to reproduce:
  1. Start a new run with scoring enabled.
  2. Observe Agent 9 outcomes in run report.
  3. Confirm signature appears in failure_reason, abort_reason, or tests.
- Observed result: signature recurs under historical conditions.
- Repro command(s): run pipeline from app UI/API; inspect report JSON for this signature.
- Repro artifacts captured: stored run reports under API and validation folders.

## 6. Root Cause Analysis

- Primary root cause: chapter-level hard minimums in Agent 9 pre-commit (`1300/1600/2400`) are stricter than scorer chapter minimum targets (`800/1200/1500`) and can hard-abort early even when prose is otherwise recoverable.
- Contributing factors:
   - Historical runs used lower retry budgets (seen in stored run outcomes with "failed after 2 attempts").
   - Multi-gate coupling means chapter retries must satisfy word minimum, clue obligations, grounding, and anti-template lint in the same attempt.
   - Early chapter failure amplification: Chapter 1 underflow prevents downstream repair/recovery paths from running.
   - Token/paragraph constraints can still yield under-length prose despite prompt guidance.
- Why not caught earlier: quality reports aggregate multiple failure classes; duplicated report stores and repeated reason fields obscured the specific chapter-word underflow path.
- Why hard to fix:
   - Tightening generation quality and reducing abort frequency are in tension.
   - Relaxing word gates too far can increase low-density prose and harm completeness/quality scores.
- Dependencies and blockers:
   - Upstream CML/outline quality (scene density, clue load, and pacing requirements).
   - Clue obligation pressure in the same chapter budget.
   - Fair-play and release-gate constraints that cannot be weakened.

## 7. Solution Options

### Option A

- Description: keep current strict chapter minimums as hard-fail gates and only increase retries/tokens.
- Pros: preserves high density expectations per chapter.
- Cons: expensive, still brittle at Chapter 1, and likely to preserve hard-abort pattern under coupled constraints.
- Risk: medium-high.

### Option B

- Description: align chapter word gating with a two-tier model:
   - Hard floor = shared story-length chapter minimum (`STORY_LENGTH_TARGETS.chapterMinWords`).
   - Quality target = stricter preferred threshold used for corrective retries and provisional scoring directives.
- Pros: removes contradictory pass/fail pressure, reduces catastrophic aborts, preserves quality pressure via retries/scoring instead of immediate hard-stop.
- Cons: requires careful calibration to avoid quality regression.
- Risk: medium.

### Option C

- Description: dynamic chapter budget policy based on scene complexity and clue load (adaptive target words per chapter).
- Pros: best long-term fit between chapter demands and word budget.
- Cons: larger implementation scope and higher regression surface.
- Risk: medium-high.

### Option D

- Description: targeted underflow expansion pass (chapter-local repair) when the only failing condition is word-count underfloor/under-target.
- Pros: highest near-term ROI; preserves clue/logic structure while avoiding full-batch re-generation cost.
- Cons: requires strict guardrails to prevent filler expansion and clue-order drift.
- Risk: medium.

### Option E

- Description: scene-complexity word allocator (derive chapter target from clue load, suspect interactions, and required reasoning beats).
- Pros: prevents chronic underflow by matching budget to scene demand; improves consistency across run lengths.
- Cons: adds policy complexity and calibration overhead.
- Risk: medium.

### Option F

- Description: constrained chapter-structure flexibility (allow scene split/merge in bounded cases instead of forcing strict 1 scene = 1 chapter).
- Pros: solves structural underflow for dense scenes at source.
- Cons: high compatibility impact (outline contracts, scoring expectations, downstream tooling).
- Risk: high.

## 8. Chosen Solution

- Chosen response: **B + D now, E next, F conditional**.
- Why this is best fit:
   - `B` removes the current policy contradiction (generation hard gate stricter than scorer expectation).
   - `D` handles the dominant operational pain (Chapter 1 hard aborts) with minimal blast radius and lower cost than full retries.
   - `E` addresses recurring drift by making word targets scene-aware instead of static.
   - `F` is deferred unless B/D/E fail to bring underflow-abort rates below target due to its larger architecture impact.
- Operational guardrails for chosen response:
   - Never reduce fair-play, clue, or release-gate hard-stop protections.
   - Underflow expansion pass may run only when no critical logic/identity/grounding failures are present.
   - Expansion pass must preserve existing clue mentions, chronology, and discriminating-test constraints.
   - Emit diagnostics that distinguish: hard-floor failure, preferred-target miss, expansion-recovered, expansion-failed.

## 9. Selected Approach

- Decision: Option B + D now, Option E next, Option F conditional.
- Rationale:
   - Historical data shows catastrophic early abort is the highest operational cost.
   - Two-tier gating reduces abort brittleness without weakening fair-play/release controls.
   - Chapter-local expansion recovers hard-floor underflow cases without forcing full-batch regeneration.
   - Keeps quality enforcement in place through retries, provisional scoring feedback, and final scorer thresholds.
- Non-goals: do not weaken core fair-play or release-gate guarantees.

## 10. Implementation Plan

1. Change:
   - File(s): `packages/prompts-llm/src/agent9-prose.ts`
   - Details: implement two-tier chapter word policy (hard floor vs preferred target); only hard-fail below hard floor; keep preferred target as retry directive + provisional deficit.
2. Change:
   - File(s): `packages/story-validation/src/scoring/phase-scorers/agent9-prose-scorer.ts`, `packages/story-validation/src/story-length-targets.ts`
   - Details: verify chapter-quality and total-completeness expectations are coherent with generation gates and messages.
3. Change:
   - File(s): `apps/worker/src/jobs/agents/agent9-run.ts`, `documentation/04_llm_ai.md`, `documentation/prose-generation.md`
   - Details: add explicit diagnostics for chapter underflow occurrences (counts, chapter indexes, hard-floor vs preferred-target misses) and document semantics.
4. Change:
   - File(s): `packages/prompts-llm/__tests__/agent9*.test.ts` (or nearest existing Agent 9 tests), `packages/story-validation/src/__tests__/...`
   - Details: add regression fixtures for Chapter 1 underflow recovery and ensure no false pass below hard floor.

## 11. Verification Plan

- Unit tests to add/update:
   - Agent 9 pre-commit gate tests for hard-floor fail vs preferred-target retry behavior.
   - Scorer tests ensuring completeness outcomes remain stable with aligned semantics.
- Integration tests:
   - Replay fixture where Chapter 1 previously failed under minimum and verify run continues when above hard floor.
   - Verify hard-stop still occurs when chapter is below hard floor.
- Manual checks:
   - Run short/medium/long generation and inspect diagnostics for chapter underflow counters.
   - Confirm report fields distinguish underflow class from clue/grounding failures.
- Regression checks:
   - Fair-play and release-gate hard stops unchanged.
   - No increase in low-density paragraph warnings beyond agreed threshold.
- Success criteria:
   - >=60% reduction in "word count below minimum" hard-abort signatures over next validation window.
   - No statistically significant drop in prose quality/validation component scores.
   - Underflow failures become mostly recoverable retries, not run-ending aborts.

## 12. Execution Log

- [2026-03-12] Issue record created from historical catalog.
- [2026-03-12] Deep-dive completed: mapped runtime/scoring failure paths, selected two-tier word-gate remediation strategy.
- [2026-03-12] Relaxed Agent 9 hard-floor gate to `chapterMinWords * 0.9` (720/1080/1350) while retaining preferred targets and scorer thresholds.
- [2026-03-12] Parameterized Agent 9 word-policy/underflow tuning from single YAML source: `apps/worker/config/generation-params.yaml`.

## 13. Results

- What changed: Agent 9 chapter pre-commit hard floor is now a controlled relaxed threshold (`0.9 * STORY_LENGTH_TARGETS.chapterMinWords`) to reduce hard-abort frequency on near-miss chapters.
- What changed: Agent 9 chapter pre-commit hard floor, preferred chapter targets, default batch attempts, underflow expansion tuning, prose model temperature/batch cap, anti-template linter thresholds, scoring-adapter semantic matching thresholds, fair-play spoiler window ratio, and completeness scorer word/clue cutoffs are now centrally configurable in one YAML file (`apps/worker/config/generation-params.yaml`).
- What did not change: Release-gate hard-stop policies remain unchanged.
- Test outcomes: Targeted Agent 9 prompt tests and worker adapter tests still pass after the rule relaxation.
- Remaining risks: Excessively short chapters can still pass pre-commit if above relaxed hard floor; preferred-target misses must continue to be monitored via diagnostics.

## 14. Rollback Plan

- Trigger conditions: unexpected regressions in prose quality or fair-play compliance.
- Rollback steps: revert targeted commits and restore prior validator and scoring behavior.
- Data implications: historical reports remain unchanged; only new runs affected.

## 15. Follow-ups

- Immediate follow-ups: implement two-tier word-gate policy in Agent 9 and add diagnostics + replay tests.
- Deferred follow-ups: deduplicate historical counts by run_id for cleaner trend analysis.
- Owner and due date: TBD

## 16. Sign-off

- Reviewer: TBD
- Date: TBD
- Decision: Pending
