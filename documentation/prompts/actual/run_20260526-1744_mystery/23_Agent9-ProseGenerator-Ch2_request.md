# Actual Prompt Record

- Run ID: `mystery-1779817497233`
- Project ID: ``
- Timestamp: `2026-05-26T18:28:10.861Z`
- Agent: `Agent9-ProseGenerator-Ch2`
- Operation: `chat_request_full_prompt`
- Model: `GPT-4o-mini`
- Temperature: `0.42`
- Max Tokens: `4500`
- Attempt: `first`
- Prompt Hash: `ba349159372ea492`

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
- MORAL COMPLEXITY REQUIREMENT: The mechanism of this crime carries a moral gray area: "The murderer felt compelled to act in defense of a loved one, leading to a morally conflicted outcome." — the culprit reveal and denouement MUST acknowledge this ambiguity. Do not let the ending feel clean or simple. Give the reader at least one moment of uncomfortable sympathy or moral doubt.


⚠️ AMATEUR DETECTIVE STORY: The investigator is a civilian with no official standing. The official police (if they appear) are unnamed background figures only — "a constable", "the sergeant", "an officer from the village". Do NOT give any police official a name or title+surname combination. There is no Inspector [Surname], no Constable [Surname], no Sergeant [Surname] in this story.


CRITICAL CHARACTER CONSISTENCY RULES:

1. Each character has ONE canonical name. Use ONLY names from this list. Never vary, abbreviate, or add titles beyond what is listed.
   COMPLETE CAST (no other named characters exist): Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill
   - "Mr. Jennings entered the room" → ILLEGAL. Jennings is not in the cast.
   - "Constable Reed took notes" → ILLEGAL. Reed is not in the cast.
   - "A constable took notes" → LEGAL (no name given).

2. Character roles are fixed:
   - Eleanor Voss: Amateur Sleuth / Civilian Investigator
   - Dr. Mallory Finch: Career-focused Professional
   - Captain Ivor Hale: Guarded Traditionalist
   - Beatrice Quill: Rebellious Dreamer
   - Never place characters in locations inconsistent with their role

WORLD DOCUMENT (use this as your primary creative context):

## Era: 1932-09
September 1932 finds England steeped in the gloom of the Great Depression, where the rain-drenched streets reflect both the physical and emotional weight of hardship. Overcast skies loom heavy, casting a pall over the country house estates where the wealthy try to maintain their social status amid rising tensions. As autumn approaches, the shortening days bring a chill that penetrates not only the air but the very fabric of society, where class disparities become more pronounced. Conversations over tea are tinged with anxiety about the future, while the echoes of political unrest in Europe provoke whispers of fear and uncertainty. Families gather for evening meals, yet the laughter that once filled these spaces is now often replaced by hushed discussions of finances and the looming specter of fascism. For those living in the lavish yet isolating world of grand manors, the façade of wealth is increasingly shadowed by the reality of economic strain and societal change.
Emotional register: A pervasive sense of anxiety and uncertainty grips society as individuals navigate the complexities of survival amidst economic turmoil.
Physical constraints: Shortened daylight hours limiting outdoor activities. | Intermittent rain affecting travel and social gatherings. | Increased scrutiny on spending and social etiquette.
Current tensions (weave into background texture): The Great Depression continues to strain economies. | Political unrest in Germany as the Nazi party gains traction. | Debates in Britain over unemployment benefits and public assistance.
Wartime context — No active military service during this period, as the focus remains on domestic issues.: Communities are tightening their belts, with many families struggling to make ends meet while still trying to uphold appearances. Absence effect: The absence of male figures in the workforce due to unemployment adds to the pressures on women to maintain family stability.

## Story Theme
In a world overshadowed by economic despair and rising fascism, the unraveling of a murder mystery reveals how personal ambitions can distort familial loyalty and the truth.

## Story Emotional Register
Dominant: A tense atmosphere suffused with suspense, revealing the complexities of human ambition and familial loyalty.

Arc:
The story opens in the grand halls of Little Middleton Manor, where the stormy ambiance mirrors the brewing tension among its inhabitants. The murder of Dr. Mallory Finch casts a shadow over the charity gala, igniting Eleanor Voss's determination to uncover the truth while grappling with her own hidden motives. As the investigation unfolds, Eleanor's keen observations lead her to the first clues, but false leads and emotional turmoil threaten to derail her resolve. A pivotal moment arises when conflicting testimonies about the clock's timing reveal a deeper deception, forcing Eleanor to confront the labyrinth of personal ambitions and resentments that cloud the truth. As pressure mounts, a revelation recontextualizes earlier interactions, shedding light on the fraught relationships that underpin the household dynamics. In the climax, Eleanor must confront the reality of her findings, facing Captain Hale as his fragile façade crumbles under scrutiny. Ultimately, the resolution leaves Eleanor and the other characters grappling with the emotional costs of their ambitions, as each must reckon with the legacy of the past while embracing the uncertain future.

