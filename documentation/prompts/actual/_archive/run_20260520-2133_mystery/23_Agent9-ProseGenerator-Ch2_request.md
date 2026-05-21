# Actual Prompt Record

- Run ID: `mystery-1779312810693`
- Project ID: ``
- Timestamp: `2026-05-20T21:39:03.835Z`
- Agent: `Agent9-ProseGenerator-Ch2`
- Operation: `chat_request_full_prompt`
- Model: `GPT-4o-mini`
- Temperature: `0.42`
- Max Tokens: `4500`
- Attempt: `first`
- Prompt Hash: `04f1d8563e518fdb`

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
- MORAL COMPLEXITY REQUIREMENT: The mechanism of this crime carries a moral gray area: "The murderer acted out of a misguided sense of justice for a past wrong, eliciting sympathy despite the crime." — the culprit reveal and denouement MUST acknowledge this ambiguity. Do not let the ending feel clean or simple. Give the reader at least one moment of uncomfortable sympathy or moral doubt.


⚠️ AMATEUR DETECTIVE STORY: The investigator is a civilian with no official standing. The official police (if they appear) are unnamed background figures only — "a constable", "the sergeant", "an officer from the village". Do NOT give any police official a name or title+surname combination. There is no Inspector [Surname], no Constable [Surname], no Sergeant [Surname] in this story.


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

## Era: 1931 November
Living in November 1931 means navigating the oppressive atmosphere of the Great Depression, where the weight of financial instability looms over every interaction. The wealthy host extravagant gatherings, yet whispers of economic hardship echo in the corners, as many struggle to make ends meet. The air is thick with tension, as class divisions grow starker and societal roles are challenged. Women increasingly assert their independence, while men grapple with traditional expectations. The streets are filled with the sounds of distant protests, a reminder of the unrest brewing beneath the surface. This period is marked by a palpable sense of uncertainty, as individuals confront their ambitions against the backdrop of a society in turmoil.
Emotional register: The dominant emotional state is one of anxiety and foreboding, as individuals face the uncertainties of their futures.
Physical constraints: Short daylight hours lead to early darkness and limited visibility. | Overcast weather frequently hampers outdoor activities. | Economic strain limits travel and leisure, confining social interactions to local gatherings.
Current tensions (weave into background texture): The Great Depression continues to impact unemployment rates. | Political tension rises in Europe as fascism gains influence. | The British government debates further aid for farmers affected by economic hardship.
Wartime context — Men returning from wartime service are struggling to reintegrate into a society that is rapidly changing.: There is a growing divide between those who served and those who did not, leading to tensions regarding honor and reputation. Absence effect: Absent family members create a void that exacerbates feelings of loss and discontent.

## Season Lock (mandatory — derived from 1931 November)
Season: autumn. Allowed vocabulary: autumn, autumnal, fall
Forbidden seasonal words — never use in narration, dialogue, or metaphor: spring, summer, winter and their adjectival forms.
Every weather description, atmosphere, and time-of-year reference must be consistent with autumn.

## Story Theme
The interplay of social class, ambition, and deception culminates in a murder that unravels the fragile facades of an aristocratic household during the Great Depression.

## Story Emotional Register
Dominant: The emotional journey of the story is one of heightened tension and profound revelation.

Arc:
As the story opens, Voss Manor stands as a majestic yet foreboding presence, shrouded in overcast skies and whispers of financial ruin. The murder of Dr. Mallory Finch casts a dark pall over the estate, where the ticking of the clock echoes ominously, a reminder of the secrets hidden within its walls. As the investigation unfolds, initial clues spark rising unease among the guests, revealing hidden resentments and ambitions.

Eleanor Voss's façade of the dutiful daughter begins to crack under the pressure of financial stress, and the stakes grow higher as each character grapples with their own motives. A pivotal moment occurs when a note found near the clock reveals premeditation, altering the trajectory of the investigation and deepening the emotional stakes for Eleanor. As tensions mount, the characters confront their fears and desires, leading to a climactic confrontation in which the truth about the clock's tampering is revealed. In the end, each character faces the emotional fallout of their actions: Eleanor's guilt and anxiety threaten to consume her, while Ivor struggles to regain his honor, and Beatrice's ambition is left in ruins. The resolution carries a bittersweet weight, as the characters are forced to reckon with the consequences of their choices and the fragility of their social standing.

## Emotional register at this point in the story
The initial atmosphere is one of grandeur tinged with impending doom.

## Character Portraits (appearance & era)

### Eleanor Voss
Eleanor Voss embodies the struggles of the upper class during the Great Depression, balancing her public image as a charitable figure with the weight of her family's financial troubles. Her estate, once a symbol of stability, now stands on the brink of ruin, mirroring the anxiety of a society grappling with economic decline. Eleanor's desperation to maintain her family's legacy reflects the larger societal pressures faced by many during this tumultuous time.
Era intersection: Eleanor's financial stress and the threat to her social status are emblematic of the class tensions and economic struggles prevalent in 1931.

### Captain Ivor Hale
Captain Ivor Hale navigates the complexities of honor and respectability in a society rocked by economic hardship. His past as a military officer clashes with his current struggles with gambling debts, highlighting the personal conflicts many face during the Great Depression. Ivor's desire to restore his reputation mirrors the broader societal need to maintain appearances amidst financial ruin.
Era intersection: Ivor's gambling debts underscore the moral dilemmas and pressures faced by individuals in a society where financial stability is increasingly precarious.

