# Actual Prompt Record

- Run ID: `mystery-1779009530668`
- Project ID: ``
- Timestamp: `2026-05-17T09:23:26.577Z`
- Agent: `Agent9-ProseGenerator-Ch4`
- Operation: `chat_request_full_prompt`
- Model: `GPT-4o-mini`
- Temperature: `0.42`
- Max Tokens: `4500`
- Attempt: `first`
- Prompt Hash: `5b8f4d6d956ccff7`

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
- MORAL COMPLEXITY REQUIREMENT: The mechanism of this crime carries a moral gray area: "The culprit, driven by a desperate need to protect a loved one, reveals the gray line between right and wrong in the pursuit of justice." — the culprit reveal and denouement MUST acknowledge this ambiguity. Do not let the ending feel clean or simple. Give the reader at least one moment of uncomfortable sympathy or moral doubt.


⚠️ AMATEUR DETECTIVE STORY: The investigator is a civilian with no official standing. The official police (if they appear) are unnamed background figures only — "a constable", "the sergeant", "an officer from the village". Do NOT give any police official a name or title+surname combination. There is no Inspector [Surname], no Constable [Surname], no Sergeant [Surname] in this story.

⛔ ABSOLUTE PRONOUN LOCK — NO EXCEPTIONS

The following pronouns are locked facts, on the same level as character names
and hard-logic device values. Using the wrong pronoun is a continuity error,
not a style choice.

Canonical pronoun table (subject / object / possessive / reflexive):
  • Eleanor Voss: ALWAYS she/her/her/herself — NEVER he/him/his/himself
  • Dr. Mallory Finch: ALWAYS he/him/his/himself — NEVER she/her/herself
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
   WRONG: \"I have no alibi,\" Finch said. He turned away. (if Finch is female,
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

## Era: 1931-08
In the summer of 1931, the British countryside is marked by the specter of the Great Depression, with rising unemployment casting a pall over the lives of many. The genteel façade of Little Middleton Manor hides the societal tensions of the time, where the wealthy mingle with the desperate, each person feeling the strain of dwindling resources. The air is thick with humidity and the scent of impending rain, mirroring the unease among the guests at the estate. As they gather for social events, the laughter and clinking of teacups serve as a brittle veneer over the underlying anxieties about class disparity and political unrest. The tension of a society on the brink of change hangs like a cloud, threatening to burst at any moment.
Emotional register: The dominant emotional state is one of anxiety and foreboding, as individuals grapple with their precarious social standing.
Physical constraints: Limited communication due to the absence of modern technology | Travel restricted by fuel shortages and economic conditions | Social gatherings governed by strict etiquette and formality
Current tensions (weave into background texture): Rising unemployment rates due to the Great Depression | Political unrest with growing support for fascist movements | Social tensions stemming from class inequality
Wartime context — Many men are returning from service in the First World War, bearing emotional scars.: The absence of these men is felt deeply in communities, where their roles were vital in upholding family and social structures. Absence effect: This absence creates a vacuum of authority, leading to a rise in tensions among those left behind.

## Story Theme
The Clockwork Conspiracy explores how hidden motives and societal pressures intertwine, leading individuals to commit unforgivable acts in the name of self-preservation, and reveals that evidence carries ethical weight, forcing characters to choose accountability over social performance when appearances and facts collide.

## Story Emotional Register
Dominant: Tension and suspense build throughout the investigation, leading to a dramatic climax.

Arc:
The atmosphere begins in Little Middleton Manor, where the guests gather under overcast skies, the air thick with unspoken tensions and the scent of rain. As Eleanor Voss is found dead, her demise shrouded by the tampered clock, the mood shifts from festive to somber. The investigation unfolds as suspicion grows amongst the guests, revealing hidden motives and strained relationships. Each clue unearthed only deepens the emotional cost, particularly for Eleanor, whose past and ties to the victim complicate her quest for truth. The first investigative turn exposes Dr. Finch's proximity to the clock, leading to an initial wave of accusations, but a mid-story pivot reveals his alibi, forcing Eleanor to reassess her suspicions. A second turn uncovers the truth about the clock's tampering, shifting the focus back to Eleanor herself, forcing her to confront her darkest secrets. As pressure mounts, the climax builds to a confrontation where Eleanor must face the consequences of her actions, culminating in a revelation that shatters the fragile peace of the manor. The resolution sees the characters grappling with their choices, leaving them forever altered, burdened by the ghosts of their pasts and the inevitability of their futures.

The story opens: The gathering begins with a festive atmosphere overshadowed by unspoken tensions. As the investigation takes shape: The discovery of Eleanor's body shifts the mood into one of shock and suspicion. A first key turn arrives: The investigation reveals Dr. Finch's proximity to the clock, raising initial doubts. At the mid-point of the story: Dr. Finch's alibi clears him, forcing a reevaluation of the evidence.

A second pivot reshapes the course: The revelation about the clock's tampering shifts focus back to Eleanor. As tension reaches its height: Mounting pressure leads to a confrontation regarding Eleanor's secrets. The climax brings the central question to a head: The truth about the tampering and Eleanor's role comes to light. In the final resolution: Characters are left to grapple with the emotional fallout of their actions.

Underpinning every turn is the story's central concern: The Clockwork Conspiracy explores how hidden motives and societal pressures intertwine, leading individuals to commit unforgivable acts in the name of self-preservation. This thread binds the individual emotional moments into a coherent journey.

The dominant register — Tension and suspense build throughout the investigation, leading to a dramatic climax. — colours the prose from first chapter to last, ensuring the reader feels the weight of each revelation as moral consequence rather than mere puzzle mechanics.

## Emotional register at this point in the story
The investigation reveals Dr. Finch's proximity to the clock, raising initial doubts.

## Character Portraits (appearance & era)

### Eleanor Voss
Eleanor Voss embodies the struggles and aspirations of women in the 1930s, caught in a web of societal expectations and personal desires. As a historian, she should be a beacon of knowledge, yet her ties to the victim reveal the complexity of her position. Her pursuit of truth is not merely academic; it is rooted in a fierce battle for her legacy and a desperate need to reclaim her narrative amidst a changing world.
Era intersection: Eleanor's investigation reflects the increasing pressure on women to assert their independence in a society steeped in patriarchal norms.

