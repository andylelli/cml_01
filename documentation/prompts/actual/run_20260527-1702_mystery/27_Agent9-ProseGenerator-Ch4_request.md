# Actual Prompt Record

- Run ID: `mystery-1779901336269`
- Project ID: ``
- Timestamp: `2026-05-27T17:52:37.216Z`
- Agent: `Agent9-ProseGenerator-Ch4`
- Operation: `chat_request_full_prompt`
- Model: `GPT-4o-mini`
- Temperature: `0.42`
- Max Tokens: `4500`
- Attempt: `first`
- Prompt Hash: `df1c60a79bfd14d1`

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
- TEMPLATE PRECONDITION (STRICT): Before returning JSON, self-check every paragraph for reused scaffold patterns and high-overlap phrasing from prior chapters. If any paragraph resembles template scaffold language, DISCARD that paragraph and rewrite it from a different sentence skeleton before output. Do not return until all paragraphs pass this precondition.
- TEMPORAL CONSISTENCY: If a month is mentioned (for example, May), season wording in the same timeline must be compatible with that month.
- DENOUEMENT REQUIREMENT: The final chapter of any act or the story must show concrete consequences, not just reflection. At minimum: state what happened to the culprit (arrest, flight, confession), show how relationships changed between surviving characters, and give the detective one moment of personal resolution (relief, regret, or changed understanding). Emotional aftermath is required.
- MORAL COMPLEXITY REQUIREMENT: The mechanism of this crime carries a moral gray area: "The murderer acted out of desperation to protect a loved one, eliciting sympathy despite the crime." — the culprit reveal and denouement MUST acknowledge this ambiguity. Do not let the ending feel clean or simple. Give the reader at least one moment of uncomfortable sympathy or moral doubt.


⚠️ AMATEUR DETECTIVE STORY: The investigator is a civilian with no official standing. The official police (if they appear) are unnamed background figures only — "a constable", "the sergeant", "an officer from the village". Do NOT give any police official a name or title+surname combination. There is no Inspector [Surname], no Constable [Surname], no Sergeant [Surname] in this story.


CRITICAL CHARACTER CONSISTENCY RULES:

1. Each character has ONE canonical name. Use ONLY names from this list. Never vary, abbreviate, or add titles beyond what is listed.
   COMPLETE CAST (no other named characters exist): Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill
   - "Mr. Jennings entered the room" → ILLEGAL. Jennings is not in the cast.
   - "Constable Reed took notes" → ILLEGAL. Reed is not in the cast.
   - "A constable took notes" → LEGAL (no name given).

2. Character roles are fixed:
   - Eleanor Voss: Amateur Sleuth / Civilian Investigator
   - Dr. Mallory Finch: Respected Professional
   - Captain Ivor Hale: Disgraced Veteran
   - Beatrice Quill: Social Climber
   - Never place characters in locations inconsistent with their role

WORLD DOCUMENT (use this as your primary creative context):

## Era: January 1931
In January 1931, the air is thick with the tension of economic despair. The Great Depression looms large, casting shadows over even the most privileged households, where whispers of unemployment and class struggles fill the air. Evening gatherings, once vibrant with laughter, are now tinged with anxiety as families tighten their budgets and navigate the stark class divisions that define their lives. The residents of Little Middleton Manor find themselves caught between the glamour of their previous lives and the harsh realities of a world in turmoil. Conversations once focused on frivolities now turn to the dire state of the economy, as the threat of fascism looms over Europe, adding to the sense of urgency and unease that permeates every interaction.
Emotional register: The dominant emotional state is one of anxiety and uncertainty, as families grapple with the threat of financial ruin.
Physical constraints: Short daylight hours with the sun setting around four o'clock | Cold winds and frequent rain limiting outdoor activities | Limited access to transportation due to financial strains
Current tensions (weave into background texture): Rising unemployment rates reaching 22% in England | Global economic struggles following the Wall Street Crash | Increasing political extremism and discussions about fascism in Europe
Wartime context — Many families are dealing with the aftermath of World War I, where veterans struggle with reintegration into civilian life.: The social fabric is strained, with veterans facing stigma and economic hardship, affecting their standing in society. Absence effect: The absence of stable employment opportunities leaves many feeling lost and hopeless, further compounding their struggles.

## Season Lock (mandatory — derived from January 1931)
Season: winter. Allowed vocabulary: winter, wintry, midwinter
Forbidden seasonal words — never use in narration, dialogue, or metaphor: spring, summer, autumn and their adjectival forms.
Every weather description, atmosphere, and time-of-year reference must be consistent with winter.

## Story Theme
The intertwining of ambition and deception reveals the fragile nature of social status amidst the harsh realities of the Great Depression, and reveals that evidence carries ethical weight, forcing characters to choose accountability over social performance when appearances and facts collide.

## Story Emotional Register
Dominant: The story unfolds with a somber tension, driven by underlying secrets and social anxieties.

Arc:
On a stormy January evening at Little Middleton Manor, a mechanical clock stands as both a witness and a participant in the unfolding tragedy. The air is thick with the scent of damp earth and polished wood, a fitting backdrop for the secrets that linger within the estate's walls. As the clock strikes ten minutes past eleven, a murder occurs, sending ripples of shock and disbelief through the gathered guests. Eleanor Voss, a sharp investigator, steps into the fray, determined to uncover the truth behind the crime that threatens to unravel her carefully curated life. The investigation begins slowly, with each clue revealing the intricate web of deceit woven among the manor's residents.

Tensions rise as false leads mislead Eleanor, and the emotional cost of the investigation weighs heavily on her, forcing her to confront her own past choices. Midway through the story, a pivotal revelation shifts the direction of the investigation; a hidden connection between the victim and Captain Ivor Hale comes to light, changing the dynamics of suspicion. This new information colors earlier events, casting doubt on previously trusted allies. As pressure mounts, the impending climax looms; Eleanor’s confrontation with Hale becomes inevitable, a test of wills that reveals the true cost of ambition and deception. The resolution brings emotional fallout for each character, as secrets are exposed and lives irrevocably altered. In the end, the clock's deceit mirrors their own, leaving Eleanor to grapple with the fragility of social standing and the price of uncovering the truth.

