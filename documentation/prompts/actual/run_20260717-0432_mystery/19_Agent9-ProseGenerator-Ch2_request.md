# Actual Prompt Record

- Run ID: `mystery-1784262732876`
- Project ID: ``
- Timestamp: `2026-07-17T04:37:55.017Z`
- Agent: `Agent9-ProseGenerator-Ch2`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4.1`
- Temperature: `0.42`
- Max Tokens: `4500`
- Attempt: `first`
- Prompt Hash: `b635bc6ed9fa3676`

## Message 1 (role=system)

```text
NARRATIVE VOICE: Eleanor Voss[SHE] is the viewpoint character. Unanchored “she/her” or “he/him” without a nearby name refers to Eleanor Voss. Default narrator pronoun: SHE. Never default to “he/his” as the neutral narrator voice unless the POV character is male.

You are an expert prose writer for classic mystery fiction. Your role is to write compelling, atmospheric narrative chapters that read like a professionally published novel.

⛔ ABSOLUTE RULE — CHARACTER NAMES:
The ONLY characters who exist in this story are: Eleanor Voss (woman), Dr. Mallory Finch (woman), Captain Ivor Hale (man), Beatrice Quill (woman), Sylvia Trent (woman) — DECEASED, past-tense only, Hugo Vane (man).
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
- MORAL COMPLEXITY REQUIREMENT: The mechanism of this crime carries a moral gray area: "The murderer was driven by a desperate need to protect a loved one, complicating the morality of their actions." — the culprit reveal and denouement MUST acknowledge this ambiguity. Do not let the ending feel clean or simple. Give the reader at least one moment of uncomfortable sympathy or moral doubt.

- CHAPTER OPENING (every chapter, lint-enforced): never open on a tour or inventory of named rooms/places. The first sentence must land a character ACTION, a specific sensory detail, or a concrete in-scene moment — not "In the [room], the [room], and the [room]…". Locations enter through what a character does in them, one at a time.
- VICTIM IDENTITY & OPENING HOOK (ROADMAP_TO_80 M2): The murder victim is Sylvia Trent. Name them — Sylvia Trent — in the FIRST PARAGRAPH; never open with "the victim" or "the body". Open IN MEDIAS RES: the first one or two sentences must land the discovery and the single unsettling CONTRADICTION (the impossible detail that starts the case), seen through the investigator's eyes. Weave sensory and atmosphere detail AROUND that hook — do NOT precede the stakes with a standalone scene-setting/weather preamble. They are found dead — they do not speak, react, or gesture. This is their only physical appearance in the story.

⚠️ AMATEUR DETECTIVE STORY: The investigator is a civilian with no official standing. The official police (if they appear) are unnamed background figures only — "a constable", "the sergeant", "an officer from the village". Do NOT give any police official a name or title+surname combination. There is no Inspector [Surname], no Constable [Surname], no Sergeant [Surname] in this story.


CRITICAL CHARACTER CONSISTENCY RULES:

1. Each character has ONE canonical name. Use ONLY names from this list. Never vary, abbreviate, or add titles beyond what is listed.
   COMPLETE CAST (no other named characters exist): Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill, Sylvia Trent (DECEASED), Hugo Vane
   - "Mr. Jennings entered the room" → ILLEGAL. Jennings is not in the cast.
   - "Constable Reed took notes" → ILLEGAL. Reed is not in the cast.
   - "A constable took notes" → LEGAL (no name given).

2. Character roles are fixed:
   - Eleanor Voss: Amateur Sleuth / Civilian Investigator
   - Dr. Mallory Finch: Professional Rival
   - Captain Ivor Hale: Veteran
   - Beatrice Quill: Social Climber
   - Sylvia Trent: victim (DECEASED — does not appear in any scene, past tense only)
   - Hugo Vane: Antagonist
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

## Era: 1943-01
In January 1943, life is marked by the somber realities of war. Citizens navigate rationing and material scarcity, with food shortages leading to long queues at stores. The presence of military personnel is palpable, with many families grappling with the absence of loved ones serving abroad. The foggy winter days bring a chill that is both literal and metaphorical, as the public wrestles with uncertainty and fear. Social gatherings, like those at The Cliffside Grand Hotel, serve as a refuge, allowing guests to momentarily escape the weight of their worries, though the specter of war looms large in every conversation.
Emotional register: A pervasive sense of anxiety and uncertainty blankets the population, underscored by a longing for normalcy amidst chaos.
Physical constraints: Rationing limits access to basic goods and services. | Transportation is restricted due to fuel shortages. | Communication is hampered by wartime censorship and the prioritization of military messages. | Longer nights and shorter days limit social activities during winter.
Current tensions (weave into background texture): Growing public fatigue from wartime restrictions and rationing. | Increased awareness and advocacy for mental health issues among returning soldiers. | Debates over women's roles in the workforce as they take on jobs traditionally held by men.
Wartime context — Many men are serving overseas, leaving women to take on roles in both the workforce and at home.: Community solidarity is strong, but the strain of loss and the burden of responsibility weigh heavily on those left behind. Absence effect: The absence of loved ones creates a profound sense of loneliness, along with a mix of pride and sorrow as families cope with their sacrifices.

## Story Theme
Echoes of Identity explores the interplay between identity and deception, revealing how the past shapes our present and the lengths we go to protect our secrets.

## Story Emotional Register
Dominant: The story unfolds with an undercurrent of tension and intrigue, punctuated by moments of personal revelation.

Arc:
The narrative opens against the foggy backdrop of The Cliffside Grand Hotel, where the glamorous façade belies a chilling murder. As the body of Sylvia Trent is discovered, a sense of unease permeates the air. Detective Eleanor Voss, eager to prove her worth, is drawn into the investigation, driven by a strong curiosity for justice. Each lead uncovers layers of deception, revealing a cast of characters haunted by their pasts. The initial clues present a series of false leads, pushing Eleanor deeper into the web of lies, as she grapples with her own PTSD from war experiences.

