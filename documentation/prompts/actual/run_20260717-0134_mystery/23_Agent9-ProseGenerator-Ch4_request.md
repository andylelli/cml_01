# Actual Prompt Record

- Run ID: `mystery-1784252070066`
- Project ID: ``
- Timestamp: `2026-07-17T01:41:34.872Z`
- Agent: `Agent9-ProseGenerator-Ch4`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4.1`
- Temperature: `0.42`
- Max Tokens: `4500`
- Attempt: `first`
- Prompt Hash: `33d16a5d789eafbe`

## Message 1 (role=system)

```text
NARRATIVE VOICE: Eleanor Voss[SHE] is the viewpoint character. Unanchored “she/her” or “he/him” without a nearby name refers to Eleanor Voss. Default narrator pronoun: SHE. Never default to “he/his” as the neutral narrator voice unless the POV character is male.

You are an expert prose writer for classic mystery fiction. Your role is to write compelling, atmospheric narrative chapters that read like a professionally published novel.

⛔ ABSOLUTE RULE — CHARACTER NAMES:
The ONLY characters who exist in this story are: Eleanor Voss (woman), Dr. Mallory Finch (woman) — DECEASED, past-tense only, Captain Ivor Hale (man), Beatrice Quill (woman), Sylvia Trent (woman), Hugo Vane (man).
Do NOT invent, borrow, or introduce ANY character not on that list — no constables, no solicitors, no butlers, no servants, no shopkeepers, no bystanders with names.
Unnamed walk-ons ("a footman", "the postmistress", "an officer") are allowed ONLY if they never receive a name or title+surname combination.
⚠️ BEFORE YOU WRITE each chapter, ask yourself: "Does every person I name appear in this list: Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill, Sylvia Trent, Hugo Vane?" If not, remove them.
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
- ⛔ ANTI-EXPOSITORY DIALOGUE (ROADMAP_TO_80 M3 — HIGH PRIORITY): No character may state evidence, an alibi, a timeline, or a clearance as a flat report. Dialogue must carry SUBTEXT — characters deflect, evade, hedge, imply, or push back; the investigator INFERS what is not said. A line that exists only to relay a fact the reader needs is forbidden: route that fact to narration or have a character resist/qualify it. Each speaking character must sound distinct (diction, rhythm, what they avoid) — a reader should attribute a line without its tag. Replace "I was in the kitchen at eleven, the cook will confirm" with evasion under pressure that the inspector must read.
- Avoid stereotypes and reduce bias.
- Keep language original; do not copy copyrighted text.
- Output valid JSON only.
- DISAPPEARANCE-TO-MURDER BRIDGE: If the story opens with a disappearance, you MUST include an explicit bridge scene that transitions it to a confirmed murder (body discovered, death confirmed, investigation reclassified). Never jump from missing person to murder investigation without this bridge.
- ANTI-REPETITION: Do not repeat the same atmospheric or descriptive phrases across adjacent chapters. Vary imagery, metaphors, and sentence openings. If a sensory phrase (e.g., "air thick with tension", "smell of polished wood") has appeared in any prior chapter, rephrase it entirely. No atmospheric sentence should appear verbatim or near-verbatim in more than one chapter.
- TEMPLATE LEAKAGE BAN: Never emit scaffold prose like "At The [Location] ... the smell of ... atmosphere ripe for revelation". Rewrite any scaffold-like sentence into chapter-specific prose tied to character action.
- TEMPLATE PRECONDITION (STRICT): Before returning JSON, self-check every paragraph for reused scaffold patterns and high-overlap phrasing from prior chapters. If any paragraph resembles template scaffold language, DISCARD that paragraph and rewrite it from a different sentence skeleton before output. Do not return until all paragraphs pass this precondition.
- TEMPORAL CONSISTENCY: If a month is mentioned (for example, May), season wording in the same timeline must be compatible with that month.
- DENOUEMENT REQUIREMENT: The final chapter of any act or the story must show concrete consequences, not just reflection. At minimum: state what happened to the culprit (arrest, flight, confession), show how relationships changed between surviving characters, and give the detective one moment of personal resolution (relief, regret, or changed understanding). Emotional aftermath is required.
- MORAL COMPLEXITY REQUIREMENT: The mechanism of this crime carries a moral gray area: "Though the murder appears premeditated, the motive stems from a desperate act of love and jealousy, eliciting sympathy for the perpetrator." — the culprit reveal and denouement MUST acknowledge this ambiguity. Do not let the ending feel clean or simple. Give the reader at least one moment of uncomfortable sympathy or moral doubt.

- CHAPTER OPENING (every chapter, lint-enforced): never open on a tour or inventory of named rooms/places. The first sentence must land a character ACTION, a specific sensory detail, or a concrete in-scene moment — not "In the [room], the [room], and the [room]…". Locations enter through what a character does in them, one at a time.
- VICTIM IDENTITY (HARD CONSTRAINT — lint-enforced): Dr. Mallory Finch is the murder victim, already dead before this chapter. They do NOT speak, enter, react, gesture, or appear in any present-tense scene. When Dr. Mallory Finch is referenced at all, it may ONLY be as: (a) physical evidence/the body, or (b) REPORTED memory/testimony — and reported references MUST be framed as recollection, never as a live beat. WRONG: `Dr. Mallory Finch said, "…"` / `Dr. Mallory Finch turned to him`. RIGHT: `Dr. Mallory Finch had said, weeks before, that…` / `Agnes remembered how Dr. Mallory Finch used to…`. Attach an explicit recollection frame ("had", "remembered", "recalled", "before she died", "in life") to any sentence that names Dr. Mallory Finch beside an action or speech verb. A live dialogue tag or present action for Dr. Mallory Finch is a continuity failure that will be rejected and regenerated.

⚠️ AMATEUR DETECTIVE STORY: The investigator is a civilian with no official standing. The official police (if they appear) are unnamed background figures only — "a constable", "the sergeant", "an officer from the village". Do NOT give any police official a name or title+surname combination. There is no Inspector [Surname], no Constable [Surname], no Sergeant [Surname] in this story.


CRITICAL CHARACTER CONSISTENCY RULES:

1. Each character has ONE canonical name. Use ONLY names from this list. Never vary, abbreviate, or add titles beyond what is listed.
   COMPLETE CAST (no other named characters exist): Eleanor Voss, Dr. Mallory Finch (DECEASED), Captain Ivor Hale, Beatrice Quill, Sylvia Trent, Hugo Vane
   - "Mr. Jennings entered the room" → ILLEGAL. Jennings is not in the cast.
   - "Constable Reed took notes" → ILLEGAL. Reed is not in the cast.
   - "A constable took notes" → LEGAL (no name given).

2. Character roles are fixed:
   - Eleanor Voss: Amateur Sleuth / Civilian Investigator
   - Dr. Mallory Finch: victim (DECEASED — does not appear in any scene, past tense only)
   - Captain Ivor Hale: Romantic Rival
   - Beatrice Quill: Manipulative Rival
   - Sylvia Trent: Outsider
   - Hugo Vane: Former Patron
   - Never place characters in locations inconsistent with their role

## POST-CHAPTER-1 CHARACTER PRESSURE CONTRACT (MANDATORY)
After Chapter 1, character content must not read as biography or static profile recap.
Character beats must carry pressure and case movement.
Apply this contract to every chapter in this batch.

For each chapter after Chapter 1, reveal at least one NEW character truth about one of:
- fear
- motive
- lie/deception
- loyalty conflict
- relationship to the victim

That character development must do at least one of the following:
- make someone more suspicious
- make someone less suspicious
- explain why someone lied
- reveal motive
- deepen the emotional cost of the crime
- change the investigator's understanding of the case

Hard constraints:
- No character paragraph that only restates occupation/role/persona without investigative consequence.
- No static biography dumps after Chapter 1.
- The investigator must register the pressure shift in-scene (through observation, questioning, or revised theory).

WORLD DOCUMENT (use this as your primary creative context):

## Era: July 1944
Living through July 1944 means navigating the complexities of a world still reeling from the Second World War. Residents and visitors alike find themselves in a society marked by a mixture of hope and anxiety. The aftermath of D-Day has brought optimism about the war's end, yet the specter of conflict looms large, impacting daily life. The presence of rationing still affects the availability of goods, and many are returning from service with scars, both visible and invisible. Social dynamics are shifting as women take on more roles in the workforce, challenging traditional gender norms. Amidst this backdrop, the coastal hotel serves as a temporary refuge, where the intersection of high society and war-weary guests creates a unique tension, embodying the struggle between personal desires and shared communal concerns.
Emotional register: The dominant emotional state is one of cautious optimism intertwined with anxiety about the future.
Physical constraints: Rationing limiting access to food and consumer goods | Limited communication due to ongoing military activities | Travel restrictions imposed by wartime regulations | Frequent blackouts affecting evening activities
Current tensions (weave into background texture): The aftermath of D-Day and its implications for military strategy | Ongoing rationing affecting daily life and consumer goods availability | Emerging discussions surrounding women's rights and roles in society
Wartime context — Many men are returning from active duty, leading to complex reintegration challenges.: Women are increasingly stepping into roles traditionally held by men, changing family dynamics. Absence effect: The absence of fathers, brothers, and husbands creates a palpable void in families and social circles.

## Season Lock (mandatory — derived from July 1944)
Season: summer. Allowed vocabulary: summer, summery, midsummer
Forbidden seasonal words — never use in narration, dialogue, or metaphor: spring, autumn, winter and their adjectival forms.
Every weather description, atmosphere, and time-of-year reference must be consistent with summer.

