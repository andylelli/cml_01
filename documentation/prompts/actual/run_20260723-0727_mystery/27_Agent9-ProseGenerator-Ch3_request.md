# Actual Prompt Record

- Run ID: `mystery-1784791658913`
- Project ID: ``
- Timestamp: `2026-07-23T07:38:15.805Z`
- Agent: `Agent9-ProseGenerator-Ch3`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4.1`
- Temperature: `0.42`
- Max Tokens: `4500`
- Attempt: `first`
- Prompt Hash: `c02081b2d364decf`

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
- MORAL COMPLEXITY REQUIREMENT: The mechanism of this crime carries a moral gray area: "The murderer was driven by a desperate need to protect a loved one, blurring the lines between right and wrong." — the culprit reveal and denouement MUST acknowledge this ambiguity. Do not let the ending feel clean or simple. Give the reader at least one moment of uncomfortable sympathy or moral doubt.

- CHAPTER OPENING (every chapter, lint-enforced): never open on a tour or inventory of named rooms/places. The first sentence must land a character ACTION, a specific sensory detail, or a concrete in-scene moment — not "In the [room], the [room], and the [room]…". Locations enter through what a character does in them, one at a time.
- VICTIM IDENTITY (HARD CONSTRAINT — lint-enforced): Sylvia Trent is the murder victim, already dead before this chapter. They do NOT speak, enter, react, gesture, or appear in any present-tense scene. When Sylvia Trent is referenced at all, it may ONLY be as: (a) physical evidence/the body, or (b) REPORTED memory/testimony — and reported references MUST be framed as recollection, never as a live beat. WRONG: `Sylvia Trent said, "…"` / `Sylvia Trent turned to him`. RIGHT: `Sylvia Trent had said, weeks before, that…` / `Agnes remembered how Sylvia Trent used to…`. Attach an explicit recollection frame ("had", "remembered", "recalled", "before she died", "in life") to any sentence that names Sylvia Trent beside an action or speech verb. A live dialogue tag or present action for Sylvia Trent is a continuity failure that will be rejected and regenerated.

⚠️ AMATEUR DETECTIVE STORY: The investigator is a civilian with no official standing. The official police (if they appear) are unnamed background figures only — "a constable", "the sergeant", "an officer from the village". Do NOT give any police official a name or title+surname combination. There is no Inspector [Surname], no Constable [Surname], no Sergeant [Surname] in this story.


CRITICAL CHARACTER CONSISTENCY RULES:

1. Each character has ONE canonical name. Use ONLY names from this list. Never vary, abbreviate, or add titles beyond what is listed.
   COMPLETE CAST (no other named characters exist): Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill, Sylvia Trent (DECEASED), Hugo Vane
   - "Mr. Jennings entered the room" → ILLEGAL. Jennings is not in the cast.
   - "Constable Reed took notes" → ILLEGAL. Reed is not in the cast.
   - "A constable took notes" → LEGAL (no name given).

2. Character roles are fixed:
   - Eleanor Voss: Amateur Sleuth / Civilian Investigator
   - Dr. Mallory Finch: Mysterious Expert
   - Captain Ivor Hale: Steadfast Traditionalist
   - Beatrice Quill: Ambitious Heir
   - Sylvia Trent: victim (DECEASED — does not appear in any scene, past tense only)
   - Hugo Vane: Cunning Manipulator
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

## Era: 1949-12
Living in December 1949 means navigating a world still adjusting to the aftermath of World War II. The United Kingdom is experiencing a push towards recovery with signs of economic improvement, but beneath the surface, tensions linger from the Cold War. Daily life is marked by the hustle of holiday preparations amid uncertainty regarding the future. This is a time when women increasingly occupy roles in the workforce, leading to shifting dynamics in both home and public spaces.
Emotional register: A mix of cautious optimism tempered by underlying fears permeates society during this time.
Physical constraints: Limited transportation options due to rationing and post-war shortages. | Communication is slower, with reliance on postal services and landlines. | Cultural events are tightly packed around the holiday season, leading to crowded venues.
Current tensions (weave into background texture): The establishment of NATO is intensifying political divisions in Europe. | Rising inflation is causing concerns for many families. | The Cold War is fostering paranoia and suspicion in society.
Wartime context — Many men returning from war are struggling to reintegrate into civilian life, carrying the burdens of their experiences.: Communities are tightly knit, sharing both the weight of grief and hope for the future. Absence effect: The absence of those who served in the war lingers in conversations, reminding families of sacrifice.

## Story Theme
The narrative explores how the facade of social elegance can mask deeper truths, revealing the precarious nature of identity and the consequences of deception within a context of societal change.

## Story Emotional Register
Dominant: A tense atmosphere builds throughout the story, reflecting the interplay between social elegance and hidden truths.

Arc:
The Grand Seaside Hotel stands as a monument to elegance and charm, but on the evening of the masquerade, a heavy sense of foreboding cloaks it. Guests arrive with anticipation, unaware that the night will soon unravel into chaos. As the party progresses, the murder of beloved performer Sylvia Trent sends shockwaves through the gathering, igniting a frantic investigation led by the resourceful Eleanor Voss, whose own past looms large over her pursuits. Initial clues provide little guidance, leading to red herrings and a rising emotional cost among the suspects, each grappling with their own secrets. The investigation pivots when Eleanor discovers an identical costume, altering the direction of her inquiries and reigniting her desperation to restore her reputation. As the tension escalates, the stage is set for a confrontation that exposes Captain Ivor Hale's duplicity, revealing the lengths he went to mask his identity. The climax builds as Eleanor, faced with the truth of Hale's duality, must confront her fears and the implications of her own truth-seeking journey. The resolution leaves the guests forever changed, as each character reflects on the costs of their choices within the intricate web of deception spun during the masquerade.

The story opens: A hopeful atmosphere is quickly overshadowed by an impending sense of doom. As the investigation takes shape: Unease mounts as whispers of trouble circulate among the guests. A first key turn arrives: The discovery of Sylvia's murder transforms the evening into a nightmare. At the mid-point of the story: A critical clue shifts the focus of the investigation towards Hale.

A second pivot reshapes the course: A revelation connects Hale's motives to his troubled past. As tension reaches its height: The pressure builds as Eleanor confronts the truth about her own fears. The climax brings the central question to a head:.

## Emotional register at this point in the story
Unease mounts as whispers of trouble circulate among the guests.

## Character Portraits (appearance & era)

### Eleanor Voss
Eleanor Voss exemplifies the era’s shifting dynamics as a woman journalist asserting her place within a male-dominated field. The post-war environment empowers her as she seeks truth and stories, yet the shadows of her family’s past challenge her pursuit of a credible identity.
Era intersection: Her desire for credibility intersects with societal expectations, revealing the ongoing struggle women face for recognition in the workplace.

### Dr. Mallory Finch
Dr. Mallory Finch represents the progressive values of the time, advocating for mental health awareness while grappling with her own vulnerabilities. The societal shifts post-war create an environment where her professional ethics clash with personal fears, adding depth to her character.
Era intersection: Her secret ties into the growing awareness of mental health issues, reflecting the era’s budding discussions around personal accountability.

### Captain Ivor Hale
Captain Ivor Hale embodies the post-war male experience, struggling with PTSD and the repercussions of his wartime actions. While society expects him to uphold traditional values, he faces an internal battle that complicates his relationships and interactions.
Era intersection: His character highlights the societal pressure on veterans as they adjust to civilian life while grappling with their haunting memories.

### Beatrice Quill
Beatrice Quill captures the desperation of a rising socialite navigating financial difficulties amid the glamorous but superficial world of high society. Her story reflects the tensions of social status and personal integrity in a post-war context.
Era intersection: Her situation sheds light on the era's expectations around wealth and appearance, emphasizing the facade many felt pressured to maintain.

### Hugo Vane
Hugo Vane represents the morally ambiguous world of post-war finance, engaging in shady dealings while navigating social circles. His character highlights the tension between ambition and ethics, resonating with the era's shifting economic landscape.
Era intersection: His story echoes the growing concerns about financial integrity, reflecting broader societal issues of trust and transparency.

## Character Voices

### Eleanor Voss (she/her/her)
Eleanor's voice is fluid and inviting, often drawing listeners in with her insightful commentary.
[comfortable] Let's unpack that, shall we? Life is a journey, after all.
[evasive] Oh, I’d rather not dwell on the past. Let's focus on the future.
[stressed] I didn't do anything wrong! I'm just trying to find the truth!
Humour: Eleanor uses dry wit to navigate tense situations, making her humor subtle yet impactful.

### Dr. Mallory Finch (she/her/her)
Dr. Finch’s tone is measured and clinical, reflecting her professional background while revealing her underlying anxiety.
[comfortable] Ah, the irony of it all. We think we know ourselves, don’t we?
[evasive] It's best not to dwell on such matters. Focus on what we can control.
[stressed] This isn't just about the murder. It's about my entire career!
Humour: Her use of irony creates a sharp contrast to her more serious conversations.

### Captain Ivor Hale (he/him/his)
Captain Hale speaks with a strong, commanding presence, often incorporating military jargon.
[comfortable] Just another day in paradise, or so they say.
[evasive] I’m just taking a walk. Nothing to see here.
[stressed] You don't understand! My honor is at stake!
Humour: Ivor’s self-deprecating humor adds a layer of complexity to his character.

### Beatrice Quill (she/her/her)
Beatrice’s voice carries a dramatic flair, laced with playful sarcasm and sharp observations.
[comfortable] Well, darling, isn’t that just the cherry on top?
[evasive] Oh, come now. We wouldn’t want to ruin the party, would we?
[stressed] I can't afford to lose everything; I just can’t!
Humour: Her sardonic wit serves as both a defense mechanism and a way to charm others.

### Hugo Vane (he/him/his)
Hugo’s tone is direct and casual, often turning serious topics into blunt observations.
[comfortable] It's all just numbers, really. Nothing personal.
[evasive] Truthfully, I was busy. Who can keep track of everything?
[stressed] This is not how I wanted my career to end!
Humour: His blunt humor often serves to mask deeper insecurities.

## Location Registers (scene framing guides)

Main Lobby: The Main Lobby feels like the heart of the hotel, filled with a mix of anticipation and tension as guests navigate through whispered conversations and concealed secrets, all framed by its grand Art Deco elegance.. Camera angle: A wide shot captures the guests milling about, interspersed with close-ups on their anxious faces, highlighting the tension beneath the surface.. Era: Its opulent design reflects the lavish lifestyle of the post-war era, contrasting with the shadows of hidden truths that pervade the evening.

Dining Hall: The Dining Hall buzzes with a festive yet anxious energy, where sumptuous meals are served beneath elegant chandeliers, and every laugh and clink of glass is laced with the underlying fear of the unknown.. Camera angle: The camera pans across the dining tables, capturing the elegant displays, then focuses on the guests exchanging nervous glances.. Era: The grandeur of the hall stands in stark contrast to the growing unease amongst the guests as secrets threaten to surface.

Guest Rooms: The Guest Rooms evoke a sense of intimacy and isolation, where the remaining echoes of laughter from the hall are replaced by silence, and the air is thick with personal secrets waiting to unfold.. Camera angle: A close-up shot on a scattered mask on a dresser, followed by a shot of a figure pacing nervously in the dim light.. Era: These rooms serve as private retreats where societal facades can dissolve, revealing raw emotions amidst the glamour of the evening.

Staff-Only Area: The Staff-Only Area feels industrious yet mundane, filled with a sense of urgency as staff prepare for the evening's events, unaware of the drama unfolding above them.. Camera angle: The camera captures busy staff moving in and out, focusing on the stark differences between their world and that of the guests.. Era: This space's practical design reflects the post-war necessity for efficiency while contrasting the luxurious experiences enjoyed by the guests.

## Humour guidance for this story position (early)
Permission: permitted
Characters who may be funny: Eleanor Voss
Permitted forms: dry_wit
Rationale: Eleanor can use humor to navigate the tensions during her initial inquiries.

## Reveal Groundwork (texture — do not explain, only plant)
- Plant one subtle observable beat related to: "Plant one subtle anomaly that can be re-read after the resolution.". Do not explain significance yet.
- Plant one subtle observable beat related to: "Additionally, the discovery of identical costumes retroactively clarifies the confusion surrounding the timelines". Do not explain significance yet.
- Plant one subtle observable beat related to: "Lastly, Eleanor's pursuit of the truth, which seemed solely about the murder, now connects to her own struggle with identity and the implications of unveiling hidden truths in her life". Do not explain significance yet.

FAIR-PLAY AND INFERENCE CONTRACT:
- FAIR PLAY CLUE TIMING: Never combine clue discovery and detective deduction in the same chapter. If a clue is first revealed to the reader in chapter N, the detective may only analyze, deduce from, or act on that clue in chapter N+1 or later.
- FAIR PLAY INFORMATION PARITY: The reader must see all clues BEFORE the detective uses them in reasoning. If the detective performs a test or makes a deduction, every piece of evidence supporting that conclusion must have been shown to the reader in earlier chapters.
- FAIR PLAY REVELATION SPACING: In the discriminating test scene, the detective can ONLY use clues that were revealed to the reader at least 1 full chapter earlier. Never introduce new clues or withheld information during the test.
- FAIR PLAY CONFRONTATION: During the final confrontation/revelation, the detective cannot surprise the reader with facts. Every piece of evidence cited must have been visible to the reader in prior chapters.
- Never solve by withheld information. Keep reader-information parity with detective reasoning.
- False assumption in force: Witnesses confidently claim they saw Sylvia in the ballroom at the time of the murder.
- Hidden truth to progressively expose (compose in your own words from these elements): true, presence, killer, using, disguise
- Inference path checkpoints to dramatize clearly — compose ENTIRELY in your own sentences from these key terms (reproducing any briefing phrase verbatim FAILS validation):
  - Step 1: obs: witnesses, recall, seeing, sylvia, distinctive, costume, shortly, before, murder | corr: sylvia, ballroom, real, must, elsewhere | effect: narrows, opportunity, captain, ivor, hale, access, costume
  - Step 2: obs: identical, masks, captain, hale, room | corr: captain, hale, means, opportunity, impersonate, sylvia | effect: eliminates, mallory, finch, suspicion, lacked, access, costume
  - Step 3: obs: timing, music, performance, coincided, murder | corr: distraction, provided, captain, hale, perfect, cover, switch, costumes | effect: narrows, suspicion, captain, hale, exploit, distraction
- Discriminating test method: trap
- Discriminating test elements to dramatize (compose ENTIRELY in your own sentences from these — do NOT reproduce any briefing phrase verbatim): measurements, masks, costumes, captain, hale, possession, reveals, identical
- Test must rely on already-shown clue IDs: clue_core_contradiction_chain_3, clue_culprit_direct_captain_ivor_hale, clue_early_2
- Fair-play rationale: Step 1: The witness testimony about the costume and timeline established the original false assumption. Step 2: Discovery of identical masks in Hale's room eliminated Dr. Finch and confirmed Hale's opportunity. Step 3: Timing of the music performance provided a motive, culminating in the comparative analysis of the costumes that confirmed Hale's involvement.

## Character Reference

### Eleanor Voss (she/her — NEVER he/him)
Eleanor speaks with a fluidity that belies her investigative instincts, often using metaphors related to travel and exploration
She has a tendency to ask rhetorical questions, drawing her listeners into her thought process.
Haunted by her family's mental illness history, Eleanor fears that pursuing the truth may unearth darker facets of her own identity.
Voice colour: Eleanor Voss uses dry wit humour — let it surface in their dialogue where natural, not in every line.

### Dr. Mallory Finch (she/her — NEVER he/him)
Finch speaks with a measured tone, often punctuating her sentences with clinical terminology
She has a habit of using irony to mask her discomfort, especially when discussing sensitive topics.
Mallory battles with the weight of her professional ethics versus her desire to protect herself, torn between her duty as a psychiatrist and the fear of losing everything.
Voice colour: Dr. Mallory Finch uses polite savagery humour — let it surface in their dialogue where natural, not in every line.

### Captain Ivor Hale (he/him — NEVER she/her)
Ivor speaks with a commanding presence, often using military jargon
His sentences are punctuated with a dry, self-deprecating humor that belies his inner turmoil.
Ivor grapples with the haunting memories of his past actions during the war, fearing exposure and the judgment of society.

### Beatrice Quill (she/her — NEVER he/him)
Beatrice speaks with a flair for the dramatic, often using exaggerated expressions and witty banter
She has a tendency to punctuate her sentences with cutting remarks that reveal her sharp tongue.
Beatrice wrestles with the fear of losing her social status and the lengths she is willing to go to maintain her façade.
Voice colour: Beatrice Quill uses sardonic humour — let it surface in their dialogue where natural, not in every line.

### Hugo Vane (he/him — NEVER she/her)
Hugo speaks with a directness that can be disarming, often using colloquial language and a casual demeanor
He has a knack for turning serious topics into blunt observations.
Hugo struggles with the fear of being exposed for his shady dealings, torn between his ambition and the moral implications of his actions.
Voice colour: Hugo Vane uses blunt humour — let it surface in their dialogue where natural, not in every line.


## CHARACTER CONTRACTS (binding for this scene)
Each entry below constrains how this character must be written in this chapter.
These override generic style guidance when they conflict.

### Eleanor Voss[SHE]
Voice & mannerisms: Eleanor speaks with a fluidity that belies her investigative instincts, often using metaphors related to travel and exploration. She has a tendency to ask rhetorical questions, drawing her listeners into her thought process.
SIGNATURE TIC (use sparingly — this is Eleanor Voss's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "Let's unpack that, shall we?"
Sample voice fragments (match this register and rhythm):
  [comfortable] "Let's unpack that, shall we? Life is a journey, after all."
  [evasive] "Oh, I’d rather not dwell on the past. Let's focus on the future."
Humour: dry wit — deploy occasionally (level 0.5)
FORBIDDEN phrase (never write for Eleanor Voss): "a surge of determination washed over her"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "N/A" — do not surface in Act I.

### Dr. Mallory Finch[SHE]
Voice & mannerisms: Dr. Finch speaks with a measured tone, often punctuating her sentences with clinical terminology. She has a habit of using irony to mask her discomfort, especially when discussing sensitive topics.
SIGNATURE TIC (use sparingly — this is Dr. Mallory Finch's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "Ah, the irony of it all."
Sample voice fragments (match this register and rhythm):
  [comfortable] "Ah, the irony of it all. We think we know ourselves, don’t we?"
  [evasive] "It's best not to dwell on such matters. Focus on what we can control."
Humour: polite savagery — deploy occasionally (level 0.4)
FORBIDDEN phrase (never write for Dr. Mallory Finch): "she felt a wave of unease"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Victim threatened to expose her malpractice case to the public." — do not surface in Act I.

### Captain Ivor Hale[HE]
Voice & mannerisms: Ivor speaks with a commanding presence, often using military jargon. His sentences are punctuated with a dry, self-deprecating humor that belies his inner turmoil.
SIGNATURE TIC (use sparingly — this is Captain Ivor Hale's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "Just another day in paradise."
Sample voice fragments (match this register and rhythm):
  [comfortable] "Just another day in paradise, or so they say."
  [evasive] "I’m just taking a walk. Nothing to see here."
Humour: self deprecating — deploy rarely (level 0.3)
FORBIDDEN phrase (never write for Captain Ivor Hale): "she knew with certainty she was right"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Victim discovered Ivor's past war crimes and threatened to expose him." — do not surface in Act I.

### Beatrice Quill[SHE]
Voice & mannerisms: Beatrice speaks with a flair for the dramatic, often using exaggerated expressions and witty banter. She has a tendency to punctuate her sentences with cutting remarks that reveal her sharp tongue.
SIGNATURE TIC (use sparingly — this is Beatrice Quill's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "Well, darling, isn't that just the cherry on top?"
Sample voice fragments (match this register and rhythm):
  [comfortable] "Well, darling, isn’t that just the cherry on top?"
  [evasive] "Oh, come now. We wouldn’t want to ruin the party, would we?"
Humour: sardonic — deploy occasionally (level 0.6)
FORBIDDEN phrase (never write for Beatrice Quill): "palpable tension filled the room"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Victim promised financial assistance but reneged, leaving Beatrice in a bind." — do not surface in Act I.

### Hugo Vane[HE]
Voice & mannerisms: Hugo speaks with a directness that can be disarming, often using colloquial language and a casual demeanor. He has a knack for turning serious topics into blunt observations.
SIGNATURE TIC (use sparingly — this is Hugo Vane's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "It's all just numbers, really."
Sample voice fragments (match this register and rhythm):
  [comfortable] "It's all just numbers, really. Nothing personal."
  [evasive] "Truthfully, I was busy. Who can keep track of everything?"
Humour: blunt — deploy frequently (level 0.7)
FORBIDDEN phrase (never write for Hugo Vane): "she chose her words with great care"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Victim was about to expose Hugo’s financial fraud to the authorities." — do not surface in Act I.



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

- Living in December 1949 means navigating a world still adjusting to the aftermath of World War II
- The United Kingdom is experiencing a push towards recovery with signs of economic improvement, but beneath the surface, tensions linger from the Cold War
- Daily life is marked by the hustle of holiday preparations amid uncertainty regarding the future
- This is a time when women increasingly occupy roles in the workforce, leading to shifting dynamics in both home and public spaces.

TEMPORAL CONTEXT:

This story takes place in December 1949 during winter.

Seasonal Atmosphere:
- Weather patterns: cool and overcast, occasional rain, chilly winds from the coast
- Daylight: Short days with limited sunlight; twilight begins around four o'clock in the afternoon and darkness falls soon after.
- Seasonal activities: attending holiday parties, shopping for gifts, decorating homes with festive lights
- Seasonal occasions: Christmas, Hanukkah
- Season: winter

Period Fashion (describe naturally):
- Men formal: black wool tuxedo with satin lapels, white dress shirt with a bow tie, black patent leather shoes
- Men casual: tweed blazer, corduroy trousers, knit pullover
- Men accessories: silver cufflinks, feathered masquerade mask, wool scarf
- Women formal: floor-length evening gown with intricate beading, elegant wrap or stole, high-heeled shoes
- Women casual: A-line skirt with a fitted sweater, tweed coat, tailored trousers
- Women accessories: sparkling clutch purse, statement jewelry, feathered headpiece

Cultural Context (reference naturally):
- Music/entertainment: 'Rudolph the Red-Nosed Reindeer' by Gene Autry, 'The Christmas Song' by Nat King Cole, 'Some Enchanted Evening' from South Pacific; Films: The Third Man, White Heat; Theatre: A Streetcar Named Desire, South Pacific; Radio: The Jack Benny Program, Suspense
- Typical prices: Loaf of bread: four pence, Cigarettes: two shillings, Movie ticket: one shilling
- Current events: the establishment of NATO in April 1949; growing tensions in Eastern Europe after the Berlin Blockade
- Literature: Nineteen Eighty-Four by George Orwell | The Catcher in the Rye by J.D. Salinger | The Old Man and the Sea by Ernest Hemingway | [detective fiction] | [science fiction] | [romantic novels]
- Technology: transistor radio | television remote control | early computers in research labs | radio sets in homes | typewriters in offices | early television sets in affluent households
- Daily life: gathering for holiday festivities, shopping in bustling downtown areas, attending church services for Christmas
- Social rituals: exchanging holiday cards, hosting festive dinners with family and friends

Atmospheric Details:
The scent of pine and cinnamon fills the air, mingling with the muted sounds of chatter and laughter as guests arrive, their excitement palpable. Rain patters softly against the windows of the hotel, casting a soft glow on the elegant decorations, while the flickering lights reflect the anticipation of the evening's masquerade. The clinking of glasses and the rustle of silk gowns create a symphony of elegance, contrasting sharply with the undercurrent of tension that whispers through the crowd as rumors swirl.

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
- Social commentary: C
[truncated for prompt budget]

NON-NEGOTIABLE CHAPTER OBLIGATIONS — LOCKED EVIDENCE VALUES (VERBATIM REQUIRED):
The following measured values (times, amounts, measurements) are absolute ground truth. Every time this chapter describes, mentions, or alludes to one — no matter how briefly — it MUST use the exact phrase shown below, character for character. NO paraphrase, approximation, rounding, or synonym is permitted.

FAILURE EXAMPLE: if the locked value is "at thirteen minutes to midnight" and you write "just before midnight" or "around midnight" — that is a HARD FAIL. You must write "at thirteen minutes to midnight". Equally, if the locked value is written in words, such as "ten minutes past eleven", and you convert it to figure-based clock notation — that is also a HARD FAIL. Words stay as words; figure forms are forbidden for word-phrased facts.

CRITICAL — WORD-PHRASED VALUES: If the canonical value is written out in words (e.g. a time like "ten minutes past eleven", or an amount like "forty minutes"), reproduce those exact words. DO NOT convert to figure-based time notation, twenty-four-hour format, or any other numeric shorthand. Correct: "ten minutes past eleven". WRONG: figure-based clock notation or numeric shorthand.

Locked values:
  - Two costumes were used for the masquerade, allowing for impersonation.: "two identical costumes"
  - The victim was killed ten minutes past eleven, as corroborated by multiple witnesses.: "ten minutes past eleven"
    ⛔ FORBIDDEN alternatives: "11:10", "11.10", "eleven ten", "eleven-ten", "eleven past ten", "quarter past eleven", "half past eleven" — the ONLY acceptable form is "ten minutes past eleven"

If a value has no relevance to this chapter, omit it. But the moment you reference the underlying evidence, only the exact phrase above is acceptable.

⛔ CLUES TO SURFACE IN THESE CHAPTERS — mandatory:
The following evidence MUST be clearly observable to an attentive reader. Do not bury it in atmosphere or passing dialogue. Each clue must be concrete, specific, and noticeable:

• [clue_early_1] witnesses, recall, seeing, sylvia, distinctive, costume, shortly, before, murder
  Category: temporal | Criticality: essential | Supports inference step 1
  Later significance (context for YOU — do NOT state this in the prose; meaning surfaces only at the licensed deduction beats): witnesses, accounts, indicate, sylvia, presence, creating, alibi, conflict

• [clue_early_3] timing, music, performance, coincided, murder
  Category: testimonial | Criticality: essential | Supports inference step 1
  Later significance (context for YOU — do NOT state this in the prose; meaning surfaces only at the licensed deduction beats): timing, performance, suggests, opportunity, crime

• [clue_core_contradiction_chain] sylvia, ballroom, real, must, elsewhere
  Category: spatial | Criticality: essential | Supports inference step 1
  Later significance (context for YOU — do NOT state this in the prose; meaning surfaces only at the licensed deduction beats): contradiction, raises, doubt, sylvia, presence

• [clue_core_elimination_chain] eliminates, eleanor, voss, because, seen, mallory, finch, time, murder
  Category: testimonial | Criticality: essential | Supports inference step 1
  Later significance (context for YOU — do NOT state this in the prose; meaning surfaces only at the licensed deduction beats): corroboration, eliminates, eleanor, voss, suspect

For each clue above: an attentive reader should be able to find, record, and later use it to reason toward the solution.

═══ NARRATIVE STATE (read-only — do not contradict) ═══

LOCKED FACTS — use verbatim whenever this evidence is described:
  • Two costumes were used for the masquerade, allowing for impersonation.: "two identical costumes"
  • The victim was killed ten minutes past eleven, as corroborated by multiple witnesses.: "ten minutes past eleven"

CHARACTER PRONOUNS — never deviate from these:
  • Eleanor Voss: she/her/her
  • Dr. Mallory Finch: she/her/her
  • Captain Ivor Hale: he/him/his
  • Beatrice Quill: she/her/her
  • Sylvia Trent: she/her/her
  • Hugo Vane: he/him/his

CLUES ALREADY REVEALED TO READER: clue_early_2 — do not reveal these as new information.

INVESTIGATION LOG — WHAT IS ESTABLISHED (do not re-establish, do not repeat):
• Evidence already established (reference only — do NOT restate or quote these; advance beyond them): presence, identical, masks, suggests, possible, impersonation
• Suspect cleared: Dr. Mallory Finch[SHE] — Corroborated alibi from multiple witnesses.
• Suspect cleared: Beatrice Quill[SHE] — Witness confirmed her presence in another location during the murder.
• Suspect cleared: Hugo Vane[HE] — Alibi confirmed: 10:00 PM - 10:30 PM
⚠ The story must move FORWARD from this log. Any beat already listed above is forbidden from repeating.

⚠ THIS CHAPTER'S REQUIRED ADVANCE (early): Interview each suspect — record their claimed whereabouts

CONTINUITY HANDOFF — previous chapter closing beat:
  • "Eleanor watched her go, the weight of the morning settling on her shoulders. The rain showed no sign of stopping, and the Grand Seaside Hotel seemed, for a moment, suspended between past and present, truth and masquerade. Eleanor squared her shoulders and turn..."
  • The next chapter must open as a continuation of this beat, not as a disconnected reset.

⛔ DEAD CHARACTER — CANNOT APPEAR AS ALIVE:
• Sylvia Trent: murdered before Chapter 1. In ALL chapters from here on:
  - Refer to them ONLY in past tense, only as the victim of the crime
  - NEVER have them: enter a room, speak, respond, gesture, look, nod, or react
  - NEVER describe them as present at any scene, conversation, or confrontation
  - WRONG: "Sylvia Trent crossed the room" / "Sylvia Trent sat on the sofa" / "Sylvia Trent nodded"
  - WRONG: "Sylvia Trent gave testimony" / "Sylvia Trent asked what had happened"
  - CORRECT: "Sylvia Trent had often said..." / "Sylvia Trent's effects were found" / "witnesses recalled Sylvia Trent's habit of..."
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
ballroom, study, lobby, flat, corridor

✓ RULE: Continue using this location vocabulary. Maintain consistency with established setting type.
✓ Do NOT introduce new location types that contradict earlier chapters.

**Recent Chapter Summary (for narrative continuity):**
Chapter 1: Chapter 1: The Masquerade Unveiled
  Events: For one suspended moment, Eleanor could not move.
Chapter 2: Chapter 2: Initial Investigation
  Events: "You ought to knock, Miss Voss," Captain Ivor Hale said, his voice clipped as the wind rattled the windowpane behind him.

⚠️ **VALIDATION:** Character name mismatches and setting drift are common failure modes.
Double-check every character name against the list above before using it.

**⏱ LOCKED TIME ANCHOR — use verbatim, do not paraphrase:**
Clock time (from the case ground truth): **"9:30 PM"**
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
Known location profile anchors: Grand Seaside Hotel, Main Lobby, Dining Hall, Guest Rooms, Staff-Only Area, the ballroom, now a crime scene
LOCATION NAME CAPITALISATION (HARD REQUIREMENT — validated):
All named locations in your prose MUST use the EXACT capitalisation from the CML profiles.
Canonical forms: "Grand Seaside Hotel", "Main Lobby", "Dining Hall", "Guest Rooms", "Staff-Only Area", "the ballroom, now a crime scene"
Writing a location in lowercase (e.g. "drawing room" instead of "Drawing Room") is a validated error. Every time you mention a named location, copy its capitalisation from the list above.
- Chapter 3: OPENING STYLE (HARD): Start the VERY FIRST SENTENCE with an explicit time marker — e.g. "That morning…" / "By the time dusk fell…" / "It was nearly four o'clock…" / "On the second day after the discovery…". Time must be in the first clause. Anchor opening in "the ballroom, now a crime scene". The opening style above governs only your FIRST SENTENCE; the grounding below may land anywhere in the first 2 paragraphs (it need not be sentence one, and never conflicts with the chosen opening style). HARD REQUIREMENT for the first 2 paragraphs: (a) include 2+ sensory words — choose from smell/scent/odor/fragrance/sound/echo/silence/whisper/creak/cold/warm/damp/rough/smooth/glow/shadow/flicker/dim — and (b) include 1+ atmosphere/time word — choose from rain/wind/fog/storm/mist/thunder/evening/morning/night/dawn/dusk/lighting/weather/season/afternoon/midday/noon/midnight/twilight/sunrise/sunset/daylight/sunlight/overcast/cloudy/bright/dark/grey/pale/chill/crisp/drizzle/haze/lamplight/firelight. These are validated requirements, not style suggestions; missing them triggers a retry.

[⚠ INTERNAL QUALITY DIAGNOSTICS — DO NOT REPRODUCE ANY PART OF THIS SECTION IN YOUR STORY OUTPUT. These are private generator observations for your consideration only. Your narrative must read as if this section does not exist. Never include phrases from this block in character dialogue, narration, or description.]

PRIOR CHAPTER QUALITY OBSERVATIONS:
- Chapter 2 (score 95/100):
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

PROMPT BUDGET SUMMARY: budget=24000 tokens; fixed=12600; context=11138; dropped=[humour_guide, location_profiles]; truncated=[location_profiles, temporal_context, pronoun_accuracy]

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
4. Integrate at least two concrete era-grounded details per chapter from setting refinement signals: radio broadcasting | early television sets | military radar | typewriters | long-distance telephone calls | military telegraphy.
5. Respect setting movement/access constraints in scene action and alibis: narrow hallways restricting movement | guest rooms with limited access from public areas | oceanfront providing natural sound barriers | staff-only areas | restricted access to the roof for maintenance.
6. Sustain social coherence with this backdrop pressure: A planned gala at a grand seaside hotel draws a diverse group of guests, where post-war societal shifts and the tension of Cold War paranoia create an atmosphere ripe for deception and hidden identities.
7. Maintain continuity around these socially central cast anchors where relevant: Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill, Sylvia Trent, Hugo Vane.
8. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Critical: Plot similarity 0.75 with 'The Second Key' (same crime method of poisoning and similar era)
9. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Moderate: Character similarity 0.74 with 'The Second Key' (mirrored character roles and similar character count)
10. STORY TO DATE ANTI-COPY RULE: The STORY TO DATE section below is provided for chronological and factual reference ONLY. You MUST NOT copy, lightly rephrase, or structurally echo any sentence or paragraph from prior chapters. Every sentence in this chapter must be original prose unique to this scene. Reusing even a clause from prior chapter text will cause this attempt to fail immediately.

CRITICAL PROSE REQUIREMENTS:

The CML specifies exact requirements for certain validation-critical scenes. You MUST include these elements at the specified positions.

**Discriminating Test Scene (Act 3, Scene 4):**
Required elements: Execute the comparative analysis of costumes., Observe the implications of the findings.
Test type: comparative analysis

**Suspect Clearance Scenes:**
- Dr. Mallory Finch (Act 3, Scene 5): Corroborated alibi from multiple witnesses.
  Clues: clue_id_1, clue_id_2
- Beatrice Quill (Act 3, Scene 5): Witness confirmed her presence in another location during the murder.
  Clues: clue_id_3, clue_id_4
- Hugo Vane (Act 3, Scene 5): Alibi confirmed: 10:00 PM - 10:30 PM

**Culprit Revelation Scene (Act 3, Scene 6):**
Method: Confrontation with evidence.

**Clue Placement for These Chapters:**
- clue_core_contradiction_chain must appear in Act 1, Scene 3 via Cross-check contradiction
- clue_core_elimination_chain must appear in Act 1, Scene 3 via Corroborated elimination
- clue_early_3 must appear in Act 1, Scene 3 via Witness accounts confirming timing of performance.

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
Batch chapters: 3-3.
Investigation state at start: 1 clue(s) revealed to reader; approximately 0 unresolved suspect(s).
Must change by end: Reframe prior clue meaning and update suspect implications.
Suspect pressure target(s): Captain Ivor Hale, Dr. Mallory Finch, Beatrice Quill, Hugo Vane
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
- Chapter 3:
  - STRUCTURAL ARCHETYPE — Chapter 3 must be: EVIDENCE
      ✓ MUST contain: new physical clue discovered
      ✗ MUST NOT contain: formal accusation
  - Word count: Target 1250 words. Achieve this through plot events, dialogue exchanges, and physical investigation — not through atmospheric repetition or extended internal reflection. Each 200-word segment should contain at minimum one concrete story event (a discovery, a conversation exchange, a physical action or movement). Padding with atmosphere alone is not acceptable.
  - ⛔ INFERENCE EMBARGO (pre-reveal): observations ACCUMULATE here; explicit deduction ("therefore", "which proved", "could only mean", if-A-and-B-then-C assembly of locked values) is RESERVED for the false-solution, discriminating-test, and reveal chapters. Characters may wonder, doubt, or fall silent over a detail — never explain it.
  - Opening: Begin with a character action, spoken line, or clock/time marker — never a location name or location-description phrase.
  - Scene is set in: the ballroom, now a crime scene — reference it naturally within the paragraph, never as your opening phrase.
  - Opening atmosphere (MANDATORY — validator enforced): the first paragraph MUST contain at least one of: rain / wind / fog / storm / mist / thunder / evening / morning / night / dawn / dusk / season / afternoon / midday / noon / midnight / twilight / sunrise / sunset / daylight / sunlight / overcast / cloudy / bright / dark / grey / pale / cold / warm / chill / crisp / damp / drizzle / haze / lamplight / firelight. A chapter that omits all of these from its opening paragraph will be rejected.
  - PARAGRAPH OPENER DIVERSITY (MANDATORY — validator enforced): No more than 2 paragraphs in this chapter may begin with "Eleanor" or "Eleanor's" as the first word. You must vary paragraph openings throughout: use sensory observations, another character's name or action, dialogue, object or sound details, or temporal markers. Opening 3 or more paragraphs with "Eleanor" will cause automated rejection.
  - Continuity bridge: in the first 120 words, visibly connect from the previous chapter's final beat. Carry forward one unresolved element (object, accusation, emotional pressure, or immediate physical action) from: "Eleanor watched her go, the weight of the morning settling on her shoulders. The rain showed no sign of stopping, and the Grand Seaside Hotel seemed, for a moment, suspended between past and present, truth and masquerade...".
  - CLUE OBLIGATIONS — each clue below MUST be dramatized, but in YOUR OWN WORDS:
    Render each as something a character SEES, DOES, or SAYS on the page. The bracketed text is a
    DESCRIPTION of the evidence for you — do NOT transcribe it as narration. Copying a clue's
    description sentence verbatim into the prose FAILS validation.
    • contradictory, witness, statements, sylvia, location [clue_core_contradiction_chain] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      OBSERVATION ONLY: put it on the page concretely — a character sees, handles, or hears it inside the scene. The detective may NOTICE (a pause, a second glance, a pocketed item) but must NOT state what it implies. Place the observation in paragraph 1 or 2.
    • witnesses, confirm, eleanor, presence, mallory, finch [clue_core_elimination_chain] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      OBSERVATION ONLY: put it on the page concretely — a character sees, handles, or hears it inside the scene. The detective may NOTICE (a pause, a second glance, a pocketed item) but must NOT state what it implies. Place the observation in paragraph 1 or 2.
    • witnesses, confirm, music, played, murder [clue_early_3] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      OBSERVATION ONLY: put it on the page concretely — a character sees, handles, or hears it inside the scene. The detective may NOTICE (a pause, a second glance, a pocketed item) but must NOT state what it implies. Place the observation in paragraph 1 or 2.
    • witnesses, statements, sylvia, appearance [clue_early_1] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      OBSERVATION ONLY: put it on the page concretely — a character sees, handles, or hears it inside the scene. The detective may NOTICE (a pause, a second glance, a pocketed item) but must NOT state what it implies. Place the observation in paragraph 1 or 2.
  - PLANT OBLIGATIONS (incidental appearances): each item below MUST appear in this chapter as a passing physical detail a character sees, handles, or walks past — with its significance UNFLAGGED:
    • captain, hale, access, costumes, masks [plant:clue_culprit_direct_captain_ivor_hale]
    • witnesses, confirm, finch, presence, eleanor [plant:clue_core_elimination_chain_3]
    Rules: set dressing only. NO character comments on its importance, NO narrator hint ("little did they know", "something about it seemed off" are FORBIDDEN), NO inference drawn. It simply exists in the scene, naturally. Its significance surfaces in a LATER chapter — planting it casually here is what makes that later reveal feel fair.
  - TIMELINE SPINE (canonical claimed accounts — every retelling must MATCH these in substance; accounts may be doubted, but what a character CLAIMS never drifts between chapters):
      · Eleanor Voss claims: None
      · Dr. Mallory Finch claims: 10:00 PM - 10:30 PM
      · Captain Ivor Hale claims: 9:30 PM - 10:00 PM
      · Beatrice Quill claims: 9:45 PM - 10:15 PM
      · Hugo Vane claims: 10:00 PM - 10:30 PM
  - ONE-QUESTION RULE: this scene RESOLVES OR SHARPENS EXACTLY ONE timeline question (pick the one this chapter's clue/clearance obligations serve). It may restate AT MOST ONE already-established fact for context. Do NOT re-summarize other suspects' accounts, do NOT re-litigate settled points — the scene ends with its one question visibly answered, or visibly sharpened into a better question.
  - Tonal contrast: include at least one beat of relief or ironic counterpoint. Do not sustain maximum tension for every paragraph.
  - CLUE DISCLOSURE RULE (Stage 3/4):
    Characters may draw inferences and name partial conclusions but must NOT state the full mechanism or name the culprit directly. The detective may suspect but not confirm.
    WRONG: dialogue or narration that directly explains how the crime was committed before Stage 4.
    RIGHT: observation, physical reaction, and logical inference that leaves the mechanism just off-screen.
  - ALIBI LOCK: Captain Ivor Hale's established alibi is "9:30 PM - 10:00 PM". Do NOT place Captain Ivor Hale at any other location or in any other activity during the crime window. Any contradiction is a continuity error that triggers a retry.
  - TESTIMONY CONTINUITY: Captain Ivor Hale has already made statements in earlier chapters. Any time, location, or claim attributed to Captain Ivor Hale in THIS chapter must be consistent with those earlier statements. Do NOT introduce a new or different alibi claim — any contradiction is a continuity error.
- Locked fact phrase obligations:
  - If this batch mentions Two costumes were used for the masquerade, allowing for impersonation., write exactly: "two identical costumes".
  - If this batch mentions The victim was killed ten minutes past eleven, as corroborated by multiple witnesses., write exactly: "ten minutes past eleven".
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
Batch chapters: 3-3.
Investigation state at start: 1 clue(s) revealed to reader; approximately 0 unresolved suspect(s).
Must change by end: Reframe prior clue meaning and update suspect implications.
Suspect pressure target(s): Captain Ivor Hale, Dr. Mallory Finch, Beatrice Quill, Hugo Vane
Required new information: Earlier clue gets revised meaning with explicit theory update.
Forbidden reveals at this stage: Do not introduce decisive new evidence from nowhere.

FROZEN FACT STATE (DO NOT ALTER):
- Timeline anchor: December (winter).
- Month, season, weather, and time-of-year language in this batch must stay compatible with winter.
- Established timeline fact: 9:30 PM
- Established timeline fact: 10:00 PM
- If referenced, use exact phrase: "two identical costumes" (Two costumes were used for the masquerade, allowing for impersonation.).
- If referenced, use exact phrase: "ten minutes past eleven" (The victim was killed ten minutes past eleven, as corroborated by multiple witnesses.).

STORY TO DATE (REFERENCE ONLY — DO NOT COPY VERBATIM):
- Full prior chapter text is provided below for continuity, factual consistency, and reference accuracy.
- Use this to keep character voice, chronology, clue state, and location continuity aligned with earlier chapters.
- Do not quote, copy, or paraphrase these paragraphs too closely; write fresh prose that remains consistent with them.

--- BEGIN PRIOR CHAPTER 1 ---
Title: Chapter 1: The Masquerade Unveiled
Eleanor Voss pressed her gloved palm to the ballroom’s lacquered doors, the faint scent of candle wax and the salt of last night’s rain lingering in the air. The morning light, filtered through tall arched windows, cast a pale glow across the marble floor, illuminating the aftermath of festivity—a scattering of confetti, a feathered mask abandoned near the dais. Silence reigned, broken only by the distant echo of a radio drifting from the Main Lobby. It was this hush, so at odds with the usual bustle of the Grand Seaside Hotel, that made the sight before her all the more jarring: Sylvia Trent lay sprawled on the ballroom floor, her sequined gown catching the weak winter sunlight, motionless amid the remnants of celebration.

For one suspended moment, Eleanor could not move. The world seemed to contract around Sylvia Trent’s still form, the chill of the ballroom seeping through Eleanor’s shoes. She noted, with a journalist’s reflex, the peculiar arrangement of Sylvia Trent’s arms—one flung wide, the other curled as if reaching for something just out of sight. The mask, a delicate confection of silver filigree, rested beside her head, as though it had been removed in haste or protest. Eleanor’s gaze lingered on the faint smudges of powder along Sylvia Trent’s jaw, and the unnatural stillness of her chest. It was not the tableau of sleep, but something irrevocable.

A door creaked open behind Eleanor, and the sound of hurried footsteps on marble announced the arrival of Captain Ivor Hale. He paused at the threshold, the crisp lines of his black wool tuxedo at odds with the disarray of his expression. 'Miss Voss—what in blazes—' His voice faltered as he took in the scene. For a man reputed to have weathered the worst of the Channel storms, his knuckles blanched as he gripped the edge of the door. Eleanor watched him, noting the way his eyes darted from Sylvia Trent’s body to the clock above the orchestra alcove, then back again, as if searching for an anchor.

Eleanor Voss laid the facts out plainly where the others could see them. The record now held: Witnesses recall seeing sylvia distinctive costume.

That detail shifted the reasoning. Weighed against the rest, Witnesses recall seeing sylvia distinctive costume bent the trail toward Witnesses accounts indicate sylvia presence creating.

The hush fractured further as Dr. Mallory Finch entered, her tailored navy skirt suit immaculate, though a single strand of hair had escaped her chignon. She moved with the measured precision of her profession, but her gaze flickered—first to the body, then to Eleanor, then away, as though cataloguing the scene for future reference. 'I suppose the masquerade has ended in more ways than one,' Dr. Finch murmured, her tone dry but her hands betraying a tremor as she adjusted the lapel of her coat. She knelt beside Sylvia Trent, fingers hovering above her wrist, but did not touch.

Beatrice Quill swept in with a rustle of silk and a scent of lavender, her evening gown’s beading glinting in the wintry light. 'Well, darling, isn’t that just the cherry on top?' she drawled, though her bravado faltered as her gaze settled on Sylvia Trent. She pressed a lace handkerchief to her lips, eyes wide. 'I thought the only thing to die last night would be the soufflé.' Her laughter, brittle as glass, faded quickly. Eleanor caught the way Beatrice’s gaze lingered on the mask, her gloved fingers twisting the handle of her clutch.

Hugo Vane arrived last, his stride brisk, the scent of tobacco clinging to his tweed blazer. He surveyed the room with a financier’s detachment, but his jaw tightened as he caught sight of Sylvia Trent. 'It’s all just numbers, really. Nothing personal,' Hugo muttered, though he made no move to approach the body. Instead, he hovered near the windows, eyes narrowed, as if calculating the odds of escape. Eleanor noted the way his gaze flicked from Dr. Finch to Captain Hale, then back to the clock, before settling on her with a challenge.

Eleanor straightened, drawing a deep breath that tasted of cold marble and the faint, persistent tang of the sea. She was aware of the weight of expectation settling on her shoulders—the guests’ eyes, the hush, the unspoken question. It was not the first time she had been called upon to make sense of chaos, but never had the stakes felt quite so personal. 'I’ll need everyone to remain here,' Eleanor said, her voice steady, though her heart thudded like a train gathering speed. 'No one leaves the ballroom until we understand what has happened to Sylvia Trent.'

A murmur rippled through the group, but no one protested. Captain Hale’s nervous laughter was abrupt and brittle. 'Just another day in paradise, or so they say,' he muttered, but his hand remained fixed on the doorframe. Dr. Finch’s gaze was clinical, but her lips pressed together as if holding back words. Beatrice’s eyes darted from face to face, searching for reassurance, while Hugo Vane’s silence was a wall unto itself.

Eleanor knelt beside Sylvia Trent, careful not to disturb the scene. She noted the faint aroma of perfume—jasmine, perhaps—mixing with the sharper scent of spilled wine. The ballroom’s grandeur felt suddenly oppressive, the ornate chandeliers casting shadows that stretched like accusations across the floor. As Eleanor reached for the mask, she paused, her gaze drawn to a detail: the costume Sylvia Trent wore was unmistakable, a confection of silver and black feathers that had drawn admiring glances the night before. She recalled, with a jolt, the chorus of witnesses who had remarked on seeing Sylvia Trent in that very costume, dancing beneath the chandeliers shortly before midnight.

Yet, even as Eleanor registered this, a contradiction pricked at her. The clock above the orchestra alcove read a time that did not quite align with her recollection of the music’s final crescendo. She glanced at Dr. Finch, who seemed to be making a mental note of the same detail. The ballroom, so recently alive with laughter and music, now felt suspended in a hush that was both expectant and accusatory.

A constable’s silhouette appeared in the doorway, but he waited, uncertain, as if aware that authority had shifted. Eleanor rose, smoothing her skirt, and addressed the gathering with the calm of someone accustomed to scrutiny. 'I am taking charge of the inquiry,' she announced. 'Until further notice, this is a closed scene.' The words settled over the group like a wintry shroud. Outside, the rain began again, drumming softly against the windows, a muted counterpoint to the tension within.

As the guests shifted uneasily, Eleanor’s mind flickered through the events of the previous night—the swirl of music, the glint of crystal, the laughter that now seemed too brittle to be genuine. She remembered the moment when the music had paused, the brief confusion as the clock chimed, and the way Sylvia Trent’s laughter had rung out, clear and bright, above the din. There had been witnesses aplenty, each with a version of events, yet already the edges of their stories seemed to blur.

Dr. Finch moved to the sideboard, her hands steady now as she poured a glass of water. 'It’s best not to dwell on such matters. Focus on what we can control,' she said, her voice low. Beatrice Quill, meanwhile, busied herself with the arrangement of chairs, her movements too precise, as if order might stave off panic. Hugo Vane produced a cigarette, though he did not light it, rolling it between his fingers with the air of a man calculating risks.

Captain Hale hovered near the doors, his posture ramrod-straight, but when Eleanor’s gaze met his, he offered a nervous smile. 'I was in the ballroom at nine thirty,' he said, almost to himself, as though rehearsing a line for an audience not present. Eleanor made no reply, but noted the way his gaze flicked again to the clock, then to the mask on the floor.

The radio in the Main Lobby crackled to life, the strains of 'Some Enchanted Evening' drifting faintly into the ballroom. The incongruity of the music—a love song in the aftermath of tragedy—drew a bitter smile from Eleanor. She knelt once more, examining the hem of Sylvia Trent’s gown, noting a faint tear and a smudge of something dark along the lining. The details accumulated, a puzzle without a picture.

Beatrice Quill broke the silence with a sigh, her bravado returning in fits and starts. 'If only I’d worn something less memorable,' she quipped, glancing at her own elaborate costume. 'But then, who would remember the dull ones?' Her attempt at levity fell flat, but Eleanor recognized the strategy—humour as armor.

Eleanor rose, glancing once more at the assembled guests. Each face was a study in composure, but the cracks were already showing: Captain Hale’s restless grip on his watch chain, Dr. Finch’s too-careful calm, Beatrice’s theatrical sighs, Hugo Vane’s sidelong glances. The ballroom of the Grand Seaside Hotel, with its gleaming marble and flickering chandeliers, had become a crucible. The masquerade was over, and the truth—whatever shape it took—would not remain hidden for long.
--- END PRIOR CHAPTER 1 ---

--- BEGIN PRIOR CHAPTER 2 ---
Title: Chapter 2: Initial Investigation
"You ought to knock, Miss Voss," Captain Ivor Hale said, his voice clipped as the wind rattled the windowpane behind him. The room was dim, the weak winter morning filtered through heavy drapes, and the air held a faint, lingering scent of tobacco and damp wool. Eleanor hesitated just inside the threshold, her gloved hand still resting on the polished brass doorknob. The rain had not relented; it pattered insistently against the glass, a grey wash of sound that made the silence between them feel colder than the December air.

Eleanor’s gaze swept the room, cataloguing the details with the detachment of a seasoned observer. The bedspread was crisply turned down, but a pair of black leather gloves lay abandoned atop it, beside a silver cigarette case and a half-folded copy of The Times. The fire in the grate had died to a sullen glow, leaving the corners of the room in shadow. On the writing desk, a masquerade mask—silver filigree, unmistakably like the one Sylvia Trent had worn—caught the meagre light. Next to it, to Eleanor’s growing unease, lay another mask, identical in every curve and flourish, the ribbons trailing like severed threads.

She moved closer, her shoes muffled by the thick rug. The masks were not merely similar; they were twins, each feathered edge and painted detail a mirror of the other. Eleanor reached out, hesitating before touching the cool, smooth surface. A flicker of suspicion darted through her: two identical masks, here in Captain Hale’s room, when only one should have adorned Sylvia Trent’s face. The implication pressed at her, insistent as the rain.

Dr. Mallory Finch entered with a briskness that belied the tension. Her heels tapped softly on the floorboards, and she paused just inside the door, eyes sharp behind her spectacles. "I see we’re not the only ones with a penchant for drama," Dr. Finch remarked, her tone edged with irony. She glanced from the masks to Eleanor, then to Captain Hale, whose posture had stiffened. "A matched set? How very thorough."

Captain Hale’s jaw worked, but he did not immediately reply. Instead, he crossed to the wardrobe, as if searching for an escape route among his own belongings. His hand lingered on the door, knuckles pale. "Those were for the performance," he said at last, not quite meeting either woman’s gaze. "The hotel provided extras, in case of mishap. You know how these things go—someone always tears a ribbon or smudges the paint." The explanation hung in the air, plausible enough, but Eleanor noted the defensive edge to his voice.

Eleanor picked up one of the masks, weighing it in her palm. The craftsmanship was exquisite, but it was the sameness that unsettled her. "How fortunate, then, that you ended up with both," she said lightly, her tone almost conversational. "Did you collect them after the party, or were they here all along?" Her question was casual, but her eyes did not leave his face.

Captain Hale’s reply was a beat too slow. "I—well, I found the second one after the festivities. Someone left it behind, I suppose. I meant to return it to the staff." He ran a hand through his hair, the gesture betraying a flicker of uncertainty. "If you’re implying anything else, Miss Voss, I assure you—my only concern last night was the success of the event."

Dr. Finch moved to the writing desk, her fingers tracing the edge of the newspaper. "Success is a relative term," she murmured, glancing at the masks. "Given the outcome." Her gaze lingered on Captain Hale, the silence stretching. "You were in the ballroom at nine thirty, you said?"

"That’s correct," Captain Hale replied, his voice regaining some of its earlier authority. "I left just after ten. I saw nothing out of the ordinary."

Eleanor set the mask down with deliberate care. The rain’s rhythm seemed to quicken, as if urging her to press further. "And yet, here we are, with two identical costumes and a dead woman in the ballroom. That is out of the ordinary, wouldn’t you say?"

Captain Hale’s lips twitched, a shadow of his usual sardonic smile. "Perhaps the hotel’s standards have slipped," he said, but the joke fell flat. He turned away, busying himself with the cigarette case, though he did not open it.

Dr. Finch’s attention shifted to a stack of witness statements on the desk, the top sheet bearing Sylvia Trent’s name in neat, official script. She thumbed through the pages, her brow furrowing. "It seems everyone saw something different last night," she observed. "Memory is a tricky thing, especially in a crowd."

Eleanor watched her, noting the way Dr. Finch’s composure never quite slipped, even as her fingers trembled minutely. "We’ll need to account for everyone’s whereabouts," Eleanor said. "Hugo Vane, for instance, was confirmed elsewhere during the crucial time. That narrows the field." She let the implication settle, her gaze returning to Captain Hale.

Captain Hale bristled, his shoulders squaring.

"No one is suggesting anything," Dr. Finch interrupted, her tone soothing but firm. "We’re merely establishing facts. The sooner we do, the sooner we can all put this behind us."

Eleanor suppressed a sigh, feeling the weight of the masks in her mind. The evidence was accumulating, but the picture remained blurred. She turned to the window, watching the rain trace crooked paths down the glass. The Grand Seaside Hotel, so full of light and laughter the night before, now felt like a stage emptied of its players, the echoes of music replaced by the hush of suspicion.

A knock at the door interrupted the charged silence. Beatrice Quill’s voice drifted in from the hallway, bright but brittle. "Is this the queue for confessions, or am I early?" she called, her laughter forced. Eleanor exchanged a glance with Dr. Finch, the briefest flicker of shared understanding passing between them.

Captain Hale moved to open the door, but paused, his hand on the knob. "We’re finished here," he said, though the certainty in his tone was less than convincing. He looked at Eleanor, something wary in his eyes. "If you have further questions, Miss Voss, I suggest you address them to the management."

"I’ll keep that in mind," Eleanor replied, her voice mild. She gathered her notes, slipping them into her clutch. The masks remained on the desk, silent witnesses to a night that had spun out of control.

As the group filed out, Eleanor lingered a moment, studying the arrangement of objects: the twin masks, the witness statements, the gloves. She noted, too, the absence of any personal effects belonging to Sylvia Trent—no perfume, no jewelry, nothing to suggest she had ever set foot in this room. The implication was clear: whatever had happened, it had not begun here, but the trail now led directly through Captain Hale’s domain.

In the corridor, the atmosphere was no less tense. The muted sounds of the hotel filtered through the thick carpet—distant voices, the clatter of a breakfast tray, the faint strains of a radio playing in the Main Lobby. Eleanor paused, her thoughts circling the masks and the contradictions they posed. She could feel the investigation tightening, the circle narrowing around those with access and opportunity.

Dr. Finch caught up with her, her expression unreadable. "You’re not the only one who notices things, Miss Voss," she said quietly. "But sometimes, noticing is the most dangerous thing of all." She moved away before Eleanor could reply, her footsteps fading into the hush of the corridor.

Eleanor Voss pressed on to the next concrete detail. The record now held: Identical masks captain hale room.

That detail shifted the reasoning. Weighed against the rest, Identical masks captain hale room bent the trail toward Presence identical masks suggests possible impersonation.

Eleanor watched her go, the weight of the morning settling on her shoulders. The rain showed no sign of stopping, and the Grand Seaside Hotel seemed, for a moment, suspended between past and present, truth and masquerade. Eleanor squared her shoulders and turned back toward the Main Lobby, the image of the two identical masks fixed in her mind—a riddle waiting to be solved.
--- END PRIOR CHAPTER 2 ---

[SCENE COMPLETENESS CONTRACTS — MANDATORY. Each contract below lists what you MUST enact in that chapter. Do not summarise or mention these labels in the prose — enact them organically.]
Chapter 3 (Act 1) completeness contract:
  PIVOT ELEMENT (MANDATORY — write this into the prose, shown not told): "The conflicting witness statements regarding Sylvia's whereabouts."
  FACT ESTABLISHED (MANDATORY — reader must know this by chapter end): "Establishes that if Sylvia was in the ballroom, the real Sylvia must have been elsewhere, complicating the investigation."

# Case Overview
Title: The Masquerade of Authority
Era: 1940s
Setting: Grand Seaside Hotel
Crime: murder (poisoning)
Culprit: Captain Ivor Hale
Victim: Sylvia Trent
False assumption: Witnesses confidently claim they saw Sylvia in the ballroom at the time of the murder.
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
    "sceneNumber": 3,
    "act": 1,
    "title": "Contradictions Arise",
    "setting": {
      "location": "the ballroom, now a crime scene",
      "timeOfDay": "Mid-morning",
      "atmosphere": "Heavy with suspicion and uncertainty"
    },
    "characters": [
      "Eleanor Voss",
      "Captain Ivor Hale",
      "Dr. Mallory Finch",
      "Beatrice Quill",
      "Hugo Vane"
    ],
    "purpose": "Reveal contradictions in witness statements",
    "cluesRevealed": [
      "clue_early_1",
      "clue_early_3",
      "clue_core_contradiction_chain",
      "clue_core_elimination_chain"
    ],
    "dramaticElements": {
      "conflict": "Witness accounts clash, creating doubt",
      "tension": "Eleanor feels the weight of the investigation on her shoulders",
      "microMomentBeats": [
        "Eleanor feels a chill as she realizes the implications of the contradictions."
      ]
    },
    "summary": "In the ballroom, Eleanor gathers the witnesses to discuss their accounts. She learns that multiple guests saw Sylvia in a distinctive costume shortly before the murder, creating a contradiction. As Eleanor pieces together the timeline, she begins to suspect that the real Sylvia must have been elsewhere.",
    "beat": "first_enquiries",
    "estimatedWordCount": 1250,
    "pivotElement": "The conflicting witness statements regarding Sylvia's whereabouts.",
    "factEstablished": "Establishes that if Sylvia was in the ballroom, the real Sylvia must have been elsewhere, complicating the investigation.",
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
      },
      {
        "characterName": "Sylvia Trent",
        "behaviour": "Show normal social behaviour; grief or confusion if appropriate."
      }
    ],
    "redHerringPlacement": null,
    "emotionalRegister": "Unease mounts as whispers of trouble circulate among the guests.",
    "dominantCharacterNote": {
      "name": "Eleanor Voss",
      "voiceRegister": "Eleanor's voice is fluid and inviting, often drawing listeners in with her insightful commentary."
    },
    "humourGuidance": {
      "permission": "permitted",
      "character": "Dr. Mallory Finch",
      "form": "polite_savagery"
    },
    "eraTextureNote": "Limited transportation options due to rationing and post-war shortages.; Communication is slower, with reliance on postal services and landlines.; Cultural events are tightly packed around the holiday season, leading to crowded venues.",
    "locationRegisterNote": "",
    "mechanismRevealAllowed": false,
    "cluesPlanted": [
      "clue_culprit_direct_captain_ivor_hale",
      "clue_core_elimination_chain_3"
    ]
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
□ Chapter 3: the clue [clue_core_contradiction_chain] (sylvia, ballroom, real, must, elsewhere) is placed in the first 25% of the chapter, dramatized in your own words, followed by an explicit inference or suspicion paragraph.
□ Chapter 3: the clue [clue_core_elimination_chain] (eliminates, eleanor, voss, because, seen, mallory, finch, time, murder) is placed in the first 25% of the chapter, dramatized in your own words, followed by an explicit inference or suspicion paragraph.
□ Chapter 3: the clue [clue_early_3] (timing, music, performance, coincided, murder) is placed in the first 25% of the chapter, dramatized in your own words, followed by an explicit inference or suspicion paragraph.
□ Chapter 3: the clue [clue_early_1] (witnesses, recall, seeing, sylvia, distinctive, costume, shortly, before, murder) is placed in the first 25% of the chapter, dramatized in your own words, followed by an explicit inference or suspicion paragraph.
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
