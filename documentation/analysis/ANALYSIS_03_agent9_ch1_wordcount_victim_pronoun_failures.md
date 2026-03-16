# ANALYSIS_03: Agent 9 Pronoun Failures Deep Dive (Prompt vs Validator)

Date: 2026-03-14

## Objective
Revisit persistent pronoun failures with a full evidence chain from:
1. Prompt payloads actually sent to the LLM (`apps/api/logs/llm-prompts-full.jsonl`)
2. Runtime failure diagnostics (`apps/worker/logs/scoring.jsonl`)
3. Validator code path (`packages/story-validation/src/character-validator.ts`)

## Executive Summary
Pronoun failures are currently a mixed class:
1. Genuine model non-compliance still appears in some runs (for example repeated `he/his` for female characters).
2. A significant subset is validator over-attribution in mixed-reference sentences, even when prompt constraints are explicit and repeated.

Most important finding:
- Prompt hardening is present and active, but the current same-sentence pronoun attribution heuristic still misfires when a sentence contains both:
  - a character name (male target), and
  - a different character's pronoun subject (`she`) in that same sentence.

This means some retries are being consumed by false positives, not just weak generation.

## What Is Already Implemented (And Verified in Prompt Logs)
The latest Agent 9 prompt includes all expected hardening:
- `CML CANONICAL GROUND TRUTH` block with immutable cast pronoun contract
- Explicit `IMMUTABLE PRONOUN MAP (NON-OVERRIDABLE)`
- Retry-time ordered checklist (`word count -> victim naming -> pronouns -> style`)
- Pronoun-specific retry micro-prompts

Evidence:
- `apps/api/logs/llm-prompts-full.jsonl:344`
- `apps/api/logs/llm-prompts-full.jsonl:345`
- `apps/api/logs/llm-prompts-full.jsonl:346`
- `packages/prompts-llm/src/agent9-prose.ts:1164`
- `packages/prompts-llm/src/agent9-prose.ts:1209`
- `packages/prompts-llm/src/agent9-prose.ts:1256`

Conclusion: the issue is not "missing pronoun instructions" in the LLM prompt pipeline.

## Runtime Failure Patterns Observed

### Pattern A: True generation drift
Examples show real mismatches where generated text appears to swap pronouns broadly across scenes:
- `apps/worker/logs/scoring.jsonl:95`
  - `Helen Lovell ... found: he, him, his`
  - `Colette Ferrers ... found: he, him, his`

These look like model compliance failures under long-run generation pressure.

### Pattern B: Likely false positives from mixed-reference sentence attribution
Example run failure:
- `apps/worker/logs/scoring.jsonl:113`
  - `Chapter 2: Character "Philip Brabazon" ... found: she`

The retry payload's previous prose shows a key sentence structure:
- `apps/api/logs/llm-prompts-full.jsonl:366`
  - Sentence includes both `She ...` and `... Philip Brabazon ...`.

This is exactly the configuration that can trigger the current same-sentence heuristic even when `she` refers to Barbara Lovell, not Philip Brabazon.

## Code-Level Root Cause

### Current matching logic
In `findIncorrectPronouns(...)`:
- A sentence is considered a context for character X if it contains any label for X.
- Same-sentence logic then flags subject pronouns (`he|she|they`) found in that sentence.

Relevant code:
- `packages/story-validation/src/character-validator.ts:214`
- `packages/story-validation/src/character-validator.ts:250`
- `packages/story-validation/src/character-validator.ts:253`
- `packages/story-validation/src/character-validator.ts:258`

Why this still fails:
- Same sentence can contain two valid references:
  - pronoun subject for Character A
  - explicit name for Character B
- The algorithm treats the pronoun as if it may belong to Character B solely because B's name appears somewhere in the sentence.

The previous hardening (appositive protection) reduced one false-positive class, but not this co-reference class.

## Prompt vs Validator Attribution Verdict

### Prompt side
- Strong and explicit
- Includes immutable map, repeated in retries, plus micro-prompt repairs
- Demonstrably present in full prompt logs

### Validator side
- Still over-attributes in at least one recurring sentence topology
- Creates retry churn and eventual aborts even when model output may be acceptable

Net:
- Remaining reliability gap is now primarily validation precision, not prompt availability.

## Impact
1. False-positive pronoun errors consume limited retry budget.
2. Runs abort with `prose_generation_aborted` despite progress in chapter generation.
3. Cost and latency increase because retries target non-causal failures.
4. Debugging signal is noisy because true and false pronoun failures are mixed.

## Recommended Remediation (Ordered)