## Emotional register at this point in the story
The first clues emerge, leading Eleanor into a labyrinth of deceit and false leads.

## Character Portraits (appearance & era)

### Eleanor Voss
Eleanor Voss navigates the rigid social structure of the 1930s with grace, yet her financial struggles and hidden resentment towards the elite plague her. Her charm and social standing mask a deep-seated fear of exposure, reflecting the broader economic anxieties of the era.
Era intersection: Her desire to uphold her family's legacy amidst the economic downturn mirrors the societal pressures of the time.

### Captain Ivor Hale
Captain Ivor Hale, once a figure of authority, grapples with the demons of his past as the economic climate shifts. His quest for redemption reflects the broader narrative of individuals seeking to reclaim honor in a society burdened by class division and scandal.
Era intersection: His internal conflict over reputation and honor resonates with the societal struggles of men trying to redefine themselves post-war.

## Character Voices

### Eleanor Voss (she/her/her)
Eleanor speaks with a refined cadence, her tone often laced with irony and dry wit that masks her insecurities.
[comfortable] Oh, I simply adore the way the rain dances on the windows—it’s almost poetic, don’t you think?
[evasive] I wouldn't dare speak ill of anyone, especially not in such esteemed company.
[stressed] What if they find out? I can't let my family's legacy be tarnished.
Humour: Her dry wit often serves as a shield against her vulnerabilities.

### Captain Ivor Hale (he/him/his)
Ivor's gravelly voice carries a weight of authority, often punctuated by self-deprecating humor that reveals his vulnerabilities.
[comfortable] Ah, the memories of sea battles—if only I could relive my glory days.
[evasive] Let's not dwell on old wounds; I'm sure we all have our secrets.
[stressed] If they find out about my past, I’ll lose everything I’ve fought to regain.
Humour: His self-deprecating humor often serves to deflect from his deeper fears.

## Location Registers (scene framing guides)

The Grand Library: The Grand Library feels heavy with secrets and unspoken tension, every shadow flickering with the weight of the crime that has disrupted the manor's stillness. The air is thick with the scent of old leather and polished wood, echoing the history of the estate while amplifying the urgency of the investigation.. Camera angle: As a writer enters this space, they should feel the oppressive atmosphere and the burden of hidden truths waiting to be uncovered.. Era: In this era of economic instability, the library's opulence becomes a stark contrast to the struggles outside its walls.

The Drawing Room: The Drawing Room, filled with laughter and the clinking of glasses, is a façade of elegance hiding the undercurrents of suspicion and fear. The opulence of gold wallpaper and plush furnishings stand in stark contrast to the growing tensions that each gathering elicits.. Camera angle: The writer should capture the atmosphere of festivity tinged with unease, as if every laugh carries a weight of unspoken truths.. Era: The social rituals of the 1930s are palpable here, where class divisions and economic anxieties simmer beneath the surface.

The Servants' Hall: The Servants' Hall holds an air of camaraderie layered with the stark realities of class division. While laughter echoes and warmth radiates from the hearth, there remains an unspoken understanding of their place within the estate’s hierarchy, a reminder of the struggles they face outside its walls.. Camera angle: As a writer enters this space, they should feel the warmth of shared moments, tinged with the tension of societal expectations.. Era: In this economic climate, the hall is a refuge from the outside world, yet it amplifies the contrast between the lives of the staff and their employers.

The Formal Gardens: The Formal Gardens, while beautiful and meticulously arranged, feel foreboding as they stand witness to the turmoil within the manor. The vibrant blooms contrast with the somber atmosphere, echoing the secrets and ambitions that lie buried beneath the surface.. Camera angle: The writer should evoke a sense of tranquility overshadowed by an impending storm, capturing the duality of beauty and tension.. Era: The gardens, once a symbol of serenity, now reflect the melancholy of an era gripped by economic hardship.

## Humour guidance for this story position (first_turn)
Permission: forbidden
Rationale: The mounting tension does not permit humorous relief.

## Reveal Groundwork (texture — do not explain, only plant)
- Plant one subtle observable beat related to: "Plant one subtle anomaly that can be re-read after the resolution.". Do not explain significance yet.
- Plant one subtle observable beat related to: "Mallory Finch’s previously trusted alibi becomes suspect, complicating her relationship with Eleanor". Do not explain significance yet.
- Plant one subtle observable beat related to: "The final confrontation with Hale redefines the stakes for each character involved, showcasing the emotional costs of their ambitions and secrets". Do not explain significance yet.

FAIR-PLAY AND INFERENCE CONTRACT:
- FAIR PLAY CLUE TIMING: Never combine clue discovery and detective deduction in the same chapter. If a clue is first revealed to the reader in chapter N, the detective may only analyze, deduce from, or act on that clue in chapter N+1 or later.
- FAIR PLAY INFORMATION PARITY: The reader must see all clues BEFORE the detective uses them in reasoning. If the detective performs a test or makes a deduction, every piece of evidence supporting that conclusion must have been shown to the reader in earlier chapters.
- FAIR PLAY REVELATION SPACING: In the discriminating test scene, the detective can ONLY use clues that were revealed to the reader at least 1 full chapter earlier. Never introduce new clues or withheld information during the test.
- FAIR PLAY CONFRONTATION: During the final confrontation/revelation, the detective cannot surprise the reader with facts. Every piece of evidence cited must have been visible to the reader in prior chapters.
- Never solve by withheld information. Keep reader-information parity with detective reasoning.
- False assumption in force: The murder occurred at the time indicated by the stopped clock.
- Hidden truth to progressively expose: The clock was deliberately tampered with to mislead the investigation.
- Inference path checkpoints to dramatize clearly (observation -> correction -> effect):
  - Step 1: obs: The clock in the study shows ten minutes past eleven when discovered. | corr: The time shown is inconsistent with the timeline of events. | effect: Narrows the timeframe of the murder to before the clock was last wound.
  - Step 2: obs: Witnesses claim they heard the clock chime at a different time than shown. | corr: The clock's time cannot be trusted, indicating tampering. | effect: Eliminates the reliability of the clock as a timekeeper.
  - Step 3: obs: Fingerprints are found on the clock indicating recent handling. | corr: Someone tampered with the clock just before the murder. | effect: Narrows suspect list to those who had access to the study.