## Character Voices

### Eleanor Voss (she/her/her)
Eleanor's voice is warm and inviting, often tinged with an undercurrent of introspection that hints at her deeper concerns.
[comfortable] I find solace in the stories of our past, they connect us to who we are.
[evasive] Oh, I was just cataloguing the artifacts; nothing of importance, really.
[stressed] I can't shake the feeling that the truth is just out of reach, and it terrifies me.
Humour: Eleanor occasionally employs observational humor, using anecdotes to diffuse tension.

## Location Registers (scene framing guides)

The Library: The library, once a sanctuary of knowledge, now feels heavy with the weight of tragedy. Dust motes swirl in the flickering candlelight, and the air is thick with the scent of old parchment and despair. Every creak of the floorboards echoes the secrets that linger, turning this room of history into a chamber of dread.. Camera angle: As a writer enters this space, they should capture the tension that permeates the air, hinting at the tragic events that have unfolded.. Era: In this era, libraries symbolize both refuge and the burden of knowledge, as guests grapple with the past's weight.

The Drawing Room: The drawing room, lavishly adorned, serves as the stage for social interactions filled with unspoken tension. Laughter feels hollow, and the opulence is overshadowed by an air of suspicion. Guests exchange furtive glances, each aware that beneath the surface of civility lies a web of hidden motives and fear.. Camera angle: Entering the drawing room, the writer should focus on the stark contrast between the room's elegance and the brewing storm of emotions.. Era: This space captures the constraints of social etiquette during the 1930s, where appearances must be upheld despite inner turmoil.

The Study: The study is a realm of contemplation, where every shadow seems to hide secrets. The weight of unspoken decisions hangs heavy in the air, and the ticking clock serves as a reminder of time slipping away. This space feels both claustrophobic and introspective, reflecting the turmoil within those who dare to enter.. Camera angle: The writer should approach this space with a sense of foreboding, capturing the urgency that permeates the atmosphere.. Era: Within the confines of this study, the tensions of the era are magnified, as characters confront their inner demons.

The Gardens: The gardens, lush and vibrant, provide a stark contrast to the tension inside the manor. However, they also harbor secrets and potential dangers, with their winding paths leading into the shadows of the woods. As day turns to dusk, the beauty of the blooms feels both enchanting and ominous, hinting at the unraveling drama.. Camera angle: As a writer wanders through the gardens, they should emphasize the allure and danger of this space, capturing the delicate balance between beauty and deception.. Era: The gardens reflect the strict social codes of the era, where leisure masks underlying tensions and secrets.

## Humour guidance for this story position (first_turn)
Permission: forbidden
Rationale: Tension and potential conflict leave no room for humor.

## Reveal Groundwork (texture — do not explain, only plant)
- Plant one subtle observable beat related to: "The moment in the drawing room when Eleanor's past with the victim is hinted at serves to deepen the mystery surrounding her motives". Do not explain significance yet.
- Plant one subtle observable beat related to: "The earlier scene where Dr". Do not explain significance yet.
- Plant one subtle observable beat related to: "Finch is seen near the clock suggests a potential red herring that is later resolved, revealing deeper truths". Do not explain significance yet.

FAIR-PLAY AND INFERENCE CONTRACT (from CML logic):
- False assumption in force: The murder occurred shortly after the last sighting of Eleanor.
- Hidden truth to progressively expose: The clock was tampered with to misrepresent the time.
- Inference path checkpoints to dramatize clearly (observation -> correction -> effect):
  - Step 1: obs: The clock in the study shows the time as ten minutes past eleven. | corr: Since Eleanor was last seen alive at ten o'clock, the clock must have been tampered with. | effect: Narrows the timeline of the murder, suggesting it was after ten o'clock.
  - Step 2: obs: Witness statements confirm Eleanor was alive at ten o'clock. | corr: If the clock was tampered with, the time of death must be later than shown. | effect: Eliminates the possibility of death occurring before ten o'clock.
  - Step 3: obs: Scratch marks on the clock face indicate tampering. | corr: The tampering would require someone to access the clock just before the murder. | effect: Narrows suspicion to those who had access to the clock.
- Discriminating test method: trap
- Discriminating test design constraint: The discriminating test compares clock, tamper, and study against the claimed timeline.
- Test must rely on already-shown clue IDs: clue_1, clue_2, clue_3, clue_4
- Fair-play rationale: Step 1: The clock's tampering is evident from the scratches (early) and witness statements (mid) clarify the timeline. Step 2: The fresh scratch evidence (mid) eliminates other suspects. Step 3: The controlled clock comparison (discriminating test) directly proves the clock was manipulated.
- Never solve by withheld information. Keep reader-information parity with detective reasoning.

## Character Reference

### Eleanor Voss (she/her — NEVER he/him)
Eleanor speaks with a gentle cadence, often punctuating her thoughts with a light chuckle
She has a tendency to weave anecdotes into her conversations, using them as a bridge to connect with others
Occasionally, she slips into a more formal tone when discussing historical matters, a subtle reminder of her scholarly background.
Eleanor is torn between her desire for closure regarding her past relationship and the fear that uncovering the truth could lead to further heartbreak.


## CHARACTER CONTRACTS (binding for this scene)
Each entry below constrains how this character must be written in this chapter.
These override generic style guidance when they conflict.

### Eleanor Voss[SHE]
Voice & mannerisms: Eleanor speaks with a gentle cadence, often punctuating her thoughts with a light chuckle. She has a tendency to weave anecdotes into her conversations, using them as a bridge to connect with others. Occasionally, she slips into a more formal tone when discussing historical matters, a subtle reminder of her scholarly background.
Sample voice fragments (match this register and rhythm):
  [comfortable] "I find solace in the stories of our past, they connect us to who we are."
  [evasive] "Oh, I was just cataloguing the artifacts; nothing of importance, really."
