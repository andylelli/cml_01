# Actual Prompt Record

- Run ID: `mystery-1784233999360`
- Project ID: ``
- Timestamp: `2026-07-16T20:45:23.688Z`
- Agent: `Agent9-ProseGenerator-Ch4`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4.1`
- Temperature: `0.54`
- Max Tokens: `4500`
- Attempt: `retry 1`
- Prompt Hash: `98288aab7527b04c`

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
- MORAL COMPLEXITY REQUIREMENT: The mechanism of this crime carries a moral gray area: "The murderer was driven by desperation to protect a loved one, creating a conflict between right and wrong." — the culprit reveal and denouement MUST acknowledge this ambiguity. Do not let the ending feel clean or simple. Give the reader at least one moment of uncomfortable sympathy or moral doubt.

- CHAPTER OPENING (every chapter, lint-enforced): never open on a tour or inventory of named rooms/places. The first sentence must land a character ACTION, a specific sensory detail, or a concrete in-scene moment — not "In the [room], the [room], and the [room]…". Locations enter through what a character does in them, one at a time.
- VICTIM IDENTITY (HARD CONSTRAINT — lint-enforced): Dr. Mallory Finch is the murder victim, already dead before this chapter. They do NOT speak, enter, react, gesture, or appear in any present-tense scene. When Dr. Mallory Finch is referenced at all, it may ONLY be as: (a) physical evidence/the body, or (b) REPORTED memory/testimony — and reported references MUST be framed as recollection, never as a live beat. WRONG: `Dr. Mallory Finch said, "…"` / `Dr. Mallory Finch turned to him`. RIGHT: `Dr. Mallory Finch had said, weeks before, that…` / `Agnes remembered how Dr. Mallory Finch used to…`. Attach an explicit recollection frame ("had", "remembered", "recalled", "before she died", "in life") to any sentence that names Dr. Mallory Finch beside an action or speech verb. A live dialogue tag or present action for Dr. Mallory Finch is a continuity failure that will be rejected and regenerated.

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
   - Captain Ivor Hale: Jealous Ex-Lover
   - Beatrice Quill: Envious Admirer
   - Sylvia Trent: Manipulative Strategist
   - Hugo Vane: Cynical Outsider
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

- Sylvia Trent
  Public identity anchor: Socialite; suspect 
  Connection to victim: Professional acquaintances; both women navigate the intricacies of social standing.; Mallory and Sylvia have attended numerous social events together, but there's an underlying competition..
  Investigation relevance: access plausibility: high | alibi window: limited.
  Suspicion/pressure cue seed: job security.
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

## Era: 1948-11
In November 1948, the atmosphere is thick with the remnants of World War II and the uncertainties of the Cold War. The coastal town of Brighton, a popular holiday destination, is rife with the complexities of post-war life, where rationing still lingers and societal roles are shifting. The recent establishment of the United Nations heralds hope for peace, yet tensions arise as returning soldiers struggle to reintegrate into civilian life. Women, having stepped into various roles during the war, face a dual reality of empowerment and traditional expectations as they gather in spaces like The Clifftop Haven. This juxtaposition creates an undercurrent of anxiety among the guests, who are navigating personal agendas amid the broader societal changes.
Emotional register: The dominant emotional state is one of apprehensive hopefulness, with lingering fear and uncertainty about the future.
Physical constraints: Rationing affects access to food and resources, limiting social activities. | Limited public transportation and fuel shortages hinder travel and communication. | The lingering presence of wartime security measures creates an atmosphere of vigilance and suspicion. | Cold weather and shorter days restrict outdoor activities, leading to gatherings in confined spaces.
Current tensions (weave into background texture): Post-war economic recovery is slow and uneven, leading to inflation and continued rationing of goods. | The onset of the Cold War creates political anxiety, with fears of conflict escalating across Europe. | Social expectations are shifting, with women increasingly entering the workforce while facing scrutiny.
Wartime context — Many guests are veterans or have connections to military service, grappling with memories of wartime experiences.: The war has altered social dynamics, creating a blend of camaraderie and suspicion among those who served. Absence effect: The absence of loved ones continues to weigh on families, creating a palpable sense of loss.

## Story Theme
The story explores how the facades people maintain can lead to deadly consequences, revealing that the pursuit of justice can often blur ethical lines, and reveals that evidence carries ethical weight, forcing characters to choose accountability over social performance when appearances and facts collide.

## Story Emotional Register
Dominant: The story carries a tone of suspense and emotional complexity, revealing the hidden depths of human motivations.

Arc:
As the story opens, the atmosphere in The Clifftop Haven is thick with tension and unspoken secrets. The murder of Dr. Mallory Finch at ten minutes past ten casts a shadow over the elegant gathering, where guests are forced to confront their own hidden agendas. Detective Eleanor Voss, sharp and observant, is drawn into the investigation, her sense of justice driving her forward but also weighing heavily on her conscience. As she begins to uncover the first clues, the emotional cost of the investigation mounts, with each interaction revealing deeper layers of jealousy, betrayal, and ambition among the suspects.

Midway through the story, a pivotal turning point occurs when Eleanor realizes that the killer's impersonation created a false alibi, shifting her focus and intensifying her pursuit of the truth. This revelation re-colors earlier events, making her question the motives of those around her. The stakes rise as the tension escalates; with the clock ticking down to the climactic confrontation, the emotional pressure on each character culminates in a charged atmosphere.

As the climax unfolds, Eleanor confronts the killer, revealing the intricate web of deceit spun by Beatrice Quill, who allowed jealousy and ambition to cloud her judgment. The resolution brings a bittersweet closure, as each character grapples with the emotional fallout of their choices. Eleanor’s journey highlights the cost of justice, leaving her with a deeper understanding of the complexities of human nature and the shadows that linger in the hearts of those she sought to protect.

## Emotional register at this point in the story
A realization about the killer's impersonation shifts Eleanor's focus, heightening the stakes.

## Character Portraits (appearance & era)

### Eleanor Voss
Eleanor Voss embodies the changing role of women in post-war society, balancing her responsibilities as an innkeeper with the lingering shadows of her past. As a woman who once faced societal judgment, she now navigates the new expectations of her era, striving for respect and stability amidst the chaos of murder and suspicion. Her relationship with the victim complicates her emotional landscape, as she grapples with her own vulnerabilities while seeking justice.
Era intersection: Eleanor's personal struggles reflect the broader societal shifts, as women assert their independence in a world still recovering from war.

### Sylvia Trent
Sylvia Trent represents the social elite navigating the post-war landscape, where power dynamics are shifting. Her manipulative tendencies reveal the darker side of ambition, as she uses her social skills to further her own interests. As a character, Sylvia embodies the tensions between maintaining status and the ethical dilemmas that arise in a time of societal upheaval.
Era intersection: Sylvia's actions reflect the complexities of navigating power structures in a world where traditional roles are being challenged.

### Hugo Vane
Hugo Vane exemplifies the cynical journalist grappling with the moral implications of his investigative pursuits. His character reflects the tension between truth and reputation, embodying the ethical dilemmas faced by those in the media. As he navigates the fallout of the murder, Hugo's struggle serves as a reminder of the responsibilities that come with power over information in a society still healing from the scars of war.
Era intersection: Hugo's internal conflict mirrors the broader societal struggle with truth and transparency in a world where mistrust is prevalent.

## Character Voices

### Eleanor Voss (she/her/her)
Eleanor's voice is warm and inviting, often tinged with gentle sarcasm that showcases her dry wit.
[comfortable] Well, isn’t that just the way of things? You think you know someone, and then...
[evasive] Oh, I was just busy with the guests. You know how it is — a million things to juggle.
[stressed] I can’t believe this is happening. What if they find out? My reputation... it’s all at stake!
Humour: Eleanor's dry wit adds a layer of complexity to her character, making her interactions engaging.

### Sylvia Trent (she/her/her)
Sylvia's voice is polished and eloquent, often carrying a subtle edge.
[comfortable] Well, that's simply delightful, isn't it? Always a pleasure to see such enthusiasm.
[evasive] Oh, I wouldn’t worry too much about that. Some things are best left unsaid.
[stressed] This could ruin everything I’ve worked for! We can’t let it come to light!
Humour: Sylvia's polished savagery offers a sharp contrast to her manipulative nature.

### Hugo Vane (he/him/his)
Hugo’s voice is direct and no-nonsense, often cutting through pleasantries.
[comfortable] Truth is a slippery fish; you’ve got to know how to catch it.
[evasive] I’m not at liberty to discuss that right now. Let’s focus on the facts.
[stressed] If this gets out, it could destroy my career. I can’t let that happen!
Humour: Hugo's bluntness adds a layer of cynicism to his character, making his interactions impactful.

## Location Registers (scene framing guides)

The Rooftop Terrace: The Rooftop Terrace, now a crime scene, feels charged with tension and unease, the once serene escape transformed into a site of chaos and fear. The coldness of the stone contrasts sharply with the warmth of the memories that linger in the air, reminding guests of the fragility of life and the darkness that can lurk beneath the surface.. Camera angle: Entering this space feels like stepping into a haunting memory, where echoes of laughter have been replaced by whispers of dread.. Era: The overcast skies and the chill of the evening create an oppressive atmosphere, reflecting the emotional weight of the events unfolding.

The Drawing Room: The Drawing Room exudes an air of elegance, yet the tension among guests is palpable. Shadows flicker in the candlelight, reflecting the duality of beauty and fear that permeates the space, as hidden agendas come to light amidst the soft strains of jazz.. Camera angle: Entering this room feels like stepping into a stage set for intrigue, where every glance carries weight and every conversation has a hidden agenda.. Era: The opulent decor serves as a reminder of the social complexities of the 1940s, where appearances can be deceiving.

The Kitchen: The Kitchen hums with frenetic energy, filled with the aromas of cooking mingling with the tension of secrets waiting to be uncovered. The chaos of preparation contrasts with the calm of the dining areas, highlighting the divide between appearance and reality.. Camera angle: Entering this space feels like stepping into the heart of the inn, where the true dynamics of the hotel come alive amid the scent of comfort and unease.. Era: The bustling activity in the kitchen reflects the post-war economy's recovery, where food preparation is both a necessity and a source of comfort.

The Central Courtyard: The Central Courtyard is a vibrant yet deceptive oasis, where beauty masks the simmering tensions among guests. The warmth of the sun contrasts with the undercurrents of suspicion, creating an atmosphere that is both inviting and fraught with complexity.. Camera angle: Entering this space feels like walking into a paradox of tranquility and tension, where every moment is ripe with potential for revelation.. Era: The landscaped beauty of the courtyard serves as a stark reminder of the fragility of peace in a post-war world.

## Humour guidance for this story position (first_turn)
Permission: forbidden
Rationale: Heightened tension does not allow for humor without undermining the stakes.

## Reveal Groundwork (texture — do not explain, only plant)
- Plant one subtle observable beat related to: "The false assumption about Hugo Vane being the prime suspect complicates the investigation, as it reveals how first impressions can be misleading". Do not explain significance yet.
- Plant one subtle observable beat related to: "Plant one subtle anomaly that can be re-read after the resolution.". Do not explain significance yet.
- Plant one subtle observable beat related to: "Lastly, the tampered clock serves as a critical clue that retroactively alters the timeline of events, emphasizing the importance of scrutinizing alibis and motivations". Do not explain significance yet.

FAIR-PLAY AND INFERENCE CONTRACT:
- FAIR PLAY CLUE TIMING: Never combine clue discovery and detective deduction in the same chapter. If a clue is first revealed to the reader in chapter N, the detective may only analyze, deduce from, or act on that clue in chapter N+1 or later.
- FAIR PLAY INFORMATION PARITY: The reader must see all clues BEFORE the detective uses them in reasoning. If the detective performs a test or makes a deduction, every piece of evidence supporting that conclusion must have been shown to the reader in earlier chapters.
- FAIR PLAY REVELATION SPACING: In the discriminating test scene, the detective can ONLY use clues that were revealed to the reader at least 1 full chapter earlier. Never introduce new clues or withheld information during the test.
- FAIR PLAY CONFRONTATION: During the final confrontation/revelation, the detective cannot surprise the reader with facts. Every piece of evidence cited must have been visible to the reader in prior chapters.
- Never solve by withheld information. Keep reader-information parity with detective reasoning.
- False assumption in force: The killer was not present at the time of the murder due to their established alibi.
- Hidden truth to progressively expose (compose in your own words from these elements): killer, impersonation, create, false, alibi
- Inference path checkpoints to dramatize clearly — compose ENTIRELY in your own sentences from these key terms (reproducing any briefing phrase verbatim FAILS validation):
  - Step 1: obs: witnesses, tailored, suit, near, victim, room, shortly, before, murder | corr: tailored, suit, indicates, someone, impersonating, finch | effect: eliminates, possibility, real, finch, present
  - Step 2: obs: piece, fabric, killer, costume, near, victim, body | corr: fabric, matches, costume, used, impersonation | effect: narrows, suspect, pool, access, costume
  - Step 3: obs: hotel, clock, tampered, showing, different, time | corr: indicates, killer, manipulated, timeline, create, alibi | effect: tightens, focus, suspects, opportunity, alter, clock
- Discriminating test method: trap
- Discriminating test elements to dramatize (compose ENTIRELY in your own sentences from these — do NOT reproduce any briefing phrase verbatim): reenact, witnesses, compare, accounts, seeing, tailored, suit, clock, time, discrepancies
- Test must rely on already-shown clue IDs: clue_1, clue_6, clue_11, clue_early_1
- Fair-play rationale: Step 1: The tailored suit evidence (early) and witness accounts (mid) lead the reader to suspect impersonation. Step 2: The fabric clue (mid) underscores the impersonation method. Step 3: The tampered clock (discriminating test) proves the fabricated alibi.

## Character Reference

### Eleanor Voss (she/her — NEVER he/him)
Eleanor speaks in a warm, inviting tone, often punctuating her sentences with gentle sarcasm
She has a tendency to ask rhetorical questions, leading her listeners to conclusions.
Eleanor grapples with guilt over her affair and the fear that her past will overshadow her future.
Voice colour: Eleanor Voss uses dry wit humour — let it surface in their dialogue where natural, not in every line.

### Sylvia Trent (she/her — NEVER he/him)
Sylvia speaks with a polished eloquence, her words carefully chosen to convey both charm and manipulation
She often employs a subtle, cutting wit that keeps her listeners on their toes.
Sylvia is torn between her desire for power and the consequences of her manipulative actions, questioning whether her ambitions are worth the cost.
Voice colour: Sylvia Trent uses polite savagery humour — let it surface in their dialogue where natural, not in every line.

### Hugo Vane (he/him — NEVER she/her)
Hugo speaks in a direct, no-nonsense manner, often cutting through pleasantries with sharp observations
He has a tendency to make biting remarks, often using sarcasm to express his cynicism.
Hugo grapples with the moral implications of his investigative pursuits, questioning whether the truth is worth the potential destruction of lives.
Voice colour: Hugo Vane uses blunt humour — let it surface in their dialogue where natural, not in every line.


## CHARACTER CONTRACTS (binding for this scene)
Each entry below constrains how this character must be written in this chapter.
These override generic style guidance when they conflict.

### Eleanor Voss[SHE]
Voice & mannerisms: Eleanor speaks in a warm, inviting tone, often punctuating her sentences with gentle sarcasm. She has a tendency to ask rhetorical questions, leading her listeners to conclusions.
SIGNATURE TIC (use sparingly — this is Eleanor Voss's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "Well, isn’t that just the way of things?"
Sample voice fragments (match this register and rhythm):
  [comfortable] "Well, isn’t that just the way of things? You think you know someone, and then..."
  [evasive] "Oh, I was just busy with the guests. You know how it is — a million things to juggle."
Humour: dry wit — deploy occasionally (level 0.5)
FORBIDDEN phrase (never write for Eleanor Voss): "a surge of determination washed over her"
Act 2 behaviour contract: May show unease, evasion, or mild defensiveness when questioned. One behavioural tell is permitted. Internal conflict emerging: "Eleanor grapples with guilt over her affair and the fear that her past will overshadow her future."

### Sylvia Trent[SHE]
Voice & mannerisms: Sylvia speaks with a polished eloquence, her words carefully chosen to convey both charm and manipulation. She often employs a subtle, cutting wit that keeps her listeners on their toes.
SIGNATURE TIC (use sparingly — this is Sylvia Trent's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "Well, that's simply delightful, isn't it?"
Sample voice fragments (match this register and rhythm):
  [comfortable] "Well, that's simply delightful, isn't it? Always a pleasure to see such enthusiasm."
  [evasive] "Oh, I wouldn’t worry too much about that. Some things are best left unsaid."
Humour: polite savagery — deploy occasionally (level 0.5)
FORBIDDEN phrase (never write for Sylvia Trent): "she felt a wave of unease"
Act 2 behaviour contract: May show unease, evasion, or mild defensiveness when questioned. One behavioural tell is permitted. Internal conflict emerging: "Sylvia is torn between her desire for power and the consequences of her manipulative actions, questioning whether her ambitions are worth the cost."

### Hugo Vane[HE]
Voice & mannerisms: Hugo speaks in a direct, no-nonsense manner, often cutting through pleasantries with sharp observations. He has a tendency to make biting remarks, often using sarcasm to express his cynicism.
SIGNATURE TIC (use sparingly — this is Hugo Vane's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "Truth is a slippery fish."
Sample voice fragments (match this register and rhythm):
  [comfortable] "Truth is a slippery fish; you’ve got to know how to catch it."
  [evasive] "I’m not at liberty to discuss that right now. Let’s focus on the facts."
Humour: blunt — deploy frequently (level 0.7)
FORBIDDEN phrase (never write for Hugo Vane): "she chose her words with great care"
Act 2 behaviour contract: May show unease, evasion, or mild defensiveness when questioned. One behavioural tell is permitted. Internal conflict emerging: "Hugo grapples with the moral implications of his investigative pursuits, questioning whether the truth is worth the potential destruction of lives."



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

This story takes place in November 1948 during N/A.

Seasonal Atmosphere:
- Weather patterns: overcast skies with occasional rain, cool winds off the coast, damp air with a hint of salt
- Daylight: Shorter days with sunset around 4:30 PM, leaving an early darkness that brings a chill to the evening air.
- Seasonal activities: strolling along the beach wrapped in coats, gathering for card games in the hotel's lounge, attending local theater productions
- Seasonal occasions: Thanksgiving
- Season: N/A

Period Fashion (describe naturally):
- Men formal: double-breasted wool suits, tweed blazers, fedoras
- Men casual: corduroy trousers, button-up shirts with rolled sleeves, woolen sweaters
- Men accessories: leather gloves, silk ties, pocket squares
- Women formal: tea-length dresses with cinched waists, tailored suits with shoulder pads, pencil skirts
- Women casual: knitted sweaters, A-line skirts, wide-brimmed hats
- Women accessories: pearl necklaces, gloves, stylish handbags

Cultural Context (reference naturally):
- Music/entertainment: Frank Sinatra's ballads, the emergence of rhythm and blues, Bing Crosby's holiday classics; Films: The Treasure of the Sierra Madre, Key Largo; Theatre: Death of a Salesman, A Streetcar Named Desire; Radio: The Shadow, Suspense
- Typical prices: Loaf of bread: four pence, Movie ticket: one shilling, Taxi fare across town: two shillings
- Current events: the ongoing struggles in post-war Europe; the beginnings of the Berlin Airlift's aftereffects
- Literature: 1984 by George Orwell | The Naked and the Dead by Norman Mailer | The Catcher in the Rye by J.D. Salinger | [detective fiction] | [social realism] | [science fiction]
- Technology: the first commercial jet airliner, the de Havilland Comet | solid-state radios | early versions of television sets | radios in households | film cameras | television sets in urban homes
- Daily life: gathering for tea in the afternoons, reading newspapers with breakfast, participating in neighborhood watch groups
- Social rituals: Sunday family dinners, bridal showers and baby showers, holiday parties leading up to Christmas

Atmospheric Details:
The scent of damp earth and rain mingles with the salty air, creating a heavy atmosphere around the coastal hotel. The sound of distant waves crashing against the shore creates an unsettling background, as guests whisper and eye one another with suspicion. The flickering light of the hotel's old-fashioned lamps casts long shadows, enhancing the sense of mystery that permeates the dimly lit hallways.

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
  - The length of fabric used to create the killer's disguise.: "one yard"
  - The number of witnesses who saw the impersonation.: "three witnesses"
  - The number of makeup items found in the killer's possession.: "five items"
  - The specific time noted when the victim was last seen alive.: "ten minutes past ten"
    ⛔ FORBIDDEN alternatives: "10:10", "10.10", "ten ten", "ten-ten", "ten past ten", "quarter past ten", "half past ten" — the ONLY acceptable form is "ten minutes past ten"

If a value has no relevance to this chapter, omit it. But the moment you reference the underlying evidence, only the exact phrase above is acceptable.

⛔ CLUES TO SURFACE IN THESE CHAPTERS — mandatory:
The following evidence MUST be clearly observable to an attentive reader. Do not bury it in atmosphere or passing dialogue. Each clue must be concrete, specific, and noticeable:

• [clue_5] hotel, clock, tampered, showing, different, time
  Category: temporal | Criticality: essential | Supports inference step 3
  Points to: implies, deliberate, effort, create, alibi

• [clue_6] indicates, killer, manipulated, timeline, create, alibi
  Category: temporal | Criticality: essential | Supports inference step 3
  Points to: highlights, killer, intent, obscure, actions

For each clue above: an attentive reader should be able to find, record, and later use it to reason toward the solution.

═══ NARRATIVE STATE (read-only — do not contradict) ═══

LOCKED FACTS — use verbatim whenever this evidence is described:
  • The length of fabric used to create the killer's disguise.: "one yard"
  • The number of witnesses who saw the impersonation.: "three witnesses"
  • The number of makeup items found in the killer's possession.: "five items"
  • The specific time noted when the victim was last seen alive.: "ten minutes past ten"

CHARACTER PRONOUNS — never deviate from these:
  • Eleanor Voss: she/her/her
  • Dr. Mallory Finch: she/her/her
  • Captain Ivor Hale: he/him/his
  • Beatrice Quill: she/her/her
  • Sylvia Trent: she/her/her
  • Hugo Vane: he/him/his

CLUES ALREADY REVEALED TO READER: clue_1, clue_mechanism_visibility_core, clue_mid_1, clue_2, clue_3, clue_4, clue_culprit_direct_beatrice_quill — do not reveal these as new information.

INVESTIGATION LOG — WHAT IS ESTABLISHED (do not re-establish, do not repeat):
• Evidence already established (reference only — do NOT restate or quote these; advance beyond them): suggests, potential, suspect, vicinity, victim | reveals, mechanism, behind, impersonation | implies, true, identity, seen, questionable | implies, true, identity, seen, questionable | suggests, connection, fabric, murder | reinforces, idea, impersonator, linked, murder | direct, shows, beatrice, quill, means, opportunity
• Suspects still unresolved: Captain Ivor Hale[HE], Sylvia Trent[SHE], Hugo Vane[HE]
⚠ The story must move FORWARD from this log. Any beat already listed above is forbidden from repeating.

⚠ THIS CHAPTER'S REQUIRED ADVANCE (first_turn): Examine physical evidence — find at least one new clue

CONTINUITY HANDOFF — previous chapter closing beat:
  • "As the afternoon faded into early dusk, the dining room remained tense, every whispered conversation a potential clue. Eleanor tucked the fabric into an envelope, her mind racing with possibilities. The clues were mounting, but the truth remained elusive. For..."
  • The next chapter must open as a continuation of this beat, not as a disconnected reset.

⛔ DEAD CHARACTER — CANNOT APPEAR AS ALIVE:
• Dr. Mallory Finch: murdered before Chapter 1. In ALL chapters from here on:
  - Refer to them ONLY in past tense, only as the victim of the crime
  - NEVER have them: enter a room, speak, respond, gesture, look, nod, or react
  - NEVER describe them as present at any scene, conversation, or confrontation
  - WRONG: "Dr. Mallory Finch crossed the room" / "Dr. Mallory Finch sat on the sofa" / "Dr. Mallory Finch nodded"
  - WRONG: "Dr. Mallory Finch gave testimony" / "Dr. Mallory Finch asked what had happened"
  - CORRECT: "Dr. Mallory Finch had often said..." / "Dr. Mallory Finch's effects were found" / "witnesses recalled Dr. Mallory Finch's habit of..."
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
Known location profile anchors: The Clifftop Haven, The Rooftop Terrace, The Drawing Room, The Kitchen, The Central Courtyard, the hotel library
LOCATION NAME CAPITALISATION (HARD REQUIREMENT — validated):
All named locations in your prose MUST use the EXACT capitalisation from the CML profiles.
Canonical forms: "The Clifftop Haven", "The Rooftop Terrace", "The Drawing Room", "The Kitchen", "The Central Courtyard", "the hotel library"
Writing a location in lowercase (e.g. "drawing room" instead of "Drawing Room") is a validated error. Every time you mention a named location, copy its capitalisation from the list above.
- Chapter 4: OPENING STYLE (HARD): Start the VERY FIRST SENTENCE with a noun-phrase atmosphere — e.g. "The smell of damp stone in the cellar…" / "A chill from the landing…" / "The sound of the clock in the hall…". Pattern: "The/A [noun] of/in/from [place]…". Anchor opening in "the hotel library". The opening style above governs only your FIRST SENTENCE; the grounding below may land anywhere in the first 2 paragraphs (it need not be sentence one, and never conflicts with the chosen opening style). HARD REQUIREMENT for the first 2 paragraphs: (a) include 2+ sensory words — choose from smell/scent/odor/fragrance/sound/echo/silence/whisper/creak/cold/warm/damp/rough/smooth/glow/shadow/flicker/dim — and (b) include 1+ atmosphere/time word — choose from rain/wind/fog/storm/mist/thunder/evening/morning/night/dawn/dusk/lighting/weather/season/afternoon/midday/noon/midnight/twilight/sunrise/sunset/daylight/sunlight/overcast/cloudy/bright/dark/grey/pale/chill/crisp/drizzle/haze/lamplight/firelight. These are validated requirements, not style suggestions; missing them triggers a retry.

[⚠ INTERNAL QUALITY DIAGNOSTICS — DO NOT REPRODUCE ANY PART OF THIS SECTION IN YOUR STORY OUTPUT. These are private generator observations for your consideration only. Your narrative must read as if this section does not exist. Never include phrases from this block in character dialogue, narration, or description.]

PRIOR CHAPTER QUALITY OBSERVATIONS:
- Chapter 2 (score 96/100):
  Quality gaps noted: scene grounding weakness
  Address in upcoming chapters: Open next chapter with a named location anchor plus at least two sensory cues and one atmosphere marker.
- Chapter 3 (score 96/100):
  Quality gaps noted: scene grounding weakness
  Address in upcoming chapters: Open next chapter with a named location anchor plus at least two sensory cues and one atmosphere marker.
- Phrases to avoid (already overused in earlier chapters): "suit near dr mallory finch s room".
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

PROMPT BUDGET SUMMARY: budget=24000 tokens; fixed=13838; context=9998; dropped=[humour_guide, location_profiles, texture_pool, continuity_context]; truncated=[location_profiles, temporal_context, pronoun_accuracy]

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
4. Integrate at least two concrete era-grounded details per chapter from setting refinement signals: radio broadcasting | early television sets | radar technology | long-distance telephone calls | telegram services | military encryption methods.
5. Respect setting movement/access constraints in scene action and alibis: narrow hallways restrict movement | balcony access limited to certain rooms | stormy weather affecting outdoor access | staff-only areas including the kitchen and service elevators | guest room access controlled by key cards.
6. Sustain social coherence with this backdrop pressure: A group of guests at a coastal hotel, drawn together by a charity gala, must navigate the complexities of post-war social change and the tensions of the Cold War while a masquerade leads to deadly consequences.
7. Maintain continuity around these socially central cast anchors where relevant: Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill, Sylvia Trent, Hugo Vane.
8. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Critical: Plot similarity 0.80 with 'The Second Key' (same crime method of poisoning and similar era)
9. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Moderate: Character similarity 0.75 with 'The Second Key' (similar character roles and dynamics)
10. STORY TO DATE ANTI-COPY RULE: The STORY TO DATE section below is provided for chronological and factual reference ONLY. You MUST NOT copy, lightly rephrase, or structurally echo any sentence or paragraph from prior chapters. Every sentence in this chapter must be original prose unique to this scene. Reusing even a clause from prior chapter text will cause this attempt to fail immediately.

CRITICAL PROSE REQUIREMENTS:

The CML specifies exact requirements for certain validation-critical scenes. You MUST include these elements at the specified positions.

**Discriminating Test Scene (Act 3, Scene 4):**
Required elements: Execute the discriminating test, Observe the witnesses' reactions, Draw conclusion about guilt
Test type: witness reenactment

**Suspect Clearance Scenes:**
- Captain Ivor Hale (Act 3, Scene 5): Confirmed he was with another guest during the murder.
  Clues: clue_id_1, clue_id_2
- Sylvia Trent (Act 3, Scene 5): Confirmed she was in the staff area at the time.
  Clues: clue_id_1, clue_id_2
- Hugo Vane (Act 3, Scene 5): Alibi confirmed: wide

**Culprit Revelation Scene (Act 3, Scene 6):**
Method: Confrontation with evidence

**Clue Placement for These Chapters:**
- clue_5 must appear in Act 2, Scene 1 via Direct observation

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
Investigation state at start: 7 clue(s) revealed to reader; approximately 3 unresolved suspect(s).
Must change by end: Increase or complicate suspicion through a new pressure revelation — WITHOUT resolving the case: do NOT name, accuse, or extract a confession from the culprit, make an arrest, or declare the case closed (that is reserved for the final reveal).
Suspect pressure target(s): Hugo Vane, Sylvia Trent
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
  - Scene is set in: the hotel library — reference it naturally within the paragraph, never as your opening phrase.
  - Opening atmosphere (MANDATORY — validator enforced): the first paragraph MUST contain at least one of: rain / wind / fog / storm / mist / thunder / evening / morning / night / dawn / dusk / season / afternoon / midday / noon / midnight / twilight / sunrise / sunset / daylight / sunlight / overcast / cloudy / bright / dark / grey / pale / cold / warm / chill / crisp / damp / drizzle / haze / lamplight / firelight. A chapter that omits all of these from its opening paragraph will be rejected.
  - PARAGRAPH OPENER DIVERSITY (MANDATORY — validator enforced): No more than 2 paragraphs in this chapter may begin with "Eleanor" or "Eleanor's" as the first word. You must vary paragraph openings throughout: use sensory observations, another character's name or action, dialogue, object or sound details, or temporal markers. Opening 3 or more paragraphs with "Eleanor" will cause automated rejection.
  - ⛔ MECHANISM SPOILER BAN: Do NOT state how the crime device was manipulated — not the direction, not the magnitude, not who performed it. Characters may only observe that two sources of evidence disagree. The specific method, tamper amount, and perpetrator's action are ALL FORBIDDEN until the reveal. WRONG: "The culprit had altered the device by forty minutes to create a false alibi." RIGHT: "Two independent pieces of evidence gave contradictory readings — a discrepancy neither could yet explain."
  - Continuity bridge: in the first 120 words, visibly connect from the previous chapter's final beat. Carry forward one unresolved element (object, accusation, emotional pressure, or immediate physical action) from: "As the afternoon faded into early dusk, the dining room remained tense, every whispered conversation a potential clue. Eleanor tucked the fabric into an envelope, her mind racing with possibilities. The clues were mounti...".
  - CLUE OBLIGATIONS — each clue below MUST be dramatized, but in YOUR OWN WORDS:
    Render each as something a character SEES, DOES, or SAYS on the page. The bracketed text is a
    DESCRIPTION of the evidence for you — do NOT transcribe it as narration. Copying a clue's
    description sentence verbatim into the prose FAILS validation.
    • hotel, clock, indicating, incorrect, time [clue_5]
      Points to: implies, deliberate, effort, create, alibi
    • tampering, clock [clue_6]
      Points to: highlights, killer, intent, obscure, actions
  - Tonal contrast: include at least one beat of relief or ironic counterpoint. Do not sustain maximum tension for every paragraph.
  - CLUE DISCLOSURE RULE (Stage 2/4):
    Characters may establish access and opportunity but must NOT state the crime method or draw the final clue-to-culprit connection. Investigation without conclusion.
    WRONG: dialogue or narration that directly explains how the crime was committed before Stage 4.
    RIGHT: observation, physical reaction, and logical inference that leaves the mechanism just off-screen.
  - SUSPECT-PRESSURE MODE: do NOT resolve the case in this chapter. No confession, arrest, final accusation, definitive culprit declaration, or case-closed language. End with unresolved pressure: a contradiction, narrowed suspicion, motive pressure, or a new question.
  - ALIBI LOCK: Beatrice Quill's established alibi is "medium". Do NOT place Beatrice Quill at any other location or in any other activity during the crime window. Any contradiction is a continuity error that triggers a retry.
  - TESTIMONY CONTINUITY: Beatrice Quill has already made statements in earlier chapters. Any time, location, or claim attributed to Beatrice Quill in THIS chapter must be consistent with those earlier statements. Do NOT introduce a new or different alibi claim — any contradiction is a continuity error.

- Tonal contrast required: the previous chapter was high-tension. This chapter must include at least one beat of relief, pause, or quiet observation.
- Locked fact phrase obligations:
  - If this batch mentions The length of fabric used to create the killer's disguise., write exactly: "one yard".
  - If this batch mentions The number of witnesses who saw the impersonation., write exactly: "three witnesses".
  - If this batch mentions The number of makeup items found in the killer's possession., write exactly: "five items".
  - If this batch mentions The specific time noted when the victim was last seen alive., write exactly: "ten minutes past ten".
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
Batch chapters: 4-4.
Investigation state at start: 7 clue(s) revealed to reader; approximately 3 unresolved suspect(s).
Must change by end: Increase or complicate suspicion through a new pressure revelation — WITHOUT resolving the case: do NOT name, accuse, or extract a confession from the culprit, make an arrest, or declare the case closed (that is reserved for the final reveal).
Suspect pressure target(s): Hugo Vane, Sylvia Trent
Required new information: At least one fear/motive/lie/loyalty reveal with investigative consequence.
Forbidden reveals at this stage: No culprit resolution: no confession, no arrest, no 'case closed', no accusation ('I accuse'/'I name'), and never state 'the culprit/murderer/killer is/was …'. The accusation is reserved for the final reveal — build suspicion only.

FROZEN FACT STATE (DO NOT ALTER):
- Timeline anchor: November (autumn).
- Month, season, weather, and time-of-year language in this batch must stay compatible with autumn.
- Established timeline fact: The murder occurs at ten minutes past nine.
- If referenced, use exact phrase: "one yard" (The length of fabric used to create the killer's disguise.).
- If referenced, use exact phrase: "three witnesses" (The number of witnesses who saw the impersonation.).
- If referenced, use exact phrase: "five items" (The number of makeup items found in the killer's possession.).
- If referenced, use exact phrase: "ten minutes past ten" (The specific time noted when the victim was last seen alive.).

STORY TO DATE (REFERENCE ONLY — DO NOT COPY VERBATIM):
- Full prior chapter text is provided below for continuity, factual consistency, and reference accuracy.
- Use this to keep character voice, chronology, clue state, and location continuity aligned with earlier chapters.
- Do not quote, copy, or paraphrase these paragraphs too closely; write fresh prose that remains consistent with them.

--- BEGIN PRIOR CHAPTER 1 ---
Title: Chapter 1: The Poisoned Silence
Rain pattered against the high windows of the seaside hotel, the November morning casting a dim, watery glow across the corridor. Eleanor Voss pressed her palm to the cold brass handle, breath suspended, and pushed open the door to Dr. Mallory Finch’s private suite. The chill in the air mingled with a faint, acrid tang—something chemical, almost medicinal, lacing the usual salt and damp of Brighton’s coastline. There, sprawled on the patterned rug, lay Dr. Mallory Finch, her form unnaturally still, one hand outstretched toward a toppled glass. The pale light caught on the tailored suit she wore, the severe lines at odds with the slackness of her limbs. Just beyond the body, a heavy chair lay overturned, as if someone had left in haste.

Eleanor’s eyes darted to the suit—a sharply tailored, dove-grey creation she did not recall seeing Dr. Mallory Finch wear before. The cut was unmistakably distinctive, the sort of garment that would be noticed in any gathering. There were three witnesses, Eleanor recalled, who had spoken last night of seeing someone in just such a suit near Dr. Mallory Finch’s room, shortly before the fateful hour. The detail prickled at Eleanor’s mind: why would Mallory change into a different suit so late, and why had the sighting seemed so significant to those who mentioned it? It was as if someone wanted to be seen—or to be mistaken for someone else.

Eleanor Voss laid the facts out plainly where the others could see them: Cunning impersonation using tailored outfit allows.

That detail shifted the reasoning. Eleanor Voss weighed Cunning impersonation using tailored outfit allows, and the trail bent toward Reveals mechanism behind impersonation.

She crouched beside the body, mind racing. The glass, still half-full, had left a dark ring on the carpet, its contents tinged with a bitter, unfamiliar scent that did not belong to any spirit the hotel bar served. Eleanor’s gaze lingered on the delicate line of Dr. Mallory Finch’s jaw, the subtle bruising at her throat. Her instincts as an innkeeper warred with her rising dread: here was more than an accident, and the evidence was quietly screaming. The tailored suit, the witnesses’ accounts, the oddity of the scene—it all hinted at a deliberate, calculated staging.

A flicker of movement at the doorway broke the spell. Captain Ivor Hale, still in his navy-blue overcoat, stood just inside, his posture rigid. The deep lines around his eyes spoke of sleeplessness and something sharper—anger, or perhaps regret. With a glance that swept the room, he fixed on Eleanor. "It’s as bad as we feared, isn’t it?" he said, voice pitched low for the hush of the corridor. He lingered near the threshold, hands unconsciously tightening around the brim of his hat. "I saw someone loitering near this room late last night," he added, looking past Eleanor to the body. "Not anyone I recognised. Tall, in a suit like that. Odd, at this hour." The words hung in the air, heavy with unsaid suspicion.

Beatrice Quill appeared behind him, breathless, clutching a notebook to her chest. Her lipstick was smudged, her eyes wide as she took in the grim tableau. "Oh—oh, I can’t believe it," she stammered, voice trembling between horror and something like awe. "Dr. Mallory Finch—she can’t—she wouldn’t—" Beatrice’s gaze landed on the tailored suit, then flicked to Eleanor, searching for some explanation. Her fingers tightened on her notebook, knuckles blanched. "I heard voices last night, but I thought it was just the wind. I’m just a humble writer, after all. Not much good at reading danger, am I?" Her words trailed off, uncertain, as she hovered at the edge of the room, reluctant to come closer.

The air thickened with the mingled scents of rain and fear as Eleanor rose, surveying the room with a practiced eye. The overturned chair suggested a struggle, but there was no sign of forced entry—only a subtle disarray, as though someone had been careful to disturb just enough. The radio on the side table crackled faintly, a distant broadcast muffled by static. On the writing desk, a stack of ration booklets and a single, elegant glove hinted at the routines of post-war life, now abruptly and violently interrupted.

Eleanor drew a slow breath, piecing together what she saw. The tailored suit, the witnesses’ reports, and the unfamiliarity of the outfit on Dr. Mallory Finch’s frame—it amounted to more than a coincidence. Had someone worn a suit like this to be seen, or to blend in? The fact that three witnesses independently described the same garment near this room before the murder unsettled her. It raised the possibility that the person in the suit was not Dr. Mallory Finch at all, but someone intent on impersonation. Still, the edges of the puzzle refused to align; the motive for such deception remained maddeningly unclear.

Captain Ivor Hale’s gaze lingered on the body, then flicked to Eleanor. "You’ll be taking charge, I suppose?" he asked, half-challenging, half-resigned. "We’ll need answers, and quickly. Too many eyes on this place, and not all of them friendly." His voice was strained, the cadence of command slipping beneath the weight of uncertainty. Eleanor nodded, feeling the burden settle on her shoulders. In this tense silence, she was not merely an innkeeper, but the investigator these guests would rely upon—whether they liked it or not.

Beatrice edged forward, her steps tentative. "Do you think it was—well, you know—poison? She never drank anything stronger than sherry, as far as I knew," she whispered, glancing at the glass. Her voice faltered, and she pressed her lips together, as if to keep further speculation at bay. The glass, with its bitter residue, seemed to answer her for Eleanor. Yet the question lingered: if poison, how, and by whom?

Outside, the wind rattled the windowpanes, sending a shiver through the room. The overcast morning pressed in, dimming the edges of the scene. Eleanor’s thoughts turned to the peculiarities of the evidence: the tailored suit, the three witnesses, the uncanny sense of a masquerade gone wrong. With every detail, the mystery deepened. She felt the eyes of Captain Ivor Hale and Beatrice Quill upon her, waiting for her to declare what would come next.

Eleanor Voss pressed on to the next concrete detail: Tailored suit indicates someone impersonating finch.

That detail shifted the reasoning. Eleanor Voss weighed Tailored suit indicates someone impersonating finch, and the trail bent toward Implies true identity seen questionable.

Eleanor stepped back, careful not to disturb the details that might later prove crucial. She studied the body one last time, noting the unnatural stillness, the faint stain of poison at the lips, the cruel finality of the glass on the floor. There was no question now—Dr. Mallory Finch had been murdered. The scene bristled with secrets, and the silence was thick with accusation. In that moment, Eleanor understood: the answers would not come easily, and everyone in the seaside hotel would be drawn into the shadows left by this death.
--- END PRIOR CHAPTER 1 ---

--- BEGIN PRIOR CHAPTER 2 ---
Title: Chapter 2: The Contradictory Hour
"You saw the suit too, didn’t you?" Eleanor asked, her voice low but clear, as she stepped from the dim corridor into the hotel lobby. The faint echo of rain against the glass doors mingled with the muted clatter of a tea trolley somewhere behind her. The lobby’s lamps cast a flickering glow on the marble floor, their light catching on the autumnal drizzle that streaked the windows. The morning’s chill still lingered in the air, and the scent of damp wool and old tobacco drifted from the cluster of guests gathered near the fireplace. Eleanor’s gaze landed on a sharply tailored, dove-grey suit jacket folded over the back of a nearby armchair—its cut identical to the one Dr. Mallory Finch wore in death. On the carpet below, half-hidden by the chair’s leg, a small scrap of fabric—fine, silvery, and unmistakably from the same material—caught the lamplight.

Eleanor crouched, careful not to disturb the scene, and plucked up the fabric between gloved fingers. It was soft and smooth, the weave expensive, and she measured its length with a practiced eye—nearly "one yard," she thought, recalling the official inventory. The sight of the suit and the fabric together sent a ripple of unease through her. Someone had gone to great lengths to be seen in this particular outfit. The three witnesses who had spoken of a figure in a suit near Dr. Mallory Finch’s room before the murder could not all have been mistaken. But if the suit was here, and Dr. Mallory Finch lay dead upstairs, who had truly been seen that night? The implication was unsettling: someone had impersonated Dr. Mallory Finch, and the evidence of their disguise was now scattered at her feet.

The fabric, so carelessly left, suggested a hurried change or a struggle—perhaps both. Eleanor’s mind raced through the possibilities: the killer had worn the suit to be noticed, to create an alibi or sow confusion, and then discarded part of their disguise in the chaos that followed. The presence of the fabric so close to the scene of death hinted at a connection between the killer’s costume and the murder itself. If she could trace who had access to the suit, or who might have had reason to impersonate Dr. Mallory Finch, the circle of suspicion would narrow. For now, the contradiction gnawed at her: the person seen was not necessarily the person who killed.

A sudden hush fell as Hugo Vane entered, his overcoat still beaded with rain. He cut a striking figure—broad-shouldered, with the air of a man who had spent too many nights in smoky newsrooms and too many mornings chasing deadlines. Hugo’s gaze swept the lobby, lingering a moment too long on the suit and the scrap of fabric in Eleanor’s hand. "Truth is a slippery fish," he said, voice dry as the old bar counter. "You think you’ve caught it, and then—well, the tide turns. Are we to believe the killer left a calling card, or just a bit of bad tailoring?" He offered a thin, sardonic smile, but his eyes were sharp, missing nothing.

Eleanor straightened, tucking the fabric into a handkerchief. "We’ll need to account for everyone’s whereabouts last night. The witnesses saw someone in this suit, but the timing is murky at best." She gestured for Hugo to join her by the clock that hung above the reception desk—a stately brass timepiece, its hands frozen at a quarter past nine. "Did you notice anything odd about the time?" she asked, nodding toward it.

Hugo shrugged, glancing from the clock to his own battered wristwatch. "Depends which clock you trust. That one’s been slow since the war, or so I’ve heard. But I did see Beatrice lingering near the stairs just before the commotion—she looked as if she’d seen a ghost." His words were casual, but Eleanor caught the flicker of calculation behind them. Hugo’s reputation as a journalist preceded him; he was not above using innuendo to unsettle or provoke.

Beatrice Quill, standing by the lobby’s battered velvet settee, flinched at the mention of her name. She clutched her notebook to her chest, fingers worrying the edge of the cover. "I—I was only fetching a cup of tea," she stammered, her voice wavering. "It was so noisy upstairs, and I thought a walk might clear my head. I didn’t see anything—well, nothing unusual, except for someone in that suit. I thought it was Dr. Mallory Finch, but now—" She trailed off, eyes wide and uncertain. "I’m just a humble writer, after all. Not much good at sorting out what’s important."

Eleanor studied Beatrice, noting the tension in her shoulders and the way her gaze darted from the suit to the clock and back again. There was fear there—fear of being implicated, or perhaps fear of what she might have truly seen. "You said you saw Dr. Mallory Finch at what time?" Eleanor pressed, keeping her tone gentle. Beatrice hesitated, glancing at the clock above the desk. "It must have been just after ten. Or was it earlier? The clocks—well, they never quite agree, do they?"

The contradiction was glaring. The clock above the reception desk showed a time at odds with the one on Dr. Mallory Finch’s own watch, which Eleanor had noted earlier: "ten minutes past ten." Yet here, in the lobby, the hands stood stubbornly at a quarter past nine. The confusion about the timeline was no accident, Eleanor suspected. Someone had manipulated the perception of time, or perhaps the clocks themselves, to muddy the truth.

Hugo Vane watched Eleanor closely, his expression unreadable. "You’ll want to be careful, Miss Voss," he said, voice pitched low. "People remember what’s convenient, especially when their own necks are on the line. And clocks—well, they’re only as honest as the hands that set them." He adjusted his tie, a gesture that seemed more about buying time than smoothing his appearance. "If you’re looking for a clean story, you won’t find it here. Everyone’s got something to lose."

A gust of wind rattled the lobby doors, and Eleanor felt the weight of every eye in the room settle on her. The tension was palpable, but beneath it ran a current of relief—however fleeting—that someone was taking charge. She glanced at Beatrice, who now seemed smaller, almost swallowed by the overstuffed settee. Beatrice’s attempt at a smile faltered, and she looked away, her fingers trembling as she scribbled something in her notebook.

Eleanor turned her attention back to the suit and the fabric, her mind working through the implications. The evidence pointed to a deliberate act of impersonation, but the motive remained elusive. The contradictory clocks complicated matters further, casting doubt on every alibi and every recollection. She would need to press harder, to sift through the lies and half-truths that clung to the guests like the persistent Brighton fog.

For a moment, the lobby seemed to hold its breath. The fire crackled in the grate, and the old radio behind the desk hummed with a faint, tinny broadcast—news of rationing, of shortages, of a world still struggling to right itself after the war. The guests huddled closer, their voices dropping to nervous whispers. Outside, the rain eased, leaving the glass streaked and the air heavy with the scent of autumn. Eleanor felt the burden of the investigation settle more firmly on her shoulders. The clues were there, scattered and contradictory, but the truth remained just out of reach.

She caught Hugo’s eye, searching for any sign of guilt or relief. He met her gaze with a steady calm, but his hands betrayed a restless energy—fingers drumming on the back of a chair, eyes flicking to the door as if measuring the distance to escape. "We’re all suspects now, aren’t we?" he said, the faintest edge of irony in his voice. "I suppose that’s the price of staying in interesting company."

Eleanor offered a thin smile, her dry wit surfacing despite the gravity of the moment. "Well, isn’t that just the way of things? You think you know someone, and then the clocks start lying to you." The words drew a nervous laugh from Beatrice and a wry nod from Hugo. The tension in the room eased, if only for a heartbeat, before the weight of uncertainty pressed in once more.

As the guests drifted away in twos and threes, Eleanor lingered by the suit, the fabric, and the stubbornly contradictory clocks. She knew the next steps would demand more than careful observation—they would require a willingness to confront the facades each guest wore, and to risk the consequences of what she might uncover. For now, the hour remained uncertain, and the shadows in the lobby lengthened as the day wore on.
--- END PRIOR CHAPTER 2 ---

--- BEGIN PRIOR CHAPTER 3 ---
Title: Chapter 3: Witness Statements
By early afternoon, the hotel dining room was cloaked in a pale, overcast light, the rain tapping a persistent rhythm against the tall windows. The air inside was thick with the mingled scents of stewed tea, damp wool, and the faint tang of tobacco clinging to the velvet banquettes. Eleanor Voss lingered near the sideboard, her gaze drawn to a patch of shadow beneath one of the linen-draped tables. It was here, as the guests’ murmurs ebbed and flowed like the tide, that she caught sight of a small, silvery scrap—fabric, fine as a whisper, half-tucked beneath a chair leg. She stooped, the cold from the flagstones seeping through her stockings, and retrieved it between careful fingers. The weave was unmistakable, matching the tailored suit she had seen upstairs, and the length—nearly one yard—echoed the official inventory she had committed to memory.

Eleanor turned the fabric over in her hands, noting the precise stitching and the faint trace of powder along one edge. This was no ordinary remnant; it bore the hallmarks of a costume, perhaps hastily altered or torn in a moment of panic. The presence of this fabric so close to the scene of Dr. Mallory Finch’s death suggested more than careless housekeeping—it implied a hurried change, or perhaps a struggle. If the killer had worn this to be seen, to create confusion or an alibi, then the circle of suspicion had just grown tighter. And if the material matched Beatrice Quill’s costume, as Eleanor suspected, then Beatrice’s proximity to the victim at the crucial hour was no longer a matter of speculation but of evidence.

The dining room itself was a study in post-war contradiction: the gleam of brass sconces and the soft flicker of lamplight could not dispel the chill that clung to the edges of the room. A radio played quietly in the background, its signal wavering between the strains of a Sinatra ballad and the static-laden voice of a newsreader announcing further rationing. Captain Ivor Hale stood by the window, tapping the glass with the edge of his cigarette case, his eyes fixed on the rain-streaked promenade below. He wore his navy-blue suit with the sort of care that suggested old habits died hard, though the sharp lines of his jaw betrayed fatigue. Beatrice Quill hovered near the coffee urn, her notebook clutched to her chest, lips pressed together in a line of worry.

Eleanor Voss laid the facts out plainly where the others could see them: Fabric matches costume used impersonation; Cunning impersonation using tailored outfit allows.

Those details shifted the reasoning. Eleanor Voss weighed Fabric matches costume used impersonation, and the trail bent toward Reinforces idea impersonator linked murder. Eleanor Voss weighed Cunning impersonation using tailored outfit allows, and the trail bent toward Reveals mechanism behind impersonation.

Eleanor approached Beatrice, the scrap of fabric concealed in her palm. "Miss Quill, may I have a word?" she asked, pitching her voice just above the low hum of conversation. Beatrice started, nearly spilling her tea, and nodded. "Of course—though I’m not sure I’ll be much help," she said, her tone wavering between eagerness and dread. "I was just getting some air, or at least trying to. The dining room’s not exactly the Riviera, is it?" She managed a weak laugh, but her eyes darted to the windows, as if searching for escape.

Eleanor led Beatrice to a quieter corner, away from the curious stares of the other guests. "You mentioned earlier that you saw Dr. Mallory Finch last night. Can you recall where, and at what time?" Beatrice hesitated, fingers worrying the edge of her notebook. "I thought I saw her near the staircase, just before ten. Or maybe it was someone else in that suit—everyone seemed to be in costume last night, didn’t they? I’m just a humble writer, after all. My memory’s more suited to fiction than fact." Her attempt at self-deprecation fell flat, and Eleanor caught the tremor in her voice.

Captain Ivor Hale joined them, the scent of tobacco trailing in his wake. "Forgive the intrusion, but if we’re giving statements, I’d like to set the record straight," he said, his tone brisk. "I saw someone in a tailored suit near Dr. Mallory Finch’s room at ten minutes past ten. Could have sworn it was her, but now I’m not so sure. The lighting was poor, and—well, these old eyes have seen too many tricks in their time." He offered a sardonic smile, but there was no warmth in it. "Let’s not get into the past. It’s water under the bridge, isn’t it?"

Eleanor weighed their words, the fabric in her hand growing heavier with implication. The tailored suit, the witness accounts, and the presence of this scrap all pointed to a deliberate act of impersonation. It was as if someone had wanted to be seen, to leave a trail that would muddy the truth. The fact that three witnesses described the same suit near the victim’s room before the murder was no coincidence. If Beatrice’s costume was missing a piece—if this fabric matched—then her claim of innocence was already fraying at the edges.

She turned to Beatrice, her tone gentle but insistent. "Miss Quill, would you mind showing me your costume from last night?" Beatrice’s eyes widened, and for a moment she seemed on the verge of protest. "It’s just in my room—I can fetch it, if you like. Though I doubt it’ll be much use. I tore the hem coming up the stairs, and Sylvia said I should have left the sewing to the professionals." Her laugh was brittle, and Eleanor wondered if it masked fear or guilt.

As Beatrice hurried off, Captain Ivor Hale leaned in, lowering his voice. "You think she’s hiding something? Or just scared? Everyone’s on edge, Miss Voss. I’ve seen it before—fear makes liars of us all." He tapped his cigarette case against the table, the metallic click punctuating his words. "Still, I can’t help but wonder—if someone went to all this trouble to be seen, what were they trying to hide?"

The dining room seemed to shrink as the afternoon wore on, the rain intensifying against the windows and the lamplight casting long shadows across the parquet floor. Eleanor watched as Beatrice returned, clutching her costume—a dove-grey suit jacket with a jagged tear at the hem. The missing piece was evident, and when Eleanor held the scrap of fabric against it, the match was undeniable. The room fell silent as the evidence was laid bare.

Beatrice’s voice broke the hush, thin and wavering. "I—I must have lost it when I tripped on the stairs. I didn’t even notice until this morning. I swear, I never went near Dr. Mallory Finch’s room after ten." Her hands shook as she smoothed the jacket, her gaze fixed on the floor. "I was in the lobby, writing. Ask Hugo—he saw me there. Or at least I think he did."

Eleanor studied her, searching for any sign of deception. The fabric, the witness statements, the tailored suit—all of it pointed to Beatrice’s proximity to the victim before the murder. But was it enough to condemn her, or merely the product of unfortunate circumstance? The contradiction gnawed at Eleanor, and she felt the weight of the investigation settle more firmly on her shoulders.

Captain Ivor Hale broke the tension with a wry observation. "If I didn’t know better, I’d say we’re all trapped in one of Miss Quill’s novels—everyone with a motive, everyone with a secret. Only difference is, the ending’s not written yet." His words drew a nervous ripple of laughter from the guests, but the relief was fleeting.

Eleanor turned to the assembled guests, her voice steady. "We’ll need to account for everyone’s whereabouts at ten minutes past ten. The evidence suggests someone was impersonating Dr. Mallory Finch, and the timeline is far from clear. Until we know who wore the suit, and why, no one is above suspicion." Her words hung in the air, heavy with implication.

As the afternoon faded into early dusk, the dining room remained tense, every whispered conversation a potential clue. Eleanor tucked the fabric into an envelope, her mind racing with possibilities. The clues were mounting, but the truth remained elusive. For now, all she could do was press on, hoping that the next revelation would bring her closer to the heart of the mystery.
--- END PRIOR CHAPTER 3 ---

[SCENE COMPLETENESS CONTRACTS — MANDATORY. Each contract below lists what you MUST enact in that chapter. Do not summarise or mention these labels in the prose — enact them organically.]
Chapter 4 (Act 2) completeness contract:
  PIVOT ELEMENT (MANDATORY — write this into the prose, shown not told): "A hidden letter found in the library indicating Sylvia's ambitions."
  FACT ESTABLISHED (MANDATORY — reader must know this by chapter end): "Establishes that both Hugo and Sylvia had motives to harm the victim, complicating the investigation."
  RED HERRING (MANDATORY — seed naturally, not flagged as false): [rh_2] Hugo mentions seeing a different man in a suit near the beach — seeds false inference about another potential suspect.

# Case Overview
Title: Shadows of Authority
Era: 1940s
Setting: seaside hotel
Crime: murder (poisoning)
Culprit: Beatrice Quill
Victim: Dr. Mallory Finch
False assumption: The killer was not present at the time of the murder due to their established alibi.
Cast: Eleanor Voss (she/her), Dr. Mallory Finch (she/her), Captain Ivor Hale (he/him), Beatrice Quill (she/her), Sylvia Trent (she/her), Hugo Vane (he/him)

Setting Lock: Keep all scenes and descriptions consistent with the stated setting (seaside hotel). Do not introduce a different location type. Do not invent an alternative estate name. The only permitted name for this property is "seaside hotel" — any other estate name (e.g., "Caldwell Manor", "Ashwood Hall", or any invented proper name) is a continuity error that will be caught and rejected.

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
    "title": "Motive Exploration",
    "setting": {
      "location": "the hotel library",
      "timeOfDay": "Late afternoon",
      "atmosphere": "Quiet yet charged with underlying tension"
    },
    "characters": [
      "Eleanor Voss",
      "Hugo Vane",
      "Sylvia Trent"
    ],
    "purpose": "Explore motives and deepen the narrative",
    "cluesRevealed": [
      "clue_5",
      "clue_6"
    ],
    "dramaticElements": {
      "conflict": "Motives clash as suspects reveal their ambitions.",
      "tension": "Eleanor senses the weight of hidden agendas.",
      "microMomentBeats": [
        "Sylvia's eyes dart nervously as she speaks of her ambitions."
      ]
    },
    "summary": "Eleanor interviews Hugo and Sylvia in the library, uncovering their motives. Hugo reveals he had a strained relationship with the victim, while Sylvia admits to wanting to rise in social circles. Eleanor notices the tension between them, sensing deeper secrets.",
    "beat": "motives",
    "estimatedWordCount": 1500,
    "pivotElement": "A hidden letter found in the library indicating Sylvia's ambitions.",
    "factEstablished": "Establishes that both Hugo and Sylvia had motives to harm the victim, complicating the investigation.",
    "permittedBehavioursByAct": [
      {
        "characterName": "Eleanor Voss",
        "behaviour": "May show unease, evasion, or mild defensiveness when questioned."
      },
      {
        "characterName": "Hugo Vane",
        "behaviour": "May show unease, evasion, or mild defensiveness when questioned."
      },
      {
        "characterName": "Sylvia Trent",
        "behaviour": "May show unease, evasion, or mild defensiveness when questioned."
      }
    ],
    "redHerringPlacement": {
      "redHerringId": "rh_2",
      "placementDetail": "Hugo mentions seeing a different man in a suit near the beach — seeds false inference about another potential suspect."
    },
    "emotionalRegister": "A realization about the killer's impersonation shifts Eleanor's focus, heightening the stakes.",
    "dominantCharacterNote": {
      "name": "Eleanor Voss",
      "voiceRegister": "Eleanor's voice is warm and inviting, often tinged with gentle sarcasm that showcases her dry wit."
    },
    "humourGuidance": {
      "permission": "conditional"
    },
    "eraTextureNote": "Rationing affects access to food and resources, limiting social activities.; Limited public transportation and fuel shortages hinder travel and communication.; The lingering presence of wartime security measures creates an atmosphere of vigilance and suspicion.; Cold weather and shorter days restrict outdoor activities, leading to gatherings in confined spaces.; The overcast skies and frequent rain impact the mood and social interactions of guests.",
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
- Template linter: opening paragraph lists multiple named rooms as a location inventory. Open with a character action, sensory detail, or specific moment — not a tour of the setting.

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

Attempt 2/3 — chapters 4 — 1 validation issue(s) to resolve:

═══ CHARACTER NAME ERRORS (1) ═══
• Template linter: opening paragraph lists multiple named rooms as a location inventory. Open with a character action, sensory detail, or specific moment — not a tour of the setting.

✓ SOLUTION: The ONLY characters who exist are: Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill, Sylvia Trent, Hugo Vane
❌ You used one or more names that are NOT in the cast list above. Find every invented name and either replace it with a real cast member or cut the passage entirely.
✓ Do NOT introduce any new named character. Walk-on figures must remain anonymous ("a constable", "the footman") — never Mr./Mrs./Inspector [surname].

✓ Never use rank compounds as names (e.g., "Detective Inspector"). If needed, use anonymous role phrases only: "the detective", "an inspector".

Return corrected JSON for chapters 4. Edit only the sections that failed — keep all content that passed validation, and return the complete updated chapter JSON.


RETRY CLASS: template
ATTEMPT: 1/3
OFFENDING TEXT: opening paragraph lists multiple named rooms as a location inventory. Open with a character action, sensory detail, or specific moment — not a tour of the setting.
MANDATORY FIXES:
- Resolve template issues before accepting this batch.
- Template linter: opening paragraph lists multiple named rooms as a location inventory. Open with a character action, sensory detail, or specific moment — not a tour of the setting.
```
