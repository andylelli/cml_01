# Actual Prompt Record

- Run ID: `mystery-1779464408528`
- Project ID: ``
- Timestamp: `2026-05-22T16:02:49.931Z`
- Agent: `Agent9-ProseGenerator-Ch2`
- Operation: `chat_request_full_prompt`
- Model: `GPT-4o-mini`
- Temperature: `0.42`
- Max Tokens: `4500`
- Attempt: `first`
- Prompt Hash: `6c17112300a692dd`

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
- MORAL COMPLEXITY REQUIREMENT: The mechanism of this crime carries a moral gray area: "The murderer acted out of desperation to protect a loved one, raising questions about the morality of their actions." — the culprit reveal and denouement MUST acknowledge this ambiguity. Do not let the ending feel clean or simple. Give the reader at least one moment of uncomfortable sympathy or moral doubt.


⚠️ AMATEUR DETECTIVE STORY: The investigator is a civilian with no official standing. The official police (if they appear) are unnamed background figures only — "a constable", "the sergeant", "an officer from the village". Do NOT give any police official a name or title+surname combination. There is no Inspector [Surname], no Constable [Surname], no Sergeant [Surname] in this story.


CRITICAL CHARACTER CONSISTENCY RULES:

1. Each character has ONE canonical name. Use ONLY names from this list. Never vary, abbreviate, or add titles beyond what is listed.
   COMPLETE CAST (no other named characters exist): Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill
   - "Mr. Jennings entered the room" → ILLEGAL. Jennings is not in the cast.
   - "Constable Reed took notes" → ILLEGAL. Reed is not in the cast.
   - "A constable took notes" → LEGAL (no name given).

2. Character roles are fixed:
   - Eleanor Voss: Wealthy Patron
   - Dr. Mallory Finch: Respected Professional
   - Captain Ivor Hale: Honor-bound Veteran
   - Beatrice Quill: Ambitious Reporter
   - Never place characters in locations inconsistent with their role

WORLD DOCUMENT (use this as your primary creative context):

## Era: 1939-07
Living through July 1939 in England feels like teetering on the edge of uncertainty, as the specter of war looms ever closer. The atmosphere is thick with anticipation and anxiety, with families gathering in grand estates for social events while whispers of political unrest swirl in the air. The economic reality of the Great Depression still casts a long shadow over many, creating a palpable tension between the wealthy elite and the struggling working class. Daily life includes garden parties and cricket matches, but beneath the polished surface lies an undercurrent of fear and mistrust, especially as the threat of conflict across Europe becomes increasingly real. The elegance of summer fashion contrasts starkly with the growing unease, as people prepare for a future that feels increasingly uncertain.
Emotional register: The dominant emotional state is one of anxious anticipation, with a mix of hope and dread permeating daily life.
Physical constraints: Travel is limited due to fuel shortages and economic constraints. | Communications are often slow and unreliable, leading to misinformation. | Social gatherings are held under the watchful eyes of societal expectations.
Current tensions (weave into background texture): Heightened tensions in Europe as Germany continues its expansionist policies. | Debates in the British Parliament regarding military preparedness. | Increased public interest in the looming threat of World War II.
Wartime context — Many men are beginning to prepare for potential military service, while women are stepping into roles traditionally held by men.: The social fabric is shifting as women increasingly enter the workforce, challenging traditional gender roles. Absence effect: The looming absence of men who may soon be called to serve creates a palpable tension in both public and private spheres.

## Story Theme
The Clockwork Deception explores how hidden truths and personal ambitions can collide devastatingly in a world where appearances are paramount, and reveals that evidence carries ethical weight, forcing characters to choose accountability over social performance when appearances and facts collide.

## Story Emotional Register
Dominant: The emotional landscape of the story is one of tension and intrigue, underscored by the fragility of human relationships.

Arc:
The story opens on a dreary autumn evening at Little Middleton Manor, the atmosphere thick with anticipation as guests gather for an event. Eleanor Voss is found dead shortly after 11 PM, and the weight of this crime casts a long shadow over the proceedings. Initial investigations reveal a troubling timeline, marked by the tampered clock that suggests a deliberate misdirection. As Beatrice Quill delves deeper, the rising unease among the guests becomes palpable; each interaction is laced with suspicion. Early clues lead to false assumptions, particularly regarding Eleanor’s financial troubles and the secrets of those who knew her best.

A pivotal moment occurs when a witness claims to have heard Eleanor arguing at 11:05 PM, contradicting the clock's reading and forcing Beatrice to reassess the timeline of events. This revelation shifts the investigation's direction, hinting at deeper betrayals and hidden motives. As tensions mount, the pre-climax builds with confrontations and misdirection, leading to a dramatic showdown where the truth threatens to unravel the carefully constructed lives of the characters. In the climax, the final confrontation forces each character to face the emotional costs of their actions, culminating in a resolution that leaves lingering scars. The emotional weight of the resolution is felt deeply by all: Eleanor’s secrets are exposed, Mallory's reputation hangs by a thread, Ivor’s past haunts him, and Beatrice grapples with the consequences of her ambition. Ultimately, the story concludes with an unsettling sense of loss, highlighting the costs of deception and the fragility of trust.

## Emotional register at this point in the story
A sense of foreboding permeates the air as guests arrive, setting the stage for the impending tragedy.

## Character Portraits (appearance & era)

### Eleanor Voss
Eleanor Voss embodies the conflicting realities of the upper class during this summer of 1939. While she presents herself as a benevolent socialite, the threat of exposure regarding her financial misconduct forces her to navigate her dual life with anxiety. The specter of war and economic hardship looms over her, making her desperate to maintain her status even as her secrets threaten to unravel her carefully constructed world.
Era intersection: Her struggles with reputation and financial security resonate deeply against the backdrop of class tensions exacerbated by the Great Depression.

