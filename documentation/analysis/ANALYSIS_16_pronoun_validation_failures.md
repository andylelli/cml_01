# ANALYSIS_16: Pronoun Validation Failures — Root Cause and Integration Gap

Date: 2026-03-19

## Summary

16 critical pronoun errors surfaced in a full-run validation report despite:
1. A fully-tested `repairChapterPronouns()` module existing since ANALYSIS_07.
2. Per-character pronoun rules already injected into every prose batch prompt.
3. The World First architecture (Agent 6.5 / World Builder) being active.

**Root cause**: `repairChapterPronouns()` was built in `packages/story-validation/src/pronoun-repair.ts` and documented as "IMPLEMENTED" in ANALYSIS_07, but it was **never wired into the prose post-processing pipeline**. The function has zero call-sites in production code. It is only exercised by its own unit tests.

**Result**: The deterministic safety net that was designed to eliminate residual LLM pronoun drift silently does nothing at runtime.

---

## Error Evidence (From Run Log)

The run that prompted this investigation exhibited the following profile:

- 18 prose batches generated; 4 required retry
- Chapters failing initial validation: **1, 4, 5, 14**
- Final validation after all retries: **16 critical issues** — all pronoun errors
- Affected characters: **Sidney Colton** (he/him), **Ellen Wellow** (she/her), **Derek Caldwell** (he/him), **Roger Wenlock** (he/him)

Typical error pattern (from batch validation output):
```
Chapter 1: Character "Sidney Colton" has incorrect pronouns.
Should use he/him/his but found: she
Chapter 4: Character "Ellen Wellow" has incorrect pronouns.
Should use she/her/her but found: he
```

---

## Pronoun Enforcement Architecture — Three Layers

### Layer 1: Prompt Injection (PRESENT AND ACTIVE)

Two prompt blocks inject pronoun rules before every prose batch:

**A. `buildNSDBlock()` — Narrative State block:**
```
CHARACTER PRONOUNS — never deviate from these:
  • Sidney Colton: he/him/his
  • Ellen Wellow: she/her/her
  ...
```
Source: `packages/prompts-llm/src/agent9-prose.ts` lines 1290–1302

**B. `characterConsistencyRules` block — explicit per-character rule list:**
```
CRITICAL CHARACTER CONSISTENCY RULES:
2. Gender pronouns must match character definition:
   - Sidney Colton: he/him/his
   - Ellen Wellow: she/her/her
   ...
   - Never switch pronouns mid-story
```
Source: `packages/prompts-llm/src/agent9-prose.ts` lines 1523–1527

**Status**: Both blocks exist and are injected. Prompt-level enforcement is complete.

### Layer 2: Deterministic Post-Generation Repair (BUILT, NOT WIRED)

**The module** (`packages/story-validation/src/pronoun-repair.ts`):
- `repairPronouns(text, cast)` — sentence-level pronoun correction with follow-up sentence inheritance
- `repairDialogueAttributionPronouns(text, characters)` — attribution tag repair ("she said" → "he said" when speaker is named before the opening quote)
- `repairChapterPronouns(chapter, cast)` — applies both passes to all paragraphs in a chapter; returns repaired chapter + repair count

**16 unit tests pass.** The algorithm is correct and handles edge cases including paragraph-boundary reset, "her" possessive/object disambiguation, same-gender multi-character repair, and unknown-gender no-op.

**What should happen**: After each prose batch succeeds (or after final post-processing), every chapter passes through `repairChapterPronouns()`. Wrong-gender pronouns in unambiguous single-character sentences are fixed deterministically before the validation pipeline runs.

**What actually happens**: `repairChapterPronouns()` is never called. No call-site exists anywhere in the `apps/worker/` or `packages/` source trees. Validation sees the raw LLM output.

### Layer 3: World First Character Voice Sketches (PRESENT, ORTHOGONAL)

The World Builder (Agent 6.5) produces `characterVoiceSketches` containing:
- `voiceDescription` — stylistic register, speech pattern, vocabulary level
- `fragments` — example comfortable/evasive dialogue
- `humourNote` — character-specific humour style

These are injected into every batch prompt via `buildWorldBriefBlock()` as a `## Character Voices` section.

