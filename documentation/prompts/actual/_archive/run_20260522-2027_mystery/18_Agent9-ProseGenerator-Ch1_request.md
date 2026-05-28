# Actual Prompt Record

- Run ID: `mystery-1779481632117`
- Project ID: ``
- Timestamp: `2026-05-22T20:42:08.209Z`
- Agent: `Agent9-ProseGenerator-Ch1`
- Operation: `chat_request_full_prompt`
- Model: `GPT-4o-mini`
- Temperature: `0.42`
- Max Tokens: `4500`
- Attempt: `first`
- Prompt Hash: `451f6780f5d350d9`

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
- MORAL COMPLEXITY REQUIREMENT: The mechanism of this crime carries a moral gray area: "The culprit acted out of desperation to prevent the victim from revealing a deeply personal secret that would ruin their life." — the culprit reveal and denouement MUST acknowledge this ambiguity. Do not let the ending feel clean or simple. Give the reader at least one moment of uncomfortable sympathy or moral doubt.


⚠️ AMATEUR DETECTIVE STORY: The investigator is a civilian with no official standing. The official police (if they appear) are unnamed background figures only — "a constable", "the sergeant", "an officer from the village". Do NOT give any police official a name or title+surname combination. There is no Inspector [Surname], no Constable [Surname], no Sergeant [Surname] in this story.


CRITICAL CHARACTER CONSISTENCY RULES:

1. Each character has ONE canonical name. Use ONLY names from this list. Never vary, abbreviate, or add titles beyond what is listed.
   COMPLETE CAST (no other named characters exist): Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill
   - "Mr. Jennings entered the room" → ILLEGAL. Jennings is not in the cast.
   - "Constable Reed took notes" → ILLEGAL. Reed is not in the cast.
   - "A constable took notes" → LEGAL (no name given).

2. Character roles are fixed:
   - Eleanor Voss: High Society Matriarch
   - Dr. Mallory Finch: Progressive Thinker
   - Captain Ivor Hale: Traditionalist
   - Beatrice Quill: Idealistic Dreamer
   - Never place characters in locations inconsistent with their role

WORLD DOCUMENT (use this as your primary creative context):

## Era: 1939-01
In January 1939, the air is thick with a mix of anticipation and dread as Europe teeters on the brink of war. Daily life is defined by the chill of winter, with overcast skies and intermittent rain creating a somber backdrop for the gatherings at Ashwood Manor. Social events are tinged with unease as guests navigate the complexities of class and reputation, while the lingering effects of the Great Depression cast shadows on the privileged lives they lead. Conversations often turn to the uncertain political climate, reflecting a society grappling with both personal ambitions and collective anxieties. The scent of woodsmoke and damp earth fills the manor, a reminder of the world outside, where the threat of conflict looms large and personal secrets threaten to unravel the delicate fabric of their lives.
Emotional register: A collective state of anxiety and uncertainty permeates the community as whispers of war grow louder.
Physical constraints: Limited daylight hours with the sun barely rising before eight | Chilly temperatures requiring indoor gatherings for warmth | Communication through domestic telephones with party-line systems
Current tensions (weave into background texture): Rising tensions in Europe with the impending outbreak of World War II | The Munich Agreement's aftermath affecting British politics | The growing strength of the Nazi regime in Germany
Wartime context — The country is preparing for potential military service as conflict looms.: Communities are divided between those who support rearmament and those who advocate for peace. Absence effect: Fear of losing loved ones to war creates a palpable emotional strain among families.

## Story Theme
The unraveling of social facades in the face of hidden truths reveals the fragility of personal identities and relationships amidst rising tensions, and reveals that evidence carries ethical weight, forcing characters to choose accountability over social performance when appearances and facts collide.

## Story Emotional Register
Dominant: A haunting tension permeates the narrative, reflecting the fragility of human connections in a climate of secrets.

