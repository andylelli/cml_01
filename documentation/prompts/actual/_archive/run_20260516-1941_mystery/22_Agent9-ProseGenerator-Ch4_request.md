# Actual Prompt Record

- Run ID: `mystery-1778960496771`
- Project ID: ``
- Timestamp: `2026-05-16T19:45:55.399Z`
- Agent: `Agent9-ProseGenerator-Ch4`
- Operation: `chat_request_full_prompt`
- Model: `GPT-4o-mini`
- Temperature: `0.42`
- Max Tokens: `4500`
- Attempt: `first`
- Prompt Hash: `79a452642189cffc`

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
- MORAL COMPLEXITY REQUIREMENT: The mechanism of this crime carries a moral gray area: "The culprit orchestrated the murder to protect an innocent family member from ruin, complicating the morality of their actions." — the culprit reveal and denouement MUST acknowledge this ambiguity. Do not let the ending feel clean or simple. Give the reader at least one moment of uncomfortable sympathy or moral doubt.


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

## Era: 1938 November
In November 1938, the air in Little Middleton is thick with the scent of damp earth, accentuated by the overcast skies and occasional rain showers that instill a sense of gloom. The days are short, with the sun setting around four o'clock, casting an early darkness over the manor. The residents feel the weight of the outside world, with political tensions brewing in Europe and remnants of the Great Depression lingering in their pockets. The traditional social structures are under strain, with the upper classes increasingly scrutinized by a public weary of economic hardship. As they gather for a family reunion within the manor's grand but shadowy confines, unspoken tensions rise over inheritance and family legacies, while the threat of external chaos looms just beyond their manicured gardens.
Emotional register: A collective sense of anxiety and unease permeates daily life as individuals grapple with personal and societal uncertainty.
Physical constraints: Limited access to the outside world due to poor weather | Short daylight hours affecting social gatherings | Transportation difficulties compounded by economic factors
Current tensions (weave into background texture): Political unease following the Munich Agreement | Economic strains from the Great Depression | Social unrest with rising anti-fascist demonstrations
Wartime context — N/A: The looming specter of war has brought communities together, yet trust among individuals is fragile, and past traumas linger. Absence effect: Families are often torn apart by military service, leaving emotional voids that are felt deeply within close-knit communities.

## Season Lock (mandatory — derived from 1938 November)
Season: autumn. Allowed vocabulary: autumn, autumnal, fall
Forbidden seasonal words — never use in narration, dialogue, or metaphor: spring, summer, winter and their adjectival forms.
Every weather description, atmosphere, and time-of-year reference must be consistent with autumn.

## Story Theme
The unraveling of familial ties amidst a backdrop of social hierarchies and personal secrets reveals the fragility of trust in a world defined by betrayal.

## Story Emotional Register
Dominant: Tension and foreboding

Arc:
The story begins in Little Middleton Manor, where an air of celebration is tainted by the chilling discovery of a benefactor’s murder during a family reunion. The guests are initially caught in the web of polite conversations, but as the investigation begins, a sense of unease escalates with each clue uncovered. Eleanor Voss, driven by her curiosity and personal stake in the case, starts to peel back the layers of deception, revealing the fragile nature of trust among the guests. The first major clue—a tampered clock—sets off a chain reaction, leading to false leads that cause emotional turmoil among the suspects. As tensions rise, Eleanor faces a pivotal moment when she realizes that her feelings for Captain Hale are complicating her judgment, forcing her to reassess her priorities.

A shocking revelation about Dr. Finch's involvement changes the course of the investigation, inspiring a desperate race against time to uncover the truth before the night ends in chaos. The climax reveals the true nature of the relationships among the suspects, leading to a confrontation that unravels their carefully constructed facades. In the resolution, the emotional costs are laid bare; Eleanor realizes that seeking justice for Beatrice Quill comes at the price of her own burgeoning feelings, while Dr. Finch faces the consequences of his actions. The manor stands silent once more, a testament to the secrets it holds, leaving behind echoes of what was lost.

## Emotional register at this point in the story
Eleanor's curiosity leads her to question her own feelings for Hale.

## Character Portraits (appearance & era)

### Eleanor Voss
Eleanor Voss navigates the strict social hierarchies of the 1930s with a deep desire for recognition and validation. As a schoolteacher, she feels overshadowed by societal expectations and the glamour of figures like Beatrice Quill. The economic strain felt by the community adds pressure to her role, as she struggles to assert her value amidst the growing tensions surrounding family dynamics and inheritance at the manor.
Era intersection: Her aspiration for respect and acknowledgment aligns with the broader societal shifts in gender roles, as women begin to seek more agency in both personal and professional realms.

### Captain Ivor Hale
Captain Hale is a reflection of the traditional masculine ideal, yet he is burdened by the psychological scars of war and the pressures of social status. The rising tensions of the late 1930s exacerbate his struggles with PTSD, complicating his relationships and deepening his desire for connection with Eleanor Voss. As he grapples with his past, the looming threat of fascism and military conflict forces him to confront his vulnerabilities in a society that prizes stoicism.
Era intersection: His inner conflict serves as a microcosm of the societal anxieties surrounding masculinity and the impact of war, mirroring the broader struggles faced by many veterans of the era.

## Character Voices

