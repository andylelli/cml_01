# Actual Prompt Record

- Run ID: `mystery-1778961356552`
- Project ID: ``
- Timestamp: `2026-05-16T20:00:26.387Z`
- Agent: `Agent9-ProseGenerator-Ch3`
- Operation: `chat_request_full_prompt`
- Model: `GPT-4o-mini`
- Temperature: `0.42`
- Max Tokens: `4500`
- Attempt: `first`
- Prompt Hash: `bed4c18f60628e9c`

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
- MORAL COMPLEXITY REQUIREMENT: The mechanism of this crime carries a moral gray area: "The culprit may have acted out of desperation to protect a loved one from the victim's cruelty." — the culprit reveal and denouement MUST acknowledge this ambiguity. Do not let the ending feel clean or simple. Give the reader at least one moment of uncomfortable sympathy or moral doubt.


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

## Era: 1935-05
In May 1935, England is marked by the lingering shadows of the Great Depression, where class tensions intensify as the wealthy gather in isolation while the less fortunate suffer. The streets are filled with the murmurs of discontent, with unemployment still high, particularly among the youth. Each day is a balancing act for many families as they navigate the rising costs of living, with small luxuries slipping further from reach. The manor's grand gatherings juxtapose the stark realities outside, where the scent of blooming lilacs mingles with the damp earth of recent rains, showcasing a society clinging to its former grandeur. The long daylight hours invite social gatherings, yet the underlying fears of economic instability and class conflict simmer just beneath the surface, making each interaction a potential flashpoint.
Emotional register: A pervasive sense of unease and anticipation fills the air as societal pressures mount.
Physical constraints: Limited access to transportation for many due to economic strain | Communication mostly through letters or landline telephones | Social gatherings dictated by strict etiquette and formal invitations
Current tensions (weave into background texture): Unrest over unemployment and labor rights | Class conflict intensifying at social gatherings | Public debates about social welfare
Wartime context — Many men have returned from service, struggling to find their place in a changed society.: The community grapples with the hardships of the Depression while trying to maintain social decorum. Absence effect: The absence of soldiers creates a void in social dynamics, leaving families to navigate their own social standings.

## Story Theme
Amidst the class tensions of the Great Depression, a murder at Little Middleton Manor reveals the fragility of reputation and the lengths individuals will go to protect their secrets.

## Story Emotional Register
Dominant: The journey is one of unease and revelation, where the tension builds steadily until the final confrontation.

Arc:
The story begins with an air of dread as a storm brews outside Little Middleton Manor, setting the stage for a murder that disrupts the fragile peace. The initial crime sends shockwaves through the gathering, as Eleanor Voss, the unassuming detective, grapples with the weight of her family's reputation amidst the chaos. As she delves into the investigation, unease rises—each clue she uncovers leads her deeper into a web of deception, where false leads threaten to derail her pursuit of justice. The emotional cost weighs heavily on her, as she confronts her own doubts and the secrets of her past.

A pivotal moment occurs when Eleanor discovers the tampered clock, which shifts her focus and implicates those she thought she could trust. With the realization that the clock misrepresents the time of death, the investigation takes a new turn, forcing Eleanor to reevaluate her assumptions and question the motives of her fellow guests. The tension mounts as she unravels a deeper conspiracy, revealing connections that cast a shadow over each character's alibi.

As the climax approaches, pressure builds—Eleanor confronts the suspects armed with newfound evidence, the stakes rising as the truth inches closer to the surface. In a tense confrontation, she exposes the clock's manipulation, leading to the unraveling of the murderer’s motives. The resolution leaves a bittersweet taste; while justice is served, each character bears the emotional scars of their choices. Eleanor realizes that the truth, once revealed, comes at a price, forever altering the delicate balance of their lives and leaving her to ponder the cost of uncovering hidden truths.

## Emotional register at this point in the story
Unease rises with each clue, revealing the complexity of motives among the guests.

## Character Portraits (appearance & era)

### Eleanor Voss
Eleanor Voss epitomizes the fading elegance of a bygone era, trapped within the walls of her once-grand estate. The weight of her family's reputation weighs heavily on her, as the Great Depression strips away the facade of wealth and status. She navigates social gatherings with a charm that belies the turmoil beneath, desperately clinging to the remnants of her social standing while grappling with the ever-looming threat of scandal.
Era intersection: Her struggles with reputation reflect the broader societal collapse of the 1930s, where wealth and class distinctions are increasingly scrutinized.

### Dr. Mallory Finch
Dr. Mallory Finch stands as a beacon of hope amidst the despair of the Great Depression, driven by her commitment to the community's welfare. As a dedicated country doctor, she feels the frustration of a system that often ignores the plight of the less fortunate. Her resentment toward the privileged class fuels her resolve to uncover the truth behind the murder, as the economic divide continues to widen.
Era intersection: Her fight against social inequities mirrors the growing unrest and desire for social reform of the 1930s.

### Captain Ivor Hale
Captain Ivor Hale is a relic of a past filled with honor and valor, yet the specter of guilt shadows his dignified presence. The pressures of the Great Depression weigh on him as he strives to maintain his reputation in a world that now questions the worth of old societal values. His fears of exposure reflect the broader anxieties of a society grappling with its identity amidst economic turmoil.
Era intersection: His internal conflict highlights the tensions of a generation grappling with the consequences of war and economic collapse.

### Beatrice Quill
Beatrice Quill embodies the youthful ambition of a new generation, eager to carve out her place in a world still dominated by class distinctions. As a journalist, she seeks to expose the truths hidden beneath the surface of society, her drive for success clashing with the ethical dilemmas posed by the Great Depression. The murder investigation offers her both opportunity and moral conflict.
Era intersection: Her ambition reflects the changing roles of women in the 1930s, as they begin to challenge societal norms in their pursuit of independence.

