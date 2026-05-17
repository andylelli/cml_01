# Actual Prompt Record

- Run ID: `mystery-1778968330736`
- Project ID: ``
- Timestamp: `2026-05-16T21:56:28.139Z`
- Agent: `Agent9-ProseGenerator-Ch4`
- Operation: `chat_request_full_prompt`
- Model: `GPT-4o-mini`
- Temperature: `0.42`
- Max Tokens: `4500`
- Attempt: `first`
- Prompt Hash: `668817fd8a1e3215`

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
- MORAL COMPLEXITY REQUIREMENT: The mechanism of this crime carries a moral gray area: "The murderer feels justified due to a lifetime of grievances against the victim, complicating the moral implications of their actions." — the culprit reveal and denouement MUST acknowledge this ambiguity. Do not let the ending feel clean or simple. Give the reader at least one moment of uncomfortable sympathy or moral doubt.


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

## Era: February 1932
Living in February 1932 means navigating the heavy fog of the Great Depression, where economic despair looms large and social tensions simmer beneath the surface. The British countryside is often cloaked in gray, with chilly winds and rain creating a dreary backdrop for daily life. Communities gather for tea, sharing stories, but the oppressive weight of financial strain affects even the upper classes, leading to growing resentment. The societal expectations are rigid, with strict class distinctions and an emerging pressure for reform, as women begin to seek independence while men grapple with the ideals of stoicism and success. The air is thick with unspoken secrets, and as the world edges closer to political upheaval, the scent of damp earth and wood smoke becomes synonymous with the struggles of the time.
Emotional register: A collective sense of uncertainty and unease permeates the social fabric.
Physical constraints: Short daylight hours limit evening activities, with the sun setting by 5:30 PM. | Overcast skies and frequent rain make outdoor pursuits difficult. | Economic hardship restricts the ability to travel or engage in leisure activities.
Current tensions (weave into background texture): The ongoing effects of the Great Depression causing widespread discontent and protests. | Political instability in Germany as tensions rise within Europe. | The British government grappling with economic recovery plans.
Wartime context — Many men are still grappling with the aftermath of service in World War I.: Veterans face challenges reintegrating into civilian life, often compounded by economic struggles. Absence effect: Families deal with the emotional scars of loss, while those who served feel a disconnect from the changing societal norms.

## Season Lock (mandatory — derived from February 1932)
Season: winter. Allowed vocabulary: winter, wintry, midwinter
Forbidden seasonal words — never use in narration, dialogue, or metaphor: spring, summer, autumn and their adjectival forms.
Every weather description, atmosphere, and time-of-year reference must be consistent with winter.

## Story Theme
In an era of class struggle, the pursuit of truth reveals the fragility of human connections amidst the shadows of deceit and ambition, and reveals that evidence carries ethical weight, forcing characters to choose accountability over social performance when appearances and facts collide.

## Story Emotional Register
Dominant: The story carries an air of foreboding and tension, woven through the interactions of its characters.

Arc:
The narrative opens with a palpable tension at Little Middleton Manor, where the atmosphere is thick with uncertainty and secrets. The stormy evening backdrop sets the stage for a murder that shakes the very foundation of the household. As Eleanor Voss, the keen observer, delves into the investigation, she uncovers initial clues that reveal the fractured relationships among the guests, each harboring their own motives and fears. The first investigative turn leads her to question the reliability of the clock that misrepresents the time of death, marking the beginning of a complex web of deception.

Midway through, a pivotal revelation regarding the clock's tampering shifts Eleanor's focus and deepens her resolve to expose the truth, as the emotional cost of the investigation weighs heavily on her. The second pivotal moment occurs when a confrontation with a critical piece of evidence redefines her understanding of the events, forcing her to reconsider her assumptions about trust and loyalty. As the narrative builds toward the climax, the pressure mounts, leading to a dramatic confrontation where Eleanor must navigate a landscape of betrayal and ambition. The resolution ultimately reveals the emotional toll on all characters, with Eleanor finding a bittersweet sense of justice while grappling with her own place in a world defined by class and hypocrisy. The ending resonates with the weight of truth uncovered, leaving behind a lingering sense of unease and reflection on the fragility of human connections.

## Emotional register at this point in the story
The revelation about the clock's tampering shifts the direction of the investigation.

## Character Portraits (appearance & era)

### Eleanor Voss
Eleanor Voss, a retired schoolteacher, feels the societal pressures of the 1930s acutely, especially as a woman navigating a male-dominated world. Her sharp intellect serves her well in uncovering the hidden truths of her affluent relatives, yet her social standing leaves her yearning for recognition. The Great Depression heightens her desperation for financial stability, pushing her to confront her family's secrets and societal hypocrisy.
Era intersection: Her struggle against class hypocrisy aligns with the growing class resentment of the era.

### Dr. Mallory Finch
As a respected physician, Dr. Mallory Finch embodies the struggles of women in the 1930s, balancing her professional integrity with personal desires. The economic pressures of the Great Depression force her to navigate her complex relationship with the victim, revealing the fragility of her social standing. Her charitable work contrasts with her hidden resentments, reflecting the societal expectations placed upon women to conform while desperately seeking independence.
Era intersection: Her emotional turmoil mirrors the societal shifts as women begin to assert themselves amidst economic strain.

## Character Voices

### Eleanor Voss (she/her/her)
Eleanor speaks with a measured cadence, often pausing for emphasis, and uses formal language laced with sardonic quips.
[comfortable] Ah, the irony of inheritance—one might think it a blessing, yet it feels more like a curse.
[evasive] I wouldn't want to speculate on matters best left undiscussed, would you?
[stressed] Every tick of that clock feels like a countdown, but to what? My sanity or the truth?
Humour: Her dry wit surfaces as a coping mechanism amidst the tension.

