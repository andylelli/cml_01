# Actual Prompt Record

- Run ID: `mystery-1778530512992`
- Project ID: ``
- Timestamp: `2026-05-11T20:22:31.281Z`
- Agent: `Agent9-ProseGenerator-Ch6`
- Operation: `chat_request_full_prompt`
- Model: `GPT-4o-mini`
- Temperature: `0.42`
- Max Tokens: `4500`
- Attempt: `first`
- Prompt Hash: `9fc2015ab8b9dd21`

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
- MORAL COMPLEXITY REQUIREMENT: The mechanism of this crime carries a moral gray area: "The murderer acted out of desperation to protect a loved one, blurring the lines of justice." — the culprit reveal and denouement MUST acknowledge this ambiguity. Do not let the ending feel clean or simple. Give the reader at least one moment of uncomfortable sympathy or moral doubt.


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

## Era: 1933, October
In October 1933, the English countryside is cloaked in a muted palette of browns and oranges, with overcast skies that threaten rain at any moment. The brisk air carries a distinct chill that seeps into every corner of the grand country house estate, where guests gather for a weekend retreat. As twilight descends earlier in the day, the atmosphere grows thick with tension, reflecting the underlying unease of a society grappling with the repercussions of an ongoing economic depression and the specter of rising fascism across the channel. Each day is marked by whispers of class disparity and financial strain, as the upper class struggles to maintain appearances while the lower class faces dire consequences. The Great Depression casts a long shadow over social interactions, where every laugh feels strained, and every conversation is tinged with anxiety. Guests at Little Middleton Manor, adorned in their finery, navigate the delicate balance of social expectations against the harsh realities of their lives. The air is heavy with the scent of damp earth and the distant sound of thunder adds to the oppressive atmosphere, reminding all that beneath the surface of elegance lies a world fraught with secrets and fears.
Emotional register: A dominant sense of anxiety and urgency permeates society, as individuals grapple with their precarious social status.
Physical constraints: Limited communication due to the reliance on early home telephones. | Isolation from nearby towns due to poor transportation options. | Shortening daylight hours limiting evening activities.
Current tensions (weave into background texture): The Great Depression continues to affect economies worldwide. | Political instability in Germany as Hitler consolidates power. | The British government debates further measures to address unemployment.
Wartime context — Many men returning from service face unemployment and mental health issues.: Communities are strained, with soldiers struggling to reintegrate into civilian life. Absence effect: The absence of many men during wartime has disrupted family dynamics, leading to a tense atmosphere.

## Season Lock (mandatory — derived from 1933, October)
Season: autumn. Allowed vocabulary: autumn, autumnal, fall
Forbidden seasonal words — never use in narration, dialogue, or metaphor: spring, summer, winter and their adjectival forms.
Every weather description, atmosphere, and time-of-year reference must be consistent with autumn.

## Story Theme
The story explores how the facades of respectability in a crumbling social order can mask deep-seated secrets, leading to moral dilemmas and tragic consequences, and reveals that evidence carries ethical weight, forcing characters to choose accountability over social performance when appearances and facts collide.

## Story Emotional Register
Dominant: The overall emotional character of the story is one of tension and unease, punctuated by moments of revelation and introspection.

Arc:
The story begins at Little Middleton Manor, where Eleanor Voss hosts a family reunion amidst the backdrop of the Great Depression. Laughter and music fill the air, but beneath the surface, a sense of unease simmers as Eleanor grapples with her own secrets and the weight of her embezzlement. As the evening progresses, the tension rises when Eleanor is found dead in her study, and the investigation unfolds. Each character's hidden motives come to light, revealing their struggles against societal expectations and personal demons. The first turn occurs as the clock in the study becomes a focal point, its tampering leading to conflicting timelines and misunderstandings that deepen the mystery. The characters find themselves entangled in a web of suspicion, each fearing exposure of their own secrets. The mid-section sees the investigation intensify, with Dr.

Mallory Finch's nervous demeanor and Captain Hale's bravado causing friction among the guests. As evidence mounts, the emotional stakes rise, revealing the characters' vulnerabilities and desperation. The second turn occurs when the true nature of the clock's tampering is uncovered, linking it to Dr. Finch, whose motives are revealed as he faces the possibility of losing everything. The climax arrives when the evidence culminates in a confrontation, forcing Dr. Finch to confront his actions and the consequences of his choices. In the resolution, the remaining characters reflect on their own moral dilemmas, realizing that the facades they maintain are as fragile as the lives they lead. The emotional journey concludes with a somber acknowledgment of the secrets that bind them together and the haunting consequences of their actions.

## Emotional register at this point in the story
Suspicion mounts as personal motives are revealed, heightening the stakes for all.

## Character Portraits (appearance & era)

### Eleanor Voss
Eleanor Voss embodies the struggle of maintaining a façade of wealth and respectability amidst the economic strain of the Great Depression. Her desperate attempts to mask her financial troubles through embezzlement reflect the moral dilemmas faced by those in her social class, where appearances often take precedence over integrity.
Era intersection: Her private struggles with embezzlement intersect with the broader societal pressures of financial ruin.

### Captain Ivor Hale
Captain Ivor Hale represents the psychological scars left by war, battling PTSD while trying to uphold his reputation as a war hero. His internal conflict and paranoia underscore the societal pressures faced by returning soldiers, emphasizing the fragility of honor in a changing world.
Era intersection: His fear of being exposed connects with the broader theme of hidden trauma in a community still reeling from war.

### Beatrice Quill
Beatrice Quill, as a maid, reveals the struggles of the lower class amidst the upper class's façade. Her desperate measures to support her family by stealing reflect the moral compromises individuals make under the strain of economic hardship, emphasizing the divide between the classes.
Era intersection: Her actions highlight the harsh realities faced by working-class individuals during the Great Depression.

## Character Voices

### Eleanor Voss (she/her/her)
Eleanor speaks with a melodic cadence, exuding charm and confidence.
[comfortable] Oh, darling, isn't the evening just divine? I could float away on these lovely moments.
[evasive] I suppose every family has its little secrets, but we mustn't dwell on such things tonight.
[stressed] What if they find out? I can't let my world crumble, not now!
Humour: Her observational humor often surfaces during social gatherings, deflecting suspicion.

### Captain Ivor Hale (he/him/his)
Captain Hale's commanding voice carries a weight of authority and experience.
[comfortable] In my day, we faced much worse and emerged stronger for it.
[evasive] The past is the past; what matters is how we present ourselves now.
[stressed] If they discover the truth, it could ruin everything I’ve built!
Humour: His sardonic remarks often serve as a defense mechanism against his inner turmoil.