### Eleanor Voss (she/her/her)
Eleanor's voice carries a nurturing warmth, often laced with dry wit and keen insights.
[comfortable] It's just like teaching, really; you have to read the room before you can engage.
[evasive] Perhaps it's best if we don't dwell on the past; after all, what's done is done.
[stressed] I can’t help but feel that I’m losing control of everything around me.
Humour: Her dry wit often lightens the mood amidst heavy tensions.

### Captain Ivor Hale (he/him/his)
Hale's voice is commanding, often infused with a sardonic edge that belies his inner turmoil.
[comfortable] You know, there’s something about a good drink that makes everything seem manageable.
[evasive] I’d rather not talk about my past; it’s a story best left untold.
[stressed] The pressure is mounting, and I fear what it might drive me to do.
Humour: His sardonic humor often masks deeper vulnerabilities.

## Location Registers (scene framing guides)

The Drawing Room: The drawing room is alive with a blend of festivity and tension, where laughter echoes but shadows linger, hinting at secrets beneath the surface.. Camera angle: A writer entering this space should capture the contrast between the opulence of the decor and the underlying currents of unease.. Era: In the 1930s, social gatherings here are defined by strict etiquette and the unspoken weight of societal expectations.

## Humour guidance for this story position (first_turn)
Permission: forbidden
Rationale: The rising tension requires a focused and intense atmosphere.

## Reveal Groundwork (texture — do not explain, only plant)
- Plant one subtle observable beat related to: "Finch's tampering with the clock retroactively colors the earlier interactions between him and Beatrice, suggesting a deeper motive behind their relationship". Do not explain significance yet.
- Plant one subtle observable beat related to: "Eleanor's growing suspicions about Hale also take on new significance, as they hint at a protective instinct rather than mere admiration". Do not explain significance yet.
- Plant one subtle observable beat related to: "The dynamics of trust among the characters shift as the investigation unravels, revealing the fragility of their connections and the potential for betrayal". Do not explain significance yet.

FAIR-PLAY AND INFERENCE CONTRACT (from CML logic):
- False assumption in force: The murder must have occurred when the clock showed a specific time.
- Hidden truth to progressively expose: The clock was tampered with to mislead the investigation.
- Inference path checkpoints to dramatize clearly (observation -> correction -> effect):
  - Step 1: obs: The clock's hands are slightly misaligned with the hour markers. | corr: This indicates that the clock may have been tampered with. | effect: Narrows the investigation focus to those who had access to the clock.
  - Step 2: obs: A faint scratch on the clock's winding mechanism suggests tampering. | corr: This scratch implies someone wound the clock back. | effect: Eliminates Beatrice Quill, who had no reason to tamper with the clock.
  - Step 3: obs: Dr. Finch has a pocket watch that runs eight minutes fast. | corr: This means he might have relied on the false clock time. | effect: Narrows the suspects to Dr. Finch and Captain Hale.
- Discriminating test method: trap
- Discriminating test design constraint: Comparing the clock's time with Dr. Finch's pocket watch reveals discrepancies that only he could have manipulated.
- Test must rely on already-shown clue IDs: clue_1, clue_2, clue_3, clue_5
- Fair-play rationale: Step 1: The clock's misalignment and witness accounts indicate tampering. Step 2: The scratch on the clock mechanism reveals the tampering method. Step 3: Dr. Finch's fast pocket watch shows he relied on the false clock time.
- Never solve by withheld information. Keep reader-information parity with detective reasoning.

## Character Reference

### Eleanor Voss (she/her — NEVER he/him)
Eleanor speaks with a mix of formality and warmth, often employing clever wordplay and irony
Her dialogue is peppered with insightful observations that reveal her sharp intellect.
Eleanor grapples with her unrequited love for Captain Hale, which clouds her judgment and complicates her professional aspirations. She fears that her feelings may compromise her ability to act impartially in the investigation.

### Captain Ivor Hale (he/him — NEVER she/her)
Captain Hale speaks with a commanding presence, his words often laced with dry humor and a hint of sarcasm
He tends to engage in banter, using wit to deflect from deeper issues, and his speech is punctuated by moments of introspection.
Captain Hale grapples with the lingering effects of PTSD from his military service, feeling disconnected from those around him. His admiration for Eleanor adds another layer of complexity, as he fears that his personal struggles may drive her away.


## CHARACTER CONTRACTS (binding for this scene)
Each entry below constrains how this character must be written in this chapter.
These override generic style guidance when they conflict.

### Eleanor Voss
Voice & mannerisms: Eleanor speaks with a mix of formality and warmth, often employing clever wordplay and irony. Her dialogue is peppered with insightful observations that reveal her sharp intellect.
Sample voice fragments (match this register and rhythm):
  [comfortable] "It's just like teaching, really; you have to read the room before you can engage."
  [evasive] "Perhaps it's best if we don't dwell on the past; after all, what's done is done."
Humour: dry wit — deploy occasionally (level 0.5)
FORBIDDEN phrase (never write for Eleanor Voss): "a surge of determination washed over her"
Act 2 behaviour contract: May show unease, evasion, or mild defensiveness when questioned. One behavioural tell is permitted. Internal conflict emerging: "Eleanor grapples with her unrequited love for Captain Hale, which clouds her judgment and complicates her professional aspirations. She fears that her feelings may compromise her ability to act impartially in the investigation."

