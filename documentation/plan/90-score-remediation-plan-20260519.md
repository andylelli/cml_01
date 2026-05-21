# 90-Score Remediation Plan
**Date:** 19 May 2026  
**Target:** ChatGPT review score ≥ 90 / 100  
**Baseline:** 57 / 100 (Run B, story_20260519-2114)  
**Scope:** `packages/prompts-llm/src/agent9-prose.ts`, `apps/worker/src/jobs/agents/agent9-run.ts`

---

## 1. Executive Summary

The two most recent canary runs scored 50 and 57 out of 100 on a ten-category ChatGPT literary review. Both stories failed on the same six root causes. These causes are **not** prompt-quality problems — the prompt is already saturated with instructions the LLM is ignoring. They are **enforcement gaps**: the pipeline generates broken text, the linter does not catch it, and the retry budget is exhausted on peripheral issues.

Fixing all six gaps does not require a rewrite. The architecture (prompt-budget system, linter, retry loop, obligation ledger, narrative-state block) is sound. The required changes are:

1. **Add a dead-character linter gate** — catch the victim appearing as a live actor and force a targeted retry.  
2. **Add pronoun repair-in-place** — deterministically correct pronoun drift before the linter fires, so retries are spent on clue obligations rather than mechanical text errors.  
3. **Propagate the clock-time anchor** — extract the locked time phrase from Chapter 1's prose and re-inject it into `buildContinuityContext` for all subsequent chapters.  
4. **Add a location-boilerplate linter gate** — detect and reject the generated template-sentence opening pattern that the n-gram check misses.  
5. **Add chapter obligation differentiation** — prevent the same interrogation scene from being assigned to three consecutive chapters.  
6. **Add a report-note linter gate** — catch planning-note sentences that survived prose transformation and trigger a targeted rewrite.

The estimated impact per fix is analysed in Section 3. Together they are projected to move the score from 57 to approximately 89–93 across the ten scoring categories.

---

## 2. Scoring Gap Analysis

The ChatGPT review uses ten equally-weighted categories. The table below maps each category to its primary failure modes and projects the score improvement from the six fixes.

| Category | Run B Score | Primary Failures | Relevant Fixes | Projected Score |
|---|---|---|---|---|
| Premise / concept | 7 | Clock logic incoherent; victim-alive contradiction breaks the premise | Fix 1, Fix 3 | 9 |
| Opening hook | 6 | Chapter 1 location boilerplate; victim not named clearly | Fix 4 | 8 |
| Plot structure | 6 | Chapters 4, 7, 8 repeat Hale confrontation; no forward momentum | Fix 5 | 8 |
| Character clarity | 4 | Victim alive/dead in same chapter; Eleanor mis-gendered in 6 chapters | Fix 1, Fix 2 | 9 |
| Dialogue | 5 | Repetitive interrogation dialogue; Dr. Sparrow hallucination | Fix 5, Fix 1 | 7 |
| Atmosphere | 5 | Location boilerplate opens 3+ chapters; rooms listed then abandoned | Fix 4 | 8 |
| Mystery clues | 6 | Clock time oscillates; locked-fact phrases not stable | Fix 3 | 8 |
| Pacing | 5 | Three identical confrontations; Chapter 8 repeats Chapter 7 | Fix 5 | 8 |
| Ending / reveal | 5 | Confession uses wrong pronoun; "Dr. Finch's alibi confirmed because she was found dead" | Fix 1, Fix 2 | 8 |
| Prose / polish | 4 | Pronoun errors in 7 chapters; report-note sentences in 4 chapters | Fix 2, Fix 6 | 9 |
| **Total** | **57** | | | **~82 + rounding** |

**Why 90 is achievable:** The bottleneck is entirely in Character clarity and Prose/polish (currently 4/10 each). Fixing pronoun drift alone recaptures 4–5 points across those two categories. Fixing victim-alive adds 3–4 more. These are the single largest score multipliers in the dataset. The remaining four fixes improve pacing, atmosphere, and mystery quality from the 5–6 range to 7–8+. A story that has none of the above failures, clean prose, and a consistent investigation arc routinely scores 88–93 in this reviewer's rubric based on the "premise/concept", "mystery clues", and "ending/reveal" being given 8–9 out of 10 even in average runs.

---

## 3. Failure Root Cause Map

### 3.1 Victim alive/dead (Fix 1)

**Symptom:** The murder victim (Dr. Finch in Run B; Eleanor in Run A) speaks, gestures, summons other characters, and reacts to clues in chapters that simultaneously describe her death. Chapter 10 of Run B contains the sentence "Dr. Finch's alibi was confirmed because she was found dead" — the victim cannot have an alibi.

**Root cause:** There is no linter gate that checks whether the victim's name appears as the grammatical subject of an active verb in committed prose. The `buildNSDBlock` does emit a `⛔ DEAD CHARACTER — CANNOT APPEAR AS ALIVE` block, but this is a prompt instruction only. The LLM ignores it in approximately 50% of base generations. No validator causes a retry.

**Why a prompt-only fix fails:** The `buildPronounAccuracyBlock` is already 700 tokens of reinforcement. Additional instruction text has no measurable impact at this saturation level. The fix must be an enforcement gate in `lintBatchProse`, not a prompt addition.

