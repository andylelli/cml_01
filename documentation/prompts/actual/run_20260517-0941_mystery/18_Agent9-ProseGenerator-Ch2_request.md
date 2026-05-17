# Actual Prompt Record

- Run ID: `mystery-1779010861918`
- Project ID: ``
- Timestamp: `2026-05-17T11:48:09.010Z`
- Agent: `Agent9-ProseGenerator-Ch2`
- Operation: `chat_request_full_prompt`
- Model: `GPT-4o-mini`
- Temperature: `0.42`
- Max Tokens: `4500`
- Attempt: `first`
- Prompt Hash: `4354a3e55b13759b`

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
- MORAL COMPLEXITY REQUIREMENT: The mechanism of this crime carries a moral gray area: "The suspect had a troubled past with the victim, raising questions about whether revenge or justice was the true motive." — the culprit reveal and denouement MUST acknowledge this ambiguity. Do not let the ending feel clean or simple. Give the reader at least one moment of uncomfortable sympathy or moral doubt.


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

## Era: 1932 January
Living through January 1932, the British countryside feels the biting chill of winter, where overcast skies loom heavily over the landscape. The Great Depression's grip tightens, as families cling to their dwindling fortunes, and the specter of unemployment haunts even the affluent. In Little Middleton, the elite navigate a world of opulence while feeling the weight of economic despair on their shoulders, with the laughter of social gatherings masking the tensions beneath. Each day is punctuated by the cold winds that whip through the estate, reminding residents of their precarious positions. As evening approaches, the damp air settles in, and conversations turn to whispered worries about the future—how long can the facade of wealth hold, and what will happen when it crumbles? This atmosphere of uncertainty seeps into daily life, where afternoon teas and formal dinners serve as both refuge and reminder of the fragility of their social standing.
Emotional register: A pervasive sense of anxiety and uncertainty permeates society, as the wealthy fear losing their status and the working class struggles for survival.
Physical constraints: Damp, cold weather limits outdoor gatherings and social events. | Short daylight hours lead to a sense of confinement and urgency. | Travel is restricted by economic factors and the rising costs of living.
Current tensions (weave into background texture): Unemployment rates continue to soar across Europe. | The British government enacts new tariffs to protect local industries. | Rising fascist parties in Germany cause concern in Britain.
Wartime context — Many veterans are struggling to reintegrate into society after the war, grappling with the psychological aftermath.: The impact of war service creates a complex social fabric, with respect for veterans coexisting with the stigma of their struggles. Absence effect: The absence of recognizable heroes among the elite leads to a search for new identities in a rapidly changing world.

## Season Lock (mandatory — derived from 1932 January)
Season: winter. Allowed vocabulary: winter, wintry, midwinter
Forbidden seasonal words — never use in narration, dialogue, or metaphor: spring, summer, autumn and their adjectival forms.
Every weather description, atmosphere, and time-of-year reference must be consistent with winter.

## Story Theme
In the midst of the Great Depression, the intersection of wealth, desire, and betrayal leads to a deadly conspiracy that reveals the fragility of social status.

## Story Emotional Register
Dominant: A tense exploration of ambition, betrayal, and the fragility of social status.

Arc:
In the opening, the atmosphere of Little Middleton Manor is thick with unease, as a storm rumbles outside and a wealthy host is found dead, the weight of the murder casting a dark shadow over the estate. The rising investigation reveals the intricate clockwork of deceit surrounding the crime, as Detective Eleanor Voss grapples with her personal connection to the victim amidst a web of suspicion and hidden motives. As she uncovers the first clues, initial false leads create emotional turmoil, revealing the cost of their secrets on each character's life. The mid-story pivot occurs when Eleanor discovers the clock's tampering, forcing her to reassess the timeline and the suspects involved; this revelation shifts the investigation's direction dramatically.

Another turn comes when previous statements are re-evaluated, and the emotional stakes heighten as relationships fray under pressure. The climax builds as Eleanor confronts the true culprit, forcing her to reckon with her own desires and moral compass against the backdrop of class struggles. In resolution, the emotional toll of the investigation weighs heavily on all characters, leaving Eleanor questioning the very foundations of her social world as she uncovers the truth. Each character faces the consequences of their choices, leaving a lingering sense of loss as they navigate the remnants of their fractured lives.

## Emotional register at this point in the story
A sense of foreboding hangs over the manor as a murder disrupts the facade of wealth.

## Character Portraits (appearance & era)

### Eleanor Voss
Eleanor Voss embodies the struggles of the upper class during the Great Depression, her charm masking financial insecurity. With the potential for inheritance dangling in front of her, she navigates both societal expectations and personal ambition, reflecting the era's tensions between wealth and moral choices.
Era intersection: Eleanor's desperation for a secure future clashes with the economic realities of the 1930s, making her a poignant representation of the social elite's fragility.

