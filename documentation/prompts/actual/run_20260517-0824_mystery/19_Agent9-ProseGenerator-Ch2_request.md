# Actual Prompt Record

- Run ID: `mystery-1779006244131`
- Project ID: ``
- Timestamp: `2026-05-17T08:28:09.009Z`
- Agent: `Agent9-ProseGenerator-Ch2`
- Operation: `chat_request_full_prompt`
- Model: `GPT-4o-mini`
- Temperature: `0.42`
- Max Tokens: `4500`
- Attempt: `first`
- Prompt Hash: `6b14b323c7a74373`

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
- MORAL COMPLEXITY REQUIREMENT: The mechanism of this crime carries a moral gray area: "The murderer acted out of desperation, feeling trapped by societal expectations and family obligations." — the culprit reveal and denouement MUST acknowledge this ambiguity. Do not let the ending feel clean or simple. Give the reader at least one moment of uncomfortable sympathy or moral doubt.


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

## Era: 1939-04
In April 1939, the world feels charged with tension as Europe teeters on the brink of war. The recent Easter celebrations linger in memory, yet the economic shadows of the Great Depression continue to loom large. In Little Middleton, the air is thick with the scent of damp earth and blooming flowers, but beneath this beauty lies a society grappling with class divisions and the pressures of impending conflict. Households engage in spring cleaning and prepare for May Day festivities, while conversations shift from pleasantries to the growing threat of fascism and civil rights concerns. The desire for upward mobility remains strong, yet the specter of financial ruin haunts many, forcing them to navigate a precarious social landscape.
Emotional register: A pervasive sense of anxiety and uncertainty grips society as individuals navigate the complexities of class and impending conflict.
Physical constraints: Limited communication due to the lack of modern technology | Travel hampered by economic conditions and petrol shortages | Social gatherings tightly regulated by class expectations
Current tensions (weave into background texture): Germany's aggressive expansion into Czechoslovakia | Debates in UK Parliament about defense spending | Rising fascism causing anxiety in British society
Wartime context — Many men are preparing to serve as tensions rise across Europe.: Communities are torn between duty and the desire for stability, with women increasingly stepping into roles traditionally held by men. Absence effect: The specter of absent fathers and brothers casts a long shadow over families, heightening tension and fear.

## Story Theme
The pursuit of wealth and status can lead to moral decay and betrayal, revealing the dark undercurrents beneath a facade of respectability, and reveals that evidence carries ethical weight, forcing characters to choose accountability over social performance when appearances and facts collide.

## Story Emotional Register
Dominant: A gradual descent into intrigue and moral ambiguity, culminating in a confrontation that exposes the characters' true natures.

Arc:
The story begins in the grand but unsettling atmosphere of Little Middleton Manor, where the stormy night mirrors the emotional turmoil of its occupants. Eleanor Voss's murder shatters the evening's facade, casting an immediate pall over the gathering and setting the stage for a tense investigation. As Beatrice Quill delves into the lives of the suspects, initial clues arise, but false leads complicate her pursuit of the truth, each revelation exacting an emotional toll on her and the others involved. The weight of their secrets, coupled with the mounting tension, creates an environment ripe for betrayal and deceit. Midway through, a critical pivot occurs when Beatrice discovers a note that alters the direction of her investigation, pointing to premeditated motives and deepening the emotional stakes for everyone involved. As the investigation unfolds, the pressure escalates, leading to a climactic confrontation where the true nature of friendship, jealousy, and ambition is laid bare. The resolution comes at a high emotional cost, as each character faces the consequences of their actions, leaving them forever changed in the wake of the tragedy.

The story opens: An atmosphere of opulence tinged with unease sets the stage for impending tragedy. As the investigation takes shape: The investigation begins, revealing a web of lies and suspicion that raises the stakes. A first key turn arrives: Initial clues complicate the investigation, leading to emotional strain among the suspects. At the mid-point of the story: A crucial discovery shifts the focus of the investigation, deepening the narrative's complexity.

A second pivot reshapes the course: Pressure mounts as motives are revealed, forcing characters to confront their pasts. As tension reaches its height: Tension crescendos as the truth hangs in the balance, awaiting revelation. The climax brings the central question to a head: A dramatic confrontation exposes the characters' true natures and hidden agendas. In the final resolution: The emotional fallout leaves the characters irrevocably changed, with haunting memories of betrayal.

Underpinning every turn is the story's central concern: The pursuit of wealth and status can lead to moral decay and betrayal, revealing the dark undercurrents beneath a facade of respectability. This thread binds the individual emotional moments into a coherent journey.

The dominant register — A gradual descent into intrigue and moral ambiguity, culminating in a confrontation that exposes the characters' true natures. — colours the prose from first chapter to last, ensuring the reader feels the weight of each revelation as moral consequence rather than mere puzzle mechanics.

## Emotional register at this point in the story
An atmosphere of opulence tinged with unease sets the stage for impending tragedy.

## Character Portraits (appearance & era)

### Eleanor Voss
Eleanor Voss thrives in the opulent world of Little Middleton, using her charm to navigate the elite. Yet, beneath her polished exterior, she grapples with a fierce ambition to secure her place among the wealthy, driven by the haunting memories of her modest upbringing. The societal expectations of the 1930s weigh heavily on her, as she yearns for a life defined by luxury and status rather than the struggles of the past.
Era intersection: Her pursuit of wealth reflects the broader societal pressures of the 1930s, where upward mobility is often shrouded in moral ambiguity.

### Dr. Mallory Finch
Dr. Mallory Finch embodies the struggle between professional integrity and personal desperation, navigating the tensions of a society on the brink of war. While she presents a facade of compassion and dedication, the weight of her unethical choices threatens to unravel her carefully constructed life. The economic strains of the Great Depression push her towards morally questionable practices, reflecting the challenges faced by many in her profession during this period.
Era intersection: Her predicament highlights the ethical dilemmas faced by professionals in a society grappling with economic hardship and rising tensions.

