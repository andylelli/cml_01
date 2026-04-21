# 11_b Major Rework

## Purpose

This document defines how the canary loop should operate in `major rework` mode when normal retry cycles are exhausted.

Major rework mode exists to solve hard, multi-factor failures using structured agentic orchestration, not one-shot patch attempts.

Primary outcome target:
- produce stories with Golden Age quality: fair-play clueing, strong logical deducibility, clean information parity, and rich prose that evokes classic Christie-era readability without imitation copying.

---

## Relationship To Canary Loop

- `documentation/11_canary_loop/11_canary_loop.md` is the primary runtime behavior guide.
- this document is the deep-playbook guide for complex rework campaigns.
- `documentation/plan/canary-agent-framework-LLD.md` is the code/spec reference.

---

## Entry Criteria

Enter major rework mode when one or more are true:
- repeated unresolved signature classes after prompt-first retries.
- signature oscillation (`A -> B -> A`) across iterations.
- repeated `canary.execution_failure` fallback after prior targeted fixes.
- warning-critical quality failures persist across runs (fair play, logic, parity, timing).
- terminal iteration reached with `enableMajorRework=true`.

Do not enter major rework mode when:
- signature or root-cause confidence is below safety threshold.
- failure is clearly isolated and deterministic with a small bounded fix.

---

## Operating Model

Major rework uses an explicit think-act loop with phase gating.

### Core Loop

1. Think
- ingest latest run artifacts, ledger history, and prior failed playbooks.
- build a fault map and ranked hypotheses.
- produce a bounded wave plan with file scopes, tests, and expected deltas.

2. Act
- apply only the current wave's scoped changes.
- run targeted tests and canary.
- collect output signatures and quality metrics.

3. Reflect
- compare expected vs observed deltas.
- update hypothesis confidence.
- either advance phase, branch strategy, or rollback.

4. Repeat
- continue until pass criteria are met or stop policy triggers.

### Required Phase Order

- `P1` Failure Cartography (`pb.rework.llm-request-contract-overhaul`)
- `P2` Contract + Runtime Hardening (`pb.rework.response-processing-robustness`)
- `P3` Story-Logic Gate Reinforcement (`pb.rework.story-logic-research-lab`)

Phase advancement rules:
- do not start `P2` until `P1` has non-generic output evidence.
- do not start `P3` until `P2` has non-generic output evidence.
- on regression, rollback to last stable wave and re-plan.

---

## Agentic Orchestration Roles

Major rework should separate responsibilities to reduce context drift:

- `Coordinator`
  - owns phase state, wave sequencing, and stop decisions.
- `Diagnostician`
  - performs root-cause analysis and contradiction mapping.
- `Planner`
  - converts diagnosis into wave-level to-do lists and test plans.
- `Implementer`
  - executes scoped code/prompt changes only.
- `Verifier`
  - runs tests/canary and evaluates signature movement.
- `Narrative Logic Auditor`
  - enforces mystery-quality constraints (fair play, clue parity, timing, deducibility, motive coherence).

A single runtime may combine roles, but the artifacts must preserve role outputs as separate sections.

---

## To-Do Governance

Major rework must use explicit, versioned to-do lists.

### To-Do Levels

- `Campaign To-Do`
  - cross-phase goals and risk controls.
- `Phase To-Do`
  - concrete tasks for current phase only.
- `Wave To-Do`
  - executable tasks for one think-act cycle.

### To-Do Rules

- every task includes owner, expected evidence, and completion criterion.
- only one wave may be `in-progress` at a time.
- unfinished tasks roll forward explicitly; no silent carryover.
- blocked tasks must record blocker class and next unblock action.

Recommended wave template:

```text
Wave ID: MR-P2-W3
Objective: Harden parser recovery for fair-play structural failures
Tasks:
- Add stage-level parse recovery markers in Agent 6 runtime
- Add regression test for malformed clue bundles
- Tighten retry packet contract section for parity hints
Expected evidence:
- output class no longer generic
- warning count decreases by >= 1
- no new critical class introduced
Stop if:
- generic execution failure appears
- unchanged signature exceeds bound
```

---

## Guardrails

## 1) Token and Context Safety (mandatory)

Use hard token budgets to prevent context collapse and hallucinated planning.

Per-think-cycle budget (recommended defaults):
- `max_input_tokens`: 12000
- `max_output_tokens`: 2500
- `max_total_tokens`: 14500

Per-major-rework-wave budget:
- `max_total_think_tokens`: 35000
- `max_total_act_tokens`: 20000

Session cap:
- `max_major_rework_tokens`: 180000
- if exceeded, force summarize + checkpoint, then resume from compressed state.

