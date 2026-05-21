# Actual Prompt Record

- Run ID: `mystery-1779309757663`
- Project ID: ``
- Timestamp: `2026-05-20T20:48:05.401Z`
- Agent: `Agent9-ProseGenerator-Ch3`
- Operation: `chat_request_full_prompt`
- Model: `GPT-4o-mini`
- Temperature: `0.42`
- Max Tokens: `4500`
- Attempt: `first`
- Prompt Hash: `07f563f4bf15d3a6`

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
- MORAL COMPLEXITY REQUIREMENT: The mechanism of this crime carries a moral gray area: "The murderer acted out of desperation to protect a loved one, which complicates the morality of their actions." — the culprit reveal and denouement MUST acknowledge this ambiguity. Do not let the ending feel clean or simple. Give the reader at least one moment of uncomfortable sympathy or moral doubt.


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

## Era: 1938-11
In November 1938, Britain finds itself at a crossroads, grappling with the political turmoil of Europe and the remnants of the Great Depression. The air is charged with unease as the shadow of fascism looms, complicating everyday life for the citizens. The chilly winds signal the onset of winter, and families are acutely aware of their financial burdens. Social events, such as Guy Fawkes Night, once filled with joy, now carry an undercurrent of anxiety. Daily life reflects these tensions, with the upper class struggling to maintain appearances while the working class fights for dignity amidst economic hardship. In this atmosphere, conversations are tinged with whispers of impending conflict and societal change.
Emotional register: A collective anxiety permeates society, as citizens navigate the complexities of an uncertain future.
Physical constraints: Limited communication due to the absence of modern technologies | Shortened daylight hours impacting social gatherings | Rainy weather hindering outdoor activities and movement | Societal expectations dictating formal attire for gatherings
Current tensions (weave into background texture): The rise of fascism in Europe and its implications for Britain | Economic hardships affecting families due to the Great Depression | Class disparities exacerbated by social expectations and pressures
Wartime context — The nation is not yet at war, but the military is preparing for potential conflict.: Communities are divided between those who support military action and those who advocate for peace. Absence effect: Families are beginning to feel the strain of loved ones potentially being called to serve.

## Story Theme
In a world where wealth can mask desperation, the quest for survival can lead to betrayal and murder, revealing hidden truths beneath polished facades, and reveals that evidence carries ethical weight, forcing characters to choose accountability over social performance when appearances and facts collide.

## Story Emotional Register
Dominant: The story carries an undertone of tension and betrayal, reflecting the precarious balance between appearances and reality.

Arc:
The atmosphere in Little Middleton Manor is heavy with anticipation as the guests gather for a will reading, their fates intertwined by Eleanor Voss's untimely death. As the investigation unfolds, the initial sense of camaraderie quickly gives way to an undercurrent of unease, with each character's hidden motives coming to light. The first investigative turn introduces clues that seem to mislead Beatrice Quill, the detective, as she grapples with her own emotional stakes in this case. A pivotal moment occurs when evidence reveals the clock has been tampered with, shifting the direction of the investigation and forcing Beatrice to reevaluate her assumptions. As she delves deeper, the weight of betrayal and desperation becomes palpable, culminating in a confrontation that reveals the true nature of the relationships at play. The climax brings a tense showdown, as the emotional toll on the characters reaches a breaking point. Ultimately, the resolution leaves each character changed — Eleanor's legacy is marred, Dr. Finch's professional integrity is tested, Hale's reputation is shattered, and Beatrice emerges with newfound clarity about her own desires. The ending carries a bittersweet note, as the characters reconcile their pasts while grappling with the uncertain future ahead.

The story opens: The gathering is filled with a sense of anticipation, masking the underlying tension between the guests. As the investigation takes shape: The investigation begins to unravel, revealing the characters' hidden motives. A first key turn arrives: A critical clue shifts the focus of the investigation, altering Beatrice's approach. At the mid-point of the story: The revelation of tampering deepens the mystery and complicates relationships.

A second pivot reshapes the course: The emotional stakes rise as characters confront their pasts and each other. As tension reaches its height: Tension mounts as the characters face the consequences of their actions. The climax brings the central question to a head: A confrontation reveals the murderer, shattering the facade of trust among the guests. In the final resolution: The aftermath leaves the characters grappling with loss and the weight of their choices.

Underpinning every turn is the story's central concern: In a world where wealth can mask desperation, the quest for survival can lead to betrayal and murder, revealing hidden truths beneath polished facades. This thread binds the individual emotional moments into a coherent journey.

The dominant register — The story carries an undertone of tension and betrayal, reflecting the precarious balance between appearances and reality. — colours the prose from first chapter to last, ensuring the reader feels the weight of each revelation as moral consequence rather than mere puzzle mechanics.

## Emotional register at this point in the story
The investigation begins to unravel, revealing the characters' hidden motives.

## Character Portraits (appearance & era)

### Eleanor Voss
Eleanor Voss embodies the grace of the upper class but conceals a desperate struggle against impending financial ruin. As a wealthy heiress, she feels the weight of societal expectations while grappling with fear of losing her family's estate. The economic climate makes her situation precarious, forcing her to navigate the fine line between maintaining her status and securing her future.
Era intersection: Eleanor's financial desperation is heightened by the Great Depression, making her social standing increasingly fragile.

### Dr. Mallory Finch
Dr. Mallory Finch is a dedicated physician whose compassion for her patients is complicated by her past with Eleanor. The pressures of the economic climate threaten her clinic's survival, only intensifying her emotional turmoil. As a woman in the medical field, she faces societal challenges that reflect the broader struggle of women seeking independence during this era.
Era intersection: The economic strain of the Great Depression forces Mallory to confront her financial vulnerabilities, complicating her professional integrity.

### Captain Ivor Hale
Captain Ivor Hale, a retired naval officer, grapples with the consequences of gambling debts that threaten his reputation and future. His connection to the estate offers a glimmer of hope for financial redemption, yet the rising economic tensions place him in a precarious position. As a man of honor, he must navigate the delicate balance between integrity and desperation.
Era intersection: Ivor's gambling woes are exacerbated by the economic climate, pushing him toward morally ambiguous choices as he seeks a way out.