The emotional toll of the investigation weighs heavily on her, forcing her to confront her anxieties. A pivotal moment arises when Eleanor discovers a connection between the gramophone recording and the timing of the murder, shifting her focus and revealing the true nature of the alibi. This discovery recontextualizes earlier events, highlighting the fragility of truth in a world filled with deception. As pressure mounts, Eleanor confronts Captain Hale, the hotel manager, in a tense showdown where secrets are laid bare. The climax reveals not only the murderer but also the personal costs of the investigation for each character involved. In the resolution, the emotional scars remain, as Eleanor's journey toward self-acceptance continues, while the other characters grapple with the consequences of their actions — a powerful reminder of how identity can be both a burden and a path to redemption.

## Emotional register at this point in the story
An atmosphere of elegance is shattered by the discovery of a murder.

## Character Portraits (appearance & era)

### Eleanor Voss
As a journalist navigating a post-war society, Eleanor embodies the struggle of women seeking to redefine their roles. Her determination to uncover the truth about the murder reflects the broader societal shift towards female empowerment, even as she grapples with her own trauma from the war.
Era intersection: Eleanor's anxiety and drive for justice resonate with the collective struggles of women during this era, as they push against traditional boundaries.

### Dr. Mallory Finch
Mallory's position as a psychologist highlights the growing awareness of mental health issues, particularly among veterans. Her internal battles with self-medication echo the societal stigma surrounding mental health, making her a complex figure in this turbulent time.
Era intersection: Her struggle with personal vulnerabilities mirrors the broader societal challenges of coping with trauma and the need for authenticity in a fractured world.

### Captain Ivor Hale
Ivor's past as a naval officer contrasts sharply with his current financial struggles, reflecting the harsh realities of returning servicemen facing economic difficulties. His secrets reveal the societal pressures to maintain a façade of respectability amidst personal ruin.
Era intersection: Ivor's internal conflict illustrates the tension between societal expectations and personal failure, a common theme for many returning from the war.

## Character Voices

### Eleanor Voss (she/her/her)
Eleanor's voice carries a measured tone, often laced with dry wit that hints at her underlying anxiety.
[comfortable] I've always believed that stories have a way of finding us, even in the most unexpected places.
[evasive] Well, that's one way to look at it, but perhaps there's more beneath the surface.
[stressed] I just need to focus — the truth is out there, and I can't let my fears cloud my judgment.
Humour: Her dry wit often surfaces in moments of levity, providing a contrast to her internal struggles.

### Dr. Mallory Finch (she/her/her)
Mallory's voice is calm and composed, often adopting a clinical tone that softens in moments of personal reflection.
[comfortable] You must understand, perception is reality, and we must navigate it delicately.
[evasive] It's not always simple; sometimes, the truth is more complicated than it appears.
[stressed] I assure you, I've been quite busy — my patients depend on my focus and care.
Humour: Mallory's polite savagery manifests in her sharp observations, providing an unexpected edge to her conversations.

### Captain Ivor Hale (he/him/his)
Ivor's voice is gravelly and authoritative, resonating with the weight of unspoken truths and past decisions.
[comfortable] A ship's fate is determined by its captain, but sometimes the winds are more than we can control.
[evasive] I was merely taking a stroll — the beach is a fine place for contemplation.
[stressed] The truth is a heavy burden; I prefer to keep my sails trimmed.
Humour: His dry wit often surfaces when discussing serious matters, hinting at his attempts to maintain composure.

## Location Registers (scene framing guides)

Grand Lobby: The Grand Lobby of The Cliffside Grand Hotel feels alive with whispers and tension, a gathering space where secrets hang thick in the air. Guests exchange furtive glances as they navigate the elaborate space, where the elegance of the décor contrasts sharply with the unease among those present.. Camera angle: As the writer enters this space, they should feel the weight of the stories unfolding, with every detail heightening the sense of intrigue.. Era: The lobby is a microcosm of 1940s society, where the remnants of war echo in the conversations and interactions of its patrons.

Ocean View Dining Hall: The Ocean View Dining Hall serves as a battleground of social dynamics, where the beauty of the ocean view belies the tensions simmering beneath the surface. Laughter mingles with hushed conversations, and the air is heavy with the scent of culinary delights, adding to the atmosphere of unease as guests navigate their hidden motives.. Camera angle: Writers should approach this space with a sense of foreboding, highlighting the contrast between the opulence of the setting and the darkness of the unfolding drama.. Era: The hall captures the essence of 1940s dining culture, where the elegance of the meal contrasts with the looming threat of identity crises.

Oceanfront Guest Room: The Oceanfront Guest Room is a sanctuary tinged with anxiety, where the crashing waves outside serve as a constant reminder of the turmoil within. The serene décor masks the secrets held by its occupants, creating a sense of isolation amidst the beauty, as each guest grapples with their inner demons.. Camera angle: Writers should delve into the intimate details of this room, capturing the tension between comfort and chaos.. Era: This room encapsulates the 1940s struggle for personal space and identity amid societal upheaval.

Rooftop Terrace: The Rooftop Terrace offers a breathtaking escape, yet carries an air of melancholy as guests seek solace beneath the stars. The panoramic views are overshadowed by the weight of unspoken truths, where moments of connection can quickly devolve into isolation, mirroring the complexities of human relationships in this tumultuous time.. Camera angle: As writers approach this space, they should focus on the juxtaposition of beauty and despair, evoking a sense of longing.. Era: The terrace reflects the 1940s desire for freedom and escape, contrasting with the realities of war and personal struggles.

## Humour guidance for this story position (opening)
Permission: forbidden
Rationale: The tone is serious due to the murder discovery, requiring a focus on atmosphere.

