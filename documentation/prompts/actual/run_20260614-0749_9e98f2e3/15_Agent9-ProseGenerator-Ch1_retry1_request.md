# Actual Prompt Record

- Run ID: `run_9e98f2e3-b11f-4ca1-8d65-a70edbc4c3be`
- Project ID: `proj_62757a44-1cc4-49b5-b5ea-3977dbd82113`
- Timestamp: `2026-06-14T07:54:03.883Z`
- Agent: `Agent9-ProseGenerator-Ch1`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4o-mini`
- Temperature: `0.42`
- Max Tokens: `4500`
- Attempt: `retry 1`
- Prompt Hash: `17208edab1d6e92d`

## Message 1 (role=system)

```text
You are an expert prose writer for classic mystery fiction. Your role is to write compelling, atmospheric narrative chapters that read like a professionally published novel.

⛔ ABSOLUTE RULE — CHARACTER NAMES:
The ONLY characters who exist in this story are: Laurence Chalcott (man), Patricia Corfield (woman), Julian Cromer (man), Wilfred Wellow (man), Joan Plowden (woman).
Do NOT invent, borrow, or introduce ANY character not on that list — no constables, no solicitors, no butlers, no servants, no shopkeepers, no bystanders with names.
Unnamed walk-ons ("a footman", "the postmistress", "an officer") are allowed ONLY if they never receive a name or title+surname combination.
⚠️ BEFORE YOU WRITE each chapter, ask yourself: "Does every person I name appear in this list: Laurence Chalcott, Patricia Corfield, Julian Cromer, Wilfred Wellow, Joan Plowden?" If not, remove them.
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
- MORAL COMPLEXITY REQUIREMENT: The mechanism of this crime carries a moral gray area: "While the murderer acted out of jealousy, the victim's previous cruel actions toward the murderer complicate the morality of the act." — the culprit reveal and denouement MUST acknowledge this ambiguity. Do not let the ending feel clean or simple. Give the reader at least one moment of uncomfortable sympathy or moral doubt.


⚠️ AMATEUR DETECTIVE STORY: The investigator is a civilian with no official standing. The official police (if they appear) are unnamed background figures only — "a constable", "the sergeant", "an officer from the village". Do NOT give any police official a name or title+surname combination. There is no Inspector [Surname], no Constable [Surname], no Sergeant [Surname] in this story.


CRITICAL CHARACTER CONSISTENCY RULES:

1. Each character has ONE canonical name. Use ONLY names from this list. Never vary, abbreviate, or add titles beyond what is listed.
   COMPLETE CAST (no other named characters exist): Laurence Chalcott, Patricia Corfield, Julian Cromer, Wilfred Wellow, Joan Plowden
   - "Mr. Jennings entered the room" → ILLEGAL. Jennings is not in the cast.
   - "Constable Reed took notes" → ILLEGAL. Reed is not in the cast.
   - "A constable took notes" → LEGAL (no name given).

2. Character roles are fixed:
   - Laurence Chalcott: Jilted Lover
   - Patricia Corfield: The Betrayed
   - Julian Cromer: The Ambitious
   - Wilfred Wellow: The Outsider
   - Joan Plowden: The Romantic Interest
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

- Wilfred Wellow
  Public identity anchor: Local Gardener; Business partner 
  Connection to victim: directly tied to the victim's social circle.
  Investigation relevance: access plausibility: high | alibi window: Claimed to be in the garden | opportunity channel: Garden entrance.
  Suspicion/pressure cue seed: Defensive during questioning.
  Investigator read: include one immediate observational inference (gesture, gaze target, pause, object grip), but do not state guilt as fact.

- Patricia Corfield
  Public identity anchor: Socialite; Fiancée 
  Connection to victim: directly tied to the victim's social circle.
  Investigation relevance: access plausibility: medium | alibi window: Present during the party | opportunity channel: Ballroom.
  Suspicion/pressure cue seed: Nervous during questioning.
  Investigator read: include one immediate observational inference (gesture, gaze target, pause, object grip), but do not state guilt as fact.

- Julian Cromer
  Public identity anchor: Wealthy Heir; Friend 
  Connection to victim: directly tied to the victim's social circle.
  Investigation relevance: access plausibility: high | alibi window: Seen at the party | opportunity channel: Garden.
  Suspicion/pressure cue seed: Too eager to provide alibi.
  Investigator read: include one immediate observational inference (gesture, gaze target, pause, object grip), but do not state guilt as fact.

WORLD DOCUMENT (use this as your primary creative context):

## Era: November 1938
In November 1938, life in Britain is marked by a sense of foreboding as the Great Depression lingers. The economic strain weighs heavily on families, with many struggling to make ends meet. Social gatherings are often tinged with tension, as the class divide becomes more pronounced amidst rising unemployment. The countryside, cloaked in overcast skies and sporadic rain, adds an air of melancholy to daily life. People cling to traditions, gathering for tea or storytelling by the fireplace, yet the specter of war looms on the horizon, heightening anxieties about the future.
Emotional register: A collective anxiety permeates society as the threat of conflict looms.
Physical constraints: Short daylight hours with twilight descending by four o'clock. | Overcast and chilly weather limiting outdoor activities. | Lack of modern communication limiting information exchange. | Petrol shortages affecting travel and movement.
Current tensions (weave into background texture): The fallout from the Munich Agreement affecting public sentiment. | Concerns over rising fascism in Europe. | Increased poverty due to the Great Depression.
Wartime context — Many men are preparing for potential enlistment as tensions rise in Europe.: The community is divided, with some supporting military actions while others voice pacifist sentiments. Absence effect: Families are bracing for the possibility of losing loved ones to war, creating an undercurrent of fear.

