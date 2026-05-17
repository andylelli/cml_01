# Actual Prompt Record

- Run ID: `mystery-1779014555364`
- Project ID: ``
- Timestamp: `2026-05-17T11:49:28.909Z`
- Agent: `Agent9-ProseGenerator-Ch5`
- Operation: `chat_request_full_prompt`
- Model: `GPT-4o-mini`
- Temperature: `0.42`
- Max Tokens: `4500`
- Attempt: `first`
- Prompt Hash: `f80529088e98df16`

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
- MORAL COMPLEXITY REQUIREMENT: The mechanism of this crime carries a moral gray area: "Though the murderer acted out of revenge for a past injustice, the violent act blurs the line between justice and vengeance." — the culprit reveal and denouement MUST acknowledge this ambiguity. Do not let the ending feel clean or simple. Give the reader at least one moment of uncomfortable sympathy or moral doubt.


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

## Era: 1935-08
In August 1935, the atmosphere in Little Middleton is charged with a complex mix of opulence and desperation. The lingering effects of the Great Depression weigh heavily on the upper classes, who cling to their status while grappling with financial strain. The threat of political upheaval in Europe adds a layer of anxiety to social interactions, as whispers of fascism circulate among the elite. Guests at the manor, dressed in their finest summer attire, navigate a delicate balance between maintaining appearances and confronting their own vulnerabilities. As they gather for a seemingly innocent estate planning meeting, the tension is palpable, revealing the fragility of their social fabric.
Emotional register: A collective sense of anxiety and fragility permeates society, as individuals grapple with the uncertainties of their future.
Physical constraints: Limited mobility due to economic hardships affecting travel | Communication primarily through letters and telegrams, with few telephones | Isolation of the manor, making it difficult for help to arrive quickly | Weather conditions impacting outdoor activities and events
Current tensions (weave into background texture): Economic struggles due to the Great Depression | Rising political tensions in Europe with fascism on the rise | Increased class divides and societal expectations
Wartime context — Many veterans from World War I still carry the scars of their experiences, both physical and emotional.: The returning soldiers are often seen as symbols of honor, but their struggles for recognition highlight the societal disconnect. Absence effect: The absence of those who served abroad creates a palpable tension as families cope with loss and the scars of war.

## Story Theme
The quest for truth amid hidden agendas reveals how societal pressures can distort personal morals and relationships, and reveals that evidence carries ethical weight, forcing characters to choose accountability over social performance when appearances and facts collide.

## Story Emotional Register
Dominant: The story is characterized by an atmosphere of tension and unease, where secrets unravel and truths are confronted.

Arc:
The story opens with a gathering at Little Middleton Manor, where the laughter and conversation of the guests mask an underlying tension. The atmosphere is heavy with the weight of Eleanor Voss's murder, a crime that shatters the facade of elegance and exposes the fragility of social standings. As the investigation begins, Eleanor's attempts to maintain her reputation clash with the growing unease among the guests, leading to a series of false leads and emotional turmoil. The first clues suggest mechanical tampering with the clock, hinting at deeper motivations hidden within the relationships of the characters. A mid-story pivot occurs when Dr. Mallory Finch's alibi is questioned, shifting suspicion towards him and unveiling his dark secret. The emotional stakes escalate as the pressure mounts, culminating in a confrontation that reveals the true nature of the characters’ ambitions and fears. In the resolution, the emotional cost of the investigation weighs heavily on each character, leaving them to grapple with the consequences of their actions and the fragile nature of their social fabric.

The story opens: The initial atmosphere is one of elegance tinged with anxiety, as the murder casts a shadow over the gathering. As the investigation takes shape: The investigation reveals initial clues that heighten the tension and introduce emotional stakes. A first key turn arrives: A pivotal moment shifts suspicion towards Dr. Finch, complicating the investigation further. At the mid-point of the story: The discovery of Finch's alibi challenges previous assumptions, deepening the mystery.

A second pivot reshapes the course: A confrontation reveals the true motivations of the characters, leading to crucial revelations. As tension reaches its height: Mounting pressure forces characters to confront their secrets and the consequences of their actions. The climax brings the central question to a head: The climax is marked by a confrontation that exposes the underlying tensions and moral dilemmas. In the final resolution: Each character is left to grapple with the emotional fallout, revealing the cost of their pursuit of truth.

Underpinning every turn is the story's central concern: The quest for truth amid hidden agendas reveals how societal pressures can distort personal morals and relationships. This thread binds the individual emotional moments into a coherent journey.

The dominant register — The story is characterized by an atmosphere of tension and unease, where secrets unravel and truths are confronted. — colours the prose from first chapter to last, ensuring the reader feels the weight of each revelation as moral consequence rather than mere puzzle mechanics.

## Emotional register at this point in the story
A pivotal moment shifts suspicion towards Dr. Finch, complicating the investigation further.

## Character Portraits (appearance & era)

### Eleanor Voss
Eleanor Voss embodies the struggle of the upper class during the Great Depression, as she attempts to maintain her social standing amidst financial turmoil. Her gatherings at the manor are not just social events but desperate attempts to secure her place in a rapidly changing world. Eleanor's charm masks her internal battles, revealing a woman caught between her family's legacy and the harsh realities of her situation.
Era intersection: Eleanor's pursuit of social status clashes with the societal pressures of the 1930s, forcing her to confront her reliance on appearances.

### Beatrice Quill
Beatrice Quill's ambition as a journalist drives her to seek sensational stories, reflecting the competitive nature of the media landscape in the 1930s. Her desire for success is complicated by her own fabrications, showcasing the ethical dilemmas faced by those striving for recognition. The murder investigation presents her with an opportunity to elevate her career, but at what cost?
Era intersection: Beatrice's pursuit of fame amidst the backdrop of economic hardship highlights the struggles of women striving for agency in a male-dominated society.

## Character Voices

### Eleanor Voss (she/her/her)
Eleanor speaks with a refined cadence, her laughter charming and her words often laced with clever quips.
[comfortable] It's quite amusing how the clock seems to have a mind of its own, isn't it?
[evasive] Oh, I'm sure it was just a simple misunderstanding, nothing to worry about.
[stressed] What if they begin to suspect me? I can't let that happen.
Humour: Eleanor's dry wit often shines through, making her both relatable and endearing.

### Beatrice Quill (she/her/her)
Beatrice's rapid-fire delivery reflects her enthusiasm and ambition, often cutting to the chase.
[comfortable] This story could really make waves; I just need the right angle!
[evasive] Oh, I wouldn't want to pry into anyone's private affairs.
[stressed] What if they find out about my fabrications? I can't let that happen!
Humour: Her blunt humor injects energy into conversations, making her both engaging and relatable.

