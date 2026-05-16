# Actual Prompt Record

- Run ID: `mystery-1778792031869`
- Project ID: ``
- Timestamp: `2026-05-14T20:58:58.209Z`
- Agent: `Agent9-ProseGenerator-Ch2`
- Operation: `chat_request_full_prompt`
- Model: `GPT-4o-mini`
- Temperature: `0.42`
- Max Tokens: `4500`
- Attempt: `first`
- Prompt Hash: `209faaa4b036fef1`

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
- MORAL COMPLEXITY REQUIREMENT: The mechanism of this crime carries a moral gray area: "The murderer acted out of desperation to protect a loved one, complicating the morality of their actions." — the culprit reveal and denouement MUST acknowledge this ambiguity. Do not let the ending feel clean or simple. Give the reader at least one moment of uncomfortable sympathy or moral doubt.


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

## Era: 1936 January
Living in January 1936, the English countryside feels heavy under a blanket of damp, cold air, with the gloom of winter accentuating the struggles of the ongoing Great Depression. Class divisions are stark, as the upper classes maintain their lifestyles while the working class faces severe hardships. The tension in society is palpable, with whispers of fascism and the specter of war looming on the horizon. Traditional gender roles are still deeply entrenched, yet the winds of change are beginning to stir as women increasingly advocate for their independence. The daily lives of the characters are marked by strict social rituals and the weight of expectations, creating an atmosphere thick with unfulfilled aspirations and hidden resentments.
Emotional register: A collective sense of anxiety and unease permeates society, as individuals grapple with their hopes and fears amidst economic and political uncertainty.
Physical constraints: Limited mobility due to harsh winter weather conditions. | Communication difficulties exacerbated by poor telephone infrastructure. | Social gatherings are tightly controlled due to class hierarchies.
Current tensions (weave into background texture): The rise of fascism in Europe threatens political stability. | Economic strains from the Great Depression exacerbate class tensions. | Rumblings of impending war create anxiety among the populace.
Wartime context — N/A: Social interactions are heavily influenced by class distinctions, with servants navigating a complex web of loyalty and ambition. Absence effect: The looming shadows of war create a sense of urgency and desperation, driving characters to consider drastic actions.

## Season Lock (mandatory — derived from 1936 January)
Season: winter. Allowed vocabulary: winter, wintry, midwinter
Forbidden seasonal words — never use in narration, dialogue, or metaphor: spring, summer, autumn and their adjectival forms.
Every weather description, atmosphere, and time-of-year reference must be consistent with winter.

## Story Theme
In the shadow of economic despair, the characters in 'The Clock's Deceit' confront their hidden motivations and the consequences of ambition, revealing how desperation can lead to tragic choices.

## Story Emotional Register
Dominant: The story is steeped in tension and foreboding, reflecting the characters' struggles as they confront their hidden truths.

Arc:
In the quiet grandeur of Middleton Hall, a sense of dread hangs in the air as the will reading of Eleanor Voss approaches, casting a pall over the assembled heirs and guests. The atmosphere is thick with unspoken secrets, and when Eleanor is found dead shortly after the reading, it sends shockwaves through the estate. As the investigation unfolds, the initial discovery of the tampered clock fuels rising unease; each clue reveals layers of deceit that threaten to unravel the lives of everyone involved. Beatrice Quill, with her charm, struggles to maintain her façade as the pressure mounts, while Dr. Mallory Finch grapples with his unrequited love for Eleanor and the jealousy that simmers beneath his professional exterior. The first investigative turn reveals discrepancies in the timeline, igniting a frantic search for the truth.

A pivotal moment occurs when the investigator uncovers the scratch on the clock, indicating recent tampering, shifting the focus to Dr. Finch, who had access to the mechanism. With each revelation, the stakes rise, leading to a pre-climax filled with tension as the characters confront their motivations and the consequences of their actions. The climax hits as the investigator confronts Dr. Finch with undeniable evidence of his tampering, forcing him to confront his feelings of jealousy and betrayal. In the resolution, the emotional toll of the events weighs heavily on all characters; Eleanor's dreams of freedom are cut short, while the others are left grappling with the choices that led them to this tragic moment, forever changed by the clock's deceit.

## Emotional register at this point in the story
The atmosphere is thick with anticipation, overshadowed by the looming threat of betrayal.

## Character Portraits (appearance & era)

### Eleanor Voss
Eleanor Voss embodies the struggle of the working class in the 1930s, wrestling with her financial instability and the burden of hidden knowledge. Her loyalty to the Hawthorne family contrasts sharply with her desperation to secure a future of her own. As the Great Depression looms, her dreams of independence clash with the realities of class divisions, making her a poignant representation of the era's struggles.
Era intersection: Eleanor's hidden motivations are intensified by the societal pressures of the 1930s, as her need for security mirrors the broader economic anxieties faced by many.

