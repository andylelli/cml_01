# Actual Prompt Record

- Run ID: `mystery-1778964730204`
- Project ID: ``
- Timestamp: `2026-05-16T20:56:27.558Z`
- Agent: `Agent9-ProseGenerator-Ch2`
- Operation: `chat_request_full_prompt`
- Model: `GPT-4o-mini`
- Temperature: `0.42`
- Max Tokens: `4500`
- Attempt: `first`
- Prompt Hash: `40b1f949722c1518`

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
- MORAL COMPLEXITY REQUIREMENT: The mechanism of this crime carries a moral gray area: "The murderer committed the act out of desperation to protect a loved one from ruin, making their intentions more sympathetic." — the culprit reveal and denouement MUST acknowledge this ambiguity. Do not let the ending feel clean or simple. Give the reader at least one moment of uncomfortable sympathy or moral doubt.


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

## Era: 1938-10
In October 1938, the world is cast in shadows of uncertainty, as the echoes of a recent past weigh heavily on the present. The lingering effects of the Great Depression are evident in the fraying social fabric, with stark class distinctions evident in the manor's opulence juxtaposed against the harsh realities faced by the working class. As the leaves turn and the chill of autumn sets in, the air is thick with tension; the distant rumblings of political discord in Europe seep into daily life, creating an undercurrent of fear and anxiety. Families gather in their lavish homes, attempting to uphold appearances, while beneath the surface, secrets fester and relationships crack under the strain of financial worries and social expectations. With Halloween approaching, the decorations feel more like ominous warnings than festive cheer, hinting at the dark revelations that lie ahead within the walls of Little Middleton Manor.
Emotional register: The collective emotional state is one of apprehension, as uncertainty and fear of the future loom large in people's minds.
Physical constraints: Communications limited to domestic telephones and slow mail services. | Transportation hindered by petrol rationing due to economic conditions. | Weather conditions affecting outdoor activities and social gatherings. | Isolation of the manor, making it difficult to seek outside help or information.
Current tensions (weave into background texture): Rising political tensions in Europe due to Nazi Germany's expansionism. | Lingering economic strain from the Great Depression affecting people's livelihoods. | Class divisions exacerbating mistrust and resentment among the wealthy and working classes.
Wartime context — Many men are still grappling with the scars of World War I, and the looming threat of another conflict weighs heavily on families.: Communities are increasingly divided, with rising nationalism and xenophobia impacting social interactions. Absence effect: The absence of family members due to military service creates a palpable void, heightening anxiety and concern for loved ones.

## Story Theme
The Clockwork Conundrum explores how the manipulation of time and trust can unravel the fabric of relationships, revealing the darker motivations hidden beneath the surface of familial love.

## Story Emotional Register
Dominant: A journey through suspense and revelation, underscored by themes of trust, ambition, and familial loyalty.

Arc:
The story opens in the haunting grandeur of Little Middleton Manor, where the atmosphere is thick with tension and foreboding as the murder of Eleanor Voss sends ripples through the family. The initial investigation reveals a ticking clock that has stopped at ten minutes past eleven, setting the stage for rising unease as Eleanor's friends and family grapple with their secrets and suspicions. As Eleanor's past with the victim comes to light, it complicates the investigation, leading to Dr. Mallory Finch's shaky alibi being scrutinized.

The mid-story pivot occurs when Finch's financial desperation surfaces, shifting the focus of the investigation toward his motives. This second turn reveals the significant impact of the clock tampering, which is crucial to understanding the murder's timeline, as witnesses recall a confrontation between Finch and Eleanor shortly before her death. As the pressure mounts, the climax sees Eleanor's friends grappling with their motives and fears, culminating in a confrontation with Finch that reveals the depths of betrayal and ambition. Ultimately, the resolution leaves each character changed; Eleanor's quest for justice forces her to confront her family's dark legacy, Finch's downfall exposes the fragility of his social standing, and the others must reckon with the emotional costs of their secrets and ambitions, forever altered by the events that transpired within the walls of the manor.

## Emotional register at this point in the story
A tense atmosphere filled with suspense as a murder disrupts the facade of family unity.

## Character Portraits (appearance & era)

### Eleanor Voss
Eleanor Voss embodies the struggles of a woman caught between familial loyalty and personal ambition. As a retired schoolteacher, she navigates a world where her nurturing spirit is overshadowed by the harsh realities of financial instability. The murder that unfolds within her family not only threatens her inheritance but also forces her to confront her resentment towards her wealthy relatives. The growing tensions in Europe echo her own internal conflicts, as she grapples with her past while trying to secure her future amidst the looming shadows of uncertainty.
Era intersection: Eleanor's financial struggles and desire for justice reflect the broader social anxieties of the 1930s, where many felt trapped by the economic aftermath and class divides.

### Dr. Mallory Finch
Dr. Mallory Finch, a dedicated physician, finds himself ensnared in a web of deceit that mirrors the political tensions of the time. As he juggles his professional responsibilities with a secret affair, the murder complicates his already precarious position. The looming threat of war amplifies his internal conflicts, as he faces the consequences of his choices amidst a society where reputation is paramount. His financial struggles add a layer of desperation to his character, making him both a sympathetic figure and a potential perpetrator.
Era intersection: Finch's experience as a physician amidst economic uncertainty highlights the precariousness of societal roles during the 1930s, where personal ambitions often clashed with moral dilemmas.

