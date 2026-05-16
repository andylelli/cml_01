# Actual Prompt Record

- Run ID: `mystery-1778789719558`
- Project ID: ``
- Timestamp: `2026-05-14T20:19:17.154Z`
- Agent: `Agent9-ProseGenerator-Ch2`
- Operation: `chat_request_full_prompt`
- Model: `GPT-4o-mini`
- Temperature: `0.42`
- Max Tokens: `4500`
- Attempt: `first`
- Prompt Hash: `94b3ae5b5c65f1a0`

## Message 1 (role=system)

```text
You are an expert prose writer for classic mystery fiction. Your role is to write compelling, atmospheric narrative chapters that read like a professionally published novel.

⛔ ABSOLUTE RULE — CHARACTER NAMES:
The ONLY characters who exist in this story are: Eleanor Voss (woman), Dr. Mallory Finch (man), Captain Ivor Hale (man), Beatrice Quill (woman).
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
- MORAL COMPLEXITY REQUIREMENT: The mechanism of this crime carries a moral gray area: "The murderer acted out of a misguided sense of loyalty, believing their crime was justified to protect a loved one." — the culprit reveal and denouement MUST acknowledge this ambiguity. Do not let the ending feel clean or simple. Give the reader at least one moment of uncomfortable sympathy or moral doubt.


⚠️ AMATEUR DETECTIVE STORY: The investigator is a civilian with no official standing. The official police (if they appear) are unnamed background figures only — "a constable", "the sergeant", "an officer from the village". Do NOT give any police official a name or title+surname combination. There is no Inspector [Surname], no Constable [Surname], no Sergeant [Surname] in this story.

PRONOUN ACCURACY — MANDATORY CONTINUITY CONTRACT

The following pronouns are locked facts, on the same level as character names
and hard-logic device values. Using the wrong pronoun is a continuity error,
not a style choice.

Canonical pronoun table (subject / object / possessive / reflexive):
  • Eleanor Voss: she/her/her/herself
  • Dr. Mallory Finch: he/him/his/himself
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

## Era: 1930-10
In October 1930, the atmosphere is thick with the weight of financial despair as the Great Depression deepens its grip on society. Streets are filled with the sound of hushed conversations about rising unemployment, while the scent of damp leaves and rain-soaked earth permeates the air, encapsulating the fall's chill. The upper classes cling to their fading privileges, often hiding their financial struggles behind a veneer of elegance. Social gatherings, like those at the Voss estate, are laced with an undercurrent of tension, as long-standing rivalries and resentments surface amidst polite conversation. The looming specter of political extremism in Europe adds an ominous backdrop, as whispers of fascism and communism reach even the quiet corners of Little Middleton. Families are torn between maintaining appearances and the harsh reality of their situations, leading to a charged atmosphere rife with suspicion and betrayal.
Emotional register: A collective anxiety permeates society, as individuals grapple with the fragility of their social standing and the uncertainty of the future.
Physical constraints: Limited travel options due to fuel shortages and economic strain | Domestic telephones with party-line exchanges make private conversations difficult | Social etiquette restricts open discussions about financial difficulties
Current tensions (weave into background texture): Rising unemployment rates due to the Great Depression | Increasing reports of fascist movements in Europe | Debates in Parliament over welfare reforms
Wartime context — Many families have members who served in the Great War, which adds to their emotional burdens.: The scars of past conflicts linger, complicating personal interactions as some veterans struggle to reintegrate into civilian life. Absence effect: The absence of those lost in war creates a palpable void, influencing family dynamics and deepening underlying tensions.

## Story Theme
In a world where social status is precarious, the unraveling of a murder reveals the deeper fractures within family loyalty and ambition, and reveals that evidence carries ethical weight, forcing characters to choose accountability over social performance when appearances and facts collide.

## Story Emotional Register
Dominant: The story carries an emotional weight of tension and intrigue, with undercurrents of desperation and ambition shaping character interactions.

Arc:
The narrative opens in the grand yet oppressive atmosphere of Little Middleton Manor, where the recent murder of Eleanor Voss casts a pall over a once-celebrated family reunion. The discovery of her body in the study sends shockwaves through the estate, igniting a sense of urgency as friends and family grapple with the weight of the tragedy. As the investigation unfolds, the tension rises; the initial clues lead to false assumptions, revealing not only the emotional cost of the crime but also the deep-seated resentments that simmer beneath the surface.

The first turn comes when the clock's tampering is revealed, suggesting a premeditated act rather than a crime of passion, altering the course of the investigation and leaving the characters questioning their realities. Midway through the story, a pivotal revelation about Beatrice Quill’s connection to the clock shifts the focus, forcing Eleanor’s colleagues to confront their biases and suspicions. As the pressure mounts, the climax emerges in a tense confrontation where the truth about Beatrice's ambition and desperation is unveiled, leading to a dramatic resolution that leaves the characters forever changed. The conclusion sees the remaining characters grappling with the emotional fallout of the events, as they navigate the wreckage of their relationships and reflect on the fragility of trust and loyalty within the family dynamic.

## Emotional register at this point in the story
A sense of foreboding hangs in the air, punctuated by the shock of the murder.

## Character Portraits (appearance & era)

### Eleanor Voss
Eleanor Voss embodies the struggles of the upper class during the Great Depression. Once a respected figure in the community, her family's internal conflicts and inheritance disputes weigh heavily on her. As a retired schoolteacher, she is deeply aware of the historical context of her family's legacy, motivating her to seek answers amidst the chaos of the murder investigation.
Era intersection: Eleanor's private resentment towards her family is exacerbated by the socio-economic pressures of the era, pushing her to confront long-buried grievances.

### Dr. Mallory Finch
Dr. Mallory Finch represents the tension between professionalism and personal desperation during the economic crisis. His financial struggles cloud his judgment, revealing the moral dilemmas faced by those in the medical profession. He navigates the complexities of social expectations while grappling with his own vulnerabilities.
Era intersection: Mallory's financial troubles highlight the impact of the Great Depression on the health care system, as he wrestles with the ethical implications of his potential involvement in the crime.

### Captain Ivor Hale
Captain Ivor Hale is a relic of past heroism, now caught in the web of familial expectations and personal demons. His desire for acceptance within the Voss family is overshadowed by the psychological scars of war, making him a complex figure in the investigation. His bravado masks deeper insecurities, reflecting the societal pressures of masculinity in a time of crisis.
Era intersection: Ivor's struggles with PTSD are compounded by the economic instability, as he seeks validation in a world that no longer values traditional heroism.

### Beatrice Quill
Beatrice Quill embodies the anxiety of the elite, desperately clinging to her social status as financial security slips away. Her charm and wit hide a deep fear of losing everything, making her a compelling suspect in the murder. She navigates the treacherous waters of family loyalty and ambition, reflecting the era's shifting social dynamics.
Era intersection: Beatrice's internal conflicts about her inheritance are intensified by the socio-economic landscape, forcing her to confront the lengths she might go to preserve her lifestyle.

## Character Voices

### Eleanor Voss (she/her/her)
Eleanor speaks with a soft, measured cadence that reflects her nurturing nature and deep introspection.
[comfortable] You know, history has a way of repeating itself, much like the leaves that fall every autumn.
[evasive] It's not that simple, dear. Some stories are best left untold.
[stressed] I just wish the truth could be clearer amidst all this chaos.
Humour: Eleanor's dry wit surfaces occasionally, providing a light-hearted touch amidst the tension.

### Dr. Mallory Finch (he/him/his)
Mallory's speech is marked by clinical precision, reflecting his role as a physician with a keen eye for detail.
[comfortable] You know, human nature can be quite fascinating, much like the intricacies of our bodies.
[evasive] Financial troubles? Well, one mustn't dwell on such matters in polite company.
[stressed] I never imagined my life would come to this—how did I let it get so out of control?
Humour: His observational humor adds depth to his character, often lightening the mood in tense situations.

### Captain Ivor Hale (he/him/his)
Ivor's voice booms with a mix of bravado and self-deprecation, revealing his desire for recognition.
[comfortable] Ah, the tales I could tell! But perhaps I should leave the heroics to the professionals.
[evasive] You see, it's not about valor; it's about the company you keep.
[stressed] What if they see me as a fraud? I can't let them down.
Humour: Ivor's self-deprecating humor often masks his deeper insecurities, allowing for moments of levity.

### Beatrice Quill (she/her/her)
Beatrice's lively, animated speech captures her charm and flirtatious nature, making her a captivating presence.
[comfortable] Oh, darling, life is a grand stage, and we must all play our parts!
[evasive] I simply refuse to discuss such dreary topics at a gathering like this!
[stressed] What if everything I've worked for slips through my fingers? I can't let that happen!
Humour: Her sardonic wit reveals a sharp awareness of the social dynamics surrounding her.

## Location Registers (scene framing guides)

The Drawing Room: In the drawing room, the air feels thick with unspoken words and hidden agendas. The ornate furnishings provide a facade of comfort, but the tension is palpable as guests navigate their conversations with careful restraint, each word laden with meaning.. Camera angle: As a writer enters this space, the focus should be on the juxtaposition of elegance and discomfort, highlighting the emotional stakes at play.. Era: The lavish decor reflects the era's upper class, but the looming financial crisis adds an unsettling air to the room.

The Library: In the library, the atmosphere is dense with knowledge and secrets waiting to be uncovered. Every corner holds the weight of history, and the quiet rustle of pages turning feels charged with anticipation as characters seek the truth hidden within the walls.. Camera angle: The writer should capture the sense of introspection and urgency, emphasizing the gravity of the investigation unfolding in this sanctuary.. Era: The library's collection reflects the intellectual pursuits of the time, with dusty tomes hinting at forgotten tales.

The Gardens: The gardens embody a sense of deceptive beauty, where vibrant blooms mask the darker undercurrents of the Voss family's turmoil. The serene setting feels at odds with the tension brewing within the manor, inviting exploration yet evoking a sense of foreboding.. Camera angle: As the writer enters this space, the focus should shift to the contrast between nature's beauty and the emotional turmoil it conceals.. Era: The gardens reflect the era's opulence, yet the weather's chill hints at the fragility of their existence amidst economic hardship.

The Study: The study feels like a crucible of secrets and revelations, where the weight of knowledge intensifies the atmosphere. Shadows cast by the flickering fire create an intimate yet charged environment, as characters grapple with their truths in this space of contemplation.. Camera angle: Writers should highlight the interplay of light and shadow, emphasizing the emotional stakes as characters confront their fears within this sanctuary.. Era: The study's decor is indicative of the upper class's intellectual pursuits, yet the tension of the murder investigation looms large.

## Humour guidance for this story position (opening)
Permission: forbidden
Rationale: The atmosphere is too tense to allow for humor.

FAIR-PLAY AND INFERENCE CONTRACT (from CML logic):
- False assumption in force: The time of death can only be confirmed by the clock's reading.
- Hidden truth to progressively expose: The possibility that the clock was tampered with to misrepresent the timing.
- Inference path checkpoints to dramatize clearly (observation -> correction -> effect):
  - Step 1: obs: The clock hands are stuck at ten minutes past eleven. | corr: This indicates the clock was tampered with to misrepresent the time. | effect: Narrows the timeline of Eleanor's death.
  - Step 2: obs: Witnesses claim to have heard the clock chime at eleven. | corr: This contradicts the clock's current positioning. | effect: Eliminates the possibility that the clock was functioning properly.
  - Step 3: obs: A faint scratch on the clock's casing indicates tampering. | corr: This suggests deliberate interference with the clock mechanism. | effect: Narrows the suspect pool to those with access to the study.
- Discriminating test method: trap
- Discriminating test design constraint: The discriminating test compares clock, stuck, and minut against the claimed timeline.
- Test must rely on already-shown clue IDs: clue_1, clue_2, clue_3, clue_mechanism_visibility_core
- Fair-play rationale: Step 1: The clock's stopping time and witness testimony indicates a problem. Step 2: The clock's chime timing contradicts its displayed time. Step 3: The scratch indicates tampering, isolating Beatrice Quill as the only one with access.
- Never solve by withheld information. Keep reader-information parity with detective reasoning.

## Character Reference

### Eleanor Voss
Eleanor speaks with a soft, measured cadence, often punctuating her sentences with thoughtful pauses
She has a penchant for using historical anecdotes to illustrate her points, which can lend an air of scholarly charm to her conversations.
Eleanor grapples with the guilt of her resentments, torn between her love for her late husband and her bitterness towards the family that has caused her so much pain.

### Dr. Mallory Finch
Mallory's speech is marked by a clinical precision, often peppered with dry observations about human nature
He has a tendency to use medical metaphors, which can lend a unique twist to even the most mundane conversations.
Dr. Finch battles with feelings of inadequacy and shame over his financial troubles, fearing that his desperation will lead him to compromise his ethics.

### Captain Ivor Hale
Ivor's speech is marked by a loud, boisterous tone, often punctuated with exaggerated gestures
He has a tendency to recount his military exploits with a blend of pride and self-deprecation that invites both laughter and sympathy.
Ivor struggles with feelings of inadequacy stemming from his military past, battling both the emotional scars of war and the desperate need for validation.

### Beatrice Quill
Beatrice speaks in a lively, animated manner, often punctuating her words with dramatic gestures
Her sardonic wit shines through, revealing an astute awareness of the social dynamics at play.
Beatrice battles with her desire for security and her fear of becoming more ruthless in her pursuit of status, leading her to question her own values.


## CHARACTER CONTRACTS (binding for this scene)
Each entry below constrains how this character must be written in this chapter.
These override generic style guidance when they conflict.

### Eleanor Voss
Voice & mannerisms: Eleanor speaks with a soft, measured cadence, often punctuating her sentences with thoughtful pauses. She has a penchant for using historical anecdotes to illustrate her points, which can lend an air of scholarly charm to her conversations.
Sample voice fragments (match this register and rhythm):
  [comfortable] "You know, history has a way of repeating itself, much like the leaves that fall every autumn."
  [evasive] "It's not that simple, dear. Some stories are best left untold."
Humour: dry wit — deploy occasionally (level 0.5)
FORBIDDEN phrase (never write for Eleanor Voss): "a surge of determination washed over her"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Eleanor's desire to uncover family secrets is not merely curiosity; it is a strategic move to reclaim her standing within the family and the community." — do not surface in Act I.

### Dr. Mallory Finch
Voice & mannerisms: Mallory's speech is marked by a clinical precision, often peppered with dry observations about human nature. He has a tendency to use medical metaphors, which can lend a unique twist to even the most mundane conversations.
Sample voice fragments (match this register and rhythm):
  [comfortable] "You know, human nature can be quite fascinating, much like the intricacies of our bodies."
  [evasive] "Financial troubles? Well, one mustn't dwell on such matters in polite company."
Humour: observational — deploy occasionally (level 0.6)
FORBIDDEN phrase (never write for Dr. Mallory Finch): "everyone could sense the atmosphere"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "In a moment of desperation, he sees the Voss family's fortune as a potential lifeline to escape his debts, creating a moral dilemma that could lead him astray." — do not surface in Act I.

### Captain Ivor Hale
Voice & mannerisms: Ivor's speech is marked by a loud, boisterous tone, often punctuated with exaggerated gestures. He has a tendency to recount his military exploits with a blend of pride and self-deprecation that invites both laughter and sympathy.
Sample voice fragments (match this register and rhythm):
  [comfortable] "Ah, the tales I could tell! But perhaps I should leave the heroics to the professionals."
  [evasive] "You see, it's not about valor; it's about the company you keep."
Humour: self deprecating — deploy occasionally (level 0.4)
FORBIDDEN phrase (never write for Captain Ivor Hale): "she knew with certainty she was right"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Ivor's desire for recognition and acceptance drives him to seek validation from the Voss family, a legacy he feels overlooked in." — do not surface in Act I.

### Beatrice Quill
Voice & mannerisms: Beatrice speaks in a lively, animated manner, often punctuating her words with dramatic gestures. Her sardonic wit shines through, revealing an astute awareness of the social dynamics at play.
Sample voice fragments (match this register and rhythm):
  [comfortable] "Oh, darling, life is a grand stage, and we must all play our parts!"
  [evasive] "I simply refuse to discuss such dreary topics at a gathering like this!"
Humour: sardonic — deploy frequently (level 0.7)
FORBIDDEN phrase (never write for Beatrice Quill): "palpable tension filled the room"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Beatrice's drive to secure her financial future leads her to consider drastic measures, as she would do anything to maintain her social standing." — do not surface in Act I.



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
Little Middleton Manor is a grand estate nestled amidst sprawling gardens and ancient woodlands, where secrets linger in the shadows.

Key Locations Available:
- The Drawing Room (interior): Gathering space
- The Library (interior): Clue discovery, research, and quiet reflection
- The Gardens (exterior): Clue discovery, isolation, and reflection
- The Study (interior): Crime scene, clue discovery

Atmosphere: tense due to underlying social tensions and recent events
Weather: overcast with intermittent rain, typical of the English countryside

Era markers: Petrol touring cars parked in the gravel drive as guests arrive | Domestic telephones with party-line exchanges ringing occasionally | Typewriters clacking away in the study as letters are composed

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
  - Visual: Chandeliers hang from the ceiling, their crystals shimmering in the dim light, casting rainbows across the room's rich textiles., A large fireplace dominates one wall, its mantle adorned with family heirlooms and an ornate clock ticking steadily.
  - Sounds: The soft rustle of silk as guests shift in their seats, punctuated by the occasional cough or the clinking of teacups on saucers., Outside, the rhythmic patter of rain against the window creates a soothing yet unsettling backdrop.
  - Scents: The heady aroma of polished wood mingles with the faint scent of lavender from a vase on the mantle, creating a calming yet tense atmosphere., A hint of smoke from the fireplace lingers in the air, reminding all present of the warmth and comfort that contrasts sharply with the chill of the storm outside.
  - Touch: The plush velvet upholstery of the sofas invites guests to sink in, but the coolness of the marble floor beneath their feet serves as a reminder of the dreary weather outside., The heavy drapes, when pulled aside, feel coarse against the skin, their weight a tangible barrier against the world beyond.

The Library (interior):
  - Visual: Sunlight filters through leaded glass windows, illuminating the dust motes that float lazily in the air, while the deep greens and browns of the room create a cozy yet somber atmosphere., The spines of books, some cracked and worn, tell stories of their own, hinting at the lives that have intersected within these walls.
  - Sounds: The soft rustle of pages turning is the only sound, punctuated by the occasional scratch of the typewriter as someone seeks to capture a fleeting thought., A faint ticking clock on the wall adds a rhythmic beat to the silence, reminding all present of the passage of time.
  - Scents: The musty scent of old books fills the air, mingling with the sharper aroma of ink and freshly polished wood, creating a unique olfactory experience., A hint of leather from the armchairs invites guests to linger, while the faintest trace of dust suggests neglect and forgotten stories.
  - T
[truncated for prompt budget]

## Texture Pool
Draw on these as opportunities arise — you are not required to use them.

- In October 1930, the atmosphere is thick with the weight of financial despair as the Great Depression deepens its grip on society
- Streets are filled with the sound of hushed conversations about rising unemployment, while the scent of damp leaves and rain-soaked earth permeates the air, encapsulating the fall's chill
- The upper classes cling to their fading privileges, often hiding their financial struggles behind a veneer of elegance
- Social gatherings, like those at the Voss estate, are laced with an undercurrent of tension, as long-standing rivalries and resentments surface amidst polite conversation
- The looming specter of political extremism in Europe adds an ominous backdrop, as whispers of fascism and communism reach even the quiet corners of Little Middleton

TEMPORAL CONTEXT:

This story takes place in October 1930 during N/A.

Seasonal Atmosphere:
- Weather patterns: overcast skies, cold winds, intermittent rain
- Daylight: Short days with twilight descending by five o'clock, creating an atmosphere of early darkness.
- Seasonal activities: apple picking at local orchards, attending harvest festivals, preparing for Halloween celebrations
- Seasonal occasions: Halloween
- Season: N/A

Period Fashion (describe naturally):
- Men formal: tailored wool suits in dark hues, crisp white dress shirts, tweed blazers
- Men casual: knitted cardigans, flat caps, corduroy trousers
- Men accessories: bow ties, pocket watches, leather gloves
- Women formal: tea-length dresses with floral patterns, tailored coats with fur collars, cloche hats
- Women casual: knitted jumpers, A-line skirts, sensible shoes with low heels
- Women accessories: pearl necklaces, silk scarves, handbags with beaded embellishments

Cultural Context (reference naturally):
- Music/entertainment: 'Ain't She Sweet' by Milton Ager, 'The Birth of the Blues' by Ray Henderson, 'My Blue Heaven' by Walter Donaldson; Films: 'The Jazz Singer' (1927), 'All Quiet on the Western Front' (1930); Theatre: 'The Front Page' by Ben Hecht, Shakespearean productions at the Old Vic; Radio: BBC News broadcasts, variety shows featuring popular music
- Typical prices: Loaf of bread: four pence, Cinema ticket: one shilling, Pint of beer: nine pence
- Current events: rising unemployment rates due to the Great Depression; debates in Parliament over welfare reforms
- Literature: 'Murder in the Cathedral' by T.S. Eliot | 'The Maltese Falcon' by Dashiell Hammett | 'The Sun Also Rises' by Ernest Hemingway | [mystery] | [social commentary] | [modernist literature]
- Technology: the electric refrigerator | the radio as a household staple | the typewriter with electric models emerging | domestic telephones | petrol engines in vehicles | early motion picture cameras
- Daily life: visiting local markets, participating in village fairs, playing cards during social gatherings
- Social rituals: afternoon tea with friends, Sunday family dinners, inviting neighbors for harvest celebrations

Atmospheric Details:
The air is crisp, tinged with the scent of fallen leaves and damp earth, as the twilight deepens. The sound of rain tapping against the windows creates a rhythmic backdrop, punctuated by the distant rumble of thunder. The flickering glow of candlelight casts dancing shadows, enveloping the room in an intimate yet suspenseful ambiance, fitting for a gathering steeped in secrets.

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
- Authent
[truncated for prompt budget]

NON-NEGOTIABLE CHAPTER OBLIGATIONS — LOCKED EVIDENCE PHRASES (VERBATIM REQUIRED):
The following physical evidence values are absolute ground truth. Every time this chapter describes, mentions, or alludes to the relevant evidence — no matter how briefly — it MUST use the exact phrase shown below, character for character. NO paraphrase, approximation, rounding, or synonym is permitted.

FAILURE EXAMPLE: if the locked value is "at thirteen minutes to midnight" and you write "just before midnight" or "around midnight" — that is a HARD FAIL. You must write "at thirteen minutes to midnight". Equally, if the locked value is written in words, such as "ten minutes past eleven", and you convert it to figure-based clock notation — that is also a HARD FAIL. Words stay as words; figure forms are forbidden for word-phrased facts.

CRITICAL — WORD-PHRASED VALUES: If the canonical value is written out in words (e.g. a time like "ten minutes past eleven", or an amount like "forty minutes"), reproduce those exact words. DO NOT convert to figure-based time notation, twenty-four-hour format, or any other numeric shorthand. Correct: "ten minutes past eleven". WRONG: figure-based clock notation or numeric shorthand.

Locked facts:
  - The exact time shown on the stopped clock face: "ten minutes past eleven"
  - The exact amount the clock was wound back: "forty minutes"
  - The true time of the murder, revealed through evidence: "twenty minutes past ten"

If a locked fact has no relevance to this chapter, omit it. But the moment you reference the underlying evidence, only the exact phrase above is acceptable.

⛔ CLUES TO SURFACE IN THESE CHAPTERS — mandatory:
The following evidence MUST be clearly observable to an attentive reader. Do not bury it in atmosphere or passing dialogue. Each clue must be concrete, specific, and noticeable:

• [clue_2] Witnesses claim to have heard the clock chime at eleven.
  Category: temporal | Criticality: essential | Supports inference step 1
  Points to: This creates a discrepancy with the clock's current state.

For each clue above: an attentive reader should be able to find, record, and later use it to reason toward the solution.

═══ NARRATIVE STATE (read-only — do not contradict) ═══

LOCKED FACTS — use verbatim whenever this evidence is described:
  • The exact time shown on the stopped clock face: "ten minutes past eleven"
  • The exact amount the clock was wound back: "forty minutes"
  • The true time of the murder, revealed through evidence: "twenty minutes past ten"

CHARACTER PRONOUNS — never deviate from these:
  • Eleanor Voss: she/her/her
  • Dr. Mallory Finch: he/him/his
  • Captain Ivor Hale: he/him/his
  • Beatrice Quill: she/her/her

CLUES ALREADY REVEALED TO READER: clue_1 — do not reveal these as new information.

CONTINUITY HANDOFF — previous chapter closing beat:
  • "Captain Hale nodded, his expression resolute. "I’ll see to it. We need to act quickly before the trail grows cold. But first, we must ensure that we have all the facts straight. If the clock shows ten minutes past eleven, we need to consider that Eleanor's hus..."
  • The next chapter must open as a continuation of this beat, not as a disconnected reset.
═══════════════════════════════════════════════════════

═══════════════════════════════════════════════════════════
📚 CONTINUITY CONTEXT - CHARACTER & SETTING CONSISTENCY
═══════════════════════════════════════════════════════════

**CRITICAL: You are writing chapters 2+. Maintain consistency with earlier chapters.**

**Character Names Used in Chapters 1-1:**
Eleanor Voss

✓ RULE: Use EXACTLY these names. Do NOT vary spelling, add titles, or introduce new forms.
✓ Example: if earlier chapters used "Clara Whitfield", keep using "Clara Whitfield" — never "Mrs. Whitfield" unless that is the character's canonical name in the list above.

**Setting Vocabulary Established in Earlier Chapters:**
study, garden

✓ RULE: Continue using this location vocabulary. Maintain consistency with established setting type.
✓ Do NOT introduce new location types that contradict earlier chapters.

**Recent Chapter Summary (for narrative continuity):**
Chapter 1: Chapter 1: Discovery
  Events: The morning light struggled to break through the overcast skies, casting a muted glow in the Voss family study.

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
Known location profile anchors: Little Middleton Manor, The Drawing Room, The Library, The Gardens, The Study, the Voss family study
LOCATION NAME CAPITALISATION (HARD REQUIREMENT — validated):
All named locations in your prose MUST use the EXACT capitalisation from the CML profiles.
Canonical forms: "Little Middleton Manor", "The Drawing Room", "The Library", "The Gardens", "The Study", "the Voss family study"
Writing a location in lowercase (e.g. "drawing room" instead of "Drawing Room") is a validated error. Every time you mention a named location, copy its capitalisation from the list above.
- Chapter 2: OPENING STYLE (HARD): Start the VERY FIRST SENTENCE with spoken dialogue — e.g. '"[words]," [Name] said/asked/replied/murmured.' The opening quote must be the first character on the line. Anchor opening in "the Voss family study". HARD REQUIREMENT for the first 2 paragraphs: (a) include 2+ sensory words — choose from smell/scent/sound/echo/silence/creak/whisper/cold/warm/damp/rough/smooth/glow/shadow/flicker/dim — and (b) include 1+ atmosphere/time word — choose from rain/wind/fog/storm/mist/thunder/evening/morning/night/dawn/dusk/season/afternoon/midday/noon/midnight/twilight/sunrise/sunset/daylight/sunlight/overcast/cloudy/bright/dark. These are validated requirements, not style suggestions; missing them triggers a retry.

[⚠ INTERNAL QUALITY DIAGNOSTICS — DO NOT REPRODUCE ANY PART OF THIS SECTION IN YOUR STORY OUTPUT. These are private generator observations for your consideration only. Your narrative must read as if this section does not exist. Never include phrases from this block in character dialogue, narration, or description.]

PRIOR CHAPTER QUALITY OBSERVATIONS:
- Chapter 1 (score 88/100):
  Quality gaps noted: word density below preferred target (727/1000); scene grounding weakness
  Address in upcoming chapters: Increase chapter density with concrete investigation action and sensory-grounded beats; avoid recap-only padding. | Open next chapter with a named location anchor plus at least two sensory cues and one atmosphere marker.
[END INTERNAL DIAGNOSTICS]

PROMPT BUDGET SUMMARY: budget=32000 tokens; fixed=6611; context=10634; dropped=[none]; truncated=[location_profiles, temporal_context]

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
8. Integrate at least two concrete era-grounded details per chapter from setting refinement signals: petrol touring cars on country roads | domestic telephones with party-line exchanges | typewriters standard in offices | telegrams for urgent messages via local offices | aerial mail services for faster delivery | increasing use of telephones in households.
9. Respect setting movement/access constraints in scene action and alibis: landscaped gardens that limit visibility from the house | multiple floors with restricted access to private areas | weather conditions affecting movement around the estate | gates controlled by estate staff | restricted areas for family and select guests only.
10. Sustain social coherence with this backdrop pressure: A gathering at the estate for a family reunion is overshadowed by financial strain from the Great Depression and rising political tensions, forcing the socially elite to confront their precarious positions amidst whispers of betrayal.
11. Maintain continuity around these socially central cast anchors where relevant: Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill.
12. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Critical: Plot similarity 0.85 with 'The Mysterious Affair at Styles' (similar crime method and era)
13. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Moderate: Setting similarity 0.90 with 'The Mysterious Affair at Styles' (same era and thematic elements)
14. STORY TO DATE ANTI-COPY RULE: The STORY TO DATE section below is provided for chronological and factual reference ONLY. You MUST NOT copy, lightly rephrase, or structurally echo any sentence or paragraph from prior chapters. Every sentence in this chapter must be original prose unique to this scene. Reusing even a clause from prior chapter text will cause this attempt to fail immediately.

CRITICAL PROSE REQUIREMENTS:

The CML specifies exact requirements for certain validation-critical scenes. You MUST include these elements at the specified positions.

**Discriminating Test Scene (Act 3, Scene 4):**
Required elements: Execute the discriminating test, Observe the clock's behavior, Draw conclusion about the tampering
Test type: timing comparison

**Suspect Clearance Scenes:**
- Dr. Mallory Finch (Act 3, Scene 5): Confirmed alibi during the time of death.
  Clues: clue_1, clue_2
- Captain Ivor Hale (Act 3, Scene 5): Witnesses confirm he was outside during the murder.
  Clues: clue_1, clue_2

**Culprit Revelation Scene (Act 3, Scene 6):**
Method: Confrontation with evidence of clock tampering.

**Clue Placement for These Chapters:**
- clue_2 must appear in Act 1, Scene 2 via Witness statements about the chime.

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
  - Word count: Target 1250 words. Achieve this through plot events, dialogue exchanges, and physical investigation — not through atmospheric repetition or extended internal reflection. Each 200-word segment should contain at minimum one concrete story event (a discovery, a conversation exchange, a physical action or movement). Padding with atmosphere alone is not acceptable.
  - Location anchor: the Voss family study.
  - Opening atmosphere (MANDATORY — validator enforced): the first paragraph MUST contain at least one of: rain / wind / fog / storm / mist / thunder / evening / morning / night / dawn / dusk / season / afternoon / midday / noon / midnight / twilight / sunrise / sunset / daylight / sunlight / overcast / cloudy / bright / dark. A chapter that omits all of these from its opening paragraph will be rejected.
  - Continuity bridge: in the first 120 words, visibly connect from the previous chapter's final beat. Carry forward one unresolved element (object, accusation, emotional pressure, or immediate physical action) from: "Captain Hale nodded, his expression resolute. "I’ll see to it. We need to act quickly before the trail grows cold. But first, we must ensure that we have all the facts straight. If the clock shows ten minutes past eleven...".
  - CLUE OBLIGATIONS — mandatory prose elements (do NOT omit or bury):
    • Witnesses claim to have heard the clock chime at eleven. [clue_2] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: This creates a discrepancy with the clock's current state.
      ↳ MANDATORY TWO-PARAGRAPH STRUCTURE (must appear in paragraphs 1 or 2 — no later):
         Paragraph 1: The POV character physically approaches or directly observes this evidence.
           The narration or dialogue explicitly states what is seen (use the exact locked phrase if one applies).
         Paragraph 2 (immediately following): The detective or POV character explicitly reasons
           about what this evidence implies — who it implicates, why it may be unreliable,
           or what inference it supports. This must be a separate full paragraph, not a sentence appended to Paragraph 1.
  - Tonal contrast: include at least one beat of relief or ironic counterpoint. Do not sustain maximum tension for every paragraph.
  - Sensory obligation — use at least two of: The light is muted, casting an eerie glow over the room, while shadows deepen in the corners, creating a sense of foreboding., The clutter on the desk speaks to a mind occupied with pressing matters. | The ticking of a clock provides a constant reminder of the passage of time, while the rustle of papers creates an air of urgency., Distant thunder rumbles ominously, echoing the tension within. | The scent of old books and polished wood fills the air, creating a rich tapestry of experience.. Mood: uneasy stillness, as if the room is holding its breath in anticipation..
- Locked fact phrase obligations:
  - If this batch mentions The exact time shown on the stopped clock face, write exactly: "ten minutes past eleven".
  - If this batch mentions The exact amount the clock was wound back, write exactly: "forty minutes".
  - If this batch mentions The true time of the murder, revealed through evidence, write exactly: "twenty minutes past ten".
- Seasonal vocabulary allow-list: autumn, autumnal, fall.
- Forbidden seasonal words: spring, summer, winter.

FROZEN TIMELINE STATE (DO NOT ALTER):
- Timeline anchor: October (autumn).
- Month, season, weather, and time-of-year language in this batch must stay compatible with autumn.
- Established timeline fact: The clock shows ten minutes past eleven.
- Established timeline fact: Witnesses heard the clock chime at eleven.
- If referenced, use exact time phrase: "ten minutes past eleven" (The exact time shown on the stopped clock face).
- If referenced, use exact time phrase: "forty minutes" (The exact amount the clock was wound back).
- If referenced, use exact time phrase: "twenty minutes past ten" (The true time of the murder, revealed through evidence).

STORY TO DATE (REFERENCE ONLY — DO NOT COPY VERBATIM):
- Full prior chapter text is provided below for continuity, factual consistency, and reference accuracy.
- Use this to keep character voice, chronology, clue state, and location continuity aligned with earlier chapters.
- Do not quote, copy, or paraphrase these paragraphs too closely; write fresh prose that remains consistent with them.

--- BEGIN PRIOR CHAPTER 1 ---
Title: Chapter 1: Discovery
The morning light struggled to break through the overcast skies, casting a muted glow in the Voss family study. Raindrops streaked down the window, distorting the view of the once-vibrant garden outside, now dulled by the weight of the storm. Eleanor Voss stood frozen, her heart racing as she stared at the lifeless form sprawled across the plush carpet, the air heavy with the scent of damp wood and the faint aroma of tobacco smoke lingering from the previous evening's gathering. The clock on the mantle ticked ominously, its hands stuck at ten minutes past eleven, a cruel reminder of the moment that had shattered her world.

Eleanor's breath caught in her throat as she approached the clock, her mind racing with disbelief. The hands were indeed frozen, a stark contrast to the chaos that enveloped her. "Ten minutes past eleven," she whispered, the words tasting bitter on her tongue. This clock, once a symbol of time's passage, now felt like an anchor, holding her in a moment of horror. The implications were staggering; if the clock was to be believed, her husband had died no later than eleven. But how could she trust it? The thought clawed at her, raising questions that twisted her gut.

The door creaked open, and the doctor Finch stepped inside, his expression a mixture of shock and professionalism. She took in the scene with a swift glance, her eyes narrowing as they landed on Eleanor. "What happened here?" she asked, her voice steady but laced with concern. Eleanor could only shake her head, her mind racing to comprehend the reality of the situation. The doctor moved closer to the body, her medical instincts kicking in as she knelt beside the figure, checking for any signs of life, though they all knew the answer.

the captain Hale followed closely behind, his presence a comforting yet heavy weight in the room. She glanced at the clock, then back at Eleanor, her brow furrowing. "The clock was running just fine during dinner," she remarked, trying to piece together the timeline. Her words hung in the air, creating a ripple of doubt. If the clock had been functioning, why was it now stuck? The implications were troubling, and Eleanor felt the tension in the room thicken as they all grappled with the reality of the situation.

Eleanor's gaze shifted between the two men, her heart pounding in her chest. She felt a wave of helplessness wash over her, the weight of the moment pressing down on her. "I don’t understand. How could this happen?" Her voice quivered, betraying the calm she desperately tried to maintain. Dr. Finch looked up from his examination, his expression grave. "We need to determine the time of death, and this clock may not be reliable for that. If it was tampered with, it could lead us astray," he said, his tone clinical yet empathetic.

The shadows cast by the flickering fire danced across the walls, creating an unsettling atmosphere that mirrored Eleanor's turmoil. She felt as though the walls were closing in, the weight of unspoken secrets pressing heavily on her chest. The rain continued to patter against the window, a soothing yet ominous soundtrack to the morning's events. Every creak of the house settling felt like a reminder of the fragility of their situation, and Eleanor couldn't shake the feeling that they were all trapped in a web of deceit.

As the minutes stretched on, Eleanor's mind raced with questions. Who could have done this? What motive could lie behind such a heinous act? The room felt stifling, and she longed for clarity amidst the chaos. Dr. Finch stood, his brow furrowed in concentration as he turned to Captain Hale. "We need to gather everyone who was here last night. They might hold the key to understanding what happened," he suggested, his voice steady despite the turmoil around them.

Captain Hale nodded, his expression resolute. "I’ll see to it. We need to act quickly before the trail grows cold. But first, we must ensure that we have all the facts straight. If the clock shows ten minutes past eleven, we need to consider that Eleanor's husband died no later than that time," she stated, her tone firm. Eleanor's heart sank further as the reality of their situation settled in, the implications of the clock weighing heavily on her mind.
--- END PRIOR CHAPTER 1 ---

[SCENE COMPLETENESS CONTRACTS — MANDATORY. Each contract below lists what you MUST enact in that chapter. Do not summarise or mention these labels in the prose — enact them organically.]
Chapter 2 (Act 1) completeness contract:
  PIVOT ELEMENT (MANDATORY — write this into the prose, shown not told): "Beatrice's statement about hearing the clock chime."
  FACT ESTABLISHED (MANDATORY — reader must know this by chapter end): "Establishes a conflict between the clock's reading and witness statements."
  RED HERRING (MANDATORY — seed naturally, not flagged as false): [rh_2] Dr. Finch insists the clock must be trusted despite its condition.

# Case Overview
Title: The Clockwork Deception
Era: 1930s
Setting: Little Middleton
Crime: murder (mechanical clock tampering)
Culprit: Beatrice Quill
False assumption: The time of death can only be confirmed by the clock's reading.
Cast: Eleanor Voss (she/her), Dr. Mallory Finch (he/him), Captain Ivor Hale (he/him), Beatrice Quill (she/her)

Setting Lock: Keep all scenes and descriptions consistent with the stated setting (Little Middleton). Do not introduce a different location type.

Outline scenes:
[
  {
    "sceneNumber": 2,
    "act": 1,
    "title": "Witness Statements",
    "setting": {
      "location": "the Voss family study",
      "timeOfDay": "Later that morning",
      "atmosphere": "Heightened tension as the investigation begins"
    },
    "characters": [
      "Eleanor Voss",
      "Dr. Mallory Finch",
      "Captain Ivor Hale",
      "Beatrice Quill"
    ],
    "purpose": "Gather initial witness statements about the time of death",
    "cluesRevealed": [
      "clue_2"
    ],
    "dramaticElements": {
      "conflict": "Suspicions arise among the witnesses.",
      "tension": "Conflicting accounts of the clock's chime create doubt.",
      "microMomentBeats": [
        "Beatrice fidgets with her gloves, avoiding eye contact."
      ]
    },
    "summary": "As the group discusses the events leading to the discovery of the body, Beatrice Quill claims she heard the clock chime at eleven. The conflicting accounts raise suspicions as Eleanor questions their reliability.",
    "estimatedWordCount": 1800,
    "pivotElement": "Beatrice's statement about hearing the clock chime.",
    "factEstablished": "Establishes a conflict between the clock's reading and witness statements.",
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
    "redHerringPlacement": {
      "redHerringId": "rh_2",
      "placementDetail": "Dr. Finch insists the clock must be trusted despite its condition."
    },
    "emotionalRegister": "The investigation begins, revealing initial clues that ignite suspicion and tension.",
    "dominantCharacterNote": {
      "name": "Eleanor Voss",
      "voiceRegister": "Eleanor speaks with a soft, measured cadence that reflects her nurturing nature and deep introspection."
    },
    "humourGuidance": {
      "permission": "permitted"
    },
    "eraTextureNote": "Limited travel options due to fuel shortages and economic strain; Domestic telephones with party-line exchanges make private conversations difficult; Social etiquette restricts open discussions about financial difficulties",
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
□ Chapter 2: "Witnesses claim to have heard the clock chime at eleven." is placed in the first 25% of the chapter, followed by an explicit inference or suspicion paragraph.
□ First chapter in this batch opens by continuing the previous chapter closing beat (same unresolved object, question, movement, or emotional pressure).
□ PRONOUN AUDIT — for every character you named in your chapters, list the pronouns you actually used, then verify against the canonical table. Correct any mismatch before outputting. Do NOT include this audit in your JSON output.
  Character            | Canonical     | Used in draft | Match?
  ---------------------|---------------|---------------|-------
  Eleanor Voss         | she/her/her/herself       | [fill in]     | [yes/no]
  Dr. Mallory Finch    | he/him/his/himself        | [fill in]     | [yes/no]
  Captain Ivor Hale    | he/him/his/himself        | [fill in]     | [yes/no]
  Beatrice Quill       | she/her/her/herself       | [fill in]     | [yes/no]
□ Return valid JSON only.
```
