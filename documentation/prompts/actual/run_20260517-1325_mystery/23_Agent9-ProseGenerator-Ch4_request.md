# Actual Prompt Record

- Run ID: `mystery-1779024357859`
- Project ID: ``
- Timestamp: `2026-05-17T13:30:35.608Z`
- Agent: `Agent9-ProseGenerator-Ch4`
- Operation: `chat_request_full_prompt`
- Model: `GPT-4o-mini`
- Temperature: `0.42`
- Max Tokens: `4500`
- Attempt: `first`
- Prompt Hash: `069ca6b882bd8670`

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
- MORAL COMPLEXITY REQUIREMENT: The mechanism of this crime carries a moral gray area: "The murderer acted out of desperation to protect a family secret that could ruin their loved ones." — the culprit reveal and denouement MUST acknowledge this ambiguity. Do not let the ending feel clean or simple. Give the reader at least one moment of uncomfortable sympathy or moral doubt.


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

## Era: 1937-08
In August 1937, the English countryside is caught in a summer haze, yet the air is laced with foreboding as the storm clouds of political unrest gather on the horizon. The weather is typically overcast, bringing intermittent rain that soaks the ground, while the long daylight hours stretch into late evenings, allowing for social activities and gatherings. Daily life is punctuated by the ongoing legacy of the Great Depression, with class divisions growing more pronounced. The wealthy socialites of Little Middleton cling to their status, hosting extravagant parties to mask the financial strains they face, while the lower classes grapple with the harsh realities of unemployment and hardship. The atmosphere is charged with an unsettling tension, as whispers of impending conflict in Europe reverberate through the community, casting a shadow over even the most festive occasions.
Emotional register: A collective unease permeates society, with fear and anxiety about the future intertwining with the desire for stability and success.
Physical constraints: Limited communication methods, relying on telegrams and letters | Travel restricted by the poor condition of country roads | Class-based mobility restrictions, with the upper class rarely mingling with the lower classes
Current tensions (weave into background texture): Growing concerns over the threat of war in Europe | Political instability stemming from the abdication crisis in Spain | The intensifying Second Sino-Japanese War affecting international relations
Wartime context — In the military, many are preparing for the possibility of conflict, with recruitment drives leading to mixed feelings about duty versus personal safety.: Communities remain divided; the upper class enjoys leisure while the working class faces daily struggles, creating a sense of resentment. Absence effect: With many men enlisting or preparing for potential service, families are left to navigate the uncertainties of life without their primary breadwinners.

## Story Theme
The struggle for ambition and integrity unfolds against a backdrop of deception, revealing how the quest for success can compromise one's moral compass, and reveals that evidence carries ethical weight, forcing characters to choose accountability over social performance when appearances and facts collide.

## Story Emotional Register
Dominant: The story navigates a complex emotional landscape, intertwining ambition, guilt, and the cost of truth.

Arc:
The tale begins in the grand Middleton Manor, steeped in opulence, where the atmosphere is thick with unspoken secrets and the foreboding weight of a murder that has just occurred. As guests gather for a dinner party, the shocking discovery of Dr. Mallory Finch's lifeless body sends ripples of anxiety through the elite social circles of Little Middleton. Eleanor Voss, driven by ambition and a desire for justice, steps into the role of investigator, her calm demeanor contrasting with the rising tension surrounding her. Each clue unearthed reveals a tangled web of motives, as the emotional cost of the investigation weighs heavily on her conscience. The stakes grow higher as Eleanor navigates false leads and unravels the facade of friendship that cloaks betrayal.

A pivotal moment arises when the tampering of the mechanical clock shifts the direction of the investigation, forcing Eleanor to confront the very people she has trusted. As secrets unravel and alliances shift, revelations begin to change the perspective on the murder. The climax builds as tension mounts, leading to a confrontation that lays bare the characters' true natures and desires. In the aftermath, the resolution leaves each character forever altered; Eleanor grapples with the moral implications of her discoveries, Dr. Finch's legacy hangs in the balance, Captain Hale confronts his past demons, and Beatrice's loyalties are irrevocably tested. The once opulent setting of Middleton Manor now stands as a stark reminder of the cost of ambition and the weight of truth, leaving a lingering sense of unease that echoes long after the final curtain falls.

## Emotional register at this point in the story
The discovery of the clock's tampering shifts the investigation's direction and raises questions about trust.

## Character Portraits (appearance & era)

### Eleanor Voss
Eleanor Voss navigates the social elite's world in Little Middleton, her career as a society columnist hanging in the balance as she uncovers the secrets of the wealthy. Amidst the backdrop of the Great Depression, her ambition drives her to seek scandal and truth, even as she grapples with the moral implications of exposing those she mingles with. The looming threat of war in Europe adds a layer of urgency to her pursuits, as the societal tensions around her grow.
Era intersection: Eleanor's hidden ambition to expose scandals reflects the broader societal pressures of the time, where class divisions and financial struggles shape her interactions.

### Beatrice Quill
Beatrice Quill, a timid housemaid, navigates the intricacies of class and loyalty in a household fraught with tension. Her secret relationship with the victim complicates her emotions, illustrating the stark divide between the upper classes and those in service. The societal norms of the 1930s further entrap her, as she grapples with her feelings amidst the backdrop of rising class resentment and the whispers of political unrest outside the manor's walls.
Era intersection: Beatrice's struggle for identity within her social class mirrors the broader themes of class disparity and the search for agency experienced by many women during this era.

## Character Voices

### Eleanor Voss (she/her/her)
Eleanor speaks with a refined cadence, her words often laced with clever observations that reflect her sharp intellect and social savvy.
[comfortable] Oh, the latest gossip? You know I can’t resist a good story, especially when it involves our esteemed guests.
[evasive] I’m sure everyone has their reasons for being here, don’t you think? Perhaps some are just better at hiding them.
[stressed] This investigation is turning into a web of deceit, and I can’t shake the feeling that time is running out.
Humour: Eleanor's dry wit often emerges, especially in light-hearted conversations.

