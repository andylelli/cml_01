# Actual Prompt Record

- Run ID: `mystery-1778960914107`
- Project ID: ``
- Timestamp: `2026-05-16T19:52:26.365Z`
- Agent: `Agent9-ProseGenerator-Ch2`
- Operation: `chat_request_full_prompt`
- Model: `GPT-4o-mini`
- Temperature: `0.42`
- Max Tokens: `4500`
- Attempt: `first`
- Prompt Hash: `85247f42d9cb88fc`

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
- MORAL COMPLEXITY REQUIREMENT: The mechanism of this crime carries a moral gray area: "The murderer acted out of desperation to protect a loved one, sparking sympathy despite the crime." — the culprit reveal and denouement MUST acknowledge this ambiguity. Do not let the ending feel clean or simple. Give the reader at least one moment of uncomfortable sympathy or moral doubt.


⚠️ AMATEUR DETECTIVE STORY: The investigator is a civilian with no official standing. The official police (if they appear) are unnamed background figures only — "a constable", "the sergeant", "an officer from the village". Do NOT give any police official a name or title+surname combination. There is no Inspector [Surname], no Constable [Surname], no Sergeant [Surname] in this story.

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

## Era: 1930-07
July 1930 brings a palpable tension to the English countryside, where the lush landscapes are overshadowed by the oppressive weight of economic hardship. The Great Depression has gripped the nation, leading to increasing unemployment and a growing sense of unrest among the populace. In Little Middleton, the residents navigate the precarious balance of social status and financial strain, where the elite hold onto their traditions even as their influence wanes. The summer days are long, but the clouds often obscure the sun, mirroring the uncertainty that permeates daily life. Gatherings at the manor serve as a facade of elegance, yet beneath the surface lies a simmering discontent fueled by class disparities and the looming threat of political change. Guests at the manor may don their finest attire, but the reality of their circumstances weighs heavily on their minds, reminding them that the idyllic summer is tainted by the specter of societal collapse.
Emotional register: A collective anxiety looms, characterized by uncertainty and fear for the future.
Physical constraints: Limited transportation options due to economic hardship | Communications hindered by the lack of modern technology | Strict social etiquette restricting interactions | Physical distance from nearby towns exacerbating isolation
Current tensions (weave into background texture): Economic pressures from the Great Depression | Increasing unemployment rates affecting all classes | Social unrest and strikes by the working class
Wartime context — No major wars are ongoing, but the memories of WWI still resonate, underscoring the fragility of peace.: Communities are divided by class, with the elite clinging to their status amidst rising discontent from the working class. Absence effect: The absence of soldiers from the previous war weighs on social dynamics, as families grapple with loss and the lingering trauma of conflict.

## Story Theme
In the midst of societal upheaval, the quest for truth unravels personal secrets, revealing that the past can shape and shatter lives, and reveals that evidence carries ethical weight, forcing characters to choose accountability over social performance when appearances and facts collide.

## Story Emotional Register
Dominant: The emotional journey is marked by tension, intrigue, and the quest for truth amidst personal turmoil.

Arc:
The story begins in the grand yet oppressive atmosphere of Little Middleton Manor, where Eleanor Voss is discovered dead in her study, casting a shadow over the social gathering. The initial shock and disbelief ripple through the guests, who are forced to confront the reality of the crime amidst their elegant facades. As the investigation unfolds, rising unease permeates the air, with each clue leading the characters deeper into a web of secrets, and every revelation carries an emotional toll. The first investigative turn reveals the clock's tampering, suggesting a calculated plan to mislead, and the emotional cost weighs heavily on Eleanor’s friends as they grapple with their own pasts. A mid-story pivot occurs when Dr.

Finch's connection to the victim comes to light, shifting the focus of suspicion and igniting a personal conflict within her. The second turn comes when the coroner's report contradicts the clock's readings, revealing a chilling truth that redefines earlier events and relationships. As pressure mounts, the climax sees a confrontation that exposes not only the murderer but also the hidden desires and regrets of those involved. In the resolution, the emotional costs are laid bare, as each character comes to terms with their actions and the consequences of their choices, illustrating how the past can haunt the present and shape the future. The end carries a melancholic weight, leaving the characters to ponder the fragile nature of truth and connection amidst the social fabric of their lives.

## Emotional register at this point in the story
A sense of grandeur is overshadowed by the impending tragedy.

## Character Portraits (appearance & era)

### Eleanor Voss
Eleanor Voss embodies the elegant yet precarious reality of the upper-class women in 1930s England. Torn between her social responsibilities and her personal turmoil, she navigates the complexities of friendship, love, and justice against the backdrop of a society in upheaval. Eleanor’s plight to prove herself as a capable investigator reflects the broader struggle of women seeking independence in an era defined by traditional roles.
Era intersection: Her anxiety about reputation and desire for justice intertwine with the societal expectations of women during this tumultuous time.

