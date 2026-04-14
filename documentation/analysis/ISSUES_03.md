# ISSUES_03

### ISSUE-03-01 - Agent 9 pre-prose abort on CML locked-fact contradiction
- Severity: Critical
- Run signal: `Pipeline failure: Agent 9 aborted before prose generation due to 1 CML integrity contradiction(s).`
- Evidence:
  - Contradiction warning emitted from `apps/worker/src/jobs/agents/agent9-run.ts:1103`.
  - Abort path raised at `apps/worker/src/jobs/agents/agent9-run.ts:1113`.
  - Run log contradiction: locked fact canonical `ten minutes past eleven` vs clue time `11:20 PM`.
- Impact: Hard stop before any prose chapter generation (`wordCounts.total=0`).
- Status: Open.
- Required fix:
  1. Add a pre-prose CML integrity normalization pass in `apps/worker/src/jobs/agents/agent9-run.ts` that rewrites or rejects clue time strings when they disagree with associated locked-fact canonical values.
  2. When disagreement is detected, emit structured diagnostics into `ctx.errors` with clue id, locked-fact id/description, canonical value, and parsed clue value.
  3. Abort before prose with actionable error text that identifies the exact CML field path(s) to correct.
  4. Acceptance check: run must fail before prose with contradiction details, and rerun with corrected CML must proceed to chapter generation.

### ISSUE-03-02 - Locked-fact canonical value and clue value are semantically divergent
- Severity: High
- Run signal: `[CML integrity] Locked fact ... conflicts with clue "clue_3" ... ("11:20 PM")`
- Evidence:
  - Conflict detector message template in `apps/worker/src/jobs/agents/agent9-run.ts:1103`.
  - This run includes exact value mismatch (`ten minutes past eleven` vs `11:20 PM`).
- Impact: Guaranteed downstream `locked_fact_missing_value` failures if prose proceeds.
- Status: Open.
- Required fix:
  1. Implement canonical time parsing normalization at CML assembly stage (`packages/prompts-llm/src/agent3-cml.ts` or immediate post-generation gate) so word-form and digit-form timestamps are converted to a common representation.
  2. Add AM/PM ambiguity handling rule: if locked fact lacks AM/PM but clue includes it, require explicit disambiguation in CML (do not silently infer).
  3. Enforce strict consistency rule: associated clue descriptions must match canonical locked-fact value semantically and format-wise.
  4. Acceptance check: contradictory pairs (`ten minutes past eleven` vs `11:20 PM`) are rejected; consistent equivalents pass.

### ISSUE-03-03 - Suspect clue coverage remained zero for at least one suspect
- Severity: High
- Run signal: `Inference coverage: [warning] 1 suspect(s) (Elliot Holman) are never referenced in any clue`
- Evidence:
  - Suspect-elimination warning emitted from clue checks in `apps/worker/src/jobs/agents/agent5-run.ts:187` and surfaced via `apps/worker/src/jobs/agents/agent5-run.ts:314`.
  - Targeted regen branch triggered at `apps/worker/src/jobs/agents/agent5-run.ts:379`.
- Impact: Weak suspect-elimination chain and higher risk of wrong-suspect deduction.
- Status: Open (regen triggered, but weakness persisted in blind-reader results).
- Required fix:
  1. In `apps/worker/src/jobs/agents/agent5-run.ts`, add final post-regeneration suspect-coverage gate that computes clue coverage per suspect using normalized name matching and clue subject/target fields.
  2. Require at least one elimination/alibi or direct evidence clue per non-culprit suspect.
  3. If coverage remains zero after retry, hard-fail Agent 5 instead of proceeding with warning-only state.
  4. Acceptance check: any run with uncovered suspects must stop in clues stage with explicit suspect list.

### ISSUE-03-04 - Blind reader still selected wrong suspect after clue regeneration
- Severity: High
- Run signal: `Blind reader simulation: reader suspected "Elliot Holman" ... actual culprit is "Miriam Sawyer"`
- Evidence:
  - Blind-reader simulation stage in `apps/worker/src/jobs/agents/agent6-run.ts:228` with result emission at `apps/worker/src/jobs/agents/agent6-run.ts:253`.
  - Run warning includes missing alibi/physical/witness data categories.
