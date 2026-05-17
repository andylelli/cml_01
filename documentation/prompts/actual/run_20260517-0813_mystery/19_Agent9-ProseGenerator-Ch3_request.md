# Actual Prompt Record

- Run ID: `mystery-1779005591567`
- Project ID: ``
- Timestamp: `2026-05-17T08:17:52.905Z`
- Agent: `Agent9-ProseGenerator-Ch3`
- Operation: `chat_request_full_prompt`
- Model: `GPT-4o-mini`
- Temperature: `0.42`
- Max Tokens: `4500`
- Attempt: `first`
- Prompt Hash: `6107038895b4deb3`

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
- MORAL COMPLEXITY REQUIREMENT: The mechanism of this crime carries a moral gray area: "The culprit, driven by desperation, believed they were freeing themselves from a controlling relationship, evoking sympathy despite the crime." — the culprit reveal and denouement MUST acknowledge this ambiguity. Do not let the ending feel clean or simple. Give the reader at least one moment of uncomfortable sympathy or moral doubt.


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

## Era: 1936-11
Living through November 1936, individuals in England faced the lingering effects of the Great Depression, with a stark divide between the wealthy and the struggling working class. Daily life was marked by economic hardship, with families gathering indoors to escape the cold, often engaging in storytelling or listening to the radio. The anxiety of the political climate loomed large as concerns about fascism in Europe intensified, creating a sense of uncertainty about the future. Social gatherings, like the one at the manor, were fraught with tensions as the upper class sought to maintain their status amidst declining fortunes, while the working class grappled with survival.
Emotional register: A pervasive sense of anxiety and uncertainty grips the populace as they navigate the complexities of social status and looming political turmoil.
Physical constraints: Limited access to information due to the absence of modern communication technologies. | Travel restrictions due to economic hardship. | Short daylight hours leading to early evening gatherings.
Current tensions (weave into background texture): Rising tensions in Europe due to Nazi Germany's expansion. | The abdication crisis of King Edward VIII causing political unrest. | Economic struggles affecting daily life and social structures.
Wartime context — Not directly involved in active military service, but aware of rising tensions.: Communities are divided by class and status, with the upper class clinging to their fortunes. Absence effect: A lingering fear of the unknown, coupled with nostalgia for a more stable past influences social interactions.

## Story Theme
In the shadow of a murder investigation, the quest for truth unravels personal secrets amid the complexities of social expectations and familial loyalty, and reveals that evidence carries ethical weight, forcing characters to choose accountability over social performance when appearances and facts collide.

## Story Emotional Register
Dominant: The narrative unfolds with an undercurrent of tension and unease, ultimately leading to a confrontation of personal truths.

Arc:
The story begins in the opulent yet tense atmosphere of Little Middleton Manor, where the guests are gathered for a dinner party. The discovery of Eleanor Voss's body introduces a heavy weight of tragedy, setting the stage for a murder investigation steeped in secrets. As Eleanor's friends and acquaintances grapple with their own pasts, the rising unease grows palpable; the clock’s ominous ticking serves as a reminder of time slipping away and the mounting pressure of the investigation. The first investigative turn reveals clues that point toward tampering with the clock, leading the characters to question their alibis and motives. A mid-story revelation uncovers a discrepancy in the servant's log, suggesting that someone manipulated the timeline to obscure their involvement.

This second pivot shifts the investigation’s focus toward Dr. Mallory Finch, whose desperation may have driven her to commit murder. As the pressure mounts, the climax culminates in a confrontation where the truth is finally unveiled. The resolution leaves each character grappling with the emotional fallout; Eleanor's quest for truth is overshadowed by the cost of revealing family secrets, while Dr. Finch faces the consequences of her actions. The journey through this mystery emphasizes the complexity of human relationships, ambition, and the often-hidden darkness that resides beneath the surface of polite society.

## Emotional register at this point in the story
Unease grows as the body of Eleanor Voss is discovered, shattering the evening's calm.

## Character Portraits (appearance & era)

### Eleanor Voss
Eleanor Voss stands as a respected historian, but her position is precarious amidst the class tensions of the 1930s. Her commitment to uncovering the truth about the murder is complicated by her family's secrets, which may threaten her reputation. The Great Depression has also influenced her work, as funding for historical projects dwindles, leaving her to navigate her responsibilities against personal stakes.
Era intersection: Eleanor's struggle to maintain her family's reputation reflects the societal pressures of the time, where social standing is paramount amidst the economic decline.

### Dr. Mallory Finch
As a physician in Little Middleton, Dr. Mallory Finch embodies the duality of compassion and desperation. The financial strains of the Great Depression weigh heavily on her practice, and her past relationship with the victim adds layers of complexity to her character. The rising social tensions force her to confront her feelings about class and ambition while she navigates the investigation.
Era intersection: Dr. Finch's struggles with funding and professional integrity highlight the impact of economic hardship on personal relationships and societal expectations during this turbulent time.

### Captain Ivor Hale
Captain Hale's charm conceals the burdens of his gambling addiction, which threatens to unravel his family's legacy. As a former military officer, he feels the weight of societal expectations and the pressure to maintain his family's status during the socio-economic upheaval of the 1930s. His desperation to secure his daughter's future adds urgency to his actions in light of the murder investigation.
Era intersection: Hale's internal conflict mirrors the broader struggles of the era, where personal honor clashes with the harsh realities of financial instability and social hierarchy.

### Beatrice Quill
Beatrice Quill's ambition is palpable as she navigates her role within the wealthy Voss family. Her desire for inheritance drives her actions, and the murder investigation presents both a threat and an opportunity. As class tensions mount, her willingness to eliminate competition reflects the cutthroat nature of society during the Great Depression, where every advantage is crucial.
Era intersection: Beatrice's pursuit of wealth and status exemplifies the era's social dynamics, where ambition often leads to moral compromises in a world marked by economic strife.

## Character Voices

### Eleanor Voss (she/her/her)
Eleanor speaks with a measured cadence, often punctuating her sentences with historical references and an air of authority.
[comfortable] You know, the past has a way of rearing its head when you least expect it.
[evasive] I believe everyone has their reasons, but perhaps we’d best not delve too deeply.
[stressed] I can't shake the feeling that we're overlooking something crucial here.

