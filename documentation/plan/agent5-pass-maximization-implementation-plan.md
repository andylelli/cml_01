# Agent 5 Pass-Maximization Implementation Plan

Date: 2026-05-10
Owner: CML pipeline engineering

Primary references:
- documentation/08_cml_schema/08_cml_schema.md
- schema/cml_2_0.schema.yaml
- documentation/10_prose_generation/10_prose_generation.md
- documentation/11_canary_loop/11_canary_loop.md
- documentation/analysis/ANALYSIS_11/ANALYSIS_11.md
- documentation/prompts/actual/run_20260510-1450_mystery/09_Agent5-ClueExtraction_retry2_request.md
- documentation/prompts/actual/run_20260510-1450_mystery/09_Agent5-ClueExtraction_retry2_response.md

## 1) Goal

Maximize Agent 5 pass reliability after LLM request/response by combining:
1. A smaller, contradiction-free prompt contract that improves first-pass quality.
2. Deterministic post-processing that repairs known failure modes.
3. Deterministic hard gates that reject unresolved critical defects.

This plan explicitly treats prompt-only compliance as insufficient for proof-critical constraints.

## 2) Non-Negotiables

1. CML version remains 2.0.
2. No invented facts outside validated CML and allowed artifacts.
3. Fair-play timing remains strict: essential clues must be reader-visible before deductive use/discriminating test.
4. Deterministic source-path legality and cast-path binding are authoritative over model self-audit.
5. If constraints are unsatisfiable from input CML, fail with typed deterministic diagnostics (no silent degrade).
6. Strict prompt-contract feedback must be active by default for core reliability paths, with explicit telemetry proving activation state per run.

## 3) Reliability Model

## 3.1 What can be guaranteed

For satisfiable inputs, the pipeline should guarantee structural admissibility of Agent 5 outputs before downstream use:
1. Legal source paths.
2. Required clue ID presence and exactness.
3. Cast index-name coupling consistency.
4. Step coverage floors and contradiction coverage floors.
5. Discriminating-test timing and mechanism visibility requirements.

## 3.2 What cannot be guaranteed

1. Prompt-only 100 percent pass is not achievable for all runs because LLM output remains probabilistic.
2. If upstream inputs are contradictory or underspecified, deterministic layer must stop with actionable fail reasons.

## 4) Target Architecture

## 4.1 Layer A: Minimal Prompt Contract (LLM-first quality)

Purpose:
1. Improve first-pass completion quality.
2. Reduce instruction collision and lexical drift.

Rules:
1. Keep one canonical contract block only.
2. Remove duplicate or conflicting rule statements.
3. Keep strict path and ID constraints, but avoid repeated prose restatement.
4. Keep retry payload bounded and delta-focused.

## 4.2 Layer B: Deterministic Normalization (post-LLM repair)

Purpose:
1. Convert common near-miss model output to canonical forms.
2. Preserve intent when repair is safe and unambiguous.

Required normalization classes:
1. Source path canonicalization:
   - dot/underscore variants (for example access.plausibility to access_plausibility).
   - out-of-range index clamping for array leaves where safe.
2. Required clue field completion when inferable:
   - supportsInferenceStep inferred from source path.
   - evidenceType inferred from source path/text fallback.
3. Model audit reconciliation:
   - recompute all audit arrays deterministically and overwrite model-provided audit values.

## 4.3 Layer C: Deterministic Contract Enforcement (hard gate)

Purpose:
1. Enforce proof-critical invariants before downstream stages.

Gate order:
1. source-path legality and repair attempt
2. step-index bounds and repair attempt
3. cast-path binding consistency and repair attempt
4. discriminating evidence ID coverage and deterministic synthesis where allowed
5. strict step coverage floors with deterministic backstop synthesis
6. mechanism visibility/discriminating timing gates
7. meta-audit text prohibition
8. final fail if any critical issue remains

## 4.4 Layer D: Downstream Parity Re-Enforcement

Purpose:
1. Ensure any Agent 6 clue regeneration re-runs the same Agent 5 deterministic contract layer before accepting regenerated clues.

## 5) Implementation Workstreams

## WS0 - Runtime Contract Activation and Observability

Primary files:
1. apps/worker/src/jobs/agents/agent5-run.ts — key function: `strictPromptContractsEnabled()` (line 134)
2. apps/worker/src/jobs/agents/agent6-run.ts
3. scripts/canary-core.mjs
4. documentation/11_canary_loop/11_canary_loop.md

Tasks:
1. Change `strictPromptContractsEnabled()` so strict feedback is active by default for core reliability paths.
   - Current behaviour: reads `AGENT5_STRICT_PROMPT_CONTRACTS` env var; defaults to false when unset.
   - Required change: make the function return `true` unconditionally (or default to `true` unless an explicit opt-out flag is set). Do not require operators to set an env var to get baseline protection.