### Captain Ivor Hale
Voice & mannerisms: Captain Hale speaks with a commanding presence, his words often laced with dry humor and a hint of sarcasm. He tends to engage in banter, using wit to deflect from deeper issues, and his speech is punctuated by moments of introspection.
Sample voice fragments (match this register and rhythm):
  [comfortable] "You know, there’s something about a good drink that makes everything seem manageable."
  [evasive] "I’d rather not talk about my past; it’s a story best left untold."
Humour: sardonic — deploy occasionally (level 0.6)
FORBIDDEN phrase (never write for Captain Ivor Hale): "palpable tension filled the room"
Act 2 behaviour contract: May show unease, evasion, or mild defensiveness when questioned. One behavioural tell is permitted. Internal conflict emerging: "Captain Hale grapples with the lingering effects of PTSD from his military service, feeling disconnected from those around him. His admiration for Eleanor adds another layer of complexity, as he fears that his personal struggles may drive her away."



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
An expansive manor house set in the picturesque Yorkshire countryside, steeped in secrets and shadows.

Key Locations Available:
- The Library (interior): Crime scene
- The Drawing Room (interior): Gathering space
- The Study (interior): Restricted area for family and close confidants
- The Gardens (exterior): Outdoor space for reflection and potential clue discovery

Atmosphere: Tense and foreboding, with an air of suspicion among guests.
Weather: Overcast with occasional rain showers, creating a somber mood.

Era markers: Petrol touring cars parked in the courtyard | Early home telephone with party lines in the study | Typewriter clacking in the library

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
  - Visual: Dust motes dancing in the candlelight, Leather-bound tomes stacked haphazardly
  - Sounds: Crackling fire, The rustle of pages turning
  - Scents: Old leather and ink, Hints of tobacco smoke
  - Touch: Worn leather armchair, Cool marble of the fireplace

The Drawing Room (interior):
  - Visual: Opulent draperies framing tall windows, Gilded mirrors reflecting light
  - Sounds: Soft piano melodies, Laughter and chatter
  - Scents: Fresh flowers and polished wood, A hint of perfume
  - Touch: Soft upholstery of the sofas, Cool marble mantelpiece

The Study (interior):
  - Visual: Rich mahogany furniture, Framed photographs on the walls
  - Sounds: The rustle of papers, The ticking of a clock
  - Scents: Old paper and ink, Wood polish
  - Touch: Smooth surface of the desk, Soft leather of the armchair

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

- In November 1938, the air in Little Middleton is thick with the scent of damp earth, accentuated by the overcast skies and occasional rain showers that instill a sense of gloom
- The days are short, with the sun setting around four o'clock, casting an early darkness over the manor
- The residents feel the weight of the outside world, with political tensions brewing in Europe and remnants of the Great Depression lingering in their pockets
- The traditional social structures are under strain, with the upper classes increasingly scrutinized by a public weary of economic hardship
- As they gather for a family reunion within the manor's grand but shadowy confines, unspoken tensions rise over inheritance and family legacies, while the threat of external chaos looms just beyond their manicured gardens.

TEMPORAL CONTEXT:

This story takes place in November 1938 during N/A.

Seasonal Atmosphere:
- Weather patterns: overcast skies, occasional rain showers, chilly winds
- Daylight: Days are short, with the sun setting around four o'clock, casting an early gloom over the manor.
- Seasonal activities: strolling through the fallen leaves in the manor gardens, hosting gatherings around the fireplace, attending local Remembrance Day ceremonies
- Seasonal occasions: Guy Fawkes Night (November 5), Thanksgiving (not widely celebrated in the UK)
- Season: N/A

Period Fashion (describe naturally):
- Men formal: double-breasted suits, crisp white dress shirts, tweed waistcoats
- Men casual: corduroy trousers, woolen sweaters, tweed caps
- Men accessories: silk ties, pocket watches, cufflinks
- Women formal: tea-length evening gowns, tailored suits with padded shoulders, silk blouses with high collars
- Women casual: wool skirts, knitted cardigans, cotton blouses with floral patterns
- Women accessories: cloche hats, string pearls, leather gloves

Cultural Context (reference naturally):
- Music/entertainment: Glenn Miller's big band sounds, the smooth melodies of Bing Crosby, Ella Fitzgerald's jazz standards; Films: The Adventures of Robin Hood, Bringing Up Baby; Theatre: A Streetcar Named Desire, The Front Page; Radio: The Shadow, The Lone Ranger
- Typical prices: Loaf of bread: four pence, A pint of milk: two pence, Cinema ticket: six pence
- Current events: Munich Agreement fallout causing political unease; increased anti-fascist demonstrations across Europe
- Literature: The Maltese Falcon by Dashiell Hammett | Brave New World by Aldous Huxley | The Grapes of Wrath by John Steinbeck | [detective fiction] | [social realism] | [science fiction]
- Technology: the ballpoint pen | the phonograph | the electric refrigerator | home telephones with party lines | typewriters in offices | motion picture projectors
- Daily life: gathering for tea in the afternoon, playing bridge in the evenings, attending local fairs and markets
- Social rituals: formal dinner parties with multiple courses, weekly church services, community charity events

