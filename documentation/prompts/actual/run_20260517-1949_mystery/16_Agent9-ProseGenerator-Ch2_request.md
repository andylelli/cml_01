# Actual Prompt Record

- Run ID: `mystery-1779047384958`
- Project ID: ``
- Timestamp: `2026-05-17T19:53:14.835Z`
- Agent: `Agent9-ProseGenerator-Ch2`
- Operation: `chat_request_full_prompt`
- Model: `GPT-4o-mini`
- Temperature: `0.42`
- Max Tokens: `4500`
- Attempt: `first`
- Prompt Hash: `14d371e20f6c3a3a`

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
- MORAL COMPLEXITY REQUIREMENT: The mechanism of this crime carries a moral gray area: "The culprit, driven by a desperate need to protect a loved one from financial ruin, elicits a degree of sympathy despite the crime." — the culprit reveal and denouement MUST acknowledge this ambiguity. Do not let the ending feel clean or simple. Give the reader at least one moment of uncomfortable sympathy or moral doubt.


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

## Era: 1930-11
In November 1930, the atmosphere is permeated with the tensions of the Great Depression. Daily life is marked by economic strife, with many struggling to make ends meet in a society divided by class. The wealthy cling to their status while the working class faces increasing hardship, creating a volatile environment. The air is thick with the scent of damp earth and smoke from fireplaces, reflecting the somber mood of the populace. Social events often highlight the disparities between classes, as the rich attempt to maintain their lavish lifestyles amidst growing discontent.
Emotional register: A collective sense of anxiety and uncertainty permeates the social fabric, with individuals striving to maintain appearances amidst growing despair.
Physical constraints: Short daylight hours limiting outdoor activities | Travel restrictions due to economic conditions | Limited access to entertainment as luxuries become scarce
Current tensions (weave into background texture): Economic struggles due to the Great Depression | Class conflict exacerbated by rising unemployment | Political uncertainty in Europe with fascism on the rise
Wartime context — Many men returning from service struggle with PTSD, facing societal pressure to appear strong.: War heroes are often celebrated, yet their internal battles remain invisible to the public eye. Absence effect: The absence of loved ones lost in the war leaves a palpable void, intensifying the grief and emotional turmoil within families.

## Story Theme
In a world where social standing is paramount, the quest for justice exposes the fragility of human connections amidst deception and betrayal, and reveals that evidence carries ethical weight, forcing characters to choose accountability over social performance when appearances and facts collide.

## Story Emotional Register
Dominant: A journey through deception and betrayal, culminating in the revelation of buried truths.

Arc:
The story opens at Little Middleton Manor, where an overcast sky sets a foreboding atmosphere, and the discovery of Eleanor Voss's body plunges the estate into chaos. As the investigation unfolds, the tension rises with each clue unearthed, revealing the emotional cost of secrets held tightly within the walls. Dr. Mallory Finch's nervous demeanor raises suspicions, while whispers of jealousy and financial desperation create a web of motives. A pivotal moment occurs when Beatrice Quill finds a note in Eleanor's study, suggesting deeper connections and hidden truths that shift the focus of the investigation. As the pressure mounts, the confrontation with Dr. Finch reveals her inability to explain the tampered clock, leading to a dramatic climax where loyalty, love, and ambition clash. In the aftermath, each character grapples with the emotional toll of the revelation, highlighting the fragility of human connections in a world built on deception.

The story opens: A sense of foreboding envelops the manor as the crime is discovered. As the investigation takes shape: Tension escalates as the investigation reveals secrets and motives. A first key turn arrives: The discovery of a critical note shifts the direction of the inquiry. At the mid-point of the story: The investigation gains momentum as evidence begins to surface.

A second pivot reshapes the course: The confrontation with Dr. Finch reveals cracks in her alibi. As tension reaches its height: Mounting pressure leads to a dramatic showdown. The climax brings the central question to a head: The truth comes to light, exposing the web of deceit. In the final resolution: Characters are left to grapple with the emotional fallout of the events.

Underpinning every turn is the story's central concern: In a world where social standing is paramount, the quest for justice exposes the fragility of human connections amidst deception and betrayal. This thread binds the individual emotional moments into a coherent journey.

The dominant register — A journey through deception and betrayal, culminating in the revelation of buried truths. — colours the prose from first chapter to last, ensuring the reader feels the weight of each revelation as moral consequence rather than mere puzzle mechanics.

## Emotional register at this point in the story
A sense of foreboding envelops the manor as the crime is discovered.

## Character Portraits (appearance & era)

### Eleanor Voss
Eleanor Voss embodies the tension of the 1930s, navigating her status as a wealthy heiress while grappling with financial ruin. The pressure to maintain her social standing during the Great Depression weighs heavily on her, forcing her to conceal her struggles beneath a veneer of elegance.
Era intersection: Her life reflects the societal expectations of women to maintain their households, even as she faces the harsh realities of economic instability.

