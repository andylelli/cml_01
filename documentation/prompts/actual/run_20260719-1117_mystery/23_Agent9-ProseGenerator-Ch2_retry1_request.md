# Actual Prompt Record

- Run ID: `mystery-1784459833247`
- Project ID: ``
- Timestamp: `2026-07-19T11:23:28.143Z`
- Agent: `Agent9-ProseGenerator-Ch2`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4.1`
- Temperature: `0.54`
- Max Tokens: `4500`
- Attempt: `retry 1`
- Prompt Hash: `a9b1d84c77531c48`

## Message 1 (role=system)

```text
NARRATIVE VOICE: Hugo Vane[HE] is the viewpoint character. Unanchored “she/her” or “he/him” without a nearby name refers to Hugo Vane. Default narrator pronoun: HE. Never default to “he/his” as the neutral narrator voice unless the POV character is male.

You are an expert prose writer for classic mystery fiction. Your role is to write compelling, atmospheric narrative chapters that read like a professionally published novel.

⛔ ABSOLUTE RULE — CHARACTER NAMES:
The ONLY characters who exist in this story are: Eleanor Voss (woman) — DECEASED, past-tense only, Dr. Mallory Finch (woman), Captain Ivor Hale (man), Beatrice Quill (woman), Sylvia Trent (woman), Hugo Vane (man).
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
- MORAL COMPLEXITY REQUIREMENT: The mechanism of this crime carries a moral gray area: "The murderer believed they were protecting a loved one from the victim's abusive tendencies, creating a tragic conflict of ethics." — the culprit reveal and denouement MUST acknowledge this ambiguity. Do not let the ending feel clean or simple. Give the reader at least one moment of uncomfortable sympathy or moral doubt.

- CHAPTER OPENING (every chapter, lint-enforced): never open on a tour or inventory of named rooms/places. The first sentence must land a character ACTION, a specific sensory detail, or a concrete in-scene moment — not "In the [room], the [room], and the [room]…". Locations enter through what a character does in them, one at a time.
- VICTIM IDENTITY & OPENING HOOK (ROADMAP_TO_80 M2): The murder victim is Eleanor Voss. Name them — Eleanor Voss — in the FIRST PARAGRAPH; never open with "the victim" or "the body". Open IN MEDIAS RES: the first one or two sentences must land the discovery and the single unsettling CONTRADICTION (the impossible detail that starts the case), seen through the investigator's eyes. Weave sensory and atmosphere detail AROUND that hook — do NOT precede the stakes with a standalone scene-setting/weather preamble. They are found dead — they do not speak, react, or gesture. This is their only physical appearance in the story.

⚠️ AMATEUR DETECTIVE STORY: The investigator is a civilian with no official standing. The official police (if they appear) are unnamed background figures only — "a constable", "the sergeant", "an officer from the village". Do NOT give any police official a name or title+surname combination. There is no Inspector [Surname], no Constable [Surname], no Sergeant [Surname] in this story.


CRITICAL CHARACTER CONSISTENCY RULES:

1. Each character has ONE canonical name. Use ONLY names from this list. Never vary, abbreviate, or add titles beyond what is listed.
   COMPLETE CAST (no other named characters exist): Eleanor Voss (DECEASED), Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill, Sylvia Trent, Hugo Vane
   - "Mr. Jennings entered the room" → ILLEGAL. Jennings is not in the cast.
   - "Constable Reed took notes" → ILLEGAL. Reed is not in the cast.
   - "A constable took notes" → LEGAL (no name given).

2. Character roles are fixed:
   - Eleanor Voss: victim (DECEASED — does not appear in any scene, past tense only)
   - Dr. Mallory Finch: Professional Rival
   - Captain Ivor Hale: Disgraced Hero
   - Beatrice Quill: Aspiring Influencer
   - Sylvia Trent: Wealthy Patron
   - Hugo Vane: Cunning Opportunist
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

## Era: January 1947
Living in January 1947 means navigating a complex landscape shaped by post-war recovery and the looming Cold War. The air is thick with uncertainty, as many grapple with the remnants of conflict while trying to rebuild their lives. The foggy and chilly coastal climate further reflects the social atmosphere, with its chilly temperatures averaging around 40°F, and occasional rain that dampens both spirits and outdoor activities. People gather indoors, seeking warmth and connection, but the weight of personal and collective anxieties lingers in conversations. The remnants of rationing still affect daily life, as families adjust to new economic realities, and tensions rise in Europe, hinting at the geopolitical shifts that will define the coming years.
Emotional register: A collective sense of uncertainty and anxiety permeates society as people strive to find stability in a changing world.
Physical constraints: Limited travel options due to ongoing rationing | Poor weather conditions affecting mobility | Limited access to information due to the evolving media landscape
Current tensions (weave into background texture): Tensions rising in Europe as the Cold War begins | Inflation and rationing affecting daily life | Strikes in the UK as workers demand better wages
Wartime context — Many veterans are returning to civilian life, struggling with reintegration: Communities are healing, yet the scars of war remain evident in personal relationships Absence effect: Absent loved ones create a sense of loss that echoes through families and gatherings

## Season Lock (mandatory — derived from January 1947)
Season: winter. Allowed vocabulary: winter, wintry, midwinter
Forbidden seasonal words — never use in narration, dialogue, or metaphor: spring, summer, autumn and their adjectival forms.
Every weather description, atmosphere, and time-of-year reference must be consistent with winter.

## Story Theme
The story explores how the pressures of societal expectations and personal ambition can lead to destructive choices and unforeseen consequences, and reveals that evidence carries ethical weight, forcing characters to choose accountability over social performance when appearances and facts collide.

## Story Emotional Register
Dominant: The story carries an atmosphere of tension and unease, marked by the complexities of human relationships.

Arc:
The Seascape Hotel is shrouded in fog as guests gather for a charity gala, where the air is heavy with anticipation and secrets. The evening takes a dark turn when Eleanor Voss is discovered dead in the Ocean View Suite, her demise casting a pall over the festivities. With the weight of the initial crime pressing down, investigators and guests alike grapple with the implications of her death, leading to rising unease as clues begin to surface. As the investigation unfolds, whispers of Eleanor’s financial troubles and the motives of those around her become clear, revealing a tangled web of jealousy and ambition. The investigators face the emotional toll of their pursuit, as personal stakes intertwine with the quest for justice. A pivotal moment occurs when a vial is found, suggesting premeditated murder, shifting the focus to Dr. Mallory Finch, whose access and motives come under scrutiny. As the tension mounts, the confrontation reaches its peak, and the truth emerges, revealing unexpected alliances and betrayals. In the aftermath, the emotional costs are laid bare; Eleanor’s secrets haunt those who survived, leaving them to confront their own choices in a world that feels irrevocably altered.

The story opens: An atmosphere of elegance tinged with foreboding sets the stage for the unfolding mystery. As the investigation takes shape: The discovery of Eleanor's body injects a jarring sense of urgency into the investigation. A first key turn arrives: Initial clues point to financial motives, deepening the complexity of relationships. At the mid-point of the story: The discovery of the vial shifts suspicion toward those closest to Eleanor.

A second pivot reshapes the course: A revelation about Dr. Mallory Finch's access to the poison pivots the investigation. As tension reaches its height: The mounting pressure leads to a tense confrontation where truths are exposed.

## Emotional register at this point in the story
An atmosphere of elegance tinged with foreboding sets the stage for the unfolding mystery.

## Character Portraits (appearance & era)

### Captain Ivor Hale
Captain Ivor Hale symbolizes the struggle of returning soldiers who grapple with their past while facing modern societal challenges. His blackmail scheme reflects the desperation many veterans feel as they attempt to find their footing in a world that has changed.
Era intersection: Ivor's financial troubles and feelings of inadequacy resonate with the broader societal challenges faced by veterans adjusting to civilian life.

### Beatrice Quill
Beatrice Quill embodies the ambition of young women in the 1940s, vying for success in journalism while concealing her relationship with Eleanor. Her internal conflict illustrates the societal expectations that often force women to choose between personal desires and professional aspirations.
Era intersection: Her fear of scandal reflects the changing attitudes toward women's roles in society, as they navigate the complexities of their ambitions.

### Sylvia Trent
Sylvia Trent represents the elite social circles grappling with the pressures of maintaining status in a changing world. Her jealousy of Eleanor underscores the anxieties faced by women who feel threatened by others' success.
Era intersection: Her internal struggles mirror the societal tensions of the time, as women grapple with newfound independence amidst traditional expectations.