## Character Voices

### Eleanor Voss (she/her/her)
Her voice carries a genteel formality, often laced with a soft, knowing laugh that hints at her awareness of the absurdities around her.
[comfortable] Ah, but isn't that just the way of things? One moment you're at the top, and the next, you're picking up the pieces.
[evasive] I simply cannot recall the details of that night—too many guests, you know how it is.
[stressed] This whole affair could ruin us! We must keep our heads and not let the rumors seep out!
Humour: Her polite savagery often surfaces in conversations, providing a sharp contrast to the tension around her.

### Dr. Mallory Finch (she/her/her)
Dr. Finch speaks with clipped precision, her tone reflecting her professional demeanor and sharp wit.
[comfortable] It's fascinating how the elite can afford to ignore the suffering of those around them.
[evasive] I really don't think my movements have any bearing on this case. I was merely doing my duty.
[stressed] How can they be so blind? Every day, I see the consequences of their indifference!
Humour: Her dry wit often serves as a shield against the condescension she faces from the upper class.

### Captain Ivor Hale (he/him/his)
Captain Hale's voice is formal and authoritative, steeped in military jargon, rarely straying from his stoic demeanor.
[comfortable] A captain must always remain vigilant, even in the face of adversity.
[evasive] My actions that night were simply part of my duties—nothing more.
[stressed] I cannot afford any more whispers about my past; I must protect my honor!
Humour: He rarely indulges in humor, focusing instead on maintaining his stoic presence.

### Beatrice Quill (she/her/her)
Beatrice's speech is quick and energetic, often punctuated by sharp wit and a playful tone.
[comfortable] In a town full of secrets, every story is just waiting to be uncovered.
[evasive] Oh, I was merely speaking to staff—nothing of importance, I assure you.
[stressed] This is my chance for a big break! I can't let it slip away!
Humour: Her sardonic humor often highlights the absurdities of high society.

## Location Registers (scene framing guides)

The Drawing Room: The drawing room feels heavy with unspoken words and secrets, where every flickering candle casts shadows that hide more than they reveal. Guests tread carefully, each aware that the room holds the weight of recent tragedy, transforming their laughter into strained whispers.. Camera angle: As a writer enters this space, a sense of foreboding looms large, where the past's echoes seem to linger in the air.. Era: The grand setting reflects the opulence of pre-Depression wealth, now tainted by the fear of exposure and scandal.

The Library: The library emanates a quiet tension, where the dust of forgotten knowledge hangs in the air. Guests move through the shelves as if searching for answers, the silence broken only by the rustle of pages turning, each sound a reminder of the secrets that lie within.. Camera angle: Entering this space evokes a sense of curiosity and intrigue, inviting exploration of hidden truths.. Era: This sanctuary of knowledge stands in stark contrast to the chaos of the outside world, a reminder of the society's intellectual pursuits amidst economic despair.

The Attic: The attic is a realm of shadows and memories, where the air is thick with the scent of age and neglect. Each creak of the floorboards speaks of forgotten stories, creating a sense of claustrophobic tension as the past threatens to spill into the present.. Camera angle: Stepping into this space evokes a sense of trepidation, as if the very walls are waiting to reveal their secrets.. Era: The forgotten treasures within reflect a society grappling with its history, as the weight of the past looms over the present.

The Gardens: The gardens are a haunting blend of beauty and decay, where the once-vibrant flowers struggle against the encroaching gloom. The air is filled with the scent of damp earth and fading blooms, creating a melancholic atmosphere that mirrors the characters' internal conflicts.. Camera angle: As a writer traverses this space, a reflective mood prevails, inviting contemplation of the characters' hidden motives.. Era: The overgrown hedges symbolize the neglected dreams of a society grappling with class disparities.

## Humour guidance for this story position (early)
Permission: permitted
Characters who may be funny: Eleanor Voss
Permitted forms: ironic commentary
Rationale: Eleanor uses irony to cope with the tension of the investigation.

## Reveal Groundwork (texture — do not explain, only plant)
- Plant one subtle observable beat related to: "When Eleanor discovers the tampered clock, it shifts her focus and deepens the mystery, revealing the complexity of motives among the guests". Do not explain significance yet.
- Plant one subtle observable beat related to: "Finch's frustrations during the investigation hint at a deeper conflict between the classes, foreshadowing the tensions that will erupt later". Do not explain significance yet.
- Plant one subtle observable beat related to: "The final confrontation with the hidden-truth reveals how each character's secrets are intertwined, reshaping their relationships and the power dynamics at play". Do not explain significance yet.

FAIR-PLAY AND INFERENCE CONTRACT (from CML logic):
- False assumption in force: The victim must have been killed at the time indicated by the wall clock.
- Hidden truth to progressively expose: The clock was tampered with to misrepresent the actual time of death.
- Inference path checkpoints to dramatize clearly (observation -> correction -> effect):
  - Step 1: obs: A peculiar dust pattern is observed on the clock face. | corr: The dust indicates that the clock has been handled recently, suggesting tampering. | effect: Narrows suspicion to individuals with access to the clock.
  - Step 2: obs: The clock shows a time inconsistent with the guests' accounts of the victim’s last sighting. | corr: This inconsistency suggests that either the clock is faulty or has been altered to mislead. | effect: Eliminates the reliability of the clock as a witness to time.
  - Step 3: obs: A faint scratch is found on the winding mechanism of the clock. | corr: The scratch indicates recent tampering, confirming that the clock has been manipulated. | effect: Narrows down the potential suspects to those who had access to the clock.
