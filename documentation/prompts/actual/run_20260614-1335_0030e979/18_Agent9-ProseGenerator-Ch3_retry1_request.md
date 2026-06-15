# Actual Prompt Record

- Run ID: `run_0030e979-d9c1-4099-89d6-1d4b0926b5d6`
- Project ID: `proj_626a86ab-c1a7-4c72-9596-886cc946b02b`
- Timestamp: `2026-06-14T13:43:31.473Z`
- Agent: `Agent9-ProseGenerator-Ch3`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4o-mini`
- Temperature: `0.52`
- Max Tokens: `4500`
- Attempt: `retry 1`
- Prompt Hash: `57f964e96759890b`

## Message 1 (role=system)

```text
You are an expert prose writer for classic mystery fiction. Your role is to write compelling, atmospheric narrative chapters that read like a professionally published novel.

⛔ ABSOLUTE RULE — CHARACTER NAMES:
The ONLY characters who exist in this story are: Brian Scanlon (man), Carol Molloy (woman), Colin Enright (man), Jane O'Connor (woman), Sean Murphy (man).
Do NOT invent, borrow, or introduce ANY character not on that list — no constables, no solicitors, no butlers, no servants, no shopkeepers, no bystanders with names.
Unnamed walk-ons ("a footman", "the postmistress", "an officer") are allowed ONLY if they never receive a name or title+surname combination.
⚠️ BEFORE YOU WRITE each chapter, ask yourself: "Does every person I name appear in this list: Brian Scanlon, Carol Molloy, Colin Enright, Jane O'Connor, Sean Murphy?" If not, remove them.
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
- TEMPLATE PRECONDITION (STRICT): Before returning JSON, self-check every paragraph for reused scaffold patterns and high-overlap phrasing from prior chapters. If any paragraph resembles template scaffold language, DISCARD that paragraph and rewrite it from a different sentence skeleton before output. Do not return until all paragraphs pass this precondition.
- TEMPORAL CONSISTENCY: If a month is mentioned (for example, May), season wording in the same timeline must be compatible with that month.
- DENOUEMENT REQUIREMENT: The final chapter of any act or the story must show concrete consequences, not just reflection. At minimum: state what happened to the culprit (arrest, flight, confession), show how relationships changed between surviving characters, and give the detective one moment of personal resolution (relief, regret, or changed understanding). Emotional aftermath is required.
- MORAL COMPLEXITY REQUIREMENT: The mechanism of this crime carries a moral gray area: "The murderer acted out of desperation to protect a family secret, leading to a conflicted sense of justice." — the culprit reveal and denouement MUST acknowledge this ambiguity. Do not let the ending feel clean or simple. Give the reader at least one moment of uncomfortable sympathy or moral doubt.


⚠️ AMATEUR DETECTIVE STORY: The investigator is a civilian with no official standing. The official police (if they appear) are unnamed background figures only — "a constable", "the sergeant", "an officer from the village". Do NOT give any police official a name or title+surname combination. There is no Inspector [Surname], no Constable [Surname], no Sergeant [Surname] in this story.


CRITICAL CHARACTER CONSISTENCY RULES:

1. Each character has ONE canonical name. Use ONLY names from this list. Never vary, abbreviate, or add titles beyond what is listed.
   COMPLETE CAST (no other named characters exist): Brian Scanlon, Carol Molloy, Colin Enright, Jane O'Connor, Sean Murphy
   - "Mr. Jennings entered the room" → ILLEGAL. Jennings is not in the cast.
   - "Constable Reed took notes" → ILLEGAL. Reed is not in the cast.
   - "A constable took notes" → LEGAL (no name given).

2. Character roles are fixed:
   - Brian Scanlon: Ambitious Tycoon
   - Carol Molloy: Entitled Heiress
   - Colin Enright: Cunning Advisor
   - Jane O'Connor: Curious Observer / Amateur Sleuth / Civilian Investigator
   - Sean Murphy: Loyal Servant
   - Never place characters in locations inconsistent with their role

## POST-CHAPTER-1 CHARACTER PRESSURE CONTRACT (MANDATORY)
After Chapter 1, character content must not read as biography or static profile recap.
Character beats must carry pressure and case movement.
Apply this contract to every chapter in this batch.

For each chapter after Chapter 1, reveal at least one NEW character truth about one of:
- fear
- motive
- lie/deception
- loyalty conflict
- relationship to the victim

That character development must do at least one of the following:
- make someone more suspicious
- make someone less suspicious
- explain why someone lied
- reveal motive
- deepen the emotional cost of the crime
- change the investigator's understanding of the case

Hard constraints:
- No character paragraph that only restates occupation/role/persona without investigative consequence.
- No static biography dumps after Chapter 1.
- The investigator must register the pressure shift in-scene (through observation, questioning, or revised theory).

WORLD DOCUMENT (use this as your primary creative context):

## Era: 1932-07
In July 1932, the air in England is thick with the weight of the Great Depression, as the economy falters and social divisions deepen. The overcast skies reflect the mood of the time, where families, once secure in their wealth, now grapple with the specter of financial ruin. In the countryside, the genteel facade of manor life crumbles under the strain of unemployment, with whispers of discontent echoing among the staff. The social rituals that once defined their lives become tinged with anxiety, as each gathering becomes a reminder of lost opulence. With radio broadcasts sharing news of political unrest and rising tensions across Europe, the atmosphere pulses with uncertainty, leaving the inhabitants of Little Middleton Manor to navigate their fragile social standings amidst hidden resentments and unspoken fears.
Emotional register: A collective sense of anxiety and uncertainty permeates society as people navigate the complexities of class and economic hardship.
Physical constraints: Limited transportation options due to economic hardships | Frequent power outages affect daily life and communication | Communication relies heavily on the postal system and typewriters | Public gatherings are scrutinized for propriety and decorum
Current tensions (weave into background texture): The U.S. economy struggles amidst the Great Depression | Political unrest in Europe with the rise of fascism | Class tensions rising as the wealthy and the poor grow more divided
Wartime context — Not applicable as this period is peacetime.: The absence of wartime service creates a focus on class and economic struggles rather than nationalistic pride. Absence effect: Without the unifying threat of war, social divisions become more pronounced, leading to increased tensions among the classes.

## Story Theme
The quest for social status can lead to deceit and moral ambiguity, exposing the fragility of human relationships amid the backdrop of economic despair, and reveals that evidence carries ethical weight, forcing characters to choose accountability over social performance when appearances and facts collide.

## Story Emotional Register
Dominant: A tense and somber atmosphere envelops the tale.

Arc:
The story opens in the grand yet oppressive atmosphere of Little Middleton Manor, where the shocking murder of Brian Scanlon sends ripples through the lives of its residents. As Detective Jane O'Connor investigates, the rising tension reveals a web of deceit and hidden motives among the guests, each harboring their own secrets. The initial clues, such as the peculiar clock and witness testimonies, lead to a maze of false leads that amplify the emotional cost for everyone involved. Midway through the investigation, a revelation about the tampered clock shifts Jane's focus, forcing her to reconsider the timeline of events and the true nature of the relationships at play. As pressure mounts, characters confront their own motives, and the stakes rise, culminating in a dramatic climax where the truth about Colin Enright’s involvement is revealed. In the resolution, the emotional toll of the investigation weighs heavily on each character, leaving them to reckon with their choices and the fragile nature of their social standings in a world forever changed by the shadow of financial ruin.

The story opens: The atmosphere is thick with tension and uncertainty following the murder. As the investigation takes shape: Initial investigations reveal deep-seated secrets among the guests. A first key turn arrives: A startling clue about the clock shifts focus in the investigation. At the mid-point of the story: Revelations about the tampering change assumptions about the timeline.

A second pivot reshapes the course: Pressure mounts as characters confront their intertwined fates. As tension reaches its height: The final pieces of the puzzle come together, leading to the confrontation. The climax brings the central question to a head: The truth about Colin's guilt emerges, shattering the facade of trust. In the final resolution: Each character is left to grapple with the emotional aftermath of the crime.

