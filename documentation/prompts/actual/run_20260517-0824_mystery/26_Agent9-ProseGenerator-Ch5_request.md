# Actual Prompt Record

- Run ID: `mystery-1779006244131`
- Project ID: ``
- Timestamp: `2026-05-17T08:29:22.697Z`
- Agent: `Agent9-ProseGenerator-Ch5`
- Operation: `chat_request_full_prompt`
- Model: `GPT-4o-mini`
- Temperature: `0.42`
- Max Tokens: `4500`
- Attempt: `first`
- Prompt Hash: `f314a24f5cc06989`

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
- MORAL COMPLEXITY REQUIREMENT: The mechanism of this crime carries a moral gray area: "The murderer acted out of desperation, feeling trapped by societal expectations and family obligations." — the culprit reveal and denouement MUST acknowledge this ambiguity. Do not let the ending feel clean or simple. Give the reader at least one moment of uncomfortable sympathy or moral doubt.


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

## Era: 1939-04
In April 1939, the world feels charged with tension as Europe teeters on the brink of war. The recent Easter celebrations linger in memory, yet the economic shadows of the Great Depression continue to loom large. In Little Middleton, the air is thick with the scent of damp earth and blooming flowers, but beneath this beauty lies a society grappling with class divisions and the pressures of impending conflict. Households engage in spring cleaning and prepare for May Day festivities, while conversations shift from pleasantries to the growing threat of fascism and civil rights concerns. The desire for upward mobility remains strong, yet the specter of financial ruin haunts many, forcing them to navigate a precarious social landscape.
Emotional register: A pervasive sense of anxiety and uncertainty grips society as individuals navigate the complexities of class and impending conflict.
Physical constraints: Limited communication due to the lack of modern technology | Travel hampered by economic conditions and petrol shortages | Social gatherings tightly regulated by class expectations
Current tensions (weave into background texture): Germany's aggressive expansion into Czechoslovakia | Debates in UK Parliament about defense spending | Rising fascism causing anxiety in British society
Wartime context — Many men are preparing to serve as tensions rise across Europe.: Communities are torn between duty and the desire for stability, with women increasingly stepping into roles traditionally held by men. Absence effect: The specter of absent fathers and brothers casts a long shadow over families, heightening tension and fear.

## Story Theme
The pursuit of wealth and status can lead to moral decay and betrayal, revealing the dark undercurrents beneath a facade of respectability, and reveals that evidence carries ethical weight, forcing characters to choose accountability over social performance when appearances and facts collide.

## Story Emotional Register
Dominant: A gradual descent into intrigue and moral ambiguity, culminating in a confrontation that exposes the characters' true natures.

Arc:
The story begins in the grand but unsettling atmosphere of Little Middleton Manor, where the stormy night mirrors the emotional turmoil of its occupants. Eleanor Voss's murder shatters the evening's facade, casting an immediate pall over the gathering and setting the stage for a tense investigation. As Beatrice Quill delves into the lives of the suspects, initial clues arise, but false leads complicate her pursuit of the truth, each revelation exacting an emotional toll on her and the others involved. The weight of their secrets, coupled with the mounting tension, creates an environment ripe for betrayal and deceit. Midway through, a critical pivot occurs when Beatrice discovers a note that alters the direction of her investigation, pointing to premeditated motives and deepening the emotional stakes for everyone involved. As the investigation unfolds, the pressure escalates, leading to a climactic confrontation where the true nature of friendship, jealousy, and ambition is laid bare. The resolution comes at a high emotional cost, as each character faces the consequences of their actions, leaving them forever changed in the wake of the tragedy.

The story opens: An atmosphere of opulence tinged with unease sets the stage for impending tragedy. As the investigation takes shape: The investigation begins, revealing a web of lies and suspicion that raises the stakes. A first key turn arrives: Initial clues complicate the investigation, leading to emotional strain among the suspects. At the mid-point of the story: A crucial discovery shifts the focus of the investigation, deepening the narrative's complexity.

A second pivot reshapes the course: Pressure mounts as motives are revealed, forcing characters to confront their pasts. As tension reaches its height: Tension crescendos as the truth hangs in the balance, awaiting revelation. The climax brings the central question to a head: A dramatic confrontation exposes the characters' true natures and hidden agendas. In the final resolution: The emotional fallout leaves the characters irrevocably changed, with haunting memories of betrayal.

Underpinning every turn is the story's central concern: The pursuit of wealth and status can lead to moral decay and betrayal, revealing the dark undercurrents beneath a facade of respectability. This thread binds the individual emotional moments into a coherent journey.

The dominant register — A gradual descent into intrigue and moral ambiguity, culminating in a confrontation that exposes the characters' true natures. — colours the prose from first chapter to last, ensuring the reader feels the weight of each revelation as moral consequence rather than mere puzzle mechanics.

## Emotional register at this point in the story
A crucial discovery shifts the focus of the investigation, deepening the narrative's complexity.

## Character Portraits (appearance & era)

### Dr. Mallory Finch
Dr. Mallory Finch embodies the struggle between professional integrity and personal desperation, navigating the tensions of a society on the brink of war. While she presents a facade of compassion and dedication, the weight of her unethical choices threatens to unravel her carefully constructed life. The economic strains of the Great Depression push her towards morally questionable practices, reflecting the challenges faced by many in her profession during this period.
Era intersection: Her predicament highlights the ethical dilemmas faced by professionals in a society grappling with economic hardship and rising tensions.

### Captain Ivor Hale
Captain Ivor Hale, a man haunted by the ghosts of his past, finds himself at a crossroads in a society grappling with deep class divisions. Once a respected naval officer, he now faces the harsh consequences of gambling debts and blackmail. The looming threat of war adds to his internal conflict, as he struggles to reclaim his dignity while navigating the expectations of masculinity in a time of crisis.
Era intersection: His story illustrates the personal battles faced by many men of his generation as they confront their failures amid societal expectations.

### Beatrice Quill
Beatrice Quill stands at the intersection of ambition and integrity, as she pursues her journalistic dreams in a world rife with scandal. Her struggles with financial instability reflect the harsh realities of the Great Depression, while her desire to expose the truth speaks to a larger societal yearning for accountability and justice. As she navigates the moral complexities of her profession, she embodies the challenges faced by women striving for success in the 1930s.
Era intersection: Her story captures the evolving role of women in society, as they seek to assert their independence and challenge traditional norms.

## Character Voices

### Dr. Mallory Finch (she/her/her)
Dr. Mallory speaks with precision, her tone often measured and authoritative, yet occasionally tinged with irony.
[comfortable] Medicine is as much about art as it is about science, wouldn't you agree?
[evasive] I have no idea what you're implying; I adhere to the highest ethical standards.
[stressed] This cannot be happening. I worked too hard for my reputation to be tarnished!
Humour: Her dry wit often serves as a coping mechanism in high-pressure situations.

