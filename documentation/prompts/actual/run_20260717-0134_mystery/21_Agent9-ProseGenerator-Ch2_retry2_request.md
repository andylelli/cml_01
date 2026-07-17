# Actual Prompt Record

- Run ID: `mystery-1784252070066`
- Project ID: ``
- Timestamp: `2026-07-17T01:40:50.401Z`
- Agent: `Agent9-ProseGenerator-Ch2`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4.1`
- Temperature: `0.6599999999999999`
- Max Tokens: `4500`
- Attempt: `retry 2`
- Prompt Hash: `2129a3cde09a0dbc`

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
The atmosphere is initially festive and elegant, masking underlying tensions.

## Character Portraits (appearance & era)

### Eleanor Voss
Eleanor Voss navigates the challenges of being a journalist in a world shaped by war, where her past divorce has left her seeking validation through her work. As a woman in a male-dominated field, she represents the emerging independence women are finding during this era. Her sharp observations and dry wit are tools she uses to cope with her insecurities, embodying a resilience reflective of the changing social landscape.
Era intersection: Eleanor's struggles with self-worth and professional integrity are intensified by the societal shifts of the 1940s, as women increasingly assert their independence.

### Captain Ivor Hale
Captain Ivor Hale embodies the charm of war heroes returning to society, yet his unrequited love complicates his reintegration. His jealousy towards the murder victim reflects the emotional turmoil many men experience as they return to a world that has transformed in their absence. Ivor's struggles with loyalty and affection illustrate the complexities of relationships in a changing social fabric.
Era intersection: Ivor's feelings of inadequacy and jealousy resonate with the societal pressures on men to reclaim their roles as protectors and providers.

### Beatrice Quill
Beatrice Quill is a socialite caught between her desire for status and the realities of wartime life. Her entanglement in gambling debts reveals the pressures women face to maintain appearances amidst financial instability. As she navigates the competitive social landscape, her ambition is a reflection of the broader shifts occurring in women's roles during the 1940s.
Era intersection: Beatrice's internal conflict between ambition and vulnerability mirrors the challenges women face in asserting their place in society during this historic moment.

### Sylvia Trent
Sylvia Trent is an artist whose insecurities about her craft are exacerbated by the societal expectations placed on women during the war. Her secret relationship with Ivor adds a layer of complexity to her character, showcasing the blend of personal aspirations and societal pressures. Sylvia's journey reflects the struggle for identity that many women experience as they carve their paths in a world reshaped by conflict.
Era intersection: Sylvia's artistic ambitions and emotional turmoil highlight the evolving roles and expectations of women in the 1940s.

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

### Captain Ivor Hale (he/him/his)
Ivor speaks with confidence, often using playful banter to mask deeper emotions.
[comfortable] Ah, the tangled web we weave, isn't it?
[evasive] It’s better we don’t discuss that right now.
[stressed] I just want to make sure we’re all on the same page here.
Humour: His sardonic humour adds a layer of complexity to his character.

### Beatrice Quill (she/her/her)
Beatrice speaks with theatrical flair, often embellishing her words and sharing gossip-laden anecdotes.
[comfortable] One simply can't take the risk, can one?
[evasive] I’d rather not get involved in any drama, thank you.
[stressed] This could ruin everything I’ve worked for!
Humour: Her polite savagery often surfaces in her interactions with others.

### Sylvia Trent (she/her/her)
Sylvia speaks in a gentle, reflective tone, often using metaphorical language related to art.
[comfortable] Art is a reflection of the soul, don’t you think?
[evasive] Let’s not stray too far from the topic at hand.
[stressed] What if this all falls apart? What then?
Humour: Sylvia’s observational humour often brings a fresh perspective to serious discussions.

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

## Humour guidance for this story position (opening)
Permission: permitted
Rationale: The initial atmosphere allows for light banter among guests.

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

### Captain Ivor Hale (he/him — NEVER she/her)
Ivor speaks with a confident cadence, often using playful banter to mask his deeper emotions
He has a tendency to use grand metaphors and dramatic expressions.
Ivor grapples with the line between love and obsession, torn between his feelings for Eleanor and his jealousy of the victim.
Voice colour: Captain Ivor Hale uses sardonic humour — let it surface in their dialogue where natural, not in every line.

### Beatrice Quill (she/her — NEVER he/him)
Beatrice speaks with a theatrical flair, often embellishing her words
She has a penchant for dramatic pauses and is prone to gossip-laden anecdotes.
Beatrice is torn between her desire for social supremacy and the fear of being unmasked as a fraud, as her gambling debts threaten her lifestyle.
Voice colour: Beatrice Quill uses polite savagery humour — let it surface in their dialogue where natural, not in every line.

### Sylvia Trent (she/her — NEVER he/him)
Sylvia speaks in a gentle, reflective tone, often using metaphorical language related to art
She has a tendency to pause, allowing her thoughts to blossom.
Sylvia struggles with her self-worth as an artist and the fear that her relationship with Ivor might not be what she imagined.
Voice colour: Sylvia Trent uses observational humour — let it surface in their dialogue where natural, not in every line.

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
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Drawn to the hotel to cover a travel story, she becomes embroiled in the murder investigation." — do not surface in Act I.

### Captain Ivor Hale[HE]
Voice & mannerisms: Ivor speaks with a confident cadence, often using playful banter to mask his deeper emotions. He has a tendency to use grand metaphors and dramatic expressions.
SIGNATURE TIC (use sparingly — this is Captain Ivor Hale's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "Ah, the tangled web we weave, isn't it?"
Sample voice fragments (match this register and rhythm):
  [comfortable] "Ah, the tangled web we weave, isn't it?"
  [evasive] "It’s better we don’t discuss that right now."
Humour: sardonic — deploy occasionally (level 0.6)
FORBIDDEN phrase (never write for Captain Ivor Hale): "palpable tension filled the room"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Jealous of the victim's influence over Eleanor and feared losing her affection." — do not surface in Act I.

### Beatrice Quill[SHE]
Voice & mannerisms: Beatrice speaks with a theatrical flair, often embellishing her words. She has a penchant for dramatic pauses and is prone to gossip-laden anecdotes.
SIGNATURE TIC (use sparingly — this is Beatrice Quill's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "One simply can't take the risk, can one?"
Sample voice fragments (match this register and rhythm):
  [comfortable] "One simply can't take the risk, can one?"
  [evasive] "I’d rather not get involved in any drama, thank you."
Humour: polite savagery — deploy frequently (level 0.7)
FORBIDDEN phrase (never write for Beatrice Quill): "she felt a wave of unease"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Wants to eliminate the victim to reclaim her social status and resolve her financial issues." — do not surface in Act I.

### Sylvia Trent[SHE]
Voice & mannerisms: Sylvia speaks in a gentle, reflective tone, often using metaphorical language related to art. She has a tendency to pause, allowing her thoughts to blossom.
SIGNATURE TIC (use sparingly — this is Sylvia Trent's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "Art is a reflection of the soul, don’t you think?"
Sample voice fragments (match this register and rhythm):
  [comfortable] "Art is a reflection of the soul, don’t you think?"
  [evasive] "Let’s not stray too far from the topic at hand."
Humour: observational — deploy occasionally (level 0.4)
FORBIDDEN phrase (never write for Sylvia Trent): "everyone could sense the atmosphere"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Believes the victim has been spreading rumors about her art, threatening her livelihood." — do not surface in Act I.

### Hugo Vane[HE]
Voice & mannerisms: Hugo speaks in a straightforward manner, often cutting through pleasantries to get to the point. He has a habit of using terse phrases and direct language.
SIGNATURE TIC (use sparingly — this is Hugo Vane's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "Let's not beat around the bush."
Sample voice fragments (match this register and rhythm):
  [comfortable] "Let’s not beat around the bush."
  [evasive] "That’s not really relevant to our current situation."
Humour: blunt — deploy rarely (level 0.3)
FORBIDDEN phrase (never write for Hugo Vane): "she chose her words with great care"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Angered by the victim's public humiliation of him during a recent social event." — do not surface in Act I.



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

• [clue_core_contradiction_chain] witnesses, finch, until, eleven, tide, schedule, shows, drowned
  Category: temporal | Criticality: essential | Supports inference step 2
  Points to: finch, drowned, time, witnesses, last

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

CLUES ALREADY REVEALED TO READER: clue_mechanism_visibility_core — do not reveal these as new information.

INVESTIGATION LOG — WHAT IS ESTABLISHED (do not re-establish, do not repeat):
• Evidence already established (reference only — do NOT restate or quote these; advance beyond them): timing, high, tide, creates, narrow, window
• Suspects still unresolved: Captain Ivor Hale[HE], Beatrice Quill[SHE], Sylvia Trent[SHE]
⚠ The story must move FORWARD from this log. Any beat already listed above is forbidden from repeating.

⚠ THIS CHAPTER'S REQUIRED ADVANCE (opening): Discover the body, confirm the victim, establish the scene. The victim is found dead. They do not speak, react, or gesture. This is their only physical appearance — in all subsequent chapters they exist only in past tense (memory, evidence, testimony).

CONTINUITY HANDOFF — previous chapter closing beat:
  • "A gull swooped low, its cry sharp against the morning hush. Eleanor straightened, her eyes tracing the line of the surf as it retreated. The war had brought enough uncertainty; now, here on this beach, another kind of battle was unfolding. She wondered, not fo..."
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
kitchen

✓ RULE: Continue using this location vocabulary. Maintain consistency with established setting type.
✓ Do NOT introduce new location types that contradict earlier chapters.

**Recent Chapter Summary (for narrative continuity):**
Chapter 1: Chapter 1: The Tide's Witness
  Events: Eleanor Voss pressed her heel into the damp sand, the chill of the midsummer morning biting through her stockings.

⚠️ **VALIDATION:** Character name mismatches and setting drift are common failure modes.
Double-check every character name against the list above before using it.

**⏱ LOCKED TIME ANCHOR — use verbatim, do not paraphrase:**
Clock time (from the case ground truth): **"scheduled high tide at half past eleven"**
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
Known location profile anchors: The Crestview Hotel, The Oceanview Room, The Grand Dining Room, The Hotel Library, The Kitchen, the seaside hotel lounge
LOCATION NAME CAPITALISATION (HARD REQUIREMENT — validated):
All named locations in your prose MUST use the EXACT capitalisation from the CML profiles.
Canonical forms: "The Crestview Hotel", "The Oceanview Room", "The Grand Dining Room", "The Hotel Library", "The Kitchen", "the seaside hotel lounge"
Writing a location in lowercase (e.g. "drawing room" instead of "Drawing Room") is a validated error. Every time you mention a named location, copy its capitalisation from the list above.
- Chapter 2: OPENING STYLE (HARD): Start the VERY FIRST SENTENCE with spoken dialogue — e.g. '"[words]," [Name] said/asked/replied/murmured.' The opening quote must be the first character on the line. Anchor opening in "the seaside hotel lounge". The opening style above governs only your FIRST SENTENCE; the grounding below may land anywhere in the first 2 paragraphs (it need not be sentence one, and never conflicts with the chosen opening style). HARD REQUIREMENT for the first 2 paragraphs: (a) include 2+ sensory words — choose from smell/scent/odor/fragrance/sound/echo/silence/whisper/creak/cold/warm/damp/rough/smooth/glow/shadow/flicker/dim — and (b) include 1+ atmosphere/time word — choose from rain/wind/fog/storm/mist/thunder/evening/morning/night/dawn/dusk/lighting/weather/season/afternoon/midday/noon/midnight/twilight/sunrise/sunset/daylight/sunlight/overcast/cloudy/bright/dark/grey/pale/chill/crisp/drizzle/haze/lamplight/firelight. These are validated requirements, not style suggestions; missing them triggers a retry.

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

PROMPT BUDGET SUMMARY: budget=24000 tokens; fixed=9208; context=12582; dropped=[none]; truncated=[location_profiles, temporal_context, pronoun_accuracy]

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
4. Integrate at least two concrete era-grounded details per chapter from setting refinement signals: radio broadcasts in every guest room | early television sets in common areas | manual typewriters for correspondence | long-distance telephone calls available with operator assistance | military-style encryption for sensitive information | letters delivered via local post.
5. Respect setting movement/access constraints in scene action and alibis: narrow hallways limiting movement | oceanfront cliffs creating natural barriers | restricted access to staff-only areas | staff-only areas like the kitchen and maintenance rooms | guest access to certain floors restricted after midnight.
6. Sustain social coherence with this backdrop pressure: A grand seaside hotel hosts a mix of war-weary guests and ambitious social climbers, all drawn together by the promise of a lavish escape, yet haunted by the specter of recent tragedies and shifting allegiances.
7. Maintain continuity around these socially central cast anchors where relevant: Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill, Sylvia Trent, Hugo Vane.
8. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Critical: Plot similarity 0.80 with 'The Second Key' (same era, method of drowning, and seaside hotel setting)
9. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Moderate: Character similarity 0.75 with 'The Second Key' (similar cast structure and dynamics)
10. RETRY MITIGATION: Strict obligation mode is active. Every required clue must be surfaced with concrete, observable prose before any deduction beat.
11. RETRY MITIGATION: Prioritize chronology and identity coherence over stylistic variation for this retry.
12. STORY TO DATE ANTI-COPY RULE: The STORY TO DATE section below is provided for chronological and factual reference ONLY. You MUST NOT copy, lightly rephrase, or structurally echo any sentence or paragraph from prior chapters. Every sentence in this chapter must be original prose unique to this scene. Reusing even a clause from prior chapter text will cause this attempt to fail immediately.

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
Suspect pressure target(s): Hugo Vane, Captain Ivor Hale, Beatrice Quill, Sylvia Trent
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
  - Scene is set in: the seaside hotel lounge — reference it naturally within the paragraph, never as your opening phrase.
  - Opening atmosphere (MANDATORY — validator enforced): the first paragraph MUST contain at least one of: rain / wind / fog / storm / mist / thunder / evening / morning / night / dawn / dusk / season / afternoon / midday / noon / midnight / twilight / sunrise / sunset / daylight / sunlight / overcast / cloudy / bright / dark / grey / pale / cold / warm / chill / crisp / damp / drizzle / haze / lamplight / firelight. A chapter that omits all of these from its opening paragraph will be rejected.
  - PARAGRAPH OPENER DIVERSITY (MANDATORY — validator enforced): No more than 2 paragraphs in this chapter may begin with "Eleanor" or "Eleanor's" as the first word. You must vary paragraph openings throughout: use sensory observations, another character's name or action, dialogue, object or sound details, or temporal markers. Opening 3 or more paragraphs with "Eleanor" will cause automated rejection.
  - Continuity bridge: in the first 120 words, visibly connect from the previous chapter's final beat. Carry forward one unresolved element (object, accusation, emotional pressure, or immediate physical action) from: "A gull swooped low, its cry sharp against the morning hush. Eleanor straightened, her eyes tracing the line of the surf as it retreated. The war had brought enough uncertainty; now, here on this beach, another kind of ba...".
  - CLUE OBLIGATIONS — each clue below MUST be dramatized, but in YOUR OWN WORDS:
    Render each as something a character SEES, DOES, or SAYS on the page. The bracketed text is a
    DESCRIPTION of the evidence for you — do NOT transcribe it as narration. Copying a clue's
    description sentence verbatim into the prose FAILS validation.
    • witness, statements, finch, last, seen, time [clue_core_contradiction_chain] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: finch, drowned, time, witnesses, last
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
  - ALIBI LOCK: Hugo Vane's established alibi is "During the party". Do NOT place Hugo Vane at any other location or in any other activity during the crime window. Any contradiction is a continuity error that triggers a retry.
  - TESTIMONY CONTINUITY: Hugo Vane has already made statements in earlier chapters. Any time, location, or claim attributed to Hugo Vane in THIS chapter must be consistent with those earlier statements. Do NOT introduce a new or different alibi claim — any contradiction is a continuity error.
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
Batch chapters: 2-2.
Investigation state at start: 1 clue(s) revealed to reader; approximately 3 unresolved suspect(s).
Must change by end: Reframe prior clue meaning and update suspect implications.
Suspect pressure target(s): Hugo Vane, Captain Ivor Hale, Beatrice Quill, Sylvia Trent
Required new information: Earlier clue gets revised meaning with explicit theory update.
Forbidden reveals at this stage: Do not introduce decisive new evidence from nowhere.

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

[SCENE COMPLETENESS CONTRACTS — MANDATORY. Each contract below lists what you MUST enact in that chapter. Do not summarise or mention these labels in the prose — enact them organically.]
Chapter 2 (Act 1) completeness contract:
  PIVOT ELEMENT (MANDATORY — write this into the prose, shown not told): "Conflicting witness statements about Dr. Finch's last known whereabouts."
  FACT ESTABLISHED (MANDATORY — reader must know this by chapter end): "Establishes that witnesses saw Dr. Finch alive until eleven, contradicting the timeline of her death."

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
    "sceneNumber": 2,
    "act": 1,
    "title": "Initial Reactions",
    "setting": {
      "location": "the seaside hotel lounge",
      "timeOfDay": "Late morning",
      "atmosphere": "Chaotic, mingled with shock and disbelief"
    },
    "characters": [
      "Eleanor Voss",
      "Hugo Vane",
      "Captain Ivor Hale",
      "Beatrice Quill",
      "Sylvia Trent"
    ],
    "purpose": "Establish initial reactions to the crime and introduce conflicting timelines.",
    "cluesRevealed": [
      "clue_core_contradiction_chain"
    ],
    "dramaticElements": {
      "conflict": "Suspicions arise as guests recount their whereabouts.",
      "tension": "Witness statements contradict the timeline of events.",
      "microMomentBeats": [
        "Eleanor's hands tremble as she takes notes, the weight of the situation sinking in."
      ]
    },
    "summary": "In the hotel lounge, chaos reigns as guests react to the shocking news of Dr. Finch's death. Eleanor Voss attempts to gather information from the distraught guests, but conflicting accounts of the night before begin to surface, revealing contradictions that leave her unsettled. The atmosphere thickens with suspicion as Eleanor begins to doubt the stories being told.",
    "beat": "crime",
    "estimatedWordCount": 1800,
    "pivotElement": "Conflicting witness statements about Dr. Finch's last known whereabouts.",
    "factEstablished": "Establishes that witnesses saw Dr. Finch alive until eleven, contradicting the timeline of her death.",
    "permittedBehavioursByAct": [
      {
        "characterName": "Eleanor Voss",
        "behaviour": "Show normal social behaviour; grief or confusion if appropriate."
      },
      {
        "characterName": "Hugo Vane",
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
        "characterName": "Sylvia Trent",
        "behaviour": "Show normal social behaviour; grief or confusion if appropriate."
      }
    ],
    "redHerringPlacement": null,
    "emotionalRegister": "Unease grows as the murder is discovered, disrupting the hotel's facade.",
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
□ Chapter 2: the clue [clue_core_contradiction_chain] (witnesses, finch, until, eleven, tide, schedule, shows, drowned) is placed in the first 25% of the chapter, dramatized in your own words, followed by an explicit inference or suspicion paragraph.
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

## Message 4 (role=user)

```text
SINGLE-PASS RETRY CONTRACT
Goal: resolve every listed issue for chapter(s) 2 in this one retry.
Retry mode: FULL_REBUILD.
Attempt context: 3/3 | primary class: fair_play.
Why this mode: final-attempt or hard mitigation triggered.