### Dr. Mallory Finch
Dr. Mallory Finch represents the pressure of maintaining professional integrity in a time of economic hardship. As a physician, she is expected to uphold high moral standards while grappling with personal feelings for the victim. Her financial struggles due to the Great Depression echo the broader tensions faced by many in her profession, where ethics clash with survival.
Era intersection: Her financial struggles and past connection with the victim highlight the precarious balance between personal and professional obligations in an economically strained society.

### Captain Ivor Hale
Captain Ivor Hale embodies the conflict between honor and personal desire, navigating the expectations of military life against his past affair with the victim. His charm and charisma mask deep-seated fears of exposure, reflecting the societal pressures on men to maintain their reputations amidst rising social tensions. Hale’s internal struggle mirrors the struggle of many men facing the consequences of their actions in a rapidly changing world.
Era intersection: His discontent with military life and fear of scandal reflect the pressures faced by men of his status in an era defined by uncertainty and social upheaval.

### Beatrice Quill
Beatrice Quill represents the ambitious journalist navigating the ethical complexities of her profession in a time when the truth can be both powerful and dangerous. Her desire to expose the wealthy elite reveals the growing tensions between classes and the role of journalism in holding power accountable. Beatrice’s struggle between ambition and morality encapsulates the challenges faced by women seeking to carve their own paths in a restrictive society.
Era intersection: Her quest for a significant story amidst economic strain underscores the complexities of ambition and ethics in a society rife with class disparities.

## Character Voices

### Eleanor Voss (she/her/her)
Eleanor speaks with a refined cadence, often punctuating her sentences with a subtle, knowing smile.
[comfortable] It's rather amusing how the most scandalous events unfold in the quietest corners of our lives.
[evasive] One could say I've been busy with... other matters, quite unrelated to the current situation.
[stressed] I simply cannot allow this to tarnish my reputation—there's too much at stake.
Humour: Her dry wit often adds a layer of sophistication to her dialogue.

### Dr. Mallory Finch (she/her/her)
Dr. Finch's voice is calm and measured, often employing medical terminology balanced with a touch of dry humor.
[comfortable] One must appreciate the irony of life; it's often the unexpected that proves most enlightening.
[evasive] I assure you, my focus is entirely on my patients, nothing else.
[stressed] This could ruin everything I've worked for; I cannot let that happen!
Humour: Her polite savagery brings a unique flavor to her interactions.

### Captain Ivor Hale (he/him/his)
Hale speaks with confident swagger, often punctuating his sentences with a wry smile.
[comfortable] Ah, the thrill of the chase—there's nothing quite like it, is there?
[evasive] Let's just say my evening was spent in good company, nothing more.
[stressed] I can't be associated with this; my career is on the line!
Humour: His sardonic humor often deflects serious subjects with a chuckle.

### Beatrice Quill (she/her/her)
Beatrice speaks with rapid-fire delivery, often interjecting with sharp quips.
[comfortable] In journalism, the truth is often stranger than fiction—trust me.
[evasive] My sources are confidential, and I intend to keep it that way.
[stressed] This story could make or break my career; I can't afford to mess it up!
Humour: Her blunt humor adds a layer of tension in her interactions.

## Location Registers (scene framing guides)

The Library: The library feels like a sanctuary turned tomb, where the quiet whispers of knowledge are now overshadowed by the horror of recent events. Shadows cling to the corners, and the air is thick with the scent of aged books and the lingering warmth of a fire, creating an atmosphere steeped in tension and unease, as every detail could hold the key to the truth.. Camera angle: A writer entering this space might feel the weight of secrets pressing in from all sides, urging them to uncover the hidden truths within.. Era: In the 1930s, this space becomes a stark reminder of the fragility of life amidst the economic turmoil.

The Drawing Room: The drawing room is a facade of elegance and charm, where laughter and chatter mask the underlying tensions of the gathering. Ornate decor and plush furnishings create a sense of comfort, yet the air is thick with unspoken concerns, as every smile hides a secret and every toast carries the weight of suspicion.. Camera angle: A writer might capture the contrast between the room's beauty and the darkness lurking beneath the surface.. Era: The social hierarchy of the 1930s is palpable here, with class distinctions dictating interactions.

The Servants' Quarters: The Servants' Quarters feel like a world apart, a modest haven where the staff share camaraderie amid the looming shadows of their roles. The sounds of muffled conversations and the scent of cooked meals create a sense of warmth, yet the undercurrent of tension reminds them of their place in the household hierarchy and the secrets they bear.. Camera angle: A writer entering here might observe the contrasts between the lively spirit of the staff and the oppressive atmosphere elsewhere in the manor.. Era: In the 1930s, this space reflects the growing class disparities and the struggles of those who serve.

