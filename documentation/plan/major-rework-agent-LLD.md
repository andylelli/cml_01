# Major Rework Agent - Detailed Low-Level Design (LLD)

**Parent Operational Docs:**
- `documentation/11_canary_loop/11_canary_loop.md`
- `documentation/11_canary_loop/11_b_major_rework.md`

**Purpose:** Define the implementation design for a dedicated major rework agent that performs deep, phased, evidence-driven remediation when standard canary retries do not converge.

---

## 1. Scope

This LLD covers the implementation of a `major rework agent` mode inside the canary loop runtime, including:

- escalation detection and entry criteria
- phased orchestration (`P1`, `P2`, `P3`)
- role-oriented decision model
- token/context budgets and safety guards
- to-do governance artifacts
- tooling policy and execution controls
- validation, observability, and stop conditions

Out of scope:

- replacing the standard (non-major) canary loop flow
- unbounded autonomous refactors across unrelated packages
- changing Golden Age narrative scoring methodology itself (this LLD consumes existing metrics)

---

## 2. Design Goals

1. Converge on root-cause fixes, not symptom suppression.
2. Enforce prevention-over-cure constraints in requests and contracts.
3. Keep changes bounded and reversible per wave.
4. Produce deterministic audit artifacts for every major-rework wave.
5. Improve both technical pass metrics and narrative logic quality.

Non-goals:

1. Best-effort exploratory generation without measurable gates.
2. One-shot broad rewrites with no intermediate validation.
3. Implicit context accumulation across long sessions without checkpointing.

---

## 3. Runtime Positioning

The major rework agent is not a separate binary. It is a controller sub-mode in:

- `scripts/canary-loop/controller.mjs`

with specialized support in:

- `scripts/canary-loop/rework.mjs`
- `scripts/canary-loop/playbooks.mjs`
- `scripts/canary-loop/ledger.mjs`
- `scripts/canary-loop/patches.mjs`
- `scripts/canary-loop/validate.mjs`

The mode is activated via policy (`terminal escalation`) and/or explicit flags (`--enableMajorRework=true`).

## 3.1 Concrete Code Touchpoints

Controller and state machine:

- `scripts/canary-loop/controller.mjs`
  - add `MR_*` transitions and branch handlers
  - call escalation classifier, phase gate enforcer, wave planner, and delta review

Rework packet and brief generation:

- `scripts/canary-loop/rework.mjs`
  - persist full `MajorReworkPacket` JSON artifact
  - render `MajorReworkBrief` with phase and wave status blocks

Playbook selection and gating:

- `scripts/canary-loop/playbooks.mjs`
  - expose phase-scoped playbook compatibility and mutex metadata

Ledger and artifacts:

- `scripts/canary-loop/ledger.mjs`
  - add `majorRework` envelope fields to iteration records
  - write `campaign/phase/wave` to-do files under `rework-lab`

Validation and acceptance gates:

- `scripts/canary-loop/validate.mjs`
  - include narrative logic gate summary in wave results
  - expose structured outcome for `MR_DELTA_REVIEW`

Patch safety and rollback:

- `scripts/canary-loop/patches.mjs`
  - allow any repository file to be changed when rollback artifacts guarantee reversible restore
  - enforce per-wave file cap and shared-file confirmation in major-rework mode
  - emit rollback manifest linked to `waveId`

---

## 4. Functional Requirements

1. Detect entry conditions from unresolved signature history, oscillation, and fallback trends.
2. Build a deterministic campaign packet with phases, constraints, and rollback triggers.
3. Enforce phase gates at runtime:
- P1 required before P2
- P2 required before P3
4. Generate and track campaign/phase/wave to-do records.
5. Apply wave changes only within effective file scope and caps.
6. Validate each wave with tests and canary before any phase advancement.
7. Record all decisions and outcomes in JSONL + Markdown major-rework logs.
8. Support bounded reset window on terminal forced-major-rework scenarios.
9. Stop safely on low-confidence, severe regressions, or budget exhaustion.
10. Support rollback granularity decisions per wave (`whole` or `partial`) based on measured evidence.
11. Persist learning outcomes from each major-rework attempt and ingest them in subsequent attempts.

---

## 5. Non-Functional Requirements

