# Actual Prompt Record

- Run ID: `mystery-1779616726317`
- Project ID: ``
- Timestamp: `2026-05-24T10:10:36.779Z`
- Agent: `Agent9-ProseGenerator-Ch5`
- Operation: `chat_request_full_prompt`
- Model: `GPT-4o-mini`
- Temperature: `0.42`
- Max Tokens: `4500`
- Attempt: `first`
- Prompt Hash: `86a3a7927b032964`

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
- MORAL COMPLEXITY REQUIREMENT: The mechanism of this crime carries a moral gray area: "The murderer acted out of desperation to protect a loved one from financial ruin, making their actions both tragic and understandable." — the culprit reveal and denouement MUST acknowledge this ambiguity. Do not let the ending feel clean or simple. Give the reader at least one moment of uncomfortable sympathy or moral doubt.


⚠️ AMATEUR DETECTIVE STORY: The investigator is a civilian with no official standing. The official police (if they appear) are unnamed background figures only — "a constable", "the sergeant", "an officer from the village". Do NOT give any police official a name or title+surname combination. There is no Inspector [Surname], no Constable [Surname], no Sergeant [Surname] in this story.


CRITICAL CHARACTER CONSISTENCY RULES:

1. Each character has ONE canonical name. Use ONLY names from this list. Never vary, abbreviate, or add titles beyond what is listed.
   COMPLETE CAST (no other named characters exist): Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill
   - "Mr. Jennings entered the room" → ILLEGAL. Jennings is not in the cast.
   - "Constable Reed took notes" → ILLEGAL. Reed is not in the cast.
   - "A constable took notes" → LEGAL (no name given).

2. Character roles are fixed:
   - Eleanor Voss: Amateur Sleuth / Civilian Investigator
   - Dr. Mallory Finch: Respected Professional
   - Captain Ivor Hale: Disgraced Veteran
   - Beatrice Quill: Social Climber
   - Never place characters in locations inconsistent with their role

WORLD DOCUMENT (use this as your primary creative context):

## Era: 1939-01
In January 1939, life in England was marked by uncertainty as the shadows of World War II loomed on the horizon. The Great Depression had left many struggling, with rising unemployment and class tensions creating a volatile social atmosphere. While the privileged elite held their lavish gatherings, the lower classes faced grim realities, leading to resentment and unrest. Daily life revolved around strict social rituals, with afternoon teas and formal dinners serving as both refuge and battleground for status. The air was thick with an oppressive sense of foreboding, as whispers of impending conflict spread among the population. The traditional class structure was being challenged, yet those in power clung tightly to their status, often at the expense of others. Amidst this backdrop, the manor serves as a microcosm of society, where the tensions of the outside world seep into the lives of its inhabitants.
Emotional register: A collective anxiety permeates society, as fear and uncertainty about the future loom large.
Physical constraints: Short winter days with limited natural light | Chilly winds and frequent rain affecting outdoor activities | Travel restrictions due to economic hardship limiting movement
Current tensions (weave into background texture): Rising tensions in Europe with the threat of World War II | Lingering effects of the Great Depression causing financial strain | Class disparities exacerbated by economic hardship
Wartime context — As tensions rise, many young men in England prepare for potential enlistment, altering family dynamics and community structures.: Communities are divided, with the wealthy often insulated from the realities faced by the working class, leading to increased class resentment. Absence effect: The potential for losing loved ones to war creates an emotional strain, as families brace for separation and loss.

## Story Theme
The pursuit of social status can lead to betrayal and deception, revealing the fragile nature of human relationships amidst the pressures of societal expectations, and reveals that evidence carries ethical weight, forcing characters to choose accountability over social performance when appearances and facts collide.

## Story Emotional Register
Dominant: A tense exploration of betrayal and the fragility of human relationships.

Arc:
As the sun sets on Little Middleton Manor, the air is thick with anticipation and unresolved tensions. The festive gathering for a family reunion takes a dark turn when Eleanor Voss is found murdered, her lifeless body discovered in the drawing room. The initial shock sends ripples of unease throughout the estate, as guests grapple with the weight of their hidden agendas. The investigation begins, and Dr. Mallory Finch takes the lead, uncovering clues that hint at a deeper conspiracy.

However, the emotional cost of probing into the lives of friends and rivals weighs heavily on her, as she contemplates the fragile nature of trust. A pivotal moment occurs when the clock, a seemingly innocent artifact, becomes central to the mystery, revealing a tampering that alters the timeline of events. As secrets unfold and motives are questioned, the tension escalates, leading to a confrontation that exposes the true nature of loyalty and betrayal. The climax reveals how deeply intertwined their lives are, as personal stakes clash with the quest for justice. In the aftermath, each character is left to reckon with the emotional fallout, their relationships forever altered by the truths they uncovered. The resolution carries the weight of loss and the fragility of their social fabric, leaving them to navigate a world forever changed by the events of that fateful night.

## Emotional register at this point in the story
A revelation about the clock alters the perceived timeline of the murder.

## Character Portraits (appearance & era)

### Eleanor Voss
Eleanor Voss embodies the charm and grace of a socialite navigating the complexities of a society on the brink of upheaval. With her husband’s financial troubles looming over her, she is desperate to maintain her status and protect her family's legacy, reflecting the pressures felt by many during this tense period. Her secret struggles with debt and the desire to uphold appearances create a poignant intersection with the broader societal anxieties of the time.
Era intersection: In this moment of rising tensions, Eleanor's efforts to maintain her social standing resonate deeply with the fears of many who face economic uncertainty.

### Dr. Mallory Finch
As a dedicated physician, Dr. Mallory Finch represents the struggle of the working class amidst the economic turmoil of the 1930s. Her resentment towards the affluent, who disregard her contributions, highlights the growing divide between classes. The pressures of maintaining her clinic while grappling with the fallout from the victim’s smear campaign reflect the broader societal tensions and the fight for recognition faced by many professionals during this time.
Era intersection: Mallory's conflict with the upper class mirrors the rising class resentments of the era, emphasizing the battle for dignity and respect.

### Captain Ivor Hale
Captain Ivor Hale is a man haunted by his past, struggling with a scandal that threatens his reputation. His quest for redemption in a society where honor is paramount reveals the emotional toll of living under scrutiny. As the world outside edges towards war, Ivor's internal conflict regarding honor and revenge resonates with the broader fears of a society grappling with its values and the consequences of past actions.
Era intersection: Ivor's pursuit of honor reflects the societal pressures of the time, where personal reputation becomes increasingly intertwined with national identity.

## Character Voices