### Captain Ivor Hale
Captain Ivor Hale represents the scars of war and the pressure to uphold familial honor. As a retired military officer, he grapples with PTSD and the expectations of society while trying to navigate the ramifications of the murder. His internal battle reflects the broader societal struggles, as men like him confront their pasts while facing the uncertainties of the future. The rising tensions in Europe resonate with Ivor's own fears of inadequacy, as he seeks to restore his family's name amidst a backdrop of political unrest.
Era intersection: Ivor's experiences as a war veteran and his quest for redemption mirror the collective trauma and societal expectations of a generation grappling with the aftermath of conflict.

### Beatrice Quill
Beatrice Quill epitomizes the ambitions of a young woman caught in a web of social expectations and personal desires. Her charm and sophistication mask a relentless drive to marry into wealth, a pursuit complicated by the murder that threatens her plans. As the world outside grows more volatile, Beatrice's struggle for security becomes increasingly urgent. The class tensions of the 1930s further complicate her relationships, as she must navigate the delicate balance between loyalty to her family and her aspirations for a prosperous future.
Era intersection: Beatrice's ambitions reflect the shifting social norms of the 1930s, where women began to assert their independence while still being bound by the expectations of marriage and social standing.

## Character Voices

### Eleanor Voss (she/her/her)
Eleanor's voice carries a calm, measured tone that reflects her nurturing nature, often laced with a hint of dry wit.
[comfortable] You know, dear, teaching is much like gardening; with patience and care, one can cultivate the most beautiful blooms.
[evasive] Oh, I wouldn’t want to trouble you with my little worries. They’re hardly worth mentioning.
[stressed] I just can’t fathom how it all went so wrong. I thought we were a family.
Humour: Eleanor's dry wit adds a layer of complexity to her character, making her interactions both engaging and revealing.

### Dr. Mallory Finch (he/him/his)
Dr. Finch's voice is authoritative, often punctuated with sardonic observations that hint at his inner turmoil.
[comfortable] You know, in medicine, one learns to expect the unexpected. Life often throws us curveballs.
[evasive] Well, let's just say I'm busy with... patient matters. Nothing too pressing.
[stressed] If only life were as simple as a prescription. But alas, we are not so fortunate.
Humour: His sardonic wit highlights his internal conflicts, revealing the tension between his public persona and private anxieties.

### Captain Ivor Hale (he/him/his)
Ivor's voice is marked by a military cadence, often slipping into self-deprecating humor as he reveals his vulnerabilities.
[comfortable] In my day, we faced down enemies with honor. Now, I face my own demons.
[evasive] Ah, the garden is a fine place for reading. Much better than dealing with... other matters.
[stressed] I can't let this tarnish my family's name. I fought for honor, and I will reclaim it!
Humour: Ivor's self-deprecating humor offers a glimpse into his struggles, making him a relatable yet complex character.

### Beatrice Quill (she/her/her)
Beatrice speaks with a lively cadence, her words punctuated by dramatic flair, reflecting her ambitious spirit.
[comfortable] Darling, life is a stage, and I intend to play the leading role!
[evasive] Oh, it’s merely a small matter; I wouldn’t want to bore you with the details.
[stressed] What if this ruins everything? I can't afford to lose my chance at happiness!
Humour: Beatrice's dramatic flair infuses her interactions with energy, making her ambitions and anxieties all the more vivid.

## Location Registers (scene framing guides)

The Drawing Room: The drawing room is a battleground of unspoken tensions and hidden agendas, where every glance and whisper carries the weight of suspicion and intrigue.. Camera angle: As a writer enters this space, the emotional stance should convey an air of foreboding, hinting at the secrets lurking just beneath the surface.. Era: The opulent yet oppressive atmosphere reflects the societal expectations of the 1930s, as guests maneuver through a web of class distinctions.

The Library: The library is a sanctuary of knowledge and secrets, where the air is thick with the weight of history and the promise of revelation.. Camera angle: Entering this space, the writer should feel the tension of discovery, as every book could hold the key to unraveling the mystery.. Era: The musty scent of old books and the dim lighting create an atmosphere of introspection, echoing the struggles of the 1930s.

The Gardens: The gardens are a hauntingly beautiful labyrinth, where wildflowers bloom amid overgrown hedges, echoing the chaos and complexity of the characters' lives.. Camera angle: A writer entering this space should feel a sense of eerie tranquility, as if the beauty conceals dark secrets waiting to be unearthed.. Era: The overgrown state of the gardens reflects the societal decay of the 1930s, where appearances mask deeper issues.

The Study: The study is a chamber of contemplation and conflict, where the air is thick with the potential for both revelation and despair.. Camera angle: As a writer steps into this space, they should sense the palpable tension, as if the walls themselves are witnesses to the unfolding drama.. Era: The rich scents of aged leather and ink evoke the weight of secrets, reminding us of the societal pressures that constrain the characters.

## Humour guidance for this story position (opening)
Permission: forbidden
Rationale: The opening scene establishes a serious tone with the discovery of the murder.

FAIR-PLAY AND INFERENCE CONTRACT (from CML logic):
- False assumption in force: The murderer's motive can only be found in their immediate relationships and recent interactions.
- Hidden truth to progressively expose: Finch's financial desperation and premeditated planning that are not evident in their last interactions.
- Inference path checkpoints to dramatize clearly (observation -> correction -> effect):
  - Step 1: obs: The clock in the study shows ten minutes past eleven. | corr: This indicates a potential manipulation of time since the time of death was later. | effect: Narrows suspicion towards Dr. Mallory Finch who had access to the clock.
  - Step 2: obs: Witnesses heard a loud argument between Finch and Voss shortly before eleven. | corr: This aligns with the clock being tampered with to create an alibi for Finch during the murder. | effect: Eliminates Captain Ivor Hale, as he had no access to the clock.
  - Step 3: obs: Dust patterns on the clock suggest recent tampering. | corr: This indicates that someone adjusted the clock just before the murder. | effect: Narrows suspicion to Finch with further evidence of motive.
