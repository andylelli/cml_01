# Actual Prompt Record

- Run ID: `mystery-1778962544048`
- Project ID: ``
- Timestamp: `2026-05-16T20:19:56.180Z`
- Agent: `Agent9-ProseGenerator-Ch5`
- Operation: `chat_request_full_prompt`
- Model: `GPT-4o-mini`
- Temperature: `0.42`
- Max Tokens: `4500`
- Attempt: `first`
- Prompt Hash: `0596a6e1bd9211f6`

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
- MORAL COMPLEXITY REQUIREMENT: The mechanism of this crime carries a moral gray area: "The murderer acted out of a misguided sense of loyalty to protect a loved one." — the culprit reveal and denouement MUST acknowledge this ambiguity. Do not let the ending feel clean or simple. Give the reader at least one moment of uncomfortable sympathy or moral doubt.


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

## Era: 1935-06
Living through June 1935 in England is marked by an oppressive atmosphere where the Great Depression looms heavily over daily life. The smell of damp earth from recent rains mingles with the scent of blooming wildflowers, yet the laughter of garden parties belies the underlying tensions. Class disparities are stark as families navigate financial strain while upholding their social status. The rising political tensions regarding fascism in Europe add an uncomfortable layer to social gatherings, fostering an air of suspicion and anxiety. Conversations are laced with unspoken fears, as the specter of unemployment and economic instability creates a palpable tension among the guests at Little Middleton Manor, making every interaction fraught with the potential for conflict and revelation.
Emotional register: A collective anxiety permeates society as individuals grapple with economic uncertainty and the fragility of social structures.
Physical constraints: Mud from recent rains complicating movement around the estate. | Limited communication options due to economic conditions. | The isolation of Little Middleton Manor from nearby towns.
Current tensions (weave into background texture): Growing class disparity exacerbated by the Great Depression. | Political discussions surrounding the rise of fascism in Europe. | Debates over women's rights and roles in the workplace.
Wartime context — ...: ... Absence effect: ...

## Story Theme
The intricate interplay of personal ambition and social obligation reveals how hidden secrets can unravel lives in a time of economic despair, and reveals that evidence carries ethical weight, forcing characters to choose accountability over social performance when appearances and facts collide.

## Story Emotional Register
Dominant: The story oscillates between tension and revelation, culminating in a poignant exploration of ambition and integrity.

Arc:
The story begins in an atmosphere thick with tension as guests gather at Little Middleton Manor for a family reunion, where Eleanor Voss’s murder becomes the focal point of a web of suspicion. As the investigation unfolds, initial clues cast doubt on several guests, each grappling with personal stakes in the wake of the tragedy. The emotional cost rises as guilt and fear surface, complicating the dynamics among the characters. A pivotal moment occurs when inconsistencies in witness statements emerge, forcing Eleanor's allies to confront their own secrets while redirecting suspicion. The revelation of the clock’s tampering recontextualizes earlier events, exposing the underlying motivations of the suspects. As pressure mounts, the climax sees a confrontation that lays bare the characters' true natures, revealing the lengths to which they will go to protect themselves. In the resolution, the emotional toll of the evening leaves lasting scars on each character, reshaping their relationships and underscoring the fragility of their social dynamics, ultimately questioning whether truth can truly set them free.

The story opens: The atmosphere is thick with anticipation, setting the stage for hidden tensions. As the investigation takes shape: Initial investigations raise anxiety as secrets threaten to surface. A first key turn arrives: Inconsistencies in alibis create a shift in focus, heightening suspense. At the mid-point of the story: The revelation of the clock's tampering pivots the investigation in a new direction.

A second pivot reshapes the course: Confrontations reveal deep-seated motives, intensifying the drama. As tension reaches its height: The pressure mounts as characters grapple with their choices and consequences. The climax brings the central question to a head: A final confrontation exposes the true nature of ambition and betrayal. In the final resolution: The emotional aftermath leaves characters changed, questioning their values and relationships.

Underpinning every turn is the story's central concern: The intricate interplay of personal ambition and social obligation reveals how hidden secrets can unravel lives in a time of economic despair. This thread binds the individual emotional moments into a coherent journey.

The dominant register — The story oscillates between tension and revelation, culminating in a poignant exploration of ambition and integrity. — colours the prose from first chapter to last, ensuring the reader feels the weight of each revelation as moral consequence rather than mere puzzle mechanics.

## Emotional register at this point in the story
The revelation of the clock's tampering pivots the investigation in a new direction.

## Character Portraits (appearance & era)

### Eleanor Voss
Eleanor Voss embodies the struggles of the upper class during the Great Depression, hosting soirées while desperately trying to maintain her family's reputation amidst financial turmoil. Her charm masks a deep-seated fear of scandal that could unravel her carefully constructed world, making her a poignant reflection of the pressures faced by women in this era.
Era intersection: Her private situation is a direct consequence of the socio-economic landscape, where the need for social standing clashes with the harsh realities of financial insecurity.

### Dr. Mallory Finch
Dr. Mallory Finch represents the ethical dilemmas faced by professionals under economic strain, as her desperation to maintain her practice leads her to questionable decisions. Her public persona as a caring physician contrasts sharply with the moral compromises she makes, illustrating the broader struggle of individuals striving to navigate a collapsing economy.
Era intersection: Her situation highlights the impact of the Great Depression on professionals, where financial pressures often compromise ethical standards.

## Character Voices

### Eleanor Voss (she/her/her)
Eleanor speaks with a polished, almost lyrical quality, often peppering her conversation with subtle sarcasm.
[comfortable] Ah, darling, the garden is simply radiant this evening, isn't it?
[evasive] Oh, I wouldn't worry too much about that; it’s just an old family tale.
[stressed] I just need everything to go perfectly this time; there’s too much at stake.
Humour: Her dry wit often lightens tense moments, but she uses it sparingly.