1. Determinism: identical inputs produce equivalent packet skeleton and phase decisions.
2. Explainability: every deferred phase and stop reason must be machine-readable.
3. Safety: no destructive git operations, no unbounded file touching.
4. Auditability: all wave decisions include rationale and evidence references.
5. Cost control: token and context budgets are hard-gated.
6. Learning persistence: prior attempts remain queryable for planning in future attempts.

---

## 6. Architecture Overview

## 6.1 Components

1. `Escalation Classifier`
- Inputs: current signature, ledger history, unchanged counters, fallback markers.
- Output: escalate/no-escalate + rationale.

2. `Campaign Builder`
- Builds `MajorReworkPacket` and `MajorReworkBrief`.
- Includes phase plan, sequence constraints, rollback triggers.

3. `Phase Gate Enforcer`
- Filters selected playbooks by completed evidence prerequisites.
- Emits `phaseGateStatus` for logs and decisioning.

4. `Wave Planner`
- Produces a wave-scoped to-do set with expected evidence deltas.
- Applies token and file-scope budgets before execution.

5. `Execution Engine`
- Applies scoped patches.
- Runs targeted tests and canary command.

6. `Verifier`
- Compares expected vs actual signature deltas.
- Updates phase completion state.

7. `Checkpoint Manager`
- Triggers compression/summarization when token budget thresholds are hit.
- Maintains deterministic resume context.

8. `Rollback Decision Engine`
- Assigns rollback mode per wave: `whole`, `partial`, or `none`.
- Uses signature movement, severity shift, confidence, and narrative gate deltas.

9. `Learning Memory Writer/Reader`
- Writes per-wave efficacy outcomes.
- Surfaces prior wins/failures for next attempt planning.

## 6.2 Control Flow

1. detect escalation eligibility
2. build/refresh campaign packet
3. enforce phase gates
4. plan one wave
5. apply + validate
6. compare deltas and update confidence
7. advance phase, branch, rollback, or stop

---

## 7. Data Contracts

## 7.1 MajorReworkPacket

```ts
interface MajorReworkPacket {
  runId: string;
  agent: string;
  createdAt: string;
  objective: string;
  entryTriggers: string[];
  focus: {
    signatureClass: string;
    stage: string;
    confidence: number;
  };
  scope: {
    allowedFiles: string[];
    deniedFiles: string[];
    maxFilesPerWave: number;
  };
  tokenBudget: {
    maxInputTokens: number;
    maxOutputTokens: number;
    maxThinkTokensPerWave: number;
    maxActTokensPerWave: number;
    maxCampaignTokens: number;
    minRemainingPercentForBroadWork: number;
  };
  phases: Array<{
    id: "P1" | "P2" | "P3";
    name: string;
    objective: string;
    playbooks: string[];
    exitCriteria: string[];
  }>;
  sequenceConstraints: string[];
  rollbackTriggers: string[];
  acceptanceGates: {
    technical: string[];
    narrativeLogic: string[];
  };
}
```

## 7.2 MajorReworkWavePlan

```ts
interface MajorReworkWavePlan {
  campaignId: string;
  waveId: string;            // ex: MR-P2-W3
  phase: "P1" | "P2" | "P3";
  ownerRole: "Planner" | "Implementer" | "Verifier";
  tasks: string[];
  targetFiles: string[];
  tests: string[];
  canaryCommand: string;
  expectedEvidence: string[];
  stopIf: string[];
  budgetSnapshot: {
    remainingCampaignTokens: number;
    remainingWaveThinkTokens: number;
    remainingWaveActTokens: number;
  };
}
```

## 7.3 MajorReworkIterationRecord Extensions

```ts
interface MajorReworkIterationRecord {
  majorRework: {
    campaignId: string;
    phase: "P1" | "P2" | "P3";
    waveId: string;
    phaseGateStatus: {
      p1Complete: boolean;
      p2Complete: boolean;
      hasControlPoint: boolean;
      blockedBy: string[];
    };
    expectedEvidence: string[];
    observedEvidence: string[];
    deltaAssessment: "improved" | "unchanged" | "regressed" | "mixed";
    rollbackDecision: {
      mode: "whole" | "partial" | "none";
      rationale: string;
      keptFiles: string[];
      revertedFiles: string[];
      evidence: string[];
    };
    checkpointTaken: boolean;
  };
}
```