### Captain Ivor Hale (he/him/his)
Ivor's voice carries a gravelly timbre, filled with nostalgia and a hint of self-deprecation that reflects his struggles.
[comfortable] Ah, the sea was my true home; nothing quite like the thrill of adventure.
[evasive] I wouldn't recall the details; my memory isn't what it used to be.
[stressed] I'm not some criminal! I've made mistakes, but this—this is too much!
Humour: His self-deprecating humor often lightens the mood during tense moments.

### Beatrice Quill (she/her/her)
Beatrice's voice is quick and animated, filled with enthusiasm and a touch of sarcasm that reflects her journalistic spirit.
[comfortable] You wouldn't believe the stories I could tell; this town is full of surprises!
[evasive] I have no idea what you're talking about; I'm just a reporter doing my job.
[stressed] I can't afford to lose this opportunity; it's everything I've worked for!
Humour: Her sardonic humor often emerges when discussing the absurdities of her profession.

## Location Registers (scene framing guides)

Library: The library feels like a sanctuary of secrets, where the weight of knowledge mingles with the tension of unspoken truths. Shadows cling to the walls, casting doubt on the intentions of those who enter. As dust motes dance in the filtered light, an air of foreboding settles, hinting that not all is as it seems within these walls.. Camera angle: A writer entering this space should feel the oppressive weight of history and the danger of hidden truths lurking in the shadows.. Era: In the 1930s, this location represents a space where knowledge is both a refuge and a potential trap.

## Humour guidance for this story position (mid)
Permission: permitted
Characters who may be funny: Beatrice Quill
Permitted forms: sardonic
Rationale: The investigator's observations can provide a humorous contrast to the tension.

## Character Pressure
Captain Ivor Hale is approaching a point of breakdown. Stress and strain should be accumulating visibly — through behaviour, not statement. No confrontation yet.

## Reveal Groundwork (texture — do not explain, only plant)
- Plant one subtle observable beat related to: "The initial discovery of Eleanor’s body complicates the characters' relationships, revealing long-held resentments". Do not explain significance yet.
- Plant one subtle observable beat related to: "Beatrice’s first interview with Dr". Do not explain significance yet.
- Plant one subtle observable beat related to: "Mallory Finch showcases the tension between them, hinting at deeper issues". Do not explain significance yet.

FAIR-PLAY AND INFERENCE CONTRACT (from CML logic):
- False assumption in force: The murder occurred after the clock showed ten minutes past eleven.
- Hidden truth to progressively expose: The actual time of death was much earlier, manipulated by the clock's tampering.
- Inference path checkpoints to dramatize clearly (observation -> correction -> effect):
  - Step 1: obs: The clock in the library was found showing ten minutes past eleven. | corr: This indicates that the clock was tampered with to mislead the timeline. | effect: Narrows suspicion to those who had access to the library.
  - Step 2: obs: Witnesses heard the clock strike the hour at a different time. | corr: This suggests the clock was altered to misrepresent the time of death. | effect: Eliminates the possibility of Eleanor being alive when the clock showed the time.
  - Step 3: obs: A note hinting at a scheduled meeting was found near the clock. | corr: The note indicates a planned confrontation that aligns with the tampering. | effect: Narrows suspicion specifically to Dr. Mallory Finch due to her motive.
- Discriminating test method: trap
- Discriminating test design constraint: A controlled comparison is staged where the clock's mechanism is examined against the time reported by witnesses, revealing its tampering.
- Test must rely on already-shown clue IDs: clue_1, clue_2, clue_3, clue_12, clue_6, clue_7
- Fair-play rationale: Step 1: The clock's time (early) and witness statements (mid) show conflicting evidence. Step 2: The note found (mid) ties Dr. Mallory to the timeline manipulation. Step 3: The controlled clock comparison (discriminating test) confirms the tampering.
- Never solve by withheld information. Keep reader-information parity with detective reasoning.

## Character Reference

### Dr. Mallory Finch (she/her — NEVER he/him)
Mallory's speech is measured and precise, often punctuated by medical terminology
She has a tendency to employ irony in her humor, particularly when discussing the absurdities of life, though she rarely allows it to overshadow her professional demeanor.
Mallory is torn between her dedication to her patients and the guilt that gnaws at her conscience for compromising her ethics. She fears that her ambition may lead to her downfall.

### Captain Ivor Hale (he/him — NEVER she/her)
Ivor’s speech is marked by a gravelly timbre, often punctuated with dry humor
He tends to speak in anecdotes, often trailing off mid-story, reflecting both his pride and the weight of his failures.
Ivor is haunted by his past decisions, caught between the pride of his service and the shame of his current reality. He fears that his failures will define him forever.

### Beatrice Quill (she/her — NEVER he/him)
Beatrice often speaks in a rapid-fire manner, her words tumbling out in excitement or frustration
She has a penchant for sarcasm, particularly when discussing the absurdities of her profession, and often punctuates her sentences with a quick laugh.
Beatrice struggles with her desire for success and the ethical dilemmas that arise from her questionable practices. She fears that her ambition may lead her down a path of no return.


## CHARACTER CONTRACTS (binding for this scene)
Each entry below constrains how this character must be written in this chapter.
These override generic style guidance when they conflict.

### Dr. Mallory Finch[SHE]
Voice & mannerisms: Mallory's speech is measured and precise, often punctuated by medical terminology. She has a tendency to employ irony in her humor, particularly when discussing the absurdities of life, though she rarely allows it to overshadow her professional demeanor.
Sample voice fragments (match this register and rhythm):
  [comfortable] "Medicine is as much about art as it is about science, wouldn't you agree?"
  [evasive] "I have no idea what you're implying; I adhere to the highest ethical standards."
Humour: dry wit — deploy occasionally (level 0.4)
FORBIDDEN phrase (never write for Dr. Mallory Finch): "a surge of determination washed over her"
Act 2 behaviour contract: May show unease, evasion, or mild defensiveness when questioned. One behavioural tell is permitted. Internal conflict emerging: "Mallory is torn between her dedication to her patients and the guilt that gnaws at her conscience for compromising her ethics. She fears that her ambition may lead to her downfall."

### Captain Ivor Hale[HE]
Voice & mannerisms: Ivor’s speech is marked by a gravelly timbre, often punctuated with dry humor. He tends to speak in anecdotes, often trailing off mid-story, reflecting both his pride and the weight of his failures.
Sample voice fragments (match this register and rhythm):
  [comfortable] "Ah, the sea was my true home; nothing quite like the thrill of adventure."
  [evasive] "I wouldn't recall the details; my memory isn't what it used to be."