### Beatrice Quill
Beatrice Quill's nurturing demeanor masks her turbulent emotions, fueled by unrequited love and jealousy. As a member of the household staff, she navigates class divisions while grappling with her desires, embodying the personal stakes at play in a time of social upheaval.
Era intersection: Beatrice's struggles with her feelings and her position in the household underscore the class tensions of the 1930s, where personal desires clash with societal expectations.

## Character Voices

### Eleanor Voss (she/her/her)
Eleanor speaks with an elegant lilt, often using playful sarcasm to mask her deeper concerns.
[comfortable] Oh, darling, isn't this just the most delightful gathering? I do adore a good soirée, even if the weather is dreadful.
[evasive] Well, one mustn't dwell on such morbid matters, now should we? Let's focus on the champagne, shall we?
[stressed] I can't afford another scandal, not now! If only they understood the stakes I face.
Humour: Her dry wit often serves as a shield against the harsh realities she faces.

### Beatrice Quill (she/her/her)
Beatrice's soft voice carries a hint of wistfulness, reflecting her nurturing nature and inner turmoil.
[comfortable] The children bring such joy to my life; their laughter is my favorite melody.
[evasive] Oh, it’s nothing. Just a fleeting thought, really. Let's focus on the children.
[stressed] What if they find out? My heart can't bear the thought of losing everything.
Humour: Her gentle observations often reveal a deeper understanding of the human condition.

## Location Registers (scene framing guides)

The Drawing Room: The drawing room is a space of opulence laced with tension, where laughter rings hollow against the backdrop of whispered secrets. Guests navigate their social masks, but beneath the surface, the air is thick with suspicion and uncertainty.. Camera angle: Writers should focus on the contrasts between the room's grandeur and the underlying tensions that populate it.. Era: This room serves as a microcosm of the class struggles of the 1930s, where the wealthy gather yet feel the weight of their precarious status.

The Library: The library is a sanctuary of secrets, filled with dusty tomes and the scent of old leather. Here, the quiet is deceptive, masking the turmoil brewing within the household as guests seek knowledge while avoiding the truth.. Camera angle: Writers should capture the contrast between the library's calm atmosphere and the storm brewing outside, both literally and metaphorically.. Era: The library reflects the era's intellectual pursuits, yet it also symbolizes the tension of hidden truths waiting to be uncovered.

The Servants' Hall: The Servants' Hall buzzes with the energy of daily operations, yet it carries an undercurrent of anxiety. Staff members exchange furtive glances, aware that their fates hang in the balance of the household's shifting dynamics.. Camera angle: Writers should emphasize the tension and urgency in this space, capturing the struggles of those who serve the manor's elite.. Era: This space starkly contrasts with the opulence of the drawing room, representing the class divide of the 1930s.

The Formal Garden: The formal garden is a beautiful yet melancholic space, where vibrant flowers sway against the chill of the wind. It serves as a backdrop for both social gatherings and the undercurrents of intrigue that threaten to unfold.. Camera angle: Writers should portray the beauty of the garden while hinting at the darker emotions that linger just beneath the surface.. Era: The garden reflects the era's emphasis on appearances, yet it also symbolizes the hidden desires and jealousies within the household.

## Humour guidance for this story position (opening)
Permission: forbidden
Rationale: The gravity of the murder's discovery does not allow for humor.

FAIR-PLAY AND INFERENCE CONTRACT (from CML logic):
- False assumption in force: The murder occurred at a time when Beatrice Quill was with other staff.
- Hidden truth to progressively expose: The clock was tampered with to mislead the investigation.
- Inference path checkpoints to dramatize clearly (observation -> correction -> effect):
  - Step 1: obs: The clock in the library shows ten minutes past eleven when it is found stopped. | corr: The clock was manipulated to show a false time of death. | effect: Narrows the investigation to focus on the clock's tampering.
  - Step 2: obs: The victim's watch shows twenty minutes past eleven. | corr: The victim was likely killed after the time shown by the clock. | effect: Eliminates Beatrice Quill as having a solid alibi at that time.
  - Step 3: obs: Witness statements about their whereabouts during the supposed time of death conflict with the clock's time. | corr: The inconsistency reveals the clock was tampered with to create a false timeline. | effect: Narrows suspects down to those who had access to the clock.
- Discriminating test method: trap
- Discriminating test design constraint: Comparing the clock's mechanism to the victim's watch reveals that the clock was set back to mislead the investigation.
- Test must rely on already-shown clue IDs: clue_1, clue_2, clue_3, clue_5, clue_6, clue_mechanism_visibility_core
- Fair-play rationale: Step 1: The clock stopping at a specific time and the victim's watch showing a later time indicates tampering. Step 2: Witness statements about hearing the clock chime at a different time further supports this. Step 3: The mechanical examination reveals tampering, directly implicating Beatrice Quill.
- Never solve by withheld information. Keep reader-information parity with detective reasoning.

## Character Reference

