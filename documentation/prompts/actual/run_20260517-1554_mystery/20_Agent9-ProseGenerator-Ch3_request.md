# Actual Prompt Record

- Run ID: `mystery-1779033269920`
- Project ID: ``
- Timestamp: `2026-05-17T15:58:38.033Z`
- Agent: `Agent9-ProseGenerator-Ch3`
- Operation: `chat_request_full_prompt`
- Model: `GPT-4o-mini`
- Temperature: `0.42`
- Max Tokens: `4500`
- Attempt: `first`
- Prompt Hash: `d091f8d728db9eca`

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
- MORAL COMPLEXITY REQUIREMENT: The mechanism of this crime carries a moral gray area: "The murderer was driven by a desperate need to protect a loved one, making their actions tragically relatable." — the culprit reveal and denouement MUST acknowledge this ambiguity. Do not let the ending feel clean or simple. Give the reader at least one moment of uncomfortable sympathy or moral doubt.


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

## Era: 1932-11
Living in November 1932, the English countryside is marked by an oppressive atmosphere of economic uncertainty and societal change. The recent Great Depression casts a long shadow over the elite, where the remnants of old-world charm clash with the harsh realities of dwindling fortunes. As the sun sets early, the long, dark evenings are filled with hushed conversations about dwindling resources and the looming threat of fascism across Europe. Social gatherings, once filled with laughter and light, now harbor an undercurrent of suspicion and anxiety, as the rigid class system struggles under the weight of financial strain. Women navigate their roles delicately, balancing societal expectations with emerging feminist ideals, while men cling to traditional authority amidst growing social unrest. The manor's opulence stands in stark contrast to the realities outside its walls, creating a tension that is palpable.
Emotional register: A collective anxiety permeates society, as individuals grapple with their identities in a precarious world.
Physical constraints: Limited communication options due to reliance on rotary telephones | Travel difficulties caused by economic constraints | Shortened daylight hours impacting social gatherings | Restricted access to resources as people hoard supplies
Current tensions (weave into background texture): Economic hardship from the Great Depression | Rising fascism in Europe | Strikes and labor unrest in Britain
Wartime context — Minimal; the country is not yet engaged in widespread military action but feels the social and economic impacts of previous conflicts.: Communities are tightening their belts, with many families experiencing the effects of unemployment and reduced means. Absence effect: Absent military service members loom large in family conversations, heightening feelings of loss and unresolved grief.

## Story Theme
The fragility of wealth and reputation drives individuals to desperate acts, revealing the darker facets of human nature amidst the societal pressures of the 1930s.

## Story Emotional Register
Dominant: The story is saturated with tension and intrigue, reflecting the complex interplay of human emotions and societal pressures.

Arc:
The narrative begins in the opulent drawing room of Little Middleton Manor, where guests gather for a charity event, their laughter ringing hollow against the weight of the initial crime—the murder of a wealthy heir. As the evening unfolds, a sense of dread settles over the gathering, and the air thickens with rising unease. The investigation begins with whispered suspicions and the first clues, revealing the fractures in relationships as Eleanor Voss, the victim's cousin, grapples with her desperate financial situation. The emotional cost of the investigation deepens as each character confronts their motives and secrets, leading to the first investigative turn that changes the course of the inquiry. Midway through, a pivotal discovery—misaligned clock hands—forces the detective to reconsider everything, unraveling a web of deception that colors earlier interactions.

Another significant revelation emerges, casting doubt on the previously unquestioned alibi of Dr. Mallory Finch, a respected family physician, igniting new suspicions. As pressure mounts and tensions escalate, the climax arrives with a confrontation in the study, where the truth about the tampered clock is laid bare, revealing Eleanor's desperate act to secure her inheritance. The resolution leaves the characters emotionally scarred, as Eleanor's actions not only shatter her reputation but also force the others to reckon with their complicity in the social games that led to tragedy. Each character walks away changed, burdened by the cost of their ambitions and the darkness they uncovered within themselves.

## Emotional register at this point in the story
Suspicion begins to creep in, creating an uneasy tension among the guests.

## Character Portraits (appearance & era)

### Eleanor Voss
Eleanor Voss epitomizes the struggles faced by the upper class in 1932, where the weight of financial instability threatens her carefully curated life. Living under the constant pressure of maintaining her family's legacy, she navigates the tense social climate with charm while concealing her desperation. The looming specter of the Great Depression forces her to reassess her values and how far she is willing to go to secure her inheritance.
Era intersection: Her hidden financial crisis stands in stark contrast to the opulence expected of her social status.

### Beatrice Quill
Beatrice Quill is an ambitious journalist caught in the whirlwind of 1930s societal expectations while pursuing her career. Her relentless ambition reflects the shifting landscape of women's roles, as she grapples with ethical dilemmas in a field where sensationalism can overshadow truth. The economic backdrop of the Great Depression intensifies her drive, pushing her to blur the lines between integrity and ambition.
Era intersection: Her quest for a sensational story speaks to the desperate measures individuals take during uncertain times.

## Character Voices