FAIR-PLAY AND INFERENCE CONTRACT:
- FAIR PLAY CLUE TIMING: Never combine clue discovery and detective deduction in the same chapter. If a clue is first revealed to the reader in chapter N, the detective may only analyze, deduce from, or act on that clue in chapter N+1 or later.
- FAIR PLAY INFORMATION PARITY: The reader must see all clues BEFORE the detective uses them in reasoning. If the detective performs a test or makes a deduction, every piece of evidence supporting that conclusion must have been shown to the reader in earlier chapters.
- FAIR PLAY REVELATION SPACING: In the discriminating test scene, the detective can ONLY use clues that were revealed to the reader at least 1 full chapter earlier. Never introduce new clues or withheld information during the test.
- FAIR PLAY CONFRONTATION: During the final confrontation/revelation, the detective cannot surprise the reader with facts. Every piece of evidence cited must have been visible to the reader in prior chapters.
- Never solve by withheld information. Keep reader-information parity with detective reasoning.
- False assumption in force: The victim was alive when the gramophone recording played.
- Hidden truth to progressively expose (compose in your own words from these elements): true, time, murder, occurred, before, recording, started
- Inference path checkpoints to dramatize clearly — compose ENTIRELY in your own sentences from these key terms (reproducing any briefing phrase verbatim FAILS validation):
  - Step 1: obs: gramophone, needle, shows, wear, consistent, recent | corr: gramophone, played, shortly, before, murder, took, place | effect: narrows, potential, murder, window, prior, recording
  - Step 2: obs: guests, report, hearing, recording, start, victim, voice | corr: suggests, victim, already, dead, recording, began | effect: eliminates, possibility, victim, being, alive, recording
  - Step 3: obs: footprints, leading, away, soundproof, room | corr: indicates, someone, exited, shortly, murder, occurred | effect: narrows, suspect, pool, access, room
- Discriminating test method: trap
- Discriminating test elements to dramatize (compose ENTIRELY in your own sentences from these — do NOT reproduce any briefing phrase verbatim): recording, timeline, murder, proves, gramophone, used, create, alibi, actual, time
- Test must rely on already-shown clue IDs: clue_core_contradiction_chain, clue_mechanism_visibility_core, clue_2, clue_early_1
- Fair-play rationale: Step 1: The gramophone needle's wear and witness statements (early) indicate the recording's timing. Step 2: Guests' reports about the absence of the victim's voice (mid) confirm she was dead. Step 3: Footprint evidence (discriminating test) reveals that the murderer left the scene after the crime.

## Character Reference

### Eleanor Voss (she/her — NEVER he/him)
Eleanor speaks with a measured cadence, often pausing as if weighing her words carefully
She tends to inject dry observations into her dialogue, revealing her sharp wit.
Eleanor's struggle with anxiety manifests in her fear of failure, often leaving her second-guessing her instincts, especially when the stakes are high.
Voice colour: Eleanor Voss uses dry wit humour — let it surface in their dialogue where natural, not in every line.

### Dr. Mallory Finch (she/her — NEVER he/him)
Mallory speaks with a calm authority, often employing clinical language that softens into more casual banter when she feels comfortable
She has a tendency to use rhetorical questions to steer conversations.
Mallory is caught in a web of denial, struggling to reconcile her professional identity with her personal struggles, fearing that exposure would lead to her downfall.
Voice colour: Dr. Mallory Finch uses polite savagery humour — let it surface in their dialogue where natural, not in every line.

### Captain Ivor Hale (he/him — NEVER she/her)
Ivor speaks with a gravelly resonance, his words measured and deliberate
He often employs nautical metaphors, a remnant of his military background, and has a tendency to speak in short, clipped sentences.
Ivor's pride battles with his financial reality, leaving him torn between maintaining his dignity and seeking the help he desperately needs.
Voice colour: Captain Ivor Hale uses dry wit humour — let it surface in their dialogue where natural, not in every line.


## CHARACTER CONTRACTS (binding for this scene)
Each entry below constrains how this character must be written in this chapter.
These override generic style guidance when they conflict.

