# Actual Prompt Record

- Run ID: `run_f5a57100-564b-48db-92cf-58fc2c635238`
- Project ID: `proj_0678f676-ff32-4b36-8855-cbb3435c5e8b`
- Timestamp: `2026-05-29T21:25:59.354Z`
- Agent: `Agent9-ProseGenerator-Ch3`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4.1-mini`
- Temperature: `0.42`
- Max Tokens: `4500`
- Attempt: `first`
- Prompt Hash: `2ae7e859f767cbc7`

## Message 1 (role=system)

```text
You are an expert prose writer for classic mystery fiction. Your role is to write compelling, atmospheric narrative chapters that read like a professionally published novel.

⛔ ABSOLUTE RULE — CHARACTER NAMES:
The ONLY characters who exist in this story are: Robert Quincy (man), Michael Brabazon (man), Frederick Rochford (man), Antoinette Mandeville (woman), Janet Warenne (woman).
Do NOT invent, borrow, or introduce ANY character not on that list — no constables, no solicitors, no butlers, no servants, no shopkeepers, no bystanders with names.
Unnamed walk-ons ("a footman", "the postmistress", "an officer") are allowed ONLY if they never receive a name or title+surname combination.
⚠️ BEFORE YOU WRITE each chapter, ask yourself: "Does every person I name appear in this list: Robert Quincy, Michael Brabazon, Frederick Rochford, Antoinette Mandeville, Janet Warenne?" If not, remove them.
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
- MORAL COMPLEXITY REQUIREMENT: The mechanism of this crime carries a moral gray area: "The culprit altered time to protect a loved one from a corrupt hotel management figure, blurring lines between justice and crime." — the culprit reveal and denouement MUST acknowledge this ambiguity. Do not let the ending feel clean or simple. Give the reader at least one moment of uncomfortable sympathy or moral doubt.



CRITICAL CHARACTER CONSISTENCY RULES:

1. Each character has ONE canonical name. Use ONLY names from this list. Never vary, abbreviate, or add titles beyond what is listed.
   COMPLETE CAST (no other named characters exist): Robert Quincy, Michael Brabazon, Frederick Rochford, Antoinette Mandeville, Janet Warenne
   - "Mr. Jennings entered the room" → ILLEGAL. Jennings is not in the cast.
   - "Constable Reed took notes" → ILLEGAL. Reed is not in the cast.
   - "A constable took notes" → LEGAL (no name given).

2. Character roles are fixed:
   - Robert Quincy: Primary Suspect / Heir
   - Michael Brabazon: Secondary Suspect / Social Climber
   - Frederick Rochford: Red Herring / Protector
   - Antoinette Mandeville: Secondary Suspect / Opportunist
   - Janet Warenne: Police Detective / Inspector
   - Never place characters in locations inconsistent with their role

WORLD DOCUMENT (use this as your primary creative context):

## Era: 1952-12
December 1952 at the seaside hotel is a world steeped in shadow and fog, both literal and figurative. The short winter days leave long, chilling evenings where guests gather around black-and-white television sets, watching news of international tensions and the Korean armistice talks. The sea fog rolls in thick from the North Sea, muffling sounds and blurring the sharp lines of the hotel’s modernist Art Deco design. Guests and staff alike move through the dim corridors with a mixture of polite reserve and underlying unease, shaped by the pervasive Cold War paranoia that colors every interaction. Fashion reflects a cautious optimism, with men in tailored wool suits and women in elegant coats trimmed with fur, all maintaining strict social codes of behavior that emphasize discretion and decorum. The hotel is a microcosm of post-war Britain, where economic recovery and social stratification coexist amid the ever-present fear of espionage and distrust. Within this misty, claustrophobic environment, even the ticking of clocks and the timing of greetings carry weighty significance.
Emotional register: A pervasive atmosphere of suspicion and anxiety tinged with the weight of social expectation and political paranoia.
Physical constraints: No digital communications; reliance on mechanical clocks and rotary telephones | Limited transport options amplified by fog and winter weather delays | Restricted access within the hotel controlled by reception and staff | Sound propagation altered by thick sea fog muffling distant noises
Current tensions (weave into background texture): Heightened Cold War fears and government vigilance against communist infiltration | Ongoing Korean War armistice negotiations creating uncertainty | Economic austerity slowly easing but with lingering social disparities
Wartime context — Active military service is winding down but veterans and retired officers remain influential in society.: Respect for military discipline and hierarchy permeates social interactions, especially among older generations and family circles. Absence effect: Many families still bear the emotional scars of war, influencing personal relationships and trust.

## Story Theme
This story explores how fragile appearances and manipulated truths can entangle individuals in a web of suspicion, revealing the corrosive effects of secrets and desperation under social and political pressures.

## Story Emotional Register
Dominant: The emotional tone is one of mounting claustrophobia and tension, underscored by despair and the relentless pursuit of truth amidst deceptive calm.

Arc:
The story opens enveloped in a foggy, claustrophobic atmosphere where the discovery of a murder at the Cliffhaven Hotel casts a long shadow over its guests and staff. The chilly dampness and muted sounds of the seaside setting mirror the unease that settles over the hotel, as the initial shock reverberates through the social fabric, heightening suspicions and guarded interactions. Early investigation reveals subtle clues—misaligned clock hands, scratch marks on the winding keyhole, and the perplexing report of double chimes—seeding doubt about accepted timelines and promising a complex puzzle.

As Detective Janet Warenne probes deeper, the seemingly airtight alibi of Robert Quincy begins to unravel, creating a rising tension that is both intellectual and emotional. The guests’ facades crack under scrutiny, revealing nervous glances and evasive answers that amplify the claustrophobic mood. The emotional cost is felt keenly as personal stakes emerge: Robert’s desperation to protect his family legacy, Michael’s fear of social ruin, and Antoinette’s precarious social standing. The emotional weight grows heavier as the investigation confronts entrenched loyalties and simmering resentments.

A pivotal moment arises when the victim’s stopped wristwatch contradicts the lobby clock’s displayed time, prompting Janet to reconsider the entire timeline. This revelation casts earlier events in a new light, transforming the understanding of opportunity and motive. The emotional atmosphere shifts from confusion to sharp focus, as the detective’s methodical unpicking of the manipulated clock time exposes the fragile nature of perceived truth.

The second turn intensifies the story’s emotional complexity, as physical evidence such as elevator logs and receptionist records coalesce to implicate Robert Quincy. The realization that the murder occurred earlier than believed not only shatters alibis but deepens the emotional stakes, forcing characters to confront betrayal and desperation. The claustrophobia tightens, with the hotel’s corridors and locked doors echoing the tightening noose of.

## Emotional register at this point in the story
Subtle clues raise unease and suspicion, deepening the mystery and emotional stakes.

## Character Portraits (appearance & era)

### Michael Brabazon
Michael represents the ambitious middle-class striving to ascend within a rigid social hierarchy. His polished professionalism masks deep-seated resentment and insecurity rooted in class divisions that remain entrenched despite post-war changes. The hotel’s social microcosm amplifies his fears of displacement and failure, reflecting broader societal tensions between tradition and upward mobility.
Era intersection: Michael’s internal conflict between ambition and conscience is shaped by the era’s class consciousness and the precariousness of social advancement during economic recovery.

### Frederick Rochford
Frederick is the embodiment of a fading military order, his stoicism and clipped speech echoing a generation defined by war and duty. His role as protector and reluctant keeper of family secrets situates him at the intersection of personal loyalty and societal expectation. In a time when military prestige still commands respect, his presence adds a weight of authority and moral complexity to the hotel’s social fabric.
Era intersection: Frederick’s burden of silence and protection reflects the era’s lingering wartime loyalties and the struggle to reconcile past conflicts with present realities.

