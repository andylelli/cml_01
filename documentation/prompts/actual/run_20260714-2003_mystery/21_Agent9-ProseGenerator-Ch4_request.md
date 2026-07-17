# Actual Prompt Record

- Run ID: `mystery-1784059393094`
- Project ID: ``
- Timestamp: `2026-07-14T20:10:52.321Z`
- Agent: `Agent9-ProseGenerator-Ch4`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4.1`
- Temperature: `0.42`
- Max Tokens: `4500`
- Attempt: `first`
- Prompt Hash: `3b2a1301707b71eb`

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
- MORAL COMPLEXITY REQUIREMENT: The mechanism of this crime carries a moral gray area: "The culprit may have poisoned the victim out of misguided love, believing it would free them from an abusive relationship." — the culprit reveal and denouement MUST acknowledge this ambiguity. Do not let the ending feel clean or simple. Give the reader at least one moment of uncomfortable sympathy or moral doubt.

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
   - Captain Ivor Hale: Honor-bound Guardian
   - Beatrice Quill: Ambitious Climber
   - Sylvia Trent: Disillusioned Creator
   - Hugo Vane: Resentful Benefactor
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

## Era: 1942-04
April 1942 is marked by a palpable tension within society as the harsh realities of war continue to weigh heavily on the populace. Daily life is characterized by rationing and uncertainty, with citizens grappling with the loss of loved ones to conflict. As spring unfolds, the weather reflects a somber mood, with overcast skies and occasional rain showers that dampen both spirits and outdoor activities. The lingering effects of World War II have shifted social dynamics, with women increasingly stepping into roles traditionally held by men as they contribute to the war effort. This upheaval creates a backdrop of anxiety, as communities band together to support one another amidst the chaos of a world on the brink of change.
Emotional register: A collective sense of anxiety and resilience shapes the emotional landscape of this time.
Physical constraints: Limited availability of goods due to wartime rationing | Travel restrictions affecting movement and communication | Public gatherings closely monitored due to security concerns
Current tensions (weave into background texture): Ongoing rationing of goods affecting daily life and consumer behavior | Increasing awareness of mental health issues as a result of war experiences | Political discussions surrounding the growing Cold War tensions
Wartime context — Many families are affected by the war, with loved ones serving overseas, creating a sense of loss and uncertainty.: Community bonds are strengthened through shared experiences of sacrifice and support for the war effort. Absence effect: The absence of service members is keenly felt, leading to a heightened sense of vulnerability and longing for resolution.

## Story Theme
The story explores how secrets and hidden motives can poison relationships, much like the lethal toxin that serves as the murder weapon, and reveals that evidence carries ethical weight, forcing characters to choose accountability over social performance when appearances and facts collide.

## Story Emotional Register
Dominant: The story unfolds with a mix of tension and intrigue, capturing the emotional complexities of its characters.

Arc:
The story begins with the serene façade of The Cliffside Retreat, where the discovery of Dr. Mallory Finch’s murder sends shockwaves through the coastal hotel. Guests, initially enveloped in the tranquility of their surroundings, soon find themselves grappling with the weight of suspicion. As Eleanor Voss, the sharp-eyed journalist, embarks on her investigation, the atmosphere shifts from calm to chaos as the first clues emerge. Each interaction reveals hidden motives, and the emotional cost of uncovering the truth weighs heavily on Eleanor as she navigates the tangled web of relationships among the hotel’s inhabitants.

Midway through the narrative, a pivotal moment occurs when Eleanor discovers a crucial piece of evidence that challenges the timeline of the murder. This revelation reorients her investigation, leading her to reconsider the alibis of the suspects. The stakes escalate as she confronts the emotional turmoil each character faces, revealing deep-seated resentments and ambitions that color their actions. As the pressure mounts, the hotel becomes a pressure cooker of secrets, where allies turn into suspects, and trust is a luxury no one can afford.

As the climax approaches, the tension reaches a boiling point, culminating in a confrontation that unravels the facade of normalcy. The truth about the delayed-action poison is revealed, forcing each character to confront their role in the tragedy. The emotional fallout is palpable, as the characters are left to grapple with the consequences of their choices and the fragility of their relationships.

In the resolution, the emotional toll of the investigation is laid bare. Eleanor, having uncovered the truth, is left with a bittersweet sense of victory. The characters, forever changed by the events, must confront their own demons and the cost of their secrets. The once peaceful hotel stands as a testament to the complexities of human nature, where the search.

## Emotional register at this point in the story
A pivotal clue shifts the investigation's direction, raising new questions.

## Character Portraits (appearance & era)

### Eleanor Voss
Eleanor Voss is a journalist who seeks to reclaim her identity amidst the chaos of post-war life. Her sharp wit and investigative nature drive her to uncover the truth behind the murder, as she navigates her own personal struggles with self-worth and purpose.
Era intersection: Eleanor's quest for truth reflects the societal shift as women take on more active roles in the workforce, seeking independence in a world still dominated by the aftermath of war.

### Captain Ivor Hale
Captain Ivor Hale embodies the conflict between honor and guilt, shaped by his wartime experiences. His hidden affair adds layers to his character as he navigates the pressures of reputation and the consequences of his past actions.
Era intersection: Ivor's story reflects the internal struggles faced by returning soldiers as they reintegrate into civilian life, grappling with guilt and the need for redemption.

### Hugo Vane
Hugo Vane is a philanthropist whose facade of success crumbles under the pressures of dwindling wealth and jealousy. His character embodies the desperation felt by many as they navigate financial instability amidst wartime constraints.
Era intersection: Hugo's struggles illustrate the societal pressures of maintaining appearances and the impact of economic strain on social relationships.

## Character Voices

### Eleanor Voss (she/her/her)
Eleanor's voice is confident and articulate, often punctuated with dry wit that reveals her sharp intellect.
[comfortable] You know, the truth is a fickle friend, isn't it? Always hiding when you need it most.
[evasive] I can't say for certain, but perhaps it's best not to dwell on the past too much.
[stressed] Every time I think I have a lead, it slips right through my fingers!
Humour: Eleanor often employs a dry wit that reflects her investigative nature.

### Captain Ivor Hale (he/him/his)
Ivor's deep voice carries a sense of authority, often using nautical metaphors to convey his thoughts.
[comfortable] Ahoy there, it's a rough sea we sail, but we must navigate it with honor.
[evasive] It's best left unspoken, much like the tides that shift beneath our feet.
[stressed] I can’t let my past catch up with me; it could ruin everything!
Humour: Ivor often employs self-deprecating humor that highlights his past.

### Hugo Vane (he/him/his)
Hugo speaks with suave confidence, often using clever wordplay and veiled insults disguised as compliments.
[comfortable] Ah, the price of charity is often too high; wouldn’t you agree?
[evasive] Let’s not dwell on that; the future is far more exciting, wouldn’t you say?
[stressed] I can’t afford to be vulnerable; it would ruin my reputation!
Humour: Hugo's polite savagery often reveals his underlying insecurities.

## Location Registers (scene framing guides)

The Rooftop Terrace: The Rooftop Terrace carries the weight of recent tragedy, where the beauty of the scenery contrasts sharply with the horror of the murder that took place. The atmosphere is heavy with foreboding, as whispers of secrets linger in the cool sea air.. Camera angle: Entering this space evokes a sense of dread, as the view of the turbulent sea parallels the emotional turmoil within.. Era: The ongoing war creates an oppressive tension, as the hotel becomes a microcosm of societal anxieties.

Staff Lounge: The Staff Lounge feels claustrophobic and tense, filled with hushed conversations and anxious glances. The air is thick with unspoken fears, as staff members grapple with the weight of their secrets amidst the turmoil of the ongoing investigation.. Camera angle: Stepping into this space invites a sense of unease, as the camaraderie of the staff is overshadowed by the weight of their collective anxieties.. Era: The atmosphere reflects the strain of wartime pressures, affecting both staff morale and their interactions.

The Grand Dining Room: The Grand Dining Room buzzes with strained energy, as guests attempt to maintain normalcy amidst the chaos surrounding the murder. The clinking of cutlery and soft murmurs of conversation cloak an undercurrent of apprehension, as secrets threaten to unravel.. Camera angle: Entering this space evokes a sense of heightened tension, as every glance exchanged carries the weight of hidden truths.. Era: The room's elegance contrasts with the grim realities of daily life during wartime.

The Grand Lobby: The Grand Lobby serves as a bustling heart of the hotel, yet today it pulses with an undercurrent of unease. Guests navigate their interactions cautiously, aware of the secrets lurking in the shadows, as the scent of fresh flowers fails to mask the tension in the air.. Camera angle: Entering this space feels like stepping into a stage set, where every conversation is laced with both warmth and suspicion.. Era: The ambiance reflects the societal pressures of the time, as guests grapple with the uncertainties brought on by the war.

## Humour guidance for this story position (first_turn)
Permission: forbidden
Rationale: The rising tension during this scene requires a serious atmosphere.

## Reveal Groundwork (texture — do not explain, only plant)
- Plant one subtle observable beat related to: "Plant one subtle anomaly that can be re-read after the resolution.". Do not explain significance yet.
- Plant one subtle observable beat related to: "The moment when Hugo Vane expresses his frustrations with the victim's success is , revealing deeper jealousy and insecurity". Do not explain significance yet.
- Plant one subtle observable beat related to: "Additionally, the seemingly innocuous conversations about the victim at dinner now hint at hidden animosities and aspirations, enriching the narrative's complexity". Do not explain significance yet.

FAIR-PLAY AND INFERENCE CONTRACT:
- FAIR PLAY CLUE TIMING: Never combine clue discovery and detective deduction in the same chapter. If a clue is first revealed to the reader in chapter N, the detective may only analyze, deduce from, or act on that clue in chapter N+1 or later.
- FAIR PLAY INFORMATION PARITY: The reader must see all clues BEFORE the detective uses them in reasoning. If the detective performs a test or makes a deduction, every piece of evidence supporting that conclusion must have been shown to the reader in earlier chapters.
- FAIR PLAY REVELATION SPACING: In the discriminating test scene, the detective can ONLY use clues that were revealed to the reader at least 1 full chapter earlier. Never introduce new clues or withheld information during the test.
- FAIR PLAY CONFRONTATION: During the final confrontation/revelation, the detective cannot surprise the reader with facts. Every piece of evidence cited must have been visible to the reader in prior chapters.
- Never solve by withheld information. Keep reader-information parity with detective reasoning.
- False assumption in force: The victim was poisoned immediately during the toast.
- Hidden truth to progressively expose (compose in your own words from these elements): actual, timing, toxin, activation, delayed, thus, toast
- Inference path checkpoints to dramatize clearly — compose ENTIRELY in your own sentences from these key terms (reproducing any briefing phrase verbatim FAILS validation):
  - Step 1: obs: witnesses, state, finch, seen, drinking, before, toast | corr: suggests, poisoning, occurred, immediately, rather | effect: narrows, timeline, poison, administration, toast
  - Step 2: obs: residue, local, plant, finch, glass | corr: poison, must, placed, drink, beforehand, suggesting, premeditation | effect: eliminates, theory, poisoning, happened, toast
  - Step 3: obs: witnesses, recall, distinct, time, toast, finch, symptoms | corr: delayed, reaction, poison, indicates, consumed, toast | effect: narrows, suspect, access, opportunity, toast
- Discriminating test method: trap
- Discriminating test elements to dramatize (compose ENTIRELY in your own sentences from these — do NOT reproduce any briefing phrase verbatim): reenacting, toast, drinks, containing, residue, observe, reactions, among, suspects
- Test must rely on already-shown clue IDs: clue_4, clue_12, clue_5, clue_fp_contradiction_step_3
- Fair-play rationale: Step 1: Witness accounts (early) and residue analysis (mid) establish the poison's delayed action. Step 2: The timeline of symptoms (mid) eliminates immediate poisoning during the toast. Step 3: The reenactment (discriminating test) confirms the involvement of the culprit.

## Character Reference

### Eleanor Voss (she/her — NEVER he/him)
Eleanor speaks with a confident cadence, her words flowing smoothly, punctuated by occasional sardonic remarks
She often asks pointed questions that reveal her investigative nature.
Eleanor grapples with feelings of inadequacy after her divorce, questioning her worth and whether she can truly make a difference.
Voice colour: Eleanor Voss uses dry wit humour — let it surface in their dialogue where natural, not in every line.

### Captain Ivor Hale (he/him — NEVER she/her)
Ivor speaks with a deep, booming voice, often reminiscing about his naval days
He has a tendency to use nautical metaphors and offers self-deprecating humor about his past.
Ivor grapples with guilt from his past actions during the war and the fear that his affair will come to light, jeopardizing his reputation.

### Hugo Vane (he/him — NEVER she/her)
Hugo speaks with a suave confidence, often employing clever wordplay and a charming smile
He has a tendency to drop veiled insults disguised as compliments.
Hugo wrestles with the fear of financial ruin and the desperate lengths he might go to in order to retain his status.
Voice colour: Hugo Vane uses polite savagery humour — let it surface in their dialogue where natural, not in every line.


## CHARACTER CONTRACTS (binding for this scene)
Each entry below constrains how this character must be written in this chapter.
These override generic style guidance when they conflict.

### Eleanor Voss[SHE]
Voice & mannerisms: Eleanor speaks with a confident cadence, her words flowing smoothly, punctuated by occasional sardonic remarks. She often asks pointed questions that reveal her investigative nature.
SIGNATURE TIC (use sparingly — this is Eleanor Voss's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "Truth is a fickle friend, isn't it?"
Sample voice fragments (match this register and rhythm):
  [comfortable] "You know, the truth is a fickle friend, isn't it? Always hiding when you need it most."
  [evasive] "I can't say for certain, but perhaps it's best not to dwell on the past too much."
Humour: dry wit — deploy occasionally (level 0.5)
FORBIDDEN phrase (never write for Eleanor Voss): "a surge of determination washed over her"
Act 2 behaviour contract: May show unease, evasion, or mild defensiveness when questioned. One behavioural tell is permitted. Internal conflict emerging: "Eleanor grapples with feelings of inadequacy after her divorce, questioning her worth and whether she can truly make a difference."

### Captain Ivor Hale[HE]
Voice & mannerisms: Ivor speaks with a deep, booming voice, often reminiscing about his naval days. He has a tendency to use nautical metaphors and offers self-deprecating humor about his past.
SIGNATURE TIC (use sparingly — this is Captain Ivor Hale's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "Ahoy there, it's a rough sea we sail."
Sample voice fragments (match this register and rhythm):
  [comfortable] "Ahoy there, it's a rough sea we sail, but we must navigate it with honor."
  [evasive] "It's best left unspoken, much like the tides that shift beneath our feet."
Humour: self deprecating — deploy rarely (level 0.3)
FORBIDDEN phrase (never write for Captain Ivor Hale): "she knew with certainty she was right"
Act 2 behaviour contract: May show unease, evasion, or mild defensiveness when questioned. One behavioural tell is permitted. Internal conflict emerging: "Ivor grapples with guilt from his past actions during the war and the fear that his affair will come to light, jeopardizing his reputation."

### Hugo Vane[HE]
Voice & mannerisms: Hugo speaks with a suave confidence, often employing clever wordplay and a charming smile. He has a tendency to drop veiled insults disguised as compliments.
SIGNATURE TIC (use sparingly — this is Hugo Vane's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "Ah, the price of charity is often too high."
Sample voice fragments (match this register and rhythm):
  [comfortable] "Ah, the price of charity is often too high; wouldn’t you agree?"
  [evasive] "Let’s not dwell on that; the future is far more exciting, wouldn’t you say?"
Humour: polite savagery — deploy occasionally (level 0.5)
FORBIDDEN phrase (never write for Hugo Vane): "she felt a wave of unease"
Act 2 behaviour contract: May show unease, evasion, or mild defensiveness when questioned. One behavioural tell is permitted. Internal conflict emerging: "Hugo wrestles with the fear of financial ruin and the desperate lengths he might go to in order to retain his status."



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

TEMPORAL CONTEXT:

This story takes place in April 1942 during spring.

Seasonal Atmosphere:
- Weather patterns: overcast skies with occasional rain showers, cool breezes from the coast, muffled sounds of the city softened by the weather
- Daylight: Days are gradually lengthening, with daylight fading around 7:30 PM, casting a gentle light through the clouds.
- Seasonal activities: spring cleaning and renewal in homes, community gatherings for Easter celebrations, indoor gatherings due to rain, often featuring board games or card games
- Seasonal occasions: Easter Sunday (April 12)
- Season: spring

Period Fashion (describe naturally):
- Men formal: double-breasted suits in muted colors like navy or charcoal, white dress shirts with stiff collars, black leather shoes with polished finishes
- Men casual: tweed jackets paired with khaki trousers, short-sleeved shirts for warmer days, flat caps or fedoras
- Men accessories: silk ties in geometric patterns, wristwatches with leather bands, pocket squares for added flair
- Women formal: tea-length dresses with floral patterns, tailored jackets with padded shoulders, nylon stockings with seam detailing
- Women casual: simple blouses with high-waisted skirts, lightweight cardigans for cooler evenings, sensible shoes with rounded toes
- Women accessories: string pearls or beaded necklaces, small clutches for evening outings, hats adorned with ribbons or flowers

Cultural Context (reference naturally):
- Music/entertainment: Bing Crosby's 'White Christmas', Glenn Miller's 'In the Mood', The Andrews Sisters' 'Boogie Woogie Bugle Boy'; Films: Casablanca, Mrs. Miniver; Theatre: The Glass Menagerie by Tennessee Williams, The Man Who Came to Dinner; Radio: The Shadow, Fibber McGee and Molly
- Typical prices: Loaf of bread: four pence, A pound of sugar: eight pence, Taxi fare across town: two shillings
- Current events: U.S. forces engage in the Battle of the Coral Sea, marking a significant naval confrontation in the Pacific; rationing of various goods intensifies as wartime supply lines are strained
- Literature: The Fountainhead by Ayn Rand | The Diary of a Young Girl by Anne Frank (not yet published but gaining attention) | The Maltese Falcon by Dashiell Hammett | [detective fiction] | [war novels] | [romantic fiction reflecting wartime themes]
- Technology: the first practical radar systems for detecting aircraft | advancements in code-breaking technology used by military intelligence | the introduction of synthetic rubber in various consumer products | wall-mounted radios for news and entertainment | early television sets starting to appear in affluent households | simple kitchen appliances like electric mixers and toasters
- Daily life: participating in local community defense meetings, attending church services for Easter celebrations, engaging in volunteer work to support war efforts
- Social rituals: family gatherings for Sunday dinners, neighborhood potlucks to share rationed goods, movie nights in homes, often featuring war-related films

Atmospheric Details:
The scent of rain-soaked earth mingled with the faint aroma of blooming spring flowers in the hotel garden. The sound of raindrops tapping against the windows creates a rhythmic backdrop, heightening the sense of tension within the hotel. Dim light from the hotel's fixtures casts soft shadows in the corners of
[truncated for prompt budget]

NON-NEGOTIABLE CHAPTER OBLIGATIONS — LOCKED EVIDENCE VALUES (VERBATIM REQUIRED):
The following measured values (times, amounts, measurements) are absolute ground truth. Every time this chapter describes, mentions, or alludes to one — no matter how briefly — it MUST use the exact phrase shown below, character for character. NO paraphrase, approximation, rounding, or synonym is permitted.

FAILURE EXAMPLE: if the locked value is "at thirteen minutes to midnight" and you write "just before midnight" or "around midnight" — that is a HARD FAIL. You must write "at thirteen minutes to midnight". Equally, if the locked value is written in words, such as "ten minutes past eleven", and you convert it to figure-based clock notation — that is also a HARD FAIL. Words stay as words; figure forms are forbidden for word-phrased facts.

CRITICAL — WORD-PHRASED VALUES: If the canonical value is written out in words (e.g. a time like "ten minutes past eleven", or an amount like "forty minutes"), reproduce those exact words. DO NOT convert to figure-based time notation, twenty-four-hour format, or any other numeric shorthand. Correct: "ten minutes past eleven". WRONG: figure-based clock notation or numeric shorthand.

Locked values:
  - The poison takes two hours to activate and show symptoms.: "two hours"
  - The victim must be exposed to the toxin for thirty minutes for it to take effect.: "thirty minutes"
  - The residue from the toxin can be detected for three minutes after ingestion.: "three minutes"
  - The toast occurred at ten minutes past eight.: "ten minutes past eight"
    ⛔ FORBIDDEN alternatives: "8:10", "8.10", "eight ten", "eight-ten", "eight past ten", "quarter past eight", "half past eight" — the ONLY acceptable form is "ten minutes past eight"

If a value has no relevance to this chapter, omit it. But the moment you reference the underlying evidence, only the exact phrase above is acceptable.

⚠ CENTRAL CONTRADICTION (the heart of the mystery): the two locked values "thirty minutes" and "three minutes" are NOT two separate facts — they are ONE contradiction (one is a staged appearance, the other the true state; the evidence determines which). If this chapter references both, you MUST present them AS A SINGLE CONTRAST joined by a contrast connective (but / yet / however / could only / whereas) — e.g. "the watch showed the one time, yet the evidence proved it could only have been the other" — making clear which reading is the appearance and which is the truth. NEVER state them as two flat, side-by-side truths — that makes the central clue read as if it contradicts itself.

⛔ CLUES TO SURFACE IN THESE CHAPTERS — mandatory:
The following evidence MUST be clearly observable to an attentive reader. Do not bury it in atmosphere or passing dialogue. Each clue must be concrete, specific, and noticeable:

• [clue_4] witnesses, recall, distinct, time, toast, finch, symptoms
  Category: temporal | Criticality: essential | Supports inference step 2
  Points to: symptoms, poisoning, appeared, expected

• [clue_5] delayed, reaction, poison, indicates, consumed, toast
  Category: behavioral | Criticality: essential | Supports inference step 2
  Points to: poison, must, placed, drink, beforehand

• [clue_6] witnesses, confirm, finch, seen, healthy, until, eleven, clock
  Category: testimonial | Criticality: essential | Supports inference step 2
  Points to: finch, health, status, before, toast

• [clue_id_6] witnesses, confirm, finch, seen, healthy, until, eleven, clock
  Category: testimonial | Criticality: essential | Supports inference step 2
  Points to: finch, health, status, before, toast

For each clue above: an attentive reader should be able to find, record, and later use it to reason toward the solution.

═══ NARRATIVE STATE (read-only — do not contradict) ═══

LOCKED FACTS — use verbatim whenever this evidence is described:
  • The poison takes two hours to activate and show symptoms.: "two hours"
  • The victim must be exposed to the toxin for thirty minutes for it to take effect.: "thirty minutes"
  • The residue from the toxin can be detected for three minutes after ingestion.: "three minutes"
  • The toast occurred at ten minutes past eight.: "ten minutes past eight"

CHARACTER PRONOUNS — never deviate from these:
  • Eleanor Voss: she/her/her
  • Dr. Mallory Finch: she/her/her
  • Captain Ivor Hale: he/him/his
  • Beatrice Quill: she/her/her
  • Sylvia Trent: she/her/her
  • Hugo Vane: he/him/his

CLUES ALREADY REVEALED TO READER: clue_mechanism_visibility_core, clue_id_5, clue_core_contradiction_chain, clue_3, clue_id_1, clue_id_2 — do not reveal these as new information.

INVESTIGATION LOG — WHAT IS ESTABLISHED (do not re-establish, do not repeat):
• Evidence already established (reference only — do NOT restate or quote these; advance beyond them): victim, poisoned, delayed, action, toxin | presence, toxin, finch, drink | poisoning, occurred, immediately | presence, toxin, finch, drink | victim, poisoned, delayed, action, toxin | poisoning, occurred, immediately
• Suspect cleared: Captain Ivor Hale[HE] — Witness accounts confirm his alibi during the time of the toast.
• Suspect cleared: Beatrice Quill[SHE] — Her cleaning duties kept her away from the dining area during the toast.
• Suspect cleared: Sylvia Trent[SHE] — She was with another guest in a different room at the time.
⚠ The story must move FORWARD from this log. Any beat already listed above is forbidden from repeating.

⚠ THIS CHAPTER'S REQUIRED ADVANCE (first_turn): Examine physical evidence — find at least one new clue

CONTINUITY HANDOFF — previous chapter closing beat:
  • "Eleanor gathered her notes, her mind already racing ahead to the next round of questions. The war outside had made everyone wary, but here, within the walls of the Coastal Seaside Hotel, trust was an even rarer commodity. She resolved to press harder, to test..."
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
dining room, terrace, flat

✓ RULE: Continue using this location vocabulary. Maintain consistency with established setting type.
✓ Do NOT introduce new location types that contradict earlier chapters.

**Recent Chapter Summary (for narrative continuity):**
Chapter 1: Chapter 1: The Toast and the Silence
  Events: A sharp clatter rang out in the dining room of the Coastal Seaside Hotel, slicing through the hush that lingered after the morning’s drizzle.
Chapter 2: Chapter 2: Initial Investigation
  Events: "You all saw her lift her glass, didn’t you?
Chapter 3: Chapter 3: Clue Discovery
  Events: She drew the glass closer, careful not to disturb the delicate trace.

⚠️ **VALIDATION:** Character name mismatches and setting drift are common failure modes.
Double-check every character name against the list above before using it.

**⏱ LOCKED TIME ANCHOR — use verbatim, do not paraphrase:**
Clock time (from the case ground truth): **"The toast occurred at nine o'clock"**
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
Known location profile anchors: The Cliffside Retreat, The Rooftop Terrace, Staff Lounge, The Grand Dining Room, The Grand Lobby, the lounge of the Coastal Seaside Hotel
LOCATION NAME CAPITALISATION (HARD REQUIREMENT — validated):
All named locations in your prose MUST use the EXACT capitalisation from the CML profiles.
Canonical forms: "The Cliffside Retreat", "The Rooftop Terrace", "Staff Lounge", "The Grand Dining Room", "The Grand Lobby", "the lounge of the Coastal Seaside Hotel"
Writing a location in lowercase (e.g. "drawing room" instead of "Drawing Room") is a validated error. Every time you mention a named location, copy its capitalisation from the list above.
- Chapter 4: OPENING STYLE (HARD): Start the VERY FIRST SENTENCE with a noun-phrase atmosphere — e.g. "The smell of damp stone in the cellar…" / "A chill from the landing…" / "The sound of the clock in the hall…". Pattern: "The/A [noun] of/in/from [place]…". Anchor opening in "the lounge of the Coastal Seaside Hotel". The opening style above governs only your FIRST SENTENCE; the grounding below may land anywhere in the first 2 paragraphs (it need not be sentence one, and never conflicts with the chosen opening style). HARD REQUIREMENT for the first 2 paragraphs: (a) include 2+ sensory words — choose from smell/scent/odor/fragrance/sound/echo/silence/whisper/creak/cold/warm/damp/rough/smooth/glow/shadow/flicker/dim — and (b) include 1+ atmosphere/time word — choose from rain/wind/fog/storm/mist/thunder/evening/morning/night/dawn/dusk/lighting/weather/season/afternoon/midday/noon/midnight/twilight/sunrise/sunset/daylight/sunlight/overcast/cloudy/bright/dark/grey/pale/chill/crisp/drizzle/haze/lamplight/firelight. These are validated requirements, not style suggestions; missing them triggers a retry.

[⚠ INTERNAL QUALITY DIAGNOSTICS — DO NOT REPRODUCE ANY PART OF THIS SECTION IN YOUR STORY OUTPUT. These are private generator observations for your consideration only. Your narrative must read as if this section does not exist. Never include phrases from this block in character dialogue, narration, or description.]

PRIOR CHAPTER QUALITY OBSERVATIONS:
- Chapter 1 (score 98/100):
  Quality gaps noted: word density below preferred target (974/1000)
  Address in upcoming chapters: Increase chapter density with concrete investigation action and sensory-grounded beats; avoid recap-only padding.
- Phrases to avoid (already overused in earlier chapters): "the dining room of the coastal seaside", "dining room of the coastal seaside hotel", "the war outside had made everyone wary", "war outside had made everyone wary but", "outside had made everyone wary but here", "everyone wary but here was a threat".
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

PROMPT BUDGET SUMMARY: budget=24000 tokens; fixed=13620; context=10240; dropped=[humour_guide, location_profiles, texture_pool]; truncated=[location_profiles, temporal_context, pronoun_accuracy]

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
4. Integrate at least two concrete era-grounded details per chapter from setting refinement signals: ubiquitous radios | early television sets | basic radar systems | code-breaking devices | long-distance telephone calls | military-grade encryption.
5. Respect setting movement/access constraints in scene action and alibis: narrow hallways limiting movement | oceanfront cliffs creating natural barriers | weather conditions affecting outdoor access | restricted access to staff areas | keycard system for guest rooms.
6. Sustain social coherence with this backdrop pressure: A delayed-action poisoning at a seaside hotel draws together a diverse group of guests and staff, all grappling with post-war trauma and the pressures of changing social norms amidst Cold War tensions.
7. Maintain continuity around these socially central cast anchors where relevant: Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill, Sylvia Trent, Hugo Vane.
8. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Critical: Plot similarity 0.85 with 'The Mysterious Affair at Styles' (same crime method of delayed-action poisoning)
9. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Moderate: Setting similarity 0.90 with 'The Mysterious Affair at Styles' (same era and coastal hotel setting)
10. STORY TO DATE ANTI-COPY RULE: The STORY TO DATE section below is provided for chronological and factual reference ONLY. You MUST NOT copy, lightly rephrase, or structurally echo any sentence or paragraph from prior chapters. Every sentence in this chapter must be original prose unique to this scene. Reusing even a clause from prior chapter text will cause this attempt to fail immediately.

CRITICAL PROSE REQUIREMENTS:

The CML specifies exact requirements for certain validation-critical scenes. You MUST include these elements at the specified positions.

**Discriminating Test Scene (Act 3, Scene 4):**
Required elements: Execute the discriminating test, Observe the culprit's reaction or result, Draw conclusion about guilt
Test type: Reenactment

**Suspect Clearance Scenes:**
- Captain Ivor Hale (Act 3, Scene 5): Witness accounts confirm his alibi during the time of the toast.
  Clues: clue_id_1, clue_id_2
- Beatrice Quill (Act 3, Scene 5): Her cleaning duties kept her away from the dining area during the toast.
  Clues: clue_id_3, clue_id_4
- Sylvia Trent (Act 3, Scene 5): She was with another guest in a different room at the time.
  Clues: clue_id_5, clue_id_6

**Culprit Revelation Scene (Act 3, Scene 6):**
Method: Confrontation with evidence

**Clue Placement for These Chapters:**
- clue_4 must appear in Act 2, Scene 1 via Direct observation

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
Investigation state at start: 6 clue(s) revealed to reader; approximately 0 unresolved suspect(s).
Must change by end: Increase or complicate suspicion through a new pressure revelation — WITHOUT resolving the case: do NOT name, accuse, or extract a confession from the culprit, make an arrest, or declare the case closed (that is reserved for the final reveal).
Suspect pressure target(s): Hugo Vane, Captain Ivor Hale
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
  - Scene is set in: the lounge of the Coastal Seaside Hotel — reference it naturally within the paragraph, never as your opening phrase.
  - Opening atmosphere (MANDATORY — validator enforced): the first paragraph MUST contain at least one of: rain / wind / fog / storm / mist / thunder / evening / morning / night / dawn / dusk / season / afternoon / midday / noon / midnight / twilight / sunrise / sunset / daylight / sunlight / overcast / cloudy / bright / dark / grey / pale / cold / warm / chill / crisp / damp / drizzle / haze / lamplight / firelight. A chapter that omits all of these from its opening paragraph will be rejected.
  - PARAGRAPH OPENER DIVERSITY (MANDATORY — validator enforced): No more than 2 paragraphs in this chapter may begin with "Eleanor" or "Eleanor's" as the first word. You must vary paragraph openings throughout: use sensory observations, another character's name or action, dialogue, object or sound details, or temporal markers. Opening 3 or more paragraphs with "Eleanor" will cause automated rejection.
  - ⛔ MECHANISM SPOILER BAN: Do NOT state how the crime device was manipulated — not the direction, not the magnitude, not who performed it. Characters may only observe that two sources of evidence disagree. The specific method, tamper amount, and perpetrator's action are ALL FORBIDDEN until the reveal. WRONG: "The culprit had altered the device by forty minutes to create a false alibi." RIGHT: "Two independent pieces of evidence gave contradictory readings — a discrepancy neither could yet explain."
  - Continuity bridge: in the first 120 words, visibly connect from the previous chapter's final beat. Carry forward one unresolved element (object, accusation, emotional pressure, or immediate physical action) from: "Eleanor gathered her notes, her mind already racing ahead to the next round of questions. The war outside had made everyone wary, but here, within the walls of the Coastal Seaside Hotel, trust was an even rarer commodity...".
  - CLUE OBLIGATIONS — each clue below MUST be dramatized, but in YOUR OWN WORDS:
    Render each as something a character SEES, DOES, or SAYS on the page. The bracketed text is a
    DESCRIPTION of the evidence for you — do NOT transcribe it as narration. Copying a clue's
    description sentence verbatim into the prose FAILS validation.
    • witnesses, mention, time, elapsed, toast [clue_4]
      Points to: symptoms, poisoning, appeared, expected
    • finch, symptoms, appear, significantly [clue_5]
      Points to: poison, must, placed, drink, beforehand
    • witnesses, describe, finch, condition, before, toast [clue_6]
      Points to: finch, health, status, before, toast
    • witnesses, describe, finch, condition, before, toast [clue_id_6]
      Points to: finch, health, status, before, toast
  - Tonal contrast: include at least one beat of relief or ironic counterpoint. Do not sustain maximum tension for every paragraph.
  - CLUE DISCLOSURE RULE (Stage 2/4):
    Characters may establish access and opportunity but must NOT state the crime method or draw the final clue-to-culprit connection. Investigation without conclusion.
    WRONG: dialogue or narration that directly explains how the crime was committed before Stage 4.
    RIGHT: observation, physical reaction, and logical inference that leaves the mechanism just off-screen.
  - SUSPECT-PRESSURE MODE: do NOT resolve the case in this chapter. No confession, arrest, final accusation, definitive culprit declaration, or case-closed language. End with unresolved pressure: a contradiction, narrowed suspicion, motive pressure, or a new question.
  - ALIBI LOCK: Hugo Vane's established alibi is "evening of the murder". Do NOT place Hugo Vane at any other location or in any other activity during the crime window. Any contradiction is a continuity error that triggers a retry.
  - TESTIMONY CONTINUITY: Hugo Vane has already made statements in earlier chapters. Any time, location, or claim attributed to Hugo Vane in THIS chapter must be consistent with those earlier statements. Do NOT introduce a new or different alibi claim — any contradiction is a continuity error.

- Tonal contrast required: the previous chapter was high-tension. This chapter must include at least one beat of relief, pause, or quiet observation.
- Locked fact phrase obligations:
  - If this batch mentions The poison takes two hours to activate and show symptoms., write exactly: "two hours".
  - If this batch mentions The victim must be exposed to the toxin for thirty minutes for it to take effect., write exactly: "thirty minutes".
  - If this batch mentions The residue from the toxin can be detected for three minutes after ingestion., write exactly: "three minutes".
  - If this batch mentions The toast occurred at ten minutes past eight., write exactly: "ten minutes past eight".
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
Batch chapters: 4-4.
Investigation state at start: 6 clue(s) revealed to reader; approximately 0 unresolved suspect(s).
Must change by end: Increase or complicate suspicion through a new pressure revelation — WITHOUT resolving the case: do NOT name, accuse, or extract a confession from the culprit, make an arrest, or declare the case closed (that is reserved for the final reveal).
Suspect pressure target(s): Hugo Vane, Captain Ivor Hale
Required new information: At least one fear/motive/lie/loyalty reveal with investigative consequence.
Forbidden reveals at this stage: No culprit resolution: no confession, no arrest, no 'case closed', no accusation ('I accuse'/'I name'), and never state 'the culprit/murderer/killer is/was …'. The accusation is reserved for the final reveal — build suspicion only.

FROZEN FACT STATE (DO NOT ALTER):
- Timeline anchor: April (spring).
- Month, season, weather, and time-of-year language in this batch must stay compatible with spring.
- Established timeline fact: The toast occurred at nine o'clock
- Established timeline fact: Dr. Finch was seen healthy until eleven o'clock
- If referenced, use exact phrase: "two hours" (The poison takes two hours to activate and show symptoms.).
- If referenced, use exact phrase: "thirty minutes" (The victim must be exposed to the toxin for thirty minutes for it to take effect.).
- If referenced, use exact phrase: "three minutes" (The residue from the toxin can be detected for three minutes after ingestion.).
- If referenced, use exact phrase: "ten minutes past eight" (The toast occurred at ten minutes past eight.).

STORY TO DATE (REFERENCE ONLY — DO NOT COPY VERBATIM):
- Full prior chapter text is provided below for continuity, factual consistency, and reference accuracy.
- Use this to keep character voice, chronology, clue state, and location continuity aligned with earlier chapters.
- Do not quote, copy, or paraphrase these paragraphs too closely; write fresh prose that remains consistent with them.

--- BEGIN PRIOR CHAPTER 1 ---
Title: Chapter 1: The Toast and the Silence
A sharp clatter rang out in the dining room of the Coastal Seaside Hotel, slicing through the hush that lingered after the morning’s drizzle. Eleanor Voss pressed her palm to the cold wood of the door, the faint scent of rain and coffee mingling in the air as she stepped inside. Lamplight flickered across the pale linen tablecloths, casting long, uncertain shadows. There, sprawled at the head of the table, lay Dr. Mallory Finch—her body unnaturally still, the delicate lines of her face slack, one hand splayed across the polished surface. An empty glass rested at her elbow, its rim stained with a faint greenish residue that caught the light. The room, usually abuzz with the clinking of cutlery and the low hum of conversation, now seemed to hold its breath. The only sound was the distant echo of waves against the cliffs, underscoring the unnatural silence.

Eleanor’s gaze fixed on the glass, the residue unmistakable even from a distance. She drew closer, careful not to disturb the scene, and knelt beside Dr. Mallory Finch. The air was tinged with the sharp tang of spirits and something more acrid—an herbal note that did not belong. Guests hovered at the threshold, their faces pale and drawn, whispering about the suddenness of Dr. Finch’s collapse. One woman’s voice, brittle with nerves, carried across the hush: “It was just after the toast—she raised her glass, and then—” The words faltered, lost in a collective shudder. Eleanor noted the detail: Dr. Finch had lifted her glass during the toast, moments before her body failed her.

She reached for the glass, holding it to the light. The greenish smear along the inside was not the residue of wine or cordial. Eleanor’s mind ticked over the possibilities—poison, perhaps, introduced by way of a local plant, its effects masked until the moment of collapse. The guests’ murmurs grew louder, some insisting it was excitement from the celebration, others whispering about the war’s toll on everyone’s nerves. Yet the evidence in Eleanor’s hand told a different story. The residue was too deliberate, too foreign to be chance. She set the glass down with care, her pulse quickening. This was no accident.

She straightened, surveying the room. The dining room’s tall windows were streaked with the remnants of spring rain, the overcast sky lending a grey cast to the morning. The scent of damp stone seeped in from the terrace beyond. Eleanor’s eyes swept over the assembled guests—each one a potential witness, or something more. Captain Ivor Hale, the household steward and Dr. Finch’s trusted adviser, stood nearest the body. His posture was disciplined, but his hand tightened around his watch chain. Beatrice Quill lingered by the sideboard, her gaze darting between Eleanor and the glass, fingers drumming a nervous rhythm on the polished wood. Sylvia Trent, half-hidden behind a velvet curtain, clutched a handkerchief, her eyes red-rimmed but dry. Hugo Vane leaned against the far wall, arms folded, his expression unreadable except for the muscle twitching in his jaw.

Eleanor cleared her throat, her voice steady despite the tension that prickled at the edges of her composure. “No one is to leave this room,” she said. “Until we understand what happened, I must ask for your patience—and your honesty.” A ripple of discomfort passed through the group. Captain Ivor Hale nodded once, his jaw set in grim agreement. Beatrice Quill’s lips parted as if to protest, but she thought better of it. Sylvia Trent’s fingers twisted her handkerchief tighter, while Hugo Vane’s gaze flicked to the window, as though calculating the distance to the exit.

She moved to the sideboard, noting the untouched plates and half-finished breakfast dishes—a tableau of interrupted routine. The radio on the mantel, tuned to the morning news, crackled with static, the announcer’s clipped tones barely audible beneath the tension. Eleanor’s own reflection in the silver teapot looked back at her: sharp eyes, hair pinned with more haste than care, the faintest shadow of fatigue beneath her cheekbones. She squared her shoulders. The war had taught her resilience, but nothing in London’s air raids had prepared her for this particular kind of dread.

A guest’s voice, hesitant, broke the silence. “Dr. Finch seemed perfectly well before the toast. She was laughing, talking about the springtime, the new patients she hoped to help.” Another chimed in, “It must have been the excitement—she was always so passionate, perhaps her heart simply gave out.” The explanations tumbled over one another, eager to fill the void left by shock. Eleanor listened, weighing each word. The residue in the glass, the suddenness of the collapse, the herbal scent—none of it fit the narrative of natural causes.

She returned to the body, careful to avoid the pool of spilled liquid that had seeped into the tablecloth. Dr. Finch’s features, usually animated by conviction, were now fixed in an expression of surprise. Eleanor’s hand hovered above the empty glass, the pivot of the entire scene. She could almost feel the weight of the unanswered questions pressing in from every corner of the room. The morning’s overcast light, filtering through streaked glass, seemed to flatten the world into shades of uncertainty. Yet amid the confusion, one fact was inescapable: Dr. Mallory Finch was dead, and the cause was not as innocent as the guests wished to believe.

Eleanor drew a slow breath, letting the tension settle. The war outside had made everyone wary, but here was a threat of a different order—one that wore the mask of celebration and struck in the midst of spring’s fragile renewal. She glanced once more at the glass, the greenish residue glinting in the lamplight, and resolved that whatever secrets this room held, she would see them laid bare. The investigation, she knew, began not with the body, but with the contradictions that lingered in the silence after the toast.
--- END PRIOR CHAPTER 1 ---

--- BEGIN PRIOR CHAPTER 2 ---
Title: Chapter 2: Initial Investigation
"You all saw her lift her glass, didn’t you?" Eleanor’s voice, low but steady, cut through the anxious murmurs that filled the dining room of the Coastal Seaside Hotel. The faint echo of rain against the windowpanes mingled with the scent of damp stone and the metallic tang of fear. Lamplight struggled to dispel the grey morning gloom, casting wavering shadows across the linen-draped tables. Eleanor stood at the head of the table, her gaze fixed not on the body—now respectfully covered—but on the empty glass with its telltale greenish smear. The guests clustered in uneasy knots, their faces pale in the cold light, as if the spring itself had retreated from the room.

She let her question hang, watching the subtle shifts in posture and the way eyes darted from her to one another. Captain Ivor Hale cleared his throat, his broad shoulders squared with habitual discipline. "I saw Dr. Finch take a sip before the toast, Miss Voss. She was chatting with Hugo—something about the charity’s accounts, I believe. Looked a bit pale, if you ask me, just before we all stood to raise our glasses." Beatrice Quill, perched on the edge of a chair, shook her head with a brittle laugh. "Pale? She was laughing at Sylvia’s joke—something about the vernal equinox and the hotel’s dreadful coffee. She didn’t touch her drink until the toast. I’d swear to it." The contradiction was immediate and sharp, slicing through the fragile unity of the group.

Eleanor’s mind caught on the disparity. If Dr. Finch had drunk before the toast, as Captain Ivor Hale insisted, the timing of her collapse—and the means by which she was poisoned—became far less clear. But if Beatrice Quill was right, and Dr. Finch’s first sip came with the toast itself, then the culprit’s opportunity narrowed to that precise moment. The evidence in the glass, the residue, and the scattered recollections of the guests formed a chain whose links did not quite fit. Eleanor pressed her fingers to the cool surface of the sideboard, feeling the tension in her own body echo the strain in the room. The truth, as ever, seemed to shift with the light.

Sylvia Trent, her hands twisting a handkerchief into a pale knot, spoke up from her place near the window. "She was in good spirits, I thought. We were talking about art—she said she envied anyone who could paint spring as it felt, not as it looked. I didn’t see her drink before the toast, but then, I was distracted." Her voice was soft, but the words carried a note of defensiveness, as if she sensed the scrutiny settling on her. Hugo Vane, arms folded and jaw clenched, offered a tight smile. "I hardly think it matters whether she sipped before or after. The result is the same, isn’t it?"

Eleanor turned to Hugo Vane, noting the way his gaze lingered on the covered body before flicking away. "It matters a great deal, Mr. Vane. If Dr. Finch drank before the toast, the window for her poisoning widens considerably. If not, then the moment of the toast becomes crucial." She watched for a reaction—any flicker of guilt or relief—but his expression remained carefully neutral. The others, however, shifted uncomfortably, as if the boundaries of suspicion had suddenly redrawn themselves around each of them.

Captain Ivor Hale’s hand hovered near his watch chain, the gesture unconsciously reminiscent of an officer checking the tide. "If I may, Miss Voss, I thought Dr. Finch seemed unwell just before we stood for the toast. Perhaps it was nothing, but she did look rather drawn." His words, delivered with a sailor’s gravity, introduced a new thread of doubt. Was the victim already succumbing to something before the fatal drink, or was this an attempt to muddy the waters? Eleanor filed the detail away, aware that red herrings often swam closest to the truth.

Beatrice Quill’s voice, usually bright, now carried a brittle edge. "I was watching her, you know. She was perfectly fine—better than fine, actually. She was teasing Hugo about his stinginess with the sugar ration." Beatrice Quill’s gaze darted to Hugo Vane, then away. Her hands, adorned with a string of imitation pearls, fidgeted in her lap. "If you want my opinion, someone’s memory is playing tricks."

Sylvia Trent gave a short, humourless laugh. "Art is the only truth I know," she said, almost to herself. "But even that’s open to interpretation." She glanced at Eleanor, her eyes searching for reassurance or perhaps absolution. Eleanor offered neither, only a measured nod. The contradictions in the room were not simply matters of faulty recollection—they were battlegrounds where guilt and innocence waged their silent war.

The radio on the mantel crackled with the distant sound of a news broadcast, the announcer’s clipped tones barely audible over the storm of conflicting testimonies. Eleanor let the noise fill the silence, buying herself a moment to consider. The war outside had made everyone wary, but here was a threat that demanded a different kind of vigilance—a readiness to see past the surface of things, to question even the most ordinary gestures.

She addressed the group again, her tone gentler but no less insistent. "I know these are difficult questions. But the smallest detail may matter. Did anyone else notice Dr. Finch’s actions before the toast?" There was a pause, then Captain Ivor Hale shook his head. "Nothing more, I’m afraid. She seemed distracted, perhaps, but then, we all have our burdens these days." His words hung in the air, heavy with the weight of unspoken sorrows.

Eleanor’s gaze swept the room, taking in each face in turn. The spring rain had left the windows streaked and the air inside faintly chill, but it was the uncertainty—the knowledge that one of them might be lying—that sent a true shiver down her spine. The contradictions in their accounts were not merely the product of shock or confusion. They hinted at something deeper: secrets, perhaps, or the instinct to protect oneself in the face of accusation.

She found herself studying Hugo Vane more closely. His composure was impressive, but there was a rigidity to his stance, as if he were bracing for a blow. "You were speaking with Dr. Finch before the toast, Mr. Vane?" Eleanor asked, her tone deceptively mild. Hugo Vane’s lips curved in a polite, almost mocking smile. "We exchanged a few words about the charity’s accounts, yes. She seemed in good spirits. If I noticed anything else, I’m sure I would have said so." His reply was smooth, but Eleanor caught the faintest hesitation before he answered.

Beatrice Quill interjected, her voice rising. "If we’re all suspects now, perhaps we should have tea and wait for the police to sort us out." The attempt at levity fell flat, the room too taut for humour. Eleanor allowed herself a dry smile. "Perhaps. But until then, I intend to ask questions."

Sylvia Trent’s eyes glistened with unshed tears. "I wish I could remember more," she murmured. "It all happened so quickly. One moment she was laughing, the next—" Her voice faltered, and she pressed the handkerchief to her mouth. The emotional cost of the morning was beginning to show, the strain etching new lines into already tired faces.

Eleanor clenched her fists at her sides, feeling the weight of the investigation settle over her like the persistent drizzle outside. The conflicting statements about when Dr. Finch last drank from her glass gnawed at her. If the accounts could not be reconciled, then someone was lying—or worse, someone had manipulated the scene to conceal the truth. The pivot point of the investigation had shifted: what once seemed a matter of simple timing was now a labyrinth of memory and motive.

She drew a slow breath, letting the tension settle. The war outside had made everyone wary, but here was a threat of a different order—one that wore the mask of celebration and struck in the midst of spring’s fragile renewal. Eleanor glanced once more at the glass, the greenish residue glinting in the lamplight, and resolved that whatever secrets this room held, she would see them laid bare. The contradictions in these testimonies were not dead ends, but signposts—if only she could learn to read them.
--- END PRIOR CHAPTER 2 ---

--- BEGIN PRIOR CHAPTER 3 ---
Title: Chapter 3: Clue Discovery
Later that morning, the dining room of the Coastal Seaside Hotel was heavy with a damp chill, the scent of rain-soaked stone lingering beneath the sharper tang of spirits. Lamplight flickered across the pale linen, drawing shadows along the edges of the table where Dr. Mallory Finch’s glass still sat. Eleanor Voss, her fingers cold despite the springtime, leaned in to examine the rim. The residue was unmistakable: a faint greenish smear, almost iridescent, clung to the inside, catching the light in a way that made her stomach tighten.

She drew the glass closer, careful not to disturb the delicate trace. The guests' voices, hushed and uncertain, drifted behind her—yet Eleanor’s focus narrowed to the evidence before her. This was no accidental stain, no remnant of cordial or wine. The colour and texture matched what she knew of local sea plants, some of which were rumoured, in village lore, to be toxic. The implication was chilling: someone had introduced a poison, deliberately, into Dr. Finch’s drink. The presence of the residue was a silent accusation, one that demanded explanation from those who had shared the table.

Eleanor straightened, her gaze sweeping the room. The air was thick with tension, the only relief the faint echo of the wireless from the hall, its news of distant battles a reminder that danger was not always so far away. She turned to the cluster of guests. "You all saw Dr. Finch raise her glass at the toast?" she asked, her voice even. Several nodded, but there was hesitation in their eyes. "Did anyone notice if she drank before that moment?"

Captain Ivor Hale, standing near the window, answered first. "She took a sip before the toast, I’m certain. She and Hugo were discussing the accounts—she seemed distracted, but she definitely drank." The comment drew a sharp look from Hugo Vane, who stood with his arms folded, gaze fixed on the rain-streaked glass. Beatrice Quill, perched at the end of the table, shook her head. "No, she waited. I was watching—I’d have noticed if she’d touched her glass before the toast. She was teasing Hugo about the sugar ration just then."

The contradiction was immediate, and Eleanor let it hang in the air. If Dr. Finch had been poisoned by her drink, the timing of when she sipped became crucial. The residue in the glass was proof of exposure, but it did not reveal whether the fatal dose was taken before the toast or during it. The guests’ conflicting memories only deepened the uncertainty. Eleanor’s mind ticked over the possibilities: if the poison required time to act, then Dr. Finch’s collapse after the toast might be a carefully constructed illusion. The residue, the timing, the suddenness of her death—all pointed to a toxin with a delayed effect.

Sylvia Trent, her voice barely above a whisper, spoke from her place near the sideboard. "She seemed happy, I thought. We were talking about art, and she laughed at something I said. I didn’t see her drink before the toast, but I was distracted." Her words, though uncertain, added another layer to the growing confusion. Eleanor pressed her lips together, considering. The evidence was clear—Dr. Finch had ingested something dangerous—but the precise moment of exposure remained elusive.

Eleanor turned the glass in her hand, watching the greenish smear catch the light. The residue was not only proof of poison, but also a clue to its origin. Local sea plants, some of which were known to be toxic, left just such a mark. She recalled the stories told by fishermen in Brighton: a toxin that could take "two hours" to show its effects, a slow and insidious agent that masked its presence until too late. If that were the case, then the timing of Dr. Finch’s collapse was not as straightforward as it seemed.

She set the glass down, her gaze meeting Hugo Vane’s across the table. "Mr. Vane, you spoke with Dr. Finch before the toast?" she asked, her tone deceptively mild. Hugo’s lips curved in a polite, almost mocking smile. "We exchanged a few words about the charity’s accounts, yes. She seemed in good spirits. If I noticed anything else, I’m sure I would have said so." His reply was smooth, but Eleanor caught the faintest hesitation before he answered. There was something brittle in his composure, a tension that belied his practiced nonchalance.

Beatrice Quill leaned forward, her fingers drumming the table. "If we’re all suspects, perhaps we should have tea and wait for the authorities to sort us out." The attempt at levity fell flat, the room too taut for humour. Eleanor allowed herself a dry smile. "Perhaps. But until then, I intend to ask questions." She watched Hugo Vane carefully. There was a flicker of something—resentment, perhaps, or fear—when his name was mentioned in connection with the accounts. The war had left everyone on edge, but Hugo’s anxiety seemed to run deeper, tinged with something personal.

Captain Ivor Hale cleared his throat. "If I may, Miss Voss, Dr. Finch did look rather drawn before the toast. Perhaps it was nothing, but she seemed unwell." His words, delivered with a sailor’s gravity, introduced doubt. Was the victim already succumbing to the poison before the toast, or was this an attempt to muddy the waters? The contradiction between his account and Beatrice Quill’s was not easily dismissed.

Eleanor’s thoughts circled the residue, the conflicting testimonies, and the suddenness of Dr. Finch’s collapse. The evidence pointed to a toxin that required "thirty minutes" of exposure to take effect, yet the residue from the toxin could be detected for only "three minutes" after ingestion. The contradiction gnawed at her: if the poison was so fleeting, how could it have lingered in the glass for her to find? Unless, of course, the timing of the fatal dose was not what it appeared.

She glanced at Hugo Vane again, noting the way his jaw tightened as the conversation returned to Dr. Finch’s success and the charity’s finances. "Ah, the price of charity is often too high," he murmured, voice low enough that only Eleanor caught it. The words were meant to be sardonic, but there was a raw edge to them—a hint of frustration and jealousy that did not escape her notice.

A faint breeze rattled the windowpanes, carrying with it the scent of the sea and the distant sound of gulls. The spring weather, unpredictable as ever, seemed to mirror the uncertainty in the room. Eleanor let her gaze wander over the assembled guests, searching for cracks in their composure. The war had made everyone wary, but here was a threat that wore a familiar face. The residue in the glass, the conflicting testimonies, the subtle tensions—they were all threads in a tapestry she was only beginning to unravel.

Sylvia Trent dabbed at her eyes with a handkerchief, her voice trembling. "I wish I could remember more. It all happened so quickly. One moment she was laughing, the next—" The words faltered, and Eleanor felt a pang of sympathy. The emotional cost of the morning was beginning to show, not just in Sylvia but in all of them. The investigation was no longer an abstract puzzle; it was a wound, raw and unhealed, that each guest carried in her own way.

Eleanor pressed her hand to the cool surface of the sideboard, feeling the weight of the investigation settle over her. The contradictions in the guests’ accounts were not simply matters of faulty recollection—they were battlegrounds where guilt and innocence waged a silent war. She could not yet say who was lying, or why, but the residue in the glass was a fact that could not be ignored. It was proof of foul play, and a warning that the truth would not be easily won.

As the morning wore on, the tension in the dining room mounted. Eleanor watched Hugo Vane, noting the way his composure frayed whenever Dr. Finch’s success was mentioned. There was a bitterness in his voice, a resentment that hinted at deeper wounds. The investigation had only just begun, but already the lines of suspicion were being drawn—not by evidence alone, but by the hidden currents of jealousy, fear, and ambition that swirled beneath the surface.

Outside, the rain eased, leaving the windows streaked and the air inside faintly chill. Eleanor let the silence stretch, giving each guest space to confront her own memories. The residue in the glass, the suddenness of Dr. Finch’s collapse, the contradictory testimonies—all were pieces of a puzzle that refused to fit. Yet in the midst of confusion, one fact was inescapable: Dr. Finch had been poisoned, and the means of her death was as deliberate as it was cunning.

Eleanor gathered her notes, her mind already racing ahead to the next round of questions. The war outside had made everyone wary, but here, within the walls of the Coastal Seaside Hotel, trust was an even rarer commodity. She resolved to press harder, to test each alibi and motive until the truth emerged—no matter how many contradictions she had to untangle along the way.
--- END PRIOR CHAPTER 3 ---

[SCENE COMPLETENESS CONTRACTS — MANDATORY. Each contract below lists what you MUST enact in that chapter. Do not summarise or mention these labels in the prose — enact them organically.]
Chapter 4 (Act 2) completeness contract:
  PIVOT ELEMENT (MANDATORY — write this into the prose, shown not told): "The accusations exchanged during the questioning, revealing motives."
  FACT ESTABLISHED (MANDATORY — reader must know this by chapter end): "Establishes multiple motives among the suspects, deepening the intrigue."

# Case Overview
Title: The Delayed Toxin
Era: 1940s
Setting: Coastal Seaside Hotel
Crime: murder (delayed-action poison)
Culprit: Hugo Vane
Victim: Dr. Mallory Finch
False assumption: The victim was poisoned immediately during the toast.
Cast: Eleanor Voss (she/her), Dr. Mallory Finch (she/her), Captain Ivor Hale (he/him), Beatrice Quill (she/her), Sylvia Trent (she/her), Hugo Vane (he/him)

Setting Lock: Keep all scenes and descriptions consistent with the stated setting (Coastal Seaside Hotel). Do not introduce a different location type. Do not invent an alternative estate name. The only permitted name for this property is "Coastal Seaside Hotel" — any other estate name (e.g., "Caldwell Manor", "Ashwood Hall", or any invented proper name) is a continuity error that will be caught and rejected.

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
    "title": "Questioning the Suspects",
    "setting": {
      "location": "the lounge of the Coastal Seaside Hotel",
      "timeOfDay": "Afternoon",
      "atmosphere": "A charged atmosphere filled with anxiety"
    },
    "characters": [
      "Eleanor Voss",
      "Hugo Vane",
      "Captain Ivor Hale"
    ],
    "purpose": "Interrogate suspects and reveal motives",
    "cluesRevealed": [
      "clue_4",
      "clue_5",
      "clue_6",
      "clue_id_6"
    ],
    "dramaticElements": {
      "conflict": "Suspects grow defensive under questioning",
      "tension": "Accusations fly as motives are revealed",
      "microMomentBeats": [
        "Hugo's voice trembles as he defends his position."
      ]
    },
    "summary": "Eleanor Voss conducts a series of interrogations with the suspects, focusing on their motives and alibis. As she delves deeper, she uncovers potential motives for each suspect, while the tension escalates. The guests begin to turn on each other, revealing hidden resentments and rivalries.",
    "beat": "motives",
    "estimatedWordCount": 1500,
    "pivotElement": "The accusations exchanged during the questioning, revealing motives.",
    "factEstablished": "Establishes multiple motives among the suspects, deepening the intrigue.",
    "permittedBehavioursByAct": [
      {
        "characterName": "Eleanor Voss",
        "behaviour": "May show unease, evasion, or mild defensiveness when questioned."
      },
      {
        "characterName": "Hugo Vane",
        "behaviour": "May show unease, evasion, or mild defensiveness when questioned."
      },
      {
        "characterName": "Captain Ivor Hale",
        "behaviour": "May show unease, evasion, or mild defensiveness when questioned."
      }
    ],
    "redHerringPlacement": null,
    "emotionalRegister": "A pivotal clue shifts the investigation's direction, raising new questions.",
    "dominantCharacterNote": {
      "name": "Eleanor Voss",
      "voiceRegister": "Eleanor's voice is confident and articulate, often punctuated with dry wit that reveals her sharp intellect."
    },
    "humourGuidance": {
      "permission": "forbidden"
    },
    "eraTextureNote": "Limited availability of goods due to wartime rationing; Travel restrictions affecting movement and communication; Public gatherings closely monitored due to security concerns",
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