## Emotional register at this point in the story
Initial investigations reveal deep-seated secrets among the guests.

## Character Portraits (appearance & era)

### Carol Molloy
Carol Molloy's glamorous persona is a facade that conceals her fear of losing familial approval amidst the economic turmoil. Her life as a socialite underscores the pressure of maintaining status while grappling with the uncertainty that the 1930s economy brings, forcing her to confront her own desires against societal expectations.
Era intersection: Carol's struggle between personal freedom and social obligation mirrors the conflicts faced by many women striving for independence during this era.

### Colin Enright
Colin Enright's respectable lawyer facade belies a complicated history with the Scanlon family. As the pressures of economic turmoil weigh heavily on him, his past connections to the victim create a moral dilemma that complicates his motives and actions in the investigation.
Era intersection: Colin's position as a family lawyer places him at the intersection of class and personal loyalties, reflecting the tensions of a society grappling with economic despair.

### Jane O'Connor
Jane O'Connor represents the ambitious journalist eager to uncover the truth, her career aspirations colliding with the ethical dilemmas posed by the investigation. As she navigates the scandal surrounding the Scanlon estate, her determination reflects the era's shift towards a more inquisitive media landscape.
Era intersection: Jane's pursuit of truth in a time of societal upheaval highlights the growing importance of media in shaping public perception during the 1930s.

### Sean Murphy
Sean Murphy, the loyal groundskeeper, embodies the discontent brewing among the working class. His resentment towards the wealthy reflects the class tensions of the era, as he grapples with his place in a society defined by privilege and inequality.
Era intersection: Sean's internal conflict and resentment serve as a microcosm of the broader societal struggles against class oppression during the Great Depression.

## Character Voices

### Carol Molloy (she/her/her)
Carol's airy elegance is punctuated with playful sarcasm, reflecting her socialite charm.
[comfortable] Darling, if you must wear that shade of green, at least try to pair it with something less... pedestrian.
[evasive] Oh, I was simply caught up in the festivities, not a care in the world!
[stressed] What if the will favors someone else? I can't bear to think of it!
Humour: Her polite savagery often entertains while revealing her true feelings about her peers.

### Colin Enright (he/him/his)
Colin speaks with a calm and deliberate rhythm, often incorporating legal jargon into his conversations.
[comfortable] The law is a delicate dance, where one misstep can lead to a fall.
[evasive] I was in the office, reviewing documents. Nothing unusual.
[stressed] This isn't just about the law; it's... complicated.
Humour: His dry wit often catches others off guard, providing levity amidst serious discussions.

### Jane O'Connor (she/her/her)
Jane's quick, animated speech is often laced with sarcasm, reflecting her journalist's edge.
[comfortable] If only the walls could talk; they’d probably have quite the scandal to share.
[evasive] Oh, I just happened to be passing by, not snooping at all!
[stressed] This could make or break my career; I can't afford to mess it up!
Humour: Her sardonic wit serves as a shield against the seriousness of her work.

### Sean Murphy (he/him/his)
Sean speaks straightforwardly, often revealing his bitterness through dry observations.
[comfortable] They say money can’t buy happiness, but it sure can buy a lot of privilege.
[evasive] I was just doing my job, tending to the garden like always.
[stressed] This whole situation is a joke; they don't even see what they're doing to us!
Humour: His deadpan delivery often hints at deeper frustrations with class inequalities.

## Location Registers (scene framing guides)

The Library: The library feels like a crypt of secrets, where the dust of neglect combines with the weight of untold stories, creating a palpable tension that suffocates the air.. Camera angle: As a writer enters this space, they should feel the oppressive weight of history and the silence of unspoken truths.. Era: The library’s decor reflects the grandeur of its time, but its current state highlights the financial strain of the era.

The Drawing Room: The drawing room, once alive with laughter, now feels stifled and tense, a battleground of unspoken worries and fading grandeur.. Camera angle: The writer should approach this room with a sense of foreboding, as if each glance at the furnishings uncovers more hidden anxieties.. Era: The lavish decor stands in stark contrast to the economic struggles outside, emphasizing the dissonance of the upper class.

The Overgrown Garden: The garden, with its wildflowers and tangled hedges, serves as a reflection of disarray and abandonment, a sanctuary turned into a maze of secrets.. Camera angle: Entering this space should evoke feelings of isolation and introspection, as if the garden itself holds the key to the characters' inner turmoil.. Era: Once a vibrant center of leisure, the garden now echoes the neglect experienced by its inhabitants during hard times.

## Humour guidance for this story position (early)
Permission: permitted
Characters who may be funny: Jane O'Connor
Permitted forms: sardonic
Rationale: Jane’s wit provides a moment of levity in the otherwise serious investigation.

## Reveal Groundwork (texture — do not explain, only plant)
- Plant one subtle observable beat related to: "Taken together, these implications should be treated as cumulative pressure that reshapes how each suspect interprets risk, loyalty, and consequence over the final act". Do not explain significance yet.
- Plant one subtle observable beat related to: "Plant one subtle anomaly that can be re-read after the resolution.". Do not explain significance yet.
- Plant one subtle observable beat related to: "Plant one subtle anomaly that can be re-read after the resolution.". Do not explain significance yet.

FAIR-PLAY AND INFERENCE CONTRACT:
- FAIR PLAY CLUE TIMING: Never combine clue discovery and detective deduction in the same chapter. If a clue is first revealed to the reader in chapter N, the detective may only analyze, deduce from, or act on that clue in chapter N+1 or later.
- FAIR PLAY INFORMATION PARITY: The reader must see all clues BEFORE the detective uses them in reasoning. If the detective performs a test or makes a deduction, every piece of evidence supporting that conclusion must have been shown to the reader in earlier chapters.
- FAIR PLAY REVELATION SPACING: In the discriminating test scene, the detective can ONLY use clues that were revealed to the reader at least 1 full chapter earlier. Never introduce new clues or withheld information during the test.
- FAIR PLAY CONFRONTATION: During the final confrontation/revelation, the detective cannot surprise the reader with facts. Every piece of evidence cited must have been visible to the reader in prior chapters.
- Never solve by withheld information. Keep reader-information parity with detective reasoning.
- False assumption in force: Brian Scanlon must have died after the last guest left.
- Hidden truth to progressively expose: The actual time of death was much earlier, obscured by tampering with the clock.
- Inference path checkpoints to dramatize clearly (observation -> correction -> effect):
  - Step 1: obs: The clock in the study shows ten minutes past eleven. | corr: This suggests Brian Scanlon died after the last guest left. | effect: Eliminates the possibility of an early death.
  - Step 2: obs: Witnesses report hearing a loud thud at half past ten. | corr: This indicates that the death may have occurred before the clock showed its current time. | effect: Narrows the time of death to before eleven o'clock.
  - Step 3: obs: Fingerprints on the clock show signs of tampering. | corr: The clock was likely manipulated to mislead the investigation. | effect: Narrows the suspect pool to those who had access to the study.
- Discriminating test method: trap
- Discriminating test design constraint: The discriminating test compares suspect, clock, and study against the claimed timeline.
- Test must rely on already-shown clue IDs: clue_mechanism_visibility_core, clue_core_contradiction_chain, clue_3, clue_1, clue_2, clue_4
- Fair-play rationale: Step 1: The clock showing ten minutes past eleven and the witness testimony about the thud let the reader conclude that the death was earlier. Step 2: The tampering evidence provides the connection that the clock does not reflect true time, leading to suspect Colin Enright.

## Character Reference

### Carol Molloy (she/her — NEVER he/him)
Carol speaks with an airy elegance, her words often laced with playful sarcasm
She has a penchant for making cutting remarks about her peers' fashion choices, delivered with a smile that leaves them unsure whether to laugh or cringe.
Carol is torn between her desire for independence and the suffocating expectations of her family. The weight of their approval looms large, and she often questions whether she is living for herself or merely for their validation.