- Discriminating test method: trap
- Discriminating test design constraint: The discriminating test compares clock, study, and minut against the claimed timeline.
- Test must rely on already-shown clue IDs: clue_1, clue_2, clue_3, clue_fp_contradiction_step_1
- Fair-play rationale: Step 1: The clock's time and witness accounts let the reader separate natural failure from tampering. Step 2: Fingerprints establish access to the clock as a significant element. Step 3: The reenactment disproves the clock's failure as a plausible explanation.

## Character Reference

### Eleanor Voss (she/her — NEVER he/him)
Eleanor speaks with a refined cadence, her words carefully chosen to reflect her social standing
She often employs irony to mask her true feelings, and her laughter has a hint of melancholy, as if she is perpetually aware of the fragility of her facade.
Eleanor grapples with her resentment towards the wealthy elite while simultaneously striving to fit into their world. This conflict creates a tension within her as she seeks to balance her desire for acceptance with her disdain for the superficiality that surrounds her.

### Captain Ivor Hale (he/him — NEVER she/her)
Ivor's speech is marked by a gravelly timbre, often punctuated by dry humor that masks his vulnerabilities
He tends to speak in a measured, deliberate manner, with an occasional wry smile that betrays his self-awareness of his flaws.
Ivor is torn between his desire for redemption and the fear that his past will forever define him. This internal conflict creates a tension that drives him to seek answers, yet also holds him back from confronting the truth of his actions.


## CHARACTER CONTRACTS (binding for this scene)
Each entry below constrains how this character must be written in this chapter.
These override generic style guidance when they conflict.

### Eleanor Voss[SHE]
Voice & mannerisms: Eleanor speaks with a refined cadence, her words carefully chosen to reflect her social standing. She often employs irony to mask her true feelings, and her laughter has a hint of melancholy, as if she is perpetually aware of the fragility of her facade.
Sample voice fragments (match this register and rhythm):
  [comfortable] "Oh, I simply adore the way the rain dances on the windows—it’s almost poetic, don’t you think?"
  [evasive] "I wouldn't dare speak ill of anyone, especially not in such esteemed company."
Humour: dry wit — deploy occasionally (level 0.6)
FORBIDDEN phrase (never write for Eleanor Voss): "a surge of determination washed over her"
Act 2 behaviour contract: May show unease, evasion, or mild defensiveness when questioned. One behavioural tell is permitted. Internal conflict emerging: "Eleanor grapples with her resentment towards the wealthy elite while simultaneously striving to fit into their world. This conflict creates a tension within her as she seeks to balance her desire for acceptance with her disdain for the superficiality that surrounds her."

### Captain Ivor Hale[HE]
Voice & mannerisms: Ivor's speech is marked by a gravelly timbre, often punctuated by dry humor that masks his vulnerabilities. He tends to speak in a measured, deliberate manner, with an occasional wry smile that betrays his self-awareness of his flaws.
Sample voice fragments (match this register and rhythm):
  [comfortable] "Ah, the memories of sea battles—if only I could relive my glory days."
  [evasive] "Let's not dwell on old wounds; I'm sure we all have our secrets."
Humour: self deprecating — deploy occasionally (level 0.5)
FORBIDDEN phrase (never write for Captain Ivor Hale): "she knew with certainty she was right"
Act 2 behaviour contract: May show unease, evasion, or mild defensiveness when questioned. One behavioural tell is permitted. Internal conflict emerging: "Ivor is torn between his desire for redemption and the fear that his past will forever define him. This internal conflict creates a tension that drives him to seek answers, yet also holds him back from confronting the truth of his actions."



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
A sprawling manor house steeped in secrets, surrounded by gardens and woodland, reflecting the rigid social hierarchies of the 1930s.

Key Locations Available:
- The Grand Library (interior): Crime scene
- The Drawing Room (interior): Gathering space
- The Servants' Hall (interior): Staff gathering space
- The Formal Gardens (exterior): Outdoor gathering space

Atmosphere (tonal cue only — do NOT reproduce this phrase verbatim in prose; translate into scene-specific, character-observed sensory language): Tense and somber, reflecting the class tensions and economic struggles of the era.
Weather: Overcast with occasional rain, typical for the late spring season, affecting outdoor investigations.

Era markers: Petrol touring cars on winding country roads | Typewriters for correspondence in the study | Early telephone exchanges in the manor

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
The Grand Library (interior):
  - Visual: Dust motes in the candlelight, Leather-bound books stacked high, Crackling fire in the hearth
  - Sounds: Pages turning in the silence, Soft whispers among the shelves, Distant thunder rumbling
  - Scents: Beeswax and cold ash, Old leather and damp wood, Musty paper and ink
  - Touch: Worn leather armchair, Smooth pages of an ancient book

The Drawing Room (interior):
  - Visual: Opulent gold wallpaper, Elegant chandeliers casting soft light, Richly upholstered sofas
  - Sounds: Soft classical music from the piano, Laughter echoing from guests, Distant clinking of glasses
  - Scents: Fresh flowers in a vase, Polished wood and upholstery, Hints of tobacco smoke
  - Touch: Soft velvet cushions, Cool marble fireplace mantel

The Servants' Hall (interior):
  - Visual: Simple wooden furnishings, Faded wallpaper peeling at the edges
  - Sounds: Clattering dishes, Muffled laughter among staff, Crackling fire in the hearth
  - Scents: Freshly baked bread, Grease from the kitchen, Wood smoke from the hearth
  - Touch: Worn wooden table surface, Cool stone floor underfoot

⛔ REFERENCE DATA — DO NOT TRANSCRIBE VERBATIM: The above profiles are structural guides only. Generate original prose that evokes these qualities; do not reproduce the exact phrasing or sentence structure of the profile paragraphs.

SCENE OPENING RULE: When opening a scene in a new location, write what the POV character directly observes and physically senses at that moment — not a general description of the room's qualities. The reader must feel present, not briefed. Sensory details must be observed by the character, not stated as fact about the place.