### Dr. Mallory Finch (she/her/her)
Mallory's voice is soothing and measured, often punctuated with self-deprecating remarks.
[comfortable] Honestly, I’m just a simple doctor trying to keep up with life’s demands.
[evasive] Oh, that’s nothing; you should see my failures piled high!
[stressed] I swear, if one more patient walks in with unrealistic expectations, I might just scream.
Humour: Her self-deprecating humor serves to deflect the pressure she feels.

## Location Registers (scene framing guides)

The Drawing Room: The drawing room is filled with a vibrant energy, yet an undercurrent of tension ripples beneath the surface. Conversations buzz with excitement, but the weight of unspoken secrets lingers in the air, making every laugh feel precarious.. Camera angle: Entering this space feels like stepping into a world of both charm and anxiety, where the facade of elegance hides the turmoil beneath.. Era: The overcast skies contribute to a melancholic atmosphere, contrasting with the lively social interaction inside.

The Study: The study feels like a sanctuary shrouded in secrets, where the ticking clock serves as a constant reminder of time slipping away. The scent of polished wood and ink creates an atmosphere of contemplation, yet the tension of the outside world seeps in, making it feel both inviting and foreboding.. Camera angle: This space invites introspection, encouraging the writer to explore the hidden truths that lurk within.. Era: The room's cozy feel is heightened by the era's reliance on manual labor and the scent of ink, evoking a sense of nostalgia.

The Library: The library is dimly lit, filled with the scent of old leather and dust, creating an atmosphere thick with history. The silence is punctuated by the crackling fire, inviting whispers and secrets, but also a palpable sense of dread as the tension builds.. Camera angle: Entering this space evokes a sense of foreboding, as if the very walls are witnesses to the unfolding drama.. Era: The library's isolated feel reflects the societal constraints of the era, where knowledge is power but also a burden.

## Humour guidance for this story position (mid)
Permission: permitted
Rationale: The investigation's progression may invite some levity among characters.

## Character Pressure
Dr. Mallory Finch is approaching a point of breakdown. Stress and strain should be accumulating visibly — through behaviour, not statement. No confrontation yet.

## Reveal Groundwork (texture — do not explain, only plant)
- Plant one subtle observable beat related to: "The moment when Eleanor first suspects Dr". Do not explain significance yet.
- Plant one subtle observable beat related to: "Finch is retroactively colored by the hidden-truth of her financial desperation". Do not explain significance yet.
- Plant one subtle observable beat related to: "The guests' laughter in the drawing room now feels hollow in light of the murder". Do not explain significance yet.

FAIR-PLAY AND INFERENCE CONTRACT (from CML logic):
- False assumption in force: The murder happened exactly at midnight as everyone claims.
- Hidden truth to progressively expose: The clock was deliberately set back by the murderer to create confusion.
- Inference path checkpoints to dramatize clearly (observation -> correction -> effect):
  - Step 1: obs: The clock in the study shows ten minutes past eleven. | corr: This contradicts the witness statements that claim the murder happened at midnight. | effect: Narrows the timeline for the murder, eliminating any suspect who had an alibi before 11:30 PM.
  - Step 2: obs: Guests heard the clock chime at odd intervals. | corr: This suggests tampering, indicating that the clock was not reliable. | effect: Eliminates Captain Hale's alibi, as he was in the garden when the clock chimed.
  - Step 3: obs: A note indicating 'forty minutes' is found near the clock. | corr: This suggests the murderer planned to create a specific alibi. | effect: Narrows down the suspect pool to Dr. Finch, who has a motive tied to financial gain.
- Discriminating test method: trap
- Discriminating test design constraint: A controlled comparison is conducted between the clock's chime and the time of Dr. Finch's alibi, revealing inconsistencies that prove she could not have been in the study at the time of the murder.
- Test must rely on already-shown clue IDs: clue_1, clue_2, clue_3, clue_mechanism_visibility_core, clue_5
- Fair-play rationale: Step 1: The clock's time setting (early) and witness statements (mid) let the reader separate the real timeline from the false one. Step 2: The chime interval observations (mid) eliminate Captain Hale based on the timing. Step 3: The note found next to the clock (discriminating test) proves Dr. Finch's premeditated tampering.
- Never solve by withheld information. Keep reader-information parity with detective reasoning.

## Character Reference

### Eleanor Voss (she/her — NEVER he/him)
Eleanor speaks with a polished, almost lyrical quality, often peppering her conversation with subtle sarcasm and a knowing smile
She has a tendency to raise an eyebrow when she finds something particularly amusing or absurd, often leaving her listeners guessing.
Eleanor grapples with the fear that her efforts to protect her family may expose her own failures and the truth of her past. She feels the weight of responsibility not only for her family’s reputation but for her own sense of self-worth.

### Dr. Mallory Finch (she/her — NEVER he/him)
Mallory often speaks in a soothing, measured tone, frequently punctuating her sentences with self-deprecating remarks to lighten the mood
She has a habit of nervously adjusting her glasses when she feels the pressure mounting, and her laughter often comes with a hint of nervousness, as if she’s trying to convince herself that everything will be alright.
Mallory is torn between her ambition and her ethical principles, grappling with guilt over her actions while desperately trying to maintain her façade of a dedicated healer.


## CHARACTER CONTRACTS (binding for this scene)
Each entry below constrains how this character must be written in this chapter.
These override generic style guidance when they conflict.

### Eleanor Voss[SHE]
Voice & mannerisms: Eleanor speaks with a polished, almost lyrical quality, often peppering her conversation with subtle sarcasm and a knowing smile. She has a tendency to raise an eyebrow when she finds something particularly amusing or absurd, often leaving her listeners guessing.
Sample voice fragments (match this register and rhythm):
  [comfortable] "Ah, darling, the garden is simply radiant this evening, isn't it?"
  [evasive] "Oh, I wouldn't worry too much about that; it’s just an old family tale."
