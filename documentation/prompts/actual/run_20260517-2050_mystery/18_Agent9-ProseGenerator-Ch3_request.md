# Actual Prompt Record

- Run ID: `mystery-1779051025661`
- Project ID: ``
- Timestamp: `2026-05-17T20:54:07.928Z`
- Agent: `Agent9-ProseGenerator-Ch3`
- Operation: `chat_request_full_prompt`
- Model: `GPT-4o-mini`
- Temperature: `0.42`
- Max Tokens: `4500`
- Attempt: `first`
- Prompt Hash: `bccc10276ee51a0a`

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
- MORAL COMPLEXITY REQUIREMENT: The mechanism of this crime carries a moral gray area: "The murderer acted out of a misguided sense of justice for a perceived wrong done to them in the past." — the culprit reveal and denouement MUST acknowledge this ambiguity. Do not let the ending feel clean or simple. Give the reader at least one moment of uncomfortable sympathy or moral doubt.


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

## Era: February 1938
Living in February 1938 is marked by an air of uncertainty as whispers of war ripple through society. The remnants of the Great Depression still haunt the populace, with many struggling to make ends meet while the wealthy host extravagant gatherings, masking their privilege behind layers of social etiquette. Class tensions are palpable, as the disparity between the upper crust and the working class widens. The looming threat of fascism in Europe adds to the anxious atmosphere, with people increasingly concerned about the future. The cold winter weather mirrors the chilling realities faced by many, making each interaction more fraught with unspoken tensions and hidden motives.
Emotional register: A collective sense of unease and anticipation hangs in the air, as the specter of change looms large.
Physical constraints: Short daylight hours limit social interactions. | Overcast weather discourages outdoor activities. | Chilly winds make gatherings indoors more appealing, leading to claustrophobic tension. | Public transport struggles with increased demand and limited resources.
Current tensions (weave into background texture): Rising tensions in Europe with the threat of war looming. | British government debating defense strategies. | Growing popularity of fascist ideologies in various countries.
Wartime context — Many men are preparing for potential military service as the threat of conflict grows.: Communities are increasingly divided, with some advocating for peace while others push for military readiness. Absence effect: The looming prospect of war creates a pervasive anxiety, as families brace for separation and loss.

## Season Lock (mandatory — derived from February 1938)
Season: winter. Allowed vocabulary: winter, wintry, midwinter
Forbidden seasonal words — never use in narration, dialogue, or metaphor: spring, summer, autumn and their adjectival forms.
Every weather description, atmosphere, and time-of-year reference must be consistent with winter.

## Story Theme
In a world where secrets bind and betray, the quest for truth reveals the fragile nature of human relationships amidst the shadows of greed and ambition.

## Story Emotional Register
Dominant: A tense and foreboding atmosphere permeates the narrative, as secrets unravel and truths come to light.

Arc:
The story opens in Little Middleton Manor, where the atmosphere is laden with tension, and the guests are unaware that the evening's events will culminate in tragedy. Eleanor Voss is found dead in her study, and the weight of her death hangs heavily over the estate, shrouding the gathering in a pall of unease. As Dr. Mallory Finch, a friend of Eleanor's, takes on the role of investigator, the initial investigation begins with a flurry of emotions. Clues emerge that hint at jealousy and ambition, but false leads cloud the truth, causing emotional strain among the suspects.

A pivotal moment occurs when a clock reveals a timeline contradiction, shifting the focus of the investigation and stirring the suspects' anxieties. As evidence of tampering surfaces, the tension mounts, leading to a confrontation that forces Captain Ivor Hale to reckon with his past grievances. The climax unveils the true motivations behind Eleanor's death, revealing a tangled web of betrayal and ambition. In the resolution, the emotional costs are laid bare; Eleanor's secrets and ambitions ripple through her acquaintances, leaving them forever changed. The final moments bring a haunting reflection on the fragility of human relationships, underscoring the high stakes of their intertwined fates.

## Emotional register at this point in the story
The investigation begins with emotional turmoil as secrets start to surface.

## Character Portraits (appearance & era)

### Eleanor Voss
Eleanor Voss embodies the tensions of the 1930s, navigating her family's declining wealth while projecting an image of grace and control. As the pressure mounts with her financial troubles, Eleanor's need to maintain her social standing becomes increasingly desperate, reflecting the broader struggles of the upper class in a changing world.
Era intersection: Her private fears about financial ruin intersect with the societal pressures of maintaining appearances during a period of economic hardship.

### Dr. Mallory Finch
Dr. Mallory Finch represents the conflict between personal desires and societal expectations. As a woman in a male-dominated field, she grapples with her secret affair while striving to uphold her reputation in a community that values propriety. Her struggles reflect the evolving role of women in the 1930s, caught between tradition and modernity.
Era intersection: Her private affair symbolizes the tension between personal freedom and societal norms that women face during this era.

### Captain Ivor Hale
Captain Ivor Hale personifies the traditional values of the upper class, clinging to a sense of honor while feeling overshadowed by Eleanor's perceived disregard for his family's legacy. His jealousy and resentment highlight the class struggles and personal grievances that simmer beneath the surface of genteel society.
Era intersection: His motivations reveal the complexities of class dynamics, as he grapples with feelings of entitlement and neglect in a changing social landscape.

### Beatrice Quill
Beatrice Quill serves as a voice for the aspiring middle class, yearning for recognition and stability. Her artistic ambitions clash with her financial struggles, showcasing the desperation felt by many young people during this tumultuous period. Her dreams of success are tethered to the fortunes of the wealthy elite, reflecting the intertwined fates of different social classes.
Era intersection: Her pursuit of success amidst financial instability mirrors the aspirations and challenges faced by many young creatives in the 1930s.

## Character Voices

### Eleanor Voss (she/her/her)
Eleanor speaks with an elegant cadence, her voice often laced with a sharp wit that belies her polished exterior.
[comfortable] Ah, the garden is simply divine this time of year, isn't it? The roses have never looked better.
[evasive] Oh, I wouldn’t worry about that; it’s just a minor issue, nothing we can’t handle.
[stressed] I can’t afford any mistakes now; everything depends on how this evening goes.
Humour: Her humour often carries a note of polite savagery, masking deeper anxieties.