Atmospheric Details:
The air is thick with the scent of damp earth and decaying leaves, a reminder of the relentless rain. The flickering candlelight casts shadows that dance across the ornate wallpaper, creating an unsettling ambiance within the manor. Outside, the wind howls through the trees, echoing the whispers of doubt and suspicion among the gathered guests.

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
  - The location of the hidden mechanism on the clock: "three inches from the base"

If a locked fact has no relevance to this chapter, omit it. But the moment you reference the underlying evidence, only the exact phrase above is acceptable.

⛔ CLUES TO SURFACE IN THESE CHAPTERS — mandatory:
The following evidence MUST be clearly observable to an attentive reader. Do not bury it in atmosphere or passing dialogue. Each clue must be concrete, specific, and noticeable:

• [clue_5] Dr. Finch has a pocket watch that runs eight minutes fast.
  Category: temporal | Criticality: essential | Supports inference step 3
  Points to: He may have relied on inaccurate time.

For each clue above: an attentive reader should be able to find, record, and later use it to reason toward the solution.

═══ NARRATIVE STATE (read-only — do not contradict) ═══

LOCKED FACTS — use verbatim whenever this evidence is described:
  • The exact time shown on the stopped clock face: "ten minutes past eleven"
  • The exact amount the clock was wound back: "forty minutes"
  • The location of the hidden mechanism on the clock: "three inches from the base"

CHARACTER PRONOUNS — never deviate from these:
  • Eleanor Voss: she/her/her
  • Dr. Mallory Finch: he/him/his
  • Captain Ivor Hale: he/him/his
  • Beatrice Quill: she/her/her

CLUES ALREADY REVEALED TO READER: clue_1, clue_mechanism_visibility_core, clue_2, clue_core_contradiction_chain, clue_3, clue_4 — do not reveal these as new information.

INVESTIGATION LOG — WHAT IS ESTABLISHED (do not re-establish, do not repeat):
• Evidence in reader's hands: The clock's hands are slightly misaligned with the hour markers. | A clock was wound back to create a false timeline for the murder. | This indicates that the clock may have been tampered with. | This indicates that the clock may have been tampered with. | A faint scratch on the clock's winding mechanism suggests tampering. | This scratch implies someone wound the clock back.
• Suspects still unresolved: Eleanor Voss, Captain Ivor Hale, Beatrice Quill
⚠ The story must move FORWARD from this log. Any beat already listed above is forbidden from repeating.

⚠ THIS CHAPTER'S REQUIRED ADVANCE (first_turn): Examine physical evidence — find at least one new clue

CONTINUITY HANDOFF — previous chapter closing beat:
  • "The soft rustle of papers from the desk broke the silence as Eleanor jotted down her thoughts. The clock's role in the murder investigation had transformed from a mere object of timekeeping to a critical piece of evidence. Each tick of the clock now echoed wit..."
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
drawing room, dining room, manor, study

✓ RULE: Continue using this location vocabulary. Maintain consistency with established setting type.
✓ Do NOT introduce new location types that contradict earlier chapters.

**Recent Chapter Summary (for narrative continuity):**
Chapter 1: Chapter 1: Discovery
  Events: The morning air in Little Middleton was thick with the scent of damp earth, a reminder of the rain that had fallen throughout the night.
Chapter 2: Chapter 2: Witness Accounts
  Events: The overcast morning in Little Middleton was heavy with the scent of damp earth, a remnant of the rain that had fallen throughout the night.
Chapter 3: Chapter 3: The Clock's Secrets
  Events: At midday, the air in the study felt heavy with the remnants of the morning's rain, a damp chill that seeped through the walls.

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
Known location profile anchors: Little Middleton Manor, The Library, The Drawing Room, The Study, The Gardens, the café
LOCATION NAME CAPITALISATION (HARD REQUIREMENT — validated):
All named locations in your prose MUST use the EXACT capitalisation from the CML profiles.
Canonical forms: "Little Middleton Manor", "The Library", "The Drawing Room", "The Study", "The Gardens", "the café"
Writing a location in lowercase (e.g. "drawing room" instead of "Drawing Room") is a validated error. Every time you mention a named location, copy its capitalisation from the list above.
- Chapter 4: OPENING STYLE (HARD): Start the VERY FIRST SENTENCE with a noun-phrase atmosphere — e.g. "The smell of damp stone in the cellar…" / "A chill from the landing…" / "The sound of the clock in the hall…". Pattern: "The/A [noun] of/in/from [place]…". Anchor opening in "the café". HARD REQUIREMENT for the first 2 paragraphs: (a) include 2+ sensory words — choose from smell/scent/sound/echo/silence/creak/whisper/cold/warm/damp/rough/smooth/glow/shadow/flicker/dim — and (b) include 1+ atmosphere/time word — choose from rain/wind/fog/storm/mist/thunder/evening/morning/night/dawn/dusk/season/afternoon/midday/noon/midnight/twilight/sunrise/sunset/daylight/sunlight/overcast/cloudy/bright/dark. These are validated requirements, not style suggestions; missing them triggers a retry.

[⚠ INTERNAL QUALITY DIAGNOSTICS — DO NOT REPRODUCE ANY PART OF THIS SECTION IN YOUR STORY OUTPUT. These are private generator observations for your consideration only. Your narrative must read as if this section does not exist. Never include phrases from this block in character dialogue, narration, or description.]