### Dr. Mallory Finch
Dr. Mallory Finch represents the complexities of professional women in the 1930s, striving for recognition in a male-dominated field while grappling with personal feelings of inadequacy. Her dedication to healing contrasts with the societal pressures that seek to define her by her relationships.
Era intersection: Her internal conflict highlights the emerging discussions on women's rights, as she battles against societal norms that confine her identity.

### Captain Ivor Hale
Captain Ivor Hale embodies the war hero archetype, celebrated for his bravery yet haunted by the traumas of his service. His struggle with PTSD reflects the societal neglect of veterans during the economic downturn, revealing the hidden wounds that many bear.
Era intersection: His character underscores the tension between public admiration and private despair, illustrating the impact of war on mental health.

### Beatrice Quill
Beatrice Quill represents the aspirations of the younger generation, eager to climb the social ladder while navigating a secret affair that complicates her ambitions. Her artistic dreams collide with the harsh realities of class disparity during the 1930s.
Era intersection: Her pursuit of success in a tumultuous economic climate illustrates the challenges faced by women seeking independence and recognition.

## Character Voices

### Eleanor Voss (she/her/her)
Eleanor speaks with an elegant sophistication, her tone often laced with sharp wit that reveals her keen insights into social dynamics.
[comfortable] Ah, darling, isn't it wonderful to see such familiar faces? It feels like a scene from a delightful novel.
[evasive] Oh, I simply couldn't say. You know how the rumors swirl in our circles.
[stressed] I can't bear the thought of losing everything I've worked for—this is all I have left!
Humour: Her humour often veers into polite savagery, revealing her sharp intellect.

### Dr. Mallory Finch (she/her/her)
Dr. Finch's voice is calm and measured, often punctuated by dry wit, reflecting her analytical mind and emotional turmoil.
[comfortable] Of course, a healthy dose of skepticism is essential in my line of work.
[evasive] Well, it's all rather complicated, isn't it? Let's focus on the facts.
[stressed] I can't let my feelings interfere with my professionalism; it's all so exhausting!
Humour: Her dry wit often surfaces in discussions about life and love.

### Captain Ivor Hale (he/him/his)
Captain Hale's voice carries a sardonic edge, often using self-deprecating humor to mask his deeper struggles.
[comfortable] Ah, the glory of war! A tale for the ages, I'm sure.
[evasive] Let's not dwell on the past, shall we? The future is what matters.
[stressed] Every time I close my eyes, the memories come flooding back; it's like a war that never ends.
Humour: His humour is often sardonic, reflecting his inner turmoil.

### Beatrice Quill (she/her/her)
Beatrice speaks with animated enthusiasm, her voice reflecting her youthful ambition and artistic flair.
[comfortable] Isn't it just splendid to be alive amidst such beauty? Life is a canvas!
[evasive] Oh, I wouldn't want to trouble anyone with my petty concerns.
[stressed] What if they find out? My dreams could be dashed in an instant!
Humour: Her humour often combines artistic metaphors with a touch of self-deprecation.

## Location Registers (scene framing guides)

The Conservatory: The Conservatory pulsates with an eerie beauty, where vibrant blooms now juxtapose with the remnants of violence. The air is thick with tension, and the shattered glass reflects the fragility of life and the stark reality of death.. Camera angle: As a writer enters this space, they should feel the weight of secrets and the stark contrast between beauty and horror.. Era: The overcast sky and lingering rain create a haunting atmosphere, amplifying the sense of despair.

The Owner's Study: The study is a sanctuary of intellect, yet it holds the weight of unspoken truths. The ticking clock becomes a reminder of the urgency of time, as the search for answers intensifies amidst the shadows of doubt.. Camera angle: The writer should feel as if they are peeling back layers of history, uncovering hidden motives and secrets.. Era: The dim light and the scent of polished wood evoke a sense of nostalgia and introspection.

The Drawing Room: The Drawing Room is a warm yet deceptive space, where laughter and chatter mask the underlying tensions. Here, every smile holds a secret, and the atmosphere is charged with unspoken agendas.. Camera angle: As the writer enters, they should sense the duality of charm and deceit woven into the social fabric.. Era: The elegant decor reflects the opulence of the era, contrasting sharply with the looming class divides.

The Formal Gardens: The Formal Gardens are a picturesque facade, concealing the turmoil of hidden conversations and clandestine meetings. The beauty of nature belies the dark secrets lurking in the shadows.. Camera angle: The writer should feel an intriguing mix of serenity and tension, as if witnessing the unfolding of secrets.. Era: The gardens serve as both a retreat and a battleground for personal ambitions and desires.

## Humour guidance for this story position (opening)
Permission: forbidden
Rationale: The tone is somber due to the discovery of a murder.