Humour: self deprecating — deploy occasionally (level 0.5)
FORBIDDEN phrase (never write for Captain Ivor Hale): "she knew with certainty she was right"
Act 2 behaviour contract: May show unease, evasion, or mild defensiveness when questioned. One behavioural tell is permitted. Internal conflict emerging: "Ivor is haunted by his past decisions, caught between the pride of his service and the shame of his current reality. He fears that his failures will define him forever."

### Beatrice Quill[SHE]
Voice & mannerisms: Beatrice often speaks in a rapid-fire manner, her words tumbling out in excitement or frustration. She has a penchant for sarcasm, particularly when discussing the absurdities of her profession, and often punctuates her sentences with a quick laugh.
Sample voice fragments (match this register and rhythm):
  [comfortable] "You wouldn't believe the stories I could tell; this town is full of surprises!"
  [evasive] "I have no idea what you're talking about; I'm just a reporter doing my job."
Humour: sardonic — deploy occasionally (level 0.5)
FORBIDDEN phrase (never write for Beatrice Quill): "palpable tension filled the room"
Act 2 behaviour contract: May show unease, evasion, or mild defensiveness when questioned. One behavioural tell is permitted. Internal conflict emerging: "Beatrice struggles with her desire for success and the ethical dilemmas that arise from her questionable practices. She fears that her ambition may lead her down a path of no return."



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
A sprawling estate shrouded in mystery, where opulence meets an air of unease.

Key Locations Available:
- Drawing Room (interior): Gathering space
- Library (interior): Clue discovery
- Cellar (interior): Crime scene
- Gardens (exterior): Hiding spots and clue discovery

Atmosphere: Tense, with an undercurrent of suspicion and unease among the inhabitants.
Weather: Overcast with occasional rain, typical for early spring.

Era markers: Petrol touring cars parked near the entrance | Typewriters clicking in the study | Telegram delivery via the estate's post office

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
  - Visual: Flickering candlelight on polished surfaces, Richly upholstered furniture in deep hues, Framed portraits watching silently from the walls
  - Sounds: Crackling fire in the hearth, Muted conversations and laughter, The distant ticking of an ornate clock
  - Scents: Beeswax and tallow from the candles, Wood smoke from the fireplace, A hint of lavender from the potpourri
  - Touch: Soft velvet cushions, Cool marble of the fireplace surround

Library (interior):
  - Visual: Dust motes dancing in the sunlight, Leather-bound books with gilded spines, A large globe in the corner
  - Sounds: Pages turning in silence, The creak of the desk chair, Distant raindrops against the window
  - Scents: Old leather and parchment, The mustiness of forgotten knowledge, A hint of polished wood
  - Touch: Worn leather armchair, Smooth surface of the oak desk

Cellar (interior):
  - Visual: Shadows lurking in the corners, Flickering light casting eerie shapes, Bottles covered in cobwebs
  - Sounds: Dripping water echoing in the silence, The creak of old wood underfoot, A distant rumble of thunder
  - Scents: Musty dampness of stone, A hint of aged wine, Cold metal and earth
  - Touch: Cold stone walls, Rough wooden beams overhead

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

- In April 1939, the world feels charged with tension as Europe teeters on the brink of war
- The recent Easter celebrations linger in memory, yet the economic shadows of the Great Depression continue to loom large
- In Little Middleton, the air is thick with the scent of damp earth and blooming flowers, but beneath this beauty lies a society grappling with class divisions and the pressures of impending conflict
- Households engage in spring cleaning and prepare for May Day festivities, while conversations shift from pleasantries to the growing threat of fascism and civil rights concerns
- The desire for upward mobility remains strong, yet the specter of financial ruin haunts many, forcing them to navigate a precarious social landscape.

TEMPORAL CONTEXT:

This story takes place in April 1939 during spring.

Seasonal Atmosphere:
- Weather patterns: overcast skies, occasional rain showers, cool breezes
- Daylight: Days gradually lengthening, with sunlight breaking through clouds occasionally, creating a play of light and shadow.
- Seasonal activities: spring cleaning in households, preparation for May Day festivities, planting vegetable gardens
- Seasonal occasions: Easter Sunday (April 9)
- Season: spring

Period Fashion (describe naturally):
- Men formal: double-breasted navy suit, white dress shirt, silk tie with geometric patterns
- Men casual: tweed jacket, fitted trousers, knitted pullover
- Men accessories: fedora hat, pocket watch, leather gloves
- Women formal: tea-length dress with floral prints, tailored blazer, periwinkle-colored silk blouse
- Women casual: lightweight cardigan, high-waisted skirt, flared trousers
- Women accessories: cloche hat, string of pearls, canvas handbag

Cultural Context (reference naturally):
- Music/entertainment: Glenn Miller's swing music, Billie Holiday's jazz ballads, Duke Ellington's big band tunes; Films: The Wizard of Oz, Gone with the Wind; Theatre: The Glass Menagerie, The Front Page; Radio: The Shadow, Gunsmoke
- Typical prices: Loaf of bread: four pence, Cinema ticket: one shilling, Men's suit: three pounds
- Current events: Germany’s aggressive expansion into Czechoslovakia; increased tensions in Europe as war looms closer
- Literature: The Grapes of Wrath by John Steinbeck | The Maltese Falcon by Dashiell Hammett | The Old Man and the Sea by Ernest Hemingway | [detective fiction] | [social realism] | [historical novels]
- Technology: the ballpoint pen | the first commercial jet engine designs | the widespread use of household electrical appliances | typewriters in offices | radios in homes | petrol-powered vehicles
- Daily life: afternoon tea with friends, going for walks in the park, visiting local markets
- Social rituals: Sunday family dinners, attending church services, participating in community events

Atmospheric Details:
The air is filled with the damp scent of earth and the distant promise of blooming flowers, punctuated by the faint smell of wood smoke from nearby chimneys. Occasional raindrops patter against windows, creating a rhythmic backdrop that amplifies the tension within the estate, as shadows play tricks on the eye. The flickering candlelight casts dancing shadows in the corners of the room, where whispered conversations hint at secrets better left unspoken.

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
- Authentic references: Use actual songs, films, events from
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

• [clue_4] This indicates that the clock was tampered with to mislead the timeline.
  Category: temporal | Criticality: essential | Supports inference step 2
  Points to: This contradicts the assumption that the clock was accurate.

• [clue_5] Dr. Mallory Finch was seen acting nervously around the time of the murder.
  Category: behavioral | Criticality: essential | Supports inference step 2
  Points to: This behavior raises suspicion about Dr. Mallory Finch.

• [clue_culprit_direct_dr_mallory_finch] Direct evidence ties Dr. Mallory Finch to the mechanism access point before the discriminating test.
  Category: temporal | Criticality: essential | Supports inference step 2
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

