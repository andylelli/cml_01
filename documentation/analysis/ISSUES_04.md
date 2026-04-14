# ISSUES_04

### ISSUE-04-01 - Agent 5 hard-fails after retry with uncovered suspects
- Severity: Critical
- Run signal: `Pipeline failure: Agent 5 suspect-coverage gate failed after retry. Uncovered suspects: Wyn Griffiths, Angharad Price`
- Evidence:
  - Stage warning: `Agent 5: 1 suspect(s) have zero clue coverage; regenerating with targeted suspect feedback`
  - Follow-up warning still lists uncovered suspects: `Wyn Griffiths, Angharad Price`
  - Final abort occurred in `clues` stage with no downstream progress.
- Impact: Pipeline terminates before fair-play, narrative, and prose (`wordCounts.total=0`).
- Status: Open.
- Required fix:
  1. In `apps/worker/src/jobs/agents/agent5-run.ts`, enforce per-suspect minimum clue coverage after regeneration for every non-culprit suspect.
  2. Require clue type diversity per uncovered suspect: at least one elimination/alibi anchor or direct contradictory evidence.
  3. Emit structured retry diagnostics by suspect name and clue ids attempted/missing.
  4. Acceptance check: runs with uncovered suspects fail fast with deterministic diagnostics; successful runs show zero uncovered suspects post-retry.

### ISSUE-04-02 - Discriminating test lacks evidence linkage in clue set
- Severity: High
- Run signal: `Inference coverage: [critical] Discriminating test references no evidence found in the clue set`
- Evidence:
  - Critical inference coverage warning emitted before clue-stage failure.
  - No successful clue correction eliminated this warning in the same run.
- Impact: Even if suspect coverage were repaired, core fair-play proof chain remains under-specified.
- Status: Open.
- Required fix:
  1. Add a hard pre-exit gate in Agent 5 requiring discriminating-test references to map to at least one existing clue id.
  2. During retry prompting, inject explicit missing mapping requirements (`discriminating_test.evidence_clues` plus matching clue objects).
  3. Reject clue sets where discriminating-test evidence entries are missing, empty, or non-resolvable.
  4. Acceptance check: no run exits Agent 5 while this critical warning condition remains true.

### ISSUE-04-03 - Red herring clues may support true solution
- Severity: High
- Run signal: `Inference coverage: [warning] 2 red herring(s) may accidentally support the true solution`
- Evidence:
  - Warning surfaced during inference coverage analysis in the same failed run.
  - No evidence in the run that retry removed the overlap risk.
- Impact: Ambiguous or self-undermining clue logic reduces puzzle quality and may mislead blind-reader deduction checks.
- Status: Open.
- Required fix:
  1. Add deterministic contradiction checks between red-herring implications and culprit-supporting evidence.
  2. During retry, force red-herring rewrite when semantic overlap with true-solution support is detected.
  3. Log overlap pairs (red_herring_id -> supporting clue/inference ids) for traceability.
  4. Acceptance check: post-retry coverage report contains zero red-herrings-support-true-solution warnings.

### ISSUE-04-04 - Retry messaging inconsistency in suspect coverage counts
- Severity: Medium
- Run signal:
  - `Agent 5: 1 suspect(s) have zero clue coverage...`
  - `2 suspect(s) (Wyn Griffiths, Angharad Price) are never referenced in any clue`
- Evidence:
  - Same run emits two conflicting suspect-count messages prior to failure.
- Impact: Diagnostic ambiguity makes root-cause triage harder and can mislead automated quality dashboards.
- Status: Open.
- Required fix:
  1. Standardize suspect-coverage reporting to compute uncovered set once per attempt and reuse it across all warning/error messages.
  2. Include attempt index in each message (`attempt 1`, `retry 1`) and stable suspect list ordering.
  3. Add unit test ensuring warning and fatal error counts/names are consistent for the same attempt state.
  4. Acceptance check: all suspect-coverage messages in a run agree on count and names.