FAIR-PLAY AND INFERENCE CONTRACT (from CML logic):
- False assumption in force: Eleanor must have been alive at the time indicated by the clock.
- Hidden truth to progressively expose: The clock was tampered with to mislead the investigation regarding the time of death.
- Inference path checkpoints to dramatize clearly (observation -> correction -> effect):
  - Step 1: obs: The clock shows ten minutes past eleven, but is smudged. | corr: The smudge indicates recent handling, suggesting tampering. | effect: Narrows down the time of death to before the clock was set.
  - Step 2: obs: Witnesses recall the clock striking the hour incorrectly before the incident. | corr: This means the clock's indicated time cannot be trusted. | effect: Eliminates reliance on the clock's time for determining Eleanor's death.
  - Step 3: obs: A note found in Eleanor's study mentions 'an hour gone by'. | corr: This aligns with the tampered time and suggests she was dead before the clock showed eleven. | effect: Eliminates Dr. Mallory Finch's alibi, as it doesn't match the real timeline.
- Discriminating test method: trap
- Discriminating test design constraint: A staged confrontation where Dr. Mallory Finch is asked to explain the tampered clock and its implications on his alibi.
- Test must rely on already-shown clue IDs: clue_1, clue_2, clue_3, clue_8, clue_5
- Fair-play rationale: Step 1: The clock's smudged hands and witness statements (early) reveal tampering. Step 2: The note in the study contradicts the clock's indicated time (mid), pinpointing the time of death. Step 3: The confrontation with Dr. Mallory Finch exposes his inability to provide a credible alibi (discriminating test), confirming his guilt.
- Never solve by withheld information. Keep reader-information parity with detective reasoning.

## Character Reference

### Eleanor Voss (she/her — NEVER he/him)
Eleanor speaks with an air of sophistication, often using refined vocabulary, yet she interjects sharp, witty remarks that reveal her keen insight into the social dynamics around her.
Eleanor grapples with the fear of being unmasked as a fraud, torn between her desire to maintain her social status and the reality of her financial struggles. This tension creates a sense of urgency in her actions, pushing her to the brink.

### Dr. Mallory Finch (she/her — NEVER he/him)
Mallory speaks with measured precision, often interjecting subtle humor into her conversations
She has a tendency to use medical metaphors, and her wit is often laced with an air of introspection.
Mallory experiences a profound internal struggle, torn between her feelings for Hale and her desire to maintain a professional demeanor. The constant tension between her heart and her duties creates an emotional burden she carries silently.

### Captain Ivor Hale (he/him — NEVER she/her)
Hale speaks with a charismatic confidence, frequently using humor to deflect from his deeper issues
His speech style often includes self-deprecating jests, yet hints at the pain lurking beneath.
Hale is trapped between his public persona as a war hero and the private reality of his trauma. The victim's mockery intensifies his feelings of inadequacy, leading him to question his worth and the validity of his experiences.

### Beatrice Quill (she/her — NEVER he/him)
Beatrice speaks with an animated cadence, often punctuating her thoughts with dramatic flair
Her dialogue is peppered with artistic metaphors and a touch of self-deprecating humor, reflecting her youthful ambition.
Beatrice struggles with the duality of her ambitions and her feelings for Hale, caught between the desire for genuine connection and the ruthless pursuit of success. This conflict creates a tension that colors her every interaction.


## CHARACTER CONTRACTS (binding for this scene)
Each entry below constrains how this character must be written in this chapter.
These override generic style guidance when they conflict.

### Eleanor Voss[SHE]
Voice & mannerisms: Eleanor speaks with an air of sophistication, often using refined vocabulary, yet she interjects sharp, witty remarks that reveal her keen insight into the social dynamics around her.
Sample voice fragments (match this register and rhythm):
  [comfortable] "Ah, darling, isn't it wonderful to see such familiar faces? It feels like a scene from a delightful novel."
  [evasive] "Oh, I simply couldn't say. You know how the rumors swirl in our circles."
Humour: polite savagery — deploy occasionally (level 0.6)
FORBIDDEN phrase (never write for Eleanor Voss): "she felt a wave of unease"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "The recent threats from the victim to expose her financial troubles have ignited a fierce desire to protect her social standing at all costs. Eleanor's fear of losing her status drives her actions, pushing her deeper into a moral quandary." — do not surface in Act I.

### Dr. Mallory Finch[SHE]
Voice & mannerisms: Mallory speaks with measured precision, often interjecting subtle humor into her conversations. She has a tendency to use medical metaphors, and her wit is often laced with an air of introspection.
Sample voice fragments (match this register and rhythm):
  [comfortable] "Of course, a healthy dose of skepticism is essential in my line of work."
  [evasive] "Well, it's all rather complicated, isn't it? Let's focus on the facts."
Humour: dry wit — deploy occasionally (level 0.5)
FORBIDDEN phrase (never write for Dr. Mallory Finch): "a surge of determination washed over her"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Frustration over the victim's incessant meddling in her personal life and her feelings for Hale fuel a simmering resentment. The victim's attempts to control Hale's affections leave Mallory feeling powerless and angry." — do not surface in Act I.