### Dr. Mallory Finch (she/her/her)
Dr. Finch's warm, soothing tone often includes gentle laughter, making her approachable yet hiding deeper conflicts.
[comfortable] You know, sometimes a good cup of tea can heal more than any medicine.
[evasive] Ah, the past—better left buried, don't you think?
[stressed] I fear the truth may be far more painful than any wound I could treat.
Humour: She uses observational humor to navigate her complex emotions.

## Location Registers (scene framing guides)

The Drawing Room: The drawing room feels luxurious yet suffocating, where elegance masks the underlying tension of secrets waiting to be revealed. The flickering candlelight casts shadows that seem to listen, amplifying the unease among the guests.. Camera angle: As a writer enters, the room feels like a stage set for drama, with every detail hinting at the hidden truths lurking in the shadows.. Era: In this 1932 setting, the opulence of the drawing room stands in stark contrast to the economic struggles outside its walls.

The Library: The library is a sanctuary of knowledge, yet its atmosphere is thick with mystery and anticipation. The scent of old leather and beeswax invites curiosity, but the whispers of secrets make it a place of both refuge and unease.. Camera angle: Entering the library, the writer feels the weight of history and the promise of revelations lurking among the books.. Era: The library's vast collection reflects the interests of a bygone era, contrasting with the societal changes of the 1930s.

The Dining Hall: The dining hall is lavishly decorated, but beneath its surface lies a palpable tension. The clinking of glassware and soft laughter mask the underlying suspicions that threaten to surface, creating an atmosphere of uneasy anticipation.. Camera angle: As the writer approaches, the dining hall appears to be a battleground of social dynamics, where every gesture could signal a betrayal.. Era: In the context of 1932, the grand setting reflects the wealth of the upper class, even as the outside world grapples with economic hardships.

The Formal Garden: The formal garden is a beautiful facade, yet it conceals the potential for intrigue. The vibrant blooms contrast sharply with the dark hedges, symbolizing the hidden complexities of the characters’ lives.. Camera angle: Entering the garden, the writer feels the tension of beauty hiding darker truths, inviting exploration yet warning of secrets.. Era: The garden's beauty serves as a reminder of the upper class's privilege, even as the Great Depression looms over their lives.

## Humour guidance for this story position (first_turn)
Permission: forbidden
Rationale: The heightened tension during confrontations necessitates a serious tone.

## Reveal Groundwork (texture — do not explain, only plant)
- Plant one subtle observable beat related to: "In the dining hall, the laughter and clinking glasses are revealed to mask deeper tensions". Do not explain significance yet.
- Plant one subtle observable beat related to: "The library, once a sanctuary, becomes a site of betrayal as secrets unfold". Do not explain significance yet.
- Plant one subtle observable beat related to: "Eleanor's observations throughout the investigation take on a new significance, as her dry wit becomes a shield against the emotional weight of the truth she uncovers". Do not explain significance yet.

FAIR-PLAY AND INFERENCE CONTRACT (from CML logic):
- False assumption in force: The murder must have occurred at the time the clock shows.
- Hidden truth to progressively expose: The actual time of death was much later than the clock indicated.
- Inference path checkpoints to dramatize clearly (observation -> correction -> effect):
  - Step 1: obs: The clock in the drawing room shows ten minutes past eleven, although dinner was served at half past eight. | corr: The clock cannot be relied upon to indicate the correct time of death given the dinner schedule. | effect: Narrows the suspect pool by indicating the clock has been tampered with, implicating Dr. Mallory Finch.
  - Step 2: obs: Witness statements assert that they heard the clock chime at half past eight. | corr: The chime timing contradicts the clock's current reading, suggesting tampering. | effect: Further implicates Dr. Mallory Finch as the one who adjusted the clock.
  - Step 3: obs: Fingerprint evidence found on the clock matches Dr. Mallory Finch. | corr: The fingerprints indicate that only Dr. Mallory Finch had accessed the clock recently. | effect: Eliminates all other suspects based on access to the clock.
- Discriminating test method: trap
- Discriminating test design constraint: The discriminating test compares clock, timing, and minut against the claimed timeline.
- Test must rely on already-shown clue IDs: clue_1, clue_2, clue_3, clue_4, clue_mechanism_visibility_core
- Fair-play rationale: Step 1: The clock reading and dinner time show a discrepancy. Step 2: Witness statements about the chime contradict the clock's current reading. Step 3: Fingerprint evidence ties Dr. Finch to the clock.
- Never solve by withheld information. Keep reader-information parity with detective reasoning.

## Character Reference

### Eleanor Voss (she/her — NEVER he/him)
Speaks with a measured cadence, often pausing for emphasis
She employs a mix of formal language laced with the occasional sardonic quip when discussing the foibles of her relatives.
Eleanor wrestles with her resentment toward her family while grappling with the realization that their secrets could be her salvation or her undoing.

### Dr. Mallory Finch (she/her — NEVER he/him)
Speaks with a warm, soothing tone, often punctuating her sentences with gentle laughter
She has a tendency to use medical metaphors in casual conversation, making her sound both approachable and professional.
Mallory is torn between her affection for the victim and the fear that their relationship will be scrutinized, threatening her standing in the community.


## CHARACTER CONTRACTS (binding for this scene)
Each entry below constrains how this character must be written in this chapter.
These override generic style guidance when they conflict.

### Eleanor Voss[SHE]
Voice & mannerisms: Speaks with a measured cadence, often pausing for emphasis. She employs a mix of formal language laced with the occasional sardonic quip when discussing the foibles of her relatives.
Sample voice fragments (match this register and rhythm):
  [comfortable] "Ah, the irony of inheritance—one might think it a blessing, yet it feels more like a curse."
  [evasive] "I wouldn't want to speculate on matters best left undiscussed, would you?"
Humour: dry wit — deploy occasionally (level 0.5)
FORBIDDEN phrase (never write for Eleanor Voss): "a surge of determination washed over her"
Act 2 behaviour contract: May show unease, evasion, or mild defensiveness when questioned. One behavioural tell is permitted. Internal conflict emerging: "Eleanor wrestles with her resentment toward her family while grappling with the realization that their secrets could be her salvation or her undoing."

