# ANALYSIS_17 — ChatGPT Story Review: Systematic Quality Issues and Strategic Fixes

**Date:** 2026-05-14
**Stories reviewed:**
- `story_20260514-1917` — `chatgpt-review.txt` (full 9-chapter critique)
- `story_20260514-1931` — story text (review file empty; issues confirmed by direct reading)
- `story_20260514-1944` — story text (attached, no review file yet)

**Source feedback:** ChatGPT 9-chapter critique of story_20260514-1917 (most detailed available),
cross-verified against story text from story_20260514-1931 and story_20260514-1944.

---

## Executive Summary

Five independent classes of defect appear across every story generated on May 14. They are listed
here in order of severity and reader impact:

| # | Issue Class | Severity | Chapters affected |
|---|---|---|---|
| I | **Raw scene-template text bleeding into prose** | Critical | Every chapter opening |
| II | **Pronoun inconsistency (he/she/him/her for fixed-gender characters)** | Critical | Distributed throughout |
| III | **Debug/planning notes echoed verbatim into prose** | High | Scattered |
| IV | **Chapter-to-chapter block repetition — same paragraphs recycled** | High | Mid-to-late chapters |
| V | **Story-structure incompleteness** (victim unnamed, alibi unearned, no resolution) | Medium | Structurally every story |

Each is catalogued in detail below with root-cause analysis and recommended code refactors.

---

## Issue I — Raw Scene-Template Text Bleeding Into Prose

### Evidence from reviews

**story_20260514-1917, Ch1:**
> "The Library in Little Middleton, England carried overcast with intermittent rain, typical for a
> rural estate in the 1930s, affecting outdoor activities. in every corridor; The soft rustle of
> pages turning, interrupted by the distant sound of thunder rolling outside, echoing the tension
> in the room drifted past, and The smooth, cool surface of the desk contrasts sharply with the
> rough texture of the leather-bound books that line the shelves made the tension-filled due to
> recent events and the underlying class struggles exacerbated by the great depression."

ChatGPT review flags:
- "Opening sentence contains broken scene-template text rather than natural prose" — every chapter
- "Weather metadata appears directly in the narration"
- "The phrase 'affecting outdoor activities' reads like a planning note, not fiction"
- "Sensory details are stacked awkwardly into one malformed sentence"
- "'tension-filled due to recent events and the underlying class struggles exacerbated by the
  great depression' reads like a generated mood label"
- "Great Depression should be capitalized" (a second-order symptom)
- "The phrase 'threaded through the scene' reads like a generation artifact" (Ch5)
- Duplicate paragraph: "the same 'By the time they reached The Drawing Room' paragraph appears
  twice" (Ch6)

Same pattern confirmed in story_20260514-1944:
- Ch3: `"By the time they reached Master Suite in Little Middleton... The soft creaking of the
  floorboards echoes as one moves about..."`
- Ch5: `"Drawing Room in Little Middleton, England met them with overcast..."` (no leading
  subject, raw fragment)
- Ch7: **Two** location blocks concatenated — Master Suite AND Drawing Room raw template
- Ch8: `"By the time they reached Gardens in Little Middleton..."`
- Ch9: `"In Drawing Room in Little Middleton..."`
- Ch10: `"Library in Little Middleton, England met them with overcast..."`

### Root cause

The `Agent7-NarrativeFormatter` assigns each scene a location object with these sub-fields:
`location_name`, `weather`, `sensory_detail_1`, `sensory_detail_2`, `mood`. In
`buildProsePrompt()` (or equivalent in `agent9-prose.ts`), these are being interpolated into the
prompt's **prose output zone** — the part the model should write as fiction — rather than being
placed strictly as **system context** the model should synthesize from.

The tell-tale output patterns:

```
"[LOCATION] [met them with|carried|felt sharply] [WEATHER]; [SENSORY1] lingered while [SENSORY2] 
clung to coats and curtains."

"By the time they reached [LOCATION], [SENSORY1] had become a constant undertone, and [SENSORY2] 
left the room feeling [MOOD]."

"[SENSORY1] threaded through the scene, and [SENSORY2] sharpened the [MOOD] tension."
```

These are template-string interpolation frames. The model is reproducing them verbatim because
they are included in the user/assistant message body where the model can see and continue them.

### Strategic fix — Refactor #1: Scene Header Sanitization and Linter Gate

