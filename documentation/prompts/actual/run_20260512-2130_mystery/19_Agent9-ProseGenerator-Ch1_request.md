# Actual Prompt Record

- Run ID: `mystery-1778621454974`
- Project ID: ``
- Timestamp: `2026-05-12T21:35:51.106Z`
- Agent: `Agent9-ProseGenerator-Ch1`
- Operation: `chat_request_full_prompt`
- Model: `GPT-4o-mini`
- Temperature: `0.42`
- Max Tokens: `4500`
- Attempt: `first`
- Prompt Hash: `83834c348d3ef4e0`

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
- MORAL COMPLEXITY REQUIREMENT: The mechanism of this crime carries a moral gray area: "The murderer, seeking revenge for a long-standing grievance, elicits sympathy from those who understand their pain." — the culprit reveal and denouement MUST acknowledge this ambiguity. Do not let the ending feel clean or simple. Give the reader at least one moment of uncomfortable sympathy or moral doubt.


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

## Era: 1939-October
In October 1939, Britain is on the brink of war as the shadow of World War II looms large. The air is thick with tension, reflecting the uncertainty that grips the nation. Overcast skies and intermittent rain mirror the prevailing mood, while the shortening days bring early darkness, creating an atmosphere of foreboding. The Great Depression's impact still lingers, leading to heightened class divides and a growing awareness of social issues. Families gather in their grand estates, but the luxurious facades mask deep-seated rivalries and hidden agendas. As Halloween approaches, the festive spirit is overshadowed by the fear of conflict, forcing the upper classes to confront their positions in a changing world. Conversations often revolve around the local fairs and the plight of those less fortunate, revealing a growing divide that adds to the tensions within the manor walls.
Emotional register: The dominant emotional state is one of anxiety and uncertainty, with a collective fear of the impending war.
Physical constraints: Travel is limited due to increasing military preparations and restrictions. | Communication is hindered by the lack of modern technology and the reliance on telegrams. | Food shortages are beginning to emerge, leading to rationing and scarcity.
Current tensions (weave into background texture): Germany invades Poland, escalating fears of wider conflict in Europe. | Britain and France declare war on Germany, heightening the sense of urgency. | The Great Depression still affects the economy, leading to social unrest.
Wartime context — Many men are preparing for enlistment, leaving families to anticipate separation.: Women are stepping into roles traditionally held by men, creating tension in family dynamics. Absence effect: The potential absence of loved ones adds a layer of emotional strain to social gatherings.

## Season Lock (mandatory — derived from 1939-October)
Season: autumn. Allowed vocabulary: autumn, autumnal, fall
Forbidden seasonal words — never use in narration, dialogue, or metaphor: spring, summer, winter and their adjectival forms.
Every weather description, atmosphere, and time-of-year reference must be consistent with autumn.

## Story Theme
The story explores the intricate relationship between ambition and morality, revealing how personal desires can lead to betrayal and tragedy amidst the societal pressures of the 1930s.

## Story Emotional Register
Dominant: The story unfolds with a palpable sense of tension and intrigue.

Arc:
The narrative opens in the lavish drawing room of Little Middleton Manor, where guests gather for a charity event amidst the backdrop of an impending storm. Eleanor Voss, the determined socialite, navigates the delicate social dynamics, her ambitions intertwined with the secrets of her affluent friends. As the clock strikes ten minutes past eleven, chaos erupts when the body of a wealthy benefactor is discovered, plunging the guests into a web of suspicion and fear. The rising tension escalates as Eleanor, driven by her desire for justice, begins her investigation, unveiling the hidden resentments and rivalries among the guests. The first turn occurs when the tampered clock reveals that the murder may have been premeditated, leading to an intense exploration of motives.