The Grand Entrance Hall: The Grand Entrance Hall is grand yet foreboding, with its high ceilings and ornate decor echoing the wealth of the manor. The echoes of footsteps and soft whispers create an atmosphere of anticipation, hinting at the secrets and lies that lie just beyond the surface of this opulent facade.. Camera angle: A writer might emphasize the grandeur of the hall while capturing the tension lurking in the corners.. Era: This space embodies the strict social hierarchies of the 1930s, where class and status dictate every interaction.

## Humour guidance for this story position (opening)
Permission: forbidden
Rationale: The initial atmosphere is too somber to allow for humor.

FAIR-PLAY AND INFERENCE CONTRACT (from CML logic):
- False assumption in force: The murder occurred at the time indicated by the clock.
- Hidden truth to progressively expose: The clock was deliberately manipulated to mislead the investigation.
- Inference path checkpoints to dramatize clearly (observation -> correction -> effect):
  - Step 1: obs: The clock in the study shows a time of eleven o'clock when found. | corr: This indicates the clock was tampered with to show the wrong time. | effect: Narrows the time of death window to before eleven o'clock, eliminating Beatrice Quill as she was seen in the garden at that time.
  - Step 2: obs: Witnesses heard the clock striking irregularly at ten minutes to eleven. | corr: This suggests the clock's mechanism was manipulated prior to the murder. | effect: Eliminates the possibility of accidental timing discrepancy, narrowing focus to Dr. Mallory Finch.
  - Step 3: obs: A tool was found near the clock that matches Dr. Mallory Finch's work tools. | corr: This implicates Dr. Finch as the one who tampered with the clock. | effect: Directly links Dr. Mallory Finch to the tampering and consequently the murder.
- Discriminating test method: trap
- Discriminating test design constraint: A reenactment of the clock's function is conducted to compare the supposed time of death with the actual time indicated by the clock, revealing the tampering.
- Test must rely on already-shown clue IDs: clue_1, clue_2, clue_3, clue_mechanism_visibility_core
- Fair-play rationale: Step 1: The clock's incorrect time and witness statements allow readers to identify the time of death. Step 2: Witness accounts of the clock striking improperly lend credibility to the tampering theory. Step 3: The tool found matching Dr. Finch's tools leads to direct implication.
- Never solve by withheld information. Keep reader-information parity with detective reasoning.

## Character Reference

### Eleanor Voss (she/her — NEVER he/him)
Eleanor speaks with a refined cadence, often punctuating her sentences with a subtle, knowing smile
She enjoys clever wordplay and has a tendency to use slightly archaic expressions that reflect her upbringing.
Eleanor is torn between her desire to prove herself as a capable investigator and her romantic feelings for Captain Hale, complicating her judgment and fueling her insecurities.

### Dr. Mallory Finch (she/her — NEVER he/him)
Finch speaks with a calm, measured tone, often employing medical terminology that she balances with a touch of dry humor
She has a habit of raising an eyebrow when skeptical and uses her wit to diffuse tension.
Dr. Finch grapples with unresolved feelings for the victim and the ethical implications of her past love, torn between her affection and her professional duty to uphold the integrity of medicine.

### Captain Ivor Hale (he/him — NEVER she/her)
Hale speaks with a confident swagger, often punctuating his sentences with a wry smile
He has a penchant for dry humor and a tendency to deflect serious topics with a chuckle.
Hale is torn between his regret over the affair and his burgeoning feelings for Eleanor, fearing that his past could jeopardize any chance of a future with her.

### Beatrice Quill (she/her — NEVER he/him)
Beatrice speaks with a rapid-fire delivery, often interjecting with sharp quips
Her language is direct, unfiltered, and she has a habit of using sarcasm to make her points.
Beatrice struggles with the ethics of her ambition, torn between her desire for success and the potential harm her exposé could cause to those involved, including the victim.


## CHARACTER CONTRACTS (binding for this scene)
Each entry below constrains how this character must be written in this chapter.
These override generic style guidance when they conflict.

### Eleanor Voss
Voice & mannerisms: Eleanor speaks with a refined cadence, often punctuating her sentences with a subtle, knowing smile. She enjoys clever wordplay and has a tendency to use slightly archaic expressions that reflect her upbringing.
Sample voice fragments (match this register and rhythm):
  [comfortable] "It's rather amusing how the most scandalous events unfold in the quietest corners of our lives."
  [evasive] "One could say I've been busy with... other matters, quite unrelated to the current situation."
Humour: dry wit — deploy occasionally (level 0.5)
FORBIDDEN phrase (never write for Eleanor Voss): "a surge of determination washed over her"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Eleanor is drawn to uncover the truth due to her deep connection with the victim, who confided in her about threats in the days leading up to the tragedy." — do not surface in Act I.

### Dr. Mallory Finch
Voice & mannerisms: Dr. Finch speaks with a calm, measured tone, often employing medical terminology that she balances with a touch of dry humor. She has a habit of raising an eyebrow when skeptical and uses her wit to diffuse tension.
Sample voice fragments (match this register and rhythm):
  [comfortable] "One must appreciate the irony of life; it's often the unexpected that proves most enlightening."
  [evasive] "I assure you, my focus is entirely on my patients, nothing else."