### Eleanor Voss (she/her/her)
Eleanor speaks with a refined cadence, often punctuating her sentences with gentle laughter or subtle irony, especially when discussing societal norms.
[comfortable] Oh, darling, isn't it just delightful to see everyone gathered here? The garden has never looked so splendid.
[evasive] I'm sure it was merely a misunderstanding; Eleanor always loved to stir the pot a bit, didn't she?
[stressed] I just can't let anyone find out about the debts... It would ruin everything!
Humour: Her understated humor often masks deeper anxieties, making her charm both alluring and vulnerable.

### Dr. Mallory Finch (she/her/her)
Dr. Finch speaks with a measured tone, often laced with dry humor that surfaces at unexpected moments.
[comfortable] Ah, the joys of medicine! If only it paid as well as gossip.
[evasive] I suppose one could argue that a smear campaign is just another form of patient care.
[stressed] This is a matter of my clinic's survival—do you understand the stakes?
Humour: Her dry wit serves as a coping mechanism, revealing her frustrations with societal expectations.

### Captain Ivor Hale (he/him/his)
Ivor's speech is punctuated by a slight formality, often leaning towards self-deprecation, especially when discussing his past.
[comfortable] The sea teaches you many things, but I've yet to master the tides of social life.
[evasive] Let’s not dwell on past mistakes; they’re rather like old shipwrecks—better left under the waves.
[stressed] I must reclaim my honor; it's all I have left!
Humour: His self-deprecating humor reflects his internal struggles, making him relatable amidst his turmoil.

## Location Registers (scene framing guides)

The Drawing Room: The drawing room feels heavy with foreboding, a space once filled with laughter now shadowed by tragedy. The flickering candlelight casts unease, as every corner seems to hold whispers of secrets untold.. Camera angle: Entering this space, a writer should feel the oppressive weight of hidden truths, poised to unravel amidst the lavish decor.. Era: The opulence of the room contrasts sharply with the underlying tensions of the time, amplifying the emotional stakes of the gathering.

The Library: The library is a sanctuary of knowledge, yet it carries an air of mystery and foreboding. Dusty tomes sit silently, holding secrets that pulse beneath the surface, echoing the tension of the unfolding drama.. Camera angle: A writer should approach this space with a sense of intrigue, ready to uncover hidden truths within the volumes of the past.. Era: The musty scent of old paper mingles with the chill of the overcast winter, creating an atmosphere ripe for discovery.

The Study: The study is a haven of intellect and creativity, yet it feels stifled by the weight of history. Each artifact speaks of the past, while the ticking clock reminds all of the urgency of the present.. Camera angle: Entering this room, a writer should sense the conflict brewing within its walls, where intellect clashes with desperation.. Era: In this era of rising tensions, the study serves as a battleground for thoughts and emotions, as characters grapple with their legacies.

The Gardens: The gardens, with their vibrant flower beds and winding paths, feel deceptively tranquil amidst the turmoil. Yet, the shadows lurking between the hedges hint at secrets waiting to be revealed.. Camera angle: A writer should approach this space with caution, aware that beauty can often conceal darker truths.. Era: The overgrown hedges reflect the chaotic emotions of the characters, mirroring the societal tensions of the time.

## Humour guidance for this story position (mid)
Permission: forbidden
Rationale: The atmosphere is tense as the investigation deepens.

## Character Pressure
Dr. Mallory Finch is approaching a point of breakdown. Stress and strain should be accumulating visibly — through behaviour, not statement. No confrontation yet.

## Reveal Groundwork (texture — do not explain, only plant)
- Plant one subtle observable beat related to: "The moment Eleanor's body is discovered not only shocks the guests but also sets off a chain of suspicion that alters their relationships forever". Do not explain significance yet.
- Plant one subtle observable beat related to: "Plant one subtle anomaly that can be re-read after the resolution.". Do not explain significance yet.
- Plant one subtle observable beat related to: "Plant one subtle anomaly that can be re-read after the resolution.". Do not explain significance yet.

FAIR-PLAY AND INFERENCE CONTRACT:
- FAIR PLAY CLUE TIMING: Never combine clue discovery and detective deduction in the same chapter. If a clue is first revealed to the reader in chapter N, the detective may only analyze, deduce from, or act on that clue in chapter N+1 or later.
- FAIR PLAY INFORMATION PARITY: The reader must see all clues BEFORE the detective uses them in reasoning. If the detective performs a test or makes a deduction, every piece of evidence supporting that conclusion must have been shown to the reader in earlier chapters.
- FAIR PLAY REVELATION SPACING: In the discriminating test scene, the detective can ONLY use clues that were revealed to the reader at least 1 full chapter earlier. Never introduce new clues or withheld information during the test.
- FAIR PLAY CONFRONTATION: During the final confrontation/revelation, the detective cannot surprise the reader with facts. Every piece of evidence cited must have been visible to the reader in prior chapters.
- Never solve by withheld information. Keep reader-information parity with detective reasoning.
- False assumption in force: The murder of Eleanor Voss must have happened at the time indicated by the clock at the manor.
- Hidden truth to progressively expose: The actual time of the murder was earlier, allowing Beatrice Quill to execute her plan unseen.
- Inference path checkpoints to dramatize clearly (observation -> correction -> effect):
  - Step 1: obs: The clock shows quarter past nine, but witnesses recall dinner starting at nine o'clock. | corr: This discrepancy suggests that the clock may not reflect the actual time. | effect: Narrows investigation to the clock's integrity.
  - Step 2: obs: A faint scratch is found on the clock casing, indicating possible tampering. | corr: The scratch suggests someone may have altered the clock. | effect: Eliminates the idea that the clock was functioning normally.
  - Step 3: obs: Guests recall Eleanor was last seen at eight forty-five, but the clock suggests she was alive until later. | corr: This indicates that the murder happened before the clock shows. | effect: Eliminates the idea that Eleanor was alive until nine.
- Discriminating test method: trap
- Discriminating test design constraint: The discriminating test compares clock, quarter, and witness against the claimed timeline.
- Test must rely on already-shown clue IDs: clue_1, clue_2, clue_3, clue_core_contradiction_chain, clue_fp_contradiction_step_2, clue_mechanism_visibility_core
- Fair-play rationale: Step 1: The clock's time discrepancy and witness accounts indicate a possible tampering. Step 2: The scratch on the clock casing suggests intentional manipulation. Step 3: Guests' conflicting timelines reveal the clock's misleading nature.

## Character Reference

### Eleanor Voss (she/her — NEVER he/him)
Eleanor speaks with a refined cadence, often punctuating her sentences with gentle laughter or subtle irony, especially when discussing societal norms
She has a penchant for using flowery language but can switch to directness when pressed.
Eleanor experiences a profound internal conflict, torn between her desire to uphold her social image and the reality of her financial struggles. She fears that revealing her true circumstances would lead to ostracism from the very society she has long cherished.

