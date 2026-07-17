# Actual Prompt Record

- Run ID: `mystery-1784140602570`
- Project ID: ``
- Timestamp: `2026-07-15T18:49:57.514Z`
- Agent: `Agent9-ProseGenerator-Ch1`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4.1`
- Temperature: `0.42`
- Max Tokens: `4500`
- Attempt: `first`
- Prompt Hash: `d44f7f4d434f7952`

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
- MORAL COMPLEXITY REQUIREMENT: The mechanism of this crime carries a moral gray area: "The culprit, driven by desperation, believed the victim had betrayed them, eliciting a complex mix of sympathy and horror." — the culprit reveal and denouement MUST acknowledge this ambiguity. Do not let the ending feel clean or simple. Give the reader at least one moment of uncomfortable sympathy or moral doubt.

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
   - Dr. Mallory Finch: Cynical Realist
   - Captain Ivor Hale: Traditionalist
   - Beatrice Quill: Ambitious Reporter
   - Sylvia Trent: Savvy Entrepreneur
   - Hugo Vane: Cunning Manipulator
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
  Public identity anchor: Local Politician; detective 
  Connection to victim: directly affected by Eleanor Voss's death and its fallout.
  Investigation relevance: is actively driving interviews and credibility checks in this scene.
  Suspicion/pressure cue seed: Professional reputation.
  Investigator read: include one immediate observational inference (gesture, gaze target, pause, object grip), but do not state guilt as fact.

- Dr. Mallory Finch
  Public identity anchor: Physician; suspect 
  Connection to victim: Once close friends, now estranged due to Eleanor's family's treatment of Mallory.; Eleanor and Mallory grew up together but drifted apart after Eleanor’s father ended their friendship..
  Investigation relevance: access plausibility: medium | alibi window: 9:30 PM - 10:30 PM | opportunity channel: Medical equipment.
  Suspicion/pressure cue seed: Nervous when discussing Eleanor.
  Investigator read: include one immediate observational inference (gesture, gaze target, pause, object grip), but do not state guilt as fact.

- Captain Ivor Hale
  Public identity anchor: Retired Naval Officer; suspect 
  Connection to victim: Respectful acquaintances, but Ivor's hidden past haunts their interactions.; Eleanor's family supported Ivor during the war, but he feels indebted to them..
  Investigation relevance: access plausibility: medium | alibi window: 9:00 PM - 10:00 PM | opportunity channel: Hotel staff access.
  Suspicion/pressure cue seed: Defensive when questioned.
  Investigator read: include one immediate observational inference (gesture, gaze target, pause, object grip), but do not state guilt as fact.

- Beatrice Quill
  Public identity anchor: Journalist; suspect 
  Connection to victim: They had a fri
[truncated for prompt budget]

WORLD DOCUMENT (use this as your primary creative context):

## Era: 1941-02
February 1941 is a time marked by the oppressive chill of winter, as the ongoing war reshapes the lives of individuals and communities. The effects of rationing are prevalent, forcing families to adapt to new realities while maintaining appearances. Women are increasingly stepping into roles traditionally held by men, creating a shift in social dynamics, yet the burden of expectation remains heavy. Everyday life is punctuated by communal gatherings, often infused with a sense of urgency as citizens prepare for the uncertainties of war. The tension is palpable, with the specter of conflict looming over even the most mundane activities, leaving an indelible mark on personal relationships and ambitions.
Emotional register: The dominant emotional state is one of anxiety and uncertainty, as people grapple with the realities of war while striving to maintain their daily lives.
Physical constraints: Rationing restricts access to basic goods and services, affecting daily life. | Winter weather limits outdoor activities and increases isolation. | Communication is strained due to military operations impacting telegram and postal services.
Current tensions (weave into background texture): The U.S. Congress has just passed the Lend-Lease Act to support Allied nations. | Tensions rise in the Atlantic as U-boats threaten shipping. | The Battle of Britain continues to impact European dynamics.
Wartime context — The war effort is growing, with many men serving overseas and women stepping into the workforce.: Communities are coming together, yet underlying tensions regarding gender roles and class disparities persist. Absence effect: The absence of loved ones in military service creates a profound sense of loss and longing.

## Story Theme
In a world suffocated by secrets and societal pressure, the echoes of personal ambition and unspoken truths illuminate the dark corners of human nature, and reveals that evidence carries ethical weight, forcing characters to choose accountability over social performance when appearances and facts collide.

## Story Emotional Register
Dominant: The story conveys an overarching sense of tension and unease, as hidden motives and societal pressures collide.

Arc:
In the grand seaside hotel, the atmosphere is thick with tension as the guests gather for a seemingly innocuous evening, only for the shocking murder of Eleanor Voss to shatter the calm. The initial shock gives way to a rising unease as Detective Hugo Vane begins the investigation, uncovering the tangled web of relationships and secrets among the suspects. Each clue unearthed brings emotional strain, as the true nature of the guests’ connections is revealed, leading to the first investigative turn where suspicions begin to narrow. Midway through the story, a pivotal revelation forces Vane to reevaluate his assumptions, shifting the focus towards understanding the deeper motives behind the characters’ actions. As the investigation deepens, the second pivot occurs when a critical piece of evidence changes the trajectory of the case, illuminating the dark corners of ambition and jealousy. The pressure mounts as the climax approaches, culminating in a tense confrontation that lays bare the hidden truths of each character. In the resolution, the emotional costs become apparent, as relationships are irrevocably altered and the characters grapple with the consequences of their choices amidst the echoes of identity that haunt them.

The story opens: The initial atmosphere is one of calm before the storm, filled with the vibrant energy of socialites. As the investigation takes shape: The investigation begins with a sense of confusion and rising anxiety as guests realize the implications of the murder. A first key turn arrives: The first clues reveal layers of deceit and hidden relationships among the suspects. At the mid-point of the story: A shocking revelation shifts the investigation's direction, exposing deeper motives.

A second pivot reshapes the course: New evidence complicates the narrative, forcing characters to confront their pasts. As tension reaches its height: Tension mounts as characters prepare for the inevitable confrontation.

## Emotional register at this point in the story
The initial atmosphere is one of calm before the storm, filled with the vibrant energy of socialites.

## Character Portraits (appearance & era)

### Dr. Mallory Finch
Dr. Mallory Finch embodies the struggles faced by women in the medical profession during the 1940s. As a competent physician, she is caught between her ambition and the lingering resentment towards the Voss family, who have historically mistreated her. Her past relationship with Eleanor's father complicates her present, as she balances professional integrity with personal motives. The war amplifies these tensions, forcing her to reconsider her place within a patriarchal society that often undermines her contributions.
Era intersection: Mallory's internal conflict mirrors the societal shifts as women assert their roles while battling entrenched prejudices.

### Captain Ivor Hale
Captain Ivor Hale represents the archetype of the war-weary soldier, grappling with the psychological scars of his past. His military background provides him with a sense of honor, yet the pressures of societal expectations weigh heavily on him. The emotional turmoil stemming from his unrequited love for Eleanor adds another layer of complexity to his character. In a time when masculinity is closely tied to valor, Ivor's struggle with PTSD reveals the hidden battles faced by many returning soldiers, reflecting the broader societal challenges of reconciling war experiences with civilian life.
Era intersection: Ivor's personal demons highlight the ongoing struggles of veterans in a society eager to move forward, yet haunted by the realities of war.

### Beatrice Quill
Beatrice Quill embodies the ambition and tenacity of young women in the 1940s, driven by a desire for success in a male-dominated industry. Her role as a journalist illustrates the shifting landscapes of gender roles and professional aspirations. Yet, her involvement in blackmailing Eleanor reveals the moral complexities that accompany ambition. The war creates an atmosphere of urgency, pushing Beatrice to navigate ethical boundaries in her quest for recognition, all while grappling with the consequences of her actions within a society that values appearances.
Era intersection: Beatrice's pursuit of success reflects the broader societal changes as women find their voices amidst the chaos of wartime.

### Sylvia Trent
Sylvia Trent represents the intersection of business acumen and personal loyalty. As a successful entrepreneur, she navigates the complexities of a competitive landscape while maintaining a partnership with Eleanor that could jeopardize her reputation. The pressures of war and societal expectations create a delicate balance between ambition and integrity. Sylvia's internal conflict highlights the sacrifices made by women striving for success in an environment that often undermines their contributions, reflecting the broader struggles faced by women in the workforce during this era.
Era intersection: Sylvia's character underscores the evolving roles of women in business as they confront the challenges and expectations of a society in flux.

### Hugo Vane
Hugo Vane embodies the political savvy and charm characteristic of local politicians in the 1940s. His hidden ties to the Voss family complicate his public persona, as he maneuvers through the intricacies of social and political connections. The pressures of wartime politics amplify his desire to maintain control over his reputation, while the potential exposure of his dealings with Eleanor adds an element of risk. Hugo's character reflects the tensions faced by politicians navigating ethical dilemmas in a time of crisis, showcasing the fragility of power amidst societal upheaval.
Era intersection: Hugo's situation illustrates the moral complexities of political life during a time of war, where personal ambitions clash with public accountability.

## Character Voices

### Dr. Mallory Finch (she/her/her)
Mallory speaks with clipped efficiency, her words often direct and to the point.
[comfortable] It’s not rocket science, you know; just a matter of proper care.
[evasive] I can’t divulge details about my patients, even if they are quite interesting.
[stressed] This is not the time for games; we need to focus on what matters!
Humour: Her dry wit emerges occasionally, revealing a sharp intellect behind her serious demeanor.

### Captain Ivor Hale (he/him/his)
Ivor's voice carries a measured tone, often layered with self-deprecating humor.
[comfortable] Well, I suppose that's the price of honor, isn’t it?
[evasive] I’d rather not dwell on the past; it’s best left buried.
[stressed] You have no idea what it’s like to carry these memories.
Humour: His self-deprecating humor often serves as a shield against his deeper struggles.

### Beatrice Quill (she/her/her)
Beatrice speaks with rapid-fire enthusiasm, her words tumbling out in a breathless rush.
[comfortable] Truth is stranger than fiction, isn’t it? Just look at this place!
[evasive] I wouldn’t want to mislead; let’s just say I have my sources.
[stressed] I can’t afford to slip up now; too much is riding on this!
Humour: Her sardonic wit adds a layer of complexity to her interactions.

### Sylvia Trent (she/her/her)
Sylvia's voice is confident, often punctuated with dry humor.
[comfortable] In the world of business, it’s all about the bottom line.
[evasive] I can’t reveal everything, especially not with so many ears around.
[stressed] This partnership is on shaky ground; we need to tread carefully.
Humour: Her observational humor reflects her sharp intellect and business acumen.

### Hugo Vane (he/him/his)
Hugo has a polished eloquence, his words crafted to charm and persuade.
[comfortable] After all, politics is a game of perception; it’s all about how you play it.
[evasive] I’d rather not discuss specifics; it’s all rather delicate, you see.
[stressed] We can’t afford any slip-ups; too much is at stake.
Humour: His dry wit often reveals a deeper understanding of the political game.

## Location Registers (scene framing guides)

Grand Lobby: The Grand Lobby exudes an air of faded opulence, where laughter mingles with whispers of secrets. The tension is palpable as guests navigate the space, their expressions betraying hidden anxieties.. Camera angle: The writer should enter this space with a sense of curiosity, capturing the interplay of light and shadow that hints at the stories unfolding within.. Era: In this era, the lobby serves as a social hub for guests, reflecting the complexities of wartime mingling.

Oceanview Dining Room: The Oceanview Dining Room feels like a sanctuary of warmth amidst the gloomy weather, where the aroma of fine food mingles with the sound of hushed conversations. Yet, an undercurrent of tension suggests that not all is as it seems.. Camera angle: As the writer enters, they should focus on the contrasts between the elegance of the setting and the shadows of uncertainty lurking just beyond the windows.. Era: The dining room is a space where social hierarchies are both reinforced and challenged during this transitional era.

Guest Room 312: Guest Room 312 feels like a cocoon of isolation, where the outside world’s chaos is muffled. The soft decor contrasts with the tension that hangs in the air, as secrets linger just beneath the surface.. Camera angle: The writer should approach this space with a sense of intimacy, revealing the inner conflicts that play out behind closed doors.. Era: In this era, guest rooms reflect the duality of luxury and personal turmoil faced by individuals during wartime.

Staff-Only Corridor: The Staff-Only Corridor feels stark and utilitarian, a world away from the opulence of the guest areas. The air is thick with the scent of cleaning products, and the atmosphere is filled with a sense of urgency and unspoken burdens.. Camera angle: The writer should enter this space with a focus on the contrasts between the guests’ experiences and the hard work of the staff, capturing the hidden stories that unfold here.. Era: This location highlights the often-overlooked lives of staff who navigate their own challenges behind the scenes during this tumultuous time.

## Humour guidance for this story position (opening)
Permission: forbidden
Rationale: The opening scene establishes a serious tone necessary for setting up the murder mystery.

FAIR-PLAY AND INFERENCE CONTRACT:
- FAIR PLAY CLUE TIMING: Never combine clue discovery and detective deduction in the same chapter. If a clue is first revealed to the reader in chapter N, the detective may only analyze, deduce from, or act on that clue in chapter N+1 or later.
- FAIR PLAY INFORMATION PARITY: The reader must see all clues BEFORE the detective uses them in reasoning. If the detective performs a test or makes a deduction, every piece of evidence supporting that conclusion must have been shown to the reader in earlier chapters.
- FAIR PLAY REVELATION SPACING: In the discriminating test scene, the detective can ONLY use clues that were revealed to the reader at least 1 full chapter earlier. Never introduce new clues or withheld information during the test.
- FAIR PLAY CONFRONTATION: During the final confrontation/revelation, the detective cannot surprise the reader with facts. Every piece of evidence cited must have been visible to the reader in prior chapters.
- Never solve by withheld information. Keep reader-information parity with detective reasoning.
- False assumption in force: Eleanor Voss was murdered by someone she knew well.
- Hidden truth to progressively expose (compose in your own words from these elements): murderer, someone, took, advantage, eleanor, trust
- Inference path checkpoints to dramatize clearly — compose ENTIRELY in your own sentences from these key terms (reproducing any briefing phrase verbatim FAILS validation):
  - Step 1: obs: gramophone, eleanor, room, playing, fresh, record | corr: gramophone, used, create, alibi, murderer | effect: narrows, suspect, pool, access, gramophone
  - Step 2: obs: witnesses, heard, music, coming, eleanor, room, around | corr: timing, music, suggests, murder, occurred, before | effect: narrows, murder, window, before
  - Step 3: obs: tampering, marks, gramophone, mechanism | corr: gramophone, altered, play, automatically, specific, time | effect: eliminates, suspects, knowledge, gramophone, workings
- Discriminating test method: trap
- Discriminating test elements to dramatize (compose ENTIRELY in your own sentences from these — do NOT reproduce any briefing phrase verbatim): gramophone, mechanism, proves, mallory, finch, mechanical, knowledge, tamper
- Test must rely on already-shown clue IDs: clue_7, clue_5, clue_culprit_direct_1, clue_1, clue_2
- Fair-play rationale: Step 1: The gramophone's recent use and witness statements (early) establish tampering. Step 2: Music timing and footprints (mid) narrow the murder window. Step 3: Tampering marks and technical knowledge test (discriminating test) identify Dr. Mallory as the culprit.

## Character Reference

### Dr. Mallory Finch (she/her — NEVER he/him)
Mallory's speech was marked by a clipped efficiency, her sentences often devoid of embellishment
When pressed, she would occasionally slip into sardonic remarks, revealing a sharp wit that contrasted with her otherwise serious demeanor.
Mallory wrestled with the resentment she felt towards the Voss family, torn between her desire for justice and the lingering affection she held for Eleanor's father.
Voice colour: Dr. Mallory Finch uses dry wit humour — let it surface in their dialogue where natural, not in every line.

### Captain Ivor Hale (he/him — NEVER she/her)
Ivor spoke with a measured cadence, often punctuating serious discussions with dry, self-deprecating humor that belied the pain lurking beneath
He had a tendency to reminisce, his stories often meandering yet imbued with a sense of nostalgia.
Ivor battled with the weight of his past, torn between the pride of his service and the shame of his hidden struggles, creating a chasm between his public persona and private reality.

### Beatrice Quill (she/her — NEVER he/him)
Beatrice spoke with a rapid-fire cadence, her words tumbling out in a breathless rush
Her dialogue was peppered with sharp quips and biting sarcasm, often revealing a keen insight into human nature.
Beatrice wrestled with the moral implications of her actions, torn between her ambition and the guilt of exploiting Eleanor's vulnerabilities.
Voice colour: Beatrice Quill uses sardonic humour — let it surface in their dialogue where natural, not in every line.

### Sylvia Trent (she/her — NEVER he/him)
Sylvia spoke with a confident cadence, often punctuating her observations with dry humor
Her dialogue reflected her sharp intellect, with a tendency to dissect situations with precision.
Sylvia was torn between her ambition and the loyalty she felt towards Eleanor, grappling with the moral complexities of their partnership.
Voice colour: Sylvia Trent uses observational humour — let it surface in their dialogue where natural, not in every line.

### Hugo Vane (he/him — NEVER she/her)
Hugo spoke with a polished eloquence, his words carefully chosen and delivered with a smooth cadence
His humor was often dry and understated, revealing a keen intellect beneath the surface charm.
Hugo faced a moral reckoning, torn between his ambitions and the ethical implications of his clandestine dealings; the truth could shatter his carefully constructed world.
Voice colour: Hugo Vane uses dry wit humour — let it surface in their dialogue where natural, not in every line.


## CHARACTER CONTRACTS (binding for this scene)
Each entry below constrains how this character must be written in this chapter.
These override generic style guidance when they conflict.

### Dr. Mallory Finch[SHE]
Voice & mannerisms: Mallory's speech was marked by a clipped efficiency, her sentences often devoid of embellishment. When pressed, she would occasionally slip into sardonic remarks, revealing a sharp wit that contrasted with her otherwise serious demeanor.
SIGNATURE TIC (use sparingly — this is Dr. Mallory Finch's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "It’s not rocket science, you know."
Sample voice fragments (match this register and rhythm):
  [comfortable] "It’s not rocket science, you know; just a matter of proper care."
  [evasive] "I can’t divulge details about my patients, even if they are quite interesting."
Humour: dry wit — deploy occasionally (level 0.4)
FORBIDDEN phrase (never write for Dr. Mallory Finch): "a surge of determination washed over her"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Resentment simmered beneath her professional exterior, fueled by the mistreatment she had received from Eleanor's family and the potential for financial gain should she inherit from them." — do not surface in Act I.

### Captain Ivor Hale[HE]
Voice & mannerisms: Ivor spoke with a measured cadence, often punctuating serious discussions with dry, self-deprecating humor that belied the pain lurking beneath. He had a tendency to reminisce, his stories often meandering yet imbued with a sense of nostalgia.
SIGNATURE TIC (use sparingly — this is Captain Ivor Hale's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "Well, I suppose that's the price of honor, isn’t it?"
Sample voice fragments (match this register and rhythm):
  [comfortable] "Well, I suppose that's the price of honor, isn’t it?"
  [evasive] "I’d rather not dwell on the past; it’s best left buried."
Humour: self deprecating — deploy rarely (level 0.3)
FORBIDDEN phrase (never write for Captain Ivor Hale): "she knew with certainty she was right"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "The fear that Eleanor's ambition could expose his wartime failures gnawed at him, threatening to unravel the honor he had fought so hard to uphold." — do not surface in Act I.

### Beatrice Quill[SHE]
Voice & mannerisms: Beatrice spoke with a rapid-fire cadence, her words tumbling out in a breathless rush. Her dialogue was peppered with sharp quips and biting sarcasm, often revealing a keen insight into human nature.
SIGNATURE TIC (use sparingly — this is Beatrice Quill's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "Truth is stranger than fiction, isn’t it?"
Sample voice fragments (match this register and rhythm):
  [comfortable] "Truth is stranger than fiction, isn’t it? Just look at this place!"
  [evasive] "I wouldn’t want to mislead; let’s just say I have my sources."
Humour: sardonic — deploy occasionally (level 0.6)
FORBIDDEN phrase (never write for Beatrice Quill): "palpable tension filled the room"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Beatrice's ambition was her downfall; Eleanor's death would eliminate her main source of income and catapult her into the limelight she so desperately sought." — do not surface in Act I.

### Sylvia Trent[SHE]
Voice & mannerisms: Sylvia spoke with a confident cadence, often punctuating her observations with dry humor. Her dialogue reflected her sharp intellect, with a tendency to dissect situations with precision.
SIGNATURE TIC (use sparingly — this is Sylvia Trent's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "In the world of business, it’s all about the bottom line."
Sample voice fragments (match this register and rhythm):
  [comfortable] "In the world of business, it’s all about the bottom line."
  [evasive] "I can’t reveal everything, especially not with so many ears around."
Humour: observational — deploy occasionally (level 0.4)
FORBIDDEN phrase (never write for Sylvia Trent): "everyone could sense the atmosphere"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Sylvia feared that Eleanor's plans might jeopardize her business interests, a threat that could unravel everything she had built." — do not surface in Act I.

### Hugo Vane[HE]
Voice & mannerisms: Hugo spoke with a polished eloquence, his words carefully chosen and delivered with a smooth cadence. His humor was often dry and understated, revealing a keen intellect beneath the surface charm.
SIGNATURE TIC (use sparingly — this is Hugo Vane's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "After all, politics is a game of perception."
Sample voice fragments (match this register and rhythm):
  [comfortable] "After all, politics is a game of perception; it’s all about how you play it."
  [evasive] "I’d rather not discuss specifics; it’s all rather delicate, you see."
Humour: dry wit — deploy occasionally (level 0.5)
FORBIDDEN phrase (never write for Hugo Vane): "a surge of determination washed over her"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Hugo's desire to protect his political aspirations and maintain the status quo drove him to consider drastic measures in light of Eleanor's potential revelations." — do not surface in Act I.



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

Primary Location: The Oceanic Grand Hotel (Brighton, England)
A grand seaside hotel with Art Deco elegance, overlooking the stormy English Channel.

Key Locations Available:
- Grand Lobby (interior): Gathering space for guests
- Oceanview Dining Room (interior): Dining space for guests
- Guest Room 312 (interior): Private space for guests
- Staff-Only Corridor (interior): Service area for hotel staff

Atmosphere (tonal cue only — do NOT reproduce this phrase verbatim in prose; translate into scene-specific, character-observed sensory language): tense and suspenseful due to recent events
Weather: overcast with occasional coastal fog

Era markers: Art Deco architecture | rationed petrol for automobiles | early radio broadcasts in the lobby

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
  - Visual: gleaming brass chandeliers, polished marble floors, large ocean-view windows
  - Sounds: muffled footsteps on carpet, soft laughter and whispers, the distant crash of waves
  - Scents: freshly polished wood, salt air from the ocean, warmth of baked goods
  - Touch: smooth marble underfoot, soft velvet upholstery

Oceanview Dining Room (interior):
  - Visual: gleaming silverware on white tablecloths, brightly colored floral arrangements, waves crashing against the cliffs
  - Sounds: clinking of cutlery, low hum of conversation, the distant roar of the ocean
  - Scents: roasted meats and fresh bread, seafood and herbs, sweet desserts cooling
  - Touch: smooth porcelain plates, crisp linen napkins

Guest Room 312 (interior):
  - Visual: soft pastel wallpaper, heavy drapes framing the window, a vintage writing desk
  - Sounds: the distant crash of waves, soft ticking of a clock, the rustle of paper
  - Scents: fresh linen and lavender, faint scent of old books, the salty tang of the sea air
  - Touch: soft cotton sheets, cool glass of the window

⛔ REFERENCE DATA — DO NOT TRANSCRIBE VERBATIM: The above profiles are structural guides only. Generate original prose that evokes these qualities; do not reproduce the exact phrasing or sentence structure of the profile paragraphs.

SCENE OPENING RULE: When opening a scene in a new location, write what the POV character directly observes and physically senses at that moment — not a general description of the room's qualities. The reader must feel present, not briefed. Sensory details must be observed by the character, not stated as fact about the place.

SENSORY WRITING TECHNIQUES:
- Opening paragraphs: Lead with 2-3 sensory details
[truncated for prompt budget]

## Texture Pool
Draw on these as opportunities arise — you are not required to use them.

- February 1941 is a time marked by the oppressive chill of winter, as the ongoing war reshapes the lives of individuals and communities
- The effects of rationing are prevalent, forcing families to adapt to new realities while maintaining appearances
- Women are increasingly stepping into roles traditionally held by men, creating a shift in social dynamics, yet the burden of expectation remains heavy
- Everyday life is punctuated by communal gatherings, often infused with a sense of urgency as citizens prepare for the uncertainties of war
- The tension is palpable, with the specter of conflict looming over even the most mundane activities, leaving an indelible mark on personal relationships and ambitions.

TEMPORAL CONTEXT:

This story takes place in February 1941 during winter.

Seasonal Atmosphere:
- Weather patterns: overcast skies, occasional coastal fog, chill in the air
- Daylight: Days are short with sunlight fading by 5 PM, leaving a pervasive gloom.
- Seasonal activities: Strolling along foggy coastal paths, Attending local dances or community gatherings, Participating in wartime rationing workshops
- Seasonal occasions: Valentine's Day on February 14
- Season: winter

Period Fashion (describe naturally):
- Men formal: Double-breasted navy wool suit, White dress shirt with a wing collar, Charcoal grey fedora
- Men casual: Tweed jacket, Corduroy trousers, Wool sweater
- Men accessories: Leather gloves, Silk tie, Pocket watch
- Women formal: Tea-length dress with a fitted waist and fuller skirt, Tailored wool coat with a fur collar, Accessorized hat with feathers
- Women casual: Knit cardigan with pearl buttons, High-waisted slacks, Cotton blouse with a Peter Pan collar
- Women accessories: Beaded clutch purse, String of pearls, Knitted scarf

Cultural Context (reference naturally):
- Music/entertainment: Bing Crosby's 'White Christmas', Glenn Miller's 'In the Mood', Doris Day's early records; Films: 'The Maltese Falcon', 'How Green Was My Valley'; Theatre: 'My Sister Eileen', 'The Glass Menagerie'; Radio: The Shadow, Fibber McGee and Molly
- Typical prices: Loaf of bread: four pence, A pint of milk: two pence, Coal scuttle refill: one shilling sixpence
- Current events: The U.S. Congress has just passed the Lend-Lease Act to support Allied nations; Tensions rise in the Atlantic as U-boats threaten shipping
- Literature: 'The Grapes of Wrath' by John Steinbeck | 'For Whom the Bell Tolls' by Ernest Hemingway | 'The Last Chronicle of Barset' by Anthony Trollope | [Mystery and detective fiction] | [Realistic war novels] | [Social realism]
- Technology: Radar technology improving military tactics | Development of synthetic rubber due to material shortages | Initial experiments with television broadcasts | Battery-operated radios | Table-top phonographs | Basic telephones
- Daily life: Gathering for communal meals, Participating in local defense drills, Engaging in letter-writing campaigns to soldiers
- Social rituals: Monthly community potluck dinners, Regular movie night at local theaters, Sunday church services followed by family gatherings

Atmospheric Details:
The air is thick with the damp chill of coastal fog, wrapping around the hotel like a shroud. The faint sound of jazz echoes from the hotel lounge, blending with the quiet conversations of guests sharing war stories. A warm glow from the lobby's fireplace offers a stark contrast to the gloomy weather outside, creating an inviting yet tense atmosphere.

FASHION INTEGRATION TECHNIQUES:
- First appearance: Describe outfit to establish class/personality
- Accessories: Gloves, hats, pocket watches, jewelry reveal status
- Time-specific: Different outfits for different times of day
- Character traits: Fastidious dresser vs rumpled appearance
- Action integration: "She tugged at her glove" or "He adjusted his tie"
- Weather appropriate: Overcoats in winter, light linen in summer

CULTURAL TOUCHSTONE INTEGRATION:
- Casual conversation: "Did you hear that new jazz record?" or "I saw the latest Chaplin film"
- Background details: Radio playing, newspaper headlin
[truncated for prompt budget]

NON-NEGOTIABLE CHAPTER OBLIGATIONS — LOCKED EVIDENCE VALUES (VERBATIM REQUIRED):
The following measured values (times, amounts, measurements) are absolute ground truth. Every time this chapter describes, mentions, or alludes to one — no matter how briefly — it MUST use the exact phrase shown below, character for character. NO paraphrase, approximation, rounding, or synonym is permitted.

FAILURE EXAMPLE: if the locked value is "at thirteen minutes to midnight" and you write "just before midnight" or "around midnight" — that is a HARD FAIL. You must write "at thirteen minutes to midnight". Equally, if the locked value is written in words, such as "ten minutes past eleven", and you convert it to figure-based clock notation — that is also a HARD FAIL. Words stay as words; figure forms are forbidden for word-phrased facts.

CRITICAL — WORD-PHRASED VALUES: If the canonical value is written out in words (e.g. a time like "ten minutes past eleven", or an amount like "forty minutes"), reproduce those exact words. DO NOT convert to figure-based time notation, twenty-four-hour format, or any other numeric shorthand. Correct: "ten minutes past eleven". WRONG: figure-based clock notation or numeric shorthand.

Locked values:
  - The length of the gramophone recording that masked the time of death.: "twenty minutes"
  - The time the gramophone recording began playing, masking the actual time of the murder.: "ten minutes past eight"
    ⛔ FORBIDDEN alternatives: "8:10", "8.10", "eight ten", "eight-ten", "eight past ten", "quarter past eight", "half past eight" — the ONLY acceptable form is "ten minutes past eight"

If a value has no relevance to this chapter, omit it. But the moment you reference the underlying evidence, only the exact phrase above is acceptable.

⛔ CLUES TO SURFACE IN THESE CHAPTERS — mandatory:
The following evidence MUST be clearly observable to an attentive reader. Do not bury it in atmosphere or passing dialogue. Each clue must be concrete, specific, and noticeable:

• [clue_mechanism_visibility_core] gramophone, recording, played, soundproof, room, masks, actual, time, murder, creating, illusion, eleanor
  Category: temporal | Criticality: essential | Supports inference step 1
  Points to: mechanism, used, create, false, alibi

For each clue above: an attentive reader should be able to find, record, and later use it to reason toward the solution.

═══ NARRATIVE STATE (read-only — do not contradict) ═══

LOCKED FACTS — use verbatim whenever this evidence is described:
  • The length of the gramophone recording that masked the time of death.: "twenty minutes"
  • The time the gramophone recording began playing, masking the actual time of the murder.: "ten minutes past eight"

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
Known location profile anchors: The Oceanic Grand Hotel, Grand Lobby, Oceanview Dining Room, Guest Room 312, Staff-Only Corridor, the scene
LOCATION NAME CAPITALISATION (HARD REQUIREMENT — validated):
All named locations in your prose MUST use the EXACT capitalisation from the CML profiles.
Canonical forms: "The Oceanic Grand Hotel", "Grand Lobby", "Oceanview Dining Room", "Guest Room 312", "Staff-Only Corridor", "the scene"
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

PROMPT BUDGET SUMMARY: budget=24000 tokens; fixed=7599; context=12740; dropped=[none]; truncated=[first_appearance_contracts, location_profiles, temporal_context, pronoun_accuracy]

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
4. Integrate at least two concrete era-grounded details per chapter from setting refinement signals: radio broadcasting | early television sets | military radar technology | long-distance telephone calls | military-style encrypted messages | telegram services.
5. Respect setting movement/access constraints in scene action and alibis: narrow hallways limit movement | large windows provide visibility but also expose guests to outside view | staircases are the only access to upper floors | restricted access to the staff-only areas | keycard or physical key required for guest rooms.
6. Sustain social coherence with this backdrop pressure: A murder at a grand seaside hotel during a tense post-WWII era draws together guests and staff, all navigating the pressures of societal change and suspicion amidst the fog.
7. Maintain continuity around these socially central cast anchors where relevant: Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill, Sylvia Trent, Hugo Vane.
8. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Critical: Plot similarity 0.85 with 'The Second Key' (same identity manipulation theme and 1940s setting)
9. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Moderate: Character similarity 0.80 with 'The Second Key' (similar character roles and dynamics)

CRITICAL PROSE REQUIREMENTS:

The CML specifies exact requirements for certain validation-critical scenes. You MUST include these elements at the specified positions.

**Discriminating Test Scene (Act 3, Scene 4):**
Required elements: Execute the discriminating test, Observe the culprit's reaction or result, Draw conclusion about guilt
Test type: mechanical proof

**Suspect Clearance Scenes:**
- Captain Ivor Hale (Act 3, Scene 5): Witnesses corroborate his alibi in the lobby.
  Clues: clue_hallway_1, clue_hallway_2
- Beatrice Quill (Act 3, Scene 5): Physical evidence shows her movements were elsewhere.
  Clues: clue_hallway_3, clue_hallway_4
- Sylvia Trent (Act 3, Scene 5): Her panic and alibi during the questioning clear her.
  Clues: clue_hallway_5, clue_hallway_6

**Culprit Revelation Scene (Act 3, Scene 6):**
Method: Confrontation with evidence

**Identity Protection Rules:**
Character: Eleanor Voss
- Before Act 3: refer as "the victim"
- From Act 3 onward: refer as "Eleanor"

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
Suspect pressure target(s): Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill, Sylvia Trent
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
  - Opening: Begin with a character action, spoken line, or clock/time marker — never a location name or location-description phrase.
  - Scene is set in: the scene — reference it naturally within the paragraph, never as your opening phrase.
  - Opening atmosphere (MANDATORY — validator enforced): the first paragraph MUST contain at least one of: rain / wind / fog / storm / mist / thunder / evening / morning / night / dawn / dusk / season / afternoon / midday / noon / midnight / twilight / sunrise / sunset / daylight / sunlight / overcast / cloudy / bright / dark / grey / pale / cold / warm / chill / crisp / damp / drizzle / haze / lamplight / firelight. A chapter that omits all of these from its opening paragraph will be rejected.
  - PARAGRAPH OPENER DIVERSITY (MANDATORY — validator enforced): No more than 2 paragraphs in this chapter may begin with "Hugo" or "Hugo's" as the first word. You must vary paragraph openings throughout: use sensory observations, another character's name or action, dialogue, object or sound details, or temporal markers. Opening 3 or more paragraphs with "Hugo" will cause automated rejection.
  - INVESTIGATOR ESTABLISHMENT REQUIRED: Hugo Vane must claim or be recognised as the investigator in this chapter. Establish Hugo Vane as the detective-in-charge within the first two paragraphs — Hugo Vane IS the investigator. Do NOT have any character suggest a "real" detective is still coming, or imply that authority has not yet been delegated. Hugo Vane begins the investigation in this chapter.
  - ⛔ BODY DISCOVERY ORDER (MANDATORY — Chapter 1 only): the victim's body must be physically encountered or described within the first TWO paragraphs. Do NOT spend the opening paragraphs solely on clock examination, atmospheric setup, or character introductions before the body is found. Required Chapter 1 structure: atmosphere (one sentence max) → body/discovery → investigator reaction → suspects → first time-source contradiction.
  - ⛔ MECHANISM SPOILER BAN: Do NOT state how the crime device was manipulated — not the direction, not the magnitude, not who performed it. Characters may only observe that two sources of evidence disagree. The specific method, tamper amount, and perpetrator's action are ALL FORBIDDEN until the reveal. WRONG: "The culprit had altered the device by forty minutes to create a false alibi." RIGHT: "Two independent pieces of evidence gave contradictory readings — a discrepancy neither could yet explain."
  - CLUE OBLIGATIONS — each clue below MUST be dramatized, but in YOUR OWN WORDS:
    Render each as something a character SEES, DOES, or SAYS on the page. The bracketed text is a
    DESCRIPTION of the evidence for you — do NOT transcribe it as narration. Copying a clue's
    description sentence verbatim into the prose FAILS validation.
    • gramophone, playing, soundproof, room [clue_mechanism_visibility_core] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      ⛔ SPOILER EMBARGO (pre-reveal chapter): surface ONLY the surface anomaly a character can see/hear/find.
         Do NOT name who it implicates, state the tamper direction or magnitude, or explain the mechanism in this chapter.
         Present it as an unexplained discrepancy; the culprit and method are revealed later.
         Place this OBSERVATION in paragraph 1 or 2 (observation only — no inference about the culprit).
  - Tonal contrast: include at least one beat of relief or ironic counterpoint. Do not sustain maximum tension for every paragraph.
  - CLUE DISCLOSURE RULE (Stage 1/4):
    Characters may OBSERVE anomalies (wrong time, missing object, odd detail) but must NOT explain the mechanism, deduce the method, or name the culprit. Discovery and reaction only.
    WRONG: dialogue or narration that directly explains how the crime was committed before Stage 4.
    RIGHT: observation, physical reaction, and logical inference that leaves the mechanism just off-screen.
  - ALIBI LOCK: Dr. Mallory Finch's established alibi is "9:30 PM - 10:30 PM". Do NOT place Dr. Mallory Finch at any other location or in any other activity during the crime window. Any contradiction is a continuity error that triggers a retry.
- Locked fact phrase obligations:
  - If this batch mentions The length of the gramophone recording that masked the time of death., write exactly: "twenty minutes".
  - If this batch mentions The time the gramophone recording began playing, masking the actual time of the murder., write exactly: "ten minutes past eight".
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
Batch chapters: 1-1.
Investigation state at start: 0 clue(s) revealed to reader; approximately 3 unresolved suspect(s).
Must change by end: Introduce cast relevance and plant first clue while keeping culprit unresolved.
Suspect pressure target(s): Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill, Sylvia Trent
Required new information: First clue observation tied to suspect landscape.
Forbidden reveals at this stage: No culprit reveal. | No full murder mechanism explanation. | Do not state the direction, magnitude, or agent of any clock or device tampering. Characters may only observe that two time sources disagree. "The clock was wound back by forty minutes" must not appear before Chapter 3.

FROZEN FACT STATE (DO NOT ALTER):
- Timeline anchor: February (winter).
- Month, season, weather, and time-of-year language in this batch must stay compatible with winter.
- Established timeline fact: Eleanor last seen at dinner at 8:30 PM
- Established timeline fact: The gramophone was playing music at 9:15 PM
- If referenced, use exact phrase: "twenty minutes" (The length of the gramophone recording that masked the time of death.).
- If referenced, use exact phrase: "ten minutes past eight" (The time the gramophone recording began playing, masking the actual time of the murder.).

STORY TO DATE (REFERENCE ONLY — DO NOT COPY VERBATIM):
- No previous chapter text exists yet for this batch.

[SCENE COMPLETENESS CONTRACTS — MANDATORY. Each contract below lists what you MUST enact in that chapter. Do not summarise or mention these labels in the prose — enact them organically.]
Chapter 1 (Act 1) completeness contract:
  PIVOT ELEMENT (MANDATORY — write this into the prose, shown not told): "The gramophone found playing a fresh record."
  FACT ESTABLISHED (MANDATORY — reader must know this by chapter end): "Establishes that the victim was found dead in her room, with the gramophone still playing."

# Case Overview
Title: Echoes of Identity
Era: 1940s
Setting: A grand seaside hotel
Crime: murder (acoustic manipulation)
Culprit: Dr. Mallory Finch
Victim: Eleanor Voss
False assumption: Eleanor Voss was murdered by someone she knew well.
Cast: Eleanor Voss (she/her), Dr. Mallory Finch (she/her), Captain Ivor Hale (he/him), Beatrice Quill (she/her), Sylvia Trent (she/her), Hugo Vane (he/him)

Setting Lock: Keep all scenes and descriptions consistent with the stated setting (A grand seaside hotel). Do not introduce a different location type. Do not invent an alternative estate name. The only permitted name for this property is "A grand seaside hotel" — any other estate name (e.g., "Caldwell Manor", "Ashwood Hall", or any invented proper name) is a continuity error that will be caught and rejected.

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
      "Hugo Vane",
      "Dr. Mallory Finch",
      "Captain Ivor Hale",
      "Beatrice Quill",
      "Sylvia Trent"
    ],
    "purpose": "Introduce the crime and detective",
    "cluesRevealed": [
      "clue_mechanism_visibility_core"
    ],
    "dramaticElements": {
      "conflict": "Locked room mystery established",
      "tension": "Every suspect had access to the victim",
      "microMomentBeats": [
        "Dr. Finch's hands tremble as she gazes at the lifeless body."
      ]
    },
    "summary": "In the grand seaside hotel, tension fills the air as the morning sun casts shadows over the scene. Detective Hugo Vane discovers the body of Eleanor Voss in her locked room, her gramophone eerily still. Shock ripples through the gathered guests as they realize the implications of the crime, with Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill, and Sylvia Trent present to witness the unfolding tragedy.",
    "beat": "gathering",
    "estimatedWordCount": 1800,
    "pivotElement": "The gramophone found playing a fresh record.",
    "factEstablished": "Establishes that the victim was found dead in her room, with the gramophone still playing.",
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
    "redHerringPlacement": null,
    "emotionalRegister": "The initial atmosphere is one of calm before the storm, filled with the vibrant energy of socialites.",
    "dominantCharacterNote": {
      "name": "Dr. Mallory Finch",
      "voiceRegister": "Mallory speaks with clipped efficiency, her words often direct and to the point."
    },
    "humourGuidance": {
      "permission": "forbidden"
    },
    "eraTextureNote": "Rationing restricts access to basic goods and services, affecting daily life.; Winter weather limits outdoor activities and increases isolation.; Communication is strained due to military operations impacting telegram and postal services.",
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
□ Chapter 1: the clue [clue_mechanism_visibility_core] (gramophone, recording, played, soundproof, room, masks, actual, time, murder, creating, illusion, eleanor) is placed in the first 25% of the chapter, dramatized in your own words, followed by an explicit inference or suspicion paragraph.
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
