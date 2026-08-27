# Story Review Analysis — story_20260520-1846

**Story:** Little Middleton Manor — Eleanor Voss / clock tampering / 1938
**Detective:** Beatrice Quill · **Victim:** unnamed (Lord Ivor Voss, suggested) · **Culprit:** Eleanor Voss
**Review date:** 2026-05-20 · **Score:** 64 / 100

---

## Progress Table

| # | Category | Issue Cluster | Strategic Fix | Status | Code Location |
|---|----------|--------------|---------------|--------|--------------|
| P1 | Character clarity | Pronoun drift — Hale (he→she), Beatrice (she→he), victim (he→she) | FIX-C1: Cast pronoun lock per chapter prompt | ✅ Done | `agent9-prose.ts → buildPronounAccuracyBlock` + compact lock (lines 2903, 4256) |
| P2 | Character clarity | Victim never named in any chapter ("the victim" / "him" throughout) | FIX-C2: Victim-name hard gate for Ch 1 | 🟢 Done | `agent9-prose.ts → evaluateCandidate` Fix 10c (line 6643) |
| P3 | Character clarity | "Both men" for Hale + Finch despite female pronouns in same chapter | FIX-C3: Role-sanity cross-check — gender agreement in group noun | 🔴 Not started | `agent9-prose.ts → lintBatchProse` |
| P4 | Prose / polish | Template boilerplate location lines survive into final prose (Ch 2, 3, 5, 8) | FIX-PR1: Make `intra_chapter_sentence_duplicate` non-deferrable for first 2 paragraphs | 🔴 Not started | `agent9-prose.ts → lintBatchProse` |
| P5 | Prose / polish | "Waiting for the investigator" phrase repeats ~8 times across all chapters | FIX-PR2: Add 2 missing DEBUG_NOTE_PATTERNS variants (2 of 4 already present) | 🟡 In progress | `agent9-prose.ts → lintBatchProse → DEBUG_NOTE_PATTERNS` (lines 1296–1297) |
| P6 | Prose / polish | Report-style exposition ("This evidence points to X's involvement", "Direct evidence ties X to mechanism access point") | FIX-PR3: DEBUG_NOTE_PATTERNS — planning-language forbidden phrases | 🟢 Done | `agent9-prose.ts → DEBUG_NOTE_PATTERNS` (lines 1300–1301) |
| P7 | Dialogue | Beatrice states clues bluntly in dialogue instead of implying them | FIX-D1: Clue-disclosure embargo — `clueStageForRun` + `CLUE DISCLOSURE RULE (Stage N/4)` | 🟢 Done | `agent9-prose.ts → buildChapterObligationBlock` (line 2509) |
| P8 | Plot structure | Ch 7 ("Discriminating Test") contains no test — reprises Ch 6 content verbatim | FIX-DT1: DT chapter must introduce new observable fact not present in prior chapter | 🟢 Done | `agent9-prose.ts → buildChapterObligationBlock` `NEW OBSERVABLE FACT REQUIRED` (line 2572) |
| P9 | Pacing | Ch 6 and Ch 7 share ~60 % n-gram overlap — no new information added in Ch 7 | FIX-P1: Lower ngram overlap threshold for consecutive same-arc-position chapters | 🔴 Not started | `agent9-prose.ts → lintBatchProse` + `styleLinterConfig.ngram.overlap_threshold` |
| P10 | Pacing | Beatrice acts as detective but repeatedly says the real investigator is still coming | FIX-P2: Investigator-role declaration obligation in Ch 1 | 🔴 Not started | `agent9-prose.ts → buildChapterObligationBlock` |
| P11 | Mystery clues | Dr. Finch alibi asserted but never verified on-page (medical records mentioned, never confirmed) | FIX-M1: Alibi clearing-event must be shown in-scene (not just asserted) | 🔴 Not started | `agent9-prose.ts → buildChapterObligationBlock` clearance obligations |
| P12 | Mystery clues | Eleanor's clock-check time contradicts itself (Ch 1: 11:10 / Ch 3: 11:20) — never flagged as clue | FIX-M2: Temporal alibi lock — Eleanor's first stated clock time is a locked fact | 🔴 Not started | `agent9-prose.ts → buildChapterObligationBlock` |
| P13 | Ending / reveal | Eleanor confesses to clock-tampering, not to murder; no causal bridge to death | FIX-E1: Confession must name the act + evidence chain + kill statement | 🟢 Done | `agent9-prose.ts → buildChapterObligationBlock` FIX-M2+E1 (lines 2597–2600) |
| P14 | Ending / reveal | Final sentence is report-style summary, not an in-scene moment | FIX-E2: Closing-sentence gate — forbid third-person summary in resolution chapter | 🔴 Not started | `agent9-prose.ts → lintBatchProse` |
| P15 | Atmosphere | Location name oscillates between "Little Middleton Manor" and "Caldwell Manor" | FIX-SS: Replace generic estate-name lock with explicit canonical-name injection | 🔴 Not started | `agent9-prose.ts → buildCaseOverview` (line 1845) |