The story opens: The atmosphere is thick with anticipation and unspoken tensions as guests mingle under the shadow of a recent tragedy. As the investigation takes shape: Eleanor feels the weight of her responsibility as the investigation begins, torn between her public persona and private doubts. A first key turn arrives: Conflicting accounts about the clock's time introduce a sense of urgency, reshaping the investigation's focus. At the mid-point of the story: The discovery of tampered evidence shifts suspicion and heightens the stakes for all characters involved.

A second pivot reshapes the course: A revelation about hidden motives forces Eleanor to reevaluate her own ambitions in light of the unfolding drama. As tension reaches its height: Pressure mounts as Eleanor confronts her own role.

## Emotional register at this point in the story
The atmosphere is thick with anticipation and unspoken tensions as guests mingle under the shadow of a recent tragedy.

## Character Portraits (appearance & era)

### Eleanor Voss
As a philanthropist in a time of economic hardship, Eleanor embodies the struggle between personal ambition and familial duty. Her secret rivalry with her family's legacy adds complexity to her character, reflecting the broader societal tensions of class and privilege during the Great Depression.
Era intersection: Eleanor's desire to reshape her family's narrative is underscored by the economic challenges of her time, as she navigates her social responsibilities amidst the decline of traditional values.

### Captain Ivor Hale
Captain Hale's adherence to tradition juxtaposes the changing societal values of the 1930s, as he grapples with the erosion of family legacies due to economic pressures. His resentment toward modernity reflects the broader conflict between old values and new realities as fascism begins to rise in Europe.
Era intersection: Hale's struggle to maintain his ideals in a world shifting toward progress mirrors the challenges faced by individuals resisting change amidst the growing tide of fascism.

### Beatrice Quill
Beatrice Quill's vibrant social presence belies her financial struggles, showcasing the impact of class tensions on personal identity. As a young woman navigating societal expectations in a time of economic hardship, her reliance on family wealth reveals the precariousness of her position in a changing world.
Era intersection: Beatrice's fears of losing her social standing amidst the Great Depression illustrate the pressures young women faced to conform while pursuing their own identities.

## Character Voices

### Eleanor Voss (she/her/her)
Eleanor speaks with a measured cadence, often employing irony to highlight social absurdities.
[comfortable] Isn't it amusing how we pretend that wealth can shield us from our own miseries?
[evasive] Oh, I wouldn't worry about that; it's just a little family squabble, nothing to concern yourself with.
[stressed] The stakes are too high; I can't let my family's legacy crumble because of someone's folly!
Humour: Her dry wit comes forth in moments of tension, often cutting through the seriousness of the situation.

### Captain Ivor Hale (he/him/his)
Captain Hale speaks in a blunt, no-nonsense style, often with military precision.
[comfortable] Tradition is the backbone of our family; we must uphold it.
[evasive] That's not for you to worry about; focus on what matters.
[stressed] This is an affront to everything I hold dear; I will not stand for it!
Humour: His bluntness often carries an unintentional humor, revealing his struggles with modernity.

### Beatrice Quill (she/her/her)
Beatrice's playful lilt contrasts her underlying insecurities, often using sarcasm to navigate social situations.
[comfortable] Darling, if I don’t inherit soon, I might have to take up knitting!
[evasive] Oh, I've been busy, you know, living the glamorous life.
[stressed] I can’t lose everything—my art, my reputation—what will I do?
Humour: Her sardonic humor masks her desperation, adding depth to her character.

## Location Registers (scene framing guides)

Grand Hall: The Grand Hall exudes grandeur yet feels suffocating, where laughter mingles with whispers of tension, casting an air of uncertainty over every gathering.. Camera angle: As a writer enters this space, they should feel the weight of history pressing against modern anxieties, where every glance carries unspoken secrets.. Era: The opulence of the hall contrasts sharply with the economic strain outside, highlighting the divide between wealth and despair.

Library: The library is a sanctuary of knowledge yet cloaked in shadows, where every book holds both wisdom and secrets waiting to be uncovered amidst the ticking clock's ominous reminder.. Camera angle: The writer should feel the tension of discovery and concealment, aware that each page turned could reveal a truth that reshapes the narrative.. Era: The dusty tomes reflect the stagnation of past ideals clashing with the urgent need for change in a world on the brink.

Gardens: The gardens, once a place of beauty, now carry an air of neglect, with overgrown hedges whispering secrets of decay and lost aspirations amidst the fading blooms.. Camera angle: Entering this space, the writer should sense the juxtaposition of past splendor and present decay, as if nature itself mourns the loss of what once was.. Era: The shifting seasons mirror the characters' struggles, as autumn's chill foreshadows the impending emotional unraveling.

Cellar: The cellar is a realm of shadows, thick with the scent of damp stone and secrets, where the air feels heavy with the weight of unspoken truths waiting to be unearthed.. Camera angle: As a writer descends into this space, they should feel the claustrophobic tension, aware that each creak and drip may unveil hidden narratives.. Era: The confinement of the cellar reflects the characters' emotional entrapment, where their darkest fears echo against the stone walls.

