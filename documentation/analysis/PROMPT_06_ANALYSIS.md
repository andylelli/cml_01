# PROMPT_06_ANALYSIS.md
## Per-Attempt Prompt Analysis — run_d0b48710, 2026-03-16
### "The Clock's Deception" | Chapter 1 | Agent9-ProseGenerator-Ch1

Source data: `PROMPT_06.md` (initial + underflow + 3 repair attempts, route: A0=buildProsePrompt, UnderflowExpansion, A1-A3=buildContinuityRepairPrompt)

---

## Problem Summary

**All repair attempts failed. Ch1 was never saved. Run never reached Ch2–Ch6.**

| # | Reported errors |
|---|----------------|
| A0 (initial) | 574 words — underflow, expansion triggered |
| Underflow | Expanded draft produced — pronoun errors introduced |
| A1 | Alan Rochford: `she/her`; Felix Peverel: `she/her` |
| A2 | Same errors — unchanged |
| A3 | Same errors — unchanged — run_failed |

**Core failure mode: validator misattribution.** The validator is reporting errors against the wrong characters. The actual bad spans in the prose belong to Mathilde's POV bleeding into ambiguous pronouns — but the validator blames Alan Rochford and Felix Peverel because they are named nearby. The repair model cannot fix a correct diagnosis of the wrong entities.

---

## Root Cause: Validator Misattribution

The validator reports:
- `Alan Rochford` has incorrect pronouns — found: `she`, `her`
- `Felix Peverel` has incorrect pronouns — found: `she`, `her`

The actual bad spans in the expanded draft are:

| Paragraph | Bad span | Correct referent | Correct fix |
|-----------|----------|-----------------|-------------|
| ¶2 | "He had entered the study … he had stumbled upon a nightmare … echoed in his mind" | Mathilde (POV) | she/her throughout |
| ¶5 | "He shook his head, unable to finish his thought." | Mathilde | "She shook her head…" |
| ¶7 | "He had to uncover the truth" | Mathilde | "She had to uncover the truth" |
| ¶8 | "The questions swirled in his mind like a tempest" | Mathilde | "her mind" |
| ¶10 | "We found her in the study. She was… lifeless." | Gervaise (the victim) | "We found him… He was…" |

Alan Rochford and Felix Peverel appear correctly as `he/him` in their own sentences. The `she/her` spans near their names are Mathilde's pronouns in surrounding sentences — not errors attributable to Alan or Felix. The validator is associating nearby female pronouns with the most recently named male character, producing false attributions.

**Consequence:** Because the validator emits character-level blame rather than exact spans, the repair model is told to fix "Alan Rochford = she/her" — an instruction that has no correct interpretation (Alan is already written as he/him). The repair model cannot converge, and all three attempts return the same output.

---

## Why Repeated Retries Cannot Converge

All three repair attempts receive:
- Identical system prompt (1,444 chars)
- Identical error list ("Alan Rochford: she/her; Felix Peverel: she/her")
- Identical draft JSON

There is no new information between attempts. The model is given the same ambiguous instruction three times and produces the same ambiguous result three times. Retry count alone cannot resolve a misdiagnosed error.

---

## Comparison with PROMPT_05

| | PROMPT_05 (run_17e4a016) | PROMPT_06 (run_d0b48710) |
|---|---|---|
| Prose model | gpt-5-chat | GPT-4o-mini |
| Failure chapter | Ch6 | Ch1 |
| Repair route | buildRetryRevisionPrompt (6-msg) | buildContinuityRepairPrompt (2-msg) |
| Validator error | Possibly false positive (followUpContexts) | Definitely misattributed (wrong character named) |
| Repair input | Correct chapter text + wrong errors | Correct chapter text + wrong errors |
| Convergence | Locked at 2 errors after A2 | Locked at same 2 errors across all 3 repairs |
| Root cause | Stale .js validator (R4 not applied) | Character-level blame instead of span-level blame |

Both runs share the same structural problem: the validator output drives the repair prompt, and when the validator is wrong, the repair loop cannot escape regardless of prompt quality.

---

## Required Architecture Change

### Current pipeline

```
validator → "Character X has incorrect pronouns: found she/her"
             ↓
repair prompt → "Fix Alan Rochford's pronouns"
             ↓
model → cannot identify which spans to change → no-op or wrong fix
```

### Required pipeline

```
validator → exact span + expected replacement
             ↓
repair prompt → "Replace exactly: 'He shook his head' → 'She shook her head'"
             ↓
model → applies deterministic replacement
```

### Validator change required