- Discriminating test method: trap
- Discriminating test design constraint: A comparison of the clock's time with the witness accounts reveals that Finch's alibi cannot hold under scrutiny.
- Test must rely on already-shown clue IDs: clue_1, clue_2, clue_3
- Fair-play rationale: Step 1: The clock's time (early) and witness statements (mid) show Finch's presence at the time of death. Step 2: Dust patterns (early) and financial records (mid) reveal motive and opportunity. The discriminating test proves the inconsistency of Finch's alibi.
- Never solve by withheld information. Keep reader-information parity with detective reasoning.

## Character Reference

### Eleanor Voss (she/her — NEVER he/him)
Eleanor speaks with a calm, measured tone, often using metaphors related to teaching
She has a tendency to pause thoughtfully before answering, as if weighing her words carefully.
Eleanor grapples with feelings of inadequacy and resentment, torn between her love for family and the bitterness of their neglect. The murder forces her to confront her own insecurities and question her place within the family.

### Dr. Mallory Finch (he/him — NEVER she/her)
Finch speaks with an air of authority, often punctuating his sentences with wry observations
He has a tendency to use medical jargon, but softens his language when discussing personal matters.
Dr. Finch struggles with guilt and fear, knowing that his desires could lead to exposure and disgrace. The murder forces him to confront the consequences of his choices and the truth about his own character.

### Captain Ivor Hale (he/him — NEVER she/her)
Ivor's speech is punctuated with military jargon and anecdotes, though he often softens into a more vulnerable tone when discussing personal matters
His words can be clipped when agitated.
Ivor grapples with the demons of his past, battling feelings of inadequacy and the need to prove his worth, which can lead to erratic behavior as he struggles with his PTSD.

### Beatrice Quill (she/her — NEVER he/him)
Beatrice speaks with a lively cadence, often punctuating her thoughts with exclamations
She has a penchant for dramatic flair, using gestures to emphasize her points.
Beatrice is torn between her ambitions and her loyalty to her family, grappling with the moral implications of her desires as the murder complicates her plans.


## CHARACTER CONTRACTS (binding for this scene)
Each entry below constrains how this character must be written in this chapter.
These override generic style guidance when they conflict.

### Eleanor Voss[SHE]
Voice & mannerisms: Eleanor speaks with a calm, measured tone, often using metaphors related to teaching. She has a tendency to pause thoughtfully before answering, as if weighing her words carefully.
Sample voice fragments (match this register and rhythm):
  [comfortable] "You know, dear, teaching is much like gardening; with patience and care, one can cultivate the most beautiful blooms."
  [evasive] "Oh, I wouldn’t want to trouble you with my little worries. They’re hardly worth mentioning."
Humour: dry wit — deploy occasionally (level 0.5)
FORBIDDEN phrase (never write for Eleanor Voss): "a surge of determination washed over her"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "With recent conflicts between herself and the victim regarding the family inheritance, Eleanor fears being cut off from the funds that could secure her future." — do not surface in Act I.

### Dr. Mallory Finch[HE]
Voice & mannerisms: Dr. Finch speaks with an air of authority, often punctuating his sentences with wry observations. He has a tendency to use medical jargon, but softens his language when discussing personal matters.
Sample voice fragments (match this register and rhythm):
  [comfortable] "You know, in medicine, one learns to expect the unexpected. Life often throws us curveballs."
  [evasive] "Well, let's just say I'm busy with... patient matters. Nothing too pressing."
Humour: sardonic — deploy occasionally (level 0.6)
FORBIDDEN phrase (never write for Dr. Mallory Finch): "palpable tension filled the room"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Dr. Finch yearns for the funds that could provide a new life, free from the complications of his affair, making the murder a catalyst for his desires." — do not surface in Act I.

### Captain Ivor Hale[HE]
Voice & mannerisms: Ivor's speech is punctuated with military jargon and anecdotes, though he often softens into a more vulnerable tone when discussing personal matters. His words can be clipped when agitated.
Sample voice fragments (match this register and rhythm):
  [comfortable] "In my day, we faced down enemies with honor. Now, I face my own demons."
  [evasive] "Ah, the garden is a fine place for reading. Much better than dealing with... other matters."
Humour: self deprecating — deploy occasionally (level 0.4)
FORBIDDEN phrase (never write for Captain Ivor Hale): "she knew with certainty she was right"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "He believes the victim undermined his family’s honor and legacy, pushing him to consider drastic measures." — do not surface in Act I.

### Beatrice Quill[SHE]
Voice & mannerisms: Beatrice speaks with a lively cadence, often punctuating her thoughts with exclamations. She has a penchant for dramatic flair, using gestures to emphasize her points.
Sample voice fragments (match this register and rhythm):
  [comfortable] "Darling, life is a stage, and I intend to play the leading role!"
  [evasive] "Oh, it’s merely a small matter; I wouldn’t want to bore you with the details."