## Season Lock (mandatory — derived from November 1938)
Season: autumn. Allowed vocabulary: autumn, autumnal, fall
Forbidden seasonal words — never use in narration, dialogue, or metaphor: spring, summer, winter and their adjectival forms.
Every weather description, atmosphere, and time-of-year reference must be consistent with autumn.

## Story Theme
In a world overshadowed by economic despair, personal ambitions and secrets intertwine, revealing how desperation can lead to betrayal and murder, and reveals that evidence carries ethical weight, forcing characters to choose accountability over social performance when appearances and facts collide.

## Story Emotional Register
Dominant: A blend of tension and melancholy lingers throughout the narrative.

Arc:
The story begins in the opulent yet decaying Little Middleton Manor, where the atmosphere is thick with secrets and social masks. As the celebration of Laurence Chalcott's lavish party unfolds, the shocking discovery of his death sends ripples of unease throughout the gathering. Detective Joan Plowden is drawn into the investigation, uncovering the first clues amid the tension, each interaction revealing emotional costs and hidden agendas. The initial leads, however, lead to false assumptions, thickening the web of deception. A pivotal moment occurs when Joan discovers a stopped clock, indicating that the timeline of events is not as it seems, shifting the investigation's direction. As the pressure mounts, the revelation of Wilfred Wellow’s blackmail scheme emerges, recoloring earlier events with desperation and betrayal. The climax builds as Joan confronts Wilfred with the evidence, leading to a tense showdown that exposes the depth of human ambition and greed. In the resolution, the emotional fallout is palpable; characters must grapple with the consequences of their choices as the weight of their secrets comes to bear. The final scenes carry a somber tone, illustrating how the quest for security and status can lead to irrevocable loss.

The story opens: The atmosphere is rich with opulence, yet shadows of decay hint at underlying tensions. As the investigation takes shape: Unease grows as the investigation begins, revealing the characters' secrets. A first key turn arrives: The discovery of the stopped clock shifts the investigation's focus. At the mid-point of the story: A revelation about Wilfred’s motivations deepens the mystery and complicates relationships.

A second pivot reshapes the course: The confrontation reveals hidden depths of jealousy and desperation. As tension reaches its height: Tensions peak as the truth comes to light, leading to an inevitable confrontation. The climax brings the central question to a head: The.

## Emotional register at this point in the story
The atmosphere is rich with opulence, yet shadows of decay hint at underlying tensions.

## Character Portraits (appearance & era)

### Patricia Corfield
Patricia Corfield navigates the treacherous waters of love and financial insecurity, caught between her engagement to Julian and her past with Laurence. As a socialite, she feels the pressure of maintaining her status amidst economic downturns. Her secret financial struggles reflect the tension of the time, where appearances often mask deeper vulnerabilities.
Era intersection: Her need for security in a turbulent economy underscores the lengths to which individuals will go to protect their social standing.

### Julian Cromer
Julian Cromer represents the privileged heir facing the complexities of love and ambition. His engagement to Patricia is not only a matter of romance but also of social expectation. The economic strain of the era forces him to balance his desires against the reality of his family's wealth, leading to inner conflict and fear of exposure.
Era intersection: His affair with Joan juxtaposes the ideals of love against the harsh backdrop of economic pressures, highlighting the personal turmoil of individuals in this societal context.

### Wilfred Wellow
Wilfred Wellow, the local gardener, stands at the fringes of high society, embodying the struggles of the working class during the Great Depression. His blackmail of Julian for financial gain reflects the desperation many faced in this era. Wilfred's gruff exterior masks a complex character troubled by moral dilemmas, showcasing how economic strain can lead to morally ambiguous choices.
Era intersection: His actions reflect the harsh realities of class disparity and the lengths individuals will go to secure their livelihoods.

## Character Voices

### Patricia Corfield (she/her/her)
Patricia's soft, melodic tone is laced with subtle sarcasm, reflecting her complex emotions.
[comfortable] Oh darling, life is simply a series of delightful surprises, isn't it?
[evasive] Well, wouldn't you agree that some things are better left unsaid?
[stressed] I just can't bear the thought of losing everything I've worked so hard to achieve.
Humour: Her use of polite savagery often disarms those around her, hinting at her deeper struggles.

### Julian Cromer (he/him/his)
Julian's confident cadence reflects his upbringing, often accompanied by grand gestures that emphasize his points.
[comfortable] Isn't it simply splendid to be surrounded by such esteemed company?
[evasive] Ah, but isn't that a question for another time?
[stressed] I can't let this go on; I must take control before it's too late!
Humour: His sardonic remarks often mask the weight of his secrets.

