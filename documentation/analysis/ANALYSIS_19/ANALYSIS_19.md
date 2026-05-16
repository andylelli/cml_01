# ANALYSIS_19: Consolidated ChatGPT Story Review — Cross-Run Issue Audit & Full Fix Plan

**Date:** 2026-05-15  
**Sources:** 4 × `chatgpt-review.txt` from stories:
- `story_20260512-1842` (narrative-level review)
- `story_20260514-1917` (detailed chapter-by-chapter)
- `story_20260514-1931` (empty — no review recorded)
- `story_20260514-2231` (detailed chapter-by-chapter, most complete)

**Scope:** All recurring prose quality failures observed by an external (ChatGPT) reader, mapped to their pipeline root causes, arranged by responsible agent, and costed by severity. This document also proposes a ground-up architectural fix plan including blue-sky redesign options.

---

## Section 1 — Issue Inventory by Agent

### 1.1 Agent 3 — CML Generator

| ID | Issue | Severity | Frequency |
|----|-------|----------|-----------|
| A3-1 | Victim is a named cast member with a full character profile, but the CML carries no `participates_after_death: false` marker. Agent 9 has no way to know this character must not appear alive in chapters 2+. | Critical | Every run |
| A3-2 | The canonical clock reading is declared as a locked fact, but there is no constraint preventing Agent 3 from generating scene descriptions or timeline anchors that use a different time value. | Critical | Every run |
| A3-3 | The murder method (`CASE.solution.method`) and cause of death are defined in CML but never surfaced explicitly to Agent 9's chapter generation loop. They appear in prose only when the LLM happens to include them. | High | Every run |
| A3-4 | Motive foreshadowing is not structured into the CML. The culprit's motive emerges only at the accusation scene. No prior chapters are obligated to hint at it. | Medium | Every run |

---

### 1.2 Agent 5 — Clue Extraction

| ID | Issue | Severity | Frequency |
|----|-------|----------|-----------|
| A5-1 | The `clue.pointsTo` field often contains internal annotation language: "The detail is explicit: ten minutes past eleven" / "This detail added late texture without changing the essential deduction chain." These strings are injected verbatim into chapter obligation blocks, and the LLM echoes them into prose as debug notes. | Critical | Observed in 2/3 detailed reviews |
| A5-2 | The `clue.description` field similarly carries generation notes ("Dinner served at nine remains a late texture detail in the case background") that read like planning instructions, not story-world facts. | High | Observed in 2/3 reviews |
| A5-3 | The scratch on the clock casing is the primary physical evidence but never specifies HOW it identifies the culprit. The clue chain ends at "tampering occurred" rather than "culprit X, because only X had access to Y mechanism at time Z." | High | Every run |
| A5-4 | Red herring clues are assigned but their elimination pathway is not included in any clue field. Chapter prompts receive "include this red herring" with no obligation to also include its elimination rationale. | Medium | Every run |

---

### 1.3 Agent 7 — Narrative Formatter

| ID | Issue | Severity | Frequency |
|----|-------|----------|-----------|
| A7-1 | Scene location metadata (e.g., "The Library") is passed to Agent 9 as the `locationAnchor` string inside the chapter obligation block. The LLM copies this string verbatim into the opening prose line: "The Library in [Town], England carried the smell of..." — this is a scene-template bleed that fails the fingerprint linter on attempt 1. | Critical | Every run, most chapters |
| A7-2 | The narrative formatter assigns generic scene titles ("The Drawing Room," "The Library") that appear to confuse the LLM when the actual action in a chapter occurs in a different room. The location metadata and the narrative action are sometimes inconsistent. | High | Every run |
| A7-3 | No chapter-type markers are assigned. All 10 chapters are treated identically. There is no distinction between discovery, interrogation, discriminating-test, and resolution chapters. Each has identical generation obligations structure. | High | Every run |

---

### 1.4 Agent 9 — Prose Generator (Primary Failure Surface)

This is where the majority of issues manifest. They are grouped by root-cause category.

#### 1.4.A Template / Metadata Bleed

| ID | Issue | Severity |
|----|-------|----------|
| A9-TB-1 | **Scene-template opening sentence.** Every chapter is opened with the location metadata label as prose: "The [LocationName] in [Town], England carried..." / "The Drawing Room, suffused with the weight of..." This is caused by `locationAnchor` in the obligation block being read by the LLM as an opening-sentence template rather than as a constraint. The linter catches this on retry 1, but it consumes a retry slot every time. | Critical |
| A9-TB-2 | **"in every corridor" / "the atmosphere, charged with" sentence fragments.** The LLM inserts structural phrases from the scene-template sections of the prompt into the opening paragraph, producing grammatically malformed sentences. These survive the pronoun and fingerprint linters but not a human reader. | High |
| A9-TB-3 | **Debug note passthrough.** "The detail is explicit: ten minutes past eleven" and "This detail added late texture without changing the essential deduction chain" appear verbatim inside prose paragraphs. These come from `clue.pointsTo` being injected unsanitized into the chapter obligation block. The LLM re-echoes them as if they are narrative voice. | Critical |
| A9-TB-4 | **"the rain continued to summer outside."** A sentence fragment where the LLM failed to resolve a structured atmosphere instruction (season + weather combined) into prose. Suggests the weather/season block is being generated as structured data rather than prose-friendly language. | Medium |

---

#### 1.4.B Pronoun Drift

| ID | Issue | Severity |
|----|-------|----------|
| A9-PR-1 | **Dr. Finch gender oscillation.** Finch is female in CML but is frequently referred to as "he/him/his" in chapters 2–9, then "she/her" in adjacent sentences. The 9-rule pronoun block and deterministic sweep together reduce this to 1–2 validation retries per affected chapter, but they do not eliminate it. | Critical |
| A9-PR-2 | **Captain Hale gender oscillation.** Hale (male) is referred to as "she" repeatedly. The repair sweep repairs the most obvious cases but misses cases inside attribution clauses ("he said" after Hale dialogue which is correct, then "she had told him" in the next clause which is wrong). | Critical |
| A9-PR-3 | **Eleanor/detective misgendering.** Eleanor (female) is addressed as "he/him/his" at chapter scale. This is particularly jarring because Eleanor is the POV character and the error then applies to "his focus", "he resolved", "he could not shake the feeling." | Critical |
| A9-PR-4 | **Pronoun migration across clauses.** A specific failure mode: the LLM tracks character gender correctly for the primary subject of a paragraph, then loses the antecedent when a second character is introduced, applying the second character's gender to the first character's pronoun in the closing clause. Example: "Eleanor entered. Hale greeted her. He crossed his arms [✓]. She had no alibi [✗ — "she" still refers to Eleanor but mid-sentence context swapped to Hale]." | High |

---

#### 1.4.C Clock / Timeline Inconsistency