As Eleanor delves deeper, she encounters opposition and evasiveness from the suspects, particularly Captain Ivor Hale, whose past holds dark secrets. The mid-point of the story sees Eleanor gathering evidence and piecing together the timeline, but the emotional stakes rise as she wrestles with her own self-doubt. The second turn culminates in a controlled observation that tests the alibis and reveals inconsistencies, leading to the climax where all truths are laid bare in a confrontation with Captain Hale. The resolution brings a bittersweet closure, as the truth is revealed, and Eleanor realizes the cost of her ambition. The ending resonates with a mix of relief and lingering unease, reflecting the complexities of human motives and the shadows that linger even after the crime is solved.

## Emotional register at this point in the story
The opening scene evokes a sense of opulence mixed with underlying tension.

## Character Portraits (appearance & era)

### Eleanor Voss
Eleanor Voss navigates the complexities of her high-society life, feeling the weight of social expectations as war looms. Her ambition to expose the secrets of her affluent friends reflects a desire for justice amidst the encroaching darkness of the world outside.
Era intersection: Her pursuit of truth clashes with the societal pressures of the 1930s, where maintaining appearances is paramount.

### Captain Ivor Hale
Captain Ivor Hale represents the moral dilemmas faced by men of honor in a society rife with betrayal. His past experiences in war shape his worldview, amplifying his internal conflicts as he navigates the complexities of justice and retribution.
Era intersection: His character wrestles with the implications of impending war, reflecting the broader anxieties of a nation on the brink.

### Beatrice Quill
Beatrice Quill stands at the intersection of class and voice, embodying the struggles of the working class within the confines of an elitist estate. Her insights into the household dynamics reveal the hidden tensions that simmer beneath the surface.
Era intersection: Her character highlights the growing awareness of social disparities during the 1930s, as the working class begins to assert itself.

## Character Voices

### Eleanor Voss (she/her/her)
Eleanor's voice flows with a melodic cadence, often laced with irony.
[comfortable] Isn't it delightful how the rain has a way of washing away the pretenses?
[evasive] Oh, I wouldn't want to pry into anyone's affairs. After all, what fun would that be?
[stressed] I simply can't let this charity event fall apart. It's too important to my standing!
Humour: Eleanor often employs dry wit to navigate uncomfortable social situations.

### Captain Ivor Hale (he/him/his)
Ivor's tone is direct, with a hint of gravelly charm.
[comfortable] In my day, we faced our demons head-on. None of this nonsense.
[evasive] Well, I suppose some things are better left unsaid.
[stressed] I've seen too much betrayal; I won't stand for it again.
Humour: His blunt humor reflects his straightforward approach to life.

### Beatrice Quill (she/her/her)
Beatrice speaks softly, carefully choosing her words.
[comfortable] It's lovely to see everyone enjoying themselves. Quite a change, isn't it?
[evasive] I wouldn't want to impose... it’s really not my place.
[stressed] What if they find out what I know? I can't let that happen!
Humour: Her self-deprecating humor often hints at her struggles.

## Location Registers (scene framing guides)

The Library: In the library, an unsettling tension hangs thick in the air, as the shadows seem to whisper secrets of the past. The ambiance is heavy with the weight of unspoken truths, creating a space where every creak of the floorboards resonates with anxiety and anticipation.. Camera angle: Entering this space requires a sense of foreboding, as the atmosphere is fraught with the potential for revelation.. Era: The isolation of the estate during this era heightens the sense of suspense and secrecy.

The Drawing Room: The drawing room serves as a façade of elegance, but beneath its surface lies a brewing storm of emotions. The air is thick with tension, as hushed conversations and stolen glances reveal the unease among the guests, each of whom harbors their own secrets.. Camera angle: A writer entering this space should capture the contrast between its opulence and the underlying strife.. Era: The social expectations of the era amplify the pressure to maintain appearances even in the face of chaos.

The Servants' Hall: The Servants' Hall is a stark reminder of the divide between classes, where the staff navigate their routines with a mix of camaraderie and caution. The air is filled with whispers and laughter, yet an undercurrent of anxiety persists as they grapple with the unfolding drama above them.. Camera angle: Entering this area should evoke a sense of the hidden stories and struggles that exist behind the walls of privilege.. Era: The evolving roles of workers during this period create a charged atmosphere in this otherwise humble space.

