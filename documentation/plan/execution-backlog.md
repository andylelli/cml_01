# Problem-Agent Overhaul Execution Backlog

Date: 2026-05-06
Companion to: documentation/plan/problem-agent-overhaul-master-plan.md
Program owner: CML pipeline engineering

## 1) Purpose

This backlog operationalizes the overhaul plan into incrementally shippable slices.
Each slice is blocked from promotion unless fast gate and slow gate both pass.

## 2) Global Rules

1. Execute slices in order unless an explicit dependency waiver is documented.
2. No slice may merge without required artifact bundle:
   - before/after scorecard,
   - fast gate command outputs,
   - slow gate command outputs,
   - go or no-go decision.
3. Any critical regression triggers rollback of the current slice flag.
4. Use real execution paths for canary validation; suggest-only planning runs are not valid verification evidence.

## 3) Preconditions

Run from workspace root:

```bash
npm ci
npm run -w @cml/story-validation build
npm run -w @cml/worker build
```

Known test-order requirement:
1. If editing packages/story-validation/src/generation-params.ts, rebuild @cml/story-validation before running @cml/prompts-llm tests.

## 4) Gate Command Catalog

Use these canonical commands in slice checklists.

Static and build:

```bash
npm run -w @cml/story-validation build
npm run -w @cml/prompts-llm build
npm run -w @cml/worker build
```

Unit and integration (targeted examples):

```bash
npm run -w @cml/prompts-llm test -- src/__tests__/agent5-clues.test.ts
npm run -w @cml/worker test -- src/__tests__/agent5-run.test.ts
npm run -w @cml/worker test -- src/__tests__/agent6-run.test.ts src/__tests__/agent6-run-flow.test.ts
npm run -w @cml/worker test -- src/__tests__/mystery-orchestrator-fixes.test.ts src/__tests__/jobs.test.ts
npm run -w @cml/worker test -- src/__tests__/agent9-locked-facts.test.ts
npm run -w @cml/story-validation test -- src/__tests__/report-invariants.test.ts src/__tests__/report-invariants.replay.test.ts
npm run test:canary-loop
```

Boundary canary (real runtime path):

```bash
node scripts/canary-agent-boundary.mjs --runId latest --agent 3
node scripts/canary-agent-boundary.mjs --runId latest --agent 4
node scripts/canary-agent-boundary.mjs --runId latest --agent 5
node scripts/canary-agent-boundary.mjs --runId latest --agent 6
node scripts/canary-agent-boundary.mjs --runId latest --agent 7
```

Replay against known failure class run:

```bash
node scripts/canary-agent-boundary.mjs --runId mystery-1777806442972 --agent 5
node scripts/canary-agent-boundary.mjs --runId mystery-1777806442972 --agent 6
```

Slow gate full-core run:

```bash
npm run canary:core
```

## 5) Incremental Slice Backlog

## S0 - Baseline and instrumentation freeze

Owner: Pipeline lead
Estimate: 0.5 to 1 day
Dependencies: none

Primary file targets:
1. documentation/plan/problem-agent-overhaul-master-plan.md
2. documentation/analysis/ANALYSIS_06/ANALYSIS_06.md
3. documentation/11_canary_loop/11_canary_loop.md

Fast gate:
1. npm run -w @cml/worker test
2. npm run test:canary-loop

Slow gate:
1. npm run canary:core

Required outputs:
1. Baseline scorecard snapshot for protocol metrics.
2. Baseline runId and report paths logged in rollout tracker.

## S1 - WS1.1 prompt baseline freeze

Owner: Prompt contracts engineer
Estimate: 1 day
Dependencies: S0

Primary file targets:
1. packages/prompts-llm/src/agent5-clues.ts
2. packages/prompts-llm/src/__tests__/agent5-clues.test.ts

Fast gate:
1. npm run -w @cml/story-validation build
2. npm run -w @cml/prompts-llm test -- src/__tests__/agent5-clues.test.ts

Slow gate:
1. npm run canary:core

Remove mapping:
1. Remove item 1 validation starts here.

## S2 - WS1.2 strict run-contract object

Owner: Agent 5 runtime engineer
Estimate: 2 to 3 days
Dependencies: S1

Primary file targets:
1. apps/worker/src/jobs/agents/agent5-run.ts
2. apps/worker/src/jobs/mystery-orchestrator.ts
3. packages/story-validation/src/generation-params.ts
4. packages/story-validation/src/__tests__ (contract-related tests)

