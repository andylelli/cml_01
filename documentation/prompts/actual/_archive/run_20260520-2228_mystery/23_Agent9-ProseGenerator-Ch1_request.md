# Actual Prompt Record

- Run ID: `mystery-1779316086644`
- Project ID: ``
- Timestamp: `2026-05-20T22:33:32.308Z`
- Agent: `Agent9-ProseGenerator-Ch1`
- Operation: `chat_request_full_prompt`
- Model: `GPT-4o-mini`
- Temperature: `0.42`
- Max Tokens: `4500`
- Attempt: `first`
- Prompt Hash: `688f191a2b29fc57`

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
- MORAL COMPLEXITY REQUIREMENT: The mechanism of this crime carries a moral gray area: "The culprit may have acted out of desperation to protect someone they love, complicating the moral judgment of their actions." — the culprit reveal and denouement MUST acknowledge this ambiguity. Do not let the ending feel clean or simple. Give the reader at least one moment of uncomfortable sympathy or moral doubt.


⚠️ AMATEUR DETECTIVE STORY: The investigator is a civilian with no official standing. The official police (if they appear) are unnamed background figures only — "a constable", "the sergeant", "an officer from the village". Do NOT give any police official a name or title+surname combination. There is no Inspector [Surname], no Constable [Surname], no Sergeant [Surname] in this story.


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

## Era: 1934-01
Living in January 1934 means navigating a society gripped by the shadows of the Great Depression. The overcast skies reflect the economic despair, with families struggling to maintain their social standings amidst rising political tensions in Europe. Daily life involves attending social gatherings where appearances are meticulously maintained, yet whispers of class struggles and personal hardships linger just below the surface. The looming threat of fascism adds an undercurrent of anxiety, making trust hard to come by and breeding suspicion among even the closest of friends. In this tense atmosphere, every interaction is laden with the weight of hidden agendas and unspoken fears.
Emotional register: A collective anxiety looms heavily over society, as individuals grapple with uncertainty and mistrust.
Physical constraints: Short daylight hours limit outdoor activities | Limited access to communication technologies | Transportation reliant on petrol amid economic constraints
Current tensions (weave into background texture): Political instability in Europe as fascism rises | The Great Depression causing widespread unemployment | Class tensions exacerbated by economic disparity
Wartime context — The memory of recent conflicts lingers, impacting societal perspectives.: Communities are marked by class distinctions, creating a divide between the privileged and the struggling. Absence effect: Those who served in the war are often seen as heroes, yet their sacrifices are overshadowed by the pressing concerns of survival.

## Story Theme
In a world fraught with class tension and personal ambition, the unraveling of a murder mystery reveals the costs of deceit and the fragility of human connections.

## Story Emotional Register
Dominant: The overall emotional character of the story is one of tension and unease, punctuated by moments of revelation and despair.

Arc:
The story opens within the imposing walls of Little Middleton Manor, where the atmosphere feels thick with secrets and the weight of impending tragedy. Guests gather for a will reading, but the air is heavy with unspoken fears. As the clock strikes the hour, the shocking discovery of Beatrice Quill's lifeless body sends ripples of horror through the assembly, plunging everyone into a maelstrom of suspicion and dread. As Dr. Mallory Finch begins her investigation, the tension escalates with each clue uncovered. The initial clues reveal a web of deceit, and the emotional cost weighs heavily on the characters as false leads emerge, creating a landscape of anxiety.

The first investigative turn pushes the narrative forward, as Mallory realizes the clock's tampering holds the key to the truth. With each revelation, hidden motives come to light, forcing the characters to confront their deepest fears. The second pivot occurs when Mallory connects the evidence to Captain Hale, reframing the entire investigation as she grapples with the implications of her findings. The pre-climax builds as the characters' emotional states fray, the mounting pressure leading to a tense confrontation where loyalties are tested. The climax reveals the truth behind Beatrice's murder, but it comes at a cost that leaves the characters shattered. In the resolution, the emotional fallout is palpable; Eleanor, Mallory, and Ivor must navigate the consequences of their actions, and the haunting memories of the weekend linger long after the guests depart, illustrating the heavy toll that secrets exact.

## Emotional register at this point in the story
The atmosphere is thick with anticipation and hidden agendas.

## Character Portraits (appearance & era)

### Eleanor Voss
Eleanor Voss, a charming socialite, embodies the conflicted nature of the 1930s. As she navigates the elite circles of Little Middleton, her desperate pursuit of love and social standing reflects the societal pressures faced by women of her class. Her relationship with Captain Hale and the tension of hidden debt define her struggle in a time when financial security is paramount.
Era intersection: Eleanor's private insecurities clash with the expectations of her social environment, illustrating the emotional cost of maintaining appearances.

### Dr. Mallory Finch
Dr. Mallory Finch represents the emerging modern woman of the 1930s, striving for recognition in a male-dominated profession. Her dedication to her patients and her frustrations with the upper class's indifference highlight the challenges faced by women seeking independence during this era. Mallory's deep sense of responsibility drives her actions even as society pushes back against her ideals.
Era intersection: Mallory's struggle to assert her professional identity amidst societal constraints underscores the shifting dynamics of gender roles in the 1930s.

