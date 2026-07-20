# Actual Prompt Record

- Run ID: `mystery-1784584788539`
- Project ID: ``
- Timestamp: `2026-07-20T22:05:31.962Z`
- Agent: `Agent9-ProseGenerator-Ch1`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4.1`
- Temperature: `0.42`
- Max Tokens: `4500`
- Attempt: `first`
- Prompt Hash: `97e12c5cba3e2f2d`

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
- MORAL COMPLEXITY REQUIREMENT: The mechanism of this crime carries a moral gray area: "The murderer felt justified in their actions, believing they were avenging a wrong done to them by the victim." — the culprit reveal and denouement MUST acknowledge this ambiguity. Do not let the ending feel clean or simple. Give the reader at least one moment of uncomfortable sympathy or moral doubt.

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
   - Captain Ivor Hale: Bitter Veteran
   - Beatrice Quill: Envious Employee
   - Sylvia Trent: Manipulative Insider
   - Hugo Vane: Ambitious Outsider
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
  Public identity anchor: Local Journalist; detective 
  Connection to victim: Eleanor once interviewed Mallory for an article, but their differing views on mental health created tension.; Eleanor and Mallory share a history of conflict over the portrayal of veterans' mental health..
  Investigation relevance: is actively driving interviews and credibility checks in this scene.
  Suspicion/pressure cue seed: Solving the case to clear her own name..
  Investigator read: include one immediate observational inference (gesture, gaze target, pause, object grip), but do not state guilt as fact.

- Hugo Vane
  Public identity anchor: Hotel Manager; suspect 
  Connection to victim: Mallory questions Hugo's integrity regarding hotel finances.; Mallory has confronted Hugo about his financial dealings with veterans..
  Investigation relevance: access plausibility: high | alibi window: during the party.
  Suspicion/pressure cue seed: Maintaining his business reputation..
  Investigator read: include one immediate observational inference (gesture, gaze target, pause, object grip), but do not state guilt as fact.

- Captain Ivor Hale
  Public identity anchor: Retired Naval Officer; suspect 
  Connection to victim: Mallory has treated several of Ivor's friends, creating a bond of trust.; They have collaborated on community programs for veterans..
  Investigation relevance: access plausibility: medium | alibi window: during the party.
  Suspicion/pressure cue seed: Fear of being judged by others..
  Investigator read: include one immediate observational inference (gesture, gaze target, pause, object grip), but do not state guilt as fact.

- Beatrice Quill
  Public identity anchor: Sales Clerk; suspect 
  Connection to victim: Mal
[truncated for prompt budget]

WORLD DOCUMENT (use this as your primary creative context):

## Era: 1943-04
In April 1943, the atmosphere in England is laden with the weight of war. As the Allies push forward in North Africa, the everyday life of civilians is deeply affected by rationing and the looming uncertainties of the future. The overcast skies mirror the collective mood of tension, where the echoes of wartime sacrifices are felt in every corner of society. People grapple with the personal toll of loss—whether through the absence of loved ones at the front or the haunting memories of battles fought. Social gatherings are often tinged with an underlying anxiety, as trust and alliances shift amid the pressures of survival. The experience of attending events becomes a delicate dance, where the need for camaraderie clashes with the unease of hidden truths.
Emotional register: The dominant emotional state is one of anxiety and uncertainty, as hope battles against despair.
Physical constraints: Limited transportation options due to wartime rationing and fuel shortages. | Strict curfews in many areas to maintain security. | Communication delays arising from military operations and censorship.
Current tensions (weave into background texture): Rationing continues to strain daily life, affecting food and clothing availability. | The specter of war looms large as news from the front lines remains grim. | Communities face increasing pressure to support the war effort through various drives and initiatives.
Wartime context — Many veterans are returning home, grappling with their experiences.: The community is tightly knit, with shared struggles fostering both solidarity and tension. Absence effect: Family members' absence creates a vacuum that amplifies feelings of loss and worry.

## Story Theme
The pursuit of truth amid personal betrayal reveals the fragility of human relationships in a time of turmoil, and reveals that evidence carries ethical weight, forcing characters to choose accountability over social performance when appearances and facts collide.

## Story Emotional Register
Dominant: The story navigates a complex emotional landscape, blending intrigue with personal stakes.

Arc:
As the sun sets over the Ocean Crest Hotel, an air of anticipation hangs thick in the grand lobby, where the guests gather for an evening of socializing. Yet, the weight of an unthinkable crime lingers in the air—the body of Dr. Mallory Finch discovered in her room, strangled. This shocking revelation sends ripples of unease through the gathering, and for Eleanor Voss, the keen-witted journalist, the stakes are deeply personal. Haunted by her past with the victim, she senses a mix of duty and emotional turmoil as she steps into the role of investigator.

As Eleanor delves into the intricacies of the case, she uncovers a web of hidden identities and personal conflicts, each clue leading her deeper into a labyrinth of deception. Initial leads prove misleading, and the emotional toll of the investigation weighs heavily on her, leaving her questioning her motives and the truth behind the facade of the hotel’s guests. A pivotal moment occurs when she discovers an accomplice, disguised as one of the suspects, altering the course of her investigation. This revelation shifts her focus and forces her to confront the ghosts of her past, recontextualizing her memories of the victim. As the investigation intensifies, the pressure mounts, leading to a climactic confrontation where Eleanor must face not only the suspect but also her own buried emotions. The resolution unfolds as the truth comes to light, but it carries a heavy emotional cost for each character involved, leaving Eleanor and the others to grapple with the consequences of their actions and the fragility of the relationships formed under the specter of war.

## Emotional register at this point in the story
The atmosphere is steeped in anticipation, shadowed by the weight of a recent tragedy.

## Character Portraits (appearance & era)

### Eleanor Voss
Eleanor Voss embodies the shifting landscape of women's roles in the wartime era, navigating the complexities of journalism with a personal stake in the investigation. As a woman in a male-dominated field, she faces the dual challenge of proving her worth while reconciling her past with the victim.
Era intersection: Her private conflict with the victim adds depth to her role as a journalist, reflecting the personal stakes of a society in turmoil.

### Captain Ivor Hale
Captain Ivor Hale embodies the struggle between honor and the fallout from past scandals, revealing the emotional scars borne by veterans. His quest for redemption mirrors the societal desire to restore dignity amid the chaos of war.
Era intersection: His story intersects with the growing recognition of the psychological toll of war on servicemen and the legacy of their sacrifices.

### Beatrice Quill
Beatrice Quill navigates the social hierarchy of the hotel, reflecting the changing dynamics of class and ambition in a wartime society. Her desire for upward mobility showcases the struggles women face as they seek to redefine their identities in a challenging environment.
Era intersection: Her ambition and secrecy highlight the sacrifices many are willing to make for stability in a time fraught with uncertainty.

### Sylvia Trent
Sylvia Trent epitomizes the glamorous yet precarious existence of socialites during this period. Her involvement in manipulation reflects the moral ambiguities faced by individuals trying to maintain their status amid the fallout of war.
Era intersection: Her actions reveal the societal pressures that compel people to guard their reputations fiercely in a world where trust is eroding.

### Hugo Vane
Hugo Vane's character illustrates the complexities of ambition in a time of moral compromise. His financial misdeeds highlight the darker side of the hospitality industry during the war, where survival often comes at a cost.
Era intersection: His struggle with deception mirrors the broader narrative of societal values shifting under the strain of wartime ethics.

## Character Voices

### Eleanor Voss (she/her/her)
Eleanor speaks with a sharp, incisive tone, often layered with a touch of sardonic wit.
[comfortable] The truth is a slippery fish, isn't it? I always find it lurking just out of reach.
[evasive] I was merely observing, taking notes, you know. Nothing sinister about that.
[stressed] I can't shake the feeling that my past is haunting me; every corner I turn, it seems to follow.
Humour: Her dry wit often surfaces, making her observations both insightful and pointed.

### Captain Ivor Hale (he/him/his)
Ivor's voice is gravelly, often tinged with a hint of regret, reflecting his turbulent past.
[comfortable] A sailor's life is never dull; there's always a storm brewing somewhere.
[evasive] I was merely taking a walk; the beach has always been my refuge.
[stressed] The past haunts me; I can't escape the choices I've made.
Humour: His self-deprecating humor serves as a shield against his deeper emotions.

### Beatrice Quill (she/her/her)
Beatrice's lively tone often conceals her insecurities, making her sound charming yet theatrical.
[comfortable] Life is a stage, darling! We all play our parts, don't we?
[evasive] I was simply mingling; it’s what one does at these gatherings.
[stressed] What if they discover my secrets? I can’t afford to lose everything!
Humour: Her sardonic remarks often lighten the atmosphere, even in moments of tension.

### Sylvia Trent (she/her/her)
Sylvia's voice flows with elegance, masking her manipulative tendencies beneath a veneer of charm.
[comfortable] Ah, the price of social grace is steep, isn't it? But worth every penny.
[evasive] I was simply attending to matters of the heart, nothing to be alarmed about.
[stressed] This is a precarious game, and I may very well lose it all.
Humour: Her polite savagery adds a layer of complexity to her character.

### Hugo Vane (he/him/his)
Hugo's smooth, persuasive tone masks his anxiety, often employing anecdotes to divert attention.
[comfortable] In the world of hospitality, every detail matters, wouldn't you agree?
[evasive] I was overseeing the staff; it’s crucial to maintain standards, after all.
[stressed] I fear the walls are closing in; I can't let them discover my missteps.
Humour: His observational humor provides a façade of confidence during tense moments.

## Location Registers (scene framing guides)

Grand Lobby: The Grand Lobby feels both inviting and foreboding, a space where elegance is tinged with anxiety, echoing the secrets shared in hushed tones.. Camera angle: Entering this space, the writer should capture the contrast between beauty and underlying tension.. Era: The war has heightened the sense of surveillance among guests, making every interaction feel loaded.

Dining Area: In the Dining Area, the atmosphere is thick with anticipation, as the scent of delectable dishes competes with the tension of hidden truths among patrons.. Camera angle: The writer should focus on the interplay of light and shadow, highlighting the dichotomy of opulence and unease.. Era: The fine dining experience is juxtaposed with the grim realities of wartime rationing.

Guest Rooms: The Guest Rooms offer a sanctuary that feels simultaneously cozy and isolating, where the sound of waves serves as a constant reminder of the outside world's chaos.. Camera angle: The writer should evoke a sense of intimacy, contrasting it with the looming sense of dread.. Era: The rooms, once a refuge, now hold the weight of unspoken fears and secrets.

Kitchen: The Kitchen buzzes with energy but is laced with an undercurrent of pressure, where every meal prepared carries the burden of expectations.. Camera angle: The writer should capture the chaotic harmony of the kitchen, emphasizing the contrast between nourishment and tension.. Era: The kitchen's frantic pace reflects the urgency of wartime demands, where perfection is crucial.

## Humour guidance for this story position (opening)
Permission: forbidden
Rationale: The gravity of the crime requires a serious tone.

FAIR-PLAY AND INFERENCE CONTRACT:
- FAIR PLAY CLUE TIMING: Never combine clue discovery and detective deduction in the same chapter. If a clue is first revealed to the reader in chapter N, the detective may only analyze, deduce from, or act on that clue in chapter N+1 or later.
- FAIR PLAY INFORMATION PARITY: The reader must see all clues BEFORE the detective uses them in reasoning. If the detective performs a test or makes a deduction, every piece of evidence supporting that conclusion must have been shown to the reader in earlier chapters.
- FAIR PLAY REVELATION SPACING: In the discriminating test scene, the detective can ONLY use clues that were revealed to the reader at least 1 full chapter earlier. Never introduce new clues or withheld information during the test.
- FAIR PLAY CONFRONTATION: During the final confrontation/revelation, the detective cannot surprise the reader with facts. Every piece of evidence cited must have been visible to the reader in prior chapters.
- Never solve by withheld information. Keep reader-information parity with detective reasoning.
- False assumption in force: Hugo Vane was at the party the entire time, as confirmed by multiple witnesses.
- Hidden truth to progressively expose (compose in your own words from these elements): fact, used, accomplice, impersonate
- Inference path checkpoints to dramatize clearly — compose ENTIRELY in your own sentences from these key terms (reproducing any briefing phrase verbatim FAILS validation):
  - Step 1: obs: witnesses, reported, seeing, hugo, vane, party, throughout, evening | corr: timeline, events, contradicts, possibility, hugo, being, present, murder, scene | effect: narrows, suspect, pool, exclude, hugo, vane
  - Step 2: obs: accomplice, seen, leaving, hotel, shortly, murder | corr: accomplice, presence, indicates, hugo, party, claimed | effect: eliminates, assumption, hugo, presence, time, murder
  - Step 3: obs: distinctive, piece, jewelry, belonging, hugo, near, victim | corr: jewelry, connects, hugo, crime, scene, despite, alibi | effect: narrows, investigation, back, hugo, vane
- Discriminating test method: trap
- Discriminating test elements to dramatize (compose ENTIRELY in your own sentences from these — do NOT reproduce any briefing phrase verbatim): discriminating, compares, accomplice, witnes, witness, claimed, timeline
- Test must rely on already-shown clue IDs: clue_1, clue_7, clue_culprit_direct_1
- Fair-play rationale: Step 1: Witness reports establish the false timeline. Step 2: Accomplice presence eliminates Hugo's alibi. Step 3: Jewelry connects Hugo to the murder.

## Character Reference

### Eleanor Voss (she/her — NEVER he/him)
Eleanor speaks with a precise cadence, often peppering her dialogue with sardonic remarks
She has a habit of raising an eyebrow when she senses deception.
Eleanor grapples with feelings of guilt over her past with the victim, questioning whether her pursuit of justice is driven by a desire for closure or revenge.
Voice colour: Eleanor Voss uses dry wit humour — let it surface in their dialogue where natural, not in every line.

### Captain Ivor Hale (he/him — NEVER she/her)
Ivor speaks in a gravelly tone, often using short, clipped sentences
He has a tendency to deflect personal questions with humor, masking his deeper emotions.
Ivor wrestles with his bitterness towards the victim, torn between a desire for revenge and the realization that it may not bring him peace.

### Beatrice Quill (she/her — NEVER he/him)
Beatrice speaks with a lively cadence, often interjecting with sarcastic remarks
She has a knack for turning mundane conversations into theatrical performances.
Beatrice wrestles with her ambition and the moral implications of her choices, torn between her desire for success and the reality of her actions.
Voice colour: Beatrice Quill uses sardonic humour — let it surface in their dialogue where natural, not in every line.

### Sylvia Trent (she/her — NEVER he/him)
Sylvia speaks with an effortless elegance, often using flowery language to mask her intentions
She has a tendency to drop veiled insults into casual conversation.
Sylvia grapples with the reality of her manipulations and the potential fallout from her actions, torn between ambition and the truth.
Voice colour: Sylvia Trent uses polite savagery humour — let it surface in their dialogue where natural, not in every line.

### Hugo Vane (he/him — NEVER she/her)
Hugo speaks with a smooth, persuasive tone, often employing anecdotes to illustrate his points
He has a tendency to deflect serious questions with charm.
Hugo struggles with the fear of losing everything he has worked for, torn between ambition and the moral implications of his actions.
Voice colour: Hugo Vane uses observational humour — let it surface in their dialogue where natural, not in every line.


## CHARACTER CONTRACTS (binding for this scene)
Each entry below constrains how this character must be written in this chapter.
These override generic style guidance when they conflict.

### Eleanor Voss[SHE]
Voice & mannerisms: Eleanor speaks with a precise cadence, often peppering her dialogue with sardonic remarks. She has a habit of raising an eyebrow when she senses deception.
SIGNATURE TIC (use sparingly — this is Eleanor Voss's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "She often quips, 'The truth is a slippery fish, isn't it?'"
Sample voice fragments (match this register and rhythm):
  [comfortable] "The truth is a slippery fish, isn't it? I always find it lurking just out of reach."
  [evasive] "I was merely observing, taking notes, you know. Nothing sinister about that."
Humour: dry wit — deploy occasionally (level 0.5)
FORBIDDEN phrase (never write for Eleanor Voss): "a surge of determination washed over her"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Driven by a need to uncover the truth about the victim's shadowy past, Eleanor sees the investigation as her chance to redeem herself from the heartbreak she endured." — do not surface in Act I.

### Captain Ivor Hale[HE]
Voice & mannerisms: Ivor speaks in a gravelly tone, often using short, clipped sentences. He has a tendency to deflect personal questions with humor, masking his deeper emotions.
SIGNATURE TIC (use sparingly — this is Captain Ivor Hale's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "He often mutters, 'A sailor's life is never dull,' when confronted with uncomfortable truths."
Sample voice fragments (match this register and rhythm):
  [comfortable] "A sailor's life is never dull; there's always a storm brewing somewhere."
  [evasive] "I was merely taking a walk; the beach has always been my refuge."
Humour: self deprecating — deploy rarely (level 0.3)
FORBIDDEN phrase (never write for Captain Ivor Hale): "she knew with certainty she was right"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Ivor seeks revenge for the victim’s involvement in ruining his family’s reputation, a wound that has festered over the years." — do not surface in Act I.

### Beatrice Quill[SHE]
Voice & mannerisms: Beatrice speaks with a lively cadence, often interjecting with sarcastic remarks. She has a knack for turning mundane conversations into theatrical performances.
SIGNATURE TIC (use sparingly — this is Beatrice Quill's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "She frequently exclaims, 'Life is a stage, darling!' when discussing her aspirations."
Sample voice fragments (match this register and rhythm):
  [comfortable] "Life is a stage, darling! We all play our parts, don't we?"
  [evasive] "I was simply mingling; it’s what one does at these gatherings."
Humour: sardonic — deploy occasionally (level 0.6)
FORBIDDEN phrase (never write for Beatrice Quill): "palpable tension filled the room"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Feeling threatened by the victim's influence over her patron, Beatrice fears losing her future and her job." — do not surface in Act I.

### Sylvia Trent[SHE]
Voice & mannerisms: Sylvia speaks with an effortless elegance, often using flowery language to mask her intentions. She has a tendency to drop veiled insults into casual conversation.
SIGNATURE TIC (use sparingly — this is Sylvia Trent's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "She frequently says, 'Ah, the price of social grace is steep, isn't it?' when discussing her lifestyle."
Sample voice fragments (match this register and rhythm):
  [comfortable] "Ah, the price of social grace is steep, isn't it? But worth every penny."
  [evasive] "I was simply attending to matters of the heart, nothing to be alarmed about."
Humour: polite savagery — deploy frequently (level 0.7)
FORBIDDEN phrase (never write for Sylvia Trent): "she felt a wave of unease"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Cornered by the victim's threat to expose her secrets, Sylvia fears losing her social standing and security." — do not surface in Act I.

### Hugo Vane[HE]
Voice & mannerisms: Hugo speaks with a smooth, persuasive tone, often employing anecdotes to illustrate his points. He has a tendency to deflect serious questions with charm.
SIGNATURE TIC (use sparingly — this is Hugo Vane's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "He often remarks, 'In the world of hospitality, every detail matters, wouldn't you agree?' when discussing his work."
Sample voice fragments (match this register and rhythm):
  [comfortable] "In the world of hospitality, every detail matters, wouldn't you agree?"
  [evasive] "I was overseeing the staff; it’s crucial to maintain standards, after all."
Humour: observational — deploy occasionally (level 0.4)
FORBIDDEN phrase (never write for Hugo Vane): "everyone could sense the atmosphere"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Terrified that the victim would reveal his financial mismanagement, Hugo's ambitions hang in the balance." — do not surface in Act I.



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

Primary Location: The Ocean Crest Hotel (Brighton, England)
An Art Deco seaside hotel with a grand lobby and stunning ocean views, now shrouded in mystery and tension.

Key Locations Available:
- Grand Lobby (interior): Gathering space
- Dining Area (interior): Dining and social gathering
- Guest Rooms (interior): Private accommodation for guests
- Kitchen (interior): Food preparation and service

Atmosphere (tonal cue only — do NOT reproduce this phrase verbatim in prose; translate into scene-specific, character-observed sensory language): tension-filled due to recent events and the backdrop of post-war uncertainties
Weather: overcast with occasional rain, typical of coastal climates in the fall

Era markers: Art Deco architecture and design | rationed wartime vehicles parked outside | early radio broadcasts crackling in the lobby

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
  - Visual: gleaming marble floors, shimmering chandelier, plush velvet armchairs
  - Sounds: soft murmurs of conversation, clinking of glasses, footsteps echoing
  - Scents: damp wood and varnish, beeswax from candles, freshly polished furniture
  - Touch: smooth marble underfoot, soft velvet upholstery

Dining Area (interior):
  - Visual: large windows framing the ocean view, elegantly set tables, floral centerpieces
  - Sounds: clinking of silverware, soft music playing, laughter and conversation
  - Scents: aroma of roasted meats, freshly baked bread, scent of floral arrangements
  - Touch: smooth linen tablecloths, cool silverware against skin

Guest Rooms (interior):
  - Visual: muted color palettes, Art Deco furnishings, ocean views from balconies
  - Sounds: the crash of waves against cliffs, distant thunder, the rustle of sheets
  - Scents: scent of fresh linens, hint of salt from the sea, faint aroma of polished wood
  - Touch: soft linens against skin, cool metal of light switches

⛔ REFERENCE DATA — DO NOT TRANSCRIBE VERBATIM: The above profiles are structural guides only. Generate original prose that evokes these qualities; do not reproduce the exact phrasing or sentence structure of the profile paragraphs.

SCENE OPENING RULE: When opening a scene in a new location, write what the POV character directly observes and physically senses at that moment — not a general description of the room's qualities. The reader must feel present, not briefed. Sensory details must be observed by the character, not stated as fact about the place.

SENSORY WRITING TECHNIQUES:
- Opening paragrap
[truncated for prompt budget]

## Texture Pool
Draw on these as opportunities arise — you are not required to use them.

- In April 1943, the atmosphere in England is laden with the weight of war
- As the Allies push forward in North Africa, the everyday life of civilians is deeply affected by rationing and the looming uncertainties of the future
- The overcast skies mirror the collective mood of tension, where the echoes of wartime sacrifices are felt in every corner of society
- People grapple with the personal toll of loss—whether through the absence of loved ones at the front or the haunting memories of battles fought
- Social gatherings are often tinged with an underlying anxiety, as trust and alliances shift amid the pressures of survival

TEMPORAL CONTEXT:

This story takes place in April 1943 during spring.

Seasonal Atmosphere:
- Weather patterns: overcast with occasional rain, mild temperatures, chilly winds from the ocean
- Daylight: Days are gradually lengthening, with daylight extending into the evening, sunset occurring around 7:30 PM.
- Seasonal activities: spring cleaning, attending local Easter events, preparing for the upcoming May Day celebrations
- Seasonal occasions: Easter Sunday (April 4)
- Season: spring

Period Fashion (describe naturally):
- Men formal: navy wool suits with broad lapels, double-breasted jackets, crisp white dress shirts
- Men casual: lightweight cotton trousers, button-down shirts in pastel colors, tweed jackets
- Men accessories: fedoras with a narrow brim, silk ties in geometric patterns, leather gloves
- Women formal: tea-length dresses with floral prints, tailored blazer jackets, peplum tops
- Women casual: A-line skirts paired with fitted sweaters, lightweight cardigans, pumps with modest heels
- Women accessories: wide-brimmed hats adorned with ribbons, string pearl necklaces, clutch handbags

Cultural Context (reference naturally):
- Music/entertainment: Glenn Miller's 'In the Mood', Bing Crosby's 'Don't Fence Me In', Doris Day's 'Sentimental Journey'; Films: Casablanca, The Song of Bernadette; Theatre: Oklahoma! (premiered in 1943), Cabaret productions featuring wartime themes; Radio: The Shadow, Fibber McGee and Molly
- Typical prices: loaf of bread: four pence, a pint of milk: three pence, a dozen eggs: one shilling
- Current events: Allied forces continue their campaigns in North Africa; Rationing remains in effect in the UK and US, affecting food and clothing
- Literature: The Little Prince by Antoine de Saint-Exupéry | The Glass Menagerie by Tennessee Williams | The Naked and the Dead by Norman Mailer | [war literature] | [detective fiction] | [romantic novels reflecting wartime sentiments]
- Technology: improvements in radar technology for military use | advancements in radio communication | early television broadcasts begin to gain popularity | radios remain a household staple | manual typewriters for business use | early vacuum cleaners as household conveniences
- Daily life: gathering for community events, participating in local war bond drives, attending church services for Easter
- Social rituals: family dinners on Sundays, neighborhood watch meetings during wartime, evening gatherings for news updates and radio shows

Atmospheric Details:
The air is thick with the scent of rain-soaked earth and blooming flowers, a stark contrast to the somber mood of the times. The murmur of conversations fills the hotel lobby, punctuated by the occasional clink of glasses and laughter, masking the underlying tension of wartime uncertainty. The sound of distant radio broadcasts echoes through the venue, providing a backdrop of news and entertainment that keeps guests connected to the world outside.

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
  - The mirror was angled at thirty degrees to create the illusion.: "thirty degrees"
  - The distance from the mirror to the victim was fourteen feet.: "fourteen feet"
  - The victim was killed at ten minutes past eight.: "ten minutes past eight"
    ⛔ FORBIDDEN alternatives: "8:10", "8.10", "eight ten", "eight-ten", "eight past ten", "quarter past eight", "half past eight" — the ONLY acceptable form is "ten minutes past eight"

If a value has no relevance to this chapter, omit it. But the moment you reference the underlying evidence, only the exact phrase above is acceptable.

⛔ CLUES TO SURFACE IN THESE CHAPTERS — mandatory:
The following evidence MUST be clearly observable to an attentive reader. Do not bury it in atmosphere or passing dialogue. Each clue must be concrete, specific, and noticeable:

• [clue_late_1] accomplice, seen, leaving, hotel, shortly, murder
  Category: spatial | Criticality: essential | Supports inference step 1
  Points to: presence, accomplice, indicates, hugo, vane, party

• [clue_mechanism_visibility_core] Direct observation
  Category: structural | Placement: early (Act 1)
  Points to: what this observation reveals about the time or circumstances of the crime.

For each clue above: an attentive reader should be able to find, record, and later use it to reason toward the solution.

═══ NARRATIVE STATE (read-only — do not contradict) ═══

LOCKED FACTS — use verbatim whenever this evidence is described:
  • The mirror was angled at thirty degrees to create the illusion.: "thirty degrees"
  • The distance from the mirror to the victim was fourteen feet.: "fourteen feet"
  • The victim was killed at ten minutes past eight.: "ten minutes past eight"

CHARACTER PRONOUNS — never deviate from these:
  • Eleanor Voss: she/her/her
  • Dr. Mallory Finch: she/her/her
  • Captain Ivor Hale: he/him/his
  • Beatrice Quill: she/her/her
  • Sylvia Trent: she/her/her
  • Hugo Vane: he/him/his

INVESTIGATION LOG — WHAT IS ESTABLISHED (do not re-establish, do not repeat):
• Suspects still unresolved: Captain Ivor Hale[HE], Beatrice Quill[SHE], Sylvia Trent[SHE]
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
Known location profile anchors: The Ocean Crest Hotel, Grand Lobby, Dining Area, Guest Rooms, Kitchen, the ballroom of the hotel
LOCATION NAME CAPITALISATION (HARD REQUIREMENT — validated):
All named locations in your prose MUST use the EXACT capitalisation from the CML profiles.
Canonical forms: "The Ocean Crest Hotel", "Grand Lobby", "Dining Area", "Guest Rooms", "Kitchen", "the ballroom of the hotel"
Writing a location in lowercase (e.g. "drawing room" instead of "Drawing Room") is a validated error. Every time you mention a named location, copy its capitalisation from the list above.
- Chapter 1: OPENING STYLE (HARD): Start the VERY FIRST SENTENCE with a named character performing a physical action or motion — e.g. "[Name] crossed the threshold…" / "[Name] set down the glass…" / "[Name] rose from the chair…". Anchor opening in "the ballroom of the hotel". The opening style above governs only your FIRST SENTENCE; the grounding below may land anywhere in the first 2 paragraphs (it need not be sentence one, and never conflicts with the chosen opening style). HARD REQUIREMENT for the first 2 paragraphs: (a) include 2+ sensory words — choose from smell/scent/odor/fragrance/sound/echo/silence/whisper/creak/cold/warm/damp/rough/smooth/glow/shadow/flicker/dim — and (b) include 1+ atmosphere/time word — choose from rain/wind/fog/storm/mist/thunder/evening/morning/night/dawn/dusk/lighting/weather/season/afternoon/midday/noon/midnight/twilight/sunrise/sunset/daylight/sunlight/overcast/cloudy/bright/dark/grey/pale/chill/crisp/drizzle/haze/lamplight/firelight. These are validated requirements, not style suggestions; missing them triggers a retry.

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

PROMPT BUDGET SUMMARY: budget=24000 tokens; fixed=7744; context=11998; dropped=[none]; truncated=[first_appearance_contracts, location_profiles, temporal_context, pronoun_accuracy]

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
4. Integrate at least two concrete era-grounded details per chapter from setting refinement signals: radio communication | early television sets | military radar | long-distance telephone calls | military encryption for sensitive communications | telegrams.
5. Respect setting movement/access constraints in scene action and alibis: narrow hallways limiting movement | fire escapes that are accessible but restricted during night hours | oceanfront cliffs creating natural barriers | staff-only areas such as the kitchen and supply rooms | restricted access to guest areas after 10 PM.
6. Sustain social coherence with this backdrop pressure: A seaside hotel hosts a gathering of war veterans and their families, where the pressures of post-war life and emerging tensions create a volatile environment for hidden identities and unspoken grievances.
7. Maintain continuity around these socially central cast anchors where relevant: Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill, Sylvia Trent, Hugo Vane.
8. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Critical: Plot similarity 0.80 with 'The Second Key' (same disappearance crime and similar solution method)
9. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Moderate: Character similarity 0.74 with 'The Second Key' (similar cast structure and roles)

CRITICAL PROSE REQUIREMENTS:

The CML specifies exact requirements for certain validation-critical scenes. You MUST include these elements at the specified positions.

**Discriminating Test Scene (Act 3, Scene 4):**
Required elements: Execute the discriminating test, Observe the culprit's reaction or result, Draw conclusion about guilt

**Suspect Clearance Scenes:**
- Captain Ivor Hale (Act 3, Scene 5): Witness statements confirm his alibi at the bar.
  Clues: clue_id_1, clue_id_2
- Beatrice Quill (Act 3, Scene 5): Evidence of her whereabouts at the time.
  Clues: clue_id_1, clue_id_2
- Sylvia Trent (Act 3, Scene 5): Witness testimony clearing her involvement.
  Clues: clue_id_1, clue_id_2

**Culprit Revelation Scene (Act 3, Scene 6):**
Method: Confrontation with evidence.

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
Suspect pressure target(s): Hugo Vane, Captain Ivor Hale, Beatrice Quill, Sylvia Trent
Required new information: First clue observation tied to suspect landscape.
Forbidden reveals at this stage: No culprit reveal. | No full murder mechanism explanation. | Do not state the direction, magnitude, or agent of any clock or device tampering. Characters may only observe that two time sources disagree. "The clock was wound back by forty minutes" must not appear before Chapter 3.

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
- Chapter 1:
  - STRUCTURAL ARCHETYPE — Chapter 1 must be: DISCOVERY
      ✓ MUST contain: body found / victim identified
      ✗ MUST NOT contain: formal accusation or interrogation
  - Word count: Target 1250 words. Achieve this through plot events, dialogue exchanges, and physical investigation — not through atmospheric repetition or extended internal reflection. Each 200-word segment should contain at minimum one concrete story event (a discovery, a conversation exchange, a physical action or movement). Padding with atmosphere alone is not acceptable.
  - VICTIM IDENTITY LOCK (MANDATORY): name the victim as "Dr. Mallory Finch" in the discovery scene. After first mention, do not use unnamed placeholders such as "the victim" without naming Dr. Mallory Finch in the same paragraph.
  - Opening: Begin with a character action, spoken line, or clock/time marker — never a location name or location-description phrase.
  - Scene is set in: the ballroom of the hotel — reference it naturally within the paragraph, never as your opening phrase.
  - Opening atmosphere (MANDATORY — validator enforced): the first paragraph MUST contain at least one of: rain / wind / fog / storm / mist / thunder / evening / morning / night / dawn / dusk / season / afternoon / midday / noon / midnight / twilight / sunrise / sunset / daylight / sunlight / overcast / cloudy / bright / dark / grey / pale / cold / warm / chill / crisp / damp / drizzle / haze / lamplight / firelight. A chapter that omits all of these from its opening paragraph will be rejected.
  - PARAGRAPH OPENER DIVERSITY (MANDATORY — validator enforced): No more than 2 paragraphs in this chapter may begin with "Eleanor" or "Eleanor's" as the first word. You must vary paragraph openings throughout: use sensory observations, another character's name or action, dialogue, object or sound details, or temporal markers. Opening 3 or more paragraphs with "Eleanor" will cause automated rejection.
  - INVESTIGATOR ESTABLISHMENT REQUIRED: Eleanor Voss must claim or be recognised as the investigator in this chapter. Establish Eleanor Voss as the detective-in-charge within the first two paragraphs — Eleanor Voss IS the investigator. Do NOT have any character suggest a "real" detective is still coming, or imply that authority has not yet been delegated. Eleanor Voss begins the investigation in this chapter.
  - ⛔ BODY DISCOVERY ORDER (MANDATORY — Chapter 1 only): the victim's body must be physically encountered or described within the first TWO paragraphs. Do NOT spend the opening paragraphs solely on clock examination, atmospheric setup, or character introductions before the body is found. Required Chapter 1 structure: atmosphere (one sentence max) → body/discovery → investigator reaction → suspects → first time-source contradiction.
  - ⛔ MECHANISM SPOILER BAN: Do NOT state how the crime device was manipulated — not the direction, not the magnitude, not who performed it. Characters may only observe that two sources of evidence disagree. The specific method, tamper amount, and perpetrator's action are ALL FORBIDDEN until the reveal. WRONG: "The culprit had altered the device by forty minutes to create a false alibi." RIGHT: "Two independent pieces of evidence gave contradictory readings — a discrepancy neither could yet explain."
  - CLUE OBLIGATIONS — each clue below MUST be dramatized, but in YOUR OWN WORDS:
    Render each as something a character SEES, DOES, or SAYS on the page. The bracketed text is a
    DESCRIPTION of the evidence for you — do NOT transcribe it as narration. Copying a clue's
    description sentence verbatim into the prose FAILS validation.
    • witnesses, reported, seeing, someone, leaving, hotel [clue_mechanism_visibility_core] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      ⛔ SPOILER EMBARGO (pre-reveal chapter): surface ONLY the surface anomaly a character can see/hear/find.
         Do NOT name who it implicates, state the tamper direction or magnitude, or explain the mechanism in this chapter.
         Present it as an unexplained discrepancy; the culprit and method are revealed later.
         Place this OBSERVATION in paragraph 1 or 2 (observation only — no inference about the culprit).
    • witnesses, reported, seeing, someone, leaving, hotel [clue_late_1] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      ⛔ SPOILER EMBARGO (pre-reveal chapter): surface ONLY the surface anomaly a character can see/hear/find.
         Do NOT name who it implicates, state the tamper direction or magnitude, or explain the mechanism in this chapter.
         Present it as an unexplained discrepancy; the culprit and method are revealed later.
         Place this OBSERVATION in paragraph 1 or 2 (observation only — no inference about the culprit).
  - Tonal contrast: include at least one beat of relief or ironic counterpoint. Do not sustain maximum tension for every paragraph.
  - CLUE DISCLOSURE RULE (Stage 1/4):
    Characters may OBSERVE anomalies (wrong time, missing object, odd detail) but must NOT explain the mechanism, deduce the method, or name the culprit. Discovery and reaction only.
    WRONG: dialogue or narration that directly explains how the crime was committed before Stage 4.
    RIGHT: observation, physical reaction, and logical inference that leaves the mechanism just off-screen.
  - ALIBI LOCK: Hugo Vane's established alibi is "during the party". Do NOT place Hugo Vane at any other location or in any other activity during the crime window. Any contradiction is a continuity error that triggers a retry.
- Locked fact phrase obligations:
  - If this batch mentions The mirror was angled at thirty degrees to create the illusion., write exactly: "thirty degrees".
  - If this batch mentions The distance from the mirror to the victim was fourteen feet., write exactly: "fourteen feet".
  - If this batch mentions The victim was killed at ten minutes past eight., write exactly: "ten minutes past eight".
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
Batch chapters: 1-1.
Investigation state at start: 0 clue(s) revealed to reader; approximately 3 unresolved suspect(s).
Must change by end: Introduce cast relevance and plant first clue while keeping culprit unresolved.
Suspect pressure target(s): Hugo Vane, Captain Ivor Hale, Beatrice Quill, Sylvia Trent
Required new information: First clue observation tied to suspect landscape.
Forbidden reveals at this stage: No culprit reveal. | No full murder mechanism explanation. | Do not state the direction, magnitude, or agent of any clock or device tampering. Characters may only observe that two time sources disagree. "The clock was wound back by forty minutes" must not appear before Chapter 3.

FROZEN FACT STATE (DO NOT ALTER):
- Timeline anchor: April (spring).
- Month, season, weather, and time-of-year language in this batch must stay compatible with spring.
- If referenced, use exact phrase: "thirty degrees" (The mirror was angled at thirty degrees to create the illusion.).
- If referenced, use exact phrase: "fourteen feet" (The distance from the mirror to the victim was fourteen feet.).
- If referenced, use exact phrase: "ten minutes past eight" (The victim was killed at ten minutes past eight.).

STORY TO DATE (REFERENCE ONLY — DO NOT COPY VERBATIM):
- No previous chapter text exists yet for this batch.

[SCENE COMPLETENESS CONTRACTS — MANDATORY. Each contract below lists what you MUST enact in that chapter. Do not summarise or mention these labels in the prose — enact them organically.]
Chapter 1 (Act 1) completeness contract:
  PIVOT ELEMENT (MANDATORY — write this into the prose, shown not told): "The body of the victim found behind the curtains."
  FACT ESTABLISHED (MANDATORY — reader must know this by chapter end): "Establishes the victim has been murdered, provoking immediate suspicion among the guests."

# Case Overview
Title: The Masquerade of Authority
Era: 1940s
Setting: A seaside hotel with Art Deco architectural features
Crime: murder (disappearance)
Culprit: Hugo Vane
Victim: Dr. Mallory Finch
False assumption: Hugo Vane was at the party the entire time, as confirmed by multiple witnesses.
Cast: Eleanor Voss (she/her), Dr. Mallory Finch (she/her), Captain Ivor Hale (he/him), Beatrice Quill (she/her), Sylvia Trent (she/her), Hugo Vane (he/him)

Setting Lock: Keep all scenes and descriptions consistent with the stated setting (A seaside hotel with Art Deco architectural features). Do not introduce a different location type. Do not invent an alternative estate name. The only permitted name for this property is "A seaside hotel with Art Deco architectural features" — any other estate name (e.g., "Caldwell Manor", "Ashwood Hall", or any invented proper name) is a continuity error that will be caught and rejected.

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
      "location": "the ballroom of the hotel",
      "timeOfDay": "Evening after the party",
      "atmosphere": "Tense and chaotic, filled with whispers and gasps"
    },
    "characters": [
      "Eleanor Voss",
      "Hugo Vane",
      "Dr. Mallory Finch",
      "Captain Ivor Hale",
      "Beatrice Quill",
      "Sylvia Trent"
    ],
    "purpose": "Introduce the crime and detective",
    "cluesRevealed": [
      "clue_late_1"
    ],
    "dramaticElements": {
      "conflict": "The guests are in a state of shock over the disappearance.",
      "tension": "Suspicion lingers in the air, as everyone questions who could be involved.",
      "microMomentBeats": [
        "Eleanor stares at the empty stage, her heart racing with dread."
      ]
    },
    "summary": "As the guests gather, Eleanor Voss discovers the body of the victim hidden behind the curtains of the ballroom. Shocked, she calls for help, realizing that the party has taken a dark turn. The atmosphere grows tense as whispers of suspicion fill the air.",
    "beat": "gathering",
    "estimatedWordCount": 1250,
    "pivotElement": "The body of the victim found behind the curtains.",
    "factEstablished": "Establishes the victim has been murdered, provoking immediate suspicion among the guests.",
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
      }
    ],
    "redHerringPlacement": null,
    "emotionalRegister": "The atmosphere is steeped in anticipation, shadowed by the weight of a recent tragedy.",
    "dominantCharacterNote": {
      "name": "Eleanor Voss",
      "voiceRegister": "Eleanor speaks with a sharp, incisive tone, often layered with a touch of sardonic wit."
    },
    "humourGuidance": {
      "permission": "forbidden"
    },
    "eraTextureNote": "Limited transportation options due to wartime rationing and fuel shortages.; Strict curfews in many areas to maintain security.; Communication delays arising from military operations and censorship.",
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
□ Chapter 1: the clue [clue_mechanism_visibility_core] (accomplice, seen, leaving, hotel, shortly, murder) is placed in the first 25% of the chapter, dramatized in your own words, followed by an explicit inference or suspicion paragraph.
□ Chapter 1: the clue [clue_late_1] (accomplice, seen, leaving, hotel, shortly, murder) is placed in the first 25% of the chapter, dramatized in your own words, followed by an explicit inference or suspicion paragraph.
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