### Beatrice Quill (she/her/her)
Beatrice's voice is soft and tentative, often trailing off as she navigates the complexities of her emotions.
[comfortable] I-I just want to do my job well; it’s all I can manage.
[evasive] I-I don’t really know anything about that, I’m just a maid.
[stressed] If only they knew the truth... it could ruin everything for me.
Humour: Beatrice's self-deprecating humor is subtle, reflecting her timid nature.

## Location Registers (scene framing guides)

The Library: The library feels heavy with secrets, the air thick with unspoken words as shadows loom. The ticking clock on the wall serves as a constant reminder of time slipping away, amplifying the tension as characters navigate their hidden agendas.. Camera angle: As a writer enters this space, they should feel a sense of impending revelation, as if the very walls are waiting to divulge the secrets held within.. Era: The musty scent of old books permeates the air, creating an atmosphere of nostalgia tinged with foreboding.

The Drawing Room: The drawing room exudes elegance, yet the laughter seems forced, with an underlying tension simmering just beneath the surface. The warm glow of gaslight casts flickering shadows, creating an intimate setting that belies the secrets lurking in the hearts of the guests.. Camera angle: Entering this space, the writer should capture the dichotomy of festivity and unease, as if the room itself holds its breath, waiting for the truth to emerge.. Era: The contrast between the opulence of the setting and the growing discontent among the guests mirrors the societal tensions of the era.

The Study: The study feels isolated, a sanctuary of solitude where the weight of secrets presses down. The cluttered desk and dark wood paneling create a sense of confinement, as if the very air is thick with unspoken truths and unresolved conflicts.. Camera angle: This space invites the writer to explore the inner turmoil of its occupants, where every decision is fraught with consequence and the shadows grow longer as night approaches.. Era: The flickering candlelight casts eerie shadows, highlighting the tension that permeates the room.

Servants' Quarters: The servants' quarters feel cramped and modest, filled with the aroma of cooking and the sounds of bustling activity. Beneath the camaraderie lies a palpable tension, as whispers of the day's events hint at the struggles and secrets shared among the staff.. Camera angle: As a writer enters this space, they should feel the dynamics of power and loyalty at play, where the lives of the staff intersect with the mysteries of the manor.. Era: The stark contrast to the grandeur of the manor serves as a constant reminder of the class divisions that define their lives.

## Humour guidance for this story position (first_turn)
Permission: forbidden
Rationale: The scene's intensity requires a serious tone to convey the stakes.

## Reveal Groundwork (texture — do not explain, only plant)
- Plant one subtle observable beat related to: "The moment when Eleanor discovers the clock's tampering alters the investigation's course, revealing the depth of Beatrice's involvement". Do not explain significance yet.
- Plant one subtle observable beat related to: "Plant one subtle anomaly that can be re-read after the resolution.". Do not explain significance yet.
- Plant one subtle observable beat related to: "Finch, highlighting the complexities of their relationship". Do not explain significance yet.

FAIR-PLAY AND INFERENCE CONTRACT (from CML logic):
- False assumption in force: Dr. Mallory Finch was killed later than he actually was, allowing Beatrice Quill to establish her alibi.
- Hidden truth to progressively expose: The clock was tampered with, creating a misleading timeline.
- Inference path checkpoints to dramatize clearly (observation -> correction -> effect):
  - Step 1: obs: The clock in the drawing room shows ten minutes past eleven. | corr: This indicates the time was altered, as Dr. Finch was last seen alive around eight o'clock. | effect: Narrows the timeline of death and eliminates the notion that the murder occurred after the dinner.
  - Step 2: obs: Guests report the clock struck during dinner despite the murder occurring earlier. | corr: This suggests the clock was tampered to create a false alibi for Beatrice Quill. | effect: Eliminates the idea that her alibi is credible as it is based on a manipulated timeline.
  - Step 3: obs: Tampering marks on the clock casing indicate recent adjustment. | corr: This proves that the clock was purposely altered just before the murder. | effect: Narrows suspicion to Beatrice Quill, who had access to the clock.
- Discriminating test method: trap
- Discriminating test design constraint: The discriminating test compares clock, minut, and eleven against the claimed timeline.
- Test must rely on already-shown clue IDs: clue_1, clue_2, clue_3, clue_core_contradiction_chain
- Fair-play rationale: Step 1: The clock's time (early) and guest reports (mid) establish a contradiction in the timeline leading to suspicion on Beatrice. Step 2: The tampering evidence (mid) eliminates her alibi. Step 3: The trap test (early Act III) reveals her inability to explain the clock's alteration, confirming her guilt.
- Never solve by withheld information. Keep reader-information parity with detective reasoning.

## Character Reference

### Eleanor Voss (she/her — NEVER he/him)
Eleanor speaks with a refined cadence, often punctuating her sentences with clever observations
She has a tendency to raise an eyebrow when amused and employs a slight smirk that suggests she knows more than she lets on
Her dialogue is peppered with phrases that reflect her sharp intellect and social savvy, making her a captivating conversationalist.
Eleanor wrestles with the fear that her pursuit of success may lead her to betray those she considers friends. The weight of her ambition clashes with her conscience, leaving her questioning the cost of her revelations.

### Beatrice Quill (she/her — NEVER he/him)
Beatrice speaks softly, often trailing off at the end of her sentences
She has a habit of fidgeting with her apron when nervous and uses polite language, frequently apologizing even when it’s unnecessary
Her speech is punctuated by hesitant pauses, revealing her timid nature.
Beatrice is torn between her love for the victim and the fear of what the truth may reveal. The murder forces her to confront her own feelings of worthlessness and the power dynamics at play in her life, leaving her to question her loyalties.


## CHARACTER CONTRACTS (binding for this scene)
Each entry below constrains how this character must be written in this chapter.
These override generic style guidance when they conflict.

### Eleanor Voss[SHE]
Voice & mannerisms: Eleanor speaks with a refined cadence, often punctuating her sentences with clever observations. She has a tendency to raise an eyebrow when amused and employs a slight smirk that suggests she knows more than she lets on. Her dialogue is peppered with phrases that reflect her sharp intellect and social savvy, making her a captivating conversationalist.
Sample voice fragments (match this register and rhythm):
  [comfortable] "Oh, the latest gossip? You know I can’t resist a good story, especially when it involves our esteemed guests."
  [evasive] "I’m sure everyone has their reasons for being here, don’t you think? Perhaps some are just better at hiding them."
