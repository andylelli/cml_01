# Actual Prompt Record

- Run ID: `mystery-1784752665289`
- Project ID: ``
- Timestamp: `2026-07-22T20:45:10.215Z`
- Agent: `Agent9-ProseGenerator-Ch2`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4.1`
- Temperature: `0.42`
- Max Tokens: `4500`
- Attempt: `first`
- Prompt Hash: `a756a7aff0ca8004`

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
- MORAL COMPLEXITY REQUIREMENT: The mechanism of this crime carries a moral gray area: "The murderer believed they were avenging a wrong done to them by the victim, complicating the morality of their actions." — the culprit reveal and denouement MUST acknowledge this ambiguity. Do not let the ending feel clean or simple. Give the reader at least one moment of uncomfortable sympathy or moral doubt.

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
   - Captain Ivor Hale: War Veteran
   - Beatrice Quill: Free Spirit
   - Sylvia Trent: Traditionalist
   - Hugo Vane: Heartbreaker
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

## Era: 1948-09
In September 1948, the seaside town is in the midst of post-war recovery, with the community trying to navigate the changing social dynamics, particularly regarding gender roles and the looming fear of communism. The foggy weather mirrors the uncertainties that surround personal and political lives, with people grappling with their identities in a rapidly evolving society. Daily life is marked by a blend of traditional values and emerging modernity; the economy is recovering, but inflation looms large, and social tensions simmer under the surface. This era is characterized by a struggle between the past and future, where every interaction is tinged with the anxiety of what lies ahead.
Emotional register: A dominant sense of anxiety and uncertainty permeates the community as they navigate the complexities of post-war life.
Physical constraints: Limited transportation options due to post-war shortages | Communication often reliant on letters and telegrams | Social gatherings still constrained by wartime etiquette and norms | Rationing affecting food and resources
Current tensions (weave into background texture): Escalating Cold War tensions in Europe | The rise of labor movements advocating for workers' rights | Debates over women's roles in the workforce
Wartime context — Many locals are veterans adjusting to civilian life, often dealing with psychological scars.: A blend of camaraderie and suspicion, as people are wary of the changes within their community. Absence effect: The absence of those lost in the war creates a haunting reminder of sacrifice, influencing the emotional landscape.

## Story Theme
The investigation into Dr. Mallory Finch's drowning reveals the complexities of human emotions and societal pressures in a post-war world, where secrets and jealousy intertwine beneath the surface.

## Story Emotional Register
Dominant: A tense and suspenseful atmosphere, marked by underlying currents of uncertainty and emotional complexity.

Arc:
The story begins with an air of sophistication and elegance at The Tides Hotel, where Dr. Mallory Finch's unexpected drowning casts a shadow over the post-war recovery conference. The initial investigation reveals a web of relationships fraught with jealousy and hidden motives, as Eleanor Voss, a dedicated journalist, seeks to uncover the truth. As she delves deeper, the rising tide of suspicion and the first clues lead to an emotional cost, revealing vulnerabilities among the guests. The investigation takes a pivotal turn as Eleanor discovers contradictions in the timeline, forcing her to confront her feelings for Captain Ivor Hale, whose charm masks deeper insecurities. Midway through, a revelation uncovers the emotional complexities of the suspects, changing the direction of the investigation. The stakes escalate as Eleanor pieces together the evidence, mounting pressure leading to a climactic confrontation. In the resolution, the emotional toll of the investigation weighs heavily on each character, forcing them to reckon with their pasts and the truths they uncover about themselves and one another.

The story opens: The story opens with a sense of elegance, quickly overshadowed by the shock of the murder. As the investigation takes shape: Initial unease grows as relationships are scrutinized, revealing hidden tensions. A first key turn arrives: A pivotal discovery shifts Eleanor's focus, deepening her emotional involvement. At the mid-point of the story: Revelations about the suspects' motives create a more complex emotional landscape.

A second pivot reshapes the course: A key piece of evidence alters the course of the investigation, intensifying the stakes. As tension reaches its height: Mounting pressure leads to a confrontation where truths are revealed. The climax brings the central question to a head: The climax is charged with tension as the murderer is confronted. In the final resolution: The aftermath leaves lasting emotional scars on.

## Emotional register at this point in the story
The story opens with a sense of elegance, quickly overshadowed by the shock of the murder.

## Character Portraits (appearance & era)

### Eleanor Voss
Eleanor Voss stands as a reflection of the evolving gender roles of the 1940s, embodying the struggle for women to assert their voices in a male-dominated society. Her career as a journalist places her at the forefront of social change, yet her feelings for Captain Hale complicate her journey.
Era intersection: Eleanor's ambition to uncover the truth mirrors the broader societal shifts as women begin to reclaim their narratives in a post-war world.

### Captain Ivor Hale
Captain Ivor Hale embodies the conflicted masculinity of post-war veterans, grappling with guilt over past decisions and the pressure to maintain his reputation amidst societal shifts. His charm is undercut by the weight of expectation.
Era intersection: Ivor's character reflects the societal pressure on men to be both strong and vulnerable in a time of significant change.

### Beatrice Quill
Beatrice Quill symbolizes the emerging voice of women artists in the 1940s, navigating the complexities of love and ambition. Her jealousy and passion for Hugo illustrate the emotional turmoil of an artist in a changing world.
Era intersection: Beatrice's artistic aspirations highlight the struggle for women to carve out their identities amidst societal expectations.

### Sylvia Trent
Sylvia Trent represents the older generation clinging to traditional values, deeply invested in her hotel's legacy. Her authority is challenged by the rising influence of younger patrons and changing social norms.
Era intersection: Sylvia's fears of losing control over her establishment mirror the broader societal anxieties about maintaining relevance in a rapidly evolving world.

### Hugo Vane
Hugo Vane stands at a crossroads, embodying the allure and pitfalls of romantic entanglements in a post-war society. His charm belies the internal conflict of balancing his desires with societal expectations.
Era intersection: Hugo's character illustrates the complexities of relationships in a time of social upheaval, where personal desires clash with public perception.

## Character Voices

### Eleanor Voss (she/her/her)
Eleanor's voice is measured and observant, often laced with sharp insights that reflect her journalistic background.
[comfortable] You know, the truth always has a way of surfacing, doesn't it?
[evasive] Well, it’s not that simple; there are layers to every story.
[stressed] I can’t shake the feeling that something is terribly wrong here.
Humour: Her humour is observational, providing insight into her keen perceptions.

### Captain Ivor Hale (he/him/his)
Ivor's voice is direct and commanding, reflecting his military background and no-nonsense attitude.
[comfortable] It’s all about the mission, isn’t it?
[evasive] Look, I was busy; I can't account for every minute.
[stressed] This is not the time for doubt; we need to stay focused!
Humour: His blunt humour often lacks subtlety, reflecting his straightforward nature.

### Beatrice Quill (she/her/her)
Beatrice's voice is flowing and creative, rich in metaphor, reflecting her artistic soul.
[comfortable] Ah, the irony of it all! Art imitates life, doesn't it?
[evasive] It’s complicated; emotions can be a messy palette.
[stressed] I can’t let this ruin my work; I need to focus!
Humour: Her sardonic humour adds depth to her artistic perspective.

### Sylvia Trent (she/her/her)
Sylvia's voice is firm and authoritative, reflecting her commanding presence.
[comfortable] We must uphold the standards of this establishment.
[evasive] I don’t see why that’s relevant to our current discussion.
[stressed] We cannot afford any more disruptions during this critical time!
Humour: Sylvia does not employ humour, focusing on her serious demeanor.

### Hugo Vane (he/him/his)
Hugo's voice is charming and easy-going, often disarming with self-deprecating humour.
[comfortable] Well, that’s life, isn’t it? Full of unexpected turns.
[evasive] I wouldn’t worry too much; things have a way of working out.
[stressed] I didn’t mean for it to get this complicated; trust me!
Humour: His self-deprecating humour helps mask the tension he feels.

## Location Registers (scene framing guides)

The Oceanfront Dining Room: The Oceanfront Dining Room is charged with tension, where the beauty of the setting contrasts starkly with the dark events unfolding. The atmosphere feels heavy, as whispers of secrets hang in the air, creating a sense of foreboding.. Camera angle: Entering this space, a writer should capture the dichotomy of elegance and suspense that permeates the air.. Era: As a public space, it reflects the societal tensions of the 1940s, where post-war recovery is at the forefront of communal interactions.

The Kitchen: The Kitchen is alive with frenetic energy, filled with the sounds of sizzling pans and bustling staff. Yet beneath the surface, there's a current of anxiety, as the pressure of service echoes the tensions brewing in the dining room.. Camera angle: A writer should focus on the chaos of preparation juxtaposed with the underlying pressures of the investigation.. Era: The kitchen’s activity contrasts the more formal dining area, highlighting the social hierarchies at play in the post-war environment.

Room 12: Room 12 feels like a quiet sanctuary, yet it holds a weight of unspoken secrets. The stillness here contrasts sharply with the tension in the rest of the hotel, making it a poignant space for reflection amidst the chaos.. Camera angle: The writer should evoke a sense of introspection, capturing the atmosphere of quiet unease that pervades the room.. Era: This guest room serves as a temporary refuge, embodying the personal struggles of those navigating their identities in a rapidly changing world.

The Grand Lobby: The Grand Lobby is a hub of social interaction, filled with laughter and conversation, yet it also carries an undercurrent of tension. The interplay of light and shadow here creates a dramatic backdrop for the unfolding mystery.. Camera angle: A writer entering this space should focus on the vibrant yet tense atmosphere, capturing the essence of the social interactions at play.. Era: The lobby serves as a microcosm of the community, reflecting the social dynamics and pressures of the post-war era.

## Humour guidance for this story position (opening)
Permission: forbidden
Rationale: The opening scene establishes the serious tone of the murder.

FAIR-PLAY AND INFERENCE CONTRACT:
- FAIR PLAY CLUE TIMING: Never combine clue discovery and detective deduction in the same chapter. If a clue is first revealed to the reader in chapter N, the detective may only analyze, deduce from, or act on that clue in chapter N+1 or later.
- FAIR PLAY INFORMATION PARITY: The reader must see all clues BEFORE the detective uses them in reasoning. If the detective performs a test or makes a deduction, every piece of evidence supporting that conclusion must have been shown to the reader in earlier chapters.
- FAIR PLAY REVELATION SPACING: In the discriminating test scene, the detective can ONLY use clues that were revealed to the reader at least 1 full chapter earlier. Never introduce new clues or withheld information during the test.
- FAIR PLAY CONFRONTATION: During the final confrontation/revelation, the detective cannot surprise the reader with facts. Every piece of evidence cited must have been visible to the reader in prior chapters.
- Never solve by withheld information. Keep reader-information parity with detective reasoning.
- False assumption in force: Dr. Mallory Finch drowned during the party, as guests recall seeing her shortly before the tide came in.
- Hidden truth to progressively expose (compose in your own words from these elements): tide, schedule, indicates, drowned, time
- Inference path checkpoints to dramatize clearly — compose ENTIRELY in your own sentences from these key terms (reproducing any briefing phrase verbatim FAILS validation):
  - Step 1: obs: tidal, charts, hotel, lobby, indicate, tide, high | corr: finch, drowned, claimed | effect: narrows, timeline, death
  - Step 2: obs: witnesses, recall, seeing, finch, near, beach | corr: seen, drowned | effect: eliminates, possibility, drowning, party
  - Step 3: obs: footprints, leading, beach, storage, area, anchor, kept | corr: footprints, suggest, someone, moved, victim, body, post, drowning | effect: narrows, opportunity, captain, ivor, hale
- Discriminating test method: trap
- Discriminating test elements to dramatize (compose ENTIRELY in your own sentences from these — do NOT reproduce any briefing phrase verbatim): discriminating, compares, party, drown, tidal, claimed, timeline
- Test must rely on already-shown clue IDs: clue_core_contradiction_chain, clue_early_1, clue_mid_2
- Fair-play rationale: Step 1: The tidal charts (early) and witness accounts (mid) establish the impossibility of drowning during the party. Step 2: The footprint evidence (mid) narrows opportunity to Captain Hale. Step 3: The alibi discrepancy (discriminating test) confirms Hale's guilt.

## Character Reference

### Eleanor Voss (she/her — NEVER he/him)
Speaks in a measured tone, often peppering her sentences with sharp observations
Her dialogue can shift from casual banter to pointed inquiries, reflecting her investigative mindset.
Eleanor grapples with her feelings for Captain Hale, torn between her admiration for his bravery and her frustration with his military views.
Voice colour: Eleanor Voss uses observational humour — let it surface in their dialogue where natural, not in every line.

### Captain Ivor Hale (he/him — NEVER she/her)
Speaks in a direct, commanding manner, often using military jargon and adopting a no-nonsense approach
His humor is straightforward, lacking subtlety.
Ivor is haunted by the decisions he made during the war, feeling guilt that complicates his interactions with others.
Voice colour: Captain Ivor Hale uses blunt humour — let it surface in their dialogue where natural, not in every line.

### Beatrice Quill (she/her — NEVER he/him)
Speaks in a flowing, creative manner, often using metaphor and imagery
Her humor is sharp and insightful, reflecting her artistic perspective.
Beatrice grapples with her feelings for Hugo and the realization that her passion for art may be overshadowed by her personal turmoil.
Voice colour: Beatrice Quill uses sardonic humour — let it surface in their dialogue where natural, not in every line.

### Sylvia Trent (she/her — NEVER he/him)
Speaks in a firm, authoritative tone, often using formal language
Her dialogue is direct and devoid of humor, reflecting her serious nature.
Sylvia's fear of losing the hotel’s legacy clashes with her desire to adapt to a changing world.

### Hugo Vane (he/him — NEVER she/her)
Speaks with a charming, easy-going manner, often employing self-deprecating humor to disarm others
His dialogue flows smoothly, reflecting his confidence but hinting at underlying tension.
Hugo is torn between his feelings for Beatrice and the societal expectations tied to his relationship with Eleanor, creating a profound internal struggle.
Voice colour: Hugo Vane uses self deprecating humour — let it surface in their dialogue where natural, not in every line.


## CHARACTER CONTRACTS (binding for this scene)
Each entry below constrains how this character must be written in this chapter.
These override generic style guidance when they conflict.

### Eleanor Voss[SHE]
Voice & mannerisms: Speaks in a measured tone, often peppering her sentences with sharp observations. Her dialogue can shift from casual banter to pointed inquiries, reflecting her investigative mindset.
SIGNATURE TIC (use sparingly — this is Eleanor Voss's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "Well, that's rather telling, isn't it?"
Sample voice fragments (match this register and rhythm):
  [comfortable] "You know, the truth always has a way of surfacing, doesn't it?"
  [evasive] "Well, it’s not that simple; there are layers to every story."
Humour: observational — deploy occasionally (level 0.5)
FORBIDDEN phrase (never write for Eleanor Voss): "everyone could sense the atmosphere"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Investigating the recent rise in political tensions and their local implications." — do not surface in Act I.

### Captain Ivor Hale[HE]
Voice & mannerisms: Speaks in a direct, commanding manner, often using military jargon and adopting a no-nonsense approach. His humor is straightforward, lacking subtlety.
SIGNATURE TIC (use sparingly — this is Captain Ivor Hale's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "It’s all about the mission, isn’t it?"
Sample voice fragments (match this register and rhythm):
  [comfortable] "It’s all about the mission, isn’t it?"
  [evasive] "Look, I was busy; I can't account for every minute."
Humour: blunt — deploy occasionally (level 0.4)
FORBIDDEN phrase (never write for Captain Ivor Hale): "she chose her words with great care"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Frustrated by Eleanor's constant criticisms of the military, seeing her as a personal threat." — do not surface in Act I.

### Beatrice Quill[SHE]
Voice & mannerisms: Speaks in a flowing, creative manner, often using metaphor and imagery. Her humor is sharp and insightful, reflecting her artistic perspective.
SIGNATURE TIC (use sparingly — this is Beatrice Quill's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "Ah, the irony of it all!"
Sample voice fragments (match this register and rhythm):
  [comfortable] "Ah, the irony of it all! Art imitates life, doesn't it?"
  [evasive] "It’s complicated; emotions can be a messy palette."
Humour: sardonic — deploy occasionally (level 0.6)
FORBIDDEN phrase (never write for Beatrice Quill): "palpable tension filled the room"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Soured by jealousy, she believes Hugo deserves better than Eleanor's attention." — do not surface in Act I.

### Sylvia Trent[SHE]
Voice & mannerisms: Speaks in a firm, authoritative tone, often using formal language. Her dialogue is direct and devoid of humor, reflecting her serious nature.
SIGNATURE TIC (use sparingly — this is Sylvia Trent's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "We must uphold the standards of this establishment."
Sample voice fragments (match this register and rhythm):
  [comfortable] "We must uphold the standards of this establishment."
  [evasive] "I don’t see why that’s relevant to our current discussion."
Humour: none — this character plays it straight in all scenes
FORBIDDEN phrase (never write for Sylvia Trent): "sighed deeply and felt a sense of peace"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Anxious about Eleanor's influence on the hotel’s perception, fearing it may attract undesirable attention." — do not surface in Act I.

### Hugo Vane[HE]
Voice & mannerisms: Speaks with a charming, easy-going manner, often employing self-deprecating humor to disarm others. His dialogue flows smoothly, reflecting his confidence but hinting at underlying tension.
SIGNATURE TIC (use sparingly — this is Hugo Vane's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "Well, that’s life, isn’t it?"
Sample voice fragments (match this register and rhythm):
  [comfortable] "Well, that’s life, isn’t it? Full of unexpected turns."
  [evasive] "I wouldn’t worry too much; things have a way of working out."
Humour: self deprecating — deploy frequently (level 0.7)
FORBIDDEN phrase (never write for Hugo Vane): "she knew with certainty she was right"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Desperation to end his complicated love life; Eleanor's public exposure threatened his freedom." — do not surface in Act I.



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

Primary Location: The Tides Hotel (Broadstairs, England)
A seaside hotel that combines Art Deco elegance with the haunting beauty of a fog-laden coast.

Key Locations Available:
- The Oceanfront Dining Room (interior): Crime scene
- The Kitchen (interior): Staff-only area, food preparation
- Room 12 (interior): Guest room, potential clue discovery
- The Grand Lobby (interior): Gathering space, social interaction

Atmosphere (tonal cue only — do NOT reproduce this phrase verbatim in prose; translate into scene-specific, character-observed sensory language): tense and suspenseful, with an undercurrent of uncertainty
Weather: foggy with occasional rain, typical for coastal regions

Era markers: manual typewriters in the lobby | radio broadcasts in the dining area | rationed automobiles parked outside

USAGE GUIDELINES:
1. First mention of location: Ground the scene using sensory details drawn from the profiles — paraphrase these into what the POV character directly observes and experiences, not a summary of the room's general qualities
2. Geographic grounding: Reference the specific place (Broadstairs, England) naturally in dialogue or narrative
3. Action scenes: Integrate physical layout details (access, sightlines, constraints)
4. Atmospheric scenes: Reference weather, lighting, sounds from sensory palette
5. Era details: Weave in period markers naturally
6. Consistency: Keep all location descriptions aligned with profiles
7. OPENING GROUNDING (required, first 1-2 paragraphs of EVERY chapter): (a) name the specific location from this list, (b) give at least 2 concrete sensory details (sound, smell, temperature, texture, light/shadow), and (c) one time-of-day or weather/atmosphere detail — BEFORE advancing plot, clues, or the mechanism. Open on the setting and the people in it, not on the puzzle.
8. This matters most in pre-reveal chapters that withhold the mechanism: ground them in setting and character rather than rushing the investigation — a withheld chapter is not an empty one.
9. Do NOT use generic repeated manor/storm filler without profile-specific details; vary the opening location/sense each chapter

SENSORY PALETTE (use 2-3 senses per scene):
The Oceanfront Dining Room (interior):
  - Visual: misty ocean view, gleaming silverware on tables, flickering candlelight
  - Sounds: clinking of dishes, soft murmurs of conversation, distant waves crashing
  - Scents: freshly caught fish, sea salt and brine, burnt candle wax
  - Touch: smooth tablecloths, cool glassware

The Kitchen (interior):
  - Visual: steam rising from pots, flashing knives on cutting boards, colorful vegetables arranged on counters
  - Sounds: clattering dishes, sizzling pans, the hum of the refrigerator
  - Scents: freshly baked bread, savory herbs, smoky meats
  - Touch: cool metal surfaces, warm oven doors

Room 12 (interior):
  - Visual: sunlight filtering through curtains, neatly stacked books on the desk, a vase of wilted flowers
  - Sounds: wind rustling through the curtains, the distant crash of waves, the creak of the floorboards
  - Scents: stale air, faint scent of lavender, old paper and ink
  - Touch: soft bed linens, cool glass of the window

⛔ REFERENCE DATA — DO NOT TRANSCRIBE VERBATIM: The above profiles are structural guides only. Generate original prose that evokes these qualities; do not reproduce the exact phrasing or sentence structure of the profile paragraphs.

SCENE OPENING RULE: When opening a scene in a new location, write what the POV character directly observes and physically senses at that moment — not a general description of the room's qualities. The reader must feel present, not briefed. Sensory details must be observed by the character, not stated as fact about the place.

SENSORY WRITING TECHNIQUES:
- Opening paragraphs: Lead with 2-3 sensory details to ground the scene
- Movement bet
[truncated for prompt budget]

## Texture Pool
Draw on these as opportunities arise — you are not required to use them.

- In September 1948, the seaside town is in the midst of post-war recovery, with the community trying to navigate the changing social dynamics, particularly regarding gender roles and the looming fear of communism
- The foggy weather mirrors the uncertainties that surround personal and political lives, with people grappling with their identities in a rapidly evolving society
- Daily life is marked by a blend of traditional values and emerging modernity; the economy is recovering, but inflation looms large, and social tensions simmer under the surface
- This era is characterized by a struggle between the past and future, where every interaction is tinged with the anxiety of what lies ahead.

TEMPORAL CONTEXT:

This story takes place in September 1948 during N/A.

Seasonal Atmosphere:
- Weather patterns: foggy with occasional rain, cool sea breezes, overcast skies
- Daylight: Days are growing shorter, with the sun setting around 7:15 PM and darkness enveloping the coastal town by 7:45 PM.
- Seasonal activities: attending local fairs celebrating the harvest, strolling along the beach wrapped in light sweaters, gathering for evening bonfires as summer gives way to fall
- Seasonal occasions: Labor Day (first Monday in September)
- Season: N/A

Period Fashion (describe naturally):
- Men formal: pinstripe suits, double-breasted blazers, white dress shirts with narrow ties
- Men casual: tweed sport coats, corduroy trousers, sweaters in earthy tones
- Men accessories: fedora hats, leather gloves, wristwatches with metal bands
- Women formal: tea-length dresses with fitted bodices, pencil skirts paired with blouses, elegant shawls for evening wear
- Women casual: cotton blouses with high-waisted skirts, lightweight cardigans, culottes for comfort
- Women accessories: string of pearls, berets or cloche hats, stylish handbags

Cultural Context (reference naturally):
- Music/entertainment: Doris Day - 'Que Sera, Sera', Bing Crosby - 'Swinging on a Star', Nat King Cole - 'Nature Boy'; Films: The Treasure of the Sierra Madre, Key Largo; Theatre: South Pacific, The King and I; Radio: Suspense, The Shadow
- Typical prices: Loaf of bread: four pence, Movie ticket: one shilling, A pint of milk: six pence
- Current events: Cold War tensions escalating in Europe; the formation of the Berlin Airlift
- Literature: 1984 by George Orwell | The Naked and the Dead by Norman Mailer | The Catcher in the Rye by J.D. Salinger | [mystery] | [historical fiction] | [pulp novels]
- Technology: the transistor radio | the first commercial jet airliner | the Polaroid camera | manual typewriters | broadband radio sets | early television sets
- Daily life: playing cards with friends, visiting local diners for evening meals, attending community events and dances
- Social rituals: Sunday family dinners, evening strolls along the promenade, community potlucks

Atmospheric Details:
The damp air carries the salty tang of the sea, mingling with the faint scent of rain-soaked earth as autumn approaches. The muted sounds of waves crashing against the shore create a rhythmic backdrop, occasionally interrupted by the distant laughter of beachgoers lingering on a foggy evening. Streetlights flicker on as dusk settles, casting long shadows that play tricks on the mind, enhancing the suspense that permeates the air.

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
- Class indicators: Aristocrats discuss opera, serva
[truncated for prompt budget]

NON-NEGOTIABLE CHAPTER OBLIGATIONS — LOCKED EVIDENCE VALUES (VERBATIM REQUIRED):
The following measured values (times, amounts, measurements) are absolute ground truth. Every time this chapter describes, mentions, or alludes to one — no matter how briefly — it MUST use the exact phrase shown below, character for character. NO paraphrase, approximation, rounding, or synonym is permitted.

FAILURE EXAMPLE: if the locked value is "at thirteen minutes to midnight" and you write "just before midnight" or "around midnight" — that is a HARD FAIL. You must write "at thirteen minutes to midnight". Equally, if the locked value is written in words, such as "ten minutes past eleven", and you convert it to figure-based clock notation — that is also a HARD FAIL. Words stay as words; figure forms are forbidden for word-phrased facts.

CRITICAL — WORD-PHRASED VALUES: If the canonical value is written out in words (e.g. a time like "ten minutes past eleven", or an amount like "forty minutes"), reproduce those exact words. DO NOT convert to figure-based time notation, twenty-four-hour format, or any other numeric shorthand. Correct: "ten minutes past eleven". WRONG: figure-based clock notation or numeric shorthand.

Locked values:
  - The tide was at its highest point at this time.: "ten minutes past eleven"
    ⛔ FORBIDDEN alternatives: "11:10", "11.10", "eleven ten", "eleven-ten", "eleven past ten", "quarter past eleven", "half past eleven" — the ONLY acceptable form is "ten minutes past eleven"
  - Witnesses last saw the victim at this time, which contradicts the tidal schedule.: "a quarter to twelve"
  - The victim arrived at the beach at this time, just before the tide began to rise.: "twenty minutes past ten"
    ⛔ FORBIDDEN alternatives: "10:20", "10.20", "ten twenty", "ten-twenty", "ten past twenty", "quarter past ten", "half past ten" — the ONLY acceptable form is "twenty minutes past ten"

If a value has no relevance to this chapter, omit it. But the moment you reference the underlying evidence, only the exact phrase above is acceptable.

⛔ CLUES TO SURFACE IN THESE CHAPTERS — mandatory:
The following evidence MUST be clearly observable to an attentive reader. Do not bury it in atmosphere or passing dialogue. Each clue must be concrete, specific, and noticeable:

• [clue_core_contradiction_chain] finch, drowned, minutes, past, eleven, claimed
  Category: testimonial | Criticality: essential | Supports inference step 1
  Later significance (context for YOU — do NOT state this in the prose; meaning surfaces only at the licensed deduction beats): timeline, inconsistent, witness, accounts

For each clue above: an attentive reader should be able to find, record, and later use it to reason toward the solution.

═══ NARRATIVE STATE (read-only — do not contradict) ═══

LOCKED FACTS — use verbatim whenever this evidence is described:
  • The tide was at its highest point at this time.: "ten minutes past eleven"
  • Witnesses last saw the victim at this time, which contradicts the tidal schedule.: "a quarter to twelve"
  • The victim arrived at the beach at this time, just before the tide began to rise.: "twenty minutes past ten"

CHARACTER PRONOUNS — never deviate from these:
  • Eleanor Voss: she/her/her
  • Dr. Mallory Finch: she/her/her
  • Captain Ivor Hale: he/him/his
  • Beatrice Quill: she/her/her
  • Sylvia Trent: she/her/her
  • Hugo Vane: he/him/his

CLUES ALREADY REVEALED TO READER: clue_early_1 — do not reveal these as new information.

INVESTIGATION LOG — WHAT IS ESTABLISHED (do not re-establish, do not repeat):
• Evidence already established (reference only — do NOT restate or quote these; advance beyond them): finch, drowned, claimed, time
• Suspects still unresolved: Beatrice Quill[SHE], Sylvia Trent[SHE], Hugo Vane[HE]
⚠ The story must move FORWARD from this log. Any beat already listed above is forbidden from repeating.

⚠ THIS CHAPTER'S REQUIRED ADVANCE (opening): Discover the body, confirm the victim, establish the scene. The victim is found dead. They do not speak, react, or gesture. This is their only physical appearance — in all subsequent chapters they exist only in past tense (memory, evidence, testimony).

CONTINUITY HANDOFF — previous chapter closing beat:
  • "Eleanor’s attention returned to the sand. The footprints, the whispered sighting at 'a quarter to twelve', and the tide’s silent testimony—these pieces did not yet fit. She glanced up at the hotel, where tidal charts were displayed in the lobby for the benefit..."
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
Chapter 1: Chapter 1: The Tide's Arrival
  Events: Eleanor Voss pressed her gloved hand to her brow, squinting into the pale, mist-veiled morning.

⚠️ **VALIDATION:** Character name mismatches and setting drift are common failure modes.
Double-check every character name against the list above before using it.

**⏱ LOCKED TIME ANCHOR — use verbatim, do not paraphrase:**
Clock time (from the case ground truth): **"Tide schedule"**
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
Known location profile anchors: The Tides Hotel, The Oceanfront Dining Room, The Kitchen, Room 12, The Grand Lobby, the hotel lobby
LOCATION NAME CAPITALISATION (HARD REQUIREMENT — validated):
All named locations in your prose MUST use the EXACT capitalisation from the CML profiles.
Canonical forms: "The Tides Hotel", "The Oceanfront Dining Room", "The Kitchen", "Room 12", "The Grand Lobby", "the hotel lobby"
Writing a location in lowercase (e.g. "drawing room" instead of "Drawing Room") is a validated error. Every time you mention a named location, copy its capitalisation from the list above.
- Chapter 2: OPENING STYLE (HARD): Start the VERY FIRST SENTENCE with spoken dialogue — e.g. '"[words]," [Name] said/asked/replied/murmured.' The opening quote must be the first character on the line. Anchor opening in "the hotel lobby". The opening style above governs only your FIRST SENTENCE; the grounding below may land anywhere in the first 2 paragraphs (it need not be sentence one, and never conflicts with the chosen opening style). HARD REQUIREMENT for the first 2 paragraphs: (a) include 2+ sensory words — choose from smell/scent/odor/fragrance/sound/echo/silence/whisper/creak/cold/warm/damp/rough/smooth/glow/shadow/flicker/dim — and (b) include 1+ atmosphere/time word — choose from rain/wind/fog/storm/mist/thunder/evening/morning/night/dawn/dusk/lighting/weather/season/afternoon/midday/noon/midnight/twilight/sunrise/sunset/daylight/sunlight/overcast/cloudy/bright/dark/grey/pale/chill/crisp/drizzle/haze/lamplight/firelight. These are validated requirements, not style suggestions; missing them triggers a retry.

[⚠ INTERNAL QUALITY DIAGNOSTICS — DO NOT REPRODUCE ANY PART OF THIS SECTION IN YOUR STORY OUTPUT. These are private generator observations for your consideration only. Your narrative must read as if this section does not exist. Never include phrases from this block in character dialogue, narration, or description.]

PRIOR CHAPTER QUALITY OBSERVATIONS:
- Chapter 1 (score 94/100):
  Quality gaps noted: word density below preferred target (903/1000); scene grounding weakness
  Address in upcoming chapters: Increase chapter density with concrete investigation action and sensory-grounded beats; avoid recap-only padding. | Open next chapter with a named location anchor plus at least two sensory cues and one atmosphere marker.
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

PROMPT BUDGET SUMMARY: budget=24000 tokens; fixed=9052; context=12346; dropped=[none]; truncated=[location_profiles, temporal_context, pronoun_accuracy]

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
4. Integrate at least two concrete era-grounded details per chapter from setting refinement signals: radio communication | early television | manual typewriters | electric lighting | landline telephones | telegram services.
5. Respect setting movement/access constraints in scene action and alibis: narrow hallways restrict movement | staircases limit access to upper floors | oceanfront view obstructed by adjacent buildings | staff-only areas such as the kitchen and laundry | restricted access to guest rooms.
6. Sustain social coherence with this backdrop pressure: A gathering at a seaside hotel for a post-war recovery conference unites guests amid rising tensions of communism and changing gender roles, while a mysterious drowning casts a shadow over their interactions.
7. Maintain continuity around these socially central cast anchors where relevant: Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill, Sylvia Trent, Hugo Vane.
8. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Critical: Plot similarity 0.85 with 'The Second Key' (same era and method of drowning).
9. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Moderate: Character similarity 0.75 with 'The Second Key' (similar cast structure).
10. STORY TO DATE ANTI-COPY RULE: The STORY TO DATE section below is provided for chronological and factual reference ONLY. You MUST NOT copy, lightly rephrase, or structurally echo any sentence or paragraph from prior chapters. Every sentence in this chapter must be original prose unique to this scene. Reusing even a clause from prior chapter text will cause this attempt to fail immediately.

CRITICAL PROSE REQUIREMENTS:

The CML specifies exact requirements for certain validation-critical scenes. You MUST include these elements at the specified positions.

**Discriminating Test Scene (Act 3, Scene 4):**
Required elements: Execute the discriminating test, Observe the culprit's reaction or result, Draw conclusion about guilt
Test type: temporal

**Suspect Clearance Scenes:**
- Beatrice Quill (Act 3, Scene 5): Witness confirms she was in the lobby during the drowning.
  Clues: red_herring_2
- Sylvia Trent (Act 3, Scene 5): Confirmed to be with other guests during the incident.
  Clues: red_herring_1
- Hugo Vane (Act 3, Scene 5): Alibi confirmed: between 8:00 PM and 9:00 PM

**Culprit Revelation Scene (Act 3, Scene 6):**
Method: Confrontation with evidence.

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
Suspect pressure target(s): Captain Ivor Hale, Beatrice Quill, Sylvia Trent, Hugo Vane
Required new information: Earlier clue gets revised meaning with explicit theory update.
Forbidden reveals at this stage: Do not introduce decisive new evidence from nowhere.

MECHANISM REVEAL GATE (withhold): The discriminating test has NOT happened yet. Show observable clues, contradictions, and suspicions, but do NOT yet explain HOW the concealment mechanism actually works, and do not state outright that it was deliberately rigged — keep the method an open question. Reserve the full explanation for the discriminating-test chapter.

## Asset Self-Report (required)
At the very END of your response, after all prose, add a single line:
<used_assets>era:story:0,era:story:1,era:story:2,era:story:3</used_assets>
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
  - ⛔ INFERENCE EMBARGO (pre-reveal): observations ACCUMULATE here; explicit deduction ("therefore", "which proved", "could only mean", if-A-and-B-then-C assembly of locked values) is RESERVED for the false-solution, discriminating-test, and reveal chapters. Characters may wonder, doubt, or fall silent over a detail — never explain it.
  - Opening: Begin with a character action, spoken line, or clock/time marker — never a location name or location-description phrase.
  - Scene is set in: the hotel lobby — reference it naturally within the paragraph, never as your opening phrase.
  - Opening atmosphere (MANDATORY — validator enforced): the first paragraph MUST contain at least one of: rain / wind / fog / storm / mist / thunder / evening / morning / night / dawn / dusk / season / afternoon / midday / noon / midnight / twilight / sunrise / sunset / daylight / sunlight / overcast / cloudy / bright / dark / grey / pale / cold / warm / chill / crisp / damp / drizzle / haze / lamplight / firelight. A chapter that omits all of these from its opening paragraph will be rejected.
  - PARAGRAPH OPENER DIVERSITY (MANDATORY — validator enforced): No more than 2 paragraphs in this chapter may begin with "Eleanor" or "Eleanor's" as the first word. You must vary paragraph openings throughout: use sensory observations, another character's name or action, dialogue, object or sound details, or temporal markers. Opening 3 or more paragraphs with "Eleanor" will cause automated rejection.
  - Continuity bridge: in the first 120 words, visibly connect from the previous chapter's final beat. Carry forward one unresolved element (object, accusation, emotional pressure, or immediate physical action) from: "Eleanor’s attention returned to the sand. The footprints, the whispered sighting at 'a quarter to twelve', and the tide’s silent testimony—these pieces did not yet fit. She glanced up at the hotel, where tidal charts wer...".
  - CLUE OBLIGATIONS — each clue below MUST be dramatized, but in YOUR OWN WORDS:
    Render each as something a character SEES, DOES, or SAYS on the page. The bracketed text is a
    DESCRIPTION of the evidence for you — do NOT transcribe it as narration. Copying a clue's
    description sentence verbatim into the prose FAILS validation.
    • statements, guests, investigation [clue_core_contradiction_chain] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      OBSERVATION ONLY: put it on the page concretely — a character sees, handles, or hears it inside the scene. The detective may NOTICE (a pause, a second glance, a pocketed item) but must NOT state what it implies. Place the observation in paragraph 1 or 2.
  - PLANT OBLIGATIONS (incidental appearances): each item below MUST appear in this chapter as a passing physical detail a character sees, handles, or walks past — with its significance UNFLAGGED:
    • witnesses, stating, captain, hale, finch [plant:clue_culprit_direct_captain_ivor_hale]
    • witnesses, discussing, last, sighting, finch [plant:clue_fp_elimination_sylvia_trent]
    Rules: set dressing only. NO character comments on its importance, NO narrator hint ("little did they know", "something about it seemed off" are FORBIDDEN), NO inference drawn. It simply exists in the scene, naturally. Its significance surfaces in a LATER chapter — planting it casually here is what makes that later reveal feel fair.
  - Tonal contrast: include at least one beat of relief or ironic counterpoint. Do not sustain maximum tension for every paragraph.
  - CLUE DISCLOSURE RULE (Stage 3/4):
    Characters may draw inferences and name partial conclusions but must NOT state the full mechanism or name the culprit directly. The detective may suspect but not confirm.
    WRONG: dialogue or narration that directly explains how the crime was committed before Stage 4.
    RIGHT: observation, physical reaction, and logical inference that leaves the mechanism just off-screen.
  - ALIBI LOCK: Captain Ivor Hale's established alibi is "between 8:00 PM and 9:00 PM". Do NOT place Captain Ivor Hale at any other location or in any other activity during the crime window. Any contradiction is a continuity error that triggers a retry.
  - TESTIMONY CONTINUITY: Captain Ivor Hale has already made statements in earlier chapters. Any time, location, or claim attributed to Captain Ivor Hale in THIS chapter must be consistent with those earlier statements. Do NOT introduce a new or different alibi claim — any contradiction is a continuity error.
  - Sensory obligation — use at least two of: grey light filtering in, shadows pooling in corners | quiet conversations, the rustle of newspapers | the scent of fresh pastries. Mood: calm contemplation.
- Locked fact phrase obligations:
  - If this batch mentions The tide was at its highest point at this time., write exactly: "ten minutes past eleven".
  - If this batch mentions Witnesses last saw the victim at this time, which contradicts the tidal schedule., write exactly: "a quarter to twelve".
  - If this batch mentions The victim arrived at the beach at this time, just before the tide began to rise., write exactly: "twenty minutes past ten".
- Seasonal vocabulary allow-list: autumn, autumnal, fall.
- Forbidden seasonal words: spring, summer, winter.

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
Suspect pressure target(s): Captain Ivor Hale, Beatrice Quill, Sylvia Trent, Hugo Vane
Required new information: Earlier clue gets revised meaning with explicit theory update.
Forbidden reveals at this stage: Do not introduce decisive new evidence from nowhere.

FROZEN FACT STATE (DO NOT ALTER):
- Timeline anchor: September (autumn).
- Month, season, weather, and time-of-year language in this batch must stay compatible with autumn.
- Established timeline fact: Tide schedule
- Established timeline fact: Party timeline
- If referenced, use exact phrase: "ten minutes past eleven" (The tide was at its highest point at this time.).
- If referenced, use exact phrase: "a quarter to twelve" (Witnesses last saw the victim at this time, which contradicts the tidal schedule.).
- If referenced, use exact phrase: "twenty minutes past ten" (The victim arrived at the beach at this time, just before the tide began to rise.).

STORY TO DATE (REFERENCE ONLY — DO NOT COPY VERBATIM):
- Full prior chapter text is provided below for continuity, factual consistency, and reference accuracy.
- Use this to keep character voice, chronology, clue state, and location continuity aligned with earlier chapters.
- Do not quote, copy, or paraphrase these paragraphs too closely; write fresh prose that remains consistent with them.

--- BEGIN PRIOR CHAPTER 1 ---
Title: Chapter 1: The Tide's Arrival
Eleanor Voss pressed her gloved hand to her brow, squinting into the pale, mist-veiled morning. The tang of salt and the distant, rhythmic hush of waves filled the air as she picked her way across the damp sand near The Tides Hotel. A cold wind teased the hem of her skirt and sent shivers up her spine, but it was not the chill of autumn that made her hesitate. There, sprawled at the water’s edge, was the unmistakable form of Dr. Mallory Finch, her dark hair tangled with seaweed, her evening dress sodden and clinging to her lifeless frame. The body had washed up in the grey dawn, a stark intrusion upon the otherwise elegant order of the post-war seaside retreat.

A cluster of guests and staff had already gathered, their voices low and uncertain, the usual morning pleasantries replaced by uneasy glances. Eleanor, known among them as the local journalist—and, by necessity, the investigator now—knelt beside Dr. Mallory Finch. She noted the faint, briny scent of the sea mingling with something sharper: fear. The tide, having receded, left a ragged line of shells and footprints in its wake. At Eleanor’s shoulder, a nervous murmur caught her attention: two women, their faces drawn, whispered about having seen Dr. Mallory Finch near the beach at 'a quarter to twelve' the night before. The words hung in the damp air, incongruous with the tide’s own silent testimony.

Eleanor’s gaze flicked to the sand, where a pattern of distinct footprints trailed away from the water’s edge, half-obscured by the morning breeze. She followed the line with her eyes, noting how the prints led not directly back to the hotel, but toward the old storage hut, its paint peeling in the salt air. The scene was heavy with the weight of unasked questions. Rising, she brushed the sand from her knees and turned to face the gathering crowd, her posture steady despite the tremor she felt within.

Captain Ivor Hale stood a little apart from the others, the crisp lines of his navy-blue blazer at odds with the rawness of the moment. His jaw was set, but his gaze darted from Eleanor to the body and back again, as if calculating some unspoken risk. He cleared his throat, his voice clipped. “This is a damned business, Miss Voss. Are you certain it’s Dr. Finch?” His hand, usually steady, toyed with the chain of his pocket watch, betraying a flicker of unease. Eleanor regarded him for a heartbeat, noting the tension in his stance—so unlike the calm authority he projected at the conference table.

Beatrice Quill, the aspiring artist whose sketches often adorned the hotel’s common spaces, lingered at the periphery. Her paint-stained fingers clutched a battered sketchbook, knuckles white. She stared not at Dr. Mallory Finch, but at the shifting horizon, as if searching for inspiration in the fog. Yet her eyes, when they met Eleanor’s, shimmered with something raw—resentment, perhaps, or fear. Beatrice’s voice was soft, almost lost in the breeze. “She was always so sure of herself. I suppose the sea doesn’t care about ambition.” Eleanor caught the tremor in her words, an edge that suggested more than artistic sensitivity.

Sylvia Trent, proprietor of The Tides Hotel, strode forward, her tailored suit immaculate despite the hour. She surveyed the scene with a practiced eye, lips pressed in a thin line. “We must uphold the standards of this establishment,” she declared, her tone brooking no dissent. Yet as she spoke, her gaze lingered on the gathered guests, counting heads, calculating reputational damage. Her authority was unchallenged, but Eleanor noticed the way Sylvia’s hand hovered at her throat, fingers brushing the pearls she always wore—a gesture of habit, or perhaps of anxiety.

Hugo Vane, ever the charmer, arrived last. His tweed jacket was rumpled, his tie askew, and a faint shadow of stubble darkened his jaw. He offered a half-hearted smile to Eleanor, but it faded as his eyes fell upon Dr. Mallory Finch. “Well, that’s life, isn’t it? Full of unexpected turns,” he murmured, though his usual levity rang hollow. Hugo’s hands remained buried in his pockets, shoulders hunched against the wind. Eleanor watched him carefully, recalling the whispered confidences and flirtations that had rippled through the hotel’s corridors the night before.

A constable’s arrival brought a brief flurry of activity, but it was clear the guests looked to Eleanor for guidance. She straightened, her voice measured. “We mustn’t disturb anything further. Dr. Finch deserves dignity, and we need clarity.” Her words carried more weight than she intended; the group fell silent, awaiting her direction. The fog pressed in, muffling sound and blurring the boundaries between sea and sky. Somewhere behind them, the hotel’s radio crackled with a morning bulletin—news from Berlin, rationing updates, the world’s troubles continuing apace.

Eleanor’s attention returned to the sand. The footprints, the whispered sighting at 'a quarter to twelve', and the tide’s silent testimony—these pieces did not yet fit. She glanced up at the hotel, where tidal charts were displayed in the lobby for the benefit of guests. A detail, perhaps, but one that tugged at her mind. For now, the only certainty was the cold presence of Dr. Mallory Finch, her ambitions and rivalries stilled by the sea. Eleanor drew a slow breath, the brine sharp in her lungs. The investigation had begun, and with it, the delicate unraveling of secrets that the autumn tide had brought to shore.
--- END PRIOR CHAPTER 1 ---

[SCENE COMPLETENESS CONTRACTS — MANDATORY. Each contract below lists what you MUST enact in that chapter. Do not summarise or mention these labels in the prose — enact them organically.]
Chapter 2 (Act 1) completeness contract:
  PIVOT ELEMENT (MANDATORY — write this into the prose, shown not told): "The tidal charts showing conflicting times."
  FACT ESTABLISHED (MANDATORY — reader must know this by chapter end): "Establishes that Dr. Finch could not have drowned at the claimed time, contradicting witness accounts."

# Case Overview
Title: The Tide's Deception
Era: 1940s
Setting: Seaside Hotel
Crime: murder (drowning)
Culprit: Captain Ivor Hale
Victim: Dr. Mallory Finch
False assumption: Dr. Mallory Finch drowned during the party, as guests recall seeing her shortly before the tide came in.
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
      "location": "the hotel lobby",
      "timeOfDay": "Late morning",
      "atmosphere": "Anxious and chaotic as guests gather to discuss the tragedy."
    },
    "characters": [
      "Eleanor Voss",
      "Captain Ivor Hale",
      "Beatrice Quill",
      "Sylvia Trent",
      "Hugo Vane"
    ],
    "purpose": "Establish the timeline and introduce contradictions.",
    "cluesRevealed": [
      "clue_core_contradiction_chain"
    ],
    "dramaticElements": {
      "conflict": "Guests argue over the timeline of events leading to the discovery.",
      "tension": "Whispers of blame circulate among the guests.",
      "microMomentBeats": [
        "Eleanor clenches her fists, feeling the weight of suspicion in the air."
      ]
    },
    "summary": "In the hotel lobby, panic ensues as guests recount their last moments with Dr. Finch. Captain Hale insists he saw her at a quarter to twelve, but Eleanor notes the conflicting tidal charts. The tension rises as accusations begin to fly.",
    "beat": "crime",
    "estimatedWordCount": 1500,
    "pivotElement": "The tidal charts showing conflicting times.",
    "factEstablished": "Establishes that Dr. Finch could not have drowned at the claimed time, contradicting witness accounts.",
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
        "characterName": "Sylvia Trent",
        "behaviour": "Show normal social behaviour; grief or confusion if appropriate."
      },
      {
        "characterName": "Hugo Vane",
        "behaviour": "Show normal social behaviour; grief or confusion if appropriate."
      }
    ],
    "redHerringPlacement": null,
    "emotionalRegister": "Initial unease grows as relationships are scrutinized, revealing hidden tensions.",
    "dominantCharacterNote": {
      "name": "Eleanor Voss",
      "voiceRegister": "Eleanor's voice is measured and observant, often laced with sharp insights that reflect her journalistic background."
    },
    "humourGuidance": {
      "permission": "permitted",
      "character": "Eleanor Voss",
      "form": "observational"
    },
    "eraTextureNote": "Limited transportation options due to post-war shortages; Communication often reliant on letters and telegrams; Social gatherings still constrained by wartime etiquette and norms; Rationing affecting food and resources; Public spaces sometimes limited by ongoing construction and repairs",
    "locationRegisterNote": "",
    "mechanismRevealAllowed": false,
    "cluesPlanted": [
      "clue_culprit_direct_captain_ivor_hale",
      "clue_fp_elimination_sylvia_trent"
    ]
  }
]
```

## Message 3 (role=user)

```text
BEFORE SUBMITTING YOUR JSON — verify this checklist:
□ Each chapter reaches the hard floor of 450 words and aims for 1250 words or more.
□ If you mention locked evidence, you used the exact locked phrase verbatim.
□ Allowed seasonal words only: autumn, autumnal, fall.
□ Forbidden seasonal words: spring, summer, winter.
□ Chapter 2: the clue [clue_core_contradiction_chain] (finch, drowned, minutes, past, eleven, claimed) is placed in the first 25% of the chapter, dramatized in your own words, followed by an explicit inference or suspicion paragraph.
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
