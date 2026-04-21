# Agent Canary Framework - Detailed Design (DLD)

**Primary Description:** `documentation/11_canary_loop/11_canary_loop.md`  
**Goal:** Implementation-ready code/spec design for autonomous per-run/per-agent canary fix loops.

---

## 1. Scope and Assumptions

1. Each invocation targets one selected agent (`--agent`), but the framework supports all registered pipeline agents.
2. Execution may start from an arbitrary agent boundary (`--startFromAgent`) instead of always replaying from Agent 1.
3. Upstream dependency context for that boundary is hydrated from the same run by default.
4. Framework runs locally in the repo workspace and uses existing scripts/tests.
5. Framework must be safe-by-default:
- no destructive git operations
- bounded iteration count
- reversible edit scope with guaranteed rollback artifacts
6. First release supports all registered agents, including Agent 9 prose generation flows.
7. v1 supports one explicit `startFromAgent` boundary per invocation only; multi-hop dependency sessions are out of scope.
8. v1 knowledge cache is runtime-only local storage; repo-persisted cache is out of scope.

---

## 2. CLI Contract

## 2.1 Command

`npm run canary:agent-loop -- --runId <runId|latest> --agent <agentName> [options]`

## 2.2 Options

- `--runId <id|latest>` required
- `--agent <name>` required
- `--startFromAgent <name>` optional; defaults to `--agent`
- `--hydratePriorFromRun true|false` default `true`
- `--quickRun true|false` default `false`; fast-path preset for boundary-local retries
- `--enableMajorRework true|false` default `true`; allow deep redesign escalation
- `--mode suggest|apply` default `apply`
- `--maxIterations <n>` default `5`
- `--maxUnchanged <n>` default `2`
- `--testScope targeted|full` default `targeted`
- `--canaryCommand <cmd>` optional
- `--stopOnNewFailureClass true|false` default `true`
- `--allowFiles <glob,...>` optional
- `--denyFiles <glob,...>` optional
- `--resume <ledgerPath>` optional
- `--overrideFileCap <n>` optional (requires explicit opt-in; default disabled)
- `--startChapter <n>` optional; Agent 9 only (1-based chapter index)
- `--confirmSharedEdits true|false` default `false`; required when apply mode touches configured shared files
- `--rollbackFailedChanges true|false` default `true`; revert unresolved implementation edits and archive snapshots in run folder
- `--autoExpandUpstreamScope true|false` default `false`; widen `--startFromAgent` upstream when signature stage/class indicates upstream-generated defects

Quick-run major-rework interaction:
- quick-run preset defaults `enableMajorRework=false` to reduce broad rerun scope
- explicit `--enableMajorRework=true` overrides quick-run suppression and keeps major rework enabled

Implementation note:
- `--canaryCommand` accepts multi-token command values.
- Prefer quoting or `--canaryCommand=...` for deterministic parsing.
- Unquoted boundary-runner nested flags (`--agent`, `--startChapter`) remain attached to `--canaryCommand`.

## 2.2.1 Per-agent shortcut scripts (required command surface)

The CLI must expose per-agent convenience wrappers for resume execution. Example names:

- `npm run canary:agent1`
- `npm run canary:agent2`
- `npm run canary:agent2b`
- `npm run canary:agent2c`
- `npm run canary:agent2d`
- `npm run canary:agent2e`
- `npm run canary:agent3`
- `npm run canary:agent3b`
- `npm run canary:agent4`
- `npm run canary:agent5`
- `npm run canary:agent6`
- `npm run canary:agent65`
- `npm run canary:agent7`
- `npm run canary:agent9`

Each wrapper resolves to `canary:agent-loop` with:
- fixed `--agent <canonicalAgent>`
- default `--startFromAgent <same canonicalAgent>`
- default `--hydratePriorFromRun true`

## 2.3 Supported Agent Contract