| ID | Issue | Severity |
|----|-------|----------|
| A9-TL-1 | **Clock value drift across chapters.** The locked fact "ten minutes past eleven" appears in 5 different surface forms across chapters of the same story: "11:10", "11:05", "eleven-ten", "eleven past eleven", "quarter after eleven". The FROZEN TIMELINE STATE block is present in every chapter prompt but is either ignored or misread. `repairWordFormLockedFacts` corrects digit-to-word form but does not handle word-to-word variants (e.g., "eleven past eleven" is not caught because it is already in word form but differs from the canonical "ten minutes past eleven"). | Critical |
| A9-TL-2 | **Time arithmetic contradiction.** Multiple chapters assert different conclusions about what the clock time proves: "she was killed at 10:15 PM" (Ch3), "the clock was stopped at 11:10 PM" (Ch5), "Beatrice was seen alive at ten o'clock" (Ch7). These three statements are not self-consistent but no cross-chapter consistency gate exists. | High |
| A9-TL-3 | **"the clock stopped at 11:10 but Beatrice was seen alive at ten o'clock" — the contradiction is too weak.** A clock stopped at 11:10 does not contradict a witness seeing someone alive at 10:00. The mystery's central timeline paradox needs a stronger formulation that actually forces the deduction. The CML may be generating a logically weak discrimination test. | Medium |

---

#### 1.4.D Dead Victim Appearing Alive

| ID | Issue | Severity |
|----|-------|----------|
| A9-DV-1 | **Victim (Beatrice Quill) is the murder victim, discovered dead in Chapter 1, but appears as a live speaking character in Chapters 2–10.** This is the most catastrophic structural failure: the entire mystery premise collapses when the dead person gives testimony. | Critical |
| A9-DV-2 | **`victimConfirmedDeadChapter` detection is fragile.** The flag is set only if the batch text contains both the victim's name AND a death-pattern word. If Chapter 1 says "her body was found" without naming Beatrice in that exact sentence, the flag is never set. Without the flag, the NSD block does not inject "Do not treat victim as alive" into subsequent chapters. | Critical |
| A9-DV-3 | **The victim has a full character profile** (from Agent 2b), a personality block, voice sketch, and character arc. These are injected into every chapter prompt under "active characters." There is no mechanism to suppress the victim's character profile from chapters after their death. | High |

---

#### 1.4.E Investigation Stagnation / Chapter Repetition

| ID | Issue | Severity |
|----|-------|----------|
| A9-IS-1 | **Same beats repeated across 5–7 chapters.** Rain against the windowpanes, the clock frozen at quarter past ten, Finch fidgeting with cufflinks, Hale crossing arms, Beatrice feeling determination, "for Eleanor's sake", "we must gather more evidence." The n-gram fingerprint linter flags only exact or near-exact paragraph duplication, not thematic/structural repetition. | Critical |
| A9-IS-2 | **Each chapter generates from scratch without knowledge of what was established in prior chapters.** The `continuityTail` is only 220 characters of the previous chapter's closing beat. The LLM has no structured knowledge of: which alibis have been established, which deductions have been made, which evidence has already been found. It restarts the investigation from scratch each time. | Critical |
| A9-IS-3 | **Alibi clearing is asserted, not dramatized.** "Dr. Finch's alibi is confirmed by multiple witnesses" appears as a single sentence. The chapter never shows the confirmation happening as a scene. The obligation block mandates that certain clues appear but does not mandate that an alibi-confirmation event occurs as a narrative event. | High |
| A9-IS-4 | **Chapters 9 and 10 are near-identical.** Both contain the confrontation, both end with the investigation still unresolved, both fail to produce a confession or conclusion. | High |

---

#### 1.4.F Missing Resolution

| ID | Issue | Severity |
|----|-------|----------|
| A9-RES-1 | **Final chapter does not resolve the story.** Chapter 10 ends with the characters still investigating. No confession, no arrest, no explanation of the murder method, no consequences. The DENOUEMENT REQUIREMENT is present in the system prompt but is not validated — the per-chapter audit JSON has no `resolution_present` field. | Critical |
| A9-RES-2 | **Confession is too brief and generic.** When a confession occurs, it is a single generic line: "I did what I had to do to protect myself." No detail of the murder method, no emotional weight, no explanation of how the culprit used the clock. | High |
| A9-RES-3 | **Murder method never established in prose.** Despite the CML specifying the exact mechanical device used, no chapter ever explains clearly HOW the murder was committed. "The clock was tampered with" is as specific as it gets. | High |

---

#### 1.4.G Encoding / Malformed Sentences

| ID | Issue | Severity |
|----|-------|----------|
| A9-ENC-1 | **UTF-8 mojibake.** "â€"", "didnâ€™t", "Itâ€™s" artifacts in output. These are caught by `sanitizeProseText` in most cases but occasionally survive. | Medium |
| A9-ENC-2 | **Malformed sentence fragments.** "the lie that festered in her heart the manor", "the rain continued to summer outside", "made the tense and foreboding… mood impossible to ignore." These are structurally broken sentences produced when the LLM fails to complete a template-generated sentence. They are not caught by any current validator. | High |
| A9-ENC-3 | **"the doctor Finch"** instead of "Dr. Finch." Wrong title format used repeatedly. This suggests the LLM is generating from a character description that uses "the doctor" as a reference rather than the canonical name. | Low |

---

## Section 2 — Root Cause Analysis

### 2.1 The Core Architectural Problem

Agent 9 generates chapters in **batches of 1 (batchSize=1)** with only these inter-chapter state items:
- `lockedFacts[]` — locked canonical values (good)
- `characterPronouns{}` — pronoun table (good)
- `cluesRevealedToReader[]` — clue IDs already seen (good)
- `victimConfirmedDeadChapter?` — fragile, prose-derived flag (broken)
- `continuityTail` — 220-char excerpt from previous chapter (insufficient)

What it **does NOT carry**:
- Canonical murder method and cause of death
- Per-character alibi status (established, disproven, open)
- Deductions reached in each chapter
- Whether each suspect has been cleared or not
- The full investigation state as a structured object
- A "dead characters" list set deterministically from CML (not from prose detection)

Each chapter prompt therefore lacks the context needed to build on what came before. The LLM fills that gap by generating from the scene template and obligation block — and defaults to the same atmospheric opening, the same "we need evidence" dialogue, and the same circular investigation beats.

### 2.2 The Victim-as-Witness Failure

The `victimConfirmedDeadChapter` detection works by scanning chapter 1 text for co-occurrence of `victimName` and death-language keywords. This is fragile because:
1. Chapter 1 may describe "a body" or "the victim" without using the canonical name in the same passage
2. If detection fails, no "victim is dead" constraint is ever injected into chapters 2+
3. Even when detected, the victim's character profile is still passed to subsequent chapters as part of the "active characters" block

### 2.3 The Debug-Note Passthrough

Agent 5 generates `clue.pointsTo` fields with internal annotation language that was intended for the generation system, not for the reader. When Agent 9 injects `clue.pointsTo` into the chapter obligation block via `buildChapterObligationBlock()`, the raw value is used without sanitization. The LLM reads "Points to: The detail is explicit: ten minutes past eleven" and mirrors this phrasing into the narrative voice.