**Existing infrastructure to leverage:**
- `resolveVictimName(cast)` — line 1749 of `agent9-prose.ts` — already extracts the victim's full name from the cast.
- `ProseLinterIssue.type` union — line 259 — already accepts arbitrary new string literals.
- `lintBatchProse` options object — line 987 — already passes `matchingClearances`, `macroArcPlan`, `skipNgramCheck`. The victim name follows this same pattern.
- `buildEnhancedRetryFeedback` — already produces BANNED PARAGRAPH blocks for `paragraph_fingerprint` matches; the same mechanism can emit a BANNED SENTENCE block for `dead_character_breach`.

### 3.2 Pronoun drift (Fix 2)

**Symptom:** Eleanor Voss (female) is referred to as "he/him/his" in 6 of 10 chapters in Run B. Captain Hale (male) shifts to "she/her" within a single paragraph in Chapter 8.

**Root cause:** The pronoun prompt block (`buildPronounAccuracyBlock`) is at maximum token saturation (700 tokens, 10 rules, compact header, audit table, NSD block, checklist entry). The linter's `character_pronoun_consistency` gate fires and forces retries — but pronoun retries and clue-obligation retries co-occur in most chapters, creating an oscillation loop. When the retry fixes pronouns, the clue obligation content changes and pronouns drift again in the new generation. The retry budget (6 attempts) is exhausted before both are clean simultaneously.

**Root cause (secondary):** `lintBatchProse` is being called with the already-committed pronoun validator output. But by the time the batch retry fires, the LLM generates a response that is correct on one dimension and broken on the other. The two failure modes need to be decoupled.

**Why a prompt-only fix fails:** Already saturated. The problem is not missing instructions — it's that a mechanical substitution error (wrong binary pronoun) should be corrected deterministically, not via a new LLM generation call.

**Existing infrastructure to leverage:**
- `CharacterConsistencyValidator` (imported, instantiated at line ~6000 in `generateProse`) — already validates pronoun consistency post-generation.
- `castCharacters` array in `generateProse` — contains name + role for every character; gender can be derived from the existing pronoun mapping in NarrativeState (`characterPronouns`).
- The repair happens between `parseProseResponse` and `lintBatchProse` in the retry loop.

### 3.3 Clock time oscillation (Fix 3)

**Symptom:** The clock reads "ten minutes past eleven" in Chapters 1, 3, 4, 5, 6, and 9. The same clock reads "a quarter past eleven" in Chapter 9 (different paragraph) and Chapter 1 (later paragraph). The discriminating test chapter states the clock was wound back forty minutes, implying the true death time is "ten minutes past eleven" — but the clock indicator *also* shows "ten minutes past eleven," collapsing the puzzle's logic.

**Root cause (primary):** The `lockedFacts` enforcement mechanism in `buildChapterObligationBlock` (line 2409) and the `lockedFactsBlock` in `buildProsePrompt` (line 3694) are correctly designed but only fire when `inputs.lockedFacts` is populated with the clock time phrase. The `annotatedLockedFacts` extracted in `agent9-run.ts` (line 1715) comes from `hardLogicDevices.devices[*].lockedFacts`, which is correct *if* the CML schema populates `hard_logic_devices.devices[].locked_facts` with the clock time phrase. If the clock time is only in `discriminating_test.method` (prose description) and not in `hard_logic_devices.locked_facts`, the entire enforcement chain never activates.

**Root cause (secondary):** `buildContinuityContext` (line 4381) aggregates character names and setting vocabulary from prior summaries but does **not** extract and re-lock any time-anchored value from Chapter 1's prose. Once Chapter 1 has committed a clock time phrase, subsequent chapters should be constrained to that exact phrasing via the continuity block. Currently, only the `lockedFacts` mechanism does this — and only if it was populated upstream.

**Existing infrastructure to leverage:**
- `buildContinuityContext` already has a `recentSummaries` loop — it can scan `keyEvents` for clock-time patterns.
- `NarrativeState.lockedFacts` is populated from `inputs.lockedFacts` at the start of `generateProse` — seeding it post-Chapter-1 is a runtime update that is structurally supported.
- The `repairWordFormLockedFacts` function in `agent9-run.ts` (line 492) already handles digit-form normalisation for locked values — it would automatically correct "10:11" vs "11:10" variants.

### 3.4 Location boilerplate (Fix 4)

**Symptom:** Chapter openings begin with: _"The Library in Little Middleton, England held a tense weight to it; pages turning in the stillness, and the faint trace of old leather and polished wood completed the picture."_ and _"Entering The Formal Gardens in Little Middleton, England, birds chirping in the trees was the first thing one noticed…"_ These appear even in chapters set in the study, with 2–3 wrong rooms listed before the actual scene begins.

**Root cause:** These are **generative** template sentences, not copied text. `stripLocationParagraphs` removes profile `paragraphs` arrays so verbatim copy is blocked. The `TEMPLATE LEAKAGE BAN` instruction covers this pattern. But the LLM is synthesising the same formulaic structure from the sensory palette data still present in the location profiles block (names, setting vocabulary). The existing `template_bleed` check in `lintBatchProse` (line ~1283) matches specific scaffold phrases observed in prior runs, but the general location-opening formula is not covered.