1. `config.mjs` must declare supported agents via:
- `agentToCanaryCommand`
- `agentToTargetedTestCommands`
2. Supported agent keys must be derived from the worker agent registry (`apps/worker/src/jobs/agents/index.ts`) so the loop can run for any registered agent (Agent1..Agent9 and sub-agents).
3. If `--agent` is not in the supported map:
- use `--canaryCommand` only if explicitly provided, otherwise fail precheck with exit code `2`.
4. If targeted test commands are missing for a supported agent:
- degrade to `testScope=full` for affected packages and emit warning,
- or fail precheck when package mapping is unavailable.
5. Agent-specific option contract:
- `--startChapter` is valid only for Agent 9.
- If `--startChapter` is provided for non-Agent9, fail precheck with exit code `2`.
- For Agent 9, `--startChapter` must be integer `>= 1` and within known chapter range when chapter metadata is available.
6. Resume-from-agent contract:
- `--startFromAgent` must be a registered pipeline agent.
- If `--hydratePriorFromRun=true`, required upstream artifacts for `startFromAgent` must resolve from same `runId` or precheck fails.
- If `--hydratePriorFromRun=false`, command is valid only when deterministic synthetic context is available for all required upstream dependencies; otherwise precheck fails.

## 2.4 Exit Codes

- `0`: success terminal outcome (`pass`, `pass_with_warnings`, or `suggest_plan_ready`)
- `1`: stopped due to bounded failure or safety gate
- `2`: preflight or artifact resolution failure
- `3`: validation command infrastructure failure (test/canary command could not execute)

---

## 3. Module and File Layout

## 3.1 New files

- `scripts/canary-agent-loop.mjs`  
Entry point, argv parsing, controller bootstrap.

- `scripts/canary-loop/controller.mjs`  
Main iteration state machine.

- `scripts/canary-loop/types.mjs`  
JSDoc typedefs for requests, signatures, iteration records.

- `scripts/canary-loop/artifacts.mjs`  
Run/agent artifact resolution and normalization.

- `scripts/canary-loop/hydrate.mjs`  
Same-run upstream dependency resolution and context hydration for `startFromAgent`.

- `scripts/canary-loop/signatures.mjs`  
Failure parsing and signature canonicalization.

- `scripts/canary-loop/playbooks.mjs`  
Failure class to fix strategy mapping.

- `scripts/canary-loop/patches.mjs`  
Patch planning and safe apply adapters.

- `scripts/canary-loop/validate.mjs`  
Test and canary execution orchestration.

- `scripts/canary-loop/ledger.mjs`  
JSONL/Markdown ledger writes and resume reads.

- `scripts/canary-loop/config.mjs`  
Defaults, agent-to-command map, allowed paths.

## 3.2 Documentation outputs

- `logs/canary-loops/<YYMMDD-HHMM[-nn]>/<timestamp>-<runId>-<agent>.jsonl`
- `logs/canary-loops/<YYMMDD-HHMM[-nn]>/<timestamp>-<runId>-<agent>.md`
- `logs/canary-loops/<YYMMDD-HHMM[-nn]>/<timestamp>-<runId>-<agent>.summary.json`
- `logs/canary-loops/<YYMMDD-HHMM[-nn]>/<timestamp>-<runId>-<agent>.summary.md`
- `logs/canary-loops/<YYMMDD-HHMM[-nn]>/SUMMARY.json`
- `logs/canary-loops/<YYMMDD-HHMM[-nn]>/SUMMARY.md`
- `logs/canary-loops/<YYMMDD-HHMM[-nn]>/failed-changes/iterNN/{before,after,manifest.json}` (when rollback executes)

---

## 4. Data Contracts

## 4.1 LoopRequest

```js
{
  runId: string,                  // run_xxx or "latest"
  agent: string,                  // e.g. Agent5-ClueExtraction
  startFromAgent?: string,        // default = agent
  hydratePriorFromRun?: boolean,  // default = true
  quickRun?: boolean,
  enableMajorRework?: boolean,
  mode: "suggest" | "apply",
  maxIterations: number,
  maxUnchanged: number,
  testScope: "targeted" | "full",
  canaryCommand?: string,
  stopOnNewFailureClass: boolean,
  allowFiles?: string[],
  denyFiles?: string[],
  resume?: string,
  overrideFileCap?: number,
  startChapter?: number,          // Agent9-only chapter restart index (1-based)
  confirmSharedEdits?: boolean,   // required when touching configured shared files in apply mode
  rollbackFailedChanges?: boolean,
  autoExpandUpstreamScope?: boolean
}
```