**Status key:** 🔴 Not started · 🟡 In progress · 🟢 Done · ⬛ Deferred

---

## Step 1 — Source Review

**Source story:** `stories/story_20260520-1846/`
**Review date:** 2026-05-20
**Score:** 64 / 100

```
This version is one of the better ones structurally, because it finally has a clearer
direction: Eleanor is a living suspect → Hale and Finch are cleared → Eleanor's
fingerprints and financial troubles point to her → Eleanor confesses.

That is a much cleaner mystery shape than several earlier drafts.

Area              Mark    Notes
Premise / concept  7/10   The false clock timeline remains a strong mystery device.
Opening hook       6/10   Stopped clock and Eleanor's shock work, but victim needs naming immediately.
Plot structure     7/10   Stronger: conflicting accounts, note, alibis, financial motive, fingerprints,
                          clearing suspects, confession.
Character clarity  5/10   Better, but the victim's gender and identity are still unclear.
Dialogue           5/10   Clear but often too explanatory.
Atmosphere         5/10   Rainy manor tone works, but generated setting lines still appear.
Mystery clues      7/10   Good clue chain: clock, witness contradiction, note, alibis, fingerprints,
                          motive.
Pacing             6/10   Better than before, though chapters still repeat the clock/timeline problem.
Ending / reveal    6/10   Eleanor's confession is clearer, but murder motive still needs more detail.
Prose / polish     4/10   Pronoun slips, note-like lines, and awkward phrasing remain.
```

---

## Step 2 — Issue Triage by Scoring Category

### 2.1 Premise / concept (7/10)

| Issue | Chapters | Story-specific? |
|-------|----------|-----------------|
| *(None — clock-timeline device is sound)* | — | — |

### 2.2 Opening hook (6/10)

| Issue | Chapters | Story-specific? |
|-------|----------|-----------------|
| Victim not named; referred to as "him" and "the victim" | Ch 1 | **No — generic** |
| Clock contradiction presented as conclusion, not planted as puzzle | Ch 1 | **No — generic** |
| Beatrice disclaims detective role while acting as detective | Ch 1 | **No — generic** |

### 2.3 Plot structure (7/10)

| Issue | Chapters | Story-specific? |
|-------|----------|-----------------|
| Ch 7 ("Discriminating Test") reprises Ch 6 verbatim — no test performed | Ch 7 | **No — generic** |
| Eleanor's clock-check time changes across chapters (contradiction never used) | Ch 1, Ch 3 | **No — generic** |
| No aftermath or denouement scene; resolution doubles as climax | Ch 9 | **No — generic** |

### 2.4 Character clarity (5/10)

| Issue | Chapters | Story-specific? |
|-------|----------|-----------------|
| Captain Hale (male) addressed as she/her in Ch 5, Ch 8 | Ch 5, Ch 8 | **No — generic** |
| Beatrice Quill switches she→he within single chapters | Ch 5, Ch 7, Ch 8 | **No — generic** |
| Victim gender oscillates he↔she across chapters | Ch 3, Ch 4, Ch 7 | **No — generic** |
| "Both men" for Hale and Finch despite female pronouns in same paragraph | Ch 8 | **No — generic** |
| Victim never named — arrest line reads "murder of the victim" | Ch 1–9 | **No — generic** |
| Beatrice's investigator role never established; repeatedly defers to arriving "real" detective | Ch 1–8 | **No — generic** |

### 2.5 Dialogue (5/10)

| Issue | Chapters | Story-specific? |
|-------|----------|-----------------|
| Beatrice states the clue conclusion bluntly: "This evidence points to Eleanor Voss's involvement" | Ch 6 | **No — generic** |
| "Waiting for the investigator" phrase: ~8 repetitions across all chapters | Ch 1–8 | **No — generic** |
| Beatrice performs citizen's arrest with no legal standing | Ch 9 | Partially |

