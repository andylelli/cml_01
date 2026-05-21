## Solution Ideas — TYPE 2: Pronoun Drift

**Date:** 2026-05-18 | **Updated:** 2026-05-19  
**Status:** 4 of 5 ideas implemented; Idea 4 (actor/object disambiguation) still pending as T2-7

---

## Progress

| # | Idea | Implemented As | Status |
|---|------|----------------|--------|
| 1 | Pronoun table at prompt tail (recency fix) | T2-0 (block reorder) + T2-1 (user-message lock) | ✅ Done |
| 2 | Dialogue attribution name mandate | T2-3 (Rule 10 in `buildPronounAccuracyBlock`) | ✅ Done |
| 3 | Exact sentence quoting in pronoun retry feedback | T2-6 (`extractPronounOffendingSentences` + feedback wiring) | ✅ Done |
| 4 | Actor/object disambiguation in repair pass | T2-7 (`pronoun-repair.ts`) | ✅ Done |
| 5 | Male lone-character default rule | T2-4 (Rule 11, cast-conditional) | ✅ Done |

> T2-8 (paragraph context reset) and T2-ESC (attempt-3 escalation) are additional repair-layer items documented in the implementation plan but not derived from these ideas.

---

*Added 2026-05-18. Based on code audit of `agent9-prose.ts` (`buildPronounAccuracyBlock`, `buildPromptContextBlocks`), `packages/story-validation/src/pronoun-repair.ts`, `apps/worker/src/jobs/agents/agent9-run.ts` (`applyDeterministicPronounSweep`, `repairChapterPronouns`), and direct analysis of pronoun failures in story `mystery-1779127377298` (canary run type1-r1).*

---

### Root Cause Diagnosis

Pronoun drift in this story affects two characters across multiple chapters: Captain Ivor Hale (male) receives `she/her` pronouns, and Beatrice Quill (female) receives `he/him` pronouns. The story has a 3:1 female-to-male cast ratio (three women, one man), making both characters vulnerable to the LLM's majority-gender default.

**Three distinct failure modes** produce the visible errors:

**Failure Mode A — Same-gender-match bypass in the repair pass.**
The deterministic `repairPronouns` function only repairs a pronoun when its gender is *wrong for the character named in the sentence*. In the sentence `"'Captain Hale,' he began"` (where Beatrice is the speaker, not Hale), `he` is *correct* for Hale (male) — so the repair pass fires no fix. But the `he` actually refers to Beatrice. The function cannot detect "right gender, wrong character" because that requires understanding sentence-level subject attribution, not just name co-occurrence.

**Failure Mode B — Multi-character ambiguity skip.**
When two or more characters are mentioned in the same sentence, the repair pass deliberately skips the sentence to avoid false repairs. But some skipped sentences are unambiguous — e.g., `"Beatrice turned her attention to her"` where both `her` instances refer to Captain Hale (male). One character is the acting subject (Beatrice), the other is the object (Hale). The repair pass cannot distinguish actor from object, so it skips.

**Failure Mode C — Pronoun block recency failure.**
The `buildPronounAccuracyBlock()` output is placed at **position 0** of the developer context (first of 22 ordered sections). The generation instruction comes after position 21. By the time the LLM generates chapter prose, the pronoun table is thousands of tokens behind it. The "Lost in the Middle" attention gradient means the pronoun rules are among the *least* attended constraints at generation time, even though they are rated `priority: 'critical'`.

**The repair pass also fails silently.** When `repairChapterPronouns` runs but cannot fix an error, the validation output says `"Character X has incorrect pronouns. Should use he/him/his but found: her, she"` — but does not quote the specific offending sentences. The retry prompt therefore asks for a general fix without telling the LLM exactly which sentences to change.

---

### Idea 1 — Pronoun Table at Prompt Tail (Recency Fix)

