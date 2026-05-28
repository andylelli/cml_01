# Actual Prompt Record

- Run ID: `mystery-1779821356623`
- Project ID: ``
- Timestamp: `2026-05-26T19:28:21.834Z`
- Agent: `Agent9-ProseGenerator-Ch4`
- Operation: `chat_request_full_prompt`
- Model: `GPT-4o-mini`
- Temperature: `0.42`
- Max Tokens: `4500`
- Attempt: `first`
- Prompt Hash: `8cfcdfb45645a394`

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
- MORAL COMPLEXITY REQUIREMENT: The mechanism of this crime carries a moral gray area: "The culprit may have acted out of desperation to protect a loved one from the victim's impending threat." — the culprit reveal and denouement MUST acknowledge this ambiguity. Do not let the ending feel clean or simple. Give the reader at least one moment of uncomfortable sympathy or moral doubt.


⚠️ AMATEUR DETECTIVE STORY: The investigator is a civilian with no official standing. The official police (if they appear) are unnamed background figures only — "a constable", "the sergeant", "an officer from the village". Do NOT give any police official a name or title+surname combination. There is no Inspector [Surname], no Constable [Surname], no Sergeant [Surname] in this story.


CRITICAL CHARACTER CONSISTENCY RULES:

1. Each character has ONE canonical name. Use ONLY names from this list. Never vary, abbreviate, or add titles beyond what is listed.
   COMPLETE CAST (no other named characters exist): Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill
   - "Mr. Jennings entered the room" → ILLEGAL. Jennings is not in the cast.
   - "Constable Reed took notes" → ILLEGAL. Reed is not in the cast.
   - "A constable took notes" → LEGAL (no name given).

2. Character roles are fixed:
   - Eleanor Voss: Wealthy Matriarch
   - Dr. Mallory Finch: Dedicated Healer
   - Captain Ivor Hale: Outsider with a Grudge
   - Beatrice Quill: Ambitious Investigator
   - Never place characters in locations inconsistent with their role

WORLD DOCUMENT (use this as your primary creative context):

## Era: 1932-08
In August 1932, life in England is marked by the pervasive shadow of the Great Depression. Overcast skies often cloak the countryside, reflecting the mood of the populace as economic hardship tightens its grip. Social gatherings, once the hallmark of the upper class, now feel strained, filled with unspoken anxieties about wealth and future prospects. The air is thick with humidity, carrying the earthy scent of damp grass and impending rain. The divide between social classes grows ever more pronounced, with the working class grappling with poverty while the upper echelons cling to their traditions and legacies, often at great personal cost. Daily life is a mix of routine and uncertainty, with families gathering for Sunday dinners and attending cricket matches, all while underlying tensions simmer beneath the surface.
Emotional register: The collective emotional state is one of anxiety and tension, with an undercurrent of resentment among the working class.
Physical constraints: Limited transportation due to fuel shortages | Slow communication methods hampered by economic stress | Restricted access to resources amid rationing
Current tensions (weave into background texture): Debate over unemployment relief in Parliament | Growing unrest due to economic hardship | Class tensions between landowners and estate workers
Wartime context — Many veterans struggle to reintegrate into society as jobs are scarce and respect is hard-won.: Social dynamics are strained, with former soldiers facing disillusionment. Absence effect: The absence of stable employment leads to feelings of betrayal and resentment toward the upper classes.

## Story Theme
In a world where societal pressures and personal ambitions collide, the quest for truth reveals the fragility of trust and the depths of human desperation.

## Story Emotional Register
Dominant: The emotional fabric of the story is one of mounting tension and eventual catharsis.

Arc:
The story opens in the grand yet foreboding Little Middleton Manor, where the tragic discovery of Eleanor Voss's lifeless body sets a grim tone. The air is thick with the weight of her status as a wealthy heiress, yet beneath the surface lies a web of jealousy and hidden affairs. As the investigation unfolds, the gathering of guests becomes a pressure cooker of emotions, with each suspect harboring their own secrets. Beatrice Quill, an intrepid investigator, takes on the challenge, piecing together clues amidst rising tensions. The initial investigation reveals contradictory timelines, with the clock in the study serving as a pivotal piece of evidence that misleads everyone involved.

As Beatrice digs deeper, the emotional cost of the investigation begins to surface, with each character contending with their own stakes and fears. A mid-story revelation reveals the tampering of the clock, shifting the focus of the investigation and uncovering layers of deception. The stakes rise as the pressure mounts, leading to a confrontation where past grievances and aspirations collide. In the climax, the true motivations of the characters come to light, revealing the profound costs of ambition and legacy. The resolution brings a bittersweet closure as Beatrice uncovers the truth and the emotional fallout leaves lasting scars on the surviving characters, reminding them of the price of their desires and the fragility of trust.

## Emotional register at this point in the story
A pivotal clue alters the course of the investigation, shifting suspicions and raising stakes.

## Character Portraits (appearance & era)

### Captain Ivor Hale
Captain Ivor Hale is a symbol of the disillusioned veteran, his gallant exterior clashing with a simmering resentment toward the Voss family. His past and present collide in a society marked by class tensions, where the honor of military service is overshadowed by economic despair. Ivor's desire for vindication reflects the broader sentiments of those seeking justice in a time of social upheaval.
Era intersection: His personal vendetta against the upper class is a microcosm of the frustrations felt by many veterans post-war.

### Beatrice Quill
Beatrice Quill is the ambitious journalist navigating a changing landscape that demands ethical integrity amidst financial desperation. Her drive for success in the competitive field of journalism reflects the era's challenges, as many seek to rise above societal expectations. With the weight of debt on her shoulders, her quest for truth becomes a poignant commentary on the sacrifices made in pursuit of ambition.
Era intersection: Her struggles highlight the conflicts between journalistic ethics and personal survival in a time of economic hardship.

## Character Voices

### Captain Ivor Hale (he/him/his)
Ivor's voice carries a commanding presence, often tinged with sardonic humor.
[comfortable] Ah, the sea; it teaches a man his worth in ways the land never could.
[evasive] I’d rather not revisit those days; the past is a storm best left weathered.
[stressed] I need to confront the Voss family—it's time to reclaim my honor.
Humour: His sardonic humor reflects his frustrations and sharp observations about civilian life.

