# Actual Prompt Record

- Run ID: `mystery-1784235178238`
- Project ID: ``
- Timestamp: `2026-07-16T21:00:44.953Z`
- Agent: `Agent9-ProseGenerator-Ch2`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4.1`
- Temperature: `0.42`
- Max Tokens: `4500`
- Attempt: `first`
- Prompt Hash: `7bacd0c8a220565c`

## Message 1 (role=system)

```text
NARRATIVE VOICE: Eleanor Voss[SHE] is the viewpoint character. Unanchored “she/her” or “he/him” without a nearby name refers to Eleanor Voss. Default narrator pronoun: SHE. Never default to “he/his” as the neutral narrator voice unless the POV character is male.

You are an expert prose writer for classic mystery fiction. Your role is to write compelling, atmospheric narrative chapters that read like a professionally published novel.

⛔ ABSOLUTE RULE — CHARACTER NAMES:
The ONLY characters who exist in this story are: Eleanor Voss (woman), Dr. Mallory Finch (woman), Captain Ivor Hale (man), Beatrice Quill (woman), Sylvia Trent (woman), Hugo Vane (man) — DECEASED, past-tense only.
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
- MORAL COMPLEXITY REQUIREMENT: The mechanism of this crime carries a moral gray area: "The murderer acted out of a misguided sense of justice, believing the victim deserved their fate." — the culprit reveal and denouement MUST acknowledge this ambiguity. Do not let the ending feel clean or simple. Give the reader at least one moment of uncomfortable sympathy or moral doubt.

- CHAPTER OPENING (every chapter, lint-enforced): never open on a tour or inventory of named rooms/places. The first sentence must land a character ACTION, a specific sensory detail, or a concrete in-scene moment — not "In the [room], the [room], and the [room]…". Locations enter through what a character does in them, one at a time.
- VICTIM IDENTITY & OPENING HOOK (ROADMAP_TO_80 M2): The murder victim is Hugo Vane. Name them — Hugo Vane — in the FIRST PARAGRAPH; never open with "the victim" or "the body". Open IN MEDIAS RES: the first one or two sentences must land the discovery and the single unsettling CONTRADICTION (the impossible detail that starts the case), seen through the investigator's eyes. Weave sensory and atmosphere detail AROUND that hook — do NOT precede the stakes with a standalone scene-setting/weather preamble. They are found dead — they do not speak, react, or gesture. This is their only physical appearance in the story.

⚠️ AMATEUR DETECTIVE STORY: The investigator is a civilian with no official standing. The official police (if they appear) are unnamed background figures only — "a constable", "the sergeant", "an officer from the village". Do NOT give any police official a name or title+surname combination. There is no Inspector [Surname], no Constable [Surname], no Sergeant [Surname] in this story.


CRITICAL CHARACTER CONSISTENCY RULES:

1. Each character has ONE canonical name. Use ONLY names from this list. Never vary, abbreviate, or add titles beyond what is listed.
   COMPLETE CAST (no other named characters exist): Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill, Sylvia Trent, Hugo Vane (DECEASED)
   - "Mr. Jennings entered the room" → ILLEGAL. Jennings is not in the cast.
   - "Constable Reed took notes" → ILLEGAL. Reed is not in the cast.
   - "A constable took notes" → LEGAL (no name given).

2. Character roles are fixed:
   - Eleanor Voss: Amateur Sleuth / Civilian Investigator
   - Dr. Mallory Finch: Professional Rival
   - Captain Ivor Hale: Outsider
   - Beatrice Quill: Bystander with Knowledge
   - Sylvia Trent: Ambitious Rival
   - Hugo Vane: victim (DECEASED — does not appear in any scene, past tense only)
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

## Era: 1947-03
Living in March 1947, the aftermath of World War II continues to shape societal dynamics, especially in coastal towns like Cannes. The air is thick with the scent of rain-soaked earth, and the dampness mingles with the salty sea breeze. People are cautiously optimistic, yet the shadow of the recent past looms large, creating an ambiance of uncertainty. The local economy is slowly recovering, but inflation is creeping in, affecting daily life. Social gatherings are filled with hushed conversations about rising crime rates and the lingering trauma of war, making every interaction feel charged with tension. As the community prepares for spring, the spirit of resilience mingles with a collective anxiety, as the world grapples with the changes brought on by the war.
Emotional register: A dominant sense of anxiety and caution permeates everyday life.
Physical constraints: Limited transportation options due to post-war recovery | Rationing affecting availability of goods | Communication disruptions during storms
Current tensions (weave into background texture): Labor strikes demanding better wages | Increased Cold War tensions affecting Europe | Rising crime rates causing anxiety among locals
Wartime context — Many veterans are returning home, struggling to reintegrate into society.: The societal fabric is woven with the threads of resilience and lingering trauma. Absence effect: Families feel the impact of lost loved ones and the emotional strain of war.

## Story Theme
In a world of shifting loyalties and hidden motives, the fragility of human relationships is exposed through the lens of a murder investigation, and reveals that evidence carries ethical weight, forcing characters to choose accountability over social performance when appearances and facts collide.

## Story Emotional Register
Dominant: The emotional character of the story is one of anxiety and tension, underscored by a search for truth amidst chaos.

Arc:
The story begins in a grand seaside hotel, where the atmosphere is thick with both opulence and unease, as the recent murder of Hugo Vane casts a long shadow over the attendees. As Detective Eleanor Voss steps into this world, her determination to uncover the truth is palpable, but so is the emotional cost of revisiting her past failures. Initial investigations yield clues that lead to false assumptions, creating a rising sense of dread as the suspects’ hidden motives unfold against the backdrop of growing tension. As Eleanor encounters the various suspects, her pursuit of justice becomes entwined with her own personal stakes, leading to a pivotal moment where a crucial piece of evidence shifts her direction entirely. This revelation recontextualizes earlier interactions, forcing her to confront the complexities of human ambition and jealousy. With pressure mounting, the climax builds as she navigates confrontations, revealing the intricate web of deceit that surrounds her. Ultimately, the resolution comes at a significant emotional cost, as each character grapples with the fallout of their actions, leaving Eleanor to reflect on the fragility of relationships and the heavy burden of truth.

