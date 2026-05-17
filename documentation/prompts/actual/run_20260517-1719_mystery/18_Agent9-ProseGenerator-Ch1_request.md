# Actual Prompt Record

- Run ID: `mystery-1779038378456`
- Project ID: ``
- Timestamp: `2026-05-17T17:23:40.617Z`
- Agent: `Agent9-ProseGenerator-Ch1`
- Operation: `chat_request_full_prompt`
- Model: `GPT-4o-mini`
- Temperature: `0.42`
- Max Tokens: `4500`
- Attempt: `first`
- Prompt Hash: `f7a3bed3e122cf14`

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
- MORAL COMPLEXITY REQUIREMENT: The mechanism of this crime carries a moral gray area: "The murderer acted out of desperation to protect a loved one, evoking sympathy despite the crime." — the culprit reveal and denouement MUST acknowledge this ambiguity. Do not let the ending feel clean or simple. Give the reader at least one moment of uncomfortable sympathy or moral doubt.


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

## Era: 1938-09
Life in September 1938 is tinged with uncertainty as Europe stands on the brink of conflict. The remnants of the Great Depression linger, casting a shadow over the affluent, who cling to their status while grappling with the realities of economic hardship. The air is heavy with fear and anxiety, accentuated by the overcast skies that cast a pall over everyday life. Communities are buzzing with preparations for the Harvest Festival, a time meant for celebration, yet whispers of political strife and the threat of war loom large in the background, creating a dissonance between the festive spirit and the encroaching darkness. People navigate their lives with a sense of trepidation, aware that the world is changing and that traditional social structures may soon be tested.
Emotional register: A collective sense of anxiety and foreboding permeates society.
Physical constraints: Limited communication methods, relying heavily on telephones and letters | Travel often restricted by weather and road conditions | Social gatherings tightly controlled by class and etiquette norms
Current tensions (weave into background texture): Rising tensions in Europe with the Munich Agreement taking place | Increased awareness of fascism's threat | The looming threat of war contributing to public anxiety
Wartime context — Many are preparing for a potential military draft due to the rising tensions across Europe.: Communities are divided on issues of war and peace, leading to strained relationships. Absence effect: Families face the potential loss of loved ones to war, heightening emotional fragility.

## Story Theme
In the shadow of a mechanical deception, the intricate dance of loyalty and betrayal reveals the fragility of human relationships amidst societal unrest, and reveals that evidence carries ethical weight, forcing characters to choose accountability over social performance when appearances and facts collide.

## Story Emotional Register
Dominant: A tense exploration of loyalty, betrayal, and the fragility of human connections.

Arc:
The story opens at Little Middleton Manor, an imposing estate cloaked in overcast skies. Eleanor Voss, the charming matriarch, hosts a family reunion, but beneath her polished exterior lies a storm of financial worry and familial tension. As the clock ticks ominously, Eleanor is discovered dead, casting a shadow over the gathering. The weight of the initial crime hangs heavy, as family and friends grapple with shock and suspicion. As the investigation unfolds, initial clues emerge, revealing a tampered clock that alters the timeline of events.

The emotional cost of the investigation begins to take its toll on those involved, with each character wrestling with their hidden resentments. A pivotal moment arises when Beatrice Quill, the detective, uncovers discrepancies in the alibis, shifting the direction of the inquiry. This mid-story pivot alters the dynamics as old alliances crumble and new suspicions arise. A second revelation colors the investigation, as the emotional histories of each character come to light, revealing how their pasts shape their actions in the present. The pressure mounts as Beatrice confronts those involved, leading to a climax filled with tension and the unmasking of true intentions. In the resolution, the emotional fallout of the events weighs heavily on each character; Eleanor's death serves as a catalyst for change, forcing them to confront their truths, ultimately leading to a bittersweet acceptance of their intertwined fates.

## Emotional register at this point in the story
A facade of charm masks deep-seated anxieties and tensions.

## Character Portraits (appearance & era)

### Eleanor Voss
Eleanor Voss embodies the tension of the 1930s, navigating her family's financial struggles amidst a backdrop of societal upheaval. Her charm conceals a deep-seated anxiety about losing her family's estate, reflecting the broader fears of the upper class as they try to maintain their status in a rapidly changing world.
Era intersection: Her mounting debts and fears of inheritance disputes parallel the economic uncertainties faced by many during this time.

### Dr. Mallory Finch
As a physician, Dr. Mallory Finch represents the professional women of the 1930s, caught between personal ambition and societal expectations. Her unreciprocated love for Eleanor's son and her jealousy of Eleanor's status highlight the struggles women face for recognition in a male-dominated society.
Era intersection: Mallory's internal conflict reflects the societal pressures on women to conform while seeking independence in a time of economic and political strain.

### Captain Ivor Hale
Captain Ivor Hale epitomizes the loyal protector, grappling with guilt from past decisions as the world around him grows increasingly tumultuous. His stoic demeanor masks the emotional toll of impending war and the burden of loyalty to the Voss family, caught in the shifting tides of loyalty versus responsibility.
Era intersection: His internal struggle mirrors the conflicts faced by many men of the era as they reconcile personal honor with the realities of war.