### Wilfred Wellow (he/him/his)
Wilfred's speech is short and clipped, often revealing his gruff nature and sharp mind.
[comfortable] Gardening is simple—you plant, you tend, you reap what you sow.
[evasive] What’s it to you? Not my business to discuss others.
[stressed] Life’s tough; you either adapt or get left behind.
Humour: His deadpan humor cuts through the tension, often revealing deeper truths.

## Location Registers (scene framing guides)

Drawing Room: Within the drawing room, a palpable tension hangs in the air, punctuated by soft laughter that masks underlying secrets. The opulence of the space contrasts with the unease felt by its occupants, each glance and whispered conversation hinting at hidden motives.. Camera angle: Entering this space, the writer should capture the intricate dance of social facade and hidden agendas, reflecting the characters' inner struggles.. Era: The overcast weather adds a layer of gloom, enhancing the emotional weight of social interactions.

Library: The library feels heavy with the weight of untold stories and unspoken truths, where every dust-laden tome holds the potential for discovery. Shadows lurk in the corners, creating a sense of claustrophobia as characters grapple with their inner conflicts amidst the silence.. Camera angle: The writer should highlight the contrast between the rich history contained within these walls and the present tensions that threaten to unravel it.. Era: The dampness in the air brings a sense of claustrophobia, echoing the characters' emotional turmoil.

Servants' Hall: In the Servants' Hall, a sense of camaraderie mingles with the tension of class divides, where whispers of intrigue and laughter create an atmosphere charged with hidden knowledge. The simplicity of the space stands in stark contrast to the grandiosity of the manor, reminding characters of their place within the hierarchy.. Camera angle: The writer should focus on the vibrancy of the interactions, capturing the undercurrents of tension amidst the mundane.. Era: The modest furnishings reflect the economic struggles of the time, emphasizing the disparities between classes.

Gardens: The gardens exude a sense of melancholy, where overgrown hedges and wildflowers hide both beauty and secrets. The rustling leaves seem to whisper of past betrayals, creating a haunting backdrop for the characters' struggles, as the beauty of nature contrasts with the darkness of their actions.. Camera angle: The writer should evoke a sense of mystery and foreboding, highlighting the gardens as a space where hidden truths may emerge.. Era: The untamed landscape mirrors the chaotic emotions of the characters, reflecting the era's uncertainties.

## Humour guidance for this story position (opening)
Permission: forbidden
Rationale: The opening scene sets a tense atmosphere that is not conducive to humor.

FAIR-PLAY AND INFERENCE CONTRACT:
- FAIR PLAY CLUE TIMING: Never combine clue discovery and detective deduction in the same chapter. If a clue is first revealed to the reader in chapter N, the detective may only analyze, deduce from, or act on that clue in chapter N+1 or later.
- FAIR PLAY INFORMATION PARITY: The reader must see all clues BEFORE the detective uses them in reasoning. If the detective performs a test or makes a deduction, every piece of evidence supporting that conclusion must have been shown to the reader in earlier chapters.
- FAIR PLAY REVELATION SPACING: In the discriminating test scene, the detective can ONLY use clues that were revealed to the reader at least 1 full chapter earlier. Never introduce new clues or withheld information during the test.
- FAIR PLAY CONFRONTATION: During the final confrontation/revelation, the detective cannot surprise the reader with facts. Every piece of evidence cited must have been visible to the reader in prior chapters.
- Never solve by withheld information. Keep reader-information parity with detective reasoning.
- False assumption in force: Laurence Chalcott was alive until the party began.
- Hidden truth to progressively expose: The murder occurred earlier, and the clock's manipulation misled everyone.
- Inference path checkpoints to dramatize clearly (observation -> correction -> effect):
  - Step 1: obs: The clock in the study shows it stopped at ten minutes past eleven. | corr: This indicates the time of death may not align with when witnesses last saw Laurence. | effect: Narrows the window of opportunity for the murder, suggesting a timing discrepancy.
  - Step 2: obs: Witnesses claim they saw Laurence alive at eleven o'clock. | corr: This contradicts the clock's stopped time, indicating manipulation. | effect: Eliminates the assumption that Laurence was alive until the party began.
  - Step 3: obs: Footprints in the garden lead to the back entrance. | corr: This suggests someone used the entrance to leave after the murder. | effect: Narrows the suspect pool to those who had access to the garden.
- Discriminating test method: trap
- Discriminating test design constraint: A controlled comparison of witness statements and the clock's stopped time reveals the manipulation.
- Test must rely on already-shown clue IDs: clue_4, clue_1, clue_mechanism_visibility_core, clue_fp_contradiction_step_1
- Fair-play rationale: Step 1: The stopped clock (early) and witness reports (mid) let the reader deduce the timing discrepancy. Step 2: Footprint evidence (late) narrows access to the garden. Step 3: The discriminating test reveals the clock manipulation, confirming Wilfred's guilt.

## Character Reference

### Patricia Corfield (she/her — NEVER he/him)
Speaks in a soft, melodic tone, often lacing her sentences with subtle sarcasm
She enjoys employing clever turns of phrase to mask her true feelings.
Patricia is torn between her ambition and the guilt of her deception, knowing that her engagement to Julian is built on shaky foundations.