### Beatrice Quill
Beatrice Quill, an ambitious young journalist, reflects the rising aspirations of women during the 1930s. However, her desperation leads her to deceit, exposing the darker side of ambition in a time of widespread hardship. Beatrice's drive to succeed at any cost speaks to the societal pressures on women to carve out their place in a male-dominated field, even if it means resorting to unethical means.
Era intersection: Her secretive actions embody the lengths to which individuals will go to secure their futures during an era of economic uncertainty.

## Character Voices

### Eleanor Voss (she/her/her)
Eleanor's voice is elegant and poised, often layered with genteel sarcasm that reflects her sharp wit.
[comfortable] It's simply delightful to host you all here; nothing like a gathering to lift the spirits!
[evasive] Oh, I couldn't possibly comment on that right now; let's focus on the lovely weather instead.
[stressed] I assure you, everything is under control, though I may need to revisit my financial strategies.
Humour: Her polite savagery often disarms those around her, making her both charming and formidable.

### Captain Ivor Hale (he/him/his)
Captain Hale's voice carries a commanding presence, often punctuated with self-deprecating humor that reveals his awareness of flaws.
[comfortable] Ah, the camaraderie of good friends; it's what keeps us grounded in these trying times.
[evasive] Let's not dwell on past mistakes; the future is what matters, wouldn't you agree?
[stressed] I assure you, I am not the man I once was, but I strive to rise above my circumstances.
Humour: His self-deprecating humor softens the edges of his troubled past, making him relatable.

### Beatrice Quill (she/her/her)
Beatrice's voice is lively and animated, often rushing to convey her excitement, laced with sardonic humor.
[comfortable] The thrill of the chase is what makes journalism so exhilarating!
[evasive] Oh, I wouldn't worry too much about that; it seems trivial in the grand scheme.
[stressed] If only the truth were as easy to uncover as the latest gossip!
Humour: Her sardonic humor often deflects from her insecurities, showcasing her ambition.

## Location Registers (scene framing guides)

The Drawing Room: The drawing room feels heavy with secrets and tension, a space where laughter echoes but is underpinned by unspoken fear. It serves as both a gathering place and a crucible for hidden motives, where guests are drawn together yet remain distanced by their private struggles.. Camera angle: Entering this space should evoke a sense of caution, as the room's beauty belies the turmoil hidden within.. Era: In this era, the drawing room serves as a stage for societal performance, where appearance often outweighs truth.

The Library: The library exudes an atmosphere of quiet contemplation, yet the thick air is imbued with the weight of unspoken history. Here, knowledge intertwines with secrets, as the past whispers through the dusty volumes, inviting those who seek the truth but warning of the dangers that lie ahead.. Camera angle: Writers should approach this space with a sense of reverence, aware that the truths hidden within the books could change everything.. Era: The library stands as a testament to the value placed on knowledge and education during this period, despite the chaos outside.

The Gardens: The gardens, once vibrant and lush, now carry an air of neglect and sorrow. Overgrown hedges and twisting vines symbolize the decay of relationships and the weight of unresolved tensions. The solitary stone bench beneath the oak tree serves as a poignant reminder of lost moments, where the past lingers in the shadows.. Camera angle: A writer entering this space should feel the weight of history, aware that the beauty belies a deeper narrative of grief and loss.. Era: In this season, the gardens reflect the looming chill of winter, mirroring the emotional coldness of the characters' interactions.

The Study: The study is a sanctuary of thought, but it also holds the tension of decisions yet to be made. The scent of polished wood and old paper is comforting, yet it carries an undercurrent of urgency as the characters grapple with their choices. This room embodies the struggle between intellect and morality, where secrets can be both discovered and concealed.. Camera angle: Writers should approach this space with a sense of introspection, as it is here that pivotal decisions are made.. Era: In the 1930s, the study serves as a place for reflection amidst the chaos of the outside world, a refuge for those seeking clarity.

## Humour guidance for this story position (opening)
Permission: forbidden
Rationale: The tone is serious and sets the stage for the unfolding mystery.

FAIR-PLAY AND INFERENCE CONTRACT:
- FAIR PLAY CLUE TIMING: Never combine clue discovery and detective deduction in the same chapter. If a clue is first revealed to the reader in chapter N, the detective may only analyze, deduce from, or act on that clue in chapter N+1 or later.
- FAIR PLAY INFORMATION PARITY: The reader must see all clues BEFORE the detective uses them in reasoning. If the detective performs a test or makes a deduction, every piece of evidence supporting that conclusion must have been shown to the reader in earlier chapters.
- FAIR PLAY REVELATION SPACING: In the discriminating test scene, the detective can ONLY use clues that were revealed to the reader at least 1 full chapter earlier. Never introduce new clues or withheld information during the test.
- FAIR PLAY CONFRONTATION: During the final confrontation/revelation, the detective cannot surprise the reader with facts. Every piece of evidence cited must have been visible to the reader in prior chapters.
- Never solve by withheld information. Keep reader-information parity with detective reasoning.
- False assumption in force: Dr. Mallory Finch was murdered shortly after Eleanor Voss left the drawing room.
- Hidden truth to progressively expose: The clock's tampering that alters the timeline of events.
- Inference path checkpoints to dramatize clearly (observation -> correction -> effect):
  - Step 1: obs: The clock in the drawing room is stopped at ten minutes past eleven. | corr: The clock's stoppage indicates tampering that may align with the murder. | effect: Narrows the investigation to Eleanor Voss, who had access to the clock.
  - Step 2: obs: Guests report hearing a loud crash around the time of death, but the clock does not match their accounts. | corr: The inconsistent timing of the clock and the crash suggests the clock was tampered with to mislead. | effect: Narrows the suspect pool, implicating Eleanor Voss for her potential motive.
  - Step 3: obs: A note found near the clock references a specific time, contradicting Eleanor's alibi. | corr: The note suggests premeditation and an intent to mislead regarding the timeline. | effect: Eliminates the possibility of Eleanor's innocence.
