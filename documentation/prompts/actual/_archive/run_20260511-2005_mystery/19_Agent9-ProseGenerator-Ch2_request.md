# Actual Prompt Record

- Run ID: `mystery-1778529928271`
- Project ID: ``
- Timestamp: `2026-05-11T20:10:52.949Z`
- Agent: `Agent9-ProseGenerator-Ch2`
- Operation: `chat_request_full_prompt`
- Model: `GPT-4o-mini`
- Temperature: `0.42`
- Max Tokens: `4500`
- Attempt: `first`
- Prompt Hash: `b2e5c21f257757b4`

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
- MORAL COMPLEXITY REQUIREMENT: The mechanism of this crime carries a moral gray area: "The murderer, driven by a desperate need to protect a loved one, evokes a sense of sympathy despite their crime." — the culprit reveal and denouement MUST acknowledge this ambiguity. Do not let the ending feel clean or simple. Give the reader at least one moment of uncomfortable sympathy or moral doubt.


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

## Era: 1934-09
In September 1934, as the Great Depression lingered, the British countryside bore witness to an unsettling blend of opulence and despair. The overcast skies often mirrored the collective unease of a society grappling with class divisions and economic hardship. The upper class, though still hosting lavish dinners and gatherings, faced mounting pressures to maintain their status, while the working class struggled against the tide of poverty. The air buzzed with whispers of political unrest, as fascism's rise in Europe cast a shadow over the British Isles. Daily life was punctuated by the simple routines of afternoon teas and Sunday church services, yet beneath this veneer of normalcy lay a simmering tension. The tightening grip of economic conditions heightened the stakes for all, making social interactions fraught with hidden motives. The looming Harvest Festival hinted at a time for celebration, yet the reality was a stark contrast — a community divided by privilege and desperation, where every interaction could betray underlying animosities.
Emotional register: A pervasive sense of anxiety and tension permeates society, as individuals navigate the precarious balance of maintaining appearances amidst mounting pressures.
Physical constraints: Limited communication options due to reliance on written correspondence | Travel constraints affecting movement between urban and rural areas | Dependence on horse-drawn carriages and early automobiles for transport
Current tensions (weave into background texture): Economic instability from the Great Depression | Rising tensions as fascism gains traction in Europe | Class disparities leading to social unrest
Wartime context — No active wars, but memories of World War I still weigh heavily on society.: A sense of fragility exists, with veterans struggling to reintegrate while others debate the implications of another potential conflict. Absence effect: The absence of many young men from the workforce casts a shadow on families and communities.

## Story Theme
In a world where social status dictates personal relationships, the quest for truth reveals that even the most polished facades can hide dark secrets, and reveals that evidence carries ethical weight, forcing characters to choose accountability over social performance when appearances and facts collide.

## Story Emotional Register
Dominant: A journey through tension, betrayal, and the quest for truth unfolds.

Arc:
The story opens with the picturesque setting of Little Middleton Manor, where the guests gather for a dinner party under the overcast skies of September 1934. The atmosphere is filled with an uneasy tension, underscored by the characters' hidden motives and unspoken resentments. As Eleanor Voss, the respected estate manager, is found dead, the narrative shifts swiftly into a realm of chaos and suspicion. The rising tension escalates as the characters grapple with the implications of Eleanor's murder, revealing their intertwined lives and secrets. Dr.

Mallory Finch’s nervousness, Captain Ivor Hale’s desperation, and Beatrice Quill’s ambition create a complex web of motives that complicate the investigation. The first turning point occurs when the tampered clock points to the possibility that the murder happened earlier than believed, leading to a deeper unraveling of the truth. As the investigation progresses, the emotional stakes rise with each revelation, particularly when allegiances are tested and accusations fly. The second turning point arrives when the characters confront their fears and the consequences of their actions, culminating in a tense climax where the true motive is laid bare. The resolution sees the characters grappling with the aftermath of the murder, as the truth emerges, leaving them to reflect on their choices and the fragility of their social positions. Ultimately, the emotional register shifts from chaos to a bittersweet acceptance of their realities, highlighting the enduring struggle between ambition, loyalty, and the pursuit of truth.

## Emotional register at this point in the story
The gathering feels festive yet tense, hinting at underlying conflicts.

## Character Portraits (appearance & era)

### Eleanor Voss
Eleanor Voss embodies the struggles of the upper class during the Great Depression. Her efforts to maintain her family's estate reflect the pressures of societal expectations, as she grapples with financial ruin while trying to preserve her social standing. Eleanor's personal stakes in the murder investigation reveal her desperation to shield her family's legacy from scandal.
Era intersection: Eleanor's hidden financial troubles are a microcosm of the broader economic challenges facing the upper class, forcing her to confront her fears and ambitions.

