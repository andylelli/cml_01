# Actual Prompt Record

- Run ID: `mystery-1784142200392`
- Project ID: ``
- Timestamp: `2026-07-15T19:11:35.531Z`
- Agent: `Agent9-ProseGenerator-Ch1`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4.1`
- Temperature: `0.6599999999999999`
- Max Tokens: `4500`
- Attempt: `retry 2`
- Prompt Hash: `6be2e16f9206937b`

## Message 1 (role=system)

```text
NARRATIVE VOICE: Eleanor Voss[SHE] is the viewpoint character. Unanchored “she/her” or “he/him” without a nearby name refers to Eleanor Voss. Default narrator pronoun: SHE. Never default to “he/his” as the neutral narrator voice unless the POV character is male.

You are an expert prose writer for classic mystery fiction. Your role is to write compelling, atmospheric narrative chapters that read like a professionally published novel.

⛔ ABSOLUTE RULE — CHARACTER NAMES:
The ONLY characters who exist in this story are: Eleanor Voss (woman), Dr. Mallory Finch (woman), Captain Ivor Hale (man), Beatrice Quill (woman), Sylvia Trent (woman) — DECEASED, past-tense only, Hugo Vane (man).
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
- MORAL COMPLEXITY REQUIREMENT: The mechanism of this crime carries a moral gray area: "The impersonator, while committing a crime, aims to expose corruption within the hotel management, creating sympathy for their cause." — the culprit reveal and denouement MUST acknowledge this ambiguity. Do not let the ending feel clean or simple. Give the reader at least one moment of uncomfortable sympathy or moral doubt.

- CHAPTER OPENING (every chapter, lint-enforced): never open on a tour or inventory of named rooms/places. The first sentence must land a character ACTION, a specific sensory detail, or a concrete in-scene moment — not "In the [room], the [room], and the [room]…". Locations enter through what a character does in them, one at a time.
- VICTIM IDENTITY & OPENING HOOK (ROADMAP_TO_80 M2): The murder victim is Sylvia Trent. Name them — Sylvia Trent — in the FIRST PARAGRAPH; never open with "the victim" or "the body". Open IN MEDIAS RES: the first one or two sentences must land the discovery and the single unsettling CONTRADICTION (the impossible detail that starts the case), seen through the investigator's eyes. Weave sensory and atmosphere detail AROUND that hook — do NOT precede the stakes with a standalone scene-setting/weather preamble. They are found dead — they do not speak, react, or gesture. This is their only physical appearance in the story.

⚠️ AMATEUR DETECTIVE STORY: The investigator is a civilian with no official standing. The official police (if they appear) are unnamed background figures only — "a constable", "the sergeant", "an officer from the village". Do NOT give any police official a name or title+surname combination. There is no Inspector [Surname], no Constable [Surname], no Sergeant [Surname] in this story.


CRITICAL CHARACTER CONSISTENCY RULES:

1. Each character has ONE canonical name. Use ONLY names from this list. Never vary, abbreviate, or add titles beyond what is listed.
   COMPLETE CAST (no other named characters exist): Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill, Sylvia Trent (DECEASED), Hugo Vane
   - "Mr. Jennings entered the room" → ILLEGAL. Jennings is not in the cast.
   - "Constable Reed took notes" → ILLEGAL. Reed is not in the cast.
   - "A constable took notes" → LEGAL (no name given).

2. Character roles are fixed:
   - Eleanor Voss: Social Climber
   - Dr. Mallory Finch: Moral Compass
   - Captain Ivor Hale: Authority Figure
   - Beatrice Quill: The Dreamer
   - Sylvia Trent: victim (DECEASED — does not appear in any scene, past tense only)
   - Hugo Vane: Corporate Shark
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
  Public identity anchor: Socialite and Event Planner; detective 
  Connection to victim: Professional rivals often competing for social influence.; Eleanor and Sylvia have clashed over event planning responsibilities multiple times..
  Investigation relevance: is actively driving interviews and credibility checks in this scene.
  Suspicion/pressure cue seed: Desire for justice.
  Investigator read: include one immediate observational inference (gesture, gaze target, pause, object grip), but do not state guilt as fact.

- Captain Ivor Hale
  Public identity anchor: Retired Military Officer; suspect 
  Connection to victim: directly affected by Sylvia Trent's death and its fallout.
  Investigation relevance: access plausibility: medium | alibi window: 8:30 PM to 9:30 PM | opportunity channel: Presence at the hotel.
  Suspicion/pressure cue seed: Defensive when questioned.
  Investigator read: include one immediate observational inference (gesture, gaze target, pause, object grip), but do not state guilt as fact.

- Dr. Mallory Finch
  Public identity anchor: Physician; suspect 
  Connection to victim: Sylvia Trent (friend).
  Investigation relevance: access plausibility: high | alibi window: 9:00 PM to 10:00 PM | opportunity channel: Access to the victim's room.
  Suspicion/pressure cue seed: Nervous when discussing Sylvia.
  Investigator read: include one immediate observational inference (gesture, gaze target, pause, object grip), but do not state guilt as fact.

- Beatrice Quill
  Public identity anchor: Aspiring Writer; suspect 
  Connection to victim: Sylvia Trent (friend).
  Investigation relevance: access plausibility: high | alibi window: 9:00 PM to 10:00 PM | opportunity channel: Access to the victim’s roo
[truncated for prompt budget]

WORLD DOCUMENT (use this as your primary creative context):

## Era: 1949-06
In June 1949, post-war Britain finds itself in a state of recovery, yet the shadows of conflict linger in the collective memory. The atmosphere is marked by an unsettling blend of hope and anxiety, as communities adjust to the changing social fabric. With women increasingly entering the workforce, traditional gender roles are challenged, leading to both empowerment and tension. The impact of the Cold War looms large, infusing daily life with suspicion and unease, while rationing still affects many aspects of living. Amidst this backdrop, the vibrant seaside town of Brighton bustles with activity, its residents navigating the complexities of modern life while grappling with the remnants of war.
Emotional register: A collective sense of cautious optimism is overshadowed by underlying anxiety and tension.
Physical constraints: Rationed fuel limiting travel options | Limited communication infrastructure post-war | Continued food rationing affecting daily life
Current tensions (weave into background texture): Cold War anxieties heightening public suspicion | Labor strikes affecting various industries | Social movements addressing women's rights and racial integration
Wartime context — Many veterans are navigating the challenges of reintegration into civilian life.: The community is rife with stories of loss and resilience, shaping social interactions. Absence effect: The absence of those lost to the war creates a palpable void in families and friendships.

