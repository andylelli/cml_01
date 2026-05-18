# Actual Prompt Record

- Run ID: `mystery-1779041438220`
- Project ID: ``
- Timestamp: `2026-05-17T18:16:08.345Z`
- Agent: `Agent9-ProseGenerator-Ch5`
- Operation: `chat_request_full_prompt`
- Model: `GPT-4o-mini`
- Temperature: `0.42`
- Max Tokens: `4500`
- Attempt: `first`
- Prompt Hash: `e6700d5749d8dcbf`

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
- MORAL COMPLEXITY REQUIREMENT: The mechanism of this crime carries a moral gray area: "The murderer believed they were protecting a loved one from the victim's manipulative tendencies, complicating the morality of their actions." — the culprit reveal and denouement MUST acknowledge this ambiguity. Do not let the ending feel clean or simple. Give the reader at least one moment of uncomfortable sympathy or moral doubt.


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

## Era: 1938 August
In August 1938, living in England means navigating the complexities of a society still reeling from the Great Depression. The air is thick with uncertainty, with economic hardships looming large, particularly for the working class. The upper classes cling to their remaining privileges, hosting lavish gatherings while their servants manage the weight of their own struggles in silence. Long summer days stretch into muggy evenings, where the threat of rain mirrors the discontent brewing among the populace. Streets are filled with the sounds of petrol-powered cars, while whispers of war echo in hushed conversations. The looming presence of fascism in Europe creates an atmosphere of dread, as people ponder the implications of global unrest on their own lives.
Emotional register: A collective anxiety permeates the air, as individuals grapple with personal ambitions amidst a backdrop of societal upheaval.
Physical constraints: Limited access to reliable transportation due to economic downturn | Restricted communication methods with reliance on wired telephones | Frequent electrical outages affecting daily life | Challenges in accessing news due to the evolving media landscape
Current tensions (weave into background texture): Rising tensions in Europe due to Nazi Germany's aggressive policies | Lingering effects of the Great Depression impacting social dynamics | Increased class divides and resentment among the lower classes
Wartime context — With war looming, many men prepare for potential conscription, causing anxiety among families.: The community is divided, with some supporting military action while others advocate for peace. Absence effect: The absence of men called to service creates a palpable void, leading to heightened tension and uncertainty at home.

## Season Lock (mandatory — derived from 1938 August)
Season: summer. Allowed vocabulary: summer, summery, midsummer
Forbidden seasonal words — never use in narration, dialogue, or metaphor: spring, autumn, winter and their adjectival forms.
Every weather description, atmosphere, and time-of-year reference must be consistent with summer.

## Story Theme
In a world where class tensions and hidden secrets collide, the pursuit of justice reveals the cost of ambition and the fragility of social standing.

## Story Emotional Register
Dominant: A journey through tension and revelation, exploring the fragility of social status amidst a backdrop of murder.

Arc:
The emotional journey begins on a stormy evening at Little Middleton Manor, where the air is thick with tension and the unsettling news of a murder hangs over the gathering guests. Eleanor Voss, the respected hostess and amateur sleuth, feels the weight of expectations and the looming threat to her family's reputation as she embarks on a quest for justice. As the investigation unfolds, the initial clues reveal a tangled web of secrets that intensify the unease among the characters, each grappling with their own demons. The emotional cost of the investigation becomes apparent, with friendships tested and alliances shifting as suspicion grows. A mid-story pivot occurs when Eleanor uncovers a hidden connection between Dr.

Mallory Finch and the victim, altering her perception of the case and deepening her internal conflict. This revelation casts a new light on earlier interactions and raises the stakes for everyone involved. As pressure mounts and tensions reach a breaking point, the climax forces Eleanor to confront the dark truths that threaten to shatter her world. The resolution leaves characters grappling with the aftermath of their choices, as Eleanor learns that the pursuit of truth often comes at a profound emotional cost. Each character emerges changed, bearing the weight of their actions and the realization that maintaining appearances can mask deeper truths.

## Emotional register at this point in the story
The investigation takes a new direction as secrets are revealed.

## Character Portraits (appearance & era)

### Eleanor Voss
Eleanor Voss embodies the struggles of the upper class during the Great Depression, desperately trying to maintain her family's reputation amidst financial ruin. Her lavish gatherings are not just social events; they are lifelines to preserve her social standing. As a socialite, Eleanor navigates the expectations of her class while concealing her family's struggles. Her role as an amateur detective adds complexity, as she risks exposure of her own vulnerabilities while seeking justice for her friend. Her position reflects the tension between maintaining appearances and confronting harsh realities.
Era intersection: Eleanor's plight is a microcosm of the broader societal pressures, where appearances can dictate one's fate.

### Captain Ivor Hale
Captain Ivor Hale is the quintessential gentleman, grappling with the emotional turmoil following his breakup with the murder victim. His public persona as a charming naval officer contrasts sharply with his private grief and desire for retribution. Caught in the web of social expectations, his character illustrates the conflict between personal emotion and societal duty. His involvement in the investigation reveals the complexity of navigating love and loss in a time when honor and reputation dictate one's actions.
Era intersection: His heartache and desire for closure reflect the broader emotional struggles faced by men battling societal expectations.

## Character Voices

### Eleanor Voss (she/her/her)
Eleanor's voice carries an upper-class cadence, often laced with irony and charm, reflecting her social status.
[comfortable] Oh, darling, isn’t it just lovely to see everyone enjoying themselves? It’s what I live for, really.
[evasive] I suppose details can be rather dull if one thinks too hard about them, don’t you agree?
[stressed] This is all going terribly wrong, and I simply cannot let anyone find out!
Humour: Eleanor's polite savagery often cuts through the tension, revealing her sharp wit.

### Captain Ivor Hale (he/him/his)
Captain Hale's voice is confident and gallant, with a sardonic edge that belies his inner turmoil.
[comfortable] Ah, the thrill of adventure is invigorating, isn’t it? Nothing quite like a good tale to win hearts!
[evasive] Love is a tricky beast, my dear; it can lead one into the most treacherous waters.
[stressed] I’ll not allow her betrayal to haunt me further; I must find closure!
Humour: His sardonic humor often lightens the mood, even in dire circumstances.

## Location Registers (scene framing guides)

The West Wing Library: The West Wing Library feels like a silent witness to the tragedy, its dust-laden tomes and flickering candlelight creating an atmosphere heavy with secrets and tension. Shadows dance across the room, heightening the sense of foreboding that pervades this space where the crime unfolded. The musty air carries the weight of history, mingling with the chilling reality of the recent murder, leaving visitors with a sense of unease.. Camera angle: Approaching this room feels like stepping into a forgotten chapter of a story, where every creak of the floorboard echoes the weight of what has transpired.. Era: The dim lighting and oppressive silence reflect the era's constraints on open dialogue about societal issues.