**Why this does not help with pronoun errors**: Voice sketches address *how a character speaks and is narrated* — register, tone, vocabulary. They contain no `gender`, `pronouns`, or `preferredPronouns` field. The World Document schema (`WorldDocumentCharacterVoiceSketch`) has no pronoun field design. Voice and pronoun correctness are orthogonal concerns.

---

## Gap: `repairChapterPronouns` Not Exported, Not Called

### Missing export

`packages/story-validation/src/index.ts` does NOT export `repairChapterPronouns` or `repairPronouns`. They are accessible only from files within the package. The worker cannot import them without adding an explicit export.

Current exports (partial):
```typescript
export * from './types.js';
export * from './pipeline.js';
export * from './scoring/index.js';
// ... other validators
// pronoun-repair.ts is NOT re-exported
```

### Missing call-site

`apps/worker/src/jobs/agents/agent9-run.ts` exports `applyDeterministicProsePostProcessing()` which is the natural home for pronoun repair. This function is called at three points:
- Line 906: After first-pass prose generation
- Line 1203–1225: After retry prose generation (second pass)
- Line 1350: After a full-regeneration retry

`repairChapterPronouns()` should be applied inside this function, once per chapter, after all other deterministic fixes (grounding lead, sanitization, leakage dedup) are applied.

---

## Why the Gap Exists

ANALYSIS_07 was written when `pronoun-repair.ts` was first created. The document stated the system was "IMPLEMENTED" referring to the module itself being ready. The integration step — wiring the function into `applyDeterministicProsePostProcessing()` and exporting from the index — was documented as TODO in ANALYSIS_07's remediation table but never committed.

ANALYSIS_09 (pronoun enforcement audit) reviewed the architecture again and confirmed the module existed, but did not verify the actual call-sites. The absence of a call-site was not caught.

---

## Fix Plan

### Fix 1: Export from story-validation index

Add to `packages/story-validation/src/index.ts`:
```typescript
export { repairChapterPronouns, repairPronouns } from './pronoun-repair.js';
export type { CastEntry, PronounRepairResult } from './pronoun-repair.js';
```

### Fix 2: Wire into `applyDeterministicProsePostProcessing()`

`applyDeterministicProsePostProcessing()` takes `(prose: any, locationProfiles: any)` but does not currently receive the cast. The function signature must be extended to accept cast characters.

**Option A: Pass cast to `applyDeterministicProsePostProcessing`** (preferred)
- Add `castCharacters: CastEntry[]` parameter to the function
- Update all 3 call-sites to pass `cast.cast.characters`
- Inside the function, after leakage dedup, call `repairChapterPronouns(chapter, castCharacters)` for each chapter
- Accumulate `repairCount` across chapters for telemetry

**Option B: Apply repair in agent9-run at each call-site** (more surgical)
- Keep `applyDeterministicProsePostProcessing` signature unchanged
- After each call to `applyDeterministicProsePostProcessing`, map over `prose.chapters` applying `repairChapterPronouns`

Option A is preferred: pronoun repair is deterministic post-processing and belongs with the other deterministic steps.

### Fix 3: Add `pronounRepairsApplied` telemetry (extends existing intent)

ANALYSIS_07 already specified a `pronounRepairsApplied` counter in `validationDetails`. This was never implemented. Add it as part of Fix 2 — collect total repair count and include in `ctx.validationDetails` or `prosePassAccounting`.

---

## Impact Assessment

| Scenario | With fix | Without fix |
|----------|----------|-------------|
| LLM writes "she" for Sidney Colton in a single-character sentence | Repaired to "he" before validation | Fails validation, consumes retry budget |
| LLM writes "he said" when Ellen Wellow is the speaker | Repaired to "she said" | Fails validation |
| Two-character mixed-gender sentence with wrong pronoun | Skipped (ambiguous) — unchanged | Fails validation, but repair would also skip |
| Character with unknown gender has wrong pronoun | Skipped (no entry in repair table) — unchanged | Fails validation |
| Already correct pronoun | No change | No change |

Expected outcome of fix: **pronoun validation failures drop to near-zero in single-character sentences**. Mixed-gender sentence errors (where the repair algorithm conservatively skips) remain possible but are rare and correctly skipped by design.

---

## Related Documents

- **ANALYSIS_07** — Original design of the pronoun repair system (module implementation)
- **ANALYSIS_09** — Pronoun enforcement audit with known edge cases
- **ANALYSIS_13** — World First architecture (Agent 6.5 / Agent 9 integration)
- **ANALYSIS_15** — World First implementation bug review