## 7.4 Cross-Attempt Learning Record

```ts
interface MajorReworkLearningRecord {
  runId: string;
  campaignId: string;
  createdAt: string;
  signatureClass: string;
  rootCauseLayer: string;
  entries: Array<{
    phase: "P1" | "P2" | "P3";
    waveId: string;
    selectedPlaybooks: string[];
    outcome: "pass" | "continue" | "stop";
    deltaAssessment: "improved" | "unchanged" | "regressed" | "mixed";
    rollbackMode: "whole" | "partial" | "none";
    keptFiles: string[];
    revertedFiles: string[];
    recommendationTags: Array<"retry" | "avoid" | "escalate" | "re-scope">;
  }>;
}
```

---

## 8. State Machine

## 8.1 Additional States

- `MR_PRECHECK`
- `MR_PACKET_BUILD`
- `MR_PHASE_GATE`
- `MR_WAVE_PLAN`
- `MR_APPLY`
- `MR_VALIDATE`
- `MR_DELTA_REVIEW`
- `MR_CHECKPOINT`
- `MR_STOP_PASS`
- `MR_STOP_FAIL`

## 8.2 Transitions

1. `MR_PRECHECK -> MR_PACKET_BUILD` when entry criteria true and confidence is sufficient.
2. `MR_PACKET_BUILD -> MR_PHASE_GATE` when packet integrity checks pass.
3. `MR_PHASE_GATE -> MR_WAVE_PLAN` after suppressing blocked playbooks.
4. `MR_WAVE_PLAN -> MR_APPLY` when scope/budget checks pass.
5. `MR_APPLY -> MR_VALIDATE` when patch application succeeds.
6. `MR_VALIDATE -> MR_DELTA_REVIEW` after tests + canary complete.
7. `MR_DELTA_REVIEW -> MR_WAVE_PLAN` when continue policy is satisfied.
8. `MR_DELTA_REVIEW -> MR_CHECKPOINT` when token thresholds require compression.
9. `MR_CHECKPOINT -> MR_WAVE_PLAN` after summary checkpoint persisted.
10. `MR_DELTA_REVIEW -> MR_STOP_PASS` when all acceptance gates are satisfied.
11. Any state -> `MR_STOP_FAIL` on low-confidence, severe regression, or safety breach.

Rollback decision policy:

- `whole`: mandatory when output regresses to generic execution class, critical severity increases, or gate regressions are detected.
- `partial`: allowed only when measurable improvement exists and confidence threshold is satisfied.
- `none`: allowed only when wave is accepted and propagated.

---

## 9. Phase Semantics

## 9.1 P1 - Failure Cartography

Objective:

- replace generic failures with explicit control-point signatures
- generate disconfirmable hypothesis map

Required outputs:

- control-point evidence entries
- ranked hypothesis tree
- wave tasks mapped to must-fix findings

Advancement rule:

- cannot leave P1 without non-generic output signature evidence.

## 9.2 P2 - Contract + Runtime Hardening

Objective:

- enforce stronger request/response contracts
- stabilize parsing and post-processing against malformed outputs

Required outputs:

- contract clauses and parser hardening changes
- regression tests covering prior malformed patterns

Advancement rule:

- cannot leave P2 without non-generic evidence that P2 interventions reduced critical markers.

## 9.3 P3 - Story-Logic Gate Reinforcement

Objective:

- harden fair-play and deductive integrity gates
- ensure no narrative logic regressions while technical pass stabilizes

Required outputs:

- stronger invariant checks for parity/timing/traceability
- regression coverage for story-logic failure classes

Completion rule:

- two consecutive stable outcomes without emergency fallback patches.

---

## 10. To-Do Governance

## 10.1 Artifact Files

- campaign: `logs/canary-loops/<run>/rework-lab/campaign-todo.json`
- phase: `logs/canary-loops/<run>/rework-lab/phase-<P>.todo.json`
- wave: `logs/canary-loops/<run>/rework-lab/wave-<id>.todo.json`

## 10.2 Required Fields

```ts
interface TodoItem {
  id: string;
  title: string;
  owner: string;
  status: "not-started" | "in-progress" | "completed" | "blocked";
  expectedEvidence: string[];
  doneWhen: string[];
  blockerClass?: string;
  unblockAction?: string;
}
```

