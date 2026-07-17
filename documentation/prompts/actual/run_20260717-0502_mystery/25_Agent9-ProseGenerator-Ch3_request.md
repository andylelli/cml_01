# Actual Prompt Record

- Run ID: `mystery-1784264575381`
- Project ID: ``
- Timestamp: `2026-07-17T05:12:34.856Z`
- Agent: `Agent9-ProseGenerator-Ch3`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4.1`
- Temperature: `0.42`
- Max Tokens: `4500`
- Attempt: `first`
- Prompt Hash: `e151321bf5d98d9b`

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
- MORAL COMPLEXITY REQUIREMENT: The mechanism of this crime carries a moral gray area: "The culprit believed they were saving their loved ones from the victim's manipulative grasp, leading to a complex moral dilemma." — the culprit reveal and denouement MUST acknowledge this ambiguity. Do not let the ending feel clean or simple. Give the reader at least one moment of uncomfortable sympathy or moral doubt.

- CHAPTER OPENING (every chapter, lint-enforced): never open on a tour or inventory of named rooms/places. The first sentence must land a character ACTION, a specific sensory detail, or a concrete in-scene moment — not "In the [room], the [room], and the [room]…". Locations enter through what a character does in them, one at a time.
- VICTIM IDENTITY (HARD CONSTRAINT — lint-enforced): Eleanor Voss is the murder victim, already dead before this chapter. They do NOT speak, enter, react, gesture, or appear in any present-tense scene. When Eleanor Voss is referenced at all, it may ONLY be as: (a) physical evidence/the body, or (b) REPORTED memory/testimony — and reported references MUST be framed as recollection, never as a live beat. WRONG: `Eleanor Voss said, "…"` / `Eleanor Voss turned to him`. RIGHT: `Eleanor Voss had said, weeks before, that…` / `Agnes remembered how Eleanor Voss used to…`. Attach an explicit recollection frame ("had", "remembered", "recalled", "before she died", "in life") to any sentence that names Eleanor Voss beside an action or speech verb. A live dialogue tag or present action for Eleanor Voss is a continuity failure that will be rejected and regenerated.

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
   - Captain Ivor Hale: Veteran
   - Beatrice Quill: Young Ambitious Worker
   - Sylvia Trent: Investigative Reporter
   - Hugo Vane: Entrepreneur
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
  Public identity anchor: Journalist; suspect 
  Connection to victim: Former friends turned rivals due to professional conflicts.; Eleanor rejected Sylvia's pitches for hotel stories, causing a bitter fallout..
  Investigation relevance: access plausibility: low | alibi window: 8 PM to 10 PM.
  Suspicion/pressure cue seed: Fidgety when discussing Eleanor.
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

## Era: 1945-04
Living through April 1945 means grappling with the last throes of World War II, where the air is thick with anticipation and uncertainty. The end of the war is nearing, yet the scars it has left on society are deep. In communities across England, rationing persists, affecting everyday life, from the food on the table to the clothes in one's wardrobe. Conversations often revolve around the war's impact, with returning soldiers adjusting to civilian life while women who filled roles during the conflict now fight to maintain their newfound independence. The Grand Azure Hotel stands as a microcosm of this societal tension, where guests navigate their aspirations and disappointments, often in silence, masking their struggles under the guise of post-war optimism. As spring unfolds, the weather reflects the mood—overcast skies with rain showers serve as a reminder of the stormy emotions lurking beneath the surface.
Emotional register: A collective emotional state of cautious hope mingled with lingering anxiety permeates society.
Physical constraints: Rationing limits access to basic goods and services. | Travel restrictions persist due to ongoing fuel shortages. | Limited communication with the outside world hampers news updates.
Current tensions (weave into background texture): The war in Europe is nearing its conclusion with the fall of Berlin imminent. | Social expectations are shifting as women fight for their roles post-war. | Economic uncertainties loom as rationing continues, leading to anxiety about the future.
Wartime context — Many men are returning from service, adjusting to civilian life, while women are asserting their roles in the workforce.: The fabric of society is frayed, as class dynamics shift, and communities struggle to reintegrate veterans and maintain support for women. Absence effect: The absence of loved ones lost to war has created an emotional void, complicating relationships and fostering a sense of distrust among individuals.

## Story Theme
The intricate dance of ambition and jealousy in a post-war society reveals how hidden motives can lead to tragic consequences, exposing the fragility of human relationships.

## Story Emotional Register
Dominant: A tense and suspenseful atmosphere permeates the story, driving the emotional narrative forward.

Arc:
The story opens in the opulent yet fraught atmosphere of The Grand Azure Hotel, where the air is thick with tension and the echoes of war linger in every corner. Eleanor Voss, the hotel's charming manager, is found dead under mysterious circumstances, her demise marking the beginning of a dark investigation. As Detective Hugo Vane digs into the circumstances surrounding her death, initial clues emerge, revealing a tapestry of jealousy and ambition among the guests and staff. The investigation takes a toll on all involved, with rising suspicion leading to emotional strain as relationships fray in the wake of mistrust and hidden agendas.

Just when the case seems to point towards a surprising suspect, a pivotal revelation turns the investigation on its head, forcing the detective to reevaluate his findings. As the tension mounts, the characters face their inner demons, with stakes rising as the truth threatens to shatter their carefully constructed lives. In the climax, confrontations lead to a heartbreaking resolution, exposing the fragility of trust among those who once stood united against the backdrop of war. The emotional cost of Eleanor's death resonates through the lives of the characters, leaving them to grapple with the consequences of their actions and the impact of unresolved secrets.

## Emotional register at this point in the story
Initial investigations reveal a web of motives, heightening the sense of mistrust among the characters.

## Character Portraits (appearance & era)

### Dr. Mallory Finch
Dr. Mallory Finch embodies the complexity of a woman in a male-dominated profession during this transitional period. Her ambition drives her to excel as a physician, but it also pushes her to engage in unethical practices. In a society increasingly aware of women's capabilities, Mallory's struggle to maintain her reputation reveals the dark side of ambition in a world still grappling with war's aftermath.
Era intersection: Her secret experiments highlight the ethical dilemmas faced by women asserting themselves in the workforce while navigating societal expectations.

### Captain Ivor Hale
Captain Ivor Hale is a war veteran whose stoic demeanor hides the scars of PTSD. As he interacts with guests, his stories of valor serve as a shield against his inner turmoil. The return to civilian life is fraught with challenges, particularly as he confronts the ghosts of his past. In a society that is beginning to recognize the psychological effects of war, Ivor's struggle speaks to the broader issues faced by returning soldiers.
Era intersection: His battle with PTSD symbolizes the unspoken struggles many veterans face as they reintegrate into a world that has moved on without them.

### Beatrice Quill
Beatrice Quill is a hotel receptionist whose ambition is stifled by her loyalty to Eleanor. She feels overlooked and undervalued, caught in a web of resentment that reflects the broader struggles of women aspiring for recognition in a post-war society. Her internal conflict highlights the tension between ambition and loyalty, which is emblematic of the changing roles women are navigating during this era.
Era intersection: Beatrice's desire for advancement mirrors the aspirations of many women seeking to assert their place in a world reshaped by war.

### Sylvia Trent
Sylvia Trent is a journalist driven by the need for a breakthrough story in a time when women's voices are beginning to be heard. Her ambition is tempered by moral dilemmas as she grapples with the potential fallout of her actions. The tension between her personal aspirations and ethical boundaries reflects the changing societal norms for women who are venturing into fields once dominated by men.
Era intersection: Her pursuit of a story that could revitalize her career underscores the challenges women face in a rapidly changing landscape.

### Hugo Vane
Hugo Vane navigates the treacherous waters of business amidst post-war uncertainty. As a benefactor to the hotel, his charm masks financial troubles that threaten his status. The shifting economic landscape mirrors the fears of many in his position, as he grapples with the fragility of reputation in a society that is beginning to scrutinize wealth more closely.
Era intersection: His reliance on Eleanor's influence illustrates the interconnectedness of social status and economic survival in the aftermath of the war.

## Character Voices

### Dr. Mallory Finch (she/her/her)
Dr. Finch speaks with a clinical precision, often laced with a dry wit that can alienate.
[comfortable] ‘In the grand scheme of things, it’s merely a matter of perspective.’
[evasive] ‘I’ve been at the hospital—just busy with patients, you understand.’
[stressed] ‘This situation is quite delicate, and I’d rather not discuss it further at this moment.’
Humour: Her dry wit often surfaces when she feels discomfort in conversations.

### Captain Ivor Hale (he/him/his)
Ivor’s voice carries a gravitas, marked by a slow, deliberate speech pattern.
[comfortable] ‘Ah, the follies of youth, how they haunt us, indeed!’
[evasive] ‘Well, I might have been elsewhere, you know how it is at gatherings.’
[stressed] ‘I assure you, I was not involved in any unsavory matters, I was just... playing cards.’
Humour: His self-deprecating humour reflects a man reconciling with his past.

### Beatrice Quill (she/her/her)
Beatrice speaks with youthful enthusiasm, often punctuated by a hint of sarcasm.
[comfortable] ‘Oh, the things we do for success! It’s all part of the charm, isn’t it?’
[evasive] ‘I was just tidying up, nothing out of the ordinary.’
[stressed] ‘I don’t know what you expect from me, I just do my job!’
Humour: Her sardonic remarks emerge when she feels slighted or overlooked.

### Sylvia Trent (she/her/her)
Sylvia has a direct and unflinching tone, often cutting through pleasantries.
[comfortable] ‘The truth is a double-edged sword, but isn’t that what makes it intriguing?’
[evasive] ‘I was busy in my room, just trying to get some writing done.’
[stressed] ‘This isn’t a game; it’s my career on the line here!’
Humour: Her blunt nature often masks her underlying stress.

### Hugo Vane (he/him/his)
Hugo's voice is relaxed and charming, often using anecdotes to engage.
[comfortable] ‘Ah, but that’s just business, isn’t it? You have to roll with the punches!’
[evasive] ‘I was mingling, you know, just ensuring everything was in order.’
[stressed] ‘I assure you, my investments are just experiencing a minor setback!’
Humour: His observational humour helps deflect tension in conversations.

## Location Registers (scene framing guides)

The Broken Promenade: Standing here feels like being on the edge of a storm, both literally and metaphorically. The air is thick with tension, as the crashing waves mirror the chaos of the unfolding mystery.. Camera angle: As a writer enters this space, they should feel the weight of secrets and the relentless pull of the ocean, underscoring the characters' emotional turmoil.. Era: The overcast skies create a somber mood, amplifying the sense of foreboding.

The Sapphire Lounge: The lounge buzzes with an undercurrent of suspicion, where laughter and conversation mask deeper anxieties. The atmosphere is thick with unspoken words, as guests navigate their desires and fears.. Camera angle: Entering this space should evoke a sense of intimacy, yet the tension is palpable, making every interaction feel like a potential revelation.. Era: Dim lighting and flickering candles reflect the uncertainty of the times.

The Reading Room: In this dimly lit room, the air hangs heavy with the weight of secrets. The musty scent of old paper mingles with the tension of the unknown, creating a sanctuary for discovery and dread alike.. Camera angle: Writers should approach this space with a sense of caution, aware that every book holds a potential clue to the mystery at hand.. Era: The quiet ambiance allows for reflection, yet echoes the unease of hidden truths.

The Servants’ Quarters: The quarters buzz with a mix of camaraderie and tension, where the staff share whispers of discontent. The cramped space feels both intimate and fraught with unspoken worries, reflecting the burdens they carry.. Camera angle: A writer entering this space should feel the weight of secrets and alliances, setting the stage for intrigue.. Era: The stark contrast between the opulence above and the utilitarian nature of this space amplifies the divide between staff and guests.

## Humour guidance for this story position (early)
Permission: forbidden
Rationale: The seriousness of the investigation creates a tense atmosphere inappropriate for humor.

## Reveal Groundwork (texture — do not explain, only plant)
- Plant one subtle observable beat related to: "The moment when Eleanor's body is discovered the relationships among the characters, as their hidden motives and ambitions are laid bare". Do not explain significance yet.
- Plant one subtle observable beat related to: "Plant one subtle anomaly that can be re-read after the resolution.". Do not explain significance yet.
- Plant one subtle observable beat related to: "The tension scene, where characters grapple with their secrets, foreshadows the tragic conclusions that follow, deepening the emotional impact of their choices". Do not explain significance yet.

FAIR-PLAY AND INFERENCE CONTRACT:
- FAIR PLAY CLUE TIMING: Never combine clue discovery and detective deduction in the same chapter. If a clue is first revealed to the reader in chapter N, the detective may only analyze, deduce from, or act on that clue in chapter N+1 or later.
- FAIR PLAY INFORMATION PARITY: The reader must see all clues BEFORE the detective uses them in reasoning. If the detective performs a test or makes a deduction, every piece of evidence supporting that conclusion must have been shown to the reader in earlier chapters.
- FAIR PLAY REVELATION SPACING: In the discriminating test scene, the detective can ONLY use clues that were revealed to the reader at least 1 full chapter earlier. Never introduce new clues or withheld information during the test.
- FAIR PLAY CONFRONTATION: During the final confrontation/revelation, the detective cannot surprise the reader with facts. Every piece of evidence cited must have been visible to the reader in prior chapters.
- Never solve by withheld information. Keep reader-information parity with detective reasoning.
- False assumption in force: Eleanor Voss died from a heart attack due to her known health issues.
- Hidden truth to progressively expose (compose in your own words from these elements): true, cause, death, delayed, action, poison, administered, beatrice
- Inference path checkpoints to dramatize clearly — compose ENTIRELY in your own sentences from these key terms (reproducing any briefing phrase verbatim FAILS validation):
  - Step 1: obs: half, empty, bottle, poison, beatrice, cleaning, cart | corr: poison, presence, beatrice, cart, suggests, access | effect: narrows, suspect, pool, implicating, beatrice, quill
  - Step 2: obs: witnesses, report, seeing, beatrice, enter, eleanor, room, shortly, before, death | corr: beatrice, opportunity, administer, poison, cleaning | effect: eliminates, suspects, confirming, beatrice, access
  - Step 3: obs: results, reveal, eleanor, high, levels, poison, bloodstream | corr: presence, poison, directly, contradicts, heart, attack, theory | effect: eliminates, assumption, natural, causes
- Discriminating test method: trap
- Discriminating test elements to dramatize (compose ENTIRELY in your own sentences from these — do NOT reproduce any briefing phrase verbatim): staged, reenactment, beatrice, asked, serve, similar, drink, guest, detective, observes, actions
- Test must rely on already-shown clue IDs: clue_mechanism_visibility_core, clue_1, clue_2, clue_fp_contradiction_step_2, clue_fp_contradiction_step_1
- Fair-play rationale: Step 1: The poison bottle (early) and witness testimony (mid) suggest Beatrice's access. Step 2: Toxicology results (early) eliminate natural causes. Step 3: The reenactment (discriminating test) confirms Beatrice's connection to the poison.

## Character Reference

### Dr. Mallory Finch (she/her — NEVER he/him)
Finch speaks with a clinical precision, often punctuating her sentences with sardonic remarks
She has a habit of using medical jargon even in casual conversations, which can alienate her listeners.
Mallory is torn between her ambition and the moral implications of her actions, constantly grappling with the fear that her secrets will be unveiled, leading to her professional ruin.
Voice colour: Dr. Mallory Finch uses dry wit humour — let it surface in their dialogue where natural, not in every line.

### Captain Ivor Hale (he/him — NEVER she/her)
Ivor speaks in a slow, deliberate manner, often punctuating his stories with self-deprecating humor
He has a tendency to reflect on the past, using anecdotes to illustrate his points.
Ivor grapples with feelings of guilt and shame over his past actions, wrestling with the fear that his secrets will come to light and that he will be judged for them.
Voice colour: Captain Ivor Hale uses self deprecating humour — let it surface in their dialogue where natural, not in every line.

### Beatrice Quill (she/her — NEVER he/him)
Beatrice speaks with a youthful eagerness, often punctuating her words with exaggerated enthusiasm
She has a tendency to drop sarcastic remarks when she feels slighted.
Beatrice is torn between her desire for recognition and her loyalty to Eleanor, feeling the pressure of ambition pull her in conflicting directions.
Voice colour: Beatrice Quill uses sardonic humour — let it surface in their dialogue where natural, not in every line.

### Sylvia Trent (she/her — NEVER he/him)
Sylvia speaks with a directness that can be jarring, often cutting through pleasantries with sharp observations
She tends to use concise language, emphasizing her points with conviction.
Sylvia grapples with the tension between her drive for success and the moral implications of her actions, fearing that her ambition might lead her to a dark place.
Voice colour: Sylvia Trent uses blunt humour — let it surface in their dialogue where natural, not in every line.

### Hugo Vane (he/him — NEVER she/her)
Hugo speaks with a relaxed charm, often using anecdotes to illustrate his points
He has a tendency to lean into humor, deflecting tension with light-hearted banter.
Hugo grapples with the fear of failure, as the prospect of losing everything he has built looms large, forcing him to confront the consequences of his ambition.
Voice colour: Hugo Vane uses observational humour — let it surface in their dialogue where natural, not in every line.


## CHARACTER CONTRACTS (binding for this scene)
Each entry below constrains how this character must be written in this chapter.
These override generic style guidance when they conflict.

### Dr. Mallory Finch[SHE]
Voice & mannerisms: Dr. Finch speaks with a clinical precision, often punctuating her sentences with sardonic remarks. She has a habit of using medical jargon even in casual conversations, which can alienate her listeners.
SIGNATURE TIC (use sparingly — this is Dr. Mallory Finch's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "‘In the grand scheme of things, it’s merely a matter of perspective.’"
Sample voice fragments (match this register and rhythm):
  [comfortable] "‘In the grand scheme of things, it’s merely a matter of perspective.’"
  [evasive] "‘I’ve been at the hospital—just busy with patients, you understand.’"
Humour: dry wit — deploy occasionally (level 0.4)
FORBIDDEN phrase (never write for Dr. Mallory Finch): "a surge of determination washed over her"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Eleanor's threat to expose her unethical practices after receiving treatment becomes a catalyst for Mallory's desperate actions." — do not surface in Act I.

### Captain Ivor Hale[HE]
Voice & mannerisms: Ivor speaks in a slow, deliberate manner, often punctuating his stories with self-deprecating humor. He has a tendency to reflect on the past, using anecdotes to illustrate his points.
SIGNATURE TIC (use sparingly — this is Captain Ivor Hale's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "‘Ah, the follies of youth, how they haunt us.’"
Sample voice fragments (match this register and rhythm):
  [comfortable] "‘Ah, the follies of youth, how they haunt us, indeed!’"
  [evasive] "‘Well, I might have been elsewhere, you know how it is at gatherings.’"
Humour: self deprecating — deploy occasionally (level 0.5)
FORBIDDEN phrase (never write for Captain Ivor Hale): "she knew with certainty she was right"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Eleanor's discovery of his blackmail situation becomes a catalyst for his actions, as she threatens to expose him." — do not surface in Act I.

### Beatrice Quill[SHE]
Voice & mannerisms: Beatrice speaks with a youthful eagerness, often punctuating her words with exaggerated enthusiasm. She has a tendency to drop sarcastic remarks when she feels slighted.
SIGNATURE TIC (use sparingly — this is Beatrice Quill's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "‘Oh, the things we do for success!’"
Sample voice fragments (match this register and rhythm):
  [comfortable] "‘Oh, the things we do for success! It’s all part of the charm, isn’t it?’"
  [evasive] "‘I was just tidying up, nothing out of the ordinary.’"
Humour: sardonic — deploy occasionally (level 0.4)
FORBIDDEN phrase (never write for Beatrice Quill): "palpable tension filled the room"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Her belief that Eleanor actively sabotaged her career propels Beatrice into a dangerous mindset, seeing her as an obstacle to her ambitions." — do not surface in Act I.

### Sylvia Trent[SHE]
Voice & mannerisms: Sylvia speaks with a directness that can be jarring, often cutting through pleasantries with sharp observations. She tends to use concise language, emphasizing her points with conviction.
SIGNATURE TIC (use sparingly — this is Sylvia Trent's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "‘The truth is a double-edged sword.’"
Sample voice fragments (match this register and rhythm):
  [comfortable] "‘The truth is a double-edged sword, but isn’t that what makes it intriguing?’"
  [evasive] "‘I was busy in my room, just trying to get some writing done.’"
Humour: blunt — deploy occasionally (level 0.5)
FORBIDDEN phrase (never write for Sylvia Trent): "she chose her words with great care"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Eleanor's refusal to grant her an interview could be the tipping point for Sylvia, leading her to take drastic measures." — do not surface in Act I.

### Hugo Vane[HE]
Voice & mannerisms: Hugo speaks with a relaxed charm, often using anecdotes to illustrate his points. He has a tendency to lean into humor, deflecting tension with light-hearted banter.
SIGNATURE TIC (use sparingly — this is Hugo Vane's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "‘Ah, but that’s just business, isn’t it?’"
Sample voice fragments (match this register and rhythm):
  [comfortable] "‘Ah, but that’s just business, isn’t it? You have to roll with the punches!’"
  [evasive] "‘I was mingling, you know, just ensuring everything was in order.’"
Humour: observational — deploy occasionally (level 0.4)
FORBIDDEN phrase (never write for Hugo Vane): "everyone could sense the atmosphere"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "The potential inheritance tied to Eleanor could provide a lifeline for his failing ventures." — do not surface in Act I.



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

- Living through April 1945 means grappling with the last throes of World War II, where the air is thick with anticipation and uncertainty
- The end of the war is nearing, yet the scars it has left on society are deep
- In communities across England, rationing persists, affecting everyday life, from the food on the table to the clothes in one's wardrobe
- Conversations often revolve around the war's impact, with returning soldiers adjusting to civilian life while women who filled roles during the conflict now fight to maintain their newfound independence
- The Grand Azure Hotel stands as a microcosm of this societal tension, where guests navigate their aspirations and disappointments, often in silence, masking their struggles under the guise of post-war optimism

TEMPORAL CONTEXT:

This story takes place in April 1945 during spring.

Seasonal Atmosphere:
- Weather patterns: Overcast skies with frequent rain showers, Cool breezes from the coast, Occasional bursts of sunshine breaking through clouds
- Daylight: Days are becoming longer with daylight extending into the evening, but the coastal fog often rolls in, making the atmosphere feel moody.
- Seasonal activities: Spring cleaning in local homes, Visiting coastal beaches despite the chill, Attending church services for Easter celebrations
- Seasonal occasions: Easter (April 1, 1945)
- Season: spring

Period Fashion (describe naturally):
- Men formal: Three-piece suits with waistcoats in muted colors, Fedoras or trilby hats, Leather shoes polished to a shine
- Men casual: Cotton shirts with rolled-up sleeves, Trousers with wide cuffs, Wool sweaters for added warmth
- Men accessories: Silk ties in conservative patterns, Pocket squares for suits, Leather gloves for the chilly evenings
- Women formal: Tea-length dresses with floral prints, Tailored jackets with nipped waists, Cloche hats adorned with ribbons
- Women casual: A-line skirts paired with fitted blouses, Cardigans for layering, Flat-heeled shoes or low pumps
- Women accessories: Pearl necklaces and earrings, Handbags with structured designs, Scarves for hair or neck embellishments

Cultural Context (reference naturally):
- Music/entertainment: Bing Crosby's 'Don't Fence Me In', The Ink Spots' 'If I Didn't Care', Nat King Cole's 'Straighten Up and Fly Right'; Films: 'The Lost Weekend' exploring the struggles of addiction, 'Mildred Pierce' showcasing women's resilience; Theatre: The original Broadway production of 'Carousel', Revival of 'Oklahoma!' drawing crowds; Radio: 'The Jack Benny Program' providing comic relief, News broadcasts detailing war updates
- Typical prices: Bread loaf: four pence, A pint of milk: two pence, A weekly newspaper: six pence
- Current events: The war in Europe is nearing its end with the fall of Berlin imminent; The United Nations is being formed to promote peace
- Literature: 'The Catcher in the Rye' by J.D. Salinger | 'The Great Gatsby' by F. Scott Fitzgerald (reprints due to war) | 'The Member of the Wedding' by Carson McCullers | [Mystery and detective fiction gaining popularity] | [Realist novels reflecting societal changes] | [War literature capturing the human experience amidst conflict]
- Technology: The atomic bomb, highlighting the end of WWII | Advancements in radar technology | Early computers beginning to emerge for military use | Table radios for entertainment and news | Early television sets, although limited programming is available | Automobiles, though fuel rationing limits usage
- Daily life: Gathering for tea and conversation, Participating in community events like church picnics, Taking walks along the coast despite the chill
- Social rituals: Sunday family gatherings after church services, Weekly dance nights at local halls, Neighborhood watch meetings discussing safety and community concerns

Atmospheric Details:
The scent of rain-soaked earth mingles with the salty coastal air, creating a heavy atmosphere that clings to the skin. The distant sound of waves crashing against the shore blends with the murmur of guests speaking in hushed tones, each word laden with unspoken fears. Candles flicker in the dimly lit hote
[truncated for prompt budget]

NON-NEGOTIABLE CHAPTER OBLIGATIONS — LOCKED EVIDENCE VALUES (VERBATIM REQUIRED):
The following measured values (times, amounts, measurements) are absolute ground truth. Every time this chapter describes, mentions, or alludes to one — no matter how briefly — it MUST use the exact phrase shown below, character for character. NO paraphrase, approximation, rounding, or synonym is permitted.

FAILURE EXAMPLE: if the locked value is "at thirteen minutes to midnight" and you write "just before midnight" or "around midnight" — that is a HARD FAIL. You must write "at thirteen minutes to midnight". Equally, if the locked value is written in words, such as "ten minutes past eleven", and you convert it to figure-based clock notation — that is also a HARD FAIL. Words stay as words; figure forms are forbidden for word-phrased facts.

CRITICAL — WORD-PHRASED VALUES: If the canonical value is written out in words (e.g. a time like "ten minutes past eleven", or an amount like "forty minutes"), reproduce those exact words. DO NOT convert to figure-based time notation, twenty-four-hour format, or any other numeric shorthand. Correct: "ten minutes past eleven". WRONG: figure-based clock notation or numeric shorthand.

Locked values:
  - Distance from the beach to the victim's room: "forty feet"
  - Time taken for the poison to become active after ingestion: "two hours"
  - Volume of the poison bottle found: "thirty ounces"
  - Time of the victim's death as recorded: "ten minutes past midnight"

If a value has no relevance to this chapter, omit it. But the moment you reference the underlying evidence, only the exact phrase above is acceptable.

⛔ CLUES TO SURFACE IN THESE CHAPTERS — mandatory:
The following evidence MUST be clearly observable to an attentive reader. Do not bury it in atmosphere or passing dialogue. Each clue must be concrete, specific, and noticeable:

• [clue_culprit_direct_beatrice_quill] direct, ties, beatrice, quill, mechanism, access, point, before, discriminating, excludes, competing, suspect
  Category: testimonial | Criticality: essential | Supports inference step 1
  Points to: direct, shows, beatrice, quill, means, opportunity, narrowing, solution, uniquely, toward, culprit, eligible

• [clue_early_1] witnesses, report, seeing, beatrice, enter, eleanor, room, shortly, before, death
  Category: temporal | Criticality: essential | Supports inference step 2
  Points to: beatrice, opportunity, commit, murder

• [clue_9] Behavioral observation
  Category: structural | Placement: early (Act 1)
  Points to: what this observation reveals about the time or circumstances of the crime.

• [clue_fp_contradiction_step_1] Cross-check contradiction
  Category: structural | Placement: early (Act 1)
  Points to: what this observation reveals about the time or circumstances of the crime.

• [clue_fp_contradiction_step_2] Cross-check contradiction
  Category: structural | Placement: early (Act 1)
  Points to: what this observation reveals about the time or circumstances of the crime.

For each clue above: an attentive reader should be able to find, record, and later use it to reason toward the solution.

═══ NARRATIVE STATE (read-only — do not contradict) ═══

LOCKED FACTS — use verbatim whenever this evidence is described:
  • Distance from the beach to the victim's room: "forty feet"
  • Time taken for the poison to become active after ingestion: "two hours"
  • Volume of the poison bottle found: "thirty ounces"
  • Time of the victim's death as recorded: "ten minutes past midnight"

CHARACTER PRONOUNS — never deviate from these:
  • Eleanor Voss: she/her/her
  • Dr. Mallory Finch: she/her/her
  • Captain Ivor Hale: he/him/his
  • Beatrice Quill: she/her/her
  • Sylvia Trent: she/her/her
  • Hugo Vane: he/him/his

CLUES ALREADY REVEALED TO READER: clue_mechanism_visibility_core, clue_core_contradiction_chain, clue_fp_contradiction_step_2, clue_1, clue_9, clue_fp_contradiction_step_1 — do not reveal these as new information.

INVESTIGATION LOG — WHAT IS ESTABLISHED (do not re-establish, do not repeat):
• Evidence already established (reference only — do NOT restate or quote these; advance beyond them): beatrice, access, poison | beatrice, access, poison | beatrice, opportunity, administer, poison, cleaning | beatrice, opportunity, commit, murder | beatrice, opportunity | poison, presence, beatrice, cart, suggests, access
• Suspects still unresolved: Dr. Mallory Finch[SHE], Captain Ivor Hale[HE], Sylvia Trent[SHE]
⚠ The story must move FORWARD from this log. Any beat already listed above is forbidden from repeating.

⚠ THIS CHAPTER'S REQUIRED ADVANCE (early): Interview each suspect — record their claimed whereabouts

CONTINUITY HANDOFF — previous chapter closing beat:
  • "By the end, the scene had changed. No confession had been forced, and no arrest had been made, but the balance among suspects had shifted. Hugo Vane left the last question hanging where everyone could feel it, attached to evidence that would have to be answere..."
  • The next chapter must open as a continuation of this beat, not as a disconnected reset.

⛔ DEAD CHARACTER — CANNOT APPEAR AS ALIVE:
• Eleanor Voss: murdered before Chapter 1. In ALL chapters from here on:
  - Refer to them ONLY in past tense, only as the victim of the crime
  - NEVER have them: enter a room, speak, respond, gesture, look, nod, or react
  - NEVER describe them as present at any scene, conversation, or confrontation
  - WRONG: "Eleanor Voss crossed the room" / "Eleanor Voss sat on the sofa" / "Eleanor Voss nodded"
  - WRONG: "Eleanor Voss gave testimony" / "Eleanor Voss asked what had happened"
  - CORRECT: "Eleanor Voss had often said..." / "Eleanor Voss's effects were found" / "witnesses recalled Eleanor Voss's habit of..."
═══════════════════════════════════════════════════════

═══════════════════════════════════════════════════════════
📚 CONTINUITY CONTEXT - CHARACTER & SETTING CONSISTENCY
═══════════════════════════════════════════════════════════

**CRITICAL: You are writing chapters 3+. Maintain consistency with earlier chapters.**

**Character Names Used in Chapters 1-2:**
Eleanor Voss, Dr. Mallory Finch, Beatrice Quill, Hugo Vane, Captain Ivor Hale

✓ RULE: Use EXACTLY these names. Do NOT vary spelling, add titles, or introduce new forms.
✓ Example: if earlier chapters used "Clara Whitfield", keep using "Clara Whitfield" — never "Mrs. Whitfield" unless that is the character's canonical name in the list above.

**Setting Vocabulary Established in Earlier Chapters:**
corridor, lounge

✓ RULE: Continue using this location vocabulary. Maintain consistency with established setting type.
✓ Do NOT introduce new location types that contradict earlier chapters.

**Recent Chapter Summary (for narrative continuity):**
Chapter 1: Chapter 1: The Stilled Watch
  Events: A low knock echoed along the corridor, muffled by the thick carpet and the persistent drizzle tapping against the windowpanes.
Chapter 2: Chapter 2
  Events: Hugo Vane, Dr.

⚠️ **VALIDATION:** Character name mismatches and setting drift are common failure modes.
Double-check every character name against the list above before using it.

**⏱ LOCKED TIME ANCHOR — use verbatim, do not paraphrase:**
Clock time (from the case ground truth): **"Eleanor's last known interaction at 9 PM"**
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
Known location profile anchors: The Grand Azure Hotel, The Broken Promenade, The Sapphire Lounge, The Reading Room, The Servants’ Quarters, Eleanor Voss's hotel room
LOCATION NAME CAPITALISATION (HARD REQUIREMENT — validated):
All named locations in your prose MUST use the EXACT capitalisation from the CML profiles.
Canonical forms: "The Grand Azure Hotel", "The Broken Promenade", "The Sapphire Lounge", "The Reading Room", "The Servants’ Quarters", "Eleanor Voss's hotel room"
Writing a location in lowercase (e.g. "drawing room" instead of "Drawing Room") is a validated error. Every time you mention a named location, copy its capitalisation from the list above.
- Chapter 3: OPENING STYLE (HARD): Start the VERY FIRST SENTENCE with an explicit time marker — e.g. "That morning…" / "By the time dusk fell…" / "It was nearly four o'clock…" / "On the second day after the discovery…". Time must be in the first clause. Anchor opening in "Eleanor Voss's hotel room". The opening style above governs only your FIRST SENTENCE; the grounding below may land anywhere in the first 2 paragraphs (it need not be sentence one, and never conflicts with the chosen opening style). HARD REQUIREMENT for the first 2 paragraphs: (a) include 2+ sensory words — choose from smell/scent/odor/fragrance/sound/echo/silence/whisper/creak/cold/warm/damp/rough/smooth/glow/shadow/flicker/dim — and (b) include 1+ atmosphere/time word — choose from rain/wind/fog/storm/mist/thunder/evening/morning/night/dawn/dusk/lighting/weather/season/afternoon/midday/noon/midnight/twilight/sunrise/sunset/daylight/sunlight/overcast/cloudy/bright/dark/grey/pale/chill/crisp/drizzle/haze/lamplight/firelight. These are validated requirements, not style suggestions; missing them triggers a retry.

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

PROMPT BUDGET SUMMARY: budget=24000 tokens; fixed=11561; context=11612; dropped=[humour_guide, location_profiles]; truncated=[location_profiles, temporal_context, pronoun_accuracy]

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
4. Integrate at least two concrete era-grounded details per chapter from setting refinement signals: radio broadcasting | early television sets | automobiles with limited fuel availability | long-distance telephone calls | military-style encrypted messages | telegrams.
5. Respect setting movement/access constraints in scene action and alibis: narrow hallways limiting movement | public areas monitored by staff | oceanfront access restricted to guests | restricted access to staff-only areas | check-in protocols for guests.
6. Sustain social coherence with this backdrop pressure: A delayed-action poisoning at a seaside hotel brings together a diverse group of guests and staff, all navigating the tensions of post-war society and the uncertainties of the Cold War.
7. Maintain continuity around these socially central cast anchors where relevant: Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill, Sylvia Trent, Hugo Vane.
8. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Critical: Plot similarity 0.85 with 'The Mysterious Affair at Styles' (same crime type and method)
9. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Moderate: Setting similarity 0.80 with 'The Mysterious Affair at Styles' (similar era and location type)
10. STORY TO DATE ANTI-COPY RULE: The STORY TO DATE section below is provided for chronological and factual reference ONLY. You MUST NOT copy, lightly rephrase, or structurally echo any sentence or paragraph from prior chapters. Every sentence in this chapter must be original prose unique to this scene. Reusing even a clause from prior chapter text will cause this attempt to fail immediately.

CRITICAL PROSE REQUIREMENTS:

The CML specifies exact requirements for certain validation-critical scenes. You MUST include these elements at the specified positions.

**Discriminating Test Scene (Act 3, Scene 4):**
Required elements: Execute the discriminating test, Observe the culprit's reaction or result, Draw conclusion about guilt

**Suspect Clearance Scenes:**
- Dr. Mallory Finch (Act 3, Scene 5): Alibi confirmed by multiple witnesses
  Clues: clue_id_1, clue_id_2
- Captain Ivor Hale (Act 3, Scene 5): Witnesses confirm his presence at a charity event during the murder time.
  Clues: clue_id_3, clue_id_4
- Sylvia Trent (Act 3, Scene 5): Alibi corroborated by hotel staff.
  Clues: clue_id_5, clue_id_6

**Culprit Revelation Scene (Act 3, Scene 6):**
Method: Confrontation with evidence showing Beatrice's guilt

**Clue Placement for These Chapters:**
- clue_9 must appear in Act 1, Scene 3 via Behavioral observation
- clue_culprit_direct_beatrice_quill must appear in Act 1, Scene 3 via Witness statement
- clue_early_1 must appear in Act 1, Scene 3 via Direct observation
- clue_fp_contradiction_step_1 must appear in Act 1, Scene 3 via Cross-check contradiction
- clue_fp_contradiction_step_2 must appear in Act 1, Scene 3 via Cross-check contradiction

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
  - Scene is set in: Eleanor Voss's hotel room — reference it naturally within the paragraph, never as your opening phrase.
  - Opening atmosphere (MANDATORY — validator enforced): the first paragraph MUST contain at least one of: rain / wind / fog / storm / mist / thunder / evening / morning / night / dawn / dusk / season / afternoon / midday / noon / midnight / twilight / sunrise / sunset / daylight / sunlight / overcast / cloudy / bright / dark / grey / pale / cold / warm / chill / crisp / damp / drizzle / haze / lamplight / firelight. A chapter that omits all of these from its opening paragraph will be rejected.
  - PARAGRAPH OPENER DIVERSITY (MANDATORY — validator enforced): No more than 2 paragraphs in this chapter may begin with "Hugo" or "Hugo's" as the first word. You must vary paragraph openings throughout: use sensory observations, another character's name or action, dialogue, object or sound details, or temporal markers. Opening 3 or more paragraphs with "Hugo" will cause automated rejection.
  - ⛔ MECHANISM SPOILER BAN: Do NOT state how the crime device was manipulated — not the direction, not the magnitude, not who performed it. Characters may only observe that two sources of evidence disagree. The specific method, tamper amount, and perpetrator's action are ALL FORBIDDEN until the reveal. WRONG: "The culprit had altered the device by forty minutes to create a false alibi." RIGHT: "Two independent pieces of evidence gave contradictory readings — a discrepancy neither could yet explain."
  - Continuity bridge: in the first 120 words, visibly connect from the previous chapter's final beat. Carry forward one unresolved element (object, accusation, emotional pressure, or immediate physical action) from: "By the end, the scene had changed. No confession had been forced, and no arrest had been made, but the balance among suspects had shifted. Hugo Vane left the last question hanging where everyone could feel it, attached t...".
  - CLUE OBLIGATIONS — each clue below MUST be dramatized, but in YOUR OWN WORDS:
    Render each as something a character SEES, DOES, or SAYS on the page. The bracketed text is a
    DESCRIPTION of the evidence for you — do NOT transcribe it as narration. Copying a clue's
    description sentence verbatim into the prose FAILS validation.
    • beatrice, observed, entering, exiting, eleanor, room [clue_9] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      ⛔ SPOILER EMBARGO (pre-reveal chapter): surface ONLY the surface anomaly a character can see/hear/find.
         Do NOT name who it implicates, state the tamper direction or magnitude, or explain the mechanism in this chapter.
         Present it as an unexplained discrepancy; the culprit and method are revealed later.
         Place this OBSERVATION in paragraph 1 or 2 (observation only — no inference about the culprit).
    • detective, notes, half, empty, bottle, poison, beatrice, cleaning, cart [clue_culprit_direct_beatrice_quill] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      ⛔ SPOILER EMBARGO (pre-reveal chapter): surface ONLY the surface anomaly a character can see/hear/find.
         Do NOT name who it implicates, state the tamper direction or magnitude, or explain the mechanism in this chapter.
         Present it as an unexplained discrepancy; the culprit and method are revealed later.
         Place this OBSERVATION in paragraph 1 or 2 (observation only — no inference about the culprit).
    • witnesses, recount, beatrice, entering, room, specific, time [clue_early_1] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: beatrice, opportunity, commit, murder
      ↳ MANDATORY TWO-PARAGRAPH STRUCTURE (must appear in paragraphs 1 or 2 — no later):
         Paragraph 1: The POV character physically approaches or directly observes this evidence.
           The narration or dialogue explicitly states what is seen (use the exact locked phrase if one applies).
         Paragraph 2 (immediately following): The detective or POV character explicitly reasons
           about what this evidence implies — who it implicates, why it may be unreliable,
           or what inference it supports. This must be a separate full paragraph, not a sentence appended to Paragraph 1.
    • detective, notes, half, empty, bottle, poison, beatrice, cleaning, cart [clue_fp_contradiction_step_1] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: poison, presence, beatrice, cart, suggests, access
      ↳ MANDATORY TWO-PARAGRAPH STRUCTURE (must appear in paragraphs 1 or 2 — no later):
         Paragraph 1: The POV character physically approaches or directly observes this evidence.
           The narration or dialogue explicitly states what is seen (use the exact locked phrase if one applies).
         Paragraph 2 (immediately following): The detective or POV character explicitly reasons
           about what this evidence implies — who it implicates, why it may be unreliable,
           or what inference it supports. This must be a separate full paragraph, not a sentence appended to Paragraph 1.
    • detective, notes, half, empty, bottle, poison, beatrice, cleaning, cart [clue_fp_contradiction_step_2] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: beatrice, opportunity, administer, poison, cleaning
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
  - ALIBI LOCK: Beatrice Quill's established alibi is "7 PM to 9 PM". Do NOT place Beatrice Quill at any other location or in any other activity during the crime window. Any contradiction is a continuity error that triggers a retry.
  - TESTIMONY CONTINUITY: Beatrice Quill has already made statements in earlier chapters. Any time, location, or claim attributed to Beatrice Quill in THIS chapter must be consistent with those earlier statements. Do NOT introduce a new or different alibi claim — any contradiction is a continuity error.
- Locked fact phrase obligations:
  - If this batch mentions Distance from the beach to the victim's room, write exactly: "forty feet".
  - If this batch mentions Time taken for the poison to become active after ingestion, write exactly: "two hours".
  - If this batch mentions Volume of the poison bottle found, write exactly: "thirty ounces".
  - If this batch mentions Time of the victim's death as recorded, write exactly: "ten minutes past midnight".
- Seasonal vocabulary allow-list: spring, vernal, springtime.
- Forbidden seasonal words: summer, autumn, winter.

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
Suspect pressure target(s): Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill, Sylvia Trent
Required new information: At least one fear/motive/lie/loyalty reveal with investigative consequence.
Forbidden reveals at this stage: No culprit resolution: no confession, no arrest, no 'case closed', no accusation ('I accuse'/'I name'), and never state 'the culprit/murderer/killer is/was …'. The accusation is reserved for the final reveal — build suspicion only.

FROZEN FACT STATE (DO NOT ALTER):
- Timeline anchor: April (spring).
- Month, season, weather, and time-of-year language in this batch must stay compatible with spring.
- Established timeline fact: Eleanor's last known interaction at 9 PM
- Established timeline fact: Death at 11 PM
- If referenced, use exact phrase: "forty feet" (Distance from the beach to the victim's room).
- If referenced, use exact phrase: "two hours" (Time taken for the poison to become active after ingestion).
- If referenced, use exact phrase: "thirty ounces" (Volume of the poison bottle found).
- If referenced, use exact phrase: "ten minutes past midnight" (Time of the victim's death as recorded).

STORY TO DATE (REFERENCE ONLY — DO NOT COPY VERBATIM):
- Full prior chapter text is provided below for continuity, factual consistency, and reference accuracy.
- Use this to keep character voice, chronology, clue state, and location continuity aligned with earlier chapters.
- Do not quote, copy, or paraphrase these paragraphs too closely; write fresh prose that remains consistent with them.

--- BEGIN PRIOR CHAPTER 1 ---
Title: Chapter 1: The Stilled Watch
A low knock echoed along the corridor, muffled by the thick carpet and the persistent drizzle tapping against the windowpanes. Hugo Vane pressed his palm to the cold brass handle of Eleanor Voss's hotel room, feeling the chill seep through his glove. The air in the hallway was heavy with the scent of damp linen and the faint tang of brine drifting in from the sea beyond, a reminder that spring on the Brighton coast was rarely gentle. As Hugo entered, the dim morning light filtered through rain-streaked glass, casting wavering shadows across the floor. There, beneath the ornate headboard and a tangle of bedclothes, lay Eleanor Voss—her features unnaturally still, her hand curled tightly around a silver pocket watch, its face frozen at ten past eleven.

The silence in the room was broken only by the distant murmur of voices from below and the soft creak of floorboards as Hugo stepped forward. His gaze fell on a cleaning cart abandoned just inside the door, its contents in disarray. Amid the rags and polish, a bottle—glass, substantial, and half-empty—caught the light. The label, faded but legible, named a caustic substance more suited to a laboratory than a guest room. Hugo noted the volume at a glance: thirty ounces, though it was clear that much less remained. The bottle's placement, nestled among Beatrice Quill's familiar cleaning supplies, immediately unsettled him. He knelt, careful not to disturb the scene, and studied the cart with a frown.

The presence of that half-empty bottle in Beatrice's cart raised immediate questions. Beatrice Quill, the young woman responsible for the morning cleaning rounds, was known for her meticulousness—her carts never left untidy, her supplies always accounted for. Yet here was a dangerous chemical, out of place and unguarded, suggesting access to something far more sinister than dust and fingerprints. Hugo's mind raced: had Beatrice been careless, or was this evidence of something more deliberate? The implication was troubling, narrowing the field of suspicion in a way he could not yet voice aloud.

He turned his attention to Eleanor Voss herself, the woman whose presence had animated The Grand Azure Hotel with a peculiar blend of warmth and command. Her face, usually animated with a gentle smile, was now slack and pale, lips parted as if to speak one last word. The stopped watch in her grasp—ten past eleven—offered a silent contradiction, for the hotel’s main clock downstairs had chimed midnight only moments before the alarm was raised. Hugo’s breath caught; the discrepancy between the watch and the public timepiece was not easily explained. He resisted the urge to check his own wristwatch, aware that the act would do nothing to settle the unease curling in his chest.

Behind him, the door opened with a hesitant creak. Beatrice Quill hovered in the threshold, her hands twisting a rag until the fabric threatened to unravel. Her eyes, red-rimmed and wide, flicked from Eleanor’s body to the cart. She did not step inside. Instead, she pressed her back to the doorframe as if to steady herself. ‘I—I only came to tidy up, Mr. Vane. Miss Voss said she’d be working late, but she never answered when I knocked this morning.’ Her voice was thin, almost lost in the hush.

Hugo studied Beatrice with the careful detachment he reserved for business negotiations gone sour. Beatrice’s public identity as the hotel’s ambitious young worker was well established, her connection to Eleanor Voss rooted in early-morning routines and whispered confidences over tea. Now, in the pale light, Beatrice’s composure faltered: a tremor in her voice, a glance that lingered too long on the half-empty bottle. Hugo noted the detail, filing it away with the precision of a man accustomed to reading the subtext beneath polite conversation. It was not guilt he saw—at least, not yet—but a pressure building behind her eyes, a fear of implication that made her movements stilted.

‘You found her, then?’ Hugo asked, his tone gentle but probing. Beatrice nodded, her grip on the rag tightening. ‘I did. I thought she was sleeping, but…’ Her words trailed off. Hugo waited, letting the silence stretch. Beatrice’s gaze darted to the cart, then away. ‘That bottle—it’s not mine. I mean, I use it for the floors, but I never leave it out. Someone must have—’ She caught herself, swallowing hard. The implication hung between them, unspoken but potent.

A faint cough from the corridor signaled the arrival of Dr. Mallory Finch, her coat damp from the morning rain. She entered briskly, her eyes sweeping the room before settling on Eleanor’s still form. ‘Mr. Vane, I’m afraid there’s little I can do now. Eleanor’s heart was never strong, you know. She spoke of chest pains only last week.’ Dr. Finch’s words, practical and subdued, seeded the first red herring—an explanation almost too convenient, given the evidence at hand. Hugo inclined his head, but his attention remained fixed on the clues before him.

The room itself bore few signs of struggle. A single glass sat untouched on the bedside table, a faint ring of moisture beneath it. The radio, tuned to the BBC, crackled with static—a war bulletin left unfinished. The only other anomaly was the cleaning cart, its disorder at odds with Beatrice’s reputation. Hugo’s mind worked methodically: Eleanor’s last known interaction had been at nine o’clock, her death now fixed by the stilled watch at ten past eleven. Yet the hotel’s main clock, the one every guest relied upon, had insisted it was midnight when the commotion began. The contradiction was inescapable.

As the morning wore on, the corridor outside Eleanor’s room filled with the muted sounds of the hotel stirring to life: the clatter of crockery from the kitchens, the low hum of voices speculating in the lounge. Hugo stood at the window, watching rain trace uncertain paths down the glass. The world outside seemed indifferent to the drama unfolding within these walls, the vernal chill pressing in as if to remind him that spring was a season for renewal, not for death. Yet here, in this quiet room, the promise of new beginnings had been violently stilled.

A final glance at Eleanor Voss’s hand—still clutching the pocket watch—confirmed what Hugo already suspected: the time of her death, as recorded, could not be reconciled with the hotel’s official account. The evidence was plain, but the meaning remained elusive. Hugo drew a slow breath, steeling himself for the questions to come. The Grand Azure Hotel, with its faded glamour and rationed comforts, had become a crucible of suspicion. And Hugo Vane, by circumstance and necessity, was now its investigator.
--- END PRIOR CHAPTER 1 ---

--- BEGIN PRIOR CHAPTER 2 ---
Title: Chapter 2
Eleanor Voss's hotel room held the inquiry in Morning after the murder, with Somber and chaotic as staff and guests gather pressing at the windows and along the furniture. Hugo Vane, Dr. Mallory Finch, Captain Ivor Hale did not begin with certainty. They began with what could still be checked: who stood where, what had been touched, and which statement shifted under pressure.

Hugo Vane, Dr. Mallory Finch, Captain Ivor Hale remained close enough to be seen and heard. One answer came too quickly; another arrived after a pause long enough to matter. The exchange did not solve the case, but it sharpened the investigation because each person had to attach their words to a concrete time, object, or movement.

The most important observable details were Witnesses recount beatrice entering room specific; Beatrice observed entering exiting eleanor room; Detective notes half empty bottle poison, and each was something the investigators could see, time, or test for themselves. The detail was not treated as a conclusion by itself. It was set beside the testimony, then tested against the order of events until the weak part of one account showed through.

The immediate pressure concerned Establish initial investigation suspects. Hugo Vane kept the discussion in the present moment, returning each witness to the same anchors until evasion became more noticeable than speech. A small correction, a glance toward the wrong object, or a delayed denial gave the chapter its turn.

Hugo Vane did not accuse Beatrice Quill outright, but pressure tightened when Witnesses recount beatrice entering room specific exposed a fresh fear and a small lie. The hesitation sharpened suspicion because it tied motive to something that could be checked, while still leaving the final answer unresolved.

No confession followed, and no one declared the case closed. What changed was the pressure map: a secret moved closer to the surface, loyalties looked thinner, and the next scene inherited a narrower and more dangerous question.

Hugo Vane let the silence do part of the work. When the central discrepancy was repeated, it was done plainly, without ornament, so everyone had to hear how little of the story still fitted. The answer that followed was useful less for what it admitted than for what it avoided.

A physical check followed the talk. Someone crossed to the relevant object, another witness corrected the angle or the time, and the contradiction became less abstract. It was now something everyone could inspect together, which made denial harder and panic easier to read.

The witness pressure did not become a verdict. It became a narrower corridor. One possibility lost strength because it required two impossible movements; another survived because it matched the object on the table and the time already sworn to by someone else.

By the end, the scene had changed. No confession had been forced, and no arrest had been made, but the balance among suspects had shifted. Hugo Vane left the last question hanging where everyone could feel it, attached to evidence that would have to be answered in the next scene.

Hugo Vane let the silence do part of the work. When the central discrepancy was repeated, it was done plainly, without ornament, so everyone had to hear how little of the story still fitted. The answer that followed was useful less for what it admitted than for what it avoided. The same contradiction was tested again from a different witness angle, so repetition became verification rather than recycled phrasing.

A physical check followed the talk. Someone crossed to the relevant object, another witness corrected the angle or the time, and the contradiction became less abstract. It was now something everyone could inspect together, which made denial harder and panic easier to read. The same contradiction was tested again from a different witness angle, so repetition became verification rather than recycled phrasing.

The witness pressure did not become a verdict. It became a narrower corridor. One possibility lost strength because it required two impossible movements; another survived because it matched the object on the table and the time already sworn to by someone else. The same contradiction was tested again from a different witness angle, so repetition became verification rather than recycled phrasing.

By the end, the scene had changed. No confession had been forced, and no arrest had been made, but the balance among suspects had shifted. Hugo Vane left the last question hanging where everyone could feel it, attached to evidence that would have to be answered in the next scene. The same contradiction was tested again from a different witness angle, so repetition became verification rather than recycled phrasing.
--- END PRIOR CHAPTER 2 ---

[SCENE COMPLETENESS CONTRACTS — MANDATORY. Each contract below lists what you MUST enact in that chapter. Do not summarise or mention these labels in the prose — enact them organically.]
Chapter 3 (Act 1) completeness contract:
  PIVOT ELEMENT (MANDATORY — write this into the prose, shown not told): "Witness testimony about Beatrice entering Eleanor's room."
  FACT ESTABLISHED (MANDATORY — reader must know this by chapter end): "Establishes that Beatrice had opportunity and access to the victim prior to her death."

# Case Overview
Title: The Delayed Tides of Deceit
Era: 1940s
Setting: Seaside Hotel
Crime: murder (delayed-action poisoning)
Culprit: Beatrice Quill
Victim: Eleanor Voss
False assumption: Eleanor Voss died from a heart attack due to her known health issues.
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
    "sceneNumber": 3,
    "act": 1,
    "title": "Suspect Dynamics",
    "setting": {
      "location": "Eleanor Voss's hotel room",
      "timeOfDay": "Late morning after the murder",
      "atmosphere": "Tense and accusatory as suspicions mount"
    },
    "characters": [
      "Hugo Vane",
      "Dr. Mallory Finch",
      "Captain Ivor Hale",
      "Beatrice Quill",
      "Sylvia Trent"
    ],
    "purpose": "Deepen suspect dynamics and reveal behavioral clues",
    "cluesRevealed": [
      "clue_culprit_direct_beatrice_quill",
      "clue_early_1"
    ],
    "dramaticElements": {
      "conflict": "Accusations fly as tensions rise among the guests.",
      "tension": "The atmosphere is thick with mistrust.",
      "microMomentBeats": [
        "Beatrice clenches her fists, trying to maintain composure."
      ]
    },
    "summary": "As Hugo probes deeper, he observes Beatrice entering Eleanor's room shortly before her death. The guests begin to accuse one another, and hidden motives surface, creating a web of suspicion.",
    "beat": "first_enquiries",
    "estimatedWordCount": 1800,
    "pivotElement": "Witness testimony about Beatrice entering Eleanor's room.",
    "factEstablished": "Establishes that Beatrice had opportunity and access to the victim prior to her death.",
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
    "emotionalRegister": "Initial investigations reveal a web of motives, heightening the sense of mistrust among the characters.",
    "dominantCharacterNote": {
      "name": "Dr. Mallory Finch",
      "voiceRegister": "Dr. Finch speaks with a clinical precision, often laced with a dry wit that can alienate."
    },
    "humourGuidance": {
      "permission": "forbidden"
    },
    "eraTextureNote": "Rationing limits access to basic goods and services.; Travel restrictions persist due to ongoing fuel shortages.; Limited communication with the outside world hampers news updates.",
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
□ Allowed seasonal words only: spring, vernal, springtime.
□ Forbidden seasonal words: summer, autumn, winter.
□ Chapter 3: the clue [clue_9] (beatrice, quill, seen, cleaning, eleanor, room, before, death) is placed in the first 25% of the chapter, dramatized in your own words, followed by an explicit inference or suspicion paragraph.
□ Chapter 3: the clue [clue_culprit_direct_beatrice_quill] (direct, ties, beatrice, quill, mechanism, access, point, before, discriminating, excludes, competing, suspect) is placed in the first 25% of the chapter, dramatized in your own words, followed by an explicit inference or suspicion paragraph.
□ Chapter 3: the clue [clue_early_1] (witnesses, report, seeing, beatrice, enter, eleanor, room, shortly, before, death) is placed in the first 25% of the chapter, dramatized in your own words, followed by an explicit inference or suspicion paragraph.
□ Chapter 3: the clue [clue_fp_contradiction_step_1] (half, empty, bottle, poison, beatrice, cleaning, cart) is placed in the first 25% of the chapter, dramatized in your own words, followed by an explicit inference or suspicion paragraph.
□ Chapter 3: the clue [clue_fp_contradiction_step_2] (witnesses, report, seeing, beatrice, enter, eleanor, room, shortly, before, death) is placed in the first 25% of the chapter, dramatized in your own words, followed by an explicit inference or suspicion paragraph.
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
