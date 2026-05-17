# Actual Prompt Record

- Run ID: `mystery-1779035873568`
- Project ID: ``
- Timestamp: `2026-05-17T16:41:47.287Z`
- Agent: `Agent9-ProseGenerator-Ch3`
- Operation: `chat_request_full_prompt`
- Model: `GPT-4o-mini`
- Temperature: `0.42`
- Max Tokens: `4500`
- Attempt: `first`
- Prompt Hash: `2567b8b428387795`

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
- MORAL COMPLEXITY REQUIREMENT: The mechanism of this crime carries a moral gray area: "While the act of murder is heinous, the culprit's desperation stems from a history of familial betrayal and emotional turmoil." — the culprit reveal and denouement MUST acknowledge this ambiguity. Do not let the ending feel clean or simple. Give the reader at least one moment of uncomfortable sympathy or moral doubt.


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

## Era: 1939-10
Living through October 1939, the tension is palpable in England as the shadow of World War II looms ever closer. While the beauty of fall can be seen in the changing leaves and the chill in the air, the threat of conflict creates a pervasive anxiety. Daily life is punctuated by news of wartime developments, and families are increasingly aware of the potential for air raids. Social gatherings, while still a display of elegance and decorum, harbor a collective worry about the future as they attempt to maintain a façade of normalcy amidst brewing chaos.
Emotional register: A collective anxiety pervades society, as the looming threat of war intersects with personal ambitions and societal expectations.
Physical constraints: Intermittent rain limits outdoor activities and adds to the somber mood. | Shorter days restrict social gatherings to daylight hours, increasing isolation. | Transportation remains affected by economic constraints, limiting movement. | Communication relies on landlines and letters, making urgent news slow to spread.
Current tensions (weave into background texture): Nazi Germany invades Poland, leading to heightened fears of war. | Britain and France declare war on Germany, signaling a shift in global power dynamics. | Growing anxiety over air raids and civil defense preparations.
Wartime context — Many men are enlisting, while women begin to take on roles traditionally held by men.: Communities are rallying around the war effort, creating a sense of solidarity but also division over class and gender roles. Absence effect: The absence of enlisted men creates a void in households, often leading to increased responsibilities for women and heightened concerns over safety.

## Story Theme
The story explores how hidden secrets and societal pressures can lead to betrayal and tragedy, revealing the fragile nature of reputation and integrity, and reveals that evidence carries ethical weight, forcing characters to choose accountability over social performance when appearances and facts collide.

## Story Emotional Register
Dominant: The overall emotional tone is one of tension and foreboding, underscored by personal stakes and societal pressures.

Arc:
The story opens amidst the grandeur of Little Middleton Manor, where the opulence of the estate contrasts sharply with the underlying tension of Eleanor Voss's untimely death. As guests gather, an atmosphere thick with unease sets the stage, hinting at the secrets that lurk within the shadows. The investigation begins, and with it, the first clues emerge, revealing the tangled web of jealousy and desperation among the suspects. Initial leads seem promising, but they quickly lead to false assumptions and emotional turmoil as each character grapples with their own hidden truths. A pivotal moment occurs when the detective, Beatrice Quill, uncovers evidence that shifts the direction of the investigation.

This revelation recontextualizes prior interactions, highlighting the characters' motives in a new light. As pressure mounts, tensions rise, culminating in a climactic confrontation that exposes the true nature of friendship, ambition, and betrayal. In the resolution, the emotional costs of the revelations weigh heavily on each character. Eleanor's legacy is forever tainted, Dr. Finch's reputation hangs in the balance, Captain Hale's dignity is shattered, and Beatrice's ambition leads her to question the ethics of her pursuit. The story closes, leaving the characters to reckon with the choices they made amidst societal expectations and personal desires.

## Emotional register at this point in the story
Initial clues spark hope but also doubt, deepening the emotional stakes for all involved.

## Character Portraits (appearance & era)

### Dr. Mallory Finch
In this moment of impending conflict, Dr. Mallory Finch is a respected physician whose inner turmoil is exacerbated by the societal pressures surrounding her. Her past malpractice incident haunts her, and as the world outside grows more uncertain, her desire to maintain her professional reputation intensifies. The impending war places additional strain on her, and she fears that any exposure could lead to her downfall amidst the rising tides of conflict.
Era intersection: Dr. Finch's fear of exposure mirrors the broader anxiety in society as individuals grapple with their pasts while facing uncertain futures.

### Beatrice Quill
Beatrice Quill is an ambitious journalist navigating the turbulent waters of societal expectations and personal integrity. In a time where women are beginning to assert their place in the workforce, Beatrice grapples with the temptation to fabricate stories to advance her career. The impending war creates a sense of urgency in her pursuit of truth, forcing her to confront her ethical boundaries as she seeks to carve out a name for herself in a male-dominated field.
Era intersection: Beatrice's ambition and ethical dilemmas echo the changing roles of women in society as they strive for recognition during a time of crisis.

## Character Voices

### Dr. Mallory Finch (she/her/her)
Dr. Finch’s calm, measured tone reflects her professional demeanor, though she occasionally slips into dry humor when discussing the absurdities of social expectations.
[comfortable] It’s always fascinating to observe how people react under pressure.
[evasive] I assure you, my patients are my only concern at the moment.
[stressed] This is not what I signed up for; I’m here to heal, not to be scrutinized!

