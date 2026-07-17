# Actual Prompt Record

- Run ID: `mystery-1784253138797`
- Project ID: ``
- Timestamp: `2026-07-17T01:59:44.938Z`
- Agent: `Agent9-ProseGenerator-Ch2`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4.1`
- Temperature: `0.6599999999999999`
- Max Tokens: `4500`
- Attempt: `retry 2`
- Prompt Hash: `51ced32b4cce4b40`

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
- MORAL COMPLEXITY REQUIREMENT: The mechanism of this crime carries a moral gray area: "The murderer acted out of desperation to protect a loved one from wrongful blame, raising questions about justice versus loyalty." — the culprit reveal and denouement MUST acknowledge this ambiguity. Do not let the ending feel clean or simple. Give the reader at least one moment of uncomfortable sympathy or moral doubt.

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
   - Dr. Mallory Finch: Medical Professional
   - Captain Ivor Hale: Authority Figure
   - Beatrice Quill: Young Idealist
   - Sylvia Trent: Social Climber
   - Hugo Vane: Strategist
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

## Era: 1945-11
In November 1945, the world is still reeling from the impacts of World War II, with many returning soldiers struggling to adjust back to civilian life. The coastal towns reflect a society in transition, where the scars of conflict are fresh, yet hope for the future emerges amidst changing social dynamics. The ongoing economic struggles, including rationing and a struggling job market, create a heavy atmosphere, as families prepare for upcoming holidays with a mix of gratitude and anxiety. The hotel serves as a microcosm of this tumultuous time, filled with veterans and their families, each carrying their own burdens and secrets.
Emotional register: The collective emotional state is one of cautious optimism mixed with deep-seated anxiety and unresolved grief.
Physical constraints: Rationing of goods limits access to basic supplies. | Communication is hampered by the recent war, with many services still in disarray. | Travel is restricted due to fuel shortages and economic limitations.
Current tensions (weave into background texture): The Nuremberg Trials begin to address war crimes. | Debates over the future of Germany and Europe continue. | The United Nations has just been founded, raising hopes for global cooperation.
Wartime context — Many veterans are returning home, struggling with reintegration into society.: Women increasingly take on roles in business and industry, challenging traditional gender norms. Absence effect: The absence of many men due to the war has shifted family dynamics, creating both new opportunities and tensions.

## Story Theme
The story explores how the pressures of reputation and hidden truths can drive individuals to commit desperate acts in a world still grappling with the aftermath of war.

## Story Emotional Register
Dominant: The story oscillates between tension and intrigue, ultimately revealing the fragility of human connections.

Arc:
In the overcast atmosphere of a seaside hotel, the discovery of Eleanor Voss's strangled body casts a dark shadow over an otherwise charming establishment. The initial shock and horror reverberate through the guests, igniting a sense of unease that permeates every interaction. As the investigation unfolds, the atmosphere thickens with suspicion, particularly as initial clues lead to false leads and emotional turmoil among the characters. Dr. Mallory Finch's anxiety surfaces as she grapples with her own secrets, while Captain Ivor Hale's resentment toward Eleanor adds layers of complexity to the case.

A pivotal moment shifts the investigation when Hugo Vane discovers evidence of acoustic manipulation that alters the course of his inquiry, revealing the fragility of the alibis presented by the suspects. As the tension mounts, the revelation of Captain Hale's involvement sends shockwaves through the group, forcing the characters to confront their hidden motivations and fears. In this climactic moment, the emotional stakes are at their highest, as each character must face the consequences of their actions. The resolution leaves a lingering sense of loss and betrayal, as the once-vibrant community grapples with the aftermath of Eleanor's tragic demise, altering the trajectory of their lives forever. In the end, the echoes of identity and the sacrifices made for reputation reverberate through the hotel, leaving the characters forever changed by the events that unfolded.

## Emotional register at this point in the story
A shocking discovery of a murder sets a dark tone for the story.

## Character Portraits (appearance & era)

### Dr. Mallory Finch
Dr. Mallory Finch is a respected physician whose struggle with addiction highlights the hidden battles faced by many in a society still reeling from war. Her dedication to her patients contrasts sharply with her private turmoil, making her a complex character navigating the pressures of her profession while battling personal demons. The societal expectations of women in her profession only add to her stress.
Era intersection: Mallory's fear of losing her career due to her addiction resonates with the broader theme of women asserting their roles in a changing society.

### Captain Ivor Hale
Captain Ivor Hale, a war hero, grapples with feelings of resentment and inadequacy as he faces the challenges of post-war life. His public persona as a decorated officer clashes with the personal demons he battles, particularly his anger towards Eleanor for not supporting veterans' causes. His struggles encapsulate the emotional toll that the war has taken on many veterans.
Era intersection: Ivor's character embodies the tension between the glorified image of soldiers and the harsh realities they face upon returning home.

### Beatrice Quill
Beatrice Quill is an aspiring writer whose desperation for success drives her actions. The rejection of her manuscript serves as a catalyst for her frustrations, reflecting the struggle of many artists during this period to gain recognition in a competitive world. Her character illustrates the intersection of ambition and envy, particularly in a post-war society where opportunities are scarce.
Era intersection: Beatrice's plight highlights the challenges faced by women seeking independence and success in a landscape still dominated by traditional expectations.

### Sylvia Trent
Sylvia Trent, a glamorous socialite, navigates the complexities of status and ambition in a post-war world. Her desperate need for validation and fear of social decline drive her actions, making her a character emblematic of the pressure to maintain appearances in a changing society. The tension between her desires and her reality creates a rich backdrop for her interactions with others.
Era intersection: Sylvia's struggle for social acceptance reflects the broader anxieties of women as they seek new identities following the war.

### Hugo Vane
Hugo Vane, a detective with a shady past, embodies the complexities of navigating a world where trust is scarce. His analytical mind is his greatest asset, yet it is also a constant reminder of the secrets he harbors. As he investigates Eleanor's murder, he grapples with both professional and personal stakes, reflecting the moral ambiguities present in a society still healing from conflict.
Era intersection: Hugo's character illustrates the challenges of those who worked in the shadows of society, reflecting the changing landscape of post-war justice.

## Character Voices

### Dr. Mallory Finch (she/her/her)
Mallory speaks with a calm, measured cadence, often interjecting dry jokes to deflect from uncomfortable topics, her eyes betraying a flicker of anxiety when pressed.
[comfortable] You know what they say... a little humor goes a long way in medicine.
[evasive] I was at a dinner party, really—nothing unusual about that.
[stressed] What if someone finds out? I can't let that happen.
Humour: Her dry wit occasionally surfaces, providing a contrast to her anxiety.

### Captain Ivor Hale (he/him/his)
Ivor speaks with a booming voice, often punctuating his statements with self-deprecating humor, his demeanor a mix of warmth and underlying frustration.
[comfortable] I suppose I’ll just have to fish for compliments!
[evasive] Fishing? Oh, just a little relaxation. Nothing too serious.
[stressed] It's not about me—Eleanor's the one in trouble, and I can't help her.
Humour: Ivor's self-deprecating humor reflects his frustration with his current situation.

### Beatrice Quill (she/her/her)
Beatrice speaks with a quick, animated rhythm, often using sarcasm to mask her insecurities, her voice rising in pitch when she feels cornered.
[comfortable] Well, isn’t that just the plot twist of the century?
[evasive] Oh, I was just at the library—nothing suspicious, I assure you.
[stressed] This is my chance to make it, and I can't let it slip away!
Humour: Her sardonic humor often surfaces as a defense mechanism.

### Sylvia Trent (she/her/her)
Sylvia's speech is smooth and polished, often dripping with charm, yet laced with sharp undertones that reveal her underlying ambition.
[comfortable] Oh darling, it’s all about who you know!
[evasive] Charity gala? Yes, I was there, mingling with the best.
[stressed] I need this endorsement to maintain my status; it's everything!
Humour: Sylvia's polite savagery often reflects her ambition.

### Hugo Vane (he/him/his)
Hugo speaks in a calm, calculated manner, often pausing to reflect before answering, his gaze piercing as he assesses the motivations of those around him.
[comfortable] It’s all in the details, isn’t it?
[evasive] My alibi? I was simply in the lounge, nothing more.
[stressed] I can't afford any mistakes; my reputation is on the line.
Humour: His observational humor occasionally surfaces, but is understated.

## Location Registers (scene framing guides)

The Ocean View Lounge: The Ocean View Lounge is filled with an unsettling tension as guests whisper and cast furtive glances toward one another. The once-vibrant atmosphere is overshadowed by the recent tragedy, where laughter feels forced and conversations are laced with suspicion. Flickering gas lamps barely illuminate the unease that has settled in this once-cozy space, transforming it into a hotbed of anxiety and dread.. Camera angle: As a writer enters this lounge, the focus should be on the contrasts between its elegance and the palpable tension, highlighting the emotional stakes at play.. Era: The lingering effects of the war create an oppressive atmosphere, where the shadows of conflict intertwine with the guests' personal struggles.

Room 203 - The Seaside Suite: Room 203, The Seaside Suite, is a luxurious refuge that now feels haunted by the specter of recent events. The comfort of the four-poster bed contrasts sharply with the weight of anxiety that pervades the air. Guests are reminded of the disturbances outside, where secrets linger just beneath the surface. The faint scent of lavender provides a momentary escape, yet the atmosphere is thick with tension, as whispers of the past echo within its walls.. Camera angle: The writer should capture the juxtaposition of beauty and anxiety, emphasizing how the room's elegance belies the turmoil outside.. Era: The opulence of the room stands in stark contrast to the realities of post-war life, where comfort is often accompanied by underlying fear.

The Staff Kitchen: The Staff Kitchen buzzes with activity, a stark contrast to the tension felt in the guest areas. The warmth of the kitchen creates a sense of camaraderie among the staff, who work diligently amid the aromas of freshly baked bread and sautéing vegetables. However, the echoes of laughter are tinged with an awareness of the unrest among the guests, reminding everyone that the hotel is not just a backdrop for their daily tasks, but a stage for deeper conflicts.. Camera angle: As a writer enters, the focus should be on the warmth and energy of the kitchen, contrasting with the darker themes unfolding elsewhere in the hotel.. Era: The industrious atmosphere reflects the resilience of those working behind the scenes in a post-war world, where the act of cooking becomes a form of solace amidst chaos.

The Grand Staircase: The Grand Staircase is a transitional space heavy with anticipation and uncertainty. The polished banister and rich carpet create a sense of grandeur, yet the whispers and muted movements of guests suggest a collective anxiety. Each footstep echoes through the stillness, amplifying the tension that hangs in the air. This elegant passageway serves as a reminder of the ongoing drama unfolding within the hotel, where every ascent or descent feels laden with unspoken fears.. Camera angle: Writers should emphasize the duality of beauty and tension, capturing how the staircase serves as both a literal and metaphorical passage between worlds.. Era: The staircase, while beautiful, embodies the contrasting emotions of the post-war era, where elegance masks the underlying turmoil faced by its inhabitants.

## Humour guidance for this story position (opening)
Permission: forbidden
Rationale: The gravity of the murder requires a serious tone.

FAIR-PLAY AND INFERENCE CONTRACT:
- FAIR PLAY CLUE TIMING: Never combine clue discovery and detective deduction in the same chapter. If a clue is first revealed to the reader in chapter N, the detective may only analyze, deduce from, or act on that clue in chapter N+1 or later.
- FAIR PLAY INFORMATION PARITY: The reader must see all clues BEFORE the detective uses them in reasoning. If the detective performs a test or makes a deduction, every piece of evidence supporting that conclusion must have been shown to the reader in earlier chapters.
- FAIR PLAY REVELATION SPACING: In the discriminating test scene, the detective can ONLY use clues that were revealed to the reader at least 1 full chapter earlier. Never introduce new clues or withheld information during the test.
- FAIR PLAY CONFRONTATION: During the final confrontation/revelation, the detective cannot surprise the reader with facts. Every piece of evidence cited must have been visible to the reader in prior chapters.
- Never solve by withheld information. Keep reader-information parity with detective reasoning.
- False assumption in force: Captain Hale was in the lounge at the time of the murder.
- Hidden truth to progressively expose (compose in your own words from these elements): actually, soundproof, room, eleanor
- Inference path checkpoints to dramatize clearly — compose ENTIRELY in your own sentences from these key terms (reproducing any briefing phrase verbatim FAILS validation):
  - Step 1: obs: gramophone, needle, shows, unusual, scratches, wear | corr: indicates, gramophone, used, frequently, likely, play, recording, murder | effect: narrows, suspect, access, tamper, gramophone
  - Step 2: obs: witnesses, reported, hearing, loud, noise, right, before, finding, eleanor, body | corr: suggests, noise, likely, masked, gramophone, indicating, murder, occurred, recording | effect: eliminates, alibis, account, sound, manipulation
  - Step 3: obs: acoustic, measurements, show, sound, originated, lounge | corr: means, struggle, must, occurred, soundproof, room | effect: narrows, suspect, pool, access, room, time
- Discriminating test method: trap
- Discriminating test elements to dramatize (compose ENTIRELY in your own sentences from these — do NOT reproduce any briefing phrase verbatim): gramophone, recording, timeline, murder, proves, hale, alibi, false, timed, coincide
- Test must rely on already-shown clue IDs: clue_9, clue_mechanism_visibility_core, clue_5, clue_early_1
- Fair-play rationale: Step 1: The gramophone’s needle condition indicates it was played during the murder. Step 2: Witness noise reports align with the gramophone's timing. Step 3: Acoustic evidence reveals the true location of the struggle, confirming Hale's access and guilt.

## Character Reference

### Dr. Mallory Finch (she/her — NEVER he/him)
Mallory speaks with a calm, measured cadence, often interjecting dry jokes to deflect from uncomfortable topics, her eyes betraying a flicker of anxiety when pressed.
Struggles with guilt over her addiction, fearing it could destroy her career and the lives of those who depend on her.
Voice colour: Dr. Mallory Finch uses dry wit humour — let it surface in their dialogue where natural, not in every line.

### Captain Ivor Hale (he/him — NEVER she/her)
Ivor speaks with a booming voice, often punctuating his statements with self-deprecating humor, his demeanor a mix of warmth and underlying frustration.
Struggles with feelings of inadequacy and anger, torn between his past valor and current irrelevance.
Voice colour: Captain Ivor Hale uses self deprecating humour — let it surface in their dialogue where natural, not in every line.

### Beatrice Quill (she/her — NEVER he/him)
Beatrice speaks with a quick, animated rhythm, often using sarcasm to mask her insecurities, her voice rising in pitch when she feels cornered.
Struggles with her self-worth and the fear that she will never achieve her dreams, leading her to desperate measures.
Voice colour: Beatrice Quill uses sardonic humour — let it surface in their dialogue where natural, not in every line.

### Sylvia Trent (she/her — NEVER he/him)
Sylvia's speech is smooth and polished, often dripping with charm, yet laced with sharp undertones that reveal her underlying ambition, her laughter sometimes too bright.
Wrestles with her need for validation and the emptiness that comes from her superficial connections.
Voice colour: Sylvia Trent uses polite savagery humour — let it surface in their dialogue where natural, not in every line.

### Hugo Vane (he/him — NEVER she/her)
Hugo speaks in a calm, calculated manner, often pausing to reflect before answering, his gaze piercing as he assesses the motivations of those around him.
Struggles with guilt over his past misdeeds, fearing that one slip could unravel his new life.
Voice colour: Hugo Vane uses observational humour — let it surface in their dialogue where natural, not in every line.


## CHARACTER CONTRACTS (binding for this scene)
Each entry below constrains how this character must be written in this chapter.
These override generic style guidance when they conflict.

### Dr. Mallory Finch[SHE]
Voice & mannerisms: Mallory speaks with a calm, measured cadence, often interjecting dry jokes to deflect from uncomfortable topics, her eyes betraying a flicker of anxiety when pressed.
SIGNATURE TIC (use sparingly — this is Dr. Mallory Finch's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "‘You know what they say...’"
Sample voice fragments (match this register and rhythm):
  [comfortable] "You know what they say... a little humor goes a long way in medicine."
  [evasive] "I was at a dinner party, really—nothing unusual about that."
Humour: dry wit — deploy occasionally (level 0.5)
FORBIDDEN phrase (never write for Dr. Mallory Finch): "a surge of determination washed over her"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Eleanor threatened to expose her addiction, risking her career." — do not surface in Act I.

### Captain Ivor Hale[HE]
Voice & mannerisms: Ivor speaks with a booming voice, often punctuating his statements with self-deprecating humor, his demeanor a mix of warmth and underlying frustration.
SIGNATURE TIC (use sparingly — this is Captain Ivor Hale's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "‘I suppose I’ll just have to fish for compliments!’"
Sample voice fragments (match this register and rhythm):
  [comfortable] "I suppose I’ll just have to fish for compliments!"
  [evasive] "Fishing? Oh, just a little relaxation. Nothing too serious."
Humour: self deprecating — deploy occasionally (level 0.4)
FORBIDDEN phrase (never write for Captain Ivor Hale): "she knew with certainty she was right"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Eleanor dismissed his appeals for a veterans’ charity event, enraging him." — do not surface in Act I.

### Beatrice Quill[SHE]
Voice & mannerisms: Beatrice speaks with a quick, animated rhythm, often using sarcasm to mask her insecurities, her voice rising in pitch when she feels cornered.
SIGNATURE TIC (use sparingly — this is Beatrice Quill's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "‘Well, isn’t that just the plot twist of the century?’"
Sample voice fragments (match this register and rhythm):
  [comfortable] "Well, isn’t that just the plot twist of the century?"
  [evasive] "Oh, I was just at the library—nothing suspicious, I assure you."
Humour: sardonic — deploy occasionally (level 0.6)
FORBIDDEN phrase (never write for Beatrice Quill): "palpable tension filled the room"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Eleanor rejected Beatrice's manuscript, denying her a lucrative publishing deal." — do not surface in Act I.

### Sylvia Trent[SHE]
Voice & mannerisms: Sylvia's speech is smooth and polished, often dripping with charm, yet laced with sharp undertones that reveal her underlying ambition, her laughter sometimes too bright.
SIGNATURE TIC (use sparingly — this is Sylvia Trent's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "‘Oh darling, it’s all about who you know!’"
Sample voice fragments (match this register and rhythm):
  [comfortable] "Oh darling, it’s all about who you know!"
  [evasive] "Charity gala? Yes, I was there, mingling with the best."
Humour: polite savagery — deploy occasionally (level 0.5)
FORBIDDEN phrase (never write for Sylvia Trent): "she felt a wave of unease"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Eleanor’s refusal to endorse her social events jeopardized her ambitions." — do not surface in Act I.

### Hugo Vane[HE]
Voice & mannerisms: Hugo speaks in a calm, calculated manner, often pausing to reflect before answering, his gaze piercing as he assesses the motivations of those around him.
SIGNATURE TIC (use sparingly — this is Hugo Vane's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "‘It’s all in the details, isn’t it?’"
Sample voice fragments (match this register and rhythm):
  [comfortable] "It’s all in the details, isn’t it?"
  [evasive] "My alibi? I was simply in the lounge, nothing more."
Humour: observational — deploy occasionally (level 0.4)
FORBIDDEN phrase (never write for Hugo Vane): "everyone could sense the atmosphere"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "None directly against Eleanor, but his insights make him suspicious." — do not surface in Act I.



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

Primary Location: Cliffside Retreat Hotel (Broadstairs, England)
A seaside hotel perched on a cliff, blending Victorian and Art Deco styles, with an air of mystery among its guests.

Key Locations Available:
- The Ocean View Lounge (interior): Crime scene
- Room 203 - The Seaside Suite (interior): Guest accommodation
- The Staff Kitchen (interior): Staff-only area for food preparation
- The Grand Staircase (transitional): Main access route between floors

Atmosphere (tonal cue only — do NOT reproduce this phrase verbatim in prose; translate into scene-specific, character-observed sensory language): tense, with an undercurrent of suspicion among guests
Weather: overcast with occasional rain, typical of coastal climates

Era markers: Radio broadcasts of wartime news | Early television sets in common areas | Rationed wartime vehicles parked outside

USAGE GUIDELINES:
1. First mention of location: Ground the scene using sensory details drawn from the profiles — paraphrase these into what the POV character directly observes and experiences, not a summary of the room's general qualities
2. Geographic grounding: Reference the specific place (Broadstairs, England) naturally in dialogue or narrative
3. Action scenes: Integrate physical layout details (access, sightlines, constraints)
4. Atmospheric scenes: Reference weather, lighting, sounds from sensory palette
5. Era details: Weave in period markers naturally
6. Consistency: Keep all location descriptions aligned with profiles
7. OPENING GROUNDING (required, first 1-2 paragraphs of EVERY chapter): (a) name the specific location from this list, (b) give at least 2 concrete sensory details (sound, smell, temperature, texture, light/shadow), and (c) one time-of-day or weather/atmosphere detail — BEFORE advancing plot, clues, or the mechanism. Open on the setting and the people in it, not on the puzzle.
8. This matters most in pre-reveal chapters that withhold the mechanism: ground them in setting and character rather than rushing the investigation — a withheld chapter is not an empty one.
9. Do NOT use generic repeated manor/storm filler without profile-specific details; vary the opening location/sense each chapter

SENSORY PALETTE (use 2-3 senses per scene):
The Ocean View Lounge (interior):
  - Visual: flickering gas lamps, stormy sea through bay windows, art deco patterns on walls
  - Sounds: crackling gas flames, distant thunder, muffled conversations
  - Scents: tobacco smoke lingering, sea salt and dampness, old leather and polish
  - Touch: soft velvet upholstery, cold glass window panes

Room 203 - The Seaside Suite (interior):
  - Visual: sunlight spilling through sheer curtains, faded floral wallpaper, ornate furniture from the 1920s
  - Sounds: the rustle of curtains in the breeze, soft footsteps on the carpet, the distant call of seagulls
  - Scents: fresh linen and lavender, a hint of salt from the sea, old books on the shelf
  - Touch: soft cotton sheets, coolness of the balcony railing

The Staff Kitchen (interior):
  - Visual: gleaming stainless steel countertops, hanging pots and pans, large wooden prep tables
  - Sounds: clattering of pots and pans, the hiss of frying food, the chatter of kitchen staff
  - Scents: freshly baked bread, sautéing vegetables, the aroma of spices
  - Touch: warmth from the stove, coolness of marble countertops

⛔ REFERENCE DATA — DO NOT TRANSCRIBE VERBATIM: The above profiles are structural guides only. Generate original prose that evokes these qualities; do not reproduce the exact phrasing or sentence structure of the profile paragraphs.

SCENE OPENING RULE: When opening a scene in a new location, write what the POV character directly observes and physically senses at that moment — not a general description of the room's qualities. The reader must feel present, not briefed. Sensory details must be obser
[truncated for prompt budget]

## Texture Pool
Draw on these as opportunities arise — you are not required to use them.

- In November 1945, the world is still reeling from the impacts of World War II, with many returning soldiers struggling to adjust back to civilian life
- The coastal towns reflect a society in transition, where the scars of conflict are fresh, yet hope for the future emerges amidst changing social dynamics
- The ongoing economic struggles, including rationing and a struggling job market, create a heavy atmosphere, as families prepare for upcoming holidays with a mix of gratitude and anxiety
- The hotel serves as a microcosm of this tumultuous time, filled with veterans and their families, each carrying their own burdens and secrets.

TEMPORAL CONTEXT:

This story takes place in November 1945 during N/A.

Seasonal Atmosphere:
- Weather patterns: overcast skies, occasional rain showers, cool breezes from the coast
- Daylight: Short days with darkness enveloping the town by five o'clock in the evening
- Seasonal activities: preparations for Thanksgiving feasts, visiting local markets for seasonal produce, attending community gatherings
- Seasonal occasions: Thanksgiving (November 28)
- Season: N/A

Period Fashion (describe naturally):
- Men formal: dark wool suits, double-breasted blazers, tweed overcoats
- Men casual: corduroy trousers, button-up shirts with rolled sleeves, woolen sweaters
- Men accessories: fedora hats, silk ties, leather gloves
- Women formal: tea-length dresses with fitted waists, tailored suits with peplum jackets, cloche hats
- Women casual: knee-length skirts paired with cardigans, blouses with puff sleeves, practical ankle boots
- Women accessories: string of pearls, stylish handbags, colorful scarves

Cultural Context (reference naturally):
- Music/entertainment: Bing Crosby's 'White Christmas', The Ink Spots' 'If I Didn't Care', Doris Day's 'Sentimental Journey'; Films: 'The Best Years of Our Lives', 'Spellbound'; Theatre: 'Carousel', 'The Glass Menagerie'; Radio: 'The Jack Benny Program', 'Suspense'
- Typical prices: Loaf of bread: four pence, A pound of sugar: eight pence, Taxi fare across town: two shillings
- Current events: Nuremberg Trials begin to address war crimes; United Nations founded in October
- Literature: 'A Bell for Adano' by John Hersey | 'The Catcher in the Rye' by J.D. Salinger | 'The Naked and the Dead' by Norman Mailer | [post-war fiction] | [detective stories] | [romantic novels]
- Technology: first electronic computers are developed | advances in radar technology | the introduction of the first television commercials | radio sets in most homes | early television sets in affluent households | household appliances like washing machines
- Daily life: families gather for radio shows, neighbors visit each other for tea, community events celebrating Thanksgiving preparations
- Social rituals: Sunday church services attended regularly, family gatherings for holiday meals, neighborhood potluck dinners

Atmospheric Details:
The smell of damp earth and fallen leaves filled the air, punctuated by the distant sound of thunder rumbling over the sea. The flickering glow of hotel lobby lamps cast long shadows, creating a sense of mystery amid the whispered conversations of anxious guests. Beneath the surface of polite smiles, a tension hung thick, as the weight of recent history loomed large in the minds of all present.

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
- Clas
[truncated for prompt budget]

NON-NEGOTIABLE CHAPTER OBLIGATIONS — LOCKED EVIDENCE VALUES (VERBATIM REQUIRED):
The following measured values (times, amounts, measurements) are absolute ground truth. Every time this chapter describes, mentions, or alludes to one — no matter how briefly — it MUST use the exact phrase shown below, character for character. NO paraphrase, approximation, rounding, or synonym is permitted.

FAILURE EXAMPLE: if the locked value is "at thirteen minutes to midnight" and you write "just before midnight" or "around midnight" — that is a HARD FAIL. You must write "at thirteen minutes to midnight". Equally, if the locked value is written in words, such as "ten minutes past eleven", and you convert it to figure-based clock notation — that is also a HARD FAIL. Words stay as words; figure forms are forbidden for word-phrased facts.

CRITICAL — WORD-PHRASED VALUES: If the canonical value is written out in words (e.g. a time like "ten minutes past eleven", or an amount like "forty minutes"), reproduce those exact words. DO NOT convert to figure-based time notation, twenty-four-hour format, or any other numeric shorthand. Correct: "ten minutes past eleven". WRONG: figure-based clock notation or numeric shorthand.

Locked values:
  - The recorded sound was manipulated to mask the actual time of death.: "ten minutes past eleven"
    ⛔ FORBIDDEN alternatives: "11:10", "11.10", "eleven ten", "eleven-ten", "eleven past ten", "quarter past eleven", "half past eleven" — the ONLY acceptable form is "ten minutes past eleven"
  - The victim was found near the hotel’s private beach.: "fifty yards"
  - The gramophone recording lasted exactly three minutes.: "three minutes"

If a value has no relevance to this chapter, omit it. But the moment you reference the underlying evidence, only the exact phrase above is acceptable.

⛔ CLUES TO SURFACE IN THESE CHAPTERS — mandatory:
The following evidence MUST be clearly observable to an attentive reader. Do not bury it in atmosphere or passing dialogue. Each clue must be concrete, specific, and noticeable:

• [clue_core_contradiction_chain] witnesses, reported, hearing, loud, noise, right, before, finding, eleanor, body
  Category: testimonial | Criticality: essential | Supports inference step 2
  Points to: noise, indicates, gramophone, sound, present

• [clue_early_1] murder, eleanor, voss, concealed, gramophone, recording, created, false, alibi, captain, hale
  Category: temporal | Criticality: essential | Supports inference step 1
  Points to: gramophone, played, recording, time, eleanor, murder

• [clue_late_1] suggests, noise, likely, masked, gramophone
  Category: testimonial | Criticality: essential | Supports inference step 2
  Points to: murder, likely, occurred, gramophone, playing

For each clue above: an attentive reader should be able to find, record, and later use it to reason toward the solution.

═══ NARRATIVE STATE (read-only — do not contradict) ═══

LOCKED FACTS — use verbatim whenever this evidence is described:
  • The recorded sound was manipulated to mask the actual time of death.: "ten minutes past eleven"
  • The victim was found near the hotel’s private beach.: "fifty yards"
  • The gramophone recording lasted exactly three minutes.: "three minutes"

CHARACTER PRONOUNS — never deviate from these:
  • Eleanor Voss: she/her/her
  • Dr. Mallory Finch: she/her/her
  • Captain Ivor Hale: he/him/his
  • Beatrice Quill: she/her/her
  • Sylvia Trent: she/her/her
  • Hugo Vane: he/him/his

CLUES ALREADY REVEALED TO READER: clue_mechanism_visibility_core, clue_core_elimination_chain, clue_mid_1, clue_fp_contradiction_step_1 — do not reveal these as new information.

INVESTIGATION LOG — WHAT IS ESTABLISHED (do not re-establish, do not repeat):
• Evidence already established (reference only — do NOT restate or quote these; advance beyond them): gramophone, played, recording, time, eleanor, murder | mallory, finch, committed, murder | gramophone, likely, used, play, recording, murder | indicates, gramophone, used, frequently, likely, play
• Suspects still unresolved: Dr. Mallory Finch[SHE], Beatrice Quill[SHE], Sylvia Trent[SHE]
⚠ The story must move FORWARD from this log. Any beat already listed above is forbidden from repeating.

⚠ THIS CHAPTER'S REQUIRED ADVANCE (opening): Discover the body, confirm the victim, establish the scene. The victim is found dead. They do not speak, react, or gesture. This is their only physical appearance — in all subsequent chapters they exist only in past tense (memory, evidence, testimony).

CONTINUITY HANDOFF — previous chapter closing beat:
  • "The room, once a sanctuary from autumn’s chill and the world’s recent wounds, now felt unmoored—its velvet chairs and art deco wallpaper mere witnesses to a violence that had upended the fragile order of things. As the wind pressed against the windows and the..."
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
library, corridor, station, lounge

✓ RULE: Continue using this location vocabulary. Maintain consistency with established setting type.
✓ Do NOT introduce new location types that contradict earlier chapters.

**Recent Chapter Summary (for narrative continuity):**
Chapter 1: Chapter 1: The Stilled Gramophone
  Events: Hugo Vane pressed open the heavy double doors leading into the lounge of the seaside hotel, the worn brass handles cold beneath his palm.

⚠️ **VALIDATION:** Character name mismatches and setting drift are common failure modes.
Double-check every character name against the list above before using it.

**⏱ LOCKED TIME ANCHOR — use verbatim, do not paraphrase:**
Clock time (from the case ground truth): **"Eleanor's alibi time"**
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
Known location profile anchors: Cliffside Retreat Hotel, The Ocean View Lounge, Room 203 - The Seaside Suite, The Staff Kitchen, The Grand Staircase, the lounge of the seaside hotel
LOCATION NAME CAPITALISATION (HARD REQUIREMENT — validated):
All named locations in your prose MUST use the EXACT capitalisation from the CML profiles.
Canonical forms: "Cliffside Retreat Hotel", "The Ocean View Lounge", "Room 203 - The Seaside Suite", "The Staff Kitchen", "The Grand Staircase", "the lounge of the seaside hotel"
Writing a location in lowercase (e.g. "drawing room" instead of "Drawing Room") is a validated error. Every time you mention a named location, copy its capitalisation from the list above.
- Chapter 2: OPENING STYLE (HARD): Start the VERY FIRST SENTENCE with spoken dialogue — e.g. '"[words]," [Name] said/asked/replied/murmured.' The opening quote must be the first character on the line. Anchor opening in "the lounge of the seaside hotel". The opening style above governs only your FIRST SENTENCE; the grounding below may land anywhere in the first 2 paragraphs (it need not be sentence one, and never conflicts with the chosen opening style). HARD REQUIREMENT for the first 2 paragraphs: (a) include 2+ sensory words — choose from smell/scent/odor/fragrance/sound/echo/silence/whisper/creak/cold/warm/damp/rough/smooth/glow/shadow/flicker/dim — and (b) include 1+ atmosphere/time word — choose from rain/wind/fog/storm/mist/thunder/evening/morning/night/dawn/dusk/lighting/weather/season/afternoon/midday/noon/midnight/twilight/sunrise/sunset/daylight/sunlight/overcast/cloudy/bright/dark/grey/pale/chill/crisp/drizzle/haze/lamplight/firelight. These are validated requirements, not style suggestions; missing them triggers a retry.

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

PROMPT BUDGET SUMMARY: budget=24000 tokens; fixed=9621; context=12687; dropped=[none]; truncated=[location_profiles, temporal_context, pronoun_accuracy]

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
4. Integrate at least two concrete era-grounded details per chapter from setting refinement signals: radio broadcasts | early television sets | military radar | long-distance telephone calls | military encryption methods | telegram services.
5. Respect setting movement/access constraints in scene action and alibis: narrow hallways limiting movement | staircases with limited access during busy hours | guest rooms with restricted access based on occupancy | staff-only areas such as the kitchen and maintenance rooms | guest room privacy protocols.
6. Sustain social coherence with this backdrop pressure: A seaside hotel hosts a gathering of war veterans and their families, where tensions from the recent global conflict and shifting gender roles create an atmosphere ripe for suspicion and intrigue.
7. Maintain continuity around these socially central cast anchors where relevant: Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill, Sylvia Trent, Hugo Vane.
8. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Critical: Plot similarity 0.85 with 'The Second Key' (same identity-related crime and method)
9. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Moderate: Character similarity 0.75 with 'The Second Key' (similar cast structure and roles)
10. RETRY MITIGATION: Strict obligation mode is active. Every required clue must be surfaced with concrete, observable prose before any deduction beat.
11. RETRY MITIGATION: Prioritize chronology and identity coherence over stylistic variation for this retry.
12. STORY TO DATE ANTI-COPY RULE: The STORY TO DATE section below is provided for chronological and factual reference ONLY. You MUST NOT copy, lightly rephrase, or structurally echo any sentence or paragraph from prior chapters. Every sentence in this chapter must be original prose unique to this scene. Reusing even a clause from prior chapter text will cause this attempt to fail immediately.

CRITICAL PROSE REQUIREMENTS:

The CML specifies exact requirements for certain validation-critical scenes. You MUST include these elements at the specified positions.

**Discriminating Test Scene (Act 3, Scene 4):**
Required elements: Execute the discriminating test, Observe the culprit's reaction or result, Draw conclusion about guilt

**Suspect Clearance Scenes:**
- Dr. Mallory Finch (Act 3, Scene 5): Her alibi from multiple witnesses clears her.
  Clues: clue_id_1, clue_id_2
- Beatrice Quill (Act 3, Scene 5): Alibi confirmed by hotel staff.
  Clues: clue_id_1, clue_id_2
- Sylvia Trent (Act 3, Scene 5): Her management duties during the murder clear her.
  Clues: clue_id_1, clue_id_2

**Culprit Revelation Scene (Act 3, Scene 6):**
Method: Confrontation with evidence

**Identity Protection Rules:**
Character: Eleanor Voss
- Before Act 3: refer as "the victim"
- From Act 3 onward: refer as "Eleanor Voss"
Character: Captain Ivor Hale
- Before Act 3: refer as "the suspect"
- From Act 3 onward: refer as "Captain Ivor Hale"

**Clue Placement for These Chapters:**
- clue_core_contradiction_chain must appear in Act 1, Scene 2 via Witness statement

**VALIDATION CONSEQUENCE:** If these requirements are not met exactly, story validation will fail and the entire generation will be rejected. Follow these specifications precisely.


## ACTIVE CHAPTER MODE CONTRACT (MANDATORY)
Active chapter mode: Clue Reinterpretation.
Mode required outcomes:
- State original clue meaning and revised meaning.
- Show suspect implications and theory update.
Forbidden at this stage:
- Do not introduce decisive new evidence from nowhere.
Mode-specific narrative balance targets:
- Setting: 5-10%
- Character Reaction: 25-35%
- Clue Reinterpretation: 55-65%

## CHAPTER OUTCOME CONTRACT (MANDATORY)
Batch chapters: 2-2.
Investigation state at start: 4 clue(s) revealed to reader; approximately 3 unresolved suspect(s).
Must change by end: Reframe prior clue meaning and update suspect implications.
Suspect pressure target(s): Captain Ivor Hale, Dr. Mallory Finch, Beatrice Quill, Sylvia Trent
Required new information: Earlier clue gets revised meaning with explicit theory update.
Forbidden reveals at this stage: Do not introduce decisive new evidence from nowhere.

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
- Chapter 2:
  - STRUCTURAL ARCHETYPE — Chapter 2 must be: FIRST_CONTACT
      ✓ MUST contain: at least two suspect interviews
      ✗ MUST NOT contain: physical evidence discovery
  - Word count: Target 1250 words. Achieve this through plot events, dialogue exchanges, and physical investigation — not through atmospheric repetition or extended internal reflection. Each 200-word segment should contain at minimum one concrete story event (a discovery, a conversation exchange, a physical action or movement). Padding with atmosphere alone is not acceptable.
  - Opening: Begin with a character action, spoken line, or clock/time marker — never a location name or location-description phrase.
  - Scene is set in: the lounge of the seaside hotel — reference it naturally within the paragraph, never as your opening phrase.
  - Opening atmosphere (MANDATORY — validator enforced): the first paragraph MUST contain at least one of: rain / wind / fog / storm / mist / thunder / evening / morning / night / dawn / dusk / season / afternoon / midday / noon / midnight / twilight / sunrise / sunset / daylight / sunlight / overcast / cloudy / bright / dark / grey / pale / cold / warm / chill / crisp / damp / drizzle / haze / lamplight / firelight. A chapter that omits all of these from its opening paragraph will be rejected.
  - PARAGRAPH OPENER DIVERSITY (MANDATORY — validator enforced): No more than 2 paragraphs in this chapter may begin with "Hugo" or "Hugo's" as the first word. You must vary paragraph openings throughout: use sensory observations, another character's name or action, dialogue, object or sound details, or temporal markers. Opening 3 or more paragraphs with "Hugo" will cause automated rejection.
  - Continuity bridge: in the first 120 words, visibly connect from the previous chapter's final beat. Carry forward one unresolved element (object, accusation, emotional pressure, or immediate physical action) from: "The room, once a sanctuary from autumn’s chill and the world’s recent wounds, now felt unmoored—its velvet chairs and art deco wallpaper mere witnesses to a violence that had upended the fragile order of things. As the w...".
  - CLUE OBLIGATIONS — each clue below MUST be dramatized, but in YOUR OWN WORDS:
    Render each as something a character SEES, DOES, or SAYS on the page. The bracketed text is a
    DESCRIPTION of the evidence for you — do NOT transcribe it as narration. Copying a clue's
    description sentence verbatim into the prose FAILS validation.
    • witnesses, recall, loud, noise [clue_core_contradiction_chain] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: noise, indicates, gramophone, sound, present
      ↳ MANDATORY TWO-PARAGRAPH STRUCTURE (must appear in paragraphs 1 or 2 — no later):
         Paragraph 1: The POV character physically approaches or directly observes this evidence.
           The narration or dialogue explicitly states what is seen (use the exact locked phrase if one applies).
         Paragraph 2 (immediately following): The detective or POV character explicitly reasons
           about what this evidence implies — who it implicates, why it may be unreliable,
           or what inference it supports. This must be a separate full paragraph, not a sentence appended to Paragraph 1.
    • gramophone, playing, recording [clue_early_1] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: gramophone, played, recording, time, eleanor, murder
      ↳ MANDATORY TWO-PARAGRAPH STRUCTURE (must appear in paragraphs 1 or 2 — no later):
         Paragraph 1: The POV character physically approaches or directly observes this evidence.
           The narration or dialogue explicitly states what is seen (use the exact locked phrase if one applies).
         Paragraph 2 (immediately following): The detective or POV character explicitly reasons
           about what this evidence implies — who it implicates, why it may be unreliable,
           or what inference it supports. This must be a separate full paragraph, not a sentence appended to Paragraph 1.
    • witness, accounts, indicate, loud, noise, heard [clue_late_1] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: murder, likely, occurred, gramophone, playing
      ↳ MANDATORY TWO-PARAGRAPH STRUCTURE (must appear in paragraphs 1 or 2 — no later):
         Paragraph 1: The POV character physically approaches or directly observes this evidence.
           The narration or dialogue explicitly states what is seen (use the exact locked phrase if one applies).
         Paragraph 2 (immediately following): The detective or POV character explicitly reasons
           about what this evidence implies — who it implicates, why it may be unreliable,
           or what inference it supports. This must be a separate full paragraph, not a sentence appended to Paragraph 1.
  - Tonal contrast: include at least one beat of relief or ironic counterpoint. Do not sustain maximum tension for every paragraph.
  - CLUE DISCLOSURE RULE (Stage 3/4):
    Characters may draw inferences and name partial conclusions but must NOT state the full mechanism or name the culprit directly. The detective may suspect but not confirm.
    WRONG: dialogue or narration that directly explains how the crime was committed before Stage 4.
    RIGHT: observation, physical reaction, and logical inference that leaves the mechanism just off-screen.
  - ALIBI LOCK: Captain Ivor Hale's established alibi is "9 PM". Do NOT place Captain Ivor Hale at any other location or in any other activity during the crime window. Any contradiction is a continuity error that triggers a retry.
  - TESTIMONY CONTINUITY: Captain Ivor Hale has already made statements in earlier chapters. Any time, location, or claim attributed to Captain Ivor Hale in THIS chapter must be consistent with those earlier statements. Do NOT introduce a new or different alibi claim — any contradiction is a continuity error.
- Locked fact phrase obligations:
  - If this batch mentions The recorded sound was manipulated to mask the actual time of death., write exactly: "ten minutes past eleven".
  - If this batch mentions The victim was found near the hotel’s private beach., write exactly: "fifty yards".
  - If this batch mentions The gramophone recording lasted exactly three minutes., write exactly: "three minutes".
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
Investigation state at start: 4 clue(s) revealed to reader; approximately 3 unresolved suspect(s).
Must change by end: Reframe prior clue meaning and update suspect implications.
Suspect pressure target(s): Captain Ivor Hale, Dr. Mallory Finch, Beatrice Quill, Sylvia Trent
Required new information: Earlier clue gets revised meaning with explicit theory update.
Forbidden reveals at this stage: Do not introduce decisive new evidence from nowhere.

FROZEN FACT STATE (DO NOT ALTER):
- Timeline anchor: November (autumn).
- Month, season, weather, and time-of-year language in this batch must stay compatible with autumn.
- Established timeline fact: Eleanor's alibi time
- Established timeline fact: Hale's alibi time
- If referenced, use exact phrase: "ten minutes past eleven" (The recorded sound was manipulated to mask the actual time of death.).
- If referenced, use exact phrase: "fifty yards" (The victim was found near the hotel’s private beach.).
- If referenced, use exact phrase: "three minutes" (The gramophone recording lasted exactly three minutes.).

STORY TO DATE (REFERENCE ONLY — DO NOT COPY VERBATIM):
- Full prior chapter text is provided below for continuity, factual consistency, and reference accuracy.
- Use this to keep character voice, chronology, clue state, and location continuity aligned with earlier chapters.
- Do not quote, copy, or paraphrase these paragraphs too closely; write fresh prose that remains consistent with them.

--- BEGIN PRIOR CHAPTER 1 ---
Title: Chapter 1: The Stilled Gramophone
Hugo Vane pressed open the heavy double doors leading into the lounge of the seaside hotel, the worn brass handles cold beneath his palm. Grey morning light filtered through the bay windows, catching on the lingering haze of tobacco smoke and the glimmer of rain-damp glass. The sea beyond was a muted slate, its restless motion barely visible through a veil of drizzle. In the hush, broken only by the soft crackle of a gas lamp, Hugo’s gaze fell on Eleanor Voss, sprawled near the velvet sofa—her lifeless form a jarring interruption to the room’s faded elegance.

As Hugo stepped further into the lounge, Beatrice Quill’s voice carried from the corridor: "Dr. Finch was with us in the library until nearly midnight, wasn’t she?" Sylvia Trent nodded, her tone brisk. "Yes, and the night porter saw her return from the conference with the others. She couldn’t have been here." Their exchange, overheard by Hugo, confirmed Dr. Mallory Finch’s whereabouts long before he turned his attention to the evidence.

Beside Eleanor Voss’s body, the gramophone sat upon its lacquered table, its horn tilted as if listening for secrets. The faint scent of old leather and sea salt clung to the air. The needle, Hugo observed, was scored with deep, fresh scratches, the shellac dust still clinging to its tip. The machine itself was silent now, but the record upon its turntable suggested it had played recently. His eyes narrowed at this: a detail that felt far from incidental, as if the gramophone had somehow participated in the night’s violence.

The stopped pocket watch in Eleanor Voss’s right hand caught Hugo’s attention next. He knelt, careful not to disturb the carpet’s faint outline of her last struggle. The face of the watch, cracked but readable, displayed the time as ten minutes past eleven. He let out a slow breath, noting how this small mechanism—halted in her grasp—set a boundary for the moment of her death. The implication was stark: whatever had happened had occurred no later than that precise instant.

A step behind him, Dr. Mallory Finch hovered at the edge of the lamplight, her tailored navy skirt brushing the faded rug. Hugo glanced up, recalling the guest registry and the conversations from the night before. Dr. Finch had been present at a medical conference for the better part of the evening, witnessed by several staff and guests. That knowledge, so fresh in his mind, tentatively removed her from the immediate circle of suspicion. Still, her calm exterior was marred by the way her hand lingered too long on the back of a chair, knuckles white. Hugo watched her with professional detachment, wondering what private storm she weathered beneath that composed exterior.

Turning back to the gramophone, Hugo studied the wear on the needle more closely. The grooves ran deeper than casual use would allow, and faint lines radiated from the spindle’s base—marks left by hurried, repeated play. He touched the record, feeling its residual warmth, and frowned. There was no reason for the gramophone to have been so heavily used at such an hour. The wear and the dust told a story at odds with the supposed tranquility of the night.

He looked up as Captain Ivor Hale entered the lounge, his broad frame blocking the doorway for a moment before he stepped aside, eyes squinting against the light. Captain Hale, the retired officer whose medals were always half-hidden by his tweed jacket, had been seen in the lounge at eight fifty PM the previous night—so said the staff, and so the story went. Hugo catalogued this alibi silently, but the unease in Captain Hale’s posture—a hand unconsciously gripping his watch chain—spoke of a man not entirely at peace. Hugo filed the observation away, a red thread among others.

Beatrice Quill and Sylvia Trent materialized next, drawn by the low voices and the grim tableau. Beatrice, with her notebook clutched to her chest, hovered at the threshold, her gaze darting from Eleanor’s form to the gramophone and back. "Well, isn’t that just the plot twist of the century?" she murmured, though the tremor in her voice betrayed her unease. Sylvia, immaculate in a pearl-grey suit, lingered by the window, her silhouette reflected in the rain-streaked glass, one gloved hand lightly tracing the fogged pane. "Oh darling, it’s all about who you know!" she said, her tone brittle, as she tried to muster the bravado expected of her station.

The silence that followed was dense, broken only by the soft patter of rain against the leaded windows. Hugo rose, drawing the group’s attention. "If you’ll allow me," he said, voice low and measured, "I’ll take charge of things until the authorities arrive. It’s all in the details, isn’t it?" No one objected. In that moment, it was clear the household had already shifted its gravity toward him, the outsider now indispensable. He felt the weight settle on his shoulders, familiar and unwelcome.

Returning to the scene, Hugo mentally arranged the evidence: the gramophone’s recent use, the damaged needle, the stopped watch frozen at ten minutes past eleven, and the knowledge of Dr. Finch’s whereabouts. The contradiction was immediate and unavoidable—several guests’ alibis, given for times after ten minutes past eleven, now collided with the evidence in Eleanor Voss’s cold hand. Yet the gramophone’s odd state and the timing of its operation raised the possibility that not all was as it appeared. Someone, he suspected, had engineered confusion.

He let his gaze drift over the assembly. Captain Hale’s jaw was set; Dr. Finch’s eyes flickered with something unreadable; Beatrice clung to her notebook as if words might shield her from the reality before them; Sylvia’s poise was brittle, a mask for something more fragile beneath. Each had known Eleanor Voss, each had reason—spoken or secret—to be drawn into the current of suspicion now swirling through the Seaside Hotel.

The room, once a sanctuary from autumn’s chill and the world’s recent wounds, now felt unmoored—its velvet chairs and art deco wallpaper mere witnesses to a violence that had upended the fragile order of things. As the wind pressed against the windows and the rain intensified, Hugo gathered himself, steeling his mind for the work ahead. The evidence did not lie, but it could be made to mislead. Only careful attention—his particular specialty—would untangle what was true from what someone desperately wished to hide.
--- END PRIOR CHAPTER 1 ---

[SCENE COMPLETENESS CONTRACTS — MANDATORY. Each contract below lists what you MUST enact in that chapter. Do not summarise or mention these labels in the prose — enact them organically.]
Chapter 2 (Act 1) completeness contract:
  PIVOT ELEMENT (MANDATORY — write this into the prose, shown not told): "Witnesses report hearing a loud noise right before finding the body."
  FACT ESTABLISHED (MANDATORY — reader must know this by chapter end): "Establishes that the witnesses heard a noise that contradicts the timeline of the murder."

# Case Overview
Title: Echoes of Identity
Era: 1940s
Setting: Seaside Hotel
Crime: murder (acoustic manipulation)
Culprit: Captain Ivor Hale
Victim: Eleanor Voss
False assumption: Captain Hale was in the lounge at the time of the murder.
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
    "sceneNumber": 2,
    "act": 1,
    "title": "Initial Investigation",
    "setting": {
      "location": "the lounge of the seaside hotel",
      "timeOfDay": "Shortly after the body is discovered",
      "atmosphere": "An air of suspicion hangs heavy as the detective begins his questioning."
    },
    "characters": [
      "Hugo Vane",
      "Eleanor Voss",
      "Captain Ivor Hale",
      "Dr. Mallory Finch",
      "Beatrice Quill",
      "Sylvia Trent"
    ],
    "purpose": "Establish contradictions in witness statements.",
    "cluesRevealed": [
      "clue_core_contradiction_chain",
      "clue_early_1",
      "clue_late_1"
    ],
    "dramaticElements": {
      "conflict": "Witness statements begin to contradict each other.",
      "tension": "The detective senses that someone is hiding the truth.",
      "microMomentBeats": [
        "Hugo glances at Eleanor, noting her trembling hands as she speaks."
      ]
    },
    "summary": "In the lounge, Hugo Vane begins to question the guests about their whereabouts during the murder. Tensions rise as conflicting statements emerge, particularly regarding the timeline of events leading up to the discovery of Eleanor's body. Vane notes the discrepancies, particularly regarding Captain Hale's alibi.",
    "beat": "crime",
    "estimatedWordCount": 1800,
    "pivotElement": "Witnesses report hearing a loud noise right before finding the body.",
    "factEstablished": "Establishes that the witnesses heard a noise that contradicts the timeline of the murder.",
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
        "characterName": "Sylvia Trent",
        "behaviour": "Show normal social behaviour; grief or confusion if appropriate."
      },
      {
        "characterName": "Hugo Vane",
        "behaviour": "Show normal social behaviour; grief or confusion if appropriate."
      }
    ],
    "redHerringPlacement": null,
    "emotionalRegister": "Initial investigations raise suspicions and unveil hidden truths.",
    "dominantCharacterNote": {
      "name": "Eleanor Voss",
      "voiceRegister": "Eleanor speaks with a warm, inviting tone, often punctuating her sentences with a soft laugh, masking her underlying tension with a veneer of grace."
    },
    "humourGuidance": {
      "permission": "permitted",
      "character": "Dr. Mallory Finch",
      "form": "dry_wit"
    },
    "eraTextureNote": "Rationing of goods limits access to basic supplies.; Communication is hampered by the recent war, with many services still in disarray.; Travel is restricted due to fuel shortages and economic limitations.",
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
□ Chapter 2: the clue [clue_core_contradiction_chain] (witnesses, reported, hearing, loud, noise, right, before, finding, eleanor, body) is placed in the first 25% of the chapter, dramatized in your own words, followed by an explicit inference or suspicion paragraph.
□ Chapter 2: the clue [clue_early_1] (murder, eleanor, voss, concealed, gramophone, recording, created, false, alibi, captain, hale) is placed in the first 25% of the chapter, dramatized in your own words, followed by an explicit inference or suspicion paragraph.
□ Chapter 2: the clue [clue_late_1] (suggests, noise, likely, masked, gramophone) is placed in the first 25% of the chapter, dramatized in your own words, followed by an explicit inference or suspicion paragraph.
□ First chapter in this batch opens by continuing the previous chapter closing beat (same unresolved object, question, movement, or emotional pressure).
□ For every chapter after Chapter 1, include at least one NEW character pressure reveal (fear, motive, lie, loyalty conflict, or victim relationship).
□ Each post-Chapter-1 character reveal changes investigation state (more/less suspicious, lie explained, motive exposed, emotional cost deepened, or investigator understanding updated).
□ No post-Chapter-1 chapter contains static biography-only character paragraphs.
□ Mode check (Clue Reinterpretation): chapter states prior clue meaning and revised meaning with explicit theory change.
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
Goal: resolve every listed issue for chapter(s) 2 in this one retry.
Retry mode: FULL_REBUILD.
Attempt context: 3/3 | primary class: fair_play.
Why this mode: final-attempt or hard mitigation triggered.

SOURCE OF TRUTH
- Do not preserve sentence structure from the failed draft; use the scene instructions and hard constraints as the source of truth.
- Hard constraints outrank the previous draft: cast/pronoun lock, locked facts, clue obligations, stage-mode rules, and chapter JSON shape.

PRIMARY FAILURES
- Chapter 2: the concealment mechanism is explained before the discriminating-test scene. Plant the physical clue (name the object/observation), but do NOT reveal HOW the trick worked — withhold the method/causal explanation until the discriminating-test scene or the final reveal.

REWRITE PLAN
- Treat the scene instructions, cast lock, clue obligations, and locked facts as the source of truth; do not preserve failing wording from the previous draft.
- Rewrite any paragraph touched by a failing issue as a fresh paragraph rather than patching a single sentence.

SUCCESS CHECKLIST
- Every listed issue below is resolved in this single attempt before you answer.
- Primary failure class cleared: fair_play.
- The revised chapter reads as a clean rewrite of the failing parts, not a lightly patched copy of the rejected draft.

OUTPUT RULES
- Return complete corrected JSON for chapter(s) 2 only.
- Do not explain what you changed.
- Do not leave one issue unresolved while fixing another.
- If two instructions conflict, prefer the one that clears the validator and preserves story logic.

TERMINAL RETRY EXECUTION MODE
Scope: chapter(s) 2
Attempt: 3/3 | class: fair_play
Objective: resolve every active validator error in a single pass.
Use failed draft as negative example only. Do not preserve its sentence structures.

ACTIVE ERRORS TO CLEAR
- Chapter 2: the concealment mechanism is explained before the discriminating-test scene. Plant the physical clue (name the object/observation), but do NOT reveal HOW the trick worked — withhold the method/causal explanation until the discriminating-test scene or the final reveal.

PACKET MUST-FIX ITEMS
- Resolve fair_play issues before accepting this batch.
- Chapter 2: the concealment mechanism is explained before the discriminating-test scene. Plant the physical clue (name the object/observation), but do NOT reveal HOW the trick worked — withhold the method/causal explanation until the discriminating-test scene or the final reveal.

EXECUTION RULES
- Solve all listed errors together; do not optimize one and regress another.
- Keep cast/pronoun lock, locked facts, clue obligations, and stage-mode outcome consistent.
- Return complete corrected JSON for the target chapter batch only.
- No commentary or explanation outside JSON.

FINAL PRE-SUBMIT CHECK
- Verify every item in ACTIVE ERRORS TO CLEAR is resolved in the returned JSON.
- If any listed error remains unresolved, revise before returning.

RETRY CLASS: fair_play
ATTEMPT: 2/3
MANDATORY FIXES:
- Resolve fair_play issues before accepting this batch.
- Chapter 2: the concealment mechanism is explained before the discriminating-test scene. Plant the physical clue (name the object/observation), but do NOT reveal HOW the trick worked — withhold the method/causal explanation until the discriminating-test scene or the final reveal.
MITIGATION MODE: tighten_obligation
```
