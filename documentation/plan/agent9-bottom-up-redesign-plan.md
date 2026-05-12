# Agent9 Bottom-Up Redesign Plan

## 0. Purpose

This document defines a clean-slate redesign of Agent9 prose generation to eliminate recurring non-convergence, strengthen fair-play guarantees, and preserve canary admissibility semantics. The approach is prevention-first: make invalid prose hard to produce, not merely easier to detect after generation.

This plan is aligned with:

- `documentation/08_cml_schema/08_cml_schema.md`
- `schema/cml_2_0.schema.yaml`
- `documentation/10_prose_generation/10_prose_generation.md`
- `documentation/11_canary_loop/11_canary_loop.md`
- `documentation/11_canary_loop/11_b_major_rework.md`
- `documentation/05_llm_ai/05_llm_ai.md`
- `documentation/07_workflow/07_workflow.md`
- `documentation/03_Agents/15_agent_9_prose_generator.md`
- `documentation/plan/prose-generation-HLD.md`
- `documentation/plan/prose-generation-LLD.md`

## 1. Non-Negotiable Constraints

1. CML version is 2.0 and all locked identifiers remain stable.
2. Prose cannot introduce facts that are not supported by CML and upstream artifacts.
3. Fair-play is strict: clues must appear before deductive use and before discriminating-test resolution.
4. No withheld critical evidence and no early spoiler of solution.
5. Chapter completeness must hold: one chapter per outline scene unless explicitly configured otherwise.
6. Period and setting locks are mandatory. No anachronistic details.
7. Locked fact value strings must preserve word form when rendered in prose.
8. Narrative-state transfer must be monotonic and auditable across batches.
9. Canary pass/stop semantics and planned-vs-executed wave logging remain intact.
10. Telemetry parity across JSON and markdown rollups must be preserved.

## 2. Current Failure Modes (Root Causes)

1. Prompt context is too broad and weakly scoped, so non-active material dilutes chapter focus.
2. Mandatory chapter obligations are not represented as deterministic pre-LLM contracts.
3. Retry loop is mostly prompt-feedback based and does not switch strategy when failure class repeats.
4. Hard constraints are often validated post-generation, causing expensive retries and low convergence.
5. Narrative state transfer and clue visibility tracking can diverge between internal and external state snapshots.
6. Template leakage and opening-style repetition are detected but not structurally prevented.
7. Chapter structure issues (for example paragraph floor failures) can still reappear under pressure.

## 3. Redesign Principles

1. Separate generation from validation and from state commit.
2. Use deterministic contracts and gates before prose is accepted.
3. Prefer scoped context selection over global context dumping.
4. Move from generic retries to failure-class-specific convergence actions.
5. Make state transitions explicit, monotonic, and checkpointed.
6. Keep run reproducibility first-class through prompt fingerprints and batch traces.
7. Preserve existing pipeline boundaries unless explicitly changed.

## 4. Clean-Slate Architecture

### 4.1 Pipeline Stages

1. Input normalization stage
2. Asset library build stage
3. Chapter obligation contract stage
4. Request contract assembly stage
5. LLM generation stage
6. Deterministic pre-commit gates stage
7. Commit and state-transition stage
8. Post-batch scoring and steering stage
9. End-of-run release gate and telemetry parity stage

### 4.2 Stage Responsibilities

#### A) Input Normalization

- Validate required artifacts and schema shape.
- Resolve optional artifacts (world document, profiles) with explicit fallback behavior.
- Freeze run constants: runId, projectId, chapter range, retry budgets, cost ceilings.

#### B) Asset Library Build

- Decompose upstream context into typed, addressable atoms.
- Index by scope: global, character, location.
- Classify atoms by register: obligation vs texture.
- Attach deployment budget, priority, and sequencing constraints.

#### C) Chapter Obligation Contract

