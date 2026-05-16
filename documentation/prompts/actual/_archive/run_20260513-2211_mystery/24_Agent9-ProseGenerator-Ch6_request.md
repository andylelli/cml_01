# Actual Prompt Record

- Run ID: `mystery-1778710297887`
- Project ID: ``
- Timestamp: `2026-05-13T22:17:41.674Z`
- Agent: `Agent9-ProseGenerator-Ch6`
- Operation: `chat_request_full_prompt`
- Model: `GPT-4o-mini`
- Temperature: `0.42`
- Max Tokens: `4500`
- Attempt: `first`
- Prompt Hash: `57f7aeb1c9653b6f`

## Message 1 (role=system)

```text
You are an expert prose writer for classic mystery fiction. Your role is to write compelling, atmospheric narrative chapters that read like a professionally published novel.

⛔ ABSOLUTE RULE — CHARACTER NAMES:
The ONLY characters who exist in this story are: Eleanor Voss (woman), Dr. Mallory Finch (woman), Captain Ivor Hale (man), Beatrice Quill (woman).
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
- MORAL COMPLEXITY REQUIREMENT: The mechanism of this crime carries a moral gray area: "The culprit acted out of desperation to protect a loved one, raising questions about the morality of their actions." — the culprit reveal and denouement MUST acknowledge this ambiguity. Do not let the ending feel clean or simple. Give the reader at least one moment of uncomfortable sympathy or moral doubt.


⚠️ AMATEUR DETECTIVE STORY: The investigator is a civilian with no official standing. The official police (if they appear) are unnamed background figures only — "a constable", "the sergeant", "an officer from the village". Do NOT give any police official a name or title+surname combination. There is no Inspector [Surname], no Constable [Surname], no Sergeant [Surname] in this story.

PRONOUN ACCURACY — MANDATORY CONTINUITY CONTRACT

The following pronouns are locked facts, on the same level as character names
and hard-logic device values. Using the wrong pronoun is a continuity error,
not a style choice.

Canonical pronoun table (subject / object / possessive / reflexive):
  • Eleanor Voss: she/her/her/herself
  • Dr. Mallory Finch: she/her/her/herself
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

## Era: 1932-09
In September 1932, the English countryside is cloaked in a veil of overcast skies, the air thick with the promise of rain. The days are shortening, casting a somber light over the sprawling country house estate, where the latest whispers of the Great Depression echo through the halls. As the Harvest Festival approaches, the estate’s occupants feel the weight of social anxieties, heightened by the economic struggles plaguing the nation. The tension is palpable, with the fear of what the future holds lurking in every shadow of the estate.
Emotional register: The collective emotional state is one of anxiety and uncertainty, as individuals grapple with personal and societal challenges.
Physical constraints: Limited access to fresh food due to economic hardship | Travel restricted by fuel shortages and economic constraints | Communication primarily through letters and telegrams, which delay news
Current tensions (weave into background texture): Economic struggles leading to protests in major cities | Political discussions surrounding the rise of fascism in Europe | Class disparity becoming more pronounced
Wartime context — N/A: The community is divided along class lines, with the wealthy maintaining their status while the working class struggles. Absence effect: There is a pervasive sense of loss and longing for stability in both personal and societal contexts.

## Story Theme
The story explores the consequences of unaddressed resentment among family members, ultimately revealing that seeking acceptance can lead to unforeseen tragedies, and reveals that evidence carries ethical weight, forcing characters to choose accountability over social performance when appearances and facts collide.

## Story Emotional Register
Dominant: The emotional journey is one of tension and revelation, leading to a profound reckoning for all characters involved.

Arc:
The story opens in the grand Little Middleton Manor, where the atmosphere is thick with unease. A murder has occurred, and the clock, stopped at ten minutes past eleven, serves as a grim reminder of the tragedy. As Detective Eleanor Voss begins her investigation, the initial shock of the crime gives way to rising tension. Each clue unravels a complex web of motives and emotional stakes, revealing the characters' inner turmoil. As the investigation deepens, Eleanor's self-doubt clashes with her determination to uncover the truth, creating an emotional cost that weighs heavily on her.

The turning point arrives when inconsistencies in witness accounts suggest the murder timeline has been manipulated, forcing Eleanor to confront her assumptions. This revelation shifts the direction of the investigation, leading to a critical moment where she must reassess her suspects and motivations. The pressure mounts as the final confrontation looms; Eleanor pieces together the evidence, revealing the truth behind the clock manipulation and the motives of Captain Ivor Hale. As the climax unfolds, emotions run high, resulting in a dramatic confrontation that exposes the characters' vulnerabilities and desires. In the resolution, the emotional toll of the events leaves lasting scars on each character. Eleanor must reconcile her sense of justice with the personal cost of the investigation, while the other characters grapple with their own consequences, forever changed by the clockwork trap that ensnared them all.

## Emotional register at this point in the story
New evidence complicates the narrative, leading to deeper emotional stakes.

## Character Portraits (appearance & era)

### Eleanor Voss
Eleanor Voss grapples with feelings of abandonment and resentment toward her wealthy family, mirroring the societal tensions of the 1930s. Her struggle for acceptance within her family contrasts sharply against the backdrop of a community reeling from economic hardship, making her quest for truth all the more poignant.
Era intersection: Eleanor's situation reflects the broader social anxieties of the time, as class divisions deepen and personal relationships fray.

### Dr. Mallory Finch
Dr. Mallory Finch's dedication to her patients masks a tumultuous inner life, complicated by her secret relationship with the victim. Her internal conflicts resonate with the societal expectations placed on women during this era, as she navigates professional pressures amidst the backdrop of the Great Depression.
Era intersection: Mallory's struggles highlight the challenges women face in maintaining their identities and desires within a patriarchal society.

## Character Voices

### Eleanor Voss (she/her/her)
Eleanor speaks with a soft, measured cadence, often punctuating her sentences with thoughtful pauses.
[comfortable] You know, sometimes the wisest words are found in the quietest moments.
[evasive] Oh, I was merely tending to my books, nothing of importance.
[stressed] This is all so overwhelming; I had hoped for clarity, not more shadows.
Humour: Her dry wit occasionally surfaces, providing a light contrast to serious discussions.

### Dr. Mallory Finch (she/her/her)
Mallory speaks with a brisk, confident tone, though she sometimes punctuates her sentences with nervous laughter.
[comfortable] I believe every patient deserves the best care I can provide.
[evasive] Well, you know how it is; sometimes the truth is best left unsaid.
[stressed] I can't afford any more complications; my reputation is hanging by a thread!
Humour: Her self-deprecating humor often lightens tense moments.

## Location Registers (scene framing guides)

The East Wing Library: The library exudes a sense of foreboding as shadows stretch and flicker in the dim light, creating an atmosphere thick with secrets. The scent of aged books mingles with the damp air, amplifying the tension as guests tread carefully through its aisles.. Camera angle: As a writer enters this space, they should feel the weight of history pressing down, urging them to uncover the truth hidden within.. Era: In this era, libraries serve as havens of knowledge and, paradoxically, the sites of dark revelations.

The Drawing Room: The drawing room is a space of elegance that feels increasingly suffocating, as laughter and conversation mask an underlying tension. The rich colors of the furnishings contrast with the foreboding atmosphere outside, creating a deceptive sense of comfort.. Camera angle: Writers should approach this setting with a sense of unease, aware that beneath the surface lies a brewing storm.. Era: The drawing room serves as a reflection of the class disparities rampant in the 1930s, where wealth and privilege coexist with hidden anxieties.

The Servants' Hall: The servants' hall is a stark contrast to the opulence above, filled with the sounds of quiet chatter and the smells of simple meals. There’s a camaraderie among the staff, yet an undercurrent of tension lingers, hinting at the secrets they hold.. Camera angle: Writers should capture the sense of intimacy here, while also acknowledging the weight of unspoken truths that permeate the air.. Era: This space embodies the class struggles of the 1930s, as the divide between the servants and their employers grows more pronounced.

## Humour guidance for this story position (mid)
Permission: forbidden
Rationale: The mid-investigation phase is filled with rising tension where humor might undermine the seriousness.

## Character Pressure
Dr. Mallory Finch is approaching a point of breakdown. Stress and strain should be accumulating visibly — through behaviour, not statement. No confrontation yet.

## Reveal Groundwork (texture — do not explain, only plant)
- Plant one subtle observable beat related to: "In the opening scene, the shock of the murder sets a tone of unease that lingers throughout". Do not explain significance yet.
- Plant one subtle observable beat related to: "The first interview with Captain Hale reveals his charming facade hiding deeper issues, which is later challenged by his fingerprints on the clock". Do not explain significance yet.
- Plant one subtle observable beat related to: "The climax, where Eleanor confronts Hale, retroactively casts doubt on his earlier alibi, indicating he manipulated the timeline to escape suspicion". Do not explain significance yet.

FAIR-PLAY AND INFERENCE CONTRACT (from CML logic):
- False assumption in force: Eleanor Voss’s murder occurred at the time indicated by the clock.
- Hidden truth to progressively expose: The clock's hands were manipulated to create a misleading timeline.
- Inference path checkpoints to dramatize clearly (observation -> correction -> effect):
  - Step 1: obs: The clock in the study was found stopped at ten minutes past eleven. | corr: The time discrepancy suggests the clock may not reflect the actual time of death. | effect: Narrows the window of opportunity for suspects to Captain Ivor Hale.
  - Step 2: obs: Witness statements indicate conflicting times regarding the murder. | corr: The inconsistencies in witness accounts suggest the murder time was manipulated. | effect: Eliminates Dr. Mallory Finch as a suspect due to her credible alibi.
  - Step 3: obs: Fingerprints on the clock's casing match Captain Ivor Hale. | corr: This indicates that Captain Hale had tampered with the clock. | effect: Narrows the suspect pool to Captain Ivor Hale as the primary suspect.
- Discriminating test method: trap
- Discriminating test design constraint: A controlled reenactment of the clock's striking mechanism reveals the tampering.
- Test must rely on already-shown clue IDs: clue_1, clue_2, clue_3, clue_mechanism_visibility_core, clue_5
- Fair-play rationale: Step 1: The clock being stopped (early) and witnesses hearing the clock strike twelve (mid) hint at a manipulated timeline. Step 2: Inconsistencies in witness accounts (mid) eliminate Dr. Mallory Finch. Step 3: Fingerprints on the clock (late) lead to Captain Ivor Hale.
- Never solve by withheld information. Keep reader-information parity with detective reasoning.

## Character Reference

### Eleanor Voss
Eleanor speaks with a soft, measured cadence, often punctuating her sentences with thoughtful pauses
She has a tendency to use literary references, drawing on her years as a teacher, and occasionally employs irony to highlight the absurdities of life.
Eleanor feels torn between her desire for familial acceptance and her deep-seated resentment towards those who have wronged her. This case forces her to confront these emotions head-on, questioning whether she truly wants to be a part of a family that has caused her so much pain.

### Dr. Mallory Finch
Mallory speaks with a brisk, confident tone, but occasionally slips into self-deprecating humor when discussing her own failings
She has a habit of punctuating her sentences with nervous laughter, especially when discussing her personal life.
Mallory is caught in a maelstrom of guilt and longing, struggling to reconcile her feelings for the victim with the realities of her professional life. The investigation forces her to confront her past decisions and the consequences of her choices.


## CHARACTER CONTRACTS (binding for this scene)
Each entry below constrains how this character must be written in this chapter.
These override generic style guidance when they conflict.

### Eleanor Voss
Voice & mannerisms: Eleanor speaks with a soft, measured cadence, often punctuating her sentences with thoughtful pauses. She has a tendency to use literary references, drawing on her years as a teacher, and occasionally employs irony to highlight the absurdities of life.
Sample voice fragments (match this register and rhythm):
  [comfortable] "You know, sometimes the wisest words are found in the quietest moments."
  [evasive] "Oh, I was merely tending to my books, nothing of importance."
Humour: dry wit — deploy occasionally (level 0.5)
FORBIDDEN phrase (never write for Eleanor Voss): "a surge of determination washed over her"
Act 2 behaviour contract: May show unease, evasion, or mild defensiveness when questioned. One behavioural tell is permitted. Internal conflict emerging: "Eleanor feels torn between her desire for familial acceptance and her deep-seated resentment towards those who have wronged her. This case forces her to confront these emotions head-on, questioning whether she truly wants to be a part of a family that has caused her so much pain."

### Dr. Mallory Finch
Voice & mannerisms: Mallory speaks with a brisk, confident tone, but occasionally slips into self-deprecating humor when discussing her own failings. She has a habit of punctuating her sentences with nervous laughter, especially when discussing her personal life.
Sample voice fragments (match this register and rhythm):
  [comfortable] "I believe every patient deserves the best care I can provide."
  [evasive] "Well, you know how it is; sometimes the truth is best left unsaid."
Humour: self deprecating — deploy occasionally (level 0.4)
FORBIDDEN phrase (never write for Dr. Mallory Finch): "she knew with certainty she was right"
Act 2 behaviour contract: May show unease, evasion, or mild defensiveness when questioned. One behavioural tell is permitted. Internal conflict emerging: "Mallory is caught in a maelstrom of guilt and longing, struggling to reconcile her feelings for the victim with the realities of her professional life. The investigation forces her to confront her past decisions and the consequences of her choices."



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
Little Middleton Manor is a grand estate steeped in history, embodying a blend of Georgian elegance and Victorian opulence, set against the backdrop of the English countryside. Its sprawling grounds and labyrinthine layout create an atmosphere thick with mystery and tension.

Key Locations Available:
- The East Wing Library (interior): Crime scene
- The Drawing Room (interior): Gathering space
- The Servants' Hall (interior): Clue discovery

Atmosphere: tense and foreboding, reflecting the underlying social anxieties of the period
Weather: overcast with occasional rain showers, typical for the English countryside

Era markers: Whispers of the Great Depression echo in conversations, highlighting class tensions among the guests. | A vintage radio crackles with distant broadcasts, providing news of the outside world that feels increasingly far away. | Typewriters clatter in the study, as letters and telegrams are penned, each missive carrying the weight of urgency.

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
  - Visual: Rows of dusty tomes stand sentinel on the shelves, their spines cracked and faded, as if they hold untold stories waiting to be uncovered., A solitary armchair, upholstered in rich burgundy fabric, sits near the window, the fabric worn and frayed at the edges, suggesting it has been a favored spot for quiet contemplation.
  - Sounds: The soft rustle of pages turning echoes in the stillness, punctuated by the occasional drip of rainwater from the window ledge onto the polished wooden floor., A clock ticks methodically in the corner, its sound amplifying the tension as it measures the passing moments of uncertainty.
  - Scents: The musty scent of aged paper and leather fills the air, mingling with the faint aroma of dampness from the rain-soaked surroundings., A hint of wood polish lingers, a reminder of the care taken to maintain the elegance of the room, contrasting with the chaos of the recent events.
  - Touch: The coolness of the wooden desk contrasts sharply with the warmth of the armchair, inviting guests to linger while also reminding them of the discomfort of the situation., The texture of the thick, worn rug underfoot feels plush yet heavy, absorbing the sound of footsteps and adding to the air of secrecy.

The Drawing Room (interior):
  - Visual: The rich colors of the upholstery, deep greens and burgundies, create a warm yet somber atmosphere, contrasting sharply with the gloom outside., Portraits of stern ancestors gaze down from the walls, their eyes seeming to follow visitors, adding to the room's sense of history and weight.
  - Sounds: The soft crackle of the fire fills the room with a comforting sound, though it feels oddly out of place given the tension in the air., Occasional laughter from guests mingles with the clinking of glasses, yet the sound feels strained, as if everyone is putting on a brav
[truncated for prompt budget]

## Texture Pool
Draw on these as opportunities arise — you are not required to use them.

- In September 1932, the English countryside is cloaked in a veil of overcast skies, the air thick with the promise of rain
- The days are shortening, casting a somber light over the sprawling country house estate, where the latest whispers of the Great Depression echo through the halls
- As the Harvest Festival approaches, the estate’s occupants feel the weight of social anxieties, heightened by the economic struggles plaguing the nation
- The tension is palpable, with the fear of what the future holds lurking in every shadow of the estate.

TEMPORAL CONTEXT:

This story takes place in September 1932 during N/A.

Seasonal Atmosphere:
- Weather patterns: overcast with occasional rain showers, cool breezes, mists rolling in from the countryside
- Daylight: Days are growing shorter, with sunset around six-thirty in the evening, and a chill in the air signaling the onset of autumn.
- Seasonal activities: apple picking in the orchards, attending local harvest fairs, hiking through the moors as leaves begin to change
- Seasonal occasions: Harvest Festival (September 24)
- Season: N/A

Period Fashion (describe naturally):
- Men formal: tailored three-piece suit with a waistcoat, bowler hat, polished leather shoes
- Men casual: tweed blazer, knitted vest, flannel trousers
- Men accessories: silk handkerchief, leather gloves, watch chain
- Women formal: tea-length dress with drop waist, cloche hat, string of pearls
- Women casual: knitted cardigan, pleated skirt, silk blouse
- Women accessories: feathered fascinator, embroidered handbag, ankle boots

Cultural Context (reference naturally):
- Music/entertainment: 'The Birth of the Blues' by Al Jolson, 'Ain't She Sweet' by Milton Ager, 'Blue Moon' by Richard Rodgers; Films: 'Scarface' directed by Howard Hawks, 'The Most Dangerous Game' directed by Ernest B. Schoedsack; Theatre: 'Of Mice and Men' by John Steinbeck, 'The Front Page' by Ben Hecht and Charles MacArthur; Radio: 'The Shadow' - a popular crime drama, 'Amos 'n' Andy' - a comedic program
- Typical prices: loaf of bread: four pence, pint of milk: two pence, cinema ticket: one shilling
- Current events: intensifying economic struggles leading to protests in major cities; political discussions surrounding the rise of fascism in Europe
- Literature: 'Brave New World' by Aldous Huxley | 'Murder in the Cathedral' by T.S. Eliot | 'The Maltese Falcon' by Dashiell Hammett | [detective fiction] | [social realist novels] | [political commentary]
- Technology: the electric refrigerator becoming popular in homes | advancements in radio technology improving sound quality | the introduction of affordable automobiles like the Ford Model B | home radio sets | typewriters for business correspondence | early model telephones
- Daily life: attending local fairs and markets, gathering for tea in the afternoon, visiting family on weekends
- Social rituals: afternoon tea with family and friends, formal dinner parties showcasing wealth and status

Atmospheric Details:
The distant sound of thunder rolls across the moors, with the scent of damp earth and decaying leaves filling the air. Soft whispers of the wind rustle through the trees, carrying with them the chill of approaching autumn and the tension of unspoken fears. The flickering light from oil lamps casts eerie shadows in the large country house, where the weight of secrets hangs heavy in the air.

FASHION INTEGRATION TECHNIQUES:
- First appearance: Describe outfit to establish class/personality
- Accessories: Gloves, hats, pocket watches, jewelry reveal status
- Time-specific: Different outfits for different times of day
- Character traits: Fastidious dresser vs rumpled appearance
- Action integration: "She tugged at her glove" or "He adjusted his tie"
- Weather appropriate: Overcoats in winter, light linen in summer

CULTURAL TOUCHSTONE INTEGRATION:
- Casual conversation: "Did you hear that new jazz record?" or "I saw
[truncated for prompt budget]

NON-NEGOTIABLE CHAPTER OBLIGATIONS — LOCKED EVIDENCE PHRASES (VERBATIM REQUIRED):
The following physical evidence values are absolute ground truth. Every time this chapter describes, mentions, or alludes to the relevant evidence — no matter how briefly — it MUST use the exact phrase shown below, character for character. NO paraphrase, approximation, rounding, or synonym is permitted.

FAILURE EXAMPLE: if the locked value is "at thirteen minutes to midnight" and you write "just before midnight" or "around midnight" — that is a HARD FAIL. You must write "at thirteen minutes to midnight". Equally, if the locked value is written in words, such as "ten minutes past eleven", and you convert it to figure-based clock notation — that is also a HARD FAIL. Words stay as words; figure forms are forbidden for word-phrased facts.

CRITICAL — WORD-PHRASED VALUES: If the canonical value is written out in words (e.g. a time like "ten minutes past eleven", or an amount like "forty minutes"), reproduce those exact words. DO NOT convert to figure-based time notation, twenty-four-hour format, or any other numeric shorthand. Correct: "ten minutes past eleven". WRONG: figure-based clock notation or numeric shorthand.

Locked facts:
  - The exact time shown on the stopped clock face: "ten minutes past eleven"
  - The exact amount the clock was wound back: "forty minutes"
  - The temperature of the clock casing at the time of the murder: "ninety degrees Fahrenheit"

If a locked fact has no relevance to this chapter, omit it. But the moment you reference the underlying evidence, only the exact phrase above is acceptable.

⛔ CLUES TO SURFACE IN THESE CHAPTERS — mandatory:
The following evidence MUST be clearly observable to an attentive reader. Do not bury it in atmosphere or passing dialogue. Each clue must be concrete, specific, and noticeable:

• [clue_core_elimination_chain] Eliminates Eleanor Voss because she has a corroborated alibi placing her away from the scene at the time of the murder.
  Category: testimonial | Criticality: essential | Supports inference step 2
  Points to: This narrows the suspect list towards Captain Ivor Hale.

For each clue above: an attentive reader should be able to find, record, and later use it to reason toward the solution.

═══ NARRATIVE STATE (read-only — do not contradict) ═══

LOCKED FACTS — use verbatim whenever this evidence is described:
  • The exact time shown on the stopped clock face: "ten minutes past eleven"
  • The exact amount the clock was wound back: "forty minutes"
  • The temperature of the clock casing at the time of the murder: "ninety degrees Fahrenheit"

CHARACTER PRONOUNS — never deviate from these:
  • Eleanor Voss: she/her/her
  • Dr. Mallory Finch: she/her/her
  • Captain Ivor Hale: he/him/his
  • Beatrice Quill: she/her/her

CLUES ALREADY REVEALED TO READER: clue_1, clue_mechanism_visibility_core, clue_2, clue_culprit_direct_captain_ivor_hale, clue_3, clue_4, clue_core_contradiction_chain, clue_5, clue_6 — do not reveal these as new information.

CONTINUITY HANDOFF — previous chapter closing beat:
  • "As Eleanor prepared to leave, she glanced back at Beatrice, who was now staring blankly at the floor. The rain continued to fall, a relentless reminder of the chaos that had engulfed them all. Eleanor knew that the answers she sought were hidden in the shadows..."
  • The next chapter must open as a continuation of this beat, not as a disconnected reset.
═══════════════════════════════════════════════════════

═══════════════════════════════════════════════════════════
📚 CONTINUITY CONTEXT - CHARACTER & SETTING CONSISTENCY
═══════════════════════════════════════════════════════════

**CRITICAL: You are writing chapters 6+. Maintain consistency with earlier chapters.**

**Character Names Used in Chapters 1-5:**
Eleanor Voss, Beatrice Quill

✓ RULE: Use EXACTLY these names. Do NOT vary spelling, add titles, or introduce new forms.
✓ Example: if earlier chapters used "Clara Whitfield", keep using "Clara Whitfield" — never "Mrs. Whitfield" unless that is the character's canonical name in the list above.

**Setting Vocabulary Established in Earlier Chapters:**
study, garden, manor, drawing-room

✓ RULE: Continue using this location vocabulary. Maintain consistency with established setting type.
✓ Do NOT introduce new location types that contradict earlier chapters.

**Recent Chapter Summary (for narrative continuity):**
Chapter 3: Chapter 3: Fingerprint Examination
  Events: At noon, the rain continued to fall steadily outside the study, a relentless rhythm that echoed the tension within.
Chapter 4: Chapter 4: Interrogating Captain Hale
  Events: The afternoon rain drummed against the windowpanes of the study, its relentless rhythm echoing the tension that filled the room.
Chapter 5: Chapter 5: Interview with Beatrice Quill
  Events: As the afternoon rain continued to patter against the windows of the drawing-room, Eleanor Voss felt the weight of the moment pressing down on her.

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
Known location profile anchors: Little Middleton Manor, The East Wing Library, The Drawing Room, The Servants' Hall, the kitchen
LOCATION NAME CAPITALISATION (HARD REQUIREMENT — validated):
All named locations in your prose MUST use the EXACT capitalisation from the CML profiles.
Canonical forms: "Little Middleton Manor", "The East Wing Library", "The Drawing Room", "The Servants' Hall", "the kitchen"
Writing a location in lowercase (e.g. "drawing room" instead of "Drawing Room") is a validated error. Every time you mention a named location, copy its capitalisation from the list above.
- Chapter 6: OPENING STYLE: Atmospheric scene-setting is permitted here — but the first sentence MUST differ structurally from both the preceding and following chapters. Do not reuse the same clause structure or sensory vocabulary as adjacent chapters. Anchor opening in "the kitchen". HARD REQUIREMENT for the first 2 paragraphs: (a) include 2+ sensory words — choose from smell/scent/sound/echo/silence/creak/whisper/cold/warm/damp/rough/smooth/glow/shadow/flicker/dim — and (b) include 1+ atmosphere/time word — choose from rain/wind/fog/storm/mist/thunder/evening/morning/night/dawn/dusk/season/afternoon/midday/noon/midnight/twilight/sunrise/sunset/daylight/sunlight/overcast/cloudy/bright/dark. These are validated requirements, not style suggestions; missing them triggers a retry.

[⚠ INTERNAL QUALITY DIAGNOSTICS — DO NOT REPRODUCE ANY PART OF THIS SECTION IN YOUR STORY OUTPUT. These are private generator observations for your consideration only. Your narrative must read as if this section does not exist. Never include phrases from this block in character dialogue, narration, or description.]

PRIOR CHAPTER QUALITY OBSERVATIONS:
- Chapter 4 (score 91/100):
  Quality gaps noted: word density below preferred target (844/1000); scene grounding weakness
  Address in upcoming chapters: Increase chapter density with concrete investigation action and sensory-grounded beats; avoid recap-only padding. | Open next chapter with a named location anchor plus at least two sensory cues and one atmosphere marker.
- Chapter 5 (score 90/100):
  Quality gaps noted: word density below preferred target (795/1000); scene grounding weakness
  Address in upcoming chapters: Increase chapter density with concrete investigation action and sensory-grounded beats; avoid recap-only padding. | Open next chapter with a named location anchor plus at least two sensory cues and one atmosphere marker.
- Phrases to avoid (already overused in earlier chapters): "in the garden preparing for the harvest", "the garden preparing for the harvest festival", "garden preparing for the harvest festival i", "preparing for the harvest festival i have", "for the harvest festival i have witnesses", "the harvest festival i have witnesses to", "harvest festival i have witnesses to prove", "festival i have witnesses to prove it", "were hidden in plain sight waiting to", "hidden in plain sight waiting to be".
[END INTERNAL DIAGNOSTICS]

PROMPT BUDGET SUMMARY: budget=32000 tokens; fixed=11215; context=9893; dropped=[none]; truncated=[location_profiles, temporal_context]

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
- Chapter numbering starts at 6 and increments by 1 per scene.
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
8. Integrate at least two concrete era-grounded details per chapter from setting refinement signals: radio broadcasting with limited reach | typewriters for correspondence | early home telephone systems | telephone calls via party lines | telegram services for urgent messages | airmail for long-distance correspondence.
9. Respect setting movement/access constraints in scene action and alibis: manor's layout creates restricted access to certain areas | gardens and woodlands limit visibility from the main house | weather conditions can impact movement and evidence preservation | staff and guests require permission to access private quarters | certain areas, like the library and study, are off-limits to all but the owner.
10. Sustain social coherence with this backdrop pressure: The looming threat of financial ruin amidst the Great Depression unites the manor's residents and guests, each grappling with their own secrets while navigating the tensions of class and privilege.
11. Maintain continuity around these socially central cast anchors where relevant: Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill.
12. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Critical: Plot similarity 0.75 with 'The Mysterious Affair at Styles' (same era and mechanical manipulation method)
13. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Moderate: Character similarity 0.74 with 'The Sign of the Four' (similar cast structure and character roles)
14. STORY TO DATE ANTI-COPY RULE: The STORY TO DATE section below is provided for chronological and factual reference ONLY. You MUST NOT copy, lightly rephrase, or structurally echo any sentence or paragraph from prior chapters. Every sentence in this chapter must be original prose unique to this scene. Reusing even a clause from prior chapter text will cause this attempt to fail immediately.

CRITICAL PROSE REQUIREMENTS:

The CML specifies exact requirements for certain validation-critical scenes. You MUST include these elements at the specified positions.

**Discriminating Test Scene (Act 3, Scene 4):**
Required elements: Execute the discriminating test, Observe the clock's tampering evidence, Draw conclusion about Captain Hale's guilt
Test type: mechanical manipulation

**Suspect Clearance Scenes:**
- Dr. Mallory Finch (Act 3, Scene 5): Alibi verified by kitchen staff.
  Clues: clue_1, clue_2
- Beatrice Quill (Act 3, Scene 5): Alibi confirmed: 10:00 to 11:00

**Culprit Revelation Scene (Act 3, Scene 6):**
Method: Confrontation with evidence about clock tampering.

**VALIDATION CONSEQUENCE:** If these requirements are not met exactly, story validation will fail and the entire generation will be rejected, costing $5-8 to regenerate. Follow these specifications precisely.


## Asset Self-Report (required)
At the very END of your response, after all prose, add a single line:
<used_assets>era:story:0,era:story:1,era:story:2,era:story:3</used_assets>
Replace the list with only the IDs of texture assets you actually used. If you used none, output <used_assets></used_assets>.
```

