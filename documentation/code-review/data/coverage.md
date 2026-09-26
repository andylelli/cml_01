# Test coverage — agent scope

**MEASURED 2026-09-25.** Vitest 2.1.9 + `@vitest/coverage-v8`, statement coverage from the unit suites of `apps/worker`, `packages/prompts-llm` and `packages/story-validation` (the three packages holding the agent code). Tests elsewhere that exercise this code through built `dist/` are not counted, so these are floors. The three known environment-specific test failures ran but did not affect collection.

**Overall: 24,361 of 46,821 statements executed (52.0%).**

## The largest functions

A function-level figure counts every statement inside the function, nested closures included.

| function | location | LOC | cc | statements | executed | coverage |
|---|---|---:|---:|---:|---:|---:|
| `runAgent9` | `apps/worker/src/jobs/agents/agent9-run.ts:3646` | 3,957 | 605 | 3197 | 0 | 0% |
| `generateProse` | `packages/prompts-llm/src/agent9-prose/generate.ts:2052` | 2,661 | 350 | 2106 | 0 | 0% |
| `generateMystery` | `apps/worker/src/jobs/mystery-orchestrator.ts:862` | 1,164 | 160 | 879 | 0 | 0% |
| `runAgent6` | `apps/worker/src/jobs/agents/agent6-run.ts:1394` | 1,139 | 174 | 884 | 303 | 34% |
| `runAgent5` | `apps/worker/src/jobs/agents/agent5-run.ts:3318` | 1,126 | 133 | 959 | 0 | 0% |
| `generateCML` | `packages/prompts-llm/src/agent3-cml.ts:779` | 1,026 | 39 | 814 | 536 | 66% |
| `runAgent7` | `apps/worker/src/jobs/agents/agent7-run.ts:1705` | 978 | 159 | 797 | 0 | 0% |
| `buildChapterObligationBlock` | `packages/prompts-llm/src/agent9-prose/obligation-block.ts:37` | 974 | 82 | 722 | 623 | 86% |
| `buildProsePrompt` | `packages/prompts-llm/src/agent9-prose/prompt-builder.ts:1565` | 943 | 94 | 675 | 539 | 80% |
| `buildEnhancedRetryFeedback` | `packages/prompts-llm/src/agent9-prose/generate.ts:985` | 897 | 65 | 638 | 279 | 44% |
| `reviseCml` | `packages/prompts-llm/src/agent4-revision.ts:397` | 866 | 39 | 697 | 585 | 84% |
| `lintBatchProse` | `packages/prompts-llm/src/agent9-prose/lint.ts:107` | 766 | 152 | 527 | 384 | 73% |
| `buildCluePrompt` | `packages/prompts-llm/src/agent5-clues.ts:611` | 610 | 102 | 322 | 301 | 93% |
| `buildCMLPrompt` | `packages/prompts-llm/src/agent3-cml.ts:192` | 583 | 25 | 114 | 98 | 86% |
| `runAgent3` | `apps/worker/src/jobs/agents/agent3-run.ts:229` | 516 | 83 | 397 | 0 | 0% |
| `designCast` | `packages/prompts-llm/src/agent2-cast.ts:533` | 426 | 54 | 341 | 223 | 65% |
| `generateWorldDocument` | `packages/prompts-llm/src/agent65-world-builder.ts:928` | 339 | 52 | 218 | 0 | 0% |
| `checkCast` | `packages/prompts-llm/src/agent2-cast-checker.ts:129` | 337 | 56 | 292 | 267 | 91% |
| `buildUserRequest` | `packages/prompts-llm/src/agent7-narrative.ts:519` | 333 | 22 | 96 | 92 | 96% |
| `normaliseCastOutput` | `apps/worker/src/jobs/agents/agent2-run.ts:79` | 330 | 67 | 265 | 0 | 0% |
| `runAgent3b` | `apps/worker/src/jobs/agents/agent3b-run.ts:282` | 325 | 52 | 243 | 0 | 0% |
| `ScoreAggregator.generateReport` | `packages/story-validation/src/scoring/aggregator.ts:178` | 324 | 59 | 239 | 238 | 100% |
| `buildDeveloperContext` | `packages/prompts-llm/src/agent6-fairplay.ts:368` | 301 | 63 | 183 | 168 | 92% |
| `validateChapterPreCommitObligations` | `packages/prompts-llm/src/agent9-prose/clue-validation.ts:1188` | 291 | 57 | 208 | 112 | 54% |
| `buildRevisionPrompt` | `packages/prompts-llm/src/agent4-revision.ts:133` | 258 | 18 | 79 | 77 | 97% |
| `buildLocationProfilesPrompt` | `packages/prompts-llm/src/agent2c-location-profiles.ts:100` | 245 | 31 | 84 | 0 | 0% |
| `buildCastPrompt` | `packages/prompts-llm/src/agent2-cast.ts:288` | 240 | 25 | 88 | 79 | 90% |
| `runAgent2c` | `apps/worker/src/jobs/agents/agent2c-run.ts:159` | 227 | 56 | 188 | 0 | 0% |
| `repairWordFormLockedFacts` | `apps/worker/src/jobs/agents/agent9-run.ts:886` | 216 | 36 | 156 | 116 | 74% |
| `applyDeterministicCluePreAssignment` | `apps/worker/src/jobs/agents/agent7-run.ts:983` | 207 | 49 | 175 | 165 | 94% |
| `enforceVictimRoleInvariant` | `apps/worker/src/jobs/agents/agent2-run.ts:429` | 205 | 52 | 162 | 135 | 83% |
| `runAgent2` | `apps/worker/src/jobs/agents/agent2-run.ts:686` | 204 | 34 | 173 | 0 | 0% |
| `generateExplicitClueRequirements` | `packages/prompts-llm/src/agent5-clues.ts:291` | 202 | 22 | 167 | 146 | 87% |
| `extractClues` | `packages/prompts-llm/src/agent5-clues.ts:1281` | 199 | 29 | 169 | 135 | 80% |
| `buildHardLogicDevicePrompt` | `packages/prompts-llm/src/agent3b-hard-logic-devices.ts:318` | 198 | 13 | 44 | 39 | 89% |
| `buildTemporalContextPrompt` | `packages/prompts-llm/src/agent2d-temporal-context.ts:123` | 195 | 15 | 49 | 1 | 2% |
| `buildWorldBriefBlock` | `packages/prompts-llm/src/agent9-prose/prompt-builder.ts:192` | 195 | 75 | 159 | 43 | 27% |
| `buildDeveloperContext` | `packages/prompts-llm/src/agent7-narrative.ts:230` | 189 | 40 | 110 | 108 | 98% |
| `enforceAgent5DeterministicContracts` | `apps/worker/src/jobs/agents/agent5-run.ts:3110` | 173 | 26 | 134 | 83 | 62% |
| `repairCaseSoundness` | `packages/prompts-llm/src/case-soundness-repair.ts:69` | 171 | 43 | 136 | 134 | 99% |
| `adaptProseForScoring` | `apps/worker/src/jobs/scoring-adapters/agent9-scoring-adapter.ts:439` | 170 | 23 | 146 | 122 | 84% |
| `runAgent1` | `apps/worker/src/jobs/agents/agent1-run.ts:21` | 168 | 21 | 150 | 0 | 0% |
| `runDeterministicStructuralAudit` | `apps/worker/src/jobs/agents/agent6-run.ts:687` | 162 | 26 | 129 | 111 | 86% |
| `runRubricScoring` | `apps/worker/src/jobs/mystery-orchestrator.ts:650` | 162 | 19 | 89 | 0 | 0% |
| `applyPromptBudgeting` | `packages/prompts-llm/src/agent9-prose/prompt-builder.ts:1398` | 160 | 13 | 79 | 70 | 89% |
| `applyAgent5ContractsToRegeneratedClues` | `apps/worker/src/jobs/agents/agent6-run.ts:465` | 158 | 20 | 141 | 51 | 36% |
| `buildWorldBuilderUserMessage` | `packages/prompts-llm/src/agent65-world-builder.ts:308` | 158 | 6 | 17 | 0 | 0% |
| `buildDiscriminatingTestChecklist` | `packages/prompts-llm/src/agent9-prose/discriminating.ts:89` | 157 | 28 | 118 | 92 | 78% |
| `ensureCriticalFairPlayBackstopClues` | `apps/worker/src/jobs/agents/agent6-run.ts:982` | 156 | 44 | 133 | 123 | 92% |
| `buildFirstAppearanceContractsBlock` | `packages/prompts-llm/src/agent9-prose/prompt-builder.ts:495` | 153 | 68 | 139 | 115 | 83% |
| `applyDeterministicProsePostProcessing` | `apps/worker/src/jobs/agents/agent9-run.ts:2721` | 152 | 3 | 119 | 81 | 68% |
| `refineSetting` | `packages/prompts-llm/src/agent1-setting.ts:225` | 151 | 18 | 125 | 0 | 0% |
| `synchronizeClueTraceabilityFromCurrentClues` | `apps/worker/src/jobs/agents/agent6-run.ts:1216` | 143 | 50 | 120 | 116 | 97% |
| `synthesizeStrictStepCoverageBackstopClues` | `apps/worker/src/jobs/agents/agent5-run.ts:2848` | 127 | 44 | 106 | 97 | 92% |
| `remapMissingDiscriminatingEvidenceIdsToExistingClues` | `apps/worker/src/jobs/agents/agent5-run.ts:368` | 115 | 44 | 89 | 81 | 91% |
| `buildTemporalContextBlock` | `packages/prompts-llm/src/agent9-prose/prompt-blocks.ts:455` | 97 | 54 | 97 | 79 | 81% |
| `summarizeCML` | `packages/prompts-llm/src/agent8-novelty.ts:137` | 75 | 41 | 62 | 61 | 98% |