2. Emit per-run telemetry fields for strict-contract activation state (boolean) and deterministic repair counts by repair class (source-path, step-index, cast-path, synthesis).
3. Ensure canary and core summaries include activation state and gate-failure class counts in both JSON and markdown rollup sections.
4. Add regression tests or fixture assertions proving activation state is observable and stable.

Exit criteria:
1. Every validation run can answer whether strict prompt feedback was active and how many deterministic repairs were applied.

## WS1 - Prompt Simplification and De-Conflict

Primary files:
1. packages/prompts-llm/src/agent5-clues.ts
2. packages/prompts-llm/src/__tests__/agent5-clues.test.ts

Tasks:
1. Consolidate repeated rule blocks into one canonical contract section.
2. Remove contradictory wording pairs (example: mandatory digit timestamp text versus no-digit style mandate).
3. Keep bounded retry payload, but trim non-essential narrative around it.
4. Add snapshot tests for prompt size ceiling and required marker presence.
   - Target ceiling: first-pass prompt 4500 tokens max; retry payload 2000 tokens max.
   - Baseline to beat: retry2 prompt in run_20260510-1450_mystery was ~5454 tokens.

Exit criteria:
1. Prompt remains contract-complete with reduced token footprint (first-pass under 4500 tokens).
2. No known direct rule contradiction remains in first-pass contract text.

## WS2 - Deterministic Canonicalization Coverage Expansion

Primary files:
1. apps/worker/src/jobs/agents/agent5-run.ts — key function: `repairInvalidSourcePaths()` (line 876)
2. apps/worker/src/__tests__/agent5-run.test.ts

Tasks:
1. Extend `repairInvalidSourcePaths()` with a canonicalization map for known source-path near-miss patterns.
   - Specifically: dot/underscore substitution (e.g. `CASE.cast[1].access.plausibility` → `CASE.cast[1].access_plausibility`) — this is the confirmed failure mode from run_20260510-1450_mystery, clue_5.
   - See §4.2 for the full required normalization class list.
2. Ensure canonicalization runs before the legality gate (before ALLOWED_SOURCE_PATTERNS check).
3. Expand tests for malformed but unambiguous variants, including the access.plausibility near-miss.
4. Keep repair logs explicit (old path to new path) for telemetry.

Exit criteria:
1. Known near-miss paths are deterministically repaired and no longer trip avoidable hard failures.

## WS3 - Deterministic Synthesis and Strict Gate Closure

Primary files:
1. apps/worker/src/jobs/agents/agent5-run.ts — key functions: `synthesizeMissingCulpritDiscriminatingClues()` (line 1324), `enforceAgent5DeterministicContracts()` (line 2201)
2. apps/worker/src/__tests__/agent5-run.test.ts

Tasks:
1. Validate strict contract checks run after all deterministic synthesis/repairs.
2. Audit `synthesizeMissingCulpritDiscriminatingClues()` to ensure synthesized source paths are drawn only from ALLOWED_SOURCE_PATTERNS (line 104). Any synthesized clue that would produce an illegal source family must be rejected or rewritten before reaching the legality gate.
3. Ensure strict-step backstop synthesis is bounded and idempotent.
4. Ensure all fail messages are typed and actionable.

Exit criteria:
1. For satisfiable fixtures, deterministic enforcement reaches pass without manual intervention.
2. For unsatisfiable fixtures, deterministic enforcement fails with exact unresolved blockers.

## WS4 - Agent 6 Regeneration Parity

Primary files:
1. apps/worker/src/jobs/agents/agent6-run.ts
2. apps/worker/src/__tests__/agent6-run.test.ts
3. apps/worker/src/__tests__/agent6-run-flow.test.ts

Tasks:
1. Keep Agent 5 deterministic contract re-application mandatory after Agent 6 clue modifications.
2. Ensure parity bridge/backstop injections also flow through the same deterministic gate stack.
3. Ensure warning and error telemetry remains traceable to context label.

Exit criteria:
1. No regenerated clue set bypasses Agent 5 deterministic contracts.

## WS5 - Harness, Canary, and Reporting Alignment

Primary files:
1. apps/worker/src/harness/agent5-direct-llm-check-harness.ts
2. scripts/canary-core.mjs
3. documentation/11_canary_loop/11_canary_loop.md
4. documentation/analysis (new run analyses as needed)

Tasks:
1. Keep full prompt and response logging enabled for core validation runs.
2. Add replay fixtures for recent failure signatures.
3. Verify JSON and markdown report parity for gate outcomes and failure classes.