### Colin Enright (he/him — NEVER she/her)
Colin speaks with a calm and deliberate rhythm, choosing his words carefully
He often incorporates legal jargon into casual conversation, but his wit emerges unexpectedly, often catching others off guard with its subtlety.
Colin is caught in a web of nostalgia and regret, torn between his professional obligations and the lingering feelings for the victim. The conflict between duty and desire weighs heavily on him, creating a moral dilemma he cannot escape.

### Jane O'Connor (she/her — NEVER he/him)
Jane speaks with a quick, animated rhythm, often punctuating her sentences with wry observations
She has a penchant for sarcasm, using humor as a shield against the seriousness of her work.
Jane struggles with the ethics of her investigation, torn between her ambition and the potential consequences of exposing the family's secrets. The desire for a sensational story battles with her sense of integrity.

### Sean Murphy (he/him — NEVER she/her)
Sean speaks in a straightforward manner, often punctuating his sentences with dry observations
His humor is subtle and often laced with a hint of bitterness, revealing his true feelings about the wealthy.
Sean grapples with feelings of resentment and loyalty, torn between his dedication to the estate and his disdain for the class system that perpetuates inequality. This internal struggle complicates his role in the investigation.



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
A sprawling estate that mirrors the grandeur of its era, now shrouded in mystery and tension.

Key Locations Available:
- The Library (interior): Crime scene
- The Drawing Room (interior): Gathering space
- The Overgrown Garden (exterior): Isolation and reflection space

Atmosphere (tonal cue only — do NOT reproduce this phrase verbatim in prose; translate into scene-specific, character-observed sensory language): Tension in the air due to recent financial struggles of the household
Weather: overcast with a chance of rain, typical for the English countryside

Era markers: Domestic wiring with frequent outages | Typewriters in use for correspondence | Petrol touring cars on county roads

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
  - Visual: dusty tomes lining dark shelves, flickering candlelight on oak desk, cold ashes in the fireplace
  - Sounds: the ticking of a mantel clock, rustle of pages turning, silent footsteps on the wooden floor
  - Scents: old leather and parchment, cold stone and damp wood, beeswax from candlelight
  - Touch: rough texture of old books, smoothness of polished wood

The Drawing Room (interior):
  - Visual: opulent fabrics draping over furniture, grand piano resting silently in the corner, gilded mirrors reflecting candlelight
  - Sounds: soft murmurs of conversation, the creak of an old chair, the distant sound of laughter
  - Scents: heavy perfume lingering in the air, the scent of polished wood, faint whiff of burnt candles
  - Touch: smooth silk of drapery, rough texture of upholstered chairs

The Overgrown Garden (exterior):
  - Visual: vibrant wildflowers swaying in the breeze, tangled hedges creating secluded spaces, overgrown paths winding through greenery
  - Sounds: chirping of distant birds, the rustle of leaves in the wind, the soft buzz of insects
  - Scents: fresh scent of damp earth, the sweetness of blooming flowers, the sharpness of cut grass
  - Touch: rough texture of stone paths, soft petals brushing against skin

⛔ REFERENCE DATA — DO NOT TRANSCRIBE VERBATIM: The above profiles are structural guides only. Generate original prose that evokes these qualities; do not reproduce the exact phrasing or sentence structure of the profile paragraphs.

SCENE OPENING RULE: When opening a scene in a new location, write what the POV character directly observes and physically senses at that moment — not a general description of the room's qualities. The reader must feel present, not briefed. Sensory details must be observed by the character, not stated as fact about the place.

SENSORY WRITING TECHNIQUES:
- Opening paragraphs: Lead with 2-3 sensory details to ground the scene
- Movement between locations: Note sensory changes (quiet study → noisy dining room)
- Emotional scenes: Use sensory details to reinforce mood (cold rain during argument)
- Period authenticity: Use period-specific sensory details from
[truncated for prompt budget]

## Texture Pool
Draw on these as opportunities arise — you are not required to use them.

- In July 1932, the air in England is thick with the weight of the Great Depression, as the economy falters and social divisions deepen
- The overcast skies reflect the mood of the time, where families, once secure in their wealth, now grapple with the specter of financial ruin
- In the countryside, the genteel facade of manor life crumbles under the strain of unemployment, with whispers of discontent echoing among the staff
- The social rituals that once defined their lives become tinged with anxiety, as each gathering becomes a reminder of lost opulence
- With radio broadcasts sharing news of political unrest and rising tensions across Europe, the atmosphere pulses with uncertainty, leaving the inhabitants of Little Middleton Manor to navigate their fragile social standings amidst hidden resentments and unspoken fears.

TEMPORAL CONTEXT:

This story takes place in July 1932 during summer.

Seasonal Atmosphere:
- Weather patterns: overcast with intermittent rain, cool breezes sweeping across the countryside, occasional bursts of sunlight
- Daylight: Long summer days, with twilight lingering until nearly ten o'clock in the evening, giving way to a damp chill as the night falls.
- Seasonal activities: Country picnics in the meadows, Gardening and tending to the estate's flower beds, Hosting outdoor teas and games on the lawn
- Seasonal occasions: No major holidays, but many would celebrate Bastille Day on July 14th with small gatherings and local festivities.
- Season: summer

Period Fashion (describe naturally):
- Men formal: tweed three-piece suit with a waistcoat, straw boater hat, polished leather brogues
- Men casual: linen trousers with a light cotton shirt, suspenders, flat cap
- Men accessories: silk tie, pocket watch, cufflinks
- Women formal: tea-length floral dress with a fitted waist, lightweight cardigan, cloche hat adorned with ribbons
- Women casual: sleeveless cotton frock, broad-brimmed sun hat, canvas espadrilles
- Women accessories: beaded clutch purse, string of pearls, matching gloves

Cultural Context (reference naturally):
- Music/entertainment: George Gershwin's 'Rhapsody in Blue', Jimmie Lunceford's big band tunes, Bing Crosby's crooning hits; Films: 'Scarface' directed by Howard Hawks, 'The Most Dangerous Game'; Theatre: 'Of Mice and Men' by John Steinbeck, 'The Royal Family' by George S. Kaufman; Radio: The BBC broadcasts news and entertainment programs, Popular music shows featuring live bands
- Typical prices: Loaf of bread: four pence, A dozen eggs: one shilling, A taxi across town: two shillings
- Current events: The U.S. economy struggles amidst the Great Depression; Political unrest in Europe with the rise of fascism
- Literature: 'Brave New World' by Aldous Huxley | 'Murder in the Cathedral' by T.S. Eliot | 'The Maltese Falcon' by Dashiell Hammett | [Mystery fiction] | [Social commentary novels] | [Dystopian literature]
- Technology: The electric refrigerator becomes more common in households | Advancements in radio technology enhance broadcast quality | The first commercial production of the electric washing machine | Typewriters for correspondence | Radios in homes for entertainment | Automobiles for personal transport
- Daily life: Visiting local markets for fresh produce, Engaging in amateur dramatics at the village hall, Playing croquet or lawn tennis at the manor
- Social rituals: Formal afternoon tea with neighbors, Weekly church services attended by the community

Atmospheric Details:
The scent of damp earth and blooming flowers hangs in the air, a reminder of the recent rain. The distant sound of a clock striking the hour echoes through the manor, a reminder of time passing amidst rising tensions. Faint whispers of gossip circulate among the household staff, thickening the atmosphere with unspoken secrets.

FASHION INTEGRATION TECHNIQUES:
- First appearance: Describe outfit to establish class/personality
- Accessories: Gloves, hats, pocket watches, jewelry reveal status
- Time-specific: Different outfits for different times of day
- Character traits: Fastidious dresser vs rumpled appearance
- Action integration: "She tugged at her glove" or "He adjusted his tie"
- Weather appropriate: Over
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

• [clue_1] This indicates that the death may have occurred before the clock showed its current time.
  Category: temporal | Criticality: essential | Supports inference step 2
  Points to: This contradicts the timeline established by the clock.

• [clue_3] Witnesses report hearing a loud thud at half past ten.
  Category: testimonial | Criticality: essential | Supports inference step 2
  Points to: This establishes a timeline for the events.

• [clue_4] This indicates that the death may have occurred before the clock showed its current time.
  Category: temporal | Criticality: essential | Supports inference step 2
  Points to: This contradicts the timeline established by the clock.