## Humour guidance for this story position (opening)
Permission: forbidden
Rationale: The gravity of the murder sets a serious tone that does not permit humor.

FAIR-PLAY AND INFERENCE CONTRACT:
- FAIR PLAY CLUE TIMING: Never combine clue discovery and detective deduction in the same chapter. If a clue is first revealed to the reader in chapter N, the detective may only analyze, deduce from, or act on that clue in chapter N+1 or later.
- FAIR PLAY INFORMATION PARITY: The reader must see all clues BEFORE the detective uses them in reasoning. If the detective performs a test or makes a deduction, every piece of evidence supporting that conclusion must have been shown to the reader in earlier chapters.
- FAIR PLAY REVELATION SPACING: In the discriminating test scene, the detective can ONLY use clues that were revealed to the reader at least 1 full chapter earlier. Never introduce new clues or withheld information during the test.
- FAIR PLAY CONFRONTATION: During the final confrontation/revelation, the detective cannot surprise the reader with facts. Every piece of evidence cited must have been visible to the reader in prior chapters.
- Never solve by withheld information. Keep reader-information parity with detective reasoning.
- False assumption in force: Dr. Mallory Finch was murdered shortly after the clock struck eleven.
- Hidden truth to progressively expose: The clock was wound back to fabricate a misleading timeline.
- Inference path checkpoints to dramatize clearly (observation -> correction -> effect):
  - Step 1: obs: The clock in the library shows ten minutes past eleven at the time of discovery. | corr: The clock was tampered to show a false time. | effect: Narrows timeline of events leading to the murder.
  - Step 2: obs: Footprints in the dust lead away from the clock face. | corr: Someone tampered with the clock shortly before the murder. | effect: Eliminates Beatrice Quill as she was in the kitchen during the timeframe.
  - Step 3: obs: Captain Hale's alibi is weak; he was in the garden during the timeframe. | corr: His access to the clock was unaccounted for. | effect: Narrows suspicion to Captain Hale.
- Discriminating test method: trap
- Discriminating test design constraint: A comparison of the clock's timing with the household's dinner records proves Captain Hale's false timeline.
- Test must rely on already-shown clue IDs: clue_1, clue_2, clue_3, clue_7, clue_9, clue_mechanism_visibility_core
- Fair-play rationale: Step 1: The clock's time and witness statements (early) provide the first clue. Step 2: The dust footprints (mid) eliminate Beatrice. Step 3: Captain Hale's weak alibi and the clock's tampering (discriminating test) identify him as the culprit.

## Character Reference

### Eleanor Voss (she/her — NEVER he/him)
Eleanor speaks with a measured cadence, often employing irony to highlight the absurdities of social norms
She has a penchant for rhetorical questions and enjoys punctuating her thoughts with a knowing smile.
Eleanor grapples with the guilt of betraying her family's legacy while simultaneously yearning for autonomy. This duality creates a tension that threatens to unravel her carefully curated world.

### Captain Ivor Hale (he/him — NEVER she/her)
Captain Hale speaks in a direct, no-nonsense manner, often using military jargon and a firm tone
He rarely indulges in pleasantries, preferring to get straight to the point, and his humor is sparse but pointed.
Captain Hale wrestles with the tension between his rigid adherence to tradition and the reality of a world that is evolving beyond his control. His resentment for the victim forces him to confront the possibility that change is inevitable.

### Beatrice Quill (she/her — NEVER he/him)
Beatrice speaks with a playful lilt, often employing sarcasm and witty banter
Her dialogue is peppered with artistic references and a tendency to exaggerate for comedic effect, revealing both her charm and her insecurities.
Beatrice struggles with the fear of losing her social standing and artistic aspirations, torn between her dependence on family wealth and her desire to carve out her own identity.


## CHARACTER CONTRACTS (binding for this scene)
Each entry below constrains how this character must be written in this chapter.
These override generic style guidance when they conflict.

### Eleanor Voss[SHE]
Voice & mannerisms: Eleanor speaks with a measured cadence, often employing irony to highlight the absurdities of social norms. She has a penchant for rhetorical questions and enjoys punctuating her thoughts with a knowing smile.
Sample voice fragments (match this register and rhythm):
  [comfortable] "Isn't it amusing how we pretend that wealth can shield us from our own miseries?"
  [evasive] "Oh, I wouldn't worry about that; it's just a little family squabble, nothing to concern yourself with."
Humour: dry wit — deploy occasionally (level 0.5)
FORBIDDEN phrase (never write for Eleanor Voss): "a surge of determination washed over her"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Eleanor was present at the estate for a charity gala when the murder occurred, making her a figure of interest as the stakes for her charity's future escalate." — do not surface in Act I.

### Captain Ivor Hale[HE]
Voice & mannerisms: Captain Hale speaks in a direct, no-nonsense manner, often using military jargon and a firm tone. He rarely indulges in pleasantries, preferring to get straight to the point, and his humor is sparse but pointed.
Sample voice fragments (match this register and rhythm):
  [comfortable] "Tradition is the backbone of our family; we must uphold it."
  [evasive] "That's not for you to worry about; focus on what matters."