### 2.6 Atmosphere / setting (5/10)

| Issue | Chapters | Story-specific? |
|-------|----------|-----------------|
| Location-boilerplate sentences survive into final prose ("Entering The Study in Little Middleton…") | Ch 2, 3, 5, 8 | **No — generic** |
| Duplicate opening sentences within single chapters (Ch 2 opener appears twice; Ch 3 opener appears twice) | Ch 2, Ch 3 | **No — generic** |
| Estate name oscillates: "Little Middleton Manor" (boilerplate) vs "Caldwell Manor" (dialogue / narrative) | All | **No — generic** |

### 2.7 Mystery clues / evidence logic (7/10)

| Issue | Chapters | Story-specific? |
|-------|----------|-----------------|
| Dr. Finch's hospital alibi mentioned but never confirmed on-page (no named corroborator) | Ch 4, Ch 8 | **No — generic** |
| Eleanor's clock-check time changes (Ch 1: 11:10 vs Ch 3: 11:20) — planted contradiction that the story ignores | Ch 1, Ch 3 | No — generic |

### 2.8 Pacing (6/10)

| Issue | Chapters | Story-specific? |
|-------|----------|-----------------|
| Ch 6 and Ch 7 share ~60 % n-gram overlap; Ch 7 adds no new narrative information | Ch 6, Ch 7 | **No — generic** |
| Clock/timeline reasoning repeated with identical content across three chapters | Ch 1, Ch 2, Ch 6 | **No — generic** |

### 2.9 Ending / reveal (6/10)

| Issue | Chapters | Story-specific? |
|-------|----------|-----------------|
| Eleanor confesses to clock-tampering only — "I never meant for it to lead to this" does not confirm murder | Ch 9 | **No — generic** |
| No causal bridge: how did clock-tampering cause or enable the death? | Ch 9 | No — generic |
| Final sentence is report-style summary, not in-scene closure | Ch 9 | **No — generic** |
| Victim still unnamed at arrest ("for the murder of the victim") | Ch 9 | **No — generic** |

### 2.10 Prose / polish (4/10)

| Issue | Chapters | Story-specific? |
|-------|----------|-----------------|
| Report-style exposition: "Direct evidence ties Eleanor Voss to the mechanism access point" | Ch 6 | **No — generic** |
| Typo: "the the answers danced in the shadows" | Ch 2 | Incidental |
| Typo: "The realization struck his like a lightning bolt" (`his` → `her`) | Ch 6 | Incidental |
| "We are obliged to hold for the investigator to arrive" — unnatural phrasing (template artefact) | Ch 3 | **No — generic** |
| "Performing my duties at the club" — odd phrase for playing cards | Ch 5 | Incidental |

---

## Step 3 — Strategic Fixes (Story-Agnostic)

Ordered by score impact. All fixes apply to any generated mystery.

---

### CAT-4 — Character Clarity

#### FIX-C1: Cast Pronoun Lock per Chapter Prompt

**Status: Already implemented.**

`buildPronounAccuracyBlock(cast)` (line 2903) generates a `⛔ ABSOLUTE PRONOUN LOCK` table from `cast[].gender` and injects it as a critical-priority section. A compact per-character pronoun summary is additionally prepended to the user message on every call (line 4256), and the full table is re-included in retry feedback from attempt 2 onward (line 5655).

If pronoun drift persists in future runs, the failure is the LLM ignoring a present instruction, not a missing gate. Investigate whether `chapterPronRepairCount` is firing, or whether the CML YAML `cast[].gender` field is populated.

**Code location:** `agent9-prose.ts → buildPronounAccuracyBlock` (line 2903), compact lock (line 4256)
**Expected impact:** Already active

---

#### FIX-C2: Victim-Name Hard Gate for Chapter 1

**Status: Already implemented** as "Fix 10c" (line 6643).

When `chapterNumber === 1`, `evaluateCandidate` resolves the victim's name via `resolveVictimName(inputs.cast)` and verifies it appears at least once in the chapter text. Absence is a `hardErrors` entry — a full regeneration, not a lint-level retry.

If the victim is still unnamed in future runs, check that `resolveVictimName()` returns a non-empty string (the CML YAML must have `victim.name` populated or a cast entry with `role: victim` and a `name` field).