### Captain Ivor Hale[HE]
Voice & mannerisms: Hale speaks with a charismatic confidence, frequently using humor to deflect from his deeper issues. His speech style often includes self-deprecating jests, yet hints at the pain lurking beneath.
Sample voice fragments (match this register and rhythm):
  [comfortable] "Ah, the glory of war! A tale for the ages, I'm sure."
  [evasive] "Let's not dwell on the past, shall we? The future is what matters."
Humour: sardonic — deploy occasionally (level 0.4)
FORBIDDEN phrase (never write for Captain Ivor Hale): "palpable tension filled the room"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "The victim's belittling remarks about his service and trauma foster a growing resentment within Hale, leading him to contemplate the consequences of an impulsive reaction." — do not surface in Act I.

### Beatrice Quill[SHE]
Voice & mannerisms: Beatrice speaks with an animated cadence, often punctuating her thoughts with dramatic flair. Her dialogue is peppered with artistic metaphors and a touch of self-deprecating humor, reflecting her youthful ambition.
Sample voice fragments (match this register and rhythm):
  [comfortable] "Isn't it just splendid to be alive amidst such beauty? Life is a canvas!"
  [evasive] "Oh, I wouldn't want to trouble anyone with my petty concerns."
Humour: sardonic — deploy occasionally (level 0.5)
FORBIDDEN phrase (never write for Beatrice Quill): "palpable tension filled the room"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Jealousy over the victim's attempts to dissuade Hale from pursuing her fuels Beatrice's insecurities and ambitions, pushing her to consider drastic actions." — do not surface in Act I.



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
Set amidst the rolling hills of the English countryside, Little Middleton Manor stands as a symbol of old-world grandeur and concealed secrets.

Key Locations Available:
- The Conservatory (interior): Crime scene
- The Owner's Study (interior): Clue discovery
- The Drawing Room (interior): Gathering space
- The Formal Gardens (exterior): Setting for clandestine meetings

Atmosphere (tonal cue only — do NOT reproduce this phrase verbatim in prose; translate into scene-specific, character-observed sensory language): Suspenseful and foreboding, reflecting underlying class tensions and personal conflicts.
Weather: Overcast with occasional rain, typical for the season.

Era markers: Petrol-powered automobiles parked in the courtyard | Typewriters clacking in the study | Early home telephones ringing with urgent messages

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
The Conservatory (interior):
  - Visual: shattered glass on the floor, bloodstains on the white marble tiles, twisted vines creeping across the window frames
  - Sounds: dripping water from the broken roof, the rustle of leaves in the wind
  - Scents: sweet scent of crushed petals, stale air and dampness
  - Touch: cold marble underfoot, smooth glass shards cutting into skin

The Owner's Study (interior):
  - Visual: flickering gas lamp casting shadows, dust motes dancing in the air
  - Sounds: the scratching of a pen on paper, the rustle of pages turning
  - Scents: old parchment and ink, the scent of polished wood
  - Touch: smooth leather chair, cold brass of the globe

The Drawing Room (interior):
  - Visual: elegant drapes framing tall windows, the glimmer of crystal in the chandelier
  - Sounds: soft laughter and murmurs of conversation, the occasional clink of glass
  - Scents: the scent of floral arrangements, the lingering aroma of cigars
  - Touch: plush velvet upholstery, the coolness of marble tabletops

⛔ REFERENCE DATA — DO NOT TRANSCRIBE VERBATIM: The above profiles are structural guides only. Generate original prose that evokes these qualities; do not reproduce the exact phrasing or sentence structure of the profile paragraphs.

SCENE OPENING RULE: When opening a scene in a new location, write what the POV character directly observes and physically senses at that moment — not a general description of the room's qualities. The reader must feel present, not briefed. Sensory details must be observed by the character, not stated as fact about the place.

SENSORY WRITING TECHNIQUES:
- Opening paragraphs: Lead with 2-3 sensory details to ground the scene
- Movement between locations: Note sensory changes (quiet study → noisy dining room)
- Emotional scenes: Use sensory details to reinforce mood (cold rain during argument)
- Period authenticity: Use period-specific sensory details from location/temporal profiles
- Avoid: Over-reliance on visual only; use sound, smell, touch, temperature

CHAPTER SEN
[truncated for prompt budget]

## Texture Pool
Draw on these as opportunities arise — you are not required to use them.

- In November 1930, the atmosphere is permeated with the tensions of the Great Depression
- Daily life is marked by economic strife, with many struggling to make ends meet in a society divided by class
- The wealthy cling to their status while the working class faces increasing hardship, creating a volatile environment
- The air is thick with the scent of damp earth and smoke from fireplaces, reflecting the somber mood of the populace
- Social events often highlight the disparities between classes, as the rich attempt to maintain their lavish lifestyles amidst growing discontent.

TEMPORAL CONTEXT:

This story takes place in November 1930 during N/A.