Humour: observational — deploy occasionally (level 0.5)
FORBIDDEN phrase (never write for Eleanor Voss): "everyone could sense the atmosphere"
Act 2 behaviour contract: May show unease, evasion, or mild defensiveness when questioned. One behavioural tell is permitted. Internal conflict emerging: "Eleanor is torn between her desire for closure regarding her past relationship and the fear that uncovering the truth could lead to further heartbreak."



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
A sprawling manor house steeped in secrets, set amidst manicured gardens and dense woods, where the tension of recent social unrest simmers beneath the surface.

Key Locations Available:
- The Library (interior): Crime scene
- The Drawing Room (interior): Gathering space
- The Study (interior): Private meeting space
- The Gardens (exterior): Potential hiding spots and clue discovery

Atmosphere: Tense and foreboding due to recent social unrest and economic hardship, creating an atmosphere of suspicion among the guests.
Weather: Overcast with sporadic rain, typical of the British countryside in the fall, affecting visibility and mood.

Era markers: Petrol automobiles parked along the cobblestone drive | Typewriters clattering in the study | Early telephones ringing in the hall

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
  - Visual: Dust motes dancing in candlelight, Dark oak shelves filled with leather-bound books, Faded wallpaper peeling at the edges
  - Sounds: The crackle of wax melting, Whispers of pages turning, Distant thunder rumbling outside
  - Scents: Mildew and old parchment, Beeswax from burning candles, The musty scent of leather bindings
  - Touch: Worn leather armchair, Cold brass doorknob

The Drawing Room (interior):
  - Visual: Rich tapestry curtains drawn against the light, Glistening chandelier casting soft light, Family portraits lining the walls
  - Sounds: The soft notes of piano music, Laughter echoing from the guests, The rustle of silk dresses
  - Scents: Fresh flowers in a vase, The scent of polished wood, Hints of perfume lingering in the air
  - Touch: Soft velvet upholstery, Cool marble fireplace mantle

The Study (interior):
  - Visual: Heavy curtains drawn tight against the light, A large mahogany desk covered in documents, Shelves brimming with leather-bound books
  - Sounds: The scratch of a pen on paper, The ticking of a clock, Quiet rustling of documents
  - Scents: Fresh ink and paper, The scent of polished wood, Hints of tobacco smoke lingering
  - Touch: Smooth surface of the desk, Cool brass handles on drawers

⛔ REFERENCE DATA — DO NOT TRANSCRIBE VERBATIM: The above profiles are structural guides only. Generate original prose that evokes these qualities; do not reproduce the exact phrasing or sentence structure of the profile paragraphs.

SCENE OPENING RULE: When opening a scene in a new location, write what the POV character directly observes and physically senses at that moment — not a general description of the room's qualities. The reader must feel present, not briefed. Sensory details must be observed by the character, not stated as fact about the place.

SENSORY WRITING TECHNIQUES:
- Opening paragraphs: Lead with 2-3 sensory details to ground the scene
- Movement between locations: Note sensory changes (quiet study → noisy dining room)
- Emotional scenes: Use sensory details to reinforce mood
[truncated for prompt budget]

## Texture Pool
Draw on these as opportunities arise — you are not required to use them.

- In the summer of 1931, the British countryside is marked by the specter of the Great Depression, with rising unemployment casting a pall over the lives of many
- The genteel façade of Little Middleton Manor hides the societal tensions of the time, where the wealthy mingle with the desperate, each person feeling the strain of dwindling resources
- The air is thick with humidity and the scent of impending rain, mirroring the unease among the guests at the estate
- As they gather for social events, the laughter and clinking of teacups serve as a brittle veneer over the underlying anxieties about class disparity and political unrest
- The tension of a society on the brink of change hangs like a cloud, threatening to burst at any moment.

TEMPORAL CONTEXT:

This story takes place in August 1931 during summer.

Seasonal Atmosphere:
- Weather patterns: overcast with sporadic rain, humid air with occasional gusts of wind, cool evenings that hint at the coming autumn
- Daylight: Long summer days with daylight lasting until about eight-thirty in the evening, though the clouds often obscure the sun.
- Seasonal activities: garden parties with tea and croquet, evening strolls along the estate grounds, visiting nearby fairs and local markets
- Seasonal occasions: Notting Hill Carnival (begins in late August)
- Season: summer

Period Fashion (describe naturally):
- Men formal: tailored morning coat, waistcoat in muted colors, crisp white shirt with a stiff collar
- Men casual: tweed flat cap, cotton trousers, lightweight summer blazer
- Men accessories: polished leather shoes, silver pocket watch, silk cravat
- Women formal: elegant tea dress with floral patterns, lightweight silk evening gown, tailored jacket with a cinched waist
- Women casual: cotton blouse with puffed sleeves, A-line skirt, straw hat adorned with ribbons
- Women accessories: pearl necklace, dainty gloves, handbag with intricate beadwork

Cultural Context (reference naturally):
- Music/entertainment: 'The Lady Is a Tramp' by the popular bands of the day, 'Ain't She Sweet' by Al Jolson, 'It Ain't Necessarily So' from Porgy and Bess; Films: 'City Lights' starring Charlie Chaplin, 'Frankenstein' directed by James Whale; Theatre: 'The Royal Family' by George S. Kaufman, 'The Cat and the Moon' by W.B. Yeats; Radio: The BBC's evening broadcasts featuring classical music, Variety shows featuring popular comedians
- Typical prices: Loaf of bread: four pence, Cinema ticket: one shilling, Bottle of milk: seven pence
- Current events: rising unemployment rates due to the Great Depression; political unrest with growing support for fascist movements
- Literature: 'Murder in the Mews' by Agatha Christie | 'The Glass Key' by Dashiell Hammett | 'To the Lighthouse' by Virginia Woolf | [detective fiction] | [social realism] | [modernist literature]
- Technology: the first commercially available radio receiver | advances in aviation with the introduction of passenger airlines | emergence of household appliances like electric irons | petrol-powered automobiles | landline telephones in homes | manual typewriters
- Daily life: afternoon tea with scones and jam, visiting local fairs and community events, participating in sports like cricket and tennis
- Social rituals: formal dinner parties with multiple courses, Sunday church services followed by family gatherings

