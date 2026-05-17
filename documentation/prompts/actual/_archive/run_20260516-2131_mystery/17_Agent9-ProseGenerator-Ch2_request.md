# Actual Prompt Record

- Run ID: `mystery-1778967097361`
- Project ID: ``
- Timestamp: `2026-05-16T21:34:53.099Z`
- Agent: `Agent9-ProseGenerator-Ch2`
- Operation: `chat_request_full_prompt`
- Model: `GPT-4o-mini`
- Temperature: `0.42`
- Max Tokens: `4500`
- Attempt: `first`
- Prompt Hash: `fa3a9600be6b5e97`

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
- MORAL COMPLEXITY REQUIREMENT: The mechanism of this crime carries a moral gray area: "The murderer acted out of a sense of justice for a wrong that had been long ignored." — the culprit reveal and denouement MUST acknowledge this ambiguity. Do not let the ending feel clean or simple. Give the reader at least one moment of uncomfortable sympathy or moral doubt.


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

## Era: 1935-03
In March 1935, individuals navigate the complexities of a society battling the shadows of the Great Depression. Daily life is marked by economic hardship, with prices rising while the specter of job loss looms over households. The social fabric is tense, as formal gatherings like the charity gala at Little Middleton Manor become a stage where hidden agendas and personal ambitions clash. The scent of damp earth permeates the air, and the distant sound of rain serves as a reminder of the uncertainty that envelops the nation. For many, maintaining appearances becomes essential, even as the realities of life outside the manor's walls grow increasingly dire. As they engage in polite conversation amidst the grandeur, an undercurrent of anxiety simmers, reflecting the national mood fraught with political tensions and a longing for stability.
Emotional register: A pervasive sense of anxiety and uncertainty grips society as individuals grapple with their ambitions against the backdrop of economic despair.
Physical constraints: Limited travel options due to fuel shortages and economic constraints. | Slow communication methods such as telegrams and letters. | Social events requiring strict adherence to etiquette and formality. | Weather conditions affecting outdoor activities and gatherings.
Current tensions (weave into background texture): Political tensions rise in Europe with the growing influence of fascism. | The British government faces backlash over austerity measures. | Unrest in the coal mining regions as labor strikes escalate.
Wartime context — Many veterans struggle to reintegrate into civilian life, facing neglect from society.: Communities are divided, with discussions surrounding the treatment of veterans sparking heated debates. Absence effect: The absence of meaningful support for those who served leaves a lingering resentment among veterans.

## Story Theme
In a world where ambition collides with moral integrity, the pursuit of truth exposes the fragility of human relationships amidst the shadows of deception, and reveals that evidence carries ethical weight, forcing characters to choose accountability over social performance when appearances and facts collide.

## Story Emotional Register
Dominant: The story oscillates between tense intrigue and emotional turmoil.

Arc:
The story opens in Little Middleton Manor on a cool, overcast evening, where the charity gala buzzes with anticipation. The atmosphere is charged with both elegance and tension, underscoring the weight of the charity event as guests gather, unaware of the tragedy about to unfold. Eleanor Voss, the well-respected socialite, is found dead in her study, casting a shadow over the evening's festivities. As the investigation begins, unease grows among the guests, each with hidden motives and secrets. The first clues point to a tampered clock, leading to false assumptions and growing anxiety.

Beatrice Quill, the amateur sleuth, feels the emotional toll of uncovering dark truths while trying to navigate her own ambitions. A pivotal moment occurs when Dr. Finch's alibi is called into question, revealing a connection to the tampering that shifts suspicion. As evidence mounts, a revelation about the clock's manipulation redefines the timeline, placing Finch at the center of the mystery. The pressure intensifies as the investigation culminates in a confrontation, exposing the tangled web of relationships and motives. In the resolution, the emotional cost weighs heavily on each character, as Eleanor's death becomes a symbol of lost dreams and broken trust, leaving a lingering sense of disillusionment in the wake of the truth.

## Emotional register at this point in the story
The atmosphere is filled with anticipation and elegance, masking the underlying tensions among guests.

## Character Portraits (appearance & era)

### Eleanor Voss
Eleanor Voss embodies the struggles of the 1930s, navigating her socialite persona while grappling with financial instability. The pressure to maintain her status in a world where wealth is dwindling weighs heavily on her. Her lavish gatherings become both a refuge and a façade, as she battles the fear of losing everything she has built. The societal expectations of elegance and propriety clash with her inner turmoil, forcing her to confront the limits of her ambition in a rapidly changing world.
Era intersection: Eleanor's financial troubles reflect the broader economic challenges of the Great Depression, as many socialites like her face the threat of losing their elite status.

### Dr. Mallory Finch
Dr. Mallory Finch represents the ambitious doctor caught in the crosshairs of professional rivalry and societal expectations. His desire to innovate in medicine is stifled by traditionalists, mirroring the tension in society as old norms are challenged by new ideas. As he navigates the precarious landscape of medical practice, the looming specter of economic instability weighs on him, driving him to consider desperate measures to protect his career and reputation.
Era intersection: Mallory's struggle against the established medical community highlights the tension between progressive and traditional values during a time of social upheaval.

