# Actual Prompt Record

- Run ID: `mystery-1784469894397`
- Project ID: ``
- Timestamp: `2026-07-19T14:13:01.005Z`
- Agent: `Agent9-ProseGenerator-Ch2`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4.1`
- Temperature: `0.42`
- Max Tokens: `4500`
- Attempt: `first`
- Prompt Hash: `3983931dec2aae77`

## Message 1 (role=system)

```text
NARRATIVE VOICE: Eleanor Voss[SHE] is the viewpoint character. Unanchored “she/her” or “he/him” without a nearby name refers to Eleanor Voss. Default narrator pronoun: SHE. Never default to “he/his” as the neutral narrator voice unless the POV character is male.

You are an expert prose writer for classic mystery fiction. Your role is to write compelling, atmospheric narrative chapters that read like a professionally published novel.

⛔ ABSOLUTE RULE — CHARACTER NAMES:
The ONLY characters who exist in this story are: Eleanor Voss (woman), Dr. Mallory Finch (woman), Captain Ivor Hale (man), Beatrice Quill (woman) — DECEASED, past-tense only, Sylvia Trent (woman), Hugo Vane (man).
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
- MORAL COMPLEXITY REQUIREMENT: The mechanism of this crime carries a moral gray area: "The murderer acted out of desperation, believing they were protecting a loved one, which makes their actions morally complex." — the culprit reveal and denouement MUST acknowledge this ambiguity. Do not let the ending feel clean or simple. Give the reader at least one moment of uncomfortable sympathy or moral doubt.
- ⚠ MECHANISM–ENVIRONMENT EXCEPTION (the central clue depends on it): the mystery's mechanism requires direct, unobstructed sunlight and clear skies (the shadow / solar reading cannot form under cloud), but the established setting is "overcast with occasional rain showers · early evening" (note "overcast"). At the clue-critical moment, render a BRIEF, JUSTIFIED local exception — a short, explicitly-noted break in the prevailing conditions (e.g. "a brief clearing in the overcast") — so the mechanism can operate WITHOUT contradicting the established weather. Do not silently ignore the overcast, and do not present the mechanism as if the conditions were always favourable.
- CHAPTER OPENING (every chapter, lint-enforced): never open on a tour or inventory of named rooms/places. The first sentence must land a character ACTION, a specific sensory detail, or a concrete in-scene moment — not "In the [room], the [room], and the [room]…". Locations enter through what a character does in them, one at a time.
- VICTIM IDENTITY & OPENING HOOK (ROADMAP_TO_80 M2): The murder victim is Beatrice Quill. Name them — Beatrice Quill — in the FIRST PARAGRAPH; never open with "the victim" or "the body". Open IN MEDIAS RES: the first one or two sentences must land the discovery and the single unsettling CONTRADICTION (the impossible detail that starts the case), seen through the investigator's eyes. Weave sensory and atmosphere detail AROUND that hook — do NOT precede the stakes with a standalone scene-setting/weather preamble. They are found dead — they do not speak, react, or gesture. This is their only physical appearance in the story.

⚠️ AMATEUR DETECTIVE STORY: The investigator is a civilian with no official standing. The official police (if they appear) are unnamed background figures only — "a constable", "the sergeant", "an officer from the village". Do NOT give any police official a name or title+surname combination. There is no Inspector [Surname], no Constable [Surname], no Sergeant [Surname] in this story.


CRITICAL CHARACTER CONSISTENCY RULES:

1. Each character has ONE canonical name. Use ONLY names from this list. Never vary, abbreviate, or add titles beyond what is listed.
   COMPLETE CAST (no other named characters exist): Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill (DECEASED), Sylvia Trent, Hugo Vane
   - "Mr. Jennings entered the room" → ILLEGAL. Jennings is not in the cast.
   - "Constable Reed took notes" → ILLEGAL. Reed is not in the cast.
   - "A constable took notes" → LEGAL (no name given).

2. Character roles are fixed:
   - Eleanor Voss: Amateur Sleuth / Civilian Investigator
   - Dr. Mallory Finch: Professional Rival
   - Captain Ivor Hale: Authority Figure
   - Beatrice Quill: victim (DECEASED — does not appear in any scene, past tense only)
   - Sylvia Trent: Manipulative Insider
   - Hugo Vane: Desperate Creator
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

- Dr. Mallory Finch
  Public identity anchor: Physician; suspect 
  Connection to victim: Mallory frequently advises Beatrice on health matters and often visits the hotel.; Their relationship is generally friendly, with Beatrice appreciating the advice..
  Investigation relevance: access plausibility: medium | alibi window: from eight to nine fifteen PM | opportunity channel: Medical supplies room.
  Suspicion/pressure cue seed: Nervous when asked about the victim.
  Investigator read: include one immediate observational inference (gesture, gaze target, pause, object grip), but do not state guilt as fact.

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

## Era: 1945-03
In March 1945, the world is in a state of flux, caught between the lingering shadows of war and the hopeful whispers of peace. Daily life is marked by uncertainty as people grapple with the emotional aftermath of conflict, while the promise of a new beginning looms on the horizon. The seaside hotel, a refuge from the chaos outside, is filled with guests who carry their burdens quietly, each seeking solace in comfort and camaraderie. However, the tension is palpable, with the distant sounds of war echoing in the background, reminding everyone of the stakes at play. The scent of saltwater mingles with damp earth from recent rain showers, creating an atmosphere thick with anxiety and unspoken fears, as everyone wonders what the future holds.
Emotional register: Collectively, there is a sense of cautious optimism mixed with lingering anxiety about the future.
Physical constraints: Rationing limits access to certain goods and services. | Transportation is restricted due to fuel shortages. | Communication is slow, with news traveling primarily by radio and print. | Curfews are still in effect in some areas, limiting nighttime activities.
Current tensions (weave into background texture): The Yalta Conference has just concluded, influencing post-war Europe. | The Allied forces are advancing in Europe as World War II nears its end. | Rationing continues to affect daily life, impacting food and resources.
Wartime context — The war is nearing its conclusion, with many soldiers returning home.: Communities are rallying together to support each other during the transition. Absence effect: Families are often separated, leading to feelings of loss and uncertainty.

## Story Theme
In the aftermath of war, the search for truth reveals the fragility of human relationships and the heavy cost of deceit, and reveals that evidence carries ethical weight, forcing characters to choose accountability over social performance when appearances and facts collide.

