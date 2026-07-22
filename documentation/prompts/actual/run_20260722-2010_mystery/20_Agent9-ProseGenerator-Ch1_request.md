# Actual Prompt Record

- Run ID: `mystery-1784751055781`
- Project ID: ``
- Timestamp: `2026-07-22T20:21:17.173Z`
- Agent: `Agent9-ProseGenerator-Ch1`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4.1`
- Temperature: `0.42`
- Max Tokens: `4500`
- Attempt: `first`
- Prompt Hash: `fb7115c4d6bb3146`

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
- MORAL COMPLEXITY REQUIREMENT: The mechanism of this crime carries a moral gray area: "The culprit acted out of desperation to protect a loved one from financial ruin, evoking a sense of sympathy despite the crime's gravity." — the culprit reveal and denouement MUST acknowledge this ambiguity. Do not let the ending feel clean or simple. Give the reader at least one moment of uncomfortable sympathy or moral doubt.

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
   - Dr. Mallory Finch: Compassionate Healer
   - Captain Ivor Hale: Traditionalist
   - Beatrice Quill: Daring Truth-Seeker
   - Sylvia Trent: Wealthy Matriarch
   - Hugo Vane: Ambitious Innovator
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

- Hugo Vane
  Public identity anchor: Entrepreneur; detective 
  Connection to victim: Old friends with faltering trust; Hugo feels Eleanor has betrayed him by denying his business proposals, leading to a fragile connection..
  Investigation relevance: is actively driving interviews and credibility checks in this scene.
  Suspicion/pressure cue seed: Professional reputation.
  Investigator read: include one immediate observational inference (gesture, gaze target, pause, object grip), but do not state guilt as fact.

- Captain Ivor Hale
  Public identity anchor: Retired Navy Officer; suspect 
  Connection to victim: Mutual respect with hidden grievances; Eleanor relied on Captain Hale's military connections during the hotel’s establishment, but both are wary of each other's past decisions..
  Investigation relevance: access plausibility: high | alibi window: 9:00 PM to 10:00 PM.
  Suspicion/pressure cue seed: Financial stability.
  Investigator read: include one immediate observational inference (gesture, gaze target, pause, object grip), but do not state guilt as fact.

- Dr. Mallory Finch
  Public identity anchor: Physician; suspect 
  Connection to victim: Long-term acquaintances with unspoken rivalry; Eleanor and Dr. Mallory Finch have a history of competing in social circles, with Mallory's affections for Eleanor's husband a painful secret..
  Investigation relevance: access plausibility: high | alibi window: 8:00 PM to 9:30 PM.
  Suspicion/pressure cue seed: Career at stake.
  Investigator read: include one immediate observational inference (gesture, gaze target, pause, object grip), but do not state guilt as fact.

- Beatrice Quill
  Public identity anchor: Journalist; suspect 
  Connection to victim: Professional tension
[truncated for prompt budget]

WORLD DOCUMENT (use this as your primary creative context):

## Era: 1947-09
In September 1947, the Clifftop Grand Hotel stands as a microcosm of post-war Britain, where the lingering effects of World War II still echo through society. The air is thick with an atmosphere of uncertainty as the nation grapples with the complexities of recovery and the shifting social landscape. Guests at the hotel navigate the delicate balance of maintaining appearances while concealing their personal struggles. With the Cold War looming, mistrust permeates interactions, and the tension between the old social hierarchies and emerging equality creates a palpable unease. Women are increasingly stepping into roles outside the home, challenging traditional norms, and the clientele at the hotel reflects this changing dynamic. The weather, typically overcast with occasional rain, mirrors the emotional state of the guests — a blend of hope, fear, and the quest for stability in a world rife with secrets.
Emotional register: A collective sentiment of anxiety, mixed with hope for a better future.
Physical constraints: Limited public transport due to fuel rationing | Communication challenges with the recent rise of television and radio | Social gatherings are often constrained by strict dress codes
Current tensions (weave into background texture): The ongoing Cold War affecting global politics | Post-war recovery efforts in Europe | The establishment of the United Nations and its growing role
Wartime context — Many veterans are struggling to reintegrate into civilian life, facing challenges in employment and social acceptance.: Communities are bonding over shared experiences of loss and recovery, yet tensions simmer beneath the surface as class dynamics shift. Absence effect: The absence of men who served in the war creates a vacuum in families and communities, leading to changing gender roles and expectations.

## Story Theme
In a world fraught with secrets and hidden agendas, the quest for truth often reveals the darker facets of human nature and the fragility of relationships.

## Story Emotional Register
Dominant: A journey from tension to revelation, exploring the fragility of human relationships amidst hidden secrets.

Arc:
The story unfolds in the opulent yet tense atmosphere of the Clifftop Grand Hotel, where guests are drawn into the web of a murder mystery after Eleanor Voss is found strangled. The initial discovery of the crime casts a shadow over the gathering, with the clock showing ten minutes past ten, marking the moment of unease that permeates the hotel. As the investigation begins, the emotional cost of secrets becomes evident, with each character grappling with their hidden truths. The rising tide of suspicion leads to early clues and false leads, causing emotional upheaval as loyalties are tested and friendships strain. A pivotal moment occurs when the detective, Hugo Vane, uncovers evidence of clock tampering, redirecting the investigation and intensifying the atmosphere of dread. As new revelations unfold, the characters’ pasts intertwine, recoloring earlier events and forcing them to confront their decisions. The pressure mounts leading to the climax, where truths are laid bare in a tense confrontation. The resolution reveals deep emotional costs for each character, as they must reckon with the aftermath of the murder and the impact of their choices, leaving them forever changed as they navigate a world where trust has been irrevocably shattered.

The story opens: The initial atmosphere is one of opulence tinged with unease as the guests gather, unaware of the tragedy about to unfold. As the investigation takes shape: The investigation begins, revealing the emotional turmoil as characters confront their secrets. A first key turn arrives: A pivotal moment occurs when the detective uncovers the clock tampering, shifting the investigation's direction. At the mid-point of the story: The revelation of deeper connections among characters heightens the tension, forcing them to confront their pasts.

A second pivot reshapes the course: A confrontation reveals hidden agendas, escalating the stakes and emotions among the characters.

## Emotional register at this point in the story
The initial atmosphere is one of opulence tinged with unease as the guests gather, unaware of the tragedy about to unfold.

## Character Portraits (appearance & era)

### Dr. Mallory Finch
Dr. Mallory Finch, a physician advocating for women's rights, mirrors the evolving gender roles of the 1940s. Her past affair with Eleanor's husband places her in a precarious position, reflecting the moral complexities of women navigating personal ambitions amidst societal expectations. As she grapples with her own insecurities and the fear of exposure, her journey symbolizes the internal conflicts faced by women striving for progress while being tethered to their past.
Era intersection: Mallory's struggle against her past reflects the societal challenges women faced in claiming their professional identities.

### Captain Ivor Hale
Captain Ivor Hale represents the traditional male figure caught in the shifting dynamics of post-war Britain. His wartime actions haunt him, revealing the complexity of a man once held in high esteem now facing the consequences of his past decisions. As the country grapples with its identity post-conflict, Ivor's struggle to maintain his family's honor amidst personal turmoil reflects the broader societal tension between past glories and present realities.
Era intersection: Ivor's internal conflict highlights the societal pressure on men to uphold traditional values while reconciling their wartime experiences.

### Beatrice Quill
Beatrice Quill, an ambitious journalist, embodies the spirit of post-war exploration and the quest for truth. Her investigation into Eleanor's past represents the journalistic pursuit of accountability in a society eager for transparency. However, her internal conflict over the ethics of her ambition highlights the moral dilemmas faced by many as they navigate opportunities in a rapidly changing world, where ambition often clashes with personal integrity.
Era intersection: Beatrice's ambition reflects the journalistic drive of the era, representing women's increasing presence in the workforce.

### Sylvia Trent
Sylvia Trent, a well-connected socialite, navigates the precariousness of her financial dependence on Eleanor. Her struggle for social status amidst the changing landscape of post-war Britain underscores the tension of maintaining appearances while facing the risk of exposure. As the old social hierarchies begin to wane, Sylvia's character illustrates the challenges women face in an evolving society that demands both independence and conformity.
Era intersection: Sylvia's financial struggles echo the societal pressures on women to either conform to traditional roles or seek greater independence.

### Hugo Vane
Hugo Vane, a charismatic entrepreneur, grapples with the tension between friendship and ambition. This internal conflict reflects the changing dynamics of male relationships in a post-war society, where traditional expectations are challenged by new opportunities. His frustration with Eleanor's refusal to support his ventures symbolizes the broader struggle of men reconciling their ambitions with their personal relationships in a shifting world.
Era intersection: Hugo's character exemplifies the societal pressure on men to succeed while navigating the complexities of friendship and loyalty.

## Character Voices

### Dr. Mallory Finch (she/her/her)
Mallory speaks with a directness that can be disarming, her words often laced with dry humor that reflects her struggle to maintain composure amidst chaos.
[comfortable] Well, that's one way to complicate matters, isn't it? But we must carry on.
[evasive] I believe it’s best we not dwell on the past; the future is what truly matters.
[stressed] I can assure you, I had no involvement. My focus is entirely on my patients.
Humour: Mallory's dry wit provides a sharp contrast to her serious circumstances.

### Captain Ivor Hale (he/him/his)
Ivor speaks in a gruff, no-nonsense manner, often punctuated by self-deprecating humor that reveals his inner turmoil and vulnerability.
[comfortable] We all have our battles, don’t we? It’s the nature of life.
[evasive] Let’s not get bogged down by the past. There’s nothing to gain from it.
[stressed] I can assure you, my actions were in service of my country. Nothing more.
Humour: Ivor's self-deprecating humor serves as a mask for his inner conflict.

### Beatrice Quill (she/her/her)
Beatrice speaks with an intense fervor, her words often rapid and punctuated by sardonic observations that reflect her sharp wit and determination.
[comfortable] Truth is a slippery fish, isn’t it? But I’m determined to catch it.
[evasive] Isn’t it better to leave some stones unturned? There’s no need to dig deeper.
[stressed] I can’t afford to fail now. This could be my chance to finally make it.
Humour: Beatrice’s sardonic humor often serves as a coping mechanism for her ambition.

### Sylvia Trent (she/her/her)
Sylvia speaks with a refined elegance that masks her insecurities, often using polite yet cutting remarks to deflect attention from her vulnerabilities.
[comfortable] Oh dear, how terribly inconvenient. Is it too much to ask for a little discretion?
[evasive] Let’s not dwell on such things; it’s best to keep the peace, don’t you think?
[stressed] I assure you, my interests in the project are purely philanthropic.
Humour: Sylvia's polite savagery often reveals her internal conflicts.

### Hugo Vane (he/him/his)
Hugo speaks with an engaging style, often weaving in observational humor that reflects his sharp intellect and frustration with the situation.
[comfortable] Ah, the irony of it all! We’re all trapped in our little dramas, aren’t we?
[evasive] Let’s just say, it’s best to keep some cards close to the chest.
[stressed] I can’t afford to lose everything just because of someone else’s mistakes.
Humour: Hugo's observational humor often lightens the tension in serious discussions.

## Location Registers (scene framing guides)

Seaside Veranda: The once vibrant terrace now feels oppressive, filled with the echoes of laughter that have turned to whispers of suspicion. The atmosphere is heavy with the scent of spilled wine and salt, creating a backdrop that mirrors the chaos of the events that transpired here.. Camera angle: As a writer enters this space, the emotional weight of the past lingers, inviting them to explore the shadows of human nature.. Era: The overcast skies reflect the emotional turmoil of the characters as they confront their secrets.

Drawing Room: This room, filled with laughter and music, now harbors a tense undercurrent of suspicion. The scent of fresh coffee mingles with cigarette smoke, creating an atmosphere where secrets are exchanged in hushed tones and every glance is laden with meaning.. Camera angle: Entering this space, the writer should feel the tension simmering just beneath the surface, waiting to erupt.. Era: The decor reflects the elegance of the 1940s, yet the emotional atmosphere is thick with strain.

Hotel Kitchen: The bustling kitchen, once a place of comfort and nourishment, now feels frantic and chaotic, echoing the emotional turmoil of the investigation. The rich aromas of cooking are overshadowed by the tension among the staff, who navigate their own secrets while preparing for the evening's events.. Camera angle: As a writer enters this space, they should sense the heartbeat of the hotel, filled with both opportunity and hidden agendas.. Era: The kitchen's activity contrasts sharply with the uncertainty felt by the guests in the hotel.

Rooftop Terrace: The terrace, with its breathtaking views, now feels like a stage for hidden emotions and whispered confessions. The wind carries the weight of secrets, and the beauty of the surrounding landscape contrasts sharply with the turmoil brewing within the guests.. Camera angle: As the writer steps onto the terrace, they should feel the tension in the air, a mix of anticipation and fear of what is to come.. Era: The clear skies at sunset create a fleeting moment of peace before the storm of revelations.

## Humour guidance for this story position (opening)
Permission: forbidden
Rationale: The tone is serious as the murder is introduced.

FAIR-PLAY AND INFERENCE CONTRACT:
- FAIR PLAY CLUE TIMING: Never combine clue discovery and detective deduction in the same chapter. If a clue is first revealed to the reader in chapter N, the detective may only analyze, deduce from, or act on that clue in chapter N+1 or later.
- FAIR PLAY INFORMATION PARITY: The reader must see all clues BEFORE the detective uses them in reasoning. If the detective performs a test or makes a deduction, every piece of evidence supporting that conclusion must have been shown to the reader in earlier chapters.
- FAIR PLAY REVELATION SPACING: In the discriminating test scene, the detective can ONLY use clues that were revealed to the reader at least 1 full chapter earlier. Never introduce new clues or withheld information during the test.
- FAIR PLAY CONFRONTATION: During the final confrontation/revelation, the detective cannot surprise the reader with facts. Every piece of evidence cited must have been visible to the reader in prior chapters.
- Never solve by withheld information. Keep reader-information parity with detective reasoning.
- False assumption in force: The victim died during the party as indicated by the clock.
- Hidden truth to progressively expose (compose in your own words from these elements): actual, time, death, before, party, began
- Inference path checkpoints to dramatize clearly — compose ENTIRELY in your own sentences from these key terms (reproducing any briefing phrase verbatim FAILS validation):
  - Step 1: obs: clock, shows, time, minutes, past | corr: clock, tampered, show, false, time | effect: narrows, clock, condition
  - Step 2: obs: victim, watch, shows, different, time, clock | corr: indicates, clock, tampered | effect: eliminates, time, indicated, clock, death
  - Step 3: obs: scratch, marks, clock, indicate, recent, tampering | corr: recent, tampering, suggests, premeditation | effect: narrows, suspect, pool, access, clock
- Discriminating test method: trap
- Discriminating test elements to dramatize (compose ENTIRELY in your own sentences from these — do NOT reproduce any briefing phrase verbatim): time, indicated, victim, watch, clock, proves, tampered, show, false
- Test must rely on already-shown clue IDs: clue_core_contradiction_chain, clue_2, clue_1, clue_fp_contradiction_step_2
- Fair-play rationale: Step 1: The clock's time and witness accounts (early) show the victim's death was misrepresented. Step 2: The victim's watch contradicts the time indicated by the clock (mid). Step 3: Scratch marks on the clock indicate tampering (discriminating test) and show only Captain Hale could have done it.

## Character Reference

### Dr. Mallory Finch (she/her — NEVER he/him)
Mallory speaks with a directness that can be disarming, her words often laced with dry humor that reflects her struggle to maintain composure amidst chaos.
Mallory is tormented by her past affair and the moral implications of her actions, grappling with feelings of guilt and resentment.
Voice colour: Dr. Mallory Finch uses dry wit humour — let it surface in their dialogue where natural, not in every line.

### Captain Ivor Hale (he/him — NEVER she/her)
Ivor speaks in a gruff, no-nonsense manner, often punctuated by self-deprecating humor that reveals his inner turmoil and vulnerability.
Ivor struggles with the burden of his wartime actions and the fear of losing everything he has fought to protect.
Voice colour: Captain Ivor Hale uses self deprecating humour — let it surface in their dialogue where natural, not in every line.

### Beatrice Quill (she/her — NEVER he/him)
Beatrice speaks with an intense fervor, her words often rapid and punctuated by sardonic observations that reflect her sharp wit and determination.
Beatrice wrestles with the ethics of her pursuit, torn between ambition and the potential harm her story could cause.
Voice colour: Beatrice Quill uses sardonic humour — let it surface in their dialogue where natural, not in every line.

### Sylvia Trent (she/her — NEVER he/him)
Sylvia speaks with a refined elegance that masks her insecurities, often using polite yet cutting remarks to deflect attention from her vulnerabilities.
Sylvia struggles with her dependency on Eleanor and the fear of losing her social standing, leading to feelings of inadequacy.
Voice colour: Sylvia Trent uses polite savagery humour — let it surface in their dialogue where natural, not in every line.

### Hugo Vane (he/him — NEVER she/her)
Hugo speaks with an engaging style, often weaving in observational humor that reflects his sharp intellect and frustration with the situation.
Hugo struggles with feelings of betrayal and frustration towards Eleanor, torn between friendship and ambition.
Voice colour: Hugo Vane uses observational humour — let it surface in their dialogue where natural, not in every line.


## CHARACTER CONTRACTS (binding for this scene)
Each entry below constrains how this character must be written in this chapter.
These override generic style guidance when they conflict.

### Dr. Mallory Finch[SHE]
Voice & mannerisms: Mallory speaks with a directness that can be disarming, her words often laced with dry humor that reflects her struggle to maintain composure amidst chaos.
SIGNATURE TIC (use sparingly — this is Dr. Mallory Finch's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "Well, that's one way to complicate matters."
Sample voice fragments (match this register and rhythm):
  [comfortable] "Well, that's one way to complicate matters, isn't it? But we must carry on."
  [evasive] "I believe it’s best we not dwell on the past; the future is what truly matters."
Humour: dry wit — deploy occasionally (level 0.5)
FORBIDDEN phrase (never write for Dr. Mallory Finch): "a surge of determination washed over her"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Bitter about Eleanor's unyielding moral superiority and the resurfacing of past secrets." — do not surface in Act I.

### Captain Ivor Hale[HE]
Voice & mannerisms: Ivor speaks in a gruff, no-nonsense manner, often punctuated by self-deprecating humor that reveals his inner turmoil and vulnerability.
SIGNATURE TIC (use sparingly — this is Captain Ivor Hale's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "We all have our battles, don’t we?"
Sample voice fragments (match this register and rhythm):
  [comfortable] "We all have our battles, don’t we? It’s the nature of life."
  [evasive] "Let’s not get bogged down by the past. There’s nothing to gain from it."
Humour: self deprecating — deploy occasionally (level 0.4)
FORBIDDEN phrase (never write for Captain Ivor Hale): "she knew with certainty she was right"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Desperation to keep his dark history buried and protect his family's image." — do not surface in Act I.

### Beatrice Quill[SHE]
Voice & mannerisms: Beatrice speaks with an intense fervor, her words often rapid and punctuated by sardonic observations that reflect her sharp wit and determination.
SIGNATURE TIC (use sparingly — this is Beatrice Quill's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "Truth is a slippery fish, isn’t it?"
Sample voice fragments (match this register and rhythm):
  [comfortable] "Truth is a slippery fish, isn’t it? But I’m determined to catch it."
  [evasive] "Isn’t it better to leave some stones unturned? There’s no need to dig deeper."
Humour: sardonic — deploy occasionally (level 0.6)
FORBIDDEN phrase (never write for Beatrice Quill): "palpable tension filled the room"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Seeks to publish a story that could redeem her career and gain recognition." — do not surface in Act I.

### Sylvia Trent[SHE]
Voice & mannerisms: Sylvia speaks with a refined elegance that masks her insecurities, often using polite yet cutting remarks to deflect attention from her vulnerabilities.
SIGNATURE TIC (use sparingly — this is Sylvia Trent's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "Oh dear, how terribly inconvenient."
Sample voice fragments (match this register and rhythm):
  [comfortable] "Oh dear, how terribly inconvenient. Is it too much to ask for a little discretion?"
  [evasive] "Let’s not dwell on such things; it’s best to keep the peace, don’t you think?"
Humour: polite savagery — deploy occasionally (level 0.5)
FORBIDDEN phrase (never write for Sylvia Trent): "she felt a wave of unease"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Could face financial ruin if Eleanor's hospital project fails, exposing her financial secrets." — do not surface in Act I.

### Hugo Vane[HE]
Voice & mannerisms: Hugo speaks with an engaging style, often weaving in observational humor that reflects his sharp intellect and frustration with the situation.
SIGNATURE TIC (use sparingly — this is Hugo Vane's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "Ah, the irony of it all."
Sample voice fragments (match this register and rhythm):
  [comfortable] "Ah, the irony of it all! We’re all trapped in our little dramas, aren’t we?"
  [evasive] "Let’s just say, it’s best to keep some cards close to the chest."
Humour: observational — deploy occasionally (level 0.6)
FORBIDDEN phrase (never write for Hugo Vane): "everyone could sense the atmosphere"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Frustrated with Eleanor's refusal to invest in his ventures after years of friendship, seeing her as an obstacle." — do not surface in Act I.



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

Primary Location: Clifftop Grand Hotel (Brighton, England)
A grand seaside hotel with Victorian and Art Deco elegance overlooking the tumultuous sea, harboring secrets among its guests.

Key Locations Available:
- Seaside Veranda (exterior): Crime scene
- Drawing Room (interior): Social gathering space
- Hotel Kitchen (interior): Staff-only area for food preparation
- Rooftop Terrace (exterior): Restricted access area for special events

Atmosphere (tonal cue only — do NOT reproduce this phrase verbatim in prose; translate into scene-specific, character-observed sensory language): tense, with an undercurrent of suspicion among the guests
Weather: overcast with occasional rain, typical of coastal climates

Era markers: faded radio broadcasts in the background | early television set flickering in the lounge | post-war automobile parked in the lot | rationed fuel posters on the walls

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
Seaside Veranda (exterior):
  - Visual: dark storm clouds rolling in, flickering candlelight on tables, ocean waves crashing against rocks
  - Sounds: howling wind through the railings, distant thunder rumbling, dripping water from the awning
  - Scents: fresh sea salt and damp earth, spilled wine and citrus, wet wood and metal
  - Touch: cold metal railing, rough stone underfoot

Drawing Room (interior):
  - Visual: ornate chandelier sparkling overhead, richly patterned wallpaper, piano keys gleaming in the light
  - Sounds: soft music playing from the piano, quiet laughter of guests, rustling of newspapers
  - Scents: freshly brewed coffee, old books and leather, cigarette smoke lingering
  - Touch: soft velvet cushions, cool porcelain teacups

Hotel Kitchen (interior):
  - Visual: gleaming pots and pans hanging, steam rising from boiling pots, chefs in crisp white uniforms
  - Sounds: clattering of dishes, sizzling of food on the grill, muffled conversations of staff
  - Scents: rich aroma of roasting meats, fresh herbs and spices, sweet scent of pastries baking
  - Touch: smooth marble countertops, hot metal of pots

⛔ REFERENCE DATA — DO NOT TRANSCRIBE VERBATIM: The above profiles are structural guides only. Generate original prose that evokes these qualities; do not reproduce the exact phrasing or sentence structure of the profile paragraphs.

SCENE OPENING RULE: When opening a scene in a new location, write what the POV character directly observes and physically senses at that moment — not a general description of the room's qualities. The reader must feel
[truncated for prompt budget]

## Texture Pool
Draw on these as opportunities arise — you are not required to use them.

- In September 1947, the Clifftop Grand Hotel stands as a microcosm of post-war Britain, where the lingering effects of World War II still echo through society
- The air is thick with an atmosphere of uncertainty as the nation grapples with the complexities of recovery and the shifting social landscape
- Guests at the hotel navigate the delicate balance of maintaining appearances while concealing their personal struggles
- With the Cold War looming, mistrust permeates interactions, and the tension between the old social hierarchies and emerging equality creates a palpable unease
- Women are increasingly stepping into roles outside the home, challenging traditional norms, and the clientele at the hotel reflects this changing dynamic

TEMPORAL CONTEXT:

This story takes place in September 1947 during N/A.

Seasonal Atmosphere:
- Weather patterns: overcast with occasional rain, cool breezes from the coast, occasional bursts of sunlight
- Daylight: Shorter days with sunset around six-thirty in the evening, making the evenings feel especially dark and tense.
- Seasonal activities: attending harvest festivals, visiting local fairs, enjoying evening strolls along the beach
- Seasonal occasions: Labor Day (observed on the first Monday of September)
- Season: N/A

Period Fashion (describe naturally):
- Men formal: double-breasted suit jackets, fedoras, oxford shoes
- Men casual: tweed jackets, button-up shirts with rolled sleeves, slacks
- Men accessories: silk ties, cufflinks, leather gloves
- Women formal: tea-length dresses with fitted waists, pearl necklaces, gloves
- Women casual: A-line skirts paired with fitted blouses, cardigans, simple flats
- Women accessories: wide-brimmed hats, vintage brooches, handbags

Cultural Context (reference naturally):
- Music/entertainment: Bing Crosby's 'White Christmas', Ella Fitzgerald's jazz standards, the rise of big band sounds; Films: 'Gentleman's Agreement', 'Miracle on 34th Street'; Theatre: Broadway's 'Annie Get Your Gun', the rise of regional theater productions; Radio: 'The Jack Benny Program', 'Fibber McGee and Molly'
- Typical prices: Loaf of bread: four pence, Cigarettes: one shilling, Movie ticket: one shilling and sixpence
- Current events: the ongoing tension of the Cold War affecting global politics; post-war recovery efforts in Europe
- Literature: 'The Catcher in the Rye' by J.D. Salinger | 'The Naked and the Dead' by Norman Mailer | 'The Hilliker Curse' by James Salter | [detective fiction] | [post-war drama] | [romantic novels]
- Technology: the transistor radio | the first commercial television broadcasts | the development of the jet engine | bicycles as a primary mode of transport | early television sets with limited programming | radios in homes and cars
- Daily life: family dinners on Sundays, community gatherings at local churches, attending outdoor markets
- Social rituals: formal tea times among women, men's poker nights, community potlucks

Atmospheric Details:
The scent of rain on damp pavement mixed with salty sea air hung heavily in the hotel lobby. The low murmur of conversations blended with the crackling of a nearby radio, broadcasting the latest news of unrest abroad. Shadows danced along the ornate wallpaper, creating an atmosphere thick with tension, as guests exchanged furtive glances.

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
- Authentic references: Use
[truncated for prompt budget]

NON-NEGOTIABLE CHAPTER OBLIGATIONS — LOCKED EVIDENCE VALUES (VERBATIM REQUIRED):
The following measured values (times, amounts, measurements) are absolute ground truth. Every time this chapter describes, mentions, or alludes to one — no matter how briefly — it MUST use the exact phrase shown below, character for character. NO paraphrase, approximation, rounding, or synonym is permitted.

FAILURE EXAMPLE: if the locked value is "at thirteen minutes to midnight" and you write "just before midnight" or "around midnight" — that is a HARD FAIL. You must write "at thirteen minutes to midnight". Equally, if the locked value is written in words, such as "ten minutes past eleven", and you convert it to figure-based clock notation — that is also a HARD FAIL. Words stay as words; figure forms are forbidden for word-phrased facts.

CRITICAL — WORD-PHRASED VALUES: If the canonical value is written out in words (e.g. a time like "ten minutes past eleven", or an amount like "forty minutes"), reproduce those exact words. DO NOT convert to figure-based time notation, twenty-four-hour format, or any other numeric shorthand. Correct: "ten minutes past eleven". WRONG: figure-based clock notation or numeric shorthand.

Locked values:
  - The clock shows this time when the guests arrive.: "ten minutes past ten"
    ⛔ FORBIDDEN alternatives: "10:10", "10.10", "ten ten", "ten-ten", "ten past ten", "quarter past ten", "half past ten" — the ONLY acceptable form is "ten minutes past ten"
  - The victim died at this time, revealing the clock's deceit.: "half past eight"
    ⛔ FORBIDDEN alternatives: "8:30", "8.30", "eight thirty", "eight-thirty", "eight past thirty", "quarter past eight" — the ONLY acceptable form is "half past eight"

If a value has no relevance to this chapter, omit it. But the moment you reference the underlying evidence, only the exact phrase above is acceptable.

⚠ CENTRAL CONTRADICTION (the heart of the mystery): the two locked values "ten minutes past ten" and "half past eight" are NOT two separate facts — they are ONE contradiction (one is a staged appearance, the other the true state; the evidence determines which). If this chapter references both, you MUST present them AS A SINGLE CONTRAST joined by a contrast connective (but / yet / however / could only / whereas) — e.g. "the watch showed the one time, yet the evidence proved it could only have been the other" — making clear which reading is the appearance and which is the truth. NEVER state them as two flat, side-by-side truths — that makes the central clue read as if it contradicts itself.

⛔ CLUES TO SURFACE IN THESE CHAPTERS — mandatory:
The following evidence MUST be clearly observable to an attentive reader. Do not bury it in atmosphere or passing dialogue. Each clue must be concrete, specific, and noticeable:

• [clue_1] clock, shows, time, minutes, past
  Category: temporal | Criticality: essential | Supports inference step 1
  Later significance (context for YOU — do NOT state this in the prose; meaning surfaces only at the licensed deduction beats): time, arrival, guests

For each clue above: an attentive reader should be able to find, record, and later use it to reason toward the solution.

═══ NARRATIVE STATE (read-only — do not contradict) ═══

LOCKED FACTS — use verbatim whenever this evidence is described:
  • The clock shows this time when the guests arrive.: "ten minutes past ten"
  • The victim died at this time, revealing the clock's deceit.: "half past eight"

CHARACTER PRONOUNS — never deviate from these:
  • Eleanor Voss: she/her/her
  • Dr. Mallory Finch: she/her/her
  • Captain Ivor Hale: he/him/his
  • Beatrice Quill: she/her/her
  • Sylvia Trent: she/her/her
  • Hugo Vane: he/him/his

INVESTIGATION LOG — WHAT IS ESTABLISHED (do not re-establish, do not repeat):
• Suspect cleared: Dr. Mallory Finch[SHE] — Solid alibi verified by multiple witnesses.
• Suspect cleared: Beatrice Quill[SHE] — Broken necklace was from a different incident.
• Suspect cleared: Sylvia Trent[SHE] — No motive or opportunity.
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
Known location profile anchors: Clifftop Grand Hotel, Seaside Veranda, Drawing Room, Hotel Kitchen, Rooftop Terrace, the seaside hotel ballroom
LOCATION NAME CAPITALISATION (HARD REQUIREMENT — validated):
All named locations in your prose MUST use the EXACT capitalisation from the CML profiles.
Canonical forms: "Clifftop Grand Hotel", "Seaside Veranda", "Drawing Room", "Hotel Kitchen", "Rooftop Terrace", "the seaside hotel ballroom"
Writing a location in lowercase (e.g. "drawing room" instead of "Drawing Room") is a validated error. Every time you mention a named location, copy its capitalisation from the list above.
- Chapter 1: OPENING STYLE (HARD): Start the VERY FIRST SENTENCE with a named character performing a physical action or motion — e.g. "[Name] crossed the threshold…" / "[Name] set down the glass…" / "[Name] rose from the chair…". Anchor opening in "the seaside hotel ballroom". The opening style above governs only your FIRST SENTENCE; the grounding below may land anywhere in the first 2 paragraphs (it need not be sentence one, and never conflicts with the chosen opening style). HARD REQUIREMENT for the first 2 paragraphs: (a) include 2+ sensory words — choose from smell/scent/odor/fragrance/sound/echo/silence/whisper/creak/cold/warm/damp/rough/smooth/glow/shadow/flicker/dim — and (b) include 1+ atmosphere/time word — choose from rain/wind/fog/storm/mist/thunder/evening/morning/night/dawn/dusk/lighting/weather/season/afternoon/midday/noon/midnight/twilight/sunrise/sunset/daylight/sunlight/overcast/cloudy/bright/dark/grey/pale/chill/crisp/drizzle/haze/lamplight/firelight. These are validated requirements, not style suggestions; missing them triggers a retry.

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

PROMPT BUDGET SUMMARY: budget=24000 tokens; fixed=7843; context=12658; dropped=[none]; truncated=[first_appearance_contracts, location_profiles, temporal_context, pronoun_accuracy]

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
4. Integrate at least two concrete era-grounded details per chapter from setting refinement signals: radio broadcasts | early television sets | military radar | long-distance telephone calls | military encryption | telegram services.
5. Respect setting movement/access constraints in scene action and alibis: narrow hallways limit movement | access to the roof is restricted | oceanfront access is only available through the main lobby | staff-only areas such as the kitchen and service elevators | guest rooms require key access.
6. Sustain social coherence with this backdrop pressure: A mechanical clock-tampering murder unfolds among a diverse group of hotel guests, all grappling with the pressures of post-war recovery and shifting social norms in a tense, isolated setting.
7. Maintain continuity around these socially central cast anchors where relevant: Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill, Sylvia Trent, Hugo Vane.
8. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Critical: Plot similarity 0.80 with 'The Second Key' (same era and crime method)
9. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Moderate: Character similarity 0.75 with 'The Second Key' (similar cast structure and roles)

CRITICAL PROSE REQUIREMENTS:

The CML specifies exact requirements for certain validation-critical scenes. You MUST include these elements at the specified positions.

**Discriminating Test Scene (Act 3, Scene 4):**
Required elements: Execute the discriminating test, Observe the culprit's reaction or result, Draw conclusion about guilt
Test type: Comparison of timepieces

**Suspect Clearance Scenes:**
- Dr. Mallory Finch (Act 3, Scene 5): Solid alibi verified by multiple witnesses.
  Clues: Witnesses testify to Dr. Finch's activities during the time of death.
- Beatrice Quill (Act 3, Scene 5): Broken necklace was from a different incident.
  Clues: Witnesses confirm the necklace incident occurred earlier in the day.
- Sylvia Trent (Act 3, Scene 5): No motive or opportunity.
  Clues: Witness confirms Sylvia was in another part of the hotel.

**Culprit Revelation Scene (Act 3, Scene 6):**
Method: Confrontation with evidence of clock tampering.

**Clue Placement for These Chapters:**
- clue_1 must appear in Act 1, Scene 1 via Witness observations of the clock.

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
Investigation state at start: 0 clue(s) revealed to reader; approximately 0 unresolved suspect(s).
Must change by end: Introduce cast relevance and plant first clue while keeping culprit unresolved.
Suspect pressure target(s): Captain Ivor Hale, Dr. Mallory Finch, Beatrice Quill, Sylvia Trent
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
  - VICTIM IDENTITY LOCK (MANDATORY): name the victim as "Eleanor Voss" in the discovery scene. After first mention, do not use unnamed placeholders such as "the victim" without naming Eleanor Voss in the same paragraph.
  - ⛔ INFERENCE EMBARGO (pre-reveal): observations ACCUMULATE here; explicit deduction ("therefore", "which proved", "could only mean", if-A-and-B-then-C assembly of locked values) is RESERVED for the false-solution, discriminating-test, and reveal chapters. Characters may wonder, doubt, or fall silent over a detail — never explain it.
  - Opening: Begin with a character action, spoken line, or clock/time marker — never a location name or location-description phrase.
  - Scene is set in: the seaside hotel ballroom — reference it naturally within the paragraph, never as your opening phrase.
  - Opening atmosphere (MANDATORY — validator enforced): the first paragraph MUST contain at least one of: rain / wind / fog / storm / mist / thunder / evening / morning / night / dawn / dusk / season / afternoon / midday / noon / midnight / twilight / sunrise / sunset / daylight / sunlight / overcast / cloudy / bright / dark / grey / pale / cold / warm / chill / crisp / damp / drizzle / haze / lamplight / firelight. A chapter that omits all of these from its opening paragraph will be rejected.
  - PARAGRAPH OPENER DIVERSITY (MANDATORY — validator enforced): No more than 2 paragraphs in this chapter may begin with "Hugo" or "Hugo's" as the first word. You must vary paragraph openings throughout: use sensory observations, another character's name or action, dialogue, object or sound details, or temporal markers. Opening 3 or more paragraphs with "Hugo" will cause automated rejection.
  - INVESTIGATOR ESTABLISHMENT REQUIRED: Hugo Vane must claim or be recognised as the investigator in this chapter. Establish Hugo Vane as the detective-in-charge within the first two paragraphs — Hugo Vane IS the investigator. Do NOT have any character suggest a "real" detective is still coming, or imply that authority has not yet been delegated. Hugo Vane begins the investigation in this chapter.
  - ⛔ BODY DISCOVERY ORDER (MANDATORY — Chapter 1 only): the victim's body must be physically encountered or described within the first TWO paragraphs. Do NOT spend the opening paragraphs solely on clock examination, atmospheric setup, or character introductions before the body is found. Required Chapter 1 structure: atmosphere (one sentence max) → body/discovery → investigator reaction → suspects → first time-source contradiction.
  - ⛔ MECHANISM SPOILER BAN: Do NOT state how the crime device was manipulated — not the direction, not the magnitude, not who performed it. Characters may only observe that two sources of evidence disagree. The specific method, tamper amount, and perpetrator's action are ALL FORBIDDEN until the reveal. WRONG: "The culprit had altered the device by forty minutes to create a false alibi." RIGHT: "Two independent pieces of evidence gave contradictory readings — a discrepancy neither could yet explain."
  - CLUE OBLIGATIONS — each clue below MUST be dramatized, but in YOUR OWN WORDS:
    Render each as something a character SEES, DOES, or SAYS on the page. The bracketed text is a
    DESCRIPTION of the evidence for you — do NOT transcribe it as narration. Copying a clue's
    description sentence verbatim into the prose FAILS validation.
    • clock, face, displays, time, clearly [clue_1] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      OBSERVATION ONLY: put it on the page concretely — a character sees, handles, or hears it inside the scene. The detective may NOTICE (a pause, a second glance, a pocketed item) but must NOT state what it implies. Place the observation in paragraph 1 or 2.
  - PLANT OBLIGATIONS (incidental appearances): each item below MUST appear in this chapter as a passing physical detail a character sees, handles, or walks past — with its significance UNFLAGGED:
    • tampering, visible, clock [plant:clue_core_contradiction_chain]
    • clock, face, displays, time, clearly [plant:clue_fp_contradiction_step_2]
    Rules: set dressing only. NO character comments on its importance, NO narrator hint ("little did they know", "something about it seemed off" are FORBIDDEN), NO inference drawn. It simply exists in the scene, naturally. Its significance surfaces in a LATER chapter — planting it casually here is what makes that later reveal feel fair.
  - Tonal contrast: include at least one beat of relief or ironic counterpoint. Do not sustain maximum tension for every paragraph.
  - CLUE DISCLOSURE RULE (Stage 1/4):
    Characters may OBSERVE anomalies (wrong time, missing object, odd detail) but must NOT explain the mechanism, deduce the method, or name the culprit. Discovery and reaction only.
    WRONG: dialogue or narration that directly explains how the crime was committed before Stage 4.
    RIGHT: observation, physical reaction, and logical inference that leaves the mechanism just off-screen.
  - ALIBI LOCK: Captain Ivor Hale's established alibi is "9:00 PM to 10:00 PM". Do NOT place Captain Ivor Hale at any other location or in any other activity during the crime window. Any contradiction is a continuity error that triggers a retry.
- Locked fact phrase obligations:
  - If this batch mentions The clock shows this time when the guests arrive., write exactly: "ten minutes past ten".
  - If this batch mentions The victim died at this time, revealing the clock's deceit., write exactly: "half past eight".
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
Investigation state at start: 0 clue(s) revealed to reader; approximately 0 unresolved suspect(s).
Must change by end: Introduce cast relevance and plant first clue while keeping culprit unresolved.
Suspect pressure target(s): Captain Ivor Hale, Dr. Mallory Finch, Beatrice Quill, Sylvia Trent
Required new information: First clue observation tied to suspect landscape.
Forbidden reveals at this stage: No culprit reveal. | No full murder mechanism explanation. | Do not state the direction, magnitude, or agent of any clock or device tampering. Characters may only observe that two time sources disagree. "The clock was wound back by forty minutes" must not appear before Chapter 3.

FROZEN FACT STATE (DO NOT ALTER):
- Timeline anchor: September (autumn).
- Month, season, weather, and time-of-year language in this batch must stay compatible with autumn.
- Established timeline fact: Clock shows ten minutes past ten
- Established timeline fact: Witnesses recall the party ending at ten o'clock
- If referenced, use exact phrase: "ten minutes past ten" (The clock shows this time when the guests arrive.).
- If referenced, use exact phrase: "half past eight" (The victim died at this time, revealing the clock's deceit.).

STORY TO DATE (REFERENCE ONLY — DO NOT COPY VERBATIM):
- No previous chapter text exists yet for this batch.

[SCENE COMPLETENESS CONTRACTS — MANDATORY. Each contract below lists what you MUST enact in that chapter. Do not summarise or mention these labels in the prose — enact them organically.]
Chapter 1 (Act 1) completeness contract:
  PIVOT ELEMENT (MANDATORY — write this into the prose, shown not told): "The stopped clock showing ten minutes past ten."
  FACT ESTABLISHED (MANDATORY — reader must know this by chapter end): "Establishes the victim died no later than ten minutes past ten, contradicting the timeline of the party."

# Case Overview
Title: The Clockwork Deception
Era: 1940s
Setting: Seaside Hotel
Crime: murder (mechanical tampering)
Culprit: Captain Ivor Hale
Victim: Eleanor Voss
False assumption: The victim died during the party as indicated by the clock.
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
      "location": "the seaside hotel ballroom",
      "timeOfDay": "Morning after the murder",
      "atmosphere": "Tense household awaiting the detective's arrival"
    },
    "characters": [
      "Hugo Vane",
      "Eleanor Voss",
      "Captain Ivor Hale",
      "Dr. Mallory Finch",
      "Beatrice Quill",
      "Sylvia Trent"
    ],
    "purpose": "Introduce the crime and detective",
    "cluesRevealed": [
      "clue_1"
    ],
    "dramaticElements": {
      "conflict": "Locked room mystery established",
      "tension": "Every suspect had access to the victim",
      "microMomentBeats": [
        "Eleanor stands frozen, eyes wide as she stares at the clock, her breath hitching."
      ]
    },
    "summary": "As dawn breaks over the seaside hotel, the guests gather in the ballroom, whispers of shock and confusion filling the air. The lifeless body of a man lies sprawled on the floor, surrounded by broken glass and a shattered clock showing ten minutes past ten. Hugo Vane, a local guest, steps forward, his heart racing as he takes in the scene, noting the chilling contradiction of the clock's time.",
    "beat": "gathering",
    "estimatedWordCount": 1800,
    "pivotElement": "The stopped clock showing ten minutes past ten.",
    "factEstablished": "Establishes the victim died no later than ten minutes past ten, contradicting the timeline of the party.",
    "permittedBehavioursByAct": [
      {
        "characterName": "Hugo Vane",
        "behaviour": "Show normal social behaviour; grief or confusion if appropriate."
      },
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
    "emotionalRegister": "The initial atmosphere is one of opulence tinged with unease as the guests gather, unaware of the tragedy about to unfold.",
    "dominantCharacterNote": {
      "name": "Eleanor Voss",
      "voiceRegister": "Eleanor speaks with a measured grace, each word carefully chosen, yet there's an undercurrent of anxiety that occasionally breaks through her composed facade."
    },
    "humourGuidance": {
      "permission": "forbidden"
    },
    "eraTextureNote": "Limited public transport due to fuel rationing; Communication challenges with the recent rise of television and radio; Social gatherings are often constrained by strict dress codes",
    "locationRegisterNote": "",
    "mechanismRevealAllowed": false,
    "cluesPlanted": [
      "clue_core_contradiction_chain",
      "clue_fp_contradiction_step_2"
    ]
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
□ Chapter 1: the clue [clue_1] (clock, shows, time, minutes, past) is placed in the first 25% of the chapter, dramatized in your own words, followed by an explicit inference or suspicion paragraph.
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
