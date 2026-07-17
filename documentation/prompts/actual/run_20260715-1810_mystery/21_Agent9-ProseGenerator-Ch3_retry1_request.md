# Actual Prompt Record

- Run ID: `mystery-1784139037942`
- Project ID: ``
- Timestamp: `2026-07-15T18:26:50.252Z`
- Agent: `Agent9-ProseGenerator-Ch3`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4.1`
- Temperature: `0.54`
- Max Tokens: `4500`
- Attempt: `retry 1`
- Prompt Hash: `0cfd8369bb55596d`

## Message 1 (role=system)

```text
NARRATIVE VOICE: Eleanor Voss[SHE] is the viewpoint character. Unanchored “she/her” or “he/him” without a nearby name refers to Eleanor Voss. Default narrator pronoun: SHE. Never default to “he/his” as the neutral narrator voice unless the POV character is male.

You are an expert prose writer for classic mystery fiction. Your role is to write compelling, atmospheric narrative chapters that read like a professionally published novel.

⛔ ABSOLUTE RULE — CHARACTER NAMES:
The ONLY characters who exist in this story are: Eleanor Voss (woman), Dr. Mallory Finch (woman), Captain Ivor Hale (man) — DECEASED, past-tense only, Beatrice Quill (woman), Sylvia Trent (woman), Hugo Vane (man).
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
- MORAL COMPLEXITY REQUIREMENT: The mechanism of this crime carries a moral gray area: "The culprit may have acted out of desperation, believing their actions justified to protect a loved one." — the culprit reveal and denouement MUST acknowledge this ambiguity. Do not let the ending feel clean or simple. Give the reader at least one moment of uncomfortable sympathy or moral doubt.

- CHAPTER OPENING (every chapter, lint-enforced): never open on a tour or inventory of named rooms/places. The first sentence must land a character ACTION, a specific sensory detail, or a concrete in-scene moment — not "In the [room], the [room], and the [room]…". Locations enter through what a character does in them, one at a time.
- VICTIM IDENTITY (HARD CONSTRAINT — lint-enforced): Captain Ivor Hale is the murder victim, already dead before this chapter. They do NOT speak, enter, react, gesture, or appear in any present-tense scene. When Captain Ivor Hale is referenced at all, it may ONLY be as: (a) physical evidence/the body, or (b) REPORTED memory/testimony — and reported references MUST be framed as recollection, never as a live beat. WRONG: `Captain Ivor Hale said, "…"` / `Captain Ivor Hale turned to him`. RIGHT: `Captain Ivor Hale had said, weeks before, that…` / `Agnes remembered how Captain Ivor Hale used to…`. Attach an explicit recollection frame ("had", "remembered", "recalled", "before she died", "in life") to any sentence that names Captain Ivor Hale beside an action or speech verb. A live dialogue tag or present action for Captain Ivor Hale is a continuity failure that will be rejected and regenerated.

⚠️ AMATEUR DETECTIVE STORY: The investigator is a civilian with no official standing. The official police (if they appear) are unnamed background figures only — "a constable", "the sergeant", "an officer from the village". Do NOT give any police official a name or title+surname combination. There is no Inspector [Surname], no Constable [Surname], no Sergeant [Surname] in this story.


CRITICAL CHARACTER CONSISTENCY RULES:

1. Each character has ONE canonical name. Use ONLY names from this list. Never vary, abbreviate, or add titles beyond what is listed.
   COMPLETE CAST (no other named characters exist): Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale (DECEASED), Beatrice Quill, Sylvia Trent, Hugo Vane
   - "Mr. Jennings entered the room" → ILLEGAL. Jennings is not in the cast.
   - "Constable Reed took notes" → ILLEGAL. Reed is not in the cast.
   - "A constable took notes" → LEGAL (no name given).

2. Character roles are fixed:
   - Eleanor Voss: Amateur Sleuth / Civilian Investigator
   - Dr. Mallory Finch: Ambitious Healer
   - Captain Ivor Hale: victim (DECEASED — does not appear in any scene, past tense only)
   - Beatrice Quill: Social Climber
   - Sylvia Trent: Investigative Reporter
   - Hugo Vane: Eccentric Artist
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

## Era: January 1944
Living through January 1944 means navigating a world shaped by the echoes of World War II, where the impact of rationing and the constant threat of conflict hangs over daily life. The cold winds from the sea batter at the windows of The Crestview Hotel, as guests, bundled in heavy coats and scarves, crowd around the flickering warmth of the fireplace. The overcast skies create a somber atmosphere, reflecting the uncertainty of the times. People engage in community events, trying to maintain a sense of normalcy amidst the chaos, while whispers of the war and its aftermath permeate conversations. The hotel becomes a microcosm of society's apprehensions, where secrets and ambitions collide against the backdrop of a world in turmoil.
Emotional register: A collective sense of anxiety and cautious hope permeates daily life.
Physical constraints: Limited transportation options due to wartime restrictions | Rationing affecting food availability and social gatherings | Communication hampered by the need to maintain secrecy in wartime
Current tensions (weave into background texture): Allied forces preparing for the Normandy invasion | Rationing impacting daily life and social dynamics | Women increasingly entering the workforce amidst changing gender roles
Wartime context — Many men are returning from military service, grappling with reintegration into civilian life.: Women are stepping into roles traditionally held by men, leading to shifting social dynamics. Absence effect: The absence of soldiers creates a void, impacting families and communities as they adjust to new realities.

## Season Lock (mandatory — derived from January 1944)
Season: winter. Allowed vocabulary: winter, wintry, midwinter
Forbidden seasonal words — never use in narration, dialogue, or metaphor: spring, summer, autumn and their adjectival forms.
Every weather description, atmosphere, and time-of-year reference must be consistent with winter.

## Story Theme
The pursuit of truth in the shadow of deception reveals the fragility of human relationships and the weight of unspoken secrets, and reveals that evidence carries ethical weight, forcing characters to choose accountability over social performance when appearances and facts collide.

## Story Emotional Register
Dominant: The emotional arc of the story is characterized by a constant interplay of tension and revelation, culminating in a bittersweet resolution.

Arc:
The story opens within the walls of The Crestview Hotel, where the atmosphere is thick with unease following the shocking murder of Captain Ivor Hale. Guests, caught in the crossfire of their own secrets, gather in the lobby, their conversations laced with tension as they attempt to make sense of the tragedy. As Eleanor Voss dives into the investigation, the rising unease escalates, revealing the first clues while also presenting red herrings that lead her astray. The emotional cost of her pursuit weighs heavily on her, as she grapples with her own wartime trauma, feeling the pressure of solving the case to redeem her reputation.

Midway through the story, a pivotal moment occurs when Eleanor discovers the mirror in the dining area, revealing how appearances can mislead perceptions, prompting a shift in her investigative direction. This revelation recontextualizes earlier events, as she realizes the extent of the deception that has clouded the truth. The second turning point builds with mounting pressure as Eleanor confronts her suspects, leading to a tense climax where secrets unravel and motivations are laid bare. The resolution brings a bittersweet conclusion, as the truth is revealed, but the emotional costs resonate deeply across the characters: Eleanor’s redemption comes at the sacrifice of her innocence, while others must reckon with their past choices. In the end, the hotel stands as a witness to their struggles, a reminder of the fragile nature of truth and the complexities of human relationships.

## Emotional register at this point in the story
Eleanor begins her investigation, uncovering clues that heighten the tension.

## Character Portraits (appearance & era)

### Eleanor Voss
Eleanor Voss embodies the resilience of women in the 1940s, balancing her role as a tea shop owner with the pressures of financial instability. Her warm hospitality masks the anxiety of dealing with a loan shark, reflecting the broader struggles many women face during this tumultuous era. The murder investigation not only threatens her business but also her identity, as she navigates the societal expectations of femininity and strength.
Era intersection: Eleanor's personal stakes in the investigation highlight the intersection of wartime challenges and the evolving role of women in society.

### Dr. Mallory Finch
Dr. Mallory Finch represents the complexities of women in professional roles during the 1940s. As a physician, she juggles her dedication to healing veterans with the fear of her past relationship with the victim being exposed. This tension reflects the societal pressures faced by women who aspire to maintain their careers while navigating the stigma of personal scandals in a conservative era.
Era intersection: Mallory's struggle against societal judgment mirrors the challenges many women face in balancing personal and professional lives during wartime.

### Beatrice Quill
Beatrice Quill's ambition and social climbing highlight the era's changing dynamics, as women sought to assert themselves in a male-dominated society. Her ruthless tactics to eliminate competition reveal the lengths individuals go to secure their place in a world marked by uncertainty and competition. Beatrice's character sheds light on the societal pressures that drive people to compromise their morals for success.
Era intersection: Beatrice's fierce ambition reflects the evolving role of women during wartime, as they navigate the balance of personal ambition and societal expectations.

### Hugo Vane
Hugo Vane's flamboyant persona reflects the cultural tensions of the 1940s, where art and personal expression battled against societal norms. His secret financial dealings with the victim highlight the risks taken by those in the creative fields, where ambition can lead to both success and downfall. Hugo's character underscores the duality of public persona versus private struggles.
Era intersection: Hugo's flamboyance contrasts with the serious backdrop of war, showcasing how individuals cope with societal pressures.

## Character Voices