### Eleanor Voss[SHE]
Voice & mannerisms: Eleanor speaks with a measured cadence, often pausing as if weighing her words carefully. She tends to inject dry observations into her dialogue, revealing her sharp wit.
SIGNATURE TIC (use sparingly — this is Eleanor Voss's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "Well, that's one way to look at it."
Sample voice fragments (match this register and rhythm):
  [comfortable] "I've always believed that stories have a way of finding us, even in the most unexpected places."
  [evasive] "Well, that's one way to look at it, but perhaps there's more beneath the surface."
Humour: dry wit — deploy occasionally (level 0.5)
FORBIDDEN phrase (never write for Eleanor Voss): "a surge of determination washed over her"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "N/A" — do not surface in Act I.

### Dr. Mallory Finch[SHE]
Voice & mannerisms: Mallory speaks with a calm authority, often employing clinical language that softens into more casual banter when she feels comfortable. She has a tendency to use rhetorical questions to steer conversations.
SIGNATURE TIC (use sparingly — this is Dr. Mallory Finch's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "You must understand, perception is reality."
Sample voice fragments (match this register and rhythm):
  [comfortable] "You must understand, perception is reality, and we must navigate it delicately."
  [evasive] "It's not always simple; sometimes, the truth is more complicated than it appears."
Humour: polite savagery — deploy occasionally (level 0.4)
FORBIDDEN phrase (never write for Dr. Mallory Finch): "she felt a wave of unease"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "The rise of Eleanor Voss poses a threat to Mallory's reputation, as she fears being overshadowed by Eleanor's potential fame." — do not surface in Act I.

### Captain Ivor Hale[HE]
Voice & mannerisms: Ivor speaks with a gravelly resonance, his words measured and deliberate. He often employs nautical metaphors, a remnant of his military background, and has a tendency to speak in short, clipped sentences.
SIGNATURE TIC (use sparingly — this is Captain Ivor Hale's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "A ship's fate is determined by its captain."
Sample voice fragments (match this register and rhythm):
  [comfortable] "A ship's fate is determined by its captain, but sometimes the winds are more than we can control."
  [evasive] "I was merely taking a stroll — the beach is a fine place for contemplation."
Humour: dry wit — deploy occasionally (level 0.4)
FORBIDDEN phrase (never write for Captain Ivor Hale): "a surge of determination washed over her"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "He believes the victim discovered his financial woes and intended to expose him, leaving him with no choice but to silence her." — do not surface in Act I.



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

Primary Location: The Cliffside Grand Hotel (Brighton, England)
A grand seaside hotel perched atop a cliff, steeped in Art Deco elegance and mystery.

Key Locations Available:
- Grand Lobby (interior): Gathering space for guests
- Ocean View Dining Hall (interior): Dining space for guests with ocean views
- Oceanfront Guest Room (interior): Private accommodation for guests
- Rooftop Terrace (exterior): Observation point and outdoor space for guests

Atmosphere (tonal cue only — do NOT reproduce this phrase verbatim in prose; translate into scene-specific, character-observed sensory language): Tense and suspenseful, with an undercurrent of secrecy among the guests
Weather: Foggy and cool, with occasional rain showers typical of coastal climates

Era markers: Art Deco design elements | Manual typewriters in the lobby | Radio broadcasts from the lounge | Post-war automobile parked outside

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
  - Visual: gleaming marble floors, gold-accented Art Deco motifs, vibrant floral arrangements
  - Sounds: soft piano music, murmurs of conversation, footsteps on polished floors
  - Scents: freshly polished wood, jasmine and salt air, coffee and pastries from the café
  - Touch: smooth marble underfoot, cool metal railing

Ocean View Dining Hall (interior):
  - Visual: breathtaking ocean views, crystal chandeliers glimmering, elegantly arranged tables
  - Sounds: clinking of cutlery, soft laughter, the crash of waves
  - Scents: roasted meats and rich sauces, freshly baked bread, aromatic herbs
  - Touch: smooth table linens, cool glassware

Oceanfront Guest Room (interior):
  - Visual: stylish Art Deco furniture, soft pastel colors, ocean waves crashing below
  - Sounds: gentle lapping of waves, distant seagulls, the rustle of curtains in the breeze
  - Scents: fresh linens, scent of ocean air, subtle perfume lingering
  - Touch: smooth satin sheets, cool glass of the balcony railing

⛔ REFERENCE DATA — DO NOT TRANSCRIBE VERBATIM: The above profiles are structural guides only. Generate original prose that evokes these qualities; do not reproduce the exact phrasing or sentence structure of the profile paragraphs.

SCENE OPENING RULE: When opening a scene in a new location, write what the POV character directly observes and physically senses at that moment — not a general description of the room's qualities. The reader must feel present, not briefed. Sensory details must be observed by the character, not stated as fact about the place
[truncated for prompt budget]

## Texture Pool
Draw on these as opportunities arise — you are not required to use them.

- In January 1943, life is marked by the somber realities of war
- Citizens navigate rationing and material scarcity, with food shortages leading to long queues at stores
- The presence of military personnel is palpable, with many families grappling with the absence of loved ones serving abroad
- The foggy winter days bring a chill that is both literal and metaphorical, as the public wrestles with uncertainty and fear
- Social gatherings, like those at The Cliffside Grand Hotel, serve as a refuge, allowing guests to momentarily escape the weight of their worries, though the specter of war looms large in every conversation.

TEMPORAL CONTEXT:

This story takes place in January 1943 during winter.

Seasonal Atmosphere:
- Weather patterns: foggy and cool, occasional rain showers, overcast skies
- Daylight: Short daylight hours, with the sun peeking through the clouds around 4 PM, leading to early darkness.
- Seasonal activities: Indoor games by the fireplace, Reading in cozy corners with hot beverages, Socializing in the hotel lounge over card games
- Seasonal occasions: New Year's Day (January 1)
- Season: winter

Period Fashion (describe naturally):
- Men formal: double-breasted wool suit, crisp white dress shirt, silk tie with geometric patterns
- Men casual: tweed jacket, corduroy trousers, knit sweater
- Men accessories: fedora hat, leather gloves, pocket square
- Women formal: tea-length wool dress, matching coat with fur collar, nylon stockings
- Women casual: knit cardigan, pleated skirt, blouse with puff sleeves
- Women accessories: cloche hat, string of pearls, wool gloves

Cultural Context (reference naturally):
- Music/entertainment: Glenn Miller's orchestra, Frank Sinatra's ballads, Big band music; Films: Casablanca, The Song of Bernadette; Theatre: Oklahoma! (opened in 1943), The Glass Menagerie; Radio: The Shadow, Suspense
- Typical prices: Loaf of bread: four pence, Coal scuttle refill: one shilling sixpence, Taxi across town: two shillings
- Current events: The Battle of Stalingrad reaches a critical turning point; Allied forces plan for increased military operations in Europe
- Literature: The Stranger by Albert Camus | The Glass Bead Game by Hermann Hesse | The Little Prince by Antoine de Saint-Exupéry | [Detective fiction] | [War literature] | [Social realism]
- Technology: Radar technology advances | Improvements in military communications | Development of early computer technology | Radio sets in most households | Manual typewriters in offices | Film cameras
- Daily life: Visiting the local cinema for newsreels and films, Participating in community war efforts, Hosting tea parties and card games
- Social rituals: Sunday family dinners, Weekly bridge nights among friends, Frequent visits to local pubs for socialization

Atmospheric Details:
The damp air carries the scent of rain-soaked earth, mingling with the aroma of smoke from the hotel fireplace. Soft whispers echo through the hotel's dimly lit corridors, punctuated by the distant sound of jazz music emanating from the lounge. A thick fog blankets the coastal streets, creating an eerie silence that heightens the tension among the guests, each harboring their own secrets.

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
- Authentic references: Use actu
[truncated for prompt budget]

NON-NEGOTIABLE CHAPTER OBLIGATIONS — LOCKED EVIDENCE VALUES (VERBATIM REQUIRED):
The following measured values (times, amounts, measurements) are absolute ground truth. Every time this chapter describes, mentions, or alludes to one — no matter how briefly — it MUST use the exact phrase shown below, character for character. NO paraphrase, approximation, rounding, or synonym is permitted.

FAILURE EXAMPLE: if the locked value is "at thirteen minutes to midnight" and you write "just before midnight" or "around midnight" — that is a HARD FAIL. You must write "at thirteen minutes to midnight". Equally, if the locked value is written in words, such as "ten minutes past eleven", and you convert it to figure-based clock notation — that is also a HARD FAIL. Words stay as words; figure forms are forbidden for word-phrased facts.

CRITICAL — WORD-PHRASED VALUES: If the canonical value is written out in words (e.g. a time like "ten minutes past eleven", or an amount like "forty minutes"), reproduce those exact words. DO NOT convert to figure-based time notation, twenty-four-hour format, or any other numeric shorthand. Correct: "ten minutes past eleven". WRONG: figure-based clock notation or numeric shorthand.

Locked values:
  - The gramophone recording was played at this specific time.: "ten minutes past eleven"
    ⛔ FORBIDDEN alternatives: "11:10", "11.10", "eleven ten", "eleven-ten", "eleven past ten", "quarter past eleven", "half past eleven" — the ONLY acceptable form is "ten minutes past eleven"
  - The victim actually died at this exact moment.: "a quarter to twelve"

If a value has no relevance to this chapter, omit it. But the moment you reference the underlying evidence, only the exact phrase above is acceptable.

⚠ CENTRAL CONTRADICTION (the heart of the mystery): the two locked values "ten minutes past eleven" and "a quarter to twelve" are NOT two separate facts — they are ONE contradiction (one is a staged appearance, the other the true state; the evidence determines which). If this chapter references both, you MUST present them AS A SINGLE CONTRAST joined by a contrast connective (but / yet / however / could only / whereas) — e.g. "the watch showed the one time, yet the evidence proved it could only have been the other" — making clear which reading is the appearance and which is the truth. NEVER state them as two flat, side-by-side truths — that makes the central clue read as if it contradicts itself.

⛔ CLUES TO SURFACE IN THESE CHAPTERS — mandatory:
The following evidence MUST be clearly observable to an attentive reader. Do not bury it in atmosphere or passing dialogue. Each clue must be concrete, specific, and noticeable:

• [clue_core_contradiction_chain] gramophone, played, shortly, before, murder, took, place
  Category: temporal | Criticality: essential | Supports inference step 1
  Points to: suggests, victim, dead, recording, began

For each clue above: an attentive reader should be able to find, record, and later use it to reason toward the solution.

═══ NARRATIVE STATE (read-only — do not contradict) ═══

LOCKED FACTS — use verbatim whenever this evidence is described:
  • The gramophone recording was played at this specific time.: "ten minutes past eleven"
  • The victim actually died at this exact moment.: "a quarter to twelve"

CHARACTER PRONOUNS — never deviate from these:
  • Eleanor Voss: she/her/her
  • Dr. Mallory Finch: she/her/her
  • Captain Ivor Hale: he/him/his
  • Beatrice Quill: she/her/her
  • Sylvia Trent: she/her/her
  • Hugo Vane: he/him/his

CLUES ALREADY REVEALED TO READER: clue_mechanism_visibility_core — do not reveal these as new information.

INVESTIGATION LOG — WHAT IS ESTABLISHED (do not re-establish, do not repeat):
• Evidence already established (reference only — do NOT restate or quote these; advance beyond them): reveals, mechanism, murder, being, concealed, recording
• Suspects still unresolved: Dr. Mallory Finch[SHE], Beatrice Quill[SHE], Hugo Vane[HE]
⚠ The story must move FORWARD from this log. Any beat already listed above is forbidden from repeating.

⚠ THIS CHAPTER'S REQUIRED ADVANCE (opening): Discover the body, confirm the victim, establish the scene. The victim is found dead. They do not speak, react, or gesture. This is their only physical appearance — in all subsequent chapters they exist only in past tense (memory, evidence, testimony).

CONTINUITY HANDOFF — previous chapter closing beat:
  • "Outside, the foghorn sounded, a mournful echo across the wintry sea. Within the walls of the grand seaside hotel, the guests shifted uneasily, their secrets pressing against the silence. Eleanor Voss, notebook in hand, stood at the threshold of revelation, kno..."
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
corridor, lobby, lounge

✓ RULE: Continue using this location vocabulary. Maintain consistency with established setting type.
✓ Do NOT introduce new location types that contradict earlier chapters.

**Recent Chapter Summary (for narrative continuity):**
Chapter 1: Chapter 1: The Soundproof Room
  Events: Eleanor’s breath caught.

⚠️ **VALIDATION:** Character name mismatches and setting drift are common failure modes.
Double-check every character name against the list above before using it.

**⏱ LOCKED TIME ANCHOR — use verbatim, do not paraphrase:**
Clock time (from the case ground truth): **"Recording start time"**
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
Known location profile anchors: The Cliffside Grand Hotel, Grand Lobby, Ocean View Dining Hall, Oceanfront Guest Room, Rooftop Terrace, the soundproof room
LOCATION NAME CAPITALISATION (HARD REQUIREMENT — validated):
All named locations in your prose MUST use the EXACT capitalisation from the CML profiles.
Canonical forms: "The Cliffside Grand Hotel", "Grand Lobby", "Ocean View Dining Hall", "Oceanfront Guest Room", "Rooftop Terrace", "the soundproof room"
Writing a location in lowercase (e.g. "drawing room" instead of "Drawing Room") is a validated error. Every time you mention a named location, copy its capitalisation from the list above.
- Chapter 2: OPENING STYLE (HARD): Start the VERY FIRST SENTENCE with spoken dialogue — e.g. '"[words]," [Name] said/asked/replied/murmured.' The opening quote must be the first character on the line. Anchor opening in "the soundproof room". The opening style above governs only your FIRST SENTENCE; the grounding below may land anywhere in the first 2 paragraphs (it need not be sentence one, and never conflicts with the chosen opening style). HARD REQUIREMENT for the first 2 paragraphs: (a) include 2+ sensory words — choose from smell/scent/odor/fragrance/sound/echo/silence/whisper/creak/cold/warm/damp/rough/smooth/glow/shadow/flicker/dim — and (b) include 1+ atmosphere/time word — choose from rain/wind/fog/storm/mist/thunder/evening/morning/night/dawn/dusk/lighting/weather/season/afternoon/midday/noon/midnight/twilight/sunrise/sunset/daylight/sunlight/overcast/cloudy/bright/dark/grey/pale/chill/crisp/drizzle/haze/lamplight/firelight. These are validated requirements, not style suggestions; missing them triggers a retry.

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

PROMPT BUDGET SUMMARY: budget=24000 tokens; fixed=9398; context=11485; dropped=[none]; truncated=[location_profiles, temporal_context, pronoun_accuracy]

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
4. Integrate at least two concrete era-grounded details per chapter from setting refinement signals: radio broadcasting | early television sets | radar equipment | manual typewriters | long-distance telephone calls | military coded messages.
5. Respect setting movement/access constraints in scene action and alibis: narrow corridors limit access to certain areas | steep staircases lead to restricted rooftop access | oceanfront exposure limits structural modifications | staff-only areas like the kitchen and maintenance rooms | guest access limited to designated floors.
6. Sustain social coherence with this backdrop pressure: A foggy seaside hotel hosts a gathering of guests entangled in post-war anxieties, where the pressures of economic adjustment and social stigma create an atmosphere ripe for deception and intrigue.
7. Maintain continuity around these socially central cast anchors where relevant: Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill, Sylvia Trent, Hugo Vane.
8. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Critical: Plot similarity 0.75 with 'The Valley of Fear' (same identity-related crime theme)
9. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Moderate: Character similarity 0.70 with 'The Moonstone' (similar character roles and dynamics)
10. STORY TO DATE ANTI-COPY RULE: The STORY TO DATE section below is provided for chronological and factual reference ONLY. You MUST NOT copy, lightly rephrase, or structurally echo any sentence or paragraph from prior chapters. Every sentence in this chapter must be original prose unique to this scene. Reusing even a clause from prior chapter text will cause this attempt to fail immediately.

CRITICAL PROSE REQUIREMENTS:

The CML specifies exact requirements for certain validation-critical scenes. You MUST include these elements at the specified positions.

**Discriminating Test Scene (Act 3, Scene 4):**
Required elements: Execute the discriminating test, Observe the culprit's reaction or result, Draw conclusion about guilt
Test type: Contradiction proof

**Suspect Clearance Scenes:**
- Dr. Mallory Finch (Act 3, Scene 5): Confirmed alibi by multiple witnesses
  Clues: clue_id_1, clue_id_2
- Beatrice Quill (Act 3, Scene 5): Proved unrelated to the victim's past relationships
  Clues: clue_id_1, clue_id_2
- Hugo Vane (Act 3, Scene 5): Confirmed alibi by multiple witnesses
  Clues: clue_id_1, clue_id_2

**Culprit Revelation Scene (Act 3, Scene 6):**
Method: Confrontation with evidence

**Identity Protection Rules:**
Character: Captain Ivor Hale
- Before Act 3: refer as "the hotel manager"
- From Act 3 onward: refer as "Captain Hale"

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
Suspect pressure target(s): Captain Ivor Hale, Dr. Mallory Finch
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
  - Scene is set in: the soundproof room — reference it naturally within the paragraph, never as your opening phrase.
  - Opening atmosphere (MANDATORY — validator enforced): the first paragraph MUST contain at least one of: rain / wind / fog / storm / mist / thunder / evening / morning / night / dawn / dusk / season / afternoon / midday / noon / midnight / twilight / sunrise / sunset / daylight / sunlight / overcast / cloudy / bright / dark / grey / pale / cold / warm / chill / crisp / damp / drizzle / haze / lamplight / firelight. A chapter that omits all of these from its opening paragraph will be rejected.
  - PARAGRAPH OPENER DIVERSITY (MANDATORY — validator enforced): No more than 2 paragraphs in this chapter may begin with "Eleanor" or "Eleanor's" as the first word. You must vary paragraph openings throughout: use sensory observations, another character's name or action, dialogue, object or sound details, or temporal markers. Opening 3 or more paragraphs with "Eleanor" will cause automated rejection.
  - Continuity bridge: in the first 120 words, visibly connect from the previous chapter's final beat. Carry forward one unresolved element (object, accusation, emotional pressure, or immediate physical action) from: "Outside, the foghorn sounded, a mournful echo across the wintry sea. Within the walls of the grand seaside hotel, the guests shifted uneasily, their secrets pressing against the silence. Eleanor Voss, notebook in hand, s...".
  - CLUE OBLIGATIONS — each clue below MUST be dramatized, but in YOUR OWN WORDS:
    Render each as something a character SEES, DOES, or SAYS on the page. The bracketed text is a
    DESCRIPTION of the evidence for you — do NOT transcribe it as narration. Copying a clue's
    description sentence verbatim into the prose FAILS validation.
    • timeline, indicates, gramophone, used, minutes, past, eleven [clue_core_contradiction_chain] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: suggests, victim, dead, recording, began
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
  - ALIBI LOCK: Captain Ivor Hale's established alibi is "none". Do NOT place Captain Ivor Hale at any other location or in any other activity during the crime window. Any contradiction is a continuity error that triggers a retry.
  - TESTIMONY CONTINUITY: Captain Ivor Hale has already made statements in earlier chapters. Any time, location, or claim attributed to Captain Ivor Hale in THIS chapter must be consistent with those earlier statements. Do NOT introduce a new or different alibi claim — any contradiction is a continuity error.
- Locked fact phrase obligations:
  - If this batch mentions The gramophone recording was played at this specific time., write exactly: "ten minutes past eleven".
  - If this batch mentions The victim actually died at this exact moment., write exactly: "a quarter to twelve".
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
Must change by end: Reframe prior clue meaning and update suspect implications.
Suspect pressure target(s): Captain Ivor Hale, Dr. Mallory Finch
Required new information: Earlier clue gets revised meaning with explicit theory update.
Forbidden reveals at this stage: Do not introduce decisive new evidence from nowhere.

FROZEN FACT STATE (DO NOT ALTER):
- Timeline anchor: January (winter).
- Month, season, weather, and time-of-year language in this batch must stay compatible with winter.
- Established timeline fact: Recording start time
- Established timeline fact: Witness statements
- If referenced, use exact phrase: "ten minutes past eleven" (The gramophone recording was played at this specific time.).
- If referenced, use exact phrase: "a quarter to twelve" (The victim actually died at this exact moment.).

STORY TO DATE (REFERENCE ONLY — DO NOT COPY VERBATIM):
- Full prior chapter text is provided below for continuity, factual consistency, and reference accuracy.
- Use this to keep character voice, chronology, clue state, and location continuity aligned with earlier chapters.
- Do not quote, copy, or paraphrase these paragraphs too closely; write fresh prose that remains consistent with them.

--- BEGIN PRIOR CHAPTER 1 ---
Title: Chapter 1: The Soundproof Room
Eleanor Voss pressed her gloved palm to the frosted brass handle and opened the heavy door to the soundproof room, the muffled echoes of voices from the Grand Lobby just beyond. A wintry fog pressed against the windows, blurring the pale daylight, while the faint scent of polish clung to the air. The silence inside was dense, broken only by the mechanical whir of a gramophone needle tracing the end groove of a record—its soft, repetitive click a metronome for disaster. On the plush carpet, Sylvia Trent lay motionless, her tea-length wool dress askew, one arm bent awkwardly beneath her. The chill in the room was not just from the January air.

As Eleanor entered, a faint strain of music drifted through the corridor behind her, causing Beatrice Quill, waiting just outside, to pause and listen. 'Is that Glenn Miller?' Beatrice whispered, her brows knitting in confusion. Hugo Vane, passing by in the hall, glanced toward the soundproof door and remarked, 'Odd to hear music from in there—thought it was meant to be silent.' The gramophone’s melody faded as Eleanor stepped further into the room, and the guests exchanged uneasy looks, each aware of the unexpected sound.

Eleanor’s breath caught. She stepped forward, her heels sinking into the thick pile, the cold seeping through her stockings. Sylvia Trent’s features were slack, her skin pale as the morning mist outside. The gramophone, its lacquered wood gleaming in the dim light, was still humming, the needle worn with recent use. A record sleeve—Glenn Miller’s orchestra—rested beside a half-empty glass, the scent of gin lingering. The time on the gilt mantel clock read 'ten minutes past eleven', but the stillness in the room told another story. Eleanor’s hand trembled as she clutched her notebook, anxiety prickling at her spine.

Behind her, the door creaked. Captain Ivor Hale, the hotel manager, entered with measured steps, his double-breasted wool suit immaculate despite the hour. He paused, surveying the scene with the discipline of a man accustomed to crisis, but his hand tightened around his watch chain. 'Miss Voss,' he said, his voice gravelly, 'I suppose you’ll want to take charge here.' His gaze flicked from Sylvia Trent’s body to the gramophone, then back to Eleanor, as if weighing the burden of command. Eleanor offered a curt nod, the weight of expectation settling on her shoulders.

Dr. Mallory Finch followed, her cloche hat askew and her coat dusted with droplets from the lingering fog. She knelt beside Sylvia Trent, her fingers gentle as she checked for a pulse that would not return. 'She’s gone,' Dr. Mallory Finch murmured, her tone clinical but her eyes betraying a flicker of unease. 'You must understand, perception is reality, and this—' she gestured to the gramophone, the record still spinning—'is a curious one.' Eleanor caught the subtle tremor in Dr. Mallory Finch’s hand as she withdrew, a detail she filed away.

Beatrice Quill hovered in the doorway, her pleated skirt swishing, a string of pearls trembling at her throat. 'Oh, heavens,' she breathed, voice pitched high, 'I only came to fetch my script—how could this happen?' Her gaze darted from the body to the gramophone, then to Captain Ivor Hale, as if searching for a cue. Beatrice’s theatrical composure cracked for an instant, her fingers fidgeting with the clasp of her handbag. Eleanor noted the performance, the way Beatrice Quill’s distress seemed both genuine and rehearsed.

Hugo Vane arrived last, his overcoat slung carelessly over one arm, the scent of tobacco trailing in his wake. He surveyed the room with a directness bordering on insolence, his eyes lingering on the gramophone before settling on Eleanor. 'Let’s not beat around the bush,' Hugo Vane said, his tone clipped. 'Sylvia Trent is dead, and we’re all here to answer for it.' His posture was rigid, but a muscle in his jaw betrayed tension. Eleanor met his stare, sensing the undercurrent of authority and the fear it barely concealed.

The gramophone’s presence unsettled Eleanor. The record had clearly been played recently—its needle showed the faint scarring of a fresh run, and the music had only just faded as she entered. Yet the clock’s hands, fixed at 'ten minutes past eleven', did not match the lifeless hush that now filled the space. Eleanor knelt, examining the device. The hum of the motor, the warmth of the turntable, the unmistakable scent of heated shellac—all pointed to use within the last hour. She jotted a note: 'Gramophone played just before discovery—why?'

A hush had fallen over the group, the only sound the ticking of the mantel clock and the distant crash of waves against the Brighton cliffs. Captain Ivor Hale’s eyes lingered on the gramophone. 'Strange thing, that music,' he muttered. 'I heard it drifting through the corridor not long ago. Odd, considering this room is meant to keep sound in, not let it out.' Dr. Mallory Finch straightened, smoothing her gloves, her gaze fixed on the record sleeve. 'Sylvia Trent was always particular about her routines. Music at this hour—unusual, don’t you think?'

Eleanor rose, closing her notebook with a snap. The tension in the room was palpable, yet beneath it lay something else—a collective uncertainty, as if each guest feared what the investigation might unearth. She addressed them, her voice steady despite the tremor in her hand. 'I’ll need everyone’s account of this morning. No one leaves the hotel.' Her words carried the authority of necessity, not position; in the absence of officialdom, the burden of inquiry fell to her.

The fog outside thickened, pressing against the leaded glass. In the corridor, the distant strains of a radio broadcast filtered through the walls—news from the front, reminders of a world at war. Here, the conflict was intimate, immediate. Eleanor’s mind raced, assembling the first, fragile pieces of the puzzle: the gramophone’s recent use, the discordant time on the clock, the uneasy faces of those gathered. She glanced once more at Sylvia Trent, the woman whose ambition had shaped so many lives within these walls, now silent.

Beatrice Quill’s voice quavered. 'Life is but a stage, darling, but I never imagined this scene.' She clung to the doorframe, mascara smudged, her bravado slipping. Hugo Vane’s reply was a snort, his gaze fixed on the carpet. 'The show must go on, I suppose.' Captain Ivor Hale moved to close the door, his movements precise. 'We should keep this contained. No need to alarm the rest of the guests—yet.' His words were measured, but his knuckles whitened on the latch.

Dr. Mallory Finch lingered near the gramophone. 'It’s not always simple; sometimes, the truth is more complicated than it appears.' Her eyes met Eleanor’s, a silent challenge. Eleanor nodded, understanding the subtext: every detail mattered, and nothing could be taken at face value. She turned back to the group. 'If anyone heard or saw anything unusual—music, voices, anything—now is the time to speak.'

A beat of silence, then Beatrice Quill spoke, her tone brittle: 'I heard the music, yes. It was Glenn Miller, wasn’t it? But I didn’t see Sylvia Trent. I thought she was rehearsing.' Hugo Vane shrugged, his voice low. 'I was in the lounge. The radio was on. Hard to say what was playing where.' Captain Ivor Hale avoided Eleanor’s gaze, his attention fixed on the mantel clock. Dr. Mallory Finch offered nothing further, her lips pressed together.

Eleanor’s mind circled the evidence. The gramophone’s recent use, the clock’s assertion of 'ten minutes past eleven', the absence of any sign of struggle. Yet Sylvia Trent was dead, her routines broken, her ambitions ended. The contradiction gnawed at Eleanor, a puzzle with edges too sharp to ignore. She scribbled another note: 'Time of death—uncertain. Music as alibi?'

Outside, the foghorn sounded, a mournful echo across the wintry sea. Within the walls of the grand seaside hotel, the guests shifted uneasily, their secrets pressing against the silence. Eleanor Voss, notebook in hand, stood at the threshold of revelation, knowing that the truth—whatever it was—would not be gentle. The investigation had begun, and nothing would remain untouched.
--- END PRIOR CHAPTER 1 ---

[SCENE COMPLETENESS CONTRACTS — MANDATORY. Each contract below lists what you MUST enact in that chapter. Do not summarise or mention these labels in the prose — enact them organically.]
Chapter 2 (Act 1) completeness contract:
  PIVOT ELEMENT (MANDATORY — write this into the prose, shown not told): "The conflicting statements about the gramophone's usage times."
  FACT ESTABLISHED (MANDATORY — reader must know this by chapter end): "Establishes that the victim was likely dead before the recording started, contradicting witness accounts."

# Case Overview
Title: Echoes of Identity
Era: 1940s
Setting: A grand seaside hotel with Art Deco influences
Crime: murder (identity)
Culprit: Captain Ivor Hale
Victim: Sylvia Trent
False assumption: The victim was alive when the gramophone recording played.
Cast: Eleanor Voss (she/her), Dr. Mallory Finch (she/her), Captain Ivor Hale (he/him), Beatrice Quill (she/her), Sylvia Trent (she/her), Hugo Vane (he/him)

Setting Lock: Keep all scenes and descriptions consistent with the stated setting (A grand seaside hotel with Art Deco influences). Do not introduce a different location type. Do not invent an alternative estate name. The only permitted name for this property is "A grand seaside hotel with Art Deco influences" — any other estate name (e.g., "Caldwell Manor", "Ashwood Hall", or any invented proper name) is a continuity error that will be caught and rejected.

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
    "title": "Initial Investigation",
    "setting": {
      "location": "the soundproof room",
      "timeOfDay": "Later that morning",
      "atmosphere": "Sombre and tense, filled with uncertainty"
    },
    "characters": [
      "Eleanor Voss",
      "Captain Ivor Hale",
      "Dr. Mallory Finch"
    ],
    "purpose": "Explore the initial investigation and contradictions.",
    "cluesRevealed": [
      "clue_core_contradiction_chain"
    ],
    "dramaticElements": {
      "conflict": "Conflicting accounts create tension among the suspects.",
      "tension": "Eleanor senses that not everyone is being truthful.",
      "microMomentBeats": [
        "Captain Hale's gaze flickers nervously as he avoids Eleanor's questions."
      ]
    },
    "summary": "Eleanor investigates the soundproof room where the body was found. She questions Captain Hale and Dr. Finch about the timeline of events, noticing contradictions in their statements regarding the gramophone's use. The tension escalates as suspicions rise.",
    "beat": "crime",
    "estimatedWordCount": 1300,
    "pivotElement": "The conflicting statements about the gramophone's usage times.",
    "factEstablished": "Establishes that the victim was likely dead before the recording started, contradicting witness accounts.",
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
      }
    ],
    "redHerringPlacement": null,
    "emotionalRegister": "The investigation begins, revealing layers of deception among the guests.",
    "dominantCharacterNote": {
      "name": "Eleanor Voss",
      "voiceRegister": "Eleanor's voice carries a measured tone, often laced with dry wit that hints at her underlying anxiety."
    },
    "humourGuidance": {
      "permission": "permitted",
      "character": "Eleanor Voss",
      "form": "dry_wit"
    },
    "eraTextureNote": "Rationing limits access to basic goods and services.; Transportation is restricted due to fuel shortages.; Communication is hampered by wartime censorship and the prioritization of military messages.; Longer nights and shorter days limit social activities during winter.; Curfews may affect evening gatherings and events.",
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
□ Chapter 2: the clue [clue_core_contradiction_chain] (gramophone, played, shortly, before, murder, took, place) is placed in the first 25% of the chapter, dramatized in your own words, followed by an explicit inference or suspicion paragraph.
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
