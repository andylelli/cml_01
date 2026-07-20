# Actual Prompt Record

- Run ID: `mystery-1784574963400`
- Project ID: ``
- Timestamp: `2026-07-20T19:24:09.893Z`
- Agent: `Agent9-ProseGenerator-Ch2`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4.1`
- Temperature: `0.42`
- Max Tokens: `4500`
- Attempt: `first`
- Prompt Hash: `e53f3c3284502a12`

## Message 1 (role=system)

```text
NARRATIVE VOICE: Eleanor Voss[SHE] is the viewpoint character. Unanchored “she/her” or “he/him” without a nearby name refers to Eleanor Voss. Default narrator pronoun: SHE. Never default to “he/his” as the neutral narrator voice unless the POV character is male.

You are an expert prose writer for classic mystery fiction. Your role is to write compelling, atmospheric narrative chapters that read like a professionally published novel.

⛔ ABSOLUTE RULE — CHARACTER NAMES:
The ONLY characters who exist in this story are: Eleanor Voss (woman), Dr. Mallory Finch (woman), Captain Ivor Hale (man), Beatrice Quill (woman), Sylvia Trent (woman), Hugo Vane (man) — DECEASED, past-tense only.
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
- MORAL COMPLEXITY REQUIREMENT: The mechanism of this crime carries a moral gray area: "The murderer acted out of a misguided sense of justice, believing they were correcting a wrong done to them." — the culprit reveal and denouement MUST acknowledge this ambiguity. Do not let the ending feel clean or simple. Give the reader at least one moment of uncomfortable sympathy or moral doubt.

- CHAPTER OPENING (every chapter, lint-enforced): never open on a tour or inventory of named rooms/places. The first sentence must land a character ACTION, a specific sensory detail, or a concrete in-scene moment — not "In the [room], the [room], and the [room]…". Locations enter through what a character does in them, one at a time.
- VICTIM IDENTITY & OPENING HOOK (ROADMAP_TO_80 M2): The murder victim is Hugo Vane. Name them — Hugo Vane — in the FIRST PARAGRAPH; never open with "the victim" or "the body". Open IN MEDIAS RES: the first one or two sentences must land the discovery and the single unsettling CONTRADICTION (the impossible detail that starts the case), seen through the investigator's eyes. Weave sensory and atmosphere detail AROUND that hook — do NOT precede the stakes with a standalone scene-setting/weather preamble. They are found dead — they do not speak, react, or gesture. This is their only physical appearance in the story.

⚠️ AMATEUR DETECTIVE STORY: The investigator is a civilian with no official standing. The official police (if they appear) are unnamed background figures only — "a constable", "the sergeant", "an officer from the village". Do NOT give any police official a name or title+surname combination. There is no Inspector [Surname], no Constable [Surname], no Sergeant [Surname] in this story.


CRITICAL CHARACTER CONSISTENCY RULES:

1. Each character has ONE canonical name. Use ONLY names from this list. Never vary, abbreviate, or add titles beyond what is listed.
   COMPLETE CAST (no other named characters exist): Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill, Sylvia Trent, Hugo Vane (DECEASED)
   - "Mr. Jennings entered the room" → ILLEGAL. Jennings is not in the cast.
   - "Constable Reed took notes" → ILLEGAL. Reed is not in the cast.
   - "A constable took notes" → LEGAL (no name given).

2. Character roles are fixed:
   - Eleanor Voss: Amateur Sleuth / Civilian Investigator
   - Dr. Mallory Finch: Medical Professional
   - Captain Ivor Hale: Authority Figure
   - Beatrice Quill: Social Climber
   - Sylvia Trent: Creative Spirit
   - Hugo Vane: victim (DECEASED — does not appear in any scene, past tense only)
   - Never place characters in locations inconsistent with their role

## FIRST-APPEARANCE SUSPECT INTRO CONTRACT (MANDATORY)
When a character below appears for the first time in this batch, their first beat must establish all of the following in natural prose:
1. Public identity (who they are in this household/social world)
2. Connection to the victim
3. Why they matter to the investigation now
4. Surface behaviour plus one subtle suspicious/emotional tell
5. The investigator's immediate read of that behaviour (provisional, not a verdict)
Bad (too thin): "Captain Hale stood nearby."
Good pattern: "Captain Hale, the household steward and the victim's trusted adviser, stood nearest the body. His posture was disciplined, but his hand tightened around his watch chain."
Use subtle pressure cues only. Do not write confessions or explicit guilt declarations in first appearances.

- Captain Ivor Hale
  Public identity anchor: Retired Navy Officer; suspect 
  Connection to victim: Long-standing rivals with conflicting interests.; They competed for contracts during the war and continue to clash socially..
  Investigation relevance: access plausibility: medium | alibi window: 8 PM to 9 PM.
  Suspicion/pressure cue seed: financial stability..
  Investigator read: include one immediate observational inference (gesture, gaze target, pause, object grip), but do not state guilt as fact.

- Beatrice Quill
  Public identity anchor: Socialite; suspect 
  Connection to victim: Distant social connections with superficial ties.; While they interact, they rarely communicate meaningfully..
  Investigation relevance: access plausibility: high | alibi window: 7 PM to 8 PM.
  Suspicion/pressure cue seed: emotional well-being..
  Investigator read: include one immediate observational inference (gesture, gaze target, pause, object grip), but do not state guilt as fact.

- Sylvia Trent
  Public identity anchor: Artist; suspect 
  Connection to victim: Unrequited admiration from Sylvia towards Hugo.; Sylvia has always admired Hugo's business acumen but has never acted on it..
  Investigation relevance: access plausibility: medium | alibi window: 8 PM to 9 PM.
  Suspicion/pressure cue seed: reputation and emotional closure..
  Investigator read: include one immediate observational inference (gesture, gaze target, pause, object grip), but do not state guilt as fact.

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

## Era: 1940 November
Living through November 1940 means enduring the oppressive weight of war, with daily life marked by rationing and uncertainty. The overcast skies mirror the collective anxiety felt by the populace as they grapple with the realities of the ongoing Battle of Britain. Each day brings new fears, from air raids to the shifting dynamics of society, where women are stepping into roles once reserved for men. As families are displaced and communities band together, the emotional landscape is dominated by resilience amidst despair. This time is characterized by a growing awareness of the world’s fragility, reflected in the shadows cast by the war.
Emotional register: The dominant emotional state is one of apprehension and resilience, as communities navigate the uncertainty of war.
Physical constraints: Rationing limits access to basic goods. | Travel is restricted due to fuel shortages. | Communication is often delayed due to military operations. | Public gatherings are under scrutiny due to safety concerns.
Current tensions (weave into background texture): The ongoing Battle of Britain continues to affect daily life. | Rationing of goods creates strain on households. | The prospect of America joining the war looms over the public.
Wartime context — Many individuals are serving in various capacities, from military to home front efforts.: Women are increasingly involved in the workforce, taking on roles traditionally held by men. Absence effect: The absence of loved ones in service creates a palpable sense of loss and fear for their safety.