## Files (by code lines)

| file | code lines | statements | coverage |
|---|---:|---:|---:|
| `apps/worker/src/jobs/agents/agent9-run.ts` | 5,805 | 5583 | 29% |
| `packages/prompts-llm/src/agent9-prose/generate.ts` | 3,776 | 3462 | 20% |
| `apps/worker/src/jobs/agents/agent5-run.ts` | 3,648 | 3587 | 59% |
| `apps/worker/src/jobs/agents/agent6-run.ts` | 2,081 | 2025 | 60% |
| `apps/worker/src/jobs/agents/agent7-run.ts` | 1,992 | 1918 | 34% |
| `packages/prompts-llm/src/agent9-prose/prompt-builder.ts` | 1,825 | 1658 | 76% |
| `apps/worker/src/jobs/mystery-orchestrator.ts` | 1,524 | 1290 | 17% |
| `packages/prompts-llm/src/agent3-cml.ts` | 1,464 | 997 | 71% |
| `packages/prompts-llm/src/agent5-clues.ts` | 1,245 | 885 | 90% |
| `packages/prompts-llm/src/agent9-prose/clue-validation.ts` | 1,115 | 1048 | 72% |
| `packages/prompts-llm/src/agent9-prose/regen-integration.ts` | 1,084 | 925 | 99% |
| `packages/prompts-llm/src/agent65-world-builder.ts` | 1,030 | 780 | 51% |
| `packages/prompts-llm/src/agent4-revision.ts` | 1,018 | 828 | 86% |
| `packages/prompts-llm/src/agent9-prose/deterministic-repair.ts` | 868 | 768 | 87% |
| `packages/prompts-llm/src/agent6-fairplay.ts` | 801 | 473 | 41% |
| `packages/prompts-llm/src/agent7-narrative.ts` | 793 | 422 | 64% |
| `packages/prompts-llm/src/agent9-prose/lint.ts` | 793 | 744 | 76% |
| `packages/prompts-llm/src/agent9-prose/obligation-block.ts` | 765 | 723 | 86% |
| `packages/prompts-llm/src/agent2-cast.ts` | 759 | 552 | 76% |
| `apps/worker/src/jobs/agents/shared.ts` | 704 | 511 | 49% |
| `apps/worker/src/jobs/agents/agent2-run.ts` | 693 | 669 | 22% |
| `packages/story-validation/src/scoring/phase-scorers/agent9-prose-scorer.ts` | 634 | 568 | 80% |
| `apps/worker/src/jobs/agents/agent3-run.ts` | 571 | 556 | 6% |
| `packages/prompts-llm/src/agent9-prose/prompt-blocks.ts` | 549 | 483 | 63% |
| `packages/prompts-llm/src/agent9-prose/post-pass-polish.ts` | 535 | 470 | 91% |
| `packages/prompts-llm/src/agent3b-hard-logic-devices.ts` | 510 | 333 | 50% |
| `packages/prompts-llm/src/utils/name-generator.ts` | 498 | 483 | 0% |
| `apps/worker/src/jobs/scoring-adapters/agent9-scoring-adapter.ts` | 489 | 450 | 91% |
| `packages/prompts-llm/src/agent2c-location-profiles.ts` | 411 | 189 | 0% |
| `packages/story-validation/src/scoring/aggregator.ts` | 399 | 383 | 86% |
| `packages/prompts-llm/src/agent8-novelty.ts` | 398 | 220 | 44% |
| `packages/story-validation/src/scoring/phase-scorers/agent2e-background-scorer.ts` | 397 | 361 | 0% |
| `packages/story-validation/src/scoring/phase-scorers/agent2-cast-scorer.ts` | 380 | 341 | 0% |
| `packages/prompts-llm/src/agent2-cast-checker.ts` | 379 | 331 | 92% |
| `apps/worker/src/jobs/agents/agent3b-run.ts` | 377 | 346 | 16% |
| `packages/story-validation/src/scoring/phase-scorers/agent2d-temporal-context-scorer.ts` | 376 | 359 | 72% |
| `packages/story-validation/src/scoring/phase-scorers/agent7-narrative-scorer.ts` | 366 | 335 | 79% |
| `packages/prompts-llm/src/agent2d-temporal-context.ts` | 362 | 139 | 2% |
| `packages/story-validation/src/scoring/phase-scorers/agent2c-location-profiles-scorer.ts` | 330 | 308 | 0% |
| `packages/story-validation/src/scoring/phase-scorers/agent1-setting-refinement-scorer.ts` | 327 | 303 | 0% |
| `packages/prompts-llm/src/agent9-prose/full-story-diagnostic.ts` | 320 | 267 | 98% |
| `packages/story-validation/src/scoring/phase-scorers/agent2-cast-real-scorer.ts` | 315 | 258 | 94% |
| `packages/story-validation/src/scoring/phase-scorers/agent2b-character-profiles-scorer.ts` | 311 | 285 | 0% |
| `packages/prompts-llm/src/agent1-setting.ts` | 297 | 172 | 27% |
| `packages/prompts-llm/src/index.ts` | 297 | 1 | 0% |
| `packages/prompts-llm/src/agent2b-character-profiles.ts` | 296 | 197 | 0% |
| `apps/worker/src/jobs/agents/agent2c-run.ts` | 291 | 273 | 7% |
| `packages/prompts-llm/src/agent9-prose/repair.ts` | 280 | 265 | 92% |
| `packages/prompts-llm/src/agent9-prose/context-management.ts` | 275 | 254 | 76% |
| `packages/prompts-llm/src/agent9-prose/types.ts` | 272 | 31 | 100% |
| `packages/prompts-llm/src/agent4-patch.ts` | 271 | 218 | 62% |
| `packages/story-validation/src/scoring/scorer-utils.ts` | 268 | 265 | 37% |
| `packages/story-validation/src/scoring/phase-scorers/agent4-hard-logic-scorer.ts` | 267 | 241 | 0% |
| `packages/story-validation/src/scoring/phase-scorers/agent65-world-builder-scorer.ts` | 251 | 222 | 71% |
| `packages/prompts-llm/src/agent9-prose/narrative-balance.ts` | 247 | 228 | 94% |
| `packages/prompts-llm/src/agent2b-voice-capsule.ts` | 241 | 197 | 100% |
| `packages/story-validation/src/scoring/report-invariants.ts` | 240 | 235 | 80% |
| `packages/prompts-llm/src/agent9-prose/phrase-analysis.ts` | 238 | 224 | 45% |
| `apps/worker/src/jobs/agents/agent75-run.ts` | 225 | 211 | 60% |
| `packages/story-validation/src/scoring/retry-manager.ts` | 217 | 192 | 84% |
| `packages/prompts-llm/src/story-bible.ts` | 196 | 127 | 100% |
| `packages/prompts-llm/src/retry-protocol.ts` | 188 | 158 | 76% |
| `packages/prompts-llm/src/agent9-prose/discriminating.ts` | 184 | 177 | 82% |
| `packages/prompts-llm/src/agent2e-background-context.ts` | 180 | 104 | 0% |
| `packages/prompts-llm/src/agent9-prose/sanitization.ts` | 177 | 174 | 53% |
| `packages/prompts-llm/src/asset-library.ts` | 173 | 171 | 26% |
| `packages/prompts-llm/src/case-soundness-repair.ts` | 171 | 164 | 99% |
| `packages/prompts-llm/src/agent9-prose/regen-registry.ts` | 166 | 148 | 100% |
| `apps/worker/src/jobs/agents/agent1-run.ts` | 162 | 151 | 1% |
| `packages/prompts-llm/src/agent3b-plausibility-judge.ts` | 160 | 127 | 44% |
| `packages/prompts-llm/src/agent2c-location-distinctness.ts` | 153 | 137 | 98% |
| `packages/story-validation/src/scoring/ab-prompt-harness.ts` | 146 | 107 | 90% |
| `packages/prompts-llm/src/agent9-prose/regen-repair.ts` | 145 | 88 | 97% |
| `packages/prompts-llm/src/contracts/prose-request-contract.ts` | 145 | 107 | 4% |
| `apps/worker/src/jobs/agents/agent2e-run.ts` | 142 | 126 | 1% |
| `apps/worker/src/jobs/agents/agent6-reveal-gate.ts` | 142 | 109 | 97% |
| `packages/prompts-llm/src/agent9-prose/opening-ideation.ts` | 139 | 121 | 0% |
| `packages/prompts-llm/src/agent9-prose/regen-llm.ts` | 139 | 123 | 100% |
| `packages/prompts-llm/src/types/narrative-state.ts` | 137 | 110 | 20% |
| `packages/prompts-llm/src/shared/schemas.ts` | 135 | 2 | 100% |
| `packages/prompts-llm/src/story-contract.ts` | 133 | 88 | 0% |
| `packages/story-validation/src/scoring/types.ts` | 133 | 0 | not collected |
| `apps/worker/src/jobs/agents/agent9/prose-text.ts` | 132 | 132 | 65% |
| `apps/worker/src/jobs/scoring-adapters/agent7-scoring-adapter.ts` | 127 | 106 | 1% |
| `packages/prompts-llm/src/shared/constraints.ts` | 127 | 83 | 92% |
| `apps/worker/src/jobs/agents/agent2b-run.ts` | 126 | 112 | 1% |
| `packages/prompts-llm/src/contracts/chapter-obligation-contract.ts` | 122 | 97 | 7% |
| `packages/prompts-llm/src/world-state.ts` | 122 | 78 | 100% |
| `packages/prompts-llm/src/mechanism-environment.ts` | 119 | 86 | 100% |
| `packages/prompts-llm/src/agent2c-location-spine.ts` | 118 | 95 | 100% |
| `apps/worker/src/jobs/agents/agent6-escalation-policy.ts` | 110 | 99 | 44% |
| `apps/worker/src/jobs/scoring-adapters/agent1-scoring-adapter.ts` | 110 | 95 | 1% |
| `packages/prompts-llm/src/utils/validation-retry-wrapper.ts` | 106 | 84 | 82% |
| `packages/prompts-llm/src/agent7-narrative-schema.ts` | 103 | 103 | 100% |
| `packages/prompts-llm/src/types.ts` | 101 | 0 | not collected |
| `packages/prompts-llm/src/agent9-prose/banned-phrases.ts` | 100 | 94 | 98% |
| `packages/prompts-llm/src/shared/grounding.ts` | 93 | 85 | 89% |
| `packages/story-validation/src/scoring/index.ts` | 92 | 1 | 0% |
| `packages/prompts-llm/src/prose-brief.ts` | 89 | 57 | 100% |
| `apps/worker/src/jobs/agents/agent2d-run.ts` | 85 | 77 | 1% |
| `packages/prompts-llm/src/shared/locked-fact-atoms.ts` | 84 | 79 | 100% |
| `packages/prompts-llm/src/agent9-prose/prose-blind-reader.ts` | 82 | 64 | 6% |
| `apps/worker/src/jobs/scoring-adapters/agent2d-scoring-adapter.ts` | 81 | 72 | 88% |
| `packages/prompts-llm/src/types/world-document.ts` | 81 | 0 | not collected |
| `packages/story-validation/src/scoring/retry-feedback.ts` | 79 | 78 | 0% |
| `packages/story-validation/src/scoring/thresholds.ts` | 79 | 78 | 100% |
| `packages/prompts-llm/src/agent2e-background-derive.ts` | 78 | 69 | 100% |
| `apps/worker/src/jobs/agents/agent65-run.ts` | 77 | 71 | 1% |
| `packages/story-validation/src/scoring/phase-scorers/agent2c-location-real-scorer.ts` | 75 | 57 | 98% |
| `packages/prompts-llm/src/shared/temporal-anchor.ts` | 74 | 67 | 100% |
| `apps/worker/src/jobs/scoring-adapters/agent2-scoring-adapter.ts` | 72 | 44 | 95% |
| `packages/prompts-llm/src/agent9-prose/repair-efficacy.ts` | 72 | 56 | 14% |
| `packages/prompts-llm/src/shared/system.ts` | 71 | 5 | 100% |
| `packages/story-validation/src/scoring/phase-scorers/agent7-narrative-real-scorer.ts` | 70 | 57 | 100% |
| `packages/story-validation/src/scoring/phase-scorers/agent1-setting-real-scorer.ts` | 69 | 47 | 100% |
| `packages/story-validation/src/scoring/phase-scorers/agent3-cml-real-scorer.ts` | 66 | 63 | 100% |
| `packages/prompts-llm/src/discriminator-verifier.ts` | 65 | 46 | 100% |
| `apps/worker/src/jobs/agents/index.ts` | 60 | 1 | 100% |
| `packages/prompts-llm/src/utils/seed-loader.ts` | 60 | 57 | 81% |
| `apps/worker/src/jobs/scoring-adapters/agent2b-scoring-adapter.ts` | 59 | 46 | 100% |
| `packages/story-validation/src/scoring/phase-scorers/agent2e-background-real-scorer.ts` | 59 | 45 | 96% |
| `packages/prompts-llm/src/agent9-prose/polish-provider.ts` | 58 | 48 | 100% |
| `apps/worker/src/jobs/scoring-adapters/agent2e-scoring-adapter.ts` | 57 | 35 | 3% |
| `apps/worker/src/jobs/scoring-adapters/agent2c-scoring-adapter.ts` | 56 | 42 | 2% |
| `packages/story-validation/src/scoring/honest-scorer.ts` | 50 | 47 | 100% |
| `packages/story-validation/src/scoring/phase-scorers/agent3b-device-real-scorer.ts` | 49 | 37 | 100% |
| `packages/prompts-llm/src/agent9-prose/index.ts` | 44 | 1 | 100% |
| `packages/prompts-llm/src/agent3-discriminating-planting.ts` | 42 | 37 | 95% |
| `packages/prompts-llm/src/contracts/release-gate-audit.ts` | 38 | 0 | not collected |
| `apps/worker/src/jobs/agents/identity-match.ts` | 36 | 36 | 94% |
| `packages/prompts-llm/src/agent9-prose/mechanism-detect.ts` | 36 | 36 | 100% |
| `packages/prompts-llm/src/agent9-prose/opening-freshness.ts` | 35 | 22 | 100% |
| `packages/prompts-llm/src/shared/death-method-patterns.ts` | 31 | 20 | 100% |
| `packages/prompts-llm/src/contracts/batch-commit-record.ts` | 30 | 0 | not collected |
| `packages/prompts-llm/src/shared/json-boundary.ts` | 29 | 24 | 92% |
| `apps/worker/src/jobs/agents/agent9/flags.ts` | 26 | 26 | 69% |
| `packages/prompts-llm/src/constants/arc-position.ts` | 26 | 26 | 100% |
| `apps/worker/src/jobs/scoring-adapters/agent3b-scoring-adapter.ts` | 25 | 12 | 8% |
| `apps/worker/src/jobs/scoring-adapters/shared.ts` | 25 | 0 | not collected |
| `packages/prompts-llm/src/agent9-prose/continuity-tail.ts` | 20 | 20 | 70% |
| `packages/prompts-llm/src/shared/clearance-vocabulary.ts` | 20 | 20 | 100% |
| `apps/worker/src/jobs/scoring-adapters/index.ts` | 19 | 1 | 100% |
| `packages/prompts-llm/src/types/macro-arc.ts` | 19 | 12 | 100% |
| `packages/prompts-llm/src/agent9-prose/injection-templates.ts` | 16 | 15 | 100% |
| `packages/prompts-llm/src/story-title.ts` | 14 | 14 | 100% |
| `packages/prompts-llm/src/constants/golden-age-beats.ts` | 13 | 12 | 100% |
| `packages/prompts-llm/src/timeline-deception.ts` | 12 | 1 | 0% |
| `packages/prompts-llm/src/types/asset-library.ts` | 12 | 0 | not collected |
| `packages/prompts-llm/src/agent9-prose/model-tiering.ts` | 11 | 10 | 100% |
| `packages/prompts-llm/src/utils/model-tiers.ts` | 11 | 11 | 64% |
| `packages/prompts-llm/src/constants/opening-corpus.ts` | 6 | 6 | 100% |
| `packages/prompts-llm/src/utils/generation-params.ts` | 5 | 1 | 100% |
| `packages/prompts-llm/src/agent9-prose.ts` | 1 | 2 | 100% |
