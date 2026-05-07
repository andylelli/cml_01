# ANALYSIS_07 - Agent Complexity vs Task Complexity

Date: 2026-05-07
Scope: Evaluate each pipeline agent by comparing intrinsic task complexity to current implementation complexity, then identify removable or simplifiable layers.

## Goal

Identify where implementation complexity is higher than the task itself requires, and isolate the best cuts that reduce retries, branching, and post-hoc repair.

## Rerun Delta (Post Phase A/B/C Implementation)

Date: 2026-05-07 (rerun after implementing architecture and gate changes)

This rerun compares the original ANALYSIS_07 baseline against the current implementation state after:
- Agent 6 escalation policy extraction into a deterministic module.
- Early structural abort boundary right after Agent 6.
- Agent 7 pre-commit completeness bundled remediation gate.
- Agent 9 hard precondition on blocking outline coverage issues.
- Phase outcome parity hardening (`run_outcome` authority and `passed` derivation).
- Regression tests for early-stop and report parity invariants.

## What Changed Since Baseline

### Complexity delta by affected area

| Area | Baseline assessment | Current assessment | Delta |
|---|---|---|---|
| Agent 6 escalation path | High impl complexity with embedded escalation branching (Medium gap) | Deterministic escalation policy extracted and reused (Small-Medium gap) | Improved |
| Orchestrator failure boundary | Late abort after additional downstream work | Early structural hard-stop immediately after Agent 6 | Improved |
| Agent 7 outline quality control | Multiple serial gates with fragmented correction loops | Added bundled pre-commit remediation pass, but serial gate stack still large | Partial improvement |
| Agent 9 pre-prose admission control | Prose stage could start despite unresolved outline structural gaps | Blocks prose start on missing discriminating-test/suspect-closure outline issues | Improved |
| Status/telemetry parity | Risk of outcome/status drift across report fields | `passed` now derived from `run_outcome`; invariant enforces failed-outcome parity | Improved |
| Agent 5 / Agent 65 prompt contracts | More reliance on post-fix fallback | Stronger first-pass contract requirements added | Partial improvement |

### Agent complexity matrix updates (changed rows only)

| Agent | Intrinsic complexity | Baseline implementation complexity | Current implementation complexity | Gap change | Notes |
|---|---|---|---|---|---|
| Agent 5 | High | High | High | Medium -> Medium-Small | First-pass contract hardening reduced some repair pressure, but retry chain remains sizable. |
| Agent 6 | High | High | Medium-High | Medium -> Small-Medium | Escalation policy extraction reduced hidden state-machine complexity. |
| Agent 7 | High | High | High | Medium -> Medium | Bundled pre-commit remediation helps, but gate topology is still serial-heavy. |
| Agent 9 | High | High | Medium-High | Medium -> Small-Medium | New precondition gate removes avoidable prose-stage churn on known structural blockers. |

### Plan status against original phases

| Original plan item | Status | Evidence summary |
|---|---|---|
| Phase A.3 Extract Agent 6 escalation policy | Done | Policy module extracted and wired into Agent 6 decisions. |
| Phase B.1 Move Agent 5/65 toward first-pass constraints | Partial | Contracts strengthened; not all post-hoc fallback eliminated. |
| Phase B.2 Add pre-commit completeness checks for outline/prose | Done | Outline pre-commit remediation and prose precondition hard-stop are both active. |
| Phase B.3 Collapse serial retries into bundled remediation per phase | Partial | Bundled remediation added for one critical outline boundary; broader serial retries remain. |
| Phase C.1 Single source of truth for gate status | Done | Report pass/fail derives from canonical run outcome. |
| Phase C.3 Regression tests for parity and early-stop semantics | Done | New tests cover early structural abort and failed-outcome parity invariant. |

## Updated Net Assessment

The original ANALYSIS_07 hypothesis was correct: most removable complexity sat in orchestration overhead, not task complexity. After current changes, complexity has shifted downward in the highest-impact failure paths (Agent 6 escalation, early abort boundary, pre-prose admission checks, status parity).