### Captain Ivor Hale
Captain Ivor Hale is a man caught between duty and desire, epitomizing the internal conflicts of the 1930s gentleman. His military background and societal expectations weigh heavily on him as he deals with personal relationships marred by obligation and desire. Ivor's struggle reflects the emotional turmoil many men faced during this tumultuous period.
Era intersection: Ivor's emotional conflicts highlight the pressures of masculinity and the expectations placed upon men in a society grappling with economic downturn and social change.

### Beatrice Quill
Beatrice Quill is a symbol of youthful innocence and artistic aspiration, navigating a world filled with hidden dangers. Her dreams and naivety place her at the mercy of societal forces that threaten to unravel her life. Beatrice's tragic fate serves as a reflection of the fragility of hope in a harsh economic landscape.
Era intersection: Beatrice's struggles represent the impact of social expectations on women, revealing the vulnerabilities that accompany ambition in the 1930s.

## Character Voices

### Eleanor Voss (she/her/her)
Eleanor speaks with a melodic cadence, often punctuating her sentences with a delicate laugh, softening her sharp wit.
[comfortable] Oh, darling, isn't it just delightful to have everyone gathered here? It feels like a scene from a novel!
[evasive] Well, you know how things can be... It's all a bit complicated, isn't it?
[stressed] I simply cannot bear the thought of losing everything I've worked for. It's too much to handle!
Humour: Her humour often manifests as polite savagery, adding an edge to her conversations.

### Dr. Mallory Finch (she/her/her)
Mallory's voice carries a precise, measured tone, laced with a hint of sarcasm that reveals her frustrations.
[comfortable] Honestly, if I have to explain the same thing one more time, I might just lose my mind!
[evasive] Let's just say I've seen a lot worse, and it's not something I wish to discuss.
[stressed] I warned her, but what good are warnings if they're ignored? The guilt is unbearable!
Humour: Her dry wit often emerges in moments of tension, providing a contrast to her serious demeanor.

### Captain Ivor Hale (he/him/his)
Ivor's speech is commanding and direct, reflecting his military background with an air of authority.
[comfortable] It's good to see you all again. I trust the journey was uneventful?
[evasive] I prefer not to delve into the past; it's better left unexamined.
[stressed] This situation is spiraling out of control, and I can't afford to be implicated!
Humour: His blunt humour reveals his frustration with societal expectations.

### Beatrice Quill (she/her/her)
Beatrice's voice is filled with earnestness and youthful exuberance, often punctuated by nervous laughter.
[comfortable] Oh, I just adore this painting! It captures everything I feel!
[evasive] Well, I suppose everyone has their secrets, don't they?
[stressed] What if the truth comes out? It would ruin everything I've dreamed of!
Humour: Her self-deprecating humour provides a window into her vulnerability.

## Location Registers (scene framing guides)

The Library: The library feels suffocating with secrets, its heavy shelves burdening the air with unspoken thoughts. The flicker of candlelight casts eerie shadows, heightening the tension as guests navigate the space with trepidation.. Camera angle: Entering this space, the writer should feel the weight of history and anticipation, as each shadow seems to harbor a secret waiting to be revealed.. Era: The dimly lit room reflects the era's preference for intimacy amidst rising tension.

The Drawing Room: In the drawing room, laughter mingles with unease, creating a facade of camaraderie that belies the hidden animosities. The warm glow of candlelight offers a false sense of security, while the tension simmers just beneath the surface.. Camera angle: As the writer enters, they should capture the contrast between the lively atmosphere and the underlying suspicion that threads through every conversation.. Era: This room serves as a stage for societal performance, showcasing the elegance of the 1930s while concealing deeper conflicts.

The Gardens: The gardens are a paradox of beauty and foreboding, where vibrant blooms mask the tension in the air. Each rustle of leaves feels amplified, heightening the sense of isolation amidst the looming shadows.. Camera angle: The writer should evoke a sense of exploration, as if every corner of the garden holds a potential revelation waiting to be uncovered.. Era: The gardens reflect the era's obsession with nature, yet they also serve as a backdrop for secrets and hidden truths.

The Study: The study exudes an air of introspection, filled with the scent of aged books and the ticking of a clock that seems to mock the stillness. It is a sanctuary for contemplation, yet the weight of unresolved mysteries hangs heavy.. Camera angle: The writer should aim to convey a sense of urgency, as if each item in the study holds the key to understanding the tumultuous events unfolding.. Era: The study's clutter mirrors the chaos of the 1930s, where personal ambition clashes with societal expectations.

## Humour guidance for this story position (opening)
Permission: forbidden
Rationale: The gravity of the initial crime necessitates a serious tone.

FAIR-PLAY AND INFERENCE CONTRACT:
- FAIR PLAY CLUE TIMING: Never combine clue discovery and detective deduction in the same chapter. If a clue is first revealed to the reader in chapter N, the detective may only analyze, deduce from, or act on that clue in chapter N+1 or later.
- FAIR PLAY INFORMATION PARITY: The reader must see all clues BEFORE the detective uses them in reasoning. If the detective performs a test or makes a deduction, every piece of evidence supporting that conclusion must have been shown to the reader in earlier chapters.
- FAIR PLAY REVELATION SPACING: In the discriminating test scene, the detective can ONLY use clues that were revealed to the reader at least 1 full chapter earlier. Never introduce new clues or withheld information during the test.
- FAIR PLAY CONFRONTATION: During the final confrontation/revelation, the detective cannot surprise the reader with facts. Every piece of evidence cited must have been visible to the reader in prior chapters.
- Never solve by withheld information. Keep reader-information parity with detective reasoning.
- False assumption in force: The time of death must be consistent with the victim's last known activities.
- Hidden truth to progressively expose: The tampering of the clock creates a deceptive timeline.
- Inference path checkpoints to dramatize clearly (observation -> correction -> effect):
  - Step 1: obs: The clock in the study shows ten minutes past eleven. | corr: This is inconsistent with the time witnesses claim to have seen Beatrice alive. | effect: Narrows the time of death window.
  - Step 2: obs: An unusual scratch on the clock's winding key indicates tampering. | corr: The scratch suggests that the clock has been manipulated recently. | effect: Eliminates Eleanor Voss as a suspect due to her alibi.
  - Step 3: obs: The temperature of the clock's casing is significantly warmer than the surrounding air. | corr: This indicates that the clock was recently adjusted. | effect: Narrows culprit access to Captain Ivor Hale as the last known person near the clock.