### Hugo Vane
Hugo Vane exemplifies the opportunistic spirit of the post-war era, using charm to navigate a world filled with uncertainty. His illicit dealings highlight the ethical dilemmas faced by individuals trying to capitalize on the changing economic landscape.
Era intersection: His internal conflict reflects the broader societal tensions as people grapple with morality in a world recovering from war.

## Character Voices

### Captain Ivor Hale (he/him/his)
Ivor speaks in a gruff manner, using self-deprecating humor to soften the harshness of his reality.
[comfortable] Just a sailor adrift in a storm, I suppose. Life has its way, doesn't it?
[evasive] I don't think that's relevant. Let's focus on more pressing matters.
[stressed] If anyone finds out about my past... well, I just can't think about it.
Humour: His self-deprecating humor reflects his struggle with feelings of inadequacy.

### Beatrice Quill (she/her/her)
Beatrice speaks with youthful exuberance, often punctuating her sentences with sarcasm.
[comfortable] Well, isn’t that just the cherry on top? Life's full of surprises, isn't it?
[evasive] Oh, I couldn’t say much on that. Just hear say, really.
[stressed] If anyone finds out about Eleanor and me... it would ruin everything!
Humour: Her sardonic wit reflects her ambition and internal conflict.

### Sylvia Trent (she/her/her)
Sylvia speaks with refined eloquence, often delivering biting remarks wrapped in compliments.
[comfortable] Oh, darling, isn’t life just a delightful mess? We must embrace it!
[evasive] I really shouldn't comment on that. It’s quite delicate, after all.
[stressed] I can’t let anyone see my insecurities. They must never know!
Humour: Her polite savagery allows her to mask her insecurities.

### Hugo Vane (he/him/his)
Hugo speaks smoothly, often using observational humor to navigate conversations.
[comfortable] Ah, the fine art of persuasion, my friend. It’s all in the delivery.
[evasive] Let's not dwell on that; I believe there are more pressing matters.
[stressed] If the truth comes out, it could ruin everything I've built.
Humour: His observational humor reflects his charm and opportunistic nature.

## Location Registers (scene framing guides)

The Ocean View Suite: The Ocean View Suite, once a symbol of luxury, now feels heavy with dread and unease, as chaos has replaced its elegance. The shattered glass and billowing curtains create a haunting tableau that echoes the tragedy of the night.. Camera angle: As a writer enters this space, they should feel the weight of the tragedy, capturing the tension and disarray that speaks to the unsettling events that have transpired.. Era: This space, while opulent, now serves as a stark reminder of the fragility of life and the hidden darkness that can lurk beneath a polished facade.

The Grand Lobby: The Grand Lobby buzzes with nervous energy as guests engage in hushed conversations, the opulence of the space contrasting sharply with the anxiety that permeates the air. The tension is palpable, as if the very walls hold secrets waiting to be uncovered.. Camera angle: Writers should focus on the vibrant yet tense interactions, highlighting the opulence that belies the underlying turmoil.. Era: The atmosphere reflects the societal changes of the 1940s, where the echoes of war still resonate in the lives of those present.

The Oceanview Dining Room: The Oceanview Dining Room, adorned with elegance, holds an air of sophistication that masks the rising tension among guests. The scents of fine cuisine mix with an undercurrent of suspicion, creating an atmosphere where every glance carries weight.. Camera angle: The writer should capture the juxtaposition of elegance and tension, focusing on the subtle exchanges that hint at underlying threats.. Era: The dining experience not only reflects culinary excellence but also captures the shifting social dynamics of the time, as the guests' interactions reveal deeper rivalries.

The Staff Quarters: The Staff Quarters encapsulate a sense of camaraderie and fatigue, as staff members navigate the pressures of their roles amidst the unfolding tragedy. The dim lighting and worn furnishings create an environment where whispers of the investigation linger.. Camera angle: Writers should focus on the intimate dynamics among staff, revealing their concerns and reactions to the events unfolding above.. Era: This space reflects the hard work and dedication of those behind the scenes, contrasting with the glamour of the guest areas.

## Humour guidance for this story position (opening)
Permission: forbidden
Rationale: The initial atmosphere must remain serious to establish the stakes of the mystery.

FAIR-PLAY AND INFERENCE CONTRACT:
- FAIR PLAY CLUE TIMING: Never combine clue discovery and detective deduction in the same chapter. If a clue is first revealed to the reader in chapter N, the detective may only analyze, deduce from, or act on that clue in chapter N+1 or later.
- FAIR PLAY INFORMATION PARITY: The reader must see all clues BEFORE the detective uses them in reasoning. If the detective performs a test or makes a deduction, every piece of evidence supporting that conclusion must have been shown to the reader in earlier chapters.
- FAIR PLAY REVELATION SPACING: In the discriminating test scene, the detective can ONLY use clues that were revealed to the reader at least 1 full chapter earlier. Never introduce new clues or withheld information during the test.
- FAIR PLAY CONFRONTATION: During the final confrontation/revelation, the detective cannot surprise the reader with facts. Every piece of evidence cited must have been visible to the reader in prior chapters.
- Never solve by withheld information. Keep reader-information parity with detective reasoning.
- False assumption in force: Eleanor died from a heart attack due to her anxiety.
- Hidden truth to progressively expose (compose in your own words from these elements): true, cause, slow, acting, poison
- Inference path checkpoints to dramatize clearly — compose ENTIRELY in your own sentences from these key terms (reproducing any briefing phrase verbatim FAILS validation):
  - Step 1: obs: witnesses, recall, served, eleanor, unusually, warm | corr: suggests, poison, activated, heat | effect: narrows, focus, service, possible, source, poison
  - Step 2: obs: small, vial, service, area | corr: vial, likely, contains, poison, used, eleanor, murder, indicating, premeditation | effect: eliminates, captain, ivor, hale, suspect, lack, access, poison
  - Step 3: obs: mallory, finch, seen, near, service, shortly, before, eleanor, collapse | corr: access, knowledge, eleanor, condition, suggest, poisoned | effect: narrows, suspect, pool, mallory, finch
- Discriminating test method: trap
- Discriminating test elements to dramatize (compose ENTIRELY in your own sentences from these — do NOT reproduce any briefing phrase verbatim): discriminating, compares, service, witness, recall, claimed, timeline
- Test must rely on already-shown clue IDs: clue_culprit_direct_1, clue_5, clue_7, clue_culprit_direct_dr_mallory_finch
- Fair-play rationale: Step 1: Witnesses' observations about the tea's heat (early) and the vial found (mid) lead the reader to question the cause of Eleanor's death. Step 2: Finch's proximity to the tea service narrows the suspect pool (mid). Step 3: The controlled reenactment (discriminating test) confirms the poisoning method.

## Character Reference

### Captain Ivor Hale (he/him — NEVER she/her)
Ivor often speaks in a gruff, straightforward manner, occasionally softening with self-deprecating humor that hints at his inner turmoil
His sentences are clipped, reflecting both military precision and a reluctance to reveal too much.
Ivor battles with feelings of shame over his financial desperation and the blackmail that has ensnared him in a web of deceit.
Voice colour: Captain Ivor Hale uses self deprecating humour — let it surface in their dialogue where natural, not in every line.

### Beatrice Quill (she/her — NEVER he/him)
Beatrice speaks with a youthful exuberance, often punctuating her sentences with a touch of sarcasm
She has a tendency to weave stories into her conversations, making her sound both engaging and slightly verbose.
Beatrice wrestles with the fear that her secret relationship could ruin her career, leading her to question her values and ambitions.
Voice colour: Beatrice Quill uses sardonic humour — let it surface in their dialogue where natural, not in every line.

### Sylvia Trent (she/her — NEVER he/him)
Sylvia speaks with a refined eloquence, often using flowery language that masks her sharp wit
She has a tendency to deliver biting remarks wrapped in compliments, showcasing her polite savagery.
Sylvia struggles with feelings of inadequacy and the fear that her social standing is slipping away, leading her to question her values.
Voice colour: Sylvia Trent uses polite savagery humour — let it surface in their dialogue where natural, not in every line.

### Hugo Vane (he/him — NEVER she/her)
Hugo speaks with a smooth, persuasive cadence, often peppering his conversations with observational humor
He has a tendency to sidestep direct questions, using charm to navigate difficult topics.
Hugo feels the weight of his choices pressing down on him, torn between the allure of opportunism and the desire for genuine connections.
Voice colour: Hugo Vane uses observational humour — let it surface in their dialogue where natural, not in every line.


## CHARACTER CONTRACTS (binding for this scene)
Each entry below constrains how this character must be written in this chapter.
These override generic style guidance when they conflict.