### Antoinette Mandeville
Antoinette navigates the shifting roles of women in post-war Britain with grace and guarded ambition. Her charm and poise mask a vulnerable position threatened by financial insecurity and social exclusion. In a society where women’s independence is cautiously emerging but still constrained by traditional expectations, her secret affair and desperate hopes highlight the precarious balance between survival and social acceptance.
Era intersection: Her personal stakes in the victim’s favor and social standing reflect the gender norms and subtle shifts in female agency characteristic of early 1950s Britain.

### Janet Warenne
Janet Warenne exemplifies the emerging modern woman in law enforcement, combining methodical professionalism with a quiet determination to uphold justice amid political pressures. Her precise demeanor and dry wit serve as tools to navigate a male-dominated environment and a case fraught with social sensitivities. Janet’s role reflects the gradual expansion of women’s roles in public service during the post-war period.
Era intersection: Janet’s investigative struggles and ethical dilemmas are shaped by the era’s gender expectations and the tense political climate demanding swift resolutions.

## Character Voices

### Michael Brabazon (he/him/his)
Quick, clipped speech peppered with managerial jargon and sharp observations on class and ambition.
[comfortable] Efficiency is the backbone of this establishment; without it, we are adrift in chaos.
[evasive] Well, I was occupied supervising preparations in the kitchen, as I always am at this hour.
[stressed] Look, I assure you I had no reason to be anywhere near the victim’s quarters at that time.
Humour: His humour is dry and observational, often laced with sardonic commentary on social dynamics.

### Frederick Rochford (he/him/his)
Gravelly, clipped military tone with a restrained, self-deprecating wit.
[comfortable] Duty calls for patience, though I admit it is wearing thin these days.
[evasive] I was in the maintenance area, yes, but details beyond that are best left to records and logs.
[stressed] I do not appreciate insinuations, especially when I was dining publicly at the time in question.
Humour: His humour is dry and self-mocking, often undercutting serious moments with wry comments.

### Antoinette Mandeville (she/her/her)
Refined and measured with a smooth, slightly theatrical tone, employing subtle barbs wrapped in compliments.
[comfortable] One must always present oneself with grace, even when the winds of fortune shift unexpectedly.
[evasive] I was in my room, alone, as I have mentioned. There is no need to speculate further.
[stressed] You misunderstand; my intentions are quite straightforward, despite appearances.
Humour: Her humour is polite savagery, mixing charm with cutting wit to disarm and manipulate.

### Janet Warenne (she/her/her)
Clipped, precise, calm tone with occasional dry, understated humour to defuse tension.
[comfortable] Let us focus on the facts and not be swayed by conjecture or theatrics.
[evasive] Some details remain classified until further investigation, but rest assured, no stone will be left unturned.
[stressed] The timeline is inconsistent. We must reconsider what we believed to be certain.
Humour: Her dry wit serves as a subtle tool to maintain control and ease tension.

## Location Registers (scene framing guides)

Guest Room 312: This confined room feels heavy with silence and unresolved tension; its dim light and muted sounds create a claustrophobic space that holds the story’s darkest secret.. Camera angle: Approach the room as a shrine of interrupted life, where every detail is charged with meaning and silent accusation.. Era: Access strictly controlled due to police investigation protocols of the 1950s.

Grand Lobby: The lobby is a polished social stage where appearances are carefully maintained, but under the veneer lies a charged atmosphere of tension and suspicion heightened by Cold War scrutiny.. Camera angle: Enter with a sense of watching a tense performance, where every gesture and glance may conceal a secret.. Era: No digital clocks; mechanical timekeeping dominates, making the lobby clock a critical temporal anchor.

Staff Kitchen and Service Corridor: A utilitarian, bustling space contrasting with guest areas, filled with sounds and smells that evoke the hotel’s hidden rhythms and the working-class backdrop to the story.. Camera angle: Observe as a functional realm where unseen movements and whispered exchanges set the stage for intrigue.. Era: Strictly off-limits to guests, reflecting rigid staff-guest social divides of the time.

Sea-facing Terrace: An open yet isolated space where the relentless sea and fog create a mood of melancholy and contemplation, juxtaposing the hotel’s enclosed tensions with elemental vastness.. Camera angle: View as a liminal space between the known and the unknown, where secrets might be exchanged beneath the shifting skies.. Era: Access limited by weather and time, reinforcing the hotel’s sense of being an island in fog and circumstance.

## Humour guidance for this story position (early)
Permission: conditional — condition: Only subtle, understated wit from characters with dry humour styles is permitted to relieve tension without diminishing seriousness.
Characters who may be funny: Janet Warenne, Michael Brabazon
Permitted forms: dry wit, observational sardonic comments
Rationale: Early investigative scenes benefit from light relief to balance tension, but humour must be carefully restrained.

## Reveal Groundwork (texture — do not explain, only plant)
- Plant one subtle observable beat related to: "Plant one subtle anomaly that can be re-read after the resolution.". Do not explain significance yet.
- Plant one subtle observable beat related to: "It casts the witnesses’ reports of the double quarter-to-eleven chimes in a new light, revealing that their confusion was a key signal of deception". Do not explain significance yet.
- Plant one subtle observable beat related to: "Finally, the receptionist’s log anomaly, initially a minor irregularity, retroactively exposes how Robert Quincy manipulated perceptions to fabricate his alibi, turning what seemed routine into a critical piece of evidence". Do not explain significance yet.

FAIR-PLAY AND INFERENCE CONTRACT:
- FAIR PLAY CLUE TIMING: Never combine clue discovery and detective deduction in the same chapter. If a clue is first revealed to the reader in chapter N, the detective may only analyze, deduce from, or act on that clue in chapter N+1 or later.
- FAIR PLAY INFORMATION PARITY: The reader must see all clues BEFORE the detective uses them in reasoning. If the detective performs a test or makes a deduction, every piece of evidence supporting that conclusion must have been shown to the reader in earlier chapters.
- FAIR PLAY REVELATION SPACING: In the discriminating test scene, the detective can ONLY use clues that were revealed to the reader at least 1 full chapter earlier. Never introduce new clues or withheld information during the test.
- FAIR PLAY CONFRONTATION: During the final confrontation/revelation, the detective cannot surprise the reader with facts. Every piece of evidence cited must have been visible to the reader in prior chapters.
- Never solve by withheld information. Keep reader-information parity with detective reasoning.
- False assumption in force: The murder occurred exactly at the time shown by the stopped lobby clock, approximately ten minutes past eleven.
- Hidden truth to progressively expose: The clock was manually wound backward after being stopped, shifting the apparent time backwards by forty minutes and concealing the actual earlier murder time.
- Inference path checkpoints to dramatize clearly (observation -> correction -> effect):
  - Step 1: obs: The minute hand of the lobby clock is slightly misaligned with the hour markers, and scratches are found on the clock’s winding keyhole. | corr: These physical signs indicate manual interference with the lobby clock, consistent with it being wound back after stopping. | effect: Narrows the timeline of clock tampering to shortly before or after the murder, implicating suspects with access to the clock.
  - Step 2: obs: Witnesses report hearing the lobby clock chime a quarter to eleven twice on the morning of the murder. | corr: This is impossible if the clock was running correctly; it suggests the clock’s hour hand was manipulated to chime twice at the same hour, supporting the backward winding hypothesis. | effect: Eliminates suspects without opportunity to access the clock during morning hours, strengthening suspicion on those with lobby access.
  - Step 3: obs: Victim’s stopped wristwatch shows twenty minutes past eleven, conflicting with the lobby clock’s displayed time of ten minutes past eleven. | corr: The victim died closer to the wristwatch time, indicating the murder occurred earlier than the lobby clock’s apparent time, proving the alibi based on the lobby clock is false. | effect: Eliminates suspects whose alibis depend on the lobby clock’s false time, specifically Robert Quincy.
  - Step 4: obs: Elevator maintenance logs record a two-minute door delay after signal, and smudges are found on the elevator call button on the victim’s floor. | corr: This timing and physical trace show the elevator could be used to move unnoticed to the victim’s floor during the time window before the false lobby clock time, providing access opportunity. | effect: Narrows opportunity to suspects familiar with hotel elevator timings and maintenance, notably Robert Quincy and Frederick Rochford.
