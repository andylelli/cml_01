# Actual Prompt Record

- Run ID: `mystery-1778701210537`
- Project ID: ``
- Timestamp: `2026-05-13T19:45:41.107Z`
- Agent: `Agent9-ProseGenerator-Ch5`
- Operation: `chat_request_full_prompt`
- Model: `GPT-4o-mini`
- Temperature: `0.42`
- Max Tokens: `4500`
- Attempt: `first`
- Prompt Hash: `d251b2d42a58e804`

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
The revelation of the tampered clock alters the course of the investigation.

## Character Portraits (appearance & era)

### Eleanor Voss
Eleanor Voss, a beloved former schoolteacher, embodies the tension of the 1930s as she navigates the complexities of her past and present. The recent murder of her former student ignites a fierce determination to seek justice, reflecting the broader societal struggle against despair. With her nurturing persona, she confronts not only the crime but also her haunting memories, making her a poignant representation of resilience amid financial and emotional turmoil.
Era intersection: Eleanor's commitment to uncovering the truth mirrors the societal pressure to maintain appearances while grappling with personal demons.

### Captain Ivor Hale
Captain Ivor Hale epitomizes the conflict between honor and desperation during the Great Depression. Once a proud naval officer, his financial troubles threaten to unravel his family's legacy. As he navigates the murder investigation, his struggle to maintain dignity amidst societal expectations highlights the emotional cost of preserving a reputation in an increasingly precarious world.
Era intersection: Captain Hale's plight illustrates the broader challenges faced by the upper class, forced to confront their vulnerabilities in a changing society.

## Character Voices

### Eleanor Voss (she/her/her)
Eleanor Voss speaks with a calm, measured tone that reflects her nurturing nature, often using educational metaphors.
[comfortable] In the quiet of the library, I've always found that knowledge is the greatest comfort.
[evasive] Oh, it’s just a matter of time before things settle down, isn't it?
[stressed] I can't help but think... what if I had seen the signs earlier?
Humour: Eleanor employs dry wit, often making self-deprecating remarks about her past.

### Captain Ivor Hale (he/him/his)
Captain Hale speaks with a commanding presence, punctuating his statements with dry humor and formality.
[comfortable] Duty has always been my guiding star, even in troubled waters.
[evasive] I've seen far worse storms than this, I assure you.
[stressed] The weight of my family's legacy... it feels heavier with each passing day.
Humour: His self-deprecating humor often emerges when discussing his age and physical prowess.

## Location Registers (scene framing guides)

The Library: The library is a sanctuary steeped in tension, where every shadow seems to whisper secrets and the air is thick with the scent of musty pages. It feels both isolating and charged, a place where the past collides with the present in the wake of tragedy.. Camera angle: As a writer enters this space, they should feel the weight of history pressing in, urging them to unravel the mysteries concealed within.. Era: The library's quietude is disrupted by the echoes of a society grappling with its past and uncertain future.

## Humour guidance for this story position (first_turn)
Permission: forbidden
Rationale: Tension scenes should remain serious to enhance emotional stakes.

## Character Pressure
Captain Ivor Hale is approaching a point of breakdown. Stress and strain should be accumulating visibly — through behaviour, not statement. No confrontation yet.

## Reveal Groundwork (texture — do not explain, only plant)
- Plant one subtle observable beat related to: "The hidden-truth of the tampered clock retroactively reshapes the earlier investigation scenes, as it clarifies the initial confusion regarding the victim's time of death". Do not explain significance yet.
- Plant one subtle observable beat related to: "It also highlights Eleanor's past struggles with her sense of justice, forcing her to confront her motivations". Do not explain significance yet.
- Plant one subtle observable beat related to: "Furthermore, it reveals Dr". Do not explain significance yet.

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

### Captain Ivor Hale
Captain Hale speaks with a commanding presence, often employing a formal tone befitting his military background
He has a tendency to punctuate his statements with dry humor, self-deprecating remarks about his age or declining physical prowess, which adds a layer of relatability to his otherwise stoic demeanor.
Captain Hale is torn between his unwavering pride and the harsh reality of his circumstances. The conflict between maintaining a strong exterior and confronting the vulnerabilities of his situation creates a deep-rooted tension within him.


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
Act 2 behaviour contract: May show unease, evasion, or mild defensiveness when questioned. One behavioural tell is permitted. Internal conflict emerging: "Eleanor grapples with the duality of her identity: the nurturing teacher everyone admires and the flawed individual haunted by her past. This tension makes her question her worth and the validity of her instincts."