- Discriminating test method: trap
- Discriminating test design constraint: The discriminating test compares clock, tamper, and study against the claimed timeline.
- Test must rely on already-shown clue IDs: clue_1, clue_2, clue_3, clue_9, clue_fp_contradiction_step_2, clue_mechanism_visibility_core
- Fair-play rationale: Step 1: The clock's time inconsistency (early) and witness statements (mid) let the reader see the first clue of deception. Step 2: The scratch on the clock key and Eleanor's garden alibi eliminate her. Step 3: The temperature of the clock and Captain Hale's proximity narrow the suspect pool to him.

## Character Reference

### Eleanor Voss (she/her — NEVER he/him)
Eleanor speaks with a melodic cadence, often punctuating her sentences with a delicate laugh
She possesses an eloquent vocabulary, yet her wit can slice through the air with unexpected sharpness when provoked.
Eleanor grapples with her own motivations, questioning whether her pursuit of Hale's affections is rooted in genuine love or a mere desire for social dominance. The fear of losing everything she desires looms over her, creating a storm of doubt in her heart.

### Dr. Mallory Finch (she/her — NEVER he/him)
Mallory speaks with a precise, measured tone, often employing medical jargon that she softens with a hint of sarcasm when the situation allows
Her dialogue reflects her inner turmoil, with an occasional quip that reveals her frustration with societal norms.
Mallory is torn between her dedication to her patients and the realization that her ideals may be futile in a world where the elite dictate the rules. This internal struggle fuels her resentment and complicates her sense of purpose.

### Captain Ivor Hale (he/him — NEVER she/her)
Ivor speaks with a commanding presence, his words often clipped and direct
He has a tendency to avoid flowery language, opting instead for a straightforward approach that reflects his military background.
Ivor is caught in a web of conflicting loyalties, grappling with his genuine affection for Eleanor while feeling the weight of familial expectations regarding Beatrice. This turmoil forces him to confront the consequences of his desires and the potential fallout from his actions.

### Beatrice Quill (she/her — NEVER he/him)
Beatrice speaks with an earnestness that reflects her youthful exuberance, often punctuating her thoughts with nervous laughter
She possesses a whimsical way of expressing herself, frequently referencing her artistic inspirations.
Beatrice is blissfully unaware of the complexities surrounding her engagement, yet a growing sense of unease begins to surface as she navigates the realities of love and betrayal. The potential for heartbreak looms over her, forcing her to confront the fragility of her dreams.


## CHARACTER CONTRACTS (binding for this scene)
Each entry below constrains how this character must be written in this chapter.
These override generic style guidance when they conflict.

### Eleanor Voss[SHE]
Voice & mannerisms: Eleanor speaks with a melodic cadence, often punctuating her sentences with a delicate laugh. She possesses an eloquent vocabulary, yet her wit can slice through the air with unexpected sharpness when provoked.
Sample voice fragments (match this register and rhythm):
  [comfortable] "Oh, darling, isn't it just delightful to have everyone gathered here? It feels like a scene from a novel!"
  [evasive] "Well, you know how things can be... It's all a bit complicated, isn't it?"
Humour: polite savagery — deploy occasionally (level 0.5)
FORBIDDEN phrase (never write for Eleanor Voss): "she felt a wave of unease"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Eleanor stands to gain Captain Hale's full attention and position if Beatrice is out of the picture, as Beatrice's engagement to Hale had been publicly announced." — do not surface in Act I.

### Dr. Mallory Finch[SHE]
Voice & mannerisms: Mallory speaks with a precise, measured tone, often employing medical jargon that she softens with a hint of sarcasm when the situation allows. Her dialogue reflects her inner turmoil, with an occasional quip that reveals her frustration with societal norms.
Sample voice fragments (match this register and rhythm):
  [comfortable] "Honestly, if I have to explain the same thing one more time, I might just lose my mind!"
  [evasive] "Let's just say I've seen a lot worse, and it's not something I wish to discuss."
Humour: dry wit — deploy occasionally (level 0.4)
FORBIDDEN phrase (never write for Dr. Mallory Finch): "a surge of determination washed over her"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Mallory has been advocating for Beatrice's health and warned her about Hale's influence, making her an obstacle to Hale's plans." — do not surface in Act I.

### Captain Ivor Hale[HE]
Voice & mannerisms: Ivor speaks with a commanding presence, his words often clipped and direct. He has a tendency to avoid flowery language, opting instead for a straightforward approach that reflects his military background.
Sample voice fragments (match this register and rhythm):
  [comfortable] "It's good to see you all again. I trust the journey was uneventful?"
  [evasive] "I prefer not to delve into the past; it's better left unexamined."