## Story Emotional Register
Dominant: A tension-filled journey through deception and revelation.

Arc:
In the grand, art deco seaside hotel, the atmosphere is thick with tension as the murder of Beatrice Quill sends shockwaves through the community. The initial discovery of her body, entwined with the mechanical clock that misleads investigators, sets off a wave of unease, prompting Detective Eleanor Voss to delve into the intricacies of the case. As she navigates through a web of lies and hidden motives, the emotional cost of the investigation weighs heavily on her, revealing the personal stakes involved. The first clues hint at the darker side of the suspects, but they also lead to false assumptions, raising doubts about Eleanor's ability to solve the case and restore her reputation.

A pivotal moment occurs when Eleanor uncovers the true time of death, forcing her to reevaluate the timeline and the suspects’ alibis. This revelation shifts her focus, leading her to confront the connections between the suspects and the victim, illuminating the hidden tensions that linger among them. As the pressure mounts, Eleanor must face the reality of the situation, culminating in a gripping confrontation where truths are unveiled. The climax exposes not only the murderer but also the fragility of human relationships, leaving Eleanor to grapple with the emotional fallout of her discoveries. In the resolution, the characters must come to terms with their actions, revealing the heavy cost of deceit and the weight of their choices, while Eleanor's quest for truth ultimately transforms her understanding of herself and her place within the world.

## Emotional register at this point in the story
A heavy atmosphere of tension fills the hotel as the murder is discovered.

## Character Portraits (appearance & era)

### Eleanor Voss
Eleanor Voss epitomizes the post-war struggle as she balances her career in travel writing with her hidden financial woes. The 1940s demand resilience and resourcefulness, and Eleanor’s charm is both a shield and a liability in a world where reputation can make or break one’s future. Her internal conflict resonates with many women of the time, who are navigating newfound independence while still feeling the weight of societal expectations.
Era intersection: Eleanor's financial struggles highlight the broader societal pressures on women to maintain stability amid a changing landscape.

### Dr. Mallory Finch
As a respected physician, Dr. Mallory Finch embodies the complex moral landscape of the 1940s. Her ethical dilemmas and hidden addictions reflect the cracks in the veneer of post-war professionalism. The tension between her public persona and private struggles speaks to a generation grappling with the consequences of war, where personal ambition often collides with ethical boundaries in the quest for validation.
Era intersection: Mallory's desperation mirrors the societal pressures faced by women, who are often judged by their professional success.

### Captain Ivor Hale
Captain Ivor Hale’s stoic demeanor masks a tumultuous inner world, shaped by the traumas of war. His struggles with PTSD and the fear of exposure resonate deeply in a post-war society that grapples with its own ghosts. Ivor's battle for honor amidst the chaos of the present reflects the broader struggle of many veterans returning to a world that feels foreign and unwelcoming.
Era intersection: Ivor's internal conflict reveals the societal expectation for men to uphold traditional notions of honor despite personal turmoil.

## Character Voices

### Eleanor Voss (she/her/her)
Eleanor speaks with a rhythmic charm, often weaving anecdotes into her conversations, tinged with playful sarcasm.
[comfortable] Well, this is a twist, isn't it? It seems like we've found ourselves in quite the predicament.
[evasive] Oh, I wouldn't worry too much about that. People often jump to conclusions, don’t they?
[stressed] I just need to focus on getting to the bottom of this. There's too much at stake to falter now.
Humour: Eleanor's dry wit adds layers to her interactions, often disarming those around her.

### Dr. Mallory Finch (she/her/her)
Mallory conveys authority with clinical precision, often using medical jargon that can alienate those around her.
[comfortable] It's all in the details, isn't it? Every little observation counts.
[evasive] I was simply tending to my patients, nothing more.
[stressed] This is a matter of utmost importance. My career depends on it!
Humour: Her sardonic remarks reveal her anxiety and serve as a defense mechanism.

### Captain Ivor Hale (he/him/his)
Ivor's speech is clipped and authoritative, lacking embellishments and emotional expression.
[comfortable] Honor is paramount; it cannot be questioned.
[evasive] I have nothing to say on that matter.
[stressed] The past is a heavy anchor; I carry it with me always.
Humour: Ivor maintains a serious demeanor, not indulging in humor.

## Location Registers (scene framing guides)

Lobby: The lobby of the Grand Mariner Hotel buzzes with tension; the air thick with anticipation and unspoken secrets as guests navigate their burdens beneath the hotel’s opulent facade.. Camera angle: As a writer entering this space, one should capture the contrast between elegance and the palpable unease that lingers like the scent of salt in the air.. Era: The atmosphere is charged with the weight of post-war anxieties, where every interaction carries the echoes of a world still healing.

Dining Room: The dining room is a stage of elegance, yet an undercurrent of tension permeates the air as guests engage in polite conversation while navigating hidden fears and secrets.. Camera angle: Entering this space, the writer should focus on the juxtaposition of the sumptuous setting against the emotional turmoil simmering just below the surface.. Era: In a post-war world, the dining room serves as a microcosm of societal expectations, where the facade of civility masks deeper anxieties.

Guest Rooms: The guest rooms are cloistered sanctuaries, where the weight of secrets and regret looms large, offering a stark contrast to the vibrant life outside the hotel’s walls.. Camera angle: A writer should portray these rooms as intimate spaces filled with unspoken thoughts, capturing the essence of solitude and reflection.. Era: These rooms embody the isolation felt by many, reflecting the internal struggles of those seeking solace from the chaos of the world.

Terrace: The terrace is a place of beauty and danger, where the salty breeze carries laughter, yet the crashing waves remind guests of the tempest brewing beneath the surface.. Camera angle: For a writer, this space should be depicted as a pivotal point where joy and tension converge, emphasizing the fragile nature of human relationships.. Era: As the sun sets, the terrace becomes a gathering space where societal façades are tested against the backdrop of nature’s unpredictability.

## Humour guidance for this story position (opening)
Permission: forbidden
Rationale: The discovery of a body demands a serious tone, leaving no room for humor.

