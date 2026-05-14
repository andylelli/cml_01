# Actual Prompt Record

- Run ID: `mystery-1778709824992`
- Project ID: ``
- Timestamp: `2026-05-13T22:08:52.686Z`
- Agent: `Agent9-ProseGenerator-Ch4`
- Operation: `chat_request_full_prompt`
- Model: `GPT-4o-mini`
- Temperature: `0.42`
- Max Tokens: `4500`
- Attempt: `first`
- Prompt Hash: `9de6715ef1a61876`

## Message 1 (role=system)

```text
You are an expert prose writer for classic mystery fiction. Your role is to write compelling, atmospheric narrative chapters that read like a professionally published novel.

⛔ ABSOLUTE RULE — CHARACTER NAMES:
The ONLY characters who exist in this story are: Eleanor Voss (woman), Dr. Mallory Finch (man), Captain Ivor Hale (man), Beatrice Quill (woman).
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
- MORAL COMPLEXITY REQUIREMENT: The mechanism of this crime carries a moral gray area: "The murderer acted out of desperation to protect a loved one, raising questions about the morality of their actions." — the culprit reveal and denouement MUST acknowledge this ambiguity. Do not let the ending feel clean or simple. Give the reader at least one moment of uncomfortable sympathy or moral doubt.


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

## Era: 1933-06
Living in June 1933 means navigating a world where the scars of the Great Depression are still fresh, and the specter of fascism looms large over Europe. The English countryside, marked by overcast skies and intermittent rain, reflects the somber mood of an upper class grappling with dwindling fortunes and social status. Daily life is filled with the tension of maintaining appearances while quietly confronting personal and economic crises. The rise of radio dramas and news broadcasts brings external conflicts into the drawing rooms of the elite, where whispers of political unrest mingle with the clinking of fine china at afternoon teas.
Emotional register: A collective anxiety permeates society, marked by fear of social and financial ruin.
Physical constraints: Communication is slow, relying on telegrams and letters. | Travel is limited due to economic conditions and social etiquette. | Social gatherings are fraught with the pressure of maintaining appearances.
Current tensions (weave into background texture): The devastating effects of the Great Depression persist. | Rising fascism in Europe causes widespread unease. | Class divisions are deepening amidst economic hardship.
Wartime context — Many families are still grappling with the aftermath of World War I, and the specter of another conflict looms.: Conversations about duty and honor are common, but they are tinged with the bitterness of recent losses. Absence effect: The absence of those lost to war creates a vacuum in social dynamics, leaving behind unresolved grief and unspoken tensions.

## Story Theme
The story explores how secrets and social pressures can lead individuals to commit desperate acts, revealing the fragility of human relationships amidst the rigid class structures of the 1930s.

## Story Emotional Register
Dominant: The story oscillates between tension and revelation, culminating in a dramatic confrontation that exposes the fragility of trust and the weight of secrets.

Arc:
The story opens at Little Middleton Manor, a grand estate steeped in secrets, where Eleanor Voss hosts a dinner party amidst overcast skies and rain. The atmosphere is charged with unspoken tensions, and when Eleanor is found dead in the study, the gravity of the crime sinks in, casting a pall over the gathering. As the investigation unfolds, the initial clues present a tangled web of deceit, with each character's facade crumbling under scrutiny. Dr. Mallory Finch's nervous laughter and Beatrice Quill's flirtatious behavior reveal their complexities, while Captain Ivor Hale's rigid demeanor hints at deeper scars from his past.

Just when it seems clarity may emerge, a shocking revelation about the tampered clock changes everything. The realization that time itself has been manipulated throws suspicion on the very people Eleanor once trusted. As the pressure mounts, the atmosphere thickens with confrontation, leading to the climax where Beatrice Quill's motives are finally laid bare. The emotional stakes are high, culminating in a heart-wrenching confrontation that leaves the characters irrevocably changed. In the aftermath, the resolution brings a bittersweet clarity, as the characters grapple with the costs of their actions and the fragile nature of their relationships. Each must confront the reality of their choices, leaving them to navigate a world transformed by loss and revelation.

## Emotional register at this point in the story
Initial clues lead to a web of deceit, complicating the investigation.

## Character Portraits (appearance & era)

### Eleanor Voss
Eleanor Voss embodies the pressures of the 1930s upper class, where maintaining her status is paramount amidst the economic decline. Struggling with her family's financial secrets, she navigates the social scene with grace, masking her desperation beneath a facade of elegance.
Era intersection: Her precarious financial situation highlights the broader economic struggles of the time, illuminating the fragility of social standing.

### Beatrice Quill
Beatrice Quill is an ambitious journalist navigating the treacherous waters of truth and ethics in an era filled with secrets. Her determination to expose societal injustices highlights the emerging voices of women challenging the status quo during the 1930s.
Era intersection: Her pursuit of independence reflects the growing tensions surrounding women's rights, as she seeks to carve her own path amidst traditional expectations.

## Character Voices

### Eleanor Voss (she/her/her)
Eleanor's voice is smooth and melodic, often laced with a hint of sarcasm that reflects her inner turmoil.
[comfortable] Oh, darling, isn't it simply delightful to be surrounded by such lovely company?
[evasive] I wouldn’t worry too much about that. After all, appearances are everything, aren’t they?
[stressed] I can't bear the thought of anyone finding out. It would ruin me!
Humour: Her humour often contains a sharp edge, reflecting her struggles with societal expectations.

### Beatrice Quill (she/her/her)
Beatrice's voice is bright and energetic, often filled with enthusiasm and a touch of sarcasm.
[comfortable] You know, the truth is out there, and I'm determined to find it!
[evasive] Oh, I’m just gathering information, nothing too scandalous, I assure you!
[stressed] What if they find out? My career could be at stake!
Humour: Her playful sarcasm serves as a coping mechanism amidst her ethical dilemmas.

## Location Registers (scene framing guides)

The Drawing Room: The drawing room feels heavy with the weight of secrets and tragedy, where every element—from the faded drapes to the silent piano—whispers of a life interrupted. It is both beautiful and foreboding, a space that once echoed with laughter now haunted by silence.. Camera angle: A writer entering this space should feel the tension of unspoken words and the ghost of Eleanor's presence lingering in the air.. Era: The oppressive atmosphere of the 1930s looms over this space, where social expectations clash with hidden truths.

The Library: The library is cloaked in shadows and dust, a sanctuary of knowledge that feels increasingly stifling. The scent of aged paper and leather mingles with the tension of hidden truths waiting to be unveiled, making it a space of both comfort and unease.. Camera angle: A writer should feel the weight of history in this room, where every book holds a story that could change the course of events.. Era: In the 1930s, the library serves as a refuge for the elite, yet it is also a repository of secrets that reflect the growing anxieties of the time.

The Kitchen: The kitchen buzzes with life, a contrast to the tension simmering in the manor. The lively chatter and rich aromas create an inviting atmosphere, yet an undercurrent of unease lingers as staff exchange worried glances, aware of the shadows cast by the evening's events.. Camera angle: A writer entering this space should feel the warmth of the hearth but also sense the tensions brewing just beneath the surface.. Era: In the 1930s, the kitchen is a hub of activity that reflects the societal divide, where the realities of class struggle blend with the warmth of communal life.

## Humour guidance for this story position (first_turn)
Permission: conditional
Characters who may be funny: Captain Ivor Hale
Rationale: Ivor's self-deprecating humor can provide relief in this tense moment.

## Reveal Groundwork (texture — do not explain, only plant)
- Plant one subtle observable beat related to: "The initial discovery of Eleanor's body sets a tone of unease, hinting at the secrets she carried". Do not explain significance yet.
- Plant one subtle observable beat related to: "The hidden-truth of the clock's tampering earlier interactions, suggesting hidden motives among the guests". Do not explain significance yet.
- Plant one subtle observable beat related to: "Beatrice's ambition to expose Eleanor's secrets adds layers of complexity to her character, ultimately revealing her as a key player in the tragedy". Do not explain significance yet.

FAIR-PLAY AND INFERENCE CONTRACT (from CML logic):
- False assumption in force: Eleanor Voss was killed shortly after the clock struck twelve.
- Hidden truth to progressively expose: The clock was tampered with to mislead the timing of the murder.
- Inference path checkpoints to dramatize clearly (observation -> correction -> effect):
  - Step 1: obs: The clock shows ten minutes past eleven when Eleanor is found. | corr: If the clock was tampered with, then the time of death may be earlier than this. | effect: Narrows the time of death to before eleven.
  - Step 2: obs: Witnesses recall hearing the clock strike twelve shortly after the murder. | corr: If the clock was wound back, it could falsely indicate the time. | effect: Eliminates the assumption that the clock is accurate.
  - Step 3: obs: Visible scratch marks on the clock face indicate where it was tampered with. | corr: These marks suggest someone altered the clock. | effect: Narrows the suspect pool to those with access to the study.
- Discriminating test method: trap
- Discriminating test design constraint: A reenactment is staged where all suspects are asked to recreate their whereabouts around the time of the murder, comparing their statements to the clock's tampering evidence.
- Test must rely on already-shown clue IDs: clue_1, clue_2, clue_3, clue_id_2, clue_culprit_direct_beatrice_quill, clue_5
- Fair-play rationale: Step 1: The clock time and witness statements reveal discrepancies. Step 2: The tampering evidence shows not all timelines match. Step 3: The reenactment exposes Beatrice's opportunity to tamper with the clock.
- Never solve by withheld information. Keep reader-information parity with detective reasoning.

## Character Reference

### Eleanor Voss
Eleanor speaks with an elegant cadence, often peppering her dialogue with witty observations and playful jabs at the absurdities of the elite
Her laughter is light, but her words can carry a sharp edge when she feels threatened.
Eleanor grapples with the tension between her desire for acceptance and the fear of being discovered as a fraud. She knows that her reliance on social façades is unsustainable, yet she feels trapped in a gilded cage.

### Beatrice Quill
Beatrice speaks with a quick, lively rhythm, her words tumbling out in a cascade of enthusiasm
She often employs playful sarcasm, using humor as a tool to navigate the tensions of her profession and to disarm those she interviews.
Beatrice grapples with the tension between her ambition and her ethics, torn between the desire for success and the fear of compromising her integrity in the pursuit of a story.


## CHARACTER CONTRACTS (binding for this scene)
Each entry below constrains how this character must be written in this chapter.
These override generic style guidance when they conflict.

### Eleanor Voss
Voice & mannerisms: Eleanor speaks with an elegant cadence, often peppering her dialogue with witty observations and playful jabs at the absurdities of the elite. Her laughter is light, but her words can carry a sharp edge when she feels threatened.
Sample voice fragments (match this register and rhythm):
  [comfortable] "Oh, darling, isn't it simply delightful to be surrounded by such lovely company?"
  [evasive] "I wouldn’t worry too much about that. After all, appearances are everything, aren’t they?"
Humour: polite savagery — deploy frequently (level 0.7)
FORBIDDEN phrase (never write for Eleanor Voss): "she felt a wave of unease"
Act 2 behaviour contract: May show unease, evasion, or mild defensiveness when questioned. One behavioural tell is permitted. Internal conflict emerging: "Eleanor grapples with the tension between her desire for acceptance and the fear of being discovered as a fraud. She knows that her reliance on social façades is unsustainable, yet she feels trapped in a gilded cage."

### Beatrice Quill
Voice & mannerisms: Beatrice speaks with a quick, lively rhythm, her words tumbling out in a cascade of enthusiasm. She often employs playful sarcasm, using humor as a tool to navigate the tensions of her profession and to disarm those she interviews.
Sample voice fragments (match this register and rhythm):
  [comfortable] "You know, the truth is out there, and I'm determined to find it!"
  [evasive] "Oh, I’m just gathering information, nothing too scandalous, I assure you!"
Humour: sardonic — deploy occasionally (level 0.6)
FORBIDDEN phrase (never write for Beatrice Quill): "palpable tension filled the room"
Act 2 behaviour contract: May show unease, evasion, or mild defensiveness when questioned. One behavioural tell is permitted. Internal conflict emerging: "Beatrice grapples with the tension between her ambition and her ethics, torn between the desire for success and the fear of compromising her integrity in the pursuit of a story."



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
A grand estate steeped in secrets, Little Middleton Manor stands as a testament to the opulence of the past, now shadowed by class tensions and hidden conspiracies.

Key Locations Available:
- The Drawing Room (interior): Crime scene
- The Library (interior): Clue discovery
- The Kitchen (interior): Gathering space

Atmosphere: Tense and foreboding, reflecting underlying class conflicts and personal secrets.
Weather: Overcast with intermittent rain, typical of the English countryside in spring.

Era markers: The sound of a radio broadcasting news updates in the drawing room. | Early home telephones with rotary dials positioned in various rooms. | Typewriters clacking in the study, busy with correspondence and notes.

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
  - Visual: The heavy drapes, their once-bright colors faded to muted tones, frame the tall windows, allowing only slivers of grey light to enter the room., A large, mahogany sideboard, adorned with dusty porcelain figurines, stands against one wall, its surface marred by the passage of time.
  - Sounds: The soft patter of rain against the windowpanes creates a rhythmic backdrop, contrasting with the stillness that envelops the room., Occasionally, the distant sound of footsteps echoes from the hallway, a reminder of the life that continues outside this moment of tragedy.
  - Scents: The air is thick with the musty scent of old books and lingering tobacco smoke, remnants of conversations long past., A faint hint of lavender from an old sachet tucked away in the corner adds an unsettling sweetness to the otherwise stale atmosphere.
  - Touch: The plush carpet underfoot feels damp and cool, a stark contrast to the warm, heavy air that surrounds the room., Passing fingers over the surface of the sideboard reveals a thick layer of dust, a testament to the neglect that has settled in with the secrets.

The Library (interior):
  - Visual: Tall shelves stretch from floor to ceiling, crammed with volumes of varying sizes, their leather bindings cracked and worn from years of handling., The warm glow of the brass lamp illuminates the dust motes dancing in the air, creating an ethereal quality to the otherwise somber space.
  - Sounds: The quiet rustle of pages turning echoes softly, a reminder of the knowledge contained within the room's walls., Occasional creaks from the old wooden floorboards add to the atmosphere, making it feel as though the library itself is alive with secrets.
  - Scents: The musty scent of old paper and leather fills the air, mingling with the faint aroma of polished wood and dust., A hint of mustiness lingers, as if the room has been sealed away from the outside world for far too long.
  - Touch: The smooth, cool surface of the desk contrasts with the rough texture of the old books, each telling its own story., Running fingers along the spines of the volumes reve
[truncated for prompt budget]

## Texture Pool
Draw on these as opportunities arise — you are not required to use them.

- Living in June 1933 means navigating a world where the scars of the Great Depression are still fresh, and the specter of fascism looms large over Europe
- The English countryside, marked by overcast skies and intermittent rain, reflects the somber mood of an upper class grappling with dwindling fortunes and social status
- Daily life is filled with the tension of maintaining appearances while quietly confronting personal and economic crises
- The rise of radio dramas and news broadcasts brings external conflicts into the drawing rooms of the elite, where whispers of political unrest mingle with the clinking of fine china at afternoon teas.

TEMPORAL CONTEXT:

This story takes place in June 1933 during summer.

Seasonal Atmosphere:
- Weather patterns: overcast skies, intermittent rain, cool breezes
- Daylight: Long summer days with twilight extending late into the evening, around nine o'clock.
- Seasonal activities: garden parties, afternoon teas, hunting excursions
- Seasonal occasions: King's Birthday (celebrated informally)
- Season: summer

Period Fashion (describe naturally):
- Men formal: three-piece wool suit with a waistcoat, crisp white dress shirt, light-colored bow tie
- Men casual: linen sports jacket, tweed flat cap, high-waisted trousers
- Men accessories: monocle, silver pocket watch, leather gloves
- Women formal: tea-length silk dress with a cinched waist, cloche hat adorned with flowers, pearl necklace
- Women casual: cotton day dress with short sleeves, straw wide-brimmed hat, canvas shoes
- Women accessories: beaded handbag, silk scarf, dainty gloves

Cultural Context (reference naturally):
- Music/entertainment: 'Night and Day' by Cole Porter, 'I Got Rhythm' by George Gershwin, Various jazz bands gaining popularity; Films: 'King Kong' released in 1933, 'The Vampire Bat'; Theatre: 'The Front Page' by Ben Hecht and Charles MacArthur, 'Of Mice and Men' by John Steinbeck; Radio: BBC Radio broadcasts news and music programs, The Shadow mystery series gaining popularity
- Typical prices: Loaf of bread: four pence, Cinema ticket: one shilling, Bottle of milk: five pence
- Current events: Germany's rearmament under Hitler; unrest in the UK due to economic policies
- Literature: 'The Maltese Falcon' by Dashiell Hammett | 'Murder in the Mews' by Agatha Christie | 'Brave New World' by Aldous Huxley | [crime fiction] | [social realism] | [literary modernism]
- Technology: broadcasting radio technology | typewriters becoming standard in offices | advances in photography | wireless radio sets | early home telephones | hand-cranked adding machines
- Daily life: hosting garden parties, going to the cinema, attending tea at social clubs
- Social rituals: afternoon tea served with pastries, formal dinner parties with multiple courses

Atmospheric Details:
The air is thick with the scent of rain-soaked earth, a reminder of the persistent drizzle that has blanketed the countryside. The distant sound of a clock striking ten echoes through the manor, a haunting reminder of the secrets held within its walls. As shadows lengthen, the flickering light from the drawing-room fire casts eerie shapes, merging with the whispers of class conflict and personal betrayals.

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
- Authentic references: Use actu
[truncated for prompt budget]

NON-NEGOTIABLE CHAPTER OBLIGATIONS — LOCKED EVIDENCE PHRASES (VERBATIM REQUIRED):
The following physical evidence values are absolute ground truth. Every time this chapter describes, mentions, or alludes to the relevant evidence — no matter how briefly — it MUST use the exact phrase shown below, character for character. NO paraphrase, approximation, rounding, or synonym is permitted.

FAILURE EXAMPLE: if the locked value is "at thirteen minutes to midnight" and you write "just before midnight" or "around midnight" — that is a HARD FAIL. You must write "at thirteen minutes to midnight". Equally, if the locked value is written in words, such as "ten minutes past eleven", and you convert it to figure-based clock notation — that is also a HARD FAIL. Words stay as words; figure forms are forbidden for word-phrased facts.

CRITICAL — WORD-PHRASED VALUES: If the canonical value is written out in words (e.g. a time like "ten minutes past eleven", or an amount like "forty minutes"), reproduce those exact words. DO NOT convert to figure-based time notation, twenty-four-hour format, or any other numeric shorthand. Correct: "ten minutes past eleven". WRONG: figure-based clock notation or numeric shorthand.

Locked facts:
  - The exact time shown on the stopped clock face: "ten minutes past eleven"
  - The exact amount the clock was wound back: "forty minutes"

If a locked fact has no relevance to this chapter, omit it. But the moment you reference the underlying evidence, only the exact phrase above is acceptable.

⛔ CLUES TO SURFACE IN THESE CHAPTERS — mandatory:
The following evidence MUST be clearly observable to an attentive reader. Do not bury it in atmosphere or passing dialogue. Each clue must be concrete, specific, and noticeable:

• [clue_id_1] Beatrice Quill exhibited a desire for independence, planning her actions carefully.
  Category: behavioral | Criticality: essential | Supports inference step 2
  Points to: Indicates possible motive and premeditation.

• [clue_4] If the clock was wound back, it could falsely indicate the time.
  Category: temporal | Criticality: essential | Supports inference step 2
  Points to: Suggests a method for creating a false alibi.

For each clue above: an attentive reader should be able to find, record, and later use it to reason toward the solution.

═══ NARRATIVE STATE (read-only — do not contradict) ═══

LOCKED FACTS — use verbatim whenever this evidence is described:
  • The exact time shown on the stopped clock face: "ten minutes past eleven"
  • The exact amount the clock was wound back: "forty minutes"

CHARACTER PRONOUNS — never deviate from these:
  • Eleanor Voss: she/her/her
  • Dr. Mallory Finch: he/him/his
  • Captain Ivor Hale: he/him/his
  • Beatrice Quill: she/her/her

CLUES ALREADY REVEALED TO READER: clue_1, clue_2, clue_core_contradiction_chain, clue_id_3, clue_mechanism_visibility_core — do not reveal these as new information.

CONTINUITY HANDOFF — previous chapter closing beat:
  • "As they continued their investigation, the weight of Eleanor's death loomed over them like a dark cloud. The scratch marks on the clock face indicated tampering, casting doubt on the timeline of events. Each suspect had access to Eleanor, and the realization t..."
  • The next chapter must open as a continuation of this beat, not as a disconnected reset.
═══════════════════════════════════════════════════════

═══════════════════════════════════════════════════════════
📚 CONTINUITY CONTEXT - CHARACTER & SETTING CONSISTENCY
═══════════════════════════════════════════════════════════

**CRITICAL: You are writing chapters 4+. Maintain consistency with earlier chapters.**

**Character Names Used in Chapters 1-3:**
Eleanor Voss, Beatrice Quill

✓ RULE: Use EXACTLY these names. Do NOT vary spelling, add titles, or introduce new forms.
✓ Example: if earlier chapters used "Clara Whitfield", keep using "Clara Whitfield" — never "Mrs. Whitfield" unless that is the character's canonical name in the list above.

**Setting Vocabulary Established in Earlier Chapters:**
drawing room, manor, study, library

✓ RULE: Continue using this location vocabulary. Maintain consistency with established setting type.
✓ Do NOT introduce new location types that contradict earlier chapters.

**Recent Chapter Summary (for narrative continuity):**
Chapter 1: Chapter 1: Discovery
  Events: The morning light filtered through the heavy drapes of Little Middleton Manor, casting a muted glow over the drawing room.
Chapter 2: Chapter 2: Initial Reactions
  Events: “We must find out what happened here,” the doctor Finch said, his voice steady despite the chaos swirling around him.
Chapter 3: Chapter 3: The First Clue
  Events: At midday, the atmosphere in the study of Little Middleton Manor felt charged with the weight of revelation.

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
Known location profile anchors: Little Middleton Manor, The Drawing Room, The Library, The Kitchen, the drawing room
LOCATION NAME CAPITALISATION (HARD REQUIREMENT — validated):
All named locations in your prose MUST use the EXACT capitalisation from the CML profiles.
Canonical forms: "Little Middleton Manor", "The Drawing Room", "The Library", "The Kitchen", "the drawing room"
Writing a location in lowercase (e.g. "drawing room" instead of "Drawing Room") is a validated error. Every time you mention a named location, copy its capitalisation from the list above.
- Chapter 4: OPENING STYLE (HARD): Start the VERY FIRST SENTENCE with a noun-phrase atmosphere — e.g. "The smell of damp stone in the cellar…" / "A chill from the landing…" / "The sound of the clock in the hall…". Pattern: "The/A [noun] of/in/from [place]…". Anchor opening in "the drawing room". HARD REQUIREMENT for the first 2 paragraphs: (a) include 2+ sensory words — choose from smell/scent/sound/echo/silence/creak/whisper/cold/warm/damp/rough/smooth/glow/shadow/flicker/dim — and (b) include 1+ atmosphere/time word — choose from rain/wind/fog/storm/mist/thunder/evening/morning/night/dawn/dusk/season/afternoon/midday/noon/midnight/twilight/sunrise/sunset/daylight/sunlight/overcast/cloudy/bright/dark. These are validated requirements, not style suggestions; missing them triggers a retry.

[⚠ INTERNAL QUALITY DIAGNOSTICS — DO NOT REPRODUCE ANY PART OF THIS SECTION IN YOUR STORY OUTPUT. These are private generator observations for your consideration only. Your narrative must read as if this section does not exist. Never include phrases from this block in character dialogue, narration, or description.]

PRIOR CHAPTER QUALITY OBSERVATIONS:
- Chapter 1 (score 90/100):
  Quality gaps noted: word density below preferred target (715/1000)
  Address in upcoming chapters: Increase chapter density with concrete investigation action and sensory-grounded beats; avoid recap-only padding.
- Chapter 2 (score 91/100):
  Quality gaps noted: word density below preferred target (736/1000)
  Address in upcoming chapters: Increase chapter density with concrete investigation action and sensory-grounded beats; avoid recap-only padding.
- Phrases to avoid (already overused in earlier chapters): "ten minutes past eleven a detail that", "happened eleanor was she was so full", "was so full of life his voice", "so full of life his voice trembled", "felt a pang of sympathy for his", "a pang of sympathy for his plight", "the desk where eleanor had spent her", "desk where eleanor had spent her final", "where eleanor had spent her final moments", "eleanor had spent her final moments papers".
[END INTERNAL DIAGNOSTICS]

PROMPT BUDGET SUMMARY: budget=32000 tokens; fixed=9030; context=9661; dropped=[none]; truncated=[location_profiles, temporal_context]

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
- Chapter numbering starts at 4 and increments by 1 per scene.
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
8. Integrate at least two concrete era-grounded details per chapter from setting refinement signals: radio broadcasting in common use | early home telephones | typewriters standard in offices | increasingly common telephone use | telegram services for urgent messages | airmail for faster long-distance correspondence.
9. Respect setting movement/access constraints in scene action and alibis: geographic layout allows for restricted movement between the main house and outbuildings | architecture creates natural barriers and hidden areas | weather conditions can affect outdoor evidence visibility | restricted areas such as the library and study | daily routines dictate access to certain rooms at specific times.
10. Sustain social coherence with this backdrop pressure: A gathering at the manor for a contentious estate meeting exposes tensions among the upper class, as the Great Depression and rising fascism amplify their fears and secrets.
11. Maintain continuity around these socially central cast anchors where relevant: Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill.
12. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Critical: Plot similarity 0.70 with 'The Mysterious Affair at Styles' (same poisoning method and temporal focus)
13. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Moderate: Character similarity 0.70 with 'The Sign of the Four' (mirrored character roles and dynamics)
14. STORY TO DATE ANTI-COPY RULE: The STORY TO DATE section below is provided for chronological and factual reference ONLY. You MUST NOT copy, lightly rephrase, or structurally echo any sentence or paragraph from prior chapters. Every sentence in this chapter must be original prose unique to this scene. Reusing even a clause from prior chapter text will cause this attempt to fail immediately.

CRITICAL PROSE REQUIREMENTS:

The CML specifies exact requirements for certain validation-critical scenes. You MUST include these elements at the specified positions.

**Discriminating Test Scene (Act 3, Scene 4):**
Required elements: Execute the discriminating test, Observe the culprit's reaction or result, Draw conclusion about guilt
Test type: trap

**Suspect Clearance Scenes:**
- Dr. Mallory Finch (Act 3, Scene 5): Medical alibi confirmed by evidence.
  Clues: clue_id_1, clue_id_2
- Captain Ivor Hale (Act 3, Scene 5): Witness corroboration of his movements.
  Clues: clue_id_3, clue_id_4

**Culprit Revelation Scene (Act 3, Scene 6):**
Method: Confrontation with evidence

**VALIDATION CONSEQUENCE:** If these requirements are not met exactly, story validation will fail and the entire generation will be rejected, costing $5-8 to regenerate. Follow these specifications precisely.


## Asset Self-Report (required)
At the very END of your response, after all prose, add a single line:
<used_assets>era:story:0,era:story:1,era:story:2,era:story:3</used_assets>
Replace the list with only the IDs of texture assets you actually used. If you used none, output <used_assets></used_assets>.
```

