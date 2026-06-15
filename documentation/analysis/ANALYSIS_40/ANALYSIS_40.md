# ANALYSIS_40 - Agent 9 Validation Review and Fix Plan

Date: 2026-06-14

## Plan Status Table

| Item | Category | Severity | Likelihood | Status | Planned Touchpoints |
| --- | --- | --- | --- | --- | --- |
| Make discriminating-test repair validator-driven instead of marker-driven | Deterministic repair correctness | High | 94% | TODO | `packages/prompts-llm/src/agent9-prose/generate.ts`, `packages/prompts-llm/src/agent9-prose/clue-validation.ts` |
| Replace raw clue IDs with prose-facing clue descriptions in deterministic DT prose | Output quality / scoring | Medium | 96% | TODO | `packages/prompts-llm/src/agent9-prose/generate.ts` |
| Align deterministic clue materializer with validator handling of mapping-only / delivery-method clues | Deterministic repair correctness | Medium | 91% | TODO | `packages/prompts-llm/src/agent9-prose/generate.ts`, `packages/prompts-llm/src/agent9-prose/clue-validation.ts` |
| Reduce retry prompt stacking into one canonical retry brief per mode | Prompt clarity / generation quality | Medium | 82% | TODO | `packages/prompts-llm/src/agent9-prose/generate.ts`, retry prompt helpers |
| Consolidate duplicate chapter-composition percentages into one canonical narrative-balance system | Prompt clarity / guidance reliability | Medium | 90% | TODO | `packages/prompts-llm/src/agent9-prose/prompt-builder.ts`, `packages/story-validation/src/generation-params.ts`, tests |
| Add a validator-guarded post-pass polish step for already-passing chapters | Prose quality / scoring | Medium | 79% | TODO | `packages/prompts-llm/src/agent9-prose/generate.ts`, polish prompt helpers, tests |
| Extract deterministic repair helpers out of `generate.ts` into a dedicated module | Maintainability / bug prevention | Medium | 88% | TODO | `packages/prompts-llm/src/agent9-prose/generate.ts`, new `deterministic-repair.ts`, tests |
| Consolidate repeated chapter stage-contract derivation into shared helpers | Maintainability / consistency | Low | 86% | TODO | `packages/prompts-llm/src/agent9-prose/generate.ts` |
| Add validator-aligned regression tests for false-positive DT skip and mapping-only clues | Test coverage | High | 97% | TODO | `packages/prompts-llm/src/__tests__/agent9-prose.test.ts` |

## 1. Scope

This document records the follow-up validation review of recent `Agent 9` changes after the deterministic repair and retry-control work landed in `ANALYSIS_39`.

Reviewed areas:

- `packages/prompts-llm/src/agent9-prose/generate.ts`
- `packages/prompts-llm/src/agent9-prose/clue-validation.ts`
- `packages/prompts-llm/src/agent9-prose/prompt-builder.ts`
- `packages/prompts-llm/src/agent9-prose/discriminating.ts`
- `packages/prompts-llm/src/__tests__/agent9-prose.test.ts`
- `packages/llm-client/src/logger.ts`

Review focus:

- deterministic repair logic vs actual validator contract
- deterministic layer vs LLM prompt layer interaction
- prose quality risk introduced by deterministic fallbacks / patches
- refactor opportunities that reduce bug surface and improve scoring stability

## 2. Executive Summary

The recent Agent 9 changes are strategically good:

- deterministic repair is now addressing real validator miss classes
- completion-first retry behavior is much safer
- retry archive numbering is fixed
- continuity-hostile retry wording has been removed

But the validation review found a few remaining issues:

1. The discriminating-test patch can skip repair even when the chapter still fails the actual validator.
2. The discriminating-test patch can write raw clue IDs into prose, which is bad for quality and scoring.
3. The deterministic clue patch is not fully aligned with the validator's special handling of mapping-only / delivery-method clue metadata.
4. Retry prompts still stack too many instruction layers, which risks muddled generation quality even when correctness is preserved.
5. The chapter-composition percentage system is duplicated across two prompt blocks and can give partially conflicting guidance.
6. Once a chapter passes, there is no dedicated constrained polish path to improve prose without reopening full generation churn.

So the code is moving in the right direction, but it is not yet at the cleanest or most reliable version of the design.

## 2.1 Execution Plan

This is the recommended execution order for the actual code work.

### Wave 1 - validator-aligned correctness

Goal:

- remove the highest-confidence structural mismatches first

Scope:

1. Add shared validator-state helpers
2. Make DT repair validator-driven
3. Replace raw DT clue IDs with prose-facing evidence text
4. Align clue materializer with validator clue-state handling
5. Add focused regressions for the above

Exit criteria:

- DT repair no longer false-skips
- deterministic DT prose no longer leaks raw IDs
- metadata-only clues no longer trigger filler insertion

### Wave 2 - prompt architecture cleanup

Goal:

- reduce contradictory prompt guidance and make quality steering clearer

Scope:

6. Canonicalize narrative-balance guidance into one runtime source
7. Replace layered retry assembly with one canonical retry brief
8. Add/adjust tests for prompt shape and balance rendering

Exit criteria:

- prompts emit one active narrative-balance block
- retry prompts emit one top-level retry narrative

### Wave 3 - maintainability extraction

Goal:

- reduce future bug surface without mixing too many behavior changes at once

Scope:

9. Extract deterministic repair helpers into `deterministic-repair.ts`
10. Introduce shared chapter repair context

Exit criteria:

- `generate.ts` is materially smaller
- fallback / repair / validation paths share more context derivation

### Wave 4 - safe quality lift

Goal:

- improve already-passing prose without destabilizing structure

Scope:

11. Add validator-guarded post-pass polish
12. Optionally add soft narrative-balance assessment for retry/polish hints

Exit criteria:

- polished chapters always revalidate
- regressions automatically roll back to the accepted version

## 2.2 Status Tracker

Use this tracker during implementation.

| Workstream | Status | Owner | Notes |
| --- | --- | --- | --- |
| Shared validator-state helpers | Not started | TBD | `resolveClueObligationState(...)`, `resolveDiscriminatingTestValidityState(...)` |
| DT repair validator alignment | Not started | TBD | Replace regex-only skip |
| DT prose-facing evidence rendering | Not started | TBD | Remove raw `clue_*` leakage |
| Clue materializer validator alignment | Not started | TBD | Handle metadata-only / earlyness through shared state |
| Narrative-balance canonicalization | Not started | TBD | Collapse duplicate percentage systems into one runtime source |
| Retry-brief canonicalization | Not started | TBD | Remove layered retry assembly |
| Deterministic-repair extraction | Not started | TBD | Create `deterministic-repair.ts` |
| Shared chapter repair context | Not started | TBD | Remove repeated stage/suspect derivation |
| Post-pass polish | Not started | TBD | Guarded keep-or-rollback flow |
| Regression and prompt-shape tests | Not started | TBD | Add direct helper + prompt rendering coverage |

