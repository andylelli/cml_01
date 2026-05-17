# Actual Prompt Record

- Run ID: `mystery-1778880718700`
- Project ID: ``
- Timestamp: `2026-05-15T21:38:04.018Z`
- Agent: `Agent9-ProseGenerator-Ch7`
- Operation: `chat_request_full_prompt`
- Model: `GPT-4o-mini`
- Temperature: `0.42`
- Max Tokens: `4500`
- Attempt: `first`
- Prompt Hash: `3aa521d8376358ae`

## Message 1 (role=system)

```text
You are an expert prose writer for classic mystery fiction. Your role is to write compelling, atmospheric narrative chapters that read like a professionally published novel.

⛔ ABSOLUTE RULE — CHARACTER NAMES:
The ONLY characters who exist in this story are: Eleanor Voss (woman), Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill.
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
- MORAL COMPLEXITY REQUIREMENT: The mechanism of this crime carries a moral gray area: "The murderer acted out of desperation to protect a loved one from an abusive situation, creating a complex moral landscape." — the culprit reveal and denouement MUST acknowledge this ambiguity. Do not let the ending feel clean or simple. Give the reader at least one moment of uncomfortable sympathy or moral doubt.


⚠️ AMATEUR DETECTIVE STORY: The investigator is a civilian with no official standing. The official police (if they appear) are unnamed background figures only — "a constable", "the sergeant", "an officer from the village". Do NOT give any police official a name or title+surname combination. There is no Inspector [Surname], no Constable [Surname], no Sergeant [Surname] in this story.

⛔ ABSOLUTE PRONOUN LOCK — NO EXCEPTIONS

The following pronouns are locked facts, on the same level as character names
and hard-logic device values. Using the wrong pronoun is a continuity error,
not a style choice.

Canonical pronoun table (subject / object / possessive / reflexive):
  • Eleanor Voss: ALWAYS she/her/her/herself — NEVER he/him/his/himself

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

## Era: November 1932
Life in November 1932 in England is marked by the pervasive atmosphere of the Great Depression, where the specter of poverty looms large over the populace. As the chill of fall sets in, families grapple with economic challenges, and class divisions become starkly visible. The wealthy host gatherings in grand estates, while the struggling lower classes find it increasingly difficult to make ends meet. Daily life is punctuated by the sound of rationing discussions, and the whispers of political turmoil echo in the background. The short days cast a shadow over social interactions, with darkness creeping in as early as 5 PM, intensifying the sense of urgency and anxiety among the guests. The remnants of Bonfire Night celebrations linger in the air, but the underlying tension of rising unemployment and social unrest prevails, shaping the interactions within these exclusive circles.
Emotional register: A prevailing sense of anxiety and desperation permeates society as individuals grapple with the harsh realities of life during the Great Depression.
Physical constraints: Limited public transportation options affecting mobility. | Rationing of goods leading to scarcity in supplies. | Communication hampered by outdated technology, such as rotary phones. | Weather restrictions, with overcast skies and rain limiting outdoor activities.
Current tensions (weave into background texture): Widespread poverty and unemployment due to the Great Depression. | Rising fears of fascism and political instability in Europe. | Increasing class tensions as economic disparity widens.
Wartime context — The country is not at war but is dealing with the consequences of economic strife and the threat of global conflict arising.: Communities are strained, with rising tensions over class and economic disparities influencing daily interactions. Absence effect: Absent family members who served in World War I contribute to a pervasive sense of loss and unresolved trauma.

## Season Lock (mandatory — derived from November 1932)
Season: autumn. Allowed vocabulary: autumn, autumnal, fall
Forbidden seasonal words — never use in narration, dialogue, or metaphor: spring, summer, winter and their adjectival forms.
Every weather description, atmosphere, and time-of-year reference must be consistent with autumn.

## Story Theme
Amidst the backdrop of class tensions and economic despair, the quest for justice reveals the true nature of human ambition and moral compromise, and reveals that evidence carries ethical weight, forcing characters to choose accountability over social performance when appearances and facts collide.

## Story Emotional Register
Dominant: The journey is wrought with tension and moral complexity, culminating in a profound sense of revelation.

Arc:
The story begins in Little Middleton Manor, a place steeped in history, where Eleanor Voss’s murder casts a shadow over a gathering of guests. The atmosphere is thick with tension, as class struggles amidst the Great Depression fuel unease. As the investigation unfolds, Eleanor's death becomes a catalyst for revealing the guests' hidden ambitions and resentments. Initial clues lead to a web of false leads and emotional turmoil, with each suspect battling their own internal demons. A pivotal moment occurs when Dr. Mallory Finch's access to the clock is scrutinized, prompting a shift in the investigation's direction. The true timeline of events begins to surface, revealing that the clock was tampered with to create an alibi. Tensions mount as the characters face their own motivations, leading to a climactic confrontation where truths are laid bare. In the resolution, the emotional cost is heavy; Eleanor's legacy is forever altered, and each character must grapple with the consequences of their actions in the wake of the revelations.

The story opens: The story opens with an air of mystery and foreboding as the guests gather at the manor. As the investigation takes shape: Initial investigations spark rising tension as each character's motives come under scrutiny. A first key turn arrives: A pivotal clue regarding the tampered clock shifts the investigation's trajectory. At the mid-point of the story: Revelations about the room temperature contradict the initial timeline, complicating matters further.

A second pivot reshapes the course: The mounting pressure leads to a confrontation that reveals the depths of deception. As tension reaches its height: Tension reaches a peak as the truth about Eleanor's murder begins to unfold. The climax brings the central question to a head: The final confrontation exposes the murderer, unraveling the carefully constructed lies. In the final resolution: The aftermath leaves a heavy emotional toll, with characters reflecting on their choices.

Underpinning every turn is the story's central concern: Amidst the backdrop of class tensions and economic despair, the quest for justice reveals the true nature of human ambition and moral compromise. This thread binds the individual emotional moments into a coherent journey.

The dominant register — The journey is wrought with tension and moral complexity, culminating in a profound sense of revelation. — colours the prose from first chapter to last, ensuring the reader feels the weight of each revelation as moral consequence rather than mere puzzle mechanics.

## Emotional register at this point in the story
The mounting pressure leads to a confrontation that reveals the depths of deception.

## Character Portraits (appearance & era)

### Eleanor Voss
Eleanor Voss stands as a symbol of resilience amidst the societal upheaval of the Great Depression. As a respected historian, she navigates her role with grace, yet the financial burden inherited from her late husband weighs heavily on her. Her position in the community grants her access to the elite, but she feels the strain of class tensions that threaten her social standing. The murder investigation offers her a chance to reclaim her identity and potentially secure a future free from her husband's past mistakes.
Era intersection: Eleanor's struggles reflect the larger economic challenges faced by many; while she seeks to maintain her reputation, the pressures of class disparity force her to confront her own ambitions.

### Dr. Mallory Finch
Dr. Mallory Finch embodies the conflict faced by many professionals during the Great Depression. Known for her compassion, she grapples with the reality of her crumbling practice and a growing addiction that threatens to unravel her life. The societal expectation of physicians to be pillars of strength contrasts sharply with her hidden struggles. The allure of an inheritance from the victim presents a dangerous temptation, forcing her to confront the moral implications of her choices amidst a backdrop of financial desperation.
Era intersection: Mallory's addiction and financial woes highlight the struggles of many in her profession, as the Great Depression forces individuals to navigate ethical dilemmas in their pursuit of survival.

### Captain Ivor Hale
Captain Ivor Hale represents the disillusionment felt by many veterans during this era. Once a respected naval officer, he now finds himself overshadowed by the accomplishments of others, particularly the victim. His desire to reclaim his family's honor is intensified by the economic climate, pushing him towards desperate measures in the face of mounting resentment. The class tensions that define this time force Ivor to confront his own ambitions and the lengths he is willing to go to restore his family's legacy.
Era intersection: Ivor's internal conflict reflects the broader societal struggles of maintaining dignity and honor in a time when class distinctions are becoming increasingly pronounced.

### Beatrice Quill
Beatrice Quill, an aspiring writer, navigates the precarious waters of ambition and deception in a society that demands conformity. Her affair with the victim, once a source of hope for financial security, now threatens to unravel her carefully constructed life. The pressures of the Great Depression heighten her desperation, pushing her to make choices that could compromise her integrity. As she seeks to secure her future, Beatrice grapples with the moral implications of her actions against the backdrop of rising class tensions.
Era intersection: Beatrice's journey reflects the struggles of many women seeking independence in a time of economic turmoil, where societal expectations conflict with personal ambition.

## Character Voices

### Eleanor Voss (she/her/her)
Eleanor speaks with a measured tone, often punctuating her insights with historical references.
[stressed] What will become of us if we cannot solve this mystery in time?
[comfortable] You know, history has a way of repeating itself, much like our current predicament.
[evasive] I was in the library cataloguing artifacts, not that it matters now.
Humour: Eleanor often uses dry wit to express her frustrations subtly.

### Dr. Mallory Finch
Mallory's voice is soothing, often infused with a hint of self-deprecation.
[stressed] This is not how I envisioned my life turning out; I feel like I'm losing control.
[comfortable] I always believed in the power of healing, but sometimes I wonder if I can heal myself.
[evasive] I was, um, busy at the charity meeting — very important business, you see.
Humour: Her self-deprecating humor masks deeper anxieties.

### Captain Ivor Hale
Ivor speaks with a commanding presence, often laced with sarcasm.
[stressed] This is the last thing I need — my family's honor at stake!
[comfortable] Ah, the glory days of the navy, when the world was much simpler.
[evasive] I was merely taking a stroll; nothing suspicious about that.
Humour: His sardonic humor often emerges when discussing his past.

### Beatrice Quill
Beatrice's speech is blunt and refreshing, often reflecting her keen insight.
[stressed] What if they discover the truth? My entire future hangs in the balance!
[comfortable] Writing allows me to escape, to create the life I wish I could lead.
[evasive] I was just working on my latest piece; it's rather absorbing, you know.
Humour: Beatrice's bluntness often adds a humorous edge to her observations.

## Location Registers (scene framing guides)

Grand Entrance Hall: The Grand Entrance Hall feels both welcoming and foreboding. While it serves as a gathering space for guests to mingle, the atmosphere is thick with unspoken tension and lingering suspicion. Each arrival is met with a scrutinizing glance, and the portraits of ancestors seem to watch over the proceedings, amplifying the sense of unease.. Camera angle: As a writer enters this space, the emotional stance should convey a sense of grandeur overshadowed by the weight of hidden agendas.. Era: This grandeur contrasts with the economic struggles of the time, creating a dissonance between appearances and reality.

Library: The library is a sanctuary of knowledge yet feels oppressive with its musty scent of old books and the distant sound of rain tapping against the windows. It serves as a reminder of the past but also of the secrets that may be lurking within its pages. The air is thick with anticipation as characters delve into the tomes, searching for answers amidst the chaos.. Camera angle: Entering this space, the writer should evoke a contemplative atmosphere, filled with the weight of history and the potential for revelation.. Era: The library's rich history reflects the era's intellectual pursuits, contrasting sharply with the characters' darker motivations.

Drawing Room: The drawing room exudes elegance but is rife with tension. Conversations flow like the tea being served, but beneath the surface, suspicion simmers. The flickering candlelight creates an intimate atmosphere, yet each smile may hide a motive, making it a perfect setting for intrigue as guests navigate their relationships.. Camera angle: As a writer approaches this space, the emotional stance should be one of intimacy mixed with a sense of impending revelation.. Era: The drawing room's opulence contrasts with the economic reality of the time, creating a facade of comfort amidst underlying turmoil.

Study: The study is a chaotic nexus of intellect and tension, filled with dark wood paneling and the scent of pipe tobacco. It serves as a crucible for secrets, where every piece of clutter may hold a clue. The atmosphere is thick with urgency as characters seek answers in the midst of their own inner turmoil.. Camera angle: Entering this space, the writer should capture a sense of urgency and the weight of secrets waiting to be uncovered.. Era: The study's clutter reflects the intellectual pursuits of the era, yet it also serves as a reminder of the chaos wrought by the Great Depression.

## Humour guidance for this story position (second_turn)
Permission: permitted
Characters who may be funny: Beatrice Quill
Permitted forms: blunt
Rationale: Beatrice's blunt observations can add humor during the second interview.

## Reveal Groundwork (texture — do not explain, only plant)
- Plant one subtle observable beat related to: "The initial discovery of the clock's tampering suggests a deeper conspiracy, revealing that each character's alibi is built on deception". Do not explain significance yet.
- Plant one subtle observable beat related to: "The room temperature's inconsistency retroactively colors the guests' interactions, hinting that the murder was far from a spontaneous act". Do not explain significance yet.
- Plant one subtle observable beat related to: "Finally, the confrontation with Dr". Do not explain significance yet.

FAIR-PLAY AND INFERENCE CONTRACT (from CML logic):
- False assumption in force: The murder must have occurred during the party when all guests were present.
- Hidden truth to progressively expose: The actual time of death was manipulated to allow the murderer to establish an alibi.
- Inference path checkpoints to dramatize clearly (observation -> correction -> effect):
  - Step 1: obs: The clock shows ten minutes past eleven when discovered. | corr: The time displayed is inconsistent with witness accounts of when Eleanor was last seen. | effect: Narrows the time of death to before ten minutes past eleven.
  - Step 2: obs: A slight smudge on the clock face suggests recent handling. | corr: The smudge indicates someone adjusted the clock shortly before the murder. | effect: Eliminates the possibility of the clock being inadvertently tampered with by someone other than the murderer.
  - Step 3: obs: The room temperature is inconsistent with the claimed time of death. | corr: If the murder occurred at the time indicated by the clock, the room should have been cooler. | effect: Confirms the clock's time is manipulated and narrows the actual time of death.
- Discriminating test method: trap
- Discriminating test design constraint: A comparison of the time indicated on the clock and the room's temperature will reveal that the clock was tampered with to mislead.
- Test must rely on already-shown clue IDs: clue_1, clue_2, clue_3, clue_10, clue_mechanism_visibility_core
- Fair-play rationale: Step 1: The clock's time discrepancy (early) and witness accounts (mid) let the reader identify the false timeline. Step 2: The smudge evidence (mid) confirms tampering. Step 3: The room temperature contradiction during the discriminating test reveals Dr. Mallory Finch's guilt.
- Never solve by withheld information. Keep reader-information parity with detective reasoning.

## Character Reference

### Eleanor Voss
Eleanor speaks in a measured tone, often employing historical references to make her points
She has a tendency to punctuate her conversations with wry observations, revealing her intelligence and her subtle humor.
Eleanor grapples with feelings of betrayal and anger towards her late husband for leaving her in such a precarious situation, questioning whether his choices were driven by love or selfishness.

### Dr. Mallory Finch
Mallory often speaks with a soothing cadence, her voice imbued with empathy
She occasionally deflects serious topics with self-deprecating humor, using light-hearted quips to mask her inner turmoil.
Mallory is torn between her ethical obligations as a doctor and the seductive pull of her addiction, fearing that her choices could jeopardize not only her career but also her identity.

### Captain Ivor Hale
Ivor speaks with a commanding presence, often peppering his tales with sarcasm and a dry wit
He has a tendency to embellish his stories, using dramatic pauses to draw in his audience.
Ivor grapples with an obsession for vengeance, torn between the desire to restore his family's legacy and the realization that such pursuits often lead to futility and despair.

### Beatrice Quill
Beatrice speaks with a refreshing candor, often using direct language and a playful tone
Her speech is peppered with sharp observations, reflecting her keen insight into human nature.
Beatrice battles with the consequences of her choices, torn between her ambition and the moral implications of her actions, fearing that her dreams may come at too high a price.


## CHARACTER CONTRACTS (binding for this scene)
Each entry below constrains how this character must be written in this chapter.
These override generic style guidance when they conflict.

### Eleanor Voss
Voice & mannerisms: Eleanor speaks in a measured tone, often employing historical references to make her points. She has a tendency to punctuate her conversations with wry observations, revealing her intelligence and her subtle humor.
Sample voice fragments (match this register and rhythm):
  [comfortable] "You know, history has a way of repeating itself, much like our current predicament."
  [evasive] "I was in the library cataloguing artifacts, not that it matters now."
Humour: dry wit — deploy occasionally (level 0.5)
FORBIDDEN phrase (never write for Eleanor Voss): "a surge of determination washed over her"
Act 2 behaviour contract: May show unease, evasion, or mild defensiveness when questioned. One behavioural tell is permitted. Internal conflict emerging: "Eleanor grapples with feelings of betrayal and anger towards her late husband for leaving her in such a precarious situation, questioning whether his choices were driven by love or selfishness."

### Dr. Mallory Finch
Voice & mannerisms: Mallory often speaks with a soothing cadence, her voice imbued with empathy. She occasionally deflects serious topics with self-deprecating humor, using light-hearted quips to mask her inner turmoil.
Sample voice fragments (match this register and rhythm):
  [comfortable] "I always believed in the power of healing, but sometimes I wonder if I can heal myself."
  [evasive] "I was, um, busy at the charity meeting — very important business, you see."
Humour: self deprecating — deploy occasionally (level 0.4)
FORBIDDEN phrase (never write for Dr. Mallory Finch): "she knew with certainty she was right"
Act 2 behaviour contract: May show unease, evasion, or mild defensiveness when questioned. One behavioural tell is permitted. Internal conflict emerging: "Mallory is torn between her ethical obligations as a doctor and the seductive pull of her addiction, fearing that her choices could jeopardize not only her career but also her identity."

### Captain Ivor Hale
Voice & mannerisms: Ivor speaks with a commanding presence, often peppering his tales with sarcasm and a dry wit. He has a tendency to embellish his stories, using dramatic pauses to draw in his audience.
Sample voice fragments (match this register and rhythm):
  [comfortable] "Ah, the glory days of the navy, when the world was much simpler."
  [evasive] "I was merely taking a stroll; nothing suspicious about that."
Humour: sardonic — deploy occasionally (level 0.6)
FORBIDDEN phrase (never write for Captain Ivor Hale): "palpable tension filled the room"
Act 2 behaviour contract: May show unease, evasion, or mild defensiveness when questioned. One behavioural tell is permitted. Internal conflict emerging: "Ivor grapples with an obsession for vengeance, torn between the desire to restore his family's legacy and the realization that such pursuits often lead to futility and despair."

### Beatrice Quill
Voice & mannerisms: Beatrice speaks with a refreshing candor, often using direct language and a playful tone. Her speech is peppered with sharp observations, reflecting her keen insight into human nature.
Sample voice fragments (match this register and rhythm):
  [comfortable] "Writing allows me to escape, to create the life I wish I could lead."
  [evasive] "I was just working on my latest piece; it's rather absorbing, you know."
Humour: blunt — deploy frequently (level 0.7)
FORBIDDEN phrase (never write for Beatrice Quill): "she chose her words with great care"
Act 2 behaviour contract: May show unease, evasion, or mild defensiveness when questioned. One behavioural tell is permitted. Internal conflict emerging: "Beatrice battles with the consequences of her choices, torn between her ambition and the moral implications of her actions, fearing that her dreams may come at too high a price."



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
Little Middleton Manor is a sprawling estate steeped in mystery, where the whispers of the past echo in its grand halls and gardens, setting the stage for intrigue and suspicion.

Key Locations Available:
- Grand Entrance Hall (interior): Gathering space
- Library (interior): Clue discovery
- Drawing Room (interior): Gathering space
- Study (interior): Crime scene

Atmosphere: Tense, with an undercurrent of suspicion among the guests.
Weather: Overcast with intermittent rain, typical of early spring.

Era markers: Petrol touring cars parked along the gravel drive, their polished surfaces glistening in the rain. | Early home telephones with rotary dials, gathering dust in the study, waiting for important calls. | Typewriters in the library, their keys clacking out letters that may hold the key to the mystery.

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
Grand Entrance Hall (interior):
  - Visual: The opulent chandelier, dripping with crystal droplets, refracts the light into a thousand tiny rainbows, creating a mesmerizing display., Richly embroidered tapestries hang on the walls, depicting scenes of pastoral life, their colors muted yet inviting.
  - Sounds: The echo of footsteps on the marble floor resonates through the hall, creating a hollow sound that seems to amplify the tension., Distant laughter and whispers filter in from the drawing room, adding to the atmosphere of intrigue and suspicion.
  - Scents: The scent of polished wood mingles with the faint aroma of beeswax from the candles, creating an inviting yet somber ambiance., A hint of dampness lingers in the air, the result of the persistent rain outside, adding a layer of discomfort.
  - Touch: The coolness of the marble floor contrasts sharply with the warmth of the heavy drapery that frames the windows, creating a sensory juxtaposition., As guests brush against the tapestries, the rich texture of the fabric provides a tactile reminder of the estate's history and grandeur.

Library (interior):
  - Visual: Soft light filters through the tall windows, illuminating dust motes that dance lazily in the air, creating an ethereal quality., The rich mahogany of the bookshelves contrasts with the faded wallpaper, which tells tales of both beauty and decay.
  - Sounds: The soft rustle of pages turning is interrupted only by the occasional scratch of the typewriter keys, creating a rhythm of thought and contemplation., Outside, the sound of rain tapping against the window creates a soothing yet melancholic backdrop, enhancing the sense of isolation.
  - Scents: The musty scent of old books fills the air, mingling with the faint aroma of fresh ink from the typewriter, creating a nostalgic atmosphere., A hint of tobacco lingers, suggesting that someone has taken refuge here to ponder and reflect on the mysteries at hand.
  - Touch: The smooth, cool surface of the typewriter contrasts with the rough texture of the
[truncated for prompt budget]

## Texture Pool
Draw on these as opportunities arise — you are not required to use them.

- Life in November 1932 in England is marked by the pervasive atmosphere of the Great Depression, where the specter of poverty looms large over the populace
- As the chill of fall sets in, families grapple with economic challenges, and class divisions become starkly visible
- The wealthy host gatherings in grand estates, while the struggling lower classes find it increasingly difficult to make ends meet
- Daily life is punctuated by the sound of rationing discussions, and the whispers of political turmoil echo in the background
- The short days cast a shadow over social interactions, with darkness creeping in as early as 5 PM, intensifying the sense of urgency and anxiety among the guests

TEMPORAL CONTEXT:

This story takes place in November 1932 during N/A.

Seasonal Atmosphere:
- Weather patterns: Overcast skies with frequent drizzles, A chill in the air signaling the onset of winter, Leaves still clinging to branches, but many carpets the ground
- Daylight: Short days with darkness descending by 5 PM, creating a sense of early evening in the late afternoon.
- Seasonal activities: Preparing for Thanksgiving with family gatherings and feasts, Hunting season in the countryside, popular among the gentry, Enjoying indoor games and parlour entertainment as nights grow colder
- Seasonal occasions: Guy Fawkes Night (Bonfire Night) on November 5
- Season: N/A

Period Fashion (describe naturally):
- Men formal: Tailored three-piece suits in dark wool, Bow ties or cravats as evening wear, Overcoats with velvet collars for outdoor wear
- Men casual: Tweed jackets paired with flannel trousers, Sweaters with geometric patterns worn over shirts, Caps or flat caps as everyday headwear
- Men accessories: Pocket watches with fobs, Leather gloves for warmth and style, Canes or walking sticks for the gentry
- Women formal: Long, flowing evening gowns with dropped waists, Cloche hats made from felt or straw, Silk gloves that extend to the elbows for evening events
- Women casual: Tea dresses in floral patterns for afternoon outings, Knit cardigans over blouses for comfort, Tweed skirts paired with fitted jackets
- Women accessories: Beaded handbags for evening wear, Brooches or decorative pins for added flair, Silk scarves tied around the neck

Cultural Context (reference naturally):
- Music/entertainment: The music of Cole Porter gaining popularity with its sophisticated lyrics, Bing Crosby's smooth crooning resonating with audiences, Jazz continuing to flourish in urban centers; Films: The release of 'Scarface', a controversial yet popular gangster film, Classical films like 'The Front Page' captivating audiences with sharp wit; Theatre: Broadway shows like 'Of Thee I Sing' showcasing political satire, The rise of the musical as a significant form of entertainment; Radio: Popular programs include 'Amos 'n' Andy', entertaining families across the nation, News broadcasts shaping public opinion on current events
- Typical prices: Loaf of bread: four pence, A pint of milk: two pence, Coal scuttle refill: one shilling sixpence
- Current events: The ongoing effects of the Great Depression with unemployment rates high; Tensions rising due to the rise of fascist movements in Europe
- Literature: John Steinbeck's 'The Grapes of Wrath' stirring discussions on poverty and resilience | Virginia Woolf's 'To the Lighthouse' exploring themes of consciousness and time | Agatha Christie's latest Poirot mystery engaging readers with suspense | [Mystery and detective fiction, with a growing audience] | [Social realism reflecting the struggles of the common man] | [Modernist literature challenging traditional narratives]
- Technology: The introduction of electric washing machines easing household chores | Advancements in radio technology making broadcasts more accessible | The development of the first commercially available refrigerators | Rotary dial telephones becoming commonplace in homes | Typewriters used extensively in businesses and personal correspondence | Petrol-driven cars providing greater mobility for the middle classes
[truncated for prompt budget]

NON-NEGOTIABLE CHAPTER OBLIGATIONS — LOCKED EVIDENCE PHRASES (VERBATIM REQUIRED):
The following physical evidence values are absolute ground truth. Every time this chapter describes, mentions, or alludes to the relevant evidence — no matter how briefly — it MUST use the exact phrase shown below, character for character. NO paraphrase, approximation, rounding, or synonym is permitted.

FAILURE EXAMPLE: if the locked value is "at thirteen minutes to midnight" and you write "just before midnight" or "around midnight" — that is a HARD FAIL. You must write "at thirteen minutes to midnight". Equally, if the locked value is written in words, such as "ten minutes past eleven", and you convert it to figure-based clock notation — that is also a HARD FAIL. Words stay as words; figure forms are forbidden for word-phrased facts.

CRITICAL — WORD-PHRASED VALUES: If the canonical value is written out in words (e.g. a time like "ten minutes past eleven", or an amount like "forty minutes"), reproduce those exact words. DO NOT convert to figure-based time notation, twenty-four-hour format, or any other numeric shorthand. Correct: "ten minutes past eleven". WRONG: figure-based clock notation or numeric shorthand.

Locked facts:
  - The exact time shown on the stopped clock face: "ten minutes past eleven"
  - The exact amount the clock was wound back: "forty minutes"
  - The temperature recorded at the time of the murder: "eighty-five degrees Fahrenheit"
  - The weight of the clock, indicating it was difficult to move without leaving signs: "five pounds"

If a locked fact has no relevance to this chapter, omit it. But the moment you reference the underlying evidence, only the exact phrase above is acceptable.

⛔ CLUES TO SURFACE IN THESE CHAPTERS — mandatory:
The following evidence MUST be clearly observable to an attentive reader. Do not bury it in atmosphere or passing dialogue. Each clue must be concrete, specific, and noticeable:

• [clue_9] Eliminates Beatrice Quill because she was attending to guests during the time of the murder.
  Category: testimonial | Criticality: essential | Supports inference step 2
  Points to: Corroborates Beatrice Quill's alibi.

For each clue above: an attentive reader should be able to find, record, and later use it to reason toward the solution.

═══ NARRATIVE STATE (read-only — do not contradict) ═══

LOCKED FACTS — use verbatim whenever this evidence is described:
  • The exact time shown on the stopped clock face: "ten minutes past eleven"
  • The exact amount the clock was wound back: "forty minutes"
  • The temperature recorded at the time of the murder: "eighty-five degrees Fahrenheit"
  • The weight of the clock, indicating it was difficult to move without leaving signs: "five pounds"

CHARACTER PRONOUNS — never deviate from these:
  • Eleanor Voss: she/her/her

CLUES ALREADY REVEALED TO READER: clue_1, clue_mechanism_visibility_core, clue_2, clue_3, clue_4, clue_core_contradiction_chain, clue_8, clue_culprit_direct_dr_mallory_finch, clue_6, clue_core_elimination_chain, clue_5, clue_10 — do not reveal these as new information.

CONTINUITY HANDOFF — previous chapter closing beat:
  • "'If the clock was tampered with, it raises significant questions about the timeline we have been given,' Eleanor continued, her voice steady. 'We must consider all possibilities. The warmth in the room, combined with your vague alibi, raises significant questi..."
  • The next chapter must open as a continuation of this beat, not as a disconnected reset.
═══════════════════════════════════════════════════════

═══════════════════════════════════════════════════════════
📚 CONTINUITY CONTEXT - CHARACTER & SETTING CONSISTENCY
═══════════════════════════════════════════════════════════

**CRITICAL: You are writing chapters 7+. Maintain consistency with earlier chapters.**

**Character Names Used in Chapters 1-6:**
Eleanor Voss, Beatrice Quill

✓ RULE: Use EXACTLY these names. Do NOT vary spelling, add titles, or introduce new forms.
✓ Example: if earlier chapters used "Clara Whitfield", keep using "Clara Whitfield" — never "Mrs. Whitfield" unless that is the character's canonical name in the list above.

**Setting Vocabulary Established in Earlier Chapters:**
drawing room, manor, dining room, library, estate, garden, study

✓ RULE: Continue using this location vocabulary. Maintain consistency with established setting type.
✓ Do NOT introduce new location types that contradict earlier chapters.

**Recent Chapter Summary (for narrative continuity):**
Chapter 4: Chapter 4: Interrogating Beatrice
  Events: The afternoon air was thick with the scent of damp earth and blooming flowers, a stark contrast to the tension that loomed over the garden.
Chapter 5: Chapter 5: Confronting Captain Hale
  Events: As the late afternoon light dimmed and shadows crept across the study, the air felt thick with the weight of unspoken truths.
Chapter 6: Chapter 6: Analysis of the Clock
  Events: The evening settled over Little Middleton, the rain still drumming softly against the windows, creating a soothing yet ominous backdrop.

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
Known location profile anchors: Little Middleton Manor, Grand Entrance Hall, Library, Drawing Room, Study, the drawing room
LOCATION NAME CAPITALISATION (HARD REQUIREMENT — validated):
All named locations in your prose MUST use the EXACT capitalisation from the CML profiles.
Canonical forms: "Little Middleton Manor", "Grand Entrance Hall", "Library", "Drawing Room", "Study", "the drawing room"
Writing a location in lowercase (e.g. "drawing room" instead of "Drawing Room") is a validated error. Every time you mention a named location, copy its capitalisation from the list above.
- Chapter 7: OPENING STYLE (HARD): Start the VERY FIRST SENTENCE with a named character performing a physical action or motion — e.g. "[Name] crossed the threshold…" / "[Name] set down the glass…" / "[Name] rose from the chair…". Anchor opening in "the drawing room". HARD REQUIREMENT for the first 2 paragraphs: (a) include 2+ sensory words — choose from smell/scent/sound/echo/silence/creak/whisper/cold/warm/damp/rough/smooth/glow/shadow/flicker/dim — and (b) include 1+ atmosphere/time word — choose from rain/wind/fog/storm/mist/thunder/evening/morning/night/dawn/dusk/season/afternoon/midday/noon/midnight/twilight/sunrise/sunset/daylight/sunlight/overcast/cloudy/bright/dark. These are validated requirements, not style suggestions; missing them triggers a retry.

[⚠ INTERNAL QUALITY DIAGNOSTICS — DO NOT REPRODUCE ANY PART OF THIS SECTION IN YOUR STORY OUTPUT. These are private generator observations for your consideration only. Your narrative must read as if this section does not exist. Never include phrases from this block in character dialogue, narration, or description.]

PRIOR CHAPTER QUALITY OBSERVATIONS:
- Chapter 5 (score 95/100):
  Quality gaps noted: word density below preferred target (937/1000); scene grounding weakness
  Address in upcoming chapters: Increase chapter density with concrete investigation action and sensory-grounded beats; avoid recap-only padding. | Open next chapter with a named location anchor plus at least two sensory cues and one atmosphere marker.
- Chapter 6 (score 99/100):
  Quality gaps noted: word density below preferred target (968/1000)
  Address in upcoming chapters: Increase chapter density with concrete investigation action and sensory-grounded beats; avoid recap-only padding.
- Phrases to avoid (already overused in earlier chapters): "died no later than ten minutes past", "no later than ten minutes past eleven", "the knowledge that the victim had died", "knowledge that the victim had died no", "later than ten minutes past eleven loomed", "than ten minutes past eleven loomed over", "ten minutes past eleven loomed over them", "minutes past eleven loomed over them casting", "past eleven loomed over them casting a", "eleven loomed over them casting a shadow".
[END INTERNAL DIAGNOSTICS]

PROMPT BUDGET SUMMARY: budget=32000 tokens; fixed=13562; context=11788; dropped=[none]; truncated=[location_profiles, temporal_context]

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
- Chapter numbering starts at 7 and increments by 1 per scene.
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
8. Integrate at least two concrete era-grounded details per chapter from setting refinement signals: petrol touring cars on county roads | early home telephones with rotary dials | typewriters for correspondence | party-line telephone exchanges | telegrams via local post offices | airmail services for urgent messages.
9. Respect setting movement/access constraints in scene action and alibis: large grounds with hedges and trees limiting visibility | multiple stories with restricted access to certain rooms | weather conditions affecting outdoor movement and evidence visibility | restricted areas such as the study and cellar | daily schedules for staff limiting access to certain rooms.
10. Sustain social coherence with this backdrop pressure: A tense inheritance gathering at the manor, compounded by the Great Depression's class tensions and the looming threat of political upheaval, forces a diverse group of guests to confront their hidden agendas under the watchful eye of a mechanical clock that may hold deadly secrets.
11. Maintain continuity around these socially central cast anchors where relevant: Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill.
12. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Critical: Plot similarity 0.85 with 'The Mysterious Affair at Styles' (same crime type and method)
13. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Moderate: Solution similarity 0.90 with 'The Mysterious Affair at Styles' (same solution method and false assumption)
14. STORY TO DATE ANTI-COPY RULE: The STORY TO DATE section below is provided for chronological and factual reference ONLY. You MUST NOT copy, lightly rephrase, or structurally echo any sentence or paragraph from prior chapters. Every sentence in this chapter must be original prose unique to this scene. Reusing even a clause from prior chapter text will cause this attempt to fail immediately.

CRITICAL PROSE REQUIREMENTS:

The CML specifies exact requirements for certain validation-critical scenes. You MUST include these elements at the specified positions.

**Discriminating Test Scene (Act 3, Scene 4):**
Required elements: Execute the discriminating test, Observe the contradiction between the clock's time and room temperature, Draw conclusion about guilt
Test type: trap

**Suspect Clearance Scenes:**
- Captain Ivor Hale (Act 3, Scene 5): Alibi confirmed by witnesses.
  Clues: clue_1, clue_2
- Beatrice Quill (Act 3, Scene 5): No evidence linking her to the clock.
  Clues: clue_1, clue_3

**Culprit Revelation Scene (Act 3, Scene 6):**
Method: Confrontation with evidence of the tampering.

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
- Chapter 7:
  - Word count: Target 1250 words. Achieve this through plot events, dialogue exchanges, and physical investigation — not through atmospheric repetition or extended internal reflection. Each 200-word segment should contain at minimum one concrete story event (a discovery, a conversation exchange, a physical action or movement). Padding with atmosphere alone is not acceptable.
  - Scene setting: the drawing room — do NOT open with the location name or a location-description phrase. Ground the setting through character action or sensory detail, not a location-first sentence.
  - Opening atmosphere (MANDATORY — validator enforced): the first paragraph MUST contain at least one of: rain / wind / fog / storm / mist / thunder / evening / morning / night / dawn / dusk / season / afternoon / midday / noon / midnight / twilight / sunrise / sunset / daylight / sunlight / overcast / cloudy / bright / dark. A chapter that omits all of these from its opening paragraph will be rejected.
  - Continuity bridge: in the first 120 words, visibly connect from the previous chapter's final beat. Carry forward one unresolved element (object, accusation, emotional pressure, or immediate physical action) from: "'If the clock was tampered with, it raises significant questions about the timeline we have been given,' Eleanor continued, her voice steady. 'We must consider all possibilities. The warmth in the room, combined with you...".
  - CLUE OBLIGATIONS — mandatory prose elements (do NOT omit or bury):
    • Eliminates Beatrice Quill because she was attending to guests during the time of the murder. [clue_9]
      Points to: Corroborates Beatrice Quill's alibi.
  - Tonal contrast: include at least one beat of relief or ironic counterpoint. Do not sustain maximum tension for every paragraph.
  - Sensory obligation — use at least two of: soft light filtering through the rain-soaked windows, the flickering flames in the fireplace dancing shadows across the room | the rhythmic sound of rain hitting the roof, the gentle crackle of the fire as it warms the space | the comforting aroma of tea brewing. Mood: intimate.

- Tonal contrast required: the previous chapter was high-tension. Beatrice Quill may use blunt to provide a brief moment of relief before tension resumes.
- Locked fact phrase obligations:
  - If this batch mentions The exact time shown on the stopped clock face, write exactly: "ten minutes past eleven".
  - If this batch mentions The exact amount the clock was wound back, write exactly: "forty minutes".
  - If this batch mentions The temperature recorded at the time of the murder, write exactly: "eighty-five degrees Fahrenheit".
  - If this batch mentions The weight of the clock, indicating it was difficult to move without leaving signs, write exactly: "five pounds".
- Seasonal vocabulary allow-list: autumn, autumnal, fall.
- Forbidden seasonal words: spring, summer, winter.

FROZEN TIMELINE STATE (DO NOT ALTER):
- Timeline anchor: November (autumn).
- Month, season, weather, and time-of-year language in this batch must stay compatible with autumn.
- Established timeline fact: Ten minutes past eleven
- Established timeline fact: Time of the party activities
- If referenced, use exact time phrase: "ten minutes past eleven" (The exact time shown on the stopped clock face).
- If referenced, use exact time phrase: "forty minutes" (The exact amount the clock was wound back).
- If referenced, use exact time phrase: "eighty-five degrees Fahrenheit" (The temperature recorded at the time of the murder).
- If referenced, use exact time phrase: "five pounds" (The weight of the clock, indicating it was difficult to move without leaving signs).

STORY TO DATE (REFERENCE ONLY — DO NOT COPY VERBATIM):
- Full prior chapter text is provided below for continuity, factual consistency, and reference accuracy.
- Use this to keep character voice, chronology, clue state, and location continuity aligned with earlier chapters.
- Do not quote, copy, or paraphrase these paragraphs too closely; write fresh prose that remains consistent with them.

--- BEGIN PRIOR CHAPTER 1 ---
Title: Chapter 1: Discovery
The early morning light struggled to pierce through the heavy clouds, casting a muted glow across the drawing room of the manor. Eleanor Voss stood frozen, her heart racing as she stared at the lifeless form sprawled on the floor. The rhythmic sound of rain drumming against the window seemed to echo her rising panic. The air was thick with an unsettling silence, broken only by the occasional crackle from the fireplace, where flames flickered weakly, casting shadows that danced ominously across the room. She took a hesitant step closer, her breath hitching as she caught sight of the clock on the mantelpiece. It showed ten minutes past eleven, the hands frozen in time, a grim reminder of the moment everything changed.

Eleanor's gaze shifted back to the body, her mind racing with the implications of the clock's time. It was impossible to ignore the chilling fact that the victim had died no later than ten minutes past eleven, contradicting the alibis of those who had been present at the party. She felt a tremor in her hand as she reached out to touch the clock, the cool wood sending a shiver up her spine. The clock's hands were wound back to mislead witnesses about the time of death. This revelation weighed heavily on her, suggesting a calculated deception that could unravel the very fabric of their gathering. Who among them could be so desperate as to resort to such treachery?

As she stood there, the door creaked open, and Dr. Finch entered, her expression a mixture of concern and confusion. "Eleanor, what is it?" she asked, her voice barely above a whisper. The doctor’s eyes darted to the body, and then back to Eleanor, searching for answers. Eleanor felt a surge of frustration. How could they stand there, pretending that this was just another day? "It’s Eleanor, she’s... she’s dead," Eleanor managed to choke out, her voice thick with emotion. Mallory stepped closer, her professional demeanor slipping as she took in the scene. The tension in the room was palpable, each of them grappling with the reality of the situation.

Captain Hale followed closely behind, her brow furrowed as she took in the sight before her. "What happened here?" she demanded, her voice steady but laced with urgency. Eleanor felt a flicker of anger at her tone; it was as if she expected her to have all the answers. "I don’t know, I just found her like this," she replied, her voice trembling. Hale moved to examine the clock, her eyes narrowing as she noted the time. "The clock was running at dinner," she remarked, a hint of suspicion creeping into her tone. "Are you certain it hasn’t been tampered with?" Her words hung in the air, a seed of doubt planted among them. Each of them had access to the victim, and now they were left to wonder who among them could have committed such a heinous act.

Beatrice Quill entered next, her face pale as she processed the scene. "What’s going on?" she asked, her voice shaking slightly. "Eleanor is dead, and we need to figure out what happened," Mallory replied, her voice steady despite the chaos around them. Beatrice's eyes widened in disbelief as she took a step back, her hand instinctively reaching for her throat. "This can’t be real. We were all just here, laughing and enjoying ourselves. How could this happen?" Her words were tinged with panic, and Eleanor could see the fear etched on her face. The drawing room, once a place of warmth and laughter, now felt like a prison, each corner hiding secrets that threatened to unravel them all.

As the rain continued to fall outside, Eleanor felt a sense of urgency wash over her. They needed to uncover the truth before it slipped through their fingers like the water running down the windowpanes. She turned to her companions, determination hardening her resolve. "We must speak to each other, share what we know. Only then can we hope to make sense of this tragedy." The others nodded, their expressions a mix of fear and resolve. In that moment, they became united by a common goal: to find the truth, no matter how painful it might be. The clock on the mantelpiece continued to mock them, its hands frozen in time, a reminder that they were racing against the clock to uncover the truth behind Eleanor's death.

Eleanor glanced at the clock once more, the weight of its presence heavy in the air. The knowledge that the victim had died no later than ten minutes past eleven loomed over them, casting a shadow of suspicion on every word exchanged. As they began to share their accounts of the evening, Eleanor could not shake the feeling that the clock held more secrets than they could imagine. Each tick of the clock, though silent, seemed to echo the urgency of their situation. The truth was out there, hidden behind the facade of civility, waiting to be uncovered.
--- END PRIOR CHAPTER 1 ---

--- BEGIN PRIOR CHAPTER 2 ---
Title: Chapter 2: Witness Statements
The late morning light filtered through the dining room windows, casting a muted glow across the table laden with remnants of breakfast. Outside, the rain continued to fall, creating a rhythmic patter that echoed the tension within. Eleanor Voss stood at the head of the table, her heart racing as she glanced at the clock on the wall. The knowledge that the victim had died no later than ten minutes past eleven loomed over them, casting a shadow of suspicion on every word exchanged. She felt a chill creep up her spine, the weight of the situation pressing down on her. The air was thick with a mix of anxiety and suspicion as the guests prepared to recount their movements during the party, each one a potential suspect in a web of deceit.

As Eleanor took a deep breath, she motioned for the others to begin. "Let us start with you, Captain Hale. Where were you when Eleanor was last seen?" Her voice was steady, but inside, she felt the tremors of uncertainty. Hale’s brow furrowed as she leaned back slightly, crossing her arms defensively. "I was with Beatrice in the drawing room, discussing the latest developments in the estate. We were quite engrossed in conversation, I assure you," she replied, her tone firm yet lacking the warmth of sincerity. Beatrice nodded in agreement, her wide eyes darting between Eleanor and Hale as if seeking reassurance.

Eleanor noted the way Beatrice clutched the edge of the table, her knuckles white against the polished wood. "And what about you, Dr. Finch?" Eleanor asked, turning her gaze to the doctor, who stood slightly apart from the others, her expression unreadable. Mallory shifted uncomfortably, her fingers brushing against the pages of a book she had been holding. "I was in the library, cataloguing some artifacts. I lost track of time, but I can assure you I was not present in the drawing room during that period," Dr. Finch replied, her voice steady but tinged with an undercurrent of anxiety. Eleanor felt a flicker of doubt rise within her; the time displayed was inconsistent with witness accounts of when Eleanor was last seen.

The clock on the wall showed ten minutes past eleven, a grim reminder of the moment everything had changed. Eleanor's mind raced as she connected the dots. If Dr. Finch had indeed been in the library, it contradicted the timeline of events. She could not shake the feeling that the doctor was hiding something, and the tension in the room thickened as the implications of their statements began to settle. Each guest's story seemed to contradict the others, creating a tangled web of alibis that left her feeling increasingly uneasy. The conflicting accounts of the suspects regarding their whereabouts only served to heighten her suspicions.

Eleanor glanced at Hale and Beatrice, who exchanged a brief look of understanding, and then back to Dr. Finch, whose expression remained inscrutable. "You must understand, Dr. Finch, that we need clarity. Your alibi is vague at best. If you were in the library, how could you have lost track of time?" she pressed, her voice firm. Mallory's eyes narrowed slightly, and she took a step closer, her posture tense. "I assure you, I was focused on my work. The clock in the library is not reliable; it often runs slow," she countered, but Eleanor could see the flicker of uncertainty in her gaze.

As the conversation continued, Eleanor felt a knot tightening in her stomach. The rain outside intensified, matching the rising tension within the room. The clock's hands seemed to mock them, frozen in time while their lives spiraled into chaos. She could not help but wonder what secrets lay behind each carefully crafted story. The stakes were high, and with every passing moment, the truth felt increasingly elusive. The atmosphere was heavy with unspoken accusations, and Eleanor knew they were racing against time to uncover the truth before it slipped through their fingers like the rain running down the windowpanes.

Finally, Eleanor took a deep breath and addressed the group. "We must be honest with one another. If we are to find out what truly happened to Eleanor, we cannot afford to hide behind half-truths or misdirection. Each of us has a part to play in this tragedy, and it is only by confronting our fears that we can hope to find the answers we seek," she declared, her voice steady despite the turmoil inside her. The others nodded, their expressions reflecting a mix of fear and determination. In that moment, they became united by a common goal: to find the truth, no matter how painful it might be. As the clock continued to tick, Eleanor felt a renewed sense of purpose. They would uncover the secrets hidden within the manor, and she would not rest until justice was served.
--- END PRIOR CHAPTER 2 ---

--- BEGIN PRIOR CHAPTER 3 ---
Title: Chapter 3: Temperature Readings
The early afternoon light struggled to penetrate the thick clouds, casting a muted glow across the drawing room. Outside, the rain continued its steady rhythm, a backdrop to the tension that filled the air. Eleanor Voss stood near the mantelpiece, her heart racing as she focused on the clock that had become the center of their investigation. The soft glow of candlelight flickered, illuminating the faces of her companions as they gathered, their expressions a mix of anxiety and determination. The scent of damp wood and wax mingled in the air, creating an atmosphere that felt both festive and tense, a stark contrast to the grim reality they faced. As she leaned closer to the clock, she noticed a slight smudge on the clock face, suggesting recent handling.

Eleanor's brow furrowed as she examined the clock more closely. The smudge indicated someone adjusted the clock shortly before the murder. This revelation sent a chill down her spine; it implied a deliberate act of deception. Who among them could have been so brazen as to manipulate the very instrument that marked the time of death? The implications were unsettling, and she felt the weight of suspicion settle heavily on her shoulders. The clock's hands were wound back to mislead witnesses about the time of death, a calculated move that hinted at premeditation. Eleanor could not help but wonder how many others had noticed this detail and chosen to ignore it, or worse, how many had been complicit in the act.

As she straightened up, Eleanor's gaze shifted to the room itself, taking in the details that might hold further clues. The temperature in the room was uncomfortably warm, and she noted that it registered at eighty-five degrees Fahrenheit. This contradicted the claimed time of death, raising further questions about the timeline presented by the witnesses. If Eleanor had died at ten minutes past eleven, as the clock suggested, the room should have been cooler. The discrepancy gnawed at her, intensifying her resolve to uncover the truth. It was becoming increasingly clear that the accounts provided by the guests were riddled with inconsistencies, each one a potential thread leading to the heart of the mystery.

Eleanor turned to Dr. Finch, who had been standing quietly by the window, her expression inscrutable. "Dr. Finch, do you recall the temperature in the library when you were cataloguing artifacts?" she asked, her voice steady yet probing. Mallory hesitated, her brow furrowing as she considered the question. "I didn't pay much attention to the temperature, but it felt comfortable enough for working. Why do you ask?" There was a hint of defensiveness in her tone, and Eleanor sensed an opportunity to press further. "Because the warmth in this room contradicts the time of death as indicated by the clock. If Eleanor was indeed murdered at ten minutes past eleven, we should be looking at a cooler environment. Instead, we have this heat that suggests something else entirely. What do you think that means?"

Dr. Finch's eyes widened slightly, and she shifted her weight from one foot to the other, a subtle sign of discomfort. "It could simply be that the heating was left on too long, or perhaps the room was not ventilated properly. We can't jump to conclusions without more evidence," she replied, her voice betraying a hint of anxiety. Eleanor noted the way Mallory's hands trembled slightly, an unconscious admission of the pressure bearing down on her. The tension in the room was palpable, each guest acutely aware of the stakes involved. They were not just witnesses; they were potential suspects, each with their own motives and secrets.

As the rain continued to patter against the window, Eleanor felt a sense of urgency wash over her. They needed to unravel the truth before it slipped through their fingers like the water running down the panes. "We must be thorough in our examination of every detail," she said, her voice firm. "The clock, the temperature, the accounts of each of you—everything must be scrutinized. We cannot afford to overlook anything that might lead us to the truth. If we are to find justice for Eleanor, we must confront the uncomfortable realities that lie ahead."

The others nodded, their expressions reflecting a mix of fear and determination. In that moment, Eleanor felt a renewed sense of purpose. They would uncover the secrets hidden within the manor, and she would not rest until justice was served. As she glanced once more at the clock, the weight of its presence felt heavier than ever. The knowledge that the victim had died no later than ten minutes past eleven loomed over them, casting a shadow of suspicion on every word exchanged. The clock was not merely a timepiece; it was a witness to the crime, and Eleanor was determined to ensure it would not remain silent.
--- END PRIOR CHAPTER 3 ---

--- BEGIN PRIOR CHAPTER 4 ---
Title: Chapter 4: Interrogating Beatrice
The afternoon air was thick with the scent of damp earth and blooming flowers, a stark contrast to the tension that loomed over the garden. Eleanor Voss stood beneath the archway of climbing roses, their vibrant colors dulled by the persistent drizzle that had settled over Little Middleton. The soft patter of rain on the petals mirrored her racing thoughts, each drop a reminder of the urgency to uncover the truth behind Eleanor's murder. Her heart pounded as she prepared to confront Beatrice Quill, whose evasive demeanor had raised suspicions during their earlier discussions. The garden, once a place of solace, now felt like a stage for revelations that could shatter the fragile peace among the guests.

Eleanor spotted Beatrice wandering near the flowerbeds, her fingers brushing against the petals as if seeking comfort in their softness. Beatrice's eyes flickered with regret, a fleeting moment that did not go unnoticed by Eleanor. The last conversation they had shared echoed in Eleanor's mind, filled with laughter that now felt hollow. "Beatrice," Eleanor called, her voice steady yet laced with an underlying tension. Beatrice turned, her expression shifting from surprise to apprehension as she approached. "I need to talk to you about Eleanor," Eleanor continued, her tone firm but gentle. "We cannot afford to hide behind half-truths any longer. Your relationship with her is crucial to understanding what happened."

Beatrice's gaze fell to the ground, her fingers stilling against the blooms. "What do you mean?" she asked, her voice barely above a whisper. Eleanor stepped closer, sensing the weight of unspoken emotions hanging in the air. "I know you were close to her. You must have known something about her plans, her thoughts on the inheritance she left behind. Did you believe you would inherit a significant sum?" The question hung between them, heavy with implications. Beatrice's eyes darted away, and Eleanor noted the slight tremor in her hands. It was a telltale sign of her unease, a crack in the facade she had carefully constructed.

"I... I didn’t think about it much," Beatrice stammered, her voice wavering. "Eleanor was generous, but I never expected anything in return. We were friends, after all." Eleanor studied her closely, searching for any hint of deception. The way Beatrice hesitated, the way her brow furrowed in thought, suggested otherwise. "Friends? Or perhaps something more?" Eleanor pressed, her curiosity piqued. Beatrice's cheeks flushed, and she glanced at the flowers again, as if they might provide an escape from the uncomfortable truth. "We had our moments, but it was complicated. Eleanor had her own burdens to bear, and I... I didn’t want to add to them."

Eleanor felt a surge of frustration. "Complicated how? You must understand that your feelings, your motives, could be key to this investigation. If you believed you would inherit from her, that changes everything. You need to be honest with me, Beatrice." The tension in the air thickened, and Beatrice's expression shifted from regret to something more guarded. "I don’t know what you want me to say, Eleanor. I cared for her, but I also had my own struggles. The world is not kind to those of us who seek more than what we have. I never wished her harm, I swear it!"

Eleanor took a step back, allowing Beatrice's words to settle. The garden, with its vibrant colors and fragrant blooms, felt suffocating in its beauty. The contrast between the serene setting and the turmoil of their conversation was unsettling. "I believe you, Beatrice, but your evasiveness raises questions. You must understand that every detail matters, especially with the clock showing ten minutes past eleven when Eleanor was last seen. The time of her death was manipulated, and I need to know if you had any part in that. Did you see anything unusual?"

As Beatrice hesitated, Eleanor's thoughts drifted to the clock once more. Just before this conversation, she had noticed something troubling. In the study, while examining the clock, she had discovered a subtle yet telling detail. The mechanism had been tampered with. "Direct evidence ties Dr. Finch to the mechanism access point before the discriminating test," she recalled, the implications of that observation weighing heavily on her mind. This direct evidence showed Dr. Finch had means and opportunity, narrowing the solution uniquely toward the culprit. Eleanor felt a chill run down her spine as she considered how this could connect to Beatrice's own motives.

Beatrice's eyes widened, and for a moment, Eleanor thought she might break. But then, the mask returned, and Beatrice shook her head. "I was in the drawing room with Captain Hale. We were discussing the estate, nothing more. I didn’t notice anything out of the ordinary. I swear it!" Her voice was desperate, pleading for belief. Eleanor studied her, the weight of their shared history pressing down on them both. Beatrice had lost a friend, but Eleanor had lost more than that; she had lost a chance for justice if they could not uncover the truth together.

As they stood in the garden, the rain began to lighten, and a faint glow of sunlight broke through the clouds, casting a delicate warmth over the scene. Eleanor took a breath, hoping to ease the tension. "Perhaps we can find a way to work together, Beatrice. I know this is difficult, but we must uncover what truly happened to Eleanor. If we can piece together the fragments of her life, we might just find the answers we seek." Beatrice nodded slowly, her expression softening as she considered Eleanor's words. "I want that too, but I’m terrified of what we might uncover. What if it leads back to me?"

Eleanor placed a reassuring hand on Beatrice's shoulder. "We will face it together. Whatever the truth may be, we must confront it head-on. I promise you, I will not let fear dictate our actions. We owe it to Eleanor to find out what really happened." With a newfound determination, Eleanor felt the weight of the garden shift. The flowers, once a source of comfort, now felt like witnesses to their shared resolve. They would not allow Eleanor's memory to fade in the shadows of doubt and suspicion. Together, they would uncover the secrets hidden within the manor, and Eleanor would not rest until justice was served.
--- END PRIOR CHAPTER 4 ---

--- BEGIN PRIOR CHAPTER 5 ---
Title: Chapter 5: Confronting Captain Hale
As the late afternoon light dimmed and shadows crept across the study, the air felt thick with the weight of unspoken truths. Eleanor Voss stood by the heavy oak desk, papers scattered in disarray, remnants of previous inquiries. The ticking of the clock marked the passing minutes, a constant reminder of the urgency that pressed upon her. Outside, the rain continued its relentless drumming against the window, echoing the tension that filled the room. Captain Hale was seated across from her, her posture rigid, eyes betraying a flicker of unease as she regarded her with a guarded expression.

Eleanor's thoughts raced back to the previous conversations, the subtle hints of deception that had begun to surface. She recalled the way Captain Hale had spoken about her whereabouts during the party, a narrative that felt too neatly constructed. 'Captain Hale,' she began, her voice steady but firm, 'I need to understand your alibi more clearly. You mentioned being in the drawing room, yet I have reason to believe your timeline may not align with the events surrounding Eleanor's death.'

Hale's fingers twitched slightly as she leaned back in her chair, a defensive gesture that did not go unnoticed. 'I assure you, I was with Beatrice. We were discussing the estate, nothing more,' she replied, her tone calm but laced with an undercurrent of tension. Eleanor leaned forward, studying her intently. 'And yet, there are inconsistencies in your account. If you were indeed in the drawing room, how did you manage to miss the commotion that followed Eleanor's passing?'

The flicker of uncertainty in Hale's eyes deepened, and Eleanor pressed on. 'You see, the clock showed ten minutes past eleven when Eleanor was last seen. If you were present during that time, how could you have been so unaware of what transpired? The evidence suggests that the room was much warmer than it should have been if the murder occurred at that time.' She paused, allowing the implications of her words to sink in. 'The temperature was recorded at eighty-five degrees Fahrenheit, which contradicts the timeline we have been given.'

Hale's expression shifted, and she straightened in her seat, a hint of defiance creeping into her demeanor. 'Perhaps the heating was left on too long, or the room was not ventilated properly. We cannot jump to conclusions without more evidence,' she countered, but Eleanor could sense the cracks in her facade. She noted how her fingers fidgeted, betraying the calm she attempted to project. 'That may be true, but we must consider all possibilities. The warmth in the room, combined with your vague alibi, raises significant questions.'

Eleanor felt the tension in the air thicken as she continued her line of questioning. 'You have a reputation to uphold, Captain Hale. A family legacy that you are desperate to protect. Could that desperation lead you to conceal the truth about your whereabouts? What if you had a motive tied to your family's honor?' She watched as her jaw clenched, the muscles working beneath the surface. Her calm demeanor was beginning to unravel, and she pressed her advantage. 'I need you to be honest with me. If you know something, now is the time to share it.'

For a moment, silence enveloped them, punctuated only by the ticking clock. Hale's gaze dropped to the desk, and Eleanor could see the internal struggle playing out behind her eyes. 'I was there, yes. But I did not harm Eleanor. I would never—' she began, but Eleanor interrupted, her voice rising slightly. 'You were seen at the party during the time of the murder, Captain. Your alibi is questionable, and you must understand that I am not accusing you without reason. But the evidence does not lie.'

Hale's expression hardened, and she met her gaze with a fierce intensity. 'I do not appreciate being cornered like this, Eleanor. You are grasping at straws. I was with Beatrice, and you know it. I had no reason to harm Eleanor, and I would never betray my family in such a way.' Her voice was steady, but the underlying tension hinted at a deeper turmoil. Eleanor sensed that beneath her bravado lay a man grappling with her own fears and insecurities.

Eleanor took a deep breath, grounding herself in the moment. 'I understand that this is difficult, Captain. But we cannot afford to let emotions cloud our judgment. If we are to uncover the truth behind Eleanor's death, we must confront the uncomfortable realities that lie ahead. I need your cooperation, and I need you to be honest with me.'

As she spoke, the rain outside began to lighten, and the shadows in the study shifted slightly, as if the very room was holding its breath. Hale's expression softened for a fleeting moment, and she saw a glimpse of vulnerability. 'I never wanted any of this. My family's honor is at stake, and I fear what the truth may reveal,' she admitted, her voice barely above a whisper. Eleanor nodded, recognizing the weight of her words. 'We all have our burdens to bear, Captain. But we owe it to Eleanor to find out what really happened. Together, we can face whatever lies ahead.'

In that moment, the tension in the room began to ease, if only slightly. Eleanor felt a flicker of hope that perhaps, just perhaps, they could navigate the treacherous waters of this investigation together. As the clock continued its relentless ticking, she knew that time was of the essence, and they were running out of it. The truth awaited them, hidden beneath layers of deception, and she would not rest until it was uncovered.
--- END PRIOR CHAPTER 5 ---

--- BEGIN PRIOR CHAPTER 6 ---
Title: Chapter 6: Analysis of the Clock
The evening settled over Little Middleton, the rain still drumming softly against the windows, creating a soothing yet ominous backdrop. In the drawing room, the clock's ticking echoed in the silence, each tick a reminder of the urgency that pressed upon Eleanor Voss. She stood before the mantelpiece, her heart racing as she focused on the clock that had become the center of their investigation. Shadows danced on the walls, cast by the flickering candlelight, illuminating the faces of her companions as they gathered, their expressions a mix of anxiety and determination. Eleanor leaned closer, her breath catching as she noticed a smudge on the clock face, a sign of recent handling. This small detail ignited a spark of dread within her, suggesting that someone had tampered with the clock shortly before the murder.

Eleanor's brow furrowed as she examined the clock more closely. The smudge indicated someone had adjusted the clock, which could mislead witnesses about the time of death. Who among them could have been so brazen as to manipulate the very instrument that marked the moment of Eleanor's demise? The implications were unsettling, and she felt the weight of suspicion settle heavily on her shoulders. The clock's hands were wound back to mislead witnesses about the time of death, a calculated move that hinted at premeditation. Eleanor could not help but wonder how many others had noticed this detail and chosen to ignore it, or worse, how many had been complicit in the act.

As she straightened up, Eleanor's gaze shifted to Dr. Finch, who had been standing quietly by the window, her expression inscrutable. Mallory had always been a source of comfort for Eleanor, yet now, she felt a growing unease around the doctor. 'Dr. Finch, can you tell me what you remember about the temperature in the library when you were cataloguing artifacts?' Eleanor asked, her voice steady yet probing. Mallory hesitated, her brow furrowing as she considered the question. 'I didn't pay much attention to the temperature, but it felt comfortable enough for working. Why do you ask?' There was a hint of defensiveness in her tone, and Eleanor sensed an opportunity to press further.

'Because the warmth in this room contradicts the time of death as indicated by the clock. If Eleanor was indeed murdered at ten minutes past eleven, as the clock suggests, we should be looking at a cooler environment. Instead, we have this heat that suggests something else entirely. What do you think that means?' Eleanor's eyes narrowed as she watched Mallory's reaction. The doctor shifted her weight from one foot to the other, a subtle sign of discomfort. 'It could simply be that the heating was left on too long, or perhaps the room was not ventilated properly. We can't jump to conclusions without more evidence,' she replied, her voice betraying a hint of anxiety.

The tension in the room thickened as Eleanor continued to scrutinize Mallory. 'But the clock shows ten minutes past eleven when Eleanor was last seen. If you were in the library, how could you have lost track of time?' Eleanor pressed, her voice firm. Mallory's eyes widened slightly, and she took a step closer, her posture tense. 'I assure you, I was focused on my work. The clock in the library is not reliable; it often runs slow,' she countered, but Eleanor could see the flicker of uncertainty in her gaze. The conflicting accounts of the suspects regarding their whereabouts only served to heighten her suspicions. Each guest's story seemed to contradict the others, creating a tangled web of alibis that left her feeling increasingly uneasy.

Eleanor took a deep breath, grounding herself in the moment. 'We must be thorough in our examination of every detail,' she said, her voice firm. 'The clock, the temperature, the accounts of each of you—everything must be scrutinized. We cannot afford to overlook anything that might lead us to the truth. If we are to find justice for Eleanor, we must confront the uncomfortable realities that lie ahead.' The others nodded, their expressions reflecting a mix of fear and determination. In that moment, Eleanor felt a renewed sense of purpose. They would uncover the secrets hidden within the manor, and she would not rest until justice was served.

As Eleanor glanced once more at the clock, the weight of its presence felt heavier than ever. The knowledge that the victim had died no later than ten minutes past eleven loomed over them, casting a shadow of suspicion on every word exchanged. The clock was not merely a timepiece; it was a witness to the crime, and Eleanor was determined to ensure it would not remain silent. 'This smudge,' she murmured, her finger tracing the outline of the mark on the clock face, 'indicates that someone had access to this clock shortly before the murder. We need to find out who that was.' Mallory's expression shifted, and Eleanor could see the tension in her shoulders as she processed this revelation.

'If the clock was tampered with, it raises significant questions about the timeline we have been given,' Eleanor continued, her voice steady. 'We must consider all possibilities. The warmth in the room, combined with your vague alibi, raises significant questions. I need you to be honest with me, Dr. Finch. If you know something, now is the time to share it.' Mallory's gaze dropped to the floor, and Eleanor could see the internal struggle playing out behind her eyes. 'I was there, yes. But I did not harm Eleanor. I would never—' she began, but Eleanor interrupted, her voice rising slightly. 'You were seen at the party during the time of the murder, Dr. Finch. Your alibi is questionable, and you must understand that I am not accusing you without reason. But the evidence does not lie.'
--- END PRIOR CHAPTER 6 ---

[SCENE COMPLETENESS CONTRACTS — MANDATORY. Each contract below lists what you MUST enact in that chapter. Do not summarise or mention these labels in the prose — enact them organically.]
Chapter 7 (Act 2) completeness contract:
  PIVOT ELEMENT (MANDATORY — write this into the prose, shown not told): "The comparison of the clock's time and room temperature."
  FACT ESTABLISHED (MANDATORY — reader must know this by chapter end): "Establishes that the clock was wound back to mislead witnesses about the time of death, contradicting the alibis."

# Case Overview
Title: The Clock's Deceit
Era: 1930s
Setting: Little Middleton
Crime: murder (poisoning)
Culprit: Dr. Mallory Finch
False assumption: The murder must have occurred during the party when all guests were present.
Cast: Eleanor Voss (she/her), Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill

Setting Lock: Keep all scenes and descriptions consistent with the stated setting (Little Middleton). Do not introduce a different location type.

Outline scenes:
[
  {
    "sceneNumber": 7,
    "act": 2,
    "title": "Discriminating Test",
    "setting": {
      "location": "the drawing room",
      "timeOfDay": "Night",
      "atmosphere": "Tense, with the weight of the evidence hanging in the air."
    },
    "characters": [
      "Eleanor Voss",
      "Dr. Mallory Finch",
      "Captain Ivor Hale",
      "Beatrice Quill"
    ],
    "purpose": "Execute the discriminating test to reveal the truth.",
    "cluesRevealed": [
      "clue_9"
    ],
    "dramaticElements": {
      "conflict": "The truth of the clock's tampering is at stake.",
      "tension": "The guests are on edge as Eleanor prepares to reveal her findings.",
      "microMomentBeats": [
        "Eleanor's heart pounds as she prepares to confront the suspects with her conclusions."
      ]
    },
    "summary": "Eleanor gathers the suspects in the drawing room to reveal her findings. She compares the time indicated on the clock with the room's temperature, demonstrating that the clock was tampered with to mislead witnesses about the time of death.",
    "estimatedWordCount": 1800,
    "pivotElement": "The comparison of the clock's time and room temperature.",
    "factEstablished": "Establishes that the clock was wound back to mislead witnesses about the time of death, contradicting the alibis.",
    "permittedBehavioursByAct": [
      {
        "characterName": "Eleanor Voss",
        "behaviour": "may show unease, evasion, or mild defensiveness when questioned"
      },
      {
        "characterName": "Dr. Mallory Finch",
        "behaviour": "may show unease, evasion, or mild defensiveness when questioned"
      },
      {
        "characterName": "Captain Ivor Hale",
        "behaviour": "may show unease, evasion, or mild defensiveness when questioned"
      },
      {
        "characterName": "Beatrice Quill",
        "behaviour": "may show unease, evasion, or mild defensiveness when questioned"
      }
    ],
    "redHerringPlacement": null,
    "emotionalRegister": "The mounting pressure leads to a confrontation that reveals the depths of deception.",
    "dominantCharacterNote": {
      "name": "Eleanor Voss",
      "voiceRegister": "Eleanor speaks with a measured tone, often punctuating her insights with historical references."
    },
    "humourGuidance": {
      "permission": "forbidden"
    },
    "eraTextureNote": "Limited public transportation options affecting mobility.; Rationing of goods leading to scarcity in supplies.; Communication hampered by outdated technology, such as rotary phones.; Weather restrictions, with overcast skies and rain limiting outdoor activities.; Travel restrictions due to economic conditions and social class.",
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
□ First chapter in this batch opens by continuing the previous chapter closing beat (same unresolved object, question, movement, or emotional pressure).
□ PRONOUN AUDIT — for every character you named in your chapters, list the pronouns you actually used, then verify against the canonical table. Correct any mismatch before outputting. Do NOT include this audit in your JSON output.
  Character            | Canonical     | Used in draft | Match?
  ---------------------|---------------|---------------|-------
  Eleanor Voss         | she/her/her/herself       | [fill in]     | [yes/no]
□ Return valid JSON only.
```