### Eleanor Voss (she/her — NEVER he/him)
Eleanor speaks with a sophisticated lilt, often punctuating her sentences with playful sarcasm
She has a tendency to use charming anecdotes to deflect from serious topics, revealing her sharp intellect beneath the surface charm.
Eleanor wrestles with the moral implications of her ambitions. As she delves deeper into the investigation, she feels the weight of her aspirations clashing with her growing empathy for the victim's plight.

### Beatrice Quill (she/her — NEVER he/him)
Beatrice speaks softly and thoughtfully, often pausing to choose her words carefully
Her dialogue is laced with gentle observations and a hint of wistfulness, reflecting her nurturing nature and inner turmoil.
Beatrice battles with her feelings of jealousy and inadequacy, torn between her love for the fiancé and her loyalty to the victim. The emotional turmoil creates a conflict that threatens to push her towards the edge of desperation.


## CHARACTER CONTRACTS (binding for this scene)
Each entry below constrains how this character must be written in this chapter.
These override generic style guidance when they conflict.

### Eleanor Voss[SHE]
Voice & mannerisms: Eleanor speaks with a sophisticated lilt, often punctuating her sentences with playful sarcasm. She has a tendency to use charming anecdotes to deflect from serious topics, revealing her sharp intellect beneath the surface charm.
Sample voice fragments (match this register and rhythm):
  [comfortable] "Oh, darling, isn't this just the most delightful gathering? I do adore a good soirée, even if the weather is dreadful."
  [evasive] "Well, one mustn't dwell on such morbid matters, now should we? Let's focus on the champagne, shall we?"
Humour: dry wit — deploy occasionally (level 0.5)
FORBIDDEN phrase (never write for Eleanor Voss): "a surge of determination washed over her"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "The sudden death of a wealthy benefactor presents Eleanor with an opportunity. If the victim is out of the picture, she could inherit a substantial fortune, providing the financial stability she so desperately seeks." — do not surface in Act I.

### Beatrice Quill[SHE]
Voice & mannerisms: Beatrice speaks softly and thoughtfully, often pausing to choose her words carefully. Her dialogue is laced with gentle observations and a hint of wistfulness, reflecting her nurturing nature and inner turmoil.
Sample voice fragments (match this register and rhythm):
  [comfortable] "The children bring such joy to my life; their laughter is my favorite melody."
  [evasive] "Oh, it’s nothing. Just a fleeting thought, really. Let's focus on the children."
Humour: observational — deploy rarely (level 0.3)
FORBIDDEN phrase (never write for Beatrice Quill): "everyone could sense the atmosphere"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Driven by jealousy and the pain of unrequited love, Beatrice's feelings could easily lead her to a crime of passion, blurring the lines between loyalty and desire." — do not surface in Act I.



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
A sprawling estate with elegant architecture, hosting a blend of high society and diligent staff, set against the backdrop of the looming economic crisis.

Key Locations Available:
- The Drawing Room (interior): Clue discovery, gathering space
- The Library (interior): Clue discovery, private meetings
- The Servants' Hall (interior): Staff meetings, daily operations
- The Formal Garden (exterior): Clue discovery, social gatherings

Atmosphere: Tense, with underlying class tensions and the threat of economic instability
Weather: Overcast with occasional rain, typical of the British countryside in autumn

Era markers: Petrol touring cars parked along the gravel drive | Early telephones with party lines in the drawing room | Typewriters clacking in the study as staff prepare correspondence

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
The Drawing Room (interior):
  - Visual: Gilded mirrors reflecting candlelight, Rich tapestries hanging on the walls, Fine china displayed in a glass cabinet
  - Sounds: Laughter mingling with clinking teacups, Creaking floorboards beneath heavy footfalls, The crackle of the fire
  - Scents: Beeswax from candles, Freshly brewed tea, A hint of tobacco smoke
  - Touch: Soft velvet cushions, Cool marble of the fireplace mantle

The Library (interior):
  - Visual: Rows of dusty books, The glow of a brass lamp, Sunlight filtering through the window
  - Sounds: The rustle of pages turning, The soft creak of the chair, Distant thunder rumbling
  - Scents: Old leather and paper, Dust motes dancing in the light, Hints of tobacco
  - Touch: Smooth leather of book covers, Cool surface of the oak desk

The Servants' Hall (interior):
  - Visual: Faded wallpaper peeling at the edges, Scuffed wooden floors, Tattered curtains drawn tight
  - Sounds: Clattering of dishes, Muffled laughter, The crackle of the fire
  - Scents: Cooking aromas wafting from the kitchen, Wood smoke from the fireplace, Dusty air
  - Touch: Rough texture of the wooden table, Chill from the drafty windows

⛔ REFERENCE DATA — DO NOT TRANSCRIBE VERBATIM: The above profiles are structural guides only. Generate original prose that evokes these qualities; do not reproduce the exact phrasing or sentence structure of the profile paragraphs.

SCENE OPENING RULE: When opening a scene in a new location, write what the POV character directly observes and physically senses at that moment — not a general description of the room's qualities. The reader must feel present, not briefed. Sensory details must be observed by the character, not stated as fact about the place.