## Message 2 (role=user)

```text
Write the full prose following the outline scenes.



CHAPTER OBLIGATION CONTRACT (MUST SATISFY):
- Chapter 4:
  - Word count: Target 1250 words. Achieve this through plot events, dialogue exchanges, and physical investigation — not through atmospheric repetition or extended internal reflection. Each 200-word segment should contain at minimum one concrete story event (a discovery, a conversation exchange, a physical action or movement). Padding with atmosphere alone is not acceptable.
  - Location anchor: the drawing room.
  - Opening atmosphere (MANDATORY — validator enforced): the first paragraph MUST contain at least one of: rain / wind / fog / storm / mist / thunder / evening / morning / night / dawn / dusk / season / afternoon / midday / noon / midnight / twilight / sunrise / sunset / daylight / sunlight / overcast / cloudy / bright / dark. A chapter that omits all of these from its opening paragraph will be rejected.
  - Continuity bridge: in the first 120 words, visibly connect from the previous chapter's final beat. Carry forward one unresolved element (object, accusation, emotional pressure, or immediate physical action) from: "As they continued their investigation, the weight of Eleanor's death loomed over them like a dark cloud. The scratch marks on the clock face indicated tampering, casting doubt on the timeline of events. Each suspect had...".
  - CLUE OBLIGATIONS — mandatory prose elements (do NOT omit or bury):
    • Beatrice Quill exhibited a desire for independence, planning her actions carefully. [clue_id_1]
      Points to: Indicates possible motive and premeditation.
    • If the clock was wound back, it could falsely indicate the time. [clue_4]
      Points to: Suggests a method for creating a false alibi.
  - Tonal contrast: include at least one beat of relief or ironic counterpoint. Do not sustain maximum tension for every paragraph.
  - Sensory obligation — use at least two of: Flat pewter light filters through the heavy drapes, casting a pallid glow over the room's furnishings., Shadows stretch long across the floor, creating a sense of foreboding and unease. | Silence reigns, broken only by the distant tick of a clock, counting down the minutes in this tense stillness., The faint rustle of fabric as someone shifts in their seat amplifies the tension in the air. | The aroma of old wood and leather mingles with the scent of dampness, creating an earthy, unsettling blend.. Mood: uneasy stillness.

- Tonal contrast required: the previous chapter was high-tension. Captain Ivor Hale may use understatement to provide a brief moment of relief before tension resumes.
- Locked fact phrase obligations:
  - If this batch mentions The exact time shown on the stopped clock face, write exactly: "ten minutes past eleven".
  - If this batch mentions The exact amount the clock was wound back, write exactly: "forty minutes".
- Seasonal vocabulary allow-list: summer, summery, midsummer.
- Forbidden seasonal words: spring, autumn, winter.

FROZEN TIMELINE STATE (DO NOT ALTER):
- Timeline anchor: June (summer).
- Month, season, weather, and time-of-year language in this batch must stay compatible with summer.
- Established timeline fact: Dinner started at half past seven.
- Established timeline fact: Eleanor was last seen alive at a quarter past eleven.
- If referenced, use exact time phrase: "ten minutes past eleven" (The exact time shown on the stopped clock face).
- If referenced, use exact time phrase: "forty minutes" (The exact amount the clock was wound back).

STORY TO DATE (REFERENCE ONLY — DO NOT COPY VERBATIM):
- Full prior chapter text is provided below for continuity, factual consistency, and reference accuracy.
- Use this to keep character voice, chronology, clue state, and location continuity aligned with earlier chapters.
- Do not quote, copy, or paraphrase these paragraphs too closely; write fresh prose that remains consistent with them.

--- BEGIN PRIOR CHAPTER 1 ---
Title: Chapter 1: Discovery
The morning light filtered through the heavy drapes of Little Middleton Manor, casting a muted glow over the drawing room. Outside, the soft patter of rain against the windowpanes created a rhythmic backdrop, a stark contrast to the stillness that enveloped the room. the captain Hale stood near the fireplace, his gaze fixed on the clock that dominated the mantelpiece. It showed ten minutes past eleven, a detail that would haunt him for days to come. The air was thick with tension, each breath a reminder of the tragedy that had unfolded within these walls.

As he approached the clock, Hale's heart raced. The timepiece, once a symbol of punctuality, now felt like an ominous harbinger of death. "Ten minutes past eleven," he muttered, the words barely escaping his lips. She could hardly believe that Eleanor Voss, the vivacious hostess of last night's dinner party, lay lifeless just beyond the door. The implications of the time weighed heavily on her, suggesting that Eleanor had met her fate shortly after the clock struck eleven, contradicting the alibis of those who had been present.

the doctor Finch entered the room, his expression a mixture of disbelief and concern. He had been summoned hastily, and the sight of the clock only deepened his sense of dread. "Ivor, what on earth happened here?" he asked, his voice steady but tinged with urgency. Hale turned to him, the gravity of the situation settling in. "Eleanor is dead. We need to figure out when and how this happened. The clock shows ten minutes past eleven, but we cannot trust it. It may have been tampered with."

Finch nodded, his brow furrowing as he considered the implications. "If the clock is unreliable, then we must look to the witnesses. They could provide us with a clearer timeline. But we must act quickly; every moment counts in a situation like this." He stepped further into the room, his eyes scanning for any signs of struggle or clues that might point to the murderer. The stillness of the space felt oppressive, as though the very walls were holding their breath, waiting for the truth to be uncovered.

Beatrice Quill stood by the door, her hands clasped tightly in front of her. She had arrived shortly after the doctor, her heart racing at the thought of what had transpired. "I can't believe this is happening," she whispered, her voice barely audible. "Eleanor was just fine last night. We were laughing and talking as if nothing was wrong. How could this have happened?" His eyes darted between Hale and Finch, searching for answers that eluded them all. The weight of his friend's death pressed heavily upon him, and he struggled to maintain his composure.

Hale turned his attention to Beatrice, noting the distress etched on her features. "You were here last night, weren't you? Did you notice anything unusual?" Beatrice shook her head, her expression a mixture of confusion and fear. "No, everything seemed perfectly normal. We were all just enjoying the evening. I can't fathom how this could have happened. Eleanor was... she was so full of life." His voice trembled as he spoke, and Hale felt a pang of sympathy for his plight.

As they continued to discuss the events of the previous evening, Hale felt the tension in the room shift. Each suspect had access to Eleanor, and the realization that any one of them could be responsible for her death gnawed at her. She glanced at the clock again, its hands frozen in time, a cruel reminder of the moment everything had changed. The investigation would not only be about finding the murderer but also about unraveling the tangled web of relationships that had brought them all to this tragic point.

In the midst of their conversation, Finch's eyes fell upon the desk where Eleanor had spent her final moments. Papers were strewn about, and a half-finished letter lay open, as if she had been interrupted mid-thought. "We should examine her belongings for any clues," he suggested, stepping closer to the desk. Beatrice hesitated, glancing at Hale for reassurance. "Do you really think there could be something here?" she asked, her voice thick with uncertainty. Hale nodded, his mind racing with possibilities. "We won't know until we look. Every detail matters now."
--- END PRIOR CHAPTER 1 ---

--- BEGIN PRIOR CHAPTER 2 ---
Title: Chapter 2: Initial Reactions
“We must find out what happened here,” the doctor Finch said, his voice steady despite the chaos swirling around him. The heavy rain continued to drum against the windows of the drawing room in Little Middleton Manor, each drop a reminder of the tragedy that had unfolded. The air was thick with the scent of damp wood and the musty odor of old books, and the tension among the three witnesses felt almost palpable. Finch's eyes darted to the clock on the mantelpiece, its hands frozen at ten minutes past eleven, a detail that sent a chill down his spine. It was as if the very walls were holding their breath, waiting for the truth to be uncovered.

The clock's time gnawed at Finch's mind. If the clock was tampered with, then the time of death may be earlier than this. His heart raced as he considered the implications. Every moment counted, and the reliability of the clock was now in question. He stepped closer to the mantelpiece, examining the intricate design of the clock, searching for signs of tampering. The thought that someone might have altered it to mislead them sent his mind spiraling. Who could have done such a thing? And why? The weight of the situation pressed heavily on him, each second ticking away like a countdown to revelation.

the captain Hale shifted uncomfortably, his gaze fixed on the door that led to the study where Eleanor lay. “We need to establish our whereabouts during the time of her death,” he said, his voice low and measured. The words hung in the air, a stark reminder of the gravity of their predicament. Finch nodded in agreement, his brow furrowing as he considered the timeline. “I was in the library,” he stated, his tone firm. “I was reviewing some medical texts when I heard the commotion.”

Beatrice Quill, standing near the entrance, fidgeted with her gloves, her expression a mixture of shock and confusion. “I... I was in the drawing room,” she stammered, her voice barely above a whisper. “I remember we were all laughing and talking just before…” Her words trailed off, and she glanced nervously at the clock, as if it held the answers to their questions. The tension in the room thickened as Hale turned his attention to him. “And you didn’t notice anything unusual?” he pressed, his tone probing.

Beatrice shook her head, her eyes darting between Hale and Finch. “No, everything seemed perfectly normal. I can’t understand how this could have happened. Eleanor was… she was so full of life.” His voice trembled, and Finch could see the fear etched on his features. He felt a pang of sympathy for his plight, but the suspicion that lingered in the air was undeniable. Each of them had a motive, and the stakes were rising with every passing moment. Hale's gaze remained fixed on Beatrice, his instincts telling him that something was amiss.

“We should examine her belongings for any clues,” Finch suggested, stepping closer to the desk where Eleanor had spent her final moments. Papers were strewn about, and a half-finished letter lay open, as if she had been interrupted mid-thought. Beatrice hesitated, glancing at Hale for reassurance. “Do you really think there could be something here?” she asked, her voice thick with uncertainty. Hale nodded, his mind racing with possibilities. “We won’t know until we look. Every detail matters now.”

As they began to sift through the papers, Finch’s mind raced with the implications of their findings. The clock’s time, the alibis, and the secrets hidden within the manor all intertwined in a complex web of deceit. He could feel the pressure mounting, the weight of their suspicions pressing down on them. “What if someone is lying?” he mused aloud, glancing at Hale. “What if we can’t trust each other?”

Hale’s expression hardened, the resolve in his eyes sharpening. “We must be vigilant. Trust is a luxury we can’t afford right now.” The atmosphere in the room shifted, each character acutely aware of the stakes involved. Beatrice’s nervous glances at the clock did not go unnoticed, and Finch felt a flicker of doubt creep into his mind. Could she be hiding something? The tension in the room was palpable, each heartbeat echoing the uncertainty that loomed over them. They were all entangled in a dance of suspicion, each step bringing them closer to the truth—or deeper into the shadows.
--- END PRIOR CHAPTER 2 ---

--- BEGIN PRIOR CHAPTER 3 ---
Title: Chapter 3: The First Clue
At midday, the atmosphere in the study of Little Middleton Manor felt charged with the weight of revelation. Outside, the steady patter of rain against the windowpanes created a rhythmic backdrop, a stark contrast to the tension that enveloped the room. the captain Hale stood near the mantelpiece, his gaze fixed on the clock that loomed ominously above. The hands were frozen at ten minutes past eleven, a detail that gnawed at him like a relentless itch. The implications of that time pressed heavily on her mind, suggesting that Eleanor Voss had met her end shortly after the clock struck eleven, contradicting the alibis of those who had been present. If the clock was tampered with, then the time of death may be earlier than this, she thought, the realization sending a chill down her spine.

Hale approached the clock, his heart racing as he examined the intricate design, searching for signs of tampering. His fingers brushed against the cold surface, and he noticed something peculiar—a series of faint scratch marks on the clock face, barely visible but unmistakable. "Look here," he called out, his voice steady despite the turmoil within. "There are scratch marks on the clock face. It appears someone has tampered with it." The revelation hung in the air, each word echoing the growing unease among them. Hale's mind raced with the implications. If the clock had been altered, it could mean that the timeline they were working with was fundamentally flawed, shifting the very foundation of their investigation.

the doctor Finch stepped closer, his brow furrowing as he took in the sight of the clock. "This is troubling. If the clock was indeed tampered with, it could mean that our understanding of when Eleanor died is completely incorrect. We need to consider the possibility that someone wanted to mislead us about the time of her death." Finch's voice was laced with urgency, and he exchanged a glance with Hale, both men acutely aware of the stakes involved. The room felt as though it were closing in on them, the walls whispering secrets that begged to be uncovered. "We must find out exactly when he was last seen," Finch continued, his mind racing with possibilities. "If we can establish that, we might be able to narrow down our list of suspects."

Beatrice Quill, standing near the door, felt her heart race as she processed the implications of Hale's discovery. "Eleanor was last seen alive at a quarter past eleven," she murmured, her voice barely above a whisper. The weight of the statement settled heavily in the room, and he could see the tension in Hale's posture as he absorbed the information. "If he was last seen at a quarter past eleven, and the clock shows ten minutes past eleven, then we have a very small window of time to work with," Hale replied, his voice firm. "We need to determine who was where during that crucial period. Every moment counts now."

The atmosphere thickened with suspicion as they began to piece together the timeline. Finch turned to Beatrice, his expression serious. "You were in the drawing room last night, correct? Did you notice anything unusual during the evening?" Beatrice shook her head, her eyes darting nervously between the two men. "No, everything seemed perfectly normal. We were all just enjoying the evening. I can't fathom how this could have happened. Eleanor was... she was so full of life." His voice trembled, and Finch could see the fear etched on his features. The weight of the situation pressed heavily on them all, and he felt a pang of sympathy for his plight, but the suspicion that lingered in the air was undeniable.

Hale's gaze remained fixed on Beatrice, his instincts telling him that something was amiss. "We should examine Eleanor's belongings for any clues that might help us understand what happened last night," she suggested, stepping closer to the desk where Eleanor had spent her final moments. Papers were strewn about, and a half-finished letter lay open, as if she had been interrupted mid-thought. Finch joined him, his eyes scanning the desk for anything that might provide insight into the events leading up to Eleanor's death. "Every detail matters now," he said, his voice low but resolute. Beatrice hesitated, glancing at Hale for reassurance. "Do you really think there could be something here?" she asked, her voice thick with uncertainty. Hale nodded, his mind racing with possibilities. "We won't know until we look. Let's not overlook anything that might help us piece this together."

As they began to sift through the papers, Finch's mind raced with the implications of their findings. The clock's time, the alibis, and the secrets hidden within the manor all intertwined in a complex web of deceit. He could feel the pressure mounting, the weight of their suspicions pressing down on them. "What if someone is lying?" he mused aloud, glancing at Hale. "What if we can't trust each other?" The atmosphere in the room shifted again, tension rippling through the air as they considered the possibility that one among them might be the murderer. Hale's expression hardened, the resolve in his eyes sharpening. "We must be vigilant. Trust is a luxury we can't afford right now," he stated, his voice steady despite the chaos swirling around them. The stakes had never been higher, and each of them was acutely aware of the delicate balance they were walking.

As they continued their investigation, the weight of Eleanor's death loomed over them like a dark cloud. The scratch marks on the clock face indicated tampering, casting doubt on the timeline of events. Each suspect had access to Eleanor, and the realization that any one of them could be responsible for her death gnawed at their minds. The study, once a place of comfort and knowledge, now felt like a chamber of secrets, holding its breath as they delved deeper into the mystery. With every passing moment, the tension escalated, and the truth seemed to slip further from their grasp, hidden behind layers of deception and fear.
--- END PRIOR CHAPTER 3 ---

[SCENE COMPLETENESS CONTRACTS — MANDATORY. Each contract below lists what you MUST enact in that chapter. Do not summarise or mention these labels in the prose — enact them organically.]
Chapter 4 (Act 2) completeness contract:
  PIVOT ELEMENT (MANDATORY — write this into the prose, shown not told): "Beatrice's admission of her desire for independence."
  FACT ESTABLISHED (MANDATORY — reader must know this by chapter end): "Establishes Beatrice's ambition, hinting at possible motives tied to Eleanor's secrets."

# Case Overview
Title: The Clockwork Conspiracy
Era: 1930s
Setting: Little Middleton
Crime: murder (timed poisoning)
Culprit: Beatrice Quill
False assumption: Eleanor Voss was killed shortly after the clock struck twelve.
Cast: Eleanor Voss (she/her), Dr. Mallory Finch (he/him), Captain Ivor Hale (he/him), Beatrice Quill (she/her)

Setting Lock: Keep all scenes and descriptions consistent with the stated setting (Little Middleton). Do not introduce a different location type.

Outline scenes:
[
  {
    "sceneNumber": 4,
    "act": 2,
    "title": "Questioning Beatrice",
    "setting": {
      "location": "the drawing room",
      "timeOfDay": "Afternoon",
      "atmosphere": "Tension hangs in the air as suspicions mount"
    },
    "characters": [
      "Eleanor Voss",
      "Beatrice Quill"
    ],
    "purpose": "Uncover Beatrice's potential motives and alibi",
    "cluesRevealed": [
      "clue_id_1",
      "clue_4"
    ],
    "dramaticElements": {
      "conflict": "Beatrice's ambition clashes with her ethical considerations.",
      "tension": "Eleanor presses for details about Beatrice's whereabouts.",
      "microMomentBeats": [
        "Beatrice's hands tremble slightly as she speaks."
      ]
    },
    "summary": "Eleanor questions Beatrice about her relationship with the victim and her whereabouts during the time of the murder. Beatrice reveals her desire for independence and hints at secrets Eleanor may have had. The tension rises as Eleanor senses Beatrice's evasiveness.",
    "estimatedWordCount": 1800,
    "pivotElement": "Beatrice's admission of her desire for independence.",
    "factEstablished": "Establishes Beatrice's ambition, hinting at possible motives tied to Eleanor's secrets.",
    "permittedBehavioursByAct": [
      {
        "characterName": "Eleanor Voss",
        "behaviour": "may show unease or mild defensiveness when questioned"
      },
      {
        "characterName": "Beatrice Quill",
        "behaviour": "may show unease or mild defensiveness when questioned"
      }
    ],
    "redHerringPlacement": null,
    "emotionalRegister": "Initial clues lead to a web of deceit, complicating the investigation.",
    "dominantCharacterNote": {
      "name": "Eleanor Voss",
      "voiceRegister": "Eleanor's voice is smooth and melodic, often laced with a hint of sarcasm that reflects her inner turmoil."
    },
    "humourGuidance": {
      "permission": "permitted"
    },
    "eraTextureNote": "Communication is slow, relying on telegrams and letters.; Travel is limited due to economic conditions and social etiquette.; Social gatherings are fraught with the pressure of maintaining appearances.",
    "locationRegisterNote": "The drawing room feels heavy with the weight of secrets and tragedy, where every element—from the faded drapes to the silent piano—whispers of a life interrupted. It is both beautiful and foreboding, a space that once echoed with laughter now haunted by silence. — A writer entering this space should feel the tension of unspoken words and the ghost of Eleanor's presence lingering in the air."
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
  Dr. Mallory Finch    | he/him/his/himself        | [fill in]     | [yes/no]
  Captain Ivor Hale    | he/him/his/himself        | [fill in]     | [yes/no]
  Beatrice Quill       | she/her/her/herself       | [fill in]     | [yes/no]
□ Return valid JSON only.
```
