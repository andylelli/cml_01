# Actual Prompt Record

- Run ID: `mystery-1778701210537`
- Project ID: ``
- Timestamp: `2026-05-13T19:44:23.911Z`
- Agent: `Agent9-ProseGenerator-Ch1`
- Operation: `chat_request_full_prompt`
- Model: `GPT-4o-mini`
- Temperature: `0.42`
- Max Tokens: `4500`
- Attempt: `first`
- Prompt Hash: `73f8c3bea5826920`

## Message 1 (role=system)

```text
You are an expert prose writer for classic mystery fiction. Your role is to write compelling, atmospheric narrative chapters that read like a professionally published novel.

⛔ ABSOLUTE RULE — CHARACTER NAMES:
The ONLY characters who exist in this story are: Eleanor Voss (woman), Dr. Mallory Finch, Captain Ivor Hale (man), Beatrice Quill (woman).
Do NOT invent, borrow, or introduce ANY character not on that list — no constables, no solicitors, no butlers, no servants, no shopkeepers, no bystanders with names.
Unnamed walk-ons ("a footman", "the postmistress", "an officer") are allowed ONLY if they never receive a name or title+surname combination.
⚠️ BEFORE YOU WRITE each chapter, ask yourself: "Does every person I name appear in this list: Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill?" If not, remove them.
Any invented named character will fail validation and abort the entire generation.
⚠️ BEFORE YOU WRITE each chapter, also ask yourself: "Am I using the correct pronouns for every character — she/her for women, he/him for men, they/them for non-binary characters?" If not, correct it before writing a single word.
⛔ GENDER IS NON-NEGOTIABLE: The gender of every character is shown above. Use the correct pronouns at all times — a woman is always she/her, a man is always he/him, a non-binary character is always they/them/their. Never swap, default, or guess.

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
- MORAL COMPLEXITY REQUIREMENT: The mechanism of this crime carries a moral gray area: "The murderer acted out of a misguided sense of justice for a previous wrong done to them, evoking sympathy despite the crime." — the culprit reveal and denouement MUST acknowledge this ambiguity. Do not let the ending feel clean or simple. Give the reader at least one moment of uncomfortable sympathy or moral doubt.


⚠️ AMATEUR DETECTIVE STORY: The investigator is a civilian with no official standing. The official police (if they appear) are unnamed background figures only — "a constable", "the sergeant", "an officer from the village". Do NOT give any police official a name or title+surname combination. There is no Inspector [Surname], no Constable [Surname], no Sergeant [Surname] in this story.

PRONOUN ACCURACY — MANDATORY CONTINUITY CONTRACT
⚠ NON-BINARY CAST — SINGULAR THEY/THEM/THEIR ⚠
FORBIDDEN for Dr. Mallory Finch: she / her / herself / he / him / his / himself. Use only: they / them / their / themselves.
These are SINGULAR pronouns for ONE individual — not a group.
Example: "Dr. Mallory Finch adjusted their collar as they crossed the room." — correct.
Example: "Dr. Mallory Finch adjusted her collar as she crossed the room." — WRONG.


The following pronouns are locked facts, on the same level as character names
and hard-logic device values. Using the wrong pronoun is a continuity error,
not a style choice.

Canonical pronoun table (subject / object / possessive / reflexive):
  • Eleanor Voss: she/her/her/herself
  • Dr. Mallory Finch: they/them/their/themselves
  • Captain Ivor Hale: he/him/his/himself
  • Beatrice Quill: she/her/her/herself

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
   "Graham Worsley excused herself" is a pronoun error regardless of sentence position.
6. In dialogue attribution ("he said", "she replied"), the attribution pronoun must
   agree with the SPEAKER's gender — not the last character named inside the quoted speech.
7. In nested or cleft clauses ("It was she who had…", "It was he that…"), pronoun
   gender must still match the referent character's canonical set in the table.
8. Singular "they/them/their" for a specific named non-binary character carries the same
   mandatory status as gendered pronouns. It is not a plural — treat it as grammatically
   identical to he/him/his or she/her/her for the purposes of agreement.


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

## Era: 1935-07
In July 1935, the summer air is thick with humidity, and the countryside vibrates with the sounds of garden parties and social gatherings. However, beneath this vibrant facade lies the weight of the Great Depression, pressing heavily upon the upper classes as they grapple with their precarious positions. The echo of recent Independence Day celebrations still lingers, contrasting sharply with the financial struggles facing many. Social expectations dictate appearances, leading the elite to maintain a veneer of sophistication while their realities are marred by financial anxiety. The looming threat of fascism in Europe heightens the sense of unease, reminding everyone that their privilege is fragile in a world rapidly changing. Each day feels like a balancing act, as the wealthy navigate their social lives amid the rising tide of discontent and uncertainty.
Emotional register: A prevailing sense of anxiety and uncertainty permeates society, as individuals grapple with their identities in a rapidly changing world.
Physical constraints: Travel is limited due to fuel shortages and economic conditions. | Communication relies heavily on letters and limited telephone access. | Social gatherings are heavily scrutinized, leading to careful planning. | Public places are filled with tension as social hierarchies are maintained.
Current tensions (weave into background texture): The Great Depression continues to strain economic stability. | Political tensions rise in Europe with the threat of fascism. | Social unrest and labor strikes are becoming more common.
Wartime context — Many families carry the scars of loss from World War I, impacting their views on duty and honor.: The remnants of past glories clash with current struggles, creating a complex social fabric. Absence effect: The absence of those lost in the war leaves deep emotional voids, complicating relationships and societal expectations.

## Story Theme
The quest for justice unveils the fragility of human connections, exposing the depths of desperation and the hidden truths that bind individuals to their pasts.

## Story Emotional Register
Dominant: A tense and haunting exploration of secrets and revelations.

Arc:
The story begins with an air of unease enveloping Little Middleton Manor, where a murder disrupts the seemingly idyllic summer evening. The initial crime casts a long shadow over the gathering of elite guests, each carrying their own burdens and secrets. As Detective Eleanor Voss delves into the investigation, she encounters a labyrinth of clues and red herrings, each leading her deeper into a web of deception. The emotional cost of the investigation weighs heavily on her, forcing her to confront her own past as she seeks redemption.

Midway through the narrative, a pivotal revelation shifts the course of her inquiry; the tampered clock that misleads everyone becomes a focal point, leading to a new understanding of the timeline and the motives of those involved. As pressure mounts, tensions rise among the suspects, culminating in a dramatic confrontation where hidden truths emerge. The climax reveals not only the murderer but also the frailty of human connections, as each character grapples with the implications of their actions. In the resolution, the emotional costs are laid bare; Eleanor finds herself at a crossroads, having uncovered dark truths that reshape her understanding of justice and community. The manor, once a symbol of grandeur, now stands as a testament to the fragility of truth amidst the chaos of human emotions.

## Emotional register at this point in the story
A heavy sense of foreboding sets the tone as the murder disrupts the calm.

## Character Portraits (appearance & era)

### Eleanor Voss
Eleanor Voss, a beloved former schoolteacher, embodies the tension of the 1930s as she navigates the complexities of her past and present. The recent murder of her former student ignites a fierce determination to seek justice, reflecting the broader societal struggle against despair. With her nurturing persona, she confronts not only the crime but also her haunting memories, making her a poignant representation of resilience amid financial and emotional turmoil.
Era intersection: Eleanor's commitment to uncovering the truth mirrors the societal pressure to maintain appearances while grappling with personal demons.

### Dr. Mallory Finch
Dr. Mallory Finch stands at the crossroads of professional integrity and personal turmoil in the 1930s. As a respected physician, the pressure to conceal their affair with the victim's spouse weighs heavily on them. The ongoing economic struggles and the fear of exposure reflect the societal tension of maintaining a reputable facade amidst personal failures, making their plight a microcosm of the era's moral dilemmas.
Era intersection: Dr. Finch's internal conflict showcases the struggle for personal fulfillment against the backdrop of an unforgiving social environment.

### Captain Ivor Hale
Captain Ivor Hale epitomizes the conflict between honor and desperation during the Great Depression. Once a proud naval officer, his financial troubles threaten to unravel his family's legacy. As he navigates the murder investigation, his struggle to maintain dignity amidst societal expectations highlights the emotional cost of preserving a reputation in an increasingly precarious world.
Era intersection: Captain Hale's plight illustrates the broader challenges faced by the upper class, forced to confront their vulnerabilities in a changing society.

### Beatrice Quill
Beatrice Quill, a passionate socialite and activist, represents the youthful fervor of the 1930s. Her involvement in progressive causes reflects the growing desire for social reform amid the oppressive weight of class structures. However, the murder investigation threatens to derail her ideals, forcing her to confront the complexities of activism in a world where personal motives and public perception often clash.
Era intersection: Beatrice's journey underscores the tension between personal ambition and societal expectations during a time of great upheaval.

## Character Voices

### Eleanor Voss (she/her/her)
Eleanor Voss speaks with a calm, measured tone that reflects her nurturing nature, often using educational metaphors.
[comfortable] In the quiet of the library, I've always found that knowledge is the greatest comfort.
[evasive] Oh, it’s just a matter of time before things settle down, isn't it?
[stressed] I can't help but think... what if I had seen the signs earlier?
Humour: Eleanor employs dry wit, often making self-deprecating remarks about her past.

### Dr. Mallory Finch (they/them/their)
Dr. Mallory Finch's quick rhythm and sharp tone reflect their medical expertise and underlying anxiety.
[comfortable] The human body is a marvel, but sometimes our hearts betray us.
[evasive] I assure you, my alibi is solid; I was at the conference.
[stressed] This situation is... complicated. We must tread carefully.
Humour: Dr. Finch's sardonic humor often surfaces in tense moments, providing a defense mechanism.

### Captain Ivor Hale (he/him/his)
Captain Hale speaks with a commanding presence, punctuating his statements with dry humor and formality.
[comfortable] Duty has always been my guiding star, even in troubled waters.
[evasive] I've seen far worse storms than this, I assure you.
[stressed] The weight of my family's legacy... it feels heavier with each passing day.
Humour: His self-deprecating humor often emerges when discussing his age and physical prowess.

### Beatrice Quill (she/her/her)
Beatrice Quill's eloquent speech is laced with charm and a flair for dramatic expression.
[comfortable] Change is like a summer storm; it arrives unexpectedly but can refresh everything.
[evasive] I find that the truth is often... a matter of perspective.
[stressed] We mustn't allow this tragedy to silence our voices!
Humour: Beatrice often employs polite savagery in her repartee, showcasing her wit.

## Location Registers (scene framing guides)

The Library: The library is a sanctuary steeped in tension, where every shadow seems to whisper secrets and the air is thick with the scent of musty pages. It feels both isolating and charged, a place where the past collides with the present in the wake of tragedy.. Camera angle: As a writer enters this space, they should feel the weight of history pressing in, urging them to unravel the mysteries concealed within.. Era: The library's quietude is disrupted by the echoes of a society grappling with its past and uncertain future.

## Humour guidance for this story position (opening)
Permission: forbidden
Rationale: The opening sets a serious tone with a murder's aftermath.

FAIR-PLAY AND INFERENCE CONTRACT (from CML logic):
- False assumption in force: The victim must have died hours earlier than the time indicated by the clock.
- Hidden truth to progressively expose: The tampering of the clock misleads the investigation timeline.
- Inference path checkpoints to dramatize clearly (observation -> correction -> effect):
  - Step 1: obs: The manor clock shows ten minutes past eleven when found. | corr: The clock's time indicates the victim was thought to have died at this time. | effect: Narrows the time of death to align with the clock time.
  - Step 2: obs: The victim's watch is found stopped at the time of tampering. | corr: This suggests the watch was altered to align with the tampered clock. | effect: Eliminates the assumption that the victim died at the clock time.
  - Step 3: obs: Visible scuff marks around the clock suggest recent handling. | corr: The tampering of the clock was likely done shortly before the murder. | effect: Narrows the timeline to suspect who had access to the clock.
- Discriminating test method: trap
- Discriminating test design constraint: Comparing the timing discrepancies between the victim's watch and the manor clock proves that the clock was tampered with, revealing the true time of death.
- Test must rely on already-shown clue IDs: clue_1, clue_2, clue_3, clue_8, clue_mechanism_visibility_core, clue_4
- Fair-play rationale: Step 1: The clock time discrepancy (early) and victim's watch alignment (mid) allow the reader to deduce the false timeline. Step 2: The scuff marks (mid) indicate tampering before the victim's death. Step 3: The discriminating test reveals the contradiction proving the manipulation of the clock.
- Never solve by withheld information. Keep reader-information parity with detective reasoning.

## Character Reference

### Eleanor Voss
Eleanor speaks with a calm, measured tone, often punctuating her words with thoughtful pauses
She has a habit of using educational metaphors, reflecting her teaching background, and occasionally employs self-deprecating humor when discussing her own shortcomings.
Eleanor grapples with the duality of her identity: the nurturing teacher everyone admires and the flawed individual haunted by her past. This tension makes her question her worth and the validity of her instincts.

### Dr. Mallory Finch
Finch speaks with a quick rhythm, often peppering their dialogue with medical jargon that reflects their expertise
Their wit is sharp, with a tendency to employ sarcasm as both a defense mechanism and a means to engage others, though they can quickly pivot to a more serious tone when discussing pressing matters.
Dr. Finch is caught in a moral quagmire, torn between their desire for personal fulfillment and the ethical implications of their actions. The weight of their secret hangs heavily, leading to moments of introspection where they question whether the ends justify the means.

### Captain Ivor Hale
Captain Hale speaks with a commanding presence, often employing a formal tone befitting his military background
He has a tendency to punctuate his statements with dry humor, self-deprecating remarks about his age or declining physical prowess, which adds a layer of relatability to his otherwise stoic demeanor.
Captain Hale is torn between his unwavering pride and the harsh reality of his circumstances. The conflict between maintaining a strong exterior and confronting the vulnerabilities of his situation creates a deep-rooted tension within him.

### Beatrice Quill
Beatrice speaks with a flourish, her dialogue punctuated by grand gestures and an expressive tone
She has a penchant for witty repartee and often employs a blend of charm and biting humor to make her points, using her social skills to navigate tricky conversations.
Beatrice is torn between her passionate ideals and the need to navigate the treacherous waters of public opinion. The tension between her rebellious spirit and the consequences of her actions creates a palpable internal struggle.


## CHARACTER CONTRACTS (binding for this scene)
Each entry below constrains how this character must be written in this chapter.
These override generic style guidance when they conflict.

### Eleanor Voss
Voice & mannerisms: Eleanor speaks with a calm, measured tone, often punctuating her words with thoughtful pauses. She has a habit of using educational metaphors, reflecting her teaching background, and occasionally employs self-deprecating humor when discussing her own shortcomings.
Sample voice fragments (match this register and rhythm):
  [comfortable] "In the quiet of the library, I've always found that knowledge is the greatest comfort."
  [evasive] "Oh, it’s just a matter of time before things settle down, isn't it?"
Humour: dry wit — deploy occasionally (level 0.5)
FORBIDDEN phrase (never write for Eleanor Voss): "a surge of determination washed over her"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "The recent murder of her former student has ignited a fierce determination within Eleanor. She feels an obligation to uncover the truth, not only to honor the memory of the victim but also to restore her own sense of purpose." — do not surface in Act I.

### Dr. Mallory Finch
Voice & mannerisms: Dr. Finch speaks with a quick rhythm, often peppering their dialogue with medical jargon that reflects their expertise. Their wit is sharp, with a tendency to employ sarcasm as both a defense mechanism and a means to engage others, though they can quickly pivot to a more serious tone when discussing pressing matters.
Sample voice fragments (match this register and rhythm):
  [comfortable] "The human body is a marvel, but sometimes our hearts betray us."
  [evasive] "I assure you, my alibi is solid; I was at the conference."
Humour: sardonic — deploy occasionally (level 0.6)
FORBIDDEN phrase (never write for Dr. Mallory Finch): "palpable tension filled the room"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "The fear of exposure gnaws at Dr. Finch, driving them to protect their career and personal honor at all costs. The stakes could not be higher, as the revelation of their affair would mean not only professional disgrace but a personal reckoning." — do not surface in Act I.

### Captain Ivor Hale
Voice & mannerisms: Captain Hale speaks with a commanding presence, often employing a formal tone befitting his military background. He has a tendency to punctuate his statements with dry humor, self-deprecating remarks about his age or declining physical prowess, which adds a layer of relatability to his otherwise stoic demeanor.
Sample voice fragments (match this register and rhythm):
  [comfortable] "Duty has always been my guiding star, even in troubled waters."
  [evasive] "I've seen far worse storms than this, I assure you."
Humour: self deprecating — deploy occasionally (level 0.4)
FORBIDDEN phrase (never write for Captain Ivor Hale): "she knew with certainty she was right"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Desperate to uphold his family's reputation, Captain Hale feels the noose of financial ruin tightening around him. The murder investigation presents a perilous opportunity to deflect attention from his struggles, but at what cost?" — do not surface in Act I.

### Beatrice Quill
Voice & mannerisms: Beatrice speaks with a flourish, her dialogue punctuated by grand gestures and an expressive tone. She has a penchant for witty repartee and often employs a blend of charm and biting humor to make her points, using her social skills to navigate tricky conversations.
Sample voice fragments (match this register and rhythm):
  [comfortable] "Change is like a summer storm; it arrives unexpectedly but can refresh everything."
  [evasive] "I find that the truth is often... a matter of perspective."
Humour: polite savagery — deploy frequently (level 0.7)
FORBIDDEN phrase (never write for Beatrice Quill): "she felt a wave of unease"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "The murder of a figure who opposed her ideals has left Beatrice grappling with anger and frustration. She feels a sense of urgency to address the injustices she perceives, but the investigation threatens to derail her efforts." — do not surface in Act I.



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
Little Middleton Manor stands as a testament to early 20th-century British grandeur, its sprawling wings and manicured gardens shrouded in an atmosphere of tension and secrecy.

Key Locations Available:
- The Library (interior): Crime scene
- The Drawing Room (interior): Gathering space for family and guests
- The Kitchen (interior): Heart of the household, where meals are prepared and staff gather

Atmosphere: Tense and foreboding, reflecting the underlying class tensions exacerbated by the Great Depression.
Weather: Overcast with intermittent rain, typical for a late autumn day in the countryside.

Era markers: Petrol-powered automobiles parked in the courtyard, their engines quiet as the rain begins. | A typewriter in the study, its keys clacking away as letters are drafted amidst rising anxiety. | An early household telephone in the hall, its bell ringing sharply, echoing through the empty corridors.

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
  - Visual: Rows of leather-bound books loom like sentinels, their gilt lettering barely visible in the dim light., A single gas lamp flickers ominously, casting erratic shadows that dance across the walls.
  - Sounds: The soft rustle of paper as a breeze slips through the slightly ajar window, mingling with the distant sound of raindrops., The creak of the wooden floorboards underfoot, amplifying every movement in the otherwise silent room.
  - Scents: The musty scent of old paper mingles with the faint aroma of polished wood, creating an air of antiquity., A hint of dampness permeates the atmosphere, as if the very walls are weeping.
  - Touch: The coolness of the oak table contrasts sharply with the warmth of the body that had been slumped against it., The rough texture of the books' spines is a stark reminder of the knowledge and secrets they contain.

The Drawing Room (interior):
  - Visual: The flickering flames in the fireplace cast a warm glow that contrasts sharply with the darkening room., Gilded picture frames line the walls, showcasing family portraits that seem to gaze down with a knowing air.
  - Sounds: The soft crackling of the fire is a comforting backdrop to the tension that hangs in the air., The distant sound of rain tapping against the windows creates a rhythmic lull, punctuating the silence.
  - Scents: The scent of burning logs mingles with the rich aroma of polished wood and leather, creating an inviting atmosphere., Hints of lavender from an old sachet tucked away in a drawer add a touch of nostalgia.
  - Touch: The plush texture of the velvet sofas invites one to sink in, yet the chill in the air serves as a reminder of the season., The cool marble of the fireplace surround contrasts with the warmth of the fire, creating a sensory dichotomy.

The Kitchen (interior):
  - Visual: The kitchen is alive with activity, steam rising from pots on the stove and sunlight streamin
[truncated for prompt budget]

## Texture Pool
Draw on these as opportunities arise — you are not required to use them.

- In July 1935, the summer air is thick with humidity, and the countryside vibrates with the sounds of garden parties and social gatherings
- However, beneath this vibrant facade lies the weight of the Great Depression, pressing heavily upon the upper classes as they grapple with their precarious positions
- The echo of recent Independence Day celebrations still lingers, contrasting sharply with the financial struggles facing many
- Social expectations dictate appearances, leading the elite to maintain a veneer of sophistication while their realities are marred by financial anxiety
- The looming threat of fascism in Europe heightens the sense of unease, reminding everyone that their privilege is fragile in a world rapidly changing

TEMPORAL CONTEXT:

This story takes place in July 1935 during summer.

Seasonal Atmosphere:
- Weather patterns: Warm and humid with occasional thunderstorms, Long sunny days interrupted by sudden downpours, Temperatures averaging around 25°C (77°F)
- Daylight: Long summer evenings with sunset around eight-thirty, allowing for outdoor gatherings and activities.
- Seasonal activities: Garden parties and tea gatherings in the countryside, Summer fairs featuring local crafts and food, Fishing trips to nearby lakes and rivers
- Seasonal occasions: Independence Day (July 4) celebrations still echoing in the air with fireworks and parades in the past week.
- Season: summer

Period Fashion (describe naturally):
- Men formal: Lightweight linen suits in pastel shades, White shirts with wide collars, Bow ties or cravats as stylish accessories
- Men casual: Short-sleeve button-up shirts, Trousers in light fabric, Panama hats for sun protection
- Men accessories: Pocket watches, Leather belts with brass buckles, Suspenders for trousers
- Women formal: Tea-length dresses with floral patterns, Wide-brimmed straw hats adorned with ribbons, Light shawls for cooler evenings
- Women casual: Cotton blouses with puffed sleeves, A-line skirts in bright colors, Ballet flats or open-toed shoes
- Women accessories: Pearl necklaces, Clutch purses, Belted waist to accentuate silhouette

Cultural Context (reference naturally):
- Music/entertainment: 'In the Mood' by Glenn Miller, 'Cheek to Cheek' by Fred Astaire, 'Summertime' from Porgy and Bess; Films: 'A Midsummer Night's Dream', 'The 39 Steps'; Theatre: Broadway's 'Porgy and Bess', Revues featuring popular musical acts; Radio: The Shadow, Amos 'n' Andy
- Typical prices: Loaf of bread: four pence, A pint of milk: three pence, Cinema ticket: one shilling
- Current events: The United States continues to recover from the Great Depression, with the New Deal programs still being debated; Political tensions rise in Europe with the increasing influence of fascist regimes
- Literature: 'Brave New World' by Aldous Huxley | 'Of Mice and Men' by John Steinbeck | 'The Maltese Falcon' by Dashiell Hammett | [Mystery] | [Social realism] | [Science fiction]
- Technology: Television technology being experimented with | The rise of household appliances like washing machines and refrigerators | Advancements in aviation with new commercial flights | Petrol-powered cars | Early televisions in affluent households | Typewriters still prevalent in offices
- Daily life: Family picnics in local parks, Visiting fairs and carnivals on weekends, Social evening gatherings with music and dancing
- Social rituals: Sunday church services followed by family dinners, Garden parties hosted by the upper class, Summer solstice celebrations in rural areas

Atmospheric Details:
The scent of freshly cut grass mingles with the dampness of approaching rain in the humid air. The sound of distant thunder rumbles like an ominous warning, echoing the tensions felt within the manor house. The flickering of candlelight casts shadows on the walls, creating a sense of unease as guests gather around the dinner table.

FASHION INTEGRATION TECHNIQUES:
- First appearance: Describe outfit to establish class/personality
- Accessories: Gloves, hats, pocket watches, jewelry reveal status
- Time-specific: Different outfits for different times of d
[truncated for prompt budget]

NON-NEGOTIABLE CHAPTER OBLIGATIONS — LOCKED EVIDENCE PHRASES (VERBATIM REQUIRED):
The following physical evidence values are absolute ground truth. Every time this chapter describes, mentions, or alludes to the relevant evidence — no matter how briefly — it MUST use the exact phrase shown below, character for character. NO paraphrase, approximation, rounding, or synonym is permitted.

FAILURE EXAMPLE: if the locked value is "at thirteen minutes to midnight" and you write "just before midnight" or "around midnight" — that is a HARD FAIL. You must write "at thirteen minutes to midnight". Equally, if the locked value is written in words, such as "ten minutes past eleven", and you convert it to figure-based clock notation — that is also a HARD FAIL. Words stay as words; figure forms are forbidden for word-phrased facts.

CRITICAL — WORD-PHRASED VALUES: If the canonical value is written out in words (e.g. a time like "ten minutes past eleven", or an amount like "forty minutes"), reproduce those exact words. DO NOT convert to figure-based time notation, twenty-four-hour format, or any other numeric shorthand. Correct: "ten minutes past eleven". WRONG: figure-based clock notation or numeric shorthand.

Locked facts:
  - The exact time shown on the stopped clock face: "ten minutes past eleven"
  - The exact amount the clock was wound back: "forty minutes"
  - The time shown on the victim’s wristwatch: "ten minutes past eleven"

If a locked fact has no relevance to this chapter, omit it. But the moment you reference the underlying evidence, only the exact phrase above is acceptable.

⛔ CLUES TO SURFACE IN THESE CHAPTERS — mandatory:
The following evidence MUST be clearly observable to an attentive reader. Do not bury it in atmosphere or passing dialogue. Each clue must be concrete, specific, and noticeable:

• [clue_1] The manor clock shows ten minutes past eleven when found.
  Category: temporal | Criticality: essential | Supports inference step 1
  Points to: Establishes the time of the clock at the scene.

• [clue_2] The victim's watch is found stopped at the time of tampering.
  Category: temporal | Criticality: essential | Supports inference step 2
  Points to: Indicates the victim's watch was tampered with.

• [clue_mechanism_visibility_core] Direct observation
  Category: structural | Placement: early (Act 1)
  Points to: what this observation reveals about the time or circumstances of the crime.

For each clue above: an attentive reader should be able to find, record, and later use it to reason toward the solution.

═══ NARRATIVE STATE (read-only — do not contradict) ═══

LOCKED FACTS — use verbatim whenever this evidence is described:
  • The exact time shown on the stopped clock face: "ten minutes past eleven"
  • The exact amount the clock was wound back: "forty minutes"
  • The time shown on the victim’s wristwatch: "ten minutes past eleven"

CHARACTER PRONOUNS — never deviate from these:
  • Eleanor Voss: she/her/her
  • Dr. Mallory Finch: they/them/their
  • Captain Ivor Hale: he/him/his
  • Beatrice Quill: she/her/her
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
Known location profile anchors: Little Middleton Manor, The Library, The Drawing Room, The Kitchen, the scene
LOCATION NAME CAPITALISATION (HARD REQUIREMENT — validated):
All named locations in your prose MUST use the EXACT capitalisation from the CML profiles.
Canonical forms: "Little Middleton Manor", "The Library", "The Drawing Room", "The Kitchen", "the scene"
Writing a location in lowercase (e.g. "drawing room" instead of "Drawing Room") is a validated error. Every time you mention a named location, copy its capitalisation from the list above.
- Chapter 1: OPENING STYLE (HARD): Start the VERY FIRST SENTENCE with a named character performing a physical action or motion — e.g. "[Name] crossed the threshold…" / "[Name] set down the glass…" / "[Name] rose from the chair…". Anchor opening in "the scene". HARD REQUIREMENT for the first 2 paragraphs: (a) include 2+ sensory words — choose from smell/scent/sound/echo/silence/creak/whisper/cold/warm/damp/rough/smooth/glow/shadow/flicker/dim — and (b) include 1+ atmosphere/time word — choose from rain/wind/fog/storm/mist/thunder/evening/morning/night/dawn/dusk/season/afternoon/midday/noon/midnight/twilight/sunrise/sunset/daylight/sunlight/overcast/cloudy/bright/dark. These are validated requirements, not style suggestions; missing them triggers a retry.

PROMPT BUDGET SUMMARY: budget=32000 tokens; fixed=5631; context=10073; dropped=[none]; truncated=[location_profiles, temporal_context]

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
8. Integrate at least two concrete era-grounded details per chapter from setting refinement signals: petrol-powered automobiles | typewriters in offices | early household telephones | telephones more common in households | telegram services for urgent messages | airmail for faster correspondence.
9. Respect setting movement/access constraints in scene action and alibis: large grounds create natural boundaries | rooms designed for specific functions limit movement | weather conditions can restrict outdoor access | restricted areas for staff and guests | daily routines determining access to certain rooms.
10. Sustain social coherence with this backdrop pressure: The looming threat of financial ruin and social upheaval draws a disparate group of elite guests to the manor, where secrets and class tensions simmer beneath the surface.
11. Maintain continuity around these socially central cast anchors where relevant: Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill.
12. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Moderate: Plot similarity 0.75 with 'The Mysterious Affair at Styles' (same temporal focus and murder scenario)
13. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Character similarity 0.70 with 'The Big Bow Mystery' driven by similar character roles and dynamics.

CRITICAL PROSE REQUIREMENTS:

The CML specifies exact requirements for certain validation-critical scenes. You MUST include these elements at the specified positions.

**Discriminating Test Scene (Act 3, Scene 4):**
Required elements: Execute the discriminating test, Observe the culprit's reaction or result, Draw conclusion about guilt

**Suspect Clearance Scenes:**
- Dr. Mallory Finch (Act 3, Scene 5): Proving the medical timeline does not align with the murder timing.
  Clues: clue_1, clue_2
- Captain Ivor Hale (Act 3, Scene 5): Confirming his alibi during the clock's tampering.
  Clues: clue_1, clue_3
- Beatrice Quill (Act 3, Scene 5): Demonstrating her lack of access to the clock before the murder.
  Clues: clue_2, clue_3

**Culprit Revelation Scene (Act 3, Scene 6):**
Method: Confrontation with evidence

**Clue Placement for These Chapters:**
- clue_mechanism_visibility_core must appear in Act 1, Scene 1 via Direct observation

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
- Chapter 1:
  - Word count: Target 1250 words. Achieve this through plot events, dialogue exchanges, and physical investigation — not through atmospheric repetition or extended internal reflection. Each 200-word segment should contain at minimum one concrete story event (a discovery, a conversation exchange, a physical action or movement). Padding with atmosphere alone is not acceptable.
  - Location anchor: the scene.
  - Opening atmosphere (MANDATORY — validator enforced): the first paragraph MUST contain at least one of: rain / wind / fog / storm / mist / thunder / evening / morning / night / dawn / dusk / season / afternoon / midday / noon / midnight / twilight / sunrise / sunset / daylight / sunlight / overcast / cloudy / bright / dark. A chapter that omits all of these from its opening paragraph will be rejected.
  - CLUE OBLIGATIONS — mandatory prose elements (do NOT omit or bury):
    • The mechanism relies on clock, murder, and manor to expose the false timing. [clue_mechanism_visibility_core] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: The mechanism of timing discrepancies is central to the murder investigation.
      ↳ MANDATORY TWO-PARAGRAPH STRUCTURE (must appear in paragraphs 1 or 2 — no later):
         Paragraph 1: The POV character physically approaches or directly observes this evidence.
           The narration or dialogue explicitly states what is seen (use the exact locked phrase if one applies).
         Paragraph 2 (immediately following): The detective or POV character explicitly reasons
           about what this evidence implies — who it implicates, why it may be unreliable,
           or what inference it supports. This must be a separate full paragraph, not a sentence appended to Paragraph 1.
    • The manor clock shows ten minutes past eleven when found. [clue_1] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: Establishes the time of the clock at the scene.
      ↳ MANDATORY TWO-PARAGRAPH STRUCTURE (must appear in paragraphs 1 or 2 — no later):
         Paragraph 1: The POV character physically approaches or directly observes this evidence.
           The narration or dialogue explicitly states what is seen (use the exact locked phrase if one applies).
         Paragraph 2 (immediately following): The detective or POV character explicitly reasons
           about what this evidence implies — who it implicates, why it may be unreliable,
           or what inference it supports. This must be a separate full paragraph, not a sentence appended to Paragraph 1.
    • The victim's watch is found stopped at the time of tampering. [clue_2] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: Indicates the victim's watch was tampered with.
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
  - If this batch mentions The time shown on the victim’s wristwatch, write exactly: "ten minutes past eleven".
- Seasonal vocabulary allow-list: summer, summery, midsummer.
- Forbidden seasonal words: spring, autumn, winter.

FROZEN TIMELINE STATE (DO NOT ALTER):
- Timeline anchor: July (summer).
- Month, season, weather, and time-of-year language in this batch must stay compatible with summer.
- Established timeline fact: time on the victim's watch
- Established timeline fact: time on the manor clock
- If referenced, use exact time phrase: "ten minutes past eleven" (The exact time shown on the stopped clock face).
- If referenced, use exact time phrase: "forty minutes" (The exact amount the clock was wound back).
- If referenced, use exact time phrase: "ten minutes past eleven" (The time shown on the victim’s wristwatch).

STORY TO DATE (REFERENCE ONLY — DO NOT COPY VERBATIM):
- No previous chapter text exists yet for this batch.

[SCENE COMPLETENESS CONTRACTS — MANDATORY. Each contract below lists what you MUST enact in that chapter. Do not summarise or mention these labels in the prose — enact them organically.]
Chapter 1 (Act 1) completeness contract:
  PIVOT ELEMENT (MANDATORY — write this into the prose, shown not told): "The stopped pocket watch found in the victim's hand — still showing ten past eleven"
  FACT ESTABLISHED (MANDATORY — reader must know this by chapter end): "Establishes the victim died no later than eleven past eleven, contradicting three suspects' alibis"
  RED HERRING (MANDATORY — seed naturally, not flagged as false): [rh_1] Captain Hale mentions the clock ran at dinner — seeds timing doubt

# Case Overview
Title: The Temporal Deception
Era: 1930s
Setting: Little Middleton
Crime: murder (unknown)
Culprit: Eleanor Voss
False assumption: The victim must have died hours earlier than the time indicated by the clock.
Cast: Eleanor Voss (she/her), Dr. Mallory Finch (they/them), Captain Ivor Hale (he/him), Beatrice Quill (she/her)

⚠ PRONOUN REMINDER: Dr. Mallory Finch use they/them/their (singular). Never write she/her or he/him for these characters.

Setting Lock: Keep all scenes and descriptions consistent with the stated setting (Little Middleton). Do not introduce a different location type.

Outline scenes:
[
  {
    "sceneNumber": 1,
    "act": 1,
    "title": "Discovery",
    "setting": {
      "location": "the scene",
      "timeOfDay": "Morning after the murder",
      "atmosphere": "Tense household awaiting the detective's arrival"
    },
    "characters": [
      "Eleanor Voss",
      "Dr. Mallory Finch",
      "Captain Ivor Hale",
      "Beatrice Quill"
    ],
    "purpose": "Introduce the crime and detective",
    "cluesRevealed": [
      "clue_1",
      "clue_2"
    ],
    "dramaticElements": {
      "conflict": "Locked room mystery established",
      "tension": "Every suspect had access to the victim",
      "microMomentBeats": [
        "Eleanor lingers at the door — unguarded grief"
      ]
    },
    "summary": "The morning after the murder, Eleanor Voss, a local teacher, arrives at the manor to find a body. the doctor Finch, the captain Hale, and Beatrice Quill are present, all visibly shaken. The atmosphere is thick with tension as they await the detective's arrival, and the discovery of the victim's stopped watch reveals the time of death.",
    "estimatedWordCount": 1800,
    "pivotElement": "The stopped pocket watch found in the victim's hand — still showing ten past eleven",
    "factEstablished": "Establishes the victim died no later than eleven past eleven, contradicting three suspects' alibis",
    "permittedBehavioursByAct": [
      {
        "characterName": "Eleanor Voss",
        "behaviour": "normal social behaviour; grief or confusion if appropriate"
      },
      {
        "characterName": "Dr. Mallory Finch",
        "behaviour": "normal social behaviour; grief or confusion if appropriate"
      },
      {
        "characterName": "Captain Ivor Hale",
        "behaviour": "normal social behaviour; grief or confusion if appropriate"
      },
      {
        "characterName": "Beatrice Quill",
        "behaviour": "normal social behaviour; grief or confusion if appropriate"
      }
    ],
    "redHerringPlacement": {
      "redHerringId": "rh_1",
      "placementDetail": "Captain Hale mentions the clock ran at dinner — seeds timing doubt"
    },
    "emotionalRegister": "A heavy sense of foreboding sets the tone as the murder disrupts the calm.",
    "dominantCharacterNote": {
      "name": "Eleanor Voss",
      "voiceRegister": "Eleanor Voss speaks with a calm, measured tone that reflects her nurturing nature, often using educational metaphors."
    },
    "humourGuidance": {
      "permission": "forbidden"
    },
    "eraTextureNote": "Travel is limited due to fuel shortages and economic conditions.; Communication relies heavily on letters and limited telephone access.; Social gatherings are heavily scrutinized, leading to careful planning.; Public places are filled with tension as social hierarchies are maintained.",
    "locationRegisterNote": ""
  }
]
```

