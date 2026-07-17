# Actual Prompt Record

- Run ID: `mystery-1784259186554`
- Project ID: ``
- Timestamp: `2026-07-17T03:42:55.336Z`
- Agent: `Agent9-ProseGenerator-Ch2`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4.1`
- Temperature: `0.42`
- Max Tokens: `4500`
- Attempt: `first`
- Prompt Hash: `8e35d07254578964`

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
- MORAL COMPLEXITY REQUIREMENT: The mechanism of this crime carries a moral gray area: "The culprit administered the poison believing they were protecting their loved one from a life of suffering, leading to a complex emotional conflict." — the culprit reveal and denouement MUST acknowledge this ambiguity. Do not let the ending feel clean or simple. Give the reader at least one moment of uncomfortable sympathy or moral doubt.

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
   - Dr. Mallory Finch: Expert
   - Captain Ivor Hale: Traditionalist
   - Beatrice Quill: Ambitious Young Professional
   - Sylvia Trent: Investigative Journalist
   - Hugo Vane: Investor
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

## Era: February 1941
In February 1941, the coastal town is enveloped in winter's grasp as overcast skies threaten rain at any moment. The chill from the ocean seeps into the cracks of the buildings, compelling townsfolk to don their warmest woolens and turn to indoor amusements. With Valentine's Day approaching, couples whisper sweet nothings over candlelit dinners, while the sounds of laughter and clinking glasses fill the local hotel where many gather to escape the biting cold. Yet beneath this veneer of warmth, a sense of tension simmers, fueled by the looming shadows of global conflict and uncertainty. Fashion trends for both men and women reflect the duality of wartime practicality and pre-war elegance. Men slip into double-breasted suits paired with silk ties, their fedora hats firmly in place, while women adorn themselves in fitted dresses that accentuate their silhouettes, often complemented with pearls and cloche hats. Daily life is marked by a sense of urgency and camaraderie, as people gather around radios for news updates on the war. The cost of living reflects a society adjusting to wartime realities, with bread and coal becoming staples of conversation as families plan their budgets.
Emotional register: A pervasive sense of anxiety and anticipation hangs in the air, reflecting the uncertainty of wartime life.
Physical constraints: Short daylight hours with the sun setting around five in the afternoon | Rationing affecting availability of goods | Difficulties in transportation due to wartime measures | Limited access to communication technology
Current tensions (weave into background texture): U.S. involvement in World War II intensifying | Britain continues to face bombing raids in London | Debate over neutrality and support for allied nations
Wartime context — Many men are away serving in the military, creating a gender imbalance in the workforce.: Women are taking on roles traditionally held by men, leading to both empowerment and conflict. Absence effect: The absence of men creates a longing for connection and a desire for stability in a rapidly changing world.

## Season Lock (mandatory — derived from February 1941)
Season: winter. Allowed vocabulary: winter, wintry, midwinter
Forbidden seasonal words — never use in narration, dialogue, or metaphor: spring, summer, autumn and their adjectival forms.
Every weather description, atmosphere, and time-of-year reference must be consistent with winter.

## Story Theme
In a world where ambition can lead to betrayal, the consequences of hidden desires unfold tragically in the shadows of a grand hotel, and reveals that evidence carries ethical weight, forcing characters to choose accountability over social performance when appearances and facts collide.

## Story Emotional Register
Dominant: The story unfolds with a mix of tension and intrigue, as hidden motives emerge amidst the backdrop of a stormy setting.

Arc:
As the storm rages outside the Grand Mariner Hotel, the atmosphere is fraught with tension, the opulence of the Art Deco architecture contrasting sharply with the underlying currents of jealousy and ambition among its guests. When Eleanor Voss is discovered dead, seemingly from an unexpected health crisis, the initial shock reverberates through the tightly-knit community residing within the hotel. Detective Hugo Vane is thrust into the role of investigator, sifting through the first clues that point to a deeper conspiracy, as he wrestles with personal feelings for the victim. As he delves into the lives of the suspects, the investigation takes some frustrating turns—each lead met with a fresh set of red herrings that distract him from the truth.

A pivotal moment occurs when traces of poison are discovered in Eleanor's lemonade, shifting the focus back to the rivalry between Eleanor and Beatrice Quill. This revelation alters the narrative, casting doubt on all previous assumptions and forcing Hugo to reevaluate each character's motivations. As the pressure mounts, the climax reveals Beatrice's ambition and the extremes she would go to in order to secure Eleanor's position. The confrontation is both dramatic and introspective, as characters come to terms with their roles in this tragedy. In the aftermath, the emotional costs weigh heavily on everyone involved, as the true nature of ambition and betrayal comes to light, leaving scars that will not easily heal.

## Emotional register at this point in the story
The initial shock of Eleanor's death sets a foreboding tone.

## Character Portraits (appearance & era)

### Dr. Mallory Finch
Dr. Mallory Finch represents the duality of the wartime era, serving as a healer while grappling with addiction. Her struggle highlights the personal costs of maintaining a facade of professionalism amidst societal upheaval.
Era intersection: Mallory’s battle with addiction mirrors the internal conflicts many faced as societal expectations shifted and personal demons emerged.

### Captain Ivor Hale
Captain Ivor Hale’s traditional values clash with the evolving social landscape, revealing the tension between old-world ideals and the new roles women are assuming. His character illustrates the struggle of adapting to changing times.
Era intersection: Ivor's resentment towards women in authority reflects the broader societal unease regarding gender roles during the war.

### Beatrice Quill
Beatrice Quill embodies the ambitious young professional eager to climb the social ladder. Her internal conflict between ambition and morality speaks to the risks individuals face in pursuit of success in a turbulent world.
Era intersection: Beatrice's secret ambition to replace Eleanor illustrates the pressure placed on individuals to succeed amidst societal change.

### Sylvia Trent
Sylvia Trent, an investigative journalist, showcases the tension of seeking truth while wrestling with ethical dilemmas. Her character highlights the moral complexities of ambition in a society rife with deception.
Era intersection: Sylvia's pursuit of sensational stories reflects the competitive nature of journalism during the war, where truth often takes a backseat to ambition.

### Hugo Vane
Hugo Vane’s charm masks a web of deceit, illustrating the moral ambiguity many faced during the 1940s. His financial stakes in the hotel reveal the intersection of personal gain and ethical considerations.
Era intersection: Hugo’s involvement in shady dealings reflects the opportunism that arises during times of societal strife, where the lines between right and wrong blur.

## Character Voices

### Dr. Mallory Finch (she/her/her)
Mallory speaks with a gentle cadence, punctuated by self-deprecating humor.
[comfortable] You know how it is, just another day at the hospital.
[evasive] I was... um, busy with another patient at that time.
[stressed] I can’t believe this is happening! What if they find out?
Humour: Mallory's dry wit often lightens the mood but masks her internal struggles.

### Captain Ivor Hale (he/him/his)
Ivor speaks with a commanding tone, punctuated by military jargon.
[comfortable] That’s the way the cookie crumbles, I suppose.
[evasive] I was just taking a stroll along the beach. Nothing unusual.
[stressed] This is all very troubling. We must maintain order.
Humour: Ivor often employs self-deprecating humor that reveals his rigidity.

### Beatrice Quill (she/her/her)
Beatrice speaks with bubbly enthusiasm, often laced with sardonic wit.
[comfortable] Just a thought, but I think I could run this place better!
[evasive] Oh, I was just at the front desk, nothing special.
[stressed] What if they find out? I can’t let this ruin my career!
Humour: Beatrice’s sardonic humor reflects her ambition and naivety.

### Sylvia Trent (she/her/her)
Sylvia's speech is sharp and incisive, often punctuated by sarcastic remarks.
[comfortable] Let’s get to the heart of the matter, shall we?
[evasive] I was in a meeting with the board; it’s all very routine.
[stressed] If this gets out, everything I’ve built will come crashing down!
Humour: Sylvia’s polite savagery often highlights her quick wit.

### Hugo Vane (he/him/his)
Hugo speaks with a smooth, persuasive tone, often employing observational humor.
[comfortable] It’s all part of the game, really.
[evasive] I just arrived; I can’t speak to the events before.
[stressed] This is a serious accusation, and I won’t stand for it!
Humour: Hugo’s observational humor reveals his keen insight into human nature.

## Location Registers (scene framing guides)

The Ocean View Dining Room: The dining room buzzes with tension as guests share meals, yet whispers of secrets linger in the air, creating an atmosphere ripe for betrayal.. Camera angle: A writer entering this space should feel the weight of hidden agendas and unspoken truths.. Era: The dim lighting and elegant decor contrast sharply with the undercurrents of anxiety felt among the patrons.

The Grand Lobby: The lobby serves as a meeting point filled with nervous energy, where the scent of polished wood mingles with the tension of unvoiced suspicions.. Camera angle: A writer should capture the contrast between the inviting space and the tension that lingers just beneath the surface.. Era: The high ceilings and plush seating create an inviting atmosphere that masks the underlying dread of the guests.

The Hotel Library: The library is a sanctuary of whispered secrets, where guests seek refuge, yet the silence is heavy with the weight of unconfessed truths.. Camera angle: A writer should immerse themselves in the quiet solitude that holds both comfort and unease.. Era: The cozy atmosphere clashes with the looming tension of the investigation that shadows every interaction.

The Rooftop Terrace: The terrace offers a breathtaking view, yet the vastness of the ocean reflects the isolation and despair felt by those trapped within the hotel.. Camera angle: A writer should highlight the duality of beauty and foreboding present in the space.. Era: The cold winds and looming clouds create an oppressive atmosphere that mirrors the characters' internal conflicts.

## Humour guidance for this story position (opening)
Permission: forbidden
Rationale: The opening scene must establish the gravity of the situation.

FAIR-PLAY AND INFERENCE CONTRACT:
- FAIR PLAY CLUE TIMING: Never combine clue discovery and detective deduction in the same chapter. If a clue is first revealed to the reader in chapter N, the detective may only analyze, deduce from, or act on that clue in chapter N+1 or later.
- FAIR PLAY INFORMATION PARITY: The reader must see all clues BEFORE the detective uses them in reasoning. If the detective performs a test or makes a deduction, every piece of evidence supporting that conclusion must have been shown to the reader in earlier chapters.
- FAIR PLAY REVELATION SPACING: In the discriminating test scene, the detective can ONLY use clues that were revealed to the reader at least 1 full chapter earlier. Never introduce new clues or withheld information during the test.
- FAIR PLAY CONFRONTATION: During the final confrontation/revelation, the detective cannot surprise the reader with facts. Every piece of evidence cited must have been visible to the reader in prior chapters.
- Never solve by withheld information. Keep reader-information parity with detective reasoning.
- False assumption in force: Eleanor Voss died from an unexpected health crisis.
- Hidden truth to progressively expose (compose in your own words from these elements): true, cause, deliberate, poisoning, carried, beatrice
- Inference path checkpoints to dramatize clearly — compose ENTIRELY in your own sentences from these key terms (reproducing any briefing phrase verbatim FAILS validation):
  - Step 1: obs: witnesses, confirm, eleanor, drinking, glass, lemonade, before, collapse | corr: eleanor, drink, likely, tampered, since, lemonade, provided, restaurant | effect: narrows, focus, beatrice, quill, access, dining, area
  - Step 2: obs: half, empty, glass, lemonade, contain, traces, botanical, poison | corr: poison, glass, eleanor, deliberately, poisoned | effect: eliminates, theory, natural, health, crisis
  - Step 3: obs: beatrice, quill, seen, entering, kitchen, shortly, before, lemonade, served | corr: beatrice, opportunity, poison, eleanor, drink | effect: eliminates, mallory, finch, medical, supply, room
- Discriminating test method: trap
- Discriminating test elements to dramatize (compose ENTIRELY in your own sentences from these — do NOT reproduce any briefing phrase verbatim): confronting, beatrice, entering, kitchen, poison, presence, lemonade
- Test must rely on already-shown clue IDs: clue_5, clue_culprit_direct_1, clue_3, clue_fp_contradiction_step_3
- Fair-play rationale: Step 1: Witness statements (early) and evidence from the lemonade (mid) establish tampering. Step 2: Poison presence (mid) confirms the murder method. Step 3: Access to the kitchen and Beatrice's entry (discriminating test) directly link her to the crime.

## Character Reference

### Dr. Mallory Finch (she/her — NEVER he/him)
Mallory speaks with a gentle cadence, often punctuating her sentences with self-deprecating humor, which serves as a coping mechanism for her internal turmoil
She occasionally stumbles over her words when nervous, revealing her vulnerability.
Mallory struggles with the duality of her role as a healer while battling her own demons, leading to feelings of shame and guilt that plague her every decision.
Voice colour: Dr. Mallory Finch uses dry wit humour — let it surface in their dialogue where natural, not in every line.

### Captain Ivor Hale (he/him — NEVER she/her)
Ivor speaks with a commanding tone, but there is an underlying self-deprecating humor that emerges when he reflects on his own rigidity
He often punctuates his sentences with military jargon, lending a formal air to his speech.
Ivor battles with the conflict between his ingrained beliefs and the changing world around him, leading to feelings of inadequacy and frustration as he struggles to adapt.

### Beatrice Quill (she/her — NEVER he/him)
Beatrice speaks with a bubbly enthusiasm, often punctuating her sentences with sardonic wit
She has a tendency to over-exaggerate her feelings, making her appear both eager and somewhat naive.
Beatrice grapples with the moral implications of her ambition, torn between her desire for success and the lengths she is willing to go to achieve it.
Voice colour: Beatrice Quill uses sardonic humour — let it surface in their dialogue where natural, not in every line.

### Sylvia Trent (she/her — NEVER he/him)
Sylvia's speech is sharp and incisive, often punctuated by sarcastic remarks that reveal her quick wit
She has a habit of raising an eyebrow when making a point, adding an air of condescension to her delivery.
Sylvia grapples with the ethical implications of her work, torn between her ambition and the consequences of her actions on her integrity as a journalist.
Voice colour: Sylvia Trent uses polite savagery humour — let it surface in their dialogue where natural, not in every line.

### Hugo Vane (he/him — NEVER she/her)
Hugo speaks with a smooth, persuasive tone, often peppering his dialogue with observational humor that reveals his keen insight into human nature
He has a tendency to lean in slightly when making a point, drawing others into his charm.
Hugo grapples with the duality of his charm and the darker aspects of his dealings, leading to a moral struggle that questions his integrity and the path he has chosen.
Voice colour: Hugo Vane uses observational humour — let it surface in their dialogue where natural, not in every line.


## CHARACTER CONTRACTS (binding for this scene)
Each entry below constrains how this character must be written in this chapter.
These override generic style guidance when they conflict.

### Dr. Mallory Finch[SHE]
Voice & mannerisms: Mallory speaks with a gentle cadence, often punctuating her sentences with self-deprecating humor, which serves as a coping mechanism for her internal turmoil. She occasionally stumbles over her words when nervous, revealing her vulnerability.
SIGNATURE TIC (use sparingly — this is Dr. Mallory Finch's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "You know how it is."
Sample voice fragments (match this register and rhythm):
  [comfortable] "You know how it is, just another day at the hospital."
  [evasive] "I was... um, busy with another patient at that time."
Humour: dry wit — deploy occasionally (level 0.4)
FORBIDDEN phrase (never write for Dr. Mallory Finch): "a surge of determination washed over her"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Mallory feared that Eleanor would discover her addiction and expose her, ruining her reputation and career." — do not surface in Act I.

### Captain Ivor Hale[HE]
Voice & mannerisms: Ivor speaks with a commanding tone, but there is an underlying self-deprecating humor that emerges when he reflects on his own rigidity. He often punctuates his sentences with military jargon, lending a formal air to his speech.
SIGNATURE TIC (use sparingly — this is Captain Ivor Hale's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "That’s the way the cookie crumbles."
Sample voice fragments (match this register and rhythm):
  [comfortable] "That’s the way the cookie crumbles, I suppose."
  [evasive] "I was just taking a stroll along the beach. Nothing unusual."
Humour: self deprecating — deploy rarely (level 0.3)
FORBIDDEN phrase (never write for Captain Ivor Hale): "she knew with certainty she was right"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Ivor's belief that Eleanor's management style was undermining the hotel's military discipline fueled a growing discontent within him." — do not surface in Act I.

### Beatrice Quill[SHE]
Voice & mannerisms: Beatrice speaks with a bubbly enthusiasm, often punctuating her sentences with sardonic wit. She has a tendency to over-exaggerate her feelings, making her appear both eager and somewhat naive.
SIGNATURE TIC (use sparingly — this is Beatrice Quill's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "Just a thought."
Sample voice fragments (match this register and rhythm):
  [comfortable] "Just a thought, but I think I could run this place better!"
  [evasive] "Oh, I was just at the front desk, nothing special."
Humour: sardonic — deploy occasionally (level 0.6)
FORBIDDEN phrase (never write for Beatrice Quill): "palpable tension filled the room"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Beatrice saw Eleanor's death as her golden opportunity for advancement, a chance to finally step out of the shadows and into the limelight." — do not surface in Act I.

### Sylvia Trent[SHE]
Voice & mannerisms: Sylvia's speech is sharp and incisive, often punctuated by sarcastic remarks that reveal her quick wit. She has a habit of raising an eyebrow when making a point, adding an air of condescension to her delivery.
SIGNATURE TIC (use sparingly — this is Sylvia Trent's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "Let’s get to the heart of the matter."
Sample voice fragments (match this register and rhythm):
  [comfortable] "Let’s get to the heart of the matter, shall we?"
  [evasive] "I was in a meeting with the board; it’s all very routine."
Humour: polite savagery — deploy occasionally (level 0.5)
FORBIDDEN phrase (never write for Sylvia Trent): "she felt a wave of unease"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Sylvia feared that Eleanor would expose her unethical reporting methods, a revelation that could tarnish her reputation as a journalist." — do not surface in Act I.

### Hugo Vane[HE]
Voice & mannerisms: Hugo speaks with a smooth, persuasive tone, often peppering his dialogue with observational humor that reveals his keen insight into human nature. He has a tendency to lean in slightly when making a point, drawing others into his charm.
SIGNATURE TIC (use sparingly — this is Hugo Vane's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "It’s all part of the game."
Sample voice fragments (match this register and rhythm):
  [comfortable] "It’s all part of the game, really."
  [evasive] "I just arrived; I can’t speak to the events before."
Humour: observational — deploy occasionally (level 0.4)
FORBIDDEN phrase (never write for Hugo Vane): "everyone could sense the atmosphere"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Hugo's financial stake in the hotel means that Eleanor's untimely death could benefit him, raising questions about his true intentions." — do not surface in Act I.



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

Primary Location: The Grand Mariner Hotel (Brighton, England)
A grand seaside hotel with Art Deco elegance, overlooking the tumultuous sea.

Key Locations Available:
- The Ocean View Dining Room (interior): Communal dining and socializing space
- The Grand Lobby (interior): Reception and guest gathering area
- The Hotel Library (interior): Quiet reading and reflection space
- The Rooftop Terrace (exterior): Observation and escape route

Atmosphere (tonal cue only — do NOT reproduce this phrase verbatim in prose; translate into scene-specific, character-observed sensory language): Tense and foreboding, heightened by the recent war and lingering anxieties of the Cold War.
Weather: Overcast with occasional rain, typical for coastal regions in the fall.

Era markers: crackling radio broadcasts | rationed wartime vehicles parked outside | Art Deco furnishings reflecting post-war optimism

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
The Ocean View Dining Room (interior):
  - Visual: ocean waves crashing against rocks, elegantly set dining tables, crystal chandeliers shimmering
  - Sounds: clinking silverware, murmurs of conversation, crackling radio news
  - Scents: roasted meats and fresh bread, salted air from the ocean, burning candle wax
  - Touch: cool marble floors underfoot, soft linen napkins

The Grand Lobby (interior):
  - Visual: ornate ceiling with Art Deco designs, large reception desk polished to shine, tall potted palms in corners
  - Sounds: footsteps echoing on marble, soft crackling of the fireplace, distant laughter from the dining room
  - Scents: freshly polished wood, smoky fireplace embers, citrus from cleaning products
  - Touch: smooth marble floor, soft velvet cushions

The Hotel Library (interior):
  - Visual: soft glow of table lamps, deep green wallpaper, heavy drapes framing the windows
  - Sounds: soft rustling of pages, crackling of the small fireplace, distant sounds from the dining room
  - Scents: old paper and leather, smoky embers from the fireplace, the scent of polished wood
  - Touch: soft upholstery on armchairs, cool leather bindings of books

⛔ REFERENCE DATA — DO NOT TRANSCRIBE VERBATIM: The above profiles are structural guides only. Generate original prose that evokes these qualities; do not reproduce the exact phrasing or sentence structure of the profile paragraphs.

SCENE OPENING RULE: When opening a scene in a new location, write what the POV character directly observes and physically senses at that moment — not a general description of the
[truncated for prompt budget]

## Texture Pool
Draw on these as opportunities arise — you are not required to use them.

- In February 1941, the coastal town is enveloped in winter's grasp as overcast skies threaten rain at any moment
- The chill from the ocean seeps into the cracks of the buildings, compelling townsfolk to don their warmest woolens and turn to indoor amusements
- With Valentine's Day approaching, couples whisper sweet nothings over candlelit dinners, while the sounds of laughter and clinking glasses fill the local hotel where many gather to escape the biting cold
- Yet beneath this veneer of warmth, a sense of tension simmers, fueled by the looming shadows of global conflict and uncertainty
- Fashion trends for both men and women reflect the duality of wartime practicality and pre-war elegance

TEMPORAL CONTEXT:

This story takes place in February 1941 during winter.

Seasonal Atmosphere:
- Weather patterns: overcast with intermittent rain, chilly winds from the ocean, occasional bursts of sunlight breaking through the clouds
- Daylight: Short daylight hours with the sun setting around five in the afternoon, leading to long, dark evenings.
- Seasonal activities: ice skating at local rinks, attending indoor theater productions, gathering for cozy fireside chats in cafes
- Seasonal occasions: Valentine's Day (February 14)
- Season: winter

Period Fashion (describe naturally):
- Men formal: double-breasted navy suit, white dress shirt with a stiff collar, silk tie with geometric patterns
- Men casual: herringbone wool sweater, tweed trousers, leather lace-up shoes
- Men accessories: fedora hat, leather gloves, silver cufflinks
- Women formal: elegant tea-length dress with a cinched waist, pearl necklace, short tailored coat
- Women casual: fitted cardigan with decorative buttons, pencil skirt, brogue ankle boots
- Women accessories: felt cloche hat, silk scarf tied around the neck, handbag with a chain strap

Cultural Context (reference naturally):
- Music/entertainment: Glenn Miller's 'In the Mood', Bing Crosby's 'White Christmas', The Andrews Sisters' 'Boogie Woogie Bugle Boy'; Films: 'The Maltese Falcon', 'Citizen Kane'; Theatre: 'The Glass Menagerie', 'The Skin of Our Teeth'; Radio: 'The Shadow', 'The Jack Benny Program'
- Typical prices: Bread loaf: four pence, Coal scuttle refill: one shilling sixpence, Taxi across town: two shillings
- Current events: U.S. involvement in World War II intensifying; increased military presence in Europe
- Literature: 'The Grapes of Wrath' by John Steinbeck | 'The Maltese Falcon' by Dashiell Hammett | 'For Whom the Bell Tolls' by Ernest Hemingway | [mystery] | [war fiction] | [drama]
- Technology: improved radar technology | early television broadcasts gaining popularity | new radar-guided artillery | batteries for radios | mechanical typewriters | hand-cranked telephones
- Daily life: listening to radio broadcasts in the evening, visiting local diners for warm meals, attending community events at the town hall
- Social rituals: Sunday family dinners, Valentine's Day card exchanges among young couples

Atmospheric Details:
The scent of damp earth mixed with smoke from coal fires lingers in the air, a typical winter evening in a coastal town. The distant sound of waves crashing against the shore creates a rhythmic backdrop, punctuated by the occasional rumble of thunder from an approaching storm. Inside the hotel, the warmth of flickering candlelight contrasts with the biting chill outside, creating a sanctuary filled with hushed conversations and the clinking of glasses.

FASHION INTEGRATION TECHNIQUES:
- First appearance: Describe outfit to establish class/personality
- Accessories: Gloves, hats, pocket watches, jewelry reveal status
- Time-specific: Different outfits for different times of day
- Character traits: Fastidious dresser vs rumpled appearance
- Action integration: "She tugged at her glove" or "He adjusted his tie"
- Weather appropriate: Overcoats in winter, light linen in summer

CULTURAL TOUCHSTONE INTEGRATION:
- Casual conversation: "Did you hear that new jazz record?" or "I saw the latest Chaplin film"
- Background details: Radio playing, newspaper head
[truncated for prompt budget]

NON-NEGOTIABLE CHAPTER OBLIGATIONS — LOCKED EVIDENCE VALUES (VERBATIM REQUIRED):
The following measured values (times, amounts, measurements) are absolute ground truth. Every time this chapter describes, mentions, or alludes to one — no matter how briefly — it MUST use the exact phrase shown below, character for character. NO paraphrase, approximation, rounding, or synonym is permitted.

FAILURE EXAMPLE: if the locked value is "at thirteen minutes to midnight" and you write "just before midnight" or "around midnight" — that is a HARD FAIL. You must write "at thirteen minutes to midnight". Equally, if the locked value is written in words, such as "ten minutes past eleven", and you convert it to figure-based clock notation — that is also a HARD FAIL. Words stay as words; figure forms are forbidden for word-phrased facts.

CRITICAL — WORD-PHRASED VALUES: If the canonical value is written out in words (e.g. a time like "ten minutes past eleven", or an amount like "forty minutes"), reproduce those exact words. DO NOT convert to figure-based time notation, twenty-four-hour format, or any other numeric shorthand. Correct: "ten minutes past eleven". WRONG: figure-based clock notation or numeric shorthand.

Locked values:
  - The pH level required for the poison to activate.: "three"
  - The time it takes for the poison to fully dissolve in the lemonade.: "three hours"
  - The time the lemonade was delivered to the victim.: "ten minutes past four"
    ⛔ FORBIDDEN alternatives: "4:10", "4.10", "four ten", "four-ten", "four past ten", "quarter past four", "half past four" — the ONLY acceptable form is "ten minutes past four"

If a value has no relevance to this chapter, omit it. But the moment you reference the underlying evidence, only the exact phrase above is acceptable.

⛔ CLUES TO SURFACE IN THESE CHAPTERS — mandatory:
The following evidence MUST be clearly observable to an attentive reader. Do not bury it in atmosphere or passing dialogue. Each clue must be concrete, specific, and noticeable:

• [clue_mechanism_visibility_core] witnesses, confirm, eleanor, drinking, glass, lemonade, before, collapse
  Category: testimonial | Criticality: essential | Supports inference step 1
  Points to: eleanor, drink, likely, tampered

• [clue_3] half, empty, glass, lemonade, contain, traces, botanical, poison
  Category: physical | Criticality: essential | Supports inference step 2
  Points to: eleanor, deliberately, poisoned

• [clue_core_contradiction_chain] eleanor, drink, likely, tampered, since, lemonade, provided, restaurant
  Category: testimonial | Criticality: supporting | Supports inference step 1
  Points to: eleanor, drink, likely, tampered

For each clue above: an attentive reader should be able to find, record, and later use it to reason toward the solution.

═══ NARRATIVE STATE (read-only — do not contradict) ═══

LOCKED FACTS — use verbatim whenever this evidence is described:
  • The pH level required for the poison to activate.: "three"
  • The time it takes for the poison to fully dissolve in the lemonade.: "three hours"
  • The time the lemonade was delivered to the victim.: "ten minutes past four"

CHARACTER PRONOUNS — never deviate from these:
  • Eleanor Voss: she/her/her
  • Dr. Mallory Finch: she/her/her
  • Captain Ivor Hale: he/him/his
  • Beatrice Quill: she/her/her
  • Sylvia Trent: she/her/her
  • Hugo Vane: he/him/his

CLUES ALREADY REVEALED TO READER: clue_mechanism_visibility_core — do not reveal these as new information.

INVESTIGATION LOG — WHAT IS ESTABLISHED (do not re-establish, do not repeat):
• Evidence already established (reference only — do NOT restate or quote these; advance beyond them): eleanor, drink, likely, tampered
• Suspect cleared: Dr. Mallory Finch[SHE] — Confirmed alibi from other guests
• Suspect cleared: Captain Ivor Hale[HE] — No access to the kitchen during the meal.
• Suspect cleared: Sylvia Trent[SHE] — Witness statements confirm her presence elsewhere.
⚠ The story must move FORWARD from this log. Any beat already listed above is forbidden from repeating.

⚠ THIS CHAPTER'S REQUIRED ADVANCE (opening): Discover the body, confirm the victim, establish the scene. The victim is found dead. They do not speak, react, or gesture. This is their only physical appearance — in all subsequent chapters they exist only in past tense (memory, evidence, testimony).

CONTINUITY HANDOFF — previous chapter closing beat:
  • "He glanced once more at the gathered guests, noting the way their eyes slid away from his, the way their voices dropped to whispers when they thought he could not hear. The storm outside showed no sign of abating, and within the dining room of the hotel, suspi..."
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
dining room, kitchen

✓ RULE: Continue using this location vocabulary. Maintain consistency with established setting type.
✓ Do NOT introduce new location types that contradict earlier chapters.

**Recent Chapter Summary (for narrative continuity):**
Chapter 1: Chapter 1: Shadows Over Supper
  Events: A fork clattered to the marble floor, echoing in the hush that followed Eleanor Voss’s collapse.

⚠️ **VALIDATION:** Character name mismatches and setting drift are common failure modes.
Double-check every character name against the list above before using it.

**⏱ LOCKED TIME ANCHOR — use verbatim, do not paraphrase:**
Clock time (from the case ground truth): **"Dinner service commenced at seven o'clock"**
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
Known location profile anchors: The Grand Mariner Hotel, The Ocean View Dining Room, The Grand Lobby, The Hotel Library, The Rooftop Terrace, the dining room
LOCATION NAME CAPITALISATION (HARD REQUIREMENT — validated):
All named locations in your prose MUST use the EXACT capitalisation from the CML profiles.
Canonical forms: "The Grand Mariner Hotel", "The Ocean View Dining Room", "The Grand Lobby", "The Hotel Library", "The Rooftop Terrace", "the dining room"
Writing a location in lowercase (e.g. "drawing room" instead of "Drawing Room") is a validated error. Every time you mention a named location, copy its capitalisation from the list above.
- Chapter 2: OPENING STYLE (HARD): Start the VERY FIRST SENTENCE with spoken dialogue — e.g. '"[words]," [Name] said/asked/replied/murmured.' The opening quote must be the first character on the line. Anchor opening in "the dining room". The opening style above governs only your FIRST SENTENCE; the grounding below may land anywhere in the first 2 paragraphs (it need not be sentence one, and never conflicts with the chosen opening style). HARD REQUIREMENT for the first 2 paragraphs: (a) include 2+ sensory words — choose from smell/scent/odor/fragrance/sound/echo/silence/whisper/creak/cold/warm/damp/rough/smooth/glow/shadow/flicker/dim — and (b) include 1+ atmosphere/time word — choose from rain/wind/fog/storm/mist/thunder/evening/morning/night/dawn/dusk/lighting/weather/season/afternoon/midday/noon/midnight/twilight/sunrise/sunset/daylight/sunlight/overcast/cloudy/bright/dark/grey/pale/chill/crisp/drizzle/haze/lamplight/firelight. These are validated requirements, not style suggestions; missing them triggers a retry.

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

PROMPT BUDGET SUMMARY: budget=24000 tokens; fixed=10051; context=12556; dropped=[none]; truncated=[location_profiles, temporal_context, pronoun_accuracy]

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
4. Integrate at least two concrete era-grounded details per chapter from setting refinement signals: radio broadcasting | early television sets | military radar | long-distance telephone calls | military encryption methods | telegrams.
5. Respect setting movement/access constraints in scene action and alibis: narrow hallways limit movement | guest rooms accessed via locked doors | fire escape routes poorly marked | staff-only areas like the kitchen and maintenance rooms | restricted access to the roof and basement.
6. Sustain social coherence with this backdrop pressure: A group of hotel guests and staff are trapped by a storm, forced to confront their secrets as societal changes and Cold War tensions heighten the stakes of a mysterious death.
7. Maintain continuity around these socially central cast anchors where relevant: Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill, Sylvia Trent, Hugo Vane.
8. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Critical: Plot similarity 0.85 with 'The Mysterious Affair at Styles' (same crime type and method of delayed-action poisoning)
9. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Moderate: Character similarity 0.70 with 'The Mysterious Affair at Styles' (similar cast structure and roles)
10. STORY TO DATE ANTI-COPY RULE: The STORY TO DATE section below is provided for chronological and factual reference ONLY. You MUST NOT copy, lightly rephrase, or structurally echo any sentence or paragraph from prior chapters. Every sentence in this chapter must be original prose unique to this scene. Reusing even a clause from prior chapter text will cause this attempt to fail immediately.

CRITICAL PROSE REQUIREMENTS:

The CML specifies exact requirements for certain validation-critical scenes. You MUST include these elements at the specified positions.

**Discriminating Test Scene (Act 3, Scene 4):**
Required elements: Execute the discriminating test, Present evidence of kitchen access, Draw conclusion about Beatrice's guilt
Test type: trap

**Suspect Clearance Scenes:**
- Dr. Mallory Finch (Act 3, Scene 5): Confirmed alibi from other guests
  Clues: clue_id_1, clue_id_2
- Captain Ivor Hale (Act 3, Scene 5): No access to the kitchen during the meal.
  Clues: clue_id_1, clue_id_2
- Sylvia Trent (Act 3, Scene 5): Witness statements confirm her presence elsewhere.
  Clues: clue_id_1, clue_id_2

**Culprit Revelation Scene (Act 3, Scene 6):**
Method: Confrontation with Beatrice using all evidence gathered.

**Clue Placement for These Chapters:**
- clue_3 must appear in Act 1, Scene 2 via Direct observation

**VALIDATION CONSEQUENCE:** If these requirements are not met exactly, story validation will fail and the entire generation will be rejected. Follow these specifications precisely.


## ACTIVE CHAPTER MODE CONTRACT (MANDATORY)
Active chapter mode: Early Investigation.
Mode required outcomes:
- Develop clues through contradiction, questioning, or alibi pressure.
- End with changed investigative theory.
Forbidden at this stage:
- No final culprit resolution.
- Do not explain the crime mechanism or state how any device was manipulated. Characters may notice contradictions but must not deduce the full method.
Mode-specific narrative balance targets:
- Setting: 10-15%
- Character Pressure: 35-40%
- Clue Development: 45-50%

## CHAPTER OUTCOME CONTRACT (MANDATORY)
Batch chapters: 2-2.
Investigation state at start: 1 clue(s) revealed to reader; approximately 0 unresolved suspect(s).
Must change by end: Advance contradiction/alibi pressure and change working theory.
Suspect pressure target(s): Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill, Sylvia Trent
Required new information: At least one contradiction, alibi stress, or credibility fracture.
Forbidden reveals at this stage: No final culprit resolution. | Do not explain the crime mechanism or state how any device was manipulated. Characters may notice contradictions but must not deduce the full method.

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
  - Scene is set in: the dining room — reference it naturally within the paragraph, never as your opening phrase.
  - Opening atmosphere (MANDATORY — validator enforced): the first paragraph MUST contain at least one of: rain / wind / fog / storm / mist / thunder / evening / morning / night / dawn / dusk / season / afternoon / midday / noon / midnight / twilight / sunrise / sunset / daylight / sunlight / overcast / cloudy / bright / dark / grey / pale / cold / warm / chill / crisp / damp / drizzle / haze / lamplight / firelight. A chapter that omits all of these from its opening paragraph will be rejected.
  - PARAGRAPH OPENER DIVERSITY (MANDATORY — validator enforced): No more than 2 paragraphs in this chapter may begin with "Hugo" or "Hugo's" as the first word. You must vary paragraph openings throughout: use sensory observations, another character's name or action, dialogue, object or sound details, or temporal markers. Opening 3 or more paragraphs with "Hugo" will cause automated rejection.
  - ⛔ MECHANISM SPOILER BAN: Do NOT state how the crime device was manipulated — not the direction, not the magnitude, not who performed it. Characters may only observe that two sources of evidence disagree. The specific method, tamper amount, and perpetrator's action are ALL FORBIDDEN until the reveal. WRONG: "The culprit had altered the device by forty minutes to create a false alibi." RIGHT: "Two independent pieces of evidence gave contradictory readings — a discrepancy neither could yet explain."
  - Continuity bridge: in the first 120 words, visibly connect from the previous chapter's final beat. Carry forward one unresolved element (object, accusation, emotional pressure, or immediate physical action) from: "He glanced once more at the gathered guests, noting the way their eyes slid away from his, the way their voices dropped to whispers when they thought he could not hear. The storm outside showed no sign of abating, and wi...".
  - CLUE OBLIGATIONS — each clue below MUST be dramatized, but in YOUR OWN WORDS:
    Render each as something a character SEES, DOES, or SAYS on the page. The bracketed text is a
    DESCRIPTION of the evidence for you — do NOT transcribe it as narration. Copying a clue's
    description sentence verbatim into the prose FAILS validation.
    • glass, contained, residue [clue_3] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: eleanor, deliberately, poisoned
      ↳ MANDATORY TWO-PARAGRAPH STRUCTURE (must appear in paragraphs 1 or 2 — no later):
         Paragraph 1: The POV character physically approaches or directly observes this evidence.
           The narration or dialogue explicitly states what is seen (use the exact locked phrase if one applies).
         Paragraph 2 (immediately following): The detective or POV character explicitly reasons
           about what this evidence implies — who it implicates, why it may be unreliable,
           or what inference it supports. This must be a separate full paragraph, not a sentence appended to Paragraph 1.
    • witnesses, eleanor, glass, lemonade [clue_mechanism_visibility_core] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      ⛔ SPOILER EMBARGO (pre-reveal chapter): surface ONLY the surface anomaly a character can see/hear/find.
         Do NOT name who it implicates, state the tamper direction or magnitude, or explain the mechanism in this chapter.
         Present it as an unexplained discrepancy; the culprit and method are revealed later.
         Place this OBSERVATION in paragraph 1 or 2 (observation only — no inference about the culprit).
    • lemonade, source, unverified [clue_core_contradiction_chain] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: eleanor, drink, likely, tampered
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
  - ALIBI LOCK: Beatrice Quill's established alibi is "Time of death". Do NOT place Beatrice Quill at any other location or in any other activity during the crime window. Any contradiction is a continuity error that triggers a retry.
  - TESTIMONY CONTINUITY: Beatrice Quill has already made statements in earlier chapters. Any time, location, or claim attributed to Beatrice Quill in THIS chapter must be consistent with those earlier statements. Do NOT introduce a new or different alibi claim — any contradiction is a continuity error.
- Locked fact phrase obligations:
  - If this batch mentions The pH level required for the poison to activate., write exactly: "three".
  - If this batch mentions The time it takes for the poison to fully dissolve in the lemonade., write exactly: "three hours".
  - If this batch mentions The time the lemonade was delivered to the victim., write exactly: "ten minutes past four".
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
Investigation state at start: 1 clue(s) revealed to reader; approximately 0 unresolved suspect(s).
Must change by end: Advance contradiction/alibi pressure and change working theory.
Suspect pressure target(s): Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill, Sylvia Trent
Required new information: At least one contradiction, alibi stress, or credibility fracture.
Forbidden reveals at this stage: No final culprit resolution. | Do not explain the crime mechanism or state how any device was manipulated. Characters may notice contradictions but must not deduce the full method.

FROZEN FACT STATE (DO NOT ALTER):
- Timeline anchor: February (winter).
- Month, season, weather, and time-of-year language in this batch must stay compatible with winter.
- Established timeline fact: Dinner service commenced at seven o'clock
- Established timeline fact: Eleanor collapsed at eight fifteen
- If referenced, use exact phrase: "three" (The pH level required for the poison to activate.).
- If referenced, use exact phrase: "three hours" (The time it takes for the poison to fully dissolve in the lemonade.).
- If referenced, use exact phrase: "ten minutes past four" (The time the lemonade was delivered to the victim.).

STORY TO DATE (REFERENCE ONLY — DO NOT COPY VERBATIM):
- Full prior chapter text is provided below for continuity, factual consistency, and reference accuracy.
- Use this to keep character voice, chronology, clue state, and location continuity aligned with earlier chapters.
- Do not quote, copy, or paraphrase these paragraphs too closely; write fresh prose that remains consistent with them.

--- BEGIN PRIOR CHAPTER 1 ---
Title: Chapter 1: Shadows Over Supper
A fork clattered to the marble floor, echoing in the hush that followed Eleanor Voss’s collapse. The dining room of the hotel, usually alive with laughter and the muted clink of silverware, was now stilled by the sharp scent of spilled lemonade and the faint chill that crept in from beneath the heavy velvet drapes. Outside, the winter wind battered the windows, rattling them in their frames as dusk pressed against the glass. Eleanor Voss lay sprawled beside her overturned chair, her elegant tea-length dress rumpled, one gloved hand outstretched as if reaching for something just beyond her grasp.

Hugo Vane was the first to move, his shoes silent on the smooth floor as he knelt beside Eleanor. The warm glow of the chandelier cast a pallor over her face, highlighting the unnatural stillness of her features. He pressed two fingers to her wrist, searching in vain for a pulse, while the others hovered at the edges of the scene—caught between disbelief and dread. A glass, half-filled with lemonade, rested precariously on the table, its rim smudged with lipstick. Hugo’s gaze lingered on the condensation tracing rivulets down the glass, recalling that several guests had remarked on Eleanor’s fondness for lemonade, and that she had sipped from this very glass moments before her collapse.

The air in the dining room of the hotel was thick with the scent of roasted lamb and candle wax, but beneath it all, Hugo caught a whiff of something sharper—fear, perhaps, or the metallic tang of panic. He straightened, his voice steady as he addressed the guests, "No one is to leave. I’ll see to the authorities, but until then, we must keep our heads. I’ll take charge of the situation."

Beatrice Quill, the hotel clerk, stood near the sideboard, her hand clutching a sherry glass so tightly that her knuckles blanched. Her wide eyes darted from Eleanor’s motionless form to the faces gathered around the table. "She was just speaking to me," Beatrice whispered, her voice trembling. "She said she felt a bit faint, but I thought it was the cold. It’s always so drafty in here, isn’t it?"

Dr. Mallory Finch, still in her crisp white blouse and tailored skirt, hesitated before stepping forward. Her fingers fumbled with the clasp of her handbag, betraying nerves beneath her professional composure. "I—I should examine her," she murmured, kneeling beside Hugo. Her hand hovered over Eleanor’s wrist, then withdrew. "There’s nothing I can do. She’s gone." Mallory’s tone was gentle, but Hugo noticed the way her gaze flicked to the glass of lemonade, then quickly away.

Captain Ivor Hale, his double-breasted navy suit immaculate despite the chaos, cleared his throat with a practiced authority. "We mustn’t let this descend into hysteria," he said, his jaw set. "Miss Voss was a woman of strong constitution. This—this must be some sudden ailment. Perhaps the war has worn us all thinner than we realize." Yet Hugo saw the captain’s hand drift to his watch chain, fingers tightening as if bracing for a blow.

Sylvia Trent, the journalist, stood apart from the others, her arms folded and her brow arched in a gesture that bordered on skepticism. "Let’s get to the heart of the matter, shall we?" she said, voice cool. "Eleanor was speaking quite animatedly before she collapsed. I saw her take a sip of that lemonade—she even offered a toast. If you ask me, fainting spells don’t usually come on so suddenly." Sylvia’s eyes lingered on Hugo, as if daring him to disagree.

Hugo took a slow breath, letting the details settle in his mind: the overturned chair, the half-empty glass, the hush that had fallen over the dining room of the hotel like a shroud. The storm outside intensified, wind howling down the chimney and making the candle flames gutter. He scanned the faces around him—each marked by shock, but beneath it, something more elusive: calculation, perhaps, or the first stirrings of self-preservation.

Beatrice’s voice, brittle with nerves, broke the silence. "Just a thought, but she did seem out of sorts all evening. I wonder if she ate something that disagreed with her." Her gaze flicked to the kitchen doors, then back to the glass. Hugo noted the defensive tilt of her chin, the way she shifted her weight from foot to foot.

Dr. Mallory Finch offered a wan smile, though her hands trembled as she tucked a stray lock of hair behind her ear. "You know how it is—these things can happen to anyone. The stress, the rationing, the constant news of bombings. It wears on the nerves." Mallory’s voice was gentle, but Hugo caught the edge of something else—relief, perhaps, that the responsibility was no longer hers.

Captain Ivor Hale’s expression hardened. "If you ask me, the hotel’s been too lax about security. Anyone could have come in off the street. We should have stricter protocols." He looked pointedly at Hugo, as if challenging him to take command.

Sylvia Trent’s lips curled into a wry smile. "Or perhaps, Captain, we ought to look a little closer to home. People don’t just drop dead in the middle of dinner without cause." Her words hung in the air, sharp as the scent of lemon that lingered over Eleanor’s untouched plate.

Hugo’s gaze returned to the glass of lemonade. The condensation was still fresh, the lipstick mark vivid. He recalled the moment—Eleanor raising her glass, her voice clear as she toasted to better days ahead. Several guests had witnessed her drink from it before her collapse. The glass, so ordinary, now seemed freighted with significance.

A distant peal of thunder rattled the windowpanes, drawing the group’s attention to the storm raging outside. For a moment, all eyes turned to the darkness beyond the glass, as if expecting answers to materialize from the wintry gloom. The tension in the dining room of the hotel was palpable, each guest acutely aware of the others’ presence—and of the secrets that might be lurking just beneath the surface.

Hugo straightened, surveying the room with a measured calm. "We’ll need to account for everyone’s movements this evening," he said. "But first, let’s see that Eleanor is treated with dignity." He gestured for Dr. Mallory Finch to help him move Eleanor’s body to a more respectful position, away from the spilled lemonade and the overturned chair. The act seemed to steady the group, giving them a task to focus on amid the chaos.

As the guests busied themselves with small, nervous tasks—collecting coats, righting chairs, murmuring reassurances—Hugo allowed himself a brief moment of reflection. The winter night pressed in, thick with the scent of damp wool and the faint trace of coal smoke from the kitchen. Somewhere in the distance, a radio crackled out the latest news of the war, its tinny voice a reminder that the world outside was no less uncertain than the one within these walls.

Beatrice lingered by the sideboard, her eyes never straying far from the glass of lemonade. Sylvia jotted notes in a small, battered notebook, her pen scratching out observations with brisk efficiency. Captain Ivor Hale paced the length of the room, his posture rigid, while Dr. Mallory Finch hovered near Eleanor, her face drawn and pale.

Hugo’s mind worked quietly, cataloguing every detail—the timing of the collapse, the witnesses’ statements, the physical evidence. The presence of the half-empty glass, the recollection of Eleanor’s toast, and the fact that several guests had seen her drink from it just before she fell—all these formed the first fragile thread of suspicion. Something about the scene nagged at him, a contradiction he could not yet name.

He glanced once more at the gathered guests, noting the way their eyes slid away from his, the way their voices dropped to whispers when they thought he could not hear. The storm outside showed no sign of abating, and within the dining room of the hotel, suspicion settled as surely as the winter darkness. Hugo Vane, now the investigator by necessity and by silent consent, resolved that he would not rest until he understood what had truly happened to Eleanor Voss.
--- END PRIOR CHAPTER 1 ---

[SCENE COMPLETENESS CONTRACTS — MANDATORY. Each contract below lists what you MUST enact in that chapter. Do not summarise or mention these labels in the prose — enact them organically.]
Chapter 2 (Act 1) completeness contract:
  PIVOT ELEMENT (MANDATORY — write this into the prose, shown not told): "A half-empty glass of lemonade on the table."
  FACT ESTABLISHED (MANDATORY — reader must know this by chapter end): "Establishes that Eleanor was drinking lemonade before her collapse, hinting at tampering."
  RED HERRING (MANDATORY — seed naturally, not flagged as false): [rh_2] Captain Ivor Hale mentions Eleanor's fainting spells — seeds false inference about her health.

# Case Overview
Title: The Taste of Betrayal
Era: 1940s
Setting: Brighton
Crime: murder (delayed-action poisoning)
Culprit: Beatrice Quill
Victim: Eleanor Voss
False assumption: Eleanor Voss died from an unexpected health crisis.
Cast: Eleanor Voss (she/her), Dr. Mallory Finch (she/her), Captain Ivor Hale (he/him), Beatrice Quill (she/her), Sylvia Trent (she/her), Hugo Vane (he/him)

Setting Lock: Keep all scenes and descriptions consistent with the stated setting (Brighton). Do not introduce a different location type. Do not invent an alternative estate name. The only permitted name for this property is "Brighton" — any other estate name (e.g., "Caldwell Manor", "Ashwood Hall", or any invented proper name) is a continuity error that will be caught and rejected.

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
      "location": "the dining room",
      "timeOfDay": "Moments after discovery",
      "atmosphere": "Heightened tension as guests react to the situation"
    },
    "characters": [
      "Hugo Vane",
      "Dr. Mallory Finch",
      "Captain Ivor Hale",
      "Beatrice Quill",
      "Sylvia Trent"
    ],
    "purpose": "Establish the immediate reactions of the witnesses and the initial investigation.",
    "cluesRevealed": [
      "clue_mechanism_visibility_core",
      "clue_3",
      "clue_core_contradiction_chain"
    ],
    "dramaticElements": {
      "conflict": "Guests argue over what happened.",
      "tension": "Conflicting accounts of Eleanor's last moments.",
      "microMomentBeats": [
        "Hugo's brow furrows as he listens to conflicting stories."
      ]
    },
    "summary": "As the group gathers around Eleanor's lifeless body, panic ensues. Dr. Mallory Finch attempts to assess the situation, while Hugo Vane observes the conflicting accounts from the witnesses. A glass of lemonade sits on the table, sparking suspicion among the guests.",
    "beat": "crime",
    "estimatedWordCount": 1250,
    "pivotElement": "A half-empty glass of lemonade on the table.",
    "factEstablished": "Establishes that Eleanor was drinking lemonade before her collapse, hinting at tampering.",
    "permittedBehavioursByAct": [
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
    "redHerringPlacement": {
      "redHerringId": "rh_2",
      "placementDetail": "Captain Ivor Hale mentions Eleanor's fainting spells — seeds false inference about her health."
    },
    "emotionalRegister": "The investigation begins, revealing the suspects' hidden motives.",
    "dominantCharacterNote": {
      "name": "Dr. Mallory Finch",
      "voiceRegister": "Mallory speaks with a gentle cadence, punctuated by self-deprecating humor."
    },
    "humourGuidance": {
      "permission": "forbidden"
    },
    "eraTextureNote": "Short daylight hours with the sun setting around five in the afternoon; Rationing affecting availability of goods; Difficulties in transportation due to wartime measures; Limited access to communication technology; Strong coastal winds affecting outdoor activities",
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
□ Chapter 2: the clue [clue_3] (half, empty, glass, lemonade, contain, traces, botanical, poison) is placed in the first 25% of the chapter, dramatized in your own words, followed by an explicit inference or suspicion paragraph.
□ Chapter 2: the clue [clue_mechanism_visibility_core] (witnesses, confirm, eleanor, drinking, glass, lemonade, before, collapse) is placed in the first 25% of the chapter, dramatized in your own words, followed by an explicit inference or suspicion paragraph.
□ Chapter 2: the clue [clue_core_contradiction_chain] (eleanor, drink, likely, tampered, since, lemonade, provided, restaurant) is placed in the first 25% of the chapter, dramatized in your own words, followed by an explicit inference or suspicion paragraph.
□ First chapter in this batch opens by continuing the previous chapter closing beat (same unresolved object, question, movement, or emotional pressure).
□ For every chapter after Chapter 1, include at least one NEW character pressure reveal (fear, motive, lie, loyalty conflict, or victim relationship).
□ Each post-Chapter-1 character reveal changes investigation state (more/less suspicious, lie explained, motive exposed, emotional cost deepened, or investigator understanding updated).
□ No post-Chapter-1 chapter contains static biography-only character paragraphs.
□ Mode check (Early Investigation): chapter includes contradiction/alibi pressure and changes the investigator's working theory.
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
