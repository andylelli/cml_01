# Actual Prompt Record

- Run ID: `mystery-1778962952613`
- Project ID: ``
- Timestamp: `2026-05-16T20:26:46.360Z`
- Agent: `Agent9-ProseGenerator-Ch5`
- Operation: `chat_request_full_prompt`
- Model: `GPT-4o-mini`
- Temperature: `0.42`
- Max Tokens: `4500`
- Attempt: `first`
- Prompt Hash: `ea490d307130eee5`

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
- MORAL COMPLEXITY REQUIREMENT: The mechanism of this crime carries a moral gray area: "The murderer had discovered the victim was planning to defraud them, raising questions about justice versus revenge." — the culprit reveal and denouement MUST acknowledge this ambiguity. Do not let the ending feel clean or simple. Give the reader at least one moment of uncomfortable sympathy or moral doubt.


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

## Era: 1936-05
In May 1936, the English countryside is alive with the sounds of spring, albeit under a blanket of overcast skies that intermittently release rain. The gardens of the grand manor house are blooming with vibrant flowers, their colors a stark contrast to the gray atmosphere, while the air is filled with the fresh scent of damp earth. Guests at the estate find themselves caught in a web of social tensions, as whispers of political unrest and economic uncertainty weave through their conversations, creating an air of suspense that thickens with each passing moment. Fashion trends reflect a delightful blend of elegance and practicality, with men in tailored suits and women in floral dresses, highlighting class distinctions and strict social codes that dictate behavior. Daily life revolves around rituals like afternoon tea and formal dinner parties, allowing the upper class to showcase their wealth while masking the economic struggles affecting many.
Emotional register: A collective anxiety permeates the atmosphere as individuals navigate the precarious balance between societal expectations and personal desires.
Physical constraints: Limited access to public transport due to economic strains | Communication hindered by the absence of modern technology | Social gatherings dictated by strict etiquette and class barriers
Current tensions (weave into background texture): Rising fascism and political unrest in Europe | Economic uncertainty following the Great Depression | Class divisions exacerbated by social tensions
Wartime context — Many young men are preparing for potential military service amidst rising global tensions.: Communities are coming together to support each other, yet underlying resentment towards the upper class simmers. Absence effect: Absences from the war effort create gaps in families, leaving emotional scars that linger.

## Story Theme
The struggle for truth in a world of deception reveals the fragility of personal integrity amidst the complexities of human relationships, and reveals that evidence carries ethical weight, forcing characters to choose accountability over social performance when appearances and facts collide.

## Story Emotional Register
Dominant: A journey of tension and revelation permeates the narrative, as personal stakes intertwine with societal decay.

Arc:
The story begins in the grand yet foreboding Little Middleton Manor, where the murder of a socialite casts a dark cloud over the evening's festivities. The atmosphere is thick with tension, as Eleanor Voss, the determined journalist, is drawn into the investigation, fueled by her desire for truth and redemption from her gambling past. As she delves into the complexities of the case, the rising unease is palpable; each clue uncovered leads to more questions than answers, straining her relationships with the suspects and revealing their hidden motives and secrets. The stakes escalate when Eleanor discovers discrepancies in the alibis, a pivotal moment that shifts her focus toward the tampered clock, a device that distorts the timeline of events.

This revelation colors previous interactions, exposing the fragility of trust among the suspects. As pressure mounts and the investigation reaches a fever pitch, Eleanor confronts her own demons, wrestling with the implications of her findings. In the climax, the truth emerges, but not without significant emotional cost; relationships are fractured, and reputations are irrevocably tarnished. In the resolution, each character grapples with the aftermath of the revelations, leaving behind a world forever altered by the quest for truth and the consequences of their actions. Eleanor, in particular, must reckon with the personal toll of her pursuit and the realization that some truths come with a price.

## Emotional register at this point in the story
The discovery of the tampered clock shifts Eleanor's focus and redefines the investigation's trajectory.

## Character Portraits (appearance & era)

### Eleanor Voss
Eleanor Voss, a journalist, embodies the struggle for truth in a society grappling with its own moral decay. As she investigates a murder that may unveil class corruption, she navigates the treacherous waters of her gambling addiction while seeking redemption. Her determination to expose the truth reflects the era’s tension between integrity and survival.
Era intersection: Her quest for truth is heightened by the prevailing social unrest, forcing her to confront her own vulnerabilities while challenging the oppressive norms of her time.

### Captain Ivor Hale
Captain Ivor Hale is a dashing figure cloaked in secrets, embodying the tension between duty and desire. His affair with the victim reveals the dire stakes of maintaining one's reputation in a society that values appearance over truth. As he grapples with guilt and the consequences of his actions, Hale represents the moral complexities of a world on the brink of change.
Era intersection: His character illustrates the pressures of masculinity during a time of rising fascism, where bravery is both lauded and tested by personal failings.

### Beatrice Quill
Beatrice Quill, a vibrant socialite, struggles with envy and inadequacy as she seeks to define her identity against the backdrop of her friend Eleanor’s success. Her desire for recognition drives her actions, revealing the darker undercurrents of jealousy that permeate societal interactions. In a world where status is paramount, her character reflects the challenges faced by women striving for autonomy.
Era intersection: Her jealousy and ambition resonate with the era’s social dynamics, highlighting the competitive nature of female friendships in a time when social standing can make or break a woman’s future.

## Character Voices

### Eleanor Voss (she/her/her)
Eleanor’s voice carries a lilting cadence that reflects her charm and intellect, often punctuated by witty observations.
[comfortable] Isn't it fascinating how the truth dances just out of reach, like a shadow at dusk?
[evasive] I suppose one mustn't dwell too much on the past, wouldn't you agree?
[stressed] What if the very answers I seek are the ones that unravel everything I’ve built?
Humour: Her dry wit adds a layer of complexity to her interactions, both engaging and disarming those around her.

### Captain Ivor Hale (he/him/his)
Hale's confident cadence is laced with sardonic remarks, reflecting his self-assured nature and battle with inner conflict.
[comfortable] Life is but a series of calculated risks, wouldn’t you agree?
[evasive] I prefer to let others speculate; it keeps things interesting.
[stressed] Every choice I've made feels like a step closer to losing everything I hold dear.
Humour: His sardonic humor often serves as a shield against the turmoil brewing within.

### Beatrice Quill (she/her/her)
Beatrice's voice is lively and engaging, peppered with playful banter that masks her insecurities.
[comfortable] Oh, darling, life is too short not to enjoy every moment, wouldn’t you say?
[evasive] I’m sure it’s nothing to worry about; after all, who really pays attention to the details?
[stressed] Why must everything always seem just out of reach? It’s so exhausting!
Humour: Her self-deprecating humor provides a facade that belies her deeper feelings of envy and inadequacy.