### Dr. Mallory Finch
Dr. Mallory Finch finds herself caught in the crosshairs of personal and professional turmoil during this pivotal moment in history. As a physician, she is expected to embody strength and integrity, yet her hidden addiction puts her at risk of losing everything she has worked for. The rising political tensions and discussions about women's roles in society heighten her sense of urgency to protect her reputation, even as she grapples with her inner demons.
Era intersection: Her battle against addiction is intensified by the societal expectations of women, who are being pushed into new roles as men prepare for potential conflict.

### Captain Ivor Hale
Captain Ivor Hale, a retired military officer, feels the weight of his past decisions bearing down on him as the threat of another war looms. His honorable reputation is threatened by the victim's knowledge of his wartime actions, forcing him to confront his guilt. The gathering storm in Europe mirrors his internal struggles, as he grapples with the fear of exposure and the potential fallout on his legacy.
Era intersection: His conflict highlights the moral dilemmas faced by men of his generation as they prepare for the possibility of another war, while balancing personal honor and the ghosts of their past.

### Beatrice Quill
Beatrice Quill stands at the precipice of her career as a journalist in this moment of societal upheaval. Her ambition drives her to excel in her field, yet her secret affair threatens to derail her aspirations. The growing tensions in Europe and the shifting roles of women fuel her determination to rise above societal expectations, even as the threat of scandal looms large, creating a delicate balancing act between ambition and morality.
Era intersection: Her fight for recognition as a female journalist during an era of changing gender norms underscores the challenges women face in asserting their independence amid rising societal pressures.

## Character Voices

### Eleanor Voss (she/her/her)
Eleanor speaks with a melodic lilt, often punctuating her sentences with laughter, crafting compliments that feel both genuine and veiled with disdain.
[comfortable] Oh darling, you must try the canapés—absolutely divine!
[evasive] I prefer to keep my affairs private, if you don’t mind.
[stressed] What if they find out? I can’t let that happen!
Humour: Eleanor's humour often carries a tone of polite savagery, making her comments both charming and biting.

### Dr. Mallory Finch (she/her/her)
Mallory’s speech is precise and deliberate, often punctuated by a dry wit that surfaces unexpectedly.
[comfortable] You really must consider the benefits of modern medicine.
[evasive] I assure you, my personal life is quite separate from my practice.
[stressed] I can’t believe this is happening; I need to keep my composure.
Humour: Her dry wit often adds an unexpected layer of levity to serious conversations.

### Captain Ivor Hale (he/him/his)
Ivor speaks with a deliberate cadence, often using military jargon, which can come off as brusque.
[comfortable] In my experience, discipline is key to success.
[evasive] It’s best not to dwell on the past.
[stressed] I cannot let anyone tarnish my reputation!
Humour: Ivor's bluntness can lead to unintentional humor in tense situations.

### Beatrice Quill (she/her/her)
Beatrice speaks with rapid-fire enthusiasm, often punctuating her sentences with laughter and sharp wit.
[comfortable] Isn’t it exciting? The stories we can uncover!
[evasive] Let’s focus on the facts, shall we?
[stressed] This could ruin everything I’ve worked for!
Humour: Beatrice's sardonic humor often reflects her sharp intellect and ambition.

## Location Registers (scene framing guides)

Grand Hall: In the Grand Hall, a sense of grandeur mingles with unease, as whispers of intrigue echo off the high ceilings. The dimly lit space feels both inviting and forbidding, where every conversation holds the weight of hidden agendas and unspoken truths. Guests navigate this opulent setting with a mix of awe and apprehension, aware that beneath its beauty lies a labyrinth of secrets.. Camera angle: As the writer enters this space, they should feel the tension that simmers just below the surface, capturing the interplay of light and shadow.. Era: The atmosphere is heightened by the looming threat of war, as the elite gather under one roof, unaware of the fractures within their society.

Library: The Library is a sanctuary of secrets, where the scent of old books mingles with the anticipation of discovery. Dust motes dance in the shafts of light, creating an atmosphere ripe for revelation. The stillness of the room belies the tension that lurks within, as characters seek answers amidst the whispers of the past.. Camera angle: Entering the Library feels like stepping into a world of possibilities and dangers, where every book may hold a key to the mystery.. Era: This space embodies the contrasts of the era, where knowledge is both a refuge and a reminder of the darker truths hidden within society.

Drawing Room: In the Drawing Room, the air is thick with the scent of polished wood and fresh flowers, yet beneath the surface lies a current of unease. The soft laughter and clinking glasses create a facade of camaraderie, but the tension among guests is palpable, as hidden motives and unspoken suspicions weave through their interactions.. Camera angle: As the writer enters, they should feel the duality of the space—both a gathering place for warmth and an arena for conflict.. Era: The opulence of the room contrasts starkly with the underlying societal issues, reflecting the facade of stability in a world on the brink of change.

Gardens: The Gardens are a deceptive haven, where vibrant blooms and manicured lawns conceal the turmoil brewing within the manor. The gentle rustle of leaves and distant birdsong provide a stark contrast to the dark secrets exchanged in the shadows. Each corner offers a potential hiding place for whispered conversations or clandestine meetings, heightening the sense of intrigue.. Camera angle: Entering the Gardens invites a sense of exploration and caution, as the writer captures the delicate balance between allure and danger.. Era: The idyllic setting serves as a backdrop for the tensions of the time, where beauty masks the fragility of relationships and the threat of exposure looms.

## Humour guidance for this story position (opening)
Permission: forbidden
Rationale: The opening scene's heavy atmosphere does not lend itself to humor.