## Location Registers (scene framing guides)

Grand Hall: The Grand Hall serves as a tense gathering space where guests mask their anxieties with polite conversation, creating an atmosphere thick with unspoken fears and hidden motives.. Camera angle: Entering the Grand Hall feels like stepping into a chamber of secrets, where every shadow holds the weight of speculation.. Era: The opulence of the hall contrasts sharply with the underlying tension of the era, making it a stage for both social performance and personal conflict.

Library: The library is a sanctuary of knowledge, yet it feels oppressive as the storm outside mirrors the turmoil within the characters, inviting both curiosity and trepidation.. Camera angle: Entering the library evokes a sense of discovery, where knowledge may hold the key to untangling the web of deceit.. Era: Dark oak shelves lined with leather-bound volumes speak to a time of grandeur, yet the air is thick with the mustiness of forgotten secrets.

Drawing Room: The drawing room buzzes with social energy, yet an undercurrent of tension simmers beneath the surface as guests navigate their complex relationships amid the murder.. Camera angle: The drawing room feels like a stage where every interaction is a performance, laden with hidden agendas.. Era: The luxurious furnishings and elegant décor create a facade of comfort, contrasting starkly with the emotional strain present in the air.

Formal Gardens: The gardens, while beautiful, serve as a reminder of isolation, where secrets can be exchanged away from prying eyes, creating a tension-filled backdrop for clandestine meetings.. Camera angle: Walking through the gardens feels like traversing a maze of intrigue, where every corner hides a potential revelation.. Era: The meticulously manicured hedges evoke a sense of control, yet the shadows lurking within hint at the chaos brewing beneath the surface.

## Humour guidance for this story position (first_turn)
Permission: forbidden
Rationale: The tension scene demands gravity as relationships strain under scrutiny.

## Character Pressure
Captain Ivor Hale is approaching a point of breakdown. Stress and strain should be accumulating visibly — through behaviour, not statement. No confrontation yet.

## Reveal Groundwork (texture — do not explain, only plant)
- Plant one subtle observable beat related to: "The moment when the clock is discovered to be tampered reveals a deeper conspiracy than initially thought, retroactively coloring the guests' alibis". Do not explain significance yet.
- Plant one subtle observable beat related to: "Finch's nervousness during his interview suggests his guilt, reshaping the readers' perception of his character". Do not explain significance yet.
- Plant one subtle observable beat related to: "Finally, Eleanor's desperate attempts to maintain her status illustrate the lengths individuals will go to protect their reputation, influencing their actions throughout the story". Do not explain significance yet.

FAIR-PLAY AND INFERENCE CONTRACT (from CML logic):
- False assumption in force: The time on the clock accurately reflects the time of death.
- Hidden truth to progressively expose: The clock has been tampered with to mislead the investigation.
- Inference path checkpoints to dramatize clearly (observation -> correction -> effect):
  - Step 1: obs: The clock in the central hall shows a time of quarter past eight. | corr: This suggests the murder occurred after the clock showed eight o'clock. | effect: Narrows the opportunity window for suspects to those present during this time.
  - Step 2: obs: Beatrice Quill confirms she wound the clock earlier that day. | corr: If the clock was wound, it should be accurate unless tampered. | effect: Eliminates Beatrice as a suspect based on her ability to maintain the clock.
  - Step 3: obs: Dr. Mallory Finch's pocket watch is found to be eight minutes fast. | corr: This discrepancy indicates he was aware of the clock's tampering. | effect: Narrows suspicion towards Dr. Mallory Finch as he had motive and knowledge of the clock's manipulation.
- Discriminating test method: trap
- Discriminating test design constraint: A controlled comparison between the clock and the victim's watch during the reenactment reveals the clock's tampering.
- Test must rely on already-shown clue IDs: clue_watch_time, clue_clock_time, clue_beatrice_statement, clue_fp_contradiction_step_3, clue_mechanism_visibility_core
- Fair-play rationale: Step 1: The clock's reading and the victim's watch establish a timeline discrepancy. Step 2: Beatrice's alibi eliminates her as a suspect. Step 3: Dr. Mallory Finch's fast watch indicates his knowledge of the clock's tampering, leading to the test.
- Never solve by withheld information. Keep reader-information parity with detective reasoning.

## Character Reference

### Eleanor Voss (she/her — NEVER he/him)
Eleanor speaks with a refined cadence, often punctuating her sentences with clever quips and thoughtful pauses that draw her audience in
She enjoys playful banter but can quickly turn earnest when discussing matters close to her heart.
Eleanor grapples with the fear that her reliance on social status may ultimately lead to her downfall. She feels guilty for not being more proactive in her financial matters, which has placed her in such a precarious position.

### Beatrice Quill (she/her — NEVER he/him)
Beatrice speaks with a rapid-fire delivery, her words tumbling out in a rush of enthusiasm
She often employs colloquial expressions and is unafraid to voice her opinions bluntly, making her both relatable and disarming.
Beatrice is torn between her ambition and the ethical implications of her actions. She feels a growing sense of unease about her fabrications, yet the thrill of the chase and the prospect of success keep her locked in a cycle of deception.


## CHARACTER CONTRACTS (binding for this scene)
Each entry below constrains how this character must be written in this chapter.
These override generic style guidance when they conflict.

### Eleanor Voss[SHE]
Voice & mannerisms: Eleanor speaks with a refined cadence, often punctuating her sentences with clever quips and thoughtful pauses that draw her audience in. She enjoys playful banter but can quickly turn earnest when discussing matters close to her heart.
Sample voice fragments (match this register and rhythm):
  [comfortable] "It's quite amusing how the clock seems to have a mind of its own, isn't it?"
  [evasive] "Oh, I'm sure it was just a simple misunderstanding, nothing to worry about."
Humour: dry wit — deploy occasionally (level 0.5)
FORBIDDEN phrase (never write for Eleanor Voss): "a surge of determination washed over her"
Act 2 behaviour contract: May show unease, evasion, or mild defensiveness when questioned. One behavioural tell is permitted. Internal conflict emerging: "Eleanor grapples with the fear that her reliance on social status may ultimately lead to her downfall. She feels guilty for not being more proactive in her financial matters, which has placed her in such a precarious position."

### Beatrice Quill[SHE]
Voice & mannerisms: Beatrice speaks with a rapid-fire delivery, her words tumbling out in a rush of enthusiasm. She often employs colloquial expressions and is unafraid to voice her opinions bluntly, making her both relatable and disarming.
Sample voice fragments (match this register and rhythm):
  [comfortable] "This story could really make waves; I just need the right angle!"
  [evasive] "Oh, I wouldn't want to pry into anyone's private affairs."