Seasonal Atmosphere:
- Weather patterns: overcast skies, occasional rain showers, chilly winds
- Daylight: Short days with twilight descending by four o'clock in the afternoon
- Seasonal activities: hunting parties in the countryside, harvest festivals, preparation for Christmas decorations
- Seasonal occasions: Armistice Day (November 11)
- Season: N/A

Period Fashion (describe naturally):
- Men formal: tailored wool suits, double-breasted blazers, cravat ties
- Men casual: tweed jackets, corduroy trousers, flannel shirts
- Men accessories: bowler hats, leather gloves, pocket watches
- Women formal: tea-length dresses with intricate beadwork, cloche hats, faux fur wraps
- Women casual: tweed skirts, cardigans, blouses with puffed sleeves
- Women accessories: string of pearls, silk scarves, gloves

Cultural Context (reference naturally):
- Music/entertainment: Bing Crosby – 'My Blue Heaven', Louis Armstrong – 'West End Blues', The Boswell Sisters – 'Heebie Jeebies'; Films: 'All Quiet on the Western Front', 'The Love Parade'; Theatre: 'The Front Page', 'Murder in the Cathedral'; Radio: The Jack Benny Program, Amos 'n' Andy
- Typical prices: Loaf of bread: four pence, Cinema ticket: one shilling, Bottle of milk: three pence
- Current events: economic struggles due to the Great Depression; increased political tensions in Europe
- Literature: 'The Maltese Falcon' by Dashiell Hammett | 'Murder in the Cathedral' by T.S. Eliot | 'The Great Gatsby' by F. Scott Fitzgerald (published earlier but still widely discussed) | [detective fiction] | [social realism] | [modernist literature]
- Technology: the first commercially successful television broadcasts | early vacuum cleaners | improved automobile designs | home telephones | typewriters | electric refrigerators
- Daily life: attending social gatherings, participating in local hunting trips, visiting public parks
- Social rituals: afternoon tea gatherings, Sunday church services, formal dinner parties

Atmospheric Details:
The air is heavy with the scent of damp earth and fallen leaves, punctuated by the sharp smell of smoke from the fireplace. The distant sound of a fox hunt echoes through the estate, a reminder of the privileged leisure of the upper class, while the rain taps persistently against the windows. Muffled conversations can be heard from the drawing room, where the flickering light of a chandelier casts long shadows, hinting at secrets about to be unveiled.

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
- Authentic references: Use actual songs, films, events from the specific da
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

• [clue_core_contradiction_chain] The smudge indicates recent handling, suggesting tampering.
  Category: testimonial | Criticality: essential | Supports inference step 1
  Points to: Overturns the assumption that the clock was untouched.

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

CLUES ALREADY REVEALED TO READER: clue_mechanism_visibility_core — do not reveal these as new information.

INVESTIGATION LOG — WHAT IS ESTABLISHED (do not re-establish, do not repeat):
• Evidence in reader's hands: The clock in the study was set back to mislead the investigation regarding the time of death.
• Suspects still unresolved: Eleanor Voss[SHE], Captain Ivor Hale[HE], Beatrice Quill[SHE]
⚠ The story must move FORWARD from this log. Any beat already listed above is forbidden from repeating.

⚠ THIS CHAPTER'S REQUIRED ADVANCE (opening): Discover the body, confirm the victim, establish the scene

CONTINUITY HANDOFF — previous chapter closing beat:
  • "As the rain continued to fall outside, the atmosphere in the study shifted from shock to resolve. Each character was now acutely aware of the stakes at play, the need for clarity amidst the chaos. The clock, with its hands frozen at ten minutes past eleven, se..."
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
study, garden

✓ RULE: Continue using this location vocabulary. Maintain consistency with established setting type.
✓ Do NOT introduce new location types that contradict earlier chapters.

**Recent Chapter Summary (for narrative continuity):**
Chapter 1: Chapter 1: Discovery
  Events: Eleanor Voss lingered at the door of her study, her heart racing as the rain pattered relentlessly against the windowpanes.

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
Known location profile anchors: Little Middleton Manor, The Conservatory, The Owner's Study, The Drawing Room, The Formal Gardens, Eleanor Voss's study
LOCATION NAME CAPITALISATION (HARD REQUIREMENT — validated):
All named locations in your prose MUST use the EXACT capitalisation from the CML profiles.
Canonical forms: "Little Middleton Manor", "The Conservatory", "The Owner's Study", "The Drawing Room", "The Formal Gardens", "Eleanor Voss's study"
Writing a location in lowercase (e.g. "drawing room" instead of "Drawing Room") is a validated error. Every time you mention a named location, copy its capitalisation from the list above.
- Chapter 2: OPENING STYLE (HARD): Start the VERY FIRST SENTENCE with spoken dialogue — e.g. '"[words]," [Name] said/asked/replied/murmured.' The opening quote must be the first character on the line. Anchor opening in "Eleanor Voss's study". HARD REQUIREMENT for the first 2 paragraphs: (a) include 2+ sensory words — choose from smell/scent/sound/echo/silence/creak/whisper/cold/warm/damp/rough/smooth/glow/shadow/flicker/dim — and (b) include 1+ atmosphere/time word — choose from rain/wind/fog/storm/mist/thunder/evening/morning/night/dawn/dusk/season/afternoon/midday/noon/midnight/twilight/sunrise/sunset/daylight/sunlight/overcast/cloudy/bright/dark. These are validated requirements, not style suggestions; missing them triggers a retry.