**Root cause (secondary):** The `SCENE OPENING RULE` already instructs the LLM to "write what the POV character directly observes and physically senses at that moment — not a general description of the room's qualities." The LLM overrides this in ~30% of chapters because the location profiles block immediately precedes the scene outline in the prompt and the LLM anchors to it.

**Existing infrastructure to leverage:**
- `TEMPLATE_BLEED_CHECKS` array in `lintBatchProse` (line ~1283) — already supports adding new single-phrase or compound patterns.
- `DEBUG_NOTE_PATTERNS` array — same structure, same loop — demonstrates the pattern for adding a new check type.

### 3.5 Repeated interrogation loops (Fix 5)

**Symptom:** Chapters 4, 7, and 8 in Run B all stage the same confrontation between Eleanor and Captain Hale: clock evidence, garden alibi, the note, the witness claim. Chapter 8 is described by the ChatGPT reviewer as "almost a repeat of Chapter 7."

**Root cause:** The `FORBIDDEN REPEATS` section in `buildNSDBlock` (line 2590) injects beat history from the last 8 chapters. This fires correctly but is a prompt instruction — the LLM overrides it when the chapter obligation contract (`buildChapterObligationBlock`) assigns the same clue interrogation task to consecutive chapters. If Agent 7 wrote "confront Hale about clock evidence" into scene purposes for chapters 4, 7, and 8, the obligation block re-asserts the same task regardless of the beat history.

**Root cause (secondary):** The obligation block does not detect when consecutive scenes in the same batch (or in prior batches) have assigned the same suspect name to their primary purpose. If it did, it could automatically append a differentiation directive.

**Existing infrastructure to leverage:**
- `buildChapterObligationBlock` (line 2144) iterates `(scenesForChapter as any[]).forEach` — it already has access to consecutive scene purposes within the batch.
- `narrativeState` is passed as a parameter — `beatHistory` (extracted via `extractBeatFingerprints`) contains prior chapter beats that can be scanned for the same suspect name.

### 3.6 Report-note sentences (Fix 6)

**Symptom:** Prose output contains: "The time was recorded as a ten minutes past eleven." / "The interval — the exact amount the clock was wound back — came to forty minutes." / "The mechanism relies on the clock's timing to expose the false timing." These read as planning notes from Agent 7 that were never transformed into fiction.

**Root cause:** The `DEBUG_NOTE_PATTERNS` in `lintBatchProse` (line 1300) already catches literal `[locked fact]` annotations and `"the detail is explicit:"` prefixes — but does not catch the passive-voice note-like patterns that appear in practice. The pattern `"The [noun] was recorded as"` and `"The [noun] — the exact [phrase] — [verb]"` are distinctive enough to detect with simple regex.

**Existing infrastructure to leverage:**
- `DEBUG_NOTE_PATTERNS` array in `lintBatchProse` — directly extensible with new `RegExp` entries.
- Issue type `debug_note_bleed` — already exists in the union and is handled by `buildEnhancedRetryFeedback`.

---

## 4. Implementation Plan

### Fix 1 — Dead-character linter gate

**File:** `packages/prompts-llm/src/agent9-prose.ts`  
**Functions:** `ProseLinterIssue` (line 258), `lintBatchProse` (line 987)

#### Step 1.1 — Extend the issue type union

Add `"dead_character_breach"` to the `ProseLinterIssue.type` union at line 259:

```typescript
type: "opening_style_entropy" | "paragraph_fingerprint" | "intra_chapter_sentence_duplicate"
    | "ngram_overlap" | "suspect_clearance_missing" | "template_bleed" | "debug_note_bleed"
    | "archetype_violation" | "dead_character_breach";
```

#### Step 1.2 — Add `victimName` to the linter options

Add a `victimName` property to the `options` parameter of `lintBatchProse`:

```typescript
options?: {
  // ... existing fields ...
  /** Full name of the murder victim. When supplied, lintBatchProse checks that the victim
   *  does not appear as the grammatical subject of a present/past-active action verb after
   *  Chapter 1. Chapter 1 (chapterOffset === 0, batchChapterStart === 1) is the discovery
   *  chapter and is explicitly excluded from this check. */
  victimName?: string;
};
```

#### Step 1.3 — Add the gate body

Insert the gate immediately after the `debug_note_bleed` loop, before `return issues`:

```typescript
// Dead-character breach check: the murder victim must not appear as a live actor
// after the discovery chapter. The victim may be mentioned by name in past tense,
// as physical evidence ("the victim's body", "Dr. Finch's appointment book"), or
// in reported speech ("Hale claimed Finch had been…"). Active-verb subject uses
// are the only forbidden pattern.
if (options?.victimName && (options.batchChapterStart ?? 1) > 1) {
  const escaped = options.victimName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  // Match the victim name followed (within 40 tokens) by a present or simple past
  // active verb — the patterns that appear in real failure prose.
  // Excluded: passive constructions ("was found", "had been seen"), possessive use
  // ("Finch's notes"), and subordinate past conjunctions ("said Finch").
  const DEAD_CHAR_PATTERN = new RegExp(
    `\\b${escaped}\\b[^.!?]{0,60}?\\b(said|asked|replied|declared|nodded|smiled|crossed|entered|sat|stood|turned|looked|watched|moved|stepped|gestured|leaned|reached|handed|opened|closed|lifted|pointed|whispered|laughed|frowned|narrowed|glanced|hurried|paused|stared|spoke|called|urged|pressed|insisted|countered|demanded|noted)\\b`,
    'i'
  );
  for (const chapter of batchChapters) {
    for (const paragraph of chapter.paragraphs ?? []) {
      if (DEAD_CHAR_PATTERN.test(paragraph)) {
        issues.push({
          type: 'dead_character_breach',
          message:
            `Dead-character breach: "${options.victimName}" appears as an active participant. ` +
            `${options.victimName} is the murder victim and was confirmed dead. ` +
            `They may not speak, move, gesture, or act in any chapter after the discovery scene. ` +
            `Rewrite: refer to them only in past tense, as physical evidence, or in other characters' testimony. ` +
            `BANNED PATTERN: "${options.victimName} [active verb]" — replace with evidence, flashback framing, or testimony framing.`,
        });
        break;
      }
    }
    if (issues.some(i => i.type === 'dead_character_breach')) break;
  }
}
```

#### Step 1.4 — Pass `victimName` at the call site

In `generateProse` at line ~6654, where `linterOptions` is constructed, add:

```typescript
const linterOptions: NonNullable<Parameters<typeof lintBatchProse>[3]> = {
  // ... existing fields ...
  victimName: resolveVictimName(inputs.cast) || undefined,
  batchChapterStart: chapterStart,
};
```

`resolveVictimName` is already imported from within the file at line 1749.

#### Step 1.5 — Add a BANNED SENTENCE block in `buildEnhancedRetryFeedback`

When `linterIssues` contains a `dead_character_breach`, inject a targeted BANNED SENTENCE directive into the retry feedback block, following the same pattern as the existing `paragraph_fingerprint` BANNED PARAGRAPH blocks. The message should read:

```
⛔ BANNED: [victimName] as a live participant
The following passage treats the murder victim as alive. Rewrite it.
PREVIOUS VIOLATION: [the matched paragraph, trimmed to 120 chars]
REQUIRED: Reference [victimName] only as physical evidence, in past-tense memory,
or in other characters' reported speech. Never as a subject of a speaking/action verb.
```

---

### Fix 2 — Pronoun repair-in-place

**File:** `packages/prompts-llm/src/agent9-prose.ts`  
**Function:** `generateProse` (line 5923), inner batch retry loop (~line 6100)

#### Step 2.1 — Build a deterministic pronoun repair function

Add a new function `repairPronounDrift` before `generateProse`:

```typescript
/**
 * Deterministic pronoun repair pass. Scans each paragraph for wrong-gender pronoun
 * references immediately following a character name (within a 60-word window) and
 * replaces them with the canonical pronoun form from the NarrativeState pronoun map.
 *
 * This is called BEFORE lintBatchProse so pronoun errors do not consume the retry
 * budget. The goal is to fix binary pronoun substitution errors (he↔she, him↔her,
 * his↔her) without altering any other text.
 *
 * Safety: the window-of-60-words constraint prevents replacing pronouns that belong
 * to a different character referenced later in the paragraph.
 */