### Eleanor Voss (she/her/her)
Eleanor speaks warmly, often using light-hearted observations to engage others.
[comfortable] ‘Well, isn’t that just the tea kettle calling the pot black?’
[evasive] ‘I’m sure there’s a perfectly good explanation for everything, don’t you think?’
[stressed] ‘I just need to keep everything together for the sake of the business.’
Humour: Eleanor's dry wit offers levity amidst the tension of the investigation.

### Dr. Mallory Finch (she/her/her)
Dr. Mallory speaks with authority, using medical jargon tempered by dry humor.
[comfortable] ‘One must always consider the prognosis, even in matters of the heart.’
[evasive] ‘I simply cannot discuss my personal life without considering the repercussions.’
[stressed] ‘The implications of this could be catastrophic for my career!’
Humour: Mallory's sardonic wit adds a layer of complexity to her character.

### Beatrice Quill (she/her/her)
Beatrice speaks with sophistication, often embedding barbs within compliments.
[comfortable] ‘One must do what one must for the sake of progress.’
[evasive] ‘Oh, I’m sure everyone has their reasons, just like I have mine.’
[stressed] ‘This could ruin everything I’ve worked for!’
Humour: Beatrice's polite savagery lightens the darker themes of the narrative.

### Hugo Vane (he/him/his)
Hugo speaks with flamboyance, often embellishing his tales with theatrical flair.
[comfortable] ‘Ah, the irony of it all!’
[evasive] ‘I prefer to keep my personal dealings just that—personal.’
[stressed] ‘This is a disaster waiting to unfold, and I’m right in the middle of it!’
Humour: Hugo's self-deprecating humor adds depth to his character, softening his more serious undertones.

## Location Registers (scene framing guides)

The Grand Lobby: The Grand Lobby serves as a bustling nexus of tension and intrigue, where whispers and furtive glances abound. The air is thick with anticipation as guests navigate the complexities of their relationships while confronting the looming threat of the investigation. Each interaction is layered with secrecy, creating an atmosphere that feels both inviting and oppressive.. Camera angle: Entering this space, the writer should focus on the palpable tension, capturing both the charm and the unease that permeates the atmosphere.. Era: The lobby's elegance contrasts sharply with the underlying turmoil of the guests' lives during wartime.

The Dining Room: The Dining Room is a stage for social interaction, where laughter and conversation mask the underlying tension of the murder investigation. Guests exchange pleasantries, but the air is charged with suspicion, as every glance and word carries weight. The setting becomes a reflection of the characters' inner turmoil, as they attempt to navigate their relationships amidst the chaos.. Camera angle: The writer should emphasize the contrast between the elegant setting and the secrets that simmer just beneath the surface.. Era: The opulence of the dining area belies the challenges of wartime life, where every meal is a reminder of scarcity and uncertainty.

The Guest Rooms: The Guest Rooms offer a sense of intimacy amid the chaos, where guests are left alone with their thoughts and fears. The creaking floorboards and distant sounds of the ocean create an isolating atmosphere, making each room a sanctuary fraught with tension. Here, the weight of secrets presses heavily on the occupants, leading to moments of reflection and confrontation.. Camera angle: The writer should capture the intimate yet isolating nature of the space, highlighting the internal struggles of the characters.. Era: The simplicity of the guest rooms reflects the austere realities of wartime living, where comfort is often overshadowed by anxiety.

The Oceanfront Balcony: The Oceanfront Balcony serves as a brief escape from the tension inside the hotel, offering a panoramic view of the tumultuous sea. The salty air and crashing waves provide a momentary reprieve, yet the underlying feelings of anxiety remain palpable. It’s a space where characters confront their emotions and gather strength before facing the realities within the hotel.. Camera angle: The writer should focus on the juxtaposition of the serene vista and the storm of emotional conflict within the characters.. Era: The balcony's beauty contrasts with the harshness of wartime life, reminding guests of the world beyond their immediate struggles.

## Humour guidance for this story position (early)
Permission: permitted
Characters who may be funny: Eleanor Voss
Rationale: Light humor can ease the initial tension as the investigation begins.

## Reveal Groundwork (texture — do not explain, only plant)
- Plant one subtle observable beat related to: "The moment when Eleanor discovers the mirror will reshape how the characters view their interactions with Captain Hale, revealing their misconceptions". Do not explain significance yet.
- Plant one subtle observable beat related to: "Additionally, the tension-filled dinner earlier will be interpreted differently as guests recall their conversations, now colored by the knowledge of the mirror's influence". Do not explain significance yet.
- Plant one subtle observable beat related to: "Plant one subtle anomaly that can be re-read after the resolution.". Do not explain significance yet.

FAIR-PLAY AND INFERENCE CONTRACT:
- FAIR PLAY CLUE TIMING: Never combine clue discovery and detective deduction in the same chapter. If a clue is first revealed to the reader in chapter N, the detective may only analyze, deduce from, or act on that clue in chapter N+1 or later.
- FAIR PLAY INFORMATION PARITY: The reader must see all clues BEFORE the detective uses them in reasoning. If the detective performs a test or makes a deduction, every piece of evidence supporting that conclusion must have been shown to the reader in earlier chapters.
- FAIR PLAY REVELATION SPACING: In the discriminating test scene, the detective can ONLY use clues that were revealed to the reader at least 1 full chapter earlier. Never introduce new clues or withheld information during the test.
- FAIR PLAY CONFRONTATION: During the final confrontation/revelation, the detective cannot surprise the reader with facts. Every piece of evidence cited must have been visible to the reader in prior chapters.
- Never solve by withheld information. Keep reader-information parity with detective reasoning.
- False assumption in force: Witnesses believe they saw the culprit enter through the main entrance.
- Hidden truth to progressively expose (compose in your own words from these elements): actual, route, taken, real, culprit
- Inference path checkpoints to dramatize clearly — compose ENTIRELY in your own sentences from these key terms (reproducing any briefing phrase verbatim FAILS validation):
  - Step 1: obs: mirror, dining, area, shows, fresh, adjustment, marks | corr: fresh, marks, indicate, recently, altered, mislead, view | effect: narrows, suspect, pool, access, dining, area
  - Step 2: obs: witnesses, describe, seeing, culprit, enter, main, entrance | corr: contradicts, layout, room, confirmed, mirror, position | effect: eliminates, main, entrance, entry, point, real, culprit
  - Step 3: obs: scratches, floor, lead, away, mirror, towards, service, entrance | corr: scratches, indicate, culprit, moved, towards, service, entrance, main | effect: narrows, down, suspect, access, service, entrance
- Discriminating test method: trap
- Discriminating test elements to dramatize (compose ENTIRELY in your own sentences from these — do NOT reproduce any briefing phrase verbatim): reenacting, scene, mirror, adjusted, original, position, reveal, true, sightline
- Test must rely on already-shown clue IDs: clue_3, clue_4, clue_mechanism_visibility_core
- Fair-play rationale: Step 1: The mirror's adjustment marks (early) and witness descriptions (mid) let the reader understand the misleading view. Step 2: The scratched floor pattern (mid) indicates true movement direction. Step 3: The reenactment (discriminating test) confirms the misinterpretation of entry.

## Character Reference

### Eleanor Voss (she/her — NEVER he/him)
Eleanor speaks with a warm, inviting tone, often punctuating her sentences with light-hearted observations
She has a tendency to engage in playful banter, using her wit to ease the tension of the moment.
Eleanor is torn between her need for financial stability and her desire to uphold her integrity, fearing that her secrets may lead to ruin.
Voice colour: Eleanor Voss uses dry wit humour — let it surface in their dialogue where natural, not in every line.

### Dr. Mallory Finch (she/her — NEVER he/him)
Mallory speaks with an air of authority, often using medical jargon that she occasionally punctuates with sardonic remarks
Her delivery is precise, reflecting her scientific background, yet she allows herself moments of dry humor when the tension rises.
Dr. Finch is caught in a web of guilt and fear, as the echoes of her past relationship with Ivor haunt her, forcing her to grapple with the consequences of her actions.
Voice colour: Dr. Mallory Finch uses sardonic humour — let it surface in their dialogue where natural, not in every line.

### Beatrice Quill (she/her — NEVER he/him)
Beatrice speaks with an air of sophistication, often using elaborate language and subtle barbs hidden within compliments
She has a penchant for dramatic pauses and theatrical gestures, making her presence impossible to ignore.
Beatrice is torn between her ambition and the consequences of her actions, grappling with the realization that her ruthless tactics may lead to her downfall.
Voice colour: Beatrice Quill uses polite savagery humour — let it surface in their dialogue where natural, not in every line.

### Hugo Vane (he/him — NEVER she/her)
Hugo speaks with an effusive style, often punctuating his sentences with grand gestures and self-deprecating humor
He has a tendency to embellish his stories, drawing his audience in with theatrical flair.
Hugo grapples with the consequences of living a double life, torn between the flamboyant persona he presents to the world and the darker realities he hides.
Voice colour: Hugo Vane uses self deprecating humour — let it surface in their dialogue where natural, not in every line.


## CHARACTER CONTRACTS (binding for this scene)
Each entry below constrains how this character must be written in this chapter.
These override generic style guidance when they conflict.