Atmospheric Details:
The smell of damp earth and lush green grass permeates the air as summer wanes, with the scent of impending rain lingering. The muted sounds of distant thunder rumble over the estate, heightening the sense of unease amongst the guests gathered at the manor. The flickering gas lamps cast shadows across the elegantly set dining room, where the tension of conversation hangs thick like the humidity outside.

FASHION INTEGRATION TECHNIQUES:
- First appearance: Describe outfit to establish class/personality
- Accessories: Gloves, hats, pocket watches, jewelry reveal status
- Time-specific: Different outfits for different times of day
- Character traits: Fastidious dresser vs rumpled appearance
- Action integration: "She tugged at her
[truncated for prompt budget]

NON-NEGOTIABLE CHAPTER OBLIGATIONS — LOCKED EVIDENCE PHRASES (VERBATIM REQUIRED):
The following physical evidence values are absolute ground truth. Every time this chapter describes, mentions, or alludes to the relevant evidence — no matter how briefly — it MUST use the exact phrase shown below, character for character. NO paraphrase, approximation, rounding, or synonym is permitted.

FAILURE EXAMPLE: if the locked value is "at thirteen minutes to midnight" and you write "just before midnight" or "around midnight" — that is a HARD FAIL. You must write "at thirteen minutes to midnight". Equally, if the locked value is written in words, such as "ten minutes past eleven", and you convert it to figure-based clock notation — that is also a HARD FAIL. Words stay as words; figure forms are forbidden for word-phrased facts.

CRITICAL — WORD-PHRASED VALUES: If the canonical value is written out in words (e.g. a time like "ten minutes past eleven", or an amount like "forty minutes"), reproduce those exact words. DO NOT convert to figure-based time notation, twenty-four-hour format, or any other numeric shorthand. Correct: "ten minutes past eleven". WRONG: figure-based clock notation or numeric shorthand.

Locked facts:
  - The exact time shown on the stopped clock face: "ten minutes past eleven"
    ⛔ FORBIDDEN alternatives: "11:10", "11.10", "eleven ten", "eleven-ten", "eleven past ten", "quarter past eleven", "half past eleven" — the ONLY acceptable form is "ten minutes past eleven"
  - The exact amount the clock was wound back: "forty minutes"
  - The actual time of the murder based on the tampered clock: "a quarter past ten"
  - The distance from the clock room to the nearest exit: "thirty feet"

If a locked fact has no relevance to this chapter, omit it. But the moment you reference the underlying evidence, only the exact phrase above is acceptable.

⛔ CLUES TO SURFACE IN THESE CHAPTERS — mandatory:
The following evidence MUST be clearly observable to an attentive reader. Do not bury it in atmosphere or passing dialogue. Each clue must be concrete, specific, and noticeable:

• [clue_3] Scratch marks on the clock face indicate tampering.
  Category: temporal | Criticality: essential | Supports inference step 2
  Points to: Suggests that the clock has been manipulated.

• [clue_7] Eliminates Captain Ivor Hale because he was seen at a different location during the murder.
  Category: testimonial | Criticality: essential | Supports inference step 2
  Points to: Captain Ivor Hale has a corroborated alibi.

For each clue above: an attentive reader should be able to find, record, and later use it to reason toward the solution.

═══ NARRATIVE STATE (read-only — do not contradict) ═══

LOCKED FACTS — use verbatim whenever this evidence is described:
  • The exact time shown on the stopped clock face: "ten minutes past eleven"
  • The exact amount the clock was wound back: "forty minutes"
  • The actual time of the murder based on the tampered clock: "a quarter past ten"
  • The distance from the clock room to the nearest exit: "thirty feet"

CHARACTER PRONOUNS — never deviate from these:
  • Eleanor Voss: she/her/her
  • Dr. Mallory Finch: he/him/his
  • Captain Ivor Hale: he/him/his
  • Beatrice Quill: she/her/her

CLUES ALREADY REVEALED TO READER: clue_1, clue_2, clue_core_contradiction_chain, clue_mechanism_visibility_core — do not reveal these as new information.

INVESTIGATION LOG — WHAT IS ESTABLISHED (do not re-establish, do not repeat):
• Evidence in reader's hands: The clock in the study shows the time as ten minutes past eleven. | Witness statements confirm Eleanor was alive at ten o'clock. | Since Eleanor was last seen alive at ten o'clock, the clock must have been tampered with. | The clock was wound back to create a false timeline for the murder.
• Suspects still unresolved: Dr. Mallory Finch[HE], Captain Ivor Hale[HE], Beatrice Quill[SHE]
⚠ The story must move FORWARD from this log. Any beat already listed above is forbidden from repeating.

⚠ THIS CHAPTER'S REQUIRED ADVANCE (first_turn): Examine physical evidence — find at least one new clue

CONTINUITY HANDOFF — previous chapter closing beat:
  • "As she approached the clock, Eleanor felt a surge of determination. The clock's face, still frozen at ten minutes past eleven, held the key to unraveling the mystery. She examined it closely, noting the faint scratches around the winding mechanism. 'This tampe..."
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
study, manor, drawing room

✓ RULE: Continue using this location vocabulary. Maintain consistency with established setting type.
✓ Do NOT introduce new location types that contradict earlier chapters.

**Recent Chapter Summary (for narrative continuity):**
Chapter 1: Chapter 1: Discovery
  Events: Eleanor Voss stepped into the study, her heart racing as the sound of rain tapped insistently against the windowpanes.
Chapter 2: Chapter 2: Interviews Begin
  Events: “We must get to the bottom of this,” Eleanor Voss declared, her voice steady despite the storm raging outside.
