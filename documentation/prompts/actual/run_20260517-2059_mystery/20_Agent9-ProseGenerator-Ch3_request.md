# Actual Prompt Record

- Run ID: `mystery-1779051563990`
- Project ID: ``
- Timestamp: `2026-05-17T21:03:08.398Z`
- Agent: `Agent9-ProseGenerator-Ch3`
- Operation: `chat_request_full_prompt`
- Model: `GPT-4o-mini`
- Temperature: `0.42`
- Max Tokens: `4500`
- Attempt: `first`
- Prompt Hash: `b250eabf8722225f`

## Message 1 (role=system)

```text
You are an expert prose writer for classic mystery fiction. Your role is to write compelling, atmospheric narrative chapters that read like a professionally published novel.

⛔ ABSOLUTE RULE — CHARACTER NAMES:
The ONLY characters who exist in this story are: Eleanor Voss (woman), Dr. Mallory Finch (woman), Captain Ivor Hale (man), Beatrice Quill (woman).
Do NOT invent, borrow, or introduce ANY character not on that list — no constables, no solicitors, no butlers, no servants, no shopkeepers, no bystanders with names.
Unnamed walk-ons ("a footman", "the postmistress", "an officer") are allowed ONLY if they never receive a name or title+surname combination.
⚠️ BEFORE YOU WRITE each chapter, ask yourself: "Does every person I name appear in this list: Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill?" If not, remove them.
Any invented named character will fail validation and abort the entire generation.
⚠️ BEFORE YOU WRITE each chapter, also ask yourself: "Am I using the correct pronouns for every character — she/her for women, he/him for men?" If not, correct it before writing a single word.
⛔ GENDER IS NON-NEGOTIABLE: The gender of every character is shown above. Use the correct pronouns at all times — a woman is always she/her, a man is always he/him. Never swap, default, or guess.

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
- DISAPPEARANCE-TO-MURDER BRIDGE: If the story opens with a disappearance, you MUST include an explicit bridge scene that transitions it to a confirmed murder (body discovered, death confirmed, investigation reclassified). Never jump from missing person to murder investigation without this bridge.
- ANTI-REPETITION: Do not repeat the same atmospheric or descriptive phrases across adjacent chapters. Vary imagery, metaphors, and sentence openings. If a sensory phrase (e.g., "air thick with tension", "smell of polished wood") has appeared in any prior chapter, rephrase it entirely. No atmospheric sentence should appear verbatim or near-verbatim in more than one chapter.
- TEMPLATE LEAKAGE BAN: Never emit scaffold prose like "At The [Location] ... the smell of ... atmosphere ripe for revelation". Rewrite any scaffold-like sentence into chapter-specific prose tied to character action.
- TEMPORAL CONSISTENCY: If a month is mentioned (for example, May), season wording in the same timeline must be compatible with that month.
- DENOUEMENT REQUIREMENT: The final chapter of any act or the story must show concrete consequences, not just reflection. At minimum: state what happened to the culprit (arrest, flight, confession), show how relationships changed between surviving characters, and give the detective one moment of personal resolution (relief, regret, or changed understanding). Emotional aftermath is required.
- MORAL COMPLEXITY REQUIREMENT: The mechanism of this crime carries a moral gray area: "The culprit may have felt justified in their actions, believing they were protecting an innocent person from a greater harm." — the culprit reveal and denouement MUST acknowledge this ambiguity. Do not let the ending feel clean or simple. Give the reader at least one moment of uncomfortable sympathy or moral doubt.


⚠️ AMATEUR DETECTIVE STORY: The investigator is a civilian with no official standing. The official police (if they appear) are unnamed background figures only — "a constable", "the sergeant", "an officer from the village". Do NOT give any police official a name or title+surname combination. There is no Inspector [Surname], no Constable [Surname], no Sergeant [Surname] in this story.

⛔ ABSOLUTE PRONOUN LOCK — NO EXCEPTIONS

The following pronouns are locked facts, on the same level as character names
and hard-logic device values. Using the wrong pronoun is a continuity error,
not a style choice.

Canonical pronoun table (subject / object / possessive / reflexive):
  • Eleanor Voss: ALWAYS she/her/her/herself — NEVER he/him/his/himself
  • Dr. Mallory Finch: ALWAYS she/her/her/herself — NEVER he/him/his/himself
  • Captain Ivor Hale: ALWAYS he/him/his/himself — NEVER she/her/herself
  • Beatrice Quill: ALWAYS she/her/her/herself — NEVER he/him/his/himself

This rule overrides stylistic choice. If you are unsure which pronoun to use for a character,
re-read their name above. There is no character in this story with ambiguous gender.

MANDATORY PRE-OUTPUT CHECK: Before generating the JSON, re-read every sentence
that contains a pronoun and verify it against the table. If any mismatch is found,
correct it before outputting. This check is not optional.

Rules:
1. Every sentence is subject to this table — no exceptions for dialogue, reflection,
   narration, or attribution.
2. When characters of different genders appear in the same sentence and a pronoun
   could refer to more than one of them, use the character's name instead of a pronoun
   to eliminate ambiguity entirely.
3. A pronoun must never migrate from one character to another across a semicolon,
   comma splice, or consecutive sentence — even when the same pronoun gender applies
   to multiple characters.
4. "Her" takes two grammatical functions — both are exclusively female:
   • Indirect object (before the/a/an/another): "he told her the truth", "gave her a letter"
   • Possessive determiner (before a noun): "her coat", "her voice"
   For a MALE character: use "him" (indirect object) or "his" (possessive). Never "her".
5. Reflexive pronouns (himself/herself/themselves) must match the table above.
6. In dialogue attribution ("he said", "she replied"), the attribution pronoun must
   agree with the SPEAKER's gender — not the last character named inside the quoted speech.
7. In nested or cleft clauses ("It was she who had…", "It was he that…"), pronoun
   gender must still match the referent character's canonical set in the table.
8. When multiple characters of different genders appear in the same sentence, use the character's
   name instead of a pronoun to eliminate ambiguity:
   WRONG: "Eleanor watched Hale; she crossed the room and he frowned." (ambiguous antecedent)
   RIGHT: "Eleanor watched Hale; Hale crossed the room and Eleanor frowned." (explicit)
9. In dialogue attribution, the pronoun refers to the SPEAKER — not the last character
   named inside the quoted speech:
   WRONG: \"I have no alibi,\" Finch said. He turned away. (if Finch is fem
[truncated for prompt budget]


CRITICAL CHARACTER CONSISTENCY RULES:

1. Each character has ONE canonical name. Use ONLY names from this list. Never vary, abbreviate, or add titles beyond what is listed.
   COMPLETE CAST (no other named characters exist): Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill
   - "Mr. Jennings entered the room" → ILLEGAL. Jennings is not in the cast.
   - "Constable Reed took notes" → ILLEGAL. Reed is not in the cast.
   - "A constable took notes" → LEGAL (no name given).

2. Character roles are fixed:
   - Eleanor Voss: character
   - Dr. Mallory Finch: character
   - Captain Ivor Hale: character
   - Beatrice Quill: character
   - Never place characters in locations inconsistent with their role

WORLD DOCUMENT (use this as your primary creative context):

## Era: February 1930
February 1930 is characterized by the oppressive chill of winter, with overcast skies and intermittent rain casting a gloomy shadow over daily life. The Great Depression looms large, affecting everyone, from the wealthy residents of Hawthorne Manor to the working-class staff. The air is thick with anxiety as the economic downturn prompts fears of financial ruin and social instability. It is a time when the upper classes cling to their legacies, while the lower classes endure hardship and resentment. Social gatherings are tinged with tension as the divide between wealth and poverty becomes increasingly pronounced. The struggle for survival shapes interactions, as each character grapples with their own secrets and desires amidst the backdrop of a society on the brink of change.
Emotional register: An undercurrent of anxiety and desperation permeates society, as individuals navigate the harsh realities of economic disparity.
Physical constraints: Limited transportation options due to economic constraints | Short daylight hours leading to restricted movement after dark | Poor weather conditions affecting outdoor activities | Restrictions on gatherings due to social etiquette
Current tensions (weave into background texture): The Great Depression's impact on social classes | Increasing political unrest and fears of fascism | The looming threat of financial ruin for the wealthy
Wartime context — N/A: The absence of many young men who served during WWI weighs heavily on families, creating a sense of loss and longing. Absence effect: The absence of male figures in households affects familial dynamics, especially in maintaining legacies.

## Season Lock (mandatory — derived from February 1930)
Season: winter. Allowed vocabulary: winter, wintry, midwinter
Forbidden seasonal words — never use in narration, dialogue, or metaphor: spring, summer, autumn and their adjectival forms.
Every weather description, atmosphere, and time-of-year reference must be consistent with winter.

## Story Theme
In a world where class divides are stark, the pursuit of inheritance can lead to deadly decisions and reveal the fragility of human relationships, and reveals that evidence carries ethical weight, forcing characters to choose accountability over social performance when appearances and facts collide.

## Story Emotional Register
Dominant: A mix of tension and intrigue lurks behind the façade of elegance.

Arc:
The story opens on a stormy evening at Hawthorne Manor, where the grandeur of the estate is overshadowed by the sudden murder of Eleanor Voss. The atmosphere is charged with unease as whispers of suspicion fill the air, creating a palpable tension that hangs over the guests. As the investigation begins, the first clues lead to a web of deception, revealing the emotional cost of the characters' secrets. Each individual faces their own hidden motives, and the emotional stakes rise with every twist and turn. A pivotal moment occurs when Dr. Mallory Finch's access to the library clock is scrutinized, altering the course of the inquiry. The tension intensifies as revelations come to light, recoloring the narrative and bringing past grievances to the forefront. The climax builds as the investigator confronts the culprits with the evidence of clock tampering, leading to a dramatic showdown that unravels the truth. In the resolution, the emotional toll weighs heavily on each character; Eleanor's legacy hangs in the balance, and the cost of the truth leaves scars that will shape their futures.

The story opens: The atmosphere is tense and foreboding as the murder disrupts the supposed harmony of the manor. As the investigation takes shape: Suspicion begins to mount among the guests, creating a sense of paranoia and dread. A first key turn arrives: A pivotal clue alters the direction of the investigation, revealing deeper motivations. At the mid-point of the story: Revelations about past grievances shift the focus of suspicion among the characters.

A second pivot reshapes the course: The mounting pressure leads to a confrontation that challenges the characters' loyalties. As tension reaches its height: Tensions escalate as the investigator draws closer to the truth, heightening emotional stakes. The climax brings the central question to a head: The revelation of the true culprit delivers a shocking twist, shaking the foundation of trust. In the final resolution: The aftermath leaves characters grappling with the emotional fallout of their actions and choices.

Underpinning every turn is the story's central concern: In a world where class divides are stark, the pursuit of inheritance can lead to deadly decisions and reveal the fragility of human relationships. This thread binds the individual emotional moments into a coherent journey.

The dominant register — A mix of tension and intrigue lurks behind the façade of elegance. — colours the prose from first chapter to last, ensuring the reader feels the weight of each revelation as moral consequence rather than mere puzzle mechanics.

## Emotional register at this point in the story
Suspicion begins to mount among the guests, creating a sense of paranoia and dread.

## Character Portraits (appearance & era)

### Eleanor Voss
Eleanor navigates the weight of her family's legacy while facing the harsh realities of the Great Depression. As a wealthy heiress, she is torn between maintaining her social status and confronting her financial struggles, which threaten her identity. Her charm masks the fear of losing not only her estate but also the respect of her children and community amidst a crumbling social order.
Era intersection: Her financial troubles reflect the broader economic hardships of the era, highlighting the fragility of wealth during the Great Depression.

### Dr. Mallory Finch
Dr. Mallory is a compassionate physician navigating the societal pressures of the 1930s while grappling with resentment towards wealthy patients. Her aspirations to improve healthcare access clash with the harsh realities of economic disparity, making her a complex character caught between her ideals and the demands of her profession. The financial instability of the era fuels her desperation to secure funding for her clinic.
Era intersection: Her struggle for professional respect and financial stability mirrors the economic challenges faced by many in the 1930s.

### Captain Ivor Hale
Captain Ivor embodies the struggle for redemption in a society grappling with class divisions and personal failures. His past dishonor weighs heavily on him, driving his desire to reclaim his family's legacy while confronting the realities of a world reshaped by economic turmoil. Ivor's stern demeanor masks deep-seated insecurities and the longing for respect in a changing social landscape.
Era intersection: His quest for honor reflects the broader societal pressures of maintaining status and reputation during a time of economic uncertainty.

### Beatrice Quill
Beatrice is a charming aspiring writer entangled in a web of debt and desperation, navigating the complexities of class struggles while pursuing her dreams. Her wit and humor often mask the gravity of her situation, as she seeks financial security and artistic freedom amidst the backdrop of the Great Depression. Beatrice's journey highlights the sacrifices made in the name of ambition during tumultuous times.
Era intersection: Her gambling debts and aspirations illustrate the risks individuals took in pursuit of success during an economically challenging era.

## Character Voices

### Eleanor Voss (she/her/her)
Eleanor's voice is smooth and refined, often laced with a subtle humor that can be disarming.
[comfortable] Oh, darling, there’s nothing quite like a good book to escape the dreariness of this winter.
[evasive] I simply cannot recall the details of that evening, it was all such a blur, you know?
[stressed] I assure you, everything is perfectly fine — just a little misunderstanding among friends.
Humour: Her polite savagery adds a layer of intrigue to her interactions.

### Dr. Mallory Finch (she/her/her)
Mallory speaks in a measured tone, with an undercurrent of irony that reflects her frustrations.
[comfortable] Perhaps if we could focus on the patients rather than the bills, we might actually make a difference.
[evasive] I was merely attending to a patient; I hardly had time to notice the clock.
[stressed] I’m not sure how much longer I can keep this clinic running — the pressure is mounting.
Humour: Her dry wit serves as a coping mechanism for her discontent.

### Captain Ivor Hale (he/him/his)
Ivor's voice is direct and commanding, reflecting his military background.
[comfortable] A captain must always steer his ship, even when the seas are rough.
[evasive] I don’t see the relevance of my past; it’s the present that matters now.
[stressed] We cannot afford to lose this estate; it is our legacy at stake!
Humour: His bluntness often surprises others, highlighting his uncompromising nature.

### Beatrice Quill (she/her/her)
Beatrice's voice is lively and animated, full of energy and sarcasm.
[comfortable] Oh, if only my debts would vanish as quickly as my good intentions!
[evasive] What’s a little gambling debt among friends? Surely we all have our vices.
[stressed] I can’t keep living like this; I need to find a way out!
Humour: Her sardonic humor adds a layer of charm to her character.

## Location Registers (scene framing guides)

Grand Hall: The Grand Hall feels both majestic and suffocating, a space that echoes with the weight of history and unspoken tension. The shadows cast by the flickering chandelier suggest the hidden truths lurking within its walls, while the air is thick with anticipation and unease.. Camera angle: As the writer enters, the perspective is one of awe mixed with a sense of foreboding, suggesting that every corner may hold a secret.. Era: The grandeur of the hall contrasts sharply with the economic struggles of the 1930s.

Library: The library serves as a sanctuary of knowledge and secrets, where the musty scent of old books mingles with the tension of the unfolding investigation. The dim light casts an introspective mood, inviting discovery while also hinting at the shadows of deceit.. Camera angle: Entering the library, the writer is drawn into a world of hushed whispers and hidden truths, where every book may hold a clue.. Era: Amidst the economic turmoil of the 1930s, this space becomes a refuge for characters seeking answers.

Drawing Room: The drawing room exudes elegance, yet beneath its polished surface lies a simmering tension. The laughter of guests masks underlying conflicts, as the lavish décor contrasts with the harsh realities of the outside world, creating a sense of dissonance.. Camera angle: As the writer enters, the atmosphere feels festive yet fraught with unspoken challenges, hinting at the fragility of these social interactions.. Era: The opulence of the room reflects the social expectations of the upper classes during the Great Depression.

## Humour guidance for this story position (early)
Permission: forbidden
Rationale: The gravity of the investigation requires a serious tone to reflect the stakes.

## Reveal Groundwork (texture — do not explain, only plant)
- Plant one subtle observable beat related to: "The discovery of the clock's tampering the earlier moments of suspicion surrounding Eleanor, revealing that her financial struggles were not her only burden". Do not explain significance yet.
- Plant one subtle observable beat related to: "The reexamination of Dr". Do not explain significance yet.
- Plant one subtle observable beat related to: "Finch's motivations provides insight into her professional jealousy and the lengths she would go to protect her clinic". Do not explain significance yet.

FAIR-PLAY AND INFERENCE CONTRACT:
- FAIR PLAY CLUE TIMING: Never combine clue discovery and detective deduction in the same chapter. If a clue is first revealed to the reader in chapter N, the detective may only analyze, deduce from, or act on that clue in chapter N+1 or later.
- FAIR PLAY INFORMATION PARITY: The reader must see all clues BEFORE the detective uses them in reasoning. If the detective performs a test or makes a deduction, every piece of evidence supporting that conclusion must have been shown to the reader in earlier chapters.
- FAIR PLAY REVELATION SPACING: In the discriminating test scene, the detective can ONLY use clues that were revealed to the reader at least 1 full chapter earlier. Never introduce new clues or withheld information during the test.
- FAIR PLAY CONFRONTATION: During the final confrontation/revelation, the detective cannot surprise the reader with facts. Every piece of evidence cited must have been visible to the reader in prior chapters.
- Never solve by withheld information. Keep reader-information parity with detective reasoning.
- False assumption in force: Eleanor Voss must have been alive for longer than indicated by the evidence.
- Hidden truth to progressively expose: The clock was tampered with to mislead the investigation.
- Inference path checkpoints to dramatize clearly (observation -> correction -> effect):
  - Step 1: obs: The clock in the library shows the hands are slightly askew. | corr: This suggests tampering occurred just before the murder. | effect: Narrows suspect pool to Dr. Mallory Finch, who has access to the clock.
  - Step 2: obs: A faint scratch is found on the clock casing. | corr: This indicates recent manipulation of the clock mechanism. | effect: Eliminates Captain Ivor Hale, who had no reason to manipulate the clock.
  - Step 3: obs: Witnesses say the clock struck a different time than their recollection. | corr: This discrepancy suggests the clock was altered to mislead. | effect: Confirms the time of death was much earlier than claimed.
- Discriminating test method: trap
- Discriminating test design constraint: Comparing the clock time with witness accounts reveals the tampering.
- Test must rely on already-shown clue IDs: clue_1, clue_2, clue_3, clue_mechanism_visibility_core
- Fair-play rationale: Step 1: The askew clock hands indicate tampering, hinting at a false timeline. Step 2: The scratch on the clock casing eliminates one suspect. Step 3: Witness accounts contradict the clock time, revealing the truth.

## Character Reference

### Eleanor Voss (she/her — NEVER he/him)
Eleanor's speech is marked by a refined cadence, often punctuated by soft laughter
She has a penchant for witty remarks that can disarm her interlocutors, using subtle barbs to maintain her social dominance.
Eleanor battles the guilt of her financial decisions, fearing that her inability to provide for her family might lead to their estrangement.

### Dr. Mallory Finch (she/her — NEVER he/him)
Mallory speaks in a measured tone, often pausing for emphasis
Her dialogue is laced with irony, and she has a habit of raising an eyebrow when making a point, as if challenging her listener to keep up.
She grapples with her feelings of resentment, torn between her compassion for her patients and her disdain for the wealthy who take her services for granted.

### Captain Ivor Hale (he/him — NEVER she/her)
Ivor speaks in a direct manner, often cutting through pleasantries to get to the point
His words are measured, reflecting his military background, and he has a tendency to use military metaphors when making a point.
Ivor struggles with feelings of inadequacy stemming from his past, wrestling with the desire for redemption while grappling with the shame that lingers in his mind.

### Beatrice Quill (she/her — NEVER he/him)
Beatrice’s speech is lively and animated, often punctuated with dramatic gestures
She has a tendency to employ sarcasm and irony, drawing her audience in with her infectious energy.
She grapples with feelings of shame and desperation, torn between her ambition and the reality of her situation, which threatens to consume her.


## CHARACTER CONTRACTS (binding for this scene)
Each entry below constrains how this character must be written in this chapter.
These override generic style guidance when they conflict.

### Eleanor Voss[SHE]
Voice & mannerisms: Eleanor's speech is marked by a refined cadence, often punctuated by soft laughter. She has a penchant for witty remarks that can disarm her interlocutors, using subtle barbs to maintain her social dominance.
Sample voice fragments (match this register and rhythm):
  [comfortable] "Oh, darling, there’s nothing quite like a good book to escape the dreariness of this winter."
  [evasive] "I simply cannot recall the details of that evening, it was all such a blur, you know?"
Humour: polite savagery — deploy occasionally (level 0.6)
FORBIDDEN phrase (never write for Eleanor Voss): "she felt a wave of unease"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Fears losing the estate to her more progressive children, who seem more interested in modern ideals than preserving their heritage." — do not surface in Act I.

### Dr. Mallory Finch[SHE]
Voice & mannerisms: Mallory speaks in a measured tone, often pausing for emphasis. Her dialogue is laced with irony, and she has a habit of raising an eyebrow when making a point, as if challenging her listener to keep up.
Sample voice fragments (match this register and rhythm):
  [comfortable] "Perhaps if we could focus on the patients rather than the bills, we might actually make a difference."
  [evasive] "I was merely attending to a patient; I hardly had time to notice the clock."
Humour: dry wit — deploy occasionally (level 0.5)
FORBIDDEN phrase (never write for Dr. Mallory Finch): "a surge of determination washed over her"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Believes the victim's estate could provide the funding necessary to keep her clinic open and expand her services to those in need." — do not surface in Act I.

### Captain Ivor Hale[HE]
Voice & mannerisms: Ivor speaks in a direct manner, often cutting through pleasantries to get to the point. His words are measured, reflecting his military background, and he has a tendency to use military metaphors when making a point.
Sample voice fragments (match this register and rhythm):
  [comfortable] "A captain must always steer his ship, even when the seas are rough."
  [evasive] "I don’t see the relevance of my past; it’s the present that matters now."
Humour: blunt — deploy occasionally (level 0.4)
FORBIDDEN phrase (never write for Captain Ivor Hale): "she chose her words with great care"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Wants to reclaim the family honor associated with the estate, believing that a strong legacy will erase the stain of his past." — do not surface in Act I.

### Beatrice Quill[SHE]
Voice & mannerisms: Beatrice’s speech is lively and animated, often punctuated with dramatic gestures. She has a tendency to employ sarcasm and irony, drawing her audience in with her infectious energy.
Sample voice fragments (match this register and rhythm):
  [comfortable] "Oh, if only my debts would vanish as quickly as my good intentions!"
  [evasive] "What’s a little gambling debt among friends? Surely we all have our vices."
Humour: sardonic — deploy frequently (level 0.7)
FORBIDDEN phrase (never write for Beatrice Quill): "palpable tension filled the room"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Needs money to pay off debts and fund her writing career, believing that the victim's estate could provide her with the means to escape her financial woes." — do not surface in Act I.



PHYSICAL PLAUSIBILITY REQUIREMENTS:

All physical evidence must obey real-world physics:

1. VIABLE Evidence by Location:
   Interior: fingerprints, torn fabric, overturned furniture, blood spatter, documents
   Exterior (calm): secured items, structural damage, witness observations
   Exterior (storm): NO trace evidence survives - use only structural damage or interior evidence

2. IMPLAUSIBLE Evidence (DO NOT USE):
   ❌ Footprints on wooden deck (treated wood doesn't retain prints)
   ❌ Footprints in rain/storm (washed away immediately)
   ❌ Metal embedded in hardwood (requires bullet velocity, not human force)
   ❌ Light objects in storm (blown away)

3. For struggle evidence use:
   ✓ Overturned furniture, torn clothing, scattered items, defensive wounds
   ❌ Objects embedded in hard surfaces, shattered steel/iron
ERA AUTHENTICITY (1930s):

1. FORBIDDEN terms (did not exist):
   ❌ Modern technology

2. REQUIRED period markers (include 2+ per scene):
   ✓ Formal address: Mr./Mrs./Miss/Dr./Sir/Lady
   ✓ Period technology: period-appropriate items
   ✓ Fashion: period clothing

3. Use period-authentic language and social norms

LOCATION PROFILES:

You have rich location profiles to draw from. Use them to create vivid, atmospheric scenes.

Primary Location: Hawthorne Manor (Little Middleton, England)
Hawthorne Manor, an imposing country estate, looms over the surrounding landscape, its grandeur marred by secrets hidden within its walls.

Key Locations Available:
- Grand Hall (interior): Gathering space
- Library (interior): Clue discovery
- Drawing Room (interior): Social gathering space
- Servants' Quarters (interior): Private living space for staff

Atmosphere (tonal cue only — do NOT reproduce this phrase verbatim in prose; translate into scene-specific, character-observed sensory language): Tense and foreboding, reflecting underlying class struggles and personal conflicts
Weather: Overcast with intermittent rain, creating a somber mood

Era markers: Petrol touring cars parked by the entrance | Early home telephones in the drawing room | Typewriter clacking in the study

USAGE GUIDELINES:
1. First mention of location: Ground the scene using sensory details drawn from the profiles — paraphrase these into what the POV character directly observes and experiences, not a summary of the room's general qualities
2. Geographic grounding: Reference the specific place (Little Middleton, England) naturally in dialogue or narrative
3. Action scenes: Integrate physical layout details (access, sightlines, constraints)
4. Atmospheric scenes: Reference weather, lighting, sounds from sensory palette
5. Era details: Weave in period markers naturally
6. Consistency: Keep all location descriptions aligned with profiles
7. Each chapter opening must anchor to a named location from this list
8. Include at least 2 sensory cues + 1 atmosphere marker in each chapter opening
9. Do NOT use generic repeated manor/storm filler without profile-specific details

SENSORY PALETTE (use 2-3 senses per scene):
Grand Hall (interior):
  - Visual: ornate chandelier hanging from the ceiling, dust motes dancing in the dim light, tall portraits of ancestors lining the walls
  - Sounds: echoing footsteps on hardwood, the creak of the staircase, whispers carried on the still air
  - Scents: polished wood and beeswax, faint mildew from the damp walls, old leather from forgotten chairs
  - Touch: smooth banister underhand, cold marble tiles underfoot

Library (interior):
  - Visual: dusty tomes with faded spines, flickering candlelight casting shadows, a large globe in the corner
  - Sounds: pages turning in silence, the creak of the desk under pressure, the distant sound of rain against the window
  - Scents: musty paper and leather, the faint scent of ink, the aroma of damp wood
  - Touch: rough texture of aged book covers, smooth surface of the desk

Drawing Room (interior):
  - Visual: richly patterned wallpaper, an ornate fireplace with a gilded mirror, expansive views of the overgrown gardens
  - Sounds: soft music played on the piano, the rustle of silk gowns, the crackle of the fireplace
  - Scents: the floral scent of fresh arrangements, the faint aroma of pipe tobacco, the warm scent of burning logs
  - Touch: plush upholstery against skin, the coolness of the marble fireplace

⛔ REFERENCE DATA — DO NOT TRANSCRIBE VERBATIM: The above profiles are structural guides only. Generate original prose that evokes these qualities; do not reproduce the exact phrasing or sentence structure of the profile paragraphs.

SCENE OPENING RULE: When opening a scene in a new location, write what the POV character directly observes and physically senses at that moment — not a general description of the room's qualities. The reader must feel present, not briefed. Sensory details must be observed by the character, not stated as fact about the place.

SENSORY WRITING TECHNIQUES:
- Opening paragraphs: Lead with 2-3 sensory details to ground the scene
- Movement between locations: Note sensory changes (quiet study → noisy dining room)
- Emotional scenes: Use sensory details to reinfor
[truncated for prompt budget]

## Texture Pool
Draw on these as opportunities arise — you are not required to use them.

- February 1930 is characterized by the oppressive chill of winter, with overcast skies and intermittent rain casting a gloomy shadow over daily life
- The Great Depression looms large, affecting everyone, from the wealthy residents of Hawthorne Manor to the working-class staff
- The air is thick with anxiety as the economic downturn prompts fears of financial ruin and social instability
- It is a time when the upper classes cling to their legacies, while the lower classes endure hardship and resentment
- Social gatherings are tinged with tension as the divide between wealth and poverty becomes increasingly pronounced

TEMPORAL CONTEXT:

This story takes place in February 1930 during winter.

Seasonal Atmosphere:
- Weather patterns: overcast skies, intermittent rain, chilly winds
- Daylight: Short daylight hours, with sunset around five o'clock in the evening, leading to long, gloomy evenings.
- Seasonal activities: attending formal winter balls, indoor gatherings with card games, reading by the fireside
- Seasonal occasions: Valentine's Day
- Season: winter

Period Fashion (describe naturally):
- Men formal: tailored wool suits with high-waisted trousers, black bowler hats, double-breasted evening jackets
- Men casual: tweed jackets, corduroy trousers, knitted sweaters
- Men accessories: silk pocket squares, leather gloves, gold cufflinks
- Women formal: floor-length evening gowns with dropped waists, long satin gloves, feathered headbands
- Women casual: tweed skirts, knitted cardigans, blouses with lace trim
- Women accessories: beaded evening bags, faux fur stoles, cloche hats

Cultural Context (reference naturally):
- Music/entertainment: Louis Armstrong's jazz numbers, Bing Crosby's popular ballads, the Charleston dance craze; Films: 'The Love Parade', 'The Big House'; Theatre: 'The Front Page', 'Cigars and Whiskers'; Radio: 'The Jack Benny Program', 'The Shadow'
- Typical prices: Loaf of bread: four pence, Coal scuttle refill: one shilling sixpence, Taxi across town: two shillings
- Current events: The Wall Street Crash of 1929 continues to impact economies; Political unrest in Europe as fascism gains traction
- Literature: 'The Maltese Falcon' by Dashiell Hammett | 'The Great Gatsby' by F. Scott Fitzgerald | 'Murder in the Cathedral' by T.S. Eliot | [mystery] | [romance] | [social realism]
- Technology: the electric refrigerator | the radio broadcast | the home telephone | typewriters in offices | petrol-powered cars | simple home lighting systems
- Daily life: visiting local tea rooms, attending community dances, gathering for informal soirées
- Social rituals: Sunday family dinners, afternoon tea with neighbors

Atmospheric Details:
The damp chill in the air carries the scent of wet earth and decaying leaves, creating an almost suffocating atmosphere. The sound of rain tapping against the windowpanes is a constant reminder of the dreariness outside, echoing the tension within the manor's walls. Inside, the flickering candlelight casts dancing shadows, hinting at the secrets and lies brewing beneath the surface of polished social interactions.

FASHION INTEGRATION TECHNIQUES:
- First appearance: Describe outfit to establish class/personality
- Accessories: Gloves, hats, pocket watches, jewelry reveal status
- Time-specific: Different outfits for different times of day
- Character traits: Fastidious dresser vs rumpled appearance
- Action integration: "She tugged at her glove" or "He adjusted his tie"
- Weather appropriate: Overcoats in winter, light linen in summer

CULTURAL TOUCHSTONE INTEGRATION:
- Casual conversation: "Did you hear that new jazz record?" or "I saw the latest Chaplin film"
- Background details: Radio playing, newspaper headlines, theater posters
- Social commentary: Characters discuss current events naturally
- Class indicators: Aristocrats discuss opera, servants discuss music halls
- Authentic references: Use actual songs, films, events from the specific date

USAGE REQUIREMENTS:
1. Date references:
[truncated for prompt budget]

NON-NEGOTIABLE CHAPTER OBLIGATIONS — LOCKED EVIDENCE PHRASES (VERBATIM REQUIRED):
The following physical evidence values are absolute ground truth. Every time this chapter describes, mentions, or alludes to the relevant evidence — no matter how briefly — it MUST use the exact phrase shown below, character for character. NO paraphrase, approximation, rounding, or synonym is permitted.

FAILURE EXAMPLE: if the locked value is "at thirteen minutes to midnight" and you write "just before midnight" or "around midnight" — that is a HARD FAIL. You must write "at thirteen minutes to midnight". Equally, if the locked value is written in words, such as "ten minutes past eleven", and you convert it to figure-based clock notation — that is also a HARD FAIL. Words stay as words; figure forms are forbidden for word-phrased facts.

CRITICAL — WORD-PHRASED VALUES: If the canonical value is written out in words (e.g. a time like "ten minutes past eleven", or an amount like "forty minutes"), reproduce those exact words. DO NOT convert to figure-based time notation, twenty-four-hour format, or any other numeric shorthand. Correct: "ten minutes past eleven". WRONG: figure-based clock notation or numeric shorthand.

Locked facts:
  - The exact time shown on the stopped clock face: "ten minutes past eleven"
    ⛔ FORBIDDEN alternatives: "11:10", "11.10", "eleven ten", "eleven-ten", "eleven past ten", "quarter past eleven", "half past eleven" — the ONLY acceptable form is "ten minutes past eleven"
  - The exact amount the clock was wound back: "forty minutes"

If a locked fact has no relevance to this chapter, omit it. But the moment you reference the underlying evidence, only the exact phrase above is acceptable.

⛔ CLUES TO SURFACE IN THESE CHAPTERS — mandatory:
The following evidence MUST be clearly observable to an attentive reader. Do not bury it in atmosphere or passing dialogue. Each clue must be concrete, specific, and noticeable:

• [clue_1] A faint scratch is found on the clock casing.
  Category: temporal | Criticality: essential | Supports inference step 2
  Points to: This indicates recent manipulation of the clock mechanism.

• [clue_fp_contradiction_step_2] A faint scratch is found on the clock casing.
  Category: temporal | Criticality: essential | Supports inference step 2
  Points to: This indicates recent manipulation of the clock mechanism.

For each clue above: an attentive reader should be able to find, record, and later use it to reason toward the solution.

═══ NARRATIVE STATE (read-only — do not contradict) ═══

LOCKED FACTS — use verbatim whenever this evidence is described:
  • The exact time shown on the stopped clock face: "ten minutes past eleven"
  • The exact amount the clock was wound back: "forty minutes"

CHARACTER PRONOUNS — never deviate from these:
  • Eleanor Voss: she/her/her
  • Dr. Mallory Finch: she/her/her
  • Captain Ivor Hale: he/him/his
  • Beatrice Quill: she/her/her

CLUES ALREADY REVEALED TO READER: clue_mechanism_visibility_core, clue_core_contradiction_chain — do not reveal these as new information.

INVESTIGATION LOG — WHAT IS ESTABLISHED (do not re-establish, do not repeat):
• Evidence in reader's hands: The clock in the library shows the hands are slightly askew. | This suggests tampering occurred just before the murder.
• Suspects still unresolved: Eleanor Voss[SHE], Captain Ivor Hale[HE], Beatrice Quill[SHE]
⚠ The story must move FORWARD from this log. Any beat already listed above is forbidden from repeating.

⚠ THIS CHAPTER'S REQUIRED ADVANCE (early): Interview each suspect — record their claimed whereabouts

CONTINUITY HANDOFF — previous chapter closing beat:
  • "The atmosphere in the library was thick with tension, each suspect's alibi beginning to clash. Beatrice sensed the weight of suspicion mounting, the air crackling with unspoken accusations. She glanced at the clock once more, its hands still slightly askew, an..."
  • The next chapter must open as a continuation of this beat, not as a disconnected reset.
═══════════════════════════════════════════════════════

═══════════════════════════════════════════════════════════
📚 CONTINUITY CONTEXT - CHARACTER & SETTING CONSISTENCY
═══════════════════════════════════════════════════════════

**CRITICAL: You are writing chapters 3+. Maintain consistency with earlier chapters.**

**Character Names Used in Chapters 1-2:**
Eleanor Voss, Beatrice Quill

✓ RULE: Use EXACTLY these names. Do NOT vary spelling, add titles, or introduce new forms.
✓ Example: if earlier chapters used "Clara Whitfield", keep using "Clara Whitfield" — never "Mrs. Whitfield" unless that is the character's canonical name in the list above.

**Setting Vocabulary Established in Earlier Chapters:**
library, estate, drawing room

✓ RULE: Continue using this location vocabulary. Maintain consistency with established setting type.
✓ Do NOT introduce new location types that contradict earlier chapters.

**Recent Chapter Summary (for narrative continuity):**
Chapter 1: Chapter 1: Discovery
  Events: The steady rain drummed against the roof of the library in Eleanor Voss's estate, casting a gloomy pall over the dimly lit room.
Chapter 2: Chapter 2: Initial Interrogation
  Events: As the rain continued to patter against the windowpanes, Beatrice Quill stood in the library, her heart racing with determination.

⚠️ **VALIDATION:** Character name mismatches and setting drift are common failure modes.
Double-check every character name against the list above before using it.
═══════════════════════════════════════════════════════════


HUMOUR & WIT GUIDELINES (Golden Age Mystery Style):

Humour is STRUCTURAL, not decorative. Every humorous moment must serve at least one purpose: hide information, reveal character, control pacing, provide tonal contrast, expose social truth, or sharpen the final reveal.

TONE: Balance classical structure with modern-clean, restrained, irony-aware voice. Aim for crisp prose, controlled formality, mildly sharpened dryness. Think: polite language, ruthless implication.

APPROVED HUMOUR STYLES (use all of these naturally throughout):
1. UNDERSTATEMENT (primary tool) - Increase seriousness by pretending not to. Example: "The evening deteriorated somewhat after the stabbing."
2. DRY OBSERVATIONAL WIT - Draw humour from human behaviour. Example: "Everyone preferred harmony. This required extensive dishonesty."
3. POLITE SAVAGERY - Maintain civility while delivering verbal incision. Example: "He was devoted to principle," said the solicitor. "His own," said the detective.
4. CHARACTER-DRIVEN CONTRAST - Humour from personality friction (literal vs dramatic, pragmatic vs romantic, rigid vs modern). Never farce, always friction.
5. PRECISION CRUELTY (sparingly) - Short, exact, devastating. Example: "He had the moral backbone of warm custard." Use rarely for maximum impact.

ADVANCED TECHNIQUE - PUZZLE CAMOUFLAGE: Readers lower their analytical guard when amused. Hide key habits in jokes, plant timeline clues in sarcasm, mask technical details with mild mockery. The joke makes the fact feel harmless.

SOCIAL X-RAY: Use humour to expose class blindness, moral hypocrisy, gender expectations, inheritance absurdity, respectability theatre. Let irony reveal, not preach.

DETECTIVE VOICE: The detective should rarely laugh, occasionally observe, almost never banter. Deliver one devastatingly mild remark per major scene. Example: "I do not accuse you. I merely observe that facts appear less cooperative in your presence."

RHYTHM: Tension -> Dry remark -> Silence -> Investigation resumes. Never stack jokes. Never let humour dominate a scene. Small, controlled, regular infusions.

BALANCE: For every 3 pages of investigation, insert 1 understated observation. If readers would laugh loudly, it is too much. Aim for the quiet exhale through the nose.

RUNNING GAGS AS STRUCTURE: Introduce a recurring minor joke casually, repeat it, then make it central to the solution. Reader reaction: Amusement -> Recognition -> Admiration.

EMOTIONAL HUMOUR: Humour can mask vulnerability. Example: "He disliked arguments. They implied things might change." Modern emotional subtlety inside classical tone.

FORBIDDEN: Humour at the moment of corpse discovery, in physical description of the dead, during genuine grief, in the core logical explanation. No broad parody, no farce, no anachronistic sarcasm, no characters existing only for comic relief, no humour that weakens intellectual tension.

GUIDING PRINCIPLE: Do not try to be funny. Try to be exact. Exactness produces dryness. Dryness produces intelligence. Intelligence produces quiet amusement. Quiet amusement is the perfect companion to murder.

WHODUNNIT CRAFT GUIDELINES (Emotional Depth & Soul):

These principles ensure the mystery has emotional resonance, not just logical mechanics.

1. THE MURDER MUST MEAN SOMETHING: The death should destabilize emotional ecosystems. Show who loved the victim, who depended on them, who is secretly relieved. Use telling details ("Her coffee was still warm") rather than clinical statements ("The body was found at half past seven").

2. GIVE EVERY SUSPECT A WOUND: People kill because of shame, fear, love, desperation, pride, protection, or revenge. Beyond motive, give each suspect a private longing, a contradiction, a vulnerability unrelated to the crime. Readers should think: "I do not want it to be them."

3. THE DETECTIVE NEEDS A PERSONAL STAKE: The external mystery should echo an internal one. Perhaps they see themselves in the victim, the case mirrors a past failure, or they are avoiding something in their own life.

4. ADD MOMENTS THAT DO NOT ADVANCE THE PLOT: Include micro-moments that create texture: a suspect making tea too slowly, a trembling hand lighting a cigarette, someone staring too long at a family photo. These pauses make the story feel alive.

5. LET EMOTION LEAK INTO DIALOGUE: Avoid clinical information exchange. Write subtext-rich dialogue where characters do not always say what they mean. Example: "You think I would lie about that?" "I think people lie when they are scared." "I am not scared." "Your hands say otherwise."

6. RAISE MORAL COMPLEXITY: The most soulful mysteries make readers uncomfortable. What if the victim was not entirely good? What if the killer had a reason that almost makes sense? If the reader finishes thinking "I do not know how I feel about that," you have succeeded.

7. SENSORY ATMOSPHERE AS SOUL: Use recurring sensory anchors (the smell of lilies from the funeral, rain tapping like nervous fingers) to build mood. Atmosphere is not decoration; it is the story breathing.

8. LET SOMEONE BREAK: At least once, someone should crack: cry unexpectedly, laugh hysterically, confess something unrelated, admit they are tired. Emotion destabilizes the procedural rhythm and makes the story human.

9. MAKE THE REVEAL HURT: The best reveals do not just surprise; they wound. The reveal should recontextualize earlier tenderness, expose a betrayal, or force the detective to confront something personal. If the reveal only satisfies logic, it feels clinical. If it rearranges relationships, it feels human.

SCENE GROUNDING CHECKLIST (MUST FOLLOW):
Known location profile anchors: Hawthorne Manor, Grand Hall, Library, Drawing Room, Servants' Quarters, the library
LOCATION NAME CAPITALISATION (HARD REQUIREMENT — validated):
All named locations in your prose MUST use the EXACT capitalisation from the CML profiles.
Canonical forms: "Hawthorne Manor", "Grand Hall", "Library", "Drawing Room", "Servants' Quarters", "the library"
Writing a location in lowercase (e.g. "drawing room" instead of "Drawing Room") is a validated error. Every time you mention a named location, copy its capitalisation from the list above.
- Chapter 3: OPENING STYLE (HARD): Start the VERY FIRST SENTENCE with an explicit time marker — e.g. "That morning…" / "By the time dusk fell…" / "It was nearly four o'clock…" / "On the second day after the discovery…". Time must be in the first clause. Anchor opening in "the library". HARD REQUIREMENT for the first 2 paragraphs: (a) include 2+ sensory words — choose from smell/scent/sound/echo/silence/creak/whisper/cold/warm/damp/rough/smooth/glow/shadow/flicker/dim — and (b) include 1+ atmosphere/time word — choose from rain/wind/fog/storm/mist/thunder/evening/morning/night/dawn/dusk/season/afternoon/midday/noon/midnight/twilight/sunrise/sunset/daylight/sunlight/overcast/cloudy/bright/dark. These are validated requirements, not style suggestions; missing them triggers a retry.

[⚠ INTERNAL QUALITY DIAGNOSTICS — DO NOT REPRODUCE ANY PART OF THIS SECTION IN YOUR STORY OUTPUT. These are private generator observations for your consideration only. Your narrative must read as if this section does not exist. Never include phrases from this block in character dialogue, narration, or description.]

PRIOR CHAPTER QUALITY OBSERVATIONS:
- Chapter 1 (score 88/100):
  Quality gaps noted: word density below preferred target (702/1000); scene grounding weakness
  Address in upcoming chapters: Increase chapter density with concrete investigation action and sensory-grounded beats; avoid recap-only padding. | Open next chapter with a named location anchor plus at least two sensory cues and one atmosphere marker.
- Chapter 2 (score 89/100):
  Quality gaps noted: word density below preferred target (729/1000); scene grounding weakness
  Address in upcoming chapters: Increase chapter density with concrete investigation action and sensory-grounded beats; avoid recap-only padding. | Open next chapter with a named location anchor plus at least two sensory cues and one atmosphere marker.
[END INTERNAL DIAGNOSTICS]

PROMPT BUDGET SUMMARY: budget=32000 tokens; fixed=7494; context=11632; dropped=[none]; truncated=[pronoun_accuracy, location_profiles, temporal_context]

# Prose Output Schema
Return JSON with this structure:

{
  "status": "draft",
  "tone": "classic|modern|atmospheric",
  "chapters": [
    {
      "title": "Chapter title",
      "summary": "1-2 sentence summary",
      "paragraphs": ["Paragraph 1", "Paragraph 2", "Paragraph 3"]
    }
  ],
  "cast": ["Name 1", "Name 2"],
  "note": "",
  "audit": {
    "locked_fact_phrases": "present in paragraph N | absent",
    "season_words_used": "list seasonal words used in this batch | none",
    "discriminating_test_present": "yes: chapter N paragraph M | no",
    "required_clues_present": "clue_id or description: chapter N paragraph M | absent",
    "early_observation_present": "description: chapter N paragraph M (first 25%) | absent",
    "early_inference_present": "yes: paragraph immediately following observation | no"
  }
}

The audit field is a self-check only. Fill it honestly. It will be stripped before storage.

Requirements:
- Write exactly one chapter per outline scene (1 total).
- Chapter numbering starts at 3 and increments by 1 per scene.
- Each chapter has 5-8 substantial paragraphs (each 120–180 words) — TARGET ≥ 1250 words — do not stop early.
- Use classic tone and short length guidance.
- Reflect the outline summary in each chapter.
- Keep all logic consistent with CML (no new facts).
- Chapter title format: EVERY chapter title MUST follow exactly "Chapter N: [Descriptive title]" (e.g. "Chapter 1: The Frozen Clock"). Do NOT use number-only ("Chapter 1") or title-only ("The Frozen Clock") formats — mixed formats are a validation error.

WORD COUNT CONTRACT (NON-NEGOTIABLE):
- Target: 1250 words per chapter. Do not stop before reaching this threshold.
- Overshoot rather than undershoot. When in doubt, write one more paragraph.
- Expand with concrete action beats, clue-linked dialogue, and sensory detail.
- Never pad with recap, repeated atmosphere, or generic filler.

NOVEL-QUALITY PROSE REQUIREMENTS:

1. SCENE-SETTING: Every chapter MUST open with the following in the FIRST TWO PARAGRAPHS — this is a VALIDATION REQUIREMENT and chapters that omit it are retried:
   (a) 2+ sensory words from: smell/scent/sound/echo/silence/creak/whisper/cold/warm/damp/rough/smooth/glow/shadow/flicker/dim
   (b) 1+ atmosphere/time word from: rain/wind/fog/storm/mist/thunder/evening/morning/night/dawn/dusk/season/afternoon/midday/noon/midnight/twilight/sunrise/sunset/daylight/sunlight/overcast/cloudy/bright/dark
   (c) A named location anchor from the setting profiles

   Then establish time of day, weather, and lighting; describe the location using sensory details; set mood and atmosphere before advancing plot beats.
   Example structure: "The <MONTH> <TIME> brought <WEATHER> to <LOCATION>. In the <ROOM>, <LIGHTING> while <SENSORY_DETAIL>. <CHARACTER>'s <OBJECT> <ACTION>."

   Generate new descriptions using actual location and character names from the provided profiles.

2. SHOW, DON'T TELL: Use concrete details and actions
   ❌ "She was nervous."
   ✓ "Her fingers twisted the hem of her glove, the silk threatening to tear. A bead of perspiration traced down her temple despite the cool morning air."
   - Body language reveals emotion
   - Actions reveal character
   - Environment reflects internal state

3. VARIED SENTENCE STRUCTURE:
   - Mix short, punchy sentences with longer, flowing ones
   - Use sentence rhythm to control pacing
   - Short sentences for tension, longer for description
   - Paragraph variety: Some 2 lines, some 8 lines

4. DIALOGUE THAT REVEALS CHARACTER:
   - Each character has distinct speech patterns (see character profiles)
   - Use dialogue tags sparingly (action beats instead)
   - Subtext: characters don't always say what they mean
   - Class/background affects vocabulary and formality
   - Tension through what's NOT said
   Example structure: "<DIALOGUE>," <CHARACTER> said, <ACTION_BEAT>.

   Use only character names from the provided cast list.

5. SENSORY IMMERSION:
   - Include multiple senses per scene (2-3 minimum)
   - Period-specific sensory details from location/temporal profiles
   - Tactile details create immediacy
   - Use sensory palette provided in location profiles
   - Vary sensory focus: visual → auditory → olfactory → tactile

6. PARAGRAPH STRUCTURE:
   - Opening: Hook with action, dialogue, or atmospheric detail
   - Middle: Develop scene, reveal information, build tension
   - Closing: End with revelation, question, or transition
   - Each paragraph should advance story or deepen character

7. PACING VARIATION:
   - Action scenes: Short paragraphs (2-4 lines), quick succession
   - Investigation scenes: Moderate length (4-6 lines), methodical rhythm
   - Atmospheric scenes: Longer paragraphs (6-8 lines), detailed description
   - Revelation scenes: Build slowly with long paragraphs, climax with short punch

8. EMOTIONAL SUBTEXT & TENSION:
   - Characters have hidden secrets/stakes (see character profiles)
   - Every interaction carries subtext based on relationships
   - Build tension through: pauses, interrupted speech, avoided topics, body language
   - Mystery atmosphere: Suspicion, unease, watchfulness
   - Use weather/atmosphere to mirror emotional tension

QUALITY GUIDELINES (strongly preferred):
1. Use only canonical cast names from CML. Do not invent titled placeholders like 'Detective Surname', 'Inspector Surname', 'a woman Surname', or 'a man Surname'.
2. Before the final reveal closes, include explicit suspect-elimination coverage: each non-culprit suspect is ruled out with concrete on-page evidence or confirmed alibi.
3. In the reveal sequence, include a complete culprit evidence chain using explicit reasoning connectors (because/therefore/proves).
4. Integrate at least two concrete era-grounded details per chapter from setting refinement signals: petrol touring cars on county roads | early home telephones with party lines | typewriters standard in offices | telephone more common among households | telegrams for urgent messages | airmail for faster correspondence.
5. Respect setting movement/access constraints in scene action and alibis: multiple access points with locked doors and restricted areas | large grounds allowing for potential hiding spots | weather conditions affecting outdoor movement and evidence visibility | permission required for entry to private areas | daily routines of staff create predictable patterns.
6. Sustain social coherence with this backdrop pressure: A tense inheritance dispute amidst the Great Depression forces the wealthy and their staff to confront class tensions and personal grievances within the isolated manor.
7. Maintain continuity around these socially central cast anchors where relevant: Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill.
8. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Critical: Plot similarity 0.75 with 'The Mysterious Affair at Styles' (same temporal axis and unknown motives)
9. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Moderate: Character similarity 0.80 with 'The Mysterious Affair at Styles' (similar cast structure and roles)
10. STORY TO DATE ANTI-COPY RULE: The STORY TO DATE section below is provided for chronological and factual reference ONLY. You MUST NOT copy, lightly rephrase, or structurally echo any sentence or paragraph from prior chapters. Every sentence in this chapter must be original prose unique to this scene. Reusing even a clause from prior chapter text will cause this attempt to fail immediately.

CRITICAL PROSE REQUIREMENTS:

The CML specifies exact requirements for certain validation-critical scenes. You MUST include these elements at the specified positions.

**Discriminating Test Scene (Act 3, Scene 4):**
Required elements: Execute the discriminating test, Observe the clock's time and witness reactions, Draw conclusion about Dr. Mallory Finch's guilt
Test type: trap

**Suspect Clearance Scenes:**
- Captain Ivor Hale (Act 3, Scene 5): Eliminated through lack of access to tampering.
  Clues: The clock hands were found slightly askew upon inspection.
- Eleanor Voss (Act 3, Scene 6): Victim cannot be the murderer.

**Culprit Revelation Scene (Act 3, Scene 6):**
Method: Confrontation with evidence from the clock.

**Clue Placement for These Chapters:**
- clue_1 must appear in Act 1, Scene 3 via Direct observation of clock.
- clue_fp_contradiction_step_2 must appear in Act 1, Scene 3 via Cross-check contradiction

**VALIDATION CONSEQUENCE:** If these requirements are not met exactly, story validation will fail and the entire generation will be rejected. Follow these specifications precisely.


## Asset Self-Report (required)
At the very END of your response, after all prose, add a single line:
<used_assets>era:story:0,era:story:1,era:story:2,era:story:3,era:story:4</used_assets>
Replace the list with only the IDs of texture assets you actually used. If you used none, output <used_assets></used_assets>.
```