### Beatrice Quill
Beatrice Quill's rebellious spirit reflects the aspirations of a younger generation hungry for change. Her disdain for the upper class and desire to expose their secrets illustrate the growing class consciousness of the time, as the privileged few are scrutinized amid economic hardship.
Era intersection: Her ambitions and conflicts reveal the tensions between tradition and modernity that characterize the societal landscape of the 1930s.

## Character Voices

### Eleanor Voss (she/her/her)
Eleanor speaks with a refined cadence, her laughter often punctuating conversations with a blend of charm and subtle sharpness.
[comfortable] What a delightful gathering we have today! Nothing like family to warm the heart.
[evasive] Oh, the estate's finances are just a minor concern, really. Let’s focus on the lovely weather!
[stressed] I assure you, everything is under control! Just a little family drama, nothing we can't handle.
Humour: Eleanor often employs polite savagery, using her wit to navigate social tensions.

### Dr. Mallory Finch (she/her/her)
Dr. Mallory's calm, measured tone reflects her analytical mindset, often layered with medical metaphors.
[comfortable] Healing is a delicate process, much like mending a broken heart.
[evasive] Oh, I’m just here to tend to the guests, not to get involved in family matters.
[stressed] I never imagined my professional life would intersect so dramatically with my personal feelings.
Humour: Her dry wit adds a unique flavor to her interactions, softening the edges of tension.

### Captain Ivor Hale (he/him/his)
Ivor’s authoritative tone is often laced with self-deprecating humor, revealing his inner turmoil.
[comfortable] You know, leading men into battle is far easier than navigating a dinner party!
[evasive] Let’s not dwell on the past; I’d rather focus on the present company.
[stressed] I fear my loyalty to this family may have led me astray more than once.
Humour: His self-deprecating humor adds a touch of levity to serious conversations.

### Beatrice Quill (she/her/her)
Beatrice’s energetic cadence and dramatic flourishes reflect her passionate spirit and disdain for the upper class.
[comfortable] Inspiration strikes like lightning, don’t you think? Just look at this spectacle!
[evasive] Oh, I’m just a humble writer, gathering stories. Nothing scandalous here!
[stressed] If only they knew the truths I could expose; it’s a heavy burden to bear.
Humour: Her sardonic wit serves as both a shield and a weapon in her narrative battles.

## Location Registers (scene framing guides)

The Library: The library feels like a repository of secrets, heavy with the tension of unspoken truths and the weight of the past. Each shadow seems to harbor whispers of betrayal, making it a place where every glance and every creak of the floorboard heightens the sense of foreboding.. Camera angle: As a writer enters this space, they should feel the oppressive weight of history, as if the walls themselves are holding their breath, waiting for the truth to emerge.. Era: In a time when books were the primary source of knowledge, this library also symbolizes the weight of history and the burden of family legacies.

The Dining Room: The dining room exudes an air of opulence and tradition, yet beneath the surface lies a current of tension and unfulfilled expectations. The gathering here is a performance, where each participant grapples with their roles while unspoken grievances simmer just out of sight.. Camera angle: Writers should focus on the elegance of the setting, contrasting it with the complexities of the relationships unfolding within.. Era: The formality of the dining setting reflects the rigid social structures of the time, where appearances must be maintained even as undercurrents of conflict arise.

The Study: The study is a sanctuary of solitude, imbued with a sense of introspection and quiet conflict. It holds the weight of decisions made and letters unsent, an echo of the inner turmoil faced by its occupants, where the ticking clock serves as a reminder of time slipping away.. Camera angle: As a writer approaches, they should feel the intimate atmosphere, as if they are stepping into the thoughts and struggles of the character who occupies it.. Era: This private space reflects the era's emphasis on both intellectual pursuits and the weight of personal responsibility.

The Gardens: The gardens embody a poignant beauty tinged with neglect, mirroring the hidden struggles of the characters within the manor. The overgrown pathways and wildflowers evoke a sense of lost grandeur and unfulfilled potential, creating a space that is both enchanting and melancholic.. Camera angle: Writers should capture the essence of a once-majestic space, now overrun, to symbolize the characters' own struggles against time and circumstance.. Era: The gardens, once a symbol of prosperity, now reflect the societal decay and shifting values of the 1930s.

## Humour guidance for this story position (opening)
Permission: forbidden
Rationale: The atmosphere is serious due to the impending crime.