## 4.2 ArtifactBundle

```js
{
  runId: string,
  projectId?: string,
  runFolder?: string,
  runReportPath?: string,
  runReport?: object,
  runStatePath?: string,
  runState?: object,
  chapterCount?: number,
  chapterWindow?: { start: number, end: number },
  agentRequests: string[],
  agentResponses: string[],
  upstreamAgentArtifacts?: Array<{
    agent: string,
    requests: string[],
    responses: string[],
    integrity: { missingRequestCount: number, missingResponseCount: number, emptyResponseBodyCount: number }
  }>,
  hydrationBundle?: {
    sourceRunId: string,
    startFromAgent: string,
    upstreamAgents: string[],
    hydratedArtifacts: Record<string, unknown>,
    missingRequiredArtifacts: string[],
    integrity: { partial: boolean, warnings: string[] }
  },
  logs: string[],
  integrity: {
    missingRequestCount: number,
    missingResponseCount: number,
    emptyResponseBodyCount: number
  }
}
```

## 4.3 FailureSignature

```js
{
  signatureId: string,            // stable hash of class + normalized message + stage
  agent: string,
  stage: string,                  // e.g. clues, cml-revision, fair-play, schema
  class: string,                  // taxonomy key
  severity: "critical" | "warning",
  confidence: number,             // 0.0..1.0 classifier confidence
  kind: "error" | "warning",    // explicit validation kind
  message: string,
  evidence: Array<{ file: string, line?: number, snippet?: string }>,
  rawMarkers: string[],
  validator: string               // source validator/audit stage
}
```

## 4.4 IterationRecord

```js
{
  iteration: number,
  timestamp: string,
  workspaceFingerprint: {
    headCommit?: string,
    dirtyHash?: string
  },
  inputSignature?: FailureSignature,
  rootCause: {
    hypothesis: string,
    confidence: number,
    sourceLayer: "prompt_contract" | "llm_output_shape" | "runtime_validation" | "orchestrator_policy"
  },
  retryFeedbackPacket?: {
    mustFix: string[],
    warningsToClear: string[],
    forbiddenTerms?: string[],
    requiredReplacements?: string[],
    sourcePathBounds?: string[],
    passContract: string[]
  },
  selectedPlaybooks: string[],
  phaseGateStatus?: {
    p1Complete: boolean,
    p2Complete: boolean,
    hasControlPoint: boolean,
    blockedBy: string[]
  },
  plannedActions: string[],
  changedFiles: string[],
  tests: Array<{ command: string, passed: boolean, summary: string }>,
  canary: { command: string, passed: boolean, summary: string },
  outputSignature?: FailureSignature,
  decision: "continue" | "pass" | "pass_with_warnings" | "stop",
  stopReason?: string
}
```

---

## 5. Failure Signature Taxonomy v1

This v1 taxonomy is seed coverage for known recurring classes and must be extensible for all supported agents.

## 5.1 Top-level classes

- `agent5.red_herring_overlap`
- `agent5.invalid_source_path`
- `agent5.discriminating_id_coverage`
- `agent5.weak_elimination_evidence`
- `agent5.time_style_violation`
- `agent6.fairplay_structural_critical`
- `agent6.runtime_null_guard`
- `cml.required_evidence_missing`
- `cml.schema_required_field_missing`
- `orchestrator.backfill_threshold_breach`
- `canary.execution_failure`
- `unknown.pipeline_failure`

## 5.2 Signature extraction precedence

1. Explicit pipeline terminal messages
2. Agent-specific hard gate markers
3. Fair-play audit critical + warning violations
4. Schema validation errors + warnings
5. Generic fallback from final error block

## 5.3 Normalization rules

1. Strip volatile values (run IDs, attempt counts, timestamps).
2. Normalize quoted field paths (e.g., `CASE.inference_path.steps[2].required_evidence`).
3. Collapse repeated whitespace and punctuation.
4. Canonicalize common synonym markers to a stable class phrase set before hashing.

## 5.4 Warning and Error Policy