## Location Registers (scene framing guides)

The Library: The library, shrouded in shadows and secrets, exudes an air of foreboding as the scent of old leather and musty paper envelops the room. Here, every whisper feels amplified, and the weight of unsolved mysteries lingers in the stillness, inviting both dread and curiosity.. Camera angle: Entering this space, a writer should feel the tension of hidden truths waiting to be uncovered, each corner echoing with the weight of history.. Era: The oppressive atmosphere reflects the societal tensions of the 1930s, where the quest for truth is overshadowed by fear and suspicion.

The Dining Room: The dining room, with its elegant table set for a feast, is filled with a bittersweet tension. The aroma of fine cuisine mingles with unspoken words, and as laughter fills the air, it masks the underlying currents of rivalry and suspicion that threaten to erupt.. Camera angle: A writer should approach this space as a stage where the façade of civility belies the simmering conflicts just beneath the surface.. Era: The strict etiquette enforced here mirrors the rigid class structures of the era, where every gesture is laden with meaning.

The Study: The study, a sanctuary of solitude, is thick with the scent of old books and fresh ink. Here, the atmosphere is contemplative yet charged, as the ticking clock reminds all that time is running out for secrets to remain hidden.. Camera angle: Entering this room, a writer should sense the palpable tension between reflection and action, where every decision could alter the course of events.. Era: The rich decor reflects the wealth of the era, yet the chaos of scattered papers hints at the turmoil within.

The Formal Gardens: In the formal gardens, the vibrant blooms stand as a deceptive facade, concealing the darker realities of the world within the manor. The air is fragrant yet heavy, and the gentle rustle of leaves whispers of secrets exchanged in the shadows.. Camera angle: A writer should view this space as a paradox of serenity and tension, where beauty masks the underlying turmoil of human relationships.. Era: The manicured beauty of the gardens contrasts sharply with the social upheaval occurring beyond their gates.

## Humour guidance for this story position (first_turn)
Permission: forbidden
Rationale: The tension of the moment is too palpable for humor.

## Character Pressure
Beatrice Quill is approaching a point of breakdown. Stress and strain should be accumulating visibly — through behaviour, not statement. No confrontation yet.

## Reveal Groundwork (texture — do not explain, only plant)
- Plant one subtle observable beat related to: "Eleanor's early observations about the clock's inconsistencies retroactively highlight the importance of the timeline". Do not explain significance yet.
- Plant one subtle observable beat related to: "Finch's alibi, initially a point of defense, becomes a source of tension when her past is brought to light". Do not explain significance yet.
- Plant one subtle observable beat related to: "The chaotic dynamics in the dining room foreshadow the emotional unraveling that follows the murder's hidden-truth". Do not explain significance yet.

FAIR-PLAY AND INFERENCE CONTRACT (from CML logic):
- False assumption in force: The murder occurred at the time the clock indicated.
- Hidden truth to progressively expose: The actual time of death was manipulated.
- Inference path checkpoints to dramatize clearly (observation -> correction -> effect):
  - Step 1: obs: The clock in the entrance hall shows ten minutes past eleven at the time of the murder. | corr: This indicates the time of death is later than witness accounts suggest. | effect: Narrows the timeline of the murder to after the clock was last wound.
  - Step 2: obs: The clock's winding mechanism is unusually stiff. | corr: This suggests recent tampering occurred. | effect: Narrows the suspect pool to those with access to the clock.
  - Step 3: obs: A set of fingerprints is found on the clock's face. | corr: This identifies a specific suspect who tampered with the clock. | effect: Eliminates Beatrice Quill, as her prints are not found.
- Discriminating test method: trap
- Discriminating test design constraint: Reenacting the clock winding process with all suspects present reveals inconsistencies in their accounts.
- Test must rely on already-shown clue IDs: clue_1, clue_2, clue_3, clue_10, clue_4
- Fair-play rationale: Step 1: The clock showing incorrect time and witness statements contradict each other. Step 2: The stiff winding mechanism suggests recent tampering. Step 3: Fingerprints indicate who had direct access to the clock, eliminating Beatrice Quill.
- Never solve by withheld information. Keep reader-information parity with detective reasoning.

## Character Reference

### Eleanor Voss (she/her — NEVER he/him)
Eleanor speaks with a lilting cadence, often punctuating her sentences with witty observations
She has a penchant for rhetorical questions, inviting her audience to ponder along with her, and occasionally employs self-deprecating humor to disarm her listeners.
Eleanor grapples with her gambling addiction, fearing that her reckless choices may not only cost her credibility but also alienate her from the very community she seeks to serve. This internal struggle complicates her pursuit of truth and justice.

### Captain Ivor Hale (he/him — NEVER she/her)
Captain Hale's speech is marked by a confident cadence, often laced with sardonic remarks that reflect his self-assured nature
He employs a playful tone, using irony to disarm others while maintaining an air of mystery.
Hale grapples with guilt and self-interest, torn between his desire for the victim and the consequences of their affair. This internal conflict forces him to confront the fragile nature of his persona and the implications of his actions.

### Beatrice Quill (she/her — NEVER he/him)
Beatrice's speech is peppered with playful banter and self-deprecating humor, often using light-hearted jabs at herself to engage her audience
She tends to speak quickly, her excitement bubbling over, but can shift to a more earnest tone when discussing her ambitions.
Beatrice struggles with feelings of inadequacy and jealousy, torn between her desire for recognition and the fear that her aspirations may lead to ruin. This conflict shapes her actions, pushing her further into a web of deceit.


## CHARACTER CONTRACTS (binding for this scene)
Each entry below constrains how this character must be written in this chapter.
These override generic style guidance when they conflict.

### Eleanor Voss[SHE]
Voice & mannerisms: Eleanor speaks with a lilting cadence, often punctuating her sentences with witty observations. She has a penchant for rhetorical questions, inviting her audience to ponder along with her, and occasionally employs self-deprecating humor to disarm her listeners.
Sample voice fragments (match this register and rhythm):
  [comfortable] "Isn't it fascinating how the truth dances just out of reach, like a shadow at dusk?"
  [evasive] "I suppose one mustn't dwell too much on the past, wouldn't you agree?"
Humour: dry wit — deploy occasionally (level 0.5)
FORBIDDEN phrase (never write for Eleanor Voss): "a surge of determination washed over her"
Act 2 behaviour contract: May show unease, evasion, or mild defensiveness when questioned. One behavioural tell is permitted. Internal conflict emerging: "Eleanor grapples with her gambling addiction, fearing that her reckless choices may not only cost her credibility but also alienate her from the very community she seeks to serve. This internal struggle complicates her pursuit of truth and justice."