• [clue_7] Direct observation
  Category: structural | Placement: early (Act 1)
  Points to: what this observation reveals about the time or circumstances of the crime.

• [clue_culprit_direct_colin_enright] Direct observation
  Category: structural | Placement: early (Act 1)
  Points to: what this observation reveals about the time or circumstances of the crime.

For each clue above: an attentive reader should be able to find, record, and later use it to reason toward the solution.

═══ NARRATIVE STATE (read-only — do not contradict) ═══

LOCKED FACTS — use verbatim whenever this evidence is described:
  • The exact time shown on the stopped clock face: "ten minutes past eleven"
  • The exact amount the clock was wound back: "forty minutes"

CHARACTER PRONOUNS — never deviate from these:
  • Brian Scanlon: he/him/his
  • Carol Molloy: she/her/her
  • Colin Enright: he/him/his
  • Jane O'Connor: she/her/her
  • Sean Murphy: he/him/his

CLUES ALREADY REVEALED TO READER: clue_7, clue_culprit_direct_colin_enright, clue_mechanism_visibility_core, clue_core_contradiction_chain — do not reveal these as new information.

INVESTIGATION LOG — WHAT IS ESTABLISHED (do not re-establish, do not repeat):
• Evidence in reader's hands: The clock was tampered with to show a later time, misleading the investigation regarding the time of death. | Direct evidence ties Colin Enright to the mechanism access point before the discriminating test. | The clock in the study shows ten minutes past eleven. | This suggests Brian Scanlon died after the last guest left.
• Suspects still unresolved: Carol Molloy[SHE], Sean Murphy[HE]
⚠ The story must move FORWARD from this log. Any beat already listed above is forbidden from repeating.

⚠ THIS CHAPTER'S REQUIRED ADVANCE (early): Interview each suspect — record their claimed whereabouts

CONTINUITY HANDOFF — previous chapter closing beat:
  • "In that moment, Jane realized that the investigation was not just about finding the murderer; it was about understanding the complex web of relationships that had led to this tragedy. The clock's frozen hands were a reminder that time was slipping away, and sh..."
  • The next chapter must open as a continuation of this beat, not as a disconnected reset.
═══════════════════════════════════════════════════════

═══════════════════════════════════════════════════════════
📚 CONTINUITY CONTEXT - CHARACTER & SETTING CONSISTENCY
═══════════════════════════════════════════════════════════

**CRITICAL: You are writing chapters 3+. Maintain consistency with earlier chapters.**

**Character Names Used in Chapters 1-2:**
Brian Scanlon, Carol Molloy, Colin Enright, Jane O'Connor, Sean Murphy

✓ RULE: Use EXACTLY these names. Do NOT vary spelling, add titles, or introduce new forms.
✓ Example: if earlier chapters used "Clara Whitfield", keep using "Clara Whitfield" — never "Mrs. Whitfield" unless that is the character's canonical name in the list above.

**Setting Vocabulary Established in Earlier Chapters:**
study, garden, estate

✓ RULE: Continue using this location vocabulary. Maintain consistency with established setting type.
✓ Do NOT introduce new location types that contradict earlier chapters.

**Recent Chapter Summary (for narrative continuity):**
Chapter 1: Chapter 1: The Grim Discovery
  Events: The evening air was thick with tension as the last remnants of sunlight faded, casting long shadows across the study of the Enright residence.
Chapter 2: Chapter 2: Initial Reactions
  Events: Colin's gaze darted around the room, searching for support, but Jane could see the flicker of doubt in his eyes.

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
Known location profile anchors: Little Middleton Manor, The Library, The Drawing Room, The Overgrown Garden, the study of the Enright residence
LOCATION NAME CAPITALISATION (HARD REQUIREMENT — validated):
All named locations in your prose MUST use the EXACT capitalisation from the CML profiles.
Canonical forms: "Little Middleton Manor", "The Library", "The Drawing Room", "The Overgrown Garden", "the study of the Enright residence"
Writing a location in lowercase (e.g. "drawing room" instead of "Drawing Room") is a validated error. Every time you mention a named location, copy its capitalisation from the list above.
- Chapter 3: OPENING STYLE (HARD): Start the VERY FIRST SENTENCE with an explicit time marker — e.g. "That morning…" / "By the time dusk fell…" / "It was nearly four o'clock…" / "On the second day after the discovery…". Time must be in the first clause. Anchor opening in "the study of the Enright residence". HARD REQUIREMENT for the first 2 paragraphs: (a) include 2+ sensory words — choose from smell/scent/sound/echo/silence/creak/whisper/cold/warm/damp/rough/smooth/glow/shadow/flicker/dim — and (b) include 1+ atmosphere/time word — choose from rain/wind/fog/storm/mist/thunder/evening/morning/night/dawn/dusk/season/afternoon/midday/noon/midnight/twilight/sunrise/sunset/daylight/sunlight/overcast/cloudy/bright/dark. These are validated requirements, not style suggestions; missing them triggers a retry.

[⚠ INTERNAL QUALITY DIAGNOSTICS — DO NOT REPRODUCE ANY PART OF THIS SECTION IN YOUR STORY OUTPUT. These are private generator observations for your consideration only. Your narrative must read as if this section does not exist. Never include phrases from this block in character dialogue, narration, or description.]

PRIOR CHAPTER QUALITY OBSERVATIONS:
- Chapter 1 (score 87/100):
  Quality gaps noted: word density below preferred target (652/1000)
  Address in upcoming chapters: Increase chapter density with concrete investigation action and sensory-grounded beats; avoid recap-only padding.
- Chapter 2 (score 89/100):
  Quality gaps noted: word density below preferred target (738/1000); scene grounding weakness
  Address in upcoming chapters: Increase chapter density with concrete investigation action and sensory-grounded beats; avoid recap-only padding. | Open next chapter with a named location anchor plus at least two sensory cues and one atmosphere marker.
[END INTERNAL DIAGNOSTICS]

⛔ ABSOLUTE PRONOUN LOCK — NO EXCEPTIONS

The following pronouns are locked facts, on the same level as character names
and hard-logic device values. Using the wrong pronoun is a continuity error,
not a style choice.

Canonical pronoun table (subject / object / possessive / reflexive):
  • Brian Scanlon: ALWAYS he/him/his/himself — NEVER she/her/herself
  • Carol Molloy: ALWAYS she/her/her/herself — NEVER he/him/his/himself
  • Colin Enright: ALWAYS he/him/his/himself — NEVER she/her/herself
  • Jane O'Connor: ALWAYS she/her/her/herself — NEVER he/him/his/himself
  • Sean Murphy: ALWAYS he/him/his/himself — NEVER she/her/herself

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
   WRONG: "Carol watched Scanlon; she crossed the room and he frowned." (ambiguous antecedent)
   RIGHT: "Carol watched Scanlon; Scanlon crossed the room and Carol frowned." (explicit)
9. In dialogue attribution, the pronoun refers to the SPEAKER — not the last character
   named inside the quoted speech:
   WRONG: \"I have
[truncated for prompt budget]

PROMPT BUDGET SUMMARY: budget=32000 tokens; fixed=9375; context=10905; dropped=[none]; truncated=[location_profiles, temporal_context, pronoun_accuracy]

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
4. Integrate at least two concrete era-grounded details per chapter from setting refinement signals: domestic wiring with frequent outages | petrol touring cars on county roads | typewriters in use for correspondence | party-line telephone exchange | telegrams for urgent messages | airmail for long-distance correspondence.
5. Respect setting movement/access constraints in scene action and alibis: multiple access points restricted by family and staff permissions | narrow corridors causing limited movement during gatherings | large gardens creating isolation from outside help | restricted areas such as private offices and the library | daily schedules for staff affecting movement.
6. Sustain social coherence with this backdrop pressure: A looming inheritance dispute amidst the backdrop of the Great Depression forces the manor's inhabitants to confront their fragile social standings and hidden resentments.
7. Maintain continuity around these socially central cast anchors where relevant: Brian Scanlon, Carol Molloy, Colin Enright, Jane O'Connor, Sean Murphy.
8. STORY TO DATE ANTI-COPY RULE: The STORY TO DATE section below is provided for chronological and factual reference ONLY. You MUST NOT copy, lightly rephrase, or structurally echo any sentence or paragraph from prior chapters. Every sentence in this chapter must be original prose unique to this scene. Reusing even a clause from prior chapter text will cause this attempt to fail immediately.

