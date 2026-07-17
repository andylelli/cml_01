# Actual Prompt Record

- Run ID: `mystery-1784055526685`
- Project ID: ``
- Timestamp: `2026-07-14T19:07:47.001Z`
- Agent: `Agent9-ProseGenerator-Ch3`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4.1`
- Temperature: `0.42`
- Max Tokens: `4500`
- Attempt: `first`
- Prompt Hash: `0a03db3ab919e0cb`

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
- MORAL COMPLEXITY REQUIREMENT: The mechanism of this crime carries a moral gray area: "The culprit's motive stemmed from a desperate attempt to protect a loved one, blurring the lines between right and wrong." — the culprit reveal and denouement MUST acknowledge this ambiguity. Do not let the ending feel clean or simple. Give the reader at least one moment of uncomfortable sympathy or moral doubt.

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
   - Captain Ivor Hale: Conflicted Lover
   - Beatrice Quill: Naive Dreamer
   - Sylvia Trent: Steely Matriarch
   - Hugo Vane: Cynical Outsider
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

## Era: 1946-05
In May 1946, the atmosphere is charged with the remnants of war and the anxiety of rebuilding lives. The coastal air carries the scent of salt and rain, while hotel guests mingle amidst the echoes of laughter and whispers of secrets. Long spring days stretch into evenings filled with uncertainty as people navigate their new realities. The post-war societal shift is palpable, with women stepping into roles traditionally held by men, and the echoes of conflict linger in their minds. The hotel, a sanctuary for those seeking respite, becomes a microcosm of the larger world grappling with the aftermath of WWII, where every interaction is tinged with the weight of unspoken truths and the promise of new beginnings.
Emotional register: A collective atmosphere of cautious optimism lingers, underscored by anxiety and the need for healing.
Physical constraints: Travel is still limited due to rationing of fuel and materials | Communication relies heavily on radio broadcasts and postal services | Strict curfews and regulations from wartime linger in public life
Current tensions (weave into background texture): Germany's division into East and West is beginning to solidify | The United Nations General Assembly has recently convened | The Nuremberg Trials are concluding, highlighting war crimes
Wartime context — Many returning soldiers are struggling to reintegrate into civilian life, facing both physical and emotional scars.: The social fabric is fraying as roles shift and traditional hierarchies are challenged, leading to both camaraderie and competition. Absence effect: The absence of loved ones lost in the war casts a long shadow, affecting relationships and community bonds.

## Story Theme
In a world shaped by post-war tensions, the quest for truth unveils the intricate tapestries of human relationships, where love, jealousy, and betrayal intertwine inexorably.

## Story Emotional Register
Dominant: The story unfolds with a blend of tension and intrigue, revealing the complexities of human relationships.

Arc:
The tale opens within the elegant confines of the Cliffside Hotel, where the air is thick with the scent of salt and the weight of unspoken secrets. Guests gather under the grand chandeliers, their laughter echoing against the backdrop of a recent murder that casts a pall over the weekend. The investigation begins, and the tension rises with every passing moment as Eleanor Voss, the keen investigator, dives into the murky waters of deceit. Each clue uncovered leads her deeper into a web of lies, revealing personal stakes that weigh heavy on her heart, especially as her feelings for Captain Hale complicate her objectivity.

The first turn comes with an unexpected revelation about the positioning of a mirror that misled witnesses, forcing Eleanor to rethink everything she believed to be true. As the investigation progresses, a second pivotal moment emerges when a surprising connection between the victim and another suspect is revealed, reshaping the narrative and placing Eleanor in a precarious position. The pressure mounts as she races against time to unravel the mystery before the truth is buried forever. The climax unfolds in a tense confrontation where emotions run high, and the stakes reach a boiling point. Ultimately, the resolution brings not only the truth to light but also a heavy emotional toll for each character involved, as they grapple with the consequences of their actions and the realization that love, jealousy, and betrayal are intricately woven into the fabric of their lives.

## Emotional register at this point in the story
Tension escalates as guests navigate their secrets while the investigation begins.

## Character Portraits (appearance & era)

### Eleanor Voss
As a journalist in the post-war world, Eleanor grapples with her ambition against the backdrop of societal change. Her keen insight into human relationships is sharpened by the complexities of a society in flux, where truths are obscured by emotional turmoil. The murder investigation she undertakes reflects her own struggles with unrequited love and her desire for professional validation, symbolizing the broader narrative of women finding their voice in a changing landscape.
Era intersection: Eleanor embodies the spirit of a generation where women are reclaiming agency and confronting personal battles amidst societal upheaval.

### Hugo Vane
Hugo, a private investigator, navigates the murky waters of morality and financial gain in a post-war society. His cynicism reflects the disillusionment of many, caught between their aspirations and ethical boundaries. As he probes into the murder investigation, his character embodies the complexities of trust and betrayal, mirroring the larger societal challenges of reestablishing relationships and integrity in a world marked by conflict.
Era intersection: Hugo's perspective highlights the moral ambiguities prevalent in a society grappling with the fallout of war.

## Character Voices

### Eleanor Voss (she/her/her)
Eleanor's voice is smooth and articulate, with a hint of dry wit that draws listeners in.
[comfortable] Ah, the tangled webs we weave. It's never just about the surface.
[evasive] I think everyone has their reasons... don't you?
[stressed] This could ruin everything I've worked for. I just need to find the truth.
Humour: Her dry wit adds a layer of complexity to her character, revealing her intelligence.

### Hugo Vane (he/him/his)
Hugo's voice is clipped and direct, often infused with dry humor and cynicism.
[comfortable] Life’s a mess, isn’t it? Sometimes you just have to laugh.
[evasive] I’m just doing my job, nothing more.
[stressed] This case is spiraling out of control, and I can’t afford to lose.
Humour: His observational humor masks a deeper sense of disillusionment.

## Location Registers (scene framing guides)

Grand Lobby: The Grand Lobby is a hub of tension and anticipation, where guests gather under the weight of secrets and unspoken truths. Laughter and whispers intertwine, creating an atmosphere thick with intrigue as everyone feels the pressure of the unfolding mystery. The elegant decor contrasts sharply with the underlying currents of anxiety, making every conversation feel like a potential revelation.. Camera angle: Entering this space, the writer should feel the charged atmosphere, as if every glance exchanged carries the weight of hidden agendas.. Era: The opulence of the hotel reflects the lingering grandeur of a pre-war era, while the guests' anxiety hints at the societal changes to come.

Dining Room: The Dining Room is filled with a mix of culinary delights and simmering tensions. As guests enjoy their meals, the air is thick with apprehension, each bite accompanied by the unspoken worries of the murder investigation. The elegant setting, enhanced by candlelight, creates an intimate yet fraught environment where every conversation could lead to a breakthrough or a breakdown.. Camera angle: Approaching this space, the writer should capture the duality of pleasure and unease, as the ambiance invites yet unsettles.. Era: The dining experience is a reflection of post-war recovery, where the joy of food clashes with the looming threat of scandal.

Guest Rooms: The Guest Rooms are sanctuaries of comfort marred by the shadows of secrets. Each space holds the weight of personal struggles and emotional turmoil, where guests grapple with their truths behind closed doors. The quiet rustling of fabric and distant sounds of the ocean create a haunting backdrop, reflecting the inner conflicts that plague them as they confront their realities.. Camera angle: Entering this space, the writer should feel the intimacy and isolation, as if peering into the souls of the characters.. Era: These rooms serve as a stark reminder of the changing roles of women and the pressures of societal expectations post-war.

Shared Balcony: The Shared Balcony offers a breathtaking view juxtaposed with a sense of impending doom. Guests stand in silhouette against the fading light, their conversations muted by the roar of the ocean below. The cool breeze carries both the scent of salt and the weight of unspoken words, creating an atmosphere charged with tension as they navigate the complexities of their relationships.. Camera angle: As the writer approaches this space, they should capture the duality of beauty and dread, inviting readers to witness the characters' turmoil.. Era: The balcony symbolizes the transition between personal aspirations and societal realities, reflecting the struggles faced by many in this era.

## Humour guidance for this story position (early)
Permission: permitted
Characters who may be funny: Eleanor Voss
Permitted forms: dry_wit
Rationale: Eleanor's dry wit can lighten the tension without undermining the seriousness of the investigation.

## Reveal Groundwork (texture — do not explain, only plant)
- Plant one subtle observable beat related to: "At the moment when Eleanor first uncovers the misleading nature of the mirror, it colors her subsequent interactions with the suspects, revealing their motivations and fears". Do not explain significance yet.
- Plant one subtle observable beat related to: "The shocking connection between the victim and Sylvia their earlier conversations, suggesting deeper layers of intrigue". Do not explain significance yet.
- Plant one subtle observable beat related to: "Lastly, the climax, where the truth is revealed, forces all characters to confront the consequences of their actions, showcasing the tangled web of relationships that define their lives". Do not explain significance yet.

FAIR-PLAY AND INFERENCE CONTRACT:
- FAIR PLAY CLUE TIMING: Never combine clue discovery and detective deduction in the same chapter. If a clue is first revealed to the reader in chapter N, the detective may only analyze, deduce from, or act on that clue in chapter N+1 or later.
- FAIR PLAY INFORMATION PARITY: The reader must see all clues BEFORE the detective uses them in reasoning. If the detective performs a test or makes a deduction, every piece of evidence supporting that conclusion must have been shown to the reader in earlier chapters.
- FAIR PLAY REVELATION SPACING: In the discriminating test scene, the detective can ONLY use clues that were revealed to the reader at least 1 full chapter earlier. Never introduce new clues or withheld information during the test.
- FAIR PLAY CONFRONTATION: During the final confrontation/revelation, the detective cannot surprise the reader with facts. Every piece of evidence cited must have been visible to the reader in prior chapters.
- Never solve by withheld information. Keep reader-information parity with detective reasoning.
- False assumption in force: The victim was attacked from across the room.
- Hidden truth to progressively expose (compose in your own words from these elements): true, position, attacker, actually, closer
- Inference path checkpoints to dramatize clearly — compose ENTIRELY in your own sentences from these key terms (reproducing any briefing phrase verbatim FAILS validation):
  - Step 1: obs: fingerprints, mirror, surface, victim, room | corr: fingerprints, suggest, someone, manipulated, mirror | effect: narrows, suspect, pool, accessed, victim, room
  - Step 2: obs: angle, mirror, contradicts, witness, account, attack | corr: reflection, victim, position, conflicts, witness, claims, seen, attack | effect: eliminates, witness, reliability, source, truth
  - Step 3: obs: unusual, smudge, discovered, lens, mirror | corr: smudge, indicates, recent, handling, linking, suspect | effect: narrows, suspects, handled, mirror, shortly, before, murder
- Discriminating test method: trap
- Discriminating test elements to dramatize (compose ENTIRELY in your own sentences from these — do NOT reproduce any briefing phrase verbatim): setting, reenactment, mirror, reveal, true, angle, attack
- Test must rely on already-shown clue IDs: clue_12, clue_core_contradiction_chain, clue_5, clue_early_1
- Fair-play rationale: Step 1: Fingerprints on the mirror and access logs (early) narrow suspects. Step 2: The angle of the mirror contradicts witness statements (mid) eliminates witness reliability. Step 3: The smudge links handling to the culprit (discriminating test) reveals Hugo Vane's involvement.

## Character Reference

### Eleanor Voss (she/her — NEVER he/him)
Eleanor speaks with a measured cadence, often punctuating her observations with a wry smile
She has a tendency to ask rhetorical questions, drawing her listeners into her thought process.
Eleanor grapples with the tension of her unspoken feelings for Captain Hale while desperately seeking the truth in a world where her heart and her career seem at odds.
Voice colour: Eleanor Voss uses dry wit humour — let it surface in their dialogue where natural, not in every line.

### Hugo Vane (he/him — NEVER she/her)
Hugo speaks in a clipped, direct manner, often punctuating his observations with dry humor
He has a penchant for cynicism and is not afraid to call out the absurdities of life.
Hugo struggles with the moral implications of his actions, torn between his desire for financial gain and a sense of justice.
Voice colour: Hugo Vane uses observational humour — let it surface in their dialogue where natural, not in every line.


## CHARACTER CONTRACTS (binding for this scene)
Each entry below constrains how this character must be written in this chapter.
These override generic style guidance when they conflict.

### Eleanor Voss[SHE]
Voice & mannerisms: Eleanor speaks with a measured cadence, often punctuating her observations with a wry smile. She has a tendency to ask rhetorical questions, drawing her listeners into her thought process.
SIGNATURE TIC (use sparingly — this is Eleanor Voss's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "Ah, the tangled webs we weave."
Sample voice fragments (match this register and rhythm):
  [comfortable] "Ah, the tangled webs we weave. It's never just about the surface."
  [evasive] "I think everyone has their reasons... don't you?"
Humour: dry wit — deploy occasionally (level 0.5)
FORBIDDEN phrase (never write for Eleanor Voss): "a surge of determination washed over her"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Seeking the truth behind the victim's demise to write a compelling story, but also to prove her worth." — do not surface in Act I.

### Hugo Vane[HE]
Voice & mannerisms: Hugo speaks in a clipped, direct manner, often punctuating his observations with dry humor. He has a penchant for cynicism and is not afraid to call out the absurdities of life.
SIGNATURE TIC (use sparingly — this is Hugo Vane's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "Life’s a mess, isn’t it?"
Sample voice fragments (match this register and rhythm):
  [comfortable] "Life’s a mess, isn’t it? Sometimes you just have to laugh."
  [evasive] "I’m just doing my job, nothing more."
Humour: observational — deploy occasionally (level 0.4)
FORBIDDEN phrase (never write for Hugo Vane): "everyone could sense the atmosphere"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Could gain financially from the fallout of the murder investigation." — do not surface in Act I.



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

Primary Location: The Cliffside Hotel (Scarborough, England)
An elegant 1940s seaside hotel perched on the cliffs of Scarborough, offering stunning ocean views and a sense of intrigue.

Key Locations Available:
- Grand Lobby (interior): Gathering space for guests
- Dining Room (interior): Dining and socializing space for guests
- Guest Rooms (interior): Private accommodations for guests
- Shared Balcony (transitional): Outdoor space for guests to enjoy views and fresh air

Atmosphere (tonal cue only — do NOT reproduce this phrase verbatim in prose; translate into scene-specific, character-observed sensory language): tense and suspenseful, influenced by recent wartime events and lingering anxieties about the future
Weather: overcast with occasional rain, typical of a coastal climate in late autumn

Era markers: radio broadcasts of war updates | early television sets flickering in lounges | rationed public transport schedules | military vehicles parked by the entrance

USAGE GUIDELINES:
1. First mention of location: Ground the scene using sensory details drawn from the profiles — paraphrase these into what the POV character directly observes and experiences, not a summary of the room's general qualities
2. Geographic grounding: Reference the specific place (Scarborough, England) naturally in dialogue or narrative
3. Action scenes: Integrate physical layout details (access, sightlines, constraints)
4. Atmospheric scenes: Reference weather, lighting, sounds from sensory palette
5. Era details: Weave in period markers naturally
6. Consistency: Keep all location descriptions aligned with profiles
7. OPENING GROUNDING (required, first 1-2 paragraphs of EVERY chapter): (a) name the specific location from this list, (b) give at least 2 concrete sensory details (sound, smell, temperature, texture, light/shadow), and (c) one time-of-day or weather/atmosphere detail — BEFORE advancing plot, clues, or the mechanism. Open on the setting and the people in it, not on the puzzle.
8. This matters most in pre-reveal chapters that withhold the mechanism: ground them in setting and character rather than rushing the investigation — a withheld chapter is not an empty one.
9. Do NOT use generic repeated manor/storm filler without profile-specific details; vary the opening location/sense each chapter

SENSORY PALETTE (use 2-3 senses per scene):
Grand Lobby (interior):
  - Visual: gleaming marble floors, art deco chandeliers casting soft light, waves crashing against cliffs
  - Sounds: soft laughter and murmurs, clinking of glasses, radio crackling with news updates
  - Scents: freshly brewed coffee, polished wood and leather, faint tobacco smoke
  - Touch: cool marble underfoot, soft velvet upholstery

Dining Room (interior):
  - Visual: gleaming silverware on crisp white tablecloths, ocean waves crashing against rocks, guests savoring their meals
  - Sounds: clinking of cutlery, soft laughter and chatter, the rustle of napkins
  - Scents: roasted meats and fresh bread, scent of sea salt, aroma of rich desserts
  - Touch: smooth china under fingertips, heavy crystal glasses

Guest Rooms (interior):
  - Visual: softly lit lamps casting a warm glow, elegant furnishings in muted tones, ocean waves visible from windows
  - Sounds: the rustle of fabric as guests move, the creaking of floorboards, distant conversations from the hallway
  - Scents: scent of sea salt wafting in, fresh linen and soap, hint of perfume lingering
  - Touch: soft bedding against skin, cool glass of the window pane

⛔ REFERENCE DATA — DO NOT TRANSCRIBE VERBATIM: The above profiles are structural guides only. Generate original prose that evokes these qualities; do not reproduce the exact phrasing or sentence structure of the profile paragraphs.

SCENE OPENING RULE: When opening a scene in a new location, write what the POV character directly obse
[truncated for prompt budget]

## Texture Pool
Draw on these as opportunities arise — you are not required to use them.

- In May 1946, the atmosphere is charged with the remnants of war and the anxiety of rebuilding lives
- The coastal air carries the scent of salt and rain, while hotel guests mingle amidst the echoes of laughter and whispers of secrets
- Long spring days stretch into evenings filled with uncertainty as people navigate their new realities
- The post-war societal shift is palpable, with women stepping into roles traditionally held by men, and the echoes of conflict linger in their minds
- The hotel, a sanctuary for those seeking respite, becomes a microcosm of the larger world grappling with the aftermath of WWII, where every interaction is tinged with the weight of unspoken truths and the promise of new beginnings.

TEMPORAL CONTEXT:

This story takes place in May 1946 during spring.

Seasonal Atmosphere:
- Weather patterns: overcast with occasional rain, mild temperatures around 60°F, coastal breezes bringing humidity
- Daylight: Long spring days with sunset around eight o'clock, allowing for extended evening activities
- Seasonal activities: beach strolls, garden parties, voyages on fishing boats
- Seasonal occasions: May Day (May 1), Mother's Day (May 12)
- Season: spring

Period Fashion (describe naturally):
- Men formal: double-breasted suit jacket, lightweight wool trousers, dress shirt with a narrow tie
- Men casual: button-down short-sleeve shirt, linen slacks, deck shoes
- Men accessories: fedora hat, leather belt, pocket square
- Women formal: tea-length dress with floral patterns, tailored blazer, string of pearls
- Women casual: capri pants paired with a fitted blouse, sundress with a wide-brimmed hat, espadrilles
- Women accessories: silk scarf, clutch purse, broad-brimmed sun hat

Cultural Context (reference naturally):
- Music/entertainment: 'Chattanooga Choo Choo' by Glenn Miller, 'Don't Fence Me In' by Bing Crosby, 'Ain't That a Kick in the Head?' by Dean Martin; Films: 'The Best Years of Our Lives', 'It's a Wonderful Life'; Theatre: 'Annie Get Your Gun', 'The Glass Menagerie'; Radio: 'The Jack Benny Program', 'Suspense'
- Typical prices: Loaf of bread: four pence, Movie ticket: one shilling, Taxi fare across town: two shillings
- Current events: Germany's division into East and West is being formalized; the first meeting of the United Nations General Assembly took place in New York
- Literature: 'The Catcher in the Rye' by J.D. Salinger | 'Brave New World' by Aldous Huxley | 'The Postman Always Rings Twice' by James M. Cain | [mystery] | [detective fiction] | [post-war literature]
- Technology: ballpoint pen | early home refrigerators | television sets gaining popularity | radio receivers | black-and-white televisions | simple kitchen appliances
- Daily life: attending local fairs, hosting backyard barbecues, family picnics at the beach
- Social rituals: Sunday family dinners, afternoon tea gatherings, attending church services weekly

Atmospheric Details:
The scent of saltwater mingling with the aroma of blooming flowers fills the air, punctuated by the occasional downpour that leaves the pavement glistening. Echoes of laughter and clinking glasses from the hotel's dining room carry through the damp evening, creating a backdrop of buoyancy against the tension of the times. The low hum of a radio broadcasting the latest news weaves through the conversations, interspersed with the sounds of waves crashing against the shore, creating a dissonance between hope and lingering fear.

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
- Social c
[truncated for prompt budget]

NON-NEGOTIABLE CHAPTER OBLIGATIONS — LOCKED EVIDENCE VALUES (VERBATIM REQUIRED):
The following measured values (times, amounts, measurements) are absolute ground truth. Every time this chapter describes, mentions, or alludes to one — no matter how briefly — it MUST use the exact phrase shown below, character for character. NO paraphrase, approximation, rounding, or synonym is permitted.

FAILURE EXAMPLE: if the locked value is "at thirteen minutes to midnight" and you write "just before midnight" or "around midnight" — that is a HARD FAIL. You must write "at thirteen minutes to midnight". Equally, if the locked value is written in words, such as "ten minutes past eleven", and you convert it to figure-based clock notation — that is also a HARD FAIL. Words stay as words; figure forms are forbidden for word-phrased facts.

CRITICAL — WORD-PHRASED VALUES: If the canonical value is written out in words (e.g. a time like "ten minutes past eleven", or an amount like "forty minutes"), reproduce those exact words. DO NOT convert to figure-based time notation, twenty-four-hour format, or any other numeric shorthand. Correct: "ten minutes past eleven". WRONG: figure-based clock notation or numeric shorthand.

Locked values:
  - The precise angle of the mirror that misled the witness.: "forty-five degrees"
  - The distance from the mirror to the victim, creating the illusion of proximity.: "twelve feet"
  - The exact time the murder was staged to mislead the timeline.: "ten minutes past ten"
    ⛔ FORBIDDEN alternatives: "10:10", "10.10", "ten ten", "ten-ten", "ten past ten", "quarter past ten", "half past ten" — the ONLY acceptable form is "ten minutes past ten"

If a value has no relevance to this chapter, omit it. But the moment you reference the underlying evidence, only the exact phrase above is acceptable.

⛔ CLUES TO SURFACE IN THESE CHAPTERS — mandatory:
The following evidence MUST be clearly observable to an attentive reader. Do not bury it in atmosphere or passing dialogue. Each clue must be concrete, specific, and noticeable:

• [clue_3] fingerprints, mirror, surface, victim, room
  Category: physical | Criticality: essential | Supports inference step 1
  Points to: fingerprints, link, suspect, crime, scene

• [clue_early_1] angle, mirror, contradicts, witness, account, attack
  Category: testimonial | Criticality: essential | Supports inference step 2
  Points to: witness, testimony, contradicted, mirror, positioning

• [clue_early_2] strategically, placed, mirror, creates, false, reflection, victim, misleading, witnesses, location, crime
  Category: spatial | Criticality: essential | Supports inference step 1
  Points to: mechanism, false, reflection, misled, witnesses

• [clue_fp_contradiction_step_1] Cross-check contradiction
  Category: structural | Placement: early (Act 1)
  Points to: what this observation reveals about the time or circumstances of the crime.

• [clue_mid_2] Direct observation
  Category: structural | Placement: early (Act 1)
  Points to: what this observation reveals about the time or circumstances of the crime.

For each clue above: an attentive reader should be able to find, record, and later use it to reason toward the solution.

═══ NARRATIVE STATE (read-only — do not contradict) ═══

LOCKED FACTS — use verbatim whenever this evidence is described:
  • The precise angle of the mirror that misled the witness.: "forty-five degrees"
  • The distance from the mirror to the victim, creating the illusion of proximity.: "twelve feet"
  • The exact time the murder was staged to mislead the timeline.: "ten minutes past ten"

CHARACTER PRONOUNS — never deviate from these:
  • Eleanor Voss: she/her/her
  • Dr. Mallory Finch: she/her/her
  • Captain Ivor Hale: he/him/his
  • Beatrice Quill: she/her/her
  • Sylvia Trent: she/her/her
  • Hugo Vane: he/him/his

CLUES ALREADY REVEALED TO READER: clue_mechanism_visibility_core, clue_mid_2, clue_core_contradiction_chain, clue_fp_contradiction_step_1 — do not reveal these as new information.

INVESTIGATION LOG — WHAT IS ESTABLISHED (do not re-establish, do not repeat):
• Evidence already established (reference only — do NOT restate or quote these; advance beyond them): mechanism, false, reflection, misled, witnesses | fingerprints, link, suspect, crime, scene | witness, testimony, contradicted, mirror, positioning | fingerprints, suggest, someone, manipulated, mirror
• Suspects still unresolved: Captain Ivor Hale[HE], Beatrice Quill[SHE], Sylvia Trent[SHE]
⚠ The story must move FORWARD from this log. Any beat already listed above is forbidden from repeating.

⚠ THIS CHAPTER'S REQUIRED ADVANCE (early): Interview each suspect — record their claimed whereabouts

CONTINUITY HANDOFF — previous chapter closing beat:
  • "She straightened, smoothing her skirt, and closed her notebook with a decisive snap. The investigation had shifted: what she had taken for granted—the reliability of witness accounts—was now in doubt. The mirror, the fingerprints, the angle of sight—all demand..."
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
Eleanor Voss, Dr. Mallory Finch, Beatrice Quill, Hugo Vane

✓ RULE: Use EXACTLY these names. Do NOT vary spelling, add titles, or introduce new forms.
✓ Example: if earlier chapters used "Clara Whitfield", keep using "Clara Whitfield" — never "Mrs. Whitfield" unless that is the character's canonical name in the list above.

**Setting Vocabulary Established in Earlier Chapters:**
garden, corridor

✓ RULE: Continue using this location vocabulary. Maintain consistency with established setting type.
✓ Do NOT introduce new location types that contradict earlier chapters.

**Recent Chapter Summary (for narrative continuity):**
Chapter 1: Chapter 1: Reflections in the Morning Light
  Events: Eleanor Voss pressed her gloved hand to the polished brass handle, the chill of the metal biting through the thin kid leather.
Chapter 2: Chapter 2: Witness Accounts
  Events: "You’re certain you saw her from the doorway?

⚠️ **VALIDATION:** Character name mismatches and setting drift are common failure modes.
Double-check every character name against the list above before using it.

**⏱ LOCKED TIME ANCHOR — use verbatim, do not paraphrase:**
Clock time (from the case ground truth): **"10 PM"**
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
Known location profile anchors: The Cliffside Hotel, Grand Lobby, Dining Room, Guest Rooms, Shared Balcony, the victim's room
LOCATION NAME CAPITALISATION (HARD REQUIREMENT — validated):
All named locations in your prose MUST use the EXACT capitalisation from the CML profiles.
Canonical forms: "The Cliffside Hotel", "Grand Lobby", "Dining Room", "Guest Rooms", "Shared Balcony", "the victim's room"
Writing a location in lowercase (e.g. "drawing room" instead of "Drawing Room") is a validated error. Every time you mention a named location, copy its capitalisation from the list above.
- Chapter 3: OPENING STYLE (HARD): Start the VERY FIRST SENTENCE with an explicit time marker — e.g. "That morning…" / "By the time dusk fell…" / "It was nearly four o'clock…" / "On the second day after the discovery…". Time must be in the first clause. Anchor opening in "the victim's room". The opening style above governs only your FIRST SENTENCE; the grounding below may land anywhere in the first 2 paragraphs (it need not be sentence one, and never conflicts with the chosen opening style). HARD REQUIREMENT for the first 2 paragraphs: (a) include 2+ sensory words — choose from smell/scent/odor/fragrance/sound/echo/silence/whisper/creak/cold/warm/damp/rough/smooth/glow/shadow/flicker/dim — and (b) include 1+ atmosphere/time word — choose from rain/wind/fog/storm/mist/thunder/evening/morning/night/dawn/dusk/lighting/weather/season/afternoon/midday/noon/midnight/twilight/sunrise/sunset/daylight/sunlight/overcast/cloudy/bright/dark/grey/pale/chill/crisp/drizzle/haze/lamplight/firelight. These are validated requirements, not style suggestions; missing them triggers a retry.

[⚠ INTERNAL QUALITY DIAGNOSTICS — DO NOT REPRODUCE ANY PART OF THIS SECTION IN YOUR STORY OUTPUT. These are private generator observations for your consideration only. Your narrative must read as if this section does not exist. Never include phrases from this block in character dialogue, narration, or description.]

PRIOR CHAPTER QUALITY OBSERVATIONS:
- Chapter 1 (score 96/100):
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

PROMPT BUDGET SUMMARY: budget=24000 tokens; fixed=12490; context=11384; dropped=[none]; truncated=[location_profiles, temporal_context, pronoun_accuracy]

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
5. Respect setting movement/access constraints in scene action and alibis: narrow hallways limit movement | balconies provide restricted access to certain areas | stormy weather can impede outdoor movement | staff-only areas such as the kitchen and maintenance rooms | guest access restricted to their assigned floors.
6. Sustain social coherence with this backdrop pressure: An inheritance dispute among hotel guests, complicated by post-war societal shifts and Cold War tensions, draws a diverse cast into a web of secrets and deception.
7. Maintain continuity around these socially central cast anchors where relevant: Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill, Sylvia Trent, Hugo Vane.
8. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Critical: Plot similarity 0.75 with 'The Second Key' (same spatial manipulation theme and 1940s setting)
9. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Moderate: Character similarity 0.74 driven by mirrored role dynamics (doctor, captain, heiress) and similar character count.
10. STORY TO DATE ANTI-COPY RULE: The STORY TO DATE section below is provided for chronological and factual reference ONLY. You MUST NOT copy, lightly rephrase, or structurally echo any sentence or paragraph from prior chapters. Every sentence in this chapter must be original prose unique to this scene. Reusing even a clause from prior chapter text will cause this attempt to fail immediately.

CRITICAL PROSE REQUIREMENTS:

The CML specifies exact requirements for certain validation-critical scenes. You MUST include these elements at the specified positions.

**Discriminating Test Scene (Act 3, Scene 4):**
Required elements: Execute the discriminating test, Observe the culprit's reaction or result, Draw conclusion about guilt
Test type: trap

**Suspect Clearance Scenes:**
- Captain Ivor Hale (Act 3, Scene 5): Confirmed alibi from hotel staff
  Clues: clue_id_1, clue_id_2
- Beatrice Quill (Act 3, Scene 5): No access to the crime scene at the time of death.
  Clues: clue_id_3
- Sylvia Trent (Act 3, Scene 5): Confirmed location by multiple witnesses.
  Clues: clue_id_4

**Culprit Revelation Scene (Act 3, Scene 6):**
Method: Confrontation with evidence

**Clue Placement for These Chapters:**
- clue_3 must appear in Act 1, Scene 3 via Direct observation
- clue_early_1 must appear in Act 1, Scene 3 via Direct observation
- clue_early_2 must appear in Act 1, Scene 3 via Direct observation
- clue_fp_contradiction_step_1 must appear in Act 1, Scene 3 via Cross-check contradiction
- clue_mid_2 must appear in Act 1, Scene 3 via Direct observation

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
Investigation state at start: 4 clue(s) revealed to reader; approximately 3 unresolved suspect(s).
Must change by end: Increase or complicate suspicion through a new pressure revelation — WITHOUT resolving the case: do NOT name, accuse, or extract a confession from the culprit, make an arrest, or declare the case closed (that is reserved for the final reveal).
Suspect pressure target(s): Hugo Vane
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
  - Scene is set in: the victim's room — reference it naturally within the paragraph, never as your opening phrase.
  - Opening atmosphere (MANDATORY — validator enforced): the first paragraph MUST contain at least one of: rain / wind / fog / storm / mist / thunder / evening / morning / night / dawn / dusk / season / afternoon / midday / noon / midnight / twilight / sunrise / sunset / daylight / sunlight / overcast / cloudy / bright / dark / grey / pale / cold / warm / chill / crisp / damp / drizzle / haze / lamplight / firelight. A chapter that omits all of these from its opening paragraph will be rejected.
  - PARAGRAPH OPENER DIVERSITY (MANDATORY — validator enforced): No more than 2 paragraphs in this chapter may begin with "Eleanor" or "Eleanor's" as the first word. You must vary paragraph openings throughout: use sensory observations, another character's name or action, dialogue, object or sound details, or temporal markers. Opening 3 or more paragraphs with "Eleanor" will cause automated rejection.
  - ⛔ MECHANISM SPOILER BAN: Do NOT state how the crime device was manipulated — not the direction, not the magnitude, not who performed it. Characters may only observe that two sources of evidence disagree. The specific method, tamper amount, and perpetrator's action are ALL FORBIDDEN until the reveal. WRONG: "The culprit had altered the device by forty minutes to create a false alibi." RIGHT: "Two independent pieces of evidence gave contradictory readings — a discrepancy neither could yet explain."
  - Continuity bridge: in the first 120 words, visibly connect from the previous chapter's final beat. Carry forward one unresolved element (object, accusation, emotional pressure, or immediate physical action) from: "She straightened, smoothing her skirt, and closed her notebook with a decisive snap. The investigation had shifted: what she had taken for granted—the reliability of witness accounts—was now in doubt. The mirror, the fin...".
  - CLUE OBLIGATIONS — each clue below MUST be dramatized, but in YOUR OWN WORDS:
    Render each as something a character SEES, DOES, or SAYS on the page. The bracketed text is a
    DESCRIPTION of the evidence for you — do NOT transcribe it as narration. Copying a clue's
    description sentence verbatim into the prose FAILS validation.
    • visible, fingerprints, smudged, mirror [clue_3] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: fingerprints, link, suspect, crime, scene
      ↳ MANDATORY TWO-PARAGRAPH STRUCTURE (must appear in paragraphs 1 or 2 — no later):
         Paragraph 1: The POV character physically approaches or directly observes this evidence.
           The narration or dialogue explicitly states what is seen (use the exact locked phrase if one applies).
         Paragraph 2 (immediately following): The detective or POV character explicitly reasons
           about what this evidence implies — who it implicates, why it may be unreliable,
           or what inference it supports. This must be a separate full paragraph, not a sentence appended to Paragraph 1.
    • mirror, angle, align, witness, description, attack [clue_early_1] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: witness, testimony, contradicted, mirror, positioning
      ↳ MANDATORY TWO-PARAGRAPH STRUCTURE (must appear in paragraphs 1 or 2 — no later):
         Paragraph 1: The POV character physically approaches or directly observes this evidence.
           The narration or dialogue explicitly states what is seen (use the exact locked phrase if one applies).
         Paragraph 2 (immediately following): The detective or POV character explicitly reasons
           about what this evidence implies — who it implicates, why it may be unreliable,
           or what inference it supports. This must be a separate full paragraph, not a sentence appended to Paragraph 1.
    • mirror, positioned, angle, victim, room [clue_early_2] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: mechanism, false, reflection, misled, witnesses
      ↳ MANDATORY TWO-PARAGRAPH STRUCTURE (must appear in paragraphs 1 or 2 — no later):
         Paragraph 1: The POV character physically approaches or directly observes this evidence.
           The narration or dialogue explicitly states what is seen (use the exact locked phrase if one applies).
         Paragraph 2 (immediately following): The detective or POV character explicitly reasons
           about what this evidence implies — who it implicates, why it may be unreliable,
           or what inference it supports. This must be a separate full paragraph, not a sentence appended to Paragraph 1.
    • mirror, positioned, angle, victim, room [clue_fp_contradiction_step_1] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: fingerprints, suggest, someone, manipulated, mirror
      ↳ MANDATORY TWO-PARAGRAPH STRUCTURE (must appear in paragraphs 1 or 2 — no later):
         Paragraph 1: The POV character physically approaches or directly observes this evidence.
           The narration or dialogue explicitly states what is seen (use the exact locked phrase if one applies).
         Paragraph 2 (immediately following): The detective or POV character explicitly reasons
           about what this evidence implies — who it implicates, why it may be unreliable,
           or what inference it supports. This must be a separate full paragraph, not a sentence appended to Paragraph 1.
    • visible, fingerprints, smudged, mirror [clue_mid_2] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: fingerprints, link, suspect, crime, scene
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
  - ALIBI LOCK: Hugo Vane's established alibi is "10 PM to 11 PM". Do NOT place Hugo Vane at any other location or in any other activity during the crime window. Any contradiction is a continuity error that triggers a retry.
  - TESTIMONY CONTINUITY: Hugo Vane has already made statements in earlier chapters. Any time, location, or claim attributed to Hugo Vane in THIS chapter must be consistent with those earlier statements. Do NOT introduce a new or different alibi claim — any contradiction is a continuity error.
- Locked fact phrase obligations:
  - If this batch mentions The precise angle of the mirror that misled the witness., write exactly: "forty-five degrees".
  - If this batch mentions The distance from the mirror to the victim, creating the illusion of proximity., write exactly: "twelve feet".
  - If this batch mentions The exact time the murder was staged to mislead the timeline., write exactly: "ten minutes past ten".
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
Batch chapters: 3-3.
Investigation state at start: 4 clue(s) revealed to reader; approximately 3 unresolved suspect(s).
Must change by end: Increase or complicate suspicion through a new pressure revelation — WITHOUT resolving the case: do NOT name, accuse, or extract a confession from the culprit, make an arrest, or declare the case closed (that is reserved for the final reveal).
Suspect pressure target(s): Hugo Vane
Required new information: At least one fear/motive/lie/loyalty reveal with investigative consequence.
Forbidden reveals at this stage: No culprit resolution: no confession, no arrest, no 'case closed', no accusation ('I accuse'/'I name'), and never state 'the culprit/murderer/killer is/was …'. The accusation is reserved for the final reveal — build suspicion only.

FROZEN FACT STATE (DO NOT ALTER):
- Timeline anchor: May (spring).
- Month, season, weather, and time-of-year language in this batch must stay compatible with spring.
- Established timeline fact: 10 PM
- Established timeline fact: 11 PM
- If referenced, use exact phrase: "forty-five degrees" (The precise angle of the mirror that misled the witness.).
- If referenced, use exact phrase: "twelve feet" (The distance from the mirror to the victim, creating the illusion of proximity.).
- If referenced, use exact phrase: "ten minutes past ten" (The exact time the murder was staged to mislead the timeline.).

STORY TO DATE (REFERENCE ONLY — DO NOT COPY VERBATIM):
- Full prior chapter text is provided below for continuity, factual consistency, and reference accuracy.
- Use this to keep character voice, chronology, clue state, and location continuity aligned with earlier chapters.
- Do not quote, copy, or paraphrase these paragraphs too closely; write fresh prose that remains consistent with them.

--- BEGIN PRIOR CHAPTER 1 ---
Title: Chapter 1: Reflections in the Morning Light
Eleanor Voss pressed her gloved hand to the polished brass handle, the chill of the metal biting through the thin kid leather. The air in the victim's room in the seaside hotel was cool and faintly damp, the scent of sea salt mingling with a sharper tang of soap. Outside, a pale spring light filtered through the rain-streaked window, casting a wan glow across the muted carpet. Silence reigned but for the distant, rhythmic crash of waves against the Scarborough cliffs—a sound that seemed to underscore the tension coiled within these walls. There, upon the floor, lay Dr. Mallory Finch, her form unnaturally still, the tailored sleeve of her suit jacket twisted at an awkward angle. Eleanor's breath caught, her mind cataloguing every detail even as her heart thudded in her chest.

The first thing that drew Eleanor's eye, beyond the dreadful tableau of Dr. Mallory Finch herself, was the large standing mirror angled oddly near the foot of the bed. It reflected a portion of the room that, at first glance, seemed ordinary—until Eleanor noticed how the mirror's surface caught not only the victim's prone figure but also the door and a swath of the carpet behind it. The glass was set at what could only be described as an unnatural tilt, almost precisely forty-five degrees, offering a view that would mislead any casual observer about the true position of the body. As she stepped closer, a smudge of fingerprints marred the otherwise gleaming surface, their presence stark and recent against the polished glass. The fingerprints were clustered near the edge, as though someone had gripped the mirror to adjust its angle in haste.

Eleanor crouched, careful not to disturb any trace evidence, and let her gaze linger on the fingerprints. Someone had handled the mirror not long before—or after—the fatal blow. The placement was too deliberate to be the result of idle vanity; no guest would fuss with the mirror at such a peculiar angle unless they meant to alter what could be seen, or hidden, from a particular vantage. The implication was clear: the mirror had been moved with intent, and whoever had left those prints had been in this room at a critical moment. Whether to conceal, to mislead, or to stage the scene, she could not yet say, but the fingerprints would be a silent witness to that act.

A soft creak of floorboards behind her signaled the presence of another. Hugo Vane stood in the doorway, his frame outlined by the dim morning light. His suit, though well-cut, bore the wrinkles of a night spent in restless vigil. He was the hotel’s private investigator, called in for discretion’s sake, but now looked more like a man who had seen too much. His eyes darted from Eleanor to the body, then to the mirror, lingering there with a flicker of something—recognition, perhaps, or unease. 'I—I saw her last night,' Hugo said, his voice low and rough. 'From across the room, I thought she was speaking to someone. But when I came closer, she was alone.' His hand hovered at his side, fingers twitching as if searching for a cigarette.

Eleanor rose, smoothing her skirt with a practiced gesture. 'You saw her from across the room?' she repeated, her tone measured. The statement was innocuous enough, but the mirror’s odd placement gnawed at her. She regarded Hugo, noting the way his gaze avoided the body, settling instead on the rain-dappled window. 'And you’re certain she was alone?'

Hugo’s jaw tightened. 'I’m certain of what I saw. Or thought I saw.' He let out a brittle laugh, devoid of humor. 'Life’s a mess, isn’t it? Sometimes you just have to laugh.' But the laugh died in his throat, and his eyes flicked once more to the mirror. 'It’s all wrong in here. The light, the angles—nothing seems quite as it should.'

Eleanor let the silence stretch between them, the only sound the distant echo of a radio crackling through the hallway—a newsreader’s clipped tones, a reminder that the world outside still turned. She glanced at the mirror again, the fingerprints stark against the glass. 'Someone wanted to change what could be seen from the doorway,' she murmured, more to herself than to Hugo. 'But why?'

Hugo shifted his weight, the floorboard protesting under his heel. 'You’re the detective, Miss Voss. I’m just here to keep the peace.' Yet his tone belied the words, and Eleanor caught the faintest tremor in his hand as he reached for his watch chain, gripping it tightly. She filed the gesture away, another detail in a morning already thick with questions.

The room itself offered little comfort. The bed was neatly made, a single book—'Brave New World'—lying open on the bedside table, its pages ruffled by the breeze seeping through the cracked window. A silk scarf, pale blue and embroidered, was draped across the armchair, as if abandoned mid-conversation. The only discordant note, aside from the body and the mirror, was a faint, metallic tang in the air—a trace of something sharp that prickled Eleanor’s senses.

She moved to the window, drawing aside the heavy curtain. The spring rain had eased, leaving droplets clinging to the glass and a haze over the garden below. In the distance, the sea churned, restless and grey. Eleanor’s reflection merged with the room behind her, fractured by the odd angle of the mirror. She wondered, not for the first time, how many truths could be hidden in plain sight, distorted by the simplest sleight of hand.

A knock at the door interrupted her reverie. 'Miss Voss?' The voice was tentative, female—Beatrice Quill, if she was not mistaken. Eleanor called for her to wait, her gaze never leaving the mirror. She drew a notebook from her handbag, jotting down the details: mirror at forty-five degrees, fingerprints on the right edge, body positioned to be visible in reflection from the door. She underlined the last point, her mind already racing ahead to the implications.

Hugo lingered by the threshold, his posture stiff. 'Do you think it was someone from outside? The room was locked when I arrived.' His words hung in the air, heavy with implication. Eleanor considered the lock, the windows, the corridor—a puzzle box with too many false leads. 'Locked rooms have a way of making the impossible seem plausible,' she replied, her voice soft. 'But nothing is ever quite as it appears.'

She turned back to Dr. Mallory Finch, her features peaceful in death, as if the violence that had ended her life was an afterthought, a mere interruption in the order of things. Eleanor felt a pang—of regret, perhaps, or anticipation. The investigation had begun, and with it, the slow unraveling of every secret the elegant walls of the hotel had tried to contain.

As Eleanor stepped away from the body, her gaze swept the room once more, seeking any detail that might have been overlooked. The fingerprints on the mirror, the peculiar angle, Hugo’s evasive glances—all pieces of a puzzle that refused to settle. She allowed herself a moment of relief, a single breath, before the weight of responsibility settled once more on her shoulders. The truth, she knew, would not reveal itself without a fight.
--- END PRIOR CHAPTER 1 ---

--- BEGIN PRIOR CHAPTER 2 ---
Title: Chapter 2: Witness Accounts
"You’re certain you saw her from the doorway?" Eleanor’s voice, low and clear, broke the hush that clung to the victim’s room. Rain tapped a steady rhythm against the glass, the faint scent of damp wool and sea salt lingering in the air. The lamplight cast long shadows across the faded carpet, illuminating the standing mirror angled near the foot of the bed—a silent accomplice in the room’s disarray. Eleanor’s gloved hand hovered above the fingerprints smudged on the mirror’s edge, her gaze tracing the unnatural tilt: precisely forty-five degrees, she noted, the reflection capturing not only the bed but the door and the patch of carpet where Dr. Mallory Finch had fallen. The cold morning pressed in, heavy with the echo of the waves below, as Eleanor examined the mirror’s surface and the story it seemed to tell.

The fingerprints—clustered, deliberate—suggested someone had gripped the mirror to adjust it, perhaps in haste, perhaps with purpose. Eleanor’s mind raced: the mirror’s angle would have distorted any witness’s view, making the body visible from the doorway even if it had not been so in reality. If Hugo Vane claimed to have seen Dr. Finch from across the room, was it truly her he saw, or only her reflection? The contradiction gnawed at her: the physical evidence of the fingerprints, the precise angle, and the testimony did not align. Someone had manipulated the scene, and the mirror was the linchpin. She pressed her lips together, weighing the implications—if the mirror was moved after the attack, the timeline and the witness accounts could be a carefully constructed illusion.

Hugo Vane lingered by the threshold, his posture rigid, eyes fixed on the mirror rather than the body. The morning light was grey and unkind, catching the lines of fatigue etched into his face. "You keep staring at that thing," he said, voice clipped, betraying a flicker of irritation. "It’s just a mirror, Miss Voss. People see what they want to see." He shifted, the floorboard creaking beneath his weight. "I told you—I saw her from the door, alone. The room was empty otherwise."

Eleanor regarded him, noting the way his fingers fidgeted with his watch chain, the knuckles whitening. "And you’re certain of the angle? Where you stood, what you saw?" she pressed, her tone gentle but insistent. Hugo’s jaw worked as if chewing over a bitter memory. "I know what I saw. She was lying there—well, not quite as she is now. The light was odd, reflections everywhere. It’s easy to get turned around in a place like this." His words trailed off, but Eleanor caught the evasive note beneath the bravado. She let the silence linger, the only sound the distant crackle of a radio broadcasting news of the spring’s political unrest.

"It’s odd, isn’t it?" Eleanor mused, stepping back to take in the whole of the room. "The mirror angled just so—forty-five degrees, by my eye. From the doorway, it gives the illusion of the body being closer to the window than it truly is. Yet from here, the perspective shifts entirely." She looked to Hugo, searching his face for any sign of recognition or guilt. "If someone moved the mirror after the fact, it would change everything about what a witness thought they saw."

Hugo’s gaze flicked to the mirror, then away. "You think someone staged it? That’s a bit theatrical, even for this place." His tone was sardonic, but Eleanor heard the tension threaded through it. "Life’s a mess, isn’t it? Sometimes you just have to laugh." The words hung in the damp air, as brittle as the morning light. Eleanor allowed herself a wry smile—dry wit as armor, she supposed—but did not relent. "The fingerprints suggest someone did. Not everyone leaves such clear traces behind."

A soft knock interrupted them. Beatrice Quill entered, her pale blue dress a muted echo of the springtime beyond the rain-streaked window. She hesitated on the threshold, her hands twisting the strap of her clutch purse. "I—am I interrupting?" Her voice was barely above a whisper, the tension in the room pressing down on her slight frame. Eleanor beckoned her in, gesturing to the armchair draped with Dr. Finch’s silk scarf. "Not at all, Miss Quill. I’d like to hear what you remember of last night."

Beatrice perched on the edge of the chair, her eyes darting between Eleanor and Hugo. "It was after ten," she began, her voice trembling. "I heard voices in the corridor—Dr. Finch and someone else, I think. I didn’t see who. When I passed by later, the door was closed. I thought I saw a shadow by the mirror, but perhaps it was just the lamplight." She faltered, glancing at the mirror’s gleaming surface. "Everything looked…strange. The room seemed longer than it should have, as if the walls had shifted."

Eleanor leaned forward, her gaze intent. "Did you notice the angle of the mirror? Was it as it is now?" Beatrice shook her head, uncertain. "I can’t say. I only remember the reflection—Dr. Finch’s silhouette, but it seemed wrong, somehow. As if she was standing where the bed is, but I know she couldn’t have been."

The contradiction sharpened in Eleanor’s mind. Both Hugo and Beatrice described seeing Dr. Finch from the doorway, yet the mirror’s position would have made that impossible unless it had been angled deliberately. The fingerprints, the testimony, the room’s geometry—all pointed to a manipulation of sightlines. Someone wanted to create confusion about where the victim had been at the time of the attack. Eleanor’s pulse quickened; the puzzle was more intricate than she had first believed.

"Thank you, Miss Quill," Eleanor said, her tone softening. "You’ve been very helpful." She made a note in her book, the scratch of her fountain pen loud in the hush. The spring rain intensified, drumming against the windowpane, as if urging her to press on. "If you recall anything else—anything at all—please let me know." Beatrice nodded, her relief palpable, and slipped from the room, the door closing with a muted click.

Eleanor turned back to Hugo, who had not moved from his post by the door. "You said the room was empty when you arrived. But if the mirror was angled at forty-five degrees, it would have shown you a reflection, not the real scene. Are you sure you weren’t misled by what you saw?" Hugo’s eyes narrowed, the cynicism in his voice now edged with something sharper. "You’re suggesting I imagined it? That’s convenient."

"Not imagined," Eleanor replied, "but perhaps manipulated. Someone wanted to control what the witnesses believed they saw. The fingerprints on the mirror—fresh, deliberate—suggest someone took pains to set the scene. If you saw Dr. Finch from the doorway, perhaps what you saw was not the truth, but what someone wanted you to see."

Hugo’s silence was telling. He stared at the mirror, the tension in his shoulders betraying a crack in his composure. "People see what they want to see," he repeated, softer this time. "Or what they’re meant to." Eleanor watched him, her own mind whirring with possibilities. The contradiction between the physical evidence and the witness accounts was no longer a minor detail—it was the heart of the deception.

A brief lull settled over the room, broken only by the steady drip of rain and the distant hum of a radio somewhere down the hall. Eleanor allowed herself a moment to breathe, the weight of the morning pressing less heavily for an instant. Even in the midst of murder, the world outside persisted—news bulletins, rationing schedules, the relentless march of spring.

She straightened, smoothing her skirt, and closed her notebook with a decisive snap. The investigation had shifted: what she had taken for granted—the reliability of witness accounts—was now in doubt. The mirror, the fingerprints, the angle of sight—all demanded a new theory. Eleanor’s suspicions, once scattered, now converged on the possibility of deliberate misdirection. She would need to test her conclusions, but for now, the contradictions were enough to cast suspicion on every account, especially Hugo’s. The truth, she thought, was as slippery as the rain-slicked stones outside the hotel. But she would not let it escape her grasp.
--- END PRIOR CHAPTER 2 ---

[SCENE COMPLETENESS CONTRACTS — MANDATORY. Each contract below lists what you MUST enact in that chapter. Do not summarise or mention these labels in the prose — enact them organically.]
Chapter 3 (Act 1) completeness contract:
  PIVOT ELEMENT (MANDATORY — write this into the prose, shown not told): "The fingerprints found on the mirror's surface."
  FACT ESTABLISHED (MANDATORY — reader must know this by chapter end): "Establishes that fingerprints on the mirror suggest someone manipulated it, narrowing the suspect pool."

# Case Overview
Title: Reflections of Deceit
Era: 1940s
Setting: An elegant 1940s seaside hotel
Crime: murder (spatial manipulation)
Culprit: Hugo Vane
Victim: Dr. Mallory Finch
False assumption: The victim was attacked from across the room.
Cast: Eleanor Voss (she/her), Dr. Mallory Finch (she/her), Captain Ivor Hale (he/him), Beatrice Quill (she/her), Sylvia Trent (she/her), Hugo Vane (he/him)

Setting Lock: Keep all scenes and descriptions consistent with the stated setting (An elegant 1940s seaside hotel). Do not introduce a different location type. Do not invent an alternative estate name. The only permitted name for this property is "An elegant 1940s seaside hotel" — any other estate name (e.g., "Caldwell Manor", "Ashwood Hall", or any invented proper name) is a continuity error that will be caught and rejected.

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
    "title": "Initial Investigation",
    "setting": {
      "location": "the victim's room",
      "timeOfDay": "Later that morning",
      "atmosphere": "Investigative focus amidst rising tension"
    },
    "characters": [
      "Eleanor Voss",
      "Hugo Vane"
    ],
    "purpose": "Begin examining physical evidence",
    "cluesRevealed": [
      "clue_3",
      "clue_early_1",
      "clue_early_2"
    ],
    "dramaticElements": {
      "conflict": "Eleanor's determination clashes with the suspects' discomfort.",
      "tension": "The atmosphere thickens as Eleanor investigates.",
      "microMomentBeats": [
        "Eleanor brushes her fingers over the mirror, feeling the cool surface."
      ]
    },
    "summary": "Eleanor inspects the victim's room more closely, discovering fingerprints on the mirror's surface and noting the peculiar positioning of the mirror itself. She confronts Hugo and Dr. Finch with her findings, pressing them for more details about their whereabouts during the murder.",
    "beat": "first_enquiries",
    "estimatedWordCount": 2000,
    "pivotElement": "The fingerprints found on the mirror's surface.",
    "factEstablished": "Establishes that fingerprints on the mirror suggest someone manipulated it, narrowing the suspect pool.",
    "permittedBehavioursByAct": [
      {
        "characterName": "Eleanor Voss",
        "behaviour": "Show normal social behaviour; grief or confusion if appropriate."
      },
      {
        "characterName": "Hugo Vane",
        "behaviour": "Show normal social behaviour; grief or confusion if appropriate."
      },
      {
        "characterName": "Dr. Mallory Finch",
        "behaviour": "Show normal social behaviour; grief or confusion if appropriate."
      }
    ],
    "redHerringPlacement": null,
    "emotionalRegister": "Tension escalates as guests navigate their secrets while the investigation begins.",
    "dominantCharacterNote": {
      "name": "Eleanor Voss",
      "voiceRegister": "Eleanor's voice is smooth and articulate, with a hint of dry wit that draws listeners in."
    },
    "humourGuidance": {
      "permission": "permitted",
      "character": "Eleanor Voss",
      "form": "dry_wit"
    },
    "eraTextureNote": "Travel is still limited due to rationing of fuel and materials; Communication relies heavily on radio broadcasts and postal services; Strict curfews and regulations from wartime linger in public life",
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
□ Chapter 3: the clue [clue_3] (fingerprints, mirror, surface, victim, room) is placed in the first 25% of the chapter, dramatized in your own words, followed by an explicit inference or suspicion paragraph.
□ Chapter 3: the clue [clue_early_1] (angle, mirror, contradicts, witness, account, attack) is placed in the first 25% of the chapter, dramatized in your own words, followed by an explicit inference or suspicion paragraph.
□ Chapter 3: the clue [clue_early_2] (strategically, placed, mirror, creates, false, reflection, victim, misleading, witnesses, location, crime) is placed in the first 25% of the chapter, dramatized in your own words, followed by an explicit inference or suspicion paragraph.
□ Chapter 3: the clue [clue_fp_contradiction_step_1] (fingerprints, mirror, surface, victim, room) is placed in the first 25% of the chapter, dramatized in your own words, followed by an explicit inference or suspicion paragraph.
□ Chapter 3: the clue [clue_mid_2] (fingerprints, mirror, surface, victim, room) is placed in the first 25% of the chapter, dramatized in your own words, followed by an explicit inference or suspicion paragraph.
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