Humour: dry wit — deploy occasionally (level 0.6)
FORBIDDEN phrase (never write for Eleanor Voss): "a surge of determination washed over her"
Act 2 behaviour contract: May show unease, evasion, or mild defensiveness when questioned. One behavioural tell is permitted. Internal conflict emerging: "Eleanor wrestles with the fear that her pursuit of success may lead her to betray those she considers friends. The weight of her ambition clashes with her conscience, leaving her questioning the cost of her revelations."

### Beatrice Quill[SHE]
Voice & mannerisms: Beatrice speaks softly, often trailing off at the end of her sentences. She has a habit of fidgeting with her apron when nervous and uses polite language, frequently apologizing even when it’s unnecessary. Her speech is punctuated by hesitant pauses, revealing her timid nature.
Sample voice fragments (match this register and rhythm):
  [comfortable] "I-I just want to do my job well; it’s all I can manage."
  [evasive] "I-I don’t really know anything about that, I’m just a maid."
Humour: self deprecating — deploy rarely (level 0.2)
FORBIDDEN phrase (never write for Beatrice Quill): "she knew with certainty she was right"
Act 2 behaviour contract: May show unease, evasion, or mild defensiveness when questioned. One behavioural tell is permitted. Internal conflict emerging: "Beatrice is torn between her love for the victim and the fear of what the truth may reveal. The murder forces her to confront her own feelings of worthlessness and the power dynamics at play in her life, leaving her to question her loyalties."



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

Primary Location: Middleton Manor (Little Middleton, England)
Middleton Manor is a sprawling estate that embodies both opulence and the weight of social hierarchy, shrouded in secrets and tension.

Key Locations Available:
- The Library (interior): Crime scene
- The Drawing Room (interior): Gathering space
- The Study (interior): Private space for family members
- Servants' Quarters (interior): Living space for household staff

Atmosphere: Tense and foreboding, underscored by the weight of social expectations and secrets.
Weather: Overcast with occasional rain, typical for the English countryside in autumn.

Era markers: Petrol touring cars on narrow country roads | Typewriters clacking in the study | Occasional power outages from domestic wiring

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
  - Visual: dust motes dancing in the air, shadows cast by the flickering lamp, worn spines of forgotten volumes
  - Sounds: the soft rustle of pages, the ticking clock on the wall, distant thunder rumbling
  - Scents: musty paper and old leather, the faint aroma of wood polish, a hint of damp from the rain outside
  - Touch: smooth leather of the armchair, cold marble floor beneath bare feet

The Drawing Room (interior):
  - Visual: plush velvet armchairs in deep burgundy, gilded mirrors reflecting candlelight, a grand piano in the corner
  - Sounds: the crackle of the fireplace, soft laughter and murmurs, the distant clink of glasses
  - Scents: tobacco smoke lingering in the air, the rich scent of polished wood, a hint of floral perfume
  - Touch: soft velvet upholstery, the coolness of marble mantelpiece

The Study (interior):
  - Visual: dark wood bookshelves lined with volumes, papers strewn haphazardly across the desk, a flickering candle casting shadows
  - Sounds: the scratch of a pen on paper, the rustle of leaves outside, the distant sound of thunder
  - Scents: the musty scent of old books, the rich aroma of polished wood, the faint whiff of ink
  - Touch: smooth leather of the chair, the cool touch of glass from the window

⛔ REFERENCE DATA — DO NOT TRANSCRIBE VERBATIM: The above profiles are structural guides only. Generate original prose that evokes these qualities; do not reproduce the exact phrasing or sentence structure of the profile paragraphs.

SCENE OPENING RULE: When opening a scene in a new location, write what the POV character directly observes and physically senses at that moment — not a general description of the room's qualities. The reader must feel present, not briefed. Sensory details must be observed by the character, not stated as fact about the place.

SENSORY WRITING TECHNIQUES:
- Opening paragraphs: Lead with 2-3 sensory details to ground the scene
- Movement between locations: Note sensory changes (quiet study → noisy dining room)
- Emotional scenes: Use sensory details to reinforce mood (cold rain during argument)
- Period authenticity: Use period-specific sensory details from locat
[truncated for prompt budget]

## Texture Pool
Draw on these as opportunities arise — you are not required to use them.

- In August 1937, the English countryside is caught in a summer haze, yet the air is laced with foreboding as the storm clouds of political unrest gather on the horizon
- The weather is typically overcast, bringing intermittent rain that soaks the ground, while the long daylight hours stretch into late evenings, allowing for social activities and gatherings
- Daily life is punctuated by the ongoing legacy of the Great Depression, with class divisions growing more pronounced
- The wealthy socialites of Little Middleton cling to their status, hosting extravagant parties to mask the financial strains they face, while the lower classes grapple with the harsh realities of unemployment and hardship
- The atmosphere is charged with an unsettling tension, as whispers of impending conflict in Europe reverberate through the community, casting a shadow over even the most festive occasions.

TEMPORAL CONTEXT:

This story takes place in August 1937 during summer.

Seasonal Atmosphere:
- Weather patterns: overcast skies, occasional rain showers, warm but humid conditions
- Daylight: Long daylight hours, with the sun setting around eight o'clock, allowing for late evening activities
- Seasonal activities: garden parties, picnics in the countryside, local fairs and carnivals
- Seasonal occasions: Bank Holiday weekend on August 2nd
- Season: summer

Period Fashion (describe naturally):
- Men formal: tailored three-piece suit in wool, white dress shirt with a high collar, silk tie with geometric patterns
- Men casual: lightweight linen trousers, short-sleeved cotton shirt, canvas shoes
- Men accessories: fedora hat, leather gloves, cufflinks
- Women formal: tea-length dress with floral prints, elaborate hat adorned with ribbons, pearl necklace
- Women casual: light cotton blouse, A-line skirt, sandals
- Women accessories: handbag with a chain strap, bangles, silk scarf