CRITICAL PROSE REQUIREMENTS:

The CML specifies exact requirements for certain validation-critical scenes. You MUST include these elements at the specified positions.

**Discriminating Test Scene (Act 3, Scene 4):**
Required elements: Execute the discriminating test, Observe the suspect's reaction or result, Draw conclusion about guilt

**Suspect Clearance Scenes:**
- Carol Molloy (Act 3, Scene 5): Alibi corroborated by another guest
  Clues: clue_1, clue_2
- Sean Murphy (Act 3, Scene 5): Witness confirms he was outside during the incident
  Clues: clue_1, clue_2

**Culprit Revelation Scene (Act 3, Scene 6):**
Method: Confrontation with evidence

**Clue Placement for These Chapters:**
- clue_1 must appear in Act 1, Scene 3 via Direct observation
- clue_3 must appear in Act 1, Scene 3 via Physical evidence
- clue_4 must appear in Act 1, Scene 3 via Cross-check contradiction
- clue_7 must appear in Act 1, Scene 3 via Direct observation
- clue_culprit_direct_colin_enright must appear in Act 1, Scene 3 via Direct observation

**VALIDATION CONSEQUENCE:** If these requirements are not met exactly, story validation will fail and the entire generation will be rejected. Follow these specifications precisely.


## ACTIVE CHAPTER MODE CONTRACT (MANDATORY)
Active chapter mode: Suspect Pressure.
Mode required outcomes:
- Reveal fear, motive, lie, loyalty conflict, or secret.
- Suspicion state changes by chapter end.
Forbidden at this stage:
- No full murder confession unless outline-required.
Mode-specific narrative balance targets:
- Setting: 5-10%
- Character Pressure: 45-55%
- Evidence Or Alibi Testing: 35-45%

## CHAPTER OUTCOME CONTRACT (MANDATORY)
Batch chapters: 3-3.
Investigation state at start: 4 clue(s) revealed to reader; approximately 2 unresolved suspect(s).
Must change by end: Increase or complicate suspicion through new pressure revelation.
Suspect pressure target(s): Colin Enright, Carol Molloy, Sean Murphy
Required new information: At least one fear/motive/lie/loyalty reveal with investigative consequence.
Forbidden reveals at this stage: No full murder confession unless outline-required.

## CHAPTER COMPOSITION TARGETS (MANDATORY NARRATIVE BALANCE)
Treat percentages as narrative attention share (sentence/paragraph focus), not exact token math.
Active phase for this batch: Middle Chapters (mode: Suspect Pressure).
Apply this target mix in this batch:
- Setting: 10%
- Character Conflict: 30-35%
- Alibi Testing Clue Reinterpretation: 50-60%
Reference profile across chapter phases:
- Chapter1: Setting 20% | Character Introductions 40% | Discovery Reactions 30% | First Clue 10%
- Early Investigation: Setting 10-15% | Character Pressure 35-40% | Clue Development 45-50%
- Middle Chapters: Setting 10% | Character Conflict 30-35% | Alibi Testing Clue Reinterpretation 50-60%
- False Suspect Chapters: Setting 10% | Character Focus 45% | Evidence Contradiction 45%
- Discriminating Test Chapter: Setting 10% | Character Reaction 20-25% | Test Proof Reversal 65-70%
- Final Reveal: Setting 10% | Motive Character Consequence 30% | Evidence Chain 40% | Confession Aftermath 20%
If obligations conflict, preserve hard clue/evidence/logic contracts first, then satisfy the composition mix.

## Asset Self-Report (required)
At the very END of your response, after all prose, add a single line:
<used_assets>era:story:0,era:story:1,era:story:2,era:story:3,era:story:4</used_assets>
Replace the list with only the IDs of texture assets you actually used. If you used none, output <used_assets></used_assets>.
```

## Message 2 (role=user)

```text
Write the full prose following the outline scenes.



CHAPTER OBLIGATION CONTRACT (MUST SATISFY):
- ERA RULE (1930s): NEVER use these anachronistic terms: "computer", "internet", "email", "cell phone", "mobile phone", "smartphone", "GPS", "laptop", "digital camera", "text message", "app", "wifi", "bluetooth", "jet plane". Any occurrence will cause the chapter to be rejected.
- STYLE HARD-BAN: NEVER use these phrase families: "clock tower at quarter past three", "near the clock tower at quarter past", "showed quarter past three when the body", "in the formal gardens during the murder". Any occurrence triggers rejection/retry.
- STYLE SOFT-BAN: avoid these stock phrases and rewrite them if they appear in draft text: "lips pressed into a thin line", "the household runs smoothly when every cog", "the pressures upon this household are many", "the doctor [Surname] (use Dr. Surname or 'the doctor', never role + bare surname)", "the captain [Surname] (use Captain Surname or 'the captain', never role + bare surname)", "the inspector [Surname] (use Inspector Surname or 'the inspector', never role + bare surname)", "the sergeant [Surname] (use Sergeant Surname or 'the sergeant', never role + bare surname)", "the constable [Surname] (use Constable Surname or 'the constable', never role + bare surname)", "the gentleman [Surname] (use Mr. Surname or 'the gentleman', never role + bare surname)".
- STYLE WATCHLIST: keep these patterns varied and scene-specific: "quarter past three", "three fifteen", "the old bell striking three fifteen", "the chimes echoed just after three-fifteen".
- Chapter 3:
  - STRUCTURAL ARCHETYPE — Chapter 3 must be: EVIDENCE
      ✓ MUST contain: new physical clue discovered
      ✗ MUST NOT contain: formal accusation
  - Word count: Target 1250 words. Achieve this through plot events, dialogue exchanges, and physical investigation — not through atmospheric repetition or extended internal reflection. Each 200-word segment should contain at minimum one concrete story event (a discovery, a conversation exchange, a physical action or movement). Padding with atmosphere alone is not acceptable.
  - Opening: Begin with a character action, spoken line, or clock/time marker — never a location name or location-description phrase.
  - Scene is set in: the study of the Enright residence — reference it naturally within the paragraph, never as your opening phrase.
  - Opening atmosphere (MANDATORY — validator enforced): the first paragraph MUST contain at least one of: rain / wind / fog / storm / mist / thunder / evening / morning / night / dawn / dusk / season / afternoon / midday / noon / midnight / twilight / sunrise / sunset / daylight / sunlight / overcast / cloudy / bright / dark / grey / pale / cold / warm / chill / crisp / damp / drizzle / haze / lamplight / firelight. A chapter that omits all of these from its opening paragraph will be rejected.
  - PARAGRAPH OPENER DIVERSITY (MANDATORY — validator enforced): No more than 2 paragraphs in this chapter may begin with "Jane" or "Jane's" as the first word. You must vary paragraph openings throughout: use sensory observations, another character's name or action, dialogue, object or sound details, or temporal markers. Opening 3 or more paragraphs with "Jane" will cause automated rejection.
  - Continuity bridge: in the first 120 words, visibly connect from the previous chapter's final beat. Carry forward one unresolved element (object, accusation, emotional pressure, or immediate physical action) from: "In that moment, Jane realized that the investigation was not just about finding the murderer; it was about understanding the complex web of relationships that had led to this tragedy. The clock's frozen hands were a remi...".
  - CLUE OBLIGATIONS — mandatory prose elements (do NOT omit or bury):
    • This indicates that the death may have occurred before the clock showed its current time. [clue_1] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: This contradicts the timeline established by the clock.
      ↳ MANDATORY TWO-PARAGRAPH STRUCTURE (must appear in paragraphs 1 or 2 — no later):
         Paragraph 1: The POV character physically approaches or directly observes this evidence.
           The narration or dialogue explicitly states what is seen (use the exact locked phrase if one applies).
         Paragraph 2 (immediately following): The detective or POV character explicitly reasons
           about what this evidence implies — who it implicates, why it may be unreliable,
           or what inference it supports. This must be a separate full paragraph, not a sentence appended to Paragraph 1.
    • Witnesses report hearing a loud thud at half past ten. [clue_3] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: This establishes a timeline for the events.
      ↳ MANDATORY TWO-PARAGRAPH STRUCTURE (must appear in paragraphs 1 or 2 — no later):
         Paragraph 1: The POV character physically approaches or directly observes this evidence.
           The narration or dialogue explicitly states what is seen (use the exact locked phrase if one applies).
         Paragraph 2 (immediately following): The detective or POV character explicitly reasons
           about what this evidence implies — who it implicates, why it may be unreliable,
           or what inference it supports. This must be a separate full paragraph, not a sentence appended to Paragraph 1.
    • This indicates that the death may have occurred before the clock showed its current time. [clue_4] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: This contradicts the timeline established by the clock.
      ↳ MANDATORY TWO-PARAGRAPH STRUCTURE (must appear in paragraphs 1 or 2 — no later):
         Paragraph 1: The POV character physically approaches or directly observes this evidence.
           The narration or dialogue explicitly states what is seen (use the exact locked phrase if one applies).
         Paragraph 2 (immediately following): The detective or POV character explicitly reasons
           about what this evidence implies — who it implicates, why it may be unreliable,
           or what inference it supports. This must be a separate full paragraph, not a sentence appended to Paragraph 1.
    • The clock was tampered with to show a later time, misleading the investigation regarding the time of death. [clue_7] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: This reveals the mechanism of deception.
      ↳ MANDATORY TWO-PARAGRAPH STRUCTURE (must appear in paragraphs 1 or 2 — no later):
         Paragraph 1: The POV character physically approaches or directly observes this evidence.
           The narration or dialogue explicitly states what is seen (use the exact locked phrase if one applies).
         Paragraph 2 (immediately following): The detective or POV character explicitly reasons
           about what this evidence implies — who it implicates, why it may be unreliable,
           or what inference it supports. This must be a separate full paragraph, not a sentence appended to Paragraph 1.
    • Direct evidence ties Colin Enright to the mechanism access point before the discriminating test. [clue_culprit_direct_colin_enright] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: This direct evidence shows Colin Enright had means and opportunity, narrowing the solution uniquely toward the culprit.
      ↳ MANDATORY TWO-PARAGRAPH STRUCTURE (must appear in paragraphs 1 or 2 — no later):
         Paragraph 1: The POV character physically approaches or directly observes this evidence.
           The narration or dialogue explicitly states what is seen (use the exact locked phrase if one applies).
         Paragraph 2 (immediately following): The detective or POV character explicitly reasons
           about what this evidence implies — who it implicates, why it may be unreliable,
           or what inference it supports. This must be a separate full paragraph, not a sentence appended to Paragraph 1.
  - Tonal contrast: include at least one beat of relief or ironic counterpoint. Do not sustain maximum tension for every paragraph.
  - SUSPECT-PRESSURE MODE: do NOT resolve the case in this chapter. No confession, arrest, final accusation, definitive culprit declaration, or case-closed language. End with unresolved pressure: a contradiction, narrowed suspicion, motive pressure, or a new question.
  - ALIBI LOCK: Colin Enright's established alibi is "10:00 PM - 11:30 PM". Do NOT place Colin Enright at any other location or in any other activity during the crime window. Any contradiction is a continuity error that triggers a retry.
  - TESTIMONY CONTINUITY: Colin Enright has already made statements in earlier chapters. Any time, location, or claim attributed to Colin Enright in THIS chapter must be consistent with those earlier statements. Do NOT introduce a new or different alibi claim — any contradiction is a continuity error.