FAIR-PLAY AND INFERENCE CONTRACT:
- FAIR PLAY CLUE TIMING: Never combine clue discovery and detective deduction in the same chapter. If a clue is first revealed to the reader in chapter N, the detective may only analyze, deduce from, or act on that clue in chapter N+1 or later.
- FAIR PLAY INFORMATION PARITY: The reader must see all clues BEFORE the detective uses them in reasoning. If the detective performs a test or makes a deduction, every piece of evidence supporting that conclusion must have been shown to the reader in earlier chapters.
- FAIR PLAY REVELATION SPACING: In the discriminating test scene, the detective can ONLY use clues that were revealed to the reader at least 1 full chapter earlier. Never introduce new clues or withheld information during the test.
- FAIR PLAY CONFRONTATION: During the final confrontation/revelation, the detective cannot surprise the reader with facts. Every piece of evidence cited must have been visible to the reader in prior chapters.
- Never solve by withheld information. Keep reader-information parity with detective reasoning.
- False assumption in force: Eleanor's death must have occurred before eleven o'clock.
- Hidden truth to progressively expose: The clock was tampered with to mislead investigators about the actual time of death.
- Inference path checkpoints to dramatize clearly (observation -> correction -> effect):
  - Step 1: obs: The clock in the study shows ten minutes past eleven but was last wound at a quarter past ten. | corr: This indicates that the clock was tampered with to mislead the time of death. | effect: Narrows the timeline of events leading to Eleanor's death.
  - Step 2: obs: Dust accumulation suggests the clock had not been touched in days prior, except for the tampering. | corr: No one had interfered with the clock until it was tampered with recently. | effect: Eliminates the possibility of accidental malfunction and indicates deliberate tampering.
  - Step 3: obs: Witnesses claim to have heard Eleanor arguing at 11:05 PM. | corr: This contradicts the clock's time and indicates the need to investigate further. | effect: Narrows the suspect pool based on the timeline discrepancy.
- Discriminating test method: trap
- Discriminating test design constraint: A staged confrontation occurs where Captain Hale's alibi is challenged in front of witnesses, revealing the clock's tampering.
- Test must rely on already-shown clue IDs: clue_1, clue_2, clue_3, clue_fp_contradiction_step_1
- Fair-play rationale: Step 1: The clock tampering evidence establishes a false timeline. Step 2: Witness statements about the argument provide a contradiction. Step 3: The confrontation reveals Hale's inconsistent account.

## Character Reference

### Eleanor Voss (she/her — NEVER he/him)
Eleanor speaks with a melodic lilt, often punctuating her sentences with laughter
She has a talent for crafting compliments that can feel both genuine and veiled with disdain, often making her listeners question whether they’ve been flattered or mocked.
Eleanor grapples with the duality of her existence: the desire to maintain her lavish lifestyle clashing with the guilt of her fraudulent actions. Each charitable event she hosts becomes a reminder of her deceit.

### Dr. Mallory Finch (she/her — NEVER he/him)
Mallory’s speech is precise and deliberate, often punctuated by a dry wit that surfaces unexpectedly
She has a tendency to use medical jargon even in casual conversation, which can alienate those who don’t share her background.
Mallory is deeply conflicted, torn between her desire to maintain her professional integrity and the shame of her addiction. Each day is a battle against the whispers of doubt and the fear of losing everything she has worked for.

### Captain Ivor Hale (he/him — NEVER she/her)
Ivor speaks with a deliberate cadence, often punctuating his sentences with a firm, authoritative tone
He has a habit of using military jargon, which can come off as brusque but is rooted in a desire for clarity.
Ivor is tormented by the choices he made during the war, grappling with the weight of responsibility for lives lost. Each day, he seeks redemption, yet the specter of his past looms large, threatening to consume him whole.

### Beatrice Quill (she/her — NEVER he/him)
Beatrice speaks with rapid-fire enthusiasm, often punctuating her sentences with laughter
Her dialogue is peppered with colloquialisms and a sharp wit that can catch others off guard.
Beatrice is torn between her ambition and the moral implications of her actions. The thrill of her affair is intoxicating, yet the fear of exposure looms larger than her desires.


## CHARACTER CONTRACTS (binding for this scene)
Each entry below constrains how this character must be written in this chapter.
These override generic style guidance when they conflict.

### Eleanor Voss[SHE]
Voice & mannerisms: Eleanor speaks with a melodic lilt, often punctuating her sentences with laughter. She has a talent for crafting compliments that can feel both genuine and veiled with disdain, often making her listeners question whether they’ve been flattered or mocked.
Sample voice fragments (match this register and rhythm):
  [comfortable] "Oh darling, you must try the canapés—absolutely divine!"
  [evasive] "I prefer to keep my affairs private, if you don’t mind."
Humour: polite savagery — deploy occasionally (level 0.6)
FORBIDDEN phrase (never write for Eleanor Voss): "she felt a wave of unease"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Eleanor stands to inherit a substantial estate and a controlling interest in local charities, which the victim threatened to expose. The stakes are not just financial; they are deeply intertwined with her identity as a socialite." — do not surface in Act I.

### Dr. Mallory Finch[SHE]
Voice & mannerisms: Mallory’s speech is precise and deliberate, often punctuated by a dry wit that surfaces unexpectedly. She has a tendency to use medical jargon even in casual conversation, which can alienate those who don’t share her background.
Sample voice fragments (match this register and rhythm):
  [comfortable] "You really must consider the benefits of modern medicine."
  [evasive] "I assure you, my personal life is quite separate from my practice."
Humour: dry wit — deploy occasionally (level 0.4)
FORBIDDEN phrase (never write for Dr. Mallory Finch): "a surge of determination washed over her"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "The victim threatened to expose her addiction, igniting a fierce anger within Mallory. The thought of her life’s work being dismantled by a single revelation is both terrifying and maddening." — do not surface in Act I.

### Captain Ivor Hale[HE]
Voice & mannerisms: Ivor speaks with a deliberate cadence, often punctuating his sentences with a firm, authoritative tone. He has a habit of using military jargon, which can come off as brusque but is rooted in a desire for clarity.
Sample voice fragments (match this register and rhythm):
  [comfortable] "In my experience, discipline is key to success."
  [evasive] "It’s best not to dwell on the past."