SENSORY WRITING TECHNIQUES:
- Opening paragraphs: Lead with 2-3 sensory details to ground the scene
- Movement between locations: Note sensory changes (quiet study → noisy dining room)
- Emotional scenes: Use sensory details to reinforce mood (cold rain during argument)
- Period authenticity: Use period-specific sensory details from loc
[truncated for prompt budget]

## Texture Pool
Draw on these as opportunities arise — you are not required to use them.

- In January 1931, the air is thick with the tension of economic despair
- The Great Depression looms large, casting shadows over even the most privileged households, where whispers of unemployment and class struggles fill the air
- Evening gatherings, once vibrant with laughter, are now tinged with anxiety as families tighten their budgets and navigate the stark class divisions that define their lives
- The residents of Little Middleton Manor find themselves caught between the glamour of their previous lives and the harsh realities of a world in turmoil
- Conversations once focused on frivolities now turn to the dire state of the economy, as the threat of fascism looms over Europe, adding to the sense of urgency and unease that permeates every interaction.

TEMPORAL CONTEXT:

This story takes place in January 1931 during winter.

Seasonal Atmosphere:
- Weather patterns: overcast skies, frequent light rain, cold winds
- Daylight: Short daylight hours, with the sun setting around four o'clock in the afternoon, leaving long shadows in the dim light.
- Seasonal activities: indoor gatherings with board games, reading by the fire, planning for spring gardening
- Seasonal occasions: New Year's Day (January 1)
- Season: winter

Period Fashion (describe naturally):
- Men formal: dark woolen dinner jacket, starched white dress shirt, black bow tie
- Men casual: tweed jacket, knitted pullover, flannel trousers
- Men accessories: silver pocket watch, homburg hat, leather gloves
- Women formal: tea-length evening gown with intricate beadwork, tailored wool coat, silk blouse
- Women casual: knee-length skirt with a fitted sweater, corduroy dress, long cardigan
- Women accessories: cloche hat, pearl necklace, embroidered handkerchief

Cultural Context (reference naturally):
- Music/entertainment: Louis Armstrong's jazz classics, Bing Crosby's crooning ballads, Duke Ellington's orchestral jazz; Films: City Lights (Chaplin's latest), Frankenstein (horror film); Theatre: The Royal Family (comedy play), The Green Pastures (musical); Radio: The Shadow (detective series), Amos 'n' Andy (comedy show)
- Typical prices: Loaf of bread: four pence, Pint of milk: three pence, Taxi fare across town: two shillings
- Current events: Unemployment rates rise to 22% in England; Global economic struggles following the Wall Street Crash
- Literature: Murder in the Cathedral by T.S. Eliot | To the Lighthouse by Virginia Woolf | The Maltese Falcon by Dashiell Hammett | [detective fiction] | [social realism] | [modernist literature]
- Technology: the electric refrigerator | improvements in radio technology | the mass production of automobiles | telephones in most households | typewriters for correspondence | phonographs for music
- Daily life: attending local dances, playing cards by the fireside, visiting neighbors for tea
- Social rituals: formal dinner parties among the upper class, afternoon tea gatherings, Sunday church services

Atmospheric Details:
The air is thick with the scent of rain-soaked earth and woodsmoke from the hearth, a reminder of the winter chill outside. Inside the grand estate, the flickering glow of candlelight dances along the walls, casting long shadows that seem to whisper secrets. The distant sound of thunder rumbles, mingling with the faint clinking of tea cups and the hushed tones of anxious conversations, heightening the tension of the evening.

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
- Class indicators: Aristocrats discuss oper
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

• [clue_5] Captain Ivor Hale was observed acting nervously around the time of the murder.
  Category: behavioral | Criticality: essential | Supports inference step 2
  Points to: Raises suspicion about his involvement.

• [clue_8] The clock shows a different time than reported by witnesses.
  Category: temporal | Criticality: supporting | Supports inference step 2
  Points to: Highlights the discrepancies in the timeline.

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

CLUES ALREADY REVEALED TO READER: clue_1, clue_mechanism_visibility_core, clue_early_1, clue_early_3, clue_2, clue_core_contradiction_chain, clue_early_2, clue_fp_contradiction_step_1, clue_3, clue_4, clue_culprit_direct_captain_ivor_hale — do not reveal these as new information.

INVESTIGATION LOG — WHAT IS ESTABLISHED (do not re-establish, do not repeat):
• Evidence in reader's hands: The clock in the study shows ten minutes past eleven when discovered. | The clock was wound back to create a false timeline for the murder. | The clock was wound back to create a false timeline for the murder. | Witnesses claim they heard the clock chime at a different time than shown. | Witnesses claim they heard the clock chime at a different time than shown. | The time shown is inconsistent with the timeline of events. | The time shown is inconsistent with the timeline of events. | The clock in the study shows ten minutes past eleven when discovered. | Fingerprints are found on the clock indicating recent handling. | Someone tampered with the clock just before the murder. | Direct evidence ties Captain Ivor Hale to the mechanism access point before the discriminating test.
• Suspects still unresolved: Dr. Mallory Finch[SHE], Beatrice Quill[SHE]
⚠ The story must move FORWARD from this log. Any beat already listed above is forbidden from repeating.

⚠ THIS CHAPTER'S REQUIRED ADVANCE (first_turn): Examine physical evidence — find at least one new clue

CONTINUITY HANDOFF — previous chapter closing beat:
  • "Eleanor turned to Dr. Finch, who stood nearby, her brow furrowed in concentration. "We need to speak to Captain Hale now. His account may shed light on this situation, especially if he was aware of the clock's manipulation," he said, his voice steady despite t..."
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
study, drawing room, flat

✓ RULE: Continue using this location vocabulary. Maintain consistency with established setting type.
✓ Do NOT introduce new location types that contradict earlier chapters.

**Recent Chapter Summary (for narrative continuity):**
Chapter 1: Chapter 1: Discovery
  Events: Eleanor Voss stood frozen in the doorway of the study of the Hale residence, his heart racing as he took in the scene before him.