### 2.4 The Template Opening Problem

The obligation block format is:
```
- Chapter 3:
  - Location anchor: The Library
  - Opening atmosphere (MANDATORY): first paragraph MUST contain...
```

The LLM interprets "Location anchor: The Library" as an instruction to begin the chapter with the location name, producing "The Library in [Town], England..." as the opening line. The TEMPLATE LEAKAGE BAN in the system prompt is present but competes with the more immediate obligation instruction.

### 2.5 The Pronoun Drift Persistence

The 9-rule pronoun block is injected at every chapter. The deterministic sweep repairs known antecedents. But the sweep operates on a token-level text replacement that cannot resolve:
- Indirect antecedent chains (pronoun refers to character via a chain of clauses)
- Dialogue attribution pronouns that disagree with the last named character
- Reflexive pronouns in nested clauses

The per-chapter validator catches these but only after the full chapter is generated, consuming a retry.

---

## Section 3 — Blue Sky Strategy: Six Architectural Solutions

**Replaces the incremental 6-phase tactical plan.** After mapping the coverage gaps in the original BLUE-1 through BLUE-4 ideas, two new solutions (BLUE-5 and BLUE-6) were added. Together the six blue sky ideas provide complete coverage of all six problem areas — each by redesigning the relevant subsystem rather than patching individual functions.

**Design principle:** Every tactical fix in the prior plan (sanitize a field, flip a format string, extend a regex, inject a hint) is the symptom of a deeper data contract or prompt architecture problem. The blue sky solutions address those contracts directly. The tactical functions become unnecessary as a result of better architecture.

**Coverage summary:**

| Blue Sky | Eliminates problem at its root | Tactical functions made obsolete |
|----------|-------------------------------|----------------------------------|
| BLUE-5: Story Contract Precompiler | 1 Dead victim, 2 Template bleeds, 3 Clock drift | `enforceLockedFactValuePresence` injection string, `sanitizeClueField`, `locationAnchor` format, `repairWordFormLockedFacts`, `victimConfirmedDeadChapter` detection |
| BLUE-6: Inline Identity Embedding | 4 Pronoun drift | `buildPronounAccuracyBlock` 9-rule block, `repairChapterPronouns` sweep, dialogue attribution pattern |
| BLUE-3: Investigation Graph | 5 Investigation loops | `onBatchComplete` log, `CHAPTER_TYPE_ADVANCE` table, investigation section in `buildNSDBlock` |
| BLUE-1: Deterministic Prose Scaffold | 6 No resolution (primary), 5 loops (co-owner), 2 bleeds (co-owner) | `buildChapterObligationBlock`, `injectResolutionIfAbsent`, final-chapter pre-commit validator |
| BLUE-2: Two-Pass Generation | Structural validation reinforcement (1, 3, 6) | `validateChapterPreCommitObligations`, plot-pass clock check, victim check |
| BLUE-4: Multi-Agent Consistency Review | Reactive safety net across all six | Catches any violation that slips through the prevention layer |

**Recommended implementation sequence:** BLUE-5 → BLUE-6 → BLUE-3 → BLUE-1 → BLUE-2 → BLUE-4. Each is independently additive and canary-safe.

---

## Phase 1 — Dead Victim Walks

**Problems:** A9-DV-1, A9-DV-2, A9-DV-3

### Why the original FIX-I-1 was insufficient

FIX-I-1 proposed adding a `deadCharacters` array to the NSD block. That is necessary but not sufficient. The NSD block is one signal in a multi-thousand-token prompt. The character personality block is a longer, richer, more specific signal. When both are in the prompt — the victim's NSD prohibition AND a full personality profile (alive voice, speech mannerisms, witty reactions) — the LLM follows the personality profile and ignores the NSD note. Two contradicting signals: the more specific one wins. The specific one is the personality block.

**The real lever is removing the victim from `activeCharacterNames`.**

### Root cause (precise)

`activeCharacterNames` is computed in `buildProsePrompt()` from `scenes.characters`. The CML scene list carries no death information. So the victim's personality profile (`buildCharacterPersonalityBlock`) is injected into every chapter prompt, giving the LLM a rich alive-person template to work from regardless of what the NSD block says.

### Fix — three changes, three files

**Change 1 — `agent9-run.ts`:** Before calling `generateProse()`, unconditionally pre-set the flag from CML. Do not wait for Chapter 1 prose to detect death:

```typescript
// After annotatedLockedFacts is built, before generateProse():
const victimNameResolved = resolveVictimName(cml.CAST as any);
if (victimNameResolved) {
  narrativeState = { ...narrativeState, victimConfirmedDeadChapter: 1 };
}
```

**Change 2 — `buildProsePrompt()` in `agent9-prose.ts`:** After computing `activeCharacterNames`, remove the victim. This causes `buildCharacterPersonalityBlock` to skip the victim entirely:

```typescript
const victimName = resolveVictimName(inputs.cast);
if (victimName && inputs.narrativeState?.victimConfirmedDeadChapter !== undefined) {
  activeCharacterNames.delete(victimName);
}
```

**Change 3 — `buildNSDBlock()` in `agent9-prose.ts`:** Upgrade the victim state line from a soft note to a hard prohibition with explicit right/wrong examples:

```
⛔ DEAD CHARACTER — CANNOT APPEAR AS ALIVE:
• [VictimName]: murdered before Chapter 1. In all chapters:
  - Refer to them ONLY in past tense, only as the victim of the crime
  - NEVER: enter a room, speak, respond, gesture, look, or react
  - NEVER: described as present at any scene, conversation, or confrontation
  - CORRECT: "Beatrice had often said..." / "the victim's desk" / "her effects were found"
  - WRONG: "Beatrice crossed the room" / "Beatrice confirmed the alibi" / "she nodded"
```

**Why the personality filter is the key lever:** Without the victim in `activeCharacterNames`, `buildCharacterPersonalityBlock` skips them — removing ~300–500 tokens of alive-person context from every post-discovery chapter prompt. The NSD prohibition then has no competing signal to fight.

**Canary safety:** Pure behavioral change. No new validation gates. Cannot fail canary.

**Files:** `agent9-run.ts` (~2 lines), `agent9-prose.ts` (`buildProsePrompt` ~1 line, `buildNSDBlock` ~10 lines).

---

## Phase 2 — Template Bleeds

**Problems:** A9-TB-1, A9-TB-3, A5-1, A7-1

Two independent sub-problems, fixed together in one phase.

### 2A — Debug note passthrough

**Root cause:** `enforceLockedFactValuePresence()` in `agent9-run.ts` (line ~694) appends `"The detail is explicit: ${canonical}."` to the best-matching paragraph. This is a post-generation function injecting a debug-annotation-style sentence directly into finished prose. It is the primary source of the string that appeared verbatim in ChatGPT reviews.