## Humour guidance for this story position (opening)
Permission: permitted
Rationale: Eleanor can use dry wit to set the tone amidst the opulent gathering.

FAIR-PLAY AND INFERENCE CONTRACT (from CML logic):
- False assumption in force: The murder must have occurred just before the clock struck eleven.
- Hidden truth to progressively expose: The clock was deliberately altered to misrepresent the time of the murder.
- Inference path checkpoints to dramatize clearly (observation -> correction -> effect):
  - Step 1: obs: The clock in the study shows ten minutes past eleven when the body is discovered. | corr: The clock's time does not match witness accounts about the timing of the murder. | effect: Narrows time of death to before the clock showed ten minutes past eleven.
  - Step 2: obs: Witnesses state they heard the clock strike the hour earlier than the time of death. | corr: This indicates that the clock may have been tampered with to create a false timeline. | effect: Eliminates the assumption that the murder occurred just before eleven.
  - Step 3: obs: Fresh tool marks are found on the clock mechanism. | corr: This suggests recent tampering with the clock to mislead about the murder timeline. | effect: Narrows the suspect pool to those with access to the clock.
- Discriminating test method: trap
- Discriminating test design constraint: A controlled observation is set up to compare the clock's tampering evidence with Captain Ivor Hale's alibi timing.
- Test must rely on already-shown clue IDs: clue_1, clue_2, clue_3, clue_10, clue_4, clue_mechanism_visibility_core
- Fair-play rationale: Step 1: The clock in the study shows ten minutes past eleven (early clue) and witnesses recall it striking earlier (mid clue). Step 2: Fresh tool marks on the clock indicate tampering (mid clue). Step 3: The controlled observation tests the tampering against Hale's alibi, revealing contradictions (discriminating test).
- Never solve by withheld information. Keep reader-information parity with detective reasoning.

## Character Reference

### Eleanor Voss
Eleanor speaks with a smooth, melodic cadence, often punctuating her observations with a knowing smile
She has a penchant for irony, frequently using it to deflect inquiries about her more serious investigations.
Eleanor grapples with the duality of her existence: the socialite façade she presents to the world clashing with her clandestine pursuit of truth among friends she once considered trustworthy.

### Captain Ivor Hale
Ivor speaks in a direct, no-frills manner, often punctuating his sentences with a gravelly chuckle or a raised eyebrow
He has a tendency to be candid, often eschewing social niceties for straightforwardness.
Ivor is torn between his desire for justice and the fear that his quest for retribution could lead to unintended consequences, placing him at odds with his own moral code.

### Beatrice Quill
Beatrice speaks softly, often choosing her words carefully
She has a tendency to apologize frequently, reflecting her place in the social hierarchy, and her humor is often laced with an air of resignation.
Beatrice struggles with her voice in a world that often silences those in her position, torn between the desire to speak out and the fear of the consequences that may follow.


## CHARACTER CONTRACTS (binding for this scene)
Each entry below constrains how this character must be written in this chapter.
These override generic style guidance when they conflict.

### Eleanor Voss
Voice & mannerisms: Eleanor speaks with a smooth, melodic cadence, often punctuating her observations with a knowing smile. She has a penchant for irony, frequently using it to deflect inquiries about her more serious investigations.
Sample voice fragments (match this register and rhythm):
  [comfortable] "Isn't it delightful how the rain has a way of washing away the pretenses?"
  [evasive] "Oh, I wouldn't want to pry into anyone's affairs. After all, what fun would that be?"
Humour: dry wit — deploy occasionally (level 0.5)
FORBIDDEN phrase (never write for Eleanor Voss): "a surge of determination washed over her"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Eleanor's presence at the manor was not merely for socializing; she believed that hosting a charity event would elevate her standing among the elite, further entrenching her position in their society." — do not surface in Act I.

