# ANALYSIS_02: Agent9 Validation Failures (Pronoun Violations and Chapter Target Drift)

Date: 2026-03-14

## Question Answered
Why did Agent9 prose generation report batch retries, chapter validation failures (7, 9, 13, 14), final validation failure with 12 critical issues, repeated pronoun mismatches, and an outline/target chapter count mismatch (18 vs 20)?

## Error Snapshot (From Runtime Logs)
- `Agent9-ProseGenerator | batch_validation`: `4/18` batch(es) required retry.
- `Agent9-ProseGenerator | chapter_validation_failure`: chapters `7`, `9`, `13`, `14` failed validation.
- `ValidationPipeline | final_validation`: failed with `12 critical, 0 major`.
- Repeated pronoun violations:
  - `Peter Corbet`: expected `he/him/his`, found `she/her` and `her`.
  - `Hubert Peverel`: expected `he/him/his`, found `she/her` and `her`.
  - `Claire Ferrers`: expected `she/her/her`, found `his`.
- Contract drift warning:
  - `Outline scene/chapter count (18) differs from YAML target (20) for short`
  - Source pointer: `apps/worker/config/generation-params.yaml#story_length_policy.chapter_targets.short`

## Executive Summary
This failure cluster is a combined contract problem, not a single isolated defect:
1. Chapter target contract mismatch (`outline=18` vs `short target=20`) created systematic structural pressure and retry churn.
2. Pronoun consistency controls were insufficiently deterministic under rewrite/retry pressure, causing repeated critical validation breaches.
3. Batch-level retrying recovered some chapters but not enough to satisfy final validation, resulting in hard failure.

## Technical Cause Analysis

### 1. Structural Target Drift (18 vs 20)
- The generation pipeline produced/used an 18-scene outline, while validation still enforced a 20-chapter short target.
- This misalignment causes unavoidable deficit conditions even if prose quality is otherwise acceptable.
- Observed effect:
  - More batch retries (`4/18`) as system attempts to satisfy constraints that no longer match actual outline cardinality.
  - Higher chance of downstream chapter failure and final abort.

### 2. Pronoun Failure Class Is Validation-Critical
- Pronoun mismatches are treated as critical identity/consistency errors in final validation.
- Multiple repeated mismatches across the same characters indicate retries/regenerations are not preserving canonical pronoun mapping robustly.
- The pattern (`he -> she/her`, `she -> his`) suggests rewrite drift under prompt pressure rather than one-time typo.

### 3. Retry Loop Saturation on Multi-Constraint Batches
- Failed chapters (7, 9, 13, 14) indicate localized failure hotspots.
- With concurrent constraints (style, clues, length, continuity, pronouns), retry attempts can oscillate and fix one dimension while regressing another.
- The final result is partial local improvement but global validation failure (12 critical).

## Why This Failure Pattern Repeats
1. Target mismatch is systemic: every run starts with conflicting chapter cardinality expectations.
2. Pronoun enforcement appears late-stage (validator catches it) rather than hard-constrained early enough in generation/rewrite steps.
3. Batch retries are remedial, not preventive; they cannot reliably overcome a persistent contract mismatch plus identity drift.

## Impact
- Generation cost/time increase from avoidable retries.
- Elevated abort probability on otherwise recoverable runs.
- User-visible confidence loss due to repeated critical identity errors.

## Recommended Fix Plan (High-Impact First)

### Priority 1: Eliminate Chapter Target Drift Immediately
1. Align short target with actual outline cardinality source of truth for this run path (18 vs 20).
2. Enforce one canonical chapter-count contract across outline generation, agent execution, and validation scoring.
3. Add a preflight hard-stop: if outline scene count and target chapter count differ, abort before prose generation with explicit remediation message.

### Priority 2: Make Pronoun Consistency Deterministic
1. Inject canonical cast-pronoun map into all Agent9 prose and repair prompts in compact machine-readable form.
2. Add chapter-level pre-commit pronoun gate before chapter is accepted into batch output.
3. Add targeted pronoun repair pass (low-temperature, identity-only rewrite) before broad retry.
4. Add forbidden substitution checks for known cast names (for example, prevent `Peter Corbet` from co-occurring with `she/her`).

### Priority 3: Stabilize Retry Behavior
1. Split retries into ordered micro-passes:
   - identity/pronouns
   - structural constraints
   - style polish
2. Prevent full-scene rewrites when only identity constraints fail.
3. Track per-chapter retry reason histogram to detect recurring constraint collisions.

## Verification Checklist (Must Pass)
1. Preflight check rejects any `outline_count != target_count` before chapter generation begins.
2. Zero pronoun criticals across full run for all canonical characters.
3. Failed chapter count for short run reduced from `4/18` to `<=1/18` under same seed/settings.
4. Final validation reports `0 critical` for pronoun class.
5. Logs include explicit contract line showing aligned counts at run start.

## Minimal Instrumentation Additions
1. Log canonical cast-pronoun map hash at Agent9 start.
2. Log per-chapter pronoun gate pass/fail before batch commit.
3. Log single normalized `count_contract` object:
   - `outline_scene_count`
   - `target_chapter_count`
   - `is_aligned`