### Captain Ivor Hale
Voice & mannerisms: Captain Hale speaks with a commanding presence, often employing a formal tone befitting his military background. He has a tendency to punctuate his statements with dry humor, self-deprecating remarks about his age or declining physical prowess, which adds a layer of relatability to his otherwise stoic demeanor.
Sample voice fragments (match this register and rhythm):
  [comfortable] "Duty has always been my guiding star, even in troubled waters."
  [evasive] "I've seen far worse storms than this, I assure you."
Humour: self deprecating — deploy occasionally (level 0.4)
FORBIDDEN phrase (never write for Captain Ivor Hale): "she knew with certainty she was right"
Act 2 behaviour contract: May show unease, evasion, or mild defensiveness when questioned. One behavioural tell is permitted. Internal conflict emerging: "Captain Hale is torn between his unwavering pride and the harsh reality of his circumstances. The conflict between maintaining a strong exterior and confronting the vulnerabilities of his situation creates a deep-rooted tension within him."



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

• [clue_5] Eliminates Captain Ivor Hale because he was at a meeting from ten to twelve.
  Category: testimonial | Criticality: essential | Supports inference step 2
  Points to: Captain Ivor Hale cannot be the murderer.

• [clue_3] Visible scuff marks around the clock suggest recent handling.
  Category: temporal | Criticality: essential | Supports inference step 3
  Points to: Suggests someone tampered with the clock recently.

• [clue_culprit_direct_eleanor_voss] Direct evidence ties Eleanor Voss to the mechanism access point before the discriminating test.
  Category: temporal | Criticality: essential | Supports inference step 3
  Points to: This direct evidence shows Eleanor Voss had means and opportunity, narrowing the solution uniquely toward the culprit.

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

CLUES ALREADY REVEALED TO READER: clue_1, clue_2, clue_core_contradiction_chain, clue_mechanism_visibility_core, clue_core_elimination_chain, clue_3, clue_7 — do not reveal these as new information.

CONTINUITY HANDOFF — previous chapter closing beat:
  • "As they continued to speak, Eleanor felt a flicker of relief at the clarity of their alibi, yet the nagging doubt remained. Finch's nervousness was troubling, and she couldn't shake the feeling that there was more to the story. The rain outside continued to su..."
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
drawing room, garden, manor, study, flat, bar

✓ RULE: Continue using this location vocabulary. Maintain consistency with established setting type.
✓ Do NOT introduce new location types that contradict earlier chapters.

**Recent Chapter Summary (for narrative continuity):**
Chapter 2: Chapter 2: Initial Reactions
  Events: As the rain continued to summer outside, the atmosphere in the manor's drawing room felt charged with unease.
Chapter 3: Chapter 3: The Investigation Begins
  Events: At midday, the rain continued to drum against the windows of the victim's study, creating a somber backdrop to the unfolding investigation.
Chapter 4: Chapter 4: Interrogating Dr. Finch
  Events: The early afternoon light filtered through the rain-streaked windows of the local pub, casting a muted glow over the polished wood of the bar.

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
Known location profile anchors: Little Middleton Manor, The Library, The Drawing Room, The Kitchen, the town hall
LOCATION NAME CAPITALISATION (HARD REQUIREMENT — validated):
All named locations in your prose MUST use the EXACT capitalisation from the CML profiles.
Canonical forms: "Little Middleton Manor", "The Library", "The Drawing Room", "The Kitchen", "the town hall"
Writing a location in lowercase (e.g. "drawing room" instead of "Drawing Room") is a validated error. Every time you mention a named location, copy its capitalisation from the list above.
- Chapter 5: OPENING STYLE (HARD): Start the VERY FIRST SENTENCE with a temporal subordinate clause — e.g. "When [Name] entered…" / "After the last guest…" / "Before the household had stirred…" / "As the light faded…". Anchor opening in "the town hall". HARD REQUIREMENT for the first 2 paragraphs: (a) include 2+ sensory words — choose from smell/scent/sound/echo/silence/creak/whisper/cold/warm/damp/rough/smooth/glow/shadow/flicker/dim — and (b) include 1+ atmosphere/time word — choose from rain/wind/fog/storm/mist/thunder/evening/morning/night/dawn/dusk/season/afternoon/midday/noon/midnight/twilight/sunrise/sunset/daylight/sunlight/overcast/cloudy/bright/dark. These are validated requirements, not style suggestions; missing them triggers a retry.