Cultural Context (reference naturally):
- Music/entertainment: Swing music gaining popularity, Benny Goodman leading the jazz scene, Ella Fitzgerald emerging as a prominent vocalist; Films: The Awful Truth, A Star is Born; Theatre: The Lady from Shanghai, The Royal Family; Radio: The Shadow, Amos 'n' Andy
- Typical prices: Loaf of bread: four pence, Cinema ticket: one shilling, Bottle of milk: three pence
- Current events: tensions rising in Europe with the looming threat of war; the abdication crisis in Spain leading to increased political instability
- Literature: The Hobbit by J.R.R. Tolkien | Of Mice and Men by John Steinbeck | Brave New World by Aldous Huxley | [mystery] | [social realism] | [science fiction]
- Technology: the first commercially available television sets | advancements in radio technology | early forms of air conditioning | typewriters in offices | petrol cars for personal transport | wireless radios in households
- Daily life: socializing at garden parties, picnics at local parks, attending summer fairs
- Social rituals: afternoon tea served at three o'clock, Sunday family dinners, seasonal festivals celebrating harvests

Atmospheric Details:
The scent of damp earth mingling with the sweet smell of blooming roses lingers in the air. The distant sound of raindrops tapping against window panes creates a haunting rhythm within the manor. A heavy stillness envelops the estate, punctuated only by the occasional rustle of leaves in the soft breeze.

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
  - The scheduled start time of the social event during which the murder occurred: "half past ten"
    ⛔ FORBIDDEN alternatives: "10:30", "10.30", "ten thirty", "ten-thirty", "ten past thirty", "quarter past ten" — the ONLY acceptable form is "half past ten"
  - The distance between the victim's body and the clock that was tampered with: "three feet from the clock"

If a locked fact has no relevance to this chapter, omit it. But the moment you reference the underlying evidence, only the exact phrase above is acceptable.

⛔ CLUES TO SURFACE IN THESE CHAPTERS — mandatory:
The following evidence MUST be clearly observable to an attentive reader. Do not bury it in atmosphere or passing dialogue. Each clue must be concrete, specific, and noticeable:

• [clue_5] Tampering marks on the clock casing indicate recent adjustment.
  Category: physical | Criticality: essential | Supports inference step 3
  Points to: This provides evidence of interference with the clock.

• [clue_culprit_direct_beatrice_quill] Direct evidence ties Beatrice Quill to the mechanism access point before the discriminating test.
  Category: physical | Criticality: essential | Supports inference step 3
  Points to: This direct evidence shows Beatrice Quill had means and opportunity, narrowing the solution uniquely toward the culprit.

For each clue above: an attentive reader should be able to find, record, and later use it to reason toward the solution.

═══ NARRATIVE STATE (read-only — do not contradict) ═══

LOCKED FACTS — use verbatim whenever this evidence is described:
  • The exact time shown on the stopped clock face: "ten minutes past eleven"
  • The exact amount the clock was wound back: "forty minutes"
  • The scheduled start time of the social event during which the murder occurred: "half past ten"
  • The distance between the victim's body and the clock that was tampered with: "three feet from the clock"

CHARACTER PRONOUNS — never deviate from these:
  • Eleanor Voss: she/her/her
  • Dr. Mallory Finch: he/him/his
  • Captain Ivor Hale: he/him/his
  • Beatrice Quill: she/her/her

CLUES ALREADY REVEALED TO READER: clue_1, clue_mechanism_visibility_core, clue_2, clue_3, clue_4, clue_core_contradiction_chain, clue_core_elimination_chain — do not reveal these as new information.

INVESTIGATION LOG — WHAT IS ESTABLISHED (do not re-establish, do not repeat):
• Evidence in reader's hands: The clock in the drawing room shows ten minutes past eleven. | A mechanical clock was deliberately wound back to create a false alibi for Beatrice Quill. | This indicates the time was altered, as Dr. Finch was last seen alive around eight o'clock. | Guests report the clock struck during dinner despite the murder occurring earlier. | This suggests the clock was tampered to create a false alibi for Beatrice Quill. | This indicates the time was altered, as Dr. Finch was last seen alive around eight o'clock. | Eliminates Eleanor Voss because she was seen in the library at the time of the murder.
• Suspects still unresolved: Eleanor Voss[SHE], Dr. Mallory Finch[HE], Captain Ivor Hale[HE]
⚠ The story must move FORWARD from this log. Any beat already listed above is forbidden from repeating.

⚠ THIS CHAPTER'S REQUIRED ADVANCE (first_turn): Examine physical evidence — find at least one new clue

CONTINUITY HANDOFF — previous chapter closing beat:
  • "The guests nodded, some exchanging wary glances, while others appeared lost in thought. Eleanor felt a flicker of hope amidst the tension. Perhaps, together, they could unravel the truth behind Dr. Finch's death. Yet, a nagging doubt lingered in his mind. Trus..."
  • The next chapter must open as a continuation of this beat, not as a disconnected reset.
═══════════════════════════════════════════════════════

═══════════════════════════════════════════════════════════
📚 CONTINUITY CONTEXT - CHARACTER & SETTING CONSISTENCY
═══════════════════════════════════════════════════════════

**CRITICAL: You are writing chapters 4+. Maintain consistency with earlier chapters.**

**Character Names Used in Chapters 1-3:**
Eleanor Voss, Beatrice Quill

✓ RULE: Use EXACTLY these names. Do NOT vary spelling, add titles, or introduce new forms.
✓ Example: if earlier chapters used "Clara Whitfield", keep using "Clara Whitfield" — never "Mrs. Whitfield" unless that is the character's canonical name in the list above.

**Setting Vocabulary Established in Earlier Chapters:**
drawing room, estate, dining room

✓ RULE: Continue using this location vocabulary. Maintain consistency with established setting type.
✓ Do NOT introduce new location types that contradict earlier chapters.

**Recent Chapter Summary (for narrative continuity):**
Chapter 1: Chapter 1: Discovery
  Events: Eleanor Voss stepped into the drawing room of the Quill residence, her heels clicking softly against the polished wooden floor.