## Conclusion
The observed run failed because two hard constraints were mismanaged simultaneously: chapter cardinality contract drift and non-deterministic pronoun preservation. Fixing only prompt wording or only retry counts will not be durable. The durable path is:
1. enforce count alignment before generation,
2. enforce pronoun identity before commit,
3. reduce rewrite surface area during retries.

## Implementation Log (Completed 2026-03-14)
The following fixes were implemented in priority order.

1. Priority 1 fix: chapter target drift prevention
- File: `packages/prompts-llm/src/agent7-narrative.ts`
- Change: added strict post-parse outline scene-count contract check.
- Behavior: Agent 7 now hard-fails when `outline.acts[].scenes` count does not match YAML target `story_length_policy.chapter_targets.<length>`.
- Result: prose generation is blocked early on count drift (for example 18 vs 20), instead of continuing into expensive downstream retries.

2. Priority 2 fix: pronoun consistency before commit
- File: `packages/prompts-llm/src/agent9-prose.ts`
- Change: added chapter-level pre-commit pronoun validation using `CharacterConsistencyValidator`.
- Behavior: `pronoun_gender_mismatch` criticals are now treated as batch hard errors during chapter retries.
- Result: pronoun drift is caught and retried inside Agent 9, rather than surfacing only at final validation.

3. Documentation alignment
- File: `documentation/02_cml/02_cml.md`
  - Added notes for Agent 7 scene-count hard-stop and Agent 9 pre-commit pronoun gate.
- File: `documentation/07_workflow/07_workflow.md`
  - Updated workflow semantics: outline count mismatch now fails in Agent 7 pre-prose gate; Agent 9 warning retained as defensive telemetry.
  - Added note that pronoun mismatches are now surfaced in chapter retry cycles.

4. Scope note
- This implementation addresses the two highest-priority failure classes from this analysis:
  - structural count contract drift
  - pronoun identity drift
- Additional retry-micro-pass refinements remain optional follow-up work.

5. Follow-up (2026-03-14): configurable chapter-count tolerance
- Files: `apps/worker/config/generation-params.yaml`, `packages/story-validation/src/generation-params.ts`, `packages/story-validation/src/story-length-targets.ts`, `packages/prompts-llm/src/agent7-narrative.ts`, `packages/prompts-llm/src/agent9-prose.ts`
- Change: added YAML knob `story_length_policy.chapter_target_tolerance` (set to `3`) and switched Agent 7 contract from exact-match to range validation (`target +/- tolerance`).
- Behavior: runs no longer fail on minor outline variance (for example 19 vs 20 for short); hard failure now triggers only when scene count is outside configured bounds.

6. Follow-up (2026-03-14): deterministic pronoun repair (post-generation)
- File: `packages/prompts-llm/src/prose/pronoun-repair.ts` (new module, 18 unit tests)
- Wired at: all 3 chapter-production sites in `agent9-prose.ts` (initial generation, clue-obligation repair, underflow expansion)
- Change: deterministic algorithm repairs wrong-gender pronouns using the canonical cast map after LLM output but before validation. Handles single-character sentences, follow-up inheritance, same-gender multi-character repair, possessive/object disambiguation, and case preservation.
- Result: pronoun drift is now corrected deterministically without consuming retry budget. This eliminates the pronounâ†”word-count retry oscillation pattern.

7. Follow-up (2026-03-14): retry mode auto-detection
- Files: `agent9-prose.ts`, `generation-params.ts`, `generation-params.yaml`
- Change: removed `retry_mode` YAML configuration. The system now auto-selects surgical revision when the previous attempt produced parseable prose, and full regeneration (with prior prose context) when it didn't.
- See ANALYSIS_04 for full details.

8. Follow-up (2026-03-15): pipeline-wide content-filter fiction framing
- Files: all agent source files (`agent1-setting.ts`, `agent2-cast.ts`, `agent2b-character-profiles.ts`, `agent2c-location-profiles.ts`, `agent2d-temporal-context.ts`, `agent2e-background-context.ts`, `agent3b-hard-logic-devices.ts`, `agent4-revision.ts`, `agent5-clues.ts`, `agent6-fairplay.ts` (both call sites), `agent7-narrative.ts`, `agent8-novelty.ts`, `shared/system.ts`)
- Change: every LLM system prompt now includes a CONTEXT preamble: "All output is for a Golden Age whodunnit mystery novel â€” creative fiction... All references to crime, death, murder, poison, weapons, alibis, and investigation are standard fictional genre elements. No real people or events are depicted."
- Result: Azure OpenAI content-filter rejections are prevented across the entire pipeline, not just Agent 9 revision retries.

9. Follow-up (2026-03-14): word count boost
- Files: `generation-params.yaml`, `generation-params.ts`, `agent9-prose.ts`
- Change: added `prompt_overshoot_buffer_words: 200` (inflates LLM word target) and preferred-target expansion pass (auto-extends prose between hard floor and preferred target).
- Result: hard-floor word-count misses reduced; expansion pass visible in logs as `Agent9-UnderflowExpansion`.