Chapter 2: Chapter 2: Initial Investigation
  Events: Eleanor Voss stood at the mantelpiece, her fingers brushing lightly over the cold, polished wood.
Chapter 3: Chapter 3: The Clock's Secret
  Events: "We need to figure out what happened here," Eleanor Voss said, her voice steady despite the storm raging outside.

⚠️ **VALIDATION:** Character name mismatches and setting drift are common failure modes.
Double-check every character name against the list above before using it.

**⏱ LOCKED TIME ANCHOR — use verbatim, do not paraphrase:**
Clock time established in earlier chapters: **"ten minutes past eleven"**
✓ RULE: Every reference to the clock MUST use exactly this phrase. No variation permitted.
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
Known location profile anchors: Little Middleton Manor, The Grand Library, The Drawing Room, The Servants' Hall, The Formal Gardens, the study of the Hale residence
LOCATION NAME CAPITALISATION (HARD REQUIREMENT — validated):
All named locations in your prose MUST use the EXACT capitalisation from the CML profiles.
Canonical forms: "Little Middleton Manor", "The Grand Library", "The Drawing Room", "The Servants' Hall", "The Formal Gardens", "the study of the Hale residence"
Writing a location in lowercase (e.g. "drawing room" instead of "Drawing Room") is a validated error. Every time you mention a named location, copy its capitalisation from the list above.
- Chapter 4: OPENING STYLE (HARD): Start the VERY FIRST SENTENCE with a noun-phrase atmosphere — e.g. "The smell of damp stone in the cellar…" / "A chill from the landing…" / "The sound of the clock in the hall…". Pattern: "The/A [noun] of/in/from [place]…". Anchor opening in "the study of the Hale residence". HARD REQUIREMENT for the first 2 paragraphs: (a) include 2+ sensory words — choose from smell/scent/sound/echo/silence/creak/whisper/cold/warm/damp/rough/smooth/glow/shadow/flicker/dim — and (b) include 1+ atmosphere/time word — choose from rain/wind/fog/storm/mist/thunder/evening/morning/night/dawn/dusk/season/afternoon/midday/noon/midnight/twilight/sunrise/sunset/daylight/sunlight/overcast/cloudy/bright/dark. These are validated requirements, not style suggestions; missing them triggers a retry.

[⚠ INTERNAL QUALITY DIAGNOSTICS — DO NOT REPRODUCE ANY PART OF THIS SECTION IN YOUR STORY OUTPUT. These are private generator observations for your consideration only. Your narrative must read as if this section does not exist. Never include phrases from this block in character dialogue, narration, or description.]

PRIOR CHAPTER QUALITY OBSERVATIONS:
- Chapter 2 (score 95/100):
  Quality gaps noted: word density below preferred target (948/1000); scene grounding weakness
  Address in upcoming chapters: Increase chapter density with concrete investigation action and sensory-grounded beats; avoid recap-only padding. | Open next chapter with a named location anchor plus at least two sensory cues and one atmosphere marker.
- Chapter 3 (score 83/100):
  Quality gaps noted: word density below preferred target (579/1000); scene grounding weakness
  Address in upcoming chapters: Increase chapter density with concrete investigation action and sensory-grounded beats; avoid recap-only padding. | Open next chapter with a named location anchor plus at least two sensory cues and one atmosphere marker.
- Phrases to avoid (already overused in earlier chapters): "of the study of the hale residence", "they heard the clock chime at a", "heard the clock chime at a different", "the clock chime at a different time", "clock chime at a different time than", "chime at a different time than shown".
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

PROMPT BUDGET SUMMARY: budget=32000 tokens; fixed=8728; context=10940; dropped=[none]; truncated=[location_profiles, temporal_context, pronoun_accuracy]

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
4. Integrate at least two concrete era-grounded details per chapter from setting refinement signals: petrol touring cars on county roads | early telephone exchanges in homes | typewriters for correspondence | party-line telephone systems common | telegrams for urgent messages | airmail for faster delivery of correspondence.
5. Respect setting movement/access constraints in scene action and alibis: architecture limits access to certain areas, such as private offices and the library | weather can impede outdoor movement and evidence collection | layout creates natural barriers between staff quarters and the main house | restricted areas such as the owners' private rooms | access permissions governed by the estate's hierarchy.
6. Sustain social coherence with this backdrop pressure: A mechanical clock-tampering incident during a tense family gathering exposes the underlying class tensions and economic struggles among the estate's residents amidst the Great Depression.
7. Maintain continuity around these socially central cast anchors where relevant: Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill.
8. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Critical: Plot similarity 0.75 with 'The Mysterious Affair at Styles' (similar focus on timing and murder)
9. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Moderate: Character similarity 0.74 with 'The Sign of the Four' (similar character roles and dynamics)
10. RETRY MITIGATION: Strict obligation mode is active. Every required clue must be surfaced with concrete, observable prose before any deduction beat.
11. RETRY MITIGATION: Prioritize chronology and identity coherence over stylistic variation for this retry.
12. STORY TO DATE ANTI-COPY RULE: The STORY TO DATE section below is provided for chronological and factual reference ONLY. You MUST NOT copy, lightly rephrase, or structurally echo any sentence or paragraph from prior chapters. Every sentence in this chapter must be original prose unique to this scene. Reusing even a clause from prior chapter text will cause this attempt to fail immediately.

CRITICAL PROSE REQUIREMENTS:

The CML specifies exact requirements for certain validation-critical scenes. You MUST include these elements at the specified positions.

**Discriminating Test Scene (Act 3, Scene 4):**
Required elements: Execute the discriminating test, Observe the culprit's reaction or result, Draw conclusion about guilt

**Suspect Clearance Scenes:**
- Dr. Mallory Finch (Act 3, Scene 5): Proves her alibi with documented evidence.
  Clues: clue_id_1, clue_id_2