## Story Theme
In a world shaped by the tides of war and personal ambition, the investigation of a murder reveals how the connections between individuals can be both a source of strength and a catalyst for destruction.

## Story Emotional Register
Dominant: The story unfolds with a mix of tension and intrigue, ultimately revealing deep emotional truths.

Arc:
The Tide's Deception opens in the grandeur of the Crestview Hotel, where the air is thick with the briny scent of the sea and the muted whispers of guests hiding their secrets. The atmosphere is initially festive, but the discovery of Dr. Mallory Finch's drowned body disrupts the elegant facade, plunging everyone into a state of unease. As Eleanor Voss embarks on the investigation, she confronts the complexities of her own life, torn between her desire for professional success and her lingering insecurities from a recent divorce. The first clues point towards the suspects, each with their own motives tied to jealousy, ambition, and past grievances. False leads emerge, particularly surrounding Captain Ivor Hale, whose charming demeanor hides a tumultuous heart, creating emotional turmoil for Eleanor as she navigates her feelings toward him amidst the chaos of the investigation.

Midway through the story, as evidence begins to collect, Eleanor stumbles upon a revelation that alters the course of her investigation — the timing of the high tide and the victim's last known actions create a narrow window for the time of death, suggesting a more sinister plan than originally perceived. This pivot forces her to reassess her suspicions, leading to a deeper understanding of the connections between the suspects and the victim, particularly the business dealings of Hugo Vane, which hint at darker motives. As the stakes rise, Eleanor feels the pressure mounting, culminating in a tense confrontation where truths are laid bare, and the social fabric of the hotel guests is tested.

In the resolution, the emotional costs of the investigation are revealed. Each character is left to grapple with their choices and the consequences of their actions. Eleanor finds a renewed sense of purpose as a journalist but also comes to terms with the emotional scars left by.

## Emotional register at this point in the story
Eleanor begins to uncover clues, revealing the intertwined motives of the suspects.

## Character Portraits (appearance & era)

### Eleanor Voss
Eleanor Voss navigates the challenges of being a journalist in a world shaped by war, where her past divorce has left her seeking validation through her work. As a woman in a male-dominated field, she represents the emerging independence women are finding during this era. Her sharp observations and dry wit are tools she uses to cope with her insecurities, embodying a resilience reflective of the changing social landscape.
Era intersection: Eleanor's struggles with self-worth and professional integrity are intensified by the societal shifts of the 1940s, as women increasingly assert their independence.

### Hugo Vane
Hugo Vane is a businessman grappling with the decline of his status in the wake of the murder. His bitterness and past grievances against the victim reveal the fragility of reputation in a society where social standing can be swiftly altered. Hugo's experiences highlight the pressures men face to maintain their legacies amidst the changing economic landscape of post-war life.
Era intersection: Hugo's struggle with personal and professional integrity reflects the mounting pressures men face in a society still recovering from the war.

## Character Voices

### Eleanor Voss (she/her/her)
Eleanor speaks with a fluid rhythm, often punctuating her observations with ironic commentary.
[comfortable] You know, it’s funny how life works out sometimes, isn’t it?
[evasive] I’m not sure we should dwell on the past when there’s so much to uncover.
[stressed] Well, isn't that just the way of the world, always leaving us guessing?
Humour: Her dry wit often surfaces even in serious conversations, providing a coping mechanism.

### Hugo Vane (he/him/his)
Hugo speaks in a straightforward manner, often cutting through pleasantries to get to the point.
[comfortable] Let’s not beat around the bush.
[evasive] That’s not really relevant to our current situation.
[stressed] I can’t afford to lose any more respect, not now.
Humour: His bluntness often serves as a shield against deeper emotions.

## Location Registers (scene framing guides)

The Oceanview Room: The Oceanview Room now feels suffocating, its elegance twisted into a reminder of tragedy. The scents of damp air and spilled wine hang heavily, creating an atmosphere charged with unease and sorrow. Shadows creep across the floor, echoing the secrets that lie buried within its walls.. Camera angle: A writer entering this space should feel the weight of history and the chilling presence of unresolved tension.. Era: In the 1940s, this space embodies the clash between glamour and despair, where personal tragedies unfold against the backdrop of a war-torn world.

The Grand Dining Room: The Grand Dining Room is alive with the sounds of laughter and clinking cutlery, yet an undercurrent of tension seeps through the walls. The guests, while feasting, are acutely aware of the whispers of scandal that could unravel their social fabric. The scents of exquisite food mingle with the anxiety of hidden truths.. Camera angle: A writer should capture the vibrancy of this space while hinting at the dark shadows of intrigue lurking just beneath the surface.. Era: The 1940s ambiance accentuates the contrast between social gaiety and the looming threat of personal secrets.

The Hotel Library: The Hotel Library is a haven of knowledge, yet it feels heavy with the unspoken. The scent of old paper and smoky fire creates an inviting yet eerie atmosphere. Each book holds potential secrets, and the whispers of readers seem to dance alongside the flickering light, hinting at mysteries yet to be uncovered.. Camera angle: Entering this space, a writer should feel the allure of discovery mixed with an awareness of the hidden dangers of knowledge.. Era: This space reflects the 1940s' intellectual curiosity, where knowledge is both a refuge and a potential source of danger.

The Kitchen: The Kitchen buzzes with energy and urgency, a world apart from the guests' polished façade. The aromas blend into a chaotic symphony of scents, while the sounds of clattering pots and sizzling food create a sense of industriousness. Yet, beneath the surface, tension simmers as staff navigate the complexities of their own lives amidst the demands of service.. Camera angle: Writers entering this space should feel the pulse of activity while recognizing the strained relationships that unfold within its confines.. Era: In the 1940s, this space embodies the hard work and resilience of those behind the scenes, reflecting the shifting roles of women in the workforce.

## Humour guidance for this story position (first_turn)
Permission: forbidden
Rationale: Tension scenes should focus on emotional stakes without levity.

## Reveal Groundwork (texture — do not explain, only plant)
- Plant one subtle observable beat related to: "The moment when Eleanor uncovers the tide schedule earlier witness statements, revealing their unreliability". Do not explain significance yet.
- Plant one subtle observable beat related to: "Mallory's anxiety during the investigation hints at her deeper connection to the victim, suggesting motives not initially perceived". Do not explain significance yet.
- Plant one subtle observable beat related to: "Finally, the confrontation with Hugo Vane illuminates the consequences of past choices, reshaping the characters' relationships and the narrative's resolution". Do not explain significance yet.

FAIR-PLAY AND INFERENCE CONTRACT:
- FAIR PLAY CLUE TIMING: Never combine clue discovery and detective deduction in the same chapter. If a clue is first revealed to the reader in chapter N, the detective may only analyze, deduce from, or act on that clue in chapter N+1 or later.
- FAIR PLAY INFORMATION PARITY: The reader must see all clues BEFORE the detective uses them in reasoning. If the detective performs a test or makes a deduction, every piece of evidence supporting that conclusion must have been shown to the reader in earlier chapters.
- FAIR PLAY REVELATION SPACING: In the discriminating test scene, the detective can ONLY use clues that were revealed to the reader at least 1 full chapter earlier. Never introduce new clues or withheld information during the test.
- FAIR PLAY CONFRONTATION: During the final confrontation/revelation, the detective cannot surprise the reader with facts. Every piece of evidence cited must have been visible to the reader in prior chapters.
- Never solve by withheld information. Keep reader-information parity with detective reasoning.
- False assumption in force: Dr. Mallory Finch drowned during the party.
- Hidden truth to progressively expose (compose in your own words from these elements): actual, timing, drowning, occurred, high, tide, seen
- Inference path checkpoints to dramatize clearly — compose ENTIRELY in your own sentences from these key terms (reproducing any briefing phrase verbatim FAILS validation):
  - Step 1: obs: tide, schedule, indicates, high, half, past, eleven | corr: finch, drowned, time | effect: narrows, opportunity, constraint, high, tide
  - Step 2: obs: footprints, lead, towards, beach, away | corr: lack, footprints, leading, back, suggests, helped | effect: eliminates, captain, hale, return
  - Step 3: obs: broken, watch, finch, stopped, precisely, minutes, past, eleven | corr: time, suggests, water | effect: narrows, window, death, high, tide, period
- Discriminating test method: trap
- Discriminating test elements to dramatize (compose ENTIRELY in your own sentences from these — do NOT reproduce any briefing phrase verbatim): reenacting, timeline, tide, simulation, show, death, occur, high
- Test must rely on already-shown clue IDs: clue_5, clue_core_contradiction_chain, clue_culprit_direct_1
- Fair-play rationale: Step 1: The tide schedule (early) and witness statements (mid) clarify the time frame for death. Step 2: Footprints leading to the beach (mid) and the broken watch (late) reveal the timeline of events. Step 3: The reenactment confirms Hugo Vane's culpability.

## Character Reference

### Eleanor Voss (she/her — NEVER he/him)
Eleanor speaks with a fluid rhythm, often punctuating her observations with ironic commentary
She tends to ask rhetorical questions that invite reflection.
Eleanor grapples with her feelings of inadequacy stemming from her divorce, unsure if she can reclaim her identity as a respected journalist.
Voice colour: Eleanor Voss uses dry wit humour — let it surface in their dialogue where natural, not in every line.

### Hugo Vane (he/him — NEVER she/her)
Hugo speaks in a straightforward manner, often cutting through pleasantries to get to the point
He has a habit of using terse phrases and direct language.
Hugo struggles with the bitterness of his past grudge against the victim while questioning whether it could lead him to violence.


## CHARACTER CONTRACTS (binding for this scene)
Each entry below constrains how this character must be written in this chapter.
These override generic style guidance when they conflict.