Humour: polite savagery — deploy occasionally (level 0.4)
FORBIDDEN phrase (never write for Dr. Mallory Finch): "she felt a wave of unease"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Dr. Finch felt betrayed when she learned that the victim was involved in unethical medical practices, a revelation that shook her faith in the profession she loved." — do not surface in Act I.

### Captain Ivor Hale
Voice & mannerisms: Hale speaks with a confident swagger, often punctuating his sentences with a wry smile. He has a penchant for dry humor and a tendency to deflect serious topics with a chuckle.
Sample voice fragments (match this register and rhythm):
  [comfortable] "Ah, the thrill of the chase—there's nothing quite like it, is there?"
  [evasive] "Let's just say my evening was spent in good company, nothing more."
Humour: sardonic — deploy occasionally (level 0.6)
FORBIDDEN phrase (never write for Captain Ivor Hale): "palpable tension filled the room"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Hale feared the victim would expose their affair, jeopardizing his military career and tarnishing the reputation he worked so hard to build." — do not surface in Act I.

### Beatrice Quill
Voice & mannerisms: Beatrice speaks with a rapid-fire delivery, often interjecting with sharp quips. Her language is direct, unfiltered, and she has a habit of using sarcasm to make her points.
Sample voice fragments (match this register and rhythm):
  [comfortable] "In journalism, the truth is often stranger than fiction—trust me."
  [evasive] "My sources are confidential, and I intend to keep it that way."
Humour: blunt — deploy frequently (level 0.7)
FORBIDDEN phrase (never write for Beatrice Quill): "she chose her words with great care"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Beatrice wanted to expose the victim’s shady dealings for personal gain, believing that the truth could elevate her career to new heights." — do not surface in Act I.



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
A grand manor house steeped in secrets, surrounded by meticulously manicured gardens and the shadow of social unrest.

Key Locations Available:
- The Library (interior): Crime scene
- The Drawing Room (interior): Gathering space
- The Servants' Quarters (interior): Living space for staff
- The Grand Entrance Hall (interior): Welcoming area for guests

Atmosphere: tension-filled due to recent social unrest and economic strain
Weather: overcast with intermittent rain, typical of the British countryside

Era markers: Typewriters clacking in the study | Household radios broadcasting news updates | Heavy automobiles parked in the courtyard

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
  - Visual: dust motes dancing in candlelight, books stacked haphazardly, a single chair out of place
  - Sounds: the crackle of a fire, the rustle of pages turning, a distant clock ticking
  - Scents: old leather and musty pages, smoky wood from the fireplace, damp stone
  - Touch: cool leather of the armchair, smooth wood of the table

The Drawing Room (interior):
  - Visual: lavishly patterned wallpaper, crystal chandelier casting light, elegant floral arrangements
  - Sounds: soft laughter and chatter, the clinking of teacups, the rustle of silk dresses
  - Scents: freshly cut flowers, polished wood, a hint of tobacco smoke
  - Touch: soft velvet upholstery, cool porcelain of teacups

The Servants' Quarters (interior):
  - Visual: plain wooden furniture, faded wallpaper, a communal table
  - Sounds: muffled conversations, footsteps on wooden floors, the clatter of dishes
  - Scents: cooked vegetables, clean linen, the faint scent of coal
  - Touch: coarse blankets on narrow beds, smooth wood of the table

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

- July 1930 brings a palpable tension to the English countryside, where the lush landscapes are overshadowed by the oppressive weight of economic hardship
- The Great Depression has gripped the nation, leading to increasing unemployment and a growing sense of unrest among the populace
- In Little Middleton, the residents navigate the precarious balance of social status and financial strain, where the elite hold onto their traditions even as their influence wanes
- The summer days are long, but the clouds often obscure the sun, mirroring the uncertainty that permeates daily life
- Gatherings at the manor serve as a facade of elegance, yet beneath the surface lies a simmering discontent fueled by class disparities and the looming threat of political change

TEMPORAL CONTEXT:

This story takes place in July 1930 during summer.

Seasonal Atmosphere:
- Weather patterns: overcast with intermittent rain, cool breezes, humid air
- Daylight: Long summer days, with daylight lingering until nearly ten o'clock at night, but often obscured by clouds.
- Seasonal activities: garden parties under large marquees, evening strolls through manicured gardens, fox hunting in the early morning
- Season: summer

Period Fashion (describe naturally):
- Men formal: tailored three-piece suits in lightweight fabrics, bowler hats, polished leather shoes
- Men casual: linen trousers, short-sleeved cotton shirts, straw boater hats
- Men accessories: silk cravats, pocket watches, cufflinks
- Women formal: knee-length dresses with drop waists, cloche hats adorned with ribbons, beaded evening bags
- Women casual: floral print tea dresses, cardigans for cooler evenings, canvas shoes
- Women accessories: string of pearls, wide-brimmed sun hats, stylish gloves