**A. Linter gate (immediate, low-effort)**

Add a new `scene_template_bleed` sub-check to `lintBatchProse()` in `agent9-prose.ts`. Detect
any paragraph that matches known template-injection fingerprints:

```typescript
// In lintBatchProse(), add:
const TEMPLATE_BLEED_PATTERNS = [
  /\bmet them with\b/i,
  /\bthreaded through the scene\b/i,
  /\bclung to coats and curtains\b/i,
  /\bleft the room feeling\b/i,
  /\bseemed to signal a\b.*\bturn in events\b/i,
  /\bsharpened the\b.{0,40}\btension\b/i,
  /^by the time they reached\b/im,
  /\b(felt sharply|carried overcast|met them with overcast)\b/i,
  /affecting outdoor activities/i,
];

for (const para of candidateParagraphs) {
  for (const pattern of TEMPLATE_BLEED_PATTERNS) {
    if (pattern.test(para)) {
      issues.push({
        type: 'template_bleed',
        message: 'Scene-template text leaked into prose. Rewrite the chapter opening as natural 
                  prose synthesized from the scene context — do not reproduce location metadata.',
        severity: 'hard',
        matchedPattern: pattern.source,
      });
      break;
    }
  }
}
```

Assign `template_bleed` a retry rank higher than `template` (suggest rank 65 in
`retry-protocol.ts`), since it's a different failure mode that needs a different feedback message.

**B. Prompt construction guard (medium-effort, preventative)**

In the scene-spec section of `buildProsePrompt()`, locate where the location/weather/sensory
fields are injected and wrap them explicitly:

```typescript
// Before:
const sceneHeader = `${scene.location_name} — ${scene.weather}. ${scene.sensory_detail_1}. 
  ${scene.sensory_detail_2}. Mood: ${scene.mood}.`;

// After:
const sceneHeader = `
<scene_context — DO NOT REPRODUCE THESE LINES VERBATIM IN YOUR PROSE>
Location: ${scene.location_name}
Weather: ${scene.weather}
Atmosphere: ${scene.sensory_detail_1}. ${scene.sensory_detail_2}.
Overall mood: ${scene.mood}
</scene_context>
Synthesize the above into natural period prose. Do not output the location name, weather 
description, or sensory-detail phrases as written above. Evoke them through the characters' 
actions and perceptions instead.
`;
```

This is the preventative fix. The linter gate in (A) is the safety net.

---

## Issue II — Pronoun Inconsistency

### Evidence from reviews

**story_20260514-1917, ChatGPT flags (per chapter):**
- Ch1: "'Or was she merely a man grappling with the reality of loss?' — he/she switch mid-paragraph"
- Ch2: "Captain Hale's pronouns are inconsistent: Hale is addressed or described with mixed
  gender references"
- Ch2: "'The implications of such a deception weighed heavily on **his** mind' appears to refer
  to the wrong character" (Eleanor, female)
- Ch3: "Dr. Finch calls 'he assure you' when Dr. Finch is female"
- Ch7: "Eleanor gestures toward the clock, but the narration says 'He gestured'"
- Ch7: "Hale is introduced with 'she asked,' then later 'he asked'"
- Ch8: "'His focus now shifted' uses the wrong pronoun for Eleanor"
- Ch8: "'We must confront Captain Hale now,' **he** said, uses the wrong pronoun for Eleanor"
- Ch9: "Eleanor's pronouns are inconsistent: 'He had resolved' refers to Eleanor"

**story_20260514-1944 (confirmed in text):**
- Ch1: `"the doctor Finch entered the study, **his** expression"` / `"she stammered"` — mixed
- Ch4: `"As **he** approached Dr. Finch's office, **he** noted the clinical atmosphere"` — Eleanor
  rendered male throughout this chapter
- Ch6: `"**He** felt a mix of dread and determination"` — Eleanor mid-paragraph gender switch
- Ch8: `"'The clock has been tampered with,' **he** stated"` — Eleanor rendered male
- Ch10: `"**He** could feel the weight of expectation pressing down on **his** shoulders"` — Eleanor

### Root cause

The pre-validation pronoun repair in `pronoun-repair.ts` runs a deterministic sweep using
`lastSingleCharacter` tracking. The repair log shows "4–19 replacements applied per chapter" yet
pronouns still fail validation. This means:

1. **The sweep is running post-LLM output** but the LLM is generating paragraphs where the
   gender error is at the sentence subject level (not just a stray pronoun), making simple
   find/replace insufficient.

2. **The repair doesn't propagate across sentence boundaries** when the character is referenced
   only by pronoun. If Eleanor is established as "she" at sentence 1 and then the LLM writes
   "He stepped forward" at sentence 8 with no name reference in between, the repair can't
   attribute sentence 8 to Eleanor.

3. **The repair still passes the prose to validation with remaining errors** — seen in logs:
   "ch9 — 13 replacement(s) applied" yet Ch9 still fails validation on attempt 1.

### Strategic fix — Refactor #2: Hardened Pronoun Contract in Prompt

**A. Character gender lock in system prompt (immediate)**

The character gender map is currently in the character bundle but apparently not enforced strongly
enough as a **negative constraint**. Add an explicit, prominent prohibition block to the prose
generation prompt:

```typescript
// In buildProsePrompt() or equivalent, after the character bundle section:
const genderLockBlock = `
⛔ ABSOLUTE PRONOUN LOCK — NO EXCEPTIONS:
${castWithGender.map(c =>
  `  • ${c.name} → ALWAYS use ${c.pronouns} — NEVER use ${c.wrongPronouns}`
).join('\n')}

This rule overrides stylistic choice. If you are unsure which pronoun to use for a character,
re-read their name above. There is no character in this story with ambiguous gender.
`;
```

**B. Sentence-level subject tracking in pronoun repair (medium-effort)**

In `pronoun-repair.ts`, extend the repair to handle the case where a paragraph has a clear
character as paragraph subject but then switches pronouns mid-paragraph:

```typescript
// After the existing lastSingleCharacter swap:
// For each paragraph: identify the most recently named character,
// then check all subsequent pronouns in that paragraph against that character's gender.
function repairParagraphPronounConsistency(
  paragraph: string,
  characterGenderMap: Map<string, 'male' | 'female'>
): string {
  // Parse sentences; identify named characters; then sweep all pronouns
  // in the same sentence against the last named entity's gender.
}
```

**C. Retry escalation for pronoun failure (low-effort)**

Currently pronoun errors are classified as `continuity` (rank 91). The retry feedback for
pronoun failures should include the full character gender lock block, not just "fix pronouns":

```typescript
// In buildEnhancedRetryFeedback, when 'continuity' failures include pronoun errors:
if (hasPronounError) {
  feedback += `\n⛔ PRONOUN HARD-LOCK:\n`;
  for (const char of cast) {
    feedback += `  • ${char.name}: ALWAYS ${char.pronounSet} — no exceptions.\n`;
  }
}
```

---

## Issue III — Debug/Planning Notes Echoed Verbatim Into Prose

### Evidence from reviews

**story_20260514-1917, Ch2:**
> "A leftover note appears: 'The detail is explicit: ten minutes past eleven.'"
> (Immediately followed by contradictory clock time — the note is present AND the clock
> shows a different time.)

**story_20260514-1917, Ch4:**
> "A leftover note appears: 'The detail is explicit: ten minutes past eleven.'"
> "Another leftover note appears: 'The detail is explicit: forty minutes.'"

**story_20260514-1917, Ch8:**
> "'This detail added late texture without changing the essential deduction chain' is a
> leftover planning/debug note."

**story_20260514-1944, Ch5:**
> "The the clock showed a deceptive hour the timeline of the murder... The detail is
> explicit: forty minutes."

### Root cause

The locked-fact registry (Pillar 1) injects fact values with a label like:
`"[LOCKED FACT] clock_reading: ten minutes past eleven. The detail is explicit."` or similar.
This annotation is intended for the LLM to understand what value to use, but the model is
occasionally reproducing the annotation itself as prose.