- Discriminating test method: trap
- Discriminating test design constraint: A controlled reenactment where the clock's tampering is demonstrated, revealing that the time shown could not align with the events described by witnesses.
- Test must rely on already-shown clue IDs: clue_1, clue_2, clue_3, clue_5, clue_6
- Fair-play rationale: Step 1: The dust pattern and the incorrect pendulum movement indicate tampering. Step 2: The clock's time contradicts witness accounts. Step 3: The scratch confirms manipulation, leading to the conclusion that someone altered the clock.
- Never solve by withheld information. Keep reader-information parity with detective reasoning.

## Character Reference

### Eleanor Voss (she/her — NEVER he/him)
Her speech is laced with a genteel formality, often punctuated by a soft, knowing laugh
She possesses a penchant for ironic commentary, especially when discussing the absurdities of high society.
Eleanor wrestles with the shame of her husband's past indiscretions, fearing that exposure could unravel the fragile fabric of her social world.

### Dr. Mallory Finch (she/her — NEVER he/him)
Finch speaks with a clipped precision, her words carefully chosen like instruments in her practice
When she does employ humor, it is often laced with a sharpness that reflects her frustrations with societal inequities.
Dr. Finch grapples with a sense of futility in her efforts to address the healthcare disparities in her community, often feeling that her work goes unappreciated by those with power.

### Captain Ivor Hale (he/him — NEVER she/her)
Captain Hale speaks with a formal and authoritative tone, often punctuated by military jargon
His words are carefully chosen, reflecting the weight of his past decisions, and he rarely indulges in humor, preferring to maintain a stoic demeanor.
Captain Hale is haunted by memories of his past, grappling with the guilt of decisions that cost lives, and worries that the truth will come to light, shattering the image he has cultivated.

### Beatrice Quill (she/her — NEVER he/him)
Beatrice's speech is quick and energetic, often punctuated by sharp wit and a playful tone
She has a tendency to employ sarcasm, especially when discussing the absurdities of high society and her journalistic pursuits.
Beatrice struggles with the ethical implications of her ambition, caught between her desire for recognition and her growing awareness of the human cost of her investigations.


## CHARACTER CONTRACTS (binding for this scene)
Each entry below constrains how this character must be written in this chapter.
These override generic style guidance when they conflict.

### Eleanor Voss
Voice & mannerisms: Her speech is laced with a genteel formality, often punctuated by a soft, knowing laugh. She possesses a penchant for ironic commentary, especially when discussing the absurdities of high society.
Sample voice fragments (match this register and rhythm):
  [comfortable] "Ah, but isn't that just the way of things? One moment you're at the top, and the next, you're picking up the pieces."
  [evasive] "I simply cannot recall the details of that night—too many guests, you know how it is."
Humour: polite savagery — deploy occasionally (level 0.5)
FORBIDDEN phrase (never write for Eleanor Voss): "she felt a wave of unease"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Desires to protect her family's reputation from resurfacing secrets." — do not surface in Act I.

### Dr. Mallory Finch
Voice & mannerisms: Dr. Finch speaks with a clipped precision, her words carefully chosen like instruments in her practice. When she does employ humor, it is often laced with a sharpness that reflects her frustrations with societal inequities.
Sample voice fragments (match this register and rhythm):
  [comfortable] "It's fascinating how the elite can afford to ignore the suffering of those around them."
  [evasive] "I really don't think my movements have any bearing on this case. I was merely doing my duty."
Humour: dry wit — deploy occasionally (level 0.4)
FORBIDDEN phrase (never write for Dr. Mallory Finch): "a surge of determination washed over her"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Believes the victim was involved in covering up unethical practices in local healthcare." — do not surface in Act I.

### Captain Ivor Hale
Voice & mannerisms: Captain Hale speaks with a formal and authoritative tone, often punctuated by military jargon. His words are carefully chosen, reflecting the weight of his past decisions, and he rarely indulges in humor, preferring to maintain a stoic demeanor.
Sample voice fragments (match this register and rhythm):
  [comfortable] "A captain must always remain vigilant, even in the face of adversity."
  [evasive] "My actions that night were simply part of my duties—nothing more."
Humour: none — this character plays it straight in all scenes
FORBIDDEN phrase (never write for Captain Ivor Hale): "sighed deeply and felt a sense of peace"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Fears that the victim knows about his past and might reveal it, ruining his reputation." — do not surface in Act I.

### Beatrice Quill
Voice & mannerisms: Beatrice's speech is quick and energetic, often punctuated by sharp wit and a playful tone. She has a tendency to employ sarcasm, especially when discussing the absurdities of high society and her journalistic pursuits.
Sample voice fragments (match this register and rhythm):
  [comfortable] "In a town full of secrets, every story is just waiting to be uncovered."
  [evasive] "Oh, I was merely speaking to staff—nothing of importance, I assure you."
Humour: sardonic — deploy occasionally (level 0.6)
FORBIDDEN phrase (never write for Beatrice Quill): "palpable tension filled the room"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Seeks a big story to launch her career, potentially at the victim's expense." — do not surface in Act I.



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
An imposing country estate shrouded in secrets, where the tension between guests simmers beneath the surface.

Key Locations Available:
- The Drawing Room (interior): Crime scene
- The Library (interior): Clue discovery
- The Attic (interior): Hidden access point
- The Gardens (exterior): Isolation and reflection

