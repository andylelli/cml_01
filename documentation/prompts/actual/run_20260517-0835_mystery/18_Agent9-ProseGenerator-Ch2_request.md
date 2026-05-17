# Actual Prompt Record

- Run ID: `mystery-1779006957529`
- Project ID: ``
- Timestamp: `2026-05-17T08:39:33.859Z`
- Agent: `Agent9-ProseGenerator-Ch2`
- Operation: `chat_request_full_prompt`
- Model: `GPT-4o-mini`
- Temperature: `0.42`
- Max Tokens: `4500`
- Attempt: `first`
- Prompt Hash: `84ca89d26231f4df`

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
- MORAL COMPLEXITY REQUIREMENT: The mechanism of this crime carries a moral gray area: "The murderer acted out of desperation to protect a loved one, blurring the lines of right and wrong." — the culprit reveal and denouement MUST acknowledge this ambiguity. Do not let the ending feel clean or simple. Give the reader at least one moment of uncomfortable sympathy or moral doubt.


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

## Era: 1931-11
In November 1931, life in England is marked by the chill of fall, creating an oppressive atmosphere as overcast skies and intermittent rain reflect the struggles of the Great Depression. Families are tightening their belts, rationing essentials as they grapple with rising unemployment and economic hardship. The wealthy are beginning to feel the strain of their privileged status, leading to increased tensions between social classes. Traditional gender roles are being questioned, while debates over women's rights are gaining momentum. The townsfolk find solace in gatherings, tea rituals, and the fleeting pleasures of cinema, yet an undercurrent of dissatisfaction simmers beneath the surface, hinting at social unrest. As the days grow shorter, the dim twilight casts long shadows over the lives of those navigating the choppy waters of ambition and rivalry.
Emotional register: A prevailing sense of anxiety and disillusionment permeates society, as individuals grapple with uncertainty and the fragility of their status.
Physical constraints: Short daylight hours leading to early evenings | Frequent rain limiting outdoor activities | Limited transportation options due to economic hardships
Current tensions (weave into background texture): Rising unemployment due to the Great Depression | Increasing political tension over unemployment relief measures | Social unrest brewing among the working class
Wartime context — Many are still processing the aftermath of the Great War, creating an atmosphere of bitterness and unresolved trauma.: Veterans are struggling to reintegrate into civilian life, often feeling out of place in a rapidly changing society. Absence effect: The absence of lost loved ones during the war weighs heavily on families, adding to the emotional strain of the era.

## Story Theme
In a world where ambition and jealousy intertwine, the quest for power can lead to betrayal and destruction, revealing the fragility of human connections, and reveals that evidence carries ethical weight, forcing characters to choose accountability over social performance when appearances and facts collide.

## Story Emotional Register
Dominant: A tense atmosphere filled with ambition and betrayal permeates the narrative.

Arc:
The story begins amidst the grandeur and unease of Little Middleton Manor, where the stormy weather mirrors the tensions brewing among the guests. The murder of Dr. Mallory Finch, discovered in her study, sends shockwaves through the estate, igniting an atmosphere of suspicion as the guests grapple with their ambitions and hidden resentments. As Beatrice Quill takes the lead in the investigation, the initial clues suggest a clock tampering method, raising questions about the reliability of time and alibis. The emotional cost of the investigation weighs heavily on the characters, each grappling with their own motives and secrets. A pivotal moment occurs when Eleanor Voss’s emotional response unravels her carefully crafted persona, leading to a shift in the investigation’s direction. Secrets begin to unravel, and the emotional stakes escalate as the detective uncovers the implications of the clock’s manipulation. Pre-climax tension mounts as conflicting truths collide, culminating in a confrontation where motives are laid bare. The resolution reveals the high costs of ambition, betrayal, and loss for each character, leaving them forever altered by the events that transpired within the manor’s walls.

The story opens: A sense of intrigue and foreboding fills the air as the storm brews outside. As the investigation takes shape: Tension rises as the investigation begins, revealing the characters' hidden motives. A first key turn arrives: The discovery of the clock's tampering shifts the focus of the investigation. At the mid-point of the story: A pivotal confrontation casts doubt on the alibis of the main suspects.

A second pivot reshapes the course: The emotional weight of betrayal becomes evident as secrets unravel. As tension reaches its height: The mounting pressure leads to a dramatic confrontation among the guests. The climax brings the central question to a head: Truths are unveiled, and hidden agendas collide in a tense standoff. In the final resolution: The characters emerge transformed, facing the consequences of their actions.

Underpinning every turn is the story's central concern: In a world where ambition and jealousy intertwine, the quest for power can lead to betrayal and destruction, revealing the fragility of human connections. This thread binds the individual emotional moments into a coherent journey.

The dominant register — A tense atmosphere filled with ambition and betrayal permeates the narrative. — colours the prose from first chapter to last, ensuring the reader feels the weight of each revelation as moral consequence rather than mere puzzle mechanics.

## Emotional register at this point in the story
A sense of intrigue and foreboding fills the air as the storm brews outside.

## Character Portraits (appearance & era)

### Eleanor Voss
Eleanor Voss embodies the tension of the 1930s, caught between her ambitions and the societal pressures of a changing world. While she presents herself as a gracious socialite, her internal conflicts reveal the dark side of her relentless pursuit of status. As economic struggles deepen, her resentment towards competition grows, making her desperate to maintain her position in a crumbling social hierarchy.
Era intersection: Eleanor's quest for power and validation directly reflects the era's class tensions, as the wealthy grapple with their privilege amidst rising unemployment.