### Beatrice Quill
Beatrice Quill is an aspiring writer, driven by her passion yet burdened by unrequited love for Eleanor. The societal pressures of the time challenge her aspirations, forcing her to navigate a world where reputation and vulnerability collide. As she seeks to express herself creatively, she must confront the fear of exposure amidst the rising tensions surrounding the murder.
Era intersection: Beatrice's artistic ambitions are hindered by the social expectations of women during the 1930s, complicating her desire for recognition.

## Character Voices

### Eleanor Voss (she/her/her)
Eleanor speaks with an elegant cadence, using flowery language that conveys her social standing.
[comfortable] Oh, darling, isn't it simply divine? The flowers are blooming just as they should.
[evasive] Perhaps it was just a minor disagreement, nothing to worry about.
[stressed] I can't bear the thought of losing everything. It's all slipping away.
Humour: Her polite savagery often surfaces in her observations of the social elite.

### Dr. Mallory Finch (she/her/her)
Dr. Finch's tone is calm and measured, often punctuated by thoughtful pauses.
[comfortable] Medicine is both an art and a science; we must approach it with care.
[evasive] I would rather not speculate on that; let's focus on what we know.
[stressed] This situation is precarious; we must tread carefully.
Humour: Her dry wit can surface unexpectedly, especially in conversations about mundane topics.

### Captain Ivor Hale (he/him/his)
Ivor's speech is direct and commanding, often marked by a bluntness that reflects his military background.
[comfortable] I've seen things on the seas that would make your hair stand on end.
[evasive] It's not wise to dwell on the past; we must look ahead.
[stressed] I can't afford to fail now; too much is riding on this.
Humour: His blunt humour often masks deeper insecurities about his current situation.

### Beatrice Quill (she/her/her)
Beatrice's voice is lively and animated, reflecting her creativity and youthful enthusiasm.
[comfortable] Imagine a world where anything is possible; that's where my stories take you!
[evasive] Oh, it’s just a little something I’m working on; nothing too serious.
[stressed] What if he finds out about my writings? It could ruin everything!
Humour: Her sardonic humour often shines through, particularly in her observations about social dynamics.

## Location Registers (scene framing guides)

Grand Entrance Hall: The Grand Entrance Hall feels both inviting and foreboding as guests gather, the weight of secrets hanging in the air.. Camera angle: A writer entering this space should feel the palpable tension of unspoken truths waiting to be revealed.. Era: The era's class distinctions are palpable here, as guests navigate their interactions.

Library: The library is a sanctuary of knowledge, yet the air is thick with suspicion and intrigue, as whispers of betrayal echo among the shelves.. Camera angle: A writer should approach this room with a sense of caution, aware of the secrets lurking within.. Era: The somber atmosphere reflects the weight of historical tensions affecting the characters.

Drawing Room: The drawing room buzzes with polite conversation, yet an undercurrent of tension simmers just beneath the surface, hinting at hidden agendas.. Camera angle: A writer should capture the contrasts of elegance and tension as characters navigate their interactions.. Era: Guests adhere to strict social norms, creating a facade of civility amidst brewing discord.

Formal Gardens: The gardens are a serene escape, yet the beauty belies the turmoil within the manor, creating a space for quiet reflection amidst chaos.. Camera angle: A writer entering this space should savor the contrast between tranquility and the scheming within the manor.. Era: The meticulously maintained gardens reflect the characters' attempts to maintain appearances in a turbulent world.

## Humour guidance for this story position (early)
Permission: permitted
Characters who may be funny: Dr. Mallory Finch
Permitted forms: dry_wit
Rationale: The initial stages of the investigation allow for some levity amidst the tension.

## Reveal Groundwork (texture — do not explain, only plant)
- Plant one subtle observable beat related to: "The discovery of the clock's tampering retroactively colors the earlier interactions among the characters, revealing their motivations hidden behind their facades". Do not explain significance yet.
- Plant one subtle observable beat related to: "The initial conflicting witness accounts are , showing how they were manipulated to mislead the investigation". Do not explain significance yet.
- Plant one subtle observable beat related to: "Plant one subtle anomaly that can be re-read after the resolution.". Do not explain significance yet.

FAIR-PLAY AND INFERENCE CONTRACT:
- FAIR PLAY CLUE TIMING: Never combine clue discovery and detective deduction in the same chapter. If a clue is first revealed to the reader in chapter N, the detective may only analyze, deduce from, or act on that clue in chapter N+1 or later.
- FAIR PLAY INFORMATION PARITY: The reader must see all clues BEFORE the detective uses them in reasoning. If the detective performs a test or makes a deduction, every piece of evidence supporting that conclusion must have been shown to the reader in earlier chapters.
- FAIR PLAY REVELATION SPACING: In the discriminating test scene, the detective can ONLY use clues that were revealed to the reader at least 1 full chapter earlier. Never introduce new clues or withheld information during the test.
- FAIR PLAY CONFRONTATION: During the final confrontation/revelation, the detective cannot surprise the reader with facts. Every piece of evidence cited must have been visible to the reader in prior chapters.
- Never solve by withheld information. Keep reader-information parity with detective reasoning.
- False assumption in force: The murder happened when the clock showed ten minutes past eleven.
- Hidden truth to progressively expose: The actual time of death is significantly later than the time indicated by the clock.
- Inference path checkpoints to dramatize clearly (observation -> correction -> effect):
  - Step 1: obs: The clock in the library shows ten minutes past eleven. | corr: The clock could have been tampered to show a false time. | effect: Narrows the timeline for when the murder could have occurred.
  - Step 2: obs: Witnesses recall hearing an argument before the murder. | corr: The argument must have occurred later than the time shown on the clock. | effect: Narrows the opportunity for suspects to commit the murder.
  - Step 3: obs: Footprints are found leading from the library to the garden. | corr: The footprints indicate someone left the library around the time of the argument. | effect: Eliminates Dr. Mallory Finch as the murderer since she was seen in the kitchen.
- Discriminating test method: trap
- Discriminating test design constraint: A comparison of the clock's internal mechanism with witness statements about the argument timing reveals the tampering.
- Test must rely on already-shown clue IDs: clue_1, clue_2, clue_3, clue_core_contradiction_chain, clue_4
- Fair-play rationale: Step 1: The clock's time (early) and witness statements (mid) reveal the false timeline. Step 2: Footprints in the garden (mid) eliminate Dr. Finch. Step 3: The clock's mechanism (discriminating test) proves Captain Hale's guilt.