Humour: blunt — deploy frequently (level 0.7)
FORBIDDEN phrase (never write for Beatrice Quill): "she chose her words with great care"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Her plans for a prosperous future hinge on securing a wealthy marriage, and the murder presents a dangerous opportunity to eliminate obstacles." — do not surface in Act I.



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
A grand estate steeped in secrets, where opulence masks simmering tensions among the elite.

Key Locations Available:
- The Drawing Room (interior): Gathering space
- The Library (interior): Clue discovery
- The Gardens (exterior): Crime scene and clue discovery
- The Study (interior): Clue discovery and private discussions

Atmosphere: Tense and foreboding, reflecting underlying class tensions and personal conflicts.
Weather: Overcast with intermittent rain, typical for the season, adding a sense of gloom.

Era markers: Petrol touring cars parked by the entrance | Early domestic telephones with party lines in the study | Typewriters clacking in the office as correspondence is prepared

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
  - Visual: Faded portraits of ancestors, Intricate ceiling moldings, Polished mahogany tables
  - Sounds: Crackling fire in the hearth, Soft murmurs of conversation, Clock ticking steadily
  - Scents: Tobacco smoke lingering in the air, Beeswax polish on furniture, Dusty old books on shelves
  - Touch: Soft velvet fabric on the sofa, Worn leather armrests

The Library (interior):
  - Visual: Dust motes dancing in the light, Leather-bound books stacked high, A globe sitting in the corner
  - Sounds: Pages turning softly, Fire crackling in the hearth, The clock chiming softly
  - Scents: Old paper and ink, Woodsmoke from the fireplace, A hint of fresh parchment
  - Touch: Worn leather of the armchair, Coolness of the marble fireplace surround

The Gardens (exterior):
  - Visual: Overgrown hedges and wildflowers, A stone fountain with moss, Faded garden statues
  - Sounds: Rustling leaves in the breeze, Birds chirping in the trees, The distant sound of rain
  - Scents: Freshly turned earth, Scent of damp flowers, Moss and wet stone
  - Touch: Coolness of damp grass underfoot, Rough texture of stone fountain

⛔ REFERENCE DATA — DO NOT TRANSCRIBE VERBATIM: The above profiles are structural guides only. Generate original prose that evokes these qualities; do not reproduce the exact phrasing or sentence structure of the profile paragraphs.

SCENE OPENING RULE: When opening a scene in a new location, write what the POV character directly observes and physically senses at that moment — not a general description of the room's qualities. The reader must feel present, not briefed. Sensory details must be observed by the character, not stated as fact about the place.

SENSORY WRITING TECHNIQUES:
- Opening paragraphs: Lead with 2-3 sensory details to ground the scene
- Movement between locations: Note sensory changes (quiet study → noisy dining room)
- Emotional scenes: Use sensory details to reinforce mood (cold rain during argument)
- Period authenticity: Use period-specific sensory details from location/temporal profiles
- Avoid: Over-reliance on visual only; use sound, smell, touch, temperature

CHAPTER SENSORY PALETT
[truncated for prompt budget]

## Texture Pool
Draw on these as opportunities arise — you are not required to use them.

- In October 1938, the world is cast in shadows of uncertainty, as the echoes of a recent past weigh heavily on the present
- The lingering effects of the Great Depression are evident in the fraying social fabric, with stark class distinctions evident in the manor's opulence juxtaposed against the harsh realities faced by the working class
- As the leaves turn and the chill of autumn sets in, the air is thick with tension; the distant rumblings of political discord in Europe seep into daily life, creating an undercurrent of fear and anxiety
- Families gather in their lavish homes, attempting to uphold appearances, while beneath the surface, secrets fester and relationships crack under the strain of financial worries and social expectations
- With Halloween approaching, the decorations feel more like ominous warnings than festive cheer, hinting at the dark revelations that lie ahead within the walls of Little Middleton Manor.

TEMPORAL CONTEXT:

This story takes place in October 1938 during N/A.

Seasonal Atmosphere:
- Weather patterns: overcast skies, intermittent rain, chilly winds
- Daylight: Shortening days with twilight settling around 5:30 PM, creating an eerie atmosphere as darkness descends quickly.
- Seasonal activities: apple picking in local orchards, attending harvest festivals, preparing for Halloween with decorations and spooky stories
- Seasonal occasions: Halloween (October 31)
- Season: N/A

Period Fashion (describe naturally):
- Men formal: three-piece wool suit with a waistcoat, tailored overcoat, straw boater hat
- Men casual: tweed jacket, corduroy trousers, knitted pullover
- Men accessories: silk tie, pocket watch, leather gloves
- Women formal: tea-length dress with a fitted bodice, tailored jacket with a peplum, wide-brimmed felt hat
- Women casual: blouse with puffed sleeves, A-line skirt, knitted cardigan
- Women accessories: beaded clutch purse, string of pearls, feathered fascinator

Cultural Context (reference naturally):
- Music/entertainment: Glen Miller's big band orchestrations, Ella Fitzgerald's jazz hits, Benny Goodman's swing music; Films: The Adventures of Robin Hood, Snow White and the Seven Dwarfs; Theatre: The Corn is Green, Pygmalion; Radio: The Shadow, Major Bowes' Original Amateur Hour
- Typical prices: Loaf of bread: 4 pence, Weekly newspaper: 3 pence, Taxi ride across town: 2 shillings
- Current events: Munich Agreement fallout and rising tensions in Europe; Nazi Germany's aggressive expansionism
- Literature: The Maltese Falcon by Dashiell Hammett | The Grapes of Wrath by John Steinbeck | Brave New World by Aldous Huxley | [mystery and detective fiction] | [social realism] | [science fiction]
- Technology: the ballpoint pen | the electric washing machine | the first commercially available television sets | domestic radio sets | typewriters in offices | petrol-powered vehicles
- Daily life: afternoon tea with friends, attending local dances, visiting the cinema on weekends
- Social rituals: formal Sunday dinners with family, weekly visits to the local pub, sending Christmas cards as early as October