Fast gate:
1. npm run -w @cml/story-validation build
2. npm run -w @cml/worker build
3. npm run -w @cml/worker test -- src/__tests__/agent5-run.test.ts
4. node scripts/canary-agent-boundary.mjs --runId latest --agent 5

Slow gate:
1. npm run canary:core

## S3 - WS1.3 and WS1.4 deterministic hard gate plus bounded delta retry

Owner: Agent 5 runtime engineer
Estimate: 2 days
Dependencies: S2

Primary file targets:
1. apps/worker/src/jobs/agents/agent5-run.ts
2. apps/worker/src/jobs/agents/agent6-run.ts
3. apps/worker/src/__tests__/agent5-run.test.ts
4. apps/worker/src/__tests__/agent6-run-flow.test.ts

Fast gate:
1. npm run -w @cml/worker test -- src/__tests__/agent5-run.test.ts src/__tests__/agent6-run-flow.test.ts
2. node scripts/canary-agent-boundary.mjs --runId latest --agent 5
3. node scripts/canary-agent-boundary.mjs --runId mystery-1777806442972 --agent 5

Slow gate:
1. npm run canary:core

Remove mapping:
1. Remove item 3 validation starts here.

## S4 - WS2.1 and WS2.2 Agent 6 adjudicator and typed routing

Owner: Fair-play adjudication engineer
Estimate: 2 days
Dependencies: S3

Primary file targets:
1. apps/worker/src/jobs/agents/agent6-run.ts
2. apps/worker/src/__tests__/agent6-run.test.ts
3. apps/worker/src/__tests__/agent6-run-flow.test.ts
4. apps/worker/src/jobs/mystery-orchestrator.ts

Fast gate:
1. npm run -w @cml/worker test -- src/__tests__/agent6-run.test.ts src/__tests__/agent6-run-flow.test.ts
2. node scripts/canary-agent-boundary.mjs --runId latest --agent 6
3. node scripts/canary-agent-boundary.mjs --runId mystery-1777806442972 --agent 6

Slow gate:
1. npm run canary:core

Remove mapping:
1. Remove item 2 validated here.
2. Remove item 4 partial validation starts here.

## S5 - WS3.1 and WS3.2 upstream evidence completeness and revision closure

Owner: Upstream planning engineer
Estimate: 3 days
Dependencies: S4

Primary file targets:
1. apps/worker/src/jobs/agents/agent3-run.ts
2. packages/prompts-llm/src/agent4-revision.ts
3. packages/prompts-llm/src/__tests__/agent4-revision.test.ts
4. apps/worker/src/jobs/mystery-orchestrator.ts
5. apps/worker/src/__tests__/cml-viability.test.ts
6. apps/worker/src/__tests__/mystery-orchestrator-fixes.test.ts

Fast gate:
1. npm run -w @cml/prompts-llm test -- src/__tests__/agent4-revision.test.ts
2. npm run -w @cml/worker test -- src/__tests__/cml-viability.test.ts src/__tests__/mystery-orchestrator-fixes.test.ts
3. node scripts/canary-agent-boundary.mjs --runId latest --agent 3
4. node scripts/canary-agent-boundary.mjs --runId latest --agent 4

Slow gate:
1. npm run canary:core

## S6 - WS6.1 and WS6.2 canonical gate machine and typed failure taxonomy

Owner: Orchestrator engineer
Estimate: 2 to 3 days
Dependencies: S5

Primary file targets:
1. apps/worker/src/jobs/mystery-orchestrator.ts
2. apps/worker/src/__tests__/jobs.test.ts
3. apps/worker/src/__tests__/mystery-orchestrator-fixes.test.ts
4. scripts/canary-loop/config.mjs
5. scripts/canary-loop/controller.mjs

Fast gate:
1. npm run -w @cml/worker test -- src/__tests__/jobs.test.ts src/__tests__/mystery-orchestrator-fixes.test.ts
2. npm run test:canary-loop

Slow gate:
1. npm run canary:core

## S7 - WS7.2 boundary canary realism for Agent 9

Owner: Canary framework engineer
Estimate: 2 days
Dependencies: S6

Primary file targets:
1. scripts/canary-agent9.mjs
2. scripts/canary-loop/config.mjs
3. scripts/canary-loop/__tests__/sprint3-regressions.test.mjs
4. documentation/11_canary_loop/11_canary_loop.md