Atmosphere: Tense due to recent events and underlying class conflicts among the guests.
Weather: Overcast with occasional rain showers, typical for the English countryside in autumn.

Era markers: Radio broadcasts in the drawing room | Typewriters in the study | Early home telephones in guest rooms

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
  - Visual: candlelight flickering on polished surfaces, rain-streaked windows, shadows creeping along the walls
  - Sounds: the crackle of a fire, soft murmurs of conversation, the ticking of a grand clock
  - Scents: beeswax candles, old leather, the faint aroma of damp earth
  - Touch: cool marble floor, soft velvet upholstery

The Library (interior):
  - Visual: dust motes dancing in the light, leather-bound books lining the shelves
  - Sounds: the soft rustle of pages turning, the faint tapping of a typewriter
  - Scents: old paper, polished wood, the musty scent of forgotten knowledge
  - Touch: smooth leather book covers, the coolness of the marble desk

The Attic (interior):
  - Visual: faded trunks stacked haphazardly, cobwebs draping the rafters
  - Sounds: the creak of floorboards, the whisper of the wind through cracks
  - Scents: musty air, the scent of aged wood, the faint odor of mothballs
  - Touch: rough wooden beams, the chill of the air

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

- In May 1935, England is marked by the lingering shadows of the Great Depression, where class tensions intensify as the wealthy gather in isolation while the less fortunate suffer
- The streets are filled with the murmurs of discontent, with unemployment still high, particularly among the youth
- Each day is a balancing act for many families as they navigate the rising costs of living, with small luxuries slipping further from reach
- The manor's grand gatherings juxtapose the stark realities outside, where the scent of blooming lilacs mingles with the damp earth of recent rains, showcasing a society clinging to its former grandeur
- The long daylight hours invite social gatherings, yet the underlying fears of economic instability and class conflict simmer just beneath the surface, making each interaction a potential flashpoint.

TEMPORAL CONTEXT:

This story takes place in May 1935 during spring.

Seasonal Atmosphere:
- Weather patterns: Overcast skies with occasional rain showers, Mild temperatures around 15°C (59°F), Fresh blooms in gardens and parks
- Daylight: Long days with sunset around 8:30 PM, providing ample daylight for evening gatherings
- Seasonal activities: Picnics in the countryside, Flower arranging for May Day celebrations, Outdoor tea parties
- Seasonal occasions: May Day (1st May), Mother's Day (in the UK, 12th May)
- Season: spring

Period Fashion (describe naturally):
- Men formal: Double-breasted suits in light fabrics, Bow ties or patterned neckties, Fedora hats
- Men casual: Cotton blazers, Tweed trousers, Button-down shirts with rolled-up sleeves
- Men accessories: Leather gloves, Pocket watches, Cufflinks
- Women formal: Tea-length dresses with floral patterns, Wide-brimmed hats adorned with ribbons, Elegant gloves
- Women casual: Lightweight cardigans, A-line skirts, Blouses with puffed sleeves
- Women accessories: Beaded handbags, Pearl necklaces, Hairpins with floral designs

Cultural Context (reference naturally):
- Music/entertainment: 'The Merry Widow Waltz' - Franz Lehár, 'Ain't She Sweet' - Milton Ager, 'I Can't Give You Anything But Love' - Jimmy McHugh; Films: 'The 39 Steps' directed by Alfred Hitchcock, 'Top Hat' starring Fred Astaire and Ginger Rogers; Theatre: 'Pygmalion' by George Bernard Shaw, 'The Royal Family' by George S. Kaufman; Radio: The BBC's Variety Program, Children's Hour
- Typical prices: Loaf of bread: four pence, A pint of milk: three pence, Cinema ticket: one shilling
- Current events: The rise of fascism in Europe and its implications for Britain; Unrest over unemployment and labor rights
- Literature: 'Brave New World' by Aldous Huxley | 'The Maltese Falcon' by Dashiell Hammett | 'Of Mice and Men' by John Steinbeck | [Mystery and detective fiction] | [Social realism] | [Political commentary]
- Technology: The first practical television sets | Advancements in radio technology | The introduction of automatic washing machines | Radios in households | Typewriters in offices | Telephones in homes and businesses
- Daily life: Gathering for afternoon tea, Attending local dances and community events, Participating in gardening and outdoor activities
- Social rituals: Sunday family dinners, Invitation etiquette for social gatherings, Seasonal celebrations like May Day

Atmospheric Details:
The scent of blooming lilacs wafts through the air, mingling with the dampness from recent rains. The soft patter of rain against the manor's windows provides a rhythmic backdrop to the hushed conversations and whispered secrets. The flickering candlelight casts elongated shadows on the walls, enhancing the sense of mystery and tension among the guests.

FASHION INTEGRATION TECHNIQUES:
- First appearance: Describe outfit to establish class/personality
- Accessories: Gloves, hats, pocket watches, jewelry reveal status
- Time-specific: Different outfits for different times of day
- Character traits: Fastidious dresser vs rumpled appearance
- Action integration: "She tugged at her glove" or "He adjusted his tie"
- Weather appropriate: Overcoats in winter, light linen in summer

CULTURAL TOUCHSTONE INTEGRATION:
- Casual conversation: "Did you hear that new jazz record?" or "I saw the latest Chaplin film"
- B
[truncated for prompt budget]

NON-NEGOTIABLE CHAPTER OBLIGATIONS — LOCKED EVIDENCE PHRASES (VERBATIM REQUIRED):
The following physical evidence values are absolute ground truth. Every time this chapter describes, mentions, or alludes to the relevant evidence — no matter how briefly — it MUST use the exact phrase shown below, character for character. NO paraphrase, approximation, rounding, or synonym is permitted.