CLUES ALREADY REVEALED TO READER: clue_1, clue_2, clue_6, clue_fp_contradiction_step_1, clue_3, clue_core_contradiction_chain, clue_10 — do not reveal these as new information.

INVESTIGATION LOG — WHAT IS ESTABLISHED (do not re-establish, do not repeat):
• Evidence in reader's hands: The clock in the library was found showing ten minutes past eleven. | Witnesses heard the clock strike the hour at a different time. | The mechanical clock was wound back forty minutes, creating a false timeline. | The clock in the library was found showing ten minutes past eleven. | A note hinting at a scheduled meeting was found near the clock. | This suggests the clock was altered to misrepresent the time of death. | Dr. Mallory Finch had a financial motive for Eleanor's death.
• Suspects still unresolved: Eleanor Voss[SHE], Captain Ivor Hale[HE], Beatrice Quill[SHE]
⚠ The story must move FORWARD from this log. Any beat already listed above is forbidden from repeating.

⚠ THIS CHAPTER'S REQUIRED ADVANCE (mid): Test one suspect's alibi against a known fact — result must be stated

CONTINUITY HANDOFF — previous chapter closing beat:
  • "With renewed resolve, Beatrice turned to Eleanor and Mallory, her voice steady. ‘We need to interrogate everyone who was in the house last night. Every detail matters, and we can't afford to overlook anything.’ The gravity of her words hung in the air, and Bea..."
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
library, drawing room

✓ RULE: Continue using this location vocabulary. Maintain consistency with established setting type.
✓ Do NOT introduce new location types that contradict earlier chapters.

**Recent Chapter Summary (for narrative continuity):**
Chapter 2: Chapter 2: Witness Testimonies
  Events: ‘We need to find out who had access to it,’ Dr.
Chapter 3: Chapter 3: The Clock's Secret
  Events: The morning wore on, the rain still drumming against the library windows, a relentless reminder of the chaos that had unfolded within these walls.
Chapter 4: Chapter 4: A Note of Intent
  Events: The steady patter of rain against the library windows filled the air with a somber rhythm, echoing the tension that lingered in the room.

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
Known location profile anchors: Little Middleton Manor, Drawing Room, Library, Cellar, Gardens, the dining room
LOCATION NAME CAPITALISATION (HARD REQUIREMENT — validated):
All named locations in your prose MUST use the EXACT capitalisation from the CML profiles.
Canonical forms: "Little Middleton Manor", "Drawing Room", "Library", "Cellar", "Gardens", "the dining room"
Writing a location in lowercase (e.g. "drawing room" instead of "Drawing Room") is a validated error. Every time you mention a named location, copy its capitalisation from the list above.
- Chapter 5: OPENING STYLE (HARD): Start the VERY FIRST SENTENCE with a temporal subordinate clause — e.g. "When [Name] entered…" / "After the last guest…" / "Before the household had stirred…" / "As the light faded…". Anchor opening in "the dining room". HARD REQUIREMENT for the first 2 paragraphs: (a) include 2+ sensory words — choose from smell/scent/sound/echo/silence/creak/whisper/cold/warm/damp/rough/smooth/glow/shadow/flicker/dim — and (b) include 1+ atmosphere/time word — choose from rain/wind/fog/storm/mist/thunder/evening/morning/night/dawn/dusk/season/afternoon/midday/noon/midnight/twilight/sunrise/sunset/daylight/sunlight/overcast/cloudy/bright/dark. These are validated requirements, not style suggestions; missing them triggers a retry.

[⚠ INTERNAL QUALITY DIAGNOSTICS — DO NOT REPRODUCE ANY PART OF THIS SECTION IN YOUR STORY OUTPUT. These are private generator observations for your consideration only. Your narrative must read as if this section does not exist. Never include phrases from this block in character dialogue, narration, or description.]

PRIOR CHAPTER QUALITY OBSERVATIONS:
- Chapter 3 (score 97/100):
  Quality gaps noted: word density below preferred target (961/1000); scene grounding weakness
  Address in upcoming chapters: Increase chapter density with concrete investigation action and sensory-grounded beats; avoid recap-only padding. | Open next chapter with a named location anchor plus at least two sensory cues and one atmosphere marker.
- Chapter 4 (score 98/100):
  Quality gaps noted: scene grounding weakness
  Address in upcoming chapters: Open next chapter with a named location anchor plus at least two sensory cues and one atmosphere marker.
- Phrases to avoid (already overused in earlier chapters): "her voice steady despite the tremor in", "voice steady despite the tremor in her", "steady despite the tremor in her hands", "need to find out who had access", "the weight of their shared secrets pressing", "weight of their shared secrets pressing down", "of their shared secrets pressing down on", "their shared secrets pressing down on them".
[END INTERNAL DIAGNOSTICS]

PROMPT BUDGET SUMMARY: budget=32000 tokens; fixed=10833; context=11041; dropped=[none]; truncated=[pronoun_accuracy, temporal_context]

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
8. Integrate at least two concrete era-grounded details per chapter from setting refinement signals: petrol touring cars on county roads | domestic wiring with frequent outages | typewriters standard in offices | party-line telephone exchanges common | telegrams sent via local post offices | airmail services for urgent correspondence.
9. Respect setting movement/access constraints in scene action and alibis: manor layout includes restricted areas such as the library and cellar | gardens provide natural barriers and hiding spots | weather can impact outdoor evidence collection | gates controlled by estate staff | restricted access to certain areas for non-family members.
10. Sustain social coherence with this backdrop pressure: A family gathering for a contentious estate division amidst the economic strains of the Great Depression forces heirs and staff to confront their hidden animosities under the watchful eye of a ticking clock.
11. Maintain continuity around these socially central cast anchors where relevant: Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill.
12. STORY TO DATE ANTI-COPY RULE: The STORY TO DATE section below is provided for chronological and factual reference ONLY. You MUST NOT copy, lightly rephrase, or structurally echo any sentence or paragraph from prior chapters. Every sentence in this chapter must be original prose unique to this scene. Reusing even a clause from prior chapter text will cause this attempt to fail immediately.

CRITICAL PROSE REQUIREMENTS:

The CML specifies exact requirements for certain validation-critical scenes. You MUST include these elements at the specified positions.

**Discriminating Test Scene (Act 3, Scene 4):**
Required elements: Execute the discriminating test, Observe the culprit's reaction or result, Draw conclusion about guilt

**Suspect Clearance Scenes:**
- Eleanor Voss (Act 3, Scene 5): Eleanor is confirmed as the victim.
  Clues: clue_id_1, clue_id_2
