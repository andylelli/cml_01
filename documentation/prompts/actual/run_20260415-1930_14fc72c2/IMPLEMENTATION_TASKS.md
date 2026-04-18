# Implementation Tasks: Agent 5 Stability + Scoring Harmony

## Goal
Ensure Agent 5 quality and test outcomes move together: high-quality outputs should naturally pass deterministic tests; failures should visibly depress score and block release.

## Phase 1: Prompt Contract Coherence
1. [x] Add requirement-budget resolver in `packages/prompts-llm/src/agent5-clues.ts`.
2. [x] Enforce precedence block: legality -> bounds -> discriminating IDs -> suspect elimination -> overlap -> texture.
3. [x] Emit explicit index bounds block from CML (anchors, contradictions, inference steps).
4. [x] Emit cast name->index map for path correctness.
5. [x] Add retry structured payload (`must_fix[]`, `forbidden_terms[]`, `required_replacements[]`).

Exit criteria:
1. [x] No prompt conflict where required clues exceed allowed total without explicit auto-escalation.
2. [x] Retry prompts always include legal bounds and cast map.

## Phase 2: Runtime Deterministic Enforcement
1. [x] Add name-path consistency validator in `apps/worker/src/jobs/agents/agent5-run.ts`.
2. [x] Include exact invalid-path details in retry feedback.
3. [x] Include overlap trigger terms/phrases per red herring in retry feedback.
4. [x] Add overlap conflict detector for temporal-axis lexical collisions.
5. [x] Ensure deterministic checks remain authoritative over model audit arrays.

Exit criteria:
1. [x] Name-index mismatches become critical deterministic failures.
2. [x] Retry payloads are machine-actionable and specific.

## Phase 3: Scoring Harmony
1. [x] Replace fixed `quality_score: 100` in Agent 5 scoring with computed metric from residual defects.
2. [x] Replace fixed `consistency_score: 100` with metric from path validity + audit consistency + name-path coherence.
3. [x] Add Agent 5 phase hard-fail cap (max total <= 60 when final hard gate fails).
4. [x] Ensure `release_gate_outcome.status` is `failed` when Agent 5 gate throws, with non-zero hard-stop count.
5. [x] Add run-level score presentation rule for failed/aborted outcomes so high score cannot imply release success.

Exit criteria:
1. [x] No aborted Agent 5 hard-fail run presents as high-quality pass signal.
2. [x] Scorecard and gate outcome tell the same story without manual log inspection.

## Phase 4: Artifact Observability
1. [x] Make request/response capture atomic per attempt.
2. [x] Reject attempt completion when request or response artifact is missing.
3. [x] Normalize retry numbering (no synthetic `retryAttempt: 0` completion entries).
4. [x] Add run-level integrity counters (`missing_request_count`, `missing_response_count`, `empty_response_body_count`).

Exit criteria:
1. [x] Zero response-only records in retry chains.
2. [x] Full prompt/response reconstruction possible for every attempt.

## Phase 5: Tests
1. [x] Add prompt contract tests in `packages/prompts-llm/__tests__/agent5.test.ts`.
2. [x] Add runtime deterministic tests in `apps/worker/src/__tests__/agent5-run.test.ts`.
3. [x] Add observability integrity tests for missing artifacts/attempt ordering.
4. [x] Add scoring tests verifying hard-gate failures lower Agent 5 and top-line run signal.

Regression commands:
1. [x] `npm run -w @cml/prompts-llm test -- __tests__/agent5.test.ts`
2. [x] `npm run -w @cml/worker test -- src/__tests__/agent5-run.test.ts`
3. [x] `npm run -w @cml/prompts-llm type-check`
4. [x] `npm run -w @cml/worker build`

## Phase 6: Canary and Metrics
1. [ ] Run 10 temporal-axis canary runs with full telemetry.
2. [ ] Track:
- red-herring overlap hard-fail rate
- invalid source path count post-retry
- missing artifact count
- failed/aborted runs with high score signal
3. [ ] Compare against baseline and decide rollout to all axes.

Canary pass bar:
1. [ ] >= 80% reduction in overlap hard-fails.
2. [ ] zero invalid source paths after final retry.
3. [ ] zero missing request/response artifacts.
4. [ ] zero score/outcome contradiction in top-line reporting.

## Ownership Suggestion
1. Prompt changes: prompts-llm owner.
2. Runtime/gates: worker orchestration owner.
3. Report/score presentation: scoring/reporting owner.
4. Test harness updates: shared between prompts + worker owners.