### Beatrice Quill (she/her/her)
Beatrice speaks softly, her voice often laced with nervousness.
[comfortable] I do love the way the light dances in the garden; it makes me feel at peace.
[evasive] Oh, it’s nothing really, just a little something I found lying around.
[stressed] Please, you must believe me. I only wanted to help my family!
Humour: Her self-deprecating humor often emerges in uncomfortable situations, reflecting her outsider status.

## Location Registers (scene framing guides)

Drawing Room: The drawing room serves as a stage for unspoken dramas, where laughter masks the tension and every glance carries the weight of hidden truths. Guests feel the pressure of societal expectations, where every interaction is a performance in a play of intrigue.. Camera angle: A close-up of flickering candlelight juxtaposed with the anxious faces of the guests sets the scene for the unfolding mystery.. Era: The oppressive atmosphere of the Great Depression looms even in the elegance of the drawing room.

Library: The library stands as a sanctuary of knowledge and secrecy, filled with the whispers of the past. It feels both inviting and foreboding, where the weight of history hangs heavy in the air, creating an atmosphere ripe for revelation amidst the shadows.. Camera angle: A wide shot captures the dimly lit shelves, inviting the reader to explore the depths of hidden knowledge.. Era: The era's reliance on literature for escapism reflects the characters' desires to find solace in stories.

Cellar: The cellar's dim ambiance and cool, musty air evoke a sense of dread, serving as the heart of the mystery. It's a place where the weight of secrets feels palpable, amplifying the tension as shadows loom larger in the corners.. Camera angle: A low-angle shot emphasizes the oppressive shadows, enhancing the feeling of entrapment within the walls.. Era: The cellar's isolation reflects the characters' internal struggles against the backdrop of societal pressures.

Gardens: The gardens, with their vibrant colors, offer a deceptive beauty that contrasts with the underlying tension of the manor. Here, the gentle rustle of leaves mingles with the whispers of secrets, creating an atmosphere that is both serene and ominous, inviting exploration yet hinting at danger.. Camera angle: A sweeping shot captures the juxtaposition of the vibrant gardens against the looming dark woods, symbolizing hidden threats.. Era: The seasonal transition mirrors the characters' internal conflicts as they navigate their own changes.

## Humour guidance for this story position (mid)
Permission: conditional — condition: only light humor about the dynamics among characters
Characters who may be funny: Captain Ivor Hale
Rationale: Captain Hale's sardonic remarks can provide levity while tensions rise.

## Character Pressure
Dr. Mallory Finch is approaching a point of breakdown. Stress and strain should be accumulating visibly — through behaviour, not statement. No confrontation yet.

## Reveal Groundwork (texture — do not explain, only plant)
- Plant one subtle observable beat related to: "The earlier scene where Eleanor mingles with guests highlights her desperation to maintain her façade, which is further complicated by the discovery of her body". Do not explain significance yet.
- Plant one subtle observable beat related to: "Finch's nervous demeanor during the first interview retroactively casts suspicion on his character, suggesting that his anxiety may stem from more than just concern for the victim". Do not explain significance yet.
- Plant one subtle observable beat related to: "Lastly, Captain Hale's bravado in the garden becomes more poignant when his fears about exposure are revealed, illustrating the depths of his internal struggle". Do not explain significance yet.

FAIR-PLAY AND INFERENCE CONTRACT (from CML logic):
- False assumption in force: Eleanor's death occurred shortly after the clock chimed eleven.
- Hidden truth to progressively expose: The clock was tampered with to shift the timeline of the murder.
- Inference path checkpoints to dramatize clearly (observation -> correction -> effect):
  - Step 1: obs: The clock in the study shows ten minutes past eleven when found. | corr: The clock was tampered with to show a later time than actual time of death. | effect: Eliminates the possibility that Eleanor died at eleven.
  - Step 2: obs: Witnesses recall hearing the clock chime at unusual times. | corr: The clock malfunctioned due to tampering. | effect: Narrows the timeline of the murder.
  - Step 3: obs: Fingerprints found on the clock's winding key match Dr. Mallory Finch. | corr: Dr. Finch had access to the clock and had the opportunity to tamper with it. | effect: Narrows the suspect pool to Dr. Mallory Finch.
- Discriminating test method: trap
- Discriminating test design constraint: The discriminating test compares clock, study, and minut against the claimed timeline.
- Test must rely on already-shown clue IDs: clue_1, clue_2, clue_3, clue_7, clue_core_contradiction_chain
- Fair-play rationale: Step 1: The clock's face time (early) and witness accounts of chimes (mid) establish the timeline misrepresentation. Step 2: Fingerprint evidence eliminates other suspects and focuses on Dr. Finch. Step 3: The clock winding comparison reveals tampering.
- Never solve by withheld information. Keep reader-information parity with detective reasoning.

## Character Reference

### Eleanor Voss
Eleanor speaks with a melodic cadence, often punctuating her sentences with light laughter
She has a penchant for dramatic pauses, particularly when she wishes to draw attention to her charm or deflect suspicion.
Eleanor grapples with the tension of wanting to maintain her social facade while knowing that her actions are jeopardizing her integrity. Each interaction is laced with the fear that her secrets will be exposed.

### Captain Ivor Hale
Captain Hale speaks with a commanding authority, often punctuating his stories with sardonic remarks that reflect his disillusionment
His speech is marked by a rhythmic cadence, as if he were still addressing troops rather than friends.
Haunted by the memories of his military past, Captain Hale faces a profound internal conflict between the man he presents to the world and the soldier he once was. The fear of exposure amplifies his paranoia, creating a tempest within.

### Beatrice Quill
Beatrice speaks softly, often apologizing for her presence
Her sentences are punctuated with nervous laughter, and she tends to downplay her thoughts, reflecting her position as an outsider in the manor's elite world.
Beatrice grapples with the moral implications of her actions, torn between her love for her family and the shame of her theft. Each day, she faces the reality of her choices, creating a cycle of guilt and desperation.



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
An imposing manor shrouded in secrets, Little Middleton Manor stands isolated amidst its manicured gardens and dense woodlands, a perfect backdrop for intrigue.

Key Locations Available:
- Drawing Room (interior): Gathering space
- Library (interior): Clue discovery
- Cellar (interior): Crime scene
- Gardens (exterior): Clue discovery

Atmosphere: Tense and foreboding, reflecting the underlying class tensions and paranoia of the era.
Weather: Overcast with intermittent rain, typical of the English countryside in autumn.

