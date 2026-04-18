# 11 Canary Loop

## Purpose

The canary loop is a controlled fix-and-verify runner for one agent and one historical run context.

It is designed to:
- reproduce a specific failure from run artifacts
- classify the failure (errors and warnings)
- apply a bounded fix strategy
- rerun tests and canary
- stop only on pass or explicit safety bounds

It also supports pipeline resume execution from an arbitrary agent boundary, while hydrating prior-agent outputs from the same historical run.

It is not a general full-pipeline runner. It is a targeted stabilization loop.

---

## What It Runs Against

Inputs:
- `runId` (`run_xxx` or `latest`)
- `agent` (registered pipeline agent)
- `startFromAgent` (optional explicit pipeline restart boundary; defaults to `agent`)
- `hydratePriorFromRun` (default `true`)
- optional mode/options (iteration cap, test scope, chapter start for Agent 9)

Primary artifact sources:
- `documentation/prompts/actual/run_*`
- `apps/api/data/reports/**/run_<id>.json` (fallback)

The loop resolves request/response artifacts, log markers, and validator outputs for the selected agent.

When pipeline resume mode is enabled, it also resolves and hydrates upstream agent outputs from the same run into execution context before running from `startFromAgent` onward.

---

## Resume-From-Agent Execution Model

### Intent

Allow canary execution to begin at any registered agent while reusing previously produced LLM outputs from that run for upstream dependencies.

### Behavior

1. Resolve run artifacts for all agents from pipeline start up to `startFromAgent - 1`.
2. Extract normalized upstream outputs from captured request/response artifacts and persisted run report data.
3. Hydrate orchestrator context with those upstream artifacts as immutable inputs.
4. Execute pipeline from `startFromAgent` through downstream stages.
5. Keep retry/fix scope centered on the selected `agent`, but validate full downstream impact.

### Hydration guarantees

- Hydration must use artifacts from the same `runId`.
- Missing required upstream artifacts fail precheck unless a deterministic fallback is explicitly defined for that upstream stage.
- Hydrated upstream artifacts are treated as read-only for the iteration unless the selected playbook explicitly targets upstream correction.

---

## Core Behavior

Each iteration follows this sequence:

1. Precheck
- validate CLI inputs
- validate supported agent mapping
- validate option constraints (for example, Agent 9 chapter bounds)

2. Load and classify failure
- parse run artifacts and bounded logs
- classify both errors and warnings into canonical signatures
- stop if classifier confidence is too low

3. Root-cause and retry packet
- form a root-cause hypothesis
- build a machine-readable retry packet with exact `must_fix` and `warnings_to_clear`

4. Plan and apply fix
- prefer prompt-contract fixes first
- allow code-level deterministic fixes only when policy permits escalation
- enforce scope/file-count safety gates before applying

5. Validate
- run targeted tests (or full tests when targeted mapping is unavailable)
- rerun canary for the selected agent

6. Compare result and decide
- pass only when canary passes and unresolved errors/warnings are zero
- otherwise continue if bounded progress conditions hold
- stop on iteration/safety bounds

---

## Pass Criteria

A run is `pass` only when all are true:
- canary command exits successfully
- unresolved errors for the selected agent = `0`
- unresolved warnings for the selected agent = `0`

Warning handling is blocking in v1 (`warningBudget=0`).

---

## Command

```bash
npm run canary:agent-loop -- --runId <runId|latest> --agent <agentName> [options]
```

Per-agent shortcut form (recommended for resume execution):

```bash
npm run canary:agent2e -- --runId <runId|latest>
```

### Options

- `--runId <id|latest>` required
- `--agent <name>` required
- `--startFromAgent <name>` optional (defaults to `--agent`)
- `--hydratePriorFromRun true|false` default `true`
- `--mode suggest|apply` default `apply`
- `--maxIterations <n>` default `5`
- `--maxUnchanged <n>` default `2`
- `--testScope targeted|full` default `targeted`
- `--canaryCommand <cmd>` optional override
- `--stopOnNewFailureClass true|false` default `true`
- `--allowFiles <glob,...>` optional
- `--denyFiles <glob,...>` optional
- `--resume <ledgerPath>` optional
- `--overrideFileCap <n>` optional (explicit opt-in)
- `--startChapter <n>` optional, Agent 9 only

### Exit Codes

- `0` pass
- `1` stopped by bounded failure/safety gate
- `2` precheck or artifact resolution failure
- `3` validation infrastructure failure (tests/canary command execution issue)

---

## Agent Support Contract

The loop is agent-agnostic, but each supported agent must be declared in config:
- `agentToCanaryCommand`
- `agentToTargetedTestCommands`

For resume-from-agent execution, each supported agent must also define hydration dependencies (which prior agent outputs are required to start from this boundary).