The story opens: The atmosphere is tense and foreboding, setting the stage for a murder mystery. As the investigation takes shape: Eleanor feels the weight of her past failures, intensifying her drive for justice. A first key turn arrives: A false lead creates anxiety, pushing Eleanor into a deeper investigation. At the mid-point of the story: A significant revelation alters the course of the investigation.

A second pivot reshapes the course: The stakes rise as personal motives are revealed, complicating relationships. As tension reaches its height: Tension reaches a peak, culminating in confrontations fueled by hidden truths. The climax brings the central question to a head: The culmination of pressures leads to a.

## Emotional register at this point in the story
The atmosphere is tense and foreboding, setting the stage for a murder mystery.

## Character Portraits (appearance & era)

### Eleanor Voss
Eleanor Voss navigates the complexities of a post-war society, her role as a journalist thrusting her into the heart of tensions surrounding crime and recovery. She embodies the struggles of women re-entering the workforce and balancing personal ambitions with familial obligations, making her a relatable figure in this transformative era.
Era intersection: As a woman striving for independence in a male-dominated field, Eleanor represents the shifting gender dynamics of the late 1940s.

### Dr. Mallory Finch
Dr. Mallory Finch's career-driven ambition reflects the growing opportunities for women in medicine post-war. However, her envy over her colleague's success illustrates the personal costs of professional rivalry, mirroring the broader societal struggles of women fighting for recognition in their fields.
Era intersection: Her escalating stress mirrors the pressure women face to excel in their careers amidst societal expectations.

### Captain Ivor Hale
Captain Hale's philanthropic efforts to support veterans highlight the ongoing battle for recognition and support faced by those who served in the war. His internal struggles with PTSD resonate with the collective trauma of a society attempting to heal from the scars of conflict.
Era intersection: Hale's efforts to aid veterans reflect the broader social movement to address the needs of returning soldiers.

### Beatrice Quill
Beatrice Quill's position as a hotel concierge places her at the intersection of service and social dynamics, showcasing the evolving roles of women in hospitality. Her hidden resentments highlight the personal conflicts that arise in a competitive environment, mirroring the societal pressures of the time.
Era intersection: Her charm and ambition reflect the newfound opportunities women are seizing in post-war society.

## Character Voices

### Eleanor Voss (she/her/her)
Eleanor speaks in a measured, articulate manner, often laced with irony.
[comfortable] Well, isn’t that just delightful? Sometimes the truth is stranger than fiction.
[evasive] I suppose it’s all about perspective, isn’t it? What does it matter, really?
[stressed] Time is running out, and I’m afraid the clock isn’t on our side.
Humour: Her dry wit often lightens tense moments.

### Dr. Mallory Finch (she/her/her)
Dr. Finch's voice is precise, often filled with sarcasm that underscores her intelligence.
[comfortable] Oh, the irony of it all; isn’t life just full of surprises?
[evasive] I’d rather not dwell on the past; it’s not particularly enlightening.
[stressed] Every moment counts, and I’m afraid I’m not the only one who feels that pressure.
Humour: Her polite savagery often reveals her true feelings.

### Captain Ivor Hale (he/him/his)
Captain Hale’s voice is steady and reflective, tinged with self-deprecation.
[comfortable] It’s all in the service, isn’t it? Duty comes first.
[evasive] Let’s just say I prefer to keep my past in the past.
[stressed] I can’t shake the feeling that the storm is closing in.
Humour: His self-deprecating humor reveals his inner struggles.

### Beatrice Quill (she/her/her)
Beatrice’s voice is light and engaging, often layered with playful banter.
[comfortable] Well, that’s just the way the cookie crumbles, isn’t it?
[evasive] I wouldn’t worry too much about that; it’s all in the past.
[stressed] I just need to keep everything under wraps—no pressure, right?
Humour: Her observational humor adds charm to her character.

## Location Registers (scene framing guides)

Oceanfront Balcony: Standing on the Oceanfront Balcony, a sense of dread permeates the air. The stormy sea below mirrors the turmoil of the investigation, each crashing wave echoing the tension among the guests. The balcony, once a place of respite, now feels like the precipice of danger, where secrets linger like the salty mist.. Camera angle: As a writer enters this space, the emotional weight of the scene becomes palpable, urging a deeper exploration of underlying motives.. Era: The balcony is an eerie reminder of the stormy weather typical of coastal climates in March.

The Reading Room: The Reading Room envelops visitors in a comforting yet tense atmosphere, filled with the scent of old leather and the warmth of a crackling fire. Here, whispered conversations blend with the soft rustle of pages, creating a sanctuary where secrets and suspicions intertwine, hinting at the hidden narratives waiting to unfold.. Camera angle: Entering this space invites a reflective exploration of the characters' inner conflicts, as the ambiance fosters both comfort and tension.. Era: The room's charm contrasts with the post-war anxieties felt by many in the community.

The Grand Dining Room: The Grand Dining Room buzzes with a festive energy, yet an undercurrent of anxiety permeates the air. The lavish surroundings stand in stark contrast to the tension of recent crimes, as guests engage in polite conversation while casting furtive glances. The setting becomes a microcosm of social dynamics, where appearances mask deeper rivalries and secrets.. Camera angle: As a writer steps into this room, the vibrant yet strained atmosphere invites an exploration of the delicate balance between celebration and unease.. Era: The opulence of the dining room reflects the recovering economy, where the wealthy gather amidst the shadows of insecurity.

## Humour guidance for this story position (opening)
Permission: forbidden
Rationale: The mood is too tense to permit humor.