### Julian Cromer (he/him — NEVER she/her)
Speaks with a smooth, confident cadence, often punctuating his statements with a knowing smirk
He tends to use grand gestures when making a point, reflecting his wealthy upbringing.
Julian battles between his ambition to maintain his status and the guilt of his infidelity, aware that his choices may lead to his downfall.

### Wilfred Wellow (he/him — NEVER she/her)
Speaks in short, clipped sentences, often punctuated by a sardonic twist
He has a tendency to avoid small talk, preferring direct conversation.
Wilfred wrestles with the morality of his actions, knowing that his blackmail could ruin lives but feeling justified in his pursuit of financial stability.



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
A sprawling manor house that embodies the tension of class and economic strife, set against the backdrop of a remote countryside.

Key Locations Available:
- Drawing Room (interior): Social gathering space; potential clue discovery
- Library (interior): Restricted knowledge space; potential clue discovery
- Servants' Hall (interior): Staff gathering space; potential for overheard conversations
- Gardens (exterior): Outdoor space for recreation; potential hiding spots

Atmosphere (tonal cue only — do NOT reproduce this phrase verbatim in prose; translate into scene-specific, character-observed sensory language): Tense and suspenseful, heightened by the economic pressures of the era and underlying class tensions
Weather: Overcast with intermittent rain, typical of a British countryside in autumn

Era markers: Petrol-driven automobiles on winding country lanes | Typewriters for correspondence and communication | Early home telephones with limited range

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
  - Visual: gilded mirrors reflecting candlelight, richly patterned rugs on polished wood floors, dark oak furniture with intricate carvings
  - Sounds: crackling firewood, soft laughter echoing in the corners, the ticking of an ornate grandfather clock
  - Scents: smoky wood and burnt embers, dusty leather and old books, faint scent of lavender potpourri
  - Touch: plush velvet upholstery, cool marble mantelpiece

Library (interior):
  - Visual: dust motes floating in sunlight, leather-bound books with gilded spines, the imposing figure of a grandfather clock
  - Sounds: the soft rustle of turning pages, the ticking of the clock, the muted sound of rain against the window
  - Scents: musty paper and ink, scent of polished wood, tinge of damp from the rain
  - Touch: rough texture of old book spines, smooth surface of a polished table

Servants' Hall (interior):
  - Visual: faded wallpaper peeling at the edges, a clock ticking on the wall, scattered newspapers on the table
  - Sounds: clatter of dishes being washed, muffled conversations from the kitchen, the crackle of the fire
  - Scents: the aroma of cooking meals, scent of wood smoke, the mustiness of old furniture
  - Touch: rough wood of the table surface, cold iron of the fireplace grate

⛔ REFERENCE DATA — DO NOT TRANSCRIBE VERBATIM: The above profiles are structural guides only. Generate original prose that evokes these qualities; do not reproduce the exact phrasing or sentence structure of the profile paragraphs.

SCENE OPENING RULE: When opening a scene in a new location, write what the POV character directly observes and physically senses at that moment — not a general description of the room's qualities. The reader must feel present, not briefed. Sensory details must be observed by the character, not stated as fact about the place.

SENSORY WRITING TECHNIQUES:
- Opening paragraphs: Lead
[truncated for prompt budget]

## Texture Pool
Draw on these as opportunities arise — you are not required to use them.

- In November 1938, life in Britain is marked by a sense of foreboding as the Great Depression lingers
- The economic strain weighs heavily on families, with many struggling to make ends meet
- Social gatherings are often tinged with tension, as the class divide becomes more pronounced amidst rising unemployment
- The countryside, cloaked in overcast skies and sporadic rain, adds an air of melancholy to daily life
- People cling to traditions, gathering for tea or storytelling by the fireplace, yet the specter of war looms on the horizon, heightening anxieties about the future.

TEMPORAL CONTEXT:

This story takes place in November 1938 during N/A.

Seasonal Atmosphere:
- Weather patterns: overcast skies, intermittent rain, chilly winds
- Daylight: Short days with twilight descending by four o'clock, leaving the countryside cloaked in a heavy gloom.
- Seasonal activities: Preparing for Christmas shopping in local towns, Hunting parties in the countryside, Gathering around the fireplace for storytelling
- Seasonal occasions: Guy Fawkes Night (November 5)
- Season: N/A

Period Fashion (describe naturally):
- Men formal: tailored wool suits, double-breasted blazers, cravats or patterned ties
- Men casual: tweed jackets, corduroy trousers, wool sweaters
- Men accessories: flat caps, leather gloves, wristwatches
- Women formal: tea-length dresses with cinched waists, velvet evening gowns, feathered hats
- Women casual: tweed skirts, knitted cardigans, blouses with puffed sleeves
- Women accessories: pearls or beaded necklaces, gloves, stylish clutches