### Captain Ivor Hale
Captain Ivor Hale represents the disillusionment of a generation shaped by war, grappling with his identity in a world that seems to have left him behind. His adherence to traditional values clashes with the emerging modern sensibilities of the younger generation, leaving him feeling isolated and vulnerable. The economic hardships of the Great Depression exacerbate his fears about legacy and purpose.
Era intersection: Ivor's struggle to adapt to a changing world mirrors the tensions of the 1930s, as societal norms are challenged and the younger generation rises.

### Beatrice Quill
Beatrice Quill is a reflection of the artistic spirit of the 1930s, searching for validation in a world that often overlooks the unconventional. Her jealousy and ambition drive her to consider extreme measures as she navigates the pressures of a competitive literary scene. The economic climate adds a layer of urgency to her aspirations, forcing her to confront her own demons.
Era intersection: Beatrice's artistic aspirations and struggles highlight the era's tension between tradition and modernity, as societal expectations clash with individual expression.

## Character Voices

### Eleanor Voss (she/her/her)
Eleanor speaks with a refined eloquence, her words punctuated by a soft, ironic laugh that hints at her true feelings beneath the polished exterior.
[comfortable] Oh, darling, isn't this just the most delightful evening? I can't imagine a better way to spend our time.
[evasive] Well, you know how it is — one must maintain appearances, even when the world is falling apart.
[stressed] I— I just need a moment to gather myself. It's all terribly overwhelming, isn't it?
Humour: Eleanor's polite savagery often surfaces in her interactions, allowing her to veil her true intentions behind charm.

### Captain Ivor Hale (he/him/his)
Ivor speaks in a deliberate, measured tone, often reflecting on the past with a hint of nostalgia, using nautical metaphors.
[comfortable] Ah, the sea was always a reliable companion, unlike the fickle tides of society.
[evasive] It's all just a passing squall; we'll weather it as we always have.
[stressed] I fear that my time has passed, and the world is leaving me behind.
Humour: Ivor's self-deprecating humour reflects his struggles with identity and adaptation.

### Beatrice Quill (she/her/her)
Beatrice's voice is whimsical and dramatic, often laced with sarcasm as she navigates her artistic aspirations.
[comfortable] Life is but a canvas, and I intend to paint it in the brightest hues, regardless of the critics.
[evasive] Oh, I was merely lost in thought, contemplating the depths of my next poem.
[stressed] What if this is the end of my dreams? I can't let that happen, not now.
Humour: Her sardonic wit often serves as a coping mechanism for her insecurities.

## Location Registers (scene framing guides)

The Drawing Room: The drawing room is thick with tension, where the air feels heavy with unspoken accusations and simmering resentments. The opulent surroundings contrast sharply with the emotional turmoil of the guests, creating a sense of unease and foreboding.. Camera angle: Entering this space, a writer should feel the weight of hidden secrets, as every whisper and glance becomes a pivotal moment in the unfolding drama.. Era: The constraints of the 1930s create an atmosphere where class distinctions are palpable, making every interaction fraught with underlying motives.

The Library: The library is a sanctuary of shadows and whispers, filled with the weight of hidden truths. The thick air carries the scent of old books and a sense of foreboding, where every creak of the floorboards seems to echo the secrets waiting to be uncovered.. Camera angle: A writer entering the library should feel the tension of a place where past and present collide, where every inch of space might conceal vital clues.. Era: As a restricted space, the library symbolizes the era's constraints on knowledge and access, a reflection of the hidden agendas surrounding the guests.

The Cellar: The cellar is steeped in darkness and mystery, a place where the chilling air carries the weight of secrets. Shadows lurk in every corner, and the faint echo of dripping water heightens the tension, making one feel the palpable fear of what might be hidden within.. Camera angle: For a writer, entering the cellar should invoke a sense of dread and anticipation, as if every shadow might reveal a buried truth.. Era: The dim lighting and limited access reflect the societal constraints of the 1930s, where truth is often obscured and secrets are closely guarded.

The Woodland: The woodland is a realm of secrets, where the dense underbrush and twisting paths create an atmosphere of uncertainty. The rustling leaves and distant sounds of nature evoke a sense of mystery, inviting characters to explore the hidden corners of their desires and fears.. Camera angle: A writer should feel a sense of suspense upon entering the woodland, as if every step taken could lead to revelation or danger.. Era: As a space often avoided by guests, the woodland serves as a metaphor for the uncharted territories of ambition and jealousy during the 1930s.

## Humour guidance for this story position (opening)
Permission: forbidden
Rationale: The gravity of the murder sets a serious tone that cannot accommodate humor.

FAIR-PLAY AND INFERENCE CONTRACT (from CML logic):
- False assumption in force: The murder must have occurred at the time indicated by the stopped clock.
- Hidden truth to progressively expose: The clock was tampered with to fabricate an alibi.
- Inference path checkpoints to dramatize clearly (observation -> correction -> effect):
  - Step 1: obs: The clock in the study was found stopped at ten minutes past eleven. | corr: The clock may have been tampered with to mislead the time of death. | effect: Narrows investigation focus towards those who had access to the clock.
  - Step 2: obs: Witnesses heard the clock strike an hour different from what is shown. | corr: This suggests the clock was manipulated after the time of death. | effect: Eliminates the possibility that the clock's time reflects the actual time of death.
  - Step 3: obs: Eleanor's emotional response during questioning seems rehearsed. | corr: This implies she may have staged her reaction to cover up her involvement. | effect: Narrows suspects to Eleanor due to inconsistencies.