### Captain Ivor Hale
Voice & mannerisms: Ivor speaks in a direct, no-frills manner, often punctuating his sentences with a gravelly chuckle or a raised eyebrow. He has a tendency to be candid, often eschewing social niceties for straightforwardness.
Sample voice fragments (match this register and rhythm):
  [comfortable] "In my day, we faced our demons head-on. None of this nonsense."
  [evasive] "Well, I suppose some things are better left unsaid."
Humour: blunt — deploy rarely (level 0.3)
FORBIDDEN phrase (never write for Captain Ivor Hale): "she chose her words with great care"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "The victim's past actions have haunted Ivor, fueling a desire for retribution that complicates his sense of justice." — do not surface in Act I.

### Beatrice Quill
Voice & mannerisms: Beatrice speaks softly, often choosing her words carefully. She has a tendency to apologize frequently, reflecting her place in the social hierarchy, and her humor is often laced with an air of resignation.
Sample voice fragments (match this register and rhythm):
  [comfortable] "It's lovely to see everyone enjoying themselves. Quite a change, isn't it?"
  [evasive] "I wouldn't want to impose... it’s really not my place."
Humour: self deprecating — deploy rarely (level 0.2)
FORBIDDEN phrase (never write for Beatrice Quill): "she knew with certainty she was right"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Overhearing a conversation between the victim and Dr. Finch could implicate Mallory, leaving Beatrice torn between loyalty and the need for truth." — do not surface in Act I.



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
Little Middleton Manor, an imposing Victorian-Edwardian estate, sits in somber isolation, surrounded by lush gardens and dense woodlands that conceal secrets and tensions.

Key Locations Available:
- The Library (interior): Crime scene
- The Drawing Room (interior): Gathering space
- The Servants' Hall (interior): Staff gathering space

Atmosphere: Tense and suspenseful, reflecting underlying class tensions and secrets among the estate's inhabitants.
Weather: Overcast with intermittent rain, typical for the season, creating a somber mood.

Era markers: A radio crackles softly in the background, broadcasting news of the world beyond the estate. | A typewriter clacks in the study, punctuating the silence as letters are penned in haste. | Early telephones ring sporadically, their sharp tones cutting through the otherwise quiet atmosphere.

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
  - Visual: In the dim light, the rich mahogany of the furniture contrasts sharply with the faded wallpaper, creating an atmosphere of neglect and decay., A pair of reading chairs, upholstered in worn green velvet, sit invitingly near the fireplace, their fabric fraying at the edges.
  - Sounds: The soft rustle of pages turning echoes through the room, accompanied by the distant ticking of a wall clock, each tick a reminder of the urgency of their situation., Occasionally, the sound of rain tapping against the window disrupts the silence, creating a melancholic rhythm that fills the air.
  - Scents: The musty scent of old books mingles with the faint aroma of polished wood, a reminder of the stories contained within these walls., A hint of coal smoke lingers from the fireplace, a testament to the warmth that once filled the room, now replaced by an unsettling chill.
  - Touch: The heavy leather-bound volumes feel cool to the touch, their spines textured and cracked from years of use, as if they hold secrets waiting to be revealed., The polished surface of the mahogany desk is smooth beneath the fingers, yet it carries an undercurrent of tension, as if it has borne witness to countless clandestine meetings.

The Drawing Room (interior):
  - Visual: The walls are adorned with family portraits, their eyes seeming to follow the movements of those who pass, adding to the room's unsettling atmosphere., A grand piano sits silently in the corner, its polished surface reflecting the dim light, as if waiting for someone to breathe life back into its keys.
  - Sounds: The murmur of conversation fills the air, punctuated by the occasional clink of tea cups, creating a deceptive sense of normalcy., The soft rustle of fabric as guests shift in their seats enhances the feeling of intimacy, yet it also carries an undercurrent of tension.
  - Scents: The rich aroma of freshly brewed tea mingles with the scent of polished wood and the faintest hint of tobacco smoke, creating a comf