SENSORY WRITING TECHNIQUES:
- Opening paragraphs: Lead with 2-3 sensory details to ground the scene
- Movement between locations: Note sensory changes (quiet study → noisy dining room)
- Emotional scenes: Use sensory details to reinforce mood (cold rain during argument)
- Period authenticity: Use period-specific sensory detail
[truncated for prompt budget]

## Texture Pool
Draw on these as opportunities arise — you are not required to use them.

- Living through January 1932, the British countryside feels the biting chill of winter, where overcast skies loom heavily over the landscape
- The Great Depression's grip tightens, as families cling to their dwindling fortunes, and the specter of unemployment haunts even the affluent
- In Little Middleton, the elite navigate a world of opulence while feeling the weight of economic despair on their shoulders, with the laughter of social gatherings masking the tensions beneath
- Each day is punctuated by the cold winds that whip through the estate, reminding residents of their precarious positions
- As evening approaches, the damp air settles in, and conversations turn to whispered worries about the future—how long can the facade of wealth hold, and what will happen when it crumbles? This atmosphere of uncertainty seeps into daily life, where afternoon teas and formal dinners serve as both refuge and reminder of the fragility of their social standing.

TEMPORAL CONTEXT:

This story takes place in January 1932 during winter.

Seasonal Atmosphere:
- Weather patterns: overcast skies, occasional drizzle, cold winds
- Daylight: Days are short with sunlight fading around four o'clock in the afternoon, leaving the evenings dark and brooding.
- Seasonal activities: hunting parties in the countryside, indoor card games by the fire, evening tea gatherings
- Seasonal occasions: New Year's Day
- Season: winter

Period Fashion (describe naturally):
- Men formal: tailored wool morning coat, crisp white dress shirt, black bow tie
- Men casual: tweed jacket, corduroy trousers, knitted pullover
- Men accessories: walking cane, pocket watch, feathered hat
- Women formal: long evening gown with lace detailing, silk gloves, pearl necklace
- Women casual: tweed skirt and matching blazer, soft knitted sweater, faux fur stole
- Women accessories: cloche hat, beaded handbag, brooch

Cultural Context (reference naturally):
- Music/entertainment: 'Ain't She Sweet' by Milton Ager, 'My Blue Heaven' by Walter Donaldson, Bing Crosby's latest recordings; Films: 'The Front Page', 'The Smiling Lieutenant'; Theatre: 'The Royal Family', 'The Front Page'; Radio: BBC Radio's news broadcasts, variety shows featuring comedy skits
- Typical prices: Loaf of bread: four pence, Cinema ticket: six pence, Daily newspaper: three pence
- Current events: unemployment rates continue to soar across Europe; the British government enacts new tariffs to protect local industries
- Literature: 'Murder in the Cathedral' by T.S. Eliot | 'The Glass Key' by Dashiell Hammett | 'The Good Earth' by Pearl S. Buck | [mystery] | [social commentary novels] | [escapist fiction]
- Technology: the electric toaster gaining popularity in homes | advancements in radio broadcasting technology | the use of typewriters expanding in offices | telephones with party lines | cylinder phonographs for music | battery-operated radios
- Daily life: social visits over tea, participation in local sports like fox hunting, attending church services on Sundays
- Social rituals: afternoon tea served in the drawing room, formal dinner parties with multiple courses, weekly dances at the local hall

Atmospheric Details:
The smell of damp earth mingles with the scent of burning logs from the fireplace, creating a cozy yet oppressive atmosphere. The sound of rain pattering against the windowpanes, coupled with the distant echo of hounds baying, heightens the tension within the manor. A chill permeates the air, making the warmth of the drawing room feel both inviting and stifling, as whispers of discontent swirl among the guests.

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
- Class indicators: Aristocrats discuss o
[truncated for prompt budget]

NON-NEGOTIABLE CHAPTER OBLIGATIONS — LOCKED EVIDENCE PHRASES (VERBATIM REQUIRED):
The following physical evidence values are absolute ground truth. Every time this chapter describes, mentions, or alludes to the relevant evidence — no matter how briefly — it MUST use the exact phrase shown below, character for character. NO paraphrase, approximation, rounding, or synonym is permitted.

FAILURE EXAMPLE: if the locked value is "at thirteen minutes to midnight" and you write "just before midnight" or "around midnight" — that is a HARD FAIL. You must write "at thirteen minutes to midnight". Equally, if the locked value is written in words, such as "ten minutes past eleven", and you convert it to figure-based clock notation — that is also a HARD FAIL. Words stay as words; figure forms are forbidden for word-phrased facts.

CRITICAL — WORD-PHRASED VALUES: If the canonical value is written out in words (e.g. a time like "ten minutes past eleven", or an amount like "forty minutes"), reproduce those exact words. DO NOT convert to figure-based time notation, twenty-four-hour format, or any other numeric shorthand. Correct: "ten minutes past eleven". WRONG: figure-based clock notation or numeric shorthand.