## Message 3 (role=user)

```text
BEFORE SUBMITTING YOUR JSON — verify this checklist:
□ Each chapter reaches the hard floor of 500 words and aims for 1250 words or more.
□ If you mention locked evidence, you used the exact locked phrase verbatim.
□ Allowed seasonal words only: summer, summery, midsummer.
□ Forbidden seasonal words: spring, autumn, winter.
□ Chapter 1: "The mechanism relies on clock, murder, and manor to expose the false timing." is placed in the first 25% of the chapter, followed by an explicit inference or suspicion paragraph.
□ Chapter 1: "The manor clock shows ten minutes past eleven when found." is placed in the first 25% of the chapter, followed by an explicit inference or suspicion paragraph.
□ Chapter 1: "The victim's watch is found stopped at the time of tampering." is placed in the first 25% of the chapter, followed by an explicit inference or suspicion paragraph.
□ PRONOUN AUDIT — for every character you named in your chapters, list the pronouns you actually used, then verify against the canonical table. Correct any mismatch before outputting. Do NOT include this audit in your JSON output.
  Character            | Canonical     | Used in draft | Match?
  ---------------------|---------------|---------------|-------
  Eleanor Voss         | she/her/her/herself       | [fill in]     | [yes/no]
  Dr. Mallory Finch    | they/them/their/themselves | [fill in]     | [yes/no]
  Captain Ivor Hale    | he/him/his/himself        | [fill in]     | [yes/no]
  Beatrice Quill       | she/her/her/herself       | [fill in]     | [yes/no]
□ Return valid JSON only.
```
