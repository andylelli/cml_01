# ANALYSIS_03 v6 Prompt To Code Implementation Plan

Date: 2026-04-24  
Scope: Convert the validated v6 replay prompt behavior into production code paths used by full runs.

## 1) Why This Is Needed

The v6 behavior currently lives in analysis prompt files and harness replay input.

Production full runs do not read those files directly.
They use:
- packages/prompts-llm/src/agent5-clues.ts
  - buildCluePrompt(...)
  - extractClues(...)
- apps/worker/src/jobs/agents/agent5-run.ts
  - extractClues invocation and deterministic contract/coverage pipeline

So the v6 improvements must be encoded in code-level prompt construction and deterministic inputs.

## 2) Target Outcome

A normal full pipeline run (not harness replay) should produce the same quality envelope as v6:
1. deterministicContracts.passed=true
2. guardrails.hasCriticalIssues=false
3. coverageSnapshot.criticalIssues=[]
4. coverageSnapshot.allIssues=[]
5. pass=true
6. no warning-level residue from missing late clue or synthesized culprit direct evidence

## 3) Gap Analysis: v6 Rules vs Current Code

### Gap A: Run-specific source whitelist and ID->path mapping
v6 behavior:
- strict legal source shortlist
- required ID->sourceInCML mappings

Current code:
- buildCluePrompt emits broad allowed roots and valid_source_paths list
- no strict per-run shortlist object is enforced by builder input contract

Required code change:
- Add optional strictSourcePolicy payload to ClueExtractionInputs and render it into developer prompt.

### Gap B: Explicit direct culprit evidence floor
v6 behavior:
- required clue_culprit_direct_auberon emitted by model

Current code:
- if missing, runtime may synthesize direct culprit clue in deterministic pass

Required code change:
- Promote direct culprit evidence requirement into buildCluePrompt generated requirements so model emits it first-pass.
- Keep synthesis as safety net, but target zero synthesis warnings.

### Gap C: Explicit late optional clue floor
v6 behavior:
- required late clue id and placement

Current code:
- quality controls mention late minimum, but no hard named slot for late clue in prompt.

Required code change:
- Add one explicit optional late slot requirement to prompt builder whenever late_clues_min > 0.

### Gap D: Structured hard contracts from fairPlayFeedback
v6 behavior:
- explicit floors in prompt text

Current code:
- fairPlayFeedback already supports requiredCluePhrases, castPathBindingRules, forbiddenTerms, preferredTerms, requiredReplacements, redHerringIdsToRewrite
- but no typed field for strict source shortlist/mappings/floors

Required code change:
- Extend fairPlayFeedback payload with typed fields for:
  - strictSourcePaths
  - requiredIdToSourceMappings
  - requiredStepCoverageFloors
  - requiredLateClueSlot
  - requiredDirectCulpritClue

## 4) Implementation Plan

## Phase 1: Extend Prompt Input Contracts

Files:
- packages/prompts-llm/src/agent5-clues.ts

Changes:
1. Extend ClueExtractionInputs.fairPlayFeedback with new optional fields:
- strictSourcePaths?: string[]
- requiredIdToSourceMappings?: Array<{ id: string; sourceInCML: string }>
- requiredStepCoverageFloors?: Array<{ step: number; requireContradiction: boolean; requireMapped: boolean }>
- requiredLateClueSlot?: { id: string; placement: "late"; criticality: "optional" | "supporting" }
- requiredDirectCulpritClue?: { id: string; culpritName: string; allowedSourcePaths: string[]; requiredPhrases: string[] }

2. Render these contracts into developer prompt in a deterministic section after valid_source_paths.

Acceptance:
- Prompt text includes all provided strict constraints verbatim.

## Phase 2: Auto-generate Core v6 Constraints in Builder

Files:
- packages/prompts-llm/src/agent5-clues.ts

Changes:
1. In buildCluePrompt, when case data supports it, generate defaults for:
- direct culprit evidence requirement
- late optional clue slot (if late_clues_min > 0)
- step contradiction floors

2. Add fixed, explicit examples for legal source path formatting and invalid examples.

Acceptance:
- Without any external prompt file, generated production prompt includes v6-equivalent constraints.

## Phase 3: Feed Strict Contracts From Worker

Files:
- apps/worker/src/jobs/agents/agent5-run.ts

Changes:
1. Construct and pass fairPlayFeedback strict fields to extractClues(...) on first attempt and retry.
2. On retry, tighten strictSourcePaths and requiredIdToSourceMappings using observed invalid-path and missing-ID diagnostics.

Acceptance:
- Runtime extractClues call receives strict contract payload for production runs.

## Phase 4: Reduce Warning-Producing Fallbacks

Files:
- apps/worker/src/jobs/agents/agent5-run.ts

Changes:
1. Keep deterministic synthesis fallback in place.
2. Add telemetry counters for:
- culprit synthesis invoked count
- late clue auto-fix count
3. Set soft objective threshold: zero fallback invocations in canary/full run for stable scenarios.