1. Both errors and warnings are classified and tracked as first-class signatures.
2. For targeted agent loops, unresolved warnings are blocking by default (`warningBudget=0`).
3. Primary pass criteria require zero unresolved errors, zero unresolved warnings for the selected agent, and canary pass.
4. Bounded exception: if canary passes and warning-level signature remains unchanged beyond `maxUnchanged`, loop returns non-fatal `pass_with_warnings` instead of hard stop.

---

## 6. Controller State Machine

## 6.1 States

- `PRECHECK`
- `LOAD_ARTIFACTS`
- `HYDRATE_CONTEXT`
- `CLASSIFY_FAILURE`
- `ROOT_CAUSE_ANALYSIS`
- `BUILD_RETRY_PACKET`
- `PLAN_FIX`
- `APPLY_FIX`
- `RUN_TESTS`
- `RUN_CANARY`
- `COMPARE_SIGNATURE`
- `STOP_PASS`
- `STOP_PASS_WITH_WARNINGS`
- `STOP_FAIL`

## 6.2 Transition rules

1. `PRECHECK -> LOAD_ARTIFACTS` if CLI is valid.
2. `LOAD_ARTIFACTS -> HYDRATE_CONTEXT` if artifacts resolved.
3. `HYDRATE_CONTEXT -> CLASSIFY_FAILURE` if required upstream dependencies are hydrated.
4. `HYDRATE_CONTEXT -> CLASSIFY_FAILURE` with warning downgrade when required upstream artifacts are missing but resolved canary command is boundary-safe (`canary-agent-boundary` or `canary-agent9`) and can self-hydrate context.
5. `HYDRATE_CONTEXT -> HYDRATE_CONTEXT` (boundary expansion) when `autoExpandUpstreamScope=true` and signature stage/class maps to an upstream root-cause layer; recompute hydration bundle for the expanded boundary.
6. `HYDRATE_CONTEXT -> STOP_FAIL` on missing required upstream artifacts under `hydratePriorFromRun=true` when boundary-safe downgrade is not applicable.
7. `CLASSIFY_FAILURE -> ROOT_CAUSE_ANALYSIS` when signature found and `confidence >= MIN_CONFIDENCE`.
8. `CLASSIFY_FAILURE -> STOP_FAIL` when signature confidence is below `MIN_CONFIDENCE` (default `0.6`).
9. `ROOT_CAUSE_ANALYSIS -> BUILD_RETRY_PACKET` when root cause hypothesis confidence is acceptable (default `>=0.7`).
10. `BUILD_RETRY_PACKET -> PLAN_FIX` after packet integrity checks pass.
11. `PLAN_FIX -> APPLY_FIX` only in `apply` mode; otherwise emit plan and stop.
12. `PLAN_FIX -> PLAN_FIX` (phase-gating refinement) when major rework is selected and blocked phases must be deferred until prerequisites are satisfied.
13. `APPLY_FIX -> RUN_TESTS` if patch scope gate passes.
14. `RUN_TESTS -> RUN_CANARY` only when tests pass.
15. `RUN_CANARY -> STOP_PASS` if canary passes and no unresolved warning signatures remain.
16. `RUN_CANARY -> COMPARE_SIGNATURE` if canary fails, or if warnings persist.
17. `COMPARE_SIGNATURE -> STOP_PASS_WITH_WARNINGS` when unchanged-signature bound is hit, canary passes, and remaining signature severity is warning.
18. `COMPARE_SIGNATURE -> ROOT_CAUSE_ANALYSIS` if continue conditions hold.
19. `COMPARE_SIGNATURE -> ROOT_CAUSE_ANALYSIS` with rollback side-effect when unresolved iteration output is produced and `rollbackFailedChanges=true`.
20. Any state -> `STOP_FAIL` on safety breach, max iteration, unresolved infrastructure error, unsupported agent command contract, invalid Agent 9 chapter bounds, hydration dependency failure (without boundary-safe downgrade), low-confidence classification/root-cause hypothesis, or no-op patch.

## 6.3 Continue/stop logic

Continue if all true:
1. `iteration < maxIterations`
2. Failure class changed or severity reduced, or unchanged count <= `maxUnchanged`
3. No new higher-severity class when `stopOnNewFailureClass=true`
4. Latest output signature confidence remains `>= MIN_CONFIDENCE`
5. Warning signatures are strictly decreasing and not stuck unchanged beyond `maxUnchanged`

