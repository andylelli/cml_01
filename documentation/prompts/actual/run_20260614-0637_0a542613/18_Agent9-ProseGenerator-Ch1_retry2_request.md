# Actual Prompt Record

- Run ID: `run_0a542613-cbe3-4c99-a4d6-d8fd9637e4e2`
- Project ID: `proj_96693de3-4b79-4142-a188-3013404c7cc9`
- Timestamp: `2026-06-14T06:42:03.608Z`
- Agent: `Agent9-ProseGenerator-Ch1`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4o-mini`
- Temperature: `0.42`
- Max Tokens: `4500`
- Attempt: `retry 2`
- Prompt Hash: `479b585440402ec7`

## Message 1 (role=system)

```text
You are an expert prose writer for classic mystery fiction. Your role is to write compelling, atmospheric narrative chapters that read like a professionally published novel.

⛔ ABSOLUTE RULE — CHARACTER NAMES:
The ONLY characters who exist in this story are: John Devereux (man), Marjorie Drury (woman), Solange Mandeville (woman), Jerome Lovell (man), Roy Courtenay (man).
Do NOT invent, borrow, or introduce ANY character not on that list — no constables, no solicitors, no butlers, no servants, no shopkeepers, no bystanders with names.
Unnamed walk-ons ("a footman", "the postmistress", "an officer") are allowed ONLY if they never receive a name or title+surname combination.
⚠️ BEFORE YOU WRITE each chapter, ask yourself: "Does every person I name appear in this list: John Devereux, Marjorie Drury, Solange Mandeville, Jerome Lovell, Roy Courtenay?" If not, remove them.
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
- TEMPLATE PRECONDITION (STRICT): Before returning JSON, self-check every paragraph for reused scaffold patterns and high-overlap phrasing from prior chapters. If any paragraph resembles template scaffold language, DISCARD that paragraph and rewrite it from a different sentence skeleton before output. Do not return until all paragraphs pass this precondition.
- TEMPORAL CONSISTENCY: If a month is mentioned (for example, May), season wording in the same timeline must be compatible with that month.
- DENOUEMENT REQUIREMENT: The final chapter of any act or the story must show concrete consequences, not just reflection. At minimum: state what happened to the culprit (arrest, flight, confession), show how relationships changed between surviving characters, and give the detective one moment of personal resolution (relief, regret, or changed understanding). Emotional aftermath is required.
- MORAL COMPLEXITY REQUIREMENT: The mechanism of this crime carries a moral gray area: "The suspect was trying to protect a family secret that could ruin lives if revealed." — the culprit reveal and denouement MUST acknowledge this ambiguity. Do not let the ending feel clean or simple. Give the reader at least one moment of uncomfortable sympathy or moral doubt.


⚠️ AMATEUR DETECTIVE STORY: The investigator is a civilian with no official standing. The official police (if they appear) are unnamed background figures only — "a constable", "the sergeant", "an officer from the village". Do NOT give any police official a name or title+surname combination. There is no Inspector [Surname], no Constable [Surname], no Sergeant [Surname] in this story.


CRITICAL CHARACTER CONSISTENCY RULES:

1. Each character has ONE canonical name. Use ONLY names from this list. Never vary, abbreviate, or add titles beyond what is listed.
   COMPLETE CAST (no other named characters exist): John Devereux, Marjorie Drury, Solange Mandeville, Jerome Lovell, Roy Courtenay
   - "Mr. Jennings entered the room" → ILLEGAL. Jennings is not in the cast.
   - "Constable Reed took notes" → ILLEGAL. Reed is not in the cast.
   - "A constable took notes" → LEGAL (no name given).

2. Character roles are fixed:
   - John Devereux: Authority Figure
   - Marjorie Drury: Romantic Interest
   - Solange Mandeville: Insider Outsider
   - Jerome Lovell: Antagonistic Rival
   - Roy Courtenay: Curious Observer
   - Never place characters in locations inconsistent with their role

## FIRST-APPEARANCE SUSPECT INTRO CONTRACT (MANDATORY)
When a character below appears for the first time in this batch, their first beat must establish all of the following in natural prose:
1. Public identity (who they are in this household/social world)
2. Connection to the victim
3. Why they matter to the investigation now
4. Surface behaviour plus one subtle suspicious/emotional tell
5. The investigator's immediate read of that behaviour (provisional, not a verdict)
Bad (too thin): "Captain Hale stood nearby."
Good pattern: "Captain Hale, the household steward and the victim's trusted adviser, stood nearest the body. His posture was disciplined, but his hand tightened around his watch chain."
Use subtle pressure cues only. Do not write confessions or explicit guilt declarations in first appearances.

- John Devereux
  Public identity anchor: Retired Army Officer; suspect 
  Connection to victim: directly tied to the victim's social circle.
  Investigation relevance: access plausibility: high | alibi window: 11:00 - 11:30 | opportunity channel: study window.
  Suspicion/pressure cue seed: nervous when asked about his whereabouts.
  Investigator read: include one immediate observational inference (gesture, gaze target, pause, object grip), but do not state guilt as fact.

- Marjorie Drury
  Public identity anchor: Socialite; victim 
  Connection to victim: directly tied to the victim's social circle.
  Investigation relevance: access plausibility: N/A | alibi window: N/A.
  Suspicion/pressure cue seed: Her life..
  Investigator read: include one immediate observational inference (gesture, gaze target, pause, object grip), but do not state guilt as fact.

WORLD DOCUMENT (use this as your primary creative context):