Acceptance:
- Full run produces no deterministic warnings in target scenario.

## Phase 5: Testing And Validation

Files:
- packages/prompts-llm/src/__tests__/... (new tests)
- apps/worker/src/jobs/agents/__tests__/... (new tests)

Tests:
1. Prompt builder unit tests:
- strict source policy section rendered
- required ID->path section rendered
- late slot and direct culprit sections rendered

2. Agent5 integration tests:
- invalid path rates decrease to zero under strict contract payload
- no missing contradiction floor per step
- no synthesized culprit direct evidence for known scenario

3. End-to-end validation:
- harness replay with generated prompt mode (not --promptFile)
- full run or canary boundary run confirming pass + no warnings

## 6) Rollout Strategy

1. Implement behind a feature flag:
- AGENT5_STRICT_PROMPT_CONTRACTS=true

2. Stage rollout:
- Suggest mode/canary first
- then production full run

3. Monitor:
- source-path failure rate
- culprit synthesis fallback rate
- late-clue warning rate

## 7) Deliverables

1. Code changes in:
- packages/prompts-llm/src/agent5-clues.ts
- apps/worker/src/jobs/agents/agent5-run.ts

2. Tests for new prompt contract behavior and runtime propagation.

3. Documentation update:
- note that v6 contracts are now native in generated production prompts, not analysis-only replay files.

## 8) Definition Of Done

Done when a full run using generated production prompts (no promptFile replay) shows:
1. deterministicContracts.passed=true
2. guardrails.issues is empty or warning-free for target scenario
3. deterministicContracts.warnings=[]
4. coverageSnapshot.allIssues=[]
5. pass=true

## 9) Validation - Two Passes

Validation Date: 2026-04-24

### Pass 1 (Plan Quality / Internal Consistency)

Status: PASS with minor corrections.

Checks performed:
1. Scope-to-outcome consistency:
- The plan correctly targets production code paths (prompt builder + worker invocation), not replay-only markdown files.
2. Stage sequencing:
- Contract extension -> prompt rendering -> worker propagation -> validation is correctly ordered.
3. Safety semantics:
- Deterministic synthesis is retained as fallback, which preserves existing safety behavior while reducing warning frequency.

Minor corrections identified in Pass 1:
1. The plan must explicitly require that strict contracts are rendered even when violations/warnings are empty; currently retry payload rendering in prompt code is gated by existing feedback arrays.
2. The worker test location should match existing structure under apps/worker/src/__tests__, not jobs/agents/__tests__.

### Pass 2 (Codebase Feasibility / Symbol-Level Validation)

Status: PASS with targeted implementation constraints.

Verified against current code:
1. Prompt input type is present and extensible:
- ClueExtractionInputs and fairPlayFeedback exist in packages/prompts-llm/src/agent5-clues.ts.
2. Prompt builder integration point is present:
- buildCluePrompt(...) contains the existing correction payload section where strict contract rendering can be added.
3. Worker propagation points are present:
- runAgent5 constructs cluesInputBase and invokes extractClues(...), including retry calls where strict feedback can be passed.
4. Deterministic fallback/warning points are present:
- culprit-evidence and evidence-id synthesis warnings are already emitted and can be telemetry-counted.
5. Test scaffolding exists:
- prompts tests already include agent5-clues test file.
- worker tests already include agent5-run test file under apps/worker/src/__tests__.

Feasibility constraints identified in Pass 2:
1. There is no existing AGENT5_STRICT_PROMPT_CONTRACTS flag in runtime code yet; rollout requires adding actual env/config wiring, not only documenting the flag name.
2. Strict source/path contracts must be additive and backward-compatible when absent, to avoid regressions on cases without complete mapping data.
3. For first-attempt enforcement, strict contract fields should not depend on retry-mode gating logic.

### Plan Adjustments Applied From Validation

1. Testing section path correction:
- worker tests target apps/worker/src/__tests__/agent5-run.test.ts (or adjacent files in that folder).
2. Rendering contract hardening:
- strict contract block must be rendered in the prompt whenever strict fields are provided, independent of violations/warnings presence.
3. Feature flag realism:
- implementation checklist includes adding concrete config/env read path for AGENT5_STRICT_PROMPT_CONTRACTS before canary rollout.

## 10) v6 Template Parity Alignment Plan (Superseding Execution Plan)

Objective:
- Make the production-generated Agent5 prompt template text match the v6 passed template pattern.
- Scope is template text only (static instruction blocks), not run-specific placeholder values.

Success criteria:
1. Generated template contains all v6 hardening clauses and ordering language.
2. Generated template does not contain strict first-attempt payload blocks that were not in v6.
3. Prompt snapshot diff versus v6 reference is zero after placeholder normalization.
4. Full production path run passes without structural empty-output abort.

### Phase A: Freeze Canonical v6 Template Baseline

Files:
- documentation/analysis/ANALYSIS_03_fair_play_structural_abort_run_a2a462c9/ANALYSIS_03_perfect_llm_prompt_for_pass_populated_last_run_v6.md
- packages/prompts-llm/src/__tests__/agent5-clues.test.ts