### Beatrice Quill (she/her/her)
Beatrice speaks rapidly, her tone urgent and focused, reflecting her ambition.
[comfortable] You see, the truth is always lurking just beneath the surface, waiting to be uncovered.
[evasive] It’s not that simple; the lines between right and wrong are often blurred in our line of work.
[stressed] I need this story to secure my future; failure is not an option.
Humour: Her bluntness can be disarming, often making light of tense situations.

## Location Registers (scene framing guides)

The Library: The library is heavy with tension, filled with the whispers of secrets and the echoes of the past, where the air feels thick with unsaid words. Shadows creep along the walls, creating an atmosphere ripe for revelation or deception, as the clock's ticking becomes a reminder of the time that slips away with each moment of uncertainty.. Camera angle: A writer entering this space should focus on the oppressive silence, ready to uncover the hidden truths lurking in the shadows.. Era: In the 1930s, this space serves as a reminder of the class divide, where the weight of tradition contrasts sharply with the currents of change.

## Humour guidance for this story position (first_turn)
Permission: permitted
Characters who may be funny: Ivor Hale
Permitted forms: sardonic
Rationale: Ivor's sardonic humor can lighten moments of tension.

## Reveal Groundwork (texture — do not explain, only plant)
- Plant one subtle observable beat related to: "Earlier scenes take on new meaning after the clock's tampering is revealed". Do not explain significance yet.
- Plant one subtle observable beat related to: "The first investigation's conflicting timelines now highlight the extent of deception at play". Do not explain significance yet.
- Plant one subtle observable beat related to: "Beatrice's initial interviews become pivotal, as her probing questions expose underlying tensions masked by cordiality". Do not explain significance yet.

FAIR-PLAY AND INFERENCE CONTRACT:
- FAIR PLAY CLUE TIMING: Never combine clue discovery and detective deduction in the same chapter. If a clue is first revealed to the reader in chapter N, the detective may only analyze, deduce from, or act on that clue in chapter N+1 or later.
- FAIR PLAY INFORMATION PARITY: The reader must see all clues BEFORE the detective uses them in reasoning. If the detective performs a test or makes a deduction, every piece of evidence supporting that conclusion must have been shown to the reader in earlier chapters.
- FAIR PLAY REVELATION SPACING: In the discriminating test scene, the detective can ONLY use clues that were revealed to the reader at least 1 full chapter earlier. Never introduce new clues or withheld information during the test.
- FAIR PLAY CONFRONTATION: During the final confrontation/revelation, the detective cannot surprise the reader with facts. Every piece of evidence cited must have been visible to the reader in prior chapters.
- Never solve by withheld information. Keep reader-information parity with detective reasoning.
- False assumption in force: Eleanor must have been killed shortly before she was found, based on the time shown on the clock.
- Hidden truth to progressively expose: The clock had been tampered with, misleading everyone about the actual time of death.
- Inference path checkpoints to dramatize clearly (observation -> correction -> effect):
  - Step 1: obs: The clock in the study shows ten minutes past eleven when discovered. | corr: The clock's time is inconsistent with witness reports of Eleanor's last sighting. | effect: Narrows time of death to between 10:30 AM and 11:00 AM, eliminating any suspect claiming to have seen her alive after this window.
  - Step 2: obs: Eleanor's diary records her last known movements matched with the clock's time. | corr: The diary's records are inconsistent with the clock's showing, suggesting tampering. | effect: Narrows the suspect list to those who had access to the clock.
  - Step 3: obs: There are no fingerprints on the clock's winding mechanism. | corr: The lack of evidence suggests the clock was wound back after the murder. | effect: Eliminates Dr. Mallory Finch as the only possible suspect since they are known to have been in a different location.
- Discriminating test method: trap
- Discriminating test design constraint: The discriminating test compares clock, study, and minut against the claimed timeline.
- Test must rely on already-shown clue IDs: clue_1, clue_2, clue_3, clue_fp_contradiction_step_1, clue_4
- Fair-play rationale: Step 1: The clock showing ten minutes past eleven and witness accounts (early) reveal the timeline discrepancy. Step 2: Eleanor's diary and the clock's time (mid) confirm the tampering. Step 3: The lack of fingerprints (discriminating test) identifies the tampering method.

## Character Reference

### Captain Ivor Hale (he/him — NEVER she/her)
Ivor speaks with a commanding presence, often employing a mixture of naval jargon and colloquial expressions
His sardonic humor emerges through wry observations, often aimed at the absurdities of civilian life.
Ivor is torn between his desire for vengeance and the realization that holding onto resentment may prevent him from moving forward. His bitterness is a double-edged sword that he struggles to wield.

### Beatrice Quill (she/her — NEVER he/him)
Beatrice speaks rapidly, often cutting to the chase without unnecessary embellishments
Her bluntness can be disarming, and she frequently employs sharp remarks that reflect her keen observations.
Beatrice struggles with the ethics of her ambition, torn between her desire for success and the moral implications of her actions as she navigates the complexities of the investigation.


## CHARACTER CONTRACTS (binding for this scene)
Each entry below constrains how this character must be written in this chapter.
These override generic style guidance when they conflict.

### Captain Ivor Hale[HE]
Voice & mannerisms: Ivor speaks with a commanding presence, often employing a mixture of naval jargon and colloquial expressions. His sardonic humor emerges through wry observations, often aimed at the absurdities of civilian life.
Sample voice fragments (match this register and rhythm):
  [comfortable] "Ah, the sea; it teaches a man his worth in ways the land never could."
  [evasive] "I’d rather not revisit those days; the past is a storm best left weathered."
Humour: sardonic — deploy occasionally (level 0.5)
FORBIDDEN phrase (never write for Captain Ivor Hale): "palpable tension filled the room"
Act 2 behaviour contract: May show unease, evasion, or mild defensiveness when questioned. One behavioural tell is permitted. Internal conflict emerging: "Ivor is torn between his desire for vengeance and the realization that holding onto resentment may prevent him from moving forward. His bitterness is a double-edged sword that he struggles to wield."