FAIR-PLAY AND INFERENCE CONTRACT (from CML logic):
- False assumption in force: The clock's time is accurate and reflects the actual time of death.
- Hidden truth to progressively expose: The clock was tampered with to mislead the investigation.
- Inference path checkpoints to dramatize clearly (observation -> correction -> effect):
  - Step 1: obs: The clock's hands are slightly dust-covered, indicating it hasn't been disturbed recently. | corr: The clock was not recently wound, suggesting it may have been tampered with earlier. | effect: Narrows the investigation focus to Dr. Mallory Finch, who had access to the clock.
  - Step 2: obs: Witnesses recall hearing a chime from the clock that conflicts with the claimed time of death. | corr: If the clock chimed at 9:15 PM, then Eleanor could not have died at 9:30 PM as claimed. | effect: Eliminates Captain Ivor Hale, whose alibi relies on the clock's timing.
  - Step 3: obs: A loose gear inside the clock ticks irregularly, suggesting recent tampering. | corr: The irregular ticking indicates manipulation, which could only have been done before the murder. | effect: Eliminates the possibility that Eleanor tampered with the clock herself.
- Discriminating test method: trap
- Discriminating test design constraint: Beatrice Quill sets up a comparison between the clock's tampering evidence and Dr. Finch's alibi during the dinner.
- Test must rely on already-shown clue IDs: clue_6, clue_mechanism_visibility_core, clue_1
- Fair-play rationale: Step 1: The dust on the clock hands (early) indicates it has not been disturbed, leading to suspicion. Step 2: The witness testimony about the chime time (mid) conflicts with the established timeline. Step 3: The irregular ticking clue (discriminating test) reveals tampering that implicates Dr. Finch.
- Never solve by withheld information. Keep reader-information parity with detective reasoning.

## Character Reference

### Eleanor Voss (she/her — NEVER he/him)
Eleanor speaks with a refined cadence, often punctuating her sentences with a soft laugh that belies her sharp wit
She has a penchant for using euphemisms, veiling her true intentions behind a façade of polite conversation.
Eleanor wrestles with the fear that her need for control is driving away those she loves, creating a chasm between her desires and her relationships.

### Dr. Mallory Finch (she/her — NEVER he/him)
Mallory speaks with a calm, measured tone, often choosing her words carefully
She has a tendency to use medical metaphors in casual conversation, which can be both amusing and illuminating, revealing her analytical mindset.
Mallory grapples with her feelings of inadequacy and the fear that her unreciprocated love will forever place her in the shadows of Eleanor's world, torn between her professional duty and personal desires.

### Captain Ivor Hale (he/him — NEVER she/her)
Ivor speaks with a measured, authoritative tone, often punctuating his statements with self-deprecating humor
He has a habit of using nautical metaphors, which lends a unique cadence to his speech.
Ivor is haunted by the past, struggling to reconcile his perceived failures with his loyalty to the Voss family, a tension that gnaws at him incessantly.

### Beatrice Quill (she/her — NEVER he/him)
Beatrice speaks with an energetic cadence, often punctuating her sentences with dramatic flourishes
She has a knack for sarcasm and wordplay, using humor to mask her true feelings about her social standing.
Beatrice struggles with the tension between her desire for independence and her disdain for the very society she seeks to critique, often questioning whether her ambitions are worth the sacrifices required.


## CHARACTER CONTRACTS (binding for this scene)
Each entry below constrains how this character must be written in this chapter.
These override generic style guidance when they conflict.

### Eleanor Voss[SHE]
Voice & mannerisms: Eleanor speaks with a refined cadence, often punctuating her sentences with a soft laugh that belies her sharp wit. She has a penchant for using euphemisms, veiling her true intentions behind a façade of polite conversation.
Sample voice fragments (match this register and rhythm):
  [comfortable] "What a delightful gathering we have today! Nothing like family to warm the heart."
  [evasive] "Oh, the estate's finances are just a minor concern, really. Let’s focus on the lovely weather!"
Humour: polite savagery — deploy occasionally (level 0.6)
FORBIDDEN phrase (never write for Eleanor Voss): "she felt a wave of unease"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Eleanor's desire to preserve her family's legacy drives her to desperate measures, as she believes that losing the estate would mean losing her identity and influence." — do not surface in Act I.

### Dr. Mallory Finch[SHE]
Voice & mannerisms: Mallory speaks with a calm, measured tone, often choosing her words carefully. She has a tendency to use medical metaphors in casual conversation, which can be both amusing and illuminating, revealing her analytical mindset.
Sample voice fragments (match this register and rhythm):
  [comfortable] "Healing is a delicate process, much like mending a broken heart."
  [evasive] "Oh, I’m just here to tend to the guests, not to get involved in family matters."
Humour: dry wit — deploy occasionally (level 0.5)
FORBIDDEN phrase (never write for Dr. Mallory Finch): "a surge of determination washed over her"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Mallory's jealousy of Eleanor's wealth and social standing fuels her internal conflict, as she struggles with feelings of invisibility and unappreciation in a world that seems to reward privilege over merit." — do not surface in Act I.

### Captain Ivor Hale[HE]
Voice & mannerisms: Ivor speaks with a measured, authoritative tone, often punctuating his statements with self-deprecating humor. He has a habit of using nautical metaphors, which lends a unique cadence to his speech.
Sample voice fragments (match this register and rhythm):
  [comfortable] "You know, leading men into battle is far easier than navigating a dinner party!"
  [evasive] "Let’s not dwell on the past; I’d rather focus on the present company."