Humour: blunt — deploy rarely (level 0.3)
FORBIDDEN phrase (never write for Captain Ivor Hale): "she chose her words with great care"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "The victim’s threat to reveal his past compels Ivor to consider drastic measures. The thought of his honorable reputation being tarnished is unbearable, forcing him to confront the darker aspects of his legacy." — do not surface in Act I.

### Beatrice Quill[SHE]
Voice & mannerisms: Beatrice speaks with rapid-fire enthusiasm, often punctuating her sentences with laughter. Her dialogue is peppered with colloquialisms and a sharp wit that can catch others off guard.
Sample voice fragments (match this register and rhythm):
  [comfortable] "Isn’t it exciting? The stories we can uncover!"
  [evasive] "Let’s focus on the facts, shall we?"
Humour: sardonic — deploy frequently (level 0.7)
FORBIDDEN phrase (never write for Beatrice Quill): "palpable tension filled the room"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "The victim's threat to reveal her affair ignites a fierce urgency within Beatrice to protect her reputation and career." — do not surface in Act I.



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
A sprawling manor house steeped in opulence, concealing dark secrets within its walls.

Key Locations Available:
- Grand Hall (interior): Gathering space
- Library (interior): Clue discovery
- Drawing Room (interior): Social gatherings
- Gardens (exterior): Secluded areas for discreet movement

Atmosphere (tonal cue only — do NOT reproduce this phrase verbatim in prose; translate into scene-specific, character-observed sensory language): Tense and foreboding, with an underlying sense of mistrust among the inhabitants.
Weather: Overcast with intermittent rain, typical of a dreary English autumn.

Era markers: petrol touring cars on gravel roads | typewriters in the study | domestic wiring with frequent outages

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
Grand Hall (interior):
  - Visual: flickering gas lamps, portraits of ancestors, polished mahogany furniture
  - Sounds: echoing footsteps, whispers of conversation, the ticking of clocks
  - Scents: damp stone and old leather, polished wood, scent of rain
  - Touch: cool marble banister, worn carpet underfoot

Library (interior):
  - Visual: dusty tomes lining shelves, faded leather-bound books, ornate fireplace surrounded by armchairs
  - Sounds: pages turning, soft rustling of paper, crackling of firewood
  - Scents: old paper and ink, smoky wood, dust motes in sunlight
  - Touch: worn leather armchair, cool marble fireplace surround

Drawing Room (interior):
  - Visual: plush velvet upholstery, intricate woodwork on furniture, large bay windows overlooking gardens
  - Sounds: clinking of glasses, soft laughter, the rustle of dresses
  - Scents: cologne and perfume, fresh flowers, scent of polished wood
  - Touch: soft velvet cushions, cool glass of a drink

⛔ REFERENCE DATA — DO NOT TRANSCRIBE VERBATIM: The above profiles are structural guides only. Generate original prose that evokes these qualities; do not reproduce the exact phrasing or sentence structure of the profile paragraphs.

SCENE OPENING RULE: When opening a scene in a new location, write what the POV character directly observes and physically senses at that moment — not a general description of the room's qualities. The reader must feel present, not briefed. Sensory details must be observed by the character, not stated as fact about the place.

SENSORY WRITING TECHNIQUES:
- Opening paragraphs: Lead with 2-3 sensory details to ground the scene
- Movement between locations: Note sensory changes (quiet study → noisy dining room)
- Emotional scenes: Use sensory details to reinforce mood (cold rain during argument)
- Period authenticity: Use period-specific sensory details from location/temporal profiles
- Avoid: Over-reliance on visual only; use sound, smell, touch, temperature

CHAPTER SENSORY PALETTE HINTS (evoke these qualities without copying verbatim):
  Chapter 2 palette — afternoon, overcast, tense mood [location: Drawing Room]:
    • flat ligh
[truncated for prompt budget]

## Texture Pool
Draw on these as opportunities arise — you are not required to use them.

- Living through July 1939 in England feels like teetering on the edge of uncertainty, as the specter of war looms ever closer
- The atmosphere is thick with anticipation and anxiety, with families gathering in grand estates for social events while whispers of political unrest swirl in the air
- The economic reality of the Great Depression still casts a long shadow over many, creating a palpable tension between the wealthy elite and the struggling working class
- Daily life includes garden parties and cricket matches, but beneath the polished surface lies an undercurrent of fear and mistrust, especially as the threat of conflict across Europe becomes increasingly real
- The elegance of summer fashion contrasts starkly with the growing unease, as people prepare for a future that feels increasingly uncertain.

TEMPORAL CONTEXT:

This story takes place in July 1939 during summer.

Seasonal Atmosphere:
- Weather patterns: Warm temperatures typical of English summer, Intermittent showers, Overcast skies with occasional sunny breaks
- Daylight: Long summer days with daylight extending until around nine o'clock in the evening, creating a sense of lingering warmth.
- Seasonal activities: Garden parties and picnics in the expansive grounds, Outdoor cricket matches, Horse racing events at nearby tracks
- Seasonal occasions: 15th July - St. Swithin's Day, traditionally believed to predict the weather for the next forty days
- Season: summer

Period Fashion (describe naturally):
- Men formal: Lightweight linen suits in pastel colors, Short-sleeved dress shirts, Straw boater hats
- Men casual: Cotton tweed trousers, Polo shirts, Faded canvas shoes
- Men accessories: Leather belts with simple buckles, Pocket watches, Silk ties with geometric patterns
- Women formal: Tea-length floral dresses with fitted waists, Short-sleeved blouses with puffed sleeves, Wide-brimmed straw hats adorned with ribbons
- Women casual: Light cotton skirts, Button-up blouses with decorative collars, Flat sandals
- Women accessories: Delicate pearl necklaces, Bespoke handbags, Light shawls for cooler evenings

