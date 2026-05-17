# Actual Prompt Record

- Run ID: `mystery-1779031682468`
- Project ID: ``
- Timestamp: `2026-05-17T15:31:15.636Z`
- Agent: `Agent9-ProseGenerator-Ch2`
- Operation: `chat_request_full_prompt`
- Model: `GPT-4o-mini`
- Temperature: `0.42`
- Max Tokens: `4500`
- Attempt: `first`
- Prompt Hash: `70116390c0f0dc93`

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
- MORAL COMPLEXITY REQUIREMENT: The mechanism of this crime carries a moral gray area: "The murderer acted out of a misguided belief that they were protecting a loved one from the victim's abusive behavior." — the culprit reveal and denouement MUST acknowledge this ambiguity. Do not let the ending feel clean or simple. Give the reader at least one moment of uncomfortable sympathy or moral doubt.


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

## Era: 1938-08
In August 1938, life in England is marked by an air of uncertainty and tension. The overcast skies and sporadic rain reflect the somber mood as the nation grapples with the implications of the Munich Agreement and the specter of war looming in Europe. The upper class continues to host lavish gatherings, perhaps as a means of escapism from the economic struggles faced by the broader populace. Meanwhile, class disparities are becoming increasingly pronounced, with the wealthy scrutinized for their opulence amid the remnants of the Great Depression. Social rituals, such as afternoon tea and garden parties, serve as a facade for deeper anxieties about the future. The conversations at these gatherings are often laced with unspoken tensions and whispers of political unrest, creating an atmosphere where appearances must be upheld at all costs, even as the world outside threatens to disrupt their carefully curated lives.
Emotional register: A pervasive sense of unease hangs in the air, as individuals navigate an increasingly complex social landscape filled with hidden tensions.
Physical constraints: Limited communication technology hampers the rapid spread of news. | Transportation relies on petrol-powered vehicles, which are less accessible due to fuel shortages. | Social mobility is restricted by strict class divisions and societal expectations. | Weather conditions frequently disrupt travel plans and outdoor activities.
Current tensions (weave into background texture): Rising fears of fascism and potential war in Europe. | Economic recovery remains sluggish, with class disparities evident. | The recent Munich Agreement has stirred public controversy.
Wartime context — Many young men are preparing for potential conscription as tensions rise across Europe.: The community is divided, with some supporting military action while others advocate for peace. Absence effect: The looming prospect of war creates anxiety among families, with many fearing for the safety of loved ones.

## Story Theme
The pursuit of ambition can lead to moral compromise, revealing the fragility of human connections amidst the backdrop of societal expectations, and reveals that evidence carries ethical weight, forcing characters to choose accountability over social performance when appearances and facts collide.

## Story Emotional Register
Dominant: A haunting undercurrent of tension permeates the narrative, reflecting the fragility of human relationships amidst societal expectations.

Arc:
The story opens within the opulent yet oppressive confines of Little Middleton Manor, where the murder of a prominent socialite sets the stage for a chilling investigation. As Eleanor Voss's lifeless body is discovered in the library, the air grows thick with suspicion and fear, leaving the guests to grapple with the implications of her death. Initial investigations yield a sense of rising unease; each clue unearthed only deepens the mystery and escalates the emotional toll on the characters, particularly Eleanor's closest acquaintances who now find their lives under scrutiny.

As the story progresses, a pivotal moment occurs when Dr. Mallory Finch's alibi is called into question, forcing Eleanor's friends to confront their own motives and secrets. This revelation shifts the direction of the investigation, as friendships strain under the weight of suspicion and ambition. The emotional landscape shifts further when evidence regarding the tampered clock reveals that the murder's timing is not what it seems, compelling the characters to reevaluate their perceptions and fears.

The climax builds as the tension peaks in a confrontation where long-held secrets are forced into the light, revealing the intricate web of lies that bind the characters together. Beatrice Quill’s hidden agenda comes to the forefront, exposing her desperate quest for literary fame at the cost of her integrity. The emotional stakes reach a boiling point as the characters face the repercussions of their actions, leading to a heart-wrenching resolution where loyalties are tested and sacrifices are made.

In the aftermath, the emotional cost is heavy; each character must grapple with the choices they made and the relationships that have been irrevocably altered. As they exit the manor, the weight of the secrets they carry lingers in the air, serving as a poignant reminder of the fragility of their connections amidst a world rife with ambition and deception.

## Emotional register at this point in the story
The initial discovery of the murder creates a palpable tension that grips the manor.

## Character Portraits (appearance & era)

### Eleanor Voss
Eleanor Voss, as a local socialite, embodies the pressures of maintaining status amidst the rising scrutiny of wealth during the 1930s. Her lavish gatherings offer a stark contrast to the economic struggles surrounding her, reflecting the societal expectations placed upon women to uphold elegance and charm. Beneath this veneer lies a woman grappling with debt and personal vendettas, highlighting the fragility of her social standing in a time of economic uncertainty.
Era intersection: Eleanor's financial troubles clash with the opulence of her lifestyle, exposing the stark realities faced by the upper class during the Great Depression.