### Eleanor Voss (she/her/her)
Eleanor speaks with an airy lilt, her words often layered with playful sarcasm and euphemisms.
[comfortable] Oh darling, don't you just adore the charm of these gatherings? Where secrets are the main course.
[evasive] I simply can't recall where I was at that hour, you know how it is—so many guests to entertain.
[stressed] It's just that the future of my family's estate is at stake—everything feels so precarious.
Humour: Her polite savagery adds a layer of complexity to her character, revealing her anxieties beneath the surface.

### Beatrice Quill (she/her/her)
Beatrice's speech is rapid-fire, filled with sharp observations and rhetorical questions.
[comfortable] Isn't the truth just waiting to be uncovered? It's thrilling, really!
[evasive] I wasn't there at the time; I was busy gathering information, after all.
[stressed] What if this story doesn't go the way I planned? It could ruin everything!
Humour: Her sardonic wit reflects her internal conflict and ambition, often leading to a clash of ethics.

## Location Registers (scene framing guides)

Drawing Room: The drawing room feels heavy with unspoken secrets, where laughter masks tension and every conversation is laced with a sense of impending revelation. Guests exchange glances filled with suspicion, creating an oppressive atmosphere where the weight of the ongoing investigation looms like a dark cloud.. Camera angle: A writer entering this space should focus on the tension between the lavish decor and the palpable unease among the guests.. Era: The opulence of the room sharply contrasts with the grim realities outside, reflecting the societal pressures of the 1930s.

Library: The library is a sanctuary of silence, yet it holds the weight of forgotten stories and hidden truths. Dust motes float in the air, and each book seems to whisper secrets of the past, creating an atmosphere thick with the anticipation of discovery.. Camera angle: A writer should capture the tension between the stillness of the library and the urgency of the investigation unfolding outside.. Era: In this era, the library represents a fading world of knowledge as society shifts towards sensationalism.

Study: The study feels like a battleground of intellect and emotion, where the chaos of papers mirrors the turmoil of the characters involved. Each item in the room tells a story, and the ticking clock serves as a constant reminder of the urgency of the situation.. Camera angle: A writer should focus on the contrast between the study's orderly appearance and the chaotic emotions that swirl within.. Era: The study reflects the traditional values of the 1930s, yet it also highlights the shifting dynamics of power within personal relationships.

Gardens: The gardens are meticulously manicured yet imbued with an air of melancholy as nature continues to flourish amidst the turmoil of the human world. The vibrant blooms contrast with the underlying tension, creating a space for reflection and potential uncovering of hidden truths.. Camera angle: A writer should emphasize the serene beauty of the gardens while hinting at the secrets they may hold.. Era: In this era, the gardens symbolize the clash between nature's beauty and the darker aspects of human ambition.

## Humour guidance for this story position (early)
Permission: forbidden
Rationale: The tension of the investigation requires a somber tone.

## Reveal Groundwork (texture — do not explain, only plant)
- Plant one subtle observable beat related to: "In the drawing room, Eleanor's nervousness during the charity event hints at deeper issues surrounding her inheritance". Do not explain significance yet.
- Plant one subtle observable beat related to: "Finch's alibi was initially accepted, but her connections to the victim complicate perceptions of her innocence". Do not explain significance yet.
- Plant one subtle observable beat related to: "Plant one subtle anomaly that can be re-read after the resolution.". Do not explain significance yet.

FAIR-PLAY AND INFERENCE CONTRACT (from CML logic):
- False assumption in force: The murder occurred after Eleanor Voss claims to have left the study.
- Hidden truth to progressively expose: The clock was tampered to hide her presence at the scene.
- Inference path checkpoints to dramatize clearly (observation -> correction -> effect):
  - Step 1: obs: The clock in the study shows the time as quarter past eight. | corr: This indicates that the murder could not have occurred after eight o'clock. | effect: Eliminates Dr. Mallory Finch as he claims to have left at eight-thirty.
  - Step 2: obs: The clock hands are misaligned with the wall markings. | corr: This suggests that the clock was tampered with to show an incorrect time. | effect: Narrows the time of death to before eight o'clock.
  - Step 3: obs: A faint scratch is visible on the clock face. | corr: This indicates recent tampering, supporting the theory that the clock was adjusted. | effect: Narrows suspicion towards Eleanor Voss, who had access to the clock.
- Discriminating test method: trap
- Discriminating test design constraint: The discriminating test compares clock, study, and quarter against the claimed timeline.
- Test must rely on already-shown clue IDs: clue_1, clue_2, clue_3, clue_culprit_direct_eleanor_voss, clue_mechanism_visibility_core
- Fair-play rationale: Step 1: The clock shows quarter past eight, eliminating Dr. Mallory Finch. Step 2: The misalignment of clock hands indicates tampering, narrowing time of death. Step 3: The scratch on the clock reveals manipulation, implicating Eleanor Voss.
- Never solve by withheld information. Keep reader-information parity with detective reasoning.

## Character Reference

