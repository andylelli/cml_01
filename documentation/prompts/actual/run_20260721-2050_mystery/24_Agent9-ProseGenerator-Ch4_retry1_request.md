# Actual Prompt Record

- Run ID: `mystery-1784667048584`
- Project ID: ``
- Timestamp: `2026-07-21T20:58:50.567Z`
- Agent: `Agent9-ProseGenerator-Ch4`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4.1`
- Temperature: `0.64`
- Max Tokens: `4500`
- Attempt: `retry 1`
- Prompt Hash: `75ac5cddb6631b36`

## Message 1 (role=system)

```text
NARRATIVE VOICE: Hugo Vane[HE] is the viewpoint character. Unanchored “she/her” or “he/him” without a nearby name refers to Hugo Vane. Default narrator pronoun: HE. Never default to “he/his” as the neutral narrator voice unless the POV character is male.

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
- MORAL COMPLEXITY REQUIREMENT: The mechanism of this crime carries a moral gray area: "The murderer believed they were protecting their loved one from a fate worse than death, creating a conflict between justice and compassion." — the culprit reveal and denouement MUST acknowledge this ambiguity. Do not let the ending feel clean or simple. Give the reader at least one moment of uncomfortable sympathy or moral doubt.

- CHAPTER OPENING (every chapter, lint-enforced): never open on a tour or inventory of named rooms/places. The first sentence must land a character ACTION, a specific sensory detail, or a concrete in-scene moment — not "In the [room], the [room], and the [room]…". Locations enter through what a character does in them, one at a time.
- VICTIM IDENTITY (HARD CONSTRAINT — lint-enforced): Sylvia Trent is the murder victim, already dead before this chapter. They do NOT speak, enter, react, gesture, or appear in any present-tense scene. When Sylvia Trent is referenced at all, it may ONLY be as: (a) physical evidence/the body, or (b) REPORTED memory/testimony — and reported references MUST be framed as recollection, never as a live beat. WRONG: `Sylvia Trent said, "…"` / `Sylvia Trent turned to him`. RIGHT: `Sylvia Trent had said, weeks before, that…` / `Agnes remembered how Sylvia Trent used to…`. Attach an explicit recollection frame ("had", "remembered", "recalled", "before she died", "in life") to any sentence that names Sylvia Trent beside an action or speech verb. A live dialogue tag or present action for Sylvia Trent is a continuity failure that will be rejected and regenerated.

⚠️ AMATEUR DETECTIVE STORY: The investigator is a civilian with no official standing. The official police (if they appear) are unnamed background figures only — "a constable", "the sergeant", "an officer from the village". Do NOT give any police official a name or title+surname combination. There is no Inspector [Surname], no Constable [Surname], no Sergeant [Surname] in this story.


CRITICAL CHARACTER CONSISTENCY RULES:

1. Each character has ONE canonical name. Use ONLY names from this list. Never vary, abbreviate, or add titles beyond what is listed.
   COMPLETE CAST (no other named characters exist): Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill, Sylvia Trent (DECEASED), Hugo Vane
   - "Mr. Jennings entered the room" → ILLEGAL. Jennings is not in the cast.
   - "Constable Reed took notes" → ILLEGAL. Reed is not in the cast.
   - "A constable took notes" → LEGAL (no name given).

2. Character roles are fixed:
   - Eleanor Voss: Creative Spirit
   - Dr. Mallory Finch: Respected Healer
   - Captain Ivor Hale: Disillusioned Veteran
   - Beatrice Quill: Ambitious Outsider
   - Sylvia Trent: victim (DECEASED — does not appear in any scene, past tense only)
   - Hugo Vane: Entitled Heir
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

## Era: January 1942
In January 1942, life in England is marked by the pervasive tension of World War II. The foggy coastal town of Brighton, where the Seashell Hotel stands, feels the weight of uncertainty as rationing and wartime propaganda shape daily existence. The chill of winter adds to the atmosphere, with rain showers frequently dampening spirits. Short daylight hours foster a sense of confinement, as evenings draw in quickly, leaving many to seek solace within the hotel’s walls. Guests, drawn together by the shared experience of the war, navigate a landscape of hidden fears and ambitions, while the undercurrent of suspicion looms large amidst the camaraderie.
Emotional register: A collective anxiety permeates daily life, blending fear of the unknown with a flicker of hope for future peace.
Physical constraints: Limited travel due to rationing and wartime restrictions | Poor visibility from foggy weather impacting movement | Shortened days leading to increased isolation after dark
Current tensions (weave into background texture): Rationing of goods affecting daily life and social gatherings | Increasing propaganda urging support for the war effort | Wartime adjustments creating social and economic pressures
Wartime context — Many men and women are engaged in various forms of wartime service, from military enlistment to civilian efforts supporting the war.: The community is tightly knit, with shared experiences of loss and sacrifice shaping relationships and social interactions. Absence effect: The absence of loved ones serving in the military creates a palpable void, intensifying feelings of uncertainty and vulnerability.

## Season Lock (mandatory — derived from January 1942)
Season: winter. Allowed vocabulary: winter, wintry, midwinter
Forbidden seasonal words — never use in narration, dialogue, or metaphor: spring, summer, autumn and their adjectival forms.
Every weather description, atmosphere, and time-of-year reference must be consistent with winter.

## Story Theme
The story explores how the tides of jealousy, ambition, and secrets can drown even the most vibrant of lives in the turbulent waters of deception.

## Story Emotional Register
Dominant: The story oscillates between tension and revelation, reflecting the complexities of human nature amidst deception.

Arc:
The story opens in the Seashell Hotel, where the atmosphere is heavy with the tension of a stormy night, and a sense of foreboding lingers as guests settle in. The initial crime, the drowning of popular singer Sylvia Trent, sends ripples of unease through the hotel's vibrant social fabric. As Detective Hugo Vane begins his investigation, the rising tide of suspicion unveils a landscape filled with jealousy, ambition, and secrets, each clue leading to new questions and false leads that heighten the emotional cost for all involved. The first investigative turn reveals a web of intertwining relationships that complicate the timeline, pushing the narrative toward a mid-story pivot where a critical piece of evidence suggests foul play rather than accident. This revelation shifts the focus on Dr.

Mallory Finch, whose nervous demeanor and hidden motives come under scrutiny. As the pressure mounts, the second turn reveals the tangled threads of deceit, recontextualizing earlier events and darkening the atmosphere as the stakes escalate. The pre-climax tension builds as characters confront their pasts, leading to a climactic confrontation where the truth threatens to unravel everything. The resolution unfolds as the emotional costs of the investigation become clear, leaving characters forever changed, their secrets laid bare. Each character must grapple with the aftermath, as the consequences of their actions ripple through their lives, leaving a haunting reminder of the complexities of human nature amidst deception.

## Emotional register at this point in the story
The investigation takes a sharp turn as evidence begins to suggest foul play rather than mere accident.

## Character Portraits (appearance & era)

### Eleanor Voss
Eleanor Voss embodies the spirit of resilience in a time of war, balancing her art with the burden of a hidden past. As a former war-time spy, she feels the pressures of secrecy in a world where trust is fragile. The war has allowed her a creative outlet, but also a life fraught with anxiety over potential exposure.
Era intersection: Eleanor's artistic pursuits flourish amidst the war's chaos, yet her past threatens to resurface, complicating her desire for acceptance in a community grappling with its own struggles.

### Dr. Mallory Finch
Dr. Mallory Finch represents the duality of dedication and desperation common among women stepping into essential roles during wartime. Her commitment to her patients is shadowed by a dangerous addiction, reflecting the pressures many face as they juggle professional responsibilities and personal crises.
Era intersection: Mallory's struggles amplify during this period, as societal expectations weigh heavily on her, making her fear of exposure increasingly potent.

### Captain Ivor Hale
Captain Ivor Hale, a retired naval officer, embodies the complexity of honor in a time of conflict. His past betrayals haunt him, as he navigates the fine line between reputation and guilt. The war has left him with scars that shape his interactions, revealing a man wrestling with the ghosts of his history.
Era intersection: Ivor's memories of wartime decisions shape his present, exposing the inner turmoil faced by many veterans seeking redemption amidst the unfolding chaos.

### Hugo Vane
Hugo Vane embodies the allure and desperation of a man facing financial ruin. His polished exterior hides the turmoil of impending loss, showcasing the impact of war on societal status and personal integrity.
Era intersection: Hugo's financial struggles reveal the broader economic tensions of the time, mirroring the precarious nature of success in a world tiptoeing on the brink of chaos.

## Character Voices

### Eleanor Voss (she/her/her)
Eleanor speaks with a lyrical quality, often embellishing her words with artistic metaphors.
[comfortable] Ah, the colors of life are rarely monochrome; they swirl and blend like the stories we tell.
[evasive] Well, I was just... lost in thought, you see. The canvas had me entranced.
[stressed] Sometimes, I fear the shadows of my past may catch up with me. It’s a heavy burden.
Humour: Eleanor's dry wit often surfaces as a coping mechanism for her internal conflict.

### Dr. Mallory Finch (she/her/her)
Mallory's speech is quick, often punctuated by nervous energy and self-deprecating humor.
[comfortable] You know, healing is an art, much like cooking; both require a little spice.
[evasive] Oh, I was just... um, tending to patients, of course!
[stressed] I suppose that’s just one way to gamble with your life, isn’t it?
Humour: Her self-deprecating humor often masks her insecurities about her addiction.