Cultural Context (reference naturally):
- Music/entertainment: 'In the Mood' by Glenn Miller, 'Ain't She Sweet' by Milton Ager, 'The Lady is a Tramp' by Richard Rodgers; Films: 'The Wizard of Oz', 'Gone with the Wind'; Theatre: 'The Glass Menagerie' by Tennessee Williams, 'The King and I'; Radio: BBC broadcasts of news programming, Popular comedy shows like 'ITMA'
- Typical prices: Loaf of bread: four pence, Movie ticket: one shilling, Pint of milk: three pence
- Current events: Heightened tensions in Europe as Germany continues its expansionist policies; Debates in the British Parliament regarding military preparedness
- Literature: 'The Grapes of Wrath' by John Steinbeck | 'The Maltese Falcon' by Dashiell Hammett | 'The Heart is a Lonely Hunter' by Carson McCullers | [Mystery and detective fiction] | [Social realism] | [Historical novels]
- Technology: The automatic telephone exchange | The first commercially available television sets | Advancements in radio technology | Typewriters in offices | Petrol-powered vehicles | Electric refrigerators in middle-class homes
- Daily life: Hosting afternoon teas, Participating in community fairs, Engaging in lawn sports like croquet
- Social rituals: Sunday family gatherings, Evening strolls in the local park, Participating in local church events

Atmospheric Details:
The scent of freshly cut grass mingles with the damp earth after a brief rain, creating an invigorating yet somber aroma. The distant sound of laughter from a garden party contrasts starkly with the mounting political tensions of the time. The oppressive humidity of the evening wraps around the estate, heightening a sense of anticipation and unease among the inhabitants.

FASHION INTEGRATION TECHNIQUES:
- First appearance: Describe outfit to establish class/personality
- Accessories: Gloves, hats, pocket watches, jewelry reveal status
- Time-specific: Different outfits for different times of day
- Character traits: Fastidious dresser vs rumpled appearance
- Action integration: "She tugged at her glove" or "He adjusted his tie"
- Weather appropr
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

• [clue_1] Dust accumulation suggests the clock had not been touched in days prior, except for the tampering.
  Category: temporal | Criticality: essential | Supports inference step 1
  Points to: This indicates recent tampering.

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

CLUES ALREADY REVEALED TO READER: clue_mechanism_visibility_core — do not reveal these as new information.

INVESTIGATION LOG — WHAT IS ESTABLISHED (do not re-establish, do not repeat):
• Evidence in reader's hands: The clock in the study shows ten minutes past eleven but was last wound at a quarter past ten.
• Suspects still unresolved: Dr. Mallory Finch[SHE]
⚠ The story must move FORWARD from this log. Any beat already listed above is forbidden from repeating.

⚠ THIS CHAPTER'S REQUIRED ADVANCE (opening): Discover the body, confirm the victim, establish the scene. The victim is found dead. They do not speak, react, or gesture. This is their only physical appearance — in all subsequent chapters they exist only in past tense (memory, evidence, testimony).

CONTINUITY HANDOFF — previous chapter closing beat:
  • "As they began to piece together the events of the previous night, Beatrice felt a sense of urgency wash over her. The clock's hands may have stopped, but the investigation was just beginning. She would not rest until she uncovered the truth behind Eleanor Voss..."
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
  Events: As Beatrice approached the body, her gaze was drawn to the clock on the mantelpiece, its hands frozen in time.

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
Known location profile anchors: Little Middleton Manor, Grand Hall, Library, Drawing Room, Gardens, the drawing room of Captain Hale's house
LOCATION NAME CAPITALISATION (HARD REQUIREMENT — validated):
All named locations in your prose MUST use the EXACT capitalisation from the CML profiles.
Canonical forms: "Little Middleton Manor", "Grand Hall", "Library", "Drawing Room", "Gardens", "the drawing room of Captain Hale's house"
Writing a location in lowercase (e.g. "drawing room" instead of "Drawing Room") is a validated error. Every time you mention a named location, copy its capitalisation from the list above.
- Chapter 2: OPENING STYLE (HARD): Start the VERY FIRST SENTENCE with spoken dialogue — e.g. '"[words]," [Name] said/asked/replied/murmured.' The opening quote must be the first character on the line. Anchor opening in "the drawing room of Captain Hale's house". HARD REQUIREMENT for the first 2 paragraphs: (a) include 2+ sensory words — choose from smell/scent/sound/echo/silence/creak/whisper/cold/warm/damp/rough/smooth/glow/shadow/flicker/dim — and (b) include 1+ atmosphere/time word — choose from rain/wind/fog/storm/mist/thunder/evening/morning/night/dawn/dusk/season/afternoon/midday/noon/midnight/twilight/sunrise/sunset/daylight/sunlight/overcast/cloudy/bright/dark. These are validated requirements, not style suggestions; missing them triggers a retry.

[⚠ INTERNAL QUALITY DIAGNOSTICS — DO NOT REPRODUCE ANY PART OF THIS SECTION IN YOUR STORY OUTPUT. These are private generator observations for your consideration only. Your narrative must read as if this section does not exist. Never include phrases from this block in character dialogue, narration, or description.]

PRIOR CHAPTER QUALITY OBSERVATIONS:
- Chapter 1 (score 97/100):
  Quality gaps noted: word density below preferred target (936/1000)
  Address in upcoming chapters: Increase chapter density with concrete investigation action and sensory-grounded beats; avoid recap-only padding.
[END INTERNAL DIAGNOSTICS]

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
   WRONG: \"I have no alibi,\" Voss said. He turned away. (if Voss is femal
[truncated for prompt budget]