Humour: blunt — deploy rarely (level 0.3)
FORBIDDEN phrase (never write for Captain Ivor Hale): "she chose her words with great care"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Captain Hale feels that the victim's modern views threaten the legacy of the family estate, igniting a fierce internal struggle between his ideals and the changing world around him." — do not surface in Act I.

### Beatrice Quill[SHE]
Voice & mannerisms: Beatrice speaks with a playful lilt, often employing sarcasm and witty banter. Her dialogue is peppered with artistic references and a tendency to exaggerate for comedic effect, revealing both her charm and her insecurities.
Sample voice fragments (match this register and rhythm):
  [comfortable] "Darling, if I don’t inherit soon, I might have to take up knitting!"
  [evasive] "Oh, I've been busy, you know, living the glamorous life."
Humour: sardonic — deploy occasionally (level 0.6)
FORBIDDEN phrase (never write for Beatrice Quill): "palpable tension filled the room"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Desperate to secure her inheritance to fund her artistic ambitions, Beatrice finds herself at odds with the victim's plans, which threaten her access to the wealth she needs." — do not surface in Act I.



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
A grand manor house steeped in mystery, its sprawling gardens conceal secrets amidst the backdrop of social tensions.

Key Locations Available:
- Grand Hall (interior): Social hub, gathering space
- Library (interior): Clue discovery, research space
- Gardens (exterior): Clue discovery, hiding place
- Cellar (interior): Crime scene, hiding place for clues

Atmosphere (tonal cue only — do NOT reproduce this phrase verbatim in prose; translate into scene-specific, character-observed sensory language): tense and suspenseful, reflecting underlying social tensions and personal conflicts
Weather: overcast with intermittent rain

Era markers: Typewriters in the study | A radio broadcasting news updates | Early telephone system in the drawing room

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
Grand Hall (interior):
  - Visual: chandeliers casting warm light, portraits with piercing gazes, polished wood floors
  - Sounds: murmurs of conversation, clinking of glasses, footsteps echoing
  - Scents: old leather and polished wood, woodsmoke from the fireplace, freshly cut flowers
  - Touch: cold marble staircase, smooth wooden banister

Library (interior):
  - Visual: dusty tomes lining the shelves, faded maps on the wall, globe slowly spinning
  - Sounds: soft rustle of pages, whispers echoing, clock ticking softly
  - Scents: old paper and ink, musty leather bindings, freshly polished wood
  - Touch: worn leather chair, smooth surface of the table

Gardens (exterior):
  - Visual: overgrown hedges obscuring paths, faded blooms wilting, cracked stone fountain
  - Sounds: rustling leaves, distant birdsong, water trickling
  - Scents: wet earth and moss, fading floral perfume, freshly cut grass
  - Touch: coolness of damp soil, rough texture of stone

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

- September 1932 finds England steeped in the gloom of the Great Depression, where the rain-drenched streets reflect both the physical and emotional weight of hardship
- Overcast skies loom heavy, casting a pall over the country house estates where the wealthy try to maintain their social status amid rising tensions
- As autumn approaches, the shortening days bring a chill that penetrates not only the air but the very fabric of society, where class disparities become more pronounced
- Conversations over tea are tinged with anxiety about the future, while the echoes of political unrest in Europe provoke whispers of fear and uncertainty
- Families gather for evening meals, yet the laughter that once filled these spaces is now often replaced by hushed discussions of finances and the looming specter of fascism

TEMPORAL CONTEXT:

This story takes place in September 1932 during N/A.

Seasonal Atmosphere:
- Weather patterns: overcast skies, intermittent rain, cool temperatures
- Daylight: Shortening days with twilight settling in by six o'clock, giving way to early darkness.
- Seasonal activities: Picking apples in orchards, Preparing for local harvest celebrations, Engaging in evening card games indoors
- Seasonal occasions: Harvest Festival (late September)
- Season: N/A

Period Fashion (describe naturally):
- Men formal: dark woolen suit, crisp white dress shirt, double-breasted waistcoat
- Men casual: tweed jacket, flannel trousers, knitted jumper
- Men accessories: bowler hat, silk tie, leather gloves
- Women formal: tea-length dress with cinched waist, long-sleeved blouse, tweed skirt
- Women casual: soft cardigan, patterned blouse, A-line skirt
- Women accessories: cloche hat, string of pearls, stylish handbag