- Discriminating test method: trap
- Discriminating test design constraint: Eleanor is confronted with the evidence of the clock's tampering and must explain the discrepancies in her alibi.
- Test must rely on already-shown clue IDs: clue_1, clue_2, clue_3, clue_mechanism_visibility_core, clue_culprit_direct_dr_mallory_finch
- Fair-play rationale: Step 1: The stopped clock (early) and witness accounts (mid) show a manipulated timeline. Step 2: Eleanor's emotional inconsistency (mid) narrows suspicion towards her. Step 3: The clock's tampering proof (discriminating test) confirms her guilt.
- Never solve by withheld information. Keep reader-information parity with detective reasoning.

## Character Reference

### Eleanor Voss (she/her — NEVER he/him)
Eleanor speaks with a refined eloquence, often punctuating her sentences with a soft, ironic laugh
She has a tendency to use flowery language when complimenting others, but her true feelings often leak through in her choice of words.
Eleanor grapples with her ambition and the realization that her ruthless pursuit of social status may lead her to betray her own values, leaving her feeling hollow and isolated.

### Captain Ivor Hale (he/him — NEVER she/her)
Ivor speaks in a deliberate, measured tone, often employing self-deprecating humour when discussing his past
He has a tendency to use nautical metaphors, reflecting his military background, and speaks with a hint of nostalgia for the traditions he holds dear.
Ivor wrestles with feelings of inadequacy and regret, haunted by the decisions he made in the heat of battle. He fears that his inability to adapt to the new world will render him obsolete, leaving him adrift.

### Beatrice Quill (she/her — NEVER he/him)
Beatrice speaks with a whimsical cadence, often punctuating her thoughts with sarcastic quips
She has a flair for the dramatic, using vivid imagery in her language, and her conversation often flows like a poem, revealing her artistic soul.
Beatrice is torn between her artistic integrity and the desperate need for validation, leading her to question the lengths she would go to achieve success. Her jealousy threatens to consume her, turning her creativity into a weapon.


## CHARACTER CONTRACTS (binding for this scene)
Each entry below constrains how this character must be written in this chapter.
These override generic style guidance when they conflict.

### Eleanor Voss[SHE]
Voice & mannerisms: Eleanor speaks with a refined eloquence, often punctuating her sentences with a soft, ironic laugh. She has a tendency to use flowery language when complimenting others, but her true feelings often leak through in her choice of words.
Sample voice fragments (match this register and rhythm):
  [comfortable] "Oh, darling, isn't this just the most delightful evening? I can't imagine a better way to spend our time."
  [evasive] "Well, you know how it is — one must maintain appearances, even when the world is falling apart."
Humour: polite savagery — deploy occasionally (level 0.6)
FORBIDDEN phrase (never write for Eleanor Voss): "she felt a wave of unease"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "With a lucrative charity gala on the horizon, Eleanor sees the murder as an opportunity to eliminate competition and secure her place at the top of society’s hierarchy." — do not surface in Act I.

### Captain Ivor Hale[HE]
Voice & mannerisms: Ivor speaks in a deliberate, measured tone, often employing self-deprecating humour when discussing his past. He has a tendency to use nautical metaphors, reflecting his military background, and speaks with a hint of nostalgia for the traditions he holds dear.
Sample voice fragments (match this register and rhythm):
  [comfortable] "Ah, the sea was always a reliable companion, unlike the fickle tides of society."
  [evasive] "It's all just a passing squall; we'll weather it as we always have."
Humour: self deprecating — deploy rarely (level 0.3)
FORBIDDEN phrase (never write for Captain Ivor Hale): "she knew with certainty she was right"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Ivor feels threatened by the younger generation’s disregard for tradition and may see the victim as a symbol of this change, igniting a sense of rage that could lead to dire consequences." — do not surface in Act I.

### Beatrice Quill[SHE]
Voice & mannerisms: Beatrice speaks with a whimsical cadence, often punctuating her thoughts with sarcastic quips. She has a flair for the dramatic, using vivid imagery in her language, and her conversation often flows like a poem, revealing her artistic soul.
Sample voice fragments (match this register and rhythm):
  [comfortable] "Life is but a canvas, and I intend to paint it in the brightest hues, regardless of the critics."
  [evasive] "Oh, I was merely lost in thought, contemplating the depths of my next poem."
Humour: sardonic — deploy frequently (level 0.7)
FORBIDDEN phrase (never write for Beatrice Quill): "palpable tension filled the room"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Convinced that the victim sabotaged her chances for publication in a prestigious magazine, Beatrice sees the murder as a potential opportunity to reclaim her place in the literary world." — do not surface in Act I.



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
A sprawling manor house set against the backdrop of the English countryside, steeped in mystery and intrigue as tensions rise among its guests.

Key Locations Available:
- The Drawing Room (interior): Gathering space for guests
- The Library (interior): Restricted access, a place for secrets and clues
- The Cellar (interior): Crime scene; storage for wine and secrets
- The Woodland (exterior): Secluded area for secret meetings and potential evidence