### Dr. Mallory Finch (she/her/her)
Dr. Finch's calm tone carries an undercurrent of dry wit, often laced with medical metaphors.
[comfortable] It’s just like diagnosing a patient; sometimes, the symptoms are misleading.
[evasive] Ah, well, that's a complicated matter, one that requires careful consideration.
[stressed] I must admit, the pressure is rather overwhelming at the moment.
Humour: Her dry wit often serves to lighten the mood in tense situations.

### Captain Ivor Hale (he/him/his)
Hale's voice is commanding, with a self-deprecating humor that adds warmth to his stories.
[comfortable] I once outsmarted a storm at sea, but I can't seem to outsmart my own choices.
[evasive] Well, let’s just say that not every hero wears a cape.
[stressed] The stakes are higher than they’ve ever been, and I’m afraid of what that means.

### Beatrice Quill (she/her/her)
Beatrice's lively rhythm and playful sarcasm make her conversations engaging.
[comfortable] Oh, darling, life is but a stage, and we are merely players.
[evasive] I suppose it depends on whose side you're standing on, doesn’t it?
[stressed] I just hope this doesn’t turn into a scandal we can’t escape.
Humour: Her sardonic wit often adds a playful edge to her interactions.

## Location Registers (scene framing guides)

The Library: The library feels heavy with secrets, its shadows concealing more than they reveal. Here, every book is a reminder of the past, each dust mote a testament to time lost, creating an atmosphere thick with suspense and unanswered questions.. Camera angle: As a writer enters this space, they should feel the weight of history pressing down, urging them to uncover the truth hidden within.. Era: The somber tone of the library is amplified by the economic struggles of the era, where knowledge and history become both a refuge and a burden.

The Drawing Room: The drawing room is a stage for both civility and tension, where laughter masks the unsaid. The opulence of the space creates a stark contrast to the underlying anxieties, leaving guests on edge as they navigate the fine line between decorum and suspicion.. Camera angle: Writers entering this room should capture the duality of elegance and anxiety, reflecting the intricate dance of social interactions.. Era: The societal expectations of the 1930s amplify the tension, as class distinctions are highlighted with every polite exchange.

The Servants' Hall: The servants' hall buzzes with a blend of camaraderie and unease, where whispers of secrets and shared burdens intertwine. It serves as a reminder of the class divide, creating a space that is both a refuge and a pressure cooker of tension.. Camera angle: Writers should focus on the dynamic between staff members, capturing the unspoken alliances and the weight of their collective knowledge.. Era: The hall's simplicity stands in stark contrast to the opulence of the main house, representing the reality of the working class during the economic downturn.

The Gardens: The gardens exude a false sense of tranquility, with their vibrant blooms contrasting the dark events unfolding within the manor. They are a sanctuary for both reflection and scheming, where beauty masks deeper currents of ambition and rivalry.. Camera angle: Writers should evoke the enchanting yet foreboding atmosphere, where every flower could hold a secret.. Era: The meticulous care of the gardens reflects the upper class's desire to maintain appearances during a time of economic struggle.

## Humour guidance for this story position (early)
Permission: forbidden
Rationale: The gravity of the situation requires a focus on the unfolding mystery.

## Reveal Groundwork (texture — do not explain, only plant)
- Plant one subtle observable beat related to: "Finch’s involvement earlier scenes where she appeared calm and collected, exposing the fragility behind her facade". Do not explain significance yet.
- Plant one subtle observable beat related to: "Beatrice's anxious demeanor during the investigation suddenly takes on a new light, suggesting that her ambitions may have clouded her judgment". Do not explain significance yet.
- Plant one subtle observable beat related to: "The emphasis on the clock's tampering heightens the tension surrounding each character's alibi, revealing how deep-seated motives intertwine with their actions". Do not explain significance yet.

FAIR-PLAY AND INFERENCE CONTRACT (from CML logic):
- False assumption in force: Eleanor Voss's murder was committed after the clock showed a consistent time.
- Hidden truth to progressively expose: The clock had been deliberately wound back to mislead the time of death.
- Inference path checkpoints to dramatize clearly (observation -> correction -> effect):
  - Step 1: obs: The clock in the study was found stopped at ten minutes past eleven. | corr: This shows the clock was tampered with after Eleanor's death. | effect: Narrows the time of death to before 10:50 PM.
  - Step 2: obs: Witnesses recall hearing the clock striking at odd intervals. | corr: This suggests the clock was not functioning correctly at the time of the murder. | effect: Eliminates the reliability of the clock as evidence.
  - Step 3: obs: A discrepancy in the servant's log shows an entry exactly forty minutes after the murder. | corr: This indicates the log was altered to create a false timeline. | effect: Narrows the suspect pool to those who had access to the log.
  - Step 4: obs: Dr. Mallory Finch's alibi states he was with Eleanor until 10:30 PM. | corr: This contradicts the tampering evidence and suggests premeditation. | effect: Narrows culpability towards Dr. Mallory Finch.
- Discriminating test method: trap
- Discriminating test design constraint: A controlled comparison of the clock's striking mechanism with the time of Eleanor's death reveals the tampering.
- Test must rely on already-shown clue IDs: clue_1, clue_2, clue_3, clue_7, clue_mechanism_visibility_core, clue_core_contradiction_chain
- Fair-play rationale: Step 1: The stopped clock clue (early) and witness statements (mid) allow the reader to piece together the timing. Step 2: The servant's log discrepancy (mid) eliminates other suspects. Step 3: The controlled test on the clock (discriminating test) proves the tampering.
- Never solve by withheld information. Keep reader-information parity with detective reasoning.

## Character Reference

### Eleanor Voss (she/her — NEVER he/him)
Eleanor speaks with a measured cadence, often punctuating her sentences with historical references
She has a tendency to raise an eyebrow when she finds something particularly amusing or absurd, and her laughter is soft, rarely breaking the surface of her otherwise composed demeanor.
Eleanor grapples with the fear that uncovering the truth may expose her family's dark history, leading her to question her loyalty to her kin versus her commitment to honesty.