### Dr. Mallory Finch
Dr. Mallory Finch is a reflection of the conflicted professional class in the 1930s, caught between duty and desire. His unrequited love for Eleanor and resentment towards the victim highlight the emotional toll of the era, where personal ambitions often clash with societal expectations. Mallory's role as the family physician places him at the intersection of privilege and emotional turmoil, emblematic of the struggles faced by many men of his time.
Era intersection: Mallory's longing and jealousy are heightened by the constraints of the 1930s, where traditional roles and expectations weigh heavily on personal desires.

### Captain Ivor Hale
Captain Ivor Hale represents the disillusioned military class of the 1930s, grappling with the bitterness of lost ambitions and unfulfilled dreams. His past ties to the Hawthorne family and resentment towards their wealth reflect the class grievances that simmer beneath the surface. As a war veteran, Ivor's struggles are compounded by the political tensions of the era, making him a tragic figure caught between nostalgia and the harsh realities of the present.
Era intersection: Ivor's bitterness is emblematic of a generation grappling with the aftermath of war and the changing social landscape of the 1930s, where loyalty and betrayal intertwine.

### Beatrice Quill
Beatrice Quill embodies the complexities of the emerging modern woman in the 1930s, caught between charm and desperation. Her embezzlement from family funds reflects the societal pressures on women to maintain appearances, even at the cost of morality. Beatrice's struggle to secure her inheritance highlights the broader economic tensions faced by women during the Great Depression, showcasing the lengths to which individuals will go to protect their status.
Era intersection: Beatrice's actions are a direct response to the economic constraints of the 1930s, revealing how societal expectations can drive individuals to make morally questionable choices.

## Character Voices

### Eleanor Voss (she/her/her)
Eleanor speaks with a calm, measured tone, often punctuating her sentences with wry observations about the family's foibles.
[comfortable] You know, sometimes I wonder if the pantry is more organized than our lives.
[evasive] Oh, I was simply busy with the pantry; nothing out of the ordinary, really.
[stressed] I just can't shake off this feeling that everything is about to change, and not for the better.
Humour: Eleanor's dry wit often serves as her shield against the weight of her secrets.

### Dr. Mallory Finch (he/him/his)
Dr. Finch speaks with a measured cadence, often punctuating his observations with a slight, knowing smile.
[comfortable] It's fascinating how the human body can be so resilient, yet so fragile.
[evasive] I was merely attending to a patient; nothing that would concern the family.
[stressed] I can't help but feel that this situation is spiraling out of control.
Humour: Mallory's observational humor often betrays his inner turmoil.

### Captain Ivor Hale (he/him/his)
Ivor speaks with a commanding presence, his sentences often laced with dry humor.
[comfortable] In my day, we had real challenges — not just tea parties and social calls.
[evasive] I don't recall the exact timeline; too many drinks can cloud the memory.
[stressed] If only they could see the truth behind this charade; it’s all a facade!
Humour: Ivor's sardonic wit provides a glimpse into his disillusionment.

### Beatrice Quill (she/her/her)
Beatrice speaks with an effervescent charm, her words often laced with a sharp wit.
[comfortable] Isn't it delightful to be surrounded by such charming company?
[evasive] Oh, I was at the charity event; nothing to worry about!
[stressed] What if they find out? I simply cannot let anyone know!
Humour: Beatrice's polite savagery masks her desperation.

## Location Registers (scene framing guides)

The East Wing Library: The East Wing Library feels charged with tension, each shadow whispering secrets of betrayal as the investigation unfolds. The weight of the past lingers in the air, as dust motes dance in the dim light, and every creak of the floorboards heightens the sense of foreboding.. Camera angle: Entering this space feels like stepping into the heart of the mystery, where every detail could unravel the dark secrets contained within.. Era: The library's isolation reflects the constraints of class and the isolation felt by the characters in this tumultuous era.

The Drawing Room: The Drawing Room is oppressive with unspoken tension, where laughter once filled the air but now only silence reigns. The flickering candlelight casts long shadows, hinting at the hidden agendas of its occupants, as secrets simmer just beneath the surface.. Camera angle: Walking into this space feels like entering a stage where each character plays a role, teetering on the brink of revelation.. Era: The opulence of the room masks the underlying class tensions that define the era.

The Servants' Hall: The Servants' Hall buzzes with hushed conversations, a stark contrast to the opulence of the main house. The atmosphere is thick with camaraderie and anxiety, as the staff navigate their delicate positions within the rigid class structure, their whispers echoing the secrets of the household.. Camera angle: Entering this space feels like peering behind the curtain of the grand estate, where the true dynamics of power and loyalty play out.. Era: The simplicity of the hall reflects the broader social divide and the challenges faced by those serving the upper classes.

## Humour guidance for this story position (opening)
Permission: forbidden
Rationale: The gravity of the will reading and the looming threat of murder do not allow for humor.