- Captain Ivor Hale (Act 3, Scene 5): Hale's alibi is verified during the time of the murder.
  Clues: clue_id_3, clue_id_4

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
- Chapter 5:
  - STRUCTURAL ARCHETYPE — Chapter 5 must be: RED_HERRING
      ✓ MUST contain: wrong lead followed and disproved
      ✗ MUST NOT contain: final culprit identified
  - Word count: Target 1250 words. Achieve this through plot events, dialogue exchanges, and physical investigation — not through atmospheric repetition or extended internal reflection. Each 200-word segment should contain at minimum one concrete story event (a discovery, a conversation exchange, a physical action or movement). Padding with atmosphere alone is not acceptable.
  - Opening: Begin with a character action, spoken line, or clock/time marker — never a location name or location-description phrase.
  - Scene is set in: the dining room — reference it naturally within the paragraph, never as your opening phrase.
  - Opening atmosphere (MANDATORY — validator enforced): the first paragraph MUST contain at least one of: rain / wind / fog / storm / mist / thunder / evening / morning / night / dawn / dusk / season / afternoon / midday / noon / midnight / twilight / sunrise / sunset / daylight / sunlight / overcast / cloudy / bright / dark. A chapter that omits all of these from its opening paragraph will be rejected.
  - Continuity bridge: in the first 120 words, visibly connect from the previous chapter's final beat. Carry forward one unresolved element (object, accusation, emotional pressure, or immediate physical action) from: "With renewed resolve, Beatrice turned to Eleanor and Mallory, her voice steady. ‘We need to interrogate everyone who was in the house last night. Every detail matters, and we can't afford to overlook anything.’ The gravi...".
  - CLUE OBLIGATIONS — mandatory prose elements (do NOT omit or bury):
    • This indicates that the clock was tampered with to mislead the timeline. [clue_4]
      Points to: This contradicts the assumption that the clock was accurate.
    • Dr. Mallory Finch was seen acting nervously around the time of the murder. [clue_5]
      Points to: This behavior raises suspicion about Dr. Mallory Finch.
    • Direct evidence ties Dr. Mallory Finch to the mechanism access point before the discriminating test. [clue_culprit_direct_dr_mallory_finch]
      Points to: This direct evidence shows Dr. Mallory Finch had means and opportunity, narrowing the solution uniquely toward the culprit.
  - Tonal contrast: include at least one beat of relief or ironic counterpoint. Do not sustain maximum tension for every paragraph.
- Locked fact phrase obligations:
  - If this batch mentions The exact time shown on the stopped clock face, write exactly: "ten minutes past eleven".
  - If this batch mentions The exact amount the clock was wound back, write exactly: "forty minutes".
- Seasonal vocabulary allow-list: spring, vernal, springtime.
- Forbidden seasonal words: summer, autumn, winter.

FROZEN TIMELINE STATE (DO NOT ALTER):
- Timeline anchor: April (spring).
- Month, season, weather, and time-of-year language in this batch must stay compatible with spring.
- Established timeline fact: The clock showing ten minutes past eleven
- Established timeline fact: Witness accounts of Eleanor's last seen time
- If referenced, use exact time phrase: "ten minutes past eleven" (The exact time shown on the stopped clock face).
- If referenced, use exact time phrase: "forty minutes" (The exact amount the clock was wound back).

STORY TO DATE (REFERENCE ONLY — DO NOT COPY VERBATIM):
- Full prior chapter text is provided below for continuity, factual consistency, and reference accuracy.
- Use this to keep character voice, chronology, clue state, and location continuity aligned with earlier chapters.
- Do not quote, copy, or paraphrase these paragraphs too closely; write fresh prose that remains consistent with them.

--- BEGIN PRIOR CHAPTER 1 ---
Title: Chapter 1: The Clock Strikes
The morning light struggled to penetrate the overcast skies, casting a dim glow through the library's tall windows. Beatrice Quill stepped into the room, her heart racing as she took in the scene before her. The air was heavy with the scent of damp wood and freshly fallen rain, a stark contrast to the opulence that surrounded her. The flickering candlelight danced nervously against the polished surfaces, revealing the chaos that had unfolded. In the center of the room lay Eleanor Voss, her lifeless form sprawled across the ornate carpet, a pool of crimson seeping into the fibers beneath her. Beatrice's breath caught in her throat; the sight was both shocking and surreal. A clock on the wall caught her attention, its hands frozen in time, displaying the ominous hour of ten minutes past eleven.

Beatrice approached the clock, her gaze fixed on its still face. The hands, unmoving, seemed to mock the gravity of the situation. 'Ten minutes past eleven,' she murmured, the words barely escaping her lips. This was no ordinary death; this was a murder, and the clock was a witness. It established a timeline for the events that had transpired, one that would surely contradict the alibis of those present. As she turned to examine the room further, Beatrice recalled the whispers of the household staff, who had claimed to hear the clock strike the hour at a different time altogether. The implications of this discrepancy gnawed at her. If the clock had been tampered with, it could lead to a web of deceit that ensnared everyone in the room.

The tension in the library was palpable as Eleanor's closest acquaintances gathered around, their faces pale with shock and disbelief. Dr. Finch stood to one side, her hands trembling slightly as she clutched her medical bag. 'I can't believe this is happening,' she whispered, her voice barely audible over the steady patter of rain against the window. Captain Hale, his brow furrowed in concern, paced the room like a caged animal. 'We must find out who did this,' he asserted, his voice steady but laced with an undercurrent of fear. Beatrice observed them closely, noting the way they avoided each other's gazes, the unspoken accusations hanging heavy in the air.

Eleanor had always been the center of their social circle, a woman whose charm and ambition drew others in like moths to a flame. But now, as they stood around her lifeless body, the façade of camaraderie began to crack. Beatrice could sense the underlying tensions that had long simmered beneath the surface. Just the night before, she had overheard Eleanor arguing with Captain Hale about a matter of great importance. The memory of their heated exchange lingered in her mind, a potential motive hidden in plain sight. 'What were you two fighting about?' Beatrice asked, her voice cutting through the silence. Ivor's eyes darted to Mallory, who shifted uncomfortably, her expression unreadable.

The clock's relentless ticking echoed in Beatrice's ears as she considered the implications of their conversation. If Eleanor had been arguing with Hale, it could suggest a deeper conflict. But what could have driven them to such a confrontation? Beatrice's instincts as a journalist kicked in, her mind racing with possibilities. She needed to gather the facts, to piece together the puzzle that lay before her. 'We need to speak to everyone who was here last night,' she declared, her tone firm. 'Every detail matters.' The others nodded in agreement, their expressions a mixture of fear and determination. They were all trapped in this web of suspicion, and the only way out was to uncover the truth.