Humour: dry wit — deploy occasionally (level 0.5)
FORBIDDEN phrase (never write for Eleanor Voss): "a surge of determination washed over her"
Act 2 behaviour contract: May show unease, evasion, or mild defensiveness when questioned. One behavioural tell is permitted. Internal conflict emerging: "Eleanor grapples with the fear that her efforts to protect her family may expose her own failures and the truth of her past. She feels the weight of responsibility not only for her family’s reputation but for her own sense of self-worth."

### Dr. Mallory Finch[SHE]
Voice & mannerisms: Mallory often speaks in a soothing, measured tone, frequently punctuating her sentences with self-deprecating remarks to lighten the mood. She has a habit of nervously adjusting her glasses when she feels the pressure mounting, and her laughter often comes with a hint of nervousness, as if she’s trying to convince herself that everything will be alright.
Sample voice fragments (match this register and rhythm):
  [comfortable] "Honestly, I’m just a simple doctor trying to keep up with life’s demands."
  [evasive] "Oh, that’s nothing; you should see my failures piled high!"
Humour: self deprecating — deploy occasionally (level 0.4)
FORBIDDEN phrase (never write for Dr. Mallory Finch): "she knew with certainty she was right"
Act 2 behaviour contract: May show unease, evasion, or mild defensiveness when questioned. One behavioural tell is permitted. Internal conflict emerging: "Mallory is torn between her ambition and her ethical principles, grappling with guilt over her actions while desperately trying to maintain her façade of a dedicated healer."



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
Little Middleton Manor stands as a grand but isolated estate, steeped in secrets and ripe for mystery amidst the tensions of the 1930s.

Key Locations Available:
- The Library (interior): Crime scene
- The Drawing Room (interior): Gathering space
- The Stable (exterior): Clue discovery
- The Study (interior): Clue discovery

Atmosphere: Tense due to underlying social tensions and recent economic hardships.
Weather: Overcast with occasional rain, typical for the season, causing muddy conditions outside.

Era markers: Petrol touring cars parked in the courtyard | Typewriters clacking in the study | Frequent power outages from domestic wiring

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
  - Visual: Books stacked haphazardly on tables, Flickering shadows cast by the fireplace, Dust motes dancing in the air
  - Sounds: Crackling firewood, The rustle of turning pages, Distant thunder rumbling outside
  - Scents: Old leather bindings, Beeswax from the candles, Damp stone from the walls
  - Touch: Worn leather armchair, Cold marble floor beneath bare feet

The Drawing Room (interior):
  - Visual: Richly patterned wallpaper peeling at the seams, Glistening crystal chandelier, Portraits of stern ancestors gazing down
  - Sounds: Muffled conversation and laughter, The soft notes of piano music, The rustle of silk dresses
  - Scents: Freshly brewed tea, Scent of polished wood, A hint of lavender from potpourri
  - Touch: Soft velvet cushions, Cool porcelain teacups

The Stable (exterior):
  - Visual: Dull light filtering through dusty windows, Shadows of horses moving in their stalls, Old tack and tools hanging on the walls
  - Sounds: Soft whinnies of horses, The crunch of hay underfoot, The creak of wooden beams
  - Scents: Horse sweat and hay, The musty odor of old wood, Fresh earth from outside
  - Touch: Rough wood of the stalls, Cool metal bits of tack

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

- Living through June 1935 in England is marked by an oppressive atmosphere where the Great Depression looms heavily over daily life
- The smell of damp earth from recent rains mingles with the scent of blooming wildflowers, yet the laughter of garden parties belies the underlying tensions
- Class disparities are stark as families navigate financial strain while upholding their social status
- The rising political tensions regarding fascism in Europe add an uncomfortable layer to social gatherings, fostering an air of suspicion and anxiety
- Conversations are laced with unspoken fears, as the specter of unemployment and economic instability creates a palpable tension among the guests at Little Middleton Manor, making every interaction fraught with the potential for conflict and revelation.

TEMPORAL CONTEXT:

This story takes place in June 1935 during summer.

Seasonal Atmosphere:
- Weather patterns: overcast skies, occasional rain, muddy conditions
- Daylight: Long days with fading light by nine o'clock, yet the clouds often obscure the sun.
- Seasonal activities: garden parties, picnics in the countryside, fishing expeditions
- Seasonal occasions: Midsummer's Day (June 24)
- Season: summer

Period Fashion (describe naturally):
- Men formal: tailored three-piece suit in grey flannel, white dress shirt with a stiff collar, dark tie with subtle patterns
- Men casual: linen trousers, short-sleeved cotton shirt, boater hat
- Men accessories: pocket watch, cufflinks, leather shoes polished to a shine
- Women formal: elegant tea dress made of floral chiffon, light cardigan for cooler evenings, wide-brimmed sun hat
- Women casual: sleeveless blouse paired with a mid-calf skirt, cotton dungarees for outdoor activities, simple sandals
- Women accessories: beaded clutch purse, string of pearls, light shawl

Cultural Context (reference naturally):
- Music/entertainment: 'Night and Day' by Cole Porter, 'The Way You Look Tonight' by Jerome Kern, Jelly Roll Morton's jazz tunes; Films: 'A Midsummer Night's Dream' (1935), 'The 39 Steps'; Theatre: 'Pygmalion' by George Bernard Shaw, 'The Cat and the Canary'; Radio: BBC news broadcasts, various musical variety shows
- Typical prices: loaf of bread: four pence, newspaper: one penny, bottle of milk: two pence
- Current events: intensifying political discussions regarding the rise of fascism in Europe; debates in Parliament over unemployment benefits
- Literature: 'The Maltese Falcon' by Dashiell Hammett | 'The Good Soldier' by Ford Madox Ford | 'Murder in the Mews' by Agatha Christie | [detective fiction] | [social realism] | [historical novels]
- Technology: the first practical television | the rise of household appliances like electric irons | improved radio transmission technology | vacuum cleaners | typewriters | automobiles
- Daily life: attending garden parties, going to the cinema, participating in summer fairs
- Social rituals: afternoon tea with friends, polo matches on weekends