Humour: self deprecating — deploy occasionally (level 0.4)
FORBIDDEN phrase (never write for Captain Ivor Hale): "she knew with certainty she was right"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Ivor's sense of responsibility for the family's well-being is intertwined with a simmering resentment towards Eleanor's decisions, which he believes have led them into perilous waters." — do not surface in Act I.

### Beatrice Quill[SHE]
Voice & mannerisms: Beatrice speaks with an energetic cadence, often punctuating her sentences with dramatic flourishes. She has a knack for sarcasm and wordplay, using humor to mask her true feelings about her social standing.
Sample voice fragments (match this register and rhythm):
  [comfortable] "Inspiration strikes like lightning, don’t you think? Just look at this spectacle!"
  [evasive] "Oh, I’m just a humble writer, gathering stories. Nothing scandalous here!"
Humour: sardonic — deploy frequently (level 0.7)
FORBIDDEN phrase (never write for Beatrice Quill): "palpable tension filled the room"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Beatrice's financial grievances with the Voss family have fueled her desire to expose their secrets, seeking to undermine the very foundations of their privilege." — do not surface in Act I.



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
Little Middleton Manor stands as a relic of grandeur, its sprawling architecture and lush gardens hiding dark secrets beneath the veneer of aristocratic life.

Key Locations Available:
- The Library (interior): Crime scene
- The Dining Room (interior): Gathering space
- The Study (interior): Private space for reflection and correspondence
- The Gardens (exterior): Outdoor space for leisure and reflection

Atmosphere (tonal cue only — do NOT reproduce this phrase verbatim in prose; translate into scene-specific, character-observed sensory language): tense and foreboding, reflecting the social unrest of the time
Weather: overcast with intermittent rain, contributing to a somber mood

Era markers: Typewriters clacking in the study | Radio broadcasting news of the world outside | Early home telephones ringing with urgent messages

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
  - Visual: dust motes in the air, faded leather bindings, shadows lurking in corners
  - Sounds: crackling fire, pages turning in the silence, distant thunder rumbling
  - Scents: musty pages, old leather, smoke from the fireplace
  - Touch: worn leather armchair, cold metal of a paperweight

The Dining Room (interior):
  - Visual: gleaming silverware, crystal glassware catching light, richly upholstered chairs
  - Sounds: clinking of dishes, voices murmuring, soft laughter
  - Scents: roasted meats, freshly baked bread, polished wood
  - Touch: smooth surface of the table, soft fabric of chair upholstery

The Study (interior):
  - Visual: faded wallpaper, stacks of letters, glow of a desk lamp
  - Sounds: rustling paper, soft ticking of a clock, occasional creak of the floor
  - Scents: old books, ink and paper, polished wood
  - Touch: cold metal of a pen, rough texture of parchment

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

- Life in September 1938 is tinged with uncertainty as Europe stands on the brink of conflict
- The remnants of the Great Depression linger, casting a shadow over the affluent, who cling to their status while grappling with the realities of economic hardship
- The air is heavy with fear and anxiety, accentuated by the overcast skies that cast a pall over everyday life
- Communities are buzzing with preparations for the Harvest Festival, a time meant for celebration, yet whispers of political strife and the threat of war loom large in the background, creating a dissonance between the festive spirit and the encroaching darkness
- People navigate their lives with a sense of trepidation, aware that the world is changing and that traditional social structures may soon be tested.

TEMPORAL CONTEXT:

This story takes place in September 1938 during N/A.

Seasonal Atmosphere:
- Weather patterns: overcast with intermittent rain, chilly breezes, occasional bursts of sunlight
- Daylight: Days are shortening, with twilight arriving by seven o'clock, casting long shadows across the estate grounds.
- Seasonal activities: apple picking at local orchards, preparations for the Harvest Festival, evening strolls amidst the turning leaves
- Seasonal occasions: Harvest Festival
- Season: N/A

Period Fashion (describe naturally):
- Men formal: three-piece wool suit in charcoal grey, starched white dress shirt, dark tie with geometric patterns
- Men casual: tweed blazer, knit sweater vest, high-waisted trousers
- Men accessories: fedora hat, silver pocket watch, leather gloves
- Women formal: tea-length dress with a fitted bodice and flared skirt, pair of low-heeled pumps, short-sleeved cardigan with embroidery
- Women casual: cotton blouse with a Peter Pan collar, pleated skirt, sensible walking shoes
- Women accessories: string of pearls, cloche hat, leather handbag

