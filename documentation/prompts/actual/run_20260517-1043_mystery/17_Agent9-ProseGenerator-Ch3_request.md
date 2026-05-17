# Actual Prompt Record

- Run ID: `mystery-1779014601617`
- Project ID: ``
- Timestamp: `2026-05-17T11:48:39.822Z`
- Agent: `Agent9-ProseGenerator-Ch3`
- Operation: `chat_request_full_prompt`
- Model: `GPT-4o-mini`
- Temperature: `0.42`
- Max Tokens: `4500`
- Attempt: `first`
- Prompt Hash: `6c0a752950ad2889`

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
- MORAL COMPLEXITY REQUIREMENT: The mechanism of this crime carries a moral gray area: "The murderer was driven to desperation by a long-standing feud, and their actions stem from a perceived injustice rather than pure malice." — the culprit reveal and denouement MUST acknowledge this ambiguity. Do not let the ending feel clean or simple. Give the reader at least one moment of uncomfortable sympathy or moral doubt.


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

## Era: 1938-05
In May 1938, life unfolds under the heavy shadow of the Great Depression, where the contrast between the ostentatious lifestyles of the upper class and the struggles of the working poor grows starker. The overcast skies seem to echo the gloom that permeates society, as whispers of political unrest and class tensions fill the air. The social elite clings to their lavish gatherings, hoping to mask the economic realities that threaten their way of life. Women adorn themselves in elegant tea-length dresses, while men don tailored suits, both seeking to maintain a facade of normalcy amid the uncertainty. Yet, behind closed doors, the weight of financial despair and the fear of exposure loom large, shaping interactions steeped in anxiety and rivalry.
Emotional register: A pervasive sense of anxiety and uncertainty grips society as individuals grapple with the fear of financial ruin.
Physical constraints: Travel is limited due to economic conditions and fuel shortages. | Communication relies heavily on letters and telegrams, slowing response times. | The weather often hampers outdoor activities, restricting social interactions.
Current tensions (weave into background texture): Rising tensions in Europe due to Nazi Germany's expansionist policies. | The political climate is fraught with anxiety over fascist movements. | Lingering economic hardship with high unemployment rates.
Wartime context — The looming threat of war casts a shadow over the lives of many, particularly veterans like Captain Hale.: Society is beginning to shift, with women entering the workforce and challenging traditional roles. Absence effect: Many families feel the strain of absent loved ones, either due to the war or economic displacement.

## Story Theme
In a society plagued by economic despair, the quest for social standing can drive individuals to desperate acts, revealing the fragility of human connections, and reveals that evidence carries ethical weight, forcing characters to choose accountability over social performance when appearances and facts collide.

## Story Emotional Register
Dominant: A tense exploration of desperation and betrayal unfolds in the shadow of social decay.

Arc:
The story opens within the grand, yet foreboding Hawthorne Manor, where the air is thick with overcast skies and the whispers of a gathering steeped in tension. Eleanor Voss, the charming socialite, is found dead, and the timing of her murder becomes entangled with the clock's tampering, setting the stage for an investigation that promises to unravel hidden secrets. As the investigation unfolds, initial clues lead to rising unease, with Dr. Mallory Finch's nervous disposition and Captain Ivor Hale's charm masking deeper vulnerabilities. The emotional cost weighs heavily on Beatrice Quill, who grapples with her feelings for Hale while navigating the social labyrinth of suspicion.

A mid-story pivot occurs when the clock’s tampering is revealed, shifting the focus to the suspects and deepening the intrigue. The tension escalates as Beatrice must confront her own feelings and loyalties while piecing together the fragmented narrative. The climax hits when the evidence points toward the carefully constructed motives of Dr. Finch, culminating in a confrontation that promises to expose the truth. As the dust settles, the characters are left to grapple with the emotional toll of betrayal and the fragility of their social connections, leading to a resolution that carries the weight of their choices and the looming specter of economic despair.

## Emotional register at this point in the story
Initial clues introduce a growing sense of anxiety among the characters.

## Character Portraits (appearance & era)

### Eleanor Voss
Eleanor Voss embodies the struggles of maintaining social status amid economic turmoil. As a wealthy socialite, she fears exposure of her financial troubles could lead to ostracization. Her charm masks the anxiety of potential ruin.
Era intersection: Her plight highlights the pressure on the elite to uphold appearances while grappling with the realities of the Great Depression.

### Dr. Mallory Finch
Dr. Finch's role as a respected physician conflicts with his desperate financial situation, stemming from gambling debts. His unrequited love for Eleanor complicates his emotions, making him vulnerable in a time of social upheaval.
Era intersection: His struggle reflects the societal pressures facing professionals in a collapsing economy, where reputation and financial stability are closely intertwined.

### Captain Ivor Hale
Captain Hale's past as a war veteran haunts him as economic pressures mount. He grapples with the fear that his secrets could jeopardize his standing in a community that admires him yet is suspicious of his past.
Era intersection: His character illustrates the burden of reputation during a time when class and honor are heavily scrutinized amidst economic decline.

### Beatrice Quill
Beatrice Quill navigates social circles with dreams of becoming a successful writer while feeling overshadowed by Eleanor. Her romantic feelings for Captain Hale complicate her aspirations amid the class tensions of the era.
Era intersection: Her struggles to assert her identity reflect the changing roles of women in society as they challenge the traditional norms that confine them.

## Character Voices

### Eleanor Voss (she/her/her)
Eleanor speaks with a melodic cadence, her words carefully chosen to weave charm and wit together.
[comfortable] Oh, darling, isn't it just the loveliest evening for a gathering? I can hardly contain my excitement.
[evasive] Really, I can't recall the details, it was all rather a blur, wasn't it?
[stressed] The clock... it struck at what time? My mind seems to be racing ahead of me.
Humour: Eleanor employs polite savagery, often lacing her comments with sharp wit.

