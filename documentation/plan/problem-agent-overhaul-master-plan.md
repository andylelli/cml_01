# Problem-Agent Overhaul Master Plan

Date: 2026-05-06
Owner: CML pipeline engineering
Primary references:
- documentation/analysis/ANALYSIS_05/ANALYSIS_05.md
- documentation/analysis/ANALYSIS_06/ANALYSIS_06.md
- documentation/11_canary_loop/11_canary_loop.md
- documentation/10_prose_generation/10_prose_generation.md
- documentation/plan/execution-backlog.md

## 1) Mission and Quality Bar

This plan defines a complete ground-up overhaul of the problem-agent chain so the system reliably generates fair-play, high-quality Golden Age mysteries without late-stage structural collapse.

High-quality system target:
1. Fair-play structure is validated before prose generation.
2. Reader-visible clue logic is consistent, complete, and deducible.
3. Prose obligations are met chapter-by-chapter on first pass or bounded retry.
4. Novelty risks are prevented early, not discovered at final audit.
5. Telemetry explains failures with deterministic, action-ready diagnostics.

Program-level acceptance target:
1. No Agent 9 aborts from missing mandatory clue-observation-plus-inference structure in early chapters across validation suite.
2. No unresolved critical Information Parity or Solution Uniqueness violations reaching prose start.
3. No audit-language clue synthesis in Agent 6 paths.
4. Stable pass-rate trend in full core runs and boundary canary runs.

## 1.1) Verified Current-State Truths (from latest run evidence)

These points are treated as factual inputs to this plan and must not be hand-waved during implementation:
1. Agent 9 can abort with zero chapters generated when chapter obligations fail repeatedly.
2. Critical fair-play violations (Information Parity and Solution Uniqueness) can remain unresolved late in the pipeline.
3. Runtime can perform discriminating-test evidence clue backfill, indicating upstream evidence completeness is not guaranteed by construction.
4. Novelty can fail on critical violation even when aggregate numeric score appears above threshold.
5. Boundary canary reliability requires real command execution, not placeholder pass behavior.

## 2) Ground-Up Operating Model (Validated Architecture)

The overhauled system will run as a strict layered pipeline with deterministic gates between layers.

Layer A: Invariant Policy (static)
1. Fair-play invariants.
2. Golden Age style and setting constraints.
3. CML and schema contracts.

Layer B: Machine-Readable Run Contract (dynamic)
1. Allowed source paths.
2. Required clue IDs and mappings.
3. Step-level contradiction and elimination requirements.
4. Discriminating-test evidence timing and parity requirements.

Layer C: Generation (LLM)
1. Agent 5 generates clues using a stable, minimal baseline prompt.
2. Agent 9 generates prose from validated clue graph and chapter obligation ledger.

Layer D: Deterministic Validation and Routing
1. Reject/repair before downstream agent entry.
2. Typed failure codes and bounded retry scopes.
3. No progression when critical structural gates are red.

Layer E: Audit and Telemetry
1. Agent 6 judges fairness and routes remediation.
2. Diagnostics include exact failure classes, IDs, and gate outcomes.
3. Canary and core reports remain parity-aligned with runtime behavior.

Why this works holistically:
1. It separates policy, contract, generation, and adjudication.
2. It removes architectural dependence on prompt obedience for proof-critical logic.
3. It guarantees that prose sees only structurally admissible mystery logic.

## 3) Scope of Problem Agents and Adjacent Components

Primary overhaul agents:
1. Agent 5 (clue generation and contract compliance).
2. Agent 6 (fair-play adjudication and remediation routing).
3. Agent 9 (prose generation and chapter obligation compliance).
4. Agent 8 (novelty risk control strategy).

Adjacent mandatory components:
1. Agent 3 and Agent 4 evidence-clue planning/revision handshake.
2. Orchestrator stage-gate policy.
3. Prompt layer in packages/prompts-llm.
4. Canary and report telemetry contracts.

