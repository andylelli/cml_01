# Actual Prompt Record

- Run ID: `mystery-1779913343560`
- Project ID: ``
- Timestamp: `2026-05-27T20:29:14.380Z`
- Agent: `Agent9-ProseGenerator-Ch1`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4.1-mini`
- Temperature: `0.42`
- Max Tokens: `4500`
- Attempt: `first`
- Prompt Hash: `739cecc77bf2105d`

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
- MORAL COMPLEXITY REQUIREMENT: The mechanism of this crime carries a moral gray area: "The culprit sabotaged the clock to cover a mercy killing, blurring justice and compassion in a time-sensitive family feud." — the culprit reveal and denouement MUST acknowledge this ambiguity. Do not let the ending feel clean or simple. Give the reader at least one moment of uncomfortable sympathy or moral doubt.


⚠️ AMATEUR DETECTIVE STORY: The investigator is a civilian with no official standing. The official police (if they appear) are unnamed background figures only — "a constable", "the sergeant", "an officer from the village". Do NOT give any police official a name or title+surname combination. There is no Inspector [Surname], no Constable [Surname], no Sergeant [Surname] in this story.


CRITICAL CHARACTER CONSISTENCY RULES:

1. Each character has ONE canonical name. Use ONLY names from this list. Never vary, abbreviate, or add titles beyond what is listed.
   COMPLETE CAST (no other named characters exist): Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill
   - "Mr. Jennings entered the room" → ILLEGAL. Jennings is not in the cast.
   - "Constable Reed took notes" → ILLEGAL. Reed is not in the cast.
   - "A constable took notes" → LEGAL (no name given).

2. Character roles are fixed:
   - Eleanor Voss: Amateur Sleuth / Civilian Investigator
   - Dr. Mallory Finch: Insider Rival
   - Captain Ivor Hale: Outsider with Hidden Agenda
   - Beatrice Quill: Jealous Lover / Social Climber
   - Never place characters in locations inconsistent with their role

WORLD DOCUMENT (use this as your primary creative context):

## Era: 1934 May
May 1934 in rural Yorkshire presents a world caught between tradition and uncertain change. The manor estate, steeped in centuries-old aristocratic rituals, is wrapped in the damp chill of spring drizzle and overcast skies. Daily life unfolds under the strict gaze of social hierarchy, where servants move discreetly and guests observe rigid etiquette. Radios hum softly in drawing rooms, and rotary telephones offer rare glimpses of the outside world. Fashion leans toward modest elegance, with women favoring bias-cut silks and men wearing muted wool suits, reflecting a cautious mood. Economic strain from the lingering Great Depression tightens household budgets, echoing in fewer servants and frugal meals. Political unease stirs as news of unrest abroad and domestic labor demonstrations filter through the estate, casting a shadow over otherwise genteel social gatherings. Despite these pressures, the estate clings to its rituals — afternoon teas, formal dinners, and quiet card games — providing a fragile veneer of order amid growing tensions.
Emotional register: A pervasive mood of restrained anxiety and cautious vigilance underpins daily life.
Physical constraints: Limited and slow communication via rotary dial telephones and telegrams | No modern forensic tools beyond fingerprinting and basic toxicology | Restricted transportation on rural country lanes and limited automobile ownership | Strict social protocols limiting servant and guest movements
Current tensions (weave into background texture): The British government under Ramsay MacDonald faces criticism amid rising unemployment | Labour unrest and May Day demonstrations highlight ongoing economic tensions | Hitler consolidates power in Germany, alarming British elites
Wartime context — Britain remains at peace in 1934, but military tensions rise abroad.: Military veterans like Captain Hale are respected but bear private burdens amid uncertain times. Absence effect: No wartime absences yet, but looming political unrest casts shadows on futures.

## Season Lock (mandatory — derived from 1934 May)
Season: spring. Allowed vocabulary: spring, vernal, springtime
Forbidden seasonal words — never use in narration, dialogue, or metaphor: summer, autumn, winter and their adjectival forms.
Every weather description, atmosphere, and time-of-year reference must be consistent with spring.

## Story Theme
This story explores how appearances and social facades can mask complex mechanical and human manipulations, revealing that truth often lies hidden beneath layers of social expectation and fabricated timelines.

## Story Emotional Register
Dominant: A steadily intensifying tension underlies the narrative, moving from reserved sorrow through growing suspicion to sharp confrontation and poignant resolution.

Arc:
The story opens in a somber and reserved mood as the respected matriarch Eleanor Voss is discovered dead, the manor shrouded in a damp, autumnal chill that reflects the heavy silence of loss and the fragile social order threatened by her passing. The initial atmosphere is one of quiet shock, where grief is mingled with the unspoken anxiety of what her death means for the estate’s stability.

As investigation begins, the emotional tone shifts into rising unease. Early clues about the manor’s pendulum clock and the dinner bell’s odd timing introduce subtle contradictions. The characters grapple with their own motivations and secrets, and the social protocols weigh heavily, creating a sense of claustrophobia and mistrust. The investigator’s patience is tested as false leads and social facades complicate the search for truth.

Midway through the story, a pivotal revelation unsettles the entire narrative: the clock’s escapement lever has been reversed, causing the pendulum to run backward and fabricating a false timeline. This discovery reframes all previous assumptions and forces a reassessment of alibis and motives, injecting a sharper urgency and intellectual challenge into the investigation. The emotional register tightens as suspicion begins to focus.

A second turn deepens the tension, as the irregular clock chimes and servant testimonies about the delayed dinner bell expose a coordinated deception. The social veneer starts to crack, revealing the intricate interplay of personal grievances and mechanical manipulation. The characters’ vulnerabilities and ambitions come into sharper relief, and the stakes escalate with the narrowing suspect pool.

In the pre-climax and climax, mounting pressure culminates in a controlled demonstration that decisively disproves the false timeline, laying bare the culprit’s tampering and invalidating their alibi. The confrontation carries a charged emotional weight, combining cold logic with personal betrayal, as the truth dismantles carefully constructed illusions.

The resolution carries.

## Emotional register at this point in the story
A heavy, somber atmosphere of loss and fragile social order sets the stage.

## Character Portraits (appearance & era)

### Eleanor Voss
Eleanor embodies the genteel stability of the 1930s English aristocracy, navigating social expectations with grace while quietly wrestling with personal loyalties. Her retired teaching background and encyclopedic local knowledge position her as a stabilizing observer amid the estate’s shifting tensions. The austerity of the era and the estate’s rigid class structure frame her cautious, measured demeanor as she balances duty with her private affections.
Era intersection: Her unspoken affection for Captain Hale is complicated by the era’s strict social codes, compelling her to conceal personal feelings while upholding public decorum.

### Dr. Mallory Finch
Mallory represents a modern professional woman constrained by the era’s expectations, maintaining a poised exterior while managing the precariousness of a secret affair and financial grievances. Her clinical demeanor and deadpan humor mask deep anxiety, reflecting the limited roles and social pressures on women in medicine during the 1930s. The political and economic instability heightens her stakes, as exposure would devastate her career and personal life.
Era intersection: Her secret relationship with Captain Hale and investment frustrations are intensified by the era’s gender norms and social surveillance.

### Captain Ivor Hale
A retired military officer, Hale carries the weight of discipline and authority tempered by private financial desperation and romantic entanglements. His clipped speech and dry wit reflect a man accustomed to control yet increasingly vulnerable amid economic uncertainty. The looming geopolitical tensions and social upheavals of the 1930s underscore his internal conflict between honor and survival.
Era intersection: His military past and current role on the estate situate him at the nexus of tradition and emerging social challenges, with private failings threatening his public image.

### Beatrice Quill
Beatrice is the polished socialite, skilled in navigating and manipulating the strict hierarchies of 1930s aristocratic society. Her poised charm and pointed wit conceal ambitious and jealous scheming, emblematic of a woman striving for agency within limited social roles. The era’s rigid gender and class expectations heighten her anxiety over reputation and influence.
Era intersection: Her jealousies and maneuvers reflect the pressures on women to secure social standing amid shifting power dynamics during this uncertain decade.

## Character Voices

### Eleanor Voss (she/her/her)
Eleanor speaks softly and deliberately with formal phrasing and gentle wit, favoring understatement to defuse tension.
[comfortable] One must always remember that appearances often veil more than they reveal, wouldn’t you agree?
[evasive] I find that sometimes, the less said is quite enough to understand the gravity of the situation.
[stressed] It pains me to suspect those I hold dear, yet duty calls us to look beyond affection.
Humour: Eleanor’s humor is subtle and low-key, serving as a quiet balm amid tension.

### Dr. Mallory Finch (she/her/her)
Dr. Finch’s tone is measured and clipped, her words chosen with clinical precision and occasional sharp deadpan wit.
[comfortable] The human body, much like society, is a delicate mechanism—one that requires careful maintenance.
[evasive] I assure you, my rounds were uninterrupted; any suggestion otherwise is purely speculative.
[stressed] One does what is necessary to preserve both health and discretion in such precarious circumstances.
Humour: Her dry humor punctuates conversations with unexpected bluntness, masking underlying tension.

### Captain Ivor Hale (he/him/his)
Hale’s speech is precise and clipped, marked by a military economy of words and dry, sardonic remarks.
[comfortable] Discipline, after all, is the backbone of both an army and a well-run estate.
[evasive] My whereabouts were unremarkable; I prefer to keep my movements as discreet as possible.
[stressed] There are debts not easily paid—financial or otherwise—and they weigh heavily on a man’s conscience.
Humour: His dry wit surfaces when under pressure, often as a defensive shield.

### Beatrice Quill (she/her/her)
Beatrice’s voice is polished and poised, with elegantly crafted speech that often carries veiled barbs under polite veneer.
[comfortable] One must always present the perfect smile; it is the currency of our society, after all.
[evasive] I was merely passing through the servant quarters; hardly an uncommon occurrence, I assure you.
[stressed] Reputations are fragile things, easily shattered by the careless or the malicious alike.
Humour: Her humour is a form of polite savagery, cutting yet cloaked in civility.

## Location Registers (scene framing guides)

The East Wing Study: The study feels claustrophobic and heavy with secrets; its dim light and locked doors mirror the oppressive tension surrounding the crime and the weight of hidden truths.. Camera angle: A close, intimate focus emphasizing shadows, textures, and the oppressive silence that cloaks the scene.. Era: Access to this room is tightly controlled, reflecting strict class and household protocols of the 1930s.

The Manor Library: The library offers a rare refuge of calm reflection and quiet scrutiny, where whispered confidences and subtle revelations unfold beneath the warm glow of firelight.. Camera angle: A wide, contemplative frame capturing both the grandeur and intimacy of knowledge and social exchange.. Era: Open only during daylight to trusted guests, emphasizing social boundaries.

Servants' Hall: The servants' hall buzzes with pragmatic warmth and muted camaraderie, a world apart from the estate’s formality, where class lines blur in shared toil and whispered gossip.. Camera angle: A grounded, textured viewpoint highlighting the human rhythms beneath the manor’s imposing surface.. Era: Restricted to staff during breaks, underscoring strict social segregation.

Formal Gardens and Grounds: The gardens feel melancholic and solitary under the persistent drizzle, a place of masked movement and hidden glances where nature’s cycles contrast with human intrigue.. Camera angle: A distant, atmospheric perspective capturing misty outlines and the interplay of light and shadow.. Era: Gates locked at dusk, limiting nocturnal access and emphasizing estate seclusion.

## Humour guidance for this story position (opening)
Permission: conditional — condition: Only understated, subtle wit by Eleanor Voss to relieve tension without undermining gravity
Characters who may be funny: Eleanor Voss
Permitted forms: understatement
Rationale: The opening scene’s somber mood allows only delicate humor to maintain respect for the gravity of the murder.

FAIR-PLAY AND INFERENCE CONTRACT:
- FAIR PLAY CLUE TIMING: Never combine clue discovery and detective deduction in the same chapter. If a clue is first revealed to the reader in chapter N, the detective may only analyze, deduce from, or act on that clue in chapter N+1 or later.
- FAIR PLAY INFORMATION PARITY: The reader must see all clues BEFORE the detective uses them in reasoning. If the detective performs a test or makes a deduction, every piece of evidence supporting that conclusion must have been shown to the reader in earlier chapters.
- FAIR PLAY REVELATION SPACING: In the discriminating test scene, the detective can ONLY use clues that were revealed to the reader at least 1 full chapter earlier. Never introduce new clues or withheld information during the test.
- FAIR PLAY CONFRONTATION: During the final confrontation/revelation, the detective cannot surprise the reader with facts. Every piece of evidence cited must have been visible to the reader in prior chapters.
- Never solve by withheld information. Keep reader-information parity with detective reasoning.
- False assumption in force: The manor’s hall clock stopped at the actual time of Eleanor Voss’s death, anchoring the timeline of the murder.
- Hidden truth to progressively expose: It conceals the fact the clock was tampered with to run backward for forty minutes before stopping, fabricating a false timeline and allowing the culprit to construct an alibi.
- Inference path checkpoints to dramatize clearly (observation -> correction -> effect):
  - Step 1: obs: The manor’s hall clock pendulum shows reversed wear marks and an oil stain on the escapement lever inconsistent with normal maintenance. | corr: The clock’s escapement lever was reversed and lubricated to cause the pendulum to swing backward, making the clock run in retrograde before stopping. | effect: Narrows suspect pool to those with access to the clock room and knowledge of clock mechanics; eliminates Captain Hale and Beatrice Quill who lacked clock room access.
  - Step 2: obs: Multiple servants report the dinner bell chime sounded five minutes later than usual on the murder afternoon. | corr: A mechanical delay was introduced in the bell’s striker, skewing all timing references anchored to the bell chime, causing witnesses’ recollections to be temporally displaced. | effect: Eliminates alibis relying solely on dinner bell timing, tightening the murder time window earlier than believed.
  - Step 3: obs: Witnesses agree the clock stopped at ten minutes past eleven, and Dr. Finch was seen in the clock room shortly before that, but servant chore diaries show she was also scheduled in the nursery during that window. | corr: The assumed timeline based on the clock’s stopped time is false; the clock ran backward for forty minutes, allowing Dr. Finch to create a false alibi overlapping the actual murder time. | effect: Narrows timeline and implicates Dr. Finch by exposing impossibility of her alibi; eliminates other suspects whose alibis do not conflict with diary schedules.
  - Step 4: obs: The manor clock chimes sounded irregular and out of sync shortly before it stopped, as reported by multiple witnesses. | corr: These abnormal chimes are a direct consequence of the reversed escapement causing the pendulum to swing backward, supporting the conclusion that the clock’s time is unreliable. | effect: Strengthens the correction of timeline and supports elimination of suspects relying on the false clock time.
- Discriminating test method: trap
- Discriminating test design constraint: A controlled demonstration compares the manor clock’s stopped time and chime irregularities with the servant diary chore schedules and bell delay evidence, revealing the retrograde pendulum’s effect on the timeline. This test exposes the contradiction between the clock time and actual event timing, proving Dr. Mallory Finch’s manipulation and impossibility of her alibi.
- Test must rely on already-shown clue IDs: clue_9, clue_6, clue_mechanism_visibility_core
- Fair-play rationale: Step 1: The reversed wear marks on the clock pendulum and oil stain (early clues) show mechanical tampering. Step 2: Servant testimony and bell delay gear wear (mid clues) reveal timing distortions. Step 3: Conflicting servant chore diaries and witness placements of Dr. Finch (mid clues) expose the false alibi. Step 4: I
[truncated for prompt budget]

## Character Reference

### Eleanor Voss (she/her — NEVER he/him)
Eleanor speaks with a soft, deliberate rhythm, favoring formal turns of phrase and a gentle, almost coaxing tone
She often employs mild understatement to defuse tension and sprinkle conversation with quiet wit, never loud but always pointed.
Eleanor wrestles with the conflict between her affection for Captain Hale and her commitment to justice, fearing that her partiality may blind her to uncomfortable truths or betray her integrity as an investigator.

### Dr. Mallory Finch (she/her — NEVER he/him)
Mallory’s speech is crisp and economical, her words carefully chosen and delivered with an almost clinical detachment
Her humor, when it surfaces, is dry and deadpan, often catching others off guard with its unexpected bluntness.
Mallory struggles to reconcile her professional ethics with the personal risks of her affair, fearing that exposure would destroy her carefully constructed life and the fragile happiness she shares with Hale.

### Captain Ivor Hale (he/him — NEVER she/her)
Hale’s speech is economical and clipped, often laced with sardonic remarks that hint at his frustration
He favors military precision in his language but occasionally allows a dry, pointed wit to surface, especially when challenged or cornered.
He grapples with the fear that his duplicity—financial and romantic—will be revealed, threatening not only his position but his very identity as a man of honor and control.

### Beatrice Quill (she/her — NEVER he/him)
Beatrice's speech is elegantly crafted, often punctuated with pointed compliments and barbed remarks cloaked in civility
Her tone carries a subtle edge of polite savagery, using genteel language to deliver cutting observations that unsettle her interlocutors.
Beatrice struggles with the tension between her public image as a gracious hostess and her private ambitions, fearing that exposure of her manipulations would destroy her carefully maintained social standing.


## CHARACTER CONTRACTS (binding for this scene)
Each entry below constrains how this character must be written in this chapter.
These override generic style guidance when they conflict.

### Eleanor Voss[SHE]
Voice & mannerisms: Eleanor speaks with a soft, deliberate rhythm, favoring formal turns of phrase and a gentle, almost coaxing tone. She often employs mild understatement to defuse tension and sprinkle conversation with quiet wit, never loud but always pointed.
Sample voice fragments (match this register and rhythm):
  [comfortable] "One must always remember that appearances often veil more than they reveal, wouldn’t you agree?"
  [evasive] "I find that sometimes, the less said is quite enough to understand the gravity of the situation."
Humour: understatement — deploy rarely (level 0.3)
FORBIDDEN phrase (never write for Eleanor Voss): "the situation was extremely serious"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "N/A - Investigator, no motive to commit the crime." — do not surface in Act I.

### Dr. Mallory Finch[SHE]
Voice & mannerisms: Mallory’s speech is crisp and economical, her words carefully chosen and delivered with an almost clinical detachment. Her humor, when it surfaces, is dry and deadpan, often catching others off guard with its unexpected bluntness.
Sample voice fragments (match this register and rhythm):
  [comfortable] "The human body, much like society, is a delicate mechanism—one that requires careful maintenance."
  [evasive] "I assure you, my rounds were uninterrupted; any suggestion otherwise is purely speculative."
Humour: deadpan — deploy rarely (level 0.2)
FORBIDDEN phrase (never write for Dr. Mallory Finch): "he was utterly speechless"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Stands to lose her clandestine relationship and professional reputation if the victim exposes their affair; victim had threatened to reveal their liaison to Beatrice, risking scandal." — do not surface in Act I.

### Captain Ivor Hale[HE]
Voice & mannerisms: Hale’s speech is economical and clipped, often laced with sardonic remarks that hint at his frustration. He favors military precision in his language but occasionally allows a dry, pointed wit to surface, especially when challenged or cornered.
Sample voice fragments (match this register and rhythm):
  [comfortable] "Discipline, after all, is the backbone of both an army and a well-run estate."
  [evasive] "My whereabouts were unremarkable; I prefer to keep my movements as discreet as possible."
Humour: dry wit — deploy occasionally (level 0.5)
FORBIDDEN phrase (never write for Captain Ivor Hale): "a surge of determination washed over her"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Victim planned to call in a debt that would force Captain Hale to relinquish control of the estate’s finances; feared exposure of his private affairs that would ruin his reputation and standing." — do not surface in Act I.

### Beatrice Quill[SHE]
Voice & mannerisms: Beatrice's speech is elegantly crafted, often punctuated with pointed compliments and barbed remarks cloaked in civility. Her tone carries a subtle edge of polite savagery, using genteel language to deliver cutting observations that unsettle her interlocutors.
Sample voice fragments (match this register and rhythm):
  [comfortable] "One must always present the perfect smile; it is the currency of our society, after all."
  [evasive] "I was merely passing through the servant quarters; hardly an uncommon occurrence, I assure you."
Humour: polite savagery — deploy occasionally (level 0.6)
FORBIDDEN phrase (never write for Beatrice Quill): "she felt a wave of unease"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Motivated by jealousy and desire to eliminate the victim who sided with Captain Hale financially and threatened to undermine her growing control; feared losing social status and influence within the estate." — do not surface in Act I.



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

Primary Location: Pendleton Manor Estate (Pendleton Vale, England)
An imposing 18th-century manor house set within expansive, manicured grounds, Pendleton Manor Estate embodies the austere dignity and social stratification of English aristocracy in the 1930s, standing isolated amid rolling countryside several miles from the nearest village.

Key Locations Available:
- The East Wing Study (interior): Crime scene
- The Manor Library (interior): Clue discovery, gathering space
- Servants' Hall (interior): Gathering space and informal communication hub
- Formal Gardens and Grounds (exterior): Outdoor setting for movement, concealment, and discovery

Atmosphere (tonal cue only — do NOT reproduce this phrase verbatim in prose; translate into scene-specific, character-observed sensory language): tense and reserved, underscored by unspoken class divisions and impending political unease
Weather: damp, overcast autumn afternoon with intermittent drizzle

Era markers: domestic rotary dial telephones with limited lines | radio broadcasts common in living rooms | manual typewriters used for correspondence and reports | petrol-powered automobiles on country roads | passenger trains connecting nearest towns | party-line telephone exchanges linking estate and village

USAGE GUIDELINES:
1. First mention of location: Ground the scene using sensory details drawn from the profiles — paraphrase these into what the POV character directly observes and experiences, not a summary of the room's general qualities
2. Geographic grounding: Reference the specific place (Pendleton Vale, England) naturally in dialogue or narrative
3. Action scenes: Integrate physical layout details (access, sightlines, constraints)
4. Atmospheric scenes: Reference weather, lighting, sounds from sensory palette
5. Era details: Weave in period markers naturally
6. Consistency: Keep all location descriptions aligned with profiles
7. Each chapter opening must anchor to a named location from this list
8. Include at least 2 sensory cues + 1 atmosphere marker in each chapter opening
9. Do NOT use generic repeated manor/storm filler without profile-specific details

SENSORY PALETTE (use 2-3 senses per scene):
The East Wing Study (interior):
  - Visual: dim candlelight flickering on oak panels, rain-streaked leaded glass windows, scattered typed documents
  - Sounds: soft ticking of grandfather clock, muffled footsteps on distant corridors, rustling of paper in silence
  - Scents: aged leather bindings, faint tobacco smoke, ink and damp paper
  - Touch: smooth polished desk surface, crisp typed paper edges

The Manor Library (interior):
  - Visual: rows of leather-bound volumes, flickering firelight on marble hearth, dust motes in stained glass rays
  - Sounds: soft crackle of burning logs, quiet turning of book pages, distant clock chimes
  - Scents: old paper and beeswax polish, smoky wood fire, faint leather and dust
  - Touch: soft velvet armrests, smooth leather book spines

Servants' Hall (interior):
  - Visual: worn wooden furniture, flickering stove flames, chalk-written notice board
  - Sounds: clinking of cups and cutlery, murmured conversations, footsteps on flagstone floor
  - Scents: smoky peat from stove, freshly baked bread, soap and starch
  - Touch: rough wooden bench surfaces, warm stove metal

⛔ REFERENCE DATA — DO NOT TRANSCRIBE VERBATIM: The above profiles are structural guides only. Generate original prose that evokes these qualities; do not reproduce the exact phrasing or sentence structure of the profile paragraphs.

SCENE OPENING RULE: When opening a scene in a new location, write what the POV character directly observes and physically senses at that moment — not a general description of the room's qualities. The reader must feel present, not briefed. Sensory details must be observed by the character, not stated as fact ab
[truncated for prompt budget]

## Texture Pool
Draw on these as opportunities arise — you are not required to use them.

- May 1934 in rural Yorkshire presents a world caught between tradition and uncertain change
- The manor estate, steeped in centuries-old aristocratic rituals, is wrapped in the damp chill of spring drizzle and overcast skies
- Daily life unfolds under the strict gaze of social hierarchy, where servants move discreetly and guests observe rigid etiquette
- Radios hum softly in drawing rooms, and rotary telephones offer rare glimpses of the outside world
- Fashion leans toward modest elegance, with women favoring bias-cut silks and men wearing muted wool suits, reflecting a cautious mood

TEMPORAL CONTEXT:

This story takes place in May 1934 during spring.

Seasonal Atmosphere:
- Weather patterns: cool temperatures often between 50-60°F (10-16°C), frequent overcast skies with intermittent drizzle, early morning fog lingering in rural areas
- Daylight: Lengthening daylight hours with sunsets around 8:30 pm, twilight extending into late evening
- Seasonal activities: Gardening in estate grounds with planting of summer flowers and vegetables, Afternoon tea parties held outdoors when weather permits, Country walks and drives to enjoy spring bloom amid lingering chill
- Seasonal occasions: May Day (May 1) - Labour demonstrations and celebrations, Ascension Day (variable date, often in May) - marked by church services, Early May bank holiday (first Monday in May)
- Season: spring

Period Fashion (describe naturally):
- Men formal: Single-breasted wool suits in muted greys and browns, Starched detachable collars with silk ties, Two-tone Oxford shoes
- Men casual: Knitted cardigans over shirt and tie, Plus-fours or flannel trousers for country pursuits, Soft felt trilby hats
- Men accessories: Pocket watches with chain, Leather gloves for outdoor wear, Silk pocket squares
- Women formal: Bias-cut silk dresses with modest necklines and short sleeves, Cloche or brimmed felt hats adorned with ribbons or feathers, Kid leather gloves for daytime events
- Women casual: Cotton day dresses with floral prints, Lightweight cardigans and berets, Low-heeled Mary Jane shoes
- Women accessories: Beaded handbags, Pearl necklaces and brooches, Lace parasols for occasional sun

Cultural Context (reference naturally):
- Music/entertainment: Bing Crosby – "Sunny Side of the Street", Duke Ellington – "Mood Indigo", Cole Porter – "Anything Goes"; Films: It Happened One Night (1934), The Thin Man (1934); Theatre: Noël Coward’s plays touring London, Broadway revivals of operettas; Radio: BBC Home Service broadcasts of news and drama, Variety shows featuring popular singers
- Typical prices: Loaf of bread: 5 pence, Pint of milk: 3 pence, Taxi ride across town: 2 shillings
- Current events: The British government under Ramsay MacDonald faces criticism amid rising unemployment; Labour unrest and May Day demonstrations highlight ongoing economic tensions
- Literature: Agatha Christie’s "Murder on the Orient Express" (1934) | Daphne du Maurier’s "Jamaica Inn" (1934) | John Steinbeck’s "Tortilla Flat" (1935 forthcoming, but anticipation present) | [Detective and mystery fiction] | [Social novels exploring class and economic hardship] | [Adventure and travel literature]
- Technology: Improved domestic electric refrigerators gaining popularity | Advancements in radio receiver technology | Early experiments with jet propulsion reported in scientific circles | Rotary dial telephones with limited household lines | Manual typewriters for correspondence and record-keeping | Wind-up gramophones for home music listening
- Daily life: Morning newspaper reading by the fire, Afternoon tea served with scones and clotted cream, Evening card games or radio listening in the drawing room
- Social rituals: Formal Sunday lunch with family and close acquaintances, Guests adhering to strict invitation and dress protocols

Atmospheric Details:
The damp chill of a persistent drizzle softens the rustle of newly green leaves and the scent of moist earth in t
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

• [clue_1] The manor’s hall clock pendulum shows reversed wear marks and an oil stain on the escapement lever indicating tampering.
  Category: temporal | Criticality: essential | Supports inference step 1
  Points to: The manor’s clock pendulum was manipulated to run backwards.

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

INVESTIGATION LOG — WHAT IS ESTABLISHED (do not re-establish, do not repeat):
• Suspects still unresolved: Captain Ivor Hale[HE], Beatrice Quill[SHE]
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
Known location profile anchors: Pendleton Manor Estate, The East Wing Study, The Manor Library, Servants' Hall, Formal Gardens and Grounds, Manor hall, near the grand clock
LOCATION NAME CAPITALISATION (HARD REQUIREMENT — validated):
All named locations in your prose MUST use the EXACT capitalisation from the CML profiles.
Canonical forms: "Pendleton Manor Estate", "The East Wing Study", "The Manor Library", "Servants' Hall", "Formal Gardens and Grounds", "Manor hall, near the grand clock"
Writing a location in lowercase (e.g. "drawing room" instead of "Drawing Room") is a validated error. Every time you mention a named location, copy its capitalisation from the list above.
- Chapter 1: OPENING STYLE (HARD): Start the VERY FIRST SENTENCE with a named character performing a physical action or motion — e.g. "[Name] crossed the threshold…" / "[Name] set down the glass…" / "[Name] rose from the chair…". Anchor opening in "Manor hall, near the grand clock". HARD REQUIREMENT for the first 2 paragraphs: (a) include 2+ sensory words — choose from smell/scent/sound/echo/silence/creak/whisper/cold/warm/damp/rough/smooth/glow/shadow/flicker/dim — and (b) include 1+ atmosphere/time word — choose from rain/wind/fog/storm/mist/thunder/evening/morning/night/dawn/dusk/season/afternoon/midday/noon/midnight/twilight/sunrise/sunset/daylight/sunlight/overcast/cloudy/bright/dark. These are validated requirements, not style suggestions; missing them triggers a retry.

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

PROMPT BUDGET SUMMARY: budget=32000 tokens; fixed=6069; context=11463; dropped=[none]; truncated=[fair_play_contract, location_profiles, temporal_context, pronoun_accuracy]

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
4. Integrate at least two concrete era-grounded details per chapter from setting refinement signals: domestic rotary dial telephones with limited lines | radio broadcasts common in living rooms | manual typewriters used for correspondence and reports | party-line telephone exchanges connecting estate to nearby village | telegrams sent via nearest town telegraph office | postal mail with regular but not daily delivery.
5. Respect setting movement/access constraints in scene action and alibis: manor's layout includes restricted areas such as private family wings and servant-only passages | natural access limited by gated entrances and estate boundary walls | weather conditions typical of temperate climate affecting outdoor movement and evidence preservation | entry controlled via estate gates with permissions required for visitors | staff and residents follow daily schedules restricting movement after dark.
6. Sustain social coherence with this backdrop pressure: Amidst economic strain and political unease, the aristocratic Voss family and their close associates gather at the isolated manor estate where rigid class protocols and estate controls confine them, intensifying tensions as a mechanical clock-tampering murder disrupts their fragile social order.
7. Maintain continuity around these socially central cast anchors where relevant: Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill.
8. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Moderate: Plot similarity 0.55 and solution similarity 0.50 with 'The Mysterious Affair at Styles' due to timing manipulation and false assumption about time anchoring.
9. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Mild: Setting similarity 0.60 with 'The Mysterious Affair at Styles' due to similar country manor estate setting and era proximity.
10. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Mild: Structural similarity 0.60 with 'The Mysterious Affair at Styles' due to similar constraint counts and inference path length.

CRITICAL PROSE REQUIREMENTS:

The CML specifies exact requirements for certain validation-critical scenes. You MUST include these elements at the specified positions.

**Discriminating Test Scene (Act 3, Scene 4):**
Required elements: Execute the discriminating test comparing clock time, chimes, and servant diaries, Observe the contradiction between clock stopping time and chore schedules, Draw conclusion of Dr. Mallory Finch's guilt based on timeline falsification
Test type: trap

**Suspect Clearance Scenes:**
- Captain Ivor Hale (Act 3, Scene 5): Clear alibi established through witness testimony and garden path access logs
  Clues: footprints near clock room matching Captain Hale’s shoes, witnesses placing Captain Hale away from clock room during murder timeframe
- Beatrice Quill (Act 3, Scene 5): Servant diary entries and social observations confirm presence in servant quarters during key times
  Clues: servant diary chore schedules, testimonies on Beatrice’s nervous behavior but confirmed whereabouts

**Culprit Revelation Scene (Act 3, Scene 6):**
Method: Confrontation with physical clock tampering evidence and timeline contradiction

**Clue Placement for These Chapters:**
- clue_1 must appear in Act 1, Scene 1 via Direct observation

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
- Chapter 1:
  - STRUCTURAL ARCHETYPE — Chapter 1 must be: DISCOVERY
      ✓ MUST contain: body found / victim identified
      ✗ MUST NOT contain: formal accusation or interrogation
  - Word count: Target 1250 words. Achieve this through plot events, dialogue exchanges, and physical investigation — not through atmospheric repetition or extended internal reflection. Each 200-word segment should contain at minimum one concrete story event (a discovery, a conversation exchange, a physical action or movement). Padding with atmosphere alone is not acceptable.
  - VICTIM IDENTITY LOCK (MANDATORY): name the victim as "Eleanor Voss" in the discovery scene. After first mention, do not use unnamed placeholders such as "the victim" without naming Eleanor Voss in the same paragraph.
  - Opening: Begin with a character action, spoken line, or clock/time marker — never a location name or location-description phrase.
  - Scene is set in: Manor hall, near the grand clock — reference it naturally within the paragraph, never as your opening phrase.
  - Opening atmosphere (MANDATORY — validator enforced): the first paragraph MUST contain at least one of: rain / wind / fog / storm / mist / thunder / evening / morning / night / dawn / dusk / season / afternoon / midday / noon / midnight / twilight / sunrise / sunset / daylight / sunlight / overcast / cloudy / bright / dark / grey / pale / cold / warm / chill / crisp / damp / drizzle / haze / lamplight / firelight. A chapter that omits all of these from its opening paragraph will be rejected.
  - CLUE OBLIGATIONS — mandatory prose elements (do NOT omit or bury):
    • The manor’s hall clock pendulum shows reversed wear marks and an oil stain on the escapement lever indicating tampering. [clue_1] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: The manor’s clock pendulum was manipulated to run backwards.
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
  - ALIBI LOCK: Dr. Mallory Finch's established alibi is "Between quarter past ten and quarter to eleven". Do NOT place Dr. Mallory Finch at any other location or in any other activity during the crime window. Any contradiction is a continuity error that triggers a retry.
- Locked fact phrase obligations:
  - If this batch mentions The exact time shown on the stopped clock face, write exactly: "ten minutes past eleven".
  - If this batch mentions The exact amount the clock was wound back, write exactly: "forty minutes".
- Seasonal vocabulary allow-list: spring, vernal, springtime.
- Forbidden seasonal words: summer, autumn, winter.

⛔ PRONOUN TABLE — re-check after EVERY paragraph before writing the next:
    Eleanor Voss: she/her/her
    Dr. Mallory Finch: she/her/her
    Captain Ivor Hale: he/him/his
    Beatrice Quill: she/her/her
  Any sentence containing a pronoun must agree with this table. Correct mismatches before moving on.

FROZEN FACT STATE (DO NOT ALTER):
- Timeline anchor: May (spring).
- Month, season, weather, and time-of-year language in this batch must stay compatible with spring.
- Established timeline fact: Clock stopped at ten minutes past eleven
- Established timeline fact: Dinner bell chime expected at ten minutes past six
- Established timeline fact: Servant diary chore schedules with strict start and end times
- If referenced, use exact phrase: "ten minutes past eleven" (The exact time shown on the stopped clock face).
- If referenced, use exact phrase: "forty minutes" (The exact amount the clock was wound back).

STORY TO DATE (REFERENCE ONLY — DO NOT COPY VERBATIM):
- No previous chapter text exists yet for this batch.

[SCENE COMPLETENESS CONTRACTS — MANDATORY. Each contract below lists what you MUST enact in that chapter. Do not summarise or mention these labels in the prose — enact them organically.]
Chapter 1 (Act 1) completeness contract:
  PIVOT ELEMENT (MANDATORY — write this into the prose, shown not told): "The manor’s hall clock pendulum shows reversed wear marks and an oil stain on the escapement lever indicating tampering"
  FACT ESTABLISHED (MANDATORY — reader must know this by chapter end): "Initial evidence suggests the manor clock was tampered with, introducing doubt about the timeline anchored to the clock"
  RED HERRING (MANDATORY — seed naturally, not flagged as false): [rh_1] Eleanor Voss mentions the manor clock stopped exactly at ten minutes past eleven, seeding the false inference that the murder happened at that time

# Case Overview
Title: The Retrograde Pendulum Murder
Era: 1930s
Setting: Isolated country estate
Crime: murder (mechanical clock-tampering murder)
Culprit: Dr. Mallory Finch
False assumption: The manor’s hall clock stopped at the actual time of Eleanor Voss’s death, anchoring the timeline of the murder.
Cast: Eleanor Voss (she/her), Dr. Mallory Finch (she/her), Captain Ivor Hale (he/him), Beatrice Quill (she/her)

Setting Lock: Keep all scenes and descriptions consistent with the stated setting (Isolated country estate). Do not introduce a different location type. Do not invent an alternative estate name. The only permitted name for this property is "Isolated country estate" — any other estate name (e.g., "Caldwell Manor", "Ashwood Hall", or any invented proper name) is a continuity error that will be caught and rejected.

⛔ PRONOUN LOCK (verify every sentence before writing):
• Eleanor Voss — she/her/her (NEVER he/him)
• Dr. Mallory Finch — she/her/her (NEVER he/him)
• Captain Ivor Hale — he/him/his (NEVER she/her)
• Beatrice Quill — she/her/her (NEVER he/him)

Outline scenes:
[
  {
    "sceneNumber": 1,
    "act": 1,
    "title": "Discovery of the Body and Initial Clocks Examination",
    "setting": {
      "location": "Manor hall, near the grand clock",
      "timeOfDay": "Morning after the murder",
      "atmosphere": "Tense household awaiting the detective's arrival"
    },
    "characters": [
      "Eleanor Voss",
      "Dr. Mallory Finch",
      "Captain Ivor Hale",
      "Beatrice Quill"
    ],
    "purpose": "Introduce the crime and detective; establish initial observations",
    "cluesRevealed": [
      "clue_1"
    ],
    "dramaticElements": {
      "conflict": "The manor’s hall clock shows reversed wear marks and oil stains, puzzling the household",
      "tension": "All present are uneasy about the mysterious stopped clock and the victim’s death",
      "microMomentBeats": [
        "Eleanor Voss lingers at the door, her grief unguarded and raw"
      ]
    },
    "summary": "Eleanor Voss discovers the body in the manor hall near the grand clock, which is stopped at ten minutes past eleven. the doctor Finch and the captain Hale join the scene, their expressions guarded. The detective, a visiting relative invited for the weekend, notes the reversed wear marks and oil stain on the clock’s escapement lever, suggesting tampering.",
    "estimatedWordCount": 1800,
    "pivotElement": "The manor’s hall clock pendulum shows reversed wear marks and an oil stain on the escapement lever indicating tampering",
    "factEstablished": "Initial evidence suggests the manor clock was tampered with, introducing doubt about the timeline anchored to the clock",
    "permittedBehavioursByAct": [
      {
        "characterName": "Eleanor Voss",
        "behaviour": "Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted."
      },
      {
        "characterName": "Dr. Mallory Finch",
        "behaviour": "Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted."
      },
      {
        "characterName": "Captain Ivor Hale",
        "behaviour": "Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted."
      },
      {
        "characterName": "Beatrice Quill",
        "behaviour": "Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted."
      }
    ],
    "redHerringPlacement": {
      "redHerringId": "rh_1",
      "placementDetail": "Eleanor Voss mentions the manor clock stopped exactly at ten minutes past eleven, seeding the false inference that the murder happened at that time"
    },
    "emotionalRegister": "A heavy, somber atmosphere of loss and fragile social order sets the stage.",
    "dominantCharacterNote": {
      "name": "Eleanor Voss",
      "voiceRegister": "Eleanor speaks softly and deliberately with formal phrasing and gentle wit, favoring understatement to defuse tension."
    },
    "humourGuidance": {
      "permission": "conditional",
      "character": "Eleanor Voss",
      "form": "understatement",
      "condition": "Only understated, subtle wit by Eleanor Voss to relieve tension without undermining gravity"
    },
    "eraTextureNote": "Limited and slow communication via rotary dial telephones and telegrams; No modern forensic tools beyond fingerprinting and basic toxicology; Restricted transportation on rural country lanes and limited automobile ownership; Strict social protocols limiting servant and guest movements; Lack of electronic surveillance or instant information flow; Mechanical devices operate strictly within 1930s physical laws",
    "locationRegisterNote": ""
  }
]
```