### Beatrice Quill
Beatrice Quill, an aspiring writer, grapples with the tension between her romantic desires and professional ambitions. Her affair with the victim complicates her pursuit of literary fame, reflecting the societal pressures on women to conform to moral standards. In a time when women's reputations are closely tied to their actions, Beatrice's inner turmoil highlights the challenges faced by women seeking independence and self-expression.
Era intersection: Beatrice's aspirations clash with societal expectations, illustrating the restrictive norms placed on women during the 1930s, especially in matters of love and ambition.

## Character Voices

### Eleanor Voss (she/her/her)
Eleanor's speech is smooth and melodic, often laced with euphemisms and soft laughter that masks her underlying anxiety.
[comfortable] Oh, darling, isn’t it simply lovely how the garden blooms? It’s like a painting come to life.
[evasive] Well, you know how it is with these things; one must maintain appearances, yes?
[stressed] I just hope everything goes according to plan; it’s really quite crucial for my… reputation.
Humour: Eleanor's humour is characterized by understatement, often deflecting tension with a light touch.

### Beatrice Quill (she/her/her)
Beatrice's speech is lively and expressive, often rich with metaphors and dramatic flourishes that showcase her artistic aspirations.
[comfortable] Isn’t it just delightful to lose oneself in a good book? It’s like stepping into another world!
[evasive] Oh, those whispers are just the wind; they mean nothing, really.
[stressed] This is a catastrophe! If anyone finds out, it could ruin everything I’ve worked for!
Humour: Beatrice's humour leans towards the sardonic, reflecting her inner conflict and ambition.

## Location Registers (scene framing guides)

The Library: The library is a space of both knowledge and foreboding, where the air thickens with unspoken secrets and the weight of the past lingers heavily. It holds an eerie stillness, accentuated by the fading light, as if the very walls are witnesses to the tragedy that has unfolded. Here, time seems to stand still, and each rustle of paper feels like a whisper of the truth waiting to be revealed.. Camera angle: As a writer steps into this space, the sense of tension is palpable, urging them to uncover the hidden truths that lie within.. Era: The library bears the marks of a bygone era, with its dusty tomes and heavy curtains obstructing the light, creating an atmosphere of claustrophobia.

The Drawing Room: In the drawing room, the lavish furnishings and ornate décor create a striking contrast to the underlying tension that simmers just beneath the surface. The air is thick with the scent of cigars and polished wood, while laughter from guests feels forced amidst the growing sense of unease. This space, once a haven for social gatherings, now serves as a reminder of the fragility of appearances and the secrets that lurk within.. Camera angle: Entering this space, the writer is greeted by a façade of elegance that belies the turmoil brewing among the guests.. Era: The opulence of the drawing room highlights the societal expectations of the 1930s, where appearances must be maintained even in times of crisis.

The Study: The study is a sanctuary of chaos, cluttered with papers and the remnants of creativity. It holds a sense of urgency, as if the thoughts and ideas of its occupant are trapped within its walls. The dim light casts long shadows, creating an atmosphere of foreboding as the tension builds. Here, the burden of secrets weighs heavily, urging the characters to confront the truths they have long avoided.. Camera angle: As a writer enters the study, the air is thick with anticipation, hinting at the revelations that are waiting to unfold.. Era: The study reflects the era's emphasis on intellectual pursuits, yet the clutter also symbolizes the internal struggles faced by its occupants.

The Gardens: The gardens are a paradox of beauty and neglect, where the overgrown paths and wilting flowers speak to the hidden turmoil of the characters. The air is heavy with the scent of damp earth, evoking a sense of melancholy that mirrors the secrets held within the manor. In this secluded space, the tension is palpable, as nature bears witness to the unfolding drama, creating an atmosphere ripe for reflection and revelation.. Camera angle: Approaching the gardens, the writer senses an unsettling quietness, as if the very earth is holding its breath, waiting for the truth to emerge.. Era: The gardens, while beautiful, also reflect the societal pressures faced by the upper class, as they struggle to maintain appearances amidst personal turmoil.

## Humour guidance for this story position (opening)
Permission: forbidden
Rationale: The gravity of the murder necessitates a serious tone.

FAIR-PLAY AND INFERENCE CONTRACT (from CML logic):
- False assumption in force: The murder must have occurred after the clock showed the time of eleven o'clock.
- Hidden truth to progressively expose: The actual time of death was much earlier due to the clock's tampering.
- Inference path checkpoints to dramatize clearly (observation -> correction -> effect):
  - Step 1: obs: The clock in the study shows ten minutes past eleven. | corr: This suggests the time of death is later than it actually is. | effect: Eliminates the possibility that Eleanor died before eleven.
  - Step 2: obs: A note found in Eleanor's hand states a meeting time of midnight. | corr: The note's timestamp contradicts the clock's reading. | effect: Narrows the time of death to before eleven.
  - Step 3: obs: Witnesses recall seeing Eleanor alive at 10:45 PM. | corr: If Eleanor was alive at 10:45, the clock's time must be incorrect. | effect: Eliminates Dr. Mallory Finch as a suspect due to his alibi.
- Discriminating test method: trap
- Discriminating test design constraint: The discriminating test compares clock, study, and minut against the claimed timeline.
- Test must rely on already-shown clue IDs: clue_1, clue_2, clue_3, clue_fp_contradiction_step_1, clue_mechanism_visibility_core
- Fair-play rationale: Step 1: The clock's misrepresentation of time is shown early. Step 2: The note indicating a different time is introduced, contradicting the clock. Step 3: Witness statements about Eleanor's last sighting confirm the timeline discrepancy.
- Never solve by withheld information. Keep reader-information parity with detective reasoning.

