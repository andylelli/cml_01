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

Optional scope expansion behavior:
- when `--autoExpandUpstreamScope=true`, the loop may move `startFromAgent` upstream if signature stage/class indicates upstream-generated data is likely causing the current agent failure.

### Hydration guarantees

- Hydration must use artifacts from the same `runId`.
- Missing required upstream artifacts normally fail precheck, but can be downgraded to warnings when the resolved canary command is boundary-safe (`canary-agent-boundary` or `canary-agent9`) and can self-hydrate runtime context.
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
- return `pass_with_warnings` when canary passes but warning-level signature remains unchanged past `maxUnchanged`
- normalize non-success canary outcomes to critical class `canary.execution_failure` before continuation/stop policy evaluation
- otherwise continue if bounded progress conditions hold
- stop on iteration/safety bounds

7. Rollback unresolved implementation changes
- when `--rollbackFailedChanges=true` (default), unresolved implementation edits are reverted before the next iteration/stop return
- snapshots of reverted edits are archived under the active run folder for future consultation

---

## Pass Criteria

A run is `pass` only when all are true:
- canary command exits successfully
- unresolved errors for the selected agent = `0`
- unresolved warnings for the selected agent = `0`

Warning handling is blocking in v1 (`warningBudget=0`).

Bounded exception:
- if canary passes and only warning-level signature remains unchanged past the unchanged-signature bound, the loop exits non-fatally as `pass_with_warnings`.

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
- `--yaml <file>` optional; load run request fields from a YAML file. Relative paths resolve under `scripts/canary-loop/`.
- `--inputYaml <file>` optional legacy alias for `--yaml`.
- `--hydratePriorFromRun true|false` default `true`
- `--quickRun true|false` default `false`; enables a fast-path preset that minimizes unnecessary reruns
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
- `--confirmSharedEdits true|false` optional; required in apply mode when edits touch configured shared files
- `--rollbackFailedChanges true|false` default `true`; rollback unresolved implementation changes and archive snapshots in the run folder
- `--autoExpandUpstreamScope true|false` default `false`; auto-expand `--startFromAgent` upstream when signature stage indicates upstream-generated data is likely the root cause

Quick run preset behavior (`--quickRun=true`):
- pins `--startFromAgent` to the selected `--agent` boundary
- forces `--hydratePriorFromRun=true`
- forces runtime upstream hydration mode (`CANARY_FORCE_FRESH_UPSTREAM=false`)
- disables broadening/escalation paths that increase rerun scope (`--autoExpandUpstreamScope=false`, `--enableMajorRework=false`)
- forces targeted tests and tight unchanged stopping (`--testScope=targeted`, `maxUnchanged<=1`)

Terminal major-rework reset behavior:
- when `enableMajorRework=true`, the loop forces major-rework escalation on the terminal iteration
- if that terminal major-rework attempt still hits an iteration-budget stop (`maxIterations` or `maxUnchanged`), the loop resets the iteration counter to `0` once and starts a fresh apply window
- safety stops like low-confidence signatures are not reset

YAML request file behavior:
- YAML root must be an object with the same keys accepted by CLI flags (`runId`, `agent`, `startFromAgent`, `mode`, `maxIterations`, `maxUnchanged`, `testScope`, `quickRun`, `enableMajorRework`, etc.)
- YAML may be either root-level fields or `{ inputs: { ... } }`
- if `agent` or `startFromAgent` is blank in YAML, the CLI prompts at runtime in interactive terminals
- CLI flags override YAML values when both are provided

Implementation note:
- `--canaryCommand` supports multi-token command values and consumes tokens until the next `--flag`.
- archived rollback snapshots are written to `logs/canary-loops/<YYMMDD-HHMM[-nn]>/failed-changes/iterNN/` when unresolved implementation changes are reverted.

### Exit Codes

- `0` success (`pass`, `pass_with_warnings`, or `suggest_plan_ready`)
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
- if `hydratePriorFromRun=true`, missing required upstream artifacts for `--startFromAgent` fail precheck unless boundary-safe canary downgrade applies (warning + continue)

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
- unresolved implementation changes are rolled back by default and archived in-run (`failed-changes/iterNN/`)

---

## Outputs