FAIR-PLAY AND INFERENCE CONTRACT (from CML logic):
- False assumption in force: Eleanor Voss died shortly after the clock indicated a specific time.
- Hidden truth to progressively expose: The clock was tampered with, hiding the true time of death.
- Inference path checkpoints to dramatize clearly (observation -> correction -> effect):
  - Step 1: obs: The clock in the study shows ten minutes past eleven. | corr: The clock's time does not match the witness accounts of Eleanor being alive at 10:50 AM. | effect: Narrows time window for the murder to before 10:50 AM.
  - Step 2: obs: A faint scratch is found on the clock casing. | corr: The scratch indicates recent tampering, suggesting the clock was manipulated. | effect: Eliminates the possibility that the clock has shown the correct time.
  - Step 3: obs: Eleanor's watch shows a different time than the clock. | corr: Eleanor's watch indicates she was killed before the clock was tampered. | effect: Narrows down the timeline further, suggesting Dr. Mallory's involvement.
- Discriminating test method: trap
- Discriminating test design constraint: A controlled comparison of the clock's time against Eleanor's watch shows clear discrepancies, proving the clock was tampered with.
- Test must rely on already-shown clue IDs: clue_1, clue_2, clue_3, clue_4
- Fair-play rationale: Step 1: The clock shows a time that conflicts with witness accounts. Step 2: The scratch on the clock indicates tampering. Step 3: Eleanor's watch shows a different time, proving the clock was manipulated.
- Never solve by withheld information. Keep reader-information parity with detective reasoning.

## Character Reference

### Eleanor Voss
Eleanor speaks with a calm, measured tone, often punctuating her sentences with wry observations about the family's foibles, revealing her sharp mind beneath her service-oriented façade.
While she yearns for a better life, Eleanor grapples with the moral implications of her knowledge and the potential betrayal of those she has served for years.

### Dr. Mallory Finch
Finch speaks with a measured cadence, often punctuating his observations with a slight, knowing smile that hints at a deeper understanding of the human condition.
Caught between his affection for Eleanor and his professional duty to the family, Mallory wrestles with feelings of resentment and longing that threaten to consume him.

### Captain Ivor Hale
Ivor speaks with a commanding presence, his sentences often laced with dry humor that betrays his disillusionment, punctuated by a theatrical flair that demands attention.
Haunted by a sense of betrayal and loss, Ivor struggles against the bitterness that threatens to consume him, caught between a desire for revenge and the possibility of redemption.

### Beatrice Quill
Beatrice speaks with an effervescent charm, her words often laced with a sharp wit that cuts through the surface of social niceties, revealing her keen intellect.
Despite her outward confidence, Beatrice grapples with the fear of losing everything she has worked for, caught between her desires and the consequences of her actions.


## CHARACTER CONTRACTS (binding for this scene)
Each entry below constrains how this character must be written in this chapter.
These override generic style guidance when they conflict.

### Eleanor Voss
Voice & mannerisms: Eleanor speaks with a calm, measured tone, often punctuating her sentences with wry observations about the family's foibles, revealing her sharp mind beneath her service-oriented façade.
Sample voice fragments (match this register and rhythm):
  [comfortable] "You know, sometimes I wonder if the pantry is more organized than our lives."
  [evasive] "Oh, I was simply busy with the pantry; nothing out of the ordinary, really."
Humour: dry wit — deploy occasionally (level 0.5)
FORBIDDEN phrase (never write for Eleanor Voss): "a surge of determination washed over her"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Eleanor's desperation for security in the face of the family's financial struggles fuels her motives." — do not surface in Act I.

### Dr. Mallory Finch
Voice & mannerisms: Dr. Finch speaks with a measured cadence, often punctuating his observations with a slight, knowing smile that hints at a deeper understanding of the human condition.
Sample voice fragments (match this register and rhythm):
  [comfortable] "It's fascinating how the human body can be so resilient, yet so fragile."
  [evasive] "I was merely attending to a patient; nothing that would concern the family."
Humour: observational — deploy occasionally (level 0.4)
FORBIDDEN phrase (never write for Dr. Mallory Finch): "everyone could sense the atmosphere"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "He believes that the victim is an obstacle to a future with Eleanor, igniting a simmering conflict within him." — do not surface in Act I.

### Captain Ivor Hale
Voice & mannerisms: Ivor speaks with a commanding presence, his sentences often laced with dry humor that betrays his disillusionment, punctuated by a theatrical flair that demands attention.
Sample voice fragments (match this register and rhythm):
  [comfortable] "In my day, we had real challenges — not just tea parties and social calls."
  [evasive] "I don't recall the exact timeline; too many drinks can cloud the memory."
Humour: sardonic — deploy occasionally (level 0.6)
FORBIDDEN phrase (never write for Captain Ivor Hale): "palpable tension filled the room"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "His resentment towards the Hawthorne family simmers beneath the surface, longing for recognition and revenge." — do not surface in Act I.

### Beatrice Quill
Voice & mannerisms: Beatrice speaks with an effervescent charm, her words often laced with a sharp wit that cuts through the surface of social niceties, revealing her keen intellect.
Sample voice fragments (match this register and rhythm):
  [comfortable] "Isn't it delightful to be surrounded by such charming company?"
  [evasive] "Oh, I was at the charity event; nothing to worry about!"