- Discriminating test method: trap
- Discriminating test design constraint: A controlled reenactment of the murder timing using the clock's mechanism to prove it was tampered with.
- Test must rely on already-shown clue IDs: clue_clock_stopped, clue_guest_testimony, clue_note_found, clue_core_contradiction_chain, clue_fp_contradiction_step_1
- Fair-play rationale: Step 1: The clock's stoppage and witness accounts lead to tampering suspicion. Step 2: The crash timing and clock discrepancies narrow the suspect pool to Eleanor. Step 3: The note found near the clock contradicts her alibi, confirming her guilt.

## Character Reference

### Eleanor Voss (she/her — NEVER he/him)
Eleanor speaks with an elegant lilt, her words carefully chosen, often peppered with genteel sarcasm that reveals her sharp wit
She has a habit of punctuating her sentences with thoughtful pauses, as if weighing the impact of her words.
Eleanor feels a deep-seated guilt for her financial mismanagement, struggling with the fear that her failure will not only tarnish her name but also betray the trust of those who depend on her charitable efforts.

### Captain Ivor Hale (he/him — NEVER she/her)
Ivor speaks with a commanding presence, yet often punctuates his serious remarks with self-deprecating humor, revealing a man aware of his flaws
He has a penchant for storytelling, often using anecdotes from his military days to illustrate a point.
Ivor wrestles with the shame of his gambling habits, feeling the pressure to maintain a façade of respectability while battling the demons of his past.

### Beatrice Quill (she/her — NEVER he/him)
Beatrice speaks with a lively cadence, her words tumbling out in a rush as she conveys her excitement
She often uses sardonic humor to deflect from her insecurities, employing irony to mask her fear of failure.
Beatrice is torn between her ambition and the fear of being exposed, struggling with the moral implications of her lies and the lengths she must go to maintain her façade.


## CHARACTER CONTRACTS (binding for this scene)
Each entry below constrains how this character must be written in this chapter.
These override generic style guidance when they conflict.

### Eleanor Voss[SHE]
Voice & mannerisms: Eleanor speaks with an elegant lilt, her words carefully chosen, often peppered with genteel sarcasm that reveals her sharp wit. She has a habit of punctuating her sentences with thoughtful pauses, as if weighing the impact of her words.
Sample voice fragments (match this register and rhythm):
  [comfortable] "It's simply delightful to host you all here; nothing like a gathering to lift the spirits!"
  [evasive] "Oh, I couldn't possibly comment on that right now; let's focus on the lovely weather instead."
Humour: polite savagery — deploy frequently (level 0.7)
FORBIDDEN phrase (never write for Eleanor Voss): "she felt a wave of unease"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "The victim's impending revelations about her estate's debts could unravel the carefully constructed façade of her life, exposing her vulnerabilities and ruining her reputation." — do not surface in Act I.

### Captain Ivor Hale[HE]
Voice & mannerisms: Ivor speaks with a commanding presence, yet often punctuates his serious remarks with self-deprecating humor, revealing a man aware of his flaws. He has a penchant for storytelling, often using anecdotes from his military days to illustrate a point.
Sample voice fragments (match this register and rhythm):
  [comfortable] "Ah, the camaraderie of good friends; it's what keeps us grounded in these trying times."
  [evasive] "Let's not dwell on past mistakes; the future is what matters, wouldn't you agree?"
Humour: self deprecating — deploy occasionally (level 0.4)
FORBIDDEN phrase (never write for Captain Ivor Hale): "she knew with certainty she was right"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "If the victim's will were to be contested due to scandal, Ivor could potentially erase his debts and restore his standing in society." — do not surface in Act I.

### Beatrice Quill[SHE]
Voice & mannerisms: Beatrice speaks with a lively cadence, her words tumbling out in a rush as she conveys her excitement. She often uses sardonic humor to deflect from her insecurities, employing irony to mask her fear of failure.
Sample voice fragments (match this register and rhythm):
  [comfortable] "The thrill of the chase is what makes journalism so exhilarating!"
  [evasive] "Oh, I wouldn't worry too much about that; it seems trivial in the grand scheme."
Humour: sardonic — deploy frequently (level 0.8)
FORBIDDEN phrase (never write for Beatrice Quill): "palpable tension filled the room"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "To protect her career from ruin, Beatrice would do anything, including murder, to silence the victim before her deceit is revealed." — do not surface in Act I.



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
A sprawling manor steeped in secrets, surrounded by dense woodlands and meticulously kept gardens.

Key Locations Available:
- The Drawing Room (interior): Gathering space
- The Library (interior): Clue discovery
- The Gardens (exterior): Crime scene
- The Study (interior): Clue discovery

Atmosphere (tonal cue only — do NOT reproduce this phrase verbatim in prose; translate into scene-specific, character-observed sensory language): Tense, with an underlying sense of foreboding due to recent events affecting the household.
Weather: Overcast with occasional rain, typical for the English countryside in autumn.

