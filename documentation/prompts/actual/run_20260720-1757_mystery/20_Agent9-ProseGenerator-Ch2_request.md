# Actual Prompt Record

- Run ID: `mystery-1784570276364`
- Project ID: ``
- Timestamp: `2026-07-20T18:05:51.205Z`
- Agent: `Agent9-ProseGenerator-Ch2`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4.1`
- Temperature: `0.42`
- Max Tokens: `4500`
- Attempt: `first`
- Prompt Hash: `1fbd9941bce1a7c7`

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
- MORAL COMPLEXITY REQUIREMENT: The mechanism of this crime carries a moral gray area: "The murderer acted out of desperation, believing the victim was responsible for a family tragedy." — the culprit reveal and denouement MUST acknowledge this ambiguity. Do not let the ending feel clean or simple. Give the reader at least one moment of uncomfortable sympathy or moral doubt.

- CHAPTER OPENING (every chapter, lint-enforced): never open on a tour or inventory of named rooms/places. The first sentence must land a character ACTION, a specific sensory detail, or a concrete in-scene moment — not "In the [room], the [room], and the [room]…". Locations enter through what a character does in them, one at a time.
- VICTIM IDENTITY & OPENING HOOK (ROADMAP_TO_80 M2): The murder victim is Dr. Mallory Finch. Name them — Dr. Mallory Finch — in the FIRST PARAGRAPH; never open with "the victim" or "the body". Open IN MEDIAS RES: the first one or two sentences must land the discovery and the single unsettling CONTRADICTION (the impossible detail that starts the case), seen through the investigator's eyes. Weave sensory and atmosphere detail AROUND that hook — do NOT precede the stakes with a standalone scene-setting/weather preamble. They are found dead — they do not speak, react, or gesture. This is their only physical appearance in the story.

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
   - Captain Ivor Hale: Authority Figure
   - Beatrice Quill: Creative Visionary
   - Sylvia Trent: Caretaker
   - Hugo Vane: Business Tycoon
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

## Era: 1948-11
In November 1948, the atmosphere in Brighton is tinged with a sense of uncertainty and tension. The remnants of World War II still impact daily life, as citizens navigate the complexities of a changing society. The seaside town, often a sanctuary, now feels like a pressure cooker of secrets, with the looming specter of the Cold War adding to the unease. The residents face not only the physical challenges of post-war rationing but also the emotional toll of lost loved ones and the shifting roles of men and women in the workforce. The anticipation of Thanksgiving adds a layer of yearning for familial connection amidst the backdrop of societal change. As the days grow shorter and the chill of the season settles in, the hotel guests experience a collective anxiety that permeates every whispered conversation and nervous glance.
Emotional register: A collective sense of tension and uncertainty pervades the community, as individuals grapple with their shifting identities.
Physical constraints: Short daylight hours leading to a sense of confinement | Rationing affecting food supplies and services | Limited communication methods due to post-war recovery
Current tensions (weave into background texture): Intensifying Cold War tensions | Continued inflation affecting daily goods | Social expectations on women returning to traditional roles
Wartime context — Many veterans are grappling with post-war trauma.: Women have entered the workforce in greater numbers, challenging traditional norms. Absence effect: The absence of those lost in the war creates a haunting void in many lives.

## Story Theme
In a post-war world, the quest for truth exposes the hidden vulnerabilities of each character, revealing that the consequences of ambition can be deadly, and reveals that evidence carries ethical weight, forcing characters to choose accountability over social performance when appearances and facts collide.

## Story Emotional Register
Dominant: Tense and suspenseful, marked by an exploration of hidden fears and desires.

Arc:
As the story opens, the atmosphere in the Grand Seaside Hotel is thick with tension, reflecting the weight of Dr. Mallory Finch's unexpected death. The guests, caught in the throes of post-war life, carry their own secrets, and the initial shock of the murder casts a pall over the hotel. As Eleanor Voss begins her investigation, unease rises with each conversation, revealing the tangled web of relationships and hidden motives. The discovery of the damp key serves as a pivotal moment, redirecting Eleanor’s focus on the method of poisoning and deepening her resolve to uncover the truth. Midway through the investigation, a revelation about Captain Hale's past with Dr. Finch shifts the narrative, igniting suspicions that were previously overlooked. As the pressure mounts, the tension peaks during the reenactment of the poisoning mechanism, forcing characters to confront their own fears and vulnerabilities. In the climax, the confrontation with the true culprit reveals the emotional costs of ambition and the personal stakes involved. Ultimately, the resolution leaves each character changed; Eleanor finds purpose, while others grapple with their own failures and regrets, underscoring the emotional toll of revealing the truth.

The story opens: The atmosphere is heavy with suspense as guests react to the shocking murder. As the investigation takes shape: Unease grows as Eleanor begins to uncover hidden motives among the guests. A first key turn arrives: The discovery of the damp key shifts Eleanor's investigative focus. At the mid-point of the story: New revelations about Captain Hale's past add complexity to the investigation.

A second pivot reshapes the course: The reenactment of the poisoning method forces confrontations and deepens tensions. As tension reaches its height: Pressure mounts as secrets are unveiled, leading to a critical confrontation. The climax brings the central question to a head: The emotional toll of.

## Emotional register at this point in the story
The atmosphere is heavy with suspense as guests react to the shocking murder.

## Character Portraits (appearance & era)

### Eleanor Voss
Eleanor Voss embodies the spirit of a generation seeking normalcy after the chaos of war. As a hotel manager, her role places her at the intersection of the changing societal landscape, where women are stepping into positions of authority. Yet, her struggles with unfulfilled dreams reflect the broader anxieties of many who find themselves navigating a world that demands resilience amid adversity. The pressure to succeed weighs heavily on her, and she represents the hopes and disappointments of women striving for recognition in a male-dominated society.
Era intersection: Her journey of self-discovery resonates with others facing the aftermath of war and societal change.

### Captain Ivor Hale
Captain Ivor Hale embodies the struggles of veterans returning to civilian life. His bravado masks deep insecurities and PTSD, reflecting the mental health challenges faced by many soldiers. The changing roles of women and the evolving social landscape contribute to his feelings of inadequacy and resentment. Ivor's journey reveals the emotional toll of war and the difficulty of adapting to a world that has moved on without him.
Era intersection: His character encapsulates the silent battles fought by many veterans seeking to reclaim their place in society.

### Beatrice Quill
Beatrice Quill navigates the treacherous waters of the fashion industry, reflecting the pressures faced by women in creative fields during the 1940s. Her struggles with financial insecurity and the fear of failure echo the experiences of many women striving for success. As she confronts the victim's criticism, Beatrice's character highlights the societal expectations placed on women to excel in a competitive environment, revealing the emotional cost of ambition.
Era intersection: Her story intertwines with the broader narrative of women fighting for recognition and success in a challenging era.

### Hugo Vane
Hugo Vane personifies the ruthless ambition of men navigating the post-war economy. His fear of financial ruin mirrors the anxieties faced by many in the business world, as they grapple with the consequences of their choices. The pressure to maintain power and influence in a changing landscape forces Hugo to confront the emptiness of his success, highlighting the emotional toll of ambition on personal relationships.
Era intersection: His character reflects the societal pressures on men to succeed and the moral complexities of ambition.

## Character Voices

### Eleanor Voss (she/her/her)
Eleanor speaks with an engaging rhythm, her anecdotes punctuated by ironic quips that reveal her keen perception.
[comfortable] Well, it's not exactly a tropical paradise, is it? Just another day at the seaside.
[evasive] I wouldn't say I know everything about the guests, but you pick up a few things here and there.
[stressed] There's so much at stake here; the hotel can't afford another scandal.
Humour: Her dry wit often serves as a defense mechanism against her insecurities.

### Captain Ivor Hale (he/him/his)
Captain Hale speaks with a commanding presence, his remarks often laced with dry, self-deprecating humor.
[comfortable] I suppose that's just the way the tide turns; one moment you're the captain, and the next, you're just another guest.
[evasive] I don't recall the details of that night; I was busy keeping my cards close to my chest.
[stressed] I can't afford to be seen as weak; I've fought too hard for my reputation.
Humour: His self-deprecating humor serves to mask deeper insecurities.

### Beatrice Quill (she/her/her)
Beatrice speaks with flair, often using vivid imagery to describe her designs, her humor sardonic.
[comfortable] It's all just a matter of style, darling; elegance is key to survival.
[evasive] I wouldn't say I have a clear answer; fashion is subjective, after all.
[stressed] If this doesn't work out, my dreams will unravel faster than a poorly stitched seam.
Humour: Her sardonic wit reflects her awareness of the industry's fickleness.

### Hugo Vane (he/him/his)
Hugo speaks with calculated eloquence, his dialogue polished yet occasionally revealing a savage edge.
[comfortable] Ah, the cost of ambition, wouldn't you agree? It’s a double-edged sword.
[evasive] I wouldn't worry about my investments; things have a way of working out.
[stressed] If this scandal breaks, it could destroy everything I've built; I must remain composed.
Humour: His polite savagery often hints at the desperation lurking beneath his surface.

## Location Registers (scene framing guides)

The Ocean View Lounge: The lounge feels like a character in its own right, a once-inviting space now steeped in tension and foreboding. The remnants of the evening's chaos linger, infusing the air with a sense of unease. Each shadow seems to whisper secrets, and the oppressive atmosphere heightens the awareness of lurking dangers.. Camera angle: As the writer enters, the camera angle captures the contrast between the lounge's elegant decor and the underlying tension, inviting them to uncover the hidden truths.. Era: The overcast skies outside mirror the emotional weight within, creating a claustrophobic sense of entrapment.

## Humour guidance for this story position (opening)
Permission: forbidden
Rationale: The gravity of the murder doesn't allow for humor.

FAIR-PLAY AND INFERENCE CONTRACT:
- FAIR PLAY CLUE TIMING: Never combine clue discovery and detective deduction in the same chapter. If a clue is first revealed to the reader in chapter N, the detective may only analyze, deduce from, or act on that clue in chapter N+1 or later.
- FAIR PLAY INFORMATION PARITY: The reader must see all clues BEFORE the detective uses them in reasoning. If the detective performs a test or makes a deduction, every piece of evidence supporting that conclusion must have been shown to the reader in earlier chapters.
- FAIR PLAY REVELATION SPACING: In the discriminating test scene, the detective can ONLY use clues that were revealed to the reader at least 1 full chapter earlier. Never introduce new clues or withheld information during the test.
- FAIR PLAY CONFRONTATION: During the final confrontation/revelation, the detective cannot surprise the reader with facts. Every piece of evidence cited must have been visible to the reader in prior chapters.
- Never solve by withheld information. Keep reader-information parity with detective reasoning.
- False assumption in force: Dr. Mallory Finch's death was due to a sudden health crisis.
- Hidden truth to progressively expose (compose in your own words from these elements): true, nature, poisoning, mechanism, motive, behind
- Inference path checkpoints to dramatize clearly — compose ENTIRELY in your own sentences from these key terms (reproducing any briefing phrase verbatim FAILS validation):
  - Step 1: obs: finch, room, floor, near, slightly, damp | corr: must, involved, poisoning, based, condition | effect: narrows, potential, method, poisoning
  - Step 2: obs: residue, consistent, botanical, poison | corr: residue, indicates, used, deliver, poison, finch | effect: eliminates, possibility, natural, causes, finch, death
  - Step 3: obs: witnesses, confirm, captain, hale, seen, near, finch, room, shortly, before, death | corr: suspicious, actually, delivering, message, poisoned | effect: eliminates, captain, hale, culpability
- Discriminating test method: trap
- Discriminating test elements to dramatize (compose ENTIRELY in your own sentences from these — do NOT reproduce any briefing phrase verbatim): reenactment, staged, used, conditions, humidity, releases, poison
- Test must rely on already-shown clue IDs: clue_6, clue_core_contradiction_chain, clue_1, clue_damp_key
- Fair-play rationale: Step 1: The damp key (early) and its residue (mid) reveal the poisoning mechanism. Step 2: Witness consistency (mid) eliminates Captain Hale. Step 3: The reenactment (discriminating test) confirms the poisoned key implicates the true culprit.

## Character Reference

### Eleanor Voss (she/her — NEVER he/him)
Eleanor speaks with an engaging rhythm, often weaving in anecdotes from her travels
She has a tendency to punctuate her observations with ironic quips that reveal her keen perception of human nature.
Haunted by the ghosts of her unfulfilled ambitions, Eleanor grapples with the fear that her life may never hold the excitement she craves.
Voice colour: Eleanor Voss uses dry wit humour — let it surface in their dialogue where natural, not in every line.

### Captain Ivor Hale (he/him — NEVER she/her)
Captain Hale speaks with a commanding presence, often punctuating his statements with dry, self-deprecating humor
His speech carries a weight of authority, yet he occasionally slips into vulnerable admissions that reveal his inner turmoil.
Struggles with feelings of inadequacy and the fear that he no longer holds relevance in a rapidly changing world.

### Beatrice Quill (she/her — NEVER he/him)
Beatrice speaks with an artistic flair, often using vivid imagery and metaphors to describe her designs
Her humor is laced with a sardonic edge, reflecting her awareness of the industry's fickleness.
Battles with the fear that her worth is tied to her success in a cutthroat industry, leading to emotional withdrawal from those around her.
Voice colour: Beatrice Quill uses sardonic humour — let it surface in their dialogue where natural, not in every line.

### Hugo Vane (he/him — NEVER she/her)
Hugo speaks with a calculated eloquence, often laced with an undercurrent of sarcasm
His dialogue is polished, reflecting his status, but he occasionally lets slip a more savage edge when pressed.
Wrestles with the fear that his relentless pursuit of wealth has led him to a precipice of ruin, forcing him to confront the emptiness of his success.
Voice colour: Hugo Vane uses polite savagery humour — let it surface in their dialogue where natural, not in every line.


## CHARACTER CONTRACTS (binding for this scene)
Each entry below constrains how this character must be written in this chapter.
These override generic style guidance when they conflict.

### Eleanor Voss[SHE]
Voice & mannerisms: Eleanor speaks with an engaging rhythm, often weaving in anecdotes from her travels. She has a tendency to punctuate her observations with ironic quips that reveal her keen perception of human nature.
SIGNATURE TIC (use sparingly — this is Eleanor Voss's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "Well, it's not exactly a tropical paradise, is it?"
Sample voice fragments (match this register and rhythm):
  [comfortable] "Well, it's not exactly a tropical paradise, is it? Just another day at the seaside."
  [evasive] "I wouldn't say I know everything about the guests, but you pick up a few things here and there."
Humour: dry wit — deploy occasionally (level 0.6)
FORBIDDEN phrase (never write for Eleanor Voss): "a surge of determination washed over her"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Invited to cover a luxury conference at the hotel, she feels drawn to uncover the truth behind the events." — do not surface in Act I.

### Captain Ivor Hale[HE]
Voice & mannerisms: Captain Hale speaks with a commanding presence, often punctuating his statements with dry, self-deprecating humor. His speech carries a weight of authority, yet he occasionally slips into vulnerable admissions that reveal his inner turmoil.
SIGNATURE TIC (use sparingly — this is Captain Ivor Hale's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "I suppose that's just the way the tide turns."
Sample voice fragments (match this register and rhythm):
  [comfortable] "I suppose that's just the way the tide turns; one moment you're the captain, and the next, you're just another guest."
  [evasive] "I don't recall the details of that night; I was busy keeping my cards close to my chest."
Humour: self deprecating — deploy rarely (level 0.3)
FORBIDDEN phrase (never write for Captain Ivor Hale): "she knew with certainty she was right"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Holds a personal grudge against the victim for disrespecting his authority at a social gathering." — do not surface in Act I.

### Beatrice Quill[SHE]
Voice & mannerisms: Beatrice speaks with an artistic flair, often using vivid imagery and metaphors to describe her designs. Her humor is laced with a sardonic edge, reflecting her awareness of the industry's fickleness.
SIGNATURE TIC (use sparingly — this is Beatrice Quill's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "It's all just a matter of style, darling."
Sample voice fragments (match this register and rhythm):
  [comfortable] "It's all just a matter of style, darling; elegance is key to survival."
  [evasive] "I wouldn't say I have a clear answer; fashion is subjective, after all."
Humour: sardonic — deploy occasionally (level 0.5)
FORBIDDEN phrase (never write for Beatrice Quill): "palpable tension filled the room"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "The victim had criticized her designs publicly, risking her future in the industry." — do not surface in Act I.

### Hugo Vane[HE]
Voice & mannerisms: Hugo speaks with a calculated eloquence, often laced with an undercurrent of sarcasm. His dialogue is polished, reflecting his status, but he occasionally lets slip a more savage edge when pressed.
SIGNATURE TIC (use sparingly — this is Hugo Vane's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "Ah, the cost of ambition, wouldn't you agree?"
Sample voice fragments (match this register and rhythm):
  [comfortable] "Ah, the cost of ambition, wouldn't you agree? It’s a double-edged sword."
  [evasive] "I wouldn't worry about my investments; things have a way of working out."
Humour: polite savagery — deploy occasionally (level 0.4)
FORBIDDEN phrase (never write for Hugo Vane): "she felt a wave of unease"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "The victim threatened to expose his financial misdeeds, which would ruin him." — do not surface in Act I.



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

Primary Location: The Grand Seaside Hotel (Brighton, England)
A grand seaside hotel with Art Deco elegance, overlooking the turbulent sea.

Key Locations Available:
- The Ocean View Lounge (interior): Crime scene
- The Kitchen (interior): Staff-only area
- The Drawing Room (interior): Gathering space for guests
- The Seaside Balcony (exterior): Observation point and escape route

Atmosphere (tonal cue only — do NOT reproduce this phrase verbatim in prose; translate into scene-specific, character-observed sensory language): Tense and secretive, with whispers of recent events unsettling the guests
Weather: Overcast with a chance of rain, typical for coastal towns

Era markers: Art Deco architecture and design | Radio broadcasts filling the air | Wartime rationing impacting guest services

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
The Ocean View Lounge (interior):
  - Visual: cracked glass from the storm, dark wine stains on the carpet, flickering candlelight
  - Sounds: howling wind outside, muffled voices from the lobby, clinking glasses
  - Scents: damp sea air, spilled wine and mildew, smoky fireplace ash
  - Touch: soft velvet upholstery, cold glass surface

The Kitchen (interior):
  - Visual: gleaming metal pots and pans, flour dust settling on surfaces, hanging herbs drying
  - Sounds: clattering of dishes, hissing of gas flames, water running in the sink
  - Scents: scent of fresh bread baking, fried onions and garlic, sharp tang of vinegar
  - Touch: cold metal of countertops, rough texture of burlap sacks

The Drawing Room (interior):
  - Visual: opulent drapes framing the windows, gleaming brass fittings, ornate fireplace mantle
  - Sounds: murmurs of conversation, crackling fire, distant sounds of the ocean
  - Scents: scent of polished wood, faint floral arrangements, smoky firewood
  - Touch: soft velvet cushions, smooth wooden table surface

⛔ REFERENCE DATA — DO NOT TRANSCRIBE VERBATIM: The above profiles are structural guides only. Generate original prose that evokes these qualities; do not reproduce the exact phrasing or sentence structure of the profile paragraphs.

SCENE OPENING RULE: When opening a scene in a new location, write what the POV character directly observes and physically senses at that moment — not a general description of the room's qualities. The reader must feel present, not briefed. Sensory details must be observed by the character, not stated as fact about the place.

SENSORY WRITING TECHNIQUES:
- Opening paragraphs: Lead with 2-3 sensory details
[truncated for prompt budget]

## Texture Pool
Draw on these as opportunities arise — you are not required to use them.

- In November 1948, the atmosphere in Brighton is tinged with a sense of uncertainty and tension
- The remnants of World War II still impact daily life, as citizens navigate the complexities of a changing society
- The seaside town, often a sanctuary, now feels like a pressure cooker of secrets, with the looming specter of the Cold War adding to the unease
- The residents face not only the physical challenges of post-war rationing but also the emotional toll of lost loved ones and the shifting roles of men and women in the workforce
- The anticipation of Thanksgiving adds a layer of yearning for familial connection amidst the backdrop of societal change

TEMPORAL CONTEXT:

This story takes place in November 1948 during N/A.

Seasonal Atmosphere:
- Weather patterns: overcast skies, chilly winds, occasional drizzle
- Daylight: Days are short, with the sun setting around 4:30 PM, leaving long shadows and a sense of early evening gloom.
- Seasonal activities: preparing for Thanksgiving meals, visiting local markets for seasonal produce, gathering for bonfire night celebrations
- Seasonal occasions: Thanksgiving (approaching on the fourth Thursday)
- Season: N/A

Period Fashion (describe naturally):
- Men formal: double-breasted suits in dark wool, tweed overcoats, fedora hats
- Men casual: corduroy trousers, knit sweaters, flannel shirts
- Men accessories: silk ties, leather gloves, pocket watches
- Women formal: tea-length dresses with fitted waists, velvet evening gowns, tailored jackets
- Women casual: sweater sets, A-line skirts, corduroy slacks
- Women accessories: perched hats, string of pearls, gloves

Cultural Context (reference naturally):
- Music/entertainment: Bing Crosby - 'White Christmas', Doris Day - 'Que Sera, Sera', Nat King Cole - 'Nature Boy'; Films: 'The Treasure of the Sierra Madre', 'The Best Years of Our Lives'; Theatre: 'South Pacific', 'A Streetcar Named Desire'; Radio: 'The Jack Benny Program', 'The Shadow'
- Typical prices: Loaf of bread: four pence, Dozen eggs: one shilling, Taxi fare across town: two shillings
- Current events: intensifying Cold War tensions; inauguration of President Truman's Fair Deal policies
- Literature: 'The Naked and the Dead' by Norman Mailer | 'The Old Man and the Sea' by Ernest Hemingway | 'The Catcher in the Rye' by J.D. Salinger | [post-war realism] | [mystery and detective fiction] | [social commentary]
- Technology: transistor radio | first commercial jet airliner | automated telephone exchanges | black-and-white television sets | reel-to-reel tape recorders | early calculators
- Daily life: attending local dances, hosting dinner parties, participating in community charity events
- Social rituals: Sunday family dinners, gathering for neighborhood bonfires, sharing wartime stories over drinks

Atmospheric Details:
The smell of damp earth and fallen leaves lingers in the air, mixing with the faint scent of smoke from nearby fireplaces. The sound of rain tapping against windowpanes creates an almost haunting backdrop, punctuated by snippets of hushed conversations from the hotel lounge. Dim lighting casts flickering shadows across the walls, creating an intimate yet tense atmosphere as guests exchange nervous glances.

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
- Authentic references: Use actual
[truncated for prompt budget]

NON-NEGOTIABLE CHAPTER OBLIGATIONS — LOCKED EVIDENCE VALUES (VERBATIM REQUIRED):
The following measured values (times, amounts, measurements) are absolute ground truth. Every time this chapter describes, mentions, or alludes to one — no matter how briefly — it MUST use the exact phrase shown below, character for character. NO paraphrase, approximation, rounding, or synonym is permitted.

FAILURE EXAMPLE: if the locked value is "at thirteen minutes to midnight" and you write "just before midnight" or "around midnight" — that is a HARD FAIL. You must write "at thirteen minutes to midnight". Equally, if the locked value is written in words, such as "ten minutes past eleven", and you convert it to figure-based clock notation — that is also a HARD FAIL. Words stay as words; figure forms are forbidden for word-phrased facts.

CRITICAL — WORD-PHRASED VALUES: If the canonical value is written out in words (e.g. a time like "ten minutes past eleven", or an amount like "forty minutes"), reproduce those exact words. DO NOT convert to figure-based time notation, twenty-four-hour format, or any other numeric shorthand. Correct: "ten minutes past eleven". WRONG: figure-based clock notation or numeric shorthand.

Locked values:
  - The temperature in the victim's room at the time of poisoning.: "eighty degrees Fahrenheit"
  - The time when the victim last used the key before being poisoned.: "ten minutes past eleven"
    ⛔ FORBIDDEN alternatives: "11:10", "11.10", "eleven ten", "eleven-ten", "eleven past ten", "quarter past eleven", "half past eleven" — the ONLY acceptable form is "ten minutes past eleven"

If a value has no relevance to this chapter, omit it. But the moment you reference the underlying evidence, only the exact phrase above is acceptable.

⛔ CLUES TO SURFACE IN THESE CHAPTERS — mandatory:
The following evidence MUST be clearly observable to an attentive reader. Do not bury it in atmosphere or passing dialogue. Each clue must be concrete, specific, and noticeable:

• [clue_mechanism_visibility_core] witnesses, confirm, finch, seen, healthy, shortly, before, dinner
  Category: testimonial | Criticality: essential | Supports inference step 1
  Points to: suddenness, finch, death, suspicious

• [clue_core_contradiction_chain] finch, room, floor, near, slightly, damp
  Category: testimonial | Criticality: essential | Supports inference step 1
  Points to: recent, connected, poisoning

For each clue above: an attentive reader should be able to find, record, and later use it to reason toward the solution.

═══ NARRATIVE STATE (read-only — do not contradict) ═══

LOCKED FACTS — use verbatim whenever this evidence is described:
  • The temperature in the victim's room at the time of poisoning.: "eighty degrees Fahrenheit"
  • The time when the victim last used the key before being poisoned.: "ten minutes past eleven"

CHARACTER PRONOUNS — never deviate from these:
  • Eleanor Voss: she/her/her
  • Dr. Mallory Finch: she/her/her
  • Captain Ivor Hale: he/him/his
  • Beatrice Quill: she/her/her
  • Sylvia Trent: she/her/her
  • Hugo Vane: he/him/his

CLUES ALREADY REVEALED TO READER: clue_residue — do not reveal these as new information.

INVESTIGATION LOG — WHAT IS ESTABLISHED (do not re-establish, do not repeat):
• Evidence already established (reference only — do NOT restate or quote these; advance beyond them): suddenness, finch, death, suspicious
• Suspects still unresolved: Beatrice Quill[SHE], Sylvia Trent[SHE], Hugo Vane[HE]
⚠ The story must move FORWARD from this log. Any beat already listed above is forbidden from repeating.

⚠ THIS CHAPTER'S REQUIRED ADVANCE (opening): Discover the body, confirm the victim, establish the scene. The victim is found dead. They do not speak, react, or gesture. This is their only physical appearance — in all subsequent chapters they exist only in past tense (memory, evidence, testimony).

CONTINUITY HANDOFF — previous chapter closing beat:
  • "A final glance at the body confirmed what she already knew: Dr. Finch had not died by chance. The scene was too carefully composed, the clues too pointed. Eleanor felt the first stirrings of resolve. She would find the story behind the silence, whatever it cos..."
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
kitchen, corridor

✓ RULE: Continue using this location vocabulary. Maintain consistency with established setting type.
✓ Do NOT introduce new location types that contradict earlier chapters.

**Recent Chapter Summary (for narrative continuity):**
Chapter 1: Chapter 1: The Damp Key
  Events: Eleanor Voss pressed her gloved palm against the lacquered door of Dr.

⚠️ **VALIDATION:** Character name mismatches and setting drift are common failure modes.
Double-check every character name against the list above before using it.

**⏱ LOCKED TIME ANCHOR — use verbatim, do not paraphrase:**
Clock time (from the case ground truth): **"Dr. Finch's last known movements before dinner"**
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
Known location profile anchors: The Grand Seaside Hotel, The Ocean View Lounge, The Kitchen, The Drawing Room, The Seaside Balcony, Dr. Finch's hotel room
LOCATION NAME CAPITALISATION (HARD REQUIREMENT — validated):
All named locations in your prose MUST use the EXACT capitalisation from the CML profiles.
Canonical forms: "The Grand Seaside Hotel", "The Ocean View Lounge", "The Kitchen", "The Drawing Room", "The Seaside Balcony", "Dr. Finch's hotel room"
Writing a location in lowercase (e.g. "drawing room" instead of "Drawing Room") is a validated error. Every time you mention a named location, copy its capitalisation from the list above.
- Chapter 2: OPENING STYLE (HARD): Start the VERY FIRST SENTENCE with spoken dialogue — e.g. '"[words]," [Name] said/asked/replied/murmured.' The opening quote must be the first character on the line. Anchor opening in "Dr. Finch's hotel room". The opening style above governs only your FIRST SENTENCE; the grounding below may land anywhere in the first 2 paragraphs (it need not be sentence one, and never conflicts with the chosen opening style). HARD REQUIREMENT for the first 2 paragraphs: (a) include 2+ sensory words — choose from smell/scent/odor/fragrance/sound/echo/silence/whisper/creak/cold/warm/damp/rough/smooth/glow/shadow/flicker/dim — and (b) include 1+ atmosphere/time word — choose from rain/wind/fog/storm/mist/thunder/evening/morning/night/dawn/dusk/lighting/weather/season/afternoon/midday/noon/midnight/twilight/sunrise/sunset/daylight/sunlight/overcast/cloudy/bright/dark/grey/pale/chill/crisp/drizzle/haze/lamplight/firelight. These are validated requirements, not style suggestions; missing them triggers a retry.

[⚠ INTERNAL QUALITY DIAGNOSTICS — DO NOT REPRODUCE ANY PART OF THIS SECTION IN YOUR STORY OUTPUT. These are private generator observations for your consideration only. Your narrative must read as if this section does not exist. Never include phrases from this block in character dialogue, narration, or description.]

PRIOR CHAPTER QUALITY OBSERVATIONS:
- Chapter 1 (score 96/100):
  Quality gaps noted: scene grounding weakness
  Address in upcoming chapters: Open next chapter with a named location anchor plus at least two sensory cues and one atmosphere marker.
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

PROMPT BUDGET SUMMARY: budget=24000 tokens; fixed=9785; context=11762; dropped=[none]; truncated=[location_profiles, temporal_context, pronoun_accuracy]

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
4. Integrate at least two concrete era-grounded details per chapter from setting refinement signals: radio broadcasting | early television sets | basic radar systems | party-line telephones | long-distance calls | military encryption methods.
5. Respect setting movement/access constraints in scene action and alibis: narrow hallways limiting movement | staircase access to restricted areas | balconies overlooking the sea | staff-only areas such as the kitchen and maintenance rooms | locked storage for valuables.
6. Sustain social coherence with this backdrop pressure: A gathering of hotel guests and staff, strained by the pressures of post-war life and shifting societal roles, becomes a crucible for secrets and betrayals as they navigate the tension of a recent death under suspicious circumstances.
7. Maintain continuity around these socially central cast anchors where relevant: Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill, Sylvia Trent, Hugo Vane.
8. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Critical: Plot similarity 0.85 with 'The Mysterious Affair at Styles' (same crime method of delayed-effect poisoning).
9. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Moderate: Character similarity 0.70 with 'The Second Key' (similar cast structure).
10. STORY TO DATE ANTI-COPY RULE: The STORY TO DATE section below is provided for chronological and factual reference ONLY. You MUST NOT copy, lightly rephrase, or structurally echo any sentence or paragraph from prior chapters. Every sentence in this chapter must be original prose unique to this scene. Reusing even a clause from prior chapter text will cause this attempt to fail immediately.

CRITICAL PROSE REQUIREMENTS:

The CML specifies exact requirements for certain validation-critical scenes. You MUST include these elements at the specified positions.

**Discriminating Test Scene (Act 3, Scene 4):**
Required elements: Execute the discriminating test, Observe the key's reaction with moisture, Draw conclusion about guilt
Test type: trap

**Suspect Clearance Scenes:**
- Beatrice Quill (Act 3, Scene 5): Alibi confirmed by hotel logs showing her duties.
  Clues: clue_id_1, clue_id_2
- Sylvia Trent (Act 3, Scene 5): Her alibi is verified through other guests.
  Clues: clue_id_1, clue_id_2
- Hugo Vane (Act 3, Scene 5): Business calls confirmed unrelated to Dr. Finch.
  Clues: clue_id_1, clue_id_2

**Culprit Revelation Scene (Act 3, Scene 6):**
Method: Confrontation with evidence from the reenactment.

**Clue Placement for These Chapters:**
- clue_core_contradiction_chain must appear in Act 1, Scene 2 via Witness statement

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
Batch chapters: 2-2.
Investigation state at start: 1 clue(s) revealed to reader; approximately 3 unresolved suspect(s).
Must change by end: Increase or complicate suspicion through a new pressure revelation — WITHOUT resolving the case: do NOT name, accuse, or extract a confession from the culprit, make an arrest, or declare the case closed (that is reserved for the final reveal).
Suspect pressure target(s): Captain Ivor Hale, Beatrice Quill, Hugo Vane
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
- Chapter 2:
  - STRUCTURAL ARCHETYPE — Chapter 2 must be: FIRST_CONTACT
      ✓ MUST contain: at least two suspect interviews
      ✗ MUST NOT contain: physical evidence discovery
  - Word count: Target 1250 words. Achieve this through plot events, dialogue exchanges, and physical investigation — not through atmospheric repetition or extended internal reflection. Each 200-word segment should contain at minimum one concrete story event (a discovery, a conversation exchange, a physical action or movement). Padding with atmosphere alone is not acceptable.
  - Opening: Begin with a character action, spoken line, or clock/time marker — never a location name or location-description phrase.
  - Scene is set in: Dr. Finch's hotel room — reference it naturally within the paragraph, never as your opening phrase.
  - Opening atmosphere (MANDATORY — validator enforced): the first paragraph MUST contain at least one of: rain / wind / fog / storm / mist / thunder / evening / morning / night / dawn / dusk / season / afternoon / midday / noon / midnight / twilight / sunrise / sunset / daylight / sunlight / overcast / cloudy / bright / dark / grey / pale / cold / warm / chill / crisp / damp / drizzle / haze / lamplight / firelight. A chapter that omits all of these from its opening paragraph will be rejected.
  - PARAGRAPH OPENER DIVERSITY (MANDATORY — validator enforced): No more than 2 paragraphs in this chapter may begin with "Eleanor" or "Eleanor's" as the first word. You must vary paragraph openings throughout: use sensory observations, another character's name or action, dialogue, object or sound details, or temporal markers. Opening 3 or more paragraphs with "Eleanor" will cause automated rejection.
  - ⛔ MECHANISM SPOILER BAN: Do NOT state how the crime device was manipulated — not the direction, not the magnitude, not who performed it. Characters may only observe that two sources of evidence disagree. The specific method, tamper amount, and perpetrator's action are ALL FORBIDDEN until the reveal. WRONG: "The culprit had altered the device by forty minutes to create a false alibi." RIGHT: "Two independent pieces of evidence gave contradictory readings — a discrepancy neither could yet explain."
  - Continuity bridge: in the first 120 words, visibly connect from the previous chapter's final beat. Carry forward one unresolved element (object, accusation, emotional pressure, or immediate physical action) from: "A final glance at the body confirmed what she already knew: Dr. Finch had not died by chance. The scene was too carefully composed, the clues too pointed. Eleanor felt the first stirrings of resolve. She would find the s...".
  - CLUE OBLIGATIONS — each clue below MUST be dramatized, but in YOUR OWN WORDS:
    Render each as something a character SEES, DOES, or SAYS on the page. The bracketed text is a
    DESCRIPTION of the evidence for you — do NOT transcribe it as narration. Copying a clue's
    description sentence verbatim into the prose FAILS validation.
    • floor, near, finch [clue_core_contradiction_chain] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: recent, connected, poisoning
      ↳ MANDATORY TWO-PARAGRAPH STRUCTURE (must appear in paragraphs 1 or 2 — no later):
         Paragraph 1: The POV character physically approaches or directly observes this evidence.
           The narration or dialogue explicitly states what is seen (use the exact locked phrase if one applies).
         Paragraph 2 (immediately following): The detective or POV character explicitly reasons
           about what this evidence implies — who it implicates, why it may be unreliable,
           or what inference it supports. This must be a separate full paragraph, not a sentence appended to Paragraph 1.
    • witness, testimony, finch, health, before, dinner [clue_mechanism_visibility_core] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      ⛔ SPOILER EMBARGO (pre-reveal chapter): surface ONLY the surface anomaly a character can see/hear/find.
         Do NOT name who it implicates, state the tamper direction or magnitude, or explain the mechanism in this chapter.
         Present it as an unexplained discrepancy; the culprit and method are revealed later.
         Place this OBSERVATION in paragraph 1 or 2 (observation only — no inference about the culprit).
  - Tonal contrast: include at least one beat of relief or ironic counterpoint. Do not sustain maximum tension for every paragraph.
  - CLUE DISCLOSURE RULE (Stage 2/4):
    Characters may establish access and opportunity but must NOT state the crime method or draw the final clue-to-culprit connection. Investigation without conclusion.
    WRONG: dialogue or narration that directly explains how the crime was committed before Stage 4.
    RIGHT: observation, physical reaction, and logical inference that leaves the mechanism just off-screen.
  - SUSPECT-PRESSURE MODE: do NOT resolve the case in this chapter. No confession, arrest, final accusation, definitive culprit declaration, or case-closed language. End with unresolved pressure: a contradiction, narrowed suspicion, motive pressure, or a new question.
  - ALIBI LOCK: Captain Ivor Hale's established alibi is "dinner time". Do NOT place Captain Ivor Hale at any other location or in any other activity during the crime window. Any contradiction is a continuity error that triggers a retry.
  - TESTIMONY CONTINUITY: Captain Ivor Hale has already made statements in earlier chapters. Any time, location, or claim attributed to Captain Ivor Hale in THIS chapter must be consistent with those earlier statements. Do NOT introduce a new or different alibi claim — any contradiction is a continuity error.
- Locked fact phrase obligations:
  - If this batch mentions The temperature in the victim's room at the time of poisoning., write exactly: "eighty degrees Fahrenheit".
  - If this batch mentions The time when the victim last used the key before being poisoned., write exactly: "ten minutes past eleven".
- Seasonal vocabulary allow-list: autumn, autumnal, fall.
- Forbidden seasonal words: spring, summer, winter.

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
Investigation state at start: 1 clue(s) revealed to reader; approximately 3 unresolved suspect(s).
Must change by end: Increase or complicate suspicion through a new pressure revelation — WITHOUT resolving the case: do NOT name, accuse, or extract a confession from the culprit, make an arrest, or declare the case closed (that is reserved for the final reveal).
Suspect pressure target(s): Captain Ivor Hale, Beatrice Quill, Hugo Vane
Required new information: At least one fear/motive/lie/loyalty reveal with investigative consequence.
Forbidden reveals at this stage: No culprit resolution: no confession, no arrest, no 'case closed', no accusation ('I accuse'/'I name'), and never state 'the culprit/murderer/killer is/was …'. The accusation is reserved for the final reveal — build suspicion only.

FROZEN FACT STATE (DO NOT ALTER):
- Timeline anchor: November (autumn).
- Month, season, weather, and time-of-year language in this batch must stay compatible with autumn.
- Established timeline fact: Dr. Finch's last known movements before dinner
- Established timeline fact: Time of death determined by the coroner
- If referenced, use exact phrase: "eighty degrees Fahrenheit" (The temperature in the victim's room at the time of poisoning.).
- If referenced, use exact phrase: "ten minutes past eleven" (The time when the victim last used the key before being poisoned.).

STORY TO DATE (REFERENCE ONLY — DO NOT COPY VERBATIM):
- Full prior chapter text is provided below for continuity, factual consistency, and reference accuracy.
- Use this to keep character voice, chronology, clue state, and location continuity aligned with earlier chapters.
- Do not quote, copy, or paraphrase these paragraphs too closely; write fresh prose that remains consistent with them.

--- BEGIN PRIOR CHAPTER 1 ---
Title: Chapter 1: The Damp Key
Eleanor Voss pressed her gloved palm against the lacquered door of Dr. Finch's hotel room, the chill from the corridor seeping through the seams of her coat. The air was heavy with the scent of damp sea air and something sharper, almost metallic, that clung to the back of her throat. A pale shaft of morning light, filtered by overcast skies, crept across the threshold, illuminating the rough carpet and the scattered shadows that flickered with every gust of wind rattling the windowpanes. Inside, silence reigned except for the faint, persistent drip of rainwater from the eaves and the distant murmur of voices in the hallway—a hotel not yet awake, but already unsettled.

Dr. Mallory Finch lay sprawled on the floor beside her bed, her body twisted at an unnatural angle, one arm outstretched as if reaching for the nightstand. The crisp lines of her navy skirt were rumpled, and the string of pearls at her throat gleamed with a cold, funereal luster. Eleanor's breath caught; she had known Dr. Finch only by reputation—a formidable woman, tireless in her advocacy, never one to surrender to frailty. Yet here she was, stilled in death, her features slack and oddly peaceful. A key—damp, its brass dulled by moisture—rested near her open hand, catching the morning's thin glow. The room itself was warm, almost stifling, a sharp contrast to the chill outside, and Eleanor found herself shivering despite it.

Eleanor knelt, careful not to disturb the pattern of the carpet, and studied the scene with a journalist's eye for contradiction. Only last night, at dinner, Dr. Finch had been the picture of health, her laughter carrying above the clatter of cutlery, her cheeks flushed with energy. Several guests had remarked on it—Eleanor recalled Beatrice Quill's offhand comment about Dr. Finch's stamina, and even Hugo Vane, not given to compliments, had nodded in grudging approval. There had been no sign of illness, no hint of the collapse that must have followed. The suddenness of her death now seemed all the more jarring, a fact that prickled at the edges of Eleanor's composure.

She glanced at the key again, noticing how a faint ring of moisture had seeped into the carpet beneath it. The key itself was unremarkable—standard hotel issue, its tag marked with a faded number—but its presence here, so close to Dr. Finch's hand, felt deliberate. Eleanor reached out, the wool of her glove darkening as she brushed the damp spot. The sensation was cold, almost oily, and she withdrew her hand with a frown. The window above the bed was latched tight, the curtains drawn against the grey autumn morning. There was no sign of forced entry, no overturned furniture, only the faint echo of something gone terribly wrong.

A movement in the doorway drew Eleanor's attention. Captain Ivor Hale, the hotel's steward and a man whose posture spoke of a lifetime of command, stood with his hands clasped behind his back. His uniform was immaculate, though his gaze lingered on the body with a flicker of unease. 'Miss Voss,' he said quietly, 'I trust you will take charge here? The guests are growing restless.'

Eleanor straightened, smoothing her skirt, and met his gaze. 'I suppose someone must.' Her voice was steady, though she felt the weight of expectation settle on her shoulders. She was no stranger to inquiry—her years as a travel journalist had taught her to read between lines, to recognize the stories people tried to hide. Still, this was no ordinary scandal. The air in the room felt thick, as if every secret in the hotel had gathered to watch.

Behind Captain Hale, the corridor was filling with subdued voices. Beatrice Quill, the creative visionary whose sharp tongue was matched only by her keen eye for detail, hovered at the threshold, her gloved hands twisting the handle of her handbag. 'She seemed perfectly well last night,' Beatrice murmured, her gaze fixed on the floor. 'I saw her laughing with Hugo—she even danced a little. It doesn't make sense.'

Sylvia Trent, the caretaker, appeared next, her face pale beneath her hat. She pressed a handkerchief to her lips, her eyes darting from Eleanor to the body and back again. 'Dr. Finch had complained of headaches, but nothing serious. She was in such good spirits at dinner. I can't believe—' Her voice faltered, trailing off into silence.

Hugo Vane, the business tycoon whose presence seemed to fill the corridor, offered only a curt nod. His suit was impeccably tailored, yet there was a stiffness to his bearing, as though he resented the intrusion of tragedy into his carefully ordered world. 'If you ask me,' he said, not quite meeting Eleanor's eyes, 'these things happen. People overwork themselves. The war's left everyone on edge.'

Eleanor let the remarks hang in the air, watching each face for the subtle betrayals of anxiety or guilt. The guests' insistence on Dr. Finch's recent good health—contradicted so violently by her sudden death—struck her as more than mere shock. It was as if they needed to believe in the illusion of normalcy, to ward off the suspicion that something darker had taken root in their midst.

She turned back to the room, cataloguing each detail: the untouched glass of water on the nightstand, the neatly folded coat at the foot of the bed, the radio tuned to static. The temperature, she noted, was unusually high—'eighty degrees Fahrenheit,' she murmured, recalling the maintenance man's offhand remark about the faulty radiator. Yet Dr. Finch had not opened the window, nor had she called for assistance. The warmth pressed in, oppressive and unnatural, as if the room itself were complicit.

Eleanor crouched again, examining the key more closely. The dampness was not from the rain outside; the pattern of moisture suggested it had been pressed into something wet, then dropped. She sniffed her glove, detecting a faint, acrid tang—chemical, not organic. Was it a cleaning agent? Or something more sinister? She resisted the urge to speculate aloud, instead tucking the key into a handkerchief and slipping it into her pocket.

The guests' voices faded as they retreated down the corridor, leaving Eleanor alone with her thoughts and the silent accusation of Dr. Finch's body. She drew a slow breath, steadying herself. The evidence did not add up: a woman in robust health, dead without warning; a key, damp and inexplicably close to her hand; a room too warm for comfort. The official explanation—illness, perhaps a stroke—felt thin, unsatisfying. Eleanor's instincts, honed by years of observing human nature at its most unpredictable, told her there was more beneath the surface.

She rose, brushing imaginary dust from her skirt, and crossed to the window. The sky beyond was a uniform grey, the sea lost in mist. Somewhere below, the kitchen staff would be preparing the rationed breakfast, the wireless crackling with news of distant crises. Life at the Seaside Hotel would resume, but nothing would be quite the same. Eleanor pressed her forehead to the cool glass, letting the silence settle. She would have to ask questions—uncomfortable ones—of everyone who had seen Dr. Finch alive. There would be resistance, evasions, perhaps even lies. But the truth, she suspected, was as persistent as the autumn rain.

A final glance at the body confirmed what she already knew: Dr. Finch had not died by chance. The scene was too carefully composed, the clues too pointed. Eleanor felt the first stirrings of resolve. She would find the story behind the silence, whatever it cost. As she turned to leave, the damp key in her pocket seemed to weigh heavier, a reminder that every lock—no matter how secure—could be opened, given the right touch.
--- END PRIOR CHAPTER 1 ---

[SCENE COMPLETENESS CONTRACTS — MANDATORY. Each contract below lists what you MUST enact in that chapter. Do not summarise or mention these labels in the prose — enact them organically.]
Chapter 2 (Act 1) completeness contract:
  PIVOT ELEMENT (MANDATORY — write this into the prose, shown not told): "The contradictory statements about the time of death."
  FACT ESTABLISHED (MANDATORY — reader must know this by chapter end): "Establishes that the suspects' alibis do not align with the timeline of the victim's death."

# Case Overview
Title: The Delayed Deception
Era: 1940s
Setting: Seaside Hotel
Crime: murder (delayed-action poison)
Culprit: Captain Ivor Hale
Victim: Dr. Mallory Finch
False assumption: Dr. Mallory Finch's death was due to a sudden health crisis.
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
    "sceneNumber": 2,
    "act": 1,
    "title": "Initial Investigation",
    "setting": {
      "location": "Dr. Finch's hotel room",
      "timeOfDay": "Late morning",
      "atmosphere": "Heavy with tension and uncertainty"
    },
    "characters": [
      "Eleanor Voss",
      "Captain Ivor Hale",
      "Beatrice Quill",
      "Hugo Vane"
    ],
    "purpose": "Establish initial clues and suspects",
    "cluesRevealed": [
      "clue_mechanism_visibility_core",
      "clue_core_contradiction_chain"
    ],
    "dramaticElements": {
      "conflict": "Tensions rise as suspects gather",
      "tension": "Contradictory statements raise suspicion",
      "microMomentBeats": [
        "Eleanor's hands tremble as she examines the key."
      ]
    },
    "summary": "Eleanor questions Captain Hale, Beatrice, and Hugo about their whereabouts during the time of death. They each provide alibis, but Eleanor notices discrepancies in their stories. The atmosphere is charged with suspicion as they realize they are all implicated in some way.",
    "beat": "crime",
    "estimatedWordCount": 1800,
    "pivotElement": "The contradictory statements about the time of death.",
    "factEstablished": "Establishes that the suspects' alibis do not align with the timeline of the victim's death.",
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
      },
      {
        "characterName": "Hugo Vane",
        "behaviour": "Show normal social behaviour; grief or confusion if appropriate."
      }
    ],
    "redHerringPlacement": null,
    "emotionalRegister": "Unease grows as Eleanor begins to uncover hidden motives among the guests.",
    "dominantCharacterNote": {
      "name": "Eleanor Voss",
      "voiceRegister": "Eleanor speaks with an engaging rhythm, her anecdotes punctuated by ironic quips that reveal her keen perception."
    },
    "humourGuidance": {
      "permission": "permitted",
      "character": "Eleanor Voss",
      "form": "dry_wit"
    },
    "eraTextureNote": "Short daylight hours leading to a sense of confinement; Rationing affecting food supplies and services; Limited communication methods due to post-war recovery",
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
□ Allowed seasonal words only: autumn, autumnal, fall.
□ Forbidden seasonal words: spring, summer, winter.
□ Chapter 2: the clue [clue_core_contradiction_chain] (finch, room, floor, near, slightly, damp) is placed in the first 25% of the chapter, dramatized in your own words, followed by an explicit inference or suspicion paragraph.
□ Chapter 2: the clue [clue_mechanism_visibility_core] (witnesses, confirm, finch, seen, healthy, shortly, before, dinner) is placed in the first 25% of the chapter, dramatized in your own words, followed by an explicit inference or suspicion paragraph.
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