SOURCE OF TRUTH
- Do not preserve sentence structure from the failed draft; use the scene instructions and hard constraints as the source of truth.
- Hard constraints outrank the previous draft: cast/pronoun lock, locked facts, clue obligations, stage-mode rules, and chapter JSON shape.

PRIMARY FAILURES
- Chapter 2: the concealment mechanism is explained before the discriminating-test scene. Plant the physical clue (name the object/observation), but do NOT reveal HOW the trick worked — withhold the method/causal explanation until the discriminating-test scene or the final reveal.

REWRITE PLAN
- Treat the scene instructions, cast lock, clue obligations, and locked facts as the source of truth; do not preserve failing wording from the previous draft.
- Rewrite any paragraph touched by a failing issue as a fresh paragraph rather than patching a single sentence.

SUCCESS CHECKLIST
- Every listed issue below is resolved in this single attempt before you answer.
- Primary failure class cleared: fair_play.
- The revised chapter reads as a clean rewrite of the failing parts, not a lightly patched copy of the rejected draft.

OUTPUT RULES
- Return complete corrected JSON for chapter(s) 2 only.
- Do not explain what you changed.
- Do not leave one issue unresolved while fixing another.
- If two instructions conflict, prefer the one that clears the validator and preserves story logic.

TERMINAL RETRY EXECUTION MODE
Scope: chapter(s) 2
Attempt: 3/3 | class: fair_play
Objective: resolve every active validator error in a single pass.
Use failed draft as negative example only. Do not preserve its sentence structures.