### Dr. Mallory Finch (she/her — NEVER he/him)
Finch speaks with a calm, measured tone, often punctuating her observations with a wry smile
She has a penchant for using medical metaphors in casual conversations, which sometimes makes her sound more clinical than intended.
Dr. Finch wrestles with feelings of jealousy and unresolved emotions from her past relationship with the victim, questioning how far she is willing to go to secure her future and whether her feelings might cloud her judgment.

### Captain Ivor Hale (he/him — NEVER she/her)
Captain Hale speaks with a commanding presence, often punctuating his stories with self-deprecating humor
He has a tendency to lean in when delivering a crucial point, his voice dropping to a conspiratorial whisper, making his audience feel as though they are sharing a secret.
Captain Hale wrestles with the guilt of his gambling addiction and the fear that his actions may jeopardize his daughter's future, leading him to question the very principles he once held dear.

### Beatrice Quill (she/her — NEVER he/him)
Beatrice speaks with a lively rhythm, often punctuating her sentences with playful sarcasm
She has a tendency to lean in closer when sharing a particularly juicy piece of gossip, her eyes sparkling with mischief.
Beatrice struggles with the morality of her ambition, torn between her desire for success and the potential consequences of her actions, leading her to question whether she is willing to cross lines she once deemed uncrossable.


## CHARACTER CONTRACTS (binding for this scene)
Each entry below constrains how this character must be written in this chapter.
These override generic style guidance when they conflict.

### Eleanor Voss[SHE]
Voice & mannerisms: Eleanor speaks with a measured cadence, often punctuating her sentences with historical references. She has a tendency to raise an eyebrow when she finds something particularly amusing or absurd, and her laughter is soft, rarely breaking the surface of her otherwise composed demeanor.
Sample voice fragments (match this register and rhythm):
  [comfortable] "You know, the past has a way of rearing its head when you least expect it."
  [evasive] "I believe everyone has their reasons, but perhaps we’d best not delve too deeply."
Humour: observational — deploy occasionally (level 0.5)
FORBIDDEN phrase (never write for Eleanor Voss): "everyone could sense the atmosphere"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Driven by a fierce curiosity about the victim's connections to a hidden inheritance, Eleanor finds herself drawn into the investigation, eager to uncover the truth that could potentially link her family to the deceased." — do not surface in Act I.

### Dr. Mallory Finch[SHE]
Voice & mannerisms: Dr. Finch speaks with a calm, measured tone, often punctuating her observations with a wry smile. She has a penchant for using medical metaphors in casual conversations, which sometimes makes her sound more clinical than intended.
Sample voice fragments (match this register and rhythm):
  [comfortable] "It’s just like diagnosing a patient; sometimes, the symptoms are misleading."
  [evasive] "Ah, well, that's a complicated matter, one that requires careful consideration."
Humour: dry wit — deploy occasionally (level 0.4)
FORBIDDEN phrase (never write for Dr. Mallory Finch): "a surge of determination washed over her"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Fear of losing the financial support from the victim's estate after their breakup looms large in Dr. Finch's mind, creating a sense of urgency to protect her practice and her livelihood." — do not surface in Act I.

### Captain Ivor Hale[HE]
Voice & mannerisms: Captain Hale speaks with a commanding presence, often punctuating his stories with self-deprecating humor. He has a tendency to lean in when delivering a crucial point, his voice dropping to a conspiratorial whisper, making his audience feel as though they are sharing a secret.
Sample voice fragments (match this register and rhythm):
  [comfortable] "I once outsmarted a storm at sea, but I can't seem to outsmart my own choices."
  [evasive] "Well, let’s just say that not every hero wears a cape."
Humour: self deprecating — deploy occasionally (level 0.6)
FORBIDDEN phrase (never write for Captain Ivor Hale): "she knew with certainty she was right"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Desperation drives Captain Hale to ensure that his daughter inherits the family manor and its wealth, as he fears the repercussions of his gambling habits will leave her with nothing." — do not surface in Act I.

### Beatrice Quill[SHE]
Voice & mannerisms: Beatrice speaks with a lively rhythm, often punctuating her sentences with playful sarcasm. She has a tendency to lean in closer when sharing a particularly juicy piece of gossip, her eyes sparkling with mischief.
Sample voice fragments (match this register and rhythm):
  [comfortable] "Oh, darling, life is but a stage, and we are merely players."
  [evasive] "I suppose it depends on whose side you're standing on, doesn’t it?"
Humour: sardonic — deploy frequently (level 0.7)
FORBIDDEN phrase (never write for Beatrice Quill): "palpable tension filled the room"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Convinced that she is the rightful heir to a significant portion of the estate, Beatrice's ambition drives her to pursue her goals with a single-minded determination." — do not surface in Act I.



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
A sprawling manor house steeped in secrets, surrounded by meticulously maintained gardens and dense woodlands, where every shadow hides a potential clue.

Key Locations Available:
- The Library (interior): Crime scene
- The Drawing Room (interior): Gathering space
- The Servants' Hall (interior): Staff gathering space
- The Gardens (exterior): Outdoor gathering space|Clue discovery

Atmosphere: Tense and foreboding, with an air of suspicion among the guests and staff.
Weather: Overcast with intermittent rain, typical of a British summer, contributing to a gloomy ambiance.

Era markers: Petrol touring cars parked in the drive | Typewriters clacking in the study | Early home telephones ringing sporadically

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
  - Visual: Flickering candlelight illuminating dust motes, Shadows cast by towering bookshelves
  - Sounds: Crackling fire in the hearth, Pages turning in the stillness
  - Scents: Beeswax and cold ash, Damp stone and old leather
  - Touch: Worn leather armchair, Chill draft from the casement

The Drawing Room (interior):
  - Visual: Silk drapes in rich burgundy, Family portraits gazing down from the walls
  - Sounds: Soft notes from the piano, Murmurs of conversation
  - Scents: Freshly polished wood, Hints of perfume in the air
  - Touch: Soft velvet upholstery, Cool marble of the fireplace

The Servants' Hall (interior):
  - Visual: Faded wallpaper peeling at the edges, Warm glow of the fireplace
  - Sounds: Clatter of dishes being washed, Low conversations among staff
  - Scents: Freshly baked bread, A hint of coal smoke
  - Touch: Worn wooden table surfaces, Cool tiles underfoot

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