FAIR-PLAY AND INFERENCE CONTRACT:
- FAIR PLAY CLUE TIMING: Never combine clue discovery and detective deduction in the same chapter. If a clue is first revealed to the reader in chapter N, the detective may only analyze, deduce from, or act on that clue in chapter N+1 or later.
- FAIR PLAY INFORMATION PARITY: The reader must see all clues BEFORE the detective uses them in reasoning. If the detective performs a test or makes a deduction, every piece of evidence supporting that conclusion must have been shown to the reader in earlier chapters.
- FAIR PLAY REVELATION SPACING: In the discriminating test scene, the detective can ONLY use clues that were revealed to the reader at least 1 full chapter earlier. Never introduce new clues or withheld information during the test.
- FAIR PLAY CONFRONTATION: During the final confrontation/revelation, the detective cannot surprise the reader with facts. Every piece of evidence cited must have been visible to the reader in prior chapters.
- Never solve by withheld information. Keep reader-information parity with detective reasoning.
- False assumption in force: Hugo Vane was murdered shortly before dinner, as indicated by the clock.
- Hidden truth to progressively expose (compose in your own words from these elements): clock, tampered, hide, true, time, death
- Inference path checkpoints to dramatize clearly — compose ENTIRELY in your own sentences from these key terms (reproducing any briefing phrase verbatim FAILS validation):
  - Step 1: obs: clock, hugo, room, shows, minutes, past, nine, despite, dinner, starting, half, eight | corr: clock, tampered, mislead, time, death | effect: narrows, suspicion, towards, possibility, deliberate, tampering
  - Step 2: obs: handkerchief, hugo, blood, near, rewound, clock | corr: handkerchief, location, indicates, struggle, occurred, near, clock | effect: eliminates, idea, hugo, killed, elsewhere
  - Step 3: obs: witnesses, report, hearing, ticking, sound, shortly, before, body, discovered | corr: ticking, sound, implies, clock, recently, tampered | effect: narrows, time, frame, tampering, shortly, before, body
- Discriminating test method: trap
- Discriminating test elements to dramatize (compose ENTIRELY in your own sentences from these — do NOT reproduce any briefing phrase verbatim): eleanor, voss, compare, clock, tampering, alibis, suspects, dinner
- Test must rely on already-shown clue IDs: clue_core_contradiction_chain, clue_6, clue_mechanism_visibility_core, clue_early_1
- Fair-play rationale: Step 1: The clock showing ten minutes past nine (early) and witness statements about the dinner time (mid) establish the time discrepancy. Step 2: The handkerchief location (mid) implies a struggle near the clock. Step 3: The ticking sound observation (discriminating test) identifies the tampering, linking it to the murderer.

## Character Reference

### Eleanor Voss (she/her — NEVER he/him)
Eleanor speaks in a measured tone, often punctuating her observations with a wry smile
She has a penchant for rhetorical questions and uses irony to convey her points.
Eleanor grapples with feelings of inadequacy, torn between her professional ambitions and the emotional turmoil at home.
Voice colour: Eleanor Voss uses dry wit humour — let it surface in their dialogue where natural, not in every line.

### Dr. Mallory Finch (she/her — NEVER he/him)
Finch speaks with a clinical precision, often using technical jargon that borders on obfuscation
She has a habit of inserting sarcastic remarks into her otherwise formal dialogue, revealing a sharp tongue.
Dr. Finch wrestles with the dark shadows of her ambition, fearing that her envy may lead her to ruin.
Voice colour: Dr. Mallory Finch uses polite savagery humour — let it surface in their dialogue where natural, not in every line.

### Captain Ivor Hale (he/him — NEVER she/her)
Captain Hale speaks in a slow, measured manner, often punctuating his sentences with reflective pauses
His words are laced with a heavy sense of duty, and he frequently relates back to military jargon.
Captain Hale grapples with the ghosts of his past, fearing that his PTSD will compromise his capacity to help others.

### Beatrice Quill (she/her — NEVER he/him)
Beatrice speaks with a light, airy tone, often punctuated by playful banter
She has a knack for drawing people in with her charm, yet her words can carry a subtle edge when discussing sensitive topics.
Beatrice struggles with the balance between her job security and the resentment she feels towards the victim, torn between ambition and morality.
Voice colour: Beatrice Quill uses observational humour — let it surface in their dialogue where natural, not in every line.


## CHARACTER CONTRACTS (binding for this scene)
Each entry below constrains how this character must be written in this chapter.
These override generic style guidance when they conflict.