ACTIVE ERRORS TO CLEAR
- Chapter 2: the concealment mechanism is explained before the discriminating-test scene. Plant the physical clue (name the object/observation), but do NOT reveal HOW the trick worked — withhold the method/causal explanation until the discriminating-test scene or the final reveal.

PACKET MUST-FIX ITEMS
- Resolve fair_play issues before accepting this batch.
- Chapter 2: the concealment mechanism is explained before the discriminating-test scene. Plant the physical clue (name the object/observation), but do NOT reveal HOW the trick worked — withhold the method/causal explanation until the discriminating-test scene or the final reveal.

EXECUTION RULES
- Solve all listed errors together; do not optimize one and regress another.
- Keep cast/pronoun lock, locked facts, clue obligations, and stage-mode outcome consistent.
- Return complete corrected JSON for the target chapter batch only.
- No commentary or explanation outside JSON.

FINAL PRE-SUBMIT CHECK
- Verify every item in ACTIVE ERRORS TO CLEAR is resolved in the returned JSON.
- If any listed error remains unresolved, revise before returning.

RETRY CLASS: fair_play
ATTEMPT: 2/3
MANDATORY FIXES:
- Resolve fair_play issues before accepting this batch.
- Chapter 2: the concealment mechanism is explained before the discriminating-test scene. Plant the physical clue (name the object/observation), but do NOT reveal HOW the trick worked — withhold the method/causal explanation until the discriminating-test scene or the final reveal.
MITIGATION MODE: tighten_obligation
```