### Beatrice Quill[SHE]
Voice & mannerisms: Beatrice speaks rapidly, often cutting to the chase without unnecessary embellishments. Her bluntness can be disarming, and she frequently employs sharp remarks that reflect her keen observations.
Sample voice fragments (match this register and rhythm):
  [comfortable] "You see, the truth is always lurking just beneath the surface, waiting to be uncovered."
  [evasive] "It’s not that simple; the lines between right and wrong are often blurred in our line of work."
Humour: blunt — deploy frequently (level 0.7)
FORBIDDEN phrase (never write for Beatrice Quill): "she chose her words with great care"
Act 2 behaviour contract: May show unease, evasion, or mild defensiveness when questioned. One behavioural tell is permitted. Internal conflict emerging: "Beatrice struggles with the ethics of her ambition, torn between her desire for success and the moral implications of her actions as she navigates the complexities of the investigation."



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
A grand manor house nestled in the English countryside, surrounded by sprawling gardens and a labyrinth of hedgerows, where secrets linger in every shadow.

Key Locations Available:
- The Library (interior): Crime scene
- The Drawing Room (interior): Gathering space
- The Servants' Hall (interior): Staff gathering space
- The Cellar (interior): Storage and concealment

Atmosphere (tonal cue only — do NOT reproduce this phrase verbatim in prose; translate into scene-specific, character-observed sensory language): Tense, due to underlying class tensions and recent political shifts.
Weather: Overcast with occasional rain showers, typical for the English countryside in autumn.

Era markers: petrol touring cars on winding roads | early telephones in the drawing room | typewriters clacking in the study

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
  - Visual: leather-bound tomes on dark shelves, flickering gas lamp shadows, dust motes in the air
  - Sounds: crackling fire in the hearth, pages turning in the silence, distant clock ticking
  - Scents: old leather and dust, smoky wood from the fire, cold stone beneath the windows
  - Touch: worn leather armchair, smooth oak desk surface

The Drawing Room (interior):
  - Visual: opulent drapes in deep burgundy, gold-framed mirrors reflecting light, a grand piano in the corner
  - Sounds: soft laughter echoing, the rustle of silk dresses, the crackle of the fire
  - Scents: freshly polished wood, scent of expensive perfume, woodsmoke from the hearth
  - Touch: soft velvet cushions, cool marble fireplace surround

The Servants' Hall (interior):
  - Visual: worn wooden table, faded wallpaper peeling at the edges, dimly lit by a single gas lamp
  - Sounds: clatter of dishes, soft murmurs of conversation, crackling fire
  - Scents: cooked meats and vegetables, freshly baked bread, wood smoke from the fire
  - Touch: rough wooden benches, cool stone floor

⛔ REFERENCE DATA — DO NOT TRANSCRIBE VERBATIM: The above profiles are structural guides only. Generate original prose that evokes these qualities; do not reproduce the exact phrasing or sentence structure of the profile paragraphs.

SCENE OPENING RULE: When opening a scene in a new location, write what the POV character directly observes and physically senses at that moment — not a general description of the room's qualities. The reader must feel present, not briefed. Sensory details must be observed by the character, not stated as fact about the place.

SENSORY WRITING TECHNIQUES:
- Opening paragraphs: Lead with 2-3 sensory details to ground the scene
- Movement between locations: Note sensory changes (quiet study → noisy dining room)
- Emotional scenes: Use sensory details to reinforce mood (cold rain during argument)
- Period authenticity: Use period-specific sensory details from location/temporal profiles
- Avoid: Over-reliance on visual only; use so
[truncated for prompt budget]

## Texture Pool
Draw on these as opportunities arise — you are not required to use them.

- In August 1932, life in England is marked by the pervasive shadow of the Great Depression
- Overcast skies often cloak the countryside, reflecting the mood of the populace as economic hardship tightens its grip
- Social gatherings, once the hallmark of the upper class, now feel strained, filled with unspoken anxieties about wealth and future prospects
- The air is thick with humidity, carrying the earthy scent of damp grass and impending rain
- The divide between social classes grows ever more pronounced, with the working class grappling with poverty while the upper echelons cling to their traditions and legacies, often at great personal cost

TEMPORAL CONTEXT:

This story takes place in August 1932 during summer.

Seasonal Atmosphere:
- Weather patterns: overcast skies, occasional rain showers, humidity in the air
- Daylight: Long summer days, with daylight lingering until around eight-thirty in the evening.
- Seasonal activities: picnics in the countryside, garden parties, fishing in local rivers
- Seasonal occasions: Bank Holiday on the first Monday of August
- Season: summer

Period Fashion (describe naturally):
- Men formal: tailored three-piece suits with wide lapels, crisp white dress shirts, bow ties or narrow neckties
- Men casual: lightweight linen trousers, short-sleeve cotton shirts, tweed caps
- Men accessories: leather gloves, walking sticks, silver pocket watches
- Women formal: elegant tea dresses with floral patterns, cloche hats adorned with ribbons, pearl necklaces
- Women casual: light cotton blouses paired with high-waisted skirts, sundresses, cardigans
- Women accessories: silk scarves, canvas handbags, beaded clutch purses

Cultural Context (reference naturally):
- Music/entertainment: 'The Best Things in Life Are Free' by Buddy DeSylva, 'My Heart Stood Still' by Richard Rodgers, 'Ain't She Sweet' by Milton Ager; Films: 'Scarface' directed by Howard Hawks, 'The Front Page' directed by Lewis Milestone; Theatre: 'The Royal Family' by George S. Kaufman and Edna Ferber, 'The Front Page' by Ben Hecht and Charles MacArthur; Radio: 'The Shadow' radio program, 'Amos 'n' Andy' comedy series
- Typical prices: loaf of bread: 4 pence, a pint of milk: 1 penny, a taxi ride across town: 2 shillings
- Current events: debate over unemployment relief in Parliament; growing unrest in British cities due to economic hardship
- Literature: 'Murder in the Mews' by Agatha Christie | 'The Maltese Falcon' by Dashiell Hammett | 'The Glass Key' by Dashiell Hammett | [mystery] | [detective fiction] | [social realism]
- Technology: the first commercially available television in the UK | early electric refrigerators | advancements in radio technology | petrol-powered cars | typewriters in offices | early telephones in homes
- Daily life: afternoon tea in gardens, visiting local fairs, attending cricket matches
- Social rituals: Sunday family dinners, dance evenings at local halls

