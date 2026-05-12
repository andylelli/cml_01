# ANALYSIS_09 - Run Review: Agent9 canary (startChapter=1)

Run ID: run_c5ba16da-6a98-44cc-90d4-e82e88297e54 (hydrated source artifacts)  
Date: 2026-05-07  
Project: proj_5d0737ca-1687-4758-8df4-053bf4545e8c  
Story file: None generated (aborted during prose generation)  
Reviewer: Copilot session review  
Execution command: node scripts/canary-agent9.mjs --runId run_c5ba16da-6a98-44cc-90d4-e82e88297e54 --startChapter 1  
Overall assessment: FAIL

## Agent-by-agent outcome check (required near top)
- Agent1-SettingRefiner: PASS (hydrated)
- Agent2-CastDesigner: PASS (hydrated)
- Agent2e-BackgroundContext: PASS (hydrated)
- Agent3b-HardLogicDeviceGenerator: PASS (hydrated)
- Agent3-CMLGenerator: PASS (hydrated)
- Agent5-ClueExtraction: WARN (re-invoked during fair-play recovery path)
- Agent6-FairPlay: WARN (first pass failed, retry path invoked and run continued)
- Agent2b-CharacterProfiles: PASS
- Agent2c-LocationProfiles: WARN (validation failed attempt 1, passed attempt 2)
- Agent2d-TemporalContext: PASS
- Agent65-WorldBuilder: SKIPPED
- Agent7-NarrativeOutline: PASS
- Agent9-Prose: FAIL
- First failing agent: Agent6-FairPlay (first-pass failure signal)
- Last fully-passing upstream agent: Agent7-NarrativeOutline
- Quick notes: Start boundary was correctly chapter 1 (FROM_CHAPTER 1 / CHAPTER_START 1). Run progressed to chapter 8 and then hard-failed after retry exhaustion.

## Observed defects
- [S0 Critical] Agent9 aborted at chapter 8 after retry exhaustion
  Evidence: Session command output for the run shows Chapter 8 failed on all 4 attempts; attempts 1-3 repeatedly hit template-linter failure and attempt 4 failed structural paragraph minimum. Final terminal lines include: "Chapter 8 generation failed after 4 attempts", "Chapter 8 has only 2 paragraph(s)", and "CANARY_STATUS failure".
  Impact: No complete story artifact; run aborts after significant generation time.
  Root-cause hypothesis: Final-attempt fallback can escape template overlap but regress into under-structured output (too few paragraphs), and there is no deterministic final repair guard that enforces paragraph-count minimum before accepting/rejecting completion.

- [S1 High] Retry loop shows low divergence on chapter 8 template leakage
  Evidence: Session output shows chapter 8 attempts 1-3 repeatedly failing on the same template-linter class (repeated long paragraph fingerprint) without meaningful correction before final attempt.
  Impact: Retry budget is consumed without converging, increasing cost and latency.
  Root-cause hypothesis: Retry feedback packet is not forcing sufficiently different structural rewrites for the exact failing paragraph fingerprint pattern.

- [S1 High] Upstream context synthesis remains unstable in same run
  Evidence: Agent2c failed first validation attempt (missing required smells field) and only passed on retry.
  Impact: Non-deterministic upstream regeneration can perturb downstream prose behavior and increases variance in canary reproducibility.
  Root-cause hypothesis: Regenerated profile payloads are not fully constrained on first pass by strict schema-complete output contract.

- [S2 Medium] Fair-play recovery is routinely required before prose stage
  Evidence: Session output includes AGENT6_FIRST_PASS_STATUS fail, AGENT6_RETRY_INVOKED true, AGENT6_FAILURE_CLASS inference_path_abstract.
  Impact: Additional pre-prose cycles increase runtime and canary friction even when pipeline eventually proceeds.
  Root-cause hypothesis: First-pass fair-play prompt/normalization still allows abstract inference-path outputs that require deterministic rescue.

## Phased remediation plan
### P0 Containment (same day)
- Action: Add a deterministic chapter-structure repair gate in Agent9 retry-finalization: if a chapter has fewer than 3 paragraphs, force paragraph segmentation repair before final validation pass.
- Owner area: apps/worker Agent9 orchestration and chapter post-processing
- Status: NOT-STARTED
- Acceptance criteria: Reproducing this run class no longer ends with "has only 2 paragraphs" at final attempt; final-attempt output always satisfies minimum paragraph count.

### P1 Structural fixes (1-3 days)
- Action: Harden template-leakage retry contract for Agent9 by requiring explicit paragraph-level rewrite plans keyed to failing fingerprint segments, not generic "rephrase" directives.
- Owner area: packages/prompts-llm Agent9 retry packet and template-linter feedback mapping
- Status: NOT-STARTED
- Acceptance criteria: For repeated fingerprint failures, attempts 2+ show measurable divergence and eliminate repeated long-paragraph fingerprint without collapsing structural quality.

### P2 Hardening and regression (3-7 days)
- Action: Add targeted regression fixtures for chapter-level dual-failure mode (template leakage + paragraph-minimum violation) and for Agent6 first-pass abstract inference failure class.
- Owner area: packages/story-validation and apps/worker integration tests
- Status: NOT-STARTED
- Acceptance criteria: New tests fail on current behavior, pass after fixes, and one clean canary rerun from chapter 1 completes without prose abort.

## Validation and verification
- Required tests: npm run test --workspace packages/prompts-llm -- agent9-prose.test.ts; npm run -w @cml/worker test; npm run test --workspace packages/story-validation
- Required full-run checks: node scripts/canary-agent9.mjs --runId run_c5ba16da-6a98-44cc-90d4-e82e88297e54 --startChapter 1
- Export checks: Ensure prose completes all planned chapters and terminal status is success before accepting artifact quality.
- Gate outcome: FAILED

## Definition of done
- [ ] No critical encoding artifacts
- [ ] No unresolved continuity contradictions
- [ ] No repeated template leakage above threshold
- [ ] Release gate classification is healthy
- [ ] Regression tests added/updated

## Status update after hardening implementation
- Core validator/prompt/orchestrator tightening: NOT-STARTED
- Full-run empirical confirmation: NOT-STARTED
- Baseline closure: NOT-STARTED