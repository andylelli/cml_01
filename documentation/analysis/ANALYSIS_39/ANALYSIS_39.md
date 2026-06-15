# ANALYSIS_39 - Agent 9 Repeating Failure Review Across Today's Prompt Logs

Date: 2026-06-14

## Fix Status Table

| Fix | Category | Type | Likelihood | Status | Notes |
| --- | --- | --- | --- | --- | --- |
| Deterministic suspect-clearance paragraph injector | Suspect clearance missing | Deterministic | 96% | DONE | Implemented in `agent9-prose/generate.ts` with linter-backed patching before retry escalation and inside fallback paths. |
| Deterministic required-clue materializer | Clue visibility / missing required clues | Deterministic / hybrid | 92% | DONE | Implemented as deterministic observation-plus-inference insertion using `requiredClueIds`, `clueObligationContext`, and clue-distribution text. |
| Deterministic discriminating-test scene scaffold | Discriminating-test missing | Hybrid, mostly deterministic | 91% | DONE | Implemented as deterministic competing-theory/test/result paragraphs in both chapter repair and fallback generation. |
| Stage-mode-aware deterministic fallback | `suspect_pressure` and fallback aborts | Deterministic | 93% | DONE | Fallback authoring now branches by stage mode and is validated by tests for `suspect_pressure` and `discriminating_test`. |
| Authoritative retry stop for repeated non-template failures | Retry churn / non-convergence | Deterministic runtime control | 95% | DONE | Non-convergent batches now short-circuit to deterministic fallback in completion-first mode instead of spending more LLM retries. |
| Retry archive numbering fix | Prompt-log integrity | Deterministic | 99% | DONE | `packages/llm-client/src/logger.ts` now preserves true retry numbers above `retry4` in archived filenames and labels. |
| Remove continuity-hostile template reset wording | Continuity drift during retries | Prompt fix | 75% | DONE | Retry guidance now preserves continuity, clue state, and chapter obligations while forcing fresh sentence structure. |
| Keep two-phase retry routing and terminal retry compaction | Retry prompt quality | Prompt fix | 65% | KEEP | Useful support layer, but not the main solution to today's failures. |
| Keep self-audit field, but use validator output as the repair trigger | Audit / repair loop | Hybrid | 70% | KEEP+EXTEND | Good as a hint, but deterministic repair should key off validator state, not LLM honesty alone. |

### Implementation Update

- `DONE`: Deterministic suspect-clearance paragraph injector
- `DONE`: Deterministic required-clue materializer
- `DONE`: Deterministic discriminating-test scene scaffold
- `DONE`: Stage-mode-aware deterministic fallback
- `DONE`: Authoritative retry stop for repeated non-template failures
- `DONE`: Retry archive numbering fix
- `DONE`: Remove continuity-hostile template reset wording
- `DONE`: Remove continuity-hostile template reset wording

## 1. Scope

Reviewed prompt-log corpus under:

- `documentation/prompts/actual/run_20260614-0637_0a542613`
- `documentation/prompts/actual/run_20260614-0749_9e98f2e3`
- `documentation/prompts/actual/run_20260614-1014_d3cf0c3f`
- `documentation/prompts/actual/run_20260614-1335_0030e979`

Primary source areas reviewed against the logs:

- `packages/prompts-llm/src/agent9-prose/generate.ts`
- `packages/prompts-llm/src/agent9-prose/prompt-builder.ts`
- `packages/prompts-llm/src/agent9-prose/obligation-block.ts`
- `packages/prompts-llm/src/agent9-prose/clue-validation.ts`
- `packages/prompts-llm/src/agent9-prose/lint.ts`
- `packages/prompts-llm/src/agent9-prose/discriminating.ts`
- `packages/prompts-llm/src/retry-protocol.ts`
- `apps/worker/src/jobs/agents/agent9-run.ts`
- `apps/worker/src/jobs/scoring-adapters/agent9-scoring-adapter.ts`
- `packages/story-validation/src/scoring/phase-scorers/agent9-prose-scorer.ts`
- `packages/story-validation/src/control-plane-leakage.ts`
- `packages/story-validation/src/character-lifecycle-validator.ts`