Atmosphere: tension-filled, reflecting underlying social unrest and suspicion among guests
Weather: overcast with intermittent rain, typical of the English countryside

Era markers: Petrol touring cars parked along the gravel drive | Typewriters clacking in the study | Telegram service available in nearby Little Middleton village

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
  - Visual: glittering crystal chandelier, richly upholstered armchairs, faded floral wallpaper
  - Sounds: murmurs of conversation, the crackle of the fire, rain tapping against the window
  - Scents: beeswax candles, tobacco smoke, old leather
  - Touch: soft velvet upholstery, cool marble fireplace surround

The Library (interior):
  - Visual: dusty tomes lining the shelves, a globe in the corner, a large, ornate desk
  - Sounds: pages rustling, the ticking of a clock, the faint whisper of wind outside
  - Scents: old leather bindings, musty paper, polished wood
  - Touch: smooth wood of the desk, the coolness of the stone floor

The Cellar (interior):
  - Visual: flickering lantern light, dusty bottles lined along shelves, dark corners filled with cobwebs
  - Sounds: dripping water, the scurrying of mice, echo of footsteps
  - Scents: moldy stone, aged wine, damp wood
  - Touch: cold stone walls, rough wooden shelves

⛔ REFERENCE DATA — DO NOT TRANSCRIBE VERBATIM: The above profiles are structural guides only. Generate original prose that evokes these qualities; do not reproduce the exact phrasing or sentence structure of the profile paragraphs.

SCENE OPENING RULE: When opening a scene in a new location, write what the POV character directly observes and physically senses at that moment — not a general description of the room's qualities. The reader must feel present, not briefed. Sensory details must be observed by the character, not stated as fact about the place.

SENSORY WRITING TECHNIQUES:
- Opening paragraphs: Lead with 2-3 sensory details to ground the scene
- Movement between locations: Note sensory changes (quiet study → noisy dining room)
- Emotional scenes: Use sensory details to reinforce mood (cold rain during argument)
- Period authenticity: Use period-specific sensory details from location/temporal profiles
- Avoid: Over-reliance on visual only; use sound, smell, touch, temperature

CHAPTER SENSORY PALETTE HINTS (evoke these qualities without copying verbatim):
  Chapter 2 palette — afternoon, overc
[truncated for prompt budget]

## Texture Pool
Draw on these as opportunities arise — you are not required to use them.

- In November 1931, life in England is marked by the chill of fall, creating an oppressive atmosphere as overcast skies and intermittent rain reflect the struggles of the Great Depression
- Families are tightening their belts, rationing essentials as they grapple with rising unemployment and economic hardship
- The wealthy are beginning to feel the strain of their privileged status, leading to increased tensions between social classes
- Traditional gender roles are being questioned, while debates over women's rights are gaining momentum
- The townsfolk find solace in gatherings, tea rituals, and the fleeting pleasures of cinema, yet an undercurrent of dissatisfaction simmers beneath the surface, hinting at social unrest

TEMPORAL CONTEXT:

This story takes place in November 1931 during N/A.

Seasonal Atmosphere:
- Weather patterns: overcast skies, intermittent rain, chilly winds
- Daylight: Short days with twilight descending around four o'clock in the afternoon, leaving the evenings dim and foggy.
- Seasonal activities: hunting parties in the countryside, preparations for Christmas markets, gatherings around the fireplace for storytelling
- Seasonal occasions: Guy Fawkes Night (November 5)
- Season: N/A

Period Fashion (describe naturally):
- Men formal: tailored wool three-piece suit, knitted tie, double-breasted overcoat
- Men casual: tweed sports jacket, corduroy trousers, flat cap
- Men accessories: gold pocket watch, leather gloves, umbrella
- Women formal: floor-length evening gown with a drop waist, long beaded necklace, faux fur stole
- Women casual: woolen cardigan with embroidered detailing, pleated skirt, cloche hat
- Women accessories: silk scarf, beaded handbag, gloves

Cultural Context (reference naturally):
- Music/entertainment: 'Ain't She Sweet' by Milton Ager, 'The Best Things in Life Are Free' by Ray Henderson, 'Puttin' on the Ritz' by Irving Berlin; Films: 'City Lights' featuring Charlie Chaplin, 'Frankenstein' directed by James Whale; Theatre: 'The Front Page' by Ben Hecht and Charles MacArthur, 'Rookery Nook' by Ben Travers; Radio: BBC's 'In Town Tonight', The Archers (first broadcasted in 1951 but a concept still being developed)
- Typical prices: Loaf of bread: four pence, pint of milk: two pence, cinema ticket: one shilling
- Current events: rising unemployment due to the Great Depression; increased political tension as fascism gains traction in Europe
- Literature: 'Murder in the Mews' by Agatha Christie | 'The Maltese Falcon' by Dashiell Hammett | 'The Good Soldier' by Ford Madox Ford | [mystery] | [social realism] | [modernist literature]
- Technology: the electric refrigerator gaining popularity | the introduction of the first electric washing machines | advancements in radio technology | typewriters in homes and offices | electric lamps for improved lighting | petrol-powered cars for travel
- Daily life: gathering for tea and gossip, attending local fairs and markets, participating in shooting parties or country walks
- Social rituals: afternoon tea with scones and clotted cream, dinner parties with a strict seating arrangement, weekly church services followed by community discussions