The largest remaining simplification opportunity is still retry topology consolidation:
- Shared retry orchestrator is not yet broadly rolled out.
- Agent 7 and related phases still carry layered serial gate/retry patterns.
- Agent 5 still has high retry category fan-out despite stronger first-pass contracts.

## Revised Priority Order

1. Complete shared retry orchestrator rollout across Agent 2x, Agent 5, Agent 6, Agent 7.
2. Finish serial-to-composite gate consolidation for Agent 7 and Agent 5.
3. Continue shifting non-safety deterministic repairs into first-pass contracts (especially Agent 5).
4. Keep status parity invariants strict and expand to any remaining progress-vs-report vocabulary drift.

## Strict Numeric Delta Table (Before vs Now)

Scoring model used for strict comparison:
- Implementation complexity score (1-5):
  - 1=Low, 2=Low-Medium, 3=Medium, 4=Medium-High, 5=High
- Orchestration overhead score (1-5):
  - 1=Small gap, 2=Small-Medium, 3=Medium, 4=Medium-Large, 5=Large

Interpretation:
- Lower is better for both scores.
- Negative delta means simplification/improvement.

| Agent | Impl Before | Impl Now | Impl Delta | Overhead Before | Overhead Now | Overhead Delta | Status |
|---|---:|---:|---:|---:|---:|---:|---|
| Agent 1 | 3 | 3 | 0 | 3 | 3 | 0 | Unchanged |
| Agent 2 | 5 | 5 | 0 | 3 | 3 | 0 | Unchanged |
| Agent 2b | 5 | 5 | 0 | 3 | 3 | 0 | Unchanged |
| Agent 2c | 3 | 3 | 0 | 1 | 1 | 0 | Unchanged |
| Agent 2d | 3 | 3 | 0 | 1 | 1 | 0 | Unchanged |
| Agent 2e | 3 | 3 | 0 | 3 | 3 | 0 | Unchanged |
| Agent 3b | 5 | 5 | 0 | 2 | 2 | 0 | Unchanged |
| Agent 3 | 5 | 5 | 0 | 1 | 1 | 0 | Unchanged |
| Agent 4 | 5 | 5 | 0 | 5 | 5 | 0 | Unchanged |
| Agent 5 | 5 | 5 | 0 | 3 | 2 | -1 | Improved (partial) |
| Agent 6 | 5 | 4 | -1 | 3 | 2 | -1 | Improved |
| Agent 65 | 5 | 5 | 0 | 3 | 3 | 0 | Unchanged |
| Agent 7 | 5 | 5 | 0 | 3 | 3 | 0 | Improved (localized only) |
| Agent 8 | 4 | 4 | 0 | 3 | 3 | 0 | Unchanged |
| Agent 9 | 5 | 4 | -1 | 3 | 2 | -1 | Improved |

Aggregate delta:
- Total implementation complexity score: 66 -> 64 (delta -2)
- Total orchestration overhead score: 40 -> 37 (delta -3)

Conclusion from strict numeric comparison:
- Measurable simplification has occurred, concentrated in Agent 6 and Agent 9, with partial overhead reduction in Agent 5.
- Most remaining complexity still sits in retry topology and multi-gate serial logic outside the newly hardened boundaries.

## Evidence Base

- documentation/03_Agents/01_agent_1_era_setting.md
- documentation/03_Agents/02_agent_2_cast.md
- documentation/03_Agents/03_agent_2b_character_profiles.md
- documentation/03_Agents/04_agent_2c_location_profiles.md
- documentation/03_Agents/05_agent_2d_temporal_context.md
- documentation/03_Agents/06_agent_2e_background_context.md
- documentation/03_Agents/07_agent_3_cml_generator.md
- documentation/03_Agents/08_agent_3b_hard_logic_devices.md
- documentation/03_Agents/09_agent_4_cml_revision.md
- documentation/03_Agents/10_agent_5_clues_red_herrings.md
- documentation/03_Agents/11_agent_6_fair_play_auditor.md
- documentation/03_Agents/12_agent_65_world_builder.md
- documentation/03_Agents/13_agent_7_narrative_outliner.md
- documentation/03_Agents/14_agent_8_novelty_auditor.md
- documentation/03_Agents/15_agent_9_prose_generator.md
- documentation/07_workflow/07_workflow.md
- memories/repo/agent5-strict-contract-enforcement.md
- memories/repo/agent9-prose-completeness-gates.md
- memories/repo/knowledge-revealed-grounding-precheck.md