## 2. Executive Summary

Today's failures are overwhelmingly `Agent 9` content-validation failures, not JSON/schema failures.

Across the four runs:

- Agent 9 consumed `61` retries total.
- The hottest failure zones were late chapters:
  - `0637`: Chapter 8 reached 6 attempts
  - `0749`: Chapter 6 reached 6 attempts
  - `1014`: Chapter 9 reached 6 attempts
  - `1335`: Chapter 9 reached 6 attempts
- `32` response files explicitly self-reported `required_clues_present ... | absent`.
- Every run recorded `missing_request_count: 1`; one run also had `missing_response_count: 1`.

The dominant issue categories are:

1. Missing clue visibility and suspect-clearance obligations
2. Missing or weak discriminating-test realization
3. Template leakage / repeated scaffold prose
4. Continuity drift triggered during retries
5. Stage-mode failures in `suspect_pressure`
6. Retry/accounting behavior that keeps bad chapters cycling instead of converging or stopping cleanly

The key conclusion is:

- The top recurring failures are now specific enough that prompt-only fixes are unlikely to resolve them reliably.
- The next high-probability fixes should be deterministic or hybrid deterministic-plus-prompt fixes.
- Prompt compaction and retry wording are still useful, but they are no longer the main bottleneck.

## 3. Corpus-Level Pattern

### 3.1 Retry distribution

Per run:

- `run_20260614-0637_0a542613`: 17 retries
- `run_20260614-0749_9e98f2e3`: 16 retries
- `run_20260614-1014_d3cf0c3f`: 16 retries
- `run_20260614-1335_0030e979`: 12 retries

Per worst chapter:

- `0637` Chapter 8: retries through duplicate archived `retry4`
- `0749` Chapter 6: retries through duplicate archived `retry4`
- `1014` Chapter 9: retries through duplicate archived `retry4`
- `1335` Chapter 9: retries through duplicate archived `retry4`

This matches the current runtime design:

- `generate.ts` still defaults `preferCompletionOnFailure` to true
- `retry-protocol.ts` can mark a failure non-convergent
- `generate.ts` logs the non-convergence, but in completion-first mode continues retrying anyway

So the retry vocabulary improved, but the runtime still behaves like "continue until budget exhausted unless a hard exception stops us."

### 3.2 High-signal issue counts from retry/failure sections

These counts are from the retry/failure sections and self-audit lines, not from every repeated contract line in the prompts:

- Clue obligation / clue visibility signals: `154`
- Suspect-clearance missing signals: `96`
- Discriminating-test missing signals: `15`
- Stage-mode / suspect-pressure signals: `3`
- Response audit lines with `required_clues_present ... | absent`: `32`

That pattern is strong enough to treat clue-delivery failures as the primary failure class for today's runs.

## 4. Repeating Issues By Category

### 4.1 Missing clue visibility

Observed log pattern:

- Response audit repeatedly says `required_clues_present: ... | absent`
- Late retries still fail on the same missing clue or clue family
- The retry prompts often instruct a two-paragraph observation-plus-inference repair block

Representative evidence:

- `run_20260614-1014_d3cf0c3f/29_Agent9-ProseGenerator-Ch8_response.md`
- `run_20260614-1014_d3cf0c3f/30_Agent9-ProseGenerator-Ch8_retry1_response.md`
- `run_20260614-1014_d3cf0c3f/35_Agent9-ProseGenerator-Ch9_retry2_response.md`
- `run_20260614-1335_0030e979/34_Agent9-ProseGenerator-Ch9_retry4_response.md`

Relevant code paths:

- `obligation-block.ts`
  - emits mandatory clue obligations
  - already distinguishes early-placement clues
- `prompt-builder.ts`
  - injects self-audit field `required_clues_present`
- `lint.ts`
  - maps clue obligation failures to `suspect_clearance_missing` and clue timing style retries
- `agent9-run.ts`
  - computes `clue_visibility_missing_expected_ids`