Arc:
The story opens at Ashwood Manor on a stormy evening, where a wealthy benefactor’s murder sets the stage for a complex web of intrigue. The atmosphere is charged with unease as the characters gather for the will reading, each harboring their own secrets. As the investigation unfolds, initial clues emerge, revealing the suspects' hidden motives and the emotional toll of their lies. Eleanor Voss's charm masks a deep-rooted gambling addiction, while Dr. Mallory Finch grapples with the fear of scandal. The tension escalates, leading to a pivotal moment where the investigator uncovers the tampered clock that misleads the timeline of the murder. This revelation shifts suspicions, leading to a deeper exploration of the characters' relationships. As mounting pressure builds, the climax reveals the true nature of betrayal and deception, culminating in a confrontation that forces each character to confront the cost of their choices. In the resolution, the emotional fallout leaves lasting scars, as the characters grapple with their identities and the fragile ties that bind them in a world on the brink of chaos.

The story opens: The atmosphere is thick with anticipation and dread as the guests gather for the will reading. As the investigation takes shape: Initial clues spark suspicion, revealing hidden motives and the emotional cost of their lies. A first key turn arrives: The discovery of the tampered clock shifts the focus of the investigation. At the mid-point of the story: A revelation changes the investigator's direction, illuminating the characters' intertwined fates.

A second pivot reshapes the course: The climax reveals the depth of betrayal, forcing characters to confront their secrets. As tension reaches its height: Mounting pressure creates an atmosphere of inevitable confrontation. The climax brings the central question to a head: The confrontation lays bare the emotional toll of deception and hidden truths. In the final resolution: The characters are left to grapple with the emotional fallout of their choices.

Underpinning every turn is the story's central concern: The unraveling of social facades in the face of hidden truths reveals the fragility of personal identities and relationships amidst rising tensions. This thread binds the individual emotional moments into a coherent journey.

The dominant register — A haunting tension permeates the narrative, reflecting the fragility of human connections in a climate of secrets. — colours the prose from first chapter to last, ensuring the reader feels the weight of each revelation as moral consequence rather than mere puzzle mechanics.

## Emotional register at this point in the story
The atmosphere is thick with anticipation and dread as the guests gather for the will reading.

## Character Portraits (appearance & era)

### Eleanor Voss
Eleanor Voss embodies the rising tensions of the era as a woman caught between societal expectations and personal demons. Her gambling addiction threatens to expose her, mirroring the vulnerability many feel as the political climate intensifies. The fear of losing her status reflects the broader anxieties of a society on the brink.
Era intersection: Her struggle to maintain appearances amidst personal turmoil resonates with the collective fear of societal collapse as war approaches.

### Beatrice Quill
Beatrice Quill, an aspiring writer, navigates the complexities of ambition in a society that often dismisses artistic pursuits. Her desire for success intertwined with the unfolding murder reflects the tensions between integrity and ambition, resonating with the era's broader societal conflicts as the threat of war looms on the horizon.
Era intersection: Her struggle to maintain artistic integrity in the face of personal gain encapsulates the dilemmas faced by many as they navigate a world fraught with uncertainty.

## Character Voices

### Eleanor Voss (she/her/her)
Eleanor speaks with a measured cadence, her words laced with irony and charm.
[comfortable] Ah, the garden is simply divine this time of year, is it not? One can lose themselves in such beauty.
[evasive] I was merely... tending to some matters of personal import. Nothing to trouble yourself over, dear.
[stressed] You don't understand! If this secret gets out, everything I've worked for will crumble!
Humour: Her polite savagery often surfaces in social settings, masking her internal chaos.

### Beatrice Quill (she/her/her)
Beatrice's youthful exuberance is evident in her animated speech, often filled with dramatic flair.
[comfortable] Oh, the stories I could tell! Life is but a grand adventure, is it not?
[evasive] Well, inspiration can come from... unexpected sources. Every story has its secrets.
[stressed] What if this tragedy becomes my moment? But at what cost to my friends?
Humour: Her sardonic wit often reflects her inner conflict between ambition and morality.

## Location Registers (scene framing guides)

The Library: The library feels heavy with secrets, each shadow and whisper amplifying the tension of the crime. It is a place where knowledge meets mystery, and the air is thick with unease as the guests confront the reality of betrayal and loss.. Camera angle: As a writer enters, the library looms large, embodying both sanctuary and prison, a stage for the unfolding drama.. Era: The dim lighting and musty scent of old books evoke a sense of isolation that mirrors the characters' emotional states.