### Beatrice Quill (she/her/her)
Beatrice speaks rapidly and energetically, her sardonic wit revealing her sharp insights into human nature.
[comfortable] Honestly, this whole affair is just ripe for a headline!
[evasive] Let’s not delve too deeply into my sources, shall we?
[stressed] This could make or break my career; I can’t afford any missteps!
Humour: Beatrice's sardonic humor shines through her observations on social absurdities.

## Location Registers (scene framing guides)

The Drawing Room: The drawing room feels opulent yet suffocating, as the walls echo with unspoken tensions and the weight of expectation hangs heavily in the air.. Camera angle: A writer entering this space might feel the palpable tension, aware that every conversation is potentially laced with secrets.. Era: The overcast skies filter through the windows, casting a gloomy light that enhances the room's oppressive atmosphere.

The Library: The library exudes a quiet intensity, its shelves filled with history and knowledge that stand in stark contrast to the unfolding drama outside.. Camera angle: Upon entering, a writer might sense an urgency to uncover hidden knowledge that could alter the course of the investigation.. Era: Dust settling on the books reminds visitors of the passage of time and the weight of forgotten truths.

The Study: The study is a sanctuary of intellect, yet it feels claustrophobic as secrets linger in the air, waiting to be discovered.. Camera angle: A writer stepping into this room would feel the weight of expectation, as if the walls themselves are urging them to uncover the hidden motives at play.. Era: The flickering candlelight creates a sense of urgency, with shadows dancing on the walls that seem to conceal truths.

The Gardens: The gardens are paradoxically beautiful and foreboding, where vibrant colors clash with the encroaching gloom of the surrounding woods.. Camera angle: Entering this space, a writer might feel both the allure of beauty and the lurking sense of danger, aware that beneath the surface lies the potential for betrayal.. Era: The chill in the air hints at the impending darkness, making the serene surroundings feel like a facade.

## Humour guidance for this story position (early)
Permission: permitted
Characters who may be funny: Beatrice Quill
Permitted forms: dry_wit
Rationale: Beatrice's wit can cut through the tension, providing levity without undermining the investigation.

## Reveal Groundwork (texture — do not explain, only plant)
- Plant one subtle observable beat related to: "The moment when Eleanor's debts are revealed casts a shadow over her interactions with Dr". Do not explain significance yet.
- Plant one subtle observable beat related to: "Finch, who harbors her own secrets". Do not explain significance yet.
- Plant one subtle observable beat related to: "Additionally, Captain Hale's gambling scheme takes on new meaning in light of the pressure he faces from his past". Do not explain significance yet.

FAIR-PLAY AND INFERENCE CONTRACT (from CML logic):
- False assumption in force: The murder occurred during a dinner when all suspects claimed to be occupied.
- Hidden truth to progressively expose: The clock was deliberately set to mislead the investigation about the time of death.
- Inference path checkpoints to dramatize clearly (observation -> correction -> effect):
  - Step 1: obs: The clock in the study shows time as quarter past seven. | corr: Since witnesses claim dinner started at seven, the clock must have been tampered with. | effect: Narrows opportunity for murder to Dr. Mallory Finch.
  - Step 2: obs: Dust on the clock's base is inconsistent with the clean surrounding furniture. | corr: The clock was recently moved, indicating tampering. | effect: Eliminates other suspects due to lack of access to the study.
  - Step 3: obs: Conflicting testimonies about the time of death from guests. | corr: The discrepancies suggest that at least one person is lying about their alibi. | effect: Narrows suspects down to Dr. Mallory Finch as he has motive and opportunity.
- Discriminating test method: trap
- Discriminating test design constraint: A controlled observation of the clock reveals discrepancies between the claims of suspects and the actual time indicated.
- Test must rely on already-shown clue IDs: clue_1, clue_2, clue_3, clue_core_contradiction_chain, clue_fp_contradiction_step_2
- Fair-play rationale: Step 1: The clock's time, a critical clue, reveals tampering; Step 2: Dust patterns point to recent handling; Step 3: Conflicting testimonies eliminate other suspects.
- Never solve by withheld information. Keep reader-information parity with detective reasoning.

## Character Reference

### Dr. Mallory Finch (she/her — NEVER he/him)
Finch speaks with a calm, measured tone, often using precise medical terminology
Her wit emerges in subtle, understated remarks, particularly when discussing the absurdities of human behavior, revealing her sharp intellect beneath her composed demeanor.
Dr. Finch is torn between her desire to maintain her professional integrity and the fear of what exposing her past could mean. The guilt of her previous actions weighs heavily on her, leading to a profound internal struggle.

### Beatrice Quill (she/her — NEVER he/him)
Beatrice speaks with a quick, energetic cadence, often peppering her dialogue with sharp observations and witty retorts
Her sardonic humor emerges in conversations about the absurdities of society, revealing her keen insights into human nature.
Beatrice grapples with the ethical implications of her actions, torn between her ambition and her growing awareness of the damage her fabrications could cause. The tension between her desire for success and her moral compass creates a profound internal struggle.


## CHARACTER CONTRACTS (binding for this scene)
Each entry below constrains how this character must be written in this chapter.
These override generic style guidance when they conflict.