### Captain Ivor Hale[HE]
Voice & mannerisms: Captain Hale's speech is marked by a confident cadence, often laced with sardonic remarks that reflect his self-assured nature. He employs a playful tone, using irony to disarm others while maintaining an air of mystery.
Sample voice fragments (match this register and rhythm):
  [comfortable] "Life is but a series of calculated risks, wouldn’t you agree?"
  [evasive] "I prefer to let others speculate; it keeps things interesting."
Humour: sardonic — deploy occasionally (level 0.6)
FORBIDDEN phrase (never write for Captain Ivor Hale): "palpable tension filled the room"
Act 2 behaviour contract: May show unease, evasion, or mild defensiveness when questioned. One behavioural tell is permitted. Internal conflict emerging: "Hale grapples with guilt and self-interest, torn between his desire for the victim and the consequences of their affair. This internal conflict forces him to confront the fragile nature of his persona and the implications of his actions."

### Beatrice Quill[SHE]
Voice & mannerisms: Beatrice's speech is peppered with playful banter and self-deprecating humor, often using light-hearted jabs at herself to engage her audience. She tends to speak quickly, her excitement bubbling over, but can shift to a more earnest tone when discussing her ambitions.
Sample voice fragments (match this register and rhythm):
  [comfortable] "Oh, darling, life is too short not to enjoy every moment, wouldn’t you say?"
  [evasive] "I’m sure it’s nothing to worry about; after all, who really pays attention to the details?"
Humour: self deprecating — deploy rarely (level 0.3)
FORBIDDEN phrase (never write for Beatrice Quill): "she knew with certainty she was right"
Act 2 behaviour contract: May show unease, evasion, or mild defensiveness when questioned. One behavioural tell is permitted. Internal conflict emerging: "Beatrice struggles with feelings of inadequacy and jealousy, torn between her desire for recognition and the fear that her aspirations may lead to ruin. This conflict shapes her actions, pushing her further into a web of deceit."



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
A grand estate steeped in history, its opulence masked by the encroaching shadows of uncertainty and isolation.

Key Locations Available:
- The Library (interior): Crime scene
- The Dining Room (interior): Gathering space
- The Study (interior): Private area for reflection and work
- The Formal Gardens (exterior): Secluded area for quiet reflection and clandestine meetings

Atmosphere: Tense and suspenseful, heightened by recent social unrest and economic uncertainty
Weather: Overcast with intermittent rain, typical of the English countryside in autumn

Era markers: Petrol touring cars parked along the driveway | Early rotary dial telephones in the drawing room | Typewriters clacking in the study | Battery-operated radios crackling with news updates

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
  - Visual: dust motes in candlelight, books with cracked spines, faded portraits on the walls
  - Sounds: soft rustle of pages, whispers echoing, the ticking clock
  - Scents: musty paper, beeswax candles, old leather
  - Touch: smooth wood of the desk, cold stone floor

The Dining Room (interior):
  - Visual: gleaming silverware, floral centerpieces, gleaming chandelier crystals
  - Sounds: clinking glasses, soft laughter, the hum of conversation
  - Scents: roasted meat, freshly baked bread, polished wood
  - Touch: smooth tablecloth, cool glassware

The Study (interior):
  - Visual: faded rug underfoot, papers strewn across the desk, a globe collecting dust
  - Sounds: the scratch of a pen, the rustle of paper, the creak of the chair
  - Scents: old books, fresh ink, the faint scent of tobacco
  - Touch: smooth wood of the desk, cool metal of a pen

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

- In May 1936, the English countryside is alive with the sounds of spring, albeit under a blanket of overcast skies that intermittently release rain
- The gardens of the grand manor house are blooming with vibrant flowers, their colors a stark contrast to the gray atmosphere, while the air is filled with the fresh scent of damp earth
- Guests at the estate find themselves caught in a web of social tensions, as whispers of political unrest and economic uncertainty weave through their conversations, creating an air of suspense that thickens with each passing moment
- Fashion trends reflect a delightful blend of elegance and practicality, with men in tailored suits and women in floral dresses, highlighting class distinctions and strict social codes that dictate behavior
- Daily life revolves around rituals like afternoon tea and formal dinner parties, allowing the upper class to showcase their wealth while masking the economic struggles affecting many.

TEMPORAL CONTEXT:

This story takes place in May 1936 during spring.

Seasonal Atmosphere:
- Weather patterns: overcast with occasional sunshine, intermittent rain, cool breezes
- Daylight: Days are becoming longer, with sunset approaching nine o'clock, creating a mix of light and shadow.
- Seasonal activities: flower arranging for spring celebrations, preparations for local fairs, garden parties in the estate grounds
- Seasonal occasions: May Day (May 1)
- Season: spring

Period Fashion (describe naturally):
- Men formal: tailored three-piece suit with a waistcoat, crisp white dress shirt, tweed jacket for outdoor events
- Men casual: lightweight cotton trousers, knit polo shirts, linen blazers
- Men accessories: fedora hat, leather gloves, pocket watch
- Women formal: tea-length floral dress, tailored jacket with a cinched waist, cloche hat
- Women casual: sleeveless blouse with a high-waisted skirt, light cardigan, pinafore for outdoor activities
- Women accessories: string of pearls, dainty gloves, floral hairpins

Cultural Context (reference naturally):
- Music/entertainment: Cole Porter - 'Anything Goes', Benny Goodman - 'Sing, Sing, Sing', Ella Fitzgerald - 'Dream a Little Dream of Me'; Films: 'The Great Ziegfeld', 'Modern Times'; Theatre: 'Porgy and Bess', 'The Royal Family'; Radio: 'The Shadow', 'Amos 'n' Andy'
- Typical prices: Bread loaf: four pence, Milk (pint): three pence, Taxi fare: two shillings
- Current events: increased tensions in Europe as fascism rises; the abdication crisis of King Edward VIII
- Literature: 'Gone with the Wind' by Margaret Mitchell | 'The Maltese Falcon' by Dashiell Hammett | 'The Glass Key' by Dashiell Hammett | [mystery] | [romance] | [social commentary]
- Technology: automatic washing machines | early models of the refrigerator | long-distance radio broadcasting | battery-operated radios | typewriters in offices | petrol touring cars
- Daily life: visiting local markets, hosting garden parties, attending church services on Sundays
- Social rituals: afternoon tea with guests, formal dinner parties, May Day celebrations with dancing and festivities