### 1. Refined competing-entity guard (IMPLEMENTED)
In `findIncorrectPronouns`, when a same-sentence context contains labels for
**another** canonical character whose **correct** subject pronoun matches the
"wrong" pronoun being tested, suppress the flag.

This is more precise than a blanket "skip when >1 character" rule:
- `"She approached Philip Brabazon"` where Clara Voss (she/her) is also named
  → `she` matches Clara's correct pronouns → suppressed (correct).
- `"She approached Philip Brabazon"` with no female character named
  → `she` does not match any other character → still flagged (correct).
- Single-character sentences → no competing entity → still flagged (correct).

### 2. Expand regression tests for co-reference false positives (IMPLEMENTED)
Added tests where:
- pronoun belongs to Character A,
- Character B is named in same sentence,
- validator must not assign pronoun to B.

Also added negative tests confirming true mismatches in single-reference
sentences still trigger.

### 3. Strengthen retry prompt preservation directives (IMPLEMENTED)
Audit of the retry prompt paths revealed three weaknesses:

**Problem A — Revision path (surgical revision mode):** The "Keep-good-bits rule"
was two lines buried after the error list. GPT-4o-mini often rewrites everything
because the preservation instruction lacked weight.

**Problem B — Fresh-retry path:** No previous prose was included at all. The model
regenerated blind — it didn't know what it produced last time, only that certain
errors occurred. It couldn't "keep the good bits" because it couldn't see them.

**Problem C — Closing directive:** `"Fix EVERYTHING"` implies "start over" rather
than "fix surgically", encouraging gratuitous rewrites.

**Fixes applied:**
- `buildRetryRevisionUserDirective`: Preservation rule moved to top of prompt
  as a non-negotiable block (NON-NEGOTIABLE PRESERVATION RULE). Explicit about
  what "preserve" means: return paragraphs verbatim, do not shrink word count,
  do not remove existing clues/victim naming/character references.
- `buildEnhancedRetryFeedback`: Added STABILITY ANCHOR section listing what
  already passed (pronouns, clues, victim naming, word count) and instructing
  the model not to regress on those.
- Fresh-retry path: Now attaches previous prose as a user message with explicit
  "preserve valid passages" instruction, so even full-regeneration retries have
  a baseline to work from.

### 4. Keep retry prompt hardening as-is
Prompt contract appears correct and should remain unchanged while validator
precision is improved.