PRIOR CHAPTER QUALITY OBSERVATIONS:
- Chapter 2 (score 97/100):
  Quality gaps noted: word density below preferred target (935/1000)
  Address in upcoming chapters: Increase chapter density with concrete investigation action and sensory-grounded beats; avoid recap-only padding.
- Chapter 3 (score 81/100):
  Quality gaps noted: word density below preferred target (541/1000); scene grounding weakness
  Address in upcoming chapters: Increase chapter density with concrete investigation action and sensory-grounded beats; avoid recap-only padding. | Open next chapter with a named location anchor plus at least two sensory cues and one atmosphere marker.
- Phrases to avoid (already overused in earlier chapters): "the timeline of events surrounding the murder", "eleanor felt a knot tighten in her", "felt a knot tighten in her stomach", "had the opportunity to alter the evidence".
[END INTERNAL DIAGNOSTICS]

PROMPT BUDGET SUMMARY: budget=32000 tokens; fixed=8420; context=9822; dropped=[none]; truncated=[pronoun_accuracy, temporal_context]

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
8. Integrate at least two concrete era-grounded details per chapter from setting refinement signals: petrol touring cars on county roads | early home telephones with party lines | typewriters standard in offices | telegrams available via local post office | aerial mail service for faster delivery | telephone communication common but with delays.
9. Respect setting movement/access constraints in scene action and alibis: Large grounds with hedges and walls limiting visibility | Restricted access to private areas such as the library and study | Weather conditions affecting outdoor evidence collection | Permissions required to enter restricted areas of the house | Daily routines dictate the availability of staff and guests.
10. Sustain social coherence with this backdrop pressure: A gathering at the manor for a family reunion amidst economic strain and political unrest forces guests to navigate social hierarchies and hidden agendas, as tensions rise over a family inheritance.
11. Maintain continuity around these socially central cast anchors where relevant: Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill.
12. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Critical: Plot similarity 0.75 with 'The Mysterious Affair at Styles' (same murder type and motive ambiguity)
13. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Moderate: Character similarity 0.70 with 'The Mysterious Affair at Styles' (similar cast structure and roles)
14. STORY TO DATE ANTI-COPY RULE: The STORY TO DATE section below is provided for chronological and factual reference ONLY. You MUST NOT copy, lightly rephrase, or structurally echo any sentence or paragraph from prior chapters. Every sentence in this chapter must be original prose unique to this scene. Reusing even a clause from prior chapter text will cause this attempt to fail immediately.

CRITICAL PROSE REQUIREMENTS:

The CML specifies exact requirements for certain validation-critical scenes. You MUST include these elements at the specified positions.

**Discriminating Test Scene (Act 3, Scene 4):**
Required elements: Execute the discriminating test, Observe the evidence of clock tampering, Draw conclusion about Dr. Finch's guilt
Test type: temporal

**Suspect Clearance Scenes:**
- Beatrice Quill (Act 3, Scene 5): Confirmed alibi in the kitchen during the clock tampering.
  Clues: clue_1, clue_2
- Captain Ivor Hale (Act 3, Scene 5): Alibi confirmed: from 8:30 PM to 9:30 PM

**Culprit Revelation Scene (Act 3, Scene 6):**
Method: Confrontation with evidence of clock tampering.

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
- Chapter 4:
  - Word count: Target 1250 words. Achieve this through plot events, dialogue exchanges, and physical investigation — not through atmospheric repetition or extended internal reflection. Each 200-word segment should contain at minimum one concrete story event (a discovery, a conversation exchange, a physical action or movement). Padding with atmosphere alone is not acceptable.
  - Opening: Begin with a character action, spoken line, or clock/time marker — never a location name or location-description phrase.
  - Scene is set in: the café — reference it naturally within the paragraph, never as your opening phrase.
  - Opening atmosphere (MANDATORY — validator enforced): the first paragraph MUST contain at least one of: rain / wind / fog / storm / mist / thunder / evening / morning / night / dawn / dusk / season / afternoon / midday / noon / midnight / twilight / sunrise / sunset / daylight / sunlight / overcast / cloudy / bright / dark. A chapter that omits all of these from its opening paragraph will be rejected.
  - Continuity bridge: in the first 120 words, visibly connect from the previous chapter's final beat. Carry forward one unresolved element (object, accusation, emotional pressure, or immediate physical action) from: "The soft rustle of papers from the desk broke the silence as Eleanor jotted down her thoughts. The clock's role in the murder investigation had transformed from a mere object of timekeeping to a critical piece of evidenc...".
  - CLUE OBLIGATIONS — mandatory prose elements (do NOT omit or bury):
    • Dr. Finch has a pocket watch that runs eight minutes fast. [clue_5]
      Points to: He may have relied on inaccurate time.
  - Tonal contrast: include at least one beat of relief or ironic counterpoint. Do not sustain maximum tension for every paragraph.

- Tonal contrast required: the previous chapter was high-tension. This chapter must include at least one beat of relief, pause, or quiet observation.
- Locked fact phrase obligations:
  - If this batch mentions The exact time shown on the stopped clock face, write exactly: "ten minutes past eleven".
  - If this batch mentions The exact amount the clock was wound back, write exactly: "forty minutes".
  - If this batch mentions The location of the hidden mechanism on the clock, write exactly: "three inches from the base".