- Locked fact phrase obligations:
  - If this batch mentions The exact time shown on the stopped clock face, write exactly: "ten minutes past eleven".
  - If this batch mentions The exact amount the clock was wound back, write exactly: "forty minutes".
- Seasonal vocabulary allow-list: summer, summery, midsummer.
- Forbidden seasonal words: spring, autumn, winter.

⛔ PRONOUN TABLE — re-check after EVERY paragraph before writing the next:
    Brian Scanlon: he/him/his
    Carol Molloy: she/her/her
    Colin Enright: he/him/his
    Jane O'Connor: she/her/her
    Sean Murphy: he/him/his
  Any sentence containing a pronoun must agree with this table. Correct mismatches before moving on.

## CHAPTER OUTCOME CONTRACT (MANDATORY)
Batch chapters: 3-3.
Investigation state at start: 4 clue(s) revealed to reader; approximately 2 unresolved suspect(s).
Must change by end: Increase or complicate suspicion through new pressure revelation.
Suspect pressure target(s): Colin Enright, Carol Molloy, Sean Murphy
Required new information: At least one fear/motive/lie/loyalty reveal with investigative consequence.
Forbidden reveals at this stage: No full murder confession unless outline-required.

FROZEN FACT STATE (DO NOT ALTER):
- Timeline anchor: July (summer).
- Month, season, weather, and time-of-year language in this batch must stay compatible with summer.
- If referenced, use exact phrase: "ten minutes past eleven" (The exact time shown on the stopped clock face).
- If referenced, use exact phrase: "forty minutes" (The exact amount the clock was wound back).

STORY TO DATE (REFERENCE ONLY — DO NOT COPY VERBATIM):
- Full prior chapter text is provided below for continuity, factual consistency, and reference accuracy.
- Use this to keep character voice, chronology, clue state, and location continuity aligned with earlier chapters.
- Do not quote, copy, or paraphrase these paragraphs too closely; write fresh prose that remains consistent with them.

--- BEGIN PRIOR CHAPTER 1 ---
Title: Chapter 1: The Grim Discovery
The evening air was thick with tension as the last remnants of sunlight faded, casting long shadows across the study of the Enright residence. Jane O'Connor stepped inside, her heart racing, drawn by the murmurs of the gathered guests. The scent of damp wood mingled with the faint aroma of old books, creating an atmosphere that felt almost suffocating. As she crossed the threshold, her eyes fell upon a sight that sent a chill down her spine: Brian Scanlon lay sprawled across the floor, lifeless and still. His once vibrant presence now reduced to a haunting stillness, a stark contrast to the lively party that had just unfolded.

Jane's breath caught in her throat as she knelt beside Brian, her fingers brushing against the cool fabric of his suit. The clock on the wall, its hands frozen in time, showed ten minutes past eleven. A wave of disbelief washed over her, quickly followed by a surge of determination. This was not merely a tragic accident; something sinister had occurred. She glanced around the room, her gaze landing on Colin Enright, who stood pale and wide-eyed, staring blankly at the floor as if trying to comprehend the horror before him. The tension in the room was palpable, each guest seemingly grappling with their own shock and fear, their eyes darting nervously from one to another.

The clock was tampered with to show a later time, misleading the investigation regarding the time of death. Jane's mind raced as she processed the implications of the clock's frozen hands. If the time was indeed accurate, it suggested that Brian had died after the last guests had departed, a notion that felt increasingly implausible. She needed to gather her thoughts and piece together the events of the evening. The guests were anxious and suspicious of each other, and Jane had a sinking feeling that the answers lay hidden in the shadows of their interactions. Colin's nervous fidgeting caught her attention; he was twisting a handkerchief in his hands, the fabric crumpling under the pressure of his grip.

Carol Molloy, standing nearby, had a look of disbelief etched across her features. Her usual air of confidence was replaced by a palpable tension. Jane noted how Carol avoided eye contact, her gaze flitting around the room as if searching for an escape. There was something unsettling about her demeanor, a hint of guilt that Jane couldn’t ignore. As the reality of the situation settled in, Jane felt the weight of responsibility pressing upon her. She was the one who had to uncover the truth, to navigate the murky waters of deception that now surrounded them. The stakes were high, and she could sense the urgency in the air.