### Beatrice Quill
Beatrice Quill exemplifies the emerging voice of women in journalism, navigating a male-dominated field while aspiring for recognition. Her determination to uncover the truth is fueled by the societal challenges women face during the 1930s, as they fight for their place in the professional world. As she pursues her ambitions amidst the backdrop of economic struggles, she embodies the tension between traditional gender roles and the burgeoning movement for women's rights.
Era intersection: Beatrice's ambition reflects the changing landscape for women in the workforce, as they increasingly challenge the constraints of their roles in society.

## Character Voices

### Eleanor Voss (she/her/her)
Eleanor speaks with a refined cadence, often using a light, musical laugh to charm those around her.
[comfortable] Oh, darling, isn't it simply marvelous to see everyone gathered here? Such delightful company always brightens my day!
[evasive] Well, you know how these things go... it's all rather complicated, and I'd rather not dwell on it.
[stressed] I simply cannot bear the thought of losing everything! What would everyone say? How could I face them?
Humour: Eleanor often employs polite savagery in her wit, delivering barbed compliments with grace.

### Dr. Mallory Finch (he/him/his)
Dr. Finch's tone is measured and authoritative, often laced with a dry wit that reveals his intellect.
[comfortable] Ah, my dear friends, let us discuss the marvels of modern medicine. It's quite an exciting time to be in the field.
[evasive] I believe there are more pressing matters at hand. Shall we not focus on the task before us?
[stressed] This is absurd! I am not a suspect! I have my work to consider, and this is all a dreadful mistake!
Humour: His dry wit often surfaces in unexpected moments, adding a layer of complexity to his character.

### Beatrice Quill (she/her/her)
Beatrice speaks rapidly, her words flowing with enthusiasm and determination, often punctuated by insightful commentary.
[comfortable] This is it! The story of a lifetime! I can feel it in my bones!
[evasive] Well, I wouldn't want to speculate without the facts, would I? That's not my style.
[stressed] What if I mess this up? This could define my career, and I can't afford to fail!
Humour: Beatrice's sardonic wit adds a refreshing edge to her character, making her observations sharp and engaging.

## Location Registers (scene framing guides)

The Drawing Room: The drawing room is alive with a tense energy, where laughter dances on the surface, but beneath, anxiety simmers. Guests exchange glances laced with suspicion, and the elegant decor feels almost suffocating under the weight of unspoken truths.. Camera angle: As a writer enters this space, the emotional tension is palpable, and the contrast between opulence and underlying discord is striking.. Era: This space, while luxurious, is bound by the strict etiquette and social expectations of the 1930s.

The Study: The study feels claustrophobic and charged with secrets, where every shadow seems to hold a whisper of betrayal. The air is thick with the scent of old books and the weight of unspoken accusations, creating a space fraught with tension.. Camera angle: Entering this room, a writer senses the gravity of the moment, where every detail could unravel the mystery or conceal it further.. Era: As a private domain, the study reflects the era's constraints on personal expression, where thoughts often remain unvoiced.

The Library: The library is steeped in an eerie silence, broken only by the sound of rain against the window. The shadows cast by the dim light seem to cloak the truth, creating an unsettling atmosphere where knowledge intertwines with danger.. Camera angle: As a writer steps into this space, the contrast between its scholarly purpose and the grim reality of the crime is stark.. Era: The isolation of this room amplifies the feelings of uncertainty, characteristic of the 1930s' social unrest.

## Humour guidance for this story position (opening)
Permission: permitted
Rationale: The atmosphere is light, allowing for some charming exchanges among guests.

FAIR-PLAY AND INFERENCE CONTRACT (from CML logic):
- False assumption in force: The clock showed the correct time at the moment of death.
- Hidden truth to progressively expose: The clock had been tampered with, misrepresenting the actual time.
- Inference path checkpoints to dramatize clearly (observation -> correction -> effect):
  - Step 1: obs: The clock in the study shows a time of eight o'clock, while witnesses recall dinner ending at quarter past eight. | corr: The clock's time contradicts the timeline of events. | effect: Narrows the investigation window to Dr. Mallory Finch.
  - Step 2: obs: Oil residue is found on the clock's winding mechanism. | corr: The oil indicates recent tampering with the clock. | effect: Eliminates Captain Ivor Hale by proving he had no access to the clock.
  - Step 3: obs: Witnesses saw Dr. Finch in the study shortly before the murder. | corr: Dr. Finch's presence in the study aligns with the clock tampering. | effect: Narrows suspicion to Dr. Mallory Finch.
- Discriminating test method: trap
- Discriminating test design constraint: The discriminating test compares clock, tamper, and study against the claimed timeline.
- Test must rely on already-shown clue IDs: clue_1, clue_2, clue_3, clue_4, clue_6
- Fair-play rationale: Step 1: The clock's time and dinner timeline (early) establish the first contradiction. Step 2: Oil residue on the clock (mid) reveals tampering. Step 3: Witness accounts corroborate Dr. Finch's presence (discriminating test) and lead to his guilt.
- Never solve by withheld information. Keep reader-information parity with detective reasoning.