### Dr. Mallory Finch[SHE]
Voice & mannerisms: Dr. Finch speaks with a calm, measured tone, often using precise medical terminology. Her wit emerges in subtle, understated remarks, particularly when discussing the absurdities of human behavior, revealing her sharp intellect beneath her composed demeanor.
Sample voice fragments (match this register and rhythm):
  [comfortable] "It’s always fascinating to observe how people react under pressure."
  [evasive] "I assure you, my patients are my only concern at the moment."
Humour: dry wit — deploy occasionally (level 0.4)
FORBIDDEN phrase (never write for Dr. Mallory Finch): "a surge of determination washed over her"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Dr. Finch fears that exposure of her past could lead to the loss of her practice, which she has worked tirelessly to build. The thought of her hard-earned reputation crumbling is a constant source of anxiety." — do not surface in Act I.

### Beatrice Quill[SHE]
Voice & mannerisms: Beatrice speaks with a quick, energetic cadence, often peppering her dialogue with sharp observations and witty retorts. Her sardonic humor emerges in conversations about the absurdities of society, revealing her keen insights into human nature.
Sample voice fragments (match this register and rhythm):
  [comfortable] "Honestly, this whole affair is just ripe for a headline!"
  [evasive] "Let’s not delve too deeply into my sources, shall we?"
Humour: sardonic — deploy frequently (level 0.7)
FORBIDDEN phrase (never write for Beatrice Quill): "palpable tension filled the room"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Desperate to unearth a scandal for a major scoop, Beatrice is willing to bend the truth, believing that success is worth the moral compromises she makes along the way." — do not surface in Act I.



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
A grand manor house steeped in secrets, surrounded by expansive gardens and shadowy woods, serves as the backdrop for a sinister conspiracy.

Key Locations Available:
- The Drawing Room (interior): Gathering space
- The Library (interior): Clue discovery
- The Study (interior): Clue discovery
- The Gardens (exterior): Clue discovery and isolation

Atmosphere (tonal cue only — do NOT reproduce this phrase verbatim in prose; translate into scene-specific, character-observed sensory language): Tense and foreboding, reflecting the uncertainty and class tensions of the era
Weather: Overcast with intermittent rain, reflecting the somber mood of the investigation

Era markers: Typewriters clacking in the study | Early telephones ringing in the drawing room | Flickering gas lamps casting shadows | Domestic wiring with frequent outages

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
  - Visual: Flickering candlelight, Dark oak paneling, Framed portraits watching silently
  - Sounds: Crackling fire, Soft rustle of silk, Distant thunder rumbling
  - Scents: Beeswax and wood polish, Cigarette smoke lingering, Old leather bindings
  - Touch: Worn velvet cushions, Cool marble mantelpiece

The Library (interior):
  - Visual: Dusty shelves lined with books, Soft glow of a reading lamp, Leather armchairs positioned for comfort
  - Sounds: Pages turning in silence, The soft thud of a book being replaced, Distant rain pattering against the window
  - Scents: Musty paper and leather, Hints of polished wood, A trace of ink
  - Touch: Cool leather of the armchair, Rough texture of old book spines

The Study (interior):
  - Visual: Rich mahogany desk glistening in candlelight, Leather-bound volumes stacked neatly, A single chair positioned for contemplation
  - Sounds: The scratching of a pen on paper, The rustle of parchment, Wind howling outside
  - Scents: Fresh ink, Old wood, Hints of tobacco
  - Touch: Smooth surface of the desk, Worn leather of the chair

⛔ REFERENCE DATA — DO NOT TRANSCRIBE VERBATIM: The above profiles are structural guides only. Generate original prose that evokes these qualities; do not reproduce the exact phrasing or sentence structure of the profile paragraphs.

SCENE OPENING RULE: When opening a scene in a new location, write what the POV character directly observes and physically senses at that moment — not a general description of the room's qualities. The reader must feel present, not briefed. Sensory details must be observed by the character, not stated as fact about the place.

SENSORY WRITING TECHNIQUES:
- Opening paragraphs: Lead with 2-3 sensory details to ground the scene
- Movement between locations: Note sensory changes (quiet study → noisy dining room)
- Emotional scenes: Use sensory details to reinforce mood (cold rain during argument)
- Period authenticity: Use period-specific sensory details from location/temporal pr
[truncated for prompt budget]

## Texture Pool
Draw on these as opportunities arise — you are not required to use them.

- Living through October 1939, the tension is palpable in England as the shadow of World War II looms ever closer
- While the beauty of fall can be seen in the changing leaves and the chill in the air, the threat of conflict creates a pervasive anxiety
- Daily life is punctuated by news of wartime developments, and families are increasingly aware of the potential for air raids
- Social gatherings, while still a display of elegance and decorum, harbor a collective worry about the future as they attempt to maintain a façade of normalcy amidst brewing chaos.

TEMPORAL CONTEXT:

This story takes place in October 1939 during N/A.

Seasonal Atmosphere:
- Weather patterns: overcast skies, intermittent rain, chilly winds
- Daylight: Shorter days with early dusk; sunset around 5:45 PM.
- Seasonal activities: apple picking, autumn harvest festivals, preparing for Halloween
- Seasonal occasions: Halloween
- Season: N/A