Era markers: Petrol touring cars parked in the gravel driveway | Early home telephones with party lines | Typewriters clacking in the study

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
  - Visual: flickering candlelight, heavy brocade curtains, ornate fireplace mantel
  - Sounds: crackling fire, distant thunder, whispering voices
  - Scents: beeswax candles, old leather, tobacco smoke
  - Touch: plush velvet upholstery, cool marble floor

The Library (interior):
  - Visual: dusty volumes on shelves, faded maps on the walls, soft light from a brass lamp
  - Sounds: pages turning, soft footsteps on carpet, whispered conversations
  - Scents: old paper, polished wood, leather bindings
  - Touch: smooth leather chair, cold metal of a globe

The Gardens (exterior):
  - Visual: twisting ivy on trellises, faded blooms of autumn flowers, shadows cast by tall trees
  - Sounds: rustling leaves, distant bird calls, the whisper of wind
  - Scents: mildew, earthy dampness, fading floral notes
  - Touch: rough bark of trees, cool stone of the bench

⛔ REFERENCE DATA — DO NOT TRANSCRIBE VERBATIM: The above profiles are structural guides only. Generate original prose that evokes these qualities; do not reproduce the exact phrasing or sentence structure of the profile paragraphs.

SCENE OPENING RULE: When opening a scene in a new location, write what the POV character directly observes and physically senses at that moment — not a general description of the room's qualities. The reader must feel present, not briefed. Sensory details must be observed by the character, not stated as fact about the place.

SENSORY WRITING TECHNIQUES:
- Opening paragraphs: Lead with 2-3 sensory details to ground the scene
- Movement between locations: Note sensory changes (quiet study → noisy dining room)
- Emotional scenes: Use sensory details to reinforce mood (cold rain during argument)
- Period authenticity: Use period-specific sensory details from location/temporal profiles
- Avoid: Over-reliance on visual only; use sound, smell, touch, temperature

CHAPTER SENSORY PALETTE HINTS (evoke these qualities without copying verbatim):
  Chapter 2 palette — afternoon, overcast, uneasy stillness mood [location: The Drawing Room]:
    • shadows creeping across the room, pale ligh
[truncated for prompt budget]

## Texture Pool
Draw on these as opportunities arise — you are not required to use them.

- Living in November 1931 means navigating the oppressive atmosphere of the Great Depression, where the weight of financial instability looms over every interaction
- The wealthy host extravagant gatherings, yet whispers of economic hardship echo in the corners, as many struggle to make ends meet
- The air is thick with tension, as class divisions grow starker and societal roles are challenged
- Women increasingly assert their independence, while men grapple with traditional expectations
- The streets are filled with the sounds of distant protests, a reminder of the unrest brewing beneath the surface

TEMPORAL CONTEXT:

This story takes place in November 1931 during N/A.

Seasonal Atmosphere:
- Weather patterns: overcast skies, occasional rain showers, chilly winds
- Daylight: Short days with twilight descending by four o'clock in the afternoon, leaving long shadows and early darkness.
- Seasonal activities: hunting parties in the countryside, preparation for winter festivities, gathering for evening bonfires
- Seasonal occasions: Guy Fawkes Night on November 5th
- Season: N/A

Period Fashion (describe naturally):
- Men formal: tailored wool suit with a waistcoat, cravat in muted colors, bowler hat
- Men casual: tweed jacket, corduroy trousers, flat cap
- Men accessories: leather gloves, silver pocket watch, walking stick
- Women formal: tea-length evening gown with a dropped waist, velvet gloves, beaded clutch bag
- Women casual: wool sweater with a patterned skirt, tweed coat, beret
- Women accessories: string of pearls, silk scarf, small fascinator hat

Cultural Context (reference naturally):
- Music/entertainment: George Gershwin's 'Rhapsody in Blue', Louis Armstrong's jazz performances, The Andrews Sisters' harmonies; Films: 'City Lights' starring Charlie Chaplin, 'Frankenstein' directed by James Whale; Theatre: 'The Front Page' by Ben Hecht and Charles MacArthur, 'The Royal Family'; Radio: BBC Radio's news broadcasts, comedy programs like 'In Town Tonight'
- Typical prices: loaf of bread: four pence, a pint of milk: two pence, a cinema ticket: one shilling
- Current events: The Great Depression continues to impact unemployment rates; Political tension rises in Europe as fascism gains influence
- Literature: 'Murder in the Mews' by Agatha Christie | 'The Maltese Falcon' by Dashiell Hammett | 'The Glass Key' by Dashiell Hammett | [mystery] | [detective fiction] | [social commentary novels]
- Technology: the radio as a common household item | the latest models of petrol cars | the development of early sound films | home telephones with party lines | typewriters used in offices | electric lights in homes
- Daily life: evening gatherings for card games, attending local dances, visiting the market for fresh produce
- Social rituals: afternoon tea with cakes and sandwiches, gathering around the fireplace in the evenings, hosting dinner parties for social standing

Atmospheric Details:
The scent of damp earth and fallen leaves wafts through the air, mingling with the faint aroma of burning wood from the estate's fireplaces. The sound of rain tapping against the windows creates a melancholic backdrop, interrupted occasionally by the crackle of laughter from the drawing room. A chill in the air hints at the coming winter, with guests wrapped in elegant coats and scarves, their conversations laced with nervous anticipation.