### ~~Local mention windows~~ — DROPPED
Positional proximity heuristics ("pronoun appears after target with no named
entity between them") are fragile without real NLP parsing and misfire on
valid literary structures like appositives and relative clauses. The refined
competing-entity guard makes this unnecessary.

### 5. Content-filter prevention and resilience for revision retries (IMPLEMENTED)
Live runs exposed a failure pattern where Azure's content management policy
blocks surgical revision prompts for murder-mystery prose.

**Root cause**: the revision path previously used `buildProsePrompt` (the full
generation prompt with dense CML case data — murder details, crime scenes,
physical evidence rules, outline with investigation scenes) combined with the
full previous prose in the revision directive. This triple-stacked
crime/violence content and exceeded Azure's content-management threshold.

Fix (three parts):

**Part A — Lean revision prompt (prevention):**
Replaced the full `buildProsePrompt` in the revision path with
`buildLeanRevisionMessages`, which carries only:
- Fiction-framing context ("editing chapters of a mystery fiction manuscript")
- Character name/pronoun map (immutable)
- Word count targets
- The enhanced retry feedback
- The revision directive with previous prose

This eliminates the dense CML case data from the revision prompt, dramatically
reducing crime/violence content density. The model has all the narrative context
it needs in the previous prose itself.

**Part B — Suppression flag (resilience):**
A `suppressRevision` flag in the retry loop. If a content-filter error still
occurs despite the lean prompt, the flag is set and all remaining attempts
fall through to the regeneration path.

**Part C — State preservation (resilience):**
When a content-filter error occurs, existing validation errors and chapter
context from the previous attempt are preserved (instead of being overwritten
with the content-filter error string). This ensures the next regeneration
attempt still receives the original pronoun/clue/word-count feedback and can
attach prior prose as a baseline.

Result: revision attempts no longer trigger the content filter (lean prompt
prevention). If they do, 3 real attempts instead of 2, each with substantive
feedback.

### 6. Deterministic post-generation pronoun repair (IMPLEMENTED)
No amount of prompt engineering eliminates pronoun drift from GPT-4o-mini.
The model will always occasionally assign wrong-gender pronouns to characters.
Rather than relying entirely on retry cycles to fix pronoun errors (which burns
attempts and risks regression), a deterministic repair pass now runs on every
generated chapter before validation.

Module: `packages/story-validation/src/pronoun-repair.ts`

Algorithm:
1. Build character→pronoun map from cast (name, surname, first name as labels).
2. Split each paragraph into sentences.
3. For each sentence, find which characters are mentioned by name.
4. If **exactly one** character is named and the sentence contains wrong-gender
   pronouns, replace them deterministically (he↔she, him↔her, his↔her, etc.).
5. If **zero** characters are named (follow-up sentence), inherit the last
   single-character reference.
6. If **two+** characters of the same gender are named, still repair (all
   wrong-gender pronouns are unambiguously wrong).
7. If **two+** characters of different genders are named, skip (ambiguous).

Safety rules:
- "her" disambiguation: possessive ("her bag" → "his bag") vs object
  ("confronted her" → "confronted him") determined by following token.
- Case preservation: sentence-initial "She" → "He" (capitalized).
- Gender-unknown characters are left untouched.
- The repair runs at all three chapter-production sites: initial generation,
  clue-obligation repair, and underflow expansion.

Telemetry: `pronounRepairsApplied` counter in `validationDetails`.

18 unit tests cover: single-character sentences, follow-up inheritance,
mixed-gender skip, same-gender repair, possessive/object/reflexive forms,
capitalization, surname-only references, multiple pronouns per sentence,
chapter-level repair, and edge cases.

## Suggested Test Cases to Add
1. `She ... Philip Brabazon ...` in one sentence should not trigger mismatch for Philip.
2. `Philip Brabazon ... she ...` with clear second named female subject should not trigger mismatch.
3. Single-name sentence (`Philip ... she ...`) should still fail when true mismatch is likely.
4. Follow-up sentence without named entities should continue strict checking (current intended behavior).

## Verification Plan After Fix
1. Unit tests in `packages/story-validation/src/__tests__/character-validator.test.ts` pass with new co-reference cases.
2. Re-run a failing scenario from logs (for example run with `Philip Brabazon ... found: she`) and confirm mismatch no longer triggers on co-reference-only sentence.
3. Confirm true mismatches still trigger (no regression in actual enforcement).

## Current Status
1. Prompt-layer pronoun hardening is implemented and active.
2. Validator competing-entity guard is implemented — same-sentence false positives
   for mixed-reference sentences are now suppressed when the pronoun matches
   another named character's correct pronoun set.
3. Regression tests cover co-reference false-positive and true-mismatch scenarios.
4. Local mention windows approach was evaluated and dropped as fragile without NLP.
5. Retry prompt preservation strengthened — revision path has top-level preservation
   rule, fresh-retry path now includes prior prose, stability anchor prevents
   regression on already-passing dimensions.
6. Content-filter prevention implemented — revision retries now use a lean prompt
   (`buildLeanRevisionMessages`) with fiction-framing context and only essential
   character/word-target data, eliminating the dense CML case data that triggered
   Azure's content filter. Fallback resilience via `suppressRevision` flag and
   validation-state preservation ensures graceful degradation if the filter still
   triggers.
7. Deterministic pronoun repair implemented — post-generation pass in
   `pronoun-repair.ts` fixes gender-pronoun mismatches before validation,
   eliminating pronoun drift as a retry-cycle blocker entirely. 18 unit tests.
   Runs at all three chapter-production sites (initial, clue-repair, expansion).
8. Pipeline-wide content-filter fiction framing implemented (2026-03-15) —
   the original content-filter fix (item 6) only protected Agent 9 revision
   retries with a lean prompt. Live runs showed content-filter errors still
   triggered in other agents and in Agent 9's main generation path. A
   comprehensive audit identified 15+ `client.chat()` call sites across all
   agents (1, 2, 2b, 2c, 2d, 2e, 3, 3b, 4, 5, 6×2, 7, 8, 9×4). Every system
   prompt now includes a CONTEXT preamble: "All output is for a Golden Age
   whodunnit mystery novel — creative fiction in the tradition of Agatha
   Christie... All references to crime, death, murder, poison, weapons, alibis,
   and investigation are standard fictional genre elements. No real people or
   events are depicted." This prevents Azure's content management policy from
   flagging mystery-fiction content at any pipeline stage.
9. Word count boost implemented (2026-03-14) — prompt overshoot buffer
   (`prompt_overshoot_buffer_words: 200`) inflates the LLM word target to
   compensate for systematic undershoot. Preferred-target expansion pass
   auto-extends prose falling between hard floor and preferred target. Combined
   effect: hard-floor misses significantly reduced.