FAILURE EXAMPLE: if the locked value is "at thirteen minutes to midnight" and you write "just before midnight" or "around midnight" — that is a HARD FAIL. You must write "at thirteen minutes to midnight". Equally, if the locked value is written in words, such as "ten minutes past eleven", and you convert it to figure-based clock notation — that is also a HARD FAIL. Words stay as words; figure forms are forbidden for word-phrased facts.

CRITICAL — WORD-PHRASED VALUES: If the canonical value is written out in words (e.g. a time like "ten minutes past eleven", or an amount like "forty minutes"), reproduce those exact words. DO NOT convert to figure-based time notation, twenty-four-hour format, or any other numeric shorthand. Correct: "ten minutes past eleven". WRONG: figure-based clock notation or numeric shorthand.

Locked facts:
  - The exact time shown on the stopped clock face: "ten minutes past eleven"
    ⛔ FORBIDDEN alternatives: "11:10", "11.10", "eleven ten", "eleven-ten", "eleven past ten", "quarter past eleven", "half past eleven" — the ONLY acceptable form is "ten minutes past eleven"
  - The exact amount the clock was wound back: "forty minutes"
  - The time at which witnesses claim to have seen the victim alive: "a quarter past eleven"
  - The inferred time of death based on witness statements: "twenty minutes past eleven"
    ⛔ FORBIDDEN alternatives: "11:20", "11.20", "eleven twenty", "eleven-twenty", "eleven past twenty", "quarter past eleven", "half past eleven" — the ONLY acceptable form is "twenty minutes past eleven"

If a locked fact has no relevance to this chapter, omit it. But the moment you reference the underlying evidence, only the exact phrase above is acceptable.

═══ NARRATIVE STATE (read-only — do not contradict) ═══

LOCKED FACTS — use verbatim whenever this evidence is described:
  • The exact time shown on the stopped clock face: "ten minutes past eleven"
  • The exact amount the clock was wound back: "forty minutes"
  • The time at which witnesses claim to have seen the victim alive: "a quarter past eleven"
  • The inferred time of death based on witness statements: "twenty minutes past eleven"

CHARACTER PRONOUNS — never deviate from these:
  • Eleanor Voss: she/her/her
  • Dr. Mallory Finch: she/her/her
  • Captain Ivor Hale: he/him/his
  • Beatrice Quill: she/her/her

CLUES ALREADY REVEALED TO READER: clue_1, clue_2, clue_mechanism_visibility_core, clue_core_contradiction_chain, clue_3, clue_4, clue_6, clue_core_elimination_chain — do not reveal these as new information.

INVESTIGATION LOG — WHAT IS ESTABLISHED (do not re-establish, do not repeat):
• Evidence in reader's hands: A peculiar dust pattern is observed on the clock face. | The dust indicates that the clock has been handled recently, suggesting tampering. | The mechanism relies on clock, peculiar, and pattern to expose the false timing. | The dust indicates that the clock has been handled recently, suggesting tampering. | The clock shows a time inconsistent with the guests' accounts of the victim’s last sighting. | This inconsistency suggests that either the clock is faulty or has been altered to mislead. | The scratch indicates recent tampering, confirming that the clock has been manipulated. | Eliminates Dr. Mallory Finch because he was seen at the medical conference from eight to ten.
• Suspects still unresolved: Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill
⚠ The story must move FORWARD from this log. Any beat already listed above is forbidden from repeating.

⚠ THIS CHAPTER'S REQUIRED ADVANCE (early): Interview each suspect — record their claimed whereabouts

CONTINUITY HANDOFF — previous chapter closing beat:
  • "The conversation shifted as the guests began to discuss their whereabouts during the critical time. Each one tried to establish their alibi, recounting details that felt increasingly rehearsed. Eleanor listened intently, her mind racing to piece together the f..."
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
drawing room, estate, dining room

✓ RULE: Continue using this location vocabulary. Maintain consistency with established setting type.
✓ Do NOT introduce new location types that contradict earlier chapters.

**Recent Chapter Summary (for narrative continuity):**
Chapter 1: Chapter 1: Discovery
  Events: Eleanor Voss stood frozen, her gaze locked on the clock that hung ominously on the wall of the drawing room of her estate.
Chapter 2: Chapter 2: The Gathering
  Events: The sound of rain pattered against the windows, creating a rhythmic backdrop to the nervous chatter among the guests.

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
Known location profile anchors: Little Middleton Manor, The Drawing Room, The Library, The Attic, The Gardens, the study where the victim was found
LOCATION NAME CAPITALISATION (HARD REQUIREMENT — validated):
All named locations in your prose MUST use the EXACT capitalisation from the CML profiles.
Canonical forms: "Little Middleton Manor", "The Drawing Room", "The Library", "The Attic", "The Gardens", "the study where the victim was found"
Writing a location in lowercase (e.g. "drawing room" instead of "Drawing Room") is a validated error. Every time you mention a named location, copy its capitalisation from the list above.
- Chapter 3: OPENING STYLE (HARD): Start the VERY FIRST SENTENCE with an explicit time marker — e.g. "At half past nine…" / "At midnight…" / "At a quarter to eleven…" / "At half past nine at night…". Time must be in the first clause. Anchor opening in "the study where the victim was found". HARD REQUIREMENT for the first 2 paragraphs: (a) include 2+ sensory words — choose from smell/scent/sound/echo/silence/creak/whisper/cold/warm/damp/rough/smooth/glow/shadow/flicker/dim — and (b) include 1+ atmosphere/time word — choose from rain/wind/fog/storm/mist/thunder/evening/morning/night/dawn/dusk/season/afternoon/midday/noon/midnight/twilight/sunrise/sunset/daylight/sunlight/overcast/cloudy/bright/dark. These are validated requirements, not style suggestions; missing them triggers a retry.