As the rain continued to spring outside, Beatrice felt a sense of urgency wash over her. Time was of the essence, and with each passing moment, the trail to the truth grew colder. She glanced back at Eleanor, her heart heavy with the weight of the tragedy that had unfolded. The woman who had once been the life of the party now lay motionless, her dreams extinguished. Beatrice steeled herself; she would not let Eleanor's death be in vain. With a deep breath, she turned to the others, ready to begin the investigation. 'Let’s start with the clock,' she said, her voice steady. 'We need to understand what happened here.'

The group moved closer to the clock, its face a silent witness to the events that had transpired. Beatrice examined it closely, noting the dust that had settled around its base, untouched by anyone's hand. 'It seems to have been wound back,' she remarked, her brow furrowing in concentration. 'If it was set to show ten minutes past eleven, it must have been tampered with. But why?' The others exchanged glances, their expressions a mix of confusion and concern. The implications were staggering. If someone had altered the clock, it suggested a premeditated act, a deliberate attempt to mislead.

Dr. Finch stepped forward, her voice steady despite the tremor in her hands. 'If the clock was tampered with, it raises questions about the reliability of our timelines. We need to find out who had access to it.' Beatrice nodded, her mind racing with the possibilities. The clock had become a focal point in the investigation, a key piece of evidence that could unravel the mystery surrounding Eleanor's death. As they stood in the dim light of the library, the weight of the situation pressed heavily upon them. Each of them had secrets, and as they began to unravel the threads of the past, Beatrice knew that the truth would not come easily.
--- END PRIOR CHAPTER 1 ---

--- BEGIN PRIOR CHAPTER 2 ---
Title: Chapter 2: Witness Testimonies
‘We need to find out who had access to it,’ Dr. Finch said, her voice steady despite the tremor in her hands. The rain continued to patter against the library windows, a steady rhythm that echoed the tension in the room. Beatrice Quill took a deep breath, her heart racing as she prepared to gather witness statements. The air was thick with anxiety, and the dim light cast long shadows across the room, creating an atmosphere ripe for secrets. She turned to Eleanor, who stood nearby, her hands trembling slightly as she recalled her last moments with the victim.

‘Eleanor,’ Beatrice began, her tone gentle yet firm, ‘can you tell me about your last interaction with Eleanor Voss?’ The question hung in the air, heavy with unspoken implications. Eleanor's gaze dropped to the floor, the weight of her memories pressing down on her. ‘I... I saw her just before dinner,’ she stammered, her voice barely above a whisper. ‘We had a brief conversation, but I didn’t think much of it at the time.’ Beatrice noted the way Eleanor's fingers twisted the fabric of her dress, a clear sign of her distress. The clock on the wall ticked ominously, reminding them all of the time that had slipped away.

‘Witnesses heard the clock strike the hour at a different time,’ Beatrice pressed, her eyes narrowing as she studied Eleanor's reaction. The implication was clear: if the clock had been tampered with, it could unravel the very fabric of their alibis. Eleanor's face paled, and she glanced nervously at Dr. Finch, who stood silently observing. ‘What do you mean?’ Eleanor asked, her voice trembling. ‘I thought it was ten minutes past eleven when I last checked.’ Beatrice felt a surge of determination; this discrepancy could be the key to understanding the events that led to Eleanor's death.

‘It raises questions about the accuracy of the clock,’ Beatrice replied, her mind racing with the possibilities. If the clock had indeed been altered, it suggested a deliberate attempt to mislead them. Who would go to such lengths? She could feel the tension in the room thickening, each person silently grappling with their own suspicions. Captain Hale, who had been pacing near the fireplace, suddenly stopped and turned to face them. ‘I don’t see how this helps us,’ he said, his voice laced with irritation. ‘We need to focus on finding the murderer, not on a clock.’

Beatrice's eyes narrowed at Hale's defensiveness. ‘But the clock is crucial, Captain. It could provide a timeline for when Eleanor was last seen alive.’ She could sense the unease radiating from her, as if she were hiding something beneath her composed exterior. ‘What were you doing at that time?’ she asked pointedly. Hale hesitated, his brow furrowing as he considered his response. ‘I was in the drawing room, preparing for the evening. I didn’t see his after dinner.’

Eleanor's expression shifted, a flicker of doubt crossing her features. ‘But you were supposed to join us for dessert, weren’t you? Where did you go?’ she challenged, her voice gaining strength. Beatrice noted the shift in dynamics; the room was charged with unspoken accusations, each person grappling with their own fears and secrets. The broken vase near the scene caught Beatrice's eye, a reminder of the struggle that had taken place. It suggested a confrontation, a moment of chaos that could hold the key to unraveling the mystery. ‘What about the vase?’ she asked, her curiosity piqued. ‘It looks like it was knocked over during a struggle.’

Captain Hale's gaze darted to the vase, and for a moment, he seemed taken aback. ‘That’s just a coincidence,’ she replied hastily, but Beatrice could see the flicker of uncertainty in her eyes. The atmosphere in the library grew heavier, the weight of their shared secrets pressing down on them. As Beatrice continued to gather testimonies, she could feel the tension mounting. Each story revealed discrepancies, and with every revelation, the web of suspicion grew tighter. She needed to piece together the fragments of their accounts to uncover the truth, but the path ahead was fraught with uncertainty.
--- END PRIOR CHAPTER 2 ---

--- BEGIN PRIOR CHAPTER 3 ---
Title: Chapter 3: The Clock's Secret
The morning wore on, the rain still drumming against the library windows, a relentless reminder of the chaos that had unfolded within these walls. Beatrice Quill stood before the clock, its face eerily frozen, the time displayed an ominous ten minutes past eleven. Just moments before, Captain Hale's gaze had darted to the vase, and for a fleeting moment, uncertainty flickered in his eyes. ‘That’s just a coincidence,’ Eleanor had replied hastily, but Beatrice could sense the tension that had enveloped them all. With a deep breath, she stepped closer to the clock, the air thick with the scent of damp wood and polished furniture, and reached out to touch its surface. As her fingers brushed against the cold metal, she felt a chill run down her spine. This clock was no mere timepiece; it was a silent witness to a crime that demanded to be unraveled.

Beatrice leaned in, her heart racing as she examined the clock more closely. It was then that she noticed the peculiar way the hands had stopped. ‘It seems to have been wound back,’ she murmured, her brow furrowing in concentration. ‘If it was set to show ten minutes past eleven, it must have been tampered with.’ The implications of this discovery weighed heavily on her, and she felt a surge of determination. If someone had altered the clock, it suggested a premeditated act, a deliberate attempt to mislead them. Who would go to such lengths? The thought sent a shiver through her, igniting her instincts as a journalist. The clock was not merely a timekeeper; it was a key piece of evidence that could unlock the mystery surrounding Eleanor's death.