Output signature normalization rule:
1. If validation canary is non-success (`passed !== true`, non-zero exit code, or failure-like status), output signature is forced to class `canary.execution_failure` with critical severity before continuation policy checks.

Stop otherwise with explicit reason.

## 6.4 Major rework phase-gate mechanics

Major rework uses three ordered playbooks:
- `P1`: `pb.rework.llm-request-contract-overhaul`
- `P2`: `pb.rework.response-processing-robustness`
- `P3`: `pb.rework.story-logic-research-lab`

Runtime enforcement:
1. If no rework playbook is selected, phase gate is a no-op.
2. If rework is selected and `P1` is not yet complete, defer `P2` and `P3`.
3. `P1` completion requires prior iteration evidence: selected `P1` plus non-generic `outputSignature.class`.
4. If `P1` is complete and `P2` is not, defer `P3`.
5. `P2` completion requires prior iteration evidence: selected `P2` plus non-generic `outputSignature.class`.
6. Once `P1` and `P2` are complete, allow `P3`.

Phase-gate observability:
- write deferred playbooks and gate blockers to narration + planned actions
- persist `phaseGateStatus` in major-rework logs (`.jsonl` and `.md`)
- include major-rework brief path and packet metrics for each iteration

---

## 7. Artifact Resolution Details

## 7.1 Run folder discovery

1. If `runId=latest`, pick latest by timestamp from `documentation/prompts/actual/run_*`.
2. Else match run folder where `.actual-run-state.json.runId == requested runId`.
3. If missing, fall back to report lookup under `apps/api/data/reports/**/run_<id>.json`.
4. If Agent 9 + `startChapter` is requested, resolve chapter count metadata from narrative/prose artifacts when present.

## 7.2 Agent record extraction

1. Parse `INDEX.md` table and `.actual-run-state.json.records` when available.
2. Collect request/response files whose `agent` matches requested agent.
3. Include retry records in chronological order.
4. For Agent 9 with `startChapter`, keep records at or after the requested chapter window for signature extraction and retry context.
5. Build integrity summary using state counters if present.

## 7.2.1 Upstream hydration extraction

1. Determine upstream chain for `startFromAgent` using canonical pipeline ordering.
2. For each upstream agent, resolve latest successful artifact payload from same `runId`.
3. Normalize artifact payloads into orchestrator-context-compatible shapes.
5. Mark missing required upstream artifacts as precheck errors when `hydratePriorFromRun=true`, unless boundary-safe canary downgrade policy applies.
6. For legacy run layouts where no branch records exist, downgrade missing `Agent2b/2c/2d` as optional upstream warnings for downstream boundaries.
7. Persist hydration diagnostics in ledger for reproducibility.

## 7.3 Log scraping

Primary patterns:
- `Pipeline failure`
- `hard gate failed`
- `validation failed before prose generation`
- `retrying CML generation`
- `CML revised`
- `Command exited with code`

Log boundary rules:
1. Prefer current-iteration command output artifact as primary source.
2. If unavailable, use run-scoped report/log sections bound to the selected `runId`.
3. Never classify from unbounded global logs; stale matches must be ignored.

---

## 8. Playbook Engine

## 8.1 Playbook schema

```js
{
  id: string,
  matches: (signature) => boolean,
  priority: number,
  mode: "prompt" | "code",      // prefer prompt mode in v1
  scope: { allow: string[], deny?: string[] },
  suggestActions: (ctx) => string[],
  apply: async (ctx) => { changedFiles: string[], notes: string[] },
  postChecks: string[],
  expectedSignatureDelta: string[] // classes/warnings expected to disappear
}
```

## 8.2 Initial playbooks

1. `pb.prompt.retry-packet-contract-harden`
- Mode: `prompt`
- For warning/error classes where output shape or contract drift is root cause.
- Typical files: prompt builders + retry payload generators (for example `packages/prompts-llm/src/agent5-clues.ts`).

2. `pb.prompt.source-bounds-and-id-traceability`
- Mode: `prompt`
- For source path legality, ID coverage, and traceability failures.
- Typical files: prompt builders + validator feedback serializers.