### Dr. Mallory Finch
Dr. Mallory Finch represents the tension between professional duty and personal loyalty during a time of social upheaval. His relationship with Eleanor adds complexity to his character, as he navigates the expectations of both his profession and society while trying to protect her from scandal. Finch's internal conflict highlights the personal sacrifices made to uphold appearances.
Era intersection: As a physician during economic hardship, Finch's role becomes increasingly complicated, mirroring the struggles of his patients and the societal pressures impacting his relationship with Eleanor.

### Captain Ivor Hale
Captain Ivor Hale exemplifies the pride and desperation of a man facing financial ruin, clinging to his aristocratic roots while grappling with the reality of his circumstances. His arrogance masks a deep-seated fear of losing his status, driving him to contemplate extreme measures to secure his future. Hale's character reflects the broader societal anxieties about class and wealth.
Era intersection: Hale's financial desperation is emblematic of the plight facing many aristocrats in the 1930s, as the economic downturn forces them to reevaluate their identities and ambitions.

### Beatrice Quill
Beatrice Quill represents the ambitious working class, caught between loyalty to the Voss family and her aspirations for a better life. Her resentment toward the privileged elite drives her actions, highlighting the tension between class and personal desire. Beatrice's character arc reveals the complexities of ambition and morality within a rigid social structure.
Era intersection: Beatrice's struggles reflect the changing social landscape of the 1930s, where the working class begins to challenge established norms and pursue upward mobility.

## Character Voices

### Eleanor Voss (she/her/her)
Eleanor speaks with a refined accent, her words often imbued with a clever quip, yet revealing an undercurrent of anxiety.
[comfortable] Isn’t it delightful to have everyone gathered here? We shall create memories to cherish.
[evasive] Oh, I’d rather not dwell on the past; it’s the present that demands our attention.
[stressed] I cannot let this scandal ruin everything my family has worked for!
Humour: Her dry wit often surfaces, providing a glimpse of her inner turmoil.

### Dr. Mallory Finch (he/him/his)
Dr. Finch has a measured cadence, often using medical metaphors, and his earnestness carries a hint of irony.
[comfortable] You know, a good dose of fresh air does wonders for the soul.
[evasive] Surely, there are more pressing matters to discuss than my whereabouts?
[stressed] If anyone discovers my connection to Eleanor, it could destroy us both!
Humour: His observational humor often emerges as a coping mechanism amid tension.

### Captain Ivor Hale (he/him/his)
Captain Hale speaks with a commanding tone, often laced with sarcasm that masks his insecurities.
[comfortable] Ah, the glory days of the navy — a time of true valor!
[evasive] No need for concern; I have everything under control.
[stressed] I will not be reduced to a mere shadow of my former self!
Humour: His sardonic remarks often serve to deflect attention from his vulnerabilities.

### Beatrice Quill (she/her/her)
Beatrice speaks quickly, her nervousness evident, often slipping into casual language when comfortable.
[comfortable] Oh, I’m just happy to help wherever I can!
[evasive] I don’t really know much about that; it’s not my place to say.
[stressed] What if they find out what I heard? Everything I’ve worked for could be over!
Humour: Her self-deprecating humor often lightens the mood, reflecting her desire for acceptance.

## Location Registers (scene framing guides)

The Library: The library feels heavy with secrets, its elegance marred by recent chaos. Shadows loom large, and the air is thick with the scent of aged paper, creating an atmosphere fraught with tension and unspoken accusations.. Camera angle: As a writer approaches the library, the emotional stance should evoke a sense of foreboding, inviting readers to uncover the hidden truths lurking within.. Era: In the 1930s, this space reflects the fading grandeur of the upper class, now overshadowed by the economic turmoil affecting society.

The Drawing Room: The drawing room buzzes with low murmurs and forced laughter, the air thick with tension. The opulence that once welcomed guests now serves as a backdrop for suspicion and intrigue, where every glance and gesture carries weight.. Camera angle: As a writer enters, the emotional stance should capture the contrasts of luxury and unease, hinting at the undercurrents of conflict among the guests.. Era: In the 1930s, this room symbolizes both elegance and the fragility of social standing, as the upper class navigates the pressures of maintaining appearances.

The Gardens: The gardens, while visually stunning, carry an air of isolation and introspection. The vibrant colors of the flowers stand in stark contrast to the looming shadows, reminding visitors of the secrets and tensions hidden within the manor.. Camera angle: As a writer explores the gardens, the emotional stance should evoke a sense of solitude, inviting contemplation of the characters' inner conflicts.. Era: In the 1930s, these gardens represent the duality of beauty and despair, a reflection of the societal struggles faced by those who traverse them.

## Humour guidance for this story position (opening)
Permission: permitted
Rationale: The light atmosphere allows for subtle, dry wit to reflect the social dynamics.