### Dr. Mallory Finch (he/him/his)
Dr. Finch speaks with a measured tone, often laced with a hint of irony.
[comfortable] Ah, the joys of medicine, where every patient is a new puzzle to solve.
[evasive] I was merely attending to a patient; it's not as exciting as it sounds, really.
[stressed] No, of course not! I was with someone at that time, tending to... well, you know how it is.

### Captain Ivor Hale (he/him/his)
Captain Hale speaks in a gravelly tone, his words deliberate and measured.
[comfortable] In the army, we learned to trust no one, but sometimes you find trust in the most unlikely places.
[evasive] I was just inspecting the grounds, nothing to concern yourself with, I assure you.
[stressed] My past? It’s buried, and buried it shall remain. No need to rattle old skeletons.

### Beatrice Quill (she/her/her)
Beatrice speaks with a lyrical quality, her words flowing like prose.
[comfortable] Ah, love, the sweetest of muses, ever elusive yet impossible to ignore.
[evasive] Oh, I was merely lost in thought, you know how writers can be, ever wandering.
[stressed] How could I possibly compete with her? Every glance from him sends my heart racing.
Humour: Beatrice often employs self-deprecating humor, reflecting her insecurities.

## Location Registers (scene framing guides)

The Drawing Room: The drawing room feels suffocating, where echoes of laughter now clash with the heavy silence of dread and uncertainty. Every shadow seems to harbor secrets, and the air is thick with the scent of past gatherings, now tainted by the weight of tragedy.. Camera angle: As a writer enters, they should feel the oppressive atmosphere, heavy with anticipation and a sense of foreboding.. Era: The opulence of the room starkly contrasts with the underlying tensions of the Great Depression.

The Library: The library offers a sanctuary filled with stories, yet it hums with tension, as the secrets buried in the books reflect the hidden truths of its occupants. Dust motes dance in the light, symbolizing the fleeting nature of hope amidst uncertainty.. Camera angle: Entering this space evokes a sense of introspection, urging the writer to explore the hidden narratives that lie within.. Era: The library's quietude is disrupted by the realities of life outside, where economic struggles loom large.

Servants' Quarters: The servants' quarters buzz with camaraderie, yet an undercurrent of tension simmers as staff navigate the realities of class disparity. It feels both cozy and claustrophobic, a place of refuge amidst the looming shadows of the manor above.. Camera angle: As a writer enters, they should sense the warmth of shared stories but also the weight of unspoken tensions.. Era: The quarters reflect the stark contrast between the lives of the staff and the upper classes they serve.

## Humour guidance for this story position (early)
Permission: forbidden
Rationale: The seriousness of the murder investigation calls for a somber tone.

## Reveal Groundwork (texture — do not explain, only plant)
- Plant one subtle observable beat related to: "In the early investigation, the discrepancy between the clock's reading and Eleanor's time of death foreshadows the deeper layers of deception". Do not explain significance yet.
- Plant one subtle observable beat related to: "The clock's tampering reveals the lengths to which individuals will go to protect their secrets". Do not explain significance yet.
- Plant one subtle observable beat related to: "The final confrontation with Dr". Do not explain significance yet.

FAIR-PLAY AND INFERENCE CONTRACT (from CML logic):
- False assumption in force: The murder occurred at the time the clock indicated.
- Hidden truth to progressively expose: The actual time of the murder was significantly earlier than indicated.
- Inference path checkpoints to dramatize clearly (observation -> correction -> effect):
  - Step 1: obs: Witnesses recall the clock striking ten minutes past eleven. | corr: This contradicts Eleanor's estimated time of death. | effect: Narrows investigation focus to the clock's integrity.
  - Step 2: obs: The clock mechanism shows signs of recent tampering. | corr: This indicates someone manipulated the clock. | effect: Narrows suspect pool to those with access to the mechanism.
  - Step 3: obs: Dr. Mallory Finch had access to the clock prior to the murder. | corr: This establishes a motive linked to his financial troubles. | effect: Eliminates Captain Ivor Hale from suspicion.
- Discriminating test method: trap
- Discriminating test design constraint: A controlled examination of the clock reveals the tampering and confirms the false timeline.
- Test must rely on already-shown clue IDs: clue_1, clue_2, clue_3, clue_5, clue_8
- Fair-play rationale: Step 1: The clock's striking time (early) and witness accounts (mid) let the reader understand the timeline discrepancy. Step 2: The tampering evidence (mid) eliminates Captain Hale as a suspect. Step 3: Dr. Finch's access to the clock confirms his culpability through the discriminating test.
- Never solve by withheld information. Keep reader-information parity with detective reasoning.

## Character Reference

### Eleanor Voss (she/her — NEVER he/him)
Eleanor speaks with a melodic cadence, her words carefully chosen to weave charm and wit together
She has a penchant for dramatic pauses that draw her listeners in, often punctuating her sentences with a raised eyebrow or a knowing smile.
Eleanor grapples with a profound internal conflict; she knows that to secure her future, she may have to manipulate those around her, including her closest friends. The thought of betraying her principles for the sake of her reputation gnaws at her.

### Dr. Mallory Finch (he/him — NEVER she/her)
Finch speaks with a measured tone, his words chosen with precision, often laced with a hint of irony
He possesses a tendency to use medical analogies in conversation, deftly blending humor with the gravity of his profession.
Dr. Finch is tormented by his feelings for Eleanor, caught between his duty as a physician and his desire for her affection. The ethics of his profession weigh heavily on him, as he struggles to reconcile his personal desires with his responsibilities.