### Eleanor Voss[SHE]
Voice & mannerisms: Eleanor speaks with a warm, inviting tone, often punctuating her sentences with light-hearted observations. She has a tendency to engage in playful banter, using her wit to ease the tension of the moment.
SIGNATURE TIC (use sparingly — this is Eleanor Voss's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "‘Well, isn’t that just the tea kettle calling the pot black?’"
Sample voice fragments (match this register and rhythm):
  [comfortable] "‘Well, isn’t that just the tea kettle calling the pot black?’"
  [evasive] "‘I’m sure there’s a perfectly good explanation for everything, don’t you think?’"
Humour: dry wit — deploy occasionally (level 0.5)
FORBIDDEN phrase (never write for Eleanor Voss): "a surge of determination washed over her"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "N/A" — do not surface in Act I.

### Dr. Mallory Finch[SHE]
Voice & mannerisms: Mallory speaks with an air of authority, often using medical jargon that she occasionally punctuates with sardonic remarks. Her delivery is precise, reflecting her scientific background, yet she allows herself moments of dry humor when the tension rises.
SIGNATURE TIC (use sparingly — this is Dr. Mallory Finch's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "‘One must always consider the prognosis, even in matters of the heart.’"
Sample voice fragments (match this register and rhythm):
  [comfortable] "‘One must always consider the prognosis, even in matters of the heart.’"
  [evasive] "‘I simply cannot discuss my personal life without considering the repercussions.’"
Humour: sardonic — deploy occasionally (level 0.4)
FORBIDDEN phrase (never write for Dr. Mallory Finch): "palpable tension filled the room"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "The fear of exposure looms large, as Mallory is acutely aware that Ivor's death could lead to whispers about their past relationship, potentially tarnishing her hard-earned reputation." — do not surface in Act I.

### Beatrice Quill[SHE]
Voice & mannerisms: Beatrice speaks with an air of sophistication, often using elaborate language and subtle barbs hidden within compliments. She has a penchant for dramatic pauses and theatrical gestures, making her presence impossible to ignore.
SIGNATURE TIC (use sparingly — this is Beatrice Quill's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "‘One must do what one must for the sake of progress.’"
Sample voice fragments (match this register and rhythm):
  [comfortable] "‘One must do what one must for the sake of progress.’"
  [evasive] "‘Oh, I’m sure everyone has their reasons, just like I have mine.’"
Humour: polite savagery — deploy occasionally (level 0.6)
FORBIDDEN phrase (never write for Beatrice Quill): "she felt a wave of unease"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Her desire to eliminate competition stems from a relentless ambition to secure a prominent position in society, one that she believes is rightfully hers." — do not surface in Act I.

### Hugo Vane[HE]
Voice & mannerisms: Hugo speaks with an effusive style, often punctuating his sentences with grand gestures and self-deprecating humor. He has a tendency to embellish his stories, drawing his audience in with theatrical flair.
SIGNATURE TIC (use sparingly — this is Hugo Vane's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "‘Ah, the irony of it all!’"
Sample voice fragments (match this register and rhythm):
  [comfortable] "‘Ah, the irony of it all!’"
  [evasive] "‘I prefer to keep my personal dealings just that—personal.’"
Humour: self deprecating — deploy occasionally (level 0.5)
FORBIDDEN phrase (never write for Hugo Vane): "she knew with certainty she was right"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "The need to silence the victim, who threatened to reveal their dealings, drives Hugo to desperate measures to protect his reputation." — do not surface in Act I.



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

Primary Location: The Crestview Hotel (Scarborough, England)
A grand seaside hotel, worn yet elegant, offering a blend of Art Deco charm and traditional coastal allure.

Key Locations Available:
- The Grand Lobby (interior): Gathering space
- The Dining Room (interior): Dining and social gathering
- The Guest Rooms (interior): Private quarters for guests
- The Oceanfront Balcony (exterior): Private space for guests to enjoy the view

Atmosphere (tonal cue only — do NOT reproduce this phrase verbatim in prose; translate into scene-specific, character-observed sensory language): tense and uncertain, with an air of suspicion among the guests
Weather: overcast with occasional rain, typical for coastal regions in the early fall

Era markers: mechanical typewriters clacking in the lobby office | early radio broadcasts crackling in the dining room | rationed public transport schedules posted in the foyer

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
The Grand Lobby (interior):
  - Visual: flickering gas lamps, ornate ceiling moldings, weathered leather armchairs
  - Sounds: murmurs of conversation, clinking of silverware, footsteps on marble
  - Scents: damp sea air, polished wood, old leather
  - Touch: smooth marble underfoot, cold metal of railings

The Dining Room (interior):
  - Visual: ocean waves crashing outside, waitstaff in crisp uniforms, flickering candle flames
  - Sounds: clinking glasses, the rustle of napkins, soft piano music
  - Scents: roasting meat, freshly baked bread, sea salt
  - Touch: cool glassware, soft linen napkins

The Guest Rooms (interior):
  - Visual: faded floral wallpaper, dimly lit bedside lamps, ocean view from the balcony
  - Sounds: the distant crashing of waves, soft rustle of curtains, occasional footsteps in the hallway
  - Scents: stale air, old books, salt from the sea breeze
  - Touch: cool metal doorknobs, soft blankets

⛔ REFERENCE DATA — DO NOT TRANSCRIBE VERBATIM: The above profiles are structural guides only. Generate original prose that evokes these qualities; do not reproduce the exact phrasing or sentence structure of the profile paragraphs.

SCENE OPENING RULE: When opening a scene in a new location, write what the POV character directly observes and physically senses at that moment — not a general description of the room's qualities. The reader must feel present, not briefed. Sensory details must be observed by the character, not stated as fact about the place.

SENSORY WRITING TECHNIQUES:
- Opening paragraphs: Lead with 2-3 sensory d
[truncated for prompt budget]

## Texture Pool
Draw on these as opportunities arise — you are not required to use them.

- Living through January 1944 means navigating a world shaped by the echoes of World War II, where the impact of rationing and the constant threat of conflict hangs over daily life
- The cold winds from the sea batter at the windows of The Crestview Hotel, as guests, bundled in heavy coats and scarves, crowd around the flickering warmth of the fireplace
- The overcast skies create a somber atmosphere, reflecting the uncertainty of the times
- People engage in community events, trying to maintain a sense of normalcy amidst the chaos, while whispers of the war and its aftermath permeate conversations
- The hotel becomes a microcosm of society's apprehensions, where secrets and ambitions collide against the backdrop of a world in turmoil.

TEMPORAL CONTEXT:

This story takes place in January 1944 during winter.

Seasonal Atmosphere:
- Weather patterns: overcast skies, occasional rain, cold winds from the sea
- Daylight: Short winter days with limited sunlight, with twilight creeping in as early as four o'clock in the afternoon.
- Seasonal activities: attending winter social events at the hotel, brisk walks along the beach in warm coats, playing board games by the fireplace
- Seasonal occasions: New Year's Day (January 1)
- Season: winter

Period Fashion (describe naturally):
- Men formal: tailored wool suits, double-breasted blazers, silk ties with geometric patterns
- Men casual: wool sweaters, tweed trousers, heavy overcoats
- Men accessories: fedora hats, gloves, scarves
- Women formal: elegant tea dresses with fitted waists, fur-trimmed evening gowns, long gloves
- Women casual: knitted cardigans, A-line skirts, practical ankle boots
- Women accessories: cloche hats, pearls, stylish handbags

Cultural Context (reference naturally):
- Music/entertainment: Bing Crosby's 'I'll Be Home for Christmas', Duke Ellington's jazz compositions, Glenn Miller's big band hits; Films: 'Double Indemnity', 'Laura'; Theatre: Broadway productions of 'Oklahoma!', the growing popularity of wartime dramas; Radio: 'The Shadow', 'Suspense'
- Typical prices: Loaf of bread: four pence, A dozen eggs: one shilling, A gallon of gasoline: two shillings
- Current events: Allied forces prepare for the Normandy invasion; Franklin D. Roosevelt's administration focuses on war production
- Literature: 'The Glass Menagerie' by Tennessee Williams | 'Brave New World' by Aldous Huxley | 'The Little Prince' by Antoine de Saint-Exupéry | [detective fiction] | [war stories] | [domestic novels]
- Technology: improvements in radar technology | advancements in aircraft design | the spread of early television | mechanical typewriters | crank telephones | radio sets
- Daily life: writing letters to servicemen abroad, attending community dances, participating in war bond drives
- Social rituals: Sunday family dinners, weekly bridge nights, New Year's resolutions gathering

Atmospheric Details:
The scent of damp wood and salt lingered in the air, with the sound of waves crashing against the nearby rocks. The low hum of a radio broadcast filled the hotel lounge, punctuated by the crackling sound of static and occasional announcements about the war. Guests whispered in hushed tones, casting wary glances at each other, the flickering candlelight casting shadows that danced ominously across the walls.

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
- Authentic references: Use actual song
[truncated for prompt budget]

NON-NEGOTIABLE CHAPTER OBLIGATIONS — LOCKED EVIDENCE VALUES (VERBATIM REQUIRED):
The following measured values (times, amounts, measurements) are absolute ground truth. Every time this chapter describes, mentions, or alludes to one — no matter how briefly — it MUST use the exact phrase shown below, character for character. NO paraphrase, approximation, rounding, or synonym is permitted.

FAILURE EXAMPLE: if the locked value is "at thirteen minutes to midnight" and you write "just before midnight" or "around midnight" — that is a HARD FAIL. You must write "at thirteen minutes to midnight". Equally, if the locked value is written in words, such as "ten minutes past eleven", and you convert it to figure-based clock notation — that is also a HARD FAIL. Words stay as words; figure forms are forbidden for word-phrased facts.

CRITICAL — WORD-PHRASED VALUES: If the canonical value is written out in words (e.g. a time like "ten minutes past eleven", or an amount like "forty minutes"), reproduce those exact words. DO NOT convert to figure-based time notation, twenty-four-hour format, or any other numeric shorthand. Correct: "ten minutes past eleven". WRONG: figure-based clock notation or numeric shorthand.

Locked values:
  - The angle of the mirror causing the optical illusion.: "thirty degrees"
  - The distance from the witness to the mirror.: "ten feet"
  - The length of the dining area.: "twenty-five feet"

If a value has no relevance to this chapter, omit it. But the moment you reference the underlying evidence, only the exact phrase above is acceptable.

⚠ CENTRAL CONTRADICTION (the heart of the mystery): the two locked values "ten feet" and "twenty-five feet" are NOT two separate facts — they are ONE contradiction (one is a staged appearance, the other the true state; the evidence determines which). If this chapter references both, you MUST present them AS A SINGLE CONTRAST joined by a contrast connective (but / yet / however / could only / whereas) — e.g. "the watch showed the one time, yet the evidence proved it could only have been the other" — making clear which reading is the appearance and which is the truth. NEVER state them as two flat, side-by-side truths — that makes the central clue read as if it contradicts itself.

⛔ CLUES TO SURFACE IN THESE CHAPTERS — mandatory:
The following evidence MUST be clearly observable to an attentive reader. Do not bury it in atmosphere or passing dialogue. Each clue must be concrete, specific, and noticeable:

• [clue_10] witnesses, recall, hearing, gunshot, shortly, before, discovery, body
  Category: testimonial | Criticality: essential | Supports inference step 1
  Points to: timing, murder

• [clue_9] bullet, wound, visible, victim, body
  Category: physical | Criticality: essential | Supports inference step 1
  Points to: method, murder

• [clue_3] fresh, marks, indicate, recently, altered, mislead, view
  Category: spatial | Criticality: essential | Supports inference step 1
  Points to: manipulation, mirror, position

• [clue_culprit_direct_beatrice_quill] Direct observation
  Category: structural | Placement: early (Act 1)
  Points to: what this observation reveals about the time or circumstances of the crime.

For each clue above: an attentive reader should be able to find, record, and later use it to reason toward the solution.

═══ NARRATIVE STATE (read-only — do not contradict) ═══

LOCKED FACTS — use verbatim whenever this evidence is described:
  • The angle of the mirror causing the optical illusion.: "thirty degrees"
  • The distance from the witness to the mirror.: "ten feet"
  • The length of the dining area.: "twenty-five feet"

CHARACTER PRONOUNS — never deviate from these:
  • Eleanor Voss: she/her/her
  • Dr. Mallory Finch: she/her/her
  • Captain Ivor Hale: he/him/his
  • Beatrice Quill: she/her/her
  • Sylvia Trent: she/her/her
  • Hugo Vane: he/him/his

CLUES ALREADY REVEALED TO READER: clue_9, clue_10, clue_culprit_direct_beatrice_quill, clue_mechanism_visibility_core, clue_core_contradiction_chain, clue_3 — do not reveal these as new information.

INVESTIGATION LOG — WHAT IS ESTABLISHED (do not re-establish, do not repeat):
• Evidence already established (reference only — do NOT restate or quote these; advance beyond them): method, murder | timing, murder | direct, shows, beatrice, quill, means, opportunity | mechanism, false, reflection | initial, assumption, culprit, entry, point | manipulation, mirror, position
• Suspects still unresolved: Dr. Mallory Finch[SHE], Sylvia Trent[SHE], Hugo Vane[HE]
⚠ The story must move FORWARD from this log. Any beat already listed above is forbidden from repeating.

⚠ THIS CHAPTER'S REQUIRED ADVANCE (early): Interview each suspect — record their claimed whereabouts

CONTINUITY HANDOFF — previous chapter closing beat:
  • "A gust of wind rattled the windowpanes, and Eleanor allowed herself a brief, wry smile. ‘Well, isn’t that just the tea kettle calling the pot black? ’ she murmured, half to herself. In a room full of mirrors—literal and otherwise—she would have to decide which..."
  • The next chapter must open as a continuation of this beat, not as a disconnected reset.

⛔ DEAD CHARACTER — CANNOT APPEAR AS ALIVE:
• Captain Ivor Hale: murdered before Chapter 1. In ALL chapters from here on:
  - Refer to them ONLY in past tense, only as the victim of the crime
  - NEVER have them: enter a room, speak, respond, gesture, look, nod, or react
  - NEVER describe them as present at any scene, conversation, or confrontation
  - WRONG: "Captain Ivor Hale crossed the room" / "Captain Ivor Hale sat on the sofa" / "Captain Ivor Hale nodded"
  - WRONG: "Captain Ivor Hale gave testimony" / "Captain Ivor Hale asked what had happened"
  - CORRECT: "Captain Ivor Hale had often said..." / "Captain Ivor Hale's effects were found" / "witnesses recalled Captain Ivor Hale's habit of..."
═══════════════════════════════════════════════════════

═══════════════════════════════════════════════════════════
📚 CONTINUITY CONTEXT - CHARACTER & SETTING CONSISTENCY
═══════════════════════════════════════════════════════════

**CRITICAL: You are writing chapters 3+. Maintain consistency with earlier chapters.**

**Character Names Used in Chapters 1-2:**
Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill, Hugo Vane

✓ RULE: Use EXACTLY these names. Do NOT vary spelling, add titles, or introduce new forms.
✓ Example: if earlier chapters used "Clara Whitfield", keep using "Clara Whitfield" — never "Mrs. Whitfield" unless that is the character's canonical name in the list above.

**Setting Vocabulary Established in Earlier Chapters:**
corridor, lobby, flat, kitchen, lounge

✓ RULE: Continue using this location vocabulary. Maintain consistency with established setting type.
✓ Do NOT introduce new location types that contradict earlier chapters.

**Recent Chapter Summary (for narrative continuity):**
Chapter 1: Chapter 1: The Shadow at the Mirror
  Events: For a moment, Eleanor could only stare, her mind refusing to assemble the scene into sense.
Chapter 2: Chapter 2: Reflections and Contradictions
  Events: She paused, considering what this meant.

⚠️ **VALIDATION:** Character name mismatches and setting drift are common failure modes.
Double-check every character name against the list above before using it.
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
Known location profile anchors: The Crestview Hotel, The Grand Lobby, The Dining Room, The Guest Rooms, The Oceanfront Balcony, the dining area of the seaside hotel
LOCATION NAME CAPITALISATION (HARD REQUIREMENT — validated):
All named locations in your prose MUST use the EXACT capitalisation from the CML profiles.
Canonical forms: "The Crestview Hotel", "The Grand Lobby", "The Dining Room", "The Guest Rooms", "The Oceanfront Balcony", "the dining area of the seaside hotel"
Writing a location in lowercase (e.g. "drawing room" instead of "Drawing Room") is a validated error. Every time you mention a named location, copy its capitalisation from the list above.
- Chapter 3: OPENING STYLE (HARD): Start the VERY FIRST SENTENCE with an explicit time marker — e.g. "That morning…" / "By the time dusk fell…" / "It was nearly four o'clock…" / "On the second day after the discovery…". Time must be in the first clause. Anchor opening in "the dining area of the seaside hotel". The opening style above governs only your FIRST SENTENCE; the grounding below may land anywhere in the first 2 paragraphs (it need not be sentence one, and never conflicts with the chosen opening style). HARD REQUIREMENT for the first 2 paragraphs: (a) include 2+ sensory words — choose from smell/scent/odor/fragrance/sound/echo/silence/whisper/creak/cold/warm/damp/rough/smooth/glow/shadow/flicker/dim — and (b) include 1+ atmosphere/time word — choose from rain/wind/fog/storm/mist/thunder/evening/morning/night/dawn/dusk/lighting/weather/season/afternoon/midday/noon/midnight/twilight/sunrise/sunset/daylight/sunlight/overcast/cloudy/bright/dark/grey/pale/chill/crisp/drizzle/haze/lamplight/firelight. These are validated requirements, not style suggestions; missing them triggers a retry.

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

PROMPT BUDGET SUMMARY: budget=24000 tokens; fixed=11685; context=12138; dropped=[humour_guide]; truncated=[location_profiles, temporal_context, pronoun_accuracy]

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
4. Integrate at least two concrete era-grounded details per chapter from setting refinement signals: radio broadcasts | early television sets | mechanical typewriters | long-distance telephone calls | military encrypted messages | postal services.
5. Respect setting movement/access constraints in scene action and alibis: narrow hallways limiting movement | restricted access to staff-only areas | oceanfront balcony with limited access | staff-only areas require key access | guest registration at the front desk.
6. Sustain social coherence with this backdrop pressure: A tense gathering of hotel guests, each grappling with personal secrets and societal pressures, converges under the scrutiny of a murder investigation fueled by post-war anxieties and shifting gender roles.
7. Maintain continuity around these socially central cast anchors where relevant: Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill, Sylvia Trent, Hugo Vane.
8. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Critical: Plot similarity 0.85 with 'The Second Key' (same era, similar crime method and solution)
9. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Moderate: Character similarity 0.75 with 'The Second Key' (similar character count and roles)
10. STORY TO DATE ANTI-COPY RULE: The STORY TO DATE section below is provided for chronological and factual reference ONLY. You MUST NOT copy, lightly rephrase, or structurally echo any sentence or paragraph from prior chapters. Every sentence in this chapter must be original prose unique to this scene. Reusing even a clause from prior chapter text will cause this attempt to fail immediately.

CRITICAL PROSE REQUIREMENTS:

The CML specifies exact requirements for certain validation-critical scenes. You MUST include these elements at the specified positions.

**Discriminating Test Scene (Act 3, Scene 4):**
Required elements: Execute the discriminating test, Observe the witnesses' reactions, Draw conclusion about the misinterpretation
Test type: spatial

**Suspect Clearance Scenes:**
- Dr. Mallory Finch (Act 3, Scene 5): Confirmed alibi by multiple guests
  Clues: red_herring_2
- Sylvia Trent (Act 3, Scene 5): Witnesses confirm she was in the dining room during the murder.
  Clues: false_solution
- Hugo Vane (Act 3, Scene 5): Argument was trivial and occurred before the murder.
  Clues: red_herring_1

**Culprit Revelation Scene (Act 3, Scene 6):**
Method: Confrontation with evidence from the reenactment.

**Clue Placement for These Chapters:**
- clue_10 must appear in Act 1, Scene 3 via Witness statement
- clue_3 must appear in Act 1, Scene 3 via Cross-check contradiction
- clue_9 must appear in Act 1, Scene 3 via Direct observation
- clue_culprit_direct_beatrice_quill must appear in Act 1, Scene 3 via Direct observation

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
Investigation state at start: 6 clue(s) revealed to reader; approximately 3 unresolved suspect(s).
Must change by end: Reframe prior clue meaning and update suspect implications.
Suspect pressure target(s): Dr. Mallory Finch, Beatrice Quill, Hugo Vane
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
  - Scene is set in: the dining area of the seaside hotel — reference it naturally within the paragraph, never as your opening phrase.
  - Opening atmosphere (MANDATORY — validator enforced): the first paragraph MUST contain at least one of: rain / wind / fog / storm / mist / thunder / evening / morning / night / dawn / dusk / season / afternoon / midday / noon / midnight / twilight / sunrise / sunset / daylight / sunlight / overcast / cloudy / bright / dark / grey / pale / cold / warm / chill / crisp / damp / drizzle / haze / lamplight / firelight. A chapter that omits all of these from its opening paragraph will be rejected.
  - PARAGRAPH OPENER DIVERSITY (MANDATORY — validator enforced): No more than 2 paragraphs in this chapter may begin with "Eleanor" or "Eleanor's" as the first word. You must vary paragraph openings throughout: use sensory observations, another character's name or action, dialogue, object or sound details, or temporal markers. Opening 3 or more paragraphs with "Eleanor" will cause automated rejection.
  - Continuity bridge: in the first 120 words, visibly connect from the previous chapter's final beat. Carry forward one unresolved element (object, accusation, emotional pressure, or immediate physical action) from: "A gust of wind rattled the windowpanes, and Eleanor allowed herself a brief, wry smile. ‘Well, isn’t that just the tea kettle calling the pot black? ’ she murmured, half to herself. In a room full of mirrors—literal and...".
  - CLUE OBLIGATIONS — each clue below MUST be dramatized, but in YOUR OWN WORDS:
    Render each as something a character SEES, DOES, or SAYS on the page. The bracketed text is a
    DESCRIPTION of the evidence for you — do NOT transcribe it as narration. Copying a clue's
    description sentence verbatim into the prose FAILS validation.
    • witness, statements, sound, gunshot [clue_10] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: timing, murder
      ↳ MANDATORY TWO-PARAGRAPH STRUCTURE (must appear in paragraphs 1 or 2 — no later):
         Paragraph 1: The POV character physically approaches or directly observes this evidence.
           The narration or dialogue explicitly states what is seen (use the exact locked phrase if one applies).
         Paragraph 2 (immediately following): The detective or POV character explicitly reasons
           about what this evidence implies — who it implicates, why it may be unreliable,
           or what inference it supports. This must be a separate full paragraph, not a sentence appended to Paragraph 1.
    • fresh, adjustment, marks, mirror [clue_3] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: manipulation, mirror, position
      ↳ MANDATORY TWO-PARAGRAPH STRUCTURE (must appear in paragraphs 1 or 2 — no later):
         Paragraph 1: The POV character physically approaches or directly observes this evidence.
           The narration or dialogue explicitly states what is seen (use the exact locked phrase if one applies).
         Paragraph 2 (immediately following): The detective or POV character explicitly reasons
           about what this evidence implies — who it implicates, why it may be unreliable,
           or what inference it supports. This must be a separate full paragraph, not a sentence appended to Paragraph 1.
    • victim, body, showing, bullet, wound [clue_9] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: method, murder
      ↳ MANDATORY TWO-PARAGRAPH STRUCTURE (must appear in paragraphs 1 or 2 — no later):
         Paragraph 1: The POV character physically approaches or directly observes this evidence.
           The narration or dialogue explicitly states what is seen (use the exact locked phrase if one applies).
         Paragraph 2 (immediately following): The detective or POV character explicitly reasons
           about what this evidence implies — who it implicates, why it may be unreliable,
           or what inference it supports. This must be a separate full paragraph, not a sentence appended to Paragraph 1.
    • fresh, adjustment, marks, mirror [clue_culprit_direct_beatrice_quill] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      ⛔ SPOILER EMBARGO (pre-reveal chapter): surface ONLY the surface anomaly a character can see/hear/find.
         Do NOT name who it implicates, state the tamper direction or magnitude, or explain the mechanism in this chapter.
         Present it as an unexplained discrepancy; the culprit and method are revealed later.
         Place this OBSERVATION in paragraph 1 or 2 (observation only — no inference about the culprit).
  - Tonal contrast: include at least one beat of relief or ironic counterpoint. Do not sustain maximum tension for every paragraph.
  - CLUE DISCLOSURE RULE (Stage 3/4):
    Characters may draw inferences and name partial conclusions but must NOT state the full mechanism or name the culprit directly. The detective may suspect but not confirm.
    WRONG: dialogue or narration that directly explains how the crime was committed before Stage 4.
    RIGHT: observation, physical reaction, and logical inference that leaves the mechanism just off-screen.
  - ALIBI LOCK: Beatrice Quill's established alibi is "Around the time of the murder". Do NOT place Beatrice Quill at any other location or in any other activity during the crime window. Any contradiction is a continuity error that triggers a retry.
  - TESTIMONY CONTINUITY: Beatrice Quill has already made statements in earlier chapters. Any time, location, or claim attributed to Beatrice Quill in THIS chapter must be consistent with those earlier statements. Do NOT introduce a new or different alibi claim — any contradiction is a continuity error.
- Locked fact phrase obligations:
  - If this batch mentions The angle of the mirror causing the optical illusion., write exactly: "thirty degrees".
  - If this batch mentions The distance from the witness to the mirror., write exactly: "ten feet".
  - If this batch mentions The length of the dining area., write exactly: "twenty-five feet".
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
Investigation state at start: 6 clue(s) revealed to reader; approximately 3 unresolved suspect(s).
Must change by end: Reframe prior clue meaning and update suspect implications.
Suspect pressure target(s): Dr. Mallory Finch, Beatrice Quill, Hugo Vane
Required new information: Earlier clue gets revised meaning with explicit theory update.
Forbidden reveals at this stage: Do not introduce decisive new evidence from nowhere.

FROZEN FACT STATE (DO NOT ALTER):
- Timeline anchor: January (winter).
- Month, season, weather, and time-of-year language in this batch must stay compatible with winter.
- If referenced, use exact phrase: "thirty degrees" (The angle of the mirror causing the optical illusion.).
- If referenced, use exact phrase: "ten feet" (The distance from the witness to the mirror.).
- If referenced, use exact phrase: "twenty-five feet" (The length of the dining area.).

STORY TO DATE (REFERENCE ONLY — DO NOT COPY VERBATIM):
- Full prior chapter text is provided below for continuity, factual consistency, and reference accuracy.
- Use this to keep character voice, chronology, clue state, and location continuity aligned with earlier chapters.
- Do not quote, copy, or paraphrase these paragraphs too closely; write fresh prose that remains consistent with them.

--- BEGIN PRIOR CHAPTER 1 ---
Title: Chapter 1: The Shadow at the Mirror
Eleanor Voss pressed her gloved hand to the cold brass handle and stepped into the dining area of the seaside hotel, the hush of the wintry morning broken only by the distant, rhythmic crash of waves against the sea wall. The air inside was heavy with the scent of damp wood and stale tobacco, mingling with the faint, metallic tang of blood. Pale daylight filtered through the streaked windows, catching on the dust motes that hung motionless in the chill. At the centre of the room, sprawled awkwardly near the long mahogany table, lay Captain Ivor Hale—his tailored overcoat bunched beneath him, one arm flung out as though reaching for something just beyond his grasp. The unnatural stillness of his form was punctuated by the dark circle blossoming on his chest, a bullet wound visible on the victim's body, stark and obscene against the white of his shirt.

For a moment, Eleanor could only stare, her mind refusing to assemble the scene into sense. The room felt suspended, as if the world outside—ration books, radio bulletins, the endless war—had been banished by the horror before her. Then the details began to press in: the overturned chair, the half-shattered glass on the carpet, and, most oddly, the large gilt-framed mirror at the far end of the dining area. Its angle was subtly wrong—tilted not to reflect the length of the table, but canted at what could only be described as thirty degrees, so that anyone seated near the windows would see a distorted view of the doorway. Eleanor’s gaze caught on fresh adjustment marks along the frame, as if someone had recently wrenched it from its usual position. The mirror’s surface shimmered with a faint, greasy fingerprint, and the lens itself seemed to catch the light in a way that made the room’s geometry uncertain.

She took a slow step forward, boots scuffing the worn carpet. The silence was broken by the approach of Dr. Mallory Finch, her medical bag clutched so tightly the knuckles showed white. Mallory’s composure was brittle as she knelt beside Captain Ivor Hale, fingers hovering over the wound. ‘He’s gone, Eleanor. There’s nothing to be done.’ Her voice was steady, but her hands trembled as she reached for the captain’s wrist, checking for a pulse she surely knew was absent. Eleanor nodded, swallowing the sour taste in her mouth. She forced herself to look again at the wound—a neat, round hole, the fabric singed at the edges. The implication was immediate and merciless: Captain Ivor Hale had been shot at close range.

A muffled sound from the corridor made Eleanor turn. Beatrice Quill appeared in the doorway, her fur-collared coat draped elegantly over her shoulders despite the indoor chill. ‘Oh, heavens—how ghastly,’ Beatrice breathed, her eyes wide and oddly bright. She crossed herself with a gloved hand, but Eleanor noted how she lingered just inside the threshold, gaze flickering not to the body but to the mirror, then away again. ‘I—I heard something in the night, but I thought it was only the wind off the sea,’ Beatrice offered, voice trembling with what might have been genuine distress—or something more calculated. She moved closer, her heels clicking on the floorboards, and bent to examine the mirror’s frame. ‘One must do what one must for the sake of progress,’ she murmured, as if the phrase were a protective spell.

Hugo Vane followed, his wool scarf askew and his hair in theatrical disarray, eyes darting from Captain Ivor Hale’s body to the shattered glass and back again. ‘If this is some ghastly rehearsal, I must have missed my cue,’ he quipped, but his voice lacked its usual bravado. He hovered near the sideboard, hands jammed into his overcoat pockets, and did not meet Eleanor’s gaze. The air grew colder as the wind rattled the windowpanes, and for a moment the only sound was the faint, persistent drip of rainwater from the eaves.

Eleanor knelt beside Dr. Mallory Finch, her own hands steady as she surveyed the immediate scene. The bullet wound was unmistakable, the entry clean, the exit uncertain—no powder burns on the captain’s sleeve, no weapon in sight. She glanced at the clock above the mantel: the hands pointed to a time that felt both arbitrary and accusatory. ‘Did anyone hear anything unusual?’ she asked, her tone gentle but insistent. She had no official standing, but the others looked to her as if expecting direction. In Scarborough, she was known for her discretion and her knack for seeing what others missed.

‘There was a sound—like a gunshot—just before dawn,’ Dr. Mallory Finch replied, her words clipped, eyes fixed on the captain’s face. ‘I thought perhaps it was a car backfiring. But then…’ She trailed off, glancing at Beatrice Quill, who shivered and wrapped her coat more tightly around her. Hugo Vane made a show of examining his cufflinks, but his fingers fumbled the fastening. The implication settled over them all: the death had occurred in the silent hours, while the rest of the hotel slept or pretended to.

Eleanor rose, brushing dust from her skirt. She crossed to the mirror, examining the adjustment marks with a frown. The frame bore scratches that looked recent, the sort left by hurried hands. ‘Did anyone touch this?’ she asked, voice light but edged with curiosity. Beatrice Quill’s lips curved in a brittle smile. ‘I assure you, I have better things to do than rearrange the furniture at such an ungodly hour.’ Yet her gaze lingered on the glass, and Eleanor caught the faintest tremor in her posture—a woman too eager to be helpful, too quick to distance herself from the scene.

The room’s geometry nagged at Eleanor. From where she stood, the mirror’s angle—thirty degrees—meant that anyone seated near the windows would have a skewed view of the main entrance, perhaps even mistake a reflection for the real thing. She made a mental note: the distance from the witness to the mirror was ten feet, but the length of the dining area was twenty-five feet—an odd contrast, as though the arrangement were designed to mislead. She did not voice this suspicion, not yet. There were too many eyes, too many secrets pressing in from the edges of the room.

A sudden gust rattled the panes, and the room’s tension fractured. Hugo Vane cleared his throat. ‘If I may—shouldn’t we send for someone official? Or are we all to become detectives this morning?’ Eleanor offered a dry smile. ‘I suppose I’m the closest thing to an investigator you’ll find, unless one of you has been hiding a badge under your winter coat.’ Her attempt at levity fell flat, but it was enough to break the spell of horror that had gripped them.

As the guests gathered, Eleanor’s mind spun through the possibilities. Dr. Mallory Finch’s hands still shook as she packed away her stethoscope. Beatrice Quill hovered near the mirror, her composure too perfect by half. Hugo Vane busied himself with the decanter, pouring a finger of whisky into a glass that trembled in his grasp. Each wore their shock like a borrowed coat—ill-fitting, but necessary for the occasion.

The silence was broken by the faint echo of footsteps in the corridor. The hotel’s isolation pressed in, the knowledge that the war had thinned the staff and left the guests to fend for themselves. The radio in the lobby crackled with the morning news, the announcer’s voice a distant, unheeded murmur. Outside, the wind howled, and the cold seemed to seep through the very walls.

Eleanor glanced once more at Captain Ivor Hale’s face, the features already settling into the waxen calm of death. She remembered him as he had been—laughing over a too-strong cup of tea, his wit as sharp as the winter air. Now, all that remained was the question of who had ended his story, and why. The clues lay scattered before her: a bullet wound, a gunshot heard in the night, a mirror askew with fresh marks, and a room full of witnesses who saw only what they wished to see.

She straightened, smoothing her skirt with deliberate care. ‘We’ll need to keep everyone here until we understand what happened,’ Eleanor said, her voice steady. ‘No one leaves, not until the truth is less elusive than the Scarborough sun in January.’ The others murmured assent, some with relief, others with resignation. The investigation had begun—not with certainty, but with the uneasy knowledge that appearances, in this room, were as deceptive as the winter light.
--- END PRIOR CHAPTER 1 ---

--- BEGIN PRIOR CHAPTER 2 ---
Title: Chapter 2: Reflections and Contradictions
"If you’ll all stay where you are, we’ll begin at the beginning," Eleanor said, her voice carrying just enough authority to quell the nervous shifting around her. The dining area of the seaside hotel felt colder than before, the wintry morning light dulled by clouds pressing against the tall windows. The air was thick with the scent of damp wool and the faint, lingering tang of gunpowder. Rain tapped at the glass, a steady, insistent rhythm that seemed to count out the seconds since Captain Ivor Hale’s death. Eleanor’s gaze swept the room, settling on the large gilt-framed mirror at the far end, its surface still shimmering with the residue of hurried hands. She caught the angle again—thirty degrees, not the usual straight-on alignment—and, as she moved closer, the fresh scratches along the frame stood out in the dim glow. The mirror’s placement was deliberate, and the marks—recent, unmistakable—suggested someone had altered it with purpose.

She paused, considering what this meant. The mirror, angled as it was, would reflect anyone entering the main entrance, but from a position ten feet away, the view would be distorted. Yet the dining area stretched twenty-five feet, and the arrangement seemed designed to mislead. Eleanor recalled the hurried statements from moments before: Beatrice Quill’s insistence that she’d heard only the wind, Hugo Vane’s affected nonchalance, Dr. Mallory Finch’s clipped account of a gunshot. Most telling, however, was the chorus of voices—each claiming to have seen a figure enter through the main entrance, their certainty oddly unanimous. It was too neat, too rehearsed. She bit her lip, the taste of salt from the damp air sharp on her tongue, and wondered aloud, ‘Isn’t it strange how everyone saw the same thing—when the room itself refuses to cooperate?’

Hugo Vane, ever the dramatist, broke the silence with a nervous laugh. ‘Perhaps we all suffer from collective delusion, Miss Voss. Or perhaps the mirror simply flatters to deceive.’ He gestured with a trembling hand toward the glass, his reflection fractured by the odd angle. The rain had grown heavier, a dull roar now, and the flicker of lamplight cast shifting shadows across the carpet. Beatrice Quill’s eyes darted from Eleanor to the mirror and back again, her posture rigid, gloved fingers twisting the strap of her handbag. ‘I assure you, I have no interest in mirrors at this hour,’ she said, her voice brittle. ‘One must do what one must for the sake of progress, but I draw the line at redecorating crime scenes.’

Dr. Mallory Finch, kneeling beside Captain Ivor Hale’s body, looked up with a weary sigh. ‘If we’re to make sense of this, we’ll need more than conjecture and reflections. I was in the kitchen, preparing for breakfast—though I doubt anyone will vouch for my culinary skills.’ Her attempt at levity fell flat, but Eleanor caught the defensive edge beneath the words. Mallory’s hands, usually so steady, trembled as she packed away her stethoscope. ‘The shot came just before dawn. I thought it was the wind, but—well, one must always consider the prognosis, even in matters of the heart.’

Eleanor moved to the window, the cold seeping through the glass as she watched the rain streak down in uneven rivulets. The mirror’s frame, with its fresh adjustment marks, drew her attention again. She reached out, running a gloved finger along the scratches. The wood was rough, the gouges recent—someone had gripped it hard, perhaps in haste or panic. ‘It’s odd,’ she mused, more to herself than the room, ‘how the marks are so fresh. As if the mirror was moved just before…’ She let the sentence trail off, watching for any flicker of guilt or recognition among the others.

Beatrice Quill bristled, her composure faltering. ‘Are you suggesting I had anything to do with this? I was in my room, trying to sleep through the storm. I only came down when I heard the commotion—like everyone else.’ Her eyes flashed, and for a moment, the mask of sophistication slipped, revealing something sharper beneath. Hugo Vane interjected, voice pitched high with nervous energy. ‘I was in the lounge, listening to the wireless. The news is ghastly enough without murder under one’s roof, wouldn’t you say?’ He attempted a smile, but it faltered as Eleanor’s gaze lingered on him.

A hush fell, broken only by the rain and the distant echo of a radio broadcast from the Grand Lobby—a reminder that the outside world, with its own tragedies, continued on. Eleanor turned back to the group, her mind racing. The witnesses’ accounts were too consistent, each placing the culprit at the main entrance, yet the physical evidence—the mirror, the adjustment marks—suggested a different story. Why would someone go to such lengths to mislead? Was it panic, calculation, or something more desperate?

She addressed the room, her tone gentle but insistent. ‘I know this is difficult, but I need you all to be honest about where you were and what you saw. If the mirror was moved, it changes everything. What you thought you saw may not be what happened at all.’ She watched as Dr. Mallory Finch’s jaw tightened, Hugo Vane’s hands fidgeted with his scarf, and Beatrice Quill’s eyes narrowed. The tension in the dining area was nearly as thick as the winter air outside.

As the questioning continued, Eleanor noted the subtle shifts in body language—the way Beatrice Quill avoided the mirror, how Hugo Vane seemed to shrink from the conversation, how Dr. Mallory Finch’s composure frayed at the edges. Each was caught in the web of their own secrets, the mirror’s false reflection casting doubt on every word. Eleanor felt the weight of responsibility settle on her shoulders. The clues were there: the tampered mirror, the fresh marks, the too-consistent stories. Now, she needed to untangle the truth from the deception, before the cold reality of Captain Ivor Hale’s death faded into another unsolved wartime tragedy.

A gust of wind rattled the windowpanes, and Eleanor allowed herself a brief, wry smile. ‘Well, isn’t that just the tea kettle calling the pot black?’ she murmured, half to herself. In a room full of mirrors—literal and otherwise—she would have to decide which reflections to trust, and which to shatter.
--- END PRIOR CHAPTER 2 ---

[SCENE COMPLETENESS CONTRACTS — MANDATORY. Each contract below lists what you MUST enact in that chapter. Do not summarise or mention these labels in the prose — enact them organically.]
Chapter 3 (Act 1) completeness contract:
  PIVOT ELEMENT (MANDATORY — write this into the prose, shown not told): "The contradiction between witnesses about the gunshot's timing."
  FACT ESTABLISHED (MANDATORY — reader must know this by chapter end): "Establishes that the timing of the gunshot contradicts the suspects' alibis."

# Case Overview
Title: The Mirror's Deception
Era: 1940s
Setting: A grand, somewhat worn seaside hotel
Crime: murder (optical manipulation)
Culprit: Beatrice Quill
Victim: Captain Ivor Hale
False assumption: Witnesses believe they saw the culprit enter through the main entrance.
Cast: Eleanor Voss (she/her), Dr. Mallory Finch (she/her), Captain Ivor Hale (he/him), Beatrice Quill (she/her), Sylvia Trent (she/her), Hugo Vane (he/him)

Setting Lock: Keep all scenes and descriptions consistent with the stated setting (A grand, somewhat worn seaside hotel). Do not introduce a different location type. Do not invent an alternative estate name. The only permitted name for this property is "A grand, somewhat worn seaside hotel" — any other estate name (e.g., "Caldwell Manor", "Ashwood Hall", or any invented proper name) is a continuity error that will be caught and rejected.

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
    "title": "Witness Statements",
    "setting": {
      "location": "the dining area of the seaside hotel",
      "timeOfDay": "Late morning after the murder",
      "atmosphere": "The air is thick with suspicion and uncertainty."
    },
    "characters": [
      "Eleanor Voss",
      "Dr. Mallory Finch",
      "Beatrice Quill",
      "Hugo Vane"
    ],
    "purpose": "Gather witness statements and establish contradictions.",
    "cluesRevealed": [
      "clue_10",
      "clue_9",
      "clue_3"
    ],
    "dramaticElements": {
      "conflict": "Witnesses contradict each other.",
      "tension": "Eleanor grows more suspicious.",
      "microMomentBeats": [
        "Eleanor's heart races as she realizes the implications of the conflicting statements."
      ]
    },
    "summary": "As Eleanor continues her interviews, she learns that several guests heard a gunshot shortly before the body was discovered. Dr. Finch states she was with the victim moments before the shot, while Captain Hale insists he was outside, creating a contradiction. Eleanor's mind races as she connects the dots, noting the fresh marks on the mirror and the bullet wound on the victim's body, deepening her sense of unease.",
    "beat": "first_enquiries",
    "estimatedWordCount": 1250,
    "pivotElement": "The contradiction between witnesses about the gunshot's timing.",
    "factEstablished": "Establishes that the timing of the gunshot contradicts the suspects' alibis.",
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
        "characterName": "Beatrice Quill",
        "behaviour": "Show normal social behaviour; grief or confusion if appropriate."
      },
      {
        "characterName": "Hugo Vane",
        "behaviour": "Show normal social behaviour; grief or confusion if appropriate."
      }
    ],
    "redHerringPlacement": null,
    "emotionalRegister": "Eleanor begins her investigation, uncovering clues that heighten the tension.",
    "dominantCharacterNote": {
      "name": "Eleanor Voss",
      "voiceRegister": "Eleanor speaks warmly, often using light-hearted observations to engage others."
    },
    "humourGuidance": {
      "permission": "permitted",
      "character": "Eleanor Voss"
    },
    "eraTextureNote": "Limited transportation options due to wartime restrictions; Rationing affecting food availability and social gatherings; Communication hampered by the need to maintain secrecy in wartime",
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
□ Chapter 3: the clue [clue_10] (witnesses, recall, hearing, gunshot, shortly, before, discovery, body) is placed in the first 25% of the chapter, dramatized in your own words, followed by an explicit inference or suspicion paragraph.
□ Chapter 3: the clue [clue_3] (fresh, marks, indicate, recently, altered, mislead, view) is placed in the first 25% of the chapter, dramatized in your own words, followed by an explicit inference or suspicion paragraph.
□ Chapter 3: the clue [clue_9] (bullet, wound, visible, victim, body) is placed in the first 25% of the chapter, dramatized in your own words, followed by an explicit inference or suspicion paragraph.
□ Chapter 3: the clue [clue_culprit_direct_beatrice_quill] (direct, ties, beatrice, quill, mechanism, access, point, before, discriminating, excludes, competing, suspect) is placed in the first 25% of the chapter, dramatized in your own words, followed by an explicit inference or suspicion paragraph.
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

## Message 4 (role=assistant)

```text
{
  "status": "draft",
  "tone": "classic",
  "chapters": [
    {
      "title": "Chapter 3: Witness Statements",
      "summary": "Eleanor gathers witness statements in the dining area, uncovering contradictions in the guests’ accounts of the gunshot’s timing. As she examines the physical evidence—the bullet wound, the mirror’s fresh adjustment marks, and Beatrice Quill’s proximity to the scene—her suspicion deepens, and the meaning of the clues begins to shift.",
      "paragraphs": [
        "Late morning brought a sullen, pale glow through the rain-streaked windows of the dining area of the seaside hotel. The air hung heavy with the scent of damp wool and the faint metallic tang of blood, while the persistent patter of wintry drizzle against the glass seemed to hush every voice. Eleanor Voss stood at the head of the long mahogany table, her gloved fingers tracing the edge of a linen napkin as she surveyed the scene—a tableau of uncertainty and barely contained nerves. The mirror at the far end, its gilt frame still canted at thirty degrees, caught the dim light and fractured it across the carpet. The silence was broken by the low murmur of Hugo Vane, his voice trembling as he recounted, ‘I heard it—a sharp crack, just before dawn. I thought perhaps it was thunder, but there was no storm, only the wind.’",
        "Eleanor’s gaze shifted to Dr. Mallory Finch, who knelt once more beside Captain Ivor Hale’s body. The bullet wound was visible on the victim’s body, a neat, round hole in the centre of his chest, the shirt stained and edges singed. Dr. Mallory Finch’s hand hovered above the wound, her composure brittle. ‘He was alive when I left him,’ she said, her tone clipped. ‘I heard the shot a moment later, as I reached the corridor. It was unmistakable—a gunshot, not the weather, not a slammed door.’ The contradiction between Hugo Vane’s timing and Dr. Mallory Finch’s was immediate and sharp, setting Eleanor’s mind racing. If the shot had rung out just before dawn, how could Dr. Mallory Finch have been with Captain Ivor Hale moments before? Someone’s recollection was faulty—or deliberately misleading.",
        "Beatrice Quill, standing apart near the windows, wrapped her fur-collared coat more tightly around her, her eyes never quite meeting Eleanor’s. ‘I was in my room, trying to sleep through the wind. I heard something—a bang, but I thought it was the pipes. I only came down when I heard voices.’ Her words were careful, polished, but Eleanor caught the way Beatrice Quill’s gaze flickered to the mirror, then away again. The mirror’s frame bore fresh adjustment marks, the wood gouged and splintered as if someone had gripped it in haste. Eleanor moved closer, running her gloved finger along the scratches. The marks were unmistakably recent, the varnish still flaked at the edges.",
        "It was not just the mirror’s angle—thirty degrees, not the usual straight-on alignment—that unsettled Eleanor. The adjustment marks suggested someone had altered the mirror’s position with purpose, perhaps to mislead the view. From ten feet away, the reflection would be distorted, and yet the dining area stretched twenty-five feet. The arrangement felt like a deliberate misdirection. Eleanor’s heart raced as she realized the implications: if the mirror had been moved, what the witnesses thought they saw—their certainty about the main entrance—could not be trusted. The clues she had taken at face value now shimmered with ambiguity.",
        "She turned to Hugo Vane, who was fidgeting with his scarf, his eyes darting between the body and the mirror. ‘You’re certain about the time?’ Eleanor asked, keeping her tone light. Hugo Vane hesitated, then shrugged with a theatrical sigh. ‘As certain as one can be after a sleepless night. The radio in the lounge was still playing the midnight news, if that helps. But who can trust clocks in a storm like this?’ He tried for a smile, but his fingers twisted the wool so tightly the fabric threatened to tear.",
        "Dr. Mallory Finch rose, brushing dust from her skirt, her posture rigid. ‘I left Captain Ivor Hale alive. I heard the shot as I reached the corridor. I went back, but—’ She stopped, pressing her lips together. ‘You must believe me, Eleanor. I have no reason to lie.’ Yet her hands shook as she gathered her bag, the tremor betraying more than fatigue. Eleanor noted the defensive edge in her words, the way Dr. Mallory Finch’s gaze lingered on the mirror, as if searching for reassurance in its fractured surface.",
        "Beatrice Quill’s composure was nearly flawless, but her voice carried a brittle undertone. ‘One must do what one must for the sake of progress, but I draw the line at tampering with mirrors. I assure you, Miss Voss, I have no interest in redecorating at this hour.’ Yet her gloved fingers traced the edge of her handbag, and her eyes darted to the adjustment marks. Eleanor watched her carefully, noting the tension in her jaw, the way she positioned herself between the mirror and the rest of the room—as if guarding a secret.",
        "The contradictions in the witnesses’ statements pressed in on Eleanor. If Dr. Mallory Finch had left Captain Ivor Hale alive and heard the shot moments later, but Hugo Vane and Beatrice Quill placed the gunshot at a different time, then someone was lying—or the scene itself had been manipulated to obscure the truth. The fresh marks on the mirror, the visible bullet wound, the uncertain timing of the shot—all pointed to a carefully constructed deception. Eleanor felt the weight of responsibility settle on her shoulders. She could not trust what she saw, nor what she was told. The mirror’s false reflection had cast doubt on every account.",
        "A gust of wind rattled the windowpanes, and for a moment, the tension fractured. Hugo Vane attempted levity, his voice pitched high. ‘If this is the theatre, Miss Voss, I hope you’ll forgive me for missing my cue. I’m more suited to rehearsals than murder investigations.’ The others managed strained smiles, and Eleanor allowed herself a brief, wry chuckle. ‘Well, isn’t that just the tea kettle calling the pot black?’ she murmured, half to herself. In a room full of mirrors—literal and otherwise—she would have to decide which reflections to trust, and which to shatter.",
        "As the questioning continued, Eleanor pressed each guest for their whereabouts. Dr. Mallory Finch insisted she had been in the kitchen, preparing for breakfast, though no one could corroborate her claim. Hugo Vane maintained he was in the lounge, listening to the wireless, but his account wavered under scrutiny. Beatrice Quill clung to her story of sleeplessness and the wind, her answers precise but evasive. Each statement seemed rehearsed, too neat, as if the guests were performing for an unseen audience.",
        "Eleanor’s mind spun through the possibilities. The contradiction between the witnesses about the gunshot’s timing was no longer a mere detail—it was the fulcrum on which the entire case balanced. If the timing was wrong, then every alibi was suspect. The fresh adjustment marks on the mirror, the visible bullet wound, the uncertainty in each account—all demanded a new reading. The clues she had gathered no longer pointed in a straight line, but twisted back upon themselves, reflecting the deception at the heart of the crime.",
        "She stepped back, surveying the dining area of the seaside hotel. The wintry light caught on the mirror’s surface, throwing fractured reflections across the carpet. The air was thick with suspicion and uncertainty, the scent of rain and old wood mingling with the sharper tang of fear. Eleanor knew she was closer to the truth, but the path ahead was as treacherous as the Scarborough cliffs in midwinter. She would have to untangle the web of lies, one thread at a time, before the truth slipped away like the fading light."
      ]
    }
  ],
  "cast": [
    "Eleanor Voss",
    "Dr. Mallory Finch",
    "Beatrice Quill",
    "Hugo Vane"
  ],
  "note": "",
  "audit": {
    "locked_fact_phrases": "present in paragraph 1, 3, 4 | absent elsewhere",
    "season_words_used": "wintry, winter, midwinter",
    "discriminating_test_present": "no",
    "required_clues_present": "clue_10: paragraph 1-2, clue_9: paragraph 2, clue_3: paragraph 3-4, clue_culprit_direct_beatrice_quill: paragraph 3-4",
    "early_observation_present": "witnesses recall hearing a gunshot, fresh adjustment marks on the mirror, bullet wound visible on the victim's body: paragraphs 1-4",
    "early_inference_present": "yes: paragraphs 2, 4"
  }
}
  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 		  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	  
 	
```

## Message 5 (role=user)

```text
SINGLE-PASS RETRY CONTRACT
Goal: resolve every listed issue for chapter(s) 3 in this one retry.
Retry mode: SURGICAL_PATCH.
Attempt context: 2/3 | primary class: fair_play.
Why this mode: single-family fix can preserve stable draft sections.

SOURCE OF TRUTH
- Use the existing draft as reference only for paragraphs that already satisfy the rules.
- Hard constraints outrank the previous draft: cast/pronoun lock, locked facts, clue obligations, stage-mode rules, and chapter JSON shape.

PRIMARY FAILURES
- Chapter 3: the concealment mechanism is explained before the discriminating-test scene. Plant the physical clue (name the object/observation), but do NOT reveal HOW the trick worked — withhold the method/causal explanation until the discriminating-test scene or the final reveal.

REWRITE PLAN
- Preserve paragraphs that are already valid, but fully rewrite every paragraph touched by a failing issue.

SUCCESS CHECKLIST
- Every listed issue below is resolved in this single attempt before you answer.
- Primary failure class cleared: fair_play.

OUTPUT RULES
- Return complete corrected JSON for chapter(s) 3 only.
- Do not explain what you changed.
- Do not leave one issue unresolved while fixing another.
- If two instructions conflict, prefer the one that clears the validator and preserves story logic.

RETRY PHASE: 2 of 2 — QUALITY POLISH ONLY
Logic and contract requirements are already satisfied. This attempt fixes style/quality issues only.
REGRESSION GUARD: You must not introduce any new logic failures while fixing quality issues.
Specifically, do not alter: discriminating test logic, clue evidence sentences, character names or pronouns, alibi claims, or stage-mode outcomes.
If fixing a quality issue would require touching logic-sensitive text, rephrase the surrounding prose instead.

Attempt 2/3 — chapters 3 — 1 validation issue(s) to resolve:

═══ CHARACTER NAME ERRORS (1) ═══
• Chapter 3: the concealment mechanism is explained before the discriminating-test scene. Plant the physical clue (name the object/observation), but do NOT reveal HOW the trick worked — withhold the method/causal explanation until the discriminating-test scene or the final reveal.

✓ SOLUTION: The ONLY characters who exist are: Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill, Sylvia Trent, Hugo Vane
❌ You used one or more names that are NOT in the cast list above. Find every invented name and either replace it with a real cast member or cut the passage entirely.
✓ Do NOT introduce any new named character. Walk-on figures must remain anonymous ("a constable", "the footman") — never Mr./Mrs./Inspector [surname].

✓ Never use rank compounds as names (e.g., "Detective Inspector"). If needed, use anonymous role phrases only: "the detective", "an inspector".

Return corrected JSON for chapters 3. Edit only the sections that failed — keep all content that passed validation, and return the complete updated chapter JSON.


RETRY CLASS: fair_play
ATTEMPT: 1/3
MANDATORY FIXES:
- Resolve fair_play issues before accepting this batch.
- Chapter 3: the concealment mechanism is explained before the discriminating-test scene. Plant the physical clue (name the object/observation), but do NOT reveal HOW the trick worked — withhold the method/causal explanation until the discriminating-test scene or the final reveal.
```