Atmospheric Details:
The scent of damp earth and fallen leaves fills the air, mingling with the faint smell of wood smoke from the estate's chimneys. The muffled sounds of distant thunder and the occasional drip of rain on windowpanes create a tension-filled ambiance, as shadows dance across the walls of the grand drawing room. Guests whisper nervously, their hushed conversations punctuated by the ticking of the large grandfather clock, marking the slow passage of time as the evening draws on.

FASHION INTEGRATION TECHNIQUES:
- First appearance: Describe outfit to establish class/personality
- Accessories: Gloves, hats, pocket watches, jewelry reveal status
- Time-specific: Different outfits for different times of day
- Character traits: Fastidious dresser vs rumpled appearance
- Action integration: "She tugged at her glove" or "He adjusted his tie"
- Weather appropriate: Overcoats in winter, light linen in summer

CU
[truncated for prompt budget]

NON-NEGOTIABLE CHAPTER OBLIGATIONS — LOCKED EVIDENCE PHRASES (VERBATIM REQUIRED):
The following physical evidence values are absolute ground truth. Every time this chapter describes, mentions, or alludes to the relevant evidence — no matter how briefly — it MUST use the exact phrase shown below, character for character. NO paraphrase, approximation, rounding, or synonym is permitted.

FAILURE EXAMPLE: if the locked value is "at thirteen minutes to midnight" and you write "just before midnight" or "around midnight" — that is a HARD FAIL. You must write "at thirteen minutes to midnight". Equally, if the locked value is written in words, such as "ten minutes past eleven", and you convert it to figure-based clock notation — that is also a HARD FAIL. Words stay as words; figure forms are forbidden for word-phrased facts.

CRITICAL — WORD-PHRASED VALUES: If the canonical value is written out in words (e.g. a time like "ten minutes past eleven", or an amount like "forty minutes"), reproduce those exact words. DO NOT convert to figure-based time notation, twenty-four-hour format, or any other numeric shorthand. Correct: "ten minutes past eleven". WRONG: figure-based clock notation or numeric shorthand.

Locked facts:
  - The exact time shown on the stopped clock face: "ten minutes past eleven"
    ⛔ FORBIDDEN alternatives: "11:10", "11.10", "eleven ten", "eleven-ten", "eleven past ten", "quarter past eleven", "half past eleven" — the ONLY acceptable form is "ten minutes past eleven"
  - The exact amount the clock was wound back: "forty minutes"
  - The time the party officially began: "eight o'clock"
    ⛔ FORBIDDEN alternatives: "8:00", "8.00" — the ONLY acceptable form is "eight o'clock"
  - The time the murder was committed according to witnesses: "a quarter past eleven"

If a locked fact has no relevance to this chapter, omit it. But the moment you reference the underlying evidence, only the exact phrase above is acceptable.

⛔ CLUES TO SURFACE IN THESE CHAPTERS — mandatory:
The following evidence MUST be clearly observable to an attentive reader. Do not bury it in atmosphere or passing dialogue. Each clue must be concrete, specific, and noticeable:

• [clue_2] Witnesses heard the clock strike an hour different from what is shown.
  Category: temporal | Criticality: essential | Supports inference step 1
  Points to: Contradicts the time indicated by the stopped clock.

For each clue above: an attentive reader should be able to find, record, and later use it to reason toward the solution.

═══ NARRATIVE STATE (read-only — do not contradict) ═══

LOCKED FACTS — use verbatim whenever this evidence is described:
  • The exact time shown on the stopped clock face: "ten minutes past eleven"
  • The exact amount the clock was wound back: "forty minutes"
  • The time the party officially began: "eight o'clock"
  • The time the murder was committed according to witnesses: "a quarter past eleven"

CHARACTER PRONOUNS — never deviate from these:
  • Eleanor Voss: she/her/her
  • Dr. Mallory Finch: she/her/her
  • Captain Ivor Hale: he/him/his
  • Beatrice Quill: she/her/her

CLUES ALREADY REVEALED TO READER: clue_1 — do not reveal these as new information.

INVESTIGATION LOG — WHAT IS ESTABLISHED (do not re-establish, do not repeat):
• Evidence in reader's hands: The clock in the study was found stopped at ten minutes past eleven.
• Suspects still unresolved: Eleanor Voss[SHE], Captain Ivor Hale[HE], Beatrice Quill[SHE]
⚠ The story must move FORWARD from this log. Any beat already listed above is forbidden from repeating.

⚠ THIS CHAPTER'S REQUIRED ADVANCE (opening): Discover the body, confirm the victim, note the stopped clock

CONTINUITY HANDOFF — previous chapter closing beat:
  • "As the rain continued to lash against the windows, Beatrice felt the weight of the investigation settle upon her shoulders. The study, with its chaotic remnants of a life interrupted, was a microcosm of the turmoil that lay ahead. She would need to piece toget..."
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
study, manor

✓ RULE: Continue using this location vocabulary. Maintain consistency with established setting type.
✓ Do NOT introduce new location types that contradict earlier chapters.