- `agent9-prose-scorer.ts`
  - scores clue visibility after the fact

Assessment:

- The system is good at detecting missing clue delivery.
- It is not good at deterministically repairing missing clue delivery.
- The current fix is still mostly "ask the model again with stronger wording."

Root cause:

- Clue delivery is treated as a prompt contract rather than a post-generation structural obligation.
- The data needed to patch it already exists:
  - `requiredClueIds`
  - `clueObligationContext`
  - `clueDistribution`
  - `clue_visibility_missing_expected_ids`

### 4.2 Suspect-clearance missing

Observed log pattern:

- Retry prompts repeatedly demand a dedicated paragraph naming a suspect, using a clearance term, and an evidence connector in the same paragraph
- This is especially common in late chapters

Representative evidence:

- `run_20260614-0637_0a542613/36_Agent9-ProseGenerator-Ch8_retry1_request.md`
- `run_20260614-1014_d3cf0c3f/35_Agent9-ProseGenerator-Ch9_retry2_request.md`

Relevant code paths:

- `obligation-block.ts`
  - emits explicit `SUSPECT CLEARANCE REQUIRED`
- `lint.ts`
  - checks name + clearance term + evidence connector in the same paragraph
- `clue-validation.ts`
  - later stage-mode and fair-play gates are still affected if these are missing

Assessment:

- This is the single easiest recurring issue to fix deterministically.
- The validator is explicit and narrow.
- The structured source data already exists in `matchingClearances`.

Root cause:

- We currently rely on the LLM to compose a validator-shaped paragraph.
- There is no deterministic clearance paragraph injector before final validation.

### 4.3 Discriminating-test missing or under-realized

Observed log pattern:

- Retry prompts repeatedly say the chapter may be missing the discriminating test scene
- Even after retries, the chapter can still fail because the test is not rendered as a concrete prove-vs-rule-out scene

Representative evidence:

- `run_20260614-0637_0a542613/36_Agent9-ProseGenerator-Ch8_retry1_request.md`
- `run_20260614-1014_d3cf0c3f/35_Agent9-ProseGenerator-Ch9_retry2_request.md`

Relevant code paths:

- `discriminating.ts`
  - checklist is detailed and strong
- `prompt-builder.ts`
  - only injects the test checklist into the batch that should contain it
- `obligation-block.ts`
  - emits a discriminating-test window warning
- `clue-validation.ts`
  - validates stage-mode and test realization
- `agent9-run.ts`
  - release gate flags `no valid discriminating test scene`
- `agent9-prose-scorer.ts`
  - trust-signal and completeness penalties for missing test

Assessment:

- The prompts already explain the discriminating test clearly.
- The LLM still fails to consistently stage it as a live scene under retry pressure.
- This is no longer an instruction-definition problem.

Root cause:

- The model is being asked to satisfy a structurally specific scene requirement using only natural-language retries.
- There is no deterministic scene scaffold or patcher for the discriminating-test chapter.

### 4.4 Template leakage and repetitive retry prose

Observed log pattern:

- Retry prompts frequently classify failures as `template`
- Responses repeat stock language across retries and across adjacent chapters
- In the `1014` run, the Chapter 8 and 9 retries loop on almost identical Gertrude/Mary/Trevor/Hugh phrasing

Relevant code paths:

- `generate.ts`
  - `buildEnhancedRetryFeedback(...)` injects:
    - banned paragraph blocks
    - near-duplicate warnings
    - prior chapter duplication lock
    - the line: `Write as if you cannot see the prior chapters. Compose every paragraph fresh from the scene instructions alone.`
- `lint.ts`
  - detects n-gram overlap, fingerprint, scaffold leakage, control-plane leakage
- `agent9-run.ts`
  - deterministic post-processing dedupes long repeated paragraphs and replaces scaffold-like leads

Assessment:

- Template detection is good.
- Retry wording is partially counterproductive in mixed-failure cases.
- The "cannot see prior chapters" instruction helps with phrasing reset, but it pushes the model away from continuity and cumulative clue obligations.