Atmospheric Details:
The air is thick with the scent of damp earth and fallen leaves, a symptom of the drizzling rain that has cast a gloomy pall over the countryside. Inside the country house, the warmth of the crackling fireplace contrasts sharply with the chill outside, creating an atmosphere that feels both inviting and suffocating. The sound of rain tapping against the window panes adds to the tension, each drop a reminder of the storm brewing beyond the estate walls.

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
- Class indicators: Aristocrats discus
[truncated for prompt budget]

NON-NEGOTIABLE CHAPTER OBLIGATIONS — LOCKED EVIDENCE PHRASES (VERBATIM REQUIRED):
The following physical evidence values are absolute ground truth. Every time this chapter describes, mentions, or alludes to the relevant evidence — no matter how briefly — it MUST use the exact phrase shown below, character for character. NO paraphrase, approximation, rounding, or synonym is permitted.

FAILURE EXAMPLE: if the locked value is "at thirteen minutes to midnight" and you write "just before midnight" or "around midnight" — that is a HARD FAIL. You must write "at thirteen minutes to midnight". Equally, if the locked value is written in words, such as "ten minutes past eleven", and you convert it to figure-based clock notation — that is also a HARD FAIL. Words stay as words; figure forms are forbidden for word-phrased facts.

CRITICAL — WORD-PHRASED VALUES: If the canonical value is written out in words (e.g. a time like "ten minutes past eleven", or an amount like "forty minutes"), reproduce those exact words. DO NOT convert to figure-based time notation, twenty-four-hour format, or any other numeric shorthand. Correct: "ten minutes past eleven". WRONG: figure-based clock notation or numeric shorthand.

Locked facts:
  - The exact time shown on the stopped clock face: "ten minutes past eleven"
    ⛔ FORBIDDEN alternatives: "11:10", "11.10", "eleven ten", "eleven-ten", "eleven past ten", "quarter past eleven", "half past eleven" — the ONLY acceptable form is "ten minutes past eleven"
  - The exact amount the clock was wound back: "forty minutes"
  - The time that the murderer claimed to be at the time of the murder: "half past ten"
    ⛔ FORBIDDEN alternatives: "10:30", "10.30", "ten thirty", "ten-thirty", "ten past thirty", "quarter past ten" — the ONLY acceptable form is "half past ten"
  - The actual time of the murder: "twenty minutes past eleven"
    ⛔ FORBIDDEN alternatives: "11:20", "11.20", "eleven twenty", "eleven-twenty", "eleven past twenty", "quarter past eleven", "half past eleven" — the ONLY acceptable form is "twenty minutes past eleven"

If a locked fact has no relevance to this chapter, omit it. But the moment you reference the underlying evidence, only the exact phrase above is acceptable.

⛔ CLUES TO SURFACE IN THESE CHAPTERS — mandatory:
The following evidence MUST be clearly observable to an attentive reader. Do not bury it in atmosphere or passing dialogue. Each clue must be concrete, specific, and noticeable:

• [clue_core_contradiction_chain] Witnesses heard a loud argument between Finch and Voss shortly before eleven.
  Category: temporal | Criticality: essential | Supports inference step 1
  Points to: This contradicts the timeline provided by Finch.

For each clue above: an attentive reader should be able to find, record, and later use it to reason toward the solution.

═══ NARRATIVE STATE (read-only — do not contradict) ═══

LOCKED FACTS — use verbatim whenever this evidence is described:
  • The exact time shown on the stopped clock face: "ten minutes past eleven"
  • The exact amount the clock was wound back: "forty minutes"
  • The time that the murderer claimed to be at the time of the murder: "half past ten"
  • The actual time of the murder: "twenty minutes past eleven"

CHARACTER PRONOUNS — never deviate from these:
  • Eleanor Voss: she/her/her
  • Dr. Mallory Finch: he/him/his
  • Captain Ivor Hale: he/him/his
  • Beatrice Quill: she/her/her

CLUES ALREADY REVEALED TO READER: clue_mechanism_visibility_core — do not reveal these as new information.

INVESTIGATION LOG — WHAT IS ESTABLISHED (do not re-establish, do not repeat):
• Evidence in reader's hands: The clock in the study shows ten minutes past eleven.
• Suspects still unresolved: Eleanor Voss[SHE], Captain Ivor Hale[HE], Beatrice Quill[SHE]
⚠ The story must move FORWARD from this log. Any beat already listed above is forbidden from repeating.

⚠ THIS CHAPTER'S REQUIRED ADVANCE (opening): Discover the body, confirm the victim, note the stopped clock

CONTINUITY HANDOFF — previous chapter closing beat:
  • "As they stood in the dim light of the study, the crackling fire providing a flicker of warmth against the chill of the morning, Eleanor felt a sense of resolve wash over her. She would not let fear dictate her actions. He needed to uncover the truth behind Dr...."
  • The next chapter must open as a continuation of this beat, not as a disconnected reset.
═══════════════════════════════════════════════════════