### Dr. Mallory Finch (she/her — NEVER he/him)
Finch speaks with a measured tone, often laced with dry humor that surfaces at unexpected moments
She tends to use medical jargon casually, but when discussing societal issues, her speech becomes more pointed and passionate.
Mallory carries a deep-seated conflict, torn between her dedication to her patients and her growing disdain for the society that overlooks her. She wrestles with feelings of inadequacy and the question of whether she can truly succeed in a world that seems rigged against her.

### Captain Ivor Hale (he/him — NEVER she/her)
Ivor's speech is punctuated by a slight formality, often leaning towards self-deprecation, especially when discussing his past
He has a tendency to use nautical metaphors, which adds a layer of charm to his dialogue.
Ivor is locked in a battle with his conscience, grappling with guilt over the lives lost due to his past decisions. The desire for revenge is tempered by the need for redemption, creating a constant tug-of-war within him.


## CHARACTER CONTRACTS (binding for this scene)
Each entry below constrains how this character must be written in this chapter.
These override generic style guidance when they conflict.

### Eleanor Voss[SHE]
Voice & mannerisms: Eleanor speaks with a refined cadence, often punctuating her sentences with gentle laughter or subtle irony, especially when discussing societal norms. She has a penchant for using flowery language but can switch to directness when pressed.
Sample voice fragments (match this register and rhythm):
  [comfortable] "Oh, darling, isn't it just delightful to see everyone gathered here? The garden has never looked so splendid."
  [evasive] "I'm sure it was merely a misunderstanding; Eleanor always loved to stir the pot a bit, didn't she?"
Humour: understatement — deploy occasionally (level 0.4)
FORBIDDEN phrase (never write for Eleanor Voss): "the situation was extremely serious"
Act 2 behaviour contract: May show unease, evasion, or mild defensiveness when questioned. One behavioural tell is permitted. Internal conflict emerging: "Eleanor experiences a profound internal conflict, torn between her desire to uphold her social image and the reality of her financial struggles. She fears that revealing her true circumstances would lead to ostracism from the very society she has long cherished."

### Dr. Mallory Finch[SHE]
Voice & mannerisms: Dr. Finch speaks with a measured tone, often laced with dry humor that surfaces at unexpected moments. She tends to use medical jargon casually, but when discussing societal issues, her speech becomes more pointed and passionate.
Sample voice fragments (match this register and rhythm):
  [comfortable] "Ah, the joys of medicine! If only it paid as well as gossip."
  [evasive] "I suppose one could argue that a smear campaign is just another form of patient care."
Humour: dry wit — deploy occasionally (level 0.5)
FORBIDDEN phrase (never write for Dr. Mallory Finch): "a surge of determination washed over her"
Act 2 behaviour contract: May show unease, evasion, or mild defensiveness when questioned. One behavioural tell is permitted. Internal conflict emerging: "Mallory carries a deep-seated conflict, torn between her dedication to her patients and her growing disdain for the society that overlooks her. She wrestles with feelings of inadequacy and the question of whether she can truly succeed in a world that seems rigged against her."

### Captain Ivor Hale[HE]
Voice & mannerisms: Ivor's speech is punctuated by a slight formality, often leaning towards self-deprecation, especially when discussing his past. He has a tendency to use nautical metaphors, which adds a layer of charm to his dialogue.
Sample voice fragments (match this register and rhythm):
  [comfortable] "The sea teaches you many things, but I've yet to master the tides of social life."
  [evasive] "Let’s not dwell on past mistakes; they’re rather like old shipwrecks—better left under the waves."
Humour: self deprecating — deploy occasionally (level 0.6)
FORBIDDEN phrase (never write for Captain Ivor Hale): "she knew with certainty she was right"
Act 2 behaviour contract: May show unease, evasion, or mild defensiveness when questioned. One behavioural tell is permitted. Internal conflict emerging: "Ivor is locked in a battle with his conscience, grappling with guilt over the lives lost due to his past decisions. The desire for revenge is tempered by the need for redemption, creating a constant tug-of-war within him."



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
A sprawling manor house steeped in secrets, surrounded by lush gardens and dense woodlands.

Key Locations Available:
- The Drawing Room (interior): Crime scene
- The Library (interior): Clue discovery
- The Study (interior): Gathering space
- The Gardens (exterior): Potential hiding spots

Atmosphere (tonal cue only — do NOT reproduce this phrase verbatim in prose; translate into scene-specific, character-observed sensory language): Tense and foreboding, reflecting underlying social tensions and the pressures of the Great Depression.
Weather: Overcast with occasional rain showers, typical of the British climate.

Era markers: petrol touring cars on winding roads | early home telephones with party lines | typewriters in the study

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
  - Visual: flickering candlelight, dark oak paneling, crimson velvet drapes
  - Sounds: crackling fire, echo of footsteps, distant thunder
  - Scents: beeswax and smoke, old leather, damp wood
  - Touch: smooth piano keys, cold marble mantel

The Library (interior):
  - Visual: dusty leather-bound volumes, globe with faded colors, flickering candlelight
  - Sounds: soft rustle of pages, whisper of footsteps, distant thunder
  - Scents: old paper and ink, musty leather, polished wood
  - Touch: smooth book spines, cold desk surface

The Study (interior):
  - Visual: heavy drapes blocking out light, typewriter on the desk, portraits gazing down
  - Sounds: clacking of typewriter keys, soft rustle of paper, distant thunder
  - Scents: fresh ink, polished wood, old leather
  - Touch: smooth typewriter keys, cold metal of a paperweight

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

- In January 1939, life in England was marked by uncertainty as the shadows of World War II loomed on the horizon
- The Great Depression had left many struggling, with rising unemployment and class tensions creating a volatile social atmosphere
- While the privileged elite held their lavish gatherings, the lower classes faced grim realities, leading to resentment and unrest
- Daily life revolved around strict social rituals, with afternoon teas and formal dinners serving as both refuge and battleground for status
- The air was thick with an oppressive sense of foreboding, as whispers of impending conflict spread among the population

TEMPORAL CONTEXT:

This story takes place in January 1939 during winter.

Seasonal Atmosphere:
- Weather patterns: overcast skies, occasional rain showers, chilly winds
- Daylight: Short winter days with dim sunlight, dusk settling by four o'clock in the afternoon
- Seasonal activities: indoor games by the fireplace, hunting parties in the countryside, evening gatherings with card games and gossip
- Seasonal occasions: New Year's Day (January 1)
- Season: winter

Period Fashion (describe naturally):
- Men formal: three-piece wool suit with a waistcoat, tweed blazer, black leather shoes
- Men casual: knitted pullover, flannel trousers, corduroy waistcoat
- Men accessories: fedora hat, silk tie, pocket watch
- Women formal: tea-length dress with a defined waist, fur-trimmed evening gown, tailored coat
- Women casual: knitted cardigan, A-line skirt, blouse with a high collar
- Women accessories: cloche hat, pearls, gloves