Cultural Context (reference naturally):
- Music/entertainment: 'Ain't She Sweet' by Milton Ager, 'Night and Day' by Cole Porter, 'The Best Things in Life Are Free' by Ray Henderson; Films: 'Scarface', 'The Most Dangerous Game'; Theatre: 'Of Mice and Men', 'The Front Page'; Radio: BBC Radio News, The Savoy Orpheans program
- Typical prices: Loaf of bread: four pence, Pint of milk: two pence, Cinema ticket: one shilling
- Current events: The Great Depression continues to strain economies; Political unrest in Germany as the Nazi party gains traction
- Literature: 'Murder in the Cathedral' by T.S. Eliot | 'The Maltese Falcon' by Dashiell Hammett | 'Brave New World' by Aldous Huxley | [detective fiction] | [social realism] | [modernist literature]
- Technology: The electric refrigerator becoming more common | Advancements in radio technology | The first commercial production of the television | Wind-up gramophones | Typewriters in offices | Early model telephones in homes
- Daily life: Gathering for tea in the afternoon, Participating in community harvest events, Attending local dances or social clubs
- Social rituals: Evening family meals with conversation, Weekend outings to the countryside, Formal introductions at social gatherings

Atmospheric Details:
The scent of damp earth mixed with the crispness of autumn leaves fills the air, punctuated by the occasional crackle of thunder in the distance. The sounds of rain pattering against the windows create a rhythmic backdrop, enhancing the sense of isolation within the grand, creaking country house. As dusk falls, the flickering glow of oil lamps casts long shadows, suggesting secrets lurking in every corner of the estate.

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
- Class indicators: Aristocrats discuss opera, servants di
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

• [clue_2] Footprints in the dust lead away from the clock face.
  Category: temporal | Criticality: essential | Supports inference step 1
  Points to: The footprints suggest someone was near the clock recently.

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

CLUES ALREADY REVEALED TO READER: clue_1 — do not reveal these as new information.

INVESTIGATION LOG — WHAT IS ESTABLISHED (do not re-establish, do not repeat):
• Evidence in reader's hands: The clock in the library shows ten minutes past eleven at the time of discovery.
• Suspects still unresolved: Beatrice Quill[SHE]
⚠ The story must move FORWARD from this log. Any beat already listed above is forbidden from repeating.

⚠ THIS CHAPTER'S REQUIRED ADVANCE (opening): Discover the body, confirm the victim, establish the scene. The victim is found dead. They do not speak, react, or gesture. This is their only physical appearance — in all subsequent chapters they exist only in past tense (memory, evidence, testimony).

CONTINUITY HANDOFF — previous chapter closing beat:
  • "As the investigation unfolded, Eleanor felt the weight of the truth pressing down on her. The household was in disarray, each character's alibi now a potential thread leading to the unraveling of the mystery. She had to remain focused, to sift through the laye..."
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
library, drawing room, kitchen, garden, estate

✓ RULE: Continue using this location vocabulary. Maintain consistency with established setting type.
✓ Do NOT introduce new location types that contradict earlier chapters.

**Recent Chapter Summary (for narrative continuity):**
Chapter 1: Chapter 1: The Clock Strikes
  Events: Eleanor Voss stepped into the library of the Hale estate, her heart pounding against her ribcage.

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
Known location profile anchors: Little Middleton Manor, Grand Hall, Library, Gardens, Cellar, the kitchen of the Hale estate
LOCATION NAME CAPITALISATION (HARD REQUIREMENT — validated):
All named locations in your prose MUST use the EXACT capitalisation from the CML profiles.
Canonical forms: "Little Middleton Manor", "Grand Hall", "Library", "Gardens", "Cellar", "the kitchen of the Hale estate"
Writing a location in lowercase (e.g. "drawing room" instead of "Drawing Room") is a validated error. Every time you mention a named location, copy its capitalisation from the list above.
- Chapter 2: OPENING STYLE (HARD): Start the VERY FIRST SENTENCE with spoken dialogue — e.g. '"[words]," [Name] said/asked/replied/murmured.' The opening quote must be the first character on the line. Anchor opening in "the kitchen of the Hale estate". HARD REQUIREMENT for the first 2 paragraphs: (a) include 2+ sensory words — choose from smell/scent/sound/echo/silence/creak/whisper/cold/warm/damp/rough/smooth/glow/shadow/flicker/dim — and (b) include 1+ atmosphere/time word — choose from rain/wind/fog/storm/mist/thunder/evening/morning/night/dawn/dusk/season/afternoon/midday/noon/midnight/twilight/sunrise/sunset/daylight/sunlight/overcast/cloudy/bright/dark. These are validated requirements, not style suggestions; missing them triggers a retry.

[⚠ INTERNAL QUALITY DIAGNOSTICS — DO NOT REPRODUCE ANY PART OF THIS SECTION IN YOUR STORY OUTPUT. These are private generator observations for your consideration only. Your narrative must read as if this section does not exist. Never include phrases from this block in character dialogue, narration, or description.]

PRIOR CHAPTER QUALITY OBSERVATIONS:
- Chapter 1 (score 95/100):
  Quality gaps noted: word density below preferred target (907/1000); scene grounding weakness
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