The Drawing Room: In the Drawing Room, the atmosphere is thick with the tension of unspoken words and hidden agendas. The lavish decor feels both inviting and suffocating, a façade that masks the underlying discord among the guests. As laughter and conversation echo, the room pulsates with anticipation, each glance exchanged carrying the weight of secrets that threaten to unravel at any moment.. Camera angle: Entering this space feels like stepping into a high-stakes game, where appearances must be maintained even as danger looms.. Era: The opulence of the room reflects the class divide, where the upper classes gather while their servants toil away unseen.

The Servants' Hall: The Servants' Hall is a modest yet warm space, filled with the aroma of cooking and the sound of soft laughter. Here, the staff gather to share their lives, contrasting sharply with the opulence above. Despite the warmth, an undercurrent of tension runs through the room, as the realities of class disparity loom over their camaraderie, creating an uneasy balance between comfort and anxiety.. Camera angle: Stepping into the Servants' Hall evokes a sense of intimacy, where the struggles and joys of those who serve are laid bare.. Era: The simplicity of the hall starkly contrasts with the grandeur of the manor, highlighting the social divide of the era.

## Humour guidance for this story position (first_turn)
Permission: forbidden
Rationale: The heightened tension requires a serious atmosphere.

## Character Pressure
Dr. Mallory Finch is approaching a point of breakdown. Stress and strain should be accumulating visibly — through behaviour, not statement. No confrontation yet.

## Reveal Groundwork (texture — do not explain, only plant)
- Plant one subtle observable beat related to: "Mallory Finch's hidden motives reframes earlier interactions, particularly her anxious demeanor during the investigation". Do not explain significance yet.
- Plant one subtle observable beat related to: "Furthermore, Eleanor's initial trust in Finch is shattered, altering her perception of friendship". Do not explain significance yet.
- Plant one subtle observable beat related to: "Lastly, Captain Hale's conflicted emotions gain new depth as the truth about Finch's involvement comes to light, complicating his feelings of betrayal". Do not explain significance yet.

FAIR-PLAY AND INFERENCE CONTRACT (from CML logic):
- False assumption in force: The murder occurred at the time indicated by the clock.
- Hidden truth to progressively expose: The true time of death is forty minutes earlier than indicated.
- Inference path checkpoints to dramatize clearly (observation -> correction -> effect):
  - Step 1: obs: The clock in the drawing room shows it stopped at nine o'clock. | corr: This indicates that the time of death may be misrepresented. | effect: Narrows investigation to the clock's tampering.
  - Step 2: obs: A faint scratch is visible on the clock face. | corr: The scratch suggests that the clock has been tampered with. | effect: Eliminates the possibility that the clock was functioning normally.
  - Step 3: obs: Dr. Mallory Finch's alibi places her at the manor during the time of death. | corr: This creates an opportunity for her to tamper with the clock. | effect: Narrows suspect pool to Dr. Mallory Finch.
- Discriminating test method: trap
- Discriminating test design constraint: A controlled comparison of the clock's mechanism and the time of death established by witness accounts proves Dr. Mallory Finch's tampering.
- Test must rely on already-shown clue IDs: clue_1, clue_2, clue_3, clue_fp_contradiction_step_3, clue_culprit_direct_dr_mallory_finch
- Fair-play rationale: Step 1: The stopped clock indicates misrepresentation of time. Step 2: The scratch confirms tampering. Step 3: Dr. Mallory Finch's alibi places her at the scene, leading to the conclusion of her guilt.
- Never solve by withheld information. Keep reader-information parity with detective reasoning.

## Character Reference

### Eleanor Voss (she/her — NEVER he/him)
Eleanor's speech is laced with an upper-class cadence, punctuated by charming anecdotes and a subtle edge that hints at her true feelings
She often employs irony and wit, particularly when addressing the absurdities of social expectations.
Eleanor is torn between her desire to uphold her family's reputation and the moral implications of her investigation. She struggles with the fear that exposing the truth may lead to further ruin, yet she knows that living a lie is no longer tenable.

### Captain Ivor Hale (he/him — NEVER she/her)
Captain Hale speaks with a confident cadence, often punctuating his stories with dramatic flair and sardonic wit
His charm is palpable, yet there is a subtle edge to his humor that suggests deeper emotional currents at play.
Captain Hale is torn between his desire for revenge and his yearning for closure. He grapples with the pain of his recent breakup, questioning whether his feelings are rooted in love or a desire to reclaim his dignity.


## CHARACTER CONTRACTS (binding for this scene)
Each entry below constrains how this character must be written in this chapter.
These override generic style guidance when they conflict.

### Eleanor Voss[SHE]
Voice & mannerisms: Eleanor's speech is laced with an upper-class cadence, punctuated by charming anecdotes and a subtle edge that hints at her true feelings. She often employs irony and wit, particularly when addressing the absurdities of social expectations.
Sample voice fragments (match this register and rhythm):
  [comfortable] "Oh, darling, isn’t it just lovely to see everyone enjoying themselves? It’s what I live for, really."
  [evasive] "I suppose details can be rather dull if one thinks too hard about them, don’t you agree?"
Humour: polite savagery — deploy occasionally (level 0.6)
FORBIDDEN phrase (never write for Eleanor Voss): "she felt a wave of unease"
Act 2 behaviour contract: May show unease, evasion, or mild defensiveness when questioned. One behavioural tell is permitted. Internal conflict emerging: "Eleanor is torn between her desire to uphold her family's reputation and the moral implications of her investigation. She struggles with the fear that exposing the truth may lead to further ruin, yet she knows that living a lie is no longer tenable."

### Captain Ivor Hale[HE]
Voice & mannerisms: Captain Hale speaks with a confident cadence, often punctuating his stories with dramatic flair and sardonic wit. His charm is palpable, yet there is a subtle edge to his humor that suggests deeper emotional currents at play.
Sample voice fragments (match this register and rhythm):
  [comfortable] "Ah, the thrill of adventure is invigorating, isn’t it? Nothing quite like a good tale to win hearts!"
  [evasive] "Love is a tricky beast, my dear; it can lead one into the most treacherous waters."
Humour: sardonic — deploy occasionally (level 0.4)
FORBIDDEN phrase (never write for Captain Ivor Hale): "palpable tension filled the room"
Act 2 behaviour contract: May show unease, evasion, or mild defensiveness when questioned. One behavioural tell is permitted. Internal conflict emerging: "Captain Hale is torn between his desire for revenge and his yearning for closure. He grapples with the pain of his recent breakup, questioning whether his feelings are rooted in love or a desire to reclaim his dignity."



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
A sprawling manor house steeped in history, now the center of unsettling events as class tensions simmer beneath the surface.