### Captain Ivor Hale[HE]
Voice & mannerisms: Ivor often speaks in a gruff, straightforward manner, occasionally softening with self-deprecating humor that hints at his inner turmoil. His sentences are clipped, reflecting both military precision and a reluctance to reveal too much.
SIGNATURE TIC (use sparingly — this is Captain Ivor Hale's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "Just a sailor adrift in a storm, I suppose."
Sample voice fragments (match this register and rhythm):
  [comfortable] "Just a sailor adrift in a storm, I suppose. Life has its way, doesn't it?"
  [evasive] "I don't think that's relevant. Let's focus on more pressing matters."
Humour: self deprecating — deploy occasionally (level 0.4)
FORBIDDEN phrase (never write for Captain Ivor Hale): "she knew with certainty she was right"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Ivor needed the victim to keep silent about his blackmail, which involved sensitive information from their past." — do not surface in Act I.

### Beatrice Quill[SHE]
Voice & mannerisms: Beatrice speaks with a youthful exuberance, often punctuating her sentences with a touch of sarcasm. She has a tendency to weave stories into her conversations, making her sound both engaging and slightly verbose.
SIGNATURE TIC (use sparingly — this is Beatrice Quill's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "Well, isn’t that just the cherry on top?"
Sample voice fragments (match this register and rhythm):
  [comfortable] "Well, isn’t that just the cherry on top? Life's full of surprises, isn't it?"
  [evasive] "Oh, I couldn’t say much on that. Just hear say, really."
Humour: sardonic — deploy occasionally (level 0.5)
FORBIDDEN phrase (never write for Beatrice Quill): "palpable tension filled the room"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Beatrice's fear of scandal drove her to consider drastic measures to protect her reputation and career." — do not surface in Act I.

### Sylvia Trent[SHE]
Voice & mannerisms: Sylvia speaks with a refined eloquence, often using flowery language that masks her sharp wit. She has a tendency to deliver biting remarks wrapped in compliments, showcasing her polite savagery.
SIGNATURE TIC (use sparingly — this is Sylvia Trent's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "Oh, darling, isn’t life just a delightful mess?"
Sample voice fragments (match this register and rhythm):
  [comfortable] "Oh, darling, isn’t life just a delightful mess? We must embrace it!"
  [evasive] "I really shouldn't comment on that. It’s quite delicate, after all."
Humour: polite savagery — deploy occasionally (level 0.6)
FORBIDDEN phrase (never write for Sylvia Trent): "she felt a wave of unease"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Sylvia believed the victim's ascendance would diminish her social standing, pushing her to consider eliminating the competition." — do not surface in Act I.

### Hugo Vane[HE]
Voice & mannerisms: Hugo speaks with a smooth, persuasive cadence, often peppering his conversations with observational humor. He has a tendency to sidestep direct questions, using charm to navigate difficult topics.
SIGNATURE TIC (use sparingly — this is Hugo Vane's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "Ah, the fine art of persuasion, my friend."
Sample voice fragments (match this register and rhythm):
  [comfortable] "Ah, the fine art of persuasion, my friend. It’s all in the delivery."
  [evasive] "Let's not dwell on that; I believe there are more pressing matters."
Humour: observational — deploy occasionally (level 0.5)
FORBIDDEN phrase (never write for Hugo Vane): "everyone could sense the atmosphere"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Hugo wanted the victim to cover for him regarding a recent deal gone wrong, fearing exposure." — do not surface in Act I.



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

Primary Location: The Seascape Hotel (Brighton, England)
A striking coastal hotel that blends Victorian elegance with Art Deco flair, perched precariously on a cliff overlooking the turbulent sea.

Key Locations Available:
- The Ocean View Suite (interior): Crime scene
- The Grand Lobby (interior): Gathering space
- The Oceanview Dining Room (interior): Dining and socializing space
- The Staff Quarters (interior): Staff-only area for rest and preparation

Atmosphere (tonal cue only — do NOT reproduce this phrase verbatim in prose; translate into scene-specific, character-observed sensory language): Tense and uneasy, with a sense of impending change due to post-war adjustments
Weather: Foggy with occasional rain, typical of coastal climates in the 1940s

Era markers: Radio broadcasting soft jazz in the lobby | Early television set flickering in the lounge | Post-war automobile parked outside | Wartime rationing affecting guest supplies

USAGE GUIDELINES:
1. First mention of location: Ground the scene using sensory details drawn from the profiles — paraphrase these into what the POV character directly observes and experiences, not a summary of the room's general qualities
2. Geographic grounding: Reference the specific place (Brighton, England) naturally in dialogue or narrative
3. Action scenes: Integrate physical layout details (access, sightlines, constraints)
4. Atmospheric scenes: Reference weather, lighting, sounds from sensory palette
5. Era details: Weave in period markers naturally
6. Consistency: Keep all location descriptions aligned with profiles
7. OPENING GROUNDING (required, first 1-2 paragraphs of EVERY chapter): (a) name the specific location from this list, (b) give at least 2 concrete sensory details (sound, smell, temperature, texture, light/shadow), and (c) one time-of-day or weather/atmosphere detail — BEFORE advancing plot, clues, or the mechanism. Open on the setting and the people in it, not on the puzzle.
8. This matters most in pre-reveal chapters that withhold the mechanism: ground them in setting and character rather than rushing the investigation — a withheld chapter is not an empty one.
9. Do NOT use generic repeated manor/storm filler without profile-specific details; vary the opening location/sense each chapter

SENSORY PALETTE (use 2-3 senses per scene):
The Ocean View Suite (interior):
  - Visual: shattered glass on carpet, billowing lace curtains, upturned champagne bottle
  - Sounds: distant waves crashing, whispering wind through the window, faint ticking of a clock
  - Scents: scent of spilled champagne, salt air from the ocean, dusty upholstery
  - Touch: cold shards of glass, soft silk of curtains

The Grand Lobby (interior):
  - Visual: elegant Art Deco chandeliers, plush velvet armchairs, tall windows framing the sea
  - Sounds: soft chatter of guests, clinking of glasses, background jazz music
  - Scents: freshly brewed coffee, scent of polished wood, hint of perfume
  - Touch: smooth marble underfoot, plush fabric of armchairs

The Oceanview Dining Room (interior):
  - Visual: crisp white tablecloths, gleaming silver cutlery, floor-to-ceiling windows
  - Sounds: clinking of cutlery, soft murmur of conversations, gentle music from a string quartet
  - Scents: aroma of grilled seafood, scent of fresh herbs, hint of citrus from desserts
  - Touch: smooth texture of fine china, coolness of crystal glasses

⛔ REFERENCE DATA — DO NOT TRANSCRIBE VERBATIM: The above profiles are structural guides only. Generate original prose that evokes these qualities; do not reproduce the exact phrasing or sentence structure of the profile paragraphs.

SCENE OPENING RULE: When opening a scene in a new location, write what the POV character directly observes and physically senses at that moment — not a general description of the room's qualities. The reader must feel pre
[truncated for prompt budget]

## Texture Pool
Draw on these as opportunities arise — you are not required to use them.

- Living in January 1947 means navigating a complex landscape shaped by post-war recovery and the looming Cold War
- The air is thick with uncertainty, as many grapple with the remnants of conflict while trying to rebuild their lives
- The foggy and chilly coastal climate further reflects the social atmosphere, with its chilly temperatures averaging around 40°F, and occasional rain that dampens both spirits and outdoor activities
- People gather indoors, seeking warmth and connection, but the weight of personal and collective anxieties lingers in conversations
- The remnants of rationing still affect daily life, as families adjust to new economic realities, and tensions rise in Europe, hinting at the geopolitical shifts that will define the coming years.

TEMPORAL CONTEXT:

This story takes place in January 1947 during winter.

Seasonal Atmosphere:
- Weather patterns: foggy with occasional rain, chilly temperatures averaging around 40°F, overcast skies
- Daylight: Short winter days with daylight lasting from approximately 7:30 AM to 4:30 PM, when the sun sets behind thick clouds.
- Seasonal activities: attending winter dances at local community halls, visiting indoor ice skating rinks, enjoying hot beverages in cozy cafés
- Seasonal occasions: New Year's Day, Martin Luther King Jr. Day
- Season: winter

Period Fashion (describe naturally):
- Men formal: double-breasted wool suit, thin tie with geometric patterns, fedora hat
- Men casual: corduroy trousers, knit sweater, wool overcoat
- Men accessories: leather gloves, silk pocket square, wristwatch with a leather strap
- Women formal: tea-length dress with a fitted waist, three-quarter sleeve coat with fur trim, pearl necklace
- Women casual: tweed skirt with a cashmere sweater, button-up blouse with a Peter Pan collar, ankle-length wool coat
- Women accessories: beret or cloche hat, nylon stockings, leather handbag

Cultural Context (reference naturally):
- Music/entertainment: Bing Crosby - 'White Christmas', Nat King Cole - 'The Christmas Song', Frank Sinatra - 'I'll Be Home for Christmas'; Films: The Best Years of Our Lives, It’s a Wonderful Life; Theatre: A Streetcar Named Desire, Death of a Salesman; Radio: Suspense, The Jack Benny Program
- Typical prices: Loaf of bread: four pence, Movie ticket: one shilling, Coal scuttle refill: one shilling sixpence
- Current events: Tensions rising in Europe as Cold War begins; The United Nations begins its first assembly session
- Literature: The Catcher in the Rye by J.D. Salinger | The Naked and the Dead by Norman Mailer | The Fountainhead by Ayn Rand | [hard-boiled detective fiction] | [post-war literature exploring existential themes] | [romantic novels]
- Technology: the first commercial jet aircraft prototype | the introduction of the polio vaccine trials | early computer developments at Harvard | radio sets as the primary source of news and entertainment | the first television sets in homes | military radar technology beginning to be adapted for civilian use
- Daily life: gathering at local cafés for warm drinks, participating in community dances, attending church services
- Social rituals: Sunday family dinners, Friday evening radio shows as family entertainment

Atmospheric Details:
The air is thick with fog, muffling the sounds of the bustling streets and lending an eerie quiet to the hotel lobby. The scent of damp wool and fresh coffee merges in the air, with the sporadic laughter of patrons echoing against the aged walls. Dim lights flicker above the bar where weary travelers sip their drinks, the tension palpable as whispers of the outside world filter through the haze.

FASHION INTEGRATION TECHNIQUES:
- First appearance: Describe outfit to establish class/personality
- Accessories: Gloves, hats, pocket watches, jewelry reveal status
- Time-specific: Different outfits for different times of day
- Character traits: Fastidious dresser vs rumpled appearance
- Action integration: "She tugged at her glove" or "He adjusted his tie"
- Weather appropriate: Overcoats in winter, light linen in summer

CULTURAL TOUCHSTONE INTEGRATION:
- Casual conversation: "Did you
[truncated for prompt budget]

NON-NEGOTIABLE CHAPTER OBLIGATIONS — LOCKED EVIDENCE VALUES (VERBATIM REQUIRED):
The following measured values (times, amounts, measurements) are absolute ground truth. Every time this chapter describes, mentions, or alludes to one — no matter how briefly — it MUST use the exact phrase shown below, character for character. NO paraphrase, approximation, rounding, or synonym is permitted.

FAILURE EXAMPLE: if the locked value is "at thirteen minutes to midnight" and you write "just before midnight" or "around midnight" — that is a HARD FAIL. You must write "at thirteen minutes to midnight". Equally, if the locked value is written in words, such as "ten minutes past eleven", and you convert it to figure-based clock notation — that is also a HARD FAIL. Words stay as words; figure forms are forbidden for word-phrased facts.

CRITICAL — WORD-PHRASED VALUES: If the canonical value is written out in words (e.g. a time like "ten minutes past eleven", or an amount like "forty minutes"), reproduce those exact words. DO NOT convert to figure-based time notation, twenty-four-hour format, or any other numeric shorthand. Correct: "ten minutes past eleven". WRONG: figure-based clock notation or numeric shorthand.

Locked values:
  - The temperature of the tea at the time it was served.: "one hundred eighty degrees"
  - The time the victim was declared dead.: "half past ten at night"

If a value has no relevance to this chapter, omit it. But the moment you reference the underlying evidence, only the exact phrase above is acceptable.

EVIDENCE TO CONVEY IN YOUR OWN WORDS (NOT verbatim): weave each of these descriptive facts into the chapter as a COMPLETE, GRAMMATICAL observation by a character — surface the MEANING, never copy the phrasing word-for-word, and NEVER splice two evidence phrases together with an apostrophe or run two clauses together without a sentence break. If a fact has no relevance to this chapter, omit it.
  - The contents of the vial that released the poison.: deadly poison

⛔ CLUES TO SURFACE IN THESE CHAPTERS — mandatory:
The following evidence MUST be clearly observable to an attentive reader. Do not bury it in atmosphere or passing dialogue. Each clue must be concrete, specific, and noticeable:

• [clue_core_contradiction_chain] suggests, poison, activated, heat
  Category: testimonial | Criticality: essential | Supports inference step 1
  Points to: indicates, eleanor, symptoms, align, heart, attack

• [clue_mid_1] witnesses, recall, served, eleanor, unusually, warm
  Category: testimonial | Criticality: essential | Supports inference step 1
  Points to: suggests, poison, activated, heat

For each clue above: an attentive reader should be able to find, record, and later use it to reason toward the solution.

═══ NARRATIVE STATE (read-only — do not contradict) ═══

LOCKED FACTS — use verbatim whenever this evidence is described:
  • The temperature of the tea at the time it was served.: "one hundred eighty degrees"
  • The contents of the vial that released the poison.: "deadly poison"
  • The time the victim was declared dead.: "half past ten at night"

CHARACTER PRONOUNS — never deviate from these:
  • Eleanor Voss: she/her/her
  • Dr. Mallory Finch: she/her/her
  • Captain Ivor Hale: he/him/his
  • Beatrice Quill: she/her/her
  • Sylvia Trent: she/her/her
  • Hugo Vane: he/him/his

CLUES ALREADY REVEALED TO READER: clue_mechanism_visibility_core, clue_4 — do not reveal these as new information.

INVESTIGATION LOG — WHAT IS ESTABLISHED (do not re-establish, do not repeat):
• Evidence already established (reference only — do NOT restate or quote these; advance beyond them): suggests, poison, activated, heat | poison, deliberately, placed
• Suspect cleared: Captain Ivor Hale[HE] — Proving his absence from the tea service area.
• Suspect cleared: Beatrice Quill[SHE] — Witness statements indicating she was occupied with guests.
• Suspect cleared: Sylvia Trent[SHE] — Alibi verified by hotel staff.
⚠ The story must move FORWARD from this log. Any beat already listed above is forbidden from repeating.

⚠ THIS CHAPTER'S REQUIRED ADVANCE (opening): Discover the body, confirm the victim, establish the scene. The victim is found dead. They do not speak, react, or gesture. This is their only physical appearance — in all subsequent chapters they exist only in past tense (memory, evidence, testimony).

CONTINUITY HANDOFF — previous chapter closing beat:
  • "Yet, as Hugo watched the others file out, their faces drawn and silent, he felt the first stirrings of doubt. The evidence was there, plain enough, but the truth remained elusive. The winter morning pressed in, cold and unyielding, as the dining room settled i..."
  • The next chapter must open as a continuation of this beat, not as a disconnected reset.
═══════════════════════════════════════════════════════

═══════════════════════════════════════════════════════════
📚 CONTINUITY CONTEXT - CHARACTER & SETTING CONSISTENCY
═══════════════════════════════════════════════════════════

**CRITICAL: You are writing chapters 2+. Maintain consistency with earlier chapters.**

**Character Names Used in Chapters 1-1:**
Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill, Sylvia Trent, Hugo Vane

✓ RULE: Use EXACTLY these names. Do NOT vary spelling, add titles, or introduce new forms.
✓ Example: if earlier chapters used "Clara Whitfield", keep using "Clara Whitfield" — never "Mrs. Whitfield" unless that is the character's canonical name in the list above.

**Setting Vocabulary Established in Earlier Chapters:**
dining room

✓ RULE: Continue using this location vocabulary. Maintain consistency with established setting type.
✓ Do NOT introduce new location types that contradict earlier chapters.

**Recent Chapter Summary (for narrative continuity):**
Chapter 1: Chapter 1: The Unsettling Warmth
  Events: The clatter of a silver spoon against porcelain echoed through the coastal hotel dining room, its sound oddly sharp in the wintry morning hush.

⚠️ **VALIDATION:** Character name mismatches and setting drift are common failure modes.
Double-check every character name against the list above before using it.

**⏱ LOCKED TIME ANCHOR — use verbatim, do not paraphrase:**
Clock time (from the case ground truth): **"Tea was served at 8:30 PM"**
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
Known location profile anchors: The Seascape Hotel, The Ocean View Suite, The Grand Lobby, The Oceanview Dining Room, The Staff Quarters, the coastal hotel dining room
LOCATION NAME CAPITALISATION (HARD REQUIREMENT — validated):
All named locations in your prose MUST use the EXACT capitalisation from the CML profiles.
Canonical forms: "The Seascape Hotel", "The Ocean View Suite", "The Grand Lobby", "The Oceanview Dining Room", "The Staff Quarters", "the coastal hotel dining room"
Writing a location in lowercase (e.g. "drawing room" instead of "Drawing Room") is a validated error. Every time you mention a named location, copy its capitalisation from the list above.
- Chapter 2: OPENING STYLE (HARD): Start the VERY FIRST SENTENCE with spoken dialogue — e.g. '"[words]," [Name] said/asked/replied/murmured.' The opening quote must be the first character on the line. Anchor opening in "the coastal hotel dining room". The opening style above governs only your FIRST SENTENCE; the grounding below may land anywhere in the first 2 paragraphs (it need not be sentence one, and never conflicts with the chosen opening style). HARD REQUIREMENT for the first 2 paragraphs: (a) include 2+ sensory words — choose from smell/scent/odor/fragrance/sound/echo/silence/whisper/creak/cold/warm/damp/rough/smooth/glow/shadow/flicker/dim — and (b) include 1+ atmosphere/time word — choose from rain/wind/fog/storm/mist/thunder/evening/morning/night/dawn/dusk/lighting/weather/season/afternoon/midday/noon/midnight/twilight/sunrise/sunset/daylight/sunlight/overcast/cloudy/bright/dark/grey/pale/chill/crisp/drizzle/haze/lamplight/firelight. These are validated requirements, not style suggestions; missing them triggers a retry.

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

PROMPT BUDGET SUMMARY: budget=24000 tokens; fixed=9104; context=12074; dropped=[none]; truncated=[location_profiles, temporal_context, pronoun_accuracy]

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
4. Integrate at least two concrete era-grounded details per chapter from setting refinement signals: radio broadcasting | early television sets | military radar equipment | long-distance telephone calls | military encryption methods | telegram services.
5. Respect setting movement/access constraints in scene action and alibis: narrow hallways limiting movement | staircases leading to restricted areas | rooms with limited sound insulation | staff-only areas like laundry and service entrances | guest access limited to public spaces and their rooms.
6. Sustain social coherence with this backdrop pressure: A gathering at a coastal hotel for a charity gala brings together a diverse group, where the pressures of post-war societal changes and emerging Cold War tensions heighten the stakes of personal and professional rivalries.
7. Maintain continuity around these socially central cast anchors where relevant: Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill, Sylvia Trent, Hugo Vane.
8. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Critical: Plot similarity 0.85 with 'The Mysterious Affair at Styles' (same crime type and method)
9. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Moderate: Character similarity 0.70 with 'The Second Key' (similar character dynamics)
10. STORY TO DATE ANTI-COPY RULE: The STORY TO DATE section below is provided for chronological and factual reference ONLY. You MUST NOT copy, lightly rephrase, or structurally echo any sentence or paragraph from prior chapters. Every sentence in this chapter must be original prose unique to this scene. Reusing even a clause from prior chapter text will cause this attempt to fail immediately.

CRITICAL PROSE REQUIREMENTS:

The CML specifies exact requirements for certain validation-critical scenes. You MUST include these elements at the specified positions.

**Discriminating Test Scene (Act 3, Scene 4):**
Required elements: Execute the discriminating test, Observe the culprit's reaction or result, Draw conclusion about guilt

**Suspect Clearance Scenes:**
- Captain Ivor Hale (Act 3, Scene 5): Proving his absence from the tea service area.
  Clues: clue_id_1, clue_id_2
- Beatrice Quill (Act 3, Scene 5): Witness statements indicating she was occupied with guests.
  Clues: clue_id_1, clue_id_2
- Sylvia Trent (Act 3, Scene 5): Alibi verified by hotel staff.
  Clues: clue_id_1, clue_id_2

**Culprit Revelation Scene (Act 3, Scene 6):**
Method: Confrontation with evidence

**Clue Placement for These Chapters:**
- clue_core_contradiction_chain must appear in Act 1, Scene 2 via Cross-check contradiction

**VALIDATION CONSEQUENCE:** If these requirements are not met exactly, story validation will fail and the entire generation will be rejected. Follow these specifications precisely.


## ACTIVE CHAPTER MODE CONTRACT (MANDATORY)
Active chapter mode: Clue Reinterpretation.
Mode required outcomes:
- State original clue meaning and revised meaning.
- Show suspect implications and theory update.
Forbidden at this stage:
- Do not introduce decisive new evidence from nowhere.
Mode-specific narrative balance targets:
- Setting: 5-10%
- Character Reaction: 25-35%
- Clue Reinterpretation: 55-65%

## CHAPTER OUTCOME CONTRACT (MANDATORY)
Batch chapters: 2-2.
Investigation state at start: 2 clue(s) revealed to reader; approximately 0 unresolved suspect(s).
Must change by end: Reframe prior clue meaning and update suspect implications.
Suspect pressure target(s): Captain Ivor Hale, Beatrice Quill, Sylvia Trent
Required new information: Earlier clue gets revised meaning with explicit theory update.
Forbidden reveals at this stage: Do not introduce decisive new evidence from nowhere.

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
- Chapter 2:
  - STRUCTURAL ARCHETYPE — Chapter 2 must be: FIRST_CONTACT
      ✓ MUST contain: at least two suspect interviews
      ✗ MUST NOT contain: physical evidence discovery
  - Word count: Target 1250 words. Achieve this through plot events, dialogue exchanges, and physical investigation — not through atmospheric repetition or extended internal reflection. Each 200-word segment should contain at minimum one concrete story event (a discovery, a conversation exchange, a physical action or movement). Padding with atmosphere alone is not acceptable.
  - Opening: Begin with a character action, spoken line, or clock/time marker — never a location name or location-description phrase.
  - Scene is set in: the coastal hotel dining room — reference it naturally within the paragraph, never as your opening phrase.
  - Opening atmosphere (MANDATORY — validator enforced): the first paragraph MUST contain at least one of: rain / wind / fog / storm / mist / thunder / evening / morning / night / dawn / dusk / season / afternoon / midday / noon / midnight / twilight / sunrise / sunset / daylight / sunlight / overcast / cloudy / bright / dark / grey / pale / cold / warm / chill / crisp / damp / drizzle / haze / lamplight / firelight. A chapter that omits all of these from its opening paragraph will be rejected.
  - PARAGRAPH OPENER DIVERSITY (MANDATORY — validator enforced): No more than 2 paragraphs in this chapter may begin with "Hugo" or "Hugo's" as the first word. You must vary paragraph openings throughout: use sensory observations, another character's name or action, dialogue, object or sound details, or temporal markers. Opening 3 or more paragraphs with "Hugo" will cause automated rejection.
  - Continuity bridge: in the first 120 words, visibly connect from the previous chapter's final beat. Carry forward one unresolved element (object, accusation, emotional pressure, or immediate physical action) from: "Yet, as Hugo watched the others file out, their faces drawn and silent, he felt the first stirrings of doubt. The evidence was there, plain enough, but the truth remained elusive. The winter morning pressed in, cold and...".
  - CLUE OBLIGATIONS — each clue below MUST be dramatized, but in YOUR OWN WORDS:
    Render each as something a character SEES, DOES, or SAYS on the page. The bracketed text is a
    DESCRIPTION of the evidence for you — do NOT transcribe it as narration. Copying a clue's
    description sentence verbatim into the prose FAILS validation.
    • temperature, impacting, poison [clue_core_contradiction_chain] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: indicates, eleanor, symptoms, align, heart, attack
      ↳ MANDATORY TWO-PARAGRAPH STRUCTURE (must appear in paragraphs 1 or 2 — no later):
         Paragraph 1: The POV character physically approaches or directly observes this evidence.
           The narration or dialogue explicitly states what is seen (use the exact locked phrase if one applies).
         Paragraph 2 (immediately following): The detective or POV character explicitly reasons
           about what this evidence implies — who it implicates, why it may be unreliable,
           or what inference it supports. This must be a separate full paragraph, not a sentence appended to Paragraph 1.
    • witnesses, noting, temperature [clue_mid_1] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: suggests, poison, activated, heat
      ↳ MANDATORY TWO-PARAGRAPH STRUCTURE (must appear in paragraphs 1 or 2 — no later):
         Paragraph 1: The POV character physically approaches or directly observes this evidence.
           The narration or dialogue explicitly states what is seen (use the exact locked phrase if one applies).
         Paragraph 2 (immediately following): The detective or POV character explicitly reasons
           about what this evidence implies — who it implicates, why it may be unreliable,
           or what inference it supports. This must be a separate full paragraph, not a sentence appended to Paragraph 1.
  - Tonal contrast: include at least one beat of relief or ironic counterpoint. Do not sustain maximum tension for every paragraph.
  - CLUE DISCLOSURE RULE (Stage 3/4):
    Characters may draw inferences and name partial conclusions but must NOT state the full mechanism or name the culprit directly. The detective may suspect but not confirm.
    WRONG: dialogue or narration that directly explains how the crime was committed before Stage 4.
    RIGHT: observation, physical reaction, and logical inference that leaves the mechanism just off-screen.
  - ALIBI LOCK: Dr. Mallory Finch's established alibi is "8:00 PM - 10:00 PM". Do NOT place Dr. Mallory Finch at any other location or in any other activity during the crime window. Any contradiction is a continuity error that triggers a retry.
  - TESTIMONY CONTINUITY: Dr. Mallory Finch has already made statements in earlier chapters. Any time, location, or claim attributed to Dr. Mallory Finch in THIS chapter must be consistent with those earlier statements. Do NOT introduce a new or different alibi claim — any contradiction is a continuity error.
- Locked fact phrase obligations:
  - If this batch mentions The temperature of the tea at the time it was served., write exactly: "one hundred eighty degrees".
  - If this batch mentions The contents of the vial that released the poison., write exactly: "deadly poison".
  - If this batch mentions The time the victim was declared dead., write exactly: "half past ten at night".
- Seasonal vocabulary allow-list: winter, wintry, midwinter.
- Forbidden seasonal words: spring, summer, autumn.

⛔ PRONOUN TABLE — re-check after EVERY paragraph before writing the next:
    Eleanor Voss: she/her/her
    Dr. Mallory Finch: she/her/her
    Captain Ivor Hale: he/him/his
    Beatrice Quill: she/her/her
    Sylvia Trent: she/her/her
    Hugo Vane: he/him/his
  Any sentence containing a pronoun must agree with this table. Correct mismatches before moving on.

## CHAPTER OUTCOME CONTRACT (MANDATORY)
Batch chapters: 2-2.
Investigation state at start: 2 clue(s) revealed to reader; approximately 0 unresolved suspect(s).
Must change by end: Reframe prior clue meaning and update suspect implications.
Suspect pressure target(s): Captain Ivor Hale, Beatrice Quill, Sylvia Trent
Required new information: Earlier clue gets revised meaning with explicit theory update.
Forbidden reveals at this stage: Do not introduce decisive new evidence from nowhere.

FROZEN FACT STATE (DO NOT ALTER):
- Timeline anchor: January (winter).
- Month, season, weather, and time-of-year language in this batch must stay compatible with winter.
- Established timeline fact: Tea was served at 8:30 PM
- Established timeline fact: Eleanor was found at 9:15 PM
- If referenced, use exact phrase: "one hundred eighty degrees" (The temperature of the tea at the time it was served.).
- If referenced, use exact phrase: "deadly poison" (The contents of the vial that released the poison.).
- If referenced, use exact phrase: "half past ten at night" (The time the victim was declared dead.).

STORY TO DATE (REFERENCE ONLY — DO NOT COPY VERBATIM):
- Full prior chapter text is provided below for continuity, factual consistency, and reference accuracy.
- Use this to keep character voice, chronology, clue state, and location continuity aligned with earlier chapters.
- Do not quote, copy, or paraphrase these paragraphs too closely; write fresh prose that remains consistent with them.

--- BEGIN PRIOR CHAPTER 1 ---
Title: Chapter 1: The Unsettling Warmth
The clatter of a silver spoon against porcelain echoed through the coastal hotel dining room, its sound oddly sharp in the wintry morning hush. A faint mist pressed against the tall windows, blurring the view of the restless sea beyond. The air inside was heavy with the mingled scents of damp wool, spent perfume, and the lingering aroma of last night’s tea. Hugo Vane, still in his wool overcoat, paused just inside the threshold, his gaze drawn inexorably to the table at the centre of the room. There, Eleanor Voss sat slumped forward, her hand curled limply around the stem of a delicate teacup. The soft glow of the overhead chandelier caught on the pale skin of her cheek. For a moment, the only movement was the slow drift of steam rising from the cup—far too vigorous for a tea left untouched overnight.

A hush fell over the small knot of guests and staff who had gathered, their faces pale in the cold lamplight. Hugo stepped forward, the carpet muffling his approach, and noted the faint glisten of moisture on the rim of Eleanor’s cup. He reached out, careful not to disturb the scene, and felt the residual warmth radiating from the tea. It was not the tepid chill one would expect by morning, but a heat that suggested it had been poured not long before Eleanor collapsed—witnesses murmured that, even as she drank, the temperature had seemed excessive, almost scalding. Nearby, a small glass vial, uncorked and empty, lay half-concealed behind the silver tea service, its presence so out of place amid the formal setting that Hugo’s breath caught. The faint, acrid scent that clung to it was unmistakable: the sharp tang of something chemical, sinister, and utterly foreign to the usual comforts of a hotel breakfast.

Hugo straightened, his mind already racing ahead. The warmth of the tea, so at odds with the hour, was no idle curiosity. It was a detail that demanded explanation, a contradiction that pressed upon the edges of the room’s fragile calm. The vial, too—its emptiness, its deliberate placement—hinted at more than accident or carelessness. He did not need to voice his suspicion; the silence among the onlookers spoke for them all. The evidence before him suggested a death not of natural cause, but of intention—premeditation. Yet, even as Hugo catalogued these facts, he felt the weight of uncertainty settle on his shoulders. The role of investigator had fallen to him by necessity, not design, and he sensed the wary eyes of the others measuring his every move.

Beatrice Quill, her gloved hands trembling, hovered near the sideboard, her gaze fixed on Eleanor’s still form. She was the first to break the silence, her voice brittle. “She said she felt anxious before the tea was served. I told her to rest, but she insisted on staying.” The words hung in the air, a plausible explanation for sudden collapse, but Hugo caught the flicker of doubt in Beatrice’s eyes. It was too neat, too ready—a redirection that only deepened his suspicion. The others—Captain Ivor Hale, standing rigidly at the window, and Sylvia Trent, her lips pressed together in silent calculation—offered no such commentary, but their postures betrayed unease.

Dr. Mallory Finch arrived moments later, her dark coat buttoned to the throat against the winter chill. She moved with brisk efficiency, kneeling beside Eleanor to check for any sign of life, but her efforts were brief and formal. “She’s gone,” Dr. Mallory Finch said quietly, rising to her feet. “I’ll note the time as half past ten at night, for the record.” Her tone was professional, but Hugo detected a faint tremor in her hands as she withdrew. The doctor’s eyes did not linger on the tea or the vial, but Hugo noted the way her gaze darted, just once, to the tray before she turned away.

The dining room, so recently a place of laughter and music, now felt oppressive. The heavy velvet curtains failed to keep out the cold, and the tick of the mantel clock seemed suddenly intrusive. Hugo surveyed the faces gathered: Beatrice, still pale and restless; Captain Ivor Hale, his jaw set in a soldier’s discipline; Sylvia Trent, her expression unreadable. Each had reason to be present, each had access to the scene. The question of how—and why—Eleanor Voss had died now pressed upon them all.

A discreet cough from the doorway drew Hugo’s attention. A member of the hotel staff, eyes lowered, indicated the need for official statements. Hugo nodded, asserting himself with a steadiness he did not entirely feel. “I’ll take charge of the initial inquiries,” he announced, his voice carrying just enough authority to forestall protest. “Until the authorities arrive, we must preserve the scene and recount what we witnessed. Details matter—especially those that seem trivial.” The others acquiesced, some with relief, others with a wary reserve.

As the morning light struggled through the fog outside, Hugo began his quiet survey. He noted the arrangement of the tea service, the position of the chairs, the faint outline of a shoeprint in the plush carpet—details that might later resolve into meaning. He paused at the sideboard, examining the glass vial once more. Its presence, so incongruous, gnawed at him. The acrid scent, the proximity to Eleanor’s cup, the persistent warmth of the tea—these were not the hallmarks of chance. They were the fingerprints of intent, left by someone who had counted on confusion and the easy explanations of a heart weakened by anxiety.

Hugo Vane pressed on to the next concrete detail. The record now held: Witnesses recall served eleanor unusually warm; Vial likely contains poison used eleanor.

Those details shifted the reasoning. Weighed against the rest, Witnesses recall served eleanor unusually warm bent the trail toward Suggests poison activated heat. Weighed against the rest, Vial likely contains poison used eleanor bent the trail toward Poison deliberately placed.

Yet, as Hugo watched the others file out, their faces drawn and silent, he felt the first stirrings of doubt. The evidence was there, plain enough, but the truth remained elusive. The winter morning pressed in, cold and unyielding, as the dining room settled into uneasy quiet. Somewhere in the details—a cup too hot, a vial too near—lay the answer to Eleanor Voss’s death. Hugo Vane, for better or worse, would have to find it.
--- END PRIOR CHAPTER 1 ---

[SCENE COMPLETENESS CONTRACTS — MANDATORY. Each contract below lists what you MUST enact in that chapter. Do not summarise or mention these labels in the prose — enact them organically.]
Chapter 2 (Act 1) completeness contract:
  PIVOT ELEMENT (MANDATORY — write this into the prose, shown not told): "The conflicting accounts of the victim's last moments."
  FACT ESTABLISHED (MANDATORY — reader must know this by chapter end): "Establishes that there are discrepancies in the witnesses' accounts of the victim's behavior before death."

# Case Overview
Title: The Delayed Demise
Era: 1940s
Setting: Coastal Hotel
Crime: murder (delayed-action poison)
Culprit: Dr. Mallory Finch
Victim: Eleanor Voss
False assumption: Eleanor died from a heart attack due to her anxiety.
Cast: Eleanor Voss (she/her), Dr. Mallory Finch (she/her), Captain Ivor Hale (he/him), Beatrice Quill (she/her), Sylvia Trent (she/her), Hugo Vane (he/him)

Setting Lock: Keep all scenes and descriptions consistent with the stated setting (Coastal Hotel). Do not introduce a different location type. Do not invent an alternative estate name. The only permitted name for this property is "Coastal Hotel" — any other estate name (e.g., "Caldwell Manor", "Ashwood Hall", or any invented proper name) is a continuity error that will be caught and rejected.

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
    "sceneNumber": 2,
    "act": 1,
    "title": "Initial Reactions",
    "setting": {
      "location": "the coastal hotel dining room",
      "timeOfDay": "Shortly after the body is discovered",
      "atmosphere": "Chaotic and anxious, filled with whispers of shock"
    },
    "characters": [
      "Hugo Vane",
      "Captain Ivor Hale",
      "Beatrice Quill",
      "Sylvia Trent"
    ],
    "purpose": "Establish initial reactions and introduce suspects",
    "cluesRevealed": [
      "clue_core_contradiction_chain",
      "clue_mid_1"
    ],
    "dramaticElements": {
      "conflict": "Tensions rise as suspects react differently to the news.",
      "tension": "Each character's reaction raises suspicion.",
      "microMomentBeats": [
        "Captain Hale clenches his fists, trying to maintain composure."
      ]
    },
    "summary": "As chaos ensues in the dining room, each character reacts to the shocking discovery of the victim. Hugo Vane observes the differing reactions of Captain Hale, Beatrice Quill, and Sylvia Trent, noting their anxiousness and attempts to deflect suspicion. A contradiction arises when conflicting accounts of the victim’s last moments come to light.",
    "beat": "crime",
    "estimatedWordCount": 1800,
    "pivotElement": "The conflicting accounts of the victim's last moments.",
    "factEstablished": "Establishes that there are discrepancies in the witnesses' accounts of the victim's behavior before death.",
    "permittedBehavioursByAct": [
      {
        "characterName": "Captain Ivor Hale",
        "behaviour": "Show normal social behaviour; grief or confusion if appropriate."
      },
      {
        "characterName": "Beatrice Quill",
        "behaviour": "Show normal social behaviour; grief or confusion if appropriate."
      },
      {
        "characterName": "Sylvia Trent",
        "behaviour": "Show normal social behaviour; grief or confusion if appropriate."
      }
    ],
    "redHerringPlacement": null,
    "emotionalRegister": "The discovery of Eleanor's body injects a jarring sense of urgency into the investigation.",
    "dominantCharacterNote": {
      "name": "Captain Ivor Hale",
      "voiceRegister": "Ivor speaks in a gruff manner, using self-deprecating humor to soften the harshness of his reality."
    },
    "humourGuidance": {
      "permission": "forbidden"
    },
    "eraTextureNote": "Limited travel options due to ongoing rationing; Poor weather conditions affecting mobility; Limited access to information due to the evolving media landscape",
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
□ Allowed seasonal words only: winter, wintry, midwinter.
□ Forbidden seasonal words: spring, summer, autumn.
□ Chapter 2: the clue [clue_core_contradiction_chain] (suggests, poison, activated, heat) is placed in the first 25% of the chapter, dramatized in your own words, followed by an explicit inference or suspicion paragraph.
□ Chapter 2: the clue [clue_mid_1] (witnesses, recall, served, eleanor, unusually, warm) is placed in the first 25% of the chapter, dramatized in your own words, followed by an explicit inference or suspicion paragraph.
□ First chapter in this batch opens by continuing the previous chapter closing beat (same unresolved object, question, movement, or emotional pressure).
□ For every chapter after Chapter 1, include at least one NEW character pressure reveal (fear, motive, lie, loyalty conflict, or victim relationship).
□ Each post-Chapter-1 character reveal changes investigation state (more/less suspicious, lie explained, motive exposed, emotional cost deepened, or investigator understanding updated).
□ No post-Chapter-1 chapter contains static biography-only character paragraphs.
□ Mode check (Clue Reinterpretation): chapter states prior clue meaning and revised meaning with explicit theory change.
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

## Message 4 (role=assistant)

```text
{
  "status": "draft",
  "tone": "classic",
  "chapters": [
    {
      "title": "Chapter 2: Initial Reactions",
      "summary": "As the shock of Eleanor Voss's death settles over the coastal hotel dining room, Hugo Vane observes the suspects' immediate reactions and begins to probe their conflicting accounts. Early clues about the tea's temperature and witness testimony prompt Hugo to question the official story, exposing discrepancies in the timeline and deepening suspicion among the group.",
      "paragraphs": [
        "\"You saw her drink it, didn’t you?\" Beatrice Quill’s voice cut through the low murmur that had crept into the coastal hotel dining room, the cold morning air still pressing against the tall windows. The scent of stale perfume and damp wool lingered from the night before, mingling with the sharper tang of something chemical that still clung to the tea service. Hugo Vane, standing just beyond the edge of the table, watched the steam curl upward from Eleanor Voss’s cup. It was impossible to ignore—the warmth radiating from the delicate porcelain, the swirl of vapor that should have dissipated hours ago. He reached out, careful not to disturb the evidence, and felt the heat: not the tepid residue of a forgotten drink, but a near-scalding intensity. The temperature was unmistakable, and the memory of the witnesses’ earlier remarks echoed in his mind: the tea had been served at \"one hundred eighty degrees\"—far hotter than custom or comfort required.",
        "Hugo’s thoughts churned as he withdrew his hand, the contradiction gnawing at him. If the tea remained so hot, even now, then something about the timing was off. The witnesses had insisted that Eleanor’s cup was unusually warm when it was brought to her, hotter than anyone else’s. This detail, trivial on its face, now loomed large. If heat played a role—if the temperature was not only excessive but essential—then the cause of Eleanor’s collapse might not be as simple as a heart weakened by anxiety. The evidence pointed, inexorably, toward something more deliberate. Hugo’s mind leapt to the vial: its acrid odor, its proximity to the tea. Was it possible that whatever had killed Eleanor required heat to take effect? The old explanation—a sudden heart attack—no longer satisfied. The facts demanded a new theory, one that implicated not only the tea but the hand that had prepared it.",
        "A gust of wind rattled the panes, drawing Hugo’s attention back to the room. The guests had not dispersed far; instead, they clustered in small, uneasy knots, voices pitched low. Captain Ivor Hale stood by the window, his posture rigid, fists clenched at his sides as if bracing against an unseen blow. Beatrice hovered near the sideboard, her gloved hands twisting nervously, while Sylvia Trent occupied a velvet chair, her gaze fixed on the scene with a practiced air of detachment. The atmosphere was thick with the residue of shock and the first stirrings of suspicion.",
        "Hugo cleared his throat, drawing the others’ attention. \"We need to clarify what happened before Eleanor collapsed,\" he said, keeping his tone measured. \"Each of you saw something—perhaps more than you realize.\" He met Beatrice’s eyes first. She flinched, then straightened, her voice brittle. \"She seemed anxious, yes. But she was always that way before these events. I told her to rest, but she insisted on staying. She said the tea would calm her nerves.\" The words came too quickly, rehearsed. Hugo noted the evasiveness, the way Beatrice’s gaze darted to the empty vial, then away.",
        "\"Did you notice anything unusual about the tea itself?\" Hugo pressed, careful to keep his own suspicions masked. Beatrice hesitated, then shook her head. \"Only that it was piping hot. I nearly burned my tongue on my own cup, and Eleanor’s was even worse. She complained, but drank it anyway. I thought nothing of it at the time.\" Her attempt at nonchalance rang hollow. Hugo marked the detail: the excessive heat was not a quirk, but a pattern.",
        "Sylvia Trent spoke next, her voice as smooth as the velvet of her chair. \"Oh, darling, isn’t life just a delightful mess?\" she said, the corners of her mouth lifting in a brittle smile. \"If I recall, Eleanor was in rare form last night—nervous, yes, but also determined to play hostess. She insisted the tea be served fresh and hot. I remember remarking on it—‘You’ll scald your guests, Eleanor,’ I said. She only laughed. I suppose she wanted everything perfect, even if it meant a little discomfort.\" Sylvia’s words were polished, but Hugo caught the edge beneath them. There was more here—a rivalry, perhaps, or a resentment carefully cloaked in civility.",
        "Captain Ivor Hale, still by the window, finally turned to face the group. His jaw worked as he struggled for composure. \"She was restless, that’s true. But I didn’t see anything out of the ordinary. The tea was hot, yes, but it’s winter—what do you expect?\" His tone was gruff, defensive. Hugo watched the captain’s hands; the knuckles were white where he gripped the sill. \"If you’re looking for someone to blame, you won’t find it here. I barely spoke to her after the toast.\" The denial was too emphatic, the distance too carefully maintained.",
        "A silence settled, broken only by the ticking of the mantel clock and the muffled sound of rain against the glass. Hugo let the quiet stretch, watching for cracks in the façade. \"There’s a detail we can’t ignore,\" he said at last. \"The tea was not only hot, but hotter than usual—‘one hundred eighty degrees,’ as the staff tell it. That’s not an accident. And the vial—whatever was in it—was found right here, beside Eleanor’s cup.\" He did not accuse, but the implication hung in the air.",
        "Beatrice’s eyes widened, a flicker of fear passing across her face. \"Are you saying someone meant for this to happen?\" she whispered. Hugo did not answer directly. Instead, he turned to Sylvia. \"You said Eleanor insisted on the tea being served fresh. Did she specify who should bring it?\" Sylvia’s gaze sharpened. \"She asked the staff, as always. I saw Dr. Mallory Finch hovering near the service table, but I assumed she was just being attentive. Eleanor trusted her implicitly.\"",
        "The mention of Dr. Mallory Finch drew a ripple of unease through the room. Hugo noted the shift—an unspoken consensus that the doctor’s presence, so close to the tea, was more than incidental. Yet the timeline remained murky. Each account shaded the moments before Eleanor’s collapse with a different light: Beatrice’s anxious deflection, Sylvia’s polished barbs, Ivor’s rigid denial. The contradictions were not just in the details, but in the very tone of their recollections.",
        "Hugo pressed further, seeking clarity. \"When exactly did you last see Eleanor well? Was it before or after the tea was poured?\" Beatrice hesitated, glancing at Sylvia. \"I think it was after. She seemed fine until she took that first sip. Then she went pale, and…\" Her voice faltered. Sylvia interjected, \"No, I’m certain she was already unsteady before the tea arrived. She nearly dropped her napkin. I offered to help, but she waved me off.\" Ivor, for his part, shrugged. \"I wasn’t paying close attention. Too many people, too much noise. But I’d swear she was herself until the tea. After that—well, you saw.\"",
        "The conflicting accounts formed a tangle in Hugo’s mind. The sequence of events was no longer clear; the witnesses’ memories, colored by shock and perhaps self-interest, contradicted one another. This, he realized, was the true pivot: not the physical evidence alone, but the discrepancies in the story itself. Someone was lying, or at least omitting the truth. The reason for that omission—fear, guilt, or something else—remained to be uncovered.",
        "A faint chime from the radio in the lobby filtered through the closed doors, a reminder of the outside world pressing in. The air in the dining room felt colder now, the fog beyond the windows thickening as the morning wore on. Hugo made a note to himself: the old theory of a simple heart attack was unraveling. The heat of the tea, the presence of the vial, and the discordant testimonies all pointed to a new line of inquiry. Someone had counted on confusion, but the details would not be so easily dismissed.",
        "For a moment, the tension eased as a member of the staff entered quietly to collect unused cups. The mundane act, so at odds with the gravity of the situation, offered a brief respite. Yet as the door closed behind her, the sense of urgency returned. Hugo glanced once more at the faces around him. Each bore the marks of shock, but beneath that lay something else: calculation, fear, perhaps even relief. The investigation was no longer a matter of routine. It had become personal.",
        "As the morning deepened and the fog pressed closer, Hugo resolved to pursue the contradictions in the witnesses’ stories. The truth, he suspected, would not be found in the obvious details, but in the spaces between them—the silences, the hesitations, the careful omissions. The first clues had shifted the ground beneath their feet. Now it was a matter of following the fault lines to their source."
      ]
    }
  ],
  "cast": ["Hugo Vane", "Captain Ivor Hale", "Beatrice Quill", "Sylvia Trent"],
  "note": "",
  "audit": {
    "locked_fact_phrases": "present in paragraph 1, paragraph 7 | present in paragraph 1",
    "season_words_used": "winter, cold, fog, morning, rain",
    "discriminating_test_present": "no",
    "required_clues_present": "clue_core_contradiction_chain: paragraph 1-2; clue_mid_1: paragraph 1-2",
    "early_observation_present": "description: Hugo observes the tea's heat and witnesses recall serving temperature (paragraph 1) | yes",
    "early_inference_present": "yes: paragraph 2"
  }
}
  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 		  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 
```

## Message 5 (role=user)

```text
SINGLE-PASS RETRY CONTRACT
Goal: resolve every listed issue for chapter(s) 2 in this one retry.
Retry mode: SURGICAL_PATCH.
Attempt context: 2/3 | primary class: unknown.
Why this mode: single-family fix can preserve stable draft sections.

SOURCE OF TRUTH
- Use the existing draft as reference only for paragraphs that already satisfy the rules.
- Hard constraints outrank the previous draft: cast/pronoun lock, locked facts, clue obligations, stage-mode rules, and chapter JSON shape.

PRIMARY FAILURES
- VICTIM ALIVE: "Hugo Vane, standing just beyond the edge of the table, watched the steam curl upward from Eleanor Voss’s cup."

REWRITE PLAN
- Preserve paragraphs that are already valid, but fully rewrite every paragraph touched by a failing issue.
- Keep cast-canonical names, roles, and pronouns stable in every paragraph. If a sentence drifts, rewrite the whole sentence cleanly.

SUCCESS CHECKLIST
- Every listed issue below is resolved in this single attempt before you answer.
- Character names, roles, and pronouns are consistent in every sentence.
- Primary failure class cleared: unknown.

OUTPUT RULES
- Return complete corrected JSON for chapter(s) 2 only.
- Do not explain what you changed.
- Do not leave one issue unresolved while fixing another.
- If two instructions conflict, prefer the one that clears the validator and preserves story logic.

Attempt 2/3 — chapters 2 — 1 validation issue(s) to resolve:

═══ ⛔ VICTIM ALIVE ERRORS (1) ═══
The murder victim appeared as a living character. This character is DEAD — they cannot enter rooms, speak, gesture, or react.

Offending sentences detected:
• VICTIM ALIVE: "Hugo Vane, standing just beyond the edge of the table, watched the steam curl upward from Eleanor Voss’s cup."

✓ REMOVE every sentence where the victim acts, speaks, or is physically present.
✓ CORRECT: "[name] had often said..." / "[name]'s effects were found" / "witnesses recalled..."
✗ WRONG: "[name] crossed the room" / "[name] nodded" / "[name] replied"

Return corrected JSON for chapters 2. Edit only the sections that failed — keep all content that passed validation, and return the complete updated chapter JSON.


RETRY CLASS: unknown
ATTEMPT: 1/3
OFFENDING TEXT: Hugo Vane, standing just beyond the edge of the table, watched the steam curl upward from Eleanor Voss’s cup.
MANDATORY FIXES:
- Resolve unknown issues before accepting this batch.
- VICTIM ALIVE: "Hugo Vane, standing just beyond the edge of the table, watched the steam curl upward from Eleanor Voss’s cup."
```