## Character Reference

### Eleanor Voss (she/her — NEVER he/him)
Eleanor speaks with an elegant cadence, often using flowery language that reflects her social standing
Her laughter is genuine but occasionally conceals a sharp wit, especially when discussing the shortcomings of her peers.
Eleanor grapples with her reliance on family wealth, feeling a moral tug-of-war between her desire for independence and the fear of losing her privileged lifestyle. This internal struggle leaves her feeling hollow and unfulfilled.

### Dr. Mallory Finch (she/her — NEVER he/him)
Finch speaks in a calm, measured tone, often punctuating her sentences with thoughtful pauses
She has a tendency to use medical terminology casually, which can lead to unintentionally humorous moments when she discusses mundane topics.
Dr. Finch is torn between her feelings of betrayal over the victim's actions and her professional ethics. The emotional weight of their past relationship complicates her judgment, leaving her feeling conflicted about her role in the investigation.

### Captain Ivor Hale (he/him — NEVER she/her)
Ivor speaks with a commanding presence, often using short, clipped sentences
His dialogue is straightforward, with little room for fluff, and he has a tendency to punctuate his points with a dry chuckle that belies the gravity of his situation.
Ivor is torn between his desire for redemption and the temptations of his vices. The gambling debts weigh heavily on his conscience, creating a moral struggle that threatens to consume him.

### Beatrice Quill (she/her — NEVER he/him)
Beatrice speaks with a lively cadence, often punctuating her sentences with dramatic flair
She has a tendency to exaggerate for effect, giving her dialogue a theatrical quality that reflects her writerly aspirations.
Beatrice is caught in a whirlwind of emotions, torn between her unrequited love and the recognition that it may never be reciprocated. This internal struggle creates a tension that fuels her creativity but also leads to self-doubt.


## CHARACTER CONTRACTS (binding for this scene)
Each entry below constrains how this character must be written in this chapter.
These override generic style guidance when they conflict.

### Eleanor Voss[SHE]
Voice & mannerisms: Eleanor speaks with an elegant cadence, often using flowery language that reflects her social standing. Her laughter is genuine but occasionally conceals a sharp wit, especially when discussing the shortcomings of her peers.
Sample voice fragments (match this register and rhythm):
  [comfortable] "Oh, darling, isn't it simply divine? The flowers are blooming just as they should."
  [evasive] "Perhaps it was just a minor disagreement, nothing to worry about."
Humour: polite savagery — deploy occasionally (level 0.6)
FORBIDDEN phrase (never write for Eleanor Voss): "she felt a wave of unease"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Eleanor's motive is rooted in her desperation to secure her financial future, as the estate's decline could lead to her social downfall. The loss of her status and lifestyle is a haunting specter that drives her actions." — do not surface in Act I.

### Dr. Mallory Finch[SHE]
Voice & mannerisms: Dr. Finch speaks in a calm, measured tone, often punctuating her sentences with thoughtful pauses. She has a tendency to use medical terminology casually, which can lead to unintentionally humorous moments when she discusses mundane topics.
Sample voice fragments (match this register and rhythm):
  [comfortable] "Medicine is both an art and a science; we must approach it with care."
  [evasive] "I would rather not speculate on that; let's focus on what we know."
Humour: dry wit — deploy occasionally (level 0.4)
FORBIDDEN phrase (never write for Dr. Mallory Finch): "a surge of determination washed over her"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "The victim's plans to cut her out of the estate's medical stipend threaten her clinic's survival, creating a sense of urgency in her actions. This financial threat pushes her to consider how far she might go to protect her livelihood." — do not surface in Act I.

### Captain Ivor Hale[HE]
Voice & mannerisms: Ivor speaks with a commanding presence, often using short, clipped sentences. His dialogue is straightforward, with little room for fluff, and he has a tendency to punctuate his points with a dry chuckle that belies the gravity of his situation.
Sample voice fragments (match this register and rhythm):
  [comfortable] "I've seen things on the seas that would make your hair stand on end."
  [evasive] "It's not wise to dwell on the past; we must look ahead."
Humour: blunt — deploy occasionally (level 0.5)
FORBIDDEN phrase (never write for Captain Ivor Hale): "she chose her words with great care"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "The prospect of inheriting a sum from the victim's estate presents a tantalizing opportunity for Ivor. If he can manipulate the situation to his advantage, he might finally rid himself of his debts and restore his tarnished reputation." — do not surface in Act I.

### Beatrice Quill[SHE]
Voice & mannerisms: Beatrice speaks with a lively cadence, often punctuating her sentences with dramatic flair. She has a tendency to exaggerate for effect, giving her dialogue a theatrical quality that reflects her writerly aspirations.
Sample voice fragments (match this register and rhythm):
  [comfortable] "Imagine a world where anything is possible; that's where my stories take you!"
  [evasive] "Oh, it’s just a little something I’m working on; nothing too serious."
Humour: sardonic — deploy occasionally (level 0.5)
FORBIDDEN phrase (never write for Beatrice Quill): "palpable tension filled the room"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Feeling betrayed by the victim's indifference, Beatrice fears that he may speak out about her secret writings, which could ruin her reputation and aspirations as a writer." — do not surface in Act I.



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
A sprawling estate steeped in secrets, where the silence is heavy with unspoken truths and the shadows seem to whisper of betrayal.

Key Locations Available:
- Grand Entrance Hall (interior): Gathering space
- Library (interior): Clue discovery
- Drawing Room (interior): Social gathering space
- Formal Gardens (exterior): Isolation and reflection

Atmosphere (tonal cue only — do NOT reproduce this phrase verbatim in prose; translate into scene-specific, character-observed sensory language): Tense, as underlying social tensions and personal secrets come to the fore
Weather: Overcast with occasional rain, typical of a British summer

Era markers: Petrol-powered automobiles on gravel driveways | Early home telephones with party lines | Typewriters standard in offices | Formal tea service in drawing rooms | Concerns over fascism and political unrest in Europe

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
Grand Entrance Hall (interior):
  - Visual: Polished oak floors reflecting candlelight, Portraits of stern ancestors, Heavy velvet curtains framing tall windows
  - Sounds: Echoing footsteps on the wooden floor, The distant ticking of a clock, Soft whispers of guests arriving
  - Scents: Freshly polished wood, Hints of beeswax from candles, Moldy paper and leather from old books
  - Touch: Smooth marble banister, The chill of the air on bare skin