Key Locations Available:
- The West Wing Library (interior): Crime scene
- The Drawing Room (interior): Gathering space
- The Servants' Hall (interior): Staff gathering space

Atmosphere (tonal cue only — do NOT reproduce this phrase verbatim in prose; translate into scene-specific, character-observed sensory language): Tense due to underlying class tensions and recent unsettling events at the estate
Weather: Overcast with occasional rain, typical for a late autumn day

Era markers: Petrol-powered cars on gravel driveways | Wired telephones in select rooms | Electric lighting with frequent outages | Typewriters for correspondence | Frequent train services to nearby towns

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
The West Wing Library (interior):
  - Visual: Dust motes swirling in the dim light, Faded leather-bound volumes on shelves, A flickering candle casting shadows
  - Sounds: The whisper of turning pages, A distant clock ticking, The creak of old floorboards
  - Scents: Musty old books, Beeswax from the candle, Damp leather
  - Touch: Worn leather chair, Cold brass doorknob

The Drawing Room (interior):
  - Visual: Richly colored tapestries hanging on the walls, A grand piano gleaming in the corner, Gilded mirrors reflecting flickering gaslight
  - Sounds: The soft notes of piano music, Laughter and conversation echoing, The crackle of the fireplace
  - Scents: The scent of polished wood, A hint of floral perfume, The warm aroma of burning logs
  - Touch: Soft velvet upholstery, Cool brass of the piano keys

The Servants' Hall (interior):
  - Visual: Simple wooden tables and chairs, A flickering fire in the hearth, Old photographs on the walls
  - Sounds: The crackle of the fire, Low murmurs of conversation, The clinking of dishes
  - Scents: The aroma of cooking food, A hint of smoke from the fire, The scent of fresh bread
  - Touch: Rough wood of the table, The warmth of the fire

⛔ REFERENCE DATA — DO NOT TRANSCRIBE VERBATIM: The above profiles are structural guides only. Generate original prose that evokes these qualities; do not reproduce the exact phrasing or sentence structure of the profile paragraphs.

SCENE OPENING RULE: When opening a scene in a new location, write what the POV character directly observes and physically senses at that moment — not a general description of the room's qualities. The reader must feel present, not briefed. Sensory details must be observed by the character, not stated as fact about the place.

SENSORY WRITING TECHNIQUES:
- Opening paragraphs: Lead with 2-3 sensory details to ground the scene
- Movement between locations: Note sensory changes (quiet study → noisy dining room)
- Emotional scenes: Use sensory details to reinforce mood (cold rain during argument)
- Period authenticity: Use perio
[truncated for prompt budget]

## Texture Pool
Draw on these as opportunities arise — you are not required to use them.

- In August 1938, living in England means navigating the complexities of a society still reeling from the Great Depression
- The air is thick with uncertainty, with economic hardships looming large, particularly for the working class
- The upper classes cling to their remaining privileges, hosting lavish gatherings while their servants manage the weight of their own struggles in silence
- Long summer days stretch into muggy evenings, where the threat of rain mirrors the discontent brewing among the populace
- Streets are filled with the sounds of petrol-powered cars, while whispers of war echo in hushed conversations

TEMPORAL CONTEXT:

This story takes place in August 1938 during summer.

Seasonal Atmosphere:
- Weather patterns: warm but overcast, occasional rain showers, muggy afternoons
- Daylight: Long summer days with sunset around 8:30 PM, giving way to twilight lingering until nearly nine o'clock.
- Seasonal activities: garden parties and picnics, outdoor theater performances, cricket matches in the local park
- Seasonal occasions: Notting Hill Carnival (in London) celebrated on the last weekend of August
- Season: summer

Period Fashion (describe naturally):
- Men formal: tweed jacket, waistcoat, tailored trousers
- Men casual: linen shirts, cotton trousers, lightweight blazers
- Men accessories: panama hats, leather shoes, silk ties
- Women formal: tea-length dresses, tailored suits, elegant hats
- Women casual: simple blouses, A-line skirts, summer cardigans
- Women accessories: clutch bags, pearl necklaces, stylish gloves

Cultural Context (reference naturally):
- Music/entertainment: Glenn Miller's 'In the Mood', Benny Goodman's 'Sing, Sing, Sing', Duke Ellington's 'Take the 'A' Train'; Films: 'The Adventures of Robin Hood', 'The Lady Vanishes'; Theatre: 'The Lady's Not for Burning', 'The Fourposter'; Radio: The Shadow, Lux Radio Theater
- Typical prices: Loaf of bread: four pence, Cinema ticket: one shilling, Pint of beer: eight pence
- Current events: rising tensions in Europe with Nazi Germany's aggressive expansionist policies; the Munich Agreement looming on the horizon
- Literature: 'The Long Goodbye' by Raymond Chandler | 'The Maltese Falcon' by Dashiell Hammett | 'The Old Man and the Sea' by Ernest Hemingway | [detective fiction] | [social realism] | [adventure novels]
- Technology: the first commercial television broadcasts | automated telephone exchanges | the development of radar technology | wireless radios | typewriters | petrol-powered cars
- Daily life: attending local fairs and markets, going to the cinema for new releases, socializing at pubs or tea rooms
- Social rituals: afternoon tea gatherings, summer garden parties, Sunday family dinners

Atmospheric Details:
The air is thick with the scent of damp earth and blooming summer flowers, mixed with the distant sound of rain on the manor's slate roof. A soft hum of conversation and laughter drifts from the drawing room, contrasting with the occasional crack of thunder that echoes through the estate. The flickering electric lights cast long shadows, creating a sense of unease that hangs palpably in the air, hinting at the tensions beneath the surface.

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
- Authentic references: Use actual songs,
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

• [clue_2] The scratch suggests that the clock has been tampered with.
  Category: temporal | Criticality: essential | Supports inference step 2
  Points to: This raises questions about the reliability of the clock's time.

• [clue_culprit_direct_dr_mallory_finch] Direct evidence ties Dr. Mallory Finch to the mechanism access point before the discriminating test.
  Category: temporal | Criticality: essential | Supports inference step 3
  Points to: This direct evidence shows Dr. Mallory Finch had means and opportunity, narrowing the solution uniquely toward the culprit.

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

CLUES ALREADY REVEALED TO READER: clue_mechanism_visibility_core, clue_core_contradiction_chain, clue_3, clue_1 — do not reveal these as new information.