Status legend:

- `Not started` = no code landed yet
- `In progress` = active implementation branch / patch in progress
- `Blocked` = awaiting decision or prerequisite
- `Done` = implemented and validated

## 3. Findings

### 3.1 High - discriminating-test repair can false-skip

Current behavior:

- `applyDeterministicDiscriminatingTestPatch(...)` in `generate.ts` skips insertion if the chapter text matches broad theory/proof marker regexes.
- The real validator in `clue-validation.ts` checks a stronger contract for discriminating-test validity.

Why this matters:

- A chapter can contain incidental words like `either`, `result`, or `observation` and still fail discriminating-test validity.
- In that case the deterministic patch does not fire, and we waste retries or fall back to weaker prose than necessary.

Planned fix:

- Drive DT repair from validator state, not from lightweight pre-check regexes alone.
- Add a helper that asks: "Would `validateChapterPreCommitObligations(..., mode=discriminating_test)` fail for DT validity right now?"
- Only skip DT repair when the chapter already satisfies that validator contract.

Likelihood this resolves the issue:

- `94%`

### 3.2 Medium - raw clue IDs can leak into prose

Current behavior:

- DT deterministic prose can use `evidenceClueIds.join(", ")` as visible text.

Why this matters:

- Internal IDs such as `clue_clock` are structurally acceptable to the code, but poor fiction.
- This likely harms both perceived prose quality and downstream scoring.

Planned fix:

- Resolve every DT evidence clue ID to prose-facing text using the same clue-summary logic already used elsewhere.
- Fall back to IDs only when no prose-facing text exists, and even then prefer a neutral phrase like `the key timing clue` over raw internal identifiers.

Likelihood this resolves the issue:

- `96%`

### 3.3 Medium - deterministic clue patch is not fully validator-aligned

Current behavior:

- The clue patch uses `chapterMentionsRequiredClue(...)` to decide whether a clue is missing.
- The validator has extra logic for mapping-only clues and delivery-method labels.

Why this matters:

- For metadata-only clues, the patch can decide to inject prose where the validator would have accepted the chapter already.
- That creates avoidable deterministic filler and can lower chapter quality.

Planned fix:

- Extract a shared `resolveClueObligationState(...)` helper used by both the validator and the deterministic patch.
- The helper should return:
  - `isPresent`
  - `isEarlyEnough`
  - `isMetadataOnly`
  - `proseFacingDescription`
- Use that single result everywhere instead of slightly different local logic.

Likelihood this resolves the issue:

- `91%`

### 3.4 Medium - retry instructions are still over-stacked

Current behavior:

- Retry prompts can combine:
  - `buildSinglePassRetryPrompt(...)`
  - `buildEnhancedRetryFeedback(...)`
  - `buildRetryFeedback(currentRetryPacket)`

Why this matters:

- This is still understandable, but it is not elegant.
- On hard retries, too many instruction blocks can compete for attention and reduce prose quality.

Planned fix:

- Build one canonical retry brief per mode:
  - logic-focused
  - quality-focused
  - terminal rebuild
- Make the retry packet feed that one brief rather than layering multiple partially-overlapping narratives.

Likelihood this improves output quality:

- `82%`

### 3.5 Medium - passing chapters have no constrained polish path

Current behavior:

- Once a chapter passes validation, the system generally commits it as-is.
- Quality improvements mostly happen indirectly through retries before acceptance, not through a dedicated post-pass editor.

Why this matters:

- A chapter can be structurally correct yet still have repetitive sentences, weak transitions, or slightly mechanical deterministic insertions.
- A targeted second-pass editor can improve naturalness more safely than sending the chapter back through another full generation attempt.

Planned fix:

- Add a post-pass polish step that runs only after a chapter already passes validation.
- Treat it as a constrained copyedit, not a rewrite:
  - preserve clue mentions, suspect clearances, DT logic, paragraph ordering, and plot facts
  - minimize edits
  - forbid introducing new story facts
- Revalidate after polish and keep the edited version only if it still passes.

Likelihood this improves output quality:

- `79%`

### 3.6 Medium - narrative-balance percentages are duplicated and too soft

Current behavior:

- Prompt construction currently emits both:
  - stage-mode balance targets
  - chapter-phase composition targets
- These are conceptually similar, but not identical in naming or percentage ranges.
- The guidance is delivered as prompt text only; it is not measured by the validator or scorer.

Why this matters:

- The model can be told two nearby but slightly different balances for the same chapter, which weakens clarity.
- The current labels overstate enforceability: the prose sees "mandatory narrative balance" even though no hard validation checks those percentages.
- The duplicated tables spend prompt budget without creating a single trustworthy source of truth.

Planned fix:

- Make `stage_modes[mode].balance_targets` the single canonical runtime source of narrative-balance guidance.
- Demote or remove `chapter_composition_targets` from runtime prompt assembly; keep it only as:
  - migration fallback
  - documentation/reference
  - or generated defaults derived from stage-mode targets
- Emit one concise active-balance block per chapter mode instead of two overlapping percentage systems.
- If balance assessment is added later, keep it soft:
  - telemetry
  - retry hinting
  - polish guidance
  - never a brittle hard gate based on pseudo-exact percentages

Likelihood this improves prompt clarity:

- `90%`

## 4. Refactor Plan

### 4.0 Target Architecture

Target shape for `Agent 9`:

- `generate.ts`
  - orchestration only
  - batch loop
  - retry routing
  - fallback selection
  - telemetry emission
- `clue-validation.ts`
  - authoritative acceptance rules
  - shared obligation-state resolvers
  - stage-contract predicates
- `deterministic-repair.ts`
  - validator-driven clue repair
  - validator-driven discriminating-test repair
  - suspect-clearance repair
  - prose-facing evidence rendering helpers
- `retry-brief.ts` or equivalent helper area
  - one canonical retry brief builder per mode
  - no layered prompt assembly inside `generate.ts`
- `narrative-balance.ts` or equivalent helper area
  - one canonical active-balance profile per stage mode
  - reusable by prompt-builder, retry briefing, polish guidance, and telemetry
- post-pass polish helper area
  - validator-guarded quality-only editor for already-passing chapters
  - rollback to the original chapter on any regression
