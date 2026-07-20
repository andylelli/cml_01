# Actual Prompt Record

- Run ID: `mystery-1784576986525`
- Project ID: ``
- Timestamp: `2026-07-20T19:55:38.452Z`
- Agent: `Agent9-ProseGenerator-Ch2`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4.1`
- Temperature: `0.42`
- Max Tokens: `4500`
- Attempt: `first`
- Prompt Hash: `7a030b5a8b736428`

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
- MORAL COMPLEXITY REQUIREMENT: The mechanism of this crime carries a moral gray area: "The murderer believed they were protecting the victim from a greater danger, complicating the morality of their actions." — the culprit reveal and denouement MUST acknowledge this ambiguity. Do not let the ending feel clean or simple. Give the reader at least one moment of uncomfortable sympathy or moral doubt.

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
   - Dr. Mallory Finch: Professional with a past
   - Captain Ivor Hale: Protective Patriarch
   - Beatrice Quill: Ambitious Upstart
   - Sylvia Trent: Creative Visionary
   - Hugo Vane: Businessman with a secret
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

## Era: 1941-08
In August 1941, the political climate is tumultuous, with the world embroiled in conflict. The echoes of war resonate deeply in the lives of everyday people, who are adapting to rationing and the shifting social landscape. The seaside hotel reflects a microcosm of society, where the wealthy attempt to retain their status amid growing uncertainties, and the shadow of the war looms large, affecting the emotional and economic fabric of life.
Emotional register: A pervasive sense of anxiety and uncertainty hangs over society as individuals grapple with the implications of an escalating global conflict.
Physical constraints: Rationing affects the availability of goods, including clothing and food. | Travel is limited due to fuel shortages and wartime restrictions. | Communications are strained, with reliance on radio updates for news.
Current tensions (weave into background texture): The U.S. maintains a neutral stance while providing aid to Allies, raising questions about involvement. | Nazi Germany's advances in Europe create fear and anxiety among citizens. | Growing debates about civil liberties as the nation prepares for potential war involvement.
Wartime context — Many families are involved in the war effort, with men enlisted and women stepping into roles traditionally held by them.: Women increasingly enter the workforce, challenging traditional gender roles, while class distinctions remain pronounced. Absence effect: The absence of loved ones in military service adds to the emotional strain, creating a community atmosphere of both camaraderie and fear.

## Story Theme
In a world fraught with personal and societal tensions, the quest for truth becomes a perilous journey, revealing the hidden depths of greed and desperation.

## Story Emotional Register
Dominant: The emotional journey fluctuates between tension and revelation, culminating in a powerful confrontation.

Arc:
The story opens with a palpable tension at the Grand Tides Hotel, where the shimmering façade belies the undercurrents of anxiety as Eleanor Voss is found drowned, her death sending shockwaves through the gathered guests. As Detective Hugo Vane begins his investigation, the initial clues are fraught with confusion and misdirection, revealing the emotional costs of each suspect’s secrets. The rising unease is felt as false leads emerge, creating a heavy atmosphere of suspicion that weighs on everyone involved. A pivotal moment occurs when Hugo uncovers discrepancies in the tide table, prompting a shift in his investigation, redirecting the focus on those with the most to hide. A second revelation sheds light on Beatrice’s blackmail scheme, recoloring the earlier events as past decisions come back to haunt the present. As pressure mounts, the climax unfolds with a confrontation that unveils the hidden truths behind Eleanor's death, forcing each character to confront their own culpability. The resolution brings a bittersweet closure, as the emotional scars of betrayal and guilt linger, leaving the characters forever changed by the events at the Grand Tides Hotel.

The story opens: The atmosphere is heavy with tension and foreboding. As the investigation takes shape: The investigation begins with confusion and emotional costs for the characters. A first key turn arrives: Hugo uncovers discrepancies that shift the direction of the investigation. At the mid-point of the story: A revelation about Beatrice's blackmail alters the narrative's trajectory.

A second pivot reshapes the course: The pressure mounts as characters confront their dark pasts. As tension reaches its height: The climax builds with an intense confrontation revealing hidden truths. The climax brings the central question to a head: Truths are unveiled, forcing characters to face the consequences of their actions. In the final resolution: The emotional aftermath leaves characters forever.

## Emotional register at this point in the story
The atmosphere is heavy with tension and foreboding.

## Character Portraits (appearance & era)

### Dr. Mallory Finch
Dr. Mallory Finch represents the complexities of professional women during this era. While she is respected in her field, her hidden past reflects the moral ambiguities faced by many, as the war forces individuals to confront their choices amid the chaos.
Era intersection: Dr. Finch's concealed affair mirrors the growing scrutiny women face regarding their relationships and moral standings during the war.

### Captain Ivor Hale
Captain Ivor Hale stands as a symbol of the old guard, grappling with the ghosts of his past amidst the changing tides of society. His position of authority is challenged as personal secrets threaten to unravel his reputation during a time of national instability.
Era intersection: Hale's struggle with maintaining honor reflects the broader challenges of masculinity in a society facing upheaval.

### Beatrice Quill
Beatrice Quill embodies the ambitious young woman of the 1940s, seeking to carve her path in a world full of obstacles. Her desire for success is shadowed by ethical dilemmas, showcasing the moral complexities of ambition during wartime.
Era intersection: Beatrice's blackmail scheme highlights the precarious balance between personal ambition and ethical integrity faced by many women of her generation.

### Sylvia Trent
Sylvia Trent represents the creative spirit struggling against societal confines, her artistic ambitions stifled by rivalry and jealousy. The war's impact on artistic expression resonates through her character, as she battles to define her identity.
Era intersection: Sylvia's artistic struggles reflect the broader cultural tensions of the time, where creative expression is both a refuge and a battleground.

### Hugo Vane
Hugo Vane embodies the charm and deceit often found in wartime social dynamics. As a hotel manager caught in a web of embezzlement, he represents the lengths to which individuals will go to maintain appearances amidst chaos.
Era intersection: Hugo's embezzlement mirrors the economic pressures faced by many, who resort to unethical choices to survive in a challenging environment.

## Character Voices

### Dr. Mallory Finch (she/her/her)
Dr. Finch speaks with a measured precision, occasionally revealing her tension through sardonic remarks.
[comfortable] It's fascinating how the human body reacts under pressure, isn't it?
[evasive] I would prefer not to discuss that; it's rather complicated, you see.
[stressed] You don't understand. If this information gets out, it could destroy everything I've worked for!
Humour: Her dry wit serves as a coping mechanism against her underlying anxieties.

### Captain Ivor Hale (he/him/his)
Hale speaks in a commanding, yet sometimes gruff tone, often punctuated by dry humor.
[comfortable] Ah, the past has a way of haunting us, doesn't it? I suppose we all have our burdens.
[evasive] I was simply enjoying a quiet moment, nothing more to it.
[stressed] You have no idea what you're asking of me. My family's honor is at stake!
Humour: Hale's self-deprecating humor often lightens the weight of his serious demeanor.

### Beatrice Quill (she/her/her)
Beatrice speaks with a rapid-fire intensity, her language full of colloquialisms.
[comfortable] What’s the worst that could happen? I mean, really!
[evasive] Oh, those notes? I must have misplaced them. Happens all the time!
[stressed] This is a nightmare! I can't afford to be implicated in this mess!
Humour: Her sardonic humor reflects her youthful bravado and ambition.

### Sylvia Trent (she/her/her)
Sylvia speaks in a lyrical manner, often using metaphors related to art.
[comfortable] Art is all about perspective, don’t you think? It’s a reflection of our souls.
[evasive] I prefer not to dwell on the past; it’s rather distracting.
[stressed] This could ruin me! My art, my reputation—gone in an instant!
Humour: Sylvia's observational humor often provides insight into her struggles with jealousy.

### Hugo Vane (he/him/his)
Hugo speaks in a smooth, even tone, often using dry humor to deflect attention.
[comfortable] It's all part of the service, I assure you. We aim to please.
[evasive] I believe there may have been a misunderstanding; let’s not dwell on it too much.
[stressed] If this comes to light, it will shatter everything I’ve built!
Humour: Hugo's deadpan delivery adds a layer of complexity to his character.

## Location Registers (scene framing guides)

The Rooftop Observation Deck: The Rooftop Observation Deck, once a place of serene beauty, now holds an air of dread and foreboding, as the salty breeze carries whispers of tragedy.. Camera angle: As a writer enters this space, the atmosphere thickens with tension, inviting them to explore the hidden depths of despair.. Era: The location's isolation reflects the emotional turmoil of the guests, heightened by the overcast weather.

The Grand Lounge: The Grand Lounge serves as a hub of nervous energy, where guests exchange forced pleasantries amid the weight of unspoken fears and hidden agendas.. Camera angle: Entering this space, a writer should capture the conflicting currents of excitement and dread swirling around the guests.. Era: The grandeur of the lounge contrasts sharply with the emotional turmoil of the characters, who seek refuge from the storm outside.

The Formal Dining Room: The Formal Dining Room, with its elegant decor, feels suffocating under the weight of tension, where every clink of silverware echoes the underlying anxieties of its occupants.. Camera angle: A writer should focus on the contrast between the beautiful setting and the anxious atmosphere, capturing the fragility of social interactions.. Era: The opulence of the dining room masks the growing fears and uncertainties that define the social dynamics of the era.

## Humour guidance for this story position (opening)
Permission: forbidden
Rationale: The tone is too serious given the recent tragedy.

FAIR-PLAY AND INFERENCE CONTRACT:
- FAIR PLAY CLUE TIMING: Never combine clue discovery and detective deduction in the same chapter. If a clue is first revealed to the reader in chapter N, the detective may only analyze, deduce from, or act on that clue in chapter N+1 or later.
- FAIR PLAY INFORMATION PARITY: The reader must see all clues BEFORE the detective uses them in reasoning. If the detective performs a test or makes a deduction, every piece of evidence supporting that conclusion must have been shown to the reader in earlier chapters.
- FAIR PLAY REVELATION SPACING: In the discriminating test scene, the detective can ONLY use clues that were revealed to the reader at least 1 full chapter earlier. Never introduce new clues or withheld information during the test.
- FAIR PLAY CONFRONTATION: During the final confrontation/revelation, the detective cannot surprise the reader with facts. Every piece of evidence cited must have been visible to the reader in prior chapters.
- Never solve by withheld information. Keep reader-information parity with detective reasoning.
- False assumption in force: Eleanor drowned during a storm surge, creating the illusion of an accidental death.
- Hidden truth to progressively expose (compose in your own words from these elements): actual, tide, lowest, point, making, drowning, impossible
- Inference path checkpoints to dramatize clearly — compose ENTIRELY in your own sentences from these key terms (reproducing any briefing phrase verbatim FAILS validation):
  - Step 1: obs: witness, statements, confirm, eleanor, last, seen, balcony, quarter, past, twelve | corr: eleanor, drowned, tide, lowest | effect: eliminates, possibility, accidental, drowning
  - Step 2: obs: footprints, leading, away, balcony, suggest, someone, else, present | corr: presence, another, person, indicates, foul, play | effect: narrows, suspect, list, access, balcony
  - Step 3: obs: tide, table, shows, discrepancies, compared, witness, accounts | corr: discrepancies, indicate, tampering, tide, information | effect: eliminates, sylvia, trent, unaware, tampering
- Discriminating test method: trap
- Discriminating test elements to dramatize (compose ENTIRELY in your own sentences from these — do NOT reproduce any briefing phrase verbatim): staged, reenactment, balcony, using, tide, tables, demonstrate, impossible, timing, drowning
- Test must rely on already-shown clue IDs: clue_12, clue_6, clue_core_contradiction_chain, clue_1, clue_2
- Fair-play rationale: Step 1: Witness statements (early) and tide table (mid) reveal Eleanor's location contradicts drowning. Step 2: Footprints (mid) narrow suspects. Step 3: Tide table discrepancies (discriminating test) confirm tampering and reveal Captain Hale's guilt.

## Character Reference

### Dr. Mallory Finch (she/her — NEVER he/him)
Finch speaks with measured precision, her words often laced with clinical terminology
Occasionally, she lets slip a sardonic remark, revealing the tension beneath her composed exterior.
Dr. Finch is tormented by her past choices, the guilt of her affair gnawing at her conscience and fueling her fear of exposure.
Voice colour: Dr. Mallory Finch uses dry wit humour — let it surface in their dialogue where natural, not in every line.

### Captain Ivor Hale (he/him — NEVER she/her)
Hale speaks in a commanding, yet sometimes gruff tone, often punctuating his sentences with a dry chuckle that belies the weight of his words.
Hale is torn between his protective instincts for his family and the fear of the past resurfacing, a moral struggle that leaves him on edge.

### Beatrice Quill (she/her — NEVER he/him)
Beatrice speaks with a rapid-fire intensity, often interrupting herself mid-sentence as her thoughts race ahead
Her language is peppered with colloquialisms and a daring irreverence that reflects her youthful bravado.
Beatrice is torn between her desire for success and the ethical implications of her actions, wrestling with the fear that her ambition might lead to her downfall.
Voice colour: Beatrice Quill uses sardonic humour — let it surface in their dialogue where natural, not in every line.

### Sylvia Trent (she/her — NEVER he/him)
Sylvia speaks in a lyrical manner, her words flowing like brushstrokes on canvas
She often uses metaphors related to art and creativity, weaving her thoughts into a tapestry of vivid imagery.
Sylvia wrestles with her jealousy and resentment towards the victim, torn between her desire for success and the ethical implications of her actions.
Voice colour: Sylvia Trent uses observational humour — let it surface in their dialogue where natural, not in every line.

### Hugo Vane (he/him — NEVER she/her)
Hugo speaks in a smooth, even tone, often punctuating his sentences with a wry smile
He has a penchant for dry humor, using it to deflect attention from his darker secrets.
Hugo is tormented by the fear of losing everything he has built, torn between his desire for wealth and the moral implications of his actions.
Voice colour: Hugo Vane uses deadpan humour — let it surface in their dialogue where natural, not in every line.


## CHARACTER CONTRACTS (binding for this scene)
Each entry below constrains how this character must be written in this chapter.
These override generic style guidance when they conflict.

### Dr. Mallory Finch[SHE]
Voice & mannerisms: Dr. Finch speaks with measured precision, her words often laced with clinical terminology. Occasionally, she lets slip a sardonic remark, revealing the tension beneath her composed exterior.
SIGNATURE TIC (use sparingly — this is Dr. Mallory Finch's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "It’s all rather complicated, isn’t it?"
Sample voice fragments (match this register and rhythm):
  [comfortable] "It's fascinating how the human body reacts under pressure, isn't it?"
  [evasive] "I would prefer not to discuss that; it's rather complicated, you see."
Humour: dry wit — deploy occasionally (level 0.4)
FORBIDDEN phrase (never write for Dr. Mallory Finch): "a surge of determination washed over her"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Her resentment stems from the victim's interference in her father's affairs, coupled with the guilt of her past choices, creating a potent mix of emotions that can drive one to dark decisions." — do not surface in Act I.

### Captain Ivor Hale[HE]
Voice & mannerisms: Hale speaks in a commanding, yet sometimes gruff tone, often punctuating his sentences with a dry chuckle that belies the weight of his words.
SIGNATURE TIC (use sparingly — this is Captain Ivor Hale's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "Ah, the past has a way of haunting us, doesn't it?"
Sample voice fragments (match this register and rhythm):
  [comfortable] "Ah, the past has a way of haunting us, doesn't it? I suppose we all have our burdens."
  [evasive] "I was simply enjoying a quiet moment, nothing more to it."
Humour: self deprecating — deploy rarely (level 0.3)
FORBIDDEN phrase (never write for Captain Ivor Hale): "she knew with certainty she was right"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "The fear that the victim's death might lead to the unearthing of these long-hidden truths looms over him, creating a conflict between his protective instincts and self-preservation." — do not surface in Act I.

### Beatrice Quill[SHE]
Voice & mannerisms: Beatrice speaks with a rapid-fire intensity, often interrupting herself mid-sentence as her thoughts race ahead. Her language is peppered with colloquialisms and a daring irreverence that reflects her youthful bravado.
SIGNATURE TIC (use sparingly — this is Beatrice Quill's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "What’s the worst that could happen?"
Sample voice fragments (match this register and rhythm):
  [comfortable] "What’s the worst that could happen? I mean, really!"
  [evasive] "Oh, those notes? I must have misplaced them. Happens all the time!"
Humour: sardonic — deploy occasionally (level 0.6)
FORBIDDEN phrase (never write for Beatrice Quill): "palpable tension filled the room"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "The potential loss of her leverage over the victim creates a sense of urgency, pushing her towards desperate measures to secure her future." — do not surface in Act I.

### Sylvia Trent[SHE]
Voice & mannerisms: Sylvia speaks in a lyrical manner, her words flowing like brushstrokes on canvas. She often uses metaphors related to art and creativity, weaving her thoughts into a tapestry of vivid imagery.
SIGNATURE TIC (use sparingly — this is Sylvia Trent's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "Art is all about perspective, don’t you think?"
Sample voice fragments (match this register and rhythm):
  [comfortable] "Art is all about perspective, don’t you think? It’s a reflection of our souls."
  [evasive] "I prefer not to dwell on the past; it’s rather distracting."
Humour: observational — deploy occasionally (level 0.5)
FORBIDDEN phrase (never write for Sylvia Trent): "everyone could sense the atmosphere"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "The victim's death could clear the path for Sylvia's recognition, both artistically and financially, fueling her desire for revenge." — do not surface in Act I.

### Hugo Vane[HE]
Voice & mannerisms: Hugo speaks in a smooth, even tone, often punctuating his sentences with a wry smile. He has a penchant for dry humor, using it to deflect attention from his darker secrets.
SIGNATURE TIC (use sparingly — this is Hugo Vane's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "It’s all part of the service, I assure you."
Sample voice fragments (match this register and rhythm):
  [comfortable] "It's all part of the service, I assure you. We aim to please."
  [evasive] "I believe there may have been a misunderstanding; let’s not dwell on it too much."
Humour: deadpan — deploy occasionally (level 0.4)
FORBIDDEN phrase (never write for Hugo Vane): "he was utterly speechless"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "If the victim were to expose him, it would ruin not only his career but also his reputation, leaving him with nothing but shame and regret." — do not surface in Act I.



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

Primary Location: The Grand Tides Hotel (Brighton, England)
A grand seaside hotel radiating art-deco elegance, perched on a cliff overlooking the tumultuous sea, where secrets and tensions fester among its guests.

Key Locations Available:
- The Rooftop Observation Deck (exterior): Crime scene
- The Grand Lounge (interior): Gathering space
- The Formal Dining Room (interior): Dining and social gathering

Atmosphere (tonal cue only — do NOT reproduce this phrase verbatim in prose; translate into scene-specific, character-observed sensory language): tense and anxious due to recent events in the world and personal conflicts among guests
Weather: overcast with occasional rain, typical for coastal climates

Era markers: Radio broadcasts of wartime news | Early television sets in common areas | Rationed fuel affecting travel plans

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
The Rooftop Observation Deck (exterior):
  - Visual: stormy waves crashing below, dark clouds swirling overhead, flapping of a torn flag
  - Sounds: howling wind through the railings, waves crashing against the cliff, distant thunder rumbling
  - Scents: fresh sea spray, wet stone and rust, damp earth from the garden below
  - Touch: chill of the ocean breeze, roughness of the iron railing

The Grand Lounge (interior):
  - Visual: soft candlelight flickering, ornate chandeliers casting shadows, piano keys glinting in the light
  - Sounds: melancholic piano melodies, soft murmurs of conversation, clinking of glasses
  - Scents: rich coffee and pastries, warmth of burning wood, faint perfume lingering in the air
  - Touch: soft velvet upholstery, cool marble tabletops

The Formal Dining Room (interior):
  - Visual: gleaming silverware arranged neatly, long tables adorned with white linens, chandeliers sparkling above
  - Sounds: clinking of glasses and silverware, soft murmur of conversations, waiters gliding across the floor
  - Scents: aroma of roasted meats, scent of fresh bread, hint of herbs and spices
  - Touch: smoothness of polished tables, softness of linen napkins

⛔ REFERENCE DATA — DO NOT TRANSCRIBE VERBATIM: The above profiles are structural guides only. Generate original prose that evokes these qualities; do not reproduce the exact phrasing or sentence structure of the profile paragraphs.

SCENE OPENING RULE: When opening a scene in a new location, write what the POV character directly observes and physically senses at that moment — not a general description of the room's qualities. The reader must feel pre
[truncated for prompt budget]

## Texture Pool
Draw on these as opportunities arise — you are not required to use them.

- In August 1941, the political climate is tumultuous, with the world embroiled in conflict
- The echoes of war resonate deeply in the lives of everyday people, who are adapting to rationing and the shifting social landscape
- The seaside hotel reflects a microcosm of society, where the wealthy attempt to retain their status amid growing uncertainties, and the shadow of the war looms large, affecting the emotional and economic fabric of life.

TEMPORAL CONTEXT:

This story takes place in August 1941 during summer.

Seasonal Atmosphere:
- Weather patterns: overcast with occasional rain, cool breezes off the ocean, high humidity typical of coastal climates
- Daylight: Long summer days with daylight lasting until nearly eight-thirty in the evening, but with increasingly shorter twilight as autumn approaches.
- Seasonal activities: Beach outings, despite the weather, Evening strolls along the boardwalk, Social dances at the hotel ballroom
- Seasonal occasions: National Aviation Day (August 19)
- Season: summer

Period Fashion (describe naturally):
- Men formal: tropical wool suits, white linen dinner jackets, polished leather shoes
- Men casual: lightweight cotton shirts, seersucker trousers, canvas loafers
- Men accessories: straw hats, thin leather belts, pocket squares
- Women formal: sleeveless tea dresses, day dresses with floral prints, elegant cloche hats
- Women casual: light cotton blouses, A-line skirts, comfortable sandals
- Women accessories: string of pearls, wide-brimmed sun hats, colorful silk scarves

Cultural Context (reference naturally):
- Music/entertainment: Glenn Miller's 'In the Mood', Bing Crosby's 'I'll Be Seeing You', Doris Day's 'Sentimental Journey'; Films: 'The Maltese Falcon', 'Sergeant York'; Theatre: Broadway shows continue to flourish despite the war, Musicals featuring patriotic themes gain popularity; Radio: 'The Shadow', 'Fibber McGee and Molly'
- Typical prices: Loaf of bread: four pence, Movie ticket: one shilling, Taxi fare across town: two shillings
- Current events: The United States remains neutral but is deeply engaged in aiding Allies through Lend-Lease; Tensions are high across Europe as Nazi Germany continues its aggression
- Literature: 'The Postman Always Rings Twice' by James M. Cain | 'The Naked and the Dead' by Norman Mailer | 'For Whom the Bell Tolls' by Ernest Hemingway | [detective fiction] | [war novels] | [romantic literature reflecting wartime sentiments]
- Technology: the use of radar technology for military purposes | advancements in radio communication | the early development of jet propulsion | table radios for household entertainment | early television sets in affluent homes | military walkie-talkies for communication
- Daily life: Families gather for picnics at the beach, Weekend dances in hotel ballrooms, Attending church services on Sundays
- Social rituals: Evening cocktail hours at the hotel, Weekly movie nights at the local theater

Atmospheric Details:
The salty tang of the ocean mingles with the damp air, as the sound of waves crashing against the shore fills the evening. The flickering glow of the hotel's neon sign casts a colorful reflection on the wet pavement, while the scent of wet sand lingers in the air. The distant sound of a jazz band playing a melancholic tune permeates the atmosphere, contrasted by hushed conversations and the clinking of glasses in the hotel's lounge.

FASHION INTEGRATION TECHNIQUES:
- First appearance: Describe outfit to establish class/personality
- Accessories: Gloves, hats, pocket watches, jewelry reveal status
- Time-specific: Different outfits for different times of day
- Character traits: Fastidious dresser vs rumpled appearance
- Action integration: "She tugged at her glove" or "He adjusted his tie"
- Weather appropriate: Overcoats in winter, light li
[truncated for prompt budget]

NON-NEGOTIABLE CHAPTER OBLIGATIONS — LOCKED EVIDENCE VALUES (VERBATIM REQUIRED):
The following measured values (times, amounts, measurements) are absolute ground truth. Every time this chapter describes, mentions, or alludes to one — no matter how briefly — it MUST use the exact phrase shown below, character for character. NO paraphrase, approximation, rounding, or synonym is permitted.

FAILURE EXAMPLE: if the locked value is "at thirteen minutes to midnight" and you write "just before midnight" or "around midnight" — that is a HARD FAIL. You must write "at thirteen minutes to midnight". Equally, if the locked value is written in words, such as "ten minutes past eleven", and you convert it to figure-based clock notation — that is also a HARD FAIL. Words stay as words; figure forms are forbidden for word-phrased facts.

CRITICAL — WORD-PHRASED VALUES: If the canonical value is written out in words (e.g. a time like "ten minutes past eleven", or an amount like "forty minutes"), reproduce those exact words. DO NOT convert to figure-based time notation, twenty-four-hour format, or any other numeric shorthand. Correct: "ten minutes past eleven". WRONG: figure-based clock notation or numeric shorthand.

Locked values:
  - The high tide occurred at this specific time, creating a contradiction with the drowning.: "ten minutes past twelve"
    ⛔ FORBIDDEN alternatives: "12:10", "12.10", "twelve ten", "twelve-ten", "twelve past ten", "quarter past twelve", "half past twelve" — the ONLY acceptable form is "ten minutes past twelve"
  - The low tide occurred at this time, making drowning impossible.: "twenty minutes past eleven"
    ⛔ FORBIDDEN alternatives: "11:20", "11.20", "eleven twenty", "eleven-twenty", "eleven past twenty", "quarter past eleven", "half past eleven" — the ONLY acceptable form is "twenty minutes past eleven"
  - The victim was last seen alive at this specific time.: "a quarter past twelve"

If a value has no relevance to this chapter, omit it. But the moment you reference the underlying evidence, only the exact phrase above is acceptable.

⛔ CLUES TO SURFACE IN THESE CHAPTERS — mandatory:
The following evidence MUST be clearly observable to an attentive reader. Do not bury it in atmosphere or passing dialogue. Each clue must be concrete, specific, and noticeable:

• [clue_core_contradiction_chain] eleanor, drowned, tide, lowest
  Category: testimonial | Criticality: essential | Supports inference step 1
  Points to: impossibility, drowning, tide, conditions

For each clue above: an attentive reader should be able to find, record, and later use it to reason toward the solution.

═══ NARRATIVE STATE (read-only — do not contradict) ═══

LOCKED FACTS — use verbatim whenever this evidence is described:
  • The high tide occurred at this specific time, creating a contradiction with the drowning.: "ten minutes past twelve"
  • The low tide occurred at this time, making drowning impossible.: "twenty minutes past eleven"
  • The victim was last seen alive at this specific time.: "a quarter past twelve"

CHARACTER PRONOUNS — never deviate from these:
  • Eleanor Voss: she/her/her
  • Dr. Mallory Finch: she/her/her
  • Captain Ivor Hale: he/him/his
  • Beatrice Quill: she/her/her
  • Sylvia Trent: she/her/her
  • Hugo Vane: he/him/his

CLUES ALREADY REVEALED TO READER: clue_mechanism_visibility_core — do not reveal these as new information.

INVESTIGATION LOG — WHAT IS ESTABLISHED (do not re-establish, do not repeat):
• Evidence already established (reference only — do NOT restate or quote these; advance beyond them): eleanor, last, known, location, time
• Suspect cleared: Dr. Mallory Finch[SHE] — Proven alibi during the time of death
• Suspect cleared: Sylvia Trent[SHE] — Lack of motive and knowledge of tide tampering
• Suspect cleared: Beatrice Quill[SHE] — No access to the balcony at the time
⚠ The story must move FORWARD from this log. Any beat already listed above is forbidden from repeating.

⚠ THIS CHAPTER'S REQUIRED ADVANCE (opening): Discover the body, confirm the victim, establish the scene. The victim is found dead. They do not speak, react, or gesture. This is their only physical appearance — in all subsequent chapters they exist only in past tense (memory, evidence, testimony).

CONTINUITY HANDOFF — previous chapter closing beat:
  • "One by one, the guests drifted back inside, leaving Hugo alone with the body and the restless wind. He knelt once more, studying the pattern of pearls, the bruises, the single lost shoe. Somewhere in the details—a timepiece, a footprint, a word spoken or withh..."
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
lounge, lobby

✓ RULE: Continue using this location vocabulary. Maintain consistency with established setting type.
✓ Do NOT introduce new location types that contradict earlier chapters.

**Recent Chapter Summary (for narrative continuity):**
Chapter 1: Chapter 1: The Balcony at Dawn
  Events: For a moment, Hugo could not move.

⚠️ **VALIDATION:** Character name mismatches and setting drift are common failure modes.
Double-check every character name against the list above before using it.

**⏱ LOCKED TIME ANCHOR — use verbatim, do not paraphrase:**
Clock time (from the case ground truth): **"High tide at 12:10 PM"**
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
Known location profile anchors: The Grand Tides Hotel, The Rooftop Observation Deck, The Grand Lounge, The Formal Dining Room, the seaside hotel lounge
LOCATION NAME CAPITALISATION (HARD REQUIREMENT — validated):
All named locations in your prose MUST use the EXACT capitalisation from the CML profiles.
Canonical forms: "The Grand Tides Hotel", "The Rooftop Observation Deck", "The Grand Lounge", "The Formal Dining Room", "the seaside hotel lounge"
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

PROMPT BUDGET SUMMARY: budget=24000 tokens; fixed=9134; context=12203; dropped=[none]; truncated=[location_profiles, temporal_context, pronoun_accuracy]

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
4. Integrate at least two concrete era-grounded details per chapter from setting refinement signals: radio broadcasts | early television sets | military radar | long-distance telephone calls | military code encryption | telegram services.
5. Respect setting movement/access constraints in scene action and alibis: narrow hallways restrict movement | balconies provide limited access to outside without detection | ocean views can obscure visibility of distant events | staff-only areas such as service elevators and kitchens | guest room privacy policies.
6. Sustain social coherence with this backdrop pressure: A gathering of guests at a seaside hotel for a high-stakes charity gala is overshadowed by recent global tensions and personal rivalries, creating an atmosphere ripe for tragedy.
7. Maintain continuity around these socially central cast anchors where relevant: Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill, Sylvia Trent, Hugo Vane.
8. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Critical: Plot similarity 0.85 with 'The Second Key' (same era and method of drowning).
9. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Critical: Solution similarity 0.90 with 'The Second Key' (similar false assumption and discriminating test type).
10. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Moderate: Character similarity 0.75 with 'The Second Key' (mirrored roles and character dynamics).
11. STORY TO DATE ANTI-COPY RULE: The STORY TO DATE section below is provided for chronological and factual reference ONLY. You MUST NOT copy, lightly rephrase, or structurally echo any sentence or paragraph from prior chapters. Every sentence in this chapter must be original prose unique to this scene. Reusing even a clause from prior chapter text will cause this attempt to fail immediately.

CRITICAL PROSE REQUIREMENTS:

The CML specifies exact requirements for certain validation-critical scenes. You MUST include these elements at the specified positions.

**Discriminating Test Scene (Act 3, Scene 4):**
Required elements: Execute the discriminating test, Observe the culprit's reaction or result, Draw conclusion about guilt
Test type: Reenactment

**Suspect Clearance Scenes:**
- Dr. Mallory Finch (Act 3, Scene 5): Proven alibi during the time of death
  Clues: Witness statements about her location
- Sylvia Trent (Act 3, Scene 5): Lack of motive and knowledge of tide tampering
  Clues: Discrepancies in tide table
- Beatrice Quill (Act 3, Scene 5): No access to the balcony at the time
  Clues: Witness statements about her location

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
Investigation state at start: 1 clue(s) revealed to reader; approximately 0 unresolved suspect(s).
Must change by end: Reframe prior clue meaning and update suspect implications.
Suspect pressure target(s): Captain Ivor Hale, Dr. Mallory Finch, Sylvia Trent, Beatrice Quill
Required new information: Earlier clue gets revised meaning with explicit theory update.
Forbidden reveals at this stage: Do not introduce decisive new evidence from nowhere.

MECHANISM REVEAL GATE (withhold): The discriminating test has NOT happened yet. Show observable clues, contradictions, and suspicions, but do NOT yet explain HOW the concealment mechanism actually works, and do not state outright that it was deliberately rigged — keep the method an open question. Reserve the full explanation for the discriminating-test chapter.

## Asset Self-Report (required)
At the very END of your response, after all prose, add a single line:
<used_assets>era:story:0,era:story:1,era:story:2</used_assets>
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
  - PARAGRAPH OPENER DIVERSITY (MANDATORY — validator enforced): No more than 2 paragraphs in this chapter may begin with "Hugo" or "Hugo's" as the first word. You must vary paragraph openings throughout: use sensory observations, another character's name or action, dialogue, object or sound details, or temporal markers. Opening 3 or more paragraphs with "Hugo" will cause automated rejection.
  - Continuity bridge: in the first 120 words, visibly connect from the previous chapter's final beat. Carry forward one unresolved element (object, accusation, emotional pressure, or immediate physical action) from: "One by one, the guests drifted back inside, leaving Hugo alone with the body and the restless wind. He knelt once more, studying the pattern of pearls, the bruises, the single lost shoe. Somewhere in the details—a timepi...".
  - CLUE OBLIGATIONS — each clue below MUST be dramatized, but in YOUR OWN WORDS:
    Render each as something a character SEES, DOES, or SAYS on the page. The bracketed text is a
    DESCRIPTION of the evidence for you — do NOT transcribe it as narration. Copying a clue's
    description sentence verbatim into the prose FAILS validation.
    • tide, information, indicates [clue_core_contradiction_chain] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: impossibility, drowning, tide, conditions
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
  - ALIBI LOCK: Captain Ivor Hale's established alibi is "12:00 PM to 12:20 PM". Do NOT place Captain Ivor Hale at any other location or in any other activity during the crime window. Any contradiction is a continuity error that triggers a retry.
  - TESTIMONY CONTINUITY: Captain Ivor Hale has already made statements in earlier chapters. Any time, location, or claim attributed to Captain Ivor Hale in THIS chapter must be consistent with those earlier statements. Do NOT introduce a new or different alibi claim — any contradiction is a continuity error.
  - Sensory obligation — use at least two of: grey light filtering through clouds, shadows lengthening across the floor | soft piano notes drifting, rustle of newspapers being read | warmth of baked goods. Mood: introspective and subdued.
- Locked fact phrase obligations:
  - If this batch mentions The high tide occurred at this specific time, creating a contradiction with the drowning., write exactly: "ten minutes past twelve".
  - If this batch mentions The low tide occurred at this time, making drowning impossible., write exactly: "twenty minutes past eleven".
  - If this batch mentions The victim was last seen alive at this specific time., write exactly: "a quarter past twelve".
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
Investigation state at start: 1 clue(s) revealed to reader; approximately 0 unresolved suspect(s).
Must change by end: Reframe prior clue meaning and update suspect implications.
Suspect pressure target(s): Captain Ivor Hale, Dr. Mallory Finch, Sylvia Trent, Beatrice Quill
Required new information: Earlier clue gets revised meaning with explicit theory update.
Forbidden reveals at this stage: Do not introduce decisive new evidence from nowhere.

FROZEN FACT STATE (DO NOT ALTER):
- Timeline anchor: August (summer).
- Month, season, weather, and time-of-year language in this batch must stay compatible with summer.
- Established timeline fact: High tide at 12:10 PM
- Established timeline fact: Eleanor last seen at 12:15 PM
- If referenced, use exact phrase: "ten minutes past twelve" (The high tide occurred at this specific time, creating a contradiction with the drowning.).
- If referenced, use exact phrase: "twenty minutes past eleven" (The low tide occurred at this time, making drowning impossible.).
- If referenced, use exact phrase: "a quarter past twelve" (The victim was last seen alive at this specific time.).

STORY TO DATE (REFERENCE ONLY — DO NOT COPY VERBATIM):
- Full prior chapter text is provided below for continuity, factual consistency, and reference accuracy.
- Use this to keep character voice, chronology, clue state, and location continuity aligned with earlier chapters.
- Do not quote, copy, or paraphrase these paragraphs too closely; write fresh prose that remains consistent with them.

--- BEGIN PRIOR CHAPTER 1 ---
Title: Chapter 1: The Balcony at Dawn
Hugo Vane stepped onto the balcony of the seaside hotel, the chill of the morning wind biting through his linen jacket and carrying the tang of brine and wet stone. The sky was a pale, overcast sheet, the sun struggling behind a veil of cloud, lending the scene a dim, uncertain glow. The hush was broken only by the distant, rhythmic crash of waves against the cliff below and the faint rattle of a loose flagpole above. Beneath Hugo’s polished shoes, the boards felt slick with last night’s drizzle. He paused, his gaze drawn to the still figure slumped against the iron railing—a woman in a cream silk dress, her dark hair tangled and damp, her skin ashen in the weak daylight. It was Eleanor Voss.

For a moment, Hugo could not move. The reality of Eleanor’s body—her arm draped awkwardly over the balustrade, pearls scattered across the boards, the faint scent of her perfume mingling with the cold salt air—struck with a force that left him hollow. The world seemed to contract to the small, tragic tableau before him. Behind him, footsteps sounded on the tiles, hesitant and muffled by the morning’s damp. Dr. Mallory Finch appeared in the doorway, her gloved hand pressed to her mouth, eyes wide with disbelief. Hugo turned, his own voice emerging steady, if distant. “Fetch Captain Hale and the others. Eleanor Voss is dead.”

Within minutes, the balcony was crowded with the hotel’s uneasy guests. Captain Ivor Hale stood apart, his posture rigid, eyes fixed on the horizon where the sea met the sky, as if searching for something lost. His hand hovered at his waist, fingers clenching and unclenching around the chain of his pocket watch. Dr. Mallory Finch lingered near the threshold, her usual composure frayed, the line of her jaw set with a tension that belied her clinical calm. Beatrice Quill, her floral print dress clashing with the somber air, darted glances from the body to the others, her lips parted as though about to speak but thinking better of it. Sylvia Trent, in a paint-stained blouse and skirt, pressed herself against the far railing, her eyes following the shifting light on the water rather than the scene at her feet.

Hugo knelt beside Eleanor, careful not to disturb the pearls or the folds of her dress. He noted the faint bruising at her temple and the way her shoes—one still on, the other missing—suggested a struggle or hurried movement. The ironwork was cold beneath his hand. He glanced up as Captain Hale finally spoke, his voice rough: “She was here last night, after supper. I saw her step out for air. Nothing seemed amiss.”

Dr. Mallory Finch, her voice clipped and precise, added, “I passed her on the landing at a quarter past twelve. She was alone then.” She hesitated, her gaze flicking to Hugo, then back to the body. “I remember the time because the grandfather clock in the lounge chimed as I reached the top of the stairs.”

Hugo’s mind caught on the detail. The high tide had come at ten minutes past twelve, if the tide tables in the lobby were to be believed. Yet Eleanor had been seen alive at a quarter past twelve, and now she lay dead, her body damp and cold, as though the sea itself had claimed her. The contradiction pressed at him, sharp and insistent—a puzzle at the very heart of the tragedy.

Beatrice Quill broke the silence with a nervous laugh, quickly stifled. “She always did like to make an entrance,” she muttered, then seemed to regret it, her eyes darting to the others for some sign of forgiveness. No one replied. The only sound was the wind, threading through the ironwork, and the distant call of gulls.

Sylvia Trent shifted, her voice soft and uncertain. “I saw her as well, just after midnight. She was—she seemed distracted. I thought she was waiting for someone.” Sylvia’s hands gripped the railing, knuckles whitening. “But I didn’t see anyone else come out here.”

Captain Hale’s jaw tightened. “You’re suggesting she met someone on the balcony? That’s a serious implication, Miss Trent.” He did not look at Sylvia, but his words hung in the air, heavy with unspoken accusation.

Hugo rose, brushing the damp from his knees. “We’ll need to establish exactly who saw Eleanor last, and when. If Dr. Finch is correct, and Eleanor was alive at a quarter past twelve, that leaves a narrow window. The tide, the time, her presence here—it doesn’t add up.” He looked from face to face, searching for any flicker of guilt or fear. “Until we have answers, no one is to leave the hotel.”

A muted murmur ran through the group, equal parts outrage and relief. Beatrice’s hands fluttered at her sides, as though she might take flight. Dr. Finch’s eyes narrowed, her composure returning in the face of necessity. Sylvia Trent’s gaze remained fixed on the sea, her expression unreadable. Captain Hale’s shoulders squared, the old habit of command settling over him like a familiar coat.

Hugo turned back to Eleanor’s body, his thoughts racing. The contradiction between the tide’s timing and the witness statements gnawed at him. If the high tide had already come and gone by the time Eleanor was last seen alive, how had she drowned? The answer lay somewhere among the people gathered on the balcony, in the secrets they kept and the truths they dared not speak.

He straightened, the morning air prickling against his skin. The war had taught everyone to ration not only food and fuel, but also trust. In the tense hush, Hugo felt the weight of expectation settle on his shoulders. He was the investigator now—by necessity, if not by choice—and the fate of Eleanor Voss demanded nothing less than the truth.

A distant radio, barely audible through the open doors, crackled with the day’s news: another convoy lost in the Channel, rationing to be tightened yet again. The world outside pressed in, but on the balcony of the seaside hotel, time seemed suspended, caught between the last notes of a chiming clock and the silent accusation of Eleanor’s lifeless form.

One by one, the guests drifted back inside, leaving Hugo alone with the body and the restless wind. He knelt once more, studying the pattern of pearls, the bruises, the single lost shoe. Somewhere in the details—a timepiece, a footprint, a word spoken or withheld—lay the answer to the impossible contradiction. The investigation had begun, and nothing would be the same again.
--- END PRIOR CHAPTER 1 ---

[SCENE COMPLETENESS CONTRACTS — MANDATORY. Each contract below lists what you MUST enact in that chapter. Do not summarise or mention these labels in the prose — enact them organically.]
Chapter 2 (Act 1) completeness contract:
  PIVOT ELEMENT (MANDATORY — write this into the prose, shown not told): "Witness statements revealing conflicting timelines."
  FACT ESTABLISHED (MANDATORY — reader must know this by chapter end): "Establishes contradictions in the timeline of Eleanor's last moments, suggesting foul play."

# Case Overview
Title: The Tidal Deception
Era: 1940s
Setting: Seaside Hotel
Crime: murder (drowning)
Culprit: Captain Ivor Hale
Victim: Eleanor Voss
False assumption: Eleanor drowned during a storm surge, creating the illusion of an accidental death.
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
    "title": "Contradiction",
    "setting": {
      "location": "the seaside hotel lounge",
      "timeOfDay": "Later that morning",
      "atmosphere": "Anxious whispers fill the air as guests gather."
    },
    "characters": [
      "Hugo Vane",
      "Captain Ivor Hale",
      "Dr. Mallory Finch",
      "Sylvia Trent",
      "Beatrice Quill"
    ],
    "purpose": "Establish initial contradictions in witness statements.",
    "cluesRevealed": [
      "clue_core_contradiction_chain"
    ],
    "dramaticElements": {
      "conflict": "Tension builds as alibis clash.",
      "tension": "Guests begin to suspect each other.",
      "microMomentBeats": [
        "Dr. Finch's hands tremble slightly as she recounts her last interaction with Eleanor."
      ]
    },
    "summary": "In the hotel lounge, guests gathered to discuss the shocking death of Eleanor Voss. Hugo Vane, feeling the weight of the situation, began to note contradictions in the witness statements about Eleanor's last moments. The tension in the room escalated as suspicions began to surface.",
    "beat": "crime",
    "estimatedWordCount": 1250,
    "pivotElement": "Witness statements revealing conflicting timelines.",
    "factEstablished": "Establishes contradictions in the timeline of Eleanor's last moments, suggesting foul play.",
    "permittedBehavioursByAct": [
      {
        "characterName": "Hugo Vane",
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
        "characterName": "Sylvia Trent",
        "behaviour": "Show normal social behaviour; grief or confusion if appropriate."
      },
      {
        "characterName": "Beatrice Quill",
        "behaviour": "Show normal social behaviour; grief or confusion if appropriate."
      }
    ],
    "redHerringPlacement": null,
    "emotionalRegister": "The investigation begins with confusion and emotional costs for the characters.",
    "dominantCharacterNote": {
      "name": "Dr. Mallory Finch",
      "voiceRegister": "Dr. Finch speaks with a measured precision, occasionally revealing her tension through sardonic remarks."
    },
    "humourGuidance": {
      "permission": "permitted",
      "character": "Hugo Vane",
      "form": "dry_wit"
    },
    "eraTextureNote": "Rationing affects the availability of goods, including clothing and food.; Travel is limited due to fuel shortages and wartime restrictions.; Communications are strained, with reliance on radio updates for news.",
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
□ Chapter 2: the clue [clue_core_contradiction_chain] (eleanor, drowned, tide, lowest) is placed in the first 25% of the chapter, dramatized in your own words, followed by an explicit inference or suspicion paragraph.
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