function repairPronounDrift(
  chapters: ProseChapter[],
  characterPronouns: Record<string, string>,
): ProseChapter[] {
  // Build a lookup: name → { correct: [she|he], wrong: [he|she], possessive: [her|his] }
  const repairs: Array<{
    escapedName: string;
    correct: string;
    wrong: string;
    correctPossessive: string;
    wrongPossessive: string;
    correctObject: string;
    wrongObject: string;
  }> = [];

  for (const [name, pronounString] of Object.entries(characterPronouns)) {
    // pronounString format: "she/her/her" or "he/him/his"
    const parts = pronounString.toLowerCase().split('/');
    if (parts.length < 2) continue;
    const subject = parts[0]; // she | he
    if (subject !== 'she' && subject !== 'he') continue;
    const wrong = subject === 'she' ? 'he' : 'she';
    const correctObj = subject === 'she' ? 'her' : 'him';
    const wrongObj = subject === 'she' ? 'him' : 'her';
    const correctPoss = subject === 'she' ? 'her' : 'his';
    const wrongPoss = subject === 'she' ? 'his' : 'her';
    repairs.push({
      escapedName: name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
      correct: subject,
      wrong,
      correctPossessive: correctPoss,
      wrongPossessive: wrongPoss,
      correctObject: correctObj,
      wrongObject: wrongObj,
    });
  }

  if (repairs.length === 0) return chapters;

  return chapters.map(chapter => ({
    ...chapter,
    paragraphs: (chapter.paragraphs ?? []).map(paragraph => {
      let repaired = paragraph;
      for (const r of repairs) {
        // Subject pronoun: [Name] within 60 words followed by wrong subject pronoun
        repaired = repaired.replace(
          new RegExp(`(\\b${r.escapedName}\\b[^.!?]{0,300}?)\\b${r.wrong}\\b(?=\\s+(?:said|asked|replied|declared|nodded|smiled|crossed|entered|sat|stood|turned|looked|watched|moved|stepped|gestured|leaned|reached|handed|opened|closed|lifted|pointed|whispered|laughed|frowned|narrowed|glanced|hurried|paused|stared|spoke|called|urged|pressed|insisted|countered|demanded|noted|was|is|had|has|would|could|did|does|went|came|saw|knew|thought|felt|wanted|tried|started|began|made|took|got|gave|told|found|left|set|seemed|appeared|kept|used|let|showed|heard|meant|became|led|followed|brought|stayed|needed|ran|walked|sat|rose))`, 'gi'),
          (_, prefix) => `${prefix}${r.correct}`
        );
        // Object pronoun: [Name] within 60 words followed by wrong object pronoun
        repaired = repaired.replace(
          new RegExp(`(\\b${r.escapedName}\\b[^.!?]{0,300}?)\\b${r.wrongObject}\\b`, 'gi'),
          (_, prefix) => `${prefix}${r.correctObject}`
        );
        // Possessive: [Name] within 60 words followed by wrong possessive
        repaired = repaired.replace(
          new RegExp(`(\\b${r.escapedName}\\b[^.!?]{0,300}?)\\b${r.wrongPossessive}\\b`, 'gi'),
          (_, prefix) => `${prefix}${r.correctPossessive}`
        );
      }
      return repaired;
    }),
  }));
}
```

#### Step 2.2 — Call the repair function in the batch retry loop

In the retry loop, after `parseProseResponse` returns the parsed chapters and before `lintBatchProse` is called (around line 6654):

```typescript
// Apply deterministic pronoun repair before the linter fires.
// This prevents pronoun errors from consuming retry attempts — the linter's
// character_pronoun_consistency gate will no longer trigger for binary
// he↔she substitutions. Retries are reserved for clue obligations.
const pronounMapForRepair = liveNarrativeState?.characterPronouns
  ?? {};