### Captain Ivor Hale (he/him — NEVER she/her)
Captain Hale speaks in a gravelly tone, his words deliberate and measured
He often punctuates his sentences with anecdotes from his military days, revealing a dry sense of humor that belies the gravity of his past.
Haunted by his past actions, Captain Hale wrestles with guilt and fear of exposure. The prospect of his secrets being revealed torments him, forcing him to confront the man he once was and the man he strives to be.

### Beatrice Quill (she/her — NEVER he/him)
Beatrice speaks with a lyrical quality, her words often flowing like prose
She has a tendency to lose herself in her thoughts, trailing off mid-sentence as new ideas capture her imagination.
Beatrice wrestles with feelings of inadequacy and jealousy, torn between her admiration for Eleanor and her desire to carve out her own identity as a writer and as a woman.


## CHARACTER CONTRACTS (binding for this scene)
Each entry below constrains how this character must be written in this chapter.
These override generic style guidance when they conflict.

### Eleanor Voss[SHE]
Voice & mannerisms: Eleanor speaks with a melodic cadence, her words carefully chosen to weave charm and wit together. She has a penchant for dramatic pauses that draw her listeners in, often punctuating her sentences with a raised eyebrow or a knowing smile.
Sample voice fragments (match this register and rhythm):
  [comfortable] "Oh, darling, isn't it just the loveliest evening for a gathering? I can hardly contain my excitement."
  [evasive] "Really, I can't recall the details, it was all rather a blur, wasn't it?"
Humour: polite savagery — deploy occasionally (level 0.5)
FORBIDDEN phrase (never write for Eleanor Voss): "she felt a wave of unease"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Eleanor stands to lose her social connections if the victim reveals her financial troubles, a revelation that could shatter her carefully constructed facade." — do not surface in Act I.

### Dr. Mallory Finch[HE]
Voice & mannerisms: Dr. Finch speaks with a measured tone, his words chosen with precision, often laced with a hint of irony. He possesses a tendency to use medical analogies in conversation, deftly blending humor with the gravity of his profession.
Sample voice fragments (match this register and rhythm):
  [comfortable] "Ah, the joys of medicine, where every patient is a new puzzle to solve."
  [evasive] "I was merely attending to a patient; it's not as exciting as it sounds, really."
Humour: dry wit — deploy occasionally (level 0.4)
FORBIDDEN phrase (never write for Dr. Mallory Finch): "a surge of determination washed over her"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Dr. Finch fears that an affair between Eleanor and the victim may ruin his chance at winning her heart, leading him to consider actions he would never have imagined." — do not surface in Act I.

### Captain Ivor Hale[HE]
Voice & mannerisms: Captain Hale speaks in a gravelly tone, his words deliberate and measured. He often punctuates his sentences with anecdotes from his military days, revealing a dry sense of humor that belies the gravity of his past.
Sample voice fragments (match this register and rhythm):
  [comfortable] "In the army, we learned to trust no one, but sometimes you find trust in the most unlikely places."
  [evasive] "I was just inspecting the grounds, nothing to concern yourself with, I assure you."
Humour: observational — deploy rarely (level 0.3)
FORBIDDEN phrase (never write for Captain Ivor Hale): "everyone could sense the atmosphere"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "The victim possesses knowledge that could expose Captain Hale's dark secrets from his military service, a revelation that would shatter his reputation and freedom." — do not surface in Act I.

### Beatrice Quill[SHE]
Voice & mannerisms: Beatrice speaks with a lyrical quality, her words often flowing like prose. She has a tendency to lose herself in her thoughts, trailing off mid-sentence as new ideas capture her imagination.
Sample voice fragments (match this register and rhythm):
  [comfortable] "Ah, love, the sweetest of muses, ever elusive yet impossible to ignore."
  [evasive] "Oh, I was merely lost in thought, you know how writers can be, ever wandering."
Humour: self deprecating — deploy occasionally (level 0.4)
FORBIDDEN phrase (never write for Beatrice Quill): "she knew with certainty she was right"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Beatrice feels overshadowed by Eleanor's social status and fears losing Hale to her, a rivalry that stirs a complicated mix of admiration and jealousy within her." — do not surface in Act I.



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

Primary Location: Hawthorne Manor (Little Middleton, England)
Hawthorne Manor stands as a testament to the opulence of a bygone era, its grand architecture and sprawling gardens now overshadowed by economic strife and hidden secrets.

Key Locations Available:
- The Drawing Room (interior): Crime scene
- The Library (interior): Clue discovery
- Servants' Quarters (interior): Gathering space for staff

Atmosphere: Tense, with underlying class tensions exacerbated by economic hardship.
Weather: Overcast with occasional rain, creating a gloomy ambiance suitable for a mystery.

Era markers: Petrol touring cars parked along the gravel drive | Typewriter clacking in the study | Flickering gas lamps casting uneven shadows

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
  - Visual: Flickering gas lamps casting shadows, Family portraits lining the walls, Delicate china on the mantelpiece
  - Sounds: Rain pattering against the windows, Clock ticking in the silence, A distant thunder rumbling
  - Scents: Dusty upholstery, Scent of polished wood, Lingering perfume from earlier gatherings
  - Touch: Soft velvet of the armchairs, Coolness of the marble fireplace

The Library (interior):
  - Visual: Rows of dusty leather-bound volumes, Sunlight filtering through the window, A globe sitting in the corner
  - Sounds: Pages turning quietly, Soft footsteps on the wooden floor, The creak of the window opening
  - Scents: Old paper and ink, Dust motes in the sunlight, Faint whiff of musty wood
  - Touch: Smooth leather covers under fingertips, Coolness of the marble table

Servants' Quarters (interior):
  - Visual: Simple wooden furniture, Faded wallpaper peeling at the edges, A small fire flickering in the hearth
  - Sounds: Laughter and whispers among the staff, The crackle of the fire, Footsteps in the corridor
  - Scents: Freshly laundered linens, Scent of cooking coming from the kitchen, Faint hint of coal smoke
  - Touch: Rough wool blankets on the beds, Coolness of the stone floor