Library (interior):
  - Visual: Dark wood shelves filled with leather-bound volumes, Flickering candles casting shadows, A large globe spinning slowly on its axis
  - Sounds: The rustle of pages turning, The crackle of the fire in the hearth, Footsteps echoing on the wooden floor
  - Scents: The musty scent of old books, Burning wood from the fireplace, A hint of dust in the air
  - Touch: The smooth leather of the armchair, The cool surface of the desk

Drawing Room (interior):
  - Visual: Lavishly decorated with floral wallpaper, Plush sofas arranged around a coffee table, A grand piano gleaming in the corner
  - Sounds: The soft murmur of conversation, The delicate notes of piano music, The rustling of silk dresses
  - Scents: Fresh flowers in a vase, The scent of polished furniture, Hints of tobacco smoke
  - Touch: The softness of velvet upholstery, Coolness of porcelain teacups

⛔ REFERENCE DATA — DO NOT TRANSCRIBE VERBATIM: The above profiles are structural guides only. Generate original prose that evokes these qualities; do not reproduce the exact phrasing or sentence structure of the profile paragraphs.

SCENE OPENING RULE: When opening a scene in a new location, write what the POV character directly observes and physically senses at that moment — not a general description of the room's qualities. The reader must feel present, not briefed. Sensory details must be observed by the character, not stated as fact about the place.

SENSORY WRITING TECHNIQUES:
- Opening paragraphs: Lead with 2-3 sensory details to ground t
[truncated for prompt budget]

## Texture Pool
Draw on these as opportunities arise — you are not required to use them.

- In November 1938, Britain finds itself at a crossroads, grappling with the political turmoil of Europe and the remnants of the Great Depression
- The air is charged with unease as the shadow of fascism looms, complicating everyday life for the citizens
- The chilly winds signal the onset of winter, and families are acutely aware of their financial burdens
- Social events, such as Guy Fawkes Night, once filled with joy, now carry an undercurrent of anxiety
- Daily life reflects these tensions, with the upper class struggling to maintain appearances while the working class fights for dignity amidst economic hardship

TEMPORAL CONTEXT:

This story takes place in November 1938 during N/A.

Seasonal Atmosphere:
- Weather patterns: overcast skies, occasional rain, chilly winds
- Daylight: Days are short, with twilight settling by four-thirty in the afternoon.
- Seasonal activities: attending local bonfire celebrations, staying indoors with family games, reading by the fire
- Seasonal occasions: Guy Fawkes Night (November 5)
- Season: N/A

Period Fashion (describe naturally):
- Men formal: three-piece suits in dark tweed, crisp white dress shirts, bowler hats
- Men casual: knitted jumpers, corduroy trousers, woolen scarves
- Men accessories: silver pocket watches, leather gloves, tweed caps
- Women formal: tea-length dresses with fitted waists, tailored coats with large buttons, cloche hats
- Women casual: tweed skirts, sweaters with geometric patterns, ankle boots
- Women accessories: string of pearls, woolen gloves, handbags with chain straps

Cultural Context (reference naturally):
- Music/entertainment: 'Ain't She Sweet?' by Milton Ager, 'The Nearness of You' by Hoagy Carmichael, 'Minnie the Moocher' by Cab Calloway; Films: 'The Adventures of Robin Hood', 'Pygmalion'; Theatre: 'Blithe Spirit' by Noël Coward, 'The Mikado' by Gilbert and Sullivan; Radio: BBC radio dramas, music hall performances
- Typical prices: Loaf of bread: four pence, Cinema ticket: six pence, Monthly newspaper subscription: two shillings
- Current events: Munich Agreement and its fallout; Anti-Semitic policies gaining traction in Europe
- Literature: 'The Maltese Falcon' by Dashiell Hammett | 'The Glass Key' by Dashiell Hammett | 'The Big Sleep' by Raymond Chandler | [detective fiction] | [social realism] | [historical novels]
- Technology: the first practical jet engine | the rise of portable radios | advancements in film technology | home telephones | typewriters in offices | early electric refrigerators
- Daily life: attending local fairs and bonfires, engaging in knitting or sewing at home, gathering for communal meals
- Social rituals: afternoon tea with family, visiting neighbors for social calls, watching radio broadcasts together

Atmospheric Details:
The smell of damp earth mingles with the smoke from bonfires, a reminder of Guy Fawkes Night. A sense of foreboding hangs in the air as the wind rustles the autumn leaves, whispering secrets of the past. Candlelight flickers in the manor's drawing room, casting shadows that dance on the walls, where personal tensions are ready to erupt.

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
1. Date
[truncated for prompt budget]

NON-NEGOTIABLE CHAPTER OBLIGATIONS — LOCKED EVIDENCE PHRASES (VERBATIM REQUIRED):
The following physical evidence values are absolute ground truth. Every time this chapter describes, mentions, or alludes to the relevant evidence — no matter how briefly — it MUST use the exact phrase shown below, character for character. NO paraphrase, approximation, rounding, or synonym is permitted.

FAILURE EXAMPLE: if the locked value is "at thirteen minutes to midnight" and you write "just before midnight" or "around midnight" — that is a HARD FAIL. You must write "at thirteen minutes to midnight". Equally, if the locked value is written in words, such as "ten minutes past eleven", and you convert it to figure-based clock notation — that is also a HARD FAIL. Words stay as words; figure forms are forbidden for word-phrased facts.

CRITICAL — WORD-PHRASED VALUES: If the canonical value is written out in words (e.g. a time like "ten minutes past eleven", or an amount like "forty minutes"), reproduce those exact words. DO NOT convert to figure-based time notation, twenty-four-hour format, or any other numeric shorthand. Correct: "ten minutes past eleven". WRONG: figure-based clock notation or numeric shorthand.