### Eleanor Voss (she/her — NEVER he/him)
Eleanor speaks with an airy lilt, punctuating her sentences with playful sarcasm
She often employs euphemisms to mask her true feelings, making her words feel like a delicate dance around the truth.
Eleanor wrestles with the fear that her identity is intrinsically tied to her wealth. This case forces her to confront the possibility that her worth extends beyond her bank account.

### Beatrice Quill (she/her — NEVER he/him)
Beatrice speaks with a rapid-fire delivery, peppering her dialogue with sharp observations and a touch of sarcasm
She often uses rhetorical questions to engage her audience, making her sound both clever and confrontational.
Beatrice struggles with the ethical implications of her ambition, questioning whether the pursuit of a story is worth sacrificing her integrity.


## CHARACTER CONTRACTS (binding for this scene)
Each entry below constrains how this character must be written in this chapter.
These override generic style guidance when they conflict.

### Eleanor Voss[SHE]
Voice & mannerisms: Eleanor speaks with an airy lilt, punctuating her sentences with playful sarcasm. She often employs euphemisms to mask her true feelings, making her words feel like a delicate dance around the truth.
Sample voice fragments (match this register and rhythm):
  [comfortable] "Oh darling, don't you just adore the charm of these gatherings? Where secrets are the main course."
  [evasive] "I simply can't recall where I was at that hour, you know how it is—so many guests to entertain."
Humour: polite savagery — deploy occasionally (level 0.5)
FORBIDDEN phrase (never write for Eleanor Voss): "she felt a wave of unease"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "The murder of the victim strikes a chord with Eleanor, as she fears the victim's heirs might stake a claim to her family's wealth, further jeopardizing her already tenuous financial situation." — do not surface in Act I.

### Beatrice Quill[SHE]
Voice & mannerisms: Beatrice speaks with a rapid-fire delivery, peppering her dialogue with sharp observations and a touch of sarcasm. She often uses rhetorical questions to engage her audience, making her sound both clever and confrontational.
Sample voice fragments (match this register and rhythm):
  [comfortable] "Isn't the truth just waiting to be uncovered? It's thrilling, really!"
  [evasive] "I wasn't there at the time; I was busy gathering information, after all."
Humour: sardonic — deploy frequently (level 0.7)
FORBIDDEN phrase (never write for Beatrice Quill): "palpable tension filled the room"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Her ambition drives her to seek a sensational story from the murder, as she believes it could catapult her into the ranks of illustrious journalists." — do not surface in Act I.



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
A sprawling manor house steeped in mystery, surrounded by manicured gardens and an ancient forest, concealing secrets within its labyrinthine corridors.

Key Locations Available:
- Drawing Room (interior): Gathering space for guests
- Library (interior): Private study and clue discovery
- Study (interior): Private workspace and clue discovery
- Gardens (exterior): Outdoor area for reflection and potential clue discovery

Atmosphere: tense and foreboding, with an air of suspicion among the guests
Weather: overcast with occasional rain, typical of the English countryside

Era markers: manual typewriters in the study | rotary dial telephones in the hall | radio broadcasts in the drawing room

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
  - Visual: flickering gas lamps casting shadows, ornate mantelpiece with family portraits, overstuffed armchairs in rich fabrics
  - Sounds: the crackle of the fire, soft laughter and whispers, the ticking of a large grandfather clock
  - Scents: beeswax from candle holders, the faint scent of tobacco, polished wood and leather
  - Touch: soft velvet upholstery, cool marble of the fireplace

Library (interior):
  - Visual: dust motes floating in sunlight, leather-bound volumes lining the shelves, a fireplace with a wrought iron grate
  - Sounds: the rustle of pages turning, the ticking of a small clock, the distant sound of rain against the windows
  - Scents: old paper and leather, the musty scent of forgotten knowledge, smoky remnants from the fireplace
  - Touch: smooth wood of the desk, rough edges of old books

Study (interior):
  - Visual: sunlight streaming through the window, papers strewn across the desk, a flickering lamp casting shadows
  - Sounds: the clatter of typewriter keys, the rustle of paper, the wind whispering outside
  - Scents: fresh ink and paper, the scent of leather from a chair, the faint aroma of tobacco
  - Touch: smooth surface of the desk, the weight of a typewriter

⛔ REFERENCE DATA — DO NOT TRANSCRIBE VERBATIM: The above profiles are structural guides only. Generate original prose that evokes these qualities; do not reproduce the exact phrasing or sentence structure of the profile paragraphs.

SCENE OPENING RULE: When opening a scene in a new location, write what the POV character directly observes and physically senses at that moment — not a general description of the room's qualities. The reader must feel present, not briefed. Sensory details must be observed by the character, not stated as fact about the place.

SENSORY WRITING TECHNIQUES:
- Opening paragraphs: Lead with 2-3 sensory details to ground the scene
- Movement between locations: Note sensory changes (quiet study → noisy dining room)
- Emotional scenes: Use sensory details to reinforce mood (cold rain during argument)
- Period authenticity: Use period-specific sensory details from location/temporal profiles
- Avoi
[truncated for prompt budget]

## Texture Pool
Draw on these as opportunities arise — you are not required to use them.