Chapter 3: Chapter 3: Cross-Examination
  Events: The afternoon light struggled to pierce the overcast sky, casting a muted glow through the windows of the study.

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
Known location profile anchors: Little Middleton Manor, The Library, The Drawing Room, The Study, The Gardens, the study
LOCATION NAME CAPITALISATION (HARD REQUIREMENT — validated):
All named locations in your prose MUST use the EXACT capitalisation from the CML profiles.
Canonical forms: "Little Middleton Manor", "The Library", "The Drawing Room", "The Study", "The Gardens", "the study"
Writing a location in lowercase (e.g. "drawing room" instead of "Drawing Room") is a validated error. Every time you mention a named location, copy its capitalisation from the list above.
- Chapter 4: OPENING STYLE (HARD): Start the VERY FIRST SENTENCE with a noun-phrase atmosphere — e.g. "The smell of damp stone in the cellar…" / "A chill from the landing…" / "The sound of the clock in the hall…". Pattern: "The/A [noun] of/in/from [place]…". Anchor opening in "the study". HARD REQUIREMENT for the first 2 paragraphs: (a) include 2+ sensory words — choose from smell/scent/sound/echo/silence/creak/whisper/cold/warm/damp/rough/smooth/glow/shadow/flicker/dim — and (b) include 1+ atmosphere/time word — choose from rain/wind/fog/storm/mist/thunder/evening/morning/night/dawn/dusk/season/afternoon/midday/noon/midnight/twilight/sunrise/sunset/daylight/sunlight/overcast/cloudy/bright/dark. These are validated requirements, not style suggestions; missing them triggers a retry.

[⚠ INTERNAL QUALITY DIAGNOSTICS — DO NOT REPRODUCE ANY PART OF THIS SECTION IN YOUR STORY OUTPUT. These are private generator observations for your consideration only. Your narrative must read as if this section does not exist. Never include phrases from this block in character dialogue, narration, or description.]

PRIOR CHAPTER QUALITY OBSERVATIONS:
- Chapter 2 (score 88/100):
  Quality gaps noted: word density below preferred target (711/1000); scene grounding weakness
  Address in upcoming chapters: Increase chapter density with concrete investigation action and sensory-grounded beats; avoid recap-only padding. | Open next chapter with a named location anchor plus at least two sensory cues and one atmosphere marker.
- Chapter 3 (score 97/100):
  Quality gaps noted: word density below preferred target (966/1000); scene grounding weakness
  Address in upcoming chapters: Increase chapter density with concrete investigation action and sensory-grounded beats; avoid recap-only padding. | Open next chapter with a named location anchor plus at least two sensory cues and one atmosphere marker.
[END INTERNAL DIAGNOSTICS]

PROMPT BUDGET SUMMARY: budget=32000 tokens; fixed=9160; context=10049; dropped=[none]; truncated=[pronoun_accuracy, location_profiles, temporal_context]

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
8. Integrate at least two concrete era-grounded details per chapter from setting refinement signals: petrol automobiles on winding country roads | early telephones in homes | typewriters as the standard for written communication | party-line telephone exchanges | telegram services available for urgent messages | airmail for faster delivery of correspondence.
9. Respect setting movement/access constraints in scene action and alibis: layout allows for restricted access to certain areas like the library and study | gardens provide potential hiding spots for evidence | weather can impede movement and visibility, especially during rain | Certain rooms are off-limits to staff and guests, such as the owner's private office | Daily schedules dictate when areas are used, impacting evidence visibility.
10. Sustain social coherence with this backdrop pressure: A gathering at the estate for a wealthy benefactor's birthday is overshadowed by class tensions and the looming threat of social upheaval, binding the guests in a web of suspicion and hidden motives.
11. Maintain continuity around these socially central cast anchors where relevant: Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill.
12. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Critical: Plot similarity 0.80 with 'The Mysterious Affair at Styles' (same era, similar murder method involving timing)
13. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Moderate: Setting similarity 0.90 with 'The Mysterious Affair at Styles' (same era and country manor setting)
14. STORY TO DATE ANTI-COPY RULE: The STORY TO DATE section below is provided for chronological and factual reference ONLY. You MUST NOT copy, lightly rephrase, or structurally echo any sentence or paragraph from prior chapters. Every sentence in this chapter must be original prose unique to this scene. Reusing even a clause from prior chapter text will cause this attempt to fail immediately.

CRITICAL PROSE REQUIREMENTS:

The CML specifies exact requirements for certain validation-critical scenes. You MUST include these elements at the specified positions.

**Discriminating Test Scene (Act 3, Scene 4):**
Required elements: Execute the discriminating test, Observe the clock's response to the test, Draw conclusion about the tampering
Test type: comparison

**Suspect Clearance Scenes:**
- Dr. Mallory Finch (Act 3, Scene 5): His alibi is confirmed by witnesses, who saw him in the dining room.
  Clues: Witness statements about his location, His access records during the murder.
- Beatrice Quill (Act 3, Scene 5): Her alibi is verified through the staff schedule.
  Clues: Staff schedules showing her duties at the time., Witness accounts of her activities.
- Captain Ivor Hale (Act 3, Scene 5): Alibi confirmed: 10:30 PM to 11:00 PM

**Culprit Revelation Scene (Act 3, Scene 6):**
Method: Confrontation with evidence from the clock.

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
- Chapter 4:
  - STRUCTURAL ARCHETYPE — Chapter 4 must be: ALIBI_PROBE
      ✓ MUST contain: one alibi tested with a stated result
      ✗ MUST NOT contain: 
  - Word count: Target 1250 words. Achieve this through plot events, dialogue exchanges, and physical investigation — not through atmospheric repetition or extended internal reflection. Each 200-word segment should contain at minimum one concrete story event (a discovery, a conversation exchange, a physical action or movement). Padding with atmosphere alone is not acceptable.
  - Opening: Begin with a character action, spoken line, or clock/time marker — never a location name or location-description phrase.
  - Scene is set in: the study — reference it naturally within the paragraph, never as your opening phrase.
  - Opening atmosphere (MANDATORY — validator enforced): the first paragraph MUST contain at least one of: rain / wind / fog / storm / mist / thunder / evening / morning / night / dawn / dusk / season / afternoon / midday / noon / midnight / twilight / sunrise / sunset / daylight / sunlight / overcast / cloudy / bright / dark. A chapter that omits all of these from its opening paragraph will be rejected.
  - Continuity bridge: in the first 120 words, visibly connect from the previous chapter's final beat. Carry forward one unresolved element (object, accusation, emotional pressure, or immediate physical action) from: "As she approached the clock, Eleanor felt a surge of determination. The clock's face, still frozen at ten minutes past eleven, held the key to unraveling the mystery. She examined it closely, noting the faint scratches a...".
  - CLUE OBLIGATIONS — mandatory prose elements (do NOT omit or bury):
    • Scratch marks on the clock face indicate tampering. [clue_3]
      Points to: Suggests that the clock has been manipulated.
    • Eliminates Captain Ivor Hale because he was seen at a different location during the murder. [clue_7]
      Points to: Captain Ivor Hale has a corroborated alibi.
  - Tonal contrast: include at least one beat of relief or ironic counterpoint. Do not sustain maximum tension for every paragraph.
  - Sensory obligation — use at least two of: Dim light struggling to penetrate the curtains, Raindrops sliding down the glass | Rain tapping against the window, The quiet whisper of paper being shuffled | The scent of damp wood. Mood: claustrophobic.

