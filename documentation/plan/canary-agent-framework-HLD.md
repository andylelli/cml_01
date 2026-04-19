# Agent Canary Framework - High-Level Design (HLD)

**Status of this document:** High-level design for the implemented autonomous canary loop framework, maintained to match current behavior.

---

## Context

Current debugging flow requires repeated manual steps:
1. Run canary
2. Inspect logs and prompt artifacts
3. Feed failures back for fix suggestions
4. Apply fixes
5. Re-run and repeat

The target is an automated loop where you provide:
- a specific historical run (or latest run)
- a specific agent (for example `Agent5-ClueExtraction`)

Then the system continuously performs:
- data retrieval from run artifacts
- failure classification
- fix proposal and implementation
- targeted validation
- canary re-run
- iteration until pass or stop condition

This framework is intended to remove manual handoffs and make per-agent stabilization repeatable.

---

## Goals

1. Enable canary workflows against any agent using data from any run artifacts.
2. Provide an autonomous iterative fix loop with bounded, auditable behavior.
3. Preserve safety: scoped edits, test gates, and explicit stop conditions.
4. Improve convergence speed by reusing deterministic failure signatures and prior fixes.
5. Start pipeline execution from any agent boundary while hydrating upstream agent outputs from the same run.
6. Keep boundary-safe canary entrypoints usable when upstream hydration is partial, with explicit warnings and bounded policy controls.

## Non-Goals

1. Fully autonomous multi-agent refactors with no safety limits.
2. Replacing existing CI; this is a focused local/repo canary hardening framework.
3. Automatically merging to main without user review.

---

## Functional Requirements

1. Accept `runId` and `agent` as primary inputs.
2. Accept optional `startFromAgent` (defaults to `agent`) and `hydratePriorFromRun` (default `true`).
3. Retrieve all relevant artifacts for that run/agent:
- run report JSON
- prompt request/response records
- orchestration and canary logs
- test outputs and retry traces
4. Build and validate a same-run upstream hydration bundle for `Agent1..startFromAgent-1`.
5. Build a normalized failure summary and classify failure types.
6. Normalize non-success canary executions to a critical `canary.execution_failure` signature before continuation policy evaluation.
7. Propose and apply candidate fixes scoped to likely files.
8. Execute validation strategy per iteration:
- targeted unit tests
- agent-focused canary command
9. Record each iteration with:
- failure signature
- changed files
- test/canary outcome
- decision (`continue`, `pass`, `pass_with_warnings`, or `stop`)
10. Stop when any terminal condition is met.

---

## User Experience

### Entry Command (conceptual)

`npm run canary:agent-loop -- --runId <run_id> --agent <agent_name> [options]`

Per-agent shortcut command (conceptual):

`npm run canary:agent2e -- --runId <run_id>`

### Typical Options

- `--max-iterations <n>` default `5`
- `--mode suggest|apply` default `apply`
- `--test-scope targeted|full` default `targeted`
- `--canary-command <cmd>` optional override
- `--stop-on-new-failure-class true|false` default `true`
- `--allow-files <glob,...>` optional edit allowlist
- `--startFromAgent <agent_name>` default selected `--agent`
- `--hydratePriorFromRun true|false` default `true`

### Output

Per-iteration machine-readable report plus concise summary in terminal:
- current failure class
- applied fix summary
- validation status
- next action or final stop reason

---

## Architecture Overview

1. **Canary Loop Controller**
- Orchestrates iteration lifecycle.
- Enforces max iterations, unchanged-failure ceilings, and safety stops.

2. **Run Artifact Resolver**
- Resolves run folders and report paths from `runId`.
- Pulls agent-specific request/response and retry records.
- Normalizes partial artifact availability.

3. **Hydration Builder**
- Resolves upstream agent dependencies for selected start boundary.
- Loads and normalizes upstream outputs from the same `runId`.
- Produces immutable hydrated context used by resumed execution.

4. **Failure Signature Engine**
- Parses logs/reports into canonical signatures.
- Maps signatures to known fix playbooks.
- Detects repeated unchanged signatures.

5. **Fix Planner and Patch Engine**
- Produces concrete code-change plans per failure class.
- Applies patches in scoped files only.
- Adds or updates regression tests where appropriate.

6. **Validation Executor**
- Runs targeted tests first.
- Runs agent canary command second.
- Collects structured pass/fail diagnostics.

7. **Iteration Ledger**
- Persists each loop step to a JSONL/Markdown trace.
- Supports resume and postmortem.

8. **Knowledge Cache (optional first pass, required later)**
- Stores successful fix patterns keyed by failure signature.
- Improves future convergence for recurring failures.

---

## Data Model (Conceptual)

### Loop Request

- `runId: string`
- `agent: string`
- `startFromAgent?: string`
- `hydratePriorFromRun?: boolean`
- `maxIterations: number`
- `mode: "suggest" | "apply"`
- `testScope: "targeted" | "full"`
- `constraints: { allowFiles?: string[]; denyFiles?: string[] }`

### Hydration Bundle

- `sourceRunId: string`
- `startFromAgent: string`
- `upstreamAgents: string[]`
- `hydratedArtifacts: Record<string, unknown>`
- `missingRequiredArtifacts: string[]`
- `integrity: { partial: boolean; warnings: string[] }`

### Failure Signature

- `signatureId: string`
- `agent: string`
- `stage: string`
- `class: string`
- `message: string`
- `evidence: { file: string; line?: number; snippet?: string }[]`
- `severity: "critical" | "warning"`

### Iteration Record