Humour: blunt — deploy frequently (level 0.7)
FORBIDDEN phrase (never write for Beatrice Quill): "she chose her words with great care"
Act 2 behaviour contract: May show unease, evasion, or mild defensiveness when questioned. One behavioural tell is permitted. Internal conflict emerging: "Beatrice is torn between her ambition and the ethical implications of her actions. She feels a growing sense of unease about her fabrications, yet the thrill of the chase and the prospect of success keep her locked in a cycle of deception."



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
A sprawling estate steeped in mystery, where secrets linger behind every door and the atmosphere is thick with tension.

Key Locations Available:
- Grand Hall (interior): Gathering space
- Library (interior): Clue discovery
- Drawing Room (interior): Social gathering space
- Formal Gardens (exterior): Clue discovery, secluded meeting space

Atmosphere: Tense and foreboding, with an undercurrent of suspicion among the guests.
Weather: Overcast with occasional rain, creating a somber mood.

Era markers: Petrol touring cars parked in the courtyard | Typewriters clacking in the study | Gas lamps flickering in the hallways

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
  - Visual: Flickering gas lamps casting shadows, Rich tapestries hanging on the walls, Polished marble floor reflecting light
  - Sounds: Echoing footsteps on marble, Distant thunder rumbling outside, Soft whispers of guests conversing
  - Scents: Dust mingling with beeswax polish, Scent of damp wood and leather, Faint floral perfume lingering
  - Touch: Cool marble underfoot, Worn leather on the staircase railing

Library (interior):
  - Visual: Rows of dusty books on oak shelves, Faded map of the estate on the wall, Soft glow of a reading lamp
  - Sounds: Pages turning softly, Distant thunder rumbling, Quiet footsteps on carpet
  - Scents: Aging paper and leather, Hint of mildew in the air, Scent of polished wood
  - Touch: Worn leather of the armchair, Coolness of the window glass

Drawing Room (interior):
  - Visual: Ornate chandeliers casting soft light, Elegant floral arrangements on the table, Richly patterned carpets underfoot
  - Sounds: Laughter mingling with soft piano music, Clinking of glasses during toasts, Distant sounds of rain on windows
  - Scents: Scent of polished wood and fresh flowers, A hint of tobacco smoke lingering, Bouquet of wine filling the air
  - Touch: Soft velvet cushions on the sofa, Cool surface of the grand piano

⛔ REFERENCE DATA — DO NOT TRANSCRIBE VERBATIM: The above profiles are structural guides only. Generate original prose that evokes these qualities; do not reproduce the exact phrasing or sentence structure of the profile paragraphs.

SCENE OPENING RULE: When opening a scene in a new location, write what the POV character directly observes and physically senses at that moment — not a general description of the room's qualities. The reader must feel present, not briefed. Sensory details must be observed by the character, not stated as fact about the place.

SENSORY WRITING TECHNIQUES:
- Opening paragraphs: Lead with 2-3 sensory details to ground the scene
- Movement between locations: Note sensory changes (quiet study → noisy dining room)
- Emotional scenes: Use sensory details to reinforce mood (cold rain during argument)
- Period authenticity: Use period-specific sensory details from location/temporal profiles
- Avoid: Over-reliance on v
[truncated for prompt budget]

## Texture Pool
Draw on these as opportunities arise — you are not required to use them.

- In August 1935, the atmosphere in Little Middleton is charged with a complex mix of opulence and desperation
- The lingering effects of the Great Depression weigh heavily on the upper classes, who cling to their status while grappling with financial strain
- The threat of political upheaval in Europe adds a layer of anxiety to social interactions, as whispers of fascism circulate among the elite
- Guests at the manor, dressed in their finest summer attire, navigate a delicate balance between maintaining appearances and confronting their own vulnerabilities
- As they gather for a seemingly innocent estate planning meeting, the tension is palpable, revealing the fragility of their social fabric.

TEMPORAL CONTEXT:

This story takes place in August 1935 during summer.

Seasonal Atmosphere:
- Weather patterns: overcast with occasional rain, humidity in the air, cool breezes
- Daylight: Long summer days with twilight stretching into the evening, but cloud cover often dims the light.
- Seasonal activities: Picnics in the countryside, Garden parties at manor houses, Attending local fairs
- Seasonal occasions: Summer Bank Holiday (first Monday in August)
- Season: summer

Period Fashion (describe naturally):
- Men formal: tailored three-piece suit in light wool, white dress shirt with a high collar, black patent leather shoes
- Men casual: linen trousers, short-sleeved cotton shirt, boater hat
- Men accessories: silk tie, cufflinks, pocket watch
- Women formal: elegant tea dress with a cinched waist, lightweight cardigan, cloche hat
- Women casual: cotton blouse with puff sleeves, A-line skirt, flat sandals
- Women accessories: string of pearls, vintage handbag, wide-brimmed straw hat

Cultural Context (reference naturally):
- Music/entertainment: 'Summertime' by Ella Fitzgerald, 'Ain't Misbehavin', Fred Astaire's dance routines; Films: 'Top Hat' starring Ginger Rogers and Fred Astaire, 'The 39 Steps' directed by Alfred Hitchcock; Theatre: 'Pygmalion' by George Bernard Shaw, 'The Royal Family' by George S. Kaufman; Radio: The Shadow, The Jack Benny Program
- Typical prices: Loaf of bread: four pence, Cinema ticket: one shilling, Cup of tea at a café: sixpence
- Current events: Tensions rise in Europe with the rearmament of Germany; The United States faces economic struggles with high unemployment rates
- Literature: 'Murder in the Cathedral' by T.S. Eliot | 'The Good Soldier' by Ford Madox Ford | 'The Maltese Falcon' by Dashiell Hammett | [Mystery and detective fiction] | [Social realism] | [Political commentary]
- Technology: The electric refrigerator becoming common in households | The first television broadcasts in limited areas | Typewriters in offices | Telephones in most homes | Automobiles for personal transport
- Daily life: Attending community fairs or agricultural shows, Social teas among friends, Evening strolls in the park
- Social rituals: Formal dinner parties held at manor houses, Sunday church services followed by social gatherings

Atmospheric Details:
The scent of rain-soaked earth mingles with blooming summer flowers, creating a heavy, earthy aroma. A distant rumble of thunder echoes through the valley, heightening the tension among the gathered guests. The flickering candlelight casts long shadows against the walls of the grand manor, adding an air of mystery to the evening's proceedings.

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
    ⛔ FORBIDDEN alternatives: "11:10", "11.10", "eleven ten", "eleven-ten", "eleven past ten", "quarter past eleven", "half past eleven" — the ONLY acceptable form is "ten minutes past eleven"
  - The exact amount the clock was wound back: "forty minutes"
  - The time shown on the victim's personal watch: "twenty minutes past eleven"
    ⛔ FORBIDDEN alternatives: "11:20", "11.20", "eleven twenty", "eleven-twenty", "eleven past twenty", "quarter past eleven", "half past eleven" — the ONLY acceptable form is "twenty minutes past eleven"