- Living through November 1936, individuals in England faced the lingering effects of the Great Depression, with a stark divide between the wealthy and the struggling working class
- Daily life was marked by economic hardship, with families gathering indoors to escape the cold, often engaging in storytelling or listening to the radio
- The anxiety of the political climate loomed large as concerns about fascism in Europe intensified, creating a sense of uncertainty about the future
- Social gatherings, like the one at the manor, were fraught with tensions as the upper class sought to maintain their status amidst declining fortunes, while the working class grappled with survival.

TEMPORAL CONTEXT:

This story takes place in November 1936 during N/A.

Seasonal Atmosphere:
- Weather patterns: overcast skies, intermittent rain, chilly winds
- Daylight: Short days, with twilight descending by 4 PM, casting an early gloom over the landscape.
- Seasonal activities: hunting parties in the countryside, preparations for Christmas festivities, indoor gatherings with games and storytelling
- Seasonal occasions: Guy Fawkes Night (November 5)
- Season: N/A

Period Fashion (describe naturally):
- Men formal: tailored wool suits, frock coats, waistcoats
- Men casual: tweed jackets, corduroy trousers, knitted sweaters
- Men accessories: pocket watches, wool scarves, homburg hats
- Women formal: tea-length dresses with drop waists, faux fur stoles, long-sleeved blouses
- Women casual: tweed skirts, knitted cardigans, simple cotton blouses
- Women accessories: cloche hats, string of pearls, gloves

Cultural Context (reference naturally):
- Music/entertainment: The Ink Spots, Benny Goodman, Mills Brothers; Films: The Great Ziegfeld, The King Steps Out; Theatre: Me and My Girl, The Royal Family; Radio: The BBC Home Service, The Columbia Workshop
- Typical prices: Loaf of bread: four pence, A pint of milk: three pence, Cinema ticket: one shilling
- Current events: Increasing tensions in Europe with the rise of Nazi Germany; The abdication crisis of King Edward VIII causing political unrest
- Literature: The Maltese Falcon by Dashiell Hammett | The Glass Key by Dashiell Hammett | Gone with the Wind by Margaret Mitchell | [detective fiction] | [social realism] | [historical novels]
- Technology: the electric washing machine | the first commercial television broadcasts | improvements in automotive design | radios in most households | typewriters in offices | home telephones becoming more widespread
- Daily life: attending social clubs and dances, engaging in community events, family gatherings around the radio
- Social rituals: Sunday family dinners, afternoon tea parties, formal invitations for social events

Atmospheric Details:
The damp scent of wet earth mingled with the acrid smell of smoke from the fireplace inside the estate. The soft patter of rain against the window panes creates a rhythmic backdrop, enhancing the tension of whispered conversations. Flickering candlelight casts long shadows across the room, illuminating anxious faces during the evening's gathering.

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
1. Date references: Mention month/season at least once early in story
2. Fashion de
[truncated for prompt budget]

NON-NEGOTIABLE CHAPTER OBLIGATIONS — LOCKED EVIDENCE PHRASES (VERBATIM REQUIRED):
The following physical evidence values are absolute ground truth. Every time this chapter describes, mentions, or alludes to the relevant evidence — no matter how briefly — it MUST use the exact phrase shown below, character for character. NO paraphrase, approximation, rounding, or synonym is permitted.

FAILURE EXAMPLE: if the locked value is "at thirteen minutes to midnight" and you write "just before midnight" or "around midnight" — that is a HARD FAIL. You must write "at thirteen minutes to midnight". Equally, if the locked value is written in words, such as "ten minutes past eleven", and you convert it to figure-based clock notation — that is also a HARD FAIL. Words stay as words; figure forms are forbidden for word-phrased facts.

CRITICAL — WORD-PHRASED VALUES: If the canonical value is written out in words (e.g. a time like "ten minutes past eleven", or an amount like "forty minutes"), reproduce those exact words. DO NOT convert to figure-based time notation, twenty-four-hour format, or any other numeric shorthand. Correct: "ten minutes past eleven". WRONG: figure-based clock notation or numeric shorthand.

Locked facts:
  - The exact time shown on the stopped clock face: "ten minutes past eleven"
    ⛔ FORBIDDEN alternatives: "11:10", "11.10", "eleven ten", "eleven-ten", "eleven past ten", "quarter past eleven", "half past eleven" — the ONLY acceptable form is "ten minutes past eleven"
  - The exact amount the clock was wound back: "forty minutes"
  - The time when the clock was supposed to strike after being tampered with: "half past eleven"
    ⛔ FORBIDDEN alternatives: "11:30", "11.30", "eleven thirty", "eleven-thirty", "eleven past thirty", "quarter past eleven" — the ONLY acceptable form is "half past eleven"
  - The actual time of the murder, established through forensic evidence: "twenty minutes past ten"
    ⛔ FORBIDDEN alternatives: "10:20", "10.20", "ten twenty", "ten-twenty", "ten past twenty", "quarter past ten", "half past ten" — the ONLY acceptable form is "twenty minutes past ten"

If a locked fact has no relevance to this chapter, omit it. But the moment you reference the underlying evidence, only the exact phrase above is acceptable.

⛔ CLUES TO SURFACE IN THESE CHAPTERS — mandatory:
The following evidence MUST be clearly observable to an attentive reader. Do not bury it in atmosphere or passing dialogue. Each clue must be concrete, specific, and noticeable:

• [clue_8] The clock was last checked at ten fifteen in the evening.
  Category: temporal | Criticality: essential | Supports inference step 1
  Points to: This establishes a timeline for the events leading up to the murder.

• [clue_core_contradiction_chain] This shows the clock was tampered with after Eleanor's death.
  Category: temporal | Criticality: essential | Supports inference step 1
  Points to: This contradicts the assumption that the murder occurred after the clock stopped.

• [clue_fp_contradiction_step_2] Witnesses recall hearing the clock striking at odd intervals.
  Category: temporal | Criticality: essential | Supports inference step 2
  Points to: This suggests the clock was not functioning correctly at the time of the murder.

