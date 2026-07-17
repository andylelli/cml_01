# Actual Prompt Record

- Run ID: `mystery-1784258290481`
- Project ID: ``
- Timestamp: `2026-07-17T03:25:06.496Z`
- Agent: `Agent9-ProseGenerator-Ch2`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4.1`
- Temperature: `0.42`
- Max Tokens: `4500`
- Attempt: `first`
- Prompt Hash: `19a105af09aaf7ef`

## Message 1 (role=system)

```text
NARRATIVE VOICE: Dr. Mallory Finch[SHE] is the viewpoint character. Unanchored “she/her” or “he/him” without a nearby name refers to Dr. Mallory Finch. Default narrator pronoun: SHE. Never default to “he/his” as the neutral narrator voice unless the POV character is male.

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
- MORAL COMPLEXITY REQUIREMENT: The mechanism of this crime carries a moral gray area: "The culprit's motive stemmed from a desperate need to protect a loved one, leading to unintended consequences." — the culprit reveal and denouement MUST acknowledge this ambiguity. Do not let the ending feel clean or simple. Give the reader at least one moment of uncomfortable sympathy or moral doubt.

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
   - Dr. Mallory Finch: Amateur Sleuth / Civilian Investigator
   - Captain Ivor Hale: Old Flame
   - Beatrice Quill: Insider
   - Sylvia Trent: Defender
   - Hugo Vane: Rival
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

## Era: 1947-06
In June 1947, the remnants of World War II still echo within the lives of everyday people, as they navigate a world transformed by conflict. The coastal town of Brighton, with its grand seaside hotel, serves as a microcosm of post-war society, where the glamour of the past clashes with the stark realities of the present. Men and women, once bound by traditional roles, find themselves redefining their identities in the wake of societal changes. Women increasingly enter the workforce, challenging age-old norms, while families grapple with the lasting effects of loss and displacement. The bustling hotel, filled with whispers and secrets, stands as a testament to the complexities of life, where the desire for connection often masks deeper fears and insecurities.
Emotional register: Amidst the challenges, a collective yearning for stability and connection permeates society.
Physical constraints: Travel is often restricted due to rationing and economic limitations, affecting guest movements. | Communication is limited to letters and phone calls, with long delays in news reaching families. | The weather influences daily life and activities, with overcast skies often leading to indoor gatherings.
Current tensions (weave into background texture): The fallout from World War II continues to shape social dynamics, with women increasingly taking on roles traditionally held by men. | Tensions of the emerging Cold War create an atmosphere of uncertainty and paranoia about the future. | Economic recovery is uneven, leading to disparities in opportunities and a rising inflation rate.
Wartime context — Many veterans are returning home, struggling to reintegrate into civilian life.: Communities are rebuilding, yet the memories of loss and trauma linger in conversations and interactions. Absence effect: The absence of those who served creates a void, as families grapple with grief and the challenges of moving forward.

## Story Theme
The manipulation of truth and perception reveals the fragility of human relationships amidst the shadows of societal change, and reveals that evidence carries ethical weight, forcing characters to choose accountability over social performance when appearances and facts collide.

## Story Emotional Register
Dominant: The overall emotional character of the story is one of tension and intrigue, weaving a complex web of secrets and revelations.

Arc:
The story opens in the Grand Seaside Hotel, where the atmosphere is saturated with the elegance of the 1940s, yet a sense of foreboding hangs in the air. The sudden discovery of Eleanor Voss drowned at the beach during what was believed to be high tide casts a shadow over the festivities, marking the beginning of a tense investigation. As Dr. Mallory Finch delves into the case, the rising unease is palpable; first clues emerge, but each lead unravels more layers of deception, revealing the emotional cost of secrets kept among the guests. A pivotal moment occurs when it becomes clear that the tide schedule may have been tampered with, redirecting the investigation's course. With each revelation, the stakes grow higher, and the characters' pasts intertwine, leading to a dramatic confrontation as truths come to light. As the climax unfolds, the pressure mounts, forcing characters to confront their motivations and desires. In the resolution, the emotional toll of the investigation lingers; relationships are forever altered, and the consequences of their secrets weigh heavily on each character, leaving them to grapple with the cost of their actions in a world still reeling from the effects of war.

The story opens: The hotel exudes elegance, yet an undercurrent of tension sets the stage for the unfolding drama. As the investigation takes shape: As the investigation begins, the emotional stakes rise, revealing hidden motives and fears among the guests. A first key turn arrives: The revelation of tampered tide schedules shifts the investigation's direction, deepening the mystery. At the mid-point of the story: A pivotal moment shifts the focus, revealing the interconnectedness of the characters' secrets.

A second pivot reshapes the course: The culmination of revelations forces characters to confront their pasts and the consequences of their actions. As tension reaches its height:.

## Emotional register at this point in the story
The hotel exudes elegance, yet an undercurrent of tension sets the stage for the unfolding drama.

## Character Portraits (appearance & era)

### Dr. Mallory Finch
Dr. Mallory Finch is a testament to the evolving roles of women in the 1940s, balancing her medical career with the complications of a clandestine affair. Her character reflects the tension between professional duty and personal desires, as she grapples with the emotional weight of her secrets while striving to uphold her reputation in a changing society.
Era intersection: Mallory's internal conflicts mirror the societal shifts of the time, where women assert their independence while navigating the repercussions of their choices.

### Captain Ivor Hale
Captain Ivor Hale represents the lingering effects of war on men, grappling with unresolved feelings for Eleanor and the bitterness of past betrayals. His character reflects the struggles of returning veterans to reconcile their experiences with the expectations of civilian life, embodying the emotional scars left by conflict.
Era intersection: Ivor's quest for redemption illustrates the broader theme of emotional turmoil faced by many veterans as they reintegrate into society.

### Beatrice Quill
Beatrice Quill, an ambitious journalist, captures the drive for success among women in the post-war era. Torn between her desire for a sensational story and her conscience, she navigates the murky waters of ethics and ambition. Her character embodies the challenges women face as they seek to carve out their identities in a male-dominated landscape.
Era intersection: Beatrice's ambition reflects the changing societal norms where women are increasingly assertive in pursuing their goals.