Period Fashion (describe naturally):
- Men formal: tailored wool suit with a vest, white dress shirt, silk tie with geometric patterns
- Men casual: tweed blazer, corduroy trousers, soft knit sweater
- Men accessories: fedora hat, leather gloves, pocket watch
- Women formal: tea-length silk dress with a cinched waist, tailored blazer, beaded clutch purse
- Women casual: knitted cardigan, high-waisted skirt, simple blouse
- Women accessories: string of pearls, beret hat, silk scarf

Cultural Context (reference naturally):
- Music/entertainment: Glenn Miller - 'In the Mood', Benny Goodman - 'Sing, Sing, Sing', Duke Ellington - 'Take the 'A' Train'; Films: The Wizard of Oz, Gone with the Wind; Theatre: The Sound of Music, The Glass Menagerie; Radio: The Shadow, Orson Welles' Mercury Theatre
- Typical prices: Loaf of bread: four pence, Men's suit: three pounds ten shillings, Movie ticket: one shilling
- Current events: Nazi Germany invades Poland, leading to World War II; Britain and France declare war on Germany
- Literature: The Grapes of Wrath by John Steinbeck | The Maltese Falcon by Dashiell Hammett | The Adventures of Sherlock Holmes by Arthur Conan Doyle (reprints) | [detective fiction] | [social realism] | [science fiction]
- Technology: automatic washing machine | commercially available radar | the first mass-produced television sets | typewriters | early telephones | radios as central household items
- Daily life: attending local dances and social events, visiting country fairs, gathering for tea and conversations
- Social rituals: Sunday dinners with family, formal invitations for social gatherings, seasonal decorations for Halloween

Atmospheric Details:
The air is thick with the dampness of autumn, the scent of wet leaves mingling with the smoke from distant chimneys. The sound of rain pattering against the window panes creates a rhythmic backdrop, enhancing the sense of unease that pervades the manor. A chill lingers in the air, prompting guests to draw their coats tightly around them as they navigate the dimly lit hallways.

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

• [clue_1] Dust on the clock's base is inconsistent with the clean surrounding furniture.
  Category: temporal | Criticality: essential | Supports inference step 2
  Points to: This suggests the clock was recently disturbed.

• [clue_fp_contradiction_step_2] Dust on the clock's base is inconsistent with the clean surrounding furniture.
  Category: temporal | Criticality: essential | Supports inference step 2
  Points to: The clock was recently moved, indicating tampering.

• [clue_mechanism_visibility_core] The mechanism relies on the clock in the study, which shows time as quarter past seven.
  Category: temporal | Criticality: essential | Supports inference step 1
  Points to: The clock's time is inconsistent with witness accounts.

• [clue_core_contradiction_chain] Since suspects claimed that the event occurred at seven, the clock must have been altered.
  Category: temporal | Criticality: essential | Supports inference step 1
  Points to: This indicates possible tampering with the clock.

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

CLUES ALREADY REVEALED TO READER: clue_mechanism_visibility_core, clue_core_contradiction_chain — do not reveal these as new information.

INVESTIGATION LOG — WHAT IS ESTABLISHED (do not re-establish, do not repeat):
• Evidence in reader's hands: The mechanism relies on the clock in the study, which shows time as quarter past seven. | Since suspects claimed that the event occurred at seven, the clock must have been altered.
• Suspects still unresolved: Eleanor Voss[SHE], Captain Ivor Hale[HE], Beatrice Quill[SHE]
⚠ The story must move FORWARD from this log. Any beat already listed above is forbidden from repeating.

⚠ THIS CHAPTER'S REQUIRED ADVANCE (early): Interview each suspect — record their claimed whereabouts

CONTINUITY HANDOFF — previous chapter closing beat:
  • "As the rain continued to fall outside, Beatrice felt the atmosphere shift. The storm outside mirrored the turmoil within the dining room, each gust of wind echoing the uncertainty that gripped them all. “I assure you, I only want to uncover the truth,” Beatric..."
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
study, dining room, flat

✓ RULE: Continue using this location vocabulary. Maintain consistency with established setting type.
✓ Do NOT introduce new location types that contradict earlier chapters.

**Recent Chapter Summary (for narrative continuity):**
Chapter 1: Chapter 1: Discovery
  Events: Beatrice Quill stepped into the study of the Finch residence, the damp chill of the autumn evening wrapping around her like a heavy cloak.
Chapter 2: Chapter 2: The Alibis
  Events: Beatrice glanced at the clock, noting the time discrepancy with a furrowed brow.

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
Known location profile anchors: Little Middleton Manor, The Drawing Room, The Library, The Study, The Gardens, the study
LOCATION NAME CAPITALISATION (HARD REQUIREMENT — validated):
All named locations in your prose MUST use the EXACT capitalisation from the CML profiles.
Canonical forms: "Little Middleton Manor", "The Drawing Room", "The Library", "The Study", "The Gardens", "the study"
Writing a location in lowercase (e.g. "drawing room" instead of "Drawing Room") is a validated error. Every time you mention a named location, copy its capitalisation from the list above.
- Chapter 3: OPENING STYLE (HARD): Start the VERY FIRST SENTENCE with an explicit time marker — e.g. "At half past nine…" / "At midnight…" / "At a quarter to eleven…" / "At half past nine at night…". Time must be in the first clause. Anchor opening in "the study". HARD REQUIREMENT for the first 2 paragraphs: (a) include 2+ sensory words — choose from smell/scent/sound/echo/silence/creak/whisper/cold/warm/damp/rough/smooth/glow/shadow/flicker/dim — and (b) include 1+ atmosphere/time word — choose from rain/wind/fog/storm/mist/thunder/evening/morning/night/dawn/dusk/season/afternoon/midday/noon/midnight/twilight/sunrise/sunset/daylight/sunlight/overcast/cloudy/bright/dark. These are validated requirements, not style suggestions; missing them triggers a retry.