Humour: blunt — deploy rarely (level 0.3)
FORBIDDEN phrase (never write for Captain Ivor Hale): "she chose her words with great care"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Hale wishes to eliminate Beatrice to avoid the burden of an unhappy marriage while protecting his interests and future." — do not surface in Act I.

### Beatrice Quill[SHE]
Voice & mannerisms: Beatrice speaks with an earnestness that reflects her youthful exuberance, often punctuating her thoughts with nervous laughter. She possesses a whimsical way of expressing herself, frequently referencing her artistic inspirations.
Sample voice fragments (match this register and rhythm):
  [comfortable] "Oh, I just adore this painting! It captures everything I feel!"
  [evasive] "Well, I suppose everyone has their secrets, don't they?"
Humour: self deprecating — deploy occasionally (level 0.4)
FORBIDDEN phrase (never write for Beatrice Quill): "she knew with certainty she was right"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "If she discovers Hale's affair, it could ruin her future and tarnish her family's reputation, leading to a desperate need for self-preservation." — do not surface in Act I.



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
An imposing estate shrouded in mystery, where elegance meets isolation amidst growing tensions.

Key Locations Available:
- The Library (interior): Crime scene
- The Drawing Room (interior): Gathering space
- The Gardens (exterior): Clue discovery
- The Study (interior): Clue discovery

Atmosphere (tonal cue only — do NOT reproduce this phrase verbatim in prose; translate into scene-specific, character-observed sensory language): Tense and foreboding, with an undercurrent of suspicion among guests.
Weather: Overcast with intermittent rain, creating a gloomy and tense environment.

Era markers: Petrol touring cars parked in the driveway | Domestic telephone systems with party lines | Typewriters in the study for correspondence

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
  - Visual: Candlelight flickering on dark oak, Rain-streaked window panes, Dust motes dancing in the light
  - Sounds: Crackling fire in the hearth, Pages turning in the silence, Distant thunder rumbling
  - Scents: Beeswax and cold ash, Damp stone and old leather, Hints of mildew from the books
  - Touch: Worn leather armchair, Chill draft from the casement

The Drawing Room (interior):
  - Visual: Richly patterned wallpaper, Glint of silver candlesticks, Soft fabric draped over furniture
  - Sounds: Muffled conversations, Laughter echoing off the walls, The sound of a piano playing softly
  - Scents: Freshly brewed tea, Polished wood and leather, Hints of floral arrangements
  - Touch: Soft velvet cushions, Cool surface of a marble coffee table

The Gardens (exterior):
  - Visual: Vibrant flower beds in muted tones, Tall hedges creating natural pathways, A secluded gazebo shrouded in greenery
  - Sounds: Birds chirping softly, Leaves rustling in the breeze, The distant sound of water from a fountain
  - Scents: Fragrance of blooming flowers, Freshly cut grass, The damp scent of earth after rain
  - Touch: Soft petals brushing against fingers, Cool, damp grass underfoot

⛔ REFERENCE DATA — DO NOT TRANSCRIBE VERBATIM: The above profiles are structural guides only. Generate original prose that evokes these qualities; do not reproduce the exact phrasing or sentence structure of the profile paragraphs.

SCENE OPENING RULE: When opening a scene in a new location, write what the POV character directly observes and physically senses at that moment — not a general description of the room's qualities. The reader must feel present, not briefed. Sensory details must be observed by the character, not stated as fact about the place.

SENSORY WRITING TECHNIQUES:
- Opening paragraphs: Lead with 2-3 sensory details to ground the scene
- Movement between locations: Note sensory changes (quiet study → noisy dining room)
- Emotional scenes: Use sensory details to reinforce mood (cold rain during argument)
- Period authenticity: Use period-specific sensory details from location/temporal prof
[truncated for prompt budget]

## Texture Pool
Draw on these as opportunities arise — you are not required to use them.

- Living in January 1934 means navigating a society gripped by the shadows of the Great Depression
- The overcast skies reflect the economic despair, with families struggling to maintain their social standings amidst rising political tensions in Europe
- Daily life involves attending social gatherings where appearances are meticulously maintained, yet whispers of class struggles and personal hardships linger just below the surface
- The looming threat of fascism adds an undercurrent of anxiety, making trust hard to come by and breeding suspicion among even the closest of friends
- In this tense atmosphere, every interaction is laden with the weight of hidden agendas and unspoken fears.

TEMPORAL CONTEXT:

This story takes place in January 1934 during winter.

Seasonal Atmosphere:
- Weather patterns: overcast with intermittent rain, chilly winds, muddy grounds
- Daylight: Short days with limited sunlight, and overcast skies make the afternoons seem darker earlier.
- Seasonal activities: indoor games like charades and bridge, reading by the fire, taking brisk walks in the estate grounds
- Seasonal occasions: New Year's Day (January 1)
- Season: winter

Period Fashion (describe naturally):
- Men formal: tailored wool morning suit, crisp white dress shirt, silk bow tie
- Men casual: tweed jacket, corduroy trousers, knitted wool jumper
- Men accessories: woolen scarf, felt fedora, gloves
- Women formal: elegant evening gown with a dropped waist, long silk gloves, pearl necklace
- Women casual: woolen skirt and blouse, tweed coat, beret
- Women accessories: clutch handbag, feathered headpiece, faux fur stole

