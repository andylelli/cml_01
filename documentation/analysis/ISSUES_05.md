# ISSUES_05

### ISSUE-05-01 - Discriminating test evidence_clues contain unresolved identifiers
- Severity: Critical
- Run signal: `Inference coverage: [critical] Discriminating test evidence_clues reference missing clue id(s): clock shows ten minutes past eleven, witnesses heard the clock chime at 7:55 PM, clock has a noticeable scratch`
- Evidence:
  - Critical warning lists three non-resolvable `evidence_clues` entries.
  - Entries appear to be prose snippets, not clue IDs.
- Impact: The discriminating-test proof chain cannot be evaluated, compromising fair-play verification.
- Status: Open.
- Required fix:
  1. Enforce `discriminating_test.evidence_clues` to contain valid clue IDs only.
  2. Add normalization/rejection logic in Agent 5 for non-ID strings before acceptance.
  3. Include explicit retry feedback listing invalid entries and expected ID format.
  4. Acceptance check: zero unresolved `evidence_clues` IDs post-retry.

### ISSUE-05-02 - Discriminating test has no resolvable evidence in clue set
- Severity: Critical
- Run signal: `Inference coverage: [critical] Discriminating test references no evidence found in the clue set`
- Evidence:
  - Additional critical warning persists in the same run after retry loop.
  - Run aborts in clues stage with no downstream progress.
- Impact: Core deduction discriminator is unsupported, reducing puzzle solvability and gate trustworthiness.
- Status: Open.
- Required fix:
  1. Preserve hard gate that blocks Agent 5 exit when discriminating evidence mapping is empty.
  2. Ensure retry prompt requires at least one concrete mapped clue object per discriminating test branch.
  3. Add regression test proving run failure if evidence mapping remains empty after retry.
  4. Acceptance check: no run exits Agent 5 while this condition is true.

### ISSUE-05-03 - Weak elimination/alibi evidence remains after retry
- Severity: High
- Run signal: `Pipeline failure: Agent 5 suspect-coverage gate failed after retry. Weak elimination/alibi evidence: Edgar Kendall, Nora Stratton`
- Evidence:
  - Retry warning flagged weak evidence suspects during targeted regeneration.
  - Final fatal error confirms unresolved weakness after retry budget exhausted.
- Impact: Suspect elimination logic remains under-specified, preventing reliable downstream narrative construction.
- Status: Open.
- Required fix:
  1. Tighten post-retry minimums for elimination/alibi evidence per non-culprit suspect.
  2. Keep attempt-indexed diagnostics with suspect names and clue IDs in both warning and error paths.
  3. Add deterministic fallback rejection when suspects only have neutral references without elimination/alibi anchors.
  4. Acceptance check: post-retry weak-evidence suspect set is empty on successful runs.

### ISSUE-05-04 - Red herring overlap with true solution still present
- Severity: High
- Run signal: `Inference coverage: [warning] 2 red herring(s) may accidentally support the true solution (rh_1, rh_2)`
- Evidence:
  - Overlap warning appears before final failure.
  - No run evidence that overlap was cleared in retry output.
- Impact: Red-herring clues can reinforce the true solution, weakening puzzle misdirection quality and fairness checks.
- Status: Open.
- Required fix:
  1. Keep contradiction checks that map overlap details to specific inference steps.
  2. Ensure retry correction pass rewrites or removes overlapping red-herring support lines.
  3. Emit final overlap diagnostics snapshot after retry for closure verification.
  4. Acceptance check: zero overlap warnings in final coverage state.