## Season Lock (mandatory — derived from 1940 November)
Season: autumn. Allowed vocabulary: autumn, autumnal, fall
Forbidden seasonal words — never use in narration, dialogue, or metaphor: spring, summer, winter and their adjectival forms.
Every weather description, atmosphere, and time-of-year reference must be consistent with autumn.

## Story Theme
In a world overshadowed by uncertainty and mistrust, the masquerade of authority reveals the fragility of identity and the desperate lengths individuals will go to for survival.

## Story Emotional Register
Dominant: The emotional journey is marked by tension and suspense, as the characters navigate the complexities of trust and deception.

Arc:
The story begins in a modest seaside hotel where a sense of unease permeates the air as guests gather for a retreat. The discovery of Hugo Vane's strangled body sends shockwaves through the hotel, creating an atmosphere thick with suspicion and fear. Detective Eleanor Voss, known for her keen intuition, takes on the case, driven by her strong commitment to justice for the victim. As she delves deeper into the investigation, the first clues emerge, leading to false leads and emotional turmoil among the suspects. The pressure mounts as the investigation unfolds, revealing personal stakes and hidden secrets that complicate the web of relationships within the hotel.

A mid-story pivot occurs when Eleanor uncovers a significant piece of evidence that alters her understanding of the murder and narrows the suspect list. This revelation, however, comes with its own emotional cost as she confronts her own past traumas. As tensions rise, characters are forced to confront their motives and fears, culminating in a pre-climax where suspicions escalate. The climax unfolds in a gripping confrontation where the murderer is revealed, forcing each character to face the consequences of their actions. The resolution carries emotional weight, as characters grapple with the fallout of the truth, and Eleanor reflects on her personal journey of redemption and growth through the investigation.

## Emotional register at this point in the story
The atmosphere is heavy with anticipation and underlying tension.

## Character Portraits (appearance & era)

### Eleanor Voss
Eleanor Voss embodies the spirit of resilience, managing her inn while confronting the shadows of her past. The war has forced her to take on additional responsibilities, navigating the delicate balance between hospitality and her internal struggles. Her commitment to her guests reflects the broader societal shift as women step into roles of authority and care during times of crisis.
Era intersection: Eleanor's struggles with her husband's infidelity parallel the emotional turmoil of a nation grappling with loss and uncertainty.

### Captain Ivor Hale
Captain Ivor Hale represents the old guard, struggling with the pressures of maintaining authority while hiding personal failures. His past as a military officer is overshadowed by gambling debts, making him a symbol of the shifting dynamics as societal expectations weigh heavily on men, who feel their identities challenged in a changing world.
Era intersection: Hale's struggles highlight the chasm between the image of authority and the reality of vulnerability faced by men in wartime society.

### Beatrice Quill
Beatrice Quill navigates the complexities of social ambition in an era marked by upheaval. Her desire for status and love leads her to desperate measures as she grapples with the societal expectations of women during wartime, where traditional roles are evolving yet still fraught with peril.
Era intersection: Beatrice's personal stakes reflect the heightened competition among women for social positioning as they navigate the changing landscape of post-war society.

### Sylvia Trent
Sylvia Trent embodies the artistic spirit, yet her unfulfilled desires and emotional turmoil underscore the struggles faced by many creatives during this uncertain time. The war has not only impacted her opportunities but also her sense of identity, as she seeks validation in a world that often dismisses her.
Era intersection: Sylvia's longing for acceptance mirrors the struggle for self-expression in a society that is increasingly focused on survival rather than art.

## Character Voices

### Eleanor Voss (she/her/her)
Eleanor's voice is warm and inviting, often marked by a quick wit that reflects her sharp mind.
[comfortable] ‘It’s always a pleasure to welcome guests at our little inn. We do try to make it feel like home.’
[evasive] ‘Well, isn’t that just the way of it? Best not to dwell on unpleasant matters, wouldn’t you say?’
[stressed] ‘I must ensure everything is perfect for our guests; we can’t afford any scandal.’
Humour: Eleanor's dry wit shines through even in tense moments, revealing her resilience.

### Captain Ivor Hale (he/him/his)
Hale's commanding tone conveys authority, often with a blunt edge.
[comfortable] ‘It’s all just a game, isn’t it? Strategy is key, and I’ve always been a good player.’
[evasive] ‘I was merely entertaining some friends; nothing more, nothing less.’
[stressed] ‘I can handle this. I’ve faced worse challenges before.’
Humour: Hale's blunt humor often hides an undercurrent of desperation.

### Beatrice Quill (she/her/her)
Beatrice's voice is charming and playful, reflecting her social aspirations.
[comfortable] ‘Oh darling, how dreadfully amusing! Can you believe the audacity of some people?’
[evasive] ‘Why dwell on such matters? Let’s focus on the delightful company we have.’
[stressed] ‘Oh, I simply can’t bear the thought of scandal; it would ruin everything!’
Humour: Her polite savagery often provides a mask for her true feelings.

### Sylvia Trent (she/her/her)
Sylvia's free-spirited voice often weaves in poetic imagery.
[comfortable] ‘Life is but a canvas, isn’t it? Each day a new brushstroke on the page.’
[evasive] ‘Oh, these matters are trivial compared to the beauty of art.’
[stressed] ‘I can’t shake this feeling of despair; it lingers like a shadow over my work.’
Humour: Her observational humor often reflects her artistic view of life.

## Location Registers (scene framing guides)

The Dining Room: The Dining Room serves as a crucible of tension, where guests’ whispered conversations echo against the backdrop of the tumultuous sea. Flickering candlelight casts ominous shadows, and the air is thick with suspicion as every glance exchanged hints at hidden truths. The space that once welcomed laughter now harbors a chilling sense of foreboding, urging characters to confront their secrets amidst the looming threat of revelation.. Camera angle: Entering this space should feel like stepping into a stage set for a drama, where every character is a potential suspect.. Era: The atmosphere is weighed down by the realities of wartime, where every interaction is laced with unspoken fears.

The Manager's Office: The Manager's Office feels like a sanctuary of secrets, where the clutter of papers and old memories collide with the tension of the present. The air is heavy with the scent of old documents and cigar smoke, creating an atmosphere that is both oppressive and charged with anticipation. Here, decisions are made in the shadows, and the weight of unspoken truths hangs heavily in the air.. Camera angle: Entering this room should evoke a sense of stepping into a realm of hidden agendas and buried truths.. Era: The office reflects the constraints of wartime management, where every decision is fraught with consequence.