‘The mechanical clock was wound back forty minutes,’ Beatrice concluded, her voice steady as she turned to face the others. ‘This creates a false timeline for the murder.’ The weight of her words hung in the air, and she could see the realization dawning on Eleanor's face. Dr. Finch, who had been observing silently, stepped forward, her expression a mix of concern and disbelief. ‘If the clock was tampered with, it raises questions about the reliability of our timelines,’ she said, her voice steady despite the tremor in her hands. ‘We need to find out who had access to it.’ Beatrice nodded, her mind racing with the possibilities. The clock had become a focal point in the investigation, a pivotal piece of evidence that could unravel the web of deceit surrounding Eleanor's murder.

‘But what does this mean for us?’ Eleanor interjected, her voice trembling slightly. ‘If someone is willing to tamper with the clock, what else are they capable of?’ Beatrice could see the fear in Eleanor's eyes, a reflection of her own growing unease. The tension in the room was palpable, each person grappling with their own suspicions. The clock had transformed from a mere object into a harbinger of secrets, and Beatrice felt the urgency of their situation pressing down on her. ‘We must speak to everyone who was here last night,’ she declared, her tone firm. ‘Every detail matters. We need to understand the timeline of events leading up to Eleanor's death.’

As they gathered around the clock, Beatrice noticed the dust that had settled around its base, untouched by anyone's hand. It was as if the clock had been deliberately ignored, a silent witness to the chaos that had unfolded. ‘The clock in the library was found showing ten minutes past eleven,’ she reminded them, her voice steady. ‘This establishes a timeline for the murder.’ The implications were staggering. If someone had altered the clock, it suggested a premeditated act, a deliberate attempt to mislead. Who would go to such lengths? Beatrice's mind raced with the possibilities, and she felt a surge of determination. They needed to uncover the truth, no matter the cost.

Dr. Finch's eyes darted to the clock, her expression unreadable. ‘We should consider the possibility that the clock was tampered with after the murder,’ she suggested, her voice measured. ‘If we can determine when it was altered, it may lead us to the person responsible.’ Beatrice nodded, her heart racing at the thought. The clock had become a focal point in the investigation, a key piece of evidence that could unlock the mystery surrounding Eleanor's death. As they stood in the dim light of the library, the weight of the situation pressed heavily upon them. Each of them had secrets, and as they began to unravel the threads of the past, Beatrice knew that the truth would not come easily.

Eleanor's voice broke the silence, her melodic tone tinged with urgency. ‘We need to act quickly. If someone is trying to mislead us, they may be planning to cover their tracks.’ Beatrice could feel the tension in the room thickening, each person silently grappling with their own fears and secrets. The broken vase near the scene caught her eye, a reminder of the struggle that had taken place. It suggested a confrontation, a moment of chaos that could hold the key to unraveling the mystery. ‘What about the vase?’ she asked, her curiosity piqued. ‘It looks like it was knocked over during a struggle.’

Captain Hale's expression shifted, his brows knitting together as he regarded the vase. ‘That’s just a coincidence,’ he replied hastily, but the uncertainty in his tone was unmistakable. Beatrice observed the way the others shifted uneasily, the weight of their shared secrets pressing down on them. Each revelation brought them closer to the truth, yet the path remained obscured by doubt. As Beatrice continued to piece together the fragments of their accounts, she felt the urgency of their situation. They were all entangled in a web of suspicion, and the only way out was to confront the shadows of the past.
--- END PRIOR CHAPTER 3 ---

--- BEGIN PRIOR CHAPTER 4 ---
Title: Chapter 4: A Note of Intent
The steady patter of rain against the library windows filled the air with a somber rhythm, echoing the tension that lingered in the room. Beatrice Quill stood with her heart racing, her eyes fixed on the clock that ominously displayed ten minutes past eleven. Just moments ago, Captain Hale had hastily dismissed the implications of the broken vase, a flicker of uncertainty still haunting his expression. ‘That’s just a coincidence,’ she had insisted, but Beatrice could sense the weight of unspoken truths hanging heavily in the air. She needed to press forward, to unravel the threads of this mystery that had ensnared them all. With a deep breath, she turned her attention back to the clock, determined to find the clues that lay hidden within its confines.

As Beatrice approached the clock, the scent of damp wood mingled with the mustiness of old books, creating an atmosphere thick with secrets. She reached out, her fingers brushing against the cold metal of the clock's face, feeling the weight of its stillness. ‘If this clock has been tampered with, it could change everything,’ she murmured to herself, recalling the earlier conversation about the time discrepancies. The clock was no longer just a timepiece; it had become a crucial piece of evidence in the investigation. The realization sent a shiver down her spine. She needed to find out who had access to it and when it had been altered.

‘What if someone wanted to mislead us?’ Beatrice thought, her mind racing with the possibilities. She stepped back, her gaze sweeping the library, searching for anything that might provide further insight. The rain continued to drum against the windows, a relentless reminder of the chaos that had unfolded within these walls. The tension in the room was palpable as Eleanor Voss stood nearby, her expression a mixture of grief and confusion. Beatrice could see the way Eleanor's hands trembled slightly as she clutched her dress, the fabric wrinkling beneath her grip. ‘We need to talk about what happened last night,’ Beatrice said, her voice steady but firm, breaking the silence that had settled over them.

Eleanor nodded, her melodic voice barely above a whisper. ‘I... I don’t know what more I can say. I already told you everything I remember.’ Beatrice could sense the strain in Eleanor's tone, the weight of her emotions pressing down on her. ‘But we need to consider every detail,’ Beatrice urged, her determination unwavering. ‘What about the argument you had with Captain Hale? Was it about something specific?’ The question hung in the air, heavy with unspoken implications. Eleanor's gaze dropped to the floor, and for a moment, Beatrice thought she might refuse to answer. But then, with a shaky breath, Eleanor spoke.

‘It was about money,’ Eleanor admitted, her voice trembling slightly. ‘I was trying to convince her to invest in a project I believed in, but she was adamant that it was a foolish idea.’ Beatrice noted the way Eleanor's fingers twisted the fabric of her dress, a clear sign of her distress. ‘And you think that might have led to a confrontation?’ Beatrice pressed, her curiosity piqued. Eleanor hesitated, her brow furrowing as she considered her response. ‘I don’t know. We were both frustrated, but I never thought it would come to this.’ The weight of her words hung in the air, and Beatrice felt a surge of determination. They needed to uncover the truth, no matter how painful it might be.

Just then, a glint of paper caught Beatrice's eye. She moved closer to the clock, her heart racing as she noticed a note partially hidden beneath the clock's base. With a quick motion, she reached down and retrieved it, her fingers trembling with anticipation. The note was crumpled and damp from the rain, but the writing was still legible. As she unfolded it, her breath caught in her throat. It was a note hinting at a scheduled meeting, a potential confrontation between Eleanor and someone else. ‘This could change everything,’ Beatrice thought, her mind racing as she processed the implications. If Eleanor had arranged to meet someone, it suggested a deeper conflict, a motive that could lead to murder.

