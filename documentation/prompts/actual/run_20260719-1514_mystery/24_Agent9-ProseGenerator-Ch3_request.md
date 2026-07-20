# Actual Prompt Record

- Run ID: `mystery-1784474093773`
- Project ID: ``
- Timestamp: `2026-07-19T15:20:47.848Z`
- Agent: `Agent9-ProseGenerator-Ch3`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4.1`
- Temperature: `0.42`
- Max Tokens: `4500`
- Attempt: `first`
- Prompt Hash: `755518f39bb43b5d`

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
- VICTIM IDENTITY (HARD CONSTRAINT — lint-enforced): Hugo Vane is the murder victim, already dead before this chapter. They do NOT speak, enter, react, gesture, or appear in any present-tense scene. When Hugo Vane is referenced at all, it may ONLY be as: (a) physical evidence/the body, or (b) REPORTED memory/testimony — and reported references MUST be framed as recollection, never as a live beat. WRONG: `Hugo Vane said, "…"` / `Hugo Vane turned to him`. RIGHT: `Hugo Vane had said, weeks before, that…` / `Agnes remembered how Hugo Vane used to…`. Attach an explicit recollection frame ("had", "remembered", "recalled", "before she died", "in life") to any sentence that names Hugo Vane beside an action or speech verb. A live dialogue tag or present action for Hugo Vane is a continuity failure that will be rejected and regenerated.

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
The initial investigation reveals a tangled web of motives and secrets among the guests.

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

## Humour guidance for this story position (early)
Permission: forbidden
Rationale: The seriousness of the investigation requires a somber approach.

## Reveal Groundwork (texture — do not explain, only plant)
- Plant one subtle observable beat related to: "The earlier scene where Hugo receives the bouquet now resonates with deeper significance, as it foreshadows his tragic end". Do not explain significance yet.
- Plant one subtle observable beat related to: "Finch's tense argument with Hugo takes on a new light, suggesting a more personal connection to his demise". Do not explain significance yet.
- Plant one subtle observable beat related to: "Beatrice's anxious demeanor during the investigation hints at her hidden fears of exposure, which ultimately drive her actions throughout the story". Do not explain significance yet.

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

• [clue_1] crushed, stems, area, hugo, collapsed
  Category: testimonial | Criticality: essential | Supports inference step 2
  Points to: bouquet, crucial, understanding, cause, death

• [clue_early_1] witnesses, report, hugo, collapsed, shortly, handling, bouquet
  Category: testimonial | Criticality: essential | Supports inference step 1
  Points to: hugo, collapse, suspicious

• [clue_culprit_direct_dr_mallory_finch] Direct observation
  Category: structural | Placement: early (Act 1)
  Points to: what this observation reveals about the time or circumstances of the crime.

• [clue_fp_contradiction_step_2] Cross-check contradiction
  Category: structural | Placement: early (Act 1)
  Points to: what this observation reveals about the time or circumstances of the crime.

• [clue_mid_1] Witness statements about Hugo's interaction with the bouquet.
  Category: structural | Placement: early (Act 1)
  Points to: what this observation reveals about the time or circumstances of the crime.

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

CLUES ALREADY REVEALED TO READER: clue_early_1, clue_1, clue_mechanism_visibility_core, clue_core_contradiction_chain, clue_culprit_direct_dr_mallory_finch, clue_fp_contradiction_step_2 — do not reveal these as new information.

INVESTIGATION LOG — WHAT IS ESTABLISHED (do not re-establish, do not repeat):
• Evidence already established (reference only — do NOT restate or quote these; advance beyond them): hugo, collapse, suspicious | bouquet, crucial, understanding, cause, death | bouquet, linked, hugo, death | hugo, collapse, suspicious | direct, shows, mallory, finch, means, opportunity | damage, bouquet, suggests, played, role, death
• Suspects still unresolved: Captain Ivor Hale[HE], Beatrice Quill[SHE], Sylvia Trent[SHE]
⚠ The story must move FORWARD from this log. Any beat already listed above is forbidden from repeating.

⚠ THIS CHAPTER'S REQUIRED ADVANCE (early): Interview each suspect — record their claimed whereabouts

CONTINUITY HANDOFF — previous chapter closing beat:
  • "Eleanor’s mind returned to the bouquet, its crushed stems and scattered petals a silent accusation. The conflicting accounts of Hugo’s last moments suggested more than mere confusion—they hinted at deception, a deliberate attempt to obscure the truth. Eleanor..."
  • The next chapter must open as a continuation of this beat, not as a disconnected reset.

⛔ DEAD CHARACTER — CANNOT APPEAR AS ALIVE:
• Hugo Vane: murdered before Chapter 1. In ALL chapters from here on:
  - Refer to them ONLY in past tense, only as the victim of the crime
  - NEVER have them: enter a room, speak, respond, gesture, look, nod, or react
  - NEVER describe them as present at any scene, conversation, or confrontation
  - WRONG: "Hugo Vane crossed the room" / "Hugo Vane sat on the sofa" / "Hugo Vane nodded"
  - WRONG: "Hugo Vane gave testimony" / "Hugo Vane asked what had happened"
  - CORRECT: "Hugo Vane had often said..." / "Hugo Vane's effects were found" / "witnesses recalled Hugo Vane's habit of..."
═══════════════════════════════════════════════════════

═══════════════════════════════════════════════════════════
📚 CONTINUITY CONTEXT - CHARACTER & SETTING CONSISTENCY
═══════════════════════════════════════════════════════════

**CRITICAL: You are writing chapters 3+. Maintain consistency with earlier chapters.**

**Character Names Used in Chapters 1-2:**
Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill, Sylvia Trent, Hugo Vane

✓ RULE: Use EXACTLY these names. Do NOT vary spelling, add titles, or introduce new forms.
✓ Example: if earlier chapters used "Clara Whitfield", keep using "Clara Whitfield" — never "Mrs. Whitfield" unless that is the character's canonical name in the list above.

**Setting Vocabulary Established in Earlier Chapters:**
ballroom, lobby

✓ RULE: Continue using this location vocabulary. Maintain consistency with established setting type.
✓ Do NOT introduce new location types that contradict earlier chapters.

**Recent Chapter Summary (for narrative continuity):**
Chapter 1: Chapter 1: The Wilted Bouquet
  Events: On the polished floor, Hugo Vane lay motionless, his head tilted at a strange angle, one hand clutching a bouquet of flowers now wilted and bruised.
Chapter 2: Chapter 2: Initial Reactions
  Events: "He was laughing, wasn’t he?

⚠️ **VALIDATION:** Character name mismatches and setting drift are common failure modes.
Double-check every character name against the list above before using it.

**⏱ LOCKED TIME ANCHOR — use verbatim, do not paraphrase:**
Clock time (from the case ground truth): **"ten minutes past seven"**
✓ RULE: Every reference to the clock MUST use exactly this phrase. No variation permitted.
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
Known location profile anchors: The Crestview Hotel, The Dining Room, The Kitchen, Room 203, The Rooftop Terrace, the hotel dining room, now empty
LOCATION NAME CAPITALISATION (HARD REQUIREMENT — validated):
All named locations in your prose MUST use the EXACT capitalisation from the CML profiles.
Canonical forms: "The Crestview Hotel", "The Dining Room", "The Kitchen", "Room 203", "The Rooftop Terrace", "the hotel dining room, now empty"
Writing a location in lowercase (e.g. "drawing room" instead of "Drawing Room") is a validated error. Every time you mention a named location, copy its capitalisation from the list above.
- Chapter 3: OPENING STYLE (HARD): Start the VERY FIRST SENTENCE with an explicit time marker — e.g. "That morning…" / "By the time dusk fell…" / "It was nearly four o'clock…" / "On the second day after the discovery…". Time must be in the first clause. Anchor opening in "the hotel dining room, now empty". The opening style above governs only your FIRST SENTENCE; the grounding below may land anywhere in the first 2 paragraphs (it need not be sentence one, and never conflicts with the chosen opening style). HARD REQUIREMENT for the first 2 paragraphs: (a) include 2+ sensory words — choose from smell/scent/odor/fragrance/sound/echo/silence/whisper/creak/cold/warm/damp/rough/smooth/glow/shadow/flicker/dim — and (b) include 1+ atmosphere/time word — choose from rain/wind/fog/storm/mist/thunder/evening/morning/night/dawn/dusk/lighting/weather/season/afternoon/midday/noon/midnight/twilight/sunrise/sunset/daylight/sunlight/overcast/cloudy/bright/dark/grey/pale/chill/crisp/drizzle/haze/lamplight/firelight. These are validated requirements, not style suggestions; missing them triggers a retry.

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

PROMPT BUDGET SUMMARY: budget=24000 tokens; fixed=12017; context=11342; dropped=[humour_guide, location_profiles]; truncated=[location_profiles, temporal_context, pronoun_accuracy]

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
4. Integrate at least two concrete era-grounded details per chapter from setting refinement signals: radio broadcasting in every room | early vacuum tube televisions in common areas | basic radar systems for maritime navigation | party-line telephones in rooms | telegrams sent from local post office | military-style coded messages for sensitive information.
5. Respect setting movement/access constraints in scene action and alibis: narrow hallways limiting movement during peak hours | secluded beach area accessible only from the hotel | rooftop terrace providing limited visibility to surrounding areas | staff-only areas including the kitchen and storage | guest rooms requiring key access.
6. Sustain social coherence with this backdrop pressure: A tense gathering at a seaside hotel for a charity gala unites a diverse group, where wartime shifts in gender roles and rising Cold War anxieties create an atmosphere ripe for hidden motives and deadly secrets.
7. Maintain continuity around these socially central cast anchors where relevant: Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill, Sylvia Trent, Hugo Vane.
8. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Critical: Plot similarity 0.80 with 'The Mysterious Affair at Styles' (both involve poisoning)
9. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Moderate: Character similarity 0.70 with 'The Second Key' (similar cast structure and character roles)
10. STORY TO DATE ANTI-COPY RULE: The STORY TO DATE section below is provided for chronological and factual reference ONLY. You MUST NOT copy, lightly rephrase, or structurally echo any sentence or paragraph from prior chapters. Every sentence in this chapter must be original prose unique to this scene. Reusing even a clause from prior chapter text will cause this attempt to fail immediately.

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
- clue_1 must appear in Act 1, Scene 3 via Witness statement
- clue_culprit_direct_dr_mallory_finch must appear in Act 1, Scene 3 via Direct observation
- clue_early_1 must appear in Act 1, Scene 3 via Direct observation of the bouquet
- clue_fp_contradiction_step_2 must appear in Act 1, Scene 3 via Cross-check contradiction
- clue_mid_1 must appear in Act 1, Scene 3 via Witness statements about Hugo's interaction with the bouquet.

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
Investigation state at start: 6 clue(s) revealed to reader; approximately 3 unresolved suspect(s).
Must change by end: Increase or complicate suspicion through a new pressure revelation — WITHOUT resolving the case: do NOT name, accuse, or extract a confession from the culprit, make an arrest, or declare the case closed (that is reserved for the final reveal).
Suspect pressure target(s): Dr. Mallory Finch, Beatrice Quill, Captain Ivor Hale, Sylvia Trent
Required new information: At least one fear/motive/lie/loyalty reveal with investigative consequence.
Forbidden reveals at this stage: No culprit resolution: no confession, no arrest, no 'case closed', no accusation ('I accuse'/'I name'), and never state 'the culprit/murderer/killer is/was …'. The accusation is reserved for the final reveal — build suspicion only.

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
- Chapter 3:
  - STRUCTURAL ARCHETYPE — Chapter 3 must be: EVIDENCE
      ✓ MUST contain: new physical clue discovered
      ✗ MUST NOT contain: formal accusation
  - Word count: Target 1250 words. Achieve this through plot events, dialogue exchanges, and physical investigation — not through atmospheric repetition or extended internal reflection. Each 200-word segment should contain at minimum one concrete story event (a discovery, a conversation exchange, a physical action or movement). Padding with atmosphere alone is not acceptable.
  - Opening: Begin with a character action, spoken line, or clock/time marker — never a location name or location-description phrase.
  - Scene is set in: the hotel dining room, now empty — reference it naturally within the paragraph, never as your opening phrase.
  - Opening atmosphere (MANDATORY — validator enforced): the first paragraph MUST contain at least one of: rain / wind / fog / storm / mist / thunder / evening / morning / night / dawn / dusk / season / afternoon / midday / noon / midnight / twilight / sunrise / sunset / daylight / sunlight / overcast / cloudy / bright / dark / grey / pale / cold / warm / chill / crisp / damp / drizzle / haze / lamplight / firelight. A chapter that omits all of these from its opening paragraph will be rejected.
  - PARAGRAPH OPENER DIVERSITY (MANDATORY — validator enforced): No more than 2 paragraphs in this chapter may begin with "Eleanor" or "Eleanor's" as the first word. You must vary paragraph openings throughout: use sensory observations, another character's name or action, dialogue, object or sound details, or temporal markers. Opening 3 or more paragraphs with "Eleanor" will cause automated rejection.
  - ⛔ MECHANISM SPOILER BAN: Do NOT state how the crime device was manipulated — not the direction, not the magnitude, not who performed it. Characters may only observe that two sources of evidence disagree. The specific method, tamper amount, and perpetrator's action are ALL FORBIDDEN until the reveal. WRONG: "The culprit had altered the device by forty minutes to create a false alibi." RIGHT: "Two independent pieces of evidence gave contradictory readings — a discrepancy neither could yet explain."
  - Continuity bridge: in the first 120 words, visibly connect from the previous chapter's final beat. Carry forward one unresolved element (object, accusation, emotional pressure, or immediate physical action) from: "Eleanor’s mind returned to the bouquet, its crushed stems and scattered petals a silent accusation. The conflicting accounts of Hugo’s last moments suggested more than mere confusion—they hinted at deception, a deliberat...".
  - CLUE OBLIGATIONS — each clue below MUST be dramatized, but in YOUR OWN WORDS:
    Render each as something a character SEES, DOES, or SAYS on the page. The bracketed text is a
    DESCRIPTION of the evidence for you — do NOT transcribe it as narration. Copying a clue's
    description sentence verbatim into the prose FAILS validation.
    • crushed, stems, scattered, ground [clue_1] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: bouquet, crucial, understanding, cause, death
      ↳ MANDATORY TWO-PARAGRAPH STRUCTURE (must appear in paragraphs 1 or 2 — no later):
         Paragraph 1: The POV character physically approaches or directly observes this evidence.
           The narration or dialogue explicitly states what is seen (use the exact locked phrase if one applies).
         Paragraph 2 (immediately following): The detective or POV character explicitly reasons
           about what this evidence implies — who it implicates, why it may be unreliable,
           or what inference it supports. This must be a separate full paragraph, not a sentence appended to Paragraph 1.
    • bouquet, shows, signs, damage, crushed, stems [clue_culprit_direct_dr_mallory_finch] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
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
    • bouquet, shows, signs, damage, crushed, stems [clue_fp_contradiction_step_2] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: damage, bouquet, suggests, played, role, death
      ↳ MANDATORY TWO-PARAGRAPH STRUCTURE (must appear in paragraphs 1 or 2 — no later):
         Paragraph 1: The POV character physically approaches or directly observes this evidence.
           The narration or dialogue explicitly states what is seen (use the exact locked phrase if one applies).
         Paragraph 2 (immediately following): The detective or POV character explicitly reasons
           about what this evidence implies — who it implicates, why it may be unreliable,
           or what inference it supports. This must be a separate full paragraph, not a sentence appended to Paragraph 1.
    • crushed, stems, scattered, ground [clue_mid_1] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: bouquet, crucial, understanding, cause, death
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
  - ALIBI LOCK: Dr. Mallory Finch's established alibi is "dinner time". Do NOT place Dr. Mallory Finch at any other location or in any other activity during the crime window. Any contradiction is a continuity error that triggers a retry.
  - TESTIMONY CONTINUITY: Dr. Mallory Finch has already made statements in earlier chapters. Any time, location, or claim attributed to Dr. Mallory Finch in THIS chapter must be consistent with those earlier statements. Do NOT introduce a new or different alibi claim — any contradiction is a continuity error.
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
Batch chapters: 3-3.
Investigation state at start: 6 clue(s) revealed to reader; approximately 3 unresolved suspect(s).
Must change by end: Increase or complicate suspicion through a new pressure revelation — WITHOUT resolving the case: do NOT name, accuse, or extract a confession from the culprit, make an arrest, or declare the case closed (that is reserved for the final reveal).
Suspect pressure target(s): Dr. Mallory Finch, Beatrice Quill, Captain Ivor Hale, Sylvia Trent
Required new information: At least one fear/motive/lie/loyalty reveal with investigative consequence.
Forbidden reveals at this stage: No culprit resolution: no confession, no arrest, no 'case closed', no accusation ('I accuse'/'I name'), and never state 'the culprit/murderer/killer is/was …'. The accusation is reserved for the final reveal — build suspicion only.

FROZEN FACT STATE (DO NOT ALTER):
- Timeline anchor: June (summer).
- Month, season, weather, and time-of-year language in this batch must stay compatible with summer.
- If referenced, use exact phrase: "one hundred degrees Fahrenheit" (Temperature required for the sugar cube to dissolve and release the poison.).
- If referenced, use exact phrase: "ten minutes past seven" (Time the victim was last seen consuming tea.).
- If referenced, use exact phrase: "three" (Number of melted sugar cubes found in the victim's room.).

STORY TO DATE (REFERENCE ONLY — DO NOT COPY VERBATIM):
- Full prior chapter text is provided below for continuity, factual consistency, and reference accuracy.
- Use this to keep character voice, chronology, clue state, and location continuity aligned with earlier chapters.
- Do not quote, copy, or paraphrase these paragraphs too closely; write fresh prose that remains consistent with them.

--- BEGIN PRIOR CHAPTER 1 ---
Title: Chapter 1: The Wilted Bouquet
Eleanor Voss pressed through the crowd in the grand ballroom of the seaside hotel, her heels clicking against the smooth marble, the air thick with the scent of damp wood and sea salt. Lamplight flickered across the gilded columns, casting elongated shadows over the guests gathered in uneasy clusters. Outside, the wind battered the windows, carrying the distant echo of rain, but inside, the hush was broken only by the nervous murmur of voices and the faint clink of abandoned glasses. The evening, once vibrant with laughter and music, had soured into confusion and dread.

On the polished floor, Hugo Vane lay motionless, his head tilted at a strange angle, one hand clutching a bouquet of flowers now wilted and bruised. The stems were visibly crushed, petals scattered around his fingers, as if he had gripped them too tightly in his final moments. Eleanor knelt beside him, her breath shallow, noticing the odd pattern of damage: the bouquet was not simply dropped, but mangled, the stems torn and bruised as though something violent had occurred. Guests whispered behind her, recalling how Hugo had collapsed suddenly, moments after receiving the bouquet. The memory of his laughter still hung in the air, now replaced by a chilling silence.

Eleanor studied the scene, her gaze lingering on the crushed stems and the scattered petals. The bouquet, meant as a gesture of celebration, had become a grotesque centerpiece to tragedy. She traced the bruising along the stems, noting how they seemed to have been crushed deliberately, not by accident. The area around Hugo was littered with fragments of flower, their vibrant colors dulled by the ballroom's dim light. She wondered if the bouquet held more than sentiment—perhaps something sinister hidden within its beauty.

As Eleanor shifted her weight, she noticed several crushed stems scattered across the ground, apart from the main bouquet. Some were flattened and broken, lying among the petals and shoe prints, as if they had been trodden underfoot in the confusion. She paused, taking in the detail, and glanced at the guests, wondering if anyone else had seen the stems so carelessly strewn.

Rising slowly, Eleanor glanced at Dr. Mallory Finch, who hovered nearby, her expression taut and professional. Dr. Finch's tailored jacket and pearl necklace, so carefully chosen for the evening, now seemed incongruous against the grim tableau. Her hands were clasped tightly, knuckles pale, as she surveyed Hugo's body with clinical detachment. Eleanor caught the flicker of uncertainty in Dr. Finch's eyes, a hesitation that betrayed more than medical concern. The physician's presence was expected, yet her silence felt weighted, as if she were guarding something deeper than mere shock.

Captain Ivor Hale stood at a distance, his double-breasted navy suit rumpled, the fedora in his hand twisting slowly. He watched Eleanor with a guarded intensity, his jaw set, eyes narrowed beneath the ballroom's pale glow. A veteran's discipline radiated from his posture, but his grip on the hat betrayed a restless unease. Hale's rugged features, usually animated with sardonic humor, were subdued, his gaze darting between the bouquet and the guests. Eleanor sensed that he was not merely observing—he was calculating, measuring the room for threats and alliances.

Beatrice Quill, her tea-length floral dress and wide-brimmed straw hat now askew, hovered near the edge of the gathering. She fidgeted with the clasp of her stylish handbag, her lips parted as if to speak but no words emerged. Beatrice's bubbly demeanor had evaporated, replaced by a nervous energy that seemed to ripple through her every movement. Eleanor noted how Beatrice's gaze lingered on Hugo's hand, the bouquet, and then flickered away, as if afraid to confront the implications. The socialite's ambition, usually worn openly, was masked now by a layer of uncertainty and self-consciousness.

Sylvia Trent, poised near the ballroom doors, maintained an air of authority despite the chaos. Her tailored jacket and high-waisted skirt marked her as a woman accustomed to control, yet her sharp eyes betrayed a flicker of anxiety. Sylvia's voice cut through the murmurs with polite precision: "Now, let’s not make a scene, shall we? We can handle this." Yet Eleanor caught the tremor in Sylvia's hand as she adjusted her cat-eye sunglasses, a subtle sign that the hotel manager was not immune to the shock. Sylvia's gaze swept the room, searching for order amid the disorder, her composure fraying at the edges.

Eleanor rose to her feet, feeling the weight of expectation settle upon her shoulders. She was known here as a local artist, but tonight, the guests looked to her for guidance. The responsibility was unspoken, yet absolute—she would be the investigator, the one to make sense of the chaos. Eleanor's mind raced, cataloging the evidence: the bouquet's crushed stems, Hugo's sudden collapse, the scattered petals. She recalled the guests' conflicting reports, each whispering a different account of Hugo's last moments. The contradiction was clear—something about the bouquet, its damage, and the timing of Hugo's collapse demanded scrutiny.

The ballroom's atmosphere shifted as Eleanor began to question those nearest the scene. She asked Beatrice, "Did you see Hugo receive the bouquet?" Beatrice hesitated, her fingers tightening on her handbag. "Oh, I’m just a little fish in a big pond," she murmured, avoiding Eleanor's gaze. Captain Ivor Hale interjected, his voice rough: "He was laughing—then he just dropped. Life’s a storm, isn’t it?" Sylvia Trent offered a clipped reply: "I was merely attending to guests; nothing more, I assure you." Dr. Finch remained silent, her eyes fixed on the bouquet, as if searching for answers only she could see.

Eleanor's attention returned to the bouquet. The stems, bruised and torn, seemed to whisper of a hidden mechanism—a delayed action, perhaps, contained within their fragile beauty. She could not yet explain how, but the evidence was undeniable: the bouquet, crushed in Hugo's hand, was linked to his death. The guests' recollections, the physical damage, and the timing all converged on this singular anomaly. Eleanor resolved to pursue the truth, knowing that beneath the surface of celebration lay a web of secrets, waiting to be unraveled.
--- END PRIOR CHAPTER 1 ---

--- BEGIN PRIOR CHAPTER 2 ---
Title: Chapter 2: Initial Reactions
"He was laughing, wasn’t he? Right before—" Captain Ivor Hale’s voice cut through the low murmur of the hotel lobby, now crowded with guests and thick with the scent of rain-soaked wool and damp wood. The glow of lamplight flickered across anxious faces, while outside, the drizzle persisted, painting the glass doors with streaks that blurred the midsummer evening. Eleanor Voss stood just beyond the threshold, her hands trembling as she listened to the swirl of gossip surrounding Hugo Vane’s sudden collapse. The bouquet, still bruised and battered, lay on the reception desk where someone had placed it, its crushed stems a stark reminder of the violence that had shattered the gala’s joy.

As Eleanor moved closer, she caught the sound of Beatrice Quill’s voice, pitched high with nervous energy. "I saw Hugo take the bouquet, but it was all so quick—one moment he was smiling, the next he was on the floor." Beatrice’s wide-brimmed straw hat was askew, her tea-length dress damp at the hem from the rain. Several guests echoed Beatrice’s account, but their recollections diverged: some insisted Hugo had barely touched the flowers, others claimed he gripped them tightly, crushing the stems in his hand. The contradiction was palpable, each testimony colored by fear and confusion. Eleanor’s gaze lingered on the bouquet’s torn stems, noting how the damage seemed deliberate, not accidental. The fragments scattered across the marble floor, mingling with shoe prints and petals, spoke of a moment charged with hidden intent.

Eleanor considered the conflicting reports, her mind racing to reconcile the chaos. If Hugo had collapsed so suddenly after handling the bouquet, the timing was too precise to ignore. Yet the guests’ memories wavered, their stories shifting with each retelling. Some recalled laughter, others silence; a few swore the bouquet was handed to Hugo by Beatrice herself, while others insisted it had come from Sylvia Trent. The uncertainty gnawed at Eleanor, suggesting deception or confusion—perhaps both. The evidence was clear: Hugo’s collapse and the bouquet’s damage were intimately linked, but the truth remained elusive, buried beneath layers of conflicting testimony.

Dr. Mallory Finch stood apart from the crowd, her tailored jacket pristine despite the humidity, pearl necklace glinting in the lamplight. Her expression was taut, eyes fixed on the bouquet as if searching for answers only she could see. When Eleanor approached, Dr. Finch spoke in clipped tones. "Time is of the essence. We must establish the precise moment of Hugo’s collapse." Eleanor watched her, noting the faint tremor in Dr. Finch’s hand as she adjusted her jacket. The physician’s urgency seemed genuine, yet her gaze lingered too long on the bouquet’s crushed stems, as if she recognized something others missed. Eleanor wondered if Dr. Finch’s detachment masked a deeper anxiety—one that might explain her silence during the initial chaos.

Sylvia Trent, poised near the reception desk, maintained her composure with an air of authority. Her high-waisted skirt and tailored jacket marked her as a woman accustomed to control, but her sharp eyes betrayed a flicker of unease. Sylvia’s voice was crisp, cutting through the confusion: "Now, let’s not make a scene, shall we? We can handle this." Eleanor caught the tremor in Sylvia’s hand as she adjusted her cat-eye sunglasses, a subtle sign that the hotel manager was not immune to shock. Sylvia’s gaze swept the lobby, searching for order amid disorder, her composure fraying at the edges. When Eleanor pressed her about the bouquet, Sylvia hesitated. "I was merely attending to guests; nothing more, I assure you." The deflection was polite, but Eleanor sensed an undercurrent of fear—Sylvia’s reputation was at stake, and any misstep could unravel her carefully constructed life.

Captain Ivor Hale leaned against a marble column, his double-breasted navy suit rumpled, fedora in hand. He watched Eleanor with a guarded intensity, jaw set, eyes narrowed beneath the lobby’s pale glow. "Life’s a storm, isn’t it? We just weather it together," he remarked, voice rough with cynicism. Yet his grip on the hat betrayed a restless unease. Hale’s gaze darted between the bouquet and the guests, calculating, measuring the room for threats and alliances. When Eleanor questioned him about Hugo’s last moments, Hale shrugged. "He was laughing—then he just dropped. I didn’t see who handed him the bouquet. Too many people in the way." The ambiguity in Hale’s account mirrored the confusion of the crowd, leaving Eleanor to sift through the fragments of truth.

Beatrice Quill hovered near the edge of the gathering, fidgeting with the clasp of her stylish handbag. Her lips parted as if to speak, but no words emerged. When Eleanor pressed her for details, Beatrice’s bubbly demeanor faltered. "Oh, I’m just a little fish in a big pond," she murmured, avoiding Eleanor’s gaze. The socialite’s ambition, usually worn openly, was masked now by uncertainty and self-consciousness. Beatrice’s gaze lingered on Hugo’s hand, the bouquet, and then flickered away, as if afraid to confront the implications. Her reluctance to elaborate made Eleanor wonder if Beatrice’s fear stemmed from guilt or simply the pressure of scrutiny.

The lobby’s atmosphere shifted as whispers grew louder, the air thick with suspicion. Eleanor’s hands trembled as she listened to the swirl of gossip, each guest eager to distance themselves from the tragedy. The presence of military personnel—some in uniform, others in civilian dress—added a layer of tension, their watchful eyes scanning the crowd for signs of disorder. The rationed goods and fuel shortages, so familiar in post-war Brighton, seemed trivial compared to the gravity of Hugo’s death. Yet beneath the surface, the collective grief of the nation lingered, coloring every interaction with anxiety and doubt.

Eleanor’s mind returned to the bouquet, its crushed stems and scattered petals a silent accusation. The conflicting accounts of Hugo’s last moments suggested more than mere confusion—they hinted at deception, a deliberate attempt to obscure the truth. Eleanor resolved to pursue the matter, knowing that beneath the veneer of celebration lay a web of secrets waiting to be unraveled. The guests’ recollections, the physical damage, and the timing all converged on this singular anomaly. As the midsummer evening deepened, Eleanor felt the weight of expectation settle upon her shoulders. She would be the investigator, the one to make sense of the chaos, even as the truth remained just out of reach.
--- END PRIOR CHAPTER 2 ---

[SCENE COMPLETENESS CONTRACTS — MANDATORY. Each contract below lists what you MUST enact in that chapter. Do not summarise or mention these labels in the prose — enact them organically.]
Chapter 3 (Act 1) completeness contract:
  PIVOT ELEMENT (MANDATORY — write this into the prose, shown not told): "The bouquet left on the dining table, its petals bruised and crushed."
  FACT ESTABLISHED (MANDATORY — reader must know this by chapter end): "Establishes potential motives among several guests, hinting at deeper conflicts."

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
    "sceneNumber": 3,
    "act": 1,
    "title": "Suspects Emerge",
    "setting": {
      "location": "the hotel dining room, now empty",
      "timeOfDay": "Later that evening",
      "atmosphere": "A somber mood fills the room as guests disperse"
    },
    "characters": [
      "Eleanor Voss",
      "Dr. Mallory Finch",
      "Beatrice Quill",
      "Captain Ivor Hale",
      "Sylvia Trent"
    ],
    "purpose": "Introduce suspects and establish initial motives",
    "cluesRevealed": [
      "clue_1",
      "clue_early_1"
    ],
    "dramaticElements": {
      "conflict": "Tensions rise as motives begin to surface.",
      "tension": "Eleanor senses hidden agendas among the guests.",
      "microMomentBeats": [
        "Eleanor gazes at the empty chairs, feeling the weight of unspoken secrets."
      ]
    },
    "summary": "In the now-empty dining room, Eleanor begins to assess the guests as potential suspects. She observes their behaviors and interactions, noting the underlying tensions and possible motives for Hugo's death. The bouquet, still present on the table, draws her attention as a potential clue.",
    "beat": "first_enquiries",
    "estimatedWordCount": 1800,
    "pivotElement": "The bouquet left on the dining table, its petals bruised and crushed.",
    "factEstablished": "Establishes potential motives among several guests, hinting at deeper conflicts.",
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
      }
    ],
    "redHerringPlacement": null,
    "emotionalRegister": "The initial investigation reveals a tangled web of motives and secrets among the guests.",
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
□ Chapter 3: the clue [clue_1] (crushed, stems, area, hugo, collapsed) is placed in the first 25% of the chapter, dramatized in your own words, followed by an explicit inference or suspicion paragraph.
□ Chapter 3: the clue [clue_culprit_direct_dr_mallory_finch] (direct, ties, mallory, finch, mechanism, access, point, before, discriminating, excludes, competing, suspect) is placed in the first 25% of the chapter, dramatized in your own words, followed by an explicit inference or suspicion paragraph.
□ Chapter 3: the clue [clue_early_1] (witnesses, report, hugo, collapsed, shortly, handling, bouquet) is placed in the first 25% of the chapter, dramatized in your own words, followed by an explicit inference or suspicion paragraph.
□ Chapter 3: the clue [clue_fp_contradiction_step_2] (crushed, stems, area, hugo, collapsed) is placed in the first 25% of the chapter, dramatized in your own words, followed by an explicit inference or suspicion paragraph.
□ Chapter 3: the clue [clue_mid_1] (crushed, stems, area, hugo, collapsed) is placed in the first 25% of the chapter, dramatized in your own words, followed by an explicit inference or suspicion paragraph.
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