INVESTIGATION LOG — WHAT IS ESTABLISHED (do not re-establish, do not repeat):
• Evidence in reader's hands: The clock in the drawing room shows it stopped at nine o'clock. | This indicates that the time of death may be misrepresented. | Dr. Mallory Finch's alibi places her at the manor during the time of death. | A faint scratch is visible on the clock face.
• Suspects still unresolved: Eleanor Voss[SHE], Captain Ivor Hale[HE], Beatrice Quill[SHE]
⚠ The story must move FORWARD from this log. Any beat already listed above is forbidden from repeating.

⚠ THIS CHAPTER'S REQUIRED ADVANCE (first_turn): Examine physical evidence — find at least one new clue

CONTINUITY HANDOFF — previous chapter closing beat:
  • "As the rain continued its relentless patter against the windows, Eleanor felt a sense of urgency rising within her. The clock loomed ominously in the background, its hands frozen at ten minutes past eleven, a reminder of the time they had lost. She could not l..."
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
drawing room, manor, kitchen

✓ RULE: Continue using this location vocabulary. Maintain consistency with established setting type.
✓ Do NOT introduce new location types that contradict earlier chapters.

**Recent Chapter Summary (for narrative continuity):**
Chapter 2: Chapter 2: Contradicting Alibis
  Events: "We must speak about what happened last night," Eleanor said, her voice steady despite the tremors of anxiety that coursed through her.
Chapter 3: Chapter 3: Commitment to Investigate
  Events: The clock on the mantelpiece read ten minutes past eleven, its hands frozen in time, a stark reminder of the tragedy that had unfolded.
Chapter 4: Chapter 4: Interviewing Dr. Finch
  Events: The rain tapped insistently against the windows, a relentless reminder of the turmoil outside.

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
Known location profile anchors: Little Middleton Manor, The West Wing Library, The Drawing Room, The Servants' Hall, the drawing room, still tense
LOCATION NAME CAPITALISATION (HARD REQUIREMENT — validated):
All named locations in your prose MUST use the EXACT capitalisation from the CML profiles.
Canonical forms: "Little Middleton Manor", "The West Wing Library", "The Drawing Room", "The Servants' Hall", "the drawing room, still tense"
Writing a location in lowercase (e.g. "drawing room" instead of "Drawing Room") is a validated error. Every time you mention a named location, copy its capitalisation from the list above.
- Chapter 5: OPENING STYLE (HARD): Start the VERY FIRST SENTENCE with a temporal subordinate clause — e.g. "When [Name] entered…" / "After the last guest…" / "Before the household had stirred…" / "As the light faded…". Anchor opening in "the drawing room, still tense". HARD REQUIREMENT for the first 2 paragraphs: (a) include 2+ sensory words — choose from smell/scent/sound/echo/silence/creak/whisper/cold/warm/damp/rough/smooth/glow/shadow/flicker/dim — and (b) include 1+ atmosphere/time word — choose from rain/wind/fog/storm/mist/thunder/evening/morning/night/dawn/dusk/season/afternoon/midday/noon/midnight/twilight/sunrise/sunset/daylight/sunlight/overcast/cloudy/bright/dark. These are validated requirements, not style suggestions; missing them triggers a retry.

[⚠ INTERNAL QUALITY DIAGNOSTICS — DO NOT REPRODUCE ANY PART OF THIS SECTION IN YOUR STORY OUTPUT. These are private generator observations for your consideration only. Your narrative must read as if this section does not exist. Never include phrases from this block in character dialogue, narration, or description.]

PRIOR CHAPTER QUALITY OBSERVATIONS:
- Chapter 3 (score 89/100):
  Quality gaps noted: word density below preferred target (758/1000); scene grounding weakness
  Address in upcoming chapters: Increase chapter density with concrete investigation action and sensory-grounded beats; avoid recap-only padding. | Open next chapter with a named location anchor plus at least two sensory cues and one atmosphere marker.
- Chapter 4 (score 90/100):
  Quality gaps noted: word density below preferred target (805/1000); scene grounding weakness
  Address in upcoming chapters: Increase chapter density with concrete investigation action and sensory-grounded beats; avoid recap-only padding. | Open next chapter with a named location anchor plus at least two sensory cues and one atmosphere marker.
- Phrases to avoid (already overused in earlier chapters): "dr finch s eyes darted to the", "finch s eyes darted to the clock", "eleanor felt a pang of sympathy for", "felt a pang of sympathy for her", "the clock loomed ominously in the background", "coiling tightly around them as they prepared", "tightly around them as they prepared to", "around them as they prepared to confront", "as they prepared to confront the truth".
[END INTERNAL DIAGNOSTICS]

PROMPT BUDGET SUMMARY: budget=32000 tokens; fixed=9818; context=10558; dropped=[none]; truncated=[pronoun_accuracy, location_profiles, temporal_context]

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
8. Integrate at least two concrete era-grounded details per chapter from setting refinement signals: petrol-powered cars on gravel driveways | wired telephones in select rooms | electric lighting with frequent outages | typewriters for correspondence | party-line telephone exchanges | telegrams sent from town offices.
9. Respect setting movement/access constraints in scene action and alibis: large gardens limit unseen movement | multiple locked rooms restrict access | staircases create sound barriers | weather can hinder outdoor mobility | restricted access to the upper floors.
10. Sustain social coherence with this backdrop pressure: The looming inheritance dispute amidst the backdrop of the Great Depression forces the manor's elite and their servants to confront their precarious social standings while a recent tragedy stirs underlying tensions.
11. Maintain continuity around these socially central cast anchors where relevant: Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill.
12. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Critical: Plot similarity 0.75 with 'The Mysterious Affair at Styles' (same temporal axis and murder method)
13. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Moderate: Character similarity 0.70 with 'The Mysterious Affair at Styles' (mirrored roles of doctor and captain)
14. RETRY MITIGATION: Strict obligation mode is active. Every required clue must be surfaced with concrete, observable prose before any deduction beat.
15. RETRY MITIGATION: Prioritize chronology and identity coherence over stylistic variation for this retry.
16. STORY TO DATE ANTI-COPY RULE: The STORY TO DATE section below is provided for chronological and factual reference ONLY. You MUST NOT copy, lightly rephrase, or structurally echo any sentence or paragraph from prior chapters. Every sentence in this chapter must be original prose unique to this scene. Reusing even a clause from prior chapter text will cause this attempt to fail immediately.

CRITICAL PROSE REQUIREMENTS:

The CML specifies exact requirements for certain validation-critical scenes. You MUST include these elements at the specified positions.

**Discriminating Test Scene (Act 3, Scene 4):**
Required elements: Execute the controlled comparison of the clock's mechanism, Reveal the evidence of tampering, Conclude Dr. Mallory Finch's guilt
Test type: mechanical comparison

