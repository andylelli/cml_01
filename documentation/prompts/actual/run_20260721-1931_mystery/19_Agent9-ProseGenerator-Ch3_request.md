# Actual Prompt Record

- Run ID: `mystery-1784662295274`
- Project ID: ``
- Timestamp: `2026-07-21T19:37:40.775Z`
- Agent: `Agent9-ProseGenerator-Ch3`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4.1`
- Temperature: `0.42`
- Max Tokens: `4500`
- Attempt: `first`
- Prompt Hash: `47174d09f6b4375f`

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
- MORAL COMPLEXITY REQUIREMENT: The mechanism of this crime carries a moral gray area: "The murderer was driven by jealousy and desperation, seeking revenge for a perceived betrayal, making their actions both tragic and relatable." — the culprit reveal and denouement MUST acknowledge this ambiguity. Do not let the ending feel clean or simple. Give the reader at least one moment of uncomfortable sympathy or moral doubt.

- CHAPTER OPENING (every chapter, lint-enforced): never open on a tour or inventory of named rooms/places. The first sentence must land a character ACTION, a specific sensory detail, or a concrete in-scene moment — not "In the [room], the [room], and the [room]…". Locations enter through what a character does in them, one at a time.
- VICTIM IDENTITY (HARD CONSTRAINT — lint-enforced): Eleanor Voss is the murder victim, already dead before this chapter. They do NOT speak, enter, react, gesture, or appear in any present-tense scene. When Eleanor Voss is referenced at all, it may ONLY be as: (a) physical evidence/the body, or (b) REPORTED memory/testimony — and reported references MUST be framed as recollection, never as a live beat. WRONG: `Eleanor Voss said, "…"` / `Eleanor Voss turned to him`. RIGHT: `Eleanor Voss had said, weeks before, that…` / `Agnes remembered how Eleanor Voss used to…`. Attach an explicit recollection frame ("had", "remembered", "recalled", "before she died", "in life") to any sentence that names Eleanor Voss beside an action or speech verb. A live dialogue tag or present action for Eleanor Voss is a continuity failure that will be rejected and regenerated.

⚠️ AMATEUR DETECTIVE STORY: The investigator is a civilian with no official standing. The official police (if they appear) are unnamed background figures only — "a constable", "the sergeant", "an officer from the village". Do NOT give any police official a name or title+surname combination. There is no Inspector [Surname], no Constable [Surname], no Sergeant [Surname] in this story.


CRITICAL CHARACTER CONSISTENCY RULES:

1. Each character has ONE canonical name. Use ONLY names from this list. Never vary, abbreviate, or add titles beyond what is listed.
   COMPLETE CAST (no other named characters exist): Eleanor Voss (DECEASED), Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill, Sylvia Trent, Hugo Vane
   - "Mr. Jennings entered the room" → ILLEGAL. Jennings is not in the cast.
   - "Constable Reed took notes" → ILLEGAL. Reed is not in the cast.
   - "A constable took notes" → LEGAL (no name given).

2. Character roles are fixed:
   - Eleanor Voss: victim (DECEASED — does not appear in any scene, past tense only)
   - Dr. Mallory Finch: Professional Outsider
   - Captain Ivor Hale: Authority Figure
   - Beatrice Quill: Ambitious Outsider
   - Sylvia Trent: Manipulative Insider
   - Hugo Vane: Pragmatic Insider
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

## Era: January 1943
Life in January 1943 is marked by the chill of winter and the fog that envelops the coastal towns of England. The war casts a long shadow over everyday existence, where rationing dictates meals and news of the conflict fills the airwaves. Patriotism runs high, yet so does anxiety about the future, as families gather around fires to share stories, their faces illuminated by flickering flames. Socially, women are stepping into new roles as they fill jobs vacated by men at war, creating tension within traditional family structures. The atmosphere is charged with unspoken fears and the weight of collective trauma, underscoring the fragility of peace amidst the ongoing upheaval.
Emotional register: A pervasive sense of anxiety underlies the community's hopeful yet uncertain spirit.
Physical constraints: Limited transportation options due to fuel rationing. | Short daylight hours with limited visibility. | Communication difficulties due to wartime censorship. | Scarcity of goods affecting daily life and social gatherings.
Current tensions (weave into background texture): The Allied forces are planning an invasion of Europe. | Rationing continues to affect food and goods availability. | Air raids increase, causing anxiety among civilians.
Wartime context — Many men are away serving in the military, leaving women to manage homes and businesses.: Women's roles are shifting dramatically as they take on tasks traditionally held by men. Absence effect: The absence of loved ones creates a void filled with anxiety and longing.

## Season Lock (mandatory — derived from January 1943)
Season: winter. Allowed vocabulary: winter, wintry, midwinter
Forbidden seasonal words — never use in narration, dialogue, or metaphor: spring, summer, autumn and their adjectival forms.
Every weather description, atmosphere, and time-of-year reference must be consistent with winter.

## Story Theme
In the midst of wartime uncertainties, personal secrets unravel as the tides of deception drown the truth, and reveals that evidence carries ethical weight, forcing characters to choose accountability over social performance when appearances and facts collide.

## Story Emotional Register
Dominant: A tense and suspenseful narrative that uncovers the dark undercurrents of human relationships amidst wartime uncertainties.

Arc:
The story opens in the Grand Lobby of the Crestview Hotel, a place steeped in elegance yet cloaked in tension, as guests prepare for a charity gala. The atmosphere is thick with anticipation, but it quickly shifts into unease when Eleanor Voss is discovered drowned. The initial shock of her death sends ripples through the gathering, each character wrestling with their own secrets and fears. As the investigation unfolds, the emotional cost becomes evident; whispers of jealousy and rivalry surface, particularly surrounding Eleanor's scandalous affairs. The detective, Hugo Vane, navigates through a web of deceit, confronting false leads that reveal more about the characters than the case itself.

A pivotal moment occurs when evidence about the tide levels contradicts witness statements, leading Hugo to reassess his initial conclusions. This mid-story pivot brings to light the emotional stakes; characters reveal their vulnerabilities, and the truth begins to emerge from the shadows. Another revelation reshapes the narrative when it is discovered that the tide had been manipulated, retroactively coloring prior events and motives. The pressure mounts as the climax approaches, where confrontations between characters reveal their true natures and the consequences of their actions. In the end, the resolution carries a heavy emotional toll; each character must confront their personal demons, forcing them to reckon with the choices that have led them to this moment, ultimately highlighting the fragility of human relationships against the backdrop of war.

## Emotional register at this point in the story
Unease grows as the investigation begins, revealing the personal stakes each character faces.

## Character Portraits (appearance & era)

### Captain Ivor Hale
Captain Ivor Hale, a retired naval officer perceived as a hero, conceals a wartime betrayal that threatens to shatter his reputation. As the nation grapples with loss and honor, Ivor's fear of exposure highlights the fragility of heroism in a world where the lines between right and wrong are increasingly blurred. His internal conflict reflects the broader moral complexities faced by many during this tumultuous period.
Era intersection: His stoic facade is a façade for the guilt he carries, while society grapples with the consequences of war.

### Beatrice Quill
Beatrice Quill's ambition as a journalist is tinged with bitterness from her past with the victim, highlighting the emotional turmoil many face in the wake of societal change. Her desire for recognition clashes with her unresolved feelings, reflecting the broader complexities of personal relationships in a wartime context. As she seeks to make a name for herself, questions of ethics and ambition loom large.
Era intersection: Her struggles mirror the evolving role of women in the workforce, navigating ambition while contending with personal histories.

### Sylvia Trent
Sylvia Trent's life of privilege is threatened by the exposure of her embezzlement, reflecting the fragility of wealth and status in wartime. As a wealthy socialite, she represents the tensions between appearances and reality, as her glamorous lifestyle is at risk. The ongoing war amplifies her fears of losing everything, as societal norms shift, forcing her to confront the consequences of her actions.
Era intersection: Her internal conflict reveals the precariousness of social standing in a time when morality is under scrutiny.

### Hugo Vane
Hugo Vane, the hotel manager, is caught in the web of ethical dilemmas as he strives to maintain the integrity of his establishment amidst the chaos of a murder investigation. His meticulous nature is challenged by the pressures of preserving the hotel's reputation, reflecting the broader struggle of individuals to uphold standards in a time of moral ambiguity. The war's impact on daily life complicates his duties, creating a narrative of resilience and conflict.
Era intersection: His efforts to navigate the demands of wartime hospitality expose the tension between duty and the weight of secrets.

## Character Voices

### Captain Ivor Hale (he/him/his)
Ivor's voice is low and gravelly, with deliberate speech that conveys a sense of authority and weight.
[comfortable] Honor is a heavy burden.
[evasive] I was merely enjoying the evening on the terrace.
[stressed] What if they discover the truth about my past?

### Beatrice Quill (she/her/her)
Beatrice's voice carries a sardonic edge, blending confidence with underlying vulnerability.
[comfortable] In this business, it's all about the story.
[evasive] I thought I was just gathering information, nothing more.
[stressed] The exposure of my tactics could ruin everything I’ve worked for!
Humour: Her sardonic humor reveals her complexities.

### Sylvia Trent (she/her/her)
Sylvia's speech is polished and elegant, with dry humor that showcases her cunning nature.
[comfortable] Charity begins at home, wouldn't you agree?
[evasive] I was simply hosting a gathering, nothing untoward.
[stressed] If my embezzlement is exposed, my life will crumble!
Humour: Her dry wit masks her inner turmoil.

### Hugo Vane (he/him/his)
Hugo speaks in a calm, collected manner, often employing observational humor.
[comfortable] It’s all in the details, wouldn’t you say?
[evasive] I was busy in the kitchen, managing the catering.
[stressed] The hotel's reputation is at stake; I can't let this investigation ruin us!
Humour: His observational humor reflects his keen awareness of the absurdities around him.

## Location Registers (scene framing guides)

Grand Lobby: The Grand Lobby exudes a blend of elegance and tension, where whispered secrets and muffled laughter intertwine. Guests move cautiously, their faces reflecting a mix of anticipation and unease as they navigate the atmosphere thick with unspoken fears.. Camera angle: As a writer enters, the lobby feels like a stage set for drama, each character a player caught in their own narrative.. Era: The opulence of the lobby contrasts sharply with the rationing and wartime anxiety outside.

The Ocean View Dining Room: In the Ocean View Dining Room, the ambiance shifts from elegant to tense, where the clinking of cutlery is punctuated by whispered conversations. The juxtaposition of breathtaking ocean views and the undercurrent of anxiety creates a charged atmosphere, as diners navigate their relationships amidst secrets.. Camera angle: Entering this space, the writer should feel the weight of unspoken words, where every bite is heavy with implications.. Era: The fine dining experience is a stark contrast to the harsh realities of wartime life outside.

The Seaside Terrace: The Seaside Terrace is an eerie space, where the fog envelops the wrought-iron furniture and the sound of crashing waves creates a haunting backdrop. The chill of the air mirrors the cold reality of the murder, as shadows dance in the dim light, heightening the sense of foreboding.. Camera angle: As a writer approaches, the atmosphere feels heavy with secrets, each gust of wind whispering tales of betrayal.. Era: The terrace, once a place of joy, now stands as a stark reminder of the fragility of life amid the ongoing war.

The Library: The Library holds an air of introspective solitude, where dusty tomes and plush armchairs invite quiet contemplation. The distant sound of waves crashing serves as a reminder of the chaos beyond, while the scent of aged paper and leather wraps around visitors like a comforting shroud, contrasting with the tension outside.. Camera angle: Entering this space, the writer should sense the weight of history, where every page turned could unravel truths long hidden.. Era: In a time of uncertainty, the library offers a refuge, yet it is also a space where secrets linger.

## Humour guidance for this story position (early)
Permission: forbidden
Rationale: The investigation's seriousness does not allow for levity.

## Reveal Groundwork (texture — do not explain, only plant)
- Plant one subtle observable beat related to: "The moment when Eleanor is found drowned shifts the investigation's focus and heightens the stakes for all characters involved". Do not explain significance yet.
- Plant one subtle observable beat related to: "Plant one subtle anomaly that can be re-read after the resolution.". Do not explain significance yet.
- Plant one subtle observable beat related to: "Finally, the confrontation between Captain Hale and Eleanor before her death underscores the tragic consequences of jealousy and unrequited love, deepening the emotional complexity of the narrative". Do not explain significance yet.

FAIR-PLAY AND INFERENCE CONTRACT:
- FAIR PLAY CLUE TIMING: Never combine clue discovery and detective deduction in the same chapter. If a clue is first revealed to the reader in chapter N, the detective may only analyze, deduce from, or act on that clue in chapter N+1 or later.
- FAIR PLAY INFORMATION PARITY: The reader must see all clues BEFORE the detective uses them in reasoning. If the detective performs a test or makes a deduction, every piece of evidence supporting that conclusion must have been shown to the reader in earlier chapters.
- FAIR PLAY REVELATION SPACING: In the discriminating test scene, the detective can ONLY use clues that were revealed to the reader at least 1 full chapter earlier. Never introduce new clues or withheld information during the test.
- FAIR PLAY CONFRONTATION: During the final confrontation/revelation, the detective cannot surprise the reader with facts. Every piece of evidence cited must have been visible to the reader in prior chapters.
- Never solve by withheld information. Keep reader-information parity with detective reasoning.
- False assumption in force: Eleanor Voss drowned during the party as the tide was high.
- Hidden truth to progressively expose (compose in your own words from these elements): tide, actually, time, revealing, true, timeline
- Inference path checkpoints to dramatize clearly — compose ENTIRELY in your own sentences from these key terms (reproducing any briefing phrase verbatim FAILS validation):
  - Step 1: obs: witnesses, recall, eleanor, arguing, captain, hale, near, water, edge | corr: suggests, confrontation, occurred, shortly, before, death | effect: narrows, time, window, eleanor, drowning
  - Step 2: obs: tide, gauge, shows, water, levels, party | corr: contradicts, claim, eleanor, drowned, high, tide | effect: eliminates, possibility, drowning, claimed, time
  - Step 3: obs: tide, schedule, indicates, time, party | corr: eleanor, drowned, claimed, time, tide | effect: timeline, manipulation, murderer
- Discriminating test method: constraint_proof
- Discriminating test elements to dramatize (compose ENTIRELY in your own sentences from these — do NOT reproduce any briefing phrase verbatim): tide, schedule, witness, accounts, reveals, impossibility, drowning, party
- Test must rely on already-shown clue IDs: clue_4, clue_11, clue_12, clue_id_1
- Fair-play rationale: Step 1: Witness statements about the argument (early) and tide gauge readings (mid) establish the timeline inconsistency. Step 2: The tide schedule indicates Eleanor could not have drowned at the claimed time (mid). Step 3: Comparing this against witness accounts during the discriminating test reveals the manipulation.

## Character Reference

### Captain Ivor Hale (he/him — NEVER she/her)
Ivor speaks in a low, gravelly voice, his words deliberate and measured, often punctuated by long silences that carry more weight than his speech.
Ivor is haunted by guilt over his wartime actions, torn between the desire to protect his legacy and the truth of his past.

### Beatrice Quill (she/her — NEVER he/him)
Beatrice's speech is often punctuated by a sardonic edge, her words flowing with a blend of confidence and underlying vulnerability, revealing her complex emotions.
Beatrice grapples with unresolved feelings towards the victim, torn between ambition and the remnants of a past love that complicates her motives.
Voice colour: Beatrice Quill uses sardonic humour — let it surface in their dialogue where natural, not in every line.

### Sylvia Trent (she/her — NEVER he/him)
Sylvia's speech is marked by a polished elegance, interspersed with dry humor that reveals her sharp intellect and cunning nature.
Sylvia is torn between maintaining her status and the growing weight of guilt over her embezzlement, a conflict that threatens her carefully constructed world.
Voice colour: Sylvia Trent uses dry wit humour — let it surface in their dialogue where natural, not in every line.

### Hugo Vane (he/him — NEVER she/her)
Hugo speaks in a calm, collected manner, often employing observational humor that reflects his keen awareness of the absurdities around him.
Hugo grapples with the ethical dilemmas of his actions, torn between loyalty to the hotel and the truth that threatens to surface.
Voice colour: Hugo Vane uses observational humour — let it surface in their dialogue where natural, not in every line.


## CHARACTER CONTRACTS (binding for this scene)
Each entry below constrains how this character must be written in this chapter.
These override generic style guidance when they conflict.

### Captain Ivor Hale[HE]
Voice & mannerisms: Ivor speaks in a low, gravelly voice, his words deliberate and measured, often punctuated by long silences that carry more weight than his speech.
SIGNATURE TIC (use sparingly — this is Captain Ivor Hale's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "Honor is a heavy burden."
Sample voice fragments (match this register and rhythm):
  [comfortable] "Honor is a heavy burden."
  [evasive] "I was merely enjoying the evening on the terrace."
Humour: none — this character plays it straight in all scenes
FORBIDDEN phrase (never write for Captain Ivor Hale): "sighed deeply and felt a sense of peace"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "The victim's intention to reveal Ivor's past betrayal in an upcoming book poses a significant threat to his esteemed reputation." — do not surface in Act I.

### Beatrice Quill[SHE]
Voice & mannerisms: Beatrice's speech is often punctuated by a sardonic edge, her words flowing with a blend of confidence and underlying vulnerability, revealing her complex emotions.
SIGNATURE TIC (use sparingly — this is Beatrice Quill's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "In this business, it's all about the story."
Sample voice fragments (match this register and rhythm):
  [comfortable] "In this business, it's all about the story."
  [evasive] "I thought I was just gathering information, nothing more."
Humour: sardonic — deploy occasionally (level 0.5)
FORBIDDEN phrase (never write for Beatrice Quill): "palpable tension filled the room"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "The victim's threat to expose Beatrice's sensationalist reporting tactics serves as a potential catalyst for her involvement in the crime." — do not surface in Act I.

### Sylvia Trent[SHE]
Voice & mannerisms: Sylvia's speech is marked by a polished elegance, interspersed with dry humor that reveals her sharp intellect and cunning nature.
SIGNATURE TIC (use sparingly — this is Sylvia Trent's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "Charity begins at home, wouldn't you agree?"
Sample voice fragments (match this register and rhythm):
  [comfortable] "Charity begins at home, wouldn't you agree?"
  [evasive] "I was simply hosting a gathering, nothing untoward."
Humour: dry wit — deploy occasionally (level 0.5)
FORBIDDEN phrase (never write for Sylvia Trent): "a surge of determination washed over her"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "The victim's threat to inform the authorities about Sylvia's embezzlement poses a significant risk to her opulent lifestyle." — do not surface in Act I.

### Hugo Vane[HE]
Voice & mannerisms: Hugo speaks in a calm, collected manner, often employing observational humor that reflects his keen awareness of the absurdities around him.
SIGNATURE TIC (use sparingly — this is Hugo Vane's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "It’s all in the details, wouldn’t you say?"
Sample voice fragments (match this register and rhythm):
  [comfortable] "It’s all in the details, wouldn’t you say?"
  [evasive] "I was busy in the kitchen, managing the catering."
Humour: observational — deploy occasionally (level 0.4)
FORBIDDEN phrase (never write for Hugo Vane): "everyone could sense the atmosphere"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Under pressure from investors to maintain the hotel's pristine image, Hugo's actions are driven by a desire to protect his career." — do not surface in Act I.



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

Primary Location: The Crestview Hotel (Brighton, England)
A grand seaside hotel overlooking the churning waters of the English Channel, steeped in the glamour and mystery of the 1940s.

Key Locations Available:
- Grand Lobby (interior): Gathering space
- The Ocean View Dining Room (interior): Dining and socializing
- The Seaside Terrace (exterior): Crime scene
- The Library (interior): Clue discovery

Atmosphere (tonal cue only — do NOT reproduce this phrase verbatim in prose; translate into scene-specific, character-observed sensory language): tense and suspenseful, with underlying anxiety from recent wartime events
Weather: foggy and overcast, typical of coastal climates

Era markers: Art Deco architecture | radio broadcasts crackling in the lounge | rationed wartime vehicles parked outside | early television set flickering in the drawing room

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
  - Visual: crystal chandeliers glimmering, velvet drapes framing windows, art deco sculptures lining walls
  - Sounds: soft jazz playing in the background, muffled chatter of guests, footsteps echoing on marble
  - Scents: freshly polished wood, old leather and tobacco, faint floral perfume
  - Touch: smooth marble underfoot, soft velvet upholstery

The Ocean View Dining Room (interior):
  - Visual: panoramic views of crashing waves, soft flicker of candlelight, art deco wall murals
  - Sounds: clinking of cutlery against plates, soft conversations and laughter, the distant roar of the ocean
  - Scents: aroma of grilled seafood, freshly baked bread, light scent of citrus
  - Touch: smooth linen tablecloths, cool glassware in hand

The Seaside Terrace (exterior):
  - Visual: crashing waves below, shadows of furniture in the fog, dark clouds heavy with rain
  - Sounds: roaring ocean waves, whispering wind through the railing, distant calls of seabirds
  - Scents: damp sea air, faint scent of salt and decay, wet stone from the terrace
  - Touch: cold metal of the furniture, rough texture of stone underfoot

⛔ REFERENCE DATA — DO NOT TRANSCRIBE VERBATIM: The above profiles are structural guides only. Generate original prose that evokes these qualities; do not reproduce the exact phrasing or sentence structure of the profile paragraphs.

SCENE OPENING RULE: When opening a scene in a new location, write what the POV character directly observes and physically senses at that moment — not a general description of the room's qualities. The reader must feel present, not briefed. Senso
[truncated for prompt budget]

## Texture Pool
Draw on these as opportunities arise — you are not required to use them.

- Life in January 1943 is marked by the chill of winter and the fog that envelops the coastal towns of England
- The war casts a long shadow over everyday existence, where rationing dictates meals and news of the conflict fills the airwaves
- Patriotism runs high, yet so does anxiety about the future, as families gather around fires to share stories, their faces illuminated by flickering flames
- Socially, women are stepping into new roles as they fill jobs vacated by men at war, creating tension within traditional family structures
- The atmosphere is charged with unspoken fears and the weight of collective trauma, underscoring the fragility of peace amidst the ongoing upheaval.

TEMPORAL CONTEXT:

This story takes place in January 1943 during winter.

Seasonal Atmosphere:
- Weather patterns: foggy and overcast, chilly winds from the sea, occasional light rain
- Daylight: Short daylight hours, with sunrise around 8:00 AM and sunset by 4:30 PM, creating an early dusk.
- Seasonal activities: brisk walks along the beach, indoor games by the fireplace, visits to local markets for winter produce
- Seasonal occasions: New Year's Day (January 1)
- Season: winter

Period Fashion (describe naturally):
- Men formal: double-breasted wool suit, tweed overcoat, silk tie with geometric patterns
- Men casual: corduroy trousers, knitted sweaters, button-up flannel shirts
- Men accessories: fedora hat, leather gloves, wool scarf
- Women formal: tea-length dress with a fitted waist, tailored wool coat, pearl necklace
- Women casual: sweater sets, high-waisted skirts, broad-brimmed felt hats
- Women accessories: clutch handbag, simple brooch, silk scarf

Cultural Context (reference naturally):
- Music/entertainment: 'I'll Be Seeing You' by Bing Crosby, 'Don't Sit Under the Apple Tree' by The Andrews Sisters, 'In the Mood' by Glenn Miller; Films: 'Casablanca', 'For Whom the Bell Tolls'; Theatre: 'The Glass Menagerie', 'The Skin of Our Teeth'; Radio: 'The Shadow', 'The Jack Benny Program'
- Typical prices: Loaf of bread: four pence, Pack of cigarettes: one shilling, Coal scuttle refill: one shilling sixpence
- Current events: Allied forces planning the invasion of Europe; widespread rationing affecting daily life
- Literature: 'The Fountainhead' by Ayn Rand | 'The Little Prince' by Antoine de Saint-Exupéry | 'The Catcher in the Rye' (serial publication) | [detective fiction] | [war novels] | [romantic fiction]
- Technology: the first practical radar systems | improved military vehicles | advancements in synthetic rubber | early television sets | transistor radios | mechanical typewriters
- Daily life: homemade meals due to rationing, gathering for radio shows, participation in local community events
- Social rituals: Sunday family dinners, holiday gatherings in communal spaces, formal dances at local halls

Atmospheric Details:
The salty scent of the ocean mingles with dampness in the air, creating a heavy atmosphere. The sound of distant waves crashing against the rocks is occasionally broken by the low murmur of conversation from hotel guests. The flickering light of oil lamps casts shadows on the walls, enhancing the sense of mystery and unease.

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
- Authentic references: Use actual songs, films, events from the specific date

USAGE REQUIREMENTS:
1. D
[truncated for prompt budget]

NON-NEGOTIABLE CHAPTER OBLIGATIONS — LOCKED EVIDENCE VALUES (VERBATIM REQUIRED):
The following measured values (times, amounts, measurements) are absolute ground truth. Every time this chapter describes, mentions, or alludes to one — no matter how briefly — it MUST use the exact phrase shown below, character for character. NO paraphrase, approximation, rounding, or synonym is permitted.

FAILURE EXAMPLE: if the locked value is "at thirteen minutes to midnight" and you write "just before midnight" or "around midnight" — that is a HARD FAIL. You must write "at thirteen minutes to midnight". Equally, if the locked value is written in words, such as "ten minutes past eleven", and you convert it to figure-based clock notation — that is also a HARD FAIL. Words stay as words; figure forms are forbidden for word-phrased facts.

CRITICAL — WORD-PHRASED VALUES: If the canonical value is written out in words (e.g. a time like "ten minutes past eleven", or an amount like "forty minutes"), reproduce those exact words. DO NOT convert to figure-based time notation, twenty-four-hour format, or any other numeric shorthand. Correct: "ten minutes past eleven". WRONG: figure-based clock notation or numeric shorthand.

Locked values:
  - The tide reached seven feet at the time of the claimed drowning.: "seven feet"
  - The gala started at eight o'clock in the evening.: "eight o'clock in the evening"
  - The tide was at its lowest point at six o'clock in the evening.: "six o'clock in the evening"

If a value has no relevance to this chapter, omit it. But the moment you reference the underlying evidence, only the exact phrase above is acceptable.

⚠ CENTRAL CONTRADICTION (the heart of the mystery): the two locked values "eight o'clock in the evening" and "six o'clock in the evening" are NOT two separate facts — they are ONE contradiction (one is a staged appearance, the other the true state; the evidence determines which). If this chapter references both, you MUST present them AS A SINGLE CONTRAST joined by a contrast connective (but / yet / however / could only / whereas) — e.g. "the watch showed the one time, yet the evidence proved it could only have been the other" — making clear which reading is the appearance and which is the truth. NEVER state them as two flat, side-by-side truths — that makes the central clue read as if it contradicts itself.

⛔ CLUES TO SURFACE IN THESE CHAPTERS — mandatory:
The following evidence MUST be clearly observable to an attentive reader. Do not bury it in atmosphere or passing dialogue. Each clue must be concrete, specific, and noticeable:

• [clue_11] witnesses, noted, tide, party
  Category: testimonial | Criticality: essential | Supports inference step 1
  Points to: timeline, aligns, tide

• [clue_9] witnesses, reported, seeing, eleanor, near, water, shortly, before
  Category: testimonial | Criticality: essential | Supports inference step 1
  Points to: eleanor, likely, dangerous, situation, before, death

• [clue_fp_contradiction_step_1] witnesses, recall, eleanor, arguing, captain, hale, near, water, edge
  Category: testimonial | Criticality: essential | Supports inference step 1
  Points to: suggests, confrontation, occurred, shortly, before, death

• [clue_id_1] Direct observation of tide gauge
  Category: structural | Placement: early (Act 1)
  Points to: what this observation reveals about the time or circumstances of the crime.

• [clue_id_2] Witnesses discussing the argument
  Category: structural | Placement: early (Act 1)
  Points to: what this observation reveals about the time or circumstances of the crime.

For each clue above: an attentive reader should be able to find, record, and later use it to reason toward the solution.

═══ NARRATIVE STATE (read-only — do not contradict) ═══

LOCKED FACTS — use verbatim whenever this evidence is described:
  • The tide reached seven feet at the time of the claimed drowning.: "seven feet"
  • The gala started at eight o'clock in the evening.: "eight o'clock in the evening"
  • The tide was at its lowest point at six o'clock in the evening.: "six o'clock in the evening"

CHARACTER PRONOUNS — never deviate from these:
  • Eleanor Voss: she/her/her
  • Dr. Mallory Finch: she/her/her
  • Captain Ivor Hale: he/him/his
  • Beatrice Quill: she/her/her
  • Sylvia Trent: she/her/her
  • Hugo Vane: he/him/his

CLUES ALREADY REVEALED TO READER: clue_mechanism_visibility_core, clue_core_contradiction_chain — do not reveal these as new information.

INVESTIGATION LOG — WHAT IS ESTABLISHED (do not re-establish, do not repeat):
• Evidence already established (reference only — do NOT restate or quote these; advance beyond them): confrontation, occurred, shortly, before, death | eleanor, drowned, high, tide
• Suspects still unresolved: Captain Ivor Hale[HE], Beatrice Quill[SHE], Sylvia Trent[SHE]
⚠ The story must move FORWARD from this log. Any beat already listed above is forbidden from repeating.

⚠ THIS CHAPTER'S REQUIRED ADVANCE (early): Interview each suspect — record their claimed whereabouts

CONTINUITY HANDOFF — previous chapter closing beat:
  • "As the morning waned, the room’s anxiety deepened, each guest retreating into her own thoughts. Hugo felt the weight of the investigation settle more heavily on his shoulders. The truth was out there, somewhere between the shifting tides and the stories told w..."
  • The next chapter must open as a continuation of this beat, not as a disconnected reset.

⛔ DEAD CHARACTER — CANNOT APPEAR AS ALIVE:
• Eleanor Voss: murdered before Chapter 1. In ALL chapters from here on:
  - Refer to them ONLY in past tense, only as the victim of the crime
  - NEVER have them: enter a room, speak, respond, gesture, look, nod, or react
  - NEVER describe them as present at any scene, conversation, or confrontation
  - WRONG: "Eleanor Voss crossed the room" / "Eleanor Voss sat on the sofa" / "Eleanor Voss nodded"
  - WRONG: "Eleanor Voss gave testimony" / "Eleanor Voss asked what had happened"
  - CORRECT: "Eleanor Voss had often said..." / "Eleanor Voss's effects were found" / "witnesses recalled Eleanor Voss's habit of..."
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
terrace, lobby, study, dining room

✓ RULE: Continue using this location vocabulary. Maintain consistency with established setting type.
✓ Do NOT introduce new location types that contradict earlier chapters.

**Recent Chapter Summary (for narrative continuity):**
Chapter 1: Chapter 1: The Body at the Water's Edge
  Events: A sharp cry fractured the cold hush of dawn as Hugo Vane pressed through the damp fog that clung to the Seaside Hotel’s winding path.
Chapter 2: Chapter 2: The Gathering Shadows
  Events: "You’ll want to see this, sir," a voice murmured behind Hugo as he lingered by the doorway, the chill of the morning still clinging to his coat.

⚠️ **VALIDATION:** Character name mismatches and setting drift are common failure modes.
Double-check every character name against the list above before using it.

**⏱ LOCKED TIME ANCHOR — use verbatim, do not paraphrase:**
Clock time (from the case ground truth): **"7:00 PM - Party begins"**
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
Known location profile anchors: The Crestview Hotel, Grand Lobby, The Ocean View Dining Room, The Seaside Terrace, The Library, Seaside Hotel - Dining Room
LOCATION NAME CAPITALISATION (HARD REQUIREMENT — validated):
All named locations in your prose MUST use the EXACT capitalisation from the CML profiles.
Canonical forms: "The Crestview Hotel", "Grand Lobby", "The Ocean View Dining Room", "The Seaside Terrace", "The Library", "Seaside Hotel - Dining Room"
Writing a location in lowercase (e.g. "drawing room" instead of "Drawing Room") is a validated error. Every time you mention a named location, copy its capitalisation from the list above.
- Chapter 3: OPENING STYLE (HARD): Start the VERY FIRST SENTENCE with an explicit time marker — e.g. "That morning…" / "By the time dusk fell…" / "It was nearly four o'clock…" / "On the second day after the discovery…". Time must be in the first clause. Anchor opening in "Seaside Hotel - Dining Room". The opening style above governs only your FIRST SENTENCE; the grounding below may land anywhere in the first 2 paragraphs (it need not be sentence one, and never conflicts with the chosen opening style). HARD REQUIREMENT for the first 2 paragraphs: (a) include 2+ sensory words — choose from smell/scent/odor/fragrance/sound/echo/silence/whisper/creak/cold/warm/damp/rough/smooth/glow/shadow/flicker/dim — and (b) include 1+ atmosphere/time word — choose from rain/wind/fog/storm/mist/thunder/evening/morning/night/dawn/dusk/lighting/weather/season/afternoon/midday/noon/midnight/twilight/sunrise/sunset/daylight/sunlight/overcast/cloudy/bright/dark/grey/pale/chill/crisp/drizzle/haze/lamplight/firelight. These are validated requirements, not style suggestions; missing them triggers a retry.

[⚠ INTERNAL QUALITY DIAGNOSTICS — DO NOT REPRODUCE ANY PART OF THIS SECTION IN YOUR STORY OUTPUT. These are private generator observations for your consideration only. Your narrative must read as if this section does not exist. Never include phrases from this block in character dialogue, narration, or description.]

PRIOR CHAPTER QUALITY OBSERVATIONS:
- Chapter 1 (score 97/100):
  Quality gaps noted: word density below preferred target (949/1000)
  Address in upcoming chapters: Increase chapter density with concrete investigation action and sensory-grounded beats; avoid recap-only padding.
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

PROMPT BUDGET SUMMARY: budget=24000 tokens; fixed=11882; context=11756; dropped=[humour_guide]; truncated=[location_profiles, temporal_context, pronoun_accuracy]

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
4. Integrate at least two concrete era-grounded details per chapter from setting refinement signals: radio broadcasts | early television sets | military radar | long-distance telephone calls | military-style coded messages | telegrams for urgent communication.
5. Respect setting movement/access constraints in scene action and alibis: narrow hallways limiting movement | ocean cliffs creating natural barriers | restricted access to staff-only areas | staff-only areas requiring employee badges | guest rooms locked with key cards.
6. Sustain social coherence with this backdrop pressure: A gathering at a grand seaside hotel for a post-war charity event draws together a diverse group, all grappling with societal changes and personal secrets, while the looming threat of a tidal drowning complicates their fates.
7. Maintain continuity around these socially central cast anchors where relevant: Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill, Sylvia Trent, Hugo Vane.
8. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Critical: Plot similarity 0.80 with 'The Second Key' (same crime method of drowning and era setting)
9. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Moderate: Character similarity 0.75 with 'The Second Key' (similar character roles including a doctor and a captain)
10. STORY TO DATE ANTI-COPY RULE: The STORY TO DATE section below is provided for chronological and factual reference ONLY. You MUST NOT copy, lightly rephrase, or structurally echo any sentence or paragraph from prior chapters. Every sentence in this chapter must be original prose unique to this scene. Reusing even a clause from prior chapter text will cause this attempt to fail immediately.

CRITICAL PROSE REQUIREMENTS:

The CML specifies exact requirements for certain validation-critical scenes. You MUST include these elements at the specified positions.

**Discriminating Test Scene (Act 3, Scene 4):**
Required elements: Execute the discriminating test, Observe the evidence of tide levels and witness statements, Draw conclusion about the timeline
Test type: constraint proof

**Suspect Clearance Scenes:**
- Captain Ivor Hale (Act 3, Scene 5): Witness testimony about his actions during the alleged drowning
  Clues: clue_id_1, clue_id_2
- Beatrice Quill (Act 3, Scene 5): Alibi proving she was not near the water at the time
  Clues: clue_id_1, clue_id_2
- Sylvia Trent (Act 3, Scene 5): Evidence of her separate activities during the party
  Clues: clue_id_1, clue_id_2

**Culprit Revelation Scene (Act 3, Scene 6):**
Method: Confrontation with evidence of tide manipulation

**Clue Placement for These Chapters:**
- clue_11 must appear in Act 1, Scene 3 via Witness statement
- clue_9 must appear in Act 1, Scene 3 via Witness statement
- clue_fp_contradiction_step_1 must appear in Act 1, Scene 3 via Cross-check contradiction
- clue_id_1 must appear in Act 1, Scene 3 via Direct observation of tide gauge
- clue_id_2 must appear in Act 1, Scene 3 via Witnesses discussing the argument

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
Batch chapters: 3-3.
Investigation state at start: 2 clue(s) revealed to reader; approximately 3 unresolved suspect(s).
Must change by end: Reframe prior clue meaning and update suspect implications.
Suspect pressure target(s): Captain Ivor Hale, Sylvia Trent, Beatrice Quill
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
- Chapter 3:
  - STRUCTURAL ARCHETYPE — Chapter 3 must be: EVIDENCE
      ✓ MUST contain: new physical clue discovered
      ✗ MUST NOT contain: formal accusation
  - Word count: Target 1250 words. Achieve this through plot events, dialogue exchanges, and physical investigation — not through atmospheric repetition or extended internal reflection. Each 200-word segment should contain at minimum one concrete story event (a discovery, a conversation exchange, a physical action or movement). Padding with atmosphere alone is not acceptable.
  - Opening: Begin with a character action, spoken line, or clock/time marker — never a location name or location-description phrase.
  - Scene is set in: Seaside Hotel - Dining Room — reference it naturally within the paragraph, never as your opening phrase.
  - Opening atmosphere (MANDATORY — validator enforced): the first paragraph MUST contain at least one of: rain / wind / fog / storm / mist / thunder / evening / morning / night / dawn / dusk / season / afternoon / midday / noon / midnight / twilight / sunrise / sunset / daylight / sunlight / overcast / cloudy / bright / dark / grey / pale / cold / warm / chill / crisp / damp / drizzle / haze / lamplight / firelight. A chapter that omits all of these from its opening paragraph will be rejected.
  - PARAGRAPH OPENER DIVERSITY (MANDATORY — validator enforced): No more than 2 paragraphs in this chapter may begin with "Hugo" or "Hugo's" as the first word. You must vary paragraph openings throughout: use sensory observations, another character's name or action, dialogue, object or sound details, or temporal markers. Opening 3 or more paragraphs with "Hugo" will cause automated rejection.
  - Continuity bridge: in the first 120 words, visibly connect from the previous chapter's final beat. Carry forward one unresolved element (object, accusation, emotional pressure, or immediate physical action) from: "As the morning waned, the room’s anxiety deepened, each guest retreating into her own thoughts. Hugo felt the weight of the investigation settle more heavily on his shoulders. The truth was out there, somewhere between t...".
  - CLUE OBLIGATIONS — each clue below MUST be dramatized, but in YOUR OWN WORDS:
    Render each as something a character SEES, DOES, or SAYS on the page. The bracketed text is a
    DESCRIPTION of the evidence for you — do NOT transcribe it as narration. Copying a clue's
    description sentence verbatim into the prose FAILS validation.
    • witnesses, recalling, tide, levels [clue_11] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: timeline, aligns, tide
      ↳ MANDATORY TWO-PARAGRAPH STRUCTURE (must appear in paragraphs 1 or 2 — no later):
         Paragraph 1: The POV character physically approaches or directly observes this evidence.
           The narration or dialogue explicitly states what is seen (use the exact locked phrase if one applies).
         Paragraph 2 (immediately following): The detective or POV character explicitly reasons
           about what this evidence implies — who it implicates, why it may be unreliable,
           or what inference it supports. This must be a separate full paragraph, not a sentence appended to Paragraph 1.
    • witnesses, recalling, eleanor, presence, near, water [clue_9] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: eleanor, likely, dangerous, situation, before, death
      ↳ MANDATORY TWO-PARAGRAPH STRUCTURE (must appear in paragraphs 1 or 2 — no later):
         Paragraph 1: The POV character physically approaches or directly observes this evidence.
           The narration or dialogue explicitly states what is seen (use the exact locked phrase if one applies).
         Paragraph 2 (immediately following): The detective or POV character explicitly reasons
           about what this evidence implies — who it implicates, why it may be unreliable,
           or what inference it supports. This must be a separate full paragraph, not a sentence appended to Paragraph 1.
    • witnesses, observing, argument, eleanor, captain, hale [clue_fp_contradiction_step_1] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: suggests, confrontation, occurred, shortly, before, death
      ↳ MANDATORY TWO-PARAGRAPH STRUCTURE (must appear in paragraphs 1 or 2 — no later):
         Paragraph 1: The POV character physically approaches or directly observes this evidence.
           The narration or dialogue explicitly states what is seen (use the exact locked phrase if one applies).
         Paragraph 2 (immediately following): The detective or POV character explicitly reasons
           about what this evidence implies — who it implicates, why it may be unreliable,
           or what inference it supports. This must be a separate full paragraph, not a sentence appended to Paragraph 1.
    • witnesses, recalling, tide, levels [clue_id_1] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: timeline, aligns, tide
      ↳ MANDATORY TWO-PARAGRAPH STRUCTURE (must appear in paragraphs 1 or 2 — no later):
         Paragraph 1: The POV character physically approaches or directly observes this evidence.
           The narration or dialogue explicitly states what is seen (use the exact locked phrase if one applies).
         Paragraph 2 (immediately following): The detective or POV character explicitly reasons
           about what this evidence implies — who it implicates, why it may be unreliable,
           or what inference it supports. This must be a separate full paragraph, not a sentence appended to Paragraph 1.
    • tide, gauge, indicating, water, levels [clue_id_2] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: eleanor, drowned, high, tide
      ↳ MANDATORY TWO-PARAGRAPH STRUCTURE (must appear in paragraphs 1 or 2 — no later):
         Paragraph 1: The POV character physically approaches or directly observes this evidence.
           The narration or dialogue explicitly states what is seen (use the exact locked phrase if one applies).
         Paragraph 2 (immediately following): The detective or POV character explicitly reasons
           about what this evidence implies — who it implicates, why it may be unreliable,
           or what inference it supports. This must be a separate full paragraph, not a sentence appended to Paragraph 1.
  - PLANT OBLIGATIONS (incidental appearances): each item below MUST appear in this chapter as a passing physical detail a character sees, handles, or walks past — with its significance UNFLAGGED:
    • captain, ivor, hale, engaged, conversation, guests [plant:clue_6]
    • sylvia, trent, departing, party [plant:clue_7]
    • witnesses, observing, argument, eleanor, captain, hale [plant:clue_fp_contradiction_step_3]
    Rules: set dressing only. NO character comments on its importance, NO narrator hint ("little did they know", "something about it seemed off" are FORBIDDEN), NO inference drawn. It simply exists in the scene, naturally. Its significance surfaces in a LATER chapter — planting it casually here is what makes that later reveal feel fair.
  - Tonal contrast: include at least one beat of relief or ironic counterpoint. Do not sustain maximum tension for every paragraph.
  - CLUE DISCLOSURE RULE (Stage 3/4):
    Characters may draw inferences and name partial conclusions but must NOT state the full mechanism or name the culprit directly. The detective may suspect but not confirm.
    WRONG: dialogue or narration that directly explains how the crime was committed before Stage 4.
    RIGHT: observation, physical reaction, and logical inference that leaves the mechanism just off-screen.
  - ALIBI LOCK: Dr. Mallory Finch's established alibi is "7:00 PM to 8:30 PM". Do NOT place Dr. Mallory Finch at any other location or in any other activity during the crime window. Any contradiction is a continuity error that triggers a retry.
  - TESTIMONY CONTINUITY: Dr. Mallory Finch has already made statements in earlier chapters. Any time, location, or claim attributed to Dr. Mallory Finch in THIS chapter must be consistent with those earlier statements. Do NOT introduce a new or different alibi claim — any contradiction is a continuity error.
- Locked fact phrase obligations:
  - If this batch mentions The tide reached seven feet at the time of the claimed drowning., write exactly: "seven feet".
  - If this batch mentions The gala started at eight o'clock in the evening., write exactly: "eight o'clock in the evening".
  - If this batch mentions The tide was at its lowest point at six o'clock in the evening., write exactly: "six o'clock in the evening".
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
Must change by end: Reframe prior clue meaning and update suspect implications.
Suspect pressure target(s): Captain Ivor Hale, Sylvia Trent, Beatrice Quill
Required new information: Earlier clue gets revised meaning with explicit theory update.
Forbidden reveals at this stage: Do not introduce decisive new evidence from nowhere.

FROZEN FACT STATE (DO NOT ALTER):
- Timeline anchor: January (winter).
- Month, season, weather, and time-of-year language in this batch must stay compatible with winter.
- Established timeline fact: 7:00 PM - Party begins
- Established timeline fact: 8:30 PM - Eleanor found
- If referenced, use exact phrase: "seven feet" (The tide reached seven feet at the time of the claimed drowning.).
- If referenced, use exact phrase: "eight o'clock in the evening" (The gala started at eight o'clock in the evening.).
- If referenced, use exact phrase: "six o'clock in the evening" (The tide was at its lowest point at six o'clock in the evening.).

STORY TO DATE (REFERENCE ONLY — DO NOT COPY VERBATIM):
- Full prior chapter text is provided below for continuity, factual consistency, and reference accuracy.
- Use this to keep character voice, chronology, clue state, and location continuity aligned with earlier chapters.
- Do not quote, copy, or paraphrase these paragraphs too closely; write fresh prose that remains consistent with them.

--- BEGIN PRIOR CHAPTER 1 ---
Title: Chapter 1: The Body at the Water's Edge
A sharp cry fractured the cold hush of dawn as Hugo Vane pressed through the damp fog that clung to the Seaside Hotel’s winding path. The salt-laden wind whipped against his overcoat, carrying with it the distant, relentless crash of waves against the rocks below. Ahead, where the terrace steps met the shingle, a small knot of guests had gathered, their silhouettes blurred by the wintry haze. At their feet, Eleanor Voss lay sprawled at the water’s edge, her tea-length dress sodden and her face as pale as the morning mist. The scent of seaweed and wet stone mingled with something sharper—a note of fear that had nothing to do with the weather.

Hugo’s breath caught as he knelt beside Eleanor Voss, the hotel’s most luminous guest, now rendered silent by the sea. Her hair, once meticulously coiffed, fanned across the slick stones, and her gloved hand rested, palm up, as if in mute appeal. The chill in the air seemed to seep into his bones. Behind him, the muffled voices of the onlookers rose and fell, punctuated by the nervous clatter of Beatrice Quill’s heels on the terrace and the clipped, authoritative tone of Captain Ivor Hale. Hugo’s eyes flicked to Hale, who stood rigid, his jaw set and eyes fixed not on Eleanor, but on the horizon, as though the answers might be found somewhere beyond the grey line of sea and sky.

A woman’s voice—Sylvia Trent, her usual poise fraying—broke through the murmurs. “She was here, arguing with Captain Hale, just before—” Sylvia’s words faltered, her gaze darting from Hugo to the body and back again. The implication hung in the air, heavy as the fog. Hugo straightened, his own mind already assembling the fragments: the argument, the proximity to the water, the abruptness of Eleanor’s end. He noted the way Captain Hale’s hand tightened around the railing, knuckles white, as if bracing against something more than the cold.

The Seaside Hotel, grand even in the bleakness of midwinter, seemed to shrink beneath the weight of the tragedy. Its Art Deco lines, usually so crisp against the sea, blurred in the morning gloom. Somewhere behind the drawn velvet drapes of the Grand Lobby, the radio played a crackling waltz, oblivious to the drama unfolding outside. Hugo glanced back at the building, aware of the eyes that watched from behind frosted panes—guests, staff, perhaps even Dr. Mallory Finch, whose absence from the scene was as conspicuous as the body at his feet.

He rose, brushing damp grit from his trousers, and addressed the small gathering. “No one is to leave the terrace,” he said, his voice steady despite the tremor in his hands. “We must wait for Dr. Finch, and for the authorities. Until then, I’ll ask for your patience—and your discretion.” The words felt inadequate, but protocol was all that remained in the face of such finality. Hugo’s gaze lingered on Beatrice Quill, who clutched her handbag so tightly her knuckles blanched, and on Sylvia Trent, whose composure had never seemed so brittle.

A gust of wind sent a spray of brine across the stones, and Hugo turned his attention back to Eleanor. He noted the faint bruising at her temple, the torn edge of her scarf tangled in the rocks. The tide had receded, leaving a rim of damp sand around her body, but the water still lapped hungrily at the hem of her dress. He remembered the tide schedule posted in the lobby—“seven feet” at the hour of the party, or so the chart had claimed. Yet something about the scene felt off, a discordant note he could not yet name.

Captain Ivor Hale, the hotel’s steward and the late Eleanor’s trusted adviser, stood nearest the body. His posture was disciplined, but his hand tightened around his watch chain, betraying a tension that belied his calm exterior. Hugo watched him for a moment, searching for a flicker of guilt or grief. Instead, Hale’s eyes met his with a defiant steadiness. “She was distraught,” Hale said quietly, “but no one expected this.” The words were measured, but Hugo caught the shadow of something else—a calculation, perhaps, or the exhaustion of a man who had spent the night defending himself in whispers.

As the morning wore on, more guests trickled onto the terrace, drawn by the irresistible gravity of disaster. Hugo moved among them, cataloguing their reactions: Beatrice’s sharp, darting glances; Sylvia’s tremulous attempts at comfort; the absence of Dr. Mallory Finch, who, according to the register, had been attending to a guest in the upper wing. Each detail pressed against him, demanding order, explanation, sense. He knew, with a manager’s instinct, that the hotel’s reputation—already battered by rationing, shortages, and the war’s relentless anxiety—would not survive another scandal.

He crouched once more beside Eleanor, his eyes tracing the pattern of watermarks on her dress, the way her shoes pointed towards the sea. The memory of Sylvia’s accusation lingered: an argument, a witness, a moment that might have changed everything. Hugo’s mind sifted through the evidence, searching for a foothold. The tide, the time, the argument—each a thread in a tapestry he could not yet unravel. He felt the weight of responsibility settle on his shoulders, cold and inescapable as the winter wind.

As the constable’s footsteps echoed up the path, Hugo straightened and drew a long, steadying breath. He was the investigator now, whether by choice or necessity. The truth, he suspected, would be as treacherous as the tides that had claimed Eleanor Voss. But for now, all he could do was observe, record, and wait—for the tide to turn, for the fog to lift, for the first true clue to surface from the depths.
--- END PRIOR CHAPTER 1 ---

--- BEGIN PRIOR CHAPTER 2 ---
Title: Chapter 2: The Gathering Shadows
"You’ll want to see this, sir," a voice murmured behind Hugo as he lingered by the doorway, the chill of the morning still clinging to his coat. The Seaside Hotel - Gathering Room was a study in anxious motion: the sharp scent of damp wool and the faint echo of hurried footsteps mingled with the low hum of voices, all blurred by the pale winter light that filtered through the frosted windows. Hugo followed the attendant’s gesture to the far wall, where the tide gauge—its brass face dulled by years of salt air—stood beneath a framed tide schedule. The needle, stubborn and unmoved, pointed to a mark well below the midpoint: not the seven feet he expected, but a level that whispered of low water. Outside, the fog pressed against the glass, muffling the sound of distant waves and deepening the sense of enclosure.

He studied the gauge, the numbers etched in careful increments, and felt a prickling unease. If the tide had not reached seven feet at the time of Eleanor’s death, then the story told by the water’s edge could not be trusted. Hugo’s mind raced through the implications: a drowning at low tide was not only improbable, it was nearly impossible on this stretch of coast. The contradiction was immediate and sharp—a splinter in the narrative that would not be ignored. He glanced at the tide schedule posted nearby, its columns of times and heights meticulously filled in, and wondered who else had noticed the discrepancy. The evidence did not fit the claims made on the terrace. Someone, he realized, was lying—or the truth was more elusive than any of them cared to admit.

The room had filled in the interim, voices rising and falling in uneasy waves. Captain Ivor Hale stood by the mantel, his posture ramrod straight, the lines of his double-breasted wool suit crisp even in the wan light. He did not look at Hugo, but his jaw worked, and his eyes flicked to the door with every new arrival. Dr. Mallory Finch, in a tailored coat and sensible shoes, was arranging a tray of glasses on the sideboard, her movements precise, betraying nothing of her inner thoughts. Beatrice Quill lingered near the window, one gloved hand pressed against the cold pane, her gaze fixed on the obscured outline of the sea beyond.

Hugo cleared his throat, drawing their attention. "Captain Hale, may I have a word?" The title hung in the air, formal and faintly accusatory. Hale turned, his expression carefully composed. "Of course. If you think it will help." His voice was low, gravelly, each word measured. Hugo gestured toward the tide gauge. "You said you were on the terrace just before Eleanor was found. Did you notice the water level?" Hale’s eyes narrowed. "I was not paying attention to the tide, Mr. Vane. My concern was for Miss Voss—she seemed agitated. I tried to calm her, but she left me there. That’s all." A pause, the silence stretching. "I did not see her again until… until she was gone."

The denial was smooth, but not unbreakable. Hugo watched the captain’s hands, noting the way his fingers curled into fists, the knuckles blanching. "You’re certain you didn’t follow her down to the water?" Hugo pressed, voice gentle but insistent. Hale’s reply was clipped: "I remained on the terrace. There were others who can confirm it." His gaze darted—just for a moment—to Beatrice, then away. The implication was clear: corroboration, or perhaps collusion. Hugo filed it away.

Across the room, Dr. Mallory Finch set down her tray with a muted clink. She met Hugo’s gaze with a calm that bordered on clinical. "You’re searching for inconsistencies, Mr. Vane. I suppose that’s your duty now." Her tone was measured, the faintest trace of irony threading through her words. "It’s a dreadful business. I was in the Ocean View Dining Room at the time, attending to a guest who had fainted. I only heard of Eleanor’s death when the commotion began." She smoothed her skirt, her movements deliberate. "If you require a statement, I’ll provide one. But I doubt I can offer much help." There was no warmth in her voice, but no visible guilt either—only a professional detachment that made Hugo uneasy.

He let the silence linger, then shifted his attention to Beatrice Quill. She had not moved from the window, her reflection ghostly in the glass. "Miss Quill, you were among the first on the terrace. Did you notice anything unusual about the water?" Beatrice’s lips curled in a sardonic half-smile. "I’m a journalist, Mr. Vane, not a sailor. I noticed Eleanor’s shoes were soaked, and that the tide seemed lower than I’d expected. But I suppose I was more interested in the drama than the details of the shoreline." She turned, her eyes sharp. "Is that what this is now—a matter of inches and minutes?"

Hugo considered her words, the edge of bitterness beneath the bravado. "Sometimes, Miss Quill, it’s all in the details." He let the phrase hang, watching for a reaction. Beatrice’s gaze faltered, just for a heartbeat, before she looked away. "In this business, it’s all about the story," she murmured, almost to herself. The admission was both shield and confession—a reminder that ambition could be as dangerous as any weapon.

A sudden commotion by the sideboard drew their attention. Dr. Mallory Finch, ever meticulous, was now arranging the party items with a precision that bordered on obsessive. Her hands trembled, just once, as she placed a decanter beside a row of glasses. Hugo noted the gesture, wondering what it cost her to maintain such composure. Beyond her, the tide schedule hung on the wall, its neat columns a silent witness to the unfolding confusion.

Outside, the fog had not lifted; if anything, it pressed closer, the world beyond the gathering room reduced to a smear of grey. A line of footprints, half-erased by the damp, led from the terrace steps down toward the water’s edge—a path already trampled by too many feet. The scent of salt and wet stone drifted in each time the door opened, mingling with the aroma of coffee and the faint tang of rationed soap.

Hugo moved to the window, his breath fogging the glass. He watched as a constable paced the terrace, boots sinking into the sand, pausing to study the marks that led toward the sea. The contradictions multiplied: a tide gauge showing low water, yet a body found drowned; witness statements that clashed with the physical facts. It was not only the tide that had turned, but the very narrative of the night.

He returned to the group, his tone grave. "There are discrepancies that must be addressed. The tide gauge does not match what we’ve been told. Until we know more, I ask that you remain available for further questions." Captain Hale’s jaw tightened, but he said nothing. Dr. Mallory Finch inclined her head, her face unreadable. Beatrice Quill offered a brittle smile, her eyes unreadable.

As the morning waned, the room’s anxiety deepened, each guest retreating into her own thoughts. Hugo felt the weight of the investigation settle more heavily on his shoulders. The truth was out there, somewhere between the shifting tides and the stories told within these walls. For now, all he could do was watch, listen, and wait for the next contradiction to surface.
--- END PRIOR CHAPTER 2 ---

[SCENE COMPLETENESS CONTRACTS — MANDATORY. Each contract below lists what you MUST enact in that chapter. Do not summarise or mention these labels in the prose — enact them organically.]
Chapter 3 (Act 1) completeness contract:
  PIVOT ELEMENT (MANDATORY — write this into the prose, shown not told): "Witnesses' conflicting statements about the tide at the time of the party."
  FACT ESTABLISHED (MANDATORY — reader must know this by chapter end): "Establishes that multiple guests have conflicting accounts of their whereabouts and the tide conditions."
  RED HERRING (MANDATORY — seed naturally, not flagged as false): [rh_2] Some party guests mention hearing a splash just before the lights went out — seeds false inference about the timing of her drowning.

# Case Overview
Title: Tidal Deception
Era: 1940s
Setting: Seaside Hotel
Crime: murder (drowning)
Culprit: Dr. Mallory Finch
Victim: Eleanor Voss
False assumption: Eleanor Voss drowned during the party as the tide was high.
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
    "sceneNumber": 3,
    "act": 1,
    "title": "Gathering Clues",
    "setting": {
      "location": "Seaside Hotel - Dining Room",
      "timeOfDay": "Midday",
      "atmosphere": "Tense, with guests avoiding eye contact and whispering"
    },
    "characters": [
      "Hugo Vane",
      "Captain Ivor Hale",
      "Sylvia Trent",
      "Beatrice Quill"
    ],
    "purpose": "Reveal early witness statements and establish contradictions",
    "cluesRevealed": [
      "clue_11",
      "clue_9",
      "clue_fp_contradiction_step_1"
    ],
    "dramaticElements": {
      "conflict": "Tensions rise as guests defend their alibis",
      "tension": "Mistrust grows among the guests as conflicting testimonies emerge",
      "microMomentBeats": [
        "Sylvia's hands tremble as she recounts her whereabouts, revealing her unease."
      ]
    },
    "summary": "In the dining room, guests recount their movements during the party. Captain Hale insists he was with others, while Sylvia claims she left early. Beatrice's conflicting statement about the tide adds to the growing tension, as Hugo begins to suspect that someone is lying.",
    "beat": "first_enquiries",
    "estimatedWordCount": 1250,
    "pivotElement": "Witnesses' conflicting statements about the tide at the time of the party.",
    "factEstablished": "Establishes that multiple guests have conflicting accounts of their whereabouts and the tide conditions.",
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
        "characterName": "Sylvia Trent",
        "behaviour": "Show normal social behaviour; grief or confusion if appropriate."
      },
      {
        "characterName": "Beatrice Quill",
        "behaviour": "Show normal social behaviour; grief or confusion if appropriate."
      }
    ],
    "redHerringPlacement": {
      "redHerringId": "rh_2",
      "placementDetail": "Some party guests mention hearing a splash just before the lights went out — seeds false inference about the timing of her drowning."
    },
    "emotionalRegister": "Unease grows as the investigation begins, revealing the personal stakes each character faces.",
    "dominantCharacterNote": {
      "name": "Captain Ivor Hale",
      "voiceRegister": "Ivor's voice is low and gravelly, with deliberate speech that conveys a sense of authority and weight."
    },
    "humourGuidance": {
      "permission": "forbidden"
    },
    "eraTextureNote": "Limited transportation options due to fuel rationing.; Short daylight hours with limited visibility.; Communication difficulties due to wartime censorship.; Scarcity of goods affecting daily life and social gatherings.",
    "locationRegisterNote": "",
    "mechanismRevealAllowed": false,
    "cluesPlanted": [
      "clue_6",
      "clue_7",
      "clue_fp_contradiction_step_3"
    ]
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
□ Chapter 3: the clue [clue_11] (witnesses, noted, tide, party) is placed in the first 25% of the chapter, dramatized in your own words, followed by an explicit inference or suspicion paragraph.
□ Chapter 3: the clue [clue_9] (witnesses, reported, seeing, eleanor, near, water, shortly, before) is placed in the first 25% of the chapter, dramatized in your own words, followed by an explicit inference or suspicion paragraph.
□ Chapter 3: the clue [clue_fp_contradiction_step_1] (witnesses, recall, eleanor, arguing, captain, hale, near, water, edge) is placed in the first 25% of the chapter, dramatized in your own words, followed by an explicit inference or suspicion paragraph.
□ Chapter 3: the clue [clue_id_1] (witnesses, noted, tide, party) is placed in the first 25% of the chapter, dramatized in your own words, followed by an explicit inference or suspicion paragraph.
□ Chapter 3: the clue [clue_id_2] (tide, gauge, shows, water, levels, party) is placed in the first 25% of the chapter, dramatized in your own words, followed by an explicit inference or suspicion paragraph.
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