Chapter 2: Chapter 2: The Alibi
  Events: Beatrice hesitated, her breath catching in her throat.
Chapter 3: Chapter 3: The Examination
  Events: At ten minutes past eleven, the clock in the drawing room stood frozen, a silent sentinel to the chaos that had unfolded.

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
Known location profile anchors: Middleton Manor, The Library, The Drawing Room, The Study, Servants' Quarters, the drawing room, now more subdued
LOCATION NAME CAPITALISATION (HARD REQUIREMENT — validated):
All named locations in your prose MUST use the EXACT capitalisation from the CML profiles.
Canonical forms: "Middleton Manor", "The Library", "The Drawing Room", "The Study", "Servants' Quarters", "the drawing room, now more subdued"
Writing a location in lowercase (e.g. "drawing room" instead of "Drawing Room") is a validated error. Every time you mention a named location, copy its capitalisation from the list above.
- Chapter 4: OPENING STYLE (HARD): Start the VERY FIRST SENTENCE with a noun-phrase atmosphere — e.g. "The smell of damp stone in the cellar…" / "A chill from the landing…" / "The sound of the clock in the hall…". Pattern: "The/A [noun] of/in/from [place]…". Anchor opening in "the drawing room, now more subdued". HARD REQUIREMENT for the first 2 paragraphs: (a) include 2+ sensory words — choose from smell/scent/sound/echo/silence/creak/whisper/cold/warm/damp/rough/smooth/glow/shadow/flicker/dim — and (b) include 1+ atmosphere/time word — choose from rain/wind/fog/storm/mist/thunder/evening/morning/night/dawn/dusk/season/afternoon/midday/noon/midnight/twilight/sunrise/sunset/daylight/sunlight/overcast/cloudy/bright/dark. These are validated requirements, not style suggestions; missing them triggers a retry.

[⚠ INTERNAL QUALITY DIAGNOSTICS — DO NOT REPRODUCE ANY PART OF THIS SECTION IN YOUR STORY OUTPUT. These are private generator observations for your consideration only. Your narrative must read as if this section does not exist. Never include phrases from this block in character dialogue, narration, or description.]

PRIOR CHAPTER QUALITY OBSERVATIONS:
- Chapter 2 (score 91/100):
  Quality gaps noted: word density below preferred target (794/1000); scene grounding weakness
  Address in upcoming chapters: Increase chapter density with concrete investigation action and sensory-grounded beats; avoid recap-only padding. | Open next chapter with a named location anchor plus at least two sensory cues and one atmosphere marker.
- Chapter 3 (score 87/100):
  Quality gaps noted: word density below preferred target (693/1000); scene grounding weakness
  Address in upcoming chapters: Increase chapter density with concrete investigation action and sensory-grounded beats; avoid recap-only padding. | Open next chapter with a named location anchor plus at least two sensory cues and one atmosphere marker.
- Phrases to avoid (already overused in earlier chapters): "the questions swirled in her mind like", "questions swirled in her mind like the", "swirled in her mind like the rain", "in her mind like the rain outside", "her mind like the rain outside each", "mind like the rain outside each one", "like the rain outside each one demanding", "the rain outside each one demanding an", "rain outside each one demanding an answer".
[END INTERNAL DIAGNOSTICS]

PROMPT BUDGET SUMMARY: budget=32000 tokens; fixed=8770; context=11025; dropped=[none]; truncated=[pronoun_accuracy, location_profiles, temporal_context]

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
- Chapter numbering starts at 4 and increments by 1 per scene.
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
8. Integrate at least two concrete era-grounded details per chapter from setting refinement signals: petrol touring cars on county roads | domestic wiring with frequent outages | typewriters common in offices | party-line telephone exchanges | telegrams via local post offices | airmail services available.
9. Respect setting movement/access constraints in scene action and alibis: Geographic layout allows for limited escape routes and hidden areas within the estate. | Architecture includes locked rooms and restricted areas for household staff. | Weather conditions can affect outdoor movement and evidence preservation. | Strict permissions required to enter certain areas of the house, such as the study and cellar. | Daily routines dictate when rooms are occupied or accessible..
10. Sustain social coherence with this backdrop pressure: An inheritance dispute amidst the backdrop of the Great Depression forces a diverse group of heirs and associates into a tense manor setting, where class tensions and personal secrets collide under the weight of social expectations.
11. Maintain continuity around these socially central cast anchors where relevant: Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill.
12. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Critical: Plot similarity 0.80 with 'The Mysterious Affair at Styles' (same premeditated murder theme and similar setting)
13. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Moderate: Character similarity 0.74 with 'The Sign of the Four' (mirrored role dynamics and motive)
14. STORY TO DATE ANTI-COPY RULE: The STORY TO DATE section below is provided for chronological and factual reference ONLY. You MUST NOT copy, lightly rephrase, or structurally echo any sentence or paragraph from prior chapters. Every sentence in this chapter must be original prose unique to this scene. Reusing even a clause from prior chapter text will cause this attempt to fail immediately.

CRITICAL PROSE REQUIREMENTS:

The CML specifies exact requirements for certain validation-critical scenes. You MUST include these elements at the specified positions.

**Discriminating Test Scene (Act 3, Scene 4):**
Required elements: Execute the discriminating test, Observe the culprit's reaction or result, Draw conclusion about guilt

**Suspect Clearance Scenes:**
- Captain Ivor Hale (Act 3, Scene 5): Proving he was with other guests during the murder window
  Clues: clue_id_1, clue_id_2
- Dr. Mallory Finch (Act 3, Scene 5): Alibi confirmed: N/A