FAIR-PLAY AND INFERENCE CONTRACT:
- FAIR PLAY CLUE TIMING: Never combine clue discovery and detective deduction in the same chapter. If a clue is first revealed to the reader in chapter N, the detective may only analyze, deduce from, or act on that clue in chapter N+1 or later.
- FAIR PLAY INFORMATION PARITY: The reader must see all clues BEFORE the detective uses them in reasoning. If the detective performs a test or makes a deduction, every piece of evidence supporting that conclusion must have been shown to the reader in earlier chapters.
- FAIR PLAY REVELATION SPACING: In the discriminating test scene, the detective can ONLY use clues that were revealed to the reader at least 1 full chapter earlier. Never introduce new clues or withheld information during the test.
- FAIR PLAY CONFRONTATION: During the final confrontation/revelation, the detective cannot surprise the reader with facts. Every piece of evidence cited must have been visible to the reader in prior chapters.
- Never solve by withheld information. Keep reader-information parity with detective reasoning.
- False assumption in force: The murder occurred at the time shown on the clock in the lobby.
- Hidden truth to progressively expose (compose in your own words from these elements): true, time, death, occurred, twenty, minutes
- Inference path checkpoints to dramatize clearly — compose ENTIRELY in your own sentences from these key terms (reproducing any briefing phrase verbatim FAILS validation):
  - Step 1: obs: clock, lobby, shows, eight, guests, claim, beatrice, alive, twenty | corr: clock, must, tampered, creating, false, time, death | effect: narrows, possibilities, timing, murder
  - Step 2: obs: visible, scratches, clock, winding, mechanism, indicate, tampering | corr: clock, tampering, implies, premeditated, action, someone, present | effect: eliminates, possibility, time, accurate
  - Step 3: obs: witnesses, recall, hearing, clock, chime, several, minutes, eight | corr: clock, rewound, meaning, murder, occurred, time, shown | effect: narrows, murder, window, eight, twenty
- Discriminating test method: trap
- Discriminating test elements to dramatize (compose ENTIRELY in your own sentences from these — do NOT reproduce any briefing phrase verbatim): clock, time, witness, statements, chimes, supposed, death
- Test must rely on already-shown clue IDs: clue_11, clue_5, clue_core_contradiction_chain, clue_early_1
- Fair-play rationale: Step 1: The clock's reading contradicts witness statements about Beatrice's timeline. Step 2: The tampering marks indicate premeditation, revealing the murderer is someone present. Step 3: The chimes confirm the timeline mismatch, exposing the truth.

## Character Reference

### Eleanor Voss (she/her — NEVER he/him)
Eleanor speaks with an engaging rhythm, often weaving anecdotes into her conversations
She has a penchant for playful sarcasm, particularly when discussing her own misfortunes.
Eleanor grapples with the fear that her financial struggles will be exposed and undermine her credibility as a writer.
Voice colour: Eleanor Voss uses dry wit humour — let it surface in their dialogue where natural, not in every line.

### Dr. Mallory Finch (she/her — NEVER he/him)
Mallory speaks with a clinical precision, often using medical jargon that can alienate those around her
When pressed, her tone sharpens, and she occasionally employs dark humor to mask her anxiety.
Mallory is torn between her professional ethics and the desperation to validate her controversial medical theories, fearing exposure of her practices.
Voice colour: Dr. Mallory Finch uses sardonic humour — let it surface in their dialogue where natural, not in every line.

### Captain Ivor Hale (he/him — NEVER she/her)
Ivor speaks in a clipped, authoritative manner, his words often laced with a military precision
He avoids small talk and direct emotional expressions, preferring to maintain a stoic demeanor.
Ivor is haunted by his wartime decisions, grappling with PTSD and the fear that his past will unravel the honor he has fought to uphold.


## CHARACTER CONTRACTS (binding for this scene)
Each entry below constrains how this character must be written in this chapter.
These override generic style guidance when they conflict.