Cultural Context (reference naturally):
- Music/entertainment: 'Minnie the Moocher' by Cab Calloway, 'I'll Be Seeing You' by Bing Crosby, 'A-Tisket, A-Tasket' by Ella Fitzgerald; Films: 'The Adventures of Robin Hood', 'The Lady Vanishes'; Theatre: 'The Corn is Green', 'The Front Page'; Radio: 'The Shadow' program, 'Amos 'n' Andy'
- Typical prices: Loaf of bread: four pence, Movie ticket: one shilling, Pint of milk: three pence
- Current events: rising tensions in Europe with the Munich Agreement taking place; increased awareness of fascism's threat
- Literature: 'The Maltese Falcon' by Dashiell Hammett | 'Brave New World' by Aldous Huxley | 'The Grapes of Wrath' by John Steinbeck | [mystery] | [social commentary] | [science fiction]
- Technology: first commercially available television sets | the introduction of plastic as a material | advancements in radio broadcasting | standard telephone with rotary dial | typewriter for correspondence | phonographs for music playback
- Daily life: attending local harvest festivals, family gatherings on weekends, visiting public parks for picnics
- Social rituals: afternoon tea served at four o'clock, formal invitations to social events, Sunday church services followed by community gatherings

Atmospheric Details:
The scent of damp earth and fallen leaves permeates the air, mingling with the faint aroma of wood smoke from the manor's hearth. The muted colors of the estate's grand interior, with its heavy drapes and dark wood paneling, create an atmosphere of foreboding as shadows flicker in the candlelight. The distant sound of thunder rolls in, echoing the unease felt by many as the world outside the manor grows increasingly chaotic.

FASHION INTEGRATION TECHNIQUES:
- First appearance: Describe outfit to establish class/personality
- Accessories: Gloves, hats, pocket watches, jewelry reveal status
- Time-specific: Different outfits for different times of day
- Character traits: Fastidious dresser vs rumpled appearance
- Action integration: "She tugged at her glove" or "He adjusted his tie"
- Weather appropriate: Overcoats in winter, light linen in summer

CULTURAL TOUCHSTONE INTEGRATION:
- Casual conversation: "Did you hear that new jazz record?" or "I saw the latest Chaplin film"
- Background details: Ra
[truncated for prompt budget]

NON-NEGOTIABLE CHAPTER OBLIGATIONS — LOCKED EVIDENCE PHRASES (VERBATIM REQUIRED):
The following physical evidence values are absolute ground truth. Every time this chapter describes, mentions, or alludes to the relevant evidence — no matter how briefly — it MUST use the exact phrase shown below, character for character. NO paraphrase, approximation, rounding, or synonym is permitted.

FAILURE EXAMPLE: if the locked value is "at thirteen minutes to midnight" and you write "just before midnight" or "around midnight" — that is a HARD FAIL. You must write "at thirteen minutes to midnight". Equally, if the locked value is written in words, such as "ten minutes past eleven", and you convert it to figure-based clock notation — that is also a HARD FAIL. Words stay as words; figure forms are forbidden for word-phrased facts.

CRITICAL — WORD-PHRASED VALUES: If the canonical value is written out in words (e.g. a time like "ten minutes past eleven", or an amount like "forty minutes"), reproduce those exact words. DO NOT convert to figure-based time notation, twenty-four-hour format, or any other numeric shorthand. Correct: "ten minutes past eleven". WRONG: figure-based clock notation or numeric shorthand.

Locked facts:
  - The exact time shown on the stopped clock face: "ten minutes past eleven"
    ⛔ FORBIDDEN alternatives: "11:10", "11.10", "eleven ten", "eleven-ten", "eleven past ten", "quarter past eleven", "half past eleven" — the ONLY acceptable form is "ten minutes past eleven"
  - The exact amount the clock was wound back: "forty minutes"
  - The time a witness claims to have heard the clock chime: "the hour chime at midnight"
  - The distance from the clock to the location of the murder: "fifty yards"

If a locked fact has no relevance to this chapter, omit it. But the moment you reference the underlying evidence, only the exact phrase above is acceptable.

⛔ CLUES TO SURFACE IN THESE CHAPTERS — mandatory:
The following evidence MUST be clearly observable to an attentive reader. Do not bury it in atmosphere or passing dialogue. Each clue must be concrete, specific, and noticeable:

• [clue_1] Witnesses recall hearing a chime from the clock that conflicts with the claimed time of death.
  Category: temporal | Criticality: essential | Supports inference step 2
  Points to: Indicates a discrepancy in the timeline.

• [clue_2] If the clock chimed at quarter past nine, then Eleanor could not have died at half past nine as claimed.
  Category: temporal | Criticality: essential | Supports inference step 2
  Points to: Contradicts the timeline of Eleanor's death.

• [clue_8] The dust on the clock's hands suggests it hasn't been disturbed in a while.
  Category: temporal | Criticality: essential | Supports inference step 1
  Points to: Indicates the clock's time may not reflect the actual time of death.

• [clue_core_contradiction_chain] The clock's hands are slightly dust-covered, indicating it hasn't been disturbed recently.
  Category: temporal | Criticality: essential | Supports inference step 1
  Points to: Suggests the clock's time may not be accurate.

• [clue_mechanism_visibility_core] Direct observation
  Category: structural | Placement: early (Act 1)
  Points to: what this observation reveals about the time or circumstances of the crime.

For each clue above: an attentive reader should be able to find, record, and later use it to reason toward the solution.

═══ NARRATIVE STATE (read-only — do not contradict) ═══