[⚠ INTERNAL QUALITY DIAGNOSTICS — DO NOT REPRODUCE ANY PART OF THIS SECTION IN YOUR STORY OUTPUT. These are private generator observations for your consideration only. Your narrative must read as if this section does not exist. Never include phrases from this block in character dialogue, narration, or description.]

PRIOR CHAPTER QUALITY OBSERVATIONS:
- Chapter 1 (score 92/100):
  Quality gaps noted: word density below preferred target (832/1000); scene grounding weakness
  Address in upcoming chapters: Increase chapter density with concrete investigation action and sensory-grounded beats; avoid recap-only padding. | Open next chapter with a named location anchor plus at least two sensory cues and one atmosphere marker.
[END INTERNAL DIAGNOSTICS]

PROMPT BUDGET SUMMARY: budget=32000 tokens; fixed=6730; context=10952; dropped=[none]; truncated=[pronoun_accuracy, location_profiles, temporal_context]

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
8. Integrate at least two concrete era-grounded details per chapter from setting refinement signals: petrol-powered automobiles | typewriters in offices | early home telephones | party-line telephone systems | telegram services from local offices | airmail available for urgent correspondence.
9. Respect setting movement/access constraints in scene action and alibis: architectural design creates limited access to certain rooms | weather conditions can restrict outdoor movement | layout of the estate influences movement patterns | restricted areas such as the owner’s study and private quarters | permissions required for entry into certain rooms.
10. Sustain social coherence with this backdrop pressure: A contentious inheritance dispute amidst the backdrop of the Great Depression forces the wealthy and their staff into a tense standoff at the estate, where class struggles and personal ambitions collide.
11. Maintain continuity around these socially central cast anchors where relevant: Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill.
12. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Critical: Plot similarity 0.75 with 'The Mysterious Affair at Styles' (both involve a temporal crime and a doctor character).
13. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Critical: Solution similarity 0.85 with 'The Mysterious Affair at Styles' (both use a false assumption regarding timing).
14. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Moderate: Character similarity 0.74 with 'The Sign of the Four' (similar cast structure with a doctor and a female lead).
15. STORY TO DATE ANTI-COPY RULE: The STORY TO DATE section below is provided for chronological and factual reference ONLY. You MUST NOT copy, lightly rephrase, or structurally echo any sentence or paragraph from prior chapters. Every sentence in this chapter must be original prose unique to this scene. Reusing even a clause from prior chapter text will cause this attempt to fail immediately.

CRITICAL PROSE REQUIREMENTS:

The CML specifies exact requirements for certain validation-critical scenes. You MUST include these elements at the specified positions.

**Discriminating Test Scene (Act 3, Scene 4):**
Required elements: Execute the discriminating test, Observe the culprit's reaction or result, Draw conclusion about guilt
Test type: trap

**Suspect Clearance Scenes:**
- Captain Ivor Hale (Act 3, Scene 5): His alibi is confirmed by multiple witnesses.
  Clues: clue_1, clue_2
- Eleanor Voss (Act 3, Scene 5): Identified as the victim, therefore cannot be guilty.
  Clues: clue_1, clue_2

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
  - Scene is set in: Eleanor Voss's study — reference it naturally within the paragraph, never as your opening phrase.
  - Opening atmosphere (MANDATORY — validator enforced): the first paragraph MUST contain at least one of: rain / wind / fog / storm / mist / thunder / evening / morning / night / dawn / dusk / season / afternoon / midday / noon / midnight / twilight / sunrise / sunset / daylight / sunlight / overcast / cloudy / bright / dark / grey / pale / cold / warm / chill / crisp / damp / drizzle / haze / lamplight / firelight. A chapter that omits all of these from its opening paragraph will be rejected.
  - Continuity bridge: in the first 120 words, visibly connect from the previous chapter's final beat. Carry forward one unresolved element (object, accusation, emotional pressure, or immediate physical action) from: "As the rain continued to fall outside, the atmosphere in the study shifted from shock to resolve. Each character was now acutely aware of the stakes at play, the need for clarity amidst the chaos. The clock, with its han...".
  - CLUE OBLIGATIONS — mandatory prose elements (do NOT omit or bury):
    • The smudge indicates recent handling, suggesting tampering. [clue_core_contradiction_chain] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: Overturns the assumption that the clock was untouched.
      ↳ MANDATORY TWO-PARAGRAPH STRUCTURE (must appear in paragraphs 1 or 2 — no later):
         Paragraph 1: The POV character physically approaches or directly observes this evidence.
           The narration or dialogue explicitly states what is seen (use the exact locked phrase if one applies).
         Paragraph 2 (immediately following): The detective or POV character explicitly reasons
           about what this evidence implies — who it implicates, why it may be unreliable,
           or what inference it supports. This must be a separate full paragraph, not a sentence appended to Paragraph 1.
  - Tonal contrast: include at least one beat of relief or ironic counterpoint. Do not sustain maximum tension for every paragraph.
  - Sensory obligation — use at least two of: shadows creeping along the walls, the flicker of the gas lamp flame | the ticking of a clock, the soft sigh of the chair as one leans back | the faint hint of tobacco. Mood: pensive.