## Era: February 1932
Living through February 1932 is characterized by bleak winter days filled with overcast skies and the persistent chill of the Great Depression, where every corner of society feels the weight of economic struggle. Families huddle around meager meals, and community charity events become essential lifelines, highlighting the growing divide between the wealthy and the impoverished. The anxiety of uncertain futures looms large, as whispers of political unrest and radical movements echo through the streets. Valentine's Day, meant for celebration, feels hollow amid the pervasive sense of despair, as love and affection are overshadowed by the pressing need for survival. The air is thick with tension, where every interaction is tinged with the unspoken fear of losing what little stability remains.
Emotional register: A collective emotional state of anxiety and despair permeates everyday life.
Physical constraints: Short daylight hours with the sun setting around 5:30 PM. | Chilly temperatures ranging from 30 to 40 degrees Fahrenheit. | Overcast skies with sporadic rain showers.
Current tensions (weave into background texture): Intensifying economic struggles as the Great Depression continues. | Political unrest with rising socialist movements in Britain. | Increased tensions due to the rise of fascism in Europe.
Wartime context — Many veterans are struggling to reintegrate into civilian life after World War I.: The community grapples with the ramifications of wartime service, including trauma and loss. Absence effect: The absence of many men due to war has left a void in families and communities, intensifying class tensions.

## Season Lock (mandatory — derived from February 1932)
Season: winter. Allowed vocabulary: winter, wintry, midwinter
Forbidden seasonal words — never use in narration, dialogue, or metaphor: spring, summer, autumn and their adjectival forms.
Every weather description, atmosphere, and time-of-year reference must be consistent with winter.

## Story Theme
In the shadow of economic despair, the facades of social prestige crumble, revealing the darker truths of human ambition and the lengths one will go to preserve their status.

## Story Emotional Register
Dominant: This story navigates the turbulent waters of despair, deception, and the quest for redemption.

Arc:
The narrative opens within the grand yet foreboding Middleton Manor, a place suffused with tension and hidden secrets, where the murder of Marjorie Drury sends shockwaves through the socialite community. As Detective Solange Mandeville begins her investigation, the atmosphere thickens with unease, and every interaction among the guests reveals layers of intrigue and deception. Each suspect carries their own burdens — John Devereux's financial struggles, Marjorie’s desperate need to maintain her status, and Jerome Lovell's political ambitions — all intertwining with the emotional cost of their secrets. The first investigative turn introduces the tampered clock, a clue that shifts the trajectory of the investigation, leading to a series of misdirects and emotional confrontations.

A mid-story pivot reveals John’s alibi, igniting suspicion and forcing Solange to confront the hidden motives fueling each character's actions. As revelations unfold, the pressure mounts, culminating in a tense climax where loyalties are tested, and truths are laid bare. The resolution leaves each character changed — John grappling with his guilt, Marjorie facing the consequences of her choices, Solange reconciling her affection for John with her professional duty, and Roy pursuing justice amid his vendetta. The emotional register shifts from despair to a fragile sense of hope, underscoring the cost of truth in a world where appearances can be deceiving.

## Emotional register at this point in the story
The atmosphere is thick with tension, setting the stage for the unraveling mystery.

## Character Portraits (appearance & era)

### John Devereux
John Devereux embodies the struggles of a veteran in the 1930s, haunted by the ghosts of his past and the fear of losing his hard-won reputation amidst the economic turmoil. His financial strain reflects the broader struggles of many men in his position, and his desperation to maintain honor in a changing world resonates with the societal pressures of the time.
Era intersection: His private torment is magnified by the Great Depression, creating a dichotomy between his public persona and personal turmoil.

### Marjorie Drury
Marjorie Drury represents the affluent class grappling with the fear of losing their status in an era of economic decline. Her vibrant social life is a facade that masks her desperation to maintain appearances, reflecting the societal pressures on women to uphold their roles amidst shifting dynamics.
Era intersection: Her secret affair and the threat of scandal underscore the precariousness of her position in a world where social status is increasingly fragile.

## Character Voices

### John Devereux (he/him/his)
John's voice carries the weight of authority, marked by a deliberate cadence that reflects his military background.
[comfortable] You see, in times like these, honor is all we have left.
[evasive] I was merely tending to the garden; it’s quite the task, you know.
[stressed] I can't afford to be seen as weak, not now.
Humour: John's dry wit emerges when he feels secure, but he rarely uses humor in serious situations.

### Marjorie Drury (she/her/her)
Marjorie's voice is melodic and engaging, filled with a playful charm that captivates her audience.
[comfortable] Oh darling, life is far too short for dull moments!
[evasive] You know how rumors can swirl; let’s not dwell on that.
[stressed] What if they find out? I can’t let that happen!
Humour: Marjorie's polite savagery often adds layers to her interactions, making her charm all the more engaging.

## Location Registers (scene framing guides)

Drawing Room: The drawing room is filled with a sense of opulence that contrasts sharply with the underlying tensions. Every gathering feels like a performance, where laughter masks unspoken fears and the weight of hidden truths looms large.. Camera angle: Entering this space, the writer should adopt a viewpoint that captures the juxtaposition of elegance and unease.. Era: The social dynamics of the 1930s create a pressure cooker atmosphere, where each interaction is laden with the implications of class.

Study: The study is a sanctuary of contemplation, yet it pulses with the tension of secrets waiting to be uncovered. The cluttered desk and ticking clock seem to echo the urgency of the investigation, drawing the characters into deeper introspection.. Camera angle: The writer should approach this location with a lens focused on the duality of refuge and confinement.. Era: The isolation of the space mirrors the emotional solitude of its occupant, reflective of a time when introspection often masked deeper turmoil.

Cellar: The cellar exudes an air of secrecy, where shadowy corners hide the weight of unspoken truths. The cool, damp atmosphere offers a sense of claustrophobia, compelling characters to confront the hidden aspects of their lives.. Camera angle: A writer entering should feel the oppressive weight of the space, capturing the tension of concealment.. Era: The cellar's isolation mirrors the societal claustrophobia felt during the Great Depression, where secrets fester in the dark.

Formal Garden: The formal garden, while visually stunning, holds an unsettling undercurrent. Its beauty is tinged with the knowledge that behind the manicured hedges, secrets and whispered conversations thrive, creating a stark contrast to the outward elegance.. Camera angle: The writer should evoke a sense of paradox, capturing the allure of beauty intertwined with the tension of hidden narratives.. Era: The garden serves as a reminder of the societal expectations that dictate behavior, even as the characters grapple with personal truths.