---

## Status (Original Integration Gap)

| Item | Status |
|------|--------|
| Root cause identified | ✅ Done |
| Export from story-validation index | ✅ Implemented |
| Wire into `applyDeterministicProsePostProcessing` | ✅ Implemented |
| Telemetry counter `pronounRepairsApplied` | ✅ Implemented (returned in prose result) |
| Compile + test verification | ✅ Zero new errors; all pronoun-repair tests pass |

---

## Phase 2 Analysis — Residual Weaknesses (Post-Integration)

After wiring `repairChapterPronouns`, the deterministic net is active. But three structural weaknesses remain that allow LLM-generated pronoun errors to reach validation despite the pipeline now having a repair step:

### Weakness 1 — Prompt language is too weak

`characterConsistencyRules` block uses:
```
Gender pronouns must match character definition
```

This is a description, not an imperative. LLMs treat weak imperatives as lower-priority than stronger framing elsewhere in the prompt. The language should position pronoun misuse as a **continuity error** — on the same level as inventing a character who does not exist.

The "CHARACTER PRONOUNS — never deviate" label in `buildNSDBlock()` is slightly stronger, but it is a label, not a rule. There is no disambiguation instruction (what to do when a pronoun could refer to multiple people) and no self-check instruction (explicit instruction to verify before output).

### Weakness 2 — Wrong retry bucket for pronoun errors

`buildEnhancedRetryFeedback()` in `agent9-prose.ts` routes all pronoun failures to the `characterErrors` bucket. That bucket's feedback message is:
> "the ONLY characters who exist are [list]…"

This is the **name-hallucination** solution. It is the right response to an invented character but the wrong response to a correct character whose pronoun is wrong. The model is told who exists; it is not told which pronoun to use. The result is a retry that regenerates with the same pronoun error.

### Weakness 3 — False positives in the validator (missing competing-entity guard)

`findIncorrectPronouns()` in `character-validator.ts` flags any sentence where a character's wrong-gender pronoun appears — even if that pronoun legitimately belongs to another character in the same sentence.

Example:
```
She crossed the room towards Philip Brabazon.
```

The validator sees `Philip Brabazon` and detects `she` — a female pronoun for a male character. It flags a `pronoun_gender_mismatch` error for Philip. In fact, `she` belongs to a female character (the subject of the sentence). The sentence is correct. The flag is a false positive.

ANALYSIS_07 and ANALYSIS_09 both described this guard as "IMPLEMENTED". The guard was never built. These false positives consume retry budget on prose that needed no correction.

---

## Phase 2 Plan — Layered Prompt-Level and Validator Hardening

The following three phases attack each weakness independently. Each phase is a self-contained improvement that can be reviewed and merged separately.

### Compatibility Confirmation: World First Architecture

Before specifying changes, the relationship with the World First system (Agent 6.5 / World Builder / ANALYSIS_13) must be confirmed.

**World First voice sketches are orthogonal to pronoun enforcement.** `WorldDocumentCharacterVoiceSketch` has no `pronouns` field. Voice sketches address tonal register, speech vocabulary, humour style, and example dialogue fragments — not character gender. The `buildWorldBriefBlock()` function injects these as a `## Character Voices` section under the `world_document` prompt block (priority `high`).

**There is no conflict** between the World First character voice system and the proposed pronoun accuracy block. The voice block and pronoun block address entirely different LLM failure modes.

**Enhancement opportunity**: Each `### CharacterName` heading in the `## Character Voices` section is the LLM's first encounter with a character's name in the creative-context portion of the prompt. Appending `(she/her)` or `(he/him)` inline at that heading is a natural, low-friction third injection point for pronoun context — adjacent to the creative material, not buried in a constraint list. This does not require schema changes; it is a string-formatting change in `buildWorldBriefBlock()`.

**Block ordering synopsis (as built)**:
```
[1] character_consistency   — critical   ← pronouns appear here (Rule 2 of 3)
[2] world_document          — high       ← voice sketches live here; pronoun opportunity
[3] character_personality   — high
[4] physical_plausibility   — high
[5] era_authenticity        — high
[6] location_profiles       — medium
[7] temporal_context        — medium
[8] locked_facts            — critical
[9] clue_descriptions       — critical
[10] narrative_state        — critical   ← NSD pronoun block appears here
[11] continuity_context     — medium
[12] discriminating_test    — critical
[13] humour_guide           — optional
[14] craft_guide            — optional
[15] scene_grounding        — critical
[16] provisional_scoring_feedback — critical
```