⛔ REFERENCE DATA — DO NOT TRANSCRIBE VERBATIM: The above profiles are structural guides only. Generate original prose that evokes these qualities; do not reproduce the exact phrasing or sentence structure of the profile paragraphs.

SCENE OPENING RULE: When opening a scene in a new location, write what the POV character directly observes and physically senses at that moment — not a general description of the room's qualities. The reader must feel present, not briefed. Sensory details must be observed by the character, not stated as fact about the place.

SENSORY WRITING TECHNIQUES:
- Opening paragraphs: Lead with 2-3 sensory details to ground the scene
- Movement between locations: Note sensory changes (quiet study → noisy dining room)
- Emotional scenes: Use sensory details to reinforce mood (cold rain during argument)
- Period authenticity: Use period-specific sensory details from location/temporal profiles
- Avoid: Over-reliance on visual
[truncated for prompt budget]

## Texture Pool
Draw on these as opportunities arise — you are not required to use them.

- In May 1938, life unfolds under the heavy shadow of the Great Depression, where the contrast between the ostentatious lifestyles of the upper class and the struggles of the working poor grows starker
- The overcast skies seem to echo the gloom that permeates society, as whispers of political unrest and class tensions fill the air
- The social elite clings to their lavish gatherings, hoping to mask the economic realities that threaten their way of life
- Women adorn themselves in elegant tea-length dresses, while men don tailored suits, both seeking to maintain a facade of normalcy amid the uncertainty
- Yet, behind closed doors, the weight of financial despair and the fear of exposure loom large, shaping interactions steeped in anxiety and rivalry.

TEMPORAL CONTEXT:

This story takes place in May 1938 during spring.

Seasonal Atmosphere:
- Weather patterns: overcast skies, occasional rain showers, cool breezes
- Daylight: Days are lengthening with sunlight fading around eight o'clock in the evening, but the gloom of clouds often prevails.
- Seasonal activities: gardening and spring planting, local fairs and markets featuring seasonal produce, picnics in the countryside if the weather permits
- Seasonal occasions: May Day celebrations on May 1st, Whitsun holiday approaching in late May
- Season: spring

Period Fashion (describe naturally):
- Men formal: tailored three-piece suit in dark wool, starched white dress shirt, silk tie with geometric patterns
- Men casual: tweed jacket with elbow patches, slack trousers, knitted v-neck sweater
- Men accessories: fedora hat, leather gloves, pocket watch
- Women formal: tea-length dress with a fitted bodice and flared skirt, matching bolero jacket, periwinkle blue silk scarf
- Women casual: light cotton blouse, high-waisted skirt, simple cardigan
- Women accessories: straw cloche hat, beaded handbag, pearl earrings

Cultural Context (reference naturally):
- Music/entertainment: Glenn Miller's big band sounds, Ella Fitzgerald's jazz tunes, Benny Goodman's swing music; Films: The Adventures of Robin Hood, Snow White and the Seven Dwarfs; Theatre: The Lady's Not for Burning, The Glass Menagerie; Radio: The Shadow, Fibber McGee and Molly
- Typical prices: Loaf of bread: four pence, Pint of milk: three pence, Taxi fare across town: two shillings
- Current events: Rising tension in Europe due to Nazi Germany's expansionist policies; Political unrest in Spain stemming from the Spanish Civil War
- Literature: The Maltese Falcon by Dashiell Hammett | The Big Sleep by Raymond Chandler | Brave New World by Aldous Huxley | [mystery and detective fiction] | [social realism] | [science fiction]
- Technology: the electric refrigerator becoming common in households | advancements in radio technology allowing clearer broadcasts | the introduction of the first commercial television broadcasts | wireless radios in homes | typewriters in offices | early model automobiles for private use
- Daily life: attending local markets on weekends, participating in community fairs, spending evenings listening to the radio
- Social rituals: formal afternoon tea gatherings, Sunday church services followed by family dinners

Atmospheric Details:
The scent of damp earth mingled with blooming lilacs fills the air as rain falls softly against the manor's stone walls. A low hum of distant thunder rumbles, punctuating the heavy silence that envelops the estate, casting a sense of foreboding. The flickering of candlelight against the darkened windows creates an eerie glow, hinting at the secrets concealed within the manor's depths.

FASHION INTEGRATION TECHNIQUES:
- First appearance: Describe outfit to establish class/personality
- Accessories: Gloves, hats, pocket watches, jewelry reveal status
- Time-specific: Different outfits for different times of day
- Character traits: Fastidious dresser vs rumpled appearance
- Action integration: "She tugged at her glove" or "He adjusted his tie"
- Weather appropriate: Overcoats in winter, light linen in summer

CULTURAL TOUCHSTONE INTEGRATION:
- Casual conversation: "Did you hear that new jazz record?" or "I saw th
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

═══ NARRATIVE STATE (read-only — do not contradict) ═══

LOCKED FACTS — use verbatim whenever this evidence is described:
  • The exact time shown on the stopped clock face: "ten minutes past eleven"
  • The exact amount the clock was wound back: "forty minutes"

CHARACTER PRONOUNS — never deviate from these:
  • Eleanor Voss: she/her/her
  • Dr. Mallory Finch: he/him/his
  • Captain Ivor Hale: he/him/his
  • Beatrice Quill: she/her/her

CLUES ALREADY REVEALED TO READER: clue_mechanism_visibility_core, clue_core_contradiction_chain — do not reveal these as new information.

INVESTIGATION LOG — WHAT IS ESTABLISHED (do not re-establish, do not repeat):
• Evidence in reader's hands: The mechanism relies on clock, establish, and witness to expose the false timing. | Witnesses recall the clock striking ten minutes past eleven.
• Suspects still unresolved: Eleanor Voss[SHE], Captain Ivor Hale[HE], Beatrice Quill[SHE]
⚠ The story must move FORWARD from this log. Any beat already listed above is forbidden from repeating.