Atmospheric Details:
The scent of wet earth and blooming wildflowers mingles in the air, punctuated by the distant sound of thunder. The dim light of the evening casts long shadows, creating a sense of mystery that envelops the estate. Occasional laughter from the garden contrasts sharply with hushed whispers of economic despair echoing through the grand halls.

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
- Authentic references: Use actual songs, films, events from the
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

• [clue_6] Dr. Mallory Finch was seen preparing documents related to financial matters.
  Category: behavioral | Criticality: essential | Supports inference step 3
  Points to: This indicates a motive for financial gain.

• [clue_core_elimination_chain] Eliminates Captain Ivor Hale because he was seen at a different location during the time of the murder.
  Category: testimonial | Criticality: essential | Supports inference step 2
  Points to: This confirms Captain Ivor Hale's alibi.

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

CLUES ALREADY REVEALED TO READER: clue_1, clue_2, clue_3, clue_culprit_direct_dr_mallory_finch, clue_mechanism_visibility_core, clue_4, clue_5 — do not reveal these as new information.

INVESTIGATION LOG — WHAT IS ESTABLISHED (do not re-establish, do not repeat):
• Evidence in reader's hands: The clock in the study shows ten minutes past eleven. | This contradicts the witness statements that claim the murder happened at midnight. | Guests heard the clock chime at odd intervals. | Direct evidence ties Dr. Mallory Finch to the mechanism access point before the discriminating test. | A clock was manipulated to false time settings to mislead witnesses and create a false timeline. | A note indicating 'forty minutes' is found near the clock. | This suggests the murderer planned to create a specific alibi.
• Suspects still unresolved: Eleanor Voss[SHE], Captain Ivor Hale[HE], Beatrice Quill[SHE]
⚠ The story must move FORWARD from this log. Any beat already listed above is forbidden from repeating.

⚠ THIS CHAPTER'S REQUIRED ADVANCE (mid): Test one suspect's alibi against a known fact — result must be stated

CONTINUITY HANDOFF — previous chapter closing beat:
  • "Hale managed a weak smile, but the tension remained. "Yes, the garden is quite lovely. But we cannot forget the matter at hand. I will do everything I can to help you find the truth, Eleanor. You have my word." Her sincerity was evident, yet Eleanor couldn't s..."
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
study, garden, flat

✓ RULE: Continue using this location vocabulary. Maintain consistency with established setting type.
✓ Do NOT introduce new location types that contradict earlier chapters.

**Recent Chapter Summary (for narrative continuity):**
Chapter 2: Chapter 2: Witness Statements
  Events: "I simply cannot believe this is happening," Eleanor Voss said, her voice trembling slightly as she stepped into the living room.
Chapter 3: Chapter 3: The Note
  Events: Eleanor approached the clock, her fingers trembling slightly as she picked up a note that had been tucked beneath it.
Chapter 4: Chapter 4: Interrogation of Hale
  Events: The afternoon light filtered through the overcast sky, casting a muted glow over the garden.

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
Known location profile anchors: Little Middleton Manor, The Library, The Drawing Room, The Stable, The Study, Dr. Finch's office
LOCATION NAME CAPITALISATION (HARD REQUIREMENT — validated):
All named locations in your prose MUST use the EXACT capitalisation from the CML profiles.
Canonical forms: "Little Middleton Manor", "The Library", "The Drawing Room", "The Stable", "The Study", "Dr. Finch's office"
Writing a location in lowercase (e.g. "drawing room" instead of "Drawing Room") is a validated error. Every time you mention a named location, copy its capitalisation from the list above.
- Chapter 5: OPENING STYLE (HARD): Start the VERY FIRST SENTENCE with a temporal subordinate clause — e.g. "When [Name] entered…" / "After the last guest…" / "Before the household had stirred…" / "As the light faded…". Anchor opening in "Dr. Finch's office". HARD REQUIREMENT for the first 2 paragraphs: (a) include 2+ sensory words — choose from smell/scent/sound/echo/silence/creak/whisper/cold/warm/damp/rough/smooth/glow/shadow/flicker/dim — and (b) include 1+ atmosphere/time word — choose from rain/wind/fog/storm/mist/thunder/evening/morning/night/dawn/dusk/season/afternoon/midday/noon/midnight/twilight/sunrise/sunset/daylight/sunlight/overcast/cloudy/bright/dark. These are validated requirements, not style suggestions; missing them triggers a retry.

[⚠ INTERNAL QUALITY DIAGNOSTICS — DO NOT REPRODUCE ANY PART OF THIS SECTION IN YOUR STORY OUTPUT. These are private generator observations for your consideration only. Your narrative must read as if this section does not exist. Never include phrases from this block in character dialogue, narration, or description.]

PRIOR CHAPTER QUALITY OBSERVATIONS:
- Chapter 3 (score 89/100):
  Quality gaps noted: word density below preferred target (753/1000); scene grounding weakness
  Address in upcoming chapters: Increase chapter density with concrete investigation action and sensory-grounded beats; avoid recap-only padding. | Open next chapter with a named location anchor plus at least two sensory cues and one atmosphere marker.