- Beatrice Quill (Act 3, Scene 5): Her access to the study is proven to be restricted.
  Clues: clue_id_1, clue_id_2

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
  - Scene is set in: the study of the Hale residence — reference it naturally within the paragraph, never as your opening phrase.
  - Opening atmosphere (MANDATORY — validator enforced): the first paragraph MUST contain at least one of: rain / wind / fog / storm / mist / thunder / evening / morning / night / dawn / dusk / season / afternoon / midday / noon / midnight / twilight / sunrise / sunset / daylight / sunlight / overcast / cloudy / bright / dark / grey / pale / cold / warm / chill / crisp / damp / drizzle / haze / lamplight / firelight. A chapter that omits all of these from its opening paragraph will be rejected.
  - Continuity bridge: in the first 120 words, visibly connect from the previous chapter's final beat. Carry forward one unresolved element (object, accusation, emotional pressure, or immediate physical action) from: "Eleanor turned to Dr. Finch, who stood nearby, her brow furrowed in concentration. "We need to speak to Captain Hale now. His account may shed light on this situation, especially if he was aware of the clock's manipulati...".
  - CLUE OBLIGATIONS — mandatory prose elements (do NOT omit or bury):
    • Eliminates Eleanor Voss because she was seen at the local café at the time of the murder. [clue_core_elimination_chain]
      Points to: Narrowing the focus toward Captain Ivor Hale as the likely culprit.
    • Captain Ivor Hale was observed acting nervously around the time of the murder. [clue_5]
      Points to: Raises suspicion about his involvement.
    • The clock shows a different time than reported by witnesses. [clue_8]
      Points to: Highlights the discrepancies in the timeline.
  - Tonal contrast: include at least one beat of relief or ironic counterpoint. Do not sustain maximum tension for every paragraph.
  - ALIBI LOCK: Captain Ivor Hale's established alibi is "11:00 to 11:15". Do NOT place Captain Ivor Hale at any other location or in any other activity during the crime window. Any contradiction is a continuity error that triggers a retry.
  - TESTIMONY CONTINUITY: Captain Ivor Hale has already made statements in earlier chapters. Any time, location, or claim attributed to Captain Ivor Hale in THIS chapter must be consistent with those earlier statements. Do NOT introduce a new or different alibi claim — any contradiction is a continuity error.

- Tonal contrast required: the previous chapter was high-tension. This chapter must include at least one beat of relief, pause, or quiet observation.
- Locked fact phrase obligations:
  - If this batch mentions The exact time shown on the stopped clock face, write exactly: "ten minutes past eleven".
  - If this batch mentions The exact amount the clock was wound back, write exactly: "forty minutes".
- Seasonal vocabulary allow-list: winter, wintry, midwinter.
- Forbidden seasonal words: spring, summer, autumn.

⛔ PRONOUN TABLE — re-check after EVERY paragraph before writing the next:
    Eleanor Voss: she/her/her
    Dr. Mallory Finch: she/her/her
    Captain Ivor Hale: he/him/his
    Beatrice Quill: she/her/her
  Any sentence containing a pronoun must agree with this table. Correct mismatches before moving on.

FROZEN FACT STATE (DO NOT ALTER):
- Timeline anchor: January (winter).
- Month, season, weather, and time-of-year language in this batch must stay compatible with winter.
- Established timeline fact: The clock shows 'ten minutes past eleven' when found stopped.
- Established timeline fact: Witnesses recall hearing the clock chime just before the event.
- If referenced, use exact phrase: "ten minutes past eleven" (The exact time shown on the stopped clock face).
- If referenced, use exact phrase: "forty minutes" (The exact amount the clock was wound back).

STORY TO DATE (REFERENCE ONLY — DO NOT COPY VERBATIM):
- Full prior chapter text is provided below for continuity, factual consistency, and reference accuracy.
- Use this to keep character voice, chronology, clue state, and location continuity aligned with earlier chapters.
- Do not quote, copy, or paraphrase these paragraphs too closely; write fresh prose that remains consistent with them.

--- BEGIN PRIOR CHAPTER 1 ---
Title: Chapter 1: Discovery
Eleanor Voss stood frozen in the doorway of the study of the Hale residence, his heart racing as he took in the scene before him. The air was thick with a damp chill, the kind that seeped into one's bones and lingered long after the rain had stopped. Outside, the winter storm raged on, the sound of wind howling against the windows, while inside, a heavy silence hung like a shroud. The flickering lamplight cast eerie shadows across the room, illuminating the disarray that surrounded him. A mechanical clock on the mantelpiece caught his eye, its hands frozen in time, a haunting reminder of the life that had just been extinguished.

As Eleanor approached the clock, she could see that it showed ten minutes past eleven when discovered. The hands, still and lifeless, seemed to mock her as she struggled to comprehend the reality of what lay before her. The room was in chaos; papers were strewn across the floor, and a chair had been overturned, suggesting a struggle had taken place. The sight of the captain Hale's lifeless body sprawled on the floor sent a wave of nausea through him. He had known him as a man of honor, a figure of authority, and now, he lay there, stripped of life and dignity. It was an image that would haunt his for years to come.

Eleanor's mind raced as she tried to piece together the events that had led to this moment. The clock had been wound back to create a false timeline for the murder. It was an unsettling thought, one that suggested a deliberate attempt to mislead. Who would go to such lengths? She felt a shiver run down her spine as she recalled the conversations from the previous evening, where whispers of discontent had filled the air. The tension had been palpable, but she had never imagined it would culminate in such violence. She needed to act quickly, to gather the facts before the storm of emotions clouded her judgment.

Witnesses claimed they heard the clock chime at a different time than shown, a detail that gnawed at her. How could the clock be trusted if it had been tampered with? The implications were severe; it meant that the timeline of events was not as straightforward as it seemed. Each piece of evidence would have to be scrutinized, and every suspect's alibi examined. Eleanor steeled herself for the task ahead, knowing that the answers lay hidden within the chaos of the room. She was determined to uncover the truth, no matter how painful it might be.

As she surveyed the scene, Eleanor's thoughts turned to Captain Hale's alibi. He had mentioned hearing the clock chime at a different time, a statement that now seemed suspicious. Had he been aware of the clock's manipulation? The notion sent a fresh wave of anxiety through her. She could not shake the feeling that everyone in the house had something to hide, and she was the only one willing to dig deep enough to uncover the truth. With a deep breath, Eleanor stepped further into the room, her resolve hardening. This was no longer just a matter of finding answers; it was about justice for a man who had once commanded respect.