### Dr. Mallory Finch[SHE]
Voice & mannerisms: Speaks with a warm, soothing tone, often punctuating her sentences with gentle laughter. She has a tendency to use medical metaphors in casual conversation, making her sound both approachable and professional.
Sample voice fragments (match this register and rhythm):
  [comfortable] "You know, sometimes a good cup of tea can heal more than any medicine."
  [evasive] "Ah, the past—better left buried, don't you think?"
Humour: observational — deploy occasionally (level 0.4)
FORBIDDEN phrase (never write for Dr. Mallory Finch): "everyone could sense the atmosphere"
Act 2 behaviour contract: May show unease, evasion, or mild defensiveness when questioned. One behavioural tell is permitted. Internal conflict emerging: "Mallory is torn between her affection for the victim and the fear that their relationship will be scrutinized, threatening her standing in the community."



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
A grand country estate shrouded in secrets, where every room holds a whisper of the past.

Key Locations Available:
- The Drawing Room (interior): Gathering space
- The Library (interior): Clue discovery
- The Dining Hall (interior): Gathering space
- The Formal Garden (exterior): Clue discovery and isolation

Atmosphere: Tense and foreboding, reflecting underlying social tensions and secrets among the household members.
Weather: Overcast with occasional rain, typical of the British countryside in autumn.

Era markers: Heavy velvet drapes and ornate furnishings | Typewriters clattering in the study | Radio crackling with news of the outside world

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
  - Visual: plush velvet sofas, ornate wood paneling, glimmering chandelier crystals
  - Sounds: crackling fire, soft murmurs of conversation, distant ticking of a clock
  - Scents: beeswax candles, polished wood, old leather
  - Touch: soft velvet cushions, chill of the evening air

The Library (interior):
  - Visual: rows of leather-bound books, dust motes dancing in the light, a large ornate globe
  - Sounds: soft rustle of pages, quiet ticking of a clock, the creak of leather chairs
  - Scents: old leather, beeswax polish, musty paper
  - Touch: smooth wood of the desk, rough texture of old books

The Dining Hall (interior):
  - Visual: gleaming silverware, richly embroidered tapestries, glowing candlelight
  - Sounds: clinking of glasses, soft laughter, the rustle of tablecloths
  - Scents: roasted meats, fresh bread, polished wood
  - Touch: coolness of the table surface, softness of linen napkins

⛔ REFERENCE DATA — DO NOT TRANSCRIBE VERBATIM: The above profiles are structural guides only. Generate original prose that evokes these qualities; do not reproduce the exact phrasing or sentence structure of the profile paragraphs.

SCENE OPENING RULE: When opening a scene in a new location, write what the POV character directly observes and physically senses at that moment — not a general description of the room's qualities. The reader must feel present, not briefed. Sensory details must be observed by the character, not stated as fact about the place.

SENSORY WRITING TECHNIQUES:
- Opening paragraphs: Lead with 2-3 sensory details to ground the scene
- Movement between locations: Note sensory changes (quiet study → noisy dining room)
- Emotional scenes: Use sensory details to reinforce mood (cold rain during argument)
- Period authenticity: Use period-specific sensory details from location/temporal profiles
- Avoid: Over-reliance on visual only; use sound, smell, touch, temperature

CHAPTER SENSORY PALETTE HINTS (evoke these qualities without copying verbatim):
  Chapter 4 palette — morning, rain, oppressive mood [location: The Drawing Room]:
    • dim light filtering through rain-streaked windows, soft shadows in the corners
    • steady rain on
[truncated for prompt budget]

## Texture Pool
Draw on these as opportunities arise — you are not required to use them.

- Living in February 1932 means navigating the heavy fog of the Great Depression, where economic despair looms large and social tensions simmer beneath the surface
- The British countryside is often cloaked in gray, with chilly winds and rain creating a dreary backdrop for daily life
- Communities gather for tea, sharing stories, but the oppressive weight of financial strain affects even the upper classes, leading to growing resentment
- The societal expectations are rigid, with strict class distinctions and an emerging pressure for reform, as women begin to seek independence while men grapple with the ideals of stoicism and success
- The air is thick with unspoken secrets, and as the world edges closer to political upheaval, the scent of damp earth and wood smoke becomes synonymous with the struggles of the time.

TEMPORAL CONTEXT:

This story takes place in February 1932 during winter.

Seasonal Atmosphere:
- Weather patterns: Overcast skies with intermittent rain showers, Chilly winds sweeping across the countryside, Misty mornings, often lingering into noon
- Daylight: Days are short, with the sun rising around 7:30 AM and setting by 5:30 PM, leaving little light for evening activities.
- Seasonal activities: Indoor gatherings around the fireplace, sharing stories or playing parlor games, Visiting local tea shops for warm drinks and socializing, Preparations for spring gardening as the first bulbs start to peek through the frosty earth
- Seasonal occasions: Valentine's Day
- Season: winter

Period Fashion (describe naturally):
- Men formal: Tailored wool suits with wide lapels, often in dark shades, Bowler hats, a staple for gentlemen venturing outdoors, Collared shirts with narrow ties, showcasing Art Deco patterns
- Men casual: Tweed jackets paired with v-neck sweaters for warmth, Knitted scarves wrapped snugly against the cold, High-waisted trousers that taper at the ankle
- Men accessories: Leather gloves, often in shades of brown or black, Pocket watches, a sign of status and punctuality, Walking canes, sometimes purely decorative
- Women formal: Long, fitted evening dresses with dropped waists and intricate beadwork, Cloche hats that frame the face, often adorned with feathers or flowers, Long gloves extending past the wrist, emphasizing elegance
- Women casual: Knitted cardigans worn over blouses, practical for chilly indoor settings, Pleated skirts that fall just below the knee, allowing for movement, Fur-trimmed coats for outdoor excursions
- Women accessories: Beaded evening bags for formal occasions, Brooches or pins that make a subtle statement of wealth, Elegant umbrellas for unexpected rain showers