**Recent Chapter Summary (for narrative continuity):**
Chapter 1: Chapter 1: Discovery
  Events: Eleanor Voss stood rigidly by the door, her fingers brushing against the polished wood as she stared into the study.

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
Known location profile anchors: Little Middleton Manor, The Drawing Room, The Library, The Cellar, The Woodland, the drawing room
LOCATION NAME CAPITALISATION (HARD REQUIREMENT — validated):
All named locations in your prose MUST use the EXACT capitalisation from the CML profiles.
Canonical forms: "Little Middleton Manor", "The Drawing Room", "The Library", "The Cellar", "The Woodland", "the drawing room"
Writing a location in lowercase (e.g. "drawing room" instead of "Drawing Room") is a validated error. Every time you mention a named location, copy its capitalisation from the list above.
- Chapter 2: OPENING STYLE (HARD): Start the VERY FIRST SENTENCE with spoken dialogue — e.g. '"[words]," [Name] said/asked/replied/murmured.' The opening quote must be the first character on the line. Anchor opening in "the drawing room". HARD REQUIREMENT for the first 2 paragraphs: (a) include 2+ sensory words — choose from smell/scent/sound/echo/silence/creak/whisper/cold/warm/damp/rough/smooth/glow/shadow/flicker/dim — and (b) include 1+ atmosphere/time word — choose from rain/wind/fog/storm/mist/thunder/evening/morning/night/dawn/dusk/season/afternoon/midday/noon/midnight/twilight/sunrise/sunset/daylight/sunlight/overcast/cloudy/bright/dark. These are validated requirements, not style suggestions; missing them triggers a retry.

[⚠ INTERNAL QUALITY DIAGNOSTICS — DO NOT REPRODUCE ANY PART OF THIS SECTION IN YOUR STORY OUTPUT. These are private generator observations for your consideration only. Your narrative must read as if this section does not exist. Never include phrases from this block in character dialogue, narration, or description.]

PRIOR CHAPTER QUALITY OBSERVATIONS:
- Chapter 1 (score 84/100):
  Quality gaps noted: word density below preferred target (591/1000); scene grounding weakness
  Address in upcoming chapters: Increase chapter density with concrete investigation action and sensory-grounded beats; avoid recap-only padding. | Open next chapter with a named location anchor plus at least two sensory cues and one atmosphere marker.
[END INTERNAL DIAGNOSTICS]

PROMPT BUDGET SUMMARY: budget=32000 tokens; fixed=6587; context=10940; dropped=[none]; truncated=[pronoun_accuracy, location_profiles, temporal_context]

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
8. Integrate at least two concrete era-grounded details per chapter from setting refinement signals: petrol touring cars on county roads | domestic wiring with frequent outages | typewriters standard in offices | party-line telephone exchanges | telegram services available through local offices | airmail for faster communication.
9. Respect setting movement/access constraints in scene action and alibis: layout of the estate creates natural barriers and movement restrictions | manor's architecture includes locked rooms and hidden passages | weather conditions can affect outdoor evidence visibility | established permissions required to enter certain areas of the manor | restricted access to the library and cellar.
10. Sustain social coherence with this backdrop pressure: An inheritance dispute amidst the backdrop of the Great Depression forces a diverse group of heirs and associates to confront their ambitions and resentments within the isolated manor, heightening tensions as political unrest looms outside.
11. Maintain continuity around these socially central cast anchors where relevant: Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill.
12. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Critical: Plot similarity 0.75 with 'The Mysterious Affair at Styles' (same murder method and temporal constraints)
13. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Moderate: Character similarity 0.74 with 'The Sign of the Four' (mirrored roles of doctor and investigator)
14. STORY TO DATE ANTI-COPY RULE: The STORY TO DATE section below is provided for chronological and factual reference ONLY. You MUST NOT copy, lightly rephrase, or structurally echo any sentence or paragraph from prior chapters. Every sentence in this chapter must be original prose unique to this scene. Reusing even a clause from prior chapter text will cause this attempt to fail immediately.

CRITICAL PROSE REQUIREMENTS:

The CML specifies exact requirements for certain validation-critical scenes. You MUST include these elements at the specified positions.

**Discriminating Test Scene (Act 3, Scene 4):**
Required elements: Execute the discriminating test, Observe the culprit's reaction or result, Draw conclusion about guilt
Test type: trap

**Suspect Clearance Scenes:**
- Dr. Mallory Finch (Act 3, Scene 5): Proved he was in the kitchen during the murder.
  Clues: clue_1, clue_2
- Captain Ivor Hale (Act 3, Scene 5): Alibi confirmed by multiple witnesses.
  Clues: clue_1, clue_2
- Eleanor Voss (Act 3, Scene 5): Alibi confirmed: two hours before the murder

**Culprit Revelation Scene (Act 3, Scene 6):**
Method: Confrontation with evidence