Cultural Context (reference naturally):
- Music/entertainment: 'We'll Meet Again' by Vera Lynn, 'The White Cliffs of Dover', Swing music gaining popularity; Films: 'The Adventures of Sherlock Holmes', 'The Four Feathers'; Theatre: 'The Lady from the Sea', 'Pygmalion'; Radio: BBC News broadcasts, variety shows featuring popular singers
- Typical prices: Loaf of bread: four pence, Cinema ticket: one shilling, Milk: three pence per pint
- Current events: rising tensions in Europe with the threat of World War II; debate over British rearmament
- Literature: 'The Maltese Falcon' by Dashiell Hammett | 'The Grapes of Wrath' by John Steinbeck | 'The Heart is a Lonely Hunter' by Carson McCullers | [detective fiction] | [social realism] | [historical novels]
- Technology: the first commercial television broadcasts | advancements in radio technology | the introduction of household appliances like electric toasters | home telephones with party lines | typewriters for business correspondence | petrol cars for traveling
- Daily life: attending community meetings, engaging in home crafting or knitting, visiting local markets
- Social rituals: afternoon tea gatherings, formal dinner parties with strict etiquette, weekly church services followed by community discussions

Atmospheric Details:
The damp chill of the evening air clung to the skin, as heavy clouds loomed above, threatening more rain. Inside the country house, the low crackle of the fire barely kept the encroaching darkness at bay, casting flickering shadows across the wallpaper. The scent of freshly polished wood mingled with the faint aroma of wet earth, a reminder of the outside world as the guests huddled together, their whispers barely audible over the rain.

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
- Clas
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

• [clue_4] Eliminates Captain Ivor Hale because he was seen conversing with guests in the dining room during the timeframe of the incident.
  Category: testimonial | Criticality: essential | Supports inference step 3
  Points to: Confirms that Captain Ivor Hale could not have committed the crime.

• [clue_3] This indicates that the murder of Eleanor Voss happened before the timekeeping device shows.
  Category: temporal | Criticality: essential | Supports inference step 3
  Points to: Contradicts the assumption that the timekeeping device reflects the actual time.

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

CLUES ALREADY REVEALED TO READER: clue_mechanism_visibility_core, clue_core_contradiction_chain, clue_fp_contradiction_step_2, clue_culprit_direct_beatrice_quill, clue_2, clue_7 — do not reveal these as new information.

INVESTIGATION LOG — WHAT IS ESTABLISHED (do not re-establish, do not repeat):
• Evidence in reader's hands: A mechanical timekeeping device at the manor has been tampered with to mislead the timeline of events surrounding Eleanor Voss's murder. | The timekeeping device shows quarter past nine, but witnesses recall dinner starting at nine o'clock. | A faint scratch is found on the clock casing, indicating possible tampering. | Direct evidence ties Beatrice Quill to the mechanism access point before the discriminating test. | Guests recall Eleanor was last seen at eight forty-five, but the timekeeping device suggests she was alive until later. | Guests noted that the timekeeping device chimed incorrectly, causing confusion about the time.
• Suspects still unresolved: Captain Ivor Hale[HE]
⚠ The story must move FORWARD from this log. Any beat already listed above is forbidden from repeating.

⚠ THIS CHAPTER'S REQUIRED ADVANCE (mid): Test one suspect's alibi against a known fact — result must be stated

CONTINUITY HANDOFF — previous chapter closing beat:
  • "As the rain continued to fall outside, the weight of the situation pressed down on them all. Mallory took a step back, allowing Beatrice a moment to collect herself. "We will get to the bottom of this, Beatrice. But I need your full cooperation. If you truly w..."
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
Chapter 2: Chapter 2: The Clock's Secret
  Events: The evening air was thick with tension as the rain continued to patter against the windows of Little Middleton Manor.
Chapter 3: Chapter 3: The Scratch
  Events: As she straightened, Mallory's mind raced with the possibilities.
Chapter 4: Chapter 4: Questioning Beatrice
  Events: Beatrice's eyes darted around the room, avoiding direct contact with Mallory's gaze.

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
Known location profile anchors: Little Middleton Manor, The Drawing Room, The Library, The Study, The Gardens, the dining room
LOCATION NAME CAPITALISATION (HARD REQUIREMENT — validated):
All named locations in your prose MUST use the EXACT capitalisation from the CML profiles.
Canonical forms: "Little Middleton Manor", "The Drawing Room", "The Library", "The Study", "The Gardens", "the dining room"
Writing a location in lowercase (e.g. "drawing room" instead of "Drawing Room") is a validated error. Every time you mention a named location, copy its capitalisation from the list above.
- Chapter 5: OPENING STYLE (HARD): Start the VERY FIRST SENTENCE with a temporal subordinate clause — e.g. "When [Name] entered…" / "After the last guest…" / "Before the household had stirred…" / "As the light faded…". Anchor opening in "the dining room". HARD REQUIREMENT for the first 2 paragraphs: (a) include 2+ sensory words — choose from smell/scent/sound/echo/silence/creak/whisper/cold/warm/damp/rough/smooth/glow/shadow/flicker/dim — and (b) include 1+ atmosphere/time word — choose from rain/wind/fog/storm/mist/thunder/evening/morning/night/dawn/dusk/season/afternoon/midday/noon/midnight/twilight/sunrise/sunset/daylight/sunlight/overcast/cloudy/bright/dark. These are validated requirements, not style suggestions; missing them triggers a retry.

[⚠ INTERNAL QUALITY DIAGNOSTICS — DO NOT REPRODUCE ANY PART OF THIS SECTION IN YOUR STORY OUTPUT. These are private generator observations for your consideration only. Your narrative must read as if this section does not exist. Never include phrases from this block in character dialogue, narration, or description.]

PRIOR CHAPTER QUALITY OBSERVATIONS:
- Chapter 3 (score 97/100):
  Quality gaps noted: word density below preferred target (942/1000)
  Address in upcoming chapters: Increase chapter density with concrete investigation action and sensory-grounded beats; avoid recap-only padding.
- Chapter 4 (score 93/100):
  Quality gaps noted: word density below preferred target (877/1000); scene grounding weakness
  Address in upcoming chapters: Increase chapter density with concrete investigation action and sensory-grounded beats; avoid recap-only padding. | Open next chapter with a named location anchor plus at least two sensory cues and one atmosphere marker.