## Character Reference

### Eleanor Voss (she/her — NEVER he/him)
Eleanor speaks with a refined cadence, often punctuating her sentences with a light, almost musical laugh
She has a talent for delivering barbed compliments that leave her audience both enchanted and slightly unsettled.
Eleanor wrestles with the morality of her ambitions. The allure of wealth and status clashes with her understanding that integrity might be the very thing that saves her soul.

### Dr. Mallory Finch (he/him — NEVER she/her)
Finch speaks with a measured tone, often employing technical jargon that reveals his vast knowledge
He has a tendency to raise an eyebrow and smirk when delivering witty observations, making him both engaging and slightly intimidating.
Mallory struggles with the ethics of his ambitions, torn between his desire to be a pioneer in medicine and the moral implications of his actions.

### Beatrice Quill (she/her — NEVER he/him)
Beatrice speaks rapidly, often interjecting her thoughts with a flurry of questions
She has a habit of punctuating her sentences with wry observations, revealing her sharp wit and determination.
Beatrice grapples with societal expectations and her desire to break free from the constraints placed on her as a woman in journalism, fueling her ambition but also causing self-doubt.


## CHARACTER CONTRACTS (binding for this scene)
Each entry below constrains how this character must be written in this chapter.
These override generic style guidance when they conflict.

### Eleanor Voss[SHE]
Voice & mannerisms: Eleanor speaks with a refined cadence, often punctuating her sentences with a light, almost musical laugh. She has a talent for delivering barbed compliments that leave her audience both enchanted and slightly unsettled.
Sample voice fragments (match this register and rhythm):
  [comfortable] "Oh, darling, isn't it simply marvelous to see everyone gathered here? Such delightful company always brightens my day!"
  [evasive] "Well, you know how these things go... it's all rather complicated, and I'd rather not dwell on it."
Humour: polite savagery — deploy frequently (level 0.7)
FORBIDDEN phrase (never write for Eleanor Voss): "she felt a wave of unease"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Eleanor's desire to maintain her lavish lifestyle drives her to consider desperate measures. If the victim's project succeeds, her carefully curated world could come crashing down." — do not surface in Act I.

### Dr. Mallory Finch[HE]
Voice & mannerisms: Dr. Finch speaks with a measured tone, often employing technical jargon that reveals his vast knowledge. He has a tendency to raise an eyebrow and smirk when delivering witty observations, making him both engaging and slightly intimidating.
Sample voice fragments (match this register and rhythm):
  [comfortable] "Ah, my dear friends, let us discuss the marvels of modern medicine. It's quite an exciting time to be in the field."
  [evasive] "I believe there are more pressing matters at hand. Shall we not focus on the task before us?"
Humour: dry wit — deploy occasionally (level 0.5)
FORBIDDEN phrase (never write for Dr. Mallory Finch): "a surge of determination washed over her"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Mallory believes the victim's influence could impede his progressive treatments, leading him to consider drastic measures to protect his career." — do not surface in Act I.

### Beatrice Quill[SHE]
Voice & mannerisms: Beatrice speaks rapidly, often interjecting her thoughts with a flurry of questions. She has a habit of punctuating her sentences with wry observations, revealing her sharp wit and determination.
Sample voice fragments (match this register and rhythm):
  [comfortable] "This is it! The story of a lifetime! I can feel it in my bones!"
  [evasive] "Well, I wouldn't want to speculate without the facts, would I? That's not my style."
Humour: sardonic — deploy occasionally (level 0.6)
FORBIDDEN phrase (never write for Beatrice Quill): "palpable tension filled the room"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Beatrice views the victim's death as a potential career-defining story, one that could propel her into the spotlight and validate her place in a challenging profession." — do not surface in Act I.



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
Little Middleton Manor is a sprawling country estate steeped in mystery, where the echoes of recent social unrest linger in the air. Within its ornate walls, secrets and tensions brew among the guests and staff alike.

Key Locations Available:
- The Library (interior): Crime scene
- The Drawing Room (interior): Gathering space
- The Study (interior): Private quarters for investigation

Atmosphere: tense and suspenseful, heightened by recent social unrest
Weather: overcast with intermittent rain, typical for autumn

Era markers: Petrol-powered automobiles on gravel estate roads | Early home telephones with party lines | Typewriters for correspondence

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
  - Visual: Dim light filtering through leaded glass, Dust motes dancing in the air, Rich mahogany furniture
  - Sounds: Pages turning in the silence, The faint drip of rain from the eaves, Soft rustle of fabric from a hidden corner
  - Scents: Old leather bindings, Damp paper, Musty volumes
  - Touch: Worn leather armchair, Cold marble floor

The Drawing Room (interior):
  - Visual: Elegant chandeliers glinting in the light, Heavy drapes framing large windows, Richly patterned carpets
  - Sounds: The crackle of the fire, Soft laughter and whispered conversations, The rustle of silk and velvet
  - Scents: Wood smoke from the fireplace, Freshly brewed tea, Floral arrangements
  - Touch: Plush cushions on sofas, Cool marble of the fireplace