Humour: polite savagery — deploy frequently (level 0.7)
FORBIDDEN phrase (never write for Beatrice Quill): "she felt a wave of unease"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Her need to secure her inheritance becomes a driving force, compelling her to remove any obstacles in her path." — do not surface in Act I.



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

Primary Location: Middleton Hall (Little Middleton, England)
Middleton Hall, a grand estate in the heart of Yorkshire, is steeped in secrets and whispers, where class tensions simmer beneath the surface.

Key Locations Available:
- The East Wing Library (interior): Crime scene
- The Drawing Room (interior): Gathering space
- The Servants' Hall (interior): Gathering space for staff

Atmosphere: Tense and foreboding, reflecting the underlying class tensions and the weight of secrets within the household.
Weather: A cool, overcast day with intermittent rain, typical for the English countryside.

Era markers: Petrol-driven automobiles navigating the winding country lanes. | Early household telephones with party lines connecting the estate to the outside world. | Typewriters clacking in the study, echoing the urgency of communication.

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
The East Wing Library (interior):
  - Visual: Rows of dusty books, their spines cracked and faded, speak of forgotten knowledge and long-lost stories., The rich, dark wood of the furniture contrasts sharply with the muted colors of the wallpaper, creating a somber yet dignified atmosphere.
  - Sounds: The soft rustle of paper as the wind sneaks through the slightly ajar window, creating an unsettling symphony., Occasional creaks from the old floorboards add to the tension, as if the very room is holding its breath.
  - Scents: A musty scent lingers in the air, a combination of aged paper, polished wood, and the faintest hint of mildew., The aroma of tobacco smoke clings to the upholstery, a reminder of late-night discussions that may have turned sinister.
  - Touch: The smoothness of the desk contrasts with the roughness of the book spines, each telling a story of its own., A chill in the air raises goosebumps on the skin, a stark reminder of the secrets that lie within these walls.

The Drawing Room (interior):
  - Visual: Gilded frames house portraits of somber ancestors, their eyes seemingly following every movement within the room., A large, intricately woven rug sprawls across the floor, its vibrant colors muted by the dim light.
  - Sounds: The crackling of the fire provides a comforting sound, yet it feels out of place against the underlying tension in the room., Occasional footsteps from the hallway break the silence, a reminder of the lives intertwined within these walls.
  - Scents: The air is heavy with the scent of damp wood and aged fabric, mingling with the faint sweetness of dried flowers in a vase., A lingering trace of perfume hangs in the air, reminiscent of past gatherings filled with laughter and intrigue.
  - Touch: The plush velvet of the chairs invites one to sink in, yet the chill in the room keeps one on edge, as if something is about to unfold., The warmth from the fireplace contrasts sharply with the coolness of the marble mantelpiece, creating a tactile reminder of the room's dual nature.

The Servants' Hall (interior):
  - Visual: T
[truncated for prompt budget]

## Texture Pool
Draw on these as opportunities arise — you are not required to use them.

- Living in January 1936, the English countryside feels heavy under a blanket of damp, cold air, with the gloom of winter accentuating the struggles of the ongoing Great Depression
- Class divisions are stark, as the upper classes maintain their lifestyles while the working class faces severe hardships
- The tension in society is palpable, with whispers of fascism and the specter of war looming on the horizon
- Traditional gender roles are still deeply entrenched, yet the winds of change are beginning to stir as women increasingly advocate for their independence
- The daily lives of the characters are marked by strict social rituals and the weight of expectations, creating an atmosphere thick with unfulfilled aspirations and hidden resentments.

TEMPORAL CONTEXT:

This story takes place in January 1936 during winter.

Seasonal Atmosphere:
- Weather patterns: cool and overcast, intermittent rain, occasional frost
- Daylight: Short winter days with twilight settling before five o'clock, making evenings feel particularly long and somber.
- Seasonal activities: hunting parties in the countryside, indoor games such as bridge or charades, visiting neighboring estates for tea
- Seasonal occasions: New Year's Day, Epiphany (Twelfth Night)
- Season: winter

Period Fashion (describe naturally):
- Men formal: tailored dark wool suit, crisp white dress shirt, silk tie in muted colors
- Men casual: tweed jacket, corduroy trousers, knitted sweater
- Men accessories: pocket watch, fedora hat, leather gloves
- Women formal: elegant tea-length dress with a fitted waist, faux fur stole, wide-brimmed hat adorned with feathers
- Women casual: knitted cardigan, pleated skirt, blouse with a Peter Pan collar
- Women accessories: clutch purse, string of pearls, silk scarf