The validator must emit **exact offending spans** — not character-level accusations. For each error:

- Which paragraph (by index)
- The exact substring that is wrong
- The correct replacement

Example output format (replacing current format):

```
Paragraph 5: "He shook his head, unable to finish his thought."
→ should be: "She shook her head, unable to finish her thought."
Referent: Mathilde Beaumont (she/her/her)
```

### Repair prompt format (once validator emits spans)

```
You are a continuity repair editor for a mystery novel.

Task:
Apply ONLY the listed character-reference fixes to the JSON below.

Rules:
- Change only the exact spans listed in FIX LIST.
- Do not make any other edits.
- Do not rewrite for style, pacing, or atmosphere.
- Do not add or remove paragraphs.
- Preserve JSON structure exactly.
- Return valid JSON only.

Canonical pronoun map:
- Helen Courtenay = she/her/her
- Mathilde Beaumont = she/her/her
- Gervaise Tregothnan = he/him/his
- Alan Rochford = he/him/his
- Felix Peverel = he/him/his

FIX LIST:
1. Paragraph 2:
   Replace: "He had entered the study, expecting to find him engrossed in his latest literary pursuit, but instead, he had stumbled upon a nightmare."
   With:    "She had entered the study, expecting to find him engrossed in his latest literary pursuit, but instead, she had stumbled upon a nightmare."

2. Paragraph 5:
   Replace: "He shook his head, unable to finish his thought."
   With:    "She shook her head, unable to finish her thought."

3. Paragraph 7:
   Replace: "He had to uncover the truth"
   With:    "She had to uncover the truth"

4. Paragraph 8:
   Replace: "The questions swirled in his mind like a tempest"
   With:    "The questions swirled in her mind like a tempest"

5. Paragraph 10:
   Replace: "We found her in the study. She was... lifeless."
   With:    "We found him in the study. He was... lifeless."

Input JSON:
[CHAPTER JSON]
```

### Why this is the only fix that matters

The current architecture asks the repair model to solve two problems simultaneously:

1. Identify where the pronoun error actually is
2. Rewrite it correctly

The validator is failing at step 1. Until step 1 is fixed at the source (validator), no prompt improvement to the repair model can save the loop. The repair model is being handed a wrong diagnosis and asked to correct the right patient.

**Fix the validator output format first. Everything else is secondary.**

---

## Implementation Notes

- The validator change is in `packages/story-validation/src/character-validator.ts` (and its compiled `.js`)
- The current validator finds pronoun mismatches at a sentence level and attributes them to the nearest named character — this attribution logic is the bug
- The repair prompt template is in `packages/prompts-llm/src/agent9-prose.ts` → `buildContinuityRepairPrompt`
- Once the validator emits spans, `buildContinuityRepairPrompt` should accept a `fixes: Array<{paragraph: number, find: string, replace: string}>` structure instead of `errors: string[]`
- If exact-span replacement is deterministic enough, the repair step could bypass the LLM entirely and apply replacements programmatically

---

## Phased Implementation Plan

### Phase 0 — Understand the current attribution bug precisely

**Goal:** Confirm exactly why Alan Rochford and Felix Peverel are blamed.

**Task:**

The current `findIncorrectPronouns` logic in `character-validator.ts` iterates every sentence that contains a character's label. For Alan Rochford it finds ¶10: *"We found her in the study."* — Alan appears in ¶10, the sentence contains `her`, and Alan is `he/him`. The competing-entity guard only exempts a pronoun if another character named **in the same sentence** has it as their correct pronoun. Mathilde is not named in that sentence (only Alan's name is present), so `her` is not guarded and the validator blames Alan.

Same for Felix Peverel in ¶8: *"The questions swirled in his mind like a tempest"* + ¶5: *"He shook his head"* — these sentences contain Felix's name nearby and the competing female pronoun is found without a competing-entity guard.

**Deliverable:** Written confirmation (in a code comment or test) of the exact sentences and the exact guard-failure reason. No code change yet.

**Files:** read-only — `packages/story-validation/src/character-validator.ts`, `findIncorrectPronouns`

**Verification:** Manual trace of ¶5, ¶8, ¶10 against the guard logic.

---

### Phase 1 — Change validator error output to span-level

**Goal:** Replace character-level blame strings with exact-span structs.

#### 1a — Extend `ValidationError` type

In `packages/story-validation/src/types.ts`, add optional span fields to `ValidationError`:

```typescript
export interface ValidationError {
  type: string;
  message: string;
  severity: 'critical' | 'warning' | 'info';
  sceneNumber?: number;
  suggestion?: string;
  // NEW:
  span?: {
    paragraphIndex: number;   // 0-based index into chapter paragraphs array
    badText: string;          // exact substring that is wrong
    correctedText: string;    // exact replacement
    referent: string;         // canonical character name (e.g. "Mathilde Beaumont")
  };
}
```

#### 1b — Change validator to emit spans instead of blame

In `findIncorrectPronouns`, instead of returning `string[]` of incorrect pronoun words, return `Array<{ badText: string; correctedText: string; referent: string }>`.

The key change: when the validator detects a wrong subject pronoun in a sentence, it must:

1. Identify the **actual referent** — the nearest named character in the sentence or the nearest prior sentence who owns that pronoun gender (not the character being validated)
2. Record the **exact offending substring** (the `he`/`she`/`his`/`her` and its immediate clause)
3. Produce the corrected version

**Referent resolution rule:** When a sentence contains character X (male) and an incorrect `she/her`, ask: which female character was most recently established as POV in this paragraph? That is the referent. Use that character's pronouns to build `correctedText`.

This is a significant change to `findIncorrectPronouns`. The recommended approach is a two-pass paragraph scanner:

```
Pass 1 — POV tracking:
  For each paragraph, track the "active POV character" = last character named whose pronouns match the majority gender of unmarked pronouns in that paragraph.

Pass 2 — Error detection:
  For each sentence, if a pronoun doesn't match the named character in that sentence AND matches the active POV character's pronoun set, record it as a POV bleed error with the active POV character as referent.
```

**Output format change in `checkPronounAgreement`:**

```typescript
// Current:
errors.push({
  type: 'pronoun_gender_mismatch',
  message: `Character "${characterName}" has incorrect pronouns...`,
  ...
});

// New:
for (const spanError of spanErrors) {
  errors.push({
    type: 'pronoun_gender_mismatch',
    message: `Paragraph ${spanError.paragraphIndex}: "${spanError.badText}" should be "${spanError.correctedText}" (referent: ${spanError.referent})`,
    severity: 'critical',
    sceneNumber,
    suggestion: `Replace exact span as described`,
    span: spanError,
  });
}
```

**Files:** `packages/story-validation/src/types.ts`, `packages/story-validation/src/character-validator.ts`, `packages/story-validation/src/character-validator.js`

**Verification:** Existing 14 tests must still pass. Add 3 new tests:
- Sentence with male name + nearby `she` → span error attributed to female POV, not to the male character
- Sentence with victim named (male) + `her` referring to him → span error with correct victim referent
- Clean chapter → zero errors

---

### Phase 2 — Change repair consumer to use span structs

**Goal:** `buildContinuityRepairPrompt` uses exact spans in the FIX LIST instead of vague character-level errors.

#### 2a — Update function signature

In `packages/prompts-llm/src/agent9-prose.ts`:

```typescript
// Current:
export const buildContinuityRepairPrompt = (options: {
  failedChaptersJson: string;
  errors: string[];
  pronounLockLines: string[];
  lockedFacts?: string[];
}): ...

// New:
interface SpanFix {
  paragraphIndex: number;
  badText: string;
  correctedText: string;
  referent: string;
}

export const buildContinuityRepairPrompt = (options: {
  failedChaptersJson: string;
  errors: string[];          // kept for non-span errors (named walk-ons, etc.)
  spanFixes?: SpanFix[];     // NEW: span-level pronoun fixes
  pronounLockLines: string[];
  lockedFacts?: string[];
}): ...
```

#### 2b — Build FIX LIST from spans

When `spanFixes` is present and non-empty, the user message replaces the vague error list with an explicit FIX LIST:

```typescript
const fixList = options.spanFixes
  .map((fix, i) =>
    [
      `${i + 1}. Paragraph ${fix.paragraphIndex + 1}:`,
      `   Replace: "${fix.badText}"`,
      `   With:    "${fix.correctedText}"`,
    ].join('\n')
  )
  .join('\n\n');

const userContent = spanFixes.length > 0
  ? `FIX LIST — apply these exact replacements only:\n\n${fixList}\n\nInput JSON to repair:\n${options.failedChaptersJson}`
  : `Known validation errors to fix:\n${options.errors.join('\n')}\n\nInput JSON to repair:\n${options.failedChaptersJson}`;
```

#### 2c — Wire up the call site

In `generateProse` (wherever `buildContinuityRepairPrompt` is called), extract `span` fields from the `ValidationError` objects and pass them as `spanFixes`:

```typescript
const spanFixes = lastBatchErrors
  .map((e) => e.span)
  .filter((s): s is NonNullable<typeof s> => s != null);

buildContinuityRepairPrompt({
  failedChaptersJson,
  errors: lastBatchErrors.map((e) => e.message),
  spanFixes,
  pronounLockLines,
  lockedFacts,
});
```

**Files:** `packages/prompts-llm/src/agent9-prose.ts`

**Verification:** Unit test that a `ValidationError` with a `span` produces a FIX LIST block in the user message, not a "Character X has incorrect pronouns" block.

---

### Phase 3 — Make repair deterministic (bypass LLM for pure span fixes)

**Goal:** When all errors are span-level and exact, apply replacements programmatically without calling the LLM.

**Rationale:** If the validator emits `{ paragraphIndex: 4, badText: "He shook his head", correctedText: "She shook her head" }`, this is a string replacement — not a creative task. Sending it to the LLM adds latency, cost, and a chance of the model hallucinating additional changes.

#### 3a — Add `applySpanFixes` utility

In `packages/story-validation/src/pronoun-repair.ts` (new file) or inline in the prose generation worker:

```typescript
export function applySpanFixes(
  chapters: Array<{ paragraphs: string[] }>,
  fixes: SpanFix[]
): Array<{ paragraphs: string[] }> {
  const result = chapters.map((ch) => ({ ...ch, paragraphs: [...ch.paragraphs] }));
  for (const fix of fixes) {
    const chapter = result[0]; // single-chapter repair always operates on Ch N
    if (chapter && chapter.paragraphs[fix.paragraphIndex]) {
      chapter.paragraphs[fix.paragraphIndex] =
        chapter.paragraphs[fix.paragraphIndex].replace(fix.badText, fix.correctedText);
    }
  }
  return result;
}
```

#### 3b — Short-circuit the LLM call

In `generateProse`, in the `allErrorsPronounOnly` branch:

```typescript
if (allErrorsPronounOnly(lastBatchErrors) && spanFixes.length === lastBatchErrors.length) {
  // All errors have exact spans — apply deterministically, skip LLM
  const fixed = applySpanFixes(currentChapters, spanFixes);
  lastValidationResult = validateChapters(fixed, cml);
  if (lastValidationResult.valid) {
    return fixed;
  }
  // If still failing after deterministic repair, fall through to LLM repair
}
// ... existing LLM repair path
```

**Files:** New `packages/story-validation/src/pronoun-repair.ts` (or equivalent location), `apps/worker/src/` (generation orchestrator)

**Verification:**
- Unit test: `applySpanFixes` with known spans produces correct output
- Integration test: run a chapter draft with known pronoun errors through the full pipeline — confirm no LLM repair call is made and the output is valid

---

### Phase 4 — Regression tests

**Goal:** Lock in the new behaviour so future runs cannot reintroduce misattribution.

**Tests to add in `character-validator.test.ts`:**

| Test | Input | Expected |
|------|-------|----------|
| Victim named (male) + `her` referring to victim | `"We found her in the study."` with Gervaise (male) as named character | Error with `span.badText = "her"`, `span.referent = "Gervaise Tregothnan"` |
| Named male + nearby `she/her` from POV female | Alan named in sentence, surrounding `she` belongs to Mathilde POV | Error attributed to Mathilde, NOT Alan |
| Named female + nearby `he/him` from male character in same sentence | Guard fires — no false attribution | Zero errors |
| All errors have spans → deterministic repair → valid | Full paragraph set with known bad spans | After `applySpanFixes`, validator returns valid |

**Files:** `packages/story-validation/src/__tests__/character-validator.test.ts`

---

### Phase summary

| Phase | What changes | Risk | Unlocks |
|-------|-------------|------|---------|
| 0 | Trace only — no code change | None | Confirms bug location |
| 1 | Validator emits spans | Medium — changes error format; existing consumers must gracefully handle new fields | Correct error diagnosis |
| 2 | Repair prompt uses FIX LIST | Low — additive change; fallback to old path if no spans | Repair model given correct targets |
| 3 | Deterministic repair bypasses LLM | Medium — new code path; needs integration test | Removes LLM cost + hallucination risk for span-only fixes |
| 4 | Regression tests | Low | Prevents future reintroduction |

**Recommended order:** 0 → 1 → 4 (tests for Phase 1) → 2 → 4 (tests for Phase 2) → 3 → 4 (tests for Phase 3).

Do not proceed to Phase 2 until Phase 1 tests confirm the validator is emitting correct spans on the PROMPT_06 draft text.