- Chapter 4 (score 90/100):
  Quality gaps noted: word density below preferred target (763/1000); scene grounding weakness
  Address in upcoming chapters: Increase chapter density with concrete investigation action and sensory-grounded beats; avoid recap-only padding. | Open next chapter with a named location anchor plus at least two sensory cues and one atmosphere marker.
- Phrases to avoid (already overused in earlier chapters): "felt a flicker of irony at the", "a flicker of irony at the thought", "flicker of irony at the thought that".
[END INTERNAL DIAGNOSTICS]

PROMPT BUDGET SUMMARY: budget=32000 tokens; fixed=9265; context=10551; dropped=[none]; truncated=[pronoun_accuracy, temporal_context]

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
8. Integrate at least two concrete era-grounded details per chapter from setting refinement signals: petrol touring cars on county roads | domestic wiring with frequent outages | typewriters in use for correspondence | party-line telephone exchanges common in rural areas | telegrams for urgent messages via local post offices | airmail services available for faster correspondence.
9. Respect setting movement/access constraints in scene action and alibis: manor architecture limits access to certain areas, such as the library and cellar | worn paths between buildings dictate movement patterns | weather conditions can hinder outdoor investigations | permission needed to enter restricted areas such as the study and master bedroom | daily routines dictate when certain areas are occupied or accessible.
10. Sustain social coherence with this backdrop pressure: A gathering at the estate for a family reunion amidst the economic strain of the Great Depression reveals hidden tensions and secrets, binding the guests in a web of suspicion and social obligation.
11. Maintain continuity around these socially central cast anchors where relevant: Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill.
12. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Critical: Plot similarity 0.75 with 'The Mysterious Affair at Styles' (same temporal aspect and murder method)
13. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Moderate: Character similarity 0.74 with 'The Sign of the Four' (similar cast structure and roles)
14. STORY TO DATE ANTI-COPY RULE: The STORY TO DATE section below is provided for chronological and factual reference ONLY. You MUST NOT copy, lightly rephrase, or structurally echo any sentence or paragraph from prior chapters. Every sentence in this chapter must be original prose unique to this scene. Reusing even a clause from prior chapter text will cause this attempt to fail immediately.

CRITICAL PROSE REQUIREMENTS:

The CML specifies exact requirements for certain validation-critical scenes. You MUST include these elements at the specified positions.

**Discriminating Test Scene (Act 3, Scene 4):**
Required elements: Execute the discriminating test, Observe the culprit's reaction or result, Draw conclusion about guilt
Test type: trap

**Suspect Clearance Scenes:**
- Captain Ivor Hale (Act 3, Scene 5): His alibi is corroborated by other guests.
  Clues: clue_2
- Beatrice Quill (Act 3, Scene 5): Her whereabouts are confirmed by kitchen staff.
  Clues: clue_3

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
  - Opening: Begin with a character action, spoken line, or clock/time marker — never a location name or location-description phrase.
  - Scene is set in: Dr. Finch's office — reference it naturally within the paragraph, never as your opening phrase.
  - Opening atmosphere (MANDATORY — validator enforced): the first paragraph MUST contain at least one of: rain / wind / fog / storm / mist / thunder / evening / morning / night / dawn / dusk / season / afternoon / midday / noon / midnight / twilight / sunrise / sunset / daylight / sunlight / overcast / cloudy / bright / dark. A chapter that omits all of these from its opening paragraph will be rejected.
  - Continuity bridge: in the first 120 words, visibly connect from the previous chapter's final beat. Carry forward one unresolved element (object, accusation, emotional pressure, or immediate physical action) from: "Hale managed a weak smile, but the tension remained. "Yes, the garden is quite lovely. But we cannot forget the matter at hand. I will do everything I can to help you find the truth, Eleanor. You have my word." Her since...".
  - CLUE OBLIGATIONS — mandatory prose elements (do NOT omit or bury):
    • Dr. Mallory Finch was seen preparing documents related to financial matters. [clue_6]
      Points to: This indicates a motive for financial gain.
    • Eliminates Captain Ivor Hale because he was seen at a different location during the time of the murder. [clue_core_elimination_chain]
      Points to: This confirms Captain Ivor Hale's alibi.
  - Tonal contrast: include at least one beat of relief or ironic counterpoint. Do not sustain maximum tension for every paragraph.
- Locked fact phrase obligations:
  - If this batch mentions The exact time shown on the stopped clock face, write exactly: "ten minutes past eleven".
  - If this batch mentions The exact amount the clock was wound back, write exactly: "forty minutes".
- Seasonal vocabulary allow-list: summer, summery, midsummer.
- Forbidden seasonal words: spring, autumn, winter.

FROZEN TIMELINE STATE (DO NOT ALTER):
- Timeline anchor: June (summer).
- Month, season, weather, and time-of-year language in this batch must stay compatible with summer.
- Established timeline fact: The clock shows incorrect time
- Established timeline fact: Witness statements contradict clock
- If referenced, use exact time phrase: "ten minutes past eleven" (The exact time shown on the stopped clock face).
- If referenced, use exact time phrase: "forty minutes" (The exact amount the clock was wound back).

STORY TO DATE (REFERENCE ONLY — DO NOT COPY VERBATIM):
- Full prior chapter text is provided below for continuity, factual consistency, and reference accuracy.
- Use this to keep character voice, chronology, clue state, and location continuity aligned with earlier chapters.
- Do not quote, copy, or paraphrase these paragraphs too closely; write fresh prose that remains consistent with them.

--- BEGIN PRIOR CHAPTER 1 ---
Title: Chapter 1: Discovery
Eleanor Voss stepped into the study, her heart racing as she took in the scene before her. The morning light filtered through the overcast sky, casting a muted glow across the room. The air was thick with tension, a palpable reminder of the tragedy that had unfolded just hours before. Raindrops trickled down the window, their soft patter echoing the anxiety that gripped her. She approached the clock, its hands frozen in time, and felt a chill run down her spine. It showed ten minutes past eleven.