‘What does it say?’ Eleanor asked, her voice laced with anxiety as she leaned closer. Beatrice held the note up for both women to see, her heart pounding in her chest. ‘It mentions a meeting at midnight,’ she replied, her voice steady despite the whirlwind of emotions inside her. ‘This suggests that something was planned, something that could have led to Eleanor’s death.’ The tension in the room thickened, each person grappling with their own fears and suspicions. Beatrice could see the realization dawning on Eleanor's face, a mixture of shock and confusion. ‘But who was she meeting?’ Eleanor whispered, her eyes wide with disbelief.

Dr. Finch, who had been observing silently, stepped forward, her expression a mix of concern and defensiveness. ‘I had no idea about any meeting,’ she said, her voice steady but tinged with unease. ‘I was busy with my own work and didn’t see Eleanor after dinner.’ Beatrice's instincts kicked in, and she sensed that there was more to Mallory's story than she was letting on. ‘But you had a financial motive for Eleanor's death, didn’t you?’ Beatrice pressed, her gaze unwavering. ‘If she was planning to cut you out of a deal, wouldn’t that give you a reason to confront her?’ The accusation hung in the air, heavy with tension.

Mallory's eyes narrowed, and for a moment, Beatrice thought she might deny it. But instead, the doctor took a deep breath, her composure faltering. ‘I had my reasons, but I would never harm her,’ Mallory insisted, her voice rising slightly. ‘We had disagreements, yes, but I never wished her dead.’ Beatrice could see the conflict in Mallory's eyes, a mixture of guilt and desperation. The clock continued to tick ominously in the background, a reminder of the urgency of their situation. Beatrice knew they needed to piece together the timeline of events leading up to Eleanor's death, and every detail mattered.

As the rain continued to spring outside, Beatrice felt a sense of urgency wash over her. Time was slipping away, and with each passing moment, the truth grew more elusive. She glanced back at the clock, its hands frozen in time, and then returned her focus to the note in her hand. ‘We need to find out who else knew about this meeting,’ she declared, her voice firm. ‘If we can track down the person Eleanor was supposed to meet, it may lead us to the truth.’ The others nodded in agreement, their expressions a mixture of fear and determination. They were all trapped in this web of suspicion, and the only way out was to uncover the truth.

With renewed resolve, Beatrice turned to Eleanor and Mallory, her voice steady. ‘We need to interrogate everyone who was in the house last night. Every detail matters, and we can't afford to overlook anything.’ The gravity of her words hung in the air, and Beatrice could feel the weight of their shared secrets pressing down on them. As they prepared to delve deeper into the investigation, Beatrice knew that the path ahead would be fraught with uncertainty. But she was determined to uncover the truth, no matter the cost.
--- END PRIOR CHAPTER 4 ---

[SCENE COMPLETENESS CONTRACTS — MANDATORY. Each contract below lists what you MUST enact in that chapter. Do not summarise or mention these labels in the prose — enact them organically.]
Chapter 5 (Act 2) completeness contract:
  PIVOT ELEMENT (MANDATORY — write this into the prose, shown not told): "The tension-filled confrontation over their alibis"
  FACT ESTABLISHED (MANDATORY — reader must know this by chapter end): "Establishes that both Hale and Finch have questionable alibis, raising suspicion."

# Case Overview
Title: The Clockwork Conundrum
Era: 1930s
Setting: Little Middleton
Crime: murder (clock-tampering)
Culprit: Dr. Mallory Finch
False assumption: The murder occurred after the clock showed ten minutes past eleven.
Cast: Eleanor Voss (she/her), Dr. Mallory Finch (she/her), Captain Ivor Hale (he/him), Beatrice Quill (she/her)

Setting Lock: Keep all scenes and descriptions consistent with the stated setting (Little Middleton). Do not introduce a different location type.

Outline scenes:
[
  {
    "sceneNumber": 5,
    "act": 2,
    "title": "Unraveling Alibis",
    "setting": {
      "location": "the dining room",
      "timeOfDay": "Mid-afternoon",
      "atmosphere": "Confrontational, with rising tensions among suspects"
    },
    "characters": [
      "Beatrice Quill",
      "Captain Ivor Hale",
      "Dr. Mallory Finch"
    ],
    "purpose": "Challenge the alibis of Captain Hale and Dr. Finch",
    "cluesRevealed": [
      "clue_4",
      "clue_5",
      "clue_culprit_direct_dr_mallory_finch"
    ],
    "dramaticElements": {
      "conflict": "Alibis begin to crumble under scrutiny",
      "tension": "Beatrice presses Hale and Finch for contradictions",
      "microMomentBeats": [
        "Captain Hale's jaw tightens as Beatrice questions him."
      ]
    },
    "summary": "Beatrice confronts Captain Hale and Dr. Finch about their accounts, revealing inconsistencies in their timelines and behaviors around the time of the murder.",
    "estimatedWordCount": 1800,
    "pivotElement": "The tension-filled confrontation over their alibis",
    "factEstablished": "Establishes that both Hale and Finch have questionable alibis, raising suspicion.",
    "permittedBehavioursByAct": [
      {
        "characterName": "Captain Ivor Hale",
        "behaviour": "unease; mild defensiveness when questioned"
      },
      {
        "characterName": "Dr. Mallory Finch",
        "behaviour": "unease; mild defensiveness when questioned"
      },
      {
        "characterName": "Beatrice Quill",
        "behaviour": "normal social behaviour; grief or confusion if appropriate"
      }
    ],
    "redHerringPlacement": null,
    "emotionalRegister": "A crucial discovery shifts the focus of the investigation, deepening the narrative's complexity.",
    "dominantCharacterNote": {
      "name": "Dr. Mallory Finch",
      "voiceRegister": "Dr. Mallory speaks with precision, her tone often measured and authoritative, yet occasionally tinged with irony."
    },
    "humourGuidance": {
      "permission": "permitted",
      "character": "Beatrice Quill",
      "form": "sardonic"
    },
    "eraTextureNote": "Limited communication due to the lack of modern technology; Travel hampered by economic conditions and petrol shortages; Social gatherings tightly regulated by class expectations",
    "locationRegisterNote": ""
  }
]
```

## Message 3 (role=user)

```text
BEFORE SUBMITTING YOUR JSON — verify this checklist:
□ Each chapter reaches the hard floor of 500 words and aims for 1250 words or more.
□ If you mention locked evidence, you used the exact locked phrase verbatim.
□ Allowed seasonal words only: spring, vernal, springtime.
□ Forbidden seasonal words: summer, autumn, winter.
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