**Culprit Revelation Scene (Act 3, Scene 6):**
Method: Confrontation with evidence

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
- Chapter 4:
  - STRUCTURAL ARCHETYPE — Chapter 4 must be: ALIBI_PROBE
      ✓ MUST contain: one alibi tested with a stated result
      ✗ MUST NOT contain: 
  - Word count: Target 1250 words. Achieve this through plot events, dialogue exchanges, and physical investigation — not through atmospheric repetition or extended internal reflection. Each 200-word segment should contain at minimum one concrete story event (a discovery, a conversation exchange, a physical action or movement). Padding with atmosphere alone is not acceptable.
  - Opening: Begin with a character action, spoken line, or clock/time marker — never a location name or location-description phrase.
  - Scene is set in: the drawing room, now more subdued — reference it naturally within the paragraph, never as your opening phrase.
  - Opening atmosphere (MANDATORY — validator enforced): the first paragraph MUST contain at least one of: rain / wind / fog / storm / mist / thunder / evening / morning / night / dawn / dusk / season / afternoon / midday / noon / midnight / twilight / sunrise / sunset / daylight / sunlight / overcast / cloudy / bright / dark / grey / pale / cold / warm / chill / crisp / damp / drizzle / haze / lamplight / firelight. A chapter that omits all of these from its opening paragraph will be rejected.
  - Continuity bridge: in the first 120 words, visibly connect from the previous chapter's final beat. Carry forward one unresolved element (object, accusation, emotional pressure, or immediate physical action) from: "The guests nodded, some exchanging wary glances, while others appeared lost in thought. Eleanor felt a flicker of hope amidst the tension. Perhaps, together, they could unravel the truth behind Dr. Finch's death. Yet, a...".
  - CLUE OBLIGATIONS — mandatory prose elements (do NOT omit or bury):
    • Tampering marks on the clock casing indicate recent adjustment. [clue_5]
      Points to: This provides evidence of interference with the clock.
    • Direct evidence ties Beatrice Quill to the mechanism access point before the discriminating test. [clue_culprit_direct_beatrice_quill]
      Points to: This direct evidence shows Beatrice Quill had means and opportunity, narrowing the solution uniquely toward the culprit.
  - Tonal contrast: include at least one beat of relief or ironic counterpoint. Do not sustain maximum tension for every paragraph.
  - Sensory obligation — use at least two of: dim light casting shadows, the flicker of gaslight against the walls | the ticking of a clock, the rustle of a newspaper | the scent of coffee brewing. Mood: tension building.

- Tonal contrast required: the previous chapter was high-tension. This chapter must include at least one beat of relief, pause, or quiet observation.
- Locked fact phrase obligations:
  - If this batch mentions The exact time shown on the stopped clock face, write exactly: "ten minutes past eleven".
  - If this batch mentions The exact amount the clock was wound back, write exactly: "forty minutes".
  - If this batch mentions The scheduled start time of the social event during which the murder occurred, write exactly: "half past ten".
  - If this batch mentions The distance between the victim's body and the clock that was tampered with, write exactly: "three feet from the clock".
- Seasonal vocabulary allow-list: summer, summery, midsummer.
- Forbidden seasonal words: spring, autumn, winter.