## Rating Model

- Intrinsic task complexity: Low, Medium, High
- Implementation complexity: Low, Medium, High
- Complexity gap:
  - Small = implementation roughly matches task
  - Medium = measurable orchestration overhead
  - Large = layered retries/patching/branching likely exceeds task need

## Baseline Agent-by-Agent Complexity Matrix (Initial Pass)

| Agent | Core task | Intrinsic complexity | Initial-pass implementation complexity | Gap | Simplifiable layers |
|---|---|---|---|---|---|
| Agent 1 | Era/setting grounding | Low | Medium | Medium | Merge overlapping retry tracks into one unified retry wrapper. |
| Agent 2 | Cast design and suspect structure | Medium | High | Medium | Reduce pre/post normalization + fallback layering by tightening first-pass contract. |
| Agent 2b | Character profiles | Medium | High | Medium | Collapse separate validation/scoring/profile-repair retries into one loop. |
| Agent 2c | Location profiles | Low-Medium | Medium | Small | Standardize retry policy and remove custom per-agent branching. |
| Agent 2d | Temporal context | Low-Medium | Medium | Small | Narrow schema surface or enforce stricter prompt shape to reduce repair passes. |
| Agent 2e | Background context synthesis | Low | Medium | Medium | Consider deterministic synthesis for portions now handled by LLM retries. |
| Agent 3b | Hard-logic device ideation | Medium-High | High | Small-Medium | Keep complexity but reduce type-normalization/retry duplication. |
| Agent 3 | Full CML generation and orchestration hooks | High | High | Small | Main complexity is justified, but embedded sub-agent control flow can be decoupled. |
| Agent 4 | CML revision on structural errors | Medium | High | Large | Simplify parse/fallback stack and reduce indirect quality penalties. |
| Agent 5 | Clue/red-herring graph construction | High | High | Medium | Too many sequential retry categories; bundle into one coverage audit loop. |
| Agent 6 | Fair-play audit and escalation | High | High | Medium | Extract escalation state machine into one deterministic policy module. |
| Agent 65 | World document synthesis | Medium | High | Medium | Move floor-normalization from post-fix to stronger first-pass prompt constraints. |
| Agent 7 | Narrative outline planning | High | High | Medium | Merge scene-count/coverage/pacing gates into a single scored gate pass. |
| Agent 8 | Novelty audit | Medium | Medium-High | Medium | Decouple from Agent 3 regeneration path; keep as independent gate/audit. |
| Agent 9 | Prose generation and release-gate compliance | High | High | Medium | Reduce post-hoc deterministic repairs by pushing constraints into generation contract. |

## Where Complexity Layers Can Be Removed First

### 1) Retry Layer Duplication (highest ROI)

Current pattern across Agents 1, 2, 2b, 2c, 2d, 2e, 3b, and 7 repeats variations of:
- validation retry
- scoring retry
- schema repair retry
- targeted patch retry

Simplification:
- Introduce a single shared retry orchestrator with standardized inputs:
  - failure class
  - bounded retry budget
  - deterministic feedback payload
  - unified stop conditions

Expected effect:
- Fewer hidden branch permutations
- Lower code volume and easier maintenance
- Better consistency of failure handling

### 2) Embedded Agent Control Flow (high ROI)

Current high-coupling points:
- Agent 3 embedding Agent 4 (revision) and Agent 8 (novelty)
- Agent 6 escalating into Agent 4 and triggering Agent 5 regeneration cycles