[truncated for prompt budget]

## Texture Pool
Draw on these as opportunities arise — you are not required to use them.

- In October 1939, Britain is on the brink of war as the shadow of World War II looms large
- The air is thick with tension, reflecting the uncertainty that grips the nation
- Overcast skies and intermittent rain mirror the prevailing mood, while the shortening days bring early darkness, creating an atmosphere of foreboding
- The Great Depression's impact still lingers, leading to heightened class divides and a growing awareness of social issues
- Families gather in their grand estates, but the luxurious facades mask deep-seated rivalries and hidden agendas

TEMPORAL CONTEXT:

This story takes place in October 1939 during N/A.

Seasonal Atmosphere:
- Weather patterns: overcast skies, intermittent rain, chilly breezes
- Daylight: Shortening days with sunset around six o'clock in the evening, leaving long shadows and an early onset of darkness
- Seasonal activities: harvesting apples, attending local fairs, preparing for Halloween festivities
- Seasonal occasions: Halloween
- Season: N/A

Period Fashion (describe naturally):
- Men formal: dark wool three-piece suits, double-breasted blazers, black leather oxfords
- Men casual: tweed sport jackets, corduroy trousers, knit ties
- Men accessories: fedora hats, silk pocket squares, leather gloves
- Women formal: tea-length dresses with fitted waists, long-sleeved evening gowns, cloche hats adorned with ribbons
- Women casual: wool skirts paired with cashmere sweaters, practical cotton blouses, ankle boots
- Women accessories: peridot brooches, silk scarves, handbags with intricate beading

Cultural Context (reference naturally):
- Music/entertainment: Glenn Miller's big band music, Doris Day's early recordings, popular swing tunes; Films: Gone with the Wind, The Wizard of Oz; Theatre: The Glass Menagerie, The Little Foxes; Radio: The Shadow, Lux Radio Theater
- Typical prices: Loaf of bread: four pence, Newspaper: one penny, Coal scuttle refill: one shilling sixpence
- Current events: Germany invades Poland, triggering World War II; Britain and France declare war on Germany
- Literature: The Grapes of Wrath by John Steinbeck | The Maltese Falcon by Dashiell Hammett | The Old Man and the Sea by Ernest Hemingway | [detective fiction] | [social realism] | [war literature]
- Technology: the first jet engine | advancements in radio technology providing clearer broadcasts | early developments in radar | wireless radios in homes | typewriters in offices | early telephones for personal use
- Daily life: visiting local markets, attending community events, participating in church gatherings
- Social rituals: afternoon tea served promptly at four o'clock, formal dinners hosted with great attention to etiquette

Atmospheric Details:
The damp air carries the earthy scent of wet leaves, as the trees shed their foliage, creating a carpet of orange and brown. Echoes of distant thunder resonate in the background, a constant reminder of the overcast skies that loom above the estate. The flickering glow from the fireplace inside contrasts with the gloom outside, casting long shadows and adding an air of mystery to the evening.

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
- Authentic references: Use actual songs, films, events f
[truncated for prompt budget]

NON-NEGOTIABLE CHAPTER OBLIGATIONS — LOCKED EVIDENCE PHRASES (VERBATIM REQUIRED):
The following physical evidence values are absolute ground truth. Every time this chapter describes, mentions, or alludes to the relevant evidence — no matter how briefly — it MUST use the exact phrase shown below, character for character. NO paraphrase, approximation, rounding, or synonym is permitted.

FAILURE EXAMPLE: if the locked value is "at thirteen minutes to midnight" and you write "just before midnight" or "around midnight" — that is a HARD FAIL. You must write "at thirteen minutes to midnight". Equally, if the locked value is written in words, such as "ten minutes past eleven", and you convert it to figure-based clock notation — that is also a HARD FAIL. Words stay as words; figure forms are forbidden for word-phrased facts.