PROMPT BUDGET SUMMARY: budget=32000 tokens; fixed=7003; context=10654; dropped=[none]; truncated=[temporal_context, pronoun_accuracy]

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
4. Integrate at least two concrete era-grounded details per chapter from setting refinement signals: radio broadcasting in common use | early telephone systems in households | typewriters as standard office equipment | increasingly common telephone communication | telegram services for rapid messaging | airmail available for long-distance correspondence.
5. Respect setting movement/access constraints in scene action and alibis: manor's architecture includes locked rooms and hidden passages | gardens provide both cover and obstacles for movement | weather conditions can affect outdoor evidence visibility | restricted areas such as private offices and the cellar | daily routines dictate access to certain rooms at specific times.
6. Sustain social coherence with this backdrop pressure: An inheritance dispute amidst the Great Depression forces a diverse group of heirs and staff into the isolated manor, where class tensions and personal rivalries are exacerbated by the looming threat of fascism.
7. Maintain continuity around these socially central cast anchors where relevant: Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill.
8. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Moderate: Character similarity 0.74 with 'The Sign of the Four' (similar cast structure and dynamics).
9. RETRY MITIGATION: Strict obligation mode is active. Every required clue must be surfaced with concrete, observable prose before any deduction beat.
10. RETRY MITIGATION: Prioritize chronology and identity coherence over stylistic variation for this retry.
11. STORY TO DATE ANTI-COPY RULE: The STORY TO DATE section below is provided for chronological and factual reference ONLY. You MUST NOT copy, lightly rephrase, or structurally echo any sentence or paragraph from prior chapters. Every sentence in this chapter must be original prose unique to this scene. Reusing even a clause from prior chapter text will cause this attempt to fail immediately.

CRITICAL PROSE REQUIREMENTS:

The CML specifies exact requirements for certain validation-critical scenes. You MUST include these elements at the specified positions.

**Discriminating Test Scene (Act 3, Scene 4):**
Required elements: Execute the discriminating test, Observe the clock's timing against witness statements, Draw conclusion about guilt
Test type: comparison

**Suspect Clearance Scenes:**
- Beatrice Quill (Act 3, Scene 5): Beatrice's alibi confirmed by the cook.
  Clues: clue_1, clue_2

**Culprit Revelation Scene (Act 3, Scene 6):**
Method: Confrontation with evidence

**Clue Placement for These Chapters:**
- clue_2 must appear in Act 1, Scene 2 via Witness statement about the timing of the clock

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
  - Scene is set in: the kitchen of the Hale estate — reference it naturally within the paragraph, never as your opening phrase.
  - Opening atmosphere (MANDATORY — validator enforced): the first paragraph MUST contain at least one of: rain / wind / fog / storm / mist / thunder / evening / morning / night / dawn / dusk / season / afternoon / midday / noon / midnight / twilight / sunrise / sunset / daylight / sunlight / overcast / cloudy / bright / dark / grey / pale / cold / warm / chill / crisp / damp / drizzle / haze / lamplight / firelight. A chapter that omits all of these from its opening paragraph will be rejected.
  - Continuity bridge: in the first 120 words, visibly connect from the previous chapter's final beat. Carry forward one unresolved element (object, accusation, emotional pressure, or immediate physical action) from: "As the investigation unfolded, Eleanor felt the weight of the truth pressing down on her. The household was in disarray, each character's alibi now a potential thread leading to the unraveling of the mystery. She had to...".
  - CLUE OBLIGATIONS — mandatory prose elements (do NOT omit or bury):
    • Footprints in the dust lead away from the clock face. [clue_2] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: The footprints suggest someone was near the clock recently.
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
  - ALIBI LOCK: Captain Ivor Hale's established alibi is "Between 10:00 and 11:30". Do NOT place Captain Ivor Hale at any other location or in any other activity during the crime window. Any contradiction is a continuity error that triggers a retry.
  - TESTIMONY CONTINUITY: Captain Ivor Hale has already made statements in earlier chapters. Any time, location, or claim attributed to Captain Ivor Hale in THIS chapter must be consistent with those earlier statements. Do NOT introduce a new or different alibi claim — any contradiction is a continuity error.
- Locked fact phrase obligations:
  - If this batch mentions The exact time shown on the stopped clock face, write exactly: "ten minutes past eleven".
  - If this batch mentions The exact amount the clock was wound back, write exactly: "forty minutes".
- Seasonal vocabulary allow-list: autumn, autumnal, fall.
- Forbidden seasonal words: spring, summer, winter.

⛔ PRONOUN TABLE — re-check after EVERY paragraph before writing the next:
    Eleanor Voss: she/her/her
    Dr. Mallory Finch: she/her/her
    Captain Ivor Hale: he/him/his
    Beatrice Quill: she/her/her
  Any sentence containing a pronoun must agree with this table. Correct mismatches before moving on.

FROZEN FACT STATE (DO NOT ALTER):
- Timeline anchor: September (autumn).
- Month, season, weather, and time-of-year language in this batch must stay compatible with autumn.
- Established timeline fact: Time of death
- Established timeline fact: Time of clock's last strike
- If referenced, use exact phrase: "ten minutes past eleven" (The exact time shown on the stopped clock face).
- If referenced, use exact phrase: "forty minutes" (The exact amount the clock was wound back).