### Dr. Mallory Finch (she/her/her)
Dr. Finch’s voice is calm and reassuring, yet it occasionally betrays her underlying nerves.
[comfortable] You know, healing isn’t just about the body; the mind needs care too.
[evasive] I’m sure it’s just a misunderstanding; let’s not jump to conclusions.
[stressed] If anyone finds out about this, it could ruin everything I’ve worked for.
Humour: Her self-deprecating humour emerges when she feels particularly anxious.

### Captain Ivor Hale (he/him/his)
Captain Hale’s voice carries a gravitas, often punctuated by dry wit and nautical metaphors.
[comfortable] I recall a time at sea when honor was everything; those were the days.
[evasive] I suppose everyone has their own version of the truth, don’t they?
[stressed] This isn’t just about me; it’s about my family’s legacy!
Humour: His dry wit often surfaces in moments of tension, adding levity to serious conversations.

### Beatrice Quill (she/her/her)
Beatrice’s voice is vibrant and expressive, full of artistic flair and dramatic pauses.
[comfortable] Imagine if my words could paint a picture; how vivid that would be!
[evasive] Oh, that’s just a passing thought; let’s focus on the gala, shall we?
[stressed] I can’t believe I’m risking everything for a fleeting chance at success!
Humour: Her sardonic humour often provides a refreshing perspective on dire situations.

## Location Registers (scene framing guides)

The Drawing Room: The drawing room feels alive with chatter yet heavy with unspoken tensions. Guests engage in polite conversation, but the laughter is strained, and every exchange is fraught with the potential for revelation. The lavish décor contrasts sharply with the underlying anxieties, creating an atmosphere that is both festive and foreboding.. Camera angle: A writer entering this space might feel the weight of hidden truths lurking in the shadows, urging them to uncover the secrets that bind the guests.. Era: The opulent setting of the drawing room reflects the societal expectations of the 1930s, where appearances must be maintained even amidst personal turmoil.

The Owner's Study: In the owner's study, the air is thick with the scent of old books and pipe tobacco, a sanctuary that holds both comfort and isolation. The cluttered desk reflects the chaotic emotions of its owner, while the oppressive silence invites contemplation of darker secrets. It feels like a place where truths are buried, waiting to be unearthed.. Camera angle: A writer stepping into this room might feel the tension of unspoken alliances and the weight of past decisions pressing down upon them.. Era: The study's confines symbolize the rigid social structures of the 1930s, where access is restricted and power dynamics are at play.

The Gardens: The gardens provide a deceptive sense of peace, with vibrant flowers contrasting sharply against the brewing storm inside the manor. The gentle sounds of nature mask the underlying tensions that simmer among the guests, making it a sanctuary and a hiding place for secrets. It's a beautiful yet melancholic space where aspirations and realities collide.. Camera angle: A writer wandering through the gardens may find themselves caught between the allure of nature's beauty and the reality of the turmoil within.. Era: The garden's beauty is a stark reminder of the economic struggles of the time, as the wealthy maintain their privilege while others suffer.

## Humour guidance for this story position (early)
Permission: permitted
Characters who may be funny: Dr. Mallory Finch
Permitted forms: dry_wit
Rationale: Dr. Finch's dry wit can provide levity amid the tension.

## Reveal Groundwork (texture — do not explain, only plant)
- Plant one subtle observable beat related to: "The discovery of the torn dinner schedule in Eleanor's pocket retroactively suggests her awareness of the deception surrounding her death". Do not explain significance yet.
- Plant one subtle observable beat related to: "Additionally, the earlier argument between Eleanor and Captain Hale now reads as a significant turning point, revealing deeper motives". Do not explain significance yet.
- Plant one subtle observable beat related to: "Finch's alibi becomes more critical in light of her emotional investment in Eleanor, highlighting the stakes involved for her". Do not explain significance yet.

FAIR-PLAY AND INFERENCE CONTRACT:
- FAIR PLAY CLUE TIMING: Never combine clue discovery and detective deduction in the same chapter. If a clue is first revealed to the reader in chapter N, the detective may only analyze, deduce from, or act on that clue in chapter N+1 or later.
- FAIR PLAY INFORMATION PARITY: The reader must see all clues BEFORE the detective uses them in reasoning. If the detective performs a test or makes a deduction, every piece of evidence supporting that conclusion must have been shown to the reader in earlier chapters.
- FAIR PLAY REVELATION SPACING: In the discriminating test scene, the detective can ONLY use clues that were revealed to the reader at least 1 full chapter earlier. Never introduce new clues or withheld information during the test.
- FAIR PLAY CONFRONTATION: During the final confrontation/revelation, the detective cannot surprise the reader with facts. Every piece of evidence cited must have been visible to the reader in prior chapters.
- Never solve by withheld information. Keep reader-information parity with detective reasoning.
- False assumption in force: Eleanor must have been killed during the dinner, as per the schedule.
- Hidden truth to progressively expose: The clock was tampered with to misrepresent the time of death.
- Inference path checkpoints to dramatize clearly (observation -> correction -> effect):
  - Step 1: obs: The clock in the study shows ten minutes past eleven. | corr: This suggests the murder occurred after dinner, contradicting the schedule. | effect: Narrows the timeline of events.
  - Step 2: obs: A slight scratch on the clock's case indicates tampering. | corr: This indicates someone altered the clock to mislead others about the time. | effect: Eliminates the possibility of an accidental death.
  - Step 3: obs: A torn piece of the dinner schedule was found in Eleanor's pocket. | corr: This suggests she was aware of the schedule's deception. | effect: Indicates possible premeditation by the killer.
- Discriminating test method: trap
- Discriminating test design constraint: A confrontation is staged where Captain Hale must account for the altered time on the clock while referring to the dinner schedule.
- Test must rely on already-shown clue IDs: clue_1, clue_2, clue_3, clue_9, clue_11
- Fair-play rationale: Step 1: The clock's time (early) and the dinner schedule (mid) let the reader identify a timeline contradiction. Step 2: The scratch on the clock (mid) indicates tampering. Step 3: The torn schedule (discriminating test) ties Hale to the premeditated murder.