- Discriminating test method: trap
- Discriminating test design constraint: A controlled comparison between the lobby clock’s winding mechanism and the victim’s wristwatch is conducted simultaneously with a timed guest greeting reenactment using the receptionist’s log. The double chime on the lobby clock and the misaligned minute hand prove the clock was wound backward, while the victim’s watch time confirms the actual time of death. The receptionist’s log anomaly further shows that Robert Quincy’s lobby presence was shifted to create a false alibi. Together, these prove the murder occurred earlier than the lobby clock suggests, exposing Robert Quincy’s guilt.
- Test must rely on already-shown clue IDs: clue_11, clue_6, clue_5
- Fair-play rationale: Step 1: Physical clock evidence (minute hand misalignment, winding scratches) and stopped lobby clock time provide early clues of tampering. Step 2: Witnesses’ double chime reports and receptionist logs reveal the false timeline. Step 3: Contradiction between victim’
[truncated for prompt budget]

## Character Reference

### Michael Brabazon (he/him — NEVER she/her)
Speaks with brisk, clipped sentences
frequently uses managerial jargon
peppered with sardonic asides about class and ambition
his laughter is sharp and sometimes a little forced, revealing underlying tension.
Michael struggles with the tension between his ruthless ambition and a lingering conscience that questions the price of his social climb. He fears losing not just his job but the fragile respectability he has carved out.

### Frederick Rochford (he/him — NEVER she/her)
Speaks in a low, gravelly tone with clipped military precision
often uses dry, self-mocking humour
tends to be reserved but occasionally lets slip blunt comments that reveal a wry outlook on life and duty.
Frederick wrestles with the burden of his silence, torn between loyalty to the family and the moral weight of hidden truths that, if revealed, could destroy them all.

### Antoinette Mandeville (she/her — NEVER he/him)
Speaks with refined elegance, often employing subtle barbs wrapped in compliments
her tone is smooth and measured, with a hint of theatricality
uses wit to disarm and manipulate social situations.
Antoinette is torn between loyalty to the man she loved and the ruthless instinct for self-preservation that urges her to secure her place by any means necessary.

### Janet Warenne (she/her — NEVER he/him)
Speaks with clipped clarity and a calm, measured tone
uses precise vocabulary and occasionally employs dry, understated humour to defuse tension
rarely raised voice but sharp and commanding when necessary.
Janet struggles with the tension between following orders to expedite the investigation and her personal commitment to uncovering the full truth, regardless of inconvenient consequences.



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
ERA AUTHENTICITY (1950s):

1. FORBIDDEN terms (did not exist):
   ❌ cell phone, internet, email, computer, GPS, digital camera, text message, app, online

2. REQUIRED period markers (include 2+ per scene):
   ✓ Formal address: Mr./Mrs./Miss/Dr./Sir/Lady
   ✓ Period technology: telephone, telegram, radio, typewriter
   ✓ Fashion: gloves, hats, formal suits, stockings

3. Use period-authentic language and social norms

LOCATION PROFILES:

You have rich location profiles to draw from. Use them to create vivid, atmospheric scenes.

Primary Location: The Cliffhaven Hotel (St. Ives Bay, England)
A mid-century modern and Art Deco styled hotel perched on a rocky coastline, isolated by fog and sea breeze, hosting an uneasy blend of guests amid Cold War tensions.

Key Locations Available:
- Guest Room 312 (interior): Crime scene
- Grand Lobby (interior): Gathering space
- Staff Kitchen and Service Corridor (interior): Restricted staff area for meal preparation and service
- Sea-facing Terrace (exterior): Outdoor recreational and gathering space for guests

Atmosphere (tonal cue only — do NOT reproduce this phrase verbatim in prose; translate into scene-specific, character-observed sensory language): tense and claustrophobic, underscored by Cold War anxieties and social scrutiny
Weather: cool, damp sea fog rolling in during late afternoon

Era markers: black-and-white television sets in common rooms | transistor radios becoming popular among guests | direct-dial telephones at the front desk | private automobiles common among visitors | telegrams still used for urgent messages | limited local bus services connecting to town

USAGE GUIDELINES:
1. First mention of location: Ground the scene using sensory details drawn from the profiles — paraphrase these into what the POV character directly observes and experiences, not a summary of the room's general qualities
2. Geographic grounding: Reference the specific place (St. Ives Bay, England) naturally in dialogue or narrative
3. Action scenes: Integrate physical layout details (access, sightlines, constraints)
4. Atmospheric scenes: Reference weather, lighting, sounds from sensory palette
5. Era details: Weave in period markers naturally
6. Consistency: Keep all location descriptions aligned with profiles
7. Each chapter opening must anchor to a named location from this list
8. Include at least 2 sensory cues + 1 atmosphere marker in each chapter opening
9. Do NOT use generic repeated manor/storm filler without profile-specific details

SENSORY PALETTE (use 2-3 senses per scene):
Guest Room 312 (interior):
  - Visual: flickering black-and-white television screen, pale wallpaper with subtle geometric print, patterned bedspread rumpled and stained
  - Sounds: distant muffled voices through walls, occasional creak of floorboards, soft hum of transistor radio from corridor
  - Scents: faint tobacco and stale perfume, damp seawater and seaweed, old paper and ink from writing desk
  - Touch: cool smooth brass door handle, coarse woven bedspread fabric

Grand Lobby (interior):
  - Visual: gleaming terrazzo floor, walnut-paneled walls, polished brass reception desk
  - Sounds: soft murmur of guest conversations, clinking of tea cups, footsteps echoing on terrazzo
  - Scents: freshly polished wood, mild tobacco smoke, brewed tea and biscuits
  - Touch: cool smooth brass railing, soft leather armrests

Staff Kitchen and Service Corridor (interior):
  - Visual: gleaming stainless steel surfaces, rows of canned goods on shelves, white tiled walls
  - Sounds: clatter of pots and pans, hissing steam from kettles, footsteps on tiled floor
  - Scents: strong aroma of cooking broth, freshly baked bread, sharp scent of bleach and detergents
  - Touch: cold stainless steel counters, rough burlap sacks

⛔ REFERENCE DATA — DO NOT TRANSCRIBE VERBATIM: The above profiles are structural guides only. Generate original prose that evokes these qualities; do not reproduce the exact phrasing or sentence structure of the profile paragraphs.

SCENE OPENING RULE: When opening a scene in a new location, write what the POV character directly observes and physically senses at that moment — not a general description of the room's qualities. The reader must feel present, not briefed. Sensory details must be observed by the character, not stated as fact about the place.

SENSORY WRITING TECHNIQUES:
- Opening paragraphs
[truncated for prompt budget]

## Texture Pool
Draw on these as opportunities arise — you are not required to use them.

- December 1952 at the seaside hotel is a world steeped in shadow and fog, both literal and figurative
- The short winter days leave long, chilling evenings where guests gather around black-and-white television sets, watching news of international tensions and the Korean armistice talks
- The sea fog rolls in thick from the North Sea, muffling sounds and blurring the sharp lines of the hotel’s modernist Art Deco design
- Guests and staff alike move through the dim corridors with a mixture of polite reserve and underlying unease, shaped by the pervasive Cold War paranoia that colors every interaction
- Fashion reflects a cautious optimism, with men in tailored wool suits and women in elegant coats trimmed with fur, all maintaining strict social codes of behavior that emphasize discretion and decorum