## Character Reference

### Eleanor Voss (she/her — NEVER he/him)
Eleanor speaks with a smooth, melodic tone, often punctuating her sentences with soft laughter
She has a penchant for dramatic pauses, allowing her words to linger in the air, and she often uses euphemisms to soften harsh realities.
Eleanor grapples with the anxiety of her financial reality clashing with the façade she presents to society. The fear of being exposed drives her to make questionable decisions, leaving her torn between survival and integrity.

### Beatrice Quill (she/her — NEVER he/him)
Beatrice speaks with a lively cadence, often punctuating her sentences with dramatic flourishes and expressive gestures
She has a penchant for metaphors and similes, making her dialogue colorful and engaging.
Beatrice grapples with the tension between her romantic desires and her ambitions. The fear of being judged for her affair creates a moral dilemma, leaving her conflicted about her choices and what they mean for her future.


## CHARACTER CONTRACTS (binding for this scene)
Each entry below constrains how this character must be written in this chapter.
These override generic style guidance when they conflict.

### Eleanor Voss[SHE]
Voice & mannerisms: Eleanor speaks with a smooth, melodic tone, often punctuating her sentences with soft laughter. She has a penchant for dramatic pauses, allowing her words to linger in the air, and she often uses euphemisms to soften harsh realities.
Sample voice fragments (match this register and rhythm):
  [comfortable] "Oh, darling, isn’t it simply lovely how the garden blooms? It’s like a painting come to life."
  [evasive] "Well, you know how it is with these things; one must maintain appearances, yes?"
Humour: understatement — deploy occasionally (level 0.5)
FORBIDDEN phrase (never write for Eleanor Voss): "the situation was extremely serious"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "The stakes couldn't be higher; if the victim's estate is inherited by someone else, Eleanor fears she will lose her home and the social standing she has fought to uphold." — do not surface in Act I.

### Beatrice Quill[SHE]
Voice & mannerisms: Beatrice speaks with a lively cadence, often punctuating her sentences with dramatic flourishes and expressive gestures. She has a penchant for metaphors and similes, making her dialogue colorful and engaging.
Sample voice fragments (match this register and rhythm):
  [comfortable] "Isn’t it just delightful to lose oneself in a good book? It’s like stepping into another world!"
  [evasive] "Oh, those whispers are just the wind; they mean nothing, really."
Humour: sardonic — deploy occasionally (level 0.6)
FORBIDDEN phrase (never write for Beatrice Quill): "palpable tension filled the room"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "The fear of her affair becoming public looms over her like a dark cloud, threatening to tarnish her reputation and ruin her chances of a literary career." — do not surface in Act I.



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
A sprawling country estate that whispers of old money and hidden secrets, set against the backdrop of a tense socio-political climate.

Key Locations Available:
- The Library (interior): Crime scene
- The Drawing Room (interior): Gathering space
- The Study (interior): Private workspace and clue discovery
- The Gardens (exterior): Isolation and reflection

Atmosphere: Tense and uneasy, reflecting the socio-political climate of the era and the hidden secrets of the estate.
Weather: Overcast with occasional rain, typical for the season, creating a somber mood.

Era markers: Petrol-powered automobiles parked in the gravel driveway | Manual typewriters clacking in the study | Telephones with party lines ringing intermittently

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
  - Visual: dust motes dancing in the dim light, faded spines of ancient books
  - Sounds: the whisper of pages turning, the distant crackle of the fireplace
  - Scents: musty paper, old leather bindings
  - Touch: smooth, cool wood of the table, the rough texture of aged paper

The Drawing Room (interior):
  - Visual: opulent curtains draping the tall windows, ornate furniture with intricate carvings
  - Sounds: the soft crackle of the fire, muffled conversations
  - Scents: the aroma of fine cigars, freshly polished wood
  - Touch: plush velvet cushions, the coolness of marble mantel

The Study (interior):
  - Visual: papers strewn across the desk, dim light from a desk lamp
  - Sounds: the clatter of typewriter keys, the rustle of paper
  - Scents: the scent of ink, the faint musk of old leather
  - Touch: the cold metal of the typewriter, the rough texture of parchment

⛔ REFERENCE DATA — DO NOT TRANSCRIBE VERBATIM: The above profiles are structural guides only. Generate original prose that evokes these qualities; do not reproduce the exact phrasing or sentence structure of the profile paragraphs.

SCENE OPENING RULE: When opening a scene in a new location, write what the POV character directly observes and physically senses at that moment — not a general description of the room's qualities. The reader must feel present, not briefed. Sensory details must be observed by the character, not stated as fact about the place.

SENSORY WRITING TECHNIQUES:
- Opening paragraphs: Lead with 2-3 sensory details to ground the scene
- Movement between locations: Note sensory changes (quiet study → noisy dining room)
- Emotional scenes: Use sensory details to reinforce mood (cold rain during argument)
- Period authenticity: Use period-specific sensory details from location/temporal profiles
- Avoid: Over-reliance on visual only; use sound, smell, touch, temperature

CHAPTER SENSORY PALETTE HINTS (evoke these qualities without copying verbatim):
  Chapter 2 palette — evening, clear, foreboding clarity mood [location: The Study]:
    • the warm glow of a desk lamp, the flicker of shadows on