FASHION INTEGRATION TECHNIQUES:
- First appearance: Describe outfit to establish class/personality
- Accessories: Gloves, hats, pocket watches, jewelry reveal status
- Time-specific: Different outfits for different times of day
- Character traits: Fastidious dresser vs rumpled appearance
- Action integration: "She tugged at her glove" or "He adjusted his tie"
- Weather appropriate: Overcoats in winter, light linen in summer

CULTURAL TOUCHSTONE INTEGRATION:
- Casual conversation: "Did you hear that new jazz record?" or "I saw the latest Chaplin film"
- Background details: Radio playing, newspap
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

• [clue_guest_testimony] Guests report hearing a loud crash around the time of death, but the clock does not match their accounts.
  Category: temporal | Criticality: essential | Supports inference step 2
  Points to: This discrepancy suggests that the clock may have been tampered with.

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

CLUES ALREADY REVEALED TO READER: clue_clock_stopped — do not reveal these as new information.

INVESTIGATION LOG — WHAT IS ESTABLISHED (do not re-establish, do not repeat):
• Evidence in reader's hands: The clock in the drawing room is stopped at ten minutes past eleven.
• Suspects still unresolved: Dr. Mallory Finch[SHE], Captain Ivor Hale[HE], Beatrice Quill[SHE]
⚠ The story must move FORWARD from this log. Any beat already listed above is forbidden from repeating.

⚠ THIS CHAPTER'S REQUIRED ADVANCE (opening): Discover the body, confirm the victim, establish the scene. The victim is found dead. They do not speak, react, or gesture. This is their only physical appearance — in all subsequent chapters they exist only in past tense (memory, evidence, testimony).

CONTINUITY HANDOFF — previous chapter closing beat:
  • "Eleanor nodded, her composure faltering as she wiped away a tear. "I just argued with her about the estate. She was going to reveal something that could ruin us all!" The words spilled from her lips, each one heavy with emotion. Hale's mind raced; this was a p..."
  • The next chapter must open as a continuation of this beat, not as a disconnected reset.
═══════════════════════════════════════════════════════

═══════════════════════════════════════════════════════════
📚 CONTINUITY CONTEXT - CHARACTER & SETTING CONSISTENCY
═══════════════════════════════════════════════════════════

**CRITICAL: You are writing chapters 2+. Maintain consistency with earlier chapters.**

**Character Names Used in Chapters 1-1:**
Eleanor Voss, Beatrice Quill

✓ RULE: Use EXACTLY these names. Do NOT vary spelling, add titles, or introduce new forms.
✓ Example: if earlier chapters used "Clara Whitfield", keep using "Clara Whitfield" — never "Mrs. Whitfield" unless that is the character's canonical name in the list above.

**Setting Vocabulary Established in Earlier Chapters:**
drawing room, estate

✓ RULE: Continue using this location vocabulary. Maintain consistency with established setting type.
✓ Do NOT introduce new location types that contradict earlier chapters.

**Recent Chapter Summary (for narrative continuity):**
Chapter 1: Chapter 1: Discovery
  Events: Eleanor Voss stood frozen, her breath caught in her throat as she stared at the lifeless form sprawled across the plush carpet of the drawing room.

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
Known location profile anchors: Middleton Manor, The Drawing Room, The Library, The Gardens, The Study, the drawing room
LOCATION NAME CAPITALISATION (HARD REQUIREMENT — validated):
All named locations in your prose MUST use the EXACT capitalisation from the CML profiles.
Canonical forms: "Middleton Manor", "The Drawing Room", "The Library", "The Gardens", "The Study", "the drawing room"
Writing a location in lowercase (e.g. "drawing room" instead of "Drawing Room") is a validated error. Every time you mention a named location, copy its capitalisation from the list above.
- Chapter 2: OPENING STYLE (HARD): Start the VERY FIRST SENTENCE with spoken dialogue — e.g. '"[words]," [Name] said/asked/replied/murmured.' The opening quote must be the first character on the line. Anchor opening in "the drawing room". HARD REQUIREMENT for the first 2 paragraphs: (a) include 2+ sensory words — choose from smell/scent/sound/echo/silence/creak/whisper/cold/warm/damp/rough/smooth/glow/shadow/flicker/dim — and (b) include 1+ atmosphere/time word — choose from rain/wind/fog/storm/mist/thunder/evening/morning/night/dawn/dusk/season/afternoon/midday/noon/midnight/twilight/sunrise/sunset/daylight/sunlight/overcast/cloudy/bright/dark. These are validated requirements, not style suggestions; missing them triggers a retry.

[⚠ INTERNAL QUALITY DIAGNOSTICS — DO NOT REPRODUCE ANY PART OF THIS SECTION IN YOUR STORY OUTPUT. These are private generator observations for your consideration only. Your narrative must read as if this section does not exist. Never include phrases from this block in character dialogue, narration, or description.]

PRIOR CHAPTER QUALITY OBSERVATIONS:
- Chapter 1 (score 87/100):
  Quality gaps noted: word density below preferred target (682/1000); scene grounding weakness
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
   WRONG: \"I have no alibi,\" Finch said. He turned away. (if Finch is fem
[truncated for prompt budget]

PROMPT BUDGET SUMMARY: budget=32000 tokens; fixed=6773; context=10803; dropped=[none]; truncated=[location_profiles, temporal_context, pronoun_accuracy]

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