Rules:

- one `in-progress` wave at a time
- no implicit carryover; unfinished items must be re-declared
- blocked items require unblock metadata
- each completed wave must include rollback mode and learning recommendation tags

---

## 11. Token and Context Budget Enforcement

## 11.1 Budgets

Default hard limits:

- `maxInputTokens = 12000`
- `maxOutputTokens = 2500`
- `maxThinkTokensPerWave = 35000`
- `maxActTokensPerWave = 20000`
- `maxCampaignTokens = 180000`
- `minRemainingPercentForBroadWork = 15`

## 11.2 Enforcement Points

1. Pre-plan: reject wave if requested context exceeds input cap.
2. Pre-act: reject broad redesign when remaining campaign tokens below threshold.
3. Post-wave: trigger checkpoint when remaining campaign budget is low.
4. Hard stop: return `stop_apply_policy` if campaign cap is exceeded and checkpoint cannot safely compress state.

## 11.3 Config Surface

Add major-rework config keys in `scripts/canary-loop/config.mjs`:

```ts
interface MajorReworkConfig {
  enabledByDefault: boolean;
  maxInputTokens: number;
  maxOutputTokens: number;
  maxThinkTokensPerWave: number;
  maxActTokensPerWave: number;
  maxCampaignTokens: number;
  minRemainingPercentForBroadWork: number;
  maxFilesPerWave: number;
  maxPhaseRetries: {
    P1: number;
    P2: number;
    P3: number;
  };
  enforceNarrativeAcceptanceGates: boolean;
}
```

Config policy:

- all values must be serializable into packet artifacts for reproducibility
- changing config mid-campaign requires checkpoint + packet version increment

---

## 12. Tooling Policy

Allowed think operations:

- artifact reads
- signature classification
- semantic/code search
- diff analysis

Allowed act operations:

- scoped patching
- targeted tests
- boundary canary execution
- rollback + archive

Hard rules:

- do not patch during diagnosis-only wave stages
- do not run full-history unconstrained prompts in major rework
- validate before phase advancement
- any file may be patched only if before/after snapshots and restore actions are captured for that wave

---

## 13. Observability and Artifacts

Required outputs per campaign:

- `canary-major-rework-<timestamp>.jsonl`
- `canary-major-rework-<timestamp>.md`
- `rework-lab/major-rework-brief-<timestamp>.md`
- `rework-lab/major-rework-packet-<timestamp>.json`
- `rework-lab/wave-*.todo.json`
- rollback manifests for failed waves
- `rework-lab/major-rework-learning.json`

Each iteration record must include:

- selected and suppressed playbooks
- phase gate blockers
- expected vs observed evidence
- rollback decision (`whole`/`partial`/`none`) with kept/reverted file lists
- budget snapshot
- stop/continue rationale

Cross-attempt visibility requirements:

- planner must load recent attempt history and `major-rework-learning.json` before selecting playbooks.
- planning output must cite prior successful patterns and previously failed patterns.
- repeated failures for the same playbook/signature pair increase demotion weight in subsequent selection.

---

## 14. Validation Plan

Implementation note:

- extend `scripts/canary-loop/__tests__/sprint3-regressions.test.mjs` for phase-gate scenarios
- add `scripts/canary-loop/__tests__/major-rework-agent.test.mjs` for packet/wave contracts and budget guards
- add `scripts/canary-loop/__tests__/major-rework-integration.test.mjs` for end-to-end wave progression

## 14.1 Unit Tests

1. Escalation entry classifier and trigger precedence.
2. Phase gate suppression logic for `P1/P2/P3`.
3. Token budget guard calculations and threshold transitions.
4. To-do schema validation and single in-progress enforcement.
5. Delta assessment classification (`improved/unchanged/regressed/mixed`).
6. Config drift handling: checkpoint + packet version increment when config changes mid-campaign.
7. Rollback decision classifier correctness for `whole` vs `partial` outcomes.
8. Learning record aggregation and recommendation-tag generation.

## 14.2 Integration Tests