FAIR-PLAY AND INFERENCE CONTRACT (from CML logic):
- False assumption in force: The murder occurred during the dinner party, as all were present.
- Hidden truth to progressively expose: The clock was tampered with, allowing the murder to happen unnoticed earlier.
- Inference path checkpoints to dramatize clearly (observation -> correction -> effect):
  - Step 1: obs: The clock was discovered stopped at ten minutes past eleven. | corr: Since the murder occurred before this time, it suggests the clock was tampered with to create a false alibi. | effect: Narrows the time of death to before eleven, eliminating the idea that it happened during the dinner.
  - Step 2: obs: Witnesses recall the clock striking the hour at the dinner, despite it being stopped. | corr: This indicates a manipulation of the clock's mechanism to create a false narrative. | effect: Eliminates the possibility that the murder occurred at the time indicated by the witnesses.
  - Step 3: obs: Dr. Mallory Finch's alibi claims he was with Eleanor during the dinner. | corr: With the tampered clock evidence, his alibi does not hold. | effect: Narrows suspect pool to Dr. Mallory Finch as he had access to the clock and the victim.
- Discriminating test method: trap
- Discriminating test design constraint: The discriminating test compares clock, discover, and stopp against the claimed timeline.
- Test must rely on already-shown clue IDs: clue_1, clue_2, clue_3, clue_9, clue_10
- Fair-play rationale: Step 1: The stopped clock and the time of death let the reader deduce the murder happened earlier than believed. Step 2: Witness accounts about the clock striking create suspicion around Dr. Finch's alibi. Step 3: The controlled comparison reveals discrepancies that implicate Dr. Finch.
- Never solve by withheld information. Keep reader-information parity with detective reasoning.

## Character Reference

### Eleanor Voss
Eleanor speaks with a refined accent, often employing clever quips and a light-hearted tone, though her words sometimes carry a weight of hidden anxiety
She has a tendency to pause thoughtfully before responding, as if weighing her words carefully.
Eleanor feels an overwhelming pressure to uphold her family's reputation while grappling with the fear that her financial struggles will expose her to public disgrace.

### Dr. Mallory Finch
Finch speaks with a measured cadence, often punctuating his observations with dry humor
He has a tendency to use medical metaphors in casual conversation, and his earnestness is sometimes laced with a hint of irony, especially when discussing societal norms.
Dr. Finch grapples with the tension between his professional responsibilities and the desire to protect Eleanor, fearing that his actions could lead to both their downfalls.

### Captain Ivor Hale
Captain Hale speaks with a commanding presence, his words often dripping with sarcasm
He tends to punctuate his sentences with haughty laughter, as if mocking those he deems inferior, and his tone can shift from grandiose to curt in an instant.
Captain Hale is plagued by a sense of inadequacy as he grapples with the reality of his financial situation, and the fear of losing his status drives him to consider morally dubious actions.

### Beatrice Quill
Beatrice speaks quickly, often with a hint of nervousness
She tends to laugh at her own jokes, even when they fall flat, and her formality can slip into casual language when she feels comfortable, revealing her desire for acceptance.
Beatrice wrestles with her ambition and her resentment toward the Voss family, torn between her desire for a better life and the moral implications of her actions.



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
Little Middleton Manor stands as a testament to the grandeur of a bygone era, enveloped in an atmosphere thick with secrets and unspoken tensions. The sprawling estate, with its segregated areas for staff and guests, holds the weight of recent events that have cast a shadow over its opulent facade.

Key Locations Available:
- The Library (interior): Crime scene
- The Drawing Room (interior): Gathering space
- The Gardens (exterior): Clue discovery, isolation

Atmosphere: Tense due to recent events, with an undercurrent of suspicion among guests.
Weather: Overcast with occasional rain, typical of the British countryside in the fall.

Era markers: Petrol touring cars parked in the gravel driveway, their engines murmuring softly as guests arrive. | The faint buzz of early domestic wiring, often flickering as the power supply falters. | Typewriters clattering in the study, where notes and letters are hastily composed amid the chaos.

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
  - Visual: The flickering candlelight casts eerie shadows across the room, dancing over the spines of countless tomes that hold untold secrets., An ornate globe stands in the corner, its surface showing the wear of time, suggesting the many voyages its owners took in their imaginations.
  - Sounds: The soft rustle of pages turning in the stillness, as if the books themselves are whispering about the events that transpired., The distant sound of thunder rumbles like a warning, reverberating through the heavy silence of the room.
  - Scents: The rich, musty aroma of aged paper and leather fills the air, a scent that speaks of knowledge and history., A hint of smoke lingers, perhaps from a nearby fireplace, mingling with the scent of polished wood.
  - Touch: The cool, smooth surface of the mahogany table contrasts with the rough texture of the cracked leather bindings of the books., A chill hangs in the air, a reminder of the damp weather outside, making the room feel both inviting and foreboding.