The original FIX-I-2 proposed sanitizing `clue.pointsTo` in the obligation block. That fixes the prompt-injection path. But this function bypasses the prompt entirely — it injects into already-generated prose.

**Better approach — change the injection string AND sanitize the prompt path:**

Change the post-processing injector from a debug annotation to natural prose, and prepend rather than append so it integrates as a scene-grounding opening:

```typescript
// BEFORE (agent9-run.ts ~line 694):
updatedParagraphs[bestIdx] = `${updatedParagraphs[bestIdx].trim()} The detail is explicit: ${canonical}.`;

// AFTER:
updatedParagraphs[bestIdx] = `The evidence showed ${canonical}. ${updatedParagraphs[bestIdx].trim()}`;
```

"The evidence showed ten minutes past eleven. [rest of paragraph]" reads as natural grounding. Prepending integrates better than appending because the canonical value grounds the paragraph's context from the start.

Also add `sanitizeClueField()` and call it on `clue.description` and `clue.pointsTo` inside `buildChapterObligationBlock()` (the prompt injection path):

```typescript
const sanitizeClueField = (text: string): string =>
  text
    .replace(/The detail is explicit:\s*/gi, '')
    .replace(/This detail added\s+\w+\s+texture[^.]+\./gi, '')
    .replace(/without changing the essential deduction chain[^.]*\./gi, '')
    .replace(/in the case background[^.]*\./gi, '')
    .trim();
```

### 2B — Location anchor triggers "The Library in..." openings

**Root cause:** The obligation block currently puts the location anchor first:
```
  - Location anchor: The Library
  - Opening atmosphere (MANDATORY): ...
```

The LLM reads the first item as the opening template. The format `Location anchor: The Library` reads as "begin here → The Library in [Town]..."

The original FIX-I-3 proposed changing the label to `"Scene location: X (DO NOT use as opening sentence)"`. This still puts the location first and still reads as an opening cue.

**Better approach — flip the instructional order:**

Put the character-action opening instruction first; put the location reference second as a spatial constraint:

```typescript
// BEFORE:
lines.push(`  - Location anchor: ${locationAnchor || '...'}.`);

// AFTER:
lines.push(`  - Opening: Begin with a character action, spoken line, or clock/time marker.`);
lines.push(`  - Scene is set in: ${locationAnchor || 'the canonical scene location'} — reference it naturally within the paragraph, never as your opening phrase.`);
```

By putting the character-action instruction first and the location reference second, the LLM generates character-action → location, not location → character. This mirrors actual prose structure.

**Canary safety:** Both sub-fixes are behavioral — one changes a post-processing string, one changes a prompt format. No new validation gates. Directly reduces the fingerprint linter retry failures that consume retry slots.

**Files:** `agent9-run.ts` (`enforceLockedFactValuePresence` ~1 line), `agent9-prose.ts` (`buildChapterObligationBlock` ~2 lines + `sanitizeClueField` ~10 lines).

---

## Phase 3 — Clock Value Drift

**Problems:** A9-TL-1

### Root cause (precise)

`repairWordFormLockedFacts()` builds regex patterns for digit-form → word-form conversion (e.g., `11:10` → `ten minutes past eleven`). It does NOT handle word-form → different-word-form (e.g., `eleven past ten` → `ten minutes past eleven`). The function cannot catch "quarter after eleven" because it's already in word form and has no digit to match.

The original FIX-I-4 proposed a static variant table. This is a maintenance burden and cannot anticipate all LLM phrasings.

### Better approach — algorithmic time-form generation

Parse the canonical time value to extract hours and minutes, then generate alternative phrasings algorithmically from the parsed values. Add this to `repairWordFormLockedFacts()`:

```typescript
function generateTimePhraseVariants(canonical: string): RegExp[] {
  const parsed = parseCanonicalTimeValue(canonical); // existing function
  if (!parsed) return [];
  const { h, m } = parsed;
  const hourWords = NUMBER_WORDS_MAP[h] ?? String(h);
  const minWords = m > 0 ? (NUMBER_WORDS_MAP[m] ?? String(m)) : null;

  const variants: string[] = [];
  // Wrong order: "eleven past ten" (hours/minutes swapped)
  if (minWords) variants.push(`${hourWords}\\s+past\\s+${minWords}`);
  // Compound hyphenated: "eleven-ten"
  if (minWords) variants.push(`${hourWords}[-\\s]${minWords}`);
  // Common wrong substitutions: "quarter past eleven", "half past eleven"
  variants.push(`quarter\\s+past\\s+${hourWords}`);
  variants.push(`half\\s+past\\s+${hourWords}`);
  // Digit-form variants: 11:10, 11.10, 11-10
  variants.push(`${h}[:.]${String(m).padStart(2, '0')}`);
  // 24-hour: "23:10" for an 11 PM reading
  if (h <= 12) variants.push(`${h + 12}[:.]${String(m).padStart(2, '0')}`);

  return variants.map(v => new RegExp(`\\b${v}\\b`, 'gi'));
}
```

When a locked fact value is time-form, build these variant patterns and add them to the repair pass. All matches are replaced with the canonical string.

**Prevention layer — also inject a FORBIDDEN phrase list into the locked facts prompt block:**

```typescript
// In lockedFactsBlock construction in buildProsePrompt():
if (isTimeValue(fact.value)) {
  const forbiddenForms = describeTimePhraseVariants(fact.value); // human-readable
  factLines += `\n    ⛔ FORBIDDEN alternatives: ${forbiddenForms.join(', ')} — the ONLY acceptable form is "${fact.value}"`;
}
```

This is prevention; the extended repair is the backstop.

**Canary safety:** `repairWordFormLockedFacts` is post-generation — adding more patterns cannot break canary. The forbidden-phrase injection is additive to the prompt.

**Files:** `agent9-run.ts` (`repairWordFormLockedFacts` — new variant generator ~30 lines), `agent9-prose.ts` (locked facts block ~5 lines).

---

## Phase 4 — Pronoun Drift

**Problems:** A9-PR-1, A9-PR-2, A9-PR-3, A9-PR-4

### Why the 9-rule block fails at antecedent chains

The pronoun block is in the system prompt. The LLM generates the paragraph in the completion context. In a 250-word paragraph with four character mentions, the generation context is dominated by the immediate preceding text — not the system prompt 3,000+ tokens away. When the LLM writes "Finch crossed the room and he turned to Hale", the `he` refers to Finch (female) because the last pronoun-relevant token in context was the subject of the preceding clause, not the system prompt rule from far above.

Adding more rules (original FIX-I-8/9) to the system prompt does not solve this — they're still in the same distant location.

### Better approach — co-locate pronouns with character names

The character personality block has `HIGH` priority in the ordered sections and appears much closer to the generation context. Add pronouns inline to each character's personality section header:

```typescript
// In buildCharacterPersonalityBlock(), change section header from:
result += `\n### ${name}\n`;
// to:
const pronounTag = gender === 'female' ? '(she/her — NEVER he/him)' : '(he/him — NEVER she/her)';
result += `\n### ${name} ${pronounTag}\n`;
```

Every time the LLM encounters a character's personality section, the canonical pronouns are co-located with their name. If the model reads "Dr. Mallory Finch (she/her — NEVER he/him)" 3 tokens before the personality text, the immediate context anchors the pronoun correctly when the model generates prose referencing Finch.

### Strengthen dialogue attribution repair

Add a pattern to `repairChapterPronouns()` in `pronoun-repair.ts` targeting the specific failure mode: attribution pronouns after dialogue disagree with the speaker's gender:

```typescript
// Pattern: "dialogue text," wrongGenderPronoun said/replied/asked
// When last named character before quote is known, validate attribution pronoun
const ATTRIBUTION_RE = /("[^"]{10,}",?\s+)(he|she)\s+(said|replied|asked|answered|whispered|murmured)/gi;
```

When the named speaker before the dialogue is known from the cast table and the attribution pronoun is wrong, flip it.

### Add concrete right/wrong examples to pronoun block rules 8 and 9

Replace the abstract rule text with specific right/wrong examples. The LLM follows examples better than rules:

```
8. When multiple characters of different genders appear in the same sentence, use the character's name instead of a pronoun to eliminate ambiguity:
   WRONG: "Eleanor watched Hale; she crossed the room and he frowned." (ambiguous antecedent)
   RIGHT: "Eleanor watched Hale; Hale crossed the room and Eleanor frowned." (explicit)
9. In dialogue attribution, the pronoun refers to the SPEAKER — not the last character named inside the quoted speech:
   WRONG: "I have no alibi," Finch said. He turned away. (Finch is female — "He" is wrong)
   RIGHT: "I have no alibi," Finch said. She turned away.
```

**Canary safety:** All additive. No new validation gates. Pronoun co-location reduces antecedent chain drift; attribution repair adds a targeted sweep pattern; rule examples replace abstract text.

**Files:** `agent9-prose.ts` (`buildCharacterPersonalityBlock` ~3 lines, pronoun block rules ~10 lines), `packages/story-validation/src/pronoun-repair.ts` (~20 lines).

---

## Phase 5 — Investigation Loops

**Problems:** A9-IS-1, A9-IS-2, A9-IS-3

### Root cause

The LLM has no structured knowledge of investigative progress. `continuityTail` gives 220 chars of closing beat — enough to bridge atmospherically, but not enough to prevent Chapter 6 from repeating the same interrogation beats as Chapter 3.

The original FIX-M-2 proposed a mini-LLM call per chapter to extract a `ChapterProgressRecord`. This adds cost (~$0.10/story) and hallucination risk — the LLM summary may not accurately reflect what's in the prose.

### Better approach — deterministic investigation log, no extra LLM calls

Build a structured `InvestigationLog` deterministically from already-available data after each chapter commits, and inject it into the next chapter's NSD block:

**In `agent9-run.ts` `onBatchComplete`:** After updating `narrativeState`, compute:

```typescript
// Deterministic from clueDistribution + cluesRevealedToReader state:
const revealedClueDescriptions = narrativeState.cluesRevealedToReader
  .map(id => clues.clues.find(c => c.id === id)?.description ?? id)
  .filter(Boolean);

// Deterministic from suspect_clearance_scenes vs currentChapter:
const clearedSuspects = (cmlCase.prose_requirements?.suspect_clearance_scenes ?? [])
  .filter((s: any) => Number(s.scene_number) <= batchEnd)
  .map((s: any) => ({ name: s.suspect_name, method: s.clearance_method }));

// From chapter-type arc position table:
const CHAPTER_TYPE_ADVANCE: Record<string, string> = {
  'opening':     'Discover the body, confirm the victim, note the stopped clock',
  'early':       'Interview each suspect — record their claimed whereabouts',
  'first_turn':  'Examine physical evidence — find at least one new clue',
  'mid':         'Test one suspect\'s alibi against a known fact — result must be stated',
  'second_turn': 'New evidence overturns the leading theory — introduce a reversal',
  'pre_climax':  'Narrow to the culprit — apply the discriminating test logic',
  'climax':      'Confront the culprit with the complete evidence chain',
  'resolution':  'Confession or arrest, method explained, consequences stated',
};
```

Inject into `buildNSDBlock()`:

```
INVESTIGATION LOG — WHAT IS ESTABLISHED (do not re-establish, do not repeat):
• Evidence in reader's hands: [description1], [description2], ...
• Suspects cleared: [Name] — [clearance method]
• Suspects unresolved: [Name], [Name]