Atmospheric Details:
The air was thick with humidity, carrying the earthy scent of damp grass and impending rain. The distant rumble of thunder echoed like a warning as overcast skies loomed ominously above the country estate. The chatter from guests at afternoon teas mingled with the sound of a gramophone playing a popular tune, creating a juxtaposition of joy and tension.

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
- Class indicators: Aristo
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

• [clue_3] The clock's time is inconsistent with witness reports of Eleanor's last sighting.
  Category: temporal | Criticality: essential | Supports inference step 2
  Points to: The time shown on the clock contradicts what witnesses claim.

• [clue_8] Dr. Mallory Finch displayed unusual nervousness when questioned about the timeline.
  Category: behavioral | Criticality: supporting | Supports inference step 3
  Points to: His behavior raises suspicion.

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

CLUES ALREADY REVEALED TO READER: clue_1, clue_2, clue_core_contradiction_chain, clue_fp_contradiction_step_1, clue_mechanism_visibility_core — do not reveal these as new information.

INVESTIGATION LOG — WHAT IS ESTABLISHED (do not re-establish, do not repeat):
• Evidence in reader's hands: The clock in the study shows ten minutes past eleven when discovered. | Eleanor's diary records her last known movements matched with the clock's time. | The diary's records are inconsistent with the clock's showing, suggesting tampering. | The clock in the study shows ten minutes past eleven when discovered. | The clock in the study was intentionally wound back to create a false timeline of the murder.
• Suspects still unresolved: Captain Ivor Hale[HE]
⚠ The story must move FORWARD from this log. Any beat already listed above is forbidden from repeating.

⚠ THIS CHAPTER'S REQUIRED ADVANCE (first_turn): Examine physical evidence — find at least one new clue

CONTINUITY HANDOFF — previous chapter closing beat:
  • "As Beatrice continued her questioning, she felt the weight of the investigation pressing down on her. The clock showed ten minutes past eleven, but the implications of its tampering suggested a far more sinister reality. With each revelation, the stakes grew h..."
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
study, estate

✓ RULE: Continue using this location vocabulary. Maintain consistency with established setting type.
✓ Do NOT introduce new location types that contradict earlier chapters.

**Recent Chapter Summary (for narrative continuity):**
Chapter 1: Chapter 1: Discovery
  Events: Beatrice Quill stepped into the study of Eleanor Voss, the air heavy with an unshakeable tension that mirrored the overcast sky outside.
Chapter 2: Chapter 2: The Diary
  Events: The morning was overcast, the air thick with the promise of rain as Beatrice Quill leafed through the pages of Eleanor Voss's diary.
Chapter 3: Chapter 3: The Clock's Secret
  Events: The late morning sun struggled to break through the persistent clouds, casting a dim light across the study of Eleanor Voss.

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
Known location profile anchors: Little Middleton Manor, The Library, The Drawing Room, The Servants' Hall, The Cellar, the local pub
LOCATION NAME CAPITALISATION (HARD REQUIREMENT — validated):
All named locations in your prose MUST use the EXACT capitalisation from the CML profiles.
Canonical forms: "Little Middleton Manor", "The Library", "The Drawing Room", "The Servants' Hall", "The Cellar", "the local pub"
Writing a location in lowercase (e.g. "drawing room" instead of "Drawing Room") is a validated error. Every time you mention a named location, copy its capitalisation from the list above.
- Chapter 4: OPENING STYLE (HARD): Start the VERY FIRST SENTENCE with a noun-phrase atmosphere — e.g. "The smell of damp stone in the cellar…" / "A chill from the landing…" / "The sound of the clock in the hall…". Pattern: "The/A [noun] of/in/from [place]…". Anchor opening in "the local pub". HARD REQUIREMENT for the first 2 paragraphs: (a) include 2+ sensory words — choose from smell/scent/sound/echo/silence/creak/whisper/cold/warm/damp/rough/smooth/glow/shadow/flicker/dim — and (b) include 1+ atmosphere/time word — choose from rain/wind/fog/storm/mist/thunder/evening/morning/night/dawn/dusk/season/afternoon/midday/noon/midnight/twilight/sunrise/sunset/daylight/sunlight/overcast/cloudy/bright/dark. These are validated requirements, not style suggestions; missing them triggers a retry.

[⚠ INTERNAL QUALITY DIAGNOSTICS — DO NOT REPRODUCE ANY PART OF THIS SECTION IN YOUR STORY OUTPUT. These are private generator observations for your consideration only. Your narrative must read as if this section does not exist. Never include phrases from this block in character dialogue, narration, or description.]

PRIOR CHAPTER QUALITY OBSERVATIONS:
- Chapter 2 (score 93/100):
  Quality gaps noted: word density below preferred target (845/1000); scene grounding weakness
  Address in upcoming chapters: Increase chapter density with concrete investigation action and sensory-grounded beats; avoid recap-only padding. | Open next chapter with a named location anchor plus at least two sensory cues and one atmosphere marker.
- Chapter 3 (score 96/100):
  Quality gaps noted: word density below preferred target (928/1000); scene grounding weakness
  Address in upcoming chapters: Increase chapter density with concrete investigation action and sensory-grounded beats; avoid recap-only padding. | Open next chapter with a named location anchor plus at least two sensory cues and one atmosphere marker.
[END INTERNAL DIAGNOSTICS]

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
   WRONG: \"I have no alibi,\" Voss said. He turned away. (if Voss is femal
[truncated for prompt budget]