- tests
  - validator tests
  - deterministic-repair tests
  - narrative-balance prompt/render tests
  - polish-step regression tests
  - orchestration / retry-routing tests

Design principle:

- validators define what is required
- deterministic repair uses validator-compatible state
- narrative balance guides emphasis, but does not masquerade as a hard structural validator
- prompt layer handles quality and style, not core structural correctness

### 4.0.1 Before / After Module Boundaries

Current boundary:

- `generate.ts`
  - owns orchestration
  - owns deterministic repair implementation
  - owns fallback authoring
  - owns retry prompt composition
  - re-derives chapter context in several places

Desired boundary:

- `generate.ts`
  - asks for `chapterRepairContext`
  - calls `repairChapterDeterministically(...)`
  - calls `buildCanonicalRetryBrief(...)`
  - commits or retries based on outputs
- `deterministic-repair.ts`
  - returns repaired chapter + applied repairs + reasons
- `clue-validation.ts`
  - exposes shared state helpers such as `resolveClueObligationState(...)`
  - exposes DT validity predicate or structured failure output

Why this boundary is better:

- one source of truth for "is this chapter structurally acceptable?"
- easier to unit test
- smaller orchestration file
- fewer accidental mismatches between retry path, expansion path, and fallback path
- a safer path to improve prose after correctness is already locked in
- one source of truth for narrative-balance guidance instead of two partially-overlapping tables

### 4.1 Extract deterministic repairs into a dedicated module

Problem:

- `generate.ts` is carrying orchestration, fallback authorship, deterministic repair rules, prompt assembly, retry routing, and validation coordination.

Planned refactor:

- Create `packages/prompts-llm/src/agent9-prose/deterministic-repair.ts`
- Move into it:
  - clue materialization helpers
  - suspect-clearance patching
  - discriminating-test patching
  - shared prose-facing clue resolution helpers

Expected benefits:

- smaller `generate.ts`
- easier validator-alignment work
- lower chance of future regressions
- clearer test boundaries

Estimated effort:

- `0.75-1.25` engineer days including tests

Expected scoring impact:

- indirect but meaningful
- likely `+1 to +3` aggregate prose points by reducing contradictory repair behavior and making future quality tuning safer

### 4.2 Introduce shared chapter repair context

Problem:

- Stage mode, culprit name, suspect names, and scene-level context are recomputed in multiple places.

Planned refactor:

- Create a shared per-chapter repair context object:
  - `chapterNumber`
  - `scene`
  - `stageMode`
  - `culpritName`
  - `suspectNames`
  - `investigatorName`
  - `requiredClueSummaries`

Expected benefits:

- less repeated logic
- fewer mismatches between ordinary validation, expansion repair, and fallback repair

Estimated effort:

- `0.5-0.75` engineer days

Expected scoring impact:

- mostly stability rather than immediate score lift
- likely `0 to +1` direct score impact
- stronger protection against regressions in late-chapter logic

### 4.3 Unify validator-driven repair decisions

Problem:

- Some repair steps rely on custom regexes rather than the same acceptance logic that gates the batch.

Planned refactor:

- Prefer "repair because validator says X is missing" over "repair because heuristic regex says maybe".
- Where possible, expose small helper predicates from `clue-validation.ts` for direct reuse.

Expected benefits:

- deterministic repairs become more reliable
- less duplicate business logic

Estimated effort:

- `0.5-1.0` engineer days depending on how much clue-state logic is centralized

Expected scoring impact:

- likely `+2 to +5` on difficult runs
- especially valuable for discriminating-test and clue-visibility failure classes

### 4.4 Canonicalize narrative-balance guidance

Problem:

- Agent 9 currently carries two related but separate percentage systems:
  - `stage_modes.*.balance_targets`
  - `chapter_composition_targets`
- Both are rendered into the prompt, and they can differ slightly for the same chapter.

Planned refactor:

- Keep `stage_modes.*.balance_targets` as the canonical runtime source.
- Add a small helper area such as `narrative-balance.ts` with:
  - `getNarrativeBalanceProfile(mode)`
  - `buildNarrativeBalanceBlock(mode)`
  - optional later `assessNarrativeBalanceSignals(chapter, mode)`
- Remove the second runtime percentage block from prompt assembly once parity is confirmed.
- Use soft balance assessment only for:
  - telemetry
  - retry wording
  - post-pass polish guidance

Expected benefits:

- less contradictory prompt guidance
- lower prompt token waste
- cleaner reuse across prompt, retry, and polish flows

Estimated effort:

- `0.5-0.75` engineer days for canonicalization
- `+0.25-0.5` days if soft balance assessment is added immediately

Expected scoring impact:

- likely `+1 to +3` aggregate prose points
- mostly from clearer chapter emphasis and fewer muddled prompt signals

## 5. Change Impact Estimates

### 5.1 Highest-value changes

| Change | Primary Benefit | Run Success Impact | Score Impact | Effort |
| --- | --- | --- | --- | --- |
| Validator-driven DT repair | Prevents false-skip and late-chapter churn | High | High (`+2 to +4`) | Medium |
| Prose-facing DT evidence rendering | Better naturalness, less internal-ID leakage | Medium | Medium (`+1 to +3`) | Low |
| Validator-aligned clue materializer | Prevents both under-repair and over-repair | High | Medium (`+1 to +3`) | Medium |
| Canonical narrative-balance system | Removes conflicting composition guidance and reduces prompt noise | Medium | Medium (`+1 to +3`) | Low-Medium |
| Canonical retry brief | Reduces instruction competition | Medium | Medium (`+1 to +2`) | Medium |
| Validator-guarded post-pass polish | Improves already-passing prose without full regeneration | Medium | Medium (`+1 to +3`) | Low-Medium |
| Deterministic-repair extraction | Lowers bug surface for future work | Medium | Low direct, high indirect | Medium |

### 5.2 Expected ordering by payoff

Best payoff per effort:

1. Validator-driven DT repair
2. Prose-facing DT evidence rendering
3. Validator-aligned clue materializer
4. Canonical narrative-balance system
5. Validator-guarded post-pass polish
6. Canonical retry brief
7. Deterministic-repair extraction
8. Shared chapter repair context

## 6. Concrete Fix Specifications

### 6.1 Validator-driven DT repair

Implementation shape:

- Add a helper such as `chapterNeedsDiscriminatingTestRepair(...)`
- Feed it:
  - chapter text
  - ledger entry
  - chapter repair context
  - case data
- Let it answer from validator-compatible logic, not from broad regexes

Acceptance condition:

- DT patch only skips when the chapter already satisfies the same DT validity contract used in `validateChapterPreCommitObligations(...)`