## Humour guidance for this story position (opening)
Permission: forbidden
Rationale: The gravity of the murder sets a serious tone that does not lend itself to humor.

FAIR-PLAY AND INFERENCE CONTRACT:
- FAIR PLAY CLUE TIMING: Never combine clue discovery and detective deduction in the same chapter. If a clue is first revealed to the reader in chapter N, the detective may only analyze, deduce from, or act on that clue in chapter N+1 or later.
- FAIR PLAY INFORMATION PARITY: The reader must see all clues BEFORE the detective uses them in reasoning. If the detective performs a test or makes a deduction, every piece of evidence supporting that conclusion must have been shown to the reader in earlier chapters.
- FAIR PLAY REVELATION SPACING: In the discriminating test scene, the detective can ONLY use clues that were revealed to the reader at least 1 full chapter earlier. Never introduce new clues or withheld information during the test.
- FAIR PLAY CONFRONTATION: During the final confrontation/revelation, the detective cannot surprise the reader with facts. Every piece of evidence cited must have been visible to the reader in prior chapters.
- Never solve by withheld information. Keep reader-information parity with detective reasoning.
- False assumption in force: Marjorie Drury was murdered shortly after the clock struck a quarter past eleven.
- Hidden truth to progressively expose: The clock was deliberately set back to mislead the investigation.
- Inference path checkpoints to dramatize clearly (observation -> correction -> effect):
  - Step 1: obs: The library clock shows a time of ten minutes past eleven. | corr: This contradicts the statement that Marjorie was murdered at a quarter past eleven. | effect: Narrows the potential time frame for the murder.
  - Step 2: obs: John Devereux was seen in the garden at 11:10. | corr: If the clock was tampered with, John could have committed the murder. | effect: Narrows the suspect pool to John Devereux.
  - Step 3: obs: The clock was found with fingerprints only belonging to John. | corr: This indicates John tampered with the clock to create a false alibi. | effect: Eliminates other suspects by proving only John had access to alter the clock.
- Discriminating test method: trap
- Discriminating test design constraint: A controlled comparison of the clock's time with other timepieces in the manor reveals that John tampered with the clock to cover his tracks.
- Test must rely on already-shown clue IDs: clue_mechanism_visibility_core, clue_core_contradiction_chain, clue_3, clue_1, clue_2
- Fair-play rationale: Step 1: The clock's misalignment and witness testimony reveal a discrepancy in timing. Step 2: John's alibi is contradicted by the clock and witness accounts. Step 3: John's fingerprints on the clock directly link him to the tampering.

## Character Reference

### John Devereux (he/him — NEVER she/her)
Speaks in a deliberate, measured tone, often punctuating his sentences with military precision
He has a habit of using metaphors from his army days, like 'holding the line' when discussing personal dilemmas.
Haunted by memories of decisions made during the war, John grapples with guilt and the fear that he is not the man he once believed himself to be.

### Marjorie Drury (she/her — NEVER he/him)
Speaks in a melodic tone, often punctuating her sentences with playful sarcasm
She has a tendency to use grand gestures and expressive language, making her conversations lively and engaging.
Marjorie grapples with the tension between her desires and the societal expectations that bind her, constantly weighing the cost of her choices.



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

Primary Location: Middleton Manor (Little Middleton, England)
An imposing manor house surrounded by formal gardens and dense woodlands, steeped in secrets and tension.

Key Locations Available:
- Drawing Room (interior): Gathering space for the family and guests
- Study (interior): Private space for contemplation and work
- Cellar (interior): Storage area for wine and provisions; potential hiding place
- Formal Garden (exterior): Landscaped area for leisure and social gatherings

Atmosphere (tonal cue only — do NOT reproduce this phrase verbatim in prose; translate into scene-specific, character-observed sensory language): Tense, with an underlying sense of unease due to recent events.
Weather: Overcast with occasional rain showers, typical of late spring.

Era markers: petrol touring cars on winding country roads | typewriters clacking in the study | domestic telephones with party-line exchanges

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
  - Visual: flickering candlelight, dark wood paneling, plush velvet furnishings
  - Sounds: whispers of conversation, crackling fire, soft music from a gramophone
  - Scents: old leather and tobacco, burning wood and wax, dusty upholstery
  - Touch: smooth velvet cushions, cool marble fireplace

Study (interior):
  - Visual: dust motes in sunlight, books with worn spines, a heavy oak desk
  - Sounds: typing on a typewriter, pages rustling, distant clock ticking
  - Scents: old paper and ink, polished wood, leather bindings
  - Touch: smooth typewriter keys, cool leather chair

Cellar (interior):
  - Visual: flickering candlelight, shadowy corners, dusty bottles on shelves
  - Sounds: dripping water, muffled footsteps, the creak of old wood
  - Scents: musty earth and damp stone, aged wine and wood, faint scent of mold
  - Touch: rough stone walls, cool air brushing the skin

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

- Living through February 1932 is characterized by bleak winter days filled with overcast skies and the persistent chill of the Great Depression, where every corner of society feels the weight of economic struggle
- Families huddle around meager meals, and community charity events become essential lifelines, highlighting the growing divide between the wealthy and the impoverished
- The anxiety of uncertain futures looms large, as whispers of political unrest and radical movements echo through the streets
- Valentine's Day, meant for celebration, feels hollow amid the pervasive sense of despair, as love and affection are overshadowed by the pressing need for survival
- The air is thick with tension, where every interaction is tinged with the unspoken fear of losing what little stability remains.

TEMPORAL CONTEXT:

This story takes place in February 1932 during winter.

Seasonal Atmosphere:
- Weather patterns: chilly temperatures ranging from 30 to 40 degrees Fahrenheit, overcast skies with sporadic rain showers, occasional flurries of snow
- Daylight: Short daylight hours with the sun setting around 5:30 PM, creating early darkness.
- Seasonal activities: ice skating on local ponds, sipping hot cocoa by the fire, attending charity events for the local poor
- Seasonal occasions: Valentine's Day
- Season: winter