- Tonal contrast required: the previous chapter was high-tension. This chapter must include at least one beat of relief, pause, or quiet observation.
- Locked fact phrase obligations:
  - If this batch mentions The exact time shown on the stopped clock face, write exactly: "ten minutes past eleven".
  - If this batch mentions The exact amount the clock was wound back, write exactly: "forty minutes".
  - If this batch mentions The actual time of the murder based on the tampered clock, write exactly: "a quarter past ten".
  - If this batch mentions The distance from the clock room to the nearest exit, write exactly: "thirty feet".
- Seasonal vocabulary allow-list: summer, summery, midsummer.
- Forbidden seasonal words: spring, autumn, winter.

FROZEN TIMELINE STATE (DO NOT ALTER):
- Timeline anchor: August (summer).
- Month, season, weather, and time-of-year language in this batch must stay compatible with summer.
- Established timeline fact: Eleanor was last seen at ten o'clock.
- Established timeline fact: The clock stopped at ten minutes past eleven.
- If referenced, use exact time phrase: "ten minutes past eleven" (The exact time shown on the stopped clock face).
- If referenced, use exact time phrase: "forty minutes" (The exact amount the clock was wound back).
- If referenced, use exact time phrase: "a quarter past ten" (The actual time of the murder based on the tampered clock).
- If referenced, use exact time phrase: "thirty feet" (The distance from the clock room to the nearest exit).

STORY TO DATE (REFERENCE ONLY — DO NOT COPY VERBATIM):
- Full prior chapter text is provided below for continuity, factual consistency, and reference accuracy.
- Use this to keep character voice, chronology, clue state, and location continuity aligned with earlier chapters.
- Do not quote, copy, or paraphrase these paragraphs too closely; write fresh prose that remains consistent with them.

--- BEGIN PRIOR CHAPTER 1 ---
Title: Chapter 1: Discovery
Eleanor Voss stepped into the study, her heart racing as the sound of rain tapped insistently against the windowpanes. The dim light struggled to penetrate the heavy curtains, casting long shadows that danced across the room. A chill ran through her as she approached the large mahogany desk, where the clock stood ominously still, its face frozen in time. The clock in the study shows the time as ten minutes past eleven. Eleanor's breath caught in her throat as she stared at the clock, its hands betraying the reality of the situation. She felt a wave of nausea wash over her, the implications of that time weighing heavily upon her.

The clock's stillness was a stark reminder of the life that had been snuffed out just moments before. Eleanor's mind raced as she recalled the last time she had seen the victim, Eleanor Voss, alive and vibrant at ten o'clock. How could it be that only ten minutes had passed since then? The thought sent shivers down her spine. The stopped clock showed ten minutes past eleven, establishing that the victim died no later than eleven past eleven, contradicting the alibis of those present. Eleanor's gaze flicked to the others in the room, each of them wearing expressions of shock and disbelief. Who among them could have done such a thing?

Dr. Finch stood near the fireplace, his hands trembling as he absently adjusted his collar. The flickering flames cast a warm glow, but the atmosphere in the room was anything but comforting. 'This is dreadful,' he murmured, his voice barely above a whisper. 'We must call for help.' Her eyes darted toward Eleanor, as if seeking her guidance in the chaos that had erupted around them. Eleanor could see the fear etched on her face, a fear that mirrored her own. She felt a pang of sympathy for her; she was a man of science, not one accustomed to the horrors of murder.

Captain Hale leaned against the doorframe, his arms crossed tightly over his chest. She appeared stoic, yet Eleanor could sense the tension radiating from her. 'We can't just stand here,' she said, her voice firm and commanding. 'We need to figure out what happened.' The urgency in her tone cut through the air like a knife, and Eleanor felt a surge of determination. If they were to uncover the truth, they needed to act quickly. But where to begin? The room was filled with secrets, and each of them had something to hide.

Beatrice Quill, her face pale and drawn, stood near the window, her fingers nervously twisting the hem of her dress. 'What if it was one of us?' she asked, her voice trembling. 'What if we’re all suspects?' The thought hung in the air, heavy with implications. Eleanor's heart sank; the very idea sent a chill through her. Each person in the room had been close to the victim, and now they were bound together by a shared horror. The clock's ticking was a reminder that time was running out, and with it, their chances of solving the mystery before it was too late.

Eleanor took a deep breath, forcing herself to focus. 'We need to examine the body,' she said, her voice steadier than she felt. 'Perhaps there are clues that can help us understand what happened.' The others nodded, and together they approached the lifeless form sprawled on the floor. Eleanor's heart raced as she crouched beside the victim, her mind racing with questions. What had led to this tragic end? And more importantly, who among them had the most to gain from Eleanor's demise?

As she examined the scene, Eleanor noticed the clock again, its hands frozen in time. It was a cruel reminder of the life that had been cut short. She felt an overwhelming sense of responsibility to uncover the truth, not just for herself, but for the victim who could no longer speak. The stopped clock showed ten minutes past eleven, and she knew that it was up to her to piece together the fragments of this shattered reality. The others watched her with a mixture of fear and hope, their futures now intertwined with the fate of the victim. The task ahead would be daunting, but Eleanor was determined to see it through.

The rain continued to summer outside, a relentless reminder of the storm brewing within the walls of Little Middleton Manor. Each drop seemed to echo the tension in the room, a symphony of dread that underscored their predicament. Eleanor glanced at her companions, each lost in their thoughts, and she knew that the investigation would not only reveal the truth about the murder but also the hidden motives that lay beneath the surface. They were all connected now, and the clock was ticking.
--- END PRIOR CHAPTER 1 ---