Cultural Context (reference naturally):
- Music/entertainment: The Andrews Sisters, Bing Crosby, Duke Ellington; Films: The Adventures of Robin Hood, Bringing Up Baby; Theatre: The Royal Family, The Front Page; Radio: The BBC Home Service, Variety Shows featuring popular music
- Typical prices: Loaf of bread: four pence, Cinema ticket: one shilling, Bottle of milk: five pence
- Current events: Continued tensions in Europe as Nazi Germany's aggression escalates; The Munich Agreement fallout affecting British politics
- Literature: The Maltese Falcon by Dashiell Hammett | Brave New World by Aldous Huxley | The Grapes of Wrath by John Steinbeck | [mystery and detective fiction] | [social commentary novels] | [sci-fi and dystopian literature]
- Technology: The first jet engine prototypes | Early models of television sets | Advancements in radio technology | Typewriters | Home telephones | Petrol-driven automobiles
- Daily life: Social gatherings for tea, Attending local fairs and markets, Participating in charitable events
- Social rituals: Hosting dinner parties with friends and family, Engaging in seasonal traditions like bonfire night, Writing and receiving letters as a primary form of communication

Atmospheric Details:
The scent of wet earth and fallen leaves fills the air as rain drizzles steadily, creating a somber backdrop for the estate. The flickering light of candles casts long shadows on the manor's walls, creating an atmosphere thick with anticipation and unease. Chilled air seeps through the cracks of the ancient manor, carrying whispers of tension as families gather for their evening meals, the clatter of cutlery punctuated by hushed conversations.

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
-
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

• [clue_1] The clock in the study shows it stopped at ten minutes past eleven.
  Category: temporal | Criticality: essential | Supports inference step 1
  Points to: This indicates the time of death may not align with when witnesses last saw Laurence.

• [clue_mechanism_visibility_core] A clock was wound back to create a false timeline of events, leading witnesses to believe Laurence was alive for longer than he actually was...
  Category: temporal | Criticality: essential | Supports inference step 1
  Points to: This reveals the mechanism of time manipulation.

For each clue above: an attentive reader should be able to find, record, and later use it to reason toward the solution.

═══ NARRATIVE STATE (read-only — do not contradict) ═══

LOCKED FACTS — use verbatim whenever this evidence is described:
  • The exact time shown on the stopped clock face: "ten minutes past eleven"
  • The exact amount the clock was wound back: "forty minutes"

CHARACTER PRONOUNS — never deviate from these:
  • Laurence Chalcott: he/him/his
  • Patricia Corfield: she/her/her
  • Julian Cromer: he/him/his
  • Wilfred Wellow: he/him/his
  • Joan Plowden: she/her/her

INVESTIGATION LOG — WHAT IS ESTABLISHED (do not re-establish, do not repeat):
• Suspects still unresolved: Patricia Corfield[SHE], Julian Cromer[HE]
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
Known location profile anchors: Little Middleton Manor, Drawing Room, Library, Servants' Hall, Gardens, the study of the Wellow residence
LOCATION NAME CAPITALISATION (HARD REQUIREMENT — validated):
All named locations in your prose MUST use the EXACT capitalisation from the CML profiles.
Canonical forms: "Little Middleton Manor", "Drawing Room", "Library", "Servants' Hall", "Gardens", "the study of the Wellow residence"
Writing a location in lowercase (e.g. "drawing room" instead of "Drawing Room") is a validated error. Every time you mention a named location, copy its capitalisation from the list above.
- Chapter 1: OPENING STYLE (HARD): Start the VERY FIRST SENTENCE with a named character performing a physical action or motion — e.g. "[Name] crossed the threshold…" / "[Name] set down the glass…" / "[Name] rose from the chair…". Anchor opening in "the study of the Wellow residence". HARD REQUIREMENT for the first 2 paragraphs: (a) include 2+ sensory words — choose from smell/scent/sound/echo/silence/creak/whisper/cold/warm/damp/rough/smooth/glow/shadow/flicker/dim — and (b) include 1+ atmosphere/time word — choose from rain/wind/fog/storm/mist/thunder/evening/morning/night/dawn/dusk/season/afternoon/midday/noon/midnight/twilight/sunrise/sunset/daylight/sunlight/overcast/cloudy/bright/dark. These are validated requirements, not style suggestions; missing them triggers a retry.

⛔ ABSOLUTE PRONOUN LOCK — NO EXCEPTIONS

The following pronouns are locked facts, on the same level as character names
and hard-logic device values. Using the wrong pronoun is a continuity error,
not a style choice.

Canonical pronoun table (subject / object / possessive / reflexive):
  • Laurence Chalcott: ALWAYS he/him/his/himself — NEVER she/her/herself
  • Patricia Corfield: ALWAYS she/her/her/herself — NEVER he/him/his/himself
  • Julian Cromer: ALWAYS he/him/his/himself — NEVER she/her/herself
  • Wilfred Wellow: ALWAYS he/him/his/himself — NEVER she/her/herself
  • Joan Plowden: ALWAYS she/her/her/herself — NEVER he/him/his/himself

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
   WRONG: "Patricia watched Chalcott; she crossed the room and he frowned." (ambiguous antecedent)
   RIGHT: "Patricia watched Chalcott; Chalcott crossed the room and Patricia frowned." (explicit)
9. In dialogue attribution, the pronoun refers to the SPEAKER — not the last character
   named inside the quoted spe
[truncated for prompt budget]