The Drawing Room (interior):
  - Visual: Gilded mirrors reflect the flickering candlelight, creating an illusion of grandeur that belies the tension hanging in the air., A crystal chandelier sparkles above, its prisms casting colorful patterns on the walls, contrasting with the heavy atmosphere.
  - Sounds: The clinking of glasses and muted laughter can be heard, but the underlying tension is palpable, like a tightly held breath., Occasional whispers float through the air, as guests exchange furtive glances and share half-formed thoughts.
  - Scents: The scent of rich tobacco smoke mingles with the sweet aroma of aged port, creating an intoxicating blend that hangs in the air., A hint of floral perfume lingers, perhaps from a guest, adding a touch of elegance to the otherwise charged atmosphere.
  - Touch: The plush upholstery of the settees invites weary bodies to sink in, yet
[truncated for prompt budget]

## Texture Pool
Draw on these as opportunities arise — you are not required to use them.

- In September 1934, as the Great Depression lingered, the British countryside bore witness to an unsettling blend of opulence and despair
- The overcast skies often mirrored the collective unease of a society grappling with class divisions and economic hardship
- The upper class, though still hosting lavish dinners and gatherings, faced mounting pressures to maintain their status, while the working class struggled against the tide of poverty
- The air buzzed with whispers of political unrest, as fascism's rise in Europe cast a shadow over the British Isles
- Daily life was punctuated by the simple routines of afternoon teas and Sunday church services, yet beneath this veneer of normalcy lay a simmering tension

TEMPORAL CONTEXT:

This story takes place in September 1934 during N/A.

Seasonal Atmosphere:
- Weather patterns: overcast skies, occasional rain showers, cool breezes
- Daylight: Shortening days with twilight arriving around seven o'clock, darkness settling in by eight.
- Seasonal activities: apple picking in local orchards, attending harvest fairs, hunting parties in the countryside
- Seasonal occasions: Harvest Festival (late September)
- Season: N/A

Period Fashion (describe naturally):
- Men formal: three-piece wool suits with high-waisted trousers, double-breasted blazers, cravat or tie in muted colors
- Men casual: tweed caps, corduroy trousers, button-down shirts with rolled sleeves
- Men accessories: pocket watch, leather gloves, walking cane
- Women formal: tea-length dresses with cinched waists, tailored jackets with padded shoulders, cloche hats adorned with ribbons
- Women casual: sweater sets with pleated skirts, ankle-length dresses in floral prints, button-up blouses
- Women accessories: string of pearls, silk scarves, decorative brooches

Cultural Context (reference naturally):
- Music/entertainment: 'Smoke Gets in Your Eyes' by The Platters, 'Puttin' on the Ritz' by Fred Astaire, 'The Way You Look Tonight' by Jerome Kern; Films: 'The Thin Man' released in 1934, 'It Happened One Night'; Theatre: 'The Front Page' by Ben Hecht, 'The Royal Family' by George S. Kaufman; Radio: 'The Shadow' mystery series, BBC News broadcasts
- Typical prices: Loaf of bread: four pence, Bottle of milk: two pence, Cinema ticket: one shilling
- Current events: increased tensions as Germany reoccupies the Rhineland; the British government grapples with rising domestic unrest due to economic conditions
- Literature: 'Murder in the Mews' by Agatha Christie | 'The Maltese Falcon' by Dashiell Hammett | 'The Glass Key' by Dashiell Hammett | [mystery novels] | [detective fiction] | [social commentary literature]
- Technology: the automatic telephone exchange | the electric refrigerator | early versions of television | Typewriters in offices | hand-cranked telephones in homes | wireless radios
- Daily life: visiting local markets, socializing over tea in gardens, attending local fairs
- Social rituals: afternoon tea served from four to six o'clock, Sunday church services followed by family dinners

Atmospheric Details:
The scent of damp earth mingled with the fading blooms of late summer flowers as the leaves began their slow descent. The sound of distant thunder rumbled ominously, echoing the rising tension among the guests gathered within the manor's walls. Flickering candlelight cast long shadows, creating an atmosphere thick with secrets and unspoken accusations.

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
- Social commentary: Characters discuss c
[truncated for prompt budget]

NON-NEGOTIABLE CHAPTER OBLIGATIONS — LOCKED EVIDENCE PHRASES (VERBATIM REQUIRED):
The following physical evidence values are absolute ground truth. Every time this chapter describes, mentions, or alludes to the relevant evidence — no matter how briefly — it MUST use the exact phrase shown below, character for character. NO paraphrase, approximation, rounding, or synonym is permitted.

FAILURE EXAMPLE: if the locked value is "at thirteen minutes to midnight" and you write "just before midnight" or "around midnight" — that is a HARD FAIL. You must write "at thirteen minutes to midnight". Equally, if the locked value is written in words, such as "ten minutes past eleven", and you convert it to figure-based clock notation — that is also a HARD FAIL. Words stay as words; figure forms are forbidden for word-phrased facts.