- Seasonal vocabulary allow-list: autumn, autumnal, fall.
- Forbidden seasonal words: spring, summer, winter.

FROZEN TIMELINE STATE (DO NOT ALTER):
- Timeline anchor: November (autumn).
- Month, season, weather, and time-of-year language in this batch must stay compatible with autumn.
- Established timeline fact: 8:00 PM
- Established timeline fact: 9:00 PM
- If referenced, use exact time phrase: "ten minutes past eleven" (The exact time shown on the stopped clock face).
- If referenced, use exact time phrase: "forty minutes" (The exact amount the clock was wound back).
- If referenced, use exact time phrase: "three inches from the base" (The location of the hidden mechanism on the clock).

STORY TO DATE (REFERENCE ONLY — DO NOT COPY VERBATIM):
- Full prior chapter text is provided below for continuity, factual consistency, and reference accuracy.
- Use this to keep character voice, chronology, clue state, and location continuity aligned with earlier chapters.
- Do not quote, copy, or paraphrase these paragraphs too closely; write fresh prose that remains consistent with them.

--- BEGIN PRIOR CHAPTER 1 ---
Title: Chapter 1: Discovery
The morning air in Little Middleton was thick with the scent of damp earth, a reminder of the rain that had fallen throughout the night. Eleanor Voss crossed the threshold into the drawing room, her heart heavy with the weight of what had transpired. The room, usually filled with laughter and warmth, now felt cold and foreboding. Shadows flickered in the candlelight as he approached the gathering, where Dr. Finch, Captain Hale, and Beatrice Quill stood in tense silence, their faces pale and drawn. The clock on the mantelpiece caught his eye, its hands slightly misaligned with the hour markers, an unsettling detail that gnawed at his mind.

Eleanor's gaze lingered on the clock, which showed ten minutes past eleven. The sight sent a chill down her spine; it was a reminder of the moment when everything had changed. She stepped closer, noting the way the hands seemed to hesitate, as if caught in a moment of disbelief. "It’s odd, isn’t it?" she murmured, her voice barely above a whisper. "The clock seems... off." The implication was clear: if the clock had been tampered with, then the timeline of events surrounding the murder could be unreliable, casting doubt on everything they thought they knew.

Dr. Finch shifted uncomfortably, his brow furrowed as he glanced at the clock. "Perhaps it merely needs winding. It’s been a long night for all of us," he suggested, attempting to deflect the growing tension. Yet, Eleanor could see the flicker of anxiety in her eyes. If the clock was indeed wound back, it could create a false timeline for the murder, complicating their understanding of the events that had unfolded. Who had access to the clock? And why would anyone want to mislead them?

Captain Hale, arms crossed, leaned against the mantelpiece, his expression a mixture of concern and frustration. "I distinctly remember the clock running during dinner. It chimed just before we sat down," he stated, his voice steady but laced with an undercurrent of doubt. His words hung in the air, a red herring that stirred unease among the group. If the clock had been tampered with, it could mean that someone was attempting to manipulate the timeline to cover their tracks. Eleanor felt a knot tighten in her stomach; each of them had been present, each had the opportunity to alter the evidence.

Beatrice Quill, her usual theatrical flair muted, stepped forward, her gaze darting between the men. "We mustn't jump to conclusions, gentlemen. The clock could simply be faulty, or perhaps it was merely a coincidence that it stopped at such an unfortunate time," she said, her voice smooth yet strained. Eleanor noted the way Beatrice's fingers trembled slightly, betraying her calm facade. The tension in the room was palpable, each suspect grappling with their own fears and suspicions, their shared grief morphing into a silent battle for self-preservation.

As Eleanor surveyed the scene, her mind raced. The clock's misalignment and the potential tampering created a web of uncertainty that threatened to ensnare them all. She had lost a dear friend, and now, in the midst of their mourning, they were entangled in a mystery that demanded answers. She took a deep breath, steeling herself for what lay ahead. The detective would arrive soon, and with her, the promise of clarity—or perhaps further chaos. The stakes were high, and Eleanor knew that uncovering the truth would require not only her intellect but also a delicate touch in navigating the fragile emotions of those around her.

In the dim light of the drawing room, Eleanor felt the weight of the moment settle upon her shoulders. She glanced at the clock once more, its hands frozen in time, a stark reminder of the life that had been extinguished. The air was thick with unspoken words, and as the door creaked open, announcing the arrival of the detective, Eleanor steeled herself for the revelations that were about to unfold.
--- END PRIOR CHAPTER 1 ---

--- BEGIN PRIOR CHAPTER 2 ---
Title: Chapter 2: Witness Accounts
The overcast morning in Little Middleton was heavy with the scent of damp earth, a remnant of the rain that had fallen throughout the night. Eleanor Voss stood in the living room, her heart racing as she faced the frozen clock on the mantelpiece. Its hands were stuck at ten minutes past eleven, a stark reminder of the moment everything had changed. The tension in the room was palpable, each breath filled with unspoken dread. She stepped closer to the clock, her fingers trembling slightly as she reached out to touch the cool surface. It was peculiar; the hands were misaligned, and she couldn't shake the feeling that something was amiss. "This indicates that the clock may have been tampered with," she murmured, her voice barely above a whisper, but the weight of her words hung in the air, heavy with implication.