3. `pb.prompt.red-herring-lexical-separation`
- Mode: `prompt`
- For red-herring overlap warning/error classes.
- Typical files: retry payload composer and overlap-feedback prompt sections.

4. `pb.code.agent5.id-normalize-seed-synthesize`
- Mode: `code` (escalation-only)
- For persistent evidence ID coverage/path classes after prompt retries fail.
- Typical files: `apps/worker/src/jobs/agents/agent5-run.ts`, tests.

5. `pb.code.agent5.time-style-sanitizer`
- Mode: `code` (escalation-only)
- For persistent digit-time style violations after prompt retries fail.
- Typical files: `apps/worker/src/jobs/agents/agent5-run.ts`, tests.

6. `pb.code.agent6.structural-escalation-and-null-guard`
- Mode: `code` (escalation-only)
- For runtime guard gaps and structural escalation logic gaps.
- Typical files: `apps/worker/src/jobs/agents/agent6-run.ts`, tests.

7. `pb.code.cml.required-evidence-repair`
- Mode: `code` (escalation-only)
- For CML revision missing `required_evidence` arrays when prompt retries do not converge.
- Typical files: `apps/worker/src/jobs/agents/agent4-run.ts`, `agent6-run.ts`, schema validators, tests.

## 8.3 Prompt-First Remediation Policy

1. The framework must attempt prompt-contract fixes before code-level deterministic repairs.
2. First retry for a class uses a structured retry feedback packet that directly constrains the next LLM response.
3. Code-level deterministic fixes are permitted only when root cause is classified as `runtime_validation` or `orchestrator_policy`, or when two prompt-first retries fail to reduce the same class/warning set.
4. Any deterministic fallback repair must be logged as an exception with justification.
5. Design intent for v1: pass validation through correct prompting and retry guidance, not silent sanitizer behavior.

## 8.4 Playbook selection algorithm

1. Gather all matching playbooks.
2. Sort by priority descending.
3. Keep top `N=1` by default.
4. Allow `N=2` only if playbooks are compatibility-approved and file scopes do not overlap with conflicting edit intents.
5. Reject playbook if scope conflicts with request allow/deny filters.
6. Reject combination if mutex rules or conflict detector fails.

---

## 9. Patch Engine and Safety

## 9.1 Safety checks before apply

1. Any repository file may be changed when rollback artifacts are captured and reversible restore is guaranteed.
2. Reject edits in generated artifact folders (`documentation/prompts/actual/run_*`).
3. Reject if patch plan includes delete/rename outside configured bounds.
4. Reject if patch touches > `MAX_FILES_PER_ITERATION` (default 4) unless `--overrideFileCap` is explicitly set.
5. Acquire per-run lock file before apply to avoid concurrent loop collisions.
6. Enforce prompt-first gate: do not apply code-mode playbook until prompt-mode attempt(s) are exhausted per policy.
7. For Agent 9 + `startChapter`, disallow edits that would invalidate earlier locked chapter outputs unless explicitly allowlisted.
8. For resumed execution, disallow unplanned mutaFtion of hydrated upstream artifacts unless selected playbook explicitly targets upstream stages.
9. In `apply` mode, if patch plan touches configured shared files, require `--confirmSharedEdits=true`; otherwise fail precheck/apply gate.

Scope-filter behavior:
- `--allowFiles/--denyFiles` remain operator controls for narrowing scope, but are not a hard requirement for touching a file when rollback guarantees are present.
- when scope filters are bypassed, the run must record explicit rationale in ledger and rollback manifest.

## 9.2 Patch application

1. Use deterministic text patch operations.
2. Validate post-patch syntax/compile for touched package where feasible.
3. Compute `changedFiles` from pre/post workspace snapshot delta (not raw git diff) to avoid unrelated dirty-worktree noise.
4. If no effective file delta is detected, record no-op and trigger bounded stop/strategy change.

---

## 10. Validation Executor

## 10.1 Test command selection

For `testScope=targeted`:
1. Resolve commands from `config.mjs.agentToTargetedTestCommands[agent]`.
2. If no targeted commands exist for the agent, fall back to `testScope=full` with affected package commands; if the affected package cannot be resolved, fail precheck.

For `testScope=full`:
- package test command(s) for affected package(s).

