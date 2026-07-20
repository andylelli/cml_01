# Actual Prompt Record

- Run ID: `mystery-1784474093773`
- Project ID: ``
- Timestamp: `2026-07-19T15:19:55.792Z`
- Agent: `Agent9-ProseGenerator-Ch1`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4.1`
- Temperature: `0.42`
- Max Tokens: `4500`
- Attempt: `first`
- Prompt Hash: `21e010753327a254`

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
- MORAL COMPLEXITY REQUIREMENT: The mechanism of this crime carries a moral gray area: "Despite the heinous act, the culprit believed they were liberating the victims from their suffering, complicating the moral landscape of the murder." — the culprit reveal and denouement MUST acknowledge this ambiguity. Do not let the ending feel clean or simple. Give the reader at least one moment of uncomfortable sympathy or moral doubt.

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
   - Dr. Mallory Finch: Reputable Professional
   - Captain Ivor Hale: Rugged Hero
   - Beatrice Quill: Ambitious Socialite
   - Sylvia Trent: Cunning Strategist
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

- Eleanor Voss
  Public identity anchor: Local Artist; detective 
  Connection to victim: Eleanor respects Hugo's charitable works but suspects ulterior motives.; Eleanor attended many of Hugo’s charity events, leading to complicated feelings..
  Investigation relevance: is actively driving interviews and credibility checks in this scene.
  Suspicion/pressure cue seed: Solving the case to protect her establishment's reputation.
  Investigator read: include one immediate observational inference (gesture, gaze target, pause, object grip), but do not state guilt as fact.

- Dr. Mallory Finch
  Public identity anchor: Physician; suspect 
  Connection to victim: They were once rumored to have had a brief romance that ended poorly.; Mallory and Hugo’s short-lived romance was talked about at social events..
  Investigation relevance: access plausibility: medium | alibi window: dinner time | opportunity channel: Medical knowledge.
  Suspicion/pressure cue seed: Protecting her reputation and career.
  Investigator read: include one immediate observational inference (gesture, gaze target, pause, object grip), but do not state guilt as fact.

- Beatrice Quill
  Public identity anchor: Social Climber; suspect 
  Connection to victim: Beatrice believes Hugo can help her climb the social ladder.; Beatrice attends Hugo’s events, hoping to gain favor with him..
  Investigation relevance: access plausibility: medium | alibi window: dinner time.
  Suspicion/pressure cue seed: Preserving her reputation and relationship.
  Investigator read: include one immediate observational inference (gesture, gaze target, pause, object grip), but do not state guilt as fact.

- Captain Ivor Hale
  Public identity anchor: Naval Officer; suspect 
  Connection to v
[truncated for prompt budget]

WORLD DOCUMENT (use this as your primary creative context):

## Era: June 1946
Living in June 1946 feels like navigating a world still reeling from the aftermath of war. The air is thick with uncertainty, as the nation grapples with both the scars of conflict and the hope of renewal. Coastal towns like Brighton buzz with activity, but beneath the surface lies a tension fueled by economic instability and the slow return to normalcy. Guests at The Crestview Hotel find themselves caught between the allure of social gatherings and the haunting memories of the war, creating a complex backdrop where laughter can quickly turn to suspicion.
Emotional register: A mix of cautious optimism and underlying anxiety permeates society.
Physical constraints: Rationed goods limit the availability of luxury items | Fuel shortages restrict travel and transportation | The presence of military personnel affects social dynamics
Current tensions (weave into background texture): The Nuremberg Trials continue to reveal the horrors of the Holocaust | Tensions rise as the Iron Curtain descends over Eastern Europe | The United States initiates the Marshall Plan to aid Europe's recovery
Wartime context — Many veterans are returning and struggling to reintegrate into civilian life.: Women are stepping into roles traditionally held by men, causing shifts in societal expectations. Absence effect: The absence of those lost in the war is felt deeply, creating a collective grief that lingers.

## Season Lock (mandatory — derived from June 1946)
Season: summer. Allowed vocabulary: summer, summery, midsummer
Forbidden seasonal words — never use in narration, dialogue, or metaphor: spring, autumn, winter and their adjectival forms.
Every weather description, atmosphere, and time-of-year reference must be consistent with summer.

## Story Theme
The narrative explores the intricate web of human relationships, revealing how buried secrets and social facades can lead to deadly consequences in a post-war society.

## Story Emotional Register
Dominant: The story conveys a sense of mounting tension and unease as secrets unravel.

Arc:
The story opens in the grand dining room of The Crestview Hotel, where a charity gala is in full swing, and the air is thick with laughter, music, and the briny scent of the ocean. Yet, this vibrancy is shattered when Hugo Vane collapses after sipping a drink from a bouquet, leaving guests in a state of shock. As the investigation begins, Eleanor Voss, the hotel manager, must navigate the rising unease among the guests, each harboring their own secrets. The first clues present a tangled web of motives, revealing the emotional cost of the murder. False leads point to Dr. Mallory Finch, while whispers of jealousy and ambition swirl around Beatrice Quill and others. A pivotal moment occurs when Eleanor discovers evidence linking the bouquet to the poisoning, revealing the true nature of the crime. This revelation shifts the investigation's direction, forcing Eleanor to confront the complex relationships among the suspects. As pressure mounts and tensions rise, a confrontation unfolds, leading to a tense climax where the true culprit is revealed. The resolution carries a heavy emotional weight, as each character grapples with the fallout of their actions and the fragility of their reputations, ultimately leaving them changed.

The story opens: A vibrant gala atmosphere quickly turns into shock and confusion with the victim's sudden collapse. As the investigation takes shape: The initial investigation reveals a tangled web of motives and secrets among the guests. A first key turn arrives: A pivotal clue points toward the bouquet as a potential murder weapon, shifting the investigation's focus. At the mid-point of the story: New evidence emerges that connects the suspects more closely, intensifying the tension.

A second pivot reshapes the course: A crucial revelation changes the perception of earlier events, complicating suspect motives. As tension reaches its height: Mounting pressure.

## Emotional register at this point in the story
A vibrant gala atmosphere quickly turns into shock and confusion with the victim's sudden collapse.

## Character Portraits (appearance & era)

### Eleanor Voss
Eleanor Voss embodies the resilience of post-war society, navigating her role as a hotel manager while grappling with her past. She represents the struggle for women to assert themselves in professional spaces, showcasing both strength and vulnerability. Her dedication to uncovering the truth behind Hugo's murder reflects a desire to reclaim her identity amidst the chaos of societal change.
Era intersection: Her personal journey of overcoming trauma resonates with the broader historical context of women emerging from the shadows of war.

### Dr. Mallory Finch
Dr. Mallory Finch exemplifies the duality of a respected professional and a haunted past, navigating the challenges of maintaining her reputation in a society eager for stability. Her experiences during the war have left her with deep-seated guilt, emphasizing the ethical dilemmas faced by those who served. As the investigation unfolds, her character highlights the fragility of social standing and the lengths one might go to protect it.
Era intersection: Her struggle to keep her secrets hidden mirrors the societal pressure on women to conform to newly emerging moral standards.

### Captain Ivor Hale
Captain Ivor Hale represents the complexities of masculinity in a post-war world, grappling with PTSD and societal expectations. His inner turmoil reflects the struggles many veterans face upon returning home, as they seek to reclaim their honor amidst a changing landscape. Ivor’s character arc is a poignant exploration of vulnerability and the quest for redemption.
Era intersection: His battle with the ghosts of war mirrors society's struggle to heal from its collective trauma.

### Beatrice Quill
Beatrice Quill epitomizes the social climbers of the era, navigating high society while concealing her vulnerabilities. Her character reveals the pressures of maintaining appearances in a world where reputation is paramount. Beatrice's desperation to rise above her gambling debts highlights the societal expectations placed on women to secure their futures through marriage and social connections.
Era intersection: Her ambition underscores the shifting dynamics of gender roles, as women increasingly assert their independence in a male-dominated society.

### Sylvia Trent
Sylvia Trent's character embodies the cunning and resourcefulness of women in post-war society, managing the hotel while hiding her own secrets. Her clandestine relationship with a politician reflects the complexities of navigating personal desires against societal norms. Sylvia’s determination to protect her career amidst scandal illustrates the precarious balance women must maintain in a transforming social landscape.
Era intersection: Her hidden romance signifies the personal sacrifices women make to achieve a semblance of power and control in their lives.

## Character Voices

### Eleanor Voss (she/her/her)
Eleanor's voice carries a lyrical cadence, often reflecting her artistic background.
[comfortable] It's a canvas of life, isn't it? Each stroke tells a story.
[evasive] Well, one mustn't dwell on the past, it’s best left behind.
[stressed] I can't afford to let this ruin everything I’ve worked for!
Humour: Her dry wit often surfaces in tense moments, adding levity to serious conversations.

### Dr. Mallory Finch (she/her/her)
Dr. Finch speaks in clipped, professional tones, reflecting her no-nonsense attitude.
[comfortable] My patients come first; their health is my priority.
[evasive] I’d rather not discuss my past, it’s irrelevant now.
[stressed] This situation is critical; we must act swiftly!
Humour: Dr. Finch maintains a serious demeanor, devoid of humor.

### Captain Ivor Hale (he/him/his)
Ivor speaks with a rugged charm, his words often laced with cynicism.
[comfortable] Life's a storm, isn’t it? We just weather it together.
[evasive] Let’s not dwell on past skirmishes; they’re behind us.
[stressed] I didn’t sign up for this chaos; it’s maddening!
Humour: His sardonic humor often emerges as a protective shield against vulnerability.

### Beatrice Quill (she/her/her)
Beatrice speaks in a bubbly, eager tone, masking her insecurities.
[comfortable] Oh, I’m just a little fish in a big pond, swimming along!
[evasive] I’m sure it’s nothing serious; let’s just enjoy the party!
[stressed] What if they find out? I can't face that kind of shame!
Humour: Her self-deprecating humor allows her to navigate uncomfortable situations.

### Sylvia Trent (she/her/her)
Sylvia speaks with an authoritative tone, often sharp yet polite.
[comfortable] Now, let’s not make a scene, shall we? We can handle this.
[evasive] I was merely attending to guests; nothing more, I assure you.
[stressed] This could ruin me; I won’t let that happen.
Humour: Her polite savagery often cuts through tension, revealing her cunning nature.

## Location Registers (scene framing guides)

The Dining Room: The dining room exudes an oppressive tension, where the remnants of the gala's joy are overshadowed by the presence of death. Guests whisper anxiously, their faces reflecting shock and suspicion as they grapple with the unfolding tragedy. The once-inviting space now feels like a stage, where every shadow could hold a hidden truth, and every guest is a potential suspect.. Camera angle: A writer entering this space should focus on the juxtaposition of opulence and despair, capturing the emotional weight of the moment.. Era: The Art Deco decor contrasts sharply with the grim reality of the murder, amplifying the sense of betrayal among the guests.

The Kitchen: The kitchen buzzes with frenetic energy, yet an undercurrent of anxiety weaves through the staff as they prepare meals amidst the chaos of the investigation. The warmth of the stoves contrasts with the coolness of fear, as whispers of the murder circulate among the cooks. This space, once a haven of culinary delight, now feels like a pressure cooker of secrets waiting to boil over.. Camera angle: Capture the tension of the kitchen as a bustling hub, where every clatter of utensils echoes the uncertainty of the situation.. Era: The industrial setup reflects the post-war push for efficiency while masking the emotional turmoil of the staff.

Room 203: Room 203 feels heavy with secrets, its elegant decor now overshadowed by the recent crime. The plush bedding and floral scents create an inviting yet unsettling atmosphere, where the weight of hidden truths lingers in the air. This room, once a retreat, now serves as a reminder of the fragility of safety and trust within the hotel.. Camera angle: A writer should explore the contrast between the room's beauty and the underlying tension that permeates its walls.. Era: The opulent furnishings reflect the social aspirations of the guests while concealing their darker realities.

The Rooftop Terrace: The rooftop terrace offers a breath of fresh air, yet the beauty of the view is marred by the weight of suspicion hanging over the hotel. Guests gather here to escape the tension inside, but their conversations are laced with anxiety and doubt. The stars above provide a stark contrast to the darkness of the secrets shared below, making this space a poignant reminder of the complexities of human relationships.. Camera angle: Focus on the interplay of light and shadow, reflecting the duality of the guests’ hidden lives against the expansive sky.. Era: The open-air terrace embodies the post-war longing for freedom while simultaneously serving as a stage for hidden agendas.

## Humour guidance for this story position (opening)
Permission: forbidden
Rationale: The gravity of the murder does not permit humor.

FAIR-PLAY AND INFERENCE CONTRACT:
- FAIR PLAY CLUE TIMING: Never combine clue discovery and detective deduction in the same chapter. If a clue is first revealed to the reader in chapter N, the detective may only analyze, deduce from, or act on that clue in chapter N+1 or later.
- FAIR PLAY INFORMATION PARITY: The reader must see all clues BEFORE the detective uses them in reasoning. If the detective performs a test or makes a deduction, every piece of evidence supporting that conclusion must have been shown to the reader in earlier chapters.
- FAIR PLAY REVELATION SPACING: In the discriminating test scene, the detective can ONLY use clues that were revealed to the reader at least 1 full chapter earlier. Never introduce new clues or withheld information during the test.
- FAIR PLAY CONFRONTATION: During the final confrontation/revelation, the detective cannot surprise the reader with facts. Every piece of evidence cited must have been visible to the reader in prior chapters.
- Never solve by withheld information. Keep reader-information parity with detective reasoning.
- False assumption in force: Hugo Vane died from a heart attack after drinking too much champagne at the gala.
- Hidden truth to progressively expose (compose in your own words from these elements): true, cause, death, delayed, action, poison, bouquet
- Inference path checkpoints to dramatize clearly — compose ENTIRELY in your own sentences from these key terms (reproducing any briefing phrase verbatim FAILS validation):
  - Step 1: obs: witnesses, report, hugo, collapsed, shortly, handling, bouquet | corr: hugo, collapse, linked, bouquet, received, beatrice | effect: narrows, investigation, towards, beatrice, quill
  - Step 2: obs: crushed, stems, area, hugo, collapsed | corr: damage, bouquet, suggests, played, role, death | effect: narrows, focus, potential, toxicity, bouquet
  - Step 3: obs: analysis, reveals, stems, contained, rare, toxin | corr: toxin, presence, indicates, foul, play, natural, cause | effect: eliminates, initial, theory, heart, attack, champagne
- Discriminating test method: trap
- Discriminating test elements to dramatize (compose ENTIRELY in your own sentences from these — do NOT reproduce any briefing phrase verbatim): discriminating, compares, bouquet, crush, witness, claimed, timeline
- Test must rely on already-shown clue IDs: clue_mechanism_visibility_core, clue_1, clue_2
- Fair-play rationale: Step 1: The witnesses' statements (early) indicate a direct link between Hugo and the bouquet. Step 2: The evidence of crushed stems (mid) reveals the potential for poisoning. Step 3: The toxin analysis (discriminating test) confirms the bouquet's lethal nature.

## Character Reference

### Eleanor Voss (she/her — NEVER he/him)
Eleanor speaks with a lyrical cadence, her words often painted with humor and charm, yet occasionally tinged with a melancholy that belies her bright exterior.
Eleanor grapples with her fear of vulnerability, stemming from her failed marriage, which makes her hesitant to form new connections.
Voice colour: Eleanor Voss uses dry wit humour — let it surface in their dialogue where natural, not in every line.

### Dr. Mallory Finch (she/her — NEVER he/him)
Finch speaks in clipped, professional tones, her words precise and devoid of frivolity, often punctuated by an air of urgency when discussing matters of health.
Dr. Finch wrestles with the guilt of her past decisions during the war, fearing exposure could lead to the collapse of her carefully constructed life.

### Captain Ivor Hale (he/him — NEVER she/her)
Ivor speaks with a rugged charm, his words often laced with cynicism, and he tends to use humor as a shield against deeper emotions.
Ivor battles with the demons of his past, struggling to reconcile his military honor with his reckless behavior stemming from PTSD.
Voice colour: Captain Ivor Hale uses sardonic humour — let it surface in their dialogue where natural, not in every line.

### Beatrice Quill (she/her — NEVER he/him)
Beatrice speaks in a bubbly, eager tone, often peppering her conversations with self-deprecating humor to mask her insecurities.
Beatrice struggles with her desire for acceptance and the fear of being exposed for her debts, which could shatter her social aspirations.
Voice colour: Beatrice Quill uses self deprecating humour — let it surface in their dialogue where natural, not in every line.

### Sylvia Trent (she/her — NEVER he/him)
Sylvia speaks with an air of authority, her words sharp and often laced with a polite yet biting edge that reflects her cunning nature.
Sylvia is torn between her desires and the societal expectations that threaten to unravel her carefully constructed life.
Voice colour: Sylvia Trent uses polite savagery humour — let it surface in their dialogue where natural, not in every line.


## CHARACTER CONTRACTS (binding for this scene)
Each entry below constrains how this character must be written in this chapter.
These override generic style guidance when they conflict.

### Eleanor Voss[SHE]
Voice & mannerisms: Eleanor speaks with a lyrical cadence, her words often painted with humor and charm, yet occasionally tinged with a melancholy that belies her bright exterior.
SIGNATURE TIC (use sparingly — this is Eleanor Voss's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "‘Well, that’s a canvas not worth painting.’"
Sample voice fragments (match this register and rhythm):
  [comfortable] "It's a canvas of life, isn't it? Each stroke tells a story."
  [evasive] "Well, one mustn't dwell on the past, it’s best left behind."
Humour: dry wit — deploy occasionally (level 0.5)
FORBIDDEN phrase (never write for Eleanor Voss): "a surge of determination washed over her"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "inheritance" — do not surface in Act I.

### Dr. Mallory Finch[SHE]
Voice & mannerisms: Dr. Finch speaks in clipped, professional tones, her words precise and devoid of frivolity, often punctuated by an air of urgency when discussing matters of health.
SIGNATURE TIC (use sparingly — this is Dr. Mallory Finch's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "‘Time is of the essence.’"
Sample voice fragments (match this register and rhythm):
  [comfortable] "My patients come first; their health is my priority."
  [evasive] "I’d rather not discuss my past, it’s irrelevant now."
Humour: none — this character plays it straight in all scenes
FORBIDDEN phrase (never write for Dr. Mallory Finch): "sighed deeply and felt a sense of peace"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Desperately needs to maintain her professional reputation that could be threatened by the victim's knowledge of her past." — do not surface in Act I.

### Captain Ivor Hale[HE]
Voice & mannerisms: Ivor speaks with a rugged charm, his words often laced with cynicism, and he tends to use humor as a shield against deeper emotions.
SIGNATURE TIC (use sparingly — this is Captain Ivor Hale's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "‘Life’s a storm, isn’t it?’"
Sample voice fragments (match this register and rhythm):
  [comfortable] "Life's a storm, isn’t it? We just weather it together."
  [evasive] "Let’s not dwell on past skirmishes; they’re behind us."
Humour: sardonic — deploy occasionally (level 0.6)
FORBIDDEN phrase (never write for Captain Ivor Hale): "palpable tension filled the room"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Felt betrayed by the victim, who had previously been involved with his ex-lover and publicly humiliated him." — do not surface in Act I.

### Beatrice Quill[SHE]
Voice & mannerisms: Beatrice speaks in a bubbly, eager tone, often peppering her conversations with self-deprecating humor to mask her insecurities.
SIGNATURE TIC (use sparingly — this is Beatrice Quill's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "‘Oh, I’m just a little fish in a big pond!’"
Sample voice fragments (match this register and rhythm):
  [comfortable] "Oh, I’m just a little fish in a big pond, swimming along!"
  [evasive] "I’m sure it’s nothing serious; let’s just enjoy the party!"
Humour: self deprecating — deploy occasionally (level 0.4)
FORBIDDEN phrase (never write for Beatrice Quill): "she knew with certainty she was right"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Saw the victim as a rival for attention and resources in pursuing social favors, fearing exposure of her debts." — do not surface in Act I.

### Sylvia Trent[SHE]
Voice & mannerisms: Sylvia speaks with an air of authority, her words sharp and often laced with a polite yet biting edge that reflects her cunning nature.
SIGNATURE TIC (use sparingly — this is Sylvia Trent's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "‘Now, let’s not make a scene, shall we?’"
Sample voice fragments (match this register and rhythm):
  [comfortable] "Now, let’s not make a scene, shall we? We can handle this."
  [evasive] "I was merely attending to guests; nothing more, I assure you."
Humour: polite savagery — deploy frequently (level 0.7)
FORBIDDEN phrase (never write for Sylvia Trent): "she felt a wave of unease"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "The victim had been threatening to expose her relationship, which would publicly ruin her." — do not surface in Act I.



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

Primary Location: The Crestview Hotel (Brighton, England)
A grand Art Deco hotel perched on the cliffs of Brighton, offering stunning ocean views and a touch of glamour amid post-war uncertainty.

Key Locations Available:
- The Dining Room (interior): Crime scene
- The Kitchen (interior): Staff-only area
- Room 203 (interior): Guest room
- The Rooftop Terrace (exterior): Observation and relaxation area

Atmosphere (tonal cue only — do NOT reproduce this phrase verbatim in prose; translate into scene-specific, character-observed sensory language): tense due to recent events and rumors circulating among guests
Weather: overcast with occasional rain showers, typical of coastal climates

Era markers: radio broadcasting in every room | early vacuum tube televisions in common areas | rationed fuel leading to limited vehicle use

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
The Dining Room (interior):
  - Visual: gleaming silverware on white tablecloths, dark clouds rolling over the ocean
  - Sounds: clinking glasses, murmurs of conversation
  - Scents: freshly baked bread, sea salt and damp wood
  - Touch: cool marble underfoot, smooth table surface

The Kitchen (interior):
  - Visual: gleaming steel countertops, hanging herbs drying from the ceiling
  - Sounds: clattering pots, boiling water
  - Scents: sautéed garlic, spices and herbs
  - Touch: smooth metal surfaces, warmth from the stove

Room 203 (interior):
  - Visual: plush bedding in muted colors, framed art deco prints on the walls
  - Sounds: the distant crash of waves, the rustle of curtains in the breeze
  - Scents: fresh linens, faint floral perfume
  - Touch: soft velvet upholstery, cool brass doorknob

⛔ REFERENCE DATA — DO NOT TRANSCRIBE VERBATIM: The above profiles are structural guides only. Generate original prose that evokes these qualities; do not reproduce the exact phrasing or sentence structure of the profile paragraphs.

SCENE OPENING RULE: When opening a scene in a new location, write what the POV character directly observes and physically senses at that moment — not a general description of the room's qualities. The reader must feel present, not briefed. Sensory details must be observed by the character, not stated as fact about the place.

SENSORY WRITING TECHNIQUES:
- Opening paragraphs: Lead with 2-3 sensory details to ground the scene
- Movement between locations: Note sensory changes (quiet study → noisy dining room)
- Emotional scenes: Use sensory details to reinforce mood (cold rain during argument)
- Perio
[truncated for prompt budget]

## Texture Pool
Draw on these as opportunities arise — you are not required to use them.

- Living in June 1946 feels like navigating a world still reeling from the aftermath of war
- The air is thick with uncertainty, as the nation grapples with both the scars of conflict and the hope of renewal
- Coastal towns like Brighton buzz with activity, but beneath the surface lies a tension fueled by economic instability and the slow return to normalcy
- Guests at The Crestview Hotel find themselves caught between the allure of social gatherings and the haunting memories of the war, creating a complex backdrop where laughter can quickly turn to suspicion.

TEMPORAL CONTEXT:

This story takes place in June 1946 during summer.

Seasonal Atmosphere:
- Weather patterns: overcast skies with intermittent rain showers, cool breezes from the nearby coast, high humidity typical of a coastal climate
- Daylight: Long summer days with daylight lingering until nearly nine o'clock at night, the air thick with the scent of salt and rain.
- Seasonal activities: attending outdoor concerts in local parks, visiting the beach for picnics despite the weather, participating in charity events for war veterans
- Seasonal occasions: Father's Day on June 16th
- Season: summer

Period Fashion (describe naturally):
- Men formal: double-breasted navy suit, white dress shirt with a narrow tie, black leather oxford shoes
- Men casual: lightweight linen trousers, seersucker short-sleeved shirt, canvas loafers
- Men accessories: fedora hat, silk pocket square, leather belt
- Women formal: elegant tea-length dress with floral patterns, tailored jacket with padded shoulders, pearl necklace
- Women casual: sundress made of cotton with cinched waist, short-sleeved blouse and high-waisted skirt, comfortable espadrilles
- Women accessories: wide-brimmed straw hat, stylish handbag, cat-eye sunglasses

Cultural Context (reference naturally):
- Music/entertainment: Bing Crosby's 'White Christmas', The Andrews Sisters' 'Don't Sit Under the Apple Tree', Duke Ellington's jazz compositions; Films: 'The Best Years of Our Lives', 'It's a Wonderful Life'; Theatre: 'Annie Get Your Gun', 'Carousel'; Radio: 'The Jack Benny Program', 'Fibber McGee and Molly'
- Typical prices: Loaf of bread: 4 pence, Cigarettes: 5 pence per pack, Movie ticket: 1 shilling
- Current events: the Nuremberg Trials continue to reveal the horrors of the Holocaust; tensions rise as the Iron Curtain descends over Eastern Europe
- Literature: 'The Catcher in the Rye' by J.D. Salinger | 'The Stranger' by Albert Camus | 'The Naked and the Dead' by Norman Mailer | [detective fiction] | [post-war novels exploring identity] | [romantic literature reflecting on the war]
- Technology: the first commercial jet airliner | the development of the transistor | advancements in radar technology | radio sets in every household | early vacuum tube televisions in public spaces | the advent of basic home appliances like electric irons
- Daily life: going to the theater or cinema for evening entertainment, enjoying picnics at the beach despite the weather, participating in community dances and social clubs
- Social rituals: Sunday family dinners, attending church services regularly, engaging in tea time with friends and neighbors

Atmospheric Details:
The air is thick with the scent of rain mixed with the salty tang of the ocean, creating a palpable tension that hangs over the hotel. The muffled sounds of waves crashing against the shore blend with the distant chatter of guests, punctuated by the occasional clink of glasses in the dimly lit bar. A sense of unease permeates the atmosphere, as whispers of old wounds from the war mix with the excitement of recovery and renewal, creating an undercurrent of anxiety among the guests.

FASHION INTEGRATION TECHNIQUES:
- First appearance: Describe outfit to establish class/personality
- Accessories: Gloves, hats, pocket watches, jewelry reveal status
- Time-specific: Different outfits for different times of day
- Characte
[truncated for prompt budget]

NON-NEGOTIABLE CHAPTER OBLIGATIONS — LOCKED EVIDENCE VALUES (VERBATIM REQUIRED):
The following measured values (times, amounts, measurements) are absolute ground truth. Every time this chapter describes, mentions, or alludes to one — no matter how briefly — it MUST use the exact phrase shown below, character for character. NO paraphrase, approximation, rounding, or synonym is permitted.

FAILURE EXAMPLE: if the locked value is "at thirteen minutes to midnight" and you write "just before midnight" or "around midnight" — that is a HARD FAIL. You must write "at thirteen minutes to midnight". Equally, if the locked value is written in words, such as "ten minutes past eleven", and you convert it to figure-based clock notation — that is also a HARD FAIL. Words stay as words; figure forms are forbidden for word-phrased facts.

CRITICAL — WORD-PHRASED VALUES: If the canonical value is written out in words (e.g. a time like "ten minutes past eleven", or an amount like "forty minutes"), reproduce those exact words. DO NOT convert to figure-based time notation, twenty-four-hour format, or any other numeric shorthand. Correct: "ten minutes past eleven". WRONG: figure-based clock notation or numeric shorthand.

Locked values:
  - Temperature required for the sugar cube to dissolve and release the poison.: "one hundred degrees Fahrenheit"
  - Time the victim was last seen consuming tea.: "ten minutes past seven"
    ⛔ FORBIDDEN alternatives: "7:10", "7.10", "seven ten", "seven-ten", "seven past ten", "quarter past seven", "half past seven" — the ONLY acceptable form is "ten minutes past seven"
  - Number of melted sugar cubes found in the victim's room.: "three"

If a value has no relevance to this chapter, omit it. But the moment you reference the underlying evidence, only the exact phrase above is acceptable.

⛔ CLUES TO SURFACE IN THESE CHAPTERS — mandatory:
The following evidence MUST be clearly observable to an attentive reader. Do not bury it in atmosphere or passing dialogue. Each clue must be concrete, specific, and noticeable:

• [clue_early_1] witnesses, report, hugo, collapsed, shortly, handling, bouquet
  Category: testimonial | Criticality: essential | Supports inference step 1
  Points to: hugo, collapse, suspicious

• [clue_1] crushed, stems, area, hugo, collapsed
  Category: testimonial | Criticality: essential | Supports inference step 2
  Points to: bouquet, crucial, understanding, cause, death

• [clue_mechanism_visibility_core] delayed, action, poison, contained, within, stems, bouquet, releases, toxin, crushed
  Category: temporal | Criticality: essential | Supports inference step 1
  Points to: bouquet, linked, hugo, death

For each clue above: an attentive reader should be able to find, record, and later use it to reason toward the solution.

═══ NARRATIVE STATE (read-only — do not contradict) ═══

LOCKED FACTS — use verbatim whenever this evidence is described:
  • Temperature required for the sugar cube to dissolve and release the poison.: "one hundred degrees Fahrenheit"
  • Time the victim was last seen consuming tea.: "ten minutes past seven"
  • Number of melted sugar cubes found in the victim's room.: "three"

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
Known location profile anchors: The Crestview Hotel, The Dining Room, The Kitchen, Room 203, The Rooftop Terrace, the grand ballroom of the seaside hotel
LOCATION NAME CAPITALISATION (HARD REQUIREMENT — validated):
All named locations in your prose MUST use the EXACT capitalisation from the CML profiles.
Canonical forms: "The Crestview Hotel", "The Dining Room", "The Kitchen", "Room 203", "The Rooftop Terrace", "the grand ballroom of the seaside hotel"
Writing a location in lowercase (e.g. "drawing room" instead of "Drawing Room") is a validated error. Every time you mention a named location, copy its capitalisation from the list above.
- Chapter 1: OPENING STYLE (HARD): Start the VERY FIRST SENTENCE with a named character performing a physical action or motion — e.g. "[Name] crossed the threshold…" / "[Name] set down the glass…" / "[Name] rose from the chair…". Anchor opening in "the grand ballroom of the seaside hotel". The opening style above governs only your FIRST SENTENCE; the grounding below may land anywhere in the first 2 paragraphs (it need not be sentence one, and never conflicts with the chosen opening style). HARD REQUIREMENT for the first 2 paragraphs: (a) include 2+ sensory words — choose from smell/scent/odor/fragrance/sound/echo/silence/whisper/creak/cold/warm/damp/rough/smooth/glow/shadow/flicker/dim — and (b) include 1+ atmosphere/time word — choose from rain/wind/fog/storm/mist/thunder/evening/morning/night/dawn/dusk/lighting/weather/season/afternoon/midday/noon/midnight/twilight/sunrise/sunset/daylight/sunlight/overcast/cloudy/bright/dark/grey/pale/chill/crisp/drizzle/haze/lamplight/firelight. These are validated requirements, not style suggestions; missing them triggers a retry.

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

PROMPT BUDGET SUMMARY: budget=24000 tokens; fixed=8086; context=12334; dropped=[none]; truncated=[first_appearance_contracts, location_profiles, temporal_context, pronoun_accuracy]

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
4. Integrate at least two concrete era-grounded details per chapter from setting refinement signals: radio broadcasting in every room | early vacuum tube televisions in common areas | basic radar systems for maritime navigation | party-line telephones in rooms | telegrams sent from local post office | military-style coded messages for sensitive information.
5. Respect setting movement/access constraints in scene action and alibis: narrow hallways limiting movement during peak hours | secluded beach area accessible only from the hotel | rooftop terrace providing limited visibility to surrounding areas | staff-only areas including the kitchen and storage | guest rooms requiring key access.
6. Sustain social coherence with this backdrop pressure: A tense gathering at a seaside hotel for a charity gala unites a diverse group, where wartime shifts in gender roles and rising Cold War anxieties create an atmosphere ripe for hidden motives and deadly secrets.
7. Maintain continuity around these socially central cast anchors where relevant: Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill, Sylvia Trent, Hugo Vane.
8. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Critical: Plot similarity 0.80 with 'The Mysterious Affair at Styles' (both involve poisoning)
9. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Moderate: Character similarity 0.70 with 'The Second Key' (similar cast structure and character roles)

CRITICAL PROSE REQUIREMENTS:

The CML specifies exact requirements for certain validation-critical scenes. You MUST include these elements at the specified positions.

**Discriminating Test Scene (Act 3, Scene 4):**
Required elements: Execute the discriminating test, Observe the bouquet's reaction and the resulting symptoms, Draw conclusion about the bouquet's implications in the murder

**Suspect Clearance Scenes:**
- Captain Ivor Hale (Act 3, Scene 5): Witnesses confirm he was fetching a friend and not involved.
  Clues: witness statements confirming his location
- Beatrice Quill (Act 3, Scene 5): Alibi confirmed: dinner time
- Sylvia Trent (Act 3, Scene 5): Alibi confirmed: during the gala

**Culprit Revelation Scene (Act 3, Scene 6):**
Method: Confrontation with evidence of the bouquet's role in Hugo's death

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
Suspect pressure target(s): Dr. Mallory Finch, Beatrice Quill, Captain Ivor Hale, Sylvia Trent
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
  - VICTIM IDENTITY LOCK (MANDATORY): name the victim as "Hugo Vane" in the discovery scene. After first mention, do not use unnamed placeholders such as "the victim" without naming Hugo Vane in the same paragraph.
  - Opening: Begin with a character action, spoken line, or clock/time marker — never a location name or location-description phrase.
  - Scene is set in: the grand ballroom of the seaside hotel — reference it naturally within the paragraph, never as your opening phrase.
  - Opening atmosphere (MANDATORY — validator enforced): the first paragraph MUST contain at least one of: rain / wind / fog / storm / mist / thunder / evening / morning / night / dawn / dusk / season / afternoon / midday / noon / midnight / twilight / sunrise / sunset / daylight / sunlight / overcast / cloudy / bright / dark / grey / pale / cold / warm / chill / crisp / damp / drizzle / haze / lamplight / firelight. A chapter that omits all of these from its opening paragraph will be rejected.
  - PARAGRAPH OPENER DIVERSITY (MANDATORY — validator enforced): No more than 2 paragraphs in this chapter may begin with "Eleanor" or "Eleanor's" as the first word. You must vary paragraph openings throughout: use sensory observations, another character's name or action, dialogue, object or sound details, or temporal markers. Opening 3 or more paragraphs with "Eleanor" will cause automated rejection.
  - INVESTIGATOR ESTABLISHMENT REQUIRED: Eleanor Voss must claim or be recognised as the investigator in this chapter. Establish Eleanor Voss as the detective-in-charge within the first two paragraphs — Eleanor Voss IS the investigator. Do NOT have any character suggest a "real" detective is still coming, or imply that authority has not yet been delegated. Eleanor Voss begins the investigation in this chapter.
  - ⛔ BODY DISCOVERY ORDER (MANDATORY — Chapter 1 only): the victim's body must be physically encountered or described within the first TWO paragraphs. Do NOT spend the opening paragraphs solely on clock examination, atmospheric setup, or character introductions before the body is found. Required Chapter 1 structure: atmosphere (one sentence max) → body/discovery → investigator reaction → suspects → first time-source contradiction.
  - ⛔ MECHANISM SPOILER BAN: Do NOT state how the crime device was manipulated — not the direction, not the magnitude, not who performed it. Characters may only observe that two sources of evidence disagree. The specific method, tamper amount, and perpetrator's action are ALL FORBIDDEN until the reveal. WRONG: "The culprit had altered the device by forty minutes to create a false alibi." RIGHT: "Two independent pieces of evidence gave contradictory readings — a discrepancy neither could yet explain."
  - CLUE OBLIGATIONS — each clue below MUST be dramatized, but in YOUR OWN WORDS:
    Render each as something a character SEES, DOES, or SAYS on the page. The bracketed text is a
    DESCRIPTION of the evidence for you — do NOT transcribe it as narration. Copying a clue's
    description sentence verbatim into the prose FAILS validation.
    • bouquet, shows, signs, damage, crushed, stems [clue_mechanism_visibility_core] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      ⛔ SPOILER EMBARGO (pre-reveal chapter): surface ONLY the surface anomaly a character can see/hear/find.
         Do NOT name who it implicates, state the tamper direction or magnitude, or explain the mechanism in this chapter.
         Present it as an unexplained discrepancy; the culprit and method are revealed later.
         Place this OBSERVATION in paragraph 1 or 2 (observation only — no inference about the culprit).
    • witnesses, recall, hugo, sudden, collapse [clue_early_1] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: hugo, collapse, suspicious
      ↳ MANDATORY TWO-PARAGRAPH STRUCTURE (must appear in paragraphs 1 or 2 — no later):
         Paragraph 1: The POV character physically approaches or directly observes this evidence.
           The narration or dialogue explicitly states what is seen (use the exact locked phrase if one applies).
         Paragraph 2 (immediately following): The detective or POV character explicitly reasons
           about what this evidence implies — who it implicates, why it may be unreliable,
           or what inference it supports. This must be a separate full paragraph, not a sentence appended to Paragraph 1.
    • crushed, stems, scattered, ground [clue_1] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: bouquet, crucial, understanding, cause, death
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
  - ALIBI LOCK: Dr. Mallory Finch's established alibi is "dinner time". Do NOT place Dr. Mallory Finch at any other location or in any other activity during the crime window. Any contradiction is a continuity error that triggers a retry.
- Locked fact phrase obligations:
  - If this batch mentions Temperature required for the sugar cube to dissolve and release the poison., write exactly: "one hundred degrees Fahrenheit".
  - If this batch mentions Time the victim was last seen consuming tea., write exactly: "ten minutes past seven".
  - If this batch mentions Number of melted sugar cubes found in the victim's room., write exactly: "three".
- Seasonal vocabulary allow-list: summer, summery, midsummer.
- Forbidden seasonal words: spring, autumn, winter.

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
Suspect pressure target(s): Dr. Mallory Finch, Beatrice Quill, Captain Ivor Hale, Sylvia Trent
Required new information: First clue observation tied to suspect landscape.
Forbidden reveals at this stage: No culprit reveal. | No full murder mechanism explanation. | Do not state the direction, magnitude, or agent of any clock or device tampering. Characters may only observe that two time sources disagree. "The clock was wound back by forty minutes" must not appear before Chapter 3.

FROZEN FACT STATE (DO NOT ALTER):
- Timeline anchor: June (summer).
- Month, season, weather, and time-of-year language in this batch must stay compatible with summer.
- If referenced, use exact phrase: "one hundred degrees Fahrenheit" (Temperature required for the sugar cube to dissolve and release the poison.).
- If referenced, use exact phrase: "ten minutes past seven" (Time the victim was last seen consuming tea.).
- If referenced, use exact phrase: "three" (Number of melted sugar cubes found in the victim's room.).

STORY TO DATE (REFERENCE ONLY — DO NOT COPY VERBATIM):
- No previous chapter text exists yet for this batch.

[SCENE COMPLETENESS CONTRACTS — MANDATORY. Each contract below lists what you MUST enact in that chapter. Do not summarise or mention these labels in the prose — enact them organically.]
Chapter 1 (Act 1) completeness contract:
  PIVOT ELEMENT (MANDATORY — write this into the prose, shown not told): "The bouquet of flowers clutched in Hugo's hand, now wilted and bruised."
  FACT ESTABLISHED (MANDATORY — reader must know this by chapter end): "Establishes that Hugo Vane was found dead shortly after receiving a bouquet, suggesting foul play."

# Case Overview
Title: The Delayed Deception
Era: 1940s
Setting: A large seaside hotel with Art Deco architecture
Crime: murder (poisoning)
Culprit: Dr. Mallory Finch
Victim: Hugo Vane
False assumption: Hugo Vane died from a heart attack after drinking too much champagne at the gala.
Cast: Eleanor Voss (she/her), Dr. Mallory Finch (she/her), Captain Ivor Hale (he/him), Beatrice Quill (she/her), Sylvia Trent (she/her), Hugo Vane (he/him)

Setting Lock: Keep all scenes and descriptions consistent with the stated setting (A large seaside hotel with Art Deco architecture). Do not introduce a different location type. Do not invent an alternative estate name. The only permitted name for this property is "A large seaside hotel with Art Deco architecture" — any other estate name (e.g., "Caldwell Manor", "Ashwood Hall", or any invented proper name) is a continuity error that will be caught and rejected.

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
      "location": "the grand ballroom of the seaside hotel",
      "timeOfDay": "Late evening, shortly after the gala",
      "atmosphere": "A mix of shock and confusion as guests gather in hushed tones"
    },
    "characters": [
      "Eleanor Voss",
      "Dr. Mallory Finch",
      "Beatrice Quill",
      "Captain Ivor Hale",
      "Sylvia Trent",
      "Hugo Vane"
    ],
    "purpose": "Introduce the crime and detective",
    "cluesRevealed": [
      "clue_early_1",
      "clue_1",
      "clue_mechanism_visibility_core"
    ],
    "dramaticElements": {
      "conflict": "The sudden death of a guest disrupts the celebratory atmosphere.",
      "tension": "Guests are on edge, unsure of what has happened.",
      "microMomentBeats": [
        "Eleanor stares at the lifeless body, her heart racing with disbelief."
      ]
    },
    "summary": "The evening gala at the seaside hotel is abruptly interrupted when Hugo Vane is found dead on the ballroom floor. Eleanor Voss, a guest at the event, is drawn into the chaos as she witnesses the shock of the attendees. As the guests gather around, conflicting reports emerge about Hugo's last moments.",
    "beat": "gathering",
    "estimatedWordCount": 1800,
    "pivotElement": "The bouquet of flowers clutched in Hugo's hand, now wilted and bruised.",
    "factEstablished": "Establishes that Hugo Vane was found dead shortly after receiving a bouquet, suggesting foul play.",
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
        "characterName": "Beatrice Quill",
        "behaviour": "Show normal social behaviour; grief or confusion if appropriate."
      },
      {
        "characterName": "Captain Ivor Hale",
        "behaviour": "Show normal social behaviour; grief or confusion if appropriate."
      },
      {
        "characterName": "Sylvia Trent",
        "behaviour": "Show normal social behaviour; grief or confusion if appropriate."
      },
      {
        "characterName": "Hugo Vane",
        "behaviour": "Show normal social behaviour; grief or confusion if appropriate."
      }
    ],
    "redHerringPlacement": null,
    "emotionalRegister": "A vibrant gala atmosphere quickly turns into shock and confusion with the victim's sudden collapse.",
    "dominantCharacterNote": {
      "name": "Eleanor Voss",
      "voiceRegister": "Eleanor's voice carries a lyrical cadence, often reflecting her artistic background."
    },
    "humourGuidance": {
      "permission": "forbidden"
    },
    "eraTextureNote": "Rationed goods limit the availability of luxury items; Fuel shortages restrict travel and transportation; The presence of military personnel affects social dynamics",
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
□ Allowed seasonal words only: summer, summery, midsummer.
□ Forbidden seasonal words: spring, autumn, winter.
□ Chapter 1: the clue [clue_mechanism_visibility_core] (delayed, action, poison, contained, within, stems, bouquet, releases, toxin, crushed) is placed in the first 25% of the chapter, dramatized in your own words, followed by an explicit inference or suspicion paragraph.
□ Chapter 1: the clue [clue_early_1] (witnesses, report, hugo, collapsed, shortly, handling, bouquet) is placed in the first 25% of the chapter, dramatized in your own words, followed by an explicit inference or suspicion paragraph.
□ Chapter 1: the clue [clue_1] (crushed, stems, area, hugo, collapsed) is placed in the first 25% of the chapter, dramatized in your own words, followed by an explicit inference or suspicion paragraph.
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