Cultural Context (reference naturally):
- Music/entertainment: 'My Heart Stood Still' by Richard Rodgers, 'Ain't She Sweet' by Milton Ager, jazz bands gaining popularity; Films: 'The Love Parade' featuring Maurice Chevalier, 'The Blue Angel' with Marlene Dietrich; Theatre: 'The Front Page' by Ben Hecht, 'Rope' by Patrick Hamilton; Radio: BBC broadcasts of news and entertainment, variety shows gaining traction
- Typical prices: loaf of bread: four pence, week's rent for a modest flat: ten shillings, movie ticket: one shilling
- Current events: ongoing effects of the Great Depression; increase in unemployment rates
- Literature: 'Murder in the Mews' by Agatha Christie | 'The Maltese Falcon' by Dashiell Hammett | 'To the Lighthouse' by Virginia Woolf | [mystery and detective fiction] | [social realism] | [modernist literature]
- Technology: the electric iron | the modern refrigerator | early versions of the vacuum cleaner | household radios | typewriters in offices | telephones increasingly in homes
- Daily life: visiting local markets, attending summer fairs, going for picnics in the countryside
- Social rituals: afternoon tea served in gardens, weekly church services, family gatherings for Sunday dinner

Atmospheric Details:
The air thick with humidity, punctuated by the distant rumble of thunder, as dark clouds rolled across the sky. The scent of freshly cut grass mingled with the earthy aroma of rain-soaked soil, creating a palpable tension in the atmosphere. Distant sounds of laughter and clinking glasses echoed from the estate's terrace, masking the undercurrents of unease that gripped the gathering.

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
- Class indicators: Aristocrats discuss opera, servants di
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

• [clue_fp_contradiction_step_2] Witnesses heard the clock striking irregularly at ten minutes to eleven.
  Category: temporal | Criticality: essential | Supports inference step 2
  Points to: This suggests the clock's mechanism was manipulated prior to the murder.

• [clue_core_contradiction_chain] Cross-check contradiction
  Category: structural | Placement: early (Act 1)
  Points to: what this observation reveals about the time or circumstances of the crime.

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

CLUES ALREADY REVEALED TO READER: clue_1 — do not reveal these as new information.

INVESTIGATION LOG — WHAT IS ESTABLISHED (do not re-establish, do not repeat):
• Evidence in reader's hands: The clock in the study shows a time of eleven o'clock when found.
• Suspects still unresolved: Eleanor Voss, Captain Ivor Hale, Beatrice Quill
⚠ The story must move FORWARD from this log. Any beat already listed above is forbidden from repeating.

⚠ THIS CHAPTER'S REQUIRED ADVANCE (opening): Discover the body, confirm the victim, note the stopped clock

CONTINUITY HANDOFF — previous chapter closing beat:
  • "Eleanor rose to her feet, determination igniting within her. "We need to investigate this further. There are too many unanswered questions, and I refuse to let Eleanor’s death go unpunished," she declared, her voice firm despite the tremor of fear beneath. Dr...."
  • The next chapter must open as a continuation of this beat, not as a disconnected reset.
═══════════════════════════════════════════════════════

═══════════════════════════════════════════════════════════
📚 CONTINUITY CONTEXT - CHARACTER & SETTING CONSISTENCY
═══════════════════════════════════════════════════════════

**CRITICAL: You are writing chapters 2+. Maintain consistency with earlier chapters.**

**Character Names Used in Chapters 1-1:**
Eleanor Voss

✓ RULE: Use EXACTLY these names. Do NOT vary spelling, add titles, or introduce new forms.
✓ Example: if earlier chapters used "Clara Whitfield", keep using "Clara Whitfield" — never "Mrs. Whitfield" unless that is the character's canonical name in the list above.

**Setting Vocabulary Established in Earlier Chapters:**
study

✓ RULE: Continue using this location vocabulary. Maintain consistency with established setting type.
✓ Do NOT introduce new location types that contradict earlier chapters.

