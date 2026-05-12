# Actual Prompt Record

- Run ID: `mystery-1778553574804`
- Project ID: ``
- Timestamp: `2026-05-12T16:36:37.423Z`
- Agent: `Agent9-ProseGenerator-Ch3`
- Operation: `chat_request_full_prompt`
- Model: `GPT-4o-mini`
- Temperature: `0.42`
- Max Tokens: `4500`
- Attempt: `first`
- Prompt Hash: `c7b87c5627a7636a`

## Message 1 (role=system)

```text
You are an expert prose writer for classic mystery fiction. Your role is to write compelling, atmospheric narrative chapters that read like a professionally published novel.

⛔ ABSOLUTE RULE — CHARACTER NAMES:
The ONLY characters who exist in this story are: Eleanor Voss (woman), Dr. Mallory Finch (man), Captain Ivor Hale (man), Beatrice Quill (woman).
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
- MORAL COMPLEXITY REQUIREMENT: The mechanism of this crime carries a moral gray area: "The murderer believed they were protecting a loved one from a dangerous individual, complicating the morality of their actions." — the culprit reveal and denouement MUST acknowledge this ambiguity. Do not let the ending feel clean or simple. Give the reader at least one moment of uncomfortable sympathy or moral doubt.


⚠️ AMATEUR DETECTIVE STORY: The investigator is a civilian with no official standing. The official police (if they appear) are unnamed background figures only — "a constable", "the sergeant", "an officer from the village". Do NOT give any police official a name or title+surname combination. There is no Inspector [Surname], no Constable [Surname], no Sergeant [Surname] in this story.

PRONOUN ACCURACY — MANDATORY CONTINUITY CONTRACT

The following pronouns are locked facts, on the same level as character names
and hard-logic device values. Using the wrong pronoun is a continuity error,
not a style choice.

Canonical pronoun table (subject / object / possessive / reflexive):
  • Eleanor Voss: she/her/her/herself
  • Dr. Mallory Finch: he/him/his/himself
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

## Era: 1936-08
In August 1936, the air is thick with humidity, punctuated by the occasional rain shower that blurs the lines between the opulent world of the upper classes and the struggles of the working poor. The Great Depression has left scars on the economy, creating an atmosphere of tension that pervades everyday life. Social gatherings at grand manors are marred by whispers of financial ruin, and the specter of fascism looms large over Europe, casting shadows on the minds of citizens. The countryside is alive with the sounds of cricket matches and garden parties, yet beneath this festive facade lies a palpable anxiety about the future. People navigate strict class distinctions, and the expectations of propriety weigh heavily on interactions, creating a world where every gesture and word holds meaning. Amidst this backdrop, the intricate dance of societal roles plays out, revealing the fragility of reputation and the desperation of those clinging to the remnants of their past lives.
Emotional register: The collective emotional state is marked by a deep-seated anxiety, colored by uncertainty and the fear of losing what little stability remains.
Physical constraints: Overcast skies limit outdoor activities, creating a sense of confinement. | Travel is restricted due to economic pressures and the need for caution. | Communication relies on outdated technologies, hampering timely exchanges. | Transportation options are limited, affecting social mobility and gatherings.
Current tensions (weave into background texture): The ongoing Spanish Civil War highlights the threat of fascism in Europe. | The economic effects of the Great Depression loom over social interactions. | Tensions rise as class distinctions become more pronounced.
Wartime context — Many men are still recovering from the impact of World War I, while others are preparing for potential conflict as tensions rise in Europe.: The absence of men who served creates a gap in many families, leading to shifting roles for women who must now navigate both domestic and economic responsibilities. Absence effect: The absence of these men amplifies the pressure on women and families, forcing them to confront the realities of survival in an increasingly unstable world.

## Story Theme
In a world where personal secrets and societal pressures collide, the desperate actions of individuals reveal how the past can dictate the course of the present.

## Story Emotional Register
Dominant: The emotional journey is one of escalating tension and revelation.

Arc:
The story begins in the grandiose setting of Waverly Manor, where Eleanor Voss is preparing for a lecture, her mind clouded with worries about her family’s legacy and financial stability. As she engages with guests, a sense of unease permeates the air, hinting at the looming tensions that will soon erupt. The atmosphere shifts dramatically with the discovery of Eleanor's body, plunging the guests into chaos and igniting a whirlwind of suspicion. Each character grapples with their own motives and secrets, leading to a rising tension as conflicting alibis emerge. 

As the investigation unfolds, the stakes become increasingly personal; Eleanor’s friends and acquaintances are forced to confront their own hidden truths. The narrative reaches its first turning point as clues hint at a deeper conspiracy tied to the tampered clock, suggesting a premeditated act that shakes the foundation of trust among the guests. The atmosphere grows darker as revelations about each character's past surface, revealing how their lives are intertwined with the victim's fate. 

The second turning point comes when the investigation narrows down to Eleanor herself, as evidence mounts against her, portraying her as both the victim and the perpetrator of her own demise. The climax erupts in a confrontation where the clock's tampering is exposed, revealing the depth of Eleanor’s desperation to protect her family's legacy. In the resolution, the truth is laid bare, and the characters must grapple with the consequences of their actions, leaving behind a lingering sense of loss and the weight of unspoken truths. The final moments echo with a bittersweet clarity, as the characters emerge not unscathed but transformed, forever altered by the events that transpired within the walls of Waverly Manor.

## Emotional register at this point in the story
Tension builds as the body is discovered, plunging the evening into chaos.

## Character Portraits (appearance & era)

### Eleanor Voss
Eleanor Voss embodies the struggle of a woman caught between her family's legacy and the societal expectations of the 1930s. Her passion for history and desire to maintain her family's reputation are at odds with the harsh realities of financial instability and personal desperation. As she navigates the complexities of the murder investigation, Eleanor's internal conflict reflects the broader societal tensions of the era, where class distinctions and personal ambition collide.
Era intersection: Eleanor's fight to preserve her family's legacy resonates with the anxieties of the time, as the Great Depression forces many to confront the fragility of their social standing.

### Dr. Mallory Finch
Dr. Mallory Finch represents the pressures faced by professionals in a struggling economy. As a physician, he grapples with the expectations of his role while hiding a dark secret that could jeopardize his career. His character illustrates the complexities of ambition and the lengths individuals will go to protect their reputations in a time of economic uncertainty.
Era intersection: Mallory's internal struggles exemplify the fears of professionals who must navigate the precarious balance between ambition and ethical responsibility during the Great Depression.

### Captain Ivor Hale
Captain Ivor Hale embodies the tension between honor and desperation in a society grappling with class disparities. His stature as a retired naval officer contrasts with his simmering resentment towards the victim, revealing the personal stakes intertwined with the broader societal issues of the time. Ivor's character reflects the struggle for control and recognition within a shifting social landscape.
Era intersection: Ivor's conflicts resonate with the societal pressures of the 1930s, where the weight of family legacies and class expectations shape personal ambitions.

## Character Voices

### Eleanor Voss (she/her/her)
Eleanor speaks with a measured tone, often punctuating her observations with dry humor.
[comfortable] You know, the past has a way of creeping up on us, like an old friend who just won't leave.
[evasive] I suppose it all depends on one's perspective, wouldn't you agree?
[stressed] I just need to find a way to keep it all together before it unravels completely.
Humour: Eleanor often uses dry wit to mask her underlying anxieties.

### Dr. Mallory Finch (he/him/his)
Mallory speaks with a slight stammer when nervous, often punctuating his sentences with self-deprecating remarks.
[comfortable] Well, I think we can all agree that the human body is quite a fascinating subject.
[evasive] You see, it's not that simple; there are many layers to consider, really.
[stressed] I didn't mean to… I mean, it wasn't my intention to… oh dear, what have I done?
Humour: His self-deprecating humor often surfaces as a defense mechanism.

### Captain Ivor Hale (he/him/his)
Ivor speaks with a commanding voice, often employing formal language punctuated with dry humor.
[comfortable] Ah, the sea has a way of teaching one about the depths of character.
[evasive] I believe we ought to focus on matters of honor, which are paramount in these times.
[stressed] It's just that the stakes are higher than ever, and I cannot afford to falter now.
Humour: Ivor uses polite humor to navigate tense situations.

## Location Registers (scene framing guides)

The Library: The library feels both grand and suffocating, filled with the weight of history and the tension of recent events. As secrets linger in the air, each corner seems to whisper forgotten truths while the looming shadows cast doubts over the intentions of those who gather within.. Camera angle: Entering the library invites a sense of unease, as if every book and shadow holds a key to the unfolding mystery.. Era: The library's ornate decor contrasts sharply with the underlying tension, serving as a reminder of the societal expectations that bind its occupants.

The Drawing Room: The drawing room is alive with an undercurrent of suspicion, where the air crackles with unspoken words and strained smiles. The opulent surroundings provide a stark contrast to the tension brewing among the guests, each of whom wears a mask of civility that barely conceals their anxieties.. Camera angle: Approaching the drawing room evokes a sense of apprehension, as the lavish decor seems to mock the fragile trust binding its guests.. Era: This space, rich with history, serves as a battleground for class distinctions and personal ambitions.

The Servants' Hall: In the servants' hall, camaraderie mixes with tension as staff members share whispered conversations, exchanging glances filled with concern. This modest space, filled with the scent of freshly baked bread, provides a fleeting escape from the pressures of their roles, yet the looming mystery casts a shadow over their camaraderie.. Camera angle: Entering the servants' hall offers a glimpse into the hidden struggles of those who serve, where laughter and worry coexist.. Era: The simplicity of the servants' hall stands in stark contrast to the opulence of the manor, reflecting the class divides of the era.

## Humour guidance for this story position (early)
Permission: permitted
Rationale: Humor can help to balance the initial shock of the murder.

## Reveal Groundwork (texture — do not explain, only plant)
- Plant one subtle observable beat related to: "In the early scenes, the tension surrounding the clock's time becomes a focal point, making the hidden-truth of its tampering all the more poignant". Do not explain significance yet.
- Plant one subtle observable beat related to: "The discovery of Eleanor’s body shifts the guests' dynamics, exposing hidden motives and alliances that will redefine their relationships". Do not explain significance yet.
- Plant one subtle observable beat related to: "The culmination of the investigation not only uncovers the truth behind the murder but also forces each character to confront their own secrets and regrets, reshaping their lives forever". Do not explain significance yet.

FAIR-PLAY AND INFERENCE CONTRACT (from CML logic):
- False assumption in force: Eleanor Voss was alive at the time the clock chimed, suggesting she was murdered later than she actually was.
- Hidden truth to progressively expose: The clock's tampering obscures the actual time of death and the murderer’s access.
- Inference path checkpoints to dramatize clearly (observation -> correction -> effect):
  - Step 1: obs: The clock hands are stuck at ten minutes past eleven. | corr: The clock displaying the wrong time suggests it was tampered with. | effect: Narrows suspects to those who had access to the clock.
  - Step 2: obs: Witnesses recall the clock chiming at odd intervals. | corr: The inconsistency in chiming suggests tampering occurred shortly before the murder. | effect: Eliminates anyone who could not have accessed the clock before the murder.
  - Step 3: obs: The clock's winding mechanism shows signs of recent tampering. | corr: The tampering indicates premeditated manipulation of the clock. | effect: Points towards Eleanor as the guilty party, as she had the most access.
- Discriminating test method: trap
- Discriminating test design constraint: A controlled demonstration of the clock's tampering is staged, showing how it could mislead time of death.
- Test must rely on already-shown clue IDs: clue_1, clue_2, clue_3, clue_4, clue_5
- Fair-play rationale: Step 1: The clock's incorrect time (early) and witness statements (mid) allow the reader to question the timing of Eleanor's death. Step 2: The clock's tampering evidence (mid) eliminates Dr. Finch and Captain Hale. Step 3: The controlled demonstration reveals Eleanor's manipulative actions.
- Never solve by withheld information. Keep reader-information parity with detective reasoning.

## Character Reference

### Eleanor Voss
Eleanor speaks with a measured tone, often punctuating her observations with dry humor
She has a penchant for intricate vocabulary but softens her delivery with a warm, inviting cadence.
Eleanor grapples with a profound sense of inadequacy, fearing that her family's past will overshadow her efforts to carve out a legacy of her own.

### Dr. Mallory Finch
Mallory speaks with a slight stammer when nervous, often punctuating his sentences with self-deprecating remarks
He tends to over-explain his thoughts, revealing his underlying anxiety.
Mallory is plagued by guilt over his past decisions, fearing that his ambition may have cost someone their well-being, a truth he cannot afford to confront.

### Captain Ivor Hale
Ivor speaks with a commanding voice, often employing formal language punctuated with a touch of dry humor
His cadence is steady, reflecting his military background, and he occasionally lapses into naval jargon when passionate.
Ivor struggles with feelings of inadequacy, torn between his public image as a respected leader and the resentment he feels towards the victim and the unfulfilled promises of his family's past.



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

Primary Location: Waverly Manor (Little Middleton, England)
Waverly Manor stands as an imposing testament to early 20th-century aristocracy, its grand architecture surrounded by meticulously maintained gardens and a high stone wall that isolates it from the outside world.

Key Locations Available:
- The Library (interior): Crime scene
- The Drawing Room (interior): Gathering space
- The Servants' Hall (interior): Staff gathering space

Atmosphere: Tense, with an undercurrent of suspicion among the guests.
Weather: Overcast with occasional rain, typical for late spring in the countryside.

Era markers: A large radio crackles in the corner of the drawing room, broadcasting the latest news updates. | Manual typewriters are set up in the study, where correspondence is carefully crafted and sent via telegram. | The household staff communicate via a party line telephone system, their conversations often overheard.

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
  - Visual: Rich mahogany shelves tower high, their surfaces dusted with neglect, while the flickering light from the lamp creates dancing shadows on the walls., A plush, burgundy carpet muffles footsteps, its intricate patterns drawing the eye and hinting at the room's former grandeur.
  - Sounds: The quiet rustle of pages turning echoes softly, as if the books themselves are whispering secrets., The creaking of the old floorboards underfoot adds a layer of tension, each sound amplified in the stillness.
  - Scents: The musty scent of old paper and leather fills the air, mingling with the faint aroma of tobacco from a nearby ashtray., A hint of dampness lingers, a reminder of the rain outside that seeps into every corner of the manor.
  - Touch: The smooth surface of the desk contrasts with the rough texture of the carpet, creating a tactile dichotomy that reflects the room's dual nature., The coolness of the polished wood beneath one's fingers is a stark reminder of the secrets it may hold.

The Drawing Room (interior):
  - Visual: Rich tapestries hang from the walls, their colors muted yet regal, creating a sense of history and grandeur., The polished floor reflects the light from the chandelier, enhancing the elegance of the space.
  - Sounds: The soft murmur of conversation fills the air, punctuated by the occasional laughter that feels strained and nervous., The distant sound of a radio broadcast provides a backdrop, its crackling voice weaving through the atmosphere.
  - Scents: The scent of freshly polished wood mingles with the floral notes from arrangements of peonies and roses on the mantle., An underlying hint of tobacco smoke lingers, a remnant of previous discussions and clandestine meetings.
  - Touch: The soft upholstery of the armchairs invites guests to sink into comfort, yet the tension in the air makes it hard to relax., The coolness of the marble fireplace contrasts sharply with the warmth of the room, symbolizing the underlying discord.
[truncated for prompt budget]

## Texture Pool
Draw on these as opportunities arise — you are not required to use them.

- In August 1936, the air is thick with humidity, punctuated by the occasional rain shower that blurs the lines between the opulent world of the upper classes and the struggles of the working poor
- The Great Depression has left scars on the economy, creating an atmosphere of tension that pervades everyday life
- Social gatherings at grand manors are marred by whispers of financial ruin, and the specter of fascism looms large over Europe, casting shadows on the minds of citizens
- The countryside is alive with the sounds of cricket matches and garden parties, yet beneath this festive facade lies a palpable anxiety about the future
- People navigate strict class distinctions, and the expectations of propriety weigh heavily on interactions, creating a world where every gesture and word holds meaning

TEMPORAL CONTEXT:

This story takes place in August 1936 during summer.

Seasonal Atmosphere:
- Weather patterns: overcast skies, occasional rain showers, muggy and humid conditions
- Daylight: Long summer days with twilight stretching into the evening, but thick clouds often dimming the light.
- Seasonal activities: garden parties with tea and cakes, outdoor cricket matches, evening strolls during mild weather
- Seasonal occasions: Notting Hill Carnival (held in August, though not widely known outside of London)
- Season: summer

Period Fashion (describe naturally):
- Men formal: three-piece suits in light wool, crisp white dress shirts, bow ties or narrow neckties
- Men casual: lightweight linen slacks, short-sleeved button-up shirts, straw boater hats
- Men accessories: cufflinks, pocket squares, classic wristwatches
- Women formal: tea-length dresses with floral patterns, tailored jackets for evening gatherings, cloche hats adorned with ribbons
- Women casual: sundresses in pastel colors, light cardigan sweaters, comfortable espadrilles
- Women accessories: string of pearls, stylish handbags, silk scarves tied around the neck

Cultural Context (reference naturally):
- Music/entertainment: 'Pennies from Heaven' by Bing Crosby, 'The Way You Look Tonight' by Jerome Kern, Swing music begins to rise in popularity; Films: 'Modern Times' featuring Charlie Chaplin, 'My Man Godfrey'; Theatre: 'Show Boat' continues its successful run, 'Porgy and Bess' debuts; Radio: The Shadow, Lux Radio Theatre
- Typical prices: Loaf of bread: four pence, A pint of milk: two pence, Movie ticket: one shilling
- Current events: the Spanish Civil War rages on, highlighting fascism's threat in Europe; Olympic Games held in Berlin, showcasing Nazi propaganda
- Literature: 'The Maltese Falcon' by Dashiell Hammett | 'Gone with the Wind' by Margaret Mitchell | 'The Glass Key' by Dashiell Hammett | [mystery and detective fiction] | [romantic fiction] | [social commentary literature]
- Technology: the ballpoint pen is patented | advancements in radio technology enhance broadcasts | the first automatic washing machine is introduced | radio sets in most homes | telephones with party lines | manual typewriters for correspondence
- Daily life: attending garden parties or picnics, participating in local sporting events, gathering for evening radio broadcasts
- Social rituals: afternoon tea with family and friends, formal dinner parties with set seating arrangements

Atmospheric Details:
The scent of damp earth fills the air as rain intermittently falls, mingling with the aroma of blooming flowers in the manor's gardens. The soft murmur of distant thunder underlines the tense atmosphere, while guests exchange uneasy glances during the evening's gathering. Candles flicker against the darkening windows, casting shadows that dance across the walls, hinting at secrets hidden within the opulent decor.

FASHION INTEGRATION TECHNIQUES:
- First appearance: Describe outfit to establish class/personality
- Accessories: Gloves, hats, pocket watches, jewelry reveal status
- Time-specific: Different outfits for different times of day
- Character traits: Fastidious dresser vs rumpled appearance
- Action integration: "She tugged at her glove" or "He adjusted his tie"
- Weather appropriate: Overcoats in winter, light linen in summer

CULTURAL TOUCHSTONE INTEGRATION:
[truncated for prompt budget]

NON-NEGOTIABLE CHAPTER OBLIGATIONS — LOCKED EVIDENCE PHRASES (VERBATIM REQUIRED):
The following physical evidence values are absolute ground truth. Every time this chapter describes, mentions, or alludes to the relevant evidence — no matter how briefly — it MUST use the exact phrase shown below, character for character. NO paraphrase, approximation, rounding, or synonym is permitted.

FAILURE EXAMPLE: if the locked value is "at thirteen minutes to midnight" and you write "just before midnight" or "around midnight" — that is a HARD FAIL. You must write "at thirteen minutes to midnight". Equally, if the locked value is written in words, such as "ten minutes past eleven", and you convert it to figure-based clock notation — that is also a HARD FAIL. Words stay as words; figure forms are forbidden for word-phrased facts.

CRITICAL — WORD-PHRASED VALUES: If the canonical value is written out in words (e.g. a time like "ten minutes past eleven", or an amount like "forty minutes"), reproduce those exact words. DO NOT convert to figure-based time notation, twenty-four-hour format, or any other numeric shorthand. Correct: "ten minutes past eleven". WRONG: figure-based clock notation or numeric shorthand.

Locked facts:
  - The exact time shown on the stopped clock face: "ten minutes past eleven"
  - The exact amount the clock was wound back: "forty minutes"
  - The true time of the victim's death: "twenty minutes past ten"

If a locked fact has no relevance to this chapter, omit it. But the moment you reference the underlying evidence, only the exact phrase above is acceptable.

⛔ CLUES TO SURFACE IN THESE CHAPTERS — mandatory:
The following evidence MUST be clearly observable to an attentive reader. Do not bury it in atmosphere or passing dialogue. Each clue must be concrete, specific, and noticeable:

• [clue_5] A mechanical clock was wound back to mislead the timing of the murder.
  Category: temporal | Criticality: essential | Supports inference step 1
  Points to: This reveals the core mechanism of the crime.

• [clue_fp_contradiction_step_1] The clock hands are stuck at ten minutes past eleven.
  Category: temporal | Criticality: essential | Supports inference step 1
  Points to: The clock displaying the wrong time suggests it was tampered with.

• [clue_1] The clock hands are stuck at ten minutes past eleven.
  Category: temporal | Criticality: essential | Supports inference step 1
  Points to: This indicates a potential manipulation of the timekeeping mechanism.

• [clue_2] Witnesses recall the clock chiming at odd intervals.
  Category: temporal | Criticality: essential | Supports inference step 1
  Points to: This suggests that the clock's accuracy was compromised.

For each clue above: an attentive reader should be able to find, record, and later use it to reason toward the solution.

═══ NARRATIVE STATE (read-only — do not contradict) ═══

LOCKED FACTS — use verbatim whenever this evidence is described:
  • The exact time shown on the stopped clock face: "ten minutes past eleven"
  • The exact amount the clock was wound back: "forty minutes"
  • The true time of the victim's death: "twenty minutes past ten"

CHARACTER PRONOUNS — never deviate from these:
  • Eleanor Voss: she/her/her
  • Dr. Mallory Finch: he/him/his
  • Captain Ivor Hale: he/him/his
  • Beatrice Quill: she/her/her

CLUES ALREADY REVEALED TO READER: clue_1, clue_2 — do not reveal these as new information.

CONTINUITY HANDOFF — previous chapter closing beat:
  • "As the conversation continued, the tension in the room thickened, each character grappling with their own suspicions and fears. The clock, a mere object, had become a symbol of their unraveling lives, a reminder that time could be manipulated as easily as the..."
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
library, manor, drawing room, garden

✓ RULE: Continue using this location vocabulary. Maintain consistency with established setting type.
✓ Do NOT introduce new location types that contradict earlier chapters.

**Recent Chapter Summary (for narrative continuity):**
Chapter 1: Chapter 1: Discovery
  Events: The morning air was thick with tension as the rain drizzled against the windows of the Voss residence.
Chapter 2: Chapter 2: Witness Statements
  Events: the doctor Finch leaned forward, his brow furrowed.

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
Known location profile anchors: Waverly Manor, The Library, The Drawing Room, The Servants' Hall, the clock room
LOCATION NAME CAPITALISATION (HARD REQUIREMENT — validated):
All named locations in your prose MUST use the EXACT capitalisation from the CML profiles.
Canonical forms: "Waverly Manor", "The Library", "The Drawing Room", "The Servants' Hall", "the clock room"
Writing a location in lowercase (e.g. "drawing room" instead of "Drawing Room") is a validated error. Every time you mention a named location, copy its capitalisation from the list above.
- Chapter 3: OPENING STYLE (HARD): Start the VERY FIRST SENTENCE with an explicit time marker — e.g. "At half past nine…" / "At midnight…" / "At a quarter to eleven…" / "At half past nine at night…". Time must be in the first clause. Anchor opening in "the clock room". HARD REQUIREMENT for the first 2 paragraphs: (a) include 2+ sensory words — choose from smell/scent/sound/echo/silence/creak/whisper/cold/warm/damp/rough/smooth/glow/shadow/flicker/dim — and (b) include 1+ atmosphere/time word — choose from rain/wind/fog/storm/mist/thunder/evening/morning/night/dawn/dusk/season/afternoon/midday/noon/midnight/twilight/sunrise/sunset/daylight/sunlight/overcast/cloudy/bright/dark. These are validated requirements, not style suggestions; missing them triggers a retry.

[⚠ INTERNAL QUALITY DIAGNOSTICS — DO NOT REPRODUCE ANY PART OF THIS SECTION IN YOUR STORY OUTPUT. These are private generator observations for your consideration only. Your narrative must read as if this section does not exist. Never include phrases from this block in character dialogue, narration, or description.]

PRIOR CHAPTER QUALITY OBSERVATIONS:
- Chapter 1 (score 89/100):
  Quality gaps noted: word density below preferred target (730/1000); scene grounding weakness
  Address in upcoming chapters: Increase chapter density with concrete investigation action and sensory-grounded beats; avoid recap-only padding. | Open next chapter with a named location anchor plus at least two sensory cues and one atmosphere marker.
- Chapter 2 (score 92/100):
  Quality gaps noted: word density below preferred target (821/1000); scene grounding weakness
  Address in upcoming chapters: Increase chapter density with concrete investigation action and sensory-grounded beats; avoid recap-only padding. | Open next chapter with a named location anchor plus at least two sensory cues and one atmosphere marker.
[END INTERNAL DIAGNOSTICS]

PROMPT BUDGET SUMMARY: budget=32000 tokens; fixed=8037; context=9873; dropped=[none]; truncated=[location_profiles, temporal_context]

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
8. Integrate at least two concrete era-grounded details per chapter from setting refinement signals: radio broadcasts in common areas | early home telephone systems with party lines | manual typewriters for correspondence | telegrams sent via local post offices | aerial mail services for urgent correspondence | telephone calls subject to delays on party lines.
9. Respect setting movement/access constraints in scene action and alibis: spacious but labyrinthine interior layout limiting movement | gardens and hedges obstructing clear lines of sight | weather conditions affecting outdoor evidence collection | restricted areas such as private quarters and the library | daily schedules dictating staff movements and access times.
10. Sustain social coherence with this backdrop pressure: A gathering at the manor for a wealthy benefactor's will reading strains class relations and personal loyalties amidst the economic turmoil of the Great Depression and rising political tensions in Europe.
11. Maintain continuity around these socially central cast anchors where relevant: Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill.
12. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Critical: Plot similarity 0.75 with 'The Mysterious Affair at Styles' (same murder method and temporal axis)
13. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Moderate: Setting similarity 0.90 with 'The Mysterious Affair at Styles' (same era and country manor setting)

CRITICAL PROSE REQUIREMENTS:

The CML specifies exact requirements for certain validation-critical scenes. You MUST include these elements at the specified positions.

**Discriminating Test Scene (Act 3, Scene 4):**
Required elements: Execute the discriminating test, Observe the clock's tampering mechanism
Test type: mechanical demonstration

**Suspect Clearance Scenes:**
- Dr. Mallory Finch (Act 3, Scene 5): Prove Dr. Finch was with another witness during the time of Eleanor's death.
  Clues: clue_1, clue_2
- Captain Ivor Hale (Act 3, Scene 5): Evidence shows Captain Hale was gambling at a local club during the murder.
  Clues: clue_1, clue_2
- Beatrice Quill (Act 3, Scene 5): Beatrice's whereabouts were documented by other staff members.
  Clues: clue_1, clue_2

**Culprit Revelation Scene (Act 3, Scene 6):**
Method: Confrontation with evidence demonstrating Eleanor's guilt.

**Clue Placement for These Chapters:**
- clue_5 must appear in Act 1, Scene 3 via Direct observation
- clue_fp_contradiction_step_1 must appear in Act 1, Scene 3 via Cross-check contradiction

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
- Chapter 3:
  - Word count: Target 1250 words. Achieve this through plot events, dialogue exchanges, and physical investigation — not through atmospheric repetition or extended internal reflection. Each 200-word segment should contain at minimum one concrete story event (a discovery, a conversation exchange, a physical action or movement). Padding with atmosphere alone is not acceptable.
  - Location anchor: the clock room.
  - Opening atmosphere (MANDATORY — validator enforced): the first paragraph MUST contain at least one of: rain / wind / fog / storm / mist / thunder / evening / morning / night / dawn / dusk / season / afternoon / midday / noon / midnight / twilight / sunrise / sunset / daylight / sunlight / overcast / cloudy / bright / dark. A chapter that omits all of these from its opening paragraph will be rejected.
  - Continuity bridge: in the first 120 words, visibly connect from the previous chapter's final beat. Carry forward one unresolved element (object, accusation, emotional pressure, or immediate physical action) from: "As the conversation continued, the tension in the room thickened, each character grappling with their own suspicions and fears. The clock, a mere object, had become a symbol of their unraveling lives, a reminder that tim...".
  - CLUE OBLIGATIONS — mandatory prose elements (do NOT omit or bury):
    • A mechanical clock was wound back to mislead the timing of the murder. [clue_5] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: This reveals the core mechanism of the crime.
      ↳ MANDATORY TWO-PARAGRAPH STRUCTURE (must appear in paragraphs 1 or 2 — no later):
         Paragraph 1: The POV character physically approaches or directly observes this evidence.
           The narration or dialogue explicitly states what is seen (use the exact locked phrase if one applies).
         Paragraph 2 (immediately following): The detective or POV character explicitly reasons
           about what this evidence implies — who it implicates, why it may be unreliable,
           or what inference it supports. This must be a separate full paragraph, not a sentence appended to Paragraph 1.
    • The clock hands are stuck at ten minutes past eleven. [clue_fp_contradiction_step_1] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: The clock displaying the wrong time suggests it was tampered with.
      ↳ MANDATORY TWO-PARAGRAPH STRUCTURE (must appear in paragraphs 1 or 2 — no later):
         Paragraph 1: The POV character physically approaches or directly observes this evidence.
           The narration or dialogue explicitly states what is seen (use the exact locked phrase if one applies).
         Paragraph 2 (immediately following): The detective or POV character explicitly reasons
           about what this evidence implies — who it implicates, why it may be unreliable,
           or what inference it supports. This must be a separate full paragraph, not a sentence appended to Paragraph 1.
    • The clock hands are stuck at ten minutes past eleven. [clue_1] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: This indicates a potential manipulation of the timekeeping mechanism.
      ↳ MANDATORY TWO-PARAGRAPH STRUCTURE (must appear in paragraphs 1 or 2 — no later):
         Paragraph 1: The POV character physically approaches or directly observes this evidence.
           The narration or dialogue explicitly states what is seen (use the exact locked phrase if one applies).
         Paragraph 2 (immediately following): The detective or POV character explicitly reasons
           about what this evidence implies — who it implicates, why it may be unreliable,
           or what inference it supports. This must be a separate full paragraph, not a sentence appended to Paragraph 1.
    • Witnesses recall the clock chiming at odd intervals. [clue_2] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: This suggests that the clock's accuracy was compromised.
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
  - If this batch mentions The true time of the victim's death, write exactly: "twenty minutes past ten".
- Seasonal vocabulary allow-list: summer, summery, midsummer.
- Forbidden seasonal words: spring, autumn, winter.

FROZEN TIMELINE STATE (DO NOT ALTER):
- Timeline anchor: August (summer).
- Month, season, weather, and time-of-year language in this batch must stay compatible with summer.
- Established timeline fact: Eleanor's time of death
- Established timeline fact: Clock's incorrect time
- If referenced, use exact time phrase: "ten minutes past eleven" (The exact time shown on the stopped clock face).
- If referenced, use exact time phrase: "forty minutes" (The exact amount the clock was wound back).
- If referenced, use exact time phrase: "twenty minutes past ten" (The true time of the victim's death).

STORY TO DATE (REFERENCE ONLY — DO NOT COPY VERBATIM):
- Full prior chapter text is provided below for continuity, factual consistency, and reference accuracy.
- Use this to keep character voice, chronology, clue state, and location continuity aligned with earlier chapters.
- Do not quote, copy, or paraphrase these paragraphs too closely; write fresh prose that remains consistent with them.

--- BEGIN PRIOR CHAPTER 1 ---
Title: Chapter 1: Discovery
The morning air was thick with tension as the rain drizzled against the windows of the Voss residence. Inside, the atmosphere felt stifling, every corner of the grand manor echoing with an unsettling silence. Eleanor Voss lay motionless in the library, her once-vibrant spirit extinguished, leaving a void that permeated the very fabric of the household. the doctor Finch, the captain Hale, and Beatrice Quill stood in a tight circle, their expressions a mixture of disbelief and dread. The clock on the mantelpiece, a grand old timepiece with intricate carvings, had ceased its ticking, its hands stuck at ten minutes past eleven, a haunting reminder of the moment when time itself seemed to betray them all.

Beatrice Quill's gaze was drawn to the clock, her heart racing as memories of Eleanor flooded her mind. The clock's stillness felt like a cruel joke, a mocking testament to the life that had been so abruptly snuffed out. "It can't be right, can it?" she murmured, her voice barely above a whisper. The others turned to her, their eyes wide with concern. The implications of the clock's position weighed heavily upon them, suggesting a manipulation of time that could complicate the investigation. Dr. Finch stepped closer, his brow furrowed in thought. "If the clock shows ten minutes past eleven, then... Eleanor must have died before that time. But how could it have stopped?"

The tension in the room escalated, each character acutely aware of the implications of the clock's condition. Captain Hale, his voice steady but laced with urgency, added, "Witnesses recall the clock chiming at odd intervals. It was never reliable, but this... this is something else entirely." His words hung in the air, a chilling reminder that the truth was obscured by the very mechanism meant to mark the passage of time. Beatrice's hands trembled as she recalled the moments leading up to the tragedy, her mind racing with questions. "What if someone tampered with it? What if they wanted to create confusion about the time of her death?"

Dr. Finch nodded, his expression grave. "That would mean someone here had the opportunity and motive to manipulate the clock. We must consider everyone present. Each of us could have been involved in some way. The implications are dire." The gravity of the situation settled over them like a heavy fog, stifling their breaths. Beatrice, feeling the weight of suspicion, glanced at the others, searching for a flicker of guilt or innocence in their eyes. Each moment felt stretched, as if time itself had conspired to hold them in this moment of uncertainty.

As they stood in the library, the shadows danced along the walls, whispering secrets that only the clock seemed to know. The rain continued to patter against the windows, a steady reminder of the world outside, while inside, the air crackled with unspoken accusations. Beatrice finally broke the silence, her voice trembling slightly. "We need to find out what really happened. Eleanor deserves that much, at least." The others nodded in agreement, their resolve hardening as they prepared to delve into the mystery that had shattered their lives. The clock, with its hands frozen at ten minutes past eleven, would be the first clue in a tangled web of deceit and betrayal.

Dr. Finch stepped forward, his fingers brushing against the clock's surface as if seeking answers from the cold wood. "We must consider the possibility that Eleanor was aware of something, something dangerous that led to her demise. The clock's tampering suggests premeditation, an intent to mislead us about the time of her death." Captain Hale's eyes narrowed, a flicker of realization crossing his face. "If he was alive when the clock chimed, it would imply he was murdered later than we think. But why would he do that?"

The room fell silent once more, each character grappling with the weight of their suspicions and fears. The clock, a mere object, had become a symbol of their unraveling lives, a reminder that time could be manipulated as easily as the truth. Beatrice felt a surge of determination, her artistic spirit ignited by the challenge ahead. "We must piece together the fragments of this puzzle. Only then can we hope to find justice for Eleanor." Dr. Finch and Captain Hale exchanged glances, their expressions resolute. Together, they would uncover the truth hidden within the shadows of the Voss residence.
--- END PRIOR CHAPTER 1 ---

--- BEGIN PRIOR CHAPTER 2 ---
Title: Chapter 2: Witness Statements
“I distinctly remember the clock chiming, but it was so irregular,” Beatrice Quill said, her voice trembling slightly as she sat in the Voss residence, living room. The late morning light filtered through the overcast skies, casting a dim glow on the ornate furnishings. The air was thick with tension, each breath feeling like an intrusion into the fragile atmosphere. The scent of damp wood mingled with the faint aroma of tea, a stark contrast to the unease that hung in the air. Captain Hale's eyes darted towards the clock on the mantelpiece, its hands frozen in time, a silent witness to the chaos that had unfolded. “It felt as if the clock was mocking us, as if it knew something we didn’t.”

the doctor Finch leaned forward, his brow furrowed. “Witnesses recall the clock chiming at odd intervals. It was never reliable, but this... this is something else entirely.” His voice trembled slightly, betraying the anxiety that had begun to creep in. The implications of the clock's behavior were heavy, suggesting that someone might have tampered with it to create confusion about the time of Eleanor's death. “If the clock was chiming inconsistently, it could mean that we cannot trust its current state. We must ask ourselves who had the opportunity to manipulate it.”

Captain Hale's hand trembled as he recounted his evening, the tension in the room palpable. “I was in the drawing room, preparing for the lecture. I remember hearing the clock chime, but I thought it was just my imagination playing tricks on me.” She paused, glancing at Beatrice, who seemed lost in thought. “But if it chimed at odd intervals, then... then how can we be sure of anything?”

Eleanor Voss, though silent for a moment, finally spoke, her voice steady yet laced with an undercurrent of tension. “The clock hands are stuck at ten minutes past eleven. This indicates a potential manipulation of the timekeeping mechanism. If someone wanted to mislead us about the time of my death, they could have tampered with it before the incident.” Her gaze swept across the room, searching for signs of guilt or innocence in the faces of those around her. “We must consider the possibility that someone here had both the motive and the means to alter the clock.”

Beatrice's heart raced as she processed Eleanor's words. “But why would anyone want to do that? What could they gain from making it seem as if you died later?” Her voice was barely above a whisper, the weight of suspicion pressing down on her. “We need to figure out who was near the clock, who had access to it.”

Dr. Finch nodded, his expression grave. “If the clock shows ten minutes past eleven, then Eleanor must have died before that time. But how could it have stopped?” The question hung in the air, heavy with implications. The tension in the room escalated, each character acutely aware of the stakes involved. They were no longer merely witnesses; they were suspects in a deadly game of deception.

“I was in the garden,” Beatrice interjected, her voice rising slightly. “I was painting, and I remember glancing at the clock. It was still ticking then, but I didn’t pay much attention to the time. I thought I had more than enough time to finish before the lecture.” She hesitated, her fingers fidgeting with the hem of her dress. “But if the clock was tampered with, then I could have been wrong about the time.”

Captain Hale leaned back in his chair, his expression contemplative. “We need to piece together our movements, to establish a timeline. If we can determine when the clock was last wound, we might find out who had the opportunity to tamper with it.” He glanced at Dr. Finch, who was scribbling notes furiously. “What do you think, Doctor? Can you determine when the clock was last wound?”

Dr. Finch paused, his pen hovering over the page. “I can examine the clock’s mechanism, but if it has been tampered with, it may not yield any clear evidence. We need to consider the possibility that the murderer is among us, and they may have covered their tracks well.” His voice was laced with urgency, the reality of their situation settling in. “We must act quickly before the trail goes cold.”

As the conversation continued, the tension in the room thickened, each character grappling with their own suspicions and fears. The clock, a mere object, had become a symbol of their unraveling lives, a reminder that time could be manipulated as easily as the truth. Beatrice felt a surge of determination, her artistic spirit ignited by the challenge ahead. “We must piece together the fragments of this puzzle. Only then can we hope to find justice for Eleanor.” Dr. Finch and Captain Hale exchanged glances, their expressions resolute. Together, they would uncover the truth hidden within the shadows of the Voss residence.
--- END PRIOR CHAPTER 2 ---

# Case Overview
Title: The Clockwork Conspiracy
Era: 1930s
Setting: Little Middleton
Crime: murder (premeditated murder)
Culprit: Eleanor Voss
False assumption: Eleanor Voss was alive at the time the clock chimed, suggesting she was murdered later than she actually was.
Cast: Eleanor Voss (she/her), Dr. Mallory Finch (he/him), Captain Ivor Hale (he/him), Beatrice Quill (she/her)

Setting Lock: Keep all scenes and descriptions consistent with the stated setting (Little Middleton). Do not introduce a different location type.

Outline scenes:
[
  {
    "sceneNumber": 3,
    "act": 1,
    "title": "The Clock's Secrets",
    "setting": {
      "location": "the clock room",
      "timeOfDay": "Afternoon",
      "atmosphere": "Mysterious and unsettling"
    },
    "characters": [
      "Eleanor Voss",
      "Dr. Mallory Finch",
      "Captain Ivor Hale"
    ],
    "purpose": "Reveal the clock's tampering and set up false assumptions",
    "cluesRevealed": [
      "clue_5",
      "clue_fp_contradiction_step_1",
      "clue_1",
      "clue_2"
    ],
    "dramaticElements": {
      "conflict": "The characters argue over the clock's condition.",
      "tension": "The clock's stillness raises more questions than answers.",
      "microMomentBeats": [
        "Eleanor's eyes narrow as she examines the clock."
      ]
    },
    "summary": "In the clock room, the characters inspect the clock, which has mysteriously stopped at ten minutes past eleven. They discover signs of tampering, leading to heated debates about the implications of the clock's condition. The scene ends with the detective determined to find the truth.",
    "estimatedWordCount": 1800,
    "emotionalRegister": "Tension builds as the body is discovered, plunging the evening into chaos.",
    "dominantCharacterNote": {
      "name": "Eleanor Voss",
      "voiceRegister": "Eleanor speaks with a measured tone, often punctuating her observations with dry humor."
    },
    "humourGuidance": {
      "permission": "conditional",
      "character": "Eleanor Voss",
      "form": "dry_wit",
      "condition": "If Eleanor's dry wit emerges during questioning."
    },
    "eraTextureNote": "Overcast skies limit outdoor activities, creating a sense of confinement.; Travel is restricted due to economic pressures and the need for caution.; Communication relies on outdated technologies, hampering timely exchanges.; Transportation options are limited, affecting social mobility and gatherings.; The pervasive humidity adds a layer of discomfort to everyday life.",
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
□ Chapter 3: "A mechanical clock was wound back to mislead the timing of the murder." is placed in the first 25% of the chapter, followed by an explicit inference or suspicion paragraph.
□ Chapter 3: "The clock hands are stuck at ten minutes past eleven." is placed in the first 25% of the chapter, followed by an explicit inference or suspicion paragraph.
□ Chapter 3: "The clock hands are stuck at ten minutes past eleven." is placed in the first 25% of the chapter, followed by an explicit inference or suspicion paragraph.
□ Chapter 3: "Witnesses recall the clock chiming at odd intervals." is placed in the first 25% of the chapter, followed by an explicit inference or suspicion paragraph.
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

## Message 4 (role=user)

```text
Attempt 3/4 — chapters 3 — 1 validation issue(s) to resolve:

═══ OTHER ERRORS (1) ═══
• getaddrinfo ENOTFOUND openai-ds1sweden.cognitiveservices.azure.com

Return corrected JSON for chapters 3. Edit only the sections that failed — keep all content that passed validation, and return the complete updated chapter JSON.

```