If a locked fact has no relevance to this chapter, omit it. But the moment you reference the underlying evidence, only the exact phrase above is acceptable.

⛔ CLUES TO SURFACE IN THESE CHAPTERS — mandatory:
The following evidence MUST be clearly observable to an attentive reader. Do not bury it in atmosphere or passing dialogue. Each clue must be concrete, specific, and noticeable:

• [clue_clock_time] This suggests the murder occurred after the clock showed eight o'clock.
  Category: temporal | Criticality: essential | Supports inference step 2
  Points to: This is a contradiction to the actual timing of events.

For each clue above: an attentive reader should be able to find, record, and later use it to reason toward the solution.

═══ NARRATIVE STATE (read-only — do not contradict) ═══

LOCKED FACTS — use verbatim whenever this evidence is described:
  • The exact time shown on the stopped clock face: "ten minutes past eleven"
  • The exact amount the clock was wound back: "forty minutes"
  • The time shown on the victim's personal watch: "twenty minutes past eleven"

CHARACTER PRONOUNS — never deviate from these:
  • Eleanor Voss: she/her/her
  • Dr. Mallory Finch: he/him/his
  • Captain Ivor Hale: he/him/his
  • Beatrice Quill: she/her/her

CLUES ALREADY REVEALED TO READER: clue_mechanism_visibility_core, clue_core_contradiction_chain, clue_fp_contradiction_step_1, clue_watch_time, clue_fp_contradiction_step_3 — do not reveal these as new information.

INVESTIGATION LOG — WHAT IS ESTABLISHED (do not re-establish, do not repeat):
• Evidence in reader's hands: A mechanical clock has been deliberately tampered with to mislead the time of death. | The clock in the central hall shows a time of quarter past eight. | The clock in the central hall shows a time of quarter past eight. | Dr. Mallory Finch's pocket watch is found to be eight minutes fast. | Dr. Mallory Finch's pocket watch is found to be eight minutes fast.
• Suspects still unresolved: Eleanor Voss[SHE], Captain Ivor Hale[HE], Beatrice Quill[SHE]
⚠ The story must move FORWARD from this log. Any beat already listed above is forbidden from repeating.

⚠ THIS CHAPTER'S REQUIRED ADVANCE (first_turn): Examine physical evidence — find at least one new clue

CONTINUITY HANDOFF — previous chapter closing beat:
  • "As they stood there, the silence in the study felt heavy with unspoken words and hidden motives. Eleanor's mind raced with possibilities, each scenario more intricate than the last. The watch was not just a timepiece; it was a key to unlocking the mystery that..."
  • The next chapter must open as a continuation of this beat, not as a disconnected reset.
═══════════════════════════════════════════════════════

═══════════════════════════════════════════════════════════
📚 CONTINUITY CONTEXT - CHARACTER & SETTING CONSISTENCY
═══════════════════════════════════════════════════════════

**CRITICAL: You are writing chapters 5+. Maintain consistency with earlier chapters.**

**Character Names Used in Chapters 1-4:**
Eleanor Voss, Beatrice Quill

✓ RULE: Use EXACTLY these names. Do NOT vary spelling, add titles, or introduce new forms.
✓ Example: if earlier chapters used "Clara Whitfield", keep using "Clara Whitfield" — never "Mrs. Whitfield" unless that is the character's canonical name in the list above.

**Setting Vocabulary Established in Earlier Chapters:**
study, garden, kitchen, flat

✓ RULE: Continue using this location vocabulary. Maintain consistency with established setting type.
✓ Do NOT introduce new location types that contradict earlier chapters.

**Recent Chapter Summary (for narrative continuity):**
Chapter 2: Chapter 2: Initial Observations
  Events: Thunder rumbled ominously in the distance as Eleanor Voss stood before the grand clock in the central hall of the Finch residence.
Chapter 3: Chapter 3: Alibis and Tensions
  Events: At half past nine in the morning, the storm had finally subsided, leaving behind a heavy silence in the central hall of the Finch residence.
Chapter 4: Chapter 4: The Watch
  Events: The storm had passed, leaving a heavy silence in the Finch residence, study.

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
Known location profile anchors: Little Middleton Manor, Grand Hall, Library, Drawing Room, Formal Gardens, the central hall of the Finch residence
LOCATION NAME CAPITALISATION (HARD REQUIREMENT — validated):
All named locations in your prose MUST use the EXACT capitalisation from the CML profiles.
Canonical forms: "Little Middleton Manor", "Grand Hall", "Library", "Drawing Room", "Formal Gardens", "the central hall of the Finch residence"
Writing a location in lowercase (e.g. "drawing room" instead of "Drawing Room") is a validated error. Every time you mention a named location, copy its capitalisation from the list above.
- Chapter 5: OPENING STYLE (HARD): Start the VERY FIRST SENTENCE with a temporal subordinate clause — e.g. "When [Name] entered…" / "After the last guest…" / "Before the household had stirred…" / "As the light faded…". Anchor opening in "the central hall of the Finch residence". HARD REQUIREMENT for the first 2 paragraphs: (a) include 2+ sensory words — choose from smell/scent/sound/echo/silence/creak/whisper/cold/warm/damp/rough/smooth/glow/shadow/flicker/dim — and (b) include 1+ atmosphere/time word — choose from rain/wind/fog/storm/mist/thunder/evening/morning/night/dawn/dusk/season/afternoon/midday/noon/midnight/twilight/sunrise/sunset/daylight/sunlight/overcast/cloudy/bright/dark. These are validated requirements, not style suggestions; missing them triggers a retry.

[⚠ INTERNAL QUALITY DIAGNOSTICS — DO NOT REPRODUCE ANY PART OF THIS SECTION IN YOUR STORY OUTPUT. These are private generator observations for your consideration only. Your narrative must read as if this section does not exist. Never include phrases from this block in character dialogue, narration, or description.]

PRIOR CHAPTER QUALITY OBSERVATIONS:
- Chapter 3 (score 97/100):
  Quality gaps noted: word density below preferred target (957/1000); scene grounding weakness
  Address in upcoming chapters: Increase chapter density with concrete investigation action and sensory-grounded beats; avoid recap-only padding. | Open next chapter with a named location anchor plus at least two sensory cues and one atmosphere marker.
- Chapter 4 (score 92/100):
  Quality gaps noted: word density below preferred target (793/1000)
  Address in upcoming chapters: Increase chapter density with concrete investigation action and sensory-grounded beats; avoid recap-only padding.