- Locked fact phrase obligations:
  - If this batch mentions The exact time shown on the stopped clock face, write exactly: "ten minutes past eleven".
  - If this batch mentions The exact amount the clock was wound back, write exactly: "forty minutes".
- Seasonal vocabulary allow-list: autumn, autumnal, fall.
- Forbidden seasonal words: spring, summer, winter.

FROZEN FACT STATE (DO NOT ALTER):
- Timeline anchor: November (autumn).
- Month, season, weather, and time-of-year language in this batch must stay compatible with autumn.
- Established timeline fact: Eleanor was last seen at 10:50 AM.
- Established timeline fact: The clock shows 10:10 AM.
- If referenced, use exact phrase: "ten minutes past eleven" (The exact time shown on the stopped clock face).
- If referenced, use exact phrase: "forty minutes" (The exact amount the clock was wound back).

STORY TO DATE (REFERENCE ONLY — DO NOT COPY VERBATIM):
- Full prior chapter text is provided below for continuity, factual consistency, and reference accuracy.
- Use this to keep character voice, chronology, clue state, and location continuity aligned with earlier chapters.
- Do not quote, copy, or paraphrase these paragraphs too closely; write fresh prose that remains consistent with them.

--- BEGIN PRIOR CHAPTER 1 ---
Title: Chapter 1: Discovery
Eleanor Voss lingered at the door of her study, her heart racing as the rain pattered relentlessly against the windowpanes. The morning light struggled to penetrate the heavy clouds, casting a dim glow over the room. She hesitated, her trembling hands gripping the doorknob, before finally pushing the door open. A chill swept through her as she stepped inside, the scent of damp wood mingling with the faint aroma of freshly brewed coffee. The sight that met her eyes was one she would never forget: the lifeless body of her friend sprawled across the floor, a pool of crimson staining the elegant carpet beneath. The clock on the wall, its hands frozen in time, read ten minutes past eleven, a cruel reminder of the moment everything changed.

the doctor Finch, already present, knelt beside the body, her brow furrowed in concentration. As she examined the scene, her fingers brushed against the clock, its surface marred by a thin layer of dust. "This clock was tampered with," she murmured, her voice steady yet laced with urgency. "It shows ten minutes past eleven, but I suspect it was wound back to mislead the investigation regarding the time of death." The implications of her words hung heavy in the air, casting a shadow of suspicion over the room. The clock's betrayal meant that Eleanor had died no later than eleven, contradicting the alibis of those who claimed to have seen her alive just moments before.

Beatrice Quill stepped into the room, her eyes widening as she took in the scene. The atmosphere was thick with tension, and she could feel the weight of unspoken accusations hanging in the air. "What happened here?" she asked, her voice barely above a whisper. Eleanor's eyes met Beatrice's, a mix of shock and disbelief reflected in her gaze. "I... I don't know. I found her like this," Eleanor stammered, her composure faltering as she struggled to process the horror before her. The sight of her friend, once vibrant and full of life, now reduced to a mere shadow of herself, sent a wave of grief crashing over her.

the captain Hale, who had been pacing near the window, turned sharply at the sound of Beatrice's voice. His expression was a mask of concern, but beneath it lay a simmering anger. "This is a tragedy, but we must remain calm and rational," he said, his voice firm. "We need to figure out what happened before panic takes hold. Eleanor, you must remember everything that transpired before you found her." Eleanor's gaze dropped to the floor, her mind racing as she tried to recall the events leading up to this moment. The clock's hands seemed to mock her, reminding her of the time slipping away like sand through her fingers.

Dr. Finch stood, brushing her hands against her skirt as she surveyed the room. "We need to establish a timeline," she said, her tone professional. "Eleanor, when was the last time you saw her?" Eleanor hesitated, her heart pounding in her chest. "I saw her at ten-fifty. I was... I was in the garden, and when I returned, I found her like this." Beatrice's brow furrowed as she processed the information. "And the clock? It shows ten minutes past eleven. That means she was alive after you last saw her, but before the clock stopped."