A new `pronoun_accuracy` block at position 0 (before `character_consistency`) gives pronoun rules the highest priority ordering and ensures they are seen by the LLM before any other character context.

---

### Phase 1 — New Dedicated `pronoun_accuracy` Prompt Block

**Goal**: Elevate pronoun correctness from a bundled sub-rule in `characterConsistencyRules` to an authoritative, dedicated block with strong imperative framing and self-check instruction.

**What changes**:

1. **New function `buildPronounAccuracyBlock(cast)`** in `packages/prompts-llm/src/agent9-prose.ts`

   The block content adopts the following rule structure (derived from analysis of LLM failure patterns):

   ```
   PRONOUN ACCURACY — MANDATORY CONTINUITY CONTRACT

   The following pronouns are locked facts, on the same level as character names
   and hard-logic device values. Using the wrong pronoun is a continuity error,
   not a style choice.

   Canonical pronoun table:
     • [Name]: [subject]/[object]/[possessive]
     ...

   Rules:
   1. Every sentence is subject to this table — no exceptions for dialogue, reflection,
      narration, or attribution.
   2. When two or more characters of different genders are present in the same sentence
      and a pronoun could refer to more than one of them, use the character's name
      instead of the pronoun to eliminate ambiguity.
   3. A pronoun that belongs to one character must never migrate to another character
      in a neighbouring clause — especially across a semicolon or comma splice.
   4. "Her" as a possessive and "her" as an object pronoun are both female forms.
      Do not use "her" for a male character in either function.
   5. "They/them/their" as singular non-binary pronouns are fully valid in this story.
      Treat singular "they" for a specific named character as grammatically identical
      to gendered pronoun rules: same mandatory status, same continuity obligation.
   6. In dialogue attribution ("he said", "she replied"), the pronoun must agree with
      the speaker, even when the speaker is named immediately before the attribution tag.
   7. In nested clauses ("It was she who had…", "It was he that…"), pronoun gender
      must still match the referent character's canonical pronouns.
   8. Possessive determiners before body-part nouns ("she raised her hand") must agree
      with the character performing the action, not the nearest preceding character name.
   9. Before finalising this passage, mentally re-read every sentence that contains
      a pronoun and verify it against the table above. If any mismatch is found,
      correct it before outputting.
   ```

2. **Register the block** in `buildPromptContextBlocks()` as `pronoun_accuracy`, priority `critical`, inserted before `character_consistency` (position 0 in the block array).

   Apply a token budget cap of approximately 400 tokens (the table grows linearly with cast size; for a typical cast of 6–10 characters, the block is ~200 tokens; the rules add ~150 tokens).

3. **Add pronoun inline annotation** to `buildWorldBriefBlock()`:

   Current output:
   ```markdown
   ### Sidney Colton
   Voice: …
   ```

   After change:
   ```markdown
   ### Sidney Colton (he/him)
   Voice: …
   ```

   This is a purely additive string-format change. It requires no schema change and no new data — the pronouns are already available in the `characterPronouns` map passed alongside voice sketches.

4. **Update `characterConsistencyRules`** to remove Rule 2 (pronoun sub-rule) now that it has a dedicated block. Keeping duplicate rules inflates the prompt without improving enforcement; the dedicated block is unambiguously authoritative.

**Files**: `packages/prompts-llm/src/agent9-prose.ts`  
**Schema changes**: None  
**Breaking changes**: None  
**Expected outcome**: LLM pronoun errors drop significantly. The dedicated block with self-check instruction (Rule 9) triggers in-context verification before output — a pattern that measurably reduces error rates for factual-constraint tasks.

---

### Phase 2 — Pronoun-Specific Retry Feedback

**Goal**: When a pronoun validation failure reaches `buildEnhancedRetryFeedback()`, the retry instruction must target the actual failure mode — wrong pronoun — not the name-hallucination failure mode.

**What changes**:

In `buildEnhancedRetryFeedback()` (`agent9-prose.ts` ~line 2452):