The pronoun table is currently at position 0 (first block, furthest from generation). Inject a **compact version** of the pronouns table as the very last item in the developer section, immediately before the `user` message, so it is adjacent to the scene outline and generation instruction.

The full `buildPronounAccuracyBlock` output (~600 tokens) stays at position 0 for completeness. A second **compact reminder** (~80 tokens) is added at the tail:

```
⛔ PRONOUN LOCK — immediately before writing:
• Beatrice Quill — she/her (NEVER he/him)
• Dr. Mallory Finch — she/her (NEVER he/him)
• Captain Ivor Hale — he/him (NEVER she/her)
Every unanchored pronoun must match the character currently in focus. When in doubt, use the full name.
```

This compact block requires ~10 lines added to `buildNSDBlock` or injected into the existing `nsdBlock` tail position, where it will benefit from the same recency advantage as the dead-character block.

**Files**: `agent9-prose.ts` — `buildNSDBlock()` or a new `buildPronounReminderTail()` function appended to the NSD block.

---

### Idea 2 — Dialogue Attribution Name Mandate

The single most common Failure Mode A pattern is dialogue attribution with a pronoun instead of a name:

```
WRONG: "'I have no alibi,' he said." (when speaker is female)
WRONG: "'Captain Hale,' he began, his voice steady." (where Beatrice is speaking)
```

Add one rule to `buildPronounAccuracyBlock()` (after the existing Rule 9):

> **Rule 10**: In all dialogue attribution (`'...' [subject] [verb]`), use the speaker's FULL NAME, not a pronoun. WRONG: `"'...' she said"` / `"'...' he replied"`. RIGHT: `"'...' Beatrice said"` / `"'...' Dr. Finch replied"`. This applies even when the speaker is obvious from context.

This is deliberately stricter than natural prose fiction but justified in a generated story: it eliminates Failure Mode A for the largest class of attribution errors by removing pronoun ambiguity at dialogue junctions entirely.

**File**: `agent9-prose.ts` — `buildPronounAccuracyBlock()`, append Rule 10.

---

### Idea 3 — Exact Sentence Quoting in Pronoun Retry Feedback

Currently when the validation detects a pronoun error and triggers a retry, the feedback says:

> `"Character 'Captain Ivor Hale' has incorrect pronouns. Should use he/him/his but found: her, she"`

This tells the LLM *what* the error is but not *where*. The retry regeneration cannot surgically fix two sentences in a 900-word chapter when it doesn't know which ones.

**Extend the pronoun validation to return offending sentences.** After `repairChapterPronouns` runs, extract the sentences that still contain wrong pronouns. Inject them into the retry prompt via `buildEnhancedRetryFeedback` as a `pronounErrors` bucket with explicit surgery instructions:

```
═══ ⛔ PRONOUN ERRORS (2) ═══
Character Captain Ivor Hale uses he/him/his — NEVER she/her.

Offending sentences found:
• "'I cannot be responsible for Eleanor's death.' Her tone was firm." 
  → Change "Her" to "His"
• "As Beatrice spoke, he could see the weight of the situation..."
  → "he" refers to Beatrice (female) — change to "she"

✓ Rewrite each sentence above with the correct pronoun. Do not alter other sentences.
```

**Files**: `packages/story-validation/src/pronoun-repair.ts` — add `offendingSentences: string[]` to `PronounRepairResult`. `apps/worker/src/jobs/agents/agent9-run.ts` — pass offending sentences through to validation errors. `agent9-prose.ts` — extend `buildEnhancedRetryFeedback` pronoun errors bucket.

---

### Idea 4 — Failure Mode B: Actor/Object Disambiguation Rule

When two characters appear in the same sentence, the repair pass skips it as "ambiguous." But actor/object positions are structurally distinguishable for the most common patterns:

- `"[NAME1] turned [PRONOUN] attention to [NAME2]"` — `PRONOUN` is possessive for NAME1 (actor)
- `"[NAME1] approached [PRONOUN]"` — `PRONOUN` is object form for NAME2 (target)