**Suspect Clearance Scenes:**
- Captain Ivor Hale (Act 3, Scene 5): Established military alibi during the time of death
  Clues: clue_id_1, clue_id_2
- Beatrice Quill (Act 3, Scene 5): Witness statements confirm her location was elsewhere
  Clues: clue_id_1, clue_id_2

**Culprit Revelation Scene (Act 3, Scene 6):**
Method: Confrontation with evidence of clock tampering

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
  - Scene is set in: the drawing room, still tense — reference it naturally within the paragraph, never as your opening phrase.
  - Opening atmosphere (MANDATORY — validator enforced): the first paragraph MUST contain at least one of: rain / wind / fog / storm / mist / thunder / evening / morning / night / dawn / dusk / season / afternoon / midday / noon / midnight / twilight / sunrise / sunset / daylight / sunlight / overcast / cloudy / bright / dark / grey / pale / cold / warm / chill / crisp / damp / drizzle / haze / lamplight / firelight. A chapter that omits all of these from its opening paragraph will be rejected.
  - Continuity bridge: in the first 120 words, visibly connect from the previous chapter's final beat. Carry forward one unresolved element (object, accusation, emotional pressure, or immediate physical action) from: "As the rain continued its relentless patter against the windows, Eleanor felt a sense of urgency rising within her. The clock loomed ominously in the background, its hands frozen at ten minutes past eleven, a reminder of...".
  - CLUE OBLIGATIONS — mandatory prose elements (do NOT omit or bury):
    • The scratch suggests that the clock has been tampered with. [clue_2]
      Points to: This raises questions about the reliability of the clock's time.
    • Direct evidence ties Dr. Mallory Finch to the mechanism access point before the discriminating test. [clue_culprit_direct_dr_mallory_finch]
      Points to: This direct evidence shows Dr. Mallory Finch had means and opportunity, narrowing the solution uniquely toward the culprit.
  - Tonal contrast: include at least one beat of relief or ironic counterpoint. Do not sustain maximum tension for every paragraph.
  - Sensory obligation — use at least two of: Flat light dulling the colors, Shadows creeping along the walls | The distant sound of rain, Muffled voices from the hallway | The scent of old paper. Mood: uneasy stillness.

- Tonal contrast required: the previous chapter was high-tension. This chapter must include at least one beat of relief, pause, or quiet observation.
- Locked fact phrase obligations:
  - If this batch mentions The exact time shown on the stopped clock face, write exactly: "ten minutes past eleven".
  - If this batch mentions The exact amount the clock was wound back, write exactly: "forty minutes".
- Seasonal vocabulary allow-list: summer, summery, midsummer.
- Forbidden seasonal words: spring, autumn, winter.

FROZEN FACT STATE (DO NOT ALTER):
- Timeline anchor: August (summer).
- Month, season, weather, and time-of-year language in this batch must stay compatible with summer.
- Established timeline fact: clock stopped at nine o'clock
- Established timeline fact: Eleanor last seen at eight forty
- If referenced, use exact phrase: "ten minutes past eleven" (The exact time shown on the stopped clock face).
- If referenced, use exact phrase: "forty minutes" (The exact amount the clock was wound back).

STORY TO DATE (REFERENCE ONLY — DO NOT COPY VERBATIM):
- Full prior chapter text is provided below for continuity, factual consistency, and reference accuracy.
- Use this to keep character voice, chronology, clue state, and location continuity aligned with earlier chapters.
- Do not quote, copy, or paraphrase these paragraphs too closely; write fresh prose that remains consistent with them.

--- BEGIN PRIOR CHAPTER 1 ---
Title: Chapter 1: Discovery
Eleanor Voss stepped cautiously into the drawing room of the Finch manor, her heart racing with a mixture of dread and curiosity. The summer morning was overcast, with rain streaking down the windows, casting a grey pallor over the room. The air was thick with an oppressive silence, broken only by the distant rumble of thunder. The cold of the room seemed to seep into her bones as she approached the clock on the mantelpiece, its hands frozen at ten minutes past eleven. A shiver ran down her spine as she took in the stillness of the room, the heavy drapes drawn tight against the light, creating an atmosphere that felt both claustrophobic and foreboding.

As she approached the clock, Eleanor's breath caught in her throat. The clock in the drawing room shows it stopped at nine o'clock. The implication was immediate and chilling. She could not shake the feeling that the time of death might be misrepresented, a fact that would surely complicate any investigation. What had transpired in this room, and at what time? The thought nagged at her, a dark cloud hovering over her mind as she struggled to make sense of the scene before her.

The tension in the air was palpable as the door creaked open, and the doctor Finch entered, her expression a mask of shock and dismay. Eleanor turned to her, desperate for answers. "Mallory, have you seen—?" But the words died on her lips as she caught sight of the doctor’s pale face. Dr. Finch's eyes darted to the clock, and Eleanor could see the realization dawning upon her. The two women exchanged a glance, a silent understanding passing between them. They were both aware that the stopped clock bore witness to something sinister.

the captain Hale followed closely behind Dr. Finch, her demeanor a mix of confusion and concern. "What on earth is happening here?" he demanded, his voice steady despite the tremor in his hands. Eleanor opened her mouth to respond, but the words eluded her. Instead, she gestured toward the center of the room, where the body lay shrouded in a heavy velvet curtain. The sight was enough to send a wave of nausea crashing over her. "It’s Beatrice," she finally managed to whisper, her voice barely audible above the sound of the rain. "She’s dead."

The captain stepped forward, his expression shifting from confusion to horror as he took in the scene. "No... not Beatrice. This cannot be. She was just here, laughing and telling stories. How could this happen?" His voice cracked, the weight of the moment pressing down on him. Eleanor felt a pang of sympathy for her, but it was quickly overshadowed by the grim reality of their situation. They were trapped in a nightmare, and the clock’s frozen hands seemed to mock their helplessness.

Dr. Finch knelt beside the body, her professional instincts kicking in despite the shock. "We need to call someone, an officer or a constable. This is serious, and we cannot handle this alone," she said, her voice steadier than Eleanor felt. The doctor’s hands trembled slightly as she reached out to check for a pulse, but it was clear that Beatrice was beyond help. Eleanor watched, her heart heavy with grief, as Dr. Finch’s expression shifted from concern to determination. There was something about the way she moved, a quiet confidence that belied the chaos surrounding them.

Eleanor glanced back at the clock, its hands still stubbornly frozen at ten minutes past eleven. The implications of that moment weighed heavily on her mind. If Beatrice had died at that time, it would contradict everything they knew about the evening’s events. The last time Eleanor had seen her was at eight forty, mere minutes before the clock had stopped. What had happened in that short span? The thought sent a chill through her, and she shivered despite the warmth of the room.