**Recent Chapter Summary (for narrative continuity):**
Chapter 1: Chapter 1: Discovery
  Events: Eleanor Voss stood frozen in the doorway of the study, her heart pounding as she took in the sight before her.

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
Known location profile anchors: Little Middleton Manor, The Library, The Drawing Room, The Servants' Quarters, The Grand Entrance Hall, the study
LOCATION NAME CAPITALISATION (HARD REQUIREMENT — validated):
All named locations in your prose MUST use the EXACT capitalisation from the CML profiles.
Canonical forms: "Little Middleton Manor", "The Library", "The Drawing Room", "The Servants' Quarters", "The Grand Entrance Hall", "the study"
Writing a location in lowercase (e.g. "drawing room" instead of "Drawing Room") is a validated error. Every time you mention a named location, copy its capitalisation from the list above.
- Chapter 2: OPENING STYLE (HARD): Start the VERY FIRST SENTENCE with spoken dialogue — e.g. '"[words]," [Name] said/asked/replied/murmured.' The opening quote must be the first character on the line. Anchor opening in "the study". HARD REQUIREMENT for the first 2 paragraphs: (a) include 2+ sensory words — choose from smell/scent/sound/echo/silence/creak/whisper/cold/warm/damp/rough/smooth/glow/shadow/flicker/dim — and (b) include 1+ atmosphere/time word — choose from rain/wind/fog/storm/mist/thunder/evening/morning/night/dawn/dusk/season/afternoon/midday/noon/midnight/twilight/sunrise/sunset/daylight/sunlight/overcast/cloudy/bright/dark. These are validated requirements, not style suggestions; missing them triggers a retry.

[⚠ INTERNAL QUALITY DIAGNOSTICS — DO NOT REPRODUCE ANY PART OF THIS SECTION IN YOUR STORY OUTPUT. These are private generator observations for your consideration only. Your narrative must read as if this section does not exist. Never include phrases from this block in character dialogue, narration, or description.]

PRIOR CHAPTER QUALITY OBSERVATIONS:
- Chapter 1 (score 86/100):
  Quality gaps noted: word density below preferred target (659/1000); scene grounding weakness
  Address in upcoming chapters: Increase chapter density with concrete investigation action and sensory-grounded beats; avoid recap-only padding. | Open next chapter with a named location anchor plus at least two sensory cues and one atmosphere marker.
[END INTERNAL DIAGNOSTICS]

PROMPT BUDGET SUMMARY: budget=32000 tokens; fixed=6565; context=11086; dropped=[none]; truncated=[pronoun_accuracy, temporal_context]

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
8. Integrate at least two concrete era-grounded details per chapter from setting refinement signals: radio broadcasting in common use | early household telephones | typewriters standard in offices | increased use of telephones | telegram services for urgent messages | airmail available for faster communication.
9. Respect setting movement/access constraints in scene action and alibis: manor layout restricts movement between rooms | formal gardens create defined outdoor spaces | weather can impede access to certain areas | restricted areas such as servants' quarters and private studies | daily routines dictate access to common areas.
10. Sustain social coherence with this backdrop pressure: A mechanical clock-tampering incident at a country estate draws together the socially stratified heirs, staff, and guests amidst the economic strain of the Great Depression and rising political tensions.
11. Maintain continuity around these socially central cast anchors where relevant: Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill.
12. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Critical: Plot similarity 0.80 with 'The Mysterious Affair at Styles' (same mechanical method and murder theme)
13. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Moderate: Character similarity 0.70 with 'The Sign of the Four' (similar cast structure and roles)
14. STORY TO DATE ANTI-COPY RULE: The STORY TO DATE section below is provided for chronological and factual reference ONLY. You MUST NOT copy, lightly rephrase, or structurally echo any sentence or paragraph from prior chapters. Every sentence in this chapter must be original prose unique to this scene. Reusing even a clause from prior chapter text will cause this attempt to fail immediately.

CRITICAL PROSE REQUIREMENTS:

The CML specifies exact requirements for certain validation-critical scenes. You MUST include these elements at the specified positions.

**Discriminating Test Scene (Act 3, Scene 4):**
Required elements: Execute the discriminating test, Observe the culprit's reaction or result, Draw conclusion about guilt
Test type: trap

**Suspect Clearance Scenes:**
- Beatrice Quill (Act 3, Scene 5): Alibi verified by witnesses in the garden at the time of death.
  Clues: clue_id_1, clue_id_2
- Captain Ivor Hale (Act 3, Scene 5): Alibi confirmed: between 9 and 10 PM