The Drawing Room: The drawing room buzzes with tension, laughter and murmurs fading into an undercurrent of suspicion. Each elegant detail contrasts sharply with the growing dread that something sinister lies beneath the surface of this social gathering.. Camera angle: As a writer steps in, the drawing room feels like a chessboard, where every move could reveal or conceal truths.. Era: The lavish decor reflects the era’s obsession with status, heightening the stakes of the characters' interactions.

The Servants' Hall: In the Servants' Hall, the atmosphere is one of urgency and whispered speculation. Here, the staff navigate their own secrets while the weight of the manor’s tensions hangs heavily in the air, creating a stark contrast to the opulence above.. Camera angle: As a writer enters, the hall feels like a crossroads of fate, where every conversation could unveil hidden truths.. Era: The simple furnishings reflect the class disparities of the time, highlighting the divide between the privileged and their servants.

## Humour guidance for this story position (opening)
Permission: forbidden
Rationale: The tone is serious as the murder sets the stage for the mystery.

FAIR-PLAY AND INFERENCE CONTRACT:
- FAIR PLAY CLUE TIMING: Never combine clue discovery and detective deduction in the same chapter. If a clue is first revealed to the reader in chapter N, the detective may only analyze, deduce from, or act on that clue in chapter N+1 or later.
- FAIR PLAY INFORMATION PARITY: The reader must see all clues BEFORE the detective uses them in reasoning. If the detective performs a test or makes a deduction, every piece of evidence supporting that conclusion must have been shown to the reader in earlier chapters.
- FAIR PLAY REVELATION SPACING: In the discriminating test scene, the detective can ONLY use clues that were revealed to the reader at least 1 full chapter earlier. Never introduce new clues or withheld information during the test.
- FAIR PLAY CONFRONTATION: During the final confrontation/revelation, the detective cannot surprise the reader with facts. Every piece of evidence cited must have been visible to the reader in prior chapters.
- Never solve by withheld information. Keep reader-information parity with detective reasoning.
- False assumption in force: The murder occurred during dinner, as all witnesses clearly remember the clock striking eight.
- Hidden truth to progressively expose: The clock was tampered with to show a false time.
- Inference path checkpoints to dramatize clearly (observation -> correction -> effect):
  - Step 1: obs: The clock in the study shows the hands stopped at ten minutes past eleven. | corr: The clock was tampered with to mislead witnesses about the time of death. | effect: Narrows alibi window for all suspects.
  - Step 2: obs: Eleanor Voss claims she was in the library at 8:00 PM, but the clock shows a false time. | corr: Eleanor's alibi is compromised by the tampered clock. | effect: Eliminates Eleanor Voss as a credible alibi.
  - Step 3: obs: Dr. Mallory Finch's medical records show she was present at the hospital until 8:30 PM. | corr: Dr. Finch cannot be the murderer if the murder occurred at 8:00 PM. | effect: Eliminates Dr. Mallory Finch as a suspect.
  - Step 4: obs: Captain Ivor Hale was seen entering the study just before dinner. | corr: His presence near the clock gives him access to tamper with it. | effect: Narrows the focus to Captain Hale as the primary suspect.
- Discriminating test method: trap
- Discriminating test design constraint: Comparing the clock's winding mechanism with the victim's watch shows they have been set differently, indicating tampering.
- Test must rely on already-shown clue IDs: clue_1, clue_2, clue_3, clue_5
- Fair-play rationale: Step 1: The clock's stopped hands (early) and witness recollections (mid) let the reader deduce the tampering. Step 2: Eleanor's compromised alibi (mid) eliminates her. Step 3: Dr. Finch's hospital record (late) confirms her alibi. Step 4: Hale's access to the clock (discriminating test) reveals his guilt.

## Character Reference

### Eleanor Voss (she/her — NEVER he/him)
Eleanor speaks with a measured cadence, employing a refined vocabulary that dances between formal and conversational
She often uses irony to navigate social situations, her laughter layered with a hint of sarcasm when discussing the foibles of others.
Deep down, Eleanor is torn between her desire to maintain her façade and the gnawing guilt of her addiction. Each bet places a greater weight on her conscience, as she fears the day she will lose everything.