- Phrases to avoid (already overused in earlier chapters): "against the windows of little middleton manor", "mallory s resolve hardened she would uncover", "s resolve hardened she would uncover the", "resolve hardened she would uncover the truth", "hardened she would uncover the truth no", "she would uncover the truth no matter", "would uncover the truth no matter how", "mallory noted the tremor in beatrice s", "the drawing room once a sanctuary of", "uncover the truth no matter how painful".
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

PROMPT BUDGET SUMMARY: budget=32000 tokens; fixed=10437; context=11434; dropped=[none]; truncated=[temporal_context, pronoun_accuracy]

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
4. Integrate at least two concrete era-grounded details per chapter from setting refinement signals: petrol touring cars on winding country roads | early home telephones with party lines | typewriters in offices | telephone communications subject to delays | telegram services through local offices | airmail available for urgent correspondence.
5. Respect setting movement/access constraints in scene action and alibis: manor architecture creates numerous rooms and hidden spaces | gardens provide both beauty and potential hiding spots | outbuildings may restrict movement and access | restricted areas such as the study and cellar | permissions required for entry to the library and master bedroom.
6. Sustain social coherence with this backdrop pressure: A gathering at the manor for a family reunion and estate planning unites heirs and staff under the looming pressures of the Great Depression and rising class tensions, heightening the stakes of loyalty and betrayal.
7. Maintain continuity around these socially central cast anchors where relevant: Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill.
8. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Critical: Plot similarity 0.80 with 'The Mysterious Affair at Styles' (same murder method and country manor setting)
9. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Moderate: Character similarity 0.70 with 'The Mysterious Affair at Styles' (similar cast structure and roles)
10. STORY TO DATE ANTI-COPY RULE: The STORY TO DATE section below is provided for chronological and factual reference ONLY. You MUST NOT copy, lightly rephrase, or structurally echo any sentence or paragraph from prior chapters. Every sentence in this chapter must be original prose unique to this scene. Reusing even a clause from prior chapter text will cause this attempt to fail immediately.

CRITICAL PROSE REQUIREMENTS:

The CML specifies exact requirements for certain validation-critical scenes. You MUST include these elements at the specified positions.

**Discriminating Test Scene (Act 3, Scene 4):**
Required elements: Execute the discriminating test, Observe the guests' contradictions, Draw conclusion about the clock's tampering
Test type: trap

**Suspect Clearance Scenes:**
- Dr. Mallory Finch (Act 3, Scene 5): Proven alibi during the time of the murder
  Clues: alibi_window
- Captain Ivor Hale (Act 3, Scene 5): Witnesses affirm his presence elsewhere at the time
  Clues: witness statement

**Culprit Revelation Scene (Act 3, Scene 6):**
Method: Confrontation with evidence of clock tampering

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
- Chapter 5:
  - STRUCTURAL ARCHETYPE — Chapter 5 must be: RED_HERRING
      ✓ MUST contain: wrong lead followed and disproved
      ✗ MUST NOT contain: final culprit identified
  - Word count: Target 1250 words. Achieve this through plot events, dialogue exchanges, and physical investigation — not through atmospheric repetition or extended internal reflection. Each 200-word segment should contain at minimum one concrete story event (a discovery, a conversation exchange, a physical action or movement). Padding with atmosphere alone is not acceptable.
  - Opening: Begin with a character action, spoken line, or clock/time marker — never a location name or location-description phrase.
  - Scene is set in: the dining room — reference it naturally within the paragraph, never as your opening phrase.
  - Opening atmosphere (MANDATORY — validator enforced): the first paragraph MUST contain at least one of: rain / wind / fog / storm / mist / thunder / evening / morning / night / dawn / dusk / season / afternoon / midday / noon / midnight / twilight / sunrise / sunset / daylight / sunlight / overcast / cloudy / bright / dark / grey / pale / cold / warm / chill / crisp / damp / drizzle / haze / lamplight / firelight. A chapter that omits all of these from its opening paragraph will be rejected.
  - Continuity bridge: in the first 120 words, visibly connect from the previous chapter's final beat. Carry forward one unresolved element (object, accusation, emotional pressure, or immediate physical action) from: "As the rain continued to fall outside, the weight of the situation pressed down on them all. Mallory took a step back, allowing Beatrice a moment to collect herself. "We will get to the bottom of this, Beatrice. But I ne...".
  - CLUE OBLIGATIONS — mandatory prose elements (do NOT omit or bury):
    • Guests recall Eleanor was last seen at eight forty-five, but the timekeeping device suggests she was alive until later. [clue_2]
      Points to: Indicates a conflict in the timeline surrounding Eleanor's last sighting.
    • Eliminates Captain Ivor Hale because he was seen conversing with guests in the dining room during the timeframe of the incident. [clue_4]
      Points to: Confirms that Captain Ivor Hale could not have committed the crime.
    • This indicates that the murder of Eleanor Voss happened before the timekeeping device shows. [clue_3]
      Points to: Contradicts the assumption that the timekeeping device reflects the actual time.
  - Tonal contrast: include at least one beat of relief or ironic counterpoint. Do not sustain maximum tension for every paragraph.
  - ALIBI LOCK: Beatrice Quill's established alibi is "During the murder". Do NOT place Beatrice Quill at any other location or in any other activity during the crime window. Any contradiction is a continuity error that triggers a retry.
  - TESTIMONY CONTINUITY: Beatrice Quill has already made statements in earlier chapters. Any time, location, or claim attributed to Beatrice Quill in THIS chapter must be consistent with those earlier statements. Do NOT introduce a new or different alibi claim — any contradiction is a continuity error.
- Locked fact phrase obligations:
  - If this batch mentions The exact time shown on the stopped clock face, write exactly: "ten minutes past eleven".
  - If this batch mentions The exact amount the clock was wound back, write exactly: "forty minutes".
- Seasonal vocabulary allow-list: winter, wintry, midwinter.
- Forbidden seasonal words: spring, summer, autumn.

⛔ PRONOUN TABLE — re-check after EVERY paragraph before writing the next:
    Eleanor Voss: she/her/her
    Dr. Mallory Finch: she/her/her
    Captain Ivor Hale: he/him/his
    Beatrice Quill: she/her/her
  Any sentence containing a pronoun must agree with this table. Correct mismatches before moving on.

FROZEN FACT STATE (DO NOT ALTER):
- Timeline anchor: January (winter).
- Month, season, weather, and time-of-year language in this batch must stay compatible with winter.
- Established timeline fact: Clock time shows quarter past nine
- Established timeline fact: Witnesses recall dinner starting at nine o'clock
- Established timeline fact: Eleanor was last seen at eight forty-five
- If referenced, use exact phrase: "ten minutes past eleven" (The exact time shown on the stopped clock face).
- If referenced, use exact phrase: "forty minutes" (The exact amount the clock was wound back).

