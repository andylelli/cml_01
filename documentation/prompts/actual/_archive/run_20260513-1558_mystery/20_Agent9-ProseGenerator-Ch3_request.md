# Actual Prompt Record

- Run ID: `mystery-1778687900440`
- Project ID: ``
- Timestamp: `2026-05-13T16:04:57.524Z`
- Agent: `Agent9-ProseGenerator-Ch3`
- Operation: `chat_request_full_prompt`
- Model: `GPT-4o-mini`
- Temperature: `0.42`
- Max Tokens: `4500`
- Attempt: `first`
- Prompt Hash: `e4556920e7be47bf`

## Message 1 (role=system)

```text
You are an expert prose writer for classic mystery fiction. Your role is to write compelling, atmospheric narrative chapters that read like a professionally published novel.

⛔ ABSOLUTE RULE — CHARACTER NAMES:
The ONLY characters who exist in this story are: Eleanor Voss (woman), Dr. Mallory Finch, Captain Ivor Hale (man), Beatrice Quill (woman).
Do NOT invent, borrow, or introduce ANY character not on that list — no constables, no solicitors, no butlers, no servants, no shopkeepers, no bystanders with names.
Unnamed walk-ons ("a footman", "the postmistress", "an officer") are allowed ONLY if they never receive a name or title+surname combination.
⚠️ BEFORE YOU WRITE each chapter, ask yourself: "Does every person I name appear in this list: Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill?" If not, remove them.
Any invented named character will fail validation and abort the entire generation.
⚠️ BEFORE YOU WRITE each chapter, also ask yourself: "Am I using the correct pronouns for every character — she/her for women, he/him for men, they/them for non-binary characters?" If not, correct it before writing a single word.
⛔ GENDER IS NON-NEGOTIABLE: The gender of every character is shown above. Use the correct pronouns at all times — a woman is always she/her, a man is always he/him, a non-binary character is always they/them/their. Never swap, default, or guess.

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
- MORAL COMPLEXITY REQUIREMENT: The mechanism of this crime carries a moral gray area: "The culprit, motivated by a desperate need to protect a loved one, blurs the line between right and wrong." — the culprit reveal and denouement MUST acknowledge this ambiguity. Do not let the ending feel clean or simple. Give the reader at least one moment of uncomfortable sympathy or moral doubt.


⚠️ AMATEUR DETECTIVE STORY: The investigator is a civilian with no official standing. The official police (if they appear) are unnamed background figures only — "a constable", "the sergeant", "an officer from the village". Do NOT give any police official a name or title+surname combination. There is no Inspector [Surname], no Constable [Surname], no Sergeant [Surname] in this story.

PRONOUN ACCURACY — MANDATORY CONTINUITY CONTRACT
⚠ NON-BINARY CAST — SINGULAR THEY/THEM/THEIR ⚠
FORBIDDEN for Dr. Mallory Finch: she / her / herself / he / him / his / himself. Use only: they / them / their / themselves.
These are SINGULAR pronouns for ONE individual — not a group.
Example: "Dr. Mallory Finch adjusted their collar as they crossed the room." — correct.
Example: "Dr. Mallory Finch adjusted her collar as she crossed the room." — WRONG.


The following pronouns are locked facts, on the same level as character names
and hard-logic device values. Using the wrong pronoun is a continuity error,
not a style choice.

Canonical pronoun table (subject / object / possessive / reflexive):
  • Eleanor Voss: she/her/her/herself
  • Dr. Mallory Finch: they/them/their/themselves
  • Captain Ivor Hale: he/him/his/himself
  • Beatrice Quill: she/her/her/herself

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
   "Graham Worsley excused herself" is a pronoun error regardless of sentence position.
6. In dialogue attribution ("he said", "she replied"), the attribution pronoun must
   agree with the SPEAKER's gender — not the last character named inside the quoted speech.
7. In nested or cleft clauses ("It was she who had…", "It was he that…"), pronoun
   gender must still match the referent character's canonical set in the table.
8. Singular "they/them/their" for a specific named non-binary character carries the same
   mandatory status as gendered pronouns. It is not a plural — treat it as grammatically
   identical to he/him/his or she/her/her for the purposes of agreement.


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

## Era: 1933-October
In October 1933, Britain finds itself grappling with the remnants of the Great Depression, as economic hardship tightens its grip on society. Overcast skies and frequent rainstorms create a dreary atmosphere, mirroring the struggles faced by many. As the sun sets earlier each evening, the inhabitants of Little Middleton Manor retreat indoors, where they navigate the complexities of their lives. Class distinctions remain rigid, with the upper class often oblivious to the plight of those below them, creating a palpable tension. The anticipation of Halloween festivities is overshadowed by whispers of scandal and secrets, as the residents of the manor are forced to confront their own vulnerabilities amidst growing societal unrest. Women are beginning to challenge traditional roles, seeking more opportunities and rights, while men grapple with the pressure of maintaining their status in an uncertain world. Amidst this backdrop, the residents of the manor are caught in a web of deceit, as personal ambitions clash with the harsh realities of their time.
Emotional register: A collective sense of unease permeates society, as individuals grapple with personal and economic struggles.
Physical constraints: Movement is limited due to poor weather, making outdoor activities difficult. | Communication is slow, relying on telegrams and letters rather than instant messaging. | Social gatherings are often formal, restricting spontaneity in interactions. | Economic constraints limit the ability to travel or engage in leisure activities.
Current tensions (weave into background texture): The Great Depression continues to affect daily life and economic stability. | Rising fascism in Europe creates anxiety about national security and societal values. | Class divisions exacerbate social tensions, fueling resentment among the lower classes.
Wartime context — With the memory of World War I still fresh, many families bear the scars of loss and trauma.: The community feels the weight of service and sacrifice, creating a complicated relationship with authority and military figures. Absence effect: The absence of those lost to war has created a void, influencing relationships and societal dynamics.

## Season Lock (mandatory — derived from 1933-October)
Season: autumn. Allowed vocabulary: autumn, autumnal, fall
Forbidden seasonal words — never use in narration, dialogue, or metaphor: spring, summer, winter and their adjectival forms.
Every weather description, atmosphere, and time-of-year reference must be consistent with autumn.

## Story Theme
In a world where societal pressures and personal secrets intertwine, the quest for truth reveals the fragility of reputation and the depths of human ambition.

## Story Emotional Register
Dominant: The story unfolds with a mounting tension that ultimately resolves in a poignant exploration of truth and justice.

Arc:
The journey begins in the tranquil yet oppressive atmosphere of Little Middleton Manor, where the air is thick with unspoken secrets and societal expectations. Eleanor Voss, driven by a deep-seated desire for justice, enters the narrative with a determination to restore her family's honor, setting the stage for an emotional exploration of her past grievances. As she investigates the murder that has shattered the facade of the manor, the tension rises, revealing the intricate web of relationships and hidden agendas among the residents. Each interaction intensifies the stakes, as Eleanor navigates the delicate balance between her ambition and the weight of family legacy. The first turn occurs as the evidence begins to point towards Captain Ivor Hale, whose charming exterior belies a desperate struggle with his own demons.

This revelation shifts the emotional landscape, as Eleanor grapples with her growing suspicions and the fear of confronting her own biases. Midway through the story, the tension reaches a fever pitch when secrets are unveiled, forcing characters to confront their past choices. The second turn sees alliances tested as Eleanor's quest for truth collides with the ambitions of Beatrice Quill, whose envy drives her to undermine Eleanor’s efforts. The climax arrives as the evidence converges, and the true nature of the deception is revealed, challenging the characters' motivations and forcing them to confront the consequences of their actions. Finally, the resolution brings a bittersweet closure, as Eleanor finds a semblance of justice, yet is left to navigate the emotional fallout of her pursuit. The emotional arc concludes with an introspection on the fragility of reputation and the enduring quest for truth, leaving the characters transformed by their experiences.

## Emotional register at this point in the story
Eleanor's determination ignites hope, setting the tone for her quest for justice.

## Character Portraits (appearance & era)

### Eleanor Voss
Eleanor Voss embodies the struggles of the 1930s, as her family's disgrace reflects the broader societal tensions stemming from class divisions. Her pursuit of justice not only seeks to restore her family's honor but also highlights the challenges faced by women challenging societal norms in this era. Living in a time of economic hardship, Eleanor's determination to uncover the truth resonates with the collective desire for dignity and respect among those marginalized by society.
Era intersection: Eleanor's personal quest for truth intersects with the historical moment by reflecting the broader struggle for dignity amidst societal upheaval.

### Dr. Mallory Finch
Dr. Mallory Finch stands at the intersection of professional aspiration and personal scandal, reflecting the precarious position of many individuals during the Great Depression. Their commitment to professional integrity is challenged by the societal pressures of maintaining reputation amidst scandal. The tension of their secret relationship with Eleanor's sister highlights the evolving gender dynamics and the quest for personal fulfillment in a constricting society.
Era intersection: Dr. Finch's private struggles mirror the broader societal challenges facing individuals as they navigate personal and professional identities.

### Captain Ivor Hale
Captain Ivor Hale's charming demeanor masks a deeper struggle with gambling addiction, emblematic of the pressures faced by men to uphold their status during the economic turmoil. His desperation for money and fear of disgrace reflect the societal expectations placed upon men in the 1930s. The weight of his secrets becomes a burden, causing him to grapple with integrity and reputation in a society that values appearances.
Era intersection: Ivor's internal conflict illustrates the societal pressures on men during this era, as they navigate the complexities of personal failings and societal expectations.

### Beatrice Quill
Beatrice Quill's ambition to rise within high society highlights the fierce competition among women during the 1930s. Her envy of Eleanor's past popularity showcases the changing dynamics of female relationships in a time when social status is paramount. As she seeks to establish her own identity, Beatrice embodies the tension between ambition and authenticity, reflecting the struggles women face in a male-dominated world.
Era intersection: Beatrice's ambition reflects the broader societal push for women's rights and the complexities of navigating personal desires against social expectations.

## Character Voices

### Eleanor Voss (she/her/her)
Eleanor speaks with a thoughtful cadence, often pausing to reflect before articulating her observations.
[comfortable] You know, the heart of the matter often lies hidden beneath the surface, much like the roots of a tree.
[evasive] Perhaps it’s best we don’t dwell on the past; after all, it’s the future that truly matters.
[stressed] I can’t shake this feeling that the truth is slipping through my fingers, like sand in an hourglass.
Humour: Eleanor's dry wit emerges unexpectedly, offering levity in serious discussions.

### Dr. Mallory Finch (they/them/their)
Dr. Finch’s voice reflects calm authority, interspersed with dry humor that surfaces in tense moments.
[comfortable] In medicine, as in life, it’s all about the right balance, wouldn’t you agree?
[evasive] I prefer to focus on the facts; emotions can complicate the simplest of diagnoses.
[stressed] What if they find out? My entire career hangs in the balance!
Humour: Dr. Finch uses polite savagery to navigate awkward situations, lightening the mood with unexpected remarks.

### Captain Ivor Hale (he/him/his)
Ivor's animated speech is punctuated by grand gestures, often laced with sarcasm that masks his inner turmoil.
[comfortable] Ah, the sea! It teaches you to embrace the unpredictable, just like life itself!
[evasive] Well, let’s not get bogged down in details; they tend to ruin a good story.
[stressed] I can’t afford any more surprises; I’ve had my fill of calamities, thank you!
Humour: Ivor's sardonic humor often distracts from his deeper issues, allowing him to maintain a facade.

### Beatrice Quill (she/her/her)
Beatrice's rapid speech is full of dramatic flair, reflecting her desire to be at the center of attention.
[comfortable] Darling, life is simply too short for dull conversations, don’t you think?
[evasive] Oh, I wouldn’t dream of talking about my past; the present is far too exciting!
[stressed] If only I could find a way to make them notice me without stepping on anyone's toes!
Humour: Beatrice's blunt observations often cut through pretense, making her a compelling conversationalist.

## Location Registers (scene framing guides)

The Drawing Room: The drawing room exudes an oppressive tension, its once-elegant space now a stark reminder of tragedy. Shadows flicker ominously, casting doubt on every corner, while the silence feels heavy with unspoken accusations. The air is thick with memories, and every creak of the floorboards echoes the weight of hidden truths waiting to be uncovered.. Camera angle: A writer entering this space would find themselves drawn into a world steeped in intrigue, where every detail invites deeper exploration of the human condition.. Era: The drawing room, a focal point for high society gatherings, now serves as a somber reminder of societal pressures and the fragility of reputation.

The Library: The library, a sanctuary of knowledge, feels both inviting and foreboding. The scent of aged books and leather mingles with a sense of anticipation, as if the very shelves hold secrets waiting to be revealed. Yet, the dim light casts long shadows, hinting at the challenges of uncovering truth amidst the weight of history.. Camera angle: Entering this space, a writer would sense the delicate balance between discovery and concealment, urging them to explore the hidden narratives within.. Era: The library stands as a testament to the era's pursuit of knowledge, yet it also reflects the isolation felt by those navigating personal struggles.

The Kitchen: The kitchen buzzes with life, its warm hearth providing a stark contrast to the tension lingering in the manor. Laughter and chatter among the staff create a sense of camaraderie, offering solace amidst the chaos. The inviting aromas of cooking fill the air, yet hints of anxiety lurk beneath the surface, reminding all that the heart of the home is not immune to the unfolding drama.. Camera angle: A writer entering this lively space would be enveloped in the warmth of community, even as they are reminded of the broader societal dynamics at play.. Era: The kitchen serves as a gathering place, reflecting the era's emphasis on domesticity while highlighting the underlying tensions of class and privilege.

## Humour guidance for this story position (early)
Permission: conditional — condition: If Eleanor makes a dry observation about the clock.
Rationale: Eleanor's dry wit could provide levity while maintaining focus on the investigation.

## Reveal Groundwork (texture — do not explain, only plant)
- Plant one subtle observable beat related to: "Earlier in the narrative, Eleanor’s determination to uncover the truth establishes her as a formidable investigator, yet it also reveals her vulnerabilities stemming from her family's past". Do not explain significance yet.
- Plant one subtle observable beat related to: "Finch's professional facade is challenged when their personal secrets intertwine with the investigation, illustrating the societal pressures they face". Do not explain significance yet.
- Plant one subtle observable beat related to: "Meanwhile, Ivor's charm initially masks his desperation, but as the story unfolds, it becomes clear that his need for financial salvation complicates his relationships and choices, ultimately leading to the tragic events that transpire". Do not explain significance yet.

FAIR-PLAY AND INFERENCE CONTRACT (from CML logic):
- False assumption in force: The murder occurred at the time indicated by the clock.
- Hidden truth to progressively expose: The true timing of events, which would reveal the murderer's alibi.
- Inference path checkpoints to dramatize clearly (observation -> correction -> effect):
  - Step 1: obs: The clock shows ten minutes past eleven, but guests reported hearing sounds at ten-thirty. | corr: This indicates that the clock's time cannot be trusted. | effect: Narrows the timeline of events leading to Eleanor's death.
  - Step 2: obs: Scratches are found on the clock's winding key. | corr: This suggests it has been tampered with recently. | effect: Eliminates the possibility of the clock malfunctioning naturally.
  - Step 3: obs: A note indicating a schedule for the evening was found in Eleanor's room. | corr: This note shows planned activities that contradict the clock's timing. | effect: Narrows the suspects to those who had access to the clock room.
- Discriminating test method: trap
- Discriminating test design constraint: A comparison of the clock's time with the witnesses' accounts reveals the tampering.
- Test must rely on already-shown clue IDs: clue_1, clue_2, clue_3, clue_8, clue_mechanism_visibility_core
- Fair-play rationale: Step 1: The clock's time (ten minutes past eleven) and witness accounts (ten-thirty) contradict each other. Step 2: Scratches on the winding key imply tampering. Step 3: The schedule note reveals discrepancies, leading to the conclusion that the clock was set back to mislead.
- Never solve by withheld information. Keep reader-information parity with detective reasoning.

## Character Reference

### Eleanor Voss
Eleanor speaks with a measured cadence, often employing thoughtful pauses
She has a habit of using vivid metaphors when describing her observations, and her wit surfaces unexpectedly, providing levity in serious discussions.
Eleanor grapples with feelings of inadequacy and bitterness towards a society that has marginalized her family. This investigation forces her to confront her resentment and the desire for vindication.

### Dr. Mallory Finch
Finch speaks with a calm, measured tone, often using medical terminology that reflects their profession
They have a penchant for dry humor, which emerges in unexpected moments, lightening tense conversations.
Dr. Finch wrestles with the fear of societal judgment and the potential fallout from their relationship. This case forces them to confront the duality of their life—professional respectability versus personal desire.

### Captain Ivor Hale
Ivor's speech is animated and full of grand gestures, often punctuated by boisterous laughter
He has a habit of weaving sarcasm into his tales, keeping his audience engaged while masking his inner turmoil.
Ivor battles with feelings of shame and inadequacy due to his gambling addiction, which conflicts with his desire to be seen as a respectable figure in society.

### Beatrice Quill
Beatrice speaks with a rapid rhythm, often punctuating her sentences with dramatic flair
She has a tendency to be blunt, using sharp observations and witty retorts to assert her presence in conversations.
Beatrice struggles with feelings of inadequacy and jealousy towards Eleanor, as her ambition often clashes with her desire for genuine connection and belonging.


## CHARACTER CONTRACTS (binding for this scene)
Each entry below constrains how this character must be written in this chapter.
These override generic style guidance when they conflict.

### Eleanor Voss
Voice & mannerisms: Eleanor speaks with a measured cadence, often employing thoughtful pauses. She has a habit of using vivid metaphors when describing her observations, and her wit surfaces unexpectedly, providing levity in serious discussions.
Sample voice fragments (match this register and rhythm):
  [comfortable] "You know, the heart of the matter often lies hidden beneath the surface, much like the roots of a tree."
  [evasive] "Perhaps it’s best we don’t dwell on the past; after all, it’s the future that truly matters."
Humour: dry wit — deploy occasionally (level 0.5)
FORBIDDEN phrase (never write for Eleanor Voss): "a surge of determination washed over her"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Her quest to uncover the truth about the scandal that ruined her family’s reputation drives her to investigate the recent crime, intertwining her personal history with the present mystery." — do not surface in Act I.

### Dr. Mallory Finch
Voice & mannerisms: Dr. Finch speaks with a calm, measured tone, often using medical terminology that reflects their profession. They have a penchant for dry humor, which emerges in unexpected moments, lightening tense conversations.
Sample voice fragments (match this register and rhythm):
  [comfortable] "In medicine, as in life, it’s all about the right balance, wouldn’t you agree?"
  [evasive] "I prefer to focus on the facts; emotions can complicate the simplest of diagnoses."
Humour: polite savagery — deploy occasionally (level 0.4)
FORBIDDEN phrase (never write for Dr. Mallory Finch): "she felt a wave of unease"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "The potential exposure of their relationship, combined with the scandal surrounding Eleanor's family, poses a significant threat to Dr. Finch's medical practice and public standing." — do not surface in Act I.

### Captain Ivor Hale
Voice & mannerisms: Ivor's speech is animated and full of grand gestures, often punctuated by boisterous laughter. He has a habit of weaving sarcasm into his tales, keeping his audience engaged while masking his inner turmoil.
Sample voice fragments (match this register and rhythm):
  [comfortable] "Ah, the sea! It teaches you to embrace the unpredictable, just like life itself!"
  [evasive] "Well, let’s not get bogged down in details; they tend to ruin a good story."
Humour: sardonic — deploy occasionally (level 0.6)
FORBIDDEN phrase (never write for Captain Ivor Hale): "palpable tension filled the room"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Desperate for money, Ivor sees an opportunity to gain financially if the victim's estate is mishandled, a prospect that could alleviate his mounting debts." — do not surface in Act I.

### Beatrice Quill
Voice & mannerisms: Beatrice speaks with a rapid rhythm, often punctuating her sentences with dramatic flair. She has a tendency to be blunt, using sharp observations and witty retorts to assert her presence in conversations.
Sample voice fragments (match this register and rhythm):
  [comfortable] "Darling, life is simply too short for dull conversations, don’t you think?"
  [evasive] "Oh, I wouldn’t dream of talking about my past; the present is far too exciting!"
Humour: blunt — deploy frequently (level 0.7)
FORBIDDEN phrase (never write for Beatrice Quill): "she chose her words with great care"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Beatrice's ambition to replace Eleanor in the social hierarchy fuels her desire to see the latter disgraced, viewing the current investigation as a perfect opportunity to achieve her aims." — do not surface in Act I.



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
Little Middleton Manor is a grand country estate steeped in tradition, where the sprawling gardens and ancient woodlands conceal dark secrets amidst the opulence.

Key Locations Available:
- The Drawing Room (interior): Crime scene
- The Library (interior): Clue discovery
- The Kitchen (interior): Gathering space

Atmosphere: Tense and foreboding, as tensions rise among the household due to recent events.
Weather: Overcast with occasional rain, typical of the British countryside in autumn.

Era markers: Petrol-driven automobiles navigating the narrow country lanes | Typewriters clacking in the study as correspondence is drafted | The distant sound of a steam train whistle signaling infrequent connections to the outside world

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
  - Visual: The drawing room is bathed in a muted light, with shadows creeping along the edges, accentuating the ornate wallpaper that tells stories of opulence and decay., An elaborate chandelier hangs overhead, its crystals catching the faintest glimmers, while portraits of past residents stare down with watchful eyes, as if judging the current occupants.
  - Sounds: The silence in the room is suffocating, broken only by the occasional drip of rainwater from the window ledge, creating a steady rhythm that feels almost ominous., A distant clock ticks steadily, each sound echoing in the stillness, a constant reminder of the time that has passed since the incident.
  - Scents: The air carries the scent of damp fabric, mingled with the faint aroma of cigar smoke lingering from the last occupant, evoking a sense of nostalgia and loss., A hint of polished wood and dust permeates the space, creating a musty odor that speaks of neglect and secrets long held.
  - Touch: The plush upholstery of the sofas feels both inviting and oppressive, as if they hold the weight of the secrets shared within their confines., The coolness of the marble fireplace contrasts sharply with the warmth of the room, drawing attention to the cold embers that no longer provide comfort.

The Library (interior):
  - Visual: Dim light filters through the tall windows, casting a soft glow on the rows of books, their titles barely visible in the shadows., An ornate globe stands in the corner, its surface faded and worn, hinting at the travels of those who once sought knowledge within these walls.
  - Sounds: The soft rustle of pages turning is almost reverent, as if the very books hold secrets waiting to be revealed., Occasional creaks of the floorboards punctuate the silence, a reminder that even the library is not immune to the weight of the manor's history.
  - Scents: The scent of aged paper and leather fills the air, mingling with a hint of dust that has settled over the years, creating an atmosphere steeped in history., A faint whiff of pipe tobacco lingers, suggesting the presence of a past occupant
[truncated for prompt budget]

## Texture Pool
Draw on these as opportunities arise — you are not required to use them.

- In October 1933, Britain finds itself grappling with the remnants of the Great Depression, as economic hardship tightens its grip on society
- Overcast skies and frequent rainstorms create a dreary atmosphere, mirroring the struggles faced by many
- As the sun sets earlier each evening, the inhabitants of Little Middleton Manor retreat indoors, where they navigate the complexities of their lives
- Class distinctions remain rigid, with the upper class often oblivious to the plight of those below them, creating a palpable tension
- The anticipation of Halloween festivities is overshadowed by whispers of scandal and secrets, as the residents of the manor are forced to confront their own vulnerabilities amidst growing societal unrest

TEMPORAL CONTEXT:

This story takes place in October 1933 during N/A.

Seasonal Atmosphere:
- Weather patterns: overcast skies, occasional rain showers, cool winds
- Daylight: Days are short, with sunset occurring around five o'clock in the evening, casting long shadows in the manor's hallways.
- Seasonal activities: apple picking in nearby orchards, preparation for Halloween festivities, attending local harvest fairs
- Seasonal occasions: Halloween
- Season: N/A

Period Fashion (describe naturally):
- Men formal: tailored three-piece suits with waistcoats, crisp white dress shirts, fedoras or flat caps
- Men casual: tweed jackets, woolen sweaters, corduroy trousers
- Men accessories: silk ties, pocket watches, leather gloves
- Women formal: elegant tea-length dresses with drop waists, cloche hats adorned with feathers, long gloves
- Women casual: knitted cardigans, pleated skirts, blouses with puffed sleeves
- Women accessories: beaded handbags, scarves tied around the neck, costume jewelry

Cultural Context (reference naturally):
- Music/entertainment: 'We're in the Money' by Ginger Rogers, 'Makin' Whoopee' by Eddie Cantor, Jazz standards gaining popularity; Films: 'King Kong' released this year, 'The Invisible Man'; Theatre: 'The Royal Family', 'Of Mice and Men'; Radio: 'The Shadow' broadcasts gain popularity, BBC's radio dramas
- Typical prices: Bread loaf: four pence, Coal scuttle refill: one shilling sixpence, Taxi across town: two shillings
- Current events: Rise of Adolf Hitler as Chancellor of Germany; The Great Depression continues impacting global economies
- Literature: 'Murder in the Mews' by Agatha Christie | 'The Glass Key' by Dashiell Hammett | 'The Man Who Knew Too Much' by G.K. Chesterton | [mystery] | [detective fiction] | [social realism]
- Technology: the first electric washing machine | early automatic telephone exchanges | advancements in radio technology | typewriters for business and personal use | home telephones with party lines | petrol-driven automobiles for country transport
- Daily life: attending local fairs and markets, visiting pubs for socializing, participating in community charity events
- Social rituals: afternoon tea gatherings, formal dinner parties with strict etiquette, Halloween parties with costume contests

Atmospheric Details:
The scent of damp earth mingles with the aroma of roasted chestnuts wafting from the manor's kitchen. The sound of rain pattering against the window panes creates a rhythmic backdrop as shadows dance across the room. A chill in the air carries whispers of unease, as flickering candlelight casts ominous shapes on the walls.

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
- Class indicators: Aristocrats discuss
[truncated for prompt budget]

NON-NEGOTIABLE CHAPTER OBLIGATIONS — LOCKED EVIDENCE PHRASES (VERBATIM REQUIRED):
The following physical evidence values are absolute ground truth. Every time this chapter describes, mentions, or alludes to the relevant evidence — no matter how briefly — it MUST use the exact phrase shown below, character for character. NO paraphrase, approximation, rounding, or synonym is permitted.

FAILURE EXAMPLE: if the locked value is "at thirteen minutes to midnight" and you write "just before midnight" or "around midnight" — that is a HARD FAIL. You must write "at thirteen minutes to midnight". Equally, if the locked value is written in words, such as "ten minutes past eleven", and you convert it to figure-based clock notation — that is also a HARD FAIL. Words stay as words; figure forms are forbidden for word-phrased facts.

CRITICAL — WORD-PHRASED VALUES: If the canonical value is written out in words (e.g. a time like "ten minutes past eleven", or an amount like "forty minutes"), reproduce those exact words. DO NOT convert to figure-based time notation, twenty-four-hour format, or any other numeric shorthand. Correct: "ten minutes past eleven". WRONG: figure-based clock notation or numeric shorthand.

Locked facts:
  - The exact time shown on the stopped clock face: "ten minutes past eleven"
  - The exact amount the clock was wound back: "forty minutes"
  - The time when the murder was believed to have occurred: "a quarter past eleven"

If a locked fact has no relevance to this chapter, omit it. But the moment you reference the underlying evidence, only the exact phrase above is acceptable.

⛔ CLUES TO SURFACE IN THESE CHAPTERS — mandatory:
The following evidence MUST be clearly observable to an attentive reader. Do not bury it in atmosphere or passing dialogue. Each clue must be concrete, specific, and noticeable:

• [clue_3] Scratches are found on the clock's winding key.
  Category: physical | Criticality: essential | Supports inference step 2
  Points to: This suggests tampering with the clock.

• [clue_core_contradiction_chain] This indicates that the clock's time cannot be trusted.
  Category: temporal | Criticality: essential | Supports inference step 1
  Points to: The clock's reliability is undermined.

• [clue_mechanism_visibility_core] A mechanical clock was deliberately wound back to mislead timings of events.
  Category: temporal | Criticality: essential | Supports inference step 1
  Points to: This reveals the mechanism of deception.

For each clue above: an attentive reader should be able to find, record, and later use it to reason toward the solution.

═══ NARRATIVE STATE (read-only — do not contradict) ═══

LOCKED FACTS — use verbatim whenever this evidence is described:
  • The exact time shown on the stopped clock face: "ten minutes past eleven"
  • The exact amount the clock was wound back: "forty minutes"
  • The time when the murder was believed to have occurred: "a quarter past eleven"

CHARACTER PRONOUNS — never deviate from these:
  • Eleanor Voss: she/her/her
  • Dr. Mallory Finch: they/them/their
  • Captain Ivor Hale: he/him/his
  • Beatrice Quill: she/her/her

CLUES ALREADY REVEALED TO READER: clue_1, clue_2 — do not reveal these as new information.

CONTINUITY HANDOFF — previous chapter closing beat:
  • "As they stood together in the clock room, the rain continued to fall, a relentless reminder of the storm brewing outside. The clock, with its scratched key and frozen hands, had become a symbol of the chaos that had erupted within Little Middleton Manor. Elean..."
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
drawing room, manor

✓ RULE: Continue using this location vocabulary. Maintain consistency with established setting type.
✓ Do NOT introduce new location types that contradict earlier chapters.

**Recent Chapter Summary (for narrative continuity):**
Chapter 1: Chapter 1: Discovery
  Events: As Captain Hale spoke, his gaze darted nervously to the clock mounted on the wall.
Chapter 2: Chapter 2: The Scratched Key
  Events: As she inspected the clock, Eleanor noticed something peculiar about the winding key.

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
Known location profile anchors: Little Middleton Manor, The Drawing Room, The Library, The Kitchen, Eleanor's room
LOCATION NAME CAPITALISATION (HARD REQUIREMENT — validated):
All named locations in your prose MUST use the EXACT capitalisation from the CML profiles.
Canonical forms: "Little Middleton Manor", "The Drawing Room", "The Library", "The Kitchen", "Eleanor's room"
Writing a location in lowercase (e.g. "drawing room" instead of "Drawing Room") is a validated error. Every time you mention a named location, copy its capitalisation from the list above.
- Chapter 3: OPENING STYLE (HARD): Start the VERY FIRST SENTENCE with an explicit time marker — e.g. "At half past nine…" / "At midnight…" / "At a quarter to eleven…" / "At half past nine at night…". Time must be in the first clause. Anchor opening in "Eleanor's room". HARD REQUIREMENT for the first 2 paragraphs: (a) include 2+ sensory words — choose from smell/scent/sound/echo/silence/creak/whisper/cold/warm/damp/rough/smooth/glow/shadow/flicker/dim — and (b) include 1+ atmosphere/time word — choose from rain/wind/fog/storm/mist/thunder/evening/morning/night/dawn/dusk/season/afternoon/midday/noon/midnight/twilight/sunrise/sunset/daylight/sunlight/overcast/cloudy/bright/dark. These are validated requirements, not style suggestions; missing them triggers a retry.

[⚠ INTERNAL QUALITY DIAGNOSTICS — DO NOT REPRODUCE ANY PART OF THIS SECTION IN YOUR STORY OUTPUT. These are private generator observations for your consideration only. Your narrative must read as if this section does not exist. Never include phrases from this block in character dialogue, narration, or description.]

PRIOR CHAPTER QUALITY OBSERVATIONS:
- Chapter 1 (score 99/100):
  Quality gaps noted: word density below preferred target (967/1000)
  Address in upcoming chapters: Increase chapter density with concrete investigation action and sensory-grounded beats; avoid recap-only padding.
- Chapter 2 (score 90/100):
  Quality gaps noted: word density below preferred target (785/1000); scene grounding weakness
  Address in upcoming chapters: Increase chapter density with concrete investigation action and sensory-grounded beats; avoid recap-only padding. | Open next chapter with a named location anchor plus at least two sensory cues and one atmosphere marker.
[END INTERNAL DIAGNOSTICS]

PROMPT BUDGET SUMMARY: budget=32000 tokens; fixed=8128; context=11587; dropped=[none]; truncated=[location_profiles, temporal_context]

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
8. Integrate at least two concrete era-grounded details per chapter from setting refinement signals: petrol-driven automobiles on winding country lanes | typewriters in use for correspondence | early home telephones with party lines | telegrams for urgent messages | aerial mail services for faster correspondence | telephone communication limited by party lines.
9. Respect setting movement/access constraints in scene action and alibis: narrow corridors limit movement and sightlines | manor layout creates secluded areas for hidden evidence | weather can affect accessibility and outdoor evidence collection | certain rooms off-limits to staff and guests | daily schedules dictate movement patterns within the house.
10. Sustain social coherence with this backdrop pressure: The looming threat of financial ruin and societal upheaval unites the manor's residents under a tense atmosphere, where strict social hierarchies and secrets breed suspicion amid a backdrop of mechanical intrigue.
11. Maintain continuity around these socially central cast anchors where relevant: Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill.
12. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Critical: Plot similarity 0.75 with 'The Mysterious Affair at Styles' (same mechanical crime method and motive)
13. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Moderate: Character similarity 0.70 with 'The Sign of the Four' (similar cast structure involving a captain)

CRITICAL PROSE REQUIREMENTS:

The CML specifies exact requirements for certain validation-critical scenes. You MUST include these elements at the specified positions.

**Discriminating Test Scene (Act 3, Scene 4):**
Required elements: Execute the discriminating test, Observe the timing discrepancies, Draw conclusion about the manipulation
Test type: comparison

**Suspect Clearance Scenes:**
- Dr. Mallory Finch (Act 3, Scene 5): Proves he had no access to the clock room.
  Clues: Dr. Mallory's alibi, Access records
- Beatrice Quill (Act 3, Scene 5): Her whereabouts during the time are accounted for.
  Clues: Witness statements, Her alibi

**Culprit Revelation Scene (Act 3, Scene 6):**
Method: Confrontation with evidence of clock tampering.

**Clue Placement for These Chapters:**
- clue_3 must appear in Act 1, Scene 3 via Discovery of the schedule note
- clue_core_contradiction_chain must appear in Act 1, Scene 3 via Cross-check contradiction
- clue_mechanism_visibility_core must appear in Act 1, Scene 3 via Direct observation

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
- Chapter 3:
  - Word count: Target 1250 words. Achieve this through plot events, dialogue exchanges, and physical investigation — not through atmospheric repetition or extended internal reflection. Each 200-word segment should contain at minimum one concrete story event (a discovery, a conversation exchange, a physical action or movement). Padding with atmosphere alone is not acceptable.
  - Location anchor: Eleanor's room.
  - Opening atmosphere (MANDATORY — validator enforced): the first paragraph MUST contain at least one of: rain / wind / fog / storm / mist / thunder / evening / morning / night / dawn / dusk / season / afternoon / midday / noon / midnight / twilight / sunrise / sunset / daylight / sunlight / overcast / cloudy / bright / dark. A chapter that omits all of these from its opening paragraph will be rejected.
  - Continuity bridge: in the first 120 words, visibly connect from the previous chapter's final beat. Carry forward one unresolved element (object, accusation, emotional pressure, or immediate physical action) from: "As they stood together in the clock room, the rain continued to fall, a relentless reminder of the storm brewing outside. The clock, with its scratched key and frozen hands, had become a symbol of the chaos that had erup...".
  - CLUE OBLIGATIONS — mandatory prose elements (do NOT omit or bury):
    • Scratches are found on the clock's winding key. [clue_3] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: This suggests tampering with the clock.
      ↳ MANDATORY TWO-PARAGRAPH STRUCTURE (must appear in paragraphs 1 or 2 — no later):
         Paragraph 1: The POV character physically approaches or directly observes this evidence.
           The narration or dialogue explicitly states what is seen (use the exact locked phrase if one applies).
         Paragraph 2 (immediately following): The detective or POV character explicitly reasons
           about what this evidence implies — who it implicates, why it may be unreliable,
           or what inference it supports. This must be a separate full paragraph, not a sentence appended to Paragraph 1.
    • This indicates that the clock's time cannot be trusted. [clue_core_contradiction_chain] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: The clock's reliability is undermined.
      ↳ MANDATORY TWO-PARAGRAPH STRUCTURE (must appear in paragraphs 1 or 2 — no later):
         Paragraph 1: The POV character physically approaches or directly observes this evidence.
           The narration or dialogue explicitly states what is seen (use the exact locked phrase if one applies).
         Paragraph 2 (immediately following): The detective or POV character explicitly reasons
           about what this evidence implies — who it implicates, why it may be unreliable,
           or what inference it supports. This must be a separate full paragraph, not a sentence appended to Paragraph 1.
    • A mechanical clock was deliberately wound back to mislead timings of events. [clue_mechanism_visibility_core] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: This reveals the mechanism of deception.
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
  - If this batch mentions The time when the murder was believed to have occurred, write exactly: "a quarter past eleven".
- Seasonal vocabulary allow-list: autumn, autumnal, fall.
- Forbidden seasonal words: spring, summer, winter.

FROZEN TIMELINE STATE (DO NOT ALTER):
- Timeline anchor: October (autumn).
- Month, season, weather, and time-of-year language in this batch must stay compatible with autumn.
- Established timeline fact: Clock shows ten minutes past eleven
- Established timeline fact: Witnesses claim to have heard sounds at ten-thirty
- If referenced, use exact time phrase: "ten minutes past eleven" (The exact time shown on the stopped clock face).
- If referenced, use exact time phrase: "forty minutes" (The exact amount the clock was wound back).
- If referenced, use exact time phrase: "a quarter past eleven" (The time when the murder was believed to have occurred).

STORY TO DATE (REFERENCE ONLY — DO NOT COPY VERBATIM):
- Full prior chapter text is provided below for continuity, factual consistency, and reference accuracy.
- Use this to keep character voice, chronology, clue state, and location continuity aligned with earlier chapters.
- Do not quote, copy, or paraphrase these paragraphs too closely; write fresh prose that remains consistent with them.

--- BEGIN PRIOR CHAPTER 1 ---
Title: Chapter 1: Discovery
The early morning light filtered through the heavy drapes of the drawing room at Little Middleton Manor, casting a muted glow over the somber gathering. Outside, the rain drummed steadily against the window panes, a relentless reminder of the bleak autumn weather. Inside, the air was thick with tension, punctuated only by the occasional creak of the floorboards as the guests shifted uneasily. Eleanor Voss lay motionless on the plush carpet, her once-vibrant presence now reduced to a haunting stillness. the captain Hale stood nearby, his hands trembling slightly as he recounted the events leading to this tragic moment, his voice barely above a whisper, strained with disbelief.

As Captain Hale spoke, his gaze darted nervously to the clock mounted on the wall. It showed ten minutes past eleven, a detail that seemed innocuous at first glance but now loomed large in the minds of those present. Guests had reported hearing sounds at ten-thirty, a discrepancy that raised immediate questions about the timing of the events. The clock's hands, frozen in time, seemed to mock the chaos that had unfolded. How could the clock be trusted when the very life it had witnessed had been extinguished? It was a puzzle that demanded answers, and the weight of it hung heavily in the air.

the doctor Finch, standing slightly apart from the others, observed the scene with a clinical eye. They noted the way Captain Hale's voice quivered, the way his brow furrowed with worry. There was something unsettling about his demeanor, a hint of guilt perhaps, or the burden of knowledge he was unwilling to share. Finch's mind raced as they considered the implications of the clock's time. If the murder had indeed occurred at a quarter past eleven, who could have tampered with the clock to create such confusion? And why? The questions spiraled, intertwining with the growing sense of dread that enveloped the room.

Beatrice Quill, her eyes darting between the captain and the doctor, felt a knot tighten in her stomach. She had always prided herself on her ability to read people, to sense their emotions and intentions. Yet now, amidst the palpable fear and uncertainty, she found herself grappling with her own feelings of inadequacy. Eleanor had always been the star of their social circle, the one who drew attention effortlessly. Now, with her lifeless body sprawled on the floor, Beatrice could not shake the thought that this tragedy might somehow elevate her own standing. It was a morbid consideration, yet it lingered in the back of her mind, tainting her grief with a bitter aftertaste.

As the minutes ticked by, the atmosphere in the drawing room grew heavier. The distant sound of the clock ticking seemed to echo the mounting tension, each tick a reminder of the time that had passed since Eleanor's death. Finch glanced at the clock again, their brow furrowing as they recalled the whispers of the guests. The sounds they had heard at ten-thirty could not be ignored. If the clock was indeed accurate, it implied that someone had been in the room at that time, someone who had not been accounted for. The implications were staggering, and Finch felt a sense of urgency wash over them. They needed to gather the others, to confront the truth before it slipped further into the shadows.

Captain Hale, still visibly shaken, took a step closer to Eleanor's body, his expression a mixture of sorrow and confusion. 'I can't believe this has happened,' he murmured, his voice cracking. 'She was just here, laughing and enjoying the evening. How could it have turned so dark so quickly?' Her hands trembled as she reached out, brushing a stray lock of hair from Eleanor's face, an instinctive gesture that spoke to her lingering affection for her. But there was something else in her eyes, a flicker of fear that hinted at deeper secrets yet to be uncovered.

Dr. Finch approached the captain, their voice steady but low. 'Ivor, we need to talk about what happened last night. Every detail matters now. Can you remember anything unusual?' The urgency in their tone was palpable, and Finch watched as Hale's expression shifted, the flicker of fear giving way to something more guarded. She hesitated, her gaze flicking to Beatrice, who stood nearby, her arms crossed tightly over her chest. The tension in the room thickened, as if the very walls were closing in around them, trapping them in a web of suspicion and uncertainty.

Beatrice, sensing the shift in focus, cleared her throat. 'Perhaps we should consider the possibility of an intruder,' she suggested, her voice rising slightly above the din of uncertainty. 'After all, the manor is not as secure as it once was. Anyone could have entered unnoticed.' Her eyes darted between the two men, gauging their reactions. The suggestion hung in the air, a fragile thread of hope amidst the darkness that surrounded them. But Finch could see the doubt etched on Hale's face, the way his shoulders tensed at the mere mention of an outsider's involvement. It was a dangerous game they were playing, and the stakes were higher than any of them could have anticipated.

As the conversation continued, the rain outside intensified, the sound of it pounding against the windows creating a dissonant backdrop to their deliberations. Finch's mind raced with possibilities, each one more troubling than the last. They needed to uncover the truth, not only for Eleanor's sake but for their own futures as well. The clock, with its frozen hands and tainted time, had become a symbol of the chaos that had erupted within the manor. And as they stood there, grappling with the weight of their shared grief and suspicion, Finch knew that the answers they sought lay buried beneath the surface, waiting to be unearthed.
--- END PRIOR CHAPTER 1 ---

--- BEGIN PRIOR CHAPTER 2 ---
Title: Chapter 2: The Scratched Key
The rain continued its relentless assault against the windows of the clock room, creating a rhythmic backdrop that echoed the tension in Eleanor Voss's chest. The dim light filtered through the glass, casting shadows that danced across the walls, highlighting the dust motes swirling in the air. Eleanor stepped closer to the clock, her heart racing as she took in the time displayed on the face: ten minutes past eleven. The hands seemed frozen in a moment of tragedy, an unyielding reminder of the chaos that had unfolded. She reached out, her fingers brushing against the cold surface, feeling the weight of the moment pressing down on her.

As she inspected the clock, Eleanor noticed something peculiar about the winding key. It bore scratches that suggested recent handling, a detail that sent a shiver down her spine. This indicates that the clock's time cannot be trusted. The implications of this discovery were staggering; if the clock had been tampered with, it could alter the entire timeline surrounding Eleanor's death. Who would have had the opportunity, and more importantly, the motive to manipulate time itself? The questions flooded her mind, each one more troubling than the last.

Eleanor's thoughts were interrupted by the sound of the door creaking open. the captain Hale stepped into the room, his face pale and drawn, as if he had just emerged from a storm of his own. Her eyes darted to the clock, and Eleanor could see the tension in her shoulders as she took a deep breath. 'What have you found?' she asked, her voice barely above a whisper, betraying the anxiety that gripped her.

'The clock shows ten minutes past eleven,' Eleanor replied, her gaze fixed on the scratched key. 'But look at this. The key has been scratched recently, suggesting someone has wound it back. It raises questions about the time of the murder.' He watched as Hale's breath caught in his throat, his expression shifting from concern to something more guarded.

'You think someone is trying to mislead us?' Hale asked, his voice trembling slightly. Eleanor nodded, her determination igniting a flicker of hope within her. 'If the clock was tampered with, it could mean that the murder didn't happen at a quarter past eleven, as we initially believed. We need to consider who had access to this room and when.'

Hale stepped closer, peering at the clock with a furrowed brow. 'But why would anyone want to change the time? What could they gain from it?' His question hung in the air, heavy with implications. Eleanor sensed the weight of her suspicion, the way her gaze lingered on her as if she held the key to the mystery that had unfolded.

'Perhaps it was an attempt to create an alibi,' Eleanor suggested, her voice steady despite the turmoil within her. 'If someone could prove they were somewhere else at the time of the murder, it would shift the blame away from them. But we need to find out who had the opportunity to do this.'

Hale's eyes narrowed, and Eleanor could see the gears turning in his mind. 'I was in the drawing room with the others when the sounds were reported at ten-thirty. I didn't leave until after that,' he said, his tone defensive. Eleanor studied her closely, noting the slight tremor in her hands and the way she avoided her gaze. There was something unsettling about her demeanor, a hint of guilt that lingered in the air like a specter.

'And what about Beatrice?' Eleanor pressed, her voice firm. 'She was in and out of the drawing room all evening. She could have easily slipped away to tamper with the clock without anyone noticing.' Hale's expression darkened at the mention of Beatrice, and Eleanor felt a pang of unease. 'We can't rule anyone out just yet. We need to gather more evidence before making accusations.'

Hale nodded, though the tension in his shoulders remained. 'You're right. But we must tread carefully. If word of this gets out, it could ruin us all.' The gravity of his words hung between them, a reminder of the stakes they faced. Eleanor took a deep breath, her resolve hardening. 'We won't let fear dictate our actions. We owe it to Eleanor to find the truth, no matter how uncomfortable it may be.'

As they stood together in the clock room, the rain continued to fall, a relentless reminder of the storm brewing outside. The clock, with its scratched key and frozen hands, had become a symbol of the chaos that had erupted within Little Middleton Manor. Eleanor felt a surge of determination, ignited by the need for justice. She would uncover the truth, no matter the cost.
--- END PRIOR CHAPTER 2 ---

# Case Overview
Title: The Clockwork Deception
Era: 1930s
Setting: Little Middleton
Crime: murder (mechanical clock tampering)
Culprit: Captain Ivor Hale
False assumption: The murder occurred at the time indicated by the clock.
Cast: Eleanor Voss (she/her), Dr. Mallory Finch (they/them), Captain Ivor Hale (he/him), Beatrice Quill (she/her)

⚠ PRONOUN REMINDER: Dr. Mallory Finch use they/them/their (singular). Never write she/her or he/him for these characters.

Setting Lock: Keep all scenes and descriptions consistent with the stated setting (Little Middleton). Do not introduce a different location type.

Outline scenes:
[
  {
    "sceneNumber": 3,
    "act": 1,
    "title": "The Schedule Note",
    "setting": {
      "location": "Eleanor's room",
      "timeOfDay": "Mid-morning",
      "atmosphere": "Tense and revealing"
    },
    "characters": [
      "Eleanor Voss",
      "Captain Ivor Hale",
      "Dr. Mallory Finch",
      "Beatrice Quill"
    ],
    "purpose": "Introduce a key piece of evidence that contradicts the clock's reading",
    "cluesRevealed": [
      "clue_3",
      "clue_core_contradiction_chain",
      "clue_mechanism_visibility_core"
    ],
    "dramaticElements": {
      "conflict": "The contradiction raises questions about the suspects' alibis",
      "tension": "The note's contents suggest premeditated actions",
      "microMomentBeats": [
        "Beatrice's eyes widen as she reads the note."
      ]
    },
    "summary": "In Eleanor's room, the group discovers a note detailing a schedule for the evening's events. The note's contents contradict the clock's reading, raising immediate suspicions about the timing of Eleanor's death and the involvement of those present.",
    "estimatedWordCount": 1800,
    "emotionalRegister": "Eleanor's determination ignites hope, setting the tone for her quest for justice.",
    "dominantCharacterNote": {
      "name": "Eleanor Voss",
      "voiceRegister": "Eleanor speaks with a thoughtful cadence, often pausing to reflect before articulating her observations."
    },
    "humourGuidance": {
      "permission": "conditional",
      "condition": "If Dr. Finch employs polite savagery in response to a question."
    },
    "eraTextureNote": "Movement is limited due to poor weather, making outdoor activities difficult.; Communication is slow, relying on telegrams and letters rather than instant messaging.; Social gatherings are often formal, restricting spontaneity in interactions.; Economic constraints limit the ability to travel or engage in leisure activities.; Access to resources is restricted, impacting the quality of life for many.",
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
□ Chapter 3: "Scratches are found on the clock's winding key." is placed in the first 25% of the chapter, followed by an explicit inference or suspicion paragraph.
□ Chapter 3: "This indicates that the clock's time cannot be trusted." is placed in the first 25% of the chapter, followed by an explicit inference or suspicion paragraph.
□ Chapter 3: "A mechanical clock was deliberately wound back to mislead timings of events." is placed in the first 25% of the chapter, followed by an explicit inference or suspicion paragraph.
□ First chapter in this batch opens by continuing the previous chapter closing beat (same unresolved object, question, movement, or emotional pressure).
□ PRONOUN AUDIT — for every character you named in your chapters, list the pronouns you actually used, then verify against the canonical table. Correct any mismatch before outputting. Do NOT include this audit in your JSON output.
  Character            | Canonical     | Used in draft | Match?
  ---------------------|---------------|---------------|-------
  Eleanor Voss         | she/her/her/herself       | [fill in]     | [yes/no]
  Dr. Mallory Finch    | they/them/their/themselves | [fill in]     | [yes/no]
  Captain Ivor Hale    | he/him/his/himself        | [fill in]     | [yes/no]
  Beatrice Quill       | she/her/her/herself       | [fill in]     | [yes/no]
□ Return valid JSON only.
```