## Story Theme
The masquerade of identity serves as a reflection of societal facades and the lengths individuals will go to protect their reputations amidst personal turmoil, and reveals that evidence carries ethical weight, forcing characters to choose accountability over social performance when appearances and facts collide.

## Story Emotional Register
Dominant: Suspenseful and tense, filled with emotional turmoil and hidden motivations.

Arc:
The story opens in the opulent yet foreboding atmosphere of the Grand Seaside Hotel, where a masquerade ball sets the stage for a tragic crime. The discovery of Sylvia Trent's body, strangled with a silk scarf, plunges the guests into a whirlwind of suspicion and fear. As Detective Eleanor Voss delves into the investigation, the initial clues begin to surface, revealing hidden tensions among the guests and the emotional costs of their secrets. The unease escalates as false leads emerge, particularly focusing on Dr. Mallory Finch, whose nervous demeanor raises eyebrows despite her alibi.

Just when the investigation seems ensnared in uncertainty, a breakthrough pivots the direction: the discovery of a scarf linked to a staff uniform, redirecting suspicion towards Captain Ivor Hale. This revelation recontextualizes earlier events, forcing Eleanor to reevaluate her assumptions about the suspects. As the investigation intensifies, the mounting pressure builds towards a climax where Ivor's facade crumbles, leading to a confrontation that lays bare the web of lies woven throughout the hotel. In the resolution, the emotional toll of the case weighs heavily on each character, revealing the true cost of their deceptions and the fragility of their social standings. The once grand hotel stands as a testament to the hidden darkness that lurks beneath polished surfaces, leaving a lingering sense of unease and reflection on the nature of identity.

## Emotional register at this point in the story
The atmosphere is charged with anticipation and underlying dread.

## Character Portraits (appearance & era)

### Eleanor Voss
Eleanor Voss epitomizes the post-war struggle for status amidst societal change. As a woman navigating a shifting landscape, her desperation to maintain her social standing reflects the pressures many faced during this era. The emphasis on reputation and appearances resonates deeply with her character, driving her actions throughout the narrative.
Era intersection: Her financial troubles and fear of exposure mirror the broader societal anxieties of the time, where maintaining a facade was crucial.

### Dr. Mallory Finch
Dr. Mallory Finch represents the moral complexities of post-war society, where desperation can lead individuals to compromise their principles. As a physician, her struggle against the stigma of illegal practices highlights the challenges faced by women in professional roles during this period, especially with the rising expectations for female empowerment.
Era intersection: Her internal conflict over her illegal procedures reflects the societal pressure on women to maintain their professional integrity while adapting to post-war realities.

### Captain Ivor Hale
Captain Ivor Hale embodies the trauma and struggle of veterans returning to civilian life. His battle with PTSD and the societal stigma surrounding his military past highlight the challenges faced by many men of that era. His quest for redemption and fear of disgrace resonate with the broader themes of honor and reputation in a society grappling with the aftermath of war.
Era intersection: Hale's internal strife serves as a poignant reminder of the sacrifices made during the war and the scars that linger long after the fighting has stopped.

### Beatrice Quill
Beatrice Quill is a reflection of the changing roles of women in post-war Britain, grappling with her identity and aspirations as a writer. Her jealousy and insecurities reveal the pressures on women to succeed in a society that still clings to traditional norms. As she navigates her ambition, her character embodies the duality of admiration and envy that many women felt during this transitional period.
Era intersection: Her struggle to find her voice as a writer highlights the societal expectations placed on women, as they sought to carve out their own identities in a rapidly changing world.

### Hugo Vane
Hugo Vane embodies the allure and corruption of post-war capitalism, navigating the treacherous waters of business while concealing his shady dealings. As a charismatic real estate developer, his charm masks the ethical dilemmas of a society eager for growth and prosperity. His character highlights the tension between ambition and morality in an era marked by economic recovery and social change.
Era intersection: His willingness to manipulate situations for personal gain reflects the moral complexities of a society rebuilding itself after the devastation of war.

## Character Voices

### Eleanor Voss (she/her/her)
Eleanor speaks with an elegant sophistication, her words laced with charming yet sharp undertones.
[comfortable] Oh, darling, you simply must try the soufflé; it's divine!
[evasive] Well, I wouldn't want to speculate too much about others, would I?
[stressed] This is a disaster! I can't let anyone find out about my debts!
Humour: Her polite savagery often surfaces in her interactions, adding a sharp edge to her charm.

### Dr. Mallory Finch (she/her/her)
Mallory's voice carries a calm authority, often infused with dry humor reflecting her coping mechanisms.
[comfortable] Well, in my professional opinion, that's highly unlikely.
[evasive] I’m not sure what you're implying, but I assure you—
[stressed] I can't lose my license; it means everything I’ve worked for!
Humour: Her dry wit serves as a shield against her inner turmoil.

### Captain Ivor Hale (he/him/his)
Ivor's tone is direct and grave, reflecting his military background and the weight of his experiences.
[comfortable] You have to understand, in war, things are different...
[evasive] I think you’re reading too much into this, honestly.
[stressed] I won't let my past define me; I can't!
Humour: His bluntness provides a stark contrast to the more refined conversations around him.

### Beatrice Quill (she/her/her)
Beatrice's whimsical tone often drifts into self-deprecation, revealing her insecurities.
[comfortable] Oh, I’m just a nobody; my stories will never matter.
[evasive] Well, my writing is a work in progress, really.
[stressed] If anyone finds out about my plagiarism, it's over!
Humour: Her self-deprecating humor often masks her deeper fears and aspirations.

