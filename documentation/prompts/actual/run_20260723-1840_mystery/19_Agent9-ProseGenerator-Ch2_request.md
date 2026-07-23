# Actual Prompt Record

- Run ID: `mystery-1784832044130`
- Project ID: ``
- Timestamp: `2026-07-23T18:46:42.894Z`
- Agent: `Agent9-ProseGenerator-Ch2`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4.1`
- Temperature: `0.42`
- Max Tokens: `4500`
- Attempt: `first`
- Prompt Hash: `04dcb8b1b606170a`

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
- MORAL COMPLEXITY REQUIREMENT: The mechanism of this crime carries a moral gray area: "The accomplice acted out of loyalty to a friend, blurring the lines between justice and complicity." — the culprit reveal and denouement MUST acknowledge this ambiguity. Do not let the ending feel clean or simple. Give the reader at least one moment of uncomfortable sympathy or moral doubt.

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
   - Dr. Mallory Finch: Professional Rival
   - Captain Ivor Hale: Old Guard
   - Beatrice Quill: Idealist
   - Sylvia Trent: Bystander
   - Hugo Vane: Curious Outsider
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

## Era: 1947-05
In May 1947, life is imbued with a palpable tension as communities grapple with the aftermath of World War II. The air is heavy with the scent of damp earth and blooming lilacs, hinting at the reluctant embrace of spring. The uncertainty of daily life is reflected in the persistent gray skies, as overcast weather and intermittent rain create an oppressive backdrop for social interactions. Streets that were once bustling with the vibrancy of wartime camaraderie are now marked by a sense of introspection and anxiety, with whispers of political unrest and economic instability echoing through the narrow alleyways. As the sun sets around 8:30 PM, the twilight hours offer a brief reprieve from the heaviness of reality, yet the collective anxiety remains, coloring conversations with hushed tones and furtive glances. The social fabric is woven with rituals like afternoon teas and church services, where communities seek solace in shared experiences, even as the specter of war's aftermath looms large.
Emotional register: A collective sense of unease and introspection permeates society as people navigate the complexities of a post-war world.
Physical constraints: Rationing of goods affecting daily life | Limited access to modern transportation due to fuel shortages | The lingering impacts of wartime damage on infrastructure | Communication delays exacerbated by the post-war environment
Current tensions (weave into background texture): Economic recovery marked by inflation and shortages | Political unrest due to the Berlin Blockade | Social issues surrounding veterans' rights and reintegration
Wartime context — Many are grappling with the psychological scars of war, with veterans returning to a world that feels foreign and unwelcoming.: The workforce is evolving, with women stepping into roles traditionally held by men, creating both opportunity and tension. Absence effect: The absence of loved ones lost in the war leaves a void that resonates through families and communities, complicating everyday interactions.

## Story Theme
In a post-war society, the façade of authority becomes a dangerous masquerade, exposing the fragility of human connections and the hidden motives that drive individuals to commit unspeakable acts.

## Story Emotional Register
Dominant: A journey through tension and discovery, ultimately revealing the complexity of human motives.

Arc:
The story opens with an air of festivity at the Driftwood Hotel during a masquerade ball, where the charm of the evening is quickly shattered by the discovery of Eleanor Voss's strangled body on the observation deck. Guests who were once lively now find themselves steeped in dread, their faces masked not just by costumes but by secrets they wish to keep hidden. As the investigation unfolds, the initial sense of unease mounts with the discovery of conflicting alibis and the emergence of personal grudges. Each character's hidden motives breathe life into the investigation, leading the detective through a maze of deception and false leads, heightening the emotional stakes as the truth remains elusive.

A crucial turning point occurs when a witness's recollection reveals a time discrepancy that shifts the focus of the investigation onto Captain Ivor Hale. This pivotal moment recalibrates the narrative, prompting the detective and readers alike to reconsider earlier events with fresh eyes. As the investigation deepens, new revelations expose the intricate connections between the characters, illuminating how jealousy, ambition, and betrayal intertwine.

The climax builds as the detective confronts Hale, armed with evidence that exposes his impersonation during the murder, revealing the lengths to which he has gone to manipulate authority. The mounting pressure culminates in a tense showdown where secrets unravel, and relationships are tested. In the resolution, the emotional cost of the truth weighs heavily on all involved; Eleanor's death ultimately forces each character to confront their inner demons and the consequences of their actions. The masquerade of authority is dismantled, leaving behind a haunting reminder of the fragility of human connections and the hidden motives that drive individuals to commit unspeakable acts.

## Emotional register at this point in the story
The atmosphere is festive yet tinged with an underlying tension, hinting at the chaos to come.

## Character Portraits (appearance & era)

### Dr. Mallory Finch
Dr. Mallory Finch symbolizes the professional rivalries that have emerged as women assert their place in the workforce. Her struggles with financial instability and the need for validation highlight the precariousness of post-war careers, while her relationship with the victim reveals the personal stakes intertwined with professional aspirations in a rapidly changing world.
Era intersection: Mallory's ambition is both a reflection of and a challenge to the expectations placed upon women as they navigate newfound opportunities.

### Captain Ivor Hale
Captain Ivor Hale represents the struggle for respect in a post-war society that is both nostalgic for the past and wary of the future. His gregarious persona masks a deep-seated grudge against the victim, revealing the fragility of social standing in a community grappling with its identity after the war. His character embodies the tension between authority and vulnerability in a changing world.
Era intersection: Ivor's desire to reclaim his reputation reflects the broader societal struggle for men returning from war to find their place in a world that has evolved without them.

### Hugo Vane
Hugo Vane, a detective with a personal vendetta against the hotel, embodies the complexities of navigating personal grievances within the context of a broader societal shift. His character reflects the challenges faced by individuals who must reconcile their past experiences with the realities of a post-war environment, adding layers to the investigation as he seeks justice.
Era intersection: His motivations for investigating mirror the struggle for redemption faced by many returning from war, highlighting the personal stakes in a rapidly evolving society.

## Character Voices

### Dr. Mallory Finch (she/her/her)
Dr. Finch's speech is marked by clinical precision, laced with sardonic observations that hint at her personal struggles.
[comfortable] Well, you know what they say about doctors… we’re often the worst patients.
[evasive] Oh, I didn’t see anything unusual. Just the usual chaos of a busy evening.
[stressed] This could ruin everything I’ve worked for; I can’t let it happen.
Humour: Her sardonic humor often serves to deflect discomfort about her insecurities.

### Captain Ivor Hale (he/him/his)
Ivor's booming voice carries a sense of authority, often punctuated by dramatic flair reflecting his naval past.
[comfortable] In my day, we commanded respect, and that’s what I expect!
[evasive] That’s not something we need to dwell on; let’s focus on the present.
[stressed] I can’t let this tarnish my name further; I need to regain my standing.
Humour: His observational humor often masks the deeper insecurities he grapples with.

### Hugo Vane (he/him/his)
Hugo's charming, inquisitive tone often leads conversations into deeper waters, using dry humor to engage others.
[comfortable] Isn’t it curious how people reveal their true selves under pressure?
[evasive] I’m not here to stir the pot; just seeking the truth, really.
[stressed] This investigation feels like it’s unearthing more than just a murder.
Humour: His dry wit adds depth to his character and invites others to lower their defenses.

## Location Registers (scene framing guides)

The Seaside Observation Deck: The observation deck feels eerie and oppressive, with the sound of crashing waves echoing the turmoil of the crime that took place here. The air is thick with salt and the weight of secrets, casting an unsettling pall over everything.. Camera angle: A writer entering this space should capture the tension in the air, reflecting the interplay of nature's beauty and the darkness of human intentions.. Era: The remnants of post-war anxiety linger here, as the deck serves as a haunting reminder of the fragility of life.

The Driftwood Lobby: The lobby exudes a warm yet tense atmosphere, where the mingling of guests creates an illusion of comfort, masking the underlying anxieties of post-war life. The scent of tea mingles with the chatter, creating a deceptive sense of normalcy.. Camera angle: A writer should approach this space with a sense of intimacy, capturing both the warmth and the hidden tensions that define the interactions within.. Era: The lobby serves as a microcosm of the changing social dynamics, with individuals navigating their new roles in a shifting landscape.

The Driftwood Dining Room: The dining room feels inviting yet filled with unspoken tension, as guests share meals under the flickering candlelight. The aromas of freshly prepared dishes mingle with whispered conversations, hinting at secrets and hidden motives.. Camera angle: A writer should focus on the contrasts present—between the warmth of shared meals and the coldness of underlying tensions—inviting readers to feel the weight of hidden agendas.. Era: The setting serves as a backdrop for the exploration of social dynamics, where the aftermath of war influences every interaction.

The Driftwood Library: The library is steeped in introspection, with shadows and dust lending an air of mystery. The soft rustle of pages turning creates a sanctuary where secrets lie hidden among the tomes, evoking a sense of quiet urgency.. Camera angle: A writer should evoke a sense of exploration and discovery, capturing the quiet tension that lies within the pages of forgotten stories.. Era: The dim light reflects the uncertain future, symbolizing the search for answers in a world still grappling with the past.

## Humour guidance for this story position (opening)
Permission: forbidden
Rationale: The opening scene's tone must reflect the tension surrounding the murder.

FAIR-PLAY AND INFERENCE CONTRACT:
- FAIR PLAY CLUE TIMING: Never combine clue discovery and detective deduction in the same chapter. If a clue is first revealed to the reader in chapter N, the detective may only analyze, deduce from, or act on that clue in chapter N+1 or later.
- FAIR PLAY INFORMATION PARITY: The reader must see all clues BEFORE the detective uses them in reasoning. If the detective performs a test or makes a deduction, every piece of evidence supporting that conclusion must have been shown to the reader in earlier chapters.
- FAIR PLAY REVELATION SPACING: In the discriminating test scene, the detective can ONLY use clues that were revealed to the reader at least 1 full chapter earlier. Never introduce new clues or withheld information during the test.
- FAIR PLAY CONFRONTATION: During the final confrontation/revelation, the detective cannot surprise the reader with facts. Every piece of evidence cited must have been visible to the reader in prior chapters.
- Never solve by withheld information. Keep reader-information parity with detective reasoning.
- False assumption in force: Dr. Mallory Finch was with Eleanor Voss at the time of the murder.
- Hidden truth to progressively expose (compose in your own words from these elements): actual, switch, hale, finch
- Inference path checkpoints to dramatize clearly — compose ENTIRELY in your own sentences from these key terms (reproducing any briefing phrase verbatim FAILS validation):
  - Step 1: obs: witnesses, recall, seeing, finch, blue, dress, time, murder | corr: finch, wearing, blue, dress, described, witnesses, indicating, switched, outfits | effect: eliminates, finch, murderer
  - Step 2: obs: pair, shoes, distinctive, tread, pattern, matching, captain, hale, near, scene | corr: tread, pattern, indicates, captain, hale, present, scene | effect: narrows, suspects, captain, hale
  - Step 3: obs: hotel, logs, show, discrepancies, timeline, events | corr: logs, indicate, murder, occurred, time, hale, supposedly, impersonating, finch | effect: narrows, timeline, captain, hale, opportunity
- Discriminating test method: trap
- Discriminating test elements to dramatize (compose ENTIRELY in your own sentences from these — do NOT reproduce any briefing phrase verbatim): reenact, witnesses, accounts, evening, identify, real, captain, hale
- Test must rely on already-shown clue IDs: clue_early_1, clue_core_contradiction_chain, clue_culprit_direct_1
- Fair-play rationale: Step 1: Witnesses' descriptions of the blue dress (early) and the location of the dress (mid) lead to a contradiction in Finch's alibi. Step 2: The shoe prints (mid) indicate Hale's presence at the scene. Step 3: The hotel logs (late) confirm the narrowed timeline that implicates Hale.

## Character Reference

### Dr. Mallory Finch (she/her — NEVER he/him)
Speaks with a clinical precision, but often punctuates her dialogue with sardonic observations about human nature.
Battles feelings of inadequacy stemming from her need for validation from her peers and the community.
Voice colour: Dr. Mallory Finch uses sardonic humour — let it surface in their dialogue where natural, not in every line.

### Captain Ivor Hale (he/him — NEVER she/her)
Speaks in a booming voice, often punctuating his stories with dramatic flair and a hearty laugh, but has a tendency to turn serious when discussing personal matters.
Struggles with the embarrassment of his past and the fear that he no longer commands respect.
Voice colour: Captain Ivor Hale uses observational humour — let it surface in their dialogue where natural, not in every line.

### Hugo Vane (he/him — NEVER she/her)
Speaks in a smooth, conversational style, often infused with dry humor and curiosity, using questions to guide conversations.
Struggles with his motivations for investigating, torn between personal vendetta and a genuine desire for justice.
Voice colour: Hugo Vane uses dry wit humour — let it surface in their dialogue where natural, not in every line.


## CHARACTER CONTRACTS (binding for this scene)
Each entry below constrains how this character must be written in this chapter.
These override generic style guidance when they conflict.

### Dr. Mallory Finch[SHE]
Voice & mannerisms: Speaks with a clinical precision, but often punctuates her dialogue with sardonic observations about human nature.
SIGNATURE TIC (use sparingly — this is Dr. Mallory Finch's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "‘Well, you know what they say about doctors…’"
Sample voice fragments (match this register and rhythm):
  [comfortable] "Well, you know what they say about doctors… we’re often the worst patients."
  [evasive] "Oh, I didn’t see anything unusual. Just the usual chaos of a busy evening."
Humour: sardonic — deploy occasionally (level 0.5)
FORBIDDEN phrase (never write for Dr. Mallory Finch): "palpable tension filled the room"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Believes the victim's death could elevate her standing in the community and allow her to gain the trust of the hotel staff." — do not surface in Act I.

### Captain Ivor Hale[HE]
Voice & mannerisms: Speaks in a booming voice, often punctuating his stories with dramatic flair and a hearty laugh, but has a tendency to turn serious when discussing personal matters.
SIGNATURE TIC (use sparingly — this is Captain Ivor Hale's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "‘In my day, we…’"
Sample voice fragments (match this register and rhythm):
  [comfortable] "In my day, we commanded respect, and that’s what I expect!"
  [evasive] "That’s not something we need to dwell on; let’s focus on the present."
Humour: observational — deploy occasionally (level 0.6)
FORBIDDEN phrase (never write for Captain Ivor Hale): "everyone could sense the atmosphere"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Sought to regain respect and authority within the community by silencing the victim." — do not surface in Act I.

### Hugo Vane[HE]
Voice & mannerisms: Speaks in a smooth, conversational style, often infused with dry humor and curiosity, using questions to guide conversations.
SIGNATURE TIC (use sparingly — this is Hugo Vane's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "‘Isn’t it curious how…’"
Sample voice fragments (match this register and rhythm):
  [comfortable] "Isn’t it curious how people reveal their true selves under pressure?"
  [evasive] "I’m not here to stir the pot; just seeking the truth, really."
Humour: dry wit — deploy occasionally (level 0.6)
FORBIDDEN phrase (never write for Hugo Vane): "a surge of determination washed over her"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "His past experience with the hotel connects him deeply to the case, leading to his investigation." — do not surface in Act I.



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

Primary Location: The Driftwood Hotel (Whitstable, England)
A modest seaside hotel with Art Deco influences, offering rustic charm and ocean views, frequented by locals and tourists.

Key Locations Available:
- The Seaside Observation Deck (exterior): Crime scene
- The Driftwood Lobby (interior): Gathering space
- The Driftwood Dining Room (interior): Clue discovery
- The Driftwood Library (interior): Clue discovery

Atmosphere (tonal cue only — do NOT reproduce this phrase verbatim in prose; translate into scene-specific, character-observed sensory language): tense and uncertain, reflecting the recent end of WWII and lingering anxieties about the future
Weather: overcast with intermittent rain, typical of coastal climates

Era markers: Faded Art Deco furnishings | Crackling radio broadcasting news | Rationed fuel and post-war automobile boom | Furtive conversations in narrow hallways

USAGE GUIDELINES:
1. First mention of location: Ground the scene using sensory details drawn from the profiles — paraphrase these into what the POV character directly observes and experiences, not a summary of the room's general qualities
2. Geographic grounding: Reference the specific place (Whitstable, England) naturally in dialogue or narrative
3. Action scenes: Integrate physical layout details (access, sightlines, constraints)
4. Atmospheric scenes: Reference weather, lighting, sounds from sensory palette
5. Era details: Weave in period markers naturally
6. Consistency: Keep all location descriptions aligned with profiles
7. OPENING GROUNDING (required, first 1-2 paragraphs of EVERY chapter): (a) name the specific location from this list, (b) give at least 2 concrete sensory details (sound, smell, temperature, texture, light/shadow), and (c) one time-of-day or weather/atmosphere detail — BEFORE advancing plot, clues, or the mechanism. Open on the setting and the people in it, not on the puzzle.
8. This matters most in pre-reveal chapters that withhold the mechanism: ground them in setting and character rather than rushing the investigation — a withheld chapter is not an empty one.
9. Do NOT use generic repeated manor/storm filler without profile-specific details; vary the opening location/sense each chapter

SENSORY PALETTE (use 2-3 senses per scene):
The Seaside Observation Deck (exterior):
  - Visual: grey waves crashing against rocks, dilapidated wooden railings, storm clouds gathering overhead
  - Sounds: roaring surf, howling wind, distant gull cries
  - Scents: salt and brine, wet earth and seaweed, damp wood
  - Touch: rough wooden planks, cold metal railings

The Driftwood Lobby (interior):
  - Visual: faded wallpaper with floral motifs, dust motes dancing in the light, antique furniture with a polished sheen
  - Sounds: soft chatter of guests, the crackle of radio announcements, the creak of floorboards
  - Scents: freshly brewed tea, polished wood and furniture polish, the faint scent of tobacco
  - Touch: soft upholstery of armchairs, cool surface of marble counter

The Driftwood Dining Room (interior):
  - Visual: large windows framing the sea, table settings with faded linens, the flicker of candlelight
  - Sounds: clinking of cutlery, muffled conversations, the soft music from a radio
  - Scents: aroma of roasted meats, freshly baked bread, the scent of herbs and spices
  - Touch: smooth wooden tabletops, the coolness of glassware

⛔ REFERENCE DATA — DO NOT TRANSCRIBE VERBATIM: The above profiles are structural guides only. Generate original prose that evokes these qualities; do not reproduce the exact phrasing or sentence structure of the profile paragraphs.

SCENE OPENING RULE: When opening a scene in a new location, write what the POV character directly observes and physically senses at that moment — not a general description of the room's qualities. The reader must feel present, not bri
[truncated for prompt budget]

## Texture Pool
Draw on these as opportunities arise — you are not required to use them.

- In May 1947, life is imbued with a palpable tension as communities grapple with the aftermath of World War II
- The air is heavy with the scent of damp earth and blooming lilacs, hinting at the reluctant embrace of spring
- The uncertainty of daily life is reflected in the persistent gray skies, as overcast weather and intermittent rain create an oppressive backdrop for social interactions
- Streets that were once bustling with the vibrancy of wartime camaraderie are now marked by a sense of introspection and anxiety, with whispers of political unrest and economic instability echoing through the narrow alleyways
- As the sun sets around 8:30 PM, the twilight hours offer a brief reprieve from the heaviness of reality, yet the collective anxiety remains, coloring conversations with hushed tones and furtive glances

TEMPORAL CONTEXT:

This story takes place in May 1947 during spring.

Seasonal Atmosphere:
- Weather patterns: overcast with intermittent rain, occasional gusts of wind, cool temperatures around 55°F (13°C)
- Daylight: Days are gradually lengthening, with sunset occurring around 8:30 PM, allowing for a few lingering hours of twilight.
- Seasonal activities: spring cleaning in homes, preparation for upcoming summer events, outdoor gatherings despite the weather
- Seasonal occasions: May Day (May 1), Mother's Day (May 11)
- Season: spring

Period Fashion (describe naturally):
- Men formal: double-breasted suit jackets, lightweight wool trousers, fedoras
- Men casual: button-down shirts, tweed blazers, slacks
- Men accessories: silk ties, cufflinks, wristwatches
- Women formal: tea-length dresses with floral patterns, tailored blouses, swing skirts
- Women casual: capri pants, knit sweaters, blouses with Peter Pan collars
- Women accessories: small hats with veils, pearl necklaces, gloves

Cultural Context (reference naturally):
- Music/entertainment: 'Nature Boy' by Nat King Cole, 'Chantilly Lace' by The Big Bopper, Doris Day's 'Que Sera, Sera'; Films: 'Gentlemen's Agreement', 'Miracle on 34th Street'; Theatre: 'Death of a Salesman' by Arthur Miller, 'A Streetcar Named Desire' by Tennessee Williams; Radio: The Jack Benny Program, Your Hit Parade
- Typical prices: Loaf of bread: four pence, Movie ticket: one shilling, Cup of coffee: six pence
- Current events: the beginning of the Marshall Plan to aid European recovery; tensions arising from the Berlin Blockade
- Literature: 'The Catcher in the Rye' by J.D. Salinger | 'The Bell Jar' by Sylvia Plath | 'Invisible Man' by Ralph Ellison | [post-war realism] | [mystery fiction] | [social commentary]
- Technology: the first commercial microwave oven | the transistor radio | early prototypes of television remote controls | table radios | bicycles | typewriters
- Daily life: garden planting as the frost recedes, participating in local events and fairs, attending radio shows and community gatherings
- Social rituals: weekly church services, afternoon tea gatherings, neighborhood block parties

Atmospheric Details:
The air is thick with the scent of damp earth and blooming lilacs, a testament to spring's reluctant embrace in the coastal town. The echo of rain on the hotel windows creates a rhythmic backdrop as guests murmur in hushed tones, the tension palpable beneath the surface. A low hum of conversation fills the lounge, punctuated by the crackling of the radio, where distant melodies provide a fleeting escape from the uncertainty of the world outside.

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
- Class indicators: Aristocrats disc
[truncated for prompt budget]

NON-NEGOTIABLE CHAPTER OBLIGATIONS — LOCKED EVIDENCE VALUES (VERBATIM REQUIRED):
The following measured values (times, amounts, measurements) are absolute ground truth. Every time this chapter describes, mentions, or alludes to one — no matter how briefly — it MUST use the exact phrase shown below, character for character. NO paraphrase, approximation, rounding, or synonym is permitted.

FAILURE EXAMPLE: if the locked value is "at thirteen minutes to midnight" and you write "just before midnight" or "around midnight" — that is a HARD FAIL. You must write "at thirteen minutes to midnight". Equally, if the locked value is written in words, such as "ten minutes past eleven", and you convert it to figure-based clock notation — that is also a HARD FAIL. Words stay as words; figure forms are forbidden for word-phrased facts.

CRITICAL — WORD-PHRASED VALUES: If the canonical value is written out in words (e.g. a time like "ten minutes past eleven", or an amount like "forty minutes"), reproduce those exact words. DO NOT convert to figure-based time notation, twenty-four-hour format, or any other numeric shorthand. Correct: "ten minutes past eleven". WRONG: figure-based clock notation or numeric shorthand.

Locked values:
  - The exact time the suspects switched locations, pivotal to the alibi.: "ten minutes past eight"
    ⛔ FORBIDDEN alternatives: "8:10", "8.10", "eight ten", "eight-ten", "eight past ten", "quarter past eight", "half past eight" — the ONLY acceptable form is "ten minutes past eight"

If a value has no relevance to this chapter, omit it. But the moment you reference the underlying evidence, only the exact phrase above is acceptable.

EVIDENCE TO CONVEY IN YOUR OWN WORDS (NOT verbatim): weave each of these descriptive facts into the chapter as a COMPLETE, GRAMMATICAL observation by a character — surface the MEANING, never copy the phrasing word-for-word, and NEVER splice two evidence phrases together with an apostrophe or run two clauses together without a sentence break. If a fact has no relevance to this chapter, omit it.
  - The color of the hat matching the suspect's outfit, noted by witnesses.: red

⛔ CLUES TO SURFACE IN THESE CHAPTERS — mandatory:
The following evidence MUST be clearly observable to an attentive reader. Do not bury it in atmosphere or passing dialogue. Each clue must be concrete, specific, and noticeable:

• [clue_core_contradiction_chain] finch, wearing, blue, dress, described, witnesses, indicating, switched, outfits
  Category: testimonial | Criticality: essential | Supports inference step 1
  Later significance (context for YOU — do NOT state this in the prose; meaning surfaces only at the licensed deduction beats): contradiction, witness, statements, regarding, finch, attire

For each clue above: an attentive reader should be able to find, record, and later use it to reason toward the solution.

═══ NARRATIVE STATE (read-only — do not contradict) ═══

LOCKED FACTS — use verbatim whenever this evidence is described:
  • The exact time the suspects switched locations, pivotal to the alibi.: "ten minutes past eight"
  • The color of the hat matching the suspect's outfit, noted by witnesses.: "red"

CHARACTER PRONOUNS — never deviate from these:
  • Eleanor Voss: she/her/her
  • Dr. Mallory Finch: she/her/her
  • Captain Ivor Hale: he/him/his
  • Beatrice Quill: she/her/her
  • Sylvia Trent: she/her/her
  • Hugo Vane: he/him/his

CLUES ALREADY REVEALED TO READER: clue_early_1 — do not reveal these as new information.

INVESTIGATION LOG — WHAT IS ESTABLISHED (do not re-establish, do not repeat):
• Evidence already established (reference only — do NOT restate or quote these; advance beyond them): finch, presence, murder, scene
• Suspects still unresolved: Dr. Mallory Finch[SHE], Beatrice Quill[SHE], Sylvia Trent[SHE]
⚠ The story must move FORWARD from this log. Any beat already listed above is forbidden from repeating.

⚠ THIS CHAPTER'S REQUIRED ADVANCE (opening): Discover the body, confirm the victim, establish the scene. The victim is found dead. They do not speak, react, or gesture. This is their only physical appearance — in all subsequent chapters they exist only in past tense (memory, evidence, testimony).

CONTINUITY HANDOFF — previous chapter closing beat:
  • "The room was quiet again, save for the soft tick of a distant clock in the hallway. Hugo stood, surveying the scene—the blue dress, the red hat, the stopped watch. Each was a piece of a puzzle he could not yet see in full. He drew a slow breath, the scent of s..."
  • The next chapter must open as a continuation of this beat, not as a disconnected reset.
═══════════════════════════════════════════════════════

═══════════════════════════════════════════════════════════
📚 CONTINUITY CONTEXT - CHARACTER & SETTING CONSISTENCY
═══════════════════════════════════════════════════════════

**CRITICAL: You are writing chapters 2+. Maintain consistency with earlier chapters.**

**Character Names Used in Chapters 1-1:**
Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale, Hugo Vane

✓ RULE: Use EXACTLY these names. Do NOT vary spelling, add titles, or introduce new forms.
✓ Example: if earlier chapters used "Clara Whitfield", keep using "Clara Whitfield" — never "Mrs. Whitfield" unless that is the character's canonical name in the list above.

**Setting Vocabulary Established in Earlier Chapters:**
ballroom, kitchen, corridor, suite, lounge

✓ RULE: Continue using this location vocabulary. Maintain consistency with established setting type.
✓ Do NOT introduce new location types that contradict earlier chapters.

**Recent Chapter Summary (for narrative continuity):**
Chapter 1: Chapter 1: The Stopped Watch
  Events: Hugo Vane pressed his palm to the damp brass handle of the guest room door, the chill of the morning seeping through his glove.

⚠️ **VALIDATION:** Character name mismatches and setting drift are common failure modes.
Double-check every character name against the list above before using it.

**⏱ LOCKED TIME ANCHOR — use verbatim, do not paraphrase:**
Clock time (from the case ground truth): **"9:00 PM"**
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
Known location profile anchors: The Driftwood Hotel, The Seaside Observation Deck, The Driftwood Lobby, The Driftwood Dining Room, The Driftwood Library, the seaside hotel room
LOCATION NAME CAPITALISATION (HARD REQUIREMENT — validated):
All named locations in your prose MUST use the EXACT capitalisation from the CML profiles.
Canonical forms: "The Driftwood Hotel", "The Seaside Observation Deck", "The Driftwood Lobby", "The Driftwood Dining Room", "The Driftwood Library", "the seaside hotel room"
Writing a location in lowercase (e.g. "drawing room" instead of "Drawing Room") is a validated error. Every time you mention a named location, copy its capitalisation from the list above.
- Chapter 2: OPENING STYLE (HARD): Start the VERY FIRST SENTENCE with spoken dialogue — e.g. '"[words]," [Name] said/asked/replied/murmured.' The opening quote must be the first character on the line. Anchor opening in "the seaside hotel room". The opening style above governs only your FIRST SENTENCE; the grounding below may land anywhere in the first 2 paragraphs (it need not be sentence one, and never conflicts with the chosen opening style). HARD REQUIREMENT for the first 2 paragraphs: (a) include 2+ sensory words — choose from smell/scent/odor/fragrance/sound/echo/silence/whisper/creak/cold/warm/damp/rough/smooth/glow/shadow/flicker/dim — and (b) include 1+ atmosphere/time word — choose from rain/wind/fog/storm/mist/thunder/evening/morning/night/dawn/dusk/lighting/weather/season/afternoon/midday/noon/midnight/twilight/sunrise/sunset/daylight/sunlight/overcast/cloudy/bright/dark/grey/pale/chill/crisp/drizzle/haze/lamplight/firelight. These are validated requirements, not style suggestions; missing them triggers a retry.

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

PROMPT BUDGET SUMMARY: budget=24000 tokens; fixed=9876; context=11363; dropped=[none]; truncated=[location_profiles, temporal_context, pronoun_accuracy]

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
4. Integrate at least two concrete era-grounded details per chapter from setting refinement signals: radio broadcasting | early television sets | military radar | long-distance telephone calls | military encryption methods | post office telegrams.
5. Respect setting movement/access constraints in scene action and alibis: narrow hallways limiting movement | fire escapes only accessible from certain floors | common areas subject to guest privacy | staff-only areas such as the kitchen and service corridors | restricted access to guest rooms without permission.
6. Sustain social coherence with this backdrop pressure: A masquerade ball at a modest seaside hotel brings together a diverse cast, each grappling with the societal shifts of post-war life, while the pressure of public scrutiny and hidden identities creates a tense atmosphere ripe for deception.
7. Maintain continuity around these socially central cast anchors where relevant: Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill, Sylvia Trent, Hugo Vane.
8. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Critical: Plot similarity 0.75 with 'The Second Key' (same impersonation method and era)
9. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Moderate: Character similarity 0.70 with 'The Second Key' (similar cast structure and roles)
10. STORY TO DATE ANTI-COPY RULE: The STORY TO DATE section below is provided for chronological and factual reference ONLY. You MUST NOT copy, lightly rephrase, or structurally echo any sentence or paragraph from prior chapters. Every sentence in this chapter must be original prose unique to this scene. Reusing even a clause from prior chapter text will cause this attempt to fail immediately.

CRITICAL PROSE REQUIREMENTS:

The CML specifies exact requirements for certain validation-critical scenes. You MUST include these elements at the specified positions.

**Discriminating Test Scene (Act 3, Scene 4):**
Required elements: Execute the discriminating test, Observe the witnesses' reactions, Draw conclusion about Hale's guilt
Test type: trap

**Suspect Clearance Scenes:**
- Dr. Mallory Finch (Act 3, Scene 5): Contradiction in her alibi due to the blue dress.
  Clues: clue_id_1, clue_id_2
- Beatrice Quill (Act 3, Scene 5): Witnesses confirm the argument was unrelated to the murder.
  Clues: clue_id_1, clue_id_2
- Sylvia Trent (Act 3, Scene 5): Witnesses confirm she was at a different location.
  Clues: clue_id_1, clue_id_2

**Culprit Revelation Scene (Act 3, Scene 6):**
Method: Confrontation with evidence gathered.

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
  - ⛔ INFERENCE EMBARGO (pre-reveal): observations ACCUMULATE here; explicit deduction ("therefore", "which proved", "could only mean", if-A-and-B-then-C assembly of locked values) is RESERVED for the false-solution, discriminating-test, and reveal chapters. Characters may wonder, doubt, or fall silent over a detail — never explain it.
  - Opening: Begin with a character action, spoken line, or clock/time marker — never a location name or location-description phrase.
  - Scene is set in: the seaside hotel room — reference it naturally within the paragraph, never as your opening phrase.
  - Opening atmosphere (MANDATORY — validator enforced): the first paragraph MUST contain at least one of: rain / wind / fog / storm / mist / thunder / evening / morning / night / dawn / dusk / season / afternoon / midday / noon / midnight / twilight / sunrise / sunset / daylight / sunlight / overcast / cloudy / bright / dark / grey / pale / cold / warm / chill / crisp / damp / drizzle / haze / lamplight / firelight. A chapter that omits all of these from its opening paragraph will be rejected.
  - PARAGRAPH OPENER DIVERSITY (MANDATORY — validator enforced): No more than 2 paragraphs in this chapter may begin with "Hugo" or "Hugo's" as the first word. You must vary paragraph openings throughout: use sensory observations, another character's name or action, dialogue, object or sound details, or temporal markers. Opening 3 or more paragraphs with "Hugo" will cause automated rejection.
  - Continuity bridge: in the first 120 words, visibly connect from the previous chapter's final beat. Carry forward one unresolved element (object, accusation, emotional pressure, or immediate physical action) from: "The room was quiet again, save for the soft tick of a distant clock in the hallway. Hugo stood, surveying the scene—the blue dress, the red hat, the stopped watch. Each was a piece of a puzzle he could not yet see in ful...".
  - CLUE OBLIGATIONS — each clue below MUST be dramatized, but in YOUR OWN WORDS:
    Render each as something a character SEES, DOES, or SAYS on the page. The bracketed text is a
    DESCRIPTION of the evidence for you — do NOT transcribe it as narration. Copying a clue's
    description sentence verbatim into the prose FAILS validation.
    • contradicts, witness, statements, finch, attire [clue_core_contradiction_chain] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      OBSERVATION ONLY: put it on the page concretely — a character sees, handles, or hears it inside the scene. The detective may NOTICE (a pause, a second glance, a pocketed item) but must NOT state what it implies. Place the observation in paragraph 1 or 2.
  - PLANT OBLIGATIONS (incidental appearances): each item below MUST appear in this chapter as a passing physical detail a character sees, handles, or walks past — with its significance UNFLAGGED:
    • distinctive, tread, patterns, shoes, murder, scene [plant:clue_mid_1]
    • witnesses, reporting, observations, finch, attire [plant:clue_culprit_direct_1]
    Rules: set dressing only. NO character comments on its importance, NO narrator hint ("little did they know", "something about it seemed off" are FORBIDDEN), NO inference drawn. It simply exists in the scene, naturally. Its significance surfaces in a LATER chapter — planting it casually here is what makes that later reveal feel fair.
  - TIMELINE SPINE (canonical claimed accounts — every retelling must MATCH these in substance; accounts may be doubted, but what a character CLAIMS never drifts between chapters):
      · Dr. Mallory Finch claims: 9:00 PM - 10:00 PM
      · Captain Ivor Hale claims: 8:30 PM - 9:30 PM
      · Beatrice Quill claims: 9:00 PM - 10:00 PM
      · Sylvia Trent claims: 8:45 PM - 9:45 PM
      · Hugo Vane claims: 9:00 PM - 11:00 PM
  - ONE-QUESTION RULE: this scene RESOLVES OR SHARPENS EXACTLY ONE timeline question (pick the one this chapter's clue/clearance obligations serve). It may restate AT MOST ONE already-established fact for context. Do NOT re-summarize other suspects' accounts, do NOT re-litigate settled points — the scene ends with its one question visibly answered, or visibly sharpened into a better question.
  - Tonal contrast: include at least one beat of relief or ironic counterpoint. Do not sustain maximum tension for every paragraph.
  - CLUE DISCLOSURE RULE (Stage 3/4):
    Characters may draw inferences and name partial conclusions but must NOT state the full mechanism or name the culprit directly. The detective may suspect but not confirm.
    WRONG: dialogue or narration that directly explains how the crime was committed before Stage 4.
    RIGHT: observation, physical reaction, and logical inference that leaves the mechanism just off-screen.
  - ALIBI LOCK: Captain Ivor Hale's established alibi is "8:30 PM - 9:30 PM". Do NOT place Captain Ivor Hale at any other location or in any other activity during the crime window. Any contradiction is a continuity error that triggers a retry.
  - TESTIMONY CONTINUITY: Captain Ivor Hale has already made statements in earlier chapters. Any time, location, or claim attributed to Captain Ivor Hale in THIS chapter must be consistent with those earlier statements. Do NOT introduce a new or different alibi claim — any contradiction is a continuity error.
- Locked fact phrase obligations:
  - If this batch mentions The exact time the suspects switched locations, pivotal to the alibi., write exactly: "ten minutes past eight".
  - If this batch mentions The color of the hat matching the suspect's outfit, noted by witnesses., write exactly: "red".
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
Batch chapters: 2-2.
Investigation state at start: 1 clue(s) revealed to reader; approximately 3 unresolved suspect(s).
Must change by end: Reframe prior clue meaning and update suspect implications.
Suspect pressure target(s): Captain Ivor Hale, Dr. Mallory Finch
Required new information: Earlier clue gets revised meaning with explicit theory update.
Forbidden reveals at this stage: Do not introduce decisive new evidence from nowhere.

FROZEN FACT STATE (DO NOT ALTER):
- Timeline anchor: May (spring).
- Month, season, weather, and time-of-year language in this batch must stay compatible with spring.
- Established timeline fact: 9:00 PM
- Established timeline fact: 10:00 PM
- If referenced, use exact phrase: "ten minutes past eight" (The exact time the suspects switched locations, pivotal to the alibi.).
- If referenced, use exact phrase: "red" (The color of the hat matching the suspect's outfit, noted by witnesses.).

STORY TO DATE (REFERENCE ONLY — DO NOT COPY VERBATIM):
- Full prior chapter text is provided below for continuity, factual consistency, and reference accuracy.
- Use this to keep character voice, chronology, clue state, and location continuity aligned with earlier chapters.
- Do not quote, copy, or paraphrase these paragraphs too closely; write fresh prose that remains consistent with them.

--- BEGIN PRIOR CHAPTER 1 ---
Title: Chapter 1: The Stopped Watch
Hugo Vane pressed his palm to the damp brass handle of the guest room door, the chill of the morning seeping through his glove. The corridor behind him was silent except for the muted patter of rain against the windowpanes, a faint echo of last night’s storm lingering in the air. The faded floral carpet muffled his steps as he pushed open the door to the suite at the heart of the seaside hotel, the scent of salt and old wood curling up from the floorboards. Sunlight, filtered through a bank of grey clouds, fell in a pale stripe across the room, illuminating the figure sprawled on the patterned rug: Eleanor Voss, her body unnaturally still, her hand curled around a silver pocket watch.

The hush was total, broken only by the faint creak of the wardrobe as Hugo stepped further in. Eleanor’s face was turned towards the door, her eyes half-lidded, lips parted as if she had been about to speak. The watch in her grip had stopped, its hands fixed at ten past eleven. Hugo’s gaze lingered on the detail, the air thick with the scent of damp linen and something sharper—fear, perhaps, or the residue of last night’s festivities. Beyond the window, the sea was a smear of slate under the overcast sky, the promise of spring doing little to warm the room’s chill.

He knelt, careful not to disturb the hem of Eleanor’s blue dress, which fanned out beneath her like a pool of midnight. The fabric was creased, as if she had clutched at it in her final moments. A single red hat lay discarded on the nearby chair, its feather bent at an awkward angle. Hugo’s fingers hovered over the watch, noting the faint indentation where it had pressed into Eleanor’s palm. He did not touch her—there was no need. The finality of her stillness was absolute.

Hugo Vane laid the facts out plainly where the others could see them. The record now held: Witnesses recall seeing finch blue dress.

That detail shifted the reasoning. Weighed against the rest, Witnesses recall seeing finch blue dress bent the trail toward Finch presence murder scene.

A soft footfall behind him made Hugo turn. Dr. Mallory Finch stood in the doorway, her expression composed but her hands trembling as she adjusted the cuffs of her blouse. She wore a blue dress, the same shade as Eleanor’s, though hers was unwrinkled and immaculate. Hugo’s mind snagged on the detail, recalling the flurry of guests in the ballroom last night, the swirl of costumes and the sharp glint of a masquerade mask. He remembered a guest—one of the waitresses, perhaps—remarking on Dr. Finch’s dress, the blue silk catching the lamplight as she danced. The memory pressed at him, insistent.

‘Isn’t it curious how people reveal their true selves under pressure?’ Hugo said, his voice low, eyes on Dr. Finch. She did not answer at once, her gaze flickering from the body to the stopped watch, then to the red hat. The silence stretched, filled only by the distant sound of waves battering the rocks below the hotel. Dr. Finch’s jaw tightened, and she moved to the window, her back to Hugo. He watched her reflection in the glass, the tension in her shoulders betraying something she would not say aloud.

The door swung open with a suddenness that made Dr. Finch flinch. Captain Ivor Hale entered, the scent of tobacco and rain clinging to his greatcoat. He was broad-shouldered, his posture ramrod-straight, but his eyes darted to Eleanor’s body with a flicker of unease. ‘I came as soon as I heard,’ he announced, voice booming in the small room, though the bravado rang hollow. He lingered near the threshold, one hand gripping the head of his cane, the other fiddling with his watch chain. Hugo noted the gesture, the way Captain Hale’s thumb pressed against the metal as if seeking reassurance.

‘You were here last night, Captain?’ Hugo asked, rising to his feet. The question was casual, but it hung in the air like a challenge. Captain Hale’s gaze shifted, settling on the stopped watch in Eleanor’s hand before he replied. ‘I was in the lounge for most of the evening. Left just after half past nine, if memory serves.’ He cleared his throat, glancing at Dr. Finch. ‘Saw Dr. Finch in the ballroom, didn’t I? That blue dress of hers—hard to miss.’

Dr. Finch’s lips parted, but she said nothing. Hugo’s mind turned over the detail, the blue dress, the red hat, the stopped watch—each a fragment of the night’s confusion. He recalled the guests’ chatter, the way several had remarked on Dr. Finch’s attire, the blue silk standing out among the crowd. Yet here was Eleanor, her own dress wrinkled and stained, the blue shade nearly identical. The resemblance was more than passing; it was deliberate. He wondered, not for the first time, how many had truly seen what they thought they saw.

‘Strange business,’ Captain Hale muttered, stepping closer to the window. He stared out at the grey sea, his reflection wavering in the glass. ‘In my day, we handled things differently. This—’ he gestured vaguely at the body ‘—this is something else altogether.’ His tone was gruff, but Hugo caught the tremor beneath it, the way Captain Hale’s fingers tightened around the cane. Authority, it seemed, was a fragile thing in the aftermath of war.

Outside, the rain had eased to a drizzle, the sound a soft percussion against the glass. The hush inside the room was broken only by the distant clatter of crockery from the kitchen, a reminder that life at the seaside hotel would go on, even as its guests stood on the threshold of disaster. Hugo straightened, his gaze sweeping the room once more—the blue dress, the red hat, the stopped watch fixed at ten past eleven. Each detail was a question, each silence an accusation.

He turned to Captain Hale, his tone measured. ‘You said you left the lounge after half past nine. Did you see Eleanor after that?’ Captain Hale hesitated, the lines at the corners of his eyes deepening. ‘No. I suppose I didn’t. The place was a madhouse, what with the ball and all. You know how it is—faces blur together, time slips away.’ He managed a brittle smile, but it did not reach his eyes. Hugo made a note of the deflection, the way Captain Hale avoided meeting his gaze.

Dr. Finch moved to the bedside table, her gloved hand brushing against a folded program from last night’s masquerade. She picked it up, turning it over as if searching for meaning in the embossed letters. ‘Eleanor was anxious yesterday,’ she said quietly. ‘She kept checking her watch, as if expecting something to happen.’ The words hung in the air, heavy with implication. Hugo watched her, noting the way her fingers trembled, the effort she made to steady them.

A gust of wind rattled the windowpane, drawing all three gazes outward. The sea, restless and unyielding, seemed to mock the stillness within. Hugo’s thoughts drifted to the stories he’d heard in the lounge the night before—the tales of old grievances, whispered alliances, the brittle camaraderie of those who had survived the war but not its aftermath. He wondered how many secrets the hotel’s walls had absorbed, how many truths lay buried beneath the veneer of respectability.

He crouched beside Eleanor’s body once more, his shadow falling across the stopped watch. The hands, frozen at ten past eleven, refused to yield their secret. Hugo traced a finger along the edge of the timepiece, feeling the chill of the metal. The contradiction was plain: three of the suspects had claimed to be elsewhere at the time, yet the watch told a different story. The evidence did not fit, not neatly, and Hugo felt the first stirrings of suspicion settle in his chest.

Captain Hale cleared his throat, shifting his weight from foot to foot. ‘If you don’t mind, Mr. Vane, I’ll take my leave. There’s little I can do here.’ His voice was softer now, the bravado faded. Hugo nodded, watching as Captain Hale retreated down the corridor, the echo of his footsteps fading into the hush. Dr. Finch lingered, her gaze fixed on the blue dress, her thoughts unreadable.

The room was quiet again, save for the soft tick of a distant clock in the hallway. Hugo stood, surveying the scene—the blue dress, the red hat, the stopped watch. Each was a piece of a puzzle he could not yet see in full. He drew a slow breath, the scent of salt and rain filling his lungs, and let his mind settle on the contradiction at the heart of the case. Somewhere between the silence and the storm, the truth waited to be found.
--- END PRIOR CHAPTER 1 ---

[SCENE COMPLETENESS CONTRACTS — MANDATORY. Each contract below lists what you MUST enact in that chapter. Do not summarise or mention these labels in the prose — enact them organically.]
Chapter 2 (Act 1) completeness contract:
  PIVOT ELEMENT (MANDATORY — write this into the prose, shown not told): "Dr. Finch's contradictory outfit raises suspicion"
  FACT ESTABLISHED (MANDATORY — reader must know this by chapter end): "Establishes that Dr. Finch was not wearing the blue dress described by witnesses, indicating she may have switched outfits."

# Case Overview
Title: The Masquerade of Authority
Era: 1940s
Setting: Seaside Hotel
Crime: murder (impersonation)
Culprit: Captain Ivor Hale
Victim: Eleanor Voss
False assumption: Dr. Mallory Finch was with Eleanor Voss at the time of the murder.
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
    "title": "Initial Investigation",
    "setting": {
      "location": "the seaside hotel room",
      "timeOfDay": "Shortly after the discovery",
      "atmosphere": "Charged with suspicion and uncertainty"
    },
    "characters": [
      "Hugo Vane",
      "Eleanor Voss",
      "Captain Ivor Hale",
      "Dr. Mallory Finch"
    ],
    "purpose": "Establish initial clues and contradictions",
    "cluesRevealed": [
      "clue_core_contradiction_chain"
    ],
    "dramaticElements": {
      "conflict": "Contradictory testimonies emerge",
      "tension": "Suspicion grows among the witnesses",
      "microMomentBeats": [
        "Eleanor bites her lip, struggling to hold back tears as she recalls the last time she saw the victim."
      ]
    },
    "summary": "In the victim's room, Detective Vane questions the witnesses about their whereabouts. Eleanor Voss recalls seeing Dr. Mallory Finch in a blue dress earlier that evening. However, when Dr. Finch arrives, she is not wearing the blue dress, raising immediate doubts about her involvement. Captain Hale's presence adds to the tension as he begins to sweat under the scrutiny.",
    "beat": "crime",
    "estimatedWordCount": 1800,
    "pivotElement": "Dr. Finch's contradictory outfit raises suspicion",
    "factEstablished": "Establishes that Dr. Finch was not wearing the blue dress described by witnesses, indicating she may have switched outfits.",
    "permittedBehavioursByAct": [
      {
        "characterName": "Eleanor Voss",
        "behaviour": "Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted."
      },
      {
        "characterName": "Captain Ivor Hale",
        "behaviour": "Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted."
      },
      {
        "characterName": "Dr. Mallory Finch",
        "behaviour": "Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted."
      },
      {
        "characterName": "Hugo Vane",
        "behaviour": "Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted."
      }
    ],
    "redHerringPlacement": null,
    "emotionalRegister": "The initial investigation reveals conflicting alibis, increasing the sense of unease among guests.",
    "dominantCharacterNote": {
      "name": "Eleanor Voss",
      "voiceRegister": "Eleanor speaks with precision, often using hotel jargon, her tone reflecting both authority and underlying insecurity."
    },
    "humourGuidance": {
      "permission": "forbidden"
    },
    "eraTextureNote": "Rationing of goods affecting daily life; Limited access to modern transportation due to fuel shortages; The lingering impacts of wartime damage on infrastructure; Communication delays exacerbated by the post-war environment; The need for discretion in public behavior following war experiences",
    "locationRegisterNote": "",
    "mechanismRevealAllowed": false,
    "cluesPlanted": [
      "clue_mid_1",
      "clue_culprit_direct_1"
    ]
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
□ Chapter 2: the clue [clue_core_contradiction_chain] (finch, wearing, blue, dress, described, witnesses, indicating, switched, outfits) is placed in the first 25% of the chapter, dramatized in your own words, followed by an explicit inference or suspicion paragraph.
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