Cultural Context (reference naturally):
- Music/entertainment: Duke Ellington, Bing Crosby, Louis Armstrong; Films: It Happened One Night, The Thin Man; Theatre: The Merry Widow, The Front Page; Radio: The Shadow, Amos 'n' Andy
- Typical prices: Loaf of bread: four pence, Newspaper: one penny, Cinema ticket: sixpence
- Current events: Political instability in Europe as fascism rises; The Great Depression causing widespread unemployment
- Literature: Murder in the Cathedral by T.S. Eliot | The Maltese Falcon by Dashiell Hammett | The Great Gatsby by F. Scott Fitzgerald | [mystery] | [detective fiction] | [social realism]
- Technology: the first commercial radio broadcasting stations | advancements in automotive engineering | the introduction of electric refrigerators | domestic telephones | typewriters | manual washing machines
- Daily life: attending social gatherings, participating in local community events, hosting tea parties
- Social rituals: afternoon tea with family and friends, formal dinners with multiple courses, weekly church services

Atmospheric Details:
The scent of damp earth lingers in the air, mingling with the smoke from the fireplace, creating a cozy yet oppressive atmosphere. The sound of rain tapping against the window creates a rhythm that heightens the tension among the guests gathered in the drawing room. Dimly lit chandeliers cast flickering shadows, making the room feel both intimate and unsettling as secrets threaten to spill over.

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
1. Date references: Mention month/season at least once early in story
2. Fashion des
[truncated for prompt budget]

NON-NEGOTIABLE CHAPTER OBLIGATIONS — LOCKED EVIDENCE PHRASES (VERBATIM REQUIRED):
The following physical evidence values are absolute ground truth. Every time this chapter describes, mentions, or alludes to the relevant evidence — no matter how briefly — it MUST use the exact phrase shown below, character for character. NO paraphrase, approximation, rounding, or synonym is permitted.

FAILURE EXAMPLE: if the locked value is "at thirteen minutes to midnight" and you write "just before midnight" or "around midnight" — that is a HARD FAIL. You must write "at thirteen minutes to midnight". Equally, if the locked value is written in words, such as "ten minutes past eleven", and you convert it to figure-based clock notation — that is also a HARD FAIL. Words stay as words; figure forms are forbidden for word-phrased facts.

CRITICAL — WORD-PHRASED VALUES: If the canonical value is written out in words (e.g. a time like "ten minutes past eleven", or an amount like "forty minutes"), reproduce those exact words. DO NOT convert to figure-based time notation, twenty-four-hour format, or any other numeric shorthand. Correct: "ten minutes past eleven". WRONG: figure-based clock notation or numeric shorthand.

Locked facts:
  - The exact time shown on the stopped clock face: "ten minutes past eleven"
    ⛔ FORBIDDEN alternatives: "11:10", "11.10", "eleven ten", "eleven-ten", "eleven past ten", "quarter past eleven", "half past eleven" — the ONLY acceptable form is "ten minutes past eleven"
  - The exact amount the clock was wound back: "forty minutes"
  - The temperature difference between the clock and the surrounding air: "twenty degrees Fahrenheit"

If a locked fact has no relevance to this chapter, omit it. But the moment you reference the underlying evidence, only the exact phrase above is acceptable.

⛔ CLUES TO SURFACE IN THESE CHAPTERS — mandatory:
The following evidence MUST be clearly observable to an attentive reader. Do not bury it in atmosphere or passing dialogue. Each clue must be concrete, specific, and noticeable:

• [clue_mechanism_visibility_core] The mechanism relies on clock, tamper, and study to expose the false timing.
  Category: temporal | Criticality: essential | Supports inference step 1
  Points to: This detail reveals how the clock's manipulation affects the timeline.

• [clue_fp_contradiction_step_2] The mechanism relies on clock, tamper, and study to expose the false timing.
  Category: temporal | Criticality: essential | Supports inference step 1
  Points to: This detail reveals how the clock's manipulation affects the timeline.

• [clue_fp_contradiction_step_2_2] An unusual scratch on the clock's winding key indicates tampering.
  Category: temporal | Criticality: essential | Supports inference step 2
  Points to: The scratch suggests that the clock has been manipulated recently.

For each clue above: an attentive reader should be able to find, record, and later use it to reason toward the solution.

═══ NARRATIVE STATE (read-only — do not contradict) ═══

LOCKED FACTS — use verbatim whenever this evidence is described:
  • The exact time shown on the stopped clock face: "ten minutes past eleven"
  • The exact amount the clock was wound back: "forty minutes"
  • The temperature difference between the clock and the surrounding air: "twenty degrees Fahrenheit"

CHARACTER PRONOUNS — never deviate from these:
  • Eleanor Voss: she/her/her
  • Dr. Mallory Finch: she/her/her
  • Captain Ivor Hale: he/him/his
  • Beatrice Quill: she/her/her

INVESTIGATION LOG — WHAT IS ESTABLISHED (do not re-establish, do not repeat):
• Suspects still unresolved: Eleanor Voss[SHE], Dr. Mallory Finch[SHE], Captain Ivor Hale[HE]
⚠ The story must move FORWARD from this log. Any beat already listed above is forbidden from repeating.