- Living in November 1932, the English countryside is marked by an oppressive atmosphere of economic uncertainty and societal change
- The recent Great Depression casts a long shadow over the elite, where the remnants of old-world charm clash with the harsh realities of dwindling fortunes
- As the sun sets early, the long, dark evenings are filled with hushed conversations about dwindling resources and the looming threat of fascism across Europe
- Social gatherings, once filled with laughter and light, now harbor an undercurrent of suspicion and anxiety, as the rigid class system struggles under the weight of financial strain
- Women navigate their roles delicately, balancing societal expectations with emerging feminist ideals, while men cling to traditional authority amidst growing social unrest

TEMPORAL CONTEXT:

This story takes place in November 1932 during N/A.

Seasonal Atmosphere:
- Weather patterns: overcast skies, occasional light rain, chilly winds
- Daylight: Short days with twilight settling by four o'clock in the afternoon, making evenings long and dark.
- Seasonal activities: hunting parties in the countryside, afternoon teas by the fire, preparations for Christmas festivities
- Seasonal occasions: Guy Fawkes Night (November 5)
- Season: N/A

Period Fashion (describe naturally):
- Men formal: tailored morning coat, waistcoat in houndstooth pattern, cravat or tie with subtle patterns
- Men casual: tweed flat cap, corduroy trousers, wool pullover
- Men accessories: silver pocket watch, cane for outdoor events, leather gloves
- Women formal: tea-length evening gown with drop waist, beaded cloche hat, long pearl necklace
- Women casual: high-waisted skirt with a fitted blouse, knitted cardigan, tweed jacket
- Women accessories: fur stole, silk scarf, sensible leather handbag

Cultural Context (reference naturally):
- Music/entertainment: 'Night and Day' by Cole Porter, 'The Best Things in Life Are Free' by Ray Henderson, 'My Heart Stood Still' by Richard Rodgers; Films: 'Scarface' directed by Howard Hawks, 'The Most Dangerous Game'; Theatre: 'Of Mice and Men' by John Steinbeck, 'The Royal Family' by George S. Kaufman; Radio: 'The Shadow' broadcasts, News bulletins from the BBC
- Typical prices: Loaf of bread: four pence, Cinema ticket: six pence, Pint of ale: one shilling
- Current events: Presidential election results in the United States favoring Franklin D. Roosevelt; Continued effects of the Great Depression on employment and economy
- Literature: 'Brave New World' by Aldous Huxley | 'Murder in the Cathedral' by T.S. Eliot | 'Turtle Island' by John Steinbeck | [detective fiction] | [social commentary novels] | [romantic fiction]
- Technology: the electric refrigerator becoming more common | advancements in radio technology | early development of the electric washing machine | radio sets in most homes | rotary dial telephones | manual typewriters
- Daily life: hunting parties on weekends, afternoon tea gatherings, visiting local markets for fresh produce
- Social rituals: formal dinner parties, Sunday church services, seasonal preparations for Christmas feasts

Atmospheric Details:
The damp chill lingers in the air, the scent of wet earth mixing with the faint aroma of burning logs in the fireplace. The flicker of candlelight casts long shadows across the drawing room, where whispers of scandal and intrigue fill the space. Outside, the rustling of leaves underfoot and the distant sound of hunting horns echo through the estate, heightening the feeling of tension.

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
- Social c
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

• [clue_core_contradiction_chain] This indicates that the murder could not have occurred after eight o'clock.
  Category: temporal | Criticality: essential | Supports inference step 1
  Points to: This contradicts any claims of the murder happening later.

• [clue_mechanism_visibility_core] A mechanical clock was tampered with to alter the timeline of the murder.
  Category: temporal | Criticality: essential | Supports inference step 1
  Points to: This reveals the core mechanism of the crime.

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

CLUES ALREADY REVEALED TO READER: clue_1, clue_2 — do not reveal these as new information.

INVESTIGATION LOG — WHAT IS ESTABLISHED (do not re-establish, do not repeat):
• Evidence in reader's hands: The clock in the study shows the time as quarter past eight. | This indicates that the murder could not have occurred after eight o'clock.
• Suspects still unresolved: Dr. Mallory Finch[SHE], Captain Ivor Hale[HE], Beatrice Quill[SHE]
⚠ The story must move FORWARD from this log. Any beat already listed above is forbidden from repeating.

⚠ THIS CHAPTER'S REQUIRED ADVANCE (early): Interview each suspect — record their claimed whereabouts

CONTINUITY HANDOFF — previous chapter closing beat:
  • "As the interviews continued, Beatrice felt the tension rise, a taut string ready to snap. She needed to keep the focus on the facts, to separate the emotions from the investigation. "Thank you, Dr. Finch, Captain Hale. I appreciate your cooperation. We will ne..."
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
study, manor, dining room, drawing room

✓ RULE: Continue using this location vocabulary. Maintain consistency with established setting type.
✓ Do NOT introduce new location types that contradict earlier chapters.