⚠ THIS CHAPTER'S REQUIRED ADVANCE (early): Interview each suspect — record their claimed whereabouts

CONTINUITY HANDOFF — previous chapter closing beat:
  • "Finally, Beatrice took a step back, her mind racing as she tried to piece together the fragments of their stories. "We need to confront these contradictions head-on. If we are to find out what truly happened, we must be honest with one another," she said, her..."
  • The next chapter must open as a continuation of this beat, not as a disconnected reset.
═══════════════════════════════════════════════════════

═══════════════════════════════════════════════════════════
📚 CONTINUITY CONTEXT - CHARACTER & SETTING CONSISTENCY
═══════════════════════════════════════════════════════════

**CRITICAL: You are writing chapters 3+. Maintain consistency with earlier chapters.**

**Character Names Used in Chapters 1-2:**
Eleanor Voss, Beatrice Quill

✓ RULE: Use EXACTLY these names. Do NOT vary spelling, add titles, or introduce new forms.
✓ Example: if earlier chapters used "Clara Whitfield", keep using "Clara Whitfield" — never "Mrs. Whitfield" unless that is the character's canonical name in the list above.

**Setting Vocabulary Established in Earlier Chapters:**
drawing room, library

✓ RULE: Continue using this location vocabulary. Maintain consistency with established setting type.
✓ Do NOT introduce new location types that contradict earlier chapters.

**Recent Chapter Summary (for narrative continuity):**
Chapter 1: Chapter 1: Discovery
  Events: Beatrice Quill stepped into the drawing room, her heart racing as the steady drumming of rain against the windows echoed the turmoil within her.
Chapter 2: Chapter 2: Initial Questions
  Events: “I simply cannot believe this has happened,” Beatrice Quill murmured, her voice barely breaking the heavy silence that enveloped the drawing room.

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
Known location profile anchors: Hawthorne Manor, The Drawing Room, The Library, Servants' Quarters, the drawing room
LOCATION NAME CAPITALISATION (HARD REQUIREMENT — validated):
All named locations in your prose MUST use the EXACT capitalisation from the CML profiles.
Canonical forms: "Hawthorne Manor", "The Drawing Room", "The Library", "Servants' Quarters", "the drawing room"
Writing a location in lowercase (e.g. "drawing room" instead of "Drawing Room") is a validated error. Every time you mention a named location, copy its capitalisation from the list above.
- Chapter 3: OPENING STYLE (HARD): Start the VERY FIRST SENTENCE with an explicit time marker — e.g. "At half past nine…" / "At midnight…" / "At a quarter to eleven…" / "At half past nine at night…". Time must be in the first clause. Anchor opening in "the drawing room". HARD REQUIREMENT for the first 2 paragraphs: (a) include 2+ sensory words — choose from smell/scent/sound/echo/silence/creak/whisper/cold/warm/damp/rough/smooth/glow/shadow/flicker/dim — and (b) include 1+ atmosphere/time word — choose from rain/wind/fog/storm/mist/thunder/evening/morning/night/dawn/dusk/season/afternoon/midday/noon/midnight/twilight/sunrise/sunset/daylight/sunlight/overcast/cloudy/bright/dark. These are validated requirements, not style suggestions; missing them triggers a retry.

[⚠ INTERNAL QUALITY DIAGNOSTICS — DO NOT REPRODUCE ANY PART OF THIS SECTION IN YOUR STORY OUTPUT. These are private generator observations for your consideration only. Your narrative must read as if this section does not exist. Never include phrases from this block in character dialogue, narration, or description.]

PRIOR CHAPTER QUALITY OBSERVATIONS:
- Chapter 1 (score 97/100):
  Quality gaps noted: word density below preferred target (970/1000); scene grounding weakness
  Address in upcoming chapters: Increase chapter density with concrete investigation action and sensory-grounded beats; avoid recap-only padding. | Open next chapter with a named location anchor plus at least two sensory cues and one atmosphere marker.
- Chapter 2 (score 92/100):
  Quality gaps noted: word density below preferred target (827/1000); scene grounding weakness
  Address in upcoming chapters: Increase chapter density with concrete investigation action and sensory-grounded beats; avoid recap-only padding. | Open next chapter with a named location anchor plus at least two sensory cues and one atmosphere marker.
[END INTERNAL DIAGNOSTICS]

PROMPT BUDGET SUMMARY: budget=32000 tokens; fixed=7991; context=10779; dropped=[none]; truncated=[pronoun_accuracy, location_profiles, temporal_context]

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
- Chapter numbering starts at 3 and increments by 1 per scene.
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
8. Integrate at least two concrete era-grounded details per chapter from setting refinement signals: petrol touring cars on county roads | domestic wiring with frequent outages | typewriters standard in offices and homes | early telephones in homes | party-line telephone exchanges common | telegrams sent via nearest town office.
9. Respect setting movement/access constraints in scene action and alibis: large estate grounds create natural barriers to movement | manor's layout includes restricted areas such as staff quarters and the cellar | weather conditions can affect evidence visibility and outdoor access | specific permissions required to enter restricted areas of the house | daily routines dictate access times for staff and guests.
10. Sustain social coherence with this backdrop pressure: The looming threat of financial ruin amid the Great Depression forces a disparate group of upper-class guests and their staff to confront hidden resentments and loyalties during a tense weekend at the manor.
11. Maintain continuity around these socially central cast anchors where relevant: Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill.
12. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Critical: Plot similarity 0.85 with 'The Mysterious Affair at Styles' (same murder with timed deception)
13. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Critical: Solution similarity 0.90 with 'The Mysterious Affair at Styles' (similar method of deception involving timing)
14. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Moderate: Character similarity 0.74 with 'The Sign of the Four' (similar cast structure and dynamics)
15. STORY TO DATE ANTI-COPY RULE: The STORY TO DATE section below is provided for chronological and factual reference ONLY. You MUST NOT copy, lightly rephrase, or structurally echo any sentence or paragraph from prior chapters. Every sentence in this chapter must be original prose unique to this scene. Reusing even a clause from prior chapter text will cause this attempt to fail immediately.