[⚠ INTERNAL QUALITY DIAGNOSTICS — DO NOT REPRODUCE ANY PART OF THIS SECTION IN YOUR STORY OUTPUT. These are private generator observations for your consideration only. Your narrative must read as if this section does not exist. Never include phrases from this block in character dialogue, narration, or description.]

PRIOR CHAPTER QUALITY OBSERVATIONS:
- Chapter 3 (score 94/100):
  Quality gaps noted: word density below preferred target (876/1000); scene grounding weakness
  Address in upcoming chapters: Increase chapter density with concrete investigation action and sensory-grounded beats; avoid recap-only padding. | Open next chapter with a named location anchor plus at least two sensory cues and one atmosphere marker.
- Chapter 4 (score 97/100):
  Quality gaps noted: word density below preferred target (980/1000); scene grounding weakness
  Address in upcoming chapters: Increase chapter density with concrete investigation action and sensory-grounded beats; avoid recap-only padding. | Open next chapter with a named location anchor plus at least two sensory cues and one atmosphere marker.
- Phrases to avoid (already overused in earlier chapters): "this suggests a deliberate effort to mislead", "suggests a deliberate effort to mislead us", "a deliberate effort to mislead us about", "deliberate effort to mislead us about the", "effort to mislead us about the time", "mislead us about the time of death", "we need to piece together the timeline", "need to piece together the timeline carefully", "inside and it seemed to be running", "and it seemed to be running fine".
[END INTERNAL DIAGNOSTICS]

PROMPT BUDGET SUMMARY: budget=32000 tokens; fixed=10037; context=9954; dropped=[none]; truncated=[location_profiles, temporal_context]

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
8. Integrate at least two concrete era-grounded details per chapter from setting refinement signals: petrol-powered automobiles | typewriters in offices | early household telephones | telephones more common in households | telegram services for urgent messages | airmail for faster correspondence.
9. Respect setting movement/access constraints in scene action and alibis: large grounds create natural boundaries | rooms designed for specific functions limit movement | weather conditions can restrict outdoor access | restricted areas for staff and guests | daily routines determining access to certain rooms.
10. Sustain social coherence with this backdrop pressure: The looming threat of financial ruin and social upheaval draws a disparate group of elite guests to the manor, where secrets and class tensions simmer beneath the surface.
11. Maintain continuity around these socially central cast anchors where relevant: Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill.
12. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Moderate: Plot similarity 0.75 with 'The Mysterious Affair at Styles' (same temporal focus and murder scenario)
13. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Character similarity 0.70 with 'The Big Bow Mystery' driven by similar character roles and dynamics.
14. STORY TO DATE ANTI-COPY RULE: The STORY TO DATE section below is provided for chronological and factual reference ONLY. You MUST NOT copy, lightly rephrase, or structurally echo any sentence or paragraph from prior chapters. Every sentence in this chapter must be original prose unique to this scene. Reusing even a clause from prior chapter text will cause this attempt to fail immediately.

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
  - Location anchor: the town hall.
  - Opening atmosphere (MANDATORY — validator enforced): the first paragraph MUST contain at least one of: rain / wind / fog / storm / mist / thunder / evening / morning / night / dawn / dusk / season / afternoon / midday / noon / midnight / twilight / sunrise / sunset / daylight / sunlight / overcast / cloudy / bright / dark. A chapter that omits all of these from its opening paragraph will be rejected.
  - Continuity bridge: in the first 120 words, visibly connect from the previous chapter's final beat. Carry forward one unresolved element (object, accusation, emotional pressure, or immediate physical action) from: "As they continued to speak, Eleanor felt a flicker of relief at the clarity of their alibi, yet the nagging doubt remained. Finch's nervousness was troubling, and she couldn't shake the feeling that there was more to the...".
  - CLUE OBLIGATIONS — mandatory prose elements (do NOT omit or bury):
    • Eliminates Captain Ivor Hale because he was at a meeting from ten to twelve. [clue_5]
      Points to: Captain Ivor Hale cannot be the murderer.
    • Visible scuff marks around the clock suggest recent handling. [clue_3]
      Points to: Suggests someone tampered with the clock recently.
    • Direct evidence ties Eleanor Voss to the mechanism access point before the discriminating test. [clue_culprit_direct_eleanor_voss]
      Points to: This direct evidence shows Eleanor Voss had means and opportunity, narrowing the solution uniquely toward the culprit.
  - Tonal contrast: include at least one beat of relief or ironic counterpoint. Do not sustain maximum tension for every paragraph.