[truncated for prompt budget]

## Texture Pool
Draw on these as opportunities arise — you are not required to use them.

- In August 1938, life in England is marked by an air of uncertainty and tension
- The overcast skies and sporadic rain reflect the somber mood as the nation grapples with the implications of the Munich Agreement and the specter of war looming in Europe
- The upper class continues to host lavish gatherings, perhaps as a means of escapism from the economic struggles faced by the broader populace
- Meanwhile, class disparities are becoming increasingly pronounced, with the wealthy scrutinized for their opulence amid the remnants of the Great Depression
- Social rituals, such as afternoon tea and garden parties, serve as a facade for deeper anxieties about the future

TEMPORAL CONTEXT:

This story takes place in August 1938 during summer.

Seasonal Atmosphere:
- Weather patterns: overcast skies, occasional rain showers, muggy humidity
- Daylight: Long days with sunset around eight-thirty, but frequent cloud cover darkens the atmosphere.
- Seasonal activities: garden parties among the upper class, hunting trips in the countryside, visits to the seaside for the wealthy
- Seasonal occasions: Bank Holiday Monday (August 1)
- Season: summer

Period Fashion (describe naturally):
- Men formal: three-piece suits in light fabrics, crisp white shirts, bow ties or thin neckties
- Men casual: tweed jackets, linen trousers, casual loafers
- Men accessories: fedora hats, cufflinks, pocket watches
- Women formal: tea-length dresses with floral patterns, satin gloves, pearl necklaces
- Women casual: cotton blouses, A-line skirts, sundresses
- Women accessories: wide-brimmed hats, handbags, bangles

Cultural Context (reference naturally):
- Music/entertainment: Benny Goodman, Glenn Miller, Duke Ellington; Films: The Adventures of Robin Hood, The Wizard of Oz; Theatre: The King and I, Pygmalion; Radio: The Shadow, Amos 'n' Andy
- Typical prices: Loaf of bread: four pence, Cinema ticket: one shilling, Bottle of milk: five pence
- Current events: Munich Agreement signed, appeasing Hitler; Increased tensions between Britain and Nazi Germany
- Literature: The Maltese Falcon by Dashiell Hammett | Brave New World by Aldous Huxley | The Grapes of Wrath by John Steinbeck | [detective fiction] | [social realism] | [science fiction]
- Technology: the electric refrigerator | the ballpoint pen | automated washing machines | desktop radios | manual typewriters | film cameras
- Daily life: attending garden parties, participating in sports like cricket, enjoying picnics at local parks
- Social rituals: afternoon tea gatherings, formal dinner parties, evening strolls in the neighborhood