CRITICAL — WORD-PHRASED VALUES: If the canonical value is written out in words (e.g. a time like "ten minutes past eleven", or an amount like "forty minutes"), reproduce those exact words. DO NOT convert to figure-based time notation, twenty-four-hour format, or any other numeric shorthand. Correct: "ten minutes past eleven". WRONG: figure-based clock notation or numeric shorthand.

Locked facts:
  - The exact time shown on the stopped clock face: "ten minutes past eleven"
  - The exact amount the clock was wound back: "forty minutes"
  - Multiple witnesses claim the clock chimed at a different time than expected: "the hour striking at a quarter past eleven"

If a locked fact has no relevance to this chapter, omit it. But the moment you reference the underlying evidence, only the exact phrase above is acceptable.

⛔ CLUES TO SURFACE IN THESE CHAPTERS — mandatory:
The following evidence MUST be clearly observable to an attentive reader. Do not bury it in atmosphere or passing dialogue. Each clue must be concrete, specific, and noticeable:

• [clue_1] The clock in the study shows ten minutes past eleven when the body is discovered.
  Category: temporal | Criticality: essential | Supports inference step 2
  Points to: This establishes the time of death.

• [clue_mechanism_visibility_core] Direct observation
  Category: structural | Placement: early (Act 1)
  Points to: what this observation reveals about the time or circumstances of the crime.

For each clue above: an attentive reader should be able to find, record, and later use it to reason toward the solution.

═══ NARRATIVE STATE (read-only — do not contradict) ═══

LOCKED FACTS — use verbatim whenever this evidence is described:
  • The exact time shown on the stopped clock face: "ten minutes past eleven"
  • The exact amount the clock was wound back: "forty minutes"
  • Multiple witnesses claim the clock chimed at a different time than expected: "the hour striking at a quarter past eleven"

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
Known location profile anchors: Little Middleton Manor, The Library, The Drawing Room, The Servants' Hall, the study in Little Middleton
LOCATION NAME CAPITALISATION (HARD REQUIREMENT — validated):
All named locations in your prose MUST use the EXACT capitalisation from the CML profiles.
Canonical forms: "Little Middleton Manor", "The Library", "The Drawing Room", "The Servants' Hall", "the study in Little Middleton"
Writing a location in lowercase (e.g. "drawing room" instead of "Drawing Room") is a validated error. Every time you mention a named location, copy its capitalisation from the list above.
- Chapter 1: OPENING STYLE (HARD): Start the VERY FIRST SENTENCE with a named character performing a physical action or motion — e.g. "[Name] crossed the threshold…" / "[Name] set down the glass…" / "[Name] rose from the chair…". Anchor opening in "the study in Little Middleton". HARD REQUIREMENT for the first 2 paragraphs: (a) include 2+ sensory words — choose from smell/scent/sound/echo/silence/creak/whisper/cold/warm/damp/rough/smooth/glow/shadow/flicker/dim — and (b) include 1+ atmosphere/time word — choose from rain/wind/fog/storm/mist/thunder/evening/morning/night/dawn/dusk/season/afternoon/midday/noon/midnight/twilight/sunrise/sunset/daylight/sunlight/overcast/cloudy/bright/dark. These are validated requirements, not style suggestions; missing them triggers a retry.

PROMPT BUDGET SUMMARY: budget=32000 tokens; fixed=4998; context=9252; dropped=[none]; truncated=[location_profiles, temporal_context]

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
8. Integrate at least two concrete era-grounded details per chapter from setting refinement signals: radio broadcasts in common use | early telephones in homes | typewriters standard in offices | telephone networks with party lines | telegram services available from local offices | airmail for faster correspondence.
9. Respect setting movement/access constraints in scene action and alibis: manor layout creates natural barriers and restricted access to certain areas | weather can affect movement and visibility in the gardens | large estate grounds may delay response from outside help | certain rooms are off-limits to staff, especially private offices and the master bedroom | daily routines dictate access times to various parts of the house.
10. Sustain social coherence with this backdrop pressure: A family gathering at the manor for a contentious estate meeting reveals deep-seated class tensions and hidden agendas among the heirs and staff amid the economic strains of the Great Depression.
11. Maintain continuity around these socially central cast anchors where relevant: Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill.
12. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Critical: Plot similarity 0.75 with 'The Mysterious Affair at Styles' (same mechanical tampering method and temporal axis)
13. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Moderate: Setting similarity 0.85 with 'The Mysterious Affair at Styles' (same era and similar location dynamics)