**Code location:** `agent9-prose.ts → evaluateCandidate` (line 6643)
**Expected impact:** Already active

---

#### FIX-C3: Role-Sanity — Gender Agreement in Collective Nouns

**Problem:** "Both men" used for Hale + Finch in Ch 8 despite both having female pronouns in the same paragraph.

**Root cause:** The LLM applies a default collective noun without checking each character's gender assignment.

**Fix:** Add a lint rule: if a sentence contains a cast member's name alongside a gendered collective noun ("both men", "the two gentlemen", "both women", "the two ladies"), flag if the collective gender contradicts the established pronoun for that character.

**Code location:** `agent9-prose.ts → lintBatchProse`
**Expected impact:** +1 Character clarity

---

### CAT-10 — Prose / Polish

#### FIX-PR1: Template Boilerplate — Duplicate Openers (Non-Deferrable Gate)

**Problem:** Chapters open with a duplicate first sentence (the same opening sentence appears twice consecutively), surviving to the committed chapter because the `intra_chapter_sentence_duplicate` lint is deferred when harder errors are already flagged.

**Root cause:** Location-formula patterns (`"The [Room] in [Place] held…"`, `"Entering The [Room] in [Place],"`) are already caught by `TEMPLATE_BLEED_CHECKS` (Fix 4, lines 1280–1282). The *unsolved* gap is that the duplicate-sentence linter (`intra_chapter_sentence_duplicate`) is treated as deferrable, so when another hard error is present it is skipped — and duplicates survive on later attempts.

**Fix:** In `lintBatchProse`, change the duplicate-sentence check to be non-deferrable for the first two paragraphs of each chapter. Specifically: run the `intra_chapter_sentence_duplicate` check against `paragraphs[0]` and `paragraphs[1]` unconditionally, regardless of whether a higher-priority error has already been found. Only defer the check for paragraphs 3+.

**Code location:** `agent9-prose.ts → lintBatchProse` — duplicate-sentence loop
**Expected impact:** +2 Atmosphere

---

#### FIX-PR2: "Waiting for Investigator" Debug-Note Pattern

**Problem:** "We have to hold on until the investigator can arrive" appears in every chapter despite Beatrice being the investigator throughout.

**Root cause:** This is template bleed from the amateur-detective scaffolding. `DEBUG_NOTE_PATTERNS` catches some forms but not all variants.

**Partial status:** Two of four patterns are already present (lines 1296–1297):
```typescript
/\buntil the investigator\b.{0,40}\b(?:arriv|comes?|is here)\b/i,   // ✅ done
/\bhold on\b.{0,50}\buntil.*investigator\b/i,                        // ✅ done
```

**Fix:** Add the two missing variants to `DEBUG_NOTE_PATTERNS`:
```typescript
/\bwe (?:must|have to|need to) wait\b.{0,40}\b(?:investigator|detective|inspector)\b/i,
/\bthe (?:investigator|detective|inspector) (?:will|should) (?:know|arrive|be here)\b/i,
```

**Code location:** `agent9-prose.ts → lintBatchProse → DEBUG_NOTE_PATTERNS` (after line 1297)
**Expected impact:** +1 Dialogue, +1 Pacing

---

#### FIX-PR3: Report-Obligation Language in Prose

**Status: Already implemented** (lines 1300–1301).

Both patterns are in `DEBUG_NOTE_PATTERNS`:
```typescript
/\bthis evidence points to\b.{0,80}\b(?:involvement|guilt|culpability)\b/i,  // ✅ done
/\bdirect evidence ties\b.{0,80}\baccess point\b/i,                           // ✅ done
```

If these phrases still appear in future runs, check that the linter result is being evaluated (i.e., lint issues are causing retries, not being suppressed at max-attempts bypass).

**Code location:** `agent9-prose.ts → DEBUG_NOTE_PATTERNS` (lines 1300–1301)
**Expected impact:** Already active

---

### CAT-5 — Dialogue

#### FIX-D1: Clue-Disclosure Embargo in Obligation Block

**Status: Already implemented** (line 2509).

`clueStageForRun` maps the chapter's arc position to stages 1–4. When `clueStageForRun <= 3`, `buildChapterObligationBlock` injects `CLUE DISCLOSURE RULE (Stage N/4)` with stage-specific restrictions on how explicitly a conclusion may be stated. Stage 1 restricts to observation only; stage 2 allows limited inference.