Similarly, post-generation audit notes from clue-placement validation ("This detail added late
texture without changing the essential deduction chain") are likely included in a feedback context
that the model echoes back.

### Strategic fix — Refactor #3: Locked-Fact Injection Sanitization + Linter Check

**A. Linter check for known debug phrase signatures (immediate)**

Add to the `scene_template_bleed` check (or as a separate `debug_note_bleed` sub-check):

```typescript
const DEBUG_NOTE_PATTERNS = [
  /the detail is explicit:/i,
  /this detail added\b.*\btexture\b/i,
  /\[locked fact\]/i,
  /without changing the essential deduction chain/i,
  /\bpillar \d+\b.*?\bunit\b/i,
];
```

Hard-fail any paragraph containing these patterns with the message:
`"Internal audit note leaked into prose. Never reproduce instruction metadata in your fiction output."`

**B. Locked-fact prompt formatting change (low-effort)**

In the section of `buildProsePrompt()` that injects locked-fact values, replace the current
inline annotation style with a clearly demarcated reference block:

```typescript
// Before:
// "The clock reading is: ten minutes past eleven. The detail is explicit."

// After:
`
<locked_values — for reference only, do not quote or reproduce these labels in prose>
  clock_reading = "ten minutes past eleven"
  tamper_amount = "forty minutes"
</locked_values>
Use these exact values when the narrative calls for them. Do not output the variable names 
or labels — only the values, woven naturally into the prose.
`
```

---

## Issue IV — Chapter-to-Chapter Block Repetition

### Evidence from reviews

**ChatGPT Ch6/7 cross-comparison:**
> "Eleanor examines the clock mechanism again, repeating Chapter 3 and Chapter 4."
> "'Forty minutes' is discovered again, even though Chapter 4 already discovered it."
> "The dialogue is nearly a repeat of Chapter 3."

**story_20260514-1944 (confirmed by direct text comparison):**

The following block (or near-identical variant) appears in **Ch6, Ch7, Ch8, and Ch10**:

> *"The clock has been tampered with... These marks indicate that someone adjusted it recently.
> This suggests a deliberate effort to mislead us about the time of the murder."*
> *"But you had access to the study, Captain. You could have easily altered the clock without
> anyone noticing."*
> *"I assure you, I had no part in this."*
> *"The truth is buried in these details, and I won't rest until I uncover it."*

The current template linter (n-gram Jaccard, threshold 0.80) catches some of these. The
PRIOR CHAPTER DUPLICATION LOCK (added in this session) prevents the exact paragraph fingerprint
from recurring. But the deeper problem is that the **outline itself assigns the same dramatic
beat to four consecutive chapters**: "confront Hale about the clock." This makes deduplication
at the prose level a futile rear-guard action.

### Root cause (two levels)

**Level 1 — Outline level:** Agent 7 (NarrativeFormatter) is generating a 10-chapter arc where
chapters 6–9 share the same primary action: "examine/confront/confirm the clock tampering."
The outline doesn't enforce that each chapter must have a **distinct primary revelation**.

**Level 2 — Prose generation level:** When the model is given instructions for a chapter that are
semantically identical to a prior chapter's instructions, it produces semantically identical prose.
The template linter catches this after the fact but forces retries rather than solving the
structural cause.

### Strategic fix — Refactor #4: Outline Beat Uniqueness Enforcement

**A. Unique beat constraint in Agent 7 prompt (medium-effort)**

In `agent7-narrative.ts` (or the outline formatter), add a post-generation validation step that
checks whether adjacent chapters share the same primary dramatic beat tag. If so, the formatter
should be asked to revise before prose generation begins:

```typescript
function validateOutlineBeatUniqueness(outline: Chapter[]): ValidationResult {
  const beatWindow = 3; // no beat should repeat within 3 consecutive chapters
  for (let i = beatWindow; i < outline.length; i++) {
    const window = outline.slice(i - beatWindow, i + 1);
    const beats = window.map(ch => ch.primaryBeat);
    if (new Set(beats).size < beats.length) {
      return {
        valid: false,
        error: `Beat '${beats[0]}' repeats within ${beatWindow}-chapter window at chapter ${i+1}`,
      };
    }
  }
  return { valid: true };
}
```

**B. Chapter differentiation directive in prose prompt (low-effort)**

For each chapter, add to the prose prompt a "THIS CHAPTER UNIQUENESS CONTRACT" block that
explicitly lists what has already been established and instructs the model **not to re-establish**:

```typescript
function buildChapterDifferentiationBlock(
  chapterIndex: number,
  priorChapters: Chapter[],
  establishedFacts: string[]
): string {
  return `
⛔ DO NOT RE-ESTABLISH THESE FACTS (already proven in prior chapters):
${establishedFacts.map(f => `  • ${f}`).join('\n')}

THIS CHAPTER'S UNIQUE JOB:
${getChapterUniqueObjective(chapterIndex)} 
— Advance from what is already known. Every paragraph must add new information or new 
character reaction that has not appeared in any prior chapter.
`;
}
```

Populate `establishedFacts` progressively as chapters are committed. E.g., after Ch6:
`["The clock has been tampered with (tool marks confirmed)", "Forty-minute wind-back established"]`

---

## Issue V — Story-Structure Incompleteness

This issue has five sub-components that consistently appear across all three stories.

### V-A: The Victim Is Never Named

**ChatGPT observation:** "The victim is still unnamed" — flagged in Ch3, Ch4, Ch5, Ch7, Ch8, Ch9.
All three stories from May 14 refer only to "the victim" or "the deceased" throughout.

**Root cause:** The locked-fact registry currently enforces `clock_reading` and `tamper_amount`.
The victim's name is not treated as a locked fact requiring presence verification in prose.

**Fix:** Add `victim_name` to the locked-fact registry and require it to appear in Chapter 1.
In `enforceLockedFactValuePresence()`, add a check that the victim's proper name (not just
"the victim") appears at least once in Ch1.