CRITICAL — WORD-PHRASED VALUES: If the canonical value is written out in words (e.g. a time like "ten minutes past eleven", or an amount like "forty minutes"), reproduce those exact words. DO NOT convert to figure-based time notation, twenty-four-hour format, or any other numeric shorthand. Correct: "ten minutes past eleven". WRONG: figure-based clock notation or numeric shorthand.

Locked facts:
  - The exact time shown on the stopped clock face: "ten minutes past eleven"
  - The exact amount the clock was wound back: "forty minutes"
  - The time when the dinner party began: "eight o'clock"
  - The time when the murder actually occurred: "ten minutes past nine"

If a locked fact has no relevance to this chapter, omit it. But the moment you reference the underlying evidence, only the exact phrase above is acceptable.

⛔ CLUES TO SURFACE IN THESE CHAPTERS — mandatory:
The following evidence MUST be clearly observable to an attentive reader. Do not bury it in atmosphere or passing dialogue. Each clue must be concrete, specific, and noticeable:

• [clue_3] With the tampered clock evidence, Dr. Mallory Finch's alibi does not hold.
  Category: temporal | Criticality: essential | Supports inference step 2
  Points to: This indicates that his alibi is questionable.

• [clue_4] Dr. Mallory Finch's alibi claims he was with Eleanor during the dinner.
  Category: behavioral | Criticality: essential | Supports inference step 2
  Points to: This raises questions about the validity of his alibi.

• [clue_core_contradiction_chain] Cross-check contradiction
  Category: structural | Placement: early (Act 1)
  Points to: what this observation reveals about the time or circumstances of the crime.

For each clue above: an attentive reader should be able to find, record, and later use it to reason toward the solution.

═══ NARRATIVE STATE (read-only — do not contradict) ═══

LOCKED FACTS — use verbatim whenever this evidence is described:
  • The exact time shown on the stopped clock face: "ten minutes past eleven"
  • The exact amount the clock was wound back: "forty minutes"
  • The time when the dinner party began: "eight o'clock"
  • The time when the murder actually occurred: "ten minutes past nine"

CHARACTER PRONOUNS — never deviate from these:
  • Eleanor Voss: she/her/her
  • Dr. Mallory Finch: he/him/his
  • Captain Ivor Hale: he/him/his
  • Beatrice Quill: she/her/her

CLUES ALREADY REVEALED TO READER: clue_1, clue_2 — do not reveal these as new information.

CONTINUITY HANDOFF — previous chapter closing beat:
  • "As the rain continued to fall outside, Eleanor felt a surge of determination. She would not let this murder go unsolved. With each whispered conversation and furtive glance, she would piece together the truth. The drawing room, once a place of warmth and laugh..."
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
drawing room

✓ RULE: Continue using this location vocabulary. Maintain consistency with established setting type.
✓ Do NOT introduce new location types that contradict earlier chapters.

**Recent Chapter Summary (for narrative continuity):**
Chapter 1: Chapter 1: Discovery
  Events: Dr.

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
Known location profile anchors: Little Middleton Manor, The Library, The Drawing Room, The Gardens, the drawing room
LOCATION NAME CAPITALISATION (HARD REQUIREMENT — validated):
All named locations in your prose MUST use the EXACT capitalisation from the CML profiles.
Canonical forms: "Little Middleton Manor", "The Library", "The Drawing Room", "The Gardens", "the drawing room"
Writing a location in lowercase (e.g. "drawing room" instead of "Drawing Room") is a validated error. Every time you mention a named location, copy its capitalisation from the list above.
- Chapter 2: OPENING STYLE (HARD): Start the VERY FIRST SENTENCE with spoken dialogue — e.g. '"[words]," [Name] said/asked/replied/murmured.' The opening quote must be the first character on the line. Anchor opening in "the drawing room". HARD REQUIREMENT for the first 2 paragraphs: (a) include 2+ sensory words — choose from smell/scent/sound/echo/silence/creak/whisper/cold/warm/damp/rough/smooth/glow/shadow/flicker/dim — and (b) include 1+ atmosphere/time word — choose from rain/wind/fog/storm/mist/thunder/evening/morning/night/dawn/dusk/season/afternoon/midday/noon/midnight/twilight/sunrise/sunset/daylight/sunlight/overcast/cloudy/bright/dark. These are validated requirements, not style suggestions; missing them triggers a retry.

[⚠ INTERNAL QUALITY DIAGNOSTICS — DO NOT REPRODUCE ANY PART OF THIS SECTION IN YOUR STORY OUTPUT. These are private generator observations for your consideration only. Your narrative must read as if this section does not exist. Never include phrases from this block in character dialogue, narration, or description.]

PRIOR CHAPTER QUALITY OBSERVATIONS:
- Chapter 1 (score 93/100):
  Quality gaps noted: word density below preferred target (861/1000); scene grounding weakness
  Address in upcoming chapters: Increase chapter density with concrete investigation action and sensory-grounded beats; avoid recap-only padding. | Open next chapter with a named location anchor plus at least two sensory cues and one atmosphere marker.