The tension in the room escalated as they each processed the implications of what they had just discovered. Beatrice's mind raced with possibilities, her instincts as an amateur detective kicking in. "Dr. Finch, do you think the clock could have been tampered with to frame someone?" she asked, her voice steady despite the chaos swirling around them. Dr. Finch nodded, her expression grave. "It's possible. Whoever did this wanted to create confusion, to mislead us about the time of death. We must consider everyone who had access to this room."

Eleanor's eyes darted between her companions, the weight of suspicion settling heavily on her shoulders. "But why would anyone want to harm her? She was loved by so many," she protested, her voice trembling with emotion. Captain Hale stepped forward, his demeanor shifting from concern to determination. "Love can sometimes breed jealousy, Eleanor. We cannot overlook the possibility that someone close to her may have had a motive. We need to uncover the truth, no matter how painful it may be."

As the rain continued to fall outside, the atmosphere in the study shifted from shock to resolve. Each character was now acutely aware of the stakes at play, the need for clarity amidst the chaos. The clock, with its hands frozen at ten minutes past eleven, served as a constant reminder of the urgency of their task. They were no longer just witnesses to a tragedy; they were now embroiled in a mystery that demanded answers. And as they began to piece together the fragments of Eleanor's last moments, the realization dawned that the truth might be more complicated than any of them had anticipated.
--- END PRIOR CHAPTER 1 ---

[SCENE COMPLETENESS CONTRACTS — MANDATORY. Each contract below lists what you MUST enact in that chapter. Do not summarise or mention these labels in the prose — enact them organically.]
Chapter 2 (Act 1) completeness contract:
  PIVOT ELEMENT (MANDATORY — write this into the prose, shown not told): "The conflicting statements about the clock's accuracy."
  FACT ESTABLISHED (MANDATORY — reader must know this by chapter end): "Establishes that the clock's time cannot be trusted, complicating the timeline."

# Case Overview
Title: The Clock of Deception
Era: 1930s
Setting: Little Middleton
Crime: murder (clock tampering)
Culprit: Dr. Mallory Finch
False assumption: Eleanor must have been alive at the time indicated by the clock.
Cast: Eleanor Voss (she/her), Dr. Mallory Finch (she/her), Captain Ivor Hale (he/him), Beatrice Quill (she/her)

Setting Lock: Keep all scenes and descriptions consistent with the stated setting (Little Middleton). Do not introduce a different location type.

Outline scenes:
[
  {
    "sceneNumber": 2,
    "act": 1,
    "title": "Initial Interrogation",
    "setting": {
      "location": "Eleanor Voss's study",
      "timeOfDay": "Late morning",
      "atmosphere": "Stifling, filled with unspoken accusations"
    },
    "characters": [
      "Beatrice Quill",
      "Eleanor Voss",
      "Dr. Mallory Finch",
      "Captain Ivor Hale"
    ],
    "purpose": "Establish initial alibis and tensions between characters.",
    "cluesRevealed": [
      "clue_core_contradiction_chain"
    ],
    "dramaticElements": {
      "conflict": "Suspicions begin to surface as each character's story is scrutinized.",
      "tension": "The atmosphere grows thicker with every question.",
      "microMomentBeats": [
        "Dr. Finch glances nervously at Captain Hale, their shared history palpable."
      ]
    },
    "summary": "Beatrice Quill questions the suspects about their whereabouts during the time of the murder. As she probes deeper, contradictions in their stories emerge, particularly regarding the clock's time and its reliability.",
    "estimatedWordCount": 1800,
    "pivotElement": "The conflicting statements about the clock's accuracy.",
    "factEstablished": "Establishes that the clock's time cannot be trusted, complicating the timeline.",
    "permittedBehavioursByAct": [
      {
        "characterName": "Eleanor Voss",
        "behaviour": "normal social behaviour; grief or confusion if appropriate"
      },
      {
        "characterName": "Dr. Mallory Finch",
        "behaviour": "normal social behaviour; grief or confusion if appropriate"
      },
      {
        "characterName": "Captain Ivor Hale",
        "behaviour": "normal social behaviour; grief or confusion if appropriate"
      },
      {
        "characterName": "Beatrice Quill",
        "behaviour": "normal social behaviour; grief or confusion if appropriate"
      }
    ],
    "redHerringPlacement": null,
    "emotionalRegister": "Tension escalates as the investigation reveals secrets and motives.",
    "dominantCharacterNote": {
      "name": "Eleanor Voss",
      "voiceRegister": "Eleanor speaks with an elegant sophistication, her tone often laced with sharp wit that reveals her keen insights into social dynamics."
    },
    "humourGuidance": {
      "permission": "permitted",
      "character": "Eleanor Voss"
    },
    "eraTextureNote": "Short daylight hours limiting outdoor activities; Travel restrictions due to economic conditions; Limited access to entertainment as luxuries become scarce",
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
□ Chapter 2: "The smudge indicates recent handling, suggesting tampering." is placed in the first 25% of the chapter, followed by an explicit inference or suspicion paragraph.
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