STORY TO DATE (REFERENCE ONLY — DO NOT COPY VERBATIM):
- Full prior chapter text is provided below for continuity, factual consistency, and reference accuracy.
- Use this to keep character voice, chronology, clue state, and location continuity aligned with earlier chapters.
- Do not quote, copy, or paraphrase these paragraphs too closely; write fresh prose that remains consistent with them.

--- BEGIN PRIOR CHAPTER 1 ---
Title: Chapter 1: Discovery
The evening had turned dark and damp as rain pattered against the windows of Little Middleton Manor. the doctor Finch crossed the threshold into the manor's drawing room, her heart pounding with the weight of dread. The flickering candlelight cast long shadows across the room, where the air felt thick with an unspoken tension. She had been summoned hastily, the urgency of the message echoing in her mind. As she stepped further inside, the scent of damp wood mingled with the faint aroma of beeswax, a stark contrast to the unease that gripped her. The drawing room, once a place of laughter and warmth, now felt like a tomb, its opulence overshadowed by an impending sense of tragedy.

Mallory's gaze swept the room, landing on the figure sprawled on the plush carpet. Eleanor Voss lay motionless, her delicate features pale against the rich fabric. In her hand, she clutched a stopped pocket watch, its face still showing ten minutes past eleven. A chill raced down Mallory's spine as she knelt beside the body, her fingers brushing against the cold metal of the watch. This mechanical timekeeping device at the manor has been tampered with to mislead the timeline of events surrounding Eleanor Voss's murder. The implication was clear: the clock had been manipulated to conceal the truth about when Eleanor had died.

The reality of the situation began to settle in, and Mallory's mind raced with the possibilities. If Eleanor had died no later than ten minutes past eleven, then the alibis of those present during the dinner would need to be scrutinized closely. Who had the opportunity to alter the clock? The thought sent a shiver through her. Each guest had access to the drawing room, and any one of them could have committed the act. The room, once filled with the echoes of laughter, now resonated with the weight of suspicion. Mallory's heart sank at the thought of the tangled web of deceit that lay before her.

As she examined the watch more closely, she noticed a faint scratch on its casing, a detail that could not be overlooked. The evidence pointed to intentional tampering, and she could not shake the feeling that this was no mere accident. The clock had been wound back by forty minutes, a deliberate act to mislead anyone who might investigate. Who would go to such lengths? The question hung in the air, heavy with implications. Mallory's resolve hardened; she would uncover the truth, no matter how deep the secrets ran.

The atmosphere in the drawing room was thick with shock as guests began to gather, their murmurs rising in disbelief. Eleanor had been the heart of their social circle, a woman admired and envied in equal measure. Mallory stood, taking a moment to compose herself. She had to maintain her professionalism, even as the weight of the tragedy pressed down on her. Eleanor had always been so vibrant, so full of life. The thought of her lifeless body lying there was almost too much to bear. Yet, she reminded herself, this was not the time for grief; it was the time for investigation.

As the guests trickled into the room, Mallory caught sight of Beatrice Quill, Eleanor's closest confidante. Beatrice stood frozen, clutching a handkerchief, her eyes reflecting despair. "I can't believe this is happening," she whispered, her voice trembling. "Eleanor was just here, laughing and enjoying the evening. She had no enemies, not that I knew of." Mallory noted the tremor in Beatrice's hands, the way her gaze darted around the room, as if searching for answers. It was a moment that spoke volumes; the bond between the two women had been strong, yet now it was overshadowed by tragedy.

As the murmurs of disbelief continued, Mallory turned her attention back to Eleanor. The stopped pocket watch in the victim's hand was a silent witness to the events that had transpired. It would serve as a crucial piece of evidence in the investigation. She could not help but wonder what secrets Eleanor had taken to her grave. The drawing room, once a sanctuary of social gatherings, had become a stage for betrayal and suspicion. Mallory steeled herself; she would uncover the truth, no matter how painful it might be. The clock had stopped, but the investigation was just beginning.
--- END PRIOR CHAPTER 1 ---

--- BEGIN PRIOR CHAPTER 2 ---
Title: Chapter 2: The Clock's Secret
The evening air was thick with tension as the rain continued to patter against the windows of Little Middleton Manor. the doctor Finch stood in the drawing room, her heart racing as she focused on the lifeless form of Eleanor Voss sprawled on the plush carpet. The flickering candlelight cast dancing shadows across the room, illuminating the stopped pocket watch in Eleanor's hand. Mallory's gaze shifted to the clock on the mantelpiece, its face stubbornly displaying quarter past nine. The implications of this discrepancy weighed heavily on her mind, especially as she recalled the witnesses' claims that dinner was set to begin at nine o'clock. How could the clock show a different time? The thought sent a shiver down her spine as she knelt beside Eleanor, her fingers brushing against the cold metal of the watch.

The clock's time was a silent witness to the events that had transpired, yet it raised more questions than it answered. Mallory's mind raced. If the clock was accurate, then Eleanor had died before dinner was supposed to start. But if the guests were correct, then the clock had been tampered with to mislead anyone investigating the murder. His thoughts were interrupted by the sound of footsteps approaching, and he looked up to see the captain Hale enter the room, his brow furrowed with concern. He glanced nervously at the clock, then back at Mallory, as if searching for answers that were eluding them both.

As the guests began to gather, murmurs of disbelief filled the air, punctuated by the crackling of the fire. Eleanor's closest friend, Beatrice Quill, stood at the edge of the room, her face pale and drawn. "I can't believe this is happening," Beatrice whispered, clutching her handkerchief tightly. "Eleanor was just here, laughing and enjoying the evening. She had no enemies, not that I knew of." Mallory noted the tremor in Beatrice's hands and the way her gaze darted around the room, searching for some semblance of understanding amid the chaos. The bond between the two women had been strong, and now it was overshadowed by tragedy.

Captain Hale stepped forward, his voice low and steady. "We must figure out what happened here. The clock showing quarter past nine contradicts our recollections of dinner starting at nine o'clock. We need to understand why it shows that time." His eyes flickered with uncertainty, and Mallory could sense the tension rising among the guests. They were all grasping for clarity in a situation steeped in confusion and fear. Mallory felt the weight of their expectations pressing down on him, but he steeled himself. He would uncover the truth, no matter how painful it might be.

Eleanor's lifeless body lay like a haunting reminder of the fragility of life, and the drawing room, once a sanctuary of laughter and warmth, had transformed into a stage for betrayal and suspicion. The guests exchanged uneasy glances, their minds racing through the implications of the clock's time. Mallory took a deep breath, trying to maintain her composure as she prepared to question them. "We need to establish a timeline," she said, her voice firm. "When did you last see Eleanor? What were you doing at the time of her death?"