### 6.2 Prose-facing DT evidence rendering

Implementation shape:

- Add a helper such as `summarizeEvidenceForProse(clueId, ledgerEntry, clueDistribution)`
- Use clue descriptions / points-to / obligation context in priority order
- Never write raw IDs into visible prose unless absolutely unavoidable

Acceptance condition:

- deterministic DT patch output contains natural evidence wording
- no `clue_*` tokens in rendered chapter text under normal test cases

### 6.3 Shared clue obligation state

Implementation shape:

- Add `resolveClueObligationState(...)` returning:
  - `isPresent`
  - `isEarlyEnough`
  - `isMetadataOnly`
  - `description`
  - `reason`

Acceptance condition:

- validator and deterministic clue patch both consume the same resolved state
- mapping-only clue cases stop producing unnecessary filler paragraphs

### 6.4 Canonical retry brief

Implementation shape:

- Replace stacked assembly with:
  - `buildCanonicalRetryBrief({ phase, packet, errors, chapterRange, ... })`
- Internally choose one mode:
  - logic
  - quality
  - terminal rebuild

Acceptance condition:

- one top-level retry narrative per retry
- no repeated checklist or overlapping execution instructions

### 6.5 Validator-guarded post-pass polish

Implementation shape:

- Add a helper such as `polishPassingChapter(...)`
- Feed it:
  - the full passing chapter
  - chapter context / stage mode
  - a compact "preserve these obligations" contract
- Instruct the model to:
  - lightly improve prose quality
  - preserve paragraph order and core content
  - avoid adding or removing facts, clues, clearances, or DT logic
- Revalidate the polished result and keep it only if:
  - validation still passes
  - no key obligation text disappears
  - the result is not materially shorter in a way that weakens content

Acceptance condition:

- passing chapters can receive a quality-only second pass without reopening structural churn
- any regression causes automatic rollback to the pre-polish version

### 6.6 Canonical narrative-balance system

Implementation shape:

- Keep one runtime source of truth:
  - `stage_modes[mode].balance_targets`
- Add helper(s) such as:
  - `getNarrativeBalanceProfile(mode)`
  - `buildNarrativeBalanceBlock(mode)`
  - optional later `assessNarrativeBalanceSignals(chapter, mode)`
- In prompt assembly:
  - emit one concise active-balance block only
  - remove the duplicated chapter-phase reference table from runtime prompts
- In retry / polish:
  - use balance only as soft guidance, e.g.:
    - "reduce atmospheric throat-clearing"
    - "increase observable evidence chain"
    - "shift emphasis from setting to test result"
- Do not make percentage compliance a hard validator requirement.

Acceptance condition:

- each chapter sees one active narrative-balance profile, not two overlapping ones
- aftermath chapters do not inherit final-reveal evidence-chain emphasis by accident
- retry/polish flows can reuse the same balance vocabulary without duplicating tables

## 7. Implementation Order

### Phase 1 - correctness fixes first

1. Make DT repair validator-driven
2. Remove raw clue IDs from deterministic prose
3. Align clue materializer logic with validator clue-state handling
4. Add regression tests for the above

### Phase 2 - maintainability and quality

5. Extract deterministic repair module
6. Introduce shared chapter repair context
7. Canonicalize narrative-balance guidance into one runtime system
8. Collapse retry prompt stacking into one canonical brief per mode
9. Add validator-guarded post-pass polish for already-passing chapters

### Phase 3 - polish and scoring optimization

10. Review fallback prose for repetitive rhetorical patterns after extraction
11. Tune deterministic inserted paragraphs for stronger scene naturalness
12. Re-run prompt-log review against fresh runs and compare retry counts / score deltas

## 8. Test Plan

Add or extend tests to cover:

1. DT false-skip case
   - chapter contains incidental theory/proof marker words
   - validator still fails DT validity
   - deterministic DT patch must still insert

2. DT prose-facing clue rendering
   - DT evidence clues present as IDs in CML
   - deterministic patch must write descriptions, not raw IDs

3. Mapping-only clue acceptance
   - validator accepts a metadata-only clue case
   - deterministic clue patch must not insert unnecessary filler

4. Shared validator-aligned clue state
   - same clue state produces matching outcomes in patcher and validator

5. Retry prompt canonicalization
   - only one top-level retry brief per mode
   - no contradictory instruction stacking

6. Narrative-balance canonicalization
   - one active balance profile per chapter mode
   - no duplicate stage-mode plus chapter-phase percentage blocks
   - aftermath chapters no longer inherit final-reveal mix accidentally

7. Post-pass polish rollback safety
   - a passing chapter is lightly edited
   - the polished version is revalidated
   - any regression restores the original accepted chapter

## 9. Effort Summary

Estimated total effort for the full `ANALYSIS_40` plan:

- Phase 1: `1.0-1.75` engineer days
- Phase 2: `1.25-2.0` engineer days
- Phase 3: `0.5-1.0` engineer days

Total:

- `2.75-4.75` engineer days

Additional polish-stage allowance:

- `0.25-0.75` engineer days for a first guarded implementation

Additional narrative-balance allowance:

- `0.5-1.25` engineer days depending on whether soft assessment/telemetry is added in the first pass

Recommended delivery approach:

- land Phase 1 in one focused branch
- validate on fresh runs
- only then do the extraction / narrative-balance / retry-brief work

## 10. Success Criteria

This plan is complete when:

- deterministic DT repair never false-skips a chapter that still fails DT validity
- deterministic prose never emits raw clue IDs in normal story text
- clue materialization does not inject metadata-only filler
- retry prompts are clearer and less layered
- chapter-balance guidance is canonicalized into one runtime system
- passing chapters can optionally receive a safe quality-only polish pass
- `generate.ts` is materially smaller and easier to reason about
- focused tests and package builds pass cleanly

## 11. Recommendation

The next best move is:

1. Phase 1 correctness fixes immediately
2. then the deterministic-repair extraction
3. then narrative-balance canonicalization
4. then retry prompt simplification
5. then a guarded post-pass polish step

That order gives the best chance of improving both run success and prose quality without introducing fresh instability.

## 12. Detailed Code Change Plan

This section turns the strategy above into an actual implementation blueprint.

Principles for the code changes:

- do not change user-visible behavior and architecture in the same patch unless the behavior is already covered by tests
- move logic only after adding tests that pin the current intended behavior
- centralize validator-compatible state before rewriting repair prose
- prefer additive helpers first, then call-site replacement, then cleanup/removal

## 12.1 File-by-File Change List

### A. `packages/prompts-llm/src/agent9-prose/clue-validation.ts`

Add:

- `export interface ClueObligationState`
- `export interface DiscriminatingTestValidityState`
- `export const resolveClueObligationState(...)`
- `export const resolveDiscriminatingTestValidityState(...)`
- optional small helper predicates:
  - `chapterNeedsDiscriminatingTestRepair(...)`
  - `chapterNeedsClueMaterialization(...)`

Refactor:

- `validateChapterPreCommitObligations(...)` should use `resolveClueObligationState(...)` internally rather than re-deriving clue presence/earlyness inline
- DT validity block inside `validateChapterPreCommitObligations(...)` should use `resolveDiscriminatingTestValidityState(...)`

Do not change in first pass:

- stage mode taxonomy
- word-count logic
- resolution checks

### B. `packages/prompts-llm/src/agent9-prose/generate.ts`

Initial change set:

- stop using local heuristic skip logic for DT repair
- consume `resolveClueObligationState(...)`
- consume `resolveDiscriminatingTestValidityState(...)`
- replace raw clue-ID rendering in DT prose with prose-facing evidence descriptions

Second change set:

- remove local deterministic repair helper implementations after extraction
- replace them with imports from `deterministic-repair.ts`
- add `buildChapterRepairContext(...)` helper and replace repeated local derivation

### C. `packages/prompts-llm/src/agent9-prose/deterministic-repair.ts`

Create new module containing:

- prose-facing evidence rendering
- clue repair helpers
- suspect-clearance repair helpers
- DT repair helpers
- top-level `repairChapterDeterministically(...)`

Expected exports:

- `buildChapterRepairContext(...)`
- `repairChapterDeterministically(...)`
- `applyDeterministicCluePatch(...)`
- `applyDeterministicClearancePatch(...)`
- `applyDeterministicDiscriminatingTestPatch(...)`
- `buildCompletionFallbackChapter(...)` may remain in `generate.ts` initially, then optionally move later

### D. `packages/prompts-llm/src/agent9-prose/types.ts`

Add shared types:

- `ChapterRepairContext`
- `DeterministicRepairResult`
- `ClueObligationState`
- `DiscriminatingTestValidityState`
- `AppliedRepairRecord`

Goal:

- avoid opaque `any`-shaped internal contracts between helper files

### E. `packages/prompts-llm/src/agent9-prose/retry-brief.ts`

Create in Phase 2:

- `buildCanonicalRetryBrief(...)`
- `buildLogicRetryBrief(...)`
- `buildQualityRetryBrief(...)`
- `buildTerminalRetryBrief(...)`

Then remove direct layered assembly from `generate.ts`

### F. `packages/prompts-llm/src/agent9-prose/narrative-balance.ts`

Create in Phase 2 if reuse is desired immediately:

- `getNarrativeBalanceProfile(mode)`
- `buildNarrativeBalanceBlock(mode)`
- optional later:
  - `assessNarrativeBalanceSignals(chapter, mode)`

Purpose:

- give prompt-builder, retry briefing, and polish flows one shared vocabulary for narrative emphasis
- eliminate the current dual-table prompt guidance pattern

### G. `packages/prompts-llm/src/agent9-prose/post-pass-polish.ts`

Create in Phase 2 or 3:

- `buildPostPassPolishPrompt(...)`
- `polishPassingChapter(...)`
- optional guard helper:
  - `hasPolishRegression(...)`

Purpose:

- improve already-passing chapters with a constrained editor prompt
- ensure the original accepted chapter survives if polish weakens structure or continuity

### H. `packages/prompts-llm/src/__tests__/agent9-prose.test.ts`

Add:

- direct unit tests for `resolveClueObligationState(...)`
- direct unit tests for `resolveDiscriminatingTestValidityState(...)`
- DT false-skip regression
- prose-facing clue rendering regression
- mapping-only clue non-insertion regression
- narrative-balance block canonicalization tests
- canonical retry-brief shape tests in Phase 2
- post-pass polish rollback / preservation tests

Optional later:

- split into:
  - `agent9-prose-validation.test.ts`
  - `agent9-prose-deterministic-repair.test.ts`
  - `agent9-prose-retry-brief.test.ts`

## 12.2 New Types and Function Signatures

### A. Clue obligation state

Recommended shape:

```ts
export interface ClueObligationState {
  clueId: string;
  isPresent: boolean;
  isEarlyEnough: boolean;
  isMetadataOnly: boolean;
  placement?: string;
  proseFacingDescription: string;
  pointsTo?: string;
  matchedBy: "id" | "description_tokens" | "semantic_family" | "metadata_only" | "none";
  missingReason?: "absent" | "late_only";
}
```

Recommended helper:

```ts
export const resolveClueObligationState = (
  chapter: ProseChapter,
  clueId: string,
  ledgerEntry: ChapterRequirementLedgerEntry,
  clueDistribution?: ClueDistributionResult,
  castNames?: string[],
): ClueObligationState => { ... };
```

Implementation rule:

- this helper becomes the only place where clue presence / earlyness / metadata-only exception logic is computed

### B. DT validity state

Recommended shape:

```ts
export interface DiscriminatingTestValidityState {
  isValid: boolean;
  hasTheoryStatement: boolean;
  hasObservableResult: boolean;
  hasRuleOutConclusion: boolean;
  failingChecks: Array<
    "missing_theory_statement" |
    "missing_observable_result" |
    "missing_rule_out_conclusion"
  >;
}
```

Recommended helper:

```ts
export const resolveDiscriminatingTestValidityState = (
  chapter: ProseChapter,
  stageContractCheck?: StageContractCheck,
): DiscriminatingTestValidityState => { ... };
```

Implementation rule:

- the validator and deterministic DT patch should both consume this

### C. Chapter repair context

Recommended shape:

```ts
export interface ChapterRepairContext {
  chapterNumber: number;
  scene: any;
  sceneCount: number;
  stageMode: StageModeKey;
  investigatorName: string;
  culpritName?: string;
  suspectNames: string[];
  requiredClueSummaries: string[];
  matchingClearances: Array<{
    suspect_name: string;
    clearance_method?: string;
    supporting_clues?: string[];
  }>;
}
```

Recommended helper:

```ts
export const buildChapterRepairContext = (args: {
  chapterNumber: number;
  scene: any;
  sceneCount: number;
  cmlCase: any;
  scenes: any[];
  dtSceneCheck: any;
  ledgerEntry?: ChapterRequirementLedgerEntry;
  clueDistribution?: ClueDistributionResult;
  matchingClearances?: MatchingClearance[];
}): ChapterRepairContext => { ... };
```

### D. Post-pass polish result

Recommended shape:

```ts
export interface PostPassPolishResult {
  chapter: ProseChapter;
  applied: boolean;
  keptPolishedVersion: boolean;
  rollbackReason?: "validation_regression" | "obligation_regression" | "quality_no_gain";
}
```

Recommended helper:

```ts
export const polishPassingChapter = (args: {
  chapter: ProseChapter;
  repairContext: ChapterRepairContext;
  ledgerEntry?: ChapterRequirementLedgerEntry;
  clueDistribution?: ClueDistributionResult;
  caseData: CaseData;
  castNames?: string[];
}): Promise<PostPassPolishResult> => { ... };
```

Implementation rule:

- polish is optional and quality-only
- original passing chapter remains the fallback if anything regresses

### E. Narrative balance profile

Recommended shape:

```ts
export interface NarrativeBalanceProfile {
  mode: StageModeKey;
  targets: Record<string, {
    min_pct: number;
    max_pct: number;
  }>;
}
```

Recommended helpers:

```ts
export const getNarrativeBalanceProfile = (
  mode: StageModeKey,
): NarrativeBalanceProfile => { ... };

export const buildNarrativeBalanceBlock = (
  mode: StageModeKey,
): string => { ... };
```

Optional later helper:

```ts
export interface NarrativeBalanceAssessment {
  mode: StageModeKey;
  hints: string[];
  dominantFocus?: string;
  underrepresentedFocus?: string[];
}

export const assessNarrativeBalanceSignals = (
  chapter: ProseChapter,
  mode: StageModeKey,
): NarrativeBalanceAssessment => { ... };
```

Implementation rule:

- use balance assessment for soft feedback only
- do not hard-fail chapters for missing an approximate percentage mix

### F. Top-level deterministic repair result

Recommended shape:

```ts
export interface DeterministicRepairResult {
  chapter: ProseChapter;
  appliedRepairs: string[];
  insertedClueIds: string[];
  insertedEarlyClueIds: string[];
  insertedSuspects: string[];
  insertedDiscriminatingTest: boolean;
}
```

Recommended helper:

```ts
export const repairChapterDeterministically = (args: {
  chapter: ProseChapter;
  repairContext: ChapterRepairContext;
  ledgerEntry?: ChapterRequirementLedgerEntry;
  clueDistribution?: ClueDistributionResult;
  caseData: CaseData;
  castNames?: string[];
}): DeterministicRepairResult => { ... };
```

## 12.3 Detailed Patch Sequence

### Patch 1 - add validator-state helpers only

Files:

- `clue-validation.ts`
- tests

Changes:

- add `ClueObligationState`
- add `DiscriminatingTestValidityState`
- implement new helpers
- do not change `generate.ts` yet
- add direct unit tests for new helpers

Why first:

- lowest-risk change
- creates the source of truth needed for every later patch

Acceptance:

- tests pass
- no runtime behavior change yet

### Patch 2 - wire validator to shared helpers

Files:

- `clue-validation.ts`
- tests

Changes:

- refactor `validateChapterPreCommitObligations(...)` to call:
  - `resolveClueObligationState(...)`
  - `resolveDiscriminatingTestValidityState(...)`
- keep error messages stable where possible

Acceptance:

- existing tests still pass
- any changed test output should be intentional and documented

### Patch 3 - fix DT repair skip logic

Files:

- `generate.ts`
- tests

Changes:

- replace regex-only skip in `applyDeterministicDiscriminatingTestPatch(...)`
- use `resolveDiscriminatingTestValidityState(...)`
- only skip when `isValid === true`

Acceptance:

- add regression: incidental marker words no longer prevent DT insertion

### Patch 4 - fix prose-facing DT evidence rendering

Files:

- `generate.ts` or `deterministic-repair.ts` if extraction has started
- tests

Changes:

- replace `evidenceClueIds.join(", ")`
- resolve IDs through:
  - clue description
  - clue points-to
  - obligation context
  - neutral fallback phrase

Acceptance:

- add regression asserting no `clue_*` token appears in patched prose under normal fixture data

### Patch 5 - align clue materializer with validator clue state

Files:

- `generate.ts`
- `clue-validation.ts`
- tests

Changes:

- replace local missing/early logic with `resolveClueObligationState(...)`
- suppress insertion when `isMetadataOnly === true`
- only inject early repair when `isPresent === true` but `isEarlyEnough === false`

Acceptance:

- add regression for mapping-only clue case
- add regression for late-but-present early clue case

### Patch 6 - extract deterministic repair module

Files:

- new `deterministic-repair.ts`
- `generate.ts`
- `types.ts`
- tests

Changes:

- move deterministic helpers out of `generate.ts`
- re-export or import directly as needed
- keep function signatures stable during move

Acceptance:

- no behavior change
- smaller `generate.ts`
- all tests and build pass

### Patch 7 - add chapter repair context

Files:

- `deterministic-repair.ts`
- `generate.ts`
- `types.ts`

Changes:

- add `buildChapterRepairContext(...)`
- replace repeated stage mode / culprit / suspect / investigator derivation in:
  - normal chapter loop
  - expansion repair path
  - fallback path

Acceptance:

- same functional behavior
- reduced repeated blocks in `generate.ts`

### Patch 8 - canonical retry brief

Files:

- new `retry-brief.ts`
- `generate.ts`
- tests

Changes:

- move retry prompt assembly into one builder
- make phase routing internal to that builder
- keep current retry packet semantics

Acceptance:

- one top-level retry brief per retry
- no duplicate major checklist blocks

### Patch 9 - canonicalize narrative-balance guidance

Files:

- `prompt-builder.ts`
- `generation-params.ts`
- optional new `narrative-balance.ts`
- tests

Changes:

- make `stage_modes.*.balance_targets` the single runtime balance source
- stop emitting a second overlapping chapter-phase percentage block in the prompt
- keep any chapter-phase table only as config fallback or non-runtime reference
- if desired, add a soft balance assessment helper for retry / polish hints

Acceptance:

- prompts emit one active narrative-balance profile only
- `aftermath_consequence` no longer inherits `final_reveal` composition guidance by accident
- balance guidance vocabulary is shared across prompt, retry, and polish flows

### Patch 10 - add validator-guarded post-pass polish

Files:

- new `post-pass-polish.ts` or helper area inside `generate.ts` for the first pass
- `generate.ts`
- tests

Changes:

- after a chapter passes validation, optionally send the full chapter to a polish-only prompt
- require minimal edits and hard preservation of clues, clearances, DT logic, ordering, and facts
- revalidate the edited chapter
- keep polished output only when it still passes and does not weaken obligations

Acceptance:

- polish improves style without reopening full-generation drift
- original passing chapter is restored automatically on regression

