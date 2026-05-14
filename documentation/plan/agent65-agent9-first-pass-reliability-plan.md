# Agent65 and Agent9 First-Pass Reliability Plan

Date: 2026-05-14
Owner: CML pipeline engineering

Primary references:
- documentation/prompts/actual/run_20260513-2211_mystery/15_Agent65-WorldBuilder_response.md
- documentation/prompts/actual/run_20260513-2211_mystery/16_Agent65-WorldBuilder_retry1_request.md
- documentation/prompts/actual/run_20260513-2115_mystery/16_Agent65-WorldBuilder_retry2_request.md
- documentation/prompts/actual/run_20260513-2220_mystery/15_Agent65-WorldBuilder_response.md
- documentation/analysis/canary-run-p2-20260512-analysis.md
- packages/prompts-llm/src/agent65-world-builder.ts
- packages/prompts-llm/src/agent9-prose.ts
- packages/story-validation/src/scoring/phase-scorers/agent65-world-builder-scorer.ts
- apps/worker/src/jobs/mystery-orchestrator.ts

## 1) Goal

1. Eliminate avoidable Agent65 retries caused by missing required structural fields.
2. Record a second-pass assessment of why Agent9 prose does not reliably pass on the first try.
3. Separate prompt-contract problems from deterministic-processing problems.
4. Decide whether model self-validation should be added, and if so, where it helps versus where it adds cost without real reliability gains.

## 2) Reliability framing

## 2.1 What can be guaranteed

1. Agent65 can deterministically repair a known class of first-pass structural omissions before schema validation.
2. Agent65 can guarantee presence of required top-level structural objects even when the model omits them.
3. Agent9 can be made more reliable on first pass by reducing retry-packet overload and by preferring deterministic enforcement for structural requirements.

## 2.2 What cannot be guaranteed

1. No prompt-only design can guarantee first-pass success for all Agent9 prose outputs because the prose task remains probabilistic and style-sensitive.
2. LLM self-validation cannot replace deterministic validation for schema, cast-order, clue-coverage, template-linter, or fair-play gates.

## 3) Pass 1 findings

## 3.1 Agent65 actual-run evidence

1. Across recent actual runs, Agent65 usually retries once and occasionally twice before succeeding.
2. The dominant first-attempt failure is not semantic quality; it is schema failure on required missing fields.
3. The most common first-pass schema error is:
   - `validationConfirmations is required`
4. A recurrent second-pass schema error is:
   - `breakMoment is required`
5. Some older runs also show first-pass omission of:
   - `revealImplications`
   - malformed `humourPlacementMap` entries caused by non-object array members
6. At least one recent run (`run_20260513-2220_mystery`) succeeded on first pass, which proves the issue is frequent rather than absolute.

## 3.2 Agent65 code-path root cause

1. `packages/prompts-llm/src/agent65-world-builder.ts` says deterministic repair happens before validation.
2. In practice, the current implementation only strips non-object items from two arrays before schema validation.
3. Structural repair for `validationConfirmations`, `breakMoment`, `revealImplications`, and malformed `humourPlacementMap` happens too late or not at all.
4. Because schema validation runs before those repairs, the model burns a retry on omissions that are already safe to repair deterministically.

## 3.3 Agent9 actual-run evidence

1. Agent9 first-pass failures are dominated by template-linter and obligation-satisfaction issues, not raw schema issues.
2. The documented canary failure pattern is strongest in late-act confrontation chapters:
   - repeated long paragraph fingerprint
   - high n-gram overlap
   - incomplete or weak discriminating-test execution
3. Chapters 2, 3, 8, and 9 show the same basic failure family, with Chapter 9 the hardest to recover.

## 4) Pass 2 findings

## 4.1 Agent65 second-pass conclusion

1. Agent65 should treat top-level structural completeness as deterministic infrastructure, not as an LLM compliance problem.
2. The correct fix is a pre-schema normalizer that:
   - creates missing required objects
   - strips malformed array members from all relevant arrays
   - fills humour map coverage before schema
   - ensures `storyEmotionalArc` and `breakMoment` always exist
   - ensures `validationConfirmations` always exists
3. This does not weaken safety, because downstream gates still enforce cast coverage, content floors, and scorer thresholds.