### Sylvia Trent
Sylvia Trent, the hotel owner, grapples with the weight of family legacy amidst financial troubles. Her character illustrates the pressures faced by women in leadership positions during this era, as they navigate societal expectations while striving to protect their businesses and families.
Era intersection: Sylvia's fight for her family's hotel symbolizes the challenges many women face in balancing tradition with modernity.

## Character Voices

### Dr. Mallory Finch (she/her/her)
Dr. Finch speaks with a precision that mirrors her surgical skills, often punctuating her observations with sardonic remarks.
[comfortable] Ah, the human condition, isn't it? Always more complex than we think.
[evasive] I was simply tending to my duties; nothing suspicious about that.
[stressed] This isn't just about Eleanor; it's about everything I've worked for.
Humour: Her dry wit often surfaces in tense moments, providing a sharp contrast to the situation.

### Captain Ivor Hale (he/him/his)
Ivor's gravelly voice carries the weight of his naval past, often infused with a hint of sarcasm.
[comfortable] Aye, the sea teaches you many things, but it doesn't prepare you for betrayal.
[evasive] I was just enjoying a drink, nothing more. Timing can be a tricky thing.
[stressed] It's all coming back to haunt me—the past doesn’t let go so easily.
Humour: Ivor's sardonic humour often masks his inner turmoil.

### Beatrice Quill (she/her/her)
Beatrice's speech is quick and lively, often punctuated by nervous energy.
[comfortable] I’m just a humble journalist, after all, chasing the next big story!
[evasive] Oh, I didn’t see anything unusual—just the usual hotel bustle.
[stressed] What if I cross the line? I can’t let this chance slip away.
Humour: Her self-deprecating humour reveals her insecurities as she navigates the investigation.

### Sylvia Trent (she/her/her)
Sylvia speaks with an air of authority, her voice smooth yet sharp.
[comfortable] Business is a matter of survival, dear. We must do what it takes.
[evasive] I was merely discussing operational matters; nothing that concerns you.
[stressed] Everything is on the line—my family's legacy depends on this.
Humour: Sylvia employs polite savagery, using genteel language to deliver biting critiques.

## Location Registers (scene framing guides)

Grand Lobby: The Grand Lobby is a space filled with tension, where whispers of secrets mingle with the elegant atmosphere, creating an undercurrent of unease. The polished marble floors echo with the footsteps of guests, each carrying hidden motives and unspoken fears, while the distant sound of the ocean serves as a reminder of the storm brewing both outside and within.. Camera angle: Entering this space, the writer should capture the contrast between the hotel's glamour and the emotional turbulence of its inhabitants.. Era: The atmosphere is charged with the complexities of post-war life, where appearances often mask deeper struggles.

Ocean View Dining Room: The Ocean View Dining Room is a stage for both celebration and tension, where the scent of delectable cuisine intertwines with the weight of unspoken words. Guests enjoy their meals against a backdrop of crashing waves, yet beneath the surface, simmering emotions and hidden agendas create a palpable tension, making every toast a potential spark for conflict.. Camera angle: The writer should focus on the juxtaposition of the dining room's elegance and the discomfort of its patrons.. Era: The opulence of the dining room contrasts sharply with the financial struggles many guests face.

Luxury Guest Rooms: The Luxury Guest Rooms exude a sense of tranquility that belies the turmoil outside, yet each room holds its own secrets. As guests retreat to their private sanctuaries, the air thickens with unresolved tension, where the sound of distant waves serves as a reminder of the chaos looming just beyond their doors, pushing them to confront their inner demons.. Camera angle: The writer should delve into the intimate, reflective moments of characters within these rooms, capturing their vulnerabilities.. Era: In this post-war context, the luxury of these rooms stands in stark contrast to the emotional and financial struggles of the guests.

Staff-Only Service Corridor: The Staff-Only Service Corridor is a hidden world filled with hurried footsteps and hushed conversations, where the weight of responsibility hangs heavy in the air. Staff members navigate the narrow passage with a sense of urgency, each carrying the burden of their roles while the walls seem to echo with the secrets of the hotel, creating an atmosphere thick with tension and unspoken truths.. Camera angle: The writer should emphasize the contrast between the visible luxury of the hotel and the unseen labor that sustains it.. Era: This space reflects the behind-the-scenes struggles of those who contribute to the hotel's success while grappling with their own challenges.

## Humour guidance for this story position (opening)
Permission: forbidden
Rationale: The gravity of the crime requires a serious tone.

FAIR-PLAY AND INFERENCE CONTRACT:
- FAIR PLAY CLUE TIMING: Never combine clue discovery and detective deduction in the same chapter. If a clue is first revealed to the reader in chapter N, the detective may only analyze, deduce from, or act on that clue in chapter N+1 or later.
- FAIR PLAY INFORMATION PARITY: The reader must see all clues BEFORE the detective uses them in reasoning. If the detective performs a test or makes a deduction, every piece of evidence supporting that conclusion must have been shown to the reader in earlier chapters.
- FAIR PLAY REVELATION SPACING: In the discriminating test scene, the detective can ONLY use clues that were revealed to the reader at least 1 full chapter earlier. Never introduce new clues or withheld information during the test.
- FAIR PLAY CONFRONTATION: During the final confrontation/revelation, the detective cannot surprise the reader with facts. Every piece of evidence cited must have been visible to the reader in prior chapters.
- Never solve by withheld information. Keep reader-information parity with detective reasoning.
- False assumption in force: Eleanor drowned while swimming during high tide.
- Hidden truth to progressively expose (compose in your own words from these elements): true, tide, level, manipulated, create, alibi
- Inference path checkpoints to dramatize clearly — compose ENTIRELY in your own sentences from these key terms (reproducing any briefing phrase verbatim FAILS validation):
  - Step 1: obs: witness, statements, indicate, eleanor, last, seen, near, beach, time, tide | corr: statements, contradict, tide, tables, suggest, drowned, high | effect: narrows, timeline, eleanor, death
  - Step 2: obs: hotel, logs, indicate, unusual, water, levels, night, eleanor, death | corr: logs, suggest, tampering, tide, levels | effect: eliminates, assumption, drowning, high, tide
  - Step 3: obs: pipes, leading, beach, utility, room | corr: pipes, redirect, water, creating, false, high, tide, scenario | effect: narrows, suspect, access, manipulate, water, flow