### Captain Ivor Hale (he/him/his)
Ivor speaks in a clipped, commanding tone, with a bluntness that reflects his military background.
[comfortable] In my day, we didn’t have time for nonsense; we had battles to fight.
[evasive] Well, let’s not dwell on the past; what matters is moving forward.
[stressed] The weight of my past decisions... it haunts me more than the sea ever could.
Humour: Ivor’s blunt humor often hides a deeper layer of regret and reflection.

### Hugo Vane (he/him/his)
Hugo speaks smoothly, often masking tension with sarcasm and charm.
[comfortable] Ah, the price of ambition can be quite steep, wouldn’t you agree?
[evasive] Well, I was dining with friends; surely you can’t suspect me.
[stressed] With everything at stake, I can’t afford to be implicated in this mess.
Humour: Hugo's sardonic remarks often serve as a façade over his inner turmoil.

## Location Registers (scene framing guides)

Hotel Lobby: The lobby buzzes with a mix of excitement and tension, where guests congregate amidst whispered conversations, each carrying their secrets.. Camera angle: A writer entering this space should feel the electric charge of hidden stories just waiting to be uncovered.. Era: The atmosphere is thick with the weight of wartime anxieties and the need for connection.

Dining Room: The dining room hums with the soft clinking of cutlery and muted conversations, but an undercurrent of unease permeates the air, as secrets simmer beneath the surface.. Camera angle: A writer should approach this space with an eye for the swirling dynamics of both camaraderie and tension.. Era: Guests seek comfort in shared meals, yet the specter of war looms large.

Guest Rooms: The guest rooms provide a refuge filled with the salty scent of the sea, but the solitude can amplify one’s fears and doubts.. Camera angle: A writer should feel the intimacy of these spaces, aware that every room holds its own secrets.. Era: Isolation feels heightened, as the war rages on outside.

Kitchen: The kitchen is alive with the sounds of cooking and laughter, yet beneath the bustling exterior lies an atmosphere thick with tension and unspoken pressures.. Camera angle: A writer should capture the frenetic energy of this space, noting how food becomes a symbol of both sustenance and survival.. Era: The demands of wartime rationing create a palpable sense of urgency.

## Humour guidance for this story position (first_turn)
Permission: forbidden
Rationale: This scene is charged with emotional stakes, necessitating a serious tone.

## Reveal Groundwork (texture — do not explain, only plant)
- Plant one subtle observable beat related to: "Earlier in the story, when Sylvia was seen mingling with guests in the lobby, her charm masked deeper issues, hinting at her hidden life". Do not explain significance yet.
- Plant one subtle observable beat related to: "The moment when the detectives first interview Dr". Do not explain significance yet.
- Plant one subtle observable beat related to: "Finch reveals her nervous demeanor, foreshadowing her connection to the crime". Do not explain significance yet.

FAIR-PLAY AND INFERENCE CONTRACT:
- FAIR PLAY CLUE TIMING: Never combine clue discovery and detective deduction in the same chapter. If a clue is first revealed to the reader in chapter N, the detective may only analyze, deduce from, or act on that clue in chapter N+1 or later.
- FAIR PLAY INFORMATION PARITY: The reader must see all clues BEFORE the detective uses them in reasoning. If the detective performs a test or makes a deduction, every piece of evidence supporting that conclusion must have been shown to the reader in earlier chapters.
- FAIR PLAY REVELATION SPACING: In the discriminating test scene, the detective can ONLY use clues that were revealed to the reader at least 1 full chapter earlier. Never introduce new clues or withheld information during the test.
- FAIR PLAY CONFRONTATION: During the final confrontation/revelation, the detective cannot surprise the reader with facts. Every piece of evidence cited must have been visible to the reader in prior chapters.
- Never solve by withheld information. Keep reader-information parity with detective reasoning.
- False assumption in force: Sylvia drowned accidentally during high tide.
- Hidden truth to progressively expose (compose in your own words from these elements): actual, timing, death, manipulated, mislead, investigation
- Inference path checkpoints to dramatize clearly — compose ENTIRELY in your own sentences from these key terms (reproducing any briefing phrase verbatim FAILS validation):
  - Step 1: obs: tide, charts, sylvia, room, indicate, high, minutes, past, eleven | corr: timing, tide, suggests, sylvia, drowned, time | effect: narrows, timeline, drowning, around, high, tide
  - Step 2: obs: water, line, sylvia, clothing, shows, submerged, significant, height | corr: height, corresponds, high, tide, suggesting, water | effect: narrows, timeline, further, suggests, foul, play
  - Step 3: obs: mallory, finch, alibi, hold, seen, leaving, lobby, shortly, before, high, tide | corr: indicates, opportunity, manipulate | effect: eliminates, mallory, finch, suspect
- Discriminating test method: trap
- Discriminating test elements to dramatize (compose ENTIRELY in your own sentences from these — do NOT reproduce any briefing phrase verbatim): discriminating, compares, drown, manipulate, chart, claimed, timeline
- Test must rely on already-shown clue IDs: clue_mechanism_visibility_core, clue_core_contradiction_chain, clue_culprit_direct_1, clue_fp_contradiction_step_1
- Fair-play rationale: Step 1: The tide charts (early) and water line on Sylvia's clothing (mid) allow the reader to understand the timing of her drowning. Step 2: Dr. Finch's alibi (mid) is proven false by witness accounts. Step 3: The reenactment shows the contradictions in her timeline (discriminating test).

## Character Reference

### Eleanor Voss (she/her — NEVER he/him)
Eleanor speaks with a lyrical quality, often embellishing her words with artistic metaphors
She has a tendency to pause, as if painting the picture of her thoughts before sharing them.
Eleanor grapples with the burden of her past, torn between her desire to be a celebrated artist and the fear of what her hidden history could mean for her future.
Voice colour: Eleanor Voss uses dry wit humour — let it surface in their dialogue where natural, not in every line.

### Dr. Mallory Finch (she/her — NEVER he/him)
Mallory's speech is often laced with nervous energy, her sentences punctuated by half-hearted jokes that reveal her self-doubt
She tends to speak quickly, as if trying to outrun her own thoughts.
Mallory battles with the shame of her addiction, torn between the desire to maintain her facade of a competent doctor and the fear that her secrets will come tumbling down, exposing her failures.

### Captain Ivor Hale (he/him — NEVER she/her)
Ivor speaks in a clipped, commanding tone, often cutting to the chase with little regard for pleasantries
His words carry the weight of experience, and he has a tendency to punctuate his sentences with sharp observations.
Ivor wrestles with the ghosts of his past, caught between a desire for redemption and the fear of facing the truth about his wartime actions. The betrayal he endured has left him conflicted, and he struggles to reconcile the man he was with the man he wishes to be.
Voice colour: Captain Ivor Hale uses blunt humour — let it surface in their dialogue where natural, not in every line.

### Hugo Vane (he/him — NEVER she/her)
Hugo speaks with a smooth, confident cadence, often using sarcasm to mask his underlying tension
He has a penchant for grandiose statements that highlight his charm.
Hugo is torn between his desire for wealth and the moral implications of his actions. The thought of losing everything drives him to desperate measures, leaving him to question the cost of his ambition.
Voice colour: Hugo Vane uses sardonic humour — let it surface in their dialogue where natural, not in every line.


## CHARACTER CONTRACTS (binding for this scene)
Each entry below constrains how this character must be written in this chapter.
These override generic style guidance when they conflict.