### V-B: Character Titles Formatted as "the doctor Finch" / "the captain Hale"

**Evidence:** Present in all three stories, every chapter. Example: `"the doctor Finch entered
the study, his expression a mix of concern"` (story_20260514-1944, Ch1).

**Root cause:** The LLM is producing lowercase article + role noun + surname rather than the
canonical `Dr. Finch` / `Captain Hale`. This likely occurs because character names in the cast
bundle are listed as `"Dr. Mallory Finch"` but in mid-paragraph the model defaults to
compositional form.

**Fix — Refactor #5: Title Normalization Post-Processor (immediate, 5 lines)**

Add to `pronoun-repair.ts` or as a new step in the pre-validation pipeline:

```typescript
const TITLE_NORMALIZATIONS: [RegExp, string][] = [
  [/\bthe doctor\s+(\w+)/gi, 'Dr. $1'],
  [/\bthe captain\s+(\w+)/gi, 'Captain $1'],
  [/\bthe colonel\s+(\w+)/gi, 'Colonel $1'],
  [/\bthe professor\s+(\w+)/gi, 'Professor $1'],
  [/\bthe inspector\s+(\w+)/gi, 'Inspector $1'],
  [/\bthe major\s+(\w+)/gi, 'Major $1'],
];

export function normalizeTitles(text: string): string {
  let result = text;
  for (const [pattern, replacement] of TITLE_NORMALIZATIONS) {
    result = result.replace(pattern, replacement);
  }
  return result;
}
```

Apply in `applyDeterministicPronounSweep()` before returning the repaired text. This is fully
deterministic and safe — there is no context in a Golden Age mystery where "the doctor Finch"
is grammatically correct and "Dr. Finch" is not.

### V-C: Alibis Asserted, Not Dramatized

**ChatGPT (Ch8):** "Dr. Finch and Beatrice are cleared too quickly. Dr. Finch's alibi is
confirmed by 'multiple witnesses,' but those witnesses are not shown. Beatrice is cleared
because she had 'no access to the clock,' but the story does not prove that."

**Root cause:** The outline for alibi chapters instructs "confirm Dr. Finch's alibi" but the
prose generation system has no constraint that alibi confirmation must be achieved through
dramatized evidence discovery. The model satisfies the instruction by having Eleanor declare
it as fact.

**Fix:** In the chapter instruction for alibi chapters, add a scene-objective constraint:

```
ALIBI DRAMATIZATION REQUIREMENT: This chapter must show Eleanor FINDING the corroborating
evidence, not DECLARING it. Required elements:
  1. A named piece of evidence (document, witness, object) that Eleanor locates
  2. Eleanor's reasoning about why it confirms the alibi
  3. A residual doubt or complication that keeps the chapter from resolving too cleanly
```

This is a prose prompt directive, not a code change. The validation could be added as a
`alibi_assertion_check` linter pattern that detects phrases like "confirms your alibi" /
"eliminates you as a suspect" appearing without any preceding evidence-discovery sentence.

### V-D: The Culprit's Motive Arrives Too Late

**ChatGPT (Ch9):** "Hale's financial misdeeds are introduced too late to feel like a
fair-play motive. The victim's plan to expose Hale appears at the reveal stage rather than
being foreshadowed."

**Root cause:** The fair-play gate (Agent 6) checks clue placement but apparently doesn't check
that the **motive** appears before the penultimate chapter. The motive (gambling debts,
blackmail, financial ruin) is being seeded at revelation time, violating the Golden Age rule
that every element of the solution must be available to the reader in advance.