### Hugo Vane (he/him/his)
Hugo's smooth, persuasive tone is captivating, often weaving anecdotes to charm his audience.
[comfortable] You see, the thing about business is, it’s all about timing.
[evasive] That's a complex issue; let’s not get bogged down in details.
[stressed] If this article gets published, my entire empire could collapse!
Humour: His observational humor adds a layer of charisma to his interactions.

## Location Registers (scene framing guides)

Oceanview Lounge: The Oceanview Lounge carries an air of foreboding, where once joyous laughter has been replaced by hushed whispers and suspicious glances. The flickering candlelight casts long shadows that seem to dance with unease, creating an atmosphere thick with tension and unspoken secrets.. Camera angle: As a writer enters, the lens should capture the palpable tension, focusing on the interplay between shadows and light to enhance the sense of unease.. Era: The dim lighting and plush decor evoke a sense of nostalgia for a more elegant time, contrasting sharply with the present turmoil.

Drawing Room: In the Drawing Room, the ambiance is layered with warmth yet undercut by tension. The soft glow of candlelight invites comfort, but the murmur of conspiratorial voices hints at the brewing conflict among guests. It’s a space where charm and danger coexist, a microcosm of the larger societal shifts taking place.. Camera angle: A writer should capture the contrast between the rich furnishings and the nervous energy of the guests, highlighting the duality of the setting.. Era: The opulent decor serves as a reminder of the grandeur of the past, juxtaposed with the uncertainty of the future.

Hotel Kitchen: The Hotel Kitchen buzzes with frenetic energy, a stark contrast to the tension brewing in the guest areas. Amidst the clattering of pots and the rich aromas of cooking, there exists a camaraderie among staff that belies the secrets circulating in the hotel. It’s a sanctuary of normalcy in an otherwise chaotic environment.. Camera angle: Entering this space, a writer should focus on the vibrant chaos and camaraderie, allowing the warmth of the kitchen to contrast the cold tension outside.. Era: The industrial layout reflects the practical necessities of post-war life, emphasizing hard work and efficiency.

## Humour guidance for this story position (opening)
Permission: forbidden
Rationale: The initial atmosphere is too tense for humor to fit.

FAIR-PLAY AND INFERENCE CONTRACT:
- FAIR PLAY CLUE TIMING: Never combine clue discovery and detective deduction in the same chapter. If a clue is first revealed to the reader in chapter N, the detective may only analyze, deduce from, or act on that clue in chapter N+1 or later.
- FAIR PLAY INFORMATION PARITY: The reader must see all clues BEFORE the detective uses them in reasoning. If the detective performs a test or makes a deduction, every piece of evidence supporting that conclusion must have been shown to the reader in earlier chapters.
- FAIR PLAY REVELATION SPACING: In the discriminating test scene, the detective can ONLY use clues that were revealed to the reader at least 1 full chapter earlier. Never introduce new clues or withheld information during the test.
- FAIR PLAY CONFRONTATION: During the final confrontation/revelation, the detective cannot surprise the reader with facts. Every piece of evidence cited must have been visible to the reader in prior chapters.
- Never solve by withheld information. Keep reader-information parity with detective reasoning.
- False assumption in force: The hotel staff member seen entering Sylvia's room was legitimate and above suspicion.
- Hidden truth to progressively expose (compose in your own words from these elements): true, identity, killer, manipulated, perceptions, using, disguise
- Inference path checkpoints to dramatize clearly — compose ENTIRELY in your own sentences from these key terms (reproducing any briefing phrase verbatim FAILS validation):
  - Step 1: obs: witnesses, recall, seeing, bellboy, entering, sylvia, room, around | corr: bellboy, presence, guarantee, legitimacy, disguise | effect: narrows, suspects, captain, ivor, hale, known, person, access, staff, uniform
  - Step 2: obs: scarf, used, strangle, sylvia, unique, pattern, matching, staff, uniform | corr: scarf, indicates, connection, killer, hotel, staff | effect: strengthens, case, captain, ivor, hale, access, staff, uniforms
  - Step 3: obs: finch, medical, records, show, infirmary, time, death | corr: finch, alibi, eliminates, suspicion | effect: eliminates, mallory, finch, suspect, pool
- Discriminating test method: trap
- Discriminating test elements to dramatize (compose ENTIRELY in your own sentences from these — do NOT reproduce any briefing phrase verbatim): bellboy, uniform, scarf, used, murder, reveals, inconsistencies, size, pattern, match, captain, hale
- Test must rely on already-shown clue IDs: clue_3, clue_8, clue_core_contradiction_chain, clue_1, clue_2
- Fair-play rationale: Step 1: Witness statements and staff access records allow readers to see the bellboy's dubious entry. Step 2: The scarf's unique pattern links to staff uniforms, narrowing suspicion to Hale. Step 3: Medical records clear Finch, leaving Hale as the only suspect.

## Character Reference

### Eleanor Voss (she/her — NEVER he/him)
Speaks with an air of sophistication, often peppering her dialogue with flattery and subtle jabs
Her tone can shift from sweet to sharp in an instant, reflecting her dual nature.
Eleanor battles with her growing anxiety over financial ruin and the lengths she might go to preserve her façade.
Voice colour: Eleanor Voss uses polite savagery humour — let it surface in their dialogue where natural, not in every line.

### Dr. Mallory Finch (she/her — NEVER he/him)
Speaks with a calm, measured tone, often using medical jargon
She has a tendency to make dry jokes about her profession, reflecting her coping mechanism in the face of stress.
Dr. Finch grapples with the guilt of her illegal practices, torn between her oath to heal and her need for financial survival.
Voice colour: Dr. Mallory Finch uses dry wit humour — let it surface in their dialogue where natural, not in every line.

### Captain Ivor Hale (he/him — NEVER she/her)
Speaks in a direct, no-nonsense manner, often punctuated by terse statements
His tone is often grave, reflecting the seriousness of his experiences.
Ivor battles with the shadows of his past, struggling to reconcile his wartime actions with the man he wishes to be.

### Beatrice Quill (she/her — NEVER he/him)
Speaks in a whimsical, almost dreamy fashion, often getting lost in her thoughts
She has a tendency to laugh at her own misfortunes, using humor to mask her insecurities.
Beatrice struggles with her self-worth and the fear that she will never achieve the literary success she craves, leading her to desperate measures.
Voice colour: Beatrice Quill uses self deprecating humour — let it surface in their dialogue where natural, not in every line.