PROMPT BUDGET SUMMARY: budget=32000 tokens; fixed=9107; context=10072; dropped=[none]; truncated=[location_profiles, temporal_context, pronoun_accuracy]

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
4. Integrate at least two concrete era-grounded details per chapter from setting refinement signals: petrol touring cars on county roads | early telephones in homes | typewriters standard in offices | party-line telephone exchanges | telegram services via nearest town | airmail for urgent correspondence.
5. Respect setting movement/access constraints in scene action and alibis: large grounds with hedgerows limiting visibility | multiple locked rooms restricting access | weather conditions affecting outdoor movement | restricted areas including private offices and cellar | daily schedules dictating staff movements.
6. Sustain social coherence with this backdrop pressure: A family gathering for a will reading amidst the Great Depression exposes class tensions and political anxieties, drawing together heirs, staff, and guests under one roof with secrets to protect.
7. Maintain continuity around these socially central cast anchors where relevant: Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill.
8. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Critical: Plot similarity 0.80 with 'The Mysterious Affair at Styles' (same crime type and method)
9. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Moderate: Character similarity 0.75 with 'The Sign of the Four' (similar cast structure and dynamics)
10. RETRY MITIGATION: Strict obligation mode is active. Every required clue must be surfaced with concrete, observable prose before any deduction beat.
11. RETRY MITIGATION: Prioritize chronology and identity coherence over stylistic variation for this retry.
12. STORY TO DATE ANTI-COPY RULE: The STORY TO DATE section below is provided for chronological and factual reference ONLY. You MUST NOT copy, lightly rephrase, or structurally echo any sentence or paragraph from prior chapters. Every sentence in this chapter must be original prose unique to this scene. Reusing even a clause from prior chapter text will cause this attempt to fail immediately.

CRITICAL PROSE REQUIREMENTS:

The CML specifies exact requirements for certain validation-critical scenes. You MUST include these elements at the specified positions.

**Discriminating Test Scene (Act 3, Scene 4):**
Required elements: Execute the discriminating test, Observe the clock's mechanism for tampering, Draw conclusion about the timeline
Test type: trap

**Suspect Clearance Scenes:**
- Captain Ivor Hale (Act 3, Scene 5): Lack of access to the clock
  Clues: No fingerprints on the clock, Witness account of location

**Culprit Revelation Scene (Act 3, Scene 6):**
Method: Confrontation with evidence

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
  - Scene is set in: the local pub — reference it naturally within the paragraph, never as your opening phrase.
  - Opening atmosphere (MANDATORY — validator enforced): the first paragraph MUST contain at least one of: rain / wind / fog / storm / mist / thunder / evening / morning / night / dawn / dusk / season / afternoon / midday / noon / midnight / twilight / sunrise / sunset / daylight / sunlight / overcast / cloudy / bright / dark / grey / pale / cold / warm / chill / crisp / damp / drizzle / haze / lamplight / firelight. A chapter that omits all of these from its opening paragraph will be rejected.
  - Continuity bridge: in the first 120 words, visibly connect from the previous chapter's final beat. Carry forward one unresolved element (object, accusation, emotional pressure, or immediate physical action) from: "As Beatrice continued her questioning, she felt the weight of the investigation pressing down on her. The clock showed ten minutes past eleven, but the implications of its tampering suggested a far more sinister reality....".
  - CLUE OBLIGATIONS — mandatory prose elements (do NOT omit or bury):
    • The clock's time is inconsistent with witness reports of Eleanor's last sighting. [clue_3]
      Points to: The time shown on the clock contradicts what witnesses claim.
    • Dr. Mallory Finch displayed unusual nervousness when questioned about the timeline. [clue_8]
      Points to: His behavior raises suspicion.
  - Tonal contrast: include at least one beat of relief or ironic counterpoint. Do not sustain maximum tension for every paragraph.
  - ALIBI LOCK: Dr. Mallory Finch's established alibi is "11:00-11:30". Do NOT place Dr. Mallory Finch at any other location or in any other activity during the crime window. Any contradiction is a continuity error that triggers a retry.
  - TESTIMONY CONTINUITY: Dr. Mallory Finch has already made statements in earlier chapters. Any time, location, or claim attributed to Dr. Mallory Finch in THIS chapter must be consistent with those earlier statements. Do NOT introduce a new or different alibi claim — any contradiction is a continuity error.

- Tonal contrast required: the previous chapter was high-tension. Ivor Hale may use sardonic to provide a brief moment of relief before tension resumes.
- Locked fact phrase obligations:
  - If this batch mentions The exact time shown on the stopped clock face, write exactly: "ten minutes past eleven".
  - If this batch mentions The exact amount the clock was wound back, write exactly: "forty minutes".
- Seasonal vocabulary allow-list: summer, summery, midsummer.
- Forbidden seasonal words: spring, autumn, winter.

⛔ PRONOUN TABLE — re-check after EVERY paragraph before writing the next:
    Eleanor Voss: she/her/her
    Dr. Mallory Finch: she/her/her
    Captain Ivor Hale: he/him/his
    Beatrice Quill: she/her/her
  Any sentence containing a pronoun must agree with this table. Correct mismatches before moving on.

FROZEN FACT STATE (DO NOT ALTER):
- Timeline anchor: August (summer).
- Month, season, weather, and time-of-year language in this batch must stay compatible with summer.
- Established timeline fact: 11:10 AM - Time of discovery
- Established timeline fact: 11:00 AM - Last seen alive
- If referenced, use exact phrase: "ten minutes past eleven" (The exact time shown on the stopped clock face).
- If referenced, use exact phrase: "forty minutes" (The exact amount the clock was wound back).

STORY TO DATE (REFERENCE ONLY — DO NOT COPY VERBATIM):
- Full prior chapter text is provided below for continuity, factual consistency, and reference accuracy.
- Use this to keep character voice, chronology, clue state, and location continuity aligned with earlier chapters.
- Do not quote, copy, or paraphrase these paragraphs too closely; write fresh prose that remains consistent with them.