- Tonal contrast required: the previous chapter was high-tension. This chapter must include at least one beat of relief, pause, or quiet observation.
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
- Full prior chapter text is provided below for continuity, factual consistency, and reference accuracy.
- Use this to keep character voice, chronology, clue state, and location continuity aligned with earlier chapters.
- Do not quote, copy, or paraphrase these paragraphs too closely; write fresh prose that remains consistent with them.

--- BEGIN PRIOR CHAPTER 1 ---
Title: Chapter 1: Discovery
The humid morning air clung to Eleanor Voss as she approached Little Middleton Manor, the weight of the previous evening's events heavy upon her. Rain drizzled gently, creating a soft patter against the cobblestones, while the scent of damp earth mingled with the musty aroma of the manor's interior. She paused at the entrance, her heart racing as she prepared to confront the grim reality within. The silence of the house was palpable, broken only by the occasional creak of the old structure settling under the weight of its own history.

As Eleanor stepped inside, the dim light of the hallway revealed the tension etched on the faces of the doctor Finch, the captain Hale, and Beatrice Quill. They stood in the drawing room, their expressions a mixture of shock and disbelief. The air felt thick with unspoken words, each person grappling with the gravity of the situation. Eleanor's gaze was drawn to the clock on the mantelpiece, its hands frozen in time, a silent witness to the tragedy that had unfolded. The manor clock shows ten minutes past eleven when found, a detail that would soon prove crucial to understanding the events of the previous night.

Eleanor's heart sank as she approached the clock, her fingers brushing against its cool surface. The mechanism relied on clock, murder, and manor to expose the false timing. He recalled the conversations from dinner, where Captain Hale had mentioned the clock had been running smoothly, a fact that now seemed suspect. How could it have stopped at such a critical moment? The implications were troubling, casting a shadow over the alibis of those present. It was clear that the time displayed could not be trusted, and he felt a knot of anxiety tightening in his stomach.

Dr. Finch, their brow furrowed in concentration, stepped closer to Eleanor, their voice barely above a whisper. "We must consider the possibility that the clock was tampered with. If it shows ten minutes past eleven, then the victim's watch—" They gestured towards the body, still lying in the adjacent room. "—was found stopped at the time of tampering. This suggests a deliberate effort to mislead us about the time of death. It raises questions about who had access to the clock and when it was altered. We need to piece together the timeline carefully."

Eleanor nodded, her mind racing. The victim's watch is found stopped at the time of tampering, indicating they had died no later than ten minutes past eleven. This contradicted the alibis of the three suspects present, each of whom claimed to have been elsewhere at the time of the murder. The tension in the room was palpable, as each person silently considered their own involvement in the unfolding drama. Who among them could have had the motive and opportunity to commit such a heinous act? The atmosphere grew heavier, the weight of suspicion settling like a thick fog.

Captain Hale, attempting to regain control of the situation, cleared his throat. "We must remain calm and focused. I suggest we recount our movements from last night. Perhaps there is something we missed that could shed light on this tragedy." His voice, though steady, betrayed a hint of unease, a reminder that even the most composed could be shaken by the specter of murder. Eleanor felt a flicker of relief at her suggestion; the act of recounting their movements might provide clarity amidst the chaos.