Cultural Context (reference naturally):
- Music/entertainment: Duke Ellington's jazz orchestra gaining popularity in London, Vera Lynn's romantic ballads resonating with the public, The Savoy Orpheans, a prominent dance band of the era; Films: The Front Page, a popular comedy film of the time, The Blue Angel, a notable German film showcasing new cinematic techniques; Theatre: Rising interest in musicals, particularly works from the West End, New plays exploring social themes like economic despair; Radio: The BBC broadcasting news and entertainment programs to a growing audience, Serial dramas capturing the imagination of listeners
- Typical prices: Loaf of bread: four pence, A pint of milk: two pence, Cinema ticket: one shilling
- Current events: The ongoing effects of the Great Depression causing widespread discontent and protests; Political instability in Germany as tensions rise within Europe
- Literature: A Passage to India by E.M. Forster, challenging colonial attitudes | The Glass Key by Dashiell Hammett, a popular crime fiction novel | The Maltese Falcon by Dashiell Hammett, captivating readers with its intrigue | [Mystery and detective fiction gaining traction] | [Social realism reflecting the struggles of everyday life] | [Modernist poetry challenging traditional forms]
- Technology: Advancements in radio technology improving transmission quality | Early developments in talking pictures as film technology evolves | Improvements in automotive design for greater efficiency | Home radios becoming a staple
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

• [clue_3] The clock cannot be relied upon to indicate the correct time of death given the dinner schedule.
  Category: temporal | Criticality: essential | Supports inference step 1
  Points to: The clock's reading is unreliable for determining the time of death.

• [clue_7] Eliminates Captain Ivor Hale because he was reported to be at a meeting during the time of the murder.
  Category: testimonial | Criticality: essential | Supports inference step 3
  Points to: Captain Ivor Hale has a corroborated alibi.

• [clue_fp_contradiction_step_3] Fingerprint evidence found on the clock matches Dr. Mallory Finch.
  Category: temporal | Criticality: essential | Supports inference step 3
  Points to: The fingerprints indicate that only Dr. Mallory Finch had accessed the clock recently.

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
• Evidence in reader's hands: The clock in the drawing room shows ten minutes past eleven, although dinner was served at half past eight. | Witness statements assert that they heard the clock chime at half past eight.
• Suspects still unresolved: Eleanor Voss[SHE], Captain Ivor Hale[HE], Beatrice Quill[SHE]
⚠ The story must move FORWARD from this log. Any beat already listed above is forbidden from repeating.

⚠ THIS CHAPTER'S REQUIRED ADVANCE (first_turn): Examine physical evidence — find at least one new clue

CONTINUITY HANDOFF — previous chapter closing beat:
  • "As the evening drew to a close, Eleanor felt a flicker of relief wash over her. She had taken the first steps toward uncovering the truth, and while the path ahead remained uncertain, she felt a renewed sense of purpose. The shadows in the drawing room, once s..."
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
drawing room, library, kitchen

✓ RULE: Continue using this location vocabulary. Maintain consistency with established setting type.
✓ Do NOT introduce new location types that contradict earlier chapters.

**Recent Chapter Summary (for narrative continuity):**
Chapter 1: Chapter 1: Discovery
  Events: Eleanor Voss stood frozen in the doorway of the drawing room, her heart racing as she took in the scene before her.
Chapter 2: Chapter 2: Initial Interviews
  Events: The rain poured relentlessly against the windowpanes, each drop a reminder of the chaos that had unfolded within the drawing room.
Chapter 3: Chapter 3: Commitment to Investigation
  Events: Eleanor took a deep breath, steeling herself for the task ahead.

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
Known location profile anchors: Little Middleton Manor, The Drawing Room, The Library, The Dining Hall, The Formal Garden, the drawing room, now cluttered with evidence
LOCATION NAME CAPITALISATION (HARD REQUIREMENT — validated):
All named locations in your prose MUST use the EXACT capitalisation from the CML profiles.
Canonical forms: "Little Middleton Manor", "The Drawing Room", "The Library", "The Dining Hall", "The Formal Garden", "the drawing room, now cluttered with evidence"
Writing a location in lowercase (e.g. "drawing room" instead of "Drawing Room") is a validated error. Every time you mention a named location, copy its capitalisation from the list above.
- Chapter 4: OPENING STYLE (HARD): Start the VERY FIRST SENTENCE with a noun-phrase atmosphere — e.g. "The smell of damp stone in the cellar…" / "A chill from the landing…" / "The sound of the clock in the hall…". Pattern: "The/A [noun] of/in/from [place]…". Anchor opening in "the drawing room, now cluttered with evidence". HARD REQUIREMENT for the first 2 paragraphs: (a) include 2+ sensory words — choose from smell/scent/sound/echo/silence/creak/whisper/cold/warm/damp/rough/smooth/glow/shadow/flicker/dim — and (b) include 1+ atmosphere/time word — choose from rain/wind/fog/storm/mist/thunder/evening/morning/night/dawn/dusk/season/afternoon/midday/noon/midnight/twilight/sunrise/sunset/daylight/sunlight/overcast/cloudy/bright/dark. These are validated requirements, not style suggestions; missing them triggers a retry.

[⚠ INTERNAL QUALITY DIAGNOSTICS — DO NOT REPRODUCE ANY PART OF THIS SECTION IN YOUR STORY OUTPUT. These are private generator observations for your consideration only. Your narrative must read as if this section does not exist. Never include phrases from this block in character dialogue, narration, or description.]

PRIOR CHAPTER QUALITY OBSERVATIONS:
- Chapter 2 (score 95/100):
  Quality gaps noted: word density below preferred target (944/1000); scene grounding weakness
  Address in upcoming chapters: Increase chapter density with concrete investigation action and sensory-grounded beats; avoid recap-only padding. | Open next chapter with a named location anchor plus at least two sensory cues and one atmosphere marker.