Cultural Context (reference naturally):
- Music/entertainment: 'The Way You Look Tonight' by Fred Astaire, 'You Are My Sunshine' by Jimmie Davis, Swing music beginning to gain popularity; Films: 'Modern Times' by Charlie Chaplin, 'The Great Ziegfeld'; Theatre: 'The Royal Family' by George S. Kaufman, 'Lillian Hellman's The Children's Hour'; Radio: BBC news broadcasts, comedy programs such as 'The Goon Show' starting to develop
- Typical prices: Loaf of bread: four pence, A pint of milk: two pence, A newspaper: one penny
- Current events: Hitler reoccupies the Rhineland, escalating tensions in Europe; British government debates the implications of the abdication crisis
- Literature: 'Gone with the Wind' by Margaret Mitchell | 'The Glass Key' by Dashiell Hammett | 'The Maltese Falcon' by Dashiell Hammett | [mystery] | [social realism] | [historical fiction]
- Technology: the electric washing machine gaining traction | advancements in radio technology | improvements in automotive engineering leading to safer cars | telephones with party lines | typewriters prevalent in offices | early models of electric refrigerators
- Daily life: attending local church services, engaging in afternoon teas, playing board games or card games in the evenings
- Social rituals: formal dinner parties with strict seating arrangements, afternoon tea served with scones and pastries, visits to neighbors for exchanging news and gossip

Atmospheric Details:
The damp chill lingers in the air, with the scent of wet earth and smoke from the estate's fireplaces filling the rooms. The sound of rain tapping against the windows creates a rhythmic backdrop, enhancing the tension within the household. Dimly lit hallways whisper secrets of the past, while the flicker of candlelight casts long shadows, heightening the sense of foreboding.

FASHION INTEGRATION TECHNIQUES:
- First appearance: Describe outfit to establish class/personality
- Accessories: Gloves, hats, pocket watches, jewelry reveal status
- Time-specific: Different outfits for different times of day
- Character traits: Fastidious dresser vs rumpled appearance
- Action integration: "She tugged at her glove" or "He adjusted his tie"
- Weather appropriate: Overcoats in winter, light linen in summer

CULTURAL TOUCHSTONE INTEGRATION:
- Casual conversation: "Did you hear that new jazz record?
[truncated for prompt budget]

NON-NEGOTIABLE CHAPTER OBLIGATIONS — LOCKED EVIDENCE PHRASES (VERBATIM REQUIRED):
The following physical evidence values are absolute ground truth. Every time this chapter describes, mentions, or alludes to the relevant evidence — no matter how briefly — it MUST use the exact phrase shown below, character for character. NO paraphrase, approximation, rounding, or synonym is permitted.

FAILURE EXAMPLE: if the locked value is "at thirteen minutes to midnight" and you write "just before midnight" or "around midnight" — that is a HARD FAIL. You must write "at thirteen minutes to midnight". Equally, if the locked value is written in words, such as "ten minutes past eleven", and you convert it to figure-based clock notation — that is also a HARD FAIL. Words stay as words; figure forms are forbidden for word-phrased facts.

CRITICAL — WORD-PHRASED VALUES: If the canonical value is written out in words (e.g. a time like "ten minutes past eleven", or an amount like "forty minutes"), reproduce those exact words. DO NOT convert to figure-based time notation, twenty-four-hour format, or any other numeric shorthand. Correct: "ten minutes past eleven". WRONG: figure-based clock notation or numeric shorthand.

Locked facts:
  - The exact time shown on the stopped clock face: "ten minutes past eleven"
  - The exact amount the clock was wound back: "forty minutes"

If a locked fact has no relevance to this chapter, omit it. But the moment you reference the underlying evidence, only the exact phrase above is acceptable.

⛔ CLUES TO SURFACE IN THESE CHAPTERS — mandatory:
The following evidence MUST be clearly observable to an attentive reader. Do not bury it in atmosphere or passing dialogue. Each clue must be concrete, specific, and noticeable:

• [clue_core_contradiction_chain] The clock's time does not match the witness accounts of Eleanor being alive at ten fifty in the morning.
  Category: temporal | Criticality: essential | Supports inference step 1
  Points to: Contradicts the timeline of events.

• [clue_mechanism_visibility_core] The clock in the study shows ten minutes past eleven.
  Category: temporal | Criticality: essential | Supports inference step 1
  Points to: Indicates the time discrepancy related to the murder.

For each clue above: an attentive reader should be able to find, record, and later use it to reason toward the solution.

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

CONTINUITY HANDOFF — previous chapter closing beat:
  • "As they began to sift through the room, the tension was palpable. Every creak of the floorboards echoed like a whisper of secrets long buried. Beatrice's fingers brushed against the smooth surface of the desk, her heart pounding as she searched for clues. The..."
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
study, estate

✓ RULE: Continue using this location vocabulary. Maintain consistency with established setting type.
✓ Do NOT introduce new location types that contradict earlier chapters.