CRITICAL PROSE REQUIREMENTS:

The CML specifies exact requirements for certain validation-critical scenes. You MUST include these elements at the specified positions.

**Discriminating Test Scene (Act 3, Scene 4):**
Required elements: Execute the controlled observation of the clock's tampering., Observe Captain Hale's reaction to the evidence.
Test type: trap

**Suspect Clearance Scenes:**
- Dr. Mallory Finch (Act 3, Scene 5): Her medical alibi is verified by multiple witnesses.
  Clues: clue_1, clue_2
- Beatrice Quill (Act 3, Scene 5): Her whereabouts during the murder are confirmed by others.
  Clues: clue_1, clue_2

**Culprit Revelation Scene (Act 3, Scene 6):**
Method: Confrontation with evidence of tampering and alibi contradictions.

**Clue Placement for These Chapters:**
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
  - Location anchor: the study in Little Middleton.
  - Opening atmosphere (MANDATORY — validator enforced): the first paragraph MUST contain at least one of: rain / wind / fog / storm / mist / thunder / evening / morning / night / dawn / dusk / season / afternoon / midday / noon / midnight / twilight / sunrise / sunset / daylight / sunlight / overcast / cloudy / bright / dark. A chapter that omits all of these from its opening paragraph will be rejected.
  - CLUE OBLIGATIONS — mandatory prose elements (do NOT omit or bury):
    • The mechanism relies on the clock in the study to expose the false timing. [clue_mechanism_visibility_core] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: This reveals the core mechanism of the timing discrepancy.
      ↳ MANDATORY TWO-PARAGRAPH STRUCTURE (must appear in paragraphs 1 or 2 — no later):
         Paragraph 1: The POV character physically approaches or directly observes this evidence.
           The narration or dialogue explicitly states what is seen (use the exact locked phrase if one applies).
         Paragraph 2 (immediately following): The detective or POV character explicitly reasons
           about what this evidence implies — who it implicates, why it may be unreliable,
           or what inference it supports. This must be a separate full paragraph, not a sentence appended to Paragraph 1.
    • The clock in the study shows ten minutes past eleven when the body is discovered. [clue_1] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: This establishes the time of death.
      ↳ MANDATORY TWO-PARAGRAPH STRUCTURE (must appear in paragraphs 1 or 2 — no later):
         Paragraph 1: The POV character physically approaches or directly observes this evidence.
           The narration or dialogue explicitly states what is seen (use the exact locked phrase if one applies).
         Paragraph 2 (immediately following): The detective or POV character explicitly reasons
           about what this evidence implies — who it implicates, why it may be unreliable,
           or what inference it supports. This must be a separate full paragraph, not a sentence appended to Paragraph 1.
  - Tonal contrast: include at least one beat of relief or ironic counterpoint. Do not sustain maximum tension for every paragraph.
- Locked fact phrase obligations:
  - If this batch mentions The exact time shown on the stopped clock face, write exactly: "ten minutes past eleven".
  - If this batch mentions The exact amount the clock was wound back, write exactly: "forty minutes".
  - If this batch mentions Multiple witnesses claim the clock chimed at a different time than expected, write exactly: "the hour striking at a quarter past eleven".
- Seasonal vocabulary allow-list: autumn, autumnal, fall.
- Forbidden seasonal words: spring, summer, winter.