**Culprit Revelation Scene (Act 3, Scene 6):**
Method: Confrontation with evidence

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
  - Word count: Target 1250 words. Achieve this through plot events, dialogue exchanges, and physical investigation — not through atmospheric repetition or extended internal reflection. Each 200-word segment should contain at minimum one concrete story event (a discovery, a conversation exchange, a physical action or movement). Padding with atmosphere alone is not acceptable.
  - Opening: Begin with a character action, spoken line, or clock/time marker — never a location name or location-description phrase.
  - Scene is set in: the study — reference it naturally within the paragraph, never as your opening phrase.
  - Opening atmosphere (MANDATORY — validator enforced): the first paragraph MUST contain at least one of: rain / wind / fog / storm / mist / thunder / evening / morning / night / dawn / dusk / season / afternoon / midday / noon / midnight / twilight / sunrise / sunset / daylight / sunlight / overcast / cloudy / bright / dark. A chapter that omits all of these from its opening paragraph will be rejected.
  - Continuity bridge: in the first 120 words, visibly connect from the previous chapter's final beat. Carry forward one unresolved element (object, accusation, emotional pressure, or immediate physical action) from: "Eleanor rose to her feet, determination igniting within her. "We need to investigate this further. There are too many unanswered questions, and I refuse to let Eleanor’s death go unpunished," she declared, her voice firm...".
  - CLUE OBLIGATIONS — mandatory prose elements (do NOT omit or bury):
    • This indicates the clock was tampered with to show the wrong time. [clue_core_contradiction_chain] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: Overturns the assumption that the murder occurred at the time indicated by the clock.
      ↳ MANDATORY TWO-PARAGRAPH STRUCTURE (must appear in paragraphs 1 or 2 — no later):
         Paragraph 1: The POV character physically approaches or directly observes this evidence.
           The narration or dialogue explicitly states what is seen (use the exact locked phrase if one applies).
         Paragraph 2 (immediately following): The detective or POV character explicitly reasons
           about what this evidence implies — who it implicates, why it may be unreliable,
           or what inference it supports. This must be a separate full paragraph, not a sentence appended to Paragraph 1.
    • Witnesses heard the clock striking irregularly at ten minutes to eleven. [clue_fp_contradiction_step_2] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: This suggests the clock's mechanism was manipulated prior to the murder.
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
- Seasonal vocabulary allow-list: summer, summery, midsummer.
- Forbidden seasonal words: spring, autumn, winter.

FROZEN TIMELINE STATE (DO NOT ALTER):
- Timeline anchor: July (summer).
- Month, season, weather, and time-of-year language in this batch must stay compatible with summer.
- Established timeline fact: clock time
- Established timeline fact: witness statements
- If referenced, use exact time phrase: "ten minutes past eleven" (The exact time shown on the stopped clock face).
- If referenced, use exact time phrase: "forty minutes" (The exact amount the clock was wound back).

STORY TO DATE (REFERENCE ONLY — DO NOT COPY VERBATIM):
- Full prior chapter text is provided below for continuity, factual consistency, and reference accuracy.
- Use this to keep character voice, chronology, clue state, and location continuity aligned with earlier chapters.
- Do not quote, copy, or paraphrase these paragraphs too closely; write fresh prose that remains consistent with them.

--- BEGIN PRIOR CHAPTER 1 ---
Title: Chapter 1: Discovery
Eleanor Voss stood frozen in the doorway of the study, her heart pounding as she took in the sight before her. The morning light filtered through the heavy drapes, casting a muted glow over the room, yet it did little to dispel the oppressive atmosphere that hung in the air. A storm had rolled in during the night, leaving the world outside cloaked in a damp, overcast gloom. The scent of rain lingered, mingling with the musty aroma of old leather and polished wood. Eleanor's fingers tightened around the edge of her notebook, the pages crinkling beneath her grip as she hesitated, her mind racing with the implications of what lay ahead.

In the center of the room, Eleanor's gaze was drawn to the lifeless body sprawled across the floor, an elegant figure draped in a flowing dress that had once been the epitome of grace. The clock on the mantelpiece caught her attention, its hands frozen in time. The clock in the study shows a time of eleven o'clock when found. The sight sent a chill down her spine, the implications of that moment weighing heavily on her. Who could have done this? And why? The room felt like a tomb, filled with secrets waiting to be unearthed.

Eleanor stepped closer, her breath hitching in her throat as she knelt beside the body. It was Eleanor Voss, a woman known for her sharp wit and keen intellect, now silenced forever. The shock of it all threatened to overwhelm her, but she forced herself to focus. There was a mechanism at play here, one that relied on the clock to expose the false timing. The clock had been tampered with, and that detail could unravel the entire mystery. If only she could find the answers hidden within this tragedy.

Just then, the door creaked open, and Dr. Finch entered, her face pale and drawn. "Eleanor, what happened?" she gasped, her voice trembling. Captain Hale followed closely behind, his expression a mask of concern. The tension in the room thickened as the two of them took in the scene, their eyes widening in horror. Eleanor looked up, her heart racing as she met their gazes. They were all connected to the victim in some way, each harboring their own secrets and fears. The question loomed large: who among them could be capable of such a heinous act?

Dr. Finch knelt beside Eleanor, her medical training kicking in as she examined the body. "There’s nothing more to be done, is there?" she whispered, the weight of her words hanging heavily in the air. Captain Hale ran a hand through his hair, visibly shaken. "We must call for help. This is beyond us," he said, his voice steady despite the turmoil raging within. Eleanor nodded, but her mind was already racing ahead, piecing together the fragments of the puzzle. They had to act quickly; every moment counted.

As they stood there, the clock’s presence loomed over them, a silent witness to the tragedy that had unfolded. Eleanor’s thoughts raced back to the time displayed on the clock, ten minutes past eleven. The implications were dire. Establishes the victim died no later than eleven past eleven, contradicting three suspects' alibis. She glanced at Dr. Finch and Captain Hale, both of whom had been in the vicinity at the time. Could one of them be hiding something? The thought sent a shiver down her spine.