TEMPORAL CONTEXT:

This story takes place in December 1952 during winter.

Seasonal Atmosphere:
- Weather patterns: cool temperatures ranging from 3 to 8 degrees Celsius (37 to 46°F), damp sea fog rolling in during late afternoon, reducing visibility dramatically along the coastline, chilly, moist air with occasional gusts of wind from the North Sea
- Daylight: Short winter days with sunrise near 8:15 AM and sunset around 3:45 PM, leaving long, foggy evenings enveloping the seaside hotel
- Seasonal activities: Hotel guests gathering in common rooms around black-and-white television sets to watch holiday specials or news broadcasts, Evening card games and bridge parties in the lounge, providing genteel entertainment amid the fog, Local villagers and visitors attending Christmas markets or carol singing events along the promenade, despite the chill, Preparation of traditional British festive treats such as Christmas pudding and mince pies by hotel kitchen staff
- Seasonal occasions: Christmas Day, Boxing Day, Advent Sundays
- Season: winter

Period Fashion (describe naturally):
- Men formal: Single-breasted wool suits in dark shades with wide lapels, Double-breasted overcoats with velvet collars for added warmth and style, Silk ties featuring conservative patterns like stripes or small geometric shapes
- Men casual: Chunky woolen sweaters, often crewneck or cable knit, layered over collared shirts, Corduroy trousers paired with leather brogues or sturdy boots, Tweed sports jackets for informal daytime wear
- Men accessories: Fedoras or trilby hats made of felt, Leather gloves and scarves in muted colors, Pocket watches or slim wristwatches with leather straps
- Women formal: Tailored wool coats with cinched waists and fur collars or cuffs, Knee-length skirts paired with fitted blouses featuring Peter Pan collars or subtle ruffles, Evening dresses in rich fabrics like velvet or satin with modest necklines
- Women casual: Sweater sets with matching cardigans and short skirts, Wool gloves and berets in coordinating colors, Practical leather shoes with modest heels
- Women accessories: Pearl necklaces and brooches as tasteful jewelry, Structured handbags in leather or patent leather, Silk scarves tied neatly around the neck or over the hair

Cultural Context (reference naturally):
- Music/entertainment: Frank Sinatra – 'Here Comes Santa Claus', Perry Como – 'Jingle Bells', Bill Haley and His Comets gaining early popularity with rhythm and blues influenced tunes; Films: ‘The Quiet Man’ (released 1952) popular for its romanticized Irish setting, ‘Singin’ in the Rain’ debuting shortly after, signaling a shift toward musical extravaganzas; Theatre: Agatha Christie’s plays continuing popularity in London’s West End, Noël Coward revivals and new works reflecting post-war British wit and social observation; Radio: ‘The Goon Show’ beginning to emerge as a groundbreaking comedy program, ‘The Archers’ popular rural drama series on BBC Radio
- Typical prices: Loaf of bread: 6 pence, Taxi ride across town: 2 shillings, Cinema ticket: 1 shilling 6 pence
- Current events: Winston Churchill serving as Prime Minister of the United Kingdom, navigating Cold War tensions; The United States conducting nuclear tests at the Nevada Test Site, heightening global anxieties
- Literature: Daphne du Maurier’s ‘The Scapegoat’ (1952) | George Orwel
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

• [clue_3] Witnesses report hearing the lobby clock chime a quarter to eleven twice on the morning of the murder.
  Category: temporal | Criticality: essential | Supports inference step 2
  Points to: Indicates the clock was showing incorrect time, as two quarter to eleven chimes cannot occur if clock was correct.

• [clue_4] This is impossible if the clock was running correctly; it suggests the clock’s hour hand was manipulated to mislead witnesses.
  Category: temporal | Criticality: essential | Supports inference step 2
  Points to: Overturns the false assumption that the clock was accurate during the murder timeframe.

• [clue_mechanism_visibility_core] The murderer stopped the hotel lobby clock at ten minutes past eleven, then manually wound its hour hand backward by forty minutes, creating a false timeline.
  Category: temporal | Criticality: essential | Supports inference step 1
  Points to: Reveals the core mechanism of clock manipulation used to mislead about the time of the murder.

For each clue above: an attentive reader should be able to find, record, and later use it to reason toward the solution.

═══ NARRATIVE STATE (read-only — do not contradict) ═══

LOCKED FACTS — use verbatim whenever this evidence is described:
  • The exact time shown on the stopped clock face: "ten minutes past eleven"
  • The exact amount the clock was wound back: "forty minutes"

CHARACTER PRONOUNS — never deviate from these:
  • Robert Quincy: he/him/his
  • Michael Brabazon: he/him/his
  • Frederick Rochford: he/him/his
  • Antoinette Mandeville: she/her/her
  • Janet Warenne: she/her/her

CLUES ALREADY REVEALED TO READER: clue_1, clue_2 — do not reveal these as new information.

INVESTIGATION LOG — WHAT IS ESTABLISHED (do not re-establish, do not repeat):
• Evidence in reader's hands: The minute hand of the lobby clock is slightly misaligned with the hour markers, and scratches are found around the winding keyhole. | These physical signs indicate manual interference with the lobby clock, consistent with it being wound back after stopping.
• Suspects still unresolved: Michael Brabazon[HE], Frederick Rochford[HE], Antoinette Mandeville[SHE]
⚠ The story must move FORWARD from this log. Any beat already listed above is forbidden from repeating.

⚠ THIS CHAPTER'S REQUIRED ADVANCE (early): Interview each suspect — record their claimed whereabouts

CONTINUITY HANDOFF — previous chapter closing beat:
  • "The muted ticking of the lobby clock, though frozen in time, seemed to echo louder in the heavy air. Janet’s thoughts raced, the subtle clues converging toward a revelation that would upend the fragile order of the hotel and expose the fractures beneath its po..."
  • The next chapter must open as a continuation of this beat, not as a disconnected reset.
═══════════════════════════════════════════════════════

═══════════════════════════════════════════════════════════
📚 CONTINUITY CONTEXT - CHARACTER & SETTING CONSISTENCY
═══════════════════════════════════════════════════════════

**CRITICAL: You are writing chapters 3+. Maintain consistency with earlier chapters.**

**Character Names Used in Chapters 1-2:**
Robert Quincy, Michael Brabazon, Frederick Rochford, Antoinette Mandeville, Janet Warenne

✓ RULE: Use EXACTLY these names. Do NOT vary spelling, add titles, or introduce new forms.
✓ Example: if earlier chapters used "Clara Whitfield", keep using "Clara Whitfield" — never "Mrs. Whitfield" unless that is the character's canonical name in the list above.

**Setting Vocabulary Established in Earlier Chapters:**
kitchen, lobby, corridor, suite, lounge

✓ RULE: Continue using this location vocabulary. Maintain consistency with established setting type.
✓ Do NOT introduce new location types that contradict earlier chapters.

**Recent Chapter Summary (for narrative continuity):**
Chapter 1: Chapter 1: Discovery of the Body and Clock Anomaly
  Events: Janet’s gaze shifted from the clock to the small group gathered near the reception desk.