PROMPT BUDGET SUMMARY: budget=32000 tokens; fixed=6907; context=9872; dropped=[none]; truncated=[location_profiles, temporal_context, pronoun_accuracy]

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
4. Integrate at least two concrete era-grounded details per chapter from setting refinement signals: petrol-driven automobiles on winding country lanes | early home telephones with limited range | typewriters for correspondence | party-line telephone exchanges | telegrams sent from local offices | airmail services for urgent deliveries.
5. Respect setting movement/access constraints in scene action and alibis: narrow, winding access roads limiting vehicle movement | large, locked doors to private areas restricting access | gardens providing limited visibility for outside help | Restricted areas such as the library and servants' quarters | Scheduled access times for staff and guests.
6. Sustain social coherence with this backdrop pressure: An inheritance dispute amidst the Great Depression forces the privileged heirs and their staff into the isolated manor, where class tensions and economic strain heighten the stakes of their interactions.
7. Maintain continuity around these socially central cast anchors where relevant: Laurence Chalcott, Patricia Corfield, Julian Cromer, Wilfred Wellow, Joan Plowden.

CRITICAL PROSE REQUIREMENTS:

The CML specifies exact requirements for certain validation-critical scenes. You MUST include these elements at the specified positions.

**Discriminating Test Scene (Act 3, Scene 4):**
Required elements: Execute the discriminating test, Observe the clock's stopped time, Draw conclusion about Wilfred's alibi
Test type: clock manipulation reveal

**Suspect Clearance Scenes:**
- Patricia Corfield (Act 3, Scene 5): Confirmed alibi during the party
  Clues: witness statements about Patricia's location
- Julian Cromer (Act 3, Scene 5): Witnesses confirm his presence at the party
  Clues: witness statements from party attendees

**Culprit Revelation Scene (Act 3, Scene 6):**
Method: Confrontation with evidence of clock manipulation

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
Suspect pressure target(s): Wilfred Wellow, Patricia Corfield, Julian Cromer
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
  - VICTIM IDENTITY LOCK (MANDATORY): name the victim as "Laurence Chalcott" in the discovery scene. After first mention, do not use unnamed placeholders such as "the victim" without naming Laurence Chalcott in the same paragraph.
  - Opening: Begin with a character action, spoken line, or clock/time marker — never a location name or location-description phrase.
  - Scene is set in: the study of the Wellow residence — reference it naturally within the paragraph, never as your opening phrase.
  - Opening atmosphere (MANDATORY — validator enforced): the first paragraph MUST contain at least one of: rain / wind / fog / storm / mist / thunder / evening / morning / night / dawn / dusk / season / afternoon / midday / noon / midnight / twilight / sunrise / sunset / daylight / sunlight / overcast / cloudy / bright / dark / grey / pale / cold / warm / chill / crisp / damp / drizzle / haze / lamplight / firelight. A chapter that omits all of these from its opening paragraph will be rejected.
  - PARAGRAPH OPENER DIVERSITY (MANDATORY — validator enforced): No more than 2 paragraphs in this chapter may begin with "Joan" or "Joan's" as the first word. You must vary paragraph openings throughout: use sensory observations, another character's name or action, dialogue, object or sound details, or temporal markers. Opening 3 or more paragraphs with "Joan" will cause automated rejection.
  - INVESTIGATOR ESTABLISHMENT REQUIRED: Joan Plowden must claim or be recognised as the investigator in this chapter. Establish Joan Plowden as the detective-in-charge within the first two paragraphs — Joan Plowden IS the investigator. Do NOT have any character suggest a "real" detective is still coming, or imply that authority has not yet been delegated. Joan Plowden begins the investigation in this chapter.
  - ⛔ BODY DISCOVERY ORDER (MANDATORY — Chapter 1 only): the victim's body must be physically encountered or described within the first TWO paragraphs. Do NOT spend the opening paragraphs solely on clock examination, atmospheric setup, or character introductions before the body is found. Required Chapter 1 structure: atmosphere (one sentence max) → body/discovery → investigator reaction → suspects → first time-source contradiction.
  - ⛔ MECHANISM SPOILER BAN (Chapters 1–2): Do NOT state how the crime device was manipulated — not the direction, not the magnitude, not who performed it. Characters may only observe that two sources of evidence disagree. The specific method, tamper amount, and perpetrator's action are ALL FORBIDDEN until Chapter 3. WRONG: "The culprit had altered the device by forty minutes to create a false alibi." RIGHT: "Two independent pieces of evidence gave contradictory readings — a discrepancy neither could yet explain."
  - CLUE OBLIGATIONS — mandatory prose elements (do NOT omit or bury):
    • A clock was wound back to create a false timeline of events, leading witnesses to believe Laurence was alive for longer than he actually was... [clue_mechanism_visibility_core] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: This reveals the mechanism of time manipulation.
      ↳ MANDATORY TWO-PARAGRAPH STRUCTURE (must appear in paragraphs 1 or 2 — no later):
         Paragraph 1: The POV character physically approaches or directly observes this evidence.
           The narration or dialogue explicitly states what is seen (use the exact locked phrase if one applies).
         Paragraph 2 (immediately following): The detective or POV character explicitly reasons
           about what this evidence implies — who it implicates, why it may be unreliable,
           or what inference it supports. This must be a separate full paragraph, not a sentence appended to Paragraph 1.
    • The clock in the study shows it stopped at ten minutes past eleven. [clue_1] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: This indicates the time of death may not align with when witnesses last saw Laurence.
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
  - ALIBI LOCK: Wilfred Wellow's established alibi is "Claimed to be in the garden". Do NOT place Wilfred Wellow at any other location or in any other activity during the crime window. Any contradiction is a continuity error that triggers a retry.