As the rain continued to tap against the windows, Eleanor felt a sense of urgency rising within her. They needed to uncover the truth, not only for Beatrice but for themselves. The atmosphere was thick with suspicion, and each of them was a potential suspect in this unfolding tragedy. Eleanor took a deep breath, steeling herself for what lay ahead. They had to find answers, and fast. The clock loomed ominously in the background, a silent witness to the secrets that would soon unravel.
--- END PRIOR CHAPTER 1 ---

--- BEGIN PRIOR CHAPTER 2 ---
Title: Chapter 2: Contradicting Alibis
"We must speak about what happened last night," Eleanor said, her voice steady despite the tremors of anxiety that coursed through her. The drawing room, still tense with shock, felt stifling as the rain drummed insistently against the windows, a relentless reminder of the turmoil outside. Shadows flickered across the walls, cast by the dim light of the gas lamps, heightening the sense of unease that hung in the air. She glanced at the doctor Finch and the captain Hale, who stood across from her, their expressions a mix of confusion and dread. Beatrice Quill sat nearby, her hands trembling slightly as she clutched her skirt, the fabric wrinkling under her grip.

Eleanor took a deep breath, forcing herself to focus on the task at hand. "The clock in the drawing room shows it stopped at nine o'clock," she stated, her gaze shifting to the mantelpiece where the clock stood, its hands unmoving. The implications of that moment weighed heavily on her mind. If the clock was indeed accurate, it suggested that the time of death may be misrepresented, creating a web of uncertainty that could ensnare them all. She could feel the tension in the room, a palpable energy as each of them grappled with the reality of their situation.

Dr. Finch's eyes darted to the clock, her brow furrowing in thought. "If Beatrice died at nine o'clock, then it contradicts my alibi. I was in the kitchen preparing for dinner, but I cannot recall the exact time I left the room," she admitted, her voice laced with concern. Eleanor noted the way the doctor’s hands trembled as she spoke, revealing the cracks in her composure. The weight of their shared predicament pressed down on them, and Eleanor could see the flicker of doubt cross Captain Hale's face.

Captain Hale cleared her throat, attempting to regain control of the conversation. "I distinctly remember the clock chiming during dinner, which would suggest it was still running at that time. How could it have stopped?" Her voice was steady, but Eleanor sensed an undercurrent of anxiety beneath her words. The captain's insistence on the clock's reliability only served to deepen the mystery surrounding Beatrice's death. Eleanor felt a flicker of irritation at the captain's confidence; it seemed misplaced in the face of such tragedy.

Beatrice finally spoke, her voice barely above a whisper. "I was with her just before... before it happened. We were discussing my latest manuscript, and she seemed so full of life. I can't believe she's gone." Tears welled in her eyes, and Eleanor felt a pang of sympathy for her friend. Yet, the urgency of the situation pressed on her. Beatrice's emotional turmoil was evident, and Eleanor knew that they needed to remain focused on the task at hand. They had to uncover the truth, not only for Beatrice but for themselves.

Eleanor turned her attention back to the clock, now a silent witness to the chaos that had unfolded. If the time of death was indeed misrepresented, it would mean that each of them had a motive, a reason to want Beatrice out of the picture. The thought sent a chill down her spine. "We need to establish where each of us was at the time of Beatrice's death. We cannot afford any discrepancies in our stories," she said, her voice firm. The atmosphere in the drawing room shifted, tension coiling tightly around them as they prepared to confront the truth.

As they began to recount their whereabouts, Eleanor felt a growing sense of urgency. The rain continued its relentless patter against the windows, a reminder of the world outside, while inside, the storm of suspicion brewed. Each alibi began to unravel, revealing cracks in their carefully constructed facades. Eleanor knew that the truth lay buried beneath layers of deception, and she was determined to unearth it, no matter the cost.
--- END PRIOR CHAPTER 2 ---

--- BEGIN PRIOR CHAPTER 3 ---
Title: Chapter 3: Commitment to Investigate
The clock on the mantelpiece read ten minutes past eleven, its hands frozen in time, a stark reminder of the tragedy that had unfolded. Eleanor Voss stood resolute in the drawing room, the relentless rain drumming against the window panes creating a rhythmic backdrop to her racing thoughts. The flickering candlelight cast shadows that danced across the walls, and the scent of damp wood filled the air, mingling with the floral perfume that still lingered from the earlier gathering. The atmosphere felt charged, as if the very walls were holding their breath in anticipation.

Eleanor turned to face the doctor Finch, the captain Hale, and Beatrice Quill, who were huddled together, their expressions a mix of confusion and fear. "We need to discuss what happened last night," she declared, her voice firm despite the unease that gripped her. The weight of their shared predicament pressed down on them, and she could sense the hesitation in their responses. The silence that followed was thick, punctuated only by the sound of the rain outside, as if the world beyond was waiting for their next move.

"Eleanor, you must understand that this is a delicate situation," Dr. Finch interjected, her brow furrowing with concern. "We should contact the authorities. They are trained for this sort of thing." Her voice trembled slightly, revealing the cracks in her composure. Eleanor noted the doctor's nervous gestures, the way her fingers fidgeted with the edges of her blouse, betraying her anxiety.

Captain Hale cleared his throat, his demeanor shifting as he attempted to take charge of the conversation. "I agree with Mallory. We cannot afford to act rashly. The police will provide the necessary resources to handle this properly," he said, his tone authoritative yet tinged with doubt. Eleanor felt a flicker of irritation at their lack of faith in her ability to navigate this crisis. She had to prove that she could uncover the truth without external interference.

Beatrice Quill, seated nearby, gripped her skirt tightly, her knuckles white with tension. "But what if they suspect one of us?" she whispered, her voice barely above a tremor. "I can’t bear the thought of being implicated in this tragedy. We need to protect ourselves!" Tears brimmed in her eyes, and Eleanor felt a pang of sympathy for her friend. Yet, the urgency of the situation pressed on her, demanding their focus and resolve.

"We must clarify our whereabouts at the time of Beatrice's death," Eleanor insisted, her voice rising slightly. "Discrepancies could lead to dire consequences for all of us. If we involve the police, they will scrutinize our lives, and who knows what they might discover?" The tension in the drawing room escalated, coiling tightly around them as they prepared to confront the truth of the matter.

Dr. Finch cast a wary glance at the clock, its stillness a haunting reminder of the time they had lost. "I was in the kitchen preparing for dinner, but I cannot recall the exact moment I left the room," she admitted, her voice shaky. Eleanor observed the doctor’s unease, the way her hands betrayed her with their restless movements. Meanwhile, Captain Hale's expression shifted as he attempted to piece together the fragmented timeline.