**Recent Chapter Summary (for narrative continuity):**
Chapter 1: Chapter 1: Discovery
  Events: The morning light struggled to penetrate the heavy clouds that loomed over the Hawthorne estate, casting a pall of gloom upon the study.

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
Known location profile anchors: Middleton Hall, The East Wing Library, The Drawing Room, The Servants' Hall, the study of the Hawthorne estate
LOCATION NAME CAPITALISATION (HARD REQUIREMENT — validated):
All named locations in your prose MUST use the EXACT capitalisation from the CML profiles.
Canonical forms: "Middleton Hall", "The East Wing Library", "The Drawing Room", "The Servants' Hall", "the study of the Hawthorne estate"
Writing a location in lowercase (e.g. "drawing room" instead of "Drawing Room") is a validated error. Every time you mention a named location, copy its capitalisation from the list above.
- Chapter 2: OPENING STYLE (HARD): Start the VERY FIRST SENTENCE with spoken dialogue — e.g. '"[words]," [Name] said/asked/replied/murmured.' The opening quote must be the first character on the line. Anchor opening in "the study of the Hawthorne estate". HARD REQUIREMENT for the first 2 paragraphs: (a) include 2+ sensory words — choose from smell/scent/sound/echo/silence/creak/whisper/cold/warm/damp/rough/smooth/glow/shadow/flicker/dim — and (b) include 1+ atmosphere/time word — choose from rain/wind/fog/storm/mist/thunder/evening/morning/night/dawn/dusk/season/afternoon/midday/noon/midnight/twilight/sunrise/sunset/daylight/sunlight/overcast/cloudy/bright/dark. These are validated requirements, not style suggestions; missing them triggers a retry.

[⚠ INTERNAL QUALITY DIAGNOSTICS — DO NOT REPRODUCE ANY PART OF THIS SECTION IN YOUR STORY OUTPUT. These are private generator observations for your consideration only. Your narrative must read as if this section does not exist. Never include phrases from this block in character dialogue, narration, or description.]

PRIOR CHAPTER QUALITY OBSERVATIONS:
- Chapter 1 (score 87/100):
  Quality gaps noted: word density below preferred target (663/1000)
  Address in upcoming chapters: Increase chapter density with concrete investigation action and sensory-grounded beats; avoid recap-only padding.
[END INTERNAL DIAGNOSTICS]

PROMPT BUDGET SUMMARY: budget=32000 tokens; fixed=6639; context=10535; dropped=[none]; truncated=[location_profiles, temporal_context]

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
8. Integrate at least two concrete era-grounded details per chapter from setting refinement signals: petrol-driven automobiles on winding country roads | early household telephones with party lines | typewriters in offices and studies | telephone communication through local exchanges | telegrams for urgent messages | airmail services for faster correspondence.
9. Respect setting movement/access constraints in scene action and alibis: designated access points limiting movement between areas | hidden rooms and passages complicating search patterns | weather conditions affecting outdoor evidence collection | restricted areas such as the library and private study | permissions required for accessing certain rooms.
10. Sustain social coherence with this backdrop pressure: A gathering at the estate for a wealthy benefactor's will reading forces heirs, staff, and guests to confront their secrets amidst the rising tensions of the Great Depression and fascism's shadow.
11. Maintain continuity around these socially central cast anchors where relevant: Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill.
12. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Critical: Plot similarity 0.75 with 'The Mysterious Affair at Styles' (same temporal aspect and murder method)
13. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Moderate: Character similarity 0.70 with 'The Sign of the Four' (similar roles and dynamics)
14. STORY TO DATE ANTI-COPY RULE: The STORY TO DATE section below is provided for chronological and factual reference ONLY. You MUST NOT copy, lightly rephrase, or structurally echo any sentence or paragraph from prior chapters. Every sentence in this chapter must be original prose unique to this scene. Reusing even a clause from prior chapter text will cause this attempt to fail immediately.

CRITICAL PROSE REQUIREMENTS:

The CML specifies exact requirements for certain validation-critical scenes. You MUST include these elements at the specified positions.

**Discriminating Test Scene (Act 3, Scene 4):**
Required elements: Execute the controlled comparison of the clock's time against Eleanor's watch., Observe the discrepancy in times.
Test type: comparison

**Suspect Clearance Scenes:**
- Captain Ivor Hale (Act 3, Scene 5): Proving his alibi is consistent with Eleanor's timeline.
  Clues: clock details, witness statements
- Beatrice Quill (Act 3, Scene 5): Demonstrating her role as the investigator without motive.
  Clues: investigative role
- Eleanor Voss (Act 3, Scene 5): Alibi confirmed: none