The arc-position mapping covers all standard arc labels. For this story's 9-chapter structure verify that Ch 6's arc position (`investigation` or similar) maps to stage ≤ 3 so the restriction is active when Beatrice makes her blunt conclusion statement.

**Code location:** `agent9-prose.ts → buildChapterObligationBlock` `clueStageForRun` (line 2327), injection (line 2509)
**Expected impact:** Already active

---

### CAT-3 — Plot Structure

#### FIX-DT1: Discriminating-Test Chapter Must Introduce a New Fact

**Status: Already implemented** (line 2572).

When the arc position is `discriminating_test`, `buildChapterObligationBlock` injects: `NEW OBSERVABLE FACT REQUIRED: this chapter MUST introduce exactly one physical fact, object, or testimony that has NOT appeared in any prior chapter. A discriminating-test chapter that only recapitulates known facts will be rejected and regenerated.`

One risk: this requirement is in the `lines` array. Confirm it is tagged at `priority: 'critical'` (not `standard`) so it cannot be pruned by the prompt-budget trimmer at max token pressure.

**Code location:** `agent9-prose.ts → buildChapterObligationBlock` (line 2572)
**Expected impact:** Already active

---

### CAT-8 — Pacing

#### FIX-P1: Chapter-Beat Uniqueness Gate

**Problem:** Ch 7 adds no narrative information beyond Ch 6 (~60 % n-gram overlap).

**Root cause:** `USED_BEATS` injection lists prior chapter purposes but does not differentiate the n-gram overlap threshold based on arc-position similarity. Two consecutive chapters at the same arc position (both `investigation`) share structural vocabulary, but the current threshold (drawn from `styleLinterConfig.ngram.overlap_threshold`) is a single value applied uniformly.

**Fix:** In `lintBatchProse`, when the current chapter's arc-position label matches the immediately prior committed chapter's arc-position label, apply a tighter overlap threshold (0.60 instead of the default 0.65). Specifically:
1. Accept `currentArcPosition` as a parameter (already available in the function signature or via `options`).
2. Compare against `priorChapters[priorChapters.length - 1]`'s arc position (stored in `narrativeState.arcPositions` or derived from `macroArcPlan`).
3. If they match, use `overlapThreshold = 0.60` instead of `styleLinterConfig.ngram.overlap_threshold`.

**Code location:** `agent9-prose.ts → lintBatchProse` — `ngram_overlap` check (line 1184), threshold sourced from `styleLinterConfig` (not a literal in the function)
**Expected impact:** +2 Pacing

---

#### FIX-P2: Investigator-Role Declaration in Chapter 1

**Problem:** Beatrice acts as detective throughout but never establishes herself in that role. All chapters 1–8 defer to an arriving "real" investigator.

**Root cause:** No Ch 1 obligation requires the detective character to establish their investigative authority.

**Fix:** When `chapterStart === 1` and the cast contains a detective role, inject: `- INVESTIGATOR ESTABLISHMENT REQUIRED: [Detective name] must claim or be delegated the investigative role in this chapter. Do not reference an arriving external detective.`

**Code location:** `agent9-prose.ts → buildChapterObligationBlock`
**Expected impact:** +1 Dialogue, +1 Character clarity

---

### CAT-7 — Mystery Clues

#### FIX-M1: Alibi Verification Must Happen On-Page

**Problem:** Dr. Finch's hospital alibi is mentioned but the confirmation is never shown as an in-scene event.

**Root cause:** The obligation block requires that suspects be cleared, but does not specify that the clearing event must be shown rather than asserted.

**Fix:** In clearance obligations, add: `(d) the clearing event must be shown as an in-scene moment — a named witness, a physical record, or a witnessed observation. Asserting the alibi without showing its confirmation is not sufficient.`

**Code location:** `agent9-prose.ts → buildChapterObligationBlock`
**Expected impact:** +1 Mystery clues

---

#### FIX-M2: Culprit Testimony Lock

**Problem:** Eleanor's stated clock-check time changes between Ch 1 (11:10) and Ch 3 (11:20), which is either an authorial error or an unused planted contradiction.

**Root cause:** Character testimony is not locked the way physical clock readings are. `lockedFacts` is populated upstream (by the worker or the `generateProse` commit section) with physical evidence values, but verbal testimony from named characters is never extracted and locked after a chapter commits.