Chapter 2: Chapter 2: Initial Examination of the Lobby Clock
  Events: Janet stepped closer, her fingers brushing lightly over the polished brass casing surrounding the clock’s winding keyhole.

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
Known location profile anchors: The Cliffhaven Hotel, Guest Room 312, Grand Lobby, Staff Kitchen and Service Corridor, Sea-facing Terrace, Hotel lounge, overlooking the rocky shore
LOCATION NAME CAPITALISATION (HARD REQUIREMENT — validated):
All named locations in your prose MUST use the EXACT capitalisation from the CML profiles.
Canonical forms: "The Cliffhaven Hotel", "Guest Room 312", "Grand Lobby", "Staff Kitchen and Service Corridor", "Sea-facing Terrace", "Hotel lounge, overlooking the rocky shore"
Writing a location in lowercase (e.g. "drawing room" instead of "Drawing Room") is a validated error. Every time you mention a named location, copy its capitalisation from the list above.
- Chapter 3: OPENING STYLE (HARD): Start the VERY FIRST SENTENCE with an explicit time marker — e.g. "That morning…" / "By the time dusk fell…" / "It was nearly four o'clock…" / "On the second day after the discovery…". Time must be in the first clause. Anchor opening in "Hotel lounge, overlooking the rocky shore". HARD REQUIREMENT for the first 2 paragraphs: (a) include 2+ sensory words — choose from smell/scent/sound/echo/silence/creak/whisper/cold/warm/damp/rough/smooth/glow/shadow/flicker/dim — and (b) include 1+ atmosphere/time word — choose from rain/wind/fog/storm/mist/thunder/evening/morning/night/dawn/dusk/season/afternoon/midday/noon/midnight/twilight/sunrise/sunset/daylight/sunlight/overcast/cloudy/bright/dark. These are validated requirements, not style suggestions; missing them triggers a retry.

[⚠ INTERNAL QUALITY DIAGNOSTICS — DO NOT REPRODUCE ANY PART OF THIS SECTION IN YOUR STORY OUTPUT. These are private generator observations for your consideration only. Your narrative must read as if this section does not exist. Never include phrases from this block in character dialogue, narration, or description.]

PRIOR CHAPTER QUALITY OBSERVATIONS:
- Chapter 1 (score 98/100):
  Quality gaps noted: scene grounding weakness
  Address in upcoming chapters: Open next chapter with a named location anchor plus at least two sensory cues and one atmosphere marker.
- Chapter 2 (score 97/100):
  Quality gaps noted: scene grounding weakness
  Address in upcoming chapters: Open next chapter with a named location anchor plus at least two sensory cues and one atmosphere marker.
- Phrases to avoid (already overused in earlier chapters): "lips pressed into a thin line".
[END INTERNAL DIAGNOSTICS]

⛔ ABSOLUTE PRONOUN LOCK — NO EXCEPTIONS

The following pronouns are locked facts, on the same level as character names
and hard-logic device values. Using the wrong pronoun is a continuity error,
not a style choice.

Canonical pronoun table (subject / object / possessive / reflexive):
  • Robert Quincy: ALWAYS he/him/his/himself — NEVER she/her/herself
  • Michael Brabazon: ALWAYS he/him/his/himself — NEVER she/her/herself
  • Frederick Rochford: ALWAYS he/him/his/himself — NEVER she/her/herself
  • Antoinette Mandeville: ALWAYS she/her/her/herself — NEVER he/him/his/himself
  • Janet Warenne: ALWAYS she/her/her/herself — NEVER he/him/his/himself

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
   WRONG: "Antoinette watched Quincy; she crossed the room and he frowned." (ambiguous antecedent)
   RIGHT: "Antoinette watched Quincy; Quincy crossed the room and Antoinette frowned." (explicit)
9. In dialogue attribution, the pronoun refers to the SPEAKER — not the last character
   named inside the qu
[truncated for prompt budget]

PROMPT BUDGET SUMMARY: budget=32000 tokens; fixed=9772; context=11600; dropped=[none]; truncated=[fair_play_contract, location_profiles, temporal_context, pronoun_accuracy]

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
- Chapter numbering starts at 3 and increments by 1 per scene.
- Each chapter has 4-8 substantial paragraphs (each 120–180 words) — TARGET ≥ 1250 words — do not stop early.
- Use atmospheric tone and short length guidance.
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
4. Integrate at least two concrete era-grounded details per chapter from setting refinement signals: black-and-white television sets in common rooms | transistor radios becoming popular among guests | room-sized early computers absent in hotel environment | direct-dial telephones increasingly available at front desk | telegrams still used for urgent messages | television news broadcasts shaping public awareness.
5. Respect setting movement/access constraints in scene action and alibis: architectural layout creates natural bottlenecks at stairwells and elevator access | restricted access to upper floors for non-registered guests | weather conditions such as fog and sea breeze affect outdoor movement and evidence preservation | guest rooms accessible only with room keys issued at reception | staff-only areas locked and monitored by supervisory personnel.
6. Sustain social coherence with this backdrop pressure: Amid Cold War paranoia and strict social codes, a group of hotel guests and staff are confined by isolation and surveillance in a coastal hotel where trust is scarce and appearances must be maintained.
7. Maintain continuity around these socially central cast anchors where relevant: Robert Quincy, Michael Brabazon, Frederick Rochford, Antoinette Mandeville, Janet Warenne.
8. STORY TO DATE ANTI-COPY RULE: The STORY TO DATE section below is provided for chronological and factual reference ONLY. You MUST NOT copy, lightly rephrase, or structurally echo any sentence or paragraph from prior chapters. Every sentence in this chapter must be original prose unique to this scene. Reusing even a clause from prior chapter text will cause this attempt to fail immediately.

CRITICAL PROSE REQUIREMENTS:

The CML specifies exact requirements for certain validation-critical scenes. You MUST include these elements at the specified positions.

**Discriminating Test Scene (Act 3, Scene 4):**
Required elements: Execute the timed comparison of lobby clock winding and victim’s wristwatch, Reenact receptionist’s guest greeting schedule, Observe contradictions in clock chimes and time records, Conclude Robert Quincy’s guilt from disproved alibi
Test type: trap

**Suspect Clearance Scenes:**
- Michael Brabazon (Act 3, Scene 5): Dining room alibi corroborated by multiple witnesses and dining logs
  Clues: Witness statements placing Michael in dining room, Dining room guest logs
- Frederick Rochford (Act 3, Scene 5): Maintenance area presence confirmed by janitor and elevator logs
  Clues: Elevator maintenance logs, Janitor testimony
- Antoinette Mandeville (Act 3, Scene 5): Reception desk presence confirmed by receptionist log and witness testimony
  Clues: Reception logs, Witness statements

**Culprit Revelation Scene (Act 3, Scene 6):**
Method: Confrontation with clock tampering evidence and disproved alibi

