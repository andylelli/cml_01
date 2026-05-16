# Actual Prompt Record

- Run ID: `mystery-1778692261636`
- Project ID: ``
- Timestamp: `2026-05-13T17:16:39.599Z`
- Agent: `Agent9-ProseGenerator-Ch1`
- Operation: `chat_request_full_prompt`
- Model: `GPT-4o-mini`
- Temperature: `0.42`
- Max Tokens: `4500`
- Attempt: `first`
- Prompt Hash: `071982963abe1b0b`

## Message 1 (role=system)

```text
You are an expert prose writer for classic mystery fiction. Your role is to write compelling, atmospheric narrative chapters that read like a professionally published novel.

⛔ ABSOLUTE RULE — CHARACTER NAMES:
The ONLY characters who exist in this story are: Eleanor Voss (woman), Dr. Mallory Finch (man), Captain Ivor Hale (man), Beatrice Quill (woman).
Do NOT invent, borrow, or introduce ANY character not on that list — no constables, no solicitors, no butlers, no servants, no shopkeepers, no bystanders with names.
Unnamed walk-ons ("a footman", "the postmistress", "an officer") are allowed ONLY if they never receive a name or title+surname combination.
⚠️ BEFORE YOU WRITE each chapter, ask yourself: "Does every person I name appear in this list: Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill?" If not, remove them.
Any invented named character will fail validation and abort the entire generation.
⚠️ BEFORE YOU WRITE each chapter, also ask yourself: "Am I using the correct pronouns for every character — she/her for women, he/him for men, they/them for non-binary characters?" If not, correct it before writing a single word.
⛔ GENDER IS NON-NEGOTIABLE: The gender of every character is shown above. Use the correct pronouns at all times — a woman is always she/her, a man is always he/him, a non-binary character is always they/them/their. Never swap, default, or guess.

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
- MORAL COMPLEXITY REQUIREMENT: The mechanism of this crime carries a moral gray area: "The perpetrator, driven by a desperate need to protect a loved one, becomes a sympathetic figure despite their crime." — the culprit reveal and denouement MUST acknowledge this ambiguity. Do not let the ending feel clean or simple. Give the reader at least one moment of uncomfortable sympathy or moral doubt.


⚠️ AMATEUR DETECTIVE STORY: The investigator is a civilian with no official standing. The official police (if they appear) are unnamed background figures only — "a constable", "the sergeant", "an officer from the village". Do NOT give any police official a name or title+surname combination. There is no Inspector [Surname], no Constable [Surname], no Sergeant [Surname] in this story.

PRONOUN ACCURACY — MANDATORY CONTINUITY CONTRACT

The following pronouns are locked facts, on the same level as character names
and hard-logic device values. Using the wrong pronoun is a continuity error,
not a style choice.

Canonical pronoun table (subject / object / possessive / reflexive):
  • Eleanor Voss: she/her/her/herself
  • Dr. Mallory Finch: he/him/his/himself
  • Captain Ivor Hale: he/him/his/himself
  • Beatrice Quill: she/her/her/herself

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
   "Graham Worsley excused herself" is a pronoun error regardless of sentence position.
6. In dialogue attribution ("he said", "she replied"), the attribution pronoun must
   agree with the SPEAKER's gender — not the last character named inside the quoted speech.
7. In nested or cleft clauses ("It was she who had…", "It was he that…"), pronoun
   gender must still match the referent character's canonical set in the table.
8. Singular "they/them/their" for a specific named non-binary character carries the same
   mandatory status as gendered pronouns. It is not a plural — treat it as grammatically
   identical to he/him/his or she/her/her for the purposes of agreement.


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
February 1930 arrives with a gray, overcast sky, its dull light filtering through the rain-slicked windows of the manor house. The chill lingers in the air, while the faint sound of raindrops tapping against the glass serves as a reminder of the ongoing Great Depression, which casts a long shadow over the lives of those within. The usual chatter of guests at a winter ball feels subdued, as murmurings of economic hardship and political instability infiltrate the conversations, creating an atmosphere fraught with uncertainty. Fashion trends reflect a desire for elegance amidst adversity. Men don tailored wool morning coats and high-waisted trousers, while women grace the dimly lit halls in floor-length evening gowns adorned with intricate beadwork. Accessories like pocket watches and pearls become symbols of status, even as the specter of financial ruin looms nearby. The evening’s social rituals demand proper etiquette, and the formality of the attire mirrors the tension of the era, where every detail becomes significant in a world teetering on the edge.
Emotional register: The dominant emotional state is one of tension and uncertainty, as individuals grapple with the oppressive weight of financial hardship and societal expectations.
Physical constraints: Short daylight hours limiting social activities. | Travel restrictions due to fuel shortages. | Communication delays due to reliance on postal services and landlines.
Current tensions (weave into background texture): The ongoing effects of the Great Depression impacting social classes. | Political instability in Europe contributing to societal anxiety. | Increasing class divide with the wealthy feeling pressure to maintain their status.
Wartime context — Not directly applicable as the Great Depression dominates the social landscape, overshadowing any recent war service.: The memory of World War I still lingers, affecting perspectives on honor and duty. Absence effect: Absent soldiers are often idealized, leading to a complex mix of pride and grief within families.

## Season Lock (mandatory — derived from February 1930)
Season: winter. Allowed vocabulary: winter, wintry, midwinter
Forbidden seasonal words — never use in narration, dialogue, or metaphor: spring, summer, autumn and their adjectival forms.
Every weather description, atmosphere, and time-of-year reference must be consistent with winter.

## Story Theme
In a world overshadowed by economic despair, the murder at the Voss estate reveals the fragility of social facades and the darkness that lies beneath human intentions.

## Story Emotional Register
Dominant: The story's overall emotional character is one of suspense and revelation, intertwined with personal struggles.

Arc:
The narrative begins with a festive yet tense atmosphere at the Voss estate, where Eleanor Voss hosts a family reunion. As laughter fills the air, an undercurrent of anxiety brews, hinting at the financial troubles looming over her. Eleanor’s charm masks her desperation, setting the stage for a tragic turn of events. The first turning point occurs when Eleanor is discovered murdered, sending shockwaves through the family. The initial shock evolves into suspicion, as each character grapples with their own secrets and motives. As the investigation unfolds, the emotional tension rises; characters like Dr.

Finch, Captain Hale, and Beatrice Quill reveal their vulnerabilities, each facing their past and the impact of the murder on their lives. The second turning point emerges as clues surface, particularly regarding the tampered clock, which misleads everyone about the time of death. This revelation heightens the stakes, forcing the characters to confront their fears and desires. The climax arrives with the confrontation of the murderer, exposing the tangled web of deceit and personal grievances. As the truth unravels, the emotional weight of betrayal and fear is palpable. In the resolution, characters reflect on their actions and the consequences of their choices, providing a bittersweet closure. The emotional register shifts from tension to a somber acceptance as they navigate their futures amidst the remnants of tragedy.

## Emotional register at this point in the story
The opening scene is filled with a festive ambiance, masking the underlying tensions among the guests.

## Character Portraits (appearance & era)

### Eleanor Voss
Eleanor Voss embodies the struggle of the upper class during the Great Depression, desperately trying to maintain her social standing amidst financial challenges. Her facade of elegance belies a deep-seated fear of exposure.
Era intersection: Eleanor's financial troubles intersect with the societal pressures of the time, making her vulnerable in a world where status is paramount.

### Captain Ivor Hale
Captain Ivor Hale carries the weight of his past military service and the scars of PTSD, symbolizing the internal battles faced by many veterans in a changing world. His desire for redemption fuels his involvement in the case.
Era intersection: Ivor's struggle for personal redemption mirrors the broader societal quest for stability in the face of economic turmoil.

### Beatrice Quill
Beatrice Quill's ambition as an aspiring writer is stifled by the class tensions of the time, revealing the difficulties faced by women seeking independence. Her affair with Ivor complicates her aspirations.
Era intersection: In a society that often judges women harshly, Beatrice's plight highlights the challenges faced by individuals trying to carve out their identities amidst societal expectations.

## Character Voices

### Eleanor Voss (she/her/her)
Eleanor speaks with a refined cadence, often laced with clever quips that reflect her social status and inner turmoil.
[comfortable] Ah, the garden looks splendid this evening, doesn't it? Nothing like a touch of fresh air to elevate the spirit.
[evasive] Oh, you mustn't worry about little old me. I'm quite adept at managing my own affairs, thank you.
[stressed] The last thing I need is more whispers about my family's finances. It's all rather... unnerving.
Humour: Eleanor's dry wit often surfaces, reflecting her struggle to maintain composure in tense situations.

### Captain Ivor Hale (he/him/his)
Captain Hale has a slow, deliberate way of speaking, often downplaying his own achievements with self-deprecating humor.
[comfortable] You know, I once saved a battalion, but I suppose that's hardly a dinner conversation.
[evasive] I prefer to let others have the spotlight; I'm just a humble card player these days.
[stressed] It's hard to shake the ghosts of the past, especially when they come back to haunt you.
Humour: Ivor's self-deprecating humor often masks his deeper insecurities.

### Beatrice Quill (she/her/her)
Beatrice's speech is animated and quick, often filled with sarcasm that reflects her youthful exuberance.
[comfortable] Oh, darling! If only life were as simple as a plot twist in one of my stories!
[evasive] I’m not one to dwell on personal affairs. Let's talk about something far more interesting, shall we?
[stressed] I can't afford to have my secrets out in the open. It would ruin everything!
Humour: Beatrice's sardonic humor often helps her navigate uncomfortable topics.

## Location Registers (scene framing guides)

The Dining Room: The dining room exudes an air of opulence, yet beneath the polished surfaces lies an undercurrent of tension. Guests engage in polite conversation, but the atmosphere is thick with unspoken accusations and hidden agendas.. Camera angle: A writer entering this space should focus on the contrasts between the grandeur of the setting and the anxiety of the characters within.. Era: As the Great Depression looms, every detail in this room becomes a reminder of the fragility of wealth and status.

The Study: The study is a haven of knowledge turned chaotic, filled with the remnants of a struggle that has left its mark. The air feels heavy with the weight of secrets, and the soft crackle of the fire seems a mere distraction from the tension that fills the room.. Camera angle: The writer should emphasize the dichotomy of comfort and chaos, showing how the study holds both solace and danger.. Era: This location reflects an era where private lives are scrutinized, and the past collides with the present.

The Library: The library, once a sanctuary of knowledge, now feels like a tomb filled with echoes of a violent struggle. The shadows cast by the flickering light create a haunting atmosphere, where every whisper of the past seems to linger, waiting for revelation.. Camera angle: A writer should capture the library's haunting beauty, contrasting its former grandeur with the current tension.. Era: In an era marked by secrecy and deception, the library stands as a testament to the fragility of truth.

## Humour guidance for this story position (opening)
Permission: permitted
Rationale: Eleanor's dry wit adds levity to the otherwise tense atmosphere of the gathering.

FAIR-PLAY AND INFERENCE CONTRACT (from CML logic):
- False assumption in force: The murder occurred at the time indicated by the clock.
- Hidden truth to progressively expose: The clock was manipulated to mislead everyone.
- Inference path checkpoints to dramatize clearly (observation -> correction -> effect):
  - Step 1: obs: The clock in the study shows ten minutes past eleven when the body is discovered. | corr: The time indicated by the clock is critical to determining the time of death. | effect: Narrows suspect pool to those who were in the study around that time.
  - Step 2: obs: Witnesses recall hearing a chime that would have occurred after the actual time of death. | corr: The discrepancy in time suggests the clock has been tampered with. | effect: Eliminates Beatrice Quill as a suspect, as she was outside at the time.
  - Step 3: obs: Eleanor's diary reveals she received a threatening letter the day before. | corr: The threat indicates premeditation, suggesting the motive to kill Eleanor. | effect: Narrows the suspect pool to Dr. Mallory Finch, who had knowledge of her distress.
- Discriminating test method: trap
- Discriminating test design constraint: A controlled comparison of the clock's mechanism with a similar clock that has not been tampered shows the discrepancy in timekeeping.
- Test must rely on already-shown clue IDs: clue_1, clue_2, clue_3, clue_core_contradiction_chain, clue_mechanism_visibility_core
- Fair-play rationale: Step 1: The clock time indicating ten minutes past eleven and witness statements about the chime create a contradiction. Step 2: The diary's threatening letter reveals motive. Step 3: The clock's tampering is proven in the test.
- Never solve by withheld information. Keep reader-information parity with detective reasoning.

## Character Reference

### Eleanor Voss
Eleanor's speech is laced with a refined cadence, punctuated by clever quips that often elicit laughter
She employs an air of sophistication, but her words can turn sardonic when pressed.
Eleanor is torn between her desire for social acceptance and the harsh reality of her financial instability. The burden of her secret weighs heavily on her, causing her to question her worth in a society that values status above all.

### Captain Ivor Hale
Ivor speaks with a slow, deliberate cadence, often punctuating his sentences with a dry chuckle
He has a tendency to downplay his own achievements, turning the focus onto others.
Ivor is haunted by his past, struggling with feelings of inadequacy and shame. The taunts of the victim strike at the core of his identity, forcing him to confront the failures he has buried deep within.

### Beatrice Quill
Beatrice's speech is animated, often marked by rapid-fire delivery and a playful tone
She employs sarcasm with ease, using wit to deflect any probing questions about her personal life.
Beatrice is torn between her ambition and the fear of exposure. The affair with Ivor represents both a source of joy and a potential downfall, leaving her in a constant state of anxiety.


## CHARACTER CONTRACTS (binding for this scene)
Each entry below constrains how this character must be written in this chapter.
These override generic style guidance when they conflict.

### Eleanor Voss
Voice & mannerisms: Eleanor's speech is laced with a refined cadence, punctuated by clever quips that often elicit laughter. She employs an air of sophistication, but her words can turn sardonic when pressed.
Sample voice fragments (match this register and rhythm):
  [comfortable] "Ah, the garden looks splendid this evening, doesn't it? Nothing like a touch of fresh air to elevate the spirit."
  [evasive] "Oh, you mustn't worry about little old me. I'm quite adept at managing my own affairs, thank you."
Humour: dry wit — deploy occasionally (level 0.5)
FORBIDDEN phrase (never write for Eleanor Voss): "a surge of determination washed over her"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Eleanor's anxiety intensifies as the victim, a potential whistleblower on her financial mismanagement, threatens to expose her troubles to the very society she cherishes." — do not surface in Act I.

### Captain Ivor Hale
Voice & mannerisms: Ivor speaks with a slow, deliberate cadence, often punctuating his sentences with a dry chuckle. He has a tendency to downplay his own achievements, turning the focus onto others.
Sample voice fragments (match this register and rhythm):
  [comfortable] "You know, I once saved a battalion, but I suppose that's hardly a dinner conversation."
  [evasive] "I prefer to let others have the spotlight; I'm just a humble card player these days."
Humour: self deprecating — deploy occasionally (level 0.6)
FORBIDDEN phrase (never write for Captain Ivor Hale): "she knew with certainty she was right"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "The victim's taunting remarks about Ivor's perceived failures in battle reignited old wounds, leading to a simmering anger that could push him to the edge." — do not surface in Act I.

### Beatrice Quill
Voice & mannerisms: Beatrice's speech is animated, often marked by rapid-fire delivery and a playful tone. She employs sarcasm with ease, using wit to deflect any probing questions about her personal life.
Sample voice fragments (match this register and rhythm):
  [comfortable] "Oh, darling! If only life were as simple as a plot twist in one of my stories!"
  [evasive] "I’m not one to dwell on personal affairs. Let's talk about something far more interesting, shall we?"
Humour: sardonic — deploy frequently (level 0.7)
FORBIDDEN phrase (never write for Beatrice Quill): "palpable tension filled the room"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "The victim's potential to expose her affair with Ivor terrifies Beatrice, as it threatens to derail her aspirations and tarnish her name in the literary community." — do not surface in Act I.



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
Little Middleton Manor stands as a grand testament to the opulence of a bygone era, surrounded by meticulously maintained gardens and an ominous forest that whispers secrets of the past.

Key Locations Available:
- The Library (interior): Crime scene
- The Dining Room (interior): Gathering space
- The Study (interior): Clue discovery

Atmosphere: Tense and uncertain, reflecting societal anxieties of the era.
Weather: Overcast with occasional rain, creating a somber mood.

Era markers: Petrol touring cars parked in front of the manor, hinting at the arrival of guests. | Typewriters in the study, their clacking sounds echoing the urgency of communication. | Domestic telephones with party lines, allowing for whispered conversations and rumors.

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
The Library (interior):
  - Visual: Rows of leather-bound tomes line the walls, their titles barely visible through a thick layer of dust, while a heavy chandelier hangs precariously from the ceiling, casting flickering shadows., A grand fireplace, cold and dark, looms at one end of the room, the ashes of a long-extinguished fire adding to the somber atmosphere.
  - Sounds: The soft rustle of pages turning echoes through the room, a ghostly reminder of the many who have sought knowledge within these walls., The creak of floorboards underfoot adds an unsettling tension, each sound amplifying the gravity of the moment.
  - Scents: The musty scent of old books fills the air, mingling with the faint aroma of polished wood and the lingering traces of smoke from a forgotten cigar., A hint of dampness lingers, as if the very walls are absorbing the secrets that have been whispered within.
  - Touch: The coolness of the marble fireplace contrasts sharply with the warmth of the heavy drapes that frame the tall windows, creating a sense of isolation., The rough texture of the well-worn carpet underfoot adds an air of familiarity, yet feels strangely out of place amidst the chaos.

The Dining Room (interior):
  - Visual: The table is adorned with fine china and silver cutlery, each piece polished to a gleam that reflects the flickering candlelight, enhancing the sense of occasion., Tall windows draped with heavy curtains frame the room, allowing glimpses of the manicured gardens outside, where the shadows grow longer as evening descends.
  - Sounds: The clinking of glasses and the soft murmur of conversation fill the air, punctuated by the occasional burst of laughter that reverberates off the walls., The rustle of napkins and the scraping of chairs add to the symphony of sounds, creating a warm yet charged atmosphere.
  - Scents: The rich aroma of roast meat mingles with the scent of fresh herbs, creating an inviting olfactory experience that beckons guests to the table., A faint hint of beeswax from the candles adds a layer of warmth, enveloping the room in a comforting embrace.
  - Touch: T
[truncated for prompt budget]

## Texture Pool
Draw on these as opportunities arise — you are not required to use them.

- February 1930 arrives with a gray, overcast sky, its dull light filtering through the rain-slicked windows of the manor house
- The chill lingers in the air, while the faint sound of raindrops tapping against the glass serves as a reminder of the ongoing Great Depression, which casts a long shadow over the lives of those within
- The usual chatter of guests at a winter ball feels subdued, as murmurings of economic hardship and political instability infiltrate the conversations, creating an atmosphere fraught with uncertainty
- Fashion trends reflect a desire for elegance amidst adversity
- Men don tailored wool morning coats and high-waisted trousers, while women grace the dimly lit halls in floor-length evening gowns adorned with intricate beadwork

TEMPORAL CONTEXT:

This story takes place in February 1930 during winter.

Seasonal Atmosphere:
- Weather patterns: overcast with occasional rain, chilly winds, mild temperatures around 4°C (39°F)
- Daylight: Short winter days, with sunset around five o'clock in the evening, casting long shadows in the late afternoon.
- Seasonal activities: attending winter balls, indoor social gatherings by the fireplace, reading popular novels of the time
- Seasonal occasions: Valentine's Day (February 14)
- Season: winter

Period Fashion (describe naturally):
- Men formal: tailored wool morning coat, high-waisted trousers, cravat or bow tie
- Men casual: tweed jacket, flannel trousers, knitted waistcoat
- Men accessories: pocket watch, fedora hat, leather gloves
- Women formal: floor-length evening gown with long sleeves, beaded cloche hat, silk gloves
- Women casual: woolen skirt with a fitted blouse, cardigan sweater, beret
- Women accessories: string of pearls, handbag with art deco design, fur stole

Cultural Context (reference naturally):
- Music/entertainment: 'My Blue Heaven' by Gene Austin, 'Ain't She Sweet' by Milton Ager, 'The Birth of the Blues' by Ray Henderson; Films: 'All Quiet on the Western Front', 'The Love Parade'; Theatre: 'The Front Page', 'The Royal Family'; Radio: The Jack Benny Program, Amos 'n' Andy
- Typical prices: Loaf of bread: four pence, Taxi across town: two shillings, A pint of milk: one penny
- Current events: The ongoing effects of the Great Depression; Political instability in Europe with rising fascism
- Literature: 'The Maltese Falcon' by Dashiell Hammett | 'The Great Gatsby' by F. Scott Fitzgerald | 'Murder in the Tower' by John Dickson Carr | [detective fiction] | [romantic novels] | [social commentaries on the Great Depression]
- Technology: electric washing machine | radio broadcasting reaching households | the typewriter becoming commonplace in offices | domestic telephones | petrol cars for travel | cinemas featuring sound films
- Daily life: Attending local dance halls, Participating in community gatherings, Hosting card games or tea parties at home
- Social rituals: Evening tea served at five o'clock, Formal invitations required for social gatherings, Sunday family dinners

Atmospheric Details:
The scent of rain-soaked earth mingles with the faint aroma of burning wood from the manor's fireplace. The distant sound of thunder rumbles, adding to the sense of unease that permeates the air. Flickering candles cast dancing shadows on the walls, creating an atmosphere of suspense and tension.

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
- Authentic references: Use actual son
[truncated for prompt budget]

NON-NEGOTIABLE CHAPTER OBLIGATIONS — LOCKED EVIDENCE PHRASES (VERBATIM REQUIRED):
The following physical evidence values are absolute ground truth. Every time this chapter describes, mentions, or alludes to the relevant evidence — no matter how briefly — it MUST use the exact phrase shown below, character for character. NO paraphrase, approximation, rounding, or synonym is permitted.

FAILURE EXAMPLE: if the locked value is "at thirteen minutes to midnight" and you write "just before midnight" or "around midnight" — that is a HARD FAIL. You must write "at thirteen minutes to midnight". Equally, if the locked value is written in words, such as "ten minutes past eleven", and you convert it to figure-based clock notation — that is also a HARD FAIL. Words stay as words; figure forms are forbidden for word-phrased facts.

CRITICAL — WORD-PHRASED VALUES: If the canonical value is written out in words (e.g. a time like "ten minutes past eleven", or an amount like "forty minutes"), reproduce those exact words. DO NOT convert to figure-based time notation, twenty-four-hour format, or any other numeric shorthand. Correct: "ten minutes past eleven". WRONG: figure-based clock notation or numeric shorthand.

Locked facts:
  - The exact time shown on the stopped clock face: "ten minutes past eleven"
  - The exact amount the clock was wound back: "forty minutes"

If a locked fact has no relevance to this chapter, omit it. But the moment you reference the underlying evidence, only the exact phrase above is acceptable.

⛔ CLUES TO SURFACE IN THESE CHAPTERS — mandatory:
The following evidence MUST be clearly observable to an attentive reader. Do not bury it in atmosphere or passing dialogue. Each clue must be concrete, specific, and noticeable:

• [clue_1] The clock in the study shows ten minutes past eleven when the body is discovered.
  Category: temporal | Criticality: essential | Supports inference step 1
  Points to: The time of the body discovery.

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
═══════════════════════════════════════════════════════

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
Known location profile anchors: Little Middleton Manor, The Library, The Dining Room, The Study, the study of Eleanor Voss
LOCATION NAME CAPITALISATION (HARD REQUIREMENT — validated):
All named locations in your prose MUST use the EXACT capitalisation from the CML profiles.
Canonical forms: "Little Middleton Manor", "The Library", "The Dining Room", "The Study", "the study of Eleanor Voss"
Writing a location in lowercase (e.g. "drawing room" instead of "Drawing Room") is a validated error. Every time you mention a named location, copy its capitalisation from the list above.
- Chapter 1: OPENING STYLE (HARD): Start the VERY FIRST SENTENCE with a named character performing a physical action or motion — e.g. "[Name] crossed the threshold…" / "[Name] set down the glass…" / "[Name] rose from the chair…". Anchor opening in "the study of Eleanor Voss". HARD REQUIREMENT for the first 2 paragraphs: (a) include 2+ sensory words — choose from smell/scent/sound/echo/silence/creak/whisper/cold/warm/damp/rough/smooth/glow/shadow/flicker/dim — and (b) include 1+ atmosphere/time word — choose from rain/wind/fog/storm/mist/thunder/evening/morning/night/dawn/dusk/season/afternoon/midday/noon/midnight/twilight/sunrise/sunset/daylight/sunlight/overcast/cloudy/bright/dark. These are validated requirements, not style suggestions; missing them triggers a retry.

PROMPT BUDGET SUMMARY: budget=32000 tokens; fixed=5185; context=9314; dropped=[none]; truncated=[location_profiles, temporal_context]

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
- Chapter numbering starts at 1 and increments by 1 per scene.
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
8. Integrate at least two concrete era-grounded details per chapter from setting refinement signals: petrol touring cars on county roads | domestic telephones with party lines | typewriters for correspondence | telephone exchanges for local calls | telegrams for urgent messages | airmail services for distant correspondence.
9. Respect setting movement/access constraints in scene action and alibis: geographic layout allows for controlled access to certain rooms | architecture creates natural barriers and secluded areas | weather can delay movements and affect evidence visibility | restricted areas such as the library and study | daily routines dictate who can access which parts of the house.
10. Sustain social coherence with this backdrop pressure: A gathering at the Voss estate for a family reunion amidst the Great Depression exposes underlying class tensions and personal grievances, as the looming threat of financial ruin and political unrest heightens the stakes for all present.
11. Maintain continuity around these socially central cast anchors where relevant: Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill.
12. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Critical: Plot similarity 0.80 with 'The Mysterious Affair at Styles' (same thematic murder method and limited forensic context)
13. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Moderate: Character similarity 0.70 with 'The Sign of the Four' (similar cast structure involving a doctor and a captain)

CRITICAL PROSE REQUIREMENTS:

The CML specifies exact requirements for certain validation-critical scenes. You MUST include these elements at the specified positions.

**Discriminating Test Scene (Act 3, Scene 4):**
Required elements: Execute the discriminating test, Observe the clock's mechanism and discrepancies, Draw conclusion about guilt
Test type: mechanical comparison

**Suspect Clearance Scenes:**
- Beatrice Quill (Act 3, Scene 5): Alibi confirmed by witness placing her away from the scene.
  Clues: clue_1, clue_2

**Culprit Revelation Scene (Act 3, Scene 6):**
Method: Confrontation with evidence from the clock and diary.

**Clue Placement for These Chapters:**
- clue_1 must appear in Act 1, Scene 1 via Direct observation

**VALIDATION CONSEQUENCE:** If these requirements are not met exactly, story validation will fail and the entire generation will be rejected, costing $5-8 to regenerate. Follow these specifications precisely.


## Asset Self-Report (required)
At the very END of your response, after all prose, add a single line:
<used_assets>era:story:0,era:story:1,era:story:2,era:story:3,era:story:4</used_assets>
Replace the list with only the IDs of texture assets you actually used. If you used none, output <used_assets></used_assets>.
```