LOCKED FACTS — use verbatim whenever this evidence is described:
  • The exact time shown on the stopped clock face: "ten minutes past eleven"
  • The exact amount the clock was wound back: "forty minutes"
  • The time a witness claims to have heard the clock chime: "the hour chime at midnight"
  • The distance from the clock to the location of the murder: "fifty yards"

CHARACTER PRONOUNS — never deviate from these:
  • Eleanor Voss: she/her/her
  • Dr. Mallory Finch: she/her/her
  • Captain Ivor Hale: he/him/his
  • Beatrice Quill: she/her/her

INVESTIGATION LOG — WHAT IS ESTABLISHED (do not re-establish, do not repeat):
• Suspects still unresolved: Eleanor Voss[SHE], Captain Ivor Hale[HE], Beatrice Quill[SHE]
⚠ The story must move FORWARD from this log. Any beat already listed above is forbidden from repeating.

⚠ THIS CHAPTER'S REQUIRED ADVANCE (opening): Discover the body, confirm the victim, establish the scene
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
Known location profile anchors: Little Middleton Manor, The Library, The Dining Room, The Study, The Gardens, the scene
LOCATION NAME CAPITALISATION (HARD REQUIREMENT — validated):
All named locations in your prose MUST use the EXACT capitalisation from the CML profiles.
Canonical forms: "Little Middleton Manor", "The Library", "The Dining Room", "The Study", "The Gardens", "the scene"
Writing a location in lowercase (e.g. "drawing room" instead of "Drawing Room") is a validated error. Every time you mention a named location, copy its capitalisation from the list above.
- Chapter 1: OPENING STYLE (HARD): Start the VERY FIRST SENTENCE with a named character performing a physical action or motion — e.g. "[Name] crossed the threshold…" / "[Name] set down the glass…" / "[Name] rose from the chair…". Anchor opening in "the scene". HARD REQUIREMENT for the first 2 paragraphs: (a) include 2+ sensory words — choose from smell/scent/sound/echo/silence/creak/whisper/cold/warm/damp/rough/smooth/glow/shadow/flicker/dim — and (b) include 1+ atmosphere/time word — choose from rain/wind/fog/storm/mist/thunder/evening/morning/night/dawn/dusk/season/afternoon/midday/noon/midnight/twilight/sunrise/sunset/daylight/sunlight/overcast/cloudy/bright/dark. These are validated requirements, not style suggestions; missing them triggers a retry.

PROMPT BUDGET SUMMARY: budget=32000 tokens; fixed=6236; context=10613; dropped=[none]; truncated=[pronoun_accuracy, temporal_context]

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
8. Integrate at least two concrete era-grounded details per chapter from setting refinement signals: radio broadcasting | early home telephones | typewriters for correspondence | increasingly common telephone conversations | fast telegrams for urgent messages | airmail services for long-distance correspondence.
9. Respect setting movement/access constraints in scene action and alibis: architectural layout creates restricted access to certain areas | weather conditions may affect outdoor evidence visibility | geographical isolation limits outside assistance | specific permissions required to enter private rooms | daily routines of staff and residents dictate movement patterns.
10. Sustain social coherence with this backdrop pressure: A gathering at the isolated manor for a family reunion is overshadowed by the economic strain of the Great Depression and rising political tensions, forcing the guests to confront their hidden resentments and loyalties.
11. Maintain continuity around these socially central cast anchors where relevant: Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill.
12. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Critical: Plot similarity 0.80 with 'The Mysterious Affair at Styles' (same temporal axis and poisoning method)
13. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Moderate: Character similarity 0.75 with 'The Mysterious Affair at Styles' (similar cast structure with doctor and captain roles)

CRITICAL PROSE REQUIREMENTS:

The CML specifies exact requirements for certain validation-critical scenes. You MUST include these elements at the specified positions.

**Discriminating Test Scene (Act 3, Scene 1):**
Required elements: Execute the discriminating test, Observe the culprit's reaction or result, Draw conclusion about guilt
Test type: trap

**Suspect Clearance Scenes:**
- Captain Ivor Hale (Act 3, Scene 2): Alibi established through witness testimony.
  Clues: chime_conflict_clue
- Eleanor Voss (Act 3, Scene 3): Victim's status as the deceased.
  Clues: clock_dust_clue

**Culprit Revelation Scene (Act 3, Scene 4):**
Method: Confrontation with evidence