[END INTERNAL DIAGNOSTICS]

PROMPT BUDGET SUMMARY: budget=32000 tokens; fixed=6596; context=9786; dropped=[none]; truncated=[location_profiles, temporal_context]

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
8. Integrate at least two concrete era-grounded details per chapter from setting refinement signals: petrol touring cars on county roads | domestic wiring with frequent outages | typewriters standard in offices | early telephones in homes | party-line telephone exchange common | telegrams for urgent messages.
9. Respect setting movement/access constraints in scene action and alibis: multiple access points with restricted areas for staff | gardens and woodlands limit visibility from the main house | weather can affect outdoor evidence collection | staff must have permission to enter guest areas | key access required for certain rooms.
10. Sustain social coherence with this backdrop pressure: A gathering for a crucial family meeting amidst the Great Depression creates a charged atmosphere of class tension and suspicion among the estate's guests and staff.
11. Maintain continuity around these socially central cast anchors where relevant: Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill.
12. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Moderate: Character similarity 0.74 with 'The Mysterious Affair at Styles' (mirrored roles and dynamics)
13. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Moderate: Plot similarity 0.70 with 'The Mysterious Affair at Styles' (temporal murder aspect)
14. RETRY MITIGATION: Split-chapter mode is active. Use at least 4 substantial paragraphs per chapter with explicit scene transitions.

CRITICAL PROSE REQUIREMENTS:

The CML specifies exact requirements for certain validation-critical scenes. You MUST include these elements at the specified positions.

**Discriminating Test Scene (Act 3, Scene 4):**
Required elements: Execute the discriminating test, Observe the culprit's reaction or result, Draw conclusion about guilt
Test type: trap

**Suspect Clearance Scenes:**
- Captain Ivor Hale (Act 3, Scene 5): Confirmed he was at the dinner table during the murder timeframe.
  Clues: clue_id_1, clue_id_2
- Beatrice Quill (Act 3, Scene 5): Her testimony corroborated by several guests.
  Clues: clue_id_3, clue_id_4

**Culprit Revelation Scene (Act 3, Scene 6):**
Method: Confrontation with clock evidence

**Clue Placement for These Chapters:**
- clue_core_contradiction_chain must appear in Act 1, Scene 2 via Cross-check contradiction

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
- Chapter 2:
  - Word count: Target 1250 words. Achieve this through plot events, dialogue exchanges, and physical investigation — not through atmospheric repetition or extended internal reflection. Each 200-word segment should contain at minimum one concrete story event (a discovery, a conversation exchange, a physical action or movement). Padding with atmosphere alone is not acceptable.
  - Location anchor: the drawing room.
  - Opening atmosphere (MANDATORY — validator enforced): the first paragraph MUST contain at least one of: rain / wind / fog / storm / mist / thunder / evening / morning / night / dawn / dusk / season / afternoon / midday / noon / midnight / twilight / sunrise / sunset / daylight / sunlight / overcast / cloudy / bright / dark. A chapter that omits all of these from its opening paragraph will be rejected.
  - Continuity bridge: in the first 120 words, visibly connect from the previous chapter's final beat. Carry forward one unresolved element (object, accusation, emotional pressure, or immediate physical action) from: "As the rain continued to fall outside, Eleanor felt a surge of determination. She would not let this murder go unsolved. With each whispered conversation and furtive glance, she would piece together the truth. The drawin...".
  - CLUE OBLIGATIONS — mandatory prose elements (do NOT omit or bury):
    • Since the murder occurred before this time, it suggests the clock was tampered with to create a false alibi. [clue_core_contradiction_chain] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: This contradicts the assumption that the clock's time was accurate.
      ↳ MANDATORY TWO-PARAGRAPH STRUCTURE (must appear in paragraphs 1 or 2 — no later):
         Paragraph 1: The POV character physically approaches or directly observes this evidence.
           The narration or dialogue explicitly states what is seen (use the exact locked phrase if one applies).
         Paragraph 2 (immediately following): The detective or POV character explicitly reasons
           about what this evidence implies — who it implicates, why it may be unreliable,
           or what inference it supports. This must be a separate full paragraph, not a sentence appended to Paragraph 1.
    • With the tampered clock evidence, Dr. Mallory Finch's alibi does not hold. [clue_3]
      Points to: This indicates that his alibi is questionable.
    • Dr. Mallory Finch's alibi claims he was with Eleanor during the dinner. [clue_4]
      Points to: This raises questions about the validity of his alibi.
  - Tonal contrast: include at least one beat of relief or ironic counterpoint. Do not sustain maximum tension for every paragraph.
  - Sensory obligation — use at least two of: The room is bathed in a soft, grey light that seems to drain the vibrancy from the furnishings., Shadows loom larger as the day progresses, creating a sense of foreboding. | The subdued conversations blend into an indistinct murmur, creating a backdrop of tension that fills the air., The occasional cough or clearing of a throat punctuates the silence, drawing attention to the unease that permeates the gathering. | The scent of freshly poured tea mingles with the musty aroma of the room, a reminder of the countless gatherings held here.. Mood: uneasy stillness.