**Recent Chapter Summary (for narrative continuity):**
Chapter 1: Chapter 1: Discovery
  Events: Eleanor Voss stood frozen by the door of the study, her expression a mask of shock and confusion.
Chapter 2: Chapter 2: Initial Interviews
  Events: The evening air was thick with tension, a palpable weight that settled over the gathered guests in the dining room.

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
Known location profile anchors: Little Middleton Manor, Drawing Room, Library, Study, Gardens, the study
LOCATION NAME CAPITALISATION (HARD REQUIREMENT — validated):
All named locations in your prose MUST use the EXACT capitalisation from the CML profiles.
Canonical forms: "Little Middleton Manor", "Drawing Room", "Library", "Study", "Gardens", "the study"
Writing a location in lowercase (e.g. "drawing room" instead of "Drawing Room") is a validated error. Every time you mention a named location, copy its capitalisation from the list above.
- Chapter 3: OPENING STYLE (HARD): Start the VERY FIRST SENTENCE with an explicit time marker — e.g. "At half past nine…" / "At midnight…" / "At a quarter to eleven…" / "At half past nine at night…". Time must be in the first clause. Anchor opening in "the study". HARD REQUIREMENT for the first 2 paragraphs: (a) include 2+ sensory words — choose from smell/scent/sound/echo/silence/creak/whisper/cold/warm/damp/rough/smooth/glow/shadow/flicker/dim — and (b) include 1+ atmosphere/time word — choose from rain/wind/fog/storm/mist/thunder/evening/morning/night/dawn/dusk/season/afternoon/midday/noon/midnight/twilight/sunrise/sunset/daylight/sunlight/overcast/cloudy/bright/dark. These are validated requirements, not style suggestions; missing them triggers a retry.

[⚠ INTERNAL QUALITY DIAGNOSTICS — DO NOT REPRODUCE ANY PART OF THIS SECTION IN YOUR STORY OUTPUT. These are private generator observations for your consideration only. Your narrative must read as if this section does not exist. Never include phrases from this block in character dialogue, narration, or description.]

PRIOR CHAPTER QUALITY OBSERVATIONS:
- Chapter 1 (score 86/100):
  Quality gaps noted: word density below preferred target (645/1000); scene grounding weakness
  Address in upcoming chapters: Increase chapter density with concrete investigation action and sensory-grounded beats; avoid recap-only padding. | Open next chapter with a named location anchor plus at least two sensory cues and one atmosphere marker.
- Chapter 2 (score 92/100):
  Quality gaps noted: word density below preferred target (844/1000); scene grounding weakness
  Address in upcoming chapters: Increase chapter density with concrete investigation action and sensory-grounded beats; avoid recap-only padding. | Open next chapter with a named location anchor plus at least two sensory cues and one atmosphere marker.
[END INTERNAL DIAGNOSTICS]

PROMPT BUDGET SUMMARY: budget=32000 tokens; fixed=7793; context=10160; dropped=[none]; truncated=[pronoun_accuracy, location_profiles, temporal_context]

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
8. Integrate at least two concrete era-grounded details per chapter from setting refinement signals: radio broadcasts in living rooms | early rotary dial telephones in homes | manual typewriters in offices | party-line telephone systems | telegram services for urgent messages | airmail for faster correspondence.
9. Respect setting movement/access constraints in scene action and alibis: narrow corridors restrict movement and visibility | locked rooms and private studies limit access | weather conditions can hinder outdoor evidence collection | specific permissions required to access the library and study | servants have restricted access to certain areas.
10. Sustain social coherence with this backdrop pressure: A gathering of the manor's elite for a charitable event is overshadowed by the Great Depression's strain on wealth and privilege, as tensions rise amidst the looming threat of fascism and the secrets harbored within the estate's walls.
11. Maintain continuity around these socially central cast anchors where relevant: Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill.
12. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Critical: Plot similarity 0.75 with 'The Mysterious Affair at Styles' (same inheritance dispute theme)
13. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Moderate: Character similarity 0.74 with 'The Sign of the Four' (similar cast structure and dynamics)
14. STORY TO DATE ANTI-COPY RULE: The STORY TO DATE section below is provided for chronological and factual reference ONLY. You MUST NOT copy, lightly rephrase, or structurally echo any sentence or paragraph from prior chapters. Every sentence in this chapter must be original prose unique to this scene. Reusing even a clause from prior chapter text will cause this attempt to fail immediately.

CRITICAL PROSE REQUIREMENTS:

The CML specifies exact requirements for certain validation-critical scenes. You MUST include these elements at the specified positions.

**Discriminating Test Scene (Act 3, Scene 4):**
Required elements: Execute the discriminating test, Observe the clock's mechanism, Draw conclusion about Eleanor's guilt
Test type: mechanical examination

**Suspect Clearance Scenes:**
- Dr. Mallory Finch (Act 3, Scene 5): Demonstrate his alibi is consistent with the timeline.
  Clues: clue_1, clue_2
- Captain Ivor Hale (Act 3, Scene 5): Show his access was limited during the time of the murder.
  Clues: clue_1, clue_2