Fast gate:
1. npm run test:canary-loop
2. npm run canary:agent9 -- --runId latest --startChapter 1 --quickRun true

Slow gate:
1. npm run canary:core

Remove mapping:
1. Remove item 5 must be fully validated before S8 starts.

## S8 - WS4.1 and WS4.2 Agent 9 obligation ledger and localized retry

Owner: Prose runtime engineer
Estimate: 3 to 4 days
Dependencies: S7 (hard dependency)

Primary file targets:
1. apps/worker/src/jobs/agents/agent9-run.ts
2. packages/prompts-llm/src/agent9-prose.ts
3. apps/worker/src/__tests__/agent9-locked-facts.test.ts
4. apps/worker/src/jobs/mystery-orchestrator.ts

Fast gate:
1. npm run -w @cml/worker test -- src/__tests__/agent9-locked-facts.test.ts
2. npm run canary:agent9 -- --runId mystery-1777806442972 --startChapter 1 --quickRun true

Slow gate:
1. npm run canary:core

## S9 - WS4.3 pre-prose admission gate hard-stop

Owner: Orchestrator engineer
Estimate: 1 to 2 days
Dependencies: S8

Primary file targets:
1. apps/worker/src/jobs/mystery-orchestrator.ts
2. apps/worker/src/__tests__/mystery-orchestrator-fixes.test.ts

Fast gate:
1. npm run -w @cml/worker test -- src/__tests__/mystery-orchestrator-fixes.test.ts
2. npm run canary:agent6 -- --runId latest --quickRun true
3. npm run canary:agent9 -- --runId latest --startChapter 1 --quickRun true

Slow gate:
1. npm run canary:core

Remove mapping:
1. Remove item 4 final validation completes here.

## S10 - WS5.1 and WS5.2 upstream novelty prevention and remediation packet

Owner: Novelty controls engineer
Estimate: 2 to 3 days
Dependencies: S9

Primary file targets:
1. apps/worker/src/jobs/agents/agent3-run.ts
2. packages/prompts-llm/src/agent8-novelty.ts
3. apps/worker/src/jobs/mystery-orchestrator.ts
4. apps/worker/src/__tests__/jobs.test.ts
5. documentation/10_prose_generation/10_prose_generation.md

Fast gate:
1. npm run -w @cml/worker test -- src/__tests__/jobs.test.ts
2. npm run canary:core

Slow gate:
1. npm run canary:core
2. npm run -w @cml/story-validation test -- src/__tests__/report-invariants.test.ts src/__tests__/report-invariants.replay.test.ts

## S11 - WS7.1 report parity and evidence linking

Owner: Telemetry and reporting engineer
Estimate: 2 days
Dependencies: S10

Primary file targets:
1. packages/story-validation/src/scoring/report-invariants.ts
2. packages/story-validation/src/report-repository.ts
3. packages/story-validation/src/__tests__/report-invariants.test.ts
4. packages/story-validation/src/__tests__/report-invariants.replay.test.ts
5. documentation/11_canary_loop/11_canary_loop.md

Fast gate:
1. npm run -w @cml/story-validation build
2. npm run -w @cml/story-validation test -- src/__tests__/report-invariants.test.ts src/__tests__/report-invariants.replay.test.ts

Slow gate:
1. npm run canary:core

## 6) Slice Scorecard Template (Required Per Slice)

Record this table for every slice:

| Metric | Baseline | After Slice | Delta | Pass/Fail |
|---|---:|---:|---:|---|
| Agent 9 abort count |  |  |  |  |
| Critical fair-play unresolved at prose admission |  |  |  |  |
| Runtime evidence_clue backfill count |  |  |  |  |
| Critical novelty violation count |  |  |  |  |
| Retry exhaustion count |  |  |  |  |
| Agent 5 repair churn count |  |  |  |  |

## 7) Promotion and Rollback Checklist

Promotion gate:
1. All fast gate commands green.
2. Slow gate full core run green.
3. No new critical regressions in scorecard.
4. Remove-item checks satisfied when slice maps to remove list.

Rollback trigger:
1. Any new critical fair-play unresolved at prose admission.
2. Any report invariant violation.
3. Agent 9 abort increase for non-targeted reasons.

Rollback action:
1. Disable current slice flag.
2. Preserve logs and report artifacts.
3. Open corrective mini-slice before continuing sequence.