**Clue Placement for These Chapters:**
- clue_1 must appear in Act 1, Scene 1 via Direct observation
- clue_2 must appear in Act 1, Scene 1 via Cross-check contradiction
- clue_8 must appear in Act 1, Scene 1 via Direct observation
- clue_core_contradiction_chain must appear in Act 1, Scene 1 via Cross-check contradiction
- clue_mechanism_visibility_core must appear in Act 1, Scene 1 via Direct observation

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
  - Scene is set in: the scene — reference it naturally within the paragraph, never as your opening phrase.
  - Opening atmosphere (MANDATORY — validator enforced): the first paragraph MUST contain at least one of: rain / wind / fog / storm / mist / thunder / evening / morning / night / dawn / dusk / season / afternoon / midday / noon / midnight / twilight / sunrise / sunset / daylight / sunlight / overcast / cloudy / bright / dark / grey / pale / cold / warm / chill / crisp / damp / drizzle / haze / lamplight / firelight. A chapter that omits all of these from its opening paragraph will be rejected.
  - CLUE OBLIGATIONS — mandatory prose elements (do NOT omit or bury):
    • Witnesses recall hearing a chime from the clock that conflicts with the claimed time of death. [clue_1] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: Indicates a discrepancy in the timeline.
      ↳ MANDATORY TWO-PARAGRAPH STRUCTURE (must appear in paragraphs 1 or 2 — no later):
         Paragraph 1: The POV character physically approaches or directly observes this evidence.
           The narration or dialogue explicitly states what is seen (use the exact locked phrase if one applies).
         Paragraph 2 (immediately following): The detective or POV character explicitly reasons
           about what this evidence implies — who it implicates, why it may be unreliable,
           or what inference it supports. This must be a separate full paragraph, not a sentence appended to Paragraph 1.
    • If the clock chimed at quarter past nine, then Eleanor could not have died at half past nine as claimed. [clue_2] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: Contradicts the timeline of Eleanor's death.
      ↳ MANDATORY TWO-PARAGRAPH STRUCTURE (must appear in paragraphs 1 or 2 — no later):
         Paragraph 1: The POV character physically approaches or directly observes this evidence.
           The narration or dialogue explicitly states what is seen (use the exact locked phrase if one applies).
         Paragraph 2 (immediately following): The detective or POV character explicitly reasons
           about what this evidence implies — who it implicates, why it may be unreliable,
           or what inference it supports. This must be a separate full paragraph, not a sentence appended to Paragraph 1.
    • The dust on the clock's hands suggests it hasn't been disturbed in a while. [clue_8] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: Indicates the clock's time may not reflect the actual time of death.
      ↳ MANDATORY TWO-PARAGRAPH STRUCTURE (must appear in paragraphs 1 or 2 — no later):
         Paragraph 1: The POV character physically approaches or directly observes this evidence.
           The narration or dialogue explicitly states what is seen (use the exact locked phrase if one applies).
         Paragraph 2 (immediately following): The detective or POV character explicitly reasons
           about what this evidence implies — who it implicates, why it may be unreliable,
           or what inference it supports. This must be a separate full paragraph, not a sentence appended to Paragraph 1.
    • The clock's hands are slightly dust-covered, indicating it hasn't been disturbed recently. [clue_core_contradiction_chain] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: Suggests the clock's time may not be accurate.
      ↳ MANDATORY TWO-PARAGRAPH STRUCTURE (must appear in paragraphs 1 or 2 — no later):
         Paragraph 1: The POV character physically approaches or directly observes this evidence.
           The narration or dialogue explicitly states what is seen (use the exact locked phrase if one applies).
         Paragraph 2 (immediately following): The detective or POV character explicitly reasons
           about what this evidence implies — who it implicates, why it may be unreliable,
           or what inference it supports. This must be a separate full paragraph, not a sentence appended to Paragraph 1.
    • Dr. Mallory Finch tampered with the clock to create a false alibi and mislead the investigation. [clue_mechanism_visibility_core] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: Indicates Dr. Mallory Finch's involvement in the crime.
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
  - If this batch mentions The time a witness claims to have heard the clock chime, write exactly: "the hour chime at midnight".
  - If this batch mentions The distance from the clock to the location of the murder, write exactly: "fifty yards".
- Seasonal vocabulary allow-list: autumn, autumnal, fall.
- Forbidden seasonal words: spring, summer, winter.

FROZEN FACT STATE (DO NOT ALTER):
- Timeline anchor: September (autumn).
- Month, season, weather, and time-of-year language in this batch must stay compatible with autumn.
- Established timeline fact: 9:00 PM
- Established timeline fact: 10:00 PM
- If referenced, use exact phrase: "ten minutes past eleven" (The exact time shown on the stopped clock face).
- If referenced, use exact phrase: "forty minutes" (The exact amount the clock was wound back).
- If referenced, use exact phrase: "the hour chime at midnight" (The time a witness claims to have heard the clock chime).
- If referenced, use exact phrase: "fifty yards" (The distance from the clock to the location of the murder).

STORY TO DATE (REFERENCE ONLY — DO NOT COPY VERBATIM):
- No previous chapter text exists yet for this batch.

[SCENE COMPLETENESS CONTRACTS — MANDATORY. Each contract below lists what you MUST enact in that chapter. Do not summarise or mention these labels in the prose — enact them organically.]
Chapter 1 (Act 1) completeness contract:
  PIVOT ELEMENT (MANDATORY — write this into the prose, shown not told): "The stopped pocket watch found in the victim's hand — still showing ten past eleven"
  FACT ESTABLISHED (MANDATORY — reader must know this by chapter end): "Establishes the victim died no later than eleven past eleven, contradicting three suspects' alibis"
  RED HERRING (MANDATORY — seed naturally, not flagged as false): [rh_1] Captain Hale mentions the clock ran at dinner — seeds timing doubt