### Beatrice Quill (she/her — NEVER he/him)
Beatrice speaks with a youthful exuberance, often punctuating her thoughts with dramatic flair
Her sardonic wit shines through in her commentary on societal expectations, revealing a cleverness that belies her naivety.
Beatrice wrestles with the tension between her artistic integrity and her desire for success. The allure of using her friends’ lives for inspiration clashes with her moral compass, creating a chasm she must navigate.


## CHARACTER CONTRACTS (binding for this scene)
Each entry below constrains how this character must be written in this chapter.
These override generic style guidance when they conflict.

### Eleanor Voss[SHE]
Voice & mannerisms: Eleanor speaks with a measured cadence, employing a refined vocabulary that dances between formal and conversational. She often uses irony to navigate social situations, her laughter layered with a hint of sarcasm when discussing the foibles of others.
Sample voice fragments (match this register and rhythm):
  [comfortable] "Ah, the garden is simply divine this time of year, is it not? One can lose themselves in such beauty."
  [evasive] "I was merely... tending to some matters of personal import. Nothing to trouble yourself over, dear."
Humour: polite savagery — deploy occasionally (level 0.5)
FORBIDDEN phrase (never write for Eleanor Voss): "she felt a wave of unease"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "The looming threat of exposure from the victim, who knows her secret, gnaws at her. Eleanor fears that the revelation of her financial ruin will strip her of her social standing, leaving her vulnerable and alone in a world that thrives on appearances." — do not surface in Act I.

### Beatrice Quill[SHE]
Voice & mannerisms: Beatrice speaks with a youthful exuberance, often punctuating her thoughts with dramatic flair. Her sardonic wit shines through in her commentary on societal expectations, revealing a cleverness that belies her naivety.
Sample voice fragments (match this register and rhythm):
  [comfortable] "Oh, the stories I could tell! Life is but a grand adventure, is it not?"
  [evasive] "Well, inspiration can come from... unexpected sources. Every story has its secrets."
Humour: sardonic — deploy occasionally (level 0.6)
FORBIDDEN phrase (never write for Beatrice Quill): "palpable tension filled the room"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "In her mind, the victim's death could elevate her status and provide the attention she craves for her work. The potential for notoriety is an intoxicating lure, one that she can't ignore." — do not surface in Act I.



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

Primary Location: Ashwood Manor (Little Middleton, England)
A sprawling manor steeped in secrets, Ashwood Manor looms over the Yorkshire countryside, its grand facade hiding a web of intrigue.

Key Locations Available:
- The Library (interior): Crime scene
- The Drawing Room (interior): Gathering space
- The Servants' Hall (interior): Clue discovery

Atmosphere (tonal cue only — do NOT reproduce this phrase verbatim in prose; translate into scene-specific, character-observed sensory language): tense, with a palpable sense of unease among the guests
Weather: overcast with intermittent rain, typical for late autumn

Era markers: petrol touring cars parked in the drive | domestic telephones with party-line systems | typewriters clattering in the study

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
  - Visual: dim light filtering through heavy drapes, dust motes dancing in the air, leather-bound volumes stacked high
  - Sounds: whispers of pages turning, the creak of floorboards, the ticking of a wall clock
  - Scents: musty scent of old books, cold stone and damp wood, beeswax from the candle holders
  - Touch: smooth leather book covers, cold metal of the lock

The Drawing Room (interior):
  - Visual: floral-patterned wallpaper, glimmering crystal chandelier, plush velvet upholstery
  - Sounds: soft laughter and murmurs, clinking of teacups, the rustle of silk dresses
  - Scents: freshly brewed tea, rosewater and lavender, burning wood and coal
  - Touch: soft velvet cushions, smooth porcelain teacups

The Servants' Hall (interior):
  - Visual: sturdy wooden table set for meals, hooks lined with coats and hats, faded wallpaper peeling at the edges
  - Sounds: clatter of dishes being washed, soft murmurs of conversation, the creak of old furniture
  - Scents: the scent of leftover food, dampness in the air, wood polish and dust
  - Touch: rough wooden table surface, cool metal of cutlery

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