Beatrice Quill, her voice trembling slightly, interjected, "I was in the garden for a while, tending to the roses. I returned to the house just after ten. I remember glancing at the clock before I went inside, and it seemed to be running fine then. But..." She hesitated, her eyes darting towards the clock on the mantelpiece, as if it could offer her some solace. "What if it was already tampered with before I even noticed?"

Eleanor took a deep breath, her mind racing to connect the dots. The stopped pocket watch found in the victim's hand — still showing ten past eleven — was a chilling reminder of the final moments of their life. It was a stark piece of evidence that would guide her investigation. The victim had died no later than eleven past eleven, a fact that contradicted the alibis they all seemed to cling to. Each of them had been present in the manor, and now, they were all entangled in a web of suspicion, their fates intertwined by the tragedy that had struck.

As the rain continued to summer outside, Eleanor felt a surge of determination rising within her. She would uncover the truth, no matter how deep the shadows ran. The manor held its secrets tightly, but she was resolved to pry them loose. With a final glance at the clock, she steeled herself for the task ahead, knowing that the answers lay hidden within the very walls of Little Middleton Manor.
--- END PRIOR CHAPTER 1 ---

--- BEGIN PRIOR CHAPTER 2 ---
Title: Chapter 2: Initial Reactions
As the rain continued to summer outside, the atmosphere in the manor's drawing room felt charged with unease. The flickering light from the gas lamps cast long shadows across the walls, creating an unsettling ambiance that matched the tension in the air. Eleanor Voss stood by the mantelpiece, her gaze fixed on the clock, which stubbornly displayed ten minutes past eleven. The implications of that time weighed heavily on her mind, as the events of the previous night began to unravel in her thoughts.

Eleanor stepped closer to the clock, her fingers brushing against the cool surface. The clock's time indicates the victim was thought to have died at this time. This detail gnawed at her, for it contradicted the alibis of those present. How could they all have been elsewhere if the clock had stopped at such a pivotal moment? The truth felt just out of reach, hidden behind the carefully crafted stories of her companions.

the doctor Finch, standing near the window, shifted their weight nervously. "The clock's position and the time it shows are crucial to understanding what happened last night," they said, their voice steady but laced with concern. "If it shows ten minutes past eleven, then we must consider that the victim's watch was also found stopped at the same time. This suggests a deliberate effort to mislead us about the time of death. We need to piece together the timeline carefully."

the captain Hale, arms crossed, leaned against the wall, his expression a mix of determination and worry. "We must be methodical in our approach. Each of us needs to recount our movements from last evening. Perhaps there are details we've overlooked that could clarify this tragedy." The weight of his words hung in the air, a reminder that their lives were now intertwined in suspicion and uncertainty.

Beatrice Quill, her hands trembling slightly, glanced from Eleanor to the clock. "I was in the garden tending to the roses before returning to the house just after ten. I distinctly remember checking the clock when I came inside, and it seemed to be running fine then. But what if it was already tampered with before I noticed?" Her voice wavered, revealing the fear that lurked beneath her composed exterior.

Eleanor took a deep breath, her mind racing to connect the dots. The victim's watch, still showing ten minutes past eleven, was a chilling reminder of their final moments. It was a stark piece of evidence that would guide her investigation. Each of them had been present in the manor, and now, they were all entangled in a web of suspicion, their fates intertwined by the tragedy that had struck.

As the rain continued to drum against the windows, Eleanor felt a surge of resolve. She would uncover the truth, no matter how deep the shadows ran. The manor held its secrets tightly, but she was determined to pry them loose. With a final glance at the clock, she steeled herself for the task ahead, knowing that the answers lay hidden within the very walls of Little Middleton Manor.
--- END PRIOR CHAPTER 2 ---