PROMPT BUDGET SUMMARY: budget=32000 tokens; fixed=7154; context=11495; dropped=[none]; truncated=[location_profiles, temporal_context, pronoun_accuracy]

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
4. Integrate at least two concrete era-grounded details per chapter from setting refinement signals: petrol touring cars on county roads | domestic wiring with frequent outages | typewriters standard in offices | party-line telephone exchanges common | telegrams sent via nearest town office | airmail available for urgent correspondence.
5. Respect setting movement/access constraints in scene action and alibis: manor's architecture creates numerous hidden passageways | gardens and woodlands provide secluded areas for discreet movement | interior layout includes locked rooms and restricted areas | access to certain areas of the house restricted to staff only | gates monitored by estate guards during evening hours.
6. Sustain social coherence with this backdrop pressure: A mechanical clock-tampering incident during a tense family gathering at the estate exposes class tensions and personal loyalties amidst the backdrop of the Great Depression.
7. Maintain continuity around these socially central cast anchors where relevant: Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill.
8. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Critical: Plot similarity 0.75 with 'The Mysterious Affair at Styles' (same era and poisoning method)
9. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Moderate: Character similarity 0.65 with 'The Sign of the Four' (similar cast structure and roles)
10. STORY TO DATE ANTI-COPY RULE: The STORY TO DATE section below is provided for chronological and factual reference ONLY. You MUST NOT copy, lightly rephrase, or structurally echo any sentence or paragraph from prior chapters. Every sentence in this chapter must be original prose unique to this scene. Reusing even a clause from prior chapter text will cause this attempt to fail immediately.

CRITICAL PROSE REQUIREMENTS:

The CML specifies exact requirements for certain validation-critical scenes. You MUST include these elements at the specified positions.

**Discriminating Test Scene (Act 3, Scene 4):**
Required elements: Execute the discriminating test, Observe the culprit's reaction or result, Draw conclusion about guilt
Test type: trap

**Suspect Clearance Scenes:**
- Dr. Mallory Finch (Act 3, Scene 5): Finds an alibi supported by other guests.
  Clues: clue_id_1, clue_id_2
- Eleanor Voss (Act 3, Scene 5): Alibi confirmed: 10:30 PM to 11:30 PM

**Culprit Revelation Scene (Act 3, Scene 6):**
Method: Confrontation with evidence

**Clue Placement for These Chapters:**
- clue_1 must appear in Act 1, Scene 2 via Direct observation

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
- Chapter 2:
  - STRUCTURAL ARCHETYPE — Chapter 2 must be: FIRST_CONTACT
      ✓ MUST contain: at least two suspect interviews
      ✗ MUST NOT contain: physical evidence discovery
  - Word count: Target 1250 words. Achieve this through plot events, dialogue exchanges, and physical investigation — not through atmospheric repetition or extended internal reflection. Each 200-word segment should contain at minimum one concrete story event (a discovery, a conversation exchange, a physical action or movement). Padding with atmosphere alone is not acceptable.
  - Opening: Begin with a character action, spoken line, or clock/time marker — never a location name or location-description phrase.
  - Scene is set in: the drawing room of Captain Hale's house — reference it naturally within the paragraph, never as your opening phrase.
  - Opening atmosphere (MANDATORY — validator enforced): the first paragraph MUST contain at least one of: rain / wind / fog / storm / mist / thunder / evening / morning / night / dawn / dusk / season / afternoon / midday / noon / midnight / twilight / sunrise / sunset / daylight / sunlight / overcast / cloudy / bright / dark / grey / pale / cold / warm / chill / crisp / damp / drizzle / haze / lamplight / firelight. A chapter that omits all of these from its opening paragraph will be rejected.
  - Continuity bridge: in the first 120 words, visibly connect from the previous chapter's final beat. Carry forward one unresolved element (object, accusation, emotional pressure, or immediate physical action) from: "As they began to piece together the events of the previous night, Beatrice felt a sense of urgency wash over her. The clock's hands may have stopped, but the investigation was just beginning. She would not rest until she...".
  - CLUE OBLIGATIONS — mandatory prose elements (do NOT omit or bury):
    • Dust accumulation suggests the clock had not been touched in days prior, except for the tampering. [clue_1] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: This indicates recent tampering.
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
  - ALIBI LOCK: Captain Ivor Hale's established alibi is "11:00 PM to 11:30 PM". Do NOT place Captain Ivor Hale at any other location or in any other activity during the crime window. Any contradiction is a continuity error that triggers a retry.
  - TESTIMONY CONTINUITY: Captain Ivor Hale has already made statements in earlier chapters. Any time, location, or claim attributed to Captain Ivor Hale in THIS chapter must be consistent with those earlier statements. Do NOT introduce a new or different alibi claim — any contradiction is a continuity error.
  - Sensory obligation — use at least two of: flat light dimming the colors, the stillness of the room | silence punctuated by distant laughter, the creak of a chair | scent of polished wood. Mood: tense.
- Locked fact phrase obligations:
  - If this batch mentions The exact time shown on the stopped clock face, write exactly: "ten minutes past eleven".
  - If this batch mentions The exact amount the clock was wound back, write exactly: "forty minutes".
- Seasonal vocabulary allow-list: summer, summery, midsummer.
- Forbidden seasonal words: spring, autumn, winter.

⛔ PRONOUN TABLE — re-check after EVERY paragraph before writing the next:
    Eleanor Voss: she/her/her
    Dr. Mallory Finch: she/her/her
    Captain Ivor Hale: he/him/his
    Beatrice Quill: she/her/her
  Any sentence containing a pronoun must agree with this table. Correct mismatches before moving on.

FROZEN FACT STATE (DO NOT ALTER):
- Timeline anchor: July (summer).
- Month, season, weather, and time-of-year language in this batch must stay compatible with summer.
- Established timeline fact: Eleanor's last seen time
- Established timeline fact: Clock stop time
- If referenced, use exact phrase: "ten minutes past eleven" (The exact time shown on the stopped clock face).
- If referenced, use exact phrase: "forty minutes" (The exact amount the clock was wound back).

STORY TO DATE (REFERENCE ONLY — DO NOT COPY VERBATIM):
- Full prior chapter text is provided below for continuity, factual consistency, and reference accuracy.
- Use this to keep character voice, chronology, clue state, and location continuity aligned with earlier chapters.
- Do not quote, copy, or paraphrase these paragraphs too closely; write fresh prose that remains consistent with them.