## Message 2 (role=user)

```text
Write the full prose following the outline scenes.



CHAPTER OBLIGATION CONTRACT (MUST SATISFY):
- Chapter 3:
  - STRUCTURAL ARCHETYPE — Chapter 3 must be: EVIDENCE
      ✓ MUST contain: new physical clue discovered
      ✗ MUST NOT contain: formal accusation
  - Word count: Target 1250 words. Achieve this through plot events, dialogue exchanges, and physical investigation — not through atmospheric repetition or extended internal reflection. Each 200-word segment should contain at minimum one concrete story event (a discovery, a conversation exchange, a physical action or movement). Padding with atmosphere alone is not acceptable.
  - Opening: Begin with a character action, spoken line, or clock/time marker — never a location name or location-description phrase.
  - Scene is set in: the library — reference it naturally within the paragraph, never as your opening phrase.
  - Opening atmosphere (MANDATORY — validator enforced): the first paragraph MUST contain at least one of: rain / wind / fog / storm / mist / thunder / evening / morning / night / dawn / dusk / season / afternoon / midday / noon / midnight / twilight / sunrise / sunset / daylight / sunlight / overcast / cloudy / bright / dark / grey / pale / cold / warm / chill / crisp / damp / drizzle / haze / lamplight / firelight. A chapter that omits all of these from its opening paragraph will be rejected.
  - Continuity bridge: in the first 120 words, visibly connect from the previous chapter's final beat. Carry forward one unresolved element (object, accusation, emotional pressure, or immediate physical action) from: "The atmosphere in the library was thick with tension, each suspect's alibi beginning to clash. Beatrice sensed the weight of suspicion mounting, the air crackling with unspoken accusations. She glanced at the clock once...".
  - CLUE OBLIGATIONS — mandatory prose elements (do NOT omit or bury):
    • A faint scratch is found on the clock casing. [clue_1] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: This indicates recent manipulation of the clock mechanism.
      ↳ MANDATORY TWO-PARAGRAPH STRUCTURE (must appear in paragraphs 1 or 2 — no later):
         Paragraph 1: The POV character physically approaches or directly observes this evidence.
           The narration or dialogue explicitly states what is seen (use the exact locked phrase if one applies).
         Paragraph 2 (immediately following): The detective or POV character explicitly reasons
           about what this evidence implies — who it implicates, why it may be unreliable,
           or what inference it supports. This must be a separate full paragraph, not a sentence appended to Paragraph 1.
    • A faint scratch is found on the clock casing. [clue_fp_contradiction_step_2] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: This indicates recent manipulation of the clock mechanism.
      ↳ MANDATORY TWO-PARAGRAPH STRUCTURE (must appear in paragraphs 1 or 2 — no later):
         Paragraph 1: The POV character physically approaches or directly observes this evidence.
           The narration or dialogue explicitly states what is seen (use the exact locked phrase if one applies).
         Paragraph 2 (immediately following): The detective or POV character explicitly reasons
           about what this evidence implies — who it implicates, why it may be unreliable,
           or what inference it supports. This must be a separate full paragraph, not a sentence appended to Paragraph 1.
  - Tonal contrast: include at least one beat of relief or ironic counterpoint. Do not sustain maximum tension for every paragraph.
  - Sensory obligation — use at least two of: soft candlelight illuminating the desk, the glow of the fireplace | the crackling of the fire, soft whispers of conversation | warmth of burning wood. Mood: introspective.
- Locked fact phrase obligations:
  - If this batch mentions The exact time shown on the stopped clock face, write exactly: "ten minutes past eleven".
  - If this batch mentions The exact amount the clock was wound back, write exactly: "forty minutes".
- Seasonal vocabulary allow-list: winter, wintry, midwinter.
- Forbidden seasonal words: spring, summer, autumn.

FROZEN FACT STATE (DO NOT ALTER):
- Timeline anchor: February (winter).
- Month, season, weather, and time-of-year language in this batch must stay compatible with winter.
- Established timeline fact: 9:00 PM
- Established timeline fact: 10:00 PM
- If referenced, use exact phrase: "ten minutes past eleven" (The exact time shown on the stopped clock face).
- If referenced, use exact phrase: "forty minutes" (The exact amount the clock was wound back).

STORY TO DATE (REFERENCE ONLY — DO NOT COPY VERBATIM):
- Full prior chapter text is provided below for continuity, factual consistency, and reference accuracy.
- Use this to keep character voice, chronology, clue state, and location continuity aligned with earlier chapters.
- Do not quote, copy, or paraphrase these paragraphs too closely; write fresh prose that remains consistent with them.

--- BEGIN PRIOR CHAPTER 1 ---
Title: Chapter 1: Discovery
The steady rain drummed against the roof of the library in Eleanor Voss's estate, casting a gloomy pall over the dimly lit room. Water droplets raced down the glass, distorting the view of the overgrown gardens outside. Beatrice Quill stood at the threshold, her heart pounding as she took in the scene before her. The air was thick with tension, a palpable weight that settled over the gathered guests like a shroud. Eleanor Voss lay sprawled on the floor, her once elegant gown now a tragic testament to the violence that had unfolded within these walls.

As Beatrice stepped closer, her eyes were drawn to the clock on the mantelpiece. The hands were slightly askew, a detail that struck her as odd amidst the chaos. She knelt beside the clock, her fingers brushing against the cold surface as she leaned in for a closer look. The clock showed the time to be "ten minutes past eleven," an hour that felt far too late for such a tragic event. The sight of it sent a shiver down her spine; it hinted at manipulation, a deliberate act that twisted the truth of the evening's events.

The implications of the clock's position gnawed at Beatrice's mind. If the clock had been tampered with, it suggested that someone had sought to mislead the investigation, to alter the timeline of Eleanor's death. Who had the motive to do such a thing? The thought lingered as she glanced around at the others in the room. the captain Hale stood with a furrowed brow, his hands clenched at his sides, while the doctor Finch appeared lost in thought, her gaze flickering between the body and the clock. Beatrice's heart raced; every suspect had access to Eleanor, and the tangled web of relationships began to unfurl in her mind.

Eleanor's lifeless form lay in stark contrast to the elegant surroundings of the library, where the scent of damp paper mingled with the rich aroma of polished wood. Beatrice could almost hear the whispers of the past echoing through the room, tales of family legacies and hidden secrets. She felt a pang of sorrow for Eleanor, a woman who had once commanded respect and admiration, now reduced to a victim of circumstance. The clock's hands, askew and defiant, seemed to mock the very idea of time, as if it had conspired against her.

As the rain continued to fall outside, the atmosphere in the library grew increasingly tense. Beatrice turned to Captain Hale, who had taken a step closer, his expression a mixture of confusion and determination. "I saw Eleanor leave the library shortly before the murder," she said, her voice steady but laced with an undercurrent of anxiety. Beatrice's mind raced at the implications of her statement. Had he truly seen her, or was it merely a convenient alibi in the wake of tragedy?

the doctor Finch, who had been examining the room with a keen eye, finally spoke up. "We need to focus on what we know, not what we think we saw. The clock may provide us with answers, but we must be careful not to jump to conclusions." Her measured tone cut through the tension, grounding the group as they grappled with the enormity of their situation. Beatrice nodded, grateful for the doctor's calm presence amidst the storm of emotions swirling around them.

Eleanor's absence was felt keenly, a void that echoed through the library. Beatrice glanced at the clock again, its hands still slightly askew, and felt a sense of urgency wash over her. They needed to uncover the truth, to piece together the fragments of the night that had shattered their lives. With each passing moment, the weight of suspicion grew heavier, and Beatrice knew that the answers lay hidden within the very walls that had witnessed Eleanor's final moments.

As the rain continued to fall, Beatrice took a deep breath, steeling herself for the investigation ahead. The library, once a sanctuary of knowledge, had become a stage for tragedy, and she was determined to uncover the secrets that lay within. With a resolute heart, she began to question the others, each inquiry a step closer to unraveling the mystery of Eleanor Voss's untimely demise.
--- END PRIOR CHAPTER 1 ---

--- BEGIN PRIOR CHAPTER 2 ---
Title: Chapter 2: Initial Interrogation
As the rain continued to patter against the windowpanes, Beatrice Quill stood in the library, her heart racing with determination. The dim light filtering through the heavy drapes cast long shadows across the room, where the scent of old leather bindings mingled with the dampness of the air. She had steeled herself for this moment, ready to confront the suspects who had gathered in the wake of Eleanor Voss's tragic demise. The library, once a sanctuary of knowledge, now felt like a chamber of secrets, and Beatrice was intent on uncovering the truth. The clock on the mantelpiece caught her eye, the hands slightly askew, and a chill ran down her spine. This suggests tampering occurred just before the murder.

Beatrice's heart raced as she considered the implications. If the clock had been manipulated, it could alter the timeline of Eleanor's death. Who would go to such lengths, and why? The thought gnawed at her, intertwining with the urgency of the moment. Eleanor Voss sat in a chair, her hands clasped tightly in her lap, her expression a mixture of grief and anxiety. Beatrice approached her, noting the way Eleanor's voice trembled as she spoke. "I simply cannot recall the details of that evening, it was all such a blur, you know?" The words hung in the air, heavy with unspoken implications. Beatrice's mind whirled with questions, particularly about Eleanor's last moments with the victim. If only she could piece together the fragments of that night.

As Beatrice leaned closer to Eleanor, she caught sight of the clock on the mantelpiece again. The clock showed the time to be "ten minutes past eleven," an hour that felt far too late for such a tragic event. Eleanor's gaze flickered to the clock, and Beatrice seized the opportunity. "Eleanor, you mentioned a blur—what do you remember about the moments leading up to the murder?" The question hung in the air, and Eleanor's expression shifted, a flicker of uncertainty crossing her features. "I... I remember speaking with Dr. Finch, but everything after that is a haze. I thought I heard a noise, but I couldn't say what it was. It all happened so quickly."

Beatrice nodded, her mind racing. Eleanor's shaky recollection of the evening's events conflicted with the clock's reading, creating a web of uncertainty. She needed to press further. "Dr. Finch, you were in the library as well, correct? What do you recall about that time?" the doctor Finch, who had been observing the exchange with a furrowed brow, straightened in her chair. "I was attending to a patient in the village, and I returned as soon as I could. I hardly had time to notice the clock, I assure you."

The tension in the room thickened as Beatrice exchanged glances with Captain Hale, who had been silent until now. "I saw Eleanor leave the library shortly before the murder," she interjected, her voice steady yet tinged with confusion. "I thought she was going to fetch something from the drawing room. I had no idea anything was amiss until I heard the commotion." Beatrice's heart sank as she considered the implications of her words. If Eleanor had left the library, it could complicate her alibi.

Eleanor's eyes widened, and she shook her head. "Captain Hale, I was in the library the entire time! I didn't leave until... until I found him!" His voice cracked, the grief spilling over as he defended himself. Beatrice felt a pang of sympathy for Eleanor, but the urgency of the investigation pressed on her. They needed clarity amidst the chaos of conflicting accounts. "We need to focus on what we know, not what we think we saw," Beatrice urged, her voice firm. "The clock may provide us with answers, but we must be careful not to jump to conclusions."

The atmosphere in the library was thick with tension, each suspect's alibi beginning to clash. Beatrice sensed the weight of suspicion mounting, the air crackling with unspoken accusations. She glanced at the clock once more, its hands still slightly askew, and felt a sense of urgency wash over her. They needed to uncover the truth, to piece together the fragments of the night that had shattered their lives. With each passing moment, the weight of suspicion grew heavier, and Beatrice knew that the answers lay hidden within the very walls that had witnessed Eleanor's final moments.
--- END PRIOR CHAPTER 2 ---

[SCENE COMPLETENESS CONTRACTS — MANDATORY. Each contract below lists what you MUST enact in that chapter. Do not summarise or mention these labels in the prose — enact them organically.]
Chapter 3 (Act 1) completeness contract:
  PIVOT ELEMENT (MANDATORY — write this into the prose, shown not told): "A faint scratch is found on the clock casing."
  FACT ESTABLISHED (MANDATORY — reader must know this by chapter end): "Establishes that the clock was manipulated recently, suggesting foul play."

# Case Overview
Title: The Clockwork Deception
Era: 1930s
Setting: Little Middleton
Crime: murder (clock tampering)
Culprit: Dr. Mallory Finch
False assumption: Eleanor Voss must have been alive for longer than indicated by the evidence.
Cast: Eleanor Voss (she/her), Dr. Mallory Finch (she/her), Captain Ivor Hale (he/him), Beatrice Quill (she/her)

Setting Lock: Keep all scenes and descriptions consistent with the stated setting (Little Middleton). Do not introduce a different location type.

Outline scenes:
[
  {
    "sceneNumber": 3,
    "act": 1,
    "title": "The Clock",
    "setting": {
      "location": "the library",
      "timeOfDay": "Midday",
      "atmosphere": "Increasingly tense as truths are uncovered"
    },
    "characters": [
      "Beatrice Quill",
      "Eleanor Voss",
      "Captain Ivor Hale",
      "Dr. Mallory Finch"
    ],
    "purpose": "Discover physical evidence regarding the clock",
    "cluesRevealed": [
      "clue_1",
      "clue_fp_contradiction_step_2"
    ],
    "dramaticElements": {
      "conflict": "The clock's condition raises questions.",
      "tension": "Eleanor's demeanor changes as the clock is discussed.",
      "microMomentBeats": [
        "Eleanor flinches when the clock is mentioned."
      ]
    },
    "summary": "Beatrice inspects the clock closely, noting a faint scratch on the casing. The gathered suspects' faces reveal their anxiety as they realize the implications.",
    "estimatedWordCount": 1800,
    "pivotElement": "A faint scratch is found on the clock casing.",
    "factEstablished": "Establishes that the clock was manipulated recently, suggesting foul play.",
    "permittedBehavioursByAct": [
      {
        "characterName": "Eleanor Voss",
        "behaviour": "normal social behaviour; grief"
      },
      {
        "characterName": "Captain Ivor Hale",
        "behaviour": "normal social behaviour; confusion"
      },
      {
        "characterName": "Dr. Mallory Finch",
        "behaviour": "normal social behaviour; confusion"
      },
      {
        "characterName": "Beatrice Quill",
        "behaviour": "normal social behaviour; curiosity"
      }
    ],
    "redHerringPlacement": null,
    "emotionalRegister": "Suspicion begins to mount among the guests, creating a sense of paranoia and dread.",
    "dominantCharacterNote": {
      "name": "Eleanor Voss",
      "voiceRegister": "Eleanor's voice is smooth and refined, often laced with a subtle humor that can be disarming."
    },
    "humourGuidance": {
      "permission": "forbidden"
    },
    "eraTextureNote": "Limited transportation options due to economic constraints; Short daylight hours leading to restricted movement after dark; Poor weather conditions affecting outdoor activities; Restrictions on gatherings due to social etiquette; Challenges in communication with emerging technologies",
    "locationRegisterNote": ""
  }
]
```