## 4) Workstreams and Deep-Dive Implementation Items

## WS1 - Contract-First Clue Generation (Agent 5)

### Item WS1.1 - Freeze baseline prompt doctrine
Objective:
1. Keep only timeless, generic behavior rules in default Agent 5 prompt.

Implementation:
1. Remove run-shaped mapping prose from default prompt path.
2. Remove historical hardening labels from user-facing prompt sections.
3. Keep invariant fair-play and anti-invention clauses.

Validation:
1. Snapshot tests for prompt surface stability.
2. Assert absence of run-shaped mapping blocks in first-pass default mode.

Exit criteria:
1. Prompt remains generic across runs while still encoding core invariants.

### Item WS1.2 - Introduce strict run-contract object as single source of truth
Objective:
1. Move proof-critical requirements out of prose and into machine-readable contract payload.

Implementation:
1. Define contract schema: allowed paths, required IDs, per-step coverage, parity floors, timing floors.
2. Build contract from CML + hard logic + discriminating test design.
3. Version contract and include hash in telemetry.

Validation:
1. Unit tests for schema and contract builder determinism.
2. Contract hash unchanged for identical inputs.

Exit criteria:
1. All proof-critical constraints are represented in contract payload, not prompt prose.

### Item WS1.3 - Deterministic pre-Agent6 hard gate
Objective:
1. Agent 6 only sees structurally admissible clue graphs.

Implementation:
1. Run deterministic validator immediately after Agent 5 output.
2. Emit typed violation set.
3. If violations remain after bounded repair, stop and route to upstream revision instead of downstream audit.

Validation:
1. Integration test proving Agent 6 is skipped when critical structural gate is red.
2. Telemetry field confirms gate decision and violation IDs.

Exit criteria:
1. No structurally invalid clue graph enters Agent 6 audit path.

### Item WS1.4 - Bounded delta retry protocol
Objective:
1. Replace broad retries with targeted repair edits.

Implementation:
1. Retry packet includes only violation codes, affected clue IDs, and allowed edit windows.
2. Preserve unaffected clues by default.
3. Cap retry attempts and enforce no-op detection.

Validation:
1. Tests for retry idempotence and no-op termination.
2. Assert unchanged clue subset is preserved.

Exit criteria:
1. Retry loop is deterministic, finite, and traceable.

## WS2 - Fair-Play Judge Refactor (Agent 6)

### Item WS2.1 - Remove clue synthesis authority
Objective:
1. Agent 6 is adjudicator/router, not structure author.

Implementation:
1. Delete any audit-language-driven or non-case-grounded clue synthesis.
2. Keep typed violation reporting and remediation routing.

Validation:
1. Unit tests assert no synthetic audit-language clues are emitted.
2. Log scan confirms absence of meta clue classes.

Exit criteria:
1. Agent 6 cannot create new proof structure from audit prose.

### Item WS2.2 - Typed remediation routing
Objective:
1. Route failures to correct upstream owner by failure type.

Implementation:
1. Define routing map:
   - structure defects -> Agent 5 contract repair or Agent 4 revision.
   - world/narrative causality defects -> Agent 4 revision.
   - prose realization defects -> Agent 9 retry packet.
2. Enforce no progress when critical parity/uniqueness remain unresolved.

Validation:
1. Contract tests for routing map decisions.
2. End-to-end test: unresolved critical fair-play blocks prose start.

Exit criteria:
1. Fair-play failures are resolved upstream before prose begins.

## WS3 - Upstream Evidence Planning Hardening (Agent 3 and Agent 4)

### Item WS3.1 - Evidence clue completeness at CML stage
Objective:
1. Prevent late evidence_clue backfills.

Implementation:
1. Add CML-stage evidence clue checklist generation tied to discriminating test design.
2. Enforce required evidence IDs and rationale links before CML acceptance.