--- BEGIN PRIOR CHAPTER 1 ---
Title: Chapter 1: Discovery
The morning light filtered through the heavy curtains of the study of Captain Hale's house, revealing a scene of chaos that belied the tranquil summer outside. Beatrice Quill stepped cautiously into the room, her heels echoing softly against the polished wooden floor. The air was thick with a dampness that clung to her skin, a remnant of the rain that had fallen overnight. Her heart raced as she took in the disarray: papers strewn across the desk, a chair overturned, and the unmistakable sight that sent a chill down her spine—Eleanor Voss lay sprawled on the floor, lifeless and pale. Beatrice's breath caught in her throat, and she felt the weight of the moment settle heavily upon her. This was not merely a tragedy; it was a mystery waiting to be unraveled.

As Beatrice approached the body, her gaze was drawn to the clock on the mantelpiece, its hands frozen in time. The clock showed ten minutes past eleven but was last wound at a quarter past ten. The discrepancy sent a jolt of realization through her. This clock had been tampered with, and the implications were staggering. How could Eleanor have died after the clock had stopped? Beatrice's mind raced, piecing together the fragments of a puzzle that was already beginning to take shape. The clock, once a mere timekeeper, now stood as a silent witness to a crime, a potential instrument of deception that could shift the blame onto anyone who had been in the room.

The study was a stark contrast to the chaos it contained. Beatrice noticed the faint scent of lavender lingering in the air, a remnant of Eleanor's favorite perfume. It felt surreal, as if the essence of the woman still clung to the room, even in death. Beatrice knelt beside Eleanor, her heart heavy with the weight of the moment. She could see the delicate handkerchief clutched in Eleanor's fingers, its embroidered edges frayed from the tension of the last moments of her life. Beatrice's mind swirled with questions—who had been here? What had transpired in this room? And most importantly, who stood to gain from Eleanor's demise?

the captain Hale entered the study, his expression grave as he took in the scene before him. The sight of Eleanor's body struck her like a physical blow, and she swallowed hard, struggling to maintain her composure. "I should have been here sooner," he murmured, his voice barely above a whisper. Beatrice turned to her, her eyes narrowing slightly. "You were here last night, weren't you?" she asked, her tone probing. Ivor nodded, his brow furrowing with concern. "I left around eleven. I thought she was safe. I had no idea..." Her voice trailed off, and Beatrice could see the turmoil in her eyes. The alibi he offered was shaky at best, and she felt a flicker of suspicion ignite within her.

the doctor Finch arrived moments later, her demeanor professional yet tinged with an undercurrent of shock. She stepped into the room, her gaze immediately landing on Eleanor's body. "This is dreadful," she said, her voice steady but laced with emotion. "What happened here?" Beatrice gestured towards the clock, her expression serious. "The clock shows ten minutes past eleven, but it was last wound at a quarter past ten. That means Eleanor could not have died before then, and yet..." Her words hung in the air, heavy with implication. Mallory's eyes widened as she processed the information. "That changes everything," she said, her mind racing to consider the ramifications.

As they stood in the study, the tension in the room was palpable. Each of them had a stake in this tragic event, and Beatrice felt the weight of their shared responsibility. She had assumed the role of investigator, the burden of truth resting squarely on her shoulders. The clock's frozen hands seemed to mock them, a reminder that time was slipping away, and with it, the opportunity to uncover the truth. Beatrice took a deep breath, steeling herself for the task ahead. She would need to gather evidence, question the suspects, and piece together the events that had led to this moment. But first, she needed to establish the facts, to understand what had happened in this room before she could confront the darkness that lay ahead.

Beatrice's mind was a whirlwind of thoughts as she surveyed the room. The disarray spoke volumes, and she knew that every detail mattered. She stepped back, allowing her instincts to guide her. "We need to secure the area and ensure that no one leaves until we have answers," she instructed, her voice firm. Ivor nodded, his expression resolute. "I will make sure everyone is accounted for," she replied, his military training kicking in. Beatrice turned to Mallory, who was examining the body with a practiced eye. "What do you think?" Beatrice asked, her curiosity piqued. Mallory glanced up, her brow furrowed in concentration. "It's too early to say for certain, but I will need to conduct a thorough examination. There may be clues that can help us understand what happened here."

As they began to piece together the events of the previous night, Beatrice felt a sense of urgency wash over her. The clock's hands may have stopped, but the investigation was just beginning. She would not rest until she uncovered the truth behind Eleanor Voss's untimely death. The stakes were high, and the shadows of suspicion loomed large. Beatrice Quill was determined to shine a light on the darkness that had enveloped Little Middleton, and she would stop at nothing to find justice for the woman who had been silenced too soon.
--- END PRIOR CHAPTER 1 ---

[SCENE COMPLETENESS CONTRACTS — MANDATORY. Each contract below lists what you MUST enact in that chapter. Do not summarise or mention these labels in the prose — enact them organically.]
Chapter 2 (Act 1) completeness contract:
  PIVOT ELEMENT (MANDATORY — write this into the prose, shown not told): "The dust accumulation on the clock indicating it hasn't been touched."
  FACT ESTABLISHED (MANDATORY — reader must know this by chapter end): "Establishes that the clock had not been tampered with until recently."
  RED HERRING (MANDATORY — seed naturally, not flagged as false): [rh_1] Captain Hale mentions that Eleanor had a strict schedule, leading others to believe her death must have occurred before eleven.

# Case Overview
Title: The Clockwork Deception
Era: 1930s
Setting: Little Middleton, Yorkshire
Crime: murder (mechanical tampering)
Culprit: Captain Ivor Hale
False assumption: Eleanor's death must have occurred before eleven o'clock.
Cast: Eleanor Voss (she/her), Dr. Mallory Finch (she/her), Captain Ivor Hale (he/him), Beatrice Quill (she/her)