• [clue_mechanism_visibility_core] Direct observation
  Category: structural | Placement: early (Act 1)
  Points to: what this observation reveals about the time or circumstances of the crime.

For each clue above: an attentive reader should be able to find, record, and later use it to reason toward the solution.

═══ NARRATIVE STATE (read-only — do not contradict) ═══

LOCKED FACTS — use verbatim whenever this evidence is described:
  • The exact time shown on the stopped clock face: "ten minutes past eleven"
  • The exact amount the clock was wound back: "forty minutes"
  • The time when the clock was supposed to strike after being tampered with: "half past eleven"
  • The actual time of the murder, established through forensic evidence: "twenty minutes past ten"

CHARACTER PRONOUNS — never deviate from these:
  • Eleanor Voss: she/her/her
  • Dr. Mallory Finch: she/her/her
  • Captain Ivor Hale: he/him/his
  • Beatrice Quill: she/her/her

CLUES ALREADY REVEALED TO READER: clue_1, clue_2, clue_mechanism_visibility_core — do not reveal these as new information.

INVESTIGATION LOG — WHAT IS ESTABLISHED (do not re-establish, do not repeat):
• Evidence in reader's hands: The clock in the study was found stopped at ten minutes past eleven. | Witnesses recall hearing the clock striking at odd intervals. | The clock was wound back to create a false timeline for the murder.
• Suspects still unresolved: Eleanor Voss[SHE], Captain Ivor Hale[HE], Beatrice Quill[SHE]
⚠ The story must move FORWARD from this log. Any beat already listed above is forbidden from repeating.

⚠ THIS CHAPTER'S REQUIRED ADVANCE (early): Interview each suspect — record their claimed whereabouts

CONTINUITY HANDOFF — previous chapter closing beat:
  • "As they continued to discuss the events of the night, the rain outside intensified, a fitting backdrop for the storm brewing within the study. Each suspect's story raised more questions than answers, and the tension in the room was palpable. Hale knew that the..."
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
study, manor, drawing room

✓ RULE: Continue using this location vocabulary. Maintain consistency with established setting type.
✓ Do NOT introduce new location types that contradict earlier chapters.

**Recent Chapter Summary (for narrative continuity):**
Chapter 1: Chapter 1: Discovery
  Events: Hale's gaze was drawn to the clock mounted on the wall, its hands frozen in time.
Chapter 2: Chapter 2: Witness Statements
  Events: Hale took a deep breath, steeling himself for the task ahead.

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
Known location profile anchors: Little Middleton Manor, The Library, The Drawing Room, The Servants' Hall, The Gardens, the study
LOCATION NAME CAPITALISATION (HARD REQUIREMENT — validated):
All named locations in your prose MUST use the EXACT capitalisation from the CML profiles.
Canonical forms: "Little Middleton Manor", "The Library", "The Drawing Room", "The Servants' Hall", "The Gardens", "the study"
Writing a location in lowercase (e.g. "drawing room" instead of "Drawing Room") is a validated error. Every time you mention a named location, copy its capitalisation from the list above.
- Chapter 3: OPENING STYLE (HARD): Start the VERY FIRST SENTENCE with an explicit time marker — e.g. "At half past nine…" / "At midnight…" / "At a quarter to eleven…" / "At half past nine at night…". Time must be in the first clause. Anchor opening in "the study". HARD REQUIREMENT for the first 2 paragraphs: (a) include 2+ sensory words — choose from smell/scent/sound/echo/silence/creak/whisper/cold/warm/damp/rough/smooth/glow/shadow/flicker/dim — and (b) include 1+ atmosphere/time word — choose from rain/wind/fog/storm/mist/thunder/evening/morning/night/dawn/dusk/season/afternoon/midday/noon/midnight/twilight/sunrise/sunset/daylight/sunlight/overcast/cloudy/bright/dark. These are validated requirements, not style suggestions; missing them triggers a retry.

[⚠ INTERNAL QUALITY DIAGNOSTICS — DO NOT REPRODUCE ANY PART OF THIS SECTION IN YOUR STORY OUTPUT. These are private generator observations for your consideration only. Your narrative must read as if this section does not exist. Never include phrases from this block in character dialogue, narration, or description.]

PRIOR CHAPTER QUALITY OBSERVATIONS:
- Chapter 1 (score 89/100):
  Quality gaps noted: word density below preferred target (769/1000); scene grounding weakness
  Address in upcoming chapters: Increase chapter density with concrete investigation action and sensory-grounded beats; avoid recap-only padding. | Open next chapter with a named location anchor plus at least two sensory cues and one atmosphere marker.
- Chapter 2 (score 89/100):
  Quality gaps noted: word density below preferred target (810/1000); scene grounding weakness
  Address in upcoming chapters: Increase chapter density with concrete investigation action and sensory-grounded beats; avoid recap-only padding. | Open next chapter with a named location anchor plus at least two sensory cues and one atmosphere marker.
[END INTERNAL DIAGNOSTICS]

PROMPT BUDGET SUMMARY: budget=32000 tokens; fixed=8633; context=11733; dropped=[none]; truncated=[pronoun_accuracy, temporal_context]

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
8. Integrate at least two concrete era-grounded details per chapter from setting refinement signals: petrol touring cars on country roads | early home telephones | typewriters in administrative offices | radio sets for entertainment and news | party-line telephone exchanges in rural areas | telegrams sent via local post offices.
9. Respect setting movement/access constraints in scene action and alibis: large estate grounds create natural barriers for movement | manor's design includes restricted access areas like the library and study | weather conditions can impact outdoor evidence collection | gated entrance limiting vehicle access | staff-only areas such as the kitchen and servant quarters.
10. Sustain social coherence with this backdrop pressure: A gathering at a remote country house for a wealthy benefactor's estate review reveals underlying tensions exacerbated by the Great Depression and rising social unrest, drawing together a diverse group of guests and staff under a cloud of suspicion.
11. Maintain continuity around these socially central cast anchors where relevant: Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill.
12. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Critical: Plot similarity 0.80 with 'The Mysterious Affair at Styles' (same timing deception method and similar motive)
13. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Moderate: Setting similarity 0.90 with 'The Mysterious Affair at Styles' (same era and similar location type)
14. STORY TO DATE ANTI-COPY RULE: The STORY TO DATE section below is provided for chronological and factual reference ONLY. You MUST NOT copy, lightly rephrase, or structurally echo any sentence or paragraph from prior chapters. Every sentence in this chapter must be original prose unique to this scene. Reusing even a clause from prior chapter text will cause this attempt to fail immediately.