1. End-to-end major-rework loop from known failing run.
2. Terminal iteration forced major-rework with bounded reset.
3. Resume from checkpoint with consistent phase state.
4. Rollback trigger on regression and artifact persistence verification.
5. Mixed-outcome wave where technical improvements occur but narrative gate fails.
6. Subsequent attempt for same signature consumes prior learning and changes selected playbooks accordingly.

## 14.3 Acceptance Tests

A campaign passes only when all are true:

1. canary passes
2. unresolved critical and warning signatures are zero for targeted stage
3. no narrative logic metric regression
4. at least one subsequent confirmation run remains stable

---

## 15. Phased Implementation Plan

Release policy:

- Phase 0-2 can ship behind feature flag `majorReworkAgentV2`
- Phase 3 enables default-on for internal canary loops
- Phase 4-5 enables default-on for all major-rework escalations

## Phase 0 - Scaffolding and Contracts

Deliverables:

- add packet/wave contract types
- add TODO artifact writers/readers
- add config surface for budgets and limits
- add learning record reader/writer and rollback decision schema

Exit criteria:

- packet and wave schemas persisted and validated in dry-run mode
- packet schema version and config hash are persisted for deterministic resume
- learning record and rollback metadata persisted with schema validation

## Phase 1 - Escalation and Phase Gate Core

Deliverables:

- escalation trigger classifier
- phase gate enforcement with `phaseGateStatus`
- suppression-aware narration/logging

Exit criteria:

- deterministic gate behavior validated for P1/P2/P3 ordering

## Phase 2 - Wave Planner and Safety Budgets

Deliverables:

- wave planner generation from packet + current signature
- budget-aware wave admissibility checks
- checkpoint manager skeleton

Exit criteria:

- waves are blocked/allowed correctly by token + scope constraints

## Phase 3 - Execution and Delta Review

Deliverables:

- apply + validate loop integration for major-rework waves
- expected vs observed evidence comparison
- structured delta decisioning
- rollback decision engine integrated with whole/partial/none outcomes

Exit criteria:

- major-rework runs produce auditable wave-by-wave evidence and decisions
- wave-level rollback manifests reference exact `waveId`, changed files, and triggering evidence
- subsequent attempts demonstrate strategy shifts based on prior learning records

## Phase 4 - Narrative Logic Reinforcement

Deliverables:

- explicit narrative logic gate integration (parity, timing, traceability)
- acceptance gate wiring in stop/pass decisions

Exit criteria:

- campaigns fail when narrative gates regress even if technical checks pass

## Phase 5 - Hardening and Rollout

Deliverables:

- regression suite expansion
- runbook + operator checklists
- metrics dashboard additions

Exit criteria:

- repeatable convergence improvements on historical failing runs

Operational success metrics:

- median major-rework iterations to stable pass decreases versus baseline
- rate of `canary.execution_failure` terminal stops decreases
- narrative gate regressions per campaign trend to near zero

---

## 16. Risks and Mitigations

1. Risk: overfitting to one signature family.
- Mitigation: disconfirmable hypothesis requirements in P1 and multi-run confirmation.

2. Risk: token exhaustion before convergence.
- Mitigation: checkpointing and minimal-action fallback when remaining budget is low.

3. Risk: large edit blasts increase regressions.
- Mitigation: per-wave file caps and single-wave in-progress enforcement.

4. Risk: partial rollback keeps harmful files.
- Mitigation: require confidence threshold + explicit evidence and fail-safe fallback to whole rollback.

5. Risk: false phase completion.
- Mitigation: non-generic evidence requirement and confidence thresholds.

6. Risk: technical pass but narrative degradation.
- Mitigation: narrative gates are blocking acceptance criteria.

7. Risk: repeating historically ineffective playbooks.
- Mitigation: cross-attempt learning ingestion and selection demotion based on prior stop outcomes.

---

## 17. Definition of Done

The major rework agent implementation is done when:

1. phased orchestration is enforced (`P1 -> P2 -> P3`) with runtime evidence checks
2. campaign/phase/wave artifacts are deterministic and complete
3. token/context safety limits are hard enforced
4. rollback and checkpoint behavior are reproducible
5. acceptance criteria require both technical and narrative logic quality
6. integration and regression tests pass for major-rework scenarios
7. each new major-rework attempt demonstrates visibility of prior learning artifacts in planning decisions