- Chapter 3 (score 96/100):
  Quality gaps noted: word density below preferred target (982/1000); scene grounding weakness
  Address in upcoming chapters: Increase chapter density with concrete investigation action and sensory-grounded beats; avoid recap-only padding. | Open next chapter with a named location anchor plus at least two sensory cues and one atmosphere marker.
- Phrases to avoid (already overused in earlier chapters): "stubbornly fixed at ten minutes past eleven", "not been tampered with the thought sent", "been tampered with the thought sent a", "tampered with the thought sent a chill", "igniting a spark of suspicion that flickered", "a spark of suspicion that flickered in", "the clock chime at half past eight", "beatrice was just here laughing and enjoying", "just here laughing and enjoying the evening", "here laughing and enjoying the evening how".
[END INTERNAL DIAGNOSTICS]

PROMPT BUDGET SUMMARY: budget=32000 tokens; fixed=9180; context=10495; dropped=[none]; truncated=[pronoun_accuracy, location_profiles, temporal_context]

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
8. Integrate at least two concrete era-grounded details per chapter from setting refinement signals: radio broadcasting in common use | early home telephones with party lines | typewriters prevalent in offices | increasingly common telephones | telegram services for urgent messages | airmail available for quicker correspondence.
9. Respect setting movement/access constraints in scene action and alibis: layout restricts movement between wings | large gardens provide secluded areas | cellars and attics limit visibility and access | certain rooms are off-limits to staff | scheduled access for household members only.
10. Sustain social coherence with this backdrop pressure: A mechanical clock-tampering incident during a tense gathering at the estate exposes the fractures of class and loyalty amidst the backdrop of the Great Depression and rising fascism.
11. Maintain continuity around these socially central cast anchors where relevant: Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill.
12. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Critical: Plot similarity 0.80 with 'The Mysterious Affair at Styles' (same mechanical tampering method and murder theme)
13. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Moderate: Setting similarity 0.90 with 'The Mysterious Affair at Styles' (same era and similar country manor setting)
14. STORY TO DATE ANTI-COPY RULE: The STORY TO DATE section below is provided for chronological and factual reference ONLY. You MUST NOT copy, lightly rephrase, or structurally echo any sentence or paragraph from prior chapters. Every sentence in this chapter must be original prose unique to this scene. Reusing even a clause from prior chapter text will cause this attempt to fail immediately.

CRITICAL PROSE REQUIREMENTS:

The CML specifies exact requirements for certain validation-critical scenes. You MUST include these elements at the specified positions.

**Discriminating Test Scene (Act 3, Scene 4):**
Required elements: Execute the discriminating test, Observe the culprit's reaction or result, Draw conclusion about guilt

**Suspect Clearance Scenes:**
- Captain Ivor Hale (Act 3, Scene 5): Alibi from fellow guests during dinner
  Clues: clue_id_1, clue_id_2
- Beatrice Quill (Act 3, Scene 5): Confirmed access logs indicate no tampering of the clock.
  Clues: clue_id_1, clue_id_2

**Culprit Revelation Scene (Act 3, Scene 6):**
Method: Confrontation with evidence

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
  - STRUCTURAL ARCHETYPE — Chapter 4 must be: ALIBI_PROBE
      ✓ MUST contain: one alibi tested with a stated result
      ✗ MUST NOT contain: evidence already found in prior chapters
  - Word count: Target 1250 words. Achieve this through plot events, dialogue exchanges, and physical investigation — not through atmospheric repetition or extended internal reflection. Each 200-word segment should contain at minimum one concrete story event (a discovery, a conversation exchange, a physical action or movement). Padding with atmosphere alone is not acceptable.
  - Opening: Begin with a character action, spoken line, or clock/time marker — never a location name or location-description phrase.
  - Scene is set in: the drawing room, now cluttered with evidence — reference it naturally within the paragraph, never as your opening phrase.
  - Opening atmosphere (MANDATORY — validator enforced): the first paragraph MUST contain at least one of: rain / wind / fog / storm / mist / thunder / evening / morning / night / dawn / dusk / season / afternoon / midday / noon / midnight / twilight / sunrise / sunset / daylight / sunlight / overcast / cloudy / bright / dark. A chapter that omits all of these from its opening paragraph will be rejected.
  - Continuity bridge: in the first 120 words, visibly connect from the previous chapter's final beat. Carry forward one unresolved element (object, accusation, emotional pressure, or immediate physical action) from: "As the evening drew to a close, Eleanor felt a flicker of relief wash over her. She had taken the first steps toward uncovering the truth, and while the path ahead remained uncertain, she felt a renewed sense of purpose....".
  - CLUE OBLIGATIONS — mandatory prose elements (do NOT omit or bury):
    • The clock cannot be relied upon to indicate the correct time of death given the dinner schedule. [clue_3]
      Points to: The clock's reading is unreliable for determining the time of death.
    • Eliminates Captain Ivor Hale because he was reported to be at a meeting during the time of the murder. [clue_7]
      Points to: Captain Ivor Hale has a corroborated alibi.
    • Fingerprint evidence found on the clock matches Dr. Mallory Finch. [clue_fp_contradiction_step_3]
      Points to: The fingerprints indicate that only Dr. Mallory Finch had accessed the clock recently.
  - Tonal contrast: include at least one beat of relief or ironic counterpoint. Do not sustain maximum tension for every paragraph.
  - Sensory obligation — use at least two of: dim light filtering through rain-streaked windows, soft shadows in the corners | steady rain on the roof, occasional crack of thunder | damp fabric. Mood: oppressive.

- Tonal contrast required: the previous chapter was high-tension. This chapter must include at least one beat of relief, pause, or quiet observation.
- Locked fact phrase obligations:
  - If this batch mentions The exact time shown on the stopped clock face, write exactly: "ten minutes past eleven".
  - If this batch mentions The exact amount the clock was wound back, write exactly: "forty minutes".