Period Fashion (describe naturally):
- Men formal: tailored three-piece suit in wool, double-breasted dinner jacket, white dress shirt with a wing collar
- Men casual: knitted pullover sweater, corduroy trousers, herringbone tweed cap
- Men accessories: silk tie, leather gloves, dress watch
- Women formal: elegant tea-length dress with a dropped waist, cloche hat adorned with a feather, long evening gloves
- Women casual: simple woolen skirt and blouse, tweed jacket, knitted shawl
- Women accessories: string of pearls, silk scarf, small handbag with a chain strap

Cultural Context (reference naturally):
- Music/entertainment: Benny Goodman and his orchestra, Duke Ellington's big band, George Gershwin's compositions; Films: The Front Page, Scarface; Theatre: The Royal Family, The Front Page (Broadway); Radio: Amos 'n' Andy, The Shadow
- Typical prices: Loaf of bread: four pence, Cinema ticket: one shilling, Dress shirt: six shillings
- Current events: intensifying economic struggles as the Great Depression continues; political unrest with rising socialist movements in Britain
- Literature: The Good Earth by Pearl S. Buck | Murder in the Cathedral by T.S. Eliot | The Maltese Falcon by Dashiell Hammett | [mystery fiction] | [social realism] | [modernist literature]
- Technology: the electric razor | the television (in experimental stages) | the radio with improved reception | domestic telephones | typewriters in offices | petrol cars for transportation
- Daily life: attending local dances, participating in community charity events, gathering around the radio for entertainment
- Social rituals: afternoon tea served daily, weekly church services followed by community gatherings

Atmospheric Details:
The scent of damp earth mingles with the faint aroma of wood smoke from the fireplace, creating a cozy yet tense atmosphere inside the grand estate. The sound of rain pattering against the windowpanes accompanies the occasional crackle of the radio, which provides a backdrop to hushed conversations and stolen glances. Outside, the landscape is a muted palette of greys and browns, with leafless trees standing stark against the low-hanging clouds, reflecting the somber mood of the nation.

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

• [clue_mechanism_visibility_core] Direct observation
  Category: structural | Placement: early (Act 1)
  Points to: what this observation reveals about the time or circumstances of the crime.

For each clue above: an attentive reader should be able to find, record, and later use it to reason toward the solution.

═══ NARRATIVE STATE (read-only — do not contradict) ═══

LOCKED FACTS — use verbatim whenever this evidence is described:
  • The exact time shown on the stopped clock face: "ten minutes past eleven"
  • The exact amount the clock was wound back: "forty minutes"

CHARACTER PRONOUNS — never deviate from these:
  • John Devereux: he/him/his
  • Marjorie Drury: she/her/her
  • Solange Mandeville: she/her/her
  • Jerome Lovell: he/him/his
  • Roy Courtenay: he/him/his

INVESTIGATION LOG — WHAT IS ESTABLISHED (do not re-establish, do not repeat):
• Suspects still unresolved: Jerome Lovell[HE], Roy Courtenay[HE]
⚠ The story must move FORWARD from this log. Any beat already listed above is forbidden from repeating.

⚠ THIS CHAPTER'S REQUIRED ADVANCE (opening): Discover the body, confirm the victim, establish the scene. The victim is found dead. They do not speak, react, or gesture. This is their only physical appearance — in all subsequent chapters they exist only in past tense (memory, evidence, testimony).
═══════════════════════════════════════════════════════

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
Known location profile anchors: Middleton Manor, Drawing Room, Study, Cellar, Formal Garden, the library of the Devereux manor
LOCATION NAME CAPITALISATION (HARD REQUIREMENT — validated):
All named locations in your prose MUST use the EXACT capitalisation from the CML profiles.
Canonical forms: "Middleton Manor", "Drawing Room", "Study", "Cellar", "Formal Garden", "the library of the Devereux manor"
Writing a location in lowercase (e.g. "drawing room" instead of "Drawing Room") is a validated error. Every time you mention a named location, copy its capitalisation from the list above.
- Chapter 1: OPENING STYLE (HARD): Start the VERY FIRST SENTENCE with a named character performing a physical action or motion — e.g. "[Name] crossed the threshold…" / "[Name] set down the glass…" / "[Name] rose from the chair…". Anchor opening in "the library of the Devereux manor". HARD REQUIREMENT for the first 2 paragraphs: (a) include 2+ sensory words — choose from smell/scent/sound/echo/silence/creak/whisper/cold/warm/damp/rough/smooth/glow/shadow/flicker/dim — and (b) include 1+ atmosphere/time word — choose from rain/wind/fog/storm/mist/thunder/evening/morning/night/dawn/dusk/season/afternoon/midday/noon/midnight/twilight/sunrise/sunset/daylight/sunlight/overcast/cloudy/bright/dark. These are validated requirements, not style suggestions; missing them triggers a retry.

⛔ ABSOLUTE PRONOUN LOCK — NO EXCEPTIONS

The following pronouns are locked facts, on the same level as character names
and hard-logic device values. Using the wrong pronoun is a continuity error,
not a style choice.

Canonical pronoun table (subject / object / possessive / reflexive):
  • John Devereux: ALWAYS he/him/his/himself — NEVER she/her/herself
  • Marjorie Drury: ALWAYS she/her/her/herself — NEVER he/him/his/himself
  • Solange Mandeville: ALWAYS she/her/her/herself — NEVER he/him/his/himself
  • Jerome Lovell: ALWAYS he/him/his/himself — NEVER she/her/herself
  • Roy Courtenay: ALWAYS he/him/his/himself — NEVER she/her/herself

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
   WRONG: "Marjorie watched Devereux; she crossed the room and he frowned." (ambiguous antecedent)
   RIGHT: "Marjorie watched Devereux; Devereux crossed the room and Marjorie frowned." (explicit)