Locked facts:
  - The exact time shown on the stopped clock face: "ten minutes past eleven"
    ⛔ FORBIDDEN alternatives: "11:10", "11.10", "eleven ten", "eleven-ten", "eleven past ten", "quarter past eleven", "half past eleven" — the ONLY acceptable form is "ten minutes past eleven"
  - The real time when the murder occurred: "fifty minutes past eleven"
    ⛔ FORBIDDEN alternatives: "11:50", "11.50", "eleven fifty", "eleven-fifty", "eleven past fifty", "quarter past eleven", "half past eleven" — the ONLY acceptable form is "fifty minutes past eleven"
  - The original scheduled time for the meeting that was tampered with: "a quarter past twelve"

If a locked fact has no relevance to this chapter, omit it. But the moment you reference the underlying evidence, only the exact phrase above is acceptable.

⛔ CLUES TO SURFACE IN THESE CHAPTERS — mandatory:
The following evidence MUST be clearly observable to an attentive reader. Do not bury it in atmosphere or passing dialogue. Each clue must be concrete, specific, and noticeable:

• [clue_1] The clock shows ten minutes past eleven.
  Category: temporal | Criticality: essential | Supports inference step 1
  Points to: Establishes a timeline for the events.

• [clue_fp_contradiction_step_1] The clock in the library shows ten minutes past eleven.
  Category: temporal | Criticality: essential | Supports inference step 1
  Points to: The clock could have been tampered to show a false time.

For each clue above: an attentive reader should be able to find, record, and later use it to reason toward the solution.

═══ NARRATIVE STATE (read-only — do not contradict) ═══

LOCKED FACTS — use verbatim whenever this evidence is described:
  • The exact time shown on the stopped clock face: "ten minutes past eleven"
  • The real time when the murder occurred: "fifty minutes past eleven"
  • The original scheduled time for the meeting that was tampered with: "a quarter past twelve"

CHARACTER PRONOUNS — never deviate from these:
  • Eleanor Voss: she/her/her
  • Dr. Mallory Finch: she/her/her
  • Captain Ivor Hale: he/him/his
  • Beatrice Quill: she/her/her

CLUES ALREADY REVEALED TO READER: clue_mechanism_visibility_core, clue_core_contradiction_chain — do not reveal these as new information.

INVESTIGATION LOG — WHAT IS ESTABLISHED (do not re-establish, do not repeat):
• Evidence in reader's hands: The clock in the minutes shows ten minutes past eleven. | Witnesses recall hearing an argument before the murder.
• Suspects still unresolved: Eleanor Voss[SHE], Dr. Mallory Finch[SHE], Beatrice Quill[SHE]
⚠ The story must move FORWARD from this log. Any beat already listed above is forbidden from repeating.

⚠ THIS CHAPTER'S REQUIRED ADVANCE (early): Interview each suspect — record their claimed whereabouts

CONTINUITY HANDOFF — previous chapter closing beat:
  • "Eleanor's gaze shifted back to the clock, her expression a mixture of confusion and determination. "We need to figure this out before anyone else arrives. If we don't, they might think..." Her voice trailed off, leaving the unspoken fear hanging in the air. Be..."
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
library, drawing room, manor

✓ RULE: Continue using this location vocabulary. Maintain consistency with established setting type.
✓ Do NOT introduce new location types that contradict earlier chapters.

**Recent Chapter Summary (for narrative continuity):**
Chapter 1: Chapter 1: Discovery
  Events: Beatrice Quill stepped into the library, the damp air wrapping around her like a heavy cloak.
Chapter 2: Chapter 2: Initial Reactions
  Events: The rain drummed against the windows, a relentless reminder of the chaos that had unfolded within the library.

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
Known location profile anchors: Little Middleton Manor, Grand Entrance Hall, Library, Drawing Room, Formal Gardens, the library
LOCATION NAME CAPITALISATION (HARD REQUIREMENT — validated):
All named locations in your prose MUST use the EXACT capitalisation from the CML profiles.
Canonical forms: "Little Middleton Manor", "Grand Entrance Hall", "Library", "Drawing Room", "Formal Gardens", "the library"
Writing a location in lowercase (e.g. "drawing room" instead of "Drawing Room") is a validated error. Every time you mention a named location, copy its capitalisation from the list above.
- Chapter 3: OPENING STYLE (HARD): Start the VERY FIRST SENTENCE with an explicit time marker — e.g. "That morning…" / "By the time dusk fell…" / "It was nearly four o'clock…" / "On the second day after the discovery…". Time must be in the first clause. Anchor opening in "the library". HARD REQUIREMENT for the first 2 paragraphs: (a) include 2+ sensory words — choose from smell/scent/sound/echo/silence/creak/whisper/cold/warm/damp/rough/smooth/glow/shadow/flicker/dim — and (b) include 1+ atmosphere/time word — choose from rain/wind/fog/storm/mist/thunder/evening/morning/night/dawn/dusk/season/afternoon/midday/noon/midnight/twilight/sunrise/sunset/daylight/sunlight/overcast/cloudy/bright/dark. These are validated requirements, not style suggestions; missing them triggers a retry.

[⚠ INTERNAL QUALITY DIAGNOSTICS — DO NOT REPRODUCE ANY PART OF THIS SECTION IN YOUR STORY OUTPUT. These are private generator observations for your consideration only. Your narrative must read as if this section does not exist. Never include phrases from this block in character dialogue, narration, or description.]

PRIOR CHAPTER QUALITY OBSERVATIONS:
- Chapter 1 (score 91/100):
  Quality gaps noted: word density below preferred target (736/1000)
  Address in upcoming chapters: Increase chapter density with concrete investigation action and sensory-grounded beats; avoid recap-only padding.
- Chapter 2 (score 90/100):
  Quality gaps noted: word density below preferred target (765/1000); scene grounding weakness
  Address in upcoming chapters: Increase chapter density with concrete investigation action and sensory-grounded beats; avoid recap-only padding. | Open next chapter with a named location anchor plus at least two sensory cues and one atmosphere marker.
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
   WRONG: \"I have no alibi,\" Finch said. He turned away. (if Finch is fem
[truncated for prompt budget]

PROMPT BUDGET SUMMARY: budget=32000 tokens; fixed=7914; context=11853; dropped=[none]; truncated=[location_profiles, temporal_context, pronoun_accuracy]

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