[⚠ INTERNAL QUALITY DIAGNOSTICS — DO NOT REPRODUCE ANY PART OF THIS SECTION IN YOUR STORY OUTPUT. These are private generator observations for your consideration only. Your narrative must read as if this section does not exist. Never include phrases from this block in character dialogue, narration, or description.]

PRIOR CHAPTER QUALITY OBSERVATIONS:
- Chapter 1 (score 85/100):
  Quality gaps noted: word density below preferred target (642/1000); scene grounding weakness
  Address in upcoming chapters: Increase chapter density with concrete investigation action and sensory-grounded beats; avoid recap-only padding. | Open next chapter with a named location anchor plus at least two sensory cues and one atmosphere marker.
- Chapter 2 (score 88/100):
  Quality gaps noted: word density below preferred target (709/1000); scene grounding weakness
  Address in upcoming chapters: Increase chapter density with concrete investigation action and sensory-grounded beats; avoid recap-only padding. | Open next chapter with a named location anchor plus at least two sensory cues and one atmosphere marker.
[END INTERNAL DIAGNOSTICS]

PROMPT BUDGET SUMMARY: budget=32000 tokens; fixed=7229; context=11470; dropped=[none]; truncated=[pronoun_accuracy, temporal_context]

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
8. Integrate at least two concrete era-grounded details per chapter from setting refinement signals: radio broadcasts in the drawing room | typewriters in study | early home telephones | party-line telephone exchanges | telegram services available in local town | airmail for urgent correspondence.
9. Respect setting movement/access constraints in scene action and alibis: narrow staircases limiting movement during events | hidden passageways for discreet access | weather conditions affecting outdoor investigations | restricted areas such as the library and attic | guest permissions required for private rooms.
10. Sustain social coherence with this backdrop pressure: An inheritance hearing amidst the Great Depression draws a diverse group of heirs and socialites to the isolated manor, where class tensions and political discussions heighten the atmosphere of mistrust.
11. Maintain continuity around these socially central cast anchors where relevant: Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill.
12. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Critical: Plot similarity 0.75 with 'The Mysterious Affair at Styles' (same focus on timing and murder)
13. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Moderate: Character similarity 0.74 with 'The Sign of the Four' (similar cast structure and dynamics)
14. STORY TO DATE ANTI-COPY RULE: The STORY TO DATE section below is provided for chronological and factual reference ONLY. You MUST NOT copy, lightly rephrase, or structurally echo any sentence or paragraph from prior chapters. Every sentence in this chapter must be original prose unique to this scene. Reusing even a clause from prior chapter text will cause this attempt to fail immediately.

CRITICAL PROSE REQUIREMENTS:

The CML specifies exact requirements for certain validation-critical scenes. You MUST include these elements at the specified positions.

**Discriminating Test Scene (Act 3, Scene 2):**
Required elements: Execute the discriminating test, Observe the clock's mechanism, Draw conclusion about guilt
Test type: trap

**Suspect Clearance Scenes:**
- Dr. Mallory Finch (Act 3, Scene 3): Prove she was in the garden during the critical time.
  Clues: guest list corroborating her presence
- Captain Ivor Hale (Act 3, Scene 4): Show his alibi with witnesses from the dining room.
  Clues: witness statements from dinner
- Beatrice Quill (Act 3, Scene 4): Alibi confirmed: between 9 PM and 10 PM

**Culprit Revelation Scene (Act 3, Scene 5):**
Method: Confrontation with evidence proving tampering.

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
  - Opening: Begin with a character action, spoken line, or clock/time marker — never a location name or location-description phrase.
  - Scene is set in: the study where the victim was found — reference it naturally within the paragraph, never as your opening phrase.
  - Opening atmosphere (MANDATORY — validator enforced): the first paragraph MUST contain at least one of: rain / wind / fog / storm / mist / thunder / evening / morning / night / dawn / dusk / season / afternoon / midday / noon / midnight / twilight / sunrise / sunset / daylight / sunlight / overcast / cloudy / bright / dark. A chapter that omits all of these from its opening paragraph will be rejected.
  - Continuity bridge: in the first 120 words, visibly connect from the previous chapter's final beat. Carry forward one unresolved element (object, accusation, emotional pressure, or immediate physical action) from: "The conversation shifted as the guests began to discuss their whereabouts during the critical time. Each one tried to establish their alibi, recounting details that felt increasingly rehearsed. Eleanor listened intently,...".
  - Clue obligations: none for this chapter.
  - Tonal contrast: include at least one beat of relief or ironic counterpoint. Do not sustain maximum tension for every paragraph.
- Locked fact phrase obligations:
  - If this batch mentions The exact time shown on the stopped clock face, write exactly: "ten minutes past eleven".
  - If this batch mentions The exact amount the clock was wound back, write exactly: "forty minutes".
  - If this batch mentions The time at which witnesses claim to have seen the victim alive, write exactly: "a quarter past eleven".
  - If this batch mentions The inferred time of death based on witness statements, write exactly: "twenty minutes past eleven".
- Seasonal vocabulary allow-list: spring, vernal, springtime.
- Forbidden seasonal words: summer, autumn, winter.