Validation:
1. Tests where missing evidence_clues fail at CML gate.
2. Diagnostic confirms zero runtime backfill in passing runs.

Exit criteria:
1. CML output includes complete discriminating-test evidence mapping by construction.

### Item WS3.2 - Revision loop focused on parity and uniqueness
Objective:
1. Resolve root-cause causality gaps before downstream agents.

Implementation:
1. Agent 4 revision packets receive typed unresolved fair-play violations.
2. Revision acceptance requires parity and uniqueness closure evidence.

Validation:
1. Regression suite for historical parity/uniqueness failures.
2. Telemetry shows closures before Agent 9 start.

Exit criteria:
1. Critical parity and uniqueness defects do not survive into prose phase.

## WS4 - Prose Obligation Engine Overhaul (Agent 9)

### Item WS4.1 - Mandatory clue observation plus inference ledger
Objective:
1. Ensure chapter-level obligation realization is deterministic and auditable.

Implementation:
1. Build chapter obligation ledger as machine-checked checklist.
2. For each required clue obligation, require:
   - on-page observation in mandated early paragraph window.
   - immediate explicit inference paragraph.
3. Validate both clauses before chapter commit.

Validation:
1. Unit tests for ledger parser/validator.
2. Integration tests reproducing Chapter 1 failure from ANALYSIS_06 and proving pass after fix.

Exit criteria:
1. Agent 9 cannot commit chapter that misses mandatory observation-inference pair.

### Item WS4.2 - Retry strategy for chapter obligation misses
Objective:
1. Recover quickly from obligation misses without full narrative drift.

Implementation:
1. Retry packet references exact missing obligation IDs and paragraph window constraints.
2. Restrict rewrite scope to chapter-local text with fixed preserved anchors.
3. Cap retries and return structured failure report on exhaustion.

Validation:
1. Tests for localized repair and preserved unaffected chapter content.
2. Retry exhaustion report includes exact unmet obligations.

Exit criteria:
1. Obligation misses are either fixed deterministically or failed with precise diagnostics.

### Item WS4.3 - Pre-prose admission gate
Objective:
1. Prose phase starts only when upstream structural/fair-play gates pass.

Implementation:
1. Add orchestrator pre-prose admission check requiring:
   - structural gate green.
   - fair-play critical gate green.
   - evidence mapping complete.
2. Fail fast if any admission predicate is false.

Validation:
1. Integration tests for blocked prose start on red gates.
2. Report includes admission gate decision details.

Exit criteria:
1. No wasted Agent 9 attempts on structurally inadmissible runs.

## WS5 - Novelty Risk Prevention (Agent 8 and upstream controls)

### Item WS5.1 - Upstream novelty guardrails
Objective:
1. Catch high-risk mechanism overlap before final novelty audit.

Implementation:
1. Add pre-outline novelty heuristics on method pattern and false-assumption structure.
2. If risk exceeds threshold, force upstream variation revision before prose investment.

Validation:
1. Regression cases for clock-tampering/timing-overlap pattern.
2. Lower recurrence rate of critical similarity violations.

Exit criteria:
1. Novelty risk is prevented upstream instead of discovered at end.

### Item WS5.2 - Actionable novelty remediation packet
Objective:
1. Make novelty failures fixable with precise edits.

Implementation:
1. Emit remediation packet with offending pattern dimensions and accepted alternatives.
2. Route to appropriate upstream agents for targeted divergence edits.

Validation:
1. Tests confirming remediation packet fields and routing.
2. Post-remediation similarity score reduction in canary replay.

Exit criteria:
1. Novelty failures trigger deterministic, targeted corrective flow.

## WS6 - Orchestrator and Stage-Gate Policy

### Item WS6.1 - Canonical gate state machine
Objective:
1. Define one authoritative stage progression policy.

Implementation:
1. Formalize gate states and transitions.
2. Encode hard-stop transitions for unresolved critical defects.
3. Add gate snapshots into run report.