CRITICAL PROSE REQUIREMENTS:

The CML specifies exact requirements for certain validation-critical scenes. You MUST include these elements at the specified positions.

**Discriminating Test Scene (Act 3, Scene 4):**
Required elements: Execute the discriminating test, Observe the clock's tampering evidence, Draw conclusion about Dr. Mallory Finch's guilt
Test type: clock examination

**Suspect Clearance Scenes:**
- Captain Ivor Hale (Act 3, Scene 5): Clearance through time-based alibi.
  Clues: clue_id_1, clue_id_2
- Eleanor Voss (Act 3, Scene 5): Alibi confirmed: 10:00 PM - 10:30 PM

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
- Chapter 3:
  - STRUCTURAL ARCHETYPE — Chapter 3 must be: EVIDENCE
      ✓ MUST contain: new physical clue discovered
      ✗ MUST NOT contain: formal accusation
  - Word count: Target 1250 words. Achieve this through plot events, dialogue exchanges, and physical investigation — not through atmospheric repetition or extended internal reflection. Each 200-word segment should contain at minimum one concrete story event (a discovery, a conversation exchange, a physical action or movement). Padding with atmosphere alone is not acceptable.
  - Opening: Begin with a character action, spoken line, or clock/time marker — never a location name or location-description phrase.
  - Scene is set in: the drawing room — reference it naturally within the paragraph, never as your opening phrase.
  - Opening atmosphere (MANDATORY — validator enforced): the first paragraph MUST contain at least one of: rain / wind / fog / storm / mist / thunder / evening / morning / night / dawn / dusk / season / afternoon / midday / noon / midnight / twilight / sunrise / sunset / daylight / sunlight / overcast / cloudy / bright / dark. A chapter that omits all of these from its opening paragraph will be rejected.
  - Continuity bridge: in the first 120 words, visibly connect from the previous chapter's final beat. Carry forward one unresolved element (object, accusation, emotional pressure, or immediate physical action) from: "Finally, Beatrice took a step back, her mind racing as she tried to piece together the fragments of their stories. "We need to confront these contradictions head-on. If we are to find out what truly happened, we must be...".
  - Clue obligations: none for this chapter.
  - Tonal contrast: include at least one beat of relief or ironic counterpoint. Do not sustain maximum tension for every paragraph.
  - Sensory obligation — use at least two of: Candlelight reflecting off glass, Long shadows stretching across the floor | Ticking of the mantel clock, Distant voices from below stairs | Freshly lit candles. Mood: tense anticipation.
- Locked fact phrase obligations:
  - If this batch mentions The exact time shown on the stopped clock face, write exactly: "ten minutes past eleven".
  - If this batch mentions The exact amount the clock was wound back, write exactly: "forty minutes".
- Seasonal vocabulary allow-list: spring, vernal, springtime.
- Forbidden seasonal words: summer, autumn, winter.

FROZEN TIMELINE STATE (DO NOT ALTER):
- Timeline anchor: May (spring).
- Month, season, weather, and time-of-year language in this batch must stay compatible with spring.
- Established timeline fact: 10:00 PM
- Established timeline fact: 10:30 PM
- If referenced, use exact time phrase: "ten minutes past eleven" (The exact time shown on the stopped clock face).
- If referenced, use exact time phrase: "forty minutes" (The exact amount the clock was wound back).

STORY TO DATE (REFERENCE ONLY — DO NOT COPY VERBATIM):
- Full prior chapter text is provided below for continuity, factual consistency, and reference accuracy.
- Use this to keep character voice, chronology, clue state, and location continuity aligned with earlier chapters.
- Do not quote, copy, or paraphrase these paragraphs too closely; write fresh prose that remains consistent with them.

--- BEGIN PRIOR CHAPTER 1 ---
Title: Chapter 1: Discovery
Beatrice Quill stepped into the drawing room, her heart racing as the steady drumming of rain against the windows echoed the turmoil within her. The morning light struggled to pierce the heavy clouds, casting a dim glow over the room, where shadows danced in the corners like specters of the past. The air was thick with the scent of damp earth from the gardens, a stark reminder of the life that once flourished here, now overshadowed by tragedy. She hesitated at the threshold, her gaze drawn to the figure lying motionless on the floor, the lifeless form of Eleanor Voss, the once-vibrant socialite whose laughter had filled these walls just days before.

As Beatrice approached, she noticed the clock on the mantelpiece, its hands frozen in time, still showing ten minutes past eleven. The sight sent a chill down her spine; it felt as if the clock itself was mocking the stillness of the room. She knelt beside Eleanor, her breath hitching in her throat as she took in the details of the scene. The victim's delicate features were marred by a pallor that spoke of violence, and the clock's position suggested a moment of finality, a cruel twist of fate that would unravel the lives of those who remained. The mechanism of the clock was crucial to understanding the timing of the murder, and Beatrice felt the weight of its implications settle heavily upon her shoulders.

The room was silent save for the relentless patter of rain, and Beatrice's mind raced as she recalled the last gathering, the laughter that had echoed through the halls, now replaced by an oppressive stillness. She glanced at the others who had gathered, each face a mask of shock and disbelief. Eleanor's closest friends, Dr. Finch and Captain Hale, stood in the shadows, their expressions betraying a mix of confusion and sorrow. Beatrice's heart ached for them, but she knew that beneath the surface lay secrets that could shatter their fragile bonds.