QUALITY GUIDELINES (strongly preferred):
1. Use only canonical cast names from CML. Do not invent titled placeholders like 'Detective Surname', 'Inspector Surname', 'a woman Surname', or 'a man Surname'.
2. Before the final reveal closes, include explicit suspect-elimination coverage: each non-culprit suspect is ruled out with concrete on-page evidence or confirmed alibi.
3. In the reveal sequence, include a complete culprit evidence chain using explicit reasoning connectors (because/therefore/proves).
4. Integrate at least two concrete era-grounded details per chapter from setting refinement signals: petrol-powered automobiles on gravel driveways | early home telephones with party lines | typewriters standard in offices | telegram services for rapid messaging | aerial mail services for urgent deliveries | local telephone exchanges for direct calls.
5. Respect setting movement/access constraints in scene action and alibis: manicured lawns and hedges restrict visibility from the outside | narrow corridors and staircases limit quick movement | weather conditions affecting outdoor access and evidence collection | restricted areas such as the library and study where sensitive discussions occur | daily routines of staff and residents dictate movement patterns.
6. Sustain social coherence with this backdrop pressure: A gathering at the manor for a wealthy benefactor's will reading brings together a diverse group, all under economic strain and social scrutiny, revealing tensions that could lead to murder.
7. Maintain continuity around these socially central cast anchors where relevant: Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill.
8. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Critical: Plot similarity 0.75 with 'The Mysterious Affair at Styles' (same premeditated murder theme and victim identity)
9. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Moderate: Character similarity 0.70 with 'The Sign of the Four' (similar cast structure and character roles)
10. STORY TO DATE ANTI-COPY RULE: The STORY TO DATE section below is provided for chronological and factual reference ONLY. You MUST NOT copy, lightly rephrase, or structurally echo any sentence or paragraph from prior chapters. Every sentence in this chapter must be original prose unique to this scene. Reusing even a clause from prior chapter text will cause this attempt to fail immediately.

CRITICAL PROSE REQUIREMENTS:

The CML specifies exact requirements for certain validation-critical scenes. You MUST include these elements at the specified positions.

**Discriminating Test Scene (Act 3, Scene 4):**
Required elements: Execute the discriminating test, Observe the culprit's reaction or result, Draw conclusion about guilt
Test type: temporal

**Suspect Clearance Scenes:**
- Dr. Mallory Finch (Act 3, Scene 5): Confirmed presence in the kitchen during the murder window.
  Clues: clue_1, clue_2
- Eleanor Voss (Act 3, Scene 5): Alibi confirmed: 10:50 AM to 11:10 AM

**Culprit Revelation Scene (Act 3, Scene 6):**
Method: Confrontation with evidence.

**Clue Placement for These Chapters:**
- clue_1 must appear in Act 1, Scene 3 via Direct observation
- clue_fp_contradiction_step_1 must appear in Act 1, Scene 3 via Cross-check contradiction

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
  - Scene is set in: the library — reference it naturally within the paragraph, never as your opening phrase.
  - Opening atmosphere (MANDATORY — validator enforced): the first paragraph MUST contain at least one of: rain / wind / fog / storm / mist / thunder / evening / morning / night / dawn / dusk / season / afternoon / midday / noon / midnight / twilight / sunrise / sunset / daylight / sunlight / overcast / cloudy / bright / dark / grey / pale / cold / warm / chill / crisp / damp / drizzle / haze / lamplight / firelight. A chapter that omits all of these from its opening paragraph will be rejected.
  - Continuity bridge: in the first 120 words, visibly connect from the previous chapter's final beat. Carry forward one unresolved element (object, accusation, emotional pressure, or immediate physical action) from: "Eleanor's gaze shifted back to the clock, her expression a mixture of confusion and determination. "We need to figure this out before anyone else arrives. If we don't, they might think..." Her voice trailed off, leaving...".
  - CLUE OBLIGATIONS — mandatory prose elements (do NOT omit or bury):
    • The clock shows ten minutes past eleven. [clue_1] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: Establishes a timeline for the events.
      ↳ MANDATORY TWO-PARAGRAPH STRUCTURE (must appear in paragraphs 1 or 2 — no later):
         Paragraph 1: The POV character physically approaches or directly observes this evidence.
           The narration or dialogue explicitly states what is seen (use the exact locked phrase if one applies).
         Paragraph 2 (immediately following): The detective or POV character explicitly reasons
           about what this evidence implies — who it implicates, why it may be unreliable,
           or what inference it supports. This must be a separate full paragraph, not a sentence appended to Paragraph 1.
    • The clock in the library shows ten minutes past eleven. [clue_fp_contradiction_step_1] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: The clock could have been tampered to show a false time.
      ↳ MANDATORY TWO-PARAGRAPH STRUCTURE (must appear in paragraphs 1 or 2 — no later):
         Paragraph 1: The POV character physically approaches or directly observes this evidence.
           The narration or dialogue explicitly states what is seen (use the exact locked phrase if one applies).
         Paragraph 2 (immediately following): The detective or POV character explicitly reasons
           about what this evidence implies — who it implicates, why it may be unreliable,
           or what inference it supports. This must be a separate full paragraph, not a sentence appended to Paragraph 1.
  - Tonal contrast: include at least one beat of relief or ironic counterpoint. Do not sustain maximum tension for every paragraph.
  - ALIBI LOCK: Captain Ivor Hale's established alibi is "10:50 AM to 11:10 AM". Do NOT place Captain Ivor Hale at any other location or in any other activity during the crime window. Any contradiction is a continuity error that triggers a retry.
  - Sensory obligation — use at least two of: Candlelight illuminating the room, The glow of the fireplace | The crackle of the fire, Distant laughter from the hall | The scent of burning wood. Mood: tense curiosity.
- Locked fact phrase obligations:
  - If this batch mentions The exact time shown on the stopped clock face, write exactly: "ten minutes past eleven".
  - If this batch mentions The real time when the murder occurred, write exactly: "fifty minutes past eleven".
  - If this batch mentions The original scheduled time for the meeting that was tampered with, write exactly: "a quarter past twelve".
- Seasonal vocabulary allow-list: autumn, autumnal, fall.
- Forbidden seasonal words: spring, summer, winter.

FROZEN FACT STATE (DO NOT ALTER):
- Timeline anchor: November (autumn).
- Month, season, weather, and time-of-year language in this batch must stay compatible with autumn.
- Established timeline fact: The clock in the library
- Established timeline fact: Witness statements
- If referenced, use exact phrase: "ten minutes past eleven" (The exact time shown on the stopped clock face).
- If referenced, use exact phrase: "fifty minutes past eleven" (The real time when the murder occurred).
- If referenced, use exact phrase: "a quarter past twelve" (The original scheduled time for the meeting that was tampered with).