- In January 1939, the air is thick with a mix of anticipation and dread as Europe teeters on the brink of war
- Daily life is defined by the chill of winter, with overcast skies and intermittent rain creating a somber backdrop for the gatherings at Ashwood Manor
- Social events are tinged with unease as guests navigate the complexities of class and reputation, while the lingering effects of the Great Depression cast shadows on the privileged lives they lead
- Conversations often turn to the uncertain political climate, reflecting a society grappling with both personal ambitions and collective anxieties
- The scent of woodsmoke and damp earth fills the manor, a reminder of the world outside, where the threat of conflict looms large and personal secrets threaten to unravel the delicate fabric of their lives.

TEMPORAL CONTEXT:

This story takes place in January 1939 during winter.

Seasonal Atmosphere:
- Weather patterns: overcast skies, intermittent rain, chilly temperatures
- Daylight: Short days with limited sunlight, the sun barely rising before eight and setting by four-thirty.
- Seasonal activities: indoor gatherings around the fireplace, board games and card games, listening to the radio for news and entertainment
- Seasonal occasions: New Year's Day (January 1)
- Season: winter

Period Fashion (describe naturally):
- Men formal: double-breasted wool suit, crisp white dress shirt, silk tie with geometric patterns
- Men casual: tweed jacket, corduroy trousers, plaid flannel shirt
- Men accessories: fedoras, leather gloves, pocket watches
- Women formal: elegant tea-length dress with a fitted bodice, long-sleeved silk blouse, velvet evening gown
- Women casual: knitted sweaters with geometric designs, A-line skirts, simple cotton blouses
- Women accessories: cloche hats, string pearls, handmade leather handbags

Cultural Context (reference naturally):
- Music/entertainment: Glenn Miller's big band music, Django Reinhardt's jazz compositions, Benny Goodman’s swing tunes; Films: The Wizard of Oz, Gone with the Wind; Theatre: The Glass Menagerie by Tennessee Williams, Pygmalion by George Bernard Shaw; Radio: The Shadow, The Lone Ranger
- Typical prices: Loaf of bread: four pence, Cup of tea: two pence, Cinema ticket: six pence
- Current events: rising tensions in Europe with the impending outbreak of World War II; the Munich Agreement's aftermath affecting British politics
- Literature: The Grapes of Wrath by John Steinbeck | The Maltese Falcon by Dashiell Hammett | 1984 by George Orwell | [detective fiction] | [social realism] | [science fiction]
- Technology: the first commercial jet airliner (though not yet operational) | developments in radar technology | improvements in television | domestic radios for entertainment and news | typewriters for business and personal use | telephones with party-line systems
- Daily life: visiting local tea rooms, participating in community dances, attending church services on Sundays
- Social rituals: formal dinner parties with multiple courses, afternoon tea gatherings, weekly church attendance

Atmospheric Details:
The scent of damp earth and woodsmoke fills the air, mingling with the faint hint of rain. The sound of rain tapping on the windowpanes creates a rhythmic backdrop to the hushed conversations within the estate. A palpable tension hangs in the air, as whispers of international conflict creep into discussions, overshadowed by the flickering glow of the fireplace.

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
- Class indicators: Ari
[truncated for prompt budget]

NON-NEGOTIABLE CHAPTER OBLIGATIONS — LOCKED EVIDENCE PHRASES (VERBATIM REQUIRED):
The following physical evidence values are absolute ground truth. Every time this chapter describes, mentions, or alludes to the relevant evidence — no matter how briefly — it MUST use the exact phrase shown below, character for character. NO paraphrase, approximation, rounding, or synonym is permitted.

FAILURE EXAMPLE: if the locked value is "at thirteen minutes to midnight" and you write "just before midnight" or "around midnight" — that is a HARD FAIL. You must write "at thirteen minutes to midnight". Equally, if the locked value is written in words, such as "ten minutes past eleven", and you convert it to figure-based clock notation — that is also a HARD FAIL. Words stay as words; figure forms are forbidden for word-phrased facts.

