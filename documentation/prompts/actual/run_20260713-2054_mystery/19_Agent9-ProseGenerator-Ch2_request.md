# Actual Prompt Record

- Run ID: `mystery-1783976096323`
- Project ID: ``
- Timestamp: `2026-07-13T21:02:14.174Z`
- Agent: `Agent9-ProseGenerator-Ch2`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4.1`
- Temperature: `0.42`
- Max Tokens: `4500`
- Attempt: `first`
- Prompt Hash: `b7b885c2ef028593`

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
- MORAL COMPLEXITY REQUIREMENT: The mechanism of this crime carries a moral gray area: "The murderer was driven by a desperate need to protect a loved one, complicating the morality of their actions." — the culprit reveal and denouement MUST acknowledge this ambiguity. Do not let the ending feel clean or simple. Give the reader at least one moment of uncomfortable sympathy or moral doubt.

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
   - Eleanor Voss: Creative Outsider
   - Dr. Mallory Finch: victim (DECEASED — does not appear in any scene, past tense only)
   - Captain Ivor Hale: Family Man with a Secret
   - Beatrice Quill: The Protector
   - Sylvia Trent: The Envious Protégé
   - Hugo Vane: The Opportunist
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

## Era: February 1942
Living through February 1942 means navigating a world reshaped by the realities of World War II. The coastal town feels heavy with the weight of uncertainty, as rationing disrupts daily life and news from the front lines permeates conversations. The community is tightly knit, with gatherings at the local hotel providing temporary escape from the troubles outside. Yet, the looming specter of loss hangs over families, with loved ones either away at war or affected by the economic strains of this tumultuous period. Amidst the chill of winter, the atmosphere is charged with both romantic anticipation for Valentine's Day and a foreboding sense of dread as the war intensifies.
Emotional register: A collective anxiety permeates daily life, blending with moments of fleeting joy.
Physical constraints: Limited transportation options due to fuel rationing. | Short daylight hours complicate evening activities. | Frequent weather disruptions hinder outdoor events.
Current tensions (weave into background texture): Rationing measures are impacting daily life. | The threat of war looms over community events. | Social expectations are shifting due to women's increased workforce participation.
Wartime context — Many men are serving overseas, leaving women to shoulder new responsibilities.: Community solidarity is emphasized as families support one another amidst loss. Absence effect: The absence of loved ones creates a void, fostering both resilience and vulnerability.

## Season Lock (mandatory — derived from February 1942)
Season: winter. Allowed vocabulary: winter, wintry, midwinter
Forbidden seasonal words — never use in narration, dialogue, or metaphor: spring, summer, autumn and their adjectival forms.
Every weather description, atmosphere, and time-of-year reference must be consistent with winter.

## Story Theme
The masquerade of identities reveals the darker truths hidden beneath the surface of society, where deception and ambition intertwine tragically, and reveals that evidence carries ethical weight, forcing characters to choose accountability over social performance when appearances and facts collide.

## Story Emotional Register
Dominant: Tension and intrigue

Arc:
As the story opens, the atmosphere is thick with anticipation at The Cliffside Grand Hotel, where the vibrant hues of a masquerade ball contrast with the chilling discovery of Dr. Mallory Finch's lifeless body. Guests, adorned in elaborate costumes, are caught between celebration and the weight of impending tragedy. As Eleanor Voss steps into the role of investigator, her curiosity drives her to unearth the truth, yet each clue brings forth rising unease as suspects emerge, and false leads complicate her pursuit of justice.

The emotional toll of the investigation weighs heavily on her, revealing her internal struggles with ambition and the shadows of her personal life. A pivotal moment occurs when Eleanor uncovers a connection between the victim and one of the suspects, prompting a shift in her investigation's direction. With this newfound insight, she revisits earlier clues that now take on new meaning, reshaping her understanding of the events leading to the murder. As pressure mounts and secrets unravel, the climax reveals the murderer in a confrontation that exposes the dark undercurrents of ambition and betrayal. In the resolution, each character is left to grapple with the emotional costs of their choices, as Eleanor emerges changed, forever marked by the shadows of the masquerade and the lives entwined within it.

## Emotional register at this point in the story
A vibrant atmosphere filled with anticipation quickly transforms into one of dread as a body is discovered.

## Character Portraits (appearance & era)

### Eleanor Voss
Eleanor Voss embodies the spirit of the 1940s, where women's roles are evolving amid the pressures of wartime. Her artistic career flourishes yet is fraught with the tension of secrecy and ambition, reflecting the societal shifts occurring around her. As a beloved figure in the community, she navigates the complexities of personal desire and public expectation, torn between her passion for art and the societal judgment that accompanies her romantic entanglements.
Era intersection: Eleanor's struggle for identity and recognition as an artist resonates deeply with the wartime context, where women are increasingly stepping into roles that challenge traditional boundaries.

### Captain Ivor Hale
Captain Ivor Hale embodies the duality of duty and desire that characterizes the 1940s male experience. A naval officer, he is torn between familial loyalty and his secret affair with Eleanor, highlighting the social pressures faced by men to conform to traditional roles while grappling with personal desires. His charm masks the inner conflict of maintaining reputation and honor in a time when masculinity is scrutinized against the backdrop of war.
Era intersection: Ivor's struggle reflects the expectations placed on men during wartime, where honor and reputation are constantly at stake amidst the chaos of personal and global turmoil.

## Character Voices

### Eleanor Voss (she/her/her)
Eleanor's voice carries a melodic lilt, often imbued with the passion of an artist.
[comfortable] ‘Isn't it fascinating how the sea reflects our emotions? Like a canvas, it captures every hue of our heart.’
[evasive] ‘Oh, you know how rumors can swirl like the tides. I wouldn’t worry too much about them.’
[stressed] ‘I just need to focus on my work. This chaos is too much to bear right now!’
Humour: Eleanor often employs dry wit, revealing her sharp intellect.

### Captain Ivor Hale (he/him/his)
Captain Hale's voice exudes confidence, with a theatrical flair that draws listeners in.
[comfortable] ‘Ah, the sea always has a way of calling us back to our true selves, doesn’t it?’
[evasive] ‘Let’s not dwell on the past; duty calls, and we must look forward.’
[stressed] ‘I can’t let them find out about Eleanor. It would ruin everything!’
Humour: His sardonic comments reveal a complex character hiding deeper insecurities.

## Location Registers (scene framing guides)

The Oceanfront Veranda: The Oceanfront Veranda feels tense and foreboding, with the crashing waves below echoing the turmoil of the crime that has just unfolded. Guests may be unaware of the dark events that transpired here, but the air is thick with secrets and unspoken fears as shadows loom large against the night.. Camera angle: As the writer enters this space, the camera captures the stark contrast between the vibrant party atmosphere and the grim reality of the crime's aftermath.. Era: This location is shaped by the coastal climate, where the overcast skies and chilly winds amplify the sense of isolation and dread.

The Grand Lobby: The Grand Lobby buzzes with anticipation and intrigue, where laughter and soft conversations mingle with the distant echoes of the sea. Yet, beneath the surface, a palpable tension simmers, as guests navigate their hidden agendas amidst the opulence of the hotel's decor.. Camera angle: Entering this space, the writer should feel the energy oscillating between warmth and unease, capturing the duality of celebration and underlying suspicion.. Era: The atmosphere reflects the social dynamics of the 1940s, where the impact of war and societal changes shape interactions.

The Library: In the Library, a sense of mystery pervades the air, where the scent of old books and warm fire creates a cozy atmosphere. Yet, this sanctuary also holds the weight of secrets and unspoken truths, inviting guests to uncover the hidden clues that may lead to resolution.. Camera angle: As the writer enters, the camera captures the intimate, almost conspiratorial nature of the space, encouraging exploration and discovery.. Era: This space offers refuge from the chaos outside, where the war's impact on literature and knowledge reflects the era's intellectual tensions.

The Dining Room: The Dining Room exudes elegance and celebration, where the aroma of gourmet dishes mingles with the sounds of laughter. However, this festive atmosphere is underscored by an undercurrent of tension, as guests conceal their true intentions beneath the guise of conviviality.. Camera angle: Entering this space, the writer should feel the juxtaposition of festivity and secrecy, capturing the essence of the characters' hidden lives.. Era: The dining experience reflects the social rituals of the 1940s, where meal gatherings serve as a temporary escape from the realities of war.

## Humour guidance for this story position (opening)
Permission: forbidden
Rationale: The tone is serious due to the discovery of a murder.

FAIR-PLAY AND INFERENCE CONTRACT:
- FAIR PLAY CLUE TIMING: Never combine clue discovery and detective deduction in the same chapter. If a clue is first revealed to the reader in chapter N, the detective may only analyze, deduce from, or act on that clue in chapter N+1 or later.
- FAIR PLAY INFORMATION PARITY: The reader must see all clues BEFORE the detective uses them in reasoning. If the detective performs a test or makes a deduction, every piece of evidence supporting that conclusion must have been shown to the reader in earlier chapters.
- FAIR PLAY REVELATION SPACING: In the discriminating test scene, the detective can ONLY use clues that were revealed to the reader at least 1 full chapter earlier. Never introduce new clues or withheld information during the test.
- FAIR PLAY CONFRONTATION: During the final confrontation/revelation, the detective cannot surprise the reader with facts. Every piece of evidence cited must have been visible to the reader in prior chapters.
- Never solve by withheld information. Keep reader-information parity with detective reasoning.
- False assumption in force: The murder was committed by an unknown masked intruder.
- Hidden truth to progressively expose (compose in your own words from these elements): real, murderer, guest, disguised, costume, victim
- Inference path checkpoints to dramatize clearly — compose ENTIRELY in your own sentences from these key terms (reproducing any briefing phrase verbatim FAILS validation):
  - Step 1: obs: witnesses, reported, seeing, masked, figure, fleeing, scene | corr: figure, actually, captain, hale, disguised, himself, finch | effect: narrows, suspect, pool, captain, hale
  - Step 2: obs: torn, piece, fabric, near, crime, scene, matches, finch, costume | corr: fabric, indicates, someone, impersonating, finch | effect: eliminates, beatrice, quill, suspect
  - Step 3: obs: witnesses, noted, exact, timing, suspect, appearances, ball | corr: alibi, captain, hale, hold, seen, time, murder | effect: eliminates, captain, hale, alibi
- Discriminating test method: trap
- Discriminating test elements to dramatize (compose ENTIRELY in your own sentences from these — do NOT reproduce any briefing phrase verbatim): torn, fabric, crime, scene, captain, hale, costume, proves, impersonating, finch
- Test must rely on already-shown clue IDs: clue_2, clue_culprit_direct_1, clue_3, clue_culprit_direct_captain_ivor_hale
- Fair-play rationale: Step 1: Witness statements (early) indicate a masked figure's height, linking it to Captain Hale. Step 2: Fabric analysis (mid) eliminates Beatrice Quill. Step 3: Timing records (late) expose Hale's alibi, leading to the trap proving his guilt.

## Character Reference

### Eleanor Voss (she/her — NEVER he/him)
Eleanor speaks with a melodic lilt, often punctuating her sentences with thoughtful pauses
She tends to weave art-related metaphors into her speech, revealing her creative mind.
Eleanor grapples with the guilt of her affair with Captain Hale, fearing the scandal could ruin both their lives while she yearns for a future that feels increasingly unattainable.
Voice colour: Eleanor Voss uses dry wit humour — let it surface in their dialogue where natural, not in every line.

### Captain Ivor Hale (he/him — NEVER she/her)
Ivor speaks with a confident, almost theatrical flair, often using grand gestures
He has a tendency to punctuate his statements with a wry smile, masking the turmoil beneath his charm.
Ivor wrestles with his loyalty to family versus his feelings for Eleanor, fearing that the truth of his affair could lead to irrevocable consequences.
Voice colour: Captain Ivor Hale uses sardonic humour — let it surface in their dialogue where natural, not in every line.


## CHARACTER CONTRACTS (binding for this scene)
Each entry below constrains how this character must be written in this chapter.
These override generic style guidance when they conflict.

### Eleanor Voss[SHE]
Voice & mannerisms: Eleanor speaks with a melodic lilt, often punctuating her sentences with thoughtful pauses. She tends to weave art-related metaphors into her speech, revealing her creative mind.
SIGNATURE TIC (put a version of this in Eleanor Voss's mouth at least once, and never in anyone else's): "‘Life is but a canvas, isn’t it?’"
Sample voice fragments (match this register and rhythm):
  [comfortable] "‘Isn't it fascinating how the sea reflects our emotions? Like a canvas, it captures every hue of our heart.’"
  [evasive] "‘Oh, you know how rumors can swirl like the tides. I wouldn’t worry too much about them.’"
Humour: dry wit — deploy occasionally (level 0.5)
FORBIDDEN phrase (never write for Eleanor Voss): "a surge of determination washed over her"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Her artwork was worth a fortune, and many had financial interests tied to her success." — do not surface in Act I.

### Captain Ivor Hale[HE]
Voice & mannerisms: Ivor speaks with a confident, almost theatrical flair, often using grand gestures. He has a tendency to punctuate his statements with a wry smile, masking the turmoil beneath his charm.
SIGNATURE TIC (put a version of this in Captain Ivor Hale's mouth at least once, and never in anyone else's): "‘Duty calls, doesn’t it?’"
Sample voice fragments (match this register and rhythm):
  [comfortable] "‘Ah, the sea always has a way of calling us back to our true selves, doesn’t it?’"
  [evasive] "‘Let’s not dwell on the past; duty calls, and we must look forward.’"
Humour: sardonic — deploy occasionally (level 0.4)
FORBIDDEN phrase (never write for Captain Ivor Hale): "palpable tension filled the room"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "The potential scandal of his affair might lead to loss of both family and career." — do not surface in Act I.



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
An imposing seaside hotel that stands as a sentinel over the churning waves of the English Channel, hosting both guests and secrets.

Key Locations Available:
- The Oceanfront Veranda (exterior): Crime scene
- The Grand Lobby (interior): Gathering space
- The Library (interior): Clue discovery
- The Dining Room (interior): Gathering space for meals and discussions

Atmosphere (tonal cue only — do NOT reproduce this phrase verbatim in prose; translate into scene-specific, character-observed sensory language): Tense and suspenseful due to recent events and the lingering effects of war.
Weather: Overcast with occasional rain, typical of coastal climate in the 1940s.

Era markers: Art Deco architecture | distant radio broadcasting | rationed fuel for automobiles | post-war automobile boom | women's increased participation in the workforce

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
The Oceanfront Veranda (exterior):
  - Visual: crashing waves against cliffs, overturned glass on the floor, flickering lanterns casting shadows
  - Sounds: howling wind through the railing, distant seagulls crying, the rhythmic crash of the surf
  - Scents: salt and brine in the air, wet earth and seaweed, faint scent of spilled liquor
  - Touch: cold metal of the railing, rough stone underfoot

The Grand Lobby (interior):
  - Visual: gleaming marble floors, ornate moldings on the ceiling, colorful floral arrangements
  - Sounds: murmurs of conversation, soft music from a hidden radio, the rustle of silk dresses
  - Scents: freshly polished wood, bouquet of flowers, the faint scent of perfume
  - Touch: smoothness of marble underfoot, softness of plush upholstery

The Library (interior):
  - Visual: dust motes dancing in sunlight, books lined in neat rows, a warm fire flickering
  - Sounds: the crackling of the fire, pages turning softly, the creak of leather chairs
  - Scents: old leather and parchment, the scent of polished wood, smoky undertones from the fire
  - Touch: cool leather armchairs, rough texture of book spines

⛔ REFERENCE DATA — DO NOT TRANSCRIBE VERBATIM: The above profiles are structural guides only. Generate original prose that evokes these qualities; do not reproduce the exact phrasing or sentence structure of the profile paragraphs.

SCENE OPENING RULE: When opening a scene in a new location, write what the POV character directly observes and physically senses at that moment — not a general description of the room's qualitie
[truncated for prompt budget]

## Texture Pool
Draw on these as opportunities arise — you are not required to use them.

- Living through February 1942 means navigating a world reshaped by the realities of World War II
- The coastal town feels heavy with the weight of uncertainty, as rationing disrupts daily life and news from the front lines permeates conversations
- The community is tightly knit, with gatherings at the local hotel providing temporary escape from the troubles outside
- Yet, the looming specter of loss hangs over families, with loved ones either away at war or affected by the economic strains of this tumultuous period
- Amidst the chill of winter, the atmosphere is charged with both romantic anticipation for Valentine's Day and a foreboding sense of dread as the war intensifies.

TEMPORAL CONTEXT:

This story takes place in February 1942 during winter.

Seasonal Atmosphere:
- Weather patterns: overcast with occasional rain, chilly winds from the coast, damp streets reflecting the gray sky
- Daylight: Short winter days with diminishing light; the sun struggles to break through the clouds, setting around five in the evening.
- Seasonal activities: cozy gatherings near the fireplace, attending local dance halls for wartime entertainment, writing letters to soldiers overseas
- Seasonal occasions: Valentine's Day on February 14
- Season: winter

Period Fashion (describe naturally):
- Men formal: double-breasted wool suit in dark gray, white dress shirt with a high collar, silk tie featuring geometric patterns
- Men casual: tweed jacket with elbow patches, fitted trousers in muted colors, knitted wool sweater
- Men accessories: fedora hat with a narrow brim, leather gloves, pocket watch
- Women formal: elegant tea-length dress with a fitted waist, hat adorned with feathers and netting, pearl necklace
- Women casual: woolen cardigan over a blouse, pencil skirt with a matching belt, beret
- Women accessories: stylish handbag in leather, silk scarf tied around the neck, seamed stockings

Cultural Context (reference naturally):
- Music/entertainment: Glenn Miller's big band hits, Bing Crosby's romantic ballads, Duke Ellington's jazz compositions; Films: Casablanca, Mrs. Miniver; Theatre: The Glass Menagerie, The Man Who Came to Dinner; Radio: The Shadow, Amos 'n' Andy
- Typical prices: Loaf of bread: four pence, Cinema ticket: one shilling, Daily newspaper: three pence
- Current events: The United States faces increasing military engagement in WWII; Tensions rise in the Pacific after the attack on Pearl Harbor
- Literature: The Little Prince by Antoine de Saint-Exupéry | The Naked and the Dead by Norman Mailer | The Fountainhead by Ayn Rand | [war novels] | [detective fiction] | [romantic stories reflecting wartime separation]
- Technology: radar technology improving naval engagements | early computers for military logistics | advancements in radio communication | portable radios for families | basic television sets in urban areas | telephone booths as community hubs
- Daily life: attending community dances, participating in war bond drives, writing letters to loved ones
- Social rituals: gathering for radio broadcasts to listen to news, hosting potlucks to share rationed goods, holding local wartime charity events

Atmospheric Details:
The scent of damp earth and rain-soaked asphalt permeates the air, mingling with the faint aroma of coal smoke from nearby homes. Echoes of laughter and conversation drift through the corridors of the hotel, punctuated by the occasional clinking of glasses in the dimly lit lounge. Outside, the gray sky looms heavily over the coastal landscape, mirroring the tension within the hotel as secrets and suspicions linger just beneath the surface.

FASHION INTEGRATION TECHNIQUES:
- First appearance: Describe outfit to establish class/personality
- Accessories: Gloves, hats, pocket watches, jewelry reveal status
- Time-specific: Different outfits for different times of day
- Character traits: Fastidious dresser vs rumpled appearance
- Action integration: "She tugged at her glove" or "He adjusted his tie"
- Weather appropriate: Overcoats in winter, light linen in summer

CULT
[truncated for prompt budget]

NON-NEGOTIABLE CHAPTER OBLIGATIONS — LOCKED EVIDENCE VALUES (VERBATIM REQUIRED):
The following measured values (times, amounts, measurements) are absolute ground truth. Every time this chapter describes, mentions, or alludes to one — no matter how briefly — it MUST use the exact phrase shown below, character for character. NO paraphrase, approximation, rounding, or synonym is permitted.

FAILURE EXAMPLE: if the locked value is "at thirteen minutes to midnight" and you write "just before midnight" or "around midnight" — that is a HARD FAIL. You must write "at thirteen minutes to midnight". Equally, if the locked value is written in words, such as "ten minutes past eleven", and you convert it to figure-based clock notation — that is also a HARD FAIL. Words stay as words; figure forms are forbidden for word-phrased facts.

CRITICAL — WORD-PHRASED VALUES: If the canonical value is written out in words (e.g. a time like "ten minutes past eleven", or an amount like "forty minutes"), reproduce those exact words. DO NOT convert to figure-based time notation, twenty-four-hour format, or any other numeric shorthand. Correct: "ten minutes past eleven". WRONG: figure-based clock notation or numeric shorthand.

Locked values:
  - The precise time of death, as determined by the coroner's examination.: "ten minutes past eleven"
    ⛔ FORBIDDEN alternatives: "11:10", "11.10", "eleven ten", "eleven-ten", "eleven past ten", "quarter past eleven", "half past eleven" — the ONLY acceptable form is "ten minutes past eleven"
  - The number of identical costumes present at the masquerade, indicating potential for confusion.: "three identical costumes"

If a value has no relevance to this chapter, omit it. But the moment you reference the underlying evidence, only the exact phrase above is acceptable.

⛔ CLUES TO SURFACE IN THESE CHAPTERS — mandatory:
The following evidence MUST be clearly observable to an attentive reader. Do not bury it in atmosphere or passing dialogue. Each clue must be concrete, specific, and noticeable:

• [clue_core_contradiction_chain] witnesses, reported, seeing, masked, figure, fleeing, scene
  Category: testimonial | Criticality: essential | Supports inference step 1
  Points to: implies, unknown, assailant

• [clue_fp_contradiction_step_1] witnesses, reported, seeing, masked, figure, fleeing, scene
  Category: temporal | Criticality: essential | Supports inference step 1
  Points to: figure, actually, captain, hale, disguised, himself, finch

For each clue above: an attentive reader should be able to find, record, and later use it to reason toward the solution.

═══ NARRATIVE STATE (read-only — do not contradict) ═══

LOCKED FACTS — use verbatim whenever this evidence is described:
  • The precise time of death, as determined by the coroner's examination.: "ten minutes past eleven"
  • The number of identical costumes present at the masquerade, indicating potential for confusion.: "three identical costumes"

CHARACTER PRONOUNS — never deviate from these:
  • Eleanor Voss: she/her/her
  • Dr. Mallory Finch: she/her/her
  • Captain Ivor Hale: he/him/his
  • Beatrice Quill: she/her/her
  • Sylvia Trent: she/her/her
  • Hugo Vane: he/him/his

CLUES ALREADY REVEALED TO READER: clue_mechanism_visibility_core, clue_mid_1 — do not reveal these as new information.

INVESTIGATION LOG — WHAT IS ESTABLISHED (do not re-establish, do not repeat):
• Evidence already established (reference only — do NOT restate or quote these; advance beyond them): time, death | implies, unknown, assailant
• Suspects still unresolved: Beatrice Quill[SHE], Sylvia Trent[SHE], Hugo Vane[HE]
⚠ The story must move FORWARD from this log. Any beat already listed above is forbidden from repeating.

⚠ THIS CHAPTER'S REQUIRED ADVANCE (opening): Discover the body, confirm the victim, establish the scene. The victim is found dead. They do not speak, react, or gesture. This is their only physical appearance — in all subsequent chapters they exist only in past tense (memory, evidence, testimony).

CONTINUITY HANDOFF — previous chapter closing beat:
  • "Outside, the wind picked up, rattling the terrace doors and carrying with it the scent of salt and distant rain. The world beyond the ballroom remained indifferent to the tragedy within, but for those gathered in its shadowed expanse, the day had changed irrev..."
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
ballroom, terrace, corridor

✓ RULE: Continue using this location vocabulary. Maintain consistency with established setting type.
✓ Do NOT introduce new location types that contradict earlier chapters.

**Recent Chapter Summary (for narrative continuity):**
Chapter 1: Chapter 1: The Stopped Watch
  Events: A hush fell as Eleanor knelt beside Dr.

⚠️ **VALIDATION:** Character name mismatches and setting drift are common failure modes.
Double-check every character name against the list above before using it.

**⏱ LOCKED TIME ANCHOR — use verbatim, do not paraphrase:**
Clock time (from the case ground truth): **"9 PM"**
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
Known location profile anchors: The Cliffside Grand Hotel, The Oceanfront Veranda, The Grand Lobby, The Library, The Dining Room, the seaside ballroom
LOCATION NAME CAPITALISATION (HARD REQUIREMENT — validated):
All named locations in your prose MUST use the EXACT capitalisation from the CML profiles.
Canonical forms: "The Cliffside Grand Hotel", "The Oceanfront Veranda", "The Grand Lobby", "The Library", "The Dining Room", "the seaside ballroom"
Writing a location in lowercase (e.g. "drawing room" instead of "Drawing Room") is a validated error. Every time you mention a named location, copy its capitalisation from the list above.
- Chapter 2: OPENING STYLE (HARD): Start the VERY FIRST SENTENCE with spoken dialogue — e.g. '"[words]," [Name] said/asked/replied/murmured.' The opening quote must be the first character on the line. Anchor opening in "the seaside ballroom". The opening style above governs only your FIRST SENTENCE; the grounding below may land anywhere in the first 2 paragraphs (it need not be sentence one, and never conflicts with the chosen opening style). HARD REQUIREMENT for the first 2 paragraphs: (a) include 2+ sensory words — choose from smell/scent/odor/fragrance/sound/echo/silence/whisper/creak/cold/warm/damp/rough/smooth/glow/shadow/flicker/dim — and (b) include 1+ atmosphere/time word — choose from rain/wind/fog/storm/mist/thunder/evening/morning/night/dawn/dusk/lighting/weather/season/afternoon/midday/noon/midnight/twilight/sunrise/sunset/daylight/sunlight/overcast/cloudy/bright/dark/grey/pale/chill/crisp/drizzle/haze/lamplight/firelight. These are validated requirements, not style suggestions; missing them triggers a retry.

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

PROMPT BUDGET SUMMARY: budget=24000 tokens; fixed=9387; context=10669; dropped=[none]; truncated=[location_profiles, temporal_context, pronoun_accuracy]

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
4. Integrate at least two concrete era-grounded details per chapter from setting refinement signals: radio broadcasting | early television sets | basic radar systems | long-distance telephone calls | military encryption techniques | telegram services.
5. Respect setting movement/access constraints in scene action and alibis: narrow hallways limiting movement | oceanfront cliffs creating natural barriers | restricted access to staff-only areas | staff-only areas require permission from management | guest rooms can be accessed only with keys.
6. Sustain social coherence with this backdrop pressure: A masquerade ball at a grand seaside hotel draws together a diverse group, where the pressures of post-war life and the specter of Cold War tensions create a volatile atmosphere for hidden identities and secrets.
7. Maintain continuity around these socially central cast anchors where relevant: Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill, Sylvia Trent, Hugo Vane.
8. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Critical: Plot similarity 0.85 with 'The Second Key' (same impersonation crime method)
9. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Moderate: Character similarity 0.75 with 'The Second Key' (similar cast structure and roles)
10. STORY TO DATE ANTI-COPY RULE: The STORY TO DATE section below is provided for chronological and factual reference ONLY. You MUST NOT copy, lightly rephrase, or structurally echo any sentence or paragraph from prior chapters. Every sentence in this chapter must be original prose unique to this scene. Reusing even a clause from prior chapter text will cause this attempt to fail immediately.

CRITICAL PROSE REQUIREMENTS:

The CML specifies exact requirements for certain validation-critical scenes. You MUST include these elements at the specified positions.

**Discriminating Test Scene (Act 3, Scene 4):**
Required elements: Execute the discriminating test, Observe the result of the fabric match, Draw conclusion about Hale's guilt

**Suspect Clearance Scenes:**
- Beatrice Quill (Act 3, Scene 5): Fabric analysis proves she could not have worn the same material.
  Clues: clue_id_1, clue_id_2
- Hugo Vane (Act 3, Scene 5): Witness accounts and financial records disprove his alibi.
  Clues: clue_id_1, clue_id_2
- Sylvia Trent (Act 3, Scene 5): Alibi confirmed: 9 PM to 10 PM

**Culprit Revelation Scene (Act 3, Scene 6):**
Method: Confrontation with fabric evidence.

**Clue Placement for These Chapters:**
- clue_core_contradiction_chain must appear in Act 1, Scene 2 via Witness statement

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
Investigation state at start: 2 clue(s) revealed to reader; approximately 3 unresolved suspect(s).
Must change by end: Increase or complicate suspicion through a new pressure revelation — WITHOUT resolving the case: do NOT name, accuse, or extract a confession from the culprit, make an arrest, or declare the case closed (that is reserved for the final reveal).
Suspect pressure target(s): Captain Ivor Hale
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
- STYLE HARD-BAN: NEVER use these phrase families: "clock tower at quarter past three", "near the clock tower at quarter past", "showed quarter past three when the body", "in the formal gardens during the murder". Any occurrence triggers rejection/retry.
- STYLE SOFT-BAN: avoid these stock phrases and rewrite them if they appear in draft text: "lips pressed into a thin line", "the household runs smoothly when every cog", "the pressures upon this household are many", "the doctor [Surname] (use Dr. Surname or 'the doctor', never role + bare surname)", "the captain [Surname] (use Captain Surname or 'the captain', never role + bare surname)", "the inspector [Surname] (use Inspector Surname or 'the inspector', never role + bare surname)", "the sergeant [Surname] (use Sergeant Surname or 'the sergeant', never role + bare surname)", "the constable [Surname] (use Constable Surname or 'the constable', never role + bare surname)", "the gentleman [Surname] (use Mr. Surname or 'the gentleman', never role + bare surname)".
- STYLE WATCHLIST: keep these patterns varied and scene-specific: "quarter past three", "three fifteen", "the old bell striking three fifteen", "the chimes echoed just after three-fifteen".
- Chapter 2:
  - STRUCTURAL ARCHETYPE — Chapter 2 must be: FIRST_CONTACT
      ✓ MUST contain: at least two suspect interviews
      ✗ MUST NOT contain: physical evidence discovery
  - Word count: Target 1250 words. Achieve this through plot events, dialogue exchanges, and physical investigation — not through atmospheric repetition or extended internal reflection. Each 200-word segment should contain at minimum one concrete story event (a discovery, a conversation exchange, a physical action or movement). Padding with atmosphere alone is not acceptable.
  - Opening: Begin with a character action, spoken line, or clock/time marker — never a location name or location-description phrase.
  - Scene is set in: the seaside ballroom — reference it naturally within the paragraph, never as your opening phrase.
  - Opening atmosphere (MANDATORY — validator enforced): the first paragraph MUST contain at least one of: rain / wind / fog / storm / mist / thunder / evening / morning / night / dawn / dusk / season / afternoon / midday / noon / midnight / twilight / sunrise / sunset / daylight / sunlight / overcast / cloudy / bright / dark / grey / pale / cold / warm / chill / crisp / damp / drizzle / haze / lamplight / firelight. A chapter that omits all of these from its opening paragraph will be rejected.
  - PARAGRAPH OPENER DIVERSITY (MANDATORY — validator enforced): No more than 2 paragraphs in this chapter may begin with "Eleanor" or "Eleanor's" as the first word. You must vary paragraph openings throughout: use sensory observations, another character's name or action, dialogue, object or sound details, or temporal markers. Opening 3 or more paragraphs with "Eleanor" will cause automated rejection.
  - ⛔ MECHANISM SPOILER BAN: Do NOT state how the crime device was manipulated — not the direction, not the magnitude, not who performed it. Characters may only observe that two sources of evidence disagree. The specific method, tamper amount, and perpetrator's action are ALL FORBIDDEN until the reveal. WRONG: "The culprit had altered the device by forty minutes to create a false alibi." RIGHT: "Two independent pieces of evidence gave contradictory readings — a discrepancy neither could yet explain."
  - Continuity bridge: in the first 120 words, visibly connect from the previous chapter's final beat. Carry forward one unresolved element (object, accusation, emotional pressure, or immediate physical action) from: "Outside, the wind picked up, rattling the terrace doors and carrying with it the scent of salt and distant rain. The world beyond the ballroom remained indifferent to the tragedy within, but for those gathered in its sha...".
  - CLUE OBLIGATIONS — each clue below MUST be dramatized, but in YOUR OWN WORDS:
    Render each as something a character SEES, DOES, or SAYS on the page. The bracketed text is a
    DESCRIPTION of the evidence for you — do NOT transcribe it as narration. Copying a clue's
    description sentence verbatim into the prose FAILS validation.
    • witnesses, accounts, masked, figure [clue_core_contradiction_chain] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: implies, unknown, assailant
      ↳ MANDATORY TWO-PARAGRAPH STRUCTURE (must appear in paragraphs 1 or 2 — no later):
         Paragraph 1: The POV character physically approaches or directly observes this evidence.
           The narration or dialogue explicitly states what is seen (use the exact locked phrase if one applies).
         Paragraph 2 (immediately following): The detective or POV character explicitly reasons
           about what this evidence implies — who it implicates, why it may be unreliable,
           or what inference it supports. This must be a separate full paragraph, not a sentence appended to Paragraph 1.
    • precise, time, noted, coroner [clue_fp_contradiction_step_1] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: figure, actually, captain, hale, disguised, himself, finch
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
  - ALIBI LOCK: Captain Ivor Hale's established alibi is "9:30 PM to 10 PM". Do NOT place Captain Ivor Hale at any other location or in any other activity during the crime window. Any contradiction is a continuity error that triggers a retry.
  - TESTIMONY CONTINUITY: Captain Ivor Hale has already made statements in earlier chapters. Any time, location, or claim attributed to Captain Ivor Hale in THIS chapter must be consistent with those earlier statements. Do NOT introduce a new or different alibi claim — any contradiction is a continuity error.
- Locked fact phrase obligations:
  - If this batch mentions The precise time of death, as determined by the coroner's examination., write exactly: "ten minutes past eleven".
  - If this batch mentions The number of identical costumes present at the masquerade, indicating potential for confusion., write exactly: "three identical costumes".
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
Investigation state at start: 2 clue(s) revealed to reader; approximately 3 unresolved suspect(s).
Must change by end: Increase or complicate suspicion through a new pressure revelation — WITHOUT resolving the case: do NOT name, accuse, or extract a confession from the culprit, make an arrest, or declare the case closed (that is reserved for the final reveal).
Suspect pressure target(s): Captain Ivor Hale
Required new information: At least one fear/motive/lie/loyalty reveal with investigative consequence.
Forbidden reveals at this stage: No culprit resolution: no confession, no arrest, no 'case closed', no accusation ('I accuse'/'I name'), and never state 'the culprit/murderer/killer is/was …'. The accusation is reserved for the final reveal — build suspicion only.

FROZEN FACT STATE (DO NOT ALTER):
- Timeline anchor: February (winter).
- Month, season, weather, and time-of-year language in this batch must stay compatible with winter.
- Established timeline fact: 9 PM
- Established timeline fact: 10 PM
- If referenced, use exact phrase: "ten minutes past eleven" (The precise time of death, as determined by the coroner's examination.).
- If referenced, use exact phrase: "three identical costumes" (The number of identical costumes present at the masquerade, indicating potential for confusion.).

STORY TO DATE (REFERENCE ONLY — DO NOT COPY VERBATIM):
- Full prior chapter text is provided below for continuity, factual consistency, and reference accuracy.
- Use this to keep character voice, chronology, clue state, and location continuity aligned with earlier chapters.
- Do not quote, copy, or paraphrase these paragraphs too closely; write fresh prose that remains consistent with them.

--- BEGIN PRIOR CHAPTER 1 ---
Title: Chapter 1: The Stopped Watch
Eleanor Voss pressed her gloved hand to the ballroom’s frosted glass door, the chill of the midwinter morning seeping through the pane and into her bones. The distant roar of the sea, muffled by the heavy curtains, mingled with the faint scent of spilt liquor and the lingering perfume of last night’s festivities. As she stepped into the seaside ballroom, her shoes tapped against the polished floor, the echo swallowed by the hush that had settled over the room. The golden light from the overcast sky struggled through the tall windows, casting pale shadows across the carnage of overturned chairs and scattered masquerade masks. In the centre of the chaos, Dr. Mallory Finch lay motionless, her elegant costume rumpled and her hand curled tightly around a silver pocket watch—its face frozen at ten minutes past eleven.

A hush fell as Eleanor knelt beside Dr. Mallory Finch, her breath clouding in the cold air. The watch’s unmoving hands, so precise in their accusation, seemed to shout above the silence: the death had occurred no later than ten minutes past eleven. Eleanor’s gaze drifted to the broken glass glinting nearby, and then to the faint, hurried footprints leading toward the terrace doors. She rose, her mind already sorting the discordant details—the stopped watch, the disarray, and the sharp memory of masked laughter echoing from the previous night. Someone had reported seeing a masked figure fleeing the scene, their identity lost in the confusion of identical costumes and flickering candlelight.

The contradiction gnawed at her: if the watch was correct, then the carefully rehearsed alibis of the guests—each one so eager to place themselves elsewhere at that crucial hour—were suddenly cast into doubt. Eleanor’s thoughts flickered to the whispered accounts she had gathered in the corridor: three identical costumes had been worn at the masquerade, a detail that would have seemed a harmless lark if not for the gravity of the morning. She straightened, her expression composed, but her artist’s eye caught every tremor in the room’s atmosphere. Life is but a canvas, isn’t it? she thought, and someone had painted a scene of violence here.

Captain Ivor Hale stood near the shattered remnants of a wine decanter, his naval uniform immaculate beneath a borrowed masquerade cloak. The crisp lines of his posture belied the tension in his jaw, and his gloved hand lingered a moment too long on the back of a velvet chair. ‘Duty calls, doesn’t it?’ he said, his voice pitched low, eyes fixed on the motionless form of Dr. Mallory Finch. Eleanor studied him, noting the way his gaze flickered away from the body, as if unwilling to meet the reality of what had transpired. In the hush, the sound of the wind rattling the terrace doors seemed to fill the space between them.

‘You were here last night, Captain?’ Eleanor’s question was gentle, but the undercurrent was unmistakable. She watched as he drew himself up, the theatrical confidence in his bearing momentarily faltering. ‘I was in the ballroom for the opening dance, then stepped out for air. The details—well, they seem rather blurred now.’ His words trailed off, and Eleanor caught the way his fingers tightened around the edge of his cloak. She made a mental note: nervous when pressed, and too quick to retreat behind the shield of duty.

The ballroom’s silence was broken only by the distant crash of waves against the cliffs and the soft murmur of a constable conferring with the hotel manager near the entrance. Eleanor scanned the faces of the onlookers—Beatrice Quill, her eyes red-rimmed but dry; Sylvia Trent, clutching her handbag with white-knuckled resolve; Hugo Vane, whose habitual smirk had been replaced by a look of wary calculation. Each had reason to be present, each had something to lose. Yet it was the memory of the masked figure—reported by more than one guest, always described as tall, cloaked, and moving with desperate haste—that lingered in Eleanor’s mind.

She turned back to the body. Dr. Mallory Finch’s hands, so often steady in the operating theatre, now lay stilled by violence. The faintest trace of a frown remained on her brow, as if she had glimpsed her killer in the final moment. Eleanor’s gaze returned to the pocket watch, its silver case catching the watery light. The contradiction was plain: the time of death fixed at ten minutes past eleven, yet the accounts of the masked figure suggested a flight well after that hour. Was the watch a silent witness, or had it been staged to mislead?

A shiver ran through Eleanor as she rose, brushing the dust from her skirt. The war had taught her that appearances were seldom to be trusted, and here, amid the faded grandeur of The Cliffside Grand Hotel, the masquerade had turned deadly. She addressed the gathering with a calm she did not entirely feel. ‘We must begin at the beginning. Dr. Finch deserves clarity, and so do we.’ Her words carried the authority of someone accustomed to observation, not command, but in the absence of certainty, it was enough.

As the morning light grew stronger, the ballroom’s shadows retreated, revealing more of the night’s disarray: a torn ribbon near the dais, a single glove abandoned by the grand piano, the faint smudge of powder on the parquet floor. Each detail clamoured for attention, yet the heart of the matter remained the same—the stopped watch, the masked figure, and the knowledge that someone among them had crossed a line that could never be uncrossed. Eleanor’s mind began to map the possibilities, her artist’s intuition guiding her through the labyrinth of motive and means.

Outside, the wind picked up, rattling the terrace doors and carrying with it the scent of salt and distant rain. The world beyond the ballroom remained indifferent to the tragedy within, but for those gathered in its shadowed expanse, the day had changed irrevocably. Eleanor allowed herself a single, silent moment of regret before she drew a deep breath and turned to the task ahead. There would be time enough for grief later. For now, the work of unraveling the masquerade had only just begun.
--- END PRIOR CHAPTER 1 ---

[SCENE COMPLETENESS CONTRACTS — MANDATORY. Each contract below lists what you MUST enact in that chapter. Do not summarise or mention these labels in the prose — enact them organically.]
Chapter 2 (Act 1) completeness contract:
  PIVOT ELEMENT (MANDATORY — write this into the prose, shown not told): "Witness statements contradict each other regarding the timeline of events."
  FACT ESTABLISHED (MANDATORY — reader must know this by chapter end): "Establishes conflicting accounts of the murder's timing, raising suspicions about the suspects."

# Case Overview
Title: Masquerade of Authority
Era: 1940s
Setting: English seaside
Crime: murder (impersonation)
Culprit: Captain Ivor Hale
Victim: Dr. Mallory Finch
False assumption: The murder was committed by an unknown masked intruder.
Cast: Eleanor Voss (she/her), Dr. Mallory Finch (she/her), Captain Ivor Hale (he/him), Beatrice Quill (she/her), Sylvia Trent (she/her), Hugo Vane (he/him)

Setting Lock: Keep all scenes and descriptions consistent with the stated setting (English seaside). Do not introduce a different location type. Do not invent an alternative estate name. The only permitted name for this property is "English seaside" — any other estate name (e.g., "Caldwell Manor", "Ashwood Hall", or any invented proper name) is a continuity error that will be caught and rejected.

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
      "location": "the seaside ballroom",
      "timeOfDay": "Morning after the murder",
      "atmosphere": "Heavy with tension and confusion"
    },
    "characters": [
      "Eleanor Voss",
      "Dr. Mallory Finch",
      "Captain Ivor Hale"
    ],
    "purpose": "Establish the atmosphere and initial reactions to the crime",
    "cluesRevealed": [
      "clue_core_contradiction_chain",
      "clue_fp_contradiction_step_1"
    ],
    "dramaticElements": {
      "conflict": "Tensions rise as suspicions begin to form",
      "tension": "Conflicting accounts create unease among the characters",
      "microMomentBeats": [
        "Eleanor's heart races as she feels the weight of the room's suspicion on her."
      ]
    },
    "summary": "As the group processes the shocking discovery, conflicting accounts of the previous night emerge. Dr. Finch insists she left the ballroom at eleven, while Hale claims he saw Finch just before the murder. Eleanor senses the growing tension and begins to suspect deceit.",
    "beat": "crime",
    "estimatedWordCount": 1250,
    "pivotElement": "Witness statements contradict each other regarding the timeline of events.",
    "factEstablished": "Establishes conflicting accounts of the murder's timing, raising suspicions about the suspects.",
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
      }
    ],
    "redHerringPlacement": null,
    "emotionalRegister": "Eleanor's determination to uncover the truth is met with rising tension and confusion among guests.",
    "dominantCharacterNote": {
      "name": "Eleanor Voss",
      "voiceRegister": "Eleanor's voice carries a melodic lilt, often imbued with the passion of an artist."
    },
    "humourGuidance": {
      "permission": "permitted",
      "character": "Eleanor Voss",
      "form": "dry_wit"
    },
    "eraTextureNote": "Limited transportation options due to fuel rationing.; Short daylight hours complicate evening activities.; Frequent weather disruptions hinder outdoor events.",
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
□ Chapter 2: the clue [clue_core_contradiction_chain] (witnesses, reported, seeing, masked, figure, fleeing, scene) is placed in the first 25% of the chapter, dramatized in your own words, followed by an explicit inference or suspicion paragraph.
□ Chapter 2: the clue [clue_fp_contradiction_step_1] (witnesses, reported, seeing, masked, figure, fleeing, scene) is placed in the first 25% of the chapter, dramatized in your own words, followed by an explicit inference or suspicion paragraph.
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