- Seasonal vocabulary allow-list: winter, wintry, midwinter.
- Forbidden seasonal words: spring, summer, autumn.

FROZEN TIMELINE STATE (DO NOT ALTER):
- Timeline anchor: February (winter).
- Month, season, weather, and time-of-year language in this batch must stay compatible with winter.
- Established timeline fact: Dinner started at half past eight
- Established timeline fact: Clock was found stopped at ten minutes past eleven
- If referenced, use exact time phrase: "ten minutes past eleven" (The exact time shown on the stopped clock face).
- If referenced, use exact time phrase: "forty minutes" (The exact amount the clock was wound back).

STORY TO DATE (REFERENCE ONLY — DO NOT COPY VERBATIM):
- Full prior chapter text is provided below for continuity, factual consistency, and reference accuracy.
- Use this to keep character voice, chronology, clue state, and location continuity aligned with earlier chapters.
- Do not quote, copy, or paraphrase these paragraphs too closely; write fresh prose that remains consistent with them.

--- BEGIN PRIOR CHAPTER 1 ---
Title: Chapter 1: Discovery
Eleanor Voss stood frozen in the doorway of the drawing room, her heart racing as she took in the scene before her. The room was dimly lit, the flickering flames of the fireplace casting long shadows that danced across the ornate wood paneling. Outside, the steady rain drummed against the windowpanes, a haunting backdrop to the grim discovery that lay within. The air felt heavy, laden with the scent of damp fabric and polished wood, as if the very walls were witnesses to the tragedy that had unfolded.

In the center of the room, the lifeless body of Beatrice Quill lay sprawled upon the plush carpet, her elegant evening gown now marred by the harsh reality of death. Eleanor’s gaze was drawn to the clock mounted on the wall, its hands stubbornly fixed at ten minutes past eleven. The time felt ominous, an unwelcome truth that clashed violently with the memory of dinner, which had commenced at half past eight. The clock’s defiance echoed in Eleanor’s mind, a silent accusation that demanded answers.

As the initial shock began to wane, Eleanor’s mind raced, piecing together the fragments of the evening. The clock in the drawing room shows ten minutes past eleven, although dinner was served at half past eight. The discrepancy gnawed at her, a glaring inconsistency that could not be ignored. How could Beatrice have died after dinner if the clock had not been tampered with? The thought sent a chill down Eleanor’s spine, igniting a spark of suspicion that flickered in the recesses of her mind.

Witness statements assert that they heard the clock chime at half past eight. This revelation only deepened the mystery. If the clock had chimed at that time, then the current reading was a deliberate deception. Eleanor’s eyes narrowed as she surveyed the room, searching for any sign of tampering. Who among them would have the audacity to manipulate time itself? The very notion felt surreal, yet the evidence lay before her, stark and undeniable.

Captain Hale, his face pale and drawn, stepped forward, breaking the silence that enveloped the room. "This is impossible," he murmured, his voice thick with disbelief. "Beatrice was just here, laughing and enjoying the evening. How could this happen?" Her words hung in the air, a desperate plea for understanding that resonated with the others, yet the underlying tension remained palpable.

Dr. Finch, who had been quietly observing from the corner, finally spoke. "We must remain calm and assess the situation logically. Panic will not serve us now." Her tone was soothing, yet Eleanor sensed an undercurrent of anxiety beneath her composed facade. Mallory’s gaze flickered toward the clock, and Eleanor caught the briefest hint of something—was it guilt? The thought unsettled her, but she quickly pushed it aside, unwilling to entertain such notions without evidence.

Beatrice’s lifeless form lay in stark contrast to the vibrant personality Eleanor had known. The woman who had filled the room with laughter now lay silent, her dreams extinguished. The reality of their situation began to settle in, the weight of grief mingling with the urgency of the mystery that demanded resolution. Eleanor felt a surge of determination rising within her, a resolve to uncover the truth behind Beatrice’s death, no matter the cost.

As the rain continued to winter, Eleanor turned her attention back to the clock, its hands mocking her with their stillness. She had always believed time held the answers, but now it felt like a cruel trick. The stopped clock showing ten minutes past eleven was a puzzle piece that did not fit, and she would not rest until she understood why. With the others still reeling from shock, Eleanor knew she had to take charge. The investigation had begun, and every moment counted.
--- END PRIOR CHAPTER 1 ---

--- BEGIN PRIOR CHAPTER 2 ---
Title: Chapter 2: Initial Interviews
The rain poured relentlessly against the windowpanes, each drop a reminder of the chaos that had unfolded within the drawing room. Eleanor Voss stood amidst the shadows, her heart pounding as she processed the grim reality before her. Beatrice Quill's body lay motionless on the carpet, the vibrant colors of her evening gown dulled by the finality of death. The clock's hands, stubbornly fixed at ten minutes past eleven, seemed to taunt Eleanor, a cruel reminder that time had betrayed them all. The tension in the air was thick, each guest a potential suspect, their expressions a mix of disbelief and dread.

Eleanor stepped closer to the clock, her eyes narrowing at its defiance. The clock in the drawing room shows ten minutes past eleven, although dinner was served at half past eight. This discrepancy gnawed at her, a glaring inconsistency that demanded an explanation. How could Beatrice have met her end after dinner if the clock had not been tampered with? The thought sent a chill through Eleanor, igniting a spark of suspicion that flickered in her mind. She turned her gaze toward the others, searching for any sign of guilt or deceit.

Witness statements assert that they heard the clock chime at half past eight. This revelation deepened the mystery, for if the clock had chimed at that time, then the current reading was a deliberate deception. Eleanor's heart raced as she surveyed the room, her mind racing to connect the dots. Who among them would dare to manipulate time? The very notion felt surreal, yet the evidence lay starkly before her, undeniable and chilling. The weight of their collective uncertainty pressed down on her, each face reflecting the tension that hung in the air.