Era markers: Petrol-powered automobiles parked in the courtyard, a sign of the family's wealth and status. | An early home telephone with a party line in the study, creating a sense of connectivity yet isolation. | Typewriters in the study, clacking away as urgent messages are composed amid the rising tensions.

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
Drawing Room (interior):
  - Visual: The rich, dark wood of the furniture contrasts with the vibrant colors of the floral patterns on the upholstery, creating a sense of opulence., Golden light spills from the chandelier overhead, illuminating dust motes that dance lazily in the air.
  - Sounds: The soft murmur of conversation fills the air, punctuated by the occasional laughter that feels strangely out of place., The distant crackle of the fire blends with the sound of the rain tapping against the windowpanes, creating a cozy yet unsettling symphony.
  - Scents: The scent of burning wood mingles with the faint aroma of aged leather from the books lining the shelves, creating an inviting yet mysterious atmosphere., Hints of lavender from the potpourri on the mantelpiece add a touch of floral sweetness that contrasts sharply with the tension in the room.
  - Touch: The plush fabric of the sofas invites weary guests to sink into their depths, offering a momentary escape from the tension outside., The chill of the air feels sharper near the windows, where the rain-soaked glass sends a shiver through anyone who dares to draw near.

Library (interior):
  - Visual: The dim light filtering through the tall windows casts elongated shadows across the room, creating an atmosphere of mystery and intrigue., Dust motes float lazily in the beams of light, illuminating the spines of books that range from history to fiction, each holding its own world within.
  - Sounds: The soft rustling of pages turning as a reader immerses themselves in a forgotten story, punctuated by the occasional creak of the floorboards., The rhythmic clacking of the typewriter adds an urgent cadence to the stillness, a reminder that words can shape destinies.
  - Scents: The rich, earthy scent of old books fills the air, mingling with the faintest hint of polish from the furniture, a testament to the care taken in this sanctuary., A subtle whiff of tobacco lingers from the last visitor, a trace of their presence that adds to the librar
[truncated for prompt budget]

## Texture Pool
Draw on these as opportunities arise — you are not required to use them.

- In October 1933, the English countryside is cloaked in a muted palette of browns and oranges, with overcast skies that threaten rain at any moment
- The brisk air carries a distinct chill that seeps into every corner of the grand country house estate, where guests gather for a weekend retreat
- As twilight descends earlier in the day, the atmosphere grows thick with tension, reflecting the underlying unease of a society grappling with the repercussions of an ongoing economic depression and the specter of rising fascism across the channel
- Each day is marked by whispers of class disparity and financial strain, as the upper class struggles to maintain appearances while the lower class faces dire consequences
- The Great Depression casts a long shadow over social interactions, where every laugh feels strained, and every conversation is tinged with anxiety

TEMPORAL CONTEXT:

This story takes place in October 1933 during N/A.

Seasonal Atmosphere:
- Weather patterns: overcast skies, intermittent rain, chilly breezes
- Daylight: Shortening days with twilight settling around five o'clock in the evening
- Seasonal activities: apple picking in local orchards, attending harvest festivals, preparing for Halloween with decorations
- Seasonal occasions: Halloween
- Season: N/A

Period Fashion (describe naturally):
- Men formal: three-piece tweed suits, wing-collared shirts, woolen overcoats
- Men casual: corduroy trousers, knit sweaters, flat caps
- Men accessories: pocket watches, silk ties, leather gloves
- Women formal: tea-length dresses with dropped waistlines, velvet evening gowns, tailored jackets
- Women casual: knitted cardigans, blouses with patterned skirts, long woolen scarves
- Women accessories: cloche hats, beaded handbags, string of pearls

Cultural Context (reference naturally):
- Music/entertainment: 'Smoke Gets in Your Eyes' by Jerome Kern, 'Night and Day' by Cole Porter, Swing Jazz gaining popularity; Films: 'King Kong' released this year, 'The Invisible Man'; Theatre: 'The Front Page', 'Pygmalion'; Radio: The BBC broadcasts news and entertainment programs, Musical variety shows growing in popularity
- Typical prices: Bread loaf: four pence, A new suit: three pounds, A movie ticket: six pence
- Current events: The Great Depression continues to affect economies worldwide; Political instability in Germany as Hitler consolidates power
- Literature: 'The Glass Key' by Dashiell Hammett | 'Murder in the Cathedral' by T.S. Eliot | 'The Maltese Falcon' by Dashiell Hammett | [detective fiction] | [social realism] | [political commentary]
- Technology: the first practical radio transceiver | the development of the first commercial flight services | the widespread use of the typewriter in homes and offices | manual typewriters | early home telephones | petrol-powered cars gaining prominence
- Daily life: going for walks in the countryside, attending local fairs and markets, visiting family and friends during weekends
- Social rituals: afternoon tea with family, weekly church services, evening gatherings for games and card playing

Atmospheric Details:
The scent of damp earth mingles with the crispness of fallen leaves as the rain sporadically taps against the windows. The dim light of oil lamps flickers, casting shadows that dance across the ornate wallpaper, enhancing the air of mystery within the country house. The distant sound of laughter from a harvest festival juxtaposes the tension inside, where whispers of class tensions and fears of the unknown linger.

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
- Class indicators:
[truncated for prompt budget]

NON-NEGOTIABLE CHAPTER OBLIGATIONS — LOCKED EVIDENCE PHRASES (VERBATIM REQUIRED):
The following physical evidence values are absolute ground truth. Every time this chapter describes, mentions, or alludes to the relevant evidence — no matter how briefly — it MUST use the exact phrase shown below, character for character. NO paraphrase, approximation, rounding, or synonym is permitted.

FAILURE EXAMPLE: if the locked value is "at thirteen minutes to midnight" and you write "just before midnight" or "around midnight" — that is a HARD FAIL. You must write "at thirteen minutes to midnight". Equally, if the locked value is written in words, such as "ten minutes past eleven", and you convert it to figure-based clock notation — that is also a HARD FAIL. Words stay as words; figure forms are forbidden for word-phrased facts.

CRITICAL — WORD-PHRASED VALUES: If the canonical value is written out in words (e.g. a time like "ten minutes past eleven", or an amount like "forty minutes"), reproduce those exact words. DO NOT convert to figure-based time notation, twenty-four-hour format, or any other numeric shorthand. Correct: "ten minutes past eleven". WRONG: figure-based clock notation or numeric shorthand.

Locked facts:
  - The exact time shown on the stopped clock face: "ten minutes past eleven"
  - The exact amount the clock was wound back: "forty minutes"
  - The time the murder was intended to appear as happening: "twenty minutes past ten"
  - The time the clock is supposed to chime after tampering: "eleven o'clock"

If a locked fact has no relevance to this chapter, omit it. But the moment you reference the underlying evidence, only the exact phrase above is acceptable.

⛔ CLUES TO SURFACE IN THESE CHAPTERS — mandatory:
The following evidence MUST be clearly observable to an attentive reader. Do not bury it in atmosphere or passing dialogue. Each clue must be concrete, specific, and noticeable:

• [clue_core_elimination_chain] Eliminates Captain Ivor Hale because he was seen at the tavern until midnight.
  Category: testimonial | Criticality: essential | Supports inference step 2
  Points to: Captain Ivor Hale has a corroborated alibi.