### Eleanor Voss[SHE]
Voice & mannerisms: Eleanor speaks with an engaging rhythm, often weaving anecdotes into her conversations. She has a penchant for playful sarcasm, particularly when discussing her own misfortunes.
SIGNATURE TIC (use sparingly — this is Eleanor Voss's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "Well, this is a twist, isn't it?"
Sample voice fragments (match this register and rhythm):
  [comfortable] "Well, this is a twist, isn't it? It seems like we've found ourselves in quite the predicament."
  [evasive] "Oh, I wouldn't worry too much about that. People often jump to conclusions, don’t they?"
Humour: dry wit — deploy occasionally (level 0.5)
FORBIDDEN phrase (never write for Eleanor Voss): "a surge of determination washed over her"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "N/A" — do not surface in Act I.

### Dr. Mallory Finch[SHE]
Voice & mannerisms: Mallory speaks with a clinical precision, often using medical jargon that can alienate those around her. When pressed, her tone sharpens, and she occasionally employs dark humor to mask her anxiety.
SIGNATURE TIC (use sparingly — this is Dr. Mallory Finch's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "It's all in the details, isn't it?"
Sample voice fragments (match this register and rhythm):
  [comfortable] "It's all in the details, isn't it? Every little observation counts."
  [evasive] "I was simply tending to my patients, nothing more."
Humour: sardonic — deploy occasionally (level 0.4)
FORBIDDEN phrase (never write for Dr. Mallory Finch): "palpable tension filled the room"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Jealous of the victim's influence in the community and fear that her unethical practices would be exposed." — do not surface in Act I.

### Captain Ivor Hale[HE]
Voice & mannerisms: Ivor speaks in a clipped, authoritative manner, his words often laced with a military precision. He avoids small talk and direct emotional expressions, preferring to maintain a stoic demeanor.
SIGNATURE TIC (use sparingly — this is Captain Ivor Hale's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "The past is a heavy anchor."
Sample voice fragments (match this register and rhythm):
  [comfortable] "Honor is paramount; it cannot be questioned."
  [evasive] "I have nothing to say on that matter."
Humour: none — this character plays it straight in all scenes
FORBIDDEN phrase (never write for Captain Ivor Hale): "sighed deeply and felt a sense of peace"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Victim was planning to reveal classified information regarding Ivor's actions during the war." — do not surface in Act I.



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

Primary Location: The Grand Mariner Hotel (Brighton, England)
A luxurious art deco hotel clinging to the Sussex coastline, where the crashing waves mask secrets beneath their surface.

Key Locations Available:
- Lobby (interior): Gathering space
- Dining Room (interior): Dining and social gatherings
- Guest Rooms (interior): Private accommodations
- Terrace (exterior): Outdoor gathering space

Atmosphere (tonal cue only — do NOT reproduce this phrase verbatim in prose; translate into scene-specific, character-observed sensory language): tense and expectant, with an undercurrent of anxiety from recent war events
Weather: overcast with occasional rain showers

Era markers: manual typewriters in the lobby office | early radio broadcasts from the reception area | rationed automobiles parked in the lot | military radar equipment in the distance

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
Lobby (interior):
  - Visual: gleaming marble floors, ornate chandelier overhead, art deco furnishings
  - Sounds: soft piano music in the background, muffled conversations, clinking of fine china
  - Scents: freshly brewed coffee, damp sea air, scent of polished wood
  - Touch: cool marble underfoot, soft velvet upholstery

Dining Room (interior):
  - Visual: gleaming silverware on tables, large windows framing the sea, elegant floral centerpieces
  - Sounds: clinking of glasses, murmurs of conversation, the rustle of napkins
  - Scents: aroma of roasted meats, scent of fresh bread, hint of sea salt
  - Touch: smooth silk tablecloths, cool glassware in hand

Guest Rooms (interior):
  - Visual: faded floral wallpaper, heavy drapes blocking light, personal items scattered about
  - Sounds: the distant crash of waves, the creak of floorboards, soft whispers through thin walls
  - Scents: the scent of old books, the faint aroma of lavender, the mustiness of closed windows
  - Touch: soft cotton sheets, the coolness of glass windowpanes

⛔ REFERENCE DATA — DO NOT TRANSCRIBE VERBATIM: The above profiles are structural guides only. Generate original prose that evokes these qualities; do not reproduce the exact phrasing or sentence structure of the profile paragraphs.

SCENE OPENING RULE: When opening a scene in a new location, write what the POV character directly observes and physically senses at that moment — not a general description of the room's qualities. The reader must feel present, not briefed. Sensory details must be observed by the character, not stated as fact about the place.

SENSORY WRITING TECH
[truncated for prompt budget]

## Texture Pool
Draw on these as opportunities arise — you are not required to use them.

- In March 1945, the world is in a state of flux, caught between the lingering shadows of war and the hopeful whispers of peace
- Daily life is marked by uncertainty as people grapple with the emotional aftermath of conflict, while the promise of a new beginning looms on the horizon
- The seaside hotel, a refuge from the chaos outside, is filled with guests who carry their burdens quietly, each seeking solace in comfort and camaraderie
- However, the tension is palpable, with the distant sounds of war echoing in the background, reminding everyone of the stakes at play
- The scent of saltwater mingles with damp earth from recent rain showers, creating an atmosphere thick with anxiety and unspoken fears, as everyone wonders what the future holds.

TEMPORAL CONTEXT:

This story takes place in March 1945 during spring.

Seasonal Atmosphere:
- Weather patterns: overcast with occasional rain showers, cool breezes from the sea, occasional bursts of sunshine
- Daylight: Days are gradually getting longer, with daylight extending into the early evenings, though the chill in the air often keeps people indoors.
- Seasonal activities: strolling along the beach to enjoy the fresh air, visiting local tea rooms for afternoon tea, tending to early spring gardens
- Seasonal occasions: Saint Patrick's Day (March 17)
- Season: spring

Period Fashion (describe naturally):
- Men formal: navy wool suit with a narrow lapel, white dress shirt with a stiff collar, silk tie in muted tones
- Men casual: lightweight cotton trousers, checked flannel shirt, cardigan sweater
- Men accessories: fedora hat, leather gloves, wristwatch with a leather band
- Women formal: pastel-colored tea dress with a fitted waist, lightweight wool coat with a cinched belt, pair of low-heeled pumps
- Women casual: floral blouse paired with a high-waisted skirt, tailored trousers with a cropped jacket, knitted cardigan
- Women accessories: string of pearls, wide-brimmed hat, silk scarf

Cultural Context (reference naturally):
- Music/entertainment: 'Don't Fence Me In' by Bing Crosby, 'Sentimental Journey' by Doris Day, 'I'll Be Seeing You' by Billie Holiday; Films: 'The Lost Weekend', 'Since You Went Away'; Theatre: 'Carousel', 'The Glass Menagerie'; Radio: 'The Shadow', 'Suspense'
- Typical prices: Loaf of bread: four pence, A gallon of milk: one shilling, Taxi fare across town: two shillings
- Current events: The Yalta Conference has just concluded, influencing post-war Europe; Allied forces are advancing in Europe as World War II nears its end
- Literature: 'The Catcher in the Rye' by J.D. Salinger | 'The Naked and the Dead' by Norman Mailer | 'The Great Gatsby' reprint | [historical fiction] | [mystery] | [war narratives]
- Technology: the atomic bomb is in development | advancements in radar technology | improvements in military vehicles | radio sets for entertainment and news | manual typewriters for correspondence | early television sets in urban areas
- Daily life: engaging in community events, attending church services, participating in local sports or activities
- Social rituals: afternoon tea gatherings, weekly family dinners, community dances or socials

Atmospheric Details:
The salty breeze carries the scent of the sea, mixed with the faint aroma of rain-soaked earth from the occasional downpour. Distant thunder rumbles as grey clouds loom overhead, casting a somber light on the seaside hotel where the mystery unfolds. Inside, the warm glow of lamps contrasts sharply with the chill outside, creating a cozy yet tense atmosphere as guests await news from the frontlines.

FASHION INTEGRATION TECHNIQUES:
- First appearance: Describe outfit to establish class/personality
- Accessories: Gloves, hats, pocket watches, jewelry reveal status
- Time-specific: Different outfits for different times of day
- Character traits: Fastidious dresser vs rumpled appearance
- Action integration: "She tugged at her glove" or "He adjusted his tie"
- Weather appropriate: Overcoats in winter, light linen in summer

CULTURAL TOUCHSTONE INTEGRATION:
- Casual conversation: "Did you hear that new jazz record?" or "I saw th
[truncated for prompt budget]

NON-NEGOTIABLE CHAPTER OBLIGATIONS — LOCKED EVIDENCE VALUES (VERBATIM REQUIRED):
The following measured values (times, amounts, measurements) are absolute ground truth. Every time this chapter describes, mentions, or alludes to one — no matter how briefly — it MUST use the exact phrase shown below, character for character. NO paraphrase, approximation, rounding, or synonym is permitted.

FAILURE EXAMPLE: if the locked value is "at thirteen minutes to midnight" and you write "just before midnight" or "around midnight" — that is a HARD FAIL. You must write "at thirteen minutes to midnight". Equally, if the locked value is written in words, such as "ten minutes past eleven", and you convert it to figure-based clock notation — that is also a HARD FAIL. Words stay as words; figure forms are forbidden for word-phrased facts.

CRITICAL — WORD-PHRASED VALUES: If the canonical value is written out in words (e.g. a time like "ten minutes past eleven", or an amount like "forty minutes"), reproduce those exact words. DO NOT convert to figure-based time notation, twenty-four-hour format, or any other numeric shorthand. Correct: "ten minutes past eleven". WRONG: figure-based clock notation or numeric shorthand.

Locked values:
  - The clock was rewound twenty minutes before the actual time of death.: "twenty minutes"
  - The true time of death was ten minutes past eleven.: "ten minutes past eleven"
    ⛔ FORBIDDEN alternatives: "11:10", "11.10", "eleven ten", "eleven-ten", "eleven past ten", "quarter past eleven", "half past eleven" — the ONLY acceptable form is "ten minutes past eleven"

If a value has no relevance to this chapter, omit it. But the moment you reference the underlying evidence, only the exact phrase above is acceptable.

⛔ CLUES TO SURFACE IN THESE CHAPTERS — mandatory:
The following evidence MUST be clearly observable to an attentive reader. Do not bury it in atmosphere or passing dialogue. Each clue must be concrete, specific, and noticeable:

• [clue_mechanism_visibility_core] mechanical, clock, deliberately, rewound, mislead, investigators, time, death, creating, false, timeline
  Category: temporal | Criticality: essential | Supports inference step 1
  Points to: clock, tampered, mislead, time, death

• [clue_core_contradiction_chain] clock, must, tampered, creating, false, time, death
  Category: temporal | Criticality: essential | Supports inference step 1
  Points to: clock, time, contradicts, witness, statements

For each clue above: an attentive reader should be able to find, record, and later use it to reason toward the solution.

═══ NARRATIVE STATE (read-only — do not contradict) ═══

LOCKED FACTS — use verbatim whenever this evidence is described:
  • The clock was rewound twenty minutes before the actual time of death.: "twenty minutes"
  • The true time of death was ten minutes past eleven.: "ten minutes past eleven"

CHARACTER PRONOUNS — never deviate from these:
  • Eleanor Voss: she/her/her
  • Dr. Mallory Finch: she/her/her
  • Captain Ivor Hale: he/him/his
  • Beatrice Quill: she/her/her
  • Sylvia Trent: she/her/her
  • Hugo Vane: he/him/his

CLUES ALREADY REVEALED TO READER: clue_mid_1 — do not reveal these as new information.

INVESTIGATION LOG — WHAT IS ESTABLISHED (do not re-establish, do not repeat):
• Evidence already established (reference only — do NOT restate or quote these; advance beyond them): clock, tampered, mislead, time, death
• Suspects still unresolved: Dr. Mallory Finch[SHE], Captain Ivor Hale[HE], Sylvia Trent[SHE]
⚠ The story must move FORWARD from this log. Any beat already listed above is forbidden from repeating.

⚠ THIS CHAPTER'S REQUIRED ADVANCE (opening): Discover the body, confirm the victim, establish the scene. The victim is found dead. They do not speak, react, or gesture. This is their only physical appearance — in all subsequent chapters they exist only in past tense (memory, evidence, testimony).

CONTINUITY HANDOFF — previous chapter closing beat:
  • "Outside, the rain resumed, drumming softly against the windows. The lobby remained suspended in its uneasy spring, the air thick with unspoken questions. Eleanor Voss, travel writer and now reluctant detective, squared her shoulders and prepared to ask the fir..."
  • The next chapter must open as a continuation of this beat, not as a disconnected reset.
═══════════════════════════════════════════════════════

═══════════════════════════════════════════════════════════
📚 CONTINUITY CONTEXT - CHARACTER & SETTING CONSISTENCY
═══════════════════════════════════════════════════════════

**CRITICAL: You are writing chapters 2+. Maintain consistency with earlier chapters.**

**Character Names Used in Chapters 1-1:**
Eleanor Voss, Captain Ivor Hale, Beatrice Quill, Hugo Vane

✓ RULE: Use EXACTLY these names. Do NOT vary spelling, add titles, or introduce new forms.
✓ Example: if earlier chapters used "Clara Whitfield", keep using "Clara Whitfield" — never "Mrs. Whitfield" unless that is the character's canonical name in the list above.

**Setting Vocabulary Established in Earlier Chapters:**
dining room, lobby

✓ RULE: Continue using this location vocabulary. Maintain consistency with established setting type.
✓ Do NOT introduce new location types that contradict earlier chapters.

**Recent Chapter Summary (for narrative continuity):**
Chapter 1: Chapter 1: The Frozen Clock
  Events: Eleanor Voss pushed open the heavy glass doors of the hotel lobby, the damp scent of rain-soaked stone and sea air clinging to her coat.

⚠️ **VALIDATION:** Character name mismatches and setting drift are common failure modes.
Double-check every character name against the list above before using it.

**⏱ LOCKED TIME ANCHOR — use verbatim, do not paraphrase:**
Clock time (from the case ground truth): **"Dinner was scheduled for eight PM."**
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
Known location profile anchors: The Grand Mariner Hotel, Lobby, Dining Room, Guest Rooms, Terrace, the hotel lobby
LOCATION NAME CAPITALISATION (HARD REQUIREMENT — validated):
All named locations in your prose MUST use the EXACT capitalisation from the CML profiles.
Canonical forms: "The Grand Mariner Hotel", "Lobby", "Dining Room", "Guest Rooms", "Terrace", "the hotel lobby"
Writing a location in lowercase (e.g. "drawing room" instead of "Drawing Room") is a validated error. Every time you mention a named location, copy its capitalisation from the list above.
- Chapter 2: OPENING STYLE (HARD): Start the VERY FIRST SENTENCE with spoken dialogue — e.g. '"[words]," [Name] said/asked/replied/murmured.' The opening quote must be the first character on the line. Anchor opening in "the hotel lobby". The opening style above governs only your FIRST SENTENCE; the grounding below may land anywhere in the first 2 paragraphs (it need not be sentence one, and never conflicts with the chosen opening style). HARD REQUIREMENT for the first 2 paragraphs: (a) include 2+ sensory words — choose from smell/scent/odor/fragrance/sound/echo/silence/whisper/creak/cold/warm/damp/rough/smooth/glow/shadow/flicker/dim — and (b) include 1+ atmosphere/time word — choose from rain/wind/fog/storm/mist/thunder/evening/morning/night/dawn/dusk/lighting/weather/season/afternoon/midday/noon/midnight/twilight/sunrise/sunset/daylight/sunlight/overcast/cloudy/bright/dark/grey/pale/chill/crisp/drizzle/haze/lamplight/firelight. These are validated requirements, not style suggestions; missing them triggers a retry.

[⚠ INTERNAL QUALITY DIAGNOSTICS — DO NOT REPRODUCE ANY PART OF THIS SECTION IN YOUR STORY OUTPUT. These are private generator observations for your consideration only. Your narrative must read as if this section does not exist. Never include phrases from this block in character dialogue, narration, or description.]

PRIOR CHAPTER QUALITY OBSERVATIONS:
- Chapter 1 (score 97/100):
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

PROMPT BUDGET SUMMARY: budget=24000 tokens; fixed=9328; context=11550; dropped=[none]; truncated=[location_profiles, temporal_context, pronoun_accuracy]

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
4. Integrate at least two concrete era-grounded details per chapter from setting refinement signals: radio broadcasting | early television sets | military radar | manual typewriters | long-distance telephone calls | military encryption.
5. Respect setting movement/access constraints in scene action and alibis: narrow hallways restrict movement | balconies provide limited access points | oceanfront location limits escape routes | restricted areas include staff-only zones and maintenance rooms | daily schedules dictate guest movements.
6. Sustain social coherence with this backdrop pressure: A mechanical clock-tampering murder unfolds amidst the tensions of post-war recovery, drawing together hotel guests and staff under the scrutiny of social expectations and familial ties.
7. Maintain continuity around these socially central cast anchors where relevant: Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill, Sylvia Trent, Hugo Vane.
8. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Critical: Plot similarity 0.85 with 'The Second Key' (same era and mechanical manipulation theme)
9. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Moderate: Character similarity 0.75 with 'The Second Key' (similar cast structure and roles)
10. STORY TO DATE ANTI-COPY RULE: The STORY TO DATE section below is provided for chronological and factual reference ONLY. You MUST NOT copy, lightly rephrase, or structurally echo any sentence or paragraph from prior chapters. Every sentence in this chapter must be original prose unique to this scene. Reusing even a clause from prior chapter text will cause this attempt to fail immediately.

CRITICAL PROSE REQUIREMENTS:

The CML specifies exact requirements for certain validation-critical scenes. You MUST include these elements at the specified positions.

**Discriminating Test Scene (Act 3, Scene 4):**
Required elements: Execute the discriminating test, Observe the clock's chimes and witness reactions, Draw conclusion about guilt
Test type: mechanical contradiction

**Suspect Clearance Scenes:**
- Dr. Mallory Finch (Act 3, Scene 5): Establishing her alibi through witness verification.
  Clues: clue_id_1, clue_id_2
- Captain Ivor Hale (Act 3, Scene 5): Narrowing his opportunity window based on dining schedules.
  Clues: clue_id_3, clue_id_4
- Sylvia Trent (Act 3, Scene 5): Confirming her presence in the art gallery during the time.
  Clues: clue_id_5, clue_id_6

**Culprit Revelation Scene (Act 3, Scene 6):**
Method: Confrontation with evidence linking Hugo Vane to the clock tampering.

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
Investigation state at start: 1 clue(s) revealed to reader; approximately 3 unresolved suspect(s).
Must change by end: Reframe prior clue meaning and update suspect implications.
Suspect pressure target(s): Dr. Mallory Finch, Captain Ivor Hale
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
  - Scene is set in: the hotel lobby — reference it naturally within the paragraph, never as your opening phrase.
  - Opening atmosphere (MANDATORY — validator enforced): the first paragraph MUST contain at least one of: rain / wind / fog / storm / mist / thunder / evening / morning / night / dawn / dusk / season / afternoon / midday / noon / midnight / twilight / sunrise / sunset / daylight / sunlight / overcast / cloudy / bright / dark / grey / pale / cold / warm / chill / crisp / damp / drizzle / haze / lamplight / firelight. A chapter that omits all of these from its opening paragraph will be rejected.
  - PARAGRAPH OPENER DIVERSITY (MANDATORY — validator enforced): No more than 2 paragraphs in this chapter may begin with "Eleanor" or "Eleanor's" as the first word. You must vary paragraph openings throughout: use sensory observations, another character's name or action, dialogue, object or sound details, or temporal markers. Opening 3 or more paragraphs with "Eleanor" will cause automated rejection.
  - Continuity bridge: in the first 120 words, visibly connect from the previous chapter's final beat. Carry forward one unresolved element (object, accusation, emotional pressure, or immediate physical action) from: "Outside, the rain resumed, drumming softly against the windows. The lobby remained suspended in its uneasy spring, the air thick with unspoken questions. Eleanor Voss, travel writer and now reluctant detective, squared h...".
  - CLUE OBLIGATIONS — each clue below MUST be dramatized, but in YOUR OWN WORDS:
    Render each as something a character SEES, DOES, or SAYS on the page. The bracketed text is a
    DESCRIPTION of the evidence for you — do NOT transcribe it as narration. Copying a clue's
    description sentence verbatim into the prose FAILS validation.
    • clock, shows, eight, guests, claim, beatrice, alive, twenty [clue_core_contradiction_chain] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: clock, time, contradicts, witness, statements
      ↳ MANDATORY TWO-PARAGRAPH STRUCTURE (must appear in paragraphs 1 or 2 — no later):
         Paragraph 1: The POV character physically approaches or directly observes this evidence.
           The narration or dialogue explicitly states what is seen (use the exact locked phrase if one applies).
         Paragraph 2 (immediately following): The detective or POV character explicitly reasons
           about what this evidence implies — who it implicates, why it may be unreliable,
           or what inference it supports. This must be a separate full paragraph, not a sentence appended to Paragraph 1.
    • clock, lobby, shows, eight [clue_mechanism_visibility_core] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      ⛔ SPOILER EMBARGO (pre-reveal chapter): surface ONLY the surface anomaly a character can see/hear/find.
         Do NOT name who it implicates, state the tamper direction or magnitude, or explain the mechanism in this chapter.
         Present it as an unexplained discrepancy; the culprit and method are revealed later.
         Place this OBSERVATION in paragraph 1 or 2 (observation only — no inference about the culprit).
  - Tonal contrast: include at least one beat of relief or ironic counterpoint. Do not sustain maximum tension for every paragraph.
  - CLUE DISCLOSURE RULE (Stage 3/4):
    Characters may draw inferences and name partial conclusions but must NOT state the full mechanism or name the culprit directly. The detective may suspect but not confirm.
    WRONG: dialogue or narration that directly explains how the crime was committed before Stage 4.
    RIGHT: observation, physical reaction, and logical inference that leaves the mechanism just off-screen.
  - ALIBI LOCK: Hugo Vane's established alibi is "from eight to nine fifteen PM". Do NOT place Hugo Vane at any other location or in any other activity during the crime window. Any contradiction is a continuity error that triggers a retry.
  - TESTIMONY CONTINUITY: Hugo Vane has already made statements in earlier chapters. Any time, location, or claim attributed to Hugo Vane in THIS chapter must be consistent with those earlier statements. Do NOT introduce a new or different alibi claim — any contradiction is a continuity error.
  - Sensory obligation — use at least two of: dim light filtering through clouds, shadows creeping along the walls | the ticking of a clock, soft whispers of conversation | freshly cut flowers. Mood: uneasy stillness.
- Locked fact phrase obligations:
  - If this batch mentions The clock was rewound twenty minutes before the actual time of death., write exactly: "twenty minutes".
  - If this batch mentions The true time of death was ten minutes past eleven., write exactly: "ten minutes past eleven".
- Seasonal vocabulary allow-list: spring, vernal, springtime.
- Forbidden seasonal words: summer, autumn, winter.

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
Must change by end: Reframe prior clue meaning and update suspect implications.
Suspect pressure target(s): Dr. Mallory Finch, Captain Ivor Hale
Required new information: Earlier clue gets revised meaning with explicit theory update.
Forbidden reveals at this stage: Do not introduce decisive new evidence from nowhere.

FROZEN FACT STATE (DO NOT ALTER):
- Timeline anchor: March (spring).
- Month, season, weather, and time-of-year language in this batch must stay compatible with spring.
- Established timeline fact: Dinner was scheduled for eight PM.
- Established timeline fact: Guests recall seeing Beatrice alive until at least eight twenty PM.
- If referenced, use exact phrase: "twenty minutes" (The clock was rewound twenty minutes before the actual time of death.).
- If referenced, use exact phrase: "ten minutes past eleven" (The true time of death was ten minutes past eleven.).

STORY TO DATE (REFERENCE ONLY — DO NOT COPY VERBATIM):
- Full prior chapter text is provided below for continuity, factual consistency, and reference accuracy.
- Use this to keep character voice, chronology, clue state, and location continuity aligned with earlier chapters.
- Do not quote, copy, or paraphrase these paragraphs too closely; write fresh prose that remains consistent with them.

--- BEGIN PRIOR CHAPTER 1 ---
Title: Chapter 1: The Frozen Clock
Eleanor Voss pushed open the heavy glass doors of the hotel lobby, the damp scent of rain-soaked stone and sea air clinging to her coat. The morning was overcast, a sullen light filtering through the tall windows and pooling in cold puddles on the marble floor. The faint echo of the storm lingered in the hush, broken only by the distant clatter of crockery from the kitchens and the steady drip of water from umbrellas abandoned by the door. Eleanor’s heart thudded with a peculiar urgency—a sense that the world, for all its post-war uncertainty, had shifted in some irrevocable way overnight.

She caught sight of Beatrice Quill immediately. Beatrice’s body lay sprawled near the base of the ornate art deco clock that dominated the far wall, her pastel dress twisted awkwardly beneath her. The delicate string of pearls around her neck had snapped, scattering beads across the polished marble like a constellation interrupted. Eleanor’s breath caught; the scene was wrong in a way she could not articulate, the silence in the lobby too complete, as if the hotel itself recoiled from what it had witnessed. The clock’s hands, fixed at eight, presided over the tableau with an indifference that chilled Eleanor more than the draft curling around her ankles.

She moved closer, the click of her sensible heels muffled by the thick rug. The ornate clock, usually a point of pride for the Grand Mariner Hotel, now seemed to mock her with its frozen face. Eight o’clock. But Eleanor’s memory rebelled—she had seen Beatrice alive well after dinner, her laughter carrying above the clink of glasses in the Dining Room. The contradiction scratched at Eleanor’s composure. She knelt beside Beatrice, the cold seeping through her skirt, and studied the slack features, the absence where animation had been only hours before. In that moment, Eleanor knew with a certainty that went beyond logic: the clock lied.

As Eleanor rose, her eyes drifted to the lobby clock once more. Its hands pointed unmistakably to eight PM, the brass numerals catching the dim morning light. She paused, noting aloud, "The clock shows eight. But that cannot be right."

A hush fell as the first of the morning guests entered, their voices faltering at the threshold. The lobby, usually alive with the rustle of newspapers and the scent of coffee, felt suspended—caught between the routine of springtime and the rupture of violence. Eleanor pressed her gloved hand to Beatrice’s wrist, already knowing what she would not find. The skin was cool, the pulse absent. She straightened, her posture taut with the knowledge that she was now the axis around which the room would turn. She was no stranger to calamity—her work as a travel writer had brought her to the edges of war and want—but this demanded a steadiness of a different order.

A movement at the periphery drew her attention. Hugo Vane, the artist in residence, hovered near the reception desk, his hands shoved deep into the pockets of his rumpled jacket. His gaze darted from the clock to Beatrice, then away, as if the sight scorched him. Hugo’s reputation for eccentricity preceded him, but this morning, his pallor and the tremor in his voice betrayed something rawer. "I—I only came down for the post," he murmured, not meeting Eleanor’s eyes. "I didn’t expect—" The sentence trailed off, unfinished, as Hugo’s fingers fumbled with the edge of a telegram. Eleanor noted the eagerness with which he tried to distance himself from Beatrice, a performance of detachment that rang oddly in the charged silence.

Eleanor’s gaze lingered on the clock. Its mechanical face gleamed beneath the lobby’s dim light, the brass hands unmoving. She remembered the previous evening’s confusion—guests adrift after dinner, the hotel radio crackling with news from the continent, the faint aroma of damp earth rising through the open windows. Yet here was the clock, insistent and unyielding, declaring eight as the hour of tragedy. Eleanor’s intuition, honed by years of observing the small betrayals of human nature, whispered that the truth was more complicated. Two sources of evidence—the clock and her own recollection—stood at odds, and the gap between them was wide enough for murder.

A constable, summoned by a trembling hand at the telephone, entered the lobby, boots squeaking against the wet marble. He spoke in low tones to Captain Ivor Hale, who had materialized with military precision, his navy suit immaculate despite the hour. The Captain’s jaw was set, his eyes flicking to Eleanor with a mixture of expectation and unease. It was clear to all present—by posture, by the hush that followed her movements—that Eleanor Voss was the one to whom the room now deferred. She felt the weight of their silent hope and suspicion settle on her shoulders.

The lobby’s grand chandelier cast fractured patterns across the walls, light splintering on the beads scattered around Beatrice’s body. Eleanor rose, smoothing her skirt with a practiced hand. She addressed the room, her voice steady but edged with the authority of someone accustomed to extracting order from chaos. "No one is to leave. The truth is here, somewhere between the clock and what we remember. Until we find it, we are all bound to this moment." The words hung in the air, as heavy as the scent of rain and the knowledge that the world outside, for all its springtime promise, could not touch the cold reality within these walls.

Hugo Vane lingered by the desk, shoulders hunched, his eyes fixed on a spot just beyond Beatrice’s outstretched hand. Eleanor watched him, noting the way he gripped the telegram as if it might anchor him to the present. She had seen that kind of desperate stillness before—in soldiers returned from the front, in refugees clinging to a scrap of normalcy. It was not guilt, precisely, but a terror of being seen. Eleanor filed the observation away. The investigation had begun, and the first contradiction—the clock’s silent testimony—would be her starting point.

Outside, the rain resumed, drumming softly against the windows. The lobby remained suspended in its uneasy spring, the air thick with unspoken questions. Eleanor Voss, travel writer and now reluctant detective, squared her shoulders and prepared to ask the first of many.
--- END PRIOR CHAPTER 1 ---

[SCENE COMPLETENESS CONTRACTS — MANDATORY. Each contract below lists what you MUST enact in that chapter. Do not summarise or mention these labels in the prose — enact them organically.]
Chapter 2 (Act 1) completeness contract:
  PIVOT ELEMENT (MANDATORY — write this into the prose, shown not told): "The clock showing eight PM while witnesses claim different times"
  FACT ESTABLISHED (MANDATORY — reader must know this by chapter end): "Establishes a contradiction in the timeline of events surrounding the murder."

# Case Overview
Title: The Clock's Deception
Era: 1940s
Setting: A grand, art deco seaside hotel
Crime: murder (mechanical clock-tampering)
Culprit: Hugo Vane
Victim: Beatrice Quill
False assumption: The murder occurred at the time shown on the clock in the lobby.
Cast: Eleanor Voss (she/her), Dr. Mallory Finch (she/her), Captain Ivor Hale (he/him), Beatrice Quill (she/her), Sylvia Trent (she/her), Hugo Vane (he/him)

Setting Lock: Keep all scenes and descriptions consistent with the stated setting (A grand, art deco seaside hotel). Do not introduce a different location type. Do not invent an alternative estate name. The only permitted name for this property is "A grand, art deco seaside hotel" — any other estate name (e.g., "Caldwell Manor", "Ashwood Hall", or any invented proper name) is a continuity error that will be caught and rejected.

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
    "title": "Contradictory Times",
    "setting": {
      "location": "the hotel lobby",
      "timeOfDay": "Morning after the murder",
      "atmosphere": "Growing tension amongst the guests"
    },
    "characters": [
      "Eleanor Voss",
      "Beatrice Quill",
      "Dr. Mallory Finch",
      "Captain Ivor Hale"
    ],
    "purpose": "Establish contradictions surrounding the time of death",
    "cluesRevealed": [
      "clue_mechanism_visibility_core",
      "clue_core_contradiction_chain"
    ],
    "dramaticElements": {
      "conflict": "Arguments arise over the clock's accuracy",
      "tension": "Inconsistencies in witness statements",
      "microMomentBeats": [
        "Eleanor glances at the clock, the ticking feeling ominous as she senses something is off."
      ]
    },
    "summary": "As the guests gather in the lobby, Eleanor examines the clock, which shows eight PM. Beatrice insists she saw Hugo Vane alive at eight twenty. Tension escalates when Dr. Mallory Finch and Captain Ivor Hale argue about the clock's reliability, revealing conflicting accounts.",
    "beat": "crime",
    "estimatedWordCount": 1250,
    "pivotElement": "The clock showing eight PM while witnesses claim different times",
    "factEstablished": "Establishes a contradiction in the timeline of events surrounding the murder.",
    "permittedBehavioursByAct": [
      {
        "characterName": "Eleanor Voss",
        "behaviour": "Show normal social behaviour; grief or confusion if appropriate."
      },
      {
        "characterName": "Beatrice Quill",
        "behaviour": "Show normal social behaviour; grief or confusion if appropriate."
      },
      {
        "characterName": "Dr. Mallory Finch",
        "behaviour": "Show normal social behaviour; grief or confusion if appropriate."
      },
      {
        "characterName": "Captain Ivor Hale",
        "behaviour": "Show normal social behaviour; grief or confusion if appropriate."
      }
    ],
    "redHerringPlacement": null,
    "emotionalRegister": "The investigation begins, uncovering initial clues that lead to false assumptions.",
    "dominantCharacterNote": {
      "name": "Eleanor Voss",
      "voiceRegister": "Eleanor speaks with a rhythmic charm, often weaving anecdotes into her conversations, tinged with playful sarcasm."
    },
    "humourGuidance": {
      "permission": "permitted",
      "character": "Eleanor Voss",
      "form": "dry_wit"
    },
    "eraTextureNote": "Rationing limits access to certain goods and services.; Transportation is restricted due to fuel shortages.; Communication is slow, with news traveling primarily by radio and print.; Curfews are still in effect in some areas, limiting nighttime activities.; Military presence influences the social climate, creating an air of vigilance.",
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
□ Allowed seasonal words only: spring, vernal, springtime.
□ Forbidden seasonal words: summer, autumn, winter.
□ Chapter 2: the clue [clue_core_contradiction_chain] (clock, must, tampered, creating, false, time, death) is placed in the first 25% of the chapter, dramatized in your own words, followed by an explicit inference or suspicion paragraph.
□ Chapter 2: the clue [clue_mechanism_visibility_core] (mechanical, clock, deliberately, rewound, mislead, investigators, time, death, creating, false, timeline) is placed in the first 25% of the chapter, dramatized in your own words, followed by an explicit inference or suspicion paragraph.
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