Atmospheric Details:
The scent of freshly cut grass mingles with the earthy aroma of dampened soil from the recent rain. The sound of distant laughter and clinking glasses echoes from the estate, as guests engage in hushed conversations. A chill in the air hints at the impending summer, while the vibrant colors of blooming flowers bring life to the otherwise gray sky.

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
1.
[truncated for prompt budget]

NON-NEGOTIABLE CHAPTER OBLIGATIONS — LOCKED EVIDENCE PHRASES (VERBATIM REQUIRED):
The following physical evidence values are absolute ground truth. Every time this chapter describes, mentions, or alludes to the relevant evidence — no matter how briefly — it MUST use the exact phrase shown below, character for character. NO paraphrase, approximation, rounding, or synonym is permitted.

FAILURE EXAMPLE: if the locked value is "at thirteen minutes to midnight" and you write "just before midnight" or "around midnight" — that is a HARD FAIL. You must write "at thirteen minutes to midnight". Equally, if the locked value is written in words, such as "ten minutes past eleven", and you convert it to figure-based clock notation — that is also a HARD FAIL. Words stay as words; figure forms are forbidden for word-phrased facts.

CRITICAL — WORD-PHRASED VALUES: If the canonical value is written out in words (e.g. a time like "ten minutes past eleven", or an amount like "forty minutes"), reproduce those exact words. DO NOT convert to figure-based time notation, twenty-four-hour format, or any other numeric shorthand. Correct: "ten minutes past eleven". WRONG: figure-based clock notation or numeric shorthand.

Locked facts:
  - The exact time shown on the stopped clock face: "ten minutes past eleven"
    ⛔ FORBIDDEN alternatives: "11:10", "11.10", "eleven ten", "eleven-ten", "eleven past ten", "quarter past eleven", "half past eleven" — the ONLY acceptable form is "ten minutes past eleven"
  - The exact amount the clock was wound back: "forty minutes"
  - The number of different fingerprints found on the clock: "three distinct prints"

If a locked fact has no relevance to this chapter, omit it. But the moment you reference the underlying evidence, only the exact phrase above is acceptable.

⛔ CLUES TO SURFACE IN THESE CHAPTERS — mandatory:
The following evidence MUST be clearly observable to an attentive reader. Do not bury it in atmosphere or passing dialogue. Each clue must be concrete, specific, and noticeable:

• [clue_3] A set of fingerprints is found on the clock's face.
  Category: testimonial | Criticality: essential | Supports inference step 2
  Points to: This provides physical evidence linked to the clock.

• [clue_9] Eleanor Voss displayed a desire for truth during the investigation.
  Category: behavioral | Criticality: essential | Supports inference step 2
  Points to: This indicates her potential innocence or complicity.

For each clue above: an attentive reader should be able to find, record, and later use it to reason toward the solution.

═══ NARRATIVE STATE (read-only — do not contradict) ═══

LOCKED FACTS — use verbatim whenever this evidence is described:
  • The exact time shown on the stopped clock face: "ten minutes past eleven"
  • The exact amount the clock was wound back: "forty minutes"
  • The number of different fingerprints found on the clock: "three distinct prints"

CHARACTER PRONOUNS — never deviate from these:
  • Eleanor Voss: she/her/her
  • Dr. Mallory Finch: she/her/her
  • Captain Ivor Hale: he/him/his
  • Beatrice Quill: she/her/her

CLUES ALREADY REVEALED TO READER: clue_1, clue_mechanism_visibility_core, clue_core_contradiction_chain, clue_2, clue_8 — do not reveal these as new information.

INVESTIGATION LOG — WHAT IS ESTABLISHED (do not re-establish, do not repeat):
• Evidence in reader's hands: The clock in the entrance hall shows ten minutes past eleven at the time of the murder. | A mechanical clock has been rewound to create a false alibi for the murderer. | This indicates the time of death is later than witness accounts suggest. | The clock's winding mechanism is unusually stiff. | This indicates the time of death is later than witness accounts suggest.
• Suspects still unresolved: Dr. Mallory Finch[SHE], Captain Ivor Hale[HE], Beatrice Quill[SHE]
⚠ The story must move FORWARD from this log. Any beat already listed above is forbidden from repeating.

⚠ THIS CHAPTER'S REQUIRED ADVANCE (first_turn): Examine physical evidence — find at least one new clue

CONTINUITY HANDOFF — previous chapter closing beat:
  • "As the rain continued to spring, Eleanor felt a sense of urgency to uncover the truth. The clock's deceit had set the stage for a web of lies, and she was determined to unravel it. "Dr. Finch, I need you to be honest with me. Your alibi is shaky, and if we are..."
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
drawing room, manor, library, dining room

✓ RULE: Continue using this location vocabulary. Maintain consistency with established setting type.
✓ Do NOT introduce new location types that contradict earlier chapters.

**Recent Chapter Summary (for narrative continuity):**
Chapter 2: Chapter 2: Contradictions
  Events: "I cannot believe this is happening," Dr.
Chapter 3: Chapter 3: The Clock
  Events: Eleanor's heart raced as she considered the implications of the clock's stillness.
Chapter 4: Chapter 4: Witness Statements
  Events: The steady drumming of rain against the library windows created an oppressive atmosphere, the sound echoing through the otherwise quiet room.

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
Known location profile anchors: Little Middleton Manor, The Library, The Dining Room, The Study, The Formal Gardens, the entrance hall
LOCATION NAME CAPITALISATION (HARD REQUIREMENT — validated):
All named locations in your prose MUST use the EXACT capitalisation from the CML profiles.
Canonical forms: "Little Middleton Manor", "The Library", "The Dining Room", "The Study", "The Formal Gardens", "the entrance hall"
Writing a location in lowercase (e.g. "drawing room" instead of "Drawing Room") is a validated error. Every time you mention a named location, copy its capitalisation from the list above.
- Chapter 5: OPENING STYLE (HARD): Start the VERY FIRST SENTENCE with a temporal subordinate clause — e.g. "When [Name] entered…" / "After the last guest…" / "Before the household had stirred…" / "As the light faded…". Anchor opening in "the entrance hall". HARD REQUIREMENT for the first 2 paragraphs: (a) include 2+ sensory words — choose from smell/scent/sound/echo/silence/creak/whisper/cold/warm/damp/rough/smooth/glow/shadow/flicker/dim — and (b) include 1+ atmosphere/time word — choose from rain/wind/fog/storm/mist/thunder/evening/morning/night/dawn/dusk/season/afternoon/midday/noon/midnight/twilight/sunrise/sunset/daylight/sunlight/overcast/cloudy/bright/dark. These are validated requirements, not style suggestions; missing them triggers a retry.