**Culprit Revelation Scene (Act 3, Scene 6):**
Method: Confrontation with evidence from the clock.

**Clue Placement for These Chapters:**
- clue_core_contradiction_chain must appear in Act 1, Scene 3 via Cross-check contradiction
- clue_mechanism_visibility_core must appear in Act 1, Scene 3 via Direct observation

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
  - Scene is set in: the study — reference it naturally within the paragraph, never as your opening phrase.
  - Opening atmosphere (MANDATORY — validator enforced): the first paragraph MUST contain at least one of: rain / wind / fog / storm / mist / thunder / evening / morning / night / dawn / dusk / season / afternoon / midday / noon / midnight / twilight / sunrise / sunset / daylight / sunlight / overcast / cloudy / bright / dark / grey / pale / cold / warm / chill / crisp / damp / drizzle / haze / lamplight / firelight. A chapter that omits all of these from its opening paragraph will be rejected.
  - Continuity bridge: in the first 120 words, visibly connect from the previous chapter's final beat. Carry forward one unresolved element (object, accusation, emotional pressure, or immediate physical action) from: "As the interviews continued, Beatrice felt the tension rise, a taut string ready to snap. She needed to keep the focus on the facts, to separate the emotions from the investigation. "Thank you, Dr. Finch, Captain Hale. I...".
  - CLUE OBLIGATIONS — mandatory prose elements (do NOT omit or bury):
    • This indicates that the murder could not have occurred after eight o'clock. [clue_core_contradiction_chain] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: This contradicts any claims of the murder happening later.
      ↳ MANDATORY TWO-PARAGRAPH STRUCTURE (must appear in paragraphs 1 or 2 — no later):
         Paragraph 1: The POV character physically approaches or directly observes this evidence.
           The narration or dialogue explicitly states what is seen (use the exact locked phrase if one applies).
         Paragraph 2 (immediately following): The detective or POV character explicitly reasons
           about what this evidence implies — who it implicates, why it may be unreliable,
           or what inference it supports. This must be a separate full paragraph, not a sentence appended to Paragraph 1.
    • A mechanical clock was tampered with to alter the timeline of the murder. [clue_mechanism_visibility_core] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: This reveals the core mechanism of the crime.
      ↳ MANDATORY TWO-PARAGRAPH STRUCTURE (must appear in paragraphs 1 or 2 — no later):
         Paragraph 1: The POV character physically approaches or directly observes this evidence.
           The narration or dialogue explicitly states what is seen (use the exact locked phrase if one applies).
         Paragraph 2 (immediately following): The detective or POV character explicitly reasons
           about what this evidence implies — who it implicates, why it may be unreliable,
           or what inference it supports. This must be a separate full paragraph, not a sentence appended to Paragraph 1.
  - Tonal contrast: include at least one beat of relief or ironic counterpoint. Do not sustain maximum tension for every paragraph.
  - Sensory obligation — use at least two of: shadows stretching across the desk, the flicker of a lamp | the creak of the chair, the whisper of the wind | the rich scent of tobacco. Mood: uneasy stillness.
- Locked fact phrase obligations:
  - If this batch mentions The exact time shown on the stopped clock face, write exactly: "ten minutes past eleven".
  - If this batch mentions The exact amount the clock was wound back, write exactly: "forty minutes".
- Seasonal vocabulary allow-list: autumn, autumnal, fall.
- Forbidden seasonal words: spring, summer, winter.

FROZEN FACT STATE (DO NOT ALTER):
- Timeline anchor: November (autumn).
- Month, season, weather, and time-of-year language in this batch must stay compatible with autumn.
- Established timeline fact: 8:00 PM
- Established timeline fact: 9:00 PM
- If referenced, use exact phrase: "ten minutes past eleven" (The exact time shown on the stopped clock face).
- If referenced, use exact phrase: "forty minutes" (The exact amount the clock was wound back).

STORY TO DATE (REFERENCE ONLY — DO NOT COPY VERBATIM):
- Full prior chapter text is provided below for continuity, factual consistency, and reference accuracy.
- Use this to keep character voice, chronology, clue state, and location continuity aligned with earlier chapters.
- Do not quote, copy, or paraphrase these paragraphs too closely; write fresh prose that remains consistent with them.

--- BEGIN PRIOR CHAPTER 1 ---
Title: Chapter 1: Discovery
Eleanor Voss stood frozen by the door of the study, her expression a mask of shock and confusion. The faint sound of steady rain pattered against the window, the damp chill seeping into the room as if the very air was mourning. She could hardly comprehend the scene before her, the room heavy with an oppressive silence that felt almost tangible. The flickering lamplight cast long shadows across the polished wood of the desk, illuminating the chaos that surrounded her. Papers lay strewn about, and the scent of tobacco lingered in the air, a reminder of the life that had been so abruptly extinguished.

As Beatrice Quill stepped into the study, she felt the weight of the atmosphere settle around her like a shroud. The clock on the mantelpiece caught her eye, its hands frozen in time, the face displaying the time as quarter past eight. The sight sent a chill down her spine, a stark reminder of the moment the victim had been declared dead. Beatrice approached the clock, her fingers brushing against its cold surface, as she mentally noted the implications of its stillness. This clock, once a keeper of time, now served as a harbinger of tragedy.