## Message 2 (role=user)

```text
Write the full prose following the outline scenes.



CHAPTER OBLIGATION CONTRACT (MUST SATISFY):
- Chapter 1:
  - Word count: Target 1250 words. Achieve this through plot events, dialogue exchanges, and physical investigation — not through atmospheric repetition or extended internal reflection. Each 200-word segment should contain at minimum one concrete story event (a discovery, a conversation exchange, a physical action or movement). Padding with atmosphere alone is not acceptable.
  - Location anchor: the study of Eleanor Voss.
  - Opening atmosphere (MANDATORY — validator enforced): the first paragraph MUST contain at least one of: rain / wind / fog / storm / mist / thunder / evening / morning / night / dawn / dusk / season / afternoon / midday / noon / midnight / twilight / sunrise / sunset / daylight / sunlight / overcast / cloudy / bright / dark. A chapter that omits all of these from its opening paragraph will be rejected.
  - CLUE OBLIGATIONS — mandatory prose elements (do NOT omit or bury):
    • The clock in the study shows ten minutes past eleven when the body is discovered. [clue_1] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: The time of the body discovery.
      ↳ MANDATORY TWO-PARAGRAPH STRUCTURE (must appear in paragraphs 1 or 2 — no later):
         Paragraph 1: The POV character physically approaches or directly observes this evidence.
           The narration or dialogue explicitly states what is seen (use the exact locked phrase if one applies).
         Paragraph 2 (immediately following): The detective or POV character explicitly reasons
           about what this evidence implies — who it implicates, why it may be unreliable,
           or what inference it supports. This must be a separate full paragraph, not a sentence appended to Paragraph 1.
  - Tonal contrast: include at least one beat of relief or ironic counterpoint. Do not sustain maximum tension for every paragraph.
  - Sensory obligation — use at least two of: Raindrops streak down the windowpanes, blurring the view of the garden outside, where the flowers are heavy with moisture., The dim light filters through, casting long shadows across the room and enhancing the sense of solitude. | The steady drumming of rain against the roof creates a rhythmic backdrop, while the distant sound of thunder rumbles ominously., The crackle of the fire is a comforting sound, offering warmth against the chill of the morning. | The scent of wet earth seeps in through the window, mingling with the rich aroma of leather and smoke, creating a grounding atmosphere.. Mood: oppressive.
- Locked fact phrase obligations:
  - If this batch mentions The exact time shown on the stopped clock face, write exactly: "ten minutes past eleven".
  - If this batch mentions The exact amount the clock was wound back, write exactly: "forty minutes".
- Seasonal vocabulary allow-list: winter, wintry, midwinter.
- Forbidden seasonal words: spring, summer, autumn.

FROZEN TIMELINE STATE (DO NOT ALTER):
- Timeline anchor: February (winter).
- Month, season, weather, and time-of-year language in this batch must stay compatible with winter.
- Established timeline fact: Eleanor last seen at ten minutes to eleven
- Established timeline fact: Body found at ten minutes past eleven
- If referenced, use exact time phrase: "ten minutes past eleven" (The exact time shown on the stopped clock face).
- If referenced, use exact time phrase: "forty minutes" (The exact amount the clock was wound back).

STORY TO DATE (REFERENCE ONLY — DO NOT COPY VERBATIM):
- No previous chapter text exists yet for this batch.

[SCENE COMPLETENESS CONTRACTS — MANDATORY. Each contract below lists what you MUST enact in that chapter. Do not summarise or mention these labels in the prose — enact them organically.]
Chapter 1 (Act 1) completeness contract:
  PIVOT ELEMENT (MANDATORY — write this into the prose, shown not told): "The stopped clock showing ten minutes past eleven."
  FACT ESTABLISHED (MANDATORY — reader must know this by chapter end): "Establishes the victim died no later than eleven past eleven, contradicting three suspects' alibis."
  RED HERRING (MANDATORY — seed naturally, not flagged as false): [rh_1] Witnesses claim they saw accurate Voss leaving the study shortly before the body was found.

# Case Overview
Title: The Clock of Deception
Era: 1930s
Setting: Little Middleton
Crime: murder (thematic)
Culprit: Dr. Mallory Finch
False assumption: The murder occurred at the time indicated by the clock.
Cast: Eleanor Voss (she/her), Dr. Mallory Finch (he/him), Captain Ivor Hale (he/him), Beatrice Quill (she/her)

Setting Lock: Keep all scenes and descriptions consistent with the stated setting (Little Middleton). Do not introduce a different location type.

Outline scenes:
[
  {
    "sceneNumber": 1,
    "act": 1,
    "title": "Discovery",
    "setting": {
      "location": "the study of Eleanor Voss",
      "timeOfDay": "Morning after the murder",
      "atmosphere": "Tense household awaiting the detective's arrival"
    },
    "characters": [
      "Eleanor Voss",
      "Captain Ivor Hale",
      "Beatrice Quill"
    ],
    "purpose": "Introduce the crime and detective",
    "cluesRevealed": [
      "clue_1"
    ],
    "dramaticElements": {
      "conflict": "Locked room mystery established",
      "tension": "Every suspect had access to the victim",
      "microMomentBeats": [
        "Eleanor stares blankly at the clock, heart racing as she recalls the last moments before the murder."
      ]
    },
    "summary": "In the dim light of the study, Eleanor Voss, the captain Hale, and Beatrice Quill gather around the body of the unknown victim. The clock shows ten minutes past eleven, raising immediate questions about the time of death.",
    "estimatedWordCount": 1800,
    "pivotElement": "The stopped clock showing ten minutes past eleven.",
    "factEstablished": "Establishes the victim died no later than eleven past eleven, contradicting three suspects' alibis.",
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
        "characterName": "Beatrice Quill",
        "behaviour": "normal social behaviour; confusion"
      }
    ],
    "redHerringPlacement": {
      "redHerringId": "rh_1",
      "placementDetail": "Witnesses claim they saw accurate Voss leaving the study shortly before the body was found."
    },
    "emotionalRegister": "The opening scene is filled with a festive ambiance, masking the underlying tensions among the guests.",
    "dominantCharacterNote": {
      "name": "Eleanor Voss",
      "voiceRegister": "Eleanor speaks with a refined cadence, often laced with clever quips that reflect her social status and inner turmoil."
    },
    "humourGuidance": {
      "permission": "permitted"
    },
    "eraTextureNote": "Short daylight hours limiting social activities.; Travel restrictions due to fuel shortages.; Communication delays due to reliance on postal services and landlines.",
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
□ Chapter 1: "The clock in the study shows ten minutes past eleven when the body is discovered." is placed in the first 25% of the chapter, followed by an explicit inference or suspicion paragraph.
□ PRONOUN AUDIT — for every character you named in your chapters, list the pronouns you actually used, then verify against the canonical table. Correct any mismatch before outputting. Do NOT include this audit in your JSON output.
  Character            | Canonical     | Used in draft | Match?
  ---------------------|---------------|---------------|-------
  Eleanor Voss         | she/her/her/herself       | [fill in]     | [yes/no]
  Dr. Mallory Finch    | he/him/his/himself        | [fill in]     | [yes/no]
  Captain Ivor Hale    | he/him/his/himself        | [fill in]     | [yes/no]
  Beatrice Quill       | she/her/her/herself       | [fill in]     | [yes/no]
□ Return valid JSON only.
```
