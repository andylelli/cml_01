# ANALYSIS_21: Pronoun Repair — Paragraph-Boundary Reset and Alias-Blind Competing-Entity Guard

Date: 2026-03-30

## Summary

Run 2026-03-30T17:15 produced **7 critical pronoun errors** despite ANALYSIS_16 Phases 1–3 + Phase D, ANALYSIS_19 Fix 1, and ANALYSIS_19 Fix 2A all being deployed. AtmosphereRepair ran on Ch1–Ch8 using phrase-substitution only (ANALYSIS_20) and physically cannot introduce pronoun errors. All 7 errors originated from the original prose generation path.

Two further bugs were identified in the deterministic pronoun repair and validator logic:

1. **`lastSingleCharacter` resets at every paragraph boundary** — `repairPronouns()` declared `lastSingleCharacter` inside `paragraphs.map()`, wiping it to `null` at each `\n\n`. Follow-up sentences at the start of a new paragraph that contained no character name inherited `null` instead of the character established in the previous paragraph, so no repair was applied. The validator operates on full joined scene text and has no paragraph-boundary reset, producing an asymmetry that let real errors through.

2. **Competing-entity guard in validator uses canonical name only, not labels/aliases** — `isOwnedByCompetingEntity` checked `this.containsLabel(sentence, canonicalName)` where `canonicalName` is the full formal name (e.g. `"Helen Wenlock"`). When the competing character appeared in prose as `"Wenlock"` (surname), the guard did not recognise her, failed to suppress the flag, and emitted a false-positive `pronoun_gender_mismatch` error. This burned retry budget on valid prose.

---

## Error Evidence (Run 2026-03-30T17:15)

```
2026-03-30T17:16:22.733Z [ERROR   ] ValidationPipeline | final_validation | ERROR: Story validation: failed - 7 critical, 0 major issues
2026-03-30T17:16:22.734Z [ERROR   ] ValidationPipeline | validation_error | ERROR: Character "Raymond Dixon" has incorrect pronouns. Should use he/him/his but found: she, her
2026-03-30T17:16:22.734Z [ERROR   ] ValidationPipeline | validation_error | ERROR: Character "Andrew Hoare" has incorrect pronouns. Should use he/him/his but found: she
2026-03-30T17:16:22.734Z [ERROR   ] ValidationPipeline | validation_error | ERROR: Character "Andrew Hoare" has incorrect pronouns. Should use he/him/his but found: she, her
2026-03-30T17:16:22.735Z [ERROR   ] ValidationPipeline | validation_error | ERROR: Character "Raymond Dixon" has incorrect pronouns. Should use he/him/his but found: she
2026-03-30T17:16:22.735Z [ERROR   ] ValidationPipeline | validation_error | ERROR: Character "Andrew Hoare" has incorrect pronouns. Should use he/him/his but found: she, her
2026-03-30T17:16:22.736Z [ERROR   ] ValidationPipeline | validation_error | ERROR: Character "Raymond Dixon" has incorrect pronouns. Should use he/him/his but found: her
2026-03-30T17:16:22.736Z [ERROR   ] ValidationPipeline | validation_error | ERROR: Character "Andrew Hoare" has incorrect pronouns. Should use he/him/his but found: her
```

AtmosphereRepair ran on Ch1–Ch8 (phrase-substitution — cannot introduce pronoun errors). These errors are from batch generation only.

---

## Root Cause 1 — Paragraph-Boundary Reset in `repairPronouns`

### Code (before fix)

```typescript
// packages/story-validation/src/pronoun-repair.ts — repairPronouns()
const repairedParagraphs = paragraphs.map((paragraph) => {
  // ...sentence splitting...

  let lastSingleCharacter: CharacterPronounInfo | null = null;   // ← resets per paragraph

  const repairedSegments = segments.map((segment) => {
    if (mentioned.length === 0 && lastSingleCharacter) {
      // Repairs follow-up sentences using carry-forward
    }
    // ...
  });
});
```

Because `lastSingleCharacter` was declared inside `paragraphs.map()`, the carry-forward context was
destroyed at every `\n\n`. A chapter whose first paragraph firmly establishes "Raymond Dixon" (male)
then opens the next paragraph with `"She placed it on the desk."` — with no character name — had that
sentence returned unrepaired.

The validator in `character-validator.ts` does not split by paragraph. It operates on `scene.text` —
the full joined chapter text — and has a 1-sentence lookahead window. It correctly flagged the error.
The repair silently skipped it. This is the asymmetry that caused 7 surviving errors after Fix 1 and
Fix 2A.

### Illustration

```
Chapter paragraph 1:
  "Raymond Dixon studied the envelope. He recognised the handwriting."
                                                     ↑ lastSingleCharacter = Dixon

[paragraph break — \n\n — previouslyreset lastSingleCharacter to null]

Chapter paragraph 2:
  "She placed it back on the desk."
   ↑ mentioned.length === 0, lastSingleCharacter === null → SKIPPED (before fix)
   ↑ mentioned.length === 0, lastSingleCharacter === Dixon → REPAIRED "He" (after fix)
```

### Fix

Moved `lastSingleCharacter` declaration outside `paragraphs.map()`. It now persists across paragraph
boundaries within the same text block. Within a paragraph, a mixed-gender sentence still sets
`lastSingleCharacter = null` (the existing safety mechanism — unchanged) to prevent ambiguous
attribution to either of two named characters of different genders.