Validation:
1. State transition tests.
2. Run report parity check against actual transitions.

Exit criteria:
1. Stage progression is deterministic, explainable, and policy-aligned.

### Item WS6.2 - Typed failure taxonomy
Objective:
1. Unify failure classes across runtime, canary, and docs.

Implementation:
1. Define global failure code set and severity levels.
2. Replace free-form string checks in routing where feasible.

Validation:
1. Schema tests for failure object shape.
2. Canary classifier precision improvement for known classes.

Exit criteria:
1. Failure handling is consistent across agents and telemetry surfaces.

## WS7 - Telemetry, Reporting, and Canary Alignment

### Item WS7.1 - Report parity and evidence linking
Objective:
1. Every gate decision and failure is traceable to contract IDs.

Implementation:
1. Add contract hash, violation IDs, gate decisions, and retry lineage to reports.
2. Keep markdown and JSON summary parity.

Validation:
1. Report invariants test suite.
2. Manual audit of one full failed run and one passed run.

Exit criteria:
1. Reports are sufficient for deterministic root-cause analysis without raw log spelunking.

### Item WS7.2 - Canary command realism and boundary correctness
Objective:
1. Ensure boundary canaries exercise real behavior, not stubs.

Implementation:
1. Replace placeholder Agent 9 canary path with real hydrated boundary execution.
2. Keep runId/startChapter semantics tied to real artifacts.
3. Ensure validation runs that are expected to execute canary commands do not silently remain in planning-only suggest mode.

Validation:
1. Boundary run emits real gate outcomes and chapter diagnostics.
2. No synthetic pass-only placeholder output.

Exit criteria:
1. Canary signals reflect true runtime behavior.

## 5) End-to-End Validation Program

## Phase A - Unit and contract tests
1. Prompt baseline snapshots.
2. Contract builder and validator determinism tests.
3. Routing map tests.
4. Prose obligation ledger tests.
5. Failure taxonomy schema tests.

## Phase B - Integration tests
1. Agent 5 -> deterministic gate -> Agent 6 routing tests.
2. Fair-play critical red blocks Agent 9 admission.
3. Agent 9 chapter obligation miss and targeted retry behavior.
4. Novelty upstream guard and remediation routing.

## Phase C - Replay suite
1. Replay failing runs from ANALYSIS_06 class and historical buckets.
2. Verify no regression on passing reference runs.

## Phase D - Canary and core acceptance
1. Boundary canary for Agent 5, Agent 6, Agent 9.
2. Full core run acceptance trend over rolling window.

Success metrics:
1. Zero prose_generation_aborted due to missing mandatory clue observation/inference on acceptance suite.
2. Significant reduction in Agent 5 sanitizer/repair churn events per run.
3. Zero critical fair-play unresolved issues at prose admission.
4. Zero critical novelty violations on acceptance suite; downward trend in similarity risk metrics outside suite.
5. Increased core pass rate with stable or improved narrative quality scores.

## 5.1) Incremental Verification Protocol (Mandatory)

This overhaul must be implemented and validated as vertical slices. No workstream is allowed to defer verification to end-of-program.

Core rule:
1. Every slice must be code-complete, test-complete, telemetry-visible, and promotion-gated before the next slice begins.

## 5.1.1 Slice Definition

A valid slice includes all of the following:
1. One bounded behavior change (single objective and explicit non-goals).
2. Tests for the changed behavior (unit and integration minimum).
3. At least one run artifact proving runtime effect (boundary canary or replay output).
4. Report and log signals showing pass/fail state for the slice.

## 5.1.2 Verification Ladder per Slice

Each slice runs the same ladder in this exact order:
1. Static and schema checks for modified contracts/payloads.
2. Unit tests for local logic (validator, mapper, gate, packet builders).
3. Integration tests for stage-routing behavior and stop/progress conditions.
4. Boundary canary run for affected agent(s).
5. Targeted replay run from ANALYSIS_06 failure class.
6. One full core run after slice passes the above.