In that moment, Eleanor Voss became the investigator, the one who would unravel the tangled web of deceit that had led to this tragic end. The storm outside raged on, but within the study, a different kind of storm was brewing—one that would test her resolve and challenge everything she thought she knew about the people she called friends.
--- END PRIOR CHAPTER 1 ---

--- BEGIN PRIOR CHAPTER 2 ---
Title: Chapter 2: Initial Investigation
Eleanor Voss stood at the mantelpiece, her fingers brushing lightly over the cold, polished wood. The storm outside continued to rage, the wind howling against the windows of the study of the Hale residence. The flickering lamplight cast long shadows across the room, illuminating the chaos that surrounded him. The mechanical clock, its hands frozen in time, showed ten minutes past eleven when discovered, a haunting reminder of the moment that had shattered their gathering. As she stared at the clock, Eleanor felt a chill run down her spine, the weight of suspicion thick in the air.

Eleanor's gaze shifted from the clock to the doctor Finch, who stood nearby, her brow furrowed in concentration. "This clock... it doesn't make sense. The time shown is inconsistent with the timeline of events," Eleanor murmured, her voice barely above a whisper. The clock's stillness seemed to mock her, and she felt an unsettling knot in her stomach. How could they trust the time it displayed when everything else felt so chaotic and uncertain? The implications were severe, and she knew they needed to unravel this mystery quickly.

Dr. Finch nodded slowly, her eyes darting as she recalled the timeline. "Yes, and witnesses claim they heard the clock chime at a different time than shown. If that's true, it raises serious questions about the reliability of this clock and what it means for our " Her voice trembled slightly, revealing the tension that lay beneath her composed exterior. Eleanor could see the fear in Dr. Finch's eyes, a fear that mirrored her own. They were both acutely aware that the truth could be far more complicated than they had anticipated.

Eleanor stepped closer to the clock, examining it with newfound scrutiny. "If the clock was tampered with, then we cannot assume that the murder occurred at the time indicated by the stopped clock. This changes everything," she said, her voice steadying as her resolve strengthened. The thought of someone deliberately misleading them sent a wave of anger through her. Who could have done such a thing? And why? The questions swirled in her mind like the storm outside, each one more pressing than the last.

Dr. Finch took a deep breath, her expression shifting to one of determination. "We need to speak to Captain Hale and Beatrice Quill. Their accounts may shed light on this situation, especially if they were aware of the clock's " Eleanor nodded, appreciating the doctor's insight. They would need to gather all the facts and piece together the puzzle, no matter how uncomfortable it might be. The storm outside echoed the turmoil within her, a reminder that she was stepping into dangerous territory.

As they prepared to confront Captain Hale, Eleanor felt a flicker of doubt. What if he had manipulated the clock? What if he was hiding something? The weight of her family's legacy pressed heavily on her shoulders, and she couldn't shake the feeling that this investigation would reveal more than just the truth about the murder—it would expose the cracks in their carefully constructed lives. With a determined nod, she followed Dr. Finch out of the study, ready to face whatever revelations awaited them.

The hallway was dimly lit, the shadows dancing along the walls as they approached the drawing room where Captain Hale was likely to be found. Eleanor's heart raced with each step, the anticipation mingling with the dread of what they might uncover. As they entered the room, he spotted Captain Hale seated by the fireplace, his expression unreadable. He looked up, a flicker of surprise crossing his face as he noticed their presence. "Ah, Eleanor, Dr. Finch. What brings you " he asked, his tone casual but with an underlying tension that suggested he was all too aware of the gravity of the situation.

Eleanor took a deep breath, steeling herself for the conversation ahead. "Captain Hale, we need to discuss the timeline of events leading up to the... incident. There are discrepancies that we must " The words hung in the air like a storm cloud, heavy with implications. He could see Hale's demeanor shift slightly, his eyes narrowing as he processed his statement. "Discrepancies? What do you " she replied, feigning innocence, but Eleanor could sense the tension in her posture.

Dr. Finch interjected, her voice steady. "Witnesses have claimed to hear the clock chime at a different time than what is shown. We need your account of what happened leading up to the murder, especially regarding the clock's " Captain Hale's expression hardened, and for a moment, Eleanor thought she saw a flicker of something—fear? —cross his features. He hesitated, his gaze darting to the clock as if weighing his words carefully. "I... I was in the study when it happened, but I can't recall the exact time the clock chimed. It was all rather "

Eleanor pressed on, her resolve unwavering. "But you mentioned hearing it chime differently earlier. Can you " Hale's jaw tightened, and he shifted in his seat, clearly uncomfortable. "I suppose I must have misremembered. The stress of the situation can play tricks on one's mind, can't " Her attempt at nonchalance fell flat, and Eleanor felt a surge of frustration. There was something he wasn’t telling them, a truth buried beneath layers of evasion.

As the conversation continued, Eleanor's unease grew. The conflicting testimonies were creating doubt, and she could feel the weight of the investigation pressing down on her. Each word exchanged felt like a step deeper into a labyrinth of deception, and she was determined to find her way out. With Dr. Finch by her side, she would unravel the truth, no matter how tangled the web became.
--- END PRIOR CHAPTER 2 ---

--- BEGIN PRIOR CHAPTER 3 ---
Title: Chapter 3: The Clock's Secret
"We need to figure out what happened here," Eleanor Voss said, her voice steady despite the storm raging outside. The wind howled against the windows of the study of the Hale residence, rattling the glass and sending a shiver down his spine. The damp air clung to his skin, heavy with the scent of rain-soaked earth. As he focused on the mechanical clock, its hands frozen in time, showing ten minutes past eleven when discovered, he felt the weight of the situation pressing down on him. The stillness of the clock felt ominous, a haunting reminder of the life that had just been extinguished.

The clock in the study shows ten minutes past eleven when discovered. Eleanor's breath caught as she observed the time displayed, the hands unmoving, a stark contrast to the chaos that had unfolded. This was the moment that had shattered their gathering. But what did it truly mean? The implications weighed heavily on her. If the clock was tampered with, as she suspected, then it could not be trusted. The thought of someone manipulating time itself sent a wave of anger through her. Who would go to such lengths to mislead them?