═══════════════════════════════════════════════════════════
📚 CONTINUITY CONTEXT - CHARACTER & SETTING CONSISTENCY
═══════════════════════════════════════════════════════════

**CRITICAL: You are writing chapters 2+. Maintain consistency with earlier chapters.**

**Character Names Used in Chapters 1-1:**
Eleanor Voss

✓ RULE: Use EXACTLY these names. Do NOT vary spelling, add titles, or introduce new forms.
✓ Example: if earlier chapters used "Clara Whitfield", keep using "Clara Whitfield" — never "Mrs. Whitfield" unless that is the character's canonical name in the list above.

**Setting Vocabulary Established in Earlier Chapters:**
study

✓ RULE: Continue using this location vocabulary. Maintain consistency with established setting type.
✓ Do NOT introduce new location types that contradict earlier chapters.

**Recent Chapter Summary (for narrative continuity):**
Chapter 1: Chapter 1: Discovery
  Events: Eleanor Voss stared at the clock on the mantelpiece, her heart racing as the reality of the situation began to settle in.

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
Known location profile anchors: Little Middleton Manor, The Drawing Room, The Library, The Gardens, The Study, the study of the Voss residence
LOCATION NAME CAPITALISATION (HARD REQUIREMENT — validated):
All named locations in your prose MUST use the EXACT capitalisation from the CML profiles.
Canonical forms: "Little Middleton Manor", "The Drawing Room", "The Library", "The Gardens", "The Study", "the study of the Voss residence"
Writing a location in lowercase (e.g. "drawing room" instead of "Drawing Room") is a validated error. Every time you mention a named location, copy its capitalisation from the list above.
- Chapter 2: OPENING STYLE (HARD): Start the VERY FIRST SENTENCE with spoken dialogue — e.g. '"[words]," [Name] said/asked/replied/murmured.' The opening quote must be the first character on the line. Anchor opening in "the study of the Voss residence". HARD REQUIREMENT for the first 2 paragraphs: (a) include 2+ sensory words — choose from smell/scent/sound/echo/silence/creak/whisper/cold/warm/damp/rough/smooth/glow/shadow/flicker/dim — and (b) include 1+ atmosphere/time word — choose from rain/wind/fog/storm/mist/thunder/evening/morning/night/dawn/dusk/season/afternoon/midday/noon/midnight/twilight/sunrise/sunset/daylight/sunlight/overcast/cloudy/bright/dark. These are validated requirements, not style suggestions; missing them triggers a retry.

[⚠ INTERNAL QUALITY DIAGNOSTICS — DO NOT REPRODUCE ANY PART OF THIS SECTION IN YOUR STORY OUTPUT. These are private generator observations for your consideration only. Your narrative must read as if this section does not exist. Never include phrases from this block in character dialogue, narration, or description.]

PRIOR CHAPTER QUALITY OBSERVATIONS:
- Chapter 1 (score 82/100):
  Quality gaps noted: word density below preferred target (545/1000); scene grounding weakness
  Address in upcoming chapters: Increase chapter density with concrete investigation action and sensory-grounded beats; avoid recap-only padding. | Open next chapter with a named location anchor plus at least two sensory cues and one atmosphere marker.
[END INTERNAL DIAGNOSTICS]

PROMPT BUDGET SUMMARY: budget=32000 tokens; fixed=6442; context=11400; dropped=[none]; truncated=[pronoun_accuracy, location_profiles, temporal_context]

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
8. Integrate at least two concrete era-grounded details per chapter from setting refinement signals: petrol touring cars on county roads | early domestic telephones with party lines | typewriters standard in offices | telegrams sent via local post offices | aerial mail for urgent correspondence | telephone communication for immediate contact.
9. Respect setting movement/access constraints in scene action and alibis: sprawling layout with multiple levels and hidden corners | gated access restricting entry to authorized personnel | weather conditions affecting outdoor evidence visibility | restricted areas such as private quarters and the library | daily routines determining access times to various parts of the estate.
10. Sustain social coherence with this backdrop pressure: A gathering at the estate for a family reunion amid economic strain and rising political tensions forces a diverse group of heirs and staff to confront their intertwined fates under the shadow of a looming inheritance dispute.
11. Maintain continuity around these socially central cast anchors where relevant: Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill.
12. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Critical: Plot similarity 0.88 with 'The Mysterious Affair at Styles' (same temporal axis and murder mystery structure)
13. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Moderate: Character similarity 0.80 with 'The Mysterious Affair at Styles' (similar cast structure and roles)
14. STORY TO DATE ANTI-COPY RULE: The STORY TO DATE section below is provided for chronological and factual reference ONLY. You MUST NOT copy, lightly rephrase, or structurally echo any sentence or paragraph from prior chapters. Every sentence in this chapter must be original prose unique to this scene. Reusing even a clause from prior chapter text will cause this attempt to fail immediately.

CRITICAL PROSE REQUIREMENTS:

The CML specifies exact requirements for certain validation-critical scenes. You MUST include these elements at the specified positions.

**Discriminating Test Scene (Act 3, Scene 4):**
Required elements: Execute the discriminating test, Observe the culprit's reaction or result, Draw conclusion about guilt
Test type: temporal

**Suspect Clearance Scenes:**
- Captain Ivor Hale (Act 3, Scene 5): Proving Hale was elsewhere during the argument.
  Clues: clue_id_1, clue_id_2
- Beatrice Quill (Act 3, Scene 6): Clearing Beatrice through her consistent testimony and lack of motive.
  Clues: clue_id_3, clue_id_4