--- BEGIN PRIOR CHAPTER 3 ---
Title: Chapter 3: The Investigation Begins
At midday, the rain continued to drum against the windows of the victim's study, creating a somber backdrop to the unfolding investigation. Eleanor Voss stood just inside the door, her heart pounding as she prepared to confront the chilling evidence that lay before her. The air was thick with the scent of damp wood and the faint aroma of old books, a reminder of the many secrets the manor held. She stepped further into the room, her eyes drawn to the clock on the mantelpiece, its hands stubbornly frozen in time. The manor clock shows ten minutes past eleven when found, a detail that weighed heavily on her mind, casting shadows over the alibis of those present. How could they all have been elsewhere if the clock had stopped at such a pivotal moment?

Eleanor approached the clock, her fingers brushing against its cool surface. The implications of its stillness gnawed at her, for it contradicted the carefully constructed narratives of her companions. "If the clock shows ten minutes past eleven, then we must consider the victim's watch as well," she murmured, her thoughts racing. the doctor Finch, who had been standing nearby, nodded in agreement, their brow furrowed in concentration. "The victim's watch is found stopped at the time of tampering. This suggests a deliberate effort to mislead us about the time of death. We need to piece together the timeline carefully," they added, their voice steady yet laced with concern. Eleanor felt a knot of anxiety tighten in her stomach as she processed this information. Who among them could have had the motive and opportunity to commit such a heinous act?

the captain Hale, leaning against the desk with arms crossed, regarded Eleanor with a mix of determination and skepticism. "We must be methodical in our approach. Each of us needs to recount our movements from last evening. Perhaps there are details we've overlooked that could clarify this tragedy." His voice, though steady, betrayed a hint of unease, a reminder that even the most composed could be shaken by the specter of murder. Beatrice Quill, her hands trembling slightly, glanced from Eleanor to the clock. "I was in the garden tending to the roses before returning to the house just after ten. I distinctly remember checking the clock when I came inside, and it seemed to be running fine then. But what if it was already tampered with before I noticed?" Her voice wavered, revealing the fear that lurked beneath her composed exterior.

Eleanor clenched her fists, determined to uncover the truth. The scuff marks around the clock suggested recent handling, a detail that could not be ignored. She stepped closer to the mantelpiece, her eyes narrowing as she examined the clock more closely. The visible scuff marks around the clock suggest recent handling, hinting at tampering. This revelation sent a shiver down her spine, as it implied someone had manipulated the clock just before the murder. Who had access to the study? And how could they have altered the clock without being seen? The questions swirled in her mind, each one more troubling than the last.

Dr. Finch, sensing the tension in the room, attempted to lighten the mood with a sardonic remark. "Well, if we were to conduct a thorough investigation, I suppose we ought to start with the most pressing question: who among us has the best alibi for tampering with a clock?" Their attempt at humor fell flat, the gravity of the situation overshadowing any levity. Eleanor shot them a grateful glance, appreciating the effort to break the tension, but the weight of the investigation loomed large. She could feel the skepticism of her companions, their reluctance to allow her to take the lead evident in their body language. Yet, she refused to be deterred. This was not merely an academic exercise; a life had been lost, and she owed it to the victim to seek the truth.

As the rain continued to patter against the windows, Eleanor took a deep breath, steeling herself for the task ahead. "We need to focus on the timeline. If the clock was tampered with, we must determine when it happened and who had the opportunity to do so. Each of you has a part to play in this investigation, and I will not allow fear to cloud our judgment." Her voice was firm, a reflection of her resolve. The others exchanged glances, and Eleanor could see the flicker of uncertainty in their eyes. Perhaps they were beginning to understand the gravity of the situation, the truth that lay hidden beneath layers of deception.

Eleanor turned her attention back to the clock, her mind racing with possibilities. The victim's watch had stopped at ten minutes past eleven, a chilling reminder of their final moments. It was a stark piece of evidence that would guide her investigation. Each of them had been present in the manor, and now, they were all entangled in a web of suspicion, their fates intertwined by the tragedy that had struck. As she continued to examine the clock, she felt a sense of urgency building within her. Time was of the essence, and she needed to uncover the truth before it slipped away like grains of sand through her fingers.
--- END PRIOR CHAPTER 3 ---