- Locked fact phrase obligations:
  - If this batch mentions The exact time shown on the stopped clock face, write exactly: "ten minutes past eleven".
  - If this batch mentions The exact amount the clock was wound back, write exactly: "forty minutes".
  - If this batch mentions The time when the dinner party began, write exactly: "eight o'clock".
  - If this batch mentions The time when the murder actually occurred, write exactly: "ten minutes past nine".
- Seasonal vocabulary allow-list: autumn, autumnal, fall.
- Forbidden seasonal words: spring, summer, winter.

FROZEN TIMELINE STATE (DO NOT ALTER):
- Timeline anchor: September (autumn).
- Month, season, weather, and time-of-year language in this batch must stay compatible with autumn.
- Established timeline fact: Dinner party start time
- Established timeline fact: Clock stopped time
- If referenced, use exact time phrase: "ten minutes past eleven" (The exact time shown on the stopped clock face).
- If referenced, use exact time phrase: "forty minutes" (The exact amount the clock was wound back).
- If referenced, use exact time phrase: "eight o'clock" (The time when the dinner party began).
- If referenced, use exact time phrase: "ten minutes past nine" (The time when the murder actually occurred).

STORY TO DATE (REFERENCE ONLY — DO NOT COPY VERBATIM):
- Full prior chapter text is provided below for continuity, factual consistency, and reference accuracy.
- Use this to keep character voice, chronology, clue state, and location continuity aligned with earlier chapters.
- Do not quote, copy, or paraphrase these paragraphs too closely; write fresh prose that remains consistent with them.

--- BEGIN PRIOR CHAPTER 1 ---
Title: Chapter 1: Discovery
The evening air was thick with tension as raindrops streaked down the large windows of the drawing room of the Finch residence, blurring the view of the gardens beyond. Inside, the dim light cast soft shadows across the room, illuminating the faces of the gathered guests, each one reflecting a mixture of shock and disbelief. Eleanor Voss stood near the fireplace, her heart racing, as she took in the scene around her. The crackling of the fire was a welcome sound, offering warmth amidst the chill of the atmosphere, but it did little to ease the oppressive weight of the moment. She could feel the anxious murmurs of the other guests, their voices a low hum of confusion and fear, echoing off the ornate walls adorned with family portraits. This was not how the evening was meant to unfold; the dinner party had promised a night of laughter and camaraderie, yet it had devolved into chaos in the wake of a tragedy she could scarcely comprehend.

As Eleanor moved deeper into the room, she caught sight of the doctor Finch, his brow furrowed in concern as he spoke in hushed tones with the captain Hale. The doctor’s hands trembled slightly, betraying a nervousness that did not escape Eleanor’s notice. She approached the mantelpiece, where a striking clock stood, its face eerily still. The clock was discovered stopped at ten minutes past eleven. Eleanor’s breath caught in her throat as she realized the implications of the halted timepiece. It suggested that something had gone terribly wrong, and the timing of it all felt deliberate. Who would stop the clock? And why? The questions swirled in her mind, each one more troubling than the last.

Dr. Finch, noticing Eleanor's gaze, stepped closer, his voice barely above a whisper. "It appears the clock has been tampered with, Eleanor. It was deliberately wound back to create a false timeline. I cannot fathom why anyone would do such a thing, but it raises suspicions, does it not?" Her eyes darted to the other guests, as if she feared being overheard. Eleanor nodded, her mind racing. This was no accident; the clock’s manipulation hinted at a calculated effort to mislead them all. If the clock had been tampered with, then the timeline of events surrounding the murder could be entirely unreliable. Who had access to the clock? And what did they hope to achieve by altering its function?

As she pondered the implications, Eleanor overheard snippets of conversation from the other guests. "I swear I heard the clock strike the hour during dinner," Beatrice Quill said, her voice quivering with anxiety. "But now it’s stopped! How can that be?" Eleanor turned to Beatrice, who looked genuinely distressed. Witnesses recall the clock striking the hour at the dinner, despite it being stopped. This contradiction sent a chill down Eleanor’s spine. If the clock had struck during dinner, then the murder must have occurred before the clock stopped. But how could they reconcile this with the timeline they thought they knew? The pieces of the puzzle were beginning to shift, and Eleanor felt a growing urgency to uncover the truth.

Captain Hale, attempting to restore some semblance of order, raised his voice above the murmurs. "We must remain calm and collected. Panic will not serve us here. We need to determine what happened, and we need to do it quickly." Her authoritative tone seemed to quell some of the unease, but Eleanor could see the flicker of fear in her eyes. The stakes were high, and everyone in the room was acutely aware of it. Eleanor took a deep breath, steeling herself for the task ahead. She had to focus, to gather her thoughts and observations. The truth was lurking just beneath the surface, and she was determined to uncover it, no matter the cost.