**Culprit Revelation Scene (Act 3, Scene 7):**
Method: Confrontation with evidence

**Identity Protection Rules:**
Character: Eleanor Voss
- Before Act 3: refer as "the detective"
- From Act 3 onward: refer as "Eleanor"

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
  - STRUCTURAL ARCHETYPE — Chapter 2 must be: FIRST_CONTACT
      ✓ MUST contain: at least two suspect interviews
      ✗ MUST NOT contain: physical evidence discovery
  - Word count: Target 1250 words. Achieve this through plot events, dialogue exchanges, and physical investigation — not through atmospheric repetition or extended internal reflection. Each 200-word segment should contain at minimum one concrete story event (a discovery, a conversation exchange, a physical action or movement). Padding with atmosphere alone is not acceptable.
  - Opening: Begin with a character action, spoken line, or clock/time marker — never a location name or location-description phrase.
  - Scene is set in: the study of the Voss residence — reference it naturally within the paragraph, never as your opening phrase.
  - Opening atmosphere (MANDATORY — validator enforced): the first paragraph MUST contain at least one of: rain / wind / fog / storm / mist / thunder / evening / morning / night / dawn / dusk / season / afternoon / midday / noon / midnight / twilight / sunrise / sunset / daylight / sunlight / overcast / cloudy / bright / dark. A chapter that omits all of these from its opening paragraph will be rejected.
  - Continuity bridge: in the first 120 words, visibly connect from the previous chapter's final beat. Carry forward one unresolved element (object, accusation, emotional pressure, or immediate physical action) from: "As they stood in the dim light of the study, the crackling fire providing a flicker of warmth against the chill of the morning, Eleanor felt a sense of resolve wash over her. She would not let fear dictate her actions. H...".
  - CLUE OBLIGATIONS — mandatory prose elements (do NOT omit or bury):
    • Witnesses heard a loud argument between Finch and Voss shortly before eleven. [clue_core_contradiction_chain] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: This contradicts the timeline provided by Finch.
      ↳ MANDATORY TWO-PARAGRAPH STRUCTURE (must appear in paragraphs 1 or 2 — no later):
         Paragraph 1: The POV character physically approaches or directly observes this evidence.
           The narration or dialogue explicitly states what is seen (use the exact locked phrase if one applies).
         Paragraph 2 (immediately following): The detective or POV character explicitly reasons
           about what this evidence implies — who it implicates, why it may be unreliable,
           or what inference it supports. This must be a separate full paragraph, not a sentence appended to Paragraph 1.
  - Tonal contrast: include at least one beat of relief or ironic counterpoint. Do not sustain maximum tension for every paragraph.
  - Sensory obligation — use at least two of: Shadows growing longer, Flickering candlelight | Silence broken by the clock, Pages turning softly | Dusty tomes and ink. Mood: Contemplative.
- Locked fact phrase obligations:
  - If this batch mentions The exact time shown on the stopped clock face, write exactly: "ten minutes past eleven".
  - If this batch mentions The exact amount the clock was wound back, write exactly: "forty minutes".
  - If this batch mentions The time that the murderer claimed to be at the time of the murder, write exactly: "half past ten".
  - If this batch mentions The actual time of the murder, write exactly: "twenty minutes past eleven".
- Seasonal vocabulary allow-list: autumn, autumnal, fall.
- Forbidden seasonal words: spring, summer, winter.

FROZEN TIMELINE STATE (DO NOT ALTER):
- Timeline anchor: October (autumn).
- Month, season, weather, and time-of-year language in this batch must stay compatible with autumn.
- Established timeline fact: Eleanor's last seen time at ten past eleven.
- Established timeline fact: The clock showing time discrepancies.
- If referenced, use exact time phrase: "ten minutes past eleven" (The exact time shown on the stopped clock face).
- If referenced, use exact time phrase: "forty minutes" (The exact amount the clock was wound back).
- If referenced, use exact time phrase: "half past ten" (The time that the murderer claimed to be at the time of the murder).
- If referenced, use exact time phrase: "twenty minutes past eleven" (The actual time of the murder).

STORY TO DATE (REFERENCE ONLY — DO NOT COPY VERBATIM):
- Full prior chapter text is provided below for continuity, factual consistency, and reference accuracy.
- Use this to keep character voice, chronology, clue state, and location continuity aligned with earlier chapters.
- Do not quote, copy, or paraphrase these paragraphs too closely; write fresh prose that remains consistent with them.

--- BEGIN PRIOR CHAPTER 1 ---
Title: Chapter 1: Discovery
Eleanor Voss stared at the clock on the mantelpiece, her heart racing as the reality of the situation began to settle in. The steady rhythm of rain drummed against the window, each drop a reminder of the chaos that had unfolded within the walls of the study. The dim light filtering through the overcast sky cast long shadows across the room, highlighting the dust motes that danced in the air. The scent of damp wood and leather filled her nostrils, a stark contrast to the warmth of the fire crackling in the hearth. This was not how she had envisioned the morning after the family gathering.

As her gaze fell upon the clock, she noted the time it displayed: "ten minutes past eleven." The implications of this detail sent a chill down her spine. The clock, once a mere fixture of the room, now stood as a silent witness to the tragedy that had unfolded. Dr. Finch lay sprawled on the floor, his lifeless form a stark reminder of the fragility of life. Eleanor felt a wave of nausea wash over her as she recalled the argument they had shared just hours before. What had transpired in this very room to lead to such a catastrophic end?