Captain Hale, his expression a mask of disbelief, stepped forward, breaking the heavy silence. 'This cannot be happening,' he murmured, his voice trembling slightly. 'Beatrice was just here, laughing and enjoying the evening. How could this occur?' Her words hung in the air, a desperate plea for understanding that resonated with the others, yet the underlying tension remained palpable. Eleanor observed her closely, noting the way her hands clenched at her sides, betraying the calm demeanor she tried to project.

Dr. Finch, who had been quietly observing from the corner, finally spoke up. 'We must remain composed and assess the situation logically. Panic will not help us now.' Her tone was steady, yet Eleanor sensed an undercurrent of anxiety beneath her calm exterior. Mallory's gaze flickered toward the clock, and Eleanor caught a brief flash of something in her eyes—was it guilt? The thought unsettled her, but she quickly pushed it aside, unwilling to entertain such notions without evidence. The room seemed to hold its breath, each moment stretching into eternity as they awaited the next revelation.

The absence of Beatrice Quill weighed heavily on Eleanor, a stark reminder of the vibrant personality now lost. The woman who had filled the room with laughter lay silent, her dreams extinguished. The reality of their situation began to settle in, the weight of grief mingling with the urgency of the mystery demanding resolution. Eleanor felt a surge of determination rising within her, a resolve to uncover the truth behind Beatrice's death, no matter the cost. They had to act quickly; every moment wasted could lead to the loss of crucial evidence.

With the rain continuing to winter outside, Eleanor turned her attention back to the gathered guests. 'We need to discuss our whereabouts during dinner,' she said, her voice firm despite the turmoil within. 'It’s essential we establish a timeline.' The guests exchanged nervous glances, and Eleanor could see the tension in their postures, the way they shifted uncomfortably as if the very act of speaking would reveal their secrets. Beatrice's absence loomed large, a specter that haunted their conversation.

Captain Hale nodded slowly, his brow furrowing in concentration. 'I remember sitting next to Beatrice at dinner. She was quite animated, discussing the latest gossip from London.' Her eyes darted to the clock, and Eleanor noted how her voice faltered slightly, as if the memory was too fresh, too painful to bear. 'But after dinner, I... I went to the library for a while. I needed to collect my thoughts.'

Eleanor turned to Dr. Finch, who had remained silent during Hale's recollection. 'And you, Mallory? Where were you after dinner?' The question lingered in the air, heavy with implication. Mallory’s expression shifted, a fleeting look of uncertainty crossing her features. 'I was in the kitchen, helping the staff clean up. I... I had a few things to attend to.' Her voice wavered, and Eleanor caught a glimpse of the tension that lay beneath her calm facade.

Eleanor felt the need to press further. 'Did anyone else hear the clock chime at half past eight?' she asked, her eyes scanning the faces before her. There was a moment of silence, the tension thickening as each guest seemed to weigh their words carefully. Finally, Beatrice's sister, who had been quiet until now, spoke up, her voice barely above a whisper. 'I thought I heard it, but I wasn't paying close attention...'

Eleanor felt a flicker of frustration. 'If the clock chimed at half past eight, then how can it show ten minutes past eleven now? Someone must have tampered with it.' The accusation hung in the air, heavy with implications. The guests exchanged uneasy glances, and Eleanor could see the doubt creeping into their expressions. Each of them was a suspect, and the web of deception was beginning to weave itself tighter around them. The drawing room, once a space of laughter and warmth, had transformed into a battleground of suspicion.
--- END PRIOR CHAPTER 2 ---

--- BEGIN PRIOR CHAPTER 3 ---
Title: Chapter 3: Commitment to Investigation
Eleanor took a deep breath, steeling herself for the task ahead. The evening air felt heavy with tension, the distant sound of rain pattering against the windowpanes echoing her racing heart. The drawing room, now dimly lit as evening approached, was filled with shadows that seemed to whisper secrets of their own. The flickering candlelight cast long, wavering shadows across the plush carpet, creating an atmosphere thick with anticipation. She could feel the weight of the others' gazes upon her, a mixture of disbelief and skepticism that only fueled her determination. 'I must uncover the truth,' she murmured, more to herself than to anyone else, as the implications of Beatrice's death hung heavily in the air.

The clock, stubbornly fixed at ten minutes past eleven, loomed over the scene like a silent sentinel, its hands mocking her with their stillness. Eleanor's mind raced with the knowledge that dinner had been served at half past eight, and the discrepancy gnawed at her insides. How could Beatrice have perished after dinner if the clock had not been tampered with? The thought sent a chill down her spine, igniting a spark of suspicion that flickered in the recesses of her mind. Eleanor turned to the gathered guests, her eyes narrowing as she searched for any sign of guilt or deceit. 'We need to discuss our whereabouts during dinner,' she stated, her voice steady despite the turmoil within. 'It’s essential we establish a timeline.'

Captain Hale shifted uncomfortably, his expression a mask of disbelief. 'This cannot be happening,' he murmured, his voice trembling slightly. 'Beatrice was just here, laughing and enjoying the evening. How could this occur?' Eleanor noted the way her hands clenched at her sides, betraying the calm demeanor she tried to project. The tension in the room was palpable, each guest a potential suspect, their expressions a mix of disbelief and dread. Dr. Finch, who had been quietly observing from the corner, finally spoke up. 'We must remain composed and assess the situation logically. Panic will not help us now.' Her tone was steady, yet Eleanor sensed an undercurrent of anxiety beneath her calm exterior.

Eleanor felt the need to press further. 'Did anyone else hear the clock chime at half past eight?' she asked, her eyes scanning the faces before her. There was a moment of silence, the tension thickening as each guest seemed to weigh their words carefully. Finally, Beatrice's sister, who had been quiet until now, spoke up, her voice barely above a whisper. 'I thought I heard it, but I wasn't paying close attention...' Eleanor felt a flicker of frustration. 'If the clock chimed at half past eight, then how can it show ten minutes past eleven now? Someone must have tampered with it.' The accusation hung in the air, heavy with implications. The guests exchanged uneasy glances, and Eleanor could see the doubt creeping into their expressions.