The clock in the study showed ten minutes past eleven. Eleanor's breath caught in her throat as she stared at the hands, frozen in that moment. The implications were staggering. If the clock was accurate, it contradicted the timeline everyone had accepted—one that placed the murder at midnight. She turned to Dr. Finch, who stood nearby, her face pale and drawn. "This can't be right, can it?" Eleanor's voice trembled slightly, the weight of the situation pressing down on her.

Dr. Finch shook her head, her glasses slipping slightly down her nose. "Everyone believed the murder happened exactly at midnight," she replied, her voice barely above a whisper. The doctor’s eyes darted to the clock, then back to Eleanor, as if searching for an explanation. "But if this clock shows ten minutes past eleven, then..." Her words trailed off, leaving a heavy silence in their wake. Eleanor could see the gears turning in Dr. Finch's mind, the realization dawning that the timeline they had accepted was crumbling.

Eleanor took a deep breath, steadying herself against the desk. The room felt smaller, the shadows deeper. The clock’s stillness was a stark contrast to the chaos that had erupted in their lives. "What does this mean for us?" she asked, her voice steadier than she felt. The doctor’s eyes widened, and Eleanor could almost see the thoughts racing through her mind. They were caught in a web of suspicion, and each thread pulled tighter with every revelation.

Dr. Finch adjusted her glasses nervously, a habit Eleanor had noticed before. "It complicates things, Eleanor. If the murder happened before midnight, then we need to reconsider the alibis of everyone present. It shifts the focus away from what we thought we knew." Her voice was calm, but Eleanor could sense the underlying tension. The stakes were rising, and with them, the fear of what secrets might be uncovered.

Eleanor glanced around the study, her gaze landing on the overturned chair in the corner. It had been a struggle, that much was clear. The room was locked, raising questions about access. Who had been able to enter and exit without being seen? The thought sent a shiver down her spine. She could feel the weight of the situation pressing down on her, the responsibility of uncovering the truth heavy on her shoulders. "We need to find out who else was in the house at that time," she said, determination creeping into her voice.

Dr. Finch nodded, her expression serious. "Yes, but we must tread carefully. If we start pointing fingers too soon, we could alienate those who might help us. We need to gather information without raising suspicion." Eleanor appreciated the doctor’s caution, but the urgency of the situation gnawed at her. They were racing against time, and every moment counted. The clock's stillness seemed to mock them, a reminder of how quickly things could spiral out of control.

As they stood in the study, the rain continued to summer outside, a steady rhythm that matched the unease in Eleanor's heart. She felt a flicker of irony at the thought that the very clock meant to keep time had instead become a harbinger of chaos. With each tick of the invisible clock in her mind, she knew they were running out of time to unravel the truth. "Let’s start with the others. We need to speak with Captain Hale and Beatrice. They may have seen something that could help us," Eleanor suggested, her resolve strengthening. The investigation had begun, and there was no turning back.
--- END PRIOR CHAPTER 1 ---

--- BEGIN PRIOR CHAPTER 2 ---
Title: Chapter 2: Witness Statements
"I simply cannot believe this is happening," Eleanor Voss said, her voice trembling slightly as she stepped into the living room. The evening was thick with the scent of damp earth, a reminder of the relentless rain that had fallen all day. Shadows flickered across the room, cast by the dying light filtering through the windows. The atmosphere was charged with tension, as if the very walls were holding their breath in anticipation of what was to come. In the corner, a clock ticked steadily, a sound that felt almost mocking in the wake of the tragedy that had unfolded just hours before.

Eleanor turned her attention to Captain Hale, who stood with his arms crossed, his brow furrowed in deep thought. "You heard the clock strike twelve just before the murder, didn't you?" she asked, her eyes searching his face for any hint of uncertainty. Hale nodded, his expression resolute. "Yes, I did. I was in the hallway, and the clock chimed loudly. It was unmistakable."

As Eleanor listened, a chill ran down her spine. The clock in the study showed ten minutes past eleven. This contradicted the witness statements that claim the murder happened at midnight. The realization hit her like a cold wave, and she struggled to maintain her composure. If Hale's claim held true, then the timeline they had accepted was unraveling before his eyes. He needed more information, more clarity, to understand the implications of this revelation.

Eleanor's gaze shifted to Beatrice Quill, who stood nearby, fidgeting with her necklace, her eyes darting away from Eleanor's penetrating stare. "And you, Beatrice? Where were you at the time of the murder?" Eleanor pressed, her voice firm. Beatrice hesitated, her fingers trembling slightly as she toyed with the delicate chain. "I... I was in the garden, picking flowers. I didn’t hear anything unusual," she stammered, her voice barely above a whisper.

Eleanor narrowed her eyes, sensing the tension in Beatrice's voice. The young woman’s story felt rehearsed, too polished for the chaos of the situation. "In the garden? Even with the rain?" Eleanor asked, raising an eyebrow. Beatrice's gaze dropped to the floor, and Eleanor noted the way her shoulders tensed. It was as if Beatrice was hiding something, a secret buried beneath her charming exterior.

Captain Hale cleared his throat, breaking the silence that had settled in the room. "We all want to help, Eleanor. But if the clock shows ten minutes past eleven, then we need to reconsider our timelines. Perhaps we should focus on who else was in the house at that time," she suggested, her voice steady. Eleanor nodded, grateful for her support, but the unease remained. The conflicting witness statements about the time of the murder were only deepening the mystery.

Eleanor took a deep breath, steadying herself against the edge of the table. The weight of the investigation pressed down on her, and she felt the urgency of the moment. "We need to gather everyone’s alibis. If we can establish a timeline, we might uncover the truth behind this tragedy," she declared, her resolve hardening. The clock’s ticking seemed to echo her determination, a reminder that time was slipping away.