The realization struck her with force. If Dr. Finch had died no later than "twenty minutes past eleven," as the clock suggested, then his alibi for the time of death was in question. The implications of this revelation began to swirl in his mind, intertwining with the memories of their heated exchange. Had he truly been innocent, or was there something more sinister at play? The clock's hands, frozen in time, seemed to mock his as he grappled with the uncertainty of the situation.

Eleanor's thoughts were interrupted by the sound of footsteps approaching. Captain Hale entered the study, his expression a blend of confusion and grief. He took in the scene before him, his eyes widening as they landed on Finch's body. "What happened here?" he asked, his voice strained. Eleanor struggled to find the words, the weight of the moment pressing heavily upon her. She gestured toward the clock, her voice barely above a whisper. "It shows ten minutes past eleven. She... she was dead before that time, Ivor. We need to figure out what happened."

Ivor knelt beside the body, her brow furrowing as she examined the scene. "This is a locked room mystery, isn't it?" she said, her tone shifting to one of determination. "Every suspect had access to the victim, and yet..." She trailed off, the gravity of their situation settling in. Eleanor nodded, her mind racing as she considered the implications of their findings. They were now entangled in a web of secrets and lies, each thread leading them deeper into a mystery that threatened to unravel their lives.

As they stood in the dim light of the study, the crackling fire providing a flicker of warmth against the chill of the morning, Eleanor felt a sense of resolve wash over her. She would not let fear dictate her actions. He needed to uncover the truth behind Dr. Finch's death, no matter the cost. The clock, with its frozen hands, would not be the only thing that needed to be set right.
--- END PRIOR CHAPTER 1 ---

[SCENE COMPLETENESS CONTRACTS — MANDATORY. Each contract below lists what you MUST enact in that chapter. Do not summarise or mention these labels in the prose — enact them organically.]
Chapter 2 (Act 1) completeness contract:
  PIVOT ELEMENT (MANDATORY — write this into the prose, shown not told): "The conflicting alibis surrounding the time of death"
  FACT ESTABLISHED (MANDATORY — reader must know this by chapter end): "Establishes that multiple suspects have questionable alibis regarding the timeline."

# Case Overview
Title: The Clockwork Conundrum
Era: 1930s
Setting: Little Middleton
Crime: murder (mechanical clock-tampering)
Culprit: Dr. Mallory Finch
False assumption: The murderer's motive can only be found in their immediate relationships and recent interactions.
Cast: Eleanor Voss (she/her), Dr. Mallory Finch (he/him), Captain Ivor Hale (he/him), Beatrice Quill (she/her)

Setting Lock: Keep all scenes and descriptions consistent with the stated setting (Little Middleton). Do not introduce a different location type.

Outline scenes:
[
  {
    "sceneNumber": 2,
    "act": 1,
    "title": "Initial Reactions",
    "setting": {
      "location": "the study of the Voss residence",
      "timeOfDay": "Morning after the murder",
      "atmosphere": "Confused and anxious"
    },
    "characters": [
      "Eleanor Voss",
      "Dr. Mallory Finch",
      "Captain Ivor Hale",
      "Beatrice Quill"
    ],
    "purpose": "Establish relationships and initial alibis",
    "cluesRevealed": [
      "clue_core_contradiction_chain"
    ],
    "dramaticElements": {
      "conflict": "Tension among characters grows as they recount their whereabouts",
      "tension": "Each character's alibi begins to clash with the timeline",
      "microMomentBeats": [
        "Eleanor feels a pang of doubt as she hears Hale's shaky voice."
      ]
    },
    "summary": "As the group gathers around the body, they begin to discuss their whereabouts during the time of death. Tensions rise as conflicting alibis emerge, hinting at deeper connections and motives.",
    "estimatedWordCount": 1800,
    "pivotElement": "The conflicting alibis surrounding the time of death",
    "factEstablished": "Establishes that multiple suspects have questionable alibis regarding the timeline.",
    "permittedBehavioursByAct": [
      {
        "characterName": "Eleanor Voss",
        "behaviour": "cooperative grief; no guilt-tells in Act I"
      },
      {
        "characterName": "Dr. Mallory Finch",
        "behaviour": "normal social behaviour; grief or confusion"
      },
      {
        "characterName": "Captain Ivor Hale",
        "behaviour": "normal social behaviour; grief or confusion"
      },
      {
        "characterName": "Beatrice Quill",
        "behaviour": "normal social behaviour; grief or confusion"
      }
    ],
    "redHerringPlacement": null,
    "emotionalRegister": "Rising unease as suspicions and secrets begin to surface among the characters.",
    "dominantCharacterNote": {
      "name": "Eleanor Voss",
      "voiceRegister": "Eleanor's voice carries a calm, measured tone that reflects her nurturing nature, often laced with a hint of dry wit."
    },
    "humourGuidance": {
      "permission": "permitted",
      "character": "Eleanor Voss",
      "form": "dry_wit"
    },
    "eraTextureNote": "Communications limited to domestic telephones and slow mail services.; Transportation hindered by petrol rationing due to economic conditions.; Weather conditions affecting outdoor activities and social gatherings.; Isolation of the manor, making it difficult to seek outside help or information.; The need for formal attire at social events, adding pressure to maintain appearances.",
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
□ Chapter 2: "Witnesses heard a loud argument between Finch and Voss shortly before eleven." is placed in the first 25% of the chapter, followed by an explicit inference or suspicion paragraph.
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