- Locked fact phrase obligations:
  - If this batch mentions The exact time shown on the stopped clock face, write exactly: "ten minutes past eleven".
  - If this batch mentions The exact amount the clock was wound back, write exactly: "forty minutes".
- Seasonal vocabulary allow-list: autumn, autumnal, fall.
- Forbidden seasonal words: spring, summer, winter.

⛔ PRONOUN TABLE — re-check after EVERY paragraph before writing the next:
    Laurence Chalcott: he/him/his
    Patricia Corfield: she/her/her
    Julian Cromer: he/him/his
    Wilfred Wellow: he/him/his
    Joan Plowden: she/her/her
  Any sentence containing a pronoun must agree with this table. Correct mismatches before moving on.

## CHAPTER OUTCOME CONTRACT (MANDATORY)
Batch chapters: 1-1.
Investigation state at start: 0 clue(s) revealed to reader; approximately 2 unresolved suspect(s).
Must change by end: Introduce cast relevance and plant first clue while keeping culprit unresolved.
Suspect pressure target(s): Wilfred Wellow, Patricia Corfield, Julian Cromer
Required new information: First clue observation tied to suspect landscape.
Forbidden reveals at this stage: No culprit reveal. | No full murder mechanism explanation. | Do not state the direction, magnitude, or agent of any clock or device tampering. Characters may only observe that two time sources disagree. "The clock was wound back by forty minutes" must not appear before Chapter 3.

FROZEN FACT STATE (DO NOT ALTER):
- Timeline anchor: November (autumn).
- Month, season, weather, and time-of-year language in this batch must stay compatible with autumn.
- Established timeline fact: Clock stopped at ten minutes past eleven
- Established timeline fact: Party began at eleven
- If referenced, use exact phrase: "ten minutes past eleven" (The exact time shown on the stopped clock face).
- If referenced, use exact phrase: "forty minutes" (The exact amount the clock was wound back).

STORY TO DATE (REFERENCE ONLY — DO NOT COPY VERBATIM):
- No previous chapter text exists yet for this batch.

# Case Overview
Title: The Echoes of Time
Era: 1930s
Setting: Little Middleton
Crime: murder (poisoning)
Culprit: Wilfred Wellow
False assumption: Laurence Chalcott was alive until the party began.
Cast: Laurence Chalcott (he/him), Patricia Corfield (she/her), Julian Cromer (he/him), Wilfred Wellow (he/him), Joan Plowden (she/her)

Setting Lock: Keep all scenes and descriptions consistent with the stated setting (Little Middleton). Do not introduce a different location type. Do not invent an alternative estate name. The only permitted name for this property is "Little Middleton" — any other estate name (e.g., "Caldwell Manor", "Ashwood Hall", or any invented proper name) is a continuity error that will be caught and rejected.

⛔ PRONOUN LOCK (verify every sentence before writing):
• Laurence Chalcott — he/him/his (NEVER she/her)
• Patricia Corfield — she/her/her (NEVER he/him)
• Julian Cromer — he/him/his (NEVER she/her)
• Wilfred Wellow — he/him/his (NEVER she/her)
• Joan Plowden — she/her/her (NEVER he/him)