9. In dialogue attribution, the pronoun refers to the SPEAKER — not the last character
   named inside the quoted speec
[truncated for prompt budget]

PROMPT BUDGET SUMMARY: budget=32000 tokens; fixed=6640; context=9171; dropped=[none]; truncated=[temporal_context, pronoun_accuracy]

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
- Chapter numbering starts at 1 and increments by 1 per scene.
- Each chapter has 4-8 substantial paragraphs (each 120–180 words) — TARGET ≥ 1250 words — do not stop early.
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

QUALITY GUIDELINES (strongly preferred):
1. Use only canonical cast names from CML. Do not invent titled placeholders like 'Detective Surname', 'Inspector Surname', 'a woman Surname', or 'a man Surname'.
2. Before the final reveal closes, include explicit suspect-elimination coverage: each non-culprit suspect is ruled out with concrete on-page evidence or confirmed alibi.
3. In the reveal sequence, include a complete culprit evidence chain using explicit reasoning connectors (because/therefore/proves).
4. Integrate at least two concrete era-grounded details per chapter from setting refinement signals: petrol touring cars on county roads | domestic telephones in homes with party-line exchanges | typewriters standard in offices | telegrams for urgent messages | aerial mail services for faster delivery | telephone communication for local interactions.
5. Respect setting movement/access constraints in scene action and alibis: Geography allows for limited escape routes through the dense forest. | Architecture includes locked rooms and hidden passages. | Weather conditions can restrict movement, with rain making paths slippery. | Restricted areas such as the study and cellar are off-limits to staff. | Daily routines dictate access times for various household members..
6. Sustain social coherence with this backdrop pressure: A gathering at the manor for a contentious estate meeting forces heirs and staff to confront growing class tensions and the looming shadow of the Great Depression.
7. Maintain continuity around these socially central cast anchors where relevant: John Devereux, Marjorie Drury, Solange Mandeville, Jerome Lovell, Roy Courtenay.

CRITICAL PROSE REQUIREMENTS:

The CML specifies exact requirements for certain validation-critical scenes. You MUST include these elements at the specified positions.

**Discriminating Test Scene (Act 3, Scene 4):**
Required elements: Execute the discriminating test, Observe the culprit's reaction or result, Draw conclusion about guilt
Test type: trap

**Suspect Clearance Scenes:**
- Jerome Lovell (Act 3, Scene 5): Proving his alibi was confirmed by other witnesses.
  Clues: clue_id_1, clue_id_2
- Roy Courtenay (Act 3, Scene 5): Clarifying his position at the time of the murder through corroborative testimonies.
  Clues: clue_id_3, clue_id_4

**Culprit Revelation Scene (Act 3, Scene 6):**
Method: Confrontation with evidence

**Clue Placement for These Chapters:**
- clue_mechanism_visibility_core must appear in Act 1, Scene 1 via Direct observation

**VALIDATION CONSEQUENCE:** If these requirements are not met exactly, story validation will fail and the entire generation will be rejected. Follow these specifications precisely.


## ACTIVE CHAPTER MODE CONTRACT (MANDATORY)
Active chapter mode: Discovery Opening.
Mode required outcomes:
- Victim is named explicitly and the body is encountered within the first two paragraphs.
- Major suspects are introduced with relevance and tension.
- First clue is planted without full mechanism explanation.
Forbidden at this stage:
- No culprit reveal.
- No full murder mechanism explanation.
- Do not state the direction, magnitude, or agent of any clock or device tampering. Characters may only observe that two time sources disagree. "The clock was wound back by forty minutes" must not appear before Chapter 3.
Mode-specific narrative balance targets:
- Setting: 15-20%
- Character Introductions: 35-40%
- Discovery Reactions: 25-30%
- First Clue: 10-15%

## CHAPTER OUTCOME CONTRACT (MANDATORY)
Batch chapters: 1-1.
Investigation state at start: 0 clue(s) revealed to reader; approximately 2 unresolved suspect(s).
Must change by end: Introduce cast relevance and plant first clue while keeping culprit unresolved.
Suspect pressure target(s): John Devereux
Required new information: First clue observation tied to suspect landscape.
Forbidden reveals at this stage: No culprit reveal. | No full murder mechanism explanation. | Do not state the direction, magnitude, or agent of any clock or device tampering. Characters may only observe that two time sources disagree. "The clock was wound back by forty minutes" must not appear before Chapter 3.

## CHAPTER COMPOSITION TARGETS (MANDATORY NARRATIVE BALANCE)
Treat percentages as narrative attention share (sentence/paragraph focus), not exact token math.
Active phase for this batch: Chapter1 (mode: Discovery Opening).
Apply this target mix in this batch:
- Setting: 20%
- Character Introductions: 40%
- Discovery Reactions: 30%
- First Clue: 10%
Reference profile across chapter phases:
- Chapter1: Setting 20% | Character Introductions 40% | Discovery Reactions 30% | First Clue 10%
- Early Investigation: Setting 10-15% | Character Pressure 35-40% | Clue Development 45-50%
- Middle Chapters: Setting 10% | Character Conflict 30-35% | Alibi Testing Clue Reinterpretation 50-60%
- False Suspect Chapters: Setting 10% | Character Focus 45% | Evidence Contradiction 45%
- Discriminating Test Chapter: Setting 10% | Character Reaction 20-25% | Test Proof Reversal 65-70%
- Final Reveal: Setting 10% | Motive Character Consequence 30% | Evidence Chain 40% | Confession Aftermath 20%
If obligations conflict, preserve hard clue/evidence/logic contracts first, then satisfy the composition mix.

## Asset Self-Report (required)
At the very END of your response, after all prose, add a single line:
<used_assets>era:story:0,era:story:1,era:story:2,era:story:3,era:story:4</used_assets>
Replace the list with only the IDs of texture assets you actually used. If you used none, output <used_assets></used_assets>.
```

## Message 2 (role=user)

```text
Write the full prose following the outline scenes.