--- BEGIN PRIOR CHAPTER 1 ---
Title: Chapter 1: Discovery
Beatrice Quill stepped into the study of Eleanor Voss, the air heavy with an unshakeable tension that mirrored the overcast sky outside. The distant rumble of thunder echoed ominously, a reminder of the storm brewing both in the heavens and within the hearts of those gathered. She could feel the dampness in the air, a chill that seemed to seep into her bones as she crossed the threshold, her eyes immediately drawn to the clock on the mantelpiece. It showed ten minutes past eleven, its hands frozen in time, a stark marker of the tragedy that had unfolded.

As Beatrice approached the clock, she noted the stillness of the room, punctuated only by the soft weeping of Eleanor's mother, who stood in the doorway, tears streaming down her face. The sight of the clock, with its unwavering hands, sent a shiver down Beatrice's spine. It was a grim reminder that Eleanor Voss had been found lifeless in her own study, and the clock's time would soon become a critical element in the investigation. The implication was clear; Eleanor could not have died later than ten minutes past eleven, a fact that would contradict the alibis of several suspects, each of whom had access to the room.

Eleanor's mother, Mrs. Voss, finally broke the oppressive silence, her voice trembling as she spoke. 'She had so many enemies, you know. It’s a wonder it didn’t happen sooner.' Beatrice's heart sank at the mention of enemies; it was an unsettling revelation that added layers of complexity to the case. The grief-stricken woman’s words lingered in the air, a dark cloud hovering over the gathering. Beatrice turned her attention back to the room, her mind racing with possibilities. Who would want to harm Eleanor? And why?

The study was a reflection of Eleanor's life — elegant yet suffocating, filled with leather-bound books that whispered secrets of the past. The flickering gas lamp cast shadows that danced along the walls, creating an atmosphere ripe for revelation. Beatrice's eyes scanned the room, taking in every detail, from the scattered papers on the desk to the faint scent of lavender that lingered in the air. It was a stark contrast to the tragedy that had unfolded here. She needed to piece together the fragments of this puzzle before the storm outside mirrored the chaos within.

As she began her examination, Beatrice felt the weight of responsibility settle upon her shoulders. She was not just an observer; she was the investigator in charge. The clock's time, ten minutes past eleven, would serve as a crucial anchor in her inquiry. The evidence was compelling, yet the emotions swirling in the room threatened to cloud her judgment. She had to remain focused, to sift through the grief and confusion to uncover the truth that lay hidden beneath the surface.

Eleanor's lifeless body lay draped across the plush velvet chair, a haunting image that would remain etched in Beatrice's mind. The sight was both tragic and sobering, a reminder of the fragility of life. Beatrice approached the chair, her heart heavy with the weight of the moment. The clock ticked away in the background, a relentless reminder of the time that had passed since Eleanor's last breath. Beatrice noted the position of Eleanor's hands, the delicate fingers frozen in a final gesture, as if reaching for something just beyond her grasp.

With each passing moment, Beatrice felt the urgency of the situation pressing down on her. She needed to establish a timeline, to understand the events leading up to Eleanor's death. The clock had stopped at ten minutes past eleven, but what did that truly mean? She recalled the last sighting of Eleanor, a mere half-hour before the clock's time, and the implications began to unfold. If Eleanor had been alive at eleven, then the window for her death was painfully narrow, and the suspects' alibis would need to be scrutinized closely.

As she gathered her thoughts, Beatrice could sense the eyes of the family upon her, their expressions a mixture of hope and despair. They were looking to her for answers, for resolution in the face of tragedy. With a deep breath, she steeled herself for the task ahead. The investigation had begun, and she was determined to uncover the truth, no matter where it led her. The clock's deceit would not go unchallenged.
--- END PRIOR CHAPTER 1 ---

--- BEGIN PRIOR CHAPTER 2 ---
Title: Chapter 2: The Diary
The morning was overcast, the air thick with the promise of rain as Beatrice Quill leafed through the pages of Eleanor Voss's diary. The soft rustle of paper broke the silence in the study of Eleanor Voss, where shadows played along the walls, cast by the flickering gas lamp. Beatrice's heart raced as she approached the desk, the scent of old leather and ink mingling with the faint aroma of lavender that lingered in the air. The diary lay open to the last entry — detailing her plans for the day — and Beatrice felt a chill run down her spine as she read the familiar handwriting.

Eleanor's neat script detailed a series of meetings and appointments, each line a reminder of the life she had planned for that day. 'At eleven, I shall meet with Dr. Finch to discuss the estate matters,' the entry read. The clock on the mantelpiece, its hands frozen at ten minutes past eleven, loomed large in Beatrice's mind, casting doubt on the timeline Eleanor had set forth. If Eleanor had indeed been alive at this hour, then the implications were dire. The last known movements of Eleanor, matched with the clock's time, painted a troubling picture that demanded further investigation.

As Beatrice continued to read, she could feel the weight of the room pressing down on her. The entries hinted at tensions and unresolved issues, but they also raised more questions than they answered. Why had Eleanor felt the need to meet with the doctor Finch? What had transpired in those final moments? The diary was a treasure trove of information, yet it felt like a labyrinth, each turn leading to more uncertainty. Beatrice glanced up, her gaze meeting the doctor Finch's, who stood by the door, her expression a mix of concern and apprehension.

'What do you think, Dr. Finch?' Beatrice asked, her voice steady despite the turmoil inside her. 'This entry suggests Eleanor had plans, yet she never had the chance to fulfill them.'

the doctor Finch stepped into the room, her posture rigid, as if bracing against an unseen force. 'Eleanor was always a planner,' she replied, her voice measured yet tinged with an undercurrent of anxiety. 'She had a way of organizing her life, but... sometimes, plans change unexpectedly.' A flicker of something crossed her face — was it guilt? Beatrice couldn't be sure, but the moment hung heavy in the air.

'Do you recall anything unusual about your meeting with her?' Beatrice pressed, her instincts as an investigator urging her to dig deeper. 'Anything that might have indicated she was in danger?'

Dr. Finch hesitated, her eyes darting toward the diary as if it held the answers to questions she feared to confront. 'No, nothing that stands out. We discussed the estate, and she seemed... well, as she always was. But I sensed a tension, a worry that I couldn't quite place.'