Eleanor's gaze remained fixed on the clock, her mind racing with the possibilities. If the clock had been altered, it could mean the timeline of events surrounding the murder was unreliable. The thought sent a chill down her spine. Dr. Finch had suggested it merely needed winding, but Eleanor sensed the flicker of anxiety in his eyes, as if he too understood the gravity of the situation. The clock's misalignment contradicted their assumptions, casting doubt on the reliability of their memories from that fateful night. Who had access to the clock? And why would anyone want to mislead them? The questions swirled in his mind like autumn leaves caught in a gust of wind, each one more troubling than the last.

As she collected her thoughts, Eleanor turned to face the others in the room. Captain Hale leaned against the wall, arms crossed, his expression a mixture of concern and frustration. "I distinctly remember the clock running during dinner. It chimed just before we sat down," he stated, his voice steady but laced with an undercurrent of doubt. His words hung in the air, stirring unease among the group. If the clock had been tampered with, it could mean that someone was attempting to manipulate the timeline to cover their tracks. Eleanor felt a knot tighten in her stomach; each of them had been present, each had the opportunity to alter the evidence.

Beatrice Quill stepped forward, her usual theatrical flair muted. "We mustn't jump to conclusions, gentlemen. The clock could simply be faulty, or perhaps it was merely a coincidence that it stopped at such an unfortunate time," she said, her voice smooth yet strained. Eleanor noted the way Beatrice's fingers trembled slightly, betraying her calm facade. The tension in the room was palpable, each suspect grappling with their own fears and suspicions, their shared grief morphing into a silent battle for self-preservation. Eleanor felt the weight of suspicion from the others, their eyes darting between her and the clock.

Eleanor took a deep breath, steeling herself for what lay ahead. She needed to gather witness testimonies, to establish alibis and piece together the events leading up to the murder. "I think it’s time we discuss what each of you remembers from last night," she said, her voice firm yet gentle. "We need to clarify the timeline of events, particularly concerning the clock. I’ll start with you, Dr. Finch. Can you tell me your whereabouts during dinner?"

Dr. Finch shifted uncomfortably, his brow furrowing as he considered his response. "I was in the dining room, of course. We all were, except for Beatrice, who stepped out for a moment to... fetch something," she replied, her voice steady but lacking conviction. Eleanor noted the hesitation in her tone, the way she avoided eye contact as she spoke. It was as if she were trying to distance herself from the implications of her words. She made a note of her alibi, but something about it felt off. Why had Beatrice needed to leave the room? What had she been doing?

Beatrice, sensing the scrutiny, chimed in quickly. "I only stepped out for a moment to check on the dessert. You know how I am about my culinary creations," she said, her voice light, but Eleanor could hear the strain beneath it. The tension in the room thickened as Eleanor jotted down notes, her hands trembling slightly as she tried to maintain her composure. Each account seemed to contradict the other, and the discrepancies only served to deepen the mystery. Eleanor felt the weight of the investigation pressing down on her, the stakes higher than ever.

Captain Hale cleared his throat, drawing their attention back to him. "I remember the clock chiming at eight, just before we sat down. It was always reliable, or at least it was until now," he said, his voice tinged with frustration. "I can’t believe we’re even considering the possibility that someone would tamper with it. It’s absurd!" His outburst echoed in the living room, a stark contrast to the heavy silence that had settled over them. Eleanor noted the way her hands clenched at her sides, the tension radiating from her. It was clear that the situation was affecting them all deeply.

As the conversation continued, Eleanor felt the tension in the room shift. Each suspect was grappling with their own fears and suspicions, their shared grief morphing into a silent battle for self-preservation. The clock, once a mere object of timekeeping, had become a symbol of their unraveling trust. Eleanor knew she needed to dig deeper, to uncover the truth hidden beneath the layers of deception. The stakes were high, and she was determined to find the answers that lay buried in the shadows of Little Middleton Manor.
--- END PRIOR CHAPTER 2 ---

--- BEGIN PRIOR CHAPTER 3 ---
Title: Chapter 3: The Clock's Secrets
At midday, the air in the study felt heavy with the remnants of the morning's rain, a damp chill that seeped through the walls. Eleanor Voss stood before the mantelpiece, her eyes fixed on the clock that had become the center of their investigation. The soft patter of raindrops against the window created a rhythmic backdrop, amplifying the tension that hung in the air. As she leaned closer, the flickering light from the desk lamp illuminated the clock's face, revealing its hands frozen at ten minutes past eleven. The sight sent a shiver down her spine, a stark reminder of the moment when everything had changed.

Eleanor's fingers brushed against the clock's surface, and she noticed a faint scratch on the clock's winding mechanism. This scratch suggested tampering, a deliberate act to mislead about the timing of the murder. Her heart raced as she considered the implications. If someone had altered the clock, it could mean that the timeline of events surrounding the murder was not only unreliable but also manipulated to serve a hidden agenda. Who among them had the motive and the opportunity to do such a thing?

As she examined the clock further, Eleanor noted that the clock's hands were slightly misaligned with the hour markers. This indicates that the clock may have been tampered with. The realization gnawed at her; it contradicted their earlier assumptions that the clock was a reliable witness to the events of that night. If the clock had indeed been wound back, it could create a false timeline for the murder, complicating their understanding of the events that had transpired.

