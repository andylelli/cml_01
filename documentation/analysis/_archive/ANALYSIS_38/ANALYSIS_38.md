# ANALYSIS_38 - Retry Prompt Refactor For Run `run_0a542613-cbe3-4c99-a4d6-d8fd9637e4e2`
Date: 2026-06-14

## 1. Problem Summary
The run reached chapter 8 attempt 6/6 and still failed on discriminating-test validity:

- Required failure signature: chapter must state competing theory/hypothesis and an observable result that proves one path and rules out another.
- Failure happened after multiple retries that had already passed other local checks in earlier chapters.

Observed pattern from prompt logs:
- Retry instructions were very long and layered (core prompt + context + checklist + enhanced retry + packet retry).
- Late-stage corrective signal for the discriminating test was present, but buried in a high-volume instruction stack.
- Prompt budget telemetry showed truncation pressure in retry prompts, increasing risk that critical corrective blocks were diluted.

## 2. Root Cause Assessment
Primary root cause:
- Late retries were still using broad, verbose retry feedback with many categories, even when only one critical error remained.

Secondary contributors:
- High instruction competition: structural, sensory, anti-template, stage-mode, pronoun, clue, and checklist layers all compete for model attention.
- Retry objective drift: the model can satisfy easy/local gates while missing the singular chapter-purpose gate (discriminating-test prove-vs-rule-out contract).

## 3. Refactor Implemented
File changed:
- packages/prompts-llm/src/agent9-prose/generate.ts

### 3.1 New terminal retry prompt mode
Added:
- `buildTerminalRetryExecutionBlock(...)`

Behavior:
- Produces a compact, high-salience, issue-to-action retry contract.
- Lists only active errors and packet must-fix items.
- Adds targeted fix contracts for active failure families (discriminating test, clue, template, grounding, continuity).
- Enforces one-pass resolution framing for the final retries.

### 3.2 Two-phase retry routing

Errors are now split into two exclusive buckets before retry feedback is built.

**Phase 1 — Logic/Contract errors:**
- discriminating test validity
- clue obligation / clue evidence / clue visibility
- stage-mode outcome failures
- victim alive
- pronoun / entity fidelity / continuity
- character name not in cast
- boundary integrity / structure
- word count below hard floor

**Phase 2 — Quality/Style errors:**
- template linter (n-gram overlap, fingerprint, repeated sentence/opener)
- opening-style entropy
- weak sensory grounding
- weak atmosphere/time grounding
- word count below preferred target (above hard floor)

Added:
- `classifyRetryPhase(errors)` → `{ phase, logicErrors, qualityErrors }`
- `buildLogicPhaseHeader(deferredQualityErrors)` — tells model it's in Phase 1 only; lists deferred quality issues so the model is aware but not instructed to fix them.
- `buildQualityPhaseHeader()` — tells model logic is locked, adds a regression guard: must not alter discriminating test, clue evidence, names, pronouns, or stage outcomes.

Routing in the retry loop:
```
mixed (both phases active)
  → Phase 1: feedback built from logicErrors only + logicPhaseHeader
quality only
  → Phase 2: feedback built from qualityErrors only + qualityPhaseHeader
logic only
  → standard full-logic enhanced feedback (no split)
terminal mode (attempt >= maxAttempts - 1)
  → buildTerminalRetryExecutionBlock regardless of phase
```

### 3.3 Late-attempt terminal mode (from initial change)
In the chapter retry loop:
- `useTerminalRetryMode = attempt >= Math.max(3, maxBatchAttempts - 1)` activates compact terminal block.
- Terminal mode takes priority over phase routing.

## 4. Why This Should Improve Success Rate

**Two-phase routing:**
- Prevents instruction competition: quality noise cannot crowd out logic repair instructions on Phase 1 attempts.
- Fixes the "fix A, break B" cycle: after Phase 1 succeeds, quality issues are targeted in isolation with an explicit regression guard.
- Better salience: discriminating-test and clue contracts receive the full attention budget of an attempt.

**Terminal compaction:**
- Late retries get only the active unresolved errors mapped to concrete action contracts.
- Reduces total token load on penultimate/final attempts where prompt budget is tightest.

## 5. Scope And Safety
- No schema/output contract changes.
- No validator logic changes.
- Two-phase routing is purely a feedback-text transformation; incorrect routing can only produce a suboptimal retry message, not a broken chapter.
- Typecheck-level validation on modified file: no errors reported.

## 6. Recommended Next Follow-Ups
1. Add retry telemetry fields to report active phase and prompt size per attempt.
2. Add regression test fixture for cross-phase scenarios (logic errors cleared, quality errors remain).
3. Consider same split for non-prose agents where retry stacks have grown large (Agent 7 narrative structure).