- Phrases to avoid (already overused in earlier chapters): "in the central hall of the finch", "the central hall of the finch residence", "tampered with we must consider who had", "at the thought of betrayal lurking among", "the thought of betrayal lurking among them", "kind of story that could make headlines", "her voice rising slightly but we must", "voice rising slightly but we must tread", "rising slightly but we must tread carefully", "slightly but we must tread carefully if".
[END INTERNAL DIAGNOSTICS]

PROMPT BUDGET SUMMARY: budget=32000 tokens; fixed=10213; context=10758; dropped=[none]; truncated=[pronoun_accuracy, location_profiles, temporal_context]

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
- Chapter numbering starts at 5 and increments by 1 per scene.
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
8. Integrate at least two concrete era-grounded details per chapter from setting refinement signals: petrol touring cars on county roads | domestic wiring with frequent outages | typewriters standard in offices | party-line telephone exchanges common | telegram services available via local post offices | airmail for faster correspondence.
9. Respect setting movement/access constraints in scene action and alibis: geographic layout restricts movement to main access roads and paths | architecture creates natural barriers such as locked doors and gated areas | weather conditions can delay communication and access to the estate | restricted areas include private quarters and secure storage rooms | daily schedules dictate when certain areas are accessible to staff and guests.
10. Sustain social coherence with this backdrop pressure: A gathering at the manor for a wealthy benefactor's estate planning reveals underlying tensions as class struggles and societal pressures collide amid the Great Depression.
11. Maintain continuity around these socially central cast anchors where relevant: Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill.
12. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Critical: Plot similarity 0.75 with 'The Mysterious Affair at Styles' (same crime type and method)
13. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Moderate: Setting similarity 0.85 with 'The Mysterious Affair at Styles' (same era and similar setting)
14. STORY TO DATE ANTI-COPY RULE: The STORY TO DATE section below is provided for chronological and factual reference ONLY. You MUST NOT copy, lightly rephrase, or structurally echo any sentence or paragraph from prior chapters. Every sentence in this chapter must be original prose unique to this scene. Reusing even a clause from prior chapter text will cause this attempt to fail immediately.

CRITICAL PROSE REQUIREMENTS:

The CML specifies exact requirements for certain validation-critical scenes. You MUST include these elements at the specified positions.

**Discriminating Test Scene (Act 3, Scene 4):**
Required elements: Execute the discriminating test, Observe the clock and victim's watch comparison, Draw conclusion about guilt of Dr. Mallory Finch
Test type: temporal manipulation proof

**Suspect Clearance Scenes:**
- Beatrice Quill (Act 3, Scene 5): Witness accounts confirm she was in the kitchen.
  Clues: clue_beatrice_statement, clue_kitchen_alibi
- Captain Ivor Hale (Act 3, Scene 5): Alibi confirmed: 8:00 PM to 8:30 PM

**Culprit Revelation Scene (Act 3, Scene 6):**
Method: Confrontation with evidence of clock tampering.

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
- Chapter 5:
  - STRUCTURAL ARCHETYPE — Chapter 5 must be: RED_HERRING
      ✓ MUST contain: wrong lead followed and disproved
      ✗ MUST NOT contain: final culprit identified
  - Word count: Target 1250 words. Achieve this through plot events, dialogue exchanges, and physical investigation — not through atmospheric repetition or extended internal reflection. Each 200-word segment should contain at minimum one concrete story event (a discovery, a conversation exchange, a physical action or movement). Padding with atmosphere alone is not acceptable.
  - Opening: Begin with a character action, spoken line, or clock/time marker — never a location name or location-description phrase.
  - Scene is set in: the central hall of the Finch residence — reference it naturally within the paragraph, never as your opening phrase.
  - Opening atmosphere (MANDATORY — validator enforced): the first paragraph MUST contain at least one of: rain / wind / fog / storm / mist / thunder / evening / morning / night / dawn / dusk / season / afternoon / midday / noon / midnight / twilight / sunrise / sunset / daylight / sunlight / overcast / cloudy / bright / dark. A chapter that omits all of these from its opening paragraph will be rejected.
  - Continuity bridge: in the first 120 words, visibly connect from the previous chapter's final beat. Carry forward one unresolved element (object, accusation, emotional pressure, or immediate physical action) from: "As they stood there, the silence in the study felt heavy with unspoken words and hidden motives. Eleanor's mind raced with possibilities, each scenario more intricate than the last. The watch was not just a timepiece; it...".
  - CLUE OBLIGATIONS — mandatory prose elements (do NOT omit or bury):
    • This suggests the murder occurred after the clock showed eight o'clock. [clue_clock_time]
      Points to: This is a contradiction to the actual timing of events.
  - Tonal contrast: include at least one beat of relief or ironic counterpoint. Do not sustain maximum tension for every paragraph.

- Tonal contrast required: the previous chapter was high-tension. This chapter must include at least one beat of relief, pause, or quiet observation.
- Locked fact phrase obligations:
  - If this batch mentions The exact time shown on the stopped clock face, write exactly: "ten minutes past eleven".
  - If this batch mentions The exact amount the clock was wound back, write exactly: "forty minutes".
  - If this batch mentions The time shown on the victim's personal watch, write exactly: "twenty minutes past eleven".
- Seasonal vocabulary allow-list: summer, summery, midsummer.
- Forbidden seasonal words: spring, autumn, winter.