STORY TO DATE (REFERENCE ONLY — DO NOT COPY VERBATIM):
- Full prior chapter text is provided below for continuity, factual consistency, and reference accuracy.
- Use this to keep character voice, chronology, clue state, and location continuity aligned with earlier chapters.
- Do not quote, copy, or paraphrase these paragraphs too closely; write fresh prose that remains consistent with them.

--- BEGIN PRIOR CHAPTER 1 ---
Title: Chapter 1: The Clock Strikes
Eleanor Voss stepped into the library of the Hale estate, her heart pounding against her ribcage. The morning light struggled to penetrate the overcast sky, casting a dim glow across the room. Water droplets clung to the windowpanes, their descent echoing the turmoil brewing within her. The air was thick with a damp chill, a stark contrast to the warmth of the previous evening's gathering. She had come to the estate for a charity gala, but now, the very air felt heavy with unspoken dread. Eleanor's gaze fell upon the clock mounted above the fireplace, its hands frozen in time, and she felt a shiver run down her spine. It was ten minutes past eleven, and the implications of that moment weighed heavily upon her.

As she approached the clock, her breath caught in her throat. The stillness of the room was punctuated only by the soft ticking of the grandfather clock in the corner, a reminder of the passing time that now felt so ominous. "Ten minutes past eleven," she whispered to herself, her mind racing to comprehend the significance of the time. It was the last moment the doctor Finch had been alive, and the knowledge sent a wave of nausea through her. The clock had stopped, yet the reality of the situation was all too clear. Mallory was dead, and Eleanor could feel the weight of the world pressing upon her shoulders as she turned to face the room, her heart racing as she processed the gravity of the situation.

the captain Hale stood nearby, visibly shaken, his usually composed demeanor shattered by the shocking discovery. Her eyes darted between Eleanor and the lifeless body sprawled across the floor, a mixture of disbelief and horror etched across her features. "This cannot be happening," he muttered, his voice barely above a whisper. The tension in the air was palpable, an electric charge that left Eleanor feeling as though she were standing on the edge of a precipice. He had always known that the Hale estate held its share of secrets, but this was a revelation that would change everything.

Eleanor knelt beside the doctor Finch, her breath hitching as she took in the sight of her friend and colleague. Mallory's once vibrant face was now pale, her eyes closed forever. A sense of urgency surged within Eleanor; she needed to take control of the situation. "We must call for help," she said, her voice steady despite the turmoil swirling inside her. "This is a crime scene, and we cannot disturb anything until the authorities arrive." He glanced at Hale, whose expression had shifted from shock to a grim determination. She nodded, but Eleanor could see the flicker of uncertainty in her eyes. What had transpired in this room was beyond comprehension, and they were both caught in the web of its aftermath.

As Eleanor rose to her feet, she felt the weight of responsibility settle upon her. She was not just a guest at the gala; she was now the investigator, tasked with uncovering the truth behind Mallory's death. The clock's ominous display would serve as a reminder of the time lost, the moments that led to this tragedy. He turned to Hale, his voice firm. "We need to gather everyone in the drawing room. I will need to speak with each of you to understand what happened here last night." Hale's jaw tightened, and he nodded, the gravity of the situation settling in. Eleanor could see the internal struggle within her, the conflict between her traditional values and the reality of the unfolding chaos.

In the drawing room, the atmosphere was thick with tension. Beatrice Quill sat in a corner, her hands clasped tightly in her lap, her eyes darting nervously around the room. Eleanor approached her, sensing the girl's distress. "Beatrice, I need you to stay calm. Can you tell me where you were last night?" Beatrice swallowed hard, her voice trembling as she replied, "I was in the kitchen, helping with the preparations for the gala. I didn't see anything unusual." Eleanor noted the girl's fear, but something in Beatrice's demeanor felt off. The uncertainty gnawed at her, and she made a mental note to revisit their conversation later.

Captain Hale entered the room, his expression unreadable. "I was in the garden during the gala, tending to some matters that required my attention," he stated, his tone clipped. Eleanor raised an eyebrow, sensing the underlying tension in her words. "And what time did you return to the house?" Hale hesitated, his gaze flickering to the clock. "Between ten and eleven thirty," he replied, a hint of defensiveness creeping into his voice. Eleanor's mind raced as she calculated the implications of her alibi. If the clock had stopped at ten minutes past eleven, it meant Hale's timeline was now under scrutiny.

As the investigation unfolded, Eleanor felt the weight of the truth pressing down on her. The household was in disarray, each character's alibi now a potential thread leading to the unraveling of the mystery. She had to remain focused, to sift through the layers of deception and uncover the reality behind Mallory's death. The clock in the library, forever frozen at ten minutes past eleven, would serve as a reminder of the moment that changed everything. Eleanor steeled herself for the task ahead, determined to seek justice for her friend, even as the shadows of doubt began to creep into her mind.
--- END PRIOR CHAPTER 1 ---