## Character Reference

### Eleanor Voss (she/her — NEVER he/him)
Eleanor speaks in a measured, articulate manner, often punctuating her sentences with a soft, knowing laugh that belies her sharper wit
She has a tendency to draw out her vowels, especially when addressing those she deems beneath her.
Eleanor is torn between her desire to maintain her social standing and the reality of her financial ruin, leading to a growing paranoia about losing everything she has worked for.

### Dr. Mallory Finch (she/her — NEVER he/him)
Finch speaks with a gentle, calming tone, often using medical metaphors to illustrate her points
She has a habit of nervously adjusting her glasses when discussing sensitive topics, betraying her inner turmoil.
Dr. Finch grapples with the guilt of her affair, torn between her feelings for her lover and the potential fallout of their relationship coming to light.

### Captain Ivor Hale (he/him — NEVER she/her)
Ivor speaks with a deliberate cadence, often punctuating his statements with anecdotes from his naval days
He has a penchant for nautical metaphors, which he employs even in mundane conversations.
Ivor is torn between his desire for recognition and the realization that clinging to past grievances may prevent him from moving forward.

### Beatrice Quill (she/her — NEVER he/him)
Beatrice speaks with a whimsical cadence, often punctuating her thoughts with dramatic flair
She has a tendency to use vivid imagery and metaphors, reflecting her artistic inclinations.
Beatrice wrestles with the ethics of her ambitions, questioning whether her pursuit of success justifies her willingness to compromise her values.


## CHARACTER CONTRACTS (binding for this scene)
Each entry below constrains how this character must be written in this chapter.
These override generic style guidance when they conflict.

### Eleanor Voss[SHE]
Voice & mannerisms: Eleanor speaks in a measured, articulate manner, often punctuating her sentences with a soft, knowing laugh that belies her sharper wit. She has a tendency to draw out her vowels, especially when addressing those she deems beneath her.
Sample voice fragments (match this register and rhythm):
  [comfortable] "Ah, the garden is simply divine this time of year, isn't it? The roses have never looked better."
  [evasive] "Oh, I wouldn’t worry about that; it’s just a minor issue, nothing we can’t handle."
Humour: polite savagery — deploy occasionally (level 0.6)
FORBIDDEN phrase (never write for Eleanor Voss): "she felt a wave of unease"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Determined to preserve her family's legacy, she navigates the treacherous waters of familial conflict, fearing the loss of control over her estate." — do not surface in Act I.

### Dr. Mallory Finch[SHE]
Voice & mannerisms: Dr. Finch speaks with a gentle, calming tone, often using medical metaphors to illustrate her points. She has a habit of nervously adjusting her glasses when discussing sensitive topics, betraying her inner turmoil.
Sample voice fragments (match this register and rhythm):
  [comfortable] "You know, healing isn’t just about the body; the mind needs care too."
  [evasive] "I’m sure it’s just a misunderstanding; let’s not jump to conclusions."
Humour: self deprecating — deploy occasionally (level 0.4)
FORBIDDEN phrase (never write for Dr. Mallory Finch): "she knew with certainty she was right"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "The fear of her affair being discovered looms large, especially with the victim's potential knowledge of her indiscretion." — do not surface in Act I.

### Captain Ivor Hale[HE]
Voice & mannerisms: Ivor speaks with a deliberate cadence, often punctuating his statements with anecdotes from his naval days. He has a penchant for nautical metaphors, which he employs even in mundane conversations.
Sample voice fragments (match this register and rhythm):
  [comfortable] "I recall a time at sea when honor was everything; those were the days."
  [evasive] "I suppose everyone has their own version of the truth, don’t they?"
Humour: dry wit — deploy occasionally (level 0.5)
FORBIDDEN phrase (never write for Captain Ivor Hale): "a surge of determination washed over her"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "He believes he deserves a larger share of the estate, a matter of family honor that he feels has been overlooked." — do not surface in Act I.

### Beatrice Quill[SHE]
Voice & mannerisms: Beatrice speaks with a whimsical cadence, often punctuating her thoughts with dramatic flair. She has a tendency to use vivid imagery and metaphors, reflecting her artistic inclinations.
Sample voice fragments (match this register and rhythm):
  [comfortable] "Imagine if my words could paint a picture; how vivid that would be!"
  [evasive] "Oh, that’s just a passing thought; let’s focus on the gala, shall we?"
Humour: sardonic — deploy frequently (level 0.7)
FORBIDDEN phrase (never write for Beatrice Quill): "palpable tension filled the room"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Her ambition to escape financial struggles drives her desire to secure a patron through her connection to the estate." — do not surface in Act I.



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
A sprawling estate steeped in history, Little Middleton Manor serves as the backdrop for tension and intrigue as secrets unravel among its guests.

Key Locations Available:
- The Library (interior): Crime scene
- The Drawing Room (interior): Gathering space
- The Owner's Study (interior): Restricted access; private meetings
- The Gardens (exterior): Outdoor space for leisure and reflection

Atmosphere (tonal cue only — do NOT reproduce this phrase verbatim in prose; translate into scene-specific, character-observed sensory language): tense and foreboding, with an undercurrent of suspicion among the guests
Weather: overcast with intermittent rain, creating a gloomy ambiance

Era markers: Petrol-powered automobiles parked in the gravel driveway | Typewriters clacking in the study | Domestic telephones mounted on the walls

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
  - Visual: Dust motes dancing in the light, Leather spines glistening faintly, A shattered vase on the floor
  - Sounds: The crackling of a fire, The rustle of paper, Footsteps echoing softly
  - Scents: Old leather, Burning wood, Hints of mildew
  - Touch: Worn leather armchair, Cold marble table surface

The Drawing Room (interior):
  - Visual: Heavy drapes framing large windows, Intricate moldings on the ceiling, A grand chandelier hanging low
  - Sounds: Laughter echoing off the walls, The sound of ice clinking in glasses, Muffled conversations
  - Scents: Fresh flowers in a vase, Scent of cigar smoke, Hints of perfume
  - Touch: Soft velvet cushions, Cool marble fireplace mantle