CHAPTER OBLIGATION CONTRACT (MUST SATISFY):
- ERA RULE (1930s): NEVER use these anachronistic terms: "computer", "internet", "email", "cell phone", "mobile phone", "smartphone", "GPS", "laptop", "digital camera", "text message", "app", "wifi", "bluetooth", "jet plane". Any occurrence will cause the chapter to be rejected.
- STYLE HARD-BAN: NEVER use these phrase families: "clock tower at quarter past three", "near the clock tower at quarter past", "showed quarter past three when the body", "in the formal gardens during the murder". Any occurrence triggers rejection/retry.
- STYLE SOFT-BAN: avoid these stock phrases and rewrite them if they appear in draft text: "lips pressed into a thin line", "the household runs smoothly when every cog", "the pressures upon this household are many", "the doctor [Surname] (use Dr. Surname or 'the doctor', never role + bare surname)", "the captain [Surname] (use Captain Surname or 'the captain', never role + bare surname)", "the inspector [Surname] (use Inspector Surname or 'the inspector', never role + bare surname)", "the sergeant [Surname] (use Sergeant Surname or 'the sergeant', never role + bare surname)", "the constable [Surname] (use Constable Surname or 'the constable', never role + bare surname)", "the gentleman [Surname] (use Mr. Surname or 'the gentleman', never role + bare surname)".
- STYLE WATCHLIST: keep these patterns varied and scene-specific: "quarter past three", "three fifteen", "the old bell striking three fifteen", "the chimes echoed just after three-fifteen".
- Chapter 1:
  - STRUCTURAL ARCHETYPE — Chapter 1 must be: DISCOVERY
      ✓ MUST contain: body found / victim identified
      ✗ MUST NOT contain: formal accusation or interrogation
  - Word count: Target 1250 words. Achieve this through plot events, dialogue exchanges, and physical investigation — not through atmospheric repetition or extended internal reflection. Each 200-word segment should contain at minimum one concrete story event (a discovery, a conversation exchange, a physical action or movement). Padding with atmosphere alone is not acceptable.
  - VICTIM IDENTITY LOCK (MANDATORY): name the victim as "Marjorie Drury" in the discovery scene. After first mention, do not use unnamed placeholders such as "the victim" without naming Marjorie Drury in the same paragraph.
  - Opening: Begin with a character action, spoken line, or clock/time marker — never a location name or location-description phrase.
  - Scene is set in: the library of the Devereux manor — reference it naturally within the paragraph, never as your opening phrase.
  - Opening atmosphere (MANDATORY — validator enforced): the first paragraph MUST contain at least one of: rain / wind / fog / storm / mist / thunder / evening / morning / night / dawn / dusk / season / afternoon / midday / noon / midnight / twilight / sunrise / sunset / daylight / sunlight / overcast / cloudy / bright / dark / grey / pale / cold / warm / chill / crisp / damp / drizzle / haze / lamplight / firelight. A chapter that omits all of these from its opening paragraph will be rejected.
  - PARAGRAPH OPENER DIVERSITY (MANDATORY — validator enforced): No more than 2 paragraphs in this chapter may begin with "Solange" or "Solange's" as the first word. You must vary paragraph openings throughout: use sensory observations, another character's name or action, dialogue, object or sound details, or temporal markers. Opening 3 or more paragraphs with "Solange" will cause automated rejection.
  - INVESTIGATOR ESTABLISHMENT REQUIRED: Solange Mandeville must claim or be recognised as the investigator in this chapter. Establish Solange Mandeville as the detective-in-charge within the first two paragraphs — Solange Mandeville IS the investigator. Do NOT have any character suggest a "real" detective is still coming, or imply that authority has not yet been delegated. Solange Mandeville begins the investigation in this chapter.
  - ⛔ BODY DISCOVERY ORDER (MANDATORY — Chapter 1 only): the victim's body must be physically encountered or described within the first TWO paragraphs. Do NOT spend the opening paragraphs solely on clock examination, atmospheric setup, or character introductions before the body is found. Required Chapter 1 structure: atmosphere (one sentence max) → body/discovery → investigator reaction → suspects → first time-source contradiction.
  - ⛔ MECHANISM SPOILER BAN (Chapters 1–2): Do NOT state how the crime device was manipulated — not the direction, not the magnitude, not who performed it. Characters may only observe that two sources of evidence disagree. The specific method, tamper amount, and perpetrator's action are ALL FORBIDDEN until Chapter 3. WRONG: "The culprit had altered the device by forty minutes to create a false alibi." RIGHT: "Two independent pieces of evidence gave contradictory readings — a discrepancy neither could yet explain."
  - CLUE OBLIGATIONS — mandatory prose elements (do NOT omit or bury):
    • The clock in the library was tampered with to mislead the timing of Marjorie's murder. [clue_mechanism_visibility_core] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: This reveals the core mechanism of the murder being timed incorrectly.
      ↳ MANDATORY TWO-PARAGRAPH STRUCTURE (must appear in paragraphs 1 or 2 — no later):
         Paragraph 1: The POV character physically approaches or directly observes this evidence.
           The narration or dialogue explicitly states what is seen (use the exact locked phrase if one applies).
         Paragraph 2 (immediately following): The detective or POV character explicitly reasons
           about what this evidence implies — who it implicates, why it may be unreliable,
           or what inference it supports. This must be a separate full paragraph, not a sentence appended to Paragraph 1.
  - Tonal contrast: include at least one beat of relief or ironic counterpoint. Do not sustain maximum tension for every paragraph.
  - CLUE DISCLOSURE RULE (Stage 1/4):
    Characters may OBSERVE anomalies (wrong time, missing object, odd detail) but must NOT explain the mechanism, deduce the method, or name the culprit. Discovery and reaction only.
    WRONG: dialogue or narration that directly explains how the crime was committed before Stage 4.
    RIGHT: observation, physical reaction, and logical inference that leaves the mechanism just off-screen.
  - ALIBI LOCK: John Devereux's established alibi is "11:00 - 11:30". Do NOT place John Devereux at any other location or in any other activity during the crime window. Any contradiction is a continuity error that triggers a retry.