- Discriminating test method: trap
- Discriminating test elements to dramatize (compose ENTIRELY in your own sentences from these — do NOT reproduce any briefing phrase verbatim): tide, schedule, hotel, logs, mechanical, reveal, manipulation, water, levels
- Test must rely on already-shown clue IDs: clue_3, clue_5, clue_12, clue_parity_bridge
- Fair-play rationale: All clues, such as the tide tables and water level logs, are presented early, allowing the reader to deduce the manipulation before the final reveal.

## Character Reference

### Dr. Mallory Finch (she/her — NEVER he/him)
Finch spoke with a precision that mirrored her surgical skills, often punctuating her observations with sardonic remarks that revealed her acerbic wit
She had a habit of raising an eyebrow when delivering particularly sharp comments, as if daring her audience to challenge her insights.
Mallory wrestles with the guilt of her affair and the fear of exposure, torn between her professional duty and personal desires.
Voice colour: Dr. Mallory Finch uses dry wit humour — let it surface in their dialogue where natural, not in every line.

### Captain Ivor Hale (he/him — NEVER she/her)
Ivor spoke with a gravelly voice, each word tinged with the salt of the sea
His stories flowed like the tides, punctuated by hearty laughter that often belied the pain lurking beneath
He had a tendency to embellish his tales, but there was an undeniable sincerity behind his bravado.
Ivor struggles with the bitterness of past betrayal while grappling with a desire for redemption and closure.
Voice colour: Captain Ivor Hale uses sardonic humour — let it surface in their dialogue where natural, not in every line.

### Beatrice Quill (she/her — NEVER he/him)
Beatrice's speech was quick and lively, often laced with nervous energy
She had a tendency to punctuate her points with self-deprecating humor, frequently downplaying her ambitions while revealing the intense drive beneath her surface
Her voice was enthusiastic, almost breathless, as if she were always on the brink of the next big scoop.
Beatrice grapples with the ethical implications of her ambition, torn between opportunism and genuine concern for justice.
Voice colour: Beatrice Quill uses self deprecating humour — let it surface in their dialogue where natural, not in every line.

### Sylvia Trent (she/her — NEVER he/him)
Sylvia spoke with an air of authority, her voice smooth and commanding, yet there was an underlying sharpness that hinted at her tenacity
She had a penchant for using genteel language to deliver biting critiques, often leaving her listeners unsure of whether to laugh or cringe.
Sylvia grapples with the fear of losing her family's legacy and the moral implications of her financial decisions.
Voice colour: Sylvia Trent uses polite savagery humour — let it surface in their dialogue where natural, not in every line.


## CHARACTER CONTRACTS (binding for this scene)
Each entry below constrains how this character must be written in this chapter.
These override generic style guidance when they conflict.