For each clue above: an attentive reader should be able to find, record, and later use it to reason toward the solution.

═══ NARRATIVE STATE (read-only — do not contradict) ═══

LOCKED FACTS — use verbatim whenever this evidence is described:
  • The exact time shown on the stopped clock face: "ten minutes past eleven"
  • The exact amount the clock was wound back: "forty minutes"
  • The time the murder was intended to appear as happening: "twenty minutes past ten"
  • The time the clock is supposed to chime after tampering: "eleven o'clock"

CHARACTER PRONOUNS — never deviate from these:
  • Eleanor Voss: she/her/her
  • Dr. Mallory Finch: he/him/his
  • Captain Ivor Hale: he/him/his
  • Beatrice Quill: she/her/her

CLUES ALREADY REVEALED TO READER: clue_mechanism_visibility_core, clue_core_contradiction_chain, clue_1, clue_2, clue_culprit_direct_dr_mallory_finch, clue_5, clue_8 — do not reveal these as new information.

CONTINUITY HANDOFF — previous chapter closing beat:
  • "The atmosphere in the study felt charged, as if the very walls were holding their breath, waiting for the truth to emerge. Hale could sense that they were on the brink of a breakthrough, but the path ahead was fraught with danger. He glanced at the clock once..."
  • The next chapter must open as a continuation of this beat, not as a disconnected reset.
═══════════════════════════════════════════════════════

═══════════════════════════════════════════════════════════
📚 CONTINUITY CONTEXT - CHARACTER & SETTING CONSISTENCY
═══════════════════════════════════════════════════════════

**CRITICAL: You are writing chapters 6+. Maintain consistency with earlier chapters.**

**Character Names Used in Chapters 1-5:**
Eleanor Voss, Beatrice Quill

✓ RULE: Use EXACTLY these names. Do NOT vary spelling, add titles, or introduce new forms.
✓ Example: if earlier chapters used "Clara Whitfield", keep using "Clara Whitfield" — never "Mrs. Whitfield" unless that is the character's canonical name in the list above.

**Setting Vocabulary Established in Earlier Chapters:**
study, kitchen, manor

✓ RULE: Continue using this location vocabulary. Maintain consistency with established setting type.
✓ Do NOT introduce new location types that contradict earlier chapters.

**Recent Chapter Summary (for narrative continuity):**
Chapter 3: Chapter 3: The Clock's Secret
  Events: Hale stepped closer to the clock, its presence looming large in the dim light of the study.
Chapter 4: Chapter 4: Beatrice's Alibi
  Events: The afternoon light struggled to pierce the heavy clouds hanging over Little Middleton, casting a dim glow over the tavern.
Chapter 5: Chapter 5: Dr. Finch's Confession
  Events: As the late afternoon light filtered into the study, the atmosphere felt heavy with unspoken secrets.

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
Known location profile anchors: Little Middleton Manor, Drawing Room, Library, Cellar, Gardens, the tavern
LOCATION NAME CAPITALISATION (HARD REQUIREMENT — validated):
All named locations in your prose MUST use the EXACT capitalisation from the CML profiles.
Canonical forms: "Little Middleton Manor", "Drawing Room", "Library", "Cellar", "Gardens", "the tavern"
Writing a location in lowercase (e.g. "drawing room" instead of "Drawing Room") is a validated error. Every time you mention a named location, copy its capitalisation from the list above.
- Chapter 6: OPENING STYLE: Atmospheric scene-setting is permitted here — but the first sentence MUST differ structurally from both the preceding and following chapters. Do not reuse the same clause structure or sensory vocabulary as adjacent chapters. Anchor opening in "the tavern". HARD REQUIREMENT for the first 2 paragraphs: (a) include 2+ sensory words — choose from smell/scent/sound/echo/silence/creak/whisper/cold/warm/damp/rough/smooth/glow/shadow/flicker/dim — and (b) include 1+ atmosphere/time word — choose from rain/wind/fog/storm/mist/thunder/evening/morning/night/dawn/dusk/season/afternoon/midday/noon/midnight/twilight/sunrise/sunset/daylight/sunlight/overcast/cloudy/bright/dark. These are validated requirements, not style suggestions; missing them triggers a retry.

[⚠ INTERNAL QUALITY DIAGNOSTICS — DO NOT REPRODUCE ANY PART OF THIS SECTION IN YOUR STORY OUTPUT. These are private generator observations for your consideration only. Your narrative must read as if this section does not exist. Never include phrases from this block in character dialogue, narration, or description.]

PRIOR CHAPTER QUALITY OBSERVATIONS:
- Chapter 4 (score 95/100):
  Quality gaps noted: word density below preferred target (889/1000)
  Address in upcoming chapters: Increase chapter density with concrete investigation action and sensory-grounded beats; avoid recap-only padding.
- Chapter 5 (score 98/100):
  Quality gaps noted: word density below preferred target (966/1000)
  Address in upcoming chapters: Increase chapter density with concrete investigation action and sensory-grounded beats; avoid recap-only padding.
- Phrases to avoid (already overused in earlier chapters): "last seen alive at ten forty five", "to create an alibi or shift the", "create an alibi or shift the blame", "the atmosphere in the study felt charged", "atmosphere in the study felt charged as", "in the study felt charged as if", "the study felt charged as if the", "were holding their breath waiting for the", "holding their breath waiting for the truth", "their breath waiting for the truth to".
[END INTERNAL DIAGNOSTICS]

PROMPT BUDGET SUMMARY: budget=32000 tokens; fixed=10811; context=10021; dropped=[none]; truncated=[location_profiles, temporal_context]

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
- Chapter numbering starts at 6 and increments by 1 per scene.
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
8. Integrate at least two concrete era-grounded details per chapter from setting refinement signals: petrol-powered automobiles for local travel | early home telephones with party lines | typewriters for correspondence | telegrams for urgent messages | aerogrammes for overseas correspondence | impact of the Great Depression on class structures.
9. Respect setting movement/access constraints in scene action and alibis: architectural layout creates natural barriers | weather influences outdoor evidence collection | specific movement patterns dictated by the estate's design | restricted areas such as the library and cellar | daily routines dictate access to certain rooms.
10. Sustain social coherence with this backdrop pressure: A gathering at the estate for a family reunion amidst the economic strain of the Great Depression and rising political tensions forces the heirs and staff into a tense atmosphere of suspicion and hidden motives.
11. Maintain continuity around these socially central cast anchors where relevant: Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill.
12. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Critical: Plot similarity 0.85 with 'The Mysterious Affair at Styles' (same temporal crime and victim method)
13. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Moderate: Setting similarity 0.90 with 'The Mysterious Affair at Styles' (same era and country manor setting)

CRITICAL PROSE REQUIREMENTS:

The CML specifies exact requirements for certain validation-critical scenes. You MUST include these elements at the specified positions.

**Discriminating Test Scene (Act 3, Scene 4):**
Required elements: Execute the discriminating test, Observe the culprit's reaction or result, Draw conclusion about guilt
Test type: trap

**Suspect Clearance Scenes:**
- Eleanor Voss (Act 3, Scene 5): She is the victim.
  Clues: clue_id_1, clue_id_2
- Beatrice Quill (Act 3, Scene 5): Alibi verified by others.
  Clues: clue_id_1, clue_id_2

**Culprit Revelation Scene (Act 3, Scene 6):**
Method: Confrontation with evidence

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
- Chapter 6:
  - Word count: Target 1250 words. Achieve this through plot events, dialogue exchanges, and physical investigation — not through atmospheric repetition or extended internal reflection. Each 200-word segment should contain at minimum one concrete story event (a discovery, a conversation exchange, a physical action or movement). Padding with atmosphere alone is not acceptable.
  - Location anchor: the tavern.
  - Opening atmosphere (MANDATORY — validator enforced): the first paragraph MUST contain at least one of: rain / wind / fog / storm / mist / thunder / evening / morning / night / dawn / dusk / season / afternoon / midday / noon / midnight / twilight / sunrise / sunset / daylight / sunlight / overcast / cloudy / bright / dark. A chapter that omits all of these from its opening paragraph will be rejected.
  - Continuity bridge: in the first 120 words, visibly connect from the previous chapter's final beat. Carry forward one unresolved element (object, accusation, emotional pressure, or immediate physical action) from: "The atmosphere in the study felt charged, as if the very walls were holding their breath, waiting for the truth to emerge. Hale could sense that they were on the brink of a breakthrough, but the path ahead was fraught wi...".
  - CLUE OBLIGATIONS — mandatory prose elements (do NOT omit or bury):
    • Eliminates Captain Ivor Hale because he was seen at the tavern until midnight. [clue_core_elimination_chain]
      Points to: Captain Ivor Hale has a corroborated alibi.
  - Tonal contrast: include at least one beat of relief or ironic counterpoint. Do not sustain maximum tension for every paragraph.
- Locked fact phrase obligations:
  - If this batch mentions The exact time shown on the stopped clock face, write exactly: "ten minutes past eleven".
  - If this batch mentions The exact amount the clock was wound back, write exactly: "forty minutes".
  - If this batch mentions The time the murder was intended to appear as happening, write exactly: "twenty minutes past ten".
  - If this batch mentions The time the clock is supposed to chime after tampering, write exactly: "eleven o'clock".
- Seasonal vocabulary allow-list: autumn, autumnal, fall.
- Forbidden seasonal words: spring, summer, winter.

FROZEN TIMELINE STATE (DO NOT ALTER):
- Timeline anchor: October (autumn).
- Month, season, weather, and time-of-year language in this batch must stay compatible with autumn.
- Established timeline fact: Eleanor was last seen alive at ten forty-five.
- Established timeline fact: The clock was found showing ten minutes past eleven.
- If referenced, use exact time phrase: "ten minutes past eleven" (The exact time shown on the stopped clock face).
- If referenced, use exact time phrase: "forty minutes" (The exact amount the clock was wound back).
- If referenced, use exact time phrase: "twenty minutes past ten" (The time the murder was intended to appear as happening).
- If referenced, use exact time phrase: "eleven o'clock" (The time the clock is supposed to chime after tampering).

STORY TO DATE (REFERENCE ONLY — DO NOT COPY VERBATIM):
- Full prior chapter text is provided below for continuity, factual consistency, and reference accuracy.
- Use this to keep character voice, chronology, clue state, and location continuity aligned with earlier chapters.
- Do not quote, copy, or paraphrase these paragraphs too closely; write fresh prose that remains consistent with them.

--- BEGIN PRIOR CHAPTER 1 ---
Title: Chapter 1: Discovery
The morning light filtered through the heavy drapes of the study of Eleanor Voss, casting a muted glow across the room. Outside, the rain fell steadily, a rhythmic patter against the windowpanes that seemed to echo the tension within. the captain Hale stood by the fireplace, his gaze fixed on the clock that hung above the mantelpiece. The clock's face was frozen, the hands pointing stubbornly to ten minutes past eleven. It was a time that now held a sinister weight, marking the moment when Eleanor's life had been extinguished. The air was thick with an unspoken dread, a palpable reminder of the tragedy that had unfolded within these walls just hours before.

As Captain Hale stepped closer to the clock, he felt a shiver run down his spine. The mechanism relies on the clock in the study to expose the false timing. It had been wound back, but to what purpose? She could not shake the feeling that the clock was more than just a timekeeper; it was a witness to Eleanor's final moments. The memory of its chime lingered in her mind, a haunting reminder of the life that had been lost. What had transpired in this room? Who had been here, and what secrets did the clock hold? Her thoughts raced as she considered the implications of its tampering. The timing of Eleanor's death was now shrouded in uncertainty, and every tick of the clock seemed to mock her with its silence.

the doctor Finch entered the study, his expression a mask of professionalism that barely concealed the turmoil beneath. He glanced at Captain Hale, who stood rigidly by the clock. 'What do we know so far?' he asked, his voice steady despite the chaos that swirled around them. Hale turned, his brow furrowing as he replied, 'Eleanor was last seen alive at ten forty-five. The clock shows ten minutes past eleven, but it was tampered with. We need to determine how and why.' Finch nodded, his mind racing with the implications. Every guest had access to this room, and each one had a motive, however concealed. The tension in the air was thick enough to slice through, and he could feel the weight of suspicion settling upon them all.

Beatrice Quill stood in the doorway, her hands clasped tightly in front of her. She had been summoned to the study, and the sight of the clock only intensified her unease. 'Is it true? Is she really...?' Her voice trailed off, the words catching in her throat. Captain Hale met his gaze, his expression softening momentarily. 'I'm afraid so, Beatrice. Eleanor is gone.' The gravity of the situation pressed down on her, and she felt the room close in around her. 'I was just in the kitchen,' she murmured, her voice barely above a whisper. 'I didn't hear anything.'

Hale's eyes narrowed as he considered his words. 'You were in the kitchen, you say? What time did you leave?' Beatrice hesitated, her mind racing. 'I... I don't know. I was preparing breakfast, and then... I came here when I was called.' The uncertainty in her voice only added to the tension in the room. Finch stepped forward, his analytical mind working through the puzzle. 'If the clock was tampered with, it could mean that someone wanted to create an alibi or shift the blame. We need to find out who had access to the clock and when.'