Captain Hale stepped forward, his voice gravelly as he broke the silence. "What could have happened here? We were all together just last night, and now..." His words trailed off, leaving an unspoken question hanging in the air. Beatrice felt a pang of sympathy for her, a man burdened by the weight of her past, yet she couldn't shake the feeling that she, too, held a piece of the puzzle. She turned her attention back to the clock, her mind racing with possibilities. If the clock had been tampered with, it could alter the entire timeline of events leading up to Eleanor's death.

Dr. Finch, his brow furrowed in thought, moved closer to the body, his hands trembling slightly as he reached for the clock. "It can't be right. The clock must have stopped... or someone wound it back," he murmured, his voice barely above a whisper. Beatrice caught the flicker of fear in her eyes, and she wondered what secrets she was hiding. The clock's reading, ten minutes past eleven, contradicted their alibis, and she could sense the tension building in the room as they all grappled with the implications of that moment in time.

Eleanor's absence loomed large, and Beatrice felt the weight of her grief, the memories of their friendship crashing over her like a wave. She remembered their last conversation, Eleanor's laughter ringing in her ears, the way her eyes sparkled with mischief. Now, as she stood in the drawing room, the echoes of joy were replaced by an unsettling silence. Beatrice lingered at the door, her eyes brimming with tears as she recalled the warmth of Eleanor's presence, now extinguished forever. The thought of losing her friend to the cruel machinations of fate was almost too much to bear.

Captain Hale cleared his throat, breaking the spell of sorrow that hung in the air. "We need to find out what happened here. We owe it to Eleanor," she said, determination creeping into her voice. Beatrice nodded, her resolve hardening. They would uncover the truth, no matter how painful it might be. As they gathered around the body, the clock's ominous reading loomed over them, a reminder of the urgency of their task. They were bound together by grief, but also by the need for answers, and Beatrice felt a flicker of hope amidst the despair. Together, they would piece together the fragments of the night before, unraveling the mystery that had claimed Eleanor's life.

As the rain continued to spring outside, Beatrice glanced at Dr. Finch, who was now examining the clock with a furrowed brow. "If the clock was indeed wound back, it changes everything. We must consider who had access to it," he said, his voice steady yet laced with anxiety. Beatrice's thoughts raced as she considered the implications. Each of them had been in the drawing room at some point, and the tension between them was palpable. She could feel the weight of suspicion settling upon them like a shroud, each of them a potential suspect in this tragic tale. The clock, once a mere timepiece, had become a witness to a crime, and its secrets would need to be uncovered if they were to find justice for Eleanor.

The atmosphere in the drawing room was thick with anticipation, a palpable tension that seemed to hang in the air. Beatrice could feel the weight of their collective grief, but beneath it lay an undercurrent of suspicion that threatened to fracture their fragile camaraderie. She took a deep breath, steeling herself for the task ahead. They would need to confront their fears, their secrets, and the shadows of their pasts if they were to uncover the truth behind Eleanor's untimely death. The clock's reading, ten minutes past eleven, would be their guiding light, illuminating the path through the darkness that had engulfed them all.
--- END PRIOR CHAPTER 1 ---

--- BEGIN PRIOR CHAPTER 2 ---
Title: Chapter 2: Initial Questions
“I simply cannot believe this has happened,” Beatrice Quill murmured, her voice barely breaking the heavy silence that enveloped the drawing room. Outside, the rain continued its relentless descent, the sound a steady backdrop to the tension that crackled in the air. The dim light filtering through the thick curtains cast dull hues over the room, amplifying the oppressive atmosphere. Beatrice stood near the mantelpiece, her gaze fixed on the clock, its hands frozen at ten minutes past eleven. The implications of that time gnawed at her, a reminder of the tragedy that had unfolded just hours before.

As she turned to face the others, Beatrice noted the way Eleanor Voss fidgeted with her ring, a telltale sign of distress that did not escape her notice. Eleanor’s usual poise was replaced by an anxious energy, her eyes darting from Beatrice to the clock, as if searching for answers in its stillness. The clock’s reading contradicted Eleanor’s own timeline, and Beatrice felt the weight of suspicion settle over them like a shroud. "Eleanor, when did you last see the clock working?" Beatrice asked, her voice steady despite the turmoil within.

Eleanor took a moment to respond, her brow furrowing as she considered the question. "I remember checking it just before we sat down for tea. It was working perfectly then," she replied, her melodic cadence wavering slightly. The certainty in her voice was at odds with the uncertainty that filled the room. Beatrice exchanged glances with Dr. Finch and Captain Hale, both of whom wore expressions of confusion and concern. The clock's frozen hands seemed to mock them, a cruel reminder of the moment when everything changed.

Dr. Finch, who had been standing near the window, stepped forward, his hands trembling slightly as he gestured toward the clock. "But it can't be right. If it was indeed ten minutes past eleven when Eleanor last saw it, then we need to reconsider our timelines. Witnesses recall the clock striking ten minutes past eleven," she said, her voice low but firm. Beatrice felt a chill run down her spine; the contradiction was stark and unsettling. Eleanor’s insistence on the clock’s accuracy only heightened the tension in the room.

Captain Hale, his gravelly voice cutting through the silence, added, "We were all together just before the clock stopped. If it was indeed tampered with, it changes everything. We need to establish our whereabouts more clearly." His words hung in the air, heavy with implication. Beatrice could sense the anxiety rising among them, each of them grappling with the possibility that one of their own might be involved in this tragedy. The clock had become a silent witness, its secrets now crucial to uncovering the truth.