- Compute hard requirements per chapter from outline, clue distribution, and fair-play rules.
- Emit must-include and must-not-include lists.
- Compute structure floor (word target, paragraph floor).
- Declare if chapter is allowed to perform discriminating-test progression.

#### D) Request Contract Assembly

- Build chapter prompt from scoped active context only.
- Inject obligation atoms as mandatory instructions.
- Inject texture atoms as optional enhancement pool.
- Attach retry packet directives if a retry is active.
- Emit prompt fingerprint and section token map.

#### E) LLM Generation

- Generate chapter batch.
- Parse response with strict schema handling and deterministic repair where safe.

#### F) Deterministic Pre-Commit Gates

- Encoding gate
- Completeness and structure gate
- Locked-fact word-form gate
- Character and pronoun consistency gate
- Clue placement and timing gate
- Temporal continuity gate
- Template leakage gate

Only batches that pass hard gates are eligible for commit.

#### G) Commit and State Transition

- Commit chapters.
- Update narrative state atomically.
- Stamp deployed atoms.
- Update clue visibility monotonic set.
- Update victim-state checkpoint once detected.
- Persist batch checkpoint and trace record.

#### H) Post-Batch Scoring and Steering

- Compute provisional quality deficits.
- Convert deficits into next-batch steering directives.
- Do not mutate committed chapters in this stage.

#### I) End-of-Run Release Gate

- Re-audit fair-play and clue visibility.
- Validate NSD parity.
- Validate report invariants.
- Publish final telemetry with JSON/markdown parity.

## 5. Contracts and Invariants

### 5.1 New Core Contracts

1. `ChapterObligationContract`
2. `ProseRequestContract`
3. `RetryPacket`
4. `BatchCommitRecord`
5. `ReleaseGateAudit`

### 5.2 Invariants (Must Always Hold)

1. Chapter numbers are strictly increasing with no gaps in generated output for requested range.
2. `cluesRevealedToReader` is append-only and never regresses.
3. `victimConfirmedDeadChapter` is write-once.
4. Locked facts preserve required value forms.
5. Internal and external narrative state snapshots are parity-checked on every commit.
6. Deployed asset stamps only include atoms available in the active request contract.
7. Release gate verdict aligns with run outcome and persisted telemetry.

## 6. Retry and Convergence Protocol

### 6.1 Failure Classes

1. encoding
2. structure
3. completeness
4. continuity
5. clue_timing
6. template
7. tone_pacing

### 6.2 Protocol

1. Classify failing gates into a single dominant failure class.
2. Attach class-specific retry packet directives.
3. Retry with scoped corrections once.
4. If same class fails twice consecutively, switch strategy deterministically:
   - refresh texture atom set
   - tighten obligation instruction format
   - apply deterministic structure repair where allowed
5. Stop when max retries reached or cost ceiling breached.
6. Escalate with explicit diagnostics, not silent fallback.

### 6.3 Convergence Rules

1. A batch converges only if all hard gates pass.
2. Warning-only gates may pass with traceable deficit annotations.
3. Repeated identical failure class across attempts is treated as non-convergent and triggers strategy switch.
4. No unbounded retries.

## 7. Validation and Telemetry Model

### 7.1 Batch Trace (Required)

Each committed batch must record:

1. chapter range
2. attempt count
3. gate outcomes
4. new clue ids revealed
5. cumulative clue set
6. deployed atom ids
7. continuity tail preview
8. prompt fingerprint hash
9. duration and cost

### 7.2 Report Invariant Gate

Before persisting final report:

1. validate run outcome consistency
2. validate NSD transfer coherence
3. validate release gate verdict consistency
4. validate required telemetry fields present for pass/fail status

### 7.3 Canary Compatibility

1. Preserve pass/stop behavior exactly.
2. Preserve admissibility-blocked wave planned-vs-executed logging semantics.
3. Preserve parity fields used by canary JSON and markdown rollups.

## 8. Agent 6.5 and Boundary Clarification