Beatrice's eyes widened, and she took a step back. "I was in the library, looking for a book. I didn't see her after dinner was announced. I thought she was just in the drawing room with the rest of you." Her voice trembled slightly, and Mallory noted the way Beatrice's hands fidgeted with the handkerchief, betraying her anxiety. The library was a distance from the drawing room, and Mallory couldn't help but wonder if Beatrice's alibi would hold up under scrutiny.

Captain Hale interjected, his tone urgent. "I was outside, checking the grounds. I needed some fresh air after the dinner preparations. I didn't see Eleanor after we all gathered in the dining room." Mallory raised an eyebrow at his statement. It was a curious choice to be outside when the evening had turned so dark and damp. She wondered if he was telling the truth or if he was simply trying to distance himself from the scene of the crime. The tension in the room was palpable, and Mallory could feel the weight of suspicion hanging over them all.

As the guests continued to argue about the timeline, Mallory's mind raced with the implications of the clock's time. It was clear that the discrepancies in their accounts needed to be addressed, but she also sensed that deeper secrets lay beneath the surface. The drawing room, once filled with the echoes of laughter, now resonated with the weight of hidden truths. Mallory's resolve hardened; she would uncover the truth, no matter how painful it might be. The clock had stopped, but the investigation was just beginning.
--- END PRIOR CHAPTER 2 ---

--- BEGIN PRIOR CHAPTER 3 ---
Title: Chapter 3: The Scratch
As the doctor Finch examined the clock on the mantelpiece, the rain continued its relentless patter against the windows of Little Middleton Manor, creating a rhythmic backdrop to the tension that filled the drawing room. Her brow furrowed in concentration as she leaned in closer to inspect the clock. The flickering candlelight cast long shadows across the room, illuminating the faint scratch on the clock casing. It was a detail that had not gone unnoticed, and it sent a jolt of realization through her. The clock, which had shown quarter past nine, now bore the mark of possible tampering. Mallory's heart raced as she considered the implications of this discovery. Who would go to such lengths to alter the time? The very thought sent a chill down her spine.

As she straightened, Mallory's mind raced with the possibilities. The scratch suggested that someone had deliberately manipulated the clock, raising doubts about the timeline surrounding Eleanor's death. If the clock had indeed been tampered with, it could mean that Eleanor had died before the time indicated, casting shadows of suspicion on everyone present. The guests' alibis would need to be scrutinized, and she felt the weight of their expectations pressing down on her. She turned to face the room, the tension palpable as she prepared to question the others. They were all gathered here, their faces a mix of shock and uncertainty, and she needed to uncover the truth before it slipped away.

the captain Hale stood near the window, his expression unreadable as he glanced between the clock and the others. "We must determine when Eleanor was last seen," she said, her voice steady despite the turmoil in the room. "The clock's time contradicts our recollections of dinner starting at nine o'clock. We need clarity." Mallory nodded, appreciating his resolve. The guests needed to understand that their recollections were now under scrutiny. She could sense the growing unease among them, and it only fueled her determination to get to the bottom of this mystery.

Beatrice Quill, Eleanor's closest friend, clutched her handkerchief tightly, her knuckles white as she spoke. "I was in the library, looking for a book. I didn’t see her after dinner was announced. I thought she was just in the drawing room with the rest of you." Her voice trembled slightly, and Mallory noted the way Beatrice's hands fidgeted, betraying her anxiety. The library was a considerable distance from the drawing room, and Mallory couldn't help but wonder if Beatrice's alibi would hold up under scrutiny. It was a curious choice to be in the library when the evening had turned so dark and damp. The question lingered in the air, heavy with implications.

Mallory turned his attention to Captain Hale. "And you, Captain? Where were you during this time?" He watched as he shifted uncomfortably, his gaze darting toward the clock before meeting his eyes. "I was outside, checking the grounds. I needed some fresh air after the dinner preparations. I didn’t see Eleanor after we all gathered in the dining room." His statement raised Mallory's eyebrows; it was a curious choice to be outside on such a dreary evening. She could sense the tension rising, and the weight of suspicion hung over them all. The drawing room, once a sanctuary of laughter, now felt like a stage for betrayal.

As the guests continued to defend their alibis, Mallory felt the urgency of the situation pressing down on her. Each account seemed to unravel the fabric of their shared memories, and she needed to piece together the truth before it slipped away like the rain outside. "We must establish a clear timeline of events," she said, her voice firm. "When did you last see Eleanor? What were you doing at the time of her death?" The room fell silent, the only sound the soft tick of the mantel clock, a reminder of the time that was slipping away.

Beatrice's eyes widened, and she took a step back. "I told you, I was in the library! I didn’t see her after dinner was announced!" Her voice rose in pitch, revealing the strain of her emotions. Mallory observed the tension in Beatrice's posture, the way her shoulders tensed as she spoke. It was a moment that spoke volumes; the bond between the two women had been strong, yet now it was overshadowed by tragedy. Mallory's resolve hardened; she would uncover the truth, no matter how painful it might be. The clock had stopped, but the investigation was just beginning.

Captain Hale's brow furrowed as he considered Beatrice's words. "If you were in the library, then who was with Eleanor? Someone must have seen her before... before this happened." His voice trailed off, and Mallory could see the gears turning in his mind. The others exchanged uneasy glances, each grappling with their own suspicions and fears. She felt the tension in the air, thick and suffocating, as they all wrestled with the reality of the situation. The drawing room, once filled with laughter and warmth, had transformed into a chamber of secrets, and Mallory was determined to expose them all.

As the rain continued to fall outside, the flickering candlelight cast an eerie glow across the room, illuminating the faces of the guests. Mallory took a deep breath, steeling herself for the next round of questioning. She knew that the truth was buried beneath layers of deception, and it was her job to peel them back, one by one. The scratch on the clock casing was just the beginning; she could feel it in her bones. The investigation was far from over, and she was prepared to confront whatever lay ahead.
--- END PRIOR CHAPTER 3 ---

--- BEGIN PRIOR CHAPTER 4 ---
Title: Chapter 4: Questioning Beatrice
The steady drumming of rain against the windows of the drawing room created a somber backdrop as the doctor Finch prepared for the next round of questioning. The flickering candlelight cast shadows that danced across the room, highlighting the tension in the air. Mallory took a deep breath, her resolve steeling as she turned to face Beatrice Quill, who stood nervously by the fireplace, her hands twisting the delicate fabric of her handkerchief. The echoes of disbelief still lingered from the previous night, and the urgency of the situation weighed heavily on Mallory's mind. Eleanor's lifeless body had shattered the tranquility of their gathering, and now, the truth seemed as elusive as the fading light outside.