### Captain Ivor Hale
Captain Ivor Hale, a man haunted by the ghosts of his past, finds himself at a crossroads in a society grappling with deep class divisions. Once a respected naval officer, he now faces the harsh consequences of gambling debts and blackmail. The looming threat of war adds to his internal conflict, as he struggles to reclaim his dignity while navigating the expectations of masculinity in a time of crisis.
Era intersection: His story illustrates the personal battles faced by many men of his generation as they confront their failures amid societal expectations.

### Beatrice Quill
Beatrice Quill stands at the intersection of ambition and integrity, as she pursues her journalistic dreams in a world rife with scandal. Her struggles with financial instability reflect the harsh realities of the Great Depression, while her desire to expose the truth speaks to a larger societal yearning for accountability and justice. As she navigates the moral complexities of her profession, she embodies the challenges faced by women striving for success in the 1930s.
Era intersection: Her story captures the evolving role of women in society, as they seek to assert their independence and challenge traditional norms.

## Character Voices

### Eleanor Voss (she/her/her)
Eleanor's voice is melodic and engaging, often laced with subtle sarcasm and a genteel charm that captivates her audience.
[comfortable] Oh darling, you simply must try the champagne; it's exquisite!
[evasive] I wouldn't know anything about that, really. Such matters are best left to the lawyers.
[stressed] Why does everything seem to collapse just as I'm about to succeed?
Humour: Her polite savagery often surfaces in social interactions, adding a layer of humor to her sharp observations.

### Dr. Mallory Finch (she/her/her)
Dr. Mallory speaks with precision, her tone often measured and authoritative, yet occasionally tinged with irony.
[comfortable] Medicine is as much about art as it is about science, wouldn't you agree?
[evasive] I have no idea what you're implying; I adhere to the highest ethical standards.
[stressed] This cannot be happening. I worked too hard for my reputation to be tarnished!
Humour: Her dry wit often serves as a coping mechanism in high-pressure situations.

### Captain Ivor Hale (he/him/his)
Ivor's voice carries a gravelly timbre, filled with nostalgia and a hint of self-deprecation that reflects his struggles.
[comfortable] Ah, the sea was my true home; nothing quite like the thrill of adventure.
[evasive] I wouldn't recall the details; my memory isn't what it used to be.
[stressed] I'm not some criminal! I've made mistakes, but this—this is too much!
Humour: His self-deprecating humor often lightens the mood during tense moments.

### Beatrice Quill (she/her/her)
Beatrice's voice is quick and animated, filled with enthusiasm and a touch of sarcasm that reflects her journalistic spirit.
[comfortable] You wouldn't believe the stories I could tell; this town is full of surprises!
[evasive] I have no idea what you're talking about; I'm just a reporter doing my job.
[stressed] I can't afford to lose this opportunity; it's everything I've worked for!
Humour: Her sardonic humor often emerges when discussing the absurdities of her profession.

## Location Registers (scene framing guides)

Library: The library feels like a sanctuary of secrets, where the weight of knowledge mingles with the tension of unspoken truths. Shadows cling to the walls, casting doubt on the intentions of those who enter. As dust motes dance in the filtered light, an air of foreboding settles, hinting that not all is as it seems within these walls.. Camera angle: A writer entering this space should feel the oppressive weight of history and the danger of hidden truths lurking in the shadows.. Era: In the 1930s, this location represents a space where knowledge is both a refuge and a potential trap.

## Humour guidance for this story position (opening)
Permission: forbidden
Rationale: The opening scene sets a serious tone as the murder is discovered.

FAIR-PLAY AND INFERENCE CONTRACT (from CML logic):
- False assumption in force: The murder occurred after the clock showed ten minutes past eleven.
- Hidden truth to progressively expose: The actual time of death was much earlier, manipulated by the clock's tampering.
- Inference path checkpoints to dramatize clearly (observation -> correction -> effect):
  - Step 1: obs: The clock in the library was found showing ten minutes past eleven. | corr: This indicates that the clock was tampered with to mislead the timeline. | effect: Narrows suspicion to those who had access to the library.
  - Step 2: obs: Witnesses heard the clock strike the hour at a different time. | corr: This suggests the clock was altered to misrepresent the time of death. | effect: Eliminates the possibility of Eleanor being alive when the clock showed the time.
  - Step 3: obs: A note hinting at a scheduled meeting was found near the clock. | corr: The note indicates a planned confrontation that aligns with the tampering. | effect: Narrows suspicion specifically to Dr. Mallory Finch due to her motive.
- Discriminating test method: trap
- Discriminating test design constraint: A controlled comparison is staged where the clock's mechanism is examined against the time reported by witnesses, revealing its tampering.
- Test must rely on already-shown clue IDs: clue_1, clue_2, clue_3, clue_12, clue_6, clue_7
- Fair-play rationale: Step 1: The clock's time (early) and witness statements (mid) show conflicting evidence. Step 2: The note found (mid) ties Dr. Mallory to the timeline manipulation. Step 3: The controlled clock comparison (discriminating test) confirms the tampering.
- Never solve by withheld information. Keep reader-information parity with detective reasoning.

## Character Reference

### Eleanor Voss (she/her — NEVER he/him)
Eleanor often speaks in a lilting tone, peppering her conversations with genteel phrases and subtle sarcasm
She has a tendency to draw out her vowels, particularly when expressing delight or disdain, making her sound almost musical at times.
Eleanor grapples with the realization that her relentless pursuit of wealth may cost her genuine relationships. She fears that in her quest for status, she may lose sight of who she truly is.

### Dr. Mallory Finch (she/her — NEVER he/him)
Mallory's speech is measured and precise, often punctuated by medical terminology
She has a tendency to employ irony in her humor, particularly when discussing the absurdities of life, though she rarely allows it to overshadow her professional demeanor.
Mallory is torn between her dedication to her patients and the guilt that gnaws at her conscience for compromising her ethics. She fears that her ambition may lead to her downfall.