Atmospheric Details:
The air is thick with humidity, and the scent of damp earth lingers after each rain. A distant rumble of thunder adds to the tension, echoing the unease felt in society. The flickering light from the manor's windows casts long shadows, suggesting hidden secrets within its walls.

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
2. Fashion descriptions: Every character gets fashion description on first appearance
3. Cultural touchstones: Reference music/entertainment 2-3 times across story
4. Prices/daily life: Use when relevant (m
[truncated for prompt budget]

NON-NEGOTIABLE CHAPTER OBLIGATIONS — LOCKED EVIDENCE PHRASES (VERBATIM REQUIRED):
The following physical evidence values are absolute ground truth. Every time this chapter describes, mentions, or alludes to the relevant evidence — no matter how briefly — it MUST use the exact phrase shown below, character for character. NO paraphrase, approximation, rounding, or synonym is permitted.

FAILURE EXAMPLE: if the locked value is "at thirteen minutes to midnight" and you write "just before midnight" or "around midnight" — that is a HARD FAIL. You must write "at thirteen minutes to midnight". Equally, if the locked value is written in words, such as "ten minutes past eleven", and you convert it to figure-based clock notation — that is also a HARD FAIL. Words stay as words; figure forms are forbidden for word-phrased facts.

CRITICAL — WORD-PHRASED VALUES: If the canonical value is written out in words (e.g. a time like "ten minutes past eleven", or an amount like "forty minutes"), reproduce those exact words. DO NOT convert to figure-based time notation, twenty-four-hour format, or any other numeric shorthand. Correct: "ten minutes past eleven". WRONG: figure-based clock notation or numeric shorthand.

Locked facts:
  - The exact time shown on the stopped clock face: "ten minutes past eleven"
    ⛔ FORBIDDEN alternatives: "11:10", "11.10", "eleven ten", "eleven-ten", "eleven past ten", "quarter past eleven", "half past eleven" — the ONLY acceptable form is "ten minutes past eleven"
  - The exact amount the clock was wound back: "forty minutes"
  - The temperature in the room at the time of the murder: "seventy degrees Fahrenheit"
  - The time written on the note found with the victim: "a quarter past twelve"

If a locked fact has no relevance to this chapter, omit it. But the moment you reference the underlying evidence, only the exact phrase above is acceptable.

⛔ CLUES TO SURFACE IN THESE CHAPTERS — mandatory:
The following evidence MUST be clearly observable to an attentive reader. Do not bury it in atmosphere or passing dialogue. Each clue must be concrete, specific, and noticeable:

• [clue_4] The note's timestamp contradicts the clock's reading.
  Category: temporal | Criticality: essential | Supports inference step 2
  Points to: This highlights inconsistencies in the timeline.

• [clue_culprit_direct_beatrice_quill] Direct evidence ties Beatrice Quill to the mechanism access point before the discriminating test.
  Category: temporal | Criticality: essential | Supports inference step 1
  Points to: This direct evidence shows Beatrice Quill had means and opportunity, narrowing the solution uniquely toward the culprit.

• [clue_core_contradiction_chain] Cross-check contradiction
  Category: structural | Placement: early (Act 1)
  Points to: what this observation reveals about the time or circumstances of the crime.

For each clue above: an attentive reader should be able to find, record, and later use it to reason toward the solution.

═══ NARRATIVE STATE (read-only — do not contradict) ═══

LOCKED FACTS — use verbatim whenever this evidence is described:
  • The exact time shown on the stopped clock face: "ten minutes past eleven"
  • The exact amount the clock was wound back: "forty minutes"
  • The temperature in the room at the time of the murder: "seventy degrees Fahrenheit"
  • The time written on the note found with the victim: "a quarter past twelve"

CHARACTER PRONOUNS — never deviate from these:
  • Eleanor Voss: she/her/her
  • Dr. Mallory Finch: she/her/her
  • Captain Ivor Hale: he/him/his
  • Beatrice Quill: she/her/her

CLUES ALREADY REVEALED TO READER: clue_1, clue_2 — do not reveal these as new information.

INVESTIGATION LOG — WHAT IS ESTABLISHED (do not re-establish, do not repeat):
• Evidence in reader's hands: The clock in the study shows ten minutes past eleven. | A note found in Eleanor's hand states a meeting time of midnight.
• Suspects still unresolved: Eleanor Voss[SHE], Dr. Mallory Finch[SHE], Captain Ivor Hale[HE]
⚠ The story must move FORWARD from this log. Any beat already listed above is forbidden from repeating.

⚠ THIS CHAPTER'S REQUIRED ADVANCE (opening): Discover the body, confirm the victim, establish the scene

CONTINUITY HANDOFF — previous chapter closing beat:
  • "Hours passed like minutes as they meticulously examined every corner of the study. The mustiness of old books filled the air, a scent that once brought comfort now felt oppressive. Eleanor's mind was a whirlwind of thoughts, each one more troubling than the la..."
  • The next chapter must open as a continuation of this beat, not as a disconnected reset.
═══════════════════════════════════════════════════════

═══════════════════════════════════════════════════════════
📚 CONTINUITY CONTEXT - CHARACTER & SETTING CONSISTENCY
═══════════════════════════════════════════════════════════

**CRITICAL: You are writing chapters 2+. Maintain consistency with earlier chapters.**

**Character Names Used in Chapters 1-1:**
Eleanor Voss, Beatrice Quill

✓ RULE: Use EXACTLY these names. Do NOT vary spelling, add titles, or introduce new forms.
✓ Example: if earlier chapters used "Clara Whitfield", keep using "Clara Whitfield" — never "Mrs. Whitfield" unless that is the character's canonical name in the list above.

**Setting Vocabulary Established in Earlier Chapters:**
study

✓ RULE: Continue using this location vocabulary. Maintain consistency with established setting type.
✓ Do NOT introduce new location types that contradict earlier chapters.

**Recent Chapter Summary (for narrative continuity):**
Chapter 1: Chapter 1: Discovery
  Events: Eleanor Voss stepped into the study, her heart pounding in her chest as the soft patter of rain against the window echoed through the dimly lit room.

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
Known location profile anchors: Little Middleton Manor, The Library, The Drawing Room, The Study, The Gardens, the study, shortly after the discovery
LOCATION NAME CAPITALISATION (HARD REQUIREMENT — validated):
All named locations in your prose MUST use the EXACT capitalisation from the CML profiles.
Canonical forms: "Little Middleton Manor", "The Library", "The Drawing Room", "The Study", "The Gardens", "the study, shortly after the discovery"
Writing a location in lowercase (e.g. "drawing room" instead of "Drawing Room") is a validated error. Every time you mention a named location, copy its capitalisation from the list above.
- Chapter 2: OPENING STYLE (HARD): Start the VERY FIRST SENTENCE with spoken dialogue — e.g. '"[words]," [Name] said/asked/replied/murmured.' The opening quote must be the first character on the line. Anchor opening in "the study, shortly after the discovery". HARD REQUIREMENT for the first 2 paragraphs: (a) include 2+ sensory words — choose from smell/scent/sound/echo/silence/creak/whisper/cold/warm/damp/rough/smooth/glow/shadow/flicker/dim — and (b) include 1+ atmosphere/time word — choose from rain/wind/fog/storm/mist/thunder/evening/morning/night/dawn/dusk/season/afternoon/midday/noon/midnight/twilight/sunrise/sunset/daylight/sunlight/overcast/cloudy/bright/dark. These are validated requirements, not style suggestions; missing them triggers a retry.

[⚠ INTERNAL QUALITY DIAGNOSTICS — DO NOT REPRODUCE ANY PART OF THIS SECTION IN YOUR STORY OUTPUT. These are private generator observations for your consideration only. Your narrative must read as if this section does not exist. Never include phrases from this block in character dialogue, narration, or description.]

PRIOR CHAPTER QUALITY OBSERVATIONS:
- Chapter 1 (score 85/100):
  Quality gaps noted: word density below preferred target (665/1000); scene grounding weakness
  Address in upcoming chapters: Increase chapter density with concrete investigation action and sensory-grounded beats; avoid recap-only padding. | Open next chapter with a named location anchor plus at least two sensory cues and one atmosphere marker.
[END INTERNAL DIAGNOSTICS]

PROMPT BUDGET SUMMARY: budget=32000 tokens; fixed=6976; context=10428; dropped=[none]; truncated=[pronoun_accuracy, location_profiles, temporal_context]

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
8. Integrate at least two concrete era-grounded details per chapter from setting refinement signals: petrol-powered automobiles | domestic telephones with party lines | manual typewriters | telephone exchanges | telegram services via local post offices | airmail for urgent correspondence.
9. Respect setting movement/access constraints in scene action and alibis: multiple access points with restricted areas | large grounds with hedges limiting visibility | interior layout promoting certain movement patterns | restricted areas such as the study and cellar | permissions required for staff and guests to access certain rooms.
10. Sustain social coherence with this backdrop pressure: A mechanical clock-tampering incident during an inheritance hearing draws a diverse group of heirs and staff together, exposing class tensions and hidden secrets amidst the scrutiny of the wealthy in a time of social upheaval.
11. Maintain continuity around these socially central cast anchors where relevant: Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill.
12. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Critical: Plot similarity 0.75 with 'The Mysterious Affair at Styles' (same temporal axis and method of mechanical tampering)
13. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Moderate: Character similarity 0.74 with 'The Sign of the Four' (similar cast structure and character roles)
14. STORY TO DATE ANTI-COPY RULE: The STORY TO DATE section below is provided for chronological and factual reference ONLY. You MUST NOT copy, lightly rephrase, or structurally echo any sentence or paragraph from prior chapters. Every sentence in this chapter must be original prose unique to this scene. Reusing even a clause from prior chapter text will cause this attempt to fail immediately.

CRITICAL PROSE REQUIREMENTS:

The CML specifies exact requirements for certain validation-critical scenes. You MUST include these elements at the specified positions.

**Discriminating Test Scene (Act 3, Scene 4):**
Required elements: Execute the discriminating test, Observe the clock's adjustment, Confirm the false timeline
Test type: mechanical proof

**Suspect Clearance Scenes:**
- Dr. Mallory Finch (Act 3, Scene 5): Dr. Mallory's alibi confirms his whereabouts.
  Clues: Witness statements, Dr. Mallory's log
- Captain Ivor Hale (Act 3, Scene 5): Alibi confirmed: from 10:45 to 11:30

**Culprit Revelation Scene (Act 3, Scene 6):**
Method: Confrontation with evidence

**Clue Placement for These Chapters:**
- clue_core_contradiction_chain must appear in Act 1, Scene 2 via Cross-check contradiction

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
- Chapter 2:
  - STRUCTURAL ARCHETYPE — Chapter 2 must be: FIRST_CONTACT
      ✓ MUST contain: at least two suspect interviews
      ✗ MUST NOT contain: physical evidence discovery
  - Word count: Target 1250 words. Achieve this through plot events, dialogue exchanges, and physical investigation — not through atmospheric repetition or extended internal reflection. Each 200-word segment should contain at minimum one concrete story event (a discovery, a conversation exchange, a physical action or movement). Padding with atmosphere alone is not acceptable.
  - Opening: Begin with a character action, spoken line, or clock/time marker — never a location name or location-description phrase.
  - Scene is set in: the study, shortly after the discovery — reference it naturally within the paragraph, never as your opening phrase.
  - Opening atmosphere (MANDATORY — validator enforced): the first paragraph MUST contain at least one of: rain / wind / fog / storm / mist / thunder / evening / morning / night / dawn / dusk / season / afternoon / midday / noon / midnight / twilight / sunrise / sunset / daylight / sunlight / overcast / cloudy / bright / dark / grey / pale / cold / warm / chill / crisp / damp / drizzle / haze / lamplight / firelight. A chapter that omits all of these from its opening paragraph will be rejected.
  - Continuity bridge: in the first 120 words, visibly connect from the previous chapter's final beat. Carry forward one unresolved element (object, accusation, emotional pressure, or immediate physical action) from: "Hours passed like minutes as they meticulously examined every corner of the study. The mustiness of old books filled the air, a scent that once brought comfort now felt oppressive. Eleanor's mind was a whirlwind of thoug...".
  - CLUE OBLIGATIONS — mandatory prose elements (do NOT omit or bury):
    • This suggests the time of death is later than it actually is. [clue_core_contradiction_chain] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: This contradicts the actual timeline of events surrounding the murder.
      ↳ MANDATORY TWO-PARAGRAPH STRUCTURE (must appear in paragraphs 1 or 2 — no later):
         Paragraph 1: The POV character physically approaches or directly observes this evidence.
           The narration or dialogue explicitly states what is seen (use the exact locked phrase if one applies).
         Paragraph 2 (immediately following): The detective or POV character explicitly reasons
           about what this evidence implies — who it implicates, why it may be unreliable,
           or what inference it supports. This must be a separate full paragraph, not a sentence appended to Paragraph 1.
    • The note's timestamp contradicts the clock's reading. [clue_4] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: This highlights inconsistencies in the timeline.
      ↳ MANDATORY TWO-PARAGRAPH STRUCTURE (must appear in paragraphs 1 or 2 — no later):
         Paragraph 1: The POV character physically approaches or directly observes this evidence.
           The narration or dialogue explicitly states what is seen (use the exact locked phrase if one applies).
         Paragraph 2 (immediately following): The detective or POV character explicitly reasons
           about what this evidence implies — who it implicates, why it may be unreliable,
           or what inference it supports. This must be a separate full paragraph, not a sentence appended to Paragraph 1.
    • Direct evidence ties Beatrice Quill to the mechanism access point before the discriminating test. [clue_culprit_direct_beatrice_quill] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: This direct evidence shows Beatrice Quill had means and opportunity, narrowing the solution uniquely toward the culprit.
      ↳ MANDATORY TWO-PARAGRAPH STRUCTURE (must appear in paragraphs 1 or 2 — no later):
         Paragraph 1: The POV character physically approaches or directly observes this evidence.
           The narration or dialogue explicitly states what is seen (use the exact locked phrase if one applies).
         Paragraph 2 (immediately following): The detective or POV character explicitly reasons
           about what this evidence implies — who it implicates, why it may be unreliable,
           or what inference it supports. This must be a separate full paragraph, not a sentence appended to Paragraph 1.
  - Tonal contrast: include at least one beat of relief or ironic counterpoint. Do not sustain maximum tension for every paragraph.
  - Sensory obligation — use at least two of: the warm glow of a desk lamp, the flicker of shadows on the wall | the quiet of the night, the distant rustle of leaves | the scent of a burning candle. Mood: foreboding clarity.
- Locked fact phrase obligations:
  - If this batch mentions The exact time shown on the stopped clock face, write exactly: "ten minutes past eleven".
  - If this batch mentions The exact amount the clock was wound back, write exactly: "forty minutes".
  - If this batch mentions The temperature in the room at the time of the murder, write exactly: "seventy degrees Fahrenheit".
  - If this batch mentions The time written on the note found with the victim, write exactly: "a quarter past twelve".
- Seasonal vocabulary allow-list: summer, summery, midsummer.
- Forbidden seasonal words: spring, autumn, winter.

FROZEN FACT STATE (DO NOT ALTER):
- Timeline anchor: August (summer).
- Month, season, weather, and time-of-year language in this batch must stay compatible with summer.
- Established timeline fact: 10:30 PM
- Established timeline fact: 11:15 PM
- If referenced, use exact phrase: "ten minutes past eleven" (The exact time shown on the stopped clock face).
- If referenced, use exact phrase: "forty minutes" (The exact amount the clock was wound back).
- If referenced, use exact phrase: "seventy degrees Fahrenheit" (The temperature in the room at the time of the murder).
- If referenced, use exact phrase: "a quarter past twelve" (The time written on the note found with the victim).

STORY TO DATE (REFERENCE ONLY — DO NOT COPY VERBATIM):
- Full prior chapter text is provided below for continuity, factual consistency, and reference accuracy.
- Use this to keep character voice, chronology, clue state, and location continuity aligned with earlier chapters.
- Do not quote, copy, or paraphrase these paragraphs too closely; write fresh prose that remains consistent with them.

--- BEGIN PRIOR CHAPTER 1 ---
Title: Chapter 1: Discovery
Eleanor Voss stepped into the study, her heart pounding in her chest as the soft patter of rain against the window echoed through the dimly lit room. The air felt thick with a sense of foreboding, a chill that seemed to seep into her bones. Shadows crept across the desk, where papers lay strewn about, remnants of a life that had been so vibrant just hours before. She hesitated, her fingers brushing against the smooth wood of the desk, as if seeking comfort in the familiar touch. It was then that she noticed the clock on the wall, its hands frozen in time, revealing a stark truth: the clock in the study shows ten minutes past eleven.

As Eleanor approached the clock, the implications struck her like a bolt of lightning. If the clock was accurate, then it meant that Eleanor had died no later than ten minutes past eleven. The realization sent a shiver down her spine, for it contradicted the alibis of those who had been present that evening. Each suspect had claimed to be elsewhere, yet the timepiece bore witness to a different reality. How could they account for this? The tension in the room thickened, and Eleanor felt the weight of suspicion settle upon her shoulders.

Beatrice Quill entered the study, her face pale and drawn. She stood frozen in the doorway, her hand trembling as she clutched a book of poetry, the pages crumpling beneath her grip. "Eleanor?" she called hesitantly, her voice barely above a whisper. The sight of her friend’s lifeless body sprawled across the floor sent a wave of nausea crashing over her. Beatrice rushed forward, her heart racing as she knelt beside the still form. "Oh, no... What has happened?"

Eleanor knelt beside Beatrice, her eyes wide with disbelief. The lifeless body of their friend lay before them, a tragic tableau that seemed to mock their earlier laughter. A note clutched in Eleanor's hand caught Beatrice's attention, and she gently pried it free. The note, written in hurried script, stated a meeting time of midnight. "A quarter past twelve," Beatrice read aloud, her voice trembling. "Why would she have written this?"

Eleanor's mind raced as she processed the implications of the note. If Eleanor had intended to meet someone at midnight, it suggested that she had been alive well past the time indicated on the clock. The contradiction gnawed at her, raising questions that demanded answers. Who had been with Eleanor in those final moments? And why had the clock stopped at such a critical juncture? The study, once a sanctuary of ideas and creativity, now felt like a prison of secrets.

Beatrice's gaze darted around the room, taking in the disarray. "We must call for help," she said, her voice steadier now. But Eleanor shook her head, a sense of urgency gripping her. "No, not yet. We need to understand what happened here first. If we involve others too soon, we risk losing control of the narrative. We must piece together the truth ourselves."

The weight of their task loomed over them, but Eleanor felt a flicker of determination ignite within her. They had to uncover the truth before anyone else arrived. The clock, the note, and the lifeless body were all pieces of a puzzle that needed to be solved. As they began to search the room for clues, the rain continued to fall outside, a relentless reminder of the storm that had descended upon their lives.

Hours passed like minutes as they meticulously examined every corner of the study. The mustiness of old books filled the air, a scent that once brought comfort now felt oppressive. Eleanor's mind was a whirlwind of thoughts, each one more troubling than the last. What had transpired in this room? Who had the most to gain from Eleanor's demise? As they delved deeper into the mystery, the tension between them began to shift, revealing the cracks in their friendship that had long been hidden beneath the surface.
--- END PRIOR CHAPTER 1 ---

[SCENE COMPLETENESS CONTRACTS — MANDATORY. Each contract below lists what you MUST enact in that chapter. Do not summarise or mention these labels in the prose — enact them organically.]
Chapter 2 (Act 1) completeness contract:
  PIVOT ELEMENT (MANDATORY — write this into the prose, shown not told): "The note found in Eleanor's hand stating a quarter past twelve"
  FACT ESTABLISHED (MANDATORY — reader must know this by chapter end): "Establishes a contradiction between the note's timestamp and the clock's reading."

# Case Overview
Title: The Clockwork Conspiracy
Era: 1930s
Setting: Little Middleton
Crime: murder (mechanical tampering)
Culprit: Beatrice Quill
False assumption: The murder must have occurred after the clock showed the time of eleven o'clock.
Cast: Eleanor Voss (she/her), Dr. Mallory Finch (she/her), Captain Ivor Hale (he/him), Beatrice Quill (she/her)

Setting Lock: Keep all scenes and descriptions consistent with the stated setting (Little Middleton). Do not introduce a different location type.

Outline scenes:
[
  {
    "sceneNumber": 2,
    "act": 1,
    "title": "Initial Investigation",
    "setting": {
      "location": "the study, shortly after the discovery",
      "timeOfDay": "Morning",
      "atmosphere": "Dread and confusion permeate the air"
    },
    "characters": [
      "Eleanor Voss",
      "Beatrice Quill"
    ],
    "purpose": "Establish the setting and initial clues",
    "cluesRevealed": [
      "clue_4",
      "clue_culprit_direct_beatrice_quill"
    ],
    "dramaticElements": {
      "conflict": "The tension between the friends grows as they try to piece together the last moments of Eleanor's life.",
      "tension": "A note found in the victim's hand raises questions about her final intentions.",
      "microMomentBeats": [
        "Eleanor glances at Beatrice, her eyes filled with a mix of fear and determination."
      ]
    },
    "summary": "Eleanor and Beatrice begin to piece together the events leading to Eleanor's death. They find a note in the victim's hand that states a meeting time of a quarter past twelve, contradicting the clock's reading.",
    "estimatedWordCount": 1800,
    "pivotElement": "The note found in Eleanor's hand stating a quarter past twelve",
    "factEstablished": "Establishes a contradiction between the note's timestamp and the clock's reading.",
    "permittedBehavioursByAct": [
      {
        "characterName": "Eleanor Voss",
        "behaviour": "normal social behaviour; grief or confusion if appropriate"
      },
      {
        "characterName": "Beatrice Quill",
        "behaviour": "normal social behaviour; grief or confusion if appropriate"
      }
    ],
    "redHerringPlacement": null,
    "emotionalRegister": "The mounting suspicion and emotional cost of investigation begin to fracture friendships.",
    "dominantCharacterNote": {
      "name": "Eleanor Voss",
      "voiceRegister": "Eleanor's speech is smooth and melodic, often laced with euphemisms and soft laughter that masks her underlying anxiety."
    },
    "humourGuidance": {
      "permission": "forbidden"
    },
    "eraTextureNote": "Limited communication technology hampers the rapid spread of news.; Transportation relies on petrol-powered vehicles, which are less accessible due to fuel shortages.; Social mobility is restricted by strict class divisions and societal expectations.; Weather conditions frequently disrupt travel plans and outdoor activities.; Frequent rain contributes to a gloomy atmosphere, affecting outdoor social events.",
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
□ Chapter 2: "This suggests the time of death is later than it actually is." is placed in the first 25% of the chapter, followed by an explicit inference or suspicion paragraph.
□ Chapter 2: "The note's timestamp contradicts the clock's reading." is placed in the first 25% of the chapter, followed by an explicit inference or suspicion paragraph.
□ Chapter 2: "Direct evidence ties Beatrice Quill to the mechanism access point before the discriminating test." is placed in the first 25% of the chapter, followed by an explicit inference or suspicion paragraph.
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
