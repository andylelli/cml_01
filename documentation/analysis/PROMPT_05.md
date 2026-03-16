# PROMPT_05: Full LLM Prompts — run_17e4a016, 2026-03-15T19:35

Story: The Timely Deception | Chapter 6 | Agent9-ProseGenerator-Ch6  
Run ID: `run_17e4a016-1c89-4336-a116-957a606445e4`

---

## Run Metadata

| Field | Value |
|-------|-------|
| Run ID | `run_17e4a016-1c89-4336-a116-957a606445e4` |
| Date | 2026-03-15 |
| Time window | 19:18:55 – 19:36:25 |
| Story title | The Timely Deception |
| Setting | Havenwood Grange, 1940s |
| Crime | murder (suspected poisoning) |
| Culprit | Pauline Langton |
| Non-prose model | GPT-4o-mini (agents 1–8) |
| Prose model | gpt-5-chat (Agent9) |

**Cast / Character Map (canonical, immutable):**

| Character | Gender | Pronouns |
|-----------|--------|---------|
| Christopher Atkinson | male | he/him/his |
| Pauline Langton | female | she/her/her |
| Linda Redmore | female | she/her/her |
| Harold Somerby | male | he/him/his |
| Audrey Denison | female | she/her/her |

**Chapter 6 Scene Outline:**

```json
{
  "sceneNumber": 6,
  "act": 1,
  "title": "Commitment to the Investigation",
  "setting": {
    "location": "study of Havenwood Grange",
    "timeOfDay": "Late afternoon",
    "atmosphere": "Determined and focused as Audrey makes her decision."
  },
  "characters": ["Audrey Denison"],
  "purpose": "Establish Audrey's commitment to solving the mystery.",
  "cluesRevealed": [],
  "dramaticElements": {
    "conflict": "Audrey faces pressure from the guests to solve the case.",
    "tension": "She feels the weight of expectation on her shoulders.",
    "microMomentBeats": [
      "Audrey stares at the clock, contemplating her next move."
    ]
  },
  "summary": "After gathering initial information, Audrey resolves to uncover the truth behind the murder. She feels the pressure from the guests but is determined to see the investigation through.",
  "estimatedWordCount": 1800
}
```

**Locked Facts (canonical, use verbatim):**

- The exact time shown on the stopped clock face: `"ten minutes past eleven"`
- The exact amount the clock was wound back: `"forty minutes"`

---

## Attempt Summary

| # | Timestamp | Route | Msg count | Errors in OUTPUT |
|---|-----------|-------|-----------|-----------------|
| 1 | 19:35:00 | buildProsePrompt (initial) | 3 | Harold Somerby: `she/her` (should be he/him/his) — 1 error |
| 2 | 19:35:45 | buildRetryRevisionPrompt | 6 | Linda Redmore: `he` + Harold Somerby: `she/her` — 2 errors |
| 3 | 19:35:55 | buildRetryRevisionPrompt | 6 | Linda Redmore: `he` + Harold Somerby: `she/her` — 2 errors |
| 4 | 19:36:07 | buildRetryRevisionPrompt (FINAL) | 6 | Linda Redmore: `he` + Harold Somerby: `she/her` — 2 errors |

**Overall result:** FAILED — 4/4 attempts exhausted. Chapter 6 pronoun errors were not resolved across any retry.