**Clue Placement for These Chapters:**
- clue_3 must appear in Act 1, Scene 3 via Direct observation
- clue_4 must appear in Act 1, Scene 3 via Cross-check contradiction
- clue_mechanism_visibility_core must appear in Act 1, Scene 3 via Direct observation

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
- ERA RULE (1950s): NEVER use these anachronistic terms: "internet", "email", "cell phone", "mobile phone", "smartphone", "GPS", "laptop", "digital camera", "text message", "app", "wifi", "bluetooth". Any occurrence will cause the chapter to be rejected.
- STYLE HARD-BAN: NEVER use these phrase families: "clock tower at quarter past three", "near the clock tower at quarter past", "showed quarter past three when the body", "in the formal gardens during the murder". Any occurrence triggers rejection/retry.
- STYLE SOFT-BAN: avoid these stock phrases and rewrite them if they appear in draft text: "lips pressed into a thin line", "the household runs smoothly when every cog", "the pressures upon this household are many".
- STYLE WATCHLIST: keep these patterns varied and scene-specific: "quarter past three", "three fifteen", "the old bell striking three fifteen", "the chimes echoed just after three-fifteen".
- Chapter 3:
  - STRUCTURAL ARCHETYPE — Chapter 3 must be: EVIDENCE
      ✓ MUST contain: new physical clue discovered
      ✗ MUST NOT contain: formal accusation
  - Word count: Target 1250 words. Achieve this through plot events, dialogue exchanges, and physical investigation — not through atmospheric repetition or extended internal reflection. Each 200-word segment should contain at minimum one concrete story event (a discovery, a conversation exchange, a physical action or movement). Padding with atmosphere alone is not acceptable.
  - Opening: Begin with a character action, spoken line, or clock/time marker — never a location name or location-description phrase.
  - Scene is set in: Hotel lounge, overlooking the rocky shore — reference it naturally within the paragraph, never as your opening phrase.
  - Opening atmosphere (MANDATORY — validator enforced): the first paragraph MUST contain at least one of: rain / wind / fog / storm / mist / thunder / evening / morning / night / dawn / dusk / season / afternoon / midday / noon / midnight / twilight / sunrise / sunset / daylight / sunlight / overcast / cloudy / bright / dark / grey / pale / cold / warm / chill / crisp / damp / drizzle / haze / lamplight / firelight. A chapter that omits all of these from its opening paragraph will be rejected.
  - Continuity bridge: in the first 120 words, visibly connect from the previous chapter's final beat. Carry forward one unresolved element (object, accusation, emotional pressure, or immediate physical action) from: "The muted ticking of the lobby clock, though frozen in time, seemed to echo louder in the heavy air. Janet’s thoughts raced, the subtle clues converging toward a revelation that would upend the fragile order of the hotel...".
  - CLUE OBLIGATIONS — mandatory prose elements (do NOT omit or bury):
    • Witnesses report hearing the lobby clock chime a quarter to eleven twice on the morning of the murder. [clue_3] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: Indicates the clock was showing incorrect time, as two quarter to eleven chimes cannot occur if clock was correct.
      ↳ MANDATORY TWO-PARAGRAPH STRUCTURE (must appear in paragraphs 1 or 2 — no later):
         Paragraph 1: The POV character physically approaches or directly observes this evidence.
           The narration or dialogue explicitly states what is seen (use the exact locked phrase if one applies).
         Paragraph 2 (immediately following): The detective or POV character explicitly reasons
           about what this evidence implies — who it implicates, why it may be unreliable,
           or what inference it supports. This must be a separate full paragraph, not a sentence appended to Paragraph 1.
    • This is impossible if the clock was running correctly; it suggests the clock’s hour hand was manipulated to mislead witnesses. [clue_4] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: Overturns the false assumption that the clock was accurate during the murder timeframe.
      ↳ MANDATORY TWO-PARAGRAPH STRUCTURE (must appear in paragraphs 1 or 2 — no later):
         Paragraph 1: The POV character physically approaches or directly observes this evidence.
           The narration or dialogue explicitly states what is seen (use the exact locked phrase if one applies).
         Paragraph 2 (immediately following): The detective or POV character explicitly reasons
           about what this evidence implies — who it implicates, why it may be unreliable,
           or what inference it supports. This must be a separate full paragraph, not a sentence appended to Paragraph 1.
    • The murderer stopped the hotel lobby clock at ten minutes past eleven, then manually wound its hour hand backward by forty minutes, creating a false timeline. [clue_mechanism_visibility_core] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: Reveals the core mechanism of clock manipulation used to mislead about the time of the murder.
      ↳ MANDATORY TWO-PARAGRAPH STRUCTURE (must appear in paragraphs 1 or 2 — no later):
         Paragraph 1: The POV character physically approaches or directly observes this evidence.
           The narration or dialogue explicitly states what is seen (use the exact locked phrase if one applies).
         Paragraph 2 (immediately following): The detective or POV character explicitly reasons
           about what this evidence implies — who it implicates, why it may be unreliable,
           or what inference it supports. This must be a separate full paragraph, not a sentence appended to Paragraph 1.
  - Tonal contrast: include at least one beat of relief or ironic counterpoint. Do not sustain maximum tension for every paragraph.
  - ALIBI LOCK: Robert Quincy's established alibi is "Between quarter past ten and twenty past eleven". Do NOT place Robert Quincy at any other location or in any other activity during the crime window. Any contradiction is a continuity error that triggers a retry.
  - TESTIMONY CONTINUITY: Robert Quincy has already made statements in earlier chapters. Any time, location, or claim attributed to Robert Quincy in THIS chapter must be consistent with those earlier statements. Do NOT introduce a new or different alibi claim — any contradiction is a continuity error.
- Locked fact phrase obligations:
  - If this batch mentions The exact time shown on the stopped clock face, write exactly: "ten minutes past eleven".
  - If this batch mentions The exact amount the clock was wound back, write exactly: "forty minutes".
- Seasonal vocabulary allow-list: winter, wintry, midwinter.
- Forbidden seasonal words: spring, summer, autumn.

⛔ PRONOUN TABLE — re-check after EVERY paragraph before writing the next:
    Robert Quincy: he/him/his
    Michael Brabazon: he/him/his
    Frederick Rochford: he/him/his
    Antoinette Mandeville: she/her/her
    Janet Warenne: she/her/her
  Any sentence containing a pronoun must agree with this table. Correct mismatches before moving on.

FROZEN FACT STATE (DO NOT ALTER):
- Timeline anchor: December (winter).
- Month, season, weather, and time-of-year language in this batch must stay compatible with winter.
- Established timeline fact: Lobby clock stopped at 11:10 by manipulation
- Established timeline fact: Victim’s wristwatch stopped at 11:20
- Established timeline fact: Witnesses heard double chime at quarter to 11 in the morning
- If referenced, use exact phrase: "ten minutes past eleven" (The exact time shown on the stopped clock face).
- If referenced, use exact phrase: "forty minutes" (The exact amount the clock was wound back).

STORY TO DATE (REFERENCE ONLY — DO NOT COPY VERBATIM):
- Full prior chapter text is provided below for continuity, factual consistency, and reference accuracy.
- Use this to keep character voice, chronology, clue state, and location continuity aligned with earlier chapters.
- Do not quote, copy, or paraphrase these paragraphs too closely; write fresh prose that remains consistent with them.

--- BEGIN PRIOR CHAPTER 1 ---
Title: Chapter 1: Discovery of the Body and Clock Anomaly
Janet Warenne stepped briskly across the damp terrazzo floor of the hotel lobby, her polished shoes echoing softly beneath the muted glow of flickering Art Deco lamps. A chill winter morning fog seeped through the tall glass doors, blurring the sharp outlines of walnut-paneled walls and casting long shadows across the freshly polished brass reception desk. The faint scent of brewed tea mingled with a trace of tobacco smoke, a quiet murmur of voices barely audible under the persistent patter of rain against the canopy outside. Janet’s keen eyes were immediately drawn upward to the grand lobby clock, its face frozen at ten minutes past eleven, yet something about the minute hand caught her attention.

Approaching the clock, Janet noted with deliberate scrutiny that the minute hand was slightly misaligned with the hour markers, and scratches were found around the winding keyhole. The brass casing bore faint abrasions, as if someone had recently forced the mechanism. This was no mere mechanical failure; it hinted at deliberate tampering. The lobby clock, a trusted temporal anchor for guests and staff alike, might not be as reliable as it appeared. Janet’s mind raced through the implications—who would have access to the clock, and why alter its time? The subtle misalignment and scratches suggested a hurried, perhaps panicked interference, raising questions about the timeline of events that had unfolded within these walls.

Janet’s gaze shifted from the clock to the small group gathered near the reception desk. Robert Quincy stood with his hands clasped behind his back, his expression composed but his eyes betraying a flicker of unease. Beside him, Michael Brabazon’s sharp features were set in a tight line, his posture rigid as if bracing against an invisible pressure. Frederick Rochford leaned casually against the polished wood paneling, his gravelly voice low as he exchanged a few words with Antoinette Mandeville, whose refined poise seemed to mask a restless tension beneath her elegant fur-trimmed coat. The detective’s presence was acknowledged with a mixture of relief and guarded apprehension; she was the investigator in charge, and the weight of that responsibility settled heavily on her shoulders.