--- BEGIN PRIOR CHAPTER 2 ---
Title: Chapter 2: Interviews Begin
“We must get to the bottom of this,” Eleanor Voss declared, her voice steady despite the storm raging outside. The rain lashed against the windows of the drawing room, the sound punctuating the tense atmosphere as she glanced at the gathered suspects. Each face was a mask of concern, but Eleanor could sense the underlying currents of fear and suspicion. The opulent surroundings of the drawing room, with its rich tapestry curtains and polished wood, felt stifling under the weight of unspoken truths. She took a deep breath, steeling herself for the task ahead. The clock’s hands had betrayed them all, and it was time to confront the shadows lurking in their hearts.

Eleanor’s gaze fell upon Dr. Finch, who stood near the fireplace, his fingers nervously adjusting his collar. “Dr. Finch, you were one of the last people to see Eleanor alive. Can you tell me what you were doing at ten o'clock?” He noted the way his eyes darted towards the door, as if contemplating escape. He cleared his throat, the flickering candlelight casting shadows across his face. “I was in my study, attending to some patients,” he replied, his voice measured but strained. “I assure you, I had no reason to leave.”

Eleanor felt a pang of doubt. “Witness statements confirm Eleanor was alive at ten o'clock,” she pressed, her tone firm. “If you were in your study, how do you explain her presence?” Dr. Finch’s brow furrowed, and he opened his mouth to respond, but the words faltered. The tension in the room thickened, and Eleanor could see the flicker of uncertainty in her eyes. She needed to maintain control of the situation, but the implications of her alibi were troubling.

“I understand the gravity of the situation,” she finally said, her voice barely above a whisper. “But I swear, I was preoccupied with my work. I did not see her.” The weight of her statement hung in the air, and Eleanor felt the urge to probe further. She needed to uncover the truth, not just for Eleanor but for everyone present. The clock’s betrayal loomed large, a reminder that time was slipping away.

“Captain Hale,” Eleanor turned her attention to the stoic figure leaning against the wall. “You were also present during that time. What can you tell us about your whereabouts?” Hale straightened, his expression unreadable. “I was in the gardens, checking the perimeter. There have been reports of disturbances lately,” he replied, his voice steady yet clipped. “I didn’t see Eleanor until later.”

Eleanor raised an eyebrow, sensing a hint of evasion. “And you didn’t happen to notice anything unusual while you were outside? Perhaps a sound or a figure?” Hale shook his head, his jaw tightening. “No. It was quiet. Too quiet.” Her words felt like a warning, and Eleanor couldn’t shake the feeling that she was hiding something. The clock’s hands had stopped, but the questions were only beginning.

Beatrice Quill, who had been silent until now, fidgeted with her necklace, a sign of her unease. “I was with Captain Hale for a time,” he interjected, his voice trembling slightly. “We were discussing the upcoming events. I didn’t see Eleanor either.” Eleanor noted the way Beatrice’s eyes darted nervously, and a flicker of doubt crept into her mind. The web of alibis was beginning to tangle, and she needed to unravel it quickly.

“It’s imperative that we establish a timeline,” Eleanor said, her tone resolute. “If Eleanor was indeed alive at ten o'clock, then we must determine how the clock came to show ten minutes past eleven. Each of you has a piece of this puzzle, and I intend to fit them together.” The tension in the room was palpable, and Eleanor felt the weight of their gazes upon her. They were all suspects now, and the truth lay hidden beneath layers of deception.

As she continued the interviews, Eleanor’s mind raced with possibilities. Each suspect’s story revealed cracks, and she could sense their discomfort. The clock had not only stopped; it had altered the course of their lives. With every question, she could feel the pressure mounting, the storm outside mirroring the turmoil within. The drawing room, once a place of elegance, had transformed into a battleground of secrets and lies.
--- END PRIOR CHAPTER 2 ---

--- BEGIN PRIOR CHAPTER 3 ---
Title: Chapter 3: Cross-Examination
The afternoon light struggled to pierce the overcast sky, casting a muted glow through the windows of the study. Eleanor Voss stood at the large mahogany desk, her hands trembling slightly as she jotted down notes. The distant sound of thunder rolled outside, echoing the turmoil within her heart. The clock on the wall, its hands frozen, loomed ominously over her, a constant reminder of the time that had slipped away. Eleanor's mind raced with the implications of its stillness. Since Eleanor was last seen alive at ten o'clock, the clock must have been tampered with. How could it show ten minutes past eleven? The contradiction gnawed at her, and she felt the weight of responsibility pressing down on her shoulders.

Eleanor's gaze flicked to the clock again, its face a cruel mockery of the truth. If the clock had indeed been tampered with, it meant that someone had deliberately altered the timeline of events surrounding the murder. The thought sent a chill through her. Who among them would have the audacity to manipulate time itself? The implications were staggering, and Eleanor knew she had to confront the suspects with this revelation. She took a deep breath, steeling herself for the task ahead. The atmosphere in the study thickened as she prepared to unravel the tangled web of lies that surrounded them.

With a firm resolve, Eleanor called the suspects into the study, her voice steady despite the storm brewing outside. Dr. Finch entered first, his expression a mask of concern. 'What is it, Eleanor? Have you found something?' she asked, her eyes darting toward the clock as if she could sense its significance. 'We need to discuss your whereabouts last night,' Eleanor replied, her tone unwavering. 'You were one of the last people to see Eleanor alive. You mentioned being in your study at ten o'clock. Can you explain how the clock shows ten minutes past eleven?'

Dr. Finch shifted uncomfortably, his fingers fidgeting with the collar of his shirt. 'I was busy with patients,' he insisted, his voice strained. 'I didn’t leave my study until later.' Eleanor could see the cracks in her facade, the way her eyes flickered with uncertainty. 'Witness statements confirm Eleanor was alive at ten o'clock,' she pressed, her tone firm. 'If you were in your study, how do you explain her presence?' The tension in the room thickened as Dr. Finch struggled to find an adequate response, his demeanor betraying the weight of his guilt.