**Fix:** Extend the `FairPlayAuditor` (Agent 6) to verify that at least one **motive clue**
for the culprit appears in the first 60% of the story. The clue schema should include a
`type: 'motive'` field and the auditor should gate on its placement chapter.

### V-E: No Arrest, No Formal Resolution

**ChatGPT (Ch9):** "There is no arrest, formal accusation, or resolution for the household.
The final paragraph says Eleanor is ready for 'the confrontation that awaited them,' even
though the confrontation has just happened. The ending does not feel final."

**Root cause:** The final chapter instruction does not specify a mandatory resolution beat.
The `SuspectClosureValidator` checks that the culprit is named and their evidence chain is
present, but it doesn't check for a **denouement**: arrest/police/consequence + aftermath.

**Fix:** Add a `resolution_present` check to `SuspectClosureValidator`:

```typescript
const RESOLUTION_PATTERNS = [
  /police|constable|arrest|inspector|magistrate/i,
  /taken into custody|face justice|answer for|consequences/i,
  /the household|the others|those assembled/i,
];
// Require at least one RESOLUTION_PATTERN match in the final chapter
// within 3 paragraphs after the confession/culprit-named moment.
```

---

## Summary: Priority Fix Queue

| Priority | Fix | File(s) | Effort |
|---|---|---|---|
| P0 | **Title normalization** (`the doctor Finch` → `Dr. Finch`) | `pronoun-repair.ts` | 10 min |
| P0 | **Template-bleed linter check** (detect raw location/weather text in prose) | `agent9-prose.ts` | 30 min |
| P0 | **Debug-note bleed linter check** ("The detail is explicit:" etc.) | `agent9-prose.ts` | 15 min |
| P1 | **Scene-context prompt fencing** (`<scene_context>` wrapper) | `agent9-prose.ts` | 1 hr |
| P1 | **Pronoun hard-lock block** in prose generation prompt | `agent9-prose.ts` | 30 min |
| P1 | **Victim name locked fact** — require in Ch1 | `agent9-prose.ts`, locked-fact registry | 30 min |
| P2 | **Chapter uniqueness contract** — list established facts, unique-job directive | `agent9-prose.ts` | 1 hr |
| P2 | **Outline beat-uniqueness validator** in Agent 7 | `agent7-narrative.ts` | 2 hr |
| P2 | **Alibi dramatization requirement** in chapter instructions for alibi chapters | `agent9-prose.ts` | 1 hr |
| P3 | **Motive clue placement check** in FairPlayAuditor | `agent6-fairplay.ts` | 2 hr |
| P3 | **Resolution check** in SuspectClosureValidator | `story-validation/` | 1 hr |
| P3 | **Sentence-level pronoun subject tracking** | `pronoun-repair.ts` | 3 hr |

---

## Additional Observations (Lower Severity)

**Scene/room mismatch:** Chapter headers assign a location (e.g., "Master Suite") that does not
match the scene's actual location (always the study). The outline formatter should either (a)
assign logically consistent locations or (b) the prose prompt should override the location with
whichever room the scene logically requires.

**Dialogue register homogeneity:** All four characters speak in identical cadence and vocabulary.
The character bundle should include a 2–3 sentence "voice signature" per character that is
referenced in the prose prompt. Example: "Captain Hale: clipped, imperative sentences; avoids
qualifiers; uses military vocabulary under stress."

**"Tense and brooding" mood label:** The raw mood label `"tense and brooding, with an underlying
sense of unease among the guests"` appears verbatim in at least 6 chapters across the three
stories (e.g., story_20260514-1917 Ch1, Ch3, Ch5, Ch6; story_20260514-1944 Ch3, Ch7, Ch8, Ch9).
This is a direct template-bleed instance that the P0 linter check will catch, but the fix should
also ensure the outline formatter uses varied mood descriptions.

**Generic tension language:** ChatGPT flags identical phrasing recurring chapter-to-chapter:
"the tension was palpable", "shadows of doubt creeping closer", "each breath a reminder",
"burden of anticipation", "walls closing in". These are not caught by the n-gram linter
(too short for 6-gram Jaccard) but degrade perceived quality significantly. A separate
"cliché phrase" linter with a curated blocklist would address this, though it is P4 effort.