"I distinctly remember the clock chiming during dinner, which would suggest it was still running at that time. How could it have stopped?" Captain Hale's voice remained steady, but Eleanor sensed the tension beneath his words. The captain's insistence on the clock's reliability only deepened the mystery surrounding Beatrice's death, and Eleanor felt a surge of frustration at his apparent confidence in the face of such tragedy.

Beatrice finally found her voice, trembling as she spoke. "I was with her just before... before it happened. We were discussing my latest manuscript, and she seemed so full of life. I can't believe she's gone." The tears flowed freely now, and Eleanor felt a pang of sympathy for her friend. Yet, the urgency of the situation pressed on her. Beatrice's emotional turmoil was evident, and Eleanor knew they needed to remain focused on the investigation ahead.

Eleanor took a deep breath, her resolve solidifying. "We cannot let fear dictate our actions. We must investigate this ourselves before the police arrive. I will not allow Beatrice's death to be swept under the rug. We owe it to her to find the truth." The determination in her voice surprised even herself, but she understood that this was the only way forward. The clock loomed ominously in the background, a silent witness to the secrets that would soon unravel.
--- END PRIOR CHAPTER 3 ---

--- BEGIN PRIOR CHAPTER 4 ---
Title: Chapter 4: Interviewing Dr. Finch
The rain tapped insistently against the windows, a relentless reminder of the turmoil outside. In the drawing room, now a makeshift investigation space, Eleanor Voss stood resolute, her heart pounding as she prepared to confront the doctor Finch about her alibi. The dim light filtering through the clouds cast a gloomy pall over the room, amplifying the tension that had settled like a thick fog. Eleanor could feel the weight of the moment pressing down on her, the urgency to uncover the truth about Beatrice's death gnawing at her insides. She took a deep breath, her resolve solidifying as she turned to face Dr. Finch, who stood near the mantelpiece, her expression a mix of anxiety and defiance.

Eleanor's voice broke the silence, steady but laced with an underlying tension. "Mallory, we need to talk about your whereabouts last night. It’s crucial that we clarify your alibi during the time of Beatrice's death." The words hung in the air, heavy with implication. Dr. Finch's eyes darted to the clock, its hands frozen at ten minutes past eleven, a stark reminder of the tragedy that had unfolded. Eleanor noted the way Dr. Finch's fingers twitched nervously as she began to recount her evening, a subtle tell that only heightened Eleanor's suspicions.

"I was in the kitchen preparing dinner," Dr. Finch began, her voice wavering slightly. "I remember checking the time, but I cannot recall the exact moment I left the room." The doctor’s admission hung in the air, a crack in her otherwise composed demeanor. Eleanor could see the tension in Dr. Finch's shoulders, the way she shifted her weight from one foot to the other, betraying her unease. It was a small detail, yet it spoke volumes about her state of mind.

Eleanor pressed on, determined to uncover the truth. "But you were at the manor during the time of death, weren't you?" She watched as Dr. Finch's gaze fell to the clock once more, her brow furrowing in thought. The faint scratch visible on the clock face caught Eleanor's attention, a detail that seemed out of place amidst the chaos. It suggested tampering, a possibility that sent a chill down her spine. Could Dr. Finch have manipulated the clock to conceal the time of Beatrice's death?

"Yes, I was here, but I assure you, I had no reason to harm Beatrice," Dr. Finch insisted, her voice rising defensively. "I cared for her; she was my friend!" The passion in her voice was palpable, yet Eleanor couldn't shake the feeling that something was amiss. The doctor’s defensiveness only served to deepen Eleanor's suspicions, and she felt a flicker of irritation at the way Dr. Finch was handling the situation. They were in the midst of a tragedy, yet the doctor seemed more concerned with her own defense than the truth.

Eleanor's mind raced as she considered the implications of Dr. Finch's alibi. "If the clock has been tampered with, it could change everything we know about the timeline of events. We need to determine exactly what happened in those crucial moments leading up to Beatrice's death." She stepped closer to the clock, her eyes narrowing as she examined the faint scratch on the face. It was a small detail, but it could hold the key to unraveling the mystery. The clock, a silent witness to the events that had transpired, now seemed to mock them with its stillness.

Dr. Finch shifted uncomfortably, her expression a mix of frustration and fear. "I told you, I was in the kitchen! I was preparing for dinner, and I lost track of time. You must believe me!" Her voice trembled slightly, and Eleanor could see the cracks in her composure. It was a moment of vulnerability that made Eleanor pause, but she quickly reminded herself of the stakes involved. They needed answers, and they needed them fast.

"We cannot afford any discrepancies in our stories, Mallory," Eleanor said firmly, her voice steady. "If we involve the police, they will scrutinize our lives, and who knows what they might discover?" The atmosphere in the drawing room shifted, tension coiling tightly around them as they prepared to confront the truth. Each of them was a potential suspect, and Eleanor felt the weight of that reality pressing down on her.

As the rain continued its relentless patter against the windows, Eleanor felt a sense of urgency rising within her. The clock loomed ominously in the background, its hands frozen at ten minutes past eleven, a reminder of the time they had lost. She could not let fear dictate their actions; they had to investigate this themselves before the police arrived. The stakes were too high, and the truth was buried beneath layers of deception. Eleanor took a deep breath, steeling herself for what lay ahead. They had to find answers, and fast.
--- END PRIOR CHAPTER 4 ---

[SCENE COMPLETENESS CONTRACTS — MANDATORY. Each contract below lists what you MUST enact in that chapter. Do not summarise or mention these labels in the prose — enact them organically.]
Chapter 5 (Act 2) completeness contract:
  PIVOT ELEMENT (MANDATORY — write this into the prose, shown not told): "Captain Hale's conflicting details about his last interaction with the victim."
  FACT ESTABLISHED (MANDATORY — reader must know this by chapter end): "Establishes that Hale's alibi is shaky, further complicating the investigation."

# Case Overview
Title: The Clockwork Conspiracy
Era: 1930s
Setting: Little Middleton
Crime: murder (clock tampering)
Culprit: Dr. Mallory Finch
False assumption: The murder occurred at the time indicated by the clock.
Cast: Eleanor Voss (she/her), Dr. Mallory Finch (she/her), Captain Ivor Hale (he/him), Beatrice Quill (she/her)

Setting Lock: Keep all scenes and descriptions consistent with the stated setting (Little Middleton). Do not introduce a different location type.

