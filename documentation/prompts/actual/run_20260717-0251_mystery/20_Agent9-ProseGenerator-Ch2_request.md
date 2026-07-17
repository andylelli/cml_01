# Actual Prompt Record

- Run ID: `mystery-1784256689298`
- Project ID: ``
- Timestamp: `2026-07-17T02:58:26.797Z`
- Agent: `Agent9-ProseGenerator-Ch2`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4.1`
- Temperature: `0.42`
- Max Tokens: `4500`
- Attempt: `first`
- Prompt Hash: `c24d99bd8cdf30ac`

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
- MORAL COMPLEXITY REQUIREMENT: The mechanism of this crime carries a moral gray area: "The culprit's actions stem from a desperate need to protect their family's legacy, raising questions about justifiable motives." — the culprit reveal and denouement MUST acknowledge this ambiguity. Do not let the ending feel clean or simple. Give the reader at least one moment of uncomfortable sympathy or moral doubt.

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
   - Dr. Mallory Finch: Professional Rival
   - Captain Ivor Hale: Mysterious Outsider
   - Beatrice Quill: Ambitious Employee
   - Sylvia Trent: Caring Authority
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

- Dr. Mallory Finch
  Public identity anchor: Psychiatrist; suspect 
  Connection to victim: Hugo Vane (friend).
  Investigation relevance: access plausibility: medium | alibi window: 9 PM to 10 PM | opportunity channel: Access to medical supplies.
  Suspicion/pressure cue seed: Reputation and career..
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

## Era: February 1945
In February 1945, the world teeters on the edge of monumental change as the shadows of World War II loom heavily. Coastal towns like Brighton, where The Crestview Hotel is situated, feel the chill of winter, both in weather and in the hearts of its inhabitants. Overcast skies and intermittent rain create a somber backdrop as rationing continues to weigh on daily life. The streets, though bustling with activity, carry whispers of anxiety among locals adjusting to post-war realities. Valentine's Day approaches, yet the specter of loss and uncertainty dampens spirits, complicating even the simplest expressions of affection. Amid fleeting moments of joy, such as indoor dances or café gatherings, lies an undercurrent of tension as society begins to grapple with changing gender roles and the return of veterans, all while the world watches the emergence of the Cold War.
Emotional register: A prevailing sense of anxiety and anticipation, mixed with fleeting moments of hope.
Physical constraints: Post-war rationing limits access to goods and services | Travel remains restricted due to fuel rationing and damaged infrastructure | Communication is hindered by wartime disruptions and shortages
Current tensions (weave into background texture): Yalta Conference discussions shaping post-war Europe | Increasing conflict in the Pacific as military strategies evolve | Emerging civil rights discussions amidst a backdrop of racial tensions
Wartime context — Many men are returning from military service, grappling with their experiences.: Women are beginning to take on roles traditionally held by men, leading to shifting dynamics. Absence effect: The absence of many fathers or husbands creates a void in many families, complicating relationships.

## Season Lock (mandatory — derived from February 1945)
Season: winter. Allowed vocabulary: winter, wintry, midwinter
Forbidden seasonal words — never use in narration, dialogue, or metaphor: spring, summer, autumn and their adjectival forms.
Every weather description, atmosphere, and time-of-year reference must be consistent with winter.

## Story Theme
The story explores the complexities of truth and deception, revealing how personal motives and past actions intertwine to shape one's destiny, and reveals that evidence carries ethical weight, forcing characters to choose accountability over social performance when appearances and facts collide.

## Story Emotional Register
Dominant: The emotional journey is one of tension and revelation, weaving through themes of truth and deception.

Arc:
The story opens with a palpable tension at The Crestview Hotel, where the drowning of guest Hugo Vane casts a long shadow over the elegant Art Deco space. As Eleanor Voss arrives, her instincts tell her that this is no simple tragedy; the weight of the initial crime hangs heavily, creating an atmosphere thick with suspicion. The investigation begins in earnest, revealing conflicting witness accounts and the chilling realization that there is more to Vane's death than meets the eye. Each clue uncovered adds layers to the complexity of the case, while the emotional toll on Eleanor mounts as she grapples with her self-doubt and the haunting echoes of her past.

A pivotal moment occurs when the discrepancies in the tide chart come to light, forcing Eleanor to reconsider everything she thought she knew about the timeline of events. This revelation shifts the course of her investigation and confronts her with the uncomfortable truth that some secrets are buried deeper than others. As the investigation reaches its climax, the pressure intensifies, culminating in a confrontation that lays bare the intricacies of ambition, jealousy, and the desperate need for truth. In the end, each character pays a price for their secrets, and Eleanor must confront the personal cost of her pursuit of justice, recognizing that the truth often leaves scars that cannot be seen.

## Emotional register at this point in the story
The story begins with a sense of foreboding, as the atmosphere of the hotel feels charged with tension.

## Character Portraits (appearance & era)

### Eleanor Voss
Eleanor Voss embodies the spirit of resilience in a world grappling with the aftermath of war. As a sharp-witted journalist, she navigates the complexities of truth, struggling with self-doubt amid societal expectations. Her investigative pursuits are not only a testament to her ambition but also a means of safeguarding her community's reputation during turbulent times.
Era intersection: Eleanor's commitment to uncovering the truth reflects the broader societal shifts, where women increasingly step into roles of authority and influence.

### Dr. Mallory Finch
Dr. Mallory Finch finds herself at a crossroads, torn between professional ambition and the shadows of rivalry. In a post-war world, her struggles with reputation and anxiety mirror the broader tension faced by women seeking to reclaim their identities in a changing society.
Era intersection: Her journey highlights the pressures women face as they navigate professional landscapes previously dominated by men.

### Captain Ivor Hale
Captain Ivor Hale is a relic of a bygone era, his charm concealing guilt from his past actions during the war. As he grapples with the fear of exposure, his character reflects the complexities of male identity in a post-war society marked by shifting perceptions of honor and duty.
Era intersection: Hale's internal conflict illustrates the lingering effects of wartime experiences on personal reputations and relationships.

### Beatrice Quill
Beatrice Quill represents the ambitious young women of the era, navigating the delicate balance between personal desires and societal expectations. As she grapples with jealousy and ambition, her character reflects the struggles many women face in their quest for fulfillment amid changing gender roles.
Era intersection: Her story underscores the complexities of ambition in a world where women are beginning to assert their independence.

### Sylvia Trent
Sylvia Trent is a dedicated hotel manager who embodies the pressures of maintaining stability in a time of uncertainty. As she navigates financial troubles and the implications of the victim's death, her character reflects the broader struggles faced by women balancing professional responsibilities with societal expectations.
Era intersection: Her internal conflict highlights the challenges of women stepping into leadership roles while grappling with the consequences of their choices.

## Character Voices

### Eleanor Voss (she/her/her)
Eleanor Voss speaks with a confident cadence, her voice often laced with dry wit reflecting her journalistic background.
[comfortable] You know what they say, the pen is mightier than the sword. I suppose I should wield it carefully.
[evasive] Oh, I wouldn't want to jump to conclusions. After all, assumptions can lead us astray, can't they?
[stressed] Every moment feels like a step closer to the truth, but what if the truth is too dangerous to uncover?
Humour: Eleanor's dry wit adds a layer of complexity to her interactions, reflecting her keen observational skills.

### Dr. Mallory Finch (she/her/her)
Dr. Finch's voice carries an authoritative tone, often layered with a polite edge that belies her true feelings.
[comfortable] Ah, the tangled web of human emotion. It never ceases to amaze me.
[evasive] Well, it's important to consider all perspectives before making a judgment, wouldn't you agree?
[stressed] It's just that the pressure to maintain my reputation feels insurmountable at times.
Humour: Dr. Finch often employs polite savagery, turning compliments into subtle jabs that reveal her competitive edge.

### Captain Ivor Hale (he/him/his)
Captain Hale's speech is smooth and confident, often punctuated with sardonic humor from his naval background.
[comfortable] Ahoy, matey! Life’s a tempest, isn’t it? We must navigate it with care.
[evasive] Oh, I assure you, my past is just that—past. No need to dredge it up.
[stressed] The thought of exposure terrifies me; the storm may be upon us.
Humour: His sardonic humor provides a layer of charm, even as he grapples with his own guilt.

### Beatrice Quill (she/her/her)
Beatrice’s voice is quick and nervous, often stumbling over her words when she feels the pressure of the moment.
[comfortable] Well, that’s just my luck, isn’t it? I always seem to trip at the worst times.
[evasive] I-I wasn't aware of any...um, complications. Just doing my job, really.
[stressed] What if they find out? I can’t bear to think of losing everything I’ve worked for!
Humour: Beatrice often uses self-deprecating humor to mask her insecurities and navigate tense situations.

### Sylvia Trent (she/her/her)
Sylvia speaks with a calm, measured tone, often using precise language to articulate her thoughts.
[comfortable] Well, that’s a curious situation, isn’t it? We must handle it delicately.
[evasive] I believe it’s best to stick to the facts, nothing more.
[stressed] The pressure is mounting, and I fear for the stability of our hotel.
Humour: Her observational humor provides insight into the absurdities of her environment.

## Location Registers (scene framing guides)

The Seaside Lounge: The Seaside Lounge is filled with an oppressive sense of foreboding, where the shadows seem to whisper secrets of the past. The atmosphere is thick with tension, as guests navigate their murky thoughts, each glance around the dimly lit room heavy with suspicion.. Camera angle: A writer entering this space should feel the weight of the secrets hidden within its walls, as if each character carries a burden that could unravel at any moment.. Era: The murky waters of crime and deception reflect the broader societal anxieties of the 1940s.

The Hotel Kitchen: The hotel kitchen buzzes with energy, yet an undercurrent of anxiety permeates the air. Amid the sounds of clattering pots and laughter, the tension of recent events hangs, reminding the staff that the façade of normalcy is thin.. Camera angle: A writer should capture the contrast between the kitchen's vibrant chaos and the simmering unease, as every interaction reveals the fragility of trust.. Era: The pressures of wartime rationing create a sense of urgency and resourcefulness in this bustling environment.

The Rooftop Terrace: The Rooftop Terrace offers a breathtaking yet foreboding view of the turbulent sea, where winds howl and waves crash violently against the cliffs. The air is thick with the scent of rain and salt, evoking a sense of isolation that mirrors the characters' internal struggles.. Camera angle: A writer should evoke the feeling of desolation and introspection, as characters confront their choices against the backdrop of nature's fury.. Era: The terrace's restricted access after dark enhances the mystery surrounding the events at the hotel.

The Grand Staircase: The Grand Staircase serves as a pathway of tension, where whispers echo and footsteps resonate with the weight of secrets. The polished wood shines under dim light, yet the shadows cast by the guests hint at the unspoken truths lurking just out of sight.. Camera angle: A writer should focus on the elegance juxtaposed with the tension, capturing the interactions that unfold in this critical artery of the hotel.. Era: This transitional space reflects the elegance of the 1940s while serving as a reminder of the darker currents running through the hotel's corridors.

## Humour guidance for this story position (opening)
Permission: forbidden
Rationale: The opening scene must maintain a serious tone to establish the atmosphere of the murder.

FAIR-PLAY AND INFERENCE CONTRACT:
- FAIR PLAY CLUE TIMING: Never combine clue discovery and detective deduction in the same chapter. If a clue is first revealed to the reader in chapter N, the detective may only analyze, deduce from, or act on that clue in chapter N+1 or later.
- FAIR PLAY INFORMATION PARITY: The reader must see all clues BEFORE the detective uses them in reasoning. If the detective performs a test or makes a deduction, every piece of evidence supporting that conclusion must have been shown to the reader in earlier chapters.
- FAIR PLAY REVELATION SPACING: In the discriminating test scene, the detective can ONLY use clues that were revealed to the reader at least 1 full chapter earlier. Never introduce new clues or withheld information during the test.
- FAIR PLAY CONFRONTATION: During the final confrontation/revelation, the detective cannot surprise the reader with facts. Every piece of evidence cited must have been visible to the reader in prior chapters.
- Never solve by withheld information. Keep reader-information parity with detective reasoning.
- False assumption in force: Hugo Vane drowned during high tide.
- Hidden truth to progressively expose (compose in your own words from these elements): tide, actually, lowest, point, victim, last, seen
- Inference path checkpoints to dramatize clearly — compose ENTIRELY in your own sentences from these key terms (reproducing any briefing phrase verbatim FAILS validation):
  - Step 1: obs: tide, chart, indicates | corr: contradicts, claim, hugo, drowned, high, tide | effect: narrows, investigation, focus, away, captain, hale
  - Step 2: obs: witnesses, report, conflicting, times, event | corr: inconsistencies, witness, accounts, suggest, misinterpretation, timing | effect: eliminates, mallory, finch, suspect, verified, alibi
  - Step 3: obs: footprints, lead, beach, signs, struggle | corr: absence, struggle, indicates, victim, lured, trapped | effect: points, towards, beatrice, quill, involvement
- Discriminating test method: trap
- Discriminating test elements to dramatize (compose ENTIRELY in your own sentences from these — do NOT reproduce any briefing phrase verbatim): tide, chart, witness, accounts, reveals, inconsistencies
- Test must rely on already-shown clue IDs: clue_4, clue_10, clue_11
- Fair-play rationale: Step 1: The tide chart shows low tide before the drowning, allowing readers to question the timeline. Step 2: Witness inconsistencies eliminate Dr. Finch as a suspect. Step 3: The footprints lead to Beatrice's involvement, confirmed by the discriminating test.

## Character Reference

### Eleanor Voss (she/her — NEVER he/him)
Eleanor speaks with a confident cadence, often punctuating her points with biting remarks
She has a habit of raising an eyebrow when skeptical, and her tone shifts from journalistic detachment to passionate conviction when discussing injustice.
Eleanor grapples with the fear that her investigative pursuits might lead to her ostracization from the very community she seeks to protect, particularly if her suspicions about the hotel’s dealings are proven true.
Voice colour: Eleanor Voss uses dry wit humour — let it surface in their dialogue where natural, not in every line.

### Dr. Mallory Finch (she/her — NEVER he/him)
Finch speaks with an air of authority, her words carefully chosen and often laced with a biting edge
She has a tendency to punctuate her sentences with a slight smile that belies her true feelings, and her laughter can be both charming and chilling.
Dr. Finch is torn between her professional ambition and the gnawing resentment she feels towards the victim, leading her to question whether she is capable of true compassion or merely driven by envy.
Voice colour: Dr. Mallory Finch uses polite savagery humour — let it surface in their dialogue where natural, not in every line.

### Captain Ivor Hale (he/him — NEVER she/her)
Captain Hale speaks with a smooth, confident tone, often punctuating his sentences with a sardonic twist
He has a habit of using nautical metaphors, drawing on his naval background, and his laughter can be both warm and unsettling.
Captain Hale is haunted by the shadows of his past, wrestling with the guilt of his wartime actions while desperately trying to maintain the façade of an honorable man.
Voice colour: Captain Ivor Hale uses sardonic humour — let it surface in their dialogue where natural, not in every line.

### Beatrice Quill (she/her — NEVER he/him)
Beatrice speaks quickly, often stumbling over her words when nervous
She has a tendency to laugh at her own misfortunes, using self-deprecating humor to deflect attention from her insecurities.
Beatrice struggles with the realization that her ambition may have led her to make choices that could cost her everything, including her dignity.

### Sylvia Trent (she/her — NEVER he/him)
Sylvia speaks with a calm and measured tone, often using precise language to convey her thoughts
She has a habit of pausing to collect her thoughts before responding, and her observational humor often reveals the absurdities of the situations she encounters.
Sylvia is torn between her professional responsibilities and the fear that her financial troubles will come to light, threatening her position and sense of self-worth.
Voice colour: Sylvia Trent uses observational humour — let it surface in their dialogue where natural, not in every line.


## CHARACTER CONTRACTS (binding for this scene)
Each entry below constrains how this character must be written in this chapter.
These override generic style guidance when they conflict.

### Eleanor Voss[SHE]
Voice & mannerisms: Eleanor speaks with a confident cadence, often punctuating her points with biting remarks. She has a habit of raising an eyebrow when skeptical, and her tone shifts from journalistic detachment to passionate conviction when discussing injustice.
SIGNATURE TIC (use sparingly — this is Eleanor Voss's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "You know what they say, the pen is mightier than the sword."
Sample voice fragments (match this register and rhythm):
  [comfortable] "You know what they say, the pen is mightier than the sword. I suppose I should wield it carefully."
  [evasive] "Oh, I wouldn't want to jump to conclusions. After all, assumptions can lead us astray, can't they?"
Humour: dry wit — deploy occasionally (level 0.5)
FORBIDDEN phrase (never write for Eleanor Voss): "a surge of determination washed over her"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "N/A" — do not surface in Act I.

### Dr. Mallory Finch[SHE]
Voice & mannerisms: Dr. Finch speaks with an air of authority, her words carefully chosen and often laced with a biting edge. She has a tendency to punctuate her sentences with a slight smile that belies her true feelings, and her laughter can be both charming and chilling.
SIGNATURE TIC (use sparingly — this is Dr. Mallory Finch's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "Ah, the tangled web of human emotion."
Sample voice fragments (match this register and rhythm):
  [comfortable] "Ah, the tangled web of human emotion. It never ceases to amaze me."
  [evasive] "Well, it's important to consider all perspectives before making a judgment, wouldn't you agree?"
Humour: polite savagery — deploy occasionally (level 0.4)
FORBIDDEN phrase (never write for Dr. Mallory Finch): "she felt a wave of unease"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Resentment over the victim’s supposed sabotage of her career." — do not surface in Act I.

### Captain Ivor Hale[HE]
Voice & mannerisms: Captain Hale speaks with a smooth, confident tone, often punctuating his sentences with a sardonic twist. He has a habit of using nautical metaphors, drawing on his naval background, and his laughter can be both warm and unsettling.
SIGNATURE TIC (use sparingly — this is Captain Ivor Hale's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "Ahoy, matey, life’s a tempest, isn't it?"
Sample voice fragments (match this register and rhythm):
  [comfortable] "Ahoy, matey! Life’s a tempest, isn’t it? We must navigate it with care."
  [evasive] "Oh, I assure you, my past is just that—past. No need to dredge it up."
Humour: sardonic — deploy occasionally (level 0.6)
FORBIDDEN phrase (never write for Captain Ivor Hale): "palpable tension filled the room"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Fear of exposure and loss of reputation." — do not surface in Act I.

### Beatrice Quill[SHE]
Voice & mannerisms: Beatrice speaks quickly, often stumbling over her words when nervous. She has a tendency to laugh at her own misfortunes, using self-deprecating humor to deflect attention from her insecurities.
SIGNATURE TIC (use sparingly — this is Beatrice Quill's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "Well, that’s just my luck, isn’t it?"
Sample voice fragments (match this register and rhythm):
  [comfortable] "Well, that’s just my luck, isn’t it? I always seem to trip at the worst times."
  [evasive] "I-I wasn't aware of any...um, complications. Just doing my job, really."
Humour: self deprecating — deploy rarely (level 0.3)
FORBIDDEN phrase (never write for Beatrice Quill): "she knew with certainty she was right"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Jealousy over the victim’s decision to end their relationship." — do not surface in Act I.

### Sylvia Trent[SHE]
Voice & mannerisms: Sylvia speaks with a calm and measured tone, often using precise language to convey her thoughts. She has a habit of pausing to collect her thoughts before responding, and her observational humor often reveals the absurdities of the situations she encounters.
SIGNATURE TIC (use sparingly — this is Sylvia Trent's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "Well, that’s a curious situation, isn’t it?"
Sample voice fragments (match this register and rhythm):
  [comfortable] "Well, that’s a curious situation, isn’t it? We must handle it delicately."
  [evasive] "I believe it’s best to stick to the facts, nothing more."
Humour: observational — deploy occasionally (level 0.4)
FORBIDDEN phrase (never write for Sylvia Trent): "everyone could sense the atmosphere"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Panic over the victim threatening to call in the loan." — do not surface in Act I.



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
An elegant seaside hotel steeped in mystery, where the echoes of the past linger amidst its Art Deco charm.

Key Locations Available:
- The Seaside Lounge (interior): Crime scene
- The Hotel Kitchen (interior): Clue discovery
- The Rooftop Terrace (exterior): Gathering space
- The Grand Staircase (interior): Transitional space

Atmosphere (tonal cue only — do NOT reproduce this phrase verbatim in prose; translate into scene-specific, character-observed sensory language): tension-filled due to recent events at the hotel
Weather: overcast with occasional rain, typical for coastal climates

Era markers: Art Deco architecture | early radio broadcasts in the lobby | rationed fuel for automobiles and limited transportation

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
The Seaside Lounge (interior):
  - Visual: dark velvet curtains drawn tightly, shimmering glassware on polished tables, shadows flickering against the walls
  - Sounds: muffled voices from the bar, clinking of glasses, distant thunder rumbling
  - Scents: old whiskey and cigar smoke, scent of sea brine, faint floral notes from the arrangements
  - Touch: smooth glass surfaces, soft upholstery under fingertips

The Hotel Kitchen (interior):
  - Visual: steam rising from pots on the stove, shiny surfaces of gleaming utensils, colorful jars lining the shelves
  - Sounds: clattering pots and pans, the hiss of frying food, laughter and chatter of staff
  - Scents: sizzling onions and garlic, freshly baked bread, the tang of vinegar and spices
  - Touch: smooth stainless steel countertops, warmth of the oven's heat

The Rooftop Terrace (exterior):
  - Visual: rolling waves crashing against cliffs, dark clouds hanging low in the sky, flickering lights from distant boats
  - Sounds: howling wind whipping through railings, waves crashing below, distant calls of seabirds
  - Scents: fresh sea air mixed with rain, the scent of damp earth, salty tang of the ocean
  - Touch: cool metal of the railings, rough texture of stone tiles

⛔ REFERENCE DATA — DO NOT TRANSCRIBE VERBATIM: The above profiles are structural guides only. Generate original prose that evokes these qualities; do not reproduce the exact phrasing or sentence structure of the profile paragraphs.

SCENE OPENING RULE: When opening a scene in a new location, write what the POV character directly observes and physically senses at that moment — not a general description of the room's qualities. The reader must feel present,
[truncated for prompt budget]

## Texture Pool
Draw on these as opportunities arise — you are not required to use them.

- In February 1945, the world teeters on the edge of monumental change as the shadows of World War II loom heavily
- Coastal towns like Brighton, where The Crestview Hotel is situated, feel the chill of winter, both in weather and in the hearts of its inhabitants
- Overcast skies and intermittent rain create a somber backdrop as rationing continues to weigh on daily life
- The streets, though bustling with activity, carry whispers of anxiety among locals adjusting to post-war realities
- Valentine's Day approaches, yet the specter of loss and uncertainty dampens spirits, complicating even the simplest expressions of affection

TEMPORAL CONTEXT:

This story takes place in February 1945 during winter.

Seasonal Atmosphere:
- Weather patterns: overcast skies with occasional rain showers, cool breezes from the nearby coast, chilly temperatures averaging around 35°F (2°C)
- Daylight: Short winter days with twilight setting in by five o'clock in the afternoon, leaving a lingering sense of darkness.
- Seasonal activities: Indoor gatherings and dances at local hotels, Engagements and romantic dinners on Valentine's Day, Coastal walks despite the chill, with locals bundled up
- Seasonal occasions: Valentine's Day
- Season: winter

Period Fashion (describe naturally):
- Men formal: dark wool suits with wide lapels, double-breasted blazers in navy or charcoal, crisp white dress shirts with patterned ties
- Men casual: tweed jackets with elbow patches, flannel trousers, corduroy caps
- Men accessories: fedora hats, leather gloves, wool scarves
- Women formal: tea-length dresses with cinched waists and flared skirts, satin evening gowns adorned with beading, tailored jackets with shoulder pads
- Women casual: knitted sweaters paired with A-line skirts, button-up blouses tucked into high-waisted skirts, wool cardigans
- Women accessories: perched hats adorned with veils, string pearls, leather handbags

Cultural Context (reference naturally):
- Music/entertainment: Bing Crosby's 'White Christmas', The Andrews Sisters with their upbeat harmonies, Jazz music gaining traction in urban centers; Films: The Lost Weekend (1945), Mildred Pierce (1945); Theatre: The Glass Menagerie by Tennessee Williams, capturing audience emotions, Oklahoma! continues to draw crowds with its vibrant story and music; Radio: The Jack Benny Program providing comedic relief, Suspense dramas enthralling listeners every week
- Typical prices: Loaf of bread: four pence, A pint of milk: three pence, Movie ticket: one shilling
- Current events: Yalta Conference taking place this month, shaping post-war Europe; Intensifying conflict in the Pacific as the United States prepares for the assault on Iwo Jima
- Literature: The Catcher in the Rye (published in 1951, but gaining attention in literary circles) | A Tree Grows in Brooklyn by Betty Smith (1943) | Animal Farm by George Orwell (1945) | [detective fiction due to the rise of hard-boiled novels] | [romantic novels reflecting post-war love stories] | [social realism capturing the struggles of everyday life]
- Technology: The first electronic computer, the ENIAC, being developed | Advancements in radar technology aiding military efforts | Early experiments in jet propulsion changing aviation | Radios dominating households for news and entertainment | Emerging use of early televisions in urban areas | Cigarette lighters becoming a common accessory
- Daily life: Attending dances and social events at local hotels, Gathering at cafes for coffee and conversation, Visiting the cinema for the latest films
- Social rituals: Sunday family dinners becoming a cherished tradition, Valentine's Day celebrations with gift exchanges, Frequent gatherings for card games or bingo

Atmospheric Details:
The smell of damp earth lingers in the air, mingling with the faint scent of salt from the ocean. The distant sound of crashing waves creates a rhythmic backdrop to the tense whispers in the hotel lobby. Flickering lights from the lounge cast shadows on th
[truncated for prompt budget]

NON-NEGOTIABLE CHAPTER OBLIGATIONS — LOCKED EVIDENCE VALUES (VERBATIM REQUIRED):
The following measured values (times, amounts, measurements) are absolute ground truth. Every time this chapter describes, mentions, or alludes to one — no matter how briefly — it MUST use the exact phrase shown below, character for character. NO paraphrase, approximation, rounding, or synonym is permitted.

FAILURE EXAMPLE: if the locked value is "at thirteen minutes to midnight" and you write "just before midnight" or "around midnight" — that is a HARD FAIL. You must write "at thirteen minutes to midnight". Equally, if the locked value is written in words, such as "ten minutes past eleven", and you convert it to figure-based clock notation — that is also a HARD FAIL. Words stay as words; figure forms are forbidden for word-phrased facts.

CRITICAL — WORD-PHRASED VALUES: If the canonical value is written out in words (e.g. a time like "ten minutes past eleven", or an amount like "forty minutes"), reproduce those exact words. DO NOT convert to figure-based time notation, twenty-four-hour format, or any other numeric shorthand. Correct: "ten minutes past eleven". WRONG: figure-based clock notation or numeric shorthand.

Locked values:
  - The tide was at its lowest point.: "ten minutes past nine"
    ⛔ FORBIDDEN alternatives: "9:10", "9.10", "nine ten", "nine-ten", "nine past ten", "quarter past nine", "half past nine" — the ONLY acceptable form is "ten minutes past nine"
  - The victim was last seen at this time.: "a quarter to ten"
  - Witnesses report the hotel clock showing this time.: "half past nine at night"

If a value has no relevance to this chapter, omit it. But the moment you reference the underlying evidence, only the exact phrase above is acceptable.

⛔ CLUES TO SURFACE IN THESE CHAPTERS — mandatory:
The following evidence MUST be clearly observable to an attentive reader. Do not bury it in atmosphere or passing dialogue. Each clue must be concrete, specific, and noticeable:

• [clue_core_contradiction_chain] contradicts, claim, hugo, drowned, high, tide
  Category: testimonial | Criticality: essential | Supports inference step 1
  Points to: claim, time, drowning, false

• [clue_3] witnesses, report, conflicting, times, event
  Category: temporal | Criticality: essential | Supports inference step 2
  Points to: timeline, events, unclear

• [clue_4] inconsistencies, witness, accounts, suggest, misinterpretation, timing
  Category: testimonial | Criticality: essential | Supports inference step 2
  Points to: witness, accounts, cannot, trusted

For each clue above: an attentive reader should be able to find, record, and later use it to reason toward the solution.

═══ NARRATIVE STATE (read-only — do not contradict) ═══

LOCKED FACTS — use verbatim whenever this evidence is described:
  • The tide was at its lowest point.: "ten minutes past nine"
  • The victim was last seen at this time.: "a quarter to ten"
  • Witnesses report the hotel clock showing this time.: "half past nine at night"

CHARACTER PRONOUNS — never deviate from these:
  • Eleanor Voss: she/her/her
  • Dr. Mallory Finch: she/her/her
  • Captain Ivor Hale: he/him/his
  • Beatrice Quill: she/her/her
  • Sylvia Trent: she/her/her
  • Hugo Vane: he/him/his

CLUES ALREADY REVEALED TO READER: clue_mechanism_visibility_core, clue_9, clue_id_2 — do not reveal these as new information.

INVESTIGATION LOG — WHAT IS ESTABLISHED (do not re-establish, do not repeat):
• Evidence already established (reference only — do NOT restate or quote these; advance beyond them): victim, drowning, scenario, impossible | victim, drowning, scenario, impossible | timeline, events, unclear
• Suspects still unresolved: Dr. Mallory Finch[SHE], Captain Ivor Hale[HE], Sylvia Trent[SHE]
⚠ The story must move FORWARD from this log. Any beat already listed above is forbidden from repeating.

⚠ THIS CHAPTER'S REQUIRED ADVANCE (opening): Discover the body, confirm the victim, establish the scene. The victim is found dead. They do not speak, react, or gesture. This is their only physical appearance — in all subsequent chapters they exist only in past tense (memory, evidence, testimony).

CONTINUITY HANDOFF — previous chapter closing beat:
  • "Eleanor surveyed the scene one last time—the body, the tide chart, the anxious faces of those gathered. The contradictions refused to resolve, and the wintry morning seemed to press in closer, as if the world itself conspired to keep its secrets. She squared h..."
  • The next chapter must open as a continuation of this beat, not as a disconnected reset.
═══════════════════════════════════════════════════════

═══════════════════════════════════════════════════════════
📚 CONTINUITY CONTEXT - CHARACTER & SETTING CONSISTENCY
═══════════════════════════════════════════════════════════

**CRITICAL: You are writing chapters 2+. Maintain consistency with earlier chapters.**

**Character Names Used in Chapters 1-1:**
Eleanor Voss, Captain Ivor Hale, Beatrice Quill, Sylvia Trent, Hugo Vane

✓ RULE: Use EXACTLY these names. Do NOT vary spelling, add titles, or introduce new forms.
✓ Example: if earlier chapters used "Clara Whitfield", keep using "Clara Whitfield" — never "Mrs. Whitfield" unless that is the character's canonical name in the list above.

**Setting Vocabulary Established in Earlier Chapters:**
corridor, lounge, flat

✓ RULE: Continue using this location vocabulary. Maintain consistency with established setting type.
✓ Do NOT introduce new location types that contradict earlier chapters.

**Recent Chapter Summary (for narrative continuity):**
Chapter 1: Chapter 1: The Tide at Dawn
  Events: Eleanor forced herself forward, boots crunching over the rough pebbles, her breath clouding before her.

⚠️ **VALIDATION:** Character name mismatches and setting drift are common failure modes.
Double-check every character name against the list above before using it.

**⏱ LOCKED TIME ANCHOR — use verbatim, do not paraphrase:**
Clock time (from the case ground truth): **"Tide chart showing low tide"**
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
Known location profile anchors: The Crestview Hotel, The Seaside Lounge, The Hotel Kitchen, The Rooftop Terrace, The Grand Staircase, the beach, near the water's edge
LOCATION NAME CAPITALISATION (HARD REQUIREMENT — validated):
All named locations in your prose MUST use the EXACT capitalisation from the CML profiles.
Canonical forms: "The Crestview Hotel", "The Seaside Lounge", "The Hotel Kitchen", "The Rooftop Terrace", "The Grand Staircase", "the beach, near the water's edge"
Writing a location in lowercase (e.g. "drawing room" instead of "Drawing Room") is a validated error. Every time you mention a named location, copy its capitalisation from the list above.
- Chapter 2: OPENING STYLE (HARD): Start the VERY FIRST SENTENCE with spoken dialogue — e.g. '"[words]," [Name] said/asked/replied/murmured.' The opening quote must be the first character on the line. Anchor opening in "the beach, near the water's edge". The opening style above governs only your FIRST SENTENCE; the grounding below may land anywhere in the first 2 paragraphs (it need not be sentence one, and never conflicts with the chosen opening style). HARD REQUIREMENT for the first 2 paragraphs: (a) include 2+ sensory words — choose from smell/scent/odor/fragrance/sound/echo/silence/whisper/creak/cold/warm/damp/rough/smooth/glow/shadow/flicker/dim — and (b) include 1+ atmosphere/time word — choose from rain/wind/fog/storm/mist/thunder/evening/morning/night/dawn/dusk/lighting/weather/season/afternoon/midday/noon/midnight/twilight/sunrise/sunset/daylight/sunlight/overcast/cloudy/bright/dark/grey/pale/chill/crisp/drizzle/haze/lamplight/firelight. These are validated requirements, not style suggestions; missing them triggers a retry.

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

PROMPT BUDGET SUMMARY: budget=24000 tokens; fixed=10046; context=13178; dropped=[none]; truncated=[location_profiles, temporal_context, pronoun_accuracy]

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
4. Integrate at least two concrete era-grounded details per chapter from setting refinement signals: radio | early television | code-breaking devices | long-distance telephone calls | military encryption for sensitive messages | post-WWII trauma.
5. Respect setting movement/access constraints in scene action and alibis: narrow hallways restrict movement | oceanfront access limited by private beach | balconies overlooking the sea create visibility limitations | staff-only areas in the kitchen and maintenance rooms | restricted access to the rooftop terrace after dark.
6. Sustain social coherence with this backdrop pressure: The recent drowning of a guest at the hotel ignites tensions among staff and patrons, revealing the societal pressures of post-war recovery and gender roles in a confined, stormy setting.
7. Maintain continuity around these socially central cast anchors where relevant: Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill, Sylvia Trent, Hugo Vane.
8. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Critical: Plot similarity 0.80 with 'The Second Key' (same era and method of drowning)
9. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Moderate: Character similarity 0.75 with 'The Second Key' (similar character roles and dynamics)
10. STORY TO DATE ANTI-COPY RULE: The STORY TO DATE section below is provided for chronological and factual reference ONLY. You MUST NOT copy, lightly rephrase, or structurally echo any sentence or paragraph from prior chapters. Every sentence in this chapter must be original prose unique to this scene. Reusing even a clause from prior chapter text will cause this attempt to fail immediately.

CRITICAL PROSE REQUIREMENTS:

The CML specifies exact requirements for certain validation-critical scenes. You MUST include these elements at the specified positions.

**Discriminating Test Scene (Act 3, Scene 4):**
Required elements: Execute the discriminating test, Observe the culprit's reaction or result, Draw conclusion about guilt
Test type: temporal comparison

**Suspect Clearance Scenes:**
- Captain Ivor Hale (Act 3, Scene 3): Verified hotel lobby presence during the time of drowning.
  Clues: clue_id_1, clue_id_2
- Dr. Mallory Finch (Act 3, Scene 3): Confirmed alibi by hotel staff.
  Clues: clue_id_3, clue_id_4
- Sylvia Trent (Act 3, Scene 5): Alibi confirmed: 8 PM to 10 PM

**Culprit Revelation Scene (Act 3, Scene 6):**
Method: Confrontation with evidence

**Clue Placement for These Chapters:**
- clue_core_contradiction_chain must appear in Act 1, Scene 2 via Cross-check contradiction

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
Investigation state at start: 3 clue(s) revealed to reader; approximately 3 unresolved suspect(s).
Must change by end: Reframe prior clue meaning and update suspect implications.
Suspect pressure target(s): Beatrice Quill, Captain Ivor Hale, Sylvia Trent, Dr. Mallory Finch
Required new information: Earlier clue gets revised meaning with explicit theory update.
Forbidden reveals at this stage: Do not introduce decisive new evidence from nowhere.

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
  - Scene is set in: the beach, near the water's edge — reference it naturally within the paragraph, never as your opening phrase.
  - Opening atmosphere (MANDATORY — validator enforced): the first paragraph MUST contain at least one of: rain / wind / fog / storm / mist / thunder / evening / morning / night / dawn / dusk / season / afternoon / midday / noon / midnight / twilight / sunrise / sunset / daylight / sunlight / overcast / cloudy / bright / dark / grey / pale / cold / warm / chill / crisp / damp / drizzle / haze / lamplight / firelight. A chapter that omits all of these from its opening paragraph will be rejected.
  - PARAGRAPH OPENER DIVERSITY (MANDATORY — validator enforced): No more than 2 paragraphs in this chapter may begin with "Eleanor" or "Eleanor's" as the first word. You must vary paragraph openings throughout: use sensory observations, another character's name or action, dialogue, object or sound details, or temporal markers. Opening 3 or more paragraphs with "Eleanor" will cause automated rejection.
  - Continuity bridge: in the first 120 words, visibly connect from the previous chapter's final beat. Carry forward one unresolved element (object, accusation, emotional pressure, or immediate physical action) from: "Eleanor surveyed the scene one last time—the body, the tide chart, the anxious faces of those gathered. The contradictions refused to resolve, and the wintry morning seemed to press in closer, as if the world itself cons...".
  - CLUE OBLIGATIONS — each clue below MUST be dramatized, but in YOUR OWN WORDS:
    Render each as something a character SEES, DOES, or SAYS on the page. The bracketed text is a
    DESCRIPTION of the evidence for you — do NOT transcribe it as narration. Copying a clue's
    description sentence verbatim into the prose FAILS validation.
    • tide, chart, indicates, minutes, past, nine [clue_core_contradiction_chain] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: claim, time, drowning, false
      ↳ MANDATORY TWO-PARAGRAPH STRUCTURE (must appear in paragraphs 1 or 2 — no later):
         Paragraph 1: The POV character physically approaches or directly observes this evidence.
           The narration or dialogue explicitly states what is seen (use the exact locked phrase if one applies).
         Paragraph 2 (immediately following): The detective or POV character explicitly reasons
           about what this evidence implies — who it implicates, why it may be unreliable,
           or what inference it supports. This must be a separate full paragraph, not a sentence appended to Paragraph 1.
    • witnesses, claim, hotel, clock, showed, half, past, nine, night [clue_3] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: timeline, events, unclear
      ↳ MANDATORY TWO-PARAGRAPH STRUCTURE (must appear in paragraphs 1 or 2 — no later):
         Paragraph 1: The POV character physically approaches or directly observes this evidence.
           The narration or dialogue explicitly states what is seen (use the exact locked phrase if one applies).
         Paragraph 2 (immediately following): The detective or POV character explicitly reasons
           about what this evidence implies — who it implicates, why it may be unreliable,
           or what inference it supports. This must be a separate full paragraph, not a sentence appended to Paragraph 1.
    • witnesses, provide, different, accounts, time, hugo, last, seen [clue_4] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: witness, accounts, cannot, trusted
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
  - ALIBI LOCK: Beatrice Quill's established alibi is "7 PM to 9 PM". Do NOT place Beatrice Quill at any other location or in any other activity during the crime window. Any contradiction is a continuity error that triggers a retry.
  - TESTIMONY CONTINUITY: Beatrice Quill has already made statements in earlier chapters. Any time, location, or claim attributed to Beatrice Quill in THIS chapter must be consistent with those earlier statements. Do NOT introduce a new or different alibi claim — any contradiction is a continuity error.
- Locked fact phrase obligations:
  - If this batch mentions The tide was at its lowest point., write exactly: "ten minutes past nine".
  - If this batch mentions The victim was last seen at this time., write exactly: "a quarter to ten".
  - If this batch mentions Witnesses report the hotel clock showing this time., write exactly: "half past nine at night".
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
Investigation state at start: 3 clue(s) revealed to reader; approximately 3 unresolved suspect(s).
Must change by end: Reframe prior clue meaning and update suspect implications.
Suspect pressure target(s): Beatrice Quill, Captain Ivor Hale, Sylvia Trent, Dr. Mallory Finch
Required new information: Earlier clue gets revised meaning with explicit theory update.
Forbidden reveals at this stage: Do not introduce decisive new evidence from nowhere.

FROZEN FACT STATE (DO NOT ALTER):
- Timeline anchor: February (winter).
- Month, season, weather, and time-of-year language in this batch must stay compatible with winter.
- Established timeline fact: Tide chart showing low tide
- Established timeline fact: Witness testimony
- If referenced, use exact phrase: "ten minutes past nine" (The tide was at its lowest point.).
- If referenced, use exact phrase: "a quarter to ten" (The victim was last seen at this time.).
- If referenced, use exact phrase: "half past nine at night" (Witnesses report the hotel clock showing this time.).

STORY TO DATE (REFERENCE ONLY — DO NOT COPY VERBATIM):
- Full prior chapter text is provided below for continuity, factual consistency, and reference accuracy.
- Use this to keep character voice, chronology, clue state, and location continuity aligned with earlier chapters.
- Do not quote, copy, or paraphrase these paragraphs too closely; write fresh prose that remains consistent with them.

--- BEGIN PRIOR CHAPTER 1 ---
Title: Chapter 1: The Tide at Dawn
Eleanor Voss stepped onto the damp shingle, the cold wind biting through her wool coat as the first pale light of morning struggled against a sky still heavy with overcast clouds. The air was thick with the brine of the Channel, and the only sound was the restless hiss of waves against the stones. Ahead, near the water’s edge, a small knot of figures stood in uneasy silence, their shadows flickering across the sand as the wind tugged at their coats and hats. At their feet, the body of Hugo Vane lay sprawled, his evening suit sodden and dark against the pale stones, a single shoe twisted at an unnatural angle. A faint tang of seaweed and something sharper—metallic, undeniable—hung in the air.

Eleanor forced herself forward, boots crunching over the rough pebbles, her breath clouding before her. She crouched beside Hugo Vane, eyes flicking over the scene with the practiced detachment of a journalist accustomed to tragedy. The tide chart, pinned to a battered post not far from the corpse, caught her eye: it declared, with bureaucratic precision, that the tide had been at its lowest at "ten minutes past nine". Yet, as she glanced at the gold watch still fastened to Hugo Vane’s wrist, the hands pointed stubbornly to "a quarter to ten". Behind her, a voice—Beatrice Quill’s, thin and tremulous—murmured, "The hotel clock said it was half past nine at night when he left." The contradiction hovered in the air, as sharp and cold as the morning itself.

For a moment Eleanor remained kneeling, letting the details settle. The official record insisted the water had receded by "ten minutes past nine", but Hugo Vane had last been seen at "a quarter to ten"—nearly forty minutes later. If the tide was already low, how could he have drowned so near the shore? And why did the hotel clock, observed by multiple witnesses, claim it was "half past nine at night" when Hugo Vane was seen departing? The numbers refused to align, each insisting on its own version of the night. Eleanor’s mind ticked through the possibilities, but the mechanism behind the contradiction remained stubbornly out of reach.

The wind picked up, sending a scatter of fine drizzle across the beach. Eleanor straightened, brushing grit from her skirt, and turned to face the others. Beatrice Quill stood closest, her hands twisting the hem of her apron, eyes wide and rimmed red. She wore her waitress’s uniform beneath a threadbare cardigan, the white cuffs muddied from the walk down to the shore. Her voice, when she spoke, was barely above a whisper. "I—I saw him go out, Miss Voss. He didn’t say a word. Just…gone." Eleanor’s gaze lingered on Beatrice’s trembling fingers, the way she avoided looking at Hugo Vane. There was fear there, and something else—a flicker of calculation, quickly masked by distress.

Captain Ivor Hale, his greatcoat buttoned tight against the cold, stood apart from the others, arms folded across his chest. His face was set in a mask of composure, but Eleanor caught the way his jaw worked as he surveyed the scene. The lines around his eyes were deeper than she remembered, and he watched the proceedings with the wary detachment of a man accustomed to command. When Eleanor met his gaze, he inclined his head, voice low and controlled. "A damned sorry business, Miss Voss. The sea takes what it wants, but this—" He broke off, glancing toward the tide chart, his fingers tightening around the brim of his hat. The gesture was small, but it betrayed a tension that words could not.

Sylvia Trent, the hotel manager, arrived last, her heels sinking into the wet sand. She was impeccably dressed despite the hour, her navy skirt suit pressed and her hair pinned back beneath a sensible hat. She paused a few paces from the body, surveying the scene with a cool, appraising eye. "We must handle this delicately," she said, her voice measured, "for the sake of the hotel’s reputation, if nothing else." Yet as she spoke, her gloved hand lingered at her throat, fingers tracing the edge of her collar as if seeking reassurance. Eleanor noted the gesture, filing it away alongside the rest.

A silence settled over the group, broken only by the distant call of a gull and the ceaseless motion of the sea. Eleanor drew herself up, feeling the weight of expectation settle on her shoulders. She was no constable, but in this place, at this moment, she was the investigator. The others looked to her, their faces pale in the wintry light. She took a steadying breath, the salt air sharp in her lungs. "No one leaves the area until I’ve finished," she said, her tone brooking no argument. "We need to establish who last saw Hugo Vane, and when."

Beatrice’s voice trembled as she answered. "It was just after dinner, Miss Voss. He asked for a flask of coffee—said he’d take it down to the beach. I brought it to him at the lounge, and he left soon after. The hotel clock said it was half past nine at night." Eleanor watched her closely, noting the way Beatrice’s gaze darted to Sylvia Trent, then away. "And you’re certain of the time?" Beatrice nodded, but her hands twisted harder, the knuckles white. "I remember because I’d just finished clearing the tables. It was my last duty before the end of my shift."

Captain Ivor Hale cleared his throat. "If I may, Miss Voss, I was in the lounge myself. Saw Vane leave, though I didn’t think much of it at the time. The clock was chiming, I believe—half past nine at night, as Miss Quill says." His words were precise, but Eleanor caught the faintest hesitation before he spoke. She wondered what else he might be holding back, whether out of loyalty or something darker.

Sylvia Trent’s reply was more circumspect. "I was in my office, reviewing the accounts. I didn’t see Mr. Vane leave, but I heard voices in the corridor. The staff will confirm I was there until ten." Her tone was even, but the pause before she answered was just long enough to register. Eleanor marked it, as she did every detail.

The contradictions pressed in from all sides. The tide chart insisted on "ten minutes past nine" for low tide, yet Hugo Vane was last seen at "a quarter to ten". The hotel clock, corroborated by multiple witnesses, fixed his departure at "half past nine at night". The evidence was as tangled as the seaweed strewn along the shore. Eleanor felt the familiar stirrings of doubt and curiosity, the sense that something vital was just beyond her grasp.

She knelt once more beside Hugo Vane, studying the sand around his body. There were no clear footprints leading to or from the water’s edge—only the scuffed marks of hurried feet, already blurred by the morning drizzle. The flask Beatrice mentioned lay half-buried nearby, its lid unscrewed and contents spilled. Eleanor picked it up, feeling the chill of the metal seep into her palm. She turned it over, searching for anything out of place, but the only clue was the faint scent of coffee, mingled now with the salt air.

A faint, ironic thought crossed Eleanor’s mind: for all the world’s supposed order—its charts and clocks and careful records—the truth still slipped through the cracks, as elusive as the tide itself. She rose, brushing her hands together, and looked out over the restless sea. The day had begun with death, and the questions it raised would not be easily answered.

As the others shifted uneasily, Eleanor caught Beatrice Quill’s eye. The waitress’s composure threatened to crack, but she managed a brittle smile. "Well, that’s just my luck, isn’t it? Always seem to be in the wrong place at the wrong time." The attempt at levity fell flat, but Eleanor recognized it for what it was: a shield, hastily raised.

Captain Ivor Hale moved to stand beside Eleanor, his gaze fixed on the horizon. "Strange business, Miss Voss. The sea’s never given up its secrets easily." His voice was low, almost conspiratorial, and Eleanor sensed the weight of unspoken history between him and Hugo Vane. She wondered how much of that history would surface before the day was done.

Sylvia Trent lingered at the edge of the group, arms folded, her expression unreadable. When Eleanor glanced her way, Sylvia offered a thin, professional smile. "If you require anything further, Miss Voss, you know where to find me." The words were polite, but the underlying message was clear: she would cooperate, but only as far as necessity demanded.

Eleanor surveyed the scene one last time—the body, the tide chart, the anxious faces of those gathered. The contradictions refused to resolve, and the wintry morning seemed to press in closer, as if the world itself conspired to keep its secrets. She squared her shoulders, the weight of responsibility settling more firmly with each passing moment. The investigation had begun, and the truth, whatever shape it took, would not be denied.
--- END PRIOR CHAPTER 1 ---

[SCENE COMPLETENESS CONTRACTS — MANDATORY. Each contract below lists what you MUST enact in that chapter. Do not summarise or mention these labels in the prose — enact them organically.]
Chapter 2 (Act 1) completeness contract:
  PIVOT ELEMENT (MANDATORY — write this into the prose, shown not told): "The conflicting witness statements regarding the time of death."
  FACT ESTABLISHED (MANDATORY — reader must know this by chapter end): "Establishes that witness accounts do not align, suggesting deception or error."

# Case Overview
Title: Tides of Deception
Era: 1940s
Setting: Seaside Hotel
Crime: murder (drowning)
Culprit: Beatrice Quill
Victim: Hugo Vane
False assumption: Hugo Vane drowned during high tide.
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
    "title": "Contradictions",
    "setting": {
      "location": "the beach, near the water's edge",
      "timeOfDay": "Shortly after the body is discovered",
      "atmosphere": "An air of suspicion thickens as the detective begins her inquiry"
    },
    "characters": [
      "Eleanor Voss",
      "Beatrice Quill",
      "Captain Ivor Hale",
      "Sylvia Trent",
      "Dr. Mallory Finch"
    ],
    "purpose": "Establish contradictions and initial witness statements",
    "cluesRevealed": [
      "clue_core_contradiction_chain",
      "clue_3",
      "clue_4"
    ],
    "dramaticElements": {
      "conflict": "Suspects’ statements begin to conflict with each other.",
      "tension": "Eleanor senses the growing mistrust among the witnesses.",
      "microMomentBeats": [
        "Eleanor watches the waves crash, feeling a chill that has nothing to do with the sea breeze."
      ]
    },
    "summary": "As Eleanor begins to question the gathered witnesses, she notes discrepancies in their accounts of when Hugo was last seen. Beatrice claims they were together until ten, while Captain Hale insists he saw Hugo just before high tide. The conflicting accounts raise alarms in Eleanor's mind.",
    "beat": "crime",
    "estimatedWordCount": 1800,
    "pivotElement": "The conflicting witness statements regarding the time of death.",
    "factEstablished": "Establishes that witness accounts do not align, suggesting deception or error.",
    "permittedBehavioursByAct": [
      {
        "characterName": "Eleanor Voss",
        "behaviour": "Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted."
      },
      {
        "characterName": "Beatrice Quill",
        "behaviour": "Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted."
      },
      {
        "characterName": "Captain Ivor Hale",
        "behaviour": "Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted."
      },
      {
        "characterName": "Sylvia Trent",
        "behaviour": "Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted."
      },
      {
        "characterName": "Dr. Mallory Finch",
        "behaviour": "Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted."
      }
    ],
    "redHerringPlacement": null,
    "emotionalRegister": "The investigation reveals initial clues that deepen the mystery, heightening the stakes for Eleanor.",
    "dominantCharacterNote": {
      "name": "Eleanor Voss",
      "voiceRegister": "Eleanor Voss speaks with a confident cadence, her voice often laced with dry wit reflecting her journalistic background."
    },
    "humourGuidance": {
      "permission": "permitted",
      "character": "Eleanor Voss",
      "form": "dry_wit"
    },
    "eraTextureNote": "Post-war rationing limits access to goods and services; Travel remains restricted due to fuel rationing and damaged infrastructure; Communication is hindered by wartime disruptions and shortages",
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
□ Chapter 2: the clue [clue_core_contradiction_chain] (contradicts, claim, hugo, drowned, high, tide) is placed in the first 25% of the chapter, dramatized in your own words, followed by an explicit inference or suspicion paragraph.
□ Chapter 2: the clue [clue_3] (witnesses, report, conflicting, times, event) is placed in the first 25% of the chapter, dramatized in your own words, followed by an explicit inference or suspicion paragraph.
□ Chapter 2: the clue [clue_4] (inconsistencies, witness, accounts, suggest, misinterpretation, timing) is placed in the first 25% of the chapter, dramatized in your own words, followed by an explicit inference or suspicion paragraph.
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