⚠ THIS CHAPTER'S REQUIRED ADVANCE (opening): Discover the body, confirm the victim, establish the scene. The victim is found dead. They do not speak, react, or gesture. This is their only physical appearance — in all subsequent chapters they exist only in past tense (memory, evidence, testimony).
═══════════════════════════════════════════════════════

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
Known location profile anchors: Little Middleton Manor, The Library, The Drawing Room, The Gardens, The Study, the study of Beatrice Quill's home
LOCATION NAME CAPITALISATION (HARD REQUIREMENT — validated):
All named locations in your prose MUST use the EXACT capitalisation from the CML profiles.
Canonical forms: "Little Middleton Manor", "The Library", "The Drawing Room", "The Gardens", "The Study", "the study of Beatrice Quill's home"
Writing a location in lowercase (e.g. "drawing room" instead of "Drawing Room") is a validated error. Every time you mention a named location, copy its capitalisation from the list above.
- Chapter 1: OPENING STYLE (HARD): Start the VERY FIRST SENTENCE with a named character performing a physical action or motion — e.g. "[Name] crossed the threshold…" / "[Name] set down the glass…" / "[Name] rose from the chair…". Anchor opening in "the study of Beatrice Quill's home". HARD REQUIREMENT for the first 2 paragraphs: (a) include 2+ sensory words — choose from smell/scent/sound/echo/silence/creak/whisper/cold/warm/damp/rough/smooth/glow/shadow/flicker/dim — and (b) include 1+ atmosphere/time word — choose from rain/wind/fog/storm/mist/thunder/evening/morning/night/dawn/dusk/season/afternoon/midday/noon/midnight/twilight/sunrise/sunset/daylight/sunlight/overcast/cloudy/bright/dark. These are validated requirements, not style suggestions; missing them triggers a retry.

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

PROMPT BUDGET SUMMARY: budget=32000 tokens; fixed=5877; context=10789; dropped=[none]; truncated=[location_profiles, temporal_context, pronoun_accuracy]

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
- Chapter numbering starts at 1 and increments by 1 per scene.
- Each chapter has 4-8 substantial paragraphs (each 120–180 words) — TARGET ≥ 1250 words — do not stop early.
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

QUALITY GUIDELINES (strongly preferred):
1. Use only canonical cast names from CML. Do not invent titled placeholders like 'Detective Surname', 'Inspector Surname', 'a woman Surname', or 'a man Surname'.
2. Before the final reveal closes, include explicit suspect-elimination coverage: each non-culprit suspect is ruled out with concrete on-page evidence or confirmed alibi.
3. In the reveal sequence, include a complete culprit evidence chain using explicit reasoning connectors (because/therefore/proves).
4. Integrate at least two concrete era-grounded details per chapter from setting refinement signals: petrol touring cars on country roads | domestic telephone systems with party lines | typewriters for correspondence | telegrams for urgent messages sent from local offices | aerial mail services for faster delivery | telephone communication becoming more widespread.
5. Respect setting movement/access constraints in scene action and alibis: Multiple floors with restricted access to certain wings | Gardens and woods providing natural barriers and hiding places | Weather can affect access and visibility in outdoor areas | Certain areas of the manor are off-limits to staff and guests | Daily routines dictate specific times when the manor is more accessible.
6. Sustain social coherence with this backdrop pressure: A gathering at the estate for a wealthy benefactor's will reading forces heirs and guests to confront their hidden agendas amidst the economic strain of the Great Depression and rising political tensions.
7. Maintain continuity around these socially central cast anchors where relevant: Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill.
8. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Critical: Plot similarity 0.80 with 'The Mysterious Affair at Styles' (same crime type and method)
9. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Moderate: Setting similarity 0.90 with 'The Mysterious Affair at Styles' (same era and similar location)
10. RETRY MITIGATION: Refresh texture usage. Rephrase observations with different lexical framing while preserving all clue obligations and chronology.

CRITICAL PROSE REQUIREMENTS:

The CML specifies exact requirements for certain validation-critical scenes. You MUST include these elements at the specified positions.

**Discriminating Test Scene (Act 3, Scene 4):**
Required elements: Execute the discriminating test, Observe the clock's tampering, Draw conclusion about guilt
Test type: mechanical comparison

**Suspect Clearance Scenes:**
- Eleanor Voss (Act 3, Scene 5): Proving her alibi with witness statements
  Clues: clue_1
- Dr. Mallory Finch (Act 3, Scene 5): Demonstrating her unavailability during the timeline
  Clues: clue_2
- Captain Ivor Hale (Act 3, Scene 5): Alibi confirmed: 10:00 PM - 10:30 PM

**Culprit Revelation Scene (Act 3, Scene 6):**
Method: Confrontation with evidence