QUALITY GUIDELINES (strongly preferred):
1. Use only canonical cast names from CML. Do not invent titled placeholders like 'Detective Surname', 'Inspector Surname', 'a woman Surname', or 'a man Surname'.
2. Before the final reveal closes, include explicit suspect-elimination coverage: each non-culprit suspect is ruled out with concrete on-page evidence or confirmed alibi.
3. In the reveal sequence, include a complete culprit evidence chain using explicit reasoning connectors (because/therefore/proves).
4. Integrate at least two concrete era-grounded details per chapter from setting refinement signals: petrol touring cars on county roads | early home telephones with party lines | typewriters standard in offices | telephone communication common among households | telegram services for urgent messages | airmail for faster delivery of correspondence.
5. Respect setting movement/access constraints in scene action and alibis: manor layout restricts access to certain areas without permission | gardens and woodlands can obscure evidence from view | weather conditions can affect the timing of outdoor activities | restricted areas within the manor such as private studies or servant quarters | daily routines of staff create predictable movement patterns.
6. Sustain social coherence with this backdrop pressure: A looming inheritance dispute amidst the economic strain of the Great Depression forces the manor's residents and staff into a tense standoff, where class tensions and hidden loyalties threaten to unravel in the face of a murder.
7. Maintain continuity around these socially central cast anchors where relevant: Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill.
8. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Critical: Plot similarity 0.75 with 'The Mysterious Affair at Styles' (same temporal axis and mechanical tampering method)
9. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Moderate: Character similarity 0.74 with 'The Mysterious Affair at Styles' (similar cast structure and roles)
10. RETRY MITIGATION: Strict obligation mode is active. Every required clue must be surfaced with concrete, observable prose before any deduction beat.
11. RETRY MITIGATION: Prioritize chronology and identity coherence over stylistic variation for this retry.
12. STORY TO DATE ANTI-COPY RULE: The STORY TO DATE section below is provided for chronological and factual reference ONLY. You MUST NOT copy, lightly rephrase, or structurally echo any sentence or paragraph from prior chapters. Every sentence in this chapter must be original prose unique to this scene. Reusing even a clause from prior chapter text will cause this attempt to fail immediately.

CRITICAL PROSE REQUIREMENTS:

The CML specifies exact requirements for certain validation-critical scenes. You MUST include these elements at the specified positions.

**Discriminating Test Scene (Act 3, Scene 4):**
Required elements: Execute the discriminating test, Observe the clock's mechanism, Draw conclusion about Eleanor's guilt
Test type: trap

**Suspect Clearance Scenes:**
- Dr. Mallory Finch (Act 3, Scene 5): proving he was the victim
  Clues: the medical report, the time of death
- Captain Ivor Hale (Act 3, Scene 5): establishing alibi during the murder time
  Clues: guest arrival testimony, his location in the garden

**Culprit Revelation Scene (Act 3, Scene 6):**
Method: Confrontation with evidence of clock tampering

**Clue Placement for These Chapters:**
- clue_guest_testimony must appear in Act 1, Scene 2 via Witness statements about the crash

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
- Chapter 2:
  - STRUCTURAL ARCHETYPE — Chapter 2 must be: FIRST_CONTACT
      ✓ MUST contain: at least two suspect interviews
      ✗ MUST NOT contain: physical evidence discovery
  - Word count: Target 1250 words. Achieve this through plot events, dialogue exchanges, and physical investigation — not through atmospheric repetition or extended internal reflection. Each 200-word segment should contain at minimum one concrete story event (a discovery, a conversation exchange, a physical action or movement). Padding with atmosphere alone is not acceptable.
  - Opening: Begin with a character action, spoken line, or clock/time marker — never a location name or location-description phrase.
  - Scene is set in: the drawing room — reference it naturally within the paragraph, never as your opening phrase.
  - Opening atmosphere (MANDATORY — validator enforced): the first paragraph MUST contain at least one of: rain / wind / fog / storm / mist / thunder / evening / morning / night / dawn / dusk / season / afternoon / midday / noon / midnight / twilight / sunrise / sunset / daylight / sunlight / overcast / cloudy / bright / dark / grey / pale / cold / warm / chill / crisp / damp / drizzle / haze / lamplight / firelight. A chapter that omits all of these from its opening paragraph will be rejected.
  - Continuity bridge: in the first 120 words, visibly connect from the previous chapter's final beat. Carry forward one unresolved element (object, accusation, emotional pressure, or immediate physical action) from: "Eleanor nodded, her composure faltering as she wiped away a tear. "I just argued with her about the estate. She was going to reveal something that could ruin us all!" The words spilled from her lips, each one heavy with...".
  - CLUE OBLIGATIONS — mandatory prose elements (do NOT omit or bury):
    • Guests report hearing a loud crash around the time of death, but the clock does not match their accounts. [clue_guest_testimony] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: This discrepancy suggests that the clock may have been tampered with.
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
  - ALIBI LOCK: Eleanor Voss's established alibi is "11:00 AM - 11:30 AM". Do NOT place Eleanor Voss at any other location or in any other activity during the crime window. Any contradiction is a continuity error that triggers a retry.
  - TESTIMONY CONTINUITY: Eleanor Voss has already made statements in earlier chapters. Any time, location, or claim attributed to Eleanor Voss in THIS chapter must be consistent with those earlier statements. Do NOT introduce a new or different alibi claim — any contradiction is a continuity error.
  - Sensory obligation — use at least two of: shadows creeping across the room, pale light on the carpet | silence interrupted by distant clocks, the creak of old furniture | dust. Mood: uneasy stillness.