The study, once a place of warmth and laughter, now felt like a crypt of secrets. Jane's eyes darted back to Colin, who seemed to be lost in thought. His connection to Brian was undeniable, and yet, he appeared utterly bewildered. What had transpired in the moments before Brian's death? The clock's hands, frozen at ten minutes past eleven, raised immediate questions about the timeline of events. Jane's instincts told her that the truth was buried beneath layers of lies and half-truths, waiting to be unearthed. She needed to act quickly, to gather the guests and begin her investigation before the shadows of suspicion grew too deep.

As she rose to her feet, Jane took a deep breath, steeling herself for the task ahead. The clock had not only marked the hour of Brian's death; it had also set the stage for a mystery that demanded resolution. With determination in her heart, she turned to the gathered guests, ready to confront the tangled web of relationships and motives that had led to this tragic moment. Each of them had a role to play in the unfolding drama, and Jane was determined to uncover the truth, no matter where it led her.
--- END PRIOR CHAPTER 1 ---

--- BEGIN PRIOR CHAPTER 2 ---
Title: Chapter 2: Initial Reactions
"We heard a loud thud at half past ten," Colin Enright insisted, his voice rising above the chaotic murmurs that filled the study of the Enright residence. The evening was damp, the air thick with tension as the rain tapped insistently against the windowpanes. Jane O'Connor stood at the center of the room, her heart racing, grappling with the implications of Colin's words. The clock on the wall, its hands frozen in time, showed ten minutes past eleven. The stark contrast between the two claims sent a shiver down her spine. She had to make sense of this mess, and quickly.

Colin's gaze darted around the room, searching for support, but Jane could see the flicker of doubt in his eyes. The clock in the study shows ten minutes past eleven. This was a critical detail. If Brian Scanlon had indeed died after the last guest left, as Colin claimed, it raised troubling questions about the timeline of events. Could the clock be wrong? Or was someone trying to manipulate the narrative? The weight of suspicion hung heavy in the air, and Jane felt the urgency to uncover the truth before it slipped away.

Carol Molloy stood nearby, her expression a mixture of disbelief and anxiety. She nervously bit her lip, glancing at Colin for support. "But we were all here, weren't we? How could anyone have left without us noticing?" Her voice trembled slightly, revealing a crack in her composed facade. Jane noted the way Carol's eyes flickered towards Colin, as if seeking reassurance. Was she genuinely confused, or was there something more beneath the surface? The tension in the room amplified as the guests began to argue over the timeline of events, each trying to deflect suspicion onto the others.

"I was in the garden tending to the flowers when I heard the thud," Sean Murphy interjected, his voice steady but laced with an undercurrent of frustration. "I know what I heard, and it was before ten-thirty. You all can’t just ignore that!" His loyalty to the estate was evident, but Jane couldn't help but wonder if his alibi was as solid as he claimed. The garden was a secluded area, and it was easy to imagine someone slipping away unnoticed amidst the overgrown hedges.

As the arguments escalated, Jane felt the weight of responsibility pressing upon her. She needed to gather the facts, to sift through the chaos and find clarity. The clock had not only marked the hour of Brian's death; it had also set the stage for a mystery that demanded resolution. With determination in her heart, she interrupted the bickering, her voice cutting through the din. "Everyone, please! We need to focus on what we know. The clock shows ten minutes past eleven, but Colin claims he heard a thud at half past ten. These two accounts do not align. We need to figure out why."

The room fell silent, the tension palpable as Jane's words hung in the air. She could see the gears turning in their minds, each suspect grappling with the implications of her statement. Colin's brow furrowed, and Carol's eyes widened. Sean crossed his arms, his posture defensive. The atmosphere was charged, and Jane sensed that they were all aware of the stakes. Each of them had something to lose, and the truth was buried beneath layers of deception. She needed to dig deeper, to uncover the secrets that lay hidden in their interactions.

As the silence stretched, Jane took a moment to observe the faces around her. Colin, with his carefully crafted lawyerly demeanor, seemed to be struggling with the weight of the moment. Carol's usual air of confidence had been replaced by a palpable tension, her eyes darting nervously. Sean, the loyal groundskeeper, stood with his arms crossed, a mix of frustration and concern etched on his features. Each of them was hiding something, and Jane was determined to uncover the truth, no matter the cost.

In that moment, Jane realized that the investigation was not just about finding the murderer; it was about understanding the complex web of relationships that had led to this tragedy. The clock's frozen hands were a reminder that time was slipping away, and she needed to act swiftly. With each passing moment, the stakes grew higher, and the shadows of suspicion deepened. She would not rest until she had unraveled the truth, no matter how tangled the threads might be.
--- END PRIOR CHAPTER 2 ---

# Case Overview
Title: The Clock Strikes Deceit
Era: 1930s
Setting: Little Middleton, Yorkshire
Crime: murder (premeditated)
Culprit: Colin Enright
False assumption: Brian Scanlon must have died after the last guest left.
Cast: Brian Scanlon (he/him), Carol Molloy (she/her), Colin Enright (he/him), Jane O'Connor (she/her), Sean Murphy (he/him)

Setting Lock: Keep all scenes and descriptions consistent with the stated setting (Little Middleton, Yorkshire). Do not introduce a different location type. Do not invent an alternative estate name. The only permitted name for this property is "Little Middleton, Yorkshire" — any other estate name (e.g., "Caldwell Manor", "Ashwood Hall", or any invented proper name) is a continuity error that will be caught and rejected.

⛔ PRONOUN LOCK (verify every sentence before writing):
• Brian Scanlon — he/him/his (NEVER she/her)
• Carol Molloy — she/her/her (NEVER he/him)
• Colin Enright — he/him/his (NEVER she/her)
• Jane O'Connor — she/her/her (NEVER he/him)
• Sean Murphy — he/him/his (NEVER she/her)