**Clue Placement for These Chapters:**
- clue_mechanism_visibility_core must appear in Act 1, Scene 1 via Direct observation

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
- Chapter 1:
  - STRUCTURAL ARCHETYPE — Chapter 1 must be: DISCOVERY
      ✓ MUST contain: body found / victim identified
      ✗ MUST NOT contain: formal accusation or interrogation
  - Word count: Target 1250 words. Achieve this through plot events, dialogue exchanges, and physical investigation — not through atmospheric repetition or extended internal reflection. Each 200-word segment should contain at minimum one concrete story event (a discovery, a conversation exchange, a physical action or movement). Padding with atmosphere alone is not acceptable.
  - Opening: Begin with a character action, spoken line, or clock/time marker — never a location name or location-description phrase.
  - Scene is set in: the study of Beatrice Quill's home — reference it naturally within the paragraph, never as your opening phrase.
  - Opening atmosphere (MANDATORY — validator enforced): the first paragraph MUST contain at least one of: rain / wind / fog / storm / mist / thunder / evening / morning / night / dawn / dusk / season / afternoon / midday / noon / midnight / twilight / sunrise / sunset / daylight / sunlight / overcast / cloudy / bright / dark / grey / pale / cold / warm / chill / crisp / damp / drizzle / haze / lamplight / firelight. A chapter that omits all of these from its opening paragraph will be rejected.
  - INVESTIGATOR ESTABLISHMENT REQUIRED: Dr. Mallory Finch must claim or be recognised as the investigator in this chapter. Establish Dr. Mallory Finch as the detective-in-charge within the first two paragraphs — Dr. Mallory Finch IS the investigator. Do NOT have any character suggest a "real" detective is still coming, or imply that authority has not yet been delegated. Dr. Mallory Finch begins the investigation in this chapter.
  - CLUE OBLIGATIONS — mandatory prose elements (do NOT omit or bury):
    • The mechanism relies on clock, tamper, and study to expose the false timing. [clue_mechanism_visibility_core] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: This detail reveals how the clock's manipulation affects the timeline.
      ↳ MANDATORY TWO-PARAGRAPH STRUCTURE (must appear in paragraphs 1 or 2 — no later):
         Paragraph 1: The POV character physically approaches or directly observes this evidence.
           The narration or dialogue explicitly states what is seen (use the exact locked phrase if one applies).
         Paragraph 2 (immediately following): The detective or POV character explicitly reasons
           about what this evidence implies — who it implicates, why it may be unreliable,
           or what inference it supports. This must be a separate full paragraph, not a sentence appended to Paragraph 1.
    • The mechanism relies on clock, tamper, and study to expose the false timing. [clue_fp_contradiction_step_2] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: This detail reveals how the clock's manipulation affects the timeline.
      ↳ MANDATORY TWO-PARAGRAPH STRUCTURE (must appear in paragraphs 1 or 2 — no later):
         Paragraph 1: The POV character physically approaches or directly observes this evidence.
           The narration or dialogue explicitly states what is seen (use the exact locked phrase if one applies).
         Paragraph 2 (immediately following): The detective or POV character explicitly reasons
           about what this evidence implies — who it implicates, why it may be unreliable,
           or what inference it supports. This must be a separate full paragraph, not a sentence appended to Paragraph 1.
    • An unusual scratch on the clock's winding key indicates tampering. [clue_fp_contradiction_step_2_2] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: The scratch suggests that the clock has been manipulated recently.
      ↳ MANDATORY TWO-PARAGRAPH STRUCTURE (must appear in paragraphs 1 or 2 — no later):
         Paragraph 1: The POV character physically approaches or directly observes this evidence.
           The narration or dialogue explicitly states what is seen (use the exact locked phrase if one applies).
         Paragraph 2 (immediately following): The detective or POV character explicitly reasons
           about what this evidence implies — who it implicates, why it may be unreliable,
           or what inference it supports. This must be a separate full paragraph, not a sentence appended to Paragraph 1.
  - Tonal contrast: include at least one beat of relief or ironic counterpoint. Do not sustain maximum tension for every paragraph.
  - CLUE DISCLOSURE RULE (Stage 1/4):
    Characters may OBSERVE anomalies (wrong time, missing object, odd detail) but must NOT explain the mechanism, deduce the method, or name the culprit. Discovery and reaction only.
    WRONG: dialogue or narration that directly explains how the crime was committed before Stage 4.
    RIGHT: observation, physical reaction, and logical inference that leaves the mechanism just off-screen.
  - ALIBI LOCK: Beatrice Quill's established alibi is "none". Do NOT place Beatrice Quill at any other location or in any other activity during the crime window. Any contradiction is a continuity error that triggers a retry.
  - Sensory obligation — use at least two of: Dim light filtering through the curtains, Raindrops sliding down the window | Rain tapping against the window, The quiet rustle of paper | Cold, damp air. Mood: Pensive and introspective.
- Locked fact phrase obligations:
  - If this batch mentions The exact time shown on the stopped clock face, write exactly: "ten minutes past eleven".
  - If this batch mentions The exact amount the clock was wound back, write exactly: "forty minutes".
  - If this batch mentions The temperature difference between the clock and the surrounding air, write exactly: "twenty degrees Fahrenheit".
- Seasonal vocabulary allow-list: winter, wintry, midwinter.
- Forbidden seasonal words: spring, summer, autumn.

FROZEN FACT STATE (DO NOT ALTER):
- Timeline anchor: January (winter).
- Month, season, weather, and time-of-year language in this batch must stay compatible with winter.
- Established timeline fact: Witnesses saw Beatrice alive at quarter past ten.
- If referenced, use exact phrase: "ten minutes past eleven" (The exact time shown on the stopped clock face).
- If referenced, use exact phrase: "forty minutes" (The exact amount the clock was wound back).
- If referenced, use exact phrase: "twenty degrees Fahrenheit" (The temperature difference between the clock and the surrounding air).

STORY TO DATE (REFERENCE ONLY — DO NOT COPY VERBATIM):
- No previous chapter text exists yet for this batch.