The atmosphere in the study felt charged, as if the walls themselves were holding their breath, waiting for the truth to emerge. Hale glanced at the clock once more, its hands frozen in time, a silent witness to the tragedy that had unfolded. 'We must act quickly,' he said, his voice firm. 'The detective will be here soon, and we need to have our stories straight. No one can afford to appear suspicious, not now.' Beatrice nodded, her heart racing as she tried to gather her thoughts. The weight of their shared secrets loomed over them, a dark cloud that threatened to consume them all.

As they stood in the study, the rain continued to fall outside, a relentless reminder of the world beyond the manor's walls. Each drop seemed to echo the unspoken fears that lingered in the air. The clock, with its frozen hands, was a stark reminder of the fragility of life, and the secrets that lay hidden within the shadows of Little Middleton Manor. The morning had begun with the promise of a family reunion, but it had quickly devolved into a nightmare, one that would unravel the very fabric of their lives.
--- END PRIOR CHAPTER 1 ---

--- BEGIN PRIOR CHAPTER 2 ---
Title: Chapter 2: Initial Interrogation
The late morning light struggled to penetrate the heavy clouds that loomed over Little Middleton Manor. In the study, the air was thick with tension, punctuated only by the relentless patter of rain against the windowpanes. the captain Hale stood near the clock, its frozen hands pointing stubbornly to ten minutes past eleven. The silence in the room felt oppressive, as if the very walls were holding their breath, waiting for the truth to unfold. Beatrice Quill shifted nervously in her seat, her fingers twisting the hem of her dress as she avoided the gaze of the men in the room. The atmosphere was charged with unspoken accusations, and every glance seemed to carry the weight of suspicion.

the doctor Finch entered the study, his expression a careful mask of professionalism that did little to conceal the turmoil beneath. He glanced at Captain Hale, who stood rigidly by the clock. "What do we know so far?" he asked, his voice steady despite the chaos that swirled around them. Hale turned, his brow furrowing as he replied, "Eleanor was last seen alive at ten forty-five. The clock shows ten minutes past eleven, but it was tampered with. We need to determine how and why." Finch nodded, his mind racing with the implications. The clock was tampered with to show a later time than actual time of death. Every guest had access to this room, and each one had a motive, however concealed. The tension in the air was thick enough to slice through, and he could feel the weight of suspicion settling upon them all.

The revelation of the clock's tampering sent a ripple of unease through the room. If Eleanor had died before the clock chimed, it would shift the entire timeline of events. Hale's eyes narrowed as he considered the implications. "We need to find out who had access to the clock and when. This could mean someone wanted to create an alibi or shift the blame. It’s crucial we determine the timeline of Eleanor's last moments." Beatrice swallowed hard, her heart racing as she tried to remember every detail of her movements that night. The weight of their shared secrets loomed over them, a dark cloud that threatened to consume them all.

Beatrice's voice trembled as she spoke. "I was just in the kitchen, preparing breakfast. I didn’t hear anything unusual. I came here when I was called." Hale's eyes bore into him, searching for any sign of deception. "What time did you leave the kitchen?" he pressed. Beatrice hesitated, her mind racing. "I... I don’t know. I was focused on the tasks at hand. I didn’t think to check the time." Her uncertainty only added to the tension in the room. Finch stepped forward, his analytical mind working through the puzzle. "If the clock was tampered with, it could mean that someone wanted to create an alibi or shift the blame. We need to find out who had access to the clock and when."

The atmosphere in the study felt charged, as if the walls themselves were holding their breath, waiting for the truth to emerge. Hale glanced at the clock once more, its hands frozen in time, a silent witness to the tragedy that had unfolded. "We must act quickly," he said, his voice firm. "The detective will be here soon, and we need to have our stories straight. No one can afford to appear suspicious, not now." Beatrice nodded, her heart racing as she tried to gather her thoughts. The weight of their shared secrets loomed over them, a dark cloud that threatened to consume them all. The rain continued to fall outside, a relentless reminder of the world beyond the manor's walls, each drop echoing the unspoken fears that lingered in the air.
--- END PRIOR CHAPTER 2 ---

--- BEGIN PRIOR CHAPTER 3 ---
Title: Chapter 3: The Clock's Secret
At midday, the rain continued to fall steadily against the windowpanes of the study, creating a rhythmic backdrop that underscored the tension in the room. Inside, the atmosphere felt thick with unease, as if the very air was charged with the weight of unspoken truths. Captain Hale stood near the clock, its face frozen in time, the hands stubbornly pointing to ten minutes past eleven. As he studied it, a chill ran down his spine, the silence in the room amplifying the sound of the clock's ticking, echoing ominously in the stillness. Beatrice Quill stood to one side, her fingers twisting nervously in her dress, while the doctor Finch entered the room with a measured gait, his expression revealing nothing of the turmoil beneath the surface.

Hale stepped closer to the clock, its presence looming large in the dim light of the study. "It shows ten minutes past eleven," he murmured, his voice barely above a whisper. The implications of that time weighed heavily on him. Eleanor had been last seen alive at ten forty-five, making the clock a crucial witness to the events that had transpired. She could not shake the feeling that the clock held more than just the time; it was a silent observer to the tragedy that had unfolded. The realization that it had been tampered with only deepened her unease. Who had altered it, and why? The questions hung in the air, unacknowledged yet palpable, as if the clock itself was daring them to uncover the truth.

As if sensing the tension, Beatrice shivered at the sound of the clock chiming, its echo reverberating through the study. "Did you hear that?" she asked, her voice trembling. "It sounds different, almost... strange." Hale turned to him, his brow furrowing. "Strange? How so?" Beatrice hesitated, her eyes darting to the clock. "I recall hearing it chime at odd times. It never seemed to match the hour. It felt... off." His words sent a ripple of unease through Hale as he considered the implications. If the clock was malfunctioning, it could mean that the timeline of Eleanor's death was not only uncertain but potentially manipulated. The thought sent a shiver down his spine, and he glanced at Finch, whose expression remained inscrutable.

Finch stepped forward, his gaze fixed on the clock with a mix of curiosity and concern. "If witnesses recall hearing the clock chime at unusual times, it suggests that someone may have tampered with it to create a false timeline. This could mean that Eleanor's death occurred earlier than we think." His voice was steady, but Hale could sense the underlying tension. The doctor had a vested interest in this investigation, and the weight of suspicion began to settle on him like a heavy cloak. Hale's mind raced as he considered the implications of Finch's words. If the clock had been altered, it could point to a deliberate attempt to shift blame or create an alibi. Who had the most to gain from such deception?

The atmosphere in the study felt electric, charged with the weight of suspicion. Hale turned his attention back to the clock, its frozen hands a stark reminder of the fragility of life. "We need to determine who had access to this clock and when," he said, his voice firm. "This could be the key to unraveling the mystery of Eleanor's death." Finch nodded, his expression betraying nothing, but Hale could sense the tension radiating from him. The doctor had been one of the last to see Eleanor alive, and now she found herself at the center of the investigation. The weight of suspicion hung heavily in the air, and Hale could feel the pressure mounting as they stood in the study, the rain continuing to fall outside, a relentless reminder of the world beyond their walls.