CRITICAL — WORD-PHRASED VALUES: If the canonical value is written out in words (e.g. a time like "ten minutes past eleven", or an amount like "forty minutes"), reproduce those exact words. DO NOT convert to figure-based time notation, twenty-four-hour format, or any other numeric shorthand. Correct: "ten minutes past eleven". WRONG: figure-based clock notation or numeric shorthand.

Locked facts:
  - The exact time shown on the stopped clock face: "ten minutes past eleven"
    ⛔ FORBIDDEN alternatives: "11:10", "11.10", "eleven ten", "eleven-ten", "eleven past ten", "quarter past eleven", "half past eleven" — the ONLY acceptable form is "ten minutes past eleven"
  - The exact amount the clock was wound back: "forty minutes"
  - The actual time of the murder, confirmed by witnesses: "twenty minutes past ten"
    ⛔ FORBIDDEN alternatives: "10:20", "10.20", "ten twenty", "ten-twenty", "ten past twenty", "quarter past ten", "half past ten" — the ONLY acceptable form is "twenty minutes past ten"

If a locked fact has no relevance to this chapter, omit it. But the moment you reference the underlying evidence, only the exact phrase above is acceptable.

⛔ CLUES TO SURFACE IN THESE CHAPTERS — mandatory:
The following evidence MUST be clearly observable to an attentive reader. Do not bury it in atmosphere or passing dialogue. Each clue must be concrete, specific, and noticeable:

• [clue_1] The clock in the study shows the hands stopped at ten minutes past eleven.
  Category: temporal | Criticality: essential | Supports inference step 1
  Points to: The time of death may be misrepresented.

For each clue above: an attentive reader should be able to find, record, and later use it to reason toward the solution.

═══ NARRATIVE STATE (read-only — do not contradict) ═══

LOCKED FACTS — use verbatim whenever this evidence is described:
  • The exact time shown on the stopped clock face: "ten minutes past eleven"
  • The exact amount the clock was wound back: "forty minutes"
  • The actual time of the murder, confirmed by witnesses: "twenty minutes past ten"

CHARACTER PRONOUNS — never deviate from these:
  • Eleanor Voss: she/her/her
  • Dr. Mallory Finch: she/her/her
  • Captain Ivor Hale: he/him/his
  • Beatrice Quill: she/her/her

INVESTIGATION LOG — WHAT IS ESTABLISHED (do not re-establish, do not repeat):
• Suspects still unresolved: Dr. Mallory Finch[SHE], Captain Ivor Hale[HE]
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
Known location profile anchors: Ashwood Manor, The Library, The Drawing Room, The Servants' Hall, the study
LOCATION NAME CAPITALISATION (HARD REQUIREMENT — validated):
All named locations in your prose MUST use the EXACT capitalisation from the CML profiles.
Canonical forms: "Ashwood Manor", "The Library", "The Drawing Room", "The Servants' Hall", "the study"
Writing a location in lowercase (e.g. "drawing room" instead of "Drawing Room") is a validated error. Every time you mention a named location, copy its capitalisation from the list above.
- Chapter 1: OPENING STYLE (HARD): Start the VERY FIRST SENTENCE with a named character performing a physical action or motion — e.g. "[Name] crossed the threshold…" / "[Name] set down the glass…" / "[Name] rose from the chair…". Anchor opening in "the study". HARD REQUIREMENT for the first 2 paragraphs: (a) include 2+ sensory words — choose from smell/scent/sound/echo/silence/creak/whisper/cold/warm/damp/rough/smooth/glow/shadow/flicker/dim — and (b) include 1+ atmosphere/time word — choose from rain/wind/fog/storm/mist/thunder/evening/morning/night/dawn/dusk/season/afternoon/midday/noon/midnight/twilight/sunrise/sunset/daylight/sunlight/overcast/cloudy/bright/dark. These are validated requirements, not style suggestions; missing them triggers a retry.

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