Eleanor rose to her feet, determination igniting within her. "We need to investigate this further. There are too many unanswered questions, and I refuse to let Eleanor’s death go unpunished," she declared, her voice firm despite the tremor of fear beneath. Dr. Finch and Captain Hale exchanged glances, uncertainty flickering in their expressions. They knew the stakes were high, and the truth would not come easily. But Eleanor was resolute; she would uncover the truth, no matter the cost. The clock was ticking, and time was of the essence.
--- END PRIOR CHAPTER 1 ---

[SCENE COMPLETENESS CONTRACTS — MANDATORY. Each contract below lists what you MUST enact in that chapter. Do not summarise or mention these labels in the prose — enact them organically.]
Chapter 2 (Act 1) completeness contract:
  PIVOT ELEMENT (MANDATORY — write this into the prose, shown not told): "The clock striking irregularly"
  FACT ESTABLISHED (MANDATORY — reader must know this by chapter end): "Establishes that the clock's striking pattern contradicts the assumed time of death."
  RED HERRING (MANDATORY — seed naturally, not flagged as false): [rh_2] Dr. Finch mentions the disarray in the study, suggesting a struggle took place.

# Case Overview
Title: The Clockwork Alibi
Era: 1930s
Setting: Little Middleton
Crime: murder (mechanical clock-tampering)
Culprit: Dr. Mallory Finch
False assumption: The murder occurred at the time indicated by the clock.
Cast: Eleanor Voss (she/her), Dr. Mallory Finch (she/her), Captain Ivor Hale (he/him), Beatrice Quill (she/her)

Setting Lock: Keep all scenes and descriptions consistent with the stated setting (Little Middleton). Do not introduce a different location type.

Outline scenes:
[
  {
    "sceneNumber": 2,
    "act": 1,
    "title": "Initial Reactions",
    "setting": {
      "location": "the study",
      "timeOfDay": "Morning after the murder",
      "atmosphere": "Tense and chaotic as the reality of the murder sinks in"
    },
    "characters": [
      "Eleanor Voss",
      "Dr. Mallory Finch",
      "Captain Ivor Hale",
      "Beatrice Quill"
    ],
    "purpose": "Establish suspects' reactions and initial alibis",
    "cluesRevealed": [
      "clue_fp_contradiction_step_2"
    ],
    "dramaticElements": {
      "conflict": "Suspicion among characters begins to surface",
      "tension": "Each suspect's alibi is questioned",
      "microMomentBeats": [
        "Beatrice fidgets with her gloves, avoiding eye contact with Eleanor."
      ]
    },
    "summary": "As the initial shock wears off, Eleanor questions Dr. Finch, Captain Hale, and Beatrice Quill about their whereabouts. The clock's irregular striking is mentioned, raising doubts about the exact time of death.",
    "estimatedWordCount": 1800,
    "pivotElement": "The clock striking irregularly",
    "factEstablished": "Establishes that the clock's striking pattern contradicts the assumed time of death.",
    "permittedBehavioursByAct": [
      {
        "characterName": "Eleanor Voss",
        "behaviour": "Show normal social behaviour; grief or confusion if appropriate."
      },
      {
        "characterName": "Dr. Mallory Finch",
        "behaviour": "Show normal social behaviour; grief or confusion if appropriate."
      },
      {
        "characterName": "Captain Ivor Hale",
        "behaviour": "Show normal social behaviour; grief or confusion if appropriate."
      },
      {
        "characterName": "Beatrice Quill",
        "behaviour": "Show normal social behaviour; grief or confusion if appropriate."
      }
    ],
    "redHerringPlacement": {
      "redHerringId": "rh_2",
      "placementDetail": "Dr. Finch mentions the disarray in the study, suggesting a struggle took place."
    },
    "emotionalRegister": "Rising tension as guests grapple with the shock of the murder.",
    "dominantCharacterNote": {
      "name": "Eleanor Voss",
      "voiceRegister": "Eleanor speaks with a refined cadence, often punctuating her sentences with a subtle, knowing smile."
    },
    "humourGuidance": {
      "permission": "permitted"
    },
    "eraTextureNote": "Limited transportation options due to economic hardship; Communications hindered by the lack of modern technology; Strict social etiquette restricting interactions; Physical distance from nearby towns exacerbating isolation; Weather conditions affecting outdoor activities and gatherings",
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
□ Chapter 2: "This indicates the clock was tampered with to show the wrong time." is placed in the first 25% of the chapter, followed by an explicit inference or suspicion paragraph.
□ Chapter 2: "Witnesses heard the clock striking irregularly at ten minutes to eleven." is placed in the first 25% of the chapter, followed by an explicit inference or suspicion paragraph.
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