[⚠ INTERNAL QUALITY DIAGNOSTICS — DO NOT REPRODUCE ANY PART OF THIS SECTION IN YOUR STORY OUTPUT. These are private generator observations for your consideration only. Your narrative must read as if this section does not exist. Never include phrases from this block in character dialogue, narration, or description.]

PRIOR CHAPTER QUALITY OBSERVATIONS:
- Chapter 3 (score 89/100):
  Quality gaps noted: word density below preferred target (702/1000)
  Address in upcoming chapters: Increase chapter density with concrete investigation action and sensory-grounded beats; avoid recap-only padding.
- Chapter 4 (score 93/100):
  Quality gaps noted: word density below preferred target (870/1000); scene grounding weakness
  Address in upcoming chapters: Increase chapter density with concrete investigation action and sensory-grounded beats; avoid recap-only padding. | Open next chapter with a named location anchor plus at least two sensory cues and one atmosphere marker.
- Phrases to avoid (already overused in earlier chapters): "could mean that the time of death", "create a false alibi for the murderer", "the implications of the clock s stillness", "eleanor s heart raced as she considered", "s heart raced as she considered the", "the weight of the moment pressing down", "weight of the moment pressing down on", "of the moment pressing down on her".
[END INTERNAL DIAGNOSTICS]

PROMPT BUDGET SUMMARY: budget=32000 tokens; fixed=9925; context=11156; dropped=[none]; truncated=[pronoun_accuracy, temporal_context]

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
8. Integrate at least two concrete era-grounded details per chapter from setting refinement signals: petrol touring cars on well-maintained country roads | early rotary dial telephones in homes | typewriters standard in offices | battery-operated radios for entertainment | party-line telephone exchanges in rural areas | telegram service available for urgent messages.
9. Respect setting movement/access constraints in scene action and alibis: Geography restricts movement to well-defined paths and driveways | Architecture includes locked rooms and private areas inaccessible to staff | Weather conditions can impede outdoor access and evidence collection | Restricted areas for staff and guests, including private offices and family quarters | Daily routines dictate access to common areas and dining spaces.
10. Sustain social coherence with this backdrop pressure: The looming threat of financial ruin and social upheaval brings together the estate's residents and guests, each vying for their own interests amidst the backdrop of class tensions and a crumbling social order.
11. Maintain continuity around these socially central cast anchors where relevant: Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill.
12. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Moderate: Character similarity 0.75 with 'The Mysterious Affair at Styles' (similar cast structure and character roles).
13. STORY TO DATE ANTI-COPY RULE: The STORY TO DATE section below is provided for chronological and factual reference ONLY. You MUST NOT copy, lightly rephrase, or structurally echo any sentence or paragraph from prior chapters. Every sentence in this chapter must be original prose unique to this scene. Reusing even a clause from prior chapter text will cause this attempt to fail immediately.

CRITICAL PROSE REQUIREMENTS:

The CML specifies exact requirements for certain validation-critical scenes. You MUST include these elements at the specified positions.

**Discriminating Test Scene (Act 3, Scene 4):**
Required elements: Execute the discriminating test, Observe the culprit's reaction or result, Draw conclusion about guilt
Test type: clock tampering reenactment

**Suspect Clearance Scenes:**
- Dr. Mallory Finch (Act 3, Scene 5): Eliminated by proving she was in the library at the time of the murder.
  Clues: clue_1, clue_3
- Beatrice Quill (Act 3, Scene 5): Eliminated by lack of fingerprints on the clock.
  Clues: clue_1, clue_2
- Captain Ivor Hale (Act 3, Scene 5): Alibi confirmed: 10:30 to 11:30 AM

**Culprit Revelation Scene (Act 3, Scene 6):**
Method: Confrontation with evidence from the reenactment.

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
  - Word count: Target 1250 words. Achieve this through plot events, dialogue exchanges, and physical investigation — not through atmospheric repetition or extended internal reflection. Each 200-word segment should contain at minimum one concrete story event (a discovery, a conversation exchange, a physical action or movement). Padding with atmosphere alone is not acceptable.
  - Opening: Begin with a character action, spoken line, or clock/time marker — never a location name or location-description phrase.
  - Scene is set in: the entrance hall — reference it naturally within the paragraph, never as your opening phrase.
  - Opening atmosphere (MANDATORY — validator enforced): the first paragraph MUST contain at least one of: rain / wind / fog / storm / mist / thunder / evening / morning / night / dawn / dusk / season / afternoon / midday / noon / midnight / twilight / sunrise / sunset / daylight / sunlight / overcast / cloudy / bright / dark. A chapter that omits all of these from its opening paragraph will be rejected.
  - Continuity bridge: in the first 120 words, visibly connect from the previous chapter's final beat. Carry forward one unresolved element (object, accusation, emotional pressure, or immediate physical action) from: "As the rain continued to spring, Eleanor felt a sense of urgency to uncover the truth. The clock's deceit had set the stage for a web of lies, and she was determined to unravel it. "Dr. Finch, I need you to be honest wit...".
  - CLUE OBLIGATIONS — mandatory prose elements (do NOT omit or bury):
    • A set of fingerprints is found on the clock's face. [clue_3]
      Points to: This provides physical evidence linked to the clock.
    • Eleanor Voss displayed a desire for truth during the investigation. [clue_9]
      Points to: This indicates her potential innocence or complicity.
  - Tonal contrast: include at least one beat of relief or ironic counterpoint. Do not sustain maximum tension for every paragraph.

- Tonal contrast required: the previous chapter was high-tension. This chapter must include at least one beat of relief, pause, or quiet observation.
- Locked fact phrase obligations:
  - If this batch mentions The exact time shown on the stopped clock face, write exactly: "ten minutes past eleven".
  - If this batch mentions The exact amount the clock was wound back, write exactly: "forty minutes".
  - If this batch mentions The number of different fingerprints found on the clock, write exactly: "three distinct prints".
- Seasonal vocabulary allow-list: spring, vernal, springtime.
- Forbidden seasonal words: summer, autumn, winter.

FROZEN TIMELINE STATE (DO NOT ALTER):
- Timeline anchor: May (spring).
- Month, season, weather, and time-of-year language in this batch must stay compatible with spring.
- Established timeline fact: Murder time
- Established timeline fact: Alibi window
- If referenced, use exact time phrase: "ten minutes past eleven" (The exact time shown on the stopped clock face).
- If referenced, use exact time phrase: "forty minutes" (The exact amount the clock was wound back).
- If referenced, use exact time phrase: "three distinct prints" (The number of different fingerprints found on the clock).