Beatrice's eyes darted around the room, avoiding direct contact with Mallory's gaze. "I still can't believe she's gone," Beatrice murmured, her voice barely above a whisper. "Eleanor was... she was everything to us." Mallory noted the tremor in Beatrice's voice, the way her hands fidgeted as if seeking comfort in the fabric. It was a subtle but telling sign of her distress, and Mallory couldn't shake the feeling that Beatrice was hiding something. She stepped closer, her tone measured yet firm. "Beatrice, I need you to tell me exactly what you were doing last night after dinner was announced."

Beatrice hesitated, her brow furrowing as she searched for the right words. "I was in the library, looking for a book. I thought I could find something to distract myself, you know? I didn’t see Eleanor after that." The way she spoke felt rehearsed, as if she had prepared this alibi in advance. Mallory's instincts prickled with suspicion. "You didn’t see her at all? Not even when you left the library?" Beatrice shook her head, her expression a mix of confusion and fear. "No, I swear. I thought she was with the others in the drawing room."

Mallory's mind raced as she recalled the timeline. "But Eleanor was last seen at eight forty-five, and the clock shows quarter past nine. That means she could have been alive when you were in the library. Why didn’t anyone see her?" Beatrice's eyes widened, and she took a step back, her voice rising in pitch. "I told you, I was looking for a book! I didn’t think anything of it!" The desperation in her tone was palpable, and Mallory felt a knot tighten in her stomach. Beatrice's nervous demeanor was becoming increasingly suspect. What was she hiding?

Captain Hale, who had been listening intently from the corner of the room, interjected. "We need to clarify this. If you were in the library, then who was with Eleanor? Someone must have seen her before... before this happened." Her gaze shifted between Mallory and Beatrice, the weight of her words hanging heavily in the air. Mallory could see the tension rising, the guests exchanging uneasy glances as they grappled with the implications of their memories. Beatrice's voice trembled as she replied, "I... I don’t know! I thought she was just in the drawing room!"

Mallory's resolve deepened as she pressed further. "The clock on the mantelpiece chimed incorrectly, causing confusion about the time. We must establish a clear timeline of events. You had access to the clock mechanism, Beatrice. You could have tampered with it. Why would you do that?" The accusation hung in the air, heavy with implications. Beatrice's face paled, and her hands shook as she clutched the handkerchief tighter. "I would never hurt Eleanor! She was my friend!"

The atmosphere in the drawing room felt charged, the flickering candlelight casting eerie shadows across Beatrice's face. Mallory could sense the mounting pressure, the urgency of the situation pressing down on them all. "I need you to be honest with me, Beatrice. Did you alter the clock?" Beatrice's eyes widened, and for a moment, silence enveloped the room. Mallory could see the internal struggle on Beatrice's face, the conflict between her loyalty to Eleanor and the fear of being implicated. The tension was palpable, and Mallory knew that the truth was buried beneath layers of deception.

Finally, Beatrice spoke, her voice barely above a whisper. "I didn’t mean to! I just... I wanted to protect her!" The revelation hung in the air, a confession that shifted the focus of the investigation. Mallory's heart raced as she processed Beatrice's words. Protect her from what? The implications were staggering, and the pieces of the puzzle were beginning to align. The clock had been tampered with, and Beatrice's access to it now implicated her in the deception. The drawing room, once a space of warmth and laughter, had become a chamber of secrets, and Mallory was determined to uncover the truth.

As the rain continued to fall outside, the weight of the situation pressed down on them all. Mallory took a step back, allowing Beatrice a moment to collect herself. "We will get to the bottom of this, Beatrice. But I need your full cooperation. If you truly want to protect Eleanor's memory, you must be honest with me." Beatrice nodded slowly, her expression a mixture of fear and determination. Mallory could sense a shift in the atmosphere; the tension was still thick, but there was a glimmer of hope that the truth might finally emerge from the shadows.
--- END PRIOR CHAPTER 4 ---

[SCENE COMPLETENESS CONTRACTS — MANDATORY. Each contract below lists what you MUST enact in that chapter. Do not summarise or mention these labels in the prose — enact them organically.]
Chapter 5 (Act 2) completeness contract:
  PIVOT ELEMENT (MANDATORY — write this into the prose, shown not told): "Captain Hale's assertion that he was conversing with guests during the timeframe."
  FACT ESTABLISHED (MANDATORY — reader must know this by chapter end): "Establishes that Captain Hale was seen with guests, clearing him of suspicion."

# Case Overview
Title: The Clock of Deceit
Era: 1930s
Setting: Little Middleton
Crime: murder (mechanical clock tampering)
Culprit: Beatrice Quill
False assumption: The murder of Eleanor Voss must have happened at the time indicated by the clock at the manor.
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
    "sceneNumber": 5,
    "act": 2,
    "title": "Alibis Unravel",
    "setting": {
      "location": "the dining room",
      "timeOfDay": "Late afternoon",
      "atmosphere": "Growing tension as alibis are tested"
    },
    "characters": [
      "Dr. Mallory Finch",
      "Captain Ivor Hale",
      "Eleanor Voss"
    ],
    "purpose": "Test alibis against the timeline",
    "cluesRevealed": [
      "clue_4",
      "clue_3"
    ],
    "dramaticElements": {
      "conflict": "Contradictions arise among the guests.",
      "tension": "The pressure mounts as alibis are scrutinized.",
      "microMomentBeats": [
        "Ivor's fists clench at his sides as he hears the accusations."
      ]
    },
    "summary": "In the dining room, the doctor Finch questions Captain Hale and Eleanor about their whereabouts during the murder. Their alibis begin to unravel, revealing conflicting timelines that heighten the tension.",
    "estimatedWordCount": 1800,
    "pivotElement": "Captain Hale's assertion that he was conversing with guests during the timeframe.",
    "factEstablished": "Establishes that Captain Hale was seen with guests, clearing him of suspicion.",
    "permittedBehavioursByAct": [
      {
        "characterName": "Dr. Mallory Finch",
        "behaviour": "May show unease, evasion, or mild defensiveness when questioned."
      },
      {
        "characterName": "Captain Ivor Hale",
        "behaviour": "May show unease, evasion, or mild defensiveness when questioned."
      },
      {
        "characterName": "Eleanor Voss",
        "behaviour": "Show normal social behaviour; grief or confusion if appropriate."
      }
    ],
    "redHerringPlacement": null,
    "emotionalRegister": "A revelation about the clock alters the perceived timeline of the murder.",
    "dominantCharacterNote": {
      "name": "Eleanor Voss",
      "voiceRegister": "Eleanor speaks with a refined cadence, often punctuating her sentences with gentle laughter or subtle irony, especially when discussing societal norms."
    },
    "humourGuidance": {
      "permission": "forbidden"
    },
    "eraTextureNote": "Short winter days with limited natural light; Chilly winds and frequent rain affecting outdoor activities; Travel restrictions due to economic hardship limiting movement",
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