Locked facts:
  - The exact time shown on the stopped clock face: "ten minutes past eleven"
    ⛔ FORBIDDEN alternatives: "11:10", "11.10", "eleven ten", "eleven-ten", "eleven past ten", "quarter past eleven", "half past eleven" — the ONLY acceptable form is "ten minutes past eleven"
  - The exact amount the clock was wound back: "forty minutes"
  - Time displayed on the victim's wristwatch at the time of discovery: "twenty minutes past eleven"
    ⛔ FORBIDDEN alternatives: "11:20", "11.20", "eleven twenty", "eleven-twenty", "eleven past twenty", "quarter past eleven", "half past eleven" — the ONLY acceptable form is "twenty minutes past eleven"

If a locked fact has no relevance to this chapter, omit it. But the moment you reference the underlying evidence, only the exact phrase above is acceptable.

⛔ CLUES TO SURFACE IN THESE CHAPTERS — mandatory:
The following evidence MUST be clearly observable to an attentive reader. Do not bury it in atmosphere or passing dialogue. Each clue must be concrete, specific, and noticeable:

• [clue_2] The clock was manipulated to show a false time of death.
  Category: temporal | Criticality: essential | Supports inference step 1
  Points to: This suggests the time displayed cannot be trusted.

For each clue above: an attentive reader should be able to find, record, and later use it to reason toward the solution.

═══ NARRATIVE STATE (read-only — do not contradict) ═══

LOCKED FACTS — use verbatim whenever this evidence is described:
  • The exact time shown on the stopped clock face: "ten minutes past eleven"
  • The exact amount the clock was wound back: "forty minutes"
  • Time displayed on the victim's wristwatch at the time of discovery: "twenty minutes past eleven"

CHARACTER PRONOUNS — never deviate from these:
  • Eleanor Voss: she/her/her
  • Dr. Mallory Finch: he/him/his
  • Captain Ivor Hale: he/him/his
  • Beatrice Quill: she/her/her

CLUES ALREADY REVEALED TO READER: clue_1 — do not reveal these as new information.

INVESTIGATION LOG — WHAT IS ESTABLISHED (do not re-establish, do not repeat):
• Evidence in reader's hands: The clock in the library shows ten minutes past eleven when it is found stopped.
• Suspects still unresolved: Eleanor Voss[SHE], Dr. Mallory Finch[HE], Captain Ivor Hale[HE]
⚠ The story must move FORWARD from this log. Any beat already listed above is forbidden from repeating.

⚠ THIS CHAPTER'S REQUIRED ADVANCE (opening): Discover the body, confirm the victim, establish the scene

CONTINUITY HANDOFF — previous chapter closing beat:
  • "The rain continued to winter outside, a relentless reminder of the storm brewing within the manor. Eleanor felt a sense of urgency wash over her. She had to act quickly, to piece together the fragments of this tragedy before the truth slipped away like the fle..."
  • The next chapter must open as a continuation of this beat, not as a disconnected reset.
═══════════════════════════════════════════════════════

═══════════════════════════════════════════════════════════
📚 CONTINUITY CONTEXT - CHARACTER & SETTING CONSISTENCY
═══════════════════════════════════════════════════════════

**CRITICAL: You are writing chapters 2+. Maintain consistency with earlier chapters.**

**Character Names Used in Chapters 1-1:**
Eleanor Voss, Beatrice Quill

✓ RULE: Use EXACTLY these names. Do NOT vary spelling, add titles, or introduce new forms.
✓ Example: if earlier chapters used "Clara Whitfield", keep using "Clara Whitfield" — never "Mrs. Whitfield" unless that is the character's canonical name in the list above.

**Setting Vocabulary Established in Earlier Chapters:**
library, drawing room, manor

✓ RULE: Continue using this location vocabulary. Maintain consistency with established setting type.
✓ Do NOT introduce new location types that contradict earlier chapters.

**Recent Chapter Summary (for narrative continuity):**
Chapter 1: Chapter 1: Discovery
  Events: Eleanor Voss stepped into the library of the manor, her heels clicking against the polished wooden floor, echoing in the tense silence.

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
Known location profile anchors: Little Middleton Manor, The Drawing Room, The Library, The Servants' Hall, The Formal Garden, the library of the manor
LOCATION NAME CAPITALISATION (HARD REQUIREMENT — validated):
All named locations in your prose MUST use the EXACT capitalisation from the CML profiles.
Canonical forms: "Little Middleton Manor", "The Drawing Room", "The Library", "The Servants' Hall", "The Formal Garden", "the library of the manor"
Writing a location in lowercase (e.g. "drawing room" instead of "Drawing Room") is a validated error. Every time you mention a named location, copy its capitalisation from the list above.
- Chapter 2: OPENING STYLE (HARD): Start the VERY FIRST SENTENCE with spoken dialogue — e.g. '"[words]," [Name] said/asked/replied/murmured.' The opening quote must be the first character on the line. Anchor opening in "the library of the manor". HARD REQUIREMENT for the first 2 paragraphs: (a) include 2+ sensory words — choose from smell/scent/sound/echo/silence/creak/whisper/cold/warm/damp/rough/smooth/glow/shadow/flicker/dim — and (b) include 1+ atmosphere/time word — choose from rain/wind/fog/storm/mist/thunder/evening/morning/night/dawn/dusk/season/afternoon/midday/noon/midnight/twilight/sunrise/sunset/daylight/sunlight/overcast/cloudy/bright/dark. These are validated requirements, not style suggestions; missing them triggers a retry.