FROZEN TIMELINE STATE (DO NOT ALTER):
- Timeline anchor: May (spring).
- Month, season, weather, and time-of-year language in this batch must stay compatible with spring.
- Established timeline fact: 8 PM
- Established timeline fact: 10 PM
- If referenced, use exact time phrase: "ten minutes past eleven" (The exact time shown on the stopped clock face).
- If referenced, use exact time phrase: "forty minutes" (The exact amount the clock was wound back).
- If referenced, use exact time phrase: "a quarter past eleven" (The time at which witnesses claim to have seen the victim alive).
- If referenced, use exact time phrase: "twenty minutes past eleven" (The inferred time of death based on witness statements).

STORY TO DATE (REFERENCE ONLY — DO NOT COPY VERBATIM):
- Full prior chapter text is provided below for continuity, factual consistency, and reference accuracy.
- Use this to keep character voice, chronology, clue state, and location continuity aligned with earlier chapters.
- Do not quote, copy, or paraphrase these paragraphs too closely; write fresh prose that remains consistent with them.

--- BEGIN PRIOR CHAPTER 1 ---
Title: Chapter 1: Discovery
Eleanor Voss stood frozen, her gaze locked on the clock that hung ominously on the wall of the drawing room of her estate. The morning light struggled to filter through the overcast skies outside, casting a muted glow across the room. Heavy raindrops drummed against the windows, echoing the turmoil that churned within her. The air felt thick with dread, a palpable tension that seemed to seep from the very walls. She could hardly breathe, her heart racing as she tried to comprehend the horror that had unfolded within her home.

Approaching the clock, Eleanor noticed a peculiar dust pattern on the clock face, an unsettling detail that sent a shiver down her spine. It was as if someone had recently touched it, leaving behind a trace of their presence. The dust indicated that the clock had been handled recently, suggesting tampering. Who would dare to interfere with such a crucial piece of evidence? The thought sent a wave of anxiety coursing through her veins. Could it be that someone among them had manipulated the clock to hide the truth?

The clock showed a time inconsistent with the guests' accounts of the victim’s last sighting. It read ten minutes past eleven, yet witnesses had seen the victim alive at a quarter past eleven. Eleanor's mind raced as she pieced together the implications of this discrepancy. This inconsistency suggested that either the clock was faulty or had been altered to mislead. The very notion that someone could be so calculating, so desperate to obscure the truth, filled her with a sense of foreboding.

As she examined the clock more closely, Eleanor noticed the faint scratch on the winding mechanism. It was a small detail, but it confirmed her suspicions. The scratch indicated recent tampering, confirming that the clock had been manipulated. This revelation sent her thoughts spiraling; who had the audacity to tamper with the evidence? The very act of altering the clock suggested a deeper conspiracy at play, one that she was determined to unravel.

The drawing room felt stifling, the air thick with unspoken words and hidden motives. Captain Hale stood nearby, his expression a mask of stoicism, yet Eleanor could sense the tension radiating from him. "The clock is accurate, I assure you," he insisted, his voice steady but lacking conviction. His insistence felt like a red herring, an attempt to deflect suspicion away from himself. Did he truly believe that everyone would accept his word without question?

Dr. Finch, who had been observing quietly, finally spoke up. "We must consider all possibilities. The clock's accuracy is crucial to understanding the timeline of events. If it has been tampered with, we cannot rely on it as a witness to the time of death." Her voice was calm, yet there was an urgency beneath it, a plea for clarity amidst the chaos. Eleanor nodded, grateful for Dr. Finch's level-headedness in this tumultuous moment.

Beatrice Quill, ever the inquisitive journalist, leaned closer to the clock, her brow furrowed in concentration. "This could be the key to everything," she murmured, her eyes darting between the clock and the others in the room. "If we can prove that it was altered, we may uncover who was trying to mislead us." Her enthusiasm was infectious, but Eleanor felt a pang of unease. What lengths would Beatrice go to for a story?

The tension in the room was suffocating, each guest acutely aware of the weight of suspicion that hung in the air. Eleanor could feel their eyes on her, each one a silent accusation. She took a deep breath, steeling herself for the task ahead. The truth was out there, hidden beneath layers of deceit and desperation. With the storm raging outside, mirroring the turmoil within, she knew that time was of the essence. They had to uncover the truth before it was too late.
--- END PRIOR CHAPTER 1 ---

--- BEGIN PRIOR CHAPTER 2 ---
Title: Chapter 2: The Gathering
The sound of rain pattered against the windows, creating a rhythmic backdrop to the nervous chatter among the guests. "We must remain calm, for the truth will come to light soon enough," Eleanor Voss said, her voice steady despite the turmoil within. She poured tea into delicate china cups, her hands trembling slightly as she tried to maintain an air of composure. The dining room of Eleanor Voss's estate felt stifling, the atmosphere thick with unspoken accusations and lingering dread. The clock on the wall, ticking away the seconds, served as a reminder of the urgency of their situation. Each tick echoed in her mind, a relentless countdown to the truth that seemed just out of reach.

As Eleanor glanced at the clock, a sense of foreboding washed over her. The clock showed a time inconsistent with the guests' accounts of the victim’s last sighting. It read "ten minutes past eleven," yet she recalled the witness statements that placed the victim alive at "a quarter past eleven." The implications of this discrepancy sent a chill down her spine. Who among them had the motive to alter the timeline? The thought was unsettling, a shadow lurking in the corners of her mind, waiting to pounce.

The realization that the clock's time did not align with the guests' accounts raised troubling questions. If the clock was indeed tampered with, it implied that someone had gone to great lengths to obscure the truth. Eleanor's heart raced as she considered the possibility that one of her guests was not merely a witness but a potential suspect. The very act of tampering suggested a deeper conspiracy at play, one that she felt compelled to unravel. Who could be so desperate to manipulate time itself to hide their guilt?