- Locked fact phrase obligations:
  - If this batch mentions The exact time shown on the stopped clock face, write exactly: "ten minutes past eleven".
  - If this batch mentions The exact amount the clock was wound back, write exactly: "forty minutes".
- Seasonal vocabulary allow-list: autumn, autumnal, fall.
- Forbidden seasonal words: spring, summer, winter.

FROZEN FACT STATE (DO NOT ALTER):
- Timeline anchor: November (autumn).
- Month, season, weather, and time-of-year language in this batch must stay compatible with autumn.
- Established timeline fact: drawing room clock
- Established timeline fact: guest arrival times
- Established timeline fact: time of death
- If referenced, use exact phrase: "ten minutes past eleven" (The exact time shown on the stopped clock face).
- If referenced, use exact phrase: "forty minutes" (The exact amount the clock was wound back).

STORY TO DATE (REFERENCE ONLY — DO NOT COPY VERBATIM):
- Full prior chapter text is provided below for continuity, factual consistency, and reference accuracy.
- Use this to keep character voice, chronology, clue state, and location continuity aligned with earlier chapters.
- Do not quote, copy, or paraphrase these paragraphs too closely; write fresh prose that remains consistent with them.

--- BEGIN PRIOR CHAPTER 1 ---
Title: Chapter 1: Discovery
Eleanor Voss stood frozen, her breath caught in her throat as she stared at the lifeless form sprawled across the plush carpet of the drawing room. The steady patter of rain against the window created a somber soundtrack, mingling with the crackling of the fire in the ornate fireplace. The dim light flickered, casting shadows that danced across the walls, as if the very room itself was alive with secrets. The atmosphere was thick with tension, a palpable weight that pressed down upon her, making it difficult to breathe.

As she stepped closer, her heart raced. The clock on the wall, a grand old timepiece that had witnessed countless gatherings, stood frozen at ten minutes past eleven. Eleanor's eyes widened in horror as the implications of that moment struck her. This was no mere accident; the clock's stillness suggested something far more sinister. the captain Hale, the recently retired military officer turned investigator, would soon arrive to piece together the fragments of this tragedy, and he could already feel the scrutiny of his gaze upon him.

Captain Hale entered the drawing room, his presence commanding yet tempered by a sense of urgency. He surveyed the scene with a practiced eye, taking in the details that others might overlook. The body of the doctor Finch lay sprawled unnaturally, her once vibrant face now pale and cold. Hale's brow furrowed as he noted the clock, its hands unmoving, a silent witness to the events that had transpired. The time was crucial; it established the timeline of the murder, contradicting the alibis of those present.

Eleanor's voice trembled as she spoke, her words laced with a mix of disbelief and fear. "I can't believe this has happened. We were just talking, and then..." Her eyes darted to the clock, and she shivered involuntarily. "I had just left the room for a moment, I swear!" The desperation in her voice was palpable, a plea for understanding amidst the chaos. She had argued with Mallory earlier, but could that have led to this? The thought gnawed at her insides, twisting her stomach in knots.

Hale's gaze remained focused on the clock, his mind racing through the implications. If the time was indeed ten minutes past eleven, then Mallory's death must have occurred shortly after Eleanor had left the room. He could feel the tension in the air, thick and suffocating, as he considered the other guests who had been present. Each had their own reasons for being here, and each had access to the victim. He needed to act quickly, to gather the facts before the truth slipped away like the autumn leaves outside.

Beatrice Quill, a young journalist with an insatiable curiosity, entered the room, her expression shifting from shock to determination as she took in the scene. "What happened?" she asked, her voice barely above a whisper. The sight of the body sent a shiver down her spine. She had admired Dr. Finch, respected her as a colleague, and now she was gone. Beatrice's mind raced with questions, each one more pressing than the last. How would this affect her career? What stories would emerge from this tragedy?

As the rain continued to fall, a sense of foreboding settled over the drawing room. Hale turned his attention to Beatrice, who was now standing beside Eleanor, her eyes wide with disbelief. "We need to keep calm," he said, his voice steady despite the chaos surrounding them. "I will need your accounts of the evening. Every detail matters. We cannot afford to overlook anything." He could sense the underlying tensions, the unspoken fears that lingered just beneath the surface.

Eleanor nodded, her composure faltering as she wiped away a tear. "I just argued with her about the estate. She was going to reveal something that could ruin us all!" The words spilled from her lips, each one heavy with emotion. Hale's mind raced; this was a potential motive, a thread that could unravel the entire tapestry of their lives. He needed to tread carefully, to ensure that the truth did not become obscured by fear and desperation.
--- END PRIOR CHAPTER 1 ---

[SCENE COMPLETENESS CONTRACTS — MANDATORY. Each contract below lists what you MUST enact in that chapter. Do not summarise or mention these labels in the prose — enact them organically.]
Chapter 2 (Act 1) completeness contract:
  PIVOT ELEMENT (MANDATORY — write this into the prose, shown not told): "The conflicting testimonies about the crash and the time of death."
  FACT ESTABLISHED (MANDATORY — reader must know this by chapter end): "Establishes that witnesses heard a crash but cannot align their accounts with the stopped clock."