**Culprit Revelation Scene (Act 3, Scene 6):**
Method: Confrontation with evidence of clock tampering.

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
  - Word count: Target 1250 words. Achieve this through plot events, dialogue exchanges, and physical investigation — not through atmospheric repetition or extended internal reflection. Each 200-word segment should contain at minimum one concrete story event (a discovery, a conversation exchange, a physical action or movement). Padding with atmosphere alone is not acceptable.
  - Location anchor: the study of the Hawthorne estate.
  - Opening atmosphere (MANDATORY — validator enforced): the first paragraph MUST contain at least one of: rain / wind / fog / storm / mist / thunder / evening / morning / night / dawn / dusk / season / afternoon / midday / noon / midnight / twilight / sunrise / sunset / daylight / sunlight / overcast / cloudy / bright / dark. A chapter that omits all of these from its opening paragraph will be rejected.
  - Continuity bridge: in the first 120 words, visibly connect from the previous chapter's final beat. Carry forward one unresolved element (object, accusation, emotional pressure, or immediate physical action) from: "As they began to sift through the room, the tension was palpable. Every creak of the floorboards echoed like a whisper of secrets long buried. Beatrice's fingers brushed against the smooth surface of the desk, her heart...".
  - CLUE OBLIGATIONS — mandatory prose elements (do NOT omit or bury):
    • The clock's time does not match the witness accounts of Eleanor being alive at ten fifty in the morning. [clue_core_contradiction_chain] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: Contradicts the timeline of events.
      ↳ MANDATORY TWO-PARAGRAPH STRUCTURE (must appear in paragraphs 1 or 2 — no later):
         Paragraph 1: The POV character physically approaches or directly observes this evidence.
           The narration or dialogue explicitly states what is seen (use the exact locked phrase if one applies).
         Paragraph 2 (immediately following): The detective or POV character explicitly reasons
           about what this evidence implies — who it implicates, why it may be unreliable,
           or what inference it supports. This must be a separate full paragraph, not a sentence appended to Paragraph 1.
    • The clock in the study shows ten minutes past eleven. [clue_mechanism_visibility_core] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: Indicates the time discrepancy related to the murder.
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
- Seasonal vocabulary allow-list: winter, wintry, midwinter.
- Forbidden seasonal words: spring, summer, autumn.

FROZEN TIMELINE STATE (DO NOT ALTER):
- Timeline anchor: January (winter).
- Month, season, weather, and time-of-year language in this batch must stay compatible with winter.
- Established timeline fact: Eleanor's last known movement was recorded at 10:45 AM.
- Established timeline fact: The clock shows ten minutes past eleven.
- If referenced, use exact time phrase: "ten minutes past eleven" (The exact time shown on the stopped clock face).
- If referenced, use exact time phrase: "forty minutes" (The exact amount the clock was wound back).

STORY TO DATE (REFERENCE ONLY — DO NOT COPY VERBATIM):
- Full prior chapter text is provided below for continuity, factual consistency, and reference accuracy.
- Use this to keep character voice, chronology, clue state, and location continuity aligned with earlier chapters.
- Do not quote, copy, or paraphrase these paragraphs too closely; write fresh prose that remains consistent with them.

--- BEGIN PRIOR CHAPTER 1 ---
Title: Chapter 1: Discovery
The morning light struggled to penetrate the heavy clouds that loomed over the Hawthorne estate, casting a pall of gloom upon the study. The air was damp, the scent of rain mingling with the musty aroma of aged leather and paper. Beatrice Quill stepped into the room, her heart racing as she took in the scene before her. There, on the floor, lay Eleanor Voss, her lifeless form surrounded by the rich, dark wood of the study's furniture. The clock on the wall, its face cracked and dusty, showed ten minutes past eleven, a stark reminder of the time when everything changed.

Beatrice's gaze fixed on the clock, a chill running down her spine. It felt as though the hands had conspired against them, marking the moment of tragedy with an unforgiving precision. The clock in the study shows ten minutes past eleven. The implication was clear: Eleanor had died no later than this time. Beatrice's mind raced as she recalled the earlier conversations, the witnesses who had claimed to see Eleanor alive at ten fifty. How could this be? The clock's time did not match the witness accounts of Eleanor being alive at ten fifty in the morning. This contradiction raised a dreadful question: who had the motive to silence her, and how could they manipulate time itself?

As she knelt beside Eleanor's body, Beatrice felt a wave of grief wash over her, mingled with a sense of urgency. She had to alert the others, to piece together the fragments of this mystery before it slipped away like the morning fog. Dr. Finch entered the room, his expression a mixture of shock and disbelief. Her eyes darted from Beatrice to Eleanor, and then to the clock, as if searching for answers in the ticking mechanism. 'What happened here?' she asked, her voice trembling slightly. Beatrice could only shake her head, her throat tight with emotion.

Captain Hale arrived moments later, his presence commanding as he took in the scene with a grim expression. 'This is a tragedy, indeed,' he said, his voice steady despite the chaos swirling around them. 'Eleanor had enemies, you know. People who might have wanted her dead.' Her words hung in the air, heavy with implication. Beatrice could feel the weight of suspicion settling over the room, an invisible shroud that threatened to suffocate them all. Who among them could harbor such malice?

Eleanor's pale face seemed to reflect the shock that rippled through the room. Beatrice's mind raced with memories of their shared laughter, the late-night conversations filled with dreams of a brighter future. Now, that future lay shattered, and the reality of their circumstances pressed down on her like a heavy stone. He glanced at Dr. Finch, who appeared lost in thought, his brow furrowed as he contemplated the implications of the clock's betrayal. 'We must act quickly,' he said, breaking the silence. 'The longer we wait, the more likely it is that the truth will slip through our fingers.'