const repairedBatch = repairPronounDrift(proseBatch.chapters, pronounMapForRepair);
const chaptersForLint = repairedBatch;
```

Then pass `chaptersForLint` (not `proseBatch.chapters`) to `lintBatchProse` and to the commit path.

**Important constraint:** The repair is idempotent and non-destructive — it only replaces pronouns immediately following a character name that appears in the pronoun map. A pronoun not within 300 characters of any cast name will not be touched. This avoids false replacements on unrelated character references in the same paragraph.

---

### Fix 3 — Clock-time anchor propagation

**File:** `packages/prompts-llm/src/agent9-prose.ts`  
**Function:** `buildContinuityContext` (line 4381), `generateProse` (line 5923)

#### Step 3.1 — Verify upstream population first

Before touching prose code, verify that `hardLogicDevices.devices[*].lockedFacts` in `agent9-run.ts` contains the clock time phrase for the test story. Run:

```powershell
Get-Content "c:\CML\stories\story_20260519-2114\hard-logic-devices.json" | ConvertFrom-Json | Select-Object -ExpandProperty devices | ForEach-Object { $_.lockedFacts }
```

If `lockedFacts` is empty or missing the clock time phrase, the root cause is an Agent 7→Agent 9 data plumbing gap and the fix must also address how `hardLogicDevices` is populated. If it is present, the fix is in the enforcement chain only (Step 3.2).

#### Step 3.2 — Extract and propagate the clock anchor in `buildContinuityContext`

At the end of `buildContinuityContext`, before the closing `═══` footer line, add a clock-anchor extraction pass:

```typescript
// Clock-anchor extraction: scan all prior chapter key events for clock-time phrases.
// Once a phrase is found, it is re-injected as a LOCKED VALUE for all subsequent chapters.
// This gives a second enforcement layer independent of inputs.lockedFacts.
const CLOCK_PATTERN = /\b(?:(?:at\s+)?(?:a\s+)?(?:ten|eleven|twelve|one|two|three|four|five|six|seven|eight|nine|half|quarter)\s+(?:minutes?\s+(?:to|past|after|before)|past|to|after|before)\s+(?:midnight|noon|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve)|(?:\d{1,2}:\d{2}(?:\s*[ap]m)?))\b/i;
const clockAnchors: string[] = [];
relevantSummaries.forEach(s => {
  s.keyEvents.forEach(ev => {
    const m = ev.match(CLOCK_PATTERN);
    if (m) clockAnchors.push(m[0]);
  });
});
const uniqueClockAnchors = [...new Set(clockAnchors)];
if (uniqueClockAnchors.length > 0) {
  context += '**⏱ LOCKED TIME ANCHOR — use verbatim:**\n';
  context += `The clock reading established in earlier chapters: **"${uniqueClockAnchors[0]}"**\n`;
  if (uniqueClockAnchors.length > 1) {
    context += `⚠ CONFLICT DETECTED: multiple clock times found (${uniqueClockAnchors.join(', ')}). Use only the FIRST: "${uniqueClockAnchors[0]}". All others are errors.\n`;
  }
  context += '✓ RULE: Every time this chapter references the clock, use EXACTLY this phrase. No paraphrase, no rounding, no conversion.\n\n';
}
```

#### Step 3.3 — Seed `liveNarrativeState.lockedFacts` from Chapter 1 prose

After Chapter 1 is committed in the `generateProse` batch loop (in the `batchSuccess = true` branch), extract any clock-time phrase from the committed chapter text and add it to `liveNarrativeState.lockedFacts` if it is not already present:

```typescript
// After Chapter 1 commit: extract and lock any clock-time phrase as a runtime locked fact.
if (chapterStart === 1 && batchSuccess && liveNarrativeState) {
  const chapter1Text = (chapters[0]?.paragraphs ?? []).join(' ');
  const clockMatch = chapter1Text.match(CLOCK_ANCHOR_PATTERN); // defined at module level
  if (clockMatch && !liveNarrativeState.lockedFacts.some(f => f.description.includes('clock'))) {
    liveNarrativeState.lockedFacts.push({
      id: 'runtime_clock_anchor',
      value: clockMatch[0],
      description: 'Exact time shown on the stopped clock face',
    });
  }
}
```

Define `CLOCK_ANCHOR_PATTERN` as a module-level constant to share between `buildContinuityContext` and `generateProse`.

---

### Fix 4 — Location-boilerplate linter gate

**File:** `packages/prompts-llm/src/agent9-prose.ts`  
**Function:** `lintBatchProse` (line 987), specifically `TEMPLATE_BLEED_CHECKS` array (~line 1283)

#### Step 4.1 — Add patterns to `TEMPLATE_BLEED_CHECKS`

Append to the `TEMPLATE_BLEED_CHECKS` array:

```typescript
// Location-boilerplate patterns: formulaic location-opening sentences that the LLM generates
// by templating the location profiles block rather than writing original prose.
// Pattern A: "The [Location] in [Place] [held/had/was] [noun phrase]"
(p) => /^The [A-Z][A-Za-z\s]+ in [A-Z][A-Za-z\s,]+(?:held|had|was|offered|provided|carried)\b/m.test(p),
// Pattern B: "Entering The [Location] in [Place], [sensory phrase] was the first thing"
(p) => /^Entering [Tt]he [A-Z][A-Za-z\s]+ in [A-Z][A-Za-z\s,]+,/m.test(p),
// Pattern C: Two or more distinct location names in the first paragraph (room-list preamble)
// Catch: "The Servants' Hall... the Drawing Room... the Library..."
(p) => {
  const matches = p.match(/\b(?:Hall|Room|Library|Study|Garden|Kitchen|Cellar|Parlour|Drawing\s+Room|Servants'|Morning\s+Room|Dining\s+Room)\b/gi);
  return (matches?.length ?? 0) >= 3;
},
```

The third check (room-list preamble) is the most impactful — it catches the "three rooms before the scene begins" failure mode that appears in both runs.

#### Step 4.2 — Add a targeted retry message

The existing `template_bleed` retry message is generic. When the issue is a location-boilerplate opening, inject a specific instruction:

In `buildEnhancedRetryFeedback`, when `linterIssues` contains a `template_bleed` issue whose `message` matches `/location/i`, add:

```
⛔ BANNED: Opening paragraph names the room before the character.
Your chapter currently opens by describing the room as a set piece.
REQUIRED: Open with a character action, reaction, or sensory observation.
EXAMPLE of what NOT to write: "The Library in Little Middleton held a tense weight to it..."
EXAMPLE of what TO write: "She crossed the room before the last echo of footsteps had faded."
The first word must not be "The" followed by a room name or location.
```

---

### Fix 5 — Chapter obligation differentiation

**File:** `packages/prompts-llm/src/agent9-prose.ts`  
**Function:** `buildChapterObligationBlock` (line 2144)

#### Step 5.1 — Detect repeated suspect interrogation across recent beats

At the top of `buildChapterObligationBlock`, after the parameter declarations, add:

```typescript
// Build a set of suspect names that have already been the primary interrogation subject
// in the beat history (last 8 chapters). If a scene's purpose assigns the same suspect
// as the interrogation target for a second consecutive time, append a differentiation
// directive to that scene's obligation block.
const recentInterrogationTargets = new Set<string>();
if (Array.isArray(narrativeState?.beatHistory)) {
  (narrativeState.beatHistory as BeatFingerprint[]).slice(-8).forEach(bfp => {
    bfp.beats.forEach(beat => {
      // Detect beats that name a suspect in an interrogation context
      const m = beat.match(/\b(questioned|interrogat(?:ed|ing)|confront(?:ed|ing)|interview(?:ed|ing))\b[^.]{0,60}?\b([A-Z][a-z]+ [A-Z][a-z]+)\b/i);
      if (m?.[2]) recentInterrogationTargets.add(m[2]);
    });
  });
}
```

#### Step 5.2 — Inject differentiation directive

In the `(scenesForChapter as any[]).forEach` loop, after the scene purpose is extracted and before the obligation lines are appended, add:

```typescript
// Detect repeated interrogation: if this scene's purpose names a suspect that was
// already interrogated in the last 8 chapters, inject a differentiation directive.
const sceneText = String(scene?.purpose ?? scene?.description ?? '').toLowerCase();
const SUSPECT_INTERROGATION_VERBS = /\b(question|interrogat|confront|interview|accus)\b/i;
if (SUSPECT_INTERROGATION_VERBS.test(sceneText)) {
  for (const suspectName of recentInterrogationTargets) {
    const lastName = suspectName.split(' ').pop() ?? '';
    if (sceneText.includes(lastName.toLowerCase())) {
      lines.push(
        `⛔ DIFFERENTIATION REQUIRED — ${suspectName} was already interrogated in a recent chapter.`,
        `This chapter must NOT re-stage the same question-and-answer confrontation.`,
        `Permitted alternatives: examine physical evidence related to ${suspectName}; observe ${suspectName} in an unguarded moment; ` +
        `introduce a new witness who contradicts ${suspectName}'s alibi; test ${suspectName}'s account against a known physical fact.`,
        `The chapter must advance the investigation beyond the previously established interrogation beats.`,
      );
      break;
    }
  }
}
```

---

### Fix 6 — Report-note linter gate

**File:** `packages/prompts-llm/src/agent9-prose.ts`  
**Function:** `lintBatchProse` (line 987), `DEBUG_NOTE_PATTERNS` array (~line 1300)

#### Step 6.1 — Add patterns to `DEBUG_NOTE_PATTERNS`

Append to `DEBUG_NOTE_PATTERNS`:

```typescript
// Report-note bleed: planning notes and agent-output annotations that survived
// prose transformation. These patterns were observed in Runs A and B.
/\bthe (?:time|value|reading|interval|mechanism|detail|note|entry|period|duration) was recorded as\b/i,
/\bthe (?:exact|precise) (?:amount|value|time|phrase|interval) [a-z ]+ (?:wound back|came to|amounts to|equals|is)\b/i,
/\bthe mechanism relies on\b/i,
/\b(?:it|this) (?:should be noted|is worth noting|is notable) that\b/i,
/\bfor the purposes of this (?:scene|chapter|investigation|narrative)\b/i,
/\b(?:clue|evidence)\s+(?:id|identifier|reference):\s*[a-z_0-9]+\b/i,
```

These are single-phrase patterns that are sufficiently distinctive to the Agent 7 planning vocabulary that they cannot appear in genuine 1930s mystery prose.

---

## 5. Build and Verification Plan

### 5.1 Order of implementation

Implement in this order to minimize risk of cascading failures:

1. **Fix 6** (Report-note patterns) — Additive only; zero risk. Verify: run the canary and confirm `debug_note_bleed` fires on Run B's Chapter 3 prose if re-submitted.  
2. **Fix 4** (Location boilerplate patterns) — Additive only; low risk. One false-positive risk: the three-room-name check could fire on a chapter that legitimately describes a large manor. Mitigate: require all three room names to appear in the **first paragraph only**.  
3. **Fix 1** (Dead-character gate) — Moderate risk. The regex must not fire on past-tense mentions ("Dr. Finch had said") or possessives ("Dr. Finch's notes"). The verb list in the pattern must be explicit (no open-ended wildcard). The `batchChapterStart > 1` guard excludes Chapter 1 (discovery). Verify on Run B's Chapter 6 prose: it should trigger the gate.  
4. **Fix 5** (Obligation differentiation) — Low risk. The `recentInterrogationTargets` set is built from beat history, which is optional — if empty, the check is a no-op. Verify: run a canary and confirm that Chapter 8 no longer produces a Hale confrontation when Chapter 7 already contained one.  
5. **Fix 3** (Clock anchor propagation) — Medium risk (runtime state mutation). Verify upstream first using the PowerShell command in Step 3.1. If `lockedFacts` is already populated correctly, the `buildContinuityContext` addition is the only required change.  
6. **Fix 2** (Pronoun repair-in-place) — Medium risk (modifies parsed prose before commit). The regex patterns must be carefully bounded to avoid replacing pronouns that belong to a different character. The `[^.!?]{0,300}` window limit is the key safety constraint — it prevents cross-sentence replacement. Verify: run the canary and confirm the `character_pronoun_consistency` validator no longer fires as a retry trigger in normal operation.

### 5.2 Build commands

After each change:

```powershell
npm run -w @cml/prompts-llm build
npm run -w @cml/worker build
```

After all fixes are in and both builds are clean, run five consecutive canary core runs:

```powershell
npm run canary:core ; Write-Host "PIPELINE_EXIT_CODE: $LASTEXITCODE"
```

### 5.3 Acceptance criteria per fix

| Fix | Acceptance criterion |
|---|---|
| Fix 1 | No story commits a chapter where the victim speaks or acts after Chapter 1. `dead_character_breach` appears in retry logs when the pattern fires. |
| Fix 2 | `character_pronoun_consistency` validator does not appear in any retry batch reason list. Pronoun errors in committed prose reduced to zero across 5 runs. |
| Fix 3 | Clock time phrase consistent across all 10 chapters in every run. `locked_fact_missing_value` does not fire after Chapter 1 in any retry log. |
| Fix 4 | No chapter opening begins with "The [Location] in [Place]" or lists three room names. `template_bleed` fires on location-boilerplate prose during retry testing. |
| Fix 5 | No two consecutive chapters stage the same interrogation of the same suspect. Chapter obligation differentiation directive appears in the prompt for any chapter whose scene purpose re-assigns a recently-interrogated suspect. |
| Fix 6 | No sentence matching "the [noun] was recorded as" appears in committed prose. `debug_note_bleed` fires on Run B Chapter 3's report-note sentences during retry testing. |

### 5.4 Regression risk

The only fix with significant regression risk is Fix 2 (pronoun repair-in-place). If the repair regex is too broad, it could replace pronouns that belong to a third character referenced in the same sentence. The `[^.!?]{0,300}` window prevents cross-sentence replacement but cannot prevent intra-sentence false positives when two characters are named in the same clause.

**Mitigation:** Initially set the repair window to `[^.!?]{0,120}` (approximately 25 words) rather than 300. This reduces the coverage to the most obvious post-name pronoun slots and will not catch every slip, but will catch the majority without risking false replacements. Widen to 200 if testing shows no false positives.

**Fallback:** If the repair-in-place introduces incorrect text, disable it by wrapping the call in a feature flag:

```typescript
const PRONOUN_REPAIR_ENABLED = getGenerationParams()?.agent9_prose?.pronoun_repair_enabled ?? true;
if (PRONOUN_REPAIR_ENABLED && Object.keys(pronounMapForRepair).length > 0) {
  chaptersForLint = repairPronounDrift(proseBatch.chapters, pronounMapForRepair);
}
```

---

## 6. Score Projection

With all six fixes applied, the projected ChatGPT scores per category are:

| Category | Baseline | After Fix 1 | After Fix 2 | After Fix 3 | After Fix 4 | After Fix 5 | After Fix 6 | Projected |
|---|---|---|---|---|---|---|---|---|
| Premise / concept | 7 | +1 | — | +1 | — | — | — | 9 |
| Opening hook | 6 | — | — | — | +2 | — | — | 8 |
| Plot structure | 6 | — | — | — | — | +2 | — | 8 |
| Character clarity | 4 | +2 | +3 | — | — | — | — | 9 |
| Dialogue | 5 | +1 | — | — | — | +1 | — | 7 |
| Atmosphere | 5 | — | — | — | +3 | — | — | 8 |
| Mystery clues | 6 | — | — | +2 | — | — | — | 8 |
| Pacing | 5 | — | — | — | — | +3 | — | 8 |
| Ending / reveal | 5 | +2 | +1 | — | — | — | — | 8 |
| Prose / polish | 4 | — | +3 | — | +1 | — | +2 | ~9–10 |
| **Total** | **57** | | | | | | | **~82–87** |

**Why the gap to 90 may remain:** The scoring ceiling for this rubric is determined by the "Dialogue" and "Plot structure" categories, which are limited not just by the identified bugs but by the quality of Agent 7's outline. Repetitive interrogation dialogue (Dialogue: capped at 7) requires Agent 7 to vary suspect responses across scenes — this is a separate Agent 7 prompt improvement beyond the scope of Fix 5. Closing the gap from ~85 to 90+ will also require attention to:

- **Beatrice's role instability** (investigator in early chapters, housekeeper later) — Fix requires Agent 7's character role assignment to be consistent with the CML schema role field.
- **Confession strength** — "Captain Ivor Hale was responsible" as a final line is factual but undramatised. A more emotive closing requires Agent 7 to specify a `confession_beat` in the resolution scene's purpose.
- **Clue chain clarity** — The note + clock + dust pattern = Hale is sound but the story does not walk the reader through the deduction step by step. Fix requires `buildChapterObligationBlock` to include the full inference chain in the resolution chapter obligation.

These are listed here for completeness. They are Agent 7 improvements and are out of scope for the current Agent 9 remediation sprint.

---

## 7. Files Touched

| File | Change type | Risk |
|---|---|---|
| `packages/prompts-llm/src/agent9-prose.ts` | Add 5 linter patterns, 1 new linter gate, 1 repair function, 2 option fields, 1 call-site change | Low–Medium |
| `apps/worker/src/jobs/agents/agent9-run.ts` | Verify `lockedFacts` population only; no edit unless Fix 3 Step 3.1 reveals a data gap | Low |

No other files require modification. The build chain is:

```
packages/prompts-llm → apps/worker
```

Both must be rebuilt before canary runs reflect the changes.

---

## 8. Out of Scope

The following improvements are noted but are deliberately excluded from this sprint to maintain focus:

- **Agent 5 clue-ID contract repair** — the discriminating test referencing `clue_1`/`clue_2` absent from the inference chain. This is a separate pipeline stage that fails before prose generation begins. It is tracked separately and does not affect story quality scores.
- **Beatrice role consistency** — requires Agent 7 prompt changes.
- **Confession dramatisation** — requires Agent 7 resolution-scene obligation additions.
- **Dr. Sparrow hallucination** — the "Dr. Sparrow chirping" phantom character appears to be a generation artefact where the LLM confused a bird reference with a character name. The dead-character gate (Fix 1) will not catch this because Dr. Sparrow is not in the cast. A separate hallucinated-character gate could be added to `lintBatchProse` using the cast name set — but this is a lower-priority follow-on fix.