⚠ THIS CHAPTER'S REQUIRED ADVANCE: [CHAPTER_TYPE_ADVANCE[arcPosition]]
The story must move FORWARD from this log. Any beat already listed above is forbidden from repeating.
```

**Chapter-type advance as instructional constraint (not validated):** This is behavioral — no new validation gate. The instruction forces the LLM to write structurally distinct scenes. Because it's not validated, a failure to advance doesn't break canary; it just produces a weaker chapter that the next phase (Phase 6 or a future iteration) can address.

**Canary safety:** Additive NSD expansion. No new hard validation gates. Cannot break canary.

**Files:** `agent9-prose.ts` (`buildNSDBlock` ~20 lines), `agent9-run.ts` (`onBatchComplete` ~15 lines to populate investigation log data).

---

## Phase 6 — No Resolution

**Problems:** A9-RES-1, A9-RES-2, A9-RES-3

### Root cause

The DENOUEMENT REQUIREMENT in the system prompt is a soft instruction with no validation counterpart. The final chapter obligation block is structurally identical to all other chapters. The LLM sees no signal that this chapter is categorically different.

### Three-layer approach (prevention → detection → backstop)

**Layer 1 (prevention) — Final chapter obligation block rewrite:**

In `buildChapterObligationBlock()`, for the chapter where `arcPosition === 'resolution'`, replace the generic obligations with a specific five-point resolution checklist:

```typescript
if (isResolutionChapter) {
  const culpritNames = (cmlCase.culpability?.culprits ?? []).join(', ');
  const murderMethod = cmlCase.solution?.method ?? 'the crime method';
  lines.push(`⛔ MANDATORY RESOLUTION — THIS IS THE FINAL CHAPTER:`);
  lines.push(`  Five events MUST appear as on-page prose (not offstage summary):`);
  lines.push(`  1. ACCUSATION: The detective names ${culpritNames} and states the charge.`);
  lines.push(`  2. CULPRIT RESPONSE: ${culpritNames} confesses with detail, or reacts in a way that confirms guilt.`);
  lines.push(`  3. METHOD: State exactly how "${murderMethod}" was used — specific, not vague.`);
  lines.push(`  4. CONSEQUENCE: What happens to ${culpritNames} (arrested, fled, taken into custody).`);
  lines.push(`  5. AFTERMATH: At least one other character reacts emotionally to the truth.`);
  lines.push(`  A chapter submitted without all five will be rejected and regenerated.`);
}
```

**Layer 2 (detection) — pre-commit validator for final chapter only:**

Add to `validateChapterPreCommitObligations()`, guarded by an `isLastChapter` boolean:

```typescript
if (isLastChapter && culpritSurname) {
  const RESOLUTION_RE = /\b(confess(?:ed|es)?|arrest(?:ed)?|taken\s+into\s+custody|I\s+(?:did|killed)|guilty|you\s+committed|you\s+killed|the\s+murderer\s+is|it\s+was\s+you)\b/i;
  const culpritRE = new RegExp(`\\b${culpritSurname}\\b`, 'i');
  if (!RESOLUTION_RE.test(chapterText) || !culpritRE.test(chapterText)) {
    hardFailures.push(
      `Final chapter: no resolution event detected. Include a scene where ${culpritName} ` +
      `confesses, is arrested, or the detective explicitly names them as the murderer with evidence.`
    );
  }
}
```

This triggers a retry with a resolution-specific directive injected into the repair prompt.

**Layer 3 (backstop) — deterministic resolution injector in `agent9-run.ts`:**

After `generateProse()` and all post-processing, check the final chapter. If still no resolution marker, inject a minimal resolution paragraph:

```typescript
const injectResolutionIfAbsent = (prose: any, cml: any): any => {
  const finalChapter = prose.chapters[prose.chapters.length - 1];
  const finalText = (finalChapter.paragraphs ?? []).join(' ');
  const culprit = (cml?.CASE?.culpability?.culprits ?? [])[0] ?? '';
  const culpritSurname = culprit.split(' ').pop() ?? culprit;
  const RESOLUTION_RE = /\b(confess|arrest|guilty|I killed|you committed)\b/i;
  if (culprit && !RESOLUTION_RE.test(finalText)) {
    const paragraphs = [...(finalChapter.paragraphs ?? [])];
    paragraphs.push(
      `${culpritSurname} confessed at last, the evidence having made denial impossible. ` +
      `They were taken into custody before the hour was out. The case was closed.`
    );
    const chapters = [...prose.chapters];
    chapters[chapters.length - 1] = { ...finalChapter, paragraphs };
    console.warn(`[Agent 9] injectResolutionIfAbsent: injected resolution for "${culprit}".`);
    return { ...prose, chapters };
  }
  return prose;
};
```

Call this in the post-processing chain after `enforceCulpritEvidencePresence`.

**Canary safety:** Layer 1 and Layer 3 are behavioral / deterministic. Layer 2 adds a hard failure in the final chapter only. The backstop (Layer 3) guarantees that even if all retries fail, a resolution sentence exists — keeping story validation passing. **This is the only phase with any canary risk.** Verify after implementing that the Layer 2 validator actually forces a successful retry before the backstop, and that the backstop does not conflict with the story validation pipeline's culprit-evidence check.

**Files:** `agent9-prose.ts` (`buildChapterObligationBlock` ~15 lines, `validateChapterPreCommitObligations` ~10 lines), `agent9-run.ts` (new `injectResolutionIfAbsent` function ~20 lines, post-processing chain ~1 line).

---

## Section 4 — Blue Sky Solutions

### BLUE-1: Deterministic Prose Scaffold + LLM Fill

**Primary problem solved: 6 (No resolution). Also absorbs: 5 (Investigation loops), 2 (Template bleeds).**

**What the tactical patches did:** Phase 6 added a 5-point resolution checklist to the obligation block, a final-chapter validator, and an `injectResolutionIfAbsent` backstop. Phase 5 added an investigation log block and a chapter-type advance requirement. Phase 2B changed the location anchor label format. All of these are instructions added to an unconstrained generation call — the LLM can still ignore all of them.

**Architectural replacement:** Before generating any prose, the pipeline compiles a sequence of `StoryBeat` objects deterministically from CML + clue distribution:

```typescript
interface StoryBeat {
  type: 'BODY_DISCOVERY' | 'WITNESS_INTERVIEW' | 'EVIDENCE_REVEAL' |
        'ALIBI_TEST' | 'RED_HERRING' | 'REVERSAL' | 'CONFRONTATION' | 'RESOLUTION';
  characters: string[];       // who is present (from contract — victim never included)
  location: string;           // canonical scene location
  obligation: string;         // what must happen in prose-world language (never metadata keys)
  evidenceId?: string;        // clue to reveal (from clue distribution)
  suspectTested?: string;     // whose alibi is under test
}

// Example resolution beat (always last, always present):
{
  type: 'RESOLUTION',
  characters: ['Eleanor Voss', 'Captain Ivor Hale'],
  location: 'The Library',
  obligation: 'Eleanor names Hale as the murderer. Hale confesses or is confronted with inescapable evidence. The murder method is explained in specific terms. Hale is arrested.',
  suspectTested: 'Captain Ivor Hale'
}
```

The LLM receives a single beat and writes only the prose that dramatises it. It cannot add beats, skip the resolution, or make the victim speak. Template bleed disappears because the beat's `obligation` field is prose-world language derived from the contract, not raw metadata keys. The resolution beat always exists; there is no need for a backstop injector or final-chapter validator.

**Scope:** ~800 lines. New `StoryBeatCompiler` module + updated chapter generation loop.

---

### BLUE-2: Two-Pass Generation — Plot then Prose

**Primary problem solved: structural validation reinforcement for 1 (Dead victim), 3 (Clock drift), 6 (No resolution).**

**What the tactical patches did:** Phase 1 pre-set `victimConfirmedDeadChapter` and filtered `activeCharacterNames`. Phase 3 extended `repairWordFormLockedFacts` with algorithmic variants. Phase 6 added a pre-commit validator. All of these apply to an already-generated chapter — repair after generation, not prevention at generation time.

**Architectural replacement:** Split each chapter into two LLM calls:

**Pass 1 (small model, JSON output, ~300 tokens):** Generate a structured plot summary:

```typescript
interface ChapterPlot {
  charactersPresent: string[];          // only living characters
  newEvidenceDiscovered: string | null; // clue description, canonical phrasing required
  clockValueMentioned: string | null;   // must equal the canonical locked value or be null
  investigationAdvancement: string;     // one sentence: what changed in the investigation
  resolutionPresent: boolean;           // true only if final chapter
  culpritNamedAndArrested: boolean;     // final chapter only
}
```

This JSON is validated deterministically before any prose tokens are spent:
- `charactersPresent` must not contain the victim name
- `clockValueMentioned` must equal the canonical locked value or be null
- `resolutionPresent` must be true for the final chapter

Validation failures are returned as retry instructions to Pass 1 only. The prose call runs only on a plot that has passed all structural checks.

**Pass 2 (large model, literary prose):** Receives the validated `ChapterPlot` as grounding input. The plot guarantees structural correctness — the prose model only needs to write well.

**Cost:** 2× LLM calls per chapter. Plot pass is cheap (~$0.002 per chapter with a small model). Adds ~15–20 seconds per chapter. Major refactoring of the chapter generation loop.

---

### BLUE-3: Investigation Graph — Fully Explicit State Machine

**Primary problem solved: 5 (Investigation loops). Also absorbs: 6 (No resolution) as co-owner.**

**What the tactical patches did:** Phase 5 built an `InvestigationLog` from `cluesRevealedToReader`, `suspect_clearance_scenes`, and a static `CHAPTER_TYPE_ADVANCE` table, then injected it as text into the NSD block. This tells the LLM what has been established — but it's still a text instruction, not enforced structure. The LLM can repeat already-established beats.

**Architectural replacement:** The pipeline maintains an `InvestigationGraph` as a directed acyclic graph with typed node and edge objects:

```typescript
type FactNode =
  | { type: 'EVIDENCE'; id: string; description: string; established: boolean }
  | { type: 'ALIBI'; suspect: string; description: string; status: 'unverified' | 'confirmed' | 'disproven' }
  | { type: 'DEDUCTION'; text: string; derivedFrom: string[] }
  | { type: 'ELIMINATION'; suspect: string; reason: string };