- Impact: Fair-play solvability quality remains below target despite regen.
- Status: Open.
- Required fix:
  1. Strengthen Agent 5 retry guardrails to require at least one discriminating clue for culprit and one elimination clue for each non-culprit suspect.
  2. Feed blind-reader miss categories directly into clue regeneration prompt (alibi gaps, physical-link gaps, witness-behavior gaps).
  3. Re-run blind-reader simulation after regeneration and block progression if simulated suspect != actual culprit with confidence below configured threshold.
  4. Acceptance check: blind reader must identify correct culprit or run fails before narrative/prose.

### ISSUE-03-05 - Critical blind-reader deduction insufficiency persisted
- Severity: Critical Warning
- Run signal: `CRITICAL: Blind reader cannot identify culprit. The clue set does not contain enough evidence for deduction.`
- Evidence:
  - Warning produced during fair-play/reader pass (`apps/worker/src/jobs/agents/agent6-run.ts` blind-reader flow).
  - Followed by later pre-prose abort on separate CML integrity issue.
- Impact: Even without CML contradiction, run quality would likely fail reader-level solvability expectations.
- Status: Open.
- Required fix:
  1. Convert current critical blind-reader warning into an enforceable gate in `apps/worker/src/jobs/agents/agent6-run.ts`.
  2. Define pass criteria: suspected culprit must equal actual culprit and confidence must be at least `likely` (or configured equivalent).
  3. On failure, trigger one bounded remediation cycle (clue regen + re-simulate); if still failing, abort pipeline.
  4. Acceptance check: no run can enter prose while blind-reader critical deduction insufficiency remains.

### ISSUE-03-06 - Narrative clue pacing deficit required heavy deterministic fill
- Severity: Medium-High
- Run signal: `Outline clue pacing below threshold: 4/19 scenes carry clues (minimum 12). Applying deterministic clue pre-assignment.`
- Evidence:
  - Threshold check at `apps/worker/src/jobs/agents/agent7-run.ts:811`.
  - Deterministic assignment completion message at `apps/worker/src/jobs/agents/agent7-run.ts:820`.
- Impact: Large upstream outline gap (4/19) indicates weak clue pacing from narrative generation; deterministic fill may reduce scene-natural clue grounding.
- Status: Open (mitigated in-run but root quality gap remains).
- Required fix:
  1. Tighten `agent7` prompt constraints to enforce minimum clue-bearing scene count at generation time (not post-hoc), including act-level distribution bounds.
  2. Add outline validation gate: if clue-bearing scenes < threshold, force narrative regeneration before deterministic pre-assignment.
  3. Restrict deterministic fill to small-gap correction only (for example max 2-3 scene inserts), otherwise treat as outline failure.
  4. Acceptance check: first-pass or regenerated outline should normally meet target with minimal deterministic intervention.

### ISSUE-03-07 - CML evidence-clue backfill frequency indicates upstream schema-completeness weakness
- Severity: Medium
- Run signal: `CML gate: back-filled evidence_clues with 8 essential clue(s)`
- Evidence:
  - Backfill injection in `apps/worker/src/jobs/mystery-orchestrator.ts:355`.
- Impact: Heavy post-hoc structural patching can mask recurring CML authoring defects and weaken traceability.
- Status: Open (operational mitigation exists).
- Required fix:
  1. Add stricter CML generation prompt/schema checks in `packages/prompts-llm/src/agent3-cml.ts` to require complete `evidence_clues` coverage before acceptance.
  2. Track backfill metrics per run and fail CML quality gate when backfill exceeds configured threshold.
  3. Emit explicit backfill diff artifacts (which clues were injected and why) to keep traceability.
  4. Acceptance check: repeated runs should show backfill count trending to near-zero.

### ISSUE-03-08 - Operational telemetry warning: scoring-enabled mode (expected)
- Severity: Operational
- Run signal: `Scoring system enabled - tracking quality metrics and retries`
- Evidence: Runtime warning line in run log.
- Impact: None; informational mode indicator.
- Status: Expected behavior.
- Required action: None.
