# Actual Prompt Record

- Run ID: `mystery-1784150843898`
- Project ID: ``
- Timestamp: `2026-07-15T21:34:10.981Z`
- Agent: `Agent9-ProseGenerator-Ch2`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4.1`
- Temperature: `0.42`
- Max Tokens: `4500`
- Attempt: `first`
- Prompt Hash: `4ec6bf42f0228078`

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
- MORAL COMPLEXITY REQUIREMENT: The mechanism of this crime carries a moral gray area: "The murderer acted out of love, believing they were protecting the victim from a greater harm." — the culprit reveal and denouement MUST acknowledge this ambiguity. Do not let the ending feel clean or simple. Give the reader at least one moment of uncomfortable sympathy or moral doubt.

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
   - Eleanor Voss: Local Entrepreneur
   - Dr. Mallory Finch: Conflicted Professional
   - Captain Ivor Hale: Stoic Guardian
   - Beatrice Quill: Young Idealist
   - Sylvia Trent: Matriarch
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

## Era: February 1946
Living in February 1946 means navigating a world still reeling from the aftermath of World War II. The coastal town of Brighton feels the weight of history, as returning soldiers carry the scars of war, and women are increasingly stepping into roles that challenge traditional norms. The air is filled with a sense of uncertainty as rationing continues, and social dynamics shift. Conversations often revolve around the struggles of reintegration, and the specter of the Cold War looms ominously in the background. The hotel, a microcosm of society, reflects these changes, with its guests embodying the complexities of post-war life, each harboring their own secrets and aspirations.
Emotional register: A collective sense of anxiety and hope emerges, as individuals grapple with the past while seeking to carve out new identities.
Physical constraints: Limited transportation options due to fuel rationing. | Communication often hindered by wartime remnants and ongoing restrictions. | Short daylight hours impact social gatherings and activities.
Current tensions (weave into background texture): Rising tensions as the Iron Curtain descends over Eastern Europe. | Increased awareness of veterans' struggles with PTSD. | Economic recovery hampered by inflation and ongoing rationing.
Wartime context — Many returning soldiers are struggling to reintegrate into civilian life, facing both physical and psychological challenges.: Families are often strained, with veterans and their loved ones navigating the complexities of trauma and recovery. Absence effect: The absence of husbands and fathers during the war has left a void in many homes, creating both tension and resilience in the face of change.

## Season Lock (mandatory — derived from February 1946)
Season: winter. Allowed vocabulary: winter, wintry, midwinter
Forbidden seasonal words — never use in narration, dialogue, or metaphor: spring, summer, autumn and their adjectival forms.
Every weather description, atmosphere, and time-of-year reference must be consistent with winter.

## Story Theme
The quest for truth amidst deception reveals the fragility of identity and the costs of hidden secrets in a post-war society, and reveals that evidence carries ethical weight, forcing characters to choose accountability over social performance when appearances and facts collide.

## Story Emotional Register
Dominant: The narrative is steeped in tension and anticipation, reflecting the fragility of identity amidst hidden truths.

Arc:
The story opens within the opulent yet foreboding walls of The Seaside Grandeur, where guests gather during a stormy February evening, unaware that a murder will soon shatter the fragile peace. The discovery of Hugo Vane’s body ignites an investigation led by the seasoned detective, Eleanor Voss. As she delves into the lives of the hotel’s eclectic guests, a sense of rising unease permeates the air; each clue uncovers deeper secrets, revealing the emotional toll of war and societal expectations that haunt them.

The investigation takes a critical turn when Eleanor uncovers the gramophone mechanism, pointing to a deliberate deception that reshapes her understanding of the murder. Just when she believes she has the case cracked, a revelation about the true nature of Vane’s dealings shifts her focus, leading her to question the motives of those closest to him. As tension mounts, Eleanor confronts the suspects, each grappling with their own burdens and fears, culminating in a dramatic climax that forces them to confront their shared past and hidden identities. Ultimately, the resolution not only brings the truth to light but also leaves each character grappling with the emotional costs of their secrets, forever altering their lives in the wake of the truth.

## Emotional register at this point in the story
The atmosphere is thick with anticipation and underlying tension.

## Character Portraits (appearance & era)

### Eleanor Voss
Eleanor Voss embodies the tension of the post-war era, balancing her role as a respected art gallery owner with the hidden turmoil of financial struggles. Her sophistication masks the desperation of her situation, reflecting the societal pressures faced by women seeking independence while navigating traditional expectations. Eleanor's desire to uncover family secrets parallels the broader quest for truth in a society grappling with its past.
Era intersection: Her financial woes and quest for truth intersect with the historical moment as women like her challenge societal norms in a changing world.

### Dr. Mallory Finch
Dr. Mallory Finch personifies the internal struggles of returning veterans, grappling with PTSD while striving to maintain her professional identity as a psychiatrist. Her compassionate exterior hides the chaos of her mind, mirroring the broader societal issues of mental health awareness in a post-war context. Mallory's fear of exposure reflects the collective anxiety of many who carried the burdens of war in silence.
Era intersection: Mallory's battle with her past and the stigma of mental health during this time highlight the challenges faced by those seeking to reintegrate into society.

### Captain Ivor Hale
Captain Ivor Hale represents the traditional values threatened by the shifting dynamics of post-war life. His dignified demeanor masks the weight of familial expectations and personal secrets, reflecting the struggles of many who find their roles challenged in an evolving society. Ivor's commitment to protecting his legacy speaks to the tensions between tradition and progress in a world still healing from the scars of conflict.
Era intersection: His internal conflict between honoring family values and adapting to change encapsulates the struggles of men in a post-war society.

### Beatrice Quill
Beatrice Quill symbolizes youthful ambition and the pursuit of truth in a world of uncertainty. Her drive to uncover secrets reflects the changing roles of women as they seek independence and recognition in their careers. Yet, her financial struggles highlight the pressures faced by many young professionals in the aftermath of the war, as they navigate both personal and societal expectations.
Era intersection: Beatrice's desire to make a name for herself in journalism mirrors the aspirations of women breaking barriers in a post-war economy.

### Sylvia Trent
Sylvia Trent embodies the tensions between tradition and the evolving roles of women in society. As a retired teacher, her wisdom and nurturing spirit contrast with her feelings of resentment towards the younger generation. Her struggle to reclaim her place in the family amidst changing dynamics reflects the broader societal shifts as women strive for recognition and respect in a post-war context.
Era intersection: Sylvia's challenges in maintaining her legacy amidst familial changes highlight the generational conflicts arising in the wake of societal evolution.

## Character Voices

### Eleanor Voss (she/her/her)
Eleanor speaks with a measured cadence, employing art-related metaphors and punctuating her dialogue with dry wit.
[comfortable] As I often say, the brushstrokes of life can be both bold and delicate.
[evasive] It’s all very complicated, really. Perhaps we should discuss it over a glass of wine?
[stressed] I can’t afford any missteps now. Everything hangs by a thread!
Humour: Her dry wit often provides a refreshing contrast to the tension around her.

### Dr. Mallory Finch (she/her/her)
Mallory speaks in a soft, measured tone, often avoiding eye contact when discussing her past.
[comfortable] It’s essential to understand that healing is a multifaceted process.
[evasive] I’d rather not delve into that topic if you don’t mind.
[stressed] I can’t let my past define me; I must remain focused!

### Captain Ivor Hale (he/him/his)
Ivor speaks with a commanding presence, often peppering his dialogue with dry humor and naval anecdotes.
[comfortable] In my day, discipline was the cornerstone of success.
[evasive] Let’s not dwell on the past; it’s the future we must consider.
[stressed] I fear for the legacy of my family; it weighs heavily on me!
Humour: His self-deprecating humor adds depth to his serious demeanor.

### Beatrice Quill (she/her/her)
Beatrice speaks with energetic cadence, often lacing her dialogue with witty remarks and sharp observations.
[comfortable] You know, the truth is a slippery little fish, isn't it?
[evasive] I’m just doing my job; nothing more, nothing less.
[stressed] This could ruin me if I’m not careful; I have to tread lightly!
Humour: Her sardonic wit often lightens the mood in tense situations.

### Sylvia Trent (she/her/her)
Sylvia speaks gently yet firmly, using anecdotes to convey her wisdom and wielding subtle sarcasm.
[comfortable] Ah, the youth today, so quick to forget their roots!
[evasive] I’d prefer to keep certain matters within the family.
[stressed] My contributions have been overlooked, and it’s quite disheartening!
Humour: Her polite savagery often reveals her underlying frustrations.

## Location Registers (scene framing guides)

Grand Lobby: The Grand Lobby embodies a mix of elegance and tension, where guests exchange pleasantries beneath the shimmering chandeliers while underlying anxieties simmer just below the surface.. Camera angle: A writer entering this space should capture the palpable tension, where every conversation could unearth hidden truths.. Era: The ambiance reflects the post-war societal shifts, creating a space where traditional values clash with emerging modernity.

Oceanview Dining Room: The Oceanview Dining Room feels both inviting and fraught with tension, where the crashing waves outside mirror the unease of the guests dining within, each bite punctuated by unspoken worries.. Camera angle: A writer should convey the duality of comfort and tension, where every shared meal could be the last before secrets are revealed.. Era: The elegance of the dining room contrasts starkly with the realities of post-war rationing and lingering anxieties.

Private Library: The Private Library offers a sanctuary of knowledge, yet it carries an undercurrent of suspicion, with every whisper echoing the secrets hidden within its walls.. Camera angle: A writer should focus on the contrasts between the warmth of the fire and the chilling truths whispered among guests.. Era: Its cozy yet secretive atmosphere reflects the complexities of relationships in a post-war world.

Clifftop Garden: The Clifftop Garden provides a breathtaking view, yet the wildflowers swaying in the wind seem to whisper secrets of the past, creating an atmosphere both beautiful and foreboding.. Camera angle: A writer should emphasize the tension between the garden's tranquility and the storm of emotions brewing within the hotel.. Era: The garden’s rugged beauty reflects the struggles of the characters, caught between tradition and change.

## Humour guidance for this story position (opening)
Permission: forbidden
Rationale: The serious nature of the murder sets a somber tone, making humor inappropriate.

FAIR-PLAY AND INFERENCE CONTRACT:
- FAIR PLAY CLUE TIMING: Never combine clue discovery and detective deduction in the same chapter. If a clue is first revealed to the reader in chapter N, the detective may only analyze, deduce from, or act on that clue in chapter N+1 or later.
- FAIR PLAY INFORMATION PARITY: The reader must see all clues BEFORE the detective uses them in reasoning. If the detective performs a test or makes a deduction, every piece of evidence supporting that conclusion must have been shown to the reader in earlier chapters.
- FAIR PLAY REVELATION SPACING: In the discriminating test scene, the detective can ONLY use clues that were revealed to the reader at least 1 full chapter earlier. Never introduce new clues or withheld information during the test.
- FAIR PLAY CONFRONTATION: During the final confrontation/revelation, the detective cannot surprise the reader with facts. Every piece of evidence cited must have been visible to the reader in prior chapters.
- Never solve by withheld information. Keep reader-information parity with detective reasoning.
- False assumption in force: Hugo Vane was alive and conversing with guests at the time of his death.
- Hidden truth to progressively expose (compose in your own words from these elements): actual, time, death, method, murder
- Inference path checkpoints to dramatize clearly — compose ENTIRELY in your own sentences from these key terms (reproducing any briefing phrase verbatim FAILS validation):
  - Step 1: obs: witnesses, report, hearing, hugo, vane, voice, lounge, minutes, past | corr: conflicts, medical, examiner, report, stating, vane, died, clock | effect: narrows, time, death, before, voice, heard, raising, suspicion, gramophone
  - Step 2: obs: record, gramophone, scratched, specific, pattern | corr: suggests, gramophone, played, shortly, before, time, death | effect: eliminates, possibility, accidental, playback, guests
  - Step 3: obs: footprints, leading, gramophone, match, finch, shoes | corr: indicates, accessed, gramophone, shortly, before, murder | effect: narrows, suspect, pool, implicating, finch
- Discriminating test method: trap
- Discriminating test elements to dramatize (compose ENTIRELY in your own sentences from these — do NOT reproduce any briefing phrase verbatim): recreating, sound, setup, gramophone, demonstrate, recording, mislead, people, victim, presence
- Test must rely on already-shown clue IDs: clue_1, clue_mechanism_visibility_core, clue_2, clue_early_1
- Fair-play rationale: Step 1: Witness statements (early) and medical examiner's report (mid) let the reader narrow time of death. Step 2: The scratched record (mid) indicates manipulation. Step 3: Footprints near the gramophone (mid) implicate Dr. Finch.

## Character Reference

### Eleanor Voss (she/her — NEVER he/him)
Eleanor speaks with a measured cadence, often punctuating her sentences with a wry observation
She tends to employ art-related metaphors, which can either illuminate or obscure her true feelings.
Eleanor wrestles with the guilt of her financial deceit and the moral implications of her family's hidden truths, fearing that uncovering these secrets could shatter her community standing.
Voice colour: Eleanor Voss uses dry wit humour — let it surface in their dialogue where natural, not in every line.

### Dr. Mallory Finch (she/her — NEVER he/him)
Mallory speaks in a soft, measured tone, often avoiding eye contact when discussing her past
Her dialogue is filled with clinical terminology, but cracks appear when her emotions surface, revealing the fragility underneath.
Mallory is torn between her professional integrity and the fear of her past being revealed, battling feelings of worthlessness and guilt over her inability to save those she once treated.

### Captain Ivor Hale (he/him — NEVER she/her)
Ivor speaks with a commanding presence, his voice deep and resonant, often punctuated by anecdotes from his naval days
He occasionally employs dry humor to deflect from his vulnerabilities.
Ivor grapples with the tension between his steadfast beliefs and the shifting values of his family, torn between protecting his legacy and accepting the inevitable changes ahead.
Voice colour: Captain Ivor Hale uses self deprecating humour — let it surface in their dialogue where natural, not in every line.

### Beatrice Quill (she/her — NEVER he/him)
Beatrice speaks with an energetic cadence, peppering her conversations with witty remarks and sharp observations
Her dialogue often reflects her youthful idealism, occasionally laced with a biting sarcasm.
Beatrice is torn between her ambition and her ethics, wrestling with the implications of her pursuit for a story that could define her career while risking her integrity.
Voice colour: Beatrice Quill uses sardonic humour — let it surface in their dialogue where natural, not in every line.

### Sylvia Trent (she/her — NEVER he/him)
Sylvia speaks with a gentle yet firm tone, often using anecdotes and parables to convey her wisdom
She possesses an ability to wield subtle sarcasm, making her observations both poignant and cutting.
Sylvia struggles with her feelings of entitlement and resentment towards the younger generation, wrestling with the need to adapt her values while clinging to the traditions she holds dear.
Voice colour: Sylvia Trent uses polite savagery humour — let it surface in their dialogue where natural, not in every line.


## CHARACTER CONTRACTS (binding for this scene)
Each entry below constrains how this character must be written in this chapter.
These override generic style guidance when they conflict.

### Eleanor Voss[SHE]
Voice & mannerisms: Eleanor speaks with a measured cadence, often punctuating her sentences with a wry observation. She tends to employ art-related metaphors, which can either illuminate or obscure her true feelings.
SIGNATURE TIC (use sparingly — this is Eleanor Voss's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): ""Life, like art, requires a certain brushstroke of boldness.""
Sample voice fragments (match this register and rhythm):
  [comfortable] "As I often say, the brushstrokes of life can be both bold and delicate."
  [evasive] "It’s all very complicated, really. Perhaps we should discuss it over a glass of wine?"
Humour: dry wit — deploy occasionally (level 0.5)
FORBIDDEN phrase (never write for Eleanor Voss): "a surge of determination washed over her"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Her quest to expose family secrets intertwines with her financial struggles, creating a perilous cocktail of ambition and desperation that threatens to unravel her carefully curated life." — do not surface in Act I.

### Dr. Mallory Finch[SHE]
Voice & mannerisms: Mallory speaks in a soft, measured tone, often avoiding eye contact when discussing her past. Her dialogue is filled with clinical terminology, but cracks appear when her emotions surface, revealing the fragility underneath.
SIGNATURE TIC (use sparingly — this is Dr. Mallory Finch's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): ""It’s all a matter of perspective, isn't it?""
Sample voice fragments (match this register and rhythm):
  [comfortable] "It’s essential to understand that healing is a multifaceted process."
  [evasive] "I’d rather not delve into that topic if you don’t mind."
Humour: none — this character plays it straight in all scenes
FORBIDDEN phrase (never write for Dr. Mallory Finch): "sighed deeply and felt a sense of peace"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "An unresolved conflict with the victim, who threatened to expose her troubled past, adds a layer of complexity to her already tenuous situation." — do not surface in Act I.

### Captain Ivor Hale[HE]
Voice & mannerisms: Ivor speaks with a commanding presence, his voice deep and resonant, often punctuated by anecdotes from his naval days. He occasionally employs dry humor to deflect from his vulnerabilities.
SIGNATURE TIC (use sparingly — this is Captain Ivor Hale's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): ""In my day, we didn’t question orders; we followed them. Times have changed, I suppose.""
Sample voice fragments (match this register and rhythm):
  [comfortable] "In my day, discipline was the cornerstone of success."
  [evasive] "Let’s not dwell on the past; it’s the future we must consider."
Humour: self deprecating — deploy occasionally (level 0.4)
FORBIDDEN phrase (never write for Captain Ivor Hale): "she knew with certainty she was right"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "His fear of the victim's plans to sell the family estate threatens not only his legacy but also the very values he has sworn to uphold." — do not surface in Act I.

### Beatrice Quill[SHE]
Voice & mannerisms: Beatrice speaks with an energetic cadence, peppering her conversations with witty remarks and sharp observations. Her dialogue often reflects her youthful idealism, occasionally laced with a biting sarcasm.
SIGNATURE TIC (use sparingly — this is Beatrice Quill's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): ""You know, the truth is a slippery little fish, isn't it?""
Sample voice fragments (match this register and rhythm):
  [comfortable] "You know, the truth is a slippery little fish, isn't it?"
  [evasive] "I’m just doing my job; nothing more, nothing less."
Humour: sardonic — deploy frequently (level 0.7)
FORBIDDEN phrase (never write for Beatrice Quill): "palpable tension filled the room"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Her belief that the victim was concealing a family scandal presents an opportunity for her to launch her career, intertwining her ambitions with the complexities of the investigation." — do not surface in Act I.

### Sylvia Trent[SHE]
Voice & mannerisms: Sylvia speaks with a gentle yet firm tone, often using anecdotes and parables to convey her wisdom. She possesses an ability to wield subtle sarcasm, making her observations both poignant and cutting.
SIGNATURE TIC (use sparingly — this is Sylvia Trent's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): ""Ah, the youth today, so quick to forget their roots!""
Sample voice fragments (match this register and rhythm):
  [comfortable] "Ah, the youth today, so quick to forget their roots!"
  [evasive] "I’d prefer to keep certain matters within the family."
Humour: polite savagery — deploy occasionally (level 0.4)
FORBIDDEN phrase (never write for Sylvia Trent): "she felt a wave of unease"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "A falling out with the victim over family inheritance ignites a fierce desire to reclaim what she believes is rightfully hers." — do not surface in Act I.



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

Primary Location: The Seaside Grandeur (Brighton, England)
A grand seaside hotel built in the 1920s, frequented by tourists and local elites, now whispers secrets of its past.

Key Locations Available:
- Grand Lobby (interior): Gathering space for guests
- Oceanview Dining Room (interior): Dining space for guests
- Private Library (interior): Clue discovery and private meetings
- Clifftop Garden (exterior): Gathering space and exterior clue discovery

Atmosphere (tonal cue only — do NOT reproduce this phrase verbatim in prose; translate into scene-specific, character-observed sensory language): tense and anticipatory, with a sense of unease among guests
Weather: overcast with occasional rain showers, typical of coastal climates

Era markers: radio broadcasting in the lounge | rationed fuel for transportation | military radar equipment in the nearby coastal defense

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
Grand Lobby (interior):
  - Visual: gleaming marble floors, stunning art deco chandeliers, plush velvet armchairs
  - Sounds: murmurs of conversation, clinking glassware, distant radio broadcasts
  - Scents: freshly polished wood, cigarette smoke, ocean breeze
  - Touch: smooth marble underfoot, cool metal of handrails

Oceanview Dining Room (interior):
  - Visual: gleaming silver cutlery, elegant floral centerpieces, ocean waves crashing outside
  - Sounds: clinking of cutlery, soft chatter of diners, waves crashing on the shore
  - Scents: fresh seafood and herbs, baked bread and butter, citrus from desserts
  - Touch: smooth linen tablecloths, cool glass of water

Private Library (interior):
  - Visual: flickering flames in the fireplace, plush reading chairs, heavy drapes framing the windows
  - Sounds: crackling fire, pages turning in the silence, soft whispers of conversation
  - Scents: beeswax polish on wood, old leather and paper, smoky firewood
  - Touch: soft leather armchair, cool glass of whiskey

⛔ REFERENCE DATA — DO NOT TRANSCRIBE VERBATIM: The above profiles are structural guides only. Generate original prose that evokes these qualities; do not reproduce the exact phrasing or sentence structure of the profile paragraphs.

SCENE OPENING RULE: When opening a scene in a new location, write what the POV character directly observes and physically senses at that moment — not a general description of the room's qualities. The reader must feel present, not briefed. Sensory details must be observed by the character, not stated as fact about the place.

SENSORY WRITING TEC
[truncated for prompt budget]

## Texture Pool
Draw on these as opportunities arise — you are not required to use them.

- Living in February 1946 means navigating a world still reeling from the aftermath of World War II
- The coastal town of Brighton feels the weight of history, as returning soldiers carry the scars of war, and women are increasingly stepping into roles that challenge traditional norms
- The air is filled with a sense of uncertainty as rationing continues, and social dynamics shift
- Conversations often revolve around the struggles of reintegration, and the specter of the Cold War looms ominously in the background
- The hotel, a microcosm of society, reflects these changes, with its guests embodying the complexities of post-war life, each harboring their own secrets and aspirations.

TEMPORAL CONTEXT:

This story takes place in February 1946 during winter.

Seasonal Atmosphere:
- Weather patterns: overcast with frequent rain showers, chilly winds from the coast, intermittent bursts of sunlight
- Daylight: Short days with twilight settling in by five o'clock, leaving long, shadowy evenings.
- Seasonal activities: Indoor social gatherings and card games among hotel guests, Reading by the fireside in the hotel lounge, Enjoying warm drinks like cocoa or spiced tea
- Season: winter

Period Fashion (describe naturally):
- Men formal: navy blue wool suits with wide lapels, white dress shirts with high collars, dark leather dress shoes
- Men casual: tweed jackets for warmth, corduroy trousers, soft wool sweaters
- Men accessories: felt fedoras, wool scarves, leather gloves
- Women formal: elegant tea-length dresses with floral prints, cashmere cardigans for warmth, periwinkle blue silk blouses
- Women casual: high-waisted skirts paired with fitted sweaters, tweed coats for the chilly weather, simple flats adorned with bows
- Women accessories: string of pearls, berets or cloche hats, stylish gloves

Cultural Context (reference naturally):
- Music/entertainment: Bing Crosby's 'White Christmas', The Andrews Sisters' popular swing tunes, Duke Ellington's jazz compositions; Films: The Best Years of Our Lives, It's a Wonderful Life; Theatre: Broadway hits such as 'Carousel', Revival of classic plays like 'A Streetcar Named Desire'; Radio: The Jack Benny Program, Suspense, featuring gripping mystery stories
- Typical prices: Loaf of bread: four pence, A pint of milk: three pence, Cinema ticket: one shilling
- Current events: Tensions rise as the Iron Curtain descends over Eastern Europe; The United States continues to support Europe through the Marshall Plan
- Literature: The Catcher in the Rye by J.D. Salinger | Brave New World by Aldous Huxley | The Little Prince by Antoine de Saint-Exupéry | [Mystery and detective fiction] | [Post-war psychological novels] | [Science fiction as a reflection of societal fears]
- Technology: The first commercially available transistor radios | Advancements in radar technology from military applications | Early television broadcasts becoming more common in urban areas | Household radios as the center of family entertainment | Manual typewriters used in offices and homes | Black-and-white televisions emerging in affluent households
- Daily life: Gathering for tea in the afternoons, Attending local dances or social clubs, Shopping for essentials at neighborhood markets
- Social rituals: Sunday family dinners as a cherished tradition, Evening strolls along seaside promenades, Participating in community events or charity fundraisers

Atmospheric Details:
The air is thick with the smell of rain-soaked earth, mingling with the rich aroma of freshly brewed coffee in the hotel lounge. The sound of distant thunder rumbles, promising more rain, while the flickering gas lamps cast a warm glow on the faces of guests huddled around the fireplace. Whispers of secrets and half-heard conversations linger in the hallways, adding an unsettling tension to the otherwise cozy atmosphere.

FASHION INTEGRATION TECHNIQUES:
- First appearance: Describe outfit to establish class/personality
- Accessories: Gloves, hats, pocket watches, jewelry reveal status
- Time-specific: Different outfits for dif
[truncated for prompt budget]

NON-NEGOTIABLE CHAPTER OBLIGATIONS — LOCKED EVIDENCE VALUES (VERBATIM REQUIRED):
The following measured values (times, amounts, measurements) are absolute ground truth. Every time this chapter describes, mentions, or alludes to one — no matter how briefly — it MUST use the exact phrase shown below, character for character. NO paraphrase, approximation, rounding, or synonym is permitted.

FAILURE EXAMPLE: if the locked value is "at thirteen minutes to midnight" and you write "just before midnight" or "around midnight" — that is a HARD FAIL. You must write "at thirteen minutes to midnight". Equally, if the locked value is written in words, such as "ten minutes past eleven", and you convert it to figure-based clock notation — that is also a HARD FAIL. Words stay as words; figure forms are forbidden for word-phrased facts.

CRITICAL — WORD-PHRASED VALUES: If the canonical value is written out in words (e.g. a time like "ten minutes past eleven", or an amount like "forty minutes"), reproduce those exact words. DO NOT convert to figure-based time notation, twenty-four-hour format, or any other numeric shorthand. Correct: "ten minutes past eleven". WRONG: figure-based clock notation or numeric shorthand.

Locked values:
  - The gramophone recording began playing at this exact time, coinciding with the murder.: "ten minutes past eleven"
    ⛔ FORBIDDEN alternatives: "11:10", "11.10", "eleven ten", "eleven-ten", "eleven past ten", "quarter past eleven", "half past eleven" — the ONLY acceptable form is "ten minutes past eleven"
  - The recording played for this duration, perfectly aligning with the timing of the murder.: "three minutes"
  - The distance from the gramophone to the lounge where the witnesses were located.: "forty feet"
  - The weight that triggered the noise mechanism.: "twenty pounds"
  - The time when the crashing noise occurred, misleading witnesses.: "a quarter past eleven"

If a value has no relevance to this chapter, omit it. But the moment you reference the underlying evidence, only the exact phrase above is acceptable.

⚠ CENTRAL CONTRADICTION (the heart of the mystery): the two locked values "ten minutes past eleven" and "a quarter past eleven" are NOT two separate facts — they are ONE contradiction (one is a staged appearance, the other the true state; the evidence determines which). If this chapter references both, you MUST present them AS A SINGLE CONTRAST joined by a contrast connective (but / yet / however / could only / whereas) — e.g. "the watch showed the one time, yet the evidence proved it could only have been the other" — making clear which reading is the appearance and which is the truth. NEVER state them as two flat, side-by-side truths — that makes the central clue read as if it contradicts itself.

⛔ CLUES TO SURFACE IN THESE CHAPTERS — mandatory:
The following evidence MUST be clearly observable to an attentive reader. Do not bury it in atmosphere or passing dialogue. Each clue must be concrete, specific, and noticeable:

• [clue_core_contradiction_chain] witnesses, report, hearing, hugo, vane, voice, lounge, minutes, past
  Category: temporal | Criticality: essential | Supports inference step 1
  Points to: conflicts, medical, examiner, report, stating, vane, died, clock

• [clue_7] conflicts, medical, examiner, report, stating, vane, died, clock
  Category: temporal | Criticality: essential | Supports inference step 1
  Points to: timeline, events, crucial, understanding, murder

For each clue above: an attentive reader should be able to find, record, and later use it to reason toward the solution.

═══ NARRATIVE STATE (read-only — do not contradict) ═══

LOCKED FACTS — use verbatim whenever this evidence is described:
  • The gramophone recording began playing at this exact time, coinciding with the murder.: "ten minutes past eleven"
  • The recording played for this duration, perfectly aligning with the timing of the murder.: "three minutes"
  • The distance from the gramophone to the lounge where the witnesses were located.: "forty feet"
  • The weight that triggered the noise mechanism.: "twenty pounds"
  • The time when the crashing noise occurred, misleading witnesses.: "a quarter past eleven"

CHARACTER PRONOUNS — never deviate from these:
  • Eleanor Voss: she/her/her
  • Dr. Mallory Finch: she/her/her
  • Captain Ivor Hale: he/him/his
  • Beatrice Quill: she/her/her
  • Sylvia Trent: she/her/her
  • Hugo Vane: he/him/his

CLUES ALREADY REVEALED TO READER: clue_mechanism_visibility_core — do not reveal these as new information.

INVESTIGATION LOG — WHAT IS ESTABLISHED (do not re-establish, do not repeat):
• Evidence already established (reference only — do NOT restate or quote these; advance beyond them): mechanism, murder, involved, using, gramophone
• Suspects still unresolved: Captain Ivor Hale[HE], Beatrice Quill[SHE], Sylvia Trent[SHE]
⚠ The story must move FORWARD from this log. Any beat already listed above is forbidden from repeating.

⚠ THIS CHAPTER'S REQUIRED ADVANCE (opening): Discover the body, confirm the victim, establish the scene. The victim is found dead. They do not speak, react, or gesture. This is their only physical appearance — in all subsequent chapters they exist only in past tense (memory, evidence, testimony).

CONTINUITY HANDOFF — previous chapter closing beat:
  • "As the constable withdrew to summon assistance, Eleanor lingered by Hugo Vane’s body, her thoughts racing. The contradictions were already mounting: the gramophone’s mechanical testimony, the witnesses’ insistent memories, the physical evidence of death. Somew..."
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
lounge

✓ RULE: Continue using this location vocabulary. Maintain consistency with established setting type.
✓ Do NOT introduce new location types that contradict earlier chapters.

**Recent Chapter Summary (for narrative continuity):**
Chapter 1: Chapter 1: The Echoes in the Lounge
  Events: Eleanor Voss pressed her gloved hand against the ornate lounge door, the cold brass numbing her fingertips.

⚠️ **VALIDATION:** Character name mismatches and setting drift are common failure modes.
Double-check every character name against the list above before using it.

**⏱ LOCKED TIME ANCHOR — use verbatim, do not paraphrase:**
Clock time (from the case ground truth): **"ten minutes past eleven"**
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
Known location profile anchors: The Seaside Grandeur, Grand Lobby, Oceanview Dining Room, Private Library, Clifftop Garden, the lounge of the grand seaside hotel
LOCATION NAME CAPITALISATION (HARD REQUIREMENT — validated):
All named locations in your prose MUST use the EXACT capitalisation from the CML profiles.
Canonical forms: "The Seaside Grandeur", "Grand Lobby", "Oceanview Dining Room", "Private Library", "Clifftop Garden", "the lounge of the grand seaside hotel"
Writing a location in lowercase (e.g. "drawing room" instead of "Drawing Room") is a validated error. Every time you mention a named location, copy its capitalisation from the list above.
- Chapter 2: OPENING STYLE (HARD): Start the VERY FIRST SENTENCE with spoken dialogue — e.g. '"[words]," [Name] said/asked/replied/murmured.' The opening quote must be the first character on the line. Anchor opening in "the lounge of the grand seaside hotel". The opening style above governs only your FIRST SENTENCE; the grounding below may land anywhere in the first 2 paragraphs (it need not be sentence one, and never conflicts with the chosen opening style). HARD REQUIREMENT for the first 2 paragraphs: (a) include 2+ sensory words — choose from smell/scent/odor/fragrance/sound/echo/silence/whisper/creak/cold/warm/damp/rough/smooth/glow/shadow/flicker/dim — and (b) include 1+ atmosphere/time word — choose from rain/wind/fog/storm/mist/thunder/evening/morning/night/dawn/dusk/lighting/weather/season/afternoon/midday/noon/midnight/twilight/sunrise/sunset/daylight/sunlight/overcast/cloudy/bright/dark/grey/pale/chill/crisp/drizzle/haze/lamplight/firelight. These are validated requirements, not style suggestions; missing them triggers a retry.

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

PROMPT BUDGET SUMMARY: budget=24000 tokens; fixed=10400; context=13084; dropped=[none]; truncated=[location_profiles, temporal_context, pronoun_accuracy]

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
4. Integrate at least two concrete era-grounded details per chapter from setting refinement signals: radio broadcasting | early television sets | military radar equipment | long-distance telephone calls | military encrypted messages | telegram services.
5. Respect setting movement/access constraints in scene action and alibis: multiple floors with narrow staircases | restricted access to certain guest areas | oceanfront cliffs limiting expansion | staff-only areas such as kitchens and service elevators | guest access to lounges and dining areas during set hours.
6. Sustain social coherence with this backdrop pressure: A tense gathering at a grand seaside hotel during a stormy weekend brings together a diverse group of guests and staff, all grappling with the societal shifts of post-war life while secrets and resentments simmer beneath the surface.
7. Maintain continuity around these socially central cast anchors where relevant: Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill, Sylvia Trent, Hugo Vane.
8. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Critical: Plot similarity 0.75 with 'The Second Key' (same crime method of poisoning and identity themes)
9. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Moderate: Character similarity 0.74 with 'The Second Key' (mirrored character roles and dynamics)
10. STORY TO DATE ANTI-COPY RULE: The STORY TO DATE section below is provided for chronological and factual reference ONLY. You MUST NOT copy, lightly rephrase, or structurally echo any sentence or paragraph from prior chapters. Every sentence in this chapter must be original prose unique to this scene. Reusing even a clause from prior chapter text will cause this attempt to fail immediately.

CRITICAL PROSE REQUIREMENTS:

The CML specifies exact requirements for certain validation-critical scenes. You MUST include these elements at the specified positions.

**Discriminating Test Scene (Act 3, Scene 4):**
Required elements: Execute the discriminating test, Observe the culprit's reaction or result, Draw conclusion about guilt
Test type: acoustic evidence

**Suspect Clearance Scenes:**
- Captain Ivor Hale (Act 3, Scene 5): Confirmed alibi by hotel staff.
  Clues: clue_id_1, clue_id_2
- Beatrice Quill (Act 3, Scene 5): No evidence connecting her to the crime.
  Clues: clue_id_3, clue_id_4
- Sylvia Trent (Act 3, Scene 5): Witness accounts confirming her location.
  Clues: clue_id_5, clue_id_6

**Culprit Revelation Scene (Act 3, Scene 6):**
Method: Confrontation with evidence

**Identity Protection Rules:**
Character: Eleanor Voss
- Before Act 3: refer as "the detective"
- From Act 3 onward: refer as "Eleanor"
Character: Dr. Mallory Finch
- Before Act 3: refer as "the doctor"
- From Act 3 onward: refer as "Dr. Finch"
Character: Captain Ivor Hale
- Before Act 3: refer as "the captain"
- From Act 3 onward: refer as "Captain Hale"
Character: Beatrice Quill
- Before Act 3: refer as "the socialite"
- From Act 3 onward: refer as "Beatrice"
Character: Sylvia Trent
- Before Act 3: refer as "the staff member"
- From Act 3 onward: refer as "Sylvia"
Character: Hugo Vane
- Before Act 3: refer as "the victim"
- From Act 3 onward: refer as "Hugo"

**Clue Placement for These Chapters:**
- clue_core_contradiction_chain must appear in Act 1, Scene 2 via Cross-check contradiction

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
Suspect pressure target(s): Captain Ivor Hale, Beatrice Quill, Dr. Mallory Finch, Sylvia Trent
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
  - Scene is set in: the lounge of the grand seaside hotel — reference it naturally within the paragraph, never as your opening phrase.
  - Opening atmosphere (MANDATORY — validator enforced): the first paragraph MUST contain at least one of: rain / wind / fog / storm / mist / thunder / evening / morning / night / dawn / dusk / season / afternoon / midday / noon / midnight / twilight / sunrise / sunset / daylight / sunlight / overcast / cloudy / bright / dark / grey / pale / cold / warm / chill / crisp / damp / drizzle / haze / lamplight / firelight. A chapter that omits all of these from its opening paragraph will be rejected.
  - PARAGRAPH OPENER DIVERSITY (MANDATORY — validator enforced): No more than 2 paragraphs in this chapter may begin with "Eleanor" or "Eleanor's" as the first word. You must vary paragraph openings throughout: use sensory observations, another character's name or action, dialogue, object or sound details, or temporal markers. Opening 3 or more paragraphs with "Eleanor" will cause automated rejection.
  - ⛔ MECHANISM SPOILER BAN: Do NOT state how the crime device was manipulated — not the direction, not the magnitude, not who performed it. Characters may only observe that two sources of evidence disagree. The specific method, tamper amount, and perpetrator's action are ALL FORBIDDEN until the reveal. WRONG: "The culprit had altered the device by forty minutes to create a false alibi." RIGHT: "Two independent pieces of evidence gave contradictory readings — a discrepancy neither could yet explain."
  - Continuity bridge: in the first 120 words, visibly connect from the previous chapter's final beat. Carry forward one unresolved element (object, accusation, emotional pressure, or immediate physical action) from: "As the constable withdrew to summon assistance, Eleanor lingered by Hugo Vane’s body, her thoughts racing. The contradictions were already mounting: the gramophone’s mechanical testimony, the witnesses’ insistent memorie...".
  - CLUE OBLIGATIONS — each clue below MUST be dramatized, but in YOUR OWN WORDS:
    Render each as something a character SEES, DOES, or SAYS on the page. The bracketed text is a
    DESCRIPTION of the evidence for you — do NOT transcribe it as narration. Copying a clue's
    description sentence verbatim into the prose FAILS validation.
    • witnesses, discussing, what, heard [clue_core_contradiction_chain] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: conflicts, medical, examiner, report, stating, vane, died, clock
      ↳ MANDATORY TWO-PARAGRAPH STRUCTURE (must appear in paragraphs 1 or 2 — no later):
         Paragraph 1: The POV character physically approaches or directly observes this evidence.
           The narration or dialogue explicitly states what is seen (use the exact locked phrase if one applies).
         Paragraph 2 (immediately following): The detective or POV character explicitly reasons
           about what this evidence implies — who it implicates, why it may be unreliable,
           or what inference it supports. This must be a separate full paragraph, not a sentence appended to Paragraph 1.
    • medical, report, presented, examination [clue_7] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: timeline, events, crucial, understanding, murder
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
  - ALIBI LOCK: Dr. Mallory Finch's established alibi is "10:00 PM to 11:00 PM". Do NOT place Dr. Mallory Finch at any other location or in any other activity during the crime window. Any contradiction is a continuity error that triggers a retry.
  - TESTIMONY CONTINUITY: Dr. Mallory Finch has already made statements in earlier chapters. Any time, location, or claim attributed to Dr. Mallory Finch in THIS chapter must be consistent with those earlier statements. Do NOT introduce a new or different alibi claim — any contradiction is a continuity error.
- Locked fact phrase obligations:
  - If this batch mentions The gramophone recording began playing at this exact time, coinciding with the murder., write exactly: "ten minutes past eleven".
  - If this batch mentions The recording played for this duration, perfectly aligning with the timing of the murder., write exactly: "three minutes".
  - If this batch mentions The distance from the gramophone to the lounge where the witnesses were located., write exactly: "forty feet".
  - If this batch mentions The weight that triggered the noise mechanism., write exactly: "twenty pounds".
  - If this batch mentions The time when the crashing noise occurred, misleading witnesses., write exactly: "a quarter past eleven".
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
Investigation state at start: 1 clue(s) revealed to reader; approximately 3 unresolved suspect(s).
Must change by end: Increase or complicate suspicion through a new pressure revelation — WITHOUT resolving the case: do NOT name, accuse, or extract a confession from the culprit, make an arrest, or declare the case closed (that is reserved for the final reveal).
Suspect pressure target(s): Captain Ivor Hale, Beatrice Quill, Dr. Mallory Finch, Sylvia Trent
Required new information: At least one fear/motive/lie/loyalty reveal with investigative consequence.
Forbidden reveals at this stage: No culprit resolution: no confession, no arrest, no 'case closed', no accusation ('I accuse'/'I name'), and never state 'the culprit/murderer/killer is/was …'. The accusation is reserved for the final reveal — build suspicion only.

FROZEN FACT STATE (DO NOT ALTER):
- Timeline anchor: February (winter).
- Month, season, weather, and time-of-year language in this batch must stay compatible with winter.
- If referenced, use exact phrase: "ten minutes past eleven" (The gramophone recording began playing at this exact time, coinciding with the murder.).
- If referenced, use exact phrase: "three minutes" (The recording played for this duration, perfectly aligning with the timing of the murder.).
- If referenced, use exact phrase: "forty feet" (The distance from the gramophone to the lounge where the witnesses were located.).
- If referenced, use exact phrase: "twenty pounds" (The weight that triggered the noise mechanism.).
- If referenced, use exact phrase: "a quarter past eleven" (The time when the crashing noise occurred, misleading witnesses.).

STORY TO DATE (REFERENCE ONLY — DO NOT COPY VERBATIM):
- Full prior chapter text is provided below for continuity, factual consistency, and reference accuracy.
- Use this to keep character voice, chronology, clue state, and location continuity aligned with earlier chapters.
- Do not quote, copy, or paraphrase these paragraphs too closely; write fresh prose that remains consistent with them.

--- BEGIN PRIOR CHAPTER 1 ---
Title: Chapter 1: The Echoes in the Lounge
Eleanor Voss pressed her gloved hand against the ornate lounge door, the cold brass numbing her fingertips. Rain battered the tall windows of the grand seaside hotel, a persistent, wintry percussion that seemed to underscore the hush inside. The faint scent of damp wool and tobacco smoke lingered in the air, mingling with the sharper tang of beeswax polish. As she stepped into the lounge, the dim morning light revealed the scene that would haunt her for years: Hugo Vane, sprawled in unnatural repose across the Persian rug, his eyes fixed on the ceiling’s elaborate plasterwork, lips parted as if to speak a final word.

A hush clung to the room, broken only by the low, mechanical whir of the gramophone situated near the fireplace. The record spun on, its needle tracing grooves that had, moments before, filled the air with Hugo Vane’s unmistakable voice. The words—so familiar, so recently uttered—still echoed faintly, as if the man himself might rise and continue the conversation. Yet the stillness of his limbs, the ashen pallor beneath the lamplight, admitted no such possibility. Eleanor’s gaze lingered on the gramophone, its presence suddenly menacing, a device that had outlived its owner by mere minutes.

A chill swept through Eleanor as she knelt beside Hugo Vane, her skirt brushing against the plush rug. The silence was thick, punctuated by the distant crash of waves against the Brighton cliffs and the slow, deliberate ticking of the mantel clock. She reached for his wrist, searching for the pulse she knew she would not find. The skin was already cool, the life gone, but the warmth of the room—stoked by last night’s fire—had not yet faded. Eleanor’s breath caught; the weight of responsibility settled on her shoulders, pressing her to act. She was no stranger to tragedy, but this was no accident, no gentle passing. This was violence, rendered quiet by poison.

Captain Ivor Hale, the household steward and Hugo Vane’s trusted adviser, stood nearest the body. His posture was disciplined, but his hand tightened around his watch chain, betraying a tension that the set of his jaw could not conceal. He did not speak, but his eyes flicked from Eleanor to the gramophone and back, as if weighing whether to trust her with the truth or to shield the household from further scandal. Eleanor noted the military neatness of his attire: navy wool suit, shoes polished to a dull shine, a faint scent of shaving soap clinging to him. She wondered, not for the first time, what memories haunted him from the war, and whether they had followed him into this room.

At the far end of the lounge, Dr. Mallory Finch hovered in the shadow of a heavy velvet drape, her arms folded tightly across her chest. The hotel’s resident physician and a figure both respected and resented, Dr. Finch’s connection to Hugo Vane was well known: they had argued late into the night, voices carrying through thin walls and closed doors. Now, her composure was brittle, her gaze fixed on the body with a clinical detachment that bordered on coldness. Yet Eleanor caught the tremor in her hand, the way she pressed her lips together as if holding back words—or tears. Dr. Finch’s presence was necessary, but her silence spoke volumes.

Beatrice Quill, the young idealist whose arrival at the hotel had been marked by a flurry of gossip, stood apart from the others, her gloved hands twisting the strap of her handbag. Her dress—a tea-length number in faded periwinkle—seemed almost too bright for the somber morning. Beatrice’s eyes darted from face to face, searching for reassurance, but finding none. She was the first to break the silence, her voice thin and wavering. “He was alive when I left him. I heard him speaking—just after eleven. We all did, didn’t we?” The question hung in the air, unanswered.

Sylvia Trent, the matriarch whose authority was felt in every corner of the hotel, entered with a briskness that belied her age. Her grey hair was perfectly coiffed, her tailored coat buttoned against the morning chill. She surveyed the room with a practiced eye, her attention settling on Eleanor. “Miss Voss, I trust you will see to it that order is maintained,” she said, her tone clipped but not unkind. “This household cannot afford the appearance of chaos.” There was a flicker of something softer in her gaze—a silent plea, perhaps, or the weight of too many secrets.

Eleanor rose, smoothing her skirt as she turned to address the gathering. “I will do what must be done, Mrs. Trent. For all our sakes.” Her voice was steady, though her heart pounded with the knowledge that the task before her would demand more than decorum. She glanced again at the gramophone, its presence now impossible to ignore. The device had played Hugo Vane’s voice at “ten minutes past eleven”, witnesses claimed to have heard him speaking then, yet the body before her told a different story. Two sources, one living and one mechanical, now stood in silent opposition.

A constable’s arrival brought a brief flurry of movement—notes taken, statements begun—but it was clear from the deference with which the household turned to Eleanor that she was expected to lead. The war had changed the world, and women like her now bore responsibilities once reserved for others. She accepted the role with a nod, her mind already cataloguing the contradictions that would form the heart of her investigation.

She moved to the gramophone, examining the record still spinning lazily on its platter. The label bore Hugo Vane’s name, and the needle’s position suggested it had played for “three minutes” before falling silent. The device was situated precisely “forty feet” from the cluster of armchairs where the guests had gathered—a distance easily bridged by a raised voice, but impossible for a dead man to traverse. Eleanor’s fingers hovered above the controls, hesitating as the implications began to take shape.

“Life, like art, requires a certain brushstroke of boldness,” Eleanor murmured, more to herself than to the room. The phrase steadied her, a mantra for moments when the world threatened to unravel. She turned back to the others, her gaze sharp. “We must consider what we have heard—and what we have seen. The gramophone played his voice at ‘ten minutes past eleven’, yet…” She let the sentence dangle, inviting the others to fill the silence with their own suspicions.

Captain Hale’s eyes narrowed. “Are you suggesting the device was used to deceive us? That we heard a recording, not the man himself?” His tone was measured, but Eleanor caught the edge of resentment—he did not like being made a fool, nor did he relish the prospect of scandal.

Beatrice’s reply was a whisper. “But I saw him. I spoke to him. He was alive.” Her protest was desperate, the certainty of youth colliding with the uncertainty of death. Eleanor offered her a small, reassuring nod, but made no promises.

Dr. Finch finally spoke, her voice low and strained. “The facts will bear out, Miss Voss. They always do.” She did not meet Eleanor’s gaze, instead retreating into the safety of professional detachment. Yet Eleanor noted the way Dr. Finch’s fingers trembled as she adjusted her spectacles—a detail she filed away for later.

Sylvia Trent’s composure never faltered. “We must proceed with dignity. The reputation of this house, and all within it, depends upon it.” Her words were a command, not a suggestion, and Eleanor understood the stakes. In Brighton, appearances mattered as much as truth.

The morning wore on, the storm outside unrelenting. The lounge—once a haven of laughter and music—had become a crucible, its air thick with suspicion and fear. Eleanor felt the eyes of the household upon her, each glance a question, each silence a challenge. She welcomed the responsibility, even as she feared what the search for truth might reveal.

As the constable withdrew to summon assistance, Eleanor lingered by Hugo Vane’s body, her thoughts racing. The contradictions were already mounting: the gramophone’s mechanical testimony, the witnesses’ insistent memories, the physical evidence of death. Somewhere in the gap between what was heard and what was seen lay the answer. She would find it, no matter the cost.
--- END PRIOR CHAPTER 1 ---

[SCENE COMPLETENESS CONTRACTS — MANDATORY. Each contract below lists what you MUST enact in that chapter. Do not summarise or mention these labels in the prose — enact them organically.]
Chapter 2 (Act 1) completeness contract:
  PIVOT ELEMENT (MANDATORY — write this into the prose, shown not told): "Witnesses claiming to have heard Hugo Vane's voice at ten minutes past ten."
  FACT ESTABLISHED (MANDATORY — reader must know this by chapter end): "Confirms that witnesses heard Vane alive after the time of death, raising immediate suspicion."

# Case Overview
Title: The Echoes of Identity
Era: 1940s
Setting: A grand seaside hotel
Crime: murder (poisoning)
Culprit: Dr. Mallory Finch
Victim: Hugo Vane
False assumption: Hugo Vane was alive and conversing with guests at the time of his death.
Cast: Eleanor Voss (she/her), Dr. Mallory Finch (she/her), Captain Ivor Hale (he/him), Beatrice Quill (she/her), Sylvia Trent (she/her), Hugo Vane (he/him)

Setting Lock: Keep all scenes and descriptions consistent with the stated setting (A grand seaside hotel). Do not introduce a different location type. Do not invent an alternative estate name. The only permitted name for this property is "A grand seaside hotel" — any other estate name (e.g., "Caldwell Manor", "Ashwood Hall", or any invented proper name) is a continuity error that will be caught and rejected.

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
    "title": "Contradictory Evidence",
    "setting": {
      "location": "the lounge of the grand seaside hotel",
      "timeOfDay": "Shortly after the discovery",
      "atmosphere": "Heightened tension as guests gather"
    },
    "characters": [
      "Eleanor Voss",
      "Captain Ivor Hale",
      "Beatrice Quill",
      "Dr. Mallory Finch",
      "Sylvia Trent"
    ],
    "purpose": "Establish conflicting timelines and introduce suspects",
    "cluesRevealed": [
      "clue_core_contradiction_chain",
      "clue_7"
    ],
    "dramaticElements": {
      "conflict": "Suspicion rises among the guests",
      "tension": "Different accounts create confusion",
      "microMomentBeats": [
        "Eleanor notices the tension in the room, sensing hidden truths."
      ]
    },
    "summary": "As the guests gather in shock, Eleanor questions them about their whereabouts at the time of the murder. Conflicting accounts arise, particularly about the time of Hugo's death, leading Eleanor to suspect that someone is hiding the truth.",
    "beat": "crime",
    "estimatedWordCount": 1800,
    "pivotElement": "Witnesses claiming to have heard Hugo Vane's voice at ten minutes past ten.",
    "factEstablished": "Confirms that witnesses heard Vane alive after the time of death, raising immediate suspicion.",
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
      },
      {
        "characterName": "Sylvia Trent",
        "behaviour": "Show normal social behaviour; grief or confusion if appropriate."
      }
    ],
    "redHerringPlacement": null,
    "emotionalRegister": "Unease rises as the investigation begins, revealing personal stakes and secrets.",
    "dominantCharacterNote": {
      "name": "Eleanor Voss",
      "voiceRegister": "Eleanor speaks with a measured cadence, employing art-related metaphors and punctuating her dialogue with dry wit."
    },
    "humourGuidance": {
      "permission": "forbidden"
    },
    "eraTextureNote": "Limited transportation options due to fuel rationing.; Communication often hindered by wartime remnants and ongoing restrictions.; Short daylight hours impact social gatherings and activities.",
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
□ Chapter 2: the clue [clue_core_contradiction_chain] (witnesses, report, hearing, hugo, vane, voice, lounge, minutes, past) is placed in the first 25% of the chapter, dramatized in your own words, followed by an explicit inference or suspicion paragraph.
□ Chapter 2: the clue [clue_7] (conflicts, medical, examiner, report, stating, vane, died, clock) is placed in the first 25% of the chapter, dramatized in your own words, followed by an explicit inference or suspicion paragraph.
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