The atmosphere thickened with the weight of hidden truths as Eleanor wiped her brow, sensing the gravity of her findings. Dr. Finch stood nearby, watching his with an inscrutable expression. 'What do you think?' he asked, his tone casual but his eyes betraying a flicker of concern. 'Is it possible the clock simply needs winding?'

Eleanor shook her head, her resolve firm. 'No, Dr. Finch. This scratch implies someone wound the clock back. It raises too many questions about what actually happened during dinner.' He could feel the tension in the room as Finch shifted uncomfortably, his brow furrowing slightly. Eleanor's instincts told her that she was hiding something, and the weight of that suspicion pressed heavily upon her.

As she continued her examination, Eleanor's mind raced with possibilities. If the clock had been tampered with, it meant that each of them had the opportunity to alter the evidence. He glanced at Finch, who seemed to be calculating his next words carefully. 'We need to consider who had access to the clock,' he said, his voice steady. 'And what they might have wanted to hide.'

The soft rustle of papers from the desk broke the silence as Eleanor jotted down her thoughts. The clock's role in the murder investigation had transformed from a mere object of timekeeping to a critical piece of evidence. Each tick of the clock now echoed with suspicion, reminding her that the truth was buried beneath layers of deceit. Eleanor felt a knot tighten in her stomach; the stakes were higher than ever, and she was determined to uncover the truth hidden within the shadows of Little Middleton Manor.
--- END PRIOR CHAPTER 3 ---

[SCENE COMPLETENESS CONTRACTS — MANDATORY. Each contract below lists what you MUST enact in that chapter. Do not summarise or mention these labels in the prose — enact them organically.]
Chapter 4 (Act 2) completeness contract:
  PIVOT ELEMENT (MANDATORY — write this into the prose, shown not told): "Hale's hesitant responses."
  FACT ESTABLISHED (MANDATORY — reader must know this by chapter end): "Establishes that Captain Hale's alibi is shaky due to his reluctance to provide details."
  RED HERRING (MANDATORY — seed naturally, not flagged as false): [rh_2] Eleanor overhears a patron mention the clock's face being cracked, suggesting it was broken during the murder.

# Case Overview
Title: The Clockwork Conundrum
Era: 1930s
Setting: Little Middleton, Yorkshire
Crime: murder (benefactor murder)
Culprit: Dr. Mallory Finch
False assumption: The murder must have occurred when the clock showed a specific time.
Cast: Eleanor Voss (she/her), Dr. Mallory Finch (he/him), Captain Ivor Hale (he/him), Beatrice Quill (she/her)

Setting Lock: Keep all scenes and descriptions consistent with the stated setting (Little Middleton, Yorkshire). Do not introduce a different location type.

Outline scenes:
[
  {
    "sceneNumber": 4,
    "act": 2,
    "title": "Alibis and Alarms",
    "setting": {
      "location": "the café",
      "timeOfDay": "Early afternoon",
      "atmosphere": "Chatter of patrons contrasts with Eleanor's focus"
    },
    "characters": [
      "Eleanor Voss",
      "Captain Ivor Hale"
    ],
    "purpose": "Confirm Captain Hale's alibi and gather more information",
    "cluesRevealed": [
      "clue_5"
    ],
    "dramaticElements": {
      "conflict": "Eleanor presses Hale for details, sensing he withholds information",
      "tension": "The café's noise fades as their discussion intensifies",
      "microMomentBeats": [
        "Eleanor watches Hale's hands, noting his nervous gestures."
      ]
    },
    "summary": "Eleanor meets Captain Hale at the café to confirm his alibi. As they discuss the timeline, Hale's evasiveness raises Eleanor's suspicions.",
    "estimatedWordCount": 1800,
    "pivotElement": "Hale's hesitant responses.",
    "factEstablished": "Establishes that Captain Hale's alibi is shaky due to his reluctance to provide details.",
    "permittedBehavioursByAct": [
      {
        "characterName": "Eleanor Voss",
        "behaviour": "may show unease, evasion, or mild defensiveness when questioned"
      },
      {
        "characterName": "Captain Ivor Hale",
        "behaviour": "may show unease, evasion, or mild defensiveness when questioned"
      }
    ],
    "redHerringPlacement": {
      "redHerringId": "rh_2",
      "placementDetail": "Eleanor overhears a patron mention the clock's face being cracked, suggesting it was broken during the murder."
    },
    "emotionalRegister": "Eleanor's curiosity leads her to question her own feelings for Hale.",
    "dominantCharacterNote": {
      "name": "Eleanor Voss",
      "voiceRegister": "Eleanor's voice carries a nurturing warmth, often laced with dry wit and keen insights."
    },
    "humourGuidance": {
      "permission": "conditional",
      "condition": "if Dr. Finch is present"
    },
    "eraTextureNote": "Limited access to the outside world due to poor weather; Short daylight hours affecting social gatherings; Transportation difficulties compounded by economic factors",
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
  Dr. Mallory Finch    | he/him/his/himself        | [fill in]     | [yes/no]
  Captain Ivor Hale    | he/him/his/himself        | [fill in]     | [yes/no]
  Beatrice Quill       | she/her/her/herself       | [fill in]     | [yes/no]
□ Return valid JSON only.
```