Current boundary behavior does not require Agent 6.5 as a strict prerequisite for Agent9 execution. The redesign keeps this explicit:

1. `worldDocument` remains optional at boundary level.
2. If present, it participates in scoped atom assembly.
3. If absent, obligation contracts still enforce fair-play and structural floors.

This avoids hidden coupling while still leveraging 6.5 when available.

## 9. Implementation Plan (Phased)

### Phase P0: Stabilize Contracts and Gates

Targets:

1. Add contract types and deterministic gate framework.
2. Wire atomic commit path and parity checks.
3. Normalize retry classification and stop rules.

Primary files:

- `packages/prompts-llm/src/agent9-prose.ts`
- `packages/prompts-llm/src/types/narrative-state.ts`
- `apps/worker/src/jobs/agents/agent9-run.ts`

### Phase P1: Asset Library and Scoped Assembly

Targets:

1. Build atomized asset library.
2. Select scoped atoms by chapter-active entities.
3. Separate obligation atoms from texture atoms in prompt assembly.

Primary files:

- `packages/prompts-llm/src/asset-library.ts`
- `packages/prompts-llm/src/contracts/chapter-obligation-contract.ts` (new)
- `packages/prompts-llm/src/contracts/prose-request-contract.ts` (new)
- `packages/prompts-llm/src/agent9-prose.ts`

### Phase P2: Convergence Hardening

Targets:

1. Class-specific strategy switching.
2. Deterministic mitigation hooks for repeated failures.
3. Cost/time bounded convergence behavior.

Primary files:

- `packages/prompts-llm/src/retry-protocol.ts` (new)
- `packages/prompts-llm/src/agent9-prose.ts`

### Phase P3: Telemetry and Release Gate Parity

Targets:

1. Batch trace durability.
2. Final report invariant gate.
3. JSON/markdown parity checks for canary reporting.

Primary files:

- `apps/worker/src/jobs/agents/agent9-run.ts`
- `packages/cml/src/report-repository.ts` (or active report writer path)
- `documentation/11_canary_loop/11_canary_loop.md`
- `documentation/11_canary_loop/11_b_major_rework.md`

## 10. Test Strategy

1. Unit tests for contract builders and deterministic gates.
2. Integration tests for batch retries and NSD parity.
3. Golden canary replay tests using fixed run inputs.
4. Regression tests for clue timing and discriminating-test ordering.
5. Template leakage regression tests.
6. Resume-from-checkpoint tests validating state continuity.

Minimum acceptance for rollout:

1. No hard-gate regressions in existing passing fixtures.
2. Prior chapter-8 paragraph-floor failure class is eliminated.
3. Prior chapter-9 clue-timing failure class converges or fails with deterministic, auditable diagnostics.

## 11. Rollout and Rollback

### Rollout

1. Introduce behind feature flag `AGENT9_REDESIGN_V1`.
2. Run shadow telemetry on canary before making gate-blocking.
3. Enable blocking mode after parity confidence is reached.

### Rollback

1. Feature-flag disable restores legacy path.
2. Keep new telemetry records non-breaking when flag is off.
3. Preserve report schema compatibility.

## 12. Documentation Parity Tasks

When code changes land, update in same task:

1. `documentation/03_Agents/15_agent_9_prose_generator.md`
2. `documentation/10_prose_generation/10_prose_generation.md`
3. `documentation/11_canary_loop/11_canary_loop.md`
4. `documentation/11_canary_loop/11_b_major_rework.md`
5. `documentation/plan/prose-generation-HLD.md`
6. `documentation/plan/prose-generation-LLD.md`

## 13. Exit Criteria for This Redesign

1. Agent9 uses explicit chapter obligation and request contracts.
2. Hard gates block invalid chapters before commit.
3. Retry loop converges under bounded, class-specific strategies.
4. NSD and telemetry parity are enforced and auditable.
5. Canary run outcomes are reproducible with stable diagnostics.
6. Documentation and runtime behavior are in sync.
