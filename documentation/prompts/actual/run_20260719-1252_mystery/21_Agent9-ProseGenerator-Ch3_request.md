# Actual Prompt Record

- Run ID: `mystery-1784465540334`
- Project ID: ``
- Timestamp: `2026-07-19T12:59:02.256Z`
- Agent: `Agent9-ProseGenerator-Ch3`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4.1`
- Temperature: `0.42`
- Max Tokens: `4500`
- Attempt: `first`
- Prompt Hash: `6502a9cc51bf8e7f`

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
- MORAL COMPLEXITY REQUIREMENT: The mechanism of this crime carries a moral gray area: "The murderer acted out of jealousy over a past betrayal, creating a complex emotional landscape that evokes sympathy from the reader." — the culprit reveal and denouement MUST acknowledge this ambiguity. Do not let the ending feel clean or simple. Give the reader at least one moment of uncomfortable sympathy or moral doubt.

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
   - Captain Ivor Hale: Stern Patriarch
   - Beatrice Quill: Ambitious Social Climber
   - Sylvia Trent: Businesswoman
   - Hugo Vane: Rebellious Creative
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

## Era: 1940-12
Living through December 1940 means navigating a world fraught with tension due to the ongoing war. The Blitz continues to affect British cities, and rationing influences daily life, making every morsel of food precious and every moment of safety a luxury. The holiday season brings a bittersweet atmosphere as families gather despite the looming threat of conflict. Streets are damp and cold from the winter rains, and the sound of distant bombings echoes in the background, reminding people of the precariousness of their existence. The community rallies around shared experiences, but whispers of espionage and suspicion permeate interactions, fostering a climate of uncertainty. Amidst this, the seaside hotel feels like a refuge, yet the secrets hidden within its walls threaten to unravel the fragile peace.
Emotional register: A collective state of anxiety permeates the atmosphere, with hope for peace tempered by the realities of war.
Physical constraints: Rationing affects food availability and prices. | Limited transportation options due to wartime restrictions. | Communication delays caused by bombings disrupting services.
Current tensions (weave into background texture): The Blitz continues to affect British cities. | U.S. involvement in WWII is escalating. | News of the Atlantic Charter's signing spreads.
Wartime context — Many men are away serving in the military, while women increasingly fill roles in the workforce.: The absence of servicemen creates a void in social structures, leading to greater independence for women but also deepening worries about safety and loyalty. Absence effect: The absence of loved ones weighs heavily on families, fostering a longing for connection amid the chaos.

## Story Theme
The investigation of a murder at a seaside hotel reveals how buried secrets and personal ambitions can surface under the pressure of social expectations and looming crises.

## Story Emotional Register
Dominant: The story unfolds with an atmosphere thick with suspense and emotional turmoil.

Arc:
As the story begins, the quaint seaside hotel is filled with guests, laughter mingling with the sound of crashing waves. However, the atmosphere quickly shifts when Dr. Mallory Finch is discovered drowned, casting a pall of fear and suspicion over the gathering. Detective Eleanor Voss steps into the scene, driven by her desire for justice yet burdened by her own past. As she begins her investigation, initial clues point in multiple directions, leading to a web of false leads and emotional costs for those involved.

The pressure mounts as Eleanor realizes the depth of secrets held by each suspect; her interactions reveal their hidden motives and fears, deepening the emotional stakes. A pivotal moment occurs when Eleanor uncovers discrepancies in the timeline of the murder, forcing her to reevaluate everything she thought she knew. This revelation reshapes her understanding of the victim's relationships and the dynamics at play, highlighting the complexities of ambition and betrayal. As the investigation nears its climax, the tension escalates, culminating in a confrontation that exposes the true nature of loyalty and deceit among the characters. The resolution brings a bittersweet closure, as the emotional aftermath reveals the cost of uncovering the truth, leaving Eleanor and the remaining characters to grapple with their own choices and the shadows of their pasts.

## Emotional register at this point in the story
The investigation begins, revealing tensions and hidden relationships.

## Character Portraits (appearance & era)

### Eleanor Voss
Eleanor Voss represents the changing landscape of women's roles post-WWII, embodying the tension between ambition and societal expectation. As a journalist, she navigates a male-dominated world while grappling with her own past. Her quest for justice is complicated by the weight of scrutiny and her personal struggles, reflecting the broader challenges women face in asserting their place during this tumultuous period.
Era intersection: Eleanor's ambition clashes with societal norms, making her both a pioneer and a target for judgment.

### Captain Ivor Hale
Captain Ivor Hale embodies the tension between honor and the changing societal landscape. As a retired naval officer, he grapples with the shifting perceptions of masculinity in a world where traditional roles are being redefined. His resentment towards the victim reveals the complexities of male pride and the fear of obsolescence amidst evolving social norms.
Era intersection: Ivor's struggle to maintain his reputation reflects the pressures men face to adapt in a rapidly changing society.

### Beatrice Quill
Beatrice Quill's yearning for social elevation acts as a lens through which the societal pressures of the time are magnified. As a young socialite, she navigates a world where status is paramount, yet her insecurities threaten to undermine her ambitions. Her emotional journey resonates with the struggles of women seeking agency in a patriarchal society, especially during wartime.
Era intersection: Beatrice's desire for wealth and status underscores the intense competition among women to secure their futures in a time of uncertainty.

### Sylvia Trent
Sylvia Trent's fierce determination to save her hotel reflects the broader economic challenges faced by many women as they step into roles traditionally held by men. Her struggle against financial ruin amidst wartime pressures highlights the sacrifices women make to uphold their businesses and families. As the owner, she feels the weight of responsibility for her staff and guests, revealing the complexities of female entrepreneurship during this period.
Era intersection: Sylvia's battle for her hotel's survival mirrors the collective fight many women face to assert their independence and maintain their livelihoods.

### Hugo Vane
Hugo Vane's emotional turmoil as a struggling artist reflects the broader societal disconnect experienced by many during wartime. His eccentricities and unreciprocated feelings for the victim showcase the challenges of personal vulnerability in a world dominated by conflict. As an artist, he grapples with the need for validation while confronting his own inadequacies, mirroring the struggles of many seeking purpose amidst chaos.
Era intersection: Hugo's search for recognition as an artist exemplifies the emotional toll of war on creativity and self-worth.

## Character Voices

### Eleanor Voss (she/her/her)
Eleanor speaks with a measured tone, often punctuating her observations with a wry smile or a quip, revealing her underlying insecurities.
[comfortable] You know, it’s the little things that matter. I find beauty in the smallest details, like the way the waves crash against the shore.
[evasive] Well, I was just… enjoying the view. It’s quite captivating, isn't it? I mean, who wouldn’t want to admire the ocean?
[stressed] I can’t believe this is happening. I just wanted to prove myself, to show everyone that I’m more than a travel writer.
Humour: Eleanor's dry wit often surfaces as a coping mechanism amidst the tension.

### Captain Ivor Hale (he/him/his)
Ivor speaks in a booming voice, often laced with sarcasm, reflecting his military background.
[comfortable] Duty calls, but so does the past. The sea always has a way of reminding us of our choices.
[evasive] I was merely enjoying the view, nothing more. The waves can be quite mesmerizing.
[stressed] This is a matter of honor! I won’t let anyone tarnish my name, not now.
Humour: Ivor's sardonic humor surfaces as a defense against vulnerability.

### Beatrice Quill (she/her/her)
Beatrice's speech is bubbly and effusive, often punctuated by nervous laughter.
[comfortable] You know, darling, it’s all about timing; one must seize the moment!
[evasive] Oh, I was just mingling, you know? Lovely company, really!
[stressed] What if I don’t get the chance? The victim could ruin everything for me!
Humour: Beatrice's self-deprecating humor often masks her insecurities.

### Sylvia Trent (she/her/her)
Sylvia speaks directly, often using dry observations to mask her anxiety.
[comfortable] Business is business, after all; we have to keep our standards high.
[evasive] I was busy, attending to guests and managing the hotel, as usual.
[stressed] If the victim withdraws funding, it could ruin everything I’ve worked for!
Humour: Sylvia uses observational humor to deflect from her underlying stress.

### Hugo Vane (he/him/his)
Hugo speaks with a stream-of-consciousness style, often rambling and punctuated by abrupt shifts in tone.
[comfortable] Art is life, or is it the other way around? It’s all very fluid, don’t you think?
[evasive] I was sketching by the beach, lost in thought, you know? The waves inspire me.
[stressed] I can’t help but feel betrayed. My feelings cloud my judgment, and it's maddening!
Humour: Hugo's blunt observations often add a layer of eccentricity to his character.

## Location Registers (scene framing guides)

The Rooftop Terrace: The Rooftop Terrace feels eerie, bathed in shadows and the sound of crashing waves, where the haunting echoes of the past linger. The chill in the air heightens the sense of foreboding, making it a place of both beauty and danger.. Camera angle: A writer entering here should feel the clash between the serene view and the dark secret it holds.. Era: The weight of wartime secrecy amplifies the tension in this secluded space.

The Drawing Room: The Drawing Room exudes warmth but is steeped in tension, where laughter dances on the edge of whispers. The cozy atmosphere belies the secrets lurking just beneath the surface, urging guests to tread carefully.. Camera angle: A writer should capture the contrast between the inviting decor and the underlying dread.. Era: The flickering lights create an intimate yet uneasy environment, reflective of wartime anxieties.

The Kitchen: The Kitchen buzzes with activity, a haven of warmth and comfort amidst the storm outside. Yet, the lingering scents of food are clouded by an undercurrent of anxiety, as staff navigate their roles amid the chaos of the investigation.. Camera angle: A writer here should feel the urgency and camaraderie of the staff working together against the odds.. Era: The kitchen's bustling atmosphere is a stark contrast to the tension brewing just outside.

The Secluded Beach: The Secluded Beach conveys a sense of isolation, where the gentle lapping of waves contrasts with the looming threat of danger. The beauty of the landscape is overshadowed by the secrets it holds, creating an unsettling atmosphere.. Camera angle: A writer should evoke the contrast between the serene setting and the dark undercurrents of the story.. Era: This secluded spot serves as a stark reminder of the war's impact on personal connections and hidden motives.

## Humour guidance for this story position (early)
Permission: permitted
Characters who may be funny: Eleanor Voss
Permitted forms: dry_wit
Rationale: Eleanor's dry wit adds a layer of complexity to the investigation without undermining the tension.

## Reveal Groundwork (texture — do not explain, only plant)
- Plant one subtle observable beat related to: "The realization that witnesses misinterpreted Dr". Do not explain significance yet.
- Plant one subtle observable beat related to: "Finch’s last known whereabouts earlier conversations about her being inside during the party". Do not explain significance yet.
- Plant one subtle observable beat related to: "Additionally, the discovery of footprints leading to the beach forces a reevaluation of alibis, particularly Ivor Hale's claim of being on deck". Do not explain significance yet.

FAIR-PLAY AND INFERENCE CONTRACT:
- FAIR PLAY CLUE TIMING: Never combine clue discovery and detective deduction in the same chapter. If a clue is first revealed to the reader in chapter N, the detective may only analyze, deduce from, or act on that clue in chapter N+1 or later.
- FAIR PLAY INFORMATION PARITY: The reader must see all clues BEFORE the detective uses them in reasoning. If the detective performs a test or makes a deduction, every piece of evidence supporting that conclusion must have been shown to the reader in earlier chapters.
- FAIR PLAY REVELATION SPACING: In the discriminating test scene, the detective can ONLY use clues that were revealed to the reader at least 1 full chapter earlier. Never introduce new clues or withheld information during the test.
- FAIR PLAY CONFRONTATION: During the final confrontation/revelation, the detective cannot surprise the reader with facts. Every piece of evidence cited must have been visible to the reader in prior chapters.
- Never solve by withheld information. Keep reader-information parity with detective reasoning.
- False assumption in force: The victim drowned during the party inside the hotel.
- Hidden truth to progressively expose (compose in your own words from these elements): tide, rose, earlier, reported, creating, narrow, window, murder
- Inference path checkpoints to dramatize clearly — compose ENTIRELY in your own sentences from these key terms (reproducing any briefing phrase verbatim FAILS validation):
  - Step 1: obs: witnesses, state, heard, rhythmic, waves, crashing, specific, time | corr: indicates, tide, high, earlier, party, timeline, suggests | effect: narrows, timeline, incident, contradicting, witness, alibis
  - Step 2: obs: footprints, leading, beach, washed, away, tide | corr: footprints, indicate, someone, accessed, beach, before, party, started | effect: eliminates, possibility, finch, inside, hotel, time, death
  - Step 3: obs: witnesses, confirm, finch, near, beach, before, party | corr: inconsistent, alleged, presence, inside, hotel | effect: narrows, suspect, pool, present, near, beach
- Discriminating test method: trap
- Discriminating test elements to dramatize (compose ENTIRELY in your own sentences from these — do NOT reproduce any briefing phrase verbatim): reenacting, timeline, tide, chart, prove, impossibility, alibi, provided
- Test must rely on already-shown clue IDs: clue_6, clue_core_contradiction_chain, clue_2
- Fair-play rationale: Step 1: Witness statements about the waves (early) and the tide chart (mid) allow the reader to see the contradiction in the timeline. Step 2: The footprints (mid) eliminate Dr. Finch's alibi. Step 3: Witnesses' confirmation of Dr. Finch near the beach (discriminating test) reveals the truth.

## Character Reference

### Eleanor Voss (she/her — NEVER he/him)
Speaks with a measured tone, often punctuating her observations with a wry smile or a quip that hints at her underlying insecurities.
Eleanor grapples with her guilt over the affair, questioning whether her ambitions are worth the pain they cause to others.
Voice colour: Eleanor Voss uses dry wit humour — let it surface in their dialogue where natural, not in every line.

### Captain Ivor Hale (he/him — NEVER she/her)
Speaks in a booming voice, often laced with sarcasm and punctuated by military jargon, reflecting his naval background.
Ivor grapples with his outdated values and the realization that honor may not hold the same weight in the changing society around him.
Voice colour: Captain Ivor Hale uses sardonic humour — let it surface in their dialogue where natural, not in every line.

### Beatrice Quill (she/her — NEVER he/him)
Her speech is bubbly and effusive, often punctuated by nervous laughter and quick interjections, revealing her underlying insecurities.
Beatrice grapples with her ambition to rise socially while fearing that her insecurities may sabotage her efforts.

### Sylvia Trent (she/her — NEVER he/him)
Speaks in a direct, no-nonsense manner, often using dry observations to deflect from her underlying anxiety about her business.
Sylvia faces a moral dilemma between her ambition to save her hotel and the potential consequences of her actions on others.
Voice colour: Sylvia Trent uses observational humour — let it surface in their dialogue where natural, not in every line.

### Hugo Vane (he/him — NEVER she/her)
Speaks with a stream-of-consciousness style, often rambling and punctuated by abrupt shifts in tone, reflecting his chaotic thoughts.
Hugo struggles to transform his emotional pain into creative expression, fearing that his feelings for the victim may have led him astray.
Voice colour: Hugo Vane uses blunt humour — let it surface in their dialogue where natural, not in every line.


## CHARACTER CONTRACTS (binding for this scene)
Each entry below constrains how this character must be written in this chapter.
These override generic style guidance when they conflict.

### Eleanor Voss[SHE]
Voice & mannerisms: Speaks with a measured tone, often punctuating her observations with a wry smile or a quip that hints at her underlying insecurities.
SIGNATURE TIC (use sparingly — this is Eleanor Voss's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "You know, it’s the little things that matter."
Sample voice fragments (match this register and rhythm):
  [comfortable] "You know, it’s the little things that matter. I find beauty in the smallest details, like the way the waves crash against the shore."
  [evasive] "Well, I was just… enjoying the view. It’s quite captivating, isn't it? I mean, who wouldn’t want to admire the ocean?"
Humour: dry wit — deploy occasionally (level 0.5)
FORBIDDEN phrase (never write for Eleanor Voss): "a surge of determination washed over her"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "inheritance" — do not surface in Act I.

### Captain Ivor Hale[HE]
Voice & mannerisms: Speaks in a booming voice, often laced with sarcasm and punctuated by military jargon, reflecting his naval background.
SIGNATURE TIC (use sparingly — this is Captain Ivor Hale's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "Duty calls, but so does the past."
Sample voice fragments (match this register and rhythm):
  [comfortable] "Duty calls, but so does the past. The sea always has a way of reminding us of our choices."
  [evasive] "I was merely enjoying the view, nothing more. The waves can be quite mesmerizing."
Humour: sardonic — deploy occasionally (level 0.4)
FORBIDDEN phrase (never write for Captain Ivor Hale): "palpable tension filled the room"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "The victim threatened to expose his past misdeeds that could tarnish his reputation." — do not surface in Act I.

### Beatrice Quill[SHE]
Voice & mannerisms: Her speech is bubbly and effusive, often punctuated by nervous laughter and quick interjections, revealing her underlying insecurities.
SIGNATURE TIC (use sparingly — this is Beatrice Quill's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "You know, darling, it’s all about timing."
Sample voice fragments (match this register and rhythm):
  [comfortable] "You know, darling, it’s all about timing; one must seize the moment!"
  [evasive] "Oh, I was just mingling, you know? Lovely company, really!"
Humour: self deprecating — deploy rarely (level 0.3)
FORBIDDEN phrase (never write for Beatrice Quill): "she knew with certainty she was right"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Believed the victim was about to ruin her chances with a wealthy suitor." — do not surface in Act I.

### Sylvia Trent[SHE]
Voice & mannerisms: Speaks in a direct, no-nonsense manner, often using dry observations to deflect from her underlying anxiety about her business.
SIGNATURE TIC (use sparingly — this is Sylvia Trent's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "Business is business, after all."
Sample voice fragments (match this register and rhythm):
  [comfortable] "Business is business, after all; we have to keep our standards high."
  [evasive] "I was busy, attending to guests and managing the hotel, as usual."
Humour: observational — deploy occasionally (level 0.5)
FORBIDDEN phrase (never write for Sylvia Trent): "everyone could sense the atmosphere"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Believed the victim was planning to withdraw funding that would cripple her hotel." — do not surface in Act I.

### Hugo Vane[HE]
Voice & mannerisms: Speaks with a stream-of-consciousness style, often rambling and punctuated by abrupt shifts in tone, reflecting his chaotic thoughts.
SIGNATURE TIC (use sparingly — this is Hugo Vane's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "Art is life, or is it the other way around?"
Sample voice fragments (match this register and rhythm):
  [comfortable] "Art is life, or is it the other way around? It’s all very fluid, don’t you think?"
  [evasive] "I was sketching by the beach, lost in thought, you know? The waves inspire me."
Humour: blunt — deploy occasionally (level 0.4)
FORBIDDEN phrase (never write for Hugo Vane): "she chose her words with great care"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Felt deeply betrayed when the victim rejected his artistic collaboration proposal." — do not surface in Act I.



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

## Texture Pool
Draw on these as opportunities arise — you are not required to use them.

- Living through December 1940 means navigating a world fraught with tension due to the ongoing war
- The Blitz continues to affect British cities, and rationing influences daily life, making every morsel of food precious and every moment of safety a luxury
- The holiday season brings a bittersweet atmosphere as families gather despite the looming threat of conflict
- Streets are damp and cold from the winter rains, and the sound of distant bombings echoes in the background, reminding people of the precariousness of their existence
- The community rallies around shared experiences, but whispers of espionage and suspicion permeate interactions, fostering a climate of uncertainty

TEMPORAL CONTEXT:

This story takes place in December 1940 during winter.

Seasonal Atmosphere:
- Weather patterns: overcast with intermittent rain, chilly winds from the coast, damp streets reflecting the grey skies
- Daylight: Short days with daylight fading by four o'clock in the afternoon, leaving a chill in the air as twilight descends quickly.
- Seasonal activities: visiting holiday markets, attending local church services, gathering for festive dinners with family and friends
- Seasonal occasions: Christmas, New Year's Eve
- Season: winter

Period Fashion (describe naturally):
- Men formal: double-breasted wool suits, tailored overcoats, fedora hats
- Men casual: tweed jackets, corduroy trousers, cashmere sweaters
- Men accessories: silk ties, leather gloves, pocket watches
- Women formal: tea-length dresses with cinched waists, satin evening gowns, faux fur stoles
- Women casual: tweed skirts, knitted cardigans, swing jackets
- Women accessories: cloche hats, string pearls, ankle boots

Cultural Context (reference naturally):
- Music/entertainment: Bing Crosby's 'White Christmas', The Andrews Sisters' 'Boogie Woogie Bugle Boy', Glenn Miller's big band hits; Films: 'Rebecca', 'The Great Dictator'; Theatre: 'The Glass Menagerie', 'The Corn Is Green'; Radio: The Shadow, Suspense
- Typical prices: Loaf of bread: four pence, Pound of sugar: one shilling, Taxi fare across town: two shillings
- Current events: the Blitz continues to affect British cities; U.S. involvement in WWII is escalating
- Literature: 'The Maltese Falcon' by Dashiell Hammett | 'For Whom the Bell Tolls' by Ernest Hemingway | 'The Grapes of Wrath' by John Steinbeck | [mystery] | [war fiction] | [social realism]
- Technology: the first practical radar systems | improvements in military communication technology | early developments in television | radio sets in most homes | manual typewriters | film cameras
- Daily life: listening to radio broadcasts, participating in community air raid drills, writing letters to soldiers overseas
- Social rituals: gathering for evening tea, attending church services on Sundays, celebrating Christmas with family gatherings

Atmospheric Details:
The sound of rain pattering against window panes, creating a rhythmic backdrop to the tension in the air. The smell of wet pavement mingling with the scent of roasted chestnuts from nearby vendors, evoking the holiday spirit amidst the gloom. The flickering glow of street lamps illuminating the damp streets, casting elongated shadows that seem to dance as figures hurry by.

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
- Authentic references: Use actual song
[truncated for prompt budget]

NON-NEGOTIABLE CHAPTER OBLIGATIONS — LOCKED EVIDENCE VALUES (VERBATIM REQUIRED):
The following measured values (times, amounts, measurements) are absolute ground truth. Every time this chapter describes, mentions, or alludes to one — no matter how briefly — it MUST use the exact phrase shown below, character for character. NO paraphrase, approximation, rounding, or synonym is permitted.

FAILURE EXAMPLE: if the locked value is "at thirteen minutes to midnight" and you write "just before midnight" or "around midnight" — that is a HARD FAIL. You must write "at thirteen minutes to midnight". Equally, if the locked value is written in words, such as "ten minutes past eleven", and you convert it to figure-based clock notation — that is also a HARD FAIL. Words stay as words; figure forms are forbidden for word-phrased facts.

CRITICAL — WORD-PHRASED VALUES: If the canonical value is written out in words (e.g. a time like "ten minutes past eleven", or an amount like "forty minutes"), reproduce those exact words. DO NOT convert to figure-based time notation, twenty-four-hour format, or any other numeric shorthand. Correct: "ten minutes past eleven". WRONG: figure-based clock notation or numeric shorthand.

Locked values:
  - the exact time of the high tide that negated the victim's chance of escape: "ten minutes past eight"
    ⛔ FORBIDDEN alternatives: "8:10", "8.10", "eight ten", "eight-ten", "eight past ten", "quarter past eight", "half past eight" — the ONLY acceptable form is "ten minutes past eight"
  - the claimed time when the victim was last seen alive: "half past eight"
    ⛔ FORBIDDEN alternatives: "8:30", "8.30", "eight thirty", "eight-thirty", "eight past thirty", "quarter past eight" — the ONLY acceptable form is "half past eight"
  - the distance from the hotel to where the victim was found: "twenty feet"

If a value has no relevance to this chapter, omit it. But the moment you reference the underlying evidence, only the exact phrase above is acceptable.

⚠ CENTRAL CONTRADICTION (the heart of the mystery): the two locked values "ten minutes past eight" and "half past eight" are NOT two separate facts — they are ONE contradiction (one is a staged appearance, the other the true state; the evidence determines which). If this chapter references both, you MUST present them AS A SINGLE CONTRAST joined by a contrast connective (but / yet / however / could only / whereas) — e.g. "the watch showed the one time, yet the evidence proved it could only have been the other" — making clear which reading is the appearance and which is the truth. NEVER state them as two flat, side-by-side truths — that makes the central clue read as if it contradicts itself.

⛔ CLUES TO SURFACE IN THESE CHAPTERS — mandatory:
The following evidence MUST be clearly observable to an attentive reader. Do not bury it in atmosphere or passing dialogue. Each clue must be concrete, specific, and noticeable:

• [clue_1] footprints, leading, beach, washed, away, tide
  Category: physical | Criticality: essential | Supports inference step 2
  Points to: footprints, suggest, prior, access, beach

• [clue_5] water, victim, lungs
  Category: physical | Criticality: essential | Supports inference step 1
  Points to: supports, drowning, theory

• [clue_fp_contradiction_step_2] footprints, leading, beach, washed, away, tide
  Category: testimonial | Criticality: essential | Supports inference step 2
  Points to: footprints, indicate, someone, accessed, beach, before, party, started

For each clue above: an attentive reader should be able to find, record, and later use it to reason toward the solution.

═══ NARRATIVE STATE (read-only — do not contradict) ═══

LOCKED FACTS — use verbatim whenever this evidence is described:
  • the exact time of the high tide that negated the victim's chance of escape: "ten minutes past eight"
  • the claimed time when the victim was last seen alive: "half past eight"
  • the distance from the hotel to where the victim was found: "twenty feet"

CHARACTER PRONOUNS — never deviate from these:
  • Eleanor Voss: she/her/her
  • Dr. Mallory Finch: she/her/her
  • Captain Ivor Hale: he/him/his
  • Beatrice Quill: she/her/her
  • Sylvia Trent: she/her/her
  • Hugo Vane: he/him/his

CLUES ALREADY REVEALED TO READER: clue_mechanism_visibility_core, clue_core_contradiction_chain — do not reveal these as new information.

INVESTIGATION LOG — WHAT IS ESTABLISHED (do not re-establish, do not repeat):
• Evidence already established (reference only — do NOT restate or quote these; advance beyond them): timing, tide, crucial, case | timeline, provided, suspects, likely, false
• Suspects still unresolved: Beatrice Quill[SHE], Sylvia Trent[SHE], Hugo Vane[HE]
⚠ The story must move FORWARD from this log. Any beat already listed above is forbidden from repeating.

⚠ THIS CHAPTER'S REQUIRED ADVANCE (early): Interview each suspect — record their claimed whereabouts

CONTINUITY HANDOFF — previous chapter closing beat:
  • "She gathered herself, straightening the collar of her cardigan and smoothing the skirt of her tweed dress. The investigation was no longer a matter of routine questioning; it was a contest between the truth and the stories people told to protect themselves. El..."
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

**CRITICAL: You are writing chapters 3+. Maintain consistency with earlier chapters.**

**Character Names Used in Chapters 1-2:**
Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill, Sylvia Trent, Hugo Vane

✓ RULE: Use EXACTLY these names. Do NOT vary spelling, add titles, or introduce new forms.
✓ Example: if earlier chapters used "Clara Whitfield", keep using "Clara Whitfield" — never "Mrs. Whitfield" unless that is the character's canonical name in the list above.

**Setting Vocabulary Established in Earlier Chapters:**
kitchen, terrace, corridor, lobby

✓ RULE: Continue using this location vocabulary. Maintain consistency with established setting type.
✓ Do NOT introduce new location types that contradict earlier chapters.

**Recent Chapter Summary (for narrative continuity):**
Chapter 1: Chapter 1: The Tide Brings Ashore
  Events: The sight of Dr.
Chapter 2: Chapter 2: Initial Reactions
  Events: It was a small thing, perhaps, to most—a matter of minutes in a night already blurred by confusion and fear.

⚠️ **VALIDATION:** Character name mismatches and setting drift are common failure modes.
Double-check every character name against the list above before using it.

**⏱ LOCKED TIME ANCHOR — use verbatim, do not paraphrase:**
Clock time (from the case ground truth): **"High tide schedule"**
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
Known location profile anchors: The Gulls' Perch, The Rooftop Terrace, The Drawing Room, The Kitchen, The Secluded Beach, the hotel dining room
LOCATION NAME CAPITALISATION (HARD REQUIREMENT — validated):
All named locations in your prose MUST use the EXACT capitalisation from the CML profiles.
Canonical forms: "The Gulls' Perch", "The Rooftop Terrace", "The Drawing Room", "The Kitchen", "The Secluded Beach", "the hotel dining room"
Writing a location in lowercase (e.g. "drawing room" instead of "Drawing Room") is a validated error. Every time you mention a named location, copy its capitalisation from the list above.
- Chapter 3: OPENING STYLE (HARD): Start the VERY FIRST SENTENCE with an explicit time marker — e.g. "That morning…" / "By the time dusk fell…" / "It was nearly four o'clock…" / "On the second day after the discovery…". Time must be in the first clause. Anchor opening in "the hotel dining room". The opening style above governs only your FIRST SENTENCE; the grounding below may land anywhere in the first 2 paragraphs (it need not be sentence one, and never conflicts with the chosen opening style). HARD REQUIREMENT for the first 2 paragraphs: (a) include 2+ sensory words — choose from smell/scent/odor/fragrance/sound/echo/silence/whisper/creak/cold/warm/damp/rough/smooth/glow/shadow/flicker/dim — and (b) include 1+ atmosphere/time word — choose from rain/wind/fog/storm/mist/thunder/evening/morning/night/dawn/dusk/lighting/weather/season/afternoon/midday/noon/midnight/twilight/sunrise/sunset/daylight/sunlight/overcast/cloudy/bright/dark/grey/pale/chill/crisp/drizzle/haze/lamplight/firelight. These are validated requirements, not style suggestions; missing them triggers a retry.

[⚠ INTERNAL QUALITY DIAGNOSTICS — DO NOT REPRODUCE ANY PART OF THIS SECTION IN YOUR STORY OUTPUT. These are private generator observations for your consideration only. Your narrative must read as if this section does not exist. Never include phrases from this block in character dialogue, narration, or description.]

PRIOR CHAPTER QUALITY OBSERVATIONS:
- Chapter 1 (score 98/100):
  Quality gaps noted: scene grounding weakness
  Address in upcoming chapters: Open next chapter with a named location anchor plus at least two sensory cues and one atmosphere marker.
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

PROMPT BUDGET SUMMARY: budget=24000 tokens; fixed=12561; context=11281; dropped=[humour_guide, location_profiles]; truncated=[location_profiles, temporal_context, pronoun_accuracy]

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
4. Integrate at least two concrete era-grounded details per chapter from setting refinement signals: radio broadcasting | early television sets | military radar systems | long-distance telephone calls | military encryption methods | telegram services.
5. Respect setting movement/access constraints in scene action and alibis: narrow hallways limiting movement | restricted access to the rooftop terrace | secluded beach area not visible from the hotel | staff-only areas such as the kitchen and laundry | guest access to common rooms only.
6. Sustain social coherence with this backdrop pressure: A tense gathering at a seaside hotel, where the pressures of post-war society and the shifting tides of loyalty and suspicion converge around a mysterious drowning.
7. Maintain continuity around these socially central cast anchors where relevant: Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill, Sylvia Trent, Hugo Vane.
8. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Critical: Plot similarity 0.80 with 'The Second Key' (same era and crime method)
9. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Moderate: Character similarity 0.75 with 'The Second Key' (similar cast structure and roles)
10. STORY TO DATE ANTI-COPY RULE: The STORY TO DATE section below is provided for chronological and factual reference ONLY. You MUST NOT copy, lightly rephrase, or structurally echo any sentence or paragraph from prior chapters. Every sentence in this chapter must be original prose unique to this scene. Reusing even a clause from prior chapter text will cause this attempt to fail immediately.

CRITICAL PROSE REQUIREMENTS:

The CML specifies exact requirements for certain validation-critical scenes. You MUST include these elements at the specified positions.

**Discriminating Test Scene (Act 3, Scene 4):**
Required elements: Execute the discriminating test, Observe the suspects' reactions
Test type: temporal

**Suspect Clearance Scenes:**
- Beatrice Quill (Act 3, Scene 5): Alibi corroborated by hotel staff.
  Clues: clue_3, clue_4
- Sylvia Trent (Act 3, Scene 5): Social connections confirmed her whereabouts.
  Clues: clue_5, clue_6
- Hugo Vane (Act 3, Scene 5): His argument with Dr. Finch was unrelated.
  Clues: clue_7, clue_8

**Culprit Revelation Scene (Act 3, Scene 6):**
Method: Confrontation with prior evidence.

**Clue Placement for These Chapters:**
- clue_1 must appear in Act 1, Scene 3 via Direct observation
- clue_5 must appear in Act 1, Scene 3 via Witness statements
- clue_fp_contradiction_step_2 must appear in Act 1, Scene 3 via Cross-check contradiction

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
Investigation state at start: 2 clue(s) revealed to reader; approximately 3 unresolved suspect(s).
Must change by end: Increase or complicate suspicion through a new pressure revelation — WITHOUT resolving the case: do NOT name, accuse, or extract a confession from the culprit, make an arrest, or declare the case closed (that is reserved for the final reveal).
Suspect pressure target(s): Captain Ivor Hale, Beatrice Quill, Sylvia Trent, Hugo Vane
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
  - Scene is set in: the hotel dining room — reference it naturally within the paragraph, never as your opening phrase.
  - Opening atmosphere (MANDATORY — validator enforced): the first paragraph MUST contain at least one of: rain / wind / fog / storm / mist / thunder / evening / morning / night / dawn / dusk / season / afternoon / midday / noon / midnight / twilight / sunrise / sunset / daylight / sunlight / overcast / cloudy / bright / dark / grey / pale / cold / warm / chill / crisp / damp / drizzle / haze / lamplight / firelight. A chapter that omits all of these from its opening paragraph will be rejected.
  - PARAGRAPH OPENER DIVERSITY (MANDATORY — validator enforced): No more than 2 paragraphs in this chapter may begin with "Eleanor" or "Eleanor's" as the first word. You must vary paragraph openings throughout: use sensory observations, another character's name or action, dialogue, object or sound details, or temporal markers. Opening 3 or more paragraphs with "Eleanor" will cause automated rejection.
  - ⛔ MECHANISM SPOILER BAN: Do NOT state how the crime device was manipulated — not the direction, not the magnitude, not who performed it. Characters may only observe that two sources of evidence disagree. The specific method, tamper amount, and perpetrator's action are ALL FORBIDDEN until the reveal. WRONG: "The culprit had altered the device by forty minutes to create a false alibi." RIGHT: "Two independent pieces of evidence gave contradictory readings — a discrepancy neither could yet explain."
  - Continuity bridge: in the first 120 words, visibly connect from the previous chapter's final beat. Carry forward one unresolved element (object, accusation, emotional pressure, or immediate physical action) from: "She gathered herself, straightening the collar of her cardigan and smoothing the skirt of her tweed dress. The investigation was no longer a matter of routine questioning; it was a contest between the truth and the stori...".
  - CLUE OBLIGATIONS — each clue below MUST be dramatized, but in YOUR OWN WORDS:
    Render each as something a character SEES, DOES, or SAYS on the page. The bracketed text is a
    DESCRIPTION of the evidence for you — do NOT transcribe it as narration. Copying a clue's
    description sentence verbatim into the prose FAILS validation.
    • footprints, visible, leading, beach [clue_1] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: footprints, suggest, prior, access, beach
      ↳ MANDATORY TWO-PARAGRAPH STRUCTURE (must appear in paragraphs 1 or 2 — no later):
         Paragraph 1: The POV character physically approaches or directly observes this evidence.
           The narration or dialogue explicitly states what is seen (use the exact locked phrase if one applies).
         Paragraph 2 (immediately following): The detective or POV character explicitly reasons
           about what this evidence implies — who it implicates, why it may be unreliable,
           or what inference it supports. This must be a separate full paragraph, not a sentence appended to Paragraph 1.
    • victim, shows, signs, drowning [clue_5] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: supports, drowning, theory
      ↳ MANDATORY TWO-PARAGRAPH STRUCTURE (must appear in paragraphs 1 or 2 — no later):
         Paragraph 1: The POV character physically approaches or directly observes this evidence.
           The narration or dialogue explicitly states what is seen (use the exact locked phrase if one applies).
         Paragraph 2 (immediately following): The detective or POV character explicitly reasons
           about what this evidence implies — who it implicates, why it may be unreliable,
           or what inference it supports. This must be a separate full paragraph, not a sentence appended to Paragraph 1.
    • witnesses, report, hearing, rhythmic, waves [clue_fp_contradiction_step_2] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: footprints, indicate, someone, accessed, beach, before, party, started
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
  - ALIBI LOCK: Captain Ivor Hale's established alibi is "8:00 PM to 10:00 PM". Do NOT place Captain Ivor Hale at any other location or in any other activity during the crime window. Any contradiction is a continuity error that triggers a retry.
  - TESTIMONY CONTINUITY: Captain Ivor Hale has already made statements in earlier chapters. Any time, location, or claim attributed to Captain Ivor Hale in THIS chapter must be consistent with those earlier statements. Do NOT introduce a new or different alibi claim — any contradiction is a continuity error.
- Locked fact phrase obligations:
  - If this batch mentions the exact time of the high tide that negated the victim's chance of escape, write exactly: "ten minutes past eight".
  - If this batch mentions the claimed time when the victim was last seen alive, write exactly: "half past eight".
  - If this batch mentions the distance from the hotel to where the victim was found, write exactly: "twenty feet".
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
Investigation state at start: 2 clue(s) revealed to reader; approximately 3 unresolved suspect(s).
Must change by end: Increase or complicate suspicion through a new pressure revelation — WITHOUT resolving the case: do NOT name, accuse, or extract a confession from the culprit, make an arrest, or declare the case closed (that is reserved for the final reveal).
Suspect pressure target(s): Captain Ivor Hale, Beatrice Quill, Sylvia Trent, Hugo Vane
Required new information: At least one fear/motive/lie/loyalty reveal with investigative consequence.
Forbidden reveals at this stage: No culprit resolution: no confession, no arrest, no 'case closed', no accusation ('I accuse'/'I name'), and never state 'the culprit/murderer/killer is/was …'. The accusation is reserved for the final reveal — build suspicion only.

FROZEN FACT STATE (DO NOT ALTER):
- Timeline anchor: December (winter).
- Month, season, weather, and time-of-year language in this batch must stay compatible with winter.
- Established timeline fact: High tide schedule
- Established timeline fact: Witness statements
- If referenced, use exact phrase: "ten minutes past eight" (the exact time of the high tide that negated the victim's chance of escape).
- If referenced, use exact phrase: "half past eight" (the claimed time when the victim was last seen alive).
- If referenced, use exact phrase: "twenty feet" (the distance from the hotel to where the victim was found).

STORY TO DATE (REFERENCE ONLY — DO NOT COPY VERBATIM):
- Full prior chapter text is provided below for continuity, factual consistency, and reference accuracy.
- Use this to keep character voice, chronology, clue state, and location continuity aligned with earlier chapters.
- Do not quote, copy, or paraphrase these paragraphs too closely; write fresh prose that remains consistent with them.

--- BEGIN PRIOR CHAPTER 1 ---
Title: Chapter 1: The Tide Brings Ashore
Eleanor Voss pressed her heel into the damp shingle, the cold wind tugging at the hem of her tweed skirt as she advanced across the beach near the hotel. The morning was grey, the sky a low ceiling of cloud that threatened rain, and the air was thick with the briny scent of seaweed and the faint, metallic tang of salt. The waves crashed in steady, unhurried rhythm, their sound oddly magnified by the hush that had settled over the gathering. At her feet, the sand was scattered with bits of driftwood and the occasional shell, but all else receded when Eleanor caught sight of the body lying motionless just above the tideline—a pale, waterlogged form that even from a distance could only be Dr. Mallory Finch.

The sight of Dr. Mallory Finch sprawled awkwardly on the pebbles, her dark hair plastered to her cheeks, banished any lingering sense of holiday charm. Eleanor’s breath caught in her throat, the chill of the wintry morning cutting sharper than before. The doctor’s coat, once immaculate, was sodden and streaked with sand; one arm bent at an unnatural angle, fingers curled as if still grasping at something lost beneath the waves. Eleanor knelt, careful not to disturb the scene, and felt the cold seeping through her gloves as she reached for Dr. Mallory Finch’s wrist—no pulse, only the silence of the dead. She rose, brushing grit from her knees, and turned to the others who had gathered in a loose, uneasy semicircle, their faces drawn tight with shock.

Captain Ivor Hale stood nearest, his broad frame rigid against the wind, the collar of his navy overcoat turned up in defiance of the cold. His hand gripped the head of his walking stick so tightly the knuckles blanched. As the retired naval officer and a friend of Dr. Mallory Finch, his presence was both expected and unsettling; his eyes, usually sharp, now flickered between the body and the horizon, as if searching for answers beyond the surf. Eleanor noted the way his jaw worked, as though he were biting back words—or something less admissible. She wondered, briefly, if his discipline was armour or merely habit.

Beatrice Quill, the hotel’s most effervescent guest, hovered a few paces behind, her gloved hands clasped tightly at her waist. The socialite’s usual sparkle was dimmed, her lips parted in a silent gasp, and the fur trim of her swing jacket shivered with every gust of wind. Beatrice’s gaze darted from Eleanor to the body and back, her eyes wide and unblinking, as if she feared missing some crucial cue. When Eleanor met her gaze, Beatrice managed a brittle smile, but her left foot tapped a nervous, arrhythmic beat against the stones—a tell that did not escape Eleanor’s notice.

Sylvia Trent, owner of The Gulls’ Perch, arrived with a briskness that seemed almost at odds with the gravity of the scene. Her skirt, practical and mud-spattered, bore testament to her morning’s exertions; her hair, pinned with military precision, did little to soften the severity of her expression. Sylvia’s eyes lingered on the body for a fraction too long before she addressed Eleanor, her voice low and even. 'Business is business, after all,' she murmured, though the tremor in her hand as she adjusted her scarf betrayed a less composed interior. Eleanor caught the quick glance Sylvia cast toward the hotel, as if calculating the damage already done.

Hugo Vane trailed after the others, his artist’s satchel slung carelessly over one shoulder, a sketchbook clutched to his chest as if it might shield him from the cold or the truth. His hair was tousled by the wind, and his eyes, red-rimmed, flickered restlessly from the body to the shifting line of the tide. 'Art is life, or is it the other way around?' he muttered, more to himself than anyone else, but the words hung in the air, unanswered. Hugo’s fingers drummed an erratic rhythm on the cover of his sketchbook, betraying a nervous energy that seemed both genuine and rehearsed. Eleanor studied him for a moment, noting the way his gaze lingered on Dr. Mallory Finch’s face, then darted away.

A silence fell, broken only by the insistent crash of the waves—a sound Eleanor realised had been remarked upon by more than one witness already that morning. Several guests, their voices low and uncertain, had spoken of hearing the sea’s rhythm at a specific time, as if the ocean itself had kept vigil during the night. The detail struck Eleanor as oddly precise, more than the usual background noise of coastal life. She filed it away, aware that in a place where the tide ruled all, the timing of its rise and fall might matter more than anyone yet realised.

Eleanor straightened, brushing a strand of hair from her cheek, and surveyed the scene with the measured detachment she had cultivated as a travel journalist—though this was no ordinary assignment. She felt the weight of expectation settle on her shoulders as the others looked to her for guidance; in the absence of official authority, she was the investigator now, and the responsibility was as cold and heavy as the winter air. She drew a slow breath, letting the salt and damp fill her lungs, and forced herself to speak. 'We need to be methodical,' she said, her tone steady. 'No one should leave the beach until we’ve accounted for everyone’s whereabouts.'

Captain Ivor Hale’s voice cut through the tension, rougher than usual. 'Duty calls, but so does the past. I was here before dawn—couldn’t sleep, not after last night.' He glanced at Eleanor, his eyes narrowing. 'You’ll want to know who saw what, when. But the sea doesn’t keep secrets, Miss Voss.' He gestured toward the water, the wind snatching at his words. Eleanor nodded, noting the defensiveness in his stance—a man used to command, now forced to submit to scrutiny.

Beatrice Quill’s laughter, brittle and too loud, startled the group. 'You know, darling, it’s all about timing; one must seize the moment!' Her voice faltered as she realised the inappropriateness of her remark, and she shrank back, cheeks flushed. 'I—I only meant, it’s all so sudden. Dr. Finch was just—' She broke off, twisting her glove between her fingers. Eleanor watched her closely, the nervous energy radiating from Beatrice like static.

Sylvia Trent interjected, her tone clipped. 'There’s a war on, and the last thing we need is scandal. I was attending to the kitchen when I heard the commotion. If Dr. Finch was out here, it wasn’t with my knowledge.' She crossed her arms, the gesture defensive, and fixed her gaze on the horizon. Eleanor sensed a calculation behind the words—a woman accustomed to managing crises, determined not to let this one unravel her hard-won order.

Hugo Vane shuffled his feet, the pebbles grinding beneath his boots. 'I was sketching by the seawall,' he said, voice wavering. 'The waves were louder than usual—almost hypnotic. I remember thinking it was just the wind, but…' He trailed off, eyes fixed on the water. Eleanor regarded him, noting the way his shoulders hunched, as if bracing for a blow. His admission, vague as it was, hinted at something more—whether guilt or grief, she could not yet say.

The group’s attention returned to Dr. Mallory Finch, her body now the grim centre of their uneasy constellation. Eleanor crouched again, examining the sand around the doctor’s form. The tide had receded, leaving a ragged line of seaweed and debris just above where Dr. Mallory Finch’s hand rested. The distance from the hotel to where the body had come to rest was, by Eleanor’s estimation, no more than twenty feet—a fact she tucked away, knowing it might soon bear on the question of how, and when, the tragedy had occurred.

A sudden gust sent a spray of salt across Eleanor’s cheek, and she blinked, the sting oddly clarifying. She glanced back at the hotel, its windows dark against the overcast sky, and wondered how many secrets those walls now harboured. The war had brought enough uncertainty; this death, so close to the hearth, threatened to unravel what little peace remained.

Eleanor rose, brushing sand from her gloves, and fixed the group with a steady gaze. 'We’ll need to account for everyone’s movements last night,' she said, her voice low but firm. 'And I’ll want to speak to each of you in turn.' She saw the flicker of apprehension in their faces—the tightening of Captain Ivor Hale’s jaw, the tremor in Beatrice Quill’s hand, the guarded set of Sylvia Trent’s shoulders, and the restless shifting of Hugo Vane’s gaze. Each, she sensed, carried more than mere shock.

The wind picked up, rattling the sparse grasses at the edge of the beach and driving a fresh chill through Eleanor’s coat. She turned back to Dr. Mallory Finch, searching the doctor’s face for some final message, but found only the blankness of death and the relentless, indifferent rhythm of the sea. Somewhere, just beyond reach, the truth waited—hidden in the spaces between what was seen and what was said, in the precise timing of the waves, and in the hearts of those left standing on the shore.
--- END PRIOR CHAPTER 1 ---

--- BEGIN PRIOR CHAPTER 2 ---
Title: Chapter 2: Initial Reactions
"We should move inside before the cold finishes what the sea began," Eleanor said, her voice steady despite the tremor in her hands as she ushered the group from the wind-lashed beach into the hotel lobby. The air within was thick with the scent of damp wool and the lingering tang of coal smoke, the warmth of the fire failing to dispel the chill that clung to everyone’s shoulders. Rain tapped a persistent rhythm against the windowpanes, and the grey light of late morning filtered through the glass, casting long shadows across the patterned carpet. Eleanor’s mind replayed the last image of Dr. Mallory Finch’s lifeless form, but it was the memory of the waves—so precisely remarked upon by the witnesses—that gnawed at her. The high tide had come at "ten minutes past eight", yet more than one guest insisted they saw Dr. Finch alive at "half past eight". The contradiction was as sharp as the wind outside, and Eleanor felt its edge keenly as she surveyed the uneasy faces before her.

It was a small thing, perhaps, to most—a matter of minutes in a night already blurred by confusion and fear. Yet to Eleanor, the timeline was everything. If the tide had reached its peak at "ten minutes past eight", then Dr. Finch could not have drowned later, as some claimed. Someone was lying, or at the very least, remembering selectively. The implication was immediate: not all alibis could be trusted, and the neat order of events the guests offered was as unreliable as the weather. The original meaning of the witnesses’ statements—simple, factual recollections—now shifted in Eleanor’s mind to something more sinister: a deliberate attempt to obscure the truth, or perhaps a desperate bid to protect themselves from suspicion. The case, she realized, would hinge not on what was said, but on what was carefully left unsaid.

Captain Ivor Hale stood nearest the fire, his back ramrod straight, yet his hands betrayed him as he poured a measure of brandy into a glass. The decanter clinked faintly against the rim, and a drop spilled onto the polished sideboard. Eleanor watched him, noting the tremor that ran through his fingers—a man accustomed to command, now forced to account for himself. "You’ll want to know where I was," he said, his tone brusque, eyes fixed on the flames. "I told you, Miss Voss, I was out on the terrace before dawn. The sea was restless—couldn’t sleep. After that, I came in for a drink." He glanced over his shoulder, as if daring her to challenge him. The words were plausible, but the rigidity of his posture and the careful avoidance of her gaze suggested a deeper unease. Eleanor wondered if his sense of duty masked something less honourable.

Beatrice Quill hovered by the settee, her gloved hands twisting in her lap. Her cheeks were blotched with colour, and her voice, when it came, was too bright. "Oh, it’s all so dreadful, isn’t it? I mean, Dr. Finch was perfectly well at dinner—she even complimented the blancmange! I remember because I’d just spilled a bit on my skirt, and she laughed." Beatrice’s laugh now was brittle, echoing off the high ceiling like a note struck too hard. "I saw her in the corridor after, just before the party—must have been… oh, half past eight?" She looked at Eleanor, eyes wide, as if seeking approval for her memory. But Eleanor caught the hesitation, the way Beatrice’s fingers worked the hem of her jacket. The timing, so confidently given, matched the others’ claims—and clashed fatally with the tide chart Eleanor had already reviewed.

Sylvia Trent, standing near the reception desk, kept her arms folded tightly across her chest, her expression unreadable. The hotel owner’s voice was clipped as she addressed Eleanor. "I was in The Kitchen most of the evening. The staff can vouch for that. I only heard about the… accident when Mr. Vane came running in, shouting about the beach. I didn’t see Dr. Finch at all after dinner." She paused, her gaze flicking to the rain-streaked window. "But if you’re asking about the time, I can tell you the kitchen clock chimed just after eight when the commotion started. I remember because I was counting out the ration coupons for the morning delivery—one can’t be too careful these days." Sylvia’s words were practical, almost dismissive, but Eleanor sensed the calculation behind them. Sylvia was a woman who understood the cost of every moment, and her insistence on the timing felt rehearsed.

Hugo Vane slouched in an armchair beneath the faded portrait of some forgotten admiral, his sketchbook balanced on his knee. He stared at the fire, lips moving silently as if rehearsing lines for a play. When Eleanor addressed him, he startled, eyes darting up. "I was on the beach," he said, voice thin. "Sketching the waves, you know? The light was… odd. Everything looked silver, like the world had been dipped in mercury. I saw Dr. Finch go down the path, but I couldn’t say when exactly. Time gets slippery when you’re drawing. Maybe just after eight? Or later?" He shrugged, a gesture that seemed to absolve him of responsibility. Yet Eleanor noted the way his knuckles whitened on the sketchbook’s edge, and the flicker of something—guilt, or fear—cross his face when Beatrice spoke.

The lobby’s warmth did little to thaw the tension that crackled between the guests. Rain battered the windows, and the muted glow from the wall sconces cast uncertain shadows across the room. Eleanor let the silence stretch, watching as each person retreated into their own thoughts, the weight of suspicion settling over them like a second winter coat. She moved to the sideboard, fingers trailing across its smooth surface, and considered the implications of what she had heard. The original timeline, so confidently asserted by the guests, now appeared riddled with holes. The high tide at "ten minutes past eight" should have made it impossible for Dr. Finch to be alive at "half past eight"—unless, of course, someone had reason to misremember. The contradiction was no longer a curiosity; it was the fulcrum on which the entire case would turn.

Eleanor turned back to the group, her voice quieter but no less firm. "It seems," she said, "that the sea keeps better time than we do. Until I can reconcile what you’ve all told me with what the tide insists, I’m afraid no one can be certain of anything." She caught Captain Ivor Hale’s eye, saw the flicker of resentment there, and watched as Beatrice Quill bit her lip, glancing nervously at Sylvia Trent. Hugo Vane hunched deeper into his chair, his gaze fixed on the rain-smeared glass. Each reaction told its own story, and Eleanor resolved to pursue them all.

A sudden burst of static from the radio in the corner startled everyone, the announcer’s clipped tones breaking through the hush to deliver news of another air raid in London. The reminder of the world’s larger dangers did nothing to dispel the immediate threat that now lurked within the walls of The Gulls’ Perch. Eleanor allowed herself a brief, wry smile—trust the war to intrude at the least opportune moment. Still, the interruption served as a release valve, and for a heartbeat, the room’s tension eased. But as the broadcast faded, the silence returned, heavier than before.

She gathered herself, straightening the collar of her cardigan and smoothing the skirt of her tweed dress. The investigation was no longer a matter of routine questioning; it was a contest between the truth and the stories people told to protect themselves. Eleanor glanced once more at the faces arrayed before her—each marked by fear, calculation, or confusion—and felt the burden of what lay ahead. The contradiction in the timeline had transformed the case, and she knew that every answer from this point forward would have to be weighed against the relentless, impartial record of the sea.
--- END PRIOR CHAPTER 2 ---

[SCENE COMPLETENESS CONTRACTS — MANDATORY. Each contract below lists what you MUST enact in that chapter. Do not summarise or mention these labels in the prose — enact them organically.]
Chapter 3 (Act 1) completeness contract:
  PIVOT ELEMENT (MANDATORY — write this into the prose, shown not told): "The footprints leading to the beach, washed away by the tide."
  FACT ESTABLISHED (MANDATORY — reader must know this by chapter end): "Establishes that someone had access to the beach before the party started, contradicting witness alibis."

# Case Overview
Title: Tidal Deceit
Era: 1940s
Setting: Quaint Seaside Hotel
Crime: murder (drowning)
Culprit: Captain Ivor Hale
Victim: Dr. Mallory Finch
False assumption: The victim drowned during the party inside the hotel.
Cast: Eleanor Voss (she/her), Dr. Mallory Finch (she/her), Captain Ivor Hale (he/him), Beatrice Quill (she/her), Sylvia Trent (she/her), Hugo Vane (he/him)

Setting Lock: Keep all scenes and descriptions consistent with the stated setting (Quaint Seaside Hotel). Do not introduce a different location type. Do not invent an alternative estate name. The only permitted name for this property is "Quaint Seaside Hotel" — any other estate name (e.g., "Caldwell Manor", "Ashwood Hall", or any invented proper name) is a continuity error that will be caught and rejected.

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
    "title": "The Investigation Begins",
    "setting": {
      "location": "the hotel dining room",
      "timeOfDay": "Early afternoon",
      "atmosphere": "A somber gathering of guests discussing the incident"
    },
    "characters": [
      "Eleanor Voss",
      "Captain Ivor Hale",
      "Beatrice Quill",
      "Sylvia Trent",
      "Hugo Vane"
    ],
    "purpose": "Start the investigation by revealing initial clues.",
    "cluesRevealed": [
      "clue_1",
      "clue_5",
      "clue_fp_contradiction_step_2"
    ],
    "dramaticElements": {
      "conflict": "Tensions rise as the guests begin to point fingers.",
      "tension": "Eleanor senses the underlying motives of the suspects.",
      "microMomentBeats": [
        "Eleanor catches Dr. Finch's eye, sensing her unease."
      ]
    },
    "summary": "In the dining room, the guests gather to discuss the tragedy. Eleanor questions them, revealing the presence of water in the victim's lungs and footprints leading to the beach, indicating the victim's final moments. The discussion becomes heated as accusations fly.",
    "beat": "first_enquiries",
    "estimatedWordCount": 1250,
    "pivotElement": "The footprints leading to the beach, washed away by the tide.",
    "factEstablished": "Establishes that someone had access to the beach before the party started, contradicting witness alibis.",
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
      },
      {
        "characterName": "Hugo Vane",
        "behaviour": "Show normal social behaviour; grief or confusion if appropriate."
      }
    ],
    "redHerringPlacement": null,
    "emotionalRegister": "The investigation begins, revealing tensions and hidden relationships.",
    "dominantCharacterNote": {
      "name": "Eleanor Voss",
      "voiceRegister": "Eleanor speaks with a measured tone, often punctuating her observations with a wry smile or a quip, revealing her underlying insecurities."
    },
    "humourGuidance": {
      "permission": "forbidden"
    },
    "eraTextureNote": "Rationing affects food availability and prices.; Limited transportation options due to wartime restrictions.; Communication delays caused by bombings disrupting services.",
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
□ Chapter 3: the clue [clue_1] (footprints, leading, beach, washed, away, tide) is placed in the first 25% of the chapter, dramatized in your own words, followed by an explicit inference or suspicion paragraph.
□ Chapter 3: the clue [clue_5] (water, victim, lungs) is placed in the first 25% of the chapter, dramatized in your own words, followed by an explicit inference or suspicion paragraph.
□ Chapter 3: the clue [clue_fp_contradiction_step_2] (footprints, leading, beach, washed, away, tide) is placed in the first 25% of the chapter, dramatized in your own words, followed by an explicit inference or suspicion paragraph.
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