Add a **subject-position heuristic** to `repairPronouns`:

> If a sentence contains exactly two named characters AND one pronoun, check whether the pronoun's position follows the first-named character as subject (possessive) or follows a verb as object (object form). If the position is unambiguously actor (possessive immediately after first name + verb) or object (after a transitive verb with first-name subject), apply the repair.

This extends `repairPronounsInSegment` with a structural position check — not a full parse, just a regex heuristic for the two commonest patterns.

**File**: `packages/story-validation/src/pronoun-repair.ts` — extend `repairPronouns()` with two-character actor/object disambiguation patterns.

---

### Idea 5 — Male Lone-Character Default Rule

The cast is 3 female : 1 male. When the LLM writes a paragraph with no named characters and defaults to "she/her", it is statistically likely to be correct (3 of 4 characters). When it defaults to "he/him" it is almost certainly wrong unless the most recent named character is Hale.

Add a specific rule to `buildPronounAccuracyBlock()`:

> **Rule 11 — Male character isolation rule**: Captain Ivor Hale is the only male character in this story. Any use of `he/him/his/himself` must refer to him, and no other character. If you have just written a sentence about Beatrice Quill, Dr. Mallory Finch, or Eleanor Voss and the next sentence uses `he`, that is an error — change `he` to `she`. When the next sentence after describing a female character has no named subject, use `she/her` (the majority gender of this cast).

This leverages the story-specific 3:1 ratio as a constraint the LLM can apply without name-lookup.

**File**: `agent9-prose.ts` — `buildPronounAccuracyBlock()`, append Rule 11 (injected only for casts where `maleCount === 1 && femaleCount >= 2`).

---

### Idea 6 — Repair Pass: Paragraph-Level Context Window

The current repair pass resets `lastSingleCharacter` at paragraph boundaries unless `crossParagraphInheritance` is enabled. Even with inheritance enabled, the guard `oppositeGenderPresent` triggers if the new paragraph merely *mentions* a character of the opposite gender — regardless of whether that character is the paragraph's subject.

**Improvement**: instead of checking whether any opposite-gender character is mentioned anywhere in the new paragraph, check whether an opposite-gender character is the *subject of the first sentence* of the paragraph. If the first sentence names a character, that character becomes the new context. If it does not name any character, inherit the previous paragraph's `lastSingleCharacter`.

This is a tighter attribution rule: inheritance is broken only by an active, named new subject, not by a mere mention.

**File**: `packages/story-validation/src/pronoun-repair.ts` — modify cross-paragraph inheritance logic in `repairPronouns()`.

---

### Idea 7 — Compact Pronoun Header in User Message

The user message currently starts:

```
Write the full prose following the outline scenes.

[chapterObligationBlock][timelineStateBlock]...

Outline scenes:
[JSON]
```

The pronoun table, if placed here, would be the last thing the LLM reads before generating — higher attention weight than either the developer section (position 0) or the NSD tail.

Add a 5-line pronoun header immediately before `Outline scenes:`:

```typescript
const pronounMicroBlock = cast
  .filter((c: any) => ['male','female'].includes(c.gender?.toLowerCase()))
  .map((c: any) => `• ${c.name} — ${c.gender?.toLowerCase() === 'male' ? 'he/him' : 'she/her'} (NEVER ${c.gender?.toLowerCase() === 'male' ? 'she/her' : 'he/him'})`)
  .join('\n');
const pronounHeader = `PRONOUN LOCK (mandatory — verify before each sentence):\n${pronounMicroBlock}\n\n`;
```

Prepend `pronounHeader` to the user string before `Outline scenes:`.

This adds ~40 tokens to the user message — negligible budget cost, maximum recency effect.

**File**: `agent9-prose.ts` — modify the `user` string construction near line 3906.

---

### Idea 8 — High-Risk Scene Detection with Targeted Warning