Setting Lock: Keep all scenes and descriptions consistent with the stated setting (Little Middleton, Yorkshire). Do not introduce a different location type. Do not invent an alternative estate name. The only permitted name for this property is "Little Middleton, Yorkshire" — any other estate name (e.g., "Caldwell Manor", "Ashwood Hall", or any invented proper name) is a continuity error that will be caught and rejected.

⛔ PRONOUN LOCK (verify every sentence before writing):
• Eleanor Voss — she/her/her (NEVER he/him)
• Dr. Mallory Finch — she/her/her (NEVER he/him)
• Captain Ivor Hale — he/him/his (NEVER she/her)
• Beatrice Quill — she/her/her (NEVER he/him)

Outline scenes:
[
  {
    "sceneNumber": 2,
    "act": 1,
    "title": "Initial Reactions",
    "setting": {
      "location": "the drawing room of Captain Hale's house",
      "timeOfDay": "Shortly after the discovery",
      "atmosphere": "Heavy with shock and uncertainty"
    },
    "characters": [
      "Beatrice Quill",
      "Captain Ivor Hale",
      "Dr. Mallory Finch",
      "Eleanor Voss"
    ],
    "purpose": "Establish the emotional state of the characters and their relationships.",
    "cluesRevealed": [
      "clue_1"
    ],
    "dramaticElements": {
      "conflict": "Tension among the characters as they grapple with the tragedy.",
      "tension": "Eleanor's presence raises suspicions.",
      "microMomentBeats": [
        "Captain Hale stares blankly at the clock, lost in thought."
      ]
    },
    "summary": "In the drawing room, the characters gather to process the shocking news of Eleanor's death. Beatrice Quill observes their reactions, noting the dust on the clock and the unease that fills the air.",
    "estimatedWordCount": 1800,
    "pivotElement": "The dust accumulation on the clock indicating it hasn't been touched.",
    "factEstablished": "Establishes that the clock had not been tampered with until recently.",
    "permittedBehavioursByAct": [
      {
        "characterName": "Beatrice Quill",
        "behaviour": "Show normal social behaviour; grief or confusion if appropriate."
      },
      {
        "characterName": "Captain Ivor Hale",
        "behaviour": "Show normal social behaviour; grief or confusion if appropriate."
      },
      {
        "characterName": "Dr. Mallory Finch",
        "behaviour": "Show normal social behaviour; grief or confusion if appropriate."
      },
      {
        "characterName": "Eleanor Voss",
        "behaviour": "Show normal social behaviour; grief or confusion if appropriate."
      }
    ],
    "redHerringPlacement": {
      "redHerringId": "rh_1",
      "placementDetail": "Captain Hale mentions that Eleanor had a strict schedule, leading others to believe her death must have occurred before eleven."
    },
    "emotionalRegister": "The discovery of Eleanor's body sparks immediate tension and suspicion among the guests.",
    "dominantCharacterNote": {
      "name": "Eleanor Voss",
      "voiceRegister": "Eleanor speaks with a melodic lilt, often punctuating her sentences with laughter, crafting compliments that feel both genuine and veiled with disdain."
    },
    "humourGuidance": {
      "permission": "permitted",
      "character": "Beatrice Quill",
      "form": "dry_wit"
    },
    "eraTextureNote": "Travel is limited due to fuel shortages and economic constraints.; Communications are often slow and unreliable, leading to misinformation.; Social gatherings are held under the watchful eyes of societal expectations.",
    "locationRegisterNote": ""
  }
]
```

## Message 3 (role=user)

```text
BEFORE SUBMITTING YOUR JSON — verify this checklist:
□ Each chapter reaches the hard floor of 450 words and aims for 1250 words or more.
□ If you mention locked evidence, you used the exact locked phrase verbatim.
□ Allowed seasonal words only: summer, summery, midsummer.
□ Forbidden seasonal words: spring, autumn, winter.
□ Chapter 2: "Dust accumulation suggests the clock had not been touched in days prior, except for the tampering." is placed in the first 25% of the chapter, followed by an explicit inference or suspicion paragraph.
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

## Message 4 (role=user)

```text
Attempt 6/6 — chapters 2 — 1 validation issue(s) to resolve:

═══ OTHER ERRORS (1) ═══
• getaddrinfo ENOTFOUND openai-ds1sweden.cognitiveservices.azure.com

═══ FINAL ATTEMPT — COMPLETE REBUILD REQUIRED ═══
This is attempt 6/6. All prior attempts failed. Do NOT reference or preserve any text from previous responses.
Write chapters 2 completely from scratch. Satisfy EVERY constraint listed above in a single pass.
CRITICAL — SENSORY GROUNDING GATE (checked by automated validator on this attempt):
  The chapter opening (first 2 paragraphs) MUST contain at least 2 words from this EXACT list — synonyms are NOT counted:
  smell / scent / odor / fragrance / sound / echo / silence / whisper / creak / cold / warm / damp / rough / smooth / glow / shadow / flicker / dim
  Example: "The cold of the hallway pressed against her cheeks. A whisper of candlelight flickered across the clock face."
  Two sensory words from the list above must appear within the first two paragraphs. Do NOT use synonyms (e.g. 'chill', 'murmur') — they are not counted.
CRITICAL — ATMOSPHERE/TIME GROUNDING GATE (checked by automated validator on this attempt):
  The chapter opening (first 2 paragraphs) MUST also contain at least 1 word from this EXACT list:
  rain / wind / fog / storm / mist / thunder / evening / morning / night / dawn / dusk / afternoon / midday / noon / midnight / twilight / sunrise / sunset / daylight / sunlight / overcast / cloudy / bright / grey / gray / dark / light / season
  Example: "Morning light filtered through the fog-draped windows." or "The night air carried the scent of damp earth."
  One word from this list must appear in paragraph 1 or paragraph 2. Synonyms (e.g. 'dusk-like', 'nighttime') are NOT counted.
Submit the full chapter JSON — do not return partial content or indicate you are continuing.

```
