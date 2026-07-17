# Actual Prompt Record

- Run ID: `mystery-1784231640128`
- Project ID: ``
- Timestamp: `2026-07-16T20:02:40.498Z`
- Agent: `Agent9-ProseGenerator-Ch1`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4.1`
- Temperature: `0.42`
- Max Tokens: `4500`
- Attempt: `first`
- Prompt Hash: `750eca2163ef7dc0`

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
- MORAL COMPLEXITY REQUIREMENT: The mechanism of this crime carries a moral gray area: "The culprit's actions stem from a desperate need to protect a loved one, complicating the viewer's perception of justice." — the culprit reveal and denouement MUST acknowledge this ambiguity. Do not let the ending feel clean or simple. Give the reader at least one moment of uncomfortable sympathy or moral doubt.

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
   - Captain Ivor Hale: Authority Figure
   - Beatrice Quill: Naive Assistant
   - Sylvia Trent: Cunning Businesswoman
   - Hugo Vane: Rival Investigator
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

- Eleanor Voss
  Public identity anchor: Traveling Journalist; detective 
  Connection to victim: Eleanor has written articles on Dr. Finch's medical practices, but they disagree on ethical standards.; Eleanor's investigative nature often puts her at odds with Dr. Finch's guarded professionalism..
  Investigation relevance: is actively driving interviews and credibility checks in this scene.
  Suspicion/pressure cue seed: Professional reputation.
  Investigator read: include one immediate observational inference (gesture, gaze target, pause, object grip), but do not state guilt as fact.

- Captain Ivor Hale
  Public identity anchor: Retired Naval Officer; suspect 
  Connection to victim: Dr. Finch disapproves of Hale's disregard for mental health issues among veterans.; They have debated fiercely at community meetings about veteran care policies..
  Investigation relevance: access plausibility: high | alibi window: narrow | opportunity channel: Seaside promenade.
  Suspicion/pressure cue seed: Defensive about past.
  Investigator read: include one immediate observational inference (gesture, gaze target, pause, object grip), but do not state guilt as fact.

- Beatrice Quill
  Public identity anchor: Hotel Staff; suspect 
  Connection to victim: Dr. Finch has reprimanded Beatrice for her mistakes at the hotel.; Beatrice sees Dr. Finch as a harsh mentor, though respects her medical expertise..
  Investigation relevance: access plausibility: medium | alibi window: narrow | opportunity channel: Dining room.
  Suspicion/pressure cue seed: Flustered when questioned.
  Investigator read: include one immediate observational inference (gesture, gaze target, pause, object grip), but do not state guilt as fact.

- Hugo Vane
  Public identit
[truncated for prompt budget]

WORLD DOCUMENT (use this as your primary creative context):

## Era: 1941-11
November 1941 casts a heavy shadow over the world, where the specter of war looms larger than life. The air is filled with the scent of salt from the nearby sea, and the sky is often overcast, reflecting the uncertainty of the times. People gather in cafes, discussing the latest news of escalating tensions abroad, while the clatter of typewriters fills the hotel lobbies, as journalists race to report on the unfolding drama. With Thanksgiving approaching, the community buzzes with preparations, but the underlying fear of espionage hangs thick in the air, creating an atmosphere ripe for secrets and intrigue.
Emotional register: A collective anxiety permeates daily life, with individuals grappling with fear and uncertainty about the future.
Physical constraints: Rationing of goods limits availability of food and clothing. | Travel is restricted due to fuel shortages. | Communication is often delayed due to wartime censorship.
Current tensions (weave into background texture): The attack on Pearl Harbor is imminent, stirring anxiety among citizens. | Escalating military enlistment amid concerns for national security. | Local rumors of espionage create distrust among guests at the hotel.
Wartime context — Many men enlist for military service, leaving behind families and uncertain futures.: Women begin to fill roles in the workforce, challenging traditional norms. Absence effect: The absence of loved ones creates a palpable tension and longing among those left behind.

## Story Theme
In a world teetering on the brink of war, the facades we create to protect ourselves can ultimately lead to our downfall, and reveals that evidence carries ethical weight, forcing characters to choose accountability over social performance when appearances and facts collide.

## Story Emotional Register
Dominant: The story evokes a sense of mounting tension and intrigue.

Arc:
The story opens with a sense of luxurious elegance at the Azure Crest Hotel, where the air is thick with the anticipation of a grand masquerade ball. As guests don their elaborate costumes, celebrating amidst the backdrop of an overcast sky, a dark cloud looms—the murder of Dr. Mallory Finch shatters the illusion of safety. Detective Eleanor Voss steps into the fray, her instincts ignited by the need to uncover the truth, but as she begins her investigation, the emotional cost weighs heavily upon her. Each clue she uncovers feels like a double-edged sword, raising questions and fears, leading her down false paths that test her resolve.

Midway through the investigation, an unexpected twist shifts Eleanor's perspective when she discovers that Captain Ivor Hale, a respected authority figure, may have manipulated the event schedule to create a false alibi. This revelation recontextualizes her earlier assumptions, igniting a sense of urgency as the stakes rise. As the investigation intensifies, pressure mounts, leading to a tense confrontation where Eleanor must face Hale. The culmination of her journey reveals not only the murderer but also forces her to confront her own demons, reflecting her struggle for justice in a world rife with deception.

In the resolution, the emotional toll is palpable as each character grapples with the consequences of their actions. Eleanor emerges changed, burdened by the realities of truth and the cost of justice, while Hale's arrogance unravels, leaving him vulnerable. The hotel, once a place of celebration, now stands as a monument to the complexities of human nature, where facades crumble and the truth emerges, leaving scars that will linger long after the masquerade ends.

## Emotional register at this point in the story
The atmosphere is one of luxurious anticipation, overshadowed by an undercurrent of tension.

## Character Portraits (appearance & era)

### Eleanor Voss
As a journalist, Eleanor Voss navigates the complexities of truth and deception in an era of growing suspicion. Her emotional burden from her brother's wartime death drives her need for justice, making her work all the more personal. In a time when women are stepping into roles traditionally held by men, Eleanor embodies the determination and resilience required to pursue the truth amidst chaos.
Era intersection: Eleanor’s quest for justice reflects the societal shifts of the 1940s, where women are increasingly taking charge in a male-dominated world.

### Captain Ivor Hale
Captain Hale, a figure of authority, struggles with the weight of his past and the threat of exposure regarding his wartime actions. His commanding presence is now shadowed by the fear of losing everything he has built. In a world rife with suspicion, he represents the complexities of authority figures grappling with their own demons in a time of uncertainty.
Era intersection: His internal battle with PTSD speaks to the broader societal challenges faced by returning soldiers in the post-war landscape.

### Beatrice Quill
As a cheerful hotel staff member, Beatrice Quill embodies the naivety of a young woman caught in a web of deception. Her small embezzlements threaten her future, reflecting the desperation many face during tough economic times. In a society where women are increasingly taking on roles outside the home, her struggle highlights the moral complexities of survival.
Era intersection: Beatrice’s situation illustrates the broader challenges women face as they navigate new societal roles while confronting ethical dilemmas.

### Sylvia Trent
Sylvia Trent, an art dealer with a keen sense of negotiation, is embroiled in a black market scheme that could unravel her career. Her cunning nature is tested as she confronts the fear of exposure amidst community scrutiny. In a time where espionage fears run high, her character represents the moral ambiguities faced by those trying to survive in a changing world.
Era intersection: Her involvement in unethical dealings reflects the pressures individuals face to maintain their livelihoods during wartime.

### Hugo Vane
Hugo Vane, a private investigator, grapples with the consequences of his reckless behavior, haunted by gambling debts that threaten to destroy his reputation. In a time of rising suspicion and moral scrutiny, his character reflects the complexities of personal integrity amidst the chaos of the 1940s.
Era intersection: Hugo's struggles with ethics and financial stability mirror the broader societal tensions regarding morality and trust during wartime.

## Character Voices

### Eleanor Voss (she/her/her)
Eleanor speaks with a fluid, engaging rhythm, often infusing her dialogue with literary references.
[comfortable] Ah, but isn't that the question of the hour? It seems the truth is always a little slippery.
[evasive] Well, I suppose everyone has their secrets, don't they? It's not my place to pry.
[stressed] The stakes are much too high for any missteps now; I can’t afford to fail.
Humour: Her dry wit serves as a defense mechanism against her insecurities.

### Captain Ivor Hale (he/him/his)
Captain Hale speaks in a booming voice filled with military jargon, often laced with self-deprecation.
[comfortable] Well, that's the rub, isn't it? War does strange things to a man.
[evasive] I don’t see how my past is relevant to this discussion; let's focus on the present.
[stressed] I can’t let them find out; it would destroy my reputation.
Humour: His self-deprecating humor reveals a vulnerability beneath his hardened exterior.

### Beatrice Quill (she/her/her)
Beatrice's speech is upbeat and bubbly, often punctuated by nervous laughter.
[comfortable] Oh dear, what a predicament! I just need to keep my head down.
[evasive] Well, I wouldn’t want to get in trouble, would I? Let's change the topic.
[stressed] If anyone finds out, I might lose my job, and I can't let that happen!
Humour: Her self-deprecating humor often surfaces in moments of stress.

### Sylvia Trent (she/her/her)
Sylvia has a sharp, incisive tone, often using sarcasm to mask her unease.
[comfortable] After all, who doesn’t love a good scandal? It keeps life interesting.
[evasive] I think we should focus on more pressing matters, don’t you?
[stressed] This could all come crashing down if I’m not careful; I need to be smart.
Humour: Her sardonic humor reflects her cunning nature.

### Hugo Vane (he/him/his)
Hugo speaks in a straightforward manner, often cutting to the chase.
[comfortable] Life’s a gamble, isn’t it? You take risks or you get left behind.
[evasive] I’d rather not discuss my past; it’s best left buried.
[stressed] I can’t let them find out about my debts; I need to keep this under wraps.
Humour: His blunt observations often carry a sardonic edge.

## Location Registers (scene framing guides)

The Grand Lobby: The Grand Lobby radiates an atmosphere of tension and elegance, where whispers abound and secrets linger in the air. Guests engage in hushed conversations, their eyes darting nervously, as the weight of the recent murder casts a shadow over the luxurious surroundings.. Camera angle: The writer should capture the contrast between the opulent decor and the underlying tensions, highlighting the layers of deception at play.. Era: The lobby serves as both a gathering space and a stage for intrigue amidst the backdrop of societal change.

The Oceanview Dining Room: The Oceanview Dining Room is filled with an air of sophistication, yet tension simmers beneath the surface as guests share polite conversation amidst unspoken fears. The stunning views of the tumultuous sea serve as a reminder of the chaos outside, where danger may lurk.. Camera angle: The writer should convey a sense of elegance juxtaposed with the underlying anxiety present among the diners.. Era: Dining here offers a brief respite from the storm of espionage rumors that circulate outside.

The Hotel Library: The Hotel Library invites visitors into a sanctuary of quiet contemplation, where the scent of old books and whispers of gossip intertwine. It is a space where secrets are kept and stories unfold, echoing the mysteries that permeate the hotel.. Camera angle: The writer should evoke a sense of intimacy and intrigue, emphasizing the library as a refuge where hidden narratives await discovery.. Era: This is a place where guests can escape the pressures of wartime uncertainties and lose themselves in the world of literature.

The Rooftop Terrace: The Rooftop Terrace provides a breathtaking view of the ocean, where laughter mingles with the roar of waves. Yet, as the sky darkens, a sense of foreboding creeps in, reflecting the secrets that threaten to surface amidst the beauty.. Camera angle: The writer should capture the contrast between the stunning vistas and the underlying anxiety, creating a sense of impending doom.. Era: This space becomes a stage for social interactions, where camaraderie is tested against the backdrop of mounting tension.

## Humour guidance for this story position (opening)
Permission: forbidden
Rationale: The tone is too serious as a murder has just occurred.

FAIR-PLAY AND INFERENCE CONTRACT:
- FAIR PLAY CLUE TIMING: Never combine clue discovery and detective deduction in the same chapter. If a clue is first revealed to the reader in chapter N, the detective may only analyze, deduce from, or act on that clue in chapter N+1 or later.
- FAIR PLAY INFORMATION PARITY: The reader must see all clues BEFORE the detective uses them in reasoning. If the detective performs a test or makes a deduction, every piece of evidence supporting that conclusion must have been shown to the reader in earlier chapters.
- FAIR PLAY REVELATION SPACING: In the discriminating test scene, the detective can ONLY use clues that were revealed to the reader at least 1 full chapter earlier. Never introduce new clues or withheld information during the test.
- FAIR PLAY CONFRONTATION: During the final confrontation/revelation, the detective cannot surprise the reader with facts. Every piece of evidence cited must have been visible to the reader in prior chapters.
- Never solve by withheld information. Keep reader-information parity with detective reasoning.
- False assumption in force: Captain Hale was attending the official event at the time of the murder.
- Hidden truth to progressively expose (compose in your own words from these elements): manipulation, event, schedule, create, alibi
- Inference path checkpoints to dramatize clearly — compose ENTIRELY in your own sentences from these key terms (reproducing any briefing phrase verbatim FAILS validation):
  - Step 1: obs: witnesses, recall, seeing, captain, hale, entering, event, room, shortly, before, murder | corr: contradicts, claim, attending, event | effect: narrows, suspect, pool, eliminate, mallory, finch
  - Step 2: obs: handwritten, note, altering, event, schedule, hale, room | corr: indicates, hale, manipulated, schedule, create, alibi | effect: eliminates, possibility, hale, truly, event
  - Step 3: obs: fabric, matching, hale, uniform, discovered, crime, scene | corr: connects, hale, directly, murder, scene | effect: eliminates, captain, hale, alibi, regarding, presence
- Discriminating test method: trap
- Discriminating test elements to dramatize (compose ENTIRELY in your own sentences from these — do NOT reproduce any briefing phrase verbatim): reenact, witnesses, accounts, hale, alibi, coordinating, testimonies, altered, schedule, timings
- Test must rely on already-shown clue IDs: clue_10, clue_3, clue_4
- Fair-play rationale: Step 1: Witness statements about Hale's entry (early) and the event schedule (mid) help eliminate Dr. Mallory Finch. Step 2: The altered schedule note (mid) reveals Hale's manipulation. Step 3: Fabric evidence (late) confirms Hale's presence at the crime scene.

## Character Reference

### Eleanor Voss (she/her — NEVER he/him)
Speaks with a fluid, engaging rhythm, often using rhetorical questions to draw in her audience
Her dialogue is peppered with literary references, revealing her background and intellect.
Eleanor grapples with feelings of inadequacy, haunted by her brother's death and driven to find justice not just for him, but for herself.
Voice colour: Eleanor Voss uses dry wit humour — let it surface in their dialogue where natural, not in every line.

### Captain Ivor Hale (he/him — NEVER she/her)
Speaks in a booming voice, often laced with military jargon
His dialogue is punctuated by self-deprecating remarks that reveal a hidden vulnerability beneath his hardened exterior.
Captain Hale battles with PTSD and the fear of being exposed, struggling to reconcile his public persona with the man he truly is.
Voice colour: Captain Ivor Hale uses self deprecating humour — let it surface in their dialogue where natural, not in every line.

### Beatrice Quill (she/her — NEVER he/him)
Speaks in an upbeat, bubbly manner, often using exclamations and informal language
Her speech is punctuated by nervous laughter, reflecting her anxiety about her secrets.
Beatrice struggles with guilt over her embezzlement, torn between her desire for financial security and the fear of losing her job.
Voice colour: Beatrice Quill uses self deprecating humour — let it surface in their dialogue where natural, not in every line.

### Sylvia Trent (she/her — NEVER he/him)
Speaks with a sharp, incisive tone, often using sarcasm to mask her unease
Her dialogue is laced with clever wordplay, reflecting her cunning nature.
Sylvia grapples with the moral implications of her actions, fearing that exposure could lead to the collapse of her empire and the loss of her carefully curated identity.
Voice colour: Sylvia Trent uses sardonic humour — let it surface in their dialogue where natural, not in every line.

### Hugo Vane (he/him — NEVER she/her)
Speaks in a straightforward, no-nonsense manner, often cutting to the chase
His dialogue is peppered with blunt observations that reveal his cynical worldview.
Hugo grapples with the consequences of his reckless behavior and the impact of his choices on his professional integrity and financial stability.
Voice colour: Hugo Vane uses blunt humour — let it surface in their dialogue where natural, not in every line.


## CHARACTER CONTRACTS (binding for this scene)
Each entry below constrains how this character must be written in this chapter.
These override generic style guidance when they conflict.

### Eleanor Voss[SHE]
Voice & mannerisms: Speaks with a fluid, engaging rhythm, often using rhetorical questions to draw in her audience. Her dialogue is peppered with literary references, revealing her background and intellect.
SIGNATURE TIC (use sparingly — this is Eleanor Voss's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "Ah, but isn't that the question of the hour?"
Sample voice fragments (match this register and rhythm):
  [comfortable] "Ah, but isn't that the question of the hour? It seems the truth is always a little slippery."
  [evasive] "Well, I suppose everyone has their secrets, don't they? It's not my place to pry."
Humour: dry wit — deploy occasionally (level 0.6)
FORBIDDEN phrase (never write for Eleanor Voss): "a surge of determination washed over her"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Not directly tied to the murder but driven by a personal quest for justice." — do not surface in Act I.

### Captain Ivor Hale[HE]
Voice & mannerisms: Speaks in a booming voice, often laced with military jargon. His dialogue is punctuated by self-deprecating remarks that reveal a hidden vulnerability beneath his hardened exterior.
SIGNATURE TIC (use sparingly — this is Captain Ivor Hale's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "Well, that's the rub, isn't it?"
Sample voice fragments (match this register and rhythm):
  [comfortable] "Well, that's the rub, isn't it? War does strange things to a man."
  [evasive] "I don’t see how my past is relevant to this discussion; let's focus on the present."
Humour: self deprecating — deploy occasionally (level 0.4)
FORBIDDEN phrase (never write for Captain Ivor Hale): "she knew with certainty she was right"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Fears that the victim might reveal details of his past that would undermine his public image." — do not surface in Act I.

### Beatrice Quill[SHE]
Voice & mannerisms: Speaks in an upbeat, bubbly manner, often using exclamations and informal language. Her speech is punctuated by nervous laughter, reflecting her anxiety about her secrets.
SIGNATURE TIC (use sparingly — this is Beatrice Quill's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "Oh dear, what a predicament!"
Sample voice fragments (match this register and rhythm):
  [comfortable] "Oh dear, what a predicament! I just need to keep my head down."
  [evasive] "Well, I wouldn’t want to get in trouble, would I? Let's change the topic."
Humour: self deprecating — deploy occasionally (level 0.5)
FORBIDDEN phrase (never write for Beatrice Quill): "she knew with certainty she was right"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Could be implicated if discovered, as the victim threatened to report her." — do not surface in Act I.

### Sylvia Trent[SHE]
Voice & mannerisms: Speaks with a sharp, incisive tone, often using sarcasm to mask her unease. Her dialogue is laced with clever wordplay, reflecting her cunning nature.
SIGNATURE TIC (use sparingly — this is Sylvia Trent's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "After all, who doesn’t love a good scandal?"
Sample voice fragments (match this register and rhythm):
  [comfortable] "After all, who doesn’t love a good scandal? It keeps life interesting."
  [evasive] "I think we should focus on more pressing matters, don’t you?"
Humour: sardonic — deploy frequently (level 0.7)
FORBIDDEN phrase (never write for Sylvia Trent): "palpable tension filled the room"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "The victim discovered her scheme and threatened to expose her unless she paid him off." — do not surface in Act I.

### Hugo Vane[HE]
Voice & mannerisms: Speaks in a straightforward, no-nonsense manner, often cutting to the chase. His dialogue is peppered with blunt observations that reveal his cynical worldview.
SIGNATURE TIC (use sparingly — this is Hugo Vane's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "Life’s a gamble, isn’t it?"
Sample voice fragments (match this register and rhythm):
  [comfortable] "Life’s a gamble, isn’t it? You take risks or you get left behind."
  [evasive] "I’d rather not discuss my past; it’s best left buried."
Humour: blunt — deploy occasionally (level 0.5)
FORBIDDEN phrase (never write for Hugo Vane): "she chose her words with great care"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "The victim was a previous client who caught wind of Hugo's unethical practices." — do not surface in Act I.



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

Primary Location: The Azure Crest Hotel (Brighton, England)
A grand seaside hotel with art deco elegance, overlooking the turbulent English Channel.

Key Locations Available:
- The Grand Lobby (interior): Gathering space, first impression
- The Oceanview Dining Room (interior): Dining and socializing space
- The Hotel Library (interior): Quiet reading and contemplation space
- The Rooftop Terrace (exterior): Outdoor gathering and observation space

Atmosphere (tonal cue only — do NOT reproduce this phrase verbatim in prose; translate into scene-specific, character-observed sensory language): tense and suspenseful, heightened by recent local rumors of espionage
Weather: overcast with occasional sea breezes and the smell of salt in the air

Era markers: manual typewriters in the lobby | early radio broadcasts in lounge | rationed fuel limiting travel

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
The Grand Lobby (interior):
  - Visual: gleaming marble floors, ornate art deco chandeliers, nautical-themed murals
  - Sounds: soft murmurs of conversation, clinking of glasses, distant waves crashing
  - Scents: freshly brewed coffee, salt in the air, polished wood
  - Touch: cool marble underfoot, soft fabric of armchairs

The Oceanview Dining Room (interior):
  - Visual: expansive ocean views, elegantly set tables, polished silverware glinting
  - Sounds: clinking of cutlery, soft music from a gramophone, laughter echoing
  - Scents: freshly baked bread, grilled fish, butter and herbs
  - Touch: smooth tablecloths, cool glassware

The Hotel Library (interior):
  - Visual: rows of leather-bound books, faded armchairs, dimly lit corners
  - Sounds: soft rustle of pages, distant whispers, the creak of old wood
  - Scents: old paper and leather, wood polish, the scent of tobacco
  - Touch: worn leather armchair, smooth pages of books

⛔ REFERENCE DATA — DO NOT TRANSCRIBE VERBATIM: The above profiles are structural guides only. Generate original prose that evokes these qualities; do not reproduce the exact phrasing or sentence structure of the profile paragraphs.

SCENE OPENING RULE: When opening a scene in a new location, write what the POV character directly observes and physically senses at that moment — not a general description of the room's qualities. The reader must feel present, not briefed. Sensory details must be observed by the character, not stated as fact about the place.

SENSORY WRITING TECHNIQUES:
- Opening paragraphs: Lead with 2-3 sensory details to ground the scene
- Movement b
[truncated for prompt budget]

## Texture Pool
Draw on these as opportunities arise — you are not required to use them.

- November 1941 casts a heavy shadow over the world, where the specter of war looms larger than life
- The air is filled with the scent of salt from the nearby sea, and the sky is often overcast, reflecting the uncertainty of the times
- People gather in cafes, discussing the latest news of escalating tensions abroad, while the clatter of typewriters fills the hotel lobbies, as journalists race to report on the unfolding drama
- With Thanksgiving approaching, the community buzzes with preparations, but the underlying fear of espionage hangs thick in the air, creating an atmosphere ripe for secrets and intrigue.

TEMPORAL CONTEXT:

This story takes place in November 1941 during N/A.

Seasonal Atmosphere:
- Weather patterns: overcast skies with sporadic drizzle, cool sea breezes carrying the scent of salt, occasional bursts of sunshine breaking through the clouds
- Daylight: Short days with twilight settling in around four o'clock in the afternoon
- Seasonal activities: gathering for seasonal fairs and local markets, attending lectures or political debates at community centers, enjoying warm drinks in cafés as the temperatures drop
- Seasonal occasions: Thanksgiving preparations begin, celebrated on the fourth Thursday of November
- Season: N/A

Period Fashion (describe naturally):
- Men formal: double-breasted wool suits in dark colors, crisp white dress shirts with high collars, silk ties in muted tones or subtle patterns
- Men casual: tweed jackets with elbow patches, corduroy pants in earth tones, knit sweaters worn over collared shirts
- Men accessories: fedora hats or flat caps, leather gloves, pocket watches
- Women formal: elegant tea-length dresses with fitted waists, long-sleeve blouses with high necklines, fur-trimmed coats for evening wear
- Women casual: A-line skirts paired with fitted cardigans, simple blouses in floral patterns, tailored trousers for a more practical look
- Women accessories: string of pearls or simple gold chains, felt hats with decorative ribbons, stylish gloves

Cultural Context (reference naturally):
- Music/entertainment: Duke Ellington's 'Take the 'A' Train', Bing Crosby's renditions of classic tunes, Glenn Miller's big band sound gaining popularity; Films: The Maltese Falcon released in October 1941, Citizen Kane, an innovative cinematic masterpiece; Theatre: Oklahoma!, a groundbreaking musical, The Glass Menagerie, showcasing family dynamics; Radio: The Shadow, a crime drama captivating audiences, Fireside Chats by President Roosevelt connecting with citizens
- Typical prices: Loaf of bread: four pence, A pound of butter: one shilling, A movie ticket: one shilling sixpence
- Current events: The attack on Pearl Harbor on December 7, 1941, looming on the horizon; Increased military enlistment and preparation for war
- Literature: The Thin Man by Dashiell Hammett | The Postman Always Rings Twice by James M. Cain | The Grapes of Wrath by John Steinbeck | [detective fiction and noir] | [historical novels set during wartime] | [romance reflecting the changing social dynamics]
- Technology: The first electronic computer prototype begins development | Advancements in radio technology for clearer broadcasts | Early models of television sets becoming available | Radios as a staple in most households | Manual typewriters for correspondence and work | Basic electrical appliances such as toasters and refrigerators
- Daily life: Attending community meetings or local gatherings, Participating in wartime efforts through volunteering, Gathering for family dinners as a social ritual
- Social rituals: Evening gatherings for games and socializing, Participating in church services or community events, Sharing news and stories over coffee at local cafés

Atmospheric Details:
The crisp air carries the briny scent of the nearby sea, mixing with the aromas of roasted chestnuts from street vendors. The muted sounds of jazz waft through the air, punctuated by the distant clatter of typewriters as patrons busy
[truncated for prompt budget]

NON-NEGOTIABLE CHAPTER OBLIGATIONS — LOCKED EVIDENCE VALUES (VERBATIM REQUIRED):
The following measured values (times, amounts, measurements) are absolute ground truth. Every time this chapter describes, mentions, or alludes to one — no matter how briefly — it MUST use the exact phrase shown below, character for character. NO paraphrase, approximation, rounding, or synonym is permitted.

FAILURE EXAMPLE: if the locked value is "at thirteen minutes to midnight" and you write "just before midnight" or "around midnight" — that is a HARD FAIL. You must write "at thirteen minutes to midnight". Equally, if the locked value is written in words, such as "ten minutes past eleven", and you convert it to figure-based clock notation — that is also a HARD FAIL. Words stay as words; figure forms are forbidden for word-phrased facts.

CRITICAL — WORD-PHRASED VALUES: If the canonical value is written out in words (e.g. a time like "ten minutes past eleven", or an amount like "forty minutes"), reproduce those exact words. DO NOT convert to figure-based time notation, twenty-four-hour format, or any other numeric shorthand. Correct: "ten minutes past eleven". WRONG: figure-based clock notation or numeric shorthand.

Locked values:
  - Two guests were seen wearing identical clothing just before the incident.: "two identical outfits"
  - The clock in the lobby showed a different time than noted by witnesses.: "ten minutes past eleven"
    ⛔ FORBIDDEN alternatives: "11:10", "11.10", "eleven ten", "eleven-ten", "eleven past ten", "quarter past eleven", "half past eleven" — the ONLY acceptable form is "ten minutes past eleven"

If a value has no relevance to this chapter, omit it. But the moment you reference the underlying evidence, only the exact phrase above is acceptable.

EVIDENCE TO CONVEY IN YOUR OWN WORDS (NOT verbatim): weave each of these descriptive facts into the chapter as a COMPLETE, GRAMMATICAL observation by a character — surface the MEANING, never copy the phrasing word-for-word, and NEVER splice two evidence phrases together with an apostrophe or run two clauses together without a sentence break. If a fact has no relevance to this chapter, omit it.
  - A piece of fabric that matched the costumes was located close to where the murder occurred.: the fabric was found near the scene

⛔ CLUES TO SURFACE IN THESE CHAPTERS — mandatory:
The following evidence MUST be clearly observable to an attentive reader. Do not bury it in atmosphere or passing dialogue. Each clue must be concrete, specific, and noticeable:

• [clue_mechanism_visibility_core] witnesses, recall, seeing, captain, hale, entering, event, room, shortly, before, murder
  Category: temporal | Criticality: essential | Supports inference step 1
  Points to: indicates, hale, presence, event

• [clue_mid_3] captain, hale, impersonates, hotel, authority, figure, altering, event, schedule, create, false, alibi
  Category: temporal | Criticality: essential | Supports inference step 1
  Points to: hale, deception, uncovered

For each clue above: an attentive reader should be able to find, record, and later use it to reason toward the solution.

═══ NARRATIVE STATE (read-only — do not contradict) ═══

LOCKED FACTS — use verbatim whenever this evidence is described:
  • Two guests were seen wearing identical clothing just before the incident.: "two identical outfits"
  • A piece of fabric that matched the costumes was located close to where the murder occurred.: "the fabric was found near the scene"
  • The clock in the lobby showed a different time than noted by witnesses.: "ten minutes past eleven"

CHARACTER PRONOUNS — never deviate from these:
  • Eleanor Voss: she/her/her
  • Dr. Mallory Finch: she/her/her
  • Captain Ivor Hale: he/him/his
  • Beatrice Quill: she/her/her
  • Sylvia Trent: she/her/her
  • Hugo Vane: he/him/his

INVESTIGATION LOG — WHAT IS ESTABLISHED (do not re-establish, do not repeat):
• Suspects still unresolved: Beatrice Quill[SHE], Sylvia Trent[SHE], Hugo Vane[HE]
⚠ The story must move FORWARD from this log. Any beat already listed above is forbidden from repeating.

⚠ THIS CHAPTER'S REQUIRED ADVANCE (opening): Discover the body, confirm the victim, establish the scene. The victim is found dead. They do not speak, react, or gesture. This is their only physical appearance — in all subsequent chapters they exist only in past tense (memory, evidence, testimony).
═══════════════════════════════════════════════════════

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
Known location profile anchors: The Azure Crest Hotel, The Grand Lobby, The Oceanview Dining Room, The Hotel Library, The Rooftop Terrace, the scene
LOCATION NAME CAPITALISATION (HARD REQUIREMENT — validated):
All named locations in your prose MUST use the EXACT capitalisation from the CML profiles.
Canonical forms: "The Azure Crest Hotel", "The Grand Lobby", "The Oceanview Dining Room", "The Hotel Library", "The Rooftop Terrace", "the scene"
Writing a location in lowercase (e.g. "drawing room" instead of "Drawing Room") is a validated error. Every time you mention a named location, copy its capitalisation from the list above.
- Chapter 1: OPENING STYLE (HARD): Start the VERY FIRST SENTENCE with a named character performing a physical action or motion — e.g. "[Name] crossed the threshold…" / "[Name] set down the glass…" / "[Name] rose from the chair…". Anchor opening in "the scene". The opening style above governs only your FIRST SENTENCE; the grounding below may land anywhere in the first 2 paragraphs (it need not be sentence one, and never conflicts with the chosen opening style). HARD REQUIREMENT for the first 2 paragraphs: (a) include 2+ sensory words — choose from smell/scent/odor/fragrance/sound/echo/silence/whisper/creak/cold/warm/damp/rough/smooth/glow/shadow/flicker/dim — and (b) include 1+ atmosphere/time word — choose from rain/wind/fog/storm/mist/thunder/evening/morning/night/dawn/dusk/lighting/weather/season/afternoon/midday/noon/midnight/twilight/sunrise/sunset/daylight/sunlight/overcast/cloudy/bright/dark/grey/pale/chill/crisp/drizzle/haze/lamplight/firelight. These are validated requirements, not style suggestions; missing them triggers a retry.

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

PROMPT BUDGET SUMMARY: budget=24000 tokens; fixed=7899; context=12366; dropped=[none]; truncated=[first_appearance_contracts, location_profiles, temporal_context, pronoun_accuracy]

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
- Chapter numbering starts at 1 and increments by 1 per scene.
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
4. Integrate at least two concrete era-grounded details per chapter from setting refinement signals: radio broadcasting | early televisions in lounges | manual typewriters | basic electrical wiring | party-line telephones | telegrams.
5. Respect setting movement/access constraints in scene action and alibis: narrow hallways limiting access to rooms | balconies overlooking the beach | basement storage areas accessible only through service entrances | staff-only areas in the kitchen and maintenance rooms | restricted access to the roof and terrace.
6. Sustain social coherence with this backdrop pressure: A masquerade ball at a grand seaside hotel draws together a diverse group of guests, all under the scrutiny of Cold War tensions and local espionage rumors, creating an atmosphere ripe for deception and intrigue.
7. Maintain continuity around these socially central cast anchors where relevant: Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill, Sylvia Trent, Hugo Vane.
8. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Critical: Plot similarity 0.85 with 'The Second Key' (same impersonation method and era)
9. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Moderate: Character similarity 0.80 with 'The Second Key' (mirrored roles and character dynamics)

CRITICAL PROSE REQUIREMENTS:

The CML specifies exact requirements for certain validation-critical scenes. You MUST include these elements at the specified positions.

**Discriminating Test Scene (Act 3, Scene 4):**
Required elements: Execute the discriminating test, Observe the culprit's reaction or result, Draw conclusion about guilt

**Suspect Clearance Scenes:**
- Beatrice Quill (Act 3, Scene 5): Witness statements place her elsewhere
  Clues: clue_mid_3, clue_late_2
- Sylvia Trent (Act 3, Scene 5): Her duties kept her in another part of the hotel
  Clues: clue_early_2, clue_mid_4
- Hugo Vane (Act 3, Scene 5): Confirmed presence in a meeting
  Clues: clue_early_3, clue_late_3

**Culprit Revelation Scene (Act 3, Scene 6):**
Method: Confrontation with evidence

**Clue Placement for These Chapters:**
- clue_mechanism_visibility_core must appear in Act 1, Scene 1 via Direct observation

**VALIDATION CONSEQUENCE:** If these requirements are not met exactly, story validation will fail and the entire generation will be rejected. Follow these specifications precisely.


## ACTIVE CHAPTER MODE CONTRACT (MANDATORY)
Active chapter mode: Discovery Opening.
Mode required outcomes:
- Victim is named explicitly and the body is encountered within the first two paragraphs.
- Major suspects are introduced with relevance and tension.
- First clue is planted without full mechanism explanation.
Forbidden at this stage:
- No culprit reveal.
- No full murder mechanism explanation.
- Do not state the direction, magnitude, or agent of any clock or device tampering. Characters may only observe that two time sources disagree. "The clock was wound back by forty minutes" must not appear before Chapter 3.
Mode-specific narrative balance targets:
- Setting: 15-20%
- Character Introductions: 35-40%
- Discovery Reactions: 25-30%
- First Clue: 10-15%

## CHAPTER OUTCOME CONTRACT (MANDATORY)
Batch chapters: 1-1.
Investigation state at start: 0 clue(s) revealed to reader; approximately 3 unresolved suspect(s).
Must change by end: Introduce cast relevance and plant first clue while keeping culprit unresolved.
Suspect pressure target(s): Captain Ivor Hale, Beatrice Quill, Hugo Vane, Sylvia Trent
Required new information: First clue observation tied to suspect landscape.
Forbidden reveals at this stage: No culprit reveal. | No full murder mechanism explanation. | Do not state the direction, magnitude, or agent of any clock or device tampering. Characters may only observe that two time sources disagree. "The clock was wound back by forty minutes" must not appear before Chapter 3.

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
- Chapter 1:
  - STRUCTURAL ARCHETYPE — Chapter 1 must be: DISCOVERY
      ✓ MUST contain: body found / victim identified
      ✗ MUST NOT contain: formal accusation or interrogation
  - Word count: Target 1250 words. Achieve this through plot events, dialogue exchanges, and physical investigation — not through atmospheric repetition or extended internal reflection. Each 200-word segment should contain at minimum one concrete story event (a discovery, a conversation exchange, a physical action or movement). Padding with atmosphere alone is not acceptable.
  - VICTIM IDENTITY LOCK (MANDATORY): name the victim as "Dr. Mallory Finch" in the discovery scene. After first mention, do not use unnamed placeholders such as "the victim" without naming Dr. Mallory Finch in the same paragraph.
  - Opening: Begin with a character action, spoken line, or clock/time marker — never a location name or location-description phrase.
  - Scene is set in: the scene — reference it naturally within the paragraph, never as your opening phrase.
  - Opening atmosphere (MANDATORY — validator enforced): the first paragraph MUST contain at least one of: rain / wind / fog / storm / mist / thunder / evening / morning / night / dawn / dusk / season / afternoon / midday / noon / midnight / twilight / sunrise / sunset / daylight / sunlight / overcast / cloudy / bright / dark / grey / pale / cold / warm / chill / crisp / damp / drizzle / haze / lamplight / firelight. A chapter that omits all of these from its opening paragraph will be rejected.
  - PARAGRAPH OPENER DIVERSITY (MANDATORY — validator enforced): No more than 2 paragraphs in this chapter may begin with "Eleanor" or "Eleanor's" as the first word. You must vary paragraph openings throughout: use sensory observations, another character's name or action, dialogue, object or sound details, or temporal markers. Opening 3 or more paragraphs with "Eleanor" will cause automated rejection.
  - INVESTIGATOR ESTABLISHMENT REQUIRED: Eleanor Voss must claim or be recognised as the investigator in this chapter. Establish Eleanor Voss as the detective-in-charge within the first two paragraphs — Eleanor Voss IS the investigator. Do NOT have any character suggest a "real" detective is still coming, or imply that authority has not yet been delegated. Eleanor Voss begins the investigation in this chapter.
  - ⛔ BODY DISCOVERY ORDER (MANDATORY — Chapter 1 only): the victim's body must be physically encountered or described within the first TWO paragraphs. Do NOT spend the opening paragraphs solely on clock examination, atmospheric setup, or character introductions before the body is found. Required Chapter 1 structure: atmosphere (one sentence max) → body/discovery → investigator reaction → suspects → first time-source contradiction.
  - ⛔ MECHANISM SPOILER BAN: Do NOT state how the crime device was manipulated — not the direction, not the magnitude, not who performed it. Characters may only observe that two sources of evidence disagree. The specific method, tamper amount, and perpetrator's action are ALL FORBIDDEN until the reveal. WRONG: "The culprit had altered the device by forty minutes to create a false alibi." RIGHT: "Two independent pieces of evidence gave contradictory readings — a discrepancy neither could yet explain."
  - CLUE OBLIGATIONS — each clue below MUST be dramatized, but in YOUR OWN WORDS:
    Render each as something a character SEES, DOES, or SAYS on the page. The bracketed text is a
    DESCRIPTION of the evidence for you — do NOT transcribe it as narration. Copying a clue's
    description sentence verbatim into the prose FAILS validation.
    • witnesses, report, seeing, captain, hale, enter, event, room [clue_mechanism_visibility_core] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      ⛔ SPOILER EMBARGO (pre-reveal chapter): surface ONLY the surface anomaly a character can see/hear/find.
         Do NOT name who it implicates, state the tamper direction or magnitude, or explain the mechanism in this chapter.
         Present it as an unexplained discrepancy; the culprit and method are revealed later.
         Place this OBSERVATION in paragraph 1 or 2 (observation only — no inference about the culprit).
    • impersonation, hale, actions [clue_mid_3] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: hale, deception, uncovered
      ↳ MANDATORY TWO-PARAGRAPH STRUCTURE (must appear in paragraphs 1 or 2 — no later):
         Paragraph 1: The POV character physically approaches or directly observes this evidence.
           The narration or dialogue explicitly states what is seen (use the exact locked phrase if one applies).
         Paragraph 2 (immediately following): The detective or POV character explicitly reasons
           about what this evidence implies — who it implicates, why it may be unreliable,
           or what inference it supports. This must be a separate full paragraph, not a sentence appended to Paragraph 1.
  - Tonal contrast: include at least one beat of relief or ironic counterpoint. Do not sustain maximum tension for every paragraph.
  - CLUE DISCLOSURE RULE (Stage 1/4):
    Characters may OBSERVE anomalies (wrong time, missing object, odd detail) but must NOT explain the mechanism, deduce the method, or name the culprit. Discovery and reaction only.
    WRONG: dialogue or narration that directly explains how the crime was committed before Stage 4.
    RIGHT: observation, physical reaction, and logical inference that leaves the mechanism just off-screen.
  - ALIBI LOCK: Captain Ivor Hale's established alibi is "narrow". Do NOT place Captain Ivor Hale at any other location or in any other activity during the crime window. Any contradiction is a continuity error that triggers a retry.
- Locked fact phrase obligations:
  - If this batch mentions Two guests were seen wearing identical clothing just before the incident., write exactly: "two identical outfits".
  - If this batch mentions A piece of fabric that matched the costumes was located close to where the murder occurred., write exactly: "the fabric was found near the scene".
  - If this batch mentions The clock in the lobby showed a different time than noted by witnesses., write exactly: "ten minutes past eleven".
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
Batch chapters: 1-1.
Investigation state at start: 0 clue(s) revealed to reader; approximately 3 unresolved suspect(s).
Must change by end: Introduce cast relevance and plant first clue while keeping culprit unresolved.
Suspect pressure target(s): Captain Ivor Hale, Beatrice Quill, Hugo Vane, Sylvia Trent
Required new information: First clue observation tied to suspect landscape.
Forbidden reveals at this stage: No culprit reveal. | No full murder mechanism explanation. | Do not state the direction, magnitude, or agent of any clock or device tampering. Characters may only observe that two time sources disagree. "The clock was wound back by forty minutes" must not appear before Chapter 3.

FROZEN FACT STATE (DO NOT ALTER):
- Timeline anchor: November (autumn).
- Month, season, weather, and time-of-year language in this batch must stay compatible with autumn.
- Established timeline fact: Event schedule
- Established timeline fact: Murder time
- If referenced, use exact phrase: "two identical outfits" (Two guests were seen wearing identical clothing just before the incident.).
- If referenced, use exact phrase: "the fabric was found near the scene" (A piece of fabric that matched the costumes was located close to where the murder occurred.).
- If referenced, use exact phrase: "ten minutes past eleven" (The clock in the lobby showed a different time than noted by witnesses.).

STORY TO DATE (REFERENCE ONLY — DO NOT COPY VERBATIM):
- No previous chapter text exists yet for this batch.

[SCENE COMPLETENESS CONTRACTS — MANDATORY. Each contract below lists what you MUST enact in that chapter. Do not summarise or mention these labels in the prose — enact them organically.]
Chapter 1 (Act 1) completeness contract:
  PIVOT ELEMENT (MANDATORY — write this into the prose, shown not told): "The stopped clock found in the room, indicating ten minutes past eleven."
  FACT ESTABLISHED (MANDATORY — reader must know this by chapter end): "Establishes the victim died no later than eleven past eleven, contradicting three suspects' alibis."

# Case Overview
Title: The Masquerade of Authority
Era: 1940s
Setting: Seaside Hotel
Crime: murder (impersonation)
Culprit: Captain Ivor Hale
Victim: Dr. Mallory Finch
False assumption: Captain Hale was attending the official event at the time of the murder.
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
    "sceneNumber": 1,
    "act": 1,
    "title": "Discovery",
    "setting": {
      "location": "the scene",
      "timeOfDay": "Morning after the murder",
      "atmosphere": "Tense household awaiting the detective's arrival"
    },
    "characters": [
      "Eleanor Voss",
      "Captain Ivor Hale",
      "Beatrice Quill",
      "Hugo Vane",
      "Dr. Mallory Finch",
      "Sylvia Trent"
    ],
    "purpose": "Introduce the crime and detective",
    "cluesRevealed": [
      "clue_mechanism_visibility_core",
      "clue_mid_3"
    ],
    "dramaticElements": {
      "conflict": "Locked room mystery established",
      "tension": "Every suspect had access to the victim.",
      "microMomentBeats": [
        "Eleanor pauses, her heart racing as she steps into the room, the air thick with unspoken fear."
      ]
    },
    "summary": "Eleanor Voss arrives at the seaside hotel, where she discovers the body of an unknown victim in a locked room. The atmosphere is tense as she processes the scene, noting the conflicting accounts of the suspects present. The first contradiction arises as she finds the clock showing ten minutes past eleven, conflicting with the timeline of the suspects.",
    "beat": "gathering",
    "estimatedWordCount": 1800,
    "pivotElement": "The stopped clock found in the room, indicating ten minutes past eleven.",
    "factEstablished": "Establishes the victim died no later than eleven past eleven, contradicting three suspects' alibis.",
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
        "characterName": "Hugo Vane",
        "behaviour": "Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted."
      },
      {
        "characterName": "Dr. Mallory Finch",
        "behaviour": "Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted."
      },
      {
        "characterName": "Sylvia Trent",
        "behaviour": "Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted."
      }
    ],
    "redHerringPlacement": null,
    "emotionalRegister": "The atmosphere is one of luxurious anticipation, overshadowed by an undercurrent of tension.",
    "dominantCharacterNote": {
      "name": "Eleanor Voss",
      "voiceRegister": "Eleanor speaks with a fluid, engaging rhythm, often infusing her dialogue with literary references."
    },
    "humourGuidance": {
      "permission": "forbidden"
    },
    "eraTextureNote": "Rationing of goods limits availability of food and clothing.; Travel is restricted due to fuel shortages.; Communication is often delayed due to wartime censorship.",
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
□ Chapter 1: the clue [clue_mechanism_visibility_core] (witnesses, recall, seeing, captain, hale, entering, event, room, shortly, before, murder) is placed in the first 25% of the chapter, dramatized in your own words, followed by an explicit inference or suspicion paragraph.
□ Chapter 1: the clue [clue_mid_3] (captain, hale, impersonates, hotel, authority, figure, altering, event, schedule, create, false, alibi) is placed in the first 25% of the chapter, dramatized in your own words, followed by an explicit inference or suspicion paragraph.
□ Mode check (Discovery/Opening): victim is explicitly named and major suspects are introduced before deep mechanism explanation.
□ Mode check (Discovery/Opening): no culprit reveal and no full murder mechanism explanation.
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