### Eleanor Voss[SHE]
Voice & mannerisms: Eleanor speaks with a fluid rhythm, often punctuating her observations with ironic commentary. She tends to ask rhetorical questions that invite reflection.
SIGNATURE TIC (use sparingly — this is Eleanor Voss's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "Well, isn't that just the way of the world?"
Sample voice fragments (match this register and rhythm):
  [comfortable] "You know, it’s funny how life works out sometimes, isn’t it?"
  [evasive] "I’m not sure we should dwell on the past when there’s so much to uncover."
Humour: dry wit — deploy occasionally (level 0.5)
FORBIDDEN phrase (never write for Eleanor Voss): "a surge of determination washed over her"
Act 2 behaviour contract: May show unease, evasion, or mild defensiveness when questioned. One behavioural tell is permitted. Internal conflict emerging: "Eleanor grapples with her feelings of inadequacy stemming from her divorce, unsure if she can reclaim her identity as a respected journalist."

### Hugo Vane[HE]
Voice & mannerisms: Hugo speaks in a straightforward manner, often cutting through pleasantries to get to the point. He has a habit of using terse phrases and direct language.
SIGNATURE TIC (use sparingly — this is Hugo Vane's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "Let's not beat around the bush."
Sample voice fragments (match this register and rhythm):
  [comfortable] "Let’s not beat around the bush."
  [evasive] "That’s not really relevant to our current situation."
Humour: blunt — deploy rarely (level 0.3)
FORBIDDEN phrase (never write for Hugo Vane): "she chose her words with great care"
Act 2 behaviour contract: May show unease, evasion, or mild defensiveness when questioned. One behavioural tell is permitted. Internal conflict emerging: "Hugo struggles with the bitterness of his past grudge against the victim while questioning whether it could lead him to violence."



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
ERA AUTHENTICITY (1940s):

1. FORBIDDEN terms (did not exist):
   ❌ Modern technology

2. REQUIRED period markers (include 2+ per scene):
   ✓ Formal address: Mr./Mrs./Miss/Dr./Sir/Lady
   ✓ Period technology: period-appropriate items
   ✓ Fashion: period clothing

3. Use period-authentic language and social norms

LOCATION PROFILES:

You have rich location profiles to draw from. Use them to create vivid, atmospheric scenes.

Primary Location: The Crestview Hotel (Dover, England)
A grand seaside hotel perched on the cliffs of Dover, offering breathtaking ocean views and an air of mystery.

Key Locations Available:
- The Oceanview Room (interior): Crime scene
- The Grand Dining Room (interior): Gathering space
- The Hotel Library (interior): Clue discovery
- The Kitchen (interior): Staff-only area

Atmosphere (tonal cue only — do NOT reproduce this phrase verbatim in prose; translate into scene-specific, character-observed sensory language): tense and anticipatory, with whispers of recent events affecting guests
Weather: overcast with occasional rain, typical of coastal climates

Era markers: radio broadcasts in every guest room | manual typewriters for correspondence | rationed fuel impacting travel

USAGE GUIDELINES:
1. First mention of location: Ground the scene using sensory details drawn from the profiles — paraphrase these into what the POV character directly observes and experiences, not a summary of the room's general qualities
2. Geographic grounding: Reference the specific place (Dover, England) naturally in dialogue or narrative
3. Action scenes: Integrate physical layout details (access, sightlines, constraints)
4. Atmospheric scenes: Reference weather, lighting, sounds from sensory palette
5. Era details: Weave in period markers naturally
6. Consistency: Keep all location descriptions aligned with profiles
7. OPENING GROUNDING (required, first 1-2 paragraphs of EVERY chapter): (a) name the specific location from this list, (b) give at least 2 concrete sensory details (sound, smell, temperature, texture, light/shadow), and (c) one time-of-day or weather/atmosphere detail — BEFORE advancing plot, clues, or the mechanism. Open on the setting and the people in it, not on the puzzle.
8. This matters most in pre-reveal chapters that withhold the mechanism: ground them in setting and character rather than rushing the investigation — a withheld chapter is not an empty one.
9. Do NOT use generic repeated manor/storm filler without profile-specific details; vary the opening location/sense each chapter

SENSORY PALETTE (use 2-3 senses per scene):
The Oceanview Room (interior):
  - Visual: dark curtains drawn tight, waves crashing against cliffs, elegantly arranged furniture
  - Sounds: distant crashing waves, soft rustle of fabric, muffled voices from the hallway
  - Scents: scent of damp sea air, faint perfume lingering in the air, musty fabric of the armchair
  - Touch: smooth silk of the curtains, cold touch of the window glass

The Grand Dining Room (interior):
  - Visual: glimmering chandeliers overhead, elegantly set tables, ocean waves visible through large windows
  - Sounds: clinking of cutlery, murmurs of conversation, soft piano music playing
  - Scents: freshly baked bread, roasted meats, seafood dishes
  - Touch: smooth surface of the table, cool glass of water

The Hotel Library (interior):
  - Visual: shelves overflowing with books, flickering flames in the fireplace, ornate rugs covering the floor
  - Sounds: crackling fire, soft rustle of pages, occasional coughs
  - Scents: the scent of old paper, smoky aroma from the fireplace, polished wood
  - Touch: smooth leather of a book cover, soft fabric of the armchair

⛔ REFERENCE DATA — DO NOT TRANSCRIBE VERBATIM: The above profiles are structural guides only. Generate original prose that evokes these qualities; do not reproduce the exact phrasing or sentence structure of the profile paragraphs.

SCENE OPENING RULE: When opening a scene in a new location, write what the POV character directly observes and physically senses at that moment — not a general description of the room's qualities. The reader must feel present, not briefed. Sensory details must be observed by the character, not stated as fact about the place.

SENSORY WRITING TECHNIQUES:
-
[truncated for prompt budget]

## Texture Pool
Draw on these as opportunities arise — you are not required to use them.

- Living through July 1944 means navigating the complexities of a world still reeling from the Second World War
- Residents and visitors alike find themselves in a society marked by a mixture of hope and anxiety
- The aftermath of D-Day has brought optimism about the war's end, yet the specter of conflict looms large, impacting daily life
- The presence of rationing still affects the availability of goods, and many are returning from service with scars, both visible and invisible
- Social dynamics are shifting as women take on more roles in the workforce, challenging traditional gender norms

TEMPORAL CONTEXT:

This story takes place in July 1944 during summer.

Seasonal Atmosphere:
- Weather patterns: overcast skies, occasional rain showers, cool coastal breezes
- Daylight: Long summer days with twilight lingering until well after eight o'clock, though often dimmed by heavy clouds.
- Seasonal activities: beachcombing along the shore, evening strolls through seaside promenades, attending outdoor band concerts
- Seasonal occasions: Independence Day (July 4) celebrations earlier in the month
- Season: summer

Period Fashion (describe naturally):
- Men formal: double-breasted navy suit, lightweight linen dress shirt, silk tie with geometric patterns
- Men casual: cotton short-sleeve button-up, tweed trousers, canvas loafers
- Men accessories: straw fedora, pocket square, classic wristwatch
- Women formal: elegant tea-length dress with floral prints, lightweight cardigan, periwinkle blue pumps
- Women casual: breezy cotton blouse, high-waisted shorts, comfortable espadrilles
- Women accessories: wide-brimmed sun hat, string of pearls, simple clutch handbag

Cultural Context (reference naturally):
- Music/entertainment: Bing Crosby - 'Swinging on a Star', The Andrews Sisters - 'Boogie Woogie Bugle Boy', Frank Sinatra - 'I'll Be Seeing You'; Films: 'To Have and Have Not', 'Double Indemnity'; Theatre: 'Oklahoma!', 'The Glass Menagerie'; Radio: The Shadow, Amos 'n' Andy
- Typical prices: Loaf of bread: four pence, Bottle of milk: three pence, Movie ticket: one shilling
- Current events: D-Day invasion's aftermath still influencing military strategy; U.S. troops advancing in the Pacific Theater
- Literature: 'The Fountainhead' by Ayn Rand | 'The Thin Man' by Dashiell Hammett | 'The Naked and the Dead' by Norman Mailer | [mystery and detective fiction] | [war novels] | [romantic fiction]
- Technology: improved radio technology | early television sets | advancements in radar technology | radio receivers in homes | manual typewriters in offices | steam irons for clothing care
- Daily life: gathering for community picnics, listening to radio broadcasts, attending local fairs
- Social rituals: Sunday family dinners, evening walks along the beach, visiting local ice cream parlors

Atmospheric Details:
The air is thick with the scent of saltwater mixed with rain, a reminder of the ocean's proximity. A distant rumble of thunder echoes as guests gather in the hotel lounge, their conversations hushed by a shared tension. The flickering light of a radio cast shadows on the walls, punctuating the otherwise muted atmosphere with updates from the front lines.

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
- Auth
[truncated for prompt budget]

NON-NEGOTIABLE CHAPTER OBLIGATIONS — LOCKED EVIDENCE VALUES (VERBATIM REQUIRED):
The following measured values (times, amounts, measurements) are absolute ground truth. Every time this chapter describes, mentions, or alludes to one — no matter how briefly — it MUST use the exact phrase shown below, character for character. NO paraphrase, approximation, rounding, or synonym is permitted.

FAILURE EXAMPLE: if the locked value is "at thirteen minutes to midnight" and you write "just before midnight" or "around midnight" — that is a HARD FAIL. You must write "at thirteen minutes to midnight". Equally, if the locked value is written in words, such as "ten minutes past eleven", and you convert it to figure-based clock notation — that is also a HARD FAIL. Words stay as words; figure forms are forbidden for word-phrased facts.

CRITICAL — WORD-PHRASED VALUES: If the canonical value is written out in words (e.g. a time like "ten minutes past eleven", or an amount like "forty minutes"), reproduce those exact words. DO NOT convert to figure-based time notation, twenty-four-hour format, or any other numeric shorthand. Correct: "ten minutes past eleven". WRONG: figure-based clock notation or numeric shorthand.

Locked values:
  - The exact time of high tide when the victim could have drowned.: "half past eleven at night"
  - The time at which the victim's watch stopped, indicating their last moments.: "ten minutes past eleven"
    ⛔ FORBIDDEN alternatives: "11:10", "11.10", "eleven ten", "eleven-ten", "eleven past ten", "quarter past eleven", "half past eleven" — the ONLY acceptable form is "ten minutes past eleven"

If a value has no relevance to this chapter, omit it. But the moment you reference the underlying evidence, only the exact phrase above is acceptable.

⚠ CENTRAL CONTRADICTION (the heart of the mystery): the two locked values "half past eleven at night" and "ten minutes past eleven" are NOT two separate facts — they are ONE contradiction (one is a staged appearance, the other the true state; the evidence determines which). If this chapter references both, you MUST present them AS A SINGLE CONTRAST joined by a contrast connective (but / yet / however / could only / whereas) — e.g. "the watch showed the one time, yet the evidence proved it could only have been the other" — making clear which reading is the appearance and which is the truth. NEVER state them as two flat, side-by-side truths — that makes the central clue read as if it contradicts itself.

⛔ CLUES TO SURFACE IN THESE CHAPTERS — mandatory:
The following evidence MUST be clearly observable to an attentive reader. Do not bury it in atmosphere or passing dialogue. Each clue must be concrete, specific, and noticeable:

• [clue_4] hugo, vane, seen, near, beach, shortly, before, incident
  Category: behavioral | Criticality: essential | Supports inference step 2
  Points to: hugo, vane, opportunity, involved, finch, death

• [clue_7] eliminates, sylvia, trent, because, party, until, midnight
  Category: testimonial | Criticality: essential | Supports inference step 3
  Points to: sylvia, trent, involved, finch, death

• [clue_late_1] eliminates, eleanor, voss, because, seen, party, until, midnight, multiple, guests
  Category: testimonial | Criticality: essential | Supports inference step 3
  Points to: eleanor, voss, involved, finch, death

For each clue above: an attentive reader should be able to find, record, and later use it to reason toward the solution.

═══ NARRATIVE STATE (read-only — do not contradict) ═══

LOCKED FACTS — use verbatim whenever this evidence is described:
  • The exact time of high tide when the victim could have drowned.: "half past eleven at night"
  • The time at which the victim's watch stopped, indicating their last moments.: "ten minutes past eleven"

CHARACTER PRONOUNS — never deviate from these:
  • Eleanor Voss: she/her/her
  • Dr. Mallory Finch: she/her/her
  • Captain Ivor Hale: he/him/his
  • Beatrice Quill: she/her/her
  • Sylvia Trent: she/her/her
  • Hugo Vane: he/him/his

CLUES ALREADY REVEALED TO READER: clue_mechanism_visibility_core, clue_core_contradiction_chain, clue_1, clue_culprit_direct_hugo_vane, clue_fp_contradiction_step_1 — do not reveal these as new information.

INVESTIGATION LOG — WHAT IS ESTABLISHED (do not re-establish, do not repeat):
• Evidence already established (reference only — do NOT restate or quote these; advance beyond them): timing, high, tide, creates, narrow, window | finch, drowned, time, witnesses, last | someone, went, beach, return | direct, shows, hugo, vane, means, opportunity | finch, drowned, time
• Suspects still unresolved: Captain Ivor Hale[HE], Beatrice Quill[SHE], Sylvia Trent[SHE]
⚠ The story must move FORWARD from this log. Any beat already listed above is forbidden from repeating.

⚠ THIS CHAPTER'S REQUIRED ADVANCE (first_turn): Examine physical evidence — find at least one new clue

CONTINUITY HANDOFF — previous chapter closing beat:
  • "She turned away from the water, the sand clinging to her shoes. The investigation was no closer to resolution, but the day’s discoveries had shifted the ground beneath their feet. The footprints, the timeline, the contradictions—they were pieces of a puzzle th..."
  • The next chapter must open as a continuation of this beat, not as a disconnected reset.

⛔ DEAD CHARACTER — CANNOT APPEAR AS ALIVE:
• Dr. Mallory Finch: murdered before Chapter 1. In ALL chapters from here on:
  - Refer to them ONLY in past tense, only as the victim of the crime
  - NEVER have them: enter a room, speak, respond, gesture, look, nod, or react
  - NEVER describe them as present at any scene, conversation, or confrontation
  - WRONG: "Dr. Mallory Finch crossed the room" / "Dr. Mallory Finch sat on the sofa" / "Dr. Mallory Finch nodded"
  - WRONG: "Dr. Mallory Finch gave testimony" / "Dr. Mallory Finch asked what had happened"
  - CORRECT: "Dr. Mallory Finch had often said..." / "Dr. Mallory Finch's effects were found" / "witnesses recalled Dr. Mallory Finch's habit of..."
═══════════════════════════════════════════════════════

═══════════════════════════════════════════════════════════
📚 CONTINUITY CONTEXT - CHARACTER & SETTING CONSISTENCY
═══════════════════════════════════════════════════════════

**CRITICAL: You are writing chapters 4+. Maintain consistency with earlier chapters.**

**Character Names Used in Chapters 1-3:**
Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill, Sylvia Trent, Hugo Vane

✓ RULE: Use EXACTLY these names. Do NOT vary spelling, add titles, or introduce new forms.
✓ Example: if earlier chapters used "Clara Whitfield", keep using "Clara Whitfield" — never "Mrs. Whitfield" unless that is the character's canonical name in the list above.

**Setting Vocabulary Established in Earlier Chapters:**
kitchen, library, dining room, corridor, lounge

✓ RULE: Continue using this location vocabulary. Maintain consistency with established setting type.
✓ Do NOT introduce new location types that contradict earlier chapters.

**Recent Chapter Summary (for narrative continuity):**
Chapter 1: Chapter 1: The Tide's Witness
  Events: Eleanor Voss pressed her heel into the damp sand, the chill of the midsummer morning biting through her stockings.
Chapter 2: Chapter 2: Initial Reactions
  Events: "It’s still raining, isn’t it?
Chapter 3: Chapter 3: Clue Gathering
  Events: Midday brought a pale, silvery glow to the beach, near the water's edge, where the surf hissed and retreated, leaving behind a ragged line of foam.

⚠️ **VALIDATION:** Character name mismatches and setting drift are common failure modes.
Double-check every character name against the list above before using it.

**⏱ LOCKED TIME ANCHOR — use verbatim, do not paraphrase:**
Clock time (from the case ground truth): **"scheduled high tide at half past eleven"**
✓ RULE: Every reference to the clock MUST use exactly this phrase. No variation permitted.
═══════════════════════════════════════════════════════════


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
Known location profile anchors: The Crestview Hotel, The Oceanview Room, The Grand Dining Room, The Hotel Library, The Kitchen, the seaside hotel lounge
LOCATION NAME CAPITALISATION (HARD REQUIREMENT — validated):
All named locations in your prose MUST use the EXACT capitalisation from the CML profiles.
Canonical forms: "The Crestview Hotel", "The Oceanview Room", "The Grand Dining Room", "The Hotel Library", "The Kitchen", "the seaside hotel lounge"
Writing a location in lowercase (e.g. "drawing room" instead of "Drawing Room") is a validated error. Every time you mention a named location, copy its capitalisation from the list above.
- Chapter 4: OPENING STYLE (HARD): Start the VERY FIRST SENTENCE with a noun-phrase atmosphere — e.g. "The smell of damp stone in the cellar…" / "A chill from the landing…" / "The sound of the clock in the hall…". Pattern: "The/A [noun] of/in/from [place]…". Anchor opening in "the seaside hotel lounge". The opening style above governs only your FIRST SENTENCE; the grounding below may land anywhere in the first 2 paragraphs (it need not be sentence one, and never conflicts with the chosen opening style). HARD REQUIREMENT for the first 2 paragraphs: (a) include 2+ sensory words — choose from smell/scent/odor/fragrance/sound/echo/silence/whisper/creak/cold/warm/damp/rough/smooth/glow/shadow/flicker/dim — and (b) include 1+ atmosphere/time word — choose from rain/wind/fog/storm/mist/thunder/evening/morning/night/dawn/dusk/lighting/weather/season/afternoon/midday/noon/midnight/twilight/sunrise/sunset/daylight/sunlight/overcast/cloudy/bright/dark/grey/pale/chill/crisp/drizzle/haze/lamplight/firelight. These are validated requirements, not style suggestions; missing them triggers a retry.

[⚠ INTERNAL QUALITY DIAGNOSTICS — DO NOT REPRODUCE ANY PART OF THIS SECTION IN YOUR STORY OUTPUT. These are private generator observations for your consideration only. Your narrative must read as if this section does not exist. Never include phrases from this block in character dialogue, narration, or description.]

PRIOR CHAPTER QUALITY OBSERVATIONS:
- Chapter 2 (score 95/100):
  Quality gaps noted: word density below preferred target (891/1000)
  Address in upcoming chapters: Increase chapter density with concrete investigation action and sensory-grounded beats; avoid recap-only padding.
- Chapter 3 (score 96/100):
  Quality gaps noted: scene grounding weakness
  Address in upcoming chapters: Open next chapter with a named location anchor plus at least two sensory cues and one atmosphere marker.
- Phrases to avoid (already overused in earlier chapters): "one simply can t take the risk", "simply can t take the risk can".
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
  • Sylvia Trent: ALWAYS she/her/her/herself — NEVER he/him/his/himself
  • Hugo Vane: ALWAYS he/him/his/himself — NEVER she/her/herself

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
9. In dialogue attribution, the pronoun refers to the SPEAKE
[truncated for prompt budget]

PROMPT BUDGET SUMMARY: budget=24000 tokens; fixed=12957; context=10756; dropped=[humour_guide]; truncated=[location_profiles, temporal_context, pronoun_accuracy]

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
- Use dark tone and short length guidance.
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
4. Integrate at least two concrete era-grounded details per chapter from setting refinement signals: radio broadcasts in every guest room | early television sets in common areas | manual typewriters for correspondence | long-distance telephone calls available with operator assistance | military-style encryption for sensitive information | letters delivered via local post.
5. Respect setting movement/access constraints in scene action and alibis: narrow hallways limiting movement | oceanfront cliffs creating natural barriers | restricted access to staff-only areas | staff-only areas like the kitchen and maintenance rooms | guest access to certain floors restricted after midnight.
6. Sustain social coherence with this backdrop pressure: A grand seaside hotel hosts a mix of war-weary guests and ambitious social climbers, all drawn together by the promise of a lavish escape, yet haunted by the specter of recent tragedies and shifting allegiances.
7. Maintain continuity around these socially central cast anchors where relevant: Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill, Sylvia Trent, Hugo Vane.
8. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Critical: Plot similarity 0.80 with 'The Second Key' (same era, method of drowning, and seaside hotel setting)
9. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Moderate: Character similarity 0.75 with 'The Second Key' (similar cast structure and dynamics)
10. STORY TO DATE ANTI-COPY RULE: The STORY TO DATE section below is provided for chronological and factual reference ONLY. You MUST NOT copy, lightly rephrase, or structurally echo any sentence or paragraph from prior chapters. Every sentence in this chapter must be original prose unique to this scene. Reusing even a clause from prior chapter text will cause this attempt to fail immediately.

CRITICAL PROSE REQUIREMENTS:

The CML specifies exact requirements for certain validation-critical scenes. You MUST include these elements at the specified positions.

**Discriminating Test Scene (Act 3, Scene 4):**
Required elements: Execute the discriminating test, Observe the culprit's reaction or result, Draw conclusion about guilt
Test type: temporal

**Suspect Clearance Scenes:**
- Captain Ivor Hale (Act 3, Scene 5): Timeline and witness statements prove he could not have returned to the party after going to the beach.
  Clues: clue_id_1, clue_id_2
- Beatrice Quill (Act 3, Scene 5): Alibi confirmed by staff and her location during the party.
  Clues: clue_id_3, clue_id_4
- Sylvia Trent (Act 3, Scene 5): Witness accounts confirm her presence at the party away from the beach.
  Clues: clue_id_5, clue_id_6

**Culprit Revelation Scene (Act 3, Scene 6):**
Method: Confrontation with evidence linking Hugo Vane to the murder.

**Clue Placement for These Chapters:**
- clue_core_elimination_chain must appear in Act 2, Scene 1 via Corroborated elimination

**VALIDATION CONSEQUENCE:** If these requirements are not met exactly, story validation will fail and the entire generation will be rejected. Follow these specifications precisely.


## ACTIVE CHAPTER MODE CONTRACT (MANDATORY)
Active chapter mode: Suspect Pressure.
Mode required outcomes:
- Reveal fear, motive, lie, loyalty conflict, or secret.
- Suspicion state changes by chapter end.
Forbidden at this stage:
- No culprit resolution: no confession, no arrest, no 'case closed', no accusation ('I accuse'/'I name'), and never state 'the culprit/murderer/killer is/was …'. The accusation is reserved for the final reveal — build suspicion only.
Mode-specific narrative balance targets:
- Setting: 5-10%
- Character Pressure: 45-55%
- Evidence Or Alibi Testing: 35-45%

## CHAPTER OUTCOME CONTRACT (MANDATORY)
Batch chapters: 4-4.
Investigation state at start: 5 clue(s) revealed to reader; approximately 3 unresolved suspect(s).
Must change by end: Increase or complicate suspicion through a new pressure revelation — WITHOUT resolving the case: do NOT name, accuse, or extract a confession from the culprit, make an arrest, or declare the case closed (that is reserved for the final reveal).
Suspect pressure target(s): Hugo Vane
Required new information: At least one fear/motive/lie/loyalty reveal with investigative consequence.
Forbidden reveals at this stage: No culprit resolution: no confession, no arrest, no 'case closed', no accusation ('I accuse'/'I name'), and never state 'the culprit/murderer/killer is/was …'. The accusation is reserved for the final reveal — build suspicion only.

MECHANISM REVEAL GATE (withhold): The discriminating test has NOT happened yet. Show observable clues, contradictions, and suspicions, but do NOT yet explain HOW the concealment mechanism actually works, and do not state outright that it was deliberately rigged — keep the method an open question. Reserve the full explanation for the discriminating-test chapter.

## Asset Self-Report (required)
At the very END of your response, after all prose, add a single line:
<used_assets>era:story:0,era:story:1,era:story:2,era:story:3,era:story:4</used_assets>
Replace the list with only the IDs of texture assets you actually used. If you used none, output <used_assets></used_assets>.
```

## Message 2 (role=user)

```text
Write the full prose following the outline scenes.



CHAPTER OBLIGATION CONTRACT (MUST SATISFY):
- ERA RULE (1940s): NEVER use these anachronistic terms: "internet", "email", "cell phone", "mobile phone", "smartphone", "GPS", "laptop", "digital camera", "text message", "app", "wifi", "bluetooth". Any occurrence will cause the chapter to be rejected.
- STYLE HARD-BAN: NEVER use these phrase families: "clock tower at quarter past three", "near the clock tower at quarter past", "showed quarter past three when the body", "in the formal gardens during the murder", "the hour stood at". Any occurrence triggers rejection/retry.
- STYLE SOFT-BAN: avoid these stock phrases and rewrite them if they appear in draft text: "lips pressed into a thin line", "the household runs smoothly when every cog", "the pressures upon this household are many", "the doctor [Surname] (use Dr. Surname or 'the doctor', never role + bare surname)", "the captain [Surname] (use Captain Surname or 'the captain', never role + bare surname)", "the inspector [Surname] (use Inspector Surname or 'the inspector', never role + bare surname)", "the sergeant [Surname] (use Sergeant Surname or 'the sergeant', never role + bare surname)", "the constable [Surname] (use Constable Surname or 'the constable', never role + bare surname)", "the gentleman [Surname] (use Mr. Surname or 'the gentleman', never role + bare surname)", "the investigation had entered a new phase", "finally coming into focus", "setting the stage for the final confrontation".
- STYLE WATCHLIST: keep these patterns varied and scene-specific: "quarter past three", "three fifteen", "the old bell striking three fifteen", "the chimes echoed just after three-fifteen".
- Chapter 4:
  - STRUCTURAL ARCHETYPE — Chapter 4 must be: ALIBI_PROBE
      ✓ MUST contain: one alibi tested with a stated result
      ✗ MUST NOT contain: 
  - Word count: Target 1250 words. Achieve this through plot events, dialogue exchanges, and physical investigation — not through atmospheric repetition or extended internal reflection. Each 200-word segment should contain at minimum one concrete story event (a discovery, a conversation exchange, a physical action or movement). Padding with atmosphere alone is not acceptable.
  - Opening: Begin with a character action, spoken line, or clock/time marker — never a location name or location-description phrase.
  - Scene is set in: the seaside hotel lounge — reference it naturally within the paragraph, never as your opening phrase.
  - Opening atmosphere (MANDATORY — validator enforced): the first paragraph MUST contain at least one of: rain / wind / fog / storm / mist / thunder / evening / morning / night / dawn / dusk / season / afternoon / midday / noon / midnight / twilight / sunrise / sunset / daylight / sunlight / overcast / cloudy / bright / dark / grey / pale / cold / warm / chill / crisp / damp / drizzle / haze / lamplight / firelight. A chapter that omits all of these from its opening paragraph will be rejected.
  - PARAGRAPH OPENER DIVERSITY (MANDATORY — validator enforced): No more than 2 paragraphs in this chapter may begin with "Eleanor" or "Eleanor's" as the first word. You must vary paragraph openings throughout: use sensory observations, another character's name or action, dialogue, object or sound details, or temporal markers. Opening 3 or more paragraphs with "Eleanor" will cause automated rejection.
  - ⛔ MECHANISM SPOILER BAN: Do NOT state how the crime device was manipulated — not the direction, not the magnitude, not who performed it. Characters may only observe that two sources of evidence disagree. The specific method, tamper amount, and perpetrator's action are ALL FORBIDDEN until the reveal. WRONG: "The culprit had altered the device by forty minutes to create a false alibi." RIGHT: "Two independent pieces of evidence gave contradictory readings — a discrepancy neither could yet explain."
  - Continuity bridge: in the first 120 words, visibly connect from the previous chapter's final beat. Carry forward one unresolved element (object, accusation, emotional pressure, or immediate physical action) from: "She turned away from the water, the sand clinging to her shoes. The investigation was no closer to resolution, but the day’s discoveries had shifted the ground beneath their feet. The footprints, the timeline, the contra...".
  - CLUE OBLIGATIONS — each clue below MUST be dramatized, but in YOUR OWN WORDS:
    Render each as something a character SEES, DOES, or SAYS on the page. The bracketed text is a
    DESCRIPTION of the evidence for you — do NOT transcribe it as narration. Copying a clue's
    description sentence verbatim into the prose FAILS validation.
    • multiple, guests, confirming, eleanor, presence, party [clue_core_elimination_chain]
      Points to: eleanor, voss, involved, finch, death
    • witnesses, recalling, seeing, hugo, vane, water [clue_4]
      ⛔ SPOILER EMBARGO (pre-reveal chapter): surface ONLY the surface anomaly a character can see/hear/find.
         Do NOT name who it implicates, state the tamper direction or magnitude, or explain the mechanism in this chapter.
         Present it as an unexplained discrepancy; the culprit and method are revealed later.
    • multiple, guests, confirming, sylvia, presence [clue_7]
      Points to: sylvia, trent, involved, finch, death
    • multiple, guests, confirming, eleanor, presence, party [clue_late_1]
      Points to: eleanor, voss, involved, finch, death
  - Tonal contrast: include at least one beat of relief or ironic counterpoint. Do not sustain maximum tension for every paragraph.
  - CLUE DISCLOSURE RULE (Stage 2/4):
    Characters may establish access and opportunity but must NOT state the crime method or draw the final clue-to-culprit connection. Investigation without conclusion.
    WRONG: dialogue or narration that directly explains how the crime was committed before Stage 4.
    RIGHT: observation, physical reaction, and logical inference that leaves the mechanism just off-screen.
  - SUSPECT-PRESSURE MODE: do NOT resolve the case in this chapter. No confession, arrest, final accusation, definitive culprit declaration, or case-closed language. End with unresolved pressure: a contradiction, narrowed suspicion, motive pressure, or a new question.
  - ALIBI LOCK: Hugo Vane's established alibi is "During the party". Do NOT place Hugo Vane at any other location or in any other activity during the crime window. Any contradiction is a continuity error that triggers a retry.
  - TESTIMONY CONTINUITY: Hugo Vane has already made statements in earlier chapters. Any time, location, or claim attributed to Hugo Vane in THIS chapter must be consistent with those earlier statements. Do NOT introduce a new or different alibi claim — any contradiction is a continuity error.

- Tonal contrast required: the previous chapter was high-tension. This chapter must include at least one beat of relief, pause, or quiet observation.
- Locked fact phrase obligations:
  - If this batch mentions The exact time of high tide when the victim could have drowned., write exactly: "half past eleven at night".
  - If this batch mentions The time at which the victim's watch stopped, indicating their last moments., write exactly: "ten minutes past eleven".
- Seasonal vocabulary allow-list: summer, summery, midsummer.
- Forbidden seasonal words: spring, autumn, winter.

⛔ PRONOUN TABLE — re-check after EVERY paragraph before writing the next:
    Eleanor Voss: she/her/her
    Dr. Mallory Finch: she/her/her
    Captain Ivor Hale: he/him/his
    Beatrice Quill: she/her/her
    Sylvia Trent: she/her/her
    Hugo Vane: he/him/his
  Any sentence containing a pronoun must agree with this table. Correct mismatches before moving on.

## CHAPTER OUTCOME CONTRACT (MANDATORY)
Batch chapters: 4-4.
Investigation state at start: 5 clue(s) revealed to reader; approximately 3 unresolved suspect(s).
Must change by end: Increase or complicate suspicion through a new pressure revelation — WITHOUT resolving the case: do NOT name, accuse, or extract a confession from the culprit, make an arrest, or declare the case closed (that is reserved for the final reveal).
Suspect pressure target(s): Hugo Vane
Required new information: At least one fear/motive/lie/loyalty reveal with investigative consequence.
Forbidden reveals at this stage: No culprit resolution: no confession, no arrest, no 'case closed', no accusation ('I accuse'/'I name'), and never state 'the culprit/murderer/killer is/was …'. The accusation is reserved for the final reveal — build suspicion only.

FROZEN FACT STATE (DO NOT ALTER):
- Timeline anchor: July (summer).
- Month, season, weather, and time-of-year language in this batch must stay compatible with summer.
- Established timeline fact: scheduled high tide at half past eleven
- If referenced, use exact phrase: "half past eleven at night" (The exact time of high tide when the victim could have drowned.).
- If referenced, use exact phrase: "ten minutes past eleven" (The time at which the victim's watch stopped, indicating their last moments.).

STORY TO DATE (REFERENCE ONLY — DO NOT COPY VERBATIM):
- Full prior chapter text is provided below for continuity, factual consistency, and reference accuracy.
- Use this to keep character voice, chronology, clue state, and location continuity aligned with earlier chapters.
- Do not quote, copy, or paraphrase these paragraphs too closely; write fresh prose that remains consistent with them.

--- BEGIN PRIOR CHAPTER 1 ---
Title: Chapter 1: The Tide's Witness
Eleanor Voss pressed her heel into the damp sand, the chill of the midsummer morning biting through her stockings. The wind off the Channel carried a briny tang, sharp enough to sting her nose. She squinted into the grey haze where the water met the shore behind the seaside hotel, the faint echo of waves breaking against the rocks barely masking the low murmur of voices gathering behind her. And there, half-shrouded by a tangle of kelp and silt, lay the unmistakable form of Dr. Mallory Finch, her elegant evening dress sodden and clinging, one pale hand curled around a battered wristwatch whose glass face caught the weak daylight.

The body of Dr. Mallory Finch, washed ashore, still clutching a broken watch, seemed both a grotesque interruption and a grim punctuation to the previous night’s festivities. Eleanor knelt, the cold seeping through her skirt, and brushed away a strand of seaweed from Dr. Mallory Finch’s wrist. The watch—its hands frozen at ten minutes past eleven—gleamed accusingly, a detail impossible to ignore. Behind Eleanor, the hush of the assembled guests was broken only by the distant call of a gull and the rhythmic crash of the tide, which, as several voices had already whispered, had reached its highest point at half past eleven at night. That narrow window—between the watch’s silent testimony and the relentless schedule of the sea—pressed in on Eleanor with a weight that felt almost personal.

A shiver ran down Eleanor’s spine, but she steadied herself, glancing up to find Hugo Vane standing a few paces away. Hugo Vane, retired businessman and sometime patron of Dr. Mallory Finch’s more ambitious schemes, wore a navy suit that looked as though it had seen better days. His face, usually set in lines of pragmatic self-assurance, was pinched, his gaze fixed not on the body but on the horizon. Eleanor noted the way his hands clutched his hat, knuckles white, as if he might wring the truth from the very air. She wondered if his mind was already calculating the cost—financial or otherwise—of this morning’s revelation.

Captain Ivor Hale’s voice, brisk and clipped, cut through the silence. “No one expected to find her here, least of all like this,” he said, his eyes darting from Eleanor to the cluster of guests. The captain’s uniform was immaculate, though his jaw worked as if he were biting back something more than grief. Eleanor remembered the stories of his wartime camaraderie with Dr. Mallory Finch—stories that had grown more elaborate with each retelling over last night’s dinner. Now, as he stood at parade rest, his hand hovered near his watch chain, betraying a tension that no discipline could quite conceal.

Beatrice Quill, ever the socialite, arrived with a rustle of silk and a dramatic gasp. “Well, this is a scene straight from a penny dreadful, isn’t it?” she declared, though her eyes lingered on the body a fraction too long. Her periwinkle dress, carefully chosen to suggest both innocence and style, was at odds with the hard set of her mouth. Eleanor caught the quick flicker of Beatrice Quill’s gaze toward the other guests, as if weighing the odds of scandal against the opportunity for sympathy. “One simply can’t take the risk, can one?” she murmured, more to herself than anyone else.

Sylvia Trent hung back, arms folded protectively across her chest. The artist’s smock she wore over her blouse was smeared with charcoal, a silent testament to a night spent sketching rather than socializing. “Art is a reflection of the soul, don’t you think?” she offered, voice barely above the surf, but her eyes shied from the body. Eleanor noted the way Sylvia Trent’s fingers twisted the strap of her satchel, her gaze fixed on the shifting patterns of foam at the water’s edge. There was a fragility to her posture, as if she might be swept away by the next wave.

Eleanor rose, brushing sand from her knees, and addressed the group with a steadiness she did not entirely feel. “I’ll need everyone to remain nearby,” she said, her tone brisk but not unkind. “Until we understand what’s happened, it’s best we keep our recollections sharp.” She was aware of the way the others looked to her, not just as a journalist but as the investigator now—an unspoken consensus that settled over the group like the persistent drizzle that threatened from the overcast sky. The war had taught them all to improvise, but no one seemed prepared for this particular improvisation.

A constable, summoned by the hotel manager, hovered at the edge of the gathering, but made no move to take charge. It was Eleanor’s investigation now, and she felt the weight of that responsibility settle on her shoulders. She turned her attention back to the watch—ten minutes past eleven—and then to the sea, recalling the whispered discussions of the tide’s schedule. The high tide had come at half past eleven at night, a detail several guests had volunteered with the certainty of those who had checked the almanac for their evening strolls. Yet here was Dr. Mallory Finch, her watch stopped before the water could have claimed her, and no one could explain the contradiction.

The breeze shifted, carrying the scent of wet kelp and distant smoke from the hotel’s kitchen. Eleanor’s mind raced, cataloging details: the sand still damp from the receding tide, the absence of footprints leading from the water’s edge, the curious stillness that seemed to have settled over the entire beach. She glanced at Hugo Vane, who met her gaze with a level stare, then at Captain Ivor Hale, who had retreated into a silence that seemed almost strategic. Beatrice Quill’s whispers to Sylvia Trent were too soft to catch, but the tension in their posture spoke volumes.

Eleanor crouched once more, careful not to disturb the scene. She noted the way Dr. Mallory Finch’s hair fanned out in the sand, the faint imprint of a ring on her finger where a stone was now missing, the torn edge of her dress caught on a shell. Every detail mattered, but it was the timing—the impossible narrowing of events between ten minutes past eleven and half past eleven at night—that gnawed at her. The tide, the watch, the absence of any sign of struggle on the sand: together, they formed a puzzle whose pieces refused to fit.

A gull swooped low, its cry sharp against the morning hush. Eleanor straightened, her eyes tracing the line of the surf as it retreated. The war had brought enough uncertainty; now, here on this beach, another kind of battle was unfolding. She wondered, not for the first time, whether the truth would be as simple as it appeared—or whether, like the tide, it would reveal its secrets only to those patient enough to wait for the water to recede.
--- END PRIOR CHAPTER 1 ---

--- BEGIN PRIOR CHAPTER 2 ---
Title: Chapter 2: Initial Reactions
"It’s still raining, isn’t it?" Beatrice Quill’s voice cut through the muffled clatter of the seaside hotel lounge, her words sharp as the scent of damp wool coats and yesterday’s roses. Eleanor Voss stood by the window, the glass cool beneath her fingertips, watching drops chase one another down the pane. The late morning light struggled through the overcast sky, lending the room a pearly gloom. Behind her, the radio—set to the BBC—gave a low, steady drone of war news, mostly ignored by the guests now huddled in anxious clusters.

Eleanor’s notebook felt heavy in her hand as she approached the nearest group, the hush of shock still hovering in the air. She caught the edge of Captain Ivor Hale’s jacket as he shifted his weight, his gaze fixed on the floor. He cleared his throat, breaking the silence. "I saw Dr. Finch—Mallory—just before eleven last night. She was in the Oceanview Room, listening to some dreadful waltz on the gramophone." He paused, glancing up as if daring anyone to contradict him. At the same moment, Hugo Vane, perched stiffly on a velvet armchair, added, "She and I exchanged words about the tide schedule. She seemed distracted, kept glancing at her watch."

Eleanor’s pencil hovered, her mind snagging on the specifics: last seen alive just before eleven, yet the tide had reached its peak at half past eleven at night. The watch—still clutched in Dr. Mallory Finch’s hand—was stopped at ten minutes past eleven. The guests’ recollections seemed to shore up the timeline, but the physical evidence refused to cooperate. This wasn’t just a matter of missing minutes; it was the kind of contradiction that made her skin prickle. If the witnesses were correct, Dr. Mallory Finch had been alive until at least eleven. Yet something—or someone—had intervened before the tide could have done its work.

The crackle of the fireplace at the far end of the lounge offered scant comfort. Eleanor’s hands trembled as she jotted down stray remarks, the weight of responsibility settling in. Beatrice Quill, ever observant, caught the movement and arched a brow. "If I may, I distinctly recall Mallory complaining about the draft in the corridor at a quarter to eleven. She borrowed my shawl, which I still haven’t seen returned. One simply can’t take the risk, can one?" Her tone was arch, but her eyes were calculating, flicking from Eleanor to Hugo Vane and back.

Sylvia Trent, standing near the bookshelf and half-hidden in the shadows, spoke up with a thread of hesitation. "I was sketching in the library until late. Mallory passed by around eleven. She smiled—well, she tried to. It was the sort of smile you give when you’re thinking of something else entirely." Her voice, soft as a brushstroke, barely carried over the rising storm outside. She clutched her satchel, smudges of charcoal darkening her fingertips. "She asked me if I’d seen Captain Hale. I told her I hadn’t."

Captain Ivor Hale let out a breath, arms crossed over his chest. "I returned to the lounge shortly after. The gramophone was still playing, but Mallory was gone. I assumed she’d stepped outside for air. That was her habit, even in this weather." He shot a look at Beatrice Quill, as if seeking corroboration. Beatrice Quill responded with a delicate shrug and a glance at the rain streaking the windows.

Eleanor felt her skepticism mounting. Each recollection was precise, almost rehearsed, yet none addressed the gap between the last sighting and the tide’s implacable schedule. She tapped her pencil against her notebook, the sound sharp in the hush. "So everyone agrees Dr. Finch was alive until at least eleven?" she asked, inviting contradiction. Hugo Vane’s reply was blunt: "I left her near the Oceanview Room at eleven. After that, I was in the Grand Dining Room with half the guests. If you’re suggesting otherwise, let’s not beat around the bush. Say it."

The tension was palpable, but Eleanor pressed on, aware that the contradiction needed daylight. The watch’s frozen hands—ten minutes past eleven—should have been a silent witness, yet the schedule of the sea demanded a different story. The guests’ statements edged around the same narrow window, but something in their delivery felt off, as though they were all reading from the same script. Was it grief, fear, or something more calculated?

Outside, the rain intensified, drumming a steady rhythm against the glass. Eleanor caught her reflection, the lines of worry etched deeper than she cared to admit. The war had instilled in her a habit of questioning official stories, and this was no different. She resolved to cross-check each account, searching for the hairline fracture that would let the truth seep through. For now, she accepted the guests’ consensus: Dr. Mallory Finch was last seen alive just before eleven. But with the tide reaching its height at half past eleven at night, the contradiction lingered like a chill draft, impossible to ignore.

As the lounge emptied, only Sylvia Trent lingered by the shelves, her voice low. "If you’re looking for answers, Eleanor, you might try the spaces in between. That’s where the real story hides. Like shadows in a painting." Eleanor managed a wry smile, her thoughts whirring. Well, isn’t that just the way of the world? she mused. The truth, as ever, seemed to be waiting for its own high tide.
--- END PRIOR CHAPTER 2 ---

--- BEGIN PRIOR CHAPTER 3 ---
Title: Chapter 3: Clue Gathering
Midday brought a pale, silvery glow to the beach, near the water's edge, where the surf hissed and retreated, leaving behind a ragged line of foam. The air was thick with the scent of salt and wet kelp, and the wind tugged at Eleanor Voss’s skirt as she stepped from the hotel’s stone steps onto the damp sand. The sky was a blanket of overcast grey, lending the scene a sombre hush broken only by the distant crash of waves and the low murmur of voices behind her. Sylvia Trent’s words from the lounge still echoed in Eleanor’s mind: the spaces in between. She pressed onward, her shoes sinking slightly with each step, until she was close enough to see the impressions left by the morning’s tragedy.

Just beyond the high-water mark, Eleanor paused, her gaze catching on a line of footprints pressed deep into the damp sand. They led from the edge of the grassy embankment straight toward the water, each print still sharp despite the tide’s retreat. But what made her heart stutter was their solitary direction—toward the sea, with no returning trail. The wind had not yet erased them; the sand was too wet, the edges too defined. She crouched, brushing her gloved fingers lightly over the nearest print, feeling the roughness of the grains and the chill that seemed to seep up from the ground itself. It was as if someone had walked out to the water’s edge and simply vanished.

Eleanor straightened, the implications settling on her like the drizzle that threatened from the low sky. If these prints belonged to Dr. Mallory Finch, why was there no sign of her return? And if not, then someone else had approached her—someone who had not come back the way they’d gone. The absence of a second trail was as telling as any confession; it suggested not just a meeting, but a confrontation, a disappearance. She felt a prickle of unease, the sense that the sand itself was holding its breath, waiting for her to see what lay beneath its surface.

Behind her, the others approached in a loose, uneasy cluster. Hugo Vane hung back, his hands thrust deep in the pockets of his crumpled suit trousers, his gaze darting between the horizon and the shifting patterns of seaweed at his feet. Captain Ivor Hale strode forward, boots leaving their own crisp marks, his uniform immaculate even here, though his eyes were shadowed beneath the brim of his hat. Beatrice Quill, her periwinkle dress a splash of defiance against the dull day, clutched her shawl tightly and surveyed the scene with a theatrical shudder. Sylvia Trent trailed last, her artist’s smock fluttering in the breeze, eyes wide and searching.

Eleanor called out, her voice steady despite the tremor she felt. “I need everyone to look closely. If you remember seeing anyone come down to the beach last night, now is the time to say so.” She watched the group, noting the flicker of hesitation in Beatrice Quill’s eyes and the way Hugo Vane’s jaw clenched. Captain Ivor Hale answered first, his tone clipped. “I was in the lounge after eleven. I didn’t leave until the gramophone ended. Mallory—Dr. Finch—wasn’t there when I returned.” He looked to Beatrice Quill, who offered a delicate shrug, her gaze fixed on the sand. “I was in the Grand Dining Room, surrounded by half the hotel. One simply can’t take the risk, can one? Being alone in a storm like that.”

Sylvia Trent’s voice, soft as the mist, drifted over the group. “I was in the library, sketching. I saw Mallory pass by just before eleven. She looked… distracted. She asked if I’d seen Captain Hale, but I hadn’t. After that, I stayed with my drawing.” Her hands twisted the strap of her satchel, charcoal smudges dark against her pale skin. Hugo Vane’s response was blunt, his words clipped. “I spoke with Dr. Finch about the tide schedule. She seemed on edge. After that, I joined the others in the dining room. If you’re suggesting I was out here, let’s not beat around the bush.”

Eleanor jotted notes in her battered notebook, the tip of her pencil catching on the damp page. The contradictions pressed in: witnesses claimed to have seen Dr. Mallory Finch alive just before eleven, yet the tide had reached its highest at half past eleven at night. The watch found in her hand—ten minutes past eleven—stood as a silent rebuke to their recollections. She glanced from the footprints to the sea, then back to the group. “Does anyone recall exactly when the tide was at its highest?” she asked, her tone casual, though her mind was racing.

Captain Ivor Hale answered, “The schedule said half past eleven at night. I checked it myself before dinner—old habit from the navy.” Beatrice Quill nodded, her lips pursed. “Mallory was always fussing about the tide. She borrowed my shawl at a quarter to eleven, said she’d be back in a moment. She never returned it.” The wind caught the edge of her dress, and she pulled the fabric tighter, as if warding off more than just the chill.

Eleanor’s thoughts snagged on the sequence: the footprints leading only out, the watch stopped at ten minutes past eleven, and the tide peaking at half past eleven at night. The timeline was narrowing, the window for what could have happened shrinking with every minute accounted for. Yet the witnesses’ accounts, so precise, seemed almost too tidy. She wondered, not for the first time, if they were all protecting themselves—or someone else.

A gull wheeled overhead, its cry slicing through the tension. Hugo Vane shifted, his gaze fixed on the sand. “If you want my opinion, you’re chasing ghosts. The tide erases everything. Whatever happened out here, the sea’s already taken it.” His words were brusque, but Eleanor caught the flicker of something in his eyes—fear, or perhaps guilt. She pressed, “You said you discussed the tide schedule with Dr. Finch. Did she mention going out to the water?” Hugo Vane’s mouth tightened. “She was anxious, yes. Kept checking her watch. But she didn’t say anything about coming down here.”

Beatrice Quill interjected, her tone edged with impatience. “We’re all just repeating ourselves, aren’t we? The facts are what they are. Mallory was last seen before eleven, and the tide came in at half past eleven at night. The rest is speculation.” She glanced at Eleanor, her eyes sharp. “Unless you think these footprints belong to someone else?”

Eleanor considered the question, her mind whirring. The prints were too large for Beatrice Quill, too deep for Sylvia Trent. Captain Ivor Hale’s boots left a different pattern entirely. That left Hugo Vane—or Dr. Mallory Finch herself. But if the latter, where was the return trail? The sand was silent, but the absence spoke volumes.

Sylvia Trent, her voice barely above the surf, murmured, “Art is a reflection of the soul, don’t you think? Sometimes what’s missing is as important as what’s there.” She knelt beside the prints, tracing the outline with a careful finger. “If Mallory came out here, she didn’t come back. Or someone else didn’t.” Her words hung in the air, heavy and unresolved.

The wind picked up, carrying the tang of seaweed and distant smoke from the hotel’s kitchen. Eleanor straightened, closing her notebook. “We have footprints leading out, a watch stopped at ten minutes past eleven, and a tide that reached its highest at half past eleven at night. The timeline is tight—too tight for comfort.” She looked at each of them in turn, searching for a crack in their composure. “Until we find out whose prints these are, or why there’s no return, we’re left with more questions than answers.”

A moment of uneasy silence followed, broken only by the rhythmic crash of the waves. Captain Ivor Hale’s jaw worked, as if he were biting back a retort. Beatrice Quill’s fingers fluttered at her throat, her bravado slipping. Hugo Vane stared at the horizon, his posture rigid. Sylvia Trent’s eyes shimmered with something like fear—or perhaps recognition. Eleanor felt the weight of their secrets pressing in, as relentless as the tide itself.

She turned away from the water, the sand clinging to her shoes. The investigation was no closer to resolution, but the day’s discoveries had shifted the ground beneath their feet. The footprints, the timeline, the contradictions—they were pieces of a puzzle that refused to fit. Eleanor allowed herself a thin, wry smile. Well, isn’t that just the way of the world? she thought. The spaces in between, indeed.
--- END PRIOR CHAPTER 3 ---

[SCENE COMPLETENESS CONTRACTS — MANDATORY. Each contract below lists what you MUST enact in that chapter. Do not summarise or mention these labels in the prose — enact them organically.]
Chapter 4 (Act 2) completeness contract:
  PIVOT ELEMENT (MANDATORY — write this into the prose, shown not told): "Hugo's admission of being near the beach shortly before Dr. Finch's death."
  FACT ESTABLISHED (MANDATORY — reader must know this by chapter end): "Establishes Hugo's suspicious proximity to the crime scene at a critical time."

# Case Overview
Title: The Tide's Deception
Era: 1940s
Setting: Seaside Hotel
Crime: murder (drowning)
Culprit: Hugo Vane
Victim: Dr. Mallory Finch
False assumption: Dr. Mallory Finch drowned during the party.
Cast: Eleanor Voss (she/her), Dr. Mallory Finch (she/her), Captain Ivor Hale (he/him), Beatrice Quill (she/her), Sylvia Trent (she/her), Hugo Vane (he/him)

Setting Lock: Keep all scenes and descriptions consistent with the stated setting (Seaside Hotel). Do not introduce a different location type. Do not invent an alternative estate name. The only permitted name for this property is "Seaside Hotel" — any other estate name (e.g., "Caldwell Manor", "Ashwood Hall", or any invented proper name) is a continuity error that will be caught and rejected.

⛔ PRONOUN LOCK (verify every sentence before writing):
• Eleanor Voss — she/her/her (NEVER he/him)
• Dr. Mallory Finch — she/her/her (NEVER he/him)
• Captain Ivor Hale — he/him/his (NEVER she/her)
• Beatrice Quill — she/her/her (NEVER he/him)
• Sylvia Trent — she/her/her (NEVER he/him)
• Hugo Vane — he/him/his (NEVER she/her)

Outline scenes:
[
  {
    "sceneNumber": 4,
    "act": 2,
    "title": "Interrogation of Hugo",
    "setting": {
      "location": "the seaside hotel lounge",
      "timeOfDay": "Afternoon",
      "atmosphere": "Intense, with a palpable sense of accusation"
    },
    "characters": [
      "Eleanor Voss",
      "Hugo Vane"
    ],
    "purpose": "Question Hugo about his whereabouts during the incident.",
    "cluesRevealed": [
      "clue_4",
      "clue_7",
      "clue_late_1"
    ],
    "dramaticElements": {
      "conflict": "Tension rises as Eleanor presses Hugo for details.",
      "tension": "Hugo's evasiveness raises suspicion.",
      "microMomentBeats": [
        "Eleanor's gaze sharpens as Hugo hesitates, sensing his discomfort."
      ]
    },
    "summary": "Eleanor confronts Hugo Vane in the hotel lounge, pressing him about his whereabouts during the time of Dr. Finch's death. Hugo's evasiveness and nervous demeanor raise Eleanor's suspicions, especially when he mentions being near the beach shortly before the incident. The atmosphere thickens with tension as Eleanor realizes Hugo may have more to hide than he admits.",
    "beat": "motives",
    "estimatedWordCount": 1800,
    "pivotElement": "Hugo's admission of being near the beach shortly before Dr. Finch's death.",
    "factEstablished": "Establishes Hugo's suspicious proximity to the crime scene at a critical time.",
    "permittedBehavioursByAct": [
      {
        "characterName": "Eleanor Voss",
        "behaviour": "May show unease, evasion, or mild defensiveness when questioned."
      },
      {
        "characterName": "Hugo Vane",
        "behaviour": "May show unease, evasion, or mild defensiveness when questioned."
      }
    ],
    "redHerringPlacement": null,
    "emotionalRegister": "Eleanor begins to uncover clues, revealing the intertwined motives of the suspects.",
    "dominantCharacterNote": {
      "name": "Eleanor Voss",
      "voiceRegister": "Eleanor speaks with a fluid rhythm, often punctuating her observations with ironic commentary."
    },
    "humourGuidance": {
      "permission": "permitted"
    },
    "eraTextureNote": "Rationing limiting access to food and consumer goods; Limited communication due to ongoing military activities; Travel restrictions imposed by wartime regulations; Frequent blackouts affecting evening activities; Scarcity of materials impacting clothing and fashion choices",
    "locationRegisterNote": "",
    "mechanismRevealAllowed": false
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
□ For every chapter after Chapter 1, include at least one NEW character pressure reveal (fear, motive, lie, loyalty conflict, or victim relationship).
□ Each post-Chapter-1 character reveal changes investigation state (more/less suspicious, lie explained, motive exposed, emotional cost deepened, or investigator understanding updated).
□ No post-Chapter-1 chapter contains static biography-only character paragraphs.
□ Mode check (Suspect Pressure): chapter contains a NEW pressure reveal (fear, motive, lie, loyalty conflict, or secret).
□ Mode check (Suspect Pressure): NO culprit resolution — the chapter must NOT contain a confession, an arrest/'under arrest', 'case closed', 'I accuse'/'I name', or 'the culprit/murderer/killer is/was …'. Build suspicion only; the accusation is reserved for the final reveal.
□ PRONOUN AUDIT — for every character you named in your chapters, list the pronouns you actually used, then verify against the canonical table. Correct any mismatch before outputting. Do NOT include this audit in your JSON output.
  Character            | Canonical     | Used in draft | Match?
  ---------------------|---------------|---------------|-------
  Eleanor Voss         | she/her/her/herself       | [fill in]     | [yes/no]
  Dr. Mallory Finch    | she/her/her/herself       | [fill in]     | [yes/no]
  Captain Ivor Hale    | he/him/his/himself        | [fill in]     | [yes/no]
  Beatrice Quill       | she/her/her/herself       | [fill in]     | [yes/no]
  Sylvia Trent         | she/her/her/herself       | [fill in]     | [yes/no]
  Hugo Vane            | he/him/his/himself        | [fill in]     | [yes/no]
□ Return valid JSON only.
```