Simplification:
- Keep Agent 3 focused on CML generation only.
- Move revision and novelty checks to explicit orchestration stages.
- Keep agent outputs pure; keep orchestration policy centralized.

Expected effect:
- Clearer ownership boundaries
- Less implicit state machine behavior inside agent modules
- Easier observability and debugging

### 3) Post-hoc Deterministic Repair Layers (high ROI)

Current risk pattern:
- deterministic synthesis/normalization after LLM output can conflict with model intent and force additional gates

Simplification:
- Shift more requirements to prevention-first prompt contracts and pre-commit checks.
- Keep deterministic repair only for safety invariants that cannot be trusted to model output.

Expected effect:
- Fewer contradictory correction loops
- Better first-pass acceptance rates

### 4) Multi-Gate Serial Rejection Chains (medium ROI)

Current pattern in Agents 5, 6, 7, and 9:
- multiple serial gates reject in sequence and trigger additional retries

Simplification:
- Create a consolidated quality gate per phase with weighted sub-checks.
- Allow one bundled correction cycle instead of separate correction cycles per gate.

Expected effect:
- Lower latency
- More predictable behavior under failure

### 5) Telemetry/Status Semantics Mismatch (medium ROI)

Observed class:
- stage-level status and scored status can diverge (for example novelty pass messaging vs novelty phase failure)

Simplification:
- Define one authoritative gate status contract and enforce parity in telemetry emitters.

Expected effect:
- Reliable operations decisions
- Cleaner run review signals

## Recommended Simplification Plan (Phased)

### Phase A - Architecture cuts with immediate payoff

1. Build shared retry orchestrator used by Agents 1/2/2b/2c/2d/2e/3b/7.
2. Decouple Agent 8 from Agent 3 internal retry path.
3. Extract Agent 6 escalation policy into one deterministic classifier + action table.

### Phase B - Contract-first hardening

1. Move Agent 5 and Agent 65 post-fix logic into stricter first-pass contracts.
2. Add pre-commit completeness checks for outline and prose phases before heavy downstream work.
3. Collapse serial gate retries into one bundled remediation pass per phase.

### Phase C - Observability and governance cleanup

1. Enforce single source of truth for gate status in run telemetry.
2. Keep phase outcome vocabulary consistent between progress logs and scoring reports.
3. Add regression tests for status parity and early-stop semantics.

## Net Assessment

The most removable complexity is not in the intrinsic mystery tasks. It is in orchestration overhead:
- duplicated retry frameworks
- embedded agent coupling
- post-hoc deterministic repairs
- serial multi-gate rejection chains

If these layers are simplified, the pipeline should become easier to maintain and cheaper to run while preserving strict fair-play and quality gates.

## Simplification Plan (Derived Only from This Matrix)

This plan is intentionally based only on the complexity gaps and simplifiable layers identified in this document.

## Track 1 - Cross-Cutting Simplifications

1. Unified retry orchestration
- Scope: Agents 1, 2, 2b, 2c, 2d, 2e, 3b, 7
- Action: Replace per-agent retry variants with one shared retry contract: failure class, bounded budget, deterministic feedback payload, unified stop conditions.
- Priority: P0
- Done when: duplicated retry wrappers are removed and all listed agents use the shared retry path.

2. Decouple embedded orchestration from generators
- Scope: Agent 3, Agent 6, Agent 8
- Action: Move revision/novelty/escalation control flow out of generator internals into explicit orchestration stages.
- Priority: P0
- Done when: Agent 3 is generation-only and novelty/revision are triggered by orchestration policy, not internal branching.

3. Replace serial gate chains with composite gates
- Scope: Agents 5, 6, 7, 9
- Action: Collapse multiple sequential gate failures into one phase-level composite gate and one bundled remediation cycle.
- Priority: P1
- Done when: each phase has a single retry decision boundary instead of serial rejection loops.