Moreover, the clock's peculiar condition suggested that either it was faulty or had been altered to mislead. Eleanor's mind raced with possibilities. If the clock had been tampered with, it could mean that the timeline they were relying on was fundamentally flawed. This realization deepened her unease, as she understood that every guest's alibi was now under scrutiny. The clock, once a mere timekeeper, had transformed into a pivotal piece of evidence, one that could either exonerate or condemn them all.

As she set the teapot down, Beatrice Quill leaned forward, her eyes alight with curiosity. "I saw the victim just before dinner," she declared, her tone almost too eager. Eleanor's heart sank. Beatrice's claim created confusion, adding another layer to the already tangled web of alibis. Did Beatrice truly believe her own words, or was she trying to divert attention from something more sinister? The journalist's ambition often blurred the lines between truth and sensationalism, and Eleanor couldn't shake the feeling that Beatrice's eagerness might hide ulterior motives.

Dr. Finch, who had been observing quietly, finally interjected. "We must consider all possibilities. If the clock has been tampered with, we cannot rely on it as a witness to the time of death," she said, her voice calm yet urgent. Eleanor nodded, grateful for Dr. Finch's level-headedness amidst the chaos. The doctor’s presence was a stabilizing force, a reminder that logic must prevail over the rising tide of fear and suspicion.

Captain Hale stood nearby, his expression a mask of stoicism. "I assure you, the clock is accurate," he insisted, though his voice lacked conviction. Eleanor studied her closely, searching for any sign of deceit. Was she genuinely convinced of the clock's reliability, or was she attempting to deflect suspicion away from herself? The tension in the room was palpable, each guest acutely aware of the weight of suspicion that hung in the air. Eleanor could feel their eyes on her, each one a silent accusation, and she took a deep breath, steeling herself for the task ahead.

The conversation shifted as the guests began to discuss their whereabouts during the critical time. Each one tried to establish their alibi, recounting details that felt increasingly rehearsed. Eleanor listened intently, her mind racing to piece together the fragments of their stories. The clock's ticking seemed to grow louder, a constant reminder of the urgency of their situation. She knew that time was of the essence, and they had to uncover the truth before it slipped away completely.
--- END PRIOR CHAPTER 2 ---

[SCENE COMPLETENESS CONTRACTS — MANDATORY. Each contract below lists what you MUST enact in that chapter. Do not summarise or mention these labels in the prose — enact them organically.]
Chapter 3 (Act 1) completeness contract:
  PIVOT ELEMENT (MANDATORY — write this into the prose, shown not told): "Eleanor's determination to investigate"
  FACT ESTABLISHED (MANDATORY — reader must know this by chapter end): "Establishes Eleanor's resolve to find the truth, setting the stage for her role as the amateur detective."

# Case Overview
Title: The Clockwork Conspiracy
Era: 1930s
Setting: Little Middleton
Crime: murder (unknown)
Culprit: Eleanor Voss
False assumption: The victim must have been killed at the time indicated by the wall clock.
Cast: Eleanor Voss (she/her), Dr. Mallory Finch (she/her), Captain Ivor Hale (he/him), Beatrice Quill (she/her)

Setting Lock: Keep all scenes and descriptions consistent with the stated setting (Little Middleton). Do not introduce a different location type.

Outline scenes:
[
  {
    "sceneNumber": 3,
    "act": 1,
    "title": "The Investigation Begins",
    "setting": {
      "location": "the study where the victim was found",
      "timeOfDay": "Afternoon",
      "atmosphere": "Somber and tense"
    },
    "characters": [
      "Eleanor Voss",
      "Dr. Mallory Finch",
      "Captain Ivor Hale",
      "Beatrice Quill"
    ],
    "purpose": "Detective commits to investigation",
    "cluesRevealed": [],
    "dramaticElements": {
      "conflict": "Eleanor feels the pressure of the situation",
      "tension": "Each character's motives begin to surface",
      "microMomentBeats": [
        "Eleanor bites her lip, holding back tears."
      ]
    },
    "summary": "Eleanor resolves to uncover the truth behind the murder, despite the guests' reluctance to cooperate. The atmosphere is thick with suspicion as she examines the study more closely, noting the clock's peculiar dust pattern.",
    "estimatedWordCount": 1500,
    "pivotElement": "Eleanor's determination to investigate",
    "factEstablished": "Establishes Eleanor's resolve to find the truth, setting the stage for her role as the amateur detective.",
    "permittedBehavioursByAct": [
      {
        "characterName": "Eleanor Voss",
        "behaviour": "normal social behaviour; grief"
      },
      {
        "characterName": "Dr. Mallory Finch",
        "behaviour": "normal social behaviour; confusion"
      },
      {
        "characterName": "Captain Ivor Hale",
        "behaviour": "normal social behaviour; shock"
      },
      {
        "characterName": "Beatrice Quill",
        "behaviour": "normal social behaviour; curiosity"
      }
    ],
    "redHerringPlacement": null,
    "emotionalRegister": "Unease rises with each clue, revealing the complexity of motives among the guests.",
    "dominantCharacterNote": {
      "name": "Eleanor Voss",
      "voiceRegister": "Her voice carries a genteel formality, often laced with a soft, knowing laugh that hints at her awareness of the absurdities around her."
    },
    "humourGuidance": {
      "permission": "forbidden"
    },
    "eraTextureNote": "Limited access to transportation for many due to economic strain; Communication mostly through letters or landline telephones; Social gatherings dictated by strict etiquette and formal invitations",
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