**Clue Placement for These Chapters:**
- clue_2 must appear in Act 1, Scene 2 via Witness statements

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
  - STRUCTURAL ARCHETYPE — Chapter 2 must be: FIRST_CONTACT
      ✓ MUST contain: at least two suspect interviews
      ✗ MUST NOT contain: physical evidence discovery
  - Word count: Target 1250 words. Achieve this through plot events, dialogue exchanges, and physical investigation — not through atmospheric repetition or extended internal reflection. Each 200-word segment should contain at minimum one concrete story event (a discovery, a conversation exchange, a physical action or movement). Padding with atmosphere alone is not acceptable.
  - Opening: Begin with a character action, spoken line, or clock/time marker — never a location name or location-description phrase.
  - Scene is set in: the drawing room — reference it naturally within the paragraph, never as your opening phrase.
  - Opening atmosphere (MANDATORY — validator enforced): the first paragraph MUST contain at least one of: rain / wind / fog / storm / mist / thunder / evening / morning / night / dawn / dusk / season / afternoon / midday / noon / midnight / twilight / sunrise / sunset / daylight / sunlight / overcast / cloudy / bright / dark. A chapter that omits all of these from its opening paragraph will be rejected.
  - Continuity bridge: in the first 120 words, visibly connect from the previous chapter's final beat. Carry forward one unresolved element (object, accusation, emotional pressure, or immediate physical action) from: "As the rain continued to lash against the windows, Beatrice felt the weight of the investigation settle upon her shoulders. The study, with its chaotic remnants of a life interrupted, was a microcosm of the turmoil that...".
  - CLUE OBLIGATIONS — mandatory prose elements (do NOT omit or bury):
    • Witnesses heard the clock strike an hour different from what is shown. [clue_2] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: Contradicts the time indicated by the stopped clock.
      ↳ MANDATORY TWO-PARAGRAPH STRUCTURE (must appear in paragraphs 1 or 2 — no later):
         Paragraph 1: The POV character physically approaches or directly observes this evidence.
           The narration or dialogue explicitly states what is seen (use the exact locked phrase if one applies).
         Paragraph 2 (immediately following): The detective or POV character explicitly reasons
           about what this evidence implies — who it implicates, why it may be unreliable,
           or what inference it supports. This must be a separate full paragraph, not a sentence appended to Paragraph 1.
  - Tonal contrast: include at least one beat of relief or ironic counterpoint. Do not sustain maximum tension for every paragraph.
  - Sensory obligation — use at least two of: dim light casting long shadows, the flicker of candle flames | the creak of old timbers, distant thunder rumbling | woodsmoke. Mood: uneasy stillness.
- Locked fact phrase obligations:
  - If this batch mentions The exact time shown on the stopped clock face, write exactly: "ten minutes past eleven".
  - If this batch mentions The exact amount the clock was wound back, write exactly: "forty minutes".
  - If this batch mentions The time the party officially began, write exactly: "eight o'clock".
  - If this batch mentions The time the murder was committed according to witnesses, write exactly: "a quarter past eleven".
- Seasonal vocabulary allow-list: autumn, autumnal, fall.
- Forbidden seasonal words: spring, summer, winter.

FROZEN TIMELINE STATE (DO NOT ALTER):
- Timeline anchor: November (autumn).
- Month, season, weather, and time-of-year language in this batch must stay compatible with autumn.
- Established timeline fact: time of death at ten minutes past eleven
- Established timeline fact: clock stopped at ten minutes past eleven
- If referenced, use exact time phrase: "ten minutes past eleven" (The exact time shown on the stopped clock face).
- If referenced, use exact time phrase: "forty minutes" (The exact amount the clock was wound back).
- If referenced, use exact time phrase: "eight o'clock" (The time the party officially began).
- If referenced, use exact time phrase: "a quarter past eleven" (The time the murder was committed according to witnesses).

STORY TO DATE (REFERENCE ONLY — DO NOT COPY VERBATIM):
- Full prior chapter text is provided below for continuity, factual consistency, and reference accuracy.
- Use this to keep character voice, chronology, clue state, and location continuity aligned with earlier chapters.
- Do not quote, copy, or paraphrase these paragraphs too closely; write fresh prose that remains consistent with them.

--- BEGIN PRIOR CHAPTER 1 ---
Title: Chapter 1: Discovery
Eleanor Voss stood rigidly by the door, her fingers brushing against the polished wood as she stared into the study. The storm outside raged on, rain pelting against the windowpanes with an almost frantic urgency, mirroring the chaos that had unfolded within the manor's walls. The air was thick with tension, the scent of damp earth mingling with the faint aroma of tobacco smoke that clung to the room. Beatrice Quill stepped inside, her heart pounding as she took in the scene before her.

The study was a disarray of overturned furniture and scattered papers, but it was the clock that drew Beatrice's immediate attention. It stood out against the backdrop of chaos, its face frozen in time, the hands stubbornly pointing to ten minutes past eleven. A chill ran down Beatrice's spine as she approached the clock, her mind racing with the implications of its stillness. This was no mere accident; it was a harbinger of the tragedy that had transpired here.

Eleanor's pale face betrayed her shock, and as Beatrice glanced back at her, she noticed the faint tremor in Eleanor's hands. 'It was always such a reliable clock,' Eleanor murmured, her voice barely above a whisper. 'I never imagined it would stop now.' The words hung heavy in the air, and Beatrice felt a flicker of doubt. Was Eleanor's grief genuine, or was it a carefully crafted façade?

Beatrice knelt down beside the clock, her fingers brushing against the cold surface of the wooden frame. 'This clock... it must have stopped at the time of death,' she said, her voice steady despite the turmoil within. 'If it shows ten minutes past eleven, then the murder must have occurred no later than that.' She glanced up at Eleanor, searching for any sign of reaction, but the woman's expression remained inscrutable.

The implications of the stopped clock were profound. It contradicted the alibis of all three suspects present in the manor at the time of the murder—Eleanor Voss, Captain Hale, and Dr. Finch. Beatrice's mind raced as she considered the possibilities. Had the clock been tampered with? Or was it simply a cruel twist of fate? The questions swirled around her like the storm outside, each one more pressing than the last.