Beatrice noted the way Dr. Finch's hands fidgeted, her fingers twisting the fabric of her blouse. The doctor was hiding something, and Beatrice was determined to uncover it. 'You mentioned a tension. What was it about? Was it related to the estate or something more personal?'

'Eleanor had many concerns, especially with the family dynamics,' Dr. Finch replied, her voice faltering slightly. 'There were whispers about her inheritance and how it might affect her relationships. But I didn't think... I mean, she was strong-willed. I never imagined she would be in any real danger.'

The conversation felt like a delicate dance, each step revealing more about Eleanor's world while obscuring the truth. Beatrice's mind raced as she pieced together the fragments of their discussion. The clock's time, the diary's entries, and Dr. Finch's evasiveness all pointed to a tangled web of emotions and motives. There was something more at play, and she needed to unravel it before the storm outside mirrored the chaos within.

'Dr. Finch, I need you to be completely honest with me,' Beatrice said, her tone firm yet compassionate. 'If there is anything you know, anything at all, it could help clarify the timeline of Eleanor's last moments.'

Dr. Finch took a deep breath, her gaze dropping to the floor as if searching for the right words. 'I wish I could say more, but I truly don't know. I felt a sense of dread when I left her that morning, but I dismissed it as my own anxieties.'

The tension in the room was palpable, and Beatrice could sense the weight of unspoken truths hanging in the air. She needed to dig deeper, to unearth the layers of secrecy that surrounded Eleanor's life. 'I understand, but we must find a way to piece this together. Eleanor's last known movements are crucial, and your insights could be key to uncovering the truth.'

As Beatrice closed the diary, she felt a surge of determination. The investigation was just beginning, and she would not rest until she had uncovered the secrets hidden within these pages. The clock's deceit would not go unchallenged, and she was prepared to confront whatever shadows lay ahead.
--- END PRIOR CHAPTER 2 ---

--- BEGIN PRIOR CHAPTER 3 ---
Title: Chapter 3: The Clock's Secret
The late morning sun struggled to break through the persistent clouds, casting a dim light across the study of Eleanor Voss. Beatrice Quill stood resolutely at the desk, her fingers brushing against the pages of Eleanor's diary, the scent of aged paper mingling with the lingering fragrance of lavender. The clock on the mantelpiece, its hands frozen at ten minutes past eleven, loomed large in her mind. The entries in the diary detailed Eleanor's day, but a sense of foreboding settled over Beatrice as she noted the discrepancies between the recorded plans and the time displayed on the clock. There was something unsettling about the way the two pieces of evidence clashed, as if they were engaged in a silent argument over the truth of Eleanor's final moments.

As Beatrice flipped through the diary, her heart raced with the implications of what she was uncovering. The entries were meticulous, chronicling Eleanor's appointments and thoughts, yet they painted a picture that could not align with the clock's time. If Eleanor had indeed been alive at eleven, as the diary suggested, then the time of her death must be reconsidered. This inconsistency hinted at a deeper deception, one that could involve those closest to her. Beatrice's mind raced as she recalled the doctor Finch's earlier statements. The doctor had been present just before the tragedy, and if Eleanor's plans had been interrupted, the stakes of the investigation had just risen dramatically.

With a determined breath, Beatrice turned to Dr. Finch, who stood by the door, her expression unreadable. 'Dr. Finch, the diary's records are inconsistent with the clock's showing, suggesting tampering. What do you make of that?' The words hung in the air, heavy with accusation. Beatrice watched as the doctor's composure faltered for just a moment, a flicker of uncertainty crossing her features. It was a crack in the facade that Beatrice was eager to exploit. 'This could mean someone wanted to mislead the investigation, to alter the timeline of events surrounding Eleanor's death.'

Dr. Finch straightened her posture, a defensive gesture that only fueled Beatrice's suspicions. 'Tampering? Surely you're not implying that I—' she began, but Beatrice cut her off. 'I am not accusing you, but we must consider all possibilities. The clock shows ten minutes past eleven when discovered, yet Eleanor was last seen alive at eleven. That leaves a narrow window for her death, and if the clock has been manipulated, we need to know who had access to it.' The tension in the room thickened, each word a step deeper into the labyrinth of deceit that surrounded Eleanor's demise.

Beatrice's gaze shifted back to the clock, its hands a stark reminder of the tragedy that had unfolded. 'The clock in the study was intentionally wound back to create a false timeline of the murder,' she stated, her voice steady as she sought to maintain control over the situation. 'This indicates a deliberate act to mislead the investigation. We cannot ignore the implications of this.' She could see Dr. Finch's resolve wavering, the weight of the accusation pressing down upon her. The doctor opened her mouth to respond, but no words came forth, leaving a silence that felt charged with unspoken truths.

As the moments stretched, Beatrice felt a flicker of relief amid the tension. The uncertainty was palpable, but she was no longer navigating this investigation alone. Dr. Finch's hesitation suggested that there was more to uncover, and Beatrice was determined to peel back the layers of secrecy. 'If there is something you know, Dr. Finch, now is the time to share it. We need to piece together Eleanor's last moments, and your insights could be crucial.' The doctor's eyes darted to the diary, then back to Beatrice, a storm of emotions swirling within her.

'I... I can’t say for certain,' Dr. Finch finally admitted, her voice barely above a whisper. 'Eleanor had her worries, yes, but I never imagined they would lead to something like this.' Beatrice noted the doctor's unease, the way her fingers trembled slightly as she clasped them together. It was a sign of stress, perhaps guilt. 'What were her worries? Was it related to the estate, or something more personal?' Beatrice pressed, her investigative instincts urging her to dig deeper. The clock continued to tick away in the background, a relentless reminder of the time that had slipped away since Eleanor's last breath.

Dr. Finch hesitated, her gaze dropping to the floor as if searching for the right words. 'There were whispers about her inheritance, about how it might affect her relationships. But I didn’t think... I mean, she was strong-willed. I never imagined she would be in any real danger.' Beatrice could sense the layers of tension in the room, the unspoken fears and anxieties that lingered just beneath the surface. The investigation was taking on a new urgency, and she needed to unravel the threads before they slipped through her fingers. 'We must find a way to clarify this,' Beatrice urged, her voice firm yet compassionate. 'Eleanor's last known movements are crucial, and your insights could help us uncover the truth.'