Scenes listing characters of both genders in `scene.characters` are structurally more likely to produce pronoun confusion. Before sending the prompt, analyse `scenesForPrompt` for mixed-gender scenes and inject a targeted warning for each:

```typescript
const mixedGenderScenes = scenesForPrompt.filter((s: any) => {
  if (!Array.isArray(s.characters)) return false;
  const genders = s.characters.map((n: string) => cast.find((c: any) => c.name === n)?.gender?.toLowerCase());
  return genders.includes('male') && genders.includes('female');
});
if (mixedGenderScenes.length > 0) {
  // Prepend to completenessContractBlock or user message:
  warnings += `⚠ MIXED-GENDER SCENES: scenes ${mixedGenderScenes.map((s: any) => s.sceneNumber).join(', ')} contain both male and female characters. Use character names rather than pronouns whenever gender could be ambiguous.\n`;
}
```

**File**: `agent9-prose.ts` — scene processing block before the user message is assembled.

---

### Recommended Approach

Not one idea alone — same layered defence as TYPE 1. The highest-leverage combination:

| Layer | Mechanism | Idea # | Cost |
|-------|-----------|--------|------|
| Prompt placement | Compact pronoun table as tail of NSD block (last before generation) | 1 | Low |
| Prompt placement | Pronoun micro-header at top of user message scene outline | 7 | Very low |
| Prompt content | Dialogue attribution name mandate (Rule 10) | 2 | Low |
| Prompt content | Male lone-character isolation rule (Rule 11 — cast-conditional) | 5 | Low |
| Retry feedback | Exact offending sentence quoting in pronoun error feedback | 3 | Medium |
| Repair pass | Actor/object disambiguation for two-character sentences | 4 | Medium |
| Repair pass | First-sentence-subject paragraph context reset | 6 | Medium |
| Detection | High-risk scene warning (mixed-gender cast scenes) | 8 | Very low |

**Priority order for implementation:**

1. **Idea 7** (user message pronoun header) — ~5 lines, maximum recency benefit, zero regression risk
2. **Idea 1** (NSD tail compact reminder) — ~10 lines, same recency rationale as Ghost Protocol for TYPE 1
3. **Idea 2** (dialogue attribution Rule 10) — ~3 lines added to pronoun block text
4. **Idea 3** (exact sentence quoting in retry) — medium code change but highest impact on retry success rate
5. **Idea 5** (male lone-character rule) — cast-conditional, safe, directly addresses majority-gender default
6. **Idea 4** (actor/object disambiguation) — repair pass improvement, reduces Failure Mode B
7. **Idea 6** (paragraph context reset improvement) — repair pass improvement, reduces Failure Mode C
8. **Idea 8** (mixed-gender scene warning) — detection only, can be added at any point

---

### Delivery Targets

| # | Change | File | Scope |
|---|--------|------|-------|
| T2-1 | Add pronoun micro-header to user message | `agent9-prose.ts` | `user` string assembly |
| T2-2 | Add compact pronoun reminder to NSD block tail | `agent9-prose.ts` | `buildNSDBlock()` |
| T2-3 | Add Rule 10 (dialogue attribution) to pronoun block | `agent9-prose.ts` | `buildPronounAccuracyBlock()` |
| T2-4 | Add Rule 11 (male isolation) conditionally to pronoun block | `agent9-prose.ts` | `buildPronounAccuracyBlock()` |
| T2-5 | Extend `PronounRepairResult` with `offendingSentences` | `pronoun-repair.ts` | `repairPronouns()` return type |
| T2-6 | Pass offending sentences into retry feedback | `agent9-run.ts` + `agent9-prose.ts` | `buildEnhancedRetryFeedback` |
| T2-7 | Actor/object disambiguation in two-character sentences | `pronoun-repair.ts` | `repairPronouns()` |
| T2-8 | First-sentence-subject paragraph context reset | `pronoun-repair.ts` | cross-paragraph inheritance |

---