PROMPT BUDGET SUMMARY: budget=32000 tokens; fixed=5338; context=9683; dropped=[none]; truncated=[temporal_context, pronoun_accuracy]

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
4. Integrate at least two concrete era-grounded details per chapter from setting refinement signals: petrol touring cars on county roads | domestic telephones with party-line systems | typewriters in common use | telegrams for urgent messages | aerial mail services for faster delivery | telephone exchanges connecting rural areas.
5. Respect setting movement/access constraints in scene action and alibis: grand staircases limiting access to upper floors | locked study containing vital clues | extensive gardens providing both cover and isolation | restricted areas such as the library and cellar | staff schedules dictating access to certain rooms.
6. Sustain social coherence with this backdrop pressure: A gathering at a country house estate for a wealthy benefactor's will reading strains social ties amid economic hardship and rising political tensions, forcing guests to confront their shared vulnerabilities.
7. Maintain continuity around these socially central cast anchors where relevant: Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill.
8. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Critical: Plot similarity 0.75 with 'The Mysterious Affair at Styles' (same mechanical tampering method and false assumption about timing)
9. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Moderate: Character similarity 0.60 with 'The Mysterious Affair at Styles' (similar character roles and dynamics)

CRITICAL PROSE REQUIREMENTS:

The CML specifies exact requirements for certain validation-critical scenes. You MUST include these elements at the specified positions.

**Discriminating Test Scene (Act 3, Scene 4):**
Required elements: Execute the discriminating test., Observe the clock's winding mechanism., Draw conclusion about Hale's guilt.
Test type: trap

**Suspect Clearance Scenes:**
- Eleanor Voss (Act 3, Scene 5): Confirmed presence in the library during the time of the murder.
  Clues: clue_1, clue_2
- Dr. Mallory Finch (Act 3, Scene 5): Hospital records prove her alibi.
  Clues: clue_1, clue_2
- Captain Ivor Hale (Act 3, Scene 5): Alibi confirmed: 7:30 PM to 9:00 PM
  Clues: clue_3

**Culprit Revelation Scene (Act 3, Scene 6):**
Method: Confrontation with evidence of clock tampering.

**Clue Placement for These Chapters:**
- clue_1 must appear in Act 1, Scene 1 via Direct observation of the clock.

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
  - Scene is set in: the study — reference it naturally within the paragraph, never as your opening phrase.
  - Opening atmosphere (MANDATORY — validator enforced): the first paragraph MUST contain at least one of: rain / wind / fog / storm / mist / thunder / evening / morning / night / dawn / dusk / season / afternoon / midday / noon / midnight / twilight / sunrise / sunset / daylight / sunlight / overcast / cloudy / bright / dark / grey / pale / cold / warm / chill / crisp / damp / drizzle / haze / lamplight / firelight. A chapter that omits all of these from its opening paragraph will be rejected.
  - INVESTIGATOR ESTABLISHMENT REQUIRED: Beatrice Quill must claim or be recognised as the investigator in this chapter. Establish Beatrice Quill as the detective-in-charge within the first two paragraphs — Beatrice Quill IS the investigator. Do NOT have any character suggest a "real" detective is still coming, or imply that authority has not yet been delegated. Beatrice Quill begins the investigation in this chapter.
  - CLUE OBLIGATIONS — mandatory prose elements (do NOT omit or bury):
    • The clock in the study shows the hands stopped at ten minutes past eleven. [clue_1] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: The time of death may be misrepresented.
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
  - ALIBI LOCK: Eleanor Voss's established alibi is "8:00 PM to 9:00 PM". Do NOT place Eleanor Voss at any other location or in any other activity during the crime window. Any contradiction is a continuity error that triggers a retry.
- Locked fact phrase obligations:
  - If this batch mentions The exact time shown on the stopped clock face, write exactly: "ten minutes past eleven".
  - If this batch mentions The exact amount the clock was wound back, write exactly: "forty minutes".
  - If this batch mentions The actual time of the murder, confirmed by witnesses, write exactly: "twenty minutes past ten".
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
- Established timeline fact: Dinner started at 8:00 PM
- Established timeline fact: Victim's body found at 9:00 PM
- If referenced, use exact phrase: "ten minutes past eleven" (The exact time shown on the stopped clock face).
- If referenced, use exact phrase: "forty minutes" (The exact amount the clock was wound back).
- If referenced, use exact phrase: "twenty minutes past ten" (The actual time of the murder, confirmed by witnesses).