## Message 2 (role=user)

```text
Write the full prose following the outline scenes.



CHAPTER OBLIGATION CONTRACT (MUST SATISFY):
- Chapter 6:
  - Word count: Target 1250 words. Achieve this through plot events, dialogue exchanges, and physical investigation — not through atmospheric repetition or extended internal reflection. Each 200-word segment should contain at minimum one concrete story event (a discovery, a conversation exchange, a physical action or movement). Padding with atmosphere alone is not acceptable.
  - Location anchor: the kitchen.
  - Opening atmosphere (MANDATORY — validator enforced): the first paragraph MUST contain at least one of: rain / wind / fog / storm / mist / thunder / evening / morning / night / dawn / dusk / season / afternoon / midday / noon / midnight / twilight / sunrise / sunset / daylight / sunlight / overcast / cloudy / bright / dark. A chapter that omits all of these from its opening paragraph will be rejected.
  - Continuity bridge: in the first 120 words, visibly connect from the previous chapter's final beat. Carry forward one unresolved element (object, accusation, emotional pressure, or immediate physical action) from: "As Eleanor prepared to leave, she glanced back at Beatrice, who was now staring blankly at the floor. The rain continued to fall, a relentless reminder of the chaos that had engulfed them all. Eleanor knew that the answe...".
  - CLUE OBLIGATIONS — mandatory prose elements (do NOT omit or bury):
    • Eliminates Eleanor Voss because she has a corroborated alibi placing her away from the scene at the time of the murder. [clue_core_elimination_chain]
      Points to: This narrows the suspect list towards Captain Ivor Hale.
  - Tonal contrast: include at least one beat of relief or ironic counterpoint. Do not sustain maximum tension for every paragraph.
- Locked fact phrase obligations:
  - If this batch mentions The exact time shown on the stopped clock face, write exactly: "ten minutes past eleven".
  - If this batch mentions The exact amount the clock was wound back, write exactly: "forty minutes".
  - If this batch mentions The temperature of the clock casing at the time of the murder, write exactly: "ninety degrees Fahrenheit".
- Seasonal vocabulary allow-list: autumn, autumnal, fall.
- Forbidden seasonal words: spring, summer, winter.

FROZEN TIMELINE STATE (DO NOT ALTER):
- Timeline anchor: September (autumn).
- Month, season, weather, and time-of-year language in this batch must stay compatible with autumn.
- Established timeline fact: The last time the clock was known to function correctly.
- Established timeline fact: Witness accounts of the clock striking.
- If referenced, use exact time phrase: "ten minutes past eleven" (The exact time shown on the stopped clock face).
- If referenced, use exact time phrase: "forty minutes" (The exact amount the clock was wound back).
- If referenced, use exact time phrase: "ninety degrees Fahrenheit" (The temperature of the clock casing at the time of the murder).

STORY TO DATE (REFERENCE ONLY — DO NOT COPY VERBATIM):
- Full prior chapter text is provided below for continuity, factual consistency, and reference accuracy.
- Use this to keep character voice, chronology, clue state, and location continuity aligned with earlier chapters.
- Do not quote, copy, or paraphrase these paragraphs too closely; write fresh prose that remains consistent with them.

--- BEGIN PRIOR CHAPTER 1 ---
Title: Chapter 1: Discovery
The morning light filtered weakly through the heavy curtains of the study, casting a dim glow over the somber scene. Outside, the rain fell steadily, a soft patter against the windowpanes that seemed to echo the unease within. Eleanor Voss stood at the threshold, her breath catching in her throat as she took in the sight before her. There, sprawled on the polished wooden floor, lay the lifeless body of the victim, a figure once vibrant now rendered still. The clock on the wall, its face cracked and dusty, showed ten minutes past eleven, a grim reminder of the moment when life had been so cruelly extinguished.

Eleanor stepped closer, her heart pounding in her chest. The room was steeped in tension, every shadow seeming to whisper secrets. As she knelt beside the body, her gaze flickered to the clock once more. "Ten minutes past eleven," she murmured, the words slipping from her lips like a prayer. This time, the implications were clear: the victim had died no later than that hour, a fact that would soon unravel the carefully constructed alibis of those present. The air felt thick with unspoken accusations, and Eleanor's mind raced with the possibilities.

The study, usually a sanctuary of knowledge, now felt like a locked room filled with suspicion. the captain Hale stood rigidly by the fireplace, his expression a mask of grief and anger. the doctor Finch hovered nearby, her hands trembling as she clutched a handkerchief, while Beatrice Quill remained frozen, tears glistening in her eyes. Eleanor could sense the weight of their gazes upon her, each suspect grappling with their own turmoil as they awaited the arrival of the detective. It was a tableau of despair, yet beneath the surface lay a current of unresolved tensions, each person hiding their own secrets.

The clock, Eleanor noted, was not merely a witness to the tragedy; it was a key player in the unfolding drama. The hands had been manipulated, she realized, creating a false narrative of the murder timeline. This revelation sent a shiver down her spine. Who would go to such lengths to alter the truth? The answer seemed to hang in the air, taunting her with its elusiveness. As she stood, the implications of the clock's tampering began to take shape in her mind, pointing toward a deliberate act of deception that could implicate any of the three suspects.

Eleanor turned her attention back to the others, her voice steady yet filled with an undercurrent of urgency. "We need to account for where each of you was at the time of death. The clock suggests a timeline that contradicts your alibis," she stated, her eyes narrowing as she searched their faces for any sign of guilt. Captain Hale's jaw tightened, and he stepped forward, his demeanor shifting from grief to defiance. "I was in the garden, preparing for the Harvest Festival. I have witnesses to prove it!"

the doctor Finch interjected, her voice tinged with a nervous laugh. "I was attending to a patient in the village. I can provide proof of that as well." Beatrice, however, remained silent, her expression a mixture of fear and sorrow. Eleanor noted the way Beatrice's hands trembled as she clutched her handkerchief, a silent testament to her distress. The argument hung in the air, a fragile thread connecting them all, each suspect now aware that their lives were intertwined in this tragic web.

Eleanor's mind raced as she considered the implications of the clock's time and the conflicting accounts. The rain continued to fall outside, a relentless reminder of the chaos that had descended upon Little Middleton Manor. With each passing moment, the atmosphere thickened, and Eleanor felt the weight of the investigation pressing down on her. She had to uncover the truth, not just for the sake of justice, but for the sake of those who remained trapped in this nightmare. As she surveyed the room, she couldn't shake the feeling that the answers were hidden in plain sight, waiting to be uncovered.
--- END PRIOR CHAPTER 1 ---

--- BEGIN PRIOR CHAPTER 2 ---
Title: Chapter 2: Witness Statements
The late morning light filtered weakly through the heavy drapes of the drawing-room, casting a dim glow over the anxious faces gathered within. Outside, the rain continued to fall, its rhythmic patter against the windowpanes echoing the rising tension inside. Eleanor Voss stood at the center of the room, her mind racing as she considered the implications of the clock's time and the conflicting accounts. The atmosphere was thick with suspicion, each breath feeling heavy with unspoken accusations. As she surveyed the room, she noted the way the captain Hale's jaw tightened, the nervous fidget of the doctor Finch's hands, and the silent grief etched on Beatrice Quill's face. The clock's hands had been manipulated, creating a false narrative of the murder timeline, and Eleanor felt the weight of that revelation pressing down on her.

Eleanor stepped closer to the ornate clock perched on the mantelpiece, its face cracked and dusty. The time shown on the stopped clock face was "ten minutes past eleven," a grim reminder of the moment when life had been extinguished. But the time discrepancy suggests the clock may not reflect the actual time of death. She could almost hear the clock ticking in her mind, counting down the seconds until the truth would be revealed. Who would dare to tamper with such a crucial piece of evidence? The thought sent a shiver down her spine as she turned her gaze back to the suspects, each of them now acutely aware of the implications of their statements.

As Eleanor's eyes darted around the room, they landed on Captain Hale, who stood rigidly by the fireplace. His expression was a mask of grief and anger, yet she could sense an undercurrent of defiance in his posture. "I was in the garden, preparing for the Harvest Festival. I have witnesses to prove it!" he asserted, his voice steady but tinged with an edge of irritation. It was a bold claim, but Eleanor couldn't shake the feeling that it was a convenient alibi, one that might not hold up under scrutiny. The tension in the room thickened as Dr. Finch interjected, her voice trembling slightly. "I was attending to a patient in the village. I can provide proof of that as well," she said, her hands shaking as she clutched her handkerchief tightly. The sight of her distress only deepened Eleanor's suspicions.

Beatrice Quill remained silent, her expression a mixture of fear and sorrow. Eleanor noted the way Beatrice's hands trembled as she clutched her handkerchief, a silent testament to her distress. The contrast of Beatrice's quiet demeanor against the backdrop of the others' more assertive claims created a palpable tension in the air. Eleanor could sense that something was amiss, that the pieces of this puzzle were not fitting together as they should. The argument hung in the air, a fragile thread connecting them all, each suspect now aware that their lives were intertwined in this tragic web.

Eleanor took a deep breath, trying to maintain her composure. "We need to account for where each of you was at the time of death. The clock suggests a timeline that contradicts your alibis," she stated, her voice steady yet filled with an undercurrent of urgency. The words hung in the air, and she could see the flicker of uncertainty in their eyes. The clock was not merely a witness to the tragedy; it was a key player in the unfolding drama. The hands had been manipulated, and that revelation sent a shiver down her spine. Who would go to such lengths to alter the truth? The answer seemed to hang in the air, taunting her with its elusiveness.

As the conversation continued, Eleanor's thoughts turned to the discrepancies in the witness accounts. The conflicting statements created distrust among the suspects, and she knew that the truth lay buried beneath layers of deception. Each alibi raised more questions than answers, and she felt the weight of the investigation pressing down on her. The stakes were high, and she could not afford to make a mistake. With each passing moment, the atmosphere thickened, and Eleanor felt the urgency of her task. She had to uncover the truth, not just for the sake of justice, but for the sake of those who remained trapped in this nightmare.

Suddenly, a thought struck her. Witnesses had claimed they saw Eleanor Voss near the study around the time of the murder. The realization sent a jolt through her. Could it be that she had unwittingly placed herself in the wrong place at the wrong time? The implications were staggering, and she felt a wave of unease wash over her. The very fabric of her existence within this family was now woven with suspicion and doubt. Eleanor's heart raced as she considered the ramifications of this new information. She needed to confront the others with this revelation, to see how they would react to the idea that she might be implicated in the very crime she sought to solve.

As the rain continued to fall outside, a sense of foreboding settled over the drawing-room. The flickering light from the fireplace cast eerie shadows on the walls, and Eleanor could feel the weight of the secrets that hung in the air. The tension was palpable, and she knew that the answers she sought were hidden in plain sight, waiting to be uncovered. With a deep breath, she steeled herself for the next round of questioning, determined to peel back the layers of deception and reveal the truth that lay beneath.
--- END PRIOR CHAPTER 2 ---

--- BEGIN PRIOR CHAPTER 3 ---
Title: Chapter 3: Fingerprint Examination
At noon, the rain continued to fall steadily outside the study, a relentless rhythm that echoed the tension within. Eleanor Voss stood before the ornate clock, its face cracked and dusty, a grim reminder of the tragedy that had unfolded. The flickering light from the nearby window cast shadows across the room, illuminating the anxious expression on her face. She could still feel the weight of the secrets that hung in the air, a palpable reminder of the unresolved questions that plagued her.

Eleanor stepped closer to the clock, her heart racing as she examined its condition. The time shown on the stopped clock face was "ten minutes past eleven," a stark reminder of the moment when life had been extinguished. Witness statements indicated conflicting times regarding the murder, and she felt a shiver run down her spine at the implications. How could such a crucial piece of evidence be so unreliable? The thought gnawed at her, raising doubts about the integrity of the timeline that had been presented.

As she scrutinized the clock, Eleanor recalled the words of the witnesses. "I heard the clock strike twelve," one had said, while another insisted they had seen the victim alive well past eleven. The inconsistencies in witness accounts suggest the murder time was manipulated, and Eleanor's mind raced with the possibilities. Who would benefit from altering the timeline? The answer seemed to elude her, hovering just out of reach like a shadow in the dim light.

The time discrepancy suggests the clock may not reflect the actual time of death, and Eleanor felt a sense of urgency wash over her. The clock was not merely a witness to the tragedy; it was a key player in the unfolding drama. The hands had been tampered with, and this revelation sent a shiver down her spine. Who would go to such lengths to alter the truth? The answer seemed to hang in the air, taunting her with its elusiveness.

Eleanor turned her attention to Captain Hale, who stood nearby, his expression a mixture of grief and defiance. "I was in the garden, preparing for the Harvest Festival. I have witnesses to prove it!" he asserted, his voice steady but tinged with irritation. The boldness of her claim struck Eleanor as convenient, raising further suspicions. Could it be that she was hiding something?

the doctor Finch, who had been observing the exchange with a nervous fidget, chimed in. "I was attending to a patient in the village. I can provide proof of that as well," she said, her hands trembling as she clutched her handkerchief tightly. The sight of her distress only deepened Eleanor's suspicions. Why was she so anxious? Did she fear that her alibi might crumble under scrutiny?

Beatrice Quill remained silent, her expression a mixture of fear and sorrow. Eleanor noted the way Beatrice's hands trembled as she clutched her handkerchief, a silent testament to her distress. The contrast of Beatrice's quiet demeanor against the backdrop of the others' more assertive claims created a palpable tension in the air. Eleanor could sense that something was amiss, that the pieces of this puzzle were not fitting together as they should.

Eleanor took a deep breath, trying to maintain her composure. "We need to account for where each of you was at the time of death. The clock suggests a timeline that contradicts your alibis," she stated, her voice steady yet filled with an undercurrent of urgency. The words hung in the air, and she could see the flicker of uncertainty in their eyes. The clock was not merely a witness to the tragedy; it was a key player in the unfolding drama. The hands had been manipulated, and that revelation sent a shiver down her spine.

Suddenly, Eleanor's gaze fell upon the clock's casing, and she noticed something that made her heart race. The fingerprints found on the clock's casing were visible, smudged yet discernible. Could they belong to Captain Hale? The implications were staggering, and he felt a wave of unease wash over him. This was no ordinary tampering; it suggested a deliberate act of deception, one that could point directly to the captain himself.

Eleanor's mind raced as she considered the ramifications of this discovery. Direct evidence ties the captain Hale to the mechanism access point before the discriminating test, and he felt the weight of the moment pressing down on him. The evidence was beginning to shape a narrative, one that painted Hale in a suspicious light. But how could he confront him with this information? Would he admit to his involvement, or would he deflect and deny?

As the rain continued to fall outside, Eleanor felt a sense of urgency settle over her. The clock, with its tampered hands and incriminating fingerprints, was a key piece of evidence in this unfolding drama. He had to confront Captain Hale, to demand answers and unravel the tangled web of deceit that surrounded them all. The tension in the room was palpable, and he knew that the answers he sought were hidden in plain sight, waiting to be uncovered.
--- END PRIOR CHAPTER 3 ---

--- BEGIN PRIOR CHAPTER 4 ---
Title: Chapter 4: Interrogating Captain Hale
The afternoon rain drummed against the windowpanes of the study, its relentless rhythm echoing the tension that filled the room. Eleanor Voss stood before the ornate clock, its face cracked and dusty, a grim reminder of the tragedy that had unfolded. The light filtered through the heavy curtains, casting a dim glow over the polished wooden floor, where the shadows seemed to dance with the weight of secrets. He could still feel the urgency of the moment, the pressing need to confront Captain Hale about the incriminating fingerprints that linked him to the tampering of the clock.

Eleanor's heart raced as she turned to face the captain Hale, who stood near the fireplace, arms crossed defensively over his chest. His expression was a mixture of grief and irritation, the tension palpable as she prepared to challenge him directly. "Captain Hale," he began, his voice steady despite the turmoil within. "We need to discuss the fingerprints found on the clock's casing. They match yours, and I must know where you were at the time of the murder."

Hale's jaw tightened, and he took a step forward, his demeanor shifting from grief to defiance. "I was in the garden, preparing for the Harvest Festival. I have witnesses to prove it!" Her voice wavered slightly, a crack in her facade that did not go unnoticed by Eleanor. The boldness of her claim struck her as convenient, raising further suspicions. Could it be that she was hiding something beneath that confident exterior?

Eleanor pressed on, determined to uncover the truth. "Witnesses can be unreliable, Captain. The time shown on the stopped clock face was 'ten minutes past eleven,' and the evidence suggests that the clock was tampered with. Your fingerprints on the casing indicate you had access to it. How do you explain that?" The words hung in the air, heavy with the weight of accusation. He could see the flicker of uncertainty in his eyes, the slight shift in his posture as he grappled with the implications of his statement.

Hale's defensiveness only fueled Eleanor's determination. "I assure you, I had nothing to do with it!" he insisted, his voice rising slightly. "I was preparing for the festival, and I can provide proof of my whereabouts!" The urgency in her tone belied a deeper anxiety, and Eleanor felt a pang of doubt. Was she truly innocent, or was this a desperate attempt to deflect suspicion? She needed to dig deeper, to peel back the layers of her alibi and expose any cracks beneath the surface.

Eleanor took a step closer, her gaze unwavering. "Captain, your insistence on your innocence does not negate the evidence against you. You were the last person to have access to the clock before it was tampered with. The conflicting witness statements only add to the uncertainty surrounding your alibi. I need you to be completely honest with me. Where were you during the crucial moments leading up to the murder?"

For a moment, Hale hesitated, his eyes darting away as if searching for the right words. "I was... I was in the garden, as I said. I had my back to the house, preparing the decorations. I didn't hear anything unusual until I was called inside. You must believe me!" Her voice cracked slightly, revealing a glimpse of vulnerability that caught Eleanor off guard. Yet, despite the emotional appeal, she remained skeptical. The pieces of the puzzle were still not fitting together.

Eleanor's mind raced as she considered the implications of Hale's words. If he had been in the garden, why had no one seen him? The rain continued to fall outside, a relentless reminder of the chaos that had descended upon Little Middleton Manor. The clock, with its tampered hands and incriminating fingerprints, was a key piece of evidence in this unfolding drama. He had to confront Hale with the truth, to demand answers and unravel the tangled web of deceit that surrounded them all.

As the tension mounted, Eleanor took a deep breath, steeling herself for the next round of questioning. "Captain Hale, I need you to understand the gravity of this situation. Your alibi is shaky, and the evidence against you is mounting. If you have anything to add, now is the time to speak. I want to believe you, but the facts are not in your favor." His voice softened slightly, revealing a hint of empathy beneath the steely resolve. He wanted to give him a chance, to allow for the possibility that he was telling the truth, but the weight of the evidence loomed large.

Hale's expression shifted, a flicker of desperation crossing his face. "I swear, I had nothing to do with it! You must believe me!" Her insistence echoed in the room, and Eleanor felt a pang of sympathy mixed with skepticism. The truth was elusive, and the clock continued to tick, a relentless reminder of the time that had passed since the murder. As the rain fell outside, Eleanor knew that the answers she sought were hidden in plain sight, waiting to be uncovered.
--- END PRIOR CHAPTER 4 ---

--- BEGIN PRIOR CHAPTER 5 ---
Title: Chapter 5: Interview with Beatrice Quill
As the afternoon rain continued to patter against the windows of the drawing-room, Eleanor Voss felt the weight of the moment pressing down on her. The atmosphere was thick with tension, a reflection of the unresolved emotions swirling in her mind. Just moments ago, Captain Hale had insisted on his innocence, his desperation palpable, but Eleanor couldn't shake the feeling that something was amiss. She turned her attention to Beatrice Quill, who sat nervously on the edge of a plush armchair, her fingers fidgeting with the delicate chain of her necklace. The muted light filtered through the heavy drapes, casting shadows that danced across the room, heightening the sense of unease that clung to them both.

Eleanor took a deep breath, steadying herself before she began. "Beatrice, I need to ask you about your relationship with the victim. You were quite close, weren't you?" The question hung in the air, and Beatrice's eyes darted away, her fingers tightening around the necklace as if seeking comfort in the familiar.

"Yes, we were friends," Beatrice replied, her voice wavering slightly. "But that doesn't mean I had anything to do with... with what happened." There was an edge of defensiveness in her tone, and Eleanor noted the way Beatrice's gaze flickered towards the door as if contemplating an escape. The tension in the room was palpable, and Eleanor pressed on, determined to uncover the truth.

"Can you tell me where you were at the time of the murder?" Eleanor inquired, her voice calm but firm. Beatrice hesitated, her fingers still fidgeting with the necklace. "I was in my room, working on my art. I... I didn’t hear anything unusual until I was called downstairs," she stammered, her eyes betraying a hint of anxiety. Eleanor sensed that Beatrice was withholding something, and the unease in the room deepened.

"Working on your art?" Eleanor echoed, her brow furrowing. "Do you have anyone who can confirm your whereabouts?" Beatrice shook her head, her expression clouded with uncertainty. "No, I was alone. I often work alone when I’m inspired. It helps me focus." Yet, the way she spoke felt rehearsed, as if she were trying to convince herself as much as Eleanor.

Eleanor leaned forward, her voice dropping to a conspiratorial whisper. "Beatrice, I understand that times are tough, especially with the economy as it is. But your financial dependency on the victim complicates things, doesn’t it?" Beatrice's eyes widened, and she recoiled slightly, her fingers still twisting the necklace. "I... I didn’t want to burden her with my troubles. She was so generous, always helping me out. But that doesn’t mean I wanted her dead!"

The desperation in Beatrice's voice only heightened Eleanor's suspicions. "But it does create a potential motive, doesn’t it? If you felt trapped, if you feared losing that support..." Eleanor let the implication linger in the air, watching as Beatrice's expression shifted from fear to defiance. "I would never harm her!" Beatrice exclaimed, her voice rising in pitch. "I loved her like a sister!"

Eleanor's gaze remained steady, searching for any sign of deception. "Then help me understand, Beatrice. If you were truly innocent, why is your alibi so weak? Why didn’t anyone see you?" Beatrice's hands dropped to her lap, and she looked down, her shoulders slumping as if the weight of the world rested upon them. "I don’t know! I just... I wasn’t thinking clearly. I was lost in my work, and I didn’t hear anything until it was too late."

The rain outside intensified, mirroring the storm of emotions brewing within the drawing-room. Eleanor took a moment to gather her thoughts, the tension between them thickening. "Beatrice, I need you to be honest with me. If there’s anything you’re hiding, now is the time to tell me. The truth will come out, one way or another." Beatrice looked up, her eyes glistening with unshed tears. "I swear, I didn’t do it! I would never hurt her!"

Eleanor felt a pang of sympathy for Beatrice, caught in a web of her own making. Yet, the evidence was mounting against her. The clock had been tampered with, and Beatrice's financial dependency on the victim hinted at desperation. "We will uncover the truth, Beatrice. But you must trust me and be forthcoming. I need to know everything, even the things you think are insignificant. They might be the key to understanding what really happened that night."

As Eleanor prepared to leave, she glanced back at Beatrice, who was now staring blankly at the floor. The rain continued to fall, a relentless reminder of the chaos that had engulfed them all. Eleanor knew that the answers she sought were hidden in the shadows, waiting to be uncovered, and she was determined to find them, no matter the cost.
--- END PRIOR CHAPTER 5 ---

[SCENE COMPLETENESS CONTRACTS — MANDATORY. Each contract below lists what you MUST enact in that chapter. Do not summarise or mention these labels in the prose — enact them organically.]
Chapter 6 (Act 2) completeness contract:
  PIVOT ELEMENT (MANDATORY — write this into the prose, shown not told): "The kitchen staff's conflicting accounts of Dr. Finch's whereabouts."
  FACT ESTABLISHED (MANDATORY — reader must know this by chapter end): "Establishes that Dr. Finch was not in the library before ten PM — her claimed alibi holds."

# Case Overview
Title: The Clockwork Trap
Era: 1930s
Setting: Little Middleton
Crime: murder (mechanical manipulation)
Culprit: Captain Ivor Hale
False assumption: Eleanor Voss’s murder occurred at the time indicated by the clock.
Cast: Eleanor Voss (she/her), Dr. Mallory Finch (she/her), Captain Ivor Hale (he/him), Beatrice Quill (she/her)

Setting Lock: Keep all scenes and descriptions consistent with the stated setting (Little Middleton). Do not introduce a different location type.

Outline scenes:
[
  {
    "sceneNumber": 6,
    "act": 2,
    "title": "Dr. Finch's Alibi",
    "setting": {
      "location": "the kitchen",
      "timeOfDay": "Late afternoon",
      "atmosphere": "Busy, with the staff preparing for dinner"
    },
    "characters": [
      "Eleanor Voss",
      "Dr. Mallory Finch"
    ],
    "purpose": "Verify Dr. Finch's alibi through kitchen staff",
    "cluesRevealed": [
      "clue_core_elimination_chain"
    ],
    "dramaticElements": {
      "conflict": "Eleanor seeks to confirm Finch's whereabouts.",
      "tension": "Staff members provide conflicting accounts.",
      "microMomentBeats": [
        "Eleanor watches the kitchen staff bustle, feeling the weight of uncertainty."
      ]
    },
    "summary": "Eleanor checks with the kitchen staff to verify Dr. Finch's alibi. The staff's conflicting accounts add to the confusion, but ultimately confirm Finch's presence away from the crime scene.",
    "estimatedWordCount": 1800,
    "pivotElement": "The kitchen staff's conflicting accounts of Dr. Finch's whereabouts.",
    "factEstablished": "Establishes that Dr. Finch was not in the library before ten PM — her claimed alibi holds.",
    "permittedBehavioursByAct": [
      {
        "characterName": "Eleanor Voss",
        "behaviour": "unease, mild defensiveness"
      },
      {
        "characterName": "Dr. Mallory Finch",
        "behaviour": "normal social behaviour; grief"
      }
    ],
    "redHerringPlacement": null,
    "emotionalRegister": "A revelation recontextualizes earlier events, intensifying the investigation.",
    "dominantCharacterNote": {
      "name": "Eleanor Voss",
      "voiceRegister": "Eleanor speaks with a soft, measured cadence, often punctuating her sentences with thoughtful pauses."
    },
    "humourGuidance": {
      "permission": "forbidden"
    },
    "eraTextureNote": "Limited access to fresh food due to economic hardship; Travel restricted by fuel shortages and economic constraints; Communication primarily through letters and telegrams, which delay news",
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