[⚠ INTERNAL QUALITY DIAGNOSTICS — DO NOT REPRODUCE ANY PART OF THIS SECTION IN YOUR STORY OUTPUT. These are private generator observations for your consideration only. Your narrative must read as if this section does not exist. Never include phrases from this block in character dialogue, narration, or description.]

PRIOR CHAPTER QUALITY OBSERVATIONS:
- Chapter 1 (score 88/100):
  Quality gaps noted: word density below preferred target (703/1000); scene grounding weakness
  Address in upcoming chapters: Increase chapter density with concrete investigation action and sensory-grounded beats; avoid recap-only padding. | Open next chapter with a named location anchor plus at least two sensory cues and one atmosphere marker.
[END INTERNAL DIAGNOSTICS]

PROMPT BUDGET SUMMARY: budget=32000 tokens; fixed=6441; context=10035; dropped=[none]; truncated=[pronoun_accuracy, location_profiles, temporal_context]

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
- Chapter numbering starts at 2 and increments by 1 per scene.
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
8. Integrate at least two concrete era-grounded details per chapter from setting refinement signals: petrol touring cars on county roads | early telephones in homes with party lines | typewriters standard in offices | telegrams for urgent messages | aerial mail services for faster deliveries | increasing use of telephones over letters.
9. Respect setting movement/access constraints in scene action and alibis: large estate grounds creating natural barriers | multiple rooms with restricted access based on social hierarchy | weather conditions affecting outdoor movement and evidence visibility | restricted areas for staff only, including private quarters of the owner | daily schedules dictate movement patterns of guests and staff.
10. Sustain social coherence with this backdrop pressure: An inheritance dispute amidst the backdrop of the Great Depression brings together the wealthy and their staff in a tense manor setting, where class tensions and economic instability create a volatile atmosphere.
11. Maintain continuity around these socially central cast anchors where relevant: Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill.
12. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Critical: Plot similarity 0.75 with 'The Mysterious Affair at Styles' (both involve a single victim with an unknown motive and a temporal axis)
13. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Moderate: Character similarity 0.74 with 'The Sign of the Four' (similar character dynamics and roles)
14. STORY TO DATE ANTI-COPY RULE: The STORY TO DATE section below is provided for chronological and factual reference ONLY. You MUST NOT copy, lightly rephrase, or structurally echo any sentence or paragraph from prior chapters. Every sentence in this chapter must be original prose unique to this scene. Reusing even a clause from prior chapter text will cause this attempt to fail immediately.

CRITICAL PROSE REQUIREMENTS:

The CML specifies exact requirements for certain validation-critical scenes. You MUST include these elements at the specified positions.

**Discriminating Test Scene (Act 3, Scene 4):**
Required elements: Execute the discriminating test, Observe the clock's mechanism, Draw conclusion about guilt
Test type: mechanical examination

**Suspect Clearance Scenes:**
- Dr. Mallory Finch (Act 3, Scene 5): Shows medical records and alibi that clear him
  Clues: clue_1, clue_2
- Captain Ivor Hale (Act 3, Scene 5): Proves he was outside during the murder
  Clues: clue_1, clue_2

**Culprit Revelation Scene (Act 3, Scene 6):**
Method: Confrontation with evidence of tampering