Token safety rules:
- prioritize structured artifacts over raw logs.
- chunk long logs and summarize before planning.
- never run unconstrained full-history prompts in major rework mode.
- if remaining budget < 15%, switch to minimal action mode (no broad redesign).

## 2) Change Scope Safety

- any repository file may be changed when rollback/recovery is guaranteed.
- cap touched files per wave.
- require explicit confirmation for shared-file edits.
- rollback unresolved implementation changes by default.

Scope control policy:
- allow/deny filters are optimization controls, not hard blockers, when evidence-backed rollback coverage exists.
- if broad scope is used, the wave log must record why narrower scope was insufficient.

Rollback policy (mandatory):
- whole rollback: if a wave regresses to generic execution failure, increases critical severity, or fails safety gates, revert all implementation edits from that wave.
- partial rollback: if a wave shows measurable improvement for a subset of files, keep only the files linked to proven improvements and rollback the rest.
- every rollback decision must record rationale, kept-file list, reverted-file list, and evidence markers used for the decision.
- partial rollback is never allowed when outcome confidence is below threshold.

## 3) Decision Safety

- no advance on low-confidence signature/root cause.
- stop on high-severity regressions.
- stop on persistent oscillation without net quality gain.

## 4) Narrative Safety

- fail wave if new contradictions are introduced.
- fail wave if information parity worsens.
- fail wave if discriminating-test timing regresses.

---

## Tools And Execution Policy

Major rework should choose tools by phase intent.

### Think Tools

- artifact and ledger readers
- signature/root-cause classifiers
- semantic/code search
- structured diff inspection

### Act Tools

- scoped patch application
- targeted test runners
- agent-boundary canary execution
- rollback/archive writers

### Tooling Rules

- think first, then act; do not edit during diagnosis-only steps.
- apply smallest viable wave changes.
- validate each wave before starting the next.
- maintain deterministic artifacts (packets, briefs, summaries).

---

## Quality Framework For Golden Age Crime Output

Major rework is complete only when technical stability and literary logic quality are both green.

### Hard Logic Gates

- fair-play clue disclosure is sufficient for reader inference.
- no withheld critical evidence used only by detective reveal.
- discriminating-test timing is present and structurally valid.
- suspect elimination uses concrete, checkable evidence.
- final solution path is traceable from visible clues.

### Narrative Richness Gates

- scene prose is vivid but disciplined; no modern tonal drift.
- character motives are coherent and psychologically plausible.
- red herrings are credible and non-contradictory.
- chapter-level pacing supports mounting deduction.

### Acceptance Threshold

A major rework campaign can close only if:
- canary passes,
- unresolved critical and warning signatures are zero for the targeted stage,
- no regression in narrative logic metrics,
- at least one run demonstrates stable pass without emergency fallback patches.

---

## Artifacts Required Per Campaign

- major rework packet (`json`) with phase plan and constraints
- major rework brief (`md`) with rationale and wave status
- per-wave execution log (decision, changes, tests, canary)
- rollback manifest for failed waves
- final quality summary with logic + prose gate results
- learning ledger capturing what worked vs did not work across waves and attempts

Suggested paths:
- `logs/canary-loops/<run>/canary-major-rework-*.jsonl`
- `logs/canary-loops/<run>/canary-major-rework-*.md`
- `logs/canary-loops/<run>/rework-lab/*.md`
- `logs/canary-loops/<run>/rework-lab/major-rework-learning.json`

Learning ledger minimum content:
- signature class and root-cause layer
- selected playbooks and phase/wave context
- file-level outcomes (`kept`, `reverted`, `neutral`)
- measured deltas (warnings reduced, critical class changed, narrative gates changed)
- recommendation tags for next attempt (`retry`, `avoid`, `escalate`, `re-scope`)

Cross-attempt visibility policy:
- every new major-rework attempt must ingest at least the latest learning ledger and recent attempt history before planning.
- planning output must explicitly cite prior wins to preserve and prior failures to avoid.
- the system must prefer strategies with prior positive evidence and demote strategies with repeated stop outcomes.

---

## Stop Conditions

Stop and return `stop_apply_policy` when:
- low-confidence classification/root-cause persists.
- unchanged signature exceeds configured bound.
- token/session safety caps are hit without safe checkpointing.
- phase prerequisites cannot be satisfied after bounded retries.
- regression severity exceeds safety threshold.

Return `pass` only when all hard logic and narrative gates pass.

---

## Reference Workflow (Condensed)

1. Build campaign packet and phase to-do list.
2. Run `P1` waves until non-generic control-point evidence is proven.
3. Run `P2` waves to stabilize contracts and runtime processing.
4. Run `P3` waves to harden fair-play and deducibility gates.
5. Validate with tests + canary each wave.
6. Rollback unresolved waves, keep stable deltas.
7. Close campaign only on dual-pass: technical + narrative logic quality.