STORY TO DATE (REFERENCE ONLY — DO NOT COPY VERBATIM):
- Full prior chapter text is provided below for continuity, factual consistency, and reference accuracy.
- Use this to keep character voice, chronology, clue state, and location continuity aligned with earlier chapters.
- Do not quote, copy, or paraphrase these paragraphs too closely; write fresh prose that remains consistent with them.

--- BEGIN PRIOR CHAPTER 1 ---
Title: Chapter 1: Discovery
Beatrice Quill stepped into the library, the damp air wrapping around her like a heavy cloak. The rain tapped insistently against the window panes, a rhythmic reminder of the turmoil outside. Her heart raced as she took in the scene before her: Eleanor Voss stood frozen, her gaze fixed on the clock mounted on the wall, its hands stubbornly pointing to ten minutes past eleven. The flickering glow from the fireplace cast long shadows, illuminating the somber faces of the captain Hale and the doctor Finch, who stood nearby, their expressions a mixture of shock and disbelief.

Beatrice’s breath hitched as she approached, her eyes drawn to the lifeless body sprawled across the ornate rug. It was Eleanor’s brother, the late heir of Little Middleton, her features pale and unyielding. The clock's time seemed to mock them, a constant reminder of the moment that had irrevocably altered their lives. "What happened here?" Beatrice whispered, her voice barely rising above the sound of the rain. Eleanor turned to her, her eyes glistening with unshed tears, yet there was a steely resolve behind them.

Eleanor’s voice trembled slightly as she spoke, "I don’t know. We were all in the drawing room just before... before this. I thought I heard something, but I didn’t think..." She trailed off, her gaze returning to the clock, as if it held the answers she sought. Beatrice followed her gaze, her mind racing. The clock in the library showed ten minutes past eleven, a time that now felt ominous. It was a detail that would not escape the scrutiny of any investigator. What had transpired in the moments leading up to that time?

the doctor Finch stepped forward, her demeanor calm yet tinged with urgency. "We must call for help. The police need to be informed. This is... this is a murder, isn’t it?" Her voice carried an air of authority, tempered by the gravity of the situation. Beatrice nodded, her mind still grappling with the reality of the scene. The implications of the clock's time weighed heavily on her. If the victim had died no later than ten minutes past eleven, then they were all caught in a web of suspicion. Each of them had been present in the manor, and now they were bound together by circumstance and fear.

Captain Hale, her brow furrowed in thought, interjected, "But the clock must be wrong. I checked it during dinner, and it was perfectly accurate. Surely, this is just a coincidence?" Her insistence seemed desperate, almost frantic. Beatrice noted the tension in her voice, the way her hands clenched at her sides. It was a small detail, yet it cast doubt on the reliability of the clock. If Hale believed the clock was accurate, then it raised questions about what had truly happened in those final moments before the tragedy unfolded.

Eleanor’s breath caught as she stared at the clock, her expression shifting from grief to something more complex—a flicker of fear mixed with determination. "We need to figure this out before anyone else arrives. We cannot let them think..." Her voice trailed off, the unspoken words hanging in the air like a dark cloud. Beatrice felt a chill run down her spine. The atmosphere in the library was thick with unspoken accusations, a tension that crackled like the fire in the hearth. They were all suspects now, each with their own secrets to protect.

The rain continued to fall, a steady cadence that mirrored the rising anxiety within the room. Beatrice glanced at the body once more, her heart heavy with the weight of the situation. They had to uncover the truth, not just for the sake of the victim, but for their own futures. The clock’s hands, stubbornly fixed at ten minutes past eleven, seemed to mock their efforts. Time was slipping away, and with it, the chance to clear their names. They were trapped in a locked room mystery, and the only way out was to confront the shadows lurking within their own hearts.

As the rain drummed against the roof, Beatrice took a deep breath, steeling herself for what lay ahead. She would not shy away from the truth, no matter how painful it might be. The library, once a sanctuary of knowledge, had transformed into a stage for betrayal and deception. With a determined resolve, she stepped forward, ready to face the darkness that had descended upon them.
--- END PRIOR CHAPTER 1 ---

--- BEGIN PRIOR CHAPTER 2 ---
Title: Chapter 2: Initial Reactions
The rain drummed against the windows, a relentless reminder of the chaos that had unfolded within the library. Beatrice Quill stood at the threshold, her heart racing as she took in the scene. Eleanor Voss, pale and trembling, clutched a handkerchief to her lips, her eyes darting between the lifeless body and the clock on the wall, which stubbornly displayed ten minutes past eleven. The flickering shadows cast by the fireplace danced ominously, illuminating the tension etched on the faces of the captain Hale and the doctor Finch. It was a tableau of grief and suspicion, and Beatrice felt the weight of unspoken accusations hanging in the air.

Eleanor's shaky voice broke the silence. "I heard an argument just before... before this happened. It was loud enough that I thought it might be a quarrel between them." Her hands trembled as she spoke, betraying the calm facade she tried to maintain. The revelation sent a ripple of unease through the room. Beatrice's mind raced—if Eleanor had indeed heard an argument, it contradicted the notion that the clock was accurate. How could the murder have occurred at ten minutes past eleven if the altercation happened just moments before?

the doctor Finch stepped forward, her brow furrowed in concern. "We need to consider the implications of what Eleanor just said. If there was an argument, it could mean the clock is wrong. We must not jump to conclusions, but it raises questions about the timing of everything that has happened here." Her calm demeanor provided a stark contrast to the rising tension, yet Beatrice could sense the urgency in her voice. The air felt thick with suspicion, and every word seemed to carry the weight of potential guilt.

Captain Hale, arms crossed, glanced at Eleanor with a mix of disbelief and irritation. "An argument? I don't recall hearing anything of the sort. Surely, if it was loud enough for you to hear, the rest of us would have noticed too." Her tone was defensive, and Beatrice noted the way her fingers clenched at her sides. It was a small detail, but it hinted at the pressure she felt under the scrutiny of the others. The tension in the room was palpable, as each character began to defend their whereabouts during the critical moments leading up to the murder.

