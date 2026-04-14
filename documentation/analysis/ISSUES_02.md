# ISSUES_02

### ISSUE-02-01 - Agent 9 prose crash on missing cast shape
- Severity: Critical
- Run signal: `Pipeline failure: Chapter 1 generation failed after 4 attempts: Cannot read properties of undefined (reading 'characters')`
- Evidence:
  - `packages/prompts-llm/src/agent9-prose.ts:3943` (`inputs.cast.characters.map(...)`) has no guard.
  - Additional unguarded dereferences: `packages/prompts-llm/src/agent9-prose.ts:4139`, `packages/prompts-llm/src/agent9-prose.ts:4140`, `packages/prompts-llm/src/agent9-prose.ts:4260`, `packages/prompts-llm/src/agent9-prose.ts:4268`, `packages/prompts-llm/src/agent9-prose.ts:4269`, `packages/prompts-llm/src/agent9-prose.ts:4294`, `packages/prompts-llm/src/agent9-prose.ts:4314`, `packages/prompts-llm/src/agent9-prose.ts:4643`.
  - Caller passes nested value (`cast: cast.cast`) at `apps/worker/src/jobs/agents/agent9-run.ts:1247` and `apps/worker/src/jobs/agents/agent9-run.ts:1758`.
- Impact: Immediate hard stop in prose stage; retries cannot recover.
- Status: Open (not fixed).
- Required fix: Normalize/validate `inputs.cast` once at `generateProse()` entry and fail with explicit actionable error before generation loop.

### ISSUE-02-02 - Agent 5 coverage telemetry becomes stale after retries
- Severity: High
- Evidence:
  - Coverage/issue set is computed before retries: `apps/worker/src/jobs/agents/agent5-run.ts:281` and `apps/worker/src/jobs/agents/agent5-run.ts:284`.
  - Clues are regenerated later (`apps/worker/src/jobs/agents/agent5-run.ts:325`, `apps/worker/src/jobs/agents/agent5-run.ts:384`).
  - Persisted values remain pre-retry: `apps/worker/src/jobs/agents/agent5-run.ts:416`, `apps/worker/src/jobs/agents/agent5-run.ts:417`.
- Impact: Reports and downstream analytics can misrepresent final clue quality.
- Status: Open.
- Required fix: Recompute coverage + issue arrays after final clue set is chosen, then persist those final values.

### ISSUE-02-03 - No post-retry hard gate for critical inference/discriminating-test failures
- Severity: High
- Evidence:
  - Retry is triggered on critical inference gaps (`apps/worker/src/jobs/agents/agent5-run.ts:302`).
  - After retry, critical inference/discriminating checks are not re-evaluated for fail/stop before commit.
  - Execution still commits clues (`apps/worker/src/jobs/agents/agent5-run.ts:415`).
- Impact: Pipeline can proceed with unresolved critical fair-play logic gaps.
- Status: Open.
- Required fix: Run final critical checks after last retry and hard-fail if any critical remains.

### ISSUE-02-04 - Locked-fact time contradictions are detect-only
- Severity: Medium-High
- Run signal: `[CML integrity] Locked fact ... conflicts with clue ...`
- Evidence: Warning emission exists in `apps/worker/src/jobs/agents/agent9-run.ts:1093`; no remediation path follows.
- Impact: Known contradiction can repeatedly poison prose validation and chapter consistency.
- Status: Open.
- Required fix: Add deterministic reconciliation or fail-fast gate before prose if contradiction persists.

### ISSUE-02-05 - Failed-run artifact persistence gap (forensics risk)
- Severity: Medium
- Evidence:
  - Direct inspection of `data/store.json` for `proj_316d59f6-77d5-4cd8-a1cf-3efd1fe92bbb` returned `NO_CAST_ARTIFACT` after run had already completed cast stage.
- Impact: Postmortem investigations lose stage artifacts needed to prove root causes.
- Status: Open (behavior observed; root cause in persistence path still to pinpoint).
- Required fix: Ensure stage artifacts are persisted transactionally even when later stages fail.

### ISSUE-02-06 - Non-null assertions in Agent 9 hide invalid runtime state
- Severity: Medium
- Evidence: `apps/worker/src/jobs/agents/agent9-run.ts:987` uses `const cast = ctx.cast!;` and later assumes `cast.cast` structure throughout.
- Impact: Invalid orchestrator state surfaces as opaque runtime exceptions instead of explicit pipeline diagnostics.
- Status: Open.
- Required fix: Replace non-null assertions with explicit guards and contextual error messages.