[⚠ INTERNAL QUALITY DIAGNOSTICS — DO NOT REPRODUCE ANY PART OF THIS SECTION IN YOUR STORY OUTPUT. These are private generator observations for your consideration only. Your narrative must read as if this section does not exist. Never include phrases from this block in character dialogue, narration, or description.]

PRIOR CHAPTER QUALITY OBSERVATIONS:
- Chapter 1 (score 88/100):
  Quality gaps noted: word density below preferred target (700/1000); scene grounding weakness
  Address in upcoming chapters: Increase chapter density with concrete investigation action and sensory-grounded beats; avoid recap-only padding. | Open next chapter with a named location anchor plus at least two sensory cues and one atmosphere marker.
- Chapter 2 (score 88/100):
  Quality gaps noted: word density below preferred target (740/1000); scene grounding weakness
  Address in upcoming chapters: Increase chapter density with concrete investigation action and sensory-grounded beats; avoid recap-only padding. | Open next chapter with a named location anchor plus at least two sensory cues and one atmosphere marker.
[END INTERNAL DIAGNOSTICS]

PROMPT BUDGET SUMMARY: budget=32000 tokens; fixed=8371; context=10155; dropped=[none]; truncated=[pronoun_accuracy, location_profiles, temporal_context]

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
8. Integrate at least two concrete era-grounded details per chapter from setting refinement signals: domestic wiring with frequent outages | typewriters standard in offices | early home telephones | radio as a common household item | party-line telephone exchanges common | telegrams sent via local post offices.
9. Respect setting movement/access constraints in scene action and alibis: Geography allows for limited access points, primarily through a grand entrance and a service entrance | Architecture includes locked rooms and hidden alcoves that restrict movement | Weather conditions can affect outdoor evidence collection, especially in winter months | Access to certain areas restricted to staff only, such as the library and private study | Daily schedules dictate when rooms are occupied or empty, impacting investigation timelines.
10. Sustain social coherence with this backdrop pressure: A wealthy family's inheritance dispute amidst the Great Depression brings together heirs and staff in a secluded manor, where social tensions and strict hierarchies complicate loyalties and motives.
11. Maintain continuity around these socially central cast anchors where relevant: Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill.
12. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Moderate: Character similarity 0.70 with 'The Sign of the Four' (similar cast structure and character roles)
13. STORY TO DATE ANTI-COPY RULE: The STORY TO DATE section below is provided for chronological and factual reference ONLY. You MUST NOT copy, lightly rephrase, or structurally echo any sentence or paragraph from prior chapters. Every sentence in this chapter must be original prose unique to this scene. Reusing even a clause from prior chapter text will cause this attempt to fail immediately.

CRITICAL PROSE REQUIREMENTS:

The CML specifies exact requirements for certain validation-critical scenes. You MUST include these elements at the specified positions.

**Discriminating Test Scene (Act 3, Scene 4):**
Required elements: Execute the discriminating test, Observe the clock's time and its discrepancies, Draw conclusion about Dr. Mallory Finch's guilt
Test type: temporal

**Suspect Clearance Scenes:**
- Captain Ivor Hale (Act 3, Scene 5): His alibi is confirmed by multiple witnesses.
  Clues: witness statements, dining room attendance
- Eleanor Voss (Act 3, Scene 5): As the victim, she cannot be the murderer.
  Clues: death confirmation, time of death indication

**Culprit Revelation Scene (Act 3, Scene 6):**
Method: Confrontation with evidence of clock tampering.

**Clue Placement for These Chapters:**
- clue_1 must appear in Act 1, Scene 3 via Direct observation of the clock
- clue_fp_contradiction_step_2 must appear in Act 1, Scene 3 via Cross-check contradiction