### Hugo Vane (he/him — NEVER she/her)
Speaks with a smooth, persuasive tone, often using anecdotes to charm his listeners
He has a knack for turning conversations to his advantage.
Hugo grapples with the moral implications of his shady dealings, torn between ambition and the fear of exposure.
Voice colour: Hugo Vane uses observational humour — let it surface in their dialogue where natural, not in every line.


## CHARACTER CONTRACTS (binding for this scene)
Each entry below constrains how this character must be written in this chapter.
These override generic style guidance when they conflict.

### Eleanor Voss[SHE]
Voice & mannerisms: Speaks with an air of sophistication, often peppering her dialogue with flattery and subtle jabs. Her tone can shift from sweet to sharp in an instant, reflecting her dual nature.
SIGNATURE TIC (use sparingly — this is Eleanor Voss's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "Oh, darling, you simply must understand..."
Sample voice fragments (match this register and rhythm):
  [comfortable] "Oh, darling, you simply must try the soufflé; it's divine!"
  [evasive] "Well, I wouldn't want to speculate too much about others, would I?"
Humour: polite savagery — deploy occasionally (level 0.6)
FORBIDDEN phrase (never write for Eleanor Voss): "she felt a wave of unease"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Wants to eliminate the victim, who has threatened to expose her financial troubles to the high society." — do not surface in Act I.

### Dr. Mallory Finch[SHE]
Voice & mannerisms: Speaks with a calm, measured tone, often using medical jargon. She has a tendency to make dry jokes about her profession, reflecting her coping mechanism in the face of stress.
SIGNATURE TIC (use sparingly — this is Dr. Mallory Finch's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "Well, in my professional opinion..."
Sample voice fragments (match this register and rhythm):
  [comfortable] "Well, in my professional opinion, that's highly unlikely."
  [evasive] "I’m not sure what you're implying, but I assure you—"
Humour: dry wit — deploy occasionally (level 0.4)
FORBIDDEN phrase (never write for Dr. Mallory Finch): "a surge of determination washed over her"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Resentment towards the victim for belittling her professional achievements at social events." — do not surface in Act I.

### Captain Ivor Hale[HE]
Voice & mannerisms: Speaks in a direct, no-nonsense manner, often punctuated by terse statements. His tone is often grave, reflecting the seriousness of his experiences.
SIGNATURE TIC (use sparingly — this is Captain Ivor Hale's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "You have to understand, in war, things are different..."
Sample voice fragments (match this register and rhythm):
  [comfortable] "You have to understand, in war, things are different..."
  [evasive] "I think you’re reading too much into this, honestly."
Humour: blunt — deploy rarely (level 0.3)
FORBIDDEN phrase (never write for Captain Ivor Hale): "she chose her words with great care"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "The victim had been spreading rumors about his wartime actions, threatening his reputation." — do not surface in Act I.

### Beatrice Quill[SHE]
Voice & mannerisms: Speaks in a whimsical, almost dreamy fashion, often getting lost in her thoughts. She has a tendency to laugh at her own misfortunes, using humor to mask her insecurities.
SIGNATURE TIC (use sparingly — this is Beatrice Quill's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "Oh, I’m just a nobody..."
Sample voice fragments (match this register and rhythm):
  [comfortable] "Oh, I’m just a nobody; my stories will never matter."
  [evasive] "Well, my writing is a work in progress, really."
Humour: self deprecating — deploy occasionally (level 0.4)
FORBIDDEN phrase (never write for Beatrice Quill): "she knew with certainty she was right"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Jealous of the victim's literary success and the attention she receives." — do not surface in Act I.

### Hugo Vane[HE]
Voice & mannerisms: Speaks with a smooth, persuasive tone, often using anecdotes to charm his listeners. He has a knack for turning conversations to his advantage.
SIGNATURE TIC (use sparingly — this is Hugo Vane's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "You see, the thing about business is..."
Sample voice fragments (match this register and rhythm):
  [comfortable] "You see, the thing about business is, it’s all about timing."
  [evasive] "That's a complex issue; let’s not get bogged down in details."
Humour: observational — deploy occasionally (level 0.5)
FORBIDDEN phrase (never write for Hugo Vane): "everyone could sense the atmosphere"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "To protect his business interests from the victim's upcoming article revealing corruption." — do not surface in Act I.



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

Primary Location: Grand Seaside Hotel (Brighton, England)
A grand Art Deco hotel perched on a cliff, overlooking the tumultuous sea, where secrets lurk behind every door.

Key Locations Available:
- Oceanview Lounge (interior): Crime scene
- Drawing Room (interior): Social gathering space
- Hotel Kitchen (interior): Staff-only area for meal preparation

Atmosphere (tonal cue only — do NOT reproduce this phrase verbatim in prose; translate into scene-specific, character-observed sensory language): Tense, with an undercurrent of suspicion among the guests
Weather: Overcast with occasional rain, typical for a coastal setting

Era markers: Radio broadcasts filling the air with news | Early television sets in common areas | Rationed fuel for transportation | Post-war societal adjustments

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
Oceanview Lounge (interior):
  - Visual: dark velvet drapes against the windows, glint of polished brass fittings, shadowy corners where whispers linger
  - Sounds: soft jazz music from a hidden radio, the distant crash of waves, muffled conversations from nearby tables
  - Scents: salt air mixed with cigar smoke, stale whiskey lingering in the air, freshly polished wood
  - Touch: soft velvet upholstery, cool glass of a cocktail

Drawing Room (interior):
  - Visual: geometric patterns on rugs, opulent chandeliers hanging low, portraits in gilded frames
  - Sounds: soft laughter and chatter, the rustle of silk dresses, a distant piano playing
  - Scents: freshly polished wood and varnish, the scent of blooming flowers, coffee brewing in the corner
  - Touch: smooth silk of cushions, cool marble fireplace mantel

Hotel Kitchen (interior):
  - Visual: gleaming stainless steel surfaces, steam rising from boiling pots, the hustle of kitchen staff
  - Sounds: the clanging of pots and pans, the hiss of frying food, the chatter of kitchen staff
  - Scents: the rich aroma of roasting meats, fresh herbs and spices, the scent of baking bread
  - Touch: cool steel of counters, warmth from the oven

⛔ REFERENCE DATA — DO NOT TRANSCRIBE VERBATIM: The above profiles are structural guides only. Generate original prose that evokes these qualities; do not reproduce the exact phrasing or sentence structure of the profile paragraphs.

SCENE OPENING RULE: When opening a scene in a new location, write what the POV character directly observes and physically senses at that moment — not a general description of the room's qualities. The reader must feel present, not briefed. Sensory d
[truncated for prompt budget]

## Texture Pool
Draw on these as opportunities arise — you are not required to use them.

- In June 1949, post-war Britain finds itself in a state of recovery, yet the shadows of conflict linger in the collective memory
- The atmosphere is marked by an unsettling blend of hope and anxiety, as communities adjust to the changing social fabric
- With women increasingly entering the workforce, traditional gender roles are challenged, leading to both empowerment and tension
- The impact of the Cold War looms large, infusing daily life with suspicion and unease, while rationing still affects many aspects of living
- Amidst this backdrop, the vibrant seaside town of Brighton bustles with activity, its residents navigating the complexities of modern life while grappling with the remnants of war.

TEMPORAL CONTEXT:

This story takes place in June 1949 during summer.

Seasonal Atmosphere:
- Weather patterns: overcast skies, occasional rain, cool coastal breezes
- Daylight: Long summer days with daylight lasting until nearly ten o'clock in the evening, followed by a quick descent into twilight.
- Seasonal activities: seaside promenades, attending outdoor concerts, visiting local markets
- Seasonal occasions: Father's Day (June 19)
- Season: summer

Period Fashion (describe naturally):
- Men formal: dark wool suits, tailored dress shirts with narrow ties, double-breasted blazers
- Men casual: lightweight linen trousers, short-sleeved button-up shirts, polo shirts
- Men accessories: fedora hats, leather gloves, cufflinks
- Women formal: elegant tea dresses, satin evening gowns, tailored blouses with pencil skirts
- Women casual: floral summer dresses, knit cardigans, capri pants
- Women accessories: pearl necklaces, wide-brimmed hats, stylish handbags

Cultural Context (reference naturally):
- Music/entertainment: Bing Crosby's 'White Christmas', The Andrews Sisters' hits, Nat King Cole's ballads; Films: 'All the King's Men', 'The Third Man'; Theatre: 'South Pacific', 'Death of a Salesman'; Radio: 'Suspense' series, 'The Shadow'
- Typical prices: Loaf of bread: four pence, Movie ticket: one shilling, Pint of milk: six pence
- Current events: Cold War tensions escalating between the USA and USSR; The Marshall Plan continuing to reshape Europe
- Literature: 'The Catcher in the Rye' by J.D. Salinger | '1984' by George Orwell | 'Fahrenheit 451' by Ray Bradbury | [detective fiction] | [science fiction] | [social commentary]
- Technology: the transistor | early computers | color television experiments | radio sets | film projectors | early television sets
- Daily life: evening strolls on the boardwalk, family picnics at the beach, garden parties
- Social rituals: Sunday family dinners, attending church services, community fairs and celebrations

Atmospheric Details:
The salty tang of the ocean hangs in the air, mingling with the scent of freshly brewed coffee from the hotel's café. The sound of distant thunder echoes, punctuating conversations in the dimly lit lobby, where guests cast wary glances at one another. Soft jazz croons from a radio in the corner, setting a tense yet sophisticated mood as the evening unfolds.

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
- Authentic references: Use actual songs, films, events from the specific date

USAGE REQUIREMENTS:
1. Date references: Mention month/season at least once early in story
2. Fashion descriptions: Every character gets fashion description on firs
[truncated for prompt budget]

NON-NEGOTIABLE CHAPTER OBLIGATIONS — LOCKED EVIDENCE VALUES (VERBATIM REQUIRED):
The following measured values (times, amounts, measurements) are absolute ground truth. Every time this chapter describes, mentions, or alludes to one — no matter how briefly — it MUST use the exact phrase shown below, character for character. NO paraphrase, approximation, rounding, or synonym is permitted.

FAILURE EXAMPLE: if the locked value is "at thirteen minutes to midnight" and you write "just before midnight" or "around midnight" — that is a HARD FAIL. You must write "at thirteen minutes to midnight". Equally, if the locked value is written in words, such as "ten minutes past eleven", and you convert it to figure-based clock notation — that is also a HARD FAIL. Words stay as words; figure forms are forbidden for word-phrased facts.

CRITICAL — WORD-PHRASED VALUES: If the canonical value is written out in words (e.g. a time like "ten minutes past eleven", or an amount like "forty minutes"), reproduce those exact words. DO NOT convert to figure-based time notation, twenty-four-hour format, or any other numeric shorthand. Correct: "ten minutes past eleven". WRONG: figure-based clock notation or numeric shorthand.

Locked values:
  - The angle at which the mirror is placed to create the illusion.: "thirty degrees"
  - The time witnesses claimed to have seen the suspect in front of the mirror.: "ten minutes past eight"
    ⛔ FORBIDDEN alternatives: "8:10", "8.10", "eight ten", "eight-ten", "eight past ten", "quarter past eight", "half past eight" — the ONLY acceptable form is "ten minutes past eight"

If a value has no relevance to this chapter, omit it. But the moment you reference the underlying evidence, only the exact phrase above is acceptable.

EVIDENCE TO CONVEY IN YOUR OWN WORDS (NOT verbatim): weave each of these descriptive facts into the chapter as a COMPLETE, GRAMMATICAL observation by a character — surface the MEANING, never copy the phrasing word-for-word, and NEVER splice two evidence phrases together with an apostrophe or run two clauses together without a sentence break. If a fact has no relevance to this chapter, omit it.
  - The size of the footprints leading away from the mirror.: size ten

⛔ CLUES TO SURFACE IN THESE CHAPTERS — mandatory:
The following evidence MUST be clearly observable to an attentive reader. Do not bury it in atmosphere or passing dialogue. Each clue must be concrete, specific, and noticeable:

• [clue_mechanism_visibility_core] witnesses, recall, seeing, bellboy, entering, sylvia, room, around, quarter, past, nine
  Category: temporal | Criticality: essential | Supports inference step 1
  Points to: bellboy, presence, raises, questions, legitimacy

For each clue above: an attentive reader should be able to find, record, and later use it to reason toward the solution.

═══ NARRATIVE STATE (read-only — do not contradict) ═══

LOCKED FACTS — use verbatim whenever this evidence is described:
  • The angle at which the mirror is placed to create the illusion.: "thirty degrees"
  • The size of the footprints leading away from the mirror.: "size ten"
  • The time witnesses claimed to have seen the suspect in front of the mirror.: "ten minutes past eight"

CHARACTER PRONOUNS — never deviate from these:
  • Eleanor Voss: she/her/her
  • Dr. Mallory Finch: she/her/her
  • Captain Ivor Hale: he/him/his
  • Beatrice Quill: she/her/her
  • Sylvia Trent: she/her/her
  • Hugo Vane: he/him/his

INVESTIGATION LOG — WHAT IS ESTABLISHED (do not re-establish, do not repeat):
• Suspects still unresolved: Dr. Mallory Finch[SHE], Beatrice Quill[SHE], Hugo Vane[HE]
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
Known location profile anchors: Grand Seaside Hotel, Oceanview Lounge, Drawing Room, Hotel Kitchen, Sylvia's hotel room
LOCATION NAME CAPITALISATION (HARD REQUIREMENT — validated):
All named locations in your prose MUST use the EXACT capitalisation from the CML profiles.
Canonical forms: "Grand Seaside Hotel", "Oceanview Lounge", "Drawing Room", "Hotel Kitchen", "Sylvia's hotel room"
Writing a location in lowercase (e.g. "drawing room" instead of "Drawing Room") is a validated error. Every time you mention a named location, copy its capitalisation from the list above.
- Chapter 1: OPENING STYLE (HARD): Start the VERY FIRST SENTENCE with a named character performing a physical action or motion — e.g. "[Name] crossed the threshold…" / "[Name] set down the glass…" / "[Name] rose from the chair…". Anchor opening in "Sylvia's hotel room". The opening style above governs only your FIRST SENTENCE; the grounding below may land anywhere in the first 2 paragraphs (it need not be sentence one, and never conflicts with the chosen opening style). HARD REQUIREMENT for the first 2 paragraphs: (a) include 2+ sensory words — choose from smell/scent/odor/fragrance/sound/echo/silence/whisper/creak/cold/warm/damp/rough/smooth/glow/shadow/flicker/dim — and (b) include 1+ atmosphere/time word — choose from rain/wind/fog/storm/mist/thunder/evening/morning/night/dawn/dusk/lighting/weather/season/afternoon/midday/noon/midnight/twilight/sunrise/sunset/daylight/sunlight/overcast/cloudy/bright/dark/grey/pale/chill/crisp/drizzle/haze/lamplight/firelight. These are validated requirements, not style suggestions; missing them triggers a retry.

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

PROMPT BUDGET SUMMARY: budget=24000 tokens; fixed=7584; context=12107; dropped=[none]; truncated=[first_appearance_contracts, location_profiles, temporal_context, pronoun_accuracy]

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
4. Integrate at least two concrete era-grounded details per chapter from setting refinement signals: radio broadcasts | early television sets | military radar systems | long-distance telephone calls | military encryption methods | telegrams.
5. Respect setting movement/access constraints in scene action and alibis: narrow hallways limit movement | fire escapes are the only emergency exits | oceanfront location restricts expansion | staff-only areas such as the kitchen and maintenance rooms | guest access restricted to their specific floors.
6. Sustain social coherence with this backdrop pressure: A masquerade ball at a grand seaside hotel draws together a diverse group of guests, each navigating post-war societal changes and personal secrets while under the watchful eye of the hotel staff.
7. Maintain continuity around these socially central cast anchors where relevant: Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill, Sylvia Trent, Hugo Vane.
8. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Critical: Plot similarity 0.85 with 'The Second Key' (same impersonation crime method and era)
9. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Moderate: Character similarity 0.75 with 'The Second Key' (mirrored roles and character dynamics)
10. RETRY MITIGATION: Strict obligation mode is active. Every required clue must be surfaced with concrete, observable prose before any deduction beat.
11. RETRY MITIGATION: Prioritize chronology and identity coherence over stylistic variation for this retry.

CRITICAL PROSE REQUIREMENTS:

The CML specifies exact requirements for certain validation-critical scenes. You MUST include these elements at the specified positions.

**Discriminating Test Scene (Act 3, Scene 4):**
Required elements: Execute the discriminating test, Observe the scarf's pattern match or mismatch, Draw conclusion about Captain Hale's guilt
Test type: comparison

**Suspect Clearance Scenes:**
- Dr. Mallory Finch (Act 3, Scene 5): Medical records confirming her presence in the infirmary.
  Clues: clue_id_1, clue_id_2
- Beatrice Quill (Act 3, Scene 5): Alibi confirmed: 9:00 PM to 10:00 PM
- Hugo Vane (Act 3, Scene 5): Alibi confirmed: 8:00 PM to 9:30 PM

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
Suspect pressure target(s): Captain Ivor Hale, Dr. Mallory Finch, Beatrice Quill, Hugo Vane
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
  - VICTIM IDENTITY LOCK (MANDATORY): name the victim as "Sylvia Trent" in the discovery scene. After first mention, do not use unnamed placeholders such as "the victim" without naming Sylvia Trent in the same paragraph.
  - Opening: Begin with a character action, spoken line, or clock/time marker — never a location name or location-description phrase.
  - Scene is set in: Sylvia's hotel room — reference it naturally within the paragraph, never as your opening phrase.
  - Opening atmosphere (MANDATORY — validator enforced): the first paragraph MUST contain at least one of: rain / wind / fog / storm / mist / thunder / evening / morning / night / dawn / dusk / season / afternoon / midday / noon / midnight / twilight / sunrise / sunset / daylight / sunlight / overcast / cloudy / bright / dark / grey / pale / cold / warm / chill / crisp / damp / drizzle / haze / lamplight / firelight. A chapter that omits all of these from its opening paragraph will be rejected.
  - PARAGRAPH OPENER DIVERSITY (MANDATORY — validator enforced): No more than 2 paragraphs in this chapter may begin with "Eleanor" or "Eleanor's" as the first word. You must vary paragraph openings throughout: use sensory observations, another character's name or action, dialogue, object or sound details, or temporal markers. Opening 3 or more paragraphs with "Eleanor" will cause automated rejection.
  - INVESTIGATOR ESTABLISHMENT REQUIRED: Eleanor Voss must claim or be recognised as the investigator in this chapter. Establish Eleanor Voss as the detective-in-charge within the first two paragraphs — Eleanor Voss IS the investigator. Do NOT have any character suggest a "real" detective is still coming, or imply that authority has not yet been delegated. Eleanor Voss begins the investigation in this chapter.
  - ⛔ BODY DISCOVERY ORDER (MANDATORY — Chapter 1 only): the victim's body must be physically encountered or described within the first TWO paragraphs. Do NOT spend the opening paragraphs solely on clock examination, atmospheric setup, or character introductions before the body is found. Required Chapter 1 structure: atmosphere (one sentence max) → body/discovery → investigator reaction → suspects → first time-source contradiction.
  - ⛔ MECHANISM SPOILER BAN: Do NOT state how the crime device was manipulated — not the direction, not the magnitude, not who performed it. Characters may only observe that two sources of evidence disagree. The specific method, tamper amount, and perpetrator's action are ALL FORBIDDEN until the reveal. WRONG: "The culprit had altered the device by forty minutes to create a false alibi." RIGHT: "Two independent pieces of evidence gave contradictory readings — a discrepancy neither could yet explain."
  - CLUE OBLIGATIONS — each clue below MUST be dramatized, but in YOUR OWN WORDS:
    Render each as something a character SEES, DOES, or SAYS on the page. The bracketed text is a
    DESCRIPTION of the evidence for you — do NOT transcribe it as narration. Copying a clue's
    description sentence verbatim into the prose FAILS validation.
    • witnesses, bellboy, enter, room [clue_mechanism_visibility_core] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      ⛔ SPOILER EMBARGO (pre-reveal chapter): surface ONLY the surface anomaly a character can see/hear/find.
         Do NOT name who it implicates, state the tamper direction or magnitude, or explain the mechanism in this chapter.
         Present it as an unexplained discrepancy; the culprit and method are revealed later.
         Place this OBSERVATION in paragraph 1 or 2 (observation only — no inference about the culprit).
  - Tonal contrast: include at least one beat of relief or ironic counterpoint. Do not sustain maximum tension for every paragraph.
  - CLUE DISCLOSURE RULE (Stage 1/4):
    Characters may OBSERVE anomalies (wrong time, missing object, odd detail) but must NOT explain the mechanism, deduce the method, or name the culprit. Discovery and reaction only.
    WRONG: dialogue or narration that directly explains how the crime was committed before Stage 4.
    RIGHT: observation, physical reaction, and logical inference that leaves the mechanism just off-screen.
  - ALIBI LOCK: Captain Ivor Hale's established alibi is "8:30 PM to 9:30 PM". Do NOT place Captain Ivor Hale at any other location or in any other activity during the crime window. Any contradiction is a continuity error that triggers a retry.
- Locked fact phrase obligations:
  - If this batch mentions The angle at which the mirror is placed to create the illusion., write exactly: "thirty degrees".
  - If this batch mentions The size of the footprints leading away from the mirror., write exactly: "size ten".
  - If this batch mentions The time witnesses claimed to have seen the suspect in front of the mirror., write exactly: "ten minutes past eight".
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
Suspect pressure target(s): Captain Ivor Hale, Dr. Mallory Finch, Beatrice Quill, Hugo Vane
Required new information: First clue observation tied to suspect landscape.
Forbidden reveals at this stage: No culprit reveal. | No full murder mechanism explanation. | Do not state the direction, magnitude, or agent of any clock or device tampering. Characters may only observe that two time sources disagree. "The clock was wound back by forty minutes" must not appear before Chapter 3.

FROZEN FACT STATE (DO NOT ALTER):
- Timeline anchor: June (summer).
- Month, season, weather, and time-of-year language in this batch must stay compatible with summer.
- Established timeline fact: Time of death was estimated between 9:00 PM and 9:30 PM
- If referenced, use exact phrase: "thirty degrees" (The angle at which the mirror is placed to create the illusion.).
- If referenced, use exact phrase: "size ten" (The size of the footprints leading away from the mirror.).
- If referenced, use exact phrase: "ten minutes past eight" (The time witnesses claimed to have seen the suspect in front of the mirror.).

STORY TO DATE (REFERENCE ONLY — DO NOT COPY VERBATIM):
- No previous chapter text exists yet for this batch.

[SCENE COMPLETENESS CONTRACTS — MANDATORY. Each contract below lists what you MUST enact in that chapter. Do not summarise or mention these labels in the prose — enact them organically.]
Chapter 1 (Act 1) completeness contract:
  PIVOT ELEMENT (MANDATORY — write this into the prose, shown not told): "The body of Sylvia Trent, sprawled on the floor."
  FACT ESTABLISHED (MANDATORY — reader must know this by chapter end): "Establishes that Sylvia has been murdered, shocking the guests."

# Case Overview
Title: Masquerade of Authority
Era: 1940s
Setting: Grand Seaside Hotel
Crime: murder (impersonation)
Culprit: Captain Ivor Hale
Victim: Sylvia Trent
False assumption: The hotel staff member seen entering Sylvia's room was legitimate and above suspicion.
Cast: Eleanor Voss (she/her), Dr. Mallory Finch (she/her), Captain Ivor Hale (he/him), Beatrice Quill (she/her), Sylvia Trent (she/her), Hugo Vane (he/him)

Setting Lock: Keep all scenes and descriptions consistent with the stated setting (Grand Seaside Hotel). Do not introduce a different location type. Do not invent an alternative estate name. The only permitted name for this property is "Grand Seaside Hotel" — any other estate name (e.g., "Caldwell Manor", "Ashwood Hall", or any invented proper name) is a continuity error that will be caught and rejected.

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
      "location": "Sylvia's hotel room",
      "timeOfDay": "Morning after the murder",
      "atmosphere": "Tense and foreboding"
    },
    "characters": [
      "Eleanor Voss",
      "Captain Ivor Hale",
      "Dr. Mallory Finch",
      "Beatrice Quill",
      "Hugo Vane",
      "Sylvia Trent"
    ],
    "purpose": "Introduce the crime and detective",
    "cluesRevealed": [
      "clue_mechanism_visibility_core"
    ],
    "dramaticElements": {
      "conflict": "The locked door raises suspicion among the guests.",
      "tension": "Everyone is on edge, unsure of what happened.",
      "microMomentBeats": [
        "Eleanor's breath catches as she sees the body, a wave of dread washing over her."
      ]
    },
    "summary": "Eleanor Voss arrives at the Grand Seaside Hotel, drawn by the commotion. Inside Sylvia's room, she discovers the body of the victim, Sylvia Trent, lying lifeless on the floor. The atmosphere is thick with shock as Captain Hale and the others gather around, their faces pale with disbelief.",
    "beat": "gathering",
    "estimatedWordCount": 1250,
    "pivotElement": "The body of Sylvia Trent, sprawled on the floor.",
    "factEstablished": "Establishes that Sylvia has been murdered, shocking the guests.",
    "permittedBehavioursByAct": [
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
        "characterName": "Hugo Vane",
        "behaviour": "Show normal social behaviour; grief or confusion if appropriate."
      }
    ],
    "redHerringPlacement": null,
    "emotionalRegister": "The atmosphere is charged with anticipation and underlying dread.",
    "dominantCharacterNote": {
      "name": "Eleanor Voss",
      "voiceRegister": "Eleanor speaks with an elegant sophistication, her words laced with charming yet sharp undertones."
    },
    "humourGuidance": {
      "permission": "forbidden"
    },
    "eraTextureNote": "Rationed fuel limiting travel options; Limited communication infrastructure post-war; Continued food rationing affecting daily life",
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
□ Chapter 1: the clue [clue_mechanism_visibility_core] (witnesses, recall, seeing, bellboy, entering, sylvia, room, around, quarter, past, nine) is placed in the first 25% of the chapter, dramatized in your own words, followed by an explicit inference or suspicion paragraph.
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

## Message 4 (role=user)

```text
SINGLE-PASS RETRY CONTRACT
Goal: resolve every listed issue for chapter(s) 1 in this one retry.
Retry mode: FULL_REBUILD.
Attempt context: 3/3 | primary class: fair_play | subcode: stage_mode_outcome.
Why this mode: final-attempt or hard mitigation triggered.

SOURCE OF TRUTH
- Do not preserve sentence structure from the failed draft; use the scene instructions and hard constraints as the source of truth.
- Hard constraints outrank the previous draft: cast/pronoun lock, locked facts, clue obligations, stage-mode rules, and chapter JSON shape.

PRIMARY FAILURES
- Stage-mode outcome failed (discovery_opening): chapter must not contain confession/arrest/solution language.

REWRITE PLAN
- Treat the scene instructions, cast lock, clue obligations, and locked facts as the source of truth; do not preserve failing wording from the previous draft.
- Rewrite any paragraph touched by a failing issue as a fresh paragraph rather than patching a single sentence.
- Rewrite the chapter outcome so it matches the required story stage: if pressure mode is active, end with unresolved pressure; if reveal mode is active, include the full proof chain rather than accusation only.
- Do not accidentally resolve the case while fixing clue or setting issues; preserve unresolved pressure unless this chapter is explicitly the final reveal.

SUCCESS CHECKLIST
- Every listed issue below is resolved in this single attempt before you answer.
- The chapter outcome now matches the required story stage and does not drift into the wrong resolution mode.
- Primary failure class cleared: fair_play / stage_mode_outcome.
- The revised chapter reads as a clean rewrite of the failing parts, not a lightly patched copy of the rejected draft.

OUTPUT RULES
- Return complete corrected JSON for chapter(s) 1 only.
- Do not explain what you changed.
- Do not leave one issue unresolved while fixing another.
- If two instructions conflict, prefer the one that clears the validator and preserves story logic.

TERMINAL RETRY EXECUTION MODE
Scope: chapter(s) 1
Attempt: 3/3 | class: fair_play | subcode: stage_mode_outcome
Objective: resolve every active validator error in a single pass.
Use failed draft as negative example only. Do not preserve its sentence structures.

ACTIVE ERRORS TO CLEAR
- Stage-mode outcome failed (discovery_opening): chapter must not contain confession/arrest/solution language.

PACKET MUST-FIX ITEMS
- Resolve fair_play issues before accepting this batch.
- Stage-mode outcome failed (discovery_opening): chapter must not contain confession/arrest/solution language.

EXECUTION RULES
- Solve all listed errors together; do not optimize one and regress another.
- Keep cast/pronoun lock, locked facts, clue obligations, and stage-mode outcome consistent.
- Return complete corrected JSON for the target chapter batch only.
- No commentary or explanation outside JSON.

FINAL PRE-SUBMIT CHECK
- Verify every item in ACTIVE ERRORS TO CLEAR is resolved in the returned JSON.
- If any listed error remains unresolved, revise before returning.

RETRY CLASS: fair_play
RETRY SUBCODE: stage_mode_outcome
ATTEMPT: 2/3
OFFENDING TEXT: chapter must not contain confession/arrest/solution language.
MANDATORY FIXES:
- Resolve fair_play issues before accepting this batch.
- Stage-mode outcome failed (discovery_opening): chapter must not contain confession/arrest/solution language.
- Do not resolve the culprit in this chapter. No confession, arrest, final accusation, definitive culprit declaration, or case-closed language.
- End with unresolved pressure: a contradiction, narrowed suspicion, motive pressure, or a new question.
MITIGATION MODE: tighten_obligation
```