### Eleanor Voss[SHE]
Voice & mannerisms: Eleanor speaks in a measured tone, often punctuating her observations with a wry smile. She has a penchant for rhetorical questions and uses irony to convey her points.
SIGNATURE TIC (use sparingly — this is Eleanor Voss's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "Well, isn't that just delightful?"
Sample voice fragments (match this register and rhythm):
  [comfortable] "Well, isn’t that just delightful? Sometimes the truth is stranger than fiction."
  [evasive] "I suppose it’s all about perspective, isn’t it? What does it matter, really?"
Humour: dry wit — deploy occasionally (level 0.5)
FORBIDDEN phrase (never write for Eleanor Voss): "a surge of determination washed over her"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Drawn to investigate her friend’s suspicious death while visiting the hotel to cover a story." — do not surface in Act I.

### Dr. Mallory Finch[SHE]
Voice & mannerisms: Dr. Finch speaks with a clinical precision, often using technical jargon that borders on obfuscation. She has a habit of inserting sarcastic remarks into her otherwise formal dialogue, revealing a sharp tongue.
SIGNATURE TIC (use sparingly — this is Dr. Mallory Finch's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "Oh, the irony of it all."
Sample voice fragments (match this register and rhythm):
  [comfortable] "Oh, the irony of it all; isn’t life just full of surprises?"
  [evasive] "I’d rather not dwell on the past; it’s not particularly enlightening."
Humour: polite savagery — deploy occasionally (level 0.4)
FORBIDDEN phrase (never write for Dr. Mallory Finch): "she felt a wave of unease"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Dr. Finch feared losing a prestigious grant that was promised to the victim." — do not surface in Act I.

### Captain Ivor Hale[HE]
Voice & mannerisms: Captain Hale speaks in a slow, measured manner, often punctuating his sentences with reflective pauses. His words are laced with a heavy sense of duty, and he frequently relates back to military jargon.
SIGNATURE TIC (use sparingly — this is Captain Ivor Hale's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "It's all in the service, isn't it?"
Sample voice fragments (match this register and rhythm):
  [comfortable] "It’s all in the service, isn’t it? Duty comes first."
  [evasive] "Let’s just say I prefer to keep my past in the past."
Humour: self deprecating — deploy rarely (level 0.3)
FORBIDDEN phrase (never write for Captain Ivor Hale): "she knew with certainty she was right"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Believed the victim was undermining his efforts to fund veterans' programs." — do not surface in Act I.

### Beatrice Quill[SHE]
Voice & mannerisms: Beatrice speaks with a light, airy tone, often punctuated by playful banter. She has a knack for drawing people in with her charm, yet her words can carry a subtle edge when discussing sensitive topics.
SIGNATURE TIC (use sparingly — this is Beatrice Quill's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "Well, that's just the way the cookie crumbles."
Sample voice fragments (match this register and rhythm):
  [comfortable] "Well, that’s just the way the cookie crumbles, isn’t it?"
  [evasive] "I wouldn’t worry too much about that; it’s all in the past."
Humour: observational — deploy occasionally (level 0.4)
FORBIDDEN phrase (never write for Beatrice Quill): "everyone could sense the atmosphere"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Was in a secret relationship with a colleague who got rejected by the victim." — do not surface in Act I.



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
A grand seaside hotel built in the early 1900s, boasting Art Deco architecture and sweeping views of the tumultuous ocean.

Key Locations Available:
- Oceanfront Balcony (exterior): Crime scene
- The Reading Room (interior): Gathering space
- The Grand Dining Room (interior): Gathering space

Atmosphere (tonal cue only — do NOT reproduce this phrase verbatim in prose; translate into scene-specific, character-observed sensory language): tense and anxious due to recent local crime reports and the shadow of war
Weather: overcast with occasional rain, typical of coastal climates

Era markers: radio broadcasting the latest war news | early television sets flickering in guest rooms | rationed wartime vehicles parked outside | elegant dresses reflecting post-war recovery

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
Oceanfront Balcony (exterior):
  - Visual: dark waves crashing below, glistening rain on tiles, flickering lights from the hotel
  - Sounds: howling wind, crashing waves, distant thunder
  - Scents: fresh rain on stone, seaweed and salt, wet earth
  - Touch: cold metal railing, wet tiles underfoot

The Reading Room (interior):
  - Visual: shelves lined with dusty tomes, ornate chandeliers casting warm light, dark green drapes framing tall windows
  - Sounds: soft rustling of pages, crackling fire, muffled laughter from guests
  - Scents: old leather and parchment, smoky wood from the fireplace, freshly brewed tea
  - Touch: soft velvet upholstery, smooth leather bindings

The Grand Dining Room (interior):
  - Visual: gleaming silverware and crystal glassware, elegant floral centerpieces, large windows framing the stormy sea
  - Sounds: clinking of cutlery, murmurs of conversation, soft piano music playing
  - Scents: scent of roasted meats, freshly baked bread, aroma of rich sauces
  - Touch: smoothness of polished wood tables, coolness of crystal glassware

⛔ REFERENCE DATA — DO NOT TRANSCRIBE VERBATIM: The above profiles are structural guides only. Generate original prose that evokes these qualities; do not reproduce the exact phrasing or sentence structure of the profile paragraphs.

SCENE OPENING RULE: When opening a scene in a new location, write what the POV character directly observes and physically senses at that moment — not a general description of the room's qualities. The reader must feel present, not briefed. Sensory details must be observed by the character, not stated as fact about the place.

SENSORY WR
[truncated for prompt budget]

## Texture Pool
Draw on these as opportunities arise — you are not required to use them.

- Living in March 1947, the aftermath of World War II continues to shape societal dynamics, especially in coastal towns like Cannes
- The air is thick with the scent of rain-soaked earth, and the dampness mingles with the salty sea breeze
- People are cautiously optimistic, yet the shadow of the recent past looms large, creating an ambiance of uncertainty
- The local economy is slowly recovering, but inflation is creeping in, affecting daily life
- Social gatherings are filled with hushed conversations about rising crime rates and the lingering trauma of war, making every interaction feel charged with tension

TEMPORAL CONTEXT:

This story takes place in March 1947 during spring.

Seasonal Atmosphere:
- Weather patterns: overcast with occasional rain, cool coastal breezes, mild temperatures ranging from 45°F to 55°F
- Daylight: Days are getting longer, with sunset around 6:30 PM, allowing for longer evening gatherings.
- Seasonal activities: spring cleaning in homes, preparation for Easter celebrations, attending local theater productions
- Seasonal occasions: St. Patrick's Day (March 17)
- Season: spring

Period Fashion (describe naturally):
- Men formal: navy blue wool suit, white dress shirt with a narrow tie, black leather dress shoes
- Men casual: tweed jacket with elbow patches, lightweight cotton trousers, button-up cardigan
- Men accessories: fedora hat, leather gloves, silver pocket watch
- Women formal: tea-length dress with a fitted bodice and flared skirt, satin gloves, pearl necklace
- Women casual: blouse with a floral print, high-waisted A-line skirt, cardigan sweater
- Women accessories: cloche hat, fabric handbag, vintage brooch

Cultural Context (reference naturally):
- Music/entertainment: Bing Crosby - 'White Christmas', Doris Day - 'Sentimental Journey', Frank Sinatra - 'I'll Be Seeing You'; Films: 'The Best Years of Our Lives', 'Gentleman's Agreement'; Theatre: 'A Streetcar Named Desire', 'The Glass Menagerie'; Radio: 'The Shadow', 'Suspense'
- Typical prices: Loaf of bread: four pence, Movie ticket: one shilling, Bottle of milk: five pence
- Current events: labor strikes in various industries as workers demand better wages; increased tensions in Eastern Europe as the Iron Curtain descends
- Literature: 'The Catcher in the Rye' by J.D. Salinger | 'The Plague' by Albert Camus | 'The Naked and the Dead' by Norman Mailer | [post-war fiction] | [mystery] | [science fiction]
- Technology: transistor radios | first commercially available TV sets | improvements in radar technology | vacuum cleaners | electric washing machines | automobiles with automatic transmissions
- Daily life: attending community events, participating in bingo nights, visiting local parks for picnics
- Social rituals: Sunday family dinners, visiting friends for tea, neighborhood watch meetings due to recent crime concerns

Atmospheric Details:
The damp air carries the scent of rain-soaked earth, mingled with hints of blooming flowers from nearby gardens. The faint sound of jazz wafts through the hotel lobby, creating an ambiance of nostalgia and longing. A sense of unease lingers in the atmosphere, punctuated by whispers about the recent crime wave that has unsettled the community.

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
- Class indicators: Aristocrats discuss opera, servants discuss musi
[truncated for prompt budget]

NON-NEGOTIABLE CHAPTER OBLIGATIONS — LOCKED EVIDENCE VALUES (VERBATIM REQUIRED):
The following measured values (times, amounts, measurements) are absolute ground truth. Every time this chapter describes, mentions, or alludes to one — no matter how briefly — it MUST use the exact phrase shown below, character for character. NO paraphrase, approximation, rounding, or synonym is permitted.

FAILURE EXAMPLE: if the locked value is "at thirteen minutes to midnight" and you write "just before midnight" or "around midnight" — that is a HARD FAIL. You must write "at thirteen minutes to midnight". Equally, if the locked value is written in words, such as "ten minutes past eleven", and you convert it to figure-based clock notation — that is also a HARD FAIL. Words stay as words; figure forms are forbidden for word-phrased facts.

CRITICAL — WORD-PHRASED VALUES: If the canonical value is written out in words (e.g. a time like "ten minutes past eleven", or an amount like "forty minutes"), reproduce those exact words. DO NOT convert to figure-based time notation, twenty-four-hour format, or any other numeric shorthand. Correct: "ten minutes past eleven". WRONG: figure-based clock notation or numeric shorthand.

Locked values:
  - The time displayed on the tampered clock at the moment of discovery.: "ten minutes past nine"
    ⛔ FORBIDDEN alternatives: "9:10", "9.10", "nine ten", "nine-ten", "nine past ten", "quarter past nine", "half past nine" — the ONLY acceptable form is "ten minutes past nine"
  - The actual start time of the dinner event, conflicting with the clock's display.: "half past eight"
    ⛔ FORBIDDEN alternatives: "8:30", "8.30", "eight thirty", "eight-thirty", "eight past thirty", "quarter past eight" — the ONLY acceptable form is "half past eight"

If a value has no relevance to this chapter, omit it. But the moment you reference the underlying evidence, only the exact phrase above is acceptable.

⚠ CENTRAL CONTRADICTION (the heart of the mystery): the two locked values "ten minutes past nine" and "half past eight" are NOT two separate facts — they are ONE contradiction (one is a staged appearance, the other the true state; the evidence determines which). If this chapter references both, you MUST present them AS A SINGLE CONTRAST joined by a contrast connective (but / yet / however / could only / whereas) — e.g. "the watch showed the one time, yet the evidence proved it could only have been the other" — making clear which reading is the appearance and which is the truth. NEVER state them as two flat, side-by-side truths — that makes the central clue read as if it contradicts itself.

⛔ CLUES TO SURFACE IN THESE CHAPTERS — mandatory:
The following evidence MUST be clearly observable to an attentive reader. Do not bury it in atmosphere or passing dialogue. Each clue must be concrete, specific, and noticeable:

• [clue_mechanism_visibility_core] clock, rewound, misrepresent, time, death
  Category: temporal | Criticality: essential | Supports inference step 1
  Points to: clock, tampered, mislead, time, death

• [clue_core_contradiction_chain] clock, tampered, mislead, time, death
  Category: temporal | Criticality: essential | Supports inference step 1
  Points to: clock, tampering, indicates, deliberate, attempt, mislead

For each clue above: an attentive reader should be able to find, record, and later use it to reason toward the solution.

═══ NARRATIVE STATE (read-only — do not contradict) ═══

LOCKED FACTS — use verbatim whenever this evidence is described:
  • The time displayed on the tampered clock at the moment of discovery.: "ten minutes past nine"
  • The actual start time of the dinner event, conflicting with the clock's display.: "half past eight"

CHARACTER PRONOUNS — never deviate from these:
  • Eleanor Voss: she/her/her
  • Dr. Mallory Finch: she/her/her
  • Captain Ivor Hale: he/him/his
  • Beatrice Quill: she/her/her
  • Sylvia Trent: she/her/her
  • Hugo Vane: he/him/his

CLUES ALREADY REVEALED TO READER: clue_early_1, clue_mid_2, clue_late_1 — do not reveal these as new information.

INVESTIGATION LOG — WHAT IS ESTABLISHED (do not re-establish, do not repeat):
• Evidence already established (reference only — do NOT restate or quote these; advance beyond them): clock, tampered, mislead, time, death | handkerchief, location, suggests, violent, encounter | struggle, location, provides, insight, events, leading
• Suspect cleared: Captain Ivor Hale[HE] — Witnesses confirm he was at the bar during the time of death
• Suspect cleared: Beatrice Quill[SHE] — Evidence shows she was not in the vicinity at the time
• Suspect cleared: Sylvia Trent[SHE] — Alibi confirmed: 8:45 PM - 9:15 PM
⚠ The story must move FORWARD from this log. Any beat already listed above is forbidden from repeating.

⚠ THIS CHAPTER'S REQUIRED ADVANCE (opening): Discover the body, confirm the victim, establish the scene. The victim is found dead. They do not speak, react, or gesture. This is their only physical appearance — in all subsequent chapters they exist only in past tense (memory, evidence, testimony).

CONTINUITY HANDOFF — previous chapter closing beat:
  • "As the others drifted back to the corridor, Eleanor lingered, her gaze fixed on the bloodied handkerchief and the silent clock. The morning had brought no clarity, only questions. Yet beneath the surface, the first threads of the truth had begun to unravel. Sh..."
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
corridor

✓ RULE: Continue using this location vocabulary. Maintain consistency with established setting type.
✓ Do NOT introduce new location types that contradict earlier chapters.

**Recent Chapter Summary (for narrative continuity):**
Chapter 1: Chapter 1: The Frozen Clock
  Events: The hush in Hugo Vane's hotel room was broken only by the distant crash of waves and the faint rattle of rain against the windowpane.

⚠️ **VALIDATION:** Character name mismatches and setting drift are common failure modes.
Double-check every character name against the list above before using it.

**⏱ LOCKED TIME ANCHOR — use verbatim, do not paraphrase:**
Clock time (from the case ground truth): **"Dinner started at half past eight"**
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
Known location profile anchors: The Grand Seaside Hotel, Oceanfront Balcony, The Reading Room, The Grand Dining Room, Hugo Vane's hotel room
LOCATION NAME CAPITALISATION (HARD REQUIREMENT — validated):
All named locations in your prose MUST use the EXACT capitalisation from the CML profiles.
Canonical forms: "The Grand Seaside Hotel", "Oceanfront Balcony", "The Reading Room", "The Grand Dining Room", "Hugo Vane's hotel room"
Writing a location in lowercase (e.g. "drawing room" instead of "Drawing Room") is a validated error. Every time you mention a named location, copy its capitalisation from the list above.
- Chapter 2: OPENING STYLE (HARD): Start the VERY FIRST SENTENCE with spoken dialogue — e.g. '"[words]," [Name] said/asked/replied/murmured.' The opening quote must be the first character on the line. Anchor opening in "Hugo Vane's hotel room". The opening style above governs only your FIRST SENTENCE; the grounding below may land anywhere in the first 2 paragraphs (it need not be sentence one, and never conflicts with the chosen opening style). HARD REQUIREMENT for the first 2 paragraphs: (a) include 2+ sensory words — choose from smell/scent/odor/fragrance/sound/echo/silence/whisper/creak/cold/warm/damp/rough/smooth/glow/shadow/flicker/dim — and (b) include 1+ atmosphere/time word — choose from rain/wind/fog/storm/mist/thunder/evening/morning/night/dawn/dusk/lighting/weather/season/afternoon/midday/noon/midnight/twilight/sunrise/sunset/daylight/sunlight/overcast/cloudy/bright/dark/grey/pale/chill/crisp/drizzle/haze/lamplight/firelight. These are validated requirements, not style suggestions; missing them triggers a retry.

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

PROMPT BUDGET SUMMARY: budget=24000 tokens; fixed=9263; context=11884; dropped=[none]; truncated=[location_profiles, temporal_context, pronoun_accuracy]

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
4. Integrate at least two concrete era-grounded details per chapter from setting refinement signals: radio broadcasting | early television sets | military radar equipment | ballistic analysis tools | long-distance telephone calls | military-style encrypted messages.
5. Respect setting movement/access constraints in scene action and alibis: narrow hallways limiting movement | restricted access to staff-only areas | oceanfront balcony with limited access points | staff-only areas require keycard access | guest areas monitored by reception.
6. Sustain social coherence with this backdrop pressure: A tense gathering at a grand seaside hotel, where recent local crime reports and post-war anxieties compel a diverse group of guests and staff to navigate shifting loyalties and hidden motives.
7. Maintain continuity around these socially central cast anchors where relevant: Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill, Sylvia Trent, Hugo Vane.
8. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Moderate: Plot similarity 0.75 with 'The Second Key' (both involve poisoning and set in the 1940s)
9. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Moderate: Setting similarity 0.80 with 'The Second Key' (both set in the same era and involve hotels)
10. STORY TO DATE ANTI-COPY RULE: The STORY TO DATE section below is provided for chronological and factual reference ONLY. You MUST NOT copy, lightly rephrase, or structurally echo any sentence or paragraph from prior chapters. Every sentence in this chapter must be original prose unique to this scene. Reusing even a clause from prior chapter text will cause this attempt to fail immediately.

CRITICAL PROSE REQUIREMENTS:

The CML specifies exact requirements for certain validation-critical scenes. You MUST include these elements at the specified positions.

**Discriminating Test Scene (Act 3, Scene 4):**
Required elements: Execute the discriminating test, Observe the clock's tampering evidence, Draw conclusion about guilt

**Suspect Clearance Scenes:**
- Captain Ivor Hale (Act 3, Scene 5): Witnesses confirm he was at the bar during the time of death
  Clues: clue_early_1, clue_mid_2
- Beatrice Quill (Act 3, Scene 5): Evidence shows she was not in the vicinity at the time
  Clues: clue_mid_2, clue_late_1
- Sylvia Trent (Act 3, Scene 5): Alibi confirmed: 8:45 PM - 9:15 PM

**Culprit Revelation Scene (Act 3, Scene 6):**
Method: Confrontation with evidence linking the tampering to the culprit

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
Investigation state at start: 3 clue(s) revealed to reader; approximately 0 unresolved suspect(s).
Must change by end: Reframe prior clue meaning and update suspect implications.
Suspect pressure target(s): Captain Ivor Hale, Beatrice Quill, Dr. Mallory Finch
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
  - Scene is set in: Hugo Vane's hotel room — reference it naturally within the paragraph, never as your opening phrase.
  - Opening atmosphere (MANDATORY — validator enforced): the first paragraph MUST contain at least one of: rain / wind / fog / storm / mist / thunder / evening / morning / night / dawn / dusk / season / afternoon / midday / noon / midnight / twilight / sunrise / sunset / daylight / sunlight / overcast / cloudy / bright / dark / grey / pale / cold / warm / chill / crisp / damp / drizzle / haze / lamplight / firelight. A chapter that omits all of these from its opening paragraph will be rejected.
  - PARAGRAPH OPENER DIVERSITY (MANDATORY — validator enforced): No more than 2 paragraphs in this chapter may begin with "Eleanor" or "Eleanor's" as the first word. You must vary paragraph openings throughout: use sensory observations, another character's name or action, dialogue, object or sound details, or temporal markers. Opening 3 or more paragraphs with "Eleanor" will cause automated rejection.
  - Continuity bridge: in the first 120 words, visibly connect from the previous chapter's final beat. Carry forward one unresolved element (object, accusation, emotional pressure, or immediate physical action) from: "As the others drifted back to the corridor, Eleanor lingered, her gaze fixed on the bloodied handkerchief and the silent clock. The morning had brought no clarity, only questions. Yet beneath the surface, the first threa...".
  - CLUE OBLIGATIONS — each clue below MUST be dramatized, but in YOUR OWN WORDS:
    Render each as something a character SEES, DOES, or SAYS on the page. The bracketed text is a
    DESCRIPTION of the evidence for you — do NOT transcribe it as narration. Copying a clue's
    description sentence verbatim into the prose FAILS validation.
    • clock, shows, minutes, past, nine, despite, dinner, starting, half, eight [clue_core_contradiction_chain] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: clock, tampering, indicates, deliberate, attempt, mislead
      ↳ MANDATORY TWO-PARAGRAPH STRUCTURE (must appear in paragraphs 1 or 2 — no later):
         Paragraph 1: The POV character physically approaches or directly observes this evidence.
           The narration or dialogue explicitly states what is seen (use the exact locked phrase if one applies).
         Paragraph 2 (immediately following): The detective or POV character explicitly reasons
           about what this evidence implies — who it implicates, why it may be unreliable,
           or what inference it supports. This must be a separate full paragraph, not a sentence appended to Paragraph 1.
    • clock, room, shows, minutes, past, nine [clue_mechanism_visibility_core] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      ⛔ SPOILER EMBARGO (pre-reveal chapter): surface ONLY the surface anomaly a character can see/hear/find.
         Do NOT name who it implicates, state the tamper direction or magnitude, or explain the mechanism in this chapter.
         Present it as an unexplained discrepancy; the culprit and method are revealed later.
         Place this OBSERVATION in paragraph 1 or 2 (observation only — no inference about the culprit).
  - Tonal contrast: include at least one beat of relief or ironic counterpoint. Do not sustain maximum tension for every paragraph.
  - CLUE DISCLOSURE RULE (Stage 3/4):
    Characters may draw inferences and name partial conclusions but must NOT state the full mechanism or name the culprit directly. The detective may suspect but not confirm.
    WRONG: dialogue or narration that directly explains how the crime was committed before Stage 4.
    RIGHT: observation, physical reaction, and logical inference that leaves the mechanism just off-screen.
  - ALIBI LOCK: Dr. Mallory Finch's established alibi is "9:00 PM - 10:00 PM". Do NOT place Dr. Mallory Finch at any other location or in any other activity during the crime window. Any contradiction is a continuity error that triggers a retry.
  - TESTIMONY CONTINUITY: Dr. Mallory Finch has already made statements in earlier chapters. Any time, location, or claim attributed to Dr. Mallory Finch in THIS chapter must be consistent with those earlier statements. Do NOT introduce a new or different alibi claim — any contradiction is a continuity error.
- Locked fact phrase obligations:
  - If this batch mentions The time displayed on the tampered clock at the moment of discovery., write exactly: "ten minutes past nine".
  - If this batch mentions The actual start time of the dinner event, conflicting with the clock's display., write exactly: "half past eight".
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
Investigation state at start: 3 clue(s) revealed to reader; approximately 0 unresolved suspect(s).
Must change by end: Reframe prior clue meaning and update suspect implications.
Suspect pressure target(s): Captain Ivor Hale, Beatrice Quill, Dr. Mallory Finch
Required new information: Earlier clue gets revised meaning with explicit theory update.
Forbidden reveals at this stage: Do not introduce decisive new evidence from nowhere.

FROZEN FACT STATE (DO NOT ALTER):
- Timeline anchor: March (spring).
- Month, season, weather, and time-of-year language in this batch must stay compatible with spring.
- Established timeline fact: Dinner started at half past eight
- Established timeline fact: Body found at ten minutes past nine
- If referenced, use exact phrase: "ten minutes past nine" (The time displayed on the tampered clock at the moment of discovery.).
- If referenced, use exact phrase: "half past eight" (The actual start time of the dinner event, conflicting with the clock's display.).

STORY TO DATE (REFERENCE ONLY — DO NOT COPY VERBATIM):
- Full prior chapter text is provided below for continuity, factual consistency, and reference accuracy.
- Use this to keep character voice, chronology, clue state, and location continuity aligned with earlier chapters.
- Do not quote, copy, or paraphrase these paragraphs too closely; write fresh prose that remains consistent with them.

--- BEGIN PRIOR CHAPTER 1 ---
Title: Chapter 1: The Frozen Clock
The hush in Hugo Vane's hotel room was broken only by the distant crash of waves and the faint rattle of rain against the windowpane. Eleanor Voss stepped inside, the damp chill of the corridor clinging to her as she crossed the threshold. The air was thick with the scent of last night's storm—salt and sodden wool—and the faint, metallic tang of something more sinister. In the dim morning light, Hugo Vane's body sprawled across the patterned carpet, his head turned at an unnatural angle, eyes fixed on nothing. The ornate clock on the mantelpiece, its brass frame glinting in the grey, showed a time that seemed to mock the stillness: ten minutes past nine.

Eleanor's gaze flicked from the clock to the room's other details, her mind already assembling the fragments of this tableau. The dinner the night before had begun at half past eight, and yet here was the clock, insistent and precise, displaying ten minutes past nine. That discrepancy gnawed at her, a contradiction that refused to be tidied away by shock or sorrow. If Hugo Vane had died after dinner was meant to start, why did everything in the room feel so abruptly abandoned, as if the world had stopped for him alone? She pressed her gloved hand to her mouth, steadying herself, and forced her thoughts into order. Someone had intended this confusion—of that she was certain.

Near the foot of the clock, a handkerchief lay crumpled on the floor, its white linen marred by a vivid smear of blood. Eleanor crouched, careful not to disturb the pattern of the rug, and examined the cloth. —was unmistakable, the red stain blooming across the initials. The proximity of the handkerchief to the clock was too neat, too deliberate; it suggested not only violence, but a struggle that had unfolded mere inches from the timepiece. She noted, too, the odd angle of the clock's winding key, as if someone had been interrupted mid-task.

The implications pressed in on her. The bloodied handkerchief so close to the clock could not be mere coincidence. It spoke of a confrontation—perhaps a desperate attempt to reach for help, or to defend against an assailant. The struggle had not been distant or impersonal; it had played out here, in this confined space, beneath the relentless tick of the clock. Eleanor felt a cold certainty settle in her chest: the timepiece was not a silent witness, but an active participant in the deception.

She straightened, smoothing the creases from her skirt, and surveyed the rest of the room. The morning light was pale, filtered through rain-streaked glass, casting long shadows across the furniture. The remnants of last night's storm still lingered in the air, a reminder of the world outside—unmoved by the tragedy within. Eleanor's eyes lingered on the overturned chair near the writing desk, its velvet upholstery darkened by damp. A half-empty glass of brandy stood on the side table, untouched since the previous evening.

Footsteps echoed in the corridor, hesitant and muffled by the thick carpet. The door opened a fraction, and Dr. Mallory Finch appeared, her expression carefully composed, though her hands betrayed a faint tremor as she adjusted the cuffs of her blouse. Dr. Mallory Finch, the hotel's resident physician and a figure of authority among the guests, paused just inside the doorway. Her eyes flickered from Hugo Vane's body to Eleanor, then to the clock. 'You found him, Miss Voss?' she asked, voice low, as if unwilling to disturb the hush.

Eleanor nodded, her own voice steady despite the tension. 'I did. The clock says ten minutes past nine, but dinner began at half past eight. Something doesn't add up.' She watched Dr. Mallory Finch closely, noting the way her gaze lingered on the clock, then darted away. The physician's composure was impressive, but not unbreakable. For a moment, Eleanor thought she saw a flicker of calculation—a weighing of facts and consequences—before Dr. Mallory Finch schooled her features into professional concern.

The room seemed to contract around them, every detail suddenly significant. Captain Ivor Hale appeared next, his navy blue suit immaculate despite the hour, his posture rigid with the discipline of military habit. He lingered by the door, eyes narrowed, jaw set. Captain Ivor Hale, a recent arrival and the hotel's unofficial steward, had been Hugo Vane's confidant and adviser. Yet now, his hands remained clenched at his sides, betraying a tension that words could not.

Beatrice Quill entered with less certainty, her floral-print dress incongruously bright in the somber room. She hovered near the window, glancing between Eleanor and the body, her lips parted as if to speak but thinking better of it. Beatrice Quill, a bystander by reputation but never by temperament, had always seemed to know more than she let on. Today, her gaze was fixed on the handkerchief, and her fingers twisted the strap of her handbag in nervous rhythm.

Sylvia Trent followed, her stride brisk, her expression unreadable. The ambitious rival, always eager to insert herself into the heart of any drama, surveyed the scene with a practiced detachment. Sylvia's eyes lingered for a moment on Hugo Vane, then shifted to Eleanor, as if weighing the advantage to be gained from each. Her posture was impeccable, but the set of her jaw suggested a struggle to maintain control.

Eleanor drew a slow breath, letting the silence settle. The storm outside had faded to a persistent drizzle, but within the room, the tension was electric. She addressed the assembled guests, her tone measured. 'We must not disturb anything further. The clock, the handkerchief—every detail matters. Until we understand what happened, I ask for your cooperation.' The words hung in the air, a fragile truce amid the gathering storm of suspicion.

The room's silence was broken only by the faint ticking of the clock, each second a reminder of the contradiction at the heart of the mystery. Eleanor felt the weight of responsibility settle on her shoulders. She was the investigator now, whether by accident or design, and the truth—however unwelcome—would have to be drawn from these tangled threads. For a moment, she allowed herself a flash of irony: the world outside might be recovering from war, but inside this room, another kind of battle had only just begun.

She turned once more to the clock, its hands unmoved since her arrival. The time—ten minutes past nine—stood in silent opposition to the reality of the evening before. Eleanor made a mental note: the answer lay not only in the facts, but in the spaces between them—the contradictions, the hesitations, the things left unsaid. The investigation, she knew, would demand more than logic; it would require patience, and a willingness to see past the obvious.

As the others drifted back to the corridor, Eleanor lingered, her gaze fixed on the bloodied handkerchief and the silent clock. The morning had brought no clarity, only questions. Yet beneath the surface, the first threads of the truth had begun to unravel. She straightened her shoulders, resolved. The storm might have passed, but its aftermath was only beginning.
--- END PRIOR CHAPTER 1 ---

[SCENE COMPLETENESS CONTRACTS — MANDATORY. Each contract below lists what you MUST enact in that chapter. Do not summarise or mention these labels in the prose — enact them organically.]
Chapter 2 (Act 1) completeness contract:
  PIVOT ELEMENT (MANDATORY — write this into the prose, shown not told): "The handkerchief with Hugo's blood found near the clock."
  FACT ESTABLISHED (MANDATORY — reader must know this by chapter end): "Establishes that there are conflicting accounts among the suspects regarding the time of death."

# Case Overview
Title: The Clockwork Deception
Era: 1940s
Setting: a grand seaside hotel built in the early 1900s
Crime: murder (poisoning)
Culprit: Dr. Mallory Finch
Victim: Hugo Vane
False assumption: Hugo Vane was murdered shortly before dinner, as indicated by the clock.
Cast: Eleanor Voss (she/her), Dr. Mallory Finch (she/her), Captain Ivor Hale (he/him), Beatrice Quill (she/her), Sylvia Trent (she/her), Hugo Vane (he/him)

Setting Lock: Keep all scenes and descriptions consistent with the stated setting (a grand seaside hotel built in the early 1900s). Do not introduce a different location type. Do not invent an alternative estate name. The only permitted name for this property is "a grand seaside hotel built in the early 1900s" — any other estate name (e.g., "Caldwell Manor", "Ashwood Hall", or any invented proper name) is a continuity error that will be caught and rejected.

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
      "location": "Hugo Vane's hotel room",
      "timeOfDay": "Shortly after the discovery",
      "atmosphere": "Chaotic as hotel staff and guests gather around"
    },
    "characters": [
      "Eleanor Voss",
      "Captain Ivor Hale",
      "Beatrice Quill",
      "Dr. Mallory Finch"
    ],
    "purpose": "Establish the setting and introduce suspects",
    "cluesRevealed": [
      "clue_mechanism_visibility_core",
      "clue_core_contradiction_chain"
    ],
    "dramaticElements": {
      "conflict": "Tensions rise as suspects are questioned",
      "tension": "Each suspect has a different account of their whereabouts.",
      "microMomentBeats": [
        "Beatrice fidgets nervously, glancing at the clock as if it holds the answer."
      ]
    },
    "summary": "Eleanor begins to question those present, noting the conflicting accounts of their whereabouts. The clock's time and the handkerchief found nearby create a web of contradictions that deepens the mystery.",
    "beat": "crime",
    "estimatedWordCount": 1250,
    "pivotElement": "The handkerchief with Hugo's blood found near the clock.",
    "factEstablished": "Establishes that there are conflicting accounts among the suspects regarding the time of death.",
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
        "characterName": "Dr. Mallory Finch",
        "behaviour": "Show normal social behaviour; grief or confusion if appropriate."
      }
    ],
    "redHerringPlacement": null,
    "emotionalRegister": "Eleanor feels the weight of her past failures, intensifying her drive for justice.",
    "dominantCharacterNote": {
      "name": "Eleanor Voss",
      "voiceRegister": "Eleanor speaks in a measured, articulate manner, often laced with irony."
    },
    "humourGuidance": {
      "permission": "permitted",
      "character": "Eleanor Voss",
      "form": "dry_wit"
    },
    "eraTextureNote": "Limited transportation options due to post-war recovery; Rationing affecting availability of goods; Communication disruptions during storms",
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
□ Chapter 2: the clue [clue_core_contradiction_chain] (clock, tampered, mislead, time, death) is placed in the first 25% of the chapter, dramatized in your own words, followed by an explicit inference or suspicion paragraph.
□ Chapter 2: the clue [clue_mechanism_visibility_core] (clock, rewound, misrepresent, time, death) is placed in the first 25% of the chapter, dramatized in your own words, followed by an explicit inference or suspicion paragraph.
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