The Owner's Study (interior):
  - Visual: Rich mahogany furniture, A globe in the corner, Dim light from a single desk lamp
  - Sounds: The ticking of a clock, Rustling papers, The crack of a fire
  - Scents: Old books, Pipe tobacco, Leather polish
  - Touch: Cool brass doorknob, Smooth surface of the desk

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

- Living in February 1938 is marked by an air of uncertainty as whispers of war ripple through society
- The remnants of the Great Depression still haunt the populace, with many struggling to make ends meet while the wealthy host extravagant gatherings, masking their privilege behind layers of social etiquette
- Class tensions are palpable, as the disparity between the upper crust and the working class widens
- The looming threat of fascism in Europe adds to the anxious atmosphere, with people increasingly concerned about the future
- The cold winter weather mirrors the chilling realities faced by many, making each interaction more fraught with unspoken tensions and hidden motives.

TEMPORAL CONTEXT:

This story takes place in February 1938 during winter.

Seasonal Atmosphere:
- Weather patterns: overcast skies, intermittent rain, chilly winds
- Daylight: Short daylight hours, with dusk settling around five o'clock in the evening.
- Seasonal activities: indoor gatherings by the fireplace, listening to radio dramas, playing parlor games
- Seasonal occasions: Valentine's Day (February 14)
- Season: winter

Period Fashion (describe naturally):
- Men formal: tailored dark wool suit, white dress shirt with a stiff collar, silk tie in muted colors
- Men casual: tweed blazer, knitted sweater, corduroy trousers
- Men accessories: silver cufflinks, felt fedora, leather gloves
- Women formal: elegant tea-length dress with a fitted bodice, long evening gloves, beaded clutch purse
- Women casual: wool sweater with a high neckline, A-line skirt, tweed coat
- Women accessories: string of pearls, stylish beret, silk scarf

Cultural Context (reference naturally):
- Music/entertainment: Benny Goodman and his orchestra, Ella Fitzgerald's jazz standards, Glenn Miller's big band hits; Films: The Adventures of Robin Hood, Snow White and the Seven Dwarfs; Theatre: The Front Page, The Cradle Will Rock; Radio: The Shadow, Amos 'n' Andy
- Typical prices: Loaf of bread: four pence, A pint of milk: three pence, Taxi across town: two shillings
- Current events: rising tensions in Europe with the threat of war looming; British government debating defense strategies
- Literature: The Maltese Falcon by Dashiell Hammett | Brave New World by Aldous Huxley | Of Mice and Men by John Steinbeck | [detective fiction] | [social realist novels] | [science fiction]
- Technology: the ballpoint pen | the television (still in early experimental phase) | the electric washing machine | domestic telephones | petrol-powered cars | typewriters
- Daily life: attending social clubs, reading the newspaper, hosting tea parties
- Social rituals: afternoon tea gatherings, formal dinner parties, dance evenings

Atmospheric Details:
The musty scent of damp wood and old books fills the air, as raindrops patter against the windows. Flickering candlelight casts long shadows across the walls, enhancing the sense of mystery and unease. The low hum of a radio drama seeps through the walls, blending with the whispers of guests exchanging furtive glances.

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
2. Fashion descriptions: Every character gets fashion description on first a
[truncated for prompt budget]

NON-NEGOTIABLE CHAPTER OBLIGATIONS — LOCKED EVIDENCE PHRASES (VERBATIM REQUIRED):
The following physical evidence values are absolute ground truth. Every time this chapter describes, mentions, or alludes to the relevant evidence — no matter how briefly — it MUST use the exact phrase shown below, character for character. NO paraphrase, approximation, rounding, or synonym is permitted.

FAILURE EXAMPLE: if the locked value is "at thirteen minutes to midnight" and you write "just before midnight" or "around midnight" — that is a HARD FAIL. You must write "at thirteen minutes to midnight". Equally, if the locked value is written in words, such as "ten minutes past eleven", and you convert it to figure-based clock notation — that is also a HARD FAIL. Words stay as words; figure forms are forbidden for word-phrased facts.

CRITICAL — WORD-PHRASED VALUES: If the canonical value is written out in words (e.g. a time like "ten minutes past eleven", or an amount like "forty minutes"), reproduce those exact words. DO NOT convert to figure-based time notation, twenty-four-hour format, or any other numeric shorthand. Correct: "ten minutes past eleven". WRONG: figure-based clock notation or numeric shorthand.

Locked facts:
  - The exact time shown on the stopped clock face: "ten minutes past eleven"
    ⛔ FORBIDDEN alternatives: "11:10", "11.10", "eleven ten", "eleven-ten", "eleven past ten", "quarter past eleven", "half past eleven" — the ONLY acceptable form is "ten minutes past eleven"
  - The exact amount the clock was wound back: "forty minutes"
  - The actual time of the murder based on witness statements: "half past eleven"
    ⛔ FORBIDDEN alternatives: "11:30", "11.30", "eleven thirty", "eleven-thirty", "eleven past thirty", "quarter past eleven" — the ONLY acceptable form is "half past eleven"

If a locked fact has no relevance to this chapter, omit it. But the moment you reference the underlying evidence, only the exact phrase above is acceptable.

⛔ CLUES TO SURFACE IN THESE CHAPTERS — mandatory:
The following evidence MUST be clearly observable to an attentive reader. Do not bury it in atmosphere or passing dialogue. Each clue must be concrete, specific, and noticeable:

• [clue_1] The clock in the study shows ten minutes past eleven.
  Category: temporal | Criticality: essential | Supports inference step 1
  Points to: The time indicated by the clock is crucial to understanding the murder timeline.

• [clue_2] A slight scratch on the clock's case indicates tampering.
  Category: temporal | Criticality: essential | Supports inference step 2
  Points to: Evidence of tampering with the clock that could mislead the investigation.

• [clue_3] This indicates someone altered the clock to mislead others about the time.
  Category: temporal | Criticality: essential | Supports inference step 2
  Points to: The implication of tampering with the clock to create a false timeline.

