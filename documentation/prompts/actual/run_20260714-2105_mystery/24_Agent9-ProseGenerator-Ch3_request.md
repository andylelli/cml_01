# Actual Prompt Record

- Run ID: `mystery-1784063124632`
- Project ID: ``
- Timestamp: `2026-07-14T21:15:12.865Z`
- Agent: `Agent9-ProseGenerator-Ch3`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4.1`
- Temperature: `0.42`
- Max Tokens: `4500`
- Attempt: `first`
- Prompt Hash: `f40df0fb594ca3f0`

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
- MORAL COMPLEXITY REQUIREMENT: The mechanism of this crime carries a moral gray area: "The murderer committed the crime out of desperation, seeking to protect a loved one from a greater threat, which complicates the moral landscape of their actions." — the culprit reveal and denouement MUST acknowledge this ambiguity. Do not let the ending feel clean or simple. Give the reader at least one moment of uncomfortable sympathy or moral doubt.

- CHAPTER OPENING (every chapter, lint-enforced): never open on a tour or inventory of named rooms/places. The first sentence must land a character ACTION, a specific sensory detail, or a concrete in-scene moment — not "In the [room], the [room], and the [room]…". Locations enter through what a character does in them, one at a time.
- VICTIM IDENTITY (HARD CONSTRAINT — lint-enforced): Beatrice Quill is the murder victim, already dead before this chapter. They do NOT speak, enter, react, gesture, or appear in any present-tense scene. When Beatrice Quill is referenced at all, it may ONLY be as: (a) physical evidence/the body, or (b) REPORTED memory/testimony — and reported references MUST be framed as recollection, never as a live beat. WRONG: `Beatrice Quill said, "…"` / `Beatrice Quill turned to him`. RIGHT: `Beatrice Quill had said, weeks before, that…` / `Agnes remembered how Beatrice Quill used to…`. Attach an explicit recollection frame ("had", "remembered", "recalled", "before she died", "in life") to any sentence that names Beatrice Quill beside an action or speech verb. A live dialogue tag or present action for Beatrice Quill is a continuity failure that will be rejected and regenerated.

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
   - Captain Ivor Hale: Ambitious Manipulator
   - Beatrice Quill: victim (DECEASED — does not appear in any scene, past tense only)
   - Sylvia Trent: Ostentatious Saboteur
   - Hugo Vane: Cunning Negotiator
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

## Era: 1947-01
Living in January 1947, the aftermath of World War II casts a long shadow over daily life. The air is thick with the damp chill of winter, while overcast skies and frequent rain create a somber atmosphere. Conversations often revolve around the challenges of reintegrating veterans into civilian roles, and the tension of emerging Cold War anxieties permeates society. Prices are stabilizing post-rationing, yet many still feel the pinch of shortages. Social rituals, such as afternoon tea and communal games, offer respite from the weight of uncertainty, while traditional gender roles are beginning to shift as women increasingly enter the workforce. The community grapples with both the lingering effects of war and the promise of a new era, creating a complex emotional landscape.
Emotional register: A collective sense of anxiety mixed with hope for a brighter future.
Physical constraints: Short daylight hours with limited time for social interactions. | Limited public transportation options due to rationed fuel. | Ongoing shortages of goods affecting daily life.
Current tensions (weave into background texture): The looming Cold War and rising tensions with the Soviet Union. | Struggles of returning soldiers reintegrating into civilian life. | Economic recovery from wartime rationing and shortages.
Wartime context — Many individuals are dealing with the aftereffects of service, some having lost loved ones or faced trauma themselves.: The community is trying to rebuild connections while dealing with the scars of war and loss. Absence effect: The absence of those who did not return or who were forever changed creates a pervasive sense of grief.

## Story Theme
In a world where identity can easily become a mask, the pursuit of truth often forces individuals to confront their own hidden selves and unresolved pasts.

## Story Emotional Register
Dominant: A journey through tension and revelation, where personal stakes and secrets intertwine.

Arc:
The story opens in the Grand Lobby of the Cliffside Grand Hotel, where a masquerade ball is in full swing. The atmosphere is vibrant yet tinged with an undercurrent of tension, as whispers of recent events stir unease among the guests. The discovery of Beatrice Quill's body, strangled with a silk scarf, shatters the celebratory mood and plunges Eleanor Voss, the keen-eyed detective, into an investigation that will test her resolve and challenge her past. As Eleanor begins to interview suspects, she navigates a web of deception, uncovering false leads and personal secrets that heighten the emotional stakes and deepen her internal conflict over her brother's wartime death.

The investigation pivots when she discovers conflicting witness statements, forcing her to confront Captain Ivor Hale’s dubious alibi and manipulative nature. A crucial clue—a missing button from a hotel uniform—further complicates the case, leading Eleanor to question the integrity of those around her. As the pressure mounts, Eleanor must confront both the murderer and her own haunting memories, culminating in a tense confrontation that reveals the shocking truth. The resolution forces each character to reckon with the emotional costs of their choices, as Eleanor finds a semblance of closure while grappling with her unresolved grief, and the other characters face the consequences of their hidden lives.

## Emotional register at this point in the story
Eleanor's investigation reveals a web of secrets that complicates her search for the truth.

## Character Portraits (appearance & era)

### Eleanor Voss
Eleanor Voss embodies the resilience of a society recovering from war. As a journalist, she seeks truth amidst the chaos, driven by a personal quest for redemption linked to her brother's wartime death. Her experiences reflect the shifting role of women in the post-war era, as they assert themselves in professions previously dominated by men.
Era intersection: Her internal conflict mirrors the societal struggle to reconcile the past with a hopeful future.

### Dr. Mallory Finch
As a psychiatrist, Dr. Mallory Finch navigates a post-war landscape where mental health is becoming increasingly important. However, her dark secret reveals the ethical dilemmas faced by professionals during this time, highlighting the pressure to maintain reputations amidst societal expectations. Her character illustrates the complexities of healing in a world still grappling with trauma.
Era intersection: Her actions are a reflection of the moral challenges professionals face in the evolving social climate.

### Sylvia Trent
Sylvia Trent navigates the treacherous waters of social status in a post-war world. Her financial troubles and the threat of exposure underscore the fragility of appearances in a society still recovering from conflict. Sylvia's character reveals the personal stakes involved in maintaining a facade and the anxieties of a changing social landscape.
Era intersection: Her experiences reflect the societal pressures women face in maintaining their roles amidst shifting norms.

## Character Voices

### Eleanor Voss (she/her/her)
Eleanor's voice carries a sharp urgency, often laced with a hint of vulnerability that reveals her inner conflicts.
[comfortable] ‘Isn’t it curious how the truth always seems to hide? I’ve spent years digging for it, and yet it remains elusive.’
[evasive] ‘Well, I suppose everyone has their secrets, don’t they? I wouldn’t want to pry into yours.’
[stressed] ‘I can’t let this slip away. Not again. I owe it to him to find out what really happened!’
Humour: Her dry wit often surfaces in unexpected moments, adding a layer of complexity to her character.

### Dr. Mallory Finch (she/her/her)
Dr. Finch speaks with a composed authority, her tone soothing when she engages with others, masking her underlying turmoil.
[comfortable] ‘Well, isn’t that an interesting perspective? It’s essential to explore every angle.’
[evasive] ‘I’m not sure that’s relevant to our discussion today. Let’s focus on what truly matters.’
[stressed] ‘I can’t afford to be exposed. Everything I’ve built hangs in the balance—do you understand?’
Humour: Her polite savagery often manifests in her responses to uncomfortable questions.

### Sylvia Trent (she/her/her)
Sylvia's voice exudes refined elegance, often laced with observational humor that reflects her social acumen.
[comfortable] ‘Isn’t it amusing how appearances can be so deceiving? We all wear masks, don’t we?’
[evasive] ‘Oh, I wouldn’t want to dwell on that. Let’s talk about something more delightful, shall we?’
[stressed] ‘I can’t have my secrets exposed. My entire world could collapse!’
Humour: Her observational humor adds a layer of sophistication to her character.

## Location Registers (scene framing guides)

Grand Lobby: In the Grand Lobby, a mix of anticipation and anxiety hangs in the air. Guests exchange nervous glances, and the hushed whispers of secrets create a palpable tension, evoking a sense of unease that contrasts with the hotel’s grandeur.. Camera angle: Entering this space, a writer might emphasize the contrast between the opulence of the surroundings and the undercurrents of anxiety felt by the guests.. Era: The lobby serves as a gathering place, where social norms are both upheld and challenged in the wake of war.

Dining Room: The Dining Room is filled with an air of festivity, yet a layer of tension underlies the laughter and clinking cutlery. As guests enjoy their meals, the threat of secrets being revealed lingers in every corner, making it a vibrant yet precarious space.. Camera angle: A writer might capture the vibrancy of the room while also hinting at the hidden turmoil among the guests.. Era: Dining experiences reflect the evolving social interactions of post-war society, where traditional roles are being redefined.

Secluded Beach Access: The Secluded Beach Access evokes a haunting beauty, where the crashing waves mirror the turmoil within. The isolation of the rocky shore creates an eerie stillness, broken only by the sounds of nature, amplifying the sense of foreboding that envelops the area.. Camera angle: A writer might focus on the contrast between the natural beauty and the ominous undertones present in this secluded space.. Era: This location serves as both a retreat and a potential crime scene, highlighting the fragility of safety in a world still grappling with the aftermath of conflict.

Library: The Library is a sanctuary of quiet contemplation, filled with the scent of old books and whispers of hidden knowledge. The atmosphere is thick with tension as guests seek refuge from the outside world, yet the weight of secrets looms large in this intimate space.. Camera angle: A writer might delve into the rich textures of the space, capturing the interplay between silence and the unspoken tensions held within.. Era: This location embodies the post-war thirst for knowledge and understanding, where guests navigate their own truths amidst the shadows of the past.

## Humour guidance for this story position (early)
Permission: permitted
Characters who may be funny: Eleanor Voss
Permitted forms: dry_wit
Rationale: Eleanor's observations can provide levity amid the seriousness of the investigation.

## Reveal Groundwork (texture — do not explain, only plant)
- Plant one subtle observable beat related to: "Eleanor's initial interviews with Hale and Vane take on new meaning when their earlier statements are called into question, revealing the depths of their deception". Do not explain significance yet.
- Plant one subtle observable beat related to: "The missing button clue recasts the suspects' movements, suggesting a more complex web of relationships than initially perceived". Do not explain significance yet.
- Plant one subtle observable beat related to: "Finch's denial of involvement becomes more poignant in light of her secrets, revealing the fragility of her carefully constructed life". Do not explain significance yet.

FAIR-PLAY AND INFERENCE CONTRACT:
- FAIR PLAY CLUE TIMING: Never combine clue discovery and detective deduction in the same chapter. If a clue is first revealed to the reader in chapter N, the detective may only analyze, deduce from, or act on that clue in chapter N+1 or later.
- FAIR PLAY INFORMATION PARITY: The reader must see all clues BEFORE the detective uses them in reasoning. If the detective performs a test or makes a deduction, every piece of evidence supporting that conclusion must have been shown to the reader in earlier chapters.
- FAIR PLAY REVELATION SPACING: In the discriminating test scene, the detective can ONLY use clues that were revealed to the reader at least 1 full chapter earlier. Never introduce new clues or withheld information during the test.
- FAIR PLAY CONFRONTATION: During the final confrontation/revelation, the detective cannot surprise the reader with facts. Every piece of evidence cited must have been visible to the reader in prior chapters.
- Never solve by withheld information. Keep reader-information parity with detective reasoning.
- False assumption in force: Captain Hale was in his office at the time of the murder, as he stated.
- Hidden truth to progressively expose (compose in your own words from these elements): actual, presence, crime, scene, disguised, staff, member
- Inference path checkpoints to dramatize clearly — compose ENTIRELY in your own sentences from these key terms (reproducing any briefing phrase verbatim FAILS validation):
  - Step 1: obs: witnesses, report, seeing, captain, hale, lobby, eight, murder | corr: hale, alibi, claiming, office, time, false | effect: eliminates, hale, credibility, suspect
  - Step 2: obs: missing, button, hotel, uniform, crime, scene | corr: button, suggests, hotel, staff, member, present, murder | effect: narrows, suspect, pool, access, uniform
  - Step 3: obs: hale, instructs, staff, create, cover, story, conflicts, witness, accounts | corr: manipulation, indicates, hale, involvement, obscuring, truth | effect: narrows, investigation, towards, hale, potential, culprit
- Discriminating test method: trap
- Discriminating test elements to dramatize (compose ENTIRELY in your own sentences from these — do NOT reproduce any briefing phrase verbatim): setting, staged, confrontation, hotel, staff, reveal, hale, manipulation, alibi
- Test must rely on already-shown clue IDs: clue_2, clue_1, clue_3
- Fair-play rationale: Step 1: Witness statements about Hale in the lobby (early) and his alibi (mid) expose his deception. Step 2: The missing button clue (early) indicates a staff presence at the murder. Step 3: Hale's manipulation of witness accounts (discriminating test) reveals him as the culprit.

## Character Reference

### Eleanor Voss (she/her — NEVER he/him)
Eleanor speaks with a mixture of urgency and precision, her words often clipped when she's passionate
She has a habit of punctuating her statements with rhetorical questions, challenging her interlocutors.
Eleanor wrestles with the guilt of not being able to save her brother, which complicates her pursuit of justice for others.
Voice colour: Eleanor Voss uses dry wit humour — let it surface in their dialogue where natural, not in every line.

### Dr. Mallory Finch (she/her — NEVER he/him)
Finch speaks with a measured cadence, her words carefully chosen to convey authority
She often employs clinical jargon but softens her tone with a hint of warmth when engaging with patients.
Dr. Finch grapples with guilt over her unethical choices, fearing that exposure could lead to the loss of everything she values.
Voice colour: Dr. Mallory Finch uses polite savagery humour — let it surface in their dialogue where natural, not in every line.

### Sylvia Trent (she/her — NEVER he/him)
Sylvia speaks with a refined eloquence, often weaving in anecdotes from her social life
She has a tendency to make dry observations about the absurdities of high society.
Sylvia struggles with the duality of her public persona and her private struggles, fearing that the truth will shatter her carefully constructed life.
Voice colour: Sylvia Trent uses observational humour — let it surface in their dialogue where natural, not in every line.


## CHARACTER CONTRACTS (binding for this scene)
Each entry below constrains how this character must be written in this chapter.
These override generic style guidance when they conflict.

### Eleanor Voss[SHE]
Voice & mannerisms: Eleanor speaks with a mixture of urgency and precision, her words often clipped when she's passionate. She has a habit of punctuating her statements with rhetorical questions, challenging her interlocutors.
SIGNATURE TIC (use sparingly — this is Eleanor Voss's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "‘Isn’t it curious how the truth always seems to hide?’"
Sample voice fragments (match this register and rhythm):
  [comfortable] "‘Isn’t it curious how the truth always seems to hide? I’ve spent years digging for it, and yet it remains elusive.’"
  [evasive] "‘Well, I suppose everyone has their secrets, don’t they? I wouldn’t want to pry into yours.’"
Humour: dry wit — deploy occasionally (level 0.5)
FORBIDDEN phrase (never write for Eleanor Voss): "a surge of determination washed over her"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Initially drawn to the hotel for a feature on post-war recovery, Eleanor's instincts compel her to dig deeper into the murder that disrupts the fragile peace." — do not surface in Act I.

### Dr. Mallory Finch[SHE]
Voice & mannerisms: Dr. Finch speaks with a measured cadence, her words carefully chosen to convey authority. She often employs clinical jargon but softens her tone with a hint of warmth when engaging with patients.
SIGNATURE TIC (use sparingly — this is Dr. Mallory Finch's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "‘Well, isn’t that an interesting perspective?’"
Sample voice fragments (match this register and rhythm):
  [comfortable] "‘Well, isn’t that an interesting perspective? It’s essential to explore every angle.’"
  [evasive] "‘I’m not sure that’s relevant to our discussion today. Let’s focus on what truly matters.’"
Humour: polite savagery — deploy occasionally (level 0.4)
FORBIDDEN phrase (never write for Dr. Mallory Finch): "she felt a wave of unease"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "The victim's potential revelations about her practices could expose her dark past and destroy the career she has painstakingly built." — do not surface in Act I.

### Sylvia Trent[SHE]
Voice & mannerisms: Sylvia speaks with a refined eloquence, often weaving in anecdotes from her social life. She has a tendency to make dry observations about the absurdities of high society.
SIGNATURE TIC (use sparingly — this is Sylvia Trent's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "‘Isn’t it amusing how appearances can be so deceiving?’"
Sample voice fragments (match this register and rhythm):
  [comfortable] "‘Isn’t it amusing how appearances can be so deceiving? We all wear masks, don’t we?’"
  [evasive] "‘Oh, I wouldn’t want to dwell on that. Let’s talk about something more delightful, shall we?’"
Humour: observational — deploy occasionally (level 0.5)
FORBIDDEN phrase (never write for Sylvia Trent): "everyone could sense the atmosphere"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "The victim's plan to expose her financial troubles threatened to unravel the social standing Sylvia had fought so hard to maintain." — do not surface in Act I.



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

Primary Location: The Cliffside Grand Hotel (Bournemouth, England)
A grand seaside hotel perched on the cliffs of Bournemouth, offering stunning ocean views and an air of mystery.

Key Locations Available:
- Grand Lobby (interior): Gathering space
- Dining Room (interior): Dining area
- Secluded Beach Access (exterior): Crime scene
- Library (interior): Clue discovery

Atmosphere (tonal cue only — do NOT reproduce this phrase verbatim in prose; translate into scene-specific, character-observed sensory language): tense, with whispers of recent events causing unease among guests
Weather: overcast with occasional rain, typical of coastal climates

Era markers: Radio broadcasts in every guest room | Early television sets in common areas | Rationed fuel limiting transportation

USAGE GUIDELINES:
1. First mention of location: Ground the scene using sensory details drawn from the profiles — paraphrase these into what the POV character directly observes and experiences, not a summary of the room's general qualities
2. Geographic grounding: Reference the specific place (Bournemouth, England) naturally in dialogue or narrative
3. Action scenes: Integrate physical layout details (access, sightlines, constraints)
4. Atmospheric scenes: Reference weather, lighting, sounds from sensory palette
5. Era details: Weave in period markers naturally
6. Consistency: Keep all location descriptions aligned with profiles
7. OPENING GROUNDING (required, first 1-2 paragraphs of EVERY chapter): (a) name the specific location from this list, (b) give at least 2 concrete sensory details (sound, smell, temperature, texture, light/shadow), and (c) one time-of-day or weather/atmosphere detail — BEFORE advancing plot, clues, or the mechanism. Open on the setting and the people in it, not on the puzzle.
8. This matters most in pre-reveal chapters that withhold the mechanism: ground them in setting and character rather than rushing the investigation — a withheld chapter is not an empty one.
9. Do NOT use generic repeated manor/storm filler without profile-specific details; vary the opening location/sense each chapter

SENSORY PALETTE (use 2-3 senses per scene):
Grand Lobby (interior):
  - Visual: gleaming marble floors, ornate chandeliers, sea-view windows
  - Sounds: murmurs of guests, clinking glasses, distant piano music
  - Scents: fresh flowers, polished wood, damp sea air
  - Touch: smooth marble underfoot, soft velvet upholstery

Dining Room (interior):
  - Visual: white tablecloths with silverware, glimmering glass chandeliers, ocean waves crashing below
  - Sounds: soft classical music, clinking of silverware, murmurs of conversation
  - Scents: rich seafood dishes, freshly baked bread, scent of wine
  - Touch: smooth porcelain plates, cool metal cutlery

Secluded Beach Access (exterior):
  - Visual: rough cliffside path, crashing waves against rocks, tangled seaweed
  - Sounds: waves crashing on rocks, wind howling through grasses, distant seagull cries
  - Scents: salty sea air, wet earth, damp driftwood
  - Touch: rough stone path underfoot, cool sea breeze against skin

⛔ REFERENCE DATA — DO NOT TRANSCRIBE VERBATIM: The above profiles are structural guides only. Generate original prose that evokes these qualities; do not reproduce the exact phrasing or sentence structure of the profile paragraphs.

SCENE OPENING RULE: When opening a scene in a new location, write what the POV character directly observes and physically senses at that moment — not a general description of the room's qualities. The reader must feel present, not briefed. Sensory details must be observed by the character, not stated as fact about the place.

SENSORY WRITING TECHNIQUES:
- Opening paragraphs: Lead with 2-3 sensory details to ground the scene
- Movement between locations: Note sensory changes (quiet study → noisy dining room)
- Emotional
[truncated for prompt budget]

## Texture Pool
Draw on these as opportunities arise — you are not required to use them.

- Living in January 1947, the aftermath of World War II casts a long shadow over daily life
- The air is thick with the damp chill of winter, while overcast skies and frequent rain create a somber atmosphere
- Conversations often revolve around the challenges of reintegrating veterans into civilian roles, and the tension of emerging Cold War anxieties permeates society
- Prices are stabilizing post-rationing, yet many still feel the pinch of shortages
- Social rituals, such as afternoon tea and communal games, offer respite from the weight of uncertainty, while traditional gender roles are beginning to shift as women increasingly enter the workforce

TEMPORAL CONTEXT:

This story takes place in January 1947 during winter.

Seasonal Atmosphere:
- Weather patterns: overcast with frequent rain showers, chilly winds from the coast, damp air creating a heavy atmosphere
- Daylight: Short daylight hours, with the sun rising around 7:50 AM and setting by 4:30 PM, leaving long shadows and a sense of early nightfall
- Seasonal activities: Indoor gatherings with board games and card games in the hotel lounge, Visits to local museums to escape the rain, Enjoying warm drinks by the fireplace
- Seasonal occasions: New Year's Day (January 1), Epiphany (January 6)
- Season: winter

Period Fashion (describe naturally):
- Men formal: dark wool suits with wide lapels, crisp white dress shirts, black leather oxfords
- Men casual: tweed blazers, faded wool sweaters, slack trousers
- Men accessories: silk ties with geometric patterns, felt fedoras, gloves for protection against the chill
- Women formal: elegant tea-length dresses with cinched waists, string of pearls, heavily padded coats
- Women casual: tweed skirts paired with thick knit sweaters, turtlenecks under cardigans, wide-brimmed hats
- Women accessories: stylish handbags made of leather, fur stoles for evening wear, decorative brooches

Cultural Context (reference naturally):
- Music/entertainment: Bing Crosby's 'White Christmas', The Andrews Sisters' 'Boogie Woogie Bugle Boy', Nat King Cole's smooth jazz tunes; Films: 'The Best Years of Our Lives' depicting veterans adjusting to civilian life, 'It’s A Wonderful Life' showcasing post-war community values; Theatre: Broadway hits like 'Annie Get Your Gun', local vaudeville shows attracting hotel guests; Radio: 'The Jack Benny Program' providing comedic relief, news bulletins discussing the latest from Washington
- Typical prices: Loaf of bread: four pence, Cigarettes: seven pence, Taxi fare across town: two shillings
- Current events: the start of the Cold War and rising tensions with the Soviet Union; the Berlin Blockade initiated in June 1948, becoming a point of concern
- Literature: 'The Catcher in the Rye' by J.D. Salinger | 'The Stranger' by Albert Camus | 'The Naked and the Dead' by Norman Mailer | [detective fiction gaining traction] | [post-war novels reflecting existential themes] | [romantic thrillers capturing the imagination]
- Technology: the first commercially available television sets gaining popularity | advancements in radar technology for military use | early computers in their infancy, mainly for research purposes | radio sets in every guest room | public phonographs playing popular records in lounges | newspaper vending machines on street corners
- Daily life: attending community dances and social gatherings, visiting local parks for winter walks, engaging in group discussions about politics over coffee
- Social rituals: afternoon tea served in the hotel lounge, weekly bingo nights drawing guests together, formal dinner parties with set seating arrangements

Atmospheric Details:
The damp air clings to the skin, heavy with the scent of rain-soaked wood and lingering smoke from the fireplace. The muted chatter of guests fills the hotel lobby, occasionally punctuated by the sound of a radio broadcasting the evening news. Outside, the rhythmic patter of rain against windows creates a backdrop of tension, echoing the unease of the times.

FASHION INTEGRAT
[truncated for prompt budget]

NON-NEGOTIABLE CHAPTER OBLIGATIONS — LOCKED EVIDENCE VALUES (VERBATIM REQUIRED):
The following measured values (times, amounts, measurements) are absolute ground truth. Every time this chapter describes, mentions, or alludes to one — no matter how briefly — it MUST use the exact phrase shown below, character for character. NO paraphrase, approximation, rounding, or synonym is permitted.

FAILURE EXAMPLE: if the locked value is "at thirteen minutes to midnight" and you write "just before midnight" or "around midnight" — that is a HARD FAIL. You must write "at thirteen minutes to midnight". Equally, if the locked value is written in words, such as "ten minutes past eleven", and you convert it to figure-based clock notation — that is also a HARD FAIL. Words stay as words; figure forms are forbidden for word-phrased facts.

CRITICAL — WORD-PHRASED VALUES: If the canonical value is written out in words (e.g. a time like "ten minutes past eleven", or an amount like "forty minutes"), reproduce those exact words. DO NOT convert to figure-based time notation, twenty-four-hour format, or any other numeric shorthand. Correct: "ten minutes past eleven". WRONG: figure-based clock notation or numeric shorthand.

Locked values:
  - A missing button from the hotel employee's uniform found at the crime scene.: "one"
  - Three witnesses recall seeing the murderer at the ball.: "three"
  - The masquerade ball started at half past eight at night, coinciding with the time of the murder.: "half past eight at night"

If a value has no relevance to this chapter, omit it. But the moment you reference the underlying evidence, only the exact phrase above is acceptable.

EVIDENCE TO CONVEY IN YOUR OWN WORDS (NOT verbatim): weave each of these descriptive facts into the chapter as a COMPLETE, GRAMMATICAL observation by a character — surface the MEANING, never copy the phrasing word-for-word, and NEVER splice two evidence phrases together with an apostrophe or run two clauses together without a sentence break. If a fact has no relevance to this chapter, omit it.
  - The costume matches the description of a character seen at the event.: the same

⛔ CLUES TO SURFACE IN THESE CHAPTERS — mandatory:
The following evidence MUST be clearly observable to an attentive reader. Do not bury it in atmosphere or passing dialogue. Each clue must be concrete, specific, and noticeable:

• [clue_1] missing, button, hotel, uniform, crime, scene
  Category: testimonial | Criticality: essential | Supports inference step 2
  Points to: hotel, employee, involved, murder

• [clue_2] button, suggests, hotel, staff, member, present, murder
  Category: testimonial | Criticality: essential | Supports inference step 2
  Points to: involvement, hotel, staff, murder, possible

• [clue_culprit_direct_captain_ivor_hale] direct, ties, captain, ivor, hale, mechanism, access, point, before, discriminating, excludes, competing
  Category: testimonial | Criticality: essential | Supports inference step 2
  Points to: direct, shows, captain, ivor, hale, means, opportunity, narrowing, solution, uniquely, toward, culprit

• [clue_early_1] Direct observation
  Category: structural | Placement: early (Act 1)
  Points to: what this observation reveals about the time or circumstances of the crime.

• [clue_late_1] During the trap execution
  Category: structural | Placement: early (Act 1)
  Points to: what this observation reveals about the time or circumstances of the crime.

• [clue_mid_1] Witnesses report
  Category: structural | Placement: early (Act 1)
  Points to: what this observation reveals about the time or circumstances of the crime.

For each clue above: an attentive reader should be able to find, record, and later use it to reason toward the solution.

═══ NARRATIVE STATE (read-only — do not contradict) ═══

LOCKED FACTS — use verbatim whenever this evidence is described:
  • A missing button from the hotel employee's uniform found at the crime scene.: "one"
  • Three witnesses recall seeing the murderer at the ball.: "three"
  • The costume matches the description of a character seen at the event.: "the same"
  • The masquerade ball started at half past eight at night, coinciding with the time of the murder.: "half past eight at night"

CHARACTER PRONOUNS — never deviate from these:
  • Eleanor Voss: she/her/her
  • Dr. Mallory Finch: she/her/her
  • Captain Ivor Hale: he/him/his
  • Beatrice Quill: she/her/her
  • Sylvia Trent: she/her/her
  • Hugo Vane: he/him/his

CLUES ALREADY REVEALED TO READER: clue_mechanism_visibility_core, clue_early_1, clue_late_1, clue_core_contradiction_chain, clue_mid_1 — do not reveal these as new information.

INVESTIGATION LOG — WHAT IS ESTABLISHED (do not re-establish, do not repeat):
• Evidence already established (reference only — do NOT restate or quote these; advance beyond them): hale, alibi, questionable | hale, alibi, questionable | hotel, employee, involved, murder | hale, alibi, cannot, trusted | hale, alibi, cannot, trusted
• Suspects still unresolved: Dr. Mallory Finch[SHE], Sylvia Trent[SHE], Hugo Vane[HE]
⚠ The story must move FORWARD from this log. Any beat already listed above is forbidden from repeating.

⚠ THIS CHAPTER'S REQUIRED ADVANCE (early): Interview each suspect — record their claimed whereabouts

CONTINUITY HANDOFF — previous chapter closing beat:
  • "Eleanor let her eyes drift to the lobby’s grand staircase, the banister gleaming in the flat light, and wondered how many secrets these walls had witnessed. The masquerade was over, but the masks remained. She tucked her notepad away, the questions multiplying..."
  • The next chapter must open as a continuation of this beat, not as a disconnected reset.

⛔ DEAD CHARACTER — CANNOT APPEAR AS ALIVE:
• Beatrice Quill: murdered before Chapter 1. In ALL chapters from here on:
  - Refer to them ONLY in past tense, only as the victim of the crime
  - NEVER have them: enter a room, speak, respond, gesture, look, nod, or react
  - NEVER describe them as present at any scene, conversation, or confrontation
  - WRONG: "Beatrice Quill crossed the room" / "Beatrice Quill sat on the sofa" / "Beatrice Quill nodded"
  - WRONG: "Beatrice Quill gave testimony" / "Beatrice Quill asked what had happened"
  - CORRECT: "Beatrice Quill had often said..." / "Beatrice Quill's effects were found" / "witnesses recalled Beatrice Quill's habit of..."
═══════════════════════════════════════════════════════

═══════════════════════════════════════════════════════════
📚 CONTINUITY CONTEXT - CHARACTER & SETTING CONSISTENCY
═══════════════════════════════════════════════════════════

**CRITICAL: You are writing chapters 3+. Maintain consistency with earlier chapters.**

**Character Names Used in Chapters 1-2:**
Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill, Sylvia Trent, Hugo Vane

✓ RULE: Use EXACTLY these names. Do NOT vary spelling, add titles, or introduce new forms.
✓ Example: if earlier chapters used "Clara Whitfield", keep using "Clara Whitfield" — never "Mrs. Whitfield" unless that is the character's canonical name in the list above.

**Setting Vocabulary Established in Earlier Chapters:**
study, deck, corridor, lobby, lounge, flat, dining room

✓ RULE: Continue using this location vocabulary. Maintain consistency with established setting type.
✓ Do NOT introduce new location types that contradict earlier chapters.

**Recent Chapter Summary (for narrative continuity):**
Chapter 1: Chapter 1: Shadows Across the Lobby
  Events: There was no mistaking the shock that radiated in waves through the room.
Chapter 2: Chapter 2: Contradiction
  Events: "You’re certain you never left your office?

⚠️ **VALIDATION:** Character name mismatches and setting drift are common failure modes.
Double-check every character name against the list above before using it.

**⏱ LOCKED TIME ANCHOR — use verbatim, do not paraphrase:**
Clock time (from the case ground truth): **"Time of death at approximately eight o'clock."**
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
Known location profile anchors: The Cliffside Grand Hotel, Grand Lobby, Dining Room, Secluded Beach Access, Library, the hotel dining area
LOCATION NAME CAPITALISATION (HARD REQUIREMENT — validated):
All named locations in your prose MUST use the EXACT capitalisation from the CML profiles.
Canonical forms: "The Cliffside Grand Hotel", "Grand Lobby", "Dining Room", "Secluded Beach Access", "Library", "the hotel dining area"
Writing a location in lowercase (e.g. "drawing room" instead of "Drawing Room") is a validated error. Every time you mention a named location, copy its capitalisation from the list above.
- Chapter 3: OPENING STYLE (HARD): Start the VERY FIRST SENTENCE with an explicit time marker — e.g. "That morning…" / "By the time dusk fell…" / "It was nearly four o'clock…" / "On the second day after the discovery…". Time must be in the first clause. Anchor opening in "the hotel dining area". The opening style above governs only your FIRST SENTENCE; the grounding below may land anywhere in the first 2 paragraphs (it need not be sentence one, and never conflicts with the chosen opening style). HARD REQUIREMENT for the first 2 paragraphs: (a) include 2+ sensory words — choose from smell/scent/odor/fragrance/sound/echo/silence/whisper/creak/cold/warm/damp/rough/smooth/glow/shadow/flicker/dim — and (b) include 1+ atmosphere/time word — choose from rain/wind/fog/storm/mist/thunder/evening/morning/night/dawn/dusk/lighting/weather/season/afternoon/midday/noon/midnight/twilight/sunrise/sunset/daylight/sunlight/overcast/cloudy/bright/dark/grey/pale/chill/crisp/drizzle/haze/lamplight/firelight. These are validated requirements, not style suggestions; missing them triggers a retry.

[⚠ INTERNAL QUALITY DIAGNOSTICS — DO NOT REPRODUCE ANY PART OF THIS SECTION IN YOUR STORY OUTPUT. These are private generator observations for your consideration only. Your narrative must read as if this section does not exist. Never include phrases from this block in character dialogue, narration, or description.]

PRIOR CHAPTER QUALITY OBSERVATIONS:
- Chapter 2 (score 97/100):
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

PROMPT BUDGET SUMMARY: budget=24000 tokens; fixed=12656; context=11326; dropped=[humour_guide]; truncated=[location_profiles, temporal_context, pronoun_accuracy]

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
4. Integrate at least two concrete era-grounded details per chapter from setting refinement signals: radio broadcasts in every guest room | early television sets in common areas | military-grade radar for coastal surveillance | long-distance telephone calls via switchboard | telegrams for urgent messages | military encryption protocols for sensitive information.
5. Respect setting movement/access constraints in scene action and alibis: narrow hallways limiting movement of multiple persons | fire exits leading to the beach restricting access at night | rooms with limited soundproofing affecting eavesdropping | restricted access to staff-only areas such as the kitchen and maintenance rooms | guest room doors secured with simple locks.
6. Sustain social coherence with this backdrop pressure: A masquerade ball at a grand seaside hotel draws a diverse group of guests, where post-war tensions and shifting social norms create an atmosphere ripe for deception and intrigue.
7. Maintain continuity around these socially central cast anchors where relevant: Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill, Sylvia Trent, Hugo Vane.
8. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Critical: Plot similarity 0.85 with 'The Second Key' (same impersonation method and identity manipulation motive)
9. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Moderate: Character similarity 0.75 with 'The Second Key' (similar cast structure and roles)
10. STORY TO DATE ANTI-COPY RULE: The STORY TO DATE section below is provided for chronological and factual reference ONLY. You MUST NOT copy, lightly rephrase, or structurally echo any sentence or paragraph from prior chapters. Every sentence in this chapter must be original prose unique to this scene. Reusing even a clause from prior chapter text will cause this attempt to fail immediately.

CRITICAL PROSE REQUIREMENTS:

The CML specifies exact requirements for certain validation-critical scenes. You MUST include these elements at the specified positions.

**Discriminating Test Scene (Act 3, Scene 4):**
Required elements: Execute the discriminating test, Observe Hale's reaction or result, Draw conclusion about guilt
Test type: trap

**Suspect Clearance Scenes:**
- Dr. Mallory Finch (Act 3, Scene 5): Witness corroboration
  Clues: clue_id_1, clue_id_2
- Sylvia Trent (Act 3, Scene 5): Jewelry misplaced during preparation.
  Clues: clue_id_3, clue_id_4
- Hugo Vane (Act 3, Scene 5): Old business note unrelated to murder.
  Clues: clue_id_5, clue_id_6

**Culprit Revelation Scene (Act 3, Scene 6):**
Method: Confrontation with evidence

**Clue Placement for These Chapters:**
- clue_1 must appear in Act 1, Scene 3 via Witness statement
- clue_2 must appear in Act 1, Scene 3 via Cross-check contradiction
- clue_culprit_direct_captain_ivor_hale must appear in Act 1, Scene 3 via Witness statement
- clue_early_1 must appear in Act 1, Scene 3 via Direct observation
- clue_late_1 must appear in Act 1, Scene 3 via During the trap execution
- clue_mid_1 must appear in Act 1, Scene 3 via Witnesses report

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
Batch chapters: 3-3.
Investigation state at start: 5 clue(s) revealed to reader; approximately 3 unresolved suspect(s).
Must change by end: Increase or complicate suspicion through a new pressure revelation — WITHOUT resolving the case: do NOT name, accuse, or extract a confession from the culprit, make an arrest, or declare the case closed (that is reserved for the final reveal).
Suspect pressure target(s): Dr. Mallory Finch, Sylvia Trent
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
- Chapter 3:
  - STRUCTURAL ARCHETYPE — Chapter 3 must be: EVIDENCE
      ✓ MUST contain: new physical clue discovered
      ✗ MUST NOT contain: formal accusation
  - Word count: Target 1250 words. Achieve this through plot events, dialogue exchanges, and physical investigation — not through atmospheric repetition or extended internal reflection. Each 200-word segment should contain at minimum one concrete story event (a discovery, a conversation exchange, a physical action or movement). Padding with atmosphere alone is not acceptable.
  - Opening: Begin with a character action, spoken line, or clock/time marker — never a location name or location-description phrase.
  - Scene is set in: the hotel dining area — reference it naturally within the paragraph, never as your opening phrase.
  - Opening atmosphere (MANDATORY — validator enforced): the first paragraph MUST contain at least one of: rain / wind / fog / storm / mist / thunder / evening / morning / night / dawn / dusk / season / afternoon / midday / noon / midnight / twilight / sunrise / sunset / daylight / sunlight / overcast / cloudy / bright / dark / grey / pale / cold / warm / chill / crisp / damp / drizzle / haze / lamplight / firelight. A chapter that omits all of these from its opening paragraph will be rejected.
  - PARAGRAPH OPENER DIVERSITY (MANDATORY — validator enforced): No more than 2 paragraphs in this chapter may begin with "Eleanor" or "Eleanor's" as the first word. You must vary paragraph openings throughout: use sensory observations, another character's name or action, dialogue, object or sound details, or temporal markers. Opening 3 or more paragraphs with "Eleanor" will cause automated rejection.
  - ⛔ MECHANISM SPOILER BAN: Do NOT state how the crime device was manipulated — not the direction, not the magnitude, not who performed it. Characters may only observe that two sources of evidence disagree. The specific method, tamper amount, and perpetrator's action are ALL FORBIDDEN until the reveal. WRONG: "The culprit had altered the device by forty minutes to create a false alibi." RIGHT: "Two independent pieces of evidence gave contradictory readings — a discrepancy neither could yet explain."
  - Continuity bridge: in the first 120 words, visibly connect from the previous chapter's final beat. Carry forward one unresolved element (object, accusation, emotional pressure, or immediate physical action) from: "Eleanor let her eyes drift to the lobby’s grand staircase, the banister gleaming in the flat light, and wondered how many secrets these walls had witnessed. The masquerade was over, but the masks remained. She tucked her...".
  - CLUE OBLIGATIONS — each clue below MUST be dramatized, but in YOUR OWN WORDS:
    Render each as something a character SEES, DOES, or SAYS on the page. The bracketed text is a
    DESCRIPTION of the evidence for you — do NOT transcribe it as narration. Copying a clue's
    description sentence verbatim into the prose FAILS validation.
    • button, hotel, employee, uniform, discovered [clue_1] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: hotel, employee, involved, murder
      ↳ MANDATORY TWO-PARAGRAPH STRUCTURE (must appear in paragraphs 1 or 2 — no later):
         Paragraph 1: The POV character physically approaches or directly observes this evidence.
           The narration or dialogue explicitly states what is seen (use the exact locked phrase if one applies).
         Paragraph 2 (immediately following): The detective or POV character explicitly reasons
           about what this evidence implies — who it implicates, why it may be unreliable,
           or what inference it supports. This must be a separate full paragraph, not a sentence appended to Paragraph 1.
    • button, linked, hotel, employee [clue_2] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: involvement, hotel, staff, murder, possible
      ↳ MANDATORY TWO-PARAGRAPH STRUCTURE (must appear in paragraphs 1 or 2 — no later):
         Paragraph 1: The POV character physically approaches or directly observes this evidence.
           The narration or dialogue explicitly states what is seen (use the exact locked phrase if one applies).
         Paragraph 2 (immediately following): The detective or POV character explicitly reasons
           about what this evidence implies — who it implicates, why it may be unreliable,
           or what inference it supports. This must be a separate full paragraph, not a sentence appended to Paragraph 1.
    • button, linked, hotel, employee [clue_culprit_direct_captain_ivor_hale] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      ⛔ SPOILER EMBARGO (pre-reveal chapter): surface ONLY the surface anomaly a character can see/hear/find.
         Do NOT name who it implicates, state the tamper direction or magnitude, or explain the mechanism in this chapter.
         Present it as an unexplained discrepancy; the culprit and method are revealed later.
         Place this OBSERVATION in paragraph 1 or 2 (observation only — no inference about the culprit).
    • three, witnesses, recall, seeing, captain, hale, lobby [clue_early_1] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: hale, alibi, questionable
      ↳ MANDATORY TWO-PARAGRAPH STRUCTURE (must appear in paragraphs 1 or 2 — no later):
         Paragraph 1: The POV character physically approaches or directly observes this evidence.
           The narration or dialogue explicitly states what is seen (use the exact locked phrase if one applies).
         Paragraph 2 (immediately following): The detective or POV character explicitly reasons
           about what this evidence implies — who it implicates, why it may be unreliable,
           or what inference it supports. This must be a separate full paragraph, not a sentence appended to Paragraph 1.
    • button, hotel, employee, uniform, discovered [clue_late_1] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: hotel, employee, involved, murder
      ↳ MANDATORY TWO-PARAGRAPH STRUCTURE (must appear in paragraphs 1 or 2 — no later):
         Paragraph 1: The POV character physically approaches or directly observes this evidence.
           The narration or dialogue explicitly states what is seen (use the exact locked phrase if one applies).
         Paragraph 2 (immediately following): The detective or POV character explicitly reasons
           about what this evidence implies — who it implicates, why it may be unreliable,
           or what inference it supports. This must be a separate full paragraph, not a sentence appended to Paragraph 1.
    • time, death, approximately, eight, clock [clue_mid_1] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: hale, alibi, cannot, trusted
      ↳ MANDATORY TWO-PARAGRAPH STRUCTURE (must appear in paragraphs 1 or 2 — no later):
         Paragraph 1: The POV character physically approaches or directly observes this evidence.
           The narration or dialogue explicitly states what is seen (use the exact locked phrase if one applies).
         Paragraph 2 (immediately following): The detective or POV character explicitly reasons
           about what this evidence implies — who it implicates, why it may be unreliable,
           or what inference it supports. This must be a separate full paragraph, not a sentence appended to Paragraph 1.
  - Tonal contrast: include at least one beat of relief or ironic counterpoint. Do not sustain maximum tension for every paragraph.
  - CLUE DISCLOSURE RULE (Stage 2/4):
    Characters may establish access and opportunity but must NOT state the crime method or draw the final clue-to-culprit connection. Investigation without conclusion.
    WRONG: dialogue or narration that directly explains how the crime was committed before Stage 4.
    RIGHT: observation, physical reaction, and logical inference that leaves the mechanism just off-screen.
  - SUSPECT-PRESSURE MODE: do NOT resolve the case in this chapter. No confession, arrest, final accusation, definitive culprit declaration, or case-closed language. End with unresolved pressure: a contradiction, narrowed suspicion, motive pressure, or a new question.
  - ALIBI LOCK: Captain Ivor Hale's established alibi is "Claims to have been in his office.". Do NOT place Captain Ivor Hale at any other location or in any other activity during the crime window. Any contradiction is a continuity error that triggers a retry.
  - TESTIMONY CONTINUITY: Captain Ivor Hale has already made statements in earlier chapters. Any time, location, or claim attributed to Captain Ivor Hale in THIS chapter must be consistent with those earlier statements. Do NOT introduce a new or different alibi claim — any contradiction is a continuity error.
- Locked fact phrase obligations:
  - If this batch mentions A missing button from the hotel employee's uniform found at the crime scene., write exactly: "one".
  - If this batch mentions Three witnesses recall seeing the murderer at the ball., write exactly: "three".
  - If this batch mentions The costume matches the description of a character seen at the event., write exactly: "the same".
  - If this batch mentions The masquerade ball started at half past eight at night, coinciding with the time of the murder., write exactly: "half past eight at night".
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
Batch chapters: 3-3.
Investigation state at start: 5 clue(s) revealed to reader; approximately 3 unresolved suspect(s).
Must change by end: Increase or complicate suspicion through a new pressure revelation — WITHOUT resolving the case: do NOT name, accuse, or extract a confession from the culprit, make an arrest, or declare the case closed (that is reserved for the final reveal).
Suspect pressure target(s): Dr. Mallory Finch, Sylvia Trent
Required new information: At least one fear/motive/lie/loyalty reveal with investigative consequence.
Forbidden reveals at this stage: No culprit resolution: no confession, no arrest, no 'case closed', no accusation ('I accuse'/'I name'), and never state 'the culprit/murderer/killer is/was …'. The accusation is reserved for the final reveal — build suspicion only.

FROZEN FACT STATE (DO NOT ALTER):
- Timeline anchor: January (winter).
- Month, season, weather, and time-of-year language in this batch must stay compatible with winter.
- Established timeline fact: Time of death at approximately eight o'clock.
- If referenced, use exact phrase: "one" (A missing button from the hotel employee's uniform found at the crime scene.).
- If referenced, use exact phrase: "three" (Three witnesses recall seeing the murderer at the ball.).
- If referenced, use exact phrase: "the same" (The costume matches the description of a character seen at the event.).
- If referenced, use exact phrase: "half past eight at night" (The masquerade ball started at half past eight at night, coinciding with the time of the murder.).

STORY TO DATE (REFERENCE ONLY — DO NOT COPY VERBATIM):
- Full prior chapter text is provided below for continuity, factual consistency, and reference accuracy.
- Use this to keep character voice, chronology, clue state, and location continuity aligned with earlier chapters.
- Do not quote, copy, or paraphrase these paragraphs too closely; write fresh prose that remains consistent with them.

--- BEGIN PRIOR CHAPTER 1 ---
Title: Chapter 1: Shadows Across the Lobby
Eleanor Voss pressed a gloved palm to the polished brass handle and pushed open the door leading from the Grand Lobby into the lounge, the faint scent of damp velvet and cold tobacco smoke clinging to the air. A pale January morning seeped through the tall windows, illuminating the faded grandeur of the seaside hotel lobby, while the steady tap of rain against the panes underscored the hush that had fallen over the assembled guests. The hush fractured abruptly: sprawled in unnatural stillness on the Turkish rug lay Beatrice Quill, her masquerade mask askew, the bright silk scarf that had lent her costume such charm now twisted cruelly around her throat.

There was no mistaking the shock that radiated in waves through the room. Captain Ivor Hale, the retired naval officer whose presence usually steadied a crowd, stood near the body, posture rigid, eyes flicking from Beatrice Quill’s face to the other guests as if searching for an adversary on a darkened deck. Behind him, Dr. Mallory Finch—her winter coat still buttoned to the throat as if she had not yet shed the outside chill—moved with clinical purpose toward Beatrice Quill, but her steps faltered. In the corner, Hugo Vane, the hotel’s manager, gripped the back of a velvet chair with enough force to blanch his knuckles, his gaze darting from the corpse to the smeared footprints on the tiles. Sylvia Trent hovered by the fireplace, pearl-studded clutch pressed to her side, her features composed save for the tremor in her voice as she whispered a prayer. The silence was punctuated only by the distant echo of a radio news bulletin—‘…Cold War tensions rising…’—and the rain’s persistent drumming.

Eleanor knelt, careful to avoid the spreading shadow beneath Beatrice Quill’s head. The scarf’s knot was neat, almost deliberate. Beside Beatrice Quill’s outflung hand, Eleanor’s gaze snagged on a small, incongruous detail: a hotel uniform button, the brass dulled with age—one—lying half-concealed beneath the hem of Beatrice Quill’s skirt. She retrieved it with a handkerchief, holding it up to the watery light. The button was of the type worn by the staff here, an ordinary object rendered suddenly sinister.

The fact of its presence so near Beatrice Quill’s body unsettled Eleanor. It spoke of proximity, of a hurried struggle, perhaps—a hotel employee, or someone passing as one. She glanced up, scanning the faces: Hugo Vane looked away, Sylvia Trent’s lashes fluttered, and Dr. Finch’s lips parted as if to speak, then pressed together. Captain Hale, for his part, seemed to study the button with a sailor’s focus, but said nothing.

A cluster of guests had gathered at the threshold, the commotion drawing the curious and the anxious alike. One, a woman in a moth-eaten fur stole, piped up, ‘I saw Captain Hale in the lobby, just after eight—he was speaking with Beatrice Quill. There were three of us, perhaps more, who noticed him.’ Her declaration drew a ripple of murmurs, some affirming, others uncertain. Eleanor filed the detail away. The masquerade ball had begun at half past eight at night, and the timing put Captain Hale in the public eye when the murder must have occurred.

But even as the witness’s words hung in the air, Eleanor noted the incongruity. Captain Hale’s own statement, offered moments before to the consternation of Hugo Vane, was clear: he claimed to have been in his office, seeing to the final arrangements for the evening’s festivities. The contradiction between his account and the testimony of three witnesses was as sharp as the taste of cold tea left too long. —before his mask of composure returned.

Eleanor straightened, brushing a strand of hair back beneath her cloche hat, and addressed the room with the clipped, precise tone that had earned her a reputation as both journalist and investigator. ‘There are stories already diverging,’ she said. ‘Three guests place Captain Hale in the lobby at the critical hour, yet he claims otherwise. And this button—’ she held it aloft, the dull brass catching the grey light ‘—suggests a member of staff, or someone dressed as one, was uncomfortably close to Beatrice Quill when she died. I am compelled to ask: isn’t it curious how the truth always seems to hide, especially when so many are watching?’

A low, uneasy laughter fluttered at the edge of the group—nervous, brittle. Hugo Vane cleared his throat, his tone brisk. ‘We mustn’t jump to conclusions, Miss Voss. The hotel uniform is hardly unique, and this is, after all, a masquerade ball. Costumes, confusion, a night of celebration—perhaps the simplest explanation will prove the truest.’

‘Perhaps,’ Eleanor replied, not bothering to mask her skepticism. Her gaze returned to the body, the mask, the scarf, the button. The air in the lobby felt charged, the rain’s rhythm on the glass now a metronome for mounting tension. Somewhere deeper in the hotel, a telephone rang, unanswered. Outside, the sea moaned beneath the wintry sky. In that moment, Eleanor saw not only the tragedy of Beatrice Quill’s death, but the fraught, shifting alliances that would shape the search for her killer.

Captain Hale finally spoke, breaking the brittle quiet. ‘We’re all on the same side here, Miss Voss. Let’s not let suspicion run aground before we’ve charted the waters, eh?’ His attempt at levity fell flat, and a new silence settled, heavy as the winter clouds over Bournemouth.

Eleanor turned to Dr. Finch, whose gloved hands trembled just perceptibly. ‘Dr. Finch,’ Eleanor asked quietly, ‘were you with the guests when the music ended?’ Dr. Finch’s eyes lingered on the body before she replied, voice even but strained, ‘I was in the corridor, just before the commotion. I… I saw nothing, but I heard the clock in the lobby chime. I thought nothing of it then.’

The mention of the clock seemed to anchor everyone’s attention. Eleanor felt the pieces shifting, not yet forming a pattern, but already scraping against one another. The rain intensified, streaking the windows with blurred reflections of the masked faces still clustered in the lobby, each one now a potential player in the unfolding drama.

For a moment, the tension abated—someone coughed, and Sylvia Trent murmured something about the absurdity of tragedy arriving on a night meant for joy. But the reprieve was brief. The cold returned, carrying with it a new sense of purpose. Eleanor pocketed the button, knowing it would weigh on her mind as heavily as the questions already gathering in the wintry air.

She moved aside as the constable arrived, but it was clear from the way eyes turned to her, the way Hugo Vane deferred and Captain Hale bristled, that the role of investigator had already been assigned. Eleanor Voss, for better or worse, was the axis upon which the next hours would turn. And as she looked once more at Beatrice Quill, at the scarf and the mask and the lifeless hush, Eleanor promised herself she would not let the truth slip away this time—not behind a mask, nor beneath the weight of silence.
--- END PRIOR CHAPTER 1 ---

--- BEGIN PRIOR CHAPTER 2 ---
Title: Chapter 2: Contradiction
"You’re certain you never left your office?" Eleanor asked, her voice carrying across the hush that had settled in the hotel lobby. The faint echo of rain against the glass mingled with the muffled sound of distant laughter from the Dining Room, but here, in the heart of the Cliffside Grand, the air was thick with the scent of damp wool and the sharp tang of recently polished brass. Shadows stretched along the marble floor, elongated by the grey midwinter light that filtered through high windows. Eleanor’s gloved fingers trembled ever so slightly as she gripped her notepad, the question hanging between her and Captain Hale like a challenge.

Hale squared his shoulders, the lines of his navy-blue suit crisp even in the dim glow. "I was in my office, Miss Voss. Preparing the final tally for the masquerade. I didn’t step foot in this lobby until after the commotion began." His tone was practiced, almost bored, but Eleanor noted the way his gaze flickered—not quite meeting hers, not quite steady. Behind him, the constable’s presence was a silent warning: this was no longer a matter of social embarrassment, but of suspicion. Eleanor’s mind returned to the precise detail she could not ignore: the time of death at approximately eight o'clock. The clock in the lobby had chimed, a fact confirmed by Dr. Finch and echoed by the guests who had gathered just before the tragedy unfolded.

The contradiction was plain. Three witnesses had placed Captain Hale in the lobby at the critical hour, their accounts aligning with the start of the masquerade ball at half past eight at night. Yet Hale’s insistence on his office-bound alibi was unshakable. Eleanor weighed the evidence, her thoughts racing. If the time of death was indeed at approximately eight o'clock, then Hale’s story could not stand unchallenged. Either the witnesses were mistaken—a possibility, given the confusion of masks and costumes—or Captain Hale was lying.

She let the silence linger, watching the tension coil in the set of Hale’s jaw. A gust of wind rattled the windowpanes, underscoring the brittle stillness that had fallen over the lobby. Eleanor’s mind sifted through the implications: if Hale’s alibi was unreliable, it cast a shadow over everything that followed. The masquerade’s chaos might have offered cover for anyone with the nerve to exploit it, but only Hale’s whereabouts were so sharply disputed. The contradiction was no longer a detail—it was a fracture line running through the case.

Dr. Mallory Finch stepped forward, her voice measured but edged with something brittle. "The clock was quite clear, Miss Voss. I remember the chime—eight, precisely. I was in the corridor, and I saw Captain Hale pass through the lobby. I wasn’t the only one." Her hands, still gloved, were folded tightly in front of her. Eleanor caught the subtle plea in Dr. Finch’s eyes: to be believed, to have her memory trusted over the captain’s certainty.

Captain Hale’s lips curled in a half-smile, the kind that might have charmed a room under other circumstances. "A masquerade, Doctor. Faces hidden, voices changed. Are you sure it was me?" His tone was sardonic, but Eleanor noted the way his hand strayed to his pocket, fingers drumming against the fabric. The bravado was a shield—one that, under scrutiny, seemed to thin.

Eleanor’s reply was dry, almost offhand: "It’s remarkable how the simplest details become slippery, isn’t it? Especially when the truth is so inconvenient." She saw the flicker of irritation in Hale’s eyes, and something else—wariness, perhaps, or the calculation of a man used to command. The lobby’s silence was punctuated by the distant crash of waves against the cliffside, a reminder of the world outside these walls, indifferent to the drama unfolding within.

Hugo Vane appeared at the periphery, his presence unobtrusive but not unnoticed. He hovered near the velvet settee, eyes darting between Eleanor and Hale. Eleanor wondered, briefly, whose side Hugo Vane might take if forced to choose. The alliances here were as shifting as the winter light, and trust was a currency in short supply.

Dr. Finch’s composure faltered for a heartbeat, her breath fogging in the cold air that crept through the lobby’s old stone. "I know what I saw," she said quietly. "And I know the difference between a mask and a man." The words hung in the air, more accusation than assertion.

Captain Hale’s response was a shrug, broad-shouldered and theatrical. "If three guests say they saw me here, then perhaps I was everywhere and nowhere, like the Flying Dutchman. But I assure you, Miss Voss, I was in my office. The staff can confirm it." His gaze was steady now, daring her to press further.

Eleanor’s mind reeled through the possibilities. The original meaning of the witness statements had been simple: Hale was present, visible, part of the festivities. But now, with his denial so absolute, the meaning shifted. Was it possible someone had impersonated him? Or was the confusion of the ball being used to muddy the waters? The contradiction was no longer a mere discrepancy—it was a warning that the truth would not be easily won.

She glanced at Dr. Finch, whose posture had grown rigid, and then at Hale, whose confidence seemed to waver only in the smallest gestures: a tightening of the jaw, a glance toward the corridor. Eleanor realized that the pressure of suspicion had begun to shift the balance in the room. Hale’s alibi, once a shield, now made him vulnerable. The witnesses’ certainty, once reassuring, now felt like a trap—one that might snap shut on the wrong person if she was not careful.

The lobby’s atmosphere thickened with every passing minute. The rain outside intensified, streaking the windows with rivulets that caught the dim light. A radio in the corner crackled with static, then the faint strains of a news bulletin: more talk of shortages, of rationed fuel and the slow grind of recovery. Eleanor felt the weight of the era pressing in—how every conversation here was shaped by what had come before, by the secrets people carried from the war and the new uncertainties that haunted the present.

She shifted her stance, drawing herself up. "Captain Hale, if you were in your office, then someone is lying. Either you, or three guests who have no reason to conspire. I intend to find out which." Her words were crisp, but the vulnerability in her voice was real. She could not afford to be wrong—not again.

Hale’s reply was softer than before, almost weary. "We’re all trying to make sense of chaos, Miss Voss. Perhaps the truth is as masked as any of us." He turned away, the conversation closed for now, but Eleanor saw the tension in his shoulders as he walked toward the corridor. The performance was over, but the consequences remained.

Dr. Finch lingered, her gaze following Hale. "He’s hiding something," she murmured, more to herself than to Eleanor. The words were not a revelation but a confirmation of what Eleanor already suspected. The contradiction in Hale’s alibi had become the fulcrum of the investigation, and with it, the first real crack in the mask of civility that had shielded the guests from the horror of Beatrice Quill’s death.

Eleanor let her eyes drift to the lobby’s grand staircase, the banister gleaming in the flat light, and wondered how many secrets these walls had witnessed. The masquerade was over, but the masks remained. She tucked her notepad away, the questions multiplying, and prepared to press further—knowing that the truth, slippery as ever, would not surrender itself without a fight.
--- END PRIOR CHAPTER 2 ---

[SCENE COMPLETENESS CONTRACTS — MANDATORY. Each contract below lists what you MUST enact in that chapter. Do not summarise or mention these labels in the prose — enact them organically.]
Chapter 3 (Act 1) completeness contract:
  PIVOT ELEMENT (MANDATORY — write this into the prose, shown not told): "The missing button from a hotel uniform found at the crime scene."
  FACT ESTABLISHED (MANDATORY — reader must know this by chapter end): "Establishes that a hotel staff member was likely present during the murder."

# Case Overview
Title: Masquerade of Authority
Era: 1940s
Setting: seaside
Crime: murder (impersonation)
Culprit: Captain Ivor Hale
Victim: Beatrice Quill
False assumption: Captain Hale was in his office at the time of the murder, as he stated.
Cast: Eleanor Voss (she/her), Dr. Mallory Finch (she/her), Captain Ivor Hale (he/him), Beatrice Quill (she/her), Sylvia Trent (she/her), Hugo Vane (he/him)

Setting Lock: Keep all scenes and descriptions consistent with the stated setting (seaside). Do not introduce a different location type. Do not invent an alternative estate name. The only permitted name for this property is "seaside" — any other estate name (e.g., "Caldwell Manor", "Ashwood Hall", or any invented proper name) is a continuity error that will be caught and rejected.

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
    "sceneNumber": 3,
    "act": 1,
    "title": "Witness Accounts",
    "setting": {
      "location": "the hotel dining area",
      "timeOfDay": "Midday",
      "atmosphere": "A mix of curiosity and fear among the guests"
    },
    "characters": [
      "Eleanor Voss",
      "Dr. Mallory Finch",
      "Sylvia Trent"
    ],
    "purpose": "Gather witness statements and establish timelines",
    "cluesRevealed": [
      "clue_1",
      "clue_2",
      "clue_culprit_direct_captain_ivor_hale"
    ],
    "dramaticElements": {
      "conflict": "Witnesses provide conflicting testimonies.",
      "tension": "Eleanor senses something deeper is at play.",
      "microMomentBeats": [
        "Beatrice's eyes dart nervously as she recounts her evening, betraying her discomfort."
      ]
    },
    "summary": "Eleanor interviews witnesses in the dining area. Dr. Finch claims to have seen Hale in the lobby shortly after the murder, while Beatrice and Sylvia provide their accounts. A missing button from a hotel uniform is discovered, hinting at a staff member's involvement. Eleanor notes that Hale's presence at the crime scene contradicts his earlier statements.",
    "beat": "first_enquiries",
    "estimatedWordCount": 1250,
    "pivotElement": "The missing button from a hotel uniform found at the crime scene.",
    "factEstablished": "Establishes that a hotel staff member was likely present during the murder.",
    "permittedBehavioursByAct": [
      {
        "characterName": "Eleanor Voss",
        "behaviour": "Show normal social behaviour; grief or confusion if appropriate."
      },
      {
        "characterName": "Dr. Mallory Finch",
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
    "emotionalRegister": "Eleanor's investigation reveals a web of secrets that complicates her search for the truth.",
    "dominantCharacterNote": {
      "name": "Eleanor Voss",
      "voiceRegister": "Eleanor's voice carries a sharp urgency, often laced with a hint of vulnerability that reveals her inner conflicts."
    },
    "humourGuidance": {
      "permission": "permitted",
      "character": "Eleanor Voss",
      "form": "dry_wit"
    },
    "eraTextureNote": "Short daylight hours with limited time for social interactions.; Limited public transportation options due to rationed fuel.; Ongoing shortages of goods affecting daily life.",
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
□ Chapter 3: the clue [clue_1] (missing, button, hotel, uniform, crime, scene) is placed in the first 25% of the chapter, dramatized in your own words, followed by an explicit inference or suspicion paragraph.
□ Chapter 3: the clue [clue_2] (button, suggests, hotel, staff, member, present, murder) is placed in the first 25% of the chapter, dramatized in your own words, followed by an explicit inference or suspicion paragraph.
□ Chapter 3: the clue [clue_culprit_direct_captain_ivor_hale] (direct, ties, captain, ivor, hale, mechanism, access, point, before, discriminating, excludes, competing) is placed in the first 25% of the chapter, dramatized in your own words, followed by an explicit inference or suspicion paragraph.
□ Chapter 3: the clue [clue_early_1] (witnesses, report, seeing, captain, hale, lobby, eight, murder) is placed in the first 25% of the chapter, dramatized in your own words, followed by an explicit inference or suspicion paragraph.
□ Chapter 3: the clue [clue_late_1] (missing, button, hotel, uniform, crime, scene) is placed in the first 25% of the chapter, dramatized in your own words, followed by an explicit inference or suspicion paragraph.
□ Chapter 3: the clue [clue_mid_1] (hale, alibi, claiming, office, time, false) is placed in the first 25% of the chapter, dramatized in your own words, followed by an explicit inference or suspicion paragraph.
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