## 4.2 Agent9 second-pass conclusion

1. Agent9 is suffering from retry-packet overload plus scene-type rigidity.
2. The prompt is trying to do too many things at once in a single generation:
   - clue obligations
   - suspect clearance
   - discriminating-test choreography
   - atmosphere grounding
   - continuity bridge
   - sensory obligations
   - anti-template rewrites
3. When several repair directives activate together, the model tends to satisfy explicit checklist items while collapsing into boilerplate confrontation prose.
4. The retry path is strongest at enforcing required content, but weaker at forcing structural variation from prior failed attempts.
5. There is already significant procedural complexity in `buildEnhancedRetryFeedback()`, including banned-paragraph and near-duplicate injections. The remaining problem is not missing feedback channels; it is that the model still defaults to a stable accusation-scene scaffold.

## 4.3 Unit-test signal

1. Current targeted baseline shows Agent65-focused tests pass.
2. A pre-existing Agent9 test currently fails on obligation-block wording expectations.
3. That failure is separate from the Agent65 fix and should be treated as existing instability in the Agent9 prompt surface.

## 5) Decision on LLM self-validation

## 5.1 Recommended position

Use LLM self-checks only as a bounded prompt aid, not as a control mechanism.

## 5.2 Where it helps

1. Agent65: a final internal self-check instruction is harmless but low value because deterministic normalization can do better.
2. Agent9: a short internal checklist reminder before finalizing a chapter can help with obligation completeness, especially for discriminating-test chapters.

## 5.3 Where it should not be trusted

1. Schema completeness
2. Cast order and exact-name parity
3. Humour map completeness
4. Template-linter uniqueness
5. Clue visibility timing
6. Fair-play legality

## 5.4 Recommendation

1. Do not add a separate extra LLM validation call after every try for Agent65.
2. Do not add a full second-model validator after every Agent9 try as the default path.
3. If self-validation is added at all, keep it inline and cheap:
   - a single “before returning, verify all mandatory obligations are present” contract block
   - no extra network round-trip
4. Prefer deterministic post-generation validators and repair layers over extra LLM validation passes.

## 6) Workstreams

## WS1 - Agent65 deterministic first-pass structural repair

Primary files:
1. packages/prompts-llm/src/agent65-world-builder.ts
2. packages/prompts-llm/src/__tests__/agent65-world-builder.test.ts

Tasks:
1. Add a pre-schema structural normalizer for required top-level fields.
2. Ensure malformed `humourPlacementMap` arrays are sanitized before schema validation.
3. Ensure `validationConfirmations` and `breakMoment` are synthesized before schema validation.
4. Ensure fallback `storyEmotionalArc` exists before length-floor enforcement.

Exit criteria:
1. Known first-pass schema omissions no longer consume a retry.

## WS2 - Agent9 first-pass reliability assessment and design follow-up

Primary files:
1. packages/prompts-llm/src/agent9-prose.ts
2. apps/worker/src/jobs/mystery-orchestrator.ts
3. documentation/analysis/*

Tasks:
1. Reduce retry-packet overload by distinguishing structural must-fix items from stylistic anti-template instructions.
2. Add scene-type-specific variation directives for late-act confrontation chapters.
3. Consider a stronger first-pass anti-boilerplate contract for accusation/reveal scenes.
4. Evaluate whether template-linter thresholds should be act-aware rather than globally uniform.

Exit criteria:
1. Chapter-first-pass failures shift away from repeated fingerprint / n-gram overlap loops.

## WS3 - Observability

Tasks:
1. Keep documenting first-pass versus retry-invoked outcomes per agent.
2. Record exact first-pass failure classes in canary summaries so prompt fixes can be compared against deterministic fixes.

## 7) Acceptance criteria

1. Agent65 no longer retries on the known structural omission family:
   - missing `validationConfirmations`
   - missing `breakMoment`
   - missing `revealImplications`
   - malformed `humourPlacementMap` array members
2. Agent65 targeted tests cover the new deterministic normalization path.
3. The findings document captures both the first-pass evidence and the second-pass assessment.
4. Agent9 recommendations remain explicitly split into:
   - prompt-contract changes
   - procedural/deterministic fixes
   - optional inline self-check guidance