4. Reduce post-hoc deterministic repairs
- Scope: Agents 4, 5, 65, 9
- Action: Shift constraints to first-pass contracts and pre-commit checks; keep deterministic fixes only for safety-critical invariants.
- Priority: P1
- Done when: deterministic synthesis/normalization runs only in safety backstops, not as routine quality repair.

5. Enforce status telemetry parity
- Scope: workflow telemetry/scoring integration
- Action: Define one canonical phase outcome source and validate progress messages against scored outcomes before persistence.
- Priority: P0
- Done when: no pass/warn/fail contradictions can be emitted for the same phase.

## Track 2 - Per-Agent Simplification Backlog

| Agent | Simplification action | Priority | Done when |
|---|---|---|---|
| Agent 1 | Merge overlapping retry tracks into shared retry orchestrator. | P1 | No agent-specific retry wrapper logic remains outside shared contract. |
| Agent 2 | Remove layered pre/post normalization fallback by tightening first-pass cast contract. | P1 | Cast output requires fewer post-generation shape repairs. |
| Agent 2b | Collapse validation/scoring/profile-repair retries into one loop. | P1 | Single retry decision path handles profile failures. |
| Agent 2c | Standardize retry policy and remove custom branching. | P2 | Location profile failures are handled only by shared retry contract. |
| Agent 2d | Reduce schema-repair churn by stricter prompt output shape. | P2 | Temporal context retries decrease without additional fallback logic. |
| Agent 2e | Replace LLM retry-heavy synthesis portions with deterministic assembly where feasible. | P2 | Background context synthesis uses fewer model retries for structural fields. |
| Agent 3b | Keep generation complexity; remove duplicate normalization/retry plumbing. | P2 | Device ideation keeps quality while using shared retry contract only. |
| Agent 3 | Decouple internal sub-agent orchestration from core CML generation. | P0 | Agent 3 no longer embeds novelty/revision control loops. |
| Agent 4 | Simplify parse/fallback stack and remove indirect quality penalties tied to revision invocation. | P1 | Revision path has one deterministic correction protocol and explicit outcomes. |
| Agent 5 | Replace sequential retry categories with one coverage-audit remediation cycle. | P0 | Clue generation has one bundled correction cycle before escalate-or-fail. |
| Agent 6 | Extract escalation state machine into deterministic policy module. | P0 | Fair-play escalation path is table-driven and externally orchestrated. |
| Agent 65 | Move floor-normalization logic into first-pass prompt constraints. | P1 | World builder rarely needs deterministic length/content patching. |
| Agent 7 | Merge scene-count/coverage/pacing gates into one scored gate pass. | P1 | Outline phase uses one composite acceptance gate and one retry boundary. |
| Agent 8 | Decouple novelty from Agent 3 regeneration path. | P0 | Novelty runs as independent gate/audit stage with explicit handoff. |
| Agent 9 | Push post-hoc deterministic repairs into generation-time contract checks. | P1 | Prose phase relies on pre-commit completeness checks more than post-fix normalization. |

## Track 3 - Execution Order

Phase 0 (immediate)
1. Decouple Agent 3/8 control flow.
2. Extract Agent 6 escalation policy module.
3. Add telemetry parity enforcement.

Phase 1 (structural)
1. Roll out shared retry orchestrator to target agents.
2. Simplify Agent 5 into bundled coverage remediation.
3. Simplify Agent 7 gate chain into composite gate.
4. Simplify Agent 4 correction protocol.

Phase 2 (hardening)
1. Reduce post-hoc deterministic repair dependencies in Agents 5, 65, and 9.
2. Tighten first-pass contracts in Agents 2, 2b, and 2d.
3. Convert Agent 2e partial synthesis to deterministic assembly where feasible.

## Governance Checks

1. Complexity budget check
- Rule: No new per-agent custom retry loop may be added without a documented exception.

2. Gate topology check
- Rule: New phase logic must maintain one composite gate and one retry decision boundary.

3. Post-fix check
- Rule: Deterministic post-processing additions require justification as safety-critical, not quality-convenience.