For each clue above: an attentive reader should be able to find, record, and later use it to reason toward the solution.

═══ NARRATIVE STATE (read-only — do not contradict) ═══

LOCKED FACTS — use verbatim whenever this evidence is described:
  • The exact time shown on the stopped clock face: "ten minutes past eleven"
  • The exact amount the clock was wound back: "forty minutes"
  • The actual time of the murder based on witness statements: "half past eleven"

CHARACTER PRONOUNS — never deviate from these:
  • Eleanor Voss: she/her/her
  • Dr. Mallory Finch: she/her/her
  • Captain Ivor Hale: he/him/his
  • Beatrice Quill: she/her/her

CLUES ALREADY REVEALED TO READER: clue_mechanism_visibility_core, clue_core_contradiction_chain — do not reveal these as new information.

INVESTIGATION LOG — WHAT IS ESTABLISHED (do not re-establish, do not repeat):
• Evidence in reader's hands: The mechanism relies on clock, witness, and study to expose the false timing. | This suggests the murder occurred after dinner, contradicting the schedule.
• Suspects still unresolved: Eleanor Voss[SHE], Dr. Mallory Finch[SHE], Beatrice Quill[SHE]
⚠ The story must move FORWARD from this log. Any beat already listed above is forbidden from repeating.

⚠ THIS CHAPTER'S REQUIRED ADVANCE (early): Interview each suspect — record their claimed whereabouts

CONTINUITY HANDOFF — previous chapter closing beat:
  • "Beatrice, her voice trembling, chimed in, "But we all loved Eleanor! Why would any of us want to harm her?" The desperation in her tone echoed through the study, a reminder of the emotional turmoil that gripped them all. Dr. Finch felt the weight of their shar..."
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
study, estate, drawing room

✓ RULE: Continue using this location vocabulary. Maintain consistency with established setting type.
✓ Do NOT introduce new location types that contradict earlier chapters.

**Recent Chapter Summary (for narrative continuity):**
Chapter 1: Chapter 1: Discovery
  Events: the doctor Finch stepped into the study of Eleanor Voss's estate, the cold morning air biting at her skin as she crossed the threshold.
Chapter 2: Chapter 2: Initial Investigation
  Events: The sound of raindrops pattering against the windowpanes filled the study, a relentless reminder of the dreary winter morning.

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
Known location profile anchors: Little Middleton Manor, The Library, The Drawing Room, The Owner's Study, The Gardens, the study
LOCATION NAME CAPITALISATION (HARD REQUIREMENT — validated):
All named locations in your prose MUST use the EXACT capitalisation from the CML profiles.
Canonical forms: "Little Middleton Manor", "The Library", "The Drawing Room", "The Owner's Study", "The Gardens", "the study"
Writing a location in lowercase (e.g. "drawing room" instead of "Drawing Room") is a validated error. Every time you mention a named location, copy its capitalisation from the list above.
- Chapter 3: OPENING STYLE (HARD): Start the VERY FIRST SENTENCE with an explicit time marker — e.g. "That morning…" / "By the time dusk fell…" / "It was nearly four o'clock…" / "On the second day after the discovery…". Time must be in the first clause. Anchor opening in "the study". HARD REQUIREMENT for the first 2 paragraphs: (a) include 2+ sensory words — choose from smell/scent/sound/echo/silence/creak/whisper/cold/warm/damp/rough/smooth/glow/shadow/flicker/dim — and (b) include 1+ atmosphere/time word — choose from rain/wind/fog/storm/mist/thunder/evening/morning/night/dawn/dusk/season/afternoon/midday/noon/midnight/twilight/sunrise/sunset/daylight/sunlight/overcast/cloudy/bright/dark. These are validated requirements, not style suggestions; missing them triggers a retry.

[⚠ INTERNAL QUALITY DIAGNOSTICS — DO NOT REPRODUCE ANY PART OF THIS SECTION IN YOUR STORY OUTPUT. These are private generator observations for your consideration only. Your narrative must read as if this section does not exist. Never include phrases from this block in character dialogue, narration, or description.]

PRIOR CHAPTER QUALITY OBSERVATIONS:
- Chapter 1 (score 86/100):
  Quality gaps noted: word density below preferred target (662/1000); scene grounding weakness
  Address in upcoming chapters: Increase chapter density with concrete investigation action and sensory-grounded beats; avoid recap-only padding. | Open next chapter with a named location anchor plus at least two sensory cues and one atmosphere marker.
- Chapter 2 (score 91/100):
  Quality gaps noted: word density below preferred target (837/1000); scene grounding weakness
  Address in upcoming chapters: Increase chapter density with concrete investigation action and sensory-grounded beats; avoid recap-only padding. | Open next chapter with a named location anchor plus at least two sensory cues and one atmosphere marker.
[END INTERNAL DIAGNOSTICS]

PROMPT BUDGET SUMMARY: budget=32000 tokens; fixed=7931; context=11547; dropped=[none]; truncated=[pronoun_accuracy, temporal_context]

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

QUALITY GUIDELINES (strongly preferred):
1. Use only canonical cast names from CML. Do not invent titled placeholders like 'Detective Surname', 'Inspector Surname', 'a woman Surname', or 'a man Surname'.
2. Before the final reveal closes, include explicit suspect-elimination coverage: each non-culprit suspect is ruled out with concrete on-page evidence or confirmed alibi.
3. In the reveal sequence, include a complete culprit evidence chain using explicit reasoning connectors (because/therefore/proves).
4. Integrate at least two concrete era-grounded details per chapter from setting refinement signals: petrol-powered automobiles | domestic telephones | typewriters in offices | radio broadcasts | party-line telephones | telegrams for urgent messages.
5. Respect setting movement/access constraints in scene action and alibis: large estate grounds limit movement to pathways | interior design creates natural barriers between rooms | weather conditions could affect outdoor access and visibility | restricted areas such as the owner’s study and servant quarters | daily routines dictate access to certain rooms at specific times.
6. Sustain social coherence with this backdrop pressure: A tense inheritance dispute amidst the Great Depression forces the estate's owners and their staff to confront class tensions and personal loyalties under the shadow of rising fascism.
7. Maintain continuity around these socially central cast anchors where relevant: Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill.
8. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Moderate: Character similarity 0.74 with 'The Sign of the Four' (similar cast structure and roles)
9. STORY TO DATE ANTI-COPY RULE: The STORY TO DATE section below is provided for chronological and factual reference ONLY. You MUST NOT copy, lightly rephrase, or structurally echo any sentence or paragraph from prior chapters. Every sentence in this chapter must be original prose unique to this scene. Reusing even a clause from prior chapter text will cause this attempt to fail immediately.