The implications of the clock's position were not lost on Eleanor. "It can't be right, can it? I heard it strike just before... before everything happened," she stammered, her voice trembling slightly. The confusion in her tone was palpable, and Beatrice could see the panic rising in Eleanor's eyes. The clock's time contradicted the alibis of the other suspects, and Beatrice's mind raced with the possibilities. If the clock had indeed struck at the wrong time, it could complicate the investigation further, leaving them with more questions than answers.

Beatrice turned to Eleanor, her expression serious. "We need to think this through. If the clock shows quarter past eight, then the victim must have died no later than ten minutes past eleven. That contradicts the accounts of everyone who claims to have been elsewhere at that time. We need to be careful about what we say, especially if someone is listening."

Eleanor nodded, her brow furrowing as she processed the information. "I just can't believe this is happening. It feels like a nightmare I can't wake up from. I thought we were safe here, away from all the madness outside. But now... now it's all come crashing down." Her voice quivered, and Beatrice could see the strain of the situation etched across Eleanor's features. The façade of composure was cracking, revealing the raw fear beneath.

The rain continued to drum against the window, a relentless reminder of the storm brewing both outside and within the manor. Beatrice glanced around the study, taking in the disarray and the remnants of a life once filled with laughter and light. She felt a pang of sympathy for Eleanor, caught in the web of suspicion that now surrounded her. "We need to find out what really happened here, Eleanor. We can't let this go unanswered. The truth is out there, and we must uncover it before it's too late."

Eleanor took a deep breath, her resolve hardening. "You're right, Beatrice. We owe it to her—to find justice for her. But where do we even begin? Everyone had access to the study, and I can't shake the feeling that one of us is hiding something. I just wish I could remember more clearly. Everything is so jumbled in my mind."

The tension in the room was palpable, a taut string ready to snap at any moment. Beatrice stepped closer to Eleanor, her voice low and steady. "We start by retracing the last moments before the murder. We need to gather every detail, no matter how small. The clock may have stopped, but our investigation cannot. We must keep moving forward, even if it feels like we're stumbling in the dark."
--- END PRIOR CHAPTER 1 ---

--- BEGIN PRIOR CHAPTER 2 ---
Title: Chapter 2: Initial Interviews
The evening air was thick with tension, a palpable weight that settled over the gathered guests in the dining room. "We start by retracing the last moments before the murder," Beatrice Quill declared, her voice steady despite the storm brewing outside. Rain drummed against the windowpanes, a relentless reminder of the chaos that had unfolded within the manor's walls. The flickering lamplight cast long shadows across the polished table, illuminating the anxious faces of those present. Eleanor Voss sat at the head of the table, her fingers nervously twisting a napkin as she avoided the gazes of the others. The atmosphere was a mix of anxiety and curiosity as the guests exchanged uneasy glances, each one aware that the truth lay just out of reach.

Beatrice took a deep breath, her eyes scanning the room. "I need to hear from each of you about your whereabouts during the time of the murder. Dr. Finch, perhaps you could start?" the doctor Finch, seated to Eleanor's right, straightened in her chair, her expression a careful mask of professionalism. "I was in my office, attending to patients. I was on call that evening, and I assure you, I was quite busy. I didn’t enter the study until after...well, until after it happened." Her voice was calm, but Beatrice noted the slight tremor in her hands as she clasped them together on the table. The tension in the room was thickening, each word adding to the unease.

Eleanor's gaze flickered to Dr. Finch, her brow furrowing. "But you were seen leaving the study just before the incident, weren't you?" Beatrice interjected, keen to keep the focus on the doctor. "Yes, I was, but I assure you, I did not see anything unusual. The clock in the study was already showing quarter past eight when I left. I can’t imagine how much later the murder could have occurred." Beatrice's mind raced at the implications of the clock's time. This indicates that the murder could not have occurred after eight o'clock. If Dr. Finch's alibi held, it would contradict any claims of the murder happening later. The clock was a witness, silent yet damning.

Eleanor's expression shifted, a flicker of panic crossing her features. "But I heard it strike just before... before everything happened. It can't be right, can it?" Beatrice observed the way Eleanor's hands trembled, the napkin now crumpled in her grip. The uncertainty in Eleanor's voice was unsettling; it hinted at deeper fears that lay beneath the surface. Beatrice leaned forward, her tone softening. "Eleanor, we need to be clear about what you remember. Every detail matters, even if it feels jumbled. Can you tell us what you saw?"

Eleanor hesitated, her eyes darting to the captain Hale, who sat across the table, her jaw set in a grim line. "I... I was in the drawing room, entertaining guests. I thought I saw a shadow near the study, but it was dark, and I didn’t think much of it at the time," Ivor interjected, her voice steady but with an edge of defensiveness. Beatrice's interest piqued at this revelation. A shadow near the study could mean someone had been lurking, but who? The implication of Ivor's observation created a ripple of tension among the guests, each one acutely aware of the implications.

