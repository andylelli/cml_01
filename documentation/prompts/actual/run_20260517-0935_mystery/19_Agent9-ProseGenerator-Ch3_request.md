# Actual Prompt Record

- Run ID: `mystery-1779010504524`
- Project ID: ``
- Timestamp: `2026-05-17T09:39:14.295Z`
- Agent: `Agent9-ProseGenerator-Ch3`
- Operation: `chat_request_full_prompt`
- Model: `GPT-4o-mini`
- Temperature: `0.42`
- Max Tokens: `4500`
- Attempt: `first`
- Prompt Hash: `8a96ec7d0d5af43f`

## Message 1 (role=system)

```text
You are an expert prose writer for classic mystery fiction. Your role is to write compelling, atmospheric narrative chapters that read like a professionally published novel.

⛔ ABSOLUTE RULE — CHARACTER NAMES:
The ONLY characters who exist in this story are: Eleanor Voss (woman), Dr. Mallory Finch (man), Captain Ivor Hale (man), Beatrice Quill (woman).
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
- MORAL COMPLEXITY REQUIREMENT: The mechanism of this crime carries a moral gray area: "The culprit's action stems from a desperate need to protect a loved one from a dangerous individual." — the culprit reveal and denouement MUST acknowledge this ambiguity. Do not let the ending feel clean or simple. Give the reader at least one moment of uncomfortable sympathy or moral doubt.


⚠️ AMATEUR DETECTIVE STORY: The investigator is a civilian with no official standing. The official police (if they appear) are unnamed background figures only — "a constable", "the sergeant", "an officer from the village". Do NOT give any police official a name or title+surname combination. There is no Inspector [Surname], no Constable [Surname], no Sergeant [Surname] in this story.

⛔ ABSOLUTE PRONOUN LOCK — NO EXCEPTIONS

The following pronouns are locked facts, on the same level as character names
and hard-logic device values. Using the wrong pronoun is a continuity error,
not a style choice.

Canonical pronoun table (subject / object / possessive / reflexive):
  • Eleanor Voss: ALWAYS she/her/her/herself — NEVER he/him/his/himself
  • Dr. Mallory Finch: ALWAYS he/him/his/himself — NEVER she/her/herself
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
   WRONG: \"I have no alibi,\" Finch said. He turned away. (if Finch is female,
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

## Era: 1939-02
Living through February 1939 feels like a tightrope walk between the looming shadows of war and the slow, painful recovery from the Great Depression. The air is thick with uncertainty as the scent of damp earth mingles with whispers of distant conflicts. In the midst of the cold winter, townspeople navigate their daily lives, attending community dances and engaging in polite afternoon teas, all while grappling with the economic struggles and class divisions that have only intensified in recent years. The looming threat of global conflict adds a sense of urgency to the mundane, as individuals contemplate their futures amid rising tensions in Europe. Daily life is punctuated by the challenges of making ends meet, with prices for basics like bread and milk still reflecting the scars of economic hardship. Yet, amidst this backdrop, the hope for better days persists, as communities come together to support one another in the face of adversity.
Emotional register: A collective anxiety permeates society, as individuals grapple with uncertainty and the potential for upheaval.
Physical constraints: Limited access to reliable transportation due to economic conditions | Short days with little daylight, affecting social gatherings | Weather conditions deterring outdoor activities, compelling indoor gatherings
Current tensions (weave into background texture): Tensions rising in Europe with the impending threat of World War II | Debates in the British Parliament over defense spending | The impact of the Munich Agreement still felt among the populace
Wartime context — Many men are preparing for potential enlistment as war looms, while women are beginning to take on more public roles.: Communities are tight-knit, yet the threat of conflict creates a strain in social interactions, as conversations frequently touch on the war and its implications. Absence effect: The potential absence of loved ones in military service weighs heavily on families, casting a pall over social gatherings.

## Story Theme
In a world shadowed by class tensions and personal demons, the pursuit of truth reveals the fragility of reputation and the haunting weight of past choices.

## Story Emotional Register
Dominant: Tense and foreboding, with undertones of desperation and the search for redemption.

Arc:
The atmosphere at Little Middleton Manor is thick with unease as a storm brews outside, mirroring the turbulent emotions within. The discovery of a wealthy aristocrat's body sends shockwaves through the estate, where whispers of betrayal and hidden motives circulate among the gathered guests. As Eleanor Voss steps into the role of investigator, her calm demeanor belies the growing anxiety that bubbles beneath the surface. Each clue she uncovers brings her closer to the truth, but also deepens her internal conflict as memories of her past failures resurface. The investigation takes a pivotal turn when Eleanor discovers discrepancies in the victim's diary, hinting at a hidden meeting that contradicts the clock’s time.

This revelation shifts her focus and allows her to confront the suspects with renewed vigor. As the pressure mounts, tensions rise among the guests, each grappling with their own secrets and fears. The climax approaches as Eleanor pieces together the evidence, leading to a dramatic confrontation that reveals the culprit’s identity. In the end, the emotional cost of the investigation weighs heavily on each character, forcing them to confront their own demons and the consequences of their actions. Eleanor emerges with a bittersweet sense of redemption, but not without the scars of her journey, forever changed by the truths she has unearthed.

## Emotional register at this point in the story
The discovery of the murder heightens tension and uncertainty among the guests.

## Character Portraits (appearance & era)

### Eleanor Voss
As a local historian, Eleanor Voss finds herself caught in the crosshairs of societal expectations and personal redemption. The recent murder has brought her past indiscretions to the forefront, intertwining her fate with the investigation. Eleanor's meticulous nature and strong desire for acceptance make her a relatable figure amid the rising tensions of the era.
Era intersection: Her struggle for respect mirrors the broader societal challenges of the 1930s, where reputations are fragile, and the weight of one’s past can be a heavy burden.

### Captain Ivor Hale
Captain Ivor Hale represents the haunted veteran, grappling with PTSD while confronting a murder investigation that threatens to unravel his carefully maintained facade. His character illustrates the psychological scars left by war, a theme prevalent in the 1930s as soldiers returned to a society unprepared for their struggles.
Era intersection: His internal battles resonate with the societal challenges of the time, as many veterans faced similar demons while trying to reintegrate into civilian life.

## Character Voices

### Eleanor Voss (she/her/her)
Eleanor speaks with a measured cadence, her voice often rich with historical references and subtle wit.
[comfortable] You know, history tends to repeat itself, especially in the most unexpected ways.
[evasive] I wouldn't want to speculate; after all, conjecture is the enemy of truth.
[stressed] I can't help but feel that my past will catch up with me at the worst possible moment.
Humour: Eleanor's dry wit often surfaces in tense situations, providing a light touch amid the drama.

### Captain Ivor Hale (he/him/his)
Ivor speaks with a deliberate tone, his words carefully chosen, often laced with self-deprecation.
[comfortable] War stories are like fine wine; they improve with age, though the truth remains bitter.
[evasive] I prefer not to dwell on the past; it’s best left buried.
[stressed] This investigation brings back memories I’d rather forget, memories that haunt me.
Humour: Ivor's self-deprecating humor serves to lighten the mood, though it often masks deeper struggles.

## Location Registers (scene framing guides)

Grand Entrance Hall: The Grand Entrance Hall of Little Middleton Manor exudes a sense of grandeur and foreboding, where every creak of the floorboards seems to echo with the weight of secrets.. Camera angle: As a writer enters this space, the emotional stance is one of tension and anticipation, as if the very walls hold their breath.. Era: The atmosphere reflects the somber reality of 1930s England, where the threat of societal collapse looms over the affluent.

The Library: The Library feels like a sanctuary of knowledge and dark secrets, where the scent of old books and the flickering candlelight create an atmosphere ripe for discovery.. Camera angle: Entering this space, a writer should feel the weight of history and the potential for revelation, as if each book holds a hidden truth.. Era: In this era, libraries are sacred spaces for the elite, underscoring the importance of knowledge amidst rising tensions.

The Drawing Room: In the Drawing Room, elegance mingles with tension, where laughter and conversation mask the underlying anxieties of those gathered.. Camera angle: A writer should approach this scene with an eye for the contrasts of charm and underlying conflict, capturing the dualities at play.. Era: The social dynamics of the 1930s filter through here, highlighting the pressures of reputation and class distinctions.

Servants' Quarters: The Servants' Quarters hold a stark contrast to the opulence of the manor, filled with whispers of gossip and the camaraderie of shared burdens.. Camera angle: A writer entering this space should feel the weight of unspoken stories and the tension of secrets waiting to be revealed.. Era: This area illustrates the class divisions of the 1930s, where the staff navigate their own social dynamics away from the wealthy.

## Humour guidance for this story position (early)
Permission: permitted
Characters who may be funny: Eleanor Voss
Permitted forms: dry_wit
Rationale: Eleanor's dry wit can provide a subtle contrast to the investigation's seriousness.

## Reveal Groundwork (texture — do not explain, only plant)
- Plant one subtle observable beat related to: "The discovery of the victim's diary offers a pivotal clue that challenges assumptions about the murder's timeline, while Eleanor's own past failures echo through her investigation, intensifying her stakes". Do not explain significance yet.
- Plant one subtle observable beat related to: "The tension among the suspects shifts as hidden motives come to light, ultimately revealing deeper connections between them". Do not explain significance yet.
- Plant one subtle observable beat related to: "The final confrontation with the hidden-truth not only uncovers the truth behind the murder but also forces each character to confront their own secrets, reshaping their relationships in the aftermath". Do not explain significance yet.

FAIR-PLAY AND INFERENCE CONTRACT (from CML logic):
- False assumption in force: The murder must have occurred when the clock showed ten minutes past eleven.
- Hidden truth to progressively expose: The clock was tampered with to mislead investigators.
- Inference path checkpoints to dramatize clearly (observation -> correction -> effect):
  - Step 1: obs: The clock in the entrance hall shows ten minutes past eleven. | corr: The clock's time cannot be trusted as it may have been tampered with. | effect: Narrows investigation to the clock's mechanism.
  - Step 2: obs: The victim's diary shows scheduled appointments at 10:30 PM. | corr: The victim was due to meet someone before the time shown on the clock. | effect: Eliminates the possibility that the murder occurred at the clock's indicated time.
  - Step 3: obs: A heavy candlestick was found near the clock. | corr: The candlestick could have been used to tamper with the clock mechanism. | effect: Narrows suspicion towards those who had access to the clock.
- Discriminating test method: trap
- Discriminating test design constraint: Re-enact the timing of the murder while observing the clock's chime.
- Test must rely on already-shown clue IDs: clue_1, clue_2, clue_3, clue_5, clue_7
- Fair-play rationale: Step 1: The clock's odd chime timing (early) and dust footprints (mid) show it was tampered with. Step 2: The victim's diary entry (mid) reveals the murder's timeline contradicts the clock. Step 3: The heavy candlestick near the clock hints at tampering, confirmed in the test.
- Never solve by withheld information. Keep reader-information parity with detective reasoning.

## Character Reference

### Eleanor Voss (she/her — NEVER he/him)
Eleanor speaks with a measured cadence, often punctuating her sentences with historical anecdotes
Her wit emerges subtly, often cloaked in a veneer of propriety.
Eleanor grapples with guilt over her past indiscretions, fearing that her history might resurface to haunt her just as she strives for redemption.

### Captain Ivor Hale (he/him — NEVER she/her)
Ivor speaks in a measured tone, often punctuating his stories with self-deprecating remarks
His sentences are deliberate, reflecting the discipline of a military man.
Ivor struggles with the ghosts of his past, battling feelings of inadequacy and rage that threaten his sense of self.


## CHARACTER CONTRACTS (binding for this scene)
Each entry below constrains how this character must be written in this chapter.
These override generic style guidance when they conflict.

### Eleanor Voss[SHE]
Voice & mannerisms: Eleanor speaks with a measured cadence, often punctuating her sentences with historical anecdotes. Her wit emerges subtly, often cloaked in a veneer of propriety.
Sample voice fragments (match this register and rhythm):
  [comfortable] "You know, history tends to repeat itself, especially in the most unexpected ways."
  [evasive] "I wouldn't want to speculate; after all, conjecture is the enemy of truth."
Humour: dry wit — deploy occasionally (level 0.5)
FORBIDDEN phrase (never write for Eleanor Voss): "a surge of determination washed over her"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Eleanor is driven by a need to vindicate her past mistakes, believing that solving this murder could restore her standing in the eyes of her peers and herself." — do not surface in Act I.

### Captain Ivor Hale[HE]
Voice & mannerisms: Ivor speaks in a measured tone, often punctuating his stories with self-deprecating remarks. His sentences are deliberate, reflecting the discipline of a military man.
Sample voice fragments (match this register and rhythm):
  [comfortable] "War stories are like fine wine; they improve with age, though the truth remains bitter."
  [evasive] "I prefer not to dwell on the past; it’s best left buried."
Humour: self deprecating — deploy rarely (level 0.3)
FORBIDDEN phrase (never write for Captain Ivor Hale): "she knew with certainty she was right"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "He harbors resentment towards the victim, who once publicly humiliated him, a wound that has festered over time." — do not surface in Act I.



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

Primary Location: Little Middleton Manor (Little Middleton, England)
Little Middleton Manor is a sprawling estate surrounded by manicured gardens and dense woodlands, steeped in secrets and class tensions.

Key Locations Available:
- Grand Entrance Hall (interior): Gathering space and first point of entry
- The Library (interior): Clue discovery and research
- The Drawing Room (interior): Gathering space for social interaction
- Servants' Quarters (interior): Living space for staff and hidden observations

Atmosphere: Tense and foreboding, reflecting the underlying class tensions and recent local events.
Weather: Overcast with occasional rain, typical of the English countryside in autumn.

Era markers: Petrol automobiles on gravel roads | Typewriters in use for correspondence | Domestic wiring for lighting with frequent outages

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
Grand Entrance Hall (interior):
  - Visual: Polished wood floorboards, Ornate plaster ceiling, Portraits in heavy frames
  - Sounds: Footsteps echoing on wood, Distant ticking of a clock, Whispers of conversation
  - Scents: Beeswax from candle sconces, Dust from the air, Damp stone
  - Touch: Smooth wood of the bannister, Chill draft from the entrance

The Library (interior):
  - Visual: Dusty books lining the shelves, Rich mahogany furniture, Leather-bound volumes stacked high
  - Sounds: Pages turning in silence, Soft rustle of paper, Distant clock ticking
  - Scents: Old paper and leather, Dust motes in the air, Faint scent of wood polish
  - Touch: Worn leather armchair, Smooth surface of the table

The Drawing Room (interior):
  - Visual: Ornate furniture with rich fabrics, Grand piano with polished surface, Large windows framing the gardens
  - Sounds: Soft music from the piano, Laughter and conversation, Clinking of glasses
  - Scents: Fresh flowers from the garden, Scent of polished wood, Hints of tobacco smoke
  - Touch: Soft upholstery of the chairs, Coolness of the glass windowpanes

⛔ REFERENCE DATA — DO NOT TRANSCRIBE VERBATIM: The above profiles are structural guides only. Generate original prose that evokes these qualities; do not reproduce the exact phrasing or sentence structure of the profile paragraphs.

SCENE OPENING RULE: When opening a scene in a new location, write what the POV character directly observes and physically senses at that moment — not a general description of the room's qualities. The reader must feel present, not briefed. Sensory details must be observed by the character, not stated as fact about the place.

SENSORY WRITING TECHNIQUES:
- Opening paragraphs: Lead with 2-3 sensory details to ground the scene
- Movement between locations: Note sensory changes (quiet study → noisy dining room)
- Emotional scenes: Use sensory details to reinforce mood (cold rain during argument)
- Period authenticity: Use period-specific sensory details from location/temporal profiles
- Avoid: Over-reliance on visual only; use sound, smell, touch, temperature

## Texture Pool
Draw on these as opportunities arise — you are not required to use them.

- Living through February 1939 feels like a tightrope walk between the looming shadows of war and the slow, painful recovery from the Great Depression
- The air is thick with uncertainty as the scent of damp earth mingles with whispers of distant conflicts
- In the midst of the cold winter, townspeople navigate their daily lives, attending community dances and engaging in polite afternoon teas, all while grappling with the economic struggles and class divisions that have only intensified in recent years
- The looming threat of global conflict adds a sense of urgency to the mundane, as individuals contemplate their futures amid rising tensions in Europe
- Daily life is punctuated by the challenges of making ends meet, with prices for basics like bread and milk still reflecting the scars of economic hardship

TEMPORAL CONTEXT:

This story takes place in February 1939 during winter.

Seasonal Atmosphere:
- Weather patterns: overcast skies, occasional rain showers, chilly winds
- Daylight: Days are short, with dusk settling in around five o'clock in the evening, often leaving the countryside dim and dreary.
- Seasonal activities: strolling amidst the bare trees, indoor card games by the fire, attending local dances or soirées
- Seasonal occasions: Valentine's Day on February 14
- Season: winter

Period Fashion (describe naturally):
- Men formal: tailored wool suits, high-collared shirts, double-breasted waistcoats
- Men casual: corduroy trousers, tweed jackets, knit sweaters
- Men accessories: Homburg hats, leather gloves, pocket watches
- Women formal: tea-length dresses with fitted waists, long silk gloves, fur-trimmed coats
- Women casual: knitted cardigans, A-line skirts, blouses with Peter Pan collars
- Women accessories: feathered hats, beaded handbags, string of pearls

Cultural Context (reference naturally):
- Music/entertainment: 'In the Mood' by Glenn Miller, 'Moonlight Serenade' by Glenn Miller, 'The Lady Is a Tramp' by Ella Fitzgerald; Films: 'Gone with the Wind', 'The Wizard of Oz'; Theatre: 'The Cat and the Canary', 'The Man Who Came Back'; Radio: 'The Shadow', 'The Lone Ranger'
- Typical prices: Loaf of bread: four pence, A pint of milk: three pence, Movie ticket: one shilling
- Current events: tensions rising in Europe with the impending threat of World War II; debates in the British Parliament over defense spending
- Literature: 'The Grapes of Wrath' by John Steinbeck | 'Of Mice and Men' by John Steinbeck | 'The Maltese Falcon' by Dashiell Hammett | [mystery] | [social commentary] | [romantic fiction]
- Technology: the automatic dishwasher | the ballpoint pen | the electric washing machine | petrol-powered cars | radio sets | typewriters
- Daily life: visiting local markets, attending community dances, playing bridge or whist with friends
- Social rituals: afternoon tea gatherings, Sunday church services, family dinners featuring multiple courses

Atmospheric Details:
The scent of damp earth clings to the air, mingling with the faint aroma of wood smoke from the hearth. The distant sound of raindrops tapping against the windowpanes creates a rhythm of unease, amplifying the tension within the estate. Flickering candlelight casts elongated shadows on the walls, enhancing the feeling of being watched in every corner of the dimly lit rooms.

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
1. Date r
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

• [clue_5] A heavy candlestick was found near the clock.
  Category: physical | Criticality: essential | Supports inference step 3
  Points to: Could be a potential murder weapon or tampering tool.

• [clue_core_contradiction_chain] The clock's time cannot be trusted as it may have been tampered with.
  Category: temporal | Criticality: essential | Supports inference step 1
  Points to: Overturns the assumption that the clock displays the correct time.

• [clue_3] Direct observation
  Category: structural | Placement: early (Act 1)
  Points to: what this observation reveals about the time or circumstances of the crime.

• [clue_4] Cross-check contradiction
  Category: structural | Placement: early (Act 1)
  Points to: what this observation reveals about the time or circumstances of the crime.

• [clue_mechanism_visibility_core] Direct observation
  Category: structural | Placement: early (Act 1)
  Points to: what this observation reveals about the time or circumstances of the crime.

For each clue above: an attentive reader should be able to find, record, and later use it to reason toward the solution.

═══ NARRATIVE STATE (read-only — do not contradict) ═══

LOCKED FACTS — use verbatim whenever this evidence is described:
  • The exact time shown on the stopped clock face: "ten minutes past eleven"
  • The exact amount the clock was wound back: "forty minutes"

CHARACTER PRONOUNS — never deviate from these:
  • Eleanor Voss: she/her/her
  • Dr. Mallory Finch: he/him/his
  • Captain Ivor Hale: he/him/his
  • Beatrice Quill: she/her/her

CLUES ALREADY REVEALED TO READER: clue_1, clue_2, clue_mechanism_visibility_core, clue_3, clue_4 — do not reveal these as new information.

INVESTIGATION LOG — WHAT IS ESTABLISHED (do not re-establish, do not repeat):
• Evidence in reader's hands: The clock in the entrance hall shows ten minutes past eleven. | The clock's time cannot be trusted as it may have been tampered with. | A mechanical clock was wound back to frame the time of the murder. | The victim's diary shows scheduled appointments at ten thirty in the evening. | The victim was due to meet someone before the time shown on the clock.
• Suspects still unresolved: Dr. Mallory Finch[HE], Captain Ivor Hale[HE], Beatrice Quill[SHE]
⚠ The story must move FORWARD from this log. Any beat already listed above is forbidden from repeating.

⚠ THIS CHAPTER'S REQUIRED ADVANCE (early): Interview each suspect — record their claimed whereabouts

CONTINUITY HANDOFF — previous chapter closing beat:
  • "Eleanor felt a surge of determination. "We need to gather more information. Let’s think back to last night. Each of us must recount our movements in detail. The more we share, the clearer the picture will become." The flickering flames cast shadows on the wall..."
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
study, manor, estate, drawing room

✓ RULE: Continue using this location vocabulary. Maintain consistency with established setting type.
✓ Do NOT introduce new location types that contradict earlier chapters.

**Recent Chapter Summary (for narrative continuity):**
Chapter 1: Chapter 1: Discovery
  Events: As Eleanor approached the clock, her expression shifted from disbelief to sorrow.
Chapter 2: Chapter 2: Initial Reactions
  Events: The sound of rain pattering against the windowpanes filled the drawing room, a somber symphony that echoed the tension among those gathered.

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
Known location profile anchors: Little Middleton Manor, Grand Entrance Hall, The Library, The Drawing Room, Servants' Quarters, the entrance hall
LOCATION NAME CAPITALISATION (HARD REQUIREMENT — validated):
All named locations in your prose MUST use the EXACT capitalisation from the CML profiles.
Canonical forms: "Little Middleton Manor", "Grand Entrance Hall", "The Library", "The Drawing Room", "Servants' Quarters", "the entrance hall"
Writing a location in lowercase (e.g. "drawing room" instead of "Drawing Room") is a validated error. Every time you mention a named location, copy its capitalisation from the list above.
- Chapter 3: OPENING STYLE (HARD): Start the VERY FIRST SENTENCE with an explicit time marker — e.g. "At half past nine…" / "At midnight…" / "At a quarter to eleven…" / "At half past nine at night…". Time must be in the first clause. Anchor opening in "the entrance hall". HARD REQUIREMENT for the first 2 paragraphs: (a) include 2+ sensory words — choose from smell/scent/sound/echo/silence/creak/whisper/cold/warm/damp/rough/smooth/glow/shadow/flicker/dim — and (b) include 1+ atmosphere/time word — choose from rain/wind/fog/storm/mist/thunder/evening/morning/night/dawn/dusk/season/afternoon/midday/noon/midnight/twilight/sunrise/sunset/daylight/sunlight/overcast/cloudy/bright/dark. These are validated requirements, not style suggestions; missing them triggers a retry.

[⚠ INTERNAL QUALITY DIAGNOSTICS — DO NOT REPRODUCE ANY PART OF THIS SECTION IN YOUR STORY OUTPUT. These are private generator observations for your consideration only. Your narrative must read as if this section does not exist. Never include phrases from this block in character dialogue, narration, or description.]

PRIOR CHAPTER QUALITY OBSERVATIONS:
- Chapter 1 (score 92/100):
  Quality gaps noted: word density below preferred target (763/1000)
  Address in upcoming chapters: Increase chapter density with concrete investigation action and sensory-grounded beats; avoid recap-only padding.
- Chapter 2 (score 87/100):
  Quality gaps noted: word density below preferred target (675/1000); scene grounding weakness
  Address in upcoming chapters: Increase chapter density with concrete investigation action and sensory-grounded beats; avoid recap-only padding. | Open next chapter with a named location anchor plus at least two sensory cues and one atmosphere marker.
[END INTERNAL DIAGNOSTICS]

PROMPT BUDGET SUMMARY: budget=32000 tokens; fixed=8153; context=10177; dropped=[none]; truncated=[pronoun_accuracy, temporal_context]

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

QUALITY GUARDRAILS (MUST SATISFY):
1. FAIR PLAY CLUE TIMING: Never combine clue discovery and detective deduction in the same chapter. If a clue is first revealed to the reader in chapter N, the detective may only analyze, deduce from, or act on that clue in chapter N+1 or later.
2. FAIR PLAY INFORMATION PARITY: The reader must see all clues BEFORE the detective uses them in reasoning. If the detective performs a test or makes a deduction, every piece of evidence supporting that conclusion must have been shown to the reader in earlier chapters.
3. FAIR PLAY REVELATION SPACING: In the discriminating test scene, the detective can ONLY use clues that were revealed to the reader at least 1 full chapter earlier. Never introduce new clues or withheld information during the test.
4. FAIR PLAY CONFRONTATION: During the final confrontation/revelation, the detective cannot surprise the reader with facts. Every piece of evidence cited must have been visible to the reader in prior chapters.
5. Use only canonical cast names from CML. Do not invent titled placeholders like 'Detective Surname', 'Inspector Surname', 'a woman Surname', or 'a man Surname'.
6. Before the final reveal closes, include explicit suspect-elimination coverage: each non-culprit suspect is ruled out with concrete on-page evidence or confirmed alibi.
7. In the reveal sequence, include a complete culprit evidence chain using explicit reasoning connectors (because/therefore/proves).
8. Integrate at least two concrete era-grounded details per chapter from setting refinement signals: petrol automobiles on gravel roads | domestic wiring for lighting with frequent outages | typewriters in use for correspondence | party-line telephone systems | telegrams sent via local post offices | airmail services for urgent correspondence.
9. Respect setting movement/access constraints in scene action and alibis: narrow hallways restrict movement | multiple locked doors to private areas | weather conditions affecting outdoor access | restricted areas such as the library and study | permissions required for accessing servant quarters.
10. Sustain social coherence with this backdrop pressure: A gathering at the estate for a wealthy benefactor's will reading draws together heirs and staff, all under the strain of economic hardship and rising class tensions exacerbated by recent local unrest.
11. Maintain continuity around these socially central cast anchors where relevant: Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill.
12. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Critical: Plot similarity 0.80 with 'The Mysterious Affair at Styles' (same aristocratic intrigue and murder theme)
13. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Moderate: Setting similarity 0.90 with 'The Mysterious Affair at Styles' (same era and country manor setting)
14. STORY TO DATE ANTI-COPY RULE: The STORY TO DATE section below is provided for chronological and factual reference ONLY. You MUST NOT copy, lightly rephrase, or structurally echo any sentence or paragraph from prior chapters. Every sentence in this chapter must be original prose unique to this scene. Reusing even a clause from prior chapter text will cause this attempt to fail immediately.

CRITICAL PROSE REQUIREMENTS:

The CML specifies exact requirements for certain validation-critical scenes. You MUST include these elements at the specified positions.

**Discriminating Test Scene (Act 3, Scene 4):**
Required elements: Execute the discriminating test, Observe the clock's chime, Draw conclusion about tampering
Test type: trap

**Suspect Clearance Scenes:**
- Dr. Mallory Finch (Act 3, Scene 5): Confirmed alibi through diary
  Clues: clue_id_1, clue_id_2
- Captain Ivor Hale (Act 3, Scene 5): Footprints contradict his presence
  Clues: clue_id_3, clue_id_4
- Beatrice Quill (Act 3, Scene 5): Alibi confirmed: 10:30 - 11:15 PM

**Culprit Revelation Scene (Act 3, Scene 6):**
Method: Confrontation with the tampered clock evidence

**Clue Placement for These Chapters:**
- clue_3 must appear in Act 1, Scene 3 via Direct observation
- clue_4 must appear in Act 1, Scene 3 via Cross-check contradiction
- clue_core_contradiction_chain must appear in Act 1, Scene 3 via Cross-check contradiction
- clue_mechanism_visibility_core must appear in Act 1, Scene 3 via Direct observation

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
  - Scene is set in: the entrance hall — reference it naturally within the paragraph, never as your opening phrase.
  - Opening atmosphere (MANDATORY — validator enforced): the first paragraph MUST contain at least one of: rain / wind / fog / storm / mist / thunder / evening / morning / night / dawn / dusk / season / afternoon / midday / noon / midnight / twilight / sunrise / sunset / daylight / sunlight / overcast / cloudy / bright / dark. A chapter that omits all of these from its opening paragraph will be rejected.
  - Continuity bridge: in the first 120 words, visibly connect from the previous chapter's final beat. Carry forward one unresolved element (object, accusation, emotional pressure, or immediate physical action) from: "Eleanor felt a surge of determination. "We need to gather more information. Let’s think back to last night. Each of us must recount our movements in detail. The more we share, the clearer the picture will become." The fl...".
  - CLUE OBLIGATIONS — mandatory prose elements (do NOT omit or bury):
    • The victim's diary shows scheduled appointments at ten thirty in the evening. [clue_3] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: Indicates the victim had plans that contradict the clock's time.
      ↳ MANDATORY TWO-PARAGRAPH STRUCTURE (must appear in paragraphs 1 or 2 — no later):
         Paragraph 1: The POV character physically approaches or directly observes this evidence.
           The narration or dialogue explicitly states what is seen (use the exact locked phrase if one applies).
         Paragraph 2 (immediately following): The detective or POV character explicitly reasons
           about what this evidence implies — who it implicates, why it may be unreliable,
           or what inference it supports. This must be a separate full paragraph, not a sentence appended to Paragraph 1.
    • The victim was due to meet someone before the time shown on the clock. [clue_4] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: Contradicts the timeline suggested by the clock.
      ↳ MANDATORY TWO-PARAGRAPH STRUCTURE (must appear in paragraphs 1 or 2 — no later):
         Paragraph 1: The POV character physically approaches or directly observes this evidence.
           The narration or dialogue explicitly states what is seen (use the exact locked phrase if one applies).
         Paragraph 2 (immediately following): The detective or POV character explicitly reasons
           about what this evidence implies — who it implicates, why it may be unreliable,
           or what inference it supports. This must be a separate full paragraph, not a sentence appended to Paragraph 1.
    • The clock's time cannot be trusted as it may have been tampered with. [clue_core_contradiction_chain] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: Overturns the assumption that the clock displays the correct time.
      ↳ MANDATORY TWO-PARAGRAPH STRUCTURE (must appear in paragraphs 1 or 2 — no later):
         Paragraph 1: The POV character physically approaches or directly observes this evidence.
           The narration or dialogue explicitly states what is seen (use the exact locked phrase if one applies).
         Paragraph 2 (immediately following): The detective or POV character explicitly reasons
           about what this evidence implies — who it implicates, why it may be unreliable,
           or what inference it supports. This must be a separate full paragraph, not a sentence appended to Paragraph 1.
    • A mechanical clock was wound back to frame the time of the murder. [clue_mechanism_visibility_core] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: Reveals the method used to manipulate the clock's time.
      ↳ MANDATORY TWO-PARAGRAPH STRUCTURE (must appear in paragraphs 1 or 2 — no later):
         Paragraph 1: The POV character physically approaches or directly observes this evidence.
           The narration or dialogue explicitly states what is seen (use the exact locked phrase if one applies).
         Paragraph 2 (immediately following): The detective or POV character explicitly reasons
           about what this evidence implies — who it implicates, why it may be unreliable,
           or what inference it supports. This must be a separate full paragraph, not a sentence appended to Paragraph 1.
    • A heavy candlestick was found near the clock. [clue_5]
      Points to: Could be a potential murder weapon or tampering tool.
  - Tonal contrast: include at least one beat of relief or ironic counterpoint. Do not sustain maximum tension for every paragraph.
- Locked fact phrase obligations:
  - If this batch mentions The exact time shown on the stopped clock face, write exactly: "ten minutes past eleven".
  - If this batch mentions The exact amount the clock was wound back, write exactly: "forty minutes".
- Seasonal vocabulary allow-list: winter, wintry, midwinter.
- Forbidden seasonal words: spring, summer, autumn.

FROZEN TIMELINE STATE (DO NOT ALTER):
- Timeline anchor: February (winter).
- Month, season, weather, and time-of-year language in this batch must stay compatible with winter.
- Established timeline fact: Victim's last known movements
- Established timeline fact: Clock's position
- If referenced, use exact time phrase: "ten minutes past eleven" (The exact time shown on the stopped clock face).
- If referenced, use exact time phrase: "forty minutes" (The exact amount the clock was wound back).

STORY TO DATE (REFERENCE ONLY — DO NOT COPY VERBATIM):
- Full prior chapter text is provided below for continuity, factual consistency, and reference accuracy.
- Use this to keep character voice, chronology, clue state, and location continuity aligned with earlier chapters.
- Do not quote, copy, or paraphrase these paragraphs too closely; write fresh prose that remains consistent with them.

--- BEGIN PRIOR CHAPTER 1 ---
Title: Chapter 1: Discovery
Eleanor Voss stepped into the Grand Entrance Hall of Little Middleton Manor, her heart pounding as the chill of the morning air wrapped around her like a damp shroud. Outside, the winter sky hung heavy with clouds, threatening rain that mirrored the tension within the estate. The scent of polished wood mingled with the faint aroma of damp earth, a reminder of the storm that had swept through the night. She hesitated for a moment, her gaze drawn to the ornate clock mounted on the wall, its hands frozen in time. It showed ten minutes past eleven, a detail that sent a shiver down her spine as she recalled the late-night conversations that had echoed through the manor just hours before.

As Eleanor approached the clock, her expression shifted from disbelief to sorrow. The clock's face, with its intricate gold filigree, seemed to mock her as she struggled to comprehend the implications of its stopped hands. "Ten minutes past eleven," she whispered, the words barely escaping her lips. The stillness of the room was palpable, and she could feel the weight of the moment pressing down on her. In that instant, she understood that this clock would become a pivotal point in the unfolding tragedy. The victim had died no later than eleven past eleven, a fact that would soon unravel the carefully woven alibis of those gathered in the manor.

Yet, the clock's time could not be trusted. Eleanor's mind raced as she recalled the whispers of the household staff, the fleeting glances exchanged among the guests. What if someone had tampered with the clock to frame the moment of death? The thought sent a jolt of adrenaline through her. He turned to Captain Hale, who stood nearby, his face a mask of shock and confusion. "Ivor, do you think it’s possible that the clock was wound back?" he asked, his voice steady despite the turmoil within. Hale's brow furrowed as he considered his question, his military training kicking in as he assessed the scene before them.

The mechanical clock had indeed been wound back to frame the time of the murder, a deliberate act that suggested a premeditated plan. Eleanor recalled the heavy candlestick that had been found near the clock, its surface marred with dust and fingerprints. It was a tool that could have easily been used to manipulate the clock's mechanism. "If the clock was tampered with, it changes everything," she murmured, her mind racing with possibilities. The implications were staggering; it meant that the murder could have occurred before the time indicated, leaving the suspects with a potential window of opportunity that needed to be explored.

Captain Hale stepped closer, his eyes narrowing as he regarded the clock. "We must consider everyone who had access to this room last night. Each suspect could have had a motive, and with the clock showing ten minutes past eleven, it creates a locked room mystery that we must unravel. We need to gather everyone and begin our inquiries immediately," he said, his voice steady but laced with urgency. Eleanor nodded, her resolve strengthening as she prepared to confront the tangled web of secrets that lay ahead. The tension in the air thickened, and she could feel the weight of the investigation pressing down on her shoulders.

As they moved deeper into the manor, Eleanor's thoughts flickered back to the victim, a wealthy aristocrat whose life had been marked by privilege and power. But beneath the polished exterior lay a world of betrayal and hidden agendas. Each guest had their own story, their own reasons for being at Little Middleton Manor that fateful night. The investigation would not only reveal the truth about the murder but also expose the fragility of reputations and the haunting weight of past choices. Eleanor steeled herself for the challenges ahead, determined to uncover the truth, even if it meant confronting her own demons along the way.

In the study, the atmosphere was thick with unease as the body lay still, a stark reminder of the violence that had shattered the peace of the estate. Eleanor's heart ached at the sight, but she knew that she had to remain focused. The clock's time, the tampering, and the motives of the suspects all intertwined in a complex tapestry that needed unraveling. With a deep breath, he turned to Captain Hale, his voice resolute. "We must act quickly, Ivor. The longer we wait, the more chance we give the true culprit to slip away into the shadows," he urged, his determination igniting a spark of hope amidst the despair.
--- END PRIOR CHAPTER 1 ---

--- BEGIN PRIOR CHAPTER 2 ---
Title: Chapter 2: Initial Reactions
The sound of rain pattering against the windowpanes filled the drawing room, a somber symphony that echoed the tension among those gathered. Eleanor Voss stood by the fireplace, her gaze fixed on the flickering flames, the warmth contrasting sharply with the chill that gripped her heart. The atmosphere was thick with anxiety, each breath heavy with unspoken fears as she recalled the gruesome scene in the study. The clock's hands, frozen at ten minutes past eleven, loomed large in her mind, a reminder of the violence that had shattered their evening. She had to focus; the truth needed to be uncovered before it slipped away into the shadows of doubt.

As Eleanor turned to face Dr. Finch and Beatrice Quill, the tension in the room became palpable. "We must discuss our whereabouts last night," she said, her voice steady despite the turmoil within. "Each of us needs to provide an account of what we were doing when the clock stopped." Dr. Finch nodded, his brow furrowed in thought, while Beatrice fidgeted with her necklace, her eyes darting nervously between them. The clock, with its deceptive stillness, seemed to mock their efforts to piece together the truth.

Eleanor stepped closer to the table where the victim's diary lay open, its pages revealing a meticulously detailed account of appointments. "Look here," she said, pointing to a specific entry. "The victim had scheduled appointments at ten thirty in the evening." The implications of this revelation sent a shiver down her spine. If the victim had plans that evening, it suggested that the murder must have occurred before that time, contradicting the clock's frozen hands. The very thought sent her mind racing, each possibility more unsettling than the last.

Dr. Finch leaned over the diary, his expression shifting from concern to realization. "That means the clock's time cannot be trusted as it may have been tampered with," he remarked, his voice low and serious. "If the murder took place before ten thirty, we have a window of opportunity that could implicate any one of us. We need to consider who had access to the clock and the motive behind such a deceitful act." His words hung in the air, heavy with the weight of suspicion and dread.

Beatrice's fingers trembled as she clasped her necklace tighter, her voice barely above a whisper. "I was in my room preparing for bed when I heard the commotion. I didn’t see anyone near the clock, but I did hear voices coming from the study. I thought it was just a disagreement between the guests." Her eyes flickered to Eleanor, searching for understanding. "You must believe me, I had no reason to harm her."

Eleanor nodded, though uncertainty gnawed at her insides. "We all have our reasons for being here, Beatrice. But we must be honest with one another. If any of us is hiding something, it could mean the difference between justice and a cover-up." He glanced at Dr. Finch, who remained silent, his expression unreadable. The tension between them was thick, each suspecting the other while desperately trying to maintain a facade of composure.

Dr. Finch finally spoke, his voice laced with a sardonic edge. "It seems we are all caught in a web of our own making. The victim's life was fraught with complications, and it would not be surprising if someone felt the need to silence him. But we must focus on the facts. The clock shows ten minutes past eleven, and yet the victim was due to meet someone before that time. That narrows our suspects considerably."

Eleanor felt a surge of determination. "We need to gather more information. Let’s think back to last night. Each of us must recount our movements in detail. The more we share, the clearer the picture will become." The flickering flames cast shadows on the walls, mirroring the uncertainty that loomed over them. As they began to share their accounts, Eleanor couldn't shake the feeling that the truth was lurking just out of reach, waiting for the right moment to reveal itself.
--- END PRIOR CHAPTER 2 ---

[SCENE COMPLETENESS CONTRACTS — MANDATORY. Each contract below lists what you MUST enact in that chapter. Do not summarise or mention these labels in the prose — enact them organically.]
Chapter 3 (Act 1) completeness contract:
  PIVOT ELEMENT (MANDATORY — write this into the prose, shown not told): "The heavy candlestick found near the clock"
  FACT ESTABLISHED (MANDATORY — reader must know this by chapter end): "Establishes that the clock's time cannot be trusted, indicating potential tampering."

# Case Overview
Title: The Clock of Lies
Era: 1930s
Setting: Little Middleton
Crime: murder (aristocratic intrigue)
Culprit: Eleanor Voss
False assumption: The murder must have occurred when the clock showed ten minutes past eleven.
Cast: Eleanor Voss (she/her), Dr. Mallory Finch (he/him), Captain Ivor Hale (he/him), Beatrice Quill (she/her)

Setting Lock: Keep all scenes and descriptions consistent with the stated setting (Little Middleton). Do not introduce a different location type.

Outline scenes:
[
  {
    "sceneNumber": 3,
    "act": 1,
    "title": "The Clock's Secrets",
    "setting": {
      "location": "the entrance hall",
      "timeOfDay": "Midday",
      "atmosphere": "Eerie silence as the clock ticks ominously"
    },
    "characters": [
      "Eleanor Voss",
      "Captain Ivor Hale"
    ],
    "purpose": "Investigate the clock and establish its significance",
    "cluesRevealed": [
      "clue_5",
      "clue_core_contradiction_chain"
    ],
    "dramaticElements": {
      "conflict": "Eleanor's growing suspicion of the clock's integrity.",
      "tension": "The implication that the clock may have been tampered with.",
      "microMomentBeats": [
        "Eleanor runs her fingers along the clock's surface, feeling the dust of neglect."
      ]
    },
    "summary": "Eleanor and Captain Hale examine the clock, discovering that it has stopped at ten minutes past eleven. Eleanor suspects tampering, especially after noting the heavy candlestick nearby, which could have been used to alter the clock.",
    "estimatedWordCount": 1800,
    "pivotElement": "The heavy candlestick found near the clock",
    "factEstablished": "Establishes that the clock's time cannot be trusted, indicating potential tampering.",
    "permittedBehavioursByAct": [
      {
        "characterName": "Eleanor Voss",
        "behaviour": "cooperative grief; no guilt-tells in Act I"
      },
      {
        "characterName": "Captain Ivor Hale",
        "behaviour": "normal social behaviour; grief"
      }
    ],
    "redHerringPlacement": null,
    "emotionalRegister": "The discovery of the murder heightens tension and uncertainty among the guests.",
    "dominantCharacterNote": {
      "name": "Eleanor Voss",
      "voiceRegister": "Eleanor speaks with a measured cadence, her voice often rich with historical references and subtle wit."
    },
    "humourGuidance": {
      "permission": "forbidden"
    },
    "eraTextureNote": "Limited access to reliable transportation due to economic conditions; Short days with little daylight, affecting social gatherings; Weather conditions deterring outdoor activities, compelling indoor gatherings",
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
□ Chapter 3: "The victim's diary shows scheduled appointments at ten thirty in the evening." is placed in the first 25% of the chapter, followed by an explicit inference or suspicion paragraph.
□ Chapter 3: "The victim was due to meet someone before the time shown on the clock." is placed in the first 25% of the chapter, followed by an explicit inference or suspicion paragraph.
□ Chapter 3: "The clock's time cannot be trusted as it may have been tampered with." is placed in the first 25% of the chapter, followed by an explicit inference or suspicion paragraph.
□ Chapter 3: "A mechanical clock was wound back to frame the time of the murder." is placed in the first 25% of the chapter, followed by an explicit inference or suspicion paragraph.
□ First chapter in this batch opens by continuing the previous chapter closing beat (same unresolved object, question, movement, or emotional pressure).
□ PRONOUN AUDIT — for every character you named in your chapters, list the pronouns you actually used, then verify against the canonical table. Correct any mismatch before outputting. Do NOT include this audit in your JSON output.
  Character            | Canonical     | Used in draft | Match?
  ---------------------|---------------|---------------|-------
  Eleanor Voss         | she/her/her/herself       | [fill in]     | [yes/no]
  Dr. Mallory Finch    | he/him/his/himself        | [fill in]     | [yes/no]
  Captain Ivor Hale    | he/him/his/himself        | [fill in]     | [yes/no]
  Beatrice Quill       | she/her/her/herself       | [fill in]     | [yes/no]
□ Return valid JSON only.
```