STORY TO DATE (REFERENCE ONLY — DO NOT COPY VERBATIM):
- Full prior chapter text is provided below for continuity, factual consistency, and reference accuracy.
- Use this to keep character voice, chronology, clue state, and location continuity aligned with earlier chapters.
- Do not quote, copy, or paraphrase these paragraphs too closely; write fresh prose that remains consistent with them.

--- BEGIN PRIOR CHAPTER 1 ---
Title: Chapter 1: Discovery
Eleanor Voss stepped into the dim hallway of Little Middleton Manor, the damp chill of the morning air clinging to her skin. Outside, the soft patter of rain against the windowpanes created a rhythmic backdrop to the tension that hung in the air. He could feel the weight of the household's unease as he approached the drawing room, where Captain Hale awaited his arrival, his expression a mixture of anxiety and resignation. The shadows cast by the overcast sky seemed to deepen as he moved closer, the flickering candlelight illuminating the worried lines etched on his face.

As Eleanor entered the drawing room, her gaze fell upon the mechanical clock positioned prominently on the mantelpiece. It had been rewound, its hands frozen in time, and she could not help but feel a shiver run down her spine. The clock, she noted, showed ten minutes past eleven. The sight of it was unsettling, for it implied a moment of finality, a moment that would soon unravel the fabric of their lives. The implications of its stillness whispered of secrets yet to be uncovered, and she felt a surge of determination to uncover the truth.

Captain Hale's eyes darted to the clock, haunted by its stillness. "It was running just fine during dinner last night," he murmured, his voice barely above a whisper. The words hung in the air, a red herring that cast doubt on the timeline of events surrounding the murder. Eleanor's mind raced as she processed the implications of her statement. If the clock had indeed been functioning, it could mean that the time of death was not as straightforward as it appeared. The clock had been tampered with, creating a false alibi for the murderer. This revelation sent a jolt through her, igniting her investigative instincts.

Eleanor stepped closer to the clock, her fingers brushing against its cold surface. "This clock... it has been rewound to create a false alibi for the murderer," he stated, his voice steady as he turned to face Hale. The grim realization settled over them like a shroud. The murderer had manipulated time itself, and Eleanor felt a sense of urgency to unravel the truth before it slipped away like the minutes lost to the clock's deceit. The weight of the moment pressed heavily upon her, and she knew that every second counted.

The implications of the clock's stillness were staggering. If the victim had died no later than ten minutes past eleven, it contradicted the alibis of three suspects who had been present during the evening's festivities. Eleanor's heart raced as she considered the suspects: Dr. Finch, Captain Hale himself, and Beatrice Quill. Each had access to the victim, and each had a motive that could be concealed beneath the polished veneer of their social interactions. The tension in the room thickened, and Eleanor could feel the pulse of uncertainty in the air.

As he turned his attention back to Hale, he saw the flicker of doubt in his eyes. "We must act quickly, Eleanor. The constable will be here soon, and we cannot allow the truth to be obscured by the shadows of this manor," she urged, her voice laced with urgency. Eleanor nodded, her resolve solidifying. She would not rest until the truth was brought to light, no matter the cost. The clock's hands may have stopped, but her determination to uncover the mystery was just beginning.

They moved together toward the drawing room, where the body lay, a stark reminder of the fragility of life. The atmosphere was thick with foreboding as they approached the lifeless form. Eleanor's heart pounded in her chest, each beat echoing the gravity of the situation. She steeled herself, knowing that the answers they sought lay just beyond the surface of this tragedy. The clock's deceit would not be the only secret to unravel; the very fabric of their lives was woven with lies and hidden truths.

As they entered the room, the sight of the victim took Eleanor's breath away. The woman lay sprawled on the floor, a delicate hand clutching the clock, still showing ten minutes past eleven. The contrast of the vibrant spring flowers in the room against the pallor of the victim's skin struck her with a sense of horror. The beauty of life was starkly juxtaposed with the finality of death, and Eleanor felt a wave of sorrow wash over her. This was not just a murder; it was a betrayal of trust, a fracture in the delicate social fabric that bound them all together.

Eleanor knelt beside the body, her mind racing with questions. Who would want to harm such a vibrant socialite? What secrets had she taken with her to the grave? As she examined the scene, she noticed the clock's face, its hands forever frozen in time. The victim's final moments were now a mystery, a puzzle waiting to be solved. The clock had not only marked the time of death; it had become a symbol of the tangled web of deceit that surrounded them. With a heavy heart, Eleanor vowed to uncover the truth, to bring justice to the victim, and to confront the shadows lurking within Little Middleton Manor.
--- END PRIOR CHAPTER 1 ---

--- BEGIN PRIOR CHAPTER 2 ---
Title: Chapter 2: Contradictions
"I cannot believe this is happening," Dr. Finch exclaimed, her voice trembling slightly as she clasped her hands together. The late morning light filtered through the drawing room windows, casting a soft glow on the elegant furnishings. Outside, the rain continued its persistent patter against the glass, a reminder of the chaos that had erupted within Little Middleton Manor. Eleanor Voss stood nearby, her notebook poised in her hands, feeling the weight of expectations pressing down on her as she prepared to question the two suspects.

Eleanor stepped closer to the clock on the mantelpiece, its hands forever frozen at ten minutes past eleven. The implications of its stillness loomed large in her mind, a constant reminder that time had been manipulated. "Dr. Finch, can you tell me where you were at the time of the murder?" she asked, her voice steady despite the turmoil swirling around them. Finch's eyes darted toward Captain Hale, who stood with his arms crossed, his expression unreadable.

Finch hesitated, her brow furrowing as she searched for the right words. "I was in the library, attending to some medical texts. I remember glancing at the clock just before dinner began, and it was working perfectly then," she replied, her voice gaining confidence. Eleanor noted the slight tremor in Finch's hands, a telltale sign of her anxiety. Could the doctor be hiding something? The conflicting statements about the time of the dinner party began to weave a tangled web of alibis that left Eleanor feeling increasingly uneasy.

Captain Hale shifted his weight, his gaze fixed on the floor. "I was with Beatrice Quill in the drawing room, discussing the arrangements for the evening. We were quite engrossed in conversation, and I distinctly remember the clock chiming as we moved to the dining room," she interjected, her tone firm. Eleanor's heart raced as she considered the implications of Hale's words. If the clock had indeed been functioning, it could mean that the time of death was not as straightforward as it appeared. This indicates the time of death is later than witness accounts suggest.