Actions:
1. Extract canonical static clauses from v6 (system/developer/user blocks) into a parity checklist used by tests.
2. Add normalization rules for test comparison:
- ignore CML JSON content
- ignore cast names and IDs
- ignore numeric ranges/content values
- compare section headers and contract sentence text exactly

Acceptance:
- A failing test clearly reports missing/extra template clauses versus v6 baseline.

### Phase B: Remove Non-v6 Strict Payload Injection From Default Template Path

Files:
- packages/prompts-llm/src/agent5-clues.ts
- apps/worker/src/jobs/agents/agent5-run.ts

Actions:
1. In prompt builder, remove default emission of:
- "Strict First-Attempt Contract Payload (apply exactly)"
- "required_id_to_source_mapping[]" strict block
- "Strict first-attempt contract payload:" user block
2. In worker, stop auto-populating strict prompt payload into normal extractClues() calls.
3. Keep strict payload support only behind explicit opt-in mode for targeted experiments, not production default.

Acceptance:
- Default generated prompt no longer includes strict first-attempt payload sections.

### Phase C: Re-introduce v6 Hardening Clauses Verbatim

Files:
- packages/prompts-llm/src/agent5-clues.ts

Actions:
1. Ensure v6 hardening section appears with equivalent wording and placement:
- REQUIRED FIELDS CONTRACT
- FIELD CONSISTENCY CONTRACT
- PER-STEP COVERAGE CONTRACT
- SOURCE LEGALITY CONTRACT
2. Ensure retry contract wording remains v6-aligned (semantic correction focus, no contradictory strict mapping demands).
3. Preserve existing fair-play constraints that are compatible with v6 ordering.

Acceptance:
- Snapshot comparison passes for all required v6 section headers and clause strings.

### Phase D: Eliminate Template-Contract Contradictions

Files:
- apps/worker/src/jobs/agents/agent5-run.ts

Actions:
1. Prevent generating duplicate required ID-to-source mappings for the same clue id across multiple source paths.
2. If strict mode is explicitly enabled, enforce one id -> one source mapping invariant at payload construction time.
3. Add guardrail in code that refuses to emit contradictory mapping payloads.

Acceptance:
- Unit tests prove no duplicate id->different-source strict mappings can be produced.

### Phase E: Test and Runtime Verification

Files:
- packages/prompts-llm/src/__tests__/agent5-clues.test.ts
- apps/worker/src/__tests__/agent5-run.test.ts

Tests:
1. Template parity snapshot test:
- compare generated prompt sections to v6 canonical checklist.
2. Negative test:
- fail if strict first-attempt payload section appears in default mode.
3. Strict-mode test:
- strict payload appears only when explicitly enabled and contains no contradictory mappings.
4. Runtime canary/full-run verification:
- Agent5 produces non-empty clue candidates and avoids deterministic structural abort path.

## 13) Implementation Status (Executed)

Date: 2026-04-25

Implemented in code:
1. Default template path no longer renders strict first-attempt payload blocks in generated prompt text.
2. v6-aligned V2 hardening clauses are rendered in developer and user instruction blocks.
3. Worker strict prompt payload injection is now opt-in only behind env flag:
- AGENT5_STRICT_PROMPT_CONTRACTS=true
4. Strict mapping builder now enforces one clue id -> one sourceInCML mapping (first legal mapping wins), preventing contradictory strict payloads.

Validation executed:
1. npm run -w @cml/prompts-llm test -- src/__tests__/agent5-clues.test.ts
2. npm run -w @cml/worker test -- src/__tests__/agent5-run.test.ts

Result:
- Both targeted test suites passed after alignment and second-pass wording correction.

Acceptance:
- Test suite green for prompt parity and contradiction prevention.
- Production path run validates parity behavior.

### Phase F: Rollout and Safeguards

Actions:
1. Ship default as v6-parity mode.
2. Keep strict experimental mode disabled by default.
3. Add telemetry counters:
- template_parity_mode_enabled
- strict_payload_enabled
- contradictory_mapping_payload_prevented
4. Monitor first 5-10 runs for regressions in clue count, pass/fail rates, and empty-output incidents.

Acceptance:
- No regression in successful clue extraction.
- No early structural aborts caused by template contract conflicts.

## 11) Implementation Order (Concrete)

1. Add parity snapshot tests first (red).
2. Remove default strict payload injection in prompt builder and worker (green).
3. Restore/align v6 hardening wording (green).
4. Add contradiction-prevention logic for optional strict mode (green).
5. Run targeted tests, then canary boundary run, then one full production run.

## 12) Definition Of Done (Parity)

Done when all are true:
1. Default generated Agent5 template matches v6 template clauses after placeholder normalization.
2. No strict first-attempt payload appears unless explicitly enabled.
3. No contradictory required id->source mappings can be emitted.
4. Full run passes with non-empty clue output and without deterministic structural abort.