Rules:
- if `--agent` is unsupported and no explicit `--canaryCommand` is provided, precheck fails
- if targeted tests are missing, the loop degrades to full tests (or fails if package mapping is unknown)
- canary command fallback to an unrelated agent is not allowed
- if `--startFromAgent` is provided, it must be a registered pipeline agent and not later than the selected `--agent` focus scope when strict mode is enabled
- if `hydratePriorFromRun=true`, missing required upstream artifacts for `--startFromAgent` fail precheck

---

## Agent 9 Chapter Start

`--startChapter` is valid only with Agent 9.

Behavior:
- interpreted as 1-based chapter restart boundary
- propagated through Agent 9 retry/prose contract (`fromChapter` / `chapterStart` semantics)
- canary validation checks chapter window `startChapter..end`
- precheck fails if chapter metadata exists and `startChapter` exceeds chapter count
- if chapter metadata is unavailable, loop continues with warning and validates bounds once concrete chapter artifacts are loaded

Example:

```bash
npm run canary:agent-loop -- --runId latest --agent Agent9-Prose --startChapter 7 --maxIterations 4
```

---

## Safety Model

The loop is safe-by-default:
- no destructive git operations
- bounded iteration count
- allowlist/denylist file gating
- generated run artifact folders are protected from edits
- per-iteration file-touch cap (default 4 files)
- lock file to prevent concurrent loops on the same run
- no-op edit detection to avoid useless churn

---

## Outputs

Per execution, the loop writes:
- JSONL ledger: `documentation/analysis/canary-loops/<timestamp>-<runId>-<agent>.jsonl`
- Markdown summary: `documentation/analysis/canary-loops/<timestamp>-<runId>-<agent>.md`

Each ledger iteration records:
- input/output signatures
- root-cause hypothesis
- retry feedback packet
- selected playbook/actions
- changed files
- test and canary outcomes
- continue/pass/stop decision

---

## Resume Semantics

`--resume <ledgerPath>` continues from the last iteration with reproducibility checks.

Resume guard:
- workspace fingerprint (`HEAD` + dirty hash) must match the last ledger entry
- if mismatch, resume stops with reproducibility warning (unless explicit force behavior is implemented)

---

## Prompt-First Remediation

Default strategy is prompt-first.

Meaning:
- the first retry path is a structured prompt-contract correction
- deterministic code fixes are escalation paths, not first-line behavior
- escalation is allowed when root cause indicates runtime/policy layer issues or prompt retries fail to reduce the same class

This keeps the system aligned with robust generation quality rather than sanitizer-only convergence.

---

## Typical Usage Patterns

1. Diagnose only (no edits)

```bash
npm run canary:agent-loop -- --runId latest --agent Agent5-ClueExtraction --mode suggest
```

2. Apply bounded fixes for one failure class

```bash
npm run canary:agent-loop -- --runId run_20260415_1930 --agent Agent5-ClueExtraction --maxIterations 5 --testScope targeted
```

3. Agent 9 partial restart from chapter boundary

```bash
npm run canary:agent-loop -- --runId run_20260415_2026 --agent Agent9-Prose --startChapter 9 --maxIterations 3
```

4. Restrict editable files for high-safety runs

```bash
npm run canary:agent-loop -- --runId latest --agent Agent6-FairPlay --allowFiles "packages/prompts-llm/src/**,packages/story-validation/src/**"
```

5. Start execution at Agent 2e using run hydration (shortcut script)

```bash
npm run canary:agent2e -- --runId run_20260417-2110_20f9ca27
```

6. Start execution at Agent 5 and hydrate Agent 1/2/2e/3b/3 outputs from the same run

```bash
npm run canary:agent-loop -- --runId run_20260417-2110_20f9ca27 --agent Agent5-ClueExtraction --startFromAgent Agent5-ClueExtraction --hydratePriorFromRun true
```

---

## Troubleshooting

- Precheck says unsupported agent:
  - add agent mappings to canary/test command config or pass explicit `--canaryCommand`.

- Loop stops on low confidence:
  - improve signature taxonomy mapping for the failing marker set.

- Loop repeats without progress:
  - inspect unchanged signature count and retry packet quality; tighten root-cause hypothesis.

- Agent 9 chapter start rejected:
  - confirm `--startChapter >= 1` and within known chapter count.

- Canary command mismatch:
  - verify `agentToCanaryCommand[agent]` points to the correct agent-specific canary.

---

## Current Repository Note

At the time of writing, `package.json` exposes `canary:core` as the shared concrete canary command.

The `canary:agent-loop` command and full all-agent map are defined by the canary-loop design and should be wired in scripts/config as implementation lands.

The per-agent shortcuts (for example `canary:agent2e`) and `startFromAgent + hydratePriorFromRun` execution path are specified behavior and should be treated as required wiring targets.