## Message 3 (role=user)

```text
BEFORE SUBMITTING YOUR JSON — verify this checklist:
□ Each chapter reaches the hard floor of 450 words and aims for 1250 words or more.
□ If you mention locked evidence, you used the exact locked phrase verbatim.
□ Allowed seasonal words only: spring, vernal, springtime.
□ Forbidden seasonal words: summer, autumn, winter.
□ Chapter 1: "The manor’s hall clock pendulum shows reversed wear marks and an oil stain on the escapement lever indicating tampering." is placed in the first 25% of the chapter, followed by an explicit inference or suspicion paragraph.
□ PRONOUN AUDIT — for every character you named in your chapters, list the pronouns you actually used, then verify against the canonical table. Correct any mismatch before outputting. Do NOT include this audit in your JSON output.
  Character            | Canonical     | Used in draft | Match?
  ---------------------|---------------|---------------|-------
  Eleanor Voss         | she/her/her/herself       | [fill in]     | [yes/no]
  Dr. Mallory Finch    | she/her/her/herself       | [fill in]     | [yes/no]
  Captain Ivor Hale    | he/him/his/himself        | [fill in]     | [yes/no]
  Beatrice Quill       | she/her/her/herself       | [fill in]     | [yes/no]
□ Return valid JSON only.
```