Eleanor glanced around the room, taking in the faces of her companions. Each one bore a unique expression of concern, but beneath that, she sensed an undercurrent of suspicion. Who among them could be trusted? The air felt charged with unspoken accusations, and Eleanor knew that the evening's events would leave scars far deeper than the immediate tragedy. As she stepped away from the mantelpiece, she resolved to investigate further. She would not allow fear to dictate her actions; she would seek the truth, no matter how uncomfortable it might be. The clock’s stillness echoed in her mind, a reminder that time was of the essence, and the answers they sought were slipping away with each passing moment.

As the rain continued to fall outside, Eleanor felt a surge of determination. She would not let this murder go unsolved. With each whispered conversation and furtive glance, she would piece together the truth. The drawing room, once a place of warmth and laughter, had transformed into a crucible of suspicion. Eleanor felt an unsettling thrill at the prospect of delving into the mystery that lay before her. The clock had stopped, but she would ensure that the investigation would not. With a final glance at Dr. Finch, who seemed lost in thought, Eleanor steeled herself for the challenges ahead. The night was far from over.
--- END PRIOR CHAPTER 1 ---

# Case Overview
Title: The Clockwork Conspiracy
Era: 1930s
Setting: Little Middleton
Crime: murder (clock tampering)
Culprit: Dr. Mallory Finch
False assumption: The murder occurred during the dinner party, as all were present.
Cast: Eleanor Voss (she/her), Dr. Mallory Finch (he/him), Captain Ivor Hale (he/him), Beatrice Quill (she/her)

Setting Lock: Keep all scenes and descriptions consistent with the stated setting (Little Middleton). Do not introduce a different location type.

Outline scenes:
[
  {
    "sceneNumber": 2,
    "act": 1,
    "title": "Cross-Checking Alibis",
    "setting": {
      "location": "the drawing room",
      "timeOfDay": "Shortly after the discovery",
      "atmosphere": "Suspenseful, with a sense of urgency in the air"
    },
    "characters": [
      "Eleanor Voss",
      "Dr. Mallory Finch",
      "Beatrice Quill",
      "Captain Ivor Hale"
    ],
    "purpose": "Establish the timeline and contradictions in witness accounts",
    "cluesRevealed": [
      "clue_3",
      "clue_4"
    ],
    "dramaticElements": {
      "conflict": "Tension rises as guests defend their alibis",
      "tension": "Dr. Finch's nervous demeanor raises suspicion",
      "microMomentBeats": [
        "Beatrice clutches her necklace, lost in thought."
      ]
    },
    "summary": "As the guests gather, Eleanor begins to question them about their whereabouts during the murder, cross-checking their alibis. the doctor Finch's nervousness and conflicting statements raise red flags.",
    "estimatedWordCount": 1800,
    "emotionalRegister": "The discovery of Eleanor's body introduces shock and uncertainty.",
    "dominantCharacterNote": {
      "name": "Eleanor Voss",
      "voiceRegister": "Eleanor speaks with a refined accent, her words often imbued with a clever quip, yet revealing an undercurrent of anxiety."
    },
    "humourGuidance": {
      "permission": "permitted"
    },
    "eraTextureNote": "Limited communication options due to reliance on written correspondence; Travel constraints affecting movement between urban and rural areas; Dependence on horse-drawn carriages and early automobiles for transport",
    "locationRegisterNote": "The drawing room buzzes with low murmurs and forced laughter, the air thick with tension. The opulence that once welcomed guests now serves as a backdrop for suspicion and intrigue, where every glance and gesture carries weight. — As a writer enters, the emotional stance should capture the contrasts of luxury and unease, hinting at the undercurrents of conflict among the guests."
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
□ Chapter 2: "Since the murder occurred before this time, it suggests the clock was tampered with to create a false alibi." is placed in the first 25% of the chapter, followed by an explicit inference or suspicion paragraph.
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

## Message 4 (role=user)

```text
Attempt 3/4 — chapters 2 — 1 validation issue(s) to resolve:

═══ PROSE QUALITY ERRORS (1) ═══
• Chapter 2 marked non-convergent after attempt 2/4: structure

✓ SOLUTION: Vary paragraph lengths (short, medium, long)
✓ Include sensory details and atmospheric description
✓ Ensure each chapter has substance (3+ paragraphs minimum)

Return corrected JSON for chapters 2. Edit only the sections that failed — keep all content that passed validation, and return the complete updated chapter JSON.


RETRY CLASS: structure
ATTEMPT: 2/4
MANDATORY FIXES:
- Resolve structure issues before accepting this batch.
- Chapter 2: Chapter 2 has only 2 paragraph(s) (Chapters should have at least 3+ meaningful paragraphs for readability and pacing)
MITIGATION MODE: split_chapter
```