## 10.2 Canary command map

Defaults in `config.mjs`:
- `Agent5-ClueExtraction` -> `npm run canary:core`
- `Agent9-Prose` -> `npm run canary:agent9`

The production map must include every supported agent; the list above is illustrative.

Command resolution rules:
1. Use `--canaryCommand` override when provided.
2. Else require `agentToCanaryCommand[agent]` mapping.
3. If mapping is missing, fail precheck (do not fall back to an unrelated agent command).

This prevents false positives/negatives from running a mismatched canary.

## 10.3 Agent 9 chapter-start semantics

1. When `--agent` is Agent 9 and `--startChapter=<n>` is provided, the loop must pass `n` through to Agent 9 retry/prose generation inputs as the chapter restart boundary.
2. The boundary maps to existing Agent 9 prompt contracts (`fromChapter` / `chapterStart`) and must be preserved across retries.
3. Validation/canary for Agent 9 must evaluate chapter outputs from `startChapter..end` and ensure no regressions are introduced before `startChapter`.
4. If chapter count metadata is known and `startChapter > chapterCount`, fail precheck with exit code `2`.
5. If chapter count metadata is unavailable, allow execution but emit a precheck warning and validate bounds on first concrete chapter artifact.

## 10.4 Pass/fail interpretation

1. Command exit code `0` = pass.
2. Non-zero = fail; parse terminal markers into summary.
3. If canary output includes clear `status` field, trust it over generic marker text.

## 10.5 Structured Retry Feedback Packet Contract

Each retry request payload must include:
1. `must_fix[]` with exact unresolved errors.
2. `warnings_to_clear[]` with exact unresolved warnings.
3. `source_bounds[]` for index/path legality when relevant.
4. `forbidden_terms[]` and `required_replacements[]` for lexical overlap classes.
5. `status_contract` requiring `pass` only when all audit arrays are empty.
6. `preserve_unaffected` instruction to avoid introducing regressions.

Packet quality rules:
1. Every listed item must be traceable to a concrete validator finding.
2. Packet must be deterministic and machine-generated, not free-form commentary.
3. Packet must include explicit pass criteria so the next attempt can be evaluated mechanically.

---

## 11. Ledger and Resume

## 11.1 JSONL format

One `IterationRecord` JSON object per line.

## 11.2 Markdown summary format

Per-iteration sections:
1. Input signature
2. Planned/applied actions
3. Changed files
4. Tests and canary result
5. Decision and reason

## 11.3 Resume behavior

1. Load last JSONL entry.
2. Reconstruct unchanged-signature counter.
3. Continue with next iteration number.
4. Validate workspace fingerprint (HEAD commit + dirty hash) against last ledger entry.
5. If fingerprint mismatch, require explicit `--resume --force` behavior (future flag) or stop with reproducibility warning.
6. Re-run artifact classification from current state only after fingerprint gate passes.

---

## 12. Observability and Metrics

## 12.1 Emit metrics per run

- `iterations_total`
- `iterations_to_pass`
- `unchanged_signature_count`
- `new_failure_class_count`
- `files_changed_total`
- `tests_failed_count`

## 12.2 Integrity preflight metrics

- `missing_request_count`
- `missing_response_count`
- `empty_response_body_count`

## 12.3 Concurrency and Reproducibility Metrics

- `lock_wait_ms`
- `resume_fingerprint_mismatch_count`
- `no_op_iteration_count`

---

## 13. Implementation Plan (Concrete)

## Sprint 1

1. Implement CLI parsing, controller skeleton, and precheck gates (invalid agent, invalid option combinations, Agent 9 `startChapter` guardrails).
2. Implement artifact resolver + signature parser v1 + confidence scoring (`MIN_CONFIDENCE`) with all-agent registry loading.
3. Implement `ROOT_CAUSE_ANALYSIS` and `BUILD_RETRY_PACKET` states in suggest-only mode.
4. Implement JSONL/Markdown ledger outputs for suggest runs.

Sprint 1 exit criteria:
1. `--mode suggest` runs end-to-end from `runId` + `agent` and emits signatures, root-cause hypothesis, retry packet, and next-action plan.
2. Low-confidence signatures/hypotheses stop safely with explicit reason.