As Beatrice continued her questioning, she felt the weight of the investigation pressing down on her. The clock showed ten minutes past eleven, but the implications of its tampering suggested a far more sinister reality. With each revelation, the stakes grew higher, and Beatrice knew that the answers lay hidden within the tangled web of Eleanor's life. The truth was out there, waiting to be uncovered, and she was determined to find it, no matter the cost.
--- END PRIOR CHAPTER 3 ---

[SCENE COMPLETENESS CONTRACTS — MANDATORY. Each contract below lists what you MUST enact in that chapter. Do not summarise or mention these labels in the prose — enact them organically.]
Chapter 4 (Act 2) completeness contract:
  PIVOT ELEMENT (MANDATORY — write this into the prose, shown not told): "Hale's drink, untouched since he arrived"
  FACT ESTABLISHED (MANDATORY — reader must know this by chapter end): "Establishes that Captain Hale claims to have been at the pub during the murder window."
  RED HERRING (MANDATORY — seed naturally, not flagged as false): [rh_2] Hale mentions the pub's reputation for being a gathering place for gossip — seeds false impression about town rumors.

# Case Overview
Title: The Clock's Deceit
Era: 1930s
Setting: Little Middleton
Crime: murder (clock tampering)
Culprit: Dr. Mallory Finch
False assumption: Eleanor must have been killed shortly before she was found, based on the time shown on the clock.
Cast: Eleanor Voss (she/her), Dr. Mallory Finch (she/her), Captain Ivor Hale (he/him), Beatrice Quill (she/her)

Setting Lock: Keep all scenes and descriptions consistent with the stated setting (Little Middleton). Do not introduce a different location type. Do not invent an alternative estate name. The only permitted name for this property is "Little Middleton" — any other estate name (e.g., "Caldwell Manor", "Ashwood Hall", or any invented proper name) is a continuity error that will be caught and rejected.

⛔ PRONOUN LOCK (verify every sentence before writing):
• Eleanor Voss — she/her/her (NEVER he/him)
• Dr. Mallory Finch — she/her/her (NEVER he/him)
• Captain Ivor Hale — he/him/his (NEVER she/her)
• Beatrice Quill — she/her/her (NEVER he/him)

Outline scenes:
[
  {
    "sceneNumber": 4,
    "act": 2,
    "title": "Captain Hale's Alibi",
    "setting": {
      "location": "the local pub",
      "timeOfDay": "Early afternoon",
      "atmosphere": "Casual but tense"
    },
    "characters": [
      "Beatrice Quill",
      "Captain Ivor Hale"
    ],
    "purpose": "Interview Captain Hale about his alibi",
    "cluesRevealed": [
      "clue_3",
      "clue_8"
    ],
    "dramaticElements": {
      "conflict": "Hale's confidence clashes with Quill's suspicions",
      "tension": "Uncertainty about Hale's whereabouts"
    },
    "summary": "In the local pub, Beatrice Quill questions the captain Hale about his whereabouts during the time of the murder. Hale confidently asserts his alibi, but Quill senses something off about his demeanor.",
    "estimatedWordCount": 1800,
    "pivotElement": "Hale's drink, untouched since he arrived",
    "factEstablished": "Establishes that Captain Hale claims to have been at the pub during the murder window.",
    "permittedBehavioursByAct": [
      {
        "characterName": "Beatrice Quill",
        "behaviour": "May show unease, evasion, or mild defensiveness when questioned."
      },
      {
        "characterName": "Captain Ivor Hale",
        "behaviour": "May show unease, evasion, or mild defensiveness when questioned."
      }
    ],
    "redHerringPlacement": {
      "redHerringId": "rh_2",
      "placementDetail": "Hale mentions the pub's reputation for being a gathering place for gossip — seeds false impression about town rumors."
    },
    "emotionalRegister": "A pivotal clue alters the course of the investigation, shifting suspicions and raising stakes.",
    "dominantCharacterNote": {
      "name": "Captain Ivor Hale",
      "voiceRegister": "Ivor's voice carries a commanding presence, often tinged with sardonic humor."
    },
    "humourGuidance": {
      "permission": "permitted",
      "character": "Dr. Mallory Finch",
      "form": "dry_wit"
    },
    "eraTextureNote": "Limited transportation due to fuel shortages; Slow communication methods hampered by economic stress; Restricted access to resources amid rationing",
    "locationRegisterNote": ""
  }
]
```

## Message 3 (role=user)

```text
BEFORE SUBMITTING YOUR JSON — verify this checklist:
□ Each chapter reaches the hard floor of 450 words and aims for 1250 words or more.
□ If you mention locked evidence, you used the exact locked phrase verbatim.
□ Allowed seasonal words only: summer, summery, midsummer.
□ Forbidden seasonal words: spring, autumn, winter.
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

## Message 4 (role=user)

```text
Attempt 4/6 — chapters 4 — 1 validation issue(s) to resolve:

═══ PROSE QUALITY ERRORS (1) ═══
• Chapter 4 marked non-convergent after attempt 3/6: continuity

✓ SOLUTION: Vary paragraph lengths (short, medium, long)
✓ Include sensory details and atmospheric description
✓ Ensure each chapter has substance (3+ paragraphs minimum)

Return corrected JSON for chapters 4. Edit only the sections that failed — keep all content that passed validation, and return the complete updated chapter JSON.


RETRY CLASS: continuity
ATTEMPT: 3/6
MANDATORY FIXES:
- Resolve continuity issues before accepting this batch.
- Chapter 4: Pronoun drift — 13 pronoun corrections were required, indicating systematic gender confusion. Review the ⛔ ABSOLUTE PRONOUN LOCK above. For male character Captain Ivor Hale: use he/him/his in every sentence. When Hale and a female character appear in the same sentence, name them explicitly rather than relying on a pronoun.
MITIGATION MODE: tighten_obligation
```