### Captain Ivor Hale (he/him — NEVER she/her)
Ivor’s speech is marked by a gravelly timbre, often punctuated with dry humor
He tends to speak in anecdotes, often trailing off mid-story, reflecting both his pride and the weight of his failures.
Ivor is haunted by his past decisions, caught between the pride of his service and the shame of his current reality. He fears that his failures will define him forever.

### Beatrice Quill (she/her — NEVER he/him)
Beatrice often speaks in a rapid-fire manner, her words tumbling out in excitement or frustration
She has a penchant for sarcasm, particularly when discussing the absurdities of her profession, and often punctuates her sentences with a quick laugh.
Beatrice struggles with her desire for success and the ethical dilemmas that arise from her questionable practices. She fears that her ambition may lead her down a path of no return.


## CHARACTER CONTRACTS (binding for this scene)
Each entry below constrains how this character must be written in this chapter.
These override generic style guidance when they conflict.

### Eleanor Voss[SHE]
Voice & mannerisms: Eleanor often speaks in a lilting tone, peppering her conversations with genteel phrases and subtle sarcasm. She has a tendency to draw out her vowels, particularly when expressing delight or disdain, making her sound almost musical at times.
Sample voice fragments (match this register and rhythm):
  [comfortable] "Oh darling, you simply must try the champagne; it's exquisite!"
  [evasive] "I wouldn't know anything about that, really. Such matters are best left to the lawyers."
Humour: polite savagery — deploy occasionally (level 0.6)
FORBIDDEN phrase (never write for Eleanor Voss): "she felt a wave of unease"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "She believes the recently deceased victim held the key to a marriage proposal from a wealthy heir, a connection that could finally secure her place among the affluent." — do not surface in Act I.

### Dr. Mallory Finch[SHE]
Voice & mannerisms: Mallory's speech is measured and precise, often punctuated by medical terminology. She has a tendency to employ irony in her humor, particularly when discussing the absurdities of life, though she rarely allows it to overshadow her professional demeanor.
Sample voice fragments (match this register and rhythm):
  [comfortable] "Medicine is as much about art as it is about science, wouldn't you agree?"
  [evasive] "I have no idea what you're implying; I adhere to the highest ethical standards."
Humour: dry wit — deploy occasionally (level 0.4)
FORBIDDEN phrase (never write for Dr. Mallory Finch): "a surge of determination washed over her"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "The victim had threatened to expose her malpractice to the medical board, leaving her with a compelling motive to silence him." — do not surface in Act I.

### Captain Ivor Hale[HE]
Voice & mannerisms: Ivor’s speech is marked by a gravelly timbre, often punctuated with dry humor. He tends to speak in anecdotes, often trailing off mid-story, reflecting both his pride and the weight of his failures.
Sample voice fragments (match this register and rhythm):
  [comfortable] "Ah, the sea was my true home; nothing quite like the thrill of adventure."
  [evasive] "I wouldn't recall the details; my memory isn't what it used to be."
Humour: self deprecating — deploy occasionally (level 0.5)
FORBIDDEN phrase (never write for Captain Ivor Hale): "she knew with certainty she was right"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "The victim was his secret creditor, threatening to expose his past if he did not pay up, a situation that left him with a strong motive." — do not surface in Act I.

### Beatrice Quill[SHE]
Voice & mannerisms: Beatrice often speaks in a rapid-fire manner, her words tumbling out in excitement or frustration. She has a penchant for sarcasm, particularly when discussing the absurdities of her profession, and often punctuates her sentences with a quick laugh.
Sample voice fragments (match this register and rhythm):
  [comfortable] "You wouldn't believe the stories I could tell; this town is full of surprises!"
  [evasive] "I have no idea what you're talking about; I'm just a reporter doing my job."
Humour: sardonic — deploy occasionally (level 0.5)
FORBIDDEN phrase (never write for Beatrice Quill): "palpable tension filled the room"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Her ambition led her to intend to expose the victim's secrets, believing it would bolster her career and reputation." — do not surface in Act I.



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
A sprawling estate shrouded in mystery, where opulence meets an air of unease.

Key Locations Available:
- Drawing Room (interior): Gathering space
- Library (interior): Clue discovery
- Cellar (interior): Crime scene
- Gardens (exterior): Hiding spots and clue discovery

Atmosphere: Tense, with an undercurrent of suspicion and unease among the inhabitants.
Weather: Overcast with occasional rain, typical for early spring.

Era markers: Petrol touring cars parked near the entrance | Typewriters clicking in the study | Telegram delivery via the estate's post office

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
Drawing Room (interior):
  - Visual: Flickering candlelight on polished surfaces, Richly upholstered furniture in deep hues, Framed portraits watching silently from the walls
  - Sounds: Crackling fire in the hearth, Muted conversations and laughter, The distant ticking of an ornate clock
  - Scents: Beeswax and tallow from the candles, Wood smoke from the fireplace, A hint of lavender from the potpourri
  - Touch: Soft velvet cushions, Cool marble of the fireplace surround

Library (interior):
  - Visual: Dust motes dancing in the sunlight, Leather-bound books with gilded spines, A large globe in the corner
  - Sounds: Pages turning in silence, The creak of the desk chair, Distant raindrops against the window
  - Scents: Old leather and parchment, The mustiness of forgotten knowledge, A hint of polished wood
  - Touch: Worn leather armchair, Smooth surface of the oak desk

Cellar (interior):
  - Visual: Shadows lurking in the corners, Flickering light casting eerie shapes, Bottles covered in cobwebs
  - Sounds: Dripping water echoing in the silence, The creak of old wood underfoot, A distant rumble of thunder
  - Scents: Musty dampness of stone, A hint of aged wine, Cold metal and earth
  - Touch: Cold stone walls, Rough wooden beams overhead

⛔ REFERENCE DATA — DO NOT TRANSCRIBE VERBATIM: The above profiles are structural guides only. Generate original prose that evokes these qualities; do not reproduce the exact phrasing or sentence structure of the profile paragraphs.