CRITICAL PROSE REQUIREMENTS:

The CML specifies exact requirements for certain validation-critical scenes. You MUST include these elements at the specified positions.

**Discriminating Test Scene (Act 3, Scene 4):**
Required elements: Execute the discriminating test, Observe the clock's striking mechanism, Draw conclusion about guilt

**Suspect Clearance Scenes:**
- Captain Ivor Hale (Act 3, Scene 5): Proving his alibi was verified through multiple witnesses
  Clues: clue_id_1, clue_id_2
- Beatrice Quill (Act 3, Scene 6): Demonstrating her lack of access to the clock mechanism
  Clues: clue_id_1, clue_id_2

**Culprit Revelation Scene (Act 3, Scene 7):**
Method: Confrontation with evidence

**Clue Placement for These Chapters:**
- clue_8 must appear in Act 1, Scene 3 via Direct observation
- clue_core_contradiction_chain must appear in Act 1, Scene 3 via Cross-check contradiction
- clue_fp_contradiction_step_2 must appear in Act 1, Scene 3 via Cross-check contradiction
- clue_mechanism_visibility_core must appear in Act 1, Scene 3 via Direct observation

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
- Chapter 3:
  - STRUCTURAL ARCHETYPE — Chapter 3 must be: EVIDENCE
      ✓ MUST contain: new physical clue discovered
      ✗ MUST NOT contain: formal accusation
  - Word count: Target 1250 words. Achieve this through plot events, dialogue exchanges, and physical investigation — not through atmospheric repetition or extended internal reflection. Each 200-word segment should contain at minimum one concrete story event (a discovery, a conversation exchange, a physical action or movement). Padding with atmosphere alone is not acceptable.
  - Opening: Begin with a character action, spoken line, or clock/time marker — never a location name or location-description phrase.
  - Scene is set in: the study — reference it naturally within the paragraph, never as your opening phrase.
  - Opening atmosphere (MANDATORY — validator enforced): the first paragraph MUST contain at least one of: rain / wind / fog / storm / mist / thunder / evening / morning / night / dawn / dusk / season / afternoon / midday / noon / midnight / twilight / sunrise / sunset / daylight / sunlight / overcast / cloudy / bright / dark. A chapter that omits all of these from its opening paragraph will be rejected.
  - Continuity bridge: in the first 120 words, visibly connect from the previous chapter's final beat. Carry forward one unresolved element (object, accusation, emotional pressure, or immediate physical action) from: "As they continued to discuss the events of the night, the rain outside intensified, a fitting backdrop for the storm brewing within the study. Each suspect's story raised more questions than answers, and the tension in t...".
  - CLUE OBLIGATIONS — mandatory prose elements (do NOT omit or bury):
    • The clock was last checked at ten fifteen in the evening. [clue_8] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: This establishes a timeline for the events leading up to the murder.
      ↳ MANDATORY TWO-PARAGRAPH STRUCTURE (must appear in paragraphs 1 or 2 — no later):
         Paragraph 1: The POV character physically approaches or directly observes this evidence.
           The narration or dialogue explicitly states what is seen (use the exact locked phrase if one applies).
         Paragraph 2 (immediately following): The detective or POV character explicitly reasons
           about what this evidence implies — who it implicates, why it may be unreliable,
           or what inference it supports. This must be a separate full paragraph, not a sentence appended to Paragraph 1.
    • This shows the clock was tampered with after Eleanor's death. [clue_core_contradiction_chain] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: This contradicts the assumption that the murder occurred after the clock stopped.
      ↳ MANDATORY TWO-PARAGRAPH STRUCTURE (must appear in paragraphs 1 or 2 — no later):
         Paragraph 1: The POV character physically approaches or directly observes this evidence.
           The narration or dialogue explicitly states what is seen (use the exact locked phrase if one applies).
         Paragraph 2 (immediately following): The detective or POV character explicitly reasons
           about what this evidence implies — who it implicates, why it may be unreliable,
           or what inference it supports. This must be a separate full paragraph, not a sentence appended to Paragraph 1.
    • Witnesses recall hearing the clock striking at odd intervals. [clue_fp_contradiction_step_2] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: This suggests the clock was not functioning correctly at the time of the murder.
      ↳ MANDATORY TWO-PARAGRAPH STRUCTURE (must appear in paragraphs 1 or 2 — no later):
         Paragraph 1: The POV character physically approaches or directly observes this evidence.
           The narration or dialogue explicitly states what is seen (use the exact locked phrase if one applies).
         Paragraph 2 (immediately following): The detective or POV character explicitly reasons
           about what this evidence implies — who it implicates, why it may be unreliable,
           or what inference it supports. This must be a separate full paragraph, not a sentence appended to Paragraph 1.
    • The clock was wound back to create a false timeline for the murder. [clue_mechanism_visibility_core] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: This reveals the mechanism of how the timeline was manipulated.
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
  - If this batch mentions The time when the clock was supposed to strike after being tampered with, write exactly: "half past eleven".
  - If this batch mentions The actual time of the murder, established through forensic evidence, write exactly: "twenty minutes past ten".
- Seasonal vocabulary allow-list: autumn, autumnal, fall.
- Forbidden seasonal words: spring, summer, winter.

FROZEN TIMELINE STATE (DO NOT ALTER):
- Timeline anchor: November (autumn).
- Month, season, weather, and time-of-year language in this batch must stay compatible with autumn.
- Established timeline fact: Eleanor Voss was found dead at 10:50 PM.
- Established timeline fact: The clock was checked last at 10:15 PM.
- If referenced, use exact time phrase: "ten minutes past eleven" (The exact time shown on the stopped clock face).
- If referenced, use exact time phrase: "forty minutes" (The exact amount the clock was wound back).
- If referenced, use exact time phrase: "half past eleven" (The time when the clock was supposed to strike after being tampered with).
- If referenced, use exact time phrase: "twenty minutes past ten" (The actual time of the murder, established through forensic evidence).

