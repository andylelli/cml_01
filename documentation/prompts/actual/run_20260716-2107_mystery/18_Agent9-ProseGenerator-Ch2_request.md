# Actual Prompt Record

- Run ID: `mystery-1784236058900`
- Project ID: ``
- Timestamp: `2026-07-16T21:15:34.933Z`
- Agent: `Agent9-ProseGenerator-Ch2`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4.1`
- Temperature: `0.42`
- Max Tokens: `4500`
- Attempt: `first`
- Prompt Hash: `733f7666714fcef1`

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
- MORAL COMPLEXITY REQUIREMENT: The mechanism of this crime carries a moral gray area: "The culprit believed they were saving the victim from a greater danger, having been misled by a false narrative." — the culprit reveal and denouement MUST acknowledge this ambiguity. Do not let the ending feel clean or simple. Give the reader at least one moment of uncomfortable sympathy or moral doubt.

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
   - Dr. Mallory Finch: Confidante
   - Captain Ivor Hale: Old Guard
   - Beatrice Quill: victim (DECEASED — does not appear in any scene, past tense only)
   - Sylvia Trent: Ambitious Outsider
   - Hugo Vane: Ruthless Tycoon
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

## Era: July 1941
In July 1941, the world is steeped in the complexities of war, with shadows of global conflict looming over daily life. The atmosphere is thick with uncertainty as the aftermath of World War II shifts societal norms, particularly regarding gender roles and class structures. In the seaside town where The Tidal Veil Hotel stands, the weather mirrors the somber mood, with overcast skies and occasional rain adding to the sense of unease. Guests at the hotel carry with them the weight of their personal struggles, reflecting the broader anxieties of a society grappling with the realities of war, rationing, and the changing landscape of human relationships. Life continues, but with an undercurrent of tension that colors every interaction and decision.
Emotional register: A collective sense of anxiety permeates society, with individuals navigating their fears amid the uncertainty of war.
Physical constraints: Limited communication due to wartime restrictions and rationing of goods | Travel difficulties exacerbated by the war and ongoing military movements | Heightened security measures affecting access to public spaces and gatherings
Current tensions (weave into background texture): Germany's invasion of the Soviet Union and its implications for global security | Growing calls for U.S. involvement in WWII and the military draft | Economic challenges due to rationing and inflation impacting everyday life
Wartime context — Many young men are being drafted, leaving families and communities in turmoil.: Women are stepping into roles traditionally held by men, challenging societal norms while facing scrutiny. Absence effect: The absence of loved ones in military service deepens emotional scars and alters family dynamics.

## Season Lock (mandatory — derived from July 1941)
Season: summer. Allowed vocabulary: summer, summery, midsummer
Forbidden seasonal words — never use in narration, dialogue, or metaphor: spring, autumn, winter and their adjectival forms.
Every weather description, atmosphere, and time-of-year reference must be consistent with summer.

## Story Theme
The investigation into a murder reveals how secrets and societal pressures intertwine, ultimately exposing the fragility of human relationships in a post-war world, and reveals that evidence carries ethical weight, forcing characters to choose accountability over social performance when appearances and facts collide.

## Story Emotional Register
Dominant: The story's overall emotional character is one of mounting tension and unresolved grief.

Arc:
The Tidal Veil Hotel stands as a haunting backdrop where the weight of recent tragedy hangs in the air, casting a shadow over its guests. As the investigation into Beatrice Quill's murder unfolds, Eleanor Voss steps into a world of unease, where laughter feels forced and every glance carries the weight of suspicion. The initial atmosphere is thick with grief and hidden truths, setting the stage for a rising wave of tension that envelops the hotel. As clues emerge, the investigation reveals false leads and emotional costs, with each character grappling with their own secrets that intertwine with the victim's fate.

A pivotal moment shifts Eleanor's direction, as she begins to see connections that were previously obscured by her own guilt. The pressure mounts as revelations begin to surface, recoloring every interaction and deepening the emotional stakes. The climax arrives as Eleanor confronts the truth, challenging both her own past and the facades of those around her. The resolution leaves her with a bittersweet understanding of the fragility of human relationships, as the echoes of Beatrice's death linger in the hearts of those who remain, forcing them to confront their own demons amidst the backdrop of a world forever changed by war.

## Emotional register at this point in the story
A heavy atmosphere of grief and tension fills the hotel, setting the stage for the tragedy.

## Character Portraits (appearance & era)

### Eleanor Voss
Eleanor Voss embodies the complexities of a post-war journalist, navigating the intricacies of truth amid personal guilt over her past. As she investigates Beatrice's death, the societal pressures of a changing world weigh heavily on her, pushing her to reconcile her professional integrity with her emotional turmoil.
Era intersection: Her struggle to uncover the truth reflects the broader societal shifts, as women assert their roles in the workforce while grappling with the remnants of personal relationships strained by the war.

### Dr. Mallory Finch
Dr. Mallory Finch's dedication to her medical practice contrasts sharply with the financial strains exacerbated by the war. As she faces the consequences of her past disputes with Beatrice, the pressure of maintaining her reputation in a precarious world becomes palpable.
Era intersection: Her internal conflict highlights the challenges faced by women in professions traditionally dominated by men, especially as their roles expand in wartime.

### Captain Ivor Hale
Captain Ivor Hale represents the honorable ideals of a bygone era, yet his hidden secrets threaten to tarnish his family's legacy. As he grapples with the moral implications of his knowledge about Beatrice, the pressures of maintaining a respectable facade in a time of chaos intensify.
Era intersection: His struggle signifies the clash between traditional values and the emerging realities of post-war society, where personal honor must contend with collective upheaval.

### Sylvia Trent
Sylvia Trent's ambition and deception underscore the cutthroat nature of the art world in a time of war. Her secret dealings with Beatrice illustrate the lengths individuals will go to protect their status, highlighting the moral ambiguities that arise amid societal change.
Era intersection: Her character captures the essence of women navigating new opportunities and threats, as they balance ambition with the fear of exposure in a rapidly evolving society.

### Hugo Vane
Hugo Vane's charm belies the ruthless ambition that drives him, as he navigates the pressures of maintaining his business empire amidst war-induced uncertainties. His involvement with Beatrice reveals the precariousness of trust and loyalty in a world where survival often necessitates betrayal.
Era intersection: His character reflects the moral dilemmas faced by men in positions of power during the war, as they reconcile their ambitions with the consequences of their actions.

## Character Voices

### Eleanor Voss (she/her/her)
Eleanor has a measured tone, often weaving sharp observations into her speech.
[comfortable] Ah, the irony of it all; life has a way of making fools of us all.
[evasive] I suppose we all have our reasons, but some stories are better left untold.
[stressed] The truth is a slippery thing, especially when it’s tangled in personal affairs.
Humour: Her dry wit often surfaces during tense moments.

### Dr. Mallory Finch (she/her/her)
Dr. Finch speaks with a clinical precision, reflecting her dedication to her profession.
[comfortable] Every patient is a puzzle; it’s just a matter of finding the right pieces.
[evasive] I’m afraid that’s not how the body works; perhaps it's best to focus on what we know.
[stressed] Time is of the essence, and I must prioritize patient care above all else.
Humour: Her lack of humour adds to her serious demeanor.

### Captain Ivor Hale (he/him/his)
Ivor has a warm, booming voice that commands attention, often laced with self-deprecating humor.
[comfortable] There’s honor in the sea, and I’ve sailed through my share of storms.
[evasive] Well, let’s just say the past is best left in the depths.
[stressed] I never thought I’d have to choose between loyalty and truth; it’s a heavy burden.
Humour: His self-deprecating humor often eases tense situations.

### Sylvia Trent (she/her/her)
Sylvia speaks with polished confidence, often laced with sarcasm.
[comfortable] Art is subjective, darling; it’s all about perception, isn’t it?
[evasive] I’m afraid I can’t comment on that; it’s all rather delicate.
[stressed] This is not how I envisioned my evening; the stakes have never been higher.
Humour: Her sarcastic remarks provide a sharp contrast to the surrounding tension.

### Hugo Vane (he/him/his)
Hugo speaks smoothly, often punctuated with sardonic humor.
[comfortable] It’s all about the bottom line; one must know how to play the game.
[evasive] Let’s not dwell on past mistakes; the future is what truly matters.
[stressed] I can’t afford any scandals; everything I’ve built is on the line!
Humour: His sardonic humor often masks deeper insecurities.

## Location Registers (scene framing guides)

Oceanview Suite: The Oceanview Suite is laden with a heavy atmosphere of grief, secrets, and chaos, where the remnants of a life extinguished linger palpably in the air. The once-luxurious decor now feels suffocating, each detail a reminder of the tragedy that unfolded within its walls.. Camera angle: A writer entering this space should feel the weight of loss and the urgency of unraveling hidden truths.. Era: Amidst the backdrop of WWII, this space becomes a crucible for the hidden tensions of its occupants.

Grand Lobby: The Grand Lobby buzzes with anxious energy, as guests exchange furtive glances and whispers. The air is thick with unspoken fears and the tension of recent events, creating an atmosphere that feels both inviting and suffocating at once.. Camera angle: A writer should capture the palpable tension, feeling the contrast between the lobby’s elegance and the underlying anxiety.. Era: The echoes of war influence every interaction, making the lobby a microcosm of societal unrest.

Dining Room: The Dining Room is steeped in a mixture of elegance and apprehension, as guests navigate their emotions over lavish meals. Each clink of cutlery resonates with the weight of their secrets, creating an environment where appearances can be deceiving.. Camera angle: A writer should focus on the contrasts of opulence and tension, capturing the duality of the dining experience.. Era: The decor reflects a bygone era, yet the conversations reveal the strain of living under the threat of war.

Staff Kitchen: The Staff Kitchen is alive with frenetic energy, yet carries an undercurrent of anxiety as staff prepare meals amidst whispers of the tragedy. The aroma of food mingles with the tension, creating an atmosphere that is both industrious and fraught with worry.. Camera angle: A writer should evoke the hustle and bustle while highlighting the emotional strain of the staff.. Era: The kitchen serves as a hidden space, where the realities of war intersect with the daily grind of hotel life.

## Humour guidance for this story position (opening)
Permission: forbidden
Rationale: The gravity of the murder sets a serious tone that does not permit humor.

FAIR-PLAY AND INFERENCE CONTRACT:
- FAIR PLAY CLUE TIMING: Never combine clue discovery and detective deduction in the same chapter. If a clue is first revealed to the reader in chapter N, the detective may only analyze, deduce from, or act on that clue in chapter N+1 or later.
- FAIR PLAY INFORMATION PARITY: The reader must see all clues BEFORE the detective uses them in reasoning. If the detective performs a test or makes a deduction, every piece of evidence supporting that conclusion must have been shown to the reader in earlier chapters.
- FAIR PLAY REVELATION SPACING: In the discriminating test scene, the detective can ONLY use clues that were revealed to the reader at least 1 full chapter earlier. Never introduce new clues or withheld information during the test.
- FAIR PLAY CONFRONTATION: During the final confrontation/revelation, the detective cannot surprise the reader with facts. Every piece of evidence cited must have been visible to the reader in prior chapters.
- Never solve by withheld information. Keep reader-information parity with detective reasoning.
- False assumption in force: Beatrice Quill died from a sudden illness caused by her pre-existing condition.
- Hidden truth to progressively expose (compose in your own words from these elements): true, cause, carefully, administered, poison, exploiting, trust, friend
- Inference path checkpoints to dramatize clearly — compose ENTIRELY in your own sentences from these key terms (reproducing any briefing phrase verbatim FAILS validation):
  - Step 1: obs: cocktail, glass, beatrice, room, shows, residue, plant, toxin | corr: presence, toxin, indicates, foul, play, contradicting, assumption, natural, illness | effect: narrows, suspect, pool, suggesting, death, health
  - Step 2: obs: witnesses, confirm, beatrice, last, seen, drinking, favorite, cocktail | corr: drink, last, item, consumed, before, symptoms, appeared, identifying, time, poisoning | effect: eliminates, possibility, poisoned, earlier
  - Step 3: obs: chemistry, book, finch, possession, discusses, properties, poison, beatrice, glass | corr: finch, knowledge, poison, indicates, premeditation, since, access, toxin | effect: narrows, suspect, pool, down, finch
- Discriminating test method: trap
- Discriminating test elements to dramatize (compose ENTIRELY in your own sentences from these — do NOT reproduce any briefing phrase verbatim): discriminating, compares, suspect, cocktail, residue, claimed, timeline
- Test must rely on already-shown clue IDs: clue_culprit_direct_1, clue_mechanism_visibility_core, clue_1, clue_culprit_direct_dr_mallory_finch
- Fair-play rationale: Step 1: The cocktail glass residue and Beatrice's health diary reveal a discrepancy between her health and the cause of death. Step 2: Witness testimonies confirm the timeline of Beatrice's last drink, eliminating the possibility of an earlier poisoning. Step 3: The chemistry book establishes Dr. Finch's premeditated involvement, which is revealed during the discriminating test.

## Character Reference

### Eleanor Voss (she/her — NEVER he/him)
Eleanor speaks with a measured tone, often weaving in sharp observations about the people around her
She has a tendency to use metaphors drawn from literature and art, which can sometimes obscure her point.
Eleanor grapples with the guilt of her past affair with the victim, fearing that her secrets may come to light and ruin her career.
Voice colour: Eleanor Voss uses dry wit humour — let it surface in their dialogue where natural, not in every line.

### Dr. Mallory Finch (she/her — NEVER he/him)
Finch speaks in a measured, clinical tone, often using medical jargon even in casual conversation
Her sentences are precise, reflecting her commitment to her profession, but there is an underlying tension in her voice when discussing the victim.
Dr. Finch struggles with the ethical implications of her financial disputes, fearing that her professional integrity may be compromised.

### Captain Ivor Hale (he/him — NEVER she/her)
Ivor speaks in a warm, booming voice that commands attention, often punctuating his stories with self-deprecating humor
He has a tendency to digress into naval anecdotes, making his conversations feel both nostalgic and lengthy.
Ivor is torn between protecting his family's honor and the moral obligation to reveal the truth about the victim's past.

### Sylvia Trent (she/her — NEVER he/him)
Sylvia speaks with a polished, confident tone, often using sophisticated vocabulary
Her sentences are laced with sarcasm, and she has a knack for turning compliments into veiled insults.
Sylvia wrestles with the fear that her ambition has led her down a treacherous path, questioning whether the price of success is worth the risk of exposure.
Voice colour: Sylvia Trent uses polite savagery humour — let it surface in their dialogue where natural, not in every line.

### Hugo Vane (he/him — NEVER she/her)
Hugo speaks with a smooth, charismatic tone, often punctuating his statements with sardonic humor
He has a flair for the dramatic, using grand gestures and a commanding presence to captivate his audience.
Hugo struggles with the fear that his ruthless ambition may lead to his downfall, questioning whether his wealth is worth the cost of his integrity.
Voice colour: Hugo Vane uses sardonic humour — let it surface in their dialogue where natural, not in every line.


## CHARACTER CONTRACTS (binding for this scene)
Each entry below constrains how this character must be written in this chapter.
These override generic style guidance when they conflict.

### Eleanor Voss[SHE]
Voice & mannerisms: Eleanor speaks with a measured tone, often weaving in sharp observations about the people around her. She has a tendency to use metaphors drawn from literature and art, which can sometimes obscure her point.
SIGNATURE TIC (use sparingly — this is Eleanor Voss's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "Ah, the irony of it all."
Sample voice fragments (match this register and rhythm):
  [comfortable] "Ah, the irony of it all; life has a way of making fools of us all."
  [evasive] "I suppose we all have our reasons, but some stories are better left untold."
Humour: dry wit — deploy occasionally (level 0.5)
FORBIDDEN phrase (never write for Eleanor Voss): "a surge of determination washed over her"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Eleanor feels compelled to uncover the truth about the victim's death, driven by her guilt over the past." — do not surface in Act I.

### Dr. Mallory Finch[SHE]
Voice & mannerisms: Dr. Finch speaks in a measured, clinical tone, often using medical jargon even in casual conversation. Her sentences are precise, reflecting her commitment to her profession, but there is an underlying tension in her voice when discussing the victim.
SIGNATURE TIC (use sparingly — this is Dr. Mallory Finch's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "I’m afraid that’s not how the body works."
Sample voice fragments (match this register and rhythm):
  [comfortable] "Every patient is a puzzle; it’s just a matter of finding the right pieces."
  [evasive] "I’m afraid that’s not how the body works; perhaps it's best to focus on what we know."
Humour: none — this character plays it straight in all scenes
FORBIDDEN phrase (never write for Dr. Mallory Finch): "sighed deeply and felt a sense of peace"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Financial loss and the victim's refusal to reimburse her led to a heated argument." — do not surface in Act I.

### Captain Ivor Hale[HE]
Voice & mannerisms: Ivor speaks in a warm, booming voice that commands attention, often punctuating his stories with self-deprecating humor. He has a tendency to digress into naval anecdotes, making his conversations feel both nostalgic and lengthy.
SIGNATURE TIC (use sparingly — this is Captain Ivor Hale's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "There’s honor in the sea, and I’ve sailed through my share of storms."
Sample voice fragments (match this register and rhythm):
  [comfortable] "There’s honor in the sea, and I’ve sailed through my share of storms."
  [evasive] "Well, let’s just say the past is best left in the depths."
Humour: self deprecating — deploy rarely (level 0.3)
FORBIDDEN phrase (never write for Captain Ivor Hale): "she knew with certainty she was right"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Protecting his family's name, he felt he had to keep the victim silent about her past indiscretions." — do not surface in Act I.

### Sylvia Trent[SHE]
Voice & mannerisms: Sylvia speaks with a polished, confident tone, often using sophisticated vocabulary. Her sentences are laced with sarcasm, and she has a knack for turning compliments into veiled insults.
SIGNATURE TIC (use sparingly — this is Sylvia Trent's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "Art is subjective, darling."
Sample voice fragments (match this register and rhythm):
  [comfortable] "Art is subjective, darling; it’s all about perception, isn’t it?"
  [evasive] "I’m afraid I can’t comment on that; it’s all rather delicate."
Humour: polite savagery — deploy frequently (level 0.7)
FORBIDDEN phrase (never write for Sylvia Trent): "she felt a wave of unease"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Sylvia feared exposure of her dealings and wanted the victim to pay a hefty sum to keep quiet." — do not surface in Act I.

### Hugo Vane[HE]
Voice & mannerisms: Hugo speaks with a smooth, charismatic tone, often punctuating his statements with sardonic humor. He has a flair for the dramatic, using grand gestures and a commanding presence to captivate his audience.
SIGNATURE TIC (use sparingly — this is Hugo Vane's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "It’s all about the bottom line."
Sample voice fragments (match this register and rhythm):
  [comfortable] "It’s all about the bottom line; one must know how to play the game."
  [evasive] "Let’s not dwell on past mistakes; the future is what truly matters."
Humour: sardonic — deploy occasionally (level 0.6)
FORBIDDEN phrase (never write for Hugo Vane): "palpable tension filled the room"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Hugo stood to lose a lucrative contract that the victim threatened to reveal." — do not surface in Act I.



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

Primary Location: The Tidal Veil Hotel (Bournemouth, England)
A vintage seaside hotel with art deco charm, hosting anxious guests amid recent unsettling events.

Key Locations Available:
- Oceanview Suite (interior): Crime scene
- Grand Lobby (interior): Gathering space
- Dining Room (interior): Dining and socializing space
- Staff Kitchen (interior): Food preparation and staff area

Atmosphere (tonal cue only — do NOT reproduce this phrase verbatim in prose; translate into scene-specific, character-observed sensory language): tense and suspenseful, as guests are on edge due to recent events
Weather: overcast with occasional rain, typical of coastal climates

Era markers: art deco architecture | vintage automobiles parked outside | a radio playing in the lobby

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
Oceanview Suite (interior):
  - Visual: tattered curtains blowing in the wind, scattered belongings on the floor, a broken vase on the marble table
  - Sounds: howling wind outside, the crash of waves below, distant thunder rumbling
  - Scents: salt and damp air, faint whiff of perfume, old leather and varnish
  - Touch: cold marble underfoot, rough fabric of the armchair

Grand Lobby (interior):
  - Visual: gleaming chandeliers overhead, vibrant floral arrangements, marble flooring reflecting light
  - Sounds: murmurs of conversation, the crackle of a radio, footsteps echoing on the marble
  - Scents: fresh flowers and polish, old books and leather, cigarette smoke lingering
  - Touch: smooth marble underfoot, plush upholstery of armchairs

Dining Room (interior):
  - Visual: elegantly laid tables, glittering glassware, ocean waves crashing outside
  - Sounds: clattering of cutlery, soft murmur of conversations, the distant sound of waves
  - Scents: savory scents of roasted meats, freshly baked bread, the sweetness of dessert
  - Touch: smooth tablecloths, cool metal cutlery

⛔ REFERENCE DATA — DO NOT TRANSCRIBE VERBATIM: The above profiles are structural guides only. Generate original prose that evokes these qualities; do not reproduce the exact phrasing or sentence structure of the profile paragraphs.

SCENE OPENING RULE: When opening a scene in a new location, write what the POV character directly observes and physically senses at that moment — not a general description of the room's qualities. The reader must feel present, not briefed. Sensory details must be observed by the character, not stated as fact about the place.

SENSORY WRITING TECHNIQUES:
- Opening paragraphs: Lea
[truncated for prompt budget]

## Texture Pool
Draw on these as opportunities arise — you are not required to use them.

- In July 1941, the world is steeped in the complexities of war, with shadows of global conflict looming over daily life
- The atmosphere is thick with uncertainty as the aftermath of World War II shifts societal norms, particularly regarding gender roles and class structures
- In the seaside town where The Tidal Veil Hotel stands, the weather mirrors the somber mood, with overcast skies and occasional rain adding to the sense of unease
- Guests at the hotel carry with them the weight of their personal struggles, reflecting the broader anxieties of a society grappling with the realities of war, rationing, and the changing landscape of human relationships
- Life continues, but with an undercurrent of tension that colors every interaction and decision.

TEMPORAL CONTEXT:

This story takes place in July 1941 during summer.

Seasonal Atmosphere:
- Weather patterns: overcast with occasional rain, cool coastal breezes, intermittent fog rolling in from the sea
- Daylight: Long days with sunlight piercing through the clouds, daylight stretching until nine in the evening.
- Seasonal activities: strolling along the beach, attending outdoor concerts, participating in community fairs
- Seasonal occasions: Independence Day (July 4th)
- Season: summer

Period Fashion (describe naturally):
- Men formal: double-breasted navy blazer, lightweight wool trousers, crisp white dress shirt
- Men casual: seersucker shorts, polo shirts, linen button-downs
- Men accessories: straw boater hat, leather sandals, silk ties with nautical motifs
- Women formal: elegant tea-length dress with floral prints, fitted blazer in pastel shades, pearl necklace
- Women casual: sleeveless blouse paired with high-waisted shorts, light cotton sundress, capri pants
- Women accessories: wide-brimmed sun hat, canvas handbag, colorful silk scarves

Cultural Context (reference naturally):
- Music/entertainment: Glenn Miller's 'In the Mood', Bing Crosby's 'White Christmas', Duke Ellington's 'Take the 'A' Train'; Films: 'The Maltese Falcon', 'That Hamilton Woman'; Theatre: Broadway shows featuring wartime themes, musicals celebrating American spirit; Radio: 'The Shadow', 'Amos 'n' Andy'
- Typical prices: Loaf of bread: four pence, Movie ticket: one shilling, A pint of milk: six pence
- Current events: Germany's invasion of the Soviet Union begins; tensions escalate across Europe; increased military draft for young men in the U.S.
- Literature: 'The Grapes of Wrath' by John Steinbeck | 'The Maltese Falcon' by Dashiell Hammett | 'The Catcher in the Rye' by J.D. Salinger | [detective fiction] | [historical novels] | [war stories]
- Technology: synthesized rubber for military vehicles | improvements in radar technology | early developments in television broadcasting | batteries for radios | manual typewriters | film cameras
- Daily life: family picnics at the beach, evening strolls along the boardwalk, community dances in local halls
- Social rituals: Sunday family dinners, neighborhood block parties, weekly visits to the local market

Atmospheric Details:
The scent of saltwater mingling with damp earth as rain occasionally patters on the hotel windows. Soft whispers of conversation and the clinking of glasses punctuating the tense atmosphere in the dimly lit lobby. The distant sound of a radio playing a popular tune, underscoring the emotional weight of the moment as guests navigate their fears.

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
- Class indicators: Aristocrats dis
[truncated for prompt budget]

NON-NEGOTIABLE CHAPTER OBLIGATIONS — LOCKED EVIDENCE VALUES (VERBATIM REQUIRED):
The following measured values (times, amounts, measurements) are absolute ground truth. Every time this chapter describes, mentions, or alludes to one — no matter how briefly — it MUST use the exact phrase shown below, character for character. NO paraphrase, approximation, rounding, or synonym is permitted.

FAILURE EXAMPLE: if the locked value is "at thirteen minutes to midnight" and you write "just before midnight" or "around midnight" — that is a HARD FAIL. You must write "at thirteen minutes to midnight". Equally, if the locked value is written in words, such as "ten minutes past eleven", and you convert it to figure-based clock notation — that is also a HARD FAIL. Words stay as words; figure forms are forbidden for word-phrased facts.

CRITICAL — WORD-PHRASED VALUES: If the canonical value is written out in words (e.g. a time like "ten minutes past eleven", or an amount like "forty minutes"), reproduce those exact words. DO NOT convert to figure-based time notation, twenty-four-hour format, or any other numeric shorthand. Correct: "ten minutes past eleven". WRONG: figure-based clock notation or numeric shorthand.

Locked values:
  - The victim's drink had a pH level of five.: "five"
  - The victim died at ten minutes past nine in the evening.: "ten minutes past nine"
    ⛔ FORBIDDEN alternatives: "9:10", "9.10", "nine ten", "nine-ten", "nine past ten", "quarter past nine", "half past nine" — the ONLY acceptable form is "ten minutes past nine"
  - The amount of poison used was two ounces.: "two ounces"
  - The poison was administered three hours before the victim's death.: "three hours before death"

If a value has no relevance to this chapter, omit it. But the moment you reference the underlying evidence, only the exact phrase above is acceptable.

⛔ CLUES TO SURFACE IN THESE CHAPTERS — mandatory:
The following evidence MUST be clearly observable to an attentive reader. Do not bury it in atmosphere or passing dialogue. Each clue must be concrete, specific, and noticeable:

• [clue_core_contradiction_chain] witnesses, confirm, beatrice, last, seen, drinking, favorite, cocktail, nine
  Category: testimonial | Criticality: essential | Supports inference step 2
  Points to: beatrice, last, drink, potentially, poisoned

For each clue above: an attentive reader should be able to find, record, and later use it to reason toward the solution.

═══ NARRATIVE STATE (read-only — do not contradict) ═══

LOCKED FACTS — use verbatim whenever this evidence is described:
  • The victim's drink had a pH level of five.: "five"
  • The victim died at ten minutes past nine in the evening.: "ten minutes past nine"
  • The amount of poison used was two ounces.: "two ounces"
  • The poison was administered three hours before the victim's death.: "three hours before death"

CHARACTER PRONOUNS — never deviate from these:
  • Eleanor Voss: she/her/her
  • Dr. Mallory Finch: she/her/her
  • Captain Ivor Hale: he/him/his
  • Beatrice Quill: she/her/her
  • Sylvia Trent: she/her/her
  • Hugo Vane: he/him/his

CLUES ALREADY REVEALED TO READER: clue_mechanism_visibility_core — do not reveal these as new information.

INVESTIGATION LOG — WHAT IS ESTABLISHED (do not re-establish, do not repeat):
• Evidence already established (reference only — do NOT restate or quote these; advance beyond them): cocktail, glass, contains, poisoning
• Suspect cleared: Captain Ivor Hale[HE] — Confirmed actions during the critical time frame.
• Suspect cleared: Hugo Vane[HE] — Witnesses confirm he was with another guest during the time.
⚠ The story must move FORWARD from this log. Any beat already listed above is forbidden from repeating.

⚠ THIS CHAPTER'S REQUIRED ADVANCE (opening): Discover the body, confirm the victim, establish the scene. The victim is found dead. They do not speak, react, or gesture. This is their only physical appearance — in all subsequent chapters they exist only in past tense (memory, evidence, testimony).

CONTINUITY HANDOFF — previous chapter closing beat:
  • "As she stepped back, Eleanor caught her own reflection in the tarnished mirror above the dresser: a woman marked by war and loss, yet unwilling to let another truth slip beneath the tidal veil. The investigation had begun, and already the first contradiction h..."
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
lobby

✓ RULE: Continue using this location vocabulary. Maintain consistency with established setting type.
✓ Do NOT introduce new location types that contradict earlier chapters.

**Recent Chapter Summary (for narrative continuity):**
Chapter 1: Chapter 1: The Gathering Veil
  Events: Eleanor Voss pressed her gloved hand against the chipped brass handle and pushed open the door to Beatrice Quill's hotel room.

⚠️ **VALIDATION:** Character name mismatches and setting drift are common failure modes.
Double-check every character name against the list above before using it.

**⏱ LOCKED TIME ANCHOR — use verbatim, do not paraphrase:**
Clock time (from the case ground truth): **"The tide schedule indicating low tide at 10 PM."**
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
Known location profile anchors: The Tidal Veil Hotel, Oceanview Suite, Grand Lobby, Dining Room, Staff Kitchen, Beatrice Quill's hotel room
LOCATION NAME CAPITALISATION (HARD REQUIREMENT — validated):
All named locations in your prose MUST use the EXACT capitalisation from the CML profiles.
Canonical forms: "The Tidal Veil Hotel", "Oceanview Suite", "Grand Lobby", "Dining Room", "Staff Kitchen", "Beatrice Quill's hotel room"
Writing a location in lowercase (e.g. "drawing room" instead of "Drawing Room") is a validated error. Every time you mention a named location, copy its capitalisation from the list above.
- Chapter 2: OPENING STYLE (HARD): Start the VERY FIRST SENTENCE with spoken dialogue — e.g. '"[words]," [Name] said/asked/replied/murmured.' The opening quote must be the first character on the line. Anchor opening in "Beatrice Quill's hotel room". The opening style above governs only your FIRST SENTENCE; the grounding below may land anywhere in the first 2 paragraphs (it need not be sentence one, and never conflicts with the chosen opening style). HARD REQUIREMENT for the first 2 paragraphs: (a) include 2+ sensory words — choose from smell/scent/odor/fragrance/sound/echo/silence/whisper/creak/cold/warm/damp/rough/smooth/glow/shadow/flicker/dim — and (b) include 1+ atmosphere/time word — choose from rain/wind/fog/storm/mist/thunder/evening/morning/night/dawn/dusk/lighting/weather/season/afternoon/midday/noon/midnight/twilight/sunrise/sunset/daylight/sunlight/overcast/cloudy/bright/dark/grey/pale/chill/crisp/drizzle/haze/lamplight/firelight. These are validated requirements, not style suggestions; missing them triggers a retry.

[⚠ INTERNAL QUALITY DIAGNOSTICS — DO NOT REPRODUCE ANY PART OF THIS SECTION IN YOUR STORY OUTPUT. These are private generator observations for your consideration only. Your narrative must read as if this section does not exist. Never include phrases from this block in character dialogue, narration, or description.]

PRIOR CHAPTER QUALITY OBSERVATIONS:
- Chapter 1 (score 98/100):
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

PROMPT BUDGET SUMMARY: budget=24000 tokens; fixed=9381; context=12648; dropped=[none]; truncated=[location_profiles, temporal_context, pronoun_accuracy]

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
4. Integrate at least two concrete era-grounded details per chapter from setting refinement signals: radio | early television | code-breaking devices | long-distance telephone calls | military code systems | telegrams.
5. Respect setting movement/access constraints in scene action and alibis: narrow hallways limit movement | staircases create access restrictions | oceanfront location may complicate escape routes | staff-only areas include the kitchen and maintenance rooms | guest access limited to designated floors.
6. Sustain social coherence with this backdrop pressure: A group of hotel guests and staff are trapped together during a storm, their secrets and tensions rising as they navigate the anxieties of post-war society and the looming threat of a mysterious death.
7. Maintain continuity around these socially central cast anchors where relevant: Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill, Sylvia Trent, Hugo Vane.
8. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Critical: Plot similarity 0.80 with 'The Mysterious Affair at Styles' (same crime type and method).
9. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Moderate: Setting similarity 0.85 with 'The Mysterious Affair at Styles' (same era and hotel setting).
10. STORY TO DATE ANTI-COPY RULE: The STORY TO DATE section below is provided for chronological and factual reference ONLY. You MUST NOT copy, lightly rephrase, or structurally echo any sentence or paragraph from prior chapters. Every sentence in this chapter must be original prose unique to this scene. Reusing even a clause from prior chapter text will cause this attempt to fail immediately.

CRITICAL PROSE REQUIREMENTS:

The CML specifies exact requirements for certain validation-critical scenes. You MUST include these elements at the specified positions.

**Discriminating Test Scene (Act 3, Scene 4):**
Required elements: Execute the discriminating test, Observe the culprit's reaction or result, Draw conclusion about guilt

**Suspect Clearance Scenes:**
- Captain Ivor Hale (Act 3, Scene 5): Confirmed actions during the critical time frame.
  Clues: clue_id_1, clue_id_2
- Hugo Vane (Act 3, Scene 5): Witnesses confirm he was with another guest during the time.
  Clues: clue_id_1, clue_id_2

**Culprit Revelation Scene (Act 3, Scene 6):**
Method: Confrontation with evidence

**Clue Placement for These Chapters:**
- clue_core_contradiction_chain must appear in Act 1, Scene 2 via Witness statement

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
Suspect pressure target(s): Dr. Mallory Finch, Captain Ivor Hale, Hugo Vane
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
  - Scene is set in: Beatrice Quill's hotel room — reference it naturally within the paragraph, never as your opening phrase.
  - Opening atmosphere (MANDATORY — validator enforced): the first paragraph MUST contain at least one of: rain / wind / fog / storm / mist / thunder / evening / morning / night / dawn / dusk / season / afternoon / midday / noon / midnight / twilight / sunrise / sunset / daylight / sunlight / overcast / cloudy / bright / dark / grey / pale / cold / warm / chill / crisp / damp / drizzle / haze / lamplight / firelight. A chapter that omits all of these from its opening paragraph will be rejected.
  - PARAGRAPH OPENER DIVERSITY (MANDATORY — validator enforced): No more than 2 paragraphs in this chapter may begin with "Eleanor" or "Eleanor's" as the first word. You must vary paragraph openings throughout: use sensory observations, another character's name or action, dialogue, object or sound details, or temporal markers. Opening 3 or more paragraphs with "Eleanor" will cause automated rejection.
  - Continuity bridge: in the first 120 words, visibly connect from the previous chapter's final beat. Carry forward one unresolved element (object, accusation, emotional pressure, or immediate physical action) from: "As she stepped back, Eleanor caught her own reflection in the tarnished mirror above the dresser: a woman marked by war and loss, yet unwilling to let another truth slip beneath the tidal veil. The investigation had begu...".
  - CLUE OBLIGATIONS — each clue below MUST be dramatized, but in YOUR OWN WORDS:
    Render each as something a character SEES, DOES, or SAYS on the page. The bracketed text is a
    DESCRIPTION of the evidence for you — do NOT transcribe it as narration. Copying a clue's
    description sentence verbatim into the prose FAILS validation.
    • multiple, witnesses, stating, beatrice, cocktail [clue_core_contradiction_chain] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: beatrice, last, drink, potentially, poisoned
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
  - ALIBI LOCK: Dr. Mallory Finch's established alibi is "between 8 PM and 9 PM". Do NOT place Dr. Mallory Finch at any other location or in any other activity during the crime window. Any contradiction is a continuity error that triggers a retry.
  - TESTIMONY CONTINUITY: Dr. Mallory Finch has already made statements in earlier chapters. Any time, location, or claim attributed to Dr. Mallory Finch in THIS chapter must be consistent with those earlier statements. Do NOT introduce a new or different alibi claim — any contradiction is a continuity error.
- Locked fact phrase obligations:
  - If this batch mentions The victim's drink had a pH level of five., write exactly: "five".
  - If this batch mentions The victim died at ten minutes past nine in the evening., write exactly: "ten minutes past nine".
  - If this batch mentions The amount of poison used was two ounces., write exactly: "two ounces".
  - If this batch mentions The poison was administered three hours before the victim's death., write exactly: "three hours before death".
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
Suspect pressure target(s): Dr. Mallory Finch, Captain Ivor Hale, Hugo Vane
Required new information: Earlier clue gets revised meaning with explicit theory update.
Forbidden reveals at this stage: Do not introduce decisive new evidence from nowhere.

FROZEN FACT STATE (DO NOT ALTER):
- Timeline anchor: July (summer).
- Month, season, weather, and time-of-year language in this batch must stay compatible with summer.
- Established timeline fact: The tide schedule indicating low tide at 10 PM.
- If referenced, use exact phrase: "five" (The victim's drink had a pH level of five.).
- If referenced, use exact phrase: "ten minutes past nine" (The victim died at ten minutes past nine in the evening.).
- If referenced, use exact phrase: "two ounces" (The amount of poison used was two ounces.).
- If referenced, use exact phrase: "three hours before death" (The poison was administered three hours before the victim's death.).

STORY TO DATE (REFERENCE ONLY — DO NOT COPY VERBATIM):
- Full prior chapter text is provided below for continuity, factual consistency, and reference accuracy.
- Use this to keep character voice, chronology, clue state, and location continuity aligned with earlier chapters.
- Do not quote, copy, or paraphrase these paragraphs too closely; write fresh prose that remains consistent with them.

--- BEGIN PRIOR CHAPTER 1 ---
Title: Chapter 1: The Gathering Veil
Eleanor Voss pressed her gloved hand against the chipped brass handle and pushed open the door to Beatrice Quill's hotel room. The air inside was heavy with the scent of damp linen and the faint, cloying trace of perfume that lingered above the underlying salt of the sea. A muted grey light seeped through the tattered curtains, casting long shadows across the rumpled bed and the battered suitcase propped against the wall. The morning was overcast, the wind rattling the windowpanes with a persistent, mournful cadence. On the faded carpet, Beatrice Quill lay motionless, her figure unnaturally still in the hush that had settled over the room.

The silence was punctuated only by the distant crash of waves and the soft creak of floorboards as Eleanor crossed to the bedside. Beatrice Quill's face, usually animated with quick wit and the restless ambition Eleanor had admired, was now a mask of pale serenity. Her hair, meticulously arranged for dinner the night before, had come undone, a few strands clinging to her cheek. On the small table beside her, a cocktail glass caught the dim light, its rim smeared with a faint greenish residue that stood out against the cut crystal. The glass was half-drained, a wedge of lime sunk to the bottom, and a bitter, unfamiliar scent hovered above it. Eleanor felt a chill settle at the base of her spine as she leaned closer, her gaze drawn to the odd discoloration clinging to the inside of the glass—a detail that did not belong in the narrative of a peaceful demise.

‘She’s gone, then?’ Dr. Mallory Finch’s voice, clipped and clinical, broke the hush. Dr. Finch stood near the door, her posture rigid, hands folded tightly at her waist. The starched collar of her white blouse was immaculate, but her eyes flickered to the glass, then away, as if the sight unsettled her more than she wished to admit. Eleanor noted the faint tremor in Dr. Finch’s fingers, a betrayal of nerves at odds with her usual composure. ‘I was called as soon as the maid found her. There was nothing to be done.’

Captain Ivor Hale, the retired naval officer whose presence always seemed to fill a room, stood with his back to the window, his broad shoulders blocking the weak daylight. He wore a navy blazer and pressed trousers, a silk handkerchief tucked into his breast pocket. His gaze was fixed on Beatrice Quill, but his jaw worked silently, and his hand tightened around the chain of his pocket watch. ‘I never thought I’d see the day,’ he said, his voice rougher than usual, the authority in it blunted by grief. ‘She was a bright spark, that girl. Too clever by half, perhaps.’

Hugo Vane lingered near the writing desk, his stance casual but his eyes sharp as they darted from Eleanor to the others. He wore a linen suit, the fabric creased as if he’d slept in it, and his tie was loosened at the throat. Hugo Vane’s fingers drummed an idle rhythm on the desk’s surface, but the effect was ruined by the way his gaze kept returning to the glass on the table. ‘It’s all about the bottom line, isn’t it?’ he murmured, though the bravado in his tone rang hollow. ‘A tragedy, yes, but the show must go on. The hotel can’t afford scandal, not now.’

Sylvia Trent, her arms folded tightly across her chest, stood apart from the group, her back to the door. She wore a tailored pastel dress and a silk scarf knotted at her throat, her posture impeccable despite the tension in her jaw. ‘Art is subjective, darling,’ Sylvia said, her voice brittle, sarcasm barely masking the tremor beneath. ‘But death is so terribly absolute, isn’t it? I suppose we’re all to be questioned now, like characters in a cheap detective novel.’ Her eyes met Eleanor’s for a moment, the challenge in her gaze clear—an invitation to measure, to judge.

Eleanor straightened, her mind already sifting through the details: the untouched plate of biscuits on the dresser, the open window admitting a chill breeze, the cocktail glass with its unnatural residue. She glanced at Dr. Finch, whose gaze lingered on the body before darting away, then at Captain Hale, whose composure seemed to fray with each passing moment. Hugo Vane’s bravado was a mask, poorly fitted, and Sylvia’s sarcasm was a shield. The room, once a sanctuary for Beatrice’s dreams, now felt crowded with secrets.

‘I’ll need to ask you all to remain nearby,’ Eleanor said, her voice measured, the authority in it quiet but unyielding. ‘This is no ordinary passing. I must insist on a careful accounting of last night’s events.’ She moved to the table, careful not to disturb the glass, and studied the residue again. The greenish smear suggested something more than a careless spill—something deliberate, perhaps. She did not voice her suspicion, not yet, but the unease in the room was palpable.

Dr. Finch cleared her throat, her hands now clasped tightly behind her back. ‘If you require my assistance, Miss Voss, I am at your disposal. I examined Beatrice when I arrived. There were… complications, but nothing that would have suggested this.’ Her words were precise, but the evasion was unmistakable. She avoided Eleanor’s eyes, instead focusing on the medical bag she had set by the door.

Captain Hale stepped forward, his voice steadying as he spoke. ‘If you need anything from me, Miss Voss, you have only to ask. Beatrice was like family. I’d see her memory treated with respect.’ He paused, his gaze lingering on the glass, then on Beatrice’s still form. ‘She deserved better than this. Far better.’

Hugo Vane’s lips curled in a sardonic half-smile. ‘I suppose we’re all suspects now, aren’t we? I was in the lobby most of the evening, if anyone cares. The war’s bad enough for business without this sort of thing.’ His tone was flippant, but the tension in his shoulders betrayed him. He glanced at Sylvia, who offered him a withering look in return.

Sylvia’s reply was as sharp as the cut of her dress. ‘Some of us have more to lose than others, Mr. Vane. But I assure you, I was nowhere near this room last night. I prefer my tragedies on the stage, not in life.’ She turned away, but not before Eleanor caught the flicker of uncertainty in her eyes.

Eleanor let the silence settle, absorbing the undercurrents that swirled through the room. The overcast morning pressed against the windows, the sound of distant thunder rolling in from the sea. She drew a notebook from her bag—a battered relic of her reporting days—and began to jot down observations. The cocktail glass, the residue, the position of the body: each detail a thread to be followed.

Beatrice Quill’s ambitions had always outpaced the confines of The Tidal Veil Hotel, and Eleanor felt the weight of responsibility settle on her shoulders. She was the investigator now, the one tasked with untangling the web of secrets that had ensnared Beatrice. The others watched her, some with hope, others with suspicion, but all united by the knowledge that the truth, whatever it was, would not be kind.

The room seemed to shrink around them, the walls closing in with the promise of revelation. Outside, the wind howled, rattling the panes, and the scent of salt and rain crept in through the cracks. Eleanor closed her notebook, her gaze returning once more to the cocktail glass—a silent witness to the final moments of Beatrice Quill’s life. Whatever story the residue told, it was one she intended to hear in full.

As she stepped back, Eleanor caught her own reflection in the tarnished mirror above the dresser: a woman marked by war and loss, yet unwilling to let another truth slip beneath the tidal veil. The investigation had begun, and already the first contradiction had surfaced—Beatrice Quill’s death was not the quiet passing of a sickly heart, but something altogether more deliberate. The glass on the table, with its greenish stain, would not let her forget it.
--- END PRIOR CHAPTER 1 ---

[SCENE COMPLETENESS CONTRACTS — MANDATORY. Each contract below lists what you MUST enact in that chapter. Do not summarise or mention these labels in the prose — enact them organically.]
Chapter 2 (Act 1) completeness contract:
  PIVOT ELEMENT (MANDATORY — write this into the prose, shown not told): "Witnesses confirm Beatrice was last seen drinking her favorite cocktail at nine PM."
  FACT ESTABLISHED (MANDATORY — reader must know this by chapter end): "Establishes that the time of death contradicts the alibis provided by the suspects."

# Case Overview
Title: Beneath the Tidal Veil
Era: 1940s
Setting: Seaside Hotel
Crime: murder (delayed-action poison)
Culprit: Dr. Mallory Finch
Victim: Beatrice Quill
False assumption: Beatrice Quill died from a sudden illness caused by her pre-existing condition.
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
      "location": "Beatrice Quill's hotel room",
      "timeOfDay": "Morning after the murder",
      "atmosphere": "Tense, filled with uncertainty"
    },
    "characters": [
      "Eleanor Voss",
      "Dr. Mallory Finch",
      "Captain Ivor Hale",
      "Hugo Vane",
      "Sylvia Trent"
    ],
    "purpose": "Reveal initial reactions and contradictions",
    "cluesRevealed": [
      "clue_core_contradiction_chain"
    ],
    "dramaticElements": {
      "conflict": "Suspects begin to clash over their accounts.",
      "tension": "Each suspect seems to have a different story.",
      "microMomentBeats": [
        "Eleanor catches Dr. Finch fidgeting nervously as she speaks."
      ]
    },
    "summary": "Eleanor questions the suspects about their last interactions with Beatrice. Dr. Mallory Finch expresses shock, while Captain Ivor Hale and Hugo Vane provide conflicting timelines. Sylvia Trent appears anxious, and Eleanor notices the discrepancies in their stories, hinting at deeper issues.",
    "beat": "crime",
    "estimatedWordCount": 1800,
    "pivotElement": "Witnesses confirm Beatrice was last seen drinking her favorite cocktail at nine PM.",
    "factEstablished": "Establishes that the time of death contradicts the alibis provided by the suspects.",
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
        "characterName": "Captain Ivor Hale",
        "behaviour": "Show normal social behaviour; grief or confusion if appropriate."
      },
      {
        "characterName": "Hugo Vane",
        "behaviour": "Show normal social behaviour; grief or confusion if appropriate."
      },
      {
        "characterName": "Sylvia Trent",
        "behaviour": "Show normal social behaviour; grief or confusion if appropriate."
      }
    ],
    "redHerringPlacement": null,
    "emotionalRegister": "The investigation starts, revealing the complexity of relationships among the guests.",
    "dominantCharacterNote": {
      "name": "Eleanor Voss",
      "voiceRegister": "Eleanor has a measured tone, often weaving sharp observations into her speech."
    },
    "humourGuidance": {
      "permission": "permitted",
      "character": "Eleanor Voss",
      "form": "dry_wit"
    },
    "eraTextureNote": "Limited communication due to wartime restrictions and rationing of goods; Travel difficulties exacerbated by the war and ongoing military movements; Heightened security measures affecting access to public spaces and gatherings",
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
□ Chapter 2: the clue [clue_core_contradiction_chain] (witnesses, confirm, beatrice, last, seen, drinking, favorite, cocktail, nine) is placed in the first 25% of the chapter, dramatized in your own words, followed by an explicit inference or suspicion paragraph.
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