**Key observations:**
- A1 introduced one pronoun error (Harold Somerby: she/her).
- A2 attempted to fix it but introduced a second regression (Linda Redmore: he) while failing to fix Harold.
- A3 and A4 produced identical outputs to A2 — the errors were locked in.
- The retry mechanism (`buildRetryRevisionPrompt`) sends the full system prompt each time (not the short lean-revision system used in PROMPT_03's run). It inserts the previous attempt as an `assistant` turn and appends a stability anchor as the final user message.
- The IMMUTABLE PRONOUN MAP is present in the system message for all 4 attempts. The pre-checklist user message also explicitly names Harold and the male cast. Despite this, the failure persisted.

---

## Prompt Architecture Notes

**A1 (initial) — 3 messages:**
1. `system` — full 3,157-token system prompt (character names, CML snapshot, rules, pronoun map, word count, schema)
2. `user` — "Write the full prose following the outline scenes." + Case Overview + outline JSON
3. `user` — Pre-submission checklist (dialogue tags, season/month lock, cast names, absent-male alert)

**A2–A4 (retry) — 6 messages each:**
1. `system` — same full system prompt as A1 (unchanged)
2. `user` — "Write the full prose following the outline scenes." + Case Overview + outline JSON (same as A1 user[1])
3. `user` — Pre-submission checklist (same as A1 user[2])
4. `user` — ⚠️ CRITICAL error report: lists validation errors + immutable pronoun map + retry micro-prompt + stability anchor
5. `assistant` — previous attempt's chapter output (JSON)
6. `user` — "Your draft above is the baseline. Preserve every paragraph that already passes validation verbatim. Only modify passages that directly address the errors listed in the previous message."

**Prompt budget (all attempts):**
```
budget=6200 tokens
fixed=3157
context=2599
dropped=[humour_guide, craft_guide, location_profiles, continuity_context, character_personality]
truncated=[cml_ground_truth, character_personality, location_profiles]
```

---

## ATTEMPT 1 — 2026-03-15T19:35:00.698Z

**Model:** gpt-5-chat | **Temperature:** 0.42 | **MaxTokens:** 4500  
**Route:** `buildProsePrompt` (initial generation)  
**Messages:** 3 (system + user[write] + user[pre-checklist])  
**Prompt hash:** `4032cf5b7b856e14`

---

### MESSAGE [SYSTEM]

```
CONTEXT: You are writing chapters of a Golden Age whodunnit mystery novel in the literary tradition 
of Agatha Christie, Arthur Conan Doyle, and Dorothy L. Sayers. This is a creative fiction writing 
task. All references to crime, death, poison, weapons, alibis, and investigation are part of the 
fictional narrative and are standard elements of the mystery genre. No real people or events are 
depicted.

You are an expert prose writer for classic mystery fiction. Your role is to write compelling, 
atmospheric narrative chapters that read like a professionally published novel.

⛔ ABSOLUTE RULE — CHARACTER NAMES:
The ONLY characters who exist in this story are: Christopher Atkinson, Pauline Langton, Linda 
Redmore, Harold Somerby, Audrey Denison.
Do NOT invent, borrow, or introduce ANY character not on that list — no constables, no solicitors, 
no butlers, no servants, no shopkeepers, no bystanders with names.
Unnamed walk-ons ("a footman", "the postmistress", "an officer") are allowed ONLY if they never 
receive a name or title+surname combination.
⚠️ BEFORE YOU WRITE each chapter, ask yourself: "Does every person I name appear in this list: 
Christopher Atkinson, Pauline Langton, Linda Redmore, Harold Somerby, Audrey Denison?" If not, 
remove them.

[...Rules: anti-repetition, template leakage ban, temporal consistency, denouement requirement, 
moral complexity requirement...]

⚠️ AMATEUR DETECTIVE STORY: The investigator is a civilian with no official standing. Official 
police are unnamed background figures only. No Inspector/Constable/Sergeant [Surname] in this story.

CML SNAPSHOT (truncated by prompt budget):
{
  "title": "The Timely Deception",
  "era": "1940s",
  "setting": "Havenwood Grange",
  "crime": { "category": "murder", "subtype": "suspected poisoning" },
  "falseAssumption": {
    "statement": "The time of death must be accurately represented by the stopped clock.",
    "type": "temporal",
    "what_it_hides": "The clock was deliberately tampered with to mislead the investigation."
  },
  "discriminatingTest": {
    "method": "trap",
    "design": "A reenactment is staged where all suspects are questioned about their whereabouts 
               during the time of death, specifically regarding the clock's time.",
    "knowledge_revealed": "Pauline's knowledge of the clock's tampering process is revealed when 
                           she falters in her explanation."
  },
  "constraintSpace": {
    "time": {
      "anchors": ["Argument heard at 7:30 PM", "Body found at 7:45 PM"],
      "contradictions": ["Clock shows 7:40 PM but body was found shortly after the argument."]
    },
    "access": { "actors": ["Pauline Langton", "Linda Redmore", "Harold Somerby"] }
  }
}

CRITICAL CHARACTER CONSISTENCY RULES:
1. Each character has ONE canonical name. COMPLETE CAST: Christopher Atkinson, Pauline Langton, 
   Linda Redmore, Harold Somerby, Audrey Denison
2. Gender pronouns are defined in the IMMUTABLE PRONOUN MAP above. Never switch pronouns mid-story.
3. Character roles are fixed.

[...PHYSICAL PLAUSIBILITY REQUIREMENTS, ERA AUTHENTICITY, TEMPORAL CONTEXT (July 1943 / summer)...]

TEMPORAL CONTEXT:
This story takes place in July 1943 during summer.
Seasonal Atmosphere: Warm temperatures averaging 75°F (24°C), Occasional thunderstorms, Humidity 
rising due to summer heat.
Season lock (hard): This timeline is anchored to July (summer). Avoid incompatible seasonal labels 
(spring, autumn, winter) in the same chapter.

⛔ LOCKED FACTS — DO NOT CONTRADICT:
  - The exact time shown on the stopped clock face: "ten minutes past eleven"
  - The exact amount the clock was wound back: "forty minutes"

═══ NARRATIVE STATE (read-only — do not contradict) ═══
LOCKED FACTS — use verbatim whenever this evidence is described:
  • The exact time shown on the stopped clock face: "ten minutes past eleven"
  • The exact amount the clock was wound back: "forty minutes"

DO NOT OPEN THIS CHAPTER WITH: general-descriptive, general-descriptive, character-action, 
general-descriptive, general-descriptive (already used in prior chapters)

DO NOT REUSE THESE SENSORY PHRASES (already used): faint hum; heavy curtains; amber glow; quiet 
precision; pale blue; amber on; quiet but; faint ticking; faint flush; quiet force

SCENE GROUNDING CHECKLIST (MUST FOLLOW):
- Chapter 6: anchor opening in "study of Havenwood Grange"; include 2+ sensory cues and at least 
  one of these accepted time/weather words: morning, afternoon, evening, night, midnight, dawn, 
  dusk, twilight, rain, mist, fog, wind, storm — before major dialogue.

PROVISIONAL CHAPTER SCORE FEEDBACK (APPLY TO NEXT CHAPTERS):
- From Chapter 3: score 96/100. Deficits: scene grounding weakness.
- From Chapter 5: score 96/100. Deficits: scene grounding weakness.
  Required corrections: Open next chapter with named location anchor + 2+ sensory cues + 
  time/weather word.

PROMPT BUDGET SUMMARY: budget=6200; fixed=3157; context=2599; 
dropped=[humour_guide, craft_guide, location_profiles, continuity_context, character_personality];
truncated=[cml_ground_truth, character_personality, location_profiles]

[...prose output schema, NOVEL-QUALITY PROSE REQUIREMENTS, QUALITY GUARDRAILS, CRITICAL PROSE 
REQUIREMENTS (discriminating test, suspect clearance, culprit revelation), WORD COUNT (target 
1600 words, hard floor 525 words)...]

IMMUTABLE PRONOUN MAP (NON-OVERRIDABLE):
- Christopher Atkinson: he/him/his
- Pauline Langton: she/her/her
- Linda Redmore: she/her/her
- Harold Somerby: he/him/his
- Audrey Denison: she/her/her
- Do not switch or reinterpret these pronouns in any chapter.
- Any pronoun mismatch invalidates the chapter.
- DIALOGUE TAG RULE: In dialogue tags, the pronoun ('he said'/'she asked'/'he murmured') must 
  match the SPEAKER's gender — NOT the gender of any character named inside the quoted speech.
```

*(Full system message: ~21,000+ characters. Key sections summarised above.)*

---

### MESSAGE [USER 1] — Write instruction

```
Write the full prose following the outline scenes.

# Case Overview
Title: The Timely Deception
Era: 1940s
Setting: Havenwood Grange
Crime: murder (suspected poisoning)
Culprit: Pauline Langton
False assumption: The time of death must be accurately represented by the stopped clock.
Cast: Christopher Atkinson, Pauline Langton, Linda Redmore, Harold Somerby, Audrey Denison

Setting Lock: Keep all scenes and descriptions consistent with the stated setting (Havenwood Grange).
Do not introduce a different location type.

Outline scenes:
[
  {
    "sceneNumber": 6,
    "act": 1,
    "title": "Commitment to the Investigation",
    "setting": {
      "location": "study of Havenwood Grange",
      "timeOfDay": "Late afternoon",
      "atmosphere": "Determined and focused as Audrey makes her decision."
    },
    "characters": ["Audrey Denison"],
    "purpose": "Establish Audrey's commitment to solving the mystery.",
    "cluesRevealed": [],
    "dramaticElements": {
      "conflict": "Audrey faces pressure from the guests to solve the case.",
      "tension": "She feels the weight of expectation on her shoulders.",
      "microMomentBeats": ["Audrey stares at the clock, contemplating her next move."]
    },
    "summary": "After gathering initial information, Audrey resolves to uncover the truth behind 
    the murder. She feels the pressure from the guests but is determined to see the investigation 
    through.",
    "estimatedWordCount": 1800
  }
]
```

---

### MESSAGE [USER 2] — Pre-submission checklist

```
BEFORE SUBMITTING YOUR JSON — run this checklist:
▢ Every dialogue tag ('he said' / 'she asked' / 'he murmured') — the pronoun matches the 
  SPEAKER's gender, not any character named inside the quoted speech.
▢ No season word (spring/summer/autumn/winter) contradicts the month "July" in any paragraph. 
  Replace any conflicting season word with "summer".
▢ Every character name in your prose appears in this list: Christopher Atkinson, Pauline Langton, 
  Linda Redmore, Harold Somerby, Audrey Denison.
▢ Ch6: Christopher Atkinson (he/him), Harold Somerby (he/him) may be referenced but are NOT the 
  POV character. Every "she"/"her" in Ch6 belongs only to the female cast.
Return valid JSON only after completing this check.
```

**⚠️ NOTE:** The pre-checklist (user2 of A1) explicitly names the absent male characters and their pronouns. Despite this, A1's output used `she/her` for Harold Somerby.

**OUTPUT (A1):** FAILED — 1 error: Harold Somerby referred to as `she/her` (should be he/him/his).

---

## ATTEMPT 2 — 2026-03-15T19:35:45.065Z

**Model:** gpt-5-chat | **Temperature:** 0.42 | **MaxTokens:** 4500  
**Route:** `buildRetryRevisionPrompt` (retry after 1 error)  
**Messages:** 6 (system + user[write] + user[checklist] + user[errors] + assistant[A1 draft] + user[stability anchor])  
**Prompt hash:** `a1333ccd70e6e212`

---

### MESSAGE [SYSTEM] — Identical to A1

*(Same full system message as A1. The retry path sends the complete system prompt, not a short lean-revision version.)*

### MESSAGE [USER 1] — Same write instruction as A1

### MESSAGE [USER 2] — Same pre-submission checklist as A1

---

### MESSAGE [USER 3] — Error report from A1

```
⚠️ CRITICAL: Attempt 2/4 for chapters 6 had 1 validation error(s).

You MUST fix ALL of these issues. This is your last chance before generation fails.

MANDATORY FIX ORDER (APPLY IN THIS EXACT ORDER):
1. Word count first: each failed chapter must satisfy the hard-floor target.
2. Victim naming second: Chapter 1 must name the victim as "Christopher Atkinson".
3. Pronouns third: keep this immutable map exactly ->
   - Christopher Atkinson: he/him/his; - Pauline Langton: she/her/her; - Linda Redmore: she/her/her;
   - Harold Somerby: he/him/his; - Audrey Denison: she/her/her
   DIALOGUE TAG RULE: 'he said'/'she asked' etc. must match the SPEAKER's gender.
4. Style and pacing fourth: revise voice/rhythm only after rules 1-3 are satisfied.

━━━ PRONOUN CONSISTENCY ERRORS (1) ━━━
• Chapter 6: Character "Harold Somerby" has incorrect pronouns. Should use he/him/his but found: 
  she, her (Use he/him/his consistently for Harold Somerby)

✓ SOLUTION: [pronoun map repeated]

━━━ RETRY MICRO-PROMPTS (1) ━━━
• MICRO-PROMPT [pronoun_consistency]: Replace every mismatched pronoun token with the canonical 
  character pronoun set and re-check each mention in-scene.

━━━ STABILITY ANCHOR ━━━
Before regenerating, note what already PASSED in the previous attempt and preserve it.

REGENERATE chapters 6 with ALL listed fixes applied.
```

---

### MESSAGE [ASSISTANT] — A1 draft output (inserted as conversation context)

*(The full JSON chapter output from A1 is inserted here as an assistant turn, so the model can see what to revise.)*

---

### MESSAGE [USER 4] — Stability anchor

```
Your draft above is the baseline. Preserve every paragraph that already passes validation verbatim. 
Only modify passages that directly address the errors listed in the previous message.
```

**OUTPUT (A2):** FAILED — 2 errors (regression):
- Linda Redmore: `he` found (should be she/her/her) — **new error introduced**
- Harold Somerby: `she/her` still found (original error not fixed)

---

## ATTEMPT 3 — 2026-03-15T19:35:55.970Z

**Model:** gpt-5-chat | **Temperature:** 0.42 | **MaxTokens:** 4500  
**Route:** `buildRetryRevisionPrompt` (retry after 2 errors)  
**Messages:** 6  
**Prompt hash:** `3ce64f88b2031c35`

---

### MESSAGE [USER 3] — Error report from A2

```
⚠️ CRITICAL: Attempt 3/4 for chapters 6 had 2 validation error(s).

━━━ PRONOUN CONSISTENCY ERRORS (2) ━━━
• Chapter 6: Character "Linda Redmore" has incorrect pronouns. Should use she/her/her but found: 
  he (Use she/her/her consistently for Linda Redmore)
• Chapter 6: Character "Harold Somerby" has incorrect pronouns. Should use he/him/his but found: 
  she, her (Use he/him/his consistently for Harold Somerby)

[...same mandatory fix order, pronoun map, micro-prompt, stability anchor...]

REGENERATE chapters 6 with ALL listed fixes applied.
```

### MESSAGE [ASSISTANT] — A2 draft output

*(The full JSON chapter output from A2 is inserted here.)*

### MESSAGE [USER 4] — Stability anchor (identical to A2)

**OUTPUT (A3):** FAILED — Same 2 errors as A2:
- Linda Redmore: `he` found
- Harold Somerby: `she/her` found

The A3 output was structurally identical to A2 (same 11-paragraph chapter, same draft text).

---

## ATTEMPT 4 — 2026-03-15T19:36:07.XXX Z

**Model:** gpt-5-chat | **Temperature:** 0.42 | **MaxTokens:** 4500  
**Route:** `buildRetryRevisionPrompt` (FINAL attempt)  
**Messages:** 6  
**Prompt hash:** `df9432ef316fac96`

---

### MESSAGE [USER 3] — Error report from A3

```
⚠️ CRITICAL: Attempt 4/4 for chapters 6 had 2 validation error(s).

This is your FINAL chance before generation fails.

━━━ PRONOUN CONSISTENCY ERRORS (2) ━━━
• Chapter 6: Character "Linda Redmore" has incorrect pronouns. Should use she/her/her but found: 
  he (Use she/her/her consistently for Linda Redmore)
• Chapter 6: Character "Harold Somerby" has incorrect pronouns. Should use he/him/his but found: 
  she, her (Use he/him/his consistently for Harold Somerby)

[...same mandatory fix order, pronoun map, micro-prompt, stability anchor...]

REGENERATE chapters 6 with ALL listed fixes applied.
```

### MESSAGE [ASSISTANT] — A3 draft output (identical to A2/A3)

### MESSAGE [USER 4] — Stability anchor

**OUTPUT (A4):** FAILED — Same 2 errors persisted. Chapter generation exhausted.

---

## Final Chapter Output (A4 — last attempt)

The A4 response was an 11-paragraph chapter, text substantially identical to A3:

```json
{
  "chapters": [
    {
      "chapterNumber": 6,
      "title": "Chapter 6: Commitment to the Investigation",
      "summary": "In the late afternoon light of Havenwood Grange's study, Audrey Denison steels herself to carry the investigation forward, feeling the weight of expectation and the uneasy silence of the house pressing upon her.",
      "paragraphs": [
        "The late afternoon sun slanted through the tall windows of the study at Havenwood Grange, spilling golden light across the polished mahogany desk and the scattered papers upon it. Outside, the air hung heavy with the warmth of a July evening, the faint rustle of leaves stirring in a lazy wind that carried the scent of cut grass and distant rain. Within, the atmosphere was taut with unspoken questions. Audrey Denison stood motionless beside the great grandfather clock, her reflection caught in the glass of its polished case. The pendulum hung still, frozen in perpetual hesitation, and the stopped face above it declared the same impossible time: ten minutes past eleven.",

        "She traced the edge of the clock's brass frame with a gloved fingertip, her expression unreadable. The clock had become the symbol of everything that defied reason in this house—its silence mocking the living, its hands pointing to a truth that refused to align with the facts. Somewhere between those unmoving minutes and the scattered fragments of testimony lay the answer she sought. Audrey exhaled slowly, aware of the faint hum of cicadas from the garden, the distant creak of a floorboard in the corridor beyond. Havenwood Grange seemed to breathe around her, each sound a reminder that the living still moved uneasily among the dead.",

        "The guests—if one could still call them that—had retreated to their rooms after the constable's brief visit. Christopher Atkinson had paced the drawing-room like a man rehearsing a confession, while Pauline Langton had maintained her composure with brittle precision, her tea untouched and her gaze fixed on the carpet. Linda Redmore had wept quietly, her handkerchief damp and crumpled, and Harold Somerby had spoken little, his eyes darting toward the door as if escape might yet be possible. Audrey had watched them all, noting the tremor in Pauline's hand as she adjusted her pearl necklace, the way Harold's voice faltered when he was asked about the argument at half past seven. Each gesture, each silence, had etched itself into her mind.",

        "Now, alone in the study, she felt the full measure of what she had undertaken. The constable's words still echoed faintly in her memory—formal, detached, and altogether inadequate. Official inquiries would take time; the machinery of law moved with ponderous caution. But time, she thought bitterly, was the very thing that had been manipulated here. Someone had wound it back, quite literally, to conceal their crime. And if she waited for others to act, the truth might slip away beneath layers of polite evasion and fear.",

        "Audrey crossed to the desk and lowered herself into the leather chair, the surface cool beneath her palms. The faint scent of ink and old paper rose from the blotter. She drew out her notebook, its pages already filled with her tidy handwriting—observations, contradictions, and the beginnings of a timeline that refused to make sense. The argument at seven-thirty, the body found at seven-forty-five, and yet the clock insisting upon a death at ten past eleven. She tapped the page with the end of her fountain pen, her brow furrowing. The arithmetic of deceit, she thought, was always precise.",

        "A knock at the door interrupted her thoughts. She turned, but no one entered. Perhaps it had been the wind, or perhaps one of the others had approached and lost their nerve. She waited a moment longer, then rose and crossed to the window. The sky beyond was streaked with the faintest blush of dusk, the sun sinking behind the elms that bordered the drive. The air carried a promise of rain, and with it a strange relief. She had always found storms clarifying; they stripped the world of its pretenses. Perhaps this one would do the same for Havenwood.",

        "She returned to the clock, studying its face once more. Ten minutes past eleven. The hands gleamed faintly in the fading light, their stillness almost defiant. Someone had touched them—she could sense it as surely as she could sense the tension that lingered in every corridor of the house. It was not only a matter of who had poisoned the victim, but who had dared to rewrite time itself. Audrey's reflection wavered in the glass, her own eyes looking back at her with a determination she had not felt since her days in the Red Cross. She had seen death in many forms, but deceit—this deliberate manipulation of truth—was something colder.",

        "A faint sound drifted from the hall: the soft murmur of voices, quickly hushed. She could distinguish Pauline's low, measured tone and Christopher's sharper reply. Their words were indistinct, but the rhythm of tension was unmistakable. Audrey hesitated, then decided against confronting them. There would be time enough for that. For now, she needed clarity, not confrontation. She turned back to her notes and began to write, her pen scratching steadily across the paper. Each name, each time, each inconsistency—she catalogued them all. The act of writing steadied her, transforming confusion into purpose.",

        "Her thoughts returned to the moment she had first seen the body—still, pale, and strangely peaceful, as though death had come without struggle. The teacup beside the chair had borne the faintest residue of something bitter, and though the constable had taken it away for examination, Audrey had already drawn her conclusion. Poison, subtle and deliberate. The question was not only who had administered it, but when. The clock's deceit had made that question maddeningly uncertain. She leaned back, closing her eyes for a moment. The ticking of her wristwatch filled the silence, a reminder that time, at least in her world, still moved forward.",

        "When she opened her eyes again, the last of the daylight had faded, leaving the study bathed in the soft glow of the desk lamp. Shadows gathered in the corners, deepening the sense of isolation. Audrey rose and crossed to the fireplace, where the embers of the afternoon fire still smoldered faintly. She stirred them with the poker, watching sparks leap and vanish. The warmth brushed her face, and with it came a renewed sense of resolve. She would see this through—not for the sake of curiosity, but because truth, once glimpsed, demanded pursuit. Havenwood Grange had become a stage for deceit, and she would not leave until the final act was played.",

        "She glanced once more at the clock before leaving the study. Its face caught the lamplight, the hands gleaming like twin blades. Ten minutes past eleven. Forty minutes stolen from truth. She felt the weight of that manipulation as a personal affront, an insult to reason itself. Someone within these walls believed they could master time, and by extension, fate. Audrey Denison, adjusting the cuff of her linen blouse and smoothing the skirt of her A-line suit, resolved to prove them wrong. She extinguished the lamp, leaving the study in darkness save for the faint glow of the dying fire, and stepped into the corridor where the murmurs of the house awaited her. The investigation, she knew, had truly begun."
      ]
    }
  ]
}
```

**Word count:** ~1,650 words (meets 1,600-word target and 525-word floor).  
**Locked facts:** Both present verbatim — "ten minutes past eleven" (¶1, ¶7, ¶11) and "forty minutes" (¶11).  
**Scene grounding:** Opens with named location + afternoon + wind + rain (satisfies SCENE GROUNDING CHECKLIST).  
**Pronoun validation result:** FAILED — validator found `he` for Linda Redmore and `she/her` for Harold Somerby in the submitted text.

---

## Pronoun Failure Analysis

The paragraph at the heart of the failure is ¶3 (the guest observation paragraph):

> *"...Linda Redmore had wept quietly, **her** handkerchief damp and crumpled, and Harold Somerby had spoken little, **his** eyes darting toward the door..."*

This text reads as pronoun-correct for both Linda (`her`) and Harold (`his`). However, the validator was flagging errors. This suggests one of:

1. The validator's `findIncorrectPronouns` was detecting false positives — specifically the (now removed per R4) `followUpContexts` rule or another sentence-level miscategorisation.
2. A different sentence in the chapter (not ¶3) contained the mismatch, potentially in the A1 or A2 draft that was carried over into A3/A4.
3. The actual submitted chapter at the time of A1 contained genuinely incorrect pronouns that were then preserved by the stability-anchor instruction in A2–A4.

**The chapter text shown above reflects the A3/A4 assistant response as extracted from the raw prompt log.** The A1 draft (which the validator first rejected) is not preserved in the log — it exists only as the `assistant` turn within A2's message history, which was overwritten when A2 produced its own output.

---

## Comparison with PROMPT_03

| Dimension | PROMPT_03 (run_76473638) | PROMPT_05 (run_17e4a016) |
|-----------|--------------------------|--------------------------|
| Story | The Timekeeper's Deceit | The Timely Deception |
| Setting | Waverly Court | Havenwood Grange |
| Prose model | GPT-4o-mini | gpt-5-chat |
| Ch6 scene title | Commitment to the Investigation | Commitment to the Investigation |
| Ch6 detective | Sharon Tregothnan | Audrey Denison |
| Retry system msg | Short lean-revision ~1,851 chars | Full system ~21,000 chars |
| Retry msg count | 3 | 6 |
| A1 errors | Philip Beaumont: `she` (1 error) | Harold Somerby: `she/her` (1 error) |
| A2 errors | Henri Waldegrave: `she/her` + grounding | Linda Redmore: `he` + Harold: `she/her` (2 errors) |
| A3 errors | grounding weak (pronouns OK) | Same 2 errors — locked in |
| A4 errors | Henri Waldegrave: `she` + june/autumn | Same 2 errors — locked in |
| Result | FAILED | FAILED |
| Pattern | Regression each attempt | Convergence failure — errors frozen |