Promotion rule:
1. A slice is promotable only if every ladder step is green.

## 5.1.3 Fast Gate and Slow Gate

Fast gate (required pre-merge):
1. Unit and integration suite for touched modules.
2. Boundary canary run for touched agent.
3. One replay case from known failing class.

Slow gate (required post-merge before next slice default-on):
1. Full core run with fresh report.
2. Report parity verification (JSON and markdown summary alignment).
3. Metric delta review versus baseline.

## 5.1.4 Slice Scorecard (Required Metrics)

The following metrics must be captured per slice and compared to previous baseline:
1. Agent 9 abort count and abort reason distribution.
2. Critical fair-play unresolved count at prose admission.
3. Runtime evidence_clue backfill count.
4. Critical novelty violation count.
5. Retry exhaustion count.
6. Repair churn count (Agent 5 sanitizer and strict repair events).

Decision thresholds:
1. Any increase in critical failure counts is a block unless explicitly approved with mitigation.
2. No-regression minimum applies to all non-targeted dimensions.
3. Targeted dimension must improve or produce a justified neutral result with additional evidence.

## 5.1.5 Shadow Mode Before Hard Gate Changes

For major gate behavior changes:
1. Run shadow evaluation first (compute gate decision without enforcing stop).
2. Log predicted decision and rationale.
3. Promote to hard gate only after stable shadow outcomes across required sample window.

Shadow window minimum:
1. Three boundary canary runs plus two full core runs with no contradictory outcomes.

## 5.1.6 Feature Flag Policy

All workstreams must be flaggable during rollout.

Required behavior:
1. Flag-off preserves current baseline behavior.
2. Flag-on enables only the intended slice behavior.
3. Flags are independently switchable to isolate regressions.
4. Flag state is stamped into run telemetry.

## 5.1.7 Rollback and Stop Conditions

Immediate rollback/stop triggers:
1. New critical fair-play regressions at prose admission.
2. Increased Agent 9 abort frequency for non-targeted causes.
3. Report invariant violations.
4. Canary misclassification caused by telemetry contract drift.

Rollback action:
1. Disable current slice flag.
2. Preserve artifacts and diagnostics.
3. Open corrective mini-slice with root-cause and bounded fix.

## 5.1.8 Workstream-to-Slice Verification Map

WS1 (Agent 5 contract-first):
1. Verify deterministic contract builder and gate decisions.
2. Verify Agent 6 is skipped when structural gate is red.

WS2 (Agent 6 adjudicator):
1. Verify no clue synthesis from audit language.
2. Verify typed routing for unresolved parity/uniqueness.

WS3 (Agent 3/4 upstream evidence):
1. Verify no late evidence_clue backfill on passing runs.
2. Verify parity/uniqueness closure before prose admission.

WS4 (Agent 9 obligations):
1. Verify observation+inference obligations per chapter.
2. Verify bounded localized retry and explicit exhaustion diagnostics.

WS5 (novelty prevention):
1. Verify upstream novelty risk detection.
2. Verify targeted remediation packet effectiveness.

WS6 (orchestrator and taxonomy):
1. Verify gate state transition determinism.
2. Verify typed failure taxonomy parity across runtime and canary.

WS7 (telemetry and canary):
1. Verify JSON/markdown report parity.
2. Verify boundary canaries execute real runtime paths.

## 5.1.9 Deprecation Checklist for Remove Items

Each remove item in Section 7 must have a concrete deletion/disable check before overhaul sign-off.

Remove item 1 (prompt-level run-shaped mapping doctrine):
1. Prompt snapshot asserts absence in default first-pass path.

Remove item 2 (audit-language clue synthesis):
1. Unit tests assert no emitted clue class from audit-language synthesis path.
2. Log scan confirms no such clue IDs/classes in runtime output.