--- BEGIN PRIOR CHAPTER 4 ---
Title: Chapter 4: Interrogating Dr. Finch
The early afternoon light filtered through the rain-streaked windows of the local pub, casting a muted glow over the polished wood of the bar. The scent of damp earth mingled with the rich aroma of ale, creating an atmosphere that was casual yet tinged with tension. Eleanor Voss sat at a small table, her fingers tapping nervously against the surface as she awaited the doctor Finch. Her mind was still racing from the revelations of the previous night, particularly the implications of the clock's time, which now seemed to hold the key to understanding the murder. The victim's watch had stopped at ten minutes past eleven, a detail that loomed large in her thoughts as she replayed the events leading up to the tragedy.

As she waited, Eleanor's gaze drifted to the clock on the wall, its hands moving steadily forward, oblivious to the turmoil that had unfolded. She recalled the scuff marks around the clock in the study, a clear indication that it had been tampered with recently. The thought made her stomach churn; who had dared to manipulate time itself? The clock's betrayal echoed in her mind, mingling with the nervous energy that filled the pub. When Dr. Finch finally entered, her demeanor was far from reassuring. She scanned the room, her eyes darting around as if searching for an escape, before settling on Eleanor with an expression that was difficult to read.

“Thank you for coming,” Eleanor said, forcing a calmness into her voice that she did not entirely feel. “I wanted to discuss your alibi from last night.” Dr. Finch nodded, their fingers fidgeting with the edge of their collar. “Of course. I was at the pub from nine until eleven. You can ask anyone.” Their voice was steady, but Eleanor noticed the slight tremor in their hands, the way they avoided her gaze. It was a small detail, but one that raised her suspicions. Why was someone with a solid alibi so visibly uneasy? “That’s good to hear,” she replied, leaning forward slightly. “But I need to know more about what you did while you were there.”

Dr. Finch took a deep breath, their eyes flickering to the door as if contemplating a hasty exit. “I had a few drinks, spoke with some friends. It was a typical evening.” Eleanor raised an eyebrow, sensing the evasiveness in their tone. “You must have seen the clock, then. Did you notice what time you left?” Finch hesitated, their brow furrowing in concentration. “I... I can’t say for certain. I was... distracted.” The admission hung in the air, heavy with implication. “Distracted by what?” Eleanor pressed, her curiosity piqued. “By the conversation, I suppose. We were discussing the recent events in town.”

Finch's nervous demeanor raised suspicions despite their alibi. Eleanor leaned back, crossing her arms as she considered their words. “You mentioned the events in town. Was there anything specific that caught your attention?” A flicker of discomfort crossed Finch's face, and they glanced down at their drink. “Just the usual gossip. Nothing of consequence.” Eleanor sensed that there was more beneath the surface, but she needed to tread carefully. “And the clock? Did you notice if it was running?”

Finch's gaze darted back to her, and for a moment, Eleanor thought she saw a flash of panic. “I didn’t pay much attention to the clock,” they replied, their voice slightly higher than before. “I was more concerned with the conversation.” Eleanor noted the visible scuff marks around the clock in the study, a detail that could not be ignored. It hinted at tampering, suggesting someone had manipulated the clock just before the murder. “You were at the pub during the time of the murder, which eliminates you as a suspect,” Eleanor stated, her tone firm. “But your reaction raises questions. Why are you so nervous?”

Dr. Finch stared into their drink, avoiding Eleanor's gaze. “I assure you, I had nothing to do with it. I was simply... surprised by the news. It’s unsettling, isn’t it? To think that someone could be killed so close to us.” The weight of their words lingered in the air, and Eleanor could sense the tension in the room. “Yes, it is unsettling,” she replied, her voice steady. “But I need to understand why you seem so uneasy discussing it. Is there something you’re not telling me?” Finch shifted in their seat, clearly uncomfortable under her scrutiny. “I just want to help, Eleanor. I don’t want to be involved in this any more than I have to.”

Eleanor studied Finch closely, noting the way their fingers trembled slightly against the table. “You’re not involved, but your knowledge of the situation is important. If you know anything that could help, now is the time to share.” Finch looked up, their expression a mixture of fear and resolve. “I promise, I’ll do everything I can to assist you. I just... I can’t shake the feeling that there’s more to this than we realize.” Eleanor nodded, sensing that they were both grappling with the same underlying fear — the fear of the unknown, of what lay hidden beneath the surface of their lives. “We’ll uncover the truth, together,” she assured them, her voice firm. “But I need you to be honest with me.”