Per execution, the loop writes:
- run folder: `logs/canary-loops/<YYMMDD-HHMM[-nn]>/`
- JSONL ledger: `logs/canary-loops/<YYMMDD-HHMM[-nn]>/<timestamp>-<runId>-<agent>.jsonl`
- Markdown summary: `logs/canary-loops/<YYMMDD-HHMM[-nn]>/<timestamp>-<runId>-<agent>.md`
- Major rework detail log: `logs/canary-loops/<YYMMDD-HHMM[-nn]>/canary-major-rework-<timestamp>-<runId>-<agent>.jsonl` and `.md`
- Consolidated summaries: `logs/canary-loops/<YYMMDD-HHMM[-nn]>/<timestamp>-<runId>-<agent>.summary.json` and `.summary.md`

Operational/support files in the same folder:
- run-level rollups: `logs/canary-loops/<YYMMDD-HHMM[-nn]>/SUMMARY.json` and `logs/canary-loops/<YYMMDD-HHMM[-nn]>/SUMMARY.md`
- lock files: `logs/canary-loops/.locks/*`
- signature cache: `logs/canary-loops/signature-fix-cache.json`

Each ledger iteration records:
- input/output signatures
- root-cause hypothesis
- retry feedback packet
- selected playbook/actions
- changed files
- test and canary outcomes
- continue/pass/pass_with_warnings/stop decision

---

## Relevant Log Files

Use this map when triaging a failing or looping canary run.

- `logs/canary-loops/<YYMMDD-HHMM[-nn]>/<timestamp>-<runId>-<agent>.jsonl`
  Canonical iteration ledger for a single loop execution. Check decisions, signatures, playbooks, and stop reason first.

- `logs/canary-loops/<YYMMDD-HHMM[-nn]>/<timestamp>-<runId>-<agent>.md`
  Human-readable per-run summary generated from the ledger.

- `logs/canary-loops/<YYMMDD-HHMM[-nn]>/canary-major-rework-<timestamp>-<runId>-<agent>.md`
  Dedicated major-rework narrative by iteration (selection rationale, terminal-force status, reset behavior, scope, and rework brief links).

- `logs/canary-loops/<YYMMDD-HHMM[-nn]>/canary-major-rework-<timestamp>-<runId>-<agent>.jsonl`
  Structured major-rework iteration records for tooling/analysis.

- `logs/canary-loops/<YYMMDD-HHMM[-nn]>/<timestamp>-<runId>-<agent>.summary.json`
  Structured summary artifact (when generated) for tooling/report aggregation.

- `logs/canary-loops/<YYMMDD-HHMM[-nn]>/<timestamp>-<runId>-<agent>.summary.md`
  Markdown summary companion to `.summary.json`.

- `logs/canary-loops/<YYMMDD-HHMM[-nn]>/SUMMARY.json`
  Aggregate summary across recent canary-loop runs in this workspace.

- `logs/canary-loops/<YYMMDD-HHMM[-nn]>/SUMMARY.md`
  Human-readable aggregate summary across recent runs.

- `logs/canary-loops/.locks/*`
  Concurrency lock artifacts. Inspect when a run appears stuck or reports lock contention.

- `logs/canary-loops/signature-fix-cache.json`
  Signature remediation cache used to reduce repeated classification/fix churn.

- `documentation/prompts/actual/run_<id>/INDEX.md`
  Index for captured prompt/response artifacts for a specific run.

- `documentation/prompts/actual/run_<id>/*_request.md`
  Per-agent request payload snapshots used for root-cause analysis and retry packet quality checks.

- `documentation/prompts/actual/run_<id>/*_response.md`
  Per-agent model response snapshots used to validate whether prompt-contract changes took effect.

- `documentation/prompts/actual/run_<id>/.actual-run-state.json`
  Run-state metadata captured alongside prompt artifacts.

- `apps/api/data/reports/**/run_<id>.json`
  Persisted API report fallback used when prompt artifacts are missing or incomplete.

- `logs/activity.jsonl`
  Application activity stream. Useful for correlating canary-loop timeline events with API/worker behavior.

- `logs/llm.jsonl`
  LLM interaction log stream for prompt/response diagnostics outside per-run artifact folders.

- `logs/vitest-*.txt`
  Test output captures used when validating targeted/full test behavior during remediation.

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

1. Description: Diagnose a failure without applying any edits.

```bash
npm run canary:agent-loop -- --runId latest --agent Agent5-ClueExtraction --mode suggest
```