Eleanor scribbled notes furiously, her mind racing to connect the dots. The clock had been tampered with, creating a false alibi for the murderer. "So, you both claim to have been occupied at the time of the murder, yet the clock tells a different story," she mused aloud, glancing between the two of them. "What if the clock was deliberately wound back?" The tension in the room thickened, and Eleanor could feel the pulse of uncertainty in the air.

Dr. Finch's eyes widened, and she opened her mouth to protest, but no words came. Hale's jaw clenched, and he shot a glance at Finch, as if silently communicating a shared concern. "That clock has been in this manor for decades; it has never failed us before," Hale said defensively, his voice rising slightly. Eleanor noted the defensiveness in her tone, recognizing it as a sign of vulnerability. The stakes were rising, and she was determined to uncover the truth.

Eleanor paused, her fingers fidgeting with her notebook as she considered her next question. "What time did you last see the victim?" she asked, her voice deliberately calm. Finch glanced at Hale, her expression betraying her unease. "I believe it was just before dinner, around eight o'clock," Finch replied, her voice faltering slightly. Hale nodded in agreement, but Eleanor couldn't shake the feeling that their timelines were not aligning.

As the conversation continued, Eleanor felt the weight of the moment pressing down on her. Each alibi seemed to spring apart under scrutiny, revealing cracks in their stories that hinted at deeper secrets. The rain outside intensified, a fitting backdrop to the storm brewing within the drawing room. Eleanor's resolve hardened; she would not let the truth be obscured by the shadows of this manor. The conflicting statements about the time of the dinner party were the first threads in a tapestry of deceit she was determined to unravel.
--- END PRIOR CHAPTER 2 ---

--- BEGIN PRIOR CHAPTER 3 ---
Title: Chapter 3: The Clock
At ten o'clock in the morning, the rain continued its relentless assault against the windows of Little Middleton Manor, creating a rhythmic backdrop to the eerie silence that enveloped the entrance hall. Eleanor Voss stepped closer to the mechanical clock that stood sentinel on the mantelpiece, its polished wood gleaming dully in the dim light. She could feel the weight of the moment pressing down on her as she reached out to touch the clock's cold surface, her fingers brushing against the intricate carvings. The clock showed ten minutes past eleven, its hands frozen in time, a stark reminder of the tragedy that had unfolded within these walls.

Eleanor's heart raced as she considered the implications of the clock's stillness. If it had stopped at ten minutes past eleven, it contradicted the alibis of the suspects who had been present during the evening's festivities. This clock was not merely a timepiece; it was a key piece of evidence that could unravel the tangled web of deceit surrounding the murder. The thought sent a jolt of urgency through her, igniting her investigative instincts. She needed to understand how the clock had been tampered with and who could have had access to it.

As Eleanor pondered the significance of the clock, the heavy door creaked open, and Beatrice Quill stepped into the entrance hall, her expression a mixture of anxiety and agitation. The sight of Eleanor standing so close to the clock seemed to unsettle her further. 'What are you doing here, Eleanor?' Beatrice asked, her voice trembling slightly. 'You shouldn't be meddling with things you don't understand.'

Eleanor turned to face Beatrice, her brow furrowing at the unexpected hostility. 'I’m merely examining the clock, Beatrice. It’s crucial to understanding what happened last night,' she replied, her tone steady despite the tension in the air. Beatrice's fingers twitched nervously at her side, and Eleanor noted the way her gaze flickered toward the clock, a hint of fear crossing her features. 'You shouldn’t jump to conclusions,' Beatrice added, her voice rising defensively. 'You don’t know what you’re getting into.'

Eleanor felt a surge of determination. 'I know that the clock shows ten minutes past eleven at the time of the murder, and that means someone has tampered with it. We need to find out who did it,' she insisted, her voice firm. Beatrice's eyes widened, and for a moment, Eleanor thought she saw a flicker of guilt pass across her face. 'You think I did it?' Beatrice asked incredulously, her tone shifting from defensive to incredulous. 'I would never—'

Before Beatrice could finish, Captain Hale entered the hall, his presence commanding attention. 'What’s all this commotion about?' he inquired, his gaze moving between the two women. Eleanor straightened, her resolve unshaken. 'We’re discussing the clock, Captain. It shows ten minutes past eleven, and that raises questions about the timeline of the murder,' he explained, his voice steady. Hale's expression darkened, and he stepped closer, his eyes narrowing as he scrutinized the clock.

'That clock has been in this manor for decades; it has never failed us before,' Hale said, his voice laced with defensiveness. Eleanor could sense the tension in the air, the unspoken accusations hanging between them. 'But it has been tampered with. We need to uncover the truth,' she countered, her conviction unwavering. Beatrice shifted uneasily, her fingers twitching as she glanced at the clock once more, as if it held the answers they sought.

Eleanor took a step back, allowing Hale to examine the clock more closely. She could see the gears and mechanisms, the intricate workings that had once kept time so faithfully. 'If someone rewound the clock, it could create a false alibi for the murderer,' she mused aloud, her mind racing with possibilities. 'We need to determine if there are any fingerprints on it.'

Hale nodded slowly, his expression contemplative. 'I’ll have the constable look into it when he arrives. But we must be careful. Accusations can lead to dangerous consequences,' he warned, his tone serious. Eleanor felt a chill run down her spine at the thought of the constable arriving, but she knew they had no choice. The truth needed to come to light, no matter the cost.
--- END PRIOR CHAPTER 3 ---

--- BEGIN PRIOR CHAPTER 4 ---
Title: Chapter 4: Witness Statements
The steady drumming of rain against the library windows created an oppressive atmosphere, the sound echoing through the otherwise quiet room. Eleanor Voss sat across from Dr. Finch, her notebook open but forgotten as she studied the physician's trembling hands. Finch's fingers fidgeted with the edge of her sleeve, a telltale sign of her anxiety. The soft light filtering through the curtains cast a muted glow, illuminating the dust motes that danced in the air, yet the tension between them was palpable. Eleanor's mind raced with the implications of the clock's stillness, and she felt the weight of the moment pressing down on her. Hale's warning about the consequences of accusations lingered in his thoughts, amplifying his determination to uncover the truth.

Eleanor leaned forward slightly, her voice steady but probing. "Dr. Finch, can you recount your whereabouts during the time of the murder?" She noted how Finch's gaze darted to the side, avoiding direct eye contact. "I was in the library, attending to some medical texts," Finch replied, her voice wavering slightly. "I remember glancing at the clock just before dinner began, and it was working perfectly then." Eleanor's brow furrowed at the inconsistency; the clock had shown ten minutes past eleven, a time that contradicted Finch's alibi.