CRITICAL PROSE REQUIREMENTS:

The CML specifies exact requirements for certain validation-critical scenes. You MUST include these elements at the specified positions.

**Discriminating Test Scene (Act 3, Scene 4):**
Required elements: Execute the discriminating test, Observe the culprit's reaction or result, Draw conclusion about guilt
Test type: trap

**Suspect Clearance Scenes:**
- Beatrice Quill (Act 3, Scene 5): Beatrice's alibi confirms she was in the servants' quarters during the murder.
  Clues: clue_1, clue_2
- Dr. Mallory Finch (Act 3, Scene 5): Dr. Finch's consistent presence with Eleanor before the murder rules her out.
  Clues: clue_1, clue_2
- Eleanor Voss (Act 3, Scene 5): Alibi confirmed: none

**Culprit Revelation Scene (Act 3, Scene 6):**
Method: Confrontation with evidence

**Clue Placement for These Chapters:**
- clue_1 must appear in Act 1, Scene 3 via Direct observation
- clue_2 must appear in Act 1, Scene 3 via Found evidence
- clue_3 must appear in Act 1, Scene 3 via Witness statement

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
- Chapter 3:
  - STRUCTURAL ARCHETYPE — Chapter 3 must be: EVIDENCE
      ✓ MUST contain: new physical clue discovered
      ✗ MUST NOT contain: formal accusation
  - Word count: Target 1250 words. Achieve this through plot events, dialogue exchanges, and physical investigation — not through atmospheric repetition or extended internal reflection. Each 200-word segment should contain at minimum one concrete story event (a discovery, a conversation exchange, a physical action or movement). Padding with atmosphere alone is not acceptable.
  - Opening: Begin with a character action, spoken line, or clock/time marker — never a location name or location-description phrase.
  - Scene is set in: the study — reference it naturally within the paragraph, never as your opening phrase.
  - Opening atmosphere (MANDATORY — validator enforced): the first paragraph MUST contain at least one of: rain / wind / fog / storm / mist / thunder / evening / morning / night / dawn / dusk / season / afternoon / midday / noon / midnight / twilight / sunrise / sunset / daylight / sunlight / overcast / cloudy / bright / dark / grey / pale / cold / warm / chill / crisp / damp / drizzle / haze / lamplight / firelight. A chapter that omits all of these from its opening paragraph will be rejected.
  - Continuity bridge: in the first 120 words, visibly connect from the previous chapter's final beat. Carry forward one unresolved element (object, accusation, emotional pressure, or immediate physical action) from: "Beatrice, her voice trembling, chimed in, "But we all loved Eleanor! Why would any of us want to harm her?" The desperation in her tone echoed through the study, a reminder of the emotional turmoil that gripped them all....".
  - CLUE OBLIGATIONS — mandatory prose elements (do NOT omit or bury):
    • The clock in the study shows ten minutes past eleven. [clue_1] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: The time indicated by the clock is crucial to understanding the murder timeline.
      ↳ MANDATORY TWO-PARAGRAPH STRUCTURE (must appear in paragraphs 1 or 2 — no later):
         Paragraph 1: The POV character physically approaches or directly observes this evidence.
           The narration or dialogue explicitly states what is seen (use the exact locked phrase if one applies).
         Paragraph 2 (immediately following): The detective or POV character explicitly reasons
           about what this evidence implies — who it implicates, why it may be unreliable,
           or what inference it supports. This must be a separate full paragraph, not a sentence appended to Paragraph 1.
    • A slight scratch on the clock's case indicates tampering. [clue_2] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: Evidence of tampering with the clock that could mislead the investigation.
      ↳ MANDATORY TWO-PARAGRAPH STRUCTURE (must appear in paragraphs 1 or 2 — no later):
         Paragraph 1: The POV character physically approaches or directly observes this evidence.
           The narration or dialogue explicitly states what is seen (use the exact locked phrase if one applies).
         Paragraph 2 (immediately following): The detective or POV character explicitly reasons
           about what this evidence implies — who it implicates, why it may be unreliable,
           or what inference it supports. This must be a separate full paragraph, not a sentence appended to Paragraph 1.
    • This indicates someone altered the clock to mislead others about the time. [clue_3] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: The implication of tampering with the clock to create a false timeline.
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
  - If this batch mentions The actual time of the murder based on witness statements, write exactly: "half past eleven".
- Seasonal vocabulary allow-list: winter, wintry, midwinter.
- Forbidden seasonal words: spring, summer, autumn.

FROZEN FACT STATE (DO NOT ALTER):
- Timeline anchor: February (winter).
- Month, season, weather, and time-of-year language in this batch must stay compatible with winter.
- Established timeline fact: dinner schedule
- Established timeline fact: witness accounts
- If referenced, use exact phrase: "ten minutes past eleven" (The exact time shown on the stopped clock face).
- If referenced, use exact phrase: "forty minutes" (The exact amount the clock was wound back).
- If referenced, use exact phrase: "half past eleven" (The actual time of the murder based on witness statements).

STORY TO DATE (REFERENCE ONLY — DO NOT COPY VERBATIM):
- Full prior chapter text is provided below for continuity, factual consistency, and reference accuracy.
- Use this to keep character voice, chronology, clue state, and location continuity aligned with earlier chapters.
- Do not quote, copy, or paraphrase these paragraphs too closely; write fresh prose that remains consistent with them.