[SCENE COMPLETENESS CONTRACTS — MANDATORY. Each contract below lists what you MUST enact in that chapter. Do not summarise or mention these labels in the prose — enact them organically.]
Chapter 2 (Act 1) completeness contract:
  PIVOT ELEMENT (MANDATORY — write this into the prose, shown not told): "Beatrice's statement about the clock's timing."
  FACT ESTABLISHED (MANDATORY — reader must know this by chapter end): "Establishes Beatrice's alibi, suggesting she was not near the clock at the time of the murder."
  RED HERRING (MANDATORY — seed naturally, not flagged as false): [rh_1] Beatrice mentions seeing Dr. Mallory Finch near the library just before the murder — seeds false inference about Finch's involvement.

# Case Overview
Title: The Clockwork Deception
Era: 1930s
Setting: Little Middleton
Crime: murder (mechanical tampering)
Culprit: Captain Ivor Hale
False assumption: Dr. Mallory Finch was murdered shortly after the clock struck eleven.
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
    "title": "Witness Statements",
    "setting": {
      "location": "the kitchen of the Hale estate",
      "timeOfDay": "Late morning",
      "atmosphere": "Whispers of suspicion and fear"
    },
    "characters": [
      "Eleanor Voss",
      "Captain Ivor Hale",
      "Beatrice Quill"
    ],
    "purpose": "Gather initial witness statements and establish alibis.",
    "cluesRevealed": [
      "clue_2"
    ],
    "dramaticElements": {
      "conflict": "Discrepancies in alibis emerge.",
      "tension": "Beatrice's nervousness raises suspicion.",
      "microMomentBeats": [
        "Beatrice fidgets with her apron, avoiding eye contact as she speaks."
      ]
    },
    "summary": "In the kitchen, Eleanor interviews Beatrice Quill, who claims she was preparing dinner at the time of the murder. Captain Hale listens, his expression unreadable. The clock's timing becomes a focal point as they discuss the events leading up to the discovery.",
    "estimatedWordCount": 1600,
    "pivotElement": "Beatrice's statement about the clock's timing.",
    "factEstablished": "Establishes Beatrice's alibi, suggesting she was not near the clock at the time of the murder.",
    "permittedBehavioursByAct": [
      {
        "characterName": "Eleanor Voss",
        "behaviour": "Show normal social behaviour; grief or confusion if appropriate."
      },
      {
        "characterName": "Captain Ivor Hale",
        "behaviour": "Show normal social behaviour; grief or confusion if appropriate."
      },
      {
        "characterName": "Beatrice Quill",
        "behaviour": "Show normal social behaviour; grief or confusion if appropriate."
      }
    ],
    "redHerringPlacement": {
      "redHerringId": "rh_1",
      "placementDetail": "Beatrice mentions seeing Dr. Mallory Finch near the library just before the murder — seeds false inference about Finch's involvement."
    },
    "emotionalRegister": "Eleanor feels the weight of her responsibility as the investigation begins, torn between her public persona and private doubts.",
    "dominantCharacterNote": {
      "name": "Eleanor Voss",
      "voiceRegister": "Eleanor speaks with a measured cadence, often employing irony to highlight social absurdities."
    },
    "humourGuidance": {
      "permission": "conditional",
      "character": "Eleanor Voss",
      "form": "dry_wit"
    },
    "eraTextureNote": "Shortened daylight hours limiting outdoor activities.; Intermittent rain affecting travel and social gatherings.; Increased scrutiny on spending and social etiquette.",
    "locationRegisterNote": ""
  }
]
```

## Message 3 (role=user)

```text
BEFORE SUBMITTING YOUR JSON — verify this checklist:
□ Each chapter reaches the hard floor of 450 words and aims for 1250 words or more.
□ If you mention locked evidence, you used the exact locked phrase verbatim.
□ Allowed seasonal words only: autumn, autumnal, fall.
□ Forbidden seasonal words: spring, summer, winter.
□ Chapter 2: "Footprints in the dust lead away from the clock face." is placed in the first 25% of the chapter, followed by an explicit inference or suspicion paragraph.
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
Attempt 3/6 — chapters 2 — 1 validation issue(s) to resolve:

═══ PROSE QUALITY ERRORS (1) ═══
• Chapter 2 marked non-convergent after attempt 2/6: continuity

✓ SOLUTION: Vary paragraph lengths (short, medium, long)
✓ Include sensory details and atmospheric description
✓ Ensure each chapter has substance (3+ paragraphs minimum)

Return corrected JSON for chapters 2. Edit only the sections that failed — keep all content that passed validation, and return the complete updated chapter JSON.


RETRY CLASS: continuity
ATTEMPT: 2/6
MANDATORY FIXES:
- Resolve continuity issues before accepting this batch.
- Character "Captain Ivor Hale" has incorrect pronouns. Should use he/him/his but found: she, her
MITIGATION MODE: tighten_obligation
```