Outline scenes:
[
  {
    "sceneNumber": 5,
    "act": 2,
    "title": "Captain Hale's Alibi",
    "setting": {
      "location": "the drawing room, still tense",
      "timeOfDay": "Mid-afternoon",
      "atmosphere": "Suspenseful and revealing"
    },
    "characters": [
      "Eleanor Voss",
      "Captain Ivor Hale"
    ],
    "purpose": "Eleanor questions Captain Hale about his whereabouts.",
    "cluesRevealed": [
      "clue_2",
      "clue_culprit_direct_dr_mallory_finch"
    ],
    "dramaticElements": {
      "conflict": "Eleanor confronts Hale with conflicting details.",
      "tension": "Hale's story seems too rehearsed.",
      "microMomentBeats": [
        "Captain Hale's eyes dart around the room, avoiding Eleanor's gaze."
      ]
    },
    "summary": "Eleanor interviews Captain Hale, pressing him about his alibi. As he speaks, Eleanor notices inconsistencies in his story, particularly about the time he last saw the victim, raising her suspicions.",
    "estimatedWordCount": 1800,
    "pivotElement": "Captain Hale's conflicting details about his last interaction with the victim.",
    "factEstablished": "Establishes that Hale's alibi is shaky, further complicating the investigation.",
    "permittedBehavioursByAct": [
      {
        "characterName": "Eleanor Voss",
        "behaviour": "unease; mild defensiveness"
      },
      {
        "characterName": "Captain Ivor Hale",
        "behaviour": "unease; mild defensiveness"
      }
    ],
    "redHerringPlacement": null,
    "emotionalRegister": "A pivotal revelation deepens the emotional stakes for all involved.",
    "dominantCharacterNote": {
      "name": "Eleanor Voss",
      "voiceRegister": "Eleanor's voice carries an upper-class cadence, often laced with irony and charm, reflecting her social status."
    },
    "humourGuidance": {
      "permission": "conditional",
      "character": "Dr. Mallory Finch",
      "form": "dry_wit",
      "condition": "Dr. Finch's dry wit can surface in lighter moments."
    },
    "eraTextureNote": "Limited access to reliable transportation due to economic downturn; Restricted communication methods with reliance on wired telephones; Frequent electrical outages affecting daily life; Challenges in accessing news due to the evolving media landscape; Rationing of resources impacting everyday living",
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
  Dr. Mallory Finch    | she/her/her/herself       | [fill in]     | [yes/no]
  Captain Ivor Hale    | he/him/his/himself        | [fill in]     | [yes/no]
  Beatrice Quill       | she/her/her/herself       | [fill in]     | [yes/no]
□ Return valid JSON only.
```

## Message 4 (role=user)

```text
Attempt 3/6 — chapters 5 — 1 validation issue(s) to resolve:

═══ PROSE QUALITY ERRORS (1) ═══
• Chapter 5 marked non-convergent after attempt 2/6: continuity

✓ SOLUTION: Vary paragraph lengths (short, medium, long)
✓ Include sensory details and atmospheric description
✓ Ensure each chapter has substance (3+ paragraphs minimum)

═══ TEMPLATE LEAKAGE DETECTED ═══
• Your prose closely matches or repeats a paragraph from a prior chapter.
  Every paragraph must be original prose unique to this chapter's scene.

⛔ NEAR-DUPLICATE PASSAGE — your prose closely echoes this prior paragraph:
"as they began to recount their ... unearth it no matter the cost"

Rewrite any paragraph that shares sentence structure or extended phrases with any of the above texts.
Different words for the same image are not sufficient — the sentence structure must also differ.

⛔ PRIOR CHAPTER DUPLICATION LOCK — 34 protected passage(s):
Your prose has been detected copying from an earlier chapter. Every paragraph listed below appears in a prior chapter and is COMPLETELY OFF-LIMITS. Do not reproduce, rephrase, or structurally echo any of them:

  • "Eleanor Voss stepped cautiously into the ... a mixture of dread and curiosity."
  • "As she approached the clock, Eleanor's breath caught in her throat."
  • "The tension in the air was ... a mask of shock and dismay."
  • "the captain Hale followed closely behind Dr."
  • "The captain stepped forward, his expression ... as he took in the scene."
  • "Dr."
  • "Eleanor glanced back at the clock, ... frozen at ten minutes past eleven."
  • "As the rain continued to tap ... sense of urgency rising within her."
  • ""We must speak about what happened ... of anxiety that coursed through her."
  • "Eleanor took a deep breath, forcing ... focus on the task at hand."
  • "Dr."
  • "Captain Hale cleared her throat, attempting to regain control of the conversation."
  • "Beatrice finally spoke, her voice barely above a whisper."
  • "Eleanor turned her attention back to ... to the chaos that had unfolded."
  • "As they began to recount their ... felt a growing sense of urgency."
  • "The clock on the mantelpiece read ... of the tragedy that had unfolded."
  • "Eleanor turned to face the doctor ... a mix of confusion and fear."
  • ""Eleanor, you must understand that this is a delicate situation," Dr."
  • "Captain Hale cleared his throat, his ... to take charge of the conversation."
  • "Beatrice Quill, seated nearby, gripped her ... tightly, her knuckles white with tension."
  • ""We must clarify our whereabouts at ... Eleanor insisted, her voice rising slightly."
  • "Dr."
  • ""I distinctly remember the clock chiming ... was still running at that time."
  • "Beatrice finally found her voice, trembling as she spoke."
  • "Eleanor took a deep breath, her resolve solidifying."
  • "The rain tapped insistently against the ... relentless reminder of the turmoil outside."
  • "Eleanor's voice broke the silence, steady but laced with an underlying tension."
  • ""I was in the kitchen preparing dinner," Dr."
  • "Eleanor pressed on, determined to uncover the truth."
  • ""Yes, I was here, but I ... no reason to harm Beatrice," Dr."
  • "Eleanor's mind raced as she considered the implications of Dr."
  • "Dr."
  • ""We cannot afford any discrepancies in ... Eleanor said firmly, her voice steady."
  • "As the rain continued its relentless ... sense of urgency rising within her."

Write as if you cannot see the prior chapters. Compose every paragraph fresh from the scene instructions alone.

Return corrected JSON for chapters 5. Edit only the sections that failed — keep all content that passed validation, and return the complete updated chapter JSON.


RETRY CLASS: continuity
ATTEMPT: 2/6
MANDATORY FIXES:
- Resolve continuity issues before accepting this batch.
- Chapter 5: Pronoun drift — 9 pronoun corrections were required, indicating systematic gender confusion. Review the ⛔ ABSOLUTE PRONOUN LOCK above. For male character Captain Ivor Hale specifically: use he/him/his in every sentence. When Hale and a female character appear in the same sentence, name Hale explicitly rather than relying on a pronoun.
MITIGATION MODE: tighten_obligation
```