# Case Overview
Title: The Clock's Deceit
Era: 1930s
Setting: Little Middleton
Crime: murder (clock tampering)
Culprit: Dr. Mallory Finch
False assumption: The clock's time is accurate and reflects the actual time of death.
Cast: Eleanor Voss (she/her), Dr. Mallory Finch (she/her), Captain Ivor Hale (he/him), Beatrice Quill (she/her)

Setting Lock: Keep all scenes and descriptions consistent with the stated setting (Little Middleton). Do not introduce a different location type.

Outline scenes:
[
  {
    "sceneNumber": 1,
    "act": 1,
    "title": "Discovery",
    "setting": {
      "location": "the scene",
      "timeOfDay": "Morning after the murder",
      "atmosphere": "Tense household awaiting the detective's arrival"
    },
    "characters": [
      "Beatrice Quill",
      "Eleanor Voss",
      "Dr. Mallory Finch",
      "Captain Ivor Hale"
    ],
    "purpose": "Introduce the crime and detective",
    "cluesRevealed": [
      "clue_1",
      "clue_2",
      "clue_8",
      "clue_core_contradiction_chain"
    ],
    "dramaticElements": {
      "conflict": "Locked room mystery established",
      "tension": "Every suspect had access to the victim",
      "microMomentBeats": [
        "Eleanor stands frozen, clutching a locket, her eyes welling with tears."
      ]
    },
    "summary": "In the early morning light, the household gathers around the body of Eleanor Voss, who lies lifeless in her parlor. Beatrice Quill, a close family friend, arrives to find the atmosphere thick with grief and suspicion. As she examines the scene, she notes the clock's dust-covered hands and hears conflicting accounts of the last chime.",
    "estimatedWordCount": 1800,
    "pivotElement": "The stopped pocket watch found in the victim's hand — still showing ten past eleven",
    "factEstablished": "Establishes the victim died no later than eleven past eleven, contradicting three suspects' alibis",
    "permittedBehavioursByAct": [
      {
        "characterName": "Eleanor Voss",
        "behaviour": "cooperative grief; no guilt-tells in Act I"
      },
      {
        "characterName": "Dr. Mallory Finch",
        "behaviour": "normal social behaviour; no guilt signals"
      },
      {
        "characterName": "Captain Ivor Hale",
        "behaviour": "normal social behaviour; no guilt signals"
      },
      {
        "characterName": "Beatrice Quill",
        "behaviour": "normal social behaviour; no guilt signals"
      }
    ],
    "redHerringPlacement": {
      "redHerringId": "rh_1",
      "placementDetail": "Captain Hale mentions the clock ran at dinner — seeds timing doubt"
    },
    "emotionalRegister": "A facade of charm masks deep-seated anxieties and tensions.",
    "dominantCharacterNote": {
      "name": "Eleanor Voss",
      "voiceRegister": "Eleanor speaks with a refined cadence, her laughter often punctuating conversations with a blend of charm and subtle sharpness."
    },
    "humourGuidance": {
      "permission": "forbidden"
    },
    "eraTextureNote": "Limited communication methods, relying heavily on telephones and letters; Travel often restricted by weather and road conditions; Social gatherings tightly controlled by class and etiquette norms",
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
□ Chapter 1: "Witnesses recall hearing a chime from the clock that conflicts with the claimed time of death." is placed in the first 25% of the chapter, followed by an explicit inference or suspicion paragraph.
□ Chapter 1: "If the clock chimed at quarter past nine, then Eleanor could not have died at half past nine as claimed." is placed in the first 25% of the chapter, followed by an explicit inference or suspicion paragraph.
□ Chapter 1: "The dust on the clock's hands suggests it hasn't been disturbed in a while." is placed in the first 25% of the chapter, followed by an explicit inference or suspicion paragraph.
□ Chapter 1: "The clock's hands are slightly dust-covered, indicating it hasn't been disturbed recently." is placed in the first 25% of the chapter, followed by an explicit inference or suspicion paragraph.
□ Chapter 1: "Dr. Mallory Finch tampered with the clock to create a false alibi and mislead the investigation." is placed in the first 25% of the chapter, followed by an explicit inference or suspicion paragraph.
□ PRONOUN AUDIT — for every character you named in your chapters, list the pronouns you actually used, then verify against the canonical table. Correct any mismatch before outputting. Do NOT include this audit in your JSON output.
  Character            | Canonical     | Used in draft | Match?
  ---------------------|---------------|---------------|-------
  Eleanor Voss         | she/her/her/herself       | [fill in]     | [yes/no]
  Dr. Mallory Finch    | she/her/her/herself       | [fill in]     | [yes/no]
  Captain Ivor Hale    | he/him/his/himself        | [fill in]     | [yes/no]
  Beatrice Quill       | she/her/her/herself       | [fill in]     | [yes/no]
□ Return valid JSON only.
```