**Clue Placement for These Chapters:**
- clue_2 must appear in Act 1, Scene 2 via Witness statement

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
- Chapter 2:
  - STRUCTURAL ARCHETYPE — Chapter 2 must be: FIRST_CONTACT
      ✓ MUST contain: at least two suspect interviews
      ✗ MUST NOT contain: physical evidence discovery
  - Word count: Target 1250 words. Achieve this through plot events, dialogue exchanges, and physical investigation — not through atmospheric repetition or extended internal reflection. Each 200-word segment should contain at minimum one concrete story event (a discovery, a conversation exchange, a physical action or movement). Padding with atmosphere alone is not acceptable.
  - Opening: Begin with a character action, spoken line, or clock/time marker — never a location name or location-description phrase.
  - Scene is set in: the library of the manor — reference it naturally within the paragraph, never as your opening phrase.
  - Opening atmosphere (MANDATORY — validator enforced): the first paragraph MUST contain at least one of: rain / wind / fog / storm / mist / thunder / evening / morning / night / dawn / dusk / season / afternoon / midday / noon / midnight / twilight / sunrise / sunset / daylight / sunlight / overcast / cloudy / bright / dark. A chapter that omits all of these from its opening paragraph will be rejected.
  - Continuity bridge: in the first 120 words, visibly connect from the previous chapter's final beat. Carry forward one unresolved element (object, accusation, emotional pressure, or immediate physical action) from: "The rain continued to winter outside, a relentless reminder of the storm brewing within the manor. Eleanor felt a sense of urgency wash over her. She had to act quickly, to piece together the fragments of this tragedy be...".
  - CLUE OBLIGATIONS — mandatory prose elements (do NOT omit or bury):
    • The clock was manipulated to show a false time of death. [clue_2] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: This suggests the time displayed cannot be trusted.
      ↳ MANDATORY TWO-PARAGRAPH STRUCTURE (must appear in paragraphs 1 or 2 — no later):
         Paragraph 1: The POV character physically approaches or directly observes this evidence.
           The narration or dialogue explicitly states what is seen (use the exact locked phrase if one applies).
         Paragraph 2 (immediately following): The detective or POV character explicitly reasons
           about what this evidence implies — who it implicates, why it may be unreliable,
           or what inference it supports. This must be a separate full paragraph, not a sentence appended to Paragraph 1.
  - Tonal contrast: include at least one beat of relief or ironic counterpoint. Do not sustain maximum tension for every paragraph.
  - Sensory obligation — use at least two of: Shadows deepening in the corners, The glow of a single lamp | The rustle of papers, Occasional footsteps outside | A hint of mildew. Mood: foreboding.
- Locked fact phrase obligations:
  - If this batch mentions The exact time shown on the stopped clock face, write exactly: "ten minutes past eleven".
  - If this batch mentions The exact amount the clock was wound back, write exactly: "forty minutes".
  - If this batch mentions Time displayed on the victim's wristwatch at the time of discovery, write exactly: "twenty minutes past eleven".
- Seasonal vocabulary allow-list: winter, wintry, midwinter.
- Forbidden seasonal words: spring, summer, autumn.