### Eleanor Voss[SHE]
Voice & mannerisms: Eleanor speaks with a lyrical quality, often embellishing her words with artistic metaphors. She has a tendency to pause, as if painting the picture of her thoughts before sharing them.
SIGNATURE TIC (use sparingly — this is Eleanor Voss's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "Ah, the colors of life are rarely monochrome."
Sample voice fragments (match this register and rhythm):
  [comfortable] "Ah, the colors of life are rarely monochrome; they swirl and blend like the stories we tell."
  [evasive] "Well, I was just... lost in thought, you see. The canvas had me entranced."
Humour: dry wit — deploy occasionally (level 0.5)
FORBIDDEN phrase (never write for Eleanor Voss): "a surge of determination washed over her"
Act 2 behaviour contract: May show unease, evasion, or mild defensiveness when questioned. One behavioural tell is permitted. Internal conflict emerging: "Eleanor grapples with the burden of her past, torn between her desire to be a celebrated artist and the fear of what her hidden history could mean for her future."

### Dr. Mallory Finch[SHE]
Voice & mannerisms: Mallory's speech is often laced with nervous energy, her sentences punctuated by half-hearted jokes that reveal her self-doubt. She tends to speak quickly, as if trying to outrun her own thoughts.
SIGNATURE TIC (use sparingly — this is Dr. Mallory Finch's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "Well, I suppose that’s one way to gamble with your life."
Sample voice fragments (match this register and rhythm):
  [comfortable] "You know, healing is an art, much like cooking; both require a little spice."
  [evasive] "Oh, I was just... um, tending to patients, of course!"
Humour: self deprecating — deploy rarely (level 0.3)
FORBIDDEN phrase (never write for Dr. Mallory Finch): "she knew with certainty she was right"
Act 2 behaviour contract: May show unease, evasion, or mild defensiveness when questioned. One behavioural tell is permitted. Internal conflict emerging: "Mallory battles with the shame of her addiction, torn between the desire to maintain her facade of a competent doctor and the fear that her secrets will come tumbling down, exposing her failures."

### Captain Ivor Hale[HE]
Voice & mannerisms: Ivor speaks in a clipped, commanding tone, often cutting to the chase with little regard for pleasantries. His words carry the weight of experience, and he has a tendency to punctuate his sentences with sharp observations.
SIGNATURE TIC (use sparingly — this is Captain Ivor Hale's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "In my day, we didn’t have time for nonsense."
Sample voice fragments (match this register and rhythm):
  [comfortable] "In my day, we didn’t have time for nonsense; we had battles to fight."
  [evasive] "Well, let’s not dwell on the past; what matters is moving forward."
Humour: blunt — deploy occasionally (level 0.4)
FORBIDDEN phrase (never write for Captain Ivor Hale): "she chose her words with great care"
Act 2 behaviour contract: May show unease, evasion, or mild defensiveness when questioned. One behavioural tell is permitted. Internal conflict emerging: "Ivor wrestles with the ghosts of his past, caught between a desire for redemption and the fear of facing the truth about his wartime actions. The betrayal he endured has left him conflicted, and he struggles to reconcile the man he was with the man he wishes to be."

### Hugo Vane[HE]
Voice & mannerisms: Hugo speaks with a smooth, confident cadence, often using sarcasm to mask his underlying tension. He has a penchant for grandiose statements that highlight his charm.
SIGNATURE TIC (use sparingly — this is Hugo Vane's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "Ah, the price of ambition can be quite steep."
Sample voice fragments (match this register and rhythm):
  [comfortable] "Ah, the price of ambition can be quite steep, wouldn’t you agree?"
  [evasive] "Well, I was dining with friends; surely you can’t suspect me."
Humour: sardonic — deploy occasionally (level 0.6)
FORBIDDEN phrase (never write for Hugo Vane): "palpable tension filled the room"
Act 2 behaviour contract: May show unease, evasion, or mild defensiveness when questioned. One behavioural tell is permitted. Internal conflict emerging: "Hugo is torn between his desire for wealth and the moral implications of his actions. The thought of losing everything drives him to desperate measures, leaving him to question the cost of his ambition."



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

TEMPORAL CONTEXT:

This story takes place in January 1942 during winter.

Seasonal Atmosphere:
- Weather patterns: foggy conditions with low visibility, occasional rain showers, chilly winds coming off the coast
- Daylight: Short daylight hours, with the sun setting around 4:30 PM, leaving long evenings enveloped in darkness
- Seasonal activities: Indoor board games by the fireplace, Winter walks along the beach, despite the chill, Attending local theater productions or dances at the hotel
- Seasonal occasions: New Year's Day, Martin Luther King Jr. Day (observed)
- Season: winter

Period Fashion (describe naturally):
- Men formal: double-breasted wool suits in dark colors, white dress shirts with stiff collars, black leather shoes polished to a shine
- Men casual: tweed jackets with elbow patches, corduroy trousers, knit sweaters in muted tones
- Men accessories: fedoras or flat caps, silk ties with geometric patterns, leather gloves
- Women formal: elegant tea-length dresses with cinched waists, long-sleeved blouses with high necklines, hats adorned with feathers or flowers
- Women casual: knit cardigans over blouses, A-line skirts with patterned designs, ankle boots or practical shoes
- Women accessories: string pearls or beaded necklaces, gloved hands for elegant appearances, stylish clutches or handbags

Cultural Context (reference naturally):
- Music/entertainment: Bing Crosby's 'White Christmas', Glenn Miller's big band arrangements, Doris Day's early recordings; Films: 'Casablanca', 'Mrs. Miniver'; Theatre: Broadway shows like 'The Man Who Came to Dinner', Local performances of wartime comedies; Radio: 'The Shadow', 'Fibber McGee and Molly'
- Typical prices: Loaf of bread: four pence, A pint of milk: three pence, Cinema ticket: one shilling
- Current events: America's entry into World War II following the attack on Pearl Harbor; Mobilization of factories for war production
- Literature: 'The Glass Key' by Dashiell Hammett | 'The Maltese Falcon' by Dashiell Hammett | 'The Little Prince' by Antoine de Saint-Exupéry | [Detective fiction] | [War literature] | [Romance novels reflecting wartime sentiment]
- Technology: Radar technology for detecting aircraft | Improvements in radio communication | Advances in military vehicles and weaponry | Radio sets in homes and hotels | Typewriters for correspondence | Early telephones for communication
- Daily life: Socializing in local pubs and cafes, Participating in war bond drives, Engaging in community service efforts
- Social rituals: Weekly Sunday dinners with extended family, Community gatherings for wartime support, Listening to radio shows as a family activity

Atmospheric Details:
The salty scent of the sea mingles with the dampness of fog rolling in from the coast, creating a heavy atmosphere The sound of distant waves crashing against the rocky shore offers a rhythmic backdrop, interrupted only by occasional laughter or hushed conversations from hotel guests A palpable tension fills the air, as whispers of war and uncertain futures dominate discussions in the lounge, where the flickering light of a radio casts shadows on the walls

FASHION INTEGRATION TECHNIQUES:
- First appearance: Describe outfit to establish class/personality
- Accessories: Gloves, hats, pocket watches, jewelry reveal status
- Time-specific: Different outfits for different times of day
- C
[truncated for prompt budget]

NON-NEGOTIABLE CHAPTER OBLIGATIONS — LOCKED EVIDENCE VALUES (VERBATIM REQUIRED):
The following measured values (times, amounts, measurements) are absolute ground truth. Every time this chapter describes, mentions, or alludes to one — no matter how briefly — it MUST use the exact phrase shown below, character for character. NO paraphrase, approximation, rounding, or synonym is permitted.

FAILURE EXAMPLE: if the locked value is "at thirteen minutes to midnight" and you write "just before midnight" or "around midnight" — that is a HARD FAIL. You must write "at thirteen minutes to midnight". Equally, if the locked value is written in words, such as "ten minutes past eleven", and you convert it to figure-based clock notation — that is also a HARD FAIL. Words stay as words; figure forms are forbidden for word-phrased facts.

CRITICAL — WORD-PHRASED VALUES: If the canonical value is written out in words (e.g. a time like "ten minutes past eleven", or an amount like "forty minutes"), reproduce those exact words. DO NOT convert to figure-based time notation, twenty-four-hour format, or any other numeric shorthand. Correct: "ten minutes past eleven". WRONG: figure-based clock notation or numeric shorthand.

Locked values:
  - The time displayed on the victim's watch at the time of death.: "ten minutes past eleven"
    ⛔ FORBIDDEN alternatives: "11:10", "11.10", "eleven ten", "eleven-ten", "eleven past ten", "quarter past eleven", "half past eleven" — the ONLY acceptable form is "ten minutes past eleven"
  - The height of the tide at the time the body was found.: "three feet"
  - The predicted time of high tide according to the tide chart.: "eleven thirty"

If a value has no relevance to this chapter, omit it. But the moment you reference the underlying evidence, only the exact phrase above is acceptable.

⛔ CLUES TO SURFACE IN THESE CHAPTERS — mandatory:
The following evidence MUST be clearly observable to an attentive reader. Do not bury it in atmosphere or passing dialogue. Each clue must be concrete, specific, and noticeable:

• [clue_core_elimination_chain] mallory, finch, alibi, hold, seen, leaving, lobby, shortly, before, high, tide
  Category: testimonial | Criticality: essential | Supports inference step 2
  Points to: mallory, finch, opportunity, commit, crime

• [clue_2] height, corresponds, high, tide, suggesting, water
  Category: testimonial | Criticality: essential | Supports inference step 2
  Points to: relationship, tide, height, submersion

• [clue_culprit_direct_1] direct, links, mallory, finch, mechanism, access, point, before, discriminating, excludes, competing, suspect
  Category: testimonial | Criticality: essential | Supports inference step 3
  Points to: physical, trace, opportunity, indicate, mallory, finch, means, making, direct, clue, culprit, identification

For each clue above: an attentive reader should be able to find, record, and later use it to reason toward the solution.

═══ NARRATIVE STATE (read-only — do not contradict) ═══

LOCKED FACTS — use verbatim whenever this evidence is described:
  • The time displayed on the victim's watch at the time of death.: "ten minutes past eleven"
  • The height of the tide at the time the body was found.: "three feet"
  • The predicted time of high tide according to the tide chart.: "eleven thirty"

CHARACTER PRONOUNS — never deviate from these:
  • Eleanor Voss: she/her/her
  • Dr. Mallory Finch: she/her/her
  • Captain Ivor Hale: he/him/his
  • Beatrice Quill: she/her/her
  • Sylvia Trent: she/her/her
  • Hugo Vane: he/him/his

CLUES ALREADY REVEALED TO READER: clue_mechanism_visibility_core, clue_fp_contradiction_step_1, clue_core_contradiction_chain, clue_1, clue_culprit_direct_dr_mallory_finch, clue_early_1 — do not reveal these as new information.

INVESTIGATION LOG — WHAT IS ESTABLISHED (do not re-establish, do not repeat):
• Evidence already established (reference only — do NOT restate or quote these; advance beyond them): planned, nature, crime | timing, tide, suggests, sylvia, drowned, time | timing, high, tide | duration, submersion | direct, shows, mallory, finch, means, opportunity | timing, high, tide
• Suspect cleared: Eleanor Voss[SHE] — Witnesses corroborate her alibi.
• Suspect cleared: Captain Ivor Hale[HE] — His alibi aligns with security logs.
• Suspect cleared: Beatrice Quill[SHE] — Beatrice was with other staff during the time.
⚠ The story must move FORWARD from this log. Any beat already listed above is forbidden from repeating.

⚠ THIS CHAPTER'S REQUIRED ADVANCE (first_turn): Examine physical evidence — find at least one new clue

CONTINUITY HANDOFF — previous chapter closing beat:
  • "As Hugo prepared to leave, he glanced once more at the evidence. The investigation had not yet named its culprit, but the web of contradictions was growing tighter. The wintry rain resumed, and the dining room’s atmosphere remained heavy, its guests caught in..."
  • The next chapter must open as a continuation of this beat, not as a disconnected reset.

⛔ DEAD CHARACTER — CANNOT APPEAR AS ALIVE:
• Sylvia Trent: murdered before Chapter 1. In ALL chapters from here on:
  - Refer to them ONLY in past tense, only as the victim of the crime
  - NEVER have them: enter a room, speak, respond, gesture, look, nod, or react
  - NEVER describe them as present at any scene, conversation, or confrontation
  - WRONG: "Sylvia Trent crossed the room" / "Sylvia Trent sat on the sofa" / "Sylvia Trent nodded"
  - WRONG: "Sylvia Trent gave testimony" / "Sylvia Trent asked what had happened"
  - CORRECT: "Sylvia Trent had often said..." / "Sylvia Trent's effects were found" / "witnesses recalled Sylvia Trent's habit of..."
═══════════════════════════════════════════════════════

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
Known location profile anchors: Seashell Hotel, Hotel Lobby, Dining Room, Guest Rooms, Kitchen, the Seashell Hotel's lounge
LOCATION NAME CAPITALISATION (HARD REQUIREMENT — validated):
All named locations in your prose MUST use the EXACT capitalisation from the CML profiles.
Canonical forms: "Seashell Hotel", "Hotel Lobby", "Dining Room", "Guest Rooms", "Kitchen", "the Seashell Hotel's lounge"
Writing a location in lowercase (e.g. "drawing room" instead of "Drawing Room") is a validated error. Every time you mention a named location, copy its capitalisation from the list above.
- Chapter 4: OPENING STYLE (HARD): Start the VERY FIRST SENTENCE with a noun-phrase atmosphere — e.g. "The smell of damp stone in the cellar…" / "A chill from the landing…" / "The sound of the clock in the hall…". Pattern: "The/A [noun] of/in/from [place]…". Anchor opening in "the Seashell Hotel's lounge". The opening style above governs only your FIRST SENTENCE; the grounding below may land anywhere in the first 2 paragraphs (it need not be sentence one, and never conflicts with the chosen opening style). HARD REQUIREMENT for the first 2 paragraphs: (a) include 2+ sensory words — choose from smell/scent/odor/fragrance/sound/echo/silence/whisper/creak/cold/warm/damp/rough/smooth/glow/shadow/flicker/dim — and (b) include 1+ atmosphere/time word — choose from rain/wind/fog/storm/mist/thunder/evening/morning/night/dawn/dusk/lighting/weather/season/afternoon/midday/noon/midnight/twilight/sunrise/sunset/daylight/sunlight/overcast/cloudy/bright/dark/grey/pale/chill/crisp/drizzle/haze/lamplight/firelight. These are validated requirements, not style suggestions; missing them triggers a retry.

[⚠ INTERNAL QUALITY DIAGNOSTICS — DO NOT REPRODUCE ANY PART OF THIS SECTION IN YOUR STORY OUTPUT. These are private generator observations for your consideration only. Your narrative must read as if this section does not exist. Never include phrases from this block in character dialogue, narration, or description.]

PRIOR CHAPTER QUALITY OBSERVATIONS:
- Chapter 2 (score 97/100):
  Quality gaps noted: word density below preferred target (915/1000)
  Address in upcoming chapters: Increase chapter density with concrete investigation action and sensory-grounded beats; avoid recap-only padding.
- Phrases to avoid (already overused in earlier chapters): "one way to gamble with your life", "from ten o clock until half past", "ten o clock until half past eleven", "we didn t have time for nonsense", "in the dining room from half past", "the dining room from half past nine", "dining room from half past nine until", "room from half past nine until eleven", "the contradiction between the tide charts and".
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

PROMPT BUDGET SUMMARY: budget=24000 tokens; fixed=13454; context=10158; dropped=[humour_guide, location_profiles, texture_pool, continuity_context]; truncated=[location_profiles, temporal_context, pronoun_accuracy]

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
- Chapter numbering starts at 4 and increments by 1 per scene.
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
4. Integrate at least two concrete era-grounded details per chapter from setting refinement signals: radio broadcasting | early television sets | military radar technology | code-breaking devices | long-distance telephone calls | military encrypted messages.
5. Respect setting movement/access constraints in scene action and alibis: narrow hallways limiting movement | multiple floors with stairs but no elevators | oceanfront access restricted to specific areas | staff-only areas including kitchens and maintenance rooms | restricted access to certain guest floors after hours.
6. Sustain social coherence with this backdrop pressure: A coastal hotel hosts a diverse group of guests and staff amid post-war anxieties, where the pressure of social expectations and the specter of recent tragedies converge during a stormy summer.
7. Maintain continuity around these socially central cast anchors where relevant: Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill, Sylvia Trent, Hugo Vane.
8. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Critical: Plot similarity 0.80 with 'The Second Key' (same drowning method and temporal axis)
9. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Moderate: Character similarity 0.70 with 'The Mysterious Affair at Styles' (similar cast structure and dynamics)
10. STORY TO DATE ANTI-COPY RULE: The STORY TO DATE section below is provided for chronological and factual reference ONLY. You MUST NOT copy, lightly rephrase, or structurally echo any sentence or paragraph from prior chapters. Every sentence in this chapter must be original prose unique to this scene. Reusing even a clause from prior chapter text will cause this attempt to fail immediately.

CRITICAL PROSE REQUIREMENTS:

The CML specifies exact requirements for certain validation-critical scenes. You MUST include these elements at the specified positions.

**Discriminating Test Scene (Act 3, Scene 4):**
Required elements: Execute the discriminating test, Observe the culprit's reaction or result, Draw conclusion about guilt

**Suspect Clearance Scenes:**
- Eleanor Voss (Act 3, Scene 5): Witnesses corroborate her alibi.
  Clues: clue_id_1, clue_id_2
- Captain Ivor Hale (Act 3, Scene 5): His alibi aligns with security logs.
  Clues: clue_id_3, clue_id_4
- Beatrice Quill (Act 3, Scene 5): Beatrice was with other staff during the time.
  Clues: clue_id_5, clue_id_6

**Culprit Revelation Scene (Act 3, Scene 6):**
Method: Confrontation with evidence

**Clue Placement for These Chapters:**
- clue_core_elimination_chain must appear in Act 2, Scene 1 via Corroborated elimination

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
Batch chapters: 4-4.
Investigation state at start: 6 clue(s) revealed to reader; approximately 0 unresolved suspect(s).
Must change by end: Increase or complicate suspicion through a new pressure revelation — WITHOUT resolving the case: do NOT name, accuse, or extract a confession from the culprit, make an arrest, or declare the case closed (that is reserved for the final reveal).
Suspect pressure target(s): Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale
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
- Chapter 4:
  - STRUCTURAL ARCHETYPE — Chapter 4 must be: ALIBI_PROBE
      ✓ MUST contain: one alibi tested with a stated result
      ✗ MUST NOT contain: 
  - Word count: Target 1250 words. Achieve this through plot events, dialogue exchanges, and physical investigation — not through atmospheric repetition or extended internal reflection. Each 200-word segment should contain at minimum one concrete story event (a discovery, a conversation exchange, a physical action or movement). Padding with atmosphere alone is not acceptable.
  - Opening: Begin with a character action, spoken line, or clock/time marker — never a location name or location-description phrase.
  - Scene is set in: the Seashell Hotel's lounge — reference it naturally within the paragraph, never as your opening phrase.
  - Opening atmosphere (MANDATORY — validator enforced): the first paragraph MUST contain at least one of: rain / wind / fog / storm / mist / thunder / evening / morning / night / dawn / dusk / season / afternoon / midday / noon / midnight / twilight / sunrise / sunset / daylight / sunlight / overcast / cloudy / bright / dark / grey / pale / cold / warm / chill / crisp / damp / drizzle / haze / lamplight / firelight. A chapter that omits all of these from its opening paragraph will be rejected.
  - PARAGRAPH OPENER DIVERSITY (MANDATORY — validator enforced): No more than 2 paragraphs in this chapter may begin with "Hugo" or "Hugo's" as the first word. You must vary paragraph openings throughout: use sensory observations, another character's name or action, dialogue, object or sound details, or temporal markers. Opening 3 or more paragraphs with "Hugo" will cause automated rejection.
  - ⛔ MECHANISM SPOILER BAN: Do NOT state how the crime device was manipulated — not the direction, not the magnitude, not who performed it. Characters may only observe that two sources of evidence disagree. The specific method, tamper amount, and perpetrator's action are ALL FORBIDDEN until the reveal. WRONG: "The culprit had altered the device by forty minutes to create a false alibi." RIGHT: "Two independent pieces of evidence gave contradictory readings — a discrepancy neither could yet explain."
  - Continuity bridge: in the first 120 words, visibly connect from the previous chapter's final beat. Carry forward one unresolved element (object, accusation, emotional pressure, or immediate physical action) from: "As Hugo prepared to leave, he glanced once more at the evidence. The investigation had not yet named its culprit, but the web of contradictions was growing tighter. The wintry rain resumed, and the dining room’s atmosphe...".
  - CLUE OBLIGATIONS — each clue below MUST be dramatized, but in YOUR OWN WORDS:
    Render each as something a character SEES, DOES, or SAYS on the page. The bracketed text is a
    DESCRIPTION of the evidence for you — do NOT transcribe it as narration. Copying a clue's
    description sentence verbatim into the prose FAILS validation.
    • witness, accounts, confirming, mallory, finch, presence, lobby [clue_core_elimination_chain]
      ⛔ SPOILER EMBARGO (pre-reveal chapter): surface ONLY the surface anomaly a character can see/hear/find.
         Do NOT name who it implicates, state the tamper direction or magnitude, or explain the mechanism in this chapter.
         Present it as an unexplained discrepancy; the culprit and method are revealed later.
    • height, tide, compared, water, line, sylvia, clothing [clue_2]
      Points to: relationship, tide, height, submersion
    • mechanism, connects, drowning, manipulation [clue_culprit_direct_1]
      ⛔ SPOILER EMBARGO (pre-reveal chapter): surface ONLY the surface anomaly a character can see/hear/find.
         Do NOT name who it implicates, state the tamper direction or magnitude, or explain the mechanism in this chapter.
         Present it as an unexplained discrepancy; the culprit and method are revealed later.
  - PLANT OBLIGATIONS (incidental appearances): each item below MUST appear in this chapter as a passing physical detail a character sees, handles, or walks past — with its significance UNFLAGGED:
    • time, displayed, victim, watch [plant:clue_5]
    • security, logs, confirming, captain, ivor, hale, alibi [plant:clue_6]
    • witness, statements, timing, events [plant:clue_late_1]
    Rules: set dressing only. NO character comments on its importance, NO narrator hint ("little did they know", "something about it seemed off" are FORBIDDEN), NO inference drawn. It simply exists in the scene, naturally. Its significance surfaces in a LATER chapter — planting it casually here is what makes that later reveal feel fair.
  - Tonal contrast: include at least one beat of relief or ironic counterpoint. Do not sustain maximum tension for every paragraph.
  - CLUE DISCLOSURE RULE (Stage 2/4):
    Characters may establish access and opportunity but must NOT state the crime method or draw the final clue-to-culprit connection. Investigation without conclusion.
    WRONG: dialogue or narration that directly explains how the crime was committed before Stage 4.
    RIGHT: observation, physical reaction, and logical inference that leaves the mechanism just off-screen.
  - SUSPECT-PRESSURE MODE: do NOT resolve the case in this chapter. No confession, arrest, final accusation, definitive culprit declaration, or case-closed language. End with unresolved pressure: a contradiction, narrowed suspicion, motive pressure, or a new question.
  - ALIBI LOCK: Dr. Mallory Finch's established alibi is "10:00 PM - 11:30 PM". Do NOT place Dr. Mallory Finch at any other location or in any other activity during the crime window. Any contradiction is a continuity error that triggers a retry.
  - TESTIMONY CONTINUITY: Dr. Mallory Finch has already made statements in earlier chapters. Any time, location, or claim attributed to Dr. Mallory Finch in THIS chapter must be consistent with those earlier statements. Do NOT introduce a new or different alibi claim — any contradiction is a continuity error.

- Tonal contrast required: the previous chapter was high-tension. This chapter must include at least one beat of relief, pause, or quiet observation.
- Locked fact phrase obligations:
  - If this batch mentions The time displayed on the victim's watch at the time of death., write exactly: "ten minutes past eleven".
  - If this batch mentions The height of the tide at the time the body was found., write exactly: "three feet".
  - If this batch mentions The predicted time of high tide according to the tide chart., write exactly: "eleven thirty".
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
Batch chapters: 4-4.
Investigation state at start: 6 clue(s) revealed to reader; approximately 0 unresolved suspect(s).
Must change by end: Increase or complicate suspicion through a new pressure revelation — WITHOUT resolving the case: do NOT name, accuse, or extract a confession from the culprit, make an arrest, or declare the case closed (that is reserved for the final reveal).
Suspect pressure target(s): Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale
Required new information: At least one fear/motive/lie/loyalty reveal with investigative consequence.
Forbidden reveals at this stage: No culprit resolution: no confession, no arrest, no 'case closed', no accusation ('I accuse'/'I name'), and never state 'the culprit/murderer/killer is/was …'. The accusation is reserved for the final reveal — build suspicion only.

FROZEN FACT STATE (DO NOT ALTER):
- Timeline anchor: January (winter).
- Month, season, weather, and time-of-year language in this batch must stay compatible with winter.
- Established timeline fact: High tide at ten minutes past eleven
- Established timeline fact: Witness reports from the dining area
- If referenced, use exact phrase: "ten minutes past eleven" (The time displayed on the victim's watch at the time of death.).
- If referenced, use exact phrase: "three feet" (The height of the tide at the time the body was found.).
- If referenced, use exact phrase: "eleven thirty" (The predicted time of high tide according to the tide chart.).

STORY TO DATE (REFERENCE ONLY — DO NOT COPY VERBATIM):
- Full prior chapter text is provided below for continuity, factual consistency, and reference accuracy.
- Use this to keep character voice, chronology, clue state, and location continuity aligned with earlier chapters.
- Do not quote, copy, or paraphrase these paragraphs too closely; write fresh prose that remains consistent with them.

--- BEGIN PRIOR CHAPTER 1 ---
Title: Chapter 1: The Tidal Discovery
Hugo Vane pressed through the damp fog that clung to the beach behind the Seashell Hotel, his shoes sinking into cold sand as the wind teased at the lapels of his wool coat. The morning light was pale and uncertain, filtered through a veil of mist that blurred the horizon. Salt hung in the air, mingling with the faint scent of wet seaweed and the echo of distant waves breaking against the rocks. Ahead, a cluster of figures stood motionless, their silhouettes stark against the wintry gloom. At their feet lay Sylvia Trent, face down in the sand, her dark hair tangled with strands of kelp. The scene was eerily silent, save for the low murmur of the tide and the occasional creak from the hotel’s wooden deck behind him.

Hugo crouched beside Sylvia Trent, careful not to disturb the delicate water line visible on her clothing. Her wrist, pale and rigid, bore a watch that displayed 'ten minutes past eleven.' He glanced up, catching the uneasy exchange between Eleanor Voss and Dr. Mallory Finch, while Captain Ivor Hale stood a few paces away, his hands buried deep in the pockets of his navy overcoat. The tide, Hugo noted, had receded to 'three feet,' but the charts pinned in Sylvia’s guest room predicted high tide at 'eleven thirty.' Something was amiss: the time on Sylvia’s watch and the timing of the tide did not align. It was a contradiction that demanded explanation, and Hugo felt the weight of it pressing against his chest.

For a moment, the group hovered in uncertainty, each person’s gaze fixed on the body as if afraid to look elsewhere. Hugo’s mind raced, parsing the evidence. If Sylvia Trent’s watch truly stopped at 'ten minutes past eleven,' and the tide was only at 'three feet' when she was found, then the official tide chart’s prediction of 'eleven thirty' for high tide could not account for her drowning. The discrepancy between the tide’s height and the time of death suggested that Sylvia had entered the water earlier than expected—or that someone had manipulated the circumstances to obscure the truth. Hugo’s suspicion sharpened, but he kept his voice measured as he rose to address the others.

Eleanor Voss, wrapped in a charcoal cardigan and clutching a pair of worn gloves, stared at the waves as if searching for answers in their restless motion. Her posture was tense, but her expression betrayed a flicker of grief. 'Ah, the colors of life are rarely monochrome,' she murmured, her voice barely audible above the wind. Hugo watched her carefully, noting how her gaze lingered on Sylvia’s body and then drifted to the tide charts tucked beneath a nearby stone. Eleanor’s presence was both poignant and enigmatic; she had showcased her art at the hotel alongside Sylvia, and now the rivalry between them seemed to dissolve into the cold air.

Dr. Mallory Finch hovered near the edge of the scene, her gloved hands trembling as she adjusted her spectacles. Her navy dress, flecked with sand, spoke of a hurried arrival. 'Well, I suppose that’s one way to gamble with your life,' she muttered, more to herself than to anyone else. Mallory’s nervous energy was palpable; she avoided Hugo’s gaze and instead focused on the watch, her lips pressed together in a thin line. Hugo remembered that Mallory claimed to have been tending to patients in the Hotel Lobby from ten o’clock until half past eleven. Yet the contradiction in the tide’s timing unsettled her, and Hugo wondered if her alibi would withstand scrutiny.

Captain Ivor Hale stood apart, his broad shoulders squared and his gaze fixed on the horizon. The retired naval officer’s double-breasted coat was immaculate, but his face bore the lines of sleeplessness. 'In my day, we didn’t have time for nonsense,' he said, voice clipped. Hale’s connection to Sylvia was well-known; she had confided in him about her worries, and he had served as her adviser in matters both personal and professional. Now, his stance was disciplined, but Hugo noticed the way Hale’s hand tightened around his watch chain—a subtle sign of pressure. Hale’s claimed alibi placed him in the Dining Room from half past nine until eleven, but the timeline was now under question.

The morning’s gloom deepened as Hugo surveyed the scene. He moved past a scattered tide chart pinned in Sylvia’s room, careful not to draw attention to its significance just yet. Nearby, a constable—unidentified, his face obscured by the fog—took notes in silence, leaving Hugo to direct the investigation. The air was thick with suspicion, but relief flickered briefly as Hugo realized the group was united in confusion rather than accusation. He would have to untangle the web of alibis and contradictions, but for now, the evidence spoke only of uncertainty.

A witness, voice wavering, reported seeing a solitary figure on the beach during the night, but it had been too dark to identify. Hugo filed the statement away, aware it could serve as either a red herring or a crucial clue. The war had left everyone wary, and rationing meant guests rarely ventured out after dark. As Hugo rose, brushing sand from his trousers, he resolved to pursue the contradiction between the tide charts and Sylvia’s watch. The morning’s chill was relentless, but the investigation had begun. The group dispersed slowly, each person carrying the weight of suspicion as the wintry fog closed in around them.

As Hugo led Eleanor, Dr. Mallory Finch, and Captain Ivor Hale back toward the hotel, the distant sound of a radio drifting from the Hotel Lobby mingled with the rhythmic crash of waves. The cold bit through his gloves, and the salt air stung his throat. He glanced once more at Sylvia Trent, her body now shrouded by a blanket, and felt the burden of the case settle on his shoulders. The contradiction in the evidence was clear, but the truth remained elusive—a puzzle waiting to be solved in the shadow of the Seashell Hotel.
--- END PRIOR CHAPTER 1 ---

--- BEGIN PRIOR CHAPTER 2 ---
Title: Chapter 2: Initial Reactions
"The radio’s still on," Hugo said, his voice barely rising above the low hum of whispers that filled the Seashell Hotel lobby. The glow from the chandeliers flickered across polished marble, casting shifting shadows onto the geometric carpet. Outside, rain tapped against the tall windows, blurring the view of the cloudy sky and the distant sea. The air was thick with the scent of coffee and damp wool, mingling with the faint odor of salt that drifted in whenever the lobby doors swung open. Hugo’s gloves still carried the chill from the beach, and as he ushered Eleanor Voss, Dr. Mallory Finch, and Captain Ivor Hale into the circle of light, he felt the tension in the room pulse like a second heartbeat.

On the reception desk, beside a stack of ration coupons and a battered Art Deco lamp, lay the tide charts Hugo had retrieved from Sylvia Trent’s guest room. He studied them closely, tracing the inked lines that marked the predicted high tide at 'eleven thirty.' Yet the time on Sylvia’s watch—'ten minutes past eleven'—refused to reconcile with the charts. The contradiction gnawed at him, a silent accusation. He glanced at Eleanor, whose gaze lingered on the charts as if searching for meaning in their ordered chaos. Captain Ivor Hale stood with his back to the fireplace, the flickering light sharpening the lines of his face. Dr. Mallory Finch hovered near the drinks trolley, her hands trembling as she poured herself a glass of water, the sound of ice clinking echoing in the uneasy stillness.

Hugo’s mind worked through the implications. If Sylvia Trent’s watch had stopped at 'ten minutes past eleven,' and the tide charts indicated high tide at 'eleven thirty,' then the drowning could not have coincided with the predicted peak. The mechanism of the crime—whatever it was—seemed to rely on manipulating the chart or the timeline itself, exposing a false sense of certainty. He felt the weight of suspicion settle on the group, each person’s account now under scrutiny. The air in the lobby grew colder, as if the contradiction had drawn the warmth from the room.

Eleanor Voss broke the silence, her voice carrying a lyrical cadence. "It’s as if the sea itself refuses to be tamed by our charts and numbers," she said, fingers tracing the edge of her gloves. Her eyes flicked from Hugo to the tide charts, then to Dr. Mallory Finch, whose nervous energy seemed to radiate through the lobby. Eleanor’s words hung in the air, inviting both comfort and unease. The rivalry she had shared with Sylvia Trent now felt distant, replaced by a collective uncertainty.

Dr. Mallory Finch shifted, her glass trembling in her grasp. "Well, I suppose that’s one way to gamble with your life," she muttered, attempting a self-deprecating smile that failed to reach her eyes. Her navy dress was flecked with dust from the corners, and she avoided Hugo’s gaze, focusing instead on the tide charts. Mallory’s alibi—tending to patients in the lobby from ten o’clock until half past eleven—was now under pressure, as witness accounts confirmed her presence but left room for doubt. The contradiction in the evidence unsettled her, and Hugo noted how her hands twisted the hem of her cardigan, the silk threatening to tear.

Captain Ivor Hale’s posture was rigid, his gaze fixed on the cloudy sky visible through the frosted glass. "In my day, we didn’t have time for nonsense," he said, voice clipped. His fingers drummed against the mantel, betraying a restlessness beneath his disciplined exterior. Hale’s claimed timeline placed him in the Dining Room from half past nine until eleven, but the tide charts and Sylvia’s watch now cast shadows on his account. The retired naval officer’s connection to Sylvia had been both professional and personal, and Hugo sensed the emotional cost in Hale’s silence.

Hugo stepped closer to the reception desk, careful not to disturb the tide charts. He noticed the water line on Sylvia’s clothing—'three feet'—and compared it to the predicted tide height. The mechanism connecting drowning and manipulation remained elusive, but the evidence was clear: the timeline provided by the suspects conflicted with the physical facts. Nearby, a witness’s account confirming Dr. Mallory Finch’s presence in the lobby drifted through the conversation, unremarked but present. Hugo filed it away, aware it might serve as a crucial anchor for later scrutiny.

The group’s tension was punctuated by a brief moment of relief as Beatrice Quill, unseen but mentioned, was said to have been with other staff during the time. The sound of distant thunder rumbled through the lobby, and the flickering shadows from the chandeliers danced across Eleanor’s face. Hugo felt the burden of the investigation settle more heavily, but he allowed himself a sardonic thought: "Ah, the price of ambition can be quite steep," he murmured, though none seemed to notice. The contradiction between the tide charts and Sylvia’s watch had sharpened suspicion, but the truth remained just out of reach.

As the evening deepened and the rain intensified, Hugo resolved to pursue the timeline question with greater urgency. The lobby’s uneasy stillness was broken only by the creak of old furniture and the soft murmur of speculation. Each suspect carried the weight of their account, but the evidence had changed the investigation’s state: the tide charts showed high tide at 'eleven thirty,' conflicting with the timeline provided by the suspects. The puzzle was no longer merely about what had happened—it was about who had shaped the narrative, and why.
--- END PRIOR CHAPTER 2 ---

--- BEGIN PRIOR CHAPTER 3 ---
Title: Chapter 3: First Impressions
By late morning, the dining room of the Seashell Hotel echoed with the clatter of cutlery and the muted conversations of guests, though a somber hush hovered over the usual bustle. Pale daylight filtered through rain-streaked windows, casting a dim glow on crisp white tablecloths and the gleam of silverware. Hugo Vane stood near the long oak sideboard, his hands resting on the polished surface as he watched droplets slide down the glass, blurring the wintry landscape beyond. The air, heavy with the scent of roasted meat and damp wool, seemed to press inward, amplifying the tension between the assembled guests. The rain persisted, tapping a steady rhythm that underscored the unease in the room.

Hugo’s gaze settled on the evidence arrayed before him: Sylvia Trent’s clothing, carefully preserved, lay draped across a chair. The water line was unmistakable—dark, saturated fabric climbing to a height that spoke of significant submersion. He leaned closer, noting with precision how the mark extended well above the hem, as if the tide had enveloped Sylvia for longer than any accidental fall would allow. The faint odor of salt lingered, and Hugo’s fingers hovered above the fabric, unwilling to disturb what might be the most telling clue yet.

He straightened, mind racing with implications. If Sylvia had truly been submerged so thoroughly, then the time of her drowning could not have coincided with the expected tidal peak. The evidence suggested she entered the water earlier, or under different circumstances than the chart predicted. Hugo’s thoughts circled the contradiction, the physical trace on her clothing undermining any account that placed her at the water’s edge only moments before discovery. The timeline was narrowing, and the nature of her death was no longer merely a question of chance.

Across the table, Eleanor Voss wrapped her hands around a teacup, her gaze drifting not to the guests but to the window, where rain blurred the horizon. Her voice, when it came, carried a fragile lyricism. “Ah, the colors of life are rarely monochrome. Sylvia always said the sea was her confidante, but I suppose even confidantes can betray us.” Eleanor’s words hung in the air, tinged with grief and a subtle defensiveness, as if she felt the scrutiny pressing in. Her fingers traced the rim of the cup, and Hugo noted how she avoided meeting his eyes.

Dr. Mallory Finch shifted in her seat, her posture stiff, gloved hands folded tightly as she glanced toward the evidence. She spoke quickly, her tone edged with nervousness. “I was in the Hotel Lobby tending to patients, as I said. But I did pass near the beach before the body was found—only for a moment, really. The tide seemed higher than usual.” Mallory’s admission hung between them, the self-deprecating humor absent now. Hugo watched her carefully, noting the way she fidgeted with her spectacles, her anxiety palpable. The directness of her statement was unexpected, and Hugo wondered if the proximity to the scene would expose a flaw in her alibi.

Captain Ivor Hale, seated at the far end, adjusted his double-breasted coat and regarded the group with a measured stare. He spoke in clipped tones, his military bearing evident. “I was in the Dining Room from half past nine until eleven. The routine was unbroken—dinner, conversation, then I retired.” Hale’s account was delivered with a bluntness that brooked no argument, yet Hugo saw the tension in his jaw, the way his fingers drummed on the table. The retired officer’s connection to Sylvia had been close, and now the emotional cost was etched in the lines of his face.

Hugo drew the tide charts from his pocket, their inked lines crisp and ordered. He spread them across the table for all to see. “The chart predicts high tide at eleven thirty,” he said, his voice steady. “Yet Sylvia’s watch stopped at ten minutes past eleven.” The contradiction was unavoidable: the physical evidence on her clothing, the timepiece, and the chart all pointed to a timeline that refused to align. Eleanor’s gaze lingered on the charts, her expression thoughtful, while Mallory’s eyes darted nervously between the paper and the fabric.

The group was silent as Hugo pressed the point. “If the water line shows she was submerged at three feet, and the tide chart says high tide at eleven thirty, then how do we reconcile the time on her watch?” He paused, letting the question settle. The rain intensified, drumming against the glass, and the scent of grilled fish wafted from the kitchen, a reminder of the ordinary life that persisted despite the extraordinary circumstances.

Eleanor, voice trembling, recalled her last conversation with Sylvia. “She spoke of tides and secrets—always more beneath the surface. We argued about her performance schedule, but nothing seemed amiss.” Her words carried both sorrow and a trace of defensiveness, as if she feared her own motives might be questioned. Hugo watched her carefully, noting how her posture shifted, the lyrical cadence of her speech now tinged with uncertainty.

Mallory’s nervous energy surged. She glanced at Hugo, then at the charts, her words tumbling out in a rush. “Well, I suppose that’s one way to gamble with your life. I was in the lobby, but I couldn’t have known about the tide.” The self-deprecating humor returned, but the strain was visible. Hugo noted how Mallory’s alibi—tending to patients from ten o’clock until half past eleven—was now under pressure. Her proximity to the beach, however brief, complicated her account.

Captain Ivor Hale’s response was terse. “In my day, we didn’t have time for nonsense. I was here, with witnesses. If Sylvia entered the water before high tide, someone must have seen her.” He leaned forward, eyes narrowed, as if daring Hugo to challenge his timeline. The officer’s blunt humor masked a deeper unease, and Hugo wondered if the rigidity of his account hid more than discipline.

Hugo moved to the window, observing footprints in the sand outside, leading toward the beach. The sight was unremarked by the group, but he filed it away for later consideration. Nearby, a hotel staff member’s witness statement about the timing of events drifted past in conversation, another detail awaiting scrutiny. The mechanism connecting drowning and manipulation—a casual mention of how the tide might have changed—was planted in the background, unnoticed.

He returned to the table, surveying the suspects. “The timeline doesn’t fit. The physical evidence contradicts your accounts. Someone must have had access to Sylvia before the tide reached its peak.” Hugo’s voice was measured, but the pressure was unmistakable. The rain outside deepened, the wintry chill seeping through the walls.

Eleanor’s defensiveness grew as Hugo pressed her. “I was painting in my room until eleven,” she insisted, her tone shaded with artistic metaphor. “The world outside was grey and cold, but I was lost in color.” Her evasion was subtle, but Hugo caught the hesitation, the reluctance to describe her actions in detail.

Mallory, cornered by contradiction, attempted to deflect. “I was with patients, truly. The beach was only a passing view. I had no reason to be there.” Her words were quick, her hands twisting the hem of her cardigan, the silk threatening to tear. Hugo noted the nervous tic, the sign of mounting pressure. The opportunity to manipulate the scene was narrowing toward her, but the mechanism remained elusive.

Captain Ivor Hale’s composure faltered for a moment. He glanced at the tide charts, then at Hugo. “The sea doesn’t lie, but people do. If you’re suggesting someone tampered with the evidence, you’ll need more than charts and soaked clothing.” His voice was sharp, but the lingering regret was evident.

Hugo gathered his notes, the evidence mounting but the solution just out of reach. The suspects’ accounts were unraveling under scrutiny, the contradiction between tide, time, and testimony sharpening suspicion. The water line on Sylvia’s clothing, the tide charts in her room, and the statements from each guest formed a web of uncertainty. The wintry air pressed in, and Hugo felt the burden of the investigation deepen.

As the rain eased for a moment, a brief relief washed through the room. The tension slackened just enough for a sardonic thought to slip through. “Ah, the price of ambition can be quite steep,” Hugo murmured, though the others seemed not to notice. The ordinary sounds of the dining room—the laughter of distant diners, the clinking of glasses—reminded him that life continued beyond the shadow of suspicion.

Yet the conflict was unresolved. The evidence had changed the investigation’s state: the water line established Sylvia had been submerged for a considerable time, raising questions about the timeline. The contradiction between the tide charts and the accounts of the suspects sharpened suspicion and left the group more uneasy than before.

Hugo lingered by the window, watching the pale daylight falter as clouds gathered over the horizon. The dining room filled with murmurs and the aroma of grilled fish, but beneath the surface, suspicion simmered. The suspects’ defenses had been tested, their stories now complicated by the physical traces left on Sylvia’s clothing and the tide charts.

As Hugo prepared to leave, he glanced once more at the evidence. The investigation had not yet named its culprit, but the web of contradictions was growing tighter. The wintry rain resumed, and the dining room’s atmosphere remained heavy, its guests caught in the undertow of secrets and suspicion.
--- END PRIOR CHAPTER 3 ---

[SCENE COMPLETENESS CONTRACTS — MANDATORY. Each contract below lists what you MUST enact in that chapter. Do not summarise or mention these labels in the prose — enact them organically.]
Chapter 4 (Act 2) completeness contract:
  PIVOT ELEMENT (MANDATORY — write this into the prose, shown not told): "The revelation of Dr. Finch's presence near the beach."
  FACT ESTABLISHED (MANDATORY — reader must know this by chapter end): "Establishes that Dr. Finch was near the beach shortly before the body was discovered, raising suspicion."

# Case Overview
Title: The Tidal Deception
Era: 1940s
Setting: Seashell Hotel
Crime: murder (drowning)
Culprit: Dr. Mallory Finch
Victim: Sylvia Trent
False assumption: Sylvia drowned accidentally during high tide.
Cast: Eleanor Voss (she/her), Dr. Mallory Finch (she/her), Captain Ivor Hale (he/him), Beatrice Quill (she/her), Sylvia Trent (she/her), Hugo Vane (he/him)

Setting Lock: Keep all scenes and descriptions consistent with the stated setting (Seashell Hotel). Do not introduce a different location type. Do not invent an alternative estate name. The only permitted name for this property is "Seashell Hotel" — any other estate name (e.g., "Caldwell Manor", "Ashwood Hall", or any invented proper name) is a continuity error that will be caught and rejected.

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
    "sceneNumber": 4,
    "act": 2,
    "title": "Uncovering Motives",
    "setting": {
      "location": "the Seashell Hotel's lounge",
      "timeOfDay": "Afternoon",
      "atmosphere": "Intense, with a sense of urgency"
    },
    "characters": [
      "Hugo Vane",
      "Eleanor Voss",
      "Dr. Mallory Finch",
      "Captain Ivor Hale"
    ],
    "purpose": "Explore motives and establish character dynamics.",
    "cluesRevealed": [
      "clue_core_elimination_chain",
      "clue_2",
      "clue_culprit_direct_1"
    ],
    "dramaticElements": {
      "conflict": "Tensions rise as motives are revealed.",
      "tension": "Each suspect tries to shift blame onto another.",
      "microMomentBeats": [
        "Hugo watches Eleanor's eyes dart nervously when asked about her relationship with Sylvia."
      ]
    },
    "summary": "In the lounge, Hugo probes deeper into the suspects' relationships with Sylvia, revealing hidden motives. Eleanor's career is at stake, Dr. Finch's addiction is hinted at, and Ivor's wartime secrets loom large. The tension escalates as they each defend their innocence, and Hugo uncovers that Dr. Finch had been seen near the beach shortly before the body was found.",
    "beat": "motives",
    "estimatedWordCount": 1800,
    "pivotElement": "The revelation of Dr. Finch's presence near the beach.",
    "factEstablished": "Establishes that Dr. Finch was near the beach shortly before the body was discovered, raising suspicion.",
    "permittedBehavioursByAct": [
      {
        "characterName": "Hugo Vane",
        "behaviour": "May show unease, evasion, or mild defensiveness when questioned."
      },
      {
        "characterName": "Eleanor Voss",
        "behaviour": "May show unease, evasion, or mild defensiveness when questioned."
      },
      {
        "characterName": "Dr. Mallory Finch",
        "behaviour": "May show unease, evasion, or mild defensiveness when questioned."
      },
      {
        "characterName": "Captain Ivor Hale",
        "behaviour": "May show unease, evasion, or mild defensiveness when questioned."
      }
    ],
    "redHerringPlacement": null,
    "emotionalRegister": "The investigation takes a sharp turn as evidence begins to suggest foul play rather than mere accident.",
    "dominantCharacterNote": {
      "name": "Eleanor Voss",
      "voiceRegister": "Eleanor speaks with a lyrical quality, often embellishing her words with artistic metaphors."
    },
    "humourGuidance": {
      "permission": "permitted",
      "character": "Beatrice Quill",
      "form": "observational"
    },
    "eraTextureNote": "Limited travel due to rationing and wartime restrictions; Poor visibility from foggy weather impacting movement; Shortened days leading to increased isolation after dark",
    "locationRegisterNote": "",
    "mechanismRevealAllowed": false,
    "cluesPlanted": [
      "clue_5",
      "clue_6",
      "clue_late_1"
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

## Message 4 (role=user)

```text
SINGLE-PASS RETRY CONTRACT
Goal: resolve every listed issue for chapter(s) 4 in this one retry.
Retry mode: TARGETED_REBUILD.
Attempt context: 2/3 | primary class: template.
Why this mode: template failure detected; prior wording is likely harmful anchor.

SOURCE OF TRUTH
- Do not preserve sentence structure from the failed draft; use the scene instructions and hard constraints as the source of truth.
- Hard constraints outrank the previous draft: cast/pronoun lock, locked facts, clue obligations, stage-mode rules, and chapter JSON shape.

PRIMARY FAILURES
- Template linter: repeated long paragraph fingerprint detected. Rewrite repeated scaffold-like prose into chapter-specific language.
- Template linter: high n-gram overlap detected (0.69 >= 0.65). Rephrase this passage to avoid template leakage.

REWRITE PLAN
- Treat the scene instructions, cast lock, clue obligations, and locked facts as the source of truth; do not preserve failing wording from the previous draft.
- Rewrite any paragraph touched by a failing issue as a fresh paragraph rather than patching a single sentence.

SUCCESS CHECKLIST
- Every listed issue below is resolved in this single attempt before you answer.
- Primary failure class cleared: template.
- The revised chapter reads as a clean rewrite of the failing parts, not a lightly patched copy of the rejected draft.

OUTPUT RULES
- Return complete corrected JSON for chapter(s) 4 only.
- Do not explain what you changed.
- Do not leave one issue unresolved while fixing another.
- If two instructions conflict, prefer the one that clears the validator and preserves story logic.

RETRY PHASE: 2 of 2 — QUALITY POLISH ONLY
Logic and contract requirements are already satisfied. This attempt fixes style/quality issues only.
REGRESSION GUARD: You must not introduce any new logic failures while fixing quality issues.
Specifically, do not alter: discriminating test logic, clue evidence sentences, character names or pronouns, alibi claims, or stage-mode outcomes.
If fixing a quality issue would require touching logic-sensitive text, rephrase the surrounding prose instead.

Attempt 2/3 — chapters 4 — 2 validation issue(s) to resolve:

═══ TEMPLATE LEAKAGE ERRORS (2) ═══
• Template linter: repeated long paragraph fingerprint detected. Rewrite repeated scaffold-like prose into chapter-specific language.
• Template linter: high n-gram overlap detected (0.69 >= 0.65). Rephrase this passage to avoid template leakage.

⛔ BANNED PARAGRAPH — DO NOT REPRODUCE ANY SENTENCE FROM THIS TEXT:
"hugo gathered his notes the evidence ... the burden of the investigation deepen"

Every sentence in your response must be a sentence that could NOT appear in any of the above passages.
You may write about the same event, but from a different physical position, a different
sensory angle, or at a different moment in the scene. You may not preserve a single clause.

⛔ NEAR-DUPLICATE PASSAGE — your prose closely echoes this prior paragraph:
"eleanor s defensiveness grew as hugo ... to describe her actions in detail"

Rewrite any paragraph that shares sentence structure or extended phrases with any of the above texts.
Different words for the same image are not sufficient — the sentence structure must also differ.

⛔ PRIOR CHAPTER DUPLICATION LOCK — 39 protected passage(s):
Your prose has been detected copying from an earlier chapter. Every paragraph listed below appears in a prior chapter and is COMPLETELY OFF-LIMITS. Do not reproduce, rephrase, or structurally echo any of them:

  • "Hugo Vane pressed through the damp ... the lapels of his wool coat."
  • "Hugo crouched beside Sylvia Trent, careful ... water line visible on her clothing."
  • "For a moment, the group hovered ... as if afraid to look elsewhere."
  • "Eleanor Voss, wrapped in a charcoal ... for answers in their restless motion."
  • "Dr."
  • "Captain Ivor Hale stood apart, his ... his gaze fixed on the horizon."
  • "The morning’s gloom deepened as Hugo surveyed the scene."
  • "A witness, voice wavering, reported seeing ... had been too dark to identify."
  • "As Hugo led Eleanor, Dr."
  • ""The radio’s still on," Hugo said, ... that filled the Seashell Hotel lobby."
  • "On the reception desk, beside a ... retrieved from Sylvia Trent’s guest room."
  • "Hugo’s mind worked through the implications."
  • "Eleanor Voss broke the silence, her voice carrying a lyrical cadence."
  • "Dr."
  • "Captain Ivor Hale’s posture was rigid, ... sky visible through the frosted glass."
  • "Hugo stepped closer to the reception ... not to disturb the tide charts."
  • "The group’s tension was punctuated by ... with other staff during the time."
  • "As the evening deepened and the ... the timeline question with greater urgency."
  • "By late morning, the dining room ... hush hovered over the usual bustle."
  • "Hugo’s gaze settled on the evidence ... preserved, lay draped across a chair."
  • "He straightened, mind racing with implications."
  • "Across the table, Eleanor Voss wrapped ... window, where rain blurred the horizon."
  • "Dr."
  • "Captain Ivor Hale, seated at the ... the group with a measured stare."
  • "Hugo drew the tide charts from ... their inked lines crisp and ordered."
  • "The group was silent as Hugo pressed the point."
  • "Eleanor, voice trembling, recalled her last conversation with Sylvia."
  • "Mallory’s nervous energy surged."
  • "Captain Ivor Hale’s response was terse."
  • "Hugo moved to the window, observing ... sand outside, leading toward the beach."
  • "He returned to the table, surveying the suspects."
  • "Eleanor’s defensiveness grew as Hugo pressed her."
  • "Mallory, cornered by contradiction, attempted to deflect."
  • "Captain Ivor Hale’s composure faltered for a moment."
  • "Hugo gathered his notes, the evidence ... the solution just out of reach."
  • "As the rain eased for a ... brief relief washed through the room."
  • "Yet the conflict was unresolved."
  • "Hugo lingered by the window, watching ... as clouds gathered over the horizon."
  • "As Hugo prepared to leave, he glanced once more at the evidence."

Preserve continuity with the established story facts, but rebuild the phrasing from new sentence structures.
Keep the clue state, cast facts, and chapter obligations intact while making the prose read like a genuinely new draft.

═══ RETRY MICRO-PROMPTS (2) ═══
• REPAIR [template_overlap — attempt 2 — STRUCTURED REWRITE MODE]: Overlap detected; freeform retry mode is disabled for this chapter.
  Treat the prior draft as DISCARDED. Rebuild paragraph-by-paragraph in this order:
  Para 1: A named character performs a concrete physical action tied to this chapter's scene objective.
  Para 2: Introduce one scene-specific clue/observation through dialogue or direct sensory perception.
  Para 3+: Advance the conflict with chapter-specific consequences; vary sentence openings and clause structures.
  Do NOT preserve sentence skeletons from prior drafts. Every paragraph must use a distinct syntactic frame.
• WORD COUNT TARGET [template_overlap — attempt 2]: While rephrasing for uniqueness, you MUST write at least 1250 words.
  Do NOT shorten this chapter. A rewrite significantly shorter than 1250 words will fail validation.
  Expand with additional investigation beats, character reactions, or sensory detail — do not cut content to achieve variety.

Return corrected JSON for chapters 4. Edit only the sections that failed — keep all content that passed validation, and return the complete updated chapter JSON.


RETRY CLASS: template
ATTEMPT: 1/3
OFFENDING TEXT: repeated long paragraph fingerprint detected. Rewrite repeated scaffold-like prose into chapter-specific language.
MANDATORY FIXES:
- Resolve template issues before accepting this batch.
- Template linter: repeated long paragraph fingerprint detected. Rewrite repeated scaffold-like prose into chapter-specific language.
- Template linter: high n-gram overlap detected (0.69 >= 0.65). Rephrase this passage to avoid template leakage.
```
