# PROMPT_09: Full LLM Prompts — run_35e536ce, 2026-03-17T19:13

Story: The Timeless Deception | Chapters 1–3 | Agent9-ProseGenerator  
Run ID: `run_35e536ce-718a-4297-97f7-dbf5ddd22910`

---

## Run Metadata

| Field | Value |
|-------|-------|
| Run ID | `run_35e536ce-718a-4297-97f7-dbf5ddd22910` |
| Project ID | `proj_c6c75f54-8591-47f8-8d5e-dfd3c0fdab72` |
| Date | 2026-03-17 |
| Time window | 19:13:33 – 19:15:12 |
| Story title | The Timeless Deception |
| Setting | Little Middleton (Ackroyd Manor), 1940s (January) |
| Crime | murder (suspicious death) |
| Culprit | Frederick Ackroyd |
| Victim | Joan Kershaw |
| Detective | Gertrude Ramsden (amateur investigator) |
| Prose model | GPT-4o-mini (Agent9) |
| Total logged calls | 10 (Ch1 ×2, Ch2 ×3 + 1 UnderflowExpansion, Ch3 ×4 retries) |

**Cast / Character Map (canonical, immutable):**

| Character | Gender | Pronouns | Role |
|-----------|--------|----------|------|
| Gertrude Ramsden | female | she/her/her | detective (Amateur Investigator) |
| Joan Kershaw | female | she/her/her | victim |
| Simon Greenwood | male | he/him/his | suspect |
| Jeremiah Marsden | male | he/him/his | suspect |
| Frederick Ackroyd | male | he/him/his | culprit |

**Locked Facts (canonical, use verbatim):**
- The exact time shown on the stopped clock face: `"ten minutes past eleven"`
- The exact amount the clock was wound back: `"forty minutes"`

**False assumption:** "The murder occurred at the time indicated by the clock."

**Moral complexity:** "The murderer tampered with the clock not out of malice but to cover up a crime of passion, leading to a complex emotional dilemma."

**Discriminating test:** Act 3, Scene 4 — Execute the discriminating test, observe culprit's reaction or result, draw conclusion about guilt.