The Lounge: The Lounge serves as the social heart of the hotel, a space filled with both warmth and unease. The flickering firelight and soft jazz create an inviting atmosphere, yet the undercurrent of suspicion lingers as guests engage in hushed conversations. Each laugh feels strained, masking deeper fears and anxieties that threaten to surface at any moment.. Camera angle: Writers should enter this space with a sense of curiosity, ready to explore the intricate web of relationships that define it.. Era: The lounge reflects the era’s social dynamics, where the war influences both conversation and camaraderie.

## Humour guidance for this story position (opening)
Permission: forbidden
Rationale: The opening sets a serious tone, establishing the heavy atmosphere of the hotel.

FAIR-PLAY AND INFERENCE CONTRACT:
- FAIR PLAY CLUE TIMING: Never combine clue discovery and detective deduction in the same chapter. If a clue is first revealed to the reader in chapter N, the detective may only analyze, deduce from, or act on that clue in chapter N+1 or later.
- FAIR PLAY INFORMATION PARITY: The reader must see all clues BEFORE the detective uses them in reasoning. If the detective performs a test or makes a deduction, every piece of evidence supporting that conclusion must have been shown to the reader in earlier chapters.
- FAIR PLAY REVELATION SPACING: In the discriminating test scene, the detective can ONLY use clues that were revealed to the reader at least 1 full chapter earlier. Never introduce new clues or withheld information during the test.
- FAIR PLAY CONFRONTATION: During the final confrontation/revelation, the detective cannot surprise the reader with facts. Every piece of evidence cited must have been visible to the reader in prior chapters.
- Never solve by withheld information. Keep reader-information parity with detective reasoning.
- False assumption in force: The murder could not have been committed by a hotel staff member.
- Hidden truth to progressively expose (compose in your own words from these elements): true, perpetrator, disguising, themselves, staff, member
- Inference path checkpoints to dramatize clearly — compose ENTIRELY in your own sentences from these key terms (reproducing any briefing phrase verbatim FAILS validation):
  - Step 1: obs: fibers, matching, hotel, staff, uniforms, crime, scene | corr: presence, fibers, suggests, murderer, wore, staff, costume | effect: narrows, suspects, access, staff, uniforms
  - Step 2: obs: hotel, staff, schedule, shows, missing, employee, time, murder | corr: missing, employee, impersonator | effect: eliminates, suspects, accounted, staff, schedule
  - Step 3: obs: witnesses, inconsistently, recall, seeing, employee, wasn, staff, list | corr: inconsistencies, indicate, murderer, impersonating, staff, member | effect: narrows, suspect, pool, further, create, false, identity
- Discriminating test method: trap
- Discriminating test elements to dramatize (compose ENTIRELY in your own sentences from these — do NOT reproduce any briefing phrase verbatim): staged, scenario, hotel, staff, questioned, missing, employee, impersonation, revealed, inconsistencies
- Test must rely on already-shown clue IDs: clue_5, clue_core_contradiction_chain, clue_4, clue_early_1
- Fair-play rationale: Step 1: The fibers found (early) and witness statements (mid) show the murderer wore a staff costume. Step 2: The missing employee from the staff schedule (mid) narrows suspects. Step 3: Inconsistencies in witness accounts (discriminating test) reveal the impersonator.

## Character Reference

### Eleanor Voss (she/her — NEVER he/him)
Eleanor's speech is warm and inviting, often peppered with quick, witty remarks that reveal her sharp mind
She tends to speak in a measured pace, allowing her words to linger.
Eleanor grapples with guilt over her husband's infidelity, fearing that his indiscretions will come to light and ruin her hard-earned reputation.
Voice colour: Eleanor Voss uses dry wit humour — let it surface in their dialogue where natural, not in every line.

### Captain Ivor Hale (he/him — NEVER she/her)
Hale speaks with a commanding tone, often cutting to the chase with little room for pleasantries
His words are deliberate, underscored by a sense of urgency.
Hale wrestles with shame over his gambling habits and the fear of losing everything he has fought for in life.

### Beatrice Quill (she/her — NEVER he/him)
Beatrice speaks with a charming lilt, often using elaborate language and a playful tone, making her sound both sophisticated and slightly disingenuous.
She grapples with the fear of losing social standing and love, torn between her ambitions and the reality of her choices.
Voice colour: Beatrice Quill uses polite savagery humour — let it surface in their dialogue where natural, not in every line.

### Sylvia Trent (she/her — NEVER he/him)
Sylvia speaks in a free-spirited manner, often weaving in poetic imagery and philosophical musings, revealing her artistic soul.
Sylvia struggles with feelings of inadequacy stemming from both her art and her unreciprocated affections, creating a storm of emotional conflict.
Voice colour: Sylvia Trent uses observational humour — let it surface in their dialogue where natural, not in every line.


## CHARACTER CONTRACTS (binding for this scene)
Each entry below constrains how this character must be written in this chapter.
These override generic style guidance when they conflict.