As the three of them stood in the living room, the rain continued to patter against the windows, a steady rhythm that mirrored the anxiety in Eleanor's heart. The shadows deepened, and she felt the weight of unspoken fears hanging in the air. Each conflicting statement added another layer of complexity to the investigation, and Eleanor knew they were treading on dangerous ground. The truth was out there, but it was obscured by layers of deception and fear.
--- END PRIOR CHAPTER 2 ---

--- BEGIN PRIOR CHAPTER 3 ---
Title: Chapter 3: The Note
As the rain continued to drum against the window panes, Eleanor Voss stepped back into the study, her heart racing with a mix of fear and determination. The late morning light struggled to penetrate the thick clouds, casting a muted glow across the room. The air was heavy with the scent of polished wood and ink, yet the tension that hung in the atmosphere felt almost palpable. Eleanor's eyes were drawn to the clock, its hands frozen in time, a stark reminder of the chaos that had unfolded just hours before. The implications of its stillness weighed heavily on her mind, and she could feel the urgency of the investigation pressing down on her. She needed answers, and she needed them now.

Eleanor approached the clock, her fingers trembling slightly as she picked up a note that had been tucked beneath it. The note read simply, 'forty minutes.' Her breath caught in her throat as she realized its significance. If the clock had been wound back by forty minutes, it could explain the discrepancies in the timeline surrounding the murder. The guests had all heard the clock chime at odd intervals, and now this note suggested a deliberate manipulation of time. Who would go to such lengths, and why? The thought sent a shiver down her spine, and she felt the weight of suspicion settle over her like a heavy cloak.

The revelation struck her like a bolt of lightning. If someone had tampered with the clock, it meant they were attempting to mislead the witnesses, to create a false timeline that could protect them from suspicion. Eleanor's mind raced as she recalled Dr. Finch's earlier presence in the study. She had been here, close to the clock, when Eleanor had first discovered its frozen hands. The direct evidence tied Dr. Finch to the mechanism access point before the discriminating test, and Eleanor couldn't shake the feeling that the doctor knew more than she was letting on.

Eleanor turned to Dr. Finch, who had just entered the study, her expression a mix of concern and confusion. 'Mallory, I found this note,' Eleanor said, holding it out for the doctor to see. 'It indicates that the clock was wound back by forty minutes. What do you make of it?' The tension in the room thickened as Dr. Finch's eyes widened, and Eleanor could see the gears turning in her mind. The doctor adjusted her glasses nervously, a habit Eleanor had come to recognize as a sign of distress. 'I... I don't know, Eleanor. This is troubling,' Dr. Finch replied, her voice barely above a whisper. 'If the clock was tampered with, it changes everything we thought we knew about the murder.'

Eleanor stepped closer, her voice steady but urgent. 'We need to understand who had access to the clock, Mallory. This could point us to the person responsible for the murder. If you were here, then you must have seen something or heard something that could help us.' The doctor hesitated, her gaze flickering to the clock before returning to Eleanor's searching eyes. 'I was here, but I was focused on other things. I didn’t notice anything unusual about the clock,' she said, her voice faltering. Eleanor sensed the unease in Dr. Finch's demeanor, and she couldn't help but wonder if the doctor was hiding something.

The atmosphere in the study felt charged, as if the very walls were holding their breath. Eleanor's heart raced as she pressed on, unwilling to let the moment slip away. 'We need to gather everyone’s alibis, Mallory. If we can establish a timeline, we might uncover the truth behind this tragedy,' she declared, her resolve hardening. The clock’s stillness seemed to mock them, a reminder of how quickly things could spiral out of control. 'Time is of the essence, and we cannot afford to let this slip through our fingers.'

As they stood in the study, the rain continued to patter against the windows, a steady rhythm that mirrored the anxiety in Eleanor's heart. She felt a flicker of irony at the thought that the very clock meant to keep time had instead become a harbinger of chaos. With each tick of the invisible clock in her mind, she knew they were running out of time to unravel the truth. 'Let’s start with the others. We need to speak with Captain Hale and Beatrice. They may have seen something that could help us,' Eleanor suggested, her determination unwavering. The investigation had begun, and there was no turning back.
--- END PRIOR CHAPTER 3 ---

--- BEGIN PRIOR CHAPTER 4 ---
Title: Chapter 4: Interrogation of Hale
The afternoon light filtered through the overcast sky, casting a muted glow over the garden. Eleanor Voss stood before Captain Hale, her heart racing with a mix of determination and unease. The air was thick with the scent of damp earth, remnants of the morning rain mingling with the fragrance of blooming roses. The garden, usually a sanctuary of beauty, now felt like a stage for a grim performance, the weight of the recent tragedy hanging over them like a dark cloud. As he studied Hale's expression, he felt a flicker of irony at the thought that they were discussing a murder amid such vibrant life.

Eleanor took a step closer, her voice steady but laced with urgency. "Captain Hale, you mentioned you were in the hallway when the clock struck midnight. But if the clock shows ten minutes past eleven, your timeline doesn’t hold up. Can you explain that?" He watched as Hale's brow furrowed, a flicker of discomfort crossing his face. He glanced at the clock tower in the distance, as if seeking solace in its presence, but the unease in his eyes betrayed him.

Hale cleared his throat, his posture stiffening. "I was indeed in the hallway, but I stepped outside for a moment to catch some fresh air. The clock chimed loudly, and I distinctly recall it being midnight. I would stake my reputation on it." His insistence felt rehearsed, a performance rather than a genuine recollection. Eleanor's instincts prickled, and she pressed on, determined to uncover the truth.