SCENE OPENING RULE: When opening a scene in a new location, write what the POV character directly observes and physically senses at that moment — not a general description of the room's qualities. The reader must feel present, not briefed. Sensory details must be observed by the character, not stated as fact about the place.

SENSORY WRITING TECHNIQUES:
- Opening paragraphs: Lead with 2-3 sensory details to ground the scene
- Movement between locations: Note sensory changes (quiet study → noisy dining room)
- Emotional scenes: Use sensory details to reinforce mood (cold rain during argument)
- Period authenticity: Use period-specific sensory details from location/temporal profiles
- Avoid: Over-reliance on visual only; use sound, smell, touch, temperature

CHAPTER SENSORY PALETTE HINTS (evok
[truncated for prompt budget]

## Texture Pool
Draw on these as opportunities arise — you are not required to use them.

- In April 1939, the world feels charged with tension as Europe teeters on the brink of war
- The recent Easter celebrations linger in memory, yet the economic shadows of the Great Depression continue to loom large
- In Little Middleton, the air is thick with the scent of damp earth and blooming flowers, but beneath this beauty lies a society grappling with class divisions and the pressures of impending conflict
- Households engage in spring cleaning and prepare for May Day festivities, while conversations shift from pleasantries to the growing threat of fascism and civil rights concerns
- The desire for upward mobility remains strong, yet the specter of financial ruin haunts many, forcing them to navigate a precarious social landscape.

TEMPORAL CONTEXT:

This story takes place in April 1939 during spring.

Seasonal Atmosphere:
- Weather patterns: overcast skies, occasional rain showers, cool breezes
- Daylight: Days gradually lengthening, with sunlight breaking through clouds occasionally, creating a play of light and shadow.
- Seasonal activities: spring cleaning in households, preparation for May Day festivities, planting vegetable gardens
- Seasonal occasions: Easter Sunday (April 9)
- Season: spring

Period Fashion (describe naturally):
- Men formal: double-breasted navy suit, white dress shirt, silk tie with geometric patterns
- Men casual: tweed jacket, fitted trousers, knitted pullover
- Men accessories: fedora hat, pocket watch, leather gloves
- Women formal: tea-length dress with floral prints, tailored blazer, periwinkle-colored silk blouse
- Women casual: lightweight cardigan, high-waisted skirt, flared trousers
- Women accessories: cloche hat, string of pearls, canvas handbag

Cultural Context (reference naturally):
- Music/entertainment: Glenn Miller's swing music, Billie Holiday's jazz ballads, Duke Ellington's big band tunes; Films: The Wizard of Oz, Gone with the Wind; Theatre: The Glass Menagerie, The Front Page; Radio: The Shadow, Gunsmoke
- Typical prices: Loaf of bread: four pence, Cinema ticket: one shilling, Men's suit: three pounds
- Current events: Germany’s aggressive expansion into Czechoslovakia; increased tensions in Europe as war looms closer
- Literature: The Grapes of Wrath by John Steinbeck | The Maltese Falcon by Dashiell Hammett | The Old Man and the Sea by Ernest Hemingway | [detective fiction] | [social realism] | [historical novels]
- Technology: the ballpoint pen | the first commercial jet engine designs | the widespread use of household electrical appliances | typewriters in offices | radios in homes | petrol-powered vehicles
- Daily life: afternoon tea with friends, going for walks in the park, visiting local markets
- Social rituals: Sunday family dinners, attending church services, participating in community events

Atmospheric Details:
The air is filled with the damp scent of earth and the distant promise of blooming flowers, punctuated by the faint smell of wood smoke from nearby chimneys. Occasional raindrops patter against windows, creating a rhythmic backdrop that amplifies the tension within the estate, as shadows play tricks on the eye. The flickering candlelight casts dancing shadows in the corners of the room, where whispered conversations hint at secrets better left unspoken.

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
- Authentic references: Use actual songs, films, events from
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

• [clue_2] Witnesses heard the clock strike the hour at a different time.
  Category: temporal | Criticality: essential | Supports inference step 1
  Points to: This raises questions about the accuracy of the clock.

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

CLUES ALREADY REVEALED TO READER: clue_1, clue_2 — do not reveal these as new information.

INVESTIGATION LOG — WHAT IS ESTABLISHED (do not re-establish, do not repeat):
• Evidence in reader's hands: The clock in the library was found showing ten minutes past eleven. | Witnesses heard the clock strike the hour at a different time.
• Suspects still unresolved: Eleanor Voss[SHE], Captain Ivor Hale[HE], Beatrice Quill[SHE]
⚠ The story must move FORWARD from this log. Any beat already listed above is forbidden from repeating.

⚠ THIS CHAPTER'S REQUIRED ADVANCE (opening): Discover the body, confirm the victim, note the stopped clock

CONTINUITY HANDOFF — previous chapter closing beat:
  • "Dr. Finch stepped forward, her voice steady despite the tremor in her hands. 'If the clock was tampered with, it raises questions about the reliability of our timelines. We need to find out who had access to it.' Beatrice nodded, her mind racing with the possi..."
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
library

✓ RULE: Continue using this location vocabulary. Maintain consistency with established setting type.
✓ Do NOT introduce new location types that contradict earlier chapters.

**Recent Chapter Summary (for narrative continuity):**
Chapter 1: Chapter 1: The Clock Strikes
  Events: The morning light struggled to penetrate the overcast skies, casting a dim glow through the library's tall windows.

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
Known location profile anchors: Little Middleton Manor, Drawing Room, Library, Cellar, Gardens, the library
LOCATION NAME CAPITALISATION (HARD REQUIREMENT — validated):
All named locations in your prose MUST use the EXACT capitalisation from the CML profiles.
Canonical forms: "Little Middleton Manor", "Drawing Room", "Library", "Cellar", "Gardens", "the library"
Writing a location in lowercase (e.g. "drawing room" instead of "Drawing Room") is a validated error. Every time you mention a named location, copy its capitalisation from the list above.
- Chapter 2: OPENING STYLE (HARD): Start the VERY FIRST SENTENCE with spoken dialogue — e.g. '"[words]," [Name] said/asked/replied/murmured.' The opening quote must be the first character on the line. Anchor opening in "the library". HARD REQUIREMENT for the first 2 paragraphs: (a) include 2+ sensory words — choose from smell/scent/sound/echo/silence/creak/whisper/cold/warm/damp/rough/smooth/glow/shadow/flicker/dim — and (b) include 1+ atmosphere/time word — choose from rain/wind/fog/storm/mist/thunder/evening/morning/night/dawn/dusk/season/afternoon/midday/noon/midnight/twilight/sunrise/sunset/daylight/sunlight/overcast/cloudy/bright/dark. These are validated requirements, not style suggestions; missing them triggers a retry.

[⚠ INTERNAL QUALITY DIAGNOSTICS — DO NOT REPRODUCE ANY PART OF THIS SECTION IN YOUR STORY OUTPUT. These are private generator observations for your consideration only. Your narrative must read as if this section does not exist. Never include phrases from this block in character dialogue, narration, or description.]

PRIOR CHAPTER QUALITY OBSERVATIONS:
- Chapter 1 (score 95/100):
  Quality gaps noted: word density below preferred target (926/1000); scene grounding weakness
  Address in upcoming chapters: Increase chapter density with concrete investigation action and sensory-grounded beats; avoid recap-only padding. | Open next chapter with a named location anchor plus at least two sensory cues and one atmosphere marker.
[END INTERNAL DIAGNOSTICS]

PROMPT BUDGET SUMMARY: budget=32000 tokens; fixed=6765; context=10963; dropped=[none]; truncated=[pronoun_accuracy, location_profiles, temporal_context]

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
8. Integrate at least two concrete era-grounded details per chapter from setting refinement signals: petrol touring cars on county roads | domestic wiring with frequent outages | typewriters standard in offices | party-line telephone exchanges common | telegrams sent via local post offices | airmail services for urgent correspondence.
9. Respect setting movement/access constraints in scene action and alibis: manor layout includes restricted areas such as the library and cellar | gardens provide natural barriers and hiding spots | weather can impact outdoor evidence collection | gates controlled by estate staff | restricted access to certain areas for non-family members.
10. Sustain social coherence with this backdrop pressure: A family gathering for a contentious estate division amidst the economic strains of the Great Depression forces heirs and staff to confront their hidden animosities under the watchful eye of a ticking clock.
11. Maintain continuity around these socially central cast anchors where relevant: Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill.
12. STORY TO DATE ANTI-COPY RULE: The STORY TO DATE section below is provided for chronological and factual reference ONLY. You MUST NOT copy, lightly rephrase, or structurally echo any sentence or paragraph from prior chapters. Every sentence in this chapter must be original prose unique to this scene. Reusing even a clause from prior chapter text will cause this attempt to fail immediately.

CRITICAL PROSE REQUIREMENTS:

The CML specifies exact requirements for certain validation-critical scenes. You MUST include these elements at the specified positions.

**Discriminating Test Scene (Act 3, Scene 4):**
Required elements: Execute the discriminating test, Observe the culprit's reaction or result, Draw conclusion about guilt

**Suspect Clearance Scenes:**
- Eleanor Voss (Act 3, Scene 5): Eleanor is confirmed as the victim.
  Clues: clue_id_1, clue_id_2
- Captain Ivor Hale (Act 3, Scene 5): Hale's alibi is verified during the time of the murder.
  Clues: clue_id_3, clue_id_4

**Culprit Revelation Scene (Act 3, Scene 6):**
Method: Confrontation with evidence

**Clue Placement for These Chapters:**
- clue_2 must appear in Act 1, Scene 2 via Witness testimony

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
  - STRUCTURAL ARCHETYPE — Chapter 2 must be: FIRST_CONTACT
      ✓ MUST contain: at least two suspect interviews
      ✗ MUST NOT contain: physical evidence discovery
  - Word count: Target 1250 words. Achieve this through plot events, dialogue exchanges, and physical investigation — not through atmospheric repetition or extended internal reflection. Each 200-word segment should contain at minimum one concrete story event (a discovery, a conversation exchange, a physical action or movement). Padding with atmosphere alone is not acceptable.
  - Opening: Begin with a character action, spoken line, or clock/time marker — never a location name or location-description phrase.
  - Scene is set in: the library — reference it naturally within the paragraph, never as your opening phrase.
  - Opening atmosphere (MANDATORY — validator enforced): the first paragraph MUST contain at least one of: rain / wind / fog / storm / mist / thunder / evening / morning / night / dawn / dusk / season / afternoon / midday / noon / midnight / twilight / sunrise / sunset / daylight / sunlight / overcast / cloudy / bright / dark. A chapter that omits all of these from its opening paragraph will be rejected.
  - Continuity bridge: in the first 120 words, visibly connect from the previous chapter's final beat. Carry forward one unresolved element (object, accusation, emotional pressure, or immediate physical action) from: "Dr. Finch stepped forward, her voice steady despite the tremor in her hands. 'If the clock was tampered with, it raises questions about the reliability of our timelines. We need to find out who had access to it.' Beatric...".
  - CLUE OBLIGATIONS — mandatory prose elements (do NOT omit or bury):
    • Witnesses heard the clock strike the hour at a different time. [clue_2] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: This raises questions about the accuracy of the clock.
      ↳ MANDATORY TWO-PARAGRAPH STRUCTURE (must appear in paragraphs 1 or 2 — no later):
         Paragraph 1: The POV character physically approaches or directly observes this evidence.
           The narration or dialogue explicitly states what is seen (use the exact locked phrase if one applies).
         Paragraph 2 (immediately following): The detective or POV character explicitly reasons
           about what this evidence implies — who it implicates, why it may be unreliable,
           or what inference it supports. This must be a separate full paragraph, not a sentence appended to Paragraph 1.
  - Tonal contrast: include at least one beat of relief or ironic counterpoint. Do not sustain maximum tension for every paragraph.
  - Sensory obligation — use at least two of: Dull light casting long shadows, Dust settling on the books | The faint rustle of pages, The ticking of a clock in the corner | Dust and mildew. Mood: foreboding.
- Locked fact phrase obligations:
  - If this batch mentions The exact time shown on the stopped clock face, write exactly: "ten minutes past eleven".
  - If this batch mentions The exact amount the clock was wound back, write exactly: "forty minutes".
- Seasonal vocabulary allow-list: spring, vernal, springtime.
- Forbidden seasonal words: summer, autumn, winter.

FROZEN TIMELINE STATE (DO NOT ALTER):
- Timeline anchor: April (spring).
- Month, season, weather, and time-of-year language in this batch must stay compatible with spring.
- Established timeline fact: The clock showing ten minutes past eleven
- Established timeline fact: Witness accounts of Eleanor's last seen time
- If referenced, use exact time phrase: "ten minutes past eleven" (The exact time shown on the stopped clock face).
- If referenced, use exact time phrase: "forty minutes" (The exact amount the clock was wound back).

STORY TO DATE (REFERENCE ONLY — DO NOT COPY VERBATIM):
- Full prior chapter text is provided below for continuity, factual consistency, and reference accuracy.
- Use this to keep character voice, chronology, clue state, and location continuity aligned with earlier chapters.
- Do not quote, copy, or paraphrase these paragraphs too closely; write fresh prose that remains consistent with them.

--- BEGIN PRIOR CHAPTER 1 ---
Title: Chapter 1: The Clock Strikes
The morning light struggled to penetrate the overcast skies, casting a dim glow through the library's tall windows. Beatrice Quill stepped into the room, her heart racing as she took in the scene before her. The air was heavy with the scent of damp wood and freshly fallen rain, a stark contrast to the opulence that surrounded her. The flickering candlelight danced nervously against the polished surfaces, revealing the chaos that had unfolded. In the center of the room lay Eleanor Voss, her lifeless form sprawled across the ornate carpet, a pool of crimson seeping into the fibers beneath her. Beatrice's breath caught in her throat; the sight was both shocking and surreal. A clock on the wall caught her attention, its hands frozen in time, displaying the ominous hour of ten minutes past eleven.

Beatrice approached the clock, her gaze fixed on its still face. The hands, unmoving, seemed to mock the gravity of the situation. 'Ten minutes past eleven,' she murmured, the words barely escaping her lips. This was no ordinary death; this was a murder, and the clock was a witness. It established a timeline for the events that had transpired, one that would surely contradict the alibis of those present. As she turned to examine the room further, Beatrice recalled the whispers of the household staff, who had claimed to hear the clock strike the hour at a different time altogether. The implications of this discrepancy gnawed at her. If the clock had been tampered with, it could lead to a web of deceit that ensnared everyone in the room.

The tension in the library was palpable as Eleanor's closest acquaintances gathered around, their faces pale with shock and disbelief. Dr. Finch stood to one side, her hands trembling slightly as she clutched her medical bag. 'I can't believe this is happening,' she whispered, her voice barely audible over the steady patter of rain against the window. Captain Hale, his brow furrowed in concern, paced the room like a caged animal. 'We must find out who did this,' he asserted, his voice steady but laced with an undercurrent of fear. Beatrice observed them closely, noting the way they avoided each other's gazes, the unspoken accusations hanging heavy in the air.

Eleanor had always been the center of their social circle, a woman whose charm and ambition drew others in like moths to a flame. But now, as they stood around her lifeless body, the façade of camaraderie began to crack. Beatrice could sense the underlying tensions that had long simmered beneath the surface. Just the night before, she had overheard Eleanor arguing with Captain Hale about a matter of great importance. The memory of their heated exchange lingered in her mind, a potential motive hidden in plain sight. 'What were you two fighting about?' Beatrice asked, her voice cutting through the silence. Ivor's eyes darted to Mallory, who shifted uncomfortably, her expression unreadable.

The clock's relentless ticking echoed in Beatrice's ears as she considered the implications of their conversation. If Eleanor had been arguing with Hale, it could suggest a deeper conflict. But what could have driven them to such a confrontation? Beatrice's instincts as a journalist kicked in, her mind racing with possibilities. She needed to gather the facts, to piece together the puzzle that lay before her. 'We need to speak to everyone who was here last night,' she declared, her tone firm. 'Every detail matters.' The others nodded in agreement, their expressions a mixture of fear and determination. They were all trapped in this web of suspicion, and the only way out was to uncover the truth.

As the rain continued to spring outside, Beatrice felt a sense of urgency wash over her. Time was of the essence, and with each passing moment, the trail to the truth grew colder. She glanced back at Eleanor, her heart heavy with the weight of the tragedy that had unfolded. The woman who had once been the life of the party now lay motionless, her dreams extinguished. Beatrice steeled herself; she would not let Eleanor's death be in vain. With a deep breath, she turned to the others, ready to begin the investigation. 'Let’s start with the clock,' she said, her voice steady. 'We need to understand what happened here.'

The group moved closer to the clock, its face a silent witness to the events that had transpired. Beatrice examined it closely, noting the dust that had settled around its base, untouched by anyone's hand. 'It seems to have been wound back,' she remarked, her brow furrowing in concentration. 'If it was set to show ten minutes past eleven, it must have been tampered with. But why?' The others exchanged glances, their expressions a mix of confusion and concern. The implications were staggering. If someone had altered the clock, it suggested a premeditated act, a deliberate attempt to mislead.

Dr. Finch stepped forward, her voice steady despite the tremor in her hands. 'If the clock was tampered with, it raises questions about the reliability of our timelines. We need to find out who had access to it.' Beatrice nodded, her mind racing with the possibilities. The clock had become a focal point in the investigation, a key piece of evidence that could unravel the mystery surrounding Eleanor's death. As they stood in the dim light of the library, the weight of the situation pressed heavily upon them. Each of them had secrets, and as they began to unravel the threads of the past, Beatrice knew that the truth would not come easily.
--- END PRIOR CHAPTER 1 ---

[SCENE COMPLETENESS CONTRACTS — MANDATORY. Each contract below lists what you MUST enact in that chapter. Do not summarise or mention these labels in the prose — enact them organically.]
Chapter 2 (Act 1) completeness contract:
  PIVOT ELEMENT (MANDATORY — write this into the prose, shown not told): "Eleanor's shaky testimony about her last interaction with the victim"
  FACT ESTABLISHED (MANDATORY — reader must know this by chapter end): "Establishes discrepancies in the timeline of events leading up to the murder."
  RED HERRING (MANDATORY — seed naturally, not flagged as false): [rh_2] A broken vase is found near the scene, suggesting a struggle.

# Case Overview
Title: The Clockwork Conundrum
Era: 1930s
Setting: Little Middleton
Crime: murder (clock-tampering)
Culprit: Dr. Mallory Finch
False assumption: The murder occurred after the clock showed ten minutes past eleven.
Cast: Eleanor Voss (she/her), Dr. Mallory Finch (she/her), Captain Ivor Hale (he/him), Beatrice Quill (she/her)

Setting Lock: Keep all scenes and descriptions consistent with the stated setting (Little Middleton). Do not introduce a different location type.

Outline scenes:
[
  {
    "sceneNumber": 2,
    "act": 1,
    "title": "Witness Testimonies",
    "setting": {
      "location": "the library",
      "timeOfDay": "Shortly after the discovery",
      "atmosphere": "Nervous and anxious, with whispers of speculation"
    },
    "characters": [
      "Beatrice Quill",
      "Eleanor Voss",
      "Dr. Mallory Finch",
      "Captain Ivor Hale"
    ],
    "purpose": "Gather initial witness statements to establish timelines and alibis",
    "cluesRevealed": [
      "clue_2"
    ],
    "dramaticElements": {
      "conflict": "Tension rises as each character's story unfolds",
      "tension": "Contradictory accounts create doubt about the timeline",
      "microMomentBeats": [
        "Eleanor's hands tremble as she recounts her last moments with the victim."
      ]
    },
    "summary": "Beatrice Quill interviews the suspects, each recounting their whereabouts during the time of the murder. Eleanor's testimony raises questions, while Captain Hale seems defensive.",
    "estimatedWordCount": 1800,
    "pivotElement": "Eleanor's shaky testimony about her last interaction with the victim",
    "factEstablished": "Establishes discrepancies in the timeline of events leading up to the murder.",
    "permittedBehavioursByAct": [
      {
        "characterName": "Eleanor Voss",
        "behaviour": "cooperative grief; no guilt-tells in Act I"
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
    "redHerringPlacement": {
      "redHerringId": "rh_2",
      "placementDetail": "A broken vase is found near the scene, suggesting a struggle."
    },
    "emotionalRegister": "The investigation begins, revealing a web of lies and suspicion that raises the stakes.",
    "dominantCharacterNote": {
      "name": "Eleanor Voss",
      "voiceRegister": "Eleanor's voice is melodic and engaging, often laced with subtle sarcasm and a genteel charm that captivates her audience."
    },
    "humourGuidance": {
      "permission": "permitted",
      "character": "Beatrice Quill",
      "form": "dry_wit"
    },
    "eraTextureNote": "Limited communication due to the lack of modern technology; Travel hampered by economic conditions and petrol shortages; Social gatherings tightly regulated by class expectations",
    "locationRegisterNote": ""
  }
]
```

## Message 3 (role=user)

```text
BEFORE SUBMITTING YOUR JSON — verify this checklist:
□ Each chapter reaches the hard floor of 500 words and aims for 1250 words or more.
□ If you mention locked evidence, you used the exact locked phrase verbatim.
□ Allowed seasonal words only: spring, vernal, springtime.
□ Forbidden seasonal words: summer, autumn, winter.
□ Chapter 2: "Witnesses heard the clock strike the hour at a different time." is placed in the first 25% of the chapter, followed by an explicit inference or suspicion paragraph.
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

## Message 4 (role=assistant)

```text
{
  "status": "draft",
  "tone": "classic",
  "chapters": [
    {
      "title": "Chapter 2: Witness Testimonies",
      "summary": "Beatrice Quill interviews the suspects, each recounting their whereabouts during the time of the murder. Eleanor's testimony raises questions, while Captain Hale seems defensive.",
      "paragraphs": [
        "‘We need to find out who had access to it,’ Dr. Finch insisted, her voice taut with urgency. The rain drummed steadily against the library windows, each drop a reminder of the chaos that had unfolded within these walls. Beatrice Quill stood at the center of the room, her heart racing as she prepared to question the others. The air was thick with tension, the atmosphere charged with unspoken accusations. She could feel the weight of their gazes, each one a silent plea for answers, for clarity amidst the confusion. The clock's hands, frozen at ten minutes past eleven, loomed ominously in the background, a reminder of the time that had slipped away from them all.",
        "Beatrice approached Eleanor Voss first, noting the way Eleanor's hands trembled slightly as she clasped them together. ‘Eleanor, can you tell me about your last moments with the victim?’ she asked gently, her voice steady despite the storm brewing outside. Eleanor's eyes flickered with uncertainty, and she took a deep breath, as if summoning the courage to recount the events. ‘I... I spoke with her just before dinner,’ Eleanor began, her voice melodic yet strained. ‘She seemed upset, but I thought it was just the stress of the evening.’",
        "The clock's stillness seemed to mock Eleanor's words, and Beatrice leaned in closer, her curiosity piqued. ‘What was she upset about?’ she pressed, keen to uncover any detail that might shed light on the situation. Eleanor hesitated, her gaze darting to Captain Hale, who stood nearby, his expression unreadable. ‘It was nothing, really. Just a disagreement about the estate,’ she replied, her tone evasive. But Beatrice could see the flicker of fear in Eleanor's eyes, a hint that there was more beneath the surface.",
        "‘Witnesses heard the clock strike the hour at a different time,’ Beatrice recalled, her mind racing with the implications. The discrepancy gnawed at her, raising questions about the reliability of the timeline they were constructing. If Eleanor had indeed spoken with the victim shortly before dinner, then the clock's position could mean something far more sinister. ‘If the clock was tampered with, it raises questions about the reliability of our timelines,’ she said, her voice firm. ‘We need to determine when exactly Eleanor last saw her.’",
        "Eleanor's expression shifted, a shadow of doubt crossing her features. ‘I didn’t mean to imply anything,’ she stammered, her voice barely above a whisper. ‘I just... I wanted to help her.’ Beatrice noted the tremor in Eleanor's hands, the way they shook as she spoke. It was a clear sign of her distress, but Beatrice couldn't shake the feeling that there was more to Eleanor's story. Captain Hale shifted uncomfortably, his brow furrowing as he listened to the exchange. ‘We all want to help,’ he interjected, his tone defensive. ‘But we need to focus on the facts.’",
        "Beatrice turned her attention to Captain Hale, sensing the tension in the air. ‘What about you, Captain? Where were you during the time of the murder?’ she asked, her voice steady as she sought to extract the truth. Hale's jaw tightened as he crossed his arms, a defensive posture that did not escape Beatrice's notice. ‘I was in my quarters,’ he replied, his voice low. ‘I had some paperwork to finish up, but I can’t say exactly when I left.’",
        "‘And you didn’t hear anything unusual?’ Beatrice pressed, her instincts as a journalist urging her to dig deeper. Hale shook his head, his expression hardening. ‘No, nothing at all. I was focused on my work.’ Beatrice could sense the underlying tension, the way both Eleanor and Hale seemed to be guarding their words. The atmosphere in the library felt charged, as if the very walls held their secrets tightly. She needed to uncover the truth, to navigate the web of lies that threatened to ensnare them all.",
        "As the rain continued to fall outside, Beatrice glanced back at the clock, its hands still frozen at ten minutes past eleven. The implications of the time weighed heavily on her mind, and she knew that each moment spent in this room brought them closer to the truth. ‘We need to gather everyone’s accounts,’ she declared, her voice resolute. ‘Every detail matters, and we must piece together the events leading up to Eleanor's death.’"
      ]
    }
  ],
  "cast": ["Eleanor Voss", "Dr. Mallory Finch", "Captain Ivor Hale", "Beatrice Quill"],
  "note": "",
  "audit": {
    "locked_fact_phrases": "present in paragraph 4 | absent",
    "season_words_used": "spring | none",
    "discriminating_test_present": "no",
    "required_clues_present": "clue_2: chapter 2 paragraph 4 | present",
    "early_observation_present": "description: chapter 2 paragraph 1 | present",
    "early_inference_present": "yes: paragraph immediately following observation | yes"
  }
}


```

## Message 5 (role=user)

```text
Attempt 2/6 — chapters 2 — 2 validation issue(s) to resolve:

═══ ⚠️ PRONOUN ERRORS — MUST FIX (1) ═══
These specific characters had the WRONG pronouns. Fix each one before you submit:

  ⚠️ Captain Ivor Hale is MALE — use "he/him/his" ONLY.
     You wrote: her — these are WRONG for this character.
     Every time "Captain Ivor Hale" appears: he/him/his. No exceptions.

HOW TO FIX: Search your draft for every occurrence of each name above.
Replace any pronoun that does not match the gender shown.
Minimal sentence rewording is acceptable where it improves clarity (e.g. naming
the character explicitly instead of relying on a pronoun). Do NOT alter plot
points, clue details, alibis, or dialogue meaning.

📋 FULL CAST PRONOUN TABLE (attempt 2 — use this as a reference for every pronoun in your draft):
  NAME                    GENDER    PRONOUNS
                                    subject / object / possessive
  Eleanor Voss             FEMALE   she / her / her
  Dr. Mallory Finch        FEMALE   she / her / her
  Captain Ivor Hale        MALE     he / him / his
  Beatrice Quill           FEMALE   she / her / her

⛔ Any pronoun not matching the table above is WRONG. Fix before submitting.

═══ OTHER ERRORS (1) ═══
• Chapter 2: Chapter 2 opening block has weak sensory grounding (1 sensory markers found) (Include at least two sensory cues (sound/smell/tactile/visual) in the opening block)

═══ RETRY MICRO-PROMPTS (1) ═══
• REPAIR [sensory_grounding — attempt 2]: The opening block (first 2 paragraphs) has only 1 sensory marker(s). Need at least 2.
  In paragraph 1 or 2, add 1 more word(s) from the EXACT list the validator counts:
  • Smell/scent: smell, scent, odor, fragrance
  • Sound: sound, echo, silence, whisper, creak
  • Tactile: cold, warm, damp, rough, smooth
  • Visual/light: glow, shadow, flicker, dim
  Use these words naturally in a sentence — e.g. "The cold of the hallway pressed against her cheeks" or "A creak from the floorboards above broke the silence."
  Do NOT use synonyms like 'chill' or 'murmur' — they are not counted.

Return corrected JSON for chapters 2. Edit only the sections that failed — keep all content that passed validation, and return the complete updated chapter JSON.


RETRY CLASS: continuity
ATTEMPT: 1/6
MANDATORY FIXES:
- Resolve continuity issues before accepting this batch.
- Chapter 2: Chapter 2 opening block has weak sensory grounding (1 sensory markers found) (Include at least two sensory cues (sound/smell/tactile/visual) in the opening block)
- Character "Captain Ivor Hale" has incorrect pronouns. Should use he/him/his but found: her
```