--- BEGIN PRIOR CHAPTER 1 ---
Title: Chapter 1: Discovery
the doctor Finch stepped into the study of Eleanor Voss's estate, the cold morning air biting at her skin as she crossed the threshold. Outside, the rain drummed steadily against the windowpanes, a relentless reminder of the dreary winter day. The flickering lamplight cast eerie shadows across the room, illuminating the rich mahogany furniture and the cluttered desk that bore the weight of Eleanor's secrets. A sense of foreboding hung in the air, thick and suffocating, as if the very walls were privy to the tragedy that had unfolded within their confines.

As Dr. Finch moved further into the room, her gaze fell upon the clock mounted above the fireplace. Its hands were frozen, betraying the time of death with a chilling precision: "ten minutes past eleven." The sight of the clock sent a shiver down her spine, for it contradicted everything they had believed about the timeline of the evening. She had been present during dinner, and the entire household had gathered around the table, blissfully unaware of the horror that awaited them. The implication was clear—Eleanor had died after dinner, and the clock's stillness suggested foul play.

Dr. Finch's heart raced as she contemplated the implications of the stopped clock. If Eleanor had indeed been killed at "ten minutes past eleven," that meant she had died no later than "half past eleven," a fact that would undoubtedly complicate the alibis of the other guests. The doctor felt a knot of anxiety tighten in her stomach as she considered who might have had the motive and opportunity to commit such a heinous act. She glanced around the room, noting the expressions of shock and disbelief on the faces of the others who had gathered in the study.

the captain Hale stood rigidly by the door, his usually composed demeanor shattered. Her eyes darted from the clock to Eleanor's lifeless form sprawled on the floor. The tension in the room was palpable, and Dr. Finch could sense the weight of unspoken accusations hanging in the air. "We mustn't jump to conclusions," Hale said, his voice strained. "We need to understand what happened here before we start pointing fingers."

Beatrice Quill, her hands trembling, stepped closer to the body, her artistic sensibilities clashing with the grim reality before her. "This is dreadful, simply dreadful!" she exclaimed, her voice quavering. "Eleanor was the life of our gatherings. How could this happen?" Her eyes glistened with unshed tears, and Dr. Finch felt a pang of sympathy for her friend, who had always been the most vibrant of their circle.

Eleanor lay motionless, her elegant dress now a stark contrast to the chaos that had erupted in the study. Dr. Finch knelt beside her, checking for any signs of life, but there was nothing. The stillness of the room was deafening, broken only by the sound of rain tapping against the glass. The doctor felt a surge of determination; she could not let Eleanor's death go unanswered. She had to uncover the truth, no matter the cost.

As the guests exchanged nervous glances, Dr. Finch's mind raced with possibilities. The clock's hands had been tampered with, she was certain of it. But who would dare to manipulate time itself to conceal a murder? A sense of urgency gripped her. The longer they waited to investigate, the more likely the murderer would slip away into the shadows. She rose to her feet, her resolve solidifying. "We need to examine the clock more closely," she declared, her voice steady despite the turmoil around her. "It holds the key to understanding what happened here."

Captain Hale nodded, his expression one of reluctant agreement. "Very well, but we must tread carefully. We cannot afford to make accusations without evidence. This is a delicate situation, and I suggest we keep our voices low." He moved toward the clock, his brow furrowed in concentration. Dr. Finch followed closely, her heart racing as they prepared to uncover the truth behind Eleanor's tragic demise.
--- END PRIOR CHAPTER 1 ---

--- BEGIN PRIOR CHAPTER 2 ---
Title: Chapter 2: Initial Investigation
The sound of raindrops pattering against the windowpanes filled the study, a relentless reminder of the dreary winter morning. Captain Hale stood rigidly by the door, his posture tense as he contemplated the clock's stillness. "We must tread carefully," he murmured, his voice barely above a whisper, as if the shadows of the room were listening intently. The flickering lamplight cast eerie shapes on the walls, illuminating the chaos that had erupted in the wake of Eleanor's tragic demise. Dr. Finch's heart raced as she approached the clock, its hands frozen at ten minutes past eleven, a chilling testament to the events that had transpired. The implications weighed heavily on her mind, each tick of the clock echoing the urgency of the situation.

Dr. Finch's gaze shifted from the clock to Eleanor's lifeless form sprawled on the floor. The sight was haunting, a stark contrast to the vibrant life Eleanor had once embodied. "If the clock shows ten minutes past eleven, that means Eleanor must have died after dinner," Dr. Finch reasoned, her voice steady despite the turmoil around her. The realization sent a shiver down her spine. The dinner had concluded, and the guests had gathered in the drawing room, blissfully unaware of the horror unfolding just a few feet away. The contradiction was undeniable, and it raised questions about the alibis of everyone present. Who had the opportunity to commit such a heinous act? The clock's reading contradicted their accounts, and the tension in the room thickened as the implications settled over them.

Beatrice Quill, her hands trembling, stepped closer to Eleanor's body, her artistic sensibilities clashing with the grim reality before her. "This is dreadful, simply dreadful!" she exclaimed, her voice quavering. "Eleanor was the life of our gatherings. How could this happen?" Dr. Finch noticed the glistening tears in Beatrice's eyes, a poignant reminder of the fragility of life. The emotional weight of the moment hung heavily in the air, and Dr. Finch felt a pang of sympathy for her friend, who had always been the most vibrant of their circle. Yet, beneath Beatrice's grief lay a flicker of ambition that Dr. Finch couldn't ignore. Had Beatrice's aspirations ever clashed with Eleanor's? The thought lingered, casting a shadow over their shared sorrow.

Captain Hale clenched his fists, visibly frustrated. "We need to establish a timeline here! If Eleanor died after dinner, then her death must have been premeditated!" His voice rose, the tension in the room palpable. Dr. Finch exchanged a glance with her, recognizing the urgency in her words. "But we mustn't jump to conclusions," she cautioned, her tone measured. "We need to gather more information before we start pointing fingers. There are too many unknowns at play." The captain's expression softened slightly, but the underlying tension remained. They were all caught in a web of uncertainty, and every second that passed felt like a step further away from the truth.