Beatrice took a deep breath, steeling herself for the next question. "Eleanor, can you tell us what you were doing between ten and ten-thirty last night?" she asked, her tone gentle yet probing. Eleanor hesitated, her fingers stilling on her ring as she searched for the right words. "I was in the library, reading. I thought I heard voices, but I didn't think much of it at the time," she replied, her voice barely above a whisper. Beatrice noted the way Eleanor’s eyes flickered with uncertainty, and she felt a pang of empathy for her friend, even as doubt crept into her mind.

Dr. Finch interjected, his voice tinged with urgency. "And what about you, Captain Hale? Where were you during that time?" Captain Hale straightened, his expression shifting from confusion to resolve. "I was inspecting the grounds, making sure everything was secure. You know how it is in times like these; one can never be too careful," he said, his gravelly tone betraying a hint of defensiveness. Beatrice sensed the weight of her words, the unspoken fear that lingered beneath the surface. They were all on edge, the tension palpable as they navigated the murky waters of their alibis.

As the conversation continued, Beatrice felt the room grow heavier with each revelation. The clock's reading loomed over them, a constant reminder of the urgency of their task. Eleanor’s timeline, once a simple recollection, now clashed with the clock’s frozen hands, creating a web of suspicion that ensnared them all. Beatrice could see the strain etched on Eleanor's face, the struggle to maintain her composure in the face of such uncertainty. It was clear that each of them had their own secrets, and the truth was buried beneath layers of fear and anxiety.

Finally, Beatrice took a step back, her mind racing as she tried to piece together the fragments of their stories. "We need to confront these contradictions head-on. If we are to find out what truly happened, we must be honest with one another," she said, her voice steady despite the turmoil within. The others nodded, their expressions a mix of determination and trepidation. The clock, once a mere timepiece, had become a focal point of their investigation, its secrets waiting to be uncovered.
--- END PRIOR CHAPTER 2 ---

[SCENE COMPLETENESS CONTRACTS — MANDATORY. Each contract below lists what you MUST enact in that chapter. Do not summarise or mention these labels in the prose — enact them organically.]
Chapter 3 (Act 1) completeness contract:
  PIVOT ELEMENT (MANDATORY — write this into the prose, shown not told): "Beatrice's determination to uncover the truth despite resistance."
  FACT ESTABLISHED (MANDATORY — reader must know this by chapter end): "Establishes Beatrice's commitment to the investigation and the high stakes involved."

# Case Overview
Title: The Clockwork Deception
Era: 1930s
Setting: Little Middleton
Crime: murder (clock tampering)
Culprit: Dr. Mallory Finch
False assumption: The murder occurred at the time the clock indicated.
Cast: Eleanor Voss (she/her), Dr. Mallory Finch (he/him), Captain Ivor Hale (he/him), Beatrice Quill (she/her)

Setting Lock: Keep all scenes and descriptions consistent with the stated setting (Little Middleton). Do not introduce a different location type.

Outline scenes:
[
  {
    "sceneNumber": 3,
    "act": 1,
    "title": "Commitment to Investigate",
    "setting": {
      "location": "the drawing room",
      "timeOfDay": "Early afternoon",
      "atmosphere": "Determined and tense"
    },
    "characters": [
      "Beatrice Quill",
      "Eleanor Voss",
      "Dr. Mallory Finch",
      "Captain Ivor Hale"
    ],
    "purpose": "Establish Beatrice's resolve to uncover the truth",
    "cluesRevealed": [],
    "dramaticElements": {
      "conflict": "Beatrice faces resistance from the suspects as she asserts her role.",
      "tension": "The atmosphere thickens as suspicions mount.",
      "microMomentBeats": [
        "Beatrice feels a pang of jealousy as she observes Captain Hale's protective demeanor toward Eleanor."
      ]
    },
    "summary": "Beatrice Quill resolves to investigate the murder despite the suspects' reluctance to cooperate. She senses the tension and stakes involved.",
    "estimatedWordCount": 1800,
    "pivotElement": "Beatrice's determination to uncover the truth despite resistance.",
    "factEstablished": "Establishes Beatrice's commitment to the investigation and the high stakes involved.",
    "permittedBehavioursByAct": [
      {
        "characterName": "Eleanor Voss",
        "behaviour": "normal social behaviour; grief"
      },
      {
        "characterName": "Dr. Mallory Finch",
        "behaviour": "normal social behaviour; confusion"
      },
      {
        "characterName": "Captain Ivor Hale",
        "behaviour": "normal social behaviour; confusion"
      },
      {
        "characterName": "Beatrice Quill",
        "behaviour": "normal social behaviour; determination"
      }
    ],
    "redHerringPlacement": null,
    "emotionalRegister": "Initial clues introduce a growing sense of anxiety among the characters.",
    "dominantCharacterNote": {
      "name": "Eleanor Voss",
      "voiceRegister": "Eleanor speaks with a melodic cadence, her words carefully chosen to weave charm and wit together."
    },
    "humourGuidance": {
      "permission": "permitted",
      "character": "Dr. Mallory Finch",
      "form": "dry_wit"
    },
    "eraTextureNote": "Travel is limited due to economic conditions and fuel shortages.; Communication relies heavily on letters and telegrams, slowing response times.; The weather often hampers outdoor activities, restricting social interactions.",
    "locationRegisterNote": "The drawing room feels suffocating, where echoes of laughter now clash with the heavy silence of dread and uncertainty. Every shadow seems to harbor secrets, and the air is thick with the scent of past gatherings, now tainted by the weight of tragedy. — As a writer enters, they should feel the oppressive atmosphere, heavy with anticipation and a sense of foreboding."
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
  Dr. Mallory Finch    | he/him/his/himself        | [fill in]     | [yes/no]
  Captain Ivor Hale    | he/him/his/himself        | [fill in]     | [yes/no]
  Beatrice Quill       | she/her/her/herself       | [fill in]     | [yes/no]
□ Return valid JSON only.
```