[SCENE COMPLETENESS CONTRACTS — MANDATORY. Each contract below lists what you MUST enact in that chapter. Do not summarise or mention these labels in the prose — enact them organically.]
Chapter 1 (Act 1) completeness contract:
  PIVOT ELEMENT (MANDATORY — write this into the prose, shown not told): "The stopped pocket watch found in the victim's hand — still showing ten past eleven"
  FACT ESTABLISHED (MANDATORY — reader must know this by chapter end): "Establishes the victim died no later than eleven past eleven, contradicting three suspects' alibis"

# Case Overview
Title: The Clockwork Conundrum
Era: 1930s
Setting: Little Middleton
Crime: murder (mechanical tampering)
Culprit: Beatrice Quill
False assumption: The time of death must be consistent with the victim's last known activities.
Cast: Eleanor Voss (she/her), Dr. Mallory Finch (she/her), Captain Ivor Hale (he/him), Beatrice Quill (she/her)

Setting Lock: Keep all scenes and descriptions consistent with the stated setting (Little Middleton). Do not introduce a different location type. Do not invent an alternative estate name. The only permitted name for this property is "Little Middleton" — any other estate name (e.g., "Caldwell Manor", "Ashwood Hall", or any invented proper name) is a continuity error that will be caught and rejected.

⛔ PRONOUN LOCK (verify every sentence before writing):
• Eleanor Voss — she/her/her (NEVER he/him)
• Dr. Mallory Finch — she/her/her (NEVER he/him)
• Captain Ivor Hale — he/him/his (NEVER she/her)
• Beatrice Quill — she/her/her (NEVER he/him)

Outline scenes:
[
  {
    "sceneNumber": 1,
    "act": 1,
    "title": "Discovery",
    "setting": {
      "location": "the study of Beatrice Quill's home",
      "timeOfDay": "Morning after the murder",
      "atmosphere": "Tense household awaiting the detective's arrival"
    },
    "characters": [
      "Dr. Mallory Finch",
      "Eleanor Voss",
      "Captain Ivor Hale",
      "Beatrice Quill"
    ],
    "purpose": "Introduce the crime and detective",
    "cluesRevealed": [
      "clue_mechanism_visibility_core",
      "clue_fp_contradiction_step_2",
      "clue_fp_contradiction_step_2_2"
    ],
    "dramaticElements": {
      "conflict": "Locked room mystery established",
      "tension": "Every suspect had access to the victim",
      "microMomentBeats": [
        "Eleanor stands frozen, her breath catching at the sight of Beatrice's lifeless form."
      ]
    },
    "summary": "In the dim light of the study, the doctor Finch discovers Beatrice Quill's lifeless body slumped over the desk, her hand clutching a stopped pocket watch. Eleanor Voss and the captain Hale stand nearby, their faces pale with shock as they await the arrival of the local constable.",
    "estimatedWordCount": 1800,
    "pivotElement": "The stopped pocket watch found in the victim's hand — still showing ten past eleven",
    "factEstablished": "Establishes the victim died no later than eleven past eleven, contradicting three suspects' alibis",
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
      }
    ],
    "redHerringPlacement": null,
    "emotionalRegister": "The atmosphere is thick with anticipation and hidden agendas.",
    "dominantCharacterNote": {
      "name": "Eleanor Voss",
      "voiceRegister": "Eleanor speaks with a melodic cadence, often punctuating her sentences with a delicate laugh, softening her sharp wit."
    },
    "humourGuidance": {
      "permission": "forbidden"
    },
    "eraTextureNote": "Short daylight hours limit outdoor activities; Limited access to communication technologies; Transportation reliant on petrol amid economic constraints",
    "locationRegisterNote": ""
  }
]
```

## Message 3 (role=user)

```text
BEFORE SUBMITTING YOUR JSON — verify this checklist:
□ Each chapter reaches the hard floor of 450 words and aims for 1250 words or more.
□ If you mention locked evidence, you used the exact locked phrase verbatim.
□ Allowed seasonal words only: winter, wintry, midwinter.
□ Forbidden seasonal words: spring, summer, autumn.
□ Chapter 1: "The mechanism relies on clock, tamper, and study to expose the false timing." is placed in the first 25% of the chapter, followed by an explicit inference or suspicion paragraph.
□ Chapter 1: "The mechanism relies on clock, tamper, and study to expose the false timing." is placed in the first 25% of the chapter, followed by an explicit inference or suspicion paragraph.
□ Chapter 1: "An unusual scratch on the clock's winding key indicates tampering." is placed in the first 25% of the chapter, followed by an explicit inference or suspicion paragraph.
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
Attempt 4/6 — chapters 1 — 1 validation issue(s) to resolve:

═══ PROSE QUALITY ERRORS (1) ═══
• Chapter 1 marked non-convergent after attempt 3/6: template

✓ SOLUTION: Vary paragraph lengths (short, medium, long)
✓ Include sensory details and atmospheric description
✓ Ensure each chapter has substance (3+ paragraphs minimum)

Return corrected JSON for chapters 1. Edit only the sections that failed — keep all content that passed validation, and return the complete updated chapter JSON.


RETRY CLASS: template
ATTEMPT: 3/6
MANDATORY FIXES:
- Resolve template issues before accepting this batch.
- Internal audit note leaked into prose. Never reproduce instruction metadata in your fiction output. Rewrite the passage as natural narrative.
MITIGATION MODE: freshen_atoms
```