**VALIDATION CONSEQUENCE:** If these requirements are not met exactly, story validation will fail and the entire generation will be rejected. Follow these specifications precisely.


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
  - Opening atmosphere (MANDATORY — validator enforced): the first paragraph MUST contain at least one of: rain / wind / fog / storm / mist / thunder / evening / morning / night / dawn / dusk / season / afternoon / midday / noon / midnight / twilight / sunrise / sunset / daylight / sunlight / overcast / cloudy / bright / dark / grey / pale / cold / warm / chill / crisp / damp / drizzle / haze / lamplight / firelight. A chapter that omits all of these from its opening paragraph will be rejected.
  - Continuity bridge: in the first 120 words, visibly connect from the previous chapter's final beat. Carry forward one unresolved element (object, accusation, emotional pressure, or immediate physical action) from: "As the rain continued to fall outside, Beatrice felt the atmosphere shift. The storm outside mirrored the turmoil within the dining room, each gust of wind echoing the uncertainty that gripped them all. “I assure you, I...".
  - CLUE OBLIGATIONS — mandatory prose elements (do NOT omit or bury):
    • Dust on the clock's base is inconsistent with the clean surrounding furniture. [clue_1] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: This suggests the clock was recently disturbed.
      ↳ MANDATORY TWO-PARAGRAPH STRUCTURE (must appear in paragraphs 1 or 2 — no later):
         Paragraph 1: The POV character physically approaches or directly observes this evidence.
           The narration or dialogue explicitly states what is seen (use the exact locked phrase if one applies).
         Paragraph 2 (immediately following): The detective or POV character explicitly reasons
           about what this evidence implies — who it implicates, why it may be unreliable,
           or what inference it supports. This must be a separate full paragraph, not a sentence appended to Paragraph 1.
    • Dust on the clock's base is inconsistent with the clean surrounding furniture. [clue_fp_contradiction_step_2] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: The clock was recently moved, indicating tampering.
      ↳ MANDATORY TWO-PARAGRAPH STRUCTURE (must appear in paragraphs 1 or 2 — no later):
         Paragraph 1: The POV character physically approaches or directly observes this evidence.
           The narration or dialogue explicitly states what is seen (use the exact locked phrase if one applies).
         Paragraph 2 (immediately following): The detective or POV character explicitly reasons
           about what this evidence implies — who it implicates, why it may be unreliable,
           or what inference it supports. This must be a separate full paragraph, not a sentence appended to Paragraph 1.
    • The mechanism relies on the clock in the study, which shows time as quarter past seven. [clue_mechanism_visibility_core] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: The clock's time is inconsistent with witness accounts.
      ↳ MANDATORY TWO-PARAGRAPH STRUCTURE (must appear in paragraphs 1 or 2 — no later):
         Paragraph 1: The POV character physically approaches or directly observes this evidence.
           The narration or dialogue explicitly states what is seen (use the exact locked phrase if one applies).
         Paragraph 2 (immediately following): The detective or POV character explicitly reasons
           about what this evidence implies — who it implicates, why it may be unreliable,
           or what inference it supports. This must be a separate full paragraph, not a sentence appended to Paragraph 1.
    • Since suspects claimed that the event occurred at seven, the clock must have been altered. [clue_core_contradiction_chain] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: This indicates possible tampering with the clock.
      ↳ MANDATORY TWO-PARAGRAPH STRUCTURE (must appear in paragraphs 1 or 2 — no later):
         Paragraph 1: The POV character physically approaches or directly observes this evidence.
           The narration or dialogue explicitly states what is seen (use the exact locked phrase if one applies).
         Paragraph 2 (immediately following): The detective or POV character explicitly reasons
           about what this evidence implies — who it implicates, why it may be unreliable,
           or what inference it supports. This must be a separate full paragraph, not a sentence appended to Paragraph 1.
  - Tonal contrast: include at least one beat of relief or ironic counterpoint. Do not sustain maximum tension for every paragraph.
  - Sensory obligation — use at least two of: Warm glow from the desk lamp, Long shadows stretching across the floor | The soft crackle of a fireplace, The distant echo of footsteps | Burning wood. Mood: tense anticipation.
- Locked fact phrase obligations:
  - If this batch mentions The exact time shown on the stopped clock face, write exactly: "ten minutes past eleven".
  - If this batch mentions The exact amount the clock was wound back, write exactly: "forty minutes".
- Seasonal vocabulary allow-list: autumn, autumnal, fall.
- Forbidden seasonal words: spring, summer, winter.

FROZEN FACT STATE (DO NOT ALTER):
- Timeline anchor: October (autumn).
- Month, season, weather, and time-of-year language in this batch must stay compatible with autumn.
- Established timeline fact: Dinner time at 7:00 PM
- Established timeline fact: Eleanor's time of death
- If referenced, use exact phrase: "ten minutes past eleven" (The exact time shown on the stopped clock face).
- If referenced, use exact phrase: "forty minutes" (The exact amount the clock was wound back).

STORY TO DATE (REFERENCE ONLY — DO NOT COPY VERBATIM):
- Full prior chapter text is provided below for continuity, factual consistency, and reference accuracy.
- Use this to keep character voice, chronology, clue state, and location continuity aligned with earlier chapters.
- Do not quote, copy, or paraphrase these paragraphs too closely; write fresh prose that remains consistent with them.

--- BEGIN PRIOR CHAPTER 1 ---
Title: Chapter 1: Discovery
Beatrice Quill stepped into the study of the Finch residence, the damp chill of the autumn evening wrapping around her like a heavy cloak. Raindrops raced down the glass panes, their rhythmic patter echoing the unease that settled in her stomach. The flickering light from the gas lamp cast long shadows across the room, illuminating the rich mahogany desk and the leather-bound volumes that lined the shelves. In the corner, the clock stood still, its hands frozen at ten minutes past eleven, a grim reminder of the tragedy that had just unfolded.

As Beatrice approached the clock, her heart raced. The mechanism relied on the clock in the study, which shows time as quarter past seven. She leaned closer, noting the dust that had settled around its base, untouched by the frantic activity of the evening. The stillness of the clock felt ominous, a silent witness to the events that had transpired. Why had it stopped? What secrets lay hidden within its gears? The questions swirled in her mind, each one more pressing than the last.

