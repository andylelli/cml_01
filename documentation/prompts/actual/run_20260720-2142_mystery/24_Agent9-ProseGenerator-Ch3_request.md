# Actual Prompt Record

- Run ID: `mystery-1784583752603`
- Project ID: ``
- Timestamp: `2026-07-20T21:51:42.562Z`
- Agent: `Agent9-ProseGenerator-Ch3`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4.1`
- Temperature: `0.42`
- Max Tokens: `4500`
- Attempt: `first`
- Prompt Hash: `3696422f1f6cfdca`

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
- MORAL COMPLEXITY REQUIREMENT: The mechanism of this crime carries a moral gray area: "The murderer believed they were avenging a wrong done to them by the victim, leading to a tragic yet sympathetic portrayal." — the culprit reveal and denouement MUST acknowledge this ambiguity. Do not let the ending feel clean or simple. Give the reader at least one moment of uncomfortable sympathy or moral doubt.

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
   - Eleanor Voss: Insider
   - Dr. Mallory Finch: Outsider
   - Captain Ivor Hale: Insider
   - Beatrice Quill: Observant Bystander
   - Sylvia Trent: Entitled Peer
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

## Era: 1941-October
Living through October 1941 means navigating a world shaped by the turbulence of World War II, where daily life is marked by rationing, uncertainty, and the looming specter of conflict. The atmosphere is thick with anxiety as people grapple with the realities of war—food shortages are palpable as rationing affects even the simplest pleasures. The sound of radio broadcasts fills the air, providing news updates that bring both dread and a sense of connection to the outside world. In the shadows of this turmoil, the hotel becomes a microcosm of society, where guests attempt to maintain a semblance of normalcy amidst the chaos. Social gatherings are fraught with tension, as the implications of the war weigh heavily on every conversation. The clash between the desire for enjoyment and the grim realities of life creates a charged environment where secrets thrive and relationships are tested.
Emotional register: The dominant emotional state is one of anxiety mixed with a yearning for normalcy amidst the chaos of war.
Physical constraints: Travel is limited due to fuel rationing and wartime restrictions. | Communication relies heavily on radio and postal services, which may be slow or unreliable. | Limited access to luxury goods leads to a heightened focus on essential items. | Social gatherings are subject to scrutiny and concern over wartime propriety.
Current tensions (weave into background texture): The United States is embroiled in World War II, affecting public sentiment and behavior. | Food rationing is a growing concern, impacting daily life and social interactions. | Political pressures lead to heightened scrutiny of social class and privilege.
Wartime context — Many citizens, especially men, are absent due to military service, leaving families to cope with their absence.: Women increasingly take on roles traditionally held by men, reshaping societal norms and expectations. Absence effect: The absence of loved ones due to military service heightens feelings of loss and uncertainty.

## Season Lock (mandatory — derived from 1941-October)
Season: autumn. Allowed vocabulary: autumn, autumnal, fall
Forbidden seasonal words — never use in narration, dialogue, or metaphor: spring, summer, winter and their adjectival forms.
Every weather description, atmosphere, and time-of-year reference must be consistent with autumn.

## Story Theme
The story explores the impact of hidden identities and the consequences of deception, revealing how the quest for truth can unravel tightly held secrets, and reveals that evidence carries ethical weight, forcing characters to choose accountability over social performance when appearances and facts collide.

## Story Emotional Register
Dominant: The story carries an overall emotional weight of tension and unease, punctuated by moments of revelation and confrontation.

Arc:
The story opens in the Seaside Grand Hotel, where guests gather for a lavish masquerade ball. The atmosphere is charged with excitement, but it quickly turns somber when Hugo Vane is found drowned in the ocean. This shocking event casts a shadow over the festivities, leaving guests in a state of disbelief and fear. As Eleanor Voss, an observant guest, begins her investigation, she encounters a web of secrets and lies. The initial investigation reveals clues that point towards multiple suspects, but false leads and emotional turmoil complicate her quest for the truth.

Tensions rise as each character grapples with their own motivations, and the emotional cost of uncovering the truth weighs heavily on them. A pivotal moment occurs when Eleanor discovers a disguise that hints at the true nature of the alibi, shifting her focus and altering the course of the investigation. The second turning point comes when past secrets are revealed, casting doubt on characters previously considered innocent. As pressure mounts, Eleanor confronts the suspects, leading to a climactic confrontation that forces each character to confront their own choices and the consequences of their actions. In the resolution, the emotional fallout is palpable; friendships are strained, reputations tarnished, and the quest for justice leaves its mark on everyone involved. The ending carries a bittersweet weight, as the characters navigate the aftermath of the tragedy, forever changed by the events that unfolded in the hotel.

## Emotional register at this point in the story
The initial investigation reveals a tangled web of secrets.

## Character Portraits (appearance & era)

### Eleanor Voss
Eleanor Voss embodies the spirit of resilience and curiosity characteristic of women stepping into new roles during the war. As a hotel receptionist, her keen observations provide her with a unique perspective on the unfolding drama. Her discovery of a scandal involving the victim adds a layer of complexity to her character, reflecting the moral dilemmas faced by individuals in a world where secrets can lead to both empowerment and downfall.
Era intersection: Her situation highlights the shifting gender roles as women take on more responsibilities in the workforce, often finding themselves in positions of influence.

### Dr. Mallory Finch
Dr. Mallory Finch navigates the pressures of professional integrity against the backdrop of a society grappling with the aftermath of war. Her resentment towards the victim due to past rivalries underscores the emotional stakes of the investigation, revealing how personal histories intertwine with the broader social context of wartime competition. As a respected psychiatrist, Mallory's internal conflicts reflect the struggles faced by women in maintaining their professional identities amidst societal upheaval.
Era intersection: Her rivalry with Hugo speaks to the heightened ambitions and personal stakes of women striving for recognition in a male-dominated field during the war.

### Captain Ivor Hale
Captain Ivor Hale's character encapsulates the emotional toll of war, as he battles PTSD while grappling with the fear of exposure. His struggles resonate with the collective experience of many veterans returning to civilian life, where the burden of past trauma often goes unnoticed. Ivor's interactions reveal the complexities of masculinity in a time of war, where vulnerability clashes with societal expectations of strength and stoicism.
Era intersection: His character reflects the societal pressures on men to conform to traditional roles while dealing with the psychological scars of conflict.

### Beatrice Quill
Beatrice Quill captures the essence of youthful ambition and loyalty amidst the challenges of wartime life. Working as a waitress, her friendly demeanor hides the weight of gossip and suspicion that permeates the hotel environment. Beatrice's character illustrates the precarious balance between loyalty to friends and self-preservation, highlighting the moral complexities faced by individuals striving to navigate their social circles during a tumultuous time.
Era intersection: Her situation mirrors the experiences of young women seeking independence and agency in a society that is still reeling from the impacts of war.

### Sylvia Trent
Sylvia Trent embodies the struggle for social standing and financial security, reflecting the broader societal concerns of women reliant on relationships for support during wartime. Her character highlights the desperation felt by many to maintain appearances in a world where financial instability looms large. Sylvia's interactions reveal the lengths individuals go to protect their social status, illuminating the intricate dance of privilege and vulnerability prevalent in her era.
Era intersection: Her reliance on the victim for financial support underscores the precarious nature of women's social mobility during wartime.

## Character Voices

### Eleanor Voss (she/her/her)
Eleanor speaks in a measured tone, often punctuating her observations with dry wit.
[comfortable] Well, that's a twist, isn't it? I suppose we all have our little secrets.
[evasive] I was just... taking a moment to collect my thoughts.
[stressed] I can’t believe this is happening. We need to find the truth before it’s too late.
Humour: Her dry wit injects a subtle levity into the otherwise tense atmosphere.

### Dr. Mallory Finch (she/her/her)
Mallory's calm, measured tone often carries a hint of sarcasm.
[comfortable] How fascinating, isn’t it? The human mind truly thrives on chaos.
[evasive] I’m not sure what you mean. My past is hardly relevant to this.
[stressed] This isn't just about me; it’s about everything I’ve worked for!
Humour: Her sardonic humor serves as a coping mechanism for her internal battles.

### Captain Ivor Hale (he/him/his)
Ivor’s deep, gravelly voice often reflects his military background, with a touch of self-deprecation.
[comfortable] Just my luck, really. I never thought I'd find myself in this mess.
[evasive] I was just... trying to enjoy a quiet drink, nothing more.
[stressed] They can’t know about my past! It would ruin me!
Humour: His self-deprecating humor reveals his struggle with vulnerability.

### Beatrice Quill (she/her/her)
Beatrice speaks in a lively and animated manner, filled with enthusiasm.
[comfortable] Can you believe it? Everyone is talking about the latest gossip!
[evasive] I wouldn’t know anything about that. I’m just a waitress.
[stressed] What if they find out? I can’t afford to lose my job!
Humour: Her observational humor adds a light-hearted touch even in serious moments.

### Sylvia Trent (she/her/her)
Sylvia’s refined speech often masks her underlying tension.
[comfortable] How dreadfully inconvenient this all is. One simply cannot plan for such events.
[evasive] I was in my room... just resting, really.
[stressed] If my financial troubles come to light, everything will be ruined!
Humour: Her polite savagery adds an intriguing layer to her social interactions.

## Location Registers (scene framing guides)

The Ocean View Room: The Ocean View Room, once a haven of luxury, now bears the weight of tragedy. Broken glass glitters like stars against the dark carpet, and the scent of spilled perfume mingles with salty air. Shadows flicker in candlelight, hinting at secrets hidden in the corners, creating an atmosphere thick with grief and uncertainty.. Camera angle: Entering this space feels like stepping into a darkened theater, where the drama of human emotion unfolds amidst the remnants of a violent act.. Era: The decor reflects the Art Deco style of the 1940s, adding an air of elegance that contrasts sharply with the horror of recent events.

The Grand Lobby: The Grand Lobby serves as the heart of the hotel, where guests congregate beneath gleaming chandeliers. The polished marble floors reflect elegance, yet the air is thick with an undercurrent of tension. Conversations are hushed, laughter feels forced, and every glance carries the weight of unspoken fears and anxieties.. Camera angle: The emotional stance here is one of cautious optimism, as guests navigate the delicate balance between social niceties and the specter of conflict.. Era: The lobby's decor features elements emblematic of 1940s Art Deco, showcasing the era's emphasis on luxury even in times of turmoil.

The Oceanfront Dining Room: The Oceanfront Dining Room offers an inviting atmosphere, yet beneath the surface, tension simmers. The scent of freshly baked bread mingles with salty air, creating a sense of comfort that contrasts with the unease felt by the guests. Conversations are filled with laughter, yet eyes dart nervously, as if anticipating the next revelation.. Camera angle: This space feels alive with energy, yet it holds an underlying tension, as the guests’ laughter echoes against the distant roar of the sea.. Era: The decor reflects the sophistication of the 1940s, with elegant table settings that highlight the era’s focus on fine dining, even amidst the backdrop of war.

The Secluded Beach: The Secluded Beach is a hidden refuge, where the roar of the surf mingles with the cries of seagulls. The isolation offers a moment of peace, yet the weight of secrets lingers in the air. Footprints in the wet sand tell stories of those who have ventured here, hinting at the mysteries waiting to be uncovered.. Camera angle: The emotional stance here is one of somber introspection, as the waves crash against the rocks, echoing the tumult of the characters' inner lives.. Era: The natural beauty of the beach contrasts with the grim realities of war, providing an escape that feels both freeing and fraught with danger.

## Humour guidance for this story position (early)
Permission: permitted
Characters who may be funny: Eleanor Voss
Rationale: Eleanor's dry wit can add levity to the investigation atmosphere.

## Reveal Groundwork (texture — do not explain, only plant)
- Plant one subtle observable beat related to: "Eleanor's early curiosity about the victim foreshadows her deeper involvement in the investigation, while Dr". Do not explain significance yet.
- Plant one subtle observable beat related to: "Finch's initial reluctance to confront her past reveals her deeper conflicts". Do not explain significance yet.
- Plant one subtle observable beat related to: "Plant one subtle anomaly that can be re-read after the resolution.". Do not explain significance yet.

FAIR-PLAY AND INFERENCE CONTRACT:
- FAIR PLAY CLUE TIMING: Never combine clue discovery and detective deduction in the same chapter. If a clue is first revealed to the reader in chapter N, the detective may only analyze, deduce from, or act on that clue in chapter N+1 or later.
- FAIR PLAY INFORMATION PARITY: The reader must see all clues BEFORE the detective uses them in reasoning. If the detective performs a test or makes a deduction, every piece of evidence supporting that conclusion must have been shown to the reader in earlier chapters.
- FAIR PLAY REVELATION SPACING: In the discriminating test scene, the detective can ONLY use clues that were revealed to the reader at least 1 full chapter earlier. Never introduce new clues or withheld information during the test.
- FAIR PLAY CONFRONTATION: During the final confrontation/revelation, the detective cannot surprise the reader with facts. Every piece of evidence cited must have been visible to the reader in prior chapters.
- Never solve by withheld information. Keep reader-information parity with detective reasoning.
- False assumption in force: The murderer was present at the ball throughout the evening.
- Hidden truth to progressively expose (compose in your own words from these elements): murderer, used, disguise, create, illusion, presence
- Inference path checkpoints to dramatize clearly — compose ENTIRELY in your own sentences from these key terms (reproducing any briefing phrase verbatim FAILS validation):
  - Step 1: obs: witnesses, describe, figure, resembling, victim, leaving, hotel, shortly, before, body, discovered | corr: figure, murderer, disguise | effect: narrows, suspect, pool, disguised, themselves
  - Step 2: obs: torn, piece, victim, costume, near, water, edge | corr: indicates, struggle, deception, involving, victim, clothing | effect: eliminates, beatrice, quill, suspect, since, helping, victim
  - Step 3: obs: footprints, leading, away, crime, scene, match, victim, shoes | corr: footprints, indicate, someone, else, left, scene | effect: narrows, suspects, escaped, unnoticed
- Discriminating test method: trap
- Discriminating test elements to dramatize (compose ENTIRELY in your own sentences from these — do NOT reproduce any briefing phrase verbatim): eleanor, voss, sets, situation, hotel, management, compare, disguise, used, known, facts, victim
- Test must rely on already-shown clue IDs: clue_7, clue_mechanism_visibility_core, clue_4, clue_early_1
- Fair-play rationale: Step 1: Witness statements and hotel footage establish a credible alibi. Step 2: The torn clothing and Beatrice's alibi eliminate her as a suspect. Step 3: The footprint evidence narrows down the suspects, leading to the final test comparing disguises.

## Character Reference

### Eleanor Voss (she/her — NEVER he/him)
Speaks in a measured tone, often punctuating her observations with wry comments
She has a habit of raising an eyebrow when skeptical.
Fears that exposing the affair will disrupt her carefully curated life and relationships at the hotel.
Voice colour: Eleanor Voss uses dry wit humour — let it surface in their dialogue where natural, not in every line.

### Dr. Mallory Finch (she/her — NEVER he/him)
Speaks with a calm, measured tone, often laced with sarcasm
She tends to overanalyze situations, using clinical jargon that can obscure her emotions.
Battles feelings of inadequacy and resentment stemming from her rivalry with Hugo, questioning her own professional integrity.
Voice colour: Dr. Mallory Finch uses sardonic humour — let it surface in their dialogue where natural, not in every line.

### Captain Ivor Hale (he/him — NEVER she/her)
Speaks in a deep, gravelly voice, often punctuated by long pauses as he gathers his thoughts
He uses military jargon, occasionally slipping into self-deprecation.
Struggles with feelings of inadequacy and shame over his mental health issues, fearing exposure and judgment.

### Beatrice Quill (she/her — NEVER he/him)
Speaks in a lively and animated manner, often punctuating her sentences with laughter
She has a tendency to embellish stories or facts for effect.
Struggles with the fear of being implicated in the investigation, caught between loyalty and self-preservation.
Voice colour: Beatrice Quill uses observational humour — let it surface in their dialogue where natural, not in every line.

### Sylvia Trent (she/her — NEVER he/him)
Speaks in a refined, articulate manner, often using flowery language
She has a habit of laughing lightly, even when discussing serious matters.
Fears the exposure of her financial troubles will lead to social ostracism and loss of status.
Voice colour: Sylvia Trent uses polite savagery humour — let it surface in their dialogue where natural, not in every line.


## CHARACTER CONTRACTS (binding for this scene)
Each entry below constrains how this character must be written in this chapter.
These override generic style guidance when they conflict.

### Eleanor Voss[SHE]
Voice & mannerisms: Speaks in a measured tone, often punctuating her observations with wry comments. She has a habit of raising an eyebrow when skeptical.
SIGNATURE TIC (use sparingly — this is Eleanor Voss's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "Well, that’s a twist, isn’t it?"
Sample voice fragments (match this register and rhythm):
  [comfortable] "Well, that's a twist, isn't it? I suppose we all have our little secrets."
  [evasive] "I was just... taking a moment to collect my thoughts."
Humour: dry wit — deploy occasionally (level 0.5)
FORBIDDEN phrase (never write for Eleanor Voss): "a surge of determination washed over her"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Curiosity about the victim's personal affairs" — do not surface in Act I.

### Dr. Mallory Finch[SHE]
Voice & mannerisms: Speaks with a calm, measured tone, often laced with sarcasm. She tends to overanalyze situations, using clinical jargon that can obscure her emotions.
SIGNATURE TIC (use sparingly — this is Dr. Mallory Finch's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "How fascinating, isn’t it?"
Sample voice fragments (match this register and rhythm):
  [comfortable] "How fascinating, isn’t it? The human mind truly thrives on chaos."
  [evasive] "I’m not sure what you mean. My past is hardly relevant to this."
Humour: sardonic — deploy occasionally (level 0.4)
FORBIDDEN phrase (never write for Dr. Mallory Finch): "palpable tension filled the room"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Seeks revenge for a past humiliation at the victim's hands." — do not surface in Act I.

### Captain Ivor Hale[HE]
Voice & mannerisms: Speaks in a deep, gravelly voice, often punctuated by long pauses as he gathers his thoughts. He uses military jargon, occasionally slipping into self-deprecation.
SIGNATURE TIC (use sparingly — this is Captain Ivor Hale's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "Just my luck, really."
Sample voice fragments (match this register and rhythm):
  [comfortable] "Just my luck, really. I never thought I'd find myself in this mess."
  [evasive] "I was just... trying to enjoy a quiet drink, nothing more."
Humour: self deprecating — deploy rarely (level 0.3)
FORBIDDEN phrase (never write for Captain Ivor Hale): "she knew with certainty she was right"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Believes the victim was about to expose his struggles to the public." — do not surface in Act I.

### Beatrice Quill[SHE]
Voice & mannerisms: Speaks in a lively and animated manner, often punctuating her sentences with laughter. She has a tendency to embellish stories or facts for effect.
SIGNATURE TIC (use sparingly — this is Beatrice Quill's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "Can you believe it?"
Sample voice fragments (match this register and rhythm):
  [comfortable] "Can you believe it? Everyone is talking about the latest gossip!"
  [evasive] "I wouldn’t know anything about that. I’m just a waitress."
Humour: observational — deploy occasionally (level 0.6)
FORBIDDEN phrase (never write for Beatrice Quill): "everyone could sense the atmosphere"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Motivated by loyalty to a colleague who was unfairly dismissed by the victim." — do not surface in Act I.

### Sylvia Trent[SHE]
Voice & mannerisms: Speaks in a refined, articulate manner, often using flowery language. She has a habit of laughing lightly, even when discussing serious matters.
SIGNATURE TIC (use sparingly — this is Sylvia Trent's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "How dreadfully inconvenient."
Sample voice fragments (match this register and rhythm):
  [comfortable] "How dreadfully inconvenient this all is. One simply cannot plan for such events."
  [evasive] "I was in my room... just resting, really."
Humour: polite savagery — deploy occasionally (level 0.4)
FORBIDDEN phrase (never write for Sylvia Trent): "she felt a wave of unease"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Fearing exposure of her financial troubles, she wanted the victim silenced." — do not surface in Act I.



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

- Living through October 1941 means navigating a world shaped by the turbulence of World War II, where daily life is marked by rationing, uncertainty, and the looming specter of conflict
- The atmosphere is thick with anxiety as people grapple with the realities of war—food shortages are palpable as rationing affects even the simplest pleasures
- The sound of radio broadcasts fills the air, providing news updates that bring both dread and a sense of connection to the outside world
- In the shadows of this turmoil, the hotel becomes a microcosm of society, where guests attempt to maintain a semblance of normalcy amidst the chaos
- Social gatherings are fraught with tension, as the implications of the war weigh heavily on every conversation

TEMPORAL CONTEXT:

This story takes place in October 1941 during N/A.

Seasonal Atmosphere:
- Weather patterns: overcast skies, occasional rain squalls, a brisk chill in the air
- Daylight: Days grow shorter, with twilight descending by six o'clock in the evening, leading to longer, shadowy nights.
- Seasonal activities: attending autumn fairs, enjoying evening walks under falling leaves, engaging in community charity events
- Seasonal occasions: Halloween (October 31)
- Season: N/A

Period Fashion (describe naturally):
- Men formal: double-breasted navy suit, white dress shirt with a thin tie, polished leather oxfords
- Men casual: tweed jacket, corduroy trousers, knit sweater
- Men accessories: flat cap, metal wristwatch, silk handkerchief in the breast pocket
- Women formal: elegant tea-length dress with a cinched waist, pearl necklace, cloche hat
- Women casual: tweed skirt and blouse combination, cardigan sweater, ankle boots
- Women accessories: leather handbag, silk scarf tied around the neck, vintage brooch

Cultural Context (reference naturally):
- Music/entertainment: Glenn Miller's 'In the Mood', Duke Ellington's 'Take the 'A' Train', Bing Crosby's 'I'm Dreaming of a White Christmas'; Films: Citizen Kane, The Maltese Falcon; Theatre: The Skin of Our Teeth, The Glass Menagerie; Radio: The Shadow, Suspense
- Typical prices: Bread loaf: four pence, Butter: one shilling, A meal at a diner: two shillings
- Current events: The United States is deeply embroiled in World War II, with rising tensions and military mobilization; The Lend-Lease Act is in effect, supporting Allied nations
- Literature: The Catcher in the Rye by J.D. Salinger | For Whom the Bell Tolls by Ernest Hemingway | The Little Prince by Antoine de Saint-Exupéry | [detective and mystery fiction] | [war literature] | [social commentary]
- Technology: the photoelectric cell | the electronic computer (in early development) | improvements in radio technology | radio receivers in most homes | manual typewriters in offices | early television sets in public spaces
- Daily life: visiting local markets for rationed goods, participating in community gatherings, listening to radio broadcasts in the evenings
- Social rituals: afternoon tea gatherings among women, weekly church services, community charity drives for war efforts

Atmospheric Details:
The scent of damp earth mingled with the crisp air, leaves crunching underfoot as guests navigate the hotel's lobby. A low murmur of conversations filled the room, punctuated by the occasional laughter or the clinking of glassware as patrons engaged in hushed discussions. The flickering light of early electric fixtures cast long shadows on the walls, where the tension of unspoken worries hung palpably in the air.

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
  - The footprints leading away from the scene were precisely twelve inches long.: "twelve inches"
  - The murder occurred shortly after ten minutes past eleven, when witnesses last saw the victim.: "ten minutes past eleven"
    ⛔ FORBIDDEN alternatives: "11:10", "11.10", "eleven ten", "eleven-ten", "eleven past ten", "quarter past eleven", "half past eleven" — the ONLY acceptable form is "ten minutes past eleven"
  - The body was found in water that was six feet deep, making it difficult to ascertain the cause of death.: "six feet"

If a value has no relevance to this chapter, omit it. But the moment you reference the underlying evidence, only the exact phrase above is acceptable.

⛔ CLUES TO SURFACE IN THESE CHAPTERS — mandatory:
The following evidence MUST be clearly observable to an attentive reader. Do not bury it in atmosphere or passing dialogue. Each clue must be concrete, specific, and noticeable:

• [clue_3] torn, piece, victim, costume, near, water, edge
  Category: testimonial | Criticality: essential | Supports inference step 2
  Points to: indicates, form, conflict, before, victim

• [clue_4] indicates, struggle, deception, involving, victim, clothing
  Category: testimonial | Criticality: essential | Supports inference step 2
  Points to: raises, questions, circumstances, leading, victim, death

• [clue_early_1] witnesses, describe, figure, resembling, victim, leaving, hotel, shortly, before, body, discovered
  Category: temporal | Criticality: essential | Supports inference step 1
  Points to: indicates, murderer, disguised, themselves, victim

• [clue_early_2] Witness statement
  Category: structural | Placement: early (Act 1)
  Points to: what this observation reveals about the time or circumstances of the crime.

• [clue_mid_1] Footprint analysis
  Category: structural | Placement: early (Act 1)
  Points to: what this observation reveals about the time or circumstances of the crime.

For each clue above: an attentive reader should be able to find, record, and later use it to reason toward the solution.

═══ NARRATIVE STATE (read-only — do not contradict) ═══

LOCKED FACTS — use verbatim whenever this evidence is described:
  • The footprints leading away from the scene were precisely twelve inches long.: "twelve inches"
  • The murder occurred shortly after ten minutes past eleven, when witnesses last saw the victim.: "ten minutes past eleven"
  • The body was found in water that was six feet deep, making it difficult to ascertain the cause of death.: "six feet"

CHARACTER PRONOUNS — never deviate from these:
  • Eleanor Voss: she/her/her
  • Dr. Mallory Finch: she/her/her
  • Captain Ivor Hale: he/him/his
  • Beatrice Quill: she/her/her
  • Sylvia Trent: she/her/her
  • Hugo Vane: he/him/his

CLUES ALREADY REVEALED TO READER: clue_mechanism_visibility_core, clue_early_2, clue_core_contradiction_chain, clue_mid_1 — do not reveal these as new information.

INVESTIGATION LOG — WHAT IS ESTABLISHED (do not re-establish, do not repeat):
• Evidence already established (reference only — do NOT restate or quote these; advance beyond them): indicates, murderer, disguised, themselves, victim | raises, doubts, true, identity, figure, seen | raises, doubts, true, identity, figure, seen | raises, questions, circumstances, leading, victim, death
• Suspect cleared: Beatrice Quill[SHE] — Confirmed she was assisting the victim before the incident
• Suspect cleared: Captain Ivor Hale[HE] — Witness testimony confirming his location during the murder
• Suspect cleared: Sylvia Trent[SHE] — Alibi confirmed: 7:00 PM - 8:30 PM
⚠ The story must move FORWARD from this log. Any beat already listed above is forbidden from repeating.

⚠ THIS CHAPTER'S REQUIRED ADVANCE (early): Interview each suspect — record their claimed whereabouts

CONTINUITY HANDOFF — previous chapter closing beat:
  • "She stepped back, allowing the tension to settle. The autumnal light filtered through the lobby, casting elongated shadows along the walls. The flickering radio broadcast a news bulletin, its static underscoring the uncertainty of the moment. Eleanor reflected..."
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
ballroom, corridor, lobby

✓ RULE: Continue using this location vocabulary. Maintain consistency with established setting type.
✓ Do NOT introduce new location types that contradict earlier chapters.

**Recent Chapter Summary (for narrative continuity):**
Chapter 1: Chapter 1: The Ballroom Awakens
  Events: The tension in the ballroom was palpable, punctuated by the low murmur of speculation.
Chapter 2: Chapter 2: Initial Reactions
  Events: "He was seen leaving, I’m certain of it," a guest insisted, voice trembling as the morning rain battered the glass doors of the hotel lobby.

⚠️ **VALIDATION:** Character name mismatches and setting drift are common failure modes.
Double-check every character name against the list above before using it.

**⏱ LOCKED TIME ANCHOR — use verbatim, do not paraphrase:**
Clock time (from the case ground truth): **"Time of the masquerade ball start: 7:00 PM"**
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
Known location profile anchors: The Seaside Grand Hotel, The Ocean View Room, The Grand Lobby, The Oceanfront Dining Room, The Secluded Beach, the hotel dining room
LOCATION NAME CAPITALISATION (HARD REQUIREMENT — validated):
All named locations in your prose MUST use the EXACT capitalisation from the CML profiles.
Canonical forms: "The Seaside Grand Hotel", "The Ocean View Room", "The Grand Lobby", "The Oceanfront Dining Room", "The Secluded Beach", "the hotel dining room"
Writing a location in lowercase (e.g. "drawing room" instead of "Drawing Room") is a validated error. Every time you mention a named location, copy its capitalisation from the list above.
- Chapter 3: OPENING STYLE (HARD): Start the VERY FIRST SENTENCE with an explicit time marker — e.g. "That morning…" / "By the time dusk fell…" / "It was nearly four o'clock…" / "On the second day after the discovery…". Time must be in the first clause. Anchor opening in "the hotel dining room". The opening style above governs only your FIRST SENTENCE; the grounding below may land anywhere in the first 2 paragraphs (it need not be sentence one, and never conflicts with the chosen opening style). HARD REQUIREMENT for the first 2 paragraphs: (a) include 2+ sensory words — choose from smell/scent/odor/fragrance/sound/echo/silence/whisper/creak/cold/warm/damp/rough/smooth/glow/shadow/flicker/dim — and (b) include 1+ atmosphere/time word — choose from rain/wind/fog/storm/mist/thunder/evening/morning/night/dawn/dusk/lighting/weather/season/afternoon/midday/noon/midnight/twilight/sunrise/sunset/daylight/sunlight/overcast/cloudy/bright/dark/grey/pale/chill/crisp/drizzle/haze/lamplight/firelight. These are validated requirements, not style suggestions; missing them triggers a retry.

[⚠ INTERNAL QUALITY DIAGNOSTICS — DO NOT REPRODUCE ANY PART OF THIS SECTION IN YOUR STORY OUTPUT. These are private generator observations for your consideration only. Your narrative must read as if this section does not exist. Never include phrases from this block in character dialogue, narration, or description.]

PRIOR CHAPTER QUALITY OBSERVATIONS:
- Chapter 1 (score 98/100):
  Quality gaps noted: scene grounding weakness
  Address in upcoming chapters: Open next chapter with a named location anchor plus at least two sensory cues and one atmosphere marker.
- Chapter 2 (score 96/100):
  Quality gaps noted: word density below preferred target (890/1000)
  Address in upcoming chapters: Increase chapter density with concrete investigation action and sensory-grounded beats; avoid recap-only padding.
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

PROMPT BUDGET SUMMARY: budget=24000 tokens; fixed=12175; context=11698; dropped=[humour_guide, location_profiles]; truncated=[location_profiles, temporal_context, pronoun_accuracy]

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
4. Integrate at least two concrete era-grounded details per chapter from setting refinement signals: radio broadcasts in every room | early television sets in common areas | manual typewriters for administrative tasks | long-distance telephone calls via switchboard | military-style coded messages | telegrams for urgent correspondence.
5. Respect setting movement/access constraints in scene action and alibis: narrow staircases limiting access | rooms with limited visibility to hallways | secluded beach area reducing outside visibility | staff-only areas such as kitchens and storage | guest access restricted after dark.
6. Sustain social coherence with this backdrop pressure: A masquerade ball at a remote seaside hotel draws a diverse group of guests, where the tension of post-war societal shifts and class distinctions creates a volatile mix of ambition and deception.
7. Maintain continuity around these socially central cast anchors where relevant: Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill, Sylvia Trent, Hugo Vane.
8. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Critical: Plot similarity 0.85 with 'The Second Key' (same crime type and method of poisoning)
9. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Moderate: Character similarity 0.74 with 'The Second Key' (mirrored role dynamics and character count)
10. STORY TO DATE ANTI-COPY RULE: The STORY TO DATE section below is provided for chronological and factual reference ONLY. You MUST NOT copy, lightly rephrase, or structurally echo any sentence or paragraph from prior chapters. Every sentence in this chapter must be original prose unique to this scene. Reusing even a clause from prior chapter text will cause this attempt to fail immediately.

CRITICAL PROSE REQUIREMENTS:

The CML specifies exact requirements for certain validation-critical scenes. You MUST include these elements at the specified positions.

**Discriminating Test Scene (Act 3, Scene 4):**
Required elements: Execute the discriminating test, Observe the culprit's reaction or result, Draw conclusion about guilt

**Suspect Clearance Scenes:**
- Beatrice Quill (Act 3, Scene 5): Confirmed she was assisting the victim before the incident
  Clues: clue_id_1, clue_id_2
- Captain Ivor Hale (Act 3, Scene 5): Witness testimony confirming his location during the murder
  Clues: clue_id_1, clue_id_2
- Sylvia Trent (Act 3, Scene 5): Alibi confirmed: 7:00 PM - 8:30 PM

**Culprit Revelation Scene (Act 3, Scene 6):**
Method: Confrontation with evidence

**Clue Placement for These Chapters:**
- clue_3 must appear in Act 1, Scene 3 via Witness statement
- clue_4 must appear in Act 1, Scene 3 via Cross-check contradiction
- clue_early_1 must appear in Act 1, Scene 3 via Direct observation
- clue_early_2 must appear in Act 1, Scene 3 via Witness statement
- clue_mid_1 must appear in Act 1, Scene 3 via Footprint analysis

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
Investigation state at start: 4 clue(s) revealed to reader; approximately 0 unresolved suspect(s).
Must change by end: Increase or complicate suspicion through a new pressure revelation — WITHOUT resolving the case: do NOT name, accuse, or extract a confession from the culprit, make an arrest, or declare the case closed (that is reserved for the final reveal).
Suspect pressure target(s): Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill, Sylvia Trent
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
  - Scene is set in: the hotel dining room — reference it naturally within the paragraph, never as your opening phrase.
  - Opening atmosphere (MANDATORY — validator enforced): the first paragraph MUST contain at least one of: rain / wind / fog / storm / mist / thunder / evening / morning / night / dawn / dusk / season / afternoon / midday / noon / midnight / twilight / sunrise / sunset / daylight / sunlight / overcast / cloudy / bright / dark / grey / pale / cold / warm / chill / crisp / damp / drizzle / haze / lamplight / firelight. A chapter that omits all of these from its opening paragraph will be rejected.
  - PARAGRAPH OPENER DIVERSITY (MANDATORY — validator enforced): No more than 2 paragraphs in this chapter may begin with "Eleanor" or "Eleanor's" as the first word. You must vary paragraph openings throughout: use sensory observations, another character's name or action, dialogue, object or sound details, or temporal markers. Opening 3 or more paragraphs with "Eleanor" will cause automated rejection.
  - ⛔ MECHANISM SPOILER BAN: Do NOT state how the crime device was manipulated — not the direction, not the magnitude, not who performed it. Characters may only observe that two sources of evidence disagree. The specific method, tamper amount, and perpetrator's action are ALL FORBIDDEN until the reveal. WRONG: "The culprit had altered the device by forty minutes to create a false alibi." RIGHT: "Two independent pieces of evidence gave contradictory readings — a discrepancy neither could yet explain."
  - Continuity bridge: in the first 120 words, visibly connect from the previous chapter's final beat. Carry forward one unresolved element (object, accusation, emotional pressure, or immediate physical action) from: "She stepped back, allowing the tension to settle. The autumnal light filtered through the lobby, casting elongated shadows along the walls. The flickering radio broadcast a news bulletin, its static underscoring the unce...".
  - CLUE OBLIGATIONS — each clue below MUST be dramatized, but in YOUR OWN WORDS:
    Render each as something a character SEES, DOES, or SAYS on the page. The bracketed text is a
    DESCRIPTION of the evidence for you — do NOT transcribe it as narration. Copying a clue's
    description sentence verbatim into the prose FAILS validation.
    • torn, costume, piece, visible, scene [clue_3] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: indicates, form, conflict, before, victim
      ↳ MANDATORY TWO-PARAGRAPH STRUCTURE (must appear in paragraphs 1 or 2 — no later):
         Paragraph 1: The POV character physically approaches or directly observes this evidence.
           The narration or dialogue explicitly states what is seen (use the exact locked phrase if one applies).
         Paragraph 2 (immediately following): The detective or POV character explicitly reasons
           about what this evidence implies — who it implicates, why it may be unreliable,
           or what inference it supports. This must be a separate full paragraph, not a sentence appended to Paragraph 1.
    • condition, victim, clothing, suggests, foul, play [clue_4] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: raises, questions, circumstances, leading, victim, death
      ↳ MANDATORY TWO-PARAGRAPH STRUCTURE (must appear in paragraphs 1 or 2 — no later):
         Paragraph 1: The POV character physically approaches or directly observes this evidence.
           The narration or dialogue explicitly states what is seen (use the exact locked phrase if one applies).
         Paragraph 2 (immediately following): The detective or POV character explicitly reasons
           about what this evidence implies — who it implicates, why it may be unreliable,
           or what inference it supports. This must be a separate full paragraph, not a sentence appended to Paragraph 1.
    • witnesses, report, seeing, figure, resembling, victim [clue_early_1] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: indicates, murderer, disguised, themselves, victim
      ↳ MANDATORY TWO-PARAGRAPH STRUCTURE (must appear in paragraphs 1 or 2 — no later):
         Paragraph 1: The POV character physically approaches or directly observes this evidence.
           The narration or dialogue explicitly states what is seen (use the exact locked phrase if one applies).
         Paragraph 2 (immediately following): The detective or POV character explicitly reasons
           about what this evidence implies — who it implicates, why it may be unreliable,
           or what inference it supports. This must be a separate full paragraph, not a sentence appended to Paragraph 1.
    • witnesses, claim, figure, leaving [clue_early_2] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: raises, doubts, true, identity, figure, seen
      ↳ MANDATORY TWO-PARAGRAPH STRUCTURE (must appear in paragraphs 1 or 2 — no later):
         Paragraph 1: The POV character physically approaches or directly observes this evidence.
           The narration or dialogue explicitly states what is seen (use the exact locked phrase if one applies).
         Paragraph 2 (immediately following): The detective or POV character explicitly reasons
           about what this evidence implies — who it implicates, why it may be unreliable,
           or what inference it supports. This must be a separate full paragraph, not a sentence appended to Paragraph 1.
    • condition, victim, clothing, suggests, foul, play [clue_mid_1] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: raises, questions, circumstances, leading, victim, death
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
  - ALIBI LOCK: Dr. Mallory Finch's established alibi is "7:00 PM - 8:30 PM". Do NOT place Dr. Mallory Finch at any other location or in any other activity during the crime window. Any contradiction is a continuity error that triggers a retry.
  - TESTIMONY CONTINUITY: Dr. Mallory Finch has already made statements in earlier chapters. Any time, location, or claim attributed to Dr. Mallory Finch in THIS chapter must be consistent with those earlier statements. Do NOT introduce a new or different alibi claim — any contradiction is a continuity error.
- Locked fact phrase obligations:
  - If this batch mentions The footprints leading away from the scene were precisely twelve inches long., write exactly: "twelve inches".
  - If this batch mentions The murder occurred shortly after ten minutes past eleven, when witnesses last saw the victim., write exactly: "ten minutes past eleven".
  - If this batch mentions The body was found in water that was six feet deep, making it difficult to ascertain the cause of death., write exactly: "six feet".
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
Batch chapters: 3-3.
Investigation state at start: 4 clue(s) revealed to reader; approximately 0 unresolved suspect(s).
Must change by end: Increase or complicate suspicion through a new pressure revelation — WITHOUT resolving the case: do NOT name, accuse, or extract a confession from the culprit, make an arrest, or declare the case closed (that is reserved for the final reveal).
Suspect pressure target(s): Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill, Sylvia Trent
Required new information: At least one fear/motive/lie/loyalty reveal with investigative consequence.
Forbidden reveals at this stage: No culprit resolution: no confession, no arrest, no 'case closed', no accusation ('I accuse'/'I name'), and never state 'the culprit/murderer/killer is/was …'. The accusation is reserved for the final reveal — build suspicion only.

FROZEN FACT STATE (DO NOT ALTER):
- Timeline anchor: October (autumn).
- Month, season, weather, and time-of-year language in this batch must stay compatible with autumn.
- Established timeline fact: Time of the masquerade ball start: 7:00 PM
- Established timeline fact: Time of the body discovery: 8:45 PM
- If referenced, use exact phrase: "twelve inches" (The footprints leading away from the scene were precisely twelve inches long.).
- If referenced, use exact phrase: "ten minutes past eleven" (The murder occurred shortly after ten minutes past eleven, when witnesses last saw the victim.).
- If referenced, use exact phrase: "six feet" (The body was found in water that was six feet deep, making it difficult to ascertain the cause of death.).

STORY TO DATE (REFERENCE ONLY — DO NOT COPY VERBATIM):
- Full prior chapter text is provided below for continuity, factual consistency, and reference accuracy.
- Use this to keep character voice, chronology, clue state, and location continuity aligned with earlier chapters.
- Do not quote, copy, or paraphrase these paragraphs too closely; write fresh prose that remains consistent with them.

--- BEGIN PRIOR CHAPTER 1 ---
Title: Chapter 1: The Ballroom Awakens
Eleanor Voss pressed her palm against the cold marble pillar as she entered the hotel ballroom, the morning’s grey light filtering through tall windows. The air carried a faint scent of damp velvet and the lingering tang of spilled champagne, while the echo of last night’s rain still whispered against the glass. Shadows stretched across the Art Deco murals, and the room’s usual brightness was subdued by a chill that seemed to settle in the bones. A cluster of guests stood near the far wall, their voices hushed, faces drawn tight with anxiety. At the center, Hugo Vane lay motionless, his formal attire soaked and disheveled, the mask from the previous night’s masquerade ball abandoned beside him. The sight struck Eleanor with a jolt—she had seen Hugo Vane only hours before, alive and animated, now rendered a silent figure amid the morning’s gloom.

The tension in the ballroom was palpable, punctuated by the low murmur of speculation. Eleanor knelt beside Hugo Vane, her fingers brushing the damp carpet, noting the faint outline where water had pooled. The scent of salt and perfume mingled in the air, a reminder of the proximity to the sea and the excess of last night’s festivities. She glanced up, catching the eye of Captain Ivor Hale, whose posture was rigid, his hand clenched around a metal wristwatch. Dr. Mallory Finch stood nearby, her expression unreadable, arms folded tightly across her chest. Beatrice Quill hovered at the edge of the gathering, her lively demeanor subdued, fingers twisting the edge of her apron. Sylvia Trent lingered behind a velvet settee, her face pale, pearl necklace askew. Each guest seemed caught between shock and suspicion, their gazes darting from Hugo Vane to Eleanor, as if waiting for her to speak.

A faint sound drew Eleanor’s attention—whispers from the corridor, where two guests debated the events of the night. 'I saw someone slip out just before the commotion,' one voice insisted. 'Looked like Hugo Vane, but the walk was wrong.' The other replied, 'He was near the exit, wasn’t he? But then, who was it really?' Eleanor’s mind sharpened, recalling the moment: a figure resembling Hugo Vane had been seen leaving the hotel shortly before the body was discovered. The detail unsettled her; the resemblance was uncanny, but something about the gait, the hurried movement, seemed off. She wondered if the witnesses had truly seen Hugo Vane or someone disguised, and why that person would linger near the exit at such a critical moment.

Eleanor rose, brushing her skirt, and turned to the assembled guests. 'We have a contradiction,' she said, her voice steady despite the tremor in her chest. 'Several people claim to have seen Hugo Vane leaving the hotel, but the body was found here, not outside.' She allowed her gaze to linger on Dr. Mallory Finch, whose lips curled in a faint, sardonic smile, and on Captain Ivor Hale, who avoided her eyes, instead adjusting his tie with deliberate care. Beatrice Quill’s hands trembled as she clasped them together, while Sylvia Trent laughed lightly, the sound brittle and forced. The tension among them was unmistakable, each suspect caught in the web of uncertainty Eleanor had begun to weave.

The ballroom’s atmosphere grew heavier. Eleanor moved to the mantelpiece, where two clocks sat side by side, their faces gleaming beneath the dim morning light. One clock read ten minutes past eleven, while the other showed ten to twelve. She frowned, raising an eyebrow in skepticism. 'Well, that’s a twist, isn’t it?' she murmured, more to herself than to the room. The discrepancy was glaring—two independent timepieces, two different accounts of the night’s timeline. She noted the contradiction: if Hugo Vane died no later than ten minutes past eleven, several guests’ alibis were suddenly cast into doubt. The ballroom, once a stage for celebration, now became a theater of suspicion.

Captain Ivor Hale stepped forward, his gravelly voice breaking the silence. 'Just my luck, really. I never thought I'd find myself in this mess.' He glanced at Eleanor, then at the clocks, his brow furrowed. 'Are you certain about the times?' Eleanor nodded, her gaze unwavering. 'Both clocks are wound and functioning. The difference isn’t accidental.' Dr. Mallory Finch interjected, her tone measured but tinged with sarcasm. 'How fascinating, isn’t it? The human mind truly thrives on chaos.' She tapped her fingers against her sleeve, avoiding Eleanor’s eyes. Beatrice Quill, voice barely above a whisper, added, 'Can you believe it? Everyone is talking about the latest gossip, but none of it makes sense.' Sylvia Trent’s laugh echoed again, softer this time. 'How dreadfully inconvenient. One simply cannot plan for such events.' The exchange revealed more than words: each guest’s reaction betrayed anxiety, evasion, or deflection, and Eleanor catalogued their responses with clinical precision.

As Eleanor surveyed the ballroom, she recalled the micro-moment from earlier: Hugo Vane, lingering near the exit, as if hesitating to leave. The detail gnawed at her—was he seeking escape, or was someone else using his likeness to create confusion? The masquerade ball had provided ample opportunity for disguise, and the witnesses’ reports of a figure resembling Hugo Vane suggested the possibility of deception. Eleanor’s mind raced, piecing together the fragments: the contradictory clocks, the odd witness accounts, the guests’ evasive behavior. The morning’s chill seemed to deepen, the scent of damp velvet growing stronger, as if the room itself recoiled from the truth.

Eleanor drew herself upright, feeling the weight of responsibility settle on her shoulders. She was the investigator now, the one expected to untangle the web of lies and half-truths. The ballroom’s grandeur faded beneath the strain of the moment; the Art Deco patterns blurred as she focused on the faces before her. 'I’ll need to speak with each of you,' she said quietly, her tone measured. 'There are questions that must be answered, and time is not on our side.' The guests exchanged uneasy glances, their silence thick with apprehension. Outside, the sound of rain resumed, tapping against the windows in a steady rhythm. Eleanor looked once more at Hugo Vane’s body, then at the clocks, knowing that the contradiction she had uncovered was only the beginning.

The morning after the masquerade ball was meant to bring relief, a return to normalcy after the night’s revelry. Instead, it ushered in a new kind of tension—a somber reckoning, a search for truth. Eleanor Voss stood at the center of it all, her dry wit muted by the gravity of the scene. The ballroom, with its cold marble and flickering shadows, became the crucible for the investigation. As the guests dispersed, Eleanor lingered, her thoughts circling the pivotal clues: the figure seen leaving, the clocks’ contradiction, the possibility of disguise. The autumnal light crept across the floor, and Eleanor resolved to follow the evidence wherever it led, no matter how unsettling the path.
--- END PRIOR CHAPTER 1 ---

--- BEGIN PRIOR CHAPTER 2 ---
Title: Chapter 2: Initial Reactions
"He was seen leaving, I’m certain of it," a guest insisted, voice trembling as the morning rain battered the glass doors of the hotel lobby. The scent of damp wool coats mingled with the faint aroma of polished wood, and the low hum of a radio flickered in and out, chasing shadows across the marble floor. Eleanor Voss stood at the heart of the commotion, her eyes scanning the crowd for any sign of order amid the chaos. The autumnal chill seeped through the lobby, clinging to her skin as she listened to the contradictory accounts swirling around Hugo Vane’s last moments.

Eleanor Voss laid the facts out plainly where the others could see them. The record now held: Indicates struggle deception involving victim clothing.

That detail shifted the reasoning. Weighed against the rest, Indicates struggle deception involving victim clothing bent the trail toward Raises questions circumstances leading victim death.

Eleanor’s gaze landed on Dr. Mallory Finch, whose fingers drummed nervously against the arm of a velvet chair. The doctor’s measured tone was at odds with her restless movements. Nearby, Captain Ivor Hale leaned against a chrome pillar, his jaw set, eyes fixed on the rain outside. Beatrice Quill hovered near the reception desk, apron askew, her lively manner subdued. Sylvia Trent, pearl necklace gleaming in the dull light, laughed lightly as she adjusted her gloves, her composure brittle. The guests argued, voices rising and falling, each determined to assert their version of events. Eleanor caught the phrase again: "It was Hugo Vane, wasn’t it? But the walk was wrong." The contradiction lingered, sharpening her skepticism.

She moved closer to the cluster of guests, noting the tension in their posture. The witnesses’ claims—each insisting they saw Hugo Vane leave the ballroom just before the body was discovered—created a web of confusion. The figure’s resemblance to Hugo Vane was uncanny, but the hurried gait, the awkward turn at the exit, suggested something was amiss. Eleanor pressed for details, her voice steady. "Describe what you saw. Was it truly Hugo Vane, or could someone have been disguised?" The question hung in the air, met with uneasy silence. The possibility of deception unsettled the group, casting doubt on the reliability of their testimony.

Eleanor’s mind raced, piecing together the contradiction. If Hugo Vane was seen leaving, yet his body was found inside, the timeline fractured. The masquerade ball, with its abundance of costumes and masks, had provided ample opportunity for someone to impersonate him. The witnesses’ statements, once assumed to be straightforward, now appeared fraught with uncertainty. Eleanor reasoned aloud, her measured tone cutting through the noise: "If the figure was not Hugo Vane, then someone used disguise to mislead us. This changes everything—our assumptions, our suspects." She raised an eyebrow, her signature skepticism surfacing. The contradiction was no longer a minor detail; it was the pivot point of the investigation.

As the guests argued, Eleanor’s attention shifted to the condition of Hugo Vane’s clothing. The formal attire was torn, the fabric stained and rumpled, suggesting a struggle had taken place. She knelt beside the body, careful not to disturb the evidence, and observed the jagged edges of his jacket, the missing cufflink, the faint imprint of a hand on his sleeve. The sight was unsettling, a stark reminder that foul play was involved. Eleanor stood, brushing her skirt, and addressed the group: "His clothing tells a story—one of violence and deception. Someone wanted us to believe he left peacefully, but the evidence says otherwise."

The guests’ reactions were immediate. Dr. Mallory Finch’s calm facade faltered, her fingers twisting the hem of her sleeve. Captain Ivor Hale’s gravelly voice broke the silence: "Just my luck, really. I never thought I'd find myself in this mess." He avoided Eleanor’s gaze, instead studying the rain as it streaked down the glass. Beatrice Quill’s hands trembled, her voice barely above a whisper: "Can you believe it? Everyone is talking about the latest gossip, but none of it makes sense." Sylvia Trent laughed again, the sound brittle. "How dreadfully inconvenient. One simply cannot plan for such events." The emotional cost was evident—each guest caught between fear, suspicion, and the desire to protect themselves.

Eleanor catalogued their responses, noting the subtle shifts in demeanor. Dr. Mallory Finch’s nervous fidgeting betrayed anxiety, perhaps guilt or fear of exposure. Captain Ivor Hale’s evasive posture hinted at secrets kept close. Beatrice Quill’s subdued manner suggested a conflict between loyalty and self-preservation. Sylvia Trent’s brittle laughter masked deeper worries about reputation and security. The investigation’s pressure had begun to fracture the group, revealing new layers of motive and vulnerability.

She stepped back, allowing the tension to settle. The autumnal light filtered through the lobby, casting elongated shadows along the walls. The flickering radio broadcast a news bulletin, its static underscoring the uncertainty of the moment. Eleanor reflected on the revised meaning of the clues: the witness accounts, once taken as proof, now pointed to deliberate misdirection; the torn clothing, once seen as incidental, now signaled a struggle for control. The theory had shifted—someone had used disguise to create confusion, and the evidence demanded a new line of inquiry. The relief was fleeting, replaced by a renewed sense of urgency. Eleanor resolved to follow the trail, knowing that every contradiction brought her closer to the truth, but at a cost none could ignore.
--- END PRIOR CHAPTER 2 ---

[SCENE COMPLETENESS CONTRACTS — MANDATORY. Each contract below lists what you MUST enact in that chapter. Do not summarise or mention these labels in the prose — enact them organically.]
Chapter 3 (Act 1) completeness contract:
  PIVOT ELEMENT (MANDATORY — write this into the prose, shown not told): "A torn piece of the victim's costume found near the water's edge."
  FACT ESTABLISHED (MANDATORY — reader must know this by chapter end): "Establishes that the victim had an altercation before the murder, indicating a struggle."

# Case Overview
Title: The Masquerade of Authority
Era: 1940s
Setting: A seaside hotel characterized by Art Deco architecture
Crime: murder (poisoning)
Culprit: Dr. Mallory Finch
Victim: Hugo Vane
False assumption: The murderer was present at the ball throughout the evening.
Cast: Eleanor Voss (she/her), Dr. Mallory Finch (she/her), Captain Ivor Hale (he/him), Beatrice Quill (she/her), Sylvia Trent (she/her), Hugo Vane (he/him)

Setting Lock: Keep all scenes and descriptions consistent with the stated setting (A seaside hotel characterized by Art Deco architecture). Do not introduce a different location type. Do not invent an alternative estate name. The only permitted name for this property is "A seaside hotel characterized by Art Deco architecture" — any other estate name (e.g., "Caldwell Manor", "Ashwood Hall", or any invented proper name) is a continuity error that will be caught and rejected.

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
      "location": "the hotel dining room",
      "timeOfDay": "Early afternoon",
      "atmosphere": "Quiet, with a sense of dread lingering in the air"
    },
    "characters": [
      "Eleanor Voss",
      "Dr. Mallory Finch",
      "Captain Ivor Hale",
      "Beatrice Quill",
      "Sylvia Trent"
    ],
    "purpose": "Gather witness statements and establish initial alibis",
    "cluesRevealed": [
      "clue_3",
      "clue_4",
      "clue_early_1"
    ],
    "dramaticElements": {
      "conflict": "Tension arises as guests are questioned.",
      "tension": "Suspects begin to feel the pressure of scrutiny.",
      "microMomentBeats": [
        "Eleanor feels a pang of guilt as she realizes she had spoken to the victim earlier."
      ]
    },
    "summary": "In the hotel dining room, Eleanor Voss interviews the witnesses, collecting their statements. Dr. Finch reveals that she was in the ballroom helping the victim just before the murder, while Captain Hale provides his alibi of being at the bar. A torn piece of the victim's costume is found near the water's edge, suggesting foul play. The conflicting testimonies raise more questions than answers.",
    "beat": "first_enquiries",
    "estimatedWordCount": 1800,
    "pivotElement": "A torn piece of the victim's costume found near the water's edge.",
    "factEstablished": "Establishes that the victim had an altercation before the murder, indicating a struggle.",
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
        "characterName": "Sylvia Trent",
        "behaviour": "Show normal social behaviour; grief or confusion if appropriate."
      },
      {
        "characterName": "Hugo Vane",
        "behaviour": "Show normal social behaviour; grief or confusion if appropriate."
      }
    ],
    "redHerringPlacement": null,
    "emotionalRegister": "The initial investigation reveals a tangled web of secrets.",
    "dominantCharacterNote": {
      "name": "Eleanor Voss",
      "voiceRegister": "Eleanor speaks in a measured tone, often punctuating her observations with dry wit."
    },
    "humourGuidance": {
      "permission": "permitted",
      "character": "Eleanor Voss"
    },
    "eraTextureNote": "Travel is limited due to fuel rationing and wartime restrictions.; Communication relies heavily on radio and postal services, which may be slow or unreliable.; Limited access to luxury goods leads to a heightened focus on essential items.; Social gatherings are subject to scrutiny and concern over wartime propriety.; The presence of military personnel and government officials creates an atmosphere of oversight.",
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
□ Chapter 3: the clue [clue_3] (torn, piece, victim, costume, near, water, edge) is placed in the first 25% of the chapter, dramatized in your own words, followed by an explicit inference or suspicion paragraph.
□ Chapter 3: the clue [clue_4] (indicates, struggle, deception, involving, victim, clothing) is placed in the first 25% of the chapter, dramatized in your own words, followed by an explicit inference or suspicion paragraph.
□ Chapter 3: the clue [clue_early_1] (witnesses, describe, figure, resembling, victim, leaving, hotel, shortly, before, body, discovered) is placed in the first 25% of the chapter, dramatized in your own words, followed by an explicit inference or suspicion paragraph.
□ Chapter 3: the clue [clue_early_2] (figure, murderer, disguise) is placed in the first 25% of the chapter, dramatized in your own words, followed by an explicit inference or suspicion paragraph.
□ Chapter 3: the clue [clue_mid_1] (indicates, struggle, deception, involving, victim, clothing) is placed in the first 25% of the chapter, dramatized in your own words, followed by an explicit inference or suspicion paragraph.
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