As the guests exchanged nervous glances, Dr. Finch's mind raced with possibilities. The clock's hands had been tampered with, she was certain of it. But who would dare to manipulate time itself to conceal a murder? The thought gnawed at her, and she felt a surge of determination. The longer they waited to investigate, the more likely the murderer would slip away into the shadows. "We need to examine the clock more closely," she declared, her voice steady despite the turmoil around her. "It holds the key to understanding what happened here." Captain Hale nodded, his expression one of reluctant agreement. "Very well, but we must tread carefully. We cannot afford to make accusations without evidence. This is a delicate situation, and I suggest we keep our voices low."

Dr. Finch stepped closer to the clock, her brow furrowed in concentration. "The clock's reading contradicts the dinner schedule," she murmured, her mind racing. "If Eleanor died after dinner, it complicates everything. We need to consider who had the motive and opportunity to alter the timeline." Captain Hale's expression darkened as he recalled their earlier argument. "He and I had a disagreement earlier in the evening. It was about the estate and his plans for the future. Perhaps that could provide a motive, but we mustn't assume too much." The tension in the room mounted as the implications of his words sank in. Could personal grievances have driven someone to murder?

Beatrice, her voice trembling, chimed in, "But we all loved Eleanor! Why would any of us want to harm her?" The desperation in her tone echoed through the study, a reminder of the emotional turmoil that gripped them all. Dr. Finch felt the weight of their shared grief, but she also sensed the fragile nature of their relationships. Secrets lay buried beneath the surface, and as the investigation unfolded, they would have to confront not only the truth about Eleanor's death but also the truths about themselves. The clock ticked on, its frozen hands a reminder of the urgency of their situation, and Dr. Finch steeled herself for the challenges ahead.
--- END PRIOR CHAPTER 2 ---

[SCENE COMPLETENESS CONTRACTS — MANDATORY. Each contract below lists what you MUST enact in that chapter. Do not summarise or mention these labels in the prose — enact them organically.]
Chapter 3 (Act 1) completeness contract:
  PIVOT ELEMENT (MANDATORY — write this into the prose, shown not told): "The scratch on the clock's case indicating tampering."
  FACT ESTABLISHED (MANDATORY — reader must know this by chapter end): "Establishes that the clock was tampered with, suggesting premeditation in the murder."

# Case Overview
Title: The Clockwork Deception
Era: 1930s
Setting: Little Middleton
Crime: murder (clock tampering)
Culprit: Captain Ivor Hale
False assumption: Eleanor must have been killed during the dinner, as per the schedule.
Cast: Eleanor Voss (she/her), Dr. Mallory Finch (she/her), Captain Ivor Hale (he/him), Beatrice Quill (she/her)

Setting Lock: Keep all scenes and descriptions consistent with the stated setting (Little Middleton). Do not introduce a different location type.

Outline scenes:
[
  {
    "sceneNumber": 3,
    "act": 1,
    "title": "The Clock",
    "setting": {
      "location": "the study",
      "timeOfDay": "Early afternoon",
      "atmosphere": "Sombre and contemplative as the investigation deepens"
    },
    "characters": [
      "Dr. Mallory Finch",
      "Captain Ivor Hale",
      "Eleanor Voss",
      "Beatrice Quill"
    ],
    "purpose": "Reveal critical clues about the clock and the murder method.",
    "cluesRevealed": [
      "clue_1",
      "clue_2",
      "clue_3"
    ],
    "dramaticElements": {
      "conflict": "Tensions rise as suspicions shift among the guests.",
      "tension": "The discovery of tampering raises the stakes.",
      "microMomentBeats": [
        "Dr. Finch brushes her fingers over the clock, lost in thought."
      ]
    },
    "summary": "Dr. Finch inspects the clock in detail, discovering a slight scratch on its case indicating tampering. The guests discuss the implications, realizing that someone altered the clock to mislead the investigation. This revelation deepens the mystery surrounding Eleanor's death.",
    "estimatedWordCount": 1800,
    "pivotElement": "The scratch on the clock's case indicating tampering.",
    "factEstablished": "Establishes that the clock was tampered with, suggesting premeditation in the murder.",
    "permittedBehavioursByAct": [
      {
        "characterName": "Eleanor Voss",
        "behaviour": "normal social behaviour; grief"
      },
      {
        "characterName": "Dr. Mallory Finch",
        "behaviour": "normal social behaviour; grief"
      },
      {
        "characterName": "Captain Ivor Hale",
        "behaviour": "normal social behaviour; grief"
      },
      {
        "characterName": "Beatrice Quill",
        "behaviour": "normal social behaviour; grief"
      }
    ],
    "redHerringPlacement": null,
    "emotionalRegister": "The investigation begins with emotional turmoil as secrets start to surface.",
    "dominantCharacterNote": {
      "name": "Eleanor Voss",
      "voiceRegister": "Eleanor speaks with an elegant cadence, her voice often laced with a sharp wit that belies her polished exterior."
    },
    "humourGuidance": {
      "permission": "conditional",
      "character": "Captain Ivor Hale",
      "form": "dry_wit"
    },
    "eraTextureNote": "Short daylight hours limit social interactions.; Overcast weather discourages outdoor activities.; Chilly winds make gatherings indoors more appealing, leading to claustrophobic tension.; Public transport struggles with increased demand and limited resources.; Communication is slower, relying on letters and newspapers for news.",
    "locationRegisterNote": ""
  }
]
```

## Message 3 (role=user)

```text
BEFORE SUBMITTING YOUR JSON — verify this checklist:
□ Each chapter reaches the hard floor of 500 words and aims for 1250 words or more.
□ If you mention locked evidence, you used the exact locked phrase verbatim.
□ Allowed seasonal words only: winter, wintry, midwinter.
□ Forbidden seasonal words: spring, summer, autumn.
□ Chapter 3: "The clock in the study shows ten minutes past eleven." is placed in the first 25% of the chapter, followed by an explicit inference or suspicion paragraph.
□ Chapter 3: "A slight scratch on the clock's case indicates tampering." is placed in the first 25% of the chapter, followed by an explicit inference or suspicion paragraph.
□ Chapter 3: "This indicates someone altered the clock to mislead others about the time." is placed in the first 25% of the chapter, followed by an explicit inference or suspicion paragraph.
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