### Dr. Mallory Finch[SHE]
Voice & mannerisms: Dr. Finch spoke with a precision that mirrored her surgical skills, often punctuating her observations with sardonic remarks that revealed her acerbic wit. She had a habit of raising an eyebrow when delivering particularly sharp comments, as if daring her audience to challenge her insights.
SIGNATURE TIC (use sparingly — this is Dr. Mallory Finch's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "Ah, the human condition, isn't it?"
Sample voice fragments (match this register and rhythm):
  [comfortable] "Ah, the human condition, isn't it? Always more complex than we think."
  [evasive] "I was simply tending to my duties; nothing suspicious about that."
Humour: dry wit — deploy occasionally (level 0.5)
FORBIDDEN phrase (never write for Dr. Mallory Finch): "a surge of determination washed over her"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Concern over the victim's increasing influence and public revelations about her past." — do not surface in Act I.

### Captain Ivor Hale[HE]
Voice & mannerisms: Ivor spoke with a gravelly voice, each word tinged with the salt of the sea. His stories flowed like the tides, punctuated by hearty laughter that often belied the pain lurking beneath. He had a tendency to embellish his tales, but there was an undeniable sincerity behind his bravado.
SIGNATURE TIC (use sparingly — this is Captain Ivor Hale's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "Aye, the sea teaches you many things."
Sample voice fragments (match this register and rhythm):
  [comfortable] "Aye, the sea teaches you many things, but it doesn't prepare you for betrayal."
  [evasive] "I was just enjoying a drink, nothing more. Timing can be a tricky thing."
Humour: sardonic — deploy occasionally (level 0.6)
FORBIDDEN phrase (never write for Captain Ivor Hale): "palpable tension filled the room"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Resentment over Eleanor's betrayal and fear of being exposed." — do not surface in Act I.

### Beatrice Quill[SHE]
Voice & mannerisms: Beatrice's speech was quick and lively, often laced with nervous energy. She had a tendency to punctuate her points with self-deprecating humor, frequently downplaying her ambitions while revealing the intense drive beneath her surface. Her voice was enthusiastic, almost breathless, as if she were always on the brink of the next big scoop.
SIGNATURE TIC (use sparingly — this is Beatrice Quill's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "I’m just a humble journalist, after all."
Sample voice fragments (match this register and rhythm):
  [comfortable] "I’m just a humble journalist, after all, chasing the next big story!"
  [evasive] "Oh, I didn’t see anything unusual—just the usual hotel bustle."
Humour: self deprecating — deploy occasionally (level 0.4)
FORBIDDEN phrase (never write for Beatrice Quill): "she knew with certainty she was right"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Desperate to uncover secrets for a sensational article that could launch her career." — do not surface in Act I.

### Sylvia Trent[SHE]
Voice & mannerisms: Sylvia spoke with an air of authority, her voice smooth and commanding, yet there was an underlying sharpness that hinted at her tenacity. She had a penchant for using genteel language to deliver biting critiques, often leaving her listeners unsure of whether to laugh or cringe.
SIGNATURE TIC (use sparingly — this is Sylvia Trent's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "Business is a matter of survival, dear."
Sample voice fragments (match this register and rhythm):
  [comfortable] "Business is a matter of survival, dear. We must do what it takes."
  [evasive] "I was merely discussing operational matters; nothing that concerns you."
Humour: polite savagery — deploy occasionally (level 0.5)
FORBIDDEN phrase (never write for Sylvia Trent): "she felt a wave of unease"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Eleanor's investigation could lead to the hotel's financial ruin." — do not surface in Act I.



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

Primary Location: The Seabreeze Hotel (Brighton, England)
A grand seaside hotel with Art Deco elegance, set against the tumultuous backdrop of post-war uncertainty.

Key Locations Available:
- Grand Lobby (interior): Gathering space
- Ocean View Dining Room (interior): Dining space
- Luxury Guest Rooms (interior): Accommodation for guests
- Staff-Only Service Corridor (transitional): Service access for hotel staff

Atmosphere (tonal cue only — do NOT reproduce this phrase verbatim in prose; translate into scene-specific, character-observed sensory language): Tense and suspenseful, influenced by wartime trauma and the uncertainty of post-war life.
Weather: Overcast with occasional rain, typical of coastal climates, affecting visibility and outdoor activities.

Era markers: Ubiquitous radios playing nostalgic tunes | Art Deco furnishings reflecting the pre-war elegance | Men in suits, women in floral dresses | Rationed supplies in dining menus

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
  - Visual: gleaming mosaic floor, ornate glass chandelier, elegantly dressed guests
  - Sounds: murmurs of conversation, clinking of glasses, distant radio music
  - Scents: freshly brewed coffee, blooming jasmine from vases, polished wood and leather
  - Touch: smooth marble underfoot, soft velvet upholstery

Ocean View Dining Room (interior):
  - Visual: panoramic ocean views, elegant table settings, crystal glassware sparkling
  - Sounds: clinking of cutlery, murmurs of conversation, waves crashing outside
  - Scents: roasted meats and fresh seafood, baking bread, herbs and spices
  - Touch: smooth tablecloths, cool glass of water

Luxury Guest Rooms (interior):
  - Visual: elegantly draped windows, ornate mirrors reflecting light, delicate floral arrangements
  - Sounds: the soft whoosh of the sea, muffled conversations from the hallway, distant laughter
  - Scents: fresh linens and cotton, the scent of lavender, sea air wafting in
  - Touch: soft, plush carpets underfoot, cool silk sheets

⛔ REFERENCE DATA — DO NOT TRANSCRIBE VERBATIM: The above profiles are structural guides only. Generate original prose that evokes these qualities; do not reproduce the exact phrasing or sentence structure of the profile paragraphs.

SCENE OPENING RULE: When opening a scene in a new location, write what the POV character directly observes and physically senses at that moment — not a general description of the room's qualities. The reader must feel present, not briefed. Sensory details mus
[truncated for prompt budget]

## Texture Pool
Draw on these as opportunities arise — you are not required to use them.

- In June 1947, the remnants of World War II still echo within the lives of everyday people, as they navigate a world transformed by conflict
- The coastal town of Brighton, with its grand seaside hotel, serves as a microcosm of post-war society, where the glamour of the past clashes with the stark realities of the present
- Men and women, once bound by traditional roles, find themselves redefining their identities in the wake of societal changes
- Women increasingly enter the workforce, challenging age-old norms, while families grapple with the lasting effects of loss and displacement
- The bustling hotel, filled with whispers and secrets, stands as a testament to the complexities of life, where the desire for connection often masks deeper fears and insecurities.

TEMPORAL CONTEXT:

This story takes place in June 1947 during summer.

Seasonal Atmosphere:
- Weather patterns: overcast skies with intermittent rain showers, cool breezes from the nearby coastline, temperatures hovering around 60-70°F
- Daylight: Long summer days with twilight extending into the evening, though visibility is often muted by cloud cover.
- Seasonal activities: visiting seaside piers and enjoying fish and chips, attending local fairs with carnival games, participating in summer evening dances at community halls
- Seasonal occasions: Father's Day (June 15)
- Season: summer

Period Fashion (describe naturally):
- Men formal: double-breasted suits in light fabrics, crisp white dress shirts with wide collars, fedora hats in muted tones
- Men casual: lightweight khaki trousers paired with short-sleeve button-up shirts, sherbet-colored polo shirts, canvas loafers or deck shoes
- Men accessories: silk ties with playful patterns, wristwatches with leather straps, cufflinks with understated designs
- Women formal: tea-length dresses with floral prints, fitted jackets with padded shoulders, wide-brimmed hats adorned with ribbons
- Women casual: sundresses made of cotton in pastel shades, capri pants paired with fitted blouses, comfortable espadrilles for summer outings
- Women accessories: string pearls or simple gold chains, colorful silk scarves tied at the neck, stylish handbags with structured silhouettes

Cultural Context (reference naturally):
- Music/entertainment: Bing Crosby's crooning hits, the upbeat rhythms of big band music, Ella Fitzgerald's jazz standards; Films: It's a Wonderful Life, Gentleman's Agreement; Theatre: The Glass Menagerie by Tennessee Williams, Death of a Salesman by Arthur Miller; Radio: The Jack Benny Program, Suspense, a popular mystery anthology
- Typical prices: Loaf of bread: four pence, Movie ticket: one shilling, Pint of milk: five pence
- Current events: the Marshall Plan is underway, aiding European recovery; growing tensions between the United States and the Soviet Union, marking the height of the Cold War
- Literature: The Catcher in the Rye by J.D. Salinger | The Fountainhead by Ayn Rand | The Old Man and the Sea by Ernest Hemingway | [detective fiction] | [post-war literature exploring trauma and identity] | [romantic novels reflecting changing societal norms]
- Technology: the first commercially available microwave oven | advancements in radar technology for civilian use | the introduction of the first transistor aiding in radio technology | tabletop radios becoming a staple in households | early television sets featuring limited programming | typewriters and carbon paper for business and personal use
- Daily life: family picnics at local parks, visiting the seaside for leisure and relaxation, attending community events and dances
- Social rituals: family Sunday dinners, often including roast meat and seasonal vegetables, neighborhood barbecues during warm evenings

Atmospheric Details:
The scent of saltwater mingled with the earthy aroma of rain-soaked pavement fills the air. The sound of distant thunder rolls as hotel guests shuffle through dimly lit corridors, whispers of uncertainty hanging in the atmosphere. Flickering shadows cast by the golden glow of table lamps create a sense of unease, contrasting with the vibrant summer colors of the season.

FASHION IN
[truncated for prompt budget]

NON-NEGOTIABLE CHAPTER OBLIGATIONS — LOCKED EVIDENCE VALUES (VERBATIM REQUIRED):
The following measured values (times, amounts, measurements) are absolute ground truth. Every time this chapter describes, mentions, or alludes to one — no matter how briefly — it MUST use the exact phrase shown below, character for character. NO paraphrase, approximation, rounding, or synonym is permitted.

FAILURE EXAMPLE: if the locked value is "at thirteen minutes to midnight" and you write "just before midnight" or "around midnight" — that is a HARD FAIL. You must write "at thirteen minutes to midnight". Equally, if the locked value is written in words, such as "ten minutes past eleven", and you convert it to figure-based clock notation — that is also a HARD FAIL. Words stay as words; figure forms are forbidden for word-phrased facts.

CRITICAL — WORD-PHRASED VALUES: If the canonical value is written out in words (e.g. a time like "ten minutes past eleven", or an amount like "forty minutes"), reproduce those exact words. DO NOT convert to figure-based time notation, twenty-four-hour format, or any other numeric shorthand. Correct: "ten minutes past eleven". WRONG: figure-based clock notation or numeric shorthand.

Locked values:
  - The time when the tide was believed to be at its highest.: "ten minutes past eleven"
    ⛔ FORBIDDEN alternatives: "11:10", "11.10", "eleven ten", "eleven-ten", "eleven past ten", "quarter past eleven", "half past eleven" — the ONLY acceptable form is "ten minutes past eleven"
  - The manipulated height difference of the water at the crime scene.: "two feet"
  - The length of the drainage pipe that redirected water.: "thirty yards"

If a value has no relevance to this chapter, omit it. But the moment you reference the underlying evidence, only the exact phrase above is acceptable.

⛔ CLUES TO SURFACE IN THESE CHAPTERS — mandatory:
The following evidence MUST be clearly observable to an attentive reader. Do not bury it in atmosphere or passing dialogue. Each clue must be concrete, specific, and noticeable:

• [clue_core_contradiction_chain] statements, contradict, tide, tables, suggest, drowned, high
  Category: testimonial | Criticality: essential | Supports inference step 1
  Points to: eleanor, drowned, high, tide

For each clue above: an attentive reader should be able to find, record, and later use it to reason toward the solution.

═══ NARRATIVE STATE (read-only — do not contradict) ═══

LOCKED FACTS — use verbatim whenever this evidence is described:
  • The time when the tide was believed to be at its highest.: "ten minutes past eleven"
  • The manipulated height difference of the water at the crime scene.: "two feet"
  • The length of the drainage pipe that redirected water.: "thirty yards"

CHARACTER PRONOUNS — never deviate from these:
  • Eleanor Voss: she/her/her
  • Dr. Mallory Finch: she/her/her
  • Captain Ivor Hale: he/him/his
  • Beatrice Quill: she/her/her
  • Sylvia Trent: she/her/her
  • Hugo Vane: he/him/his

CLUES ALREADY REVEALED TO READER: clue_mechanism_visibility_core — do not reveal these as new information.

INVESTIGATION LOG — WHAT IS ESTABLISHED (do not re-establish, do not repeat):
• Evidence already established (reference only — do NOT restate or quote these; advance beyond them): eleanor, last, known, location, contradicts, high
• Suspect cleared: Captain Ivor Hale[HE] — Witnesses place him in the dining area during the critical timeframe
• Suspect cleared: Beatrice Quill[SHE] — She was on duty and has stable witness accounts.
• Suspect cleared: Sylvia Trent[SHE] — Her alibi is confirmed by multiple guests.
⚠ The story must move FORWARD from this log. Any beat already listed above is forbidden from repeating.

⚠ THIS CHAPTER'S REQUIRED ADVANCE (opening): Discover the body, confirm the victim, establish the scene. The victim is found dead. They do not speak, react, or gesture. This is their only physical appearance — in all subsequent chapters they exist only in past tense (memory, evidence, testimony).

CONTINUITY HANDOFF — previous chapter closing beat:
  • "The morning pressed on, the sun hidden behind thick clouds, casting the beach in a dull, silvery glow. Mallory felt the eyes of the crowd upon her, waiting for answers she did not yet possess. She glanced at Eleanor’s body, the lifeless form that demanded trut..."
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
promenade

✓ RULE: Continue using this location vocabulary. Maintain consistency with established setting type.
✓ Do NOT introduce new location types that contradict earlier chapters.

**Recent Chapter Summary (for narrative continuity):**
Chapter 1: Chapter 1: The Tide's Grim Gift
  Events: Dr.

⚠️ **VALIDATION:** Character name mismatches and setting drift are common failure modes.
Double-check every character name against the list above before using it.

**⏱ LOCKED TIME ANCHOR — use verbatim, do not paraphrase:**
Clock time (from the case ground truth): **"Tide tables showing high tide at the time of death"**
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
Known location profile anchors: The Seabreeze Hotel, Grand Lobby, Ocean View Dining Room, Luxury Guest Rooms, Staff-Only Service Corridor, Brighton beach, near the water's edge
LOCATION NAME CAPITALISATION (HARD REQUIREMENT — validated):
All named locations in your prose MUST use the EXACT capitalisation from the CML profiles.
Canonical forms: "The Seabreeze Hotel", "Grand Lobby", "Ocean View Dining Room", "Luxury Guest Rooms", "Staff-Only Service Corridor", "Brighton beach, near the water's edge"
Writing a location in lowercase (e.g. "drawing room" instead of "Drawing Room") is a validated error. Every time you mention a named location, copy its capitalisation from the list above.
- Chapter 2: OPENING STYLE (HARD): Start the VERY FIRST SENTENCE with spoken dialogue — e.g. '"[words]," [Name] said/asked/replied/murmured.' The opening quote must be the first character on the line. Anchor opening in "Brighton beach, near the water's edge". The opening style above governs only your FIRST SENTENCE; the grounding below may land anywhere in the first 2 paragraphs (it need not be sentence one, and never conflicts with the chosen opening style). HARD REQUIREMENT for the first 2 paragraphs: (a) include 2+ sensory words — choose from smell/scent/odor/fragrance/sound/echo/silence/whisper/creak/cold/warm/damp/rough/smooth/glow/shadow/flicker/dim — and (b) include 1+ atmosphere/time word — choose from rain/wind/fog/storm/mist/thunder/evening/morning/night/dawn/dusk/lighting/weather/season/afternoon/midday/noon/midnight/twilight/sunrise/sunset/daylight/sunlight/overcast/cloudy/bright/dark/grey/pale/chill/crisp/drizzle/haze/lamplight/firelight. These are validated requirements, not style suggestions; missing them triggers a retry.

[⚠ INTERNAL QUALITY DIAGNOSTICS — DO NOT REPRODUCE ANY PART OF THIS SECTION IN YOUR STORY OUTPUT. These are private generator observations for your consideration only. Your narrative must read as if this section does not exist. Never include phrases from this block in character dialogue, narration, or description.]

PRIOR CHAPTER QUALITY OBSERVATIONS:
- Chapter 1 (score 99/100):
  Quality gaps noted: word density below preferred target (957/1000)
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

PROMPT BUDGET SUMMARY: budget=24000 tokens; fixed=8915; context=12379; dropped=[none]; truncated=[location_profiles, temporal_context, pronoun_accuracy]

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
4. Integrate at least two concrete era-grounded details per chapter from setting refinement signals: ubiquitous radios | early television sets (post-war) | basic radar systems | long-distance telephone calls | military-style encrypted messages | telegrams.
5. Respect setting movement/access constraints in scene action and alibis: multiple floors with stair access only | restricted access to staff-only areas | outdoor areas limited by weather conditions | staff-only sections requiring keycards | scheduled cleaning hours limiting access to certain rooms.
6. Sustain social coherence with this backdrop pressure: A group of guests and staff at a grand seaside hotel confront the tensions of post-war life while a mysterious drowning incident stirs suspicions and hidden motives among them.
7. Maintain continuity around these socially central cast anchors where relevant: Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill, Sylvia Trent, Hugo Vane.
8. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Critical: Plot similarity 0.85 with 'The Second Key' (same crime method of drowning and similar temporal investigation)
9. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Moderate: Character similarity 0.75 with 'The Second Key' (similar cast structure and character roles)
10. STORY TO DATE ANTI-COPY RULE: The STORY TO DATE section below is provided for chronological and factual reference ONLY. You MUST NOT copy, lightly rephrase, or structurally echo any sentence or paragraph from prior chapters. Every sentence in this chapter must be original prose unique to this scene. Reusing even a clause from prior chapter text will cause this attempt to fail immediately.

CRITICAL PROSE REQUIREMENTS:

The CML specifies exact requirements for certain validation-critical scenes. You MUST include these elements at the specified positions.

**Discriminating Test Scene (Act 3, Scene 4):**
Required elements: Execute the discriminating test, Observe the evidence of tide manipulation, Draw conclusion about guilt
Test type: tide manipulation evidence

**Suspect Clearance Scenes:**
- Captain Ivor Hale (Act 3, Scene 5): Witnesses place him in the dining area during the critical timeframe
  Clues: clue_id_1, clue_id_2
- Beatrice Quill (Act 3, Scene 5): She was on duty and has stable witness accounts.
  Clues: clue_id_1, clue_id_2
- Sylvia Trent (Act 3, Scene 5): Her alibi is confirmed by multiple guests.
  Clues: clue_id_1, clue_id_2

**Culprit Revelation Scene (Act 3, Scene 6):**
Method: Confrontation with evidence of tide manipulation.

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
- Chapter 2:
  - STRUCTURAL ARCHETYPE — Chapter 2 must be: FIRST_CONTACT
      ✓ MUST contain: at least two suspect interviews
      ✗ MUST NOT contain: physical evidence discovery
  - Word count: Target 1250 words. Achieve this through plot events, dialogue exchanges, and physical investigation — not through atmospheric repetition or extended internal reflection. Each 200-word segment should contain at minimum one concrete story event (a discovery, a conversation exchange, a physical action or movement). Padding with atmosphere alone is not acceptable.
  - Opening: Begin with a character action, spoken line, or clock/time marker — never a location name or location-description phrase.
  - Scene is set in: Brighton beach, near the water's edge — reference it naturally within the paragraph, never as your opening phrase.
  - Opening atmosphere (MANDATORY — validator enforced): the first paragraph MUST contain at least one of: rain / wind / fog / storm / mist / thunder / evening / morning / night / dawn / dusk / season / afternoon / midday / noon / midnight / twilight / sunrise / sunset / daylight / sunlight / overcast / cloudy / bright / dark / grey / pale / cold / warm / chill / crisp / damp / drizzle / haze / lamplight / firelight. A chapter that omits all of these from its opening paragraph will be rejected.
  - PARAGRAPH OPENER DIVERSITY (MANDATORY — validator enforced): No more than 2 paragraphs in this chapter may begin with "Dr." or "Dr.'s" as the first word. You must vary paragraph openings throughout: use sensory observations, another character's name or action, dialogue, object or sound details, or temporal markers. Opening 3 or more paragraphs with "Dr." will cause automated rejection.
  - Continuity bridge: in the first 120 words, visibly connect from the previous chapter's final beat. Carry forward one unresolved element (object, accusation, emotional pressure, or immediate physical action) from: "The morning pressed on, the sun hidden behind thick clouds, casting the beach in a dull, silvery glow. Mallory felt the eyes of the crowd upon her, waiting for answers she did not yet possess. She glanced at Eleanor’s bo...".
  - CLUE OBLIGATIONS — each clue below MUST be dramatized, but in YOUR OWN WORDS:
    Render each as something a character SEES, DOES, or SAYS on the page. The bracketed text is a
    DESCRIPTION of the evidence for you — do NOT transcribe it as narration. Copying a clue's
    description sentence verbatim into the prose FAILS validation.
    • witness, statements, tide, tables [clue_core_contradiction_chain] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: eleanor, drowned, high, tide
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
  - ALIBI LOCK: Hugo Vane's established alibi is "Unaccounted for during the murder". Do NOT place Hugo Vane at any other location or in any other activity during the crime window. Any contradiction is a continuity error that triggers a retry.
  - TESTIMONY CONTINUITY: Hugo Vane has already made statements in earlier chapters. Any time, location, or claim attributed to Hugo Vane in THIS chapter must be consistent with those earlier statements. Do NOT introduce a new or different alibi claim — any contradiction is a continuity error.
- Locked fact phrase obligations:
  - If this batch mentions The time when the tide was believed to be at its highest., write exactly: "ten minutes past eleven".
  - If this batch mentions The manipulated height difference of the water at the crime scene., write exactly: "two feet".
  - If this batch mentions The length of the drainage pipe that redirected water., write exactly: "thirty yards".
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
Suspect pressure target(s): Captain Ivor Hale, Sylvia Trent, Beatrice Quill
Required new information: Earlier clue gets revised meaning with explicit theory update.
Forbidden reveals at this stage: Do not introduce decisive new evidence from nowhere.

FROZEN FACT STATE (DO NOT ALTER):
- Timeline anchor: June (summer).
- Month, season, weather, and time-of-year language in this batch must stay compatible with summer.
- Established timeline fact: Tide tables showing high tide at the time of death
- Established timeline fact: Witness statements claiming the tide was high
- If referenced, use exact phrase: "ten minutes past eleven" (The time when the tide was believed to be at its highest.).
- If referenced, use exact phrase: "two feet" (The manipulated height difference of the water at the crime scene.).
- If referenced, use exact phrase: "thirty yards" (The length of the drainage pipe that redirected water.).

STORY TO DATE (REFERENCE ONLY — DO NOT COPY VERBATIM):
- Full prior chapter text is provided below for continuity, factual consistency, and reference accuracy.
- Use this to keep character voice, chronology, clue state, and location continuity aligned with earlier chapters.
- Do not quote, copy, or paraphrase these paragraphs too closely; write fresh prose that remains consistent with them.

--- BEGIN PRIOR CHAPTER 1 ---
Title: Chapter 1: The Tide's Grim Gift
Dr. Mallory Finch stepped onto Brighton beach, the damp sand yielding beneath her sensible shoes. The morning was overcast, the sky a pale shroud that pressed low against the horizon, and the wind carried the briny scent of salt and seaweed. A chill lingered in the air, despite the promise of summer, and the sound of distant waves merged with the anxious murmurs of the crowd. At the edge of the surf, Eleanor Voss lay lifeless and pale against the sand, her tea-length dress clinging to her form, sodden and torn. The sight was stark—a woman who once moved through the halls of The Seabreeze Hotel with effortless grace now rendered motionless by the sea's indifferent hand.

Dr. Mallory Finch laid the facts out plainly where the others could see them. The record now held: Witness statements indicate eleanor last seen.

That detail shifted the reasoning. Weighed against the rest, Witness statements indicate eleanor last seen bent the trail toward Eleanor last known location contradicts high.

Mallory knelt beside Eleanor Voss, her gloved fingers trembling as she pressed them to Eleanor's wrist, more out of habit than hope. The silence from Eleanor was absolute, broken only by the hush of the waves and the occasional crackle of a radio from the promenade above. Mallory's gaze swept the shoreline, noting the cluster of guests and staff, their faces drawn and pale, eyes flicking between the body and each other. The crowd’s tension was palpable, a collective dread that seemed to thicken the air. Mallory was no stranger to death, but this—here, in the open, under the scrutiny of so many—felt different. She straightened, the weight of expectation settling on her shoulders, and found herself the centre of attention. She was the investigator now; there would be no waiting for a constable from the village, no deference to distant authority. The responsibility was hers.

A fisherman, his jacket stained and his cap pulled low, stepped forward. His voice was rough, edged with uncertainty. 'Saw her near the water, miss. Just before the tide came up. Seemed a bit off, if you ask me. There was a commotion—someone shouting, maybe. Not sure who.' Mallory’s eyes narrowed, noting the way his gaze lingered on the body, then darted to the assembled guests. The fisherman’s account was echoed by others: Eleanor had been seen near the beach, close to the time when the tide was believed to be at its highest—'ten minutes past eleven,' someone whispered, clutching a rationed packet of cigarettes. Yet the details were muddled, the timeline uncertain. The witnesses’ statements offered only fragments, each piece contradicting the last.

Mallory rose, brushing sand from her knees. The crowd’s whispers grew louder, a tide of speculation threatening to overwhelm the facts. She heard snippets—'Eleanor was always reckless,' 'She’d argued with Hugo Vane the night before,' 'Captain Ivor Hale was nowhere to be seen.' Mallory’s mind catalogued each name, each accusation, her professional detachment warring with the personal history she shared with Eleanor. The hotel’s elegance, so carefully maintained, seemed to crumble under the weight of suspicion. Mallory caught Beatrice Quill’s eye; Beatrice, the hotel’s insider, stood rigid, her hands clasped too tightly, as if bracing herself against the storm. Sylvia Trent hovered nearby, her expression unreadable, lips parted as if to speak but never quite finding the words.

A gust of wind sent a spray of salt across Mallory’s cheek, stinging her skin. She turned to Hugo Vane, whose presence loomed at the periphery—his suit immaculate, his gaze fixed on the horizon. Mallory noted the tension in his jaw, the way his hands remained buried in his pockets, refusing to meet her eyes. Captain Ivor Hale arrived late, his stride purposeful, the faint scent of leather and pipe tobacco trailing behind him. He surveyed the scene with a soldier’s discipline, but Mallory caught a flicker of uncertainty in his expression. The cast was assembled, each with their own secrets, each forced to confront the reality of Eleanor’s death.

Mallory’s attention returned to the fisherman’s claim—a struggle near the water’s edge, just before Eleanor went missing. It was a detail that could not be ignored, yet it felt out of place, too convenient. The witnesses’ recollections were coloured by fear and the desire to distance themselves from blame. Mallory pressed the fisherman for specifics, but he hedged, his answers vague. 'Could’ve been anyone,' he muttered, eyes darting to Hugo Vane and then to Beatrice Quill. Mallory sensed the red herring: a possible attack, but nothing concrete. The truth was elusive, submerged beneath layers of uncertainty.

Mallory took a slow breath, letting the salt air fill her lungs. She surveyed the beach, noting the subtle contradictions—Eleanor last seen near the water, the tide’s timing, the muddled statements. The tide tables posted at The Seabreeze Hotel claimed high tide at 'ten minutes past eleven,' yet the witnesses disagreed, their memories unreliable. Mallory’s mind sharpened, the discrepancy settling like a stone in her gut. Someone had seen Eleanor at the beach near the time of the tide, but the details refused to align. It was the first clue, a surface anomaly she could not yet explain.

The morning pressed on, the sun hidden behind thick clouds, casting the beach in a dull, silvery glow. Mallory felt the eyes of the crowd upon her, waiting for answers she did not yet possess. She glanced at Eleanor’s body, the lifeless form that demanded truth. Mallory’s resolve hardened; she would pursue the facts, however slippery. The investigation had begun, and with it, the delicate dance of suspicion and revelation. The sea, indifferent and eternal, whispered its secrets to those willing to listen. Mallory was determined to hear them, no matter how unsettling the tide’s grim gift might prove.
--- END PRIOR CHAPTER 1 ---

[SCENE COMPLETENESS CONTRACTS — MANDATORY. Each contract below lists what you MUST enact in that chapter. Do not summarise or mention these labels in the prose — enact them organically.]
Chapter 2 (Act 1) completeness contract:
  PIVOT ELEMENT (MANDATORY — write this into the prose, shown not told): "The conflicting tide tables and witness statements that contradict each other."
  FACT ESTABLISHED (MANDATORY — reader must know this by chapter end): "Establishes that the witnesses disagree on the tide's state at the time of Eleanor's death, hinting at deeper issues."

# Case Overview
Title: The Tidal Deception
Era: 1940s
Setting: Brighton
Crime: murder (drowning)
Culprit: Hugo Vane
Victim: Eleanor Voss
False assumption: Eleanor drowned while swimming during high tide.
Cast: Eleanor Voss (she/her), Dr. Mallory Finch (she/her), Captain Ivor Hale (he/him), Beatrice Quill (she/her), Sylvia Trent (she/her), Hugo Vane (he/him)

Setting Lock: Keep all scenes and descriptions consistent with the stated setting (Brighton). Do not introduce a different location type. Do not invent an alternative estate name. The only permitted name for this property is "Brighton" — any other estate name (e.g., "Caldwell Manor", "Ashwood Hall", or any invented proper name) is a continuity error that will be caught and rejected.

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
    "title": "Contradictions",
    "setting": {
      "location": "Brighton beach, near the water's edge",
      "timeOfDay": "Morning after the murder",
      "atmosphere": "Heightened tension as witnesses recount their stories"
    },
    "characters": [
      "Dr. Mallory Finch",
      "Captain Ivor Hale",
      "Sylvia Trent",
      "Beatrice Quill"
    ],
    "purpose": "Establish contradictions in witness statements",
    "cluesRevealed": [
      "clue_core_contradiction_chain"
    ],
    "dramaticElements": {
      "conflict": "Witnesses provide conflicting accounts of Eleanor's last known whereabouts.",
      "tension": "Suspicion grows as each person’s story seems to contradict the others.",
      "microMomentBeats": [
        "Captain Hale's hands tremble slightly as he recounts his version of events."
      ]
    },
    "summary": "As Dr. Mallory Finch interviews witnesses at the beach, conflicting accounts emerge about Eleanor's last moments. Captain Ivor Hale claims she was swimming at high tide, while others insist it was low tide. The discrepancies raise more questions than answers.",
    "beat": "crime",
    "estimatedWordCount": 1800,
    "pivotElement": "The conflicting tide tables and witness statements that contradict each other.",
    "factEstablished": "Establishes that the witnesses disagree on the tide's state at the time of Eleanor's death, hinting at deeper issues.",
    "permittedBehavioursByAct": [
      {
        "characterName": "Dr. Mallory Finch",
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
    "redHerringPlacement": null,
    "emotionalRegister": "As the investigation begins, the emotional stakes rise, revealing hidden motives and fears among the guests.",
    "dominantCharacterNote": {
      "name": "Dr. Mallory Finch",
      "voiceRegister": "Dr. Finch speaks with a precision that mirrors her surgical skills, often punctuating her observations with sardonic remarks."
    },
    "humourGuidance": {
      "permission": "forbidden"
    },
    "eraTextureNote": "Travel is often restricted due to rationing and economic limitations, affecting guest movements.; Communication is limited to letters and phone calls, with long delays in news reaching families.; The weather influences daily life and activities, with overcast skies often leading to indoor gatherings.",
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
□ Chapter 2: the clue [clue_core_contradiction_chain] (statements, contradict, tide, tables, suggest, drowned, high) is placed in the first 25% of the chapter, dramatized in your own words, followed by an explicit inference or suspicion paragraph.
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