The body lay just beyond the reception area, sprawled awkwardly on the patterned carpet that bore the faintest stains of dried blood. The victim’s face was pale and still, eyes closed as if in eternal sleep, the faintest trace of a furrowed brow hinting at a final moment of distress. Janet knelt beside the figure, noting the dampness of the air that clung to the victim’s clothing and the faint scent of seaweed that seemed to permeate the room. The victim was unmistakably the hotel’s long-standing manager, whose sudden absence had sparked the alarm the previous evening. Now, the grim confirmation lay before them all: a murder had been committed within the walls of this seaside refuge.

Janet’s fingers brushed the victim’s wrist, where a stopped wristwatch lay exposed beneath the cuff. The watch’s hands were frozen at twenty minutes past eleven, a detail that immediately set her mind racing against the frozen lobby clock’s time. The contradiction between these two timepieces suggested a deeper deception, a manipulation of the very fabric of time within the hotel’s confines. As she rose, Janet’s eyes swept the lobby once more, noting the damp footprints leading toward the elevators and the faint smudge on the brass call button. Each detail was a thread in a tangled web, and she intended to unravel them all.

Robert Quincy’s voice broke the silence, measured and steady despite the tension thickening the air. “It is imperative we maintain decorum despite these trying circumstances. One must not let sentiment cloud ” His gaze was steady but guarded, as if he weighed every word before releasing it into the charged atmosphere. Janet regarded him thoughtfully; the heir to the hotel’s legacy, his composure was a mask that concealed more than it revealed. The detective sensed a man burdened by secrets and desperate to control a narrative slipping beyond his grasp.

Michael Brabazon stepped forward, his tone brisk and clipped. “I was overseeing preparations in the kitchen at the time in question, as usual. There is no reason for me to be near the victim’s ” His eyes flicked briefly to the lobby clock, then away, betraying a flicker of unease despite his confident assertion. Janet filed away the statement, noting the careful choice of words and the subtle tension beneath his polished exterior. Ambition and fear were often bedfellows, and Michael’s performance was no exception.

Frederick Rochford’s gravelly voice interrupted the mounting tension with a self-deprecating edge. “Duty calls for patience, though I admit it is wearing thin these ” He gestured toward the elevators. “I was in the maintenance area, yes, but details beyond that are best left to the records and ” His clipped speech and wry smile hinted at a man accustomed to bearing burdens in silence, his loyalty to the family perhaps at odds with the growing suspicion that hung over the hotel like the persistent fog outside.

Antoinette Mandeville’s smooth, theatrical tone cut through the murmurs as she addressed Janet directly. “One must always present oneself with grace, even when the winds of fortune shift ” Her eyes flickered toward the body with a mixture of sorrow and calculation. “I was in my room, alone, as I have mentioned. There is no need to speculate ” Yet the faint tremor in her voice betrayed a vulnerability beneath the polished surface. Janet noted the delicate balance Antoinette maintained between charm and guarded ambition, a woman navigating treacherous social currents with practiced ease.

Janet Warenne turned back to the lobby clock, her mind piecing together the dissonant details. The minute hand’s misalignment and the scratches around the winding keyhole were not mere coincidences; they were deliberate acts designed to distort time itself. This manipulation cast doubt on the alibis that hinged on the clock’s displayed time. The detective’s eyes narrowed as she considered the implications—someone had sought to rewrite the timeline, to conceal a moment that would unravel their carefully constructed facade.

The heavy fog pressed against the windows like a silent witness, muffling the sounds of the waking seaside town beyond. Inside the Cliffhaven Hotel, the atmosphere was thick with suspicion and unspoken accusations. Janet’s gaze lingered on the group of suspects, each caught in the web of uncertainty and fear. The investigation had begun in earnest, and the detective knew that every detail, no matter how small, might hold the key to unlocking the truth beneath the shadows.

As the morning light struggled through the rain-streaked windows, Janet felt the weight of her responsibility settle firmly upon her. The murder at the Cliffhaven Hotel was no ordinary crime; it was a puzzle woven with deception, desperation, and the fragile threads of human frailty. With the body discovered and the clock’s anomaly exposed, the path ahead was uncertain but inevitable. Janet Warenne was resolved to see the case through to its grim conclusion, no matter the cost.
--- END PRIOR CHAPTER 1 ---

--- BEGIN PRIOR CHAPTER 2 ---
Title: Chapter 2: Initial Examination of the Lobby Clock
"The scratches around the winding keyhole are unmistakable," Janet Warenne said, her voice low yet resolute as she stood beneath the muted glow of the Art Deco lamps. The damp chill of the winter morning seeped through the lobby’s tall glass doors, carrying with it a faint scent of salt and seaweed from the North Sea. A soft murmur of voices drifted from the reception desk, mingling with the distant, rhythmic crashing of waves against the rocky shore. Janet’s eyes narrowed on the grand clock’s face, frozen precisely at ten minutes past eleven, its minute hand ever so slightly askew from the hour markers. The atmosphere was heavy with a restrained tension, the kind born from unspoken fears and the weight of secrets waiting to be uncovered.

Janet stepped closer, her fingers brushing lightly over the polished brass casing surrounding the clock’s winding keyhole. These physical signs indicate manual interference with the lobby clock, consistent with it being wound back after stopping. The faint abrasions around the keyhole suggested a hurried and deliberate effort, as if someone had sought to manipulate the passage of time itself. The dim light caught the misalignment of the minute hand, revealing a subtle but telling deviation from its proper position. This was no ordinary mechanical failure; the evidence pointed to a calculated act designed to distort the timeline of events within the hotel’s walls.

She turned slowly, her gaze settling on Robert Quincy, who stood nearby with his hands clasped behind his back. His usual composure was fraying at the edges, a fleeting twitch of his fingers betraying the calm facade he presented. "Mr. Quincy," Janet began, her tone measured yet edged with quiet insistence, "are you familiar with the clock’s "

Robert’s eyes flickered briefly to the clock before returning to meet Janet’s steady gaze. "I am acquainted with the workings, yes," he replied, his voice formal and carefully controlled. "The clock has been a fixture of this establishment for many years. It is maintained regularly, though I confess I have not personally tended to its " His fingers twitched again, a subtle sign of unease that did not go unnoticed.

"And yet," Janet pressed, "these scratches suggest recent manual interference. Someone with access to the clock could have altered its time. Can you account for your whereabouts during the period when the clock might have been tampered "

Robert’s posture stiffened, the faintest crease forming between his brows. "Between quarter past ten and twenty past eleven, I was attending to matters in my suite and later in the lounge. I have no reason to manipulate the clock, Detective. The implications are grave, and I assure you, I have acted with " His measured cadence belied the tension coiling beneath his words.

Janet’s mind sifted through the possibilities. The clock’s manipulation not only undermined its reliability as a temporal anchor but also cast doubt on alibis that depended on its displayed time. Whoever had wound the clock back by forty minutes had sought to conceal a crucial moment, perhaps the very instant of the murder. The question was who possessed both the opportunity and motive to tamper with such a public and symbolic object.

The lobby around them felt colder, the wintry light filtering through fogged windows casting softened shadows on the walnut-paneled walls. The polished brass of the reception desk gleamed faintly, reflecting the anxious faces of the gathered guests and staff. Janet noted the subtle shift in Robert’s demeanor as he avoided direct eye contact, a quiet admission of discomfort that spoke louder than any denial.