FROZEN TIMELINE STATE (DO NOT ALTER):
- Timeline anchor: October (autumn).
- Month, season, weather, and time-of-year language in this batch must stay compatible with autumn.
- Established timeline fact: The time of death is recorded as ten minutes past eleven.
- If referenced, use exact time phrase: "ten minutes past eleven" (The exact time shown on the stopped clock face).
- If referenced, use exact time phrase: "forty minutes" (The exact amount the clock was wound back).
- If referenced, use exact time phrase: "the hour striking at a quarter past eleven" (Multiple witnesses claim the clock chimed at a different time than expected).

STORY TO DATE (REFERENCE ONLY — DO NOT COPY VERBATIM):
- No previous chapter text exists yet for this batch.

# Case Overview
Title: The Clockwork Conspiracy
Era: 1930s
Setting: Little Middleton
Crime: murder (mechanical tampering)
Culprit: Captain Ivor Hale
False assumption: The murder must have occurred just before the clock struck eleven.
Cast: Eleanor Voss (she/her), Dr. Mallory Finch (she/her), Captain Ivor Hale (he/him), Beatrice Quill (she/her)

Setting Lock: Keep all scenes and descriptions consistent with the stated setting (Little Middleton). Do not introduce a different location type.

Outline scenes:
[
  {
    "sceneNumber": 1,
    "act": 1,
    "title": "Discovery",
    "setting": {
      "location": "the study in Little Middleton",
      "timeOfDay": "Morning after the murder",
      "atmosphere": "Tense household awaiting the detective's arrival"
    },
    "characters": [
      "Eleanor Voss",
      "Captain Ivor Hale",
      "Beatrice Quill"
    ],
    "purpose": "Introduce the crime and initial shock of the household",
    "cluesRevealed": [
      "clue_1"
    ],
    "dramaticElements": {
      "conflict": "The locked study presents a mystery to unravel",
      "tension": "The clock shows ten minutes past eleven, raising questions about the timing",
      "microMomentBeats": [
        "Eleanor stares at the clock, troubled by its stillness."
      ]
    },
    "summary": "Eleanor Voss arrives at the scene of the crime in the study, where the body of an unknown victim lies. The atmosphere is thick with tension as the captain Hale and Beatrice Quill reflect on the shocking event, particularly the clock showing ten minutes past eleven.",
    "estimatedWordCount": 1800,
    "emotionalRegister": "The opening scene evokes a sense of opulence mixed with underlying tension.",
    "dominantCharacterNote": {
      "name": "Eleanor Voss",
      "voiceRegister": "Eleanor's voice flows with a melodic cadence, often laced with irony."
    },
    "humourGuidance": {
      "permission": "permitted"
    },
    "eraTextureNote": "Travel is limited due to increasing military preparations and restrictions.; Communication is hindered by the lack of modern technology and the reliance on telegrams.; Food shortages are beginning to emerge, leading to rationing and scarcity.",
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
□ Chapter 1: "The mechanism relies on the clock in the study to expose the false timing." is placed in the first 25% of the chapter, followed by an explicit inference or suspicion paragraph.
□ Chapter 1: "The clock in the study shows ten minutes past eleven when the body is discovered." is placed in the first 25% of the chapter, followed by an explicit inference or suspicion paragraph.
□ PRONOUN AUDIT — for every character you named in your chapters, list the pronouns you actually used, then verify against the canonical table. Correct any mismatch before outputting. Do NOT include this audit in your JSON output.
  Character            | Canonical     | Used in draft | Match?
  ---------------------|---------------|---------------|-------
  Eleanor Voss         | she/her/her/herself       | [fill in]     | [yes/no]
  Dr. Mallory Finch    | she/her/her/herself       | [fill in]     | [yes/no]
  Captain Ivor Hale    | he/him/his/himself        | [fill in]     | [yes/no]
  Beatrice Quill       | she/her/her/herself       | [fill in]     | [yes/no]
□ Return valid JSON only.
```