As the tension escalated, Hale's gaze fell upon a small, brass key resting on the desk beside the clock. He reached for it, his fingers brushing against its cool surface. "This key... it must be for the clock mechanism," he said, holding it up for the others to see. "If it was used to tamper with the clock, it could provide us with crucial evidence." Finch's eyes widened slightly, and for a moment, Hale thought he detected a flicker of anxiety in the doctor's demeanor. "We should examine it for fingerprints," he suggested, his mind racing with possibilities. If Dr. Finch had indeed tampered with the clock, this key could reveal his involvement. The thought sent a surge of determination through Hale as he prepared to delve deeper into the mystery surrounding Eleanor's death.

Beatrice, still visibly shaken, took a step closer to the desk. "What if it wasn't just Dr. Finch? What if someone else had access to this room?" His voice was barely above a whisper, but the fear in his eyes spoke volumes. Hale nodded, recognizing the truth in his words. Every guest had access to the study, and each one had their own secrets to protect. The weight of their shared guilt loomed over them, a dark cloud that threatened to consume them all. The clock, with its frozen hands and the secrets it held, had become a focal point of suspicion, and Hale knew that they needed to act quickly to uncover the truth before it slipped further from their grasp.
--- END PRIOR CHAPTER 3 ---

--- BEGIN PRIOR CHAPTER 4 ---
Title: Chapter 4: Beatrice's Alibi
The afternoon light struggled to pierce the heavy clouds hanging over Little Middleton, casting a dim glow over the tavern. Inside, the atmosphere buzzed with the chatter of patrons, their voices rising and falling like the tide, but an undercurrent of tension rippled through the room. Beatrice Quill sat at a small table in the corner, her fingers clutching a glass of cider, the cool surface slick against her trembling hands. He could feel the weight of the eyes upon him, whispers trailing through the air like smoke, as the captain Hale approached, his expression a mixture of determination and concern.

As Hale settled into the chair opposite her, Beatrice forced a smile, though it felt brittle on her lips. "I was just saying to the barmaid that I might stay here until midnight, just to clear my head," she said, her voice slightly higher than usual. Hale raised an eyebrow, his gaze steady. "Midnight, you say? That’s quite a late night for someone who was just preparing breakfast hours before. What were you doing here so late?"

Beatrice swallowed hard, the cider suddenly feeling like a weight in her stomach. "I... I needed to unwind after everything that happened. You know how it is, Captain. The manor can feel suffocating sometimes, especially after... after what happened to Eleanor." Her voice trailed off, and she glanced around the tavern, as if expecting someone to overhear. The patrons were indeed listening, their eyes darting back and forth between the two of them, eager for the unfolding drama.

Hale leaned forward, his tone shifting to one of gentle inquiry. "Tell me more about your relationship with Eleanor. You were quite close, weren’t you?" Beatrice hesitated, the question hanging in the air like a storm cloud. "Close? Yes, we shared a bond, but... it wasn’t without its complications. Eleanor had her secrets, and sometimes I felt like I was living in her shadow."

The tension in the air thickened as Hale considered his words. "Secrets? What do you mean?" Beatrice's heart raced as she recalled the moments of jealousy that had crept into their friendship. "She had everything—beauty, charm, and a life that seemed perfect. But I knew it was all a façade. I wanted to help her, but... sometimes I couldn’t help but feel resentful. It’s a terrible thing to admit, but it’s the truth."

Hale nodded, his expression thoughtful. "And you were here in the tavern until midnight, alone? You didn’t see anyone else?" Beatrice shook her head vigorously, her nerves beginning to fray. "I swear, Captain! I was here, just trying to forget. I didn’t want to think about the manor or the clock or... or Eleanor’s death. I didn’t hear anything unusual, I promise." She clutched her drink tighter, her palms slick with sweat.

Hale’s gaze softened slightly, but he pressed on. "You understand that your alibi is crucial, don’t you? If you were here until midnight, we need to corroborate that. Anyone else see you?" Beatrice felt her breath hitch in her throat. "I don’t know, maybe the barmaid? But she’s busy serving other patrons. I can’t be sure. It’s all a blur, Captain!"

A moment of silence fell between them, punctuated only by the distant sound of laughter from another table. Hale’s demeanor shifted, and he offered a small, almost reassuring smile. "You’re doing well, Beatrice. Just remember, the truth will help you. We’re not here to condemn you, but to find justice for Eleanor. And sometimes, the truth is more complicated than we’d like to admit."

Beatrice nodded, her heart racing as she tried to process her words. The tavern felt both a refuge and a prison, the laughter of patrons contrasting sharply with her internal turmoil. He wanted to believe Hale, to trust that he was on his side, but the shadows of doubt loomed large. What if his secrets were more damning than he realized? What if Eleanor’s death was just the tip of the iceberg?

As the afternoon wore on, Hale continued to ask questions, probing deeper into Beatrice’s memories of Eleanor, their friendship, and the moments that had shaped their lives. Each question felt like a tightrope walk, a delicate balance between revealing too much and protecting herself. Beatrice’s hands trembled as she recounted their last encounter, the laughter they shared over tea, and the fleeting moments of vulnerability that had passed between them. But with each memory, the weight of jealousy and rivalry resurfaced, threatening to drown her in guilt.

Finally, as the sun dipped lower in the sky, casting elongated shadows across the tavern floor, Hale leaned back in his chair, his expression contemplative. "Thank you for your honesty, Beatrice. I know this isn’t easy, but your words will help us piece together the truth. Just remember, we’re all searching for answers, and sometimes those answers are hidden in the most unexpected places."

Beatrice offered a weak smile, feeling a flicker of relief amidst the chaos. Perhaps she could navigate this storm after all, but the lingering doubt remained. Would the truth truly set her free, or would it bind her closer to the very shadows she sought to escape? As Hale stood to leave, the tavern buzzed around him, the laughter and chatter continuing unabated, while he sat in silence, grappling with the weight of his own secrets.
--- END PRIOR CHAPTER 4 ---

--- BEGIN PRIOR CHAPTER 5 ---
Title: Chapter 5: Dr. Finch's Confession
As the late afternoon light filtered into the study, the atmosphere felt heavy with unspoken secrets. The rain had subsided, leaving behind a damp chill that seeped through the walls of Little Middleton Manor. Captain Hale stood near the clock, its hands still frozen at ten minutes past eleven, a grim reminder of the tragedy that had unfolded. Beatrice Quill had just left, her expression a mix of relief and lingering anxiety. Hale could sense the tension in the air, a palpable weight that pressed down on him as he awaited the doctor Finch's arrival. The clock, with its silent testimony, seemed to mock him, daring him to uncover the truth that lay hidden beneath layers of deception.