**Suspect clearance (Act 3, Scene 5):**
- Gertrude Ramsden: past connection with victim shows no motive (Gertrude's personal involvement in family issues)
- Joan Kershaw: Joan is the victim and cannot be implicated
- Simon Greenwood: financial ties do not indicate motive for murder (no history of violence)
- Jeremiah Marsden: loyal service to the family confirmed (long history with the family)

**Culprit revelation (Act 3, Scene 6):** Confrontation with evidence.

---

## Chapter Attempt Summary

| Chapter | Title | ProseGenerator attempts | Special agents | Outcome |
|---------|-------|------------------------|----------------|---------|
| Ch1 | Discovery | 2 | — | Clean (resolved at attempt 2) |
| Ch2 | Setting the Scene | 3 | UnderflowExpansion ×1 | Clean (via expansion after attempt 3) |
| Ch3 | The Clock's Time | 4 | — | **FAILED all 4 attempts** |

**Ch1 failure reasons (attempt 1):**
- `clue_4` ("The presence of oil suggests recent tampering with the clock.") present in chapter but placed too late — not in first 25%
- Word count below preferred target: 793/1300

**Ch2 failure reasons (attempts 1–3):**
- Attempt 1: `clue_1` present but placed too late; word count 724/1300
- Attempt 2: `clue_1` still present but too late; word count below hard floor: 646/704
- Attempt 3: `clue_1` still too late; word count 687 — hard floor violation; escalated to UnderflowExpansion agent

**Ch3 failure reasons (all 4 attempts):**
- `clue_clock_time` absent in all 4 attempts — this is an **abstract clue ID with no human-readable description**, so the model has no way to produce prose for it
- Word counts climbed across retries but never reached preferred target: ~772 (att.1), 772 (att.2), 817 (att.3), 904 (att.4)
- Run exhausted all retry attempts; Ch3 generation failed hard

> ⚠️ **Root cause note:** `clue_clock_time` is an opaque technical ID that does not appear in the model's context as natural language prose guidance. Unlike `clue_1` and `clue_2` which have descriptions and "points to" text, `clue_clock_time` has no description field. The obligation block renders it as `• clue_clock_time — include as concrete observable evidence on-page.` — giving the model no actionable content to write. This is a data/schema bug in the clue specification for this chapter.

---

## CHAPTER 1, ATTEMPT 1 — 2026-03-17T19:13:33Z

**Model:** GPT-4o-mini | **Agent:** `Agent9-ProseGenerator-Ch1`  
**Messages:** 3 (system + user[outline] + user[pre-checklist])  
**Prompt hash:** `efc1723c4f3c06d2` | **Retry attempt:** 0  
**Result:** FAILED — `clue_4` placed too late; word count 793/1300

### Message 1 — system

```
You are an expert prose writer for classic mystery fiction. Your role is to write compelling, atmospheric narrative chapters that read like a professionally published novel.

⛔ ABSOLUTE RULE — CHARACTER NAMES:
The ONLY characters who exist in this story are: Gertrude Ramsden, Joan Kershaw, Simon Greenwood, Jeremiah Marsden, Frederick Ackroyd.
Do NOT invent, borrow, or introduce ANY character not on that list — no constables, no solicitors, no butlers, no servants, no shopkeepers, no bystanders with names.
Unnamed walk-ons ("a footman", "the postmistress", "an officer") are allowed ONLY if they never receive a name or title+surname combination.
⚠️ BEFORE YOU WRITE each chapter, ask yourself: "Does every person I name appear in this list: Gertrude Ramsden, Joan Kershaw, Simon Greenwood, Jeremiah Marsden, Frederick Ackroyd?" If not, remove them.
Any invented named character will fail validation and abort the entire generation.

Rules:
- Do not introduce new facts beyond the CML and outline.
- Preserve all clues, alibis, and the core mystery logic.
- Maintain strict setting fidelity to the specified location and era.
- Write immersive, sensory-rich prose that transports readers to the setting
- Include scene-setting passages that establish atmosphere, time, and place
- Use varied sentence structure and sophisticated vocabulary
- Show character emotions through actions and dialogue, not just telling
- Create distinct character voices and personalities based on their profiles
- Avoid stereotypes and reduce bias.
- Keep language original; do not copy copyrighted text.
- Output valid JSON only.
- DISAPPEARANCE-TO-MURDER BRIDGE: If the story opens with a disappearance, include an explicit bridge to confirmed murder.
- ANTI-REPETITION: Do not repeat atmospheric or descriptive phrases across adjacent chapters.
- TEMPLATE LEAKAGE BAN: Never emit scaffold prose like "At The [Location] ... the smell of ... atmosphere ripe for revelation".
- TEMPORAL CONSISTENCY: If a month is mentioned, season wording in the same timeline must be compatible.
- DENOUEMENT REQUIREMENT: Final chapter must show concrete consequences — culprit fate, relationship changes, detective resolution.
- MORAL COMPLEXITY REQUIREMENT: "The murderer tampered with the clock not out of malice but to cover up a crime of passion, leading to a complex emotional dilemma." — acknowledge this in the denouement.

⚠️ AMATEUR DETECTIVE STORY: The investigator is a civilian with no official standing. Police are unnamed background figures only ("a constable", "the sergeant", "an officer from the village"). No Inspector [Surname], no Constable [Surname].

CRITICAL CHARACTER CONSISTENCY RULES:
1. Use ONLY names from this list. Never vary, abbreviate, or add titles beyond what is listed.
   COMPLETE CAST: Gertrude Ramsden, Joan Kershaw, Simon Greenwood, Jeremiah Marsden, Frederick Ackroyd
2. Gender pronouns:
   - Gertrude Ramsden: she/her/her
   - Joan Kershaw: she/her/her
   - Simon Greenwood: he/him/his
   - Jeremiah Marsden: he/him/his
   - Frederick Ackroyd: he/him/his

CHARACTER PERSONALITIES, VOICES & HUMOUR:

Gertrude Ramsden:
  Public: Respected and nurturing figure in the local community, known for her kindness and wisdom.
  Hidden: Struggles with depression after the loss of her husband in the war, feeling isolated and forgotten.
  Stakes: Potentially uncovering hidden truths that could implicate those she cares about.
  Humour: dry wit (level 0.5). Sharp observations about human behaviour. Concise, often one-liners.
  Voice & Mannerisms: Gentle cadence, often pausing thoughtfully. Penchant for proverbs.
  Internal Conflict: Weight of husband's absence; investigation offers chance to reclaim voice and purpose.

Joan Kershaw:
  Public: Independent and ambitious; admired for journalistic integrity.
  Hidden: Involved in an affair with the victim, which could destroy her career if revealed.
  Humour: sardonic (level 0.6). Darker edge. Mocking tone revealing cynicism.
  Voice & Mannerisms: Brisk, confident tone; uses irony to mask vulnerability.

Simon Greenwood:
  Public: Diligent and loyal to the estate; meticulous nature and dedication.
  Hidden: Has been embezzling funds from the estate to support his lavish lifestyle.
  Humour: None — plays it straight. Seriousness provides contrast for wittier characters.
  Voice & Mannerisms: Speaks with precision, rarely indulges in humour.

Jeremiah Marsden:
  Public: Charismatic and influential; known for community initiatives and charm.
  Hidden: Engaged in illegal political dealings; feels threatened by victim's knowledge of his corruption.
  Humour: observational (level 0.4). Notices absurdity in situations. Wry comments.
  Voice & Mannerisms: Charismatic [truncated for prompt budget]

Frederick Ackroyd:
  [truncated for prompt budget]

PHYSICAL PLAUSIBILITY REQUIREMENTS:
- Interior viable evidence: fingerprints, torn fabric, overturned furniture, blood spatter, documents
- IMPLAUSIBLE (DO NOT USE): footprints on wooden deck; footprints in rain/storm; metal embedded in hardwood; light objects in storm
- Struggle evidence: overturned furniture, torn clothing, scattered items, defensive wounds ✓

ERA AUTHENTICITY (1940s):
- FORBIDDEN: Modern technology
- REQUIRED (2+ per scene): Formal address (Mr./Mrs./Miss/Dr./Sir/Lady), period technology, period fashion
- Use period-authentic language and social norms

NON-NEGOTIABLE CHAPTER OBLIGATIONS — LOCKED EVIDENCE PHRASES:
  - The exact time shown on the stopped clock face: "ten minutes past eleven"
  - The exact amount the clock was wound back: "forty minutes"
If a locked fact is not relevant to this chapter, skip it. But if you do mention it, use exactly the phrase above.

⛔ CLUES TO SURFACE IN THESE CHAPTERS — mandatory:
• [clue_4] The presence of oil suggests recent tampering with the clock.
  Category: temporal | Criticality: essential | Supports inference step 2
  Points to: Indicates the clock may have been manipulated.

For each clue above: an attentive reader should be able to find, record, and later use it to reason toward the solution.

═══ NARRATIVE STATE (read-only — do not contradict) ═══
LOCKED FACTS:
  • The exact time shown on the stopped clock face: "ten minutes past eleven"
  • The exact amount the clock was wound back: "forty minutes"

CHARACTER PRONOUNS — never deviate from these:
  • Gertrude Ramsden: she/her/her
  • Joan Kershaw: she/her/her
  • Simon Greenwood: he/him/his
  • Jeremiah Marsden: he/him/his
  • Frederick Ackroyd: he/him/his
═══════════════════════════════════════════════════════

SCENE GROUNDING CHECKLIST (MUST FOLLOW):
Known location profile anchors: Eversham Manor, The Library, The Dining Room
- Chapter 1: anchor opening in "the library of Ackroyd Manor"; include 2+ sensory cues and 1+ atmosphere marker before major dialogue.

PROMPT BUDGET SUMMARY: budget=6200 tokens; fixed=3476; context=1946; dropped=[humour_guide, craft_guide, location_profiles, temporal_context]; truncated=[character_personality, location_profiles, temporal_context]

# Prose Output Schema
Return JSON with this structure:
{
  "status": "draft",
  "tone": "classic|modern|atmospheric",
  "chapters": [{"title": "...", "summary": "...", "paragraphs": ["Paragraph 1", "Paragraph 2", "Paragraph 3"]}],
  "cast": ["Name 1", "Name 2"],
  "note": "",
  "audit": {
    "locked_fact_phrases": "present in paragraph N | absent",
    "season_words_used": "list seasonal words used | none",
    "discriminating_test_present": "yes: chapter N paragraph M | no",
    "required_clues_present": "clue_id: chapter N paragraph M | absent"
  }
}
The audit field is a self-check only. It will be stripped before storage.

Requirements:
- Write exactly one chapter per outline scene (1 total).
- Chapter numbering starts at 1.
- HARD FLOOR 704 words; PREFERRED TARGET 1300+ words.
- Classic tone.
- Reflect the outline summary. Keep all logic consistent with CML.

NOVEL-QUALITY PROSE REQUIREMENTS:
1. SCENE-SETTING: Establish time of day, weather, lighting; use sensory details (sight, sound, smell, touch).
2. SHOW, DON'T TELL: Body language reveals emotion; actions reveal character.
3. VARIED SENTENCE STRUCTURE: Mix short punchy sentences with longer flowing ones.
4. DIALOGUE THAT REVEALS CHARACTER: Distinct speech patterns; subtext; action beats over dialogue tags.
5. SENSORY IMMERSION: 2–3 senses minimum per scene.
6. PARAGRAPH STRUCTURE: Opening hook; middle development; closing revelation or transition.
7. PACING VARIATION: Short paragraphs for action, longer for atmosphere, moderate for investigation.
8. EMOTIONAL SUBTEXT & TENSION: Hidden secrets/stakes; suspicion, unease, watchfulness.

QUALITY GUARDRAILS (MUST SATISFY):
1. FAIR PLAY CLUE TIMING: Clue in chapter N → detective may only act on it in N+1 or later.
2. FAIR PLAY INFORMATION PARITY: All clues visible to reader before detective uses them.
3. FAIR PLAY REVELATION SPACING: Discriminating test uses only clues from N-1 or earlier.
4. FAIR PLAY CONFRONTATION: Final confrontation cites only previously visible evidence.
5. Use only canonical cast names from CML. No invented titled placeholders.
6. Suspect-elimination coverage before final reveal closes.
7. Culprit evidence chain with explicit reasoning connectors (because/therefore/proves).

CRITICAL PROSE REQUIREMENTS:
**Discriminating Test Scene (Act 3, Scene 4):** Execute test, Observe reaction, Draw conclusion about guilt | Outcome: N/A
**Suspect Clearance Scenes (Act 3, Scene 5):**
- Gertrude Ramsden: past connection with victim shows no motive
- Joan Kershaw: Joan is the victim and cannot be implicated
- Simon Greenwood: financial ties do not indicate motive for murder
- Jeremiah Marsden: loyal service to the family confirmed
**Culprit Revelation (Act 3, Scene 6):** Confrontation with evidence.
VALIDATION CONSEQUENCE: Failure costs $5–8 to regenerate. Follow these specifications precisely.

WORD COUNT CONTRACT (NON-NEGOTIABLE):
- Preferred generation target: 1500 words per chapter.
- Hard floor: 704 words per chapter.
- Overshoot rather than undershoot.
- Expand with concrete action beats, clue-linked dialogue, and sensory detail.
- Never pad with recap, repeated atmosphere, or generic filler.
```

### Message 2 — user (outline)

```
Write the full prose following the outline scenes.

CHAPTER OBLIGATION CONTRACT (MUST SATISFY):
- Chapter 1:
  - Location anchor: the library of Ackroyd Manor.
  - CLUE OBLIGATIONS — mandatory prose elements (do NOT omit or bury):
    • The presence of oil suggests recent tampering with the clock. [clue_4] ⚠ EARLY PLACEMENT — write this in the first 25% of the chapter
      Points to: Indicates the clock may have been manipulated.
      ↳ In the immediately following paragraph, include an explicit inference or suspicion that relates to what was just observed.
- Locked fact phrase obligations:
  - If this batch mentions The exact time shown on the stopped clock face, write exactly: "ten minutes past eleven".
  - If this batch mentions The exact amount the clock was wound back, write exactly: "forty minutes".
- Seasonal vocabulary allow-list: winter, wintry, midwinter.
- Forbidden seasonal words: spring, summer, autumn.

FROZEN TIMELINE STATE (DO NOT ALTER):
- Timeline anchor: January (winter).
- Established timeline fact: 10:15 PM (time on the clock)
- Established timeline fact: 10:00 PM (last seen)
- If referenced, use exact time phrase: "ten minutes past eleven" (The exact time shown on the stopped clock face).
- If referenced, use exact time phrase: "forty minutes" (The exact amount the clock was wound back).

# Case Overview
Title: The Timeless Deception | Era: 1940s | Setting: Little Middleton
Crime: murder (suspicious death) | Culprit: Frederick Ackroyd
False assumption: The murder occurred at the time indicated by the clock.
Cast: Gertrude Ramsden, Joan Kershaw, Simon Greenwood, Jeremiah Marsden, Frederick Ackroyd
Setting Lock: Keep all scenes and descriptions consistent with Little Middleton.

Outline scenes:
[
  {
    "sceneNumber": 1,
    "act": 1,
    "title": "Discovery",
    "setting": {
      "location": "the library of Ackroyd Manor",
      "timeOfDay": "Morning after the murder",
      "atmosphere": "Tense household awaiting the detective's arrival"
    },
    "characters": ["Gertrude Ramsden", "Frederick Ackroyd", "Simon Greenwood", "Joan Kershaw", "Jeremiah Marsden"],
    "purpose": "Introduce the crime and the initial suspects",
    "cluesRevealed": ["clue_4"],
    "dramaticElements": {
      "conflict": "Tension arises as the household grapples with the shock of the murder.",
      "tension": "All eyes are on Frederick, who seems particularly anxious.",
      "microMomentBeats": ["Gertrude observes the clock, feeling a chill at the sight of the stopped hands."]
    },
    "summary": "The morning after the murder, the household gathers in the library, where the victim was discovered. Tension fills the air as everyone awaits the arrival of the detective, Gertrude Ramsden, who has been invited due to her keen observational skills.",
    "estimatedWordCount": 800
  }
]
```

### Message 3 — user (pre-checklist)

```
BEFORE SUBMITTING YOUR JSON — verify this checklist:
□ Each chapter reaches the hard floor of 704 words and aims for 1500 words or more.
□ If you mention locked evidence, you used the exact locked phrase verbatim.
□ Allowed seasonal words only: winter, wintry, midwinter.
□ Forbidden seasonal words: spring, summer, autumn.
□ Chapter 1: "The presence of oil suggests recent tampering with the clock." is placed in the first 25% of the chapter, followed by an explicit inference or suspicion paragraph.
□ Return valid JSON only.
```

---

## CHAPTER 1, ATTEMPT 2 — 2026-03-17T19:13:43Z

**Model:** GPT-4o-mini | **Agent:** `Agent9-ProseGenerator-Ch1`  
**Messages:** 4 (system + user[outline] + user[pre-checklist] + user[retry-2])  
**Prompt hash:** `6862322b8b485529` | **Retry attempt:** 0  
**Result:** CLEAN

*(Messages 1–3 identical to Attempt 1. Message 4 added:)*

### Message 4 — user (retry injection, attempt 2)

```
Attempt 2/4 — chapters 1 — 2 validation issue(s) to resolve:

═══ PROSE QUALITY ERRORS (2) ═══
• Chapter 1: clue evidence "The presence of oil suggests recent tampering with the clock." is present but must appear in the first quarter of the chapter — move the observation beat to before the 25% mark.
• Chapter 1: word count below preferred target (793/1300)

✓ SOLUTION: Vary paragraph lengths (short, medium, long)
✓ Include sensory details and atmospheric description
✓ Ensure each chapter has substance (3+ paragraphs minimum)

═══ RETRY MICRO-PROMPTS (2) ═══
• REPAIR [clue_visibility — attempt 2]: chapters 1 are missing: The presence of oil suggests recent tampering with the clock..
  Near the beginning of the chapter:
  • Paragraph 1: A character directly observes or discovers the missing evidence. Be specific and sensory — describe what is seen, touched, or heard. Include any exact required phrase verbatim.
  • Paragraph 2 (immediately following): The detective or POV character explicitly reasons about what this evidence means — who it implicates, what is suspicious, or what inference it supports.
  Keep these as two clearly separate paragraphs. Do not bury the evidence in atmosphere or background dialogue.
• MICRO-PROMPT [word_count]: Raise chapter length to at least 1300 words (currently 793). Expand with concrete action beats, sensory setting detail, and inference-relevant dialogue; avoid filler recap.

Regenerate chapters 1 with the above corrections applied.
```

---

## CHAPTER 2, ATTEMPT 1 — 2026-03-17T19:13:55Z

**Model:** GPT-4o-mini | **Agent:** `Agent9-ProseGenerator-Ch2`  
**Messages:** 3 (system + user[outline] + user[pre-checklist])  
**Prompt hash:** `e58a841af7b82d39` | **Retry attempt:** 0  
**Result:** FAILED — `clue_1` placed too late; word count 724/1300

### Message 1 — system

*(Same base system prompt as Ch1, with the following changes:)*

```
[All Ch1 base rules apply — character names, pronouns, era authenticity, physical plausibility, locked evidence phrases, moral complexity requirement, amateur detective rule, word count contract, validation consequence warning]

CLUES TO SURFACE IN THESE CHAPTERS — mandatory:
• [clue_1] The clock in the library shows 10:15 PM.
  Category: temporal | Criticality: essential | Supports inference step 1
  Points to: The time indicated by the clock at the scene of the crime.

NARRATIVE STATE additions:
DO NOT OPEN THIS CHAPTER WITH: general-descriptive (already used in prior chapters)
DO NOT REUSE THESE SENSORY PHRASES (already used): heavy drapes; chill lingered; faint traces; chill creep; heavy fog

CONTINUITY CONTEXT — CHARACTER & SETTING CONSISTENCY:
Character Names Used in Chapters 1–1: Gertrude Ramsden, Joan Kershaw, Simon Greenwood, Jeremiah Marsden, Frederick Ackroyd
Setting Vocabulary Established: library, manor, flat, estate
Recent Chapter Summary:
  Chapter 1: Discovery — The wintry morning light filtered through the heavy drapes of the library in Ackroyd Manor, casting long shadows across the polished mahogany floor.

SCENE GROUNDING CHECKLIST:
- Chapter 2: anchor opening in "Ackroyd Manor's dining room"; include 2+ sensory cues and 1+ atmosphere marker before major dialogue.

PROVISIONAL CHAPTER SCORE FEEDBACK (APPLY TO NEXT CHAPTERS):
- From Chapter 1: score 85/100
  Deficits: word density below preferred target (815/1300); scene grounding weakness
  Required corrections: Increase chapter density with concrete investigation action and sensory-grounded beats. Open next chapter with a named location anchor plus at least two sensory cues and one atmosphere marker.

PROMPT BUDGET SUMMARY: budget=6200 tokens; fixed=3448; context=2477; dropped=[humour_guide, craft_guide, location_profiles, temporal_context]; truncated=[character_personality, location_profiles, temporal_context]
```

### Message 2 — user (outline)

```
Write the full prose following the outline scenes.

CHAPTER OBLIGATION CONTRACT (MUST SATISFY):
- Chapter 2:
  - Location anchor: Ackroyd Manor's dining room.
  - CLUE OBLIGATIONS — mandatory prose elements (do NOT omit or bury):
    • The clock in the library shows 10:15 PM. [clue_1] ⚠ EARLY PLACEMENT — write this in the first 25% of the chapter
      Points to: The time indicated by the clock at the scene of the crime.
      ↳ In the immediately following paragraph, include an explicit inference or suspicion that relates to what was just observed.
- Locked fact phrase obligations:
  - If this batch mentions The exact time shown on the stopped clock face, write exactly: "ten minutes past eleven".
  - If this batch mentions The exact amount the clock was wound back, write exactly: "forty minutes".
- Seasonal vocabulary allow-list: winter, wintry, midwinter.
- Forbidden seasonal words: spring, summer, autumn.

FROZEN TIMELINE STATE (DO NOT ALTER):
- Timeline anchor: January (winter).
- Established timeline fact: 10:15 PM (time on the clock)
- Established timeline fact: 10:00 PM (last seen)

# Case Overview
[same as Ch1]

Outline scenes:
[
  {
    "sceneNumber": 2,
    "act": 1,
    "title": "Setting the Scene",
    "setting": {
      "location": "Ackroyd Manor's dining room",
      "timeOfDay": "Late morning",
      "atmosphere": "Somber and reflective"
    },
    "characters": ["Gertrude Ramsden", "Frederick Ackroyd", "Simon Greenwood", "Joan Kershaw", "Jeremiah Marsden"],
    "purpose": "Establish the atmosphere and introduce the suspects more deeply",
    "cluesRevealed": ["clue_1"],
    "dramaticElements": {
      "conflict": "Frederick's nervousness contrasts with the others' calm.",
      "tension": "Joan's quiet demeanor raises suspicion.",
      "microMomentBeats": ["Frederick fidgets with his cufflinks, an unconscious sign of his unease."]
    },
    "summary": "As the group gathers for a somber breakfast, the atmosphere is thick with unspoken fears. Gertrude takes note of the interactions, particularly the nervousness of Frederick and the calmness of Joan.",
    "estimatedWordCount": 800
  }
]
```

### Message 3 — user (pre-checklist)

```
BEFORE SUBMITTING YOUR JSON — verify this checklist:
□ Each chapter reaches the hard floor of 704 words and aims for 1500 words or more.
□ If you mention locked evidence, you used the exact locked phrase verbatim.
□ Allowed seasonal words only: winter, wintry, midwinter.
□ Forbidden seasonal words: spring, summer, autumn.
□ Chapter 2: "The clock in the library shows 10:15 PM." is placed in the first 25% of the chapter, followed by an explicit inference or suspicion paragraph.
□ Return valid JSON only.
```

---

## CHAPTER 2, ATTEMPT 2 — 2026-03-17T19:14:06Z

**Model:** GPT-4o-mini | **Agent:** `Agent9-ProseGenerator-Ch2`  
**Messages:** 4 (system + user[outline] + user[pre-checklist] + user[retry-2])  
**Prompt hash:** `41229759599d125a` | **Retry attempt:** 0  
**Result:** FAILED — `clue_1` still too late; word count 724/1300

*(Messages 1–3 identical to Attempt 1. Message 4 added:)*

### Message 4 — user (retry injection, attempt 2)

```
Attempt 2/4 — chapters 2 — 2 validation issue(s) to resolve:

═══ PROSE QUALITY ERRORS (2) ═══
• Chapter 2: clue evidence "The clock in the library shows 10:15 PM." is present but must appear in the first quarter of the chapter — move the observation beat to before the 25% mark.
• Chapter 2: word count below preferred target (724/1300)

✓ SOLUTION: Vary paragraph lengths (short, medium, long)
✓ Include sensory details and atmospheric description
✓ Ensure each chapter has substance (3+ paragraphs minimum)

═══ RETRY MICRO-PROMPTS (2) ═══
• REPAIR [clue_visibility — attempt 2]: chapters 2 are missing: The clock in the library shows 10:15 PM..
  Near the beginning of the chapter:
  • Paragraph 1: A character directly observes or discovers the missing evidence. Be specific and sensory — describe what is seen, touched, or heard. Include any exact required phrase verbatim.
  • Paragraph 2 (immediately following): The detective or POV character explicitly reasons about what this evidence means — who it implicates, what is suspicious, or what inference it supports.
  Keep these as two clearly separate paragraphs. Do not bury the evidence in atmosphere or background dialogue.
• MICRO-PROMPT [word_count]: Raise chapter length to at least 1300 words (currently 724). Expand with concrete action beats, sensory setting detail, and inference-relevant dialogue; avoid filler recap.

Regenerate chapters 2 with the above corrections applied.
```

---

## CHAPTER 2, ATTEMPT 3 — 2026-03-17T19:14:14Z

**Model:** GPT-4o-mini | **Agent:** `Agent9-ProseGenerator-Ch2`  
**Messages:** 5 (system + user[outline] + user[pre-checklist] + user[retry-2] + user[retry-3])  
**Prompt hash:** `ef5179f7dd535d58` | **Retry attempt:** 0  
**Result:** FAILED — word count 646/704 (below hard floor); escalated to UnderflowExpansion

*(Messages 1–4 identical to Attempt 2. Message 5 added:)*

### Message 5 — user (retry injection, attempt 3)

```
Attempt 3/4 — chapters 2 — 2 validation issue(s) to resolve:

═══ PROSE QUALITY ERRORS (2) ═══
• Chapter 2: word count below hard floor (646/704)
• Chapter 2: clue evidence "The clock in the library shows 10:15 PM." is present but must appear in the first quarter of the chapter — move the observation beat to before the 25% mark.

✓ SOLUTION: Vary paragraph lengths (short, medium, long)
✓ Include sensory details and atmospheric description
✓ Ensure each chapter has substance (3+ paragraphs minimum)

═══ RETRY MICRO-PROMPTS (2) ═══
• REPAIR [clue_visibility — attempt 3 — PARAGRAPH STRUCTURE REQUIRED]: The clock in the library shows 10:15 PM. still missing.
  You MUST include a two-paragraph sequence in the first quarter of the chapter:
  Paragraph A: The character physically approaches, examines, or directly perceives the evidence. Write this as a present-action beat, not a recalled memory. Include the exact required phrase if one is specified.
  Paragraph B: In the very next paragraph, the character explicitly says or thinks that this evidence may be misleading, was tampered with, or points to a specific person. Use first-person inference language ("She realised...", "He could not help but wonder..."). This must be a full separate paragraph, not a tacked-on sentence.
  The chapter must be at least 1450 words. Use action, inference dialogue, and sensory grounding to expand — not recap.
• MICRO-PROMPT [word_count]: Raise chapter length to at least 704 words (currently 646). Expand with concrete action beats, sensory setting detail, and inference-relevant dialogue; avoid filler recap.

Regenerate chapters 2 with the above corrections applied.
```

---

## CHAPTER 2 — UNDERFLOW EXPANSION — 2026-03-17T19:14:25Z

**Model:** GPT-4o-mini | **Agent:** `Agent9-UnderflowExpansion-Ch2`  
**Messages:** 2 (system + user[expansion-request])  
**Prompt hash:** `f00b486f35b6fbb4` | **Retry attempt:** 0  
**Temperature:** 0.18 | **maxTokens:** 3000  
**Result:** CLEAN (expanded to ≥704 words; clue_1 preserved)

### Message 1 — system

```
You are a surgical prose revision assistant for mystery fiction. Expand the chapter without changing clue logic, chronology, or character identity. Do not remove evidence already present. Do not add new named characters. Output JSON only.
```

### Message 2 — user (expansion request)

```
Chapter 2 is below hard floor (687/704).

Expand by roughly 297 words so the chapter reaches at least 704 words and preferably 1500 words. Overshoot rather than undershoot.

Do not stop at the first threshold crossing. Continue until the chapter feels fully developed and complete.

Never pad with recap or repeated atmosphere. Add concrete action beats, clue-bearing dialogue, and sensory scene detail instead.

Preserve and clearly surface required clue obligations: clue_1.

Scene summary: As the group gathers for a somber breakfast, the atmosphere is thick with unspoken fears. Gertrude takes note of the interactions, particularly the nervousness of Frederick and the calmness of Joan.

Scene purpose: Establish the atmosphere and introduce the suspects more deeply

Return this schema:
{"chapter":{"title":"...","summary":"...","paragraphs":["...","..."]}}

Only return the JSON payload.

Current chapter text:

The late morning light filtered through the tall windows of Ackroyd Manor's dining room, illuminating the polished oak table set for breakfast. The room, adorned with rich tapestries and heavy drapes, held a somber air, a palpable weight that seemed to settle on the shoulders of those gathered. Gertrude Ramsden, seated at one end, observed the others with a keen eye. She noted the way Frederick Ackroyd fidgeted with his cufflinks, his fingers trembling slightly as he attempted to maintain a façade of composure. Joan Kershaw sat across from him, her expression inscrutable, eyes darting occasionally to the door as if expecting someone—or something—to enter. Simon Greenwood, ever the diligent steward, moved about the room with a quiet efficiency, pouring tea and arranging plates, while Jeremiah Marsden leaned back in his chair, arms crossed, a thoughtful expression on his face.

As the group settled into an uneasy silence, Gertrude's gaze drifted towards the library door just beyond the dining room. She could not shake the feeling that something was amiss. Rising from her seat, she excused herself with a gentle nod, her heart quickening as she approached the library. The air grew cooler as she entered, the scent of old books mingling with the faint aroma of polished wood. Her eyes fell upon the clock on the mantelpiece, its hands frozen in time. 'Ten minutes past eleven,' she murmured under her breath, the words echoing in the stillness. The clock in the library shows 10:15 PM. She leaned closer, her brow furrowing in concern. The time indicated by the clock at the scene of the crime was troubling. What had transpired in the moments leading up to that hour? A chill crept down her spine as she considered the implications. Could the clock have been tampered with? She felt a knot form in her stomach, a sense of foreboding settling over her like a heavy blanket.

Returning to the dining room, Gertrude's mind raced. She could not help but wonder if the clock's misleading time might point to a deliberate act of deception. Had someone altered it to obscure the truth? The thought sent shivers through her, and she glanced at Frederick, who now sat with his hands clasped tightly in front of him, his jaw clenched. Joan's calm demeanor contrasted sharply with Frederick's evident anxiety, raising a suspicion in Gertrude's mind. What secrets lay hidden beneath their polished exteriors? As she resumed her seat, she felt the weight of their collective silence pressing down upon her, each tick of the clock echoing the unspoken fears that lingered in the air.

Frederick finally broke the silence, his voice trembling slightly. 'I—I don't understand how this could have happened. We were all together, weren't we?' His eyes darted around the table, seeking reassurance from the others. Simon nodded, his expression grave. 'Yes, but the timing is all wrong. We need to piece together what we know.' Joan leaned forward, her tone sharp. 'We were last seen at ten, but if the clock says otherwise...' She trailed off, leaving the implication hanging in the air like a dark cloud. Jeremiah shifted in his seat, his gaze fixed on Frederick, who had turned pale. 'What were you doing after ten, Frederick?' he asked, his tone probing. The tension in the room thickened, each word a thread weaving a tighter web of suspicion.

Gertrude felt the atmosphere shift, the air crackling with unspoken accusations. She caught a glimpse of the fear in Frederick's eyes, a flicker of something deeper, something that hinted at a secret he was desperate to keep hidden. The breakfast, once a mundane gathering, had transformed into a stage for a drama unfolding before her very eyes. She took a deep breath, steeling herself for what lay ahead. The investigation was just beginning, and with it came the promise of revelations that would shake the very foundations of their lives. Each of them held a piece of the puzzle, but would they be willing to share it? The clock, with its frozen hands, seemed to mock them, a silent witness to the truths they were yet to uncover.
```

---

## CHAPTER 3, ATTEMPT 1 — 2026-03-17T19:14:39Z

**Model:** GPT-4o-mini | **Agent:** `Agent9-ProseGenerator-Ch3`  
**Messages:** 3 (system + user[outline] + user[pre-checklist])  
**Prompt hash:** `42a56a74673b71c4` | **Retry attempt:** 0  
**Result:** FAILED — `clue_clock_time` absent; word count ~772/1300

### Message 1 — system

*(Same base system prompt as Ch1/Ch2, with the following changes:)*

```
[All base rules apply]

CLUES TO SURFACE IN THESE CHAPTERS — mandatory:
• [clue_1] The clock in the library shows 10:15 PM.
  Category: temporal | Criticality: essential | Supports inference step 1
  Points to: The time indicated by the clock at the scene of the crime.

• [clue_2] The victim was last seen at 10:00 PM.
  Category: temporal | Criticality: essential | Supports inference step 1
  Points to: Contradiction in the timeline of events.

NARRATIVE STATE additions:
DO NOT OPEN THIS CHAPTER WITH: general-descriptive, general-descriptive (already used in prior chapters)
DO NOT REUSE THESE SENSORY PHRASES: heavy drapes; chill lingered; faint traces; chill creep; heavy fog; rich tapestries; quiet efficiency; faint aroma; chill crept

SCENE GROUNDING CHECKLIST:
- Chapter 3: anchor opening in "the library of Ackroyd Manor"; include 2+ sensory cues and 1+ atmosphere marker before major dialogue.

PROVISIONAL CHAPTER SCORE FEEDBACK:
- From Chapter 1: score 85/100 — word density below preferred target (815/1300); scene grounding weakness
- From Chapter 2: score 91/100 — word density below preferred target (1023/1300); scene grounding weakness
Required corrections: Increase chapter density with concrete investigation action and sensory-grounded beats. Open with named location anchor + 2 sensory cues + 1 atmosphere marker.

CRITICAL PROSE REQUIREMENTS — Clue Placement for These Chapters:
- clue_clock_time must appear in Act 1, Scene 3 via Direct observation

PROMPT BUDGET SUMMARY: budget=6200 tokens; fixed=3561; context=2288; dropped=[humour_guide, craft_guide, location_profiles, temporal_context, continuity_context]; truncated=[character_personality, location_profiles, temporal_context]
```

### Message 2 — user (outline)

```
Write the full prose following the outline scenes.

CHAPTER OBLIGATION CONTRACT (MUST SATISFY):
- Chapter 3:
  - Location anchor: the library of Ackroyd Manor.
  - CLUE OBLIGATIONS — mandatory prose elements (do NOT omit or bury):
    • clue_clock_time — include as concrete observable evidence on-page.
    • The clock in the library shows 10:15 PM. [clue_1] ⚠ EARLY PLACEMENT — write this in the first 25% of the chapter
      Points to: The time indicated by the clock at the scene of the crime.
      ↳ In the immediately following paragraph, include an explicit inference or suspicion that relates to what was just observed.
    • The victim was last seen at 10:00 PM. [clue_2] ⚠ EARLY PLACEMENT — write this in the first 25% of the chapter
      Points to: Contradiction in the timeline of events.
      ↳ In the immediately following paragraph, include an explicit inference or suspicion that relates to what was just observed.
- Locked fact phrase obligations:
  - If this batch mentions The exact time shown on the stopped clock face, write exactly: "ten minutes past eleven".
  - If this batch mentions The exact amount the clock was wound back, write exactly: "forty minutes".
- Seasonal vocabulary allow-list: winter, wintry, midwinter.
- Forbidden seasonal words: spring, summer, autumn.

FROZEN TIMELINE STATE (DO NOT ALTER):
- Timeline anchor: January (winter).
- Established timeline fact: 10:15 PM (time on the clock)
- Established timeline fact: 10:00 PM (last seen)

# Case Overview
[same as Ch1/Ch2]

Outline scenes:
[
  {
    "sceneNumber": 3,
    "act": 1,
    "title": "The Clock's Time",
    "setting": {
      "location": "the library of Ackroyd Manor",
      "timeOfDay": "Mid-morning",
      "atmosphere": "Eerie silence, punctuated by the ticking of the clock"
    },
    "characters": ["Gertrude Ramsden", "Frederick Ackroyd"],
    "purpose": "Reveal the first critical clue about the clock",
    "cluesRevealed": ["clue_1", "clue_2"],
    "dramaticElements": {
      "conflict": "The clock's time raises questions about the timeline.",
      "tension": "Gertrude's curiosity piqued as she examines the clock.",
      "microMomentBeats": ["Gertrude's hand hovers over the clock, contemplating its significance."]
    },
    "summary": "Gertrude inspects the clock in the library, noting that it shows 10:15 PM, while the victim was last seen at 10:00 PM. This discrepancy raises immediate questions about the timeline of the murder.",
    "estimatedWordCount": 900
  }
]
```

### Message 3 — user (pre-checklist)

```
BEFORE SUBMITTING YOUR JSON — verify this checklist:
□ Each chapter reaches the hard floor of 704 words and aims for 1500 words or more.
□ If you mention locked evidence, you used the exact locked phrase verbatim.
□ Allowed seasonal words only: winter, wintry, midwinter.
□ Forbidden seasonal words: spring, summer, autumn.
□ Chapter 3: "The clock in the library shows 10:15 PM." is placed in the first 25% of the chapter, followed by an explicit inference or suspicion paragraph.
□ Chapter 3: "The victim was last seen at 10:00 PM." is placed in the first 25% of the chapter, followed by an explicit inference or suspicion paragraph.
□ Return valid JSON only.
```

---

## CHAPTER 3, ATTEMPT 2 — 2026-03-17T19:14:50Z

**Model:** GPT-4o-mini | **Agent:** `Agent9-ProseGenerator-Ch3`  
**Messages:** 4 (system + user[outline] + user[pre-checklist] + user[retry-2])  
**Prompt hash:** `79f683ca646df409` | **Retry attempt:** 0  
**Result:** FAILED — `clue_clock_time` still absent; word count 772/1300

*(Messages 1–3 identical to Attempt 1. Message 4 added:)*

### Message 4 — user (retry injection, attempt 2)

```
Attempt 2/4 — chapters 3 — 2 validation issue(s) to resolve:

═══ PROSE QUALITY ERRORS (2) ═══
• Chapter 3: clue evidence "clue_clock_time" is absent. Include an on-page observation or reference to "clue_clock_time" before the chapter ends.
• Chapter 3: word count below preferred target (772/1300)

✓ SOLUTION: Vary paragraph lengths (short, medium, long)
✓ Include sensory details and atmospheric description
✓ Ensure each chapter has substance (3+ paragraphs minimum)

═══ RETRY MICRO-PROMPTS (2) ═══
• REPAIR [clue_visibility — attempt 2]: chapters 3 are missing: clue_clock_time.
  Near the beginning of the chapter:
  • Paragraph 1: A character directly observes or discovers the missing evidence. Be specific and sensory — describe what is seen, touched, or heard. Include any exact required phrase verbatim.
  • Paragraph 2 (immediately following): The detective or POV character explicitly reasons about what this evidence means — who it implicates, what is suspicious, or what inference it supports.
  Keep these as two clearly separate paragraphs. Do not bury the evidence in atmosphere or background dialogue.
• MICRO-PROMPT [word_count]: Raise chapter length to at least 1300 words (currently 772). Expand with concrete action beats, sensory setting detail, and inference-relevant dialogue; avoid filler recap.

Regenerate chapters 3 with the above corrections applied.
```

---

## CHAPTER 3, ATTEMPT 3 — 2026-03-17T19:15:01Z

**Model:** GPT-4o-mini | **Agent:** `Agent9-ProseGenerator-Ch3`  
**Messages:** 5 (system + user[outline] + user[pre-checklist] + user[retry-2] + user[retry-3])  
**Prompt hash:** `9a708edc753f69cd` | **Retry attempt:** 0  
**Result:** FAILED — `clue_clock_time` still absent; word count 817/1300

*(Messages 1–4 identical to Attempt 2. Message 5 added:)*

### Message 5 — user (retry injection, attempt 3)

```
Attempt 3/4 — chapters 3 — 2 validation issue(s) to resolve:

═══ PROSE QUALITY ERRORS (2) ═══
• Chapter 3: clue evidence "clue_clock_time" is absent. Include an on-page observation or reference to "clue_clock_time" before the chapter ends.
• Chapter 3: word count below preferred target (817/1300)

✓ SOLUTION: Vary paragraph lengths (short, medium, long)
✓ Include sensory details and atmospheric description
✓ Ensure each chapter has substance (3+ paragraphs minimum)

═══ RETRY MICRO-PROMPTS (2) ═══
• REPAIR [clue_visibility — attempt 3 — PARAGRAPH STRUCTURE REQUIRED]: clue_clock_time still missing.
  You MUST include a two-paragraph sequence in the first quarter of the chapter:
  Paragraph A: The character physically approaches, examines, or directly perceives the evidence. Write this as a present-action beat, not a recalled memory. Include the exact required phrase if one is specified.
  Paragraph B: In the very next paragraph, the character explicitly says or thinks that this evidence may be misleading, was tampered with, or points to a specific person. Use first-person inference language ("She realised...", "He could not help but wonder..."). This must be a full separate paragraph, not a tacked-on sentence.
  The chapter must be at least 1450 words. Use action, inference dialogue, and sensory grounding to expand — not recap.
• MICRO-PROMPT [word_count]: Raise chapter length to at least 1300 words (currently 817). Expand with concrete action beats, sensory setting detail, and inference-relevant dialogue; avoid filler recap.

Regenerate chapters 3 with the above corrections applied.
```

---

## CHAPTER 3, ATTEMPT 4 (FINAL) — 2026-03-17T19:15:12Z

**Model:** GPT-4o-mini | **Agent:** `Agent9-ProseGenerator-Ch3`  
**Messages:** 6 (system + user[outline] + user[pre-checklist] + user[retry-2] + user[retry-3] + user[retry-4])  
**Prompt hash:** `744d02393e51427e` | **Retry attempt:** 0  
**Result:** FAILED — `clue_clock_time` still absent; word count 904/1300 — **RUN HARD FAIL**

*(Messages 1–5 identical to Attempt 3. Message 6 added:)*

### Message 6 — user (retry injection, attempt 4 — FINAL)

```
Attempt 4/4 — chapters 3 — 2 validation issue(s) to resolve:

═══ PROSE QUALITY ERRORS (2) ═══
• Chapter 3: clue evidence "clue_clock_time" is absent. Include an on-page observation or reference to "clue_clock_time" before the chapter ends.
• Chapter 3: word count below preferred target (904/1300)

✓ SOLUTION: Vary paragraph lengths (short, medium, long)
✓ Include sensory details and atmospheric description
✓ Ensure each chapter has substance (3+ paragraphs minimum)

═══ RETRY MICRO-PROMPTS (2) ═══
• REPAIR [clue_visibility — attempt 4 — FINAL MANDATORY BLOCK]: clue_clock_time has failed every prior attempt.
  WITHIN THE FIRST 300 WORDS of the chapter, place this two-paragraph block:
  Block paragraph 1: Direct physical observation of the evidence by the POV character. Name it explicitly. Include any exact required phrase verbatim. Show, do not summarise.
  Block paragraph 2: Explicit reasoning that this evidence may have been manipulated, timed, or positioned to mislead. The character must state this in their own words.
  After this block, continue the chapter normally to reach at least 1500 words.
  REBUILD the chapter from scratch — do not patch or preserve prior wording. All prior text should be treated as discarded.
• MICRO-PROMPT [word_count]: Raise chapter length to at least 1300 words (currently 904). Expand with concrete action beats, sensory setting detail, and inference-relevant dialogue; avoid filler recap.

Regenerate chapters 3 with the above corrections applied.
```

---

## Diagnostic Notes

### Pattern analysis

| Chapter | Clue ID | Description available to model | Attempts | Resolved |
|---------|---------|--------------------------------|----------|---------|
| Ch1 | `clue_4` | ✅ "The presence of oil suggests recent tampering with the clock." | 2 | ✅ Yes (early-placement repositioned) |
| Ch2 | `clue_1` | ✅ "The clock in the library shows 10:15 PM." | 3 + expansion | ✅ Yes (via UnderflowExpansion) |
| Ch3 | `clue_clock_time` | ❌ **No description — abstract ID only** | 4 | ❌ **No — hard fail** |
| Ch3 | `clue_1` | ✅ "The clock in the library shows 10:15 PM." | — | ✅ Present in all attempts |
| Ch3 | `clue_2` | ✅ "The victim was last seen at 10:00 PM." | — | ✅ Present in all attempts |

### Root cause: `clue_clock_time` schema gap

The validator checks for `clue_clock_time` by ID. The model receives only:
> `• clue_clock_time — include as concrete observable evidence on-page.`

There is no `description` field, no `pointsTo` text, and no prose guidance. The model cannot produce matching text because it has no content to match against. The retry micro-prompts appropriately escalate (attempt 2: two-paragraph repair; attempt 3: Paragraph A/B structure; attempt 4: mandatory first-300-words block + full rebuild), but since the ID remains abstract, the validator continues to report it absent regardless of what the model writes.

This is a data defect in the story CML: `clue_clock_time` was added to the `clue_placement` specification for Ch3 (Act 1, Scene 3) but was never given a prose description field. The validator's string-match cannot find a literal `"clue_clock_time"` in the prose output. The fix is either: (a) assign a description to `clue_clock_time` in the CML so the obligation block renders meaningful prose guidance, or (b) remove it from the placement specification if it is a duplicate of `clue_1`.

### Word count trajectory

| Chapter | Attempt 1 | Attempt 2 | Attempt 3 | Attempt 4 | Final |
|---------|-----------|-----------|-----------|-----------|-------|
| Ch1 | 793 | — (clean) | — | — | ~815 |
| Ch2 | 724 | 724 | 646 | UnderflowExp | ~1023 |
| Ch3 | ~772 | 772 | 817 | 904 | **FAILED** |

> Ch2 attempt 3 regressed to 646 — below the hard floor of 704 — despite the attempt-2 error message listing preferred target 1300. This is the first regression seen across these runs, possibly caused by the escalating retry message accumulation consuming prompt budget and reducing the capacity available for prose generation.

### Prompt hash changes

All prompt hashes change between Ch3 attempts despite `retryAttempt: 0` remaining constant. The hash changes are consistent with the growing message array (each retry adds one more user message). The `retryAttempt: 0` field appears to track the API-level retry, not the prose validation retry loop.