Outline scenes:
[
  {
    "sceneNumber": 1,
    "act": 1,
    "title": "Discovery",
    "setting": {
      "location": "the study of the Wellow residence",
      "timeOfDay": "Morning after the murder",
      "atmosphere": "Tense household awaiting the detective's arrival"
    },
    "characters": [
      "Wilfred Wellow",
      "Patricia Corfield",
      "Julian Cromer"
    ],
    "purpose": "Introduce the crime and detective",
    "cluesRevealed": [
      "clue_1",
      "clue_mechanism_visibility_core"
    ],
    "dramaticElements": {
      "conflict": "Initial shock among the guests as the body is discovered.",
      "tension": "Whispers of suspicion fill the air.",
      "microMomentBeats": [
        "Patricia's hand trembles as she clutches a handkerchief."
      ]
    },
    "summary": "In the dimly lit study of the Wellow residence, the atmosphere is thick with apprehension as guests gather. The body of Laurence Chalcott is found slumped over the desk, a glass of poisoned whiskey nearby. Wilfred, Patricia, and Julian stand frozen in shock, their eyes darting between the body and each other, as the first signs of suspicion begin to rise.",
    "estimatedWordCount": 1250,
    "emotionalRegister": "The atmosphere is rich with opulence, yet shadows of decay hint at underlying tensions.",
    "dominantCharacterNote": {
      "name": "Patricia Corfield",
      "voiceRegister": "Patricia's soft, melodic tone is laced with subtle sarcasm, reflecting her complex emotions."
    },
    "humourGuidance": {
      "permission": "forbidden"
    },
    "eraTextureNote": "Short daylight hours with twilight descending by four o'clock.; Overcast and chilly weather limiting outdoor activities.; Lack of modern communication limiting information exchange.; Petrol shortages affecting travel and movement.",
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
□ Chapter 1: "A clock was wound back to create a false timeline of events, leading witnesses to believe Laurence was alive for longer than he actually was..." is placed in the first 25% of the chapter, followed by an explicit inference or suspicion paragraph.
□ Chapter 1: "The clock in the study shows it stopped at ten minutes past eleven." is placed in the first 25% of the chapter, followed by an explicit inference or suspicion paragraph.
□ Mode check (Discovery/Opening): victim is explicitly named and major suspects are introduced before deep mechanism explanation.
□ Mode check (Discovery/Opening): no culprit reveal and no full murder mechanism explanation.
□ PRONOUN AUDIT — for every character you named in your chapters, list the pronouns you actually used, then verify against the canonical table. Correct any mismatch before outputting. Do NOT include this audit in your JSON output.
  Character            | Canonical     | Used in draft | Match?
  ---------------------|---------------|---------------|-------
  Laurence Chalcott    | he/him/his/himself        | [fill in]     | [yes/no]
  Patricia Corfield    | she/her/her/herself       | [fill in]     | [yes/no]
  Julian Cromer        | he/him/his/himself        | [fill in]     | [yes/no]
  Wilfred Wellow       | he/him/his/himself        | [fill in]     | [yes/no]
  Joan Plowden         | she/her/her/herself       | [fill in]     | [yes/no]
□ Return valid JSON only.
```

## Message 4 (role=user)

```text
SINGLE-PASS RETRY CONTRACT
Goal: resolve every listed issue for chapter(s) 1 in this one retry.
Retry mode: TARGETED_REBUILD.
Attempt context: 2/6 | primary class: template | subcode: template_bleed_openers.
Why this mode: template failure detected; prior wording is likely harmful anchor.

SOURCE OF TRUTH
- Do not preserve sentence structure from the failed draft; use the scene instructions and hard constraints as the source of truth.
- Hard constraints outrank the previous draft: cast/pronoun lock, locked facts, clue obligations, stage-mode rules, and chapter JSON shape.

PRIMARY FAILURES
- Template linter: repeated content opener detected ("joan noted"). Avoid reusing the same meaningful opener phrase, and avoid starting 3+ paragraphs with the same meaningful first word.

REWRITE PLAN
- Treat the scene instructions, cast lock, clue obligations, and locked facts as the source of truth; do not preserve failing wording from the previous draft.
- Rewrite any paragraph touched by a failing issue as a fresh paragraph rather than patching a single sentence.
- Replace the repeated opener pattern "joan noted" with distinct paragraph openings from different angles: sensory detail, object, movement, thought, or another speaker.

SUCCESS CHECKLIST
- Every listed issue below is resolved in this single attempt before you answer.
- No more than two paragraphs begin with the repeated opener pattern related to "joan noted".
- Primary failure class cleared: template / template_bleed_openers.
- The revised chapter reads as a clean rewrite of the failing parts, not a lightly patched copy of the rejected draft.

OUTPUT RULES
- Return complete corrected JSON for chapter(s) 1 only.
- Do not explain what you changed.
- Do not leave one issue unresolved while fixing another.
- If two instructions conflict, prefer the one that clears the validator and preserves story logic.

RETRY PHASE: 2 of 2 — QUALITY POLISH ONLY
Logic and contract requirements are already satisfied. This attempt fixes style/quality issues only.
REGRESSION GUARD: You must not introduce any new logic failures while fixing quality issues.
Specifically, do not alter: discriminating test logic, clue evidence sentences, character names or pronouns, alibi claims, or stage-mode outcomes.
If fixing a quality issue would require touching logic-sensitive text, rephrase the surrounding prose instead.

Attempt 2/6 — chapters 1 — 1 validation issue(s) to resolve:

═══ TEMPLATE LEAKAGE ERRORS (1) ═══
• Template linter: repeated content opener detected ("joan noted"). Avoid reusing the same meaningful opener phrase, and avoid starting 3+ paragraphs with the same meaningful first word.

⛔ REPEATED PARAGRAPH OPENER — too many paragraphs in this chapter begin with "Joan".
  The automated validator rejected this chapter because "Joan" appears as the opening word of 3 or more paragraphs, or the same two-word opener (e.g. "joan noted") appears more than once.
  You MUST rewrite the chapter so that no more than 2 paragraphs begin with "Joan".
  Vary your paragraph openings by using:
    - a sensory detail (sound, smell, temperature, quality of light)
    - another character's name, action, or spoken words
    - an object, physical element, or environmental detail
    - a temporal or spatial marker ("A moment later...", "In the far corner...", "By the time...")
    - an interior thought or realisation that does NOT lead with Joan's name
  Each paragraph must open from a genuinely different angle. "Joan" must not begin more than 2 paragraphs in the entire chapter.

Return corrected JSON for chapters 1. Edit only the sections that failed — keep all content that passed validation, and return the complete updated chapter JSON.


RETRY CLASS: template
RETRY SUBCODE: template_bleed_openers
ATTEMPT: 1/6
OFFENDING TEXT: joan noted
MANDATORY FIXES:
- Resolve template issues before accepting this batch.
- Template linter: repeated content opener detected ("joan noted"). Avoid reusing the same meaningful opener phrase, and avoid starting 3+ paragraphs with the same meaningful first word.
```
