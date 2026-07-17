# Actual Prompt Record

- Run ID: `mystery-1784238677818`
- Project ID: ``
- Timestamp: `2026-07-16T21:59:03.220Z`
- Agent: `Agent9-ProseGenerator-Ch2`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4.1`
- Temperature: `0.42`
- Max Tokens: `4500`
- Attempt: `first`
- Prompt Hash: `b0959c50440fddba`

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
- MORAL COMPLEXITY REQUIREMENT: The mechanism of this crime carries a moral gray area: "The murderer acted out of a misguided sense of justice for a past wrong, making their crime more complex than mere malice." — the culprit reveal and denouement MUST acknowledge this ambiguity. Do not let the ending feel clean or simple. Give the reader at least one moment of uncomfortable sympathy or moral doubt.

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
   - Captain Ivor Hale: The Exiled Heir
   - Beatrice Quill: Ambitious Outcast
   - Sylvia Trent: Protector of the Past
   - Hugo Vane: Corrupt Benefactor
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
  Public identity anchor: Retired Naval Officer; suspect 
  Connection to victim: Professional colleagues with a shared history in medicine.; Mallory treated Ivor's ailments during his naval service, forming a bond..
  Investigation relevance: access plausibility: medium | alibi window: dinner time | opportunity channel: Dining Room.
  Suspicion/pressure cue seed: Reputation and freedom.
  Investigator read: include one immediate observational inference (gesture, gaze target, pause, object grip), but do not state guilt as fact.

- Sylvia Trent
  Public identity anchor: Hotel Manager; suspect 
  Connection to victim: Trusting colleagues in the medical field.; Both women share a professional respect for their work in the community..
  Investigation relevance: access plausibility: high | alibi window: dinner time | opportunity channel: Dining Room.
  Suspicion/pressure cue seed: Romantic interest.
  Investigator read: include one immediate observational inference (gesture, gaze target, pause, object grip), but do not state guilt as fact.

- Hugo Vane
  Public identity anchor: Local Politician; suspect 
  Connection to victim: Political allies with differing opinions.; Mallory supports some of Hugo's initiatives, but questions his ethics..
  Investigation relevance: access plausibility: medium | alibi window: dinner time | opportunity channel: Dining Room.
  Suspicion/pressure cue seed: Financial stability.
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

## Era: 1948-October
Living in October 1948, the world is still grappling with the aftermath of the war. The streets are filled with a mix of hope and despair, as communities are recovering but still haunted by memories of conflict. In England, the overcast skies and unpredictable rains mirror the uncertainty felt by the populace. They face economic challenges, with rationing just fading and rising prices causing anxiety. Socially, there is a shift with women stepping into roles traditionally held by men, yet old norms cling on, creating tension. The political climate is fraught, with discussions surrounding the Cold War and increasing unrest in Europe impacting daily life. Halloween festivities loom, but the laughter and joy are tinged with fear of the unknown.
Emotional register: A pervasive sense of anxiety and uncertainty characterizes the collective emotional state, as individuals navigate a fragile peace.
Physical constraints: Shorter daylight hours limiting activities | Overcast weather leading to indoor gatherings | Transportation shortages impacting mobility | Communication delays due to post-war infrastructure
Current tensions (weave into background texture): Rising crime rates in urban areas | Post-war recovery struggles in Europe | Debates over the establishment of NATO
Wartime context — Many individuals are grappling with the psychological scars of their wartime experiences, leading to a lingering sense of trauma.: The community feels a shared vulnerability, with returning veterans and their families experiencing housing shortages and a struggle to reintegrate. Absence effect: The absence of loved ones lost in the war weighs heavily on families, creating an atmosphere of mourning amidst attempts to rebuild.

## Season Lock (mandatory — derived from 1948-October)
Season: autumn. Allowed vocabulary: autumn, autumnal, fall
Forbidden seasonal words — never use in narration, dialogue, or metaphor: spring, summer, winter and their adjectival forms.
Every weather description, atmosphere, and time-of-year reference must be consistent with autumn.

## Story Theme
In a world where past traumas intersect with present ambitions, the quest for justice reveals the lengths individuals will go to protect their secrets, and reveals that evidence carries ethical weight, forcing characters to choose accountability over social performance when appearances and facts collide.

## Story Emotional Register
Dominant: Suspenseful and introspective, fraught with revelations and emotional turmoil.

Arc:
The story opens within the lavish confines of the Seaside Resort Hotel, where the atmosphere is charged with a sense of unease—a murder has just transpired, casting a pall over the glitzy façade. As Detective Eleanor Voss steps into this world, the tension thickens; she must navigate the complexities of those present, each harboring their own secrets. The initial investigation reveals early clues, but false leads emerge, creating emotional turmoil as Eleanor grapples with her own past traumas from the war and the moral weight of justice. A pivotal turn occurs when a witness revisits the timeline of events, suggesting the victim's collapse was not as spontaneous as previously thought.

This revelation shifts the direction of the investigation, leading to a deeper exploration of motives and connections among the suspects. A second turn comes with the discovery of a glass containing traces of poison, forcing Eleanor to confront the reality of delayed-action murder and the implications it holds for the case. As the pressure mounts, the climax sees a tense confrontation where truths are laid bare, revealing not only the murderer but also the emotional scars each character carries. In the resolution, the consequences of the investigation weigh heavily on Eleanor and the suspects alike, as they grapple with the costs of their choices—loss of reputation, the burden of guilt, and the quest for redemption in a world still recovering from the shadows of conflict.

## Emotional register at this point in the story
The atmosphere is heavy with foreboding, setting the stage for the unraveling mystery.

## Character Portraits (appearance & era)

### Eleanor Voss
Eleanor Voss embodies the post-war resilience of society, striving to clear her late husband’s tarnished name while grappling with her own guilt. Her charm masks the burden of navigating a world where women are slowly taking charge, challenging societal norms yet still bound by them.
Era intersection: Her personal quest for redemption reflects the broader struggle of women redefining their roles in a recovering society.

### Captain Ivor Hale
Captain Ivor Hale embodies the disillusionment of veterans, haunted by his past and the shadows of lost love. His struggle for legacy amidst the chaos of a post-war society reflects the wider trauma experienced by many returning soldiers seeking to reclaim their identities.
Era intersection: His bitterness and yearning for redemption encapsulate the emotional landscape of a society still healing from the scars of war.

### Beatrice Quill
Beatrice Quill's ambition and desire for status reflect the changing dynamics of post-war society, where social mobility is both a dream and a danger. Her willingness to compromise morals for advancement illustrates the pressures individuals face in a world where reputation is everything.
Era intersection: Her actions highlight the tension between ambition and ethics that many women confront as they navigate their new roles.

### Sylvia Trent
Sylvia Trent stands as a testament to the complexities of women's roles in the post-war era, balancing her responsibilities as a hotel manager with the weight of her past mistakes. Her stern demeanor is a façade for the guilt she carries, revealing the societal pressures that shape her actions.
Era intersection: Her internal struggles reflect the broader theme of women grappling with their identities in a society that is both progressing and regressing.

### Hugo Vane
Hugo Vane's charisma masks a corrupt ambition, embodying the political and social manipulations of the post-war climate. His fear of scandal reflects the precarious nature of public life, where every action can lead to ruin.
Era intersection: His character illustrates the fragility of trust and integrity in a time of shifting political landscapes and heightened scrutiny.

## Character Voices

### Eleanor Voss (she/her/her)
Eleanor's voice carries a melodic tone, often layered with insightful observations that reflect her charm.
[comfortable] Well, isn't this just the most delightful conundrum?
[evasive] Oh, I couldn't possibly say without more information, could I?
[stressed] I just need to understand the truth, that's all!
Humour: Her dry wit often lightens tense moments, adding a nuanced layer to her interactions.

### Captain Ivor Hale (he/him/his)
Ivor's deep voice carries a brooding quality, often weighted with unspoken memories.
[comfortable] Ah, the folly of youth, indeed.
[evasive] That’s a complicated matter I’d rather not discuss.
[stressed] You don’t understand the ghosts that haunt me!
Humour: His sardonic humor reveals his bitterness when he chooses to employ it.

### Beatrice Quill (she/her/her)
Beatrice's brisk and energetic speech reflects her ambition and sharp observations.
[comfortable] You know, life’s too short for half-measures.
[evasive] I’m not sure that’s something I can comment on.
[stressed] This isn’t how I imagined things would go at all!
Humour: Her blunt humor often disarms her audience, concealing her true intentions.

### Sylvia Trent (she/her/her)
Sylvia speaks in a direct, no-nonsense manner, often laced with dry humor.
[comfortable] It’s always the quiet ones, isn’t it?
[evasive] That’s not something I can discuss at the moment.
[stressed] I must maintain order, no matter the cost!
Humour: Her observational humor highlights her keen insights into the human condition.

### Hugo Vane (he/him/his)
Hugo's engaging tone is persuasive, often sprinkled with sharp, incisive humor.
[comfortable] Politics is a game of perception, after all.
[evasive] I’d prefer not to speculate on that matter.
[stressed] This situation could unravel everything I’ve worked for!
Humour: His polite savagery shines through in moments of tension.

## Location Registers (scene framing guides)

Grand Lobby: In the Grand Lobby, guests are enveloped in an atmosphere thick with whispers and secrets, where every glance feels loaded with unspoken tension. The opulence is overshadowed by a sense of foreboding, as if the walls themselves are privy to the dark truths of those who gather.. Camera angle: Entering this space feels like stepping into a stage where every character is both performer and audience, caught in a web of intrigue.. Era: The post-war context heightens the stakes for every interaction here.

Dining Area: The Dining Area buzzes with the sounds of clinking cutlery and muffled laughter, yet an undercurrent of apprehension lingers. Guests savor their meals, unaware that danger lies just beneath the surface, as the ocean crashes outside, echoing the turmoil within.. Camera angle: The lens captures a juxtaposition of indulgence and dread, as the sumptuous food contrasts sharply with the growing unease.. Era: The tension of recent crime spikes lends an air of caution to this otherwise festive space.

Ocean View Rooms: In the Ocean View Rooms, the crashing waves provide a soothing soundtrack that belies the chaos of the outside world. Here, guests find brief solace, but the looming shadows of their secrets cast a pall over any sense of tranquility.. Camera angle: The viewpoint invites reflection, capturing both the beauty of the view and the turmoil within each guest's heart.. Era: The isolation felt in these rooms is heightened by the remnants of war's impact on communication and connection.

Staff-Only Area: The Staff-Only Area feels stark and utilitarian, a world apart from the glamor enjoyed by the guests. Here, whispers of secrets and fears of exposure mingle with the scent of cleaning supplies, as staff navigate the tension of serving the very clients they might suspect.. Camera angle: The focus reveals the hidden dynamics of power and vulnerability, capturing the pressures faced by those who operate behind the scenes.. Era: The divide between staff and guests reflects the class distinctions sharpening in post-war society.

## Humour guidance for this story position (opening)
Permission: forbidden
Rationale: The atmosphere is too tense and foreboding for humor.

FAIR-PLAY AND INFERENCE CONTRACT:
- FAIR PLAY CLUE TIMING: Never combine clue discovery and detective deduction in the same chapter. If a clue is first revealed to the reader in chapter N, the detective may only analyze, deduce from, or act on that clue in chapter N+1 or later.
- FAIR PLAY INFORMATION PARITY: The reader must see all clues BEFORE the detective uses them in reasoning. If the detective performs a test or makes a deduction, every piece of evidence supporting that conclusion must have been shown to the reader in earlier chapters.
- FAIR PLAY REVELATION SPACING: In the discriminating test scene, the detective can ONLY use clues that were revealed to the reader at least 1 full chapter earlier. Never introduce new clues or withheld information during the test.
- FAIR PLAY CONFRONTATION: During the final confrontation/revelation, the detective cannot surprise the reader with facts. Every piece of evidence cited must have been visible to the reader in prior chapters.
- Never solve by withheld information. Keep reader-information parity with detective reasoning.
- False assumption in force: Dr. Mallory Finch died from a sudden illness caused by her pre-existing condition.
- Hidden truth to progressively expose (compose in your own words from these elements): true, cause, death, poisoning, beverage, served, dinner
- Inference path checkpoints to dramatize clearly — compose ENTIRELY in your own sentences from these key terms (reproducing any briefing phrase verbatim FAILS validation):
  - Step 1: obs: glass, dining, area, shows, residue, toxic, substance | corr: presence, poison, indicates, foul, play, victim, death | effect: narrows, suspects, access, dining, area
  - Step 2: obs: witnesses, recall, finch, complaints, stomach, issues, before, dinner | corr: complaints, consistent, delayed, effects, poisoning, natural, illness | effect: eliminates, idea, finch, death, existing, condition
  - Step 3: obs: timeline, events, shows, finch, collapsed, significantly, dinner | corr: timing, symptoms, aligns, poison, ingestion, sudden, illness | effect: narrows, opportunity, suspects, present, dinner
- Discriminating test method: trap
- Discriminating test elements to dramatize (compose ENTIRELY in your own sentences from these — do NOT reproduce any briefing phrase verbatim): reenacting, dinner, service, observing, reactions, glass, poison, residue, presented
- Test must rely on already-shown clue IDs: clue_culprit_direct_1, clue_1, clue_2, clue_culprit_direct_beatrice_quill
- Fair-play rationale: Step 1: The glass with poison residue (early) and witness account of the victim's drink (mid) reveal the method of murder. Step 2: The timeline of events (mid) eliminates the possibility of sudden illness. Step 3: Beatrice Quill's unique access to beverage preparation (discriminating test) identifies her as the culprit.

## Character Reference

### Eleanor Voss (she/her — NEVER he/him)
Eleanor speaks with a melodic cadence, often punctuating her sentences with insightful observations
She has a habit of raising her eyebrow when intrigued and tends to weave light-hearted jests into serious conversations.
Eleanor is haunted by the specter of her past, grappling with the guilt of having exploited her late husband's wealth for her own social ascent. This inner turmoil fuels her determination to uncover the truth.
Voice colour: Eleanor Voss uses dry wit humour — let it surface in their dialogue where natural, not in every line.

### Captain Ivor Hale (he/him — NEVER she/her)
Ivor speaks in a deep, resonant voice, often punctuated by long pauses as he carefully considers his words
His humor, when present, is laced with bitterness, revealing the scars of his past.
Ivor grapples with the duality of his feelings—his yearning for legacy clashing with the bitterness of betrayal. This internal struggle fuels his brooding persona and complicates his interactions.
Voice colour: Captain Ivor Hale uses sardonic humour — let it surface in their dialogue where natural, not in every line.

### Beatrice Quill (she/her — NEVER he/him)
Beatrice has a brisk, energetic manner of speaking, often punctuated by sharp observations and a tendency to cut to the chase
She employs a playful tone that disarms her audience, masking her true intentions.
Beatrice struggles with the tension between her ambition and the risks of her actions, aware that her desire for status may lead her to betray her own morals.
Voice colour: Beatrice Quill uses blunt humour — let it surface in their dialogue where natural, not in every line.

### Sylvia Trent (she/her — NEVER he/him)
Sylvia speaks in a direct, no-nonsense manner, often using precise language
Her observations are laced with a dry humor that reveals her keen insights into the human condition.
Sylvia is torn between her professional responsibility and the ghosts of her past, grappling with the fear that her history could resurface and destroy her career.
Voice colour: Sylvia Trent uses observational humour — let it surface in their dialogue where natural, not in every line.

### Hugo Vane (he/him — NEVER she/her)
Hugo speaks with an engaging and persuasive tone, often employing rhetorical flourishes
His humor is sharp and incisive, but he knows when to soften his words to maintain his charm.
Hugo grapples with the fear that his ambition will lead to his downfall, caught in a web of deceit that threatens to unravel his carefully cultivated image.
Voice colour: Hugo Vane uses polite savagery humour — let it surface in their dialogue where natural, not in every line.


## CHARACTER CONTRACTS (binding for this scene)
Each entry below constrains how this character must be written in this chapter.
These override generic style guidance when they conflict.

### Eleanor Voss[SHE]
Voice & mannerisms: Eleanor speaks with a melodic cadence, often punctuating her sentences with insightful observations. She has a habit of raising her eyebrow when intrigued and tends to weave light-hearted jests into serious conversations.
SIGNATURE TIC (use sparingly — this is Eleanor Voss's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "Well, isn't that just the most delightful conundrum?"
Sample voice fragments (match this register and rhythm):
  [comfortable] "Well, isn't this just the most delightful conundrum?"
  [evasive] "Oh, I couldn't possibly say without more information, could I?"
Humour: dry wit — deploy occasionally (level 0.5)
FORBIDDEN phrase (never write for Eleanor Voss): "a surge of determination washed over her"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Her curiosity is piqued by the inheritance disputes brewing within her late husband's family, a matter that she feels compelled to investigate." — do not surface in Act I.

### Captain Ivor Hale[HE]
Voice & mannerisms: Ivor speaks in a deep, resonant voice, often punctuated by long pauses as he carefully considers his words. His humor, when present, is laced with bitterness, revealing the scars of his past.
SIGNATURE TIC (use sparingly — this is Captain Ivor Hale's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "Ah, the folly of youth, indeed."
Sample voice fragments (match this register and rhythm):
  [comfortable] "Ah, the folly of youth, indeed."
  [evasive] "That’s a complicated matter I’d rather not discuss."
Humour: sardonic — deploy occasionally (level 0.4)
FORBIDDEN phrase (never write for Captain Ivor Hale): "palpable tension filled the room"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "He stands to inherit a family estate contingent upon the victim's demise, a prospect that both excites and terrifies him." — do not surface in Act I.

### Beatrice Quill[SHE]
Voice & mannerisms: Beatrice has a brisk, energetic manner of speaking, often punctuated by sharp observations and a tendency to cut to the chase. She employs a playful tone that disarms her audience, masking her true intentions.
SIGNATURE TIC (use sparingly — this is Beatrice Quill's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "You know, life’s too short for half-measures."
Sample voice fragments (match this register and rhythm):
  [comfortable] "You know, life’s too short for half-measures."
  [evasive] "I’m not sure that’s something I can comment on."
Humour: blunt — deploy occasionally (level 0.6)
FORBIDDEN phrase (never write for Beatrice Quill): "she chose her words with great care"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "If the victim were out of the picture, Beatrice could secure the status and financial security she craves." — do not surface in Act I.

### Sylvia Trent[SHE]
Voice & mannerisms: Sylvia speaks in a direct, no-nonsense manner, often using precise language. Her observations are laced with a dry humor that reveals her keen insights into the human condition.
SIGNATURE TIC (use sparingly — this is Sylvia Trent's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "It’s always the quiet ones, isn’t it?"
Sample voice fragments (match this register and rhythm):
  [comfortable] "It’s always the quiet ones, isn’t it?"
  [evasive] "That’s not something I can discuss at the moment."
Humour: observational — deploy occasionally (level 0.4)
FORBIDDEN phrase (never write for Sylvia Trent): "everyone could sense the atmosphere"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "The fear of losing her job if the victim's family pursues legal action post-murder looms large over her." — do not surface in Act I.

### Hugo Vane[HE]
Voice & mannerisms: Hugo speaks with an engaging and persuasive tone, often employing rhetorical flourishes. His humor is sharp and incisive, but he knows when to soften his words to maintain his charm.
SIGNATURE TIC (use sparingly — this is Hugo Vane's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "Politics is a game of perception, after all."
Sample voice fragments (match this register and rhythm):
  [comfortable] "Politics is a game of perception, after all."
  [evasive] "I’d prefer not to speculate on that matter."
Humour: polite savagery — deploy occasionally (level 0.5)
FORBIDDEN phrase (never write for Hugo Vane): "she felt a wave of unease"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "The potential loss of political capital and the risk of scandal loom large if the victim remains alive." — do not surface in Act I.



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

Primary Location: Seaside Resort Hotel (Margate, England)
A coastal resort hotel with art deco architecture, offering a blend of luxury and tension amid post-war unrest.

Key Locations Available:
- Grand Lobby (interior): Gathering space and reception area
- Dining Area (interior): Dining and social gatherings
- Ocean View Rooms (interior): Private accommodations for guests
- Staff-Only Area (interior): Restricted access for hotel staff

Atmosphere (tonal cue only — do NOT reproduce this phrase verbatim in prose; translate into scene-specific, character-observed sensory language): Tense and suspenseful, heightened by recent news of post-war unrest and local crime spikes.
Weather: Overcast with occasional rain, typical of coastal climates in the fall.

Era markers: manual typewriters in the reception area | early radio news broadcasts | art deco furnishings and decor | post-war automobiles parked outside

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
Grand Lobby (interior):
  - Visual: geometric patterns on walls, gleaming brass fixtures, vibrant floral arrangements
  - Sounds: murmured conversations, the crackle of a radio, footsteps on marble
  - Scents: freshly polished wood, the scent of dampness, candle wax and tallow
  - Touch: smooth marble underfoot, plush upholstery of armchairs

Dining Area (interior):
  - Visual: tables adorned with white linens, gleaming silverware, ocean waves crashing outside
  - Sounds: clinking of cutlery, distant laughter, the murmur of conversation
  - Scents: aroma of roasted meats, freshly baked bread, seafood and herbs
  - Touch: smooth table surfaces, cool glassware

Ocean View Rooms (interior):
  - Visual: soft pastel decor, large windows framing the sea, plush bedding
  - Sounds: waves crashing against the shore, the soft flutter of curtains, the distant sound of laughter from the terrace
  - Scents: fresh linen and lavender, the salty tang of the ocean, the faint scent of perfume
  - Touch: soft cotton sheets, smooth wooden furniture

⛔ REFERENCE DATA — DO NOT TRANSCRIBE VERBATIM: The above profiles are structural guides only. Generate original prose that evokes these qualities; do not reproduce the exact phrasing or sentence structure of the profile paragraphs.

SCENE OPENING RULE: When opening a scene in a new location, write what the POV character directly observes and physically senses at that moment — not a general description of the room's qualities. The reader must feel present, not briefed. Sensory details must be observed by the characte
[truncated for prompt budget]

## Texture Pool
Draw on these as opportunities arise — you are not required to use them.

- Living in October 1948, the world is still grappling with the aftermath of the war
- The streets are filled with a mix of hope and despair, as communities are recovering but still haunted by memories of conflict
- In England, the overcast skies and unpredictable rains mirror the uncertainty felt by the populace
- They face economic challenges, with rationing just fading and rising prices causing anxiety
- Socially, there is a shift with women stepping into roles traditionally held by men, yet old norms cling on, creating tension

TEMPORAL CONTEXT:

This story takes place in October 1948 during N/A.

Seasonal Atmosphere:
- Weather patterns: overcast skies with sporadic rain showers, chilly breezes coming off the coast, the scent of damp leaves and earth
- Daylight: Days are short, with sunlight fading around 5:30 PM, and darkness enveloping the hotel by 6 PM.
- Seasonal activities: local harvest festivals featuring seasonal foods like apples and pumpkins, the preparation for Halloween with decorations and themed parties, evening strolls along the beach, despite the cool air
- Seasonal occasions: Halloween
- Season: N/A

Period Fashion (describe naturally):
- Men formal: tailored wool suits in muted tones, crisp white dress shirts with narrow collars, dark leather shoes with polished finishes
- Men casual: tweed jackets paired with flannel trousers, fitted sweaters over collared shirts, corduroy pants for an informal touch
- Men accessories: silk ties in geometric patterns, newsboy caps for outdoor wear, leather gloves for colder evenings
- Women formal: tea-length dresses with cinched waists and full skirts, tailored wool coats with rounded lapels, stylish pumps with low heels
- Women casual: knit sweaters paired with A-line skirts, button-up blouses with cardigan layers, slacks with a high waistline for comfort
- Women accessories: fascinators or small hats adorned with veils, string pearls for evening wear, small leather handbags

Cultural Context (reference naturally):
- Music/entertainment: Nat King Cole's smooth jazz melodies, the emerging rock and roll sounds of Bill Haley, traditional big band music still holding sway; Films: The Treasure of the Sierra Madre, Key Largo; Theatre: A Streetcar Named Desire, The Glass Menagerie; Radio: The Shadow, Suspense
- Typical prices: Loaf of bread: four pence, Bottle of milk: three pence, Movie ticket: one shilling
- Current events: growing unrest in various European nations as post-war recovery struggles; increased crime rates in urban areas leading to public fear
- Literature: The Naked and the Dead by Norman Mailer | The Catcher in the Rye by J.D. Salinger | The Old Man and the Sea by Ernest Hemingway | [detective fiction] | [post-war literature reflecting trauma and recovery] | [romantic novels set against the backdrop of societal change]
- Technology: the first practical electronic computer, ENIAC | advancements in television technology with better picture quality | the introduction of the transistor, paving the way for future electronics | bicycle as a popular mode of transport | manual typewriters in homes and offices | early television sets with limited channels
- Daily life: attending community events and festivals, visiting local diners and cafes for social gatherings, spending evenings listening to the radio or watching television together
- Social rituals: Saturday night dances at local halls, family dinners on Sundays featuring roast meals

Atmospheric Details:
The pervasive scent of rain-soaked earth mingles with the salty air from the nearby coast, creating a damp chill that settles in the bones. The muted colors of the hotel lobby reflect the overcast skies outside, with flickering electric lights casting shadows in the corners. As the wind howls outside, the soft strains of jazz music can be heard emanating from the bar, drawing patrons seeking warmth and camaraderie.

FASHION IN
[truncated for prompt budget]

NON-NEGOTIABLE CHAPTER OBLIGATIONS — LOCKED EVIDENCE VALUES (VERBATIM REQUIRED):
The following measured values (times, amounts, measurements) are absolute ground truth. Every time this chapter describes, mentions, or alludes to one — no matter how briefly — it MUST use the exact phrase shown below, character for character. NO paraphrase, approximation, rounding, or synonym is permitted.

FAILURE EXAMPLE: if the locked value is "at thirteen minutes to midnight" and you write "just before midnight" or "around midnight" — that is a HARD FAIL. You must write "at thirteen minutes to midnight". Equally, if the locked value is written in words, such as "ten minutes past eleven", and you convert it to figure-based clock notation — that is also a HARD FAIL. Words stay as words; figure forms are forbidden for word-phrased facts.

CRITICAL — WORD-PHRASED VALUES: If the canonical value is written out in words (e.g. a time like "ten minutes past eleven", or an amount like "forty minutes"), reproduce those exact words. DO NOT convert to figure-based time notation, twenty-four-hour format, or any other numeric shorthand. Correct: "ten minutes past eleven". WRONG: figure-based clock notation or numeric shorthand.

Locked values:
  - The victim's death was confirmed to have occurred at this precise time.: "ten minutes past eight"
    ⛔ FORBIDDEN alternatives: "8:10", "8.10", "eight ten", "eight-ten", "eight past ten", "quarter past eight", "half past eight" — the ONLY acceptable form is "ten minutes past eight"
  - Dinner was served at this time, coinciding with the victim's meal.: "seven o'clock"
    ⛔ FORBIDDEN alternatives: "7:00", "7.00" — the ONLY acceptable form is "seven o'clock"
  - The amount of poison used in the dish was measured to this exact volume.: "two ounces"

If a value has no relevance to this chapter, omit it. But the moment you reference the underlying evidence, only the exact phrase above is acceptable.

⚠ CENTRAL CONTRADICTION (the heart of the mystery): the two locked values "ten minutes past eight" and "seven o'clock" are NOT two separate facts — they are ONE contradiction (one is a staged appearance, the other the true state; the evidence determines which). If this chapter references both, you MUST present them AS A SINGLE CONTRAST joined by a contrast connective (but / yet / however / could only / whereas) — e.g. "the watch showed the one time, yet the evidence proved it could only have been the other" — making clear which reading is the appearance and which is the truth. NEVER state them as two flat, side-by-side truths — that makes the central clue read as if it contradicts itself.

⛔ CLUES TO SURFACE IN THESE CHAPTERS — mandatory:
The following evidence MUST be clearly observable to an attentive reader. Do not bury it in atmosphere or passing dialogue. Each clue must be concrete, specific, and noticeable:

• [clue_mechanism_visibility_core] witnesses, recall, finch, complaints, stomach, issues, before, dinner
  Category: testimonial | Criticality: essential | Supports inference step 2
  Points to: finch, complaints, related, death

• [clue_core_contradiction_chain] presence, poison, indicates, foul, play, victim, death
  Category: testimonial | Criticality: essential | Supports inference step 1
  Points to: foul, play, suggested, poison

For each clue above: an attentive reader should be able to find, record, and later use it to reason toward the solution.

═══ NARRATIVE STATE (read-only — do not contradict) ═══

LOCKED FACTS — use verbatim whenever this evidence is described:
  • The victim's death was confirmed to have occurred at this precise time.: "ten minutes past eight"
  • Dinner was served at this time, coinciding with the victim's meal.: "seven o'clock"
  • The amount of poison used in the dish was measured to this exact volume.: "two ounces"

CHARACTER PRONOUNS — never deviate from these:
  • Eleanor Voss: she/her/her
  • Dr. Mallory Finch: she/her/her
  • Captain Ivor Hale: he/him/his
  • Beatrice Quill: she/her/her
  • Sylvia Trent: she/her/her
  • Hugo Vane: he/him/his

CLUES ALREADY REVEALED TO READER: clue_1 — do not reveal these as new information.

INVESTIGATION LOG — WHAT IS ESTABLISHED (do not re-establish, do not repeat):
• Evidence already established (reference only — do NOT restate or quote these; advance beyond them): glass, piece
• Suspects still unresolved: Captain Ivor Hale[HE], Sylvia Trent[SHE], Hugo Vane[HE]
⚠ The story must move FORWARD from this log. Any beat already listed above is forbidden from repeating.

⚠ THIS CHAPTER'S REQUIRED ADVANCE (opening): Discover the body, confirm the victim, establish the scene. The victim is found dead. They do not speak, react, or gesture. This is their only physical appearance — in all subsequent chapters they exist only in past tense (memory, evidence, testimony).

CONTINUITY HANDOFF — previous chapter closing beat:
  • "The room seemed to contract around them, the polished silverware and crisp linens suddenly irrelevant in the face of what had transpired. Eleanor looked once more at Dr. Mallory Finch, her features softened by the morning’s dim light, her hand still resting ne..."
  • The next chapter must open as a continuation of this beat, not as a disconnected reset.
═══════════════════════════════════════════════════════

═══════════════════════════════════════════════════════════
📚 CONTINUITY CONTEXT - CHARACTER & SETTING CONSISTENCY
═══════════════════════════════════════════════════════════

**CRITICAL: You are writing chapters 2+. Maintain consistency with earlier chapters.**

**Character Names Used in Chapters 1-1:**
Eleanor Voss, Dr. Mallory Finch, Beatrice Quill

✓ RULE: Use EXACTLY these names. Do NOT vary spelling, add titles, or introduce new forms.
✓ Example: if earlier chapters used "Clara Whitfield", keep using "Clara Whitfield" — never "Mrs. Whitfield" unless that is the character's canonical name in the list above.

**Recent Chapter Summary (for narrative continuity):**
Chapter 1: Chapter 1: The Glass with Shadows
  Events: Even as Eleanor’s gaze lingered on the glass, a low voice behind her whispered, 'She said her stomach was unsettled, just before dinner was served.

⚠️ **VALIDATION:** Character name mismatches and setting drift are common failure modes.
Double-check every character name against the list above before using it.

**⏱ LOCKED TIME ANCHOR — use verbatim, do not paraphrase:**
Clock time (from the case ground truth): **"Dinner service begins at six o'clock."**
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
Known location profile anchors: Seaside Resort Hotel, Grand Lobby, Dining Area, Ocean View Rooms, Staff-Only Area, the dining area of the seaside resort hotel
LOCATION NAME CAPITALISATION (HARD REQUIREMENT — validated):
All named locations in your prose MUST use the EXACT capitalisation from the CML profiles.
Canonical forms: "Seaside Resort Hotel", "Grand Lobby", "Dining Area", "Ocean View Rooms", "Staff-Only Area", "the dining area of the seaside resort hotel"
Writing a location in lowercase (e.g. "drawing room" instead of "Drawing Room") is a validated error. Every time you mention a named location, copy its capitalisation from the list above.
- Chapter 2: OPENING STYLE (HARD): Start the VERY FIRST SENTENCE with spoken dialogue — e.g. '"[words]," [Name] said/asked/replied/murmured.' The opening quote must be the first character on the line. Anchor opening in "the dining area of the seaside resort hotel". The opening style above governs only your FIRST SENTENCE; the grounding below may land anywhere in the first 2 paragraphs (it need not be sentence one, and never conflicts with the chosen opening style). HARD REQUIREMENT for the first 2 paragraphs: (a) include 2+ sensory words — choose from smell/scent/odor/fragrance/sound/echo/silence/whisper/creak/cold/warm/damp/rough/smooth/glow/shadow/flicker/dim — and (b) include 1+ atmosphere/time word — choose from rain/wind/fog/storm/mist/thunder/evening/morning/night/dawn/dusk/lighting/weather/season/afternoon/midday/noon/midnight/twilight/sunrise/sunset/daylight/sunlight/overcast/cloudy/bright/dark/grey/pale/chill/crisp/drizzle/haze/lamplight/firelight. These are validated requirements, not style suggestions; missing them triggers a retry.

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

PROMPT BUDGET SUMMARY: budget=24000 tokens; fixed=9785; context=13114; dropped=[none]; truncated=[location_profiles, temporal_context, pronoun_accuracy]

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
4. Integrate at least two concrete era-grounded details per chapter from setting refinement signals: radio broadcasting | early television sets | manual typewriters | electric lighting | party-line telephones | telegram services.
5. Respect setting movement/access constraints in scene action and alibis: narrow staircases limiting movement | restricted access to staff-only areas | oceanfront providing natural barriers | guest registration required for room access | staff-only areas monitored by hotel management.
6. Sustain social coherence with this backdrop pressure: A tense gathering of hotel guests and staff amid rising local crime and post-war anxieties creates a pressure cooker environment for secrets and betrayals to surface.
7. Maintain continuity around these socially central cast anchors where relevant: Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill, Sylvia Trent, Hugo Vane.
8. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Critical: Plot similarity 0.85 with 'The Mysterious Affair at Styles' (same crime method of delayed-action poisoning).
9. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Critical: Solution similarity 0.90 with 'The Mysterious Affair at Styles' (same solution method and false assumption pattern).
10. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Moderate: Character similarity 0.70 with 'The Second Key' (similar cast structure and character roles).
11. STORY TO DATE ANTI-COPY RULE: The STORY TO DATE section below is provided for chronological and factual reference ONLY. You MUST NOT copy, lightly rephrase, or structurally echo any sentence or paragraph from prior chapters. Every sentence in this chapter must be original prose unique to this scene. Reusing even a clause from prior chapter text will cause this attempt to fail immediately.

CRITICAL PROSE REQUIREMENTS:

The CML specifies exact requirements for certain validation-critical scenes. You MUST include these elements at the specified positions.

**Discriminating Test Scene (Act 3, Scene 4):**
Required elements: Execute the discriminating test, Observe the culprit's reaction or result, Draw conclusion about guilt

**Suspect Clearance Scenes:**
- Captain Ivor Hale (Act 3, Scene 5): Captain Hale's alibi during the time of death.
  Clues: clue_id_1, clue_id_2
- Sylvia Trent (Act 3, Scene 5): Sylvia's presence confirmed by other staff members.
  Clues: clue_id_1, clue_id_2
- Hugo Vane (Act 3, Scene 5): Hugo's business meeting across town at the time.
  Clues: clue_id_1, clue_id_2

**Culprit Revelation Scene (Act 3, Scene 6):**
Method: Confrontation with evidence

**Clue Placement for These Chapters:**
- clue_core_contradiction_chain must appear in Act 1, Scene 2 via Cross-check contradiction

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
Batch chapters: 2-2.
Investigation state at start: 1 clue(s) revealed to reader; approximately 3 unresolved suspect(s).
Must change by end: Increase or complicate suspicion through a new pressure revelation — WITHOUT resolving the case: do NOT name, accuse, or extract a confession from the culprit, make an arrest, or declare the case closed (that is reserved for the final reveal).
Suspect pressure target(s): Beatrice Quill, Captain Ivor Hale, Sylvia Trent, Hugo Vane
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
- Chapter 2:
  - STRUCTURAL ARCHETYPE — Chapter 2 must be: FIRST_CONTACT
      ✓ MUST contain: at least two suspect interviews
      ✗ MUST NOT contain: physical evidence discovery
  - Word count: Target 1250 words. Achieve this through plot events, dialogue exchanges, and physical investigation — not through atmospheric repetition or extended internal reflection. Each 200-word segment should contain at minimum one concrete story event (a discovery, a conversation exchange, a physical action or movement). Padding with atmosphere alone is not acceptable.
  - Opening: Begin with a character action, spoken line, or clock/time marker — never a location name or location-description phrase.
  - Scene is set in: the dining area of the seaside resort hotel — reference it naturally within the paragraph, never as your opening phrase.
  - Opening atmosphere (MANDATORY — validator enforced): the first paragraph MUST contain at least one of: rain / wind / fog / storm / mist / thunder / evening / morning / night / dawn / dusk / season / afternoon / midday / noon / midnight / twilight / sunrise / sunset / daylight / sunlight / overcast / cloudy / bright / dark / grey / pale / cold / warm / chill / crisp / damp / drizzle / haze / lamplight / firelight. A chapter that omits all of these from its opening paragraph will be rejected.
  - PARAGRAPH OPENER DIVERSITY (MANDATORY — validator enforced): No more than 2 paragraphs in this chapter may begin with "Eleanor" or "Eleanor's" as the first word. You must vary paragraph openings throughout: use sensory observations, another character's name or action, dialogue, object or sound details, or temporal markers. Opening 3 or more paragraphs with "Eleanor" will cause automated rejection.
  - ⛔ MECHANISM SPOILER BAN: Do NOT state how the crime device was manipulated — not the direction, not the magnitude, not who performed it. Characters may only observe that two sources of evidence disagree. The specific method, tamper amount, and perpetrator's action are ALL FORBIDDEN until the reveal. WRONG: "The culprit had altered the device by forty minutes to create a false alibi." RIGHT: "Two independent pieces of evidence gave contradictory readings — a discrepancy neither could yet explain."
  - Continuity bridge: in the first 120 words, visibly connect from the previous chapter's final beat. Carry forward one unresolved element (object, accusation, emotional pressure, or immediate physical action) from: "The room seemed to contract around them, the polished silverware and crisp linens suddenly irrelevant in the face of what had transpired. Eleanor looked once more at Dr. Mallory Finch, her features softened by the mornin...".
  - CLUE OBLIGATIONS — each clue below MUST be dramatized, but in YOUR OWN WORDS:
    Render each as something a character SEES, DOES, or SAYS on the page. The bracketed text is a
    DESCRIPTION of the evidence for you — do NOT transcribe it as narration. Copying a clue's
    description sentence verbatim into the prose FAILS validation.
    • discovery, poison, victim, system [clue_core_contradiction_chain] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: foul, play, suggested, poison
      ↳ MANDATORY TWO-PARAGRAPH STRUCTURE (must appear in paragraphs 1 or 2 — no later):
         Paragraph 1: The POV character physically approaches or directly observes this evidence.
           The narration or dialogue explicitly states what is seen (use the exact locked phrase if one applies).
         Paragraph 2 (immediately following): The detective or POV character explicitly reasons
           about what this evidence implies — who it implicates, why it may be unreliable,
           or what inference it supports. This must be a separate full paragraph, not a sentence appended to Paragraph 1.
    • witnesses, discussing, finch, complaints [clue_mechanism_visibility_core] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      ⛔ SPOILER EMBARGO (pre-reveal chapter): surface ONLY the surface anomaly a character can see/hear/find.
         Do NOT name who it implicates, state the tamper direction or magnitude, or explain the mechanism in this chapter.
         Present it as an unexplained discrepancy; the culprit and method are revealed later.
         Place this OBSERVATION in paragraph 1 or 2 (observation only — no inference about the culprit).
  - Tonal contrast: include at least one beat of relief or ironic counterpoint. Do not sustain maximum tension for every paragraph.
  - CLUE DISCLOSURE RULE (Stage 2/4):
    Characters may establish access and opportunity but must NOT state the crime method or draw the final clue-to-culprit connection. Investigation without conclusion.
    WRONG: dialogue or narration that directly explains how the crime was committed before Stage 4.
    RIGHT: observation, physical reaction, and logical inference that leaves the mechanism just off-screen.
  - SUSPECT-PRESSURE MODE: do NOT resolve the case in this chapter. No confession, arrest, final accusation, definitive culprit declaration, or case-closed language. End with unresolved pressure: a contradiction, narrowed suspicion, motive pressure, or a new question.
  - ALIBI LOCK: Beatrice Quill's established alibi is "dinner time". Do NOT place Beatrice Quill at any other location or in any other activity during the crime window. Any contradiction is a continuity error that triggers a retry.
  - TESTIMONY CONTINUITY: Beatrice Quill has already made statements in earlier chapters. Any time, location, or claim attributed to Beatrice Quill in THIS chapter must be consistent with those earlier statements. Do NOT introduce a new or different alibi claim — any contradiction is a continuity error.
  - Sensory obligation — use at least two of: dim light creating a somber atmosphere, empty tables waiting for guests | the sound of waves crashing, the shuffling of staff preparing for dinner | the aroma of simmering sauces. Mood: tense anticipation.
- Locked fact phrase obligations:
  - If this batch mentions The victim's death was confirmed to have occurred at this precise time., write exactly: "ten minutes past eight".
  - If this batch mentions Dinner was served at this time, coinciding with the victim's meal., write exactly: "seven o'clock".
  - If this batch mentions The amount of poison used in the dish was measured to this exact volume., write exactly: "two ounces".
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
Investigation state at start: 1 clue(s) revealed to reader; approximately 3 unresolved suspect(s).
Must change by end: Increase or complicate suspicion through a new pressure revelation — WITHOUT resolving the case: do NOT name, accuse, or extract a confession from the culprit, make an arrest, or declare the case closed (that is reserved for the final reveal).
Suspect pressure target(s): Beatrice Quill, Captain Ivor Hale, Sylvia Trent, Hugo Vane
Required new information: At least one fear/motive/lie/loyalty reveal with investigative consequence.
Forbidden reveals at this stage: No culprit resolution: no confession, no arrest, no 'case closed', no accusation ('I accuse'/'I name'), and never state 'the culprit/murderer/killer is/was …'. The accusation is reserved for the final reveal — build suspicion only.

FROZEN FACT STATE (DO NOT ALTER):
- Timeline anchor: October (autumn).
- Month, season, weather, and time-of-year language in this batch must stay compatible with autumn.
- Established timeline fact: Dinner service begins at six o'clock.
- If referenced, use exact phrase: "ten minutes past eight" (The victim's death was confirmed to have occurred at this precise time.).
- If referenced, use exact phrase: "seven o'clock" (Dinner was served at this time, coinciding with the victim's meal.).
- If referenced, use exact phrase: "two ounces" (The amount of poison used in the dish was measured to this exact volume.).

STORY TO DATE (REFERENCE ONLY — DO NOT COPY VERBATIM):
- Full prior chapter text is provided below for continuity, factual consistency, and reference accuracy.
- Use this to keep character voice, chronology, clue state, and location continuity aligned with earlier chapters.
- Do not quote, copy, or paraphrase these paragraphs too closely; write fresh prose that remains consistent with them.

--- BEGIN PRIOR CHAPTER 1 ---
Title: Chapter 1: The Glass with Shadows
Eleanor Voss stepped into the dining area of the seaside resort hotel, her heels silent on the smooth parquet as the grey morning light filtered through rain-streaked windows. The air was thick with the faint aroma of yesterday’s roasted meats, now mingling with the sharper scent of damp wool and the metallic tang of unease. A hush had settled over the room, broken only by the soft tap of rain against the glass panes and the distant murmur of voices beyond the double doors. At the far end of the long linen-draped table, Dr. Mallory Finch lay slumped in her chair, her head tilted at an unnatural angle, a single strand of hair fallen across her cheek. A half-finished glass stood by her hand, its rim clouded and the liquid within tinged with an odd, pearly film. Eleanor’s breath caught—not from the sight of death, which she had met before, but from the contradiction it presented: Dr. Mallory Finch, who had laughed with her only the night before, now stilled by something far more sinister than mere misfortune.

Even as Eleanor’s gaze lingered on the glass, a low voice behind her whispered, 'She said her stomach was unsettled, just before dinner was served.' The words came from a cluster of guests huddled near the sideboard, their faces drawn and pale in the morning gloom. Eleanor registered the detail with a tightening in her chest. She moved closer to the table, careful not to disturb the arrangement of cutlery or the faint imprint of a hand on the white linen. The residue in the glass was unmistakable—something more than wine or spirits had left its mark. She looked up, catching the anxious eyes of Beatrice Quill, who hovered near the door, her posture rigid, fingers clamped around the handle of her handbag. The room, for all its art deco elegance and the lingering scent of candle wax, felt suddenly claustrophobic.

Eleanor drew a slow breath, her mind already sorting through the implications. Dr. Mallory Finch had complained of discomfort before dinner, and now this glass—its contents betraying a secret not meant for daylight. It was not the first time Eleanor had seen a gathering curdle into suspicion, but the immediacy of the evidence unsettled her. Poison, she thought, or something close to it. The residue was too thick, too deliberate, to be dismissed as a careless spill. She noted the time: the clock above the mantelpiece read just after eight, but a quick glance at her own wristwatch told a different story. Two independent sources, and yet the minutes did not align—a discrepancy neither could yet explain. The contradiction gnawed at her, as did the knowledge that every guest had been present for dinner, every one with the opportunity, if not the motive.

Beatrice Quill, the social climber whose ambitions were as sharp as her voice, stepped forward, her heels clicking with purpose. 'You know, life’s too short for half-measures,' Beatrice announced, her tone brisk, but the tremor in her hand belied her bravado. 'Is there anything I can do?' Her eyes flicked to the glass, then to Eleanor, searching for reassurance or perhaps for an exit. Eleanor studied her, noting the way Beatrice’s gaze hovered not on the body, but on the evidence—on the glass, on the residue, on the possibility of blame. In another time, another place, Beatrice’s energy might have been infectious; here, it was a shield.

Eleanor’s own voice, when it came, was steady, layered with the authority she had earned in less genteel circumstances. 'Thank you, Miss Quill. For now, I must ask everyone to remain in the room.' She caught the eye of each guest in turn, her gaze lingering on Beatrice, then on the others who clustered in uneasy silence. 'Dr. Finch was my friend,' she said, her words carrying just enough weight to remind them all that this was not a play. 'And until we understand precisely what happened, no one is to leave.'

A gust of wind rattled the windows, drawing a shiver from the nearest guest. The autumnal chill seeped into the room, making the lamplight seem feeble against the grey morning beyond. Eleanor moved to the sideboard, noting the arrangement of decanters and the neat stack of plates, untouched since the night before. She lifted the glass by Dr. Mallory Finch’s hand, holding it up to the light. The residue clung to the inside, swirling in the thin liquid. She set it down carefully, unwilling to risk contaminating the evidence. The glass was a silent witness, its secret waiting to be coaxed into speech.

Behind her, a whisper of conversation rose and fell. 'She was fine at seven o'clock,' someone murmured, 'but by the time dessert arrived—' The sentence trailed off, unfinished. Eleanor made a mental note: dinner had been served at seven o'clock, yet the death, by all accounts, had occurred at ten minutes past eight. The times did not fit as neatly as the place settings. She pressed her fingers to her temple, recalling Dr. Mallory Finch’s laughter, the way she had raised her glass in a toast, the fleeting shadow that had crossed her face as she set it down. Had it been pain? Or merely the exhaustion of a woman who had carried too much for too long?

Beatrice Quill’s voice cut through the silence. 'If you’re suggesting this was deliberate—' she began, but Eleanor held up a hand. 'I am suggesting nothing, Miss Quill. Not yet.' The words hung in the air, heavy with implication. Beatrice’s lips pressed together, her eyes darting to the other guests, then back to Eleanor. There was a challenge in her stance, but also fear—a fear Eleanor recognized, having worn it herself in darker days.

The room seemed to contract around them, the polished silverware and crisp linens suddenly irrelevant in the face of what had transpired. Eleanor looked once more at Dr. Mallory Finch, her features softened by the morning’s dim light, her hand still resting near the tainted glass. The others watched, waiting for direction, for absolution, for anything that might restore the fragile order shattered by death. Eleanor straightened, her resolve hardening. She was the investigator now, and the truth—however tangled—would not remain hidden for long.
--- END PRIOR CHAPTER 1 ---

[SCENE COMPLETENESS CONTRACTS — MANDATORY. Each contract below lists what you MUST enact in that chapter. Do not summarise or mention these labels in the prose — enact them organically.]
Chapter 2 (Act 1) completeness contract:
  PIVOT ELEMENT (MANDATORY — write this into the prose, shown not told): "Witnesses recall Dr. Finch's complaints about stomach issues before dinner."
  FACT ESTABLISHED (MANDATORY — reader must know this by chapter end): "Establishes that the victim had been unwell, contradicting the assumption of sudden illness."
  RED HERRING (MANDATORY — seed naturally, not flagged as false): [rh_1] Beatrice mentions that Dr. Finch had been complaining of stomach pain for weeks prior to the dinner — seeds false inference about her health.

# Case Overview
Title: The Chilling Beverage
Era: 1940s
Setting: Seaside Resort Hotel
Crime: murder (delayed-action poison)
Culprit: Beatrice Quill
Victim: Dr. Mallory Finch
False assumption: Dr. Mallory Finch died from a sudden illness caused by her pre-existing condition.
Cast: Eleanor Voss (she/her), Dr. Mallory Finch (she/her), Captain Ivor Hale (he/him), Beatrice Quill (she/her), Sylvia Trent (she/her), Hugo Vane (he/him)

Setting Lock: Keep all scenes and descriptions consistent with the stated setting (Seaside Resort Hotel). Do not introduce a different location type. Do not invent an alternative estate name. The only permitted name for this property is "Seaside Resort Hotel" — any other estate name (e.g., "Caldwell Manor", "Ashwood Hall", or any invented proper name) is a continuity error that will be caught and rejected.

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
      "location": "the dining area of the seaside resort hotel",
      "timeOfDay": "Morning after the murder",
      "atmosphere": "Chaotic with whispers and speculation"
    },
    "characters": [
      "Eleanor Voss",
      "Beatrice Quill",
      "Captain Ivor Hale",
      "Sylvia Trent",
      "Hugo Vane"
    ],
    "purpose": "Establish initial reactions and conflicting evidence",
    "cluesRevealed": [
      "clue_mechanism_visibility_core",
      "clue_core_contradiction_chain"
    ],
    "dramaticElements": {
      "conflict": "Tensions rise as accusations and suspicions circulate.",
      "tension": "Witnesses provide conflicting statements about the victim's health.",
      "microMomentBeats": [
        "Eleanor notices the tension in Beatrice's eyes — a flicker of fear."
      ]
    },
    "summary": "As the group gathers around the dining area, Eleanor Voss questions the witnesses about their last interactions with the victim. Beatrice Quill and Captain Ivor Hale share conflicting accounts about Dr. Finch's health, while Sylvia Trent expresses her disbelief at the suddenness of the death. Eleanor notes the discrepancies and begins to suspect foul play.",
    "beat": "crime",
    "estimatedWordCount": 1800,
    "pivotElement": "Witnesses recall Dr. Finch's complaints about stomach issues before dinner.",
    "factEstablished": "Establishes that the victim had been unwell, contradicting the assumption of sudden illness.",
    "permittedBehavioursByAct": [
      {
        "characterName": "Eleanor Voss",
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
    "redHerringPlacement": {
      "redHerringId": "rh_1",
      "placementDetail": "Beatrice mentions that Dr. Finch had been complaining of stomach pain for weeks prior to the dinner — seeds false inference about her health."
    },
    "emotionalRegister": "Initial investigations unveil a web of deception, creating unease among the characters.",
    "dominantCharacterNote": {
      "name": "Eleanor Voss",
      "voiceRegister": "Eleanor's voice carries a melodic tone, often layered with insightful observations that reflect her charm."
    },
    "humourGuidance": {
      "permission": "forbidden"
    },
    "eraTextureNote": "Shorter daylight hours limiting activities; Overcast weather leading to indoor gatherings; Transportation shortages impacting mobility; Communication delays due to post-war infrastructure; Limited access to resources like food and goods",
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
□ Chapter 2: the clue [clue_core_contradiction_chain] (presence, poison, indicates, foul, play, victim, death) is placed in the first 25% of the chapter, dramatized in your own words, followed by an explicit inference or suspicion paragraph.
□ Chapter 2: the clue [clue_mechanism_visibility_core] (witnesses, recall, finch, complaints, stomach, issues, before, dinner) is placed in the first 25% of the chapter, dramatized in your own words, followed by an explicit inference or suspicion paragraph.
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