"Mr. Quincy," Janet said quietly, "the clock is more than a timekeeper here; it is a witness to the events that transpired. Its alteration suggests a deliberate attempt to rewrite history. I must ask you again—have you any knowledge of who might have interfered with "

Robert’s lips pressed into a thin line, his voice dropping to a near whisper. "I cannot say. Yet I fear that in this establishment, where appearances are everything, the truth is often the first " He allowed himself a brief, tight-lipped curl of a smile, as if acknowledging the irony of his own predicament.

Janet’s attention shifted as footsteps echoed softly on the terrazzo floor. Michael Brabazon approached, his sharp features set in a mask of polite concern. "Detective Warenne," he said, his tone brisk yet respectful, "I understand you are examining the clock. Might I offer my "

"Mr. Brabazon," Janet replied, "your cooperation is appreciated. Have you noticed anything unusual about the clock or its timing this "

Michael’s gaze flicked toward the clock, then back to Janet. "Now that you mention it, I did hear the clock chime a quarter to eleven twice in quick succession. It struck me as odd at the time, but I attributed it to some mechanical " His voice carried a hint of unease, as if the memory unsettled him more than he cared to admit.

"A double chime," Janet mused aloud. "That would be impossible if the clock were functioning correctly. It suggests the hour hand was manipulated to chime twice at the same hour, reinforcing the idea that the clock’s time was "

Michael nodded slowly, his fingers tightening around the strap of his overcoat. "I was in the Staff Kitchen and Service Corridor during the morning hours, overseeing preparations. I had little reason to be near the lobby, but the clock’s irregularity has given me "

"Thank you, Mr. Brabazon," Janet said, her mind weaving the strands of testimony and evidence into a growing tapestry of suspicion. "Your account helps narrow the window in which the clock could have been tampered "

As Michael stepped back, Janet’s gaze returned to Robert Quincy. The heir to the hotel’s legacy was no longer merely a composed figure of aristocratic bearing; he was a man shadowed by secrets, his carefully constructed alibi now shadowed by the clock’s silent testimony. The scratches and misaligned hands were not just physical anomalies—they were the first tangible signs that the truth within the Cliffhaven Hotel was far more elusive than anyone had dared imagine.

The muted ticking of the lobby clock, though frozen in time, seemed to echo louder in the heavy air. Janet’s thoughts raced, the subtle clues converging toward a revelation that would upend the fragile order of the hotel and expose the fractures beneath its polished surface. The investigation was no longer a matter of when or where—it was a question of who had dared to challenge time itself.
--- END PRIOR CHAPTER 2 ---

# Case Overview
Title: The Fogbound Hour: A Seaside Hotel Mystery
Era: 1950s
Setting: Mid-century modern Art Deco seaside hotel on rocky shore
Crime: murder (timing-based alibi contradiction)
Culprit: Robert Quincy
False assumption: The murder occurred exactly at the time shown by the stopped lobby clock, approximately ten minutes past eleven.
Cast: Robert Quincy (he/him), Michael Brabazon (he/him), Frederick Rochford (he/him), Antoinette Mandeville (she/her), Janet Warenne (she/her)

Setting Lock: Keep all scenes and descriptions consistent with the stated setting (Mid-century modern Art Deco seaside hotel on rocky shore). Do not introduce a different location type. Do not invent an alternative estate name. The only permitted name for this property is "Mid-century modern Art Deco seaside hotel on rocky shore" — any other estate name (e.g., "Caldwell Manor", "Ashwood Hall", or any invented proper name) is a continuity error that will be caught and rejected.

⛔ PRONOUN LOCK (verify every sentence before writing):
• Robert Quincy — he/him/his (NEVER she/her)
• Michael Brabazon — he/him/his (NEVER she/her)
• Frederick Rochford — he/him/his (NEVER she/her)
• Antoinette Mandeville — she/her/her (NEVER he/him)
• Janet Warenne — she/her/her (NEVER he/him)

Outline scenes:
[
  {
    "sceneNumber": 3,
    "act": 1,
    "title": "Witnesses Recall the Clock’s Double Chime",
    "setting": {
      "location": "Hotel lounge, overlooking the rocky shore",
      "timeOfDay": "Late morning, shortly after previous scene",
      "atmosphere": "Overcast sky, the sea mist lending a ghostly pallor to the room"
    },
    "characters": [
      "Janet Warenne",
      "Michael Brabazon",
      "Antoinette Mandeville",
      "Frederick Rochford"
    ],
    "purpose": "Introduce temporal anomaly through witness testimony; reinforce false assumption",
    "cluesRevealed": [
      "clue_3",
      "clue_4",
      "clue_mechanism_visibility_core"
    ],
    "dramaticElements": {
      "conflict": "Suspects’ conflicting memories about the clock’s chime",
      "tension": "The impossible double chime sows confusion and doubt",
      "microMomentBeats": [
        "Antoinette’s gaze drifts to the fogged window, her voice faltering as she recounts the strange sound"
      ]
    },
    "summary": "Janet interviews Michael, Antoinette, and Frederick about the morning’s events. Multiple witnesses recall hearing the lobby clock chime a quarter to eleven twice, an impossibility if the clock ran correctly. This testimony supports the theory that the clock was manipulated, but the suspects’ uneasy glances suggest deeper secrets.",
    "estimatedWordCount": 1800,
    "emotionalRegister": "Subtle clues raise unease and suspicion, deepening the mystery and emotional stakes.",
    "dominantCharacterNote": {
      "name": "Michael Brabazon",
      "voiceRegister": "Quick, clipped speech peppered with managerial jargon and sharp observations on class and ambition."
    },
    "humourGuidance": {
      "permission": "conditional",
      "character": "Janet Warenne",
      "form": "dry wit",
      "condition": "Dry, subtle irony or understated humour from characters with humour levels above 0.3 is allowed."
    },
    "eraTextureNote": "No digital communications; reliance on mechanical clocks and rotary telephones; Limited transport options amplified by fog and winter weather delays; Restricted access within the hotel controlled by reception and staff; Sound propagation altered by thick sea fog muffling distant noises; Manual clock mechanisms vulnerable to tampering but hard to detect; Guests and staff confined in a geographically isolated coastal setting",
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
□ Chapter 3: "Witnesses report hearing the lobby clock chime a quarter to eleven twice on the morning of the murder." is placed in the first 25% of the chapter, followed by an explicit inference or suspicion paragraph.
□ Chapter 3: "This is impossible if the clock was running correctly; it suggests the clock’s hour hand was manipulated to mislead witnesses." is placed in the first 25% of the chapter, followed by an explicit inference or suspicion paragraph.
□ Chapter 3: "The murderer stopped the hotel lobby clock at ten minutes past eleven, then manually wound its hour hand backward by forty minutes, creating a false timeline." is placed in the first 25% of the chapter, followed by an explicit inference or suspicion paragraph.
□ First chapter in this batch opens by continuing the previous chapter closing beat (same unresolved object, question, movement, or emotional pressure).
□ PRONOUN AUDIT — for every character you named in your chapters, list the pronouns you actually used, then verify against the canonical table. Correct any mismatch before outputting. Do NOT include this audit in your JSON output.
  Character            | Canonical     | Used in draft | Match?
  ---------------------|---------------|---------------|-------
  Robert Quincy        | he/him/his/himself        | [fill in]     | [yes/no]
  Michael Brabazon     | he/him/his/himself        | [fill in]     | [yes/no]
  Frederick Rochford   | he/him/his/himself        | [fill in]     | [yes/no]
  Antoinette Mandeville | she/her/her/herself       | [fill in]     | [yes/no]
  Janet Warenne        | she/her/her/herself       | [fill in]     | [yes/no]
□ Return valid JSON only.
```