Exit criteria:
1. Every validation run preserves reproducible prompt artifacts and deterministic gate diagnostics.

## 6) Acceptance Criteria

## 6.1 Functional acceptance

1. Satisfiable replay set: zero unresolved critical deterministic contract failures after post-LLM repair.
2. Unsatisfiable replay set: deterministic hard fail with typed unresolved defect list.
3. No model audit mismatch reaches final accepted output (audit is reconciled deterministically).

## 6.2 Quality acceptance

1. First-pass LLM failure rate decreases versus current baseline on same corpus.
2. Total retry count per run decreases versus baseline.
3. Agent 5 failure class distribution shifts away from avoidable source-path and ID-contract failures.

## 6.3 Safety acceptance

1. No new fact invention introduced by deterministic synthesis.
2. Fair-play ordering constraints remain intact.
3. Cast/path parity violations are never silently tolerated.

## 6.4 Operational acceptance

1. Run telemetry records strict prompt-contract activation state.
2. Run telemetry records deterministic repair counts by repair class.
3. Core and canary report rollups remain JSON/markdown parity-aligned for gate outcomes and failure-class counts.

## 7) Test Strategy

## 7.1 Targeted tests

1. npm run -w @cml/prompts-llm test -- src/__tests__/agent5-clues.test.ts
2. npm run -w @cml/worker test -- src/__tests__/agent5-run.test.ts
3. npm run -w @cml/worker test -- src/__tests__/agent6-run.test.ts src/__tests__/agent6-run-flow.test.ts

## 7.2 Build and dependency order

1. If generation params are changed, rebuild story-validation before prompts tests:
   - npm run -w @cml/story-validation build
   - npm run -w @cml/prompts-llm build
2. Rebuild worker before boundary/canary validation:
   - npm run -w @cml/worker build

## 7.3 Runtime validation

1. Full core validation:
   - npm run canary:core
2. Optional direct harness validation for Agent 5:
   - npm run -w @cml/worker harness:agent5:direct -- --cml <path>
3. Boundary validation for Agent 5 and Agent 6 contract parity:
   - node scripts/canary-agent-boundary.mjs --runId latest --agent 5
   - node scripts/canary-agent-boundary.mjs --runId latest --agent 6

## 7.4 Metrics protocol

Baseline and compare window:
1. Use the same replay corpus and same command set before and after each phase.
2. Track at least 10 runs for trend-level signal.

Primary metrics:
1. First-pass structural pass rate = first-pass valid outputs / total runs.
2. Deterministic closure rate = runs resolved by deterministic repair / total runs.
3. Hard-fail residual rate = unresolved critical deterministic gate failures / total runs.
4. Retry depth median and p95.

Decision thresholds:
1. No phase promotion if hard-fail residual rate worsens.
2. No phase promotion if first-pass structural pass rate regresses without compensating deterministic closure gains.
3. Promote only when safety acceptance and operational acceptance remain green.

## 8) Rollout Plan

1. Phase 0: establish baseline metrics on current main. (pre-WS)
2. Phase 1: ship WS0 — runtime activation and telemetry observability.
3. Phase 2: ship WS1 — prompt de-conflict and token reduction with tests.
4. Phase 3: ship WS2 — canonicalization expansion and deterministic repair tests.
5. Phase 4: ship WS3 — strict gate/synthesis closure hardening.
6. Phase 5: ship WS4 — Agent 6 regeneration parity checks and validate full canary core.
7. Phase 6: ship WS5 + finalize documentation parity and lock runbook updates.

Rollback strategy:
1. Keep changes behind narrow feature guards only when required for safe rollout.
2. If regressions appear, roll back the last phase only, preserve artifacts, and re-run baseline suite.

## 9) Risks and Mitigations

1. Risk: Over-repair changes clue semantics.
   - Mitigation: allow only deterministic repairs with unambiguous mapping; otherwise fail.
2. Risk: Prompt shrink removes required constraints.
   - Mitigation: snapshot tests for mandatory contract markers and schema keys.
3. Risk: Hidden unsatisfiable inputs mimic model failure.
   - Mitigation: explicit unsatisfiable classification and typed fail output.
4. Risk: Drift between runtime behavior and canary docs.
   - Mitigation: doc parity updates in same change set for behavior changes.

## 10) Definition of Done

1. All targeted tests pass.
2. Full canary core run validates prompt logging and deterministic gate behavior.
3. Replay corpus demonstrates improved first-pass quality and deterministic closure for satisfiable cases.
4. Telemetry and report rollups expose strict-contract activation state and deterministic repair counts.
5. Documentation under documentation/plan and documentation/11_canary_loop is aligned with runtime behavior.
