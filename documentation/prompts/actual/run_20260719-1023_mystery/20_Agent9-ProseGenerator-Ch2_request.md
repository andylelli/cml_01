# Actual Prompt Record

- Run ID: `mystery-1784456621907`
- Project ID: ``
- Timestamp: `2026-07-19T10:28:47.252Z`
- Agent: `Agent9-ProseGenerator-Ch2`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4.1`
- Temperature: `0.42`
- Max Tokens: `4500`
- Attempt: `first`
- Prompt Hash: `2e26b56926183b91`

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
- MORAL COMPLEXITY REQUIREMENT: The mechanism of this crime carries a moral gray area: "The culprit believed they were avenging a wrong done to them by the victim, creating a disturbing sympathy for their desperation." — the culprit reveal and denouement MUST acknowledge this ambiguity. Do not let the ending feel clean or simple. Give the reader at least one moment of uncomfortable sympathy or moral doubt.

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
   - Captain Ivor Hale: Estranged Relative
   - Beatrice Quill: Innocent Bystander
   - Sylvia Trent: Financial Benefactor
   - Hugo Vane: Ambitious Outsider
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

## Era: 1948-02
Living in February 1948 means navigating a world still reeling from the scars of war and the shifting dynamics of society. The coastal air is thick with the salt of the sea, mingling with the scent of damp earth from intermittent rain showers. People gather in coastal hotels, seeking solace and connection amidst the uncertainty of the post-war era. The echoes of wartime news broadcasts linger in the background, reminding everyone of the fragility of peace. Daily life is marked by a cautious optimism, with gatherings filled with whispers of ambition and the unspoken pressures of social norms. Couples engage in romantic dinners to celebrate Valentine's Day, while others juggle the realities of rising inflation and the demand for better living conditions. This is a time when the emerging middle class is beginning to assert its influence, reshaping traditional roles, especially for women, who are increasingly stepping into the workforce while balancing domestic responsibilities.
Emotional register: A pervasive sense of tension and uncertainty hangs over society, underscored by a yearning for stability and normalcy.
Physical constraints: Short daylight hours limiting outdoor activities | Cold winds making coastal walks uncomfortable | Limited access to goods due to post-war shortages | Rationing still affecting food availability
Current tensions (weave into background texture): Escalating Cold War tensions between the East and West | Struggles for civil rights gaining visibility | Economic recovery hampered by inflation
Wartime context — Many veterans are grappling with the psychological toll of their experiences, navigating the complexities of reintegration into civilian life.: Communities are coming together to support returning veterans, yet underlying tensions remain as some struggle to adjust to new societal expectations. Absence effect: The absence of loved ones lost during the war has left a void that resonates deeply within families, complicating relationships and emotional connections.

## Story Theme
The intricate interplay of personal ambition and societal expectation reveals the lengths to which individuals will go to protect their secrets and reclaim their narratives.

## Story Emotional Register
Dominant: The emotional journey of the story oscillates between tension and revelation, culminating in a confrontation that forces characters to confront their deepest fears.

Arc:
The story opens with the Crestview Hotel shrouded in an unsettling atmosphere, where whispers linger like the salty air from the tumultuous sea outside. The discovery of Dr. Mallory Finch's drowned body sends shockwaves through the hotel, igniting Eleanor Voss's quest for the truth. As Eleanor delves into the investigation, rising unease grips her as she encounters a web of deceit among the guests, each harboring their own secrets and motives. The early clues present false leads, particularly surrounding Captain Ivor Hale and Beatrice Quill, leading Eleanor to grapple with her own emotional costs as she navigates the complex dynamics at play. A pivotal moment arises when Eleanor uncovers the hidden valve mechanism, redirecting her investigation and suggesting a carefully orchestrated murder rather than an accidental drowning. This revelation reshapes her understanding of the suspects and compels her to reconsider earlier interactions. As tension mounts, Eleanor confronts Hugo Vane, whose ambition and desperation come to light, culminating in a climactic confrontation where the truth is finally unveiled. The resolution leaves each character altered; Eleanor finds a renewed sense of purpose and confidence, while the others reckon with the consequences of their actions amidst the aftermath of tragedy.

The story opens: An unsettling atmosphere pervades the hotel, setting the stage for the ensuing drama. As the investigation takes shape: Rising tension grips Eleanor as she unravels the first clues amidst a web of deceit. A first key turn arrives: Eleanor discovers the hidden valve, pivoting the investigation towards a more sinister possibility. At the mid-point of the story: A revelation about motives reshapes Eleanor's perspective on the suspects.

A second pivot reshapes the course: As pressure mounts, Eleanor confronts Hugo, illuminating the darker aspects of ambition. As tension reaches its height: The confrontation escalates, revealing the depths of betrayal and desperation.

## Emotional register at this point in the story
An unsettling atmosphere pervades the hotel, setting the stage for the ensuing drama.

## Character Portraits (appearance & era)

### Eleanor Voss
Eleanor Voss embodies the spirit of a post-war journalist striving for relevance in a changing world. As a woman navigating a male-dominated profession, she finds herself grappling with societal expectations while seeking validation through her work. The pressure to uncover the truth in the murder case at the hotel intertwines with her personal journey of reclaiming her narrative in the aftermath of a recent breakup, reflecting the broader struggles faced by women at this time.
Era intersection: Her quest for identity and success aligns with the rising influence of women in the workforce, highlighting the ongoing clash between ambition and societal norms.

### Captain Ivor Hale
Captain Ivor Hale represents the disillusionment of returning war veterans who feel marginalized in a rapidly changing society. Having dedicated his life to service, Ivor finds himself at odds with the victim over familial ties and financial stability. His gruff exterior masks a deep-seated resentment, reflecting the internal battles many veterans face as they return to a world that seems to have moved on without them.
Era intersection: Ivor's conflicts illustrate the struggle for acceptance and relevance faced by many men after the war, as traditional roles are challenged by new societal norms.

### Beatrice Quill
Beatrice Quill embodies the complexities of social ambition in a post-war context. As an aspiring actress, she represents the shifting attitudes towards women and their roles in society. Torn between her desire for revenge against the victim and her longing for social acceptance, Beatrice navigates a fine line between ambition and morality. Her grudge against the victim reveals the darker side of social competition during this era.
Era intersection: Her journey highlights the evolving dynamics of gender roles and the emerging pressures on women to reclaim their narratives in a society still grappling with its past.

### Sylvia Trent
Sylvia Trent is a cultured art curator entangled in financial troubles, representing the precariousness of post-war recovery. Her polished exterior hides a significant debt to the victim, creating a desperate situation that could unravel her career. As the art world navigates the complexities of a recovering economy, Sylvia's struggle highlights the tensions between ambition and ethical responsibility.
Era intersection: Her plight reflects the challenges many professionals face as they grapple with the consequences of their decisions in a society marked by financial instability.

### Hugo Vane
Hugo Vane is a charismatic real estate developer caught in the throes of ambition and ethical compromise. His desire to acquire the victim's property for a lucrative deal illustrates the cutthroat nature of business during a time of economic recovery. As individuals seek to rebuild their lives, Hugo's moral dilemmas reflect the darker side of ambition, echoing the societal pressures to succeed.
Era intersection: His journey embodies the tension between personal ambition and societal expectations in a world where ethical boundaries are increasingly blurred.

## Character Voices

### Eleanor Voss (she/her/her)
Eleanor speaks with a rhythmic cadence, often punctuating her observations with a raised eyebrow or a knowing smile.
[comfortable] Isn’t it curious how secrets seem to linger in the air, waiting to be uncovered?
[evasive] Oh, I didn't really see anything; just the usual chatter among the guests.
[stressed] I can’t shake this feeling, like there’s something lurking just beneath the surface.
Humour: Eleanor's dry wit often surfaces in tense moments, providing a contrast to her otherwise serious observations.

### Captain Ivor Hale (he/him/his)
Ivor speaks in a booming voice, often punctuated by hearty laughter.
[comfortable] In my day, we faced storms head-on, no matter how fierce they were.
[evasive] Who can say what truly happened? The sea has a mind of its own, after all.
[stressed] They’ll never understand the weight of family honor until it’s too late.
Humour: Ivor's self-deprecating humor often lightens the mood, even when tensions run high.

### Beatrice Quill (she/her/her)
Beatrice speaks with a playful lilt, often employing sarcasm and wit.
[comfortable] Oh, darling, isn’t it just delightful to be surrounded by such... interesting company?
[evasive] I wouldn’t dream of discussing that; it’s all rather private, you see.
[stressed] My reputation is on the line, and I can’t afford any more scandal.
Humour: Beatrice's sardonic comments often reveal her inner conflicts while maintaining her social facade.

### Sylvia Trent (she/her/her)
Sylvia speaks with a refined eloquence, often employing art-related metaphors.
[comfortable] Art is subjective, much like the truths we choose to reveal or conceal.
[evasive] It’s best to focus on the beauty of the moment rather than dwell on the past.
[stressed] The weight of my choices feels like a canvas stretched to its limits.
Humour: Sylvia’s observational humor subtly critiques the social dynamics around her.

### Hugo Vane (he/him/his)
Hugo speaks in a direct, no-nonsense manner, often cutting to the chase.
[comfortable] Let’s get down to brass tacks; this deal is crucial for both of us.
[evasive] I prefer not to discuss personal matters; business is my focus.
[stressed] If this doesn’t work out, it could ruin everything I’ve built.
Humour: Hugo’s bluntness sometimes veils a subtle, dry humor that emerges in unexpected moments.

## Location Registers (scene framing guides)

The Oceanview Suite: The Oceanview Suite feels like a haunting reminder of shattered lives, where the weight of tragedy lingers in the air, thick with unspoken secrets. The once-elegant decor now stands in stark contrast to the chaos that unfolded here, creating an atmosphere charged with tension and despair.. Camera angle: A writer entering this space should feel the oppressive weight of history, as if the walls themselves are witnesses to the unfolding drama.. Era: In the 1940s, this suite transforms from a luxurious getaway to a site of tragic revelations, reflecting the broader societal tensions of the time.

The Grand Lobby: The Grand Lobby buzzes with a mix of anticipation and anxiety, where the elegance of the surroundings contrasts sharply with the underlying tension among guests. Conversations are punctuated by furtive glances, as secrets intertwine with pleasantries, creating an atmosphere thick with unvoiced fears.. Camera angle: The writer should approach this space with a sense of curiosity about the hidden dynamics at play, eager to unveil the stories lurking in the shadows.. Era: During the post-war era, this lobby embodies the clash of social expectations and personal aspirations, as guests navigate their complex relationships.

The Oceanview Dining Room: The Oceanview Dining Room feels alive with the clinking of cutlery and soft murmurs, yet an undercurrent of tension simmers beneath the surface. The beautiful views of the ocean stand in stark contrast to the emotional turmoil of the guests dining within, each meal a reminder of the secrets that bind and divide them.. Camera angle: A writer should enter this space with an eye for detail, capturing the juxtaposition of elegance and unease that permeates the dining experience.. Era: In the context of the 1940s, this dining room serves as a microcosm of social dynamics, where class and ambition intersect amidst the backdrop of post-war recovery.

## Humour guidance for this story position (opening)
Permission: forbidden
Rationale: The gravity of the discovery of the body necessitates a serious tone.

FAIR-PLAY AND INFERENCE CONTRACT:
- FAIR PLAY CLUE TIMING: Never combine clue discovery and detective deduction in the same chapter. If a clue is first revealed to the reader in chapter N, the detective may only analyze, deduce from, or act on that clue in chapter N+1 or later.
- FAIR PLAY INFORMATION PARITY: The reader must see all clues BEFORE the detective uses them in reasoning. If the detective performs a test or makes a deduction, every piece of evidence supporting that conclusion must have been shown to the reader in earlier chapters.
- FAIR PLAY REVELATION SPACING: In the discriminating test scene, the detective can ONLY use clues that were revealed to the reader at least 1 full chapter earlier. Never introduce new clues or withheld information during the test.
- FAIR PLAY CONFRONTATION: During the final confrontation/revelation, the detective cannot surprise the reader with facts. Every piece of evidence cited must have been visible to the reader in prior chapters.
- Never solve by withheld information. Keep reader-information parity with detective reasoning.
- False assumption in force: Dr. Finch drowned during a storm surge, as indicated by the high tide.
- Hidden truth to progressively expose (compose in your own words from these elements): valve, deliberately, opened, precise, moment, high, tide
- Inference path checkpoints to dramatize clearly — compose ENTIRELY in your own sentences from these key terms (reproducing any briefing phrase verbatim FAILS validation):
  - Step 1: obs: tide, schedule, posted, lobby, showing, high | corr: reveals, timing, high, tide, flooding, occur | effect: narrows, window, opportunity, murder, high, tide
  - Step 2: obs: water, marks, wall, indicate, flooding, occurred, recently | corr: suggests, flooding, happened, close, time, discovered | effect: eliminates, possibility, finch, drowned, earlier
  - Step 3: obs: hidden, valve, functional, rusty, indicating, recent | corr: shows, valve, deliberately, opened, aligning, timing, high, tide | effect: narrows, suspicion, towards, someone, access, valve, mechanism
- Discriminating test method: trap
- Discriminating test elements to dramatize (compose ENTIRELY in your own sentences from these — do NOT reproduce any briefing phrase verbatim): reenactment, timeline, staged, showing, hugo, vane, accessed, valve, critical, time, window
- Test must rely on already-shown clue IDs: clue_culprit_direct_1, clue_3, clue_5, clue_culprit_direct_hugo_vane
- Fair-play rationale: Step 1: The tide schedule (early) and witness statements (mid) clarify the timing of death. Step 2: Water marks (mid) indicate recent flooding. Step 3: The valve's condition (discriminating test) reveals Hugo Vane's unique access.

## Character Reference

### Eleanor Voss (she/her — NEVER he/him)
Eleanor speaks with a rhythmic cadence, often punctuating her observations with a raised eyebrow or a knowing smile
She has a tendency to ask rhetorical questions, inviting others to think critically.
Eleanor is torn between her ambition and her crippling fear of failure, which shadows her every move as she seeks validation in her work.
Voice colour: Eleanor Voss uses dry wit humour — let it surface in their dialogue where natural, not in every line.

### Captain Ivor Hale (he/him — NEVER she/her)
Ivor speaks in a booming voice, often punctuated by hearty laughter
He has a tendency to embellish his stories, using nautical jargon that reflects his past.
Ivor grapples with his resentment towards the victim while longing for familial acceptance, torn between his pride and the desire to reconcile.

### Beatrice Quill (she/her — NEVER he/him)
Beatrice speaks with a playful lilt, often employing sarcasm and wit
She has a tendency to use dramatic pauses to build suspense in her narratives.
Beatrice wrestles with her insecurities and the desire for revenge, torn between her public persona and her private grievances.
Voice colour: Beatrice Quill uses sardonic humour — let it surface in their dialogue where natural, not in every line.

### Sylvia Trent (she/her — NEVER he/him)
Sylvia speaks with a refined eloquence, often employing art-related metaphors
She has a tendency to pause contemplatively, choosing her words with care.
Sylvia faces the weight of her financial mismanagement, torn between the desire to protect her career and the fear of exposure.
Voice colour: Sylvia Trent uses observational humour — let it surface in their dialogue where natural, not in every line.

### Hugo Vane (he/him — NEVER she/her)
Hugo speaks in a direct, no-nonsense manner, often cutting to the chase
He has a tendency to use business jargon, making his intentions clear.
Hugo struggles with the ethical implications of his ambition, torn between his desire for success and the moral cost of his actions.
Voice colour: Hugo Vane uses blunt humour — let it surface in their dialogue where natural, not in every line.


## CHARACTER CONTRACTS (binding for this scene)
Each entry below constrains how this character must be written in this chapter.
These override generic style guidance when they conflict.

### Eleanor Voss[SHE]
Voice & mannerisms: Eleanor speaks with a rhythmic cadence, often punctuating her observations with a raised eyebrow or a knowing smile. She has a tendency to ask rhetorical questions, inviting others to think critically.
SIGNATURE TIC (use sparingly — this is Eleanor Voss's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "‘Isn’t it curious?’ — a phrase she often uses to draw attention to the oddities of life."
Sample voice fragments (match this register and rhythm):
  [comfortable] "Isn’t it curious how secrets seem to linger in the air, waiting to be uncovered?"
  [evasive] "Oh, I didn't really see anything; just the usual chatter among the guests."
Humour: dry wit — deploy occasionally (level 0.5)
FORBIDDEN phrase (never write for Eleanor Voss): "a surge of determination washed over her"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "The allure of a sensational story is not just professional for Eleanor; it’s a chance to reclaim her confidence and prove herself to an unforgiving world." — do not surface in Act I.

### Captain Ivor Hale[HE]
Voice & mannerisms: Ivor speaks in a booming voice, often punctuated by hearty laughter. He has a tendency to embellish his stories, using nautical jargon that reflects his past.
SIGNATURE TIC (use sparingly — this is Captain Ivor Hale's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "‘In my day…’ — a phrase he uses to segue into tales of his naval exploits."
Sample voice fragments (match this register and rhythm):
  [comfortable] "In my day, we faced storms head-on, no matter how fierce they were."
  [evasive] "Who can say what truly happened? The sea has a mind of its own, after all."
Humour: self deprecating — deploy rarely (level 0.3)
FORBIDDEN phrase (never write for Captain Ivor Hale): "she knew with certainty she was right"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "His desire to regain respect and financial stability drives him to consider drastic measures against the victim." — do not surface in Act I.

### Beatrice Quill[SHE]
Voice & mannerisms: Beatrice speaks with a playful lilt, often employing sarcasm and wit. She has a tendency to use dramatic pauses to build suspense in her narratives.
SIGNATURE TIC (use sparingly — this is Beatrice Quill's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "‘Oh, darling’ — a phrase she uses to punctuate her observations, often dripping with irony."
Sample voice fragments (match this register and rhythm):
  [comfortable] "Oh, darling, isn’t it just delightful to be surrounded by such... interesting company?"
  [evasive] "I wouldn’t dream of discussing that; it’s all rather private, you see."
Humour: sardonic — deploy occasionally (level 0.6)
FORBIDDEN phrase (never write for Beatrice Quill): "palpable tension filled the room"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "With the potential to gain social standing by revealing damaging secrets about the victim, Beatrice is caught between ambition and morality." — do not surface in Act I.

### Sylvia Trent[SHE]
Voice & mannerisms: Sylvia speaks with a refined eloquence, often employing art-related metaphors. She has a tendency to pause contemplatively, choosing her words with care.
SIGNATURE TIC (use sparingly — this is Sylvia Trent's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "‘Art is subjective’ — a phrase she often uses to justify her opinions and choices."
Sample voice fragments (match this register and rhythm):
  [comfortable] "Art is subjective, much like the truths we choose to reveal or conceal."
  [evasive] "It’s best to focus on the beauty of the moment rather than dwell on the past."
Humour: observational — deploy occasionally (level 0.4)
FORBIDDEN phrase (never write for Sylvia Trent): "everyone could sense the atmosphere"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "The threat of losing her collection if the victim's estate seizes it drives Sylvia to consider desperate measures." — do not surface in Act I.

### Hugo Vane[HE]
Voice & mannerisms: Hugo speaks in a direct, no-nonsense manner, often cutting to the chase. He has a tendency to use business jargon, making his intentions clear.
SIGNATURE TIC (use sparingly — this is Hugo Vane's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "‘Let’s get down to brass tacks’ — a phrase he often uses when discussing business matters."
Sample voice fragments (match this register and rhythm):
  [comfortable] "Let’s get down to brass tacks; this deal is crucial for both of us."
  [evasive] "I prefer not to discuss personal matters; business is my focus."
Humour: blunt — deploy occasionally (level 0.5)
FORBIDDEN phrase (never write for Hugo Vane): "she chose her words with great care"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "The victim's land is crucial for his plans to build an exclusive resort, making him a suspect in the unfolding investigation." — do not surface in Act I.



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

Primary Location: The Crestview Hotel (Clovelly, England)
A seaside hotel with a blend of Art Deco and Colonial Revival styles, overlooking the tumultuous Atlantic, where whispers of espionage linger like sea mist.

Key Locations Available:
- The Oceanview Suite (interior): Crime scene
- The Grand Lobby (interior): Gathering space
- The Oceanview Dining Room (interior): Gathering space for meals

Atmosphere (tonal cue only — do NOT reproduce this phrase verbatim in prose; translate into scene-specific, character-observed sensory language): Tense and suspenseful, heightened by the recent war and lingering fears of espionage.
Weather: Overcast with occasional rain, typical of coastal climates in the fall.

Era markers: Fading radio broadcasts of wartime news | Rationed wartime vehicles parked outside | Distant sounds of military radar from the coast

USAGE GUIDELINES:
1. First mention of location: Ground the scene using sensory details drawn from the profiles — paraphrase these into what the POV character directly observes and experiences, not a summary of the room's general qualities
2. Geographic grounding: Reference the specific place (Clovelly, England) naturally in dialogue or narrative
3. Action scenes: Integrate physical layout details (access, sightlines, constraints)
4. Atmospheric scenes: Reference weather, lighting, sounds from sensory palette
5. Era details: Weave in period markers naturally
6. Consistency: Keep all location descriptions aligned with profiles
7. OPENING GROUNDING (required, first 1-2 paragraphs of EVERY chapter): (a) name the specific location from this list, (b) give at least 2 concrete sensory details (sound, smell, temperature, texture, light/shadow), and (c) one time-of-day or weather/atmosphere detail — BEFORE advancing plot, clues, or the mechanism. Open on the setting and the people in it, not on the puzzle.
8. This matters most in pre-reveal chapters that withhold the mechanism: ground them in setting and character rather than rushing the investigation — a withheld chapter is not an empty one.
9. Do NOT use generic repeated manor/storm filler without profile-specific details; vary the opening location/sense each chapter

SENSORY PALETTE (use 2-3 senses per scene):
The Oceanview Suite (interior):
  - Visual: dark storm clouds over the ocean, splintered furniture near the window, scattered personal belongings
  - Sounds: waves crashing violently against rocks, howling wind through the cracks, distant thunder rumbling
  - Scents: damp wood and mildew, salt air mixed with blood, burnt candle wax
  - Touch: cold metal of broken glass, soft fabric of a disheveled bedspread

The Grand Lobby (interior):
  - Visual: gleaming brass fixtures, intricate geometric patterns, large potted palms
  - Sounds: soft murmurs of conversation, the crackle of the fire, footsteps echoing on marble floors
  - Scents: freshly brewed coffee, polished wood and dust, the faint scent of perfume
  - Touch: smooth marble underfoot, soft plush upholstery

The Oceanview Dining Room (interior):
  - Visual: gleaming silver cutlery, fresh flowers on each table, sunlight glinting off the ocean
  - Sounds: clinking of plates and cutlery, soft murmur of conversations, the distant sound of waves crashing
  - Scents: aroma of freshly baked bread, scent of simmering seafood, whiff of rich sauces
  - Touch: smooth surface of the table, soft linen napkins

⛔ REFERENCE DATA — DO NOT TRANSCRIBE VERBATIM: The above profiles are structural guides only. Generate original prose that evokes these qualities; do not reproduce the exact phrasing or sentence structure of the profile paragraphs.

SCENE OPENING RULE: When opening a scene in a new location, write what the POV character directly observes and physically senses at that moment — not a general description of the room's qualities. The reader must feel pr
[truncated for prompt budget]

## Texture Pool
Draw on these as opportunities arise — you are not required to use them.

- Living in February 1948 means navigating a world still reeling from the scars of war and the shifting dynamics of society
- The coastal air is thick with the salt of the sea, mingling with the scent of damp earth from intermittent rain showers
- People gather in coastal hotels, seeking solace and connection amidst the uncertainty of the post-war era
- The echoes of wartime news broadcasts linger in the background, reminding everyone of the fragility of peace
- Daily life is marked by a cautious optimism, with gatherings filled with whispers of ambition and the unspoken pressures of social norms

TEMPORAL CONTEXT:

This story takes place in February 1948 during winter.

Seasonal Atmosphere:
- Weather patterns: overcast skies, intermittent rain showers, cold winds off the coast
- Daylight: Short days with daylight fading around five o'clock in the evening, making evenings feel enveloped in darkness.
- Seasonal activities: Indoor social gatherings at hotels and homes, Valentine's Day celebrations with romantic dinners, Coastal walks to enjoy the crisp winter air
- Seasonal occasions: Valentine's Day (February 14)
- Season: winter

Period Fashion (describe naturally):
- Men formal: double-breasted wool suit, tailored overcoat, silk tie
- Men casual: tweed jacket, corduroy trousers, knitted pullover
- Men accessories: fedora hat, leather gloves, watch chain
- Women formal: tea-length dress with fitted bodice, fur stole, pearl necklace
- Women casual: wool cardigan, A-line skirt, button-up blouse
- Women accessories: cloche hat, silk scarf, gloves

Cultural Context (reference naturally):
- Music/entertainment: Nat King Cole - 'Nature Boy', Frank Sinatra - 'I’ll Be Seeing You', Doris Day - 'Sentimental Journey'; Films: 'The Treasure of the Sierra Madre', 'Gentlemen's Agreement'; Theatre: 'Annie Get Your Gun', 'The King and I'; Radio: 'The Jack Benny Program', 'Suspense'
- Typical prices: Loaf of bread: four pence, Movie ticket: one shilling, Taxi fare: two shillings
- Current events: The United States recognizes Israel; The Cold War tensions escalate with the Soviet Union's influence in Eastern Europe
- Literature: 'The Naked and the Dead' by Norman Mailer | 'The Old Man and the Sea' by Ernest Hemingway | 'The Little Prince' by Antoine de Saint-Exupéry | [Mystery] | [Historical Fiction] | [Social Commentary]
- Technology: Transistor radio | Early color television sets | Jet engine advancements | Vacuum cleaners | Refrigerators | Washing machines
- Daily life: Gathering in local pubs for warmth and companionship, Attending community events or dances, Engaging in evening radio programs
- Social rituals: Evening tea served with biscuits, Sunday family gatherings for dinner, Valentine's Day gift exchanges

Atmospheric Details:
The air is thick with the scent of rain-soaked earth, mingling with the salt of the sea as waves crash rhythmically against the rocky shoreline. The muted glow of lamps casts long shadows in the hotel’s dimly lit corridors, echoing whispers of tense conversations and secrets yet to be revealed. The distant sound of a jazz band playing softly in the lounge drifts through the air, creating a warm contrast to the chill that seeps through the windows.

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
- Class indicators: Aristocrats discuss opera, servants discus
[truncated for prompt budget]

NON-NEGOTIABLE CHAPTER OBLIGATIONS — LOCKED EVIDENCE VALUES (VERBATIM REQUIRED):
The following measured values (times, amounts, measurements) are absolute ground truth. Every time this chapter describes, mentions, or alludes to one — no matter how briefly — it MUST use the exact phrase shown below, character for character. NO paraphrase, approximation, rounding, or synonym is permitted.

FAILURE EXAMPLE: if the locked value is "at thirteen minutes to midnight" and you write "just before midnight" or "around midnight" — that is a HARD FAIL. You must write "at thirteen minutes to midnight". Equally, if the locked value is written in words, such as "ten minutes past eleven", and you convert it to figure-based clock notation — that is also a HARD FAIL. Words stay as words; figure forms are forbidden for word-phrased facts.

CRITICAL — WORD-PHRASED VALUES: If the canonical value is written out in words (e.g. a time like "ten minutes past eleven", or an amount like "forty minutes"), reproduce those exact words. DO NOT convert to figure-based time notation, twenty-four-hour format, or any other numeric shorthand. Correct: "ten minutes past eleven". WRONG: figure-based clock notation or numeric shorthand.

Locked values:
  - The valve opened at this exact time, allowing the tide to flood the room.: "ten minutes past midnight"
  - The room was flooded to this height at the time of discovery, indicating the volume of water that entered.: "three feet"

If a value has no relevance to this chapter, omit it. But the moment you reference the underlying evidence, only the exact phrase above is acceptable.

⛔ CLUES TO SURFACE IN THESE CHAPTERS — mandatory:
The following evidence MUST be clearly observable to an attentive reader. Do not bury it in atmosphere or passing dialogue. Each clue must be concrete, specific, and noticeable:

• [clue_1] water, marks, wall, indicate, flooding, occurred, recently
  Category: testimonial | Criticality: essential | Supports inference step 2
  Points to: recent, flooding, event

• [clue_8] body, shows, signs, drowning, water, lungs, sodden, clothing
  Category: physical | Criticality: essential | Supports inference step 1
  Points to: manner, death

• [clue_core_contradiction_chain] Cross-check contradiction
  Category: structural | Placement: early (Act 1)
  Points to: what this observation reveals about the time or circumstances of the crime.

For each clue above: an attentive reader should be able to find, record, and later use it to reason toward the solution.

═══ NARRATIVE STATE (read-only — do not contradict) ═══

LOCKED FACTS — use verbatim whenever this evidence is described:
  • The valve opened at this exact time, allowing the tide to flood the room.: "ten minutes past midnight"
  • The room was flooded to this height at the time of discovery, indicating the volume of water that entered.: "three feet"

CHARACTER PRONOUNS — never deviate from these:
  • Eleanor Voss: she/her/her
  • Dr. Mallory Finch: she/her/her
  • Captain Ivor Hale: he/him/his
  • Beatrice Quill: she/her/her
  • Sylvia Trent: she/her/her
  • Hugo Vane: he/him/his

CLUES ALREADY REVEALED TO READER: clue_mechanism_visibility_core, clue_core_contradiction_chain — do not reveal these as new information.

INVESTIGATION LOG — WHAT IS ESTABLISHED (do not re-establish, do not repeat):
• Evidence already established (reference only — do NOT restate or quote these; advance beyond them): mechanism, used, flood, room | timing, high, tide, relation, flooding
• Suspects still unresolved: Captain Ivor Hale[HE], Beatrice Quill[SHE], Sylvia Trent[SHE]
⚠ The story must move FORWARD from this log. Any beat already listed above is forbidden from repeating.

⚠ THIS CHAPTER'S REQUIRED ADVANCE (opening): Discover the body, confirm the victim, establish the scene. The victim is found dead. They do not speak, react, or gesture. This is their only physical appearance — in all subsequent chapters they exist only in past tense (memory, evidence, testimony).

CONTINUITY HANDOFF — previous chapter closing beat:
  • "Outside, the wintry wind howled along the eaves, and the first rays of pale daylight crept across the flooded floor. Eleanor straightened, drawing herself up with the quiet resolve that had carried her through darker moments than this. The investigation had be..."
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
corridor, lobby

✓ RULE: Continue using this location vocabulary. Maintain consistency with established setting type.
✓ Do NOT introduce new location types that contradict earlier chapters.

**Recent Chapter Summary (for narrative continuity):**
Chapter 1: Chapter 1: The Flooded Room
  Events: Eleanor knelt beside Dr.

⚠️ **VALIDATION:** Character name mismatches and setting drift are common failure modes.
Double-check every character name against the list above before using it.

**⏱ LOCKED TIME ANCHOR — use verbatim, do not paraphrase:**
Clock time (from the case ground truth): **"High tide schedule posted in the lobby"**
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
Known location profile anchors: The Crestview Hotel, The Oceanview Suite, The Grand Lobby, The Oceanview Dining Room, the hotel lobby
LOCATION NAME CAPITALISATION (HARD REQUIREMENT — validated):
All named locations in your prose MUST use the EXACT capitalisation from the CML profiles.
Canonical forms: "The Crestview Hotel", "The Oceanview Suite", "The Grand Lobby", "The Oceanview Dining Room", "the hotel lobby"
Writing a location in lowercase (e.g. "drawing room" instead of "Drawing Room") is a validated error. Every time you mention a named location, copy its capitalisation from the list above.
- Chapter 2: OPENING STYLE (HARD): Start the VERY FIRST SENTENCE with spoken dialogue — e.g. '"[words]," [Name] said/asked/replied/murmured.' The opening quote must be the first character on the line. Anchor opening in "the hotel lobby". The opening style above governs only your FIRST SENTENCE; the grounding below may land anywhere in the first 2 paragraphs (it need not be sentence one, and never conflicts with the chosen opening style). HARD REQUIREMENT for the first 2 paragraphs: (a) include 2+ sensory words — choose from smell/scent/odor/fragrance/sound/echo/silence/whisper/creak/cold/warm/damp/rough/smooth/glow/shadow/flicker/dim — and (b) include 1+ atmosphere/time word — choose from rain/wind/fog/storm/mist/thunder/evening/morning/night/dawn/dusk/lighting/weather/season/afternoon/midday/noon/midnight/twilight/sunrise/sunset/daylight/sunlight/overcast/cloudy/bright/dark/grey/pale/chill/crisp/drizzle/haze/lamplight/firelight. These are validated requirements, not style suggestions; missing them triggers a retry.

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

PROMPT BUDGET SUMMARY: budget=24000 tokens; fixed=10321; context=12849; dropped=[none]; truncated=[location_profiles, temporal_context, pronoun_accuracy]

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
4. Integrate at least two concrete era-grounded details per chapter from setting refinement signals: radio broadcasting | early television sets | military radar | long-distance telephone calls | military encryption methods | telegram services.
5. Respect setting movement/access constraints in scene action and alibis: narrow corridors limiting movement | common areas with visibility restrictions | stairwell access to upper floors | staff-only areas such as the kitchen and service rooms | restricted access to guest floors after hours.
6. Sustain social coherence with this backdrop pressure: A seaside hotel hosts a gathering of war veterans, their families, and staff, all grappling with the societal shifts and traumas of the post-war era while secrets and tensions rise with the tide.
7. Maintain continuity around these socially central cast anchors where relevant: Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill, Sylvia Trent, Hugo Vane.
8. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Critical: Plot similarity 0.85 with 'The Second Key' (same era and crime method)
9. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Moderate: Character similarity 0.75 with 'The Second Key' (similar cast structure and roles)
10. STORY TO DATE ANTI-COPY RULE: The STORY TO DATE section below is provided for chronological and factual reference ONLY. You MUST NOT copy, lightly rephrase, or structurally echo any sentence or paragraph from prior chapters. Every sentence in this chapter must be original prose unique to this scene. Reusing even a clause from prior chapter text will cause this attempt to fail immediately.

CRITICAL PROSE REQUIREMENTS:

The CML specifies exact requirements for certain validation-critical scenes. You MUST include these elements at the specified positions.

**Discriminating Test Scene (Act 3, Scene 4):**
Required elements: Execute the discriminating test, Observe the culprit's reaction or result, Draw conclusion about guilt
Test type: temporal

**Suspect Clearance Scenes:**
- Captain Ivor Hale (Act 3, Scene 5): Witnesses confirm he was in the bar.
  Clues: clue_id_1, clue_id_2
- Beatrice Quill (Act 3, Scene 5): Discussion was personal and non-threatening.
  Clues: clue_id_1, clue_id_2
- Sylvia Trent (Act 3, Scene 5): Her investigation into Dr. Finch's past was unrelated to her death.
  Clues: clue_id_1, clue_id_2

**Culprit Revelation Scene (Act 3, Scene 6):**
Method: Confrontation with evidence showing Hugo Vane's access to the valve.

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
Investigation state at start: 2 clue(s) revealed to reader; approximately 3 unresolved suspect(s).
Must change by end: Increase or complicate suspicion through a new pressure revelation — WITHOUT resolving the case: do NOT name, accuse, or extract a confession from the culprit, make an arrest, or declare the case closed (that is reserved for the final reveal).
Suspect pressure target(s): Hugo Vane, Captain Ivor Hale, Beatrice Quill, Sylvia Trent
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
  - Scene is set in: the hotel lobby — reference it naturally within the paragraph, never as your opening phrase.
  - Opening atmosphere (MANDATORY — validator enforced): the first paragraph MUST contain at least one of: rain / wind / fog / storm / mist / thunder / evening / morning / night / dawn / dusk / season / afternoon / midday / noon / midnight / twilight / sunrise / sunset / daylight / sunlight / overcast / cloudy / bright / dark / grey / pale / cold / warm / chill / crisp / damp / drizzle / haze / lamplight / firelight. A chapter that omits all of these from its opening paragraph will be rejected.
  - PARAGRAPH OPENER DIVERSITY (MANDATORY — validator enforced): No more than 2 paragraphs in this chapter may begin with "Eleanor" or "Eleanor's" as the first word. You must vary paragraph openings throughout: use sensory observations, another character's name or action, dialogue, object or sound details, or temporal markers. Opening 3 or more paragraphs with "Eleanor" will cause automated rejection.
  - ⛔ MECHANISM SPOILER BAN: Do NOT state how the crime device was manipulated — not the direction, not the magnitude, not who performed it. Characters may only observe that two sources of evidence disagree. The specific method, tamper amount, and perpetrator's action are ALL FORBIDDEN until the reveal. WRONG: "The culprit had altered the device by forty minutes to create a false alibi." RIGHT: "Two independent pieces of evidence gave contradictory readings — a discrepancy neither could yet explain."
  - Continuity bridge: in the first 120 words, visibly connect from the previous chapter's final beat. Carry forward one unresolved element (object, accusation, emotional pressure, or immediate physical action) from: "Outside, the wintry wind howled along the eaves, and the first rays of pale daylight crept across the flooded floor. Eleanor straightened, drawing herself up with the quiet resolve that had carried her through darker mom...".
  - CLUE OBLIGATIONS — each clue below MUST be dramatized, but in YOUR OWN WORDS:
    Render each as something a character SEES, DOES, or SAYS on the page. The bracketed text is a
    DESCRIPTION of the evidence for you — do NOT transcribe it as narration. Copying a clue's
    description sentence verbatim into the prose FAILS validation.
    • tide, schedule, posted, lobby, showing, high, minutes, past, midnight [clue_core_contradiction_chain] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: timing, high, tide, relation, flooding
      ↳ MANDATORY TWO-PARAGRAPH STRUCTURE (must appear in paragraphs 1 or 2 — no later):
         Paragraph 1: The POV character physically approaches or directly observes this evidence.
           The narration or dialogue explicitly states what is seen (use the exact locked phrase if one applies).
         Paragraph 2 (immediately following): The detective or POV character explicitly reasons
           about what this evidence implies — who it implicates, why it may be unreliable,
           or what inference it supports. This must be a separate full paragraph, not a sentence appended to Paragraph 1.
    • wall, shows, clear, water, marks, three, feet, high [clue_1] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: recent, flooding, event
      ↳ MANDATORY TWO-PARAGRAPH STRUCTURE (must appear in paragraphs 1 or 2 — no later):
         Paragraph 1: The POV character physically approaches or directly observes this evidence.
           The narration or dialogue explicitly states what is seen (use the exact locked phrase if one applies).
         Paragraph 2 (immediately following): The detective or POV character explicitly reasons
           about what this evidence implies — who it implicates, why it may be unreliable,
           or what inference it supports. This must be a separate full paragraph, not a sentence appended to Paragraph 1.
    • finch, body, waterlogged, clothing [clue_8] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: manner, death
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
  - ALIBI LOCK: Hugo Vane's established alibi is "8 to 10 PM". Do NOT place Hugo Vane at any other location or in any other activity during the crime window. Any contradiction is a continuity error that triggers a retry.
  - TESTIMONY CONTINUITY: Hugo Vane has already made statements in earlier chapters. Any time, location, or claim attributed to Hugo Vane in THIS chapter must be consistent with those earlier statements. Do NOT introduce a new or different alibi claim — any contradiction is a continuity error.
  - Sensory obligation — use at least two of: dim light illuminating the lobby, shadows creeping along the walls | the ticking of a large clock, muffled laughter from guests | the scent of strong tea. Mood: quiet tension.
- Locked fact phrase obligations:
  - If this batch mentions The valve opened at this exact time, allowing the tide to flood the room., write exactly: "ten minutes past midnight".
  - If this batch mentions The room was flooded to this height at the time of discovery, indicating the volume of water that entered., write exactly: "three feet".
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
Investigation state at start: 2 clue(s) revealed to reader; approximately 3 unresolved suspect(s).
Must change by end: Increase or complicate suspicion through a new pressure revelation — WITHOUT resolving the case: do NOT name, accuse, or extract a confession from the culprit, make an arrest, or declare the case closed (that is reserved for the final reveal).
Suspect pressure target(s): Hugo Vane, Captain Ivor Hale, Beatrice Quill, Sylvia Trent
Required new information: At least one fear/motive/lie/loyalty reveal with investigative consequence.
Forbidden reveals at this stage: No culprit resolution: no confession, no arrest, no 'case closed', no accusation ('I accuse'/'I name'), and never state 'the culprit/murderer/killer is/was …'. The accusation is reserved for the final reveal — build suspicion only.

FROZEN FACT STATE (DO NOT ALTER):
- Timeline anchor: February (winter).
- Month, season, weather, and time-of-year language in this batch must stay compatible with winter.
- Established timeline fact: High tide schedule posted in the lobby
- Established timeline fact: Weather report
- If referenced, use exact phrase: "ten minutes past midnight" (The valve opened at this exact time, allowing the tide to flood the room.).
- If referenced, use exact phrase: "three feet" (The room was flooded to this height at the time of discovery, indicating the volume of water that entered.).

STORY TO DATE (REFERENCE ONLY — DO NOT COPY VERBATIM):
- Full prior chapter text is provided below for continuity, factual consistency, and reference accuracy.
- Use this to keep character voice, chronology, clue state, and location continuity aligned with earlier chapters.
- Do not quote, copy, or paraphrase these paragraphs too closely; write fresh prose that remains consistent with them.

--- BEGIN PRIOR CHAPTER 1 ---
Title: Chapter 1: The Flooded Room
Eleanor Voss pressed her gloved hand against the damp, peeling wallpaper as she stepped into the seaside hotel room, the chill of the wintry morning seeping through her wool coat. The air was heavy with the scent of salt and mildew, underscored by the faint metallic tang of something far more sinister. Rain tapped a nervous rhythm against the windowpanes, and the grey light of dawn struggled through the streaked glass, illuminating the chaos within. At the center of the room, Dr. Mallory Finch lay sprawled on the sodden carpet, her clothing waterlogged and clinging to her frame, her hair fanned out like dark kelp in a tide pool. The water pooled around her body was nearly three feet deep in places, lapping against the legs of an overturned chair and a battered suitcase. Eleanor’s breath caught in her throat as she registered the unnatural stillness—the only sound the distant roar of the surf and the mournful creak of the storm-battered hotel.

Eleanor knelt beside Dr. Mallory Finch, her journalist’s instinct warring with a surge of nausea. She noted the way the water had warped the floorboards and soaked the bedspread, the room transformed into a shallow lagoon. Her gaze was drawn to a warped wooden panel near the skirting board, slightly ajar, revealing the edge of a rusted valve—its surface slick with recent use. The discovery was subtle, almost hidden by the shadows, but unmistakable: something here had been disturbed. Rising, Eleanor’s eyes flicked to the battered tide schedule pinned to the wall just outside the door, the ink smudged but legible. High tide had been marked in bold: ten minutes past midnight. The timing was uncomfortably precise, as if the sea itself had pressed too close to the room’s fragile boundaries.

She straightened, her mind already assembling the first fragile links in the chain of suspicion. If the valve had been moved and the tide so precisely marked, then Dr. Mallory Finch’s drowning could not be dismissed as mere misfortune. Someone in the hotel had access to the knowledge—and perhaps the means—to exploit the relentless rhythm of the sea. The posted schedule in the lobby, visible to any guest or staff member, made the timing accessible to all. Eleanor’s pulse quickened, not just with the shock of the scene, but with the knowledge that every detail—the hidden valve, the precise tide, the flooded floor—hinted at more than nature’s indifference. She forced herself to take in the room again, searching for further evidence, aware that the truth would be buried beneath layers of water and secrecy.

A muffled footstep in the corridor drew Eleanor’s attention. Captain Ivor Hale appeared in the doorway, his overcoat buttoned to the throat, the lines of his face set in grim determination. He was known among the guests as an estranged relative of Dr. Mallory Finch, and his presence now seemed both inevitable and fraught. He hovered at the threshold, eyes fixed on the body, but his hand gripped the watch chain in his pocket with a tension that belied his composed exterior. Eleanor’s immediate impression was of a man accustomed to command, yet thrown off balance by the intimacy of this violence. She offered no greeting, only a measured nod, waiting to see how he would react.

Captain Ivor Hale’s voice was low, almost hoarse. “Is it—was it the storm, do you think?” He did not move closer, as if the water’s edge marked a boundary he dared not cross. Eleanor watched him carefully, noting the way his gaze avoided the valve and flicked instead to the tide schedule. There was something guarded in his manner, a reluctance to say more. She wondered whether his reserve masked grief, guilt, or simply a soldier’s habit of withholding judgment until the facts were clear.

Behind him, Beatrice Quill hovered uncertainly, her gloved hands twisting the strap of her handbag. Beatrice was a frequent companion of Dr. Mallory Finch, her presence in the hotel explained by a shared interest in literature and the arts. She peered into the room with wide, anxious eyes, her breath visible in the cold air. “I—I heard the water running, but I thought it was only the pipes again,” she whispered, her voice trembling. “Mallory said the plumbing here was unreliable.” Beatrice’s words tumbled out in a rush, but she shrank back as Eleanor’s gaze met hers, as if fearing that any further admission might implicate her.

Eleanor stood, brushing droplets from her skirt, and addressed the room with a calm she did not feel. “We mustn’t disturb anything further. The circumstances are… peculiar.” She hesitated, choosing her words with care. “If anyone saw or heard anything unusual after midnight, I’d ask that you recall it as precisely as possible.” Her tone, though gentle, brooked no argument. She was the investigator now, and everyone present seemed to sense it.

Sylvia Trent entered with a briskness that contrasted sharply with the tension in the air. Her tailored suit and pearl necklace marked her as a woman of means, and her association with Dr. Mallory Finch was well known—Sylvia had recently become a financial benefactor, supporting Dr. Mallory Finch’s research. She surveyed the flooded room with narrowed eyes, the set of her jaw betraying a steely resolve. “This is no accident,” Sylvia said, voice clipped. “Mallory was careful—meticulous. She would never have left a valve open, not with the tide so high.” There was a challenge in her words, as if daring anyone to contradict her. Yet her fingers trembled as she adjusted her scarf, betraying an undercurrent of distress.

Hugo Vane lingered at the back, his presence marked more by silence than by speech. He was an ambitious outsider, recently arrived at the hotel under the pretense of seeking business opportunities. His gaze darted from the valve to the tide schedule, then to Eleanor, as if weighing the significance of each detail. Hugo’s posture was relaxed, almost casual, but his eyes were too bright, his attention too sharply focused on the mechanics of the room. Eleanor made a mental note of his interest; in her experience, those who watched too closely often had something to hide.

The silence stretched, broken only by the distant rumble of thunder and the soft drip of water from the ruined ceiling. Eleanor caught her breath, steadying herself as she surveyed the scene. The evidence was all around her: Dr. Mallory Finch’s waterlogged clothing, the unnatural flooding, the hidden valve, and the tide schedule marked with the fatal hour. Each detail pressed upon her, demanding explanation. Yet the true sequence of events—the precise means by which the sea had invaded—remained just out of reach, the answer submerged in ambiguity.

She turned away from the body, her mind already racing ahead. The war had left its mark on everyone in this hotel, shaping their secrets and ambitions. In the grey morning light, with the wind rattling the windowpanes and the scent of damp wood in her nostrils, Eleanor resolved to pursue the truth wherever it led. The first question was clear: who had been aware of the tide’s timing, and why had Dr. Mallory Finch been left to drown in her own room?

As the others withdrew, murmuring among themselves, Eleanor lingered by the warped panel, her fingers tracing the edge of the hidden valve. The cold metal was slick beneath her touch, and she felt a shiver that had nothing to do with the weather. She would have to ask difficult questions, and she suspected the answers would be equally unsettling. For now, the only certainty was that Dr. Mallory Finch had not died by accident. The sea had played its part, but the hand behind the tragedy remained unseen.

Outside, the wintry wind howled along the eaves, and the first rays of pale daylight crept across the flooded floor. Eleanor straightened, drawing herself up with the quiet resolve that had carried her through darker moments than this. The investigation had begun—not with a shout, but with the silent promise that no secret would remain submerged for long.
--- END PRIOR CHAPTER 1 ---

[SCENE COMPLETENESS CONTRACTS — MANDATORY. Each contract below lists what you MUST enact in that chapter. Do not summarise or mention these labels in the prose — enact them organically.]
Chapter 2 (Act 1) completeness contract:
  PIVOT ELEMENT (MANDATORY — write this into the prose, shown not told): "The conflicting accounts of the time of death provided by the suspects."
  FACT ESTABLISHED (MANDATORY — reader must know this by chapter end): "Establishes that the victim's death coincided with high tide, contradicting initial alibis."

# Case Overview
Title: Tide's Deception
Era: 1940s
Setting: A seaside hotel built in the early 1920s
Crime: murder (drowning)
Culprit: Hugo Vane
Victim: Dr. Mallory Finch
False assumption: Dr. Finch drowned during a storm surge, as indicated by the high tide.
Cast: Eleanor Voss (she/her), Dr. Mallory Finch (she/her), Captain Ivor Hale (he/him), Beatrice Quill (she/her), Sylvia Trent (she/her), Hugo Vane (he/him)

Setting Lock: Keep all scenes and descriptions consistent with the stated setting (A seaside hotel built in the early 1920s). Do not introduce a different location type. Do not invent an alternative estate name. The only permitted name for this property is "A seaside hotel built in the early 1920s" — any other estate name (e.g., "Caldwell Manor", "Ashwood Hall", or any invented proper name) is a continuity error that will be caught and rejected.

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
      "location": "the hotel lobby",
      "timeOfDay": "Mid-morning",
      "atmosphere": "Chaotic as guests speculate about the incident"
    },
    "characters": [
      "Eleanor Voss",
      "Dr. Mallory Finch",
      "Hugo Vane",
      "Captain Ivor Hale",
      "Beatrice Quill",
      "Sylvia Trent"
    ],
    "purpose": "Establish the initial investigation and introduce suspects",
    "cluesRevealed": [
      "clue_1",
      "clue_8"
    ],
    "dramaticElements": {
      "conflict": "Suspects begin to argue over their whereabouts.",
      "tension": "Eleanor feels the weight of suspicion from the guests.",
      "microMomentBeats": [
        "Eleanor's hands tremble as she takes notes, feeling the pressure of the crowd's gaze."
      ]
    },
    "summary": "In the hotel lobby, chaos ensues as guests discuss the drowning. Eleanor interviews Dr. Mallory Finch, who reveals that the victim was found shortly after high tide. Hugo Vane, Captain Hale, Beatrice Quill, and Sylvia Trent all provide their alibis.",
    "beat": "crime",
    "estimatedWordCount": 1250,
    "pivotElement": "The conflicting accounts of the time of death provided by the suspects.",
    "factEstablished": "Establishes that the victim's death coincided with high tide, contradicting initial alibis.",
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
        "characterName": "Hugo Vane",
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
    "emotionalRegister": "Rising tension grips Eleanor as she unravels the first clues amidst a web of deceit.",
    "dominantCharacterNote": {
      "name": "Eleanor Voss",
      "voiceRegister": "Eleanor speaks with a rhythmic cadence, often punctuating her observations with a raised eyebrow or a knowing smile."
    },
    "humourGuidance": {
      "permission": "forbidden"
    },
    "eraTextureNote": "Short daylight hours limiting outdoor activities; Cold winds making coastal walks uncomfortable; Limited access to goods due to post-war shortages; Rationing still affecting food availability; Intermittent rain disrupting travel plans",
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
□ Chapter 2: the clue [clue_core_contradiction_chain] (reveals, timing, high, tide, flooding, occur) is placed in the first 25% of the chapter, dramatized in your own words, followed by an explicit inference or suspicion paragraph.
□ Chapter 2: the clue [clue_1] (water, marks, wall, indicate, flooding, occurred, recently) is placed in the first 25% of the chapter, dramatized in your own words, followed by an explicit inference or suspicion paragraph.
□ Chapter 2: the clue [clue_8] (body, shows, signs, drowning, water, lungs, sodden, clothing) is placed in the first 25% of the chapter, dramatized in your own words, followed by an explicit inference or suspicion paragraph.
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