FROZEN FACT STATE (DO NOT ALTER):
- Timeline anchor: August (summer).
- Month, season, weather, and time-of-year language in this batch must stay compatible with summer.
- Established timeline fact: Dinner started at eight o'clock
- Established timeline fact: Clock stopped at ten minutes past eleven
- If referenced, use exact phrase: "ten minutes past eleven" (The exact time shown on the stopped clock face).
- If referenced, use exact phrase: "forty minutes" (The exact amount the clock was wound back).
- If referenced, use exact phrase: "half past ten" (The scheduled start time of the social event during which the murder occurred).
- If referenced, use exact phrase: "three feet from the clock" (The distance between the victim's body and the clock that was tampered with).

STORY TO DATE (REFERENCE ONLY — DO NOT COPY VERBATIM):
- Full prior chapter text is provided below for continuity, factual consistency, and reference accuracy.
- Use this to keep character voice, chronology, clue state, and location continuity aligned with earlier chapters.
- Do not quote, copy, or paraphrase these paragraphs too closely; write fresh prose that remains consistent with them.

--- BEGIN PRIOR CHAPTER 1 ---
Title: Chapter 1: Discovery
Eleanor Voss stepped into the drawing room of the Quill residence, her heels clicking softly against the polished wooden floor. The morning light struggled to penetrate the heavy clouds outside, casting a dim glow that mingled with the scent of damp earth lingering in the air. A steady patter of rain against the window created a melancholic rhythm, underscoring the tension that hung in the room. Eleanor's heart raced as she took in the scene before her, her instincts sharpening in response to the palpable unease.

As Eleanor approached the center of the room, her gaze fell upon the clock mounted on the wall. It showed ten minutes past eleven, its hands frozen in time. The sight sent a chill down her spine, for it was a clear indication that something was terribly amiss. The clock, usually a reliable keeper of time, now stood as a silent witness to the chaos that had unfolded. Eleanor's mind raced with implications. If the clock had stopped at ten minutes past eleven, it meant that the doctor Finch had died no later than that time, contradicting any alibis that might be presented by those present in the house.

The realization weighed heavily upon her. The dinner party had started at eight o'clock, and now, with the clock frozen in place, the timeline of events began to unravel. Who had been in the drawing room during that time? And how could they account for the victim's death? Eleanor's thoughts were interrupted by a soft gasp from Beatrice Quill, who stood nearby, her face pale and drawn, betraying the grief that threatened to consume her.

the captain Hale, attempting to maintain some semblance of order, turned his attention to Beatrice. "Stay calm, Miss Quill. We must gather our thoughts and figure out what has occurred here," he said, his voice steady but laced with urgency. Beatrice nodded, her hands trembling as she clutched her apron tightly, a gesture that spoke volumes about her distress.

Eleanor observed Beatrice closely, noting the red-rimmed eyes and the way her breath came in shallow gasps. It was clear that the young woman was in shock, yet Eleanor sensed a deeper turmoil beneath the surface. What secrets lay hidden within the walls of this grand estate? As the rain continued to tap against the windows, Eleanor felt the weight of the investigation settling upon her shoulders. She was not merely an observer; she was now entwined in a web of intrigue that demanded her attention.

Eleanor's attention shifted back to the clock, and she recalled the whispers she had overheard during the party. There had been talk of tensions between Dr. Finch and some of the guests, but the details had been vague. Now, those whispers echoed in his mind, each one a potential clue leading to the truth. He needed to piece together the fragments of the night before, to understand how a man so full of life could be reduced to a lifeless body on the floor.

As she knelt beside the body, Eleanor noted the position of Dr. Finch's limbs, the way his head lay at an unnatural angle. It was a sight that would haunt him, but he steeled himself against the wave of emotion threatening to overwhelm him. He had a duty to fulfill, a truth to uncover. The clock was not the only thing that had been tampered with; he could feel it in the air, a sense of deception lurking just beneath the surface.

The mechanical clock had been deliberately wound back to create a false alibi for Beatrice Quill, Eleanor surmised. The implications were staggering. If someone had manipulated the time, it meant that they were trying to cover their tracks. But who had the motive? And what had transpired in those crucial moments before the clock had stopped? The questions swirled in her mind like the rain outside, each one demanding an answer.

Eleanor stood, her resolve hardening. He would not rest until he had uncovered the truth behind Dr. Finch's death. The elegant facade of the Quill residence would not hide the darkness that had seeped into its corners. With Captain Hale and Beatrice Quill as her reluctant allies, she would delve into the secrets of this household, unearthing the lies that had led to murder.
--- END PRIOR CHAPTER 1 ---

--- BEGIN PRIOR CHAPTER 2 ---
Title: Chapter 2: The Alibi
The evening air was thick with tension, the distant rumble of thunder echoing through the drawing room as Eleanor Voss turned her attention back to Beatrice Quill. "What did you hear, Beatrice?" she asked, her voice steady despite the chaos swirling around them. Beatrice's eyes darted nervously, her fingers fidgeting with the hem of her apron. The soft flicker of candlelight cast dancing shadows on the walls, illuminating the anxious faces of the guests gathered in the room. Outside, the rain began to fall more heavily, a steady patter that mirrored the unease settling in the air. Eleanor could feel the weight of the moment pressing down on her, the urgency to uncover the truth growing stronger with each passing second.

Beatrice hesitated, her breath catching in her throat. "I-I was in the dining room, just like everyone else. We were having dinner when I heard the clock strike. I thought it was... it was just before dessert," she stammered, her voice barely above a whisper. Eleanor's gaze shifted to the clock mounted on the wall. It showed ten minutes past eleven, its hands frozen in time. The sight sent a chill down her spine, for it was a clear indication that something was terribly amiss. If the clock had stopped at ten minutes past eleven, it meant that Dr. Finch had died no later than that time, contradicting Beatrice's claim of being in the dining room during the murder.

Eleanor's mind raced with implications. "This indicates the time was altered, as Dr. Finch was last seen alive around eight o'clock," he thought, piecing together the fragments of the evening. The dinner had started at eight, yet the clock's frozen hands suggested a much later time. How could Beatrice account for her whereabouts during those crucial moments? The questions swirled in her mind like the rain outside, each one demanding an answer. She needed to understand how the timeline had been manipulated, and who might have had the motive to do so.

Captain Hale stepped forward, his expression grave. "I can confirm that the clock struck during dinner. I remember it clearly, just before we served the dessert," he said, his voice firm. Eleanor's heart sank at her words. Captain Hale's insistence that the clock had struck during dinner suggested a different timeline, one that could potentially exonerate Beatrice. Yet, his statement also raised further questions about the reliability of their accounts. How could they both be so certain, yet so contradictory? The tension in the room thickened, and Eleanor could sense the growing suspicion among the guests.

Eleanor caught Beatrice's eye, a silent plea for understanding passing between them. Beatrice's face was pale, her eyes wide with fear. "I-I don’t really know anything about that, I’m just a maid," she murmured, her voice trembling. Eleanor felt a pang of empathy for the young woman, caught in a web of circumstances beyond her control. But the investigation demanded clarity, and Eleanor could not afford to let her emotions cloud her judgment. The stakes were too high, and the truth was lurking just beyond the shadows of the drawing room.

As the rain continued to tap against the windows, Eleanor turned her attention back to Captain Hale. "What else do you remember from the evening?" she asked, her tone probing yet measured. Hale's brow furrowed as he considered his question. "We were all present, discussing the latest news and gossip. Dr. Finch seemed... distracted, preoccupied with something. I noticed he kept glancing towards the door, as if he was expecting someone," he replied, his voice steady but laced with urgency. Eleanor's mind raced at this new piece of information. Who could Dr. Finch have been waiting for? And how did this fit into the timeline of his death?

The atmosphere in the drawing room was electric, the guests whispering among themselves, casting furtive glances at one another. Eleanor could feel the weight of their scrutiny, the unspoken accusations hanging in the air. She needed to maintain control, to guide the conversation towards the truth without revealing her own suspicions. "It’s crucial that we piece together the events of the evening," she said, her voice firm. "We must determine who was where and when, to understand how this tragedy unfolded. Every detail matters."

As the guests nodded in agreement, Eleanor felt a flicker of hope. Perhaps they could uncover the truth together, despite the rising tensions. But deep down, she knew that the path ahead would be fraught with challenges. Trust was a fragile thing, easily shattered in the face of suspicion. And as the rain continued to fall outside, Eleanor steeled herself for the difficult conversations that lay ahead, determined to unravel the tangled web of deceit that had led to Dr. Finch's untimely death.
--- END PRIOR CHAPTER 2 ---

--- BEGIN PRIOR CHAPTER 3 ---
Title: Chapter 3: The Examination
At ten minutes past eleven, the clock in the drawing room stood frozen, a silent sentinel to the chaos that had unfolded. The rain continued to patter against the windowpanes, a steady rhythm that echoed the tension in the room. Eleanor Voss approached the clock, her heart racing as she recalled the events of the previous evening. The faces of the guests flashed through her mind, each one a potential suspect. She could feel the weight of their gazes upon her, their unspoken accusations hanging in the air like the dampness that clung to the walls. As she leaned closer, her fingers brushed against the clock's casing, feeling the tension of the moment. The clock, usually a reliable keeper of time, now seemed to mock her with its stillness.

Captain Hale stepped forward, his brow furrowed in thought. "I can confirm that the clock struck during dinner. I remember it clearly, just before we served the dessert," he said, his voice firm. Eleanor's mind raced at her words. If the clock had struck during dinner, it contradicted the timeline that suggested Dr. Finch had died no later than ten minutes past eleven. The implications were staggering; it suggested the clock's timing was unreliable. Who had tampered with it, and why? This raised further questions about the reliability of their accounts, as both Beatrice and Hale insisted they were present during the clock's supposed striking.

Eleanor's gaze shifted to Beatrice, who stood nearby, her hands trembling as she clutched her apron. "What do you remember, Beatrice?" Eleanor asked, her voice steady despite the chaos swirling around them. Beatrice hesitated, her breath catching in her throat. "I-I was in the dining room, just like everyone else. We were having dinner when I heard the clock strike. I thought it was... it was just before dessert," she stammered, her voice barely above a whisper. Eleanor's heart sank. If Beatrice's claim was true, it would create a conflict with the evidence surrounding the clock.

The tension in the room thickened as Eleanor turned her attention back to the clock. If Dr. Finch had been last seen alive around eight o'clock, and the clock showed ten minutes past eleven, this indicated the time was altered. Someone had manipulated the clock to create a false alibi, and Beatrice Quill was the prime suspect. Eleanor could feel the weight of the moment pressing down on her, the urgency to uncover the truth growing stronger with each passing second. She needed to understand how the timeline had been manipulated and who might have had the motive to do so.

As Eleanor examined the clock more closely, she noticed something peculiar about the casing. There were faint marks, almost imperceptible, that suggested it had been tampered with recently. A mechanical clock was deliberately wound back to create a false alibi for Beatrice Quill. The realization sent a chill down her spine. If someone had gone to such lengths to alter the time, it meant they were trying to cover their tracks. But who had the motive? And what had transpired in those crucial moments before the clock had stopped? The questions swirled in her mind like the rain outside, each one demanding an answer.

The guests murmured among themselves, their expressions a mix of concern and suspicion. Eleanor could sense the growing unease in the room, the air thick with unspoken accusations. She needed to steer the conversation towards clarity without revealing her own suspicions. "We must clarify the events of the evening," she urged, her tone firm. "Identifying who was where and when is essential for understanding how this tragedy unfolded. Every detail is crucial to our investigation."

The guests nodded, some exchanging wary glances, while others appeared lost in thought. Eleanor felt a flicker of hope amidst the tension. Perhaps, together, they could unravel the truth behind Dr. Finch's death. Yet, a nagging doubt lingered in his mind. Trust was a fragile thing, easily shattered in the face of suspicion. As the rain continued to fall outside, Eleanor steeled herself for the difficult conversations that lay ahead, determined to uncover the web of deception that had led to this moment.
--- END PRIOR CHAPTER 3 ---

[SCENE COMPLETENESS CONTRACTS — MANDATORY. Each contract below lists what you MUST enact in that chapter. Do not summarise or mention these labels in the prose — enact them organically.]
Chapter 4 (Act 2) completeness contract:
  PIVOT ELEMENT (MANDATORY — write this into the prose, shown not told): "Beatrice's fidgeting hands as she recalls the evening."
  FACT ESTABLISHED (MANDATORY — reader must know this by chapter end): "Reveals tampering marks on the clock casing, suggesting recent adjustment."

# Case Overview
Title: The Clock of Deceit
Era: 1930s
Setting: Little Middleton
Crime: murder (premeditated)
Culprit: Beatrice Quill
False assumption: Dr. Mallory Finch was killed later than he actually was, allowing Beatrice Quill to establish her alibi.
Cast: Eleanor Voss (she/her), Dr. Mallory Finch (he/him), Captain Ivor Hale (he/him), Beatrice Quill (she/her)

Setting Lock: Keep all scenes and descriptions consistent with the stated setting (Little Middleton). Do not introduce a different location type.

Outline scenes:
[
  {
    "sceneNumber": 4,
    "act": 2,
    "title": "Interrogation of Beatrice",
    "setting": {
      "location": "the drawing room, now more subdued",
      "timeOfDay": "Afternoon",
      "atmosphere": "Tense as suspicions rise"
    },
    "characters": [
      "Eleanor Voss",
      "Beatrice Quill"
    ],
    "purpose": "Eleanor interrogates Beatrice about her alibi",
    "cluesRevealed": [
      "clue_5",
      "clue_culprit_direct_beatrice_quill"
    ],
    "dramaticElements": {
      "conflict": "Eleanor's probing questions create tension",
      "tension": "Beatrice's nervousness raises suspicion",
      "microMomentBeats": [
        "Beatrice fidgets with her necklace, avoiding Eleanor's gaze."
      ]
    },
    "summary": "Eleanor questions Beatrice about her whereabouts during the murder. Beatrice's nervous demeanor and evasive answers lead Eleanor to suspect her involvement, especially when she stumbles over her timeline.",
    "estimatedWordCount": 1800,
    "pivotElement": "Beatrice's fidgeting hands as she recalls the evening.",
    "factEstablished": "Reveals tampering marks on the clock casing, suggesting recent adjustment.",
    "permittedBehavioursByAct": [
      {
        "characterName": "Eleanor Voss",
        "behaviour": "unease and mild defensiveness when questioned"
      },
      {
        "characterName": "Beatrice Quill",
        "behaviour": "unease; one behavioral tell permitted"
      }
    ],
    "redHerringPlacement": null,
    "emotionalRegister": "The discovery of the clock's tampering shifts the investigation's direction and raises questions about trust.",
    "dominantCharacterNote": {
      "name": "Eleanor Voss",
      "voiceRegister": "Eleanor speaks with a refined cadence, her words often laced with clever observations that reflect her sharp intellect and social savvy."
    },
    "humourGuidance": {
      "permission": "conditional",
      "character": "Eleanor Voss",
      "form": "dry_wit"
    },
    "eraTextureNote": "Limited communication methods, relying on telegrams and letters; Travel restricted by the poor condition of country roads; Class-based mobility restrictions, with the upper class rarely mingling with the lower classes",
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