type EdgeType = 'SUPPORTS' | 'CONTRADICTS' | 'ENABLES_DEDUCTION' | 'ELIMINATES';
```

The graph is initialised from CML before prose generation begins, with all nodes in `established: false` state. After each chapter commits, the orchestrator updates the graph deterministically from the chapter's committed plot data.

Before generating the next chapter, the graph is queried for the **investigation frontier** — facts that are logically reachable from established facts but not yet established. The chapter obligation is: "establish at least one frontier fact." This is enforced structurally, not as a prompt hint.

The graph naturally reaches a terminal state (all suspects eliminated except the culprit, all evidence chains established) which defines the resolution chapter. The chapter type system emerges from graph state, not from a static arc position table.

**Scope:** Very high. ~1,500 lines of new infrastructure. Most powerful option for eliminating investigation stagnation.

---

### BLUE-4: Multi-Agent Consistency Review Pass

**Primary problem solved: reactive safety net across all six problems.**

**What the tactical patches did:** Each phase added a targeted fix to a specific single-chapter failure mode. None of them provide a global consistency check across chapters. Pronoun drift across a chapter boundary, a clock value that contradicts chapter 3 in chapter 7, or a resolution that is logically inconsistent with established alibis — none of these are caught by single-chapter validators.

**Architectural replacement:** After every 3 chapters commit, a lightweight continuity reviewer agent reads the last 3 chapters and produces a structured `ContinuityReport`:

```typescript
interface ContinuityReport {
  pronounViolations: { character: string; chapter: number; sentence: string; expected: string }[];
  victimAliveViolations: { chapter: number; sentence: string }[];
  clockInconsistencies: { chapter: number; value: string; canonical: string }[];
  investigationRepeats: { chapters: number[]; description: string }[];
  repairInstructions: { chapter: number; instruction: string }[];
}
```

Any violation triggers a **surgical repair** of the specific chapter — a targeted single-chapter rewrite with the violation as the explicit failure instruction. This catches residual failures that slip through the prevention layer without requiring a full story regeneration.

**Cost:** Medium. New reviewer agent + structured output schema + surgical repair trigger. Small model call every 3 chapters; adds ~20 seconds per 3-chapter block. Can be disabled with a config flag.

---

### BLUE-5: Story Contract Precompiler *(New)*

**Primary problem solved: 1 (Dead victim walks), 2 (Template bleeds), 3 (Clock value drift). Absorbs the most tactical patches of any single solution.**

**What the tactical patches did:**
- Phase 1: set `victimConfirmedDeadChapter` and filtered `activeCharacterNames` with a victim exclusion
- Phase 2A: changed the `enforceLockedFactValuePresence` injection string; added `sanitizeClueField` on `clue.pointsTo` and `clue.description`
- Phase 2B: reformatted the `locationAnchor` line in `buildChapterObligationBlock`
- Phase 3: extended `repairWordFormLockedFacts` with algorithmic time-form variants and a forbidden-phrase injection

All of these fix symptoms of the same root cause: **the data entering the prompt comes from raw CML and clue fields that were never designed as prompt-ready content.** Victims have alive-person profiles because no one stripped them. Clue fields carry debug annotations because Agent 5 never cleaned its output. Time values drift because there is no authoritative normalised form passed downstream.

**Architectural replacement:** Before any prompt is built, a single `StoryContract` is compiled once from CML + clue distribution + narrative. Every prompt builder reads from this contract exclusively — never from raw CML or clue objects:

```typescript
interface StoryContract {
  victim: {
    name: string;
    gender: 'male' | 'female';
    status: 'deceased';
    deathConfirmedFromChapter: 1;     // always 1 — victim never alive in prose
    suppressFromChaptersAfter: 0;     // personality block excluded from all chapters
    referenceRule: string;            // "past tense only, as 'the victim', never present-tense agent"
  };
  culprit: {
    name: string;
    gender: 'male' | 'female';
    motive: string;
    method: string;                   // CASE.solution.method — sanitized to prose text
    causeOfDeath: string;             // CASE.solution.cause_of_death — sanitized
  };
  clockReading: {
    canonical: string;                // e.g. "ten minutes past eleven"
    forbiddenVariants: string[];      // algorithmically generated: ["11:10", "eleven-ten", ...]
    promptDirective: string;          // pre-built instruction string for injection
  };
  clues: {
    id: string;
    description: string;              // sanitized — debug annotations stripped
    pointsTo: string;                 // sanitized
    locationAnchor: string;           // reformatted — "scene is set in X, reference naturally"
  }[];
  characters: {
    name: string;
    gender: 'male' | 'female';
    pronounTag: string;               // "(she/her — NEVER he/him)"
    isAlive: boolean;
    personalityBlock: string | null;  // null for victim
  }[];
}
```

The contract is built once by a `compileStoryContract(cml, clues, narrative)` function that applies all sanitization and normalization in one place. After that, the tactical repair functions become dead code:
- `enforceLockedFactValuePresence` injection string → canonical value is already clean in the contract; natural prose grounding is built at compile time
- `sanitizeClueField` → clue fields are sanitized at contract compile time
- `repairWordFormLockedFacts` → `clockReading.canonical` is the only form that enters the prompt; `forbiddenVariants` are injected as a prohibition list, not repaired reactively
- `activeCharacterNames` victim filter → `characters` in the contract already has `isAlive: false` for the victim; `buildCharacterPersonalityBlock` skips null personality blocks

**Scope:** ~300 lines. New `StoryContractCompiler` module + updates to `buildProsePrompt`, `buildChapterObligationBlock`, `buildNSDBlock`, and `enforceLockedFactValuePresence` to consume contract fields. Cleanest coverage-to-scope ratio of all six solutions.

---

### BLUE-6: Inline Character Identity Embedding *(New)*

**Primary problem solved: 4 (Pronoun drift). Completely absorbs Phase 4.**

**What the tactical patches did:**
- Phase 4 co-located pronouns in personality block headers: `### Dr. Mallory Finch (she/her — NEVER he/him)`
- Phase 4 added a dialogue attribution repair pattern in `pronoun-repair.ts`
- Phase 4 rewrote pronoun block rules 8 and 9 with concrete right/wrong examples