- Locked fact phrase obligations:
  - If this batch mentions The exact time shown on the stopped clock face, write exactly: "ten minutes past eleven".
  - If this batch mentions The exact amount the clock was wound back, write exactly: "forty minutes".
- Seasonal vocabulary allow-list: winter, wintry, midwinter.
- Forbidden seasonal words: spring, summer, autumn.

⛔ PRONOUN TABLE — re-check after EVERY paragraph before writing the next:
    John Devereux: he/him/his
    Marjorie Drury: she/her/her
    Solange Mandeville: she/her/her
    Jerome Lovell: he/him/his
    Roy Courtenay: he/him/his
  Any sentence containing a pronoun must agree with this table. Correct mismatches before moving on.

## CHAPTER OUTCOME CONTRACT (MANDATORY)
Batch chapters: 1-1.
Investigation state at start: 0 clue(s) revealed to reader; approximately 2 unresolved suspect(s).
Must change by end: Introduce cast relevance and plant first clue while keeping culprit unresolved.
Suspect pressure target(s): John Devereux
Required new information: First clue observation tied to suspect landscape.
Forbidden reveals at this stage: No culprit reveal. | No full murder mechanism explanation. | Do not state the direction, magnitude, or agent of any clock or device tampering. Characters may only observe that two time sources disagree. "The clock was wound back by forty minutes" must not appear before Chapter 3.

FROZEN FACT STATE (DO NOT ALTER):
- Timeline anchor: February (winter).
- Month, season, weather, and time-of-year language in this batch must stay compatible with winter.
- Established timeline fact: clock shows quarter past eleven
- Established timeline fact: witnesses heard a scream shortly after
- If referenced, use exact phrase: "ten minutes past eleven" (The exact time shown on the stopped clock face).
- If referenced, use exact phrase: "forty minutes" (The exact amount the clock was wound back).

STORY TO DATE (REFERENCE ONLY — DO NOT COPY VERBATIM):
- No previous chapter text exists yet for this batch.

# Case Overview
Title: A Race Against Time
Era: 1930s
Setting: Little Middleton, Yorkshire
Crime: murder (premeditated murder)
Culprit: John Devereux
False assumption: Marjorie Drury was murdered shortly after the clock struck a quarter past eleven.
Cast: John Devereux (he/him), Marjorie Drury (she/her), Solange Mandeville (she/her), Jerome Lovell (he/him), Roy Courtenay (he/him)

Setting Lock: Keep all scenes and descriptions consistent with the stated setting (Little Middleton, Yorkshire). Do not introduce a different location type. Do not invent an alternative estate name. The only permitted name for this property is "Little Middleton, Yorkshire" — any other estate name (e.g., "Caldwell Manor", "Ashwood Hall", or any invented proper name) is a continuity error that will be caught and rejected.

⛔ PRONOUN LOCK (verify every sentence before writing):
• John Devereux — he/him/his (NEVER she/her)
• Marjorie Drury — she/her/her (NEVER he/him)
• Solange Mandeville — she/her/her (NEVER he/him)
• Jerome Lovell — he/him/his (NEVER she/her)
• Roy Courtenay — he/him/his (NEVER she/her)

Outline scenes:
[
  {
    "sceneNumber": 1,
    "act": 1,
    "title": "Discovery",
    "setting": {
      "location": "the library of the Devereux manor",
      "timeOfDay": "Morning after the murder",
      "atmosphere": "Tense household awaiting the detective's arrival"
    },
    "characters": [
      "John Devereux",
      "Marjorie Drury"
    ],
    "purpose": "Introduce the crime and detective",
    "cluesRevealed": [],
    "dramaticElements": {
      "conflict": "Locked room mystery established",
      "tension": "Every suspect had access to the victim",
      "microMomentBeats": [
        "John stares blankly at the clock, his mind racing with thoughts."
      ]
    },
    "summary": "In the dim light of the library, John Devereux discovers Marjorie Drury's lifeless body sprawled on the floor. Shocked, he calls for help, and the household is thrown into chaos. As whispers of suspicion circulate, John recalls the last time he saw Marjorie alive, just before eleven. The clock on the wall shows a different time, setting the stage for investigation.",
    "estimatedWordCount": 1250,
    "emotionalRegister": "The atmosphere is thick with tension, setting the stage for the unraveling mystery.",
    "dominantCharacterNote": {
      "name": "John Devereux",
      "voiceRegister": "John's voice carries the weight of authority, marked by a deliberate cadence that reflects his military background."
    },
    "humourGuidance": {
      "permission": "forbidden"
    },
    "eraTextureNote": "Short daylight hours with the sun setting around 5:30 PM.; Chilly temperatures ranging from 30 to 40 degrees Fahrenheit.; Overcast skies with sporadic rain showers.",
    "locationRegisterNote": ""
  }
]
```

## Message 3 (role=user)

```text
BEFORE SUBMITTING YOUR JSON — verify this checklist:
□ Each chapter reaches the hard floor of 450 words and aims for 1250 words or more.
□ If you mention locked evidence, you used the exact locked phrase verbatim.
□ Allowed seasonal words only: winter, wintry, midwinter.
□ Forbidden seasonal words: spring, summer, autumn.
□ Chapter 1: "The clock in the library was tampered with to mislead the timing of Marjorie's murder." is placed in the first 25% of the chapter, followed by an explicit inference or suspicion paragraph.
□ Mode check (Discovery/Opening): victim is explicitly named and major suspects are introduced before deep mechanism explanation.
□ Mode check (Discovery/Opening): no culprit reveal and no full murder mechanism explanation.
□ PRONOUN AUDIT — for every character you named in your chapters, list the pronouns you actually used, then verify against the canonical table. Correct any mismatch before outputting. Do NOT include this audit in your JSON output.
  Character            | Canonical     | Used in draft | Match?
  ---------------------|---------------|---------------|-------
  John Devereux        | he/him/his/himself        | [fill in]     | [yes/no]
  Marjorie Drury       | she/her/her/herself       | [fill in]     | [yes/no]
  Solange Mandeville   | she/her/her/herself       | [fill in]     | [yes/no]
  Jerome Lovell        | he/him/his/himself        | [fill in]     | [yes/no]
  Roy Courtenay        | he/him/his/himself        | [fill in]     | [yes/no]