Root cause:

- Template control is still prompt-led.
- Deterministic postprocessing only repairs obvious repetition and grounding-lead duplication.
- It does not preserve content obligations while rephrasing, and the prompt text sometimes asks the model to forget too much context.

### 4.5 Continuity drift during retries

Observed log pattern:

- Character-name errors
- continuity-class retries
- chapter audits that suddenly point to wrong chapter positions or generic `clue_id or description`

Relevant code paths:

- `prompt-blocks.ts`
  - strong pronoun lock
- `prompt-builder.ts`
  - continuity context and continuity tail
- `generate.ts`
  - continuity is mixed into retry issue family classification
  - template reset instructions can conflict with continuity preservation
- `agent9-run.ts`
  - deterministic pronoun repair
  - locked-fact word-form repair
  - location normalization

Assessment:

- Deterministic continuity repair is already helping with pronouns and locked fact formatting.
- The remaining continuity problems are more semantic:
  - wrong suspect focus
  - wrong chapter-local obligation placement
  - drift introduced during heavy retry rewrites

Root cause:

- The prompt stack asks the model both to preserve continuity and to rewrite from scratch.
- The deterministic repair layer is strong for surface continuity, not for semantic continuity.

### 4.6 Stage-mode failure in `suspect_pressure`

Observed log pattern:

- Less frequent than clue failures, but extremely severe when it fires
- The `1014` run aborted because the fallback Chapter 9 still failed:
  - missing a new pressure reveal in `suspect_pressure`

Relevant code paths:

- `prompt-builder.ts`
  - stage-mode outcome contract is explicit
- `obligation-block.ts`
  - warns not to resolve the case in `suspect_pressure`
- `clue-validation.ts`
  - checks for pressure reveal and forbids premature full resolution
- `generate.ts`
  - deterministic completion fallback is validated against stage-mode but does not guarantee stage-mode compliance

Assessment:

- This is the clearest gap between validation and deterministic fallback generation.
- The fallback chapter builder writes generic investigation prose, but not mode-specific pressure content.

Root cause:

- `buildCompletionFallbackChapter(...)` is stage-agnostic.
- Validation is stage-aware.
- The fallback therefore fails exactly where a deterministic system should be strongest.

### 4.7 Retry accounting and archive integrity

Observed log pattern:

- duplicate archived `retry4` files for attempts beyond retry 4
- every run had `missing_request_count: 1`
- one run had `missing_response_count: 1`

Relevant code paths:

- `packages/llm-client/src/logger.ts`
  - retry number normalization clamps archive naming above 4
- `generate.ts`
  - outer attempt numbers and retry packet attempt numbers can diverge

Assessment:

- This is not the cause of content failure.
- It materially slows diagnosis and hides whether retry logic is actually improving.

Root cause:

- attempt naming/archiving is capped
- archive integrity is still not exact

## 5. Review Of Deterministic Vs Prompt Fixes

## 5.1 Prompt-only fixes: current ceiling

Prompt-only improvements already present:

- terminal retry execution block
- two-phase retry routing
- clue obligation wording
- suspect-clearance wording
- discriminating-test checklist
- stage-mode outcome contract
- pronoun and continuity contracts
- self-audit field

Prompt-only conclusion:

- These changes improved diagnosis and salience.
- They did not reliably resolve the main failure classes in today's runs.
- Prompt-only fixes are now unlikely to exceed roughly `40%` to `70%` resolution probability on the dominant late-chapter failures, because the failures persist even when the prompts already explicitly state the requirement.

Prompt-only items that should remain, but are not primary fixes:

- Keep terminal retry compacting
- Keep two-phase routing
- Remove or soften the line telling the model to write "as if you cannot see the prior chapters"
- Keep checklist blocks, but treat them as support for deterministic repair, not the main solution

## 5.2 Deterministic fixes: where the probability is high

The categories below are the ones where a deterministic or hybrid patch is more than `90%` likely to resolve the specific issue class.

### A. Deterministic suspect-clearance paragraph injector