STORY TO DATE (REFERENCE ONLY — DO NOT COPY VERBATIM):
- Full prior chapter text is provided below for continuity, factual consistency, and reference accuracy.
- Use this to keep character voice, chronology, clue state, and location continuity aligned with earlier chapters.
- Do not quote, copy, or paraphrase these paragraphs too closely; write fresh prose that remains consistent with them.

--- BEGIN PRIOR CHAPTER 1 ---
Title: Chapter 1: Discovery
Captain Hale stood frozen in the study, the distant sound of rain tapping against the window panes creating a rhythmic backdrop to the tension that filled the room. The flickering candlelight cast shadows across the ornate furnishings, illuminating the stark reality that lay before him. Eleanor Voss, a respected historian and friend, lay lifeless on the polished wooden floor, her features eerily serene in death. The air was thick with a sense of foreboding, each breath a reminder of the tragedy that had unfolded within these walls.

Hale's gaze was drawn to the clock mounted on the wall, its hands frozen in time. The clock in the study was found stopped at ten minutes past eleven. The stillness of the clock seemed to mock the chaos surrounding them, a silent witness to the events that had transpired. He stepped closer, the chill of the room seeping into his bones as he contemplated the implications of that time. It was too late for Eleanor, but what did it mean for those who remained?

The implications of the clock’s position weighed heavily on Hale’s mind. If Eleanor had been found dead at ten minutes past eleven, it raised questions about the alibis of those present. The thought gnawed at her; it could not be mere coincidence. What had happened in the moments leading up to her death? She felt a knot tighten in her stomach as she recalled the last time she had seen her, alive and vibrant, just hours before. The clock had been ticking then, a steady reminder of the time passing, yet now it stood as a testament to the tragedy that had unfolded.

A soft voice broke through his reverie. "Captain Hale, do you think it means something?" Dr. Finch asked, her brow furrowed in concern. She stepped forward, her eyes darting between the clock and Eleanor's still form. "If it stopped at ten minutes past eleven, then..." Her voice trailed off, leaving the implication hanging in the air like a heavy fog. The weight of her words hung between them, a shared understanding of the gravity of the situation.

Hale turned to him, his expression grim. "It means he died no later than that time. We need to consider everyone’s whereabouts at that moment." She could see the tension in Dr. Finch’s posture, the way her fingers fidgeted with the edge of her blouse. It was a subtle sign of her own anxiety, and she wondered what secrets she might be hiding.

Just then, Beatrice Quill entered the study, her eyes wide with shock as she took in the scene. The vibrant colors of her tea-length dress seemed out of place against the somber backdrop of death. "What happened?" she exclaimed, her voice trembling slightly. "I heard the commotion and..." Her gaze fell on Eleanor, and she gasped, her hand flying to her mouth. "Oh, Eleanor!"

Hale stepped back, allowing Beatrice to approach the body. He could see the confusion and fear etched across her face. "We need to remain calm, Beatrice. We must think clearly. Eleanor’s death is not just a tragedy; it is a mystery that needs unraveling. We cannot let our emotions cloud our judgment." Her voice was steady, a stark contrast to the turmoil within her.

As Beatrice knelt beside Eleanor, Hale’s thoughts drifted back to the clock. Witnesses recall hearing the clock striking at odd intervals. It was a detail that could not be overlooked. If the clock had been malfunctioning, it could throw their entire understanding of the timeline into disarray. He needed to gather the facts, to piece together the events leading up to this moment. The stakes were higher than he had ever imagined, and the truth felt tantalizingly out of reach.

Dr. Finch knelt beside Beatrice, her expression a mix of sorrow and determination. "We should check the clock’s mechanism. If it was tampered with, it could change everything we think we know about the time of death," she suggested, her voice steady despite the circumstances. Hale nodded, appreciating his practicality amidst the chaos. They needed to act quickly, to gather evidence before it slipped away like the fleeting moments of Eleanor’s life.

As they prepared to examine the clock, Hale felt a surge of urgency. The clock’s hands may have stopped, but the investigation was just beginning. She glanced at Beatrice and Dr. Finch, both women grappling with their own emotions, and she knew that each of them held pieces of the puzzle. Together, they would have to confront the shadows of the past and the secrets that lay buried within the walls of the manor.
--- END PRIOR CHAPTER 1 ---

--- BEGIN PRIOR CHAPTER 2 ---
Title: Chapter 2: Witness Statements
As the rain continued to patter against the window panes, a creak from the floorboards echoed in the stillness of the study, drawing Captain Hale's attention. The air was thick with an anxious tension, a palpable reminder of the tragedy that had unfolded within these walls. He glanced at the clock, its hands frozen at ten minutes past eleven, a silent witness to the chaos that had erupted. Dr. Finch and Beatrice Quill were nearby, their expressions a mix of concern and confusion as they prepared to recount their last moments with Eleanor Voss.

Hale took a deep breath, steeling himself for the task ahead. "We must gather our thoughts and recount our actions from last night. Every detail matters now," he said, his voice steady despite the turmoil within. She turned to Dr. Finch, who stood with her arms crossed, her fingers tapping nervously against her elbow. "Dr. Finch, please start. What were you doing before you found Eleanor?"

Dr. Finch hesitated, her eyes darting to Beatrice before she spoke. "I had just left Eleanor's side. We were discussing her research on the manor's history. I believe it was shortly before ten-thirty when I decided to step outside for a breath of fresh air. I thought I heard the clock striking, but it seemed... odd, almost as if it were out of sync."

Beatrice fidgeted with her necklace, glancing nervously at the others. "I was in the drawing room, preparing for the evening's gathering. I distinctly remember hearing the clock chime, but it felt like it was striking at odd intervals. I thought perhaps it was just my imagination playing tricks on me."

Hale nodded, absorbing their words. The conflicting accounts about the clock's reliability were troubling. "Witnesses recall hearing the clock striking at odd intervals," he noted, his voice low. The implications of this detail weighed heavily on him. If the clock had been malfunctioning, it could throw their entire understanding of the timeline into disarray. What did it mean for their alibis? He needed to gather the facts, to piece together the events leading up to this moment.

