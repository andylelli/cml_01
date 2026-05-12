# Actual Prompt Record

- Run ID: `mystery-1778531247623`
- Project ID: ``
- Timestamp: `2026-05-11T20:33:27.661Z`
- Agent: `Agent9-ProseGenerator-Ch1`
- Operation: `chat_request_full_prompt`
- Model: `GPT-4o-mini`
- Temperature: `0.42`
- Max Tokens: `4500`
- Attempt: `first`
- Prompt Hash: `b9579954185f4a64`

## Message 1 (role=system)

```text
You are an expert prose writer for classic mystery fiction. Your role is to write compelling, atmospheric narrative chapters that read like a professionally published novel.

⛔ ABSOLUTE RULE — CHARACTER NAMES:
The ONLY characters who exist in this story are: Eleanor Voss (woman), Dr. Mallory Finch (woman), Captain Ivor Hale (man), Beatrice Quill (woman).
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
- MORAL COMPLEXITY REQUIREMENT: The mechanism of this crime carries a moral gray area: "The murderer believes they are righting a past wrong, making their actions seem understandable." — the culprit reveal and denouement MUST acknowledge this ambiguity. Do not let the ending feel clean or simple. Give the reader at least one moment of uncomfortable sympathy or moral doubt.


⚠️ AMATEUR DETECTIVE STORY: The investigator is a civilian with no official standing. The official police (if they appear) are unnamed background figures only — "a constable", "the sergeant", "an officer from the village". Do NOT give any police official a name or title+surname combination. There is no Inspector [Surname], no Constable [Surname], no Sergeant [Surname] in this story.

PRONOUN ACCURACY — MANDATORY CONTINUITY CONTRACT

The following pronouns are locked facts, on the same level as character names
and hard-logic device values. Using the wrong pronoun is a continuity error,
not a style choice.

Canonical pronoun table (subject / object / possessive / reflexive):
  • Eleanor Voss: she/her/her/herself
  • Dr. Mallory Finch: she/her/her/herself
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

## Era: January 1930
In January 1930, the weight of the ongoing Great Depression permeates every aspect of life in England. The air is thick with uncertainty, as families struggle to make ends meet amidst rising unemployment and economic despair. Social gatherings, once vibrant celebrations of wealth and status, now feel strained and hollow, serving as reminders of what has been lost. The chilly winter weather adds to the somber mood, with overcast skies and intermittent rain mirroring the collective anxiety that grips the nation. Short days mean that darkness falls early, casting long shadows that amplify the sense of foreboding. Each interaction is steeped in the rigid etiquette of the time, where class distinctions create barriers that are difficult to breach. People cling to their social status even as they face financial ruin, leading to a facade of normalcy that belies the tumult beneath. Gossip about creditors and inheritance disputes hangs heavy in the air, and the specter of scandal looms large over every conversation, leaving individuals feeling isolated and vulnerable.
Emotional register: A pervasive sense of anxiety and desperation characterizes the collective emotional state as individuals grapple with financial pressures and social expectations.
Physical constraints: Limited resources for transportation, making travel difficult. | Short daylight hours leave little time for outdoor activities. | Chilly temperatures force gatherings indoors, heightening tensions. | Communication relies heavily on letters and limited telephone access.
Current tensions (weave into background texture): The Great Depression continues to impact economies globally. | Class tensions rise as the wealthy struggle to maintain their status. | Fear of scandal and exposure of personal secrets creates anxiety.
Wartime context — Many young men returning from service in the war struggle to reintegrate into society.: The remnants of wartime camaraderie clash with the new realities of peacetime disillusionment. Absence effect: The absence of those who lost their lives in the war leaves a void and a lingering sense of mourning.

## Season Lock (mandatory — derived from January 1930)
Season: winter. Allowed vocabulary: winter, wintry, midwinter
Forbidden seasonal words — never use in narration, dialogue, or metaphor: spring, summer, autumn and their adjectival forms.
Every weather description, atmosphere, and time-of-year reference must be consistent with winter.

## Story Theme
The story explores the devastating impact of financial desperation and personal ambition in a world where class divides and secrets can lead to tragic consequences.

## Story Emotional Register
Dominant: The overall emotional character of the story is one of rising tension and eventual revelation, culminating in a bittersweet resolution.

Arc:
The story begins with Eleanor Voss in the garden, portraying a facade of grace as she mingles with guests, her inner turmoil masked by the expectations of her social status. The tension escalates during the evening gathering, where whispers of inheritance disputes linger in the air, foreshadowing the chaos to come. As the clock strikes ten minutes past eleven and Eleanor is found dead, the atmosphere shifts dramatically; shock and confusion ripple through the manor as guests grapple with the grim reality of murder. The investigation unfolds, revealing the complexities of each character's motivations, as Dr. Finch's nervous demeanor and Captain Hale's gambling debts come into focus.

The first turning point arrives when discrepancies in alibis begin to surface, creating a web of suspicion that entangles even the most seemingly innocent characters. As the detective delves deeper, the emotional stakes heighten, revealing personal secrets that intertwine with the murder plot. The second turning point occurs when evidence of clock tampering emerges, raising questions that threaten to unravel the entire case. The climax builds to a tense confrontation where the truth about the motives and relationships between the characters is laid bare, culminating in the revelation of Captain Hale's guilt. The resolution leaves readers with a bittersweet sense of closure, as the characters are forced to confront the consequences of their actions, and Eleanor's legacy hangs in the balance. Ultimately, the emotional journey captures the complexities of human relationships, ambition, and the price of secrets in a world fraught with tension.

## Emotional register at this point in the story
The story opens on a note of superficial tranquility, masking the underlying tensions of wealth and desperation.

## Character Portraits (appearance & era)

### Eleanor Voss
Eleanor Voss represents the struggle of the upper class to maintain appearances amidst financial turmoil. As a wealthy heiress, she faces the pressure of upholding her family’s legacy while grappling with hidden debts that threaten her social standing. Her desperation drives her actions in a world where the façade of respectability is paramount.
Era intersection: Eleanor’s financial situation intersects with the broader economic crisis, as her need to protect her family's estate becomes a matter of survival in a society that values wealth and status.

### Dr. Mallory Finch
Dr. Mallory Finch embodies the conflict between professional integrity and personal desire, caught in a web of societal expectations and the fear of scandal. Her secret affair with Eleanor creates an emotional turmoil that mirrors the collective anxiety of the time, as she navigates the precarious balance between love and reputation.
Era intersection: Mallory’s struggles with societal pressures reflect the changing roles of women in the 1930s, as they increasingly sought autonomy while still bound by traditional expectations.

### Captain Ivor Hale
Captain Ivor Hale represents the disillusionment of a generation who served in the war, now grappling with personal grievances and financial instability. His resentment towards Eleanor highlights the emotional scars left by past injustices, as he seeks to reclaim what he believes is rightfully his amidst the turmoil of the era.
Era intersection: Ivor’s longing for a return to former glory is a poignant reflection of the societal shifts occurring in the wake of the Great Depression, as class tensions rise and the past collides with a harsh new reality.

### Beatrice Quill
Beatrice Quill exemplifies the ambition of the lower classes seeking upward mobility in a rigid social structure. Her desire to marry into wealth reveals the lengths to which individuals will go to escape their circumstances, reflecting the pervasive class divide that defines the era.
Era intersection: Beatrice’s aspirations are a microcosm of the broader social changes happening in the 1930s, where traditional roles are challenged by the harsh realities of economic hardship.

## Character Voices

### Eleanor Voss (she/her/her)
Eleanor speaks with a refined cadence, often punctuating her sentences with soft laughter or sighs, her words carefully chosen to reflect the elegance she wishes to project.
[comfortable] Oh, the garden is simply delightful this time of year. I could spend hours among the roses.
[evasive] I’m sure there’s some misunderstanding; my family has always been respected in this community.
[stressed] I must find a way to resolve this before it spirals out of control; my family's legacy depends on it.
Humour: Her understated humour comes through when she attempts to lighten the mood during tense conversations.

### Dr. Mallory Finch (she/her/her)
Mallory speaks with a measured tone, often employing medical jargon when nervous but using dry humor as a shield against her emotional turmoil.
[comfortable] I find that a little laughter can ease even the heaviest of burdens, don’t you?
[evasive] It’s not what you think; my professional relationship with Eleanor is strictly that, professional.
[stressed] What if they find out? My career, my heart, everything will be destroyed.
Humour: Her dry wit often surfaces at unexpected moments, providing a glimpse into her inner struggles.

### Captain Ivor Hale (he/him/his)
Ivor speaks with a clipped, authoritative tone, often punctuating his statements with dry humor that hints at his frustrations.
[comfortable] You know, there was a time when gentlemen played cards for honor and not just for money.
[evasive] I’ve no intention of discussing family matters with anyone outside the circle.
[stressed] This is about more than just an inheritance; it’s about restoring our family’s name!
Humour: His sardonic humour often masks deeper frustrations regarding his circumstances.

### Beatrice Quill (she/her/her)
Beatrice speaks with an enthusiastic cadence, often punctuating her sentences with exclamations and an eagerness that belies her more calculating nature.
[comfortable] Oh, isn’t it simply charming here? I just adore the gardens!
[evasive] I was just tending to the children; they need me to keep them entertained, you know!
[stressed] This could be my chance! I can’t let anything stand in my way.
Humour: Her bluntness occasionally surfaces, especially when under pressure, revealing her true ambition.

## Location Registers (scene framing guides)

The Drawing Room: The drawing room serves as a microcosm of the manor's social dynamics, where laughter and whispered secrets intertwine, creating an atmosphere thick with unspoken tensions and the weight of expectations.. Camera angle: As a writer enters this space, they should feel the palpable tension, as if the walls themselves are eavesdropping on the characters' hidden truths.. Era: In this era of class anxiety, the drawing room reflects the rigid social structures that govern interactions among the wealthy.

The Study: The study holds an air of secrecy, filled with the scent of old books and the echoes of unspoken thoughts, creating an environment ripe for discovery and hidden truths waiting to be unearthed.. Camera angle: Entering the study invites a sense of curiosity and anticipation, as if each object holds a story waiting to be revealed.. Era: This location embodies the intellectual pursuits of the time, where the weight of knowledge clashes with the urgency of the present.

The Kitchen: The kitchen buzzes with life and warmth, yet beneath the surface, there is an undercurrent of tension as staff navigate their roles within the household, balancing duty and ambition.. Camera angle: The writer should capture the kitchen’s vibrant energy while also hinting at the complexities of social hierarchies at play.. Era: In this era, the kitchen is a hub of activity, reflecting the stark contrast between the staff's struggles and the family's opulence.

## Humour guidance for this story position (opening)
Permission: permitted
Rationale: Eleanor's understated humour can lighten the mood as she navigates social expectations.

FAIR-PLAY AND INFERENCE CONTRACT (from CML logic):
- False assumption in force: The clock in the library accurately reflects the time of death.
- Hidden truth to progressively expose: The tampering of the clock misleads everyone about the actual timeline.
- Inference path checkpoints to dramatize clearly (observation -> correction -> effect):
  - Step 1: obs: The clock in the library shows ten minutes past eleven at the time of discovery. | corr: The time displayed by the clock may not be accurate. | effect: Narrows the investigation focus to the clock itself.
  - Step 2: obs: Dr. Finch claims he was with Eleanor until ten minutes to eleven. | corr: Dr. Finch's alibi may conflict with the clock's time. | effect: Eliminates Dr. Finch as a credible witness.
  - Step 3: obs: There are unusual wear patterns on the clock's winding mechanism. | corr: The clock has been tampered with, indicating foul play. | effect: Narrows suspect actions to those who had access to the clock.
  - Step 4: obs: The clock stopped at an earlier time than it should have. | corr: The time discrepancy directly affects the timeline of the murder. | effect: Implies that the time of death was earlier than reported.
- Discriminating test method: trap
- Discriminating test design constraint: A reenactment is staged where the clock is compared to a known accurate timepiece, revealing the tampering.
- Test must rely on already-shown clue IDs: clue_1, clue_2, clue_3, clue_6
- Fair-play rationale: Step 1: The clock's displayed time (early) and witness accounts (mid) show inconsistencies. Step 2: Dr. Finch's alibi (mid) eliminates him. Step 3: The tampering evidence (discriminating test) clearly identifies Captain Hale.
- Never solve by withheld information. Keep reader-information parity with detective reasoning.

## Character Reference

### Eleanor Voss
Eleanor speaks with a refined cadence, often punctuating her sentences with soft laughter or sighs, as if her words are carefully chosen to reflect the elegance she wishes to project, even when anxiety gnaws at her.
Eleanor faces a moral dilemma that pits her need for survival against her desire to uphold the family's dignity, teetering on the edge of desperation.

### Dr. Mallory Finch
Mallory speaks with a measured tone, often employing medical jargon when nervous, but she has a knack for dry humor, using it as a shield against the emotional turmoil that threatens to surface.
Mallory is torn between her love for the victim and her professional integrity, caught in a web of conflicting loyalties that threatens to unravel her carefully constructed life.

### Captain Ivor Hale
Ivor speaks with a clipped, authoritative tone, often punctuating his statements with dry humor that hints at his frustrations and disappointments, his words laced with an air of command.
Ivor is torn between his disillusionment with the world around him and a longing for the glory days of his youth, grappling with the realization that the past may never return.

### Beatrice Quill
Beatrice speaks with an enthusiastic cadence, often punctuating her sentences with exclamations and an eagerness that belies her more calculating nature, occasionally revealing her bluntness when pressed.
Beatrice grapples with the realization that her ambition may lead her down a dark path, forcing her to confront the cost of her desires and the potential fallout of her actions.



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

Primary Location: Middleton Hall (Little Middleton, England)
Middleton Hall, an imposing manor house, stands as a testament to the wealth and secrets of its owners, surrounded by sprawling gardens and meticulously kept grounds.

Key Locations Available:
- The Drawing Room (interior): Gathering space
- The Study (interior): Clue discovery
- The Kitchen (interior): Clue discovery

Atmosphere: Tense, with underlying class anxieties and secrets
Weather: Overcast with a chance of rain, typical for the season

Era markers: Petrol automobiles parked along the gravel driveway | Typewriters clacking in the study, echoing the urgency of written correspondence | Rotary dial telephones resting on ornate side tables, connecting the estate to the outside world

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
  - Visual: The rich hues of the wallpaper, now dulled with age, create a cozy yet melancholic atmosphere, while the flickering light from the fireplace casts dancing shadows across the room., A collection of family portraits adorn the walls, their solemn expressions seeming to scrutinize every conversation held beneath their gaze.
  - Sounds: The soft crackle of the fireplace competes with the muted conversations of guests, creating a symphony of intrigue that echoes through the room., Occasionally, the distant sound of laughter from the garden breaks through, a reminder of the life outside the drawing room's heavy doors.
  - Scents: The scent of aged leather from the armchairs mingles with the faint fragrance of burning wood, creating an inviting yet somber air., Hints of lavender from the potpourri placed strategically around the room offer a subtle contrast to the heavier scents of the manor.
  - Touch: The plush texture of the armchairs invites guests to sink into their depths, while the coolness of the marble fireplace provides a stark contrast., The polished wooden table feels smooth beneath fingertips, yet the weight of the secrets it bears is palpable.

The Study (interior):
  - Visual: The study is a chaotic yet inviting space, with stacks of books teetering precariously beside a globe that has seen better days, hinting at the interests of its occupant., Sunlight filters through the curtain, casting a muted glow over the desk and illuminating the dust motes that dance in the air.
  - Sounds: The rhythmic clacking of the typewriter fills the room, punctuated by the occasional rustle of papers as ideas are hastily jotted down., Outside, the faint sound of birds chirping provides a stark contrast to the focused silence within the study.
  - Scents: The scent of aged paper and leather bindings permeates the air, a reminder of the countless stories contained within the books that line the shelves., A hint of tobacco smoke lingers, a testament to the late-night musings of the study's frequent occupant.
  - Touch: The smooth surface of the desk contrasts with the rough texture of the books piled atop it, creating
[truncated for prompt budget]

## Texture Pool
Draw on these as opportunities arise — you are not required to use them.

- In January 1930, the weight of the ongoing Great Depression permeates every aspect of life in England
- The air is thick with uncertainty, as families struggle to make ends meet amidst rising unemployment and economic despair
- Social gatherings, once vibrant celebrations of wealth and status, now feel strained and hollow, serving as reminders of what has been lost
- The chilly winter weather adds to the somber mood, with overcast skies and intermittent rain mirroring the collective anxiety that grips the nation
- Short days mean that darkness falls early, casting long shadows that amplify the sense of foreboding

TEMPORAL CONTEXT:

This story takes place in January 1930 during winter.

Seasonal Atmosphere:
- Weather patterns: overcast skies, chilly temperatures, occasional rain showers
- Daylight: Short days with daylight fading by 4:30 PM, leaving long, dark evenings.
- Seasonal activities: indoor gatherings by the fireplace, playing parlor games, reading novels by candlelight
- Seasonal occasions: New Year's Day (January 1)
- Season: winter

Period Fashion (describe naturally):
- Men formal: tailored wool three-piece suit, crisp white dress shirt, silk tie with geometric patterns
- Men casual: tweed jacket, corduroy trousers, woolen sweater
- Men accessories: pocket watch, felt fedora, leather gloves
- Women formal: elegant drop-waist evening gown, embroidered silk shawl, cloche hat
- Women casual: knitted cardigan, tea-length dress with floral patterns, ankle boots
- Women accessories: string of pearls, feathered headband, leather handbag

Cultural Context (reference naturally):
- Music/entertainment: 'My Blue Heaven' by Gene Austin, 'Ain't She Sweet' by Milton Ager, 'The Birth of the Blues' by Paul Whiteman; Films: 'The Love Parade', 'The Big House'; Theatre: 'The Front Page', 'The Royal Family'; Radio: Amos 'n' Andy, The Shadow
- Typical prices: Loaf of bread: four pence, Eggs (dozen): one shilling, Coal (scuttle): one shilling sixpence
- Current events: The Great Depression continues to impact economies globally; Unrest in Europe with rising unemployment rates
- Literature: 'Murder in the Cathedral' by T.S. Eliot | 'The Maltese Falcon' by Dashiell Hammett | 'The Great Gatsby' by F. Scott Fitzgerald | [mystery novels] | [social realism] | [adventure fiction]
- Technology: the electric refrigerator gaining popularity | increased use of the gramophone | the development of early sound recording techniques | typewriters | home telephones | petrol automobiles
- Daily life: gathering for tea in the afternoon, attending local dances or social events, participating in charitable activities
- Social rituals: formal dinner parties, afternoon tea gatherings, Sunday church services

Atmospheric Details:
The smell of burning wood mingled with dampness as the fire crackled in the grand hall. The muffled sound of rain tapping against the windowpanes creates a tense, foreboding atmosphere. Chilly drafts seep through old wooden doors, heightening the sense of unease among the guests.

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
1. Date references: Mention month/season at least once early in story
2. Fashion descriptions:
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

• [clue_1] The clock in the library shows ten minutes past eleven at the time of discovery.
  Category: temporal | Criticality: essential | Supports inference step 1
  Points to: The time of discovery is established.

• [clue_2] The time displayed by the clock may not be accurate.
  Category: temporal | Criticality: essential | Supports inference step 1
  Points to: The clock's time cannot be trusted.

• [clue_3] Dr. Finch claims he was with Eleanor until ten minutes to eleven.
  Category: temporal | Criticality: essential | Supports inference step 2
  Points to: Dr. Finch's timeline is established.

• [clue_4] Dr. Finch's alibi may conflict with the clock's time.
  Category: temporal | Criticality: essential | Supports inference step 2
  Points to: Dr. Finch's alibi is questionable.

• [clue_core_contradiction_chain] The time displayed by the clock may not be accurate.
  Category: temporal | Criticality: essential | Supports inference step 1
  Points to: The clock's time cannot be trusted.

• [clue_mechanism_visibility_core] A mechanical clock was wound back to create a false time of death.
  Category: temporal | Criticality: essential | Supports inference step 1
  Points to: The method of deception is revealed.

• [clue_8] The time discrepancy directly affects the timeline of the murder.
  Category: temporal | Criticality: essential | Supports inference step 4
  Points to: The timeline of the murder is questionable.

• [clue_culprit_direct_captain_ivor_hale] Direct evidence ties Captain Ivor Hale to the mechanism access point before the discriminating test.
  Category: behavioral | Criticality: essential | Supports inference step 4
  Points to: This direct evidence shows Captain Ivor Hale had means and opportunity, narrowing the solution uniquely toward the culprit.

• [clue_core_elimination_chain] Eliminates Dr. Mallory Finch because he was seen leaving the library at eleven o'clock.
  Category: testimonial | Criticality: essential | Supports inference step 3
  Points to: Dr. Mallory Finch's alibi is corroborated.

• [clue_5] There are unusual wear patterns on the clock's winding mechanism.
  Category: temporal | Criticality: essential | Supports inference step 3
  Points to: The clock may have been manipulated.

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
Known location profile anchors: Middleton Hall, The Drawing Room, The Study, The Kitchen, the library in Little Middleton
LOCATION NAME CAPITALISATION (HARD REQUIREMENT — validated):
All named locations in your prose MUST use the EXACT capitalisation from the CML profiles.
Canonical forms: "Middleton Hall", "The Drawing Room", "The Study", "The Kitchen", "the library in Little Middleton"
Writing a location in lowercase (e.g. "drawing room" instead of "Drawing Room") is a validated error. Every time you mention a named location, copy its capitalisation from the list above.
- Chapter 1: OPENING STYLE (HARD): Start the VERY FIRST SENTENCE with a named character performing a physical action or motion — e.g. "[Name] crossed the threshold…" / "[Name] set down the glass…" / "[Name] rose from the chair…". Anchor opening in "the library in Little Middleton". HARD REQUIREMENT for the first 2 paragraphs: (a) include 2+ sensory words — choose from smell/scent/sound/echo/silence/creak/whisper/cold/warm/damp/rough/smooth/glow/shadow/flicker/dim — and (b) include 1+ atmosphere/time word — choose from rain/wind/fog/storm/mist/thunder/evening/morning/night/dawn/dusk/season/afternoon/midday/noon/midnight/twilight/sunrise/sunset/daylight/sunlight/overcast/cloudy/bright/dark. These are validated requirements, not style suggestions; missing them triggers a retry.

PROMPT BUDGET SUMMARY: budget=32000 tokens; fixed=6168; context=9578; dropped=[none]; truncated=[location_profiles, temporal_context]

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
8. Integrate at least two concrete era-grounded details per chapter from setting refinement signals: petrol automobiles on gravel driveways | typewriters in offices | home telephones with rotary dials | party-line telephone exchanges | telegram services available in nearby towns | airmail for urgent correspondence.
9. Respect setting movement/access constraints in scene action and alibis: manor's architecture creates limited access to certain areas | large gardens and hedges obstruct visibility | weather can hinder outdoor evidence collection | restricted areas for staff and guests | scheduled routines limiting movement.
10. Sustain social coherence with this backdrop pressure: A family gathering for a contentious estate meeting amidst the Great Depression forces the wealthy and their staff into a tense standoff over inheritance and privilege.
11. Maintain continuity around these socially central cast anchors where relevant: Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill.
12. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Critical: Plot similarity 0.80 with 'The Mysterious Affair at Styles' (same temporal axis and crime method)
13. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Moderate: Setting similarity 0.85 with 'The Mysterious Affair at Styles' (similar era and location type)
14. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Moderate: Solution similarity 0.90 with 'The Mysterious Affair at Styles' (similar false assumption and discriminating test)

CRITICAL PROSE REQUIREMENTS:

The CML specifies exact requirements for certain validation-critical scenes. You MUST include these elements at the specified positions.

**Discriminating Test Scene (Act 3, Scene 2):**
Required elements: Execute the discriminating test, Observe the clock's tampering evidence, Draw conclusion about Captain Hale's guilt
Test type: trap

**Suspect Clearance Scenes:**
- Dr. Mallory Finch (Act 3, Scene 3): Proves his alibi through time discrepancies.
  Clues: clue_1, clue_2
- Beatrice Quill (Act 3, Scene 4): Her loyalty to Eleanor removes her as a suspect.
  Clues: clue_1, clue_2

**Culprit Revelation Scene (Act 3, Scene 5):**
Method: Confrontation with evidence of clock tampering.

**Clue Placement for These Chapters:**
- clue_1 must appear in Act 1, Scene 1 via Direct observation of the clock
- clue_2 must appear in Act 1, Scene 1 via Witness statements
- clue_3 must appear in Act 1, Scene 1 via Clock mechanism examination
- clue_4 must appear in Act 1, Scene 1 via Cross-check contradiction
- clue_core_contradiction_chain must appear in Act 1, Scene 1 via Cross-check contradiction
- clue_mechanism_visibility_core must appear in Act 1, Scene 1 via Direct observation

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
  - Location anchor: the library in Little Middleton.
  - Opening atmosphere (MANDATORY — validator enforced): the first paragraph MUST contain at least one of: rain / wind / fog / storm / mist / thunder / evening / morning / night / dawn / dusk / season / afternoon / midday / noon / midnight / twilight / sunrise / sunset / daylight / sunlight / overcast / cloudy / bright / dark. A chapter that omits all of these from its opening paragraph will be rejected.
  - CLUE OBLIGATIONS — mandatory prose elements (do NOT omit or bury):
    • The clock in the library shows ten minutes past eleven at the time of discovery. [clue_1] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: The time of discovery is established.
      ↳ MANDATORY TWO-PARAGRAPH STRUCTURE (must appear in paragraphs 1 or 2 — no later):
         Paragraph 1: The POV character physically approaches or directly observes this evidence.
           The narration or dialogue explicitly states what is seen (use the exact locked phrase if one applies).
         Paragraph 2 (immediately following): The detective or POV character explicitly reasons
           about what this evidence implies — who it implicates, why it may be unreliable,
           or what inference it supports. This must be a separate full paragraph, not a sentence appended to Paragraph 1.
    • The time displayed by the clock may not be accurate. [clue_2] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: The clock's time cannot be trusted.
      ↳ MANDATORY TWO-PARAGRAPH STRUCTURE (must appear in paragraphs 1 or 2 — no later):
         Paragraph 1: The POV character physically approaches or directly observes this evidence.
           The narration or dialogue explicitly states what is seen (use the exact locked phrase if one applies).
         Paragraph 2 (immediately following): The detective or POV character explicitly reasons
           about what this evidence implies — who it implicates, why it may be unreliable,
           or what inference it supports. This must be a separate full paragraph, not a sentence appended to Paragraph 1.
    • Dr. Finch claims he was with Eleanor until ten minutes to eleven. [clue_3] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: Dr. Finch's timeline is established.
      ↳ MANDATORY TWO-PARAGRAPH STRUCTURE (must appear in paragraphs 1 or 2 — no later):
         Paragraph 1: The POV character physically approaches or directly observes this evidence.
           The narration or dialogue explicitly states what is seen (use the exact locked phrase if one applies).
         Paragraph 2 (immediately following): The detective or POV character explicitly reasons
           about what this evidence implies — who it implicates, why it may be unreliable,
           or what inference it supports. This must be a separate full paragraph, not a sentence appended to Paragraph 1.
    • Dr. Finch's alibi may conflict with the clock's time. [clue_4] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: Dr. Finch's alibi is questionable.
      ↳ MANDATORY TWO-PARAGRAPH STRUCTURE (must appear in paragraphs 1 or 2 — no later):
         Paragraph 1: The POV character physically approaches or directly observes this evidence.
           The narration or dialogue explicitly states what is seen (use the exact locked phrase if one applies).
         Paragraph 2 (immediately following): The detective or POV character explicitly reasons
           about what this evidence implies — who it implicates, why it may be unreliable,
           or what inference it supports. This must be a separate full paragraph, not a sentence appended to Paragraph 1.
    • The time displayed by the clock may not be accurate. [clue_core_contradiction_chain] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: The clock's time cannot be trusted.
      ↳ MANDATORY TWO-PARAGRAPH STRUCTURE (must appear in paragraphs 1 or 2 — no later):
         Paragraph 1: The POV character physically approaches or directly observes this evidence.
           The narration or dialogue explicitly states what is seen (use the exact locked phrase if one applies).
         Paragraph 2 (immediately following): The detective or POV character explicitly reasons
           about what this evidence implies — who it implicates, why it may be unreliable,
           or what inference it supports. This must be a separate full paragraph, not a sentence appended to Paragraph 1.
    • A mechanical clock was wound back to create a false time of death. [clue_mechanism_visibility_core] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: The method of deception is revealed.
      ↳ MANDATORY TWO-PARAGRAPH STRUCTURE (must appear in paragraphs 1 or 2 — no later):
         Paragraph 1: The POV character physically approaches or directly observes this evidence.
           The narration or dialogue explicitly states what is seen (use the exact locked phrase if one applies).
         Paragraph 2 (immediately following): The detective or POV character explicitly reasons
           about what this evidence implies — who it implicates, why it may be unreliable,
           or what inference it supports. This must be a separate full paragraph, not a sentence appended to Paragraph 1.
    • The time discrepancy directly affects the timeline of the murder. [clue_8]
      Points to: The timeline of the murder is questionable.
    • Direct evidence ties Captain Ivor Hale to the mechanism access point before the discriminating test. [clue_culprit_direct_captain_ivor_hale]
      Points to: This direct evidence shows Captain Ivor Hale had means and opportunity, narrowing the solution uniquely toward the culprit.
    • Eliminates Dr. Mallory Finch because he was seen leaving the library at eleven o'clock. [clue_core_elimination_chain]
      Points to: Dr. Mallory Finch's alibi is corroborated.
    • There are unusual wear patterns on the clock's winding mechanism. [clue_5]
      Points to: The clock may have been manipulated.
  - Tonal contrast: include at least one beat of relief or ironic counterpoint. Do not sustain maximum tension for every paragraph.
- Locked fact phrase obligations:
  - If this batch mentions The exact time shown on the stopped clock face, write exactly: "ten minutes past eleven".
  - If this batch mentions The exact amount the clock was wound back, write exactly: "forty minutes".
- Seasonal vocabulary allow-list: winter, wintry, midwinter.
- Forbidden seasonal words: spring, summer, autumn.

FROZEN TIMELINE STATE (DO NOT ALTER):
- Timeline anchor: January (winter).
- Month, season, weather, and time-of-year language in this batch must stay compatible with winter.
- Established timeline fact: Eleanor's last known alive time at ten minutes to eleven.
- Established timeline fact: The clock showing ten minutes past eleven when found.
- If referenced, use exact time phrase: "ten minutes past eleven" (The exact time shown on the stopped clock face).
- If referenced, use exact time phrase: "forty minutes" (The exact amount the clock was wound back).

STORY TO DATE (REFERENCE ONLY — DO NOT COPY VERBATIM):
- No previous chapter text exists yet for this batch.

# Case Overview
Title: The Timed Deception
Era: 1930s
Setting: Little Middleton
Crime: murder (mechanical tampering)
Culprit: Captain Ivor Hale
False assumption: The clock in the library accurately reflects the time of death.
Cast: Eleanor Voss (she/her), Dr. Mallory Finch (she/her), Captain Ivor Hale (he/him), Beatrice Quill (she/her)

Setting Lock: Keep all scenes and descriptions consistent with the stated setting (Little Middleton). Do not introduce a different location type.

Outline scenes:
[
  {
    "sceneNumber": 1,
    "act": 1,
    "title": "Discovery",
    "setting": {
      "location": "the library in Little Middleton",
      "timeOfDay": "Morning after the murder",
      "atmosphere": "Tense household, filled with shock and confusion"
    },
    "characters": [
      "Eleanor Voss",
      "Captain Ivor Hale",
      "Dr. Mallory Finch",
      "Beatrice Quill"
    ],
    "purpose": "Introduce the crime and initial shock among the characters",
    "cluesRevealed": [
      "clue_1",
      "clue_2",
      "clue_3",
      "clue_4",
      "clue_core_contradiction_chain",
      "clue_mechanism_visibility_core",
      "clue_8",
      "clue_culprit_direct_captain_ivor_hale",
      "clue_core_elimination_chain",
      "clue_5"
    ],
    "dramaticElements": {
      "conflict": "The immediate aftermath of the crime creates suspicion among the characters.",
      "tension": "The clock showing ten minutes past eleven raises questions about the time of death.",
      "microMomentBeats": [
        "Eleanor glances at the clock, her heart racing as she realizes the implications."
      ]
    },
    "summary": "In the library of Little Middleton, Eleanor Voss discovers a body. The atmosphere is thick with shock as the captain Hale, the doctor Finch, and Beatrice Quill gather, each grappling with their own reactions. The clock shows ten minutes past eleven, raising immediate questions about the time of death.",
    "estimatedWordCount": 2000,
    "emotionalRegister": "The story opens on a note of superficial tranquility, masking the underlying tensions of wealth and desperation.",
    "dominantCharacterNote": {
      "name": "Eleanor Voss",
      "voiceRegister": "Eleanor speaks with a refined cadence, often punctuating her sentences with soft laughter or sighs, her words carefully chosen to reflect the elegance she wishes to project."
    },
    "humourGuidance": {
      "permission": "permitted"
    },
    "eraTextureNote": "Limited resources for transportation, making travel difficult.; Short daylight hours leave little time for outdoor activities.; Chilly temperatures force gatherings indoors, heightening tensions.; Communication relies heavily on letters and limited telephone access.; Social events require adherence to strict etiquette and class norms.",
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
□ Chapter 1: "The clock in the library shows ten minutes past eleven at the time of discovery." is placed in the first 25% of the chapter, followed by an explicit inference or suspicion paragraph.
□ Chapter 1: "The time displayed by the clock may not be accurate." is placed in the first 25% of the chapter, followed by an explicit inference or suspicion paragraph.
□ Chapter 1: "Dr. Finch claims he was with Eleanor until ten minutes to eleven." is placed in the first 25% of the chapter, followed by an explicit inference or suspicion paragraph.
□ Chapter 1: "Dr. Finch's alibi may conflict with the clock's time." is placed in the first 25% of the chapter, followed by an explicit inference or suspicion paragraph.
□ Chapter 1: "The time displayed by the clock may not be accurate." is placed in the first 25% of the chapter, followed by an explicit inference or suspicion paragraph.
□ Chapter 1: "A mechanical clock was wound back to create a false time of death." is placed in the first 25% of the chapter, followed by an explicit inference or suspicion paragraph.
□ PRONOUN AUDIT — for every character you named in your chapters, list the pronouns you actually used, then verify against the canonical table. Correct any mismatch before outputting. Do NOT include this audit in your JSON output.
  Character            | Canonical     | Used in draft | Match?
  ---------------------|---------------|---------------|-------
  Eleanor Voss         | she/her/her/herself       | [fill in]     | [yes/no]
  Dr. Mallory Finch    | she/her/her/herself       | [fill in]     | [yes/no]
  Captain Ivor Hale    | he/him/his/himself        | [fill in]     | [yes/no]
  Beatrice Quill       | she/her/her/herself       | [fill in]     | [yes/no]
□ Return valid JSON only.
```