FROZEN TIMELINE STATE (DO NOT ALTER):
- Timeline anchor: August (summer).
- Month, season, weather, and time-of-year language in this batch must stay compatible with summer.
- Established timeline fact: 7:00 PM
- Established timeline fact: 8:30 PM
- If referenced, use exact time phrase: "ten minutes past eleven" (The exact time shown on the stopped clock face).
- If referenced, use exact time phrase: "forty minutes" (The exact amount the clock was wound back).
- If referenced, use exact time phrase: "twenty minutes past eleven" (The time shown on the victim's personal watch).

STORY TO DATE (REFERENCE ONLY — DO NOT COPY VERBATIM):
- Full prior chapter text is provided below for continuity, factual consistency, and reference accuracy.
- Use this to keep character voice, chronology, clue state, and location continuity aligned with earlier chapters.
- Do not quote, copy, or paraphrase these paragraphs too closely; write fresh prose that remains consistent with them.

--- BEGIN PRIOR CHAPTER 1 ---
Title: Chapter 1: Discovery
Eleanor Voss stood rigidly in the central hall of the Finch residence, her heart pounding in rhythm with the distant rumble of thunder. The oppressive weight of the evening air clung to her, mingling with the scent of damp wood and polished leather. She glanced at the clock, its hands frozen in time, a harbinger of the tragedy that had unfolded within these walls. The clock showed ten minutes past eleven, a detail that sent a chill racing down Eleanor's spine. She could feel the eyes of the others upon her, their expressions a mixture of shock and confusion as they awaited the arrival of the detective. The storm outside intensified, rain lashing against the windows, mirroring the turmoil within her mind.

As Eleanor approached the clock, she reached out hesitantly, her fingers brushing against the cold surface. The clock had been deliberately tampered with to mislead the time of death. She could hardly comprehend the implications of this act. The thought of someone manipulating time itself sent a shiver through her. This was not merely a mechanical failure; it was a calculated deception. The realization struck her: the victim had died no later than eleven past eleven, contradicting the alibis of those gathered in the room. Each tick of the clock, now a silent witness to the crime, seemed to echo the urgency of their predicament.

Dr. Finch, standing nearby, observed Eleanor's reaction with a measured gaze. He cleared his throat, attempting to mask the tension that hung in the air. 'It appears our friend has left us with more questions than answers,' he remarked, his voice steady but laced with an undercurrent of unease. 'If the clock is indeed tampered with, we must consider who had the opportunity to do so.' His words hung in the air, heavy with implication, as the others shifted uncomfortably, glancing at one another with a mix of suspicion and fear.

Captain Hale, arms crossed and jaw set, stepped forward, his brow furrowed in thought. 'We all had our reasons to be here at that time,' he said, his voice low but firm. 'But the question remains: who among us would risk everything to ensure this clock told a different story?' The tension in the room thickened, and Eleanor felt her stomach twist at the thought of betrayal lurking among them. It was a chilling realization, one that made her acutely aware of the fragile nature of trust.

Beatrice Quill, ever the journalist, seized the moment, her eyes sparkling with a mix of excitement and dread. 'This is the kind of story that could make headlines,' she said, her voice rising slightly. 'But we must tread carefully. If we are to uncover the truth, we must first understand the lies that have been woven around us.' Her enthusiasm felt misplaced in the somber atmosphere, yet Eleanor admired Beatrice's determination. It was a reminder that amidst the chaos, there was still a pursuit of truth, however dangerous it might be.

Eleanor turned back to the clock, her mind racing with possibilities. The mechanical tampering suggested a deeper conspiracy, one that could unravel the very fabric of their lives. The storm outside raged on, and he felt as if the tempest mirrored the turmoil within the Finch residence. Each character in the room held a piece of the puzzle, and as the detective Voss arrived, she knew that the investigation would reveal not just the truth about the murder, but also the hidden motives that lay beneath their polished exteriors.

As the detective entered, the atmosphere shifted once more. Voss's presence commanded attention, and Eleanor felt a flicker of hope. Perhaps she would untangle the web of deceit that had ensnared them all. The detective's sharp gaze swept over the room, taking in the tension and unease that clung to the air like the scent of rain-soaked earth. 'I trust you've all been waiting patiently,' she said, a hint of irony in her tone. 'Let us begin to uncover the truth behind this tragedy.'

Eleanor felt a surge of determination. The clock may have stopped, but she was resolved to ensure that the truth would not remain frozen in time. With each revelation, she hoped to reclaim not only the narrative of that fateful night but also her own sense of agency in a world that felt increasingly out of her control.
--- END PRIOR CHAPTER 1 ---

--- BEGIN PRIOR CHAPTER 2 ---
Title: Chapter 2: Initial Observations
Thunder rumbled ominously in the distance as Eleanor Voss stood before the grand clock in the central hall of the Finch residence. The relentless rain lashed against the windows, creating a chaotic symphony that mirrored the turmoil in her heart. The scent of damp wood mingled with the polished leather of the furnishings, filling the air with a musty aroma that felt heavy with secrets. The clock displayed the time of ten minutes past eleven, a detail that sent a shiver racing down her spine. Eleanor's resolve to uncover the truth felt as fragile as the glass that separated her from the storm outside, yet she was determined to push forward.

As Eleanor leaned closer to the clock, she felt a chill creep over her. The clock had clearly been tampered with, and the implications were staggering. If it truly showed ten minutes past eleven, then the victim's death must have occurred around that time, which contradicted the alibis of those present. The realization struck her like a jolt of electricity: someone had manipulated the very essence of time to mislead the investigation. He cast a furtive glance at Dr. Finch, who stood nearby, his brow furrowed in concentration. What secrets was he hiding behind that composed facade?

Dr. Finch's eyes darted to the clock, a flicker of anxiety crossing his face as he cleared his throat. 'It seems we are left with more questions than answers,' he said, his voice steady but tinged with unease. 'If the clock has indeed been tampered with, we must consider who had the means and opportunity to do so.' His words hung in the air, heavy with implication, as the others exchanged glances filled with suspicion and fear. The storm outside intensified, and Eleanor felt the weight of their collective anxiety pressing down upon her, a palpable reminder of the stakes involved.

With a determined stride, Captain Hale stepped forward, arms crossed and his jaw set. 'We all had our reasons to be here at that time,' he asserted, his voice low but firm. 'However, the real question is: who among us would go to such lengths to alter the truth?' The atmosphere thickened, and Eleanor's stomach twisted at the thought of betrayal lurking among them. It was a chilling realization, one that made her acutely aware of the fragile nature of trust. Each character held a piece of the puzzle, and as she stood among them, she couldn't help but wonder who would emerge as the true villain in this unfolding drama.

Beatrice Quill, with her ever-keen journalistic instincts, seized the moment, her eyes alight with a mix of excitement and dread. 'This is the kind of story that could make headlines,' she declared, her voice rising slightly. 'But we must tread carefully. If we are to uncover the truth, we must first understand the lies that have been woven around us.' Her enthusiasm felt misplaced in the somber atmosphere, yet Eleanor admired Beatrice's determination. It was a reminder that amidst the chaos, there was still a pursuit of truth, however dangerous it might be. The storm outside raged on, and Eleanor felt as if the tempest mirrored the turmoil within the Finch residence, each character's hidden motives swirling like the dark clouds above.

Eleanor fixed her gaze on the clock once more, her mind racing with possibilities. The mechanical tampering suggested a deeper conspiracy, one that could unravel the very fabric of their lives. She could feel the weight of their secrets pressing down on her, and the urgency of the situation propelled her forward. 'We need to establish a timeline,' she said, her voice steady. 'If we can determine when the clock was last accurate, we may be able to piece together the events leading up to the murder.' The others nodded in agreement, their expressions a mixture of determination and dread.

As they began to discuss their alibis, Eleanor couldn't shake the feeling that the truth was just out of reach. Each statement was laced with tension, and she could sense the nervousness in the air as they recounted their whereabouts during the critical moments. Dr. Finch's alibi was particularly scrutinized, and Eleanor watched as he fidgeted with his cufflinks, a telltale sign of his anxiety. 'I was in my study, working on patient notes,' she insisted, but the uncertainty in her voice made Eleanor question the validity of her claim.

Captain Hale's alibi was equally scrutinized, and he defended himself with a fervor that felt almost desperate. 'I was tending to the garden,' he asserted, his voice rising slightly. 'I had no reason to be anywhere near the clock.' But Eleanor couldn't help but wonder if that was the truth or merely a convenient excuse. The tension in the room was palpable, and as they continued to discuss their movements, Eleanor felt the weight of suspicion settling over them like a shroud. The storm outside raged on, and she knew that the investigation would reveal not just the truth about the murder, but also the hidden motives that lay beneath their polished exteriors.
--- END PRIOR CHAPTER 2 ---

--- BEGIN PRIOR CHAPTER 3 ---
Title: Chapter 3: Alibis and Tensions
At half past nine in the morning, the storm had finally subsided, leaving behind a heavy silence in the central hall of the Finch residence. Eleanor Voss stood before the grand clock, its hands frozen in time, a silent witness to the tragedy that had unfolded. The air was thick with the scent of damp wood, mingling with the faint aroma of polished leather from the furnishings. She felt the weight of the moment pressing down on her, the stillness amplifying the tension that hung in the room. Captain Hale's voice echoed in his mind, his desperate defense still fresh: 'I had no reason to be anywhere near the clock.' The question loomed large: who among them could be trusted, and who was hiding a darker truth?

Eleanor stepped closer to the clock, her heart racing as she observed the time displayed: the clock in the central hall shows a time of quarter past eight. The implications of this revelation sent a shiver down her spine. If the clock had indeed stopped at this time, it suggested that the murder must have occurred after eight o'clock, contradicting the alibis of those present. Each tick of the clock, now a frozen moment in time, felt like a taunt, reminding her that someone had manipulated the very essence of time to mislead them all. The thought of such a calculated deception was chilling, and Eleanor's resolve to uncover the truth intensified.

Dr. Finch stood nearby, his expression carefully composed, but Eleanor could see the flicker of anxiety in his eyes as he glanced toward the clock. 'If the clock has indeed been tampered with, we must consider who had the means and opportunity to do so,' he said, his voice steady but laced with an undercurrent of tension. The others exchanged glances, their faces reflecting a mixture of suspicion and fear. Eleanor could feel the weight of their collective anxiety pressing down upon her, a palpable reminder of the stakes involved. The storm outside had passed, but the tempest within the Finch residence was just beginning.

Captain Hale, arms crossed and brow furrowed, stepped forward. 'We all had our reasons to be here at that time,' he asserted, his voice low but firm. 'But the question remains: who among us would risk everything to ensure this clock told a different story?' The tension in the room thickened, and Eleanor felt her stomach twist at the thought of betrayal lurking among them. Each character held a piece of the puzzle, and as she stood among them, she couldn't help but wonder who would emerge as the true villain in this unfolding drama.

Beatrice Quill, her eyes sparkling with a mix of excitement and dread, seized the moment. 'This is the kind of story that could make headlines,' she declared, her voice rising slightly. 'But we must tread carefully. If we are to uncover the truth, we must first understand the lies that have been woven around us.' Her enthusiasm felt misplaced in the somber atmosphere, yet Eleanor admired Beatrice's determination. It was a reminder that amidst the chaos, there was still a pursuit of truth, however dangerous it might be. The storm outside had passed, but the shadows of their secrets lingered in the corners of the hall.

Eleanor turned back to the clock, her mind racing with possibilities. 'We need to establish a timeline,' she said, her voice steady. 'If we can determine when the clock was last accurate, we may be able to piece together the events leading up to the murder.' The others nodded in agreement, their expressions a mixture of determination and dread. Each statement was laced with tension, and Eleanor could sense the nervousness in the air as they recounted their whereabouts during the critical moments. Dr. Finch's alibi was particularly scrutinized, and Eleanor watched as he fidgeted with his cufflinks, a telltale sign of his anxiety.

As they began to discuss their alibis, Eleanor felt the pressure mounting. 'I was in my study, working on patient notes,' Dr. Finch insisted, but the uncertainty in his voice made Eleanor question the validity of his claim. 'And you, Captain Hale?' he pressed, his eyes narrowing as he sought the truth. 'What were you doing during that time?' Hale's jaw tightened, and he replied, 'I was tending to the garden, ensuring everything was in order. I had no reason to be near the clock.' Her voice was firm, but Eleanor sensed a hint of defensiveness that only deepened her suspicions.

Beatrice chimed in, her tone slightly defensive. 'I was in the kitchen, preparing refreshments for our guests. I can assure you I was not near the clock.' The conflicting alibis presented by each suspect began to surface, complicating the investigation. Eleanor noted the shifting expressions of the suspects, each revealing their hidden fears. The air crackled with tension as they defended themselves, and Eleanor couldn't shake the feeling that one of them was lying. The storm may have passed, but the tempest of suspicion was just beginning to swirl around them, threatening to engulf them all.

As the discussion continued, Eleanor could feel the weight of the truth pressing down on her. Each alibi was scrutinized, and the discrepancies began to emerge. The clock's tampering suggested a deeper conspiracy, one that could unravel the very fabric of their lives. 'We must confront the possibility that one of us is not who they claim to be,' Eleanor stated, her voice steady despite the turmoil within. The others exchanged uneasy glances, and Eleanor could sense the tension rising as they grappled with the reality of their situation. The investigation would reveal not just the truth about the murder, but also the hidden motives that lay beneath their polished exteriors.
--- END PRIOR CHAPTER 3 ---

--- BEGIN PRIOR CHAPTER 4 ---
Title: Chapter 4: The Watch
The storm had passed, leaving a heavy silence in the Finch residence, study. Eleanor Voss stood by the desk, her fingers tracing the polished surface as she felt the weight of the truth pressing down on her. The air was thick with the scent of damp wood and leather, remnants of the earlier chaos. She could still hear the echoes of the accusations that had filled the air moments before, each word a reminder of the fragile trust that hung by a thread. The clock had been tampered with, and the implications of that act loomed large in her mind as she searched for answers.

Eleanor's heart raced as she rummaged through the drawers, her hands brushing against papers and personal effects belonging to the victim. The tension in the room was palpable, a quiet storm of its own as she sifted through the remnants of a life cut short. She recalled the clock's face, frozen at ten minutes past eleven, and the chilling realization that someone had manipulated time itself to mislead them all. The thought sent a shiver down her spine, and she felt a surge of determination to uncover the truth.

As she continued her search, Eleanor's fingers finally closed around a small, cold object nestled among the papers. She pulled it out and held it up to the light, her breath catching in her throat. It was the victim's pocket watch, its face gleaming despite the dust that had settled around it. The hands pointed resolutely to twenty minutes past eleven. Eleanor's heart raced as she absorbed the significance of this discovery. The watch contradicted the stopped clock, and the implications were staggering. How could the victim's watch show a different time than the clock that had been tampered with?

Just then, Dr. Finch entered the study, his expression carefully composed. 'What have you found?' he asked, her tone casual, but Eleanor could sense the tension beneath her words. She held up the watch, her voice steady yet filled with urgency. 'This watch shows twenty minutes past eleven, Dr. Finch. It contradicts the time on the clock. How do you explain that?' The accusation hung in the air, heavy with implications. He watched as his eyes flickered toward the watch, a momentary flash of something unidentifiable crossing his features.

'It's merely a coincidence,' Dr. Finch replied, his voice smooth but lacking conviction. 'Watches can be inaccurate, especially under stress.' Her attempt at nonchalance fell flat, and Eleanor could see the cracks forming in her facade. The watch's discrepancy raised new questions, and she felt the weight of suspicion shift toward her. This was no mere coincidence; the timing of the murder was becoming increasingly suspect, and Dr. Finch's alibi was beginning to unravel.

Eleanor stepped closer, her gaze unwavering. 'But if the clock was tampered with to mislead us, then why would the victim's watch show a different time? It suggests a deliberate intention to confuse the timeline.' He could feel the tension mounting between them, a silent battle of wills as Dr. Finch struggled to maintain his composure. The storm outside had passed, but the tempest of suspicion was just beginning to swirl around them, threatening to engulf them both.

Dr. Finch cleared his throat, a nervous gesture that did not escape Eleanor's notice. 'Perhaps the victim had a reason to adjust the watch himself,' he offered, but the words felt hollow. Eleanor could see the flicker of anxiety in her eyes, and it only fueled her determination. She knew that the truth was lurking just beneath the surface, waiting to be uncovered. She had to dig deeper, to peel back the layers of deception that surrounded them.

'We need to establish a clearer timeline,' Eleanor said, her voice firm. 'If we can determine when the clock was last accurate, we may be able to piece together the events leading up to the murder.' The urgency in his tone was palpable, and he could see Dr. Finch's expression shift as he processed his words. The stakes were rising, and they both knew it. The investigation was no longer just about uncovering the truth; it was about survival in a world where trust had become a luxury they could no longer afford.

As they stood there, the silence in the study felt heavy with unspoken words and hidden motives. Eleanor's mind raced with possibilities, each scenario more intricate than the last. The watch was not just a timepiece; it was a key to unlocking the mystery that lay before them. With each tick of her own heart, she felt the urgency of the moment. The truth was within reach, but she had to tread carefully, for the shadows of deception loomed large, and one misstep could lead to disaster.
--- END PRIOR CHAPTER 4 ---

[SCENE COMPLETENESS CONTRACTS — MANDATORY. Each contract below lists what you MUST enact in that chapter. Do not summarise or mention these labels in the prose — enact them organically.]
Chapter 5 (Act 2) completeness contract:
  PIVOT ELEMENT (MANDATORY — write this into the prose, shown not told): "The clock showing ten minutes past eleven and evidence of tampering."
  FACT ESTABLISHED (MANDATORY — reader must know this by chapter end): "Establishes that the clock has been tampered with, casting doubt on the time of death."

# Case Overview
Title: The Clockwork Conspiracy
Era: 1930s
Setting: Little Middleton
Crime: murder (mechanical tampering)
Culprit: Dr. Mallory Finch
False assumption: The time on the clock accurately reflects the time of death.
Cast: Eleanor Voss (she/her), Dr. Mallory Finch (he/him), Captain Ivor Hale (he/him), Beatrice Quill (she/her)

Setting Lock: Keep all scenes and descriptions consistent with the stated setting (Little Middleton). Do not introduce a different location type.

Outline scenes:
[
  {
    "sceneNumber": 5,
    "act": 2,
    "title": "The Clock",
    "setting": {
      "location": "the central hall of the Finch residence",
      "timeOfDay": "Mid-afternoon",
      "atmosphere": "Increasing urgency as Eleanor investigates further"
    },
    "characters": [
      "Eleanor Voss",
      "Beatrice Quill"
    ],
    "purpose": "Examine the clock and its tampering.",
    "cluesRevealed": [
      "clue_clock_time"
    ],
    "dramaticElements": {
      "conflict": "Eleanor's frustration mounts as she uncovers more.",
      "tension": "The possibility of tampering looms large.",
      "microMomentBeats": [
        "Beatrice fidgets, her eyes darting as Eleanor inspects the clock."
      ]
    },
    "summary": "Eleanor inspects the clock in the central hall, confirming it shows ten minutes past eleven. She realizes the clock has been tampered with, suggesting that the time of death may have been deliberately misrepresented.",
    "estimatedWordCount": 1800,
    "pivotElement": "The clock showing ten minutes past eleven and evidence of tampering.",
    "factEstablished": "Establishes that the clock has been tampered with, casting doubt on the time of death.",
    "permittedBehavioursByAct": [
      {
        "characterName": "Eleanor Voss",
        "behaviour": "normal social behaviour; no guilt signals permitted"
      },
      {
        "characterName": "Beatrice Quill",
        "behaviour": "normal social behaviour; no guilt signals permitted"
      }
    ],
    "redHerringPlacement": null,
    "emotionalRegister": "The discovery of Finch's alibi challenges previous assumptions, deepening the mystery.",
    "dominantCharacterNote": {
      "name": "Eleanor Voss",
      "voiceRegister": "Eleanor speaks with a refined cadence, her laughter charming and her words often laced with clever quips."
    },
    "humourGuidance": {
      "permission": "forbidden"
    },
    "eraTextureNote": "Limited mobility due to economic hardships affecting travel; Communication primarily through letters and telegrams, with few telephones; Isolation of the manor, making it difficult for help to arrive quickly; Weather conditions impacting outdoor activities and events; Dependence on traditional means of transportation, such as cars or horse-drawn carriages",
    "locationRegisterNote": ""
  }
]
```

## Message 3 (role=user)

```text
BEFORE SUBMITTING YOUR JSON — verify this checklist:
□ Each chapter reaches the hard floor of 500 words and aims for 1250 words or more.
□ If you mention locked evidence, you used the exact locked phrase verbatim.
□ Allowed seasonal words only: summer, summery, midsummer.
□ Forbidden seasonal words: spring, autumn, winter.
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