**Fix:** In the chapter-commit block inside `generateProse` (line 7225), after `chapters.push(...)`, check if the newly committed chapter is Ch 1. If so, scan the committed text for a time-attribution pattern attributed to the culprit:
```typescript
/(?:culpritName)\b.{0,80}\bat\s+(\d{1,2}[:.]\d{2})\b/i
```
If found, append to `inputs.lockedFacts` (or a mutable equivalent): `{ id: 'culprit_testimony_time', value: matchedTime, description: '[Name] stated they checked the clock at', appearsInChapters: ['2+'] }`. The existing `buildChapterObligationBlock` locked-facts injection (line 2644) will then emit it for all subsequent chapters automatically.

**Code location:** `agent9-prose.ts → generateProse` chapter-commit block (around line 7225) + `buildChapterObligationBlock` locked-facts injection (line 2644)
**Expected impact:** +1 Mystery clues, +1 Pacing

---

### CAT-9 — Ending / Reveal

#### FIX-E1: Confession Must Name the Act, Not Just Tampering

**Status: Already implemented** as FIX-M2+E1 (lines 2597–2600).

For confession/confrontation arc positions, `buildChapterObligationBlock` injects three mandatory lines:
- `⚠ EVIDENCE CHAIN REQUIRED` — (a) mechanism of death, (b) access to victim, (c) motive, (d) exclusion of all other suspects
- `⚠ KILL STATEMENT REQUIRED` — the culprit must use a first-person kill-act phrase or the detective must state it directly
- `⚠ PRONOUN RESOLUTION` — any third-party pronoun in the confession must be resolved by naming the character

Verify that the arc position for Ch 9 (Eleanor's confession) evaluates as `confrontation` or `resolution` — not `investigation` — so these injections are active for that chapter.

**Code location:** `agent9-prose.ts → buildChapterObligationBlock` FIX-M2+E1 (lines 2597–2600)
**Expected impact:** Already active

---

#### FIX-E2: Forbid Report-Style Closing Sentence in Resolution Chapter

**Problem:** The final sentence of Ch 9 is a third-person summary ("Eleanor Voss was responsible, and the evidence placed the matter beyond all reasonable doubt") rather than a scene moment.

**Root cause:** No gate checks the final paragraph of a resolution chapter for summary-report phrasing.

**Fix:** In `lintBatchProse`, after the `DEBUG_NOTE_PATTERNS` loop, add a conditional block: if the current batch's arc position is `resolution` (derive from `options?.macroArcPlan?.[batchStart - 1]?.arcPosition`), check the *final paragraph* of the chapter against three patterns:
```typescript
/^[A-Z]\w[\w\s]+ was responsible\b/,
/\bplaced the matter beyond\b/i,
/\bevidence (?:confirmed|established)\b.{0,40}\bbeyond\b/i,
```
Flag as `debug_note_bleed` (existing type) with message: `"Resolution chapter must close with an in-scene moment, not a summary verdict sentence."`

Note: `lintBatchProse` receives arc info via `options?.macroArcPlan` and `options?.batchChapterStart`. There is no standalone `currentArcPosition` parameter — derive it as `macroArcPlan[batchChapterStart - 1]?.arcPosition`.

**Code location:** `agent9-prose.ts → lintBatchProse` — after `DEBUG_NOTE_PATTERNS` loop, conditional on arc position
**Expected impact:** +1 Ending/reveal

---

### CAT-6 — Atmosphere / Setting

#### FIX-SS: Estate Name Lock

**Problem:** "Little Middleton Manor" (CML) and "Caldwell Manor" (LLM invention) are used interchangeably across all chapters.

**Root cause:** A generic setting lock already exists in `buildCaseOverview` (line 1845): `"Do not invent a proper name for the estate, house, or property — the setting has no separate proper name beyond '${location}' itself."` However, when `${location}` is already a named estate (e.g., "Little Middleton Manor"), the LLM interprets this as permission to use any plausible estate name — it doesn't understand that the location variable IS the estate name.

**Fix:** In `buildCaseOverview`, replace the generic phrasing with an explicit canonical-name constraint:
```typescript
`Do not invent an alternative estate name. The only permitted name for this property is "${location}" — any other estate name (e.g., "Caldwell Manor", "Ashwood Hall") is a continuity error.`
```

This makes the LLM's own invented name a specific counterexample it must avoid, rather than leaving the ban abstract.

**Code location:** `agent9-prose.ts → buildCaseOverview` (line 1845)
**Expected impact:** +1 Atmosphere, +1 Prose/polish