# Case Overview
Title: The Clockwork Conspiracy
Era: 1930s
Setting: Little Middleton
Crime: murder (mechanical tampering)
Culprit: Eleanor Voss
False assumption: Dr. Mallory Finch was murdered shortly after Eleanor Voss left the drawing room.
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
    "sceneNumber": 2,
    "act": 1,
    "title": "Witness Testimonies",
    "setting": {
      "location": "the drawing room",
      "timeOfDay": "Morning after the murder",
      "atmosphere": "Intense and filled with whispers of disbelief"
    },
    "characters": [
      "Captain Ivor Hale",
      "Eleanor Voss",
      "Beatrice Quill"
    ],
    "purpose": "Gather witness accounts about the events leading to the murder",
    "cluesRevealed": [
      "clue_guest_testimony"
    ],
    "dramaticElements": {
      "conflict": "Diverging accounts create suspicion",
      "tension": "Witnesses struggle to recall details accurately.",
      "microMomentBeats": [
        "Beatrice fidgets, glancing at Eleanor, as if hiding a secret."
      ]
    },
    "summary": "Captain Hale interviews Eleanor and Beatrice, who recount their last moments with Dr. Finch. They mention hearing a loud crash around the time of death, but their timelines don't match with the stopped clock.",
    "estimatedWordCount": 1800,
    "pivotElement": "The conflicting testimonies about the crash and the time of death.",
    "factEstablished": "Establishes that witnesses heard a crash but cannot align their accounts with the stopped clock.",
    "permittedBehavioursByAct": [
      {
        "characterName": "Eleanor Voss",
        "behaviour": "show normal social behaviour; grief or confusion if appropriate"
      },
      {
        "characterName": "Beatrice Quill",
        "behaviour": "show normal social behaviour; grief or confusion if appropriate"
      },
      {
        "characterName": "Captain Ivor Hale",
        "behaviour": "show normal social behaviour; grief or confusion if appropriate"
      }
    ],
    "redHerringPlacement": null,
    "emotionalRegister": "Unease rises as the investigation begins, revealing cracks in relationships.",
    "dominantCharacterNote": {
      "name": "Eleanor Voss",
      "voiceRegister": "Eleanor's voice is elegant and poised, often layered with genteel sarcasm that reflects her sharp wit."
    },
    "humourGuidance": {
      "permission": "forbidden"
    },
    "eraTextureNote": "Short daylight hours lead to early darkness and limited visibility.; Overcast weather frequently hampers outdoor activities.; Economic strain limits travel and leisure, confining social interactions to local gatherings.",
    "locationRegisterNote": "The drawing room feels heavy with secrets and tension, a space where laughter echoes but is underpinned by unspoken fear. It serves as both a gathering place and a crucible for hidden motives, where guests are drawn together yet remain distanced by their private struggles. — Entering this space should evoke a sense of caution, as the room's beauty belies the turmoil hidden within."
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
□ Chapter 2: "Guests report hearing a loud crash around the time of death, but the clock does not match their accounts." is placed in the first 25% of the chapter, followed by an explicit inference or suspicion paragraph.
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
Attempt 6/6 — chapters 2 — 1 validation issue(s) to resolve:

═══ PROSE QUALITY ERRORS (1) ═══
• Chapter 2 marked non-convergent after attempt 5/6: continuity

✓ SOLUTION: Vary paragraph lengths (short, medium, long)
✓ Include sensory details and atmospheric description
✓ Ensure each chapter has substance (3+ paragraphs minimum)

═══ FINAL ATTEMPT — COMPLETE REBUILD REQUIRED ═══
This is attempt 6/6. All prior attempts failed. Do NOT reference or preserve any text from previous responses.
Write chapters 2 completely from scratch. Satisfy EVERY constraint listed above in a single pass.
CRITICAL — SENSORY GROUNDING GATE (checked by automated validator on this attempt):
  The chapter opening (first 2 paragraphs) MUST contain at least 2 words from this EXACT list — synonyms are NOT counted:
  smell / scent / odor / fragrance / sound / echo / silence / whisper / creak / cold / warm / damp / rough / smooth / glow / shadow / flicker / dim
  Example: "The cold of the hallway pressed against her cheeks. A whisper of candlelight flickered across the clock face."
  Two sensory words from the list above must appear within the first two paragraphs. Do NOT use synonyms (e.g. 'chill', 'murmur') — they are not counted.
CRITICAL — ATMOSPHERE/TIME GROUNDING GATE (checked by automated validator on this attempt):
  The chapter opening (first 2 paragraphs) MUST also contain at least 1 word from this EXACT list:
  rain / wind / fog / storm / mist / thunder / evening / morning / night / dawn / dusk / afternoon / midday / noon / midnight / twilight / sunrise / sunset / daylight / sunlight / overcast / cloudy / bright / grey / gray / dark / light / season
  Example: "Morning light filtered through the fog-draped windows." or "The night air carried the scent of damp earth."
  One word from this list must appear in paragraph 1 or paragraph 2. Synonyms (e.g. 'dusk-like', 'nighttime') are NOT counted.
Submit the full chapter JSON — do not return partial content or indicate you are continuing.


RETRY CLASS: continuity
ATTEMPT: 5/6
MANDATORY FIXES:
- Resolve continuity issues before accepting this batch.
- Gender agreement: "both women" / "the two ladies" used in a paragraph that also contains masculine pronouns (he/him). At least one character in the group uses he/him. Use individual names instead of a gendered collective.
MITIGATION MODE: tighten_obligation
```