Captain Hale stepped forward, his brow furrowed in thought. 'We must consider the timing of the party. It began at eight o'clock, and if the witnesses claim the murder occurred at a quarter past eleven, then we have a narrow window to work with.' Her voice was calm, but Beatrice could sense the underlying tension in her words. The stakes were high, and every moment counted.

Eleanor shifted uncomfortably, her gaze darting between Beatrice and Ivor. 'But how can we be sure the clock is accurate?' she interjected, her voice tinged with a hint of desperation. 'What if it has always been unreliable? What if it stopped long before the murder?' Beatrice noted the flicker of unease in Eleanor's eyes, and a small part of her wondered if the woman was grasping at straws to deflect suspicion.

As the rain continued to lash against the windows, Beatrice felt the weight of the investigation settle upon her shoulders. The study, with its chaotic remnants of a life interrupted, was a microcosm of the turmoil that lay ahead. She would need to piece together the fragments of this mystery, to uncover the truth hidden beneath layers of deception and grief. The clock's stillness was a challenge, a riddle waiting to be solved, and she was determined to find the answer.
--- END PRIOR CHAPTER 1 ---

[SCENE COMPLETENESS CONTRACTS — MANDATORY. Each contract below lists what you MUST enact in that chapter. Do not summarise or mention these labels in the prose — enact them organically.]
Chapter 2 (Act 1) completeness contract:
  PIVOT ELEMENT (MANDATORY — write this into the prose, shown not told): "Eleanor's statement about being in the garden."
  FACT ESTABLISHED (MANDATORY — reader must know this by chapter end): "Establishes that Eleanor's alibi is questionable, as she was seen at the charity event at eight o'clock."
  RED HERRING (MANDATORY — seed naturally, not flagged as false): [rh_2] Ivor claims he heard the clock chime just before the murder, suggesting the time of death was accurate.

# Case Overview
Title: The Clockwork Conspiracy
Era: 1930s
Setting: Little Middleton
Crime: murder (clock tampering)
Culprit: Dr. Mallory Finch
False assumption: The murder must have occurred at the time indicated by the stopped clock.
Cast: Eleanor Voss (she/her), Dr. Mallory Finch (she/her), Captain Ivor Hale (he/him), Beatrice Quill (she/her)

Setting Lock: Keep all scenes and descriptions consistent with the stated setting (Little Middleton). Do not introduce a different location type.

Outline scenes:
[
  {
    "sceneNumber": 2,
    "act": 1,
    "title": "Witness Statements",
    "setting": {
      "location": "the drawing room",
      "timeOfDay": "Late morning",
      "atmosphere": "Somber and reflective, filled with the scent of fresh flowers"
    },
    "characters": [
      "Beatrice Quill",
      "Eleanor Voss",
      "Captain Ivor Hale"
    ],
    "purpose": "Gather initial testimonies from the suspects.",
    "cluesRevealed": [
      "clue_2"
    ],
    "dramaticElements": {
      "conflict": "Conflicting alibis begin to emerge.",
      "tension": "Eleanor's story seems rehearsed.",
      "microMomentBeats": [
        "Beatrice notices a tear glistening on Eleanor's cheek, but her voice remains steady."
      ]
    },
    "summary": "In the drawing room, Beatrice interviews Eleanor and Ivor about their whereabouts during the murder. While Ivor claims he was with Eleanor at the charity event, Eleanor insists she was in the garden before returning to the party.",
    "estimatedWordCount": 2000,
    "pivotElement": "Eleanor's statement about being in the garden.",
    "factEstablished": "Establishes that Eleanor's alibi is questionable, as she was seen at the charity event at eight o'clock.",
    "permittedBehavioursByAct": [
      {
        "characterName": "Eleanor Voss",
        "behaviour": "cooperative grief; no guilt-tells in Act I"
      },
      {
        "characterName": "Captain Ivor Hale",
        "behaviour": "normal social behaviour; no guilt signals permitted"
      },
      {
        "characterName": "Beatrice Quill",
        "behaviour": "normal social behaviour; no guilt signals permitted"
      }
    ],
    "redHerringPlacement": {
      "redHerringId": "rh_2",
      "placementDetail": "Ivor claims he heard the clock chime just before the murder, suggesting the time of death was accurate."
    },
    "emotionalRegister": "Tension rises as the investigation begins, revealing the characters' hidden motives.",
    "dominantCharacterNote": {
      "name": "Eleanor Voss",
      "voiceRegister": "Eleanor speaks with a refined eloquence, her words punctuated by a soft, ironic laugh that hints at her true feelings beneath the polished exterior."
    },
    "humourGuidance": {
      "permission": "permitted",
      "character": "Beatrice Quill",
      "form": "sardonic"
    },
    "eraTextureNote": "Short daylight hours leading to early evenings; Frequent rain limiting outdoor activities; Limited transportation options due to economic hardships",
    "locationRegisterNote": "The drawing room is thick with tension, where the air feels heavy with unspoken accusations and simmering resentments. The opulent surroundings contrast sharply with the emotional turmoil of the guests, creating a sense of unease and foreboding. — Entering this space, a writer should feel the weight of hidden secrets, as every whisper and glance becomes a pivotal moment in the unfolding drama."
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
□ Chapter 2: "Witnesses heard the clock strike an hour different from what is shown." is placed in the first 25% of the chapter, followed by an explicit inference or suspicion paragraph.
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