Breakdown:
- `npm run canary:agent-loop --` launches the loop CLI and passes remaining args through.
- `--runId latest` analyzes the most recent run artifacts.
- `--agent Agent5-ClueExtraction` scopes diagnosis to Agent 5 signatures/playbooks.
- `--mode suggest` produces recommendations only (no file edits).

2. Description: Apply bounded fixes for one failure class.

```bash
npm run canary:agent-loop -- --runId run_20260415_1930 --agent Agent5-ClueExtraction --maxIterations 5 --testScope targeted
```

Breakdown:
- `--runId run_20260415_1930` pins to a specific historical run.
- `--agent Agent5-ClueExtraction` targets Agent 5 remediation policy.
- `--maxIterations 5` caps retry attempts.
- `--testScope targeted` runs mapped targeted tests instead of full-suite tests.

3. Description: Run a full pipeline retry from Agent 1 through Agent 9, with Agent 9 as decision focus.

```bash
npm run canary:agent-loop -- --runId latest --agent Agent9-Prose --startFromAgent Agent1-SettingRefiner --hydratePriorFromRun true --maxIterations 5 --testScope full
```

Breakdown:
- `--agent Agent9-Prose` sets final focus/stop policy at the prose stage.
- `--startFromAgent Agent1-SettingRefiner` re-executes the full downstream pipeline from Agent 1.
- `--hydratePriorFromRun true` loads any required upstream artifacts from the same run when available.
- `--maxIterations 5` keeps retries bounded.
- `--testScope full` runs full validation coverage each iteration.

4. Description: Agent 9 partial restart from a chapter boundary.

```bash
npm run canary:agent-loop -- --runId run_20260415_2026 --agent Agent9-Prose --startChapter 9 --maxIterations 3
```

Breakdown:
- `--startChapter 9` restarts prose remediation at chapter 9 (1-based).
- `--agent Agent9-Prose` enables Agent 9 chapter-aware contracts.
- `--maxIterations 3` limits retries for quick, bounded chapter recovery.

5. Description: Restrict editable files for high-safety runs.

```bash
npm run canary:agent-loop -- --runId latest --agent Agent6-FairPlay --allowFiles "packages/prompts-llm/src/**,packages/story-validation/src/**"
```

Breakdown:
- `--agent Agent6-FairPlay` targets fair-play validation signatures.
- `--allowFiles "..."` constrains edits to prompt and validation package paths.
- `--runId latest` uses the newest run to reduce operator lookup overhead.

6. Description: Start execution at Agent 2e using the shortcut script.

```bash
npm run canary:agent2e -- --runId run_20260417-2110_20f9ca27
```

Breakdown:
- `canary:agent2e` preconfigures `--agent` and `--startFromAgent` for Agent 2e.
- `--runId run_20260417-2110_20f9ca27` selects the run to hydrate/analyze.

7. Description: Start execution at Agent 5 and hydrate upstream outputs from the same run.

```bash
npm run canary:agent-loop -- --runId run_20260417-2110_20f9ca27 --agent Agent5-ClueExtraction --startFromAgent Agent5-ClueExtraction --hydratePriorFromRun true
```

Breakdown:
- `--startFromAgent Agent5-ClueExtraction` resumes pipeline execution at Agent 5.
- `--hydratePriorFromRun true` injects required upstream artifacts from the same `runId`.
- `--agent Agent5-ClueExtraction` keeps retry focus on Agent 5 signatures.

8. Description: Run the full baseline canary once (no retry loop).

```bash
npm run canary:core
```

Breakdown:
- `canary:core` builds `@cml/worker` then executes `scripts/canary-core.mjs`.
- This is useful as a clean full-run baseline before or after loop-based remediation.

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

The repository currently exposes `canary:agent-loop` and per-agent wrappers (`canary:agent1`, `canary:agent2`, `canary:agent2b`, `canary:agent2c`, `canary:agent2d`, `canary:agent2e`, `canary:agent3`, `canary:agent3b`, `canary:agent4`, `canary:agent5`, `canary:agent6`, `canary:agent65`, `canary:agent7`, `canary:agent9`) in `package.json`.

Boundary-safe agent mappings use `scripts/canary-agent-boundary.mjs --agent <code>` for most agents, while Agent 9 uses `scripts/canary-agent9.mjs`.

`canary:core` still exists, but selected-agent loop execution is expected to run through the mapped per-agent canary commands.