### ISSUE-02-07 - Inference coverage warning: missing contradiction clue (step 1)
- Severity: Warning
- Run signal: `Inference coverage: [warning] Inference step 1 has no contradiction clue`
- Evidence source: `apps/worker/src/jobs/agents/agent5-run.ts:297` warning pipeline.
- Impact: Reduced robustness of fair-play elimination logic.
- Status: Not proven fixed for this run.
- Required fix: Strengthen clue generation constraints and verify post-retry coverage result (ties to ISSUE-02-02/03).

### ISSUE-02-08 - Inference coverage warning: missing contradiction clue (step 3)
- Severity: Warning
- Run signal: `Inference coverage: [warning] Inference step 3 has no contradiction clue`
- Evidence source: `apps/worker/src/jobs/agents/agent5-run.ts:297`.
- Impact: Same risk pattern as ISSUE-02-07 on later inference step.
- Status: Not proven fixed for this run.
- Required fix: Same as ISSUE-02-07.

### ISSUE-02-09 - Inference coverage warning: under-mapped clue support
- Severity: Warning
- Run signal: `Inference step 1 (...) has only 1 mapped clue(s)`
- Evidence source: `apps/worker/src/jobs/agents/agent5-run.ts:297`.
- Impact: Thin evidentiary support for key inference step.
- Status: Not proven fixed for this run.
- Required fix: Enforce minimum per-step clue support and re-check after retries.

### ISSUE-02-10 - Inference coverage warning: red herrings may support true solution
- Severity: Warning
- Run signal: `2 red herring(s) may accidentally support the true solution`
- Evidence source: `apps/worker/src/jobs/agents/agent5-run.ts:297`.
- Impact: Reader-facing ambiguity can undermine logical reveal.
- Status: Not proven fixed for this run.
- Required fix: Add deterministic red-herring contradiction guard in post-retry validation.

### ISSUE-02-11 - Critical inference warning: discriminating test has no evidence
- Severity: Critical Warning
- Run signal: `Discriminating test references no evidence found in the clue set`
- Evidence source: `apps/worker/src/jobs/agents/agent5-run.ts:309` triggers coverage retry but no final critical gate.
- Impact: Core solvability/fair-play contract at risk.
- Status: Partially mitigated (retry attempted), not guaranteed resolved.
- Required fix: Enforce final hard gate (ties to ISSUE-02-03).

### ISSUE-02-12 - Coverage retry warning is expected behavior but needs closure proof
- Severity: Operational
- Run signal: `Inference coverage gate: critical gaps found; regenerating clues with coverage feedback`
- Evidence source: `apps/worker/src/jobs/agents/agent5-run.ts:309`.
- Impact: Healthy recovery mechanism, but outcome quality currently unverifiable due to stale persistence (ISSUE-02-02).
- Status: Mechanism exists; closure evidence incomplete.
- Required fix: Pair with final-state recomputation and post-retry gate.

### ISSUE-02-13 - CML evidence-clue backfill warning is expected deterministic repair
- Severity: Operational
- Run signal: `CML gate: back-filled evidence_clues with 8 essential clue(s)`
- Evidence source: `apps/worker/src/jobs/mystery-orchestrator.ts:353`.
- Impact: Positive self-heal; not a defect by itself.
- Status: Expected behavior.
- Required action: None unless repeated backfill masks recurring upstream CML authoring defects.

### ISSUE-02-14 - Outline clue pacing warnings are expected deterministic repair
- Severity: Operational
- Run signals:
  - `Outline clue pacing below threshold ... Applying deterministic clue pre-assignment.`
  - `Deterministic clue pre-assignment satisfied pacing without retry ...`
- Evidence source: `apps/worker/src/jobs/agents/agent7-run.ts:811`, `apps/worker/src/jobs/agents/agent7-run.ts:820`.
- Impact: Positive pacing correction.
- Status: Expected behavior.
- Required action: None; keep as telemetry.

### ISSUE-02-15 - World-first enrichment warning is expected informational telemetry
- Severity: Operational
- Run signal: `World-First enrichment applied ...`
- Evidence source: `apps/worker/src/jobs/agents/agent7-run.ts:902`.
- Impact: Positive enrichment signal.
- Status: Expected behavior.
- Required action: None.

### ISSUE-02-16 - Scoring-enabled warning is expected runtime mode indicator
- Severity: Operational
- Run signal: `Scoring system enabled - tracking quality metrics and retries`
- Impact: None (informational).
- Status: Expected behavior.
- Required action: None.