The implications of the time displayed were staggering. Since suspects claimed that the event occurred at seven, the clock must have been altered. Beatrice's mind raced as she considered the possibilities. Who would benefit from misleading the investigation? The thought of tampering sent a shiver down her spine. Each suspect had been present during the dinner, each with their own motives and secrets. Could one of them have manipulated the clock to create an alibi? The tension in the room thickened, a palpable force that seemed to press against her chest.

the doctor Finch entered the study, her expression a mask of professionalism, though her eyes betrayed a flicker of concern. "Beatrice, I trust you’re not jumping to conclusions just yet? We must remain rational in our approach to this unfortunate situation," she said, her voice steady but tinged with an undercurrent of anxiety. Beatrice nodded, though her instincts urged her to dig deeper. This was no ordinary murder; it was a carefully orchestrated act, and she was determined to uncover the truth.

Eleanor Voss, the victim, had been a woman of considerable charm and wealth, yet her life was not without its shadows. As Beatrice reflected on the dinner party, she recalled Eleanor's laughter, which had echoed through the halls, masking the tension that lurked beneath the surface. The guests, the captain Hale and the doctor Finch, had both seemed preoccupied, their eyes darting around the room as if searching for something just out of reach. What had they been hiding? And why had they all claimed to be occupied when the clock struck seven?

Captain Hale's voice broke through his thoughts, his tone light yet strained. "I must admit, the evening took a rather grim turn, didn't it? One moment we were enjoying a lovely dinner, and the next... well, here we are. Quite the scandal, I dare say." His self-deprecating humor did little to mask the tension in the room. Beatrice studied her closely, searching for any hint of guilt or fear. He was a man of the sea, accustomed to navigating treacherous waters, yet this was a storm of a different kind.

As the rain continued to fall outside, Beatrice felt a sense of urgency. The clock's time was a crucial piece of evidence, and she needed to understand its significance. She glanced at Dr. Finch, who was now examining the room with a keen eye. "We must consider all possibilities, Beatrice. Every detail matters, especially when lives are at stake," she said, her voice firm. Beatrice appreciated the doctor's resolve but couldn't shake the feeling that there was more to uncover.

The atmosphere in the study was thick with unspoken words, each suspect grappling with their own secrets. Beatrice felt the weight of their gazes upon her, each one a silent accusation. She had come here to report the truth, but now she found herself entangled in a web of lies and deception. The clock's stillness seemed to mock her, a reminder that time was running out. She had to act quickly, to piece together the clues before they slipped through her fingers like the raindrops on the window.
--- END PRIOR CHAPTER 1 ---

--- BEGIN PRIOR CHAPTER 2 ---
Title: Chapter 2: The Alibis
“I assure you, I was in the study the entire time,” the doctor Finch insisted, her voice steady but her eyes darting towards the clock, as if it held the answers she feared. The evening air in the dining room was thick with tension, the rain outside pattering against the windows, creating a rhythmic backdrop to the unfolding drama. Beatrice Quill stood at the head of the table, her gaze fixed on the doctor. The flickering candlelight cast shadows across the polished surface, highlighting the unease etched on the faces of the gathered suspects. Eleanor Voss sat nearby, her fingers nervously twisting the delicate fabric of her dress, a stark contrast to her usual composed demeanor. “It was just after seven when I left the study to join you all for dinner,” Dr. Finch continued, her voice unwavering, though a hint of anxiety crept in as she spoke. “I remember distinctly.”

Beatrice glanced at the clock, noting the time discrepancy with a furrowed brow. The mechanism relies on the clock in the study, which shows time as quarter past seven. She felt a chill run down her spine as the implications of this revelation settled in. Since suspects claimed that the event occurred at seven, the clock must have been altered. Who would dare tamper with time itself to create an alibi? The thought sent a shiver through her, and she fought to maintain her composure as she addressed the group. “If the clock was indeed set back, it raises significant questions about your whereabouts during the murder,” Beatrice stated, her tone firm. “We need to understand who was where and when.”

the captain Hale leaned back in her chair, a hint of amusement flickering in her eyes. “Oh, come now, Beatrice. Surely you don’t think I would resort to such trickery? I was playing cards with Eleanor. We were quite engrossed in the game, weren’t we, Eleanor?” Her attempt at levity fell flat, the tension in the room palpable. Eleanor’s smile faltered, her gaze shifting to the captain, uncertainty clouding her features. “Yes, I suppose we were,” she replied, her voice barely above a whisper. “But I can’t recall the exact time we started.”

“That’s precisely the issue, isn’t it?” Beatrice interjected, her voice rising slightly. “You both claim to have been occupied, yet there’s no clear timeline. If the clock is unreliable, how can we trust your accounts?” The room fell silent, the weight of her words hanging heavily in the air. Beatrice could sense the mounting pressure, the conflicting testimonies from the suspects regarding their alibis creating a web of confusion that she must untangle. She turned her attention to Dr. Finch, whose expression had shifted from confidence to concern. “Doctor, you mentioned being in the study. Was there anyone else who could corroborate your story?”

Dr. Finch hesitated, her fingers tapping nervously against the table. “I was alone,” she admitted, her voice barely audible. “I needed a moment to gather my thoughts.” Beatrice noted the way the doctor’s gaze flickered towards Eleanor, as if seeking support. “And what about you, Eleanor? What do you remember?” The question hung in the air, and Eleanor’s eyes widened slightly, the weight of scrutiny pressing down upon her.