As the rain continued to winter outside, Eleanor's resolve solidified. She could not let fear or doubt cloud her judgment. The truth was hidden among them, and she had a personal responsibility to uncover it. 'I will take charge of this investigation,' she declared, her voice ringing with newfound determination. The guests looked at her in surprise, their skepticism palpable. 'You can't possibly think you can solve this on your own,' Captain Hale interjected, his brow furrowing in concern. 'This is a matter for the authorities.'

Eleanor met her gaze, her own unwavering. 'And what if the authorities overlook something crucial? What if the truth lies within this room, among us?' The tension in the air thickened, but she pressed on. 'I have spent years observing human behavior, unraveling the complexities of people's motives. If we are to find justice for Beatrice, we must confront the truth ourselves.' Her words hung in the air, a challenge that resonated with the others, igniting a flicker of hope amidst the despair.

Dr. Finch exchanged a glance with Captain Hale, her expression unreadable. 'Very well, Eleanor,' she said finally, her voice steady. 'If you believe you can help, then we shall support you. But we must proceed with caution.' Eleanor nodded, grateful for the support, yet aware that the path ahead would be fraught with challenges. The drawing room, once a space of laughter and warmth, had transformed into a battleground of suspicion, and she was determined to navigate its treacherous waters.

As the evening wore on, Eleanor began her inquiries. She moved from one guest to another, seeking their alibis and observations from dinner. Each conversation revealed fragments of the evening's events, yet the pieces remained stubbornly out of reach. Captain Hale recounted his memories of Beatrice's animated chatter, while Dr. Finch spoke of her time in the kitchen, helping the staff clean up. But each account felt like a carefully constructed facade, hiding deeper truths just beneath the surface.

The clock continued to loom over them, its hands unyielding in their position, a constant reminder of the time that had slipped away. Eleanor felt a sense of urgency building within her, a need to unravel the threads of deception that bound them all. 'We must be vigilant,' she reminded them, her voice firm. 'The truth is often obscured by the very people we trust. We must not let our guard down.' The guests nodded, their expressions shifting from skepticism to a shared resolve. They were in this together, bound by the weight of Beatrice's death and the need for justice.

As the evening drew to a close, Eleanor felt a flicker of relief wash over her. She had taken the first steps toward uncovering the truth, and while the path ahead remained uncertain, she felt a renewed sense of purpose. The shadows in the drawing room, once suffocating, now felt like a cloak of determination, wrapping around her as she prepared to delve deeper into the mystery that had enveloped them all.
--- END PRIOR CHAPTER 3 ---

[SCENE COMPLETENESS CONTRACTS — MANDATORY. Each contract below lists what you MUST enact in that chapter. Do not summarise or mention these labels in the prose — enact them organically.]
Chapter 4 (Act 2) completeness contract:
  PIVOT ELEMENT (MANDATORY — write this into the prose, shown not told): "Dr. Finch's nervous demeanor"
  FACT ESTABLISHED (MANDATORY — reader must know this by chapter end): "Establishes Dr. Finch's alibi is weak, as she was not seen during dinner."

# Case Overview
Title: The Clock's Deceit
Era: 1930s
Setting: Little Middleton
Crime: murder (mechanical tampering)
Culprit: Dr. Mallory Finch
False assumption: The murder must have occurred at the time the clock shows.
Cast: Eleanor Voss (she/her), Dr. Mallory Finch (she/her), Captain Ivor Hale (he/him), Beatrice Quill (she/her)

Setting Lock: Keep all scenes and descriptions consistent with the stated setting (Little Middleton). Do not introduce a different location type.

Outline scenes:
[
  {
    "sceneNumber": 4,
    "act": 2,
    "title": "Questioning Dr. Finch",
    "setting": {
      "location": "the drawing room, now cluttered with evidence",
      "timeOfDay": "Late evening",
      "atmosphere": "Tension hangs in the air as Eleanor questions Dr. Finch"
    },
    "characters": [
      "Eleanor Voss",
      "Dr. Mallory Finch"
    ],
    "purpose": "Delve into Dr. Finch's alibi and motives",
    "cluesRevealed": [
      "clue_3",
      "clue_7",
      "clue_fp_contradiction_step_3"
    ],
    "dramaticElements": {
      "conflict": "Eleanor presses Dr. Finch on her whereabouts during dinner.",
      "tension": "Dr. Finch's evasive answers create doubt.",
      "microMomentBeats": [
        "Dr. Finch's hands tremble slightly as she speaks."
      ]
    },
    "summary": "Eleanor questions Dr. Finch about her actions during dinner. Dr. Finch insists she was in the kitchen preparing, but her nervous demeanor raises Eleanor's suspicions about her alibi.",
    "estimatedWordCount": 1800,
    "pivotElement": "Dr. Finch's nervous demeanor",
    "factEstablished": "Establishes Dr. Finch's alibi is weak, as she was not seen during dinner.",
    "permittedBehavioursByAct": [
      {
        "characterName": "Eleanor Voss",
        "behaviour": "uneasy, pressing for answers"
      },
      {
        "characterName": "Dr. Mallory Finch",
        "behaviour": "evasive, defensive"
      }
    ],
    "redHerringPlacement": null,
    "emotionalRegister": "The revelation about the clock's tampering shifts the direction of the investigation.",
    "dominantCharacterNote": {
      "name": "Eleanor Voss",
      "voiceRegister": "Eleanor speaks with a measured cadence, often pausing for emphasis, and uses formal language laced with sardonic quips."
    },
    "humourGuidance": {
      "permission": "forbidden"
    },
    "eraTextureNote": "Short daylight hours limit evening activities, with the sun setting by 5:30 PM.; Overcast skies and frequent rain make outdoor pursuits difficult.; Economic hardship restricts the ability to travel or engage in leisure activities.",
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