Additionally, `repairChapterPronouns()` was refactored to call `repairPronouns()` on the **full
joined chapter text** rather than per-paragraph. This is the essential companion change: the
`lastSingleCharacter` cross-paragraph carry only fires when the function receives multi-paragraph
input. The old per-paragraph loop made it structurally impossible for carry to cross a paragraph break.
Dialogue-attribution repair continues to run per-paragraph on the split result.

---

## Root Cause 2 — Alias-Blind Competing-Entity Guard in Validator

### Code (before fix)

```typescript
// packages/story-validation/src/character-validator.ts — isOwnedByCompetingEntity()
const isOwnedByCompetingEntity = (pronoun: string, sentence: string): boolean => {
  for (const [name, state] of manifest.entries()) {
    if (name === targetName) continue;
    if (!this.containsLabel(sentence, name)) continue;   // ← canonical name only
    const p = state.pronouns;
    if (p.subject === pronoun || p.object === pronoun || p.possessive === pronoun) {
      return true;
    }
  }
  return false;
};
```

`name` is the canonical full name (e.g. `"Helen Wenlock"`). Prose commonly refers to characters by
surname only (`"Wenlock"`) or via configured aliases (`"Inspector Wenlock"`). If the competing
female character in a sentence appeared as `"Wenlock"`, `this.containsLabel(sentence, "Helen Wenlock")`
returned false, the guard did not suppress, and a `pronoun_gender_mismatch` error was emitted for
a sentence that was grammatically correct.

This did not introduce new pronoun errors but burned retry budget on false positives and could cause
valid story text to fail validation and trigger costly chapter regeneration.

### Fix

Threaded `canonicalToLabels` (the full label index — canonical name + all aliases + surnames, already
built in `validate()`) through:

```
validate()
  → checkPronounAgreement(..., canonicalToLabels)
    → findIncorrectPronouns(..., canonicalToLabels)
      → isOwnedByCompetingEntity: uses canonicalToLabels.get(name) instead of bare name
```

`isOwnedByCompetingEntity` now checks `this.containsAnyLabel(sentence, labels)` where `labels`
includes every registered label for the competing character. Surname-only and alias-only appearances
are correctly detected.

---

## Files Changed

| File | Change |
|------|--------|
| `packages/story-validation/src/pronoun-repair.ts` | Move `lastSingleCharacter` outside `paragraphs.map()`. Refactor `repairChapterPronouns` to pass full joined text to `repairPronouns`. |
| `packages/story-validation/src/character-validator.ts` | Thread `canonicalToLabels` through `checkPronounAgreement` → `findIncorrectPronouns` → `isOwnedByCompetingEntity`. Use full label set in guard. |
| `packages/story-validation/src/__tests__/pronoun-repair.test.ts` | Add two tests: `carries lastSingleCharacter across paragraph boundaries` and `does not carry context from a mixed-gender sentence into a new paragraph`. |

---

## Additional Context — `[ANALYSIS_21]` tags in `agent9-prose.ts`

Two calls to `repairChapterPronouns` were added inside `generateProse()` in `agent9-prose.ts` and
tagged `[ANALYSIS_21]`:

1. **After initial chapter generation** (line ~3310): repairs any pronoun mismatch before the
   per-chapter pre-commit validation gate. Converts `pronoun_gender_mismatch` from a retry trigger
   into a silent zero-cost fix at the chapter level.

2. **After underflow expansion** (line ~3423): underflow expansion is a full LLM rewrite and can
   introduce fresh pronoun mismatches. This call ensures the expanded chapter is clean before
   re-entering the pre-commit validator.

These calls operate on the cast characters supplied to `generateProse()` via `inputs.cast.characters`
and are idempotent relative to the later `applyDeterministicProsePostProcessing` call in `agent9-run.ts`
(ANALYSIS_19 Fix 1).

---

## Test Results

23/23 tests pass in `pronoun-repair.test.ts` and `character-validator.test.ts`. Zero regressions in
the full test suite. 3 pre-existing failures in unrelated files (`agent9-prose.test.ts` Fix 7,
`story-length-targets.runtime.test.ts`, `agent7-narrative-scorer.test.ts`) confirmed pre-existing by
reproducing identically without these changes.

---

## Status

| Item | Status |
|------|--------|
| Root cause identified: `lastSingleCharacter` paragraph reset | ✅ Done |
| Root cause identified: alias-blind competing-entity guard | ✅ Done |
| Root cause identified: validator/repair label-set divergence (surname-only) | ✅ Done |
| Fix: `lastSingleCharacter` moved outside `paragraphs.map()` | ✅ Implemented |
| Fix: `repairChapterPronouns` joined-text refactor | ✅ Implemented |
| Fix: `isOwnedByCompetingEntity` uses `canonicalToLabels` | ✅ Implemented |
| Fix: `buildCharacterManifest` adds auto-surname + auto-firstname to `aliasToCanonical` | ✅ Implemented |
| Tests: 2 new cross-paragraph tests | ✅ Passing |
| Tests: 2 new competing-entity surname-only tests | ✅ Passing |
| Verify: fixes reduce run errors to zero | ⧳ Needs next run |

---

## Related Documents

- **ANALYSIS_16** — Pronoun validation failures: integration gap, Phase 1–3, Phase D
- **ANALYSIS_19** — Residual pronoun errors after Phase D: missing cast at line 1242 (Fix 1), multi-character sentence heuristic (Fix 2A)
- **ANALYSIS_20** — AtmosphereRepair phrase-substitution rewrite (eliminates pronoun risk at source)