## Sprint 2

1. Implement patch safety gates and apply-mode scaffolding (allow/deny scope, file cap, lock file, no-op detection).
2. Integrate validation executor with strict command-resolution contract:
- `--canaryCommand` override or mapped agent command only.
- targeted test mapping required; unresolved mapping degrades only where explicitly allowed, else precheck fail.
3. Implement blocking warning/error pass policy in runtime decision logic (`warningBudget=0` in v1).
4. Implement stop-condition state machine (`maxIterations`, unchanged thresholds, new failure class stop, infra failure stop).

Sprint 2 exit criteria:
1. `--mode apply` can complete at least one safe iteration with patch, tests, canary, and ledger.
2. Pass state requires canary pass plus zero unresolved errors and zero unresolved warnings for selected agent.

## Sprint 3

1. Implement prompt-first playbooks first (retry-packet contract hardening, source-bounds/id-traceability, red-herring lexical separation).
2. Add escalation rules to permit code-mode playbooks only after prompt retries fail per policy.
3. Add resume support with workspace fingerprint checks and mismatch stop behavior.
4. Implement Agent 9 `startChapter` propagation to prompt contracts (`fromChapter` / `chapterStart`) and validation-window enforcement.
5. Add regression tests for signature normalization, state transitions, retry packet determinism, and warning-blocking behavior.

Sprint 3 exit criteria:
1. Prompt-first retries measurably reduce/stabilize targeted failure classes without immediate deterministic fallback.
2. Resume and Agent 9 chapter-start flows are reproducible and bounds-safe.

## Sprint 4

1. Implement remaining escalation playbooks (`agent6`, `cml`) with exception logging for deterministic fallback usage.
2. Add signature-to-fix cache and cache-safety checks.
3. Add reporting rollups/summary dashboard and run-level metrics aggregation.
4. Complete all-agent command/test mapping coverage and conformance tests.

Sprint 4 exit criteria:
1. Framework supports every registered worker agent through validated config mapping.
2. Historical replay and canary-loop telemetry demonstrate stable convergence and auditable stop reasons.

---

## 14. Test Strategy

1. Unit tests:
- signature normalization
- taxonomy classification
- playbook selector
- state transitions and stop conditions

2. Integration tests:
- suggest mode from known failed run
- apply mode single iteration with dry fixtures
- resume from ledger
- Agent 9 run with `--startChapter` applies fixes only from requested chapter onward

3. Smoke tests:
- run against historical failures with expected class detection

---

## 15. Risks and Mitigations

1. Risk: false signature mapping leads to wrong playbook.
- Mitigation: confidence score and safe stop on low-confidence in v1.

2. Risk: excessive edit scope in shared files.
- Mitigation: per-iteration file cap, shared-file confirmation gate, and mandatory rollback snapshots for all touched files.

3. Risk: canary command mismatch per agent.
- Mitigation: explicit override option and command map in config.

4. Risk: looping on equivalent failure text variants.
- Mitigation: normalized signature hashing and unchanged counter.

5. Risk: repeated warning persistence without class changes.
- Mitigation: warning-decrease continue rule and bounded unchanged threshold.

6. Risk: invalid Agent 9 chapter start causes silent mis-targeted retries.
- Mitigation: strict precheck bounds validation with chapter metadata and explicit warning/fail behavior.

---

## 16. Definition of Done (LLD Implementation)

1. `suggest` mode produces complete actionable loop report for any valid `runId` + `agent`.
2. `apply` mode can execute at least one full iteration with:
scoped patch, targeted tests, canary re-run, and ledger write.
3. Stop conditions behave exactly per state machine.
4. Historical run replay identifies expected failure class in at least 80% of sampled cases.
5. Warning handling is blocking (no unresolved warnings in pass state for selected agent).
6. Retry packets are structured and validator-traceable; prompt-first retries are attempted before code-mode fixes.
7. Deterministic fallback/sanitizer fixes are logged as exceptions and are not the primary convergence path.
8. Framework supports every registered worker agent via config mapping, including Agent 9.
9. For Agent 9, `--startChapter` is validated, propagated into retry/prose prompts (`fromChapter`/`chapterStart`), and honored by canary validation.