Beatrice took a step closer to Eleanor, her expression softening. "What exactly did you hear, Eleanor? Any details could help us piece together what happened here." The question hung in the air, and Eleanor's gaze dropped to the floor, her hands trembling more visibly now. "I... I can't remember everything clearly. Just raised voices, and then... silence. I thought it was just a disagreement, nothing serious." Her voice wavered, and Beatrice could see the fear in her eyes. The clock's time felt like a ticking bomb, counting down to revelations that might shatter their fragile alliance.

As the rain continued to fall outside, Beatrice felt a momentary flicker of relief when Dr. Finch attempted to lighten the mood. "Well, if nothing else, at least we have a lovely fire to keep us warm while we sort through this mess," she remarked dryly, eliciting a faint smile from Beatrice. It was a small reprieve amidst the chaos, a reminder that even in the darkest moments, humanity could still shine through. But the gravity of the situation quickly returned, as the reality of their predicament settled back in.

Captain Hale's voice cut through the tension again, this time with a hint of urgency. "If there was indeed an argument, it must have been loud enough for the whole house to hear. We should consider that when we discuss our alibis." Her suggestion seemed to mislead the group, creating a false sense of security about the timing of events. Beatrice's mind raced as she processed the implications of Ivor's words. If the argument was indeed loud, it could potentially shift the focus of suspicion away from her, but it also raised more questions than answers.

Eleanor's gaze shifted back to the clock, her expression a mixture of confusion and determination. "We need to figure this out before anyone else arrives. If we don't, they might think..." Her voice trailed off, leaving the unspoken fear hanging in the air. Beatrice felt a chill run down her spine as she realized the stakes had risen. They were not just witnesses to a tragedy; they were now embroiled in a mystery that threatened to unravel their lives. The clock's hands, fixed at ten minutes past eleven, seemed to mock their efforts to uncover the truth.
--- END PRIOR CHAPTER 2 ---

[SCENE COMPLETENESS CONTRACTS — MANDATORY. Each contract below lists what you MUST enact in that chapter. Do not summarise or mention these labels in the prose — enact them organically.]
Chapter 3 (Act 1) completeness contract:
  PIVOT ELEMENT (MANDATORY — write this into the prose, shown not told): "The clock's hands frozen at ten minutes past eleven."
  FACT ESTABLISHED (MANDATORY — reader must know this by chapter end): "Establishes that the clock shows ten minutes past eleven, raising doubts about the timing of the murder."

# Case Overview
Title: The Clockwork Conspiracy
Era: 1930s
Setting: Little Middleton
Crime: murder (premeditated)
Culprit: Captain Ivor Hale
False assumption: The murder happened when the clock showed ten minutes past eleven.
Cast: Eleanor Voss (she/her), Dr. Mallory Finch (she/her), Captain Ivor Hale (he/him), Beatrice Quill (she/her)

Setting Lock: Keep all scenes and descriptions consistent with the stated setting (Little Middleton). Do not introduce a different location type. Do not invent a proper name for the estate, house, or property — the setting has no separate proper name beyond "Little Middleton" itself.

⛔ PRONOUN LOCK (verify every sentence before writing):
• Eleanor Voss — she/her/her (NEVER he/him)
• Dr. Mallory Finch — she/her/her (NEVER he/him)
• Captain Ivor Hale — he/him/his (NEVER she/her)
• Beatrice Quill — she/her/her (NEVER he/him)

Outline scenes:
[
  {
    "sceneNumber": 3,
    "act": 1,
    "title": "The Clock's Secrets",
    "setting": {
      "location": "the library",
      "timeOfDay": "Later in the morning",
      "atmosphere": "Curious and investigative"
    },
    "characters": [
      "Beatrice Quill",
      "Eleanor Voss",
      "Captain Ivor Hale",
      "Dr. Mallory Finch"
    ],
    "purpose": "Investigate the clock and establish its importance.",
    "cluesRevealed": [
      "clue_1",
      "clue_fp_contradiction_step_1"
    ],
    "dramaticElements": {
      "conflict": "Beatrice's skepticism grows.",
      "tension": "The clock's accuracy is questioned.",
      "microMomentBeats": [
        "Beatrice brushes her fingers over the clock's surface, feeling the cold metal beneath her touch."
      ]
    },
    "summary": "Beatrice Quill inspects the clock, noting its peculiar stop at ten minutes past eleven. She questions the group about its accuracy and their knowledge of the clock's behavior, leading to further discrepancies in their alibis.",
    "estimatedWordCount": 1600,
    "pivotElement": "The clock's hands frozen at ten minutes past eleven.",
    "factEstablished": "Establishes that the clock shows ten minutes past eleven, raising doubts about the timing of the murder.",
    "permittedBehavioursByAct": [
      {
        "characterName": "Eleanor Voss",
        "behaviour": "cooperative grief; no guilt-tells in Act I"
      },
      {
        "characterName": "Captain Ivor Hale",
        "behaviour": "normal social behaviour; grief or confusion if appropriate"
      },
      {
        "characterName": "Dr. Mallory Finch",
        "behaviour": "normal social behaviour; grief or confusion if appropriate"
      },
      {
        "characterName": "Beatrice Quill",
        "behaviour": "normal social behaviour; grief or confusion if appropriate"
      }
    ],
    "redHerringPlacement": null,
    "emotionalRegister": "The investigation begins to unravel, revealing the characters' hidden motives.",
    "dominantCharacterNote": {
      "name": "Eleanor Voss",
      "voiceRegister": "Eleanor speaks with an elegant cadence, using flowery language that conveys her social standing."
    },
    "humourGuidance": {
      "permission": "permitted",
      "character": "Beatrice Quill",
      "form": "sardonic"
    },
    "eraTextureNote": "Limited communication due to the absence of modern technologies; Shortened daylight hours impacting social gatherings; Rainy weather hindering outdoor activities and movement; Societal expectations dictating formal attire for gatherings; Restricted access to public places due to class distinctions",
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
□ Chapter 3: "The clock shows ten minutes past eleven." is placed in the first 25% of the chapter, followed by an explicit inference or suspicion paragraph.
□ Chapter 3: "The clock in the library shows ten minutes past eleven." is placed in the first 25% of the chapter, followed by an explicit inference or suspicion paragraph.
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