Captain Hale entered next, his posture rigid as he leaned against the doorframe. 'What’s going on?' he asked, his voice steady but laced with an undercurrent of tension. Eleanor turned her attention to her, her gaze piercing. 'You were also present during that time. What can you tell us about your whereabouts?' Hale straightened, his expression unreadable. 'I was in the gardens, checking the perimeter. There have been reports of disturbances lately,' he replied, his voice clipped. 'I didn’t see Eleanor until later.' The words felt rehearsed, and Eleanor sensed a hint of evasion in her tone.

Beatrice Quill followed, her face pale and drawn. She fidgeted with her necklace, an anxious gesture that revealed her unease. 'I was with Captain Hale for a time,' he interjected, his voice trembling slightly. 'We were discussing the upcoming events. I didn’t see Eleanor either.' Eleanor noted the way Beatrice's eyes darted nervously, and a flicker of doubt crept into her mind. The web of alibis was beginning to tangle, and she needed to unravel it quickly. 'It’s imperative that we establish a timeline,' Eleanor said, her tone resolute. 'If Eleanor was indeed alive at ten o'clock, then we must determine how the clock came to show ten minutes past eleven. Each of you has a piece of this puzzle, and I intend to fit them together.'

Eleanor's heart raced as she continued the cross-examination, her mind racing with possibilities. The clock's tampering hinted at a deliberate act, a manipulation of time that could only have been executed by someone with knowledge of its workings. The clock was wound back to create a false timeline for the murder. This revelation sent a shiver down her spine. Who among them had the motive and the means to alter the clock? The implications were staggering, and Eleanor was determined to uncover the truth, no matter the cost. As she glanced at each suspect, she could feel the weight of their gazes upon her, a mixture of fear and suspicion that hung in the air like a storm cloud.

The tension in the study was palpable, and Eleanor could sense the unease radiating from her companions. Each suspect was a potential murderer, their secrets entwined with the fate of the victim. She took a moment to collect her thoughts, the soft rustling of papers a reminder of the urgency of the situation. The distant sound of laughter from the drawing room felt like a cruel contrast to the gravity of their circumstances. Eleanor knew that time was running out, and she needed to act swiftly. 'We must examine the clock more closely,' she declared, her voice cutting through the tension. 'Perhaps there are clues that can help us understand what happened.'

As she approached the clock, Eleanor felt a surge of determination. The clock's face, still frozen at ten minutes past eleven, held the key to unraveling the mystery. She examined it closely, noting the faint scratches around the winding mechanism. 'This tampering is deliberate,' she murmured, her heart racing. 'Someone wanted to mislead us about the time of death.' The implications were staggering, and she could feel the weight of their gazes upon her as she pieced together the fragments of their stories. The truth was within reach, and Eleanor was determined to uncover it, no matter the cost.
--- END PRIOR CHAPTER 3 ---

[SCENE COMPLETENESS CONTRACTS — MANDATORY. Each contract below lists what you MUST enact in that chapter. Do not summarise or mention these labels in the prose — enact them organically.]
Chapter 4 (Act 2) completeness contract:
  PIVOT ELEMENT (MANDATORY — write this into the prose, shown not told): "Scratch marks on the clock face indicating tampering"
  FACT ESTABLISHED (MANDATORY — reader must know this by chapter end): "Establishes that the clock was tampered with, narrowing the suspects further."

# Case Overview
Title: The Clockwork Conspiracy
Era: 1930s
Setting: Little Middleton
Crime: murder (clock-tampering)
Culprit: Eleanor Voss
False assumption: The murder occurred shortly after the last sighting of Eleanor.
Cast: Eleanor Voss (she/her), Dr. Mallory Finch (he/him), Captain Ivor Hale (he/him), Beatrice Quill (she/her)

Setting Lock: Keep all scenes and descriptions consistent with the stated setting (Little Middleton). Do not introduce a different location type.

Outline scenes:
[
  {
    "sceneNumber": 4,
    "act": 2,
    "title": "Examination of the Clock",
    "setting": {
      "location": "the study",
      "timeOfDay": "Mid-afternoon",
      "atmosphere": "Quiet, focused atmosphere as Eleanor inspects the clock"
    },
    "characters": [
      "Eleanor Voss"
    ],
    "purpose": "Inspect the clock for signs of tampering",
    "cluesRevealed": [
      "clue_3",
      "clue_7"
    ],
    "dramaticElements": {
      "conflict": "Eleanor's determination to uncover the truth",
      "tension": "Anxiety builds as she discovers evidence of tampering",
      "microMomentBeats": [
        "Eleanor wipes sweat from her brow, deep in concentration."
      ]
    },
    "summary": "Eleanor inspects the clock closely, discovering scratch marks on the face that indicate tampering. This evidence strengthens her theory that the clock was manipulated to create a false timeline.",
    "estimatedWordCount": 2000,
    "pivotElement": "Scratch marks on the clock face indicating tampering",
    "factEstablished": "Establishes that the clock was tampered with, narrowing the suspects further.",
    "permittedBehavioursByAct": [
      {
        "characterName": "Eleanor Voss",
        "behaviour": "may show unease, evasion, or mild defensiveness when questioned"
      }
    ],
    "redHerringPlacement": null,
    "emotionalRegister": "The investigation reveals Dr. Finch's proximity to the clock, raising initial doubts.",
    "dominantCharacterNote": {
      "name": "Eleanor Voss",
      "voiceRegister": "Eleanor's voice is warm and inviting, often tinged with an undercurrent of introspection that hints at her deeper concerns."
    },
    "humourGuidance": {
      "permission": "forbidden"
    },
    "eraTextureNote": "Limited communication due to the absence of modern technology; Travel restricted by fuel shortages and economic conditions; Social gatherings governed by strict etiquette and formality",
    "locationRegisterNote": "The study is a realm of contemplation, where every shadow seems to hide secrets. The weight of unspoken decisions hangs heavy in the air, and the ticking clock serves as a reminder of time slipping away. This space feels both claustrophobic and introspective, reflecting the turmoil within those who dare to enter. — The writer should approach this space with a sense of foreboding, capturing the urgency that permeates the atmosphere."
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