"You say you were outside, but did anyone see you?" Eleanor's tone was probing, her eyes searching her for any hint of deception. Hale hesitated, his gaze shifting away from him, and he sensed the tension thickening between them. "I... I don’t recall specifically. I was alone for a few moments, lost in thought. The rain was coming down, and I didn't pay much attention to the time. But I assure you, I was away from the house during the murder."

Eleanor felt a knot tighten in her stomach. Her story was full of holes, and she couldn't shake the feeling that she was hiding something. "Captain, the clock has been tampered with. It was wound back by forty minutes, which means the time you heard the chimes cannot be trusted. You must understand how serious this is." He watched as Hale's expression shifted, a flicker of realization dawning on him.

"Tampered?" Hale echoed, his voice dropping to a whisper. "You mean someone deliberately altered the time?" Eleanor nodded, her heart racing with the implications. If Hale had indeed been outside, then he could not have heard the clock strike midnight as he claimed. This revelation could unravel everything they thought they knew about the timeline of events.

Hale's eyes darted back to the clock tower, his jaw tightening. "I had no idea. But I swear I heard it chime. Perhaps it was just the wind playing tricks on me." Her attempt at a light-hearted tone fell flat, and Eleanor felt the weight of suspicion settle heavily in the air. She needed more than just her word; she needed evidence.

Eleanor took a deep breath, her resolve hardening. "We need to gather more information, Captain. If you were indeed outside, there must be someone who can corroborate your story. We cannot let this slip through our fingers. The truth must come to light, no matter how uncomfortable it may be." He felt a flicker of hope that they might still uncover the truth, but the shadows of doubt lingered in the corners of his mind.

As they stood in the garden, the tension between them palpable, Eleanor couldn't help but notice the contrast between the vibrant blooms around them and the dark cloud of suspicion that loomed over their conversation. The laughter of birds and the gentle rustle of leaves felt almost mocking in the face of such gravity. She forced a smile, attempting to lighten the mood. "It's a lovely day, despite everything, isn't it? Perhaps we should take a moment to appreciate the beauty around us before diving back into the chaos."

Hale managed a weak smile, but the tension remained. "Yes, the garden is quite lovely. But we cannot forget the matter at hand. I will do everything I can to help you find the truth, Eleanor. You have my word." Her sincerity was evident, yet Eleanor couldn't shake the feeling that there was more to her story than she was letting on. The clock's chimes echoed in her mind, a reminder that time was running out.
--- END PRIOR CHAPTER 4 ---

[SCENE COMPLETENESS CONTRACTS — MANDATORY. Each contract below lists what you MUST enact in that chapter. Do not summarise or mention these labels in the prose — enact them organically.]
Chapter 5 (Act 2) completeness contract:
  PIVOT ELEMENT (MANDATORY — write this into the prose, shown not told): "Financial documents scattered across Finch's desk"
  FACT ESTABLISHED (MANDATORY — reader must know this by chapter end): "Establishes that Finch may have had a financial motive related to the victim."

# Case Overview
Title: The Clockwork Deception
Era: 1930s
Setting: Little Middleton
Crime: murder (clock tampering)
Culprit: Dr. Mallory Finch
False assumption: The murder happened exactly at midnight as everyone claims.
Cast: Eleanor Voss (she/her), Dr. Mallory Finch (she/her), Captain Ivor Hale (he/him), Beatrice Quill (she/her)

Setting Lock: Keep all scenes and descriptions consistent with the stated setting (Little Middleton). Do not introduce a different location type.

Outline scenes:
[
  {
    "sceneNumber": 5,
    "act": 2,
    "title": "Uncovering Finch's Motive",
    "setting": {
      "location": "Dr. Finch's office",
      "timeOfDay": "Mid-afternoon",
      "atmosphere": "Quiet, with a sense of foreboding as secrets linger"
    },
    "characters": [
      "Eleanor Voss",
      "Dr. Mallory Finch"
    ],
    "purpose": "Explore Finch's potential motives and actions leading up to the murder",
    "cluesRevealed": [
      "clue_6",
      "clue_core_elimination_chain"
    ],
    "dramaticElements": {
      "conflict": "Finch's demeanor shifts as Eleanor presses her.",
      "tension": "Eleanor senses the pressure building.",
      "microMomentBeats": [
        "Finch's eyes dart nervously as Eleanor questions her about financial documents."
      ]
    },
    "summary": "Eleanor visits Dr. Finch's office to discuss her recent financial troubles. Finch's discomfort suggests there may be more to her motivations than she admits.",
    "estimatedWordCount": 1800,
    "pivotElement": "Financial documents scattered across Finch's desk",
    "factEstablished": "Establishes that Finch may have had a financial motive related to the victim.",
    "permittedBehavioursByAct": [
      {
        "characterName": "Eleanor Voss",
        "behaviour": "may show unease, evasion, or mild defensiveness when questioned"
      },
      {
        "characterName": "Dr. Mallory Finch",
        "behaviour": "may show unease, evasion, or mild defensiveness when questioned"
      }
    ],
    "redHerringPlacement": null,
    "emotionalRegister": "The revelation of the clock's tampering pivots the investigation in a new direction.",
    "dominantCharacterNote": {
      "name": "Eleanor Voss",
      "voiceRegister": "Eleanor speaks with a polished, almost lyrical quality, often peppering her conversation with subtle sarcasm."
    },
    "humourGuidance": {
      "permission": "permitted"
    },
    "eraTextureNote": "Mud from recent rains complicating movement around the estate.; Limited communication options due to economic conditions.; The isolation of Little Middleton Manor from nearby towns.",
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
  Dr. Mallory Finch    | she/her/her/herself       | [fill in]     | [yes/no]
  Captain Ivor Hale    | he/him/his/himself        | [fill in]     | [yes/no]
  Beatrice Quill       | she/her/her/herself       | [fill in]     | [yes/no]
□ Return valid JSON only.
```