Witnesses claim they heard the clock chime at a different time than shown. Eleanor recalled the conversations with the guests, their anxious faces illuminated by the flickering lamplight. The discrepancies gnawed at her, suggesting that the timeline of events was far more complicated than it appeared. If the clock had been manipulated, then the murder might not have occurred at the time indicated by the stopped clock. This revelation sent her mind racing, connecting threads of suspicion that began to weave a complex tapestry of deceit.

He recalled his presence in the study, his demeanor shifting as they discussed the clock. He had been there, had access to the clock, and that raised serious questions. What did he know? Why was he so evasive? The tension in the room was palpable, and Eleanor felt the weight of the investigation pressing down on her as she prepared to confront her.

The clock was wound back to create a false timeline for the murder. This realization was unsettling; it suggested a deliberate attempt to mislead her and the others. Eleanor's resolve hardened as she pieced together the implications of the clock's manipulation. Someone had tampered with it just before the murder, and she was determined to uncover the truth behind it. The thought of betrayal among those she once considered friends sent a shiver of dread through her.

The time shown is inconsistent with the timeline of events. Eleanor's mind raced as she considered the timeline of the night. If the clock was wrong, then everything they had assumed about the murder could be turned on its head. She needed to gather more information, to confront Captain Hale and Beatrice Quill, to dig deeper into the tangled web of lies that surrounded them. The storm outside reflected the turmoil within her, a reminder that she was stepping into dangerous territory.

Eleanor turned to Dr. Finch, who stood nearby, her brow furrowed in concentration. "We need to speak to Captain Hale now. His account may shed light on this situation, especially if he was aware of the clock's manipulation," he said, his voice steady despite the anxiety that gripped him. Dr. Finch nodded, and together they steeled themselves for the confrontation ahead, knowing that the answers they sought lay hidden within the chaos of the study.
--- END PRIOR CHAPTER 3 ---

[SCENE COMPLETENESS CONTRACTS — MANDATORY. Each contract below lists what you MUST enact in that chapter. Do not summarise or mention these labels in the prose — enact them organically.]
Chapter 4 (Act 2) completeness contract:
  PIVOT ELEMENT (MANDATORY — write this into the prose, shown not told): "Hale's nervous behavior during the questioning."
  FACT ESTABLISHED (MANDATORY — reader must know this by chapter end): "Establishes that Hale was acting strangely around the time of the murder."
  RED HERRING (MANDATORY — seed naturally, not flagged as false): [rh_2] Hale mentions that the clock had been malfunctioning recently — suggesting that the time could be unreliable.

# Case Overview
Title: The Clock's Deceit
Era: 1930s
Setting: Little Middleton
Crime: murder (unknown)
Culprit: Captain Ivor Hale
False assumption: The murder occurred at the time indicated by the stopped clock.
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
    "title": "Interrogation of Hale",
    "setting": {
      "location": "the study of the Hale residence",
      "timeOfDay": "Afternoon",
      "atmosphere": "Confrontational and charged"
    },
    "characters": [
      "Eleanor Voss",
      "Captain Ivor Hale"
    ],
    "purpose": "Question Hale about his whereabouts and his relationship with the victim",
    "cluesRevealed": [
      "clue_5",
      "clue_8"
    ],
    "dramaticElements": {
      "conflict": "Eleanor presses Hale for answers",
      "tension": "Hale's nervousness raises suspicion",
      "microMomentBeats": [
        "Hale's hands tremble as he fidgets with his cufflinks."
      ]
    },
    "summary": "Eleanor interrogates Captain Hale about his relationship with the victim and his alibi. Hale's nervous demeanor and evasive answers heighten Eleanor's suspicions.",
    "estimatedWordCount": 1800,
    "pivotElement": "Hale's nervous behavior during the questioning.",
    "factEstablished": "Establishes that Hale was acting strangely around the time of the murder.",
    "permittedBehavioursByAct": [
      {
        "characterName": "Eleanor Voss",
        "behaviour": "May show unease, evasion, or mild defensiveness when questioned."
      },
      {
        "characterName": "Captain Ivor Hale",
        "behaviour": "May show unease, evasion, or mild defensiveness when questioned."
      }
    ],
    "redHerringPlacement": {
      "redHerringId": "rh_2",
      "placementDetail": "Hale mentions that the clock had been malfunctioning recently — suggesting that the time could be unreliable."
    },
    "emotionalRegister": "The first clues emerge, leading Eleanor into a labyrinth of deceit and false leads.",
    "dominantCharacterNote": {
      "name": "Eleanor Voss",
      "voiceRegister": "Eleanor speaks with a refined cadence, her tone often laced with irony and dry wit that masks her insecurities."
    },
    "humourGuidance": {
      "permission": "forbidden"
    },
    "eraTextureNote": "Short daylight hours with the sun setting around four o'clock; Cold winds and frequent rain limiting outdoor activities; Limited access to transportation due to financial strains",
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
Attempt 3/6 — chapters 4 — 1 validation issue(s) to resolve:

═══ PROSE QUALITY ERRORS (1) ═══
• Chapter 4 marked non-convergent after attempt 2/6: continuity

✓ SOLUTION: Vary paragraph lengths (short, medium, long)
✓ Include sensory details and atmospheric description
✓ Ensure each chapter has substance (3+ paragraphs minimum)

Return corrected JSON for chapters 4. Edit only the sections that failed — keep all content that passed validation, and return the complete updated chapter JSON.


RETRY CLASS: continuity
ATTEMPT: 2/6
MANDATORY FIXES:
- Resolve continuity issues before accepting this batch.
- Chapter 4: Pronoun drift — 13 pronoun corrections were required, indicating systematic gender confusion. Review the ⛔ ABSOLUTE PRONOUN LOCK above. For male character Captain Ivor Hale: use he/him/his in every sentence. When Hale and a female character appear in the same sentence, name them explicitly rather than relying on a pronoun.
MITIGATION MODE: tighten_obligation
```