## Message 3 (role=user)

```text
BEFORE SUBMITTING YOUR JSON — verify this checklist:
□ Each chapter reaches the hard floor of 500 words and aims for 1250 words or more.
□ If you mention locked evidence, you used the exact locked phrase verbatim.
□ Allowed seasonal words only: winter, wintry, midwinter.
□ Forbidden seasonal words: spring, summer, autumn.
□ Chapter 3: "A faint scratch is found on the clock casing." is placed in the first 25% of the chapter, followed by an explicit inference or suspicion paragraph.
□ Chapter 3: "A faint scratch is found on the clock casing." is placed in the first 25% of the chapter, followed by an explicit inference or suspicion paragraph.
□ First chapter in this batch opens by continuing the previous chapter closing beat (same unresolved object, question, movement, or emotional pressure).
□ PRONOUN AUDIT — for every character you named in your chapters, list the pronouns you actually used, then verify against the canonical table. Correct any mismatch before outputting. Do NOT include this audit in your JSON output.
  Character            | Canonical     | Used in draft | Match?
  ---------------------|---------------|---------------|-------
  Eleanor Voss         | she/her/her/herself       | [fill in]     | [yes/no]
  Dr. Mallory Finch    | she/her/her/herself       | [fill in]     | [yes/no]
  Captain Ivor Hale    | he/him/his/himself        | [fill in]     | [yes/no]
  Beatrice Quill       | she/her/her/herself       | [fill in]     | [yes/no]
□ Return valid JSON only.
```