When Dr. Finch entered the study, his demeanor was one of practiced calm, but Hale could see the flicker of anxiety in his eyes. The doctor’s crisp, tailored suit contrasted sharply with the disarray of emotions swirling within him. "Captain Hale," he greeted, his voice steady yet lacking its usual confidence. "What is it you wish to discuss?" Hale gestured for him to take a seat, keenly aware of the stakes at play. "We need to talk about Eleanor," she began, watching for any sign of a reaction. Finch's jaw tightened, and for a moment, the mask slipped, revealing the turmoil beneath. "I understand," he replied, his voice barely above a whisper.

Hale leaned forward, his gaze piercing. "You were one of the last people to see his alive. What can you tell me about your relationship with him?" Finch hesitated, the weight of the question hanging heavily in the air. "Eleanor and I... we had an affair," she admitted, her voice cracking slightly. "It was complicated. She was in a difficult situation, and I wanted to help her, but..." His words trailed off, and Hale could see the internal struggle etched on his face. The atmosphere thickened as Finch grappled with his feelings, the tension palpable. "But you wanted to end it, didn’t you?" Hale pressed, sensing an opportunity to uncover the motive behind the clock's tampering.

Finch's expression shifted, a flicker of anger crossing his features. "Yes, I wanted to end it!" he exclaimed, his voice rising. "But that doesn’t mean I wanted his dead! I cared for him, despite everything!" The confession hung in the air, a confession tinged with desperation. Hale noted the agitation in Finch's posture, the way his hands clenched into fists. "You had access to the clock, Dr. Finch. You could have tampered with it to create an alibi or shift the blame. What do you have to say about that?" Finch's eyes widened, and he leaned back in his chair, visibly shaken. "I didn’t touch the clock! I swear it!"

Hale studied him closely, searching for any hint of deception. "You were in the study often, weren’t you? You knew how it worked. You could have easily wound it back to cover your tracks." Finch's face paled, and he shook his head vehemently. "I would never do such a thing! I loved him!" The intensity of his emotions was palpable, and Hale felt the weight of his words. The doctor’s voice cracked again as he continued, "I was trying to help his escape the life that was suffocating him. I didn’t want to be a part of his downfall!"

The silence that followed was thick with tension as Hale considered Finch's words. The clock, with its frozen hands, loomed large in the room, a silent witness to the turmoil that had unfolded. Hale leaned back, allowing the moment to settle, hoping to gauge Finch's true feelings. "Then why not come forward with this information sooner? Why hide your relationship?" Finch's eyes darted around the room, as if searching for an escape. "Because I was afraid! Afraid of what everyone would think! I didn’t want to be implicated in his death!" His voice trembled, and Hale could see the cracks in his composure beginning to show.

Hale took a deep breath, feeling the weight of the investigation pressing down on him. "Dr. Finch, I need you to be completely honest with me. If you had nothing to do with Eleanor's death, then you have nothing to fear. But if you are hiding something..." She let the sentence hang in the air, allowing the implications to sink in. Finch's expression shifted, a mixture of fear and determination crossing his features. "I’m not hiding anything! I swear! I was trying to protect him!" The desperation in his voice was evident, but Hale remained unconvinced. The doctor’s agitation only fueled the suspicion that hung in the air.

As the shadows lengthened in the study, Hale felt a sense of urgency building. The truth was within reach, but the tangled web of emotions and secrets threatened to ensnare them all. "We need to find out who else had access to the clock and when," Hale said, his voice steady. "This could be the key to unraveling the mystery of Eleanor's death. If you truly cared for her, you’ll help us get to the bottom of this." Finch nodded, his expression shifting from anger to resolve. "I will do whatever it takes to clear my name and find out who really did this to him."

The atmosphere in the study felt charged, as if the very walls were holding their breath, waiting for the truth to emerge. Hale could sense that they were on the brink of a breakthrough, but the path ahead was fraught with danger. He glanced at the clock once more, its frozen hands a stark reminder of the fragility of life. The investigation was far from over, and as they stood amidst the shadows of Little Middleton Manor, the secrets of the past threatened to unravel the very fabric of their lives.
--- END PRIOR CHAPTER 5 ---

# Case Overview
Title: The Clockwork Deception
Era: 1930s
Setting: Little Middleton
Crime: murder (clock tampering)
Culprit: Dr. Mallory Finch
False assumption: Eleanor's death occurred shortly after the clock chimed eleven.
Cast: Eleanor Voss (she/her), Dr. Mallory Finch (he/him), Captain Ivor Hale (he/him), Beatrice Quill (she/her)

Setting Lock: Keep all scenes and descriptions consistent with the stated setting (Little Middleton). Do not introduce a different location type.

Outline scenes:
[
  {
    "sceneNumber": 6,
    "act": 2,
    "title": "The Tavern Alibi",
    "setting": {
      "location": "the tavern",
      "timeOfDay": "Evening",
      "atmosphere": "Chaotic, filled with laughter and music"
    },
    "characters": [
      "Eleanor Voss",
      "Captain Ivor Hale",
      "Beatrice Quill"
    ],
    "purpose": "Reconfirm Captain Hale's alibi and introduce a red herring",
    "cluesRevealed": [
      "clue_core_elimination_chain"
    ],
    "dramaticElements": {
      "conflict": "The alibi is questioned.",
      "tension": "Witnesses recount Hale's behavior.",
      "microMomentBeats": [
        "Captain Hale laughs too loudly, trying to mask his nerves."
      ]
    },
    "summary": "The detective interviews patrons at the tavern to confirm Captain Hale's alibi. Witnesses recall seeing him there until midnight, providing a solid defense against suspicion.",
    "estimatedWordCount": 1800,
    "emotionalRegister": "The connection between the clock and Dr. Finch brings the investigation to a critical point.",
    "dominantCharacterNote": {
      "name": "Eleanor Voss",
      "voiceRegister": "Eleanor speaks with a melodic cadence, exuding charm and confidence."
    },
    "humourGuidance": {
      "permission": "forbidden"
    },
    "eraTextureNote": "Limited communication due to the reliance on early home telephones.; Isolation from nearby towns due to poor transportation options.; Shortening daylight hours limiting evening activities.",
    "locationRegisterNote": ""
  }
]
```

## Message 3 (role=user)

```text
BEFORE SUBMITTING YOUR JSON — verify this checklist:
□ Each chapter reaches the hard floor of 500 words and aims for 1250 words or more.
□ If you mention locked evidence, you used the exact locked phrase verbatim.
□ Allowed seasonal words only: autumn, autumnal, fall.
□ Forbidden seasonal words: spring, summer, winter.
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