As Finch spoke, Eleanor observed the way her hands trembled, betraying the calm facade she attempted to maintain. "You mentioned the clock was functioning before dinner. But if it was indeed working, that raises questions about the timeline of events, doesn't it?" Eleanor's tone was measured, but the underlying tension was unmistakable. Finch's eyes widened, and she opened her mouth to protest, but no words came. Instead, she shifted in her seat, her discomfort growing palpable. The shadows in the library seemed to deepen, amplifying the weight of their conversation.

Eleanor pressed on, her curiosity piqued. "What time did you last see the victim?" Finch hesitated, her fingers now twisting the fabric of her dress. "I believe it was just before dinner, around eight o'clock," she replied, her voice faltering. Eleanor's heart raced at the discrepancies; if the clock had been tampered with, it could create a false alibi for the murderer. Finch's alibi was shaky at best, and Eleanor felt a surge of determination to unravel the truth. The clock had not only marked the time of death but had also become a symbol of the tangled web of deceit surrounding them.

The rain continued to spring outside, a fitting backdrop to the storm brewing within the library. Eleanor's mind raced as she connected the dots, her instincts urging her to dig deeper. "Dr. Finch, you mentioned being in the library. Is there anyone who can corroborate your story?" Finch's expression shifted, a flicker of panic crossing her face. "No, I was alone. I often find solace in books during times like these," she said, her voice barely above a whisper. Eleanor noted the way Finch's eyes darted around the room, as if searching for an escape from the scrutiny.

Eleanor leaned back, allowing the silence to stretch between them. The tension was thick, and she could sense Finch's unease growing. "You seem quite nervous, Doctor. Is there something you wish to share?" Finch's gaze fell to her lap, and Eleanor could see the conflict playing out in her expression. "I assure you, I am merely concerned for the victim and the implications of this tragedy," Finch replied, her voice steady but lacking conviction. Eleanor couldn't shake the feeling that there was more beneath the surface, hidden truths waiting to be uncovered.

The clock's stillness loomed large in Eleanor's mind, a constant reminder of the manipulation at play. "If the clock was indeed tampered with, it could mean that the time of death is later than witness accounts suggest," she mused aloud, her eyes locked on Finch's face. The doctor flinched at the implication, her composure cracking just a fraction. Eleanor pressed her advantage, sensing that the truth was tantalizingly close. "What if someone wanted to create a false narrative? What if you were aware of it?"

Finch's breath caught in her throat, and for a moment, Eleanor thought she might break down. Instead, the doctor straightened her back, a mask of determination settling over her features. "I would never be involved in something so nefarious, Eleanor. I am a healer, not a deceiver," she insisted, her voice gaining strength. Eleanor could see the resolve in Finch's eyes, but the flicker of doubt remained. The tension in the room was suffocating, and Eleanor knew that she had to tread carefully.

As the rain continued to spring, Eleanor felt a sense of urgency to uncover the truth. The clock's deceit had set the stage for a web of lies, and she was determined to unravel it. "Dr. Finch, I need you to be honest with me. Your alibi is shaky, and if we are to find the truth, we must confront the shadows of our pasts," Eleanor said, her voice firm yet compassionate. Finch's eyes softened, and for a fleeting moment, Eleanor saw a glimpse of vulnerability beneath the doctor's carefully constructed facade. The tension hung in the air, thick and heavy, as they both understood the stakes of their conversation.
--- END PRIOR CHAPTER 4 ---

[SCENE COMPLETENESS CONTRACTS — MANDATORY. Each contract below lists what you MUST enact in that chapter. Do not summarise or mention these labels in the prose — enact them organically.]
Chapter 5 (Act 2) completeness contract:
  PIVOT ELEMENT (MANDATORY — write this into the prose, shown not told): "The discovery of three distinct fingerprints on the clock"
  FACT ESTABLISHED (MANDATORY — reader must know this by chapter end): "Establishes that the fingerprints on the clock may link a suspect to the tampering"

# Case Overview
Title: The Clockwork Alibi
Era: 1930s
Setting: Little Middleton
Crime: murder (socialite murder)
Culprit: Eleanor Voss
False assumption: The murder occurred at the time the clock indicated.
Cast: Eleanor Voss (she/her), Dr. Mallory Finch (she/her), Captain Ivor Hale (he/him), Beatrice Quill (she/her)

Setting Lock: Keep all scenes and descriptions consistent with the stated setting (Little Middleton). Do not introduce a different location type.

Outline scenes:
[
  {
    "sceneNumber": 5,
    "act": 2,
    "title": "The Fingerprints",
    "setting": {
      "location": "the entrance hall",
      "timeOfDay": "Late afternoon",
      "atmosphere": "Tense as evidence is revealed"
    },
    "characters": [
      "Eleanor Voss",
      "Captain Ivor Hale",
      "Beatrice Quill"
    ],
    "purpose": "Discover key evidence on the clock",
    "cluesRevealed": [
      "clue_3",
      "clue_9"
    ],
    "dramaticElements": {
      "conflict": "The discovery of fingerprints complicates the case",
      "tension": "Suspects react to the news with varying degrees of concern",
      "microMomentBeats": [
        "Eleanor's heart races as she examines the clock closely."
      ]
    },
    "summary": "Eleanor examines the clock again and discovers three distinct fingerprints. She shares her findings with Hale and Beatrice, both of whom react with surprise and concern.",
    "estimatedWordCount": 2200,
    "pivotElement": "The discovery of three distinct fingerprints on the clock",
    "factEstablished": "Establishes that the fingerprints on the clock may link a suspect to the tampering",
    "permittedBehavioursByAct": [
      {
        "characterName": "Eleanor Voss",
        "behaviour": "normal social behaviour; may show unease"
      },
      {
        "characterName": "Captain Ivor Hale",
        "behaviour": "normal social behaviour; may show unease"
      },
      {
        "characterName": "Beatrice Quill",
        "behaviour": "normal social behaviour; may show unease"
      }
    ],
    "redHerringPlacement": null,
    "emotionalRegister": "Eleanor realizes the implications of the discrepancies, deepening the emotional stakes for all involved.",
    "dominantCharacterNote": {
      "name": "Eleanor Voss",
      "voiceRegister": "Eleanor’s voice carries a lilting cadence that reflects her charm and intellect, often punctuated by witty observations."
    },
    "humourGuidance": {
      "permission": "permitted",
      "character": "Eleanor Voss",
      "form": "dry_wit"
    },
    "eraTextureNote": "Limited access to public transport due to economic strains; Communication hindered by the absence of modern technology; Social gatherings dictated by strict etiquette and class barriers",
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