STORY TO DATE (REFERENCE ONLY — DO NOT COPY VERBATIM):
- No previous chapter text exists yet for this batch.

[SCENE COMPLETENESS CONTRACTS — MANDATORY. Each contract below lists what you MUST enact in that chapter. Do not summarise or mention these labels in the prose — enact them organically.]
Chapter 1 (Act 1) completeness contract:
  PIVOT ELEMENT (MANDATORY — write this into the prose, shown not told): "The stopped clock showing ten minutes past eleven."
  FACT ESTABLISHED (MANDATORY — reader must know this by chapter end): "Establishes the victim died no later than eleven past eleven, contradicting three suspects' alibis."

# Case Overview
Title: The Clockwork Conspiracy
Era: 1930s
Setting: Little Middleton, Yorkshire
Crime: murder (mechanical tampering)
Culprit: Eleanor Voss
False assumption: The murder occurred during dinner, as all witnesses clearly remember the clock striking eight.
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
    "sceneNumber": 1,
    "act": 1,
    "title": "Discovery",
    "setting": {
      "location": "the study",
      "timeOfDay": "Morning after the murder",
      "atmosphere": "Tense household awaiting the detective's arrival"
    },
    "characters": [
      "Beatrice Quill",
      "Eleanor Voss"
    ],
    "purpose": "Introduce the crime and detective",
    "cluesRevealed": [
      "clue_1"
    ],
    "dramaticElements": {
      "conflict": "The household is in disarray as the body is discovered.",
      "tension": "The clock's stopped hands add to the mystery of the time of death.",
      "microMomentBeats": [
        "Eleanor stares at the clock, her face pale with shock."
      ]
    },
    "summary": "In the dim light of the study, Eleanor Voss discovers the victim's lifeless body. The clock on the wall shows ten minutes past eleven, casting doubt on the timeline of the murder. Beatrice Quill, a guest at the house, steps forward to investigate.",
    "estimatedWordCount": 1800,
    "pivotElement": "The stopped clock showing ten minutes past eleven.",
    "factEstablished": "Establishes the victim died no later than eleven past eleven, contradicting three suspects' alibis.",
    "permittedBehavioursByAct": [
      {
        "characterName": "Eleanor Voss",
        "behaviour": "Show normal social behaviour; grief or confusion if appropriate."
      },
      {
        "characterName": "Beatrice Quill",
        "behaviour": "Show normal social behaviour; grief or confusion if appropriate."
      }
    ],
    "redHerringPlacement": null,
    "emotionalRegister": "The atmosphere is thick with anticipation and dread as the guests gather for the will reading.",
    "dominantCharacterNote": {
      "name": "Eleanor Voss",
      "voiceRegister": "Eleanor speaks with a measured cadence, her words laced with irony and charm."
    },
    "humourGuidance": {
      "permission": "forbidden"
    },
    "eraTextureNote": "Limited daylight hours with the sun barely rising before eight; Chilly temperatures requiring indoor gatherings for warmth; Communication through domestic telephones with party-line systems",
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
□ Chapter 1: "The clock in the study shows the hands stopped at ten minutes past eleven." is placed in the first 25% of the chapter, followed by an explicit inference or suspicion paragraph.
□ PRONOUN AUDIT — for every character you named in your chapters, list the pronouns you actually used, then verify against the canonical table. Correct any mismatch before outputting. Do NOT include this audit in your JSON output.
  Character            | Canonical     | Used in draft | Match?
  ---------------------|---------------|---------------|-------
  Eleanor Voss         | she/her/her/herself       | [fill in]     | [yes/no]
  Dr. Mallory Finch    | she/her/her/herself       | [fill in]     | [yes/no]
  Captain Ivor Hale    | he/him/his/himself        | [fill in]     | [yes/no]
  Beatrice Quill       | she/her/her/herself       | [fill in]     | [yes/no]
□ Return valid JSON only.
```