Beatrice nodded, her resolve hardening. They needed to gather the others, to confront the shadows that danced around them. But as she looked at Eleanor, a sense of dread settled in her stomach. What if the truth was darker than they could imagine? What if one of them was capable of murder? The thought sent a shiver down her spine, and she steeled herself for the confrontation ahead. 'We need to search the room,' she said, her voice steady despite the turmoil within. 'There must be something here that can help us understand what happened.'

As they began to sift through the room, the tension was palpable. Every creak of the floorboards echoed like a whisper of secrets long buried. Beatrice's fingers brushed against the smooth surface of the desk, her heart pounding as she searched for clues. The clock's betrayal loomed large in her mind, a reminder that time was not on their side. They had to unravel this mystery before it consumed them all.
--- END PRIOR CHAPTER 1 ---

[SCENE COMPLETENESS CONTRACTS — MANDATORY. Each contract below lists what you MUST enact in that chapter. Do not summarise or mention these labels in the prose — enact them organically.]
Chapter 2 (Act 1) completeness contract:
  PIVOT ELEMENT (MANDATORY — write this into the prose, shown not told): "The conflicting time on the clock and witness accounts"
  FACT ESTABLISHED (MANDATORY — reader must know this by chapter end): "Establishes that the clock's time contradicts the witnesses' accounts of seeing Eleanor alive."
  RED HERRING (MANDATORY — seed naturally, not flagged as false): [rh_2] Rumors circulate about Eleanor's potential scandal, distracting from the clock's discrepancies.

# Case Overview
Title: The Clock's Deceit
Era: 1930s
Setting: Little Middleton, Yorkshire
Crime: murder (clock tampering)
Culprit: Dr. Mallory Finch
False assumption: Eleanor Voss died shortly after the clock indicated a specific time.
Cast: Eleanor Voss (she/her), Dr. Mallory Finch (he/him), Captain Ivor Hale (he/him), Beatrice Quill (she/her)

Setting Lock: Keep all scenes and descriptions consistent with the stated setting (Little Middleton, Yorkshire). Do not introduce a different location type.

Outline scenes:
[
  {
    "sceneNumber": 2,
    "act": 1,
    "title": "Contradiction",
    "setting": {
      "location": "the study of the Hawthorne estate",
      "timeOfDay": "Shortly after the discovery",
      "atmosphere": "Suspicion hangs in the air as the detective begins her inquiry."
    },
    "characters": [
      "Beatrice Quill",
      "Eleanor Voss",
      "Dr. Mallory Finch",
      "Captain Ivor Hale"
    ],
    "purpose": "Establish the contradiction in time and introduce the first clues.",
    "cluesRevealed": [
      "clue_core_contradiction_chain",
      "clue_mechanism_visibility_core"
    ],
    "dramaticElements": {
      "conflict": "Suspects begin to question each other's alibis",
      "tension": "Eleanor's watch and the clock are at odds with each other.",
      "microMomentBeats": [
        "Beatrice notices the tension between Captain Hale and Dr. Finch."
      ]
    },
    "summary": "Beatrice Quill interviews the suspects about Eleanor's last moments. The clock shows ten minutes past eleven, but they all recall seeing her alive at ten fifty. The conflicting accounts create tension among the group as suspicions rise.",
    "estimatedWordCount": 1800,
    "pivotElement": "The conflicting time on the clock and witness accounts",
    "factEstablished": "Establishes that the clock's time contradicts the witnesses' accounts of seeing Eleanor alive.",
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
        "behaviour": "normal social behaviour; no guilt signals"
      }
    ],
    "redHerringPlacement": {
      "redHerringId": "rh_2",
      "placementDetail": "Rumors circulate about Eleanor's potential scandal, distracting from the clock's discrepancies."
    },
    "emotionalRegister": "Unease grows as the investigation reveals conflicting timelines and hidden motivations.",
    "dominantCharacterNote": {
      "name": "Eleanor Voss",
      "voiceRegister": "Eleanor speaks with a calm, measured tone, often punctuating her sentences with wry observations about the family's foibles."
    },
    "humourGuidance": {
      "permission": "permitted",
      "character": "Eleanor Voss"
    },
    "eraTextureNote": "Limited mobility due to harsh winter weather conditions.; Communication difficulties exacerbated by poor telephone infrastructure.; Social gatherings are tightly controlled due to class hierarchies.",
    "locationRegisterNote": ""
  }
]
```

## Message 3 (role=user)

```text
BEFORE SUBMITTING YOUR JSON — verify this checklist:
□ Each chapter reaches the hard floor of 500 words and aims for 1250 words or more.
□ If you mention locked evidence, you used the exact locked phrase verbatim.
□ Allowed seasonal words only: winter, wintry, midwinter.
□ Forbidden seasonal words: spring, summer, autumn.
□ Chapter 2: "The clock's time does not match the witness accounts of Eleanor being alive at ten fifty in the morning." is placed in the first 25% of the chapter, followed by an explicit inference or suspicion paragraph.
□ Chapter 2: "The clock in the study shows ten minutes past eleven." is placed in the first 25% of the chapter, followed by an explicit inference or suspicion paragraph.
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