Beatrice turned her attention back to Eleanor, who was now visibly distressed. "Eleanor, your last sighting of the victim is crucial. Please, try to recall anything you can. Did you see anyone else in the vicinity?" Eleanor's voice quivered as she spoke, "I... I can’t remember clearly. I thought I saw someone, but it was all so fast. I just wanted to ensure everything was perfect for the gathering. I was so worried about the guests, and then... then it all went wrong." Her admission hung in the air, a confession that raised more questions than it answered.

The atmosphere in the dining room shifted as Beatrice noted the defensive postures of the suspects. Captain Hale's fists clenched at her sides, and Dr. Finch's gaze darted between Eleanor and Beatrice, as if weighing her words. Beatrice could sense the growing suspicion, the unspoken accusations that lingered just beneath the surface. Each suspect was aware that their alibis were now in direct conflict with one another, and the weight of their shared presence in the house at the time of the murder complicated the timeline further. Everyone had access, and the implications of that were staggering.

As the interviews continued, Beatrice felt the tension rise, a taut string ready to snap. She needed to keep the focus on the facts, to separate the emotions from the investigation. "Thank you, Dr. Finch, Captain Hale. I appreciate your cooperation. We will need to verify your accounts further, but for now, I want to give Eleanor a moment to gather her thoughts." Beatrice's voice was firm yet compassionate, recognizing the strain the situation placed on Eleanor. The young woman looked as though she might crumble under the weight of scrutiny, and Beatrice felt a surge of protectiveness for her.
--- END PRIOR CHAPTER 2 ---

[SCENE COMPLETENESS CONTRACTS — MANDATORY. Each contract below lists what you MUST enact in that chapter. Do not summarise or mention these labels in the prose — enact them organically.]
Chapter 3 (Act 1) completeness contract:
  PIVOT ELEMENT (MANDATORY — write this into the prose, shown not told): "The misaligned clock hands that do not match the wall markings."
  FACT ESTABLISHED (MANDATORY — reader must know this by chapter end): "Establishes that the clock may have been tampered with, suggesting the murder occurred before ten minutes past eleven."

# Case Overview
Title: The Clockwork Conundrum
Era: 1930s
Setting: Little Middleton
Crime: murder (inheritance dispute)
Culprit: Eleanor Voss
False assumption: The murder occurred after Eleanor Voss claims to have left the study.
Cast: Eleanor Voss (she/her), Dr. Mallory Finch (she/her), Captain Ivor Hale (he/him), Beatrice Quill (she/her)

Setting Lock: Keep all scenes and descriptions consistent with the stated setting (Little Middleton). Do not introduce a different location type.

Outline scenes:
[
  {
    "sceneNumber": 3,
    "act": 1,
    "title": "Contradictions Uncovered",
    "setting": {
      "location": "the study",
      "timeOfDay": "Afternoon",
      "atmosphere": "Heavy with tension as evidence is examined"
    },
    "characters": [
      "Beatrice Quill",
      "Eleanor Voss"
    ],
    "purpose": "Cross-check statements for contradictions",
    "cluesRevealed": [
      "clue_core_contradiction_chain",
      "clue_mechanism_visibility_core"
    ],
    "dramaticElements": {
      "conflict": "Tension escalates as contradictions emerge.",
      "tension": "Eleanor begins to show signs of distress.",
      "microMomentBeats": [
        "Beatrice notices Eleanor's hands tremble as she recalls her movements."
      ]
    },
    "summary": "In the study, Beatrice Quill examines the clock and compares it to the testimonies of the suspects. She uncovers contradictions in the timeline, leading her to suspect tampering.",
    "estimatedWordCount": 1800,
    "pivotElement": "The misaligned clock hands that do not match the wall markings.",
    "factEstablished": "Establishes that the clock may have been tampered with, suggesting the murder occurred before ten minutes past eleven.",
    "permittedBehavioursByAct": [
      {
        "characterName": "Eleanor Voss",
        "behaviour": "cooperative grief; no guilt-tells in Act I"
      }
    ],
    "redHerringPlacement": null,
    "emotionalRegister": "Suspicion begins to creep in, creating an uneasy tension among the guests.",
    "dominantCharacterNote": {
      "name": "Eleanor Voss",
      "voiceRegister": "Eleanor speaks with an airy lilt, her words often layered with playful sarcasm and euphemisms."
    },
    "humourGuidance": {
      "permission": "forbidden"
    },
    "eraTextureNote": "Limited communication options due to reliance on rotary telephones; Travel difficulties caused by economic constraints; Shortened daylight hours impacting social gatherings; Restricted access to resources as people hoard supplies; Chilly autumn weather affecting outdoor activities",
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
□ Chapter 3: "This indicates that the murder could not have occurred after eight o'clock." is placed in the first 25% of the chapter, followed by an explicit inference or suspicion paragraph.
□ Chapter 3: "A mechanical clock was tampered with to alter the timeline of the murder." is placed in the first 25% of the chapter, followed by an explicit inference or suspicion paragraph.
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