## 12.3.1 Coding Notes Validated Against Current Structure

These notes are intended to reduce implementation drift by respecting the current code layout.

### A. Stage-mode logic

Keep:

- `resolveStageModeKey(...)`
- `mapStageModeToCompositionPhase(...)`

as the authoritative mode selectors unless there is a strong reason to relocate them.

Why:

- they are already reused across prompt-building and generation-related flow
- repeated fallback-stage derivation in `generate.ts` should call into this logic, not replace it

### B. Narrative-balance canonicalization

Recommended implementation path:

- first, keep `buildStageModeContractBlock(...)` as the home of active balance guidance
- then remove the second `buildChapterCompositionTargetsBlock(...)` runtime percentage block
- if extraction helps readability, move only the balance-specific rendering into `narrative-balance.ts`

Why:

- this minimizes prompt-shape churn
- it avoids rewriting more of `prompt-builder.ts` than necessary

### C. Retry-brief work

Recommended implementation path:

- preserve:
  - retry phase classification
  - terminal-retry override behavior
  - `currentRetryPacket` semantics
- change only the final assembly shape first

Why:

- current retry logic carries real behavior, not just prompt text
- the safest first win is removing stacked narrative blocks without changing retry routing policy

### D. Post-pass polish integration point

Recommended implementation path:

- integrate polish only after the chapter has already passed the same validation path used for commit
- reuse the same candidate-evaluation / obligation-validation path already used during generation acceptance
- polish before final commit, not after persisted storage

Why:

- this avoids creating a second acceptance standard
- it keeps rollback local and deterministic

### E. Deterministic-repair extraction

Recommended implementation path:

- move helper logic after behavior-changing correctness patches have landed
- keep public call-site signatures stable during the extraction patch
- avoid mixing extraction with new prose wording changes unless already covered by tests

Why:

- `generate.ts` currently contains both orchestration and behavior
- extraction is safer once validator-aligned behavior is already pinned

## 12.4 Exact Replacement Targets in Prompt / Generation Flow

### A. DT patch skip logic

Current behavior to replace:

- local marker regex pre-check

Replace with:

- call to `resolveDiscriminatingTestValidityState(...)`

### B. Clue patch missing logic

Current behavior to replace:

- local `chapterMentionsRequiredClue(...)` / `chapterClueAppearsEarly(...)` combination inside deterministic repair helpers

Replace with:

- `resolveClueObligationState(...)`

### C. Repeated stage-context derivation

Current repeated blocks to replace:

- stage mode derivation in normal validation path
- stage mode derivation in expansion path
- stage mode derivation in fallback path
- culprit / suspect / investigator resolution in multiple places

Replace with:

- `buildChapterRepairContext(...)`

### D. Retry prompt composition

Current behavior to replace:

- `buildSinglePassRetryPrompt(...)` + `buildEnhancedRetryFeedback(...)` + `buildRetryFeedback(...)` assembly in `generate.ts`

Replace with:

- `buildCanonicalRetryBrief(...)`

### E. Narrative-balance guidance

Current behavior to replace:

- `buildStageModeContractBlock(...)` emits one balance table
- `buildChapterCompositionTargetsBlock(...)` emits a second nearby table

Replace with:

- one canonical `buildNarrativeBalanceBlock(activeMode)` call

### F. Passing-chapter quality improvement

Current behavior to add:

- no dedicated second-pass editor for chapters that already pass

Add:

- `polishPassingChapter(...)`
- validator-guarded keep-or-rollback logic

## 12.5 Test Cases to Implement

### A. DT false-skip

Fixture:

- chapter includes words like `either`, `result`, `observation`
- chapter does not actually express competing theories and explicit prove-vs-rule-out logic

Assert:

- validator state returns invalid
- DT patch inserts

### B. DT already valid

Fixture:

- chapter has actual theory statement, observable result, and rule-out conclusion

Assert:

- validator state returns valid
- DT patch skips

### C. DT no raw IDs

Fixture:

- CML includes `evidence_clues: ["clue_clock", "clue_cup"]`
- clue distribution contains human-readable descriptions

Assert:

- patched prose contains descriptions
- patched prose does not contain `clue_clock` or `clue_cup`

### D. Mapping-only clue no filler

Fixture:

- clue exists only via mapping / delivery metadata
- validator would accept metadata-only case

Assert:

- clue patch does not insert filler paragraphs

### E. Early clue late-only case

Fixture:

- clue appears in paragraph 4 but must appear in paragraph 1-2

Assert:

- `resolveClueObligationState(...)` returns `isPresent=true`, `isEarlyEnough=false`
- clue patch inserts early observation/inference repair

### F. Canonical retry brief

Fixture:

- mixed logic + quality retry

Assert:

- one top-level brief
- one explicit mode
- no repeated checklist headings

### G. Narrative-balance canonicalization

Fixture:

- a `suspect_pressure` chapter in mid-story
- prompt currently would have emitted both stage-mode and chapter-phase percentage tables

Assert:

- prompt emits one active balance block only
- the active block uses stage-mode vocabulary
- no `final_reveal` evidence-chain mix appears in aftermath chapters

### H. Post-pass polish preservation

Fixture:

- chapter already passes validation
- polish prompt makes local phrasing edits

Assert:

- polished version still passes
- required clue / DT / clearance obligations remain intact
- if a polish variant drops any required obligation, the original chapter is kept

## 12.5.1 Verification Commands and Gates

Recommended verification sequence after each patch or grouped wave:

1. Focused prompt/validator tests

```powershell
npm run -w @cml/prompts-llm test -- agent9-prose
```

2. Package build for prompt code

```powershell
npm run -w @cml/prompts-llm build
```

3. Story-validation tests/build when shared validation/config code changes

```powershell
npm run -w @cml/story-validation test
npm run -w @cml/story-validation build
```

4. Optional worker tests if orchestration behavior changes materially

```powershell
npm run -w @cml/worker test
```

5. Optional end-to-end canary after the prompt/validator waves are stable

```powershell
npm run canary:agent9
```

Expected gates:

- no regression in `agent9-prose` tests
- prompt-builder compiles cleanly after narrative-balance or retry-brief changes
- story-validation compiles cleanly after shared config or mode-mapping changes
- canary only after correctness patches are stable and credentials/runtime environment are available

## 12.6 Cleanup Tasks After Each Patch

After every patch:

1. run focused tests
2. run package build
3. inspect diff for duplicated helper logic
4. remove dead regex or dead helper code when replacements are stable

Specific cleanup to expect:

- remove duplicate DT marker regexes if validator-state helper replaces them completely
- remove clue-state logic duplicated between validator and deterministic repair
- remove context-derivation clones after `buildChapterRepairContext(...)` lands

## 12.7 Suggested Commit / PR Breakdown

Recommended breakdown:

1. `agent9: add shared clue and dt validation state helpers`
2. `agent9: make discriminating test repair validator-driven`
3. `agent9: render deterministic dt evidence with prose-facing descriptions`
4. `agent9: align clue materializer with shared clue obligation state`
5. `agent9: extract deterministic repair module`
6. `agent9: introduce shared chapter repair context`
7. `agent9: canonicalize narrative balance guidance`
8. `agent9: replace layered retry prompts with canonical retry brief`
9. `agent9: add validator-guarded post-pass polish for passing chapters`

Why this breakdown:

- each change is reviewable
- regressions are easier to isolate
- behavior changes are separated from refactor-only moves

## 12.8 Risks During Implementation

Main risks:

- changing validator semantics accidentally while extracting shared helpers
- making deterministic prose too rigid or repetitive while improving correctness
- over-refactoring `generate.ts` before the validator-driven fixes are stable
- over-interpreting soft composition guidance as if it were a strict validator
- allowing a polish pass to silently delete or soften already-satisfied obligations

Mitigations:

- keep behavior-changing patches small
- add direct helper tests before call-site rewrites
- move code only after semantic parity is proven
- keep narrative-balance assessment advisory unless a later scoring study proves it is reliable
- always revalidate polished chapters and keep the pre-polish version as the safe fallback

## 12.9 Definition of Done for the Code Work

The code portion of `ANALYSIS_40` is done when:

- DT repair uses validator-compatible state
- deterministic prose uses prose-facing evidence descriptions
- clue materializer and validator share one obligation-state model
- deterministic repair helpers live outside `generate.ts`
- narrative-balance guidance is canonicalized into one runtime source
- retry prompt assembly is canonicalized
- passing-chapter polish is guarded by validation and rollback
- focused tests and builds pass
- fresh prompt-log runs show lower retry churn and fewer late-chapter structural failures

## 13. Blue-Sky / Easy-Win Ideas

These are lower-risk ideas that may produce quality gains without changing the core architecture dramatically.

### 13.1 Validator-guarded post-pass polish

Why it is attractive:

- likely improves prose quality more safely than extra generation retries
- easy to gate with full rollback
- works especially well once correctness fixes are already in place

Recommendation:

- treat this as the highest-value "easy win" after Phase 1 correctness work

### 13.2 Targeted micro-polish only for deterministic inserts

Idea:

- instead of polishing the whole passing chapter, send only the deterministic inserted paragraphs plus one paragraph of surrounding context

Why it may help:

- lowers the chance of breaking validated chapter structure
- directly addresses the most mechanical-sounding prose
- cheaper and easier to diff than full-chapter polishing

Tradeoff:

- smaller upside than full-chapter polish
- transitions may still remain uneven at the chapter level

### 13.3 Obligation lock block for all repair/editor prompts

Idea:

- prepend a compact "DO NOT CHANGE" block listing clue descriptions, suspect clearances, DT facts, and chapter-order constraints

Why it may help:

- likely helps both retry passes and polish passes
- easy to implement
- improves consistency even before larger refactors land

Tradeoff:

- if overlong, it can become just another prompt layer

### 13.4 Sentence-level diff guard

Idea:

- reject a polish output if it deletes too much chapter content or removes lines containing obligation-bearing tokens

Why it may help:

- simple mechanical guardrail
- catches some regressions before full semantic scoring is needed

Tradeoff:

- heuristic, not sufficient on its own

## 14. Validation Pass Against Current Code

This section records which `ANALYSIS_40` claims were directly validated against current code and which remain forward-looking design proposals.

### 14.1 Directly validated findings

Validated against the current implementation:

- DT false-skip risk is real:
  - `applyDeterministicDiscriminatingTestPatch(...)` still uses broad theory/proof marker regexes to skip insertion
  - the validator uses a stronger discriminating-test contract
- Raw clue-ID leakage is real:
  - deterministic DT prose still renders `evidenceClueIds.join(", ")`
- Mapping-only / delivery-method mismatch is real:
  - validator includes fallback handling that the deterministic clue materializer does not fully share
- Retry stacking is real:
  - retry assembly still layers `buildSinglePassRetryPrompt(...)`, `buildEnhancedRetryFeedback(...)`, and `buildRetryFeedback(...)`
- Narrative-balance duplication is real:
  - prompt construction emits both stage-mode balance targets and chapter-phase composition targets
  - these can differ for the same chapter
- Shared chapter-context extraction is justified:
  - stage-mode and suspect/context derivation logic is repeated in normal validation, fallback, and later fallback/repair paths

### 14.2 Validated design pressure, but helper names remain proposed

The need is code-validated, but the exact helper/module names below are still implementation proposals:

- `resolveClueObligationState(...)`
- `resolveDiscriminatingTestValidityState(...)`
- `repairChapterDeterministically(...)`
- `buildCanonicalRetryBrief(...)`
- `polishPassingChapter(...)`
- `getNarrativeBalanceProfile(...)`
- `buildNarrativeBalanceBlock(...)`

Interpretation:

- the architectural pressure is real
- the exact API boundaries should still be refined during implementation

### 14.3 Forward-looking recommendations rather than confirmed defects

These are recommended additions, not current code bugs in the same sense as the items above:

- validator-guarded post-pass polish
- targeted micro-polish for deterministic inserts
- sentence-level diff guard
- soft narrative-balance assessment for retry/polish hinting

These belong in the plan because they likely improve quality, but they should be framed as quality architecture, not as defect fixes.

### 14.4 Validation result for the chapter-composition system

Current state after validation:

- the percentage system does exist in live code
- it is actively emitted into prompts
- it is duplicated across:
  - stage-mode balance targets
  - chapter-phase composition targets
- it is not currently enforced by validator or scorer

Conclusion:

- keep the idea
- simplify the implementation
- do not pretend the percentages are hard-validated when they are currently advisory only

### 14.5 Overall validation verdict

Overall assessment of `ANALYSIS_40` after this pass:

- the core bug findings are well-grounded in code
- the refactor direction is strong
- the post-pass polish addition is a worthwhile quality extension
- the narrative-balance system should be folded into the plan as a canonicalization task, not left as duplicated prompt guidance

Net result:

- `ANALYSIS_40` is validated enough to guide implementation
- the highest-confidence behavior fixes remain Phase 1
- the highest-confidence prompt-architecture cleanup after Phase 1 is narrative-balance canonicalization plus retry-brief simplification