□ Return valid JSON only.
```

## Message 4 (role=assistant)

```text
{
  "status": "draft",
  "tone": "classic",
  "chapters": [
    {
      "title": "Chapter 1: Discovery",
      "summary": "In the dim light of the library, John Devereux discovers Marjorie Drury's lifeless body sprawled on the floor. Shocked, he calls for help, and the household is thrown into chaos. As whispers of suspicion circulate, John recalls the last time he saw Marjorie alive, just before eleven. The clock on the wall shows a different time, setting the stage for investigation.",
      "paragraphs": [
        "The cold morning air seeped through the slightly ajar window of the library of the Devereux manor, carrying with it the faint scent of damp earth and the lingering chill of winter. Shadows danced across the room, flickering in the dim light as John Devereux crossed the threshold, his heart heavy with the weight of the day. He had been summoned to the library under the pretense of a discussion about the estate, but the atmosphere felt charged with an unspoken tension, as if the very walls were holding their breath. As he stepped further inside, the sight that greeted him sent a jolt of shock through his veins. Marjorie Drury lay sprawled on the floor, her elegant dress now a stark contrast to the lifelessness of her body. A pool of dark crimson surrounded her, a macabre halo that seemed to echo the horror of the moment. John’s breath caught in his throat as he knelt beside her, the reality of the situation crashing down like a wave. 'Marjorie!' he gasped, his voice barely above a whisper, as he reached out to touch her shoulder, hoping against hope for some sign of life. But there was none. The stillness was deafening.",
        "Panic surged through him, and he scrambled to his feet, calling out for help. 'Someone! Please, come quickly!' His voice reverberated off the walls, but the only response was the distant sound of footsteps approaching. The household, once a sanctuary of elegance and charm, now felt like a cage of chaos. As he waited, his mind raced back to the last time he had seen Marjorie, just before eleven o'clock. They had shared a brief conversation, one filled with laughter and light, but now it felt like a cruel joke. The clock mounted on the wall showed a different time, its hands frozen at ten minutes past eleven, a detail that gnawed at the edges of his mind. This clock had been tampered with, and the implications were staggering. If it was indeed wrong, it could change everything about the timeline of Marjorie's death. Who would have had the opportunity to manipulate it? And why?",
        "The arrival of Solange Mandeville broke the tension in the room. She stepped in, her expression shifting from curiosity to horror as she took in the scene. 'What happened here?' she demanded, her voice steady despite the shock that must have coursed through her. John shook his head, unable to articulate the depth of his despair. Instead, he gestured toward the clock. 'It shows ten minutes past eleven,' he said, his voice trembling slightly. 'But I know I saw her alive just before that.' Solange approached the clock, her brow furrowing as she examined it closely. 'If it was set back, it could mislead the investigation,' she noted, her voice low and contemplative. John felt a chill run down his spine as he absorbed her words. The implications were staggering. If the clock was indeed wrong, it could change everything about the timeline of Marjorie's death. Who would have had the opportunity to manipulate it? And why?",
        "As the reality of the situation settled in, John found himself grappling with a growing sense of dread. Every suspect in the household had access to Marjorie, and now, with the clock's betrayal, it seemed that anyone could be implicated. His thoughts turned to the others: Jerome Lovell, whose ambitions often clashed with Marjorie's social standing, and Roy Courtenay, whose curiosity sometimes bordered on obsession. Each of them had reasons to be in the library, each could have been there at the wrong time. The air felt thick with tension as Solange continued her examination, her keen eyes taking in every detail of the room. 'We need to gather everyone and establish their whereabouts,' she declared, her tone leaving no room for argument. John nodded, still reeling from the shock of Marjorie's death and the implications of the clock's misalignment. The investigation had begun, and with it, the unraveling of secrets that had long been buried beneath the surface of their lives.",
        "As the first whispers of suspicion began to circulate among the household, John felt a knot tighten in his stomach. He had always prided himself on his integrity, but now, with the clock's betrayal looming over them, he couldn't help but wonder: how far would he go to protect his own interests? The stakes had never been higher, and the truth seemed to slip further from his grasp with each passing moment."
      ]
    }
  ],
  "cast": ["John Devereux", "Marjorie Drury", "Solange Mandeville"],
  "note": "",
  "audit": {
    "locked_fact_phrases": "present in paragraph 2 | absent",
    "season_words_used": "winter | none",
    "discriminating_test_present": "no",
    "required_clues_present": "clue_mechanism_visibility_core: chapter 1 paragraph 2 | absent",
    "early_observation_present": "description: chapter 1 paragraph 2 | present",
    "early_inference_present": "yes: paragraph immediately following observation | yes"
  }
}
```

## Message 5 (role=user)

```text
Attempt 3/6 — chapters 1 — 1 validation issue(s) to resolve:

═══ TEMPLATE LEAKAGE ERRORS (1) ═══
• Template linter: repeated sentence detected within a chapter. Rewrite or remove the duplicate sentence.

Return corrected JSON for chapters 1. Edit only the sections that failed — keep all content that passed validation, and return the complete updated chapter JSON.


RETRY CLASS: template
ATTEMPT: 2/6
OFFENDING TEXT: repeated sentence detected within a chapter. Rewrite or remove the duplicate sentence.
MANDATORY FIXES:
- Resolve template issues before accepting this batch.
- Template linter: repeated sentence detected within a chapter. Rewrite or remove the duplicate sentence.
```