- `iteration: number`
- `inputSignature: FailureSignature`
- `plannedActions: string[]`
- `changedFiles: string[]`
- `tests: { command: string; passed: boolean; summary: string }[]`
- `canary: { command: string; passed: boolean; summary: string }`
- `outputSignature?: FailureSignature`
- `decision: "continue" | "pass" | "pass_with_warnings" | "stop"`
- `stopReason?: string`

---

## Iteration Workflow

1. Resolve run and agent artifacts.
2. Build same-run upstream hydration bundle for `startFromAgent`.
3. Generate current failure signature.
4. Select fix playbook:
- deterministic sanitizer/normalizer
- prompt contract hardening
- retry payload hardening
- validator guardrail fix
- null-safe runtime defense
5. Apply minimal patch set.
6. Run targeted tests.
7. Run resumed canary execution from `startFromAgent` using hydrated upstream context.
8. Compare failure signature delta:
- pass -> stop success
- warning-only stagnation with a passing canary -> `pass_with_warnings`
- moved failure -> continue
- unchanged failure (N times) -> stop bounded failure
- new higher-severity class -> stop for review (default)

---

## Safety and Control Gates

1. **Scope gate**: restrict edits to likely files for selected agent and shared orchestrator paths.
2. **Validation gate**: no iteration is accepted without test + canary evidence.
3. **No-destructive-ops gate**: forbid reset/clean style operations.
4. **Convergence gate**: stop after configurable unchanged-signature repeats.
5. **Escalation gate**: when failure migrates upstream/downstream, re-plan rather than continue blind edits.
6. **Boundary-safe hydration gate**: if required upstream hydration artifacts are missing but the resolved canary command can self-hydrate boundary context (`canary-agent-boundary` or `canary-agent9`), downgrade precheck failure to warning and continue.
7. **Failure normalization gate**: any non-success canary run (`passed !== true`, non-zero exit code, or failure-like status) is normalized to critical class `canary.execution_failure`.

---

## Implementation Phases

## Phase 1 - Framework Skeleton

1. Add loop command entrypoint and request parsing.
2. Implement Run Artifact Resolver for existing run folder formats.
3. Implement Hydration Builder for same-run upstream artifact reuse.
4. Implement baseline Failure Signature Engine from report + log tail patterns.
5. Implement Iteration Ledger output.

**Exit criteria:** Can run read-only analysis loop (`suggest` mode) for a chosen run/agent/start boundary and produce hydration diagnostics plus a ranked fix plan.

## Phase 2 - Safe Apply Mode

1. Add Patch Engine integration for scoped edits.
2. Add Validation Executor with current worker/prompt test commands.
3. Add resumed execution from `startFromAgent` with hydrated upstream context.
4. Add stop conditions and failure-delta classification.

**Exit criteria:** End-to-end `apply` loop can complete at least one autonomous resumed iteration (for example from Agent2e) and produce reproducible records.

## Phase 3 - Playbooks and Deterministic Repairs

1. Encode common recurring classes as explicit playbooks (for example path legality, evidence clue ID coverage, red-herring overlap, schema-required fields).
2. Add deterministic repair helpers before retrying LLM-dependent paths.
3. Add optional auto-test generation hooks for regression locking.

**Exit criteria:** Repeated known failure classes converge in fewer iterations than baseline manual flow.

## Phase 4 - Learning and Resume

1. Add signature-to-fix cache for prior successful edits.
2. Add `--resume` from last ledger iteration.
3. Add summary analytics (iterations-to-pass, repeated stop reasons, top failure classes).

**Exit criteria:** Second run on similar failure class uses cached strategy and reduces fix latency.

---

## Integration Points

1. Existing canary runner scripts (for example current `scripts/canary-core.mjs` pattern).
2. Existing run artifacts in `documentation/prompts/actual/...` and report JSON in API data path.
3. Existing tests in worker and prompts packages.
4. Existing orchestrator/agent runtime and prompt builders.

---

## Observability

1. Emit one ledger file per loop run under a dedicated folder, for example:
- `documentation/analysis/canary-loops/<timestamp>-<runId>-<agent>.jsonl`
- `documentation/analysis/canary-loops/<timestamp>-<runId>-<agent>.md`
2. Include artifact integrity checks in preflight:
- missing request count
- missing response count
- empty response body count
3. Include failure timeline summary for quick triage.

---

## Success Metrics

1. Manual handoff steps reduced to inputting `runId` + `agent`.
2. Median iterations-to-pass reduced for recurring failure classes.
3. Reduction in repeated unchanged-failure loops.
4. Higher test/canary pass confidence due to per-iteration validation evidence.

---

## V1 Decisions (Resolved)

1. Start boundary scope: v1 supports one explicit `startFromAgent` boundary per invocation only. Multi-hop dependency sessions are deferred.
2. Shared-file protection: `apply` mode requires explicit confirmation when edits touch shared files (`apps/worker/src/jobs/mystery-orchestrator.ts`, schema validators, and other configured shared paths).
3. Default shortcut matrix: ship a predefined per-agent shortcut matrix (`canary:agent1`, `canary:agent2`, `canary:agent2b`, `canary:agent2c`, `canary:agent2d`, `canary:agent2e`, `canary:agent3`, `canary:agent3b`, `canary:agent4`, `canary:agent5`, `canary:agent6`, `canary:agent65`, `canary:agent7`, `canary:agent9`) that maps to `canary:agent-loop` with agent-specific defaults.
4. Knowledge cache location: v1 uses runtime-only local storage (ignored/untracked workspace path). Repo-persisted cache is deferred to a later phase.

---

## Recommended Next Step

Create a matching LLD in `documentation/plan/canary-agent-framework-LLD.md` with:
1. exact command contract
2. concrete file/module layout
3. failure signature taxonomy v1
4. stop-condition state machine
5. initial playbook table for top recurring failure classes