The Study (interior):
  - Visual: Flickering candles casting shadows, An antique globe spinning slowly, Stacks of papers piled high
  - Sounds: The scratching of a pen on paper, A clock ticking steadily, The faint rustle of a newspaper
  - Scents: Fresh ink and paper, Rich leather of the armchair, Dust from old books
  - Touch: Smooth surface of the desk, Worn leather of the armchair

⛔ REFERENCE DATA — DO NOT TRANSCRIBE VERBATIM: The above profiles are structural guides only. Generate original prose that evokes these qualities; do not reproduce the exact phrasing or sentence structure of the profile paragraphs.

SCENE OPENING RULE: When opening a scene in a new location, write what the POV character directly observes and physically senses at that moment — not a general description of the room's qualities. The reader must feel present, not briefed. Sensory details must be observed by the character, not stated as fact about the place.

SENSORY WRITING TECHNIQUES:
- Opening paragraphs: Lead with 2-3 sensory details to ground the scene
- Movement between locations: Note sensory changes (quiet study → noisy dining room)
- Emotional scenes: Use sensory details to reinforce mood (cold rain during argument)
- Period authenticity: Use period-specific sensory details from location/temporal profiles
- Avoid: Over-reliance on visual only; use sound, smell, touch, temperature

CHAPTER SENSORY PALETTE HINTS (evoke these qualiti
[truncated for prompt budget]

## Texture Pool
Draw on these as opportunities arise — you are not required to use them.

- In March 1935, individuals navigate the complexities of a society battling the shadows of the Great Depression
- Daily life is marked by economic hardship, with prices rising while the specter of job loss looms over households
- The social fabric is tense, as formal gatherings like the charity gala at Little Middleton Manor become a stage where hidden agendas and personal ambitions clash
- The scent of damp earth permeates the air, and the distant sound of rain serves as a reminder of the uncertainty that envelops the nation
- For many, maintaining appearances becomes essential, even as the realities of life outside the manor's walls grow increasingly dire

TEMPORAL CONTEXT:

This story takes place in March 1935 during spring.

Seasonal Atmosphere:
- Weather patterns: overcast skies, frequent light rain, cool breezes
- Daylight: Days are beginning to lengthen, with daylight extending into the evening, though clouds often obscure the sun.
- Seasonal activities: Spring cleaning in the estates, Preparing gardens for planting, Attending local fairs and markets
- Seasonal occasions: St. Patrick's Day (March 17)
- Season: spring

Period Fashion (describe naturally):
- Men formal: double-breasted suit in a muted herringbone pattern, white dress shirt with a high collar, polished leather oxfords
- Men casual: tweed cap, corduroy trousers, simple knitted pullover
- Men accessories: silk pocket square, gold watch, tie clip
- Women formal: tea-length dress with a fitted waist, lightweight overcoat with a floral print, satin gloves
- Women casual: tweed skirt with a matching blazer, blouse with puff sleeves, simple leather shoes
- Women accessories: cloche hat adorned with a ribbon, string of pearls, handbag with a clasp

Cultural Context (reference naturally):
- Music/entertainment: 'In the Mood' by Glenn Miller, 'Cheek to Cheek' by Fred Astaire, 'The Continental' from 'The Gay Divorcee'; Films: 'Top Hat' starring Fred Astaire and Ginger Rogers, 'Mutiny on the Bounty'; Theatre: 'Pygmalion' by George Bernard Shaw, Various productions showcasing new musical numbers; Radio: 'The Shadow' — a crime drama series, 'Amos 'n' Andy' — a popular comedy program
- Typical prices: Bread loaf: four pence, Cinema ticket: one shilling, A pint of beer: eight pence
- Current events: Political tensions rise in Europe with the growing influence of fascism; The British government faces backlash over austerity measures
- Literature: 'Of Mice and Men' by John Steinbeck | 'The Maltese Falcon' by Dashiell Hammett | 'Brave New World' by Aldous Huxley | [Detective fiction] | [Social realism] | [Adventure novels]
- Technology: The first commercial radio broadcasts | Advancements in airplane design | Development of early television technology | Home telephones with party lines | Typewriters for correspondence | Automobiles with improved engines and designs
- Daily life: Attending social events and dances, Participating in community fairs, Engaging in local political discussions
- Social rituals: Sunday family gatherings, Tea time rituals in the afternoon, Formal dinner parties in the evenings

Atmospheric Details:
The scent of damp earth mingles with the fresh blooms of spring, creating an invigorating, yet heavy atmosphere. The sound of raindrops tapping against windowpanes punctuates the silence of the estate, heightening the sense of tension within its walls. The flickering glow of candlelight casts shadows across the room, evoking a sense of mystery and anticipation as the evening unfolds.

FASHION INTEGRATION TECHNIQUES:
- First appearance: Describe outfit to establish class/personality
- Accessories: Gloves, hats, pocket watches, jewelry reveal status
- Time-specific: Different outfits for different times of day
- Character traits: Fastidious dresser vs rumpled appearance
- Action integration: "She tugged at her glove" or "He adjusted his tie"
- Weather appropriate: Overcoats in winter, light linen in summer

CULTURAL TOUCHSTONE INTEGRATION:
- Casual conversation: "Did you hear that new jazz record?"
[truncated for prompt budget]

NON-NEGOTIABLE CHAPTER OBLIGATIONS — LOCKED EVIDENCE PHRASES (VERBATIM REQUIRED):
The following physical evidence values are absolute ground truth. Every time this chapter describes, mentions, or alludes to the relevant evidence — no matter how briefly — it MUST use the exact phrase shown below, character for character. NO paraphrase, approximation, rounding, or synonym is permitted.

FAILURE EXAMPLE: if the locked value is "at thirteen minutes to midnight" and you write "just before midnight" or "around midnight" — that is a HARD FAIL. You must write "at thirteen minutes to midnight". Equally, if the locked value is written in words, such as "ten minutes past eleven", and you convert it to figure-based clock notation — that is also a HARD FAIL. Words stay as words; figure forms are forbidden for word-phrased facts.

CRITICAL — WORD-PHRASED VALUES: If the canonical value is written out in words (e.g. a time like "ten minutes past eleven", or an amount like "forty minutes"), reproduce those exact words. DO NOT convert to figure-based time notation, twenty-four-hour format, or any other numeric shorthand. Correct: "ten minutes past eleven". WRONG: figure-based clock notation or numeric shorthand.

Locked facts:
  - The exact time shown on the stopped clock face: "ten minutes past eleven"
    ⛔ FORBIDDEN alternatives: "11:10", "11.10", "eleven ten", "eleven-ten", "eleven past ten", "quarter past eleven", "half past eleven" — the ONLY acceptable form is "ten minutes past eleven"
  - The exact amount the clock was wound back: "forty minutes"
  - The time dinner was served, contradicting the murder timeline: "eight o'clock"
    ⛔ FORBIDDEN alternatives: "8:00", "8.00" — the ONLY acceptable form is "eight o'clock"
  - The time of death as inferred from other evidence: "ten minutes past eleven"
    ⛔ FORBIDDEN alternatives: "11:10", "11.10", "eleven ten", "eleven-ten", "eleven past ten", "quarter past eleven", "half past eleven" — the ONLY acceptable form is "ten minutes past eleven"

If a locked fact has no relevance to this chapter, omit it. But the moment you reference the underlying evidence, only the exact phrase above is acceptable.

⛔ CLUES TO SURFACE IN THESE CHAPTERS — mandatory:
The following evidence MUST be clearly observable to an attentive reader. Do not bury it in atmosphere or passing dialogue. Each clue must be concrete, specific, and noticeable:

• [clue_core_contradiction_chain] The clock's time contradicts the timeline of events.
  Category: temporal | Criticality: essential | Supports inference step 1
  Points to: This reveals that the time displayed does not match the events as reported by witnesses.

For each clue above: an attentive reader should be able to find, record, and later use it to reason toward the solution.

═══ NARRATIVE STATE (read-only — do not contradict) ═══

LOCKED FACTS — use verbatim whenever this evidence is described:
  • The exact time shown on the stopped clock face: "ten minutes past eleven"
  • The exact amount the clock was wound back: "forty minutes"
  • The time dinner was served, contradicting the murder timeline: "eight o'clock"
  • The time of death as inferred from other evidence: "ten minutes past eleven"

CHARACTER PRONOUNS — never deviate from these:
  • Eleanor Voss: she/her/her
  • Dr. Mallory Finch: he/him/his
  • Captain Ivor Hale: he/him/his
  • Beatrice Quill: she/her/her

CLUES ALREADY REVEALED TO READER: clue_mechanism_visibility_core, clue_fp_contradiction_step_2 — do not reveal these as new information.

INVESTIGATION LOG — WHAT IS ESTABLISHED (do not re-establish, do not repeat):
• Evidence in reader's hands: The mechanical clock was wound back to create a false timeline. | Oil residue is found on the clock's winding mechanism.
• Suspects still unresolved: Eleanor Voss[SHE], Captain Ivor Hale[HE], Beatrice Quill[SHE]
⚠ The story must move FORWARD from this log. Any beat already listed above is forbidden from repeating.

⚠ THIS CHAPTER'S REQUIRED ADVANCE (opening): Discover the body, confirm the victim, note the stopped clock

CONTINUITY HANDOFF — previous chapter closing beat:
  • "As they exchanged glances, the tension in the room escalated. Beatrice felt the weight of the investigation pressing down on her shoulders. She was determined to uncover the truth, but the stakes had never felt higher. Every suspect had access to Eleanor, and..."
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
study

✓ RULE: Continue using this location vocabulary. Maintain consistency with established setting type.
✓ Do NOT introduce new location types that contradict earlier chapters.

**Recent Chapter Summary (for narrative continuity):**
Chapter 1: Chapter 1: Discovery
  Events: Beatrice Quill stepped into the study of Dr.

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
Known location profile anchors: Little Middleton Manor, The Library, The Drawing Room, The Study, the study
LOCATION NAME CAPITALISATION (HARD REQUIREMENT — validated):
All named locations in your prose MUST use the EXACT capitalisation from the CML profiles.
Canonical forms: "Little Middleton Manor", "The Library", "The Drawing Room", "The Study", "the study"
Writing a location in lowercase (e.g. "drawing room" instead of "Drawing Room") is a validated error. Every time you mention a named location, copy its capitalisation from the list above.
- Chapter 2: OPENING STYLE (HARD): Start the VERY FIRST SENTENCE with spoken dialogue — e.g. '"[words]," [Name] said/asked/replied/murmured.' The opening quote must be the first character on the line. Anchor opening in "the study". HARD REQUIREMENT for the first 2 paragraphs: (a) include 2+ sensory words — choose from smell/scent/sound/echo/silence/creak/whisper/cold/warm/damp/rough/smooth/glow/shadow/flicker/dim — and (b) include 1+ atmosphere/time word — choose from rain/wind/fog/storm/mist/thunder/evening/morning/night/dawn/dusk/season/afternoon/midday/noon/midnight/twilight/sunrise/sunset/daylight/sunlight/overcast/cloudy/bright/dark. These are validated requirements, not style suggestions; missing them triggers a retry.

[⚠ INTERNAL QUALITY DIAGNOSTICS — DO NOT REPRODUCE ANY PART OF THIS SECTION IN YOUR STORY OUTPUT. These are private generator observations for your consideration only. Your narrative must read as if this section does not exist. Never include phrases from this block in character dialogue, narration, or description.]

PRIOR CHAPTER QUALITY OBSERVATIONS:
- Chapter 1 (score 82/100):
  Quality gaps noted: word density below preferred target (558/1000); scene grounding weakness
  Address in upcoming chapters: Increase chapter density with concrete investigation action and sensory-grounded beats; avoid recap-only padding. | Open next chapter with a named location anchor plus at least two sensory cues and one atmosphere marker.
[END INTERNAL DIAGNOSTICS]

PROMPT BUDGET SUMMARY: budget=32000 tokens; fixed=6619; context=10477; dropped=[none]; truncated=[pronoun_accuracy, location_profiles, temporal_context]

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
8. Integrate at least two concrete era-grounded details per chapter from setting refinement signals: petrol-powered automobiles on gravel estate roads | early home telephones with party lines | typewriters for correspondence | telegrams for urgent messages via local post office | aerial mail services for faster delivery | telephone communication for immediate contact.
9. Respect setting movement/access constraints in scene action and alibis: manor architecture limits movement to designated areas | weather conditions affect outdoor access and evidence visibility | landscaping creates natural barriers and hiding spots | restricted access to upper floors and private study | guest lists maintained for social gatherings.
10. Sustain social coherence with this backdrop pressure: A gathering at the country house for a charitable auction amidst the Great Depression forces a diverse group of guests to confront their hidden agendas while the looming threat of fascism stirs underlying tensions.
11. Maintain continuity around these socially central cast anchors where relevant: Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill.
12. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Critical: Plot similarity 0.70 with 'The Mysterious Affair at Styles' (similar crime method and temporal axis)
13. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Moderate: Character similarity 0.60 with 'The Mysterious Affair at Styles' (similar cast structure)
14. STORY TO DATE ANTI-COPY RULE: The STORY TO DATE section below is provided for chronological and factual reference ONLY. You MUST NOT copy, lightly rephrase, or structurally echo any sentence or paragraph from prior chapters. Every sentence in this chapter must be original prose unique to this scene. Reusing even a clause from prior chapter text will cause this attempt to fail immediately.

CRITICAL PROSE REQUIREMENTS:

The CML specifies exact requirements for certain validation-critical scenes. You MUST include these elements at the specified positions.

**Discriminating Test Scene (Act 3, Scene 4):**
Required elements: Execute the discriminating test, Observe the clock's time against a known good timepiece, Draw conclusion about Dr. Finch's guilt
Test type: temporal

**Suspect Clearance Scenes:**
- Captain Ivor Hale (Act 3, Scene 5): Prove his alibi with witnesses confirming he was in the garden.
  Clues: clue_1, clue_2
- Eleanor Voss (Act 3, Scene 5): She is the victim and cannot be guilty.
  Clues: clue_1

**Culprit Revelation Scene (Act 3, Scene 6):**
Method: Confrontation with evidence gathered about the clock.

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
  - Scene is set in: the study — reference it naturally within the paragraph, never as your opening phrase.
  - Opening atmosphere (MANDATORY — validator enforced): the first paragraph MUST contain at least one of: rain / wind / fog / storm / mist / thunder / evening / morning / night / dawn / dusk / season / afternoon / midday / noon / midnight / twilight / sunrise / sunset / daylight / sunlight / overcast / cloudy / bright / dark. A chapter that omits all of these from its opening paragraph will be rejected.
  - Continuity bridge: in the first 120 words, visibly connect from the previous chapter's final beat. Carry forward one unresolved element (object, accusation, emotional pressure, or immediate physical action) from: "As they exchanged glances, the tension in the room escalated. Beatrice felt the weight of the investigation pressing down on her shoulders. She was determined to uncover the truth, but the stakes had never felt higher. E...".
  - CLUE OBLIGATIONS — mandatory prose elements (do NOT omit or bury):
    • The clock's time contradicts the timeline of events. [clue_core_contradiction_chain] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: This reveals that the time displayed does not match the events as reported by witnesses.
      ↳ MANDATORY TWO-PARAGRAPH STRUCTURE (must appear in paragraphs 1 or 2 — no later):
         Paragraph 1: The POV character physically approaches or directly observes this evidence.
           The narration or dialogue explicitly states what is seen (use the exact locked phrase if one applies).
         Paragraph 2 (immediately following): The detective or POV character explicitly reasons
           about what this evidence implies — who it implicates, why it may be unreliable,
           or what inference it supports. This must be a separate full paragraph, not a sentence appended to Paragraph 1.
  - Tonal contrast: include at least one beat of relief or ironic counterpoint. Do not sustain maximum tension for every paragraph.
  - Sensory obligation — use at least two of: Dim light barely illuminating the space, Shadows stretching across the desk | The ticking of the clock, Distant thunder rumbling | Dusty pages. Mood: brooding.
- Locked fact phrase obligations:
  - If this batch mentions The exact time shown on the stopped clock face, write exactly: "ten minutes past eleven".
  - If this batch mentions The exact amount the clock was wound back, write exactly: "forty minutes".
  - If this batch mentions The time dinner was served, contradicting the murder timeline, write exactly: "eight o'clock".
  - If this batch mentions The time of death as inferred from other evidence, write exactly: "ten minutes past eleven".
- Seasonal vocabulary allow-list: spring, vernal, springtime.
- Forbidden seasonal words: summer, autumn, winter.

FROZEN TIMELINE STATE (DO NOT ALTER):
- Timeline anchor: March (spring).
- Month, season, weather, and time-of-year language in this batch must stay compatible with spring.
- Established timeline fact: last meal served at eight
- Established timeline fact: Eleanor found at eight fifteen
- If referenced, use exact time phrase: "ten minutes past eleven" (The exact time shown on the stopped clock face).
- If referenced, use exact time phrase: "forty minutes" (The exact amount the clock was wound back).
- If referenced, use exact time phrase: "eight o'clock" (The time dinner was served, contradicting the murder timeline).
- If referenced, use exact time phrase: "ten minutes past eleven" (The time of death as inferred from other evidence).

STORY TO DATE (REFERENCE ONLY — DO NOT COPY VERBATIM):
- Full prior chapter text is provided below for continuity, factual consistency, and reference accuracy.
- Use this to keep character voice, chronology, clue state, and location continuity aligned with earlier chapters.
- Do not quote, copy, or paraphrase these paragraphs too closely; write fresh prose that remains consistent with them.

--- BEGIN PRIOR CHAPTER 1 ---
Title: Chapter 1: Discovery
Beatrice Quill stepped into the study of Dr. Finch's home, the damp scent of rain lingering in the air. The morning light filtered weakly through the overcast sky, casting a muted glow on the cluttered desk. Papers lay strewn about, their edges curling slightly from the moisture. Beatrice's heart raced as she crossed the threshold, the weight of the recent tragedy pressing down on her. She had come to uncover the truth, but the atmosphere in the room felt thick with unspoken fears and hidden motives.

Her gaze fell upon the mechanical clock mounted on the wall, its hands frozen in time. It showed ten minutes past eleven, an ominous reminder of the moment the life of Eleanor Voss had been extinguished. Beatrice approached the clock, her fingers brushing against its cold surface, and she noted the peculiar stillness that surrounded it. It was a stark contrast to the chaos of the evening before, when laughter had filled the air. Now, the clock’s silence felt like a taunt, a challenge to decipher the truth behind Eleanor's death.

As Beatrice examined the clock more closely, she noticed something unusual. The clock had been wound back to create a false timeline. The realization struck her like a bolt of lightning. This manipulation suggested that someone had gone to great lengths to distort the events leading up to the murder. Who would have the motive to alter time itself? The implications were staggering, and Beatrice felt a shiver run down her spine as she considered the possibilities.

Dr. Finch, standing nearby, seemed to sense his unease. "What is it, Beatrice?" she inquired, her voice steady but tinged with concern. She stepped closer, her brow furrowing as she caught sight of the clock. "It appears to be stopped. I hadn’t noticed that before. What time does it show?"

"It’s ten minutes past eleven," Beatrice replied, her voice barely above a whisper. "This contradicts the timeline of events. Eleanor was found at eight fifteen, and dinner was served at eight o'clock. If the clock was tampered with, it could mean someone was trying to cover their tracks."

Dr. Finch’s expression darkened as he processed the information. "That’s quite troubling. But we must consider the possibility that it was merely a malfunction. Clocks can be fickle, especially in this damp weather." His attempt at rationalization felt weak against the gravity of the evidence.

Beatrice shook her head, her mind racing. "No, there’s more to it than that. Look at the winding mechanism; it’s covered in oil residue. This indicates recent tampering with the clock. Someone wanted to mislead us about the time of death."

The doctor’s eyes widened slightly as she leaned closer to inspect the clock. "Oil residue? That’s quite significant. It suggests that someone actively interfered with the clock before the murder was discovered. We need to find out who had access to this room."

As they exchanged glances, the tension in the room escalated. Beatrice felt the weight of the investigation pressing down on her shoulders. She was determined to uncover the truth, but the stakes had never felt higher. Every suspect had access to Eleanor, and now the clock stood as a silent witness to the deception that had unfolded. The air was thick with anticipation as they prepared to delve deeper into the mystery surrounding Eleanor Voss's untimely demise.
--- END PRIOR CHAPTER 1 ---

[SCENE COMPLETENESS CONTRACTS — MANDATORY. Each contract below lists what you MUST enact in that chapter. Do not summarise or mention these labels in the prose — enact them organically.]
Chapter 2 (Act 1) completeness contract:
  PIVOT ELEMENT (MANDATORY — write this into the prose, shown not told): "Eleanor's conflicting account of dinner time."
  FACT ESTABLISHED (MANDATORY — reader must know this by chapter end): "Establishes that the clock's time contradicts the witnesses' timeline."
  RED HERRING (MANDATORY — seed naturally, not flagged as false): [rh_1] Eleanor mentions the clock showed the correct time at the moment of death, creating doubt about its tampering.

# Case Overview
Title: The Clockwork Conundrum
Era: 1930s
Setting: Little Middleton
Crime: murder (mechanical tampering)
Culprit: Dr. Mallory Finch
False assumption: The clock showed the correct time at the moment of death.
Cast: Eleanor Voss (she/her), Dr. Mallory Finch (he/him), Captain Ivor Hale (he/him), Beatrice Quill (she/her)

Setting Lock: Keep all scenes and descriptions consistent with the stated setting (Little Middleton). Do not introduce a different location type.

Outline scenes:
[
  {
    "sceneNumber": 2,
    "act": 1,
    "title": "Contradictions",
    "setting": {
      "location": "the study",
      "timeOfDay": "Morning, shortly after the first scene",
      "atmosphere": "Tension mounts as details emerge"
    },
    "characters": [
      "Beatrice Quill",
      "Eleanor Voss",
      "Dr. Mallory Finch"
    ],
    "purpose": "Establish contradictions in witness statements",
    "cluesRevealed": [
      "clue_core_contradiction_chain"
    ],
    "dramaticElements": {
      "conflict": "Witnesses provide conflicting accounts",
      "tension": "Suspicion begins to form around the suspects",
      "microMomentBeats": [
        "Dr. Finch fidgets, unable to meet Beatrice's gaze."
      ]
    },
    "summary": "Beatrice questions Eleanor and Dr. Finch about the timeline of events. Eleanor recalls dinner ending at eight o'clock, while the clock shows ten minutes past eleven. Tension rises as Beatrice notes the discrepancies in their accounts.",
    "estimatedWordCount": 1800,
    "pivotElement": "Eleanor's conflicting account of dinner time.",
    "factEstablished": "Establishes that the clock's time contradicts the witnesses' timeline.",
    "permittedBehavioursByAct": [
      {
        "characterName": "Eleanor Voss",
        "behaviour": "show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted."
      },
      {
        "characterName": "Dr. Mallory Finch",
        "behaviour": "show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted."
      },
      {
        "characterName": "Beatrice Quill",
        "behaviour": "show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted."
      }
    ],
    "redHerringPlacement": {
      "redHerringId": "rh_1",
      "placementDetail": "Eleanor mentions the clock showed the correct time at the moment of death, creating doubt about its tampering."
    },
    "emotionalRegister": "The discovery of Eleanor's body plunges the gathering into chaos and suspicion.",
    "dominantCharacterNote": {
      "name": "Eleanor Voss",
      "voiceRegister": "Eleanor speaks with a refined cadence, often using a light, musical laugh to charm those around her."
    },
    "humourGuidance": {
      "permission": "conditional",
      "character": "Beatrice Quill",
      "form": "sardonic",
      "condition": "if it fits Beatrice's sardonic nature"
    },
    "eraTextureNote": "Limited travel options due to fuel shortages and economic constraints.; Slow communication methods such as telegrams and letters.; Social events requiring strict adherence to etiquette and formality.; Weather conditions affecting outdoor activities and gatherings.; The isolation of country estates from urban centers.",
    "locationRegisterNote": "The study feels claustrophobic and charged with secrets, where every shadow seems to hold a whisper of betrayal. The air is thick with the scent of old books and the weight of unspoken accusations, creating a space fraught with tension. — Entering this room, a writer senses the gravity of the moment, where every detail could unravel the mystery or conceal it further."
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
□ Chapter 2: "The clock's time contradicts the timeline of events." is placed in the first 25% of the chapter, followed by an explicit inference or suspicion paragraph.
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