Eleanor took a deep breath, her composure wavering. “I recall Captain Hale and I discussing the cards, but I can’t say for certain when we began. It all feels like a blur.” Beatrice nodded, noting the cracks in Eleanor’s facade. The tension in the room was palpable, and Beatrice felt a sense of urgency to clarify the timeline. “We need to establish a clearer picture of the evening. The butler’s log shows that the wine was served at a time that conflicts with the suspects’ readings,” she noted, her voice steady. “This could provide crucial insight into your alibis.”

As the rain continued to fall outside, Beatrice felt the atmosphere shift. The storm outside mirrored the turmoil within the dining room, each gust of wind echoing the uncertainty that gripped them all. “I assure you, I only want to uncover the truth,” Beatrice said, her gaze sweeping over the assembled suspects. “But it’s becoming increasingly clear that someone is not being entirely truthful.” The silence that followed was deafening, each suspect lost in their thoughts, the weight of suspicion heavy in the air. Beatrice knew she had to press on, to unravel the tangled threads of deception that bound them all together.
--- END PRIOR CHAPTER 2 ---

[SCENE COMPLETENESS CONTRACTS — MANDATORY. Each contract below lists what you MUST enact in that chapter. Do not summarise or mention these labels in the prose — enact them organically.]
Chapter 3 (Act 1) completeness contract:
  PIVOT ELEMENT (MANDATORY — write this into the prose, shown not told): "The dust on the clock's base, indicating it was recently moved."
  FACT ESTABLISHED (MANDATORY — reader must know this by chapter end): "Establishes that the clock was tampered with, narrowing the opportunity for murder to Dr. Mallory Finch."

# Case Overview
Title: The Clockwork Conspiracy
Era: 1930s
Setting: Little Middleton
Crime: murder (clock tampering)
Culprit: Dr. Mallory Finch
False assumption: The murder occurred during a dinner when all suspects claimed to be occupied.
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
      "timeOfDay": "Later that evening",
      "atmosphere": "Eerie silence as the detective inspects the room"
    },
    "characters": [
      "Beatrice Quill",
      "Dr. Mallory Finch"
    ],
    "purpose": "Reveal early clues about the clock and its tampering",
    "cluesRevealed": [
      "clue_1",
      "clue_fp_contradiction_step_2",
      "clue_mechanism_visibility_core",
      "clue_core_contradiction_chain"
    ],
    "dramaticElements": {
      "conflict": "Beatrice's probing questions unsettle Dr. Finch",
      "tension": "The clock's condition raises suspicion",
      "microMomentBeats": [
        "Beatrice brushes her fingers over the dusty clock, feeling the weight of its secrets."
      ]
    },
    "summary": "Beatrice returns to the study to examine the clock more closely. She notices dust on the clock's base that doesn't match the otherwise clean furniture. Dr. Finch's nervous demeanor raises Beatrice's suspicions further as she starts to connect the dots.",
    "estimatedWordCount": 1800,
    "pivotElement": "The dust on the clock's base, indicating it was recently moved.",
    "factEstablished": "Establishes that the clock was tampered with, narrowing the opportunity for murder to Dr. Mallory Finch.",
    "permittedBehavioursByAct": [
      {
        "characterName": "Dr. Mallory Finch",
        "behaviour": "show normal social behaviour; grief or confusion if appropriate"
      },
      {
        "characterName": "Beatrice Quill",
        "behaviour": "show normal social behaviour; grief or confusion if appropriate"
      }
    ],
    "redHerringPlacement": null,
    "emotionalRegister": "Initial clues spark hope but also doubt, deepening the emotional stakes for all involved.",
    "dominantCharacterNote": {
      "name": "Dr. Mallory Finch",
      "voiceRegister": "Dr. Finch’s calm, measured tone reflects her professional demeanor, though she occasionally slips into dry humor when discussing the absurdities of social expectations."
    },
    "humourGuidance": {
      "permission": "forbidden"
    },
    "eraTextureNote": "Intermittent rain limits outdoor activities and adds to the somber mood.; Shorter days restrict social gatherings to daylight hours, increasing isolation.; Transportation remains affected by economic constraints, limiting movement.; Communication relies on landlines and letters, making urgent news slow to spread.",
    "locationRegisterNote": "The study is a sanctuary of intellect, yet it feels claustrophobic as secrets linger in the air, waiting to be discovered. — A writer stepping into this room would feel the weight of expectation, as if the walls themselves are urging them to uncover the hidden motives at play."
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
□ Chapter 3: "Dust on the clock's base is inconsistent with the clean surrounding furniture." is placed in the first 25% of the chapter, followed by an explicit inference or suspicion paragraph.
□ Chapter 3: "Dust on the clock's base is inconsistent with the clean surrounding furniture." is placed in the first 25% of the chapter, followed by an explicit inference or suspicion paragraph.
□ Chapter 3: "The mechanism relies on the clock in the study, which shows time as quarter past seven." is placed in the first 25% of the chapter, followed by an explicit inference or suspicion paragraph.
□ Chapter 3: "Since suspects claimed that the event occurred at seven, the clock must have been altered." is placed in the first 25% of the chapter, followed by an explicit inference or suspicion paragraph.
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