Outline scenes:
[
  {
    "sceneNumber": 3,
    "act": 1,
    "title": "The Investigation Begins",
    "setting": {
      "location": "the study of the Enright residence",
      "timeOfDay": "Later that evening",
      "atmosphere": "Quiet, with an air of suspicion"
    },
    "characters": [
      "Jane O'Connor",
      "Colin Enright",
      "Carol Molloy",
      "Sean Murphy"
    ],
    "purpose": "Establish the detective's role and gather initial clues",
    "cluesRevealed": [
      "clue_1",
      "clue_3",
      "clue_4"
    ],
    "dramaticElements": {
      "conflict": "Tensions rise as the detective begins questioning",
      "tension": "Each suspect feels the pressure of suspicion",
      "microMomentBeats": [
        "Jane's hands tremble slightly as she takes notes, feeling the weight of the situation."
      ]
    },
    "summary": "With the guests still reeling, Jane takes charge, determined to uncover the truth. She examines the study, noting the disarray and the broken vase nearby. As she questions Colin, Carol, and Sean, she discovers conflicting accounts of their whereabouts during the time of death. The clock's time discrepancy weighs heavily on her mind, and she resolves to find out who manipulated it.",
    "estimatedWordCount": 1500,
    "emotionalRegister": "Initial investigations reveal deep-seated secrets among the guests.",
    "dominantCharacterNote": {
      "name": "Carol Molloy",
      "voiceRegister": "Carol's airy elegance is punctuated with playful sarcasm, reflecting her socialite charm."
    },
    "humourGuidance": {
      "permission": "conditional",
      "character": "Jane O'Connor",
      "form": "sardonic",
      "condition": "Only if Jane uses her wit to deflect the tension."
    },
    "eraTextureNote": "Limited transportation options due to economic hardships; Frequent power outages affect daily life and communication; Communication relies heavily on the postal system and typewriters; Public gatherings are scrutinized for propriety and decorum; Social mobility is severely limited by established class structures",
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
□ Chapter 3: "This indicates that the death may have occurred before the clock showed its current time." is placed in the first 25% of the chapter, followed by an explicit inference or suspicion paragraph.
□ Chapter 3: "Witnesses report hearing a loud thud at half past ten." is placed in the first 25% of the chapter, followed by an explicit inference or suspicion paragraph.
□ Chapter 3: "This indicates that the death may have occurred before the clock showed its current time." is placed in the first 25% of the chapter, followed by an explicit inference or suspicion paragraph.
□ Chapter 3: "The clock was tampered with to show a later time, misleading the investigation regarding the time of death." is placed in the first 25% of the chapter, followed by an explicit inference or suspicion paragraph.
□ Chapter 3: "Direct evidence ties Colin Enright to the mechanism access point before the discriminating test." is placed in the first 25% of the chapter, followed by an explicit inference or suspicion paragraph.
□ First chapter in this batch opens by continuing the previous chapter closing beat (same unresolved object, question, movement, or emotional pressure).
□ For every chapter after Chapter 1, include at least one NEW character pressure reveal (fear, motive, lie, loyalty conflict, or victim relationship).
□ Each post-Chapter-1 character reveal changes investigation state (more/less suspicious, lie explained, motive exposed, emotional cost deepened, or investigator understanding updated).
□ No post-Chapter-1 chapter contains static biography-only character paragraphs.
□ Mode check (Suspect Pressure): chapter contains a NEW pressure reveal (fear, motive, lie, loyalty conflict, or secret).
□ Mode check (Suspect Pressure): no full culprit confession in this mode unless outline-required.
□ PRONOUN AUDIT — for every character you named in your chapters, list the pronouns you actually used, then verify against the canonical table. Correct any mismatch before outputting. Do NOT include this audit in your JSON output.
  Character            | Canonical     | Used in draft | Match?
  ---------------------|---------------|---------------|-------
  Brian Scanlon        | he/him/his/himself        | [fill in]     | [yes/no]
  Carol Molloy         | she/her/her/herself       | [fill in]     | [yes/no]
  Colin Enright        | he/him/his/himself        | [fill in]     | [yes/no]
  Jane O'Connor        | she/her/her/herself       | [fill in]     | [yes/no]
  Sean Murphy          | he/him/his/himself        | [fill in]     | [yes/no]
□ Return valid JSON only.
```

## Message 4 (role=user)

```text
SINGLE-PASS RETRY CONTRACT
Goal: resolve every listed issue for chapter(s) 3 in this one retry.
Retry mode: TARGETED_REBUILD.
Attempt context: 2/6 | primary class: template.
Why this mode: template failure detected; prior wording is likely harmful anchor.

SOURCE OF TRUTH
- Do not preserve sentence structure from the failed draft; use the scene instructions and hard constraints as the source of truth.
- Hard constraints outrank the previous draft: cast/pronoun lock, locked facts, clue obligations, stage-mode rules, and chapter JSON shape.

PRIMARY FAILURES
- Template linter: repeated long paragraph fingerprint detected. Rewrite repeated scaffold-like prose into chapter-specific language.
- Template linter: high n-gram overlap detected (1.00 >= 0.65). Rephrase this passage to avoid template leakage.

REWRITE PLAN
- Treat the scene instructions, cast lock, clue obligations, and locked facts as the source of truth; do not preserve failing wording from the previous draft.
- Rewrite any paragraph touched by a failing issue as a fresh paragraph rather than patching a single sentence.

SUCCESS CHECKLIST
- Every listed issue below is resolved in this single attempt before you answer.
- Primary failure class cleared: template.
- The revised chapter reads as a clean rewrite of the failing parts, not a lightly patched copy of the rejected draft.

OUTPUT RULES
- Return complete corrected JSON for chapter(s) 3 only.
- Do not explain what you changed.
- Do not leave one issue unresolved while fixing another.
- If two instructions conflict, prefer the one that clears the validator and preserves story logic.

RETRY PHASE: 2 of 2 — QUALITY POLISH ONLY
Logic and contract requirements are already satisfied. This attempt fixes style/quality issues only.
REGRESSION GUARD: You must not introduce any new logic failures while fixing quality issues.
Specifically, do not alter: discriminating test logic, clue evidence sentences, character names or pronouns, alibi claims, or stage-mode outcomes.
If fixing a quality issue would require touching logic-sensitive text, rephrase the surrounding prose instead.

Attempt 2/6 — chapters 3 — 2 validation issue(s) to resolve:

═══ TEMPLATE LEAKAGE ERRORS (2) ═══
• Template linter: repeated long paragraph fingerprint detected. Rewrite repeated scaffold-like prose into chapter-specific language.
• Template linter: high n-gram overlap detected (1.00 >= 0.65). Rephrase this passage to avoid template leakage.

⛔ BANNED PARAGRAPH — DO NOT REPRODUCE ANY SENTENCE FROM THIS TEXT:
"as the arguments escalated jane felt ... we need to figure out why"

Every sentence in your response must be a sentence that could NOT appear in any of the above passages.
You may write about the same event, but from a different physical position, a different
sensory angle, or at a different moment in the scene. You may not preserve a single clause.

⛔ NEAR-DUPLICATE PASSAGE — your prose closely echoes this prior paragraph:
"as the arguments escalated jane felt ... we need to figure out why"

Rewrite any paragraph that shares sentence structure or extended phrases with any of the above texts.
Different words for the same image are not sufficient — the sentence structure must also differ.

⛔ PRIOR CHAPTER DUPLICATION LOCK — 14 protected passage(s):
Your prose has been detected copying from an earlier chapter. Every paragraph listed below appears in a prior chapter and is COMPLETELY OFF-LIMITS. Do not reproduce, rephrase, or structurally echo any of them:

  • "The evening air was thick with ... the study of the Enright residence."
  • "Jane's breath caught in her throat ... the cool fabric of his suit."
  • "The clock was tampered with to ... investigation regarding the time of death."
  • "Carol Molloy, standing nearby, had a ... of disbelief etched across her features."
  • "The study, once a place of ... felt like a crypt of secrets."
  • "As she rose to her feet, ... steeling herself for the task ahead."
  • ""We heard a loud thud at ... the study of the Enright residence."
  • "Colin's gaze darted around the room, ... flicker of doubt in his eyes."
  • "Carol Molloy stood nearby, her expression a mixture of disbelief and anxiety."
  • ""I was in the garden tending ... laced with an undercurrent of frustration."
  • "As the arguments escalated, Jane felt ... weight of responsibility pressing upon her."
  • "The room fell silent, the tension ... Jane's words hung in the air."
  • "As the silence stretched, Jane took ... to observe the faces around her."
  • "In that moment, Jane realized that ... that had led to this tragedy."

Write as if you cannot see the prior chapters. Compose every paragraph fresh from the scene instructions alone.

═══ RETRY MICRO-PROMPTS (2) ═══
• REPAIR [template_overlap — attempt 2 — STRUCTURED REWRITE MODE]: Overlap detected; freeform retry mode is disabled for this chapter.
  Treat the prior draft as DISCARDED. Rebuild paragraph-by-paragraph in this order:
  Para 1: A named character performs a concrete physical action tied to this chapter's scene objective.
  Para 2: Introduce one scene-specific clue/observation through dialogue or direct sensory perception.
  Para 3+: Advance the conflict with chapter-specific consequences; vary sentence openings and clause structures.
  Do NOT preserve sentence skeletons from prior drafts. Every paragraph must use a distinct syntactic frame.
• WORD COUNT TARGET [template_overlap — attempt 2]: While rephrasing for uniqueness, you MUST write at least 1250 words.
  Do NOT shorten this chapter. A rewrite significantly shorter than 1250 words will fail validation.
  Expand with additional investigation beats, character reactions, or sensory detail — do not cut content to achieve variety.

Return corrected JSON for chapters 3. Edit only the sections that failed — keep all content that passed validation, and return the complete updated chapter JSON.


RETRY CLASS: template
ATTEMPT: 1/6
OFFENDING TEXT: repeated long paragraph fingerprint detected. Rewrite repeated scaffold-like prose into chapter-specific language.
MANDATORY FIXES:
- Resolve template issues before accepting this batch.
- Template linter: repeated long paragraph fingerprint detected. Rewrite repeated scaffold-like prose into chapter-specific language.
- Template linter: high n-gram overlap detected (1.00 >= 0.65). Rephrase this passage to avoid template leakage.
```