Dr. Finch continued, her voice steady despite the circumstances. "If the clock was striking incorrectly, it could mean that our understanding of the time of death is flawed. We need to check the clock's mechanism to see if it was tampered with. If it was wound back, it might create a false timeline for the murder."

Hale felt a knot tighten in his stomach. The notion of tampering was alarming, but it also brought clarity. "So, if the clock was wound back, it could suggest premeditation. We need to determine how long it had been stopped and whether anyone had the opportunity to manipulate it. This could change everything."

Beatrice's eyes widened, and she took a step back. "You don't think one of us could have done that, do you? We were all here together!" Her voice trembled slightly, revealing the fear that lurked beneath her bravado.

Hale raised a hand to calm him. "We are not accusing anyone yet, Beatrice. But we must consider all possibilities. Eleanor's death is a tragedy, but it is also a mystery that needs unraveling. We cannot let our emotions cloud our judgment. Now, we need to piece together our whereabouts during the critical moments leading up to her death."

Dr. Finch nodded, her expression serious. "I remember Eleanor mentioning something about a family secret just before I left. It seemed to weigh heavily on her mind. Perhaps it was related to her research?"

Hale's mind raced. "A family secret? That could be significant. Did he mention anything specific?"

Dr. Finch shook her head. "No, she was rather vague about it. But it seemed to trouble her deeply. I thought it was just the stress of the evening, but now..." Her voice trailed off, leaving the implication hanging in the air.

Hale turned to Beatrice, who had gone pale. "What do you know about this family secret?"

Beatrice hesitated, her gaze shifting to the floor. "I... I don't know much. Just that Eleanor was worried about something related to her inheritance. She mentioned feeling trapped by her family's expectations. But I thought it was just her usual dramatics."

Hale considered this revelation, his mind racing with possibilities. "If Eleanor felt trapped, it could have driven someone to desperation. We need to find out who else knew about this secret and what they might have done with that knowledge. The stakes are higher than we ever imagined."

As they continued to discuss the events of the night, the rain outside intensified, a fitting backdrop for the storm brewing within the study. Each suspect's story raised more questions than answers, and the tension in the room was palpable. Hale knew that they were only beginning to scratch the surface of the mystery surrounding Eleanor's death.
--- END PRIOR CHAPTER 2 ---

[SCENE COMPLETENESS CONTRACTS — MANDATORY. Each contract below lists what you MUST enact in that chapter. Do not summarise or mention these labels in the prose — enact them organically.]
Chapter 3 (Act 1) completeness contract:
  PIVOT ELEMENT (MANDATORY — write this into the prose, shown not told): "The clock's last checked time of ten fifteen, showing evidence of tampering."
  FACT ESTABLISHED (MANDATORY — reader must know this by chapter end): "Establishes that the clock was tampered with after Eleanor's death, contradicting the suspects' alibis."

# Case Overview
Title: The Clock of Deceit
Era: 1930s
Setting: Little Middleton
Crime: murder (timing deception)
Culprit: Dr. Mallory Finch
False assumption: Eleanor Voss's murder was committed after the clock showed a consistent time.
Cast: Eleanor Voss (she/her), Dr. Mallory Finch (she/her), Captain Ivor Hale (he/him), Beatrice Quill (she/her)

Setting Lock: Keep all scenes and descriptions consistent with the stated setting (Little Middleton). Do not introduce a different location type.

Outline scenes:
[
  {
    "sceneNumber": 3,
    "act": 1,
    "title": "The Clock's Secrets",
    "setting": {
      "location": "the study",
      "timeOfDay": "Mid-morning",
      "atmosphere": "Heavy with the weight of mystery"
    },
    "characters": [
      "Eleanor Voss",
      "Captain Ivor Hale",
      "Dr. Mallory Finch",
      "Beatrice Quill"
    ],
    "purpose": "Examine the clock for physical evidence and establish its tampering.",
    "cluesRevealed": [
      "clue_8",
      "clue_core_contradiction_chain",
      "clue_fp_contradiction_step_2"
    ],
    "dramaticElements": {
      "conflict": "The clock's true nature is revealed.",
      "tension": "The stakes rise as evidence of tampering emerges.",
      "microMomentBeats": [
        "Eleanor's eyes widen as she realizes the implications of the clock's condition."
      ]
    },
    "summary": "The detective examines the stopped clock, noting it was last checked at ten fifteen. The realization strikes that it was tampered with after Eleanor's death, contradicting the alibis of those present.",
    "estimatedWordCount": 2000,
    "pivotElement": "The clock's last checked time of ten fifteen, showing evidence of tampering.",
    "factEstablished": "Establishes that the clock was tampered with after Eleanor's death, contradicting the suspects' alibis.",
    "permittedBehavioursByAct": [
      {
        "characterName": "Eleanor Voss",
        "behaviour": "normal social behaviour; grief or confusion if appropriate"
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
    "emotionalRegister": "Unease grows as the body of Eleanor Voss is discovered, shattering the evening's calm.",
    "dominantCharacterNote": {
      "name": "Eleanor Voss",
      "voiceRegister": "Eleanor speaks with a measured cadence, often punctuating her sentences with historical references and an air of authority."
    },
    "humourGuidance": {
      "permission": "forbidden"
    },
    "eraTextureNote": "Limited access to information due to the absence of modern communication technologies.; Travel restrictions due to economic hardship.; Short daylight hours leading to early evening gatherings.",
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
□ Chapter 3: "The clock was last checked at ten fifteen in the evening." is placed in the first 25% of the chapter, followed by an explicit inference or suspicion paragraph.
□ Chapter 3: "This shows the clock was tampered with after Eleanor's death." is placed in the first 25% of the chapter, followed by an explicit inference or suspicion paragraph.
□ Chapter 3: "Witnesses recall hearing the clock striking at odd intervals." is placed in the first 25% of the chapter, followed by an explicit inference or suspicion paragraph.
□ Chapter 3: "The clock was wound back to create a false timeline for the murder." is placed in the first 25% of the chapter, followed by an explicit inference or suspicion paragraph.
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