FROZEN TIMELINE STATE (DO NOT ALTER):
- Timeline anchor: January (winter).
- Month, season, weather, and time-of-year language in this batch must stay compatible with winter.
- Established timeline fact: Victim's last known activity
- Established timeline fact: Clock's last recorded time
- If referenced, use exact time phrase: "ten minutes past eleven" (The exact time shown on the stopped clock face).
- If referenced, use exact time phrase: "forty minutes" (The exact amount the clock was wound back).
- If referenced, use exact time phrase: "twenty minutes past eleven" (Time displayed on the victim's wristwatch at the time of discovery).

STORY TO DATE (REFERENCE ONLY — DO NOT COPY VERBATIM):
- Full prior chapter text is provided below for continuity, factual consistency, and reference accuracy.
- Use this to keep character voice, chronology, clue state, and location continuity aligned with earlier chapters.
- Do not quote, copy, or paraphrase these paragraphs too closely; write fresh prose that remains consistent with them.

--- BEGIN PRIOR CHAPTER 1 ---
Title: Chapter 1: Discovery
Eleanor Voss stepped into the library of the manor, her heels clicking against the polished wooden floor, echoing in the tense silence. Outside, the steady rain tapped against the windowpanes, creating a rhythmic backdrop to the chaos that had unfolded within these walls. The dim light filtering through the overcast sky cast long shadows across the room, where the scent of damp wood mingled with the faintest hint of tobacco smoke. It was a scene of disarray, with books scattered on the floor and a heavy air of despair hanging over the space.

As Eleanor moved deeper into the library, her gaze landed on the clock mounted on the wall. It showed ten minutes past eleven when it was found stopped. The hands were frozen in time, a stark reminder of the moment when life had been extinguished. The stillness of the clock seemed to mock the frantic energy that had consumed the household since the discovery of the body. Eleanor could feel her heart quicken as she approached it, the implications of this evidence weighing heavily on her mind.

The stopped clock in the library, frozen at ten minutes past eleven, suggested that the victim had met their end around that time. Eleanor's mind raced as she considered the implications. If the clock was accurate, it meant the murder had occurred just before the household had descended into chaos. Every suspect had access to the victim at that hour, and the thought sent a shiver down her spine. Who among them could have committed such a heinous act, and why? The questions swirled like the rain outside, relentless and unyielding.

Beatrice Quill stood frozen in the doorway, her eyes red from crying. Eleanor turned to her, searching for some clarity amidst the confusion. 'Beatrice, can you tell me what happened? How did you find her?' Her voice was steady, but the urgency behind her words was palpable.

'I—I was dusting the shelves,' Beatrice stammered, her voice barely above a whisper. 'I heard a noise, and when I came in, she was…' She trailed off, unable to finish the sentence. The pain in her eyes was evident, and Eleanor felt a pang of sympathy for the woman who had served the household for so long.

Eleanor stepped closer, her own heart heavy with the weight of the situation. 'Did you notice anything unusual before you found her? Any sounds, any visitors?' Beatrice shook her head, her hands trembling as she wrung her apron. 'No, it was all so quiet. I thought I was alone.'

The atmosphere in the library was thick with tension, the kind that made every breath feel like a betrayal. Eleanor glanced around, taking in the chaos. Books lay open on the floor, as if someone had been searching for something. 'Did anyone else come in here after you?' she pressed, her instincts as a detective kicking in.

'I don't know,' Beatrice replied, her voice cracking. 'I was in shock. I just… I just ran to find Captain Hale.'

Eleanor nodded, absorbing the information. Captain Hale had been the one to call him, the urgency in his voice unmistakable. 'We need to gather everyone who was here last night,' Eleanor said, her mind racing with the implications of what she had just learned. 'We need to understand their movements leading up to the murder.'

As Beatrice wiped her eyes, Eleanor's thoughts turned to the clock once more. If it was indeed accurate, it could provide a timeline that would either implicate or exonerate those present. She needed to examine it further, to understand how it had stopped at ten minutes past eleven, and what that meant for the investigation. The clock was a silent witness to the crime, and Eleanor was determined to uncover the truth hidden within its stillness.

The rain continued to winter outside, a relentless reminder of the storm brewing within the manor. Eleanor felt a sense of urgency wash over her. She had to act quickly, to piece together the fragments of this tragedy before the truth slipped away like the fleeting moments captured in time. 'Let’s gather everyone in the drawing room,' she instructed Beatrice firmly. 'We need to get to the bottom of this.'
--- END PRIOR CHAPTER 1 ---

[SCENE COMPLETENESS CONTRACTS — MANDATORY. Each contract below lists what you MUST enact in that chapter. Do not summarise or mention these labels in the prose — enact them organically.]
Chapter 2 (Act 1) completeness contract:
  PIVOT ELEMENT (MANDATORY — write this into the prose, shown not told): "Beatrice's shaky account of her whereabouts during the murder."
  FACT ESTABLISHED (MANDATORY — reader must know this by chapter end): "Establishes that Beatrice's alibi is questionable, as she was supposedly alone in the library."

# Case Overview
Title: The Clockwork Conspiracy
Era: 1930s
Setting: Little Middleton
Crime: murder (mechanical tampering)
Culprit: Beatrice Quill
False assumption: The murder occurred at a time when Beatrice Quill was with other staff.
Cast: Eleanor Voss (she/her), Dr. Mallory Finch (he/him), Captain Ivor Hale (he/him), Beatrice Quill (she/her)

Setting Lock: Keep all scenes and descriptions consistent with the stated setting (Little Middleton). Do not introduce a different location type.

Outline scenes:
[
  {
    "sceneNumber": 2,
    "act": 1,
    "title": "Witness Account",
    "setting": {
      "location": "the library of the manor",
      "timeOfDay": "Late morning",
      "atmosphere": "Somber and anxious"
    },
    "characters": [
      "Eleanor Voss",
      "Beatrice Quill"
    ],
    "purpose": "Establish witness statements and initial alibis",
    "cluesRevealed": [
      "clue_2"
    ],
    "dramaticElements": {
      "conflict": "Beatrice struggles to remember details.",
      "tension": "Eleanor senses inconsistencies in Beatrice's account.",
      "microMomentBeats": [
        "Eleanor notices Beatrice's trembling hands as she recounts her story."
      ]
    },
    "summary": "Eleanor interviews Beatrice about the events leading to the discovery of the body. Beatrice recounts her whereabouts but her statements begin to conflict, raising Eleanor's suspicions.",
    "estimatedWordCount": 1800,
    "pivotElement": "Beatrice's shaky account of her whereabouts during the murder.",
    "factEstablished": "Establishes that Beatrice's alibi is questionable, as she was supposedly alone in the library.",
    "permittedBehavioursByAct": [
      {
        "characterName": "Eleanor Voss",
        "behaviour": "normal social behaviour; grief or confusion if appropriate"
      },
      {
        "characterName": "Beatrice Quill",
        "behaviour": "normal social behaviour; grief or confusion if appropriate"
      }
    ],
    "redHerringPlacement": null,
    "emotionalRegister": "The investigation begins, revealing the emotional cost of secrets among the elite.",
    "dominantCharacterNote": {
      "name": "Eleanor Voss",
      "voiceRegister": "Eleanor speaks with an elegant lilt, often using playful sarcasm to mask her deeper concerns."
    },
    "humourGuidance": {
      "permission": "permitted",
      "character": "Eleanor Voss",
      "form": "dry_wit"
    },
    "eraTextureNote": "Damp, cold weather limits outdoor gatherings and social events.; Short daylight hours lead to a sense of confinement and urgency.; Travel is restricted by economic factors and the rising costs of living.",
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
□ Chapter 2: "The clock was manipulated to show a false time of death." is placed in the first 25% of the chapter, followed by an explicit inference or suspicion paragraph.
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