Type:

- Deterministic

Touchpoints:

- `lint.ts`
- `obligation-block.ts`
- `generate.ts`

Concrete fix:

- Before final validation failure is accepted, detect `suspect_clearance_missing`
- For each missing clearance, inject one paragraph using:
  - suspect name
  - accepted clearance phrase
  - evidence connector
  - supporting clue / clearance method
- Place it in the required chapter before the validator reruns

Likelihood of resolving that issue class:

- `96%`

Why so high:

- The validator logic is narrow and explicit
- The source data already exists
- The repair can be generated from structured fields without asking the LLM again

### B. Deterministic required-clue materializer

Type:

- Deterministic or deterministic-plus-light-LLM paraphrase

Touchpoints:

- `generate.ts`
- `obligation-block.ts`
- `agent9-run.ts`

Concrete fix:

- When `clue_visibility_missing_expected_ids` is non-empty, materialize each missing clue from:
  - `requiredClueIds`
  - `clueObligationContext`
  - `clueDistribution`
- For early clues, inject the required two-paragraph observation/inference structure in paragraphs 1-2
- For later clues, insert a chapter-local observable detail plus explicit inference paragraph

Likelihood of resolving that issue class:

- `92%`

Why so high:

- The clue text and intended scene placement already exist
- The validator is checking for observable on-page presence, not literary subtlety
- The current retry prompts already describe almost exactly the structure we need to generate deterministically

### C. Deterministic discriminating-test scene scaffold

Type:

- Hybrid, but primarily deterministic scene scaffolding

Touchpoints:

- `discriminating.ts`
- `generate.ts`
- `obligation-block.ts`
- `clue-validation.ts`

Concrete fix:

- For the discriminating-test chapter, if the validator says the test is missing:
  - generate a fixed scene scaffold from CML fields:
    - Theory A
    - Theory B
    - test action
    - observed result
    - prove / rule-out conclusion
  - ensure it is inserted as a live scene with dialogue and observable action

Likelihood of resolving that issue class:

- `91%`

Why not higher:

- This is structurally more complex than clearance insertion
- It still needs readable prose around the scaffold
- But the data contract is concrete enough that deterministic realization is feasible

### D. Stage-mode-aware deterministic fallback

Type:

- Deterministic

Touchpoints:

- `buildCompletionFallbackChapter(...)` in `generate.ts`
- `clue-validation.ts`

Concrete fix:

- Make fallback generation mode-aware
- For `suspect_pressure`, force one structured pressure beat:
  - named suspect
  - new fear, motive, lie, loyalty conflict, or secret
  - explicit investigative consequence
- Also force the fallback not to contain final-resolution language in that mode

Likelihood of resolving that issue class:

- `93%`

Why so high:

- The current failure is exactly that fallback is validated against a rule it does not try to satisfy
- This is a deterministic contract mismatch, not a subtle writing problem

### E. Retry stop made authoritative for repeated non-template failures

Type:

- Deterministic runtime control

Touchpoints:

- `retry-protocol.ts`
- `generate.ts`
- generation config

Concrete fix:

- In strict-success mode, treat `shouldContinueRetry(...) === false` as authoritative
- Either:
  - abort the chapter early, or
  - move immediately to deterministic fallback / deterministic patch mode
- Do not continue ordinary LLM retries once the same non-template failure class repeats

Likelihood of resolving runaway retry behavior:

- `95%`

What it fixes:

- retry churn
- wasted attempts
- misleading impression that more retries are helping

What it does not fix by itself:

- the content failure

### F. Retry archive numbering fix

Type:

- Deterministic

Touchpoints:

- `packages/llm-client/src/logger.ts`

Concrete fix:

- stop clamping retry labels at 4
- archive real retry numbers

Likelihood of resolving duplicate `retry4` labeling:

- `99%`

## 5.3 Prompt-level fixes that are worth doing, but are not >90% solutions

### Remove the continuity-hostile retry sentence

Current line in `generate.ts`:

- `Write as if you cannot see the prior chapters. Compose every paragraph fresh from the scene instructions alone.`