### Eleanor Voss[SHE]
Voice & mannerisms: Eleanor's speech is warm and inviting, often peppered with quick, witty remarks that reveal her sharp mind. She tends to speak in a measured pace, allowing her words to linger.
SIGNATURE TIC (use sparingly — this is Eleanor Voss's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "‘Well, isn't that just the way of it?’"
Sample voice fragments (match this register and rhythm):
  [comfortable] "‘It’s always a pleasure to welcome guests at our little inn. We do try to make it feel like home.’"
  [evasive] "‘Well, isn’t that just the way of it? Best not to dwell on unpleasant matters, wouldn’t you say?’"
Humour: dry wit — deploy occasionally (level 0.5)
FORBIDDEN phrase (never write for Eleanor Voss): "a surge of determination washed over her"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Her sense of responsibility for her guests' well-being drives her to uncover the truth behind the murder, lest her inn's reputation suffer." — do not surface in Act I.

### Captain Ivor Hale[HE]
Voice & mannerisms: Hale speaks with a commanding tone, often cutting to the chase with little room for pleasantries. His words are deliberate, underscored by a sense of urgency.
SIGNATURE TIC (use sparingly — this is Captain Ivor Hale's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "‘It’s all just a game, isn’t it?’"
Sample voice fragments (match this register and rhythm):
  [comfortable] "‘It’s all just a game, isn’t it? Strategy is key, and I’ve always been a good player.’"
  [evasive] "‘I was merely entertaining some friends; nothing more, nothing less.’"
Humour: blunt — deploy rarely (level 0.3)
FORBIDDEN phrase (never write for Captain Ivor Hale): "she chose her words with great care"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "The victim's threat to expose Hale's gambling issues creates a potent motive rooted in fear and desperation." — do not surface in Act I.

### Beatrice Quill[SHE]
Voice & mannerisms: Beatrice speaks with a charming lilt, often using elaborate language and a playful tone, making her sound both sophisticated and slightly disingenuous.
SIGNATURE TIC (use sparingly — this is Beatrice Quill's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "‘Oh darling, how dreadfully amusing!’"
Sample voice fragments (match this register and rhythm):
  [comfortable] "‘Oh darling, how dreadfully amusing! Can you believe the audacity of some people?’"
  [evasive] "‘Why dwell on such matters? Let’s focus on the delightful company we have.’"
Humour: polite savagery — deploy occasionally (level 0.6)
FORBIDDEN phrase (never write for Beatrice Quill): "she felt a wave of unease"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Fear of losing Hale's affection if the victim exposes their affair drives her to desperate measures." — do not surface in Act I.

### Sylvia Trent[SHE]
Voice & mannerisms: Sylvia speaks in a free-spirited manner, often weaving in poetic imagery and philosophical musings, revealing her artistic soul.
SIGNATURE TIC (use sparingly — this is Sylvia Trent's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "‘Life is but a canvas, isn’t it?’"
Sample voice fragments (match this register and rhythm):
  [comfortable] "‘Life is but a canvas, isn’t it? Each day a new brushstroke on the page.’"
  [evasive] "‘Oh, these matters are trivial compared to the beauty of art.’"
Humour: observational — deploy occasionally (level 0.4)
FORBIDDEN phrase (never write for Sylvia Trent): "everyone could sense the atmosphere"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Her anger over the victim's dismissal of her art leads her to consider the unthinkable." — do not surface in Act I.



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

Primary Location: The Seaside Retreat Hotel (Margate, England)
A modest seaside hotel nestled on a remote stretch of coastline, catering to vacationers and local visitors.

Key Locations Available:
- The Dining Room (interior): Crime scene
- The Manager's Office (interior): Private area for management
- The Lounge (interior): Gathering space

Atmosphere (tonal cue only — do NOT reproduce this phrase verbatim in prose; translate into scene-specific, character-observed sensory language): Tense, with an undercurrent of suspicion among the guests.
Weather: Overcast skies with occasional rain, typical of a coastal climate in the late spring.

Era markers: Flickering radio broadcasting news updates | Early television sets in private rooms | Staff uniforms reflecting post-war practicality | Rationed fuel limiting travel options | Women in the workforce, managing hotel duties

USAGE GUIDELINES:
1. First mention of location: Ground the scene using sensory details drawn from the profiles — paraphrase these into what the POV character directly observes and experiences, not a summary of the room's general qualities
2. Geographic grounding: Reference the specific place (Margate, England) naturally in dialogue or narrative
3. Action scenes: Integrate physical layout details (access, sightlines, constraints)
4. Atmospheric scenes: Reference weather, lighting, sounds from sensory palette
5. Era details: Weave in period markers naturally
6. Consistency: Keep all location descriptions aligned with profiles
7. OPENING GROUNDING (required, first 1-2 paragraphs of EVERY chapter): (a) name the specific location from this list, (b) give at least 2 concrete sensory details (sound, smell, temperature, texture, light/shadow), and (c) one time-of-day or weather/atmosphere detail — BEFORE advancing plot, clues, or the mechanism. Open on the setting and the people in it, not on the puzzle.
8. This matters most in pre-reveal chapters that withhold the mechanism: ground them in setting and character rather than rushing the investigation — a withheld chapter is not an empty one.
9. Do NOT use generic repeated manor/storm filler without profile-specific details; vary the opening location/sense each chapter

SENSORY PALETTE (use 2-3 senses per scene):
The Dining Room (interior):
  - Visual: flickering candlelight on tables, rain-streaked windows, crumpled tablecloths
  - Sounds: clinking of cutlery, muffled conversations, occasional laughter turning nervous
  - Scents: scent of damp wood, faint aroma of overcooked fish, lingering perfume of a guest
  - Touch: rough wooden table surface, cold metal cutlery

The Manager's Office (interior):
  - Visual: stacked papers and ledgers, dim light filtering through the window, faded photographs on the walls
  - Sounds: the clack of a typewriter, rustling papers, the distant sound of waves
  - Scents: scent of old paper and ink, faint whiff of musty books, the tang of salt air through the window
  - Touch: rough wood of the desk, cool metal of the typewriter keys

The Lounge (interior):
  - Visual: worn leather armchairs, dimly lit bar with glass shelves, flickering fireplace
  - Sounds: soft jazz playing on the radio, the crackle of the fire, gentle murmurs of conversation
  - Scents: scent of aged whiskey, warmth of the fireplace, the aroma of freshly brewed coffee
  - Touch: soft leather of armchair, warmth radiating from the fire

⛔ REFERENCE DATA — DO NOT TRANSCRIBE VERBATIM: The above profiles are structural guides only. Generate original prose that evokes these qualities; do not reproduce the exact phrasing or sentence structure of the profile paragraphs.

SCENE OPENING RULE: When opening a scene in a new location, write what the POV character directly observes and physically senses at that moment — not a general description of the room's qualities. The reader must feel present
[truncated for prompt budget]

## Texture Pool
Draw on these as opportunities arise — you are not required to use them.

- Living through November 1940 means enduring the oppressive weight of war, with daily life marked by rationing and uncertainty
- The overcast skies mirror the collective anxiety felt by the populace as they grapple with the realities of the ongoing Battle of Britain
- Each day brings new fears, from air raids to the shifting dynamics of society, where women are stepping into roles once reserved for men
- As families are displaced and communities band together, the emotional landscape is dominated by resilience amidst despair
- This time is characterized by a growing awareness of the world’s fragility, reflected in the shadows cast by the war.

TEMPORAL CONTEXT:

This story takes place in November 1940 during N/A.

Seasonal Atmosphere:
- Weather patterns: overcast skies, occasional rain, cool temperatures
- Daylight: Short days with twilight settling by 4:30 PM, often leading to a dim, moody atmosphere.
- Seasonal activities: attending local theater productions, participating in charity events for war relief, enjoying indoor social gatherings with card games
- Seasonal occasions: Thanksgiving (November 28)
- Season: N/A

Period Fashion (describe naturally):
- Men formal: double-breasted wool suits, tweed blazers, dress shirts with wide lapels
- Men casual: corduroy pants, sweaters in muted colors, button-up shirts with rolled sleeves
- Men accessories: fedoras, leather gloves, silk ties with geometric patterns
- Women formal: tea-length dresses with cinched waists, satin evening gowns, tailored coats with fur collars
- Women casual: A-line skirts paired with fitted blouses, knit sweaters with floral patterns, practical yet stylish shoes with low heels
- Women accessories: broad-brimmed hats, string of pearls, gloves reaching to the elbows

Cultural Context (reference naturally):
- Music/entertainment: Bing Crosby's 'I'll Be Home for Christmas', Duke Ellington's swing music, the Andrews Sisters' harmonies; Films: 'Rebecca' directed by Alfred Hitchcock, 'The Great Dictator' by Charlie Chaplin; Theatre: 'The Glass Menagerie' by Tennessee Williams, 'The Little Foxes' by Lillian Hellman; Radio: The Shadow, Gunsmoke
- Typical prices: Loaf of bread: four pence, Pound of sugar: one shilling, Train ticket to the next town: two shillings
- Current events: the Battle of Britain continues as air raids over London persist; the US remains neutral yet increasingly supportive of Britain through Lend-Lease Act
- Literature: 'The Grapes of Wrath' by John Steinbeck | 'For Whom the Bell Tolls' by Ernest Hemingway | 'The Maltese Falcon' by Dashiell Hammett | [detective fiction] | [historical novels] | [war literature]
- Technology: the first commercially available radar systems | early computers designed for military use | advancements in radio technology for clearer transmission | table radios in homes | early television sets in affluent households | manual typewriters
- Daily life: hosting dinner parties, participating in community fundraisers, gathering for card games and dances
- Social rituals: attending church services on Sundays, engaging in neighborhood watch meetings, participating in wartime scrap drives

Atmospheric Details:
The scent of damp earth mingled with the crispness of falling leaves, creating a rich, nostalgic aroma that filled the air. The sound of rain against window panes was a constant reminder of the weather’s somber mood, with the occasional rumble of thunder echoing in the distance. Soft whispers and the clinking of glasses punctuated the tension in the hotel’s lounge, where a mix of laughter and suspicion lingered heavily in the air.

FASHION INTEGRATION TECHNIQUES:
- First appearance: Describe outfit to establish class/personality
- Accessories: Gloves, hats, pocket watches, jewelry reveal status
- Time-specific: Different outfits for different times of day
- Character traits: Fastidious dresser vs rumpled appearance
- Action integration: "She tugged at her glove" or "He adjusted his tie"
- Weather appropriate: Overcoats in winter, light linen
[truncated for prompt budget]

NON-NEGOTIABLE CHAPTER OBLIGATIONS — LOCKED EVIDENCE VALUES (VERBATIM REQUIRED):
The following measured values (times, amounts, measurements) are absolute ground truth. Every time this chapter describes, mentions, or alludes to one — no matter how briefly — it MUST use the exact phrase shown below, character for character. NO paraphrase, approximation, rounding, or synonym is permitted.

FAILURE EXAMPLE: if the locked value is "at thirteen minutes to midnight" and you write "just before midnight" or "around midnight" — that is a HARD FAIL. You must write "at thirteen minutes to midnight". Equally, if the locked value is written in words, such as "ten minutes past eleven", and you convert it to figure-based clock notation — that is also a HARD FAIL. Words stay as words; figure forms are forbidden for word-phrased facts.

CRITICAL — WORD-PHRASED VALUES: If the canonical value is written out in words (e.g. a time like "ten minutes past eleven", or an amount like "forty minutes"), reproduce those exact words. DO NOT convert to figure-based time notation, twenty-four-hour format, or any other numeric shorthand. Correct: "ten minutes past eleven". WRONG: figure-based clock notation or numeric shorthand.

Locked values:
  - The angle of the light source necessary to cast the desired shadow.: "forty-five degrees"
  - The distance between the mirror and the light source.: "ten feet"
  - The established time of the murder according to witnesses.: "half past eight"
    ⛔ FORBIDDEN alternatives: "8:30", "8.30", "eight thirty", "eight-thirty", "eight past thirty", "quarter past eight" — the ONLY acceptable form is "half past eight"

If a value has no relevance to this chapter, omit it. But the moment you reference the underlying evidence, only the exact phrase above is acceptable.

⛔ CLUES TO SURFACE IN THESE CHAPTERS — mandatory:
The following evidence MUST be clearly observable to an attentive reader. Do not bury it in atmosphere or passing dialogue. Each clue must be concrete, specific, and noticeable:

• [clue_core_contradiction_chain] fibers, matching, hotel, staff, uniforms, crime, scene
  Category: physical | Criticality: essential | Supports inference step 1
  Points to: murderer, likely, wore, staff, uniform

• [clue_fp_contradiction_step_1] fibers, matching, hotel, staff, uniforms, crime, scene
  Category: temporal | Criticality: essential | Supports inference step 1
  Points to: presence, fibers, suggests, murderer, wore, staff, costume

For each clue above: an attentive reader should be able to find, record, and later use it to reason toward the solution.

═══ NARRATIVE STATE (read-only — do not contradict) ═══

LOCKED FACTS — use verbatim whenever this evidence is described:
  • The angle of the light source necessary to cast the desired shadow.: "forty-five degrees"
  • The distance between the mirror and the light source.: "ten feet"
  • The established time of the murder according to witnesses.: "half past eight"

CHARACTER PRONOUNS — never deviate from these:
  • Eleanor Voss: she/her/her
  • Dr. Mallory Finch: she/her/her
  • Captain Ivor Hale: he/him/his
  • Beatrice Quill: she/her/her
  • Sylvia Trent: she/her/her
  • Hugo Vane: he/him/his

CLUES ALREADY REVEALED TO READER: clue_mechanism_visibility_core, clue_mid_1 — do not reveal these as new information.

INVESTIGATION LOG — WHAT IS ESTABLISHED (do not re-establish, do not repeat):
• Evidence already established (reference only — do NOT restate or quote these; advance beyond them): murderer, wore, staff, costume, commit, crime | murderer, wore, staff, costume, commit, crime
• Suspects still unresolved: Captain Ivor Hale[HE], Beatrice Quill[SHE], Sylvia Trent[SHE]
⚠ The story must move FORWARD from this log. Any beat already listed above is forbidden from repeating.

⚠ THIS CHAPTER'S REQUIRED ADVANCE (opening): Discover the body, confirm the victim, establish the scene. The victim is found dead. They do not speak, react, or gesture. This is their only physical appearance — in all subsequent chapters they exist only in past tense (memory, evidence, testimony).

CONTINUITY HANDOFF — previous chapter closing beat:
  • "The morning wore on, the autumn rain intensifying as Eleanor and Mallory prepared for the arrival of the authorities. The hotel lobby, once a sanctuary of warmth and camaraderie, now felt like a stage set for drama, every glance exchanged hinting at secrets ye..."
  • The next chapter must open as a continuation of this beat, not as a disconnected reset.
═══════════════════════════════════════════════════════

═══════════════════════════════════════════════════════════
📚 CONTINUITY CONTEXT - CHARACTER & SETTING CONSISTENCY
═══════════════════════════════════════════════════════════

**CRITICAL: You are writing chapters 2+. Maintain consistency with earlier chapters.**

**Character Names Used in Chapters 1-1:**
Eleanor Voss, Dr. Mallory Finch, Hugo Vane

✓ RULE: Use EXACTLY these names. Do NOT vary spelling, add titles, or introduce new forms.
✓ Example: if earlier chapters used "Clara Whitfield", keep using "Clara Whitfield" — never "Mrs. Whitfield" unless that is the character's canonical name in the list above.

**Setting Vocabulary Established in Earlier Chapters:**
corridor, lobby

✓ RULE: Continue using this location vocabulary. Maintain consistency with established setting type.
✓ Do NOT introduce new location types that contradict earlier chapters.

**Recent Chapter Summary (for narrative continuity):**
Chapter 1: Chapter 1: The Locked Room Awakens
  Events: Eleanor Voss pressed her palm against the cold brass handle of the hotel lobby door, the morning’s pale light filtering through rain-streaked glass.

⚠️ **VALIDATION:** Character name mismatches and setting drift are common failure modes.
Double-check every character name against the list above before using it.

**⏱ LOCKED TIME ANCHOR — use verbatim, do not paraphrase:**
Clock time (from the case ground truth): **"8 PM"**
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
Known location profile anchors: The Seaside Retreat Hotel, The Dining Room, The Manager's Office, The Lounge, the hotel lobby
LOCATION NAME CAPITALISATION (HARD REQUIREMENT — validated):
All named locations in your prose MUST use the EXACT capitalisation from the CML profiles.
Canonical forms: "The Seaside Retreat Hotel", "The Dining Room", "The Manager's Office", "The Lounge", "the hotel lobby"
Writing a location in lowercase (e.g. "drawing room" instead of "Drawing Room") is a validated error. Every time you mention a named location, copy its capitalisation from the list above.
- Chapter 2: OPENING STYLE (HARD): Start the VERY FIRST SENTENCE with spoken dialogue — e.g. '"[words]," [Name] said/asked/replied/murmured.' The opening quote must be the first character on the line. Anchor opening in "the hotel lobby". The opening style above governs only your FIRST SENTENCE; the grounding below may land anywhere in the first 2 paragraphs (it need not be sentence one, and never conflicts with the chosen opening style). HARD REQUIREMENT for the first 2 paragraphs: (a) include 2+ sensory words — choose from smell/scent/odor/fragrance/sound/echo/silence/whisper/creak/cold/warm/damp/rough/smooth/glow/shadow/flicker/dim — and (b) include 1+ atmosphere/time word — choose from rain/wind/fog/storm/mist/thunder/evening/morning/night/dawn/dusk/lighting/weather/season/afternoon/midday/noon/midnight/twilight/sunrise/sunset/daylight/sunlight/overcast/cloudy/bright/dark/grey/pale/chill/crisp/drizzle/haze/lamplight/firelight. These are validated requirements, not style suggestions; missing them triggers a retry.

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

PROMPT BUDGET SUMMARY: budget=24000 tokens; fixed=9490; context=12403; dropped=[none]; truncated=[location_profiles, temporal_context, pronoun_accuracy]

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
4. Integrate at least two concrete era-grounded details per chapter from setting refinement signals: radio broadcasting in common areas | early television sets in private rooms | basic radar systems for maritime navigation | long-distance telephone calls possible but expensive | military-style coded messages for sensitive information | telegram services available for urgent communication.
5. Respect setting movement/access constraints in scene action and alibis: narrow hallways limiting movement | access to the beach restricted to certain hours | private areas like the manager's office off-limits to guests | staff-only areas including the kitchen and storage rooms | guest access limited to public areas during certain hours.
6. Sustain social coherence with this backdrop pressure: A group of hotel guests, drawn together by the promise of a seaside retreat, becomes ensnared in a web of deception as the pressures of post-war society and the specter of Cold War tensions heighten their suspicions of one another.
7. Maintain continuity around these socially central cast anchors where relevant: Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill, Sylvia Trent, Hugo Vane.
8. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Critical: Plot similarity 0.80 with 'The Second Key' (same impersonation crime and method)
9. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Moderate: Character similarity 0.75 with 'The Second Key' (similar cast structure and roles)
10. STORY TO DATE ANTI-COPY RULE: The STORY TO DATE section below is provided for chronological and factual reference ONLY. You MUST NOT copy, lightly rephrase, or structurally echo any sentence or paragraph from prior chapters. Every sentence in this chapter must be original prose unique to this scene. Reusing even a clause from prior chapter text will cause this attempt to fail immediately.

CRITICAL PROSE REQUIREMENTS:

The CML specifies exact requirements for certain validation-critical scenes. You MUST include these elements at the specified positions.

**Discriminating Test Scene (Act 3, Scene 4):**
Required elements: Execute the discriminating test, Observe the impersonator's reaction or result, Draw conclusion about guilt
Test type: trap

**Suspect Clearance Scenes:**
- Captain Ivor Hale (Act 3, Scene 5): Verified presence in the bar during the murder.
  Clues: clue_id_3, clue_id_4
- Beatrice Quill (Act 3, Scene 5): Documented working hours during the murder.
  Clues: clue_id_5, clue_id_6
- Sylvia Trent (Act 3, Scene 5): Proven to be in her room at the time.
  Clues: clue_id_7, clue_id_8

**Culprit Revelation Scene (Act 3, Scene 6):**
Method: Confrontation with evidence

**Clue Placement for These Chapters:**
- clue_core_contradiction_chain must appear in Act 1, Scene 2 via Direct observation

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
Investigation state at start: 2 clue(s) revealed to reader; approximately 3 unresolved suspect(s).
Must change by end: Reframe prior clue meaning and update suspect implications.
Suspect pressure target(s): Captain Ivor Hale, Beatrice Quill, Sylvia Trent
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
  - Scene is set in: the hotel lobby — reference it naturally within the paragraph, never as your opening phrase.
  - Opening atmosphere (MANDATORY — validator enforced): the first paragraph MUST contain at least one of: rain / wind / fog / storm / mist / thunder / evening / morning / night / dawn / dusk / season / afternoon / midday / noon / midnight / twilight / sunrise / sunset / daylight / sunlight / overcast / cloudy / bright / dark / grey / pale / cold / warm / chill / crisp / damp / drizzle / haze / lamplight / firelight. A chapter that omits all of these from its opening paragraph will be rejected.
  - PARAGRAPH OPENER DIVERSITY (MANDATORY — validator enforced): No more than 2 paragraphs in this chapter may begin with "Eleanor" or "Eleanor's" as the first word. You must vary paragraph openings throughout: use sensory observations, another character's name or action, dialogue, object or sound details, or temporal markers. Opening 3 or more paragraphs with "Eleanor" will cause automated rejection.
  - Continuity bridge: in the first 120 words, visibly connect from the previous chapter's final beat. Carry forward one unresolved element (object, accusation, emotional pressure, or immediate physical action) from: "The morning wore on, the autumn rain intensifying as Eleanor and Mallory prepared for the arrival of the authorities. The hotel lobby, once a sanctuary of warmth and camaraderie, now felt like a stage set for drama, ever...".
  - CLUE OBLIGATIONS — each clue below MUST be dramatized, but in YOUR OWN WORDS:
    Render each as something a character SEES, DOES, or SAYS on the page. The bracketed text is a
    DESCRIPTION of the evidence for you — do NOT transcribe it as narration. Copying a clue's
    description sentence verbatim into the prose FAILS validation.
    • fibers, collected, crime, scene [clue_core_contradiction_chain] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: murderer, likely, wore, staff, uniform
      ↳ MANDATORY TWO-PARAGRAPH STRUCTURE (must appear in paragraphs 1 or 2 — no later):
         Paragraph 1: The POV character physically approaches or directly observes this evidence.
           The narration or dialogue explicitly states what is seen (use the exact locked phrase if one applies).
         Paragraph 2 (immediately following): The detective or POV character explicitly reasons
           about what this evidence implies — who it implicates, why it may be unreliable,
           or what inference it supports. This must be a separate full paragraph, not a sentence appended to Paragraph 1.
    • hotel, staff, schedule, shows, missing, employee, time, murder [clue_fp_contradiction_step_1] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: presence, fibers, suggests, murderer, wore, staff, costume
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
  - ALIBI LOCK: Dr. Mallory Finch's established alibi is "8 PM to 9 PM". Do NOT place Dr. Mallory Finch at any other location or in any other activity during the crime window. Any contradiction is a continuity error that triggers a retry.
  - TESTIMONY CONTINUITY: Dr. Mallory Finch has already made statements in earlier chapters. Any time, location, or claim attributed to Dr. Mallory Finch in THIS chapter must be consistent with those earlier statements. Do NOT introduce a new or different alibi claim — any contradiction is a continuity error.
- Locked fact phrase obligations:
  - If this batch mentions The angle of the light source necessary to cast the desired shadow., write exactly: "forty-five degrees".
  - If this batch mentions The distance between the mirror and the light source., write exactly: "ten feet".
  - If this batch mentions The established time of the murder according to witnesses., write exactly: "half past eight".
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
Investigation state at start: 2 clue(s) revealed to reader; approximately 3 unresolved suspect(s).
Must change by end: Reframe prior clue meaning and update suspect implications.
Suspect pressure target(s): Captain Ivor Hale, Beatrice Quill, Sylvia Trent
Required new information: Earlier clue gets revised meaning with explicit theory update.
Forbidden reveals at this stage: Do not introduce decisive new evidence from nowhere.

FROZEN FACT STATE (DO NOT ALTER):
- Timeline anchor: November (autumn).
- Month, season, weather, and time-of-year language in this batch must stay compatible with autumn.
- Established timeline fact: 8 PM
- Established timeline fact: 9 PM
- If referenced, use exact phrase: "forty-five degrees" (The angle of the light source necessary to cast the desired shadow.).
- If referenced, use exact phrase: "ten feet" (The distance between the mirror and the light source.).
- If referenced, use exact phrase: "half past eight" (The established time of the murder according to witnesses.).

STORY TO DATE (REFERENCE ONLY — DO NOT COPY VERBATIM):
- Full prior chapter text is provided below for continuity, factual consistency, and reference accuracy.
- Use this to keep character voice, chronology, clue state, and location continuity aligned with earlier chapters.
- Do not quote, copy, or paraphrase these paragraphs too closely; write fresh prose that remains consistent with them.

--- BEGIN PRIOR CHAPTER 1 ---
Title: Chapter 1: The Locked Room Awakens
Eleanor Voss pressed her palm against the cold brass handle of the hotel lobby door, the morning’s pale light filtering through rain-streaked glass. The scent of damp wool mingled with the faint aroma of overcooked fish lingering from last night’s supper. Outside, the autumn drizzle tapped a nervous rhythm against the windowpanes, echoing the tension that clung to every surface. Inside, silence reigned; even the radio, usually tuned to the BBC’s war bulletins, had been abandoned in favor of uneasy anticipation. Eleanor’s gaze flickered toward the grand staircase, where the shadows seemed to deepen, and she wondered if the day would ever shake the chill that had settled over the Seaside Retreat Hotel.

It was then, as Eleanor’s footsteps echoed across the rough wooden floor, that she saw Hugo Vane lying motionless in the locked room at the top of the stairs. His body, sprawled beside the overturned chair, was unmistakable: Hugo’s tailored wool suit, now rumpled and stained, marked him as the hotel’s most formidable guest. The flickering lamplight cast sharp shadows across his face, accentuating the unnatural stillness. Eleanor’s breath caught, her hand trembling as she reached for the doorframe. The room’s air was thick with the scent of damp wood and the faint perfume of a guest who had passed through hours before. The sight of Hugo Vane—so vital only yesterday—now rendered silent and cold, sent a shudder through Eleanor’s spine.

Dr. Mallory Finch arrived moments later, her footsteps brisk and purposeful, the echo of her leather heels announcing her presence. As the hotel’s physician and Hugo’s financial dependent, Mallory’s eyes lingered on the body with a mixture of professional detachment and personal unease. She knelt beside Hugo, fingers checking for a pulse she knew she would not find. Her tailored coat, cinched at the waist, betrayed none of the chaos beneath. Mallory’s jaw tightened, but her voice remained steady. ‘You know, it’s always the patients that keep you guessing. Keeps me on my toes,’ she murmured, though her gaze flickered toward Eleanor, searching for something unspoken. Eleanor noted the way Mallory’s hand hovered above the victim’s wrist, as if reluctant to let go of the certainty her profession demanded.

Eleanor, innkeeper and now detective by necessity, forced herself to take command. ‘We must keep everyone out until the authorities arrive. This is no ordinary tragedy.’ Her voice carried the weight of responsibility, but her wit—usually quick and dry—was subdued by the gravity of the moment. She glanced at the hotel register, its pages marked with the names of guests and staff, and noted a discrepancy: one staff member’s name had been crossed out, the schedule for last night left incomplete. The absence was glaring, given the chaos that had unfolded. Eleanor’s mind raced, recalling the staff’s uniforms and the routines she had memorized over years of managing the inn. The missing entry was not merely an oversight—it was a puzzle piece out of place.

Mallory rose, smoothing the skirt of her dress, her eyes scanning the room for signs of struggle. The overturned chair, the scattered papers, and the faint impression of a shoe print near the window suggested more than a simple accident. ‘It’s odd,’ Mallory said, her tone clipped, ‘I saw Hugo last evening, just before the rain began. He seemed agitated, but nothing out of the ordinary. Yet now—’ She paused, her gaze drifting to the schedule Eleanor held. ‘Wasn’t there a staff member due on duty during the murder window?’ Eleanor nodded, her fingers tracing the missing name. The implication settled between Eleanor and Mallory: someone had been absent when they should have been present.

The tension in the hotel lobby deepened as Eleanor led Mallory back downstairs. The rough wooden banister felt colder than usual, and the muffled conversations of guests behind closed doors hinted at the anxiety simmering throughout the inn. Eleanor’s mind turned to the staff uniforms—identical, practical, easy to mistake for one another in the dim light. She recalled seeing a figure in staff attire moving swiftly through the corridor last night, but the face was lost to shadow. Was it possible someone had impersonated a staff member, slipping past unnoticed to commit the crime? The notion unsettled Eleanor, but she kept her suspicions close, unwilling to voice them until she had more than a missing name and a vague memory.

Mallory lingered near the reception desk, her fingers tapping a nervous rhythm on the polished wood. ‘I suppose the authorities will want to know who was on duty,’ she said, her voice betraying a hint of self-deprecating humor. ‘I’d hate to be the one to explain a missing staff member. It’s not exactly the sort of thing that inspires confidence in one’s management.’ Eleanor offered a tight smile, the dry wit she was known for surfacing briefly. ‘Well, isn’t that just the way of it? Best not to dwell on unpleasant matters, wouldn’t you say?’ But beneath the levity, Eleanor’s mind was already cataloguing inconsistencies, searching for the thread that would unravel the mystery.

A sudden hush fell as Eleanor noticed the two clocks mounted above the lobby’s mantelpiece. One, a stately brass timepiece, read half past eight, while the other—a battered wall clock—lagged behind, its hands frozen at eleven past eleven. The contradiction was impossible to ignore. Eleanor’s eyes narrowed, the discrepancy tugging at her sense of order. She gestured for Mallory to look. ‘Do you see that? Two clocks, two stories. Which do you trust?’ Mallory frowned, her gaze flickering between the timepieces. ‘I suppose it depends on who set them.’ The exchange was brief, but loaded with implication. The established time of the murder according to witnesses was half past eight, yet the evidence refused to cooperate.

Eleanor’s thoughts churned as she considered the implications. If Hugo Vane had died no later than eleven past eleven, as the wall clock suggested, then three suspects’ alibis—each claiming to have been elsewhere at half past eight—were suddenly in question. The contradiction was more than a technicality; it was a fracture in the fabric of truth. Eleanor felt the weight of the investigation settle on her shoulders, but she refused to let the uncertainty paralyze her. Instead, she catalogued the clues: the missing staff member, the impersonation possibility, the conflicting times. The masquerade of authority had begun, and Eleanor was determined to see through the masks.

The morning wore on, the autumn rain intensifying as Eleanor and Mallory prepared for the arrival of the authorities. The hotel lobby, once a sanctuary of warmth and camaraderie, now felt like a stage set for drama, every glance exchanged hinting at secrets yet to be revealed. Eleanor’s resolve hardened, her sense of duty eclipsing the personal fears that threatened to surface. She straightened her posture, her eyes scanning the faces of guests as they emerged, each one a potential suspect, each one carrying the burdens of war and uncertainty. The investigation had begun, and Eleanor Voss—innkeeper, detective, and guardian of the Seaside Retreat Hotel—would not rest until the truth was laid bare.
--- END PRIOR CHAPTER 1 ---

[SCENE COMPLETENESS CONTRACTS — MANDATORY. Each contract below lists what you MUST enact in that chapter. Do not summarise or mention these labels in the prose — enact them organically.]
Chapter 2 (Act 1) completeness contract:
  PIVOT ELEMENT (MANDATORY — write this into the prose, shown not told): "Captain Hale's insistence on his alibi."
  FACT ESTABLISHED (MANDATORY — reader must know this by chapter end): "Conflicting accounts of the evening's events emerge, suggesting potential deceit among the guests."

# Case Overview
Title: The Masquerade of Authority
Era: 1940s
Setting: A modest seaside hotel
Crime: murder (impersonation)
Culprit: Dr. Mallory Finch
Victim: Hugo Vane
False assumption: The murder could not have been committed by a hotel staff member.
Cast: Eleanor Voss (she/her), Dr. Mallory Finch (she/her), Captain Ivor Hale (he/him), Beatrice Quill (she/her), Sylvia Trent (she/her), Hugo Vane (he/him)

Setting Lock: Keep all scenes and descriptions consistent with the stated setting (A modest seaside hotel). Do not introduce a different location type. Do not invent an alternative estate name. The only permitted name for this property is "A modest seaside hotel" — any other estate name (e.g., "Caldwell Manor", "Ashwood Hall", or any invented proper name) is a continuity error that will be caught and rejected.

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
      "timeOfDay": "Morning after the murder",
      "atmosphere": "Chilling and chaotic as guests gather"
    },
    "characters": [
      "Eleanor Voss",
      "Captain Ivor Hale",
      "Beatrice Quill",
      "Sylvia Trent"
    ],
    "purpose": "Establish initial reactions to the crime and introduce suspects",
    "cluesRevealed": [
      "clue_core_contradiction_chain",
      "clue_fp_contradiction_step_1"
    ],
    "dramaticElements": {
      "conflict": "Tension among the guests rises as they react to the news.",
      "tension": "The guests' conflicting stories start to emerge.",
      "microMomentBeats": [
        "Hale's fingers drum nervously against the bar, betraying his unease."
      ]
    },
    "summary": "In the hotel lobby, the guests react to the shocking news of the murder. Eleanor Voss tries to maintain order as Captain Ivor Hale, Beatrice Quill, and Sylvia Trent express their disbelief and concern. Conflicting statements about their whereabouts during the murder begin to surface, revealing the first contradiction: Hale insists he was in the bar the entire evening, yet Beatrice claims to have seen him elsewhere.",
    "beat": "crime",
    "estimatedWordCount": 1800,
    "pivotElement": "Captain Hale's insistence on his alibi.",
    "factEstablished": "Conflicting accounts of the evening's events emerge, suggesting potential deceit among the guests.",
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
        "characterName": "Beatrice Quill",
        "behaviour": "Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted."
      },
      {
        "characterName": "Sylvia Trent",
        "behaviour": "Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted."
      }
    ],
    "redHerringPlacement": null,
    "emotionalRegister": "The investigation reveals the fragility of trust among the guests.",
    "dominantCharacterNote": {
      "name": "Eleanor Voss",
      "voiceRegister": "Eleanor's voice is warm and inviting, often marked by a quick wit that reflects her sharp mind."
    },
    "humourGuidance": {
      "permission": "forbidden"
    },
    "eraTextureNote": "Rationing limits access to basic goods.; Travel is restricted due to fuel shortages.; Communication is often delayed due to military operations.; Public gatherings are under scrutiny due to safety concerns.; The threat of air raids restricts outdoor activities.",
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
□ Allowed seasonal words only: autumn, autumnal, fall.
□ Forbidden seasonal words: spring, summer, winter.
□ Chapter 2: the clue [clue_core_contradiction_chain] (fibers, matching, hotel, staff, uniforms, crime, scene) is placed in the first 25% of the chapter, dramatized in your own words, followed by an explicit inference or suspicion paragraph.
□ Chapter 2: the clue [clue_fp_contradiction_step_1] (fibers, matching, hotel, staff, uniforms, crime, scene) is placed in the first 25% of the chapter, dramatized in your own words, followed by an explicit inference or suspicion paragraph.
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