As they continued to speak, Eleanor felt a flicker of relief at the clarity of their alibi, yet the nagging doubt remained. Finch's nervousness was troubling, and she couldn't shake the feeling that there was more to the story. The rain outside continued to summer, a steady rhythm that mirrored the tension in the pub. Eleanor knew that the investigation was far from over; the truth was still out there, waiting to be uncovered. And as she prepared to leave, she felt a renewed sense of determination. The clock had been tampered with, and she would find out who was responsible.
--- END PRIOR CHAPTER 4 ---

[SCENE COMPLETENESS CONTRACTS — MANDATORY. Each contract below lists what you MUST enact in that chapter. Do not summarise or mention these labels in the prose — enact them organically.]
Chapter 5 (Act 2) completeness contract:
  PIVOT ELEMENT (MANDATORY — write this into the prose, shown not told): "Hale's confident demeanor begins to crack under scrutiny"
  FACT ESTABLISHED (MANDATORY — reader must know this by chapter end): "Establishes that Captain Hale was in a meeting during the murder — his alibi holds"

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
    "sceneNumber": 5,
    "act": 2,
    "title": "Captain Hale's Alibi",
    "setting": {
      "location": "the town hall",
      "timeOfDay": "Mid-afternoon",
      "atmosphere": "Formal and tense"
    },
    "characters": [
      "Eleanor Voss",
      "Captain Ivor Hale"
    ],
    "purpose": "Eleanor questions Captain Hale about his whereabouts",
    "cluesRevealed": [
      "clue_5",
      "clue_3",
      "clue_culprit_direct_eleanor_voss"
    ],
    "dramaticElements": {
      "conflict": "Eleanor's determination clashes with Hale's pride",
      "tension": "Hale's alibi appears solid but raises more questions",
      "microMomentBeats": [
        "Hale's jaw tightens as Eleanor presses him for details"
      ]
    },
    "summary": "At the town hall, Eleanor confronts Captain Hale about his alibi. He claims he was in a meeting during the time of the murder, which corroborates with the clock's time. However, Eleanor notices inconsistencies in his story, prompting further suspicion.",
    "estimatedWordCount": 2000,
    "pivotElement": "Hale's confident demeanor begins to crack under scrutiny",
    "factEstablished": "Establishes that Captain Hale was in a meeting during the murder — his alibi holds",
    "permittedBehavioursByAct": [
      {
        "characterName": "Eleanor Voss",
        "behaviour": "unease, evasion, or mild defensiveness when questioned"
      },
      {
        "characterName": "Captain Ivor Hale",
        "behaviour": "unease, evasion, or mild defensiveness when questioned"
      }
    ],
    "redHerringPlacement": null,
    "emotionalRegister": "Tensions rise as the suspects confront their own fears and motivations.",
    "dominantCharacterNote": {
      "name": "Eleanor Voss",
      "voiceRegister": "Eleanor Voss speaks with a calm, measured tone that reflects her nurturing nature, often using educational metaphors."
    },
    "humourGuidance": {
      "permission": "conditional",
      "character": "Dr. Mallory Finch",
      "form": "sardonic",
      "condition": "Dr. Finch displays sardonic humor during tense moments."
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
□ First chapter in this batch opens by continuing the previous chapter closing beat (same unresolved object, question, movement, or emotional pressure).
□ PRONOUN AUDIT — for every character you named in your chapters, list the pronouns you actually used, then verify against the canonical table. Correct any mismatch before outputting. Do NOT include this audit in your JSON output.
  Character            | Canonical     | Used in draft | Match?
  ---------------------|---------------|---------------|-------
  Eleanor Voss         | she/her/her/herself       | [fill in]     | [yes/no]
  Dr. Mallory Finch    | they/them/their/themselves | [fill in]     | [yes/no]
  Captain Ivor Hale    | he/him/his/himself        | [fill in]     | [yes/no]
  Beatrice Quill       | she/her/her/herself       | [fill in]     | [yes/no]
□ Return valid JSON only.
```