These improve the situation but operate in two different locations — one in the character block (mid-prompt) and one in the system prompt (far from generation context). A pronoun repair sweep is still required post-generation.

**Why the system prompt block fails at antecedent chains:** The LLM generates a 250-word paragraph in completion context. When it writes "Finch crossed the room and he turned to Hale", the `he` refers to Finch (female) because the last pronoun-relevant token in the local generation context was the subject of the preceding clause — not a system prompt rule 3,000+ tokens away. Adding more rules to the system prompt does not change the local context dynamic.

**Architectural replacement:** Instead of a distant pronoun rule block plus a repair sweep, pronouns are embedded as inline structured metadata at **every occurrence** of a character name throughout the entire prompt. Every prompt builder that emits a character name calls a single `embedIdentity` helper that reads from the `StoryContract`:

```typescript
const embedIdentity = (name: string, contract: StoryContract): string => {
  const char = contract.characters.find(c => c.name === name);
  if (!char) return name;
  return `${name} [${char.pronounTag}]`;
};
```

The result — every character mention in obligation blocks, NSD state, continuity tail, witness lists, and scene descriptions renders as:

```
Eleanor Voss [she/her — NEVER he/him] entered the library.
Captain Ivor Hale [he/him — NEVER she/her] followed.
```

The LLM encounters the pronoun anchor 3 tokens after the character's name at every location in the prompt where that character appears. There is no distant rule to recall across 3,000 tokens. The system prompt pronoun block becomes a concise 2-line reminder rather than a 9-rule contract that must be applied from memory.

The dialogue attribution repair pattern remains as a lightweight backstop — but now it runs against prose where the LLM had correct pronoun anchors at every character mention. It becomes a last-resort catcher rather than the primary correction mechanism.

**Scope:** ~50 lines. New `embedIdentity` helper (reads from `StoryContract`, so depends on BLUE-5 or a standalone contract) + updates to all prompt builders that emit character names. Simplest and fastest of all six solutions to implement.

---

## Section 5 — Blue Sky Coverage Matrix

| Blue Sky | Primary problems eliminated | Secondary reinforcement | Tactical phases absorbed | Scope |
|----------|----------------------------|------------------------|--------------------------|-------|
| BLUE-5: Story Contract Precompiler | 1 (dead victim), 2 (template bleeds), 3 (clock drift) | Provides clean data for all other solutions | Phases 1, 2, 3 entirely | ~300 lines |
| BLUE-6: Inline Identity Embedding | 4 (pronoun drift) | — | Phase 4 entirely | ~50 lines |
| BLUE-3: Investigation Graph | 5 (investigation loops) | 6 (resolution — graph reaches terminal state) | Phase 5 | ~1,500 lines |
| BLUE-1: Deterministic Prose Scaffold | 6 (no resolution) | 5 (loops — beats force progression), 2 (bleeds — beats use obligation language not metadata) | Phases 5, 6, and Phase 2B | ~800 lines |
| BLUE-2: Two-Pass Generation | Structural validation (1, 3, 6) | Reinforces BLUE-5 output with a plot-level gate | — | ~400 lines |
| BLUE-4: Multi-Agent Review Pass | Reactive: all six | Last safety net for violations that slip through prevention | — | ~200 lines |

**Recommended build sequence (if staged):**

1. **BLUE-5** first — gives every subsequent solution clean, normalised input data. Highest problem-to-scope ratio (~300 lines eliminates 3 of 6 problems).
2. **BLUE-6** second — self-contained, ~50 lines, eliminates pronoun drift entirely. Depends on `StoryContract.characters` from BLUE-5.
3. **BLUE-3** third — the most complex; builds the investigation state machine on top of clean contract data.
4. **BLUE-1** fourth — scaffold compiler consumes the contract and graph to generate structurally guaranteed beat sequences.
5. **BLUE-2** fifth — adds a plot-pass validation gate above the prose pass.
6. **BLUE-4** last — continuity review pass as a global safety net over the full system.

**Each can be built and canary-tested independently. Each is additive. None require a prior step to function — but BLUE-5 provides the `StoryContract` that makes BLUE-6 trivial and BLUE-1 cleaner.**

---

## Section 6 — Key Verdict

The ChatGPT reviews across all 4 stories converge on the same 6 failure categories. The tactical fix plan addressed each with targeted patches; the blue sky plan addresses each by redesigning the subsystem that produces the failure.

| Problem | Tactical symptom | Architectural cause | Blue sky solution |
|---------|-----------------|---------------------|-------------------|
| 1. Dead victim walks | `victimConfirmedDeadChapter` never set; victim personality block injected into all chapters | No data contract enforcing victim status before prompt build | BLUE-5: victim is `status: deceased` in the contract; `personalityBlock: null`; no filtering logic needed |
| 2. Template bleeds | Debug annotations in `clue.pointsTo`; `locationAnchor` triggers "The Library in..." prose opening | Raw Agent 5 output fed directly to prompt builders without sanitization | BLUE-5: all clue fields sanitized at contract compile time; BLUE-1: beats use obligation language, not metadata keys |
| 3. Clock value drift | Five surface forms of the same canonical time value across chapters | No canonical typed representation passed downstream; repair catches digit-form only | BLUE-5: `clockReading.canonical` is the single source; `forbiddenVariants` injected as prohibition list; no reactive repair needed |
| 4. Pronoun drift | System prompt rules fail at antecedent chains in generation context | Pronoun anchors are 3,000+ tokens from the generation context where drift occurs | BLUE-6: pronoun tag embedded inline at every character name occurrence across the entire prompt |
| 5. Investigation loops | Same beats repeat across 5–7 chapters; LLM restarts investigation from scratch each chapter | No structured investigation state; `continuityTail` (220 chars) is insufficient | BLUE-3: investigation graph tracks the frontier; each chapter must advance at least one graph edge |
| 6. No resolution | Final chapter has no confession, arrest, or culprit naming | Final chapter has no structural distinction from all other chapters | BLUE-1: resolution beat is a typed `StoryBeat` that cannot be omitted from the compiled sequence |

**Most implementable first (BLUE-5 + BLUE-6):** Together these two eliminate four of the six problem areas (dead victim, template bleeds, clock drift, pronoun drift) with ~350 lines of new code, no new hard validation gates, and no canary risk. Both are additive.

**Most transformative overall (BLUE-1 + BLUE-3):** The scaffold compiler and investigation graph make all six problems structurally impossible rather than progressively less likely. The LLM cannot generate a chapter without a beat, cannot skip the resolution beat, and cannot repeat investigation ground already covered by the graph.

**End of ANALYSIS_19**