1. **Extract pronoun errors** from `characterErrors` into a dedicated `pronounErrors` array. Filter on issue type `pronoun_gender_mismatch` or message content matching `/incorrect pronoun|wrong pronoun|should use he|should use she|should use they/i`.

2. **Build a new feedback section** when `pronounErrors.length > 0`:

   ```
   PRONOUN CORRECTION REQUIRED

   The following characters have wrong-gender pronouns in this chapter.
   The canonical pronoun table is repeated here — this is the authoritative source:
     • [Name]: [subject]/[object]/[possessive]
     ...

   Specific errors detected:
     • [Character]: found "[wrong pronoun]" — must use "[correct pronoun]"
     ...

   When you rewrite this chapter:
   - Every pronoun must match the table above.
   - When two characters of different genders share a sentence, use the name
     to prevent ambiguity rather than a pronoun that could be misread.
   - Verify each pronoun before finalising.
   ```

3. **Remove pronoun errors from `characterErrors`** bucket after the above extraction, so the name-hallucination feedback block no longer fires for pronoun-only failures.

**Files**: `packages/prompts-llm/src/agent9-prose.ts`  
**Schema changes**: None  
**Breaking changes**: None  
**Expected outcome**: Retry loops that are burning budget on pronoun errors now receive actionable, correctly-targeted feedback. Retry success rate for pronoun failures improves.

---

### Phase 3 — Competing-Entity Guard in `findIncorrectPronouns()`

**Goal**: Eliminate false-positive `pronoun_gender_mismatch` validation failures caused by correct pronouns belonging to other characters in the same sentence.

**What changes**:

In `findIncorrectPronouns()` (`packages/story-validation/src/character-validator.ts` ~line 215):

1. **Add a competing-entity check** after detecting a wrong-gender pronoun in a sentence:

   Before flagging the error, scan the sentence for other character names present in the same sentence (from the full `manifest: Map<string, CharacterState>` already available at the call site via `checkPronounAgreement()`).

   If any other character in the sentence has the detected pronoun as their *correct* pronoun, **suppress the flag** — the pronoun likely belongs to them.

   Pseudologic:
   ```typescript
   // wrongPronoun detected for targetCharacter (e.g. "she" for Philip Brabazon)
   // Scan sentence for other cast names
   const otherNamesInSentence = [...manifest.keys()].filter(
     name => name !== targetCharacter.name && sentence.includes(name)
   );
   const pronounOwner = otherNamesInSentence.find(name => {
     const other = manifest.get(name);
     return other && isCorrectPronounFor(wrongPronoun, other);
   });
   if (pronounOwner) {
     // The pronoun belongs to another character — not an error
     continue;
   }
   ```

2. **Pass `manifest` into `findIncorrectPronouns()`** — it is already available at the call site in `checkPronounAgreement()`, so the parameter only needs to be threaded one level down.

**Files**: `packages/story-validation/src/character-validator.ts`  
**Schema changes**: None  
**Breaking changes**: The function signature of `findIncorrectPronouns()` gains one parameter; `checkPronounAgreement()` passes the manifest through. No external callers are affected since both functions are internal to the package.  
**Expected outcome**: False-positive pronoun validation failures eliminated. Only genuine pronoun errors reach the retry pathway.

---

## Full Status

| Item | Status |
|------|--------|
| Root cause identified | ✅ Done |
| Export from story-validation index | ✅ Implemented |
| Wire into `applyDeterministicProsePostProcessing` | ✅ Implemented |
| Telemetry counter `pronounRepairsApplied` | ✅ Implemented |
| Compile + test verification (integration gap fix) | ✅ Zero new errors; all pronoun-repair tests pass |
| World First compatibility confirmed | ✅ Confirmed — voice sketches are orthogonal; no schema conflicts |
| Phase 1: `buildPronounAccuracyBlock()` with 9-rule contract | ⏳ Planned |
| Phase 1: Inline pronoun annotation in `buildWorldBriefBlock()` | ⏳ Planned |
| Phase 1: Remove duplicate pronoun sub-rule from `characterConsistencyRules` | ⏳ Planned |
| Phase 2: Pronoun-specific retry feedback branch in `buildEnhancedRetryFeedback()` | ⏳ Planned |
| Phase 3: Competing-entity guard in `findIncorrectPronouns()` | ⏳ Planned |