Remove item 3 (broad retry doctrine replay loops):
1. Retry packet schema asserts bounded delta-only payload.
2. Integration tests enforce preserved unaffected clue/prose segments.

Remove item 4 (progression to prose with unresolved critical fair-play):
1. Pre-prose admission gate test must fail on unresolved critical parity/uniqueness.

Remove item 5 (placeholder boundary canary synthetic pass):
1. Boundary canary test must demonstrate real hydrated execution and non-placeholder status.

## 5.1.10 Artifact Requirements per Slice

Every slice must attach:
1. Before/after metric table for required scorecard fields.
2. Fast gate outputs (test and canary logs).
3. Slow gate outputs (core run report paths and summary deltas).
4. Explicit go/no-go decision and approver.

## 6) Rollout Strategy

Stage 0 - Instrument and freeze baseline
1. Freeze current metrics and failure baselines.
2. Introduce feature flags for each workstream.

Stage 1 - Agent 5 and gate-first controls
1. Deploy WS1 and WS6 admission changes behind flags.
2. Validate with full fast gate and slow gate before core default.

Stage 2 - Agent 6 and upstream revision routing
1. Deploy WS2 and WS3.
2. Verify critical fair-play closure before prose.
3. Require no-regression scorecard sign-off before advancing to Stage 3.

Stage 3 - Agent 9 obligation engine
1. Deploy WS4 with strict chapter ledger checks.
2. Observe abort-class elimination trend.
3. Keep flag-gated until two consecutive slow gates pass.

Stage 4 - Novelty prevention and telemetry parity
1. Deploy WS5 and WS7.
2. Finalize report parity docs and examples.
3. Validate novelty and telemetry metrics against no-regression thresholds.

Stage 5 - Default-on and cleanup
1. Remove deprecated prompt layers and obsolete fallback paths.
2. Update all related docs under documentation/11_canary_loop and documentation/10_prose_generation.

## 7) Keep, Change, Remove Matrix

Keep:
1. Hard-stop gates.
2. Core v6 invariant doctrine.
3. Deterministic validators and rich telemetry.

Change:
1. Prompt vs contract separation.
2. Gate timing and orchestrator progression.
3. Agent 6 role boundaries.
4. Agent 9 obligation realization and retry scope.
5. Novelty prevention placement.

Remove:
1. Prompt-level run-shaped mapping doctrine in default path.
2. Audit-language clue synthesis behavior.
3. Broad retry doctrine replay loops.
4. Progression to prose with unresolved critical fair-play defects.
5. Placeholder boundary canary behaviors that report synthetic pass.

## 8) Risks and Mitigations

Risk 1: Over-constraining generation reduces creative quality.
Mitigation:
1. Keep constraints in machine checks while preserving flexible prose style prompts.
2. Add narrative-quality non-regression suite.

Risk 2: Gate strictness increases early failures temporarily.
Mitigation:
1. Introduce staged rollout and detailed diagnostics.
2. Track mean-time-to-fix with typed remediation packets.

Risk 3: Novelty guard false positives.
Mitigation:
1. Use calibrated thresholds and secondary pattern checks.
2. Allow controlled override path with explicit audit note.

Risk 4: Telemetry drift between JSON and markdown reports.
Mitigation:
1. Add report invariant tests and schema contracts.

## 9) Documentation and Governance Requirements

For each merged workstream:
1. Update runtime behavior docs under documentation/11_canary_loop.
2. Update prose behavior docs under documentation/10_prose_generation.
3. Update plan/LLD docs when control-flow behavior changes.
4. Include before/after evidence from canary and core runs.

Definition of done for the overhaul:
1. Acceptance metrics met for two consecutive validation windows.
2. All deprecated behaviors in Remove list eliminated from active runtime paths.
3. Ground-up operating model is reflected in code, tests, and telemetry artifacts.
4. Every workstream completed through incremental verification protocol with archived slice artifacts.