Recommended replacement:

- Preserve all continuity anchors, clue obligations, and prior story facts.
- Rewrite sentence structure only, not story state.

Likelihood of reducing continuity/template whack-a-mole:

- `75%`

Why not >90:

- It removes a harmful instruction, but does not itself materialize missing obligations

### Continue using the self-audit field, but do not rely on it as the fix

Current state:

- the model often honestly reports `required_clues_present: ... | absent`
- the field is stripped and not used for deterministic repair

Likelihood of self-audit alone fixing the issue:

- `25%`

Likelihood of self-audit as a trigger for deterministic patching:

- `70%`

Why not primary:

- It is LLM self-report, not authoritative state
- better to use validator output and extracted clue visibility directly

## 6. Agent 9 Code Review By Layer

### 6.1 Prompt construction layer

Files:

- `prompt-builder.ts`
- `obligation-block.ts`
- `discriminating.ts`
- `prompt-blocks.ts`

Verdict:

- Strong and explicit
- probably already past the point of diminishing returns for prompt-only gains

Main concern:

- prompt overload and local contradictions
- especially template-reset instructions that can weaken continuity and clue placement

### 6.2 Retry orchestration layer

Files:

- `generate.ts`
- `retry-protocol.ts`

Verdict:

- Better issue classification than before
- still not controlling runtime strongly enough

Main concerns:

- non-convergence is advisory in completion-first mode
- terminal retry blocks are good, but still LLM-only
- no handoff from repeated failure to deterministic obligation patching

### 6.3 Validation layer

Files:

- `clue-validation.ts`
- `lint.ts`

Verdict:

- Strong
- specific
- already catches the right things

Main concern:

- validator specificity is ahead of repair specificity

### 6.4 Deterministic repair layer

Files:

- `agent9-run.ts`

Already good:

- pronoun repair
- word-form locked fact repair
- location/grounding lead normalization
- some template/scaffold dedupe

Missing:

- deterministic clue insertion
- deterministic suspect-clearance insertion
- deterministic discriminating-test realization
- stage-mode-aware fallback authoring

This is the biggest strategic gap.

### 6.5 Scoring / trust layer

Files:

- `agent9-scoring-adapter.ts`
- `agent9-prose-scorer.ts`

Verdict:

- Directionally strong
- helpful for truthfulness after generation

Main limitation:

- scoring sees the failures, but does not prevent them
- it is downstream of the main content-generation problem

## 7. Recommended Fix Plan

Order of implementation:

1. Add deterministic suspect-clearance injector
   - fastest high-confidence win
   - likely fixes the most repeated validator complaint

2. Add deterministic required-clue materializer
   - use `requiredClueIds`, `clueObligationContext`, and clue-distribution descriptions
   - honor early-placement rules

3. Make fallback stage-mode aware
   - especially `suspect_pressure`
   - stop fallback from failing the exact validator it is supposed to rescue

4. Add discriminating-test deterministic scaffold
   - especially for late chapters and retry exhaustion

5. Make repeated non-template failure non-retrying in strict-success mode
   - route directly to deterministic patch/fallback instead of burning attempts

6. Fix archive retry numbering and attempt ledger clarity
   - improves diagnosis immediately

7. After the deterministic fixes land, simplify some retry prompt wording
   - especially the continuity-hostile template reset phrasing

## 8. Final Verdict

The repeated issues in today's prompt logs are real, consistent, and well localized in the codebase.

The important strategic conclusion is:

- the system does not primarily need more prompt instructions
- it needs deterministic realization of the exact structured obligations it already knows about

The highest-confidence fixes are not generic prompt tweaks. They are:

- deterministic suspect-clearance insertion
- deterministic clue-obligation insertion
- deterministic discriminating-test scaffolding
- stage-mode-aware fallback generation
- authoritative retry-stop behavior for repeated non-template failures

Those changes are all more than `90%` likely to resolve their specific issue classes, because they convert the current system from "detect and ask again" into "detect and materialize the missing structure directly."
