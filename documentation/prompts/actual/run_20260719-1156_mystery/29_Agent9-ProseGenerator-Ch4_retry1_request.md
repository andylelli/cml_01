# Actual Prompt Record

- Run ID: `mystery-1784462209178`
- Project ID: ``
- Timestamp: `2026-07-19T12:03:52.093Z`
- Agent: `Agent9-ProseGenerator-Ch4`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4.1`
- Temperature: `0.64`
- Max Tokens: `4500`
- Attempt: `retry 1`
- Prompt Hash: `9945c264e6ce8cd0`

## Message 1 (role=system)

```text
NARRATIVE VOICE: Eleanor Voss[SHE] is the viewpoint character. Unanchored “she/her” or “he/him” without a nearby name refers to Eleanor Voss. Default narrator pronoun: SHE. Never default to “he/his” as the neutral narrator voice unless the POV character is male.

You are an expert prose writer for classic mystery fiction. Your role is to write compelling, atmospheric narrative chapters that read like a professionally published novel.

⛔ ABSOLUTE RULE — CHARACTER NAMES:
The ONLY characters who exist in this story are: Eleanor Voss (woman), Dr. Mallory Finch (man), Captain Ivor Hale (man), Beatrice Quill (woman), Sylvia Trent (woman), Hugo Vane (man) — DECEASED, past-tense only.
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
- MORAL COMPLEXITY REQUIREMENT: The mechanism of this crime carries a moral gray area: "The killer believed they were avenging a wrong done to their family, making their motives more sympathetic." — the culprit reveal and denouement MUST acknowledge this ambiguity. Do not let the ending feel clean or simple. Give the reader at least one moment of uncomfortable sympathy or moral doubt.

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
   - Eleanor Voss: Amateur Sleuth / Civilian Investigator
   - Dr. Mallory Finch: Authority Figure
   - Captain Ivor Hale: Stoic Protector
   - Beatrice Quill: Creative Free Spirit
   - Sylvia Trent: Manipulative Matriarch
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

## Era: 1949-01
In January 1949, life is a delicate balance between the remnants of war and the hope of recovery. The coastal town feels both nostalgic and tense, with the weight of recent history hanging in the air. People are emerging from the strictures of wartime rationing and societal expectations, yet the specter of the Cold War looms large. The hotel serves as a microcosm of this shifting landscape, where social interactions are tinged with both warmth and suspicion. Guests gather, seeking solace from the harsh realities outside, but whispers of past grievances and unspoken tensions ripple beneath the surface. The atmosphere is thick with anticipation and unease, as each moment carries the potential for both connection and conflict.
Emotional register: A collective anxiety grips society, as individuals navigate the complexities of rebuilding lives amidst uncertainty.
Physical constraints: Short daylight hours limit social activities. | Frequent rain showers hinder outdoor gatherings. | Travel and communication still affected by post-war infrastructure.
Current tensions (weave into background texture): The establishment of NATO and its implications for global politics. | Lingering economic challenges as rationing continues. | Debates over labor rights and the ongoing civil rights movement.
Wartime context — Many veterans are returning to civilian life, struggling to reintegrate.: Women have begun to assert themselves in the workforce, yet traditional roles still linger. Absence effect: Families grapple with the emotional void left by absent loved ones, complicating their social interactions.

## Story Theme
In the shadow of post-war anxieties, a quest for truth reveals how hidden motives can lead to deadly consequences, and reveals that evidence carries ethical weight, forcing characters to choose accountability over social performance when appearances and facts collide.

## Story Emotional Register
Dominant: A mix of tension and curiosity permeates the narrative, as characters grapple with their secrets.

Arc:
The story begins at the Azure Bay Hotel, where the murder of Hugo Vane casts a shadow over the picturesque seaside setting. The initial atmosphere is one of charm laced with foreboding, as guests gather amidst whispers of unease. As Detective Eleanor Voss arrives to investigate, the weight of the crime becomes palpable, revealing the hidden tensions among the guests. The investigation uncovers initial clues and red herrings, with each character’s motives intertwined in a web of deceit. As Eleanor delves deeper, the emotional toll of her past failures resurfaces, complicating her pursuit of truth. A pivotal moment occurs when the temperature of the poisoned drink is revealed, shifting the investigation's focus and revealing new suspects. Midway through, the revelation that Beatrice Quill had greater access to the victim recontextualizes their interactions, hinting at her deeper motivations. The pressure mounts as Eleanor confronts the suspects, leading to a climactic showdown where the true nature of their relationships is laid bare. In the resolution, the emotional cost of uncovering the truth weighs heavily on all involved, as Eleanor grapples with her own redemption while the remaining characters face the repercussions of their actions.

The story opens: A charming yet uneasy atmosphere sets the stage for the unfolding drama. As the investigation takes shape: Initial investigations reveal a tangled web of motives and secrets. A first key turn arrives: The activation temperature of the poison shifts the focus of the investigation. At the mid-point of the story: A revelation about Beatrice's access reshapes the understanding of events.

A second pivot reshapes the course: Tensions escalate as Eleanor confronts the characters about their potential lies. As tension reaches its height: The pressure mounts, revealing the emotional cost of uncovering the truth. The climax brings the central question to a head: A confrontation brings.

## Emotional register at this point in the story
The activation temperature of the poison shifts the focus of the investigation.

## Character Portraits (appearance & era)

### Eleanor Voss
Eleanor Voss embodies the post-war quest for redemption, seeking to reclaim her professional reputation while navigating the complexities of a changing society. As a journalist, her role is increasingly vital, reflecting the growing importance of truth in a world where lies can lead to devastating consequences. Her personal struggles with guilt and ambition resonate with a society yearning for authenticity amidst the rubble of war.
Era intersection: As a recently divorced woman in 1949, Eleanor's pursuit of truth mirrors the societal shift towards female empowerment in the workforce.

### Dr. Mallory Finch
Dr. Mallory Finch represents the tension between professional duty and personal ethics, a reflection of a society grappling with the moral dilemmas born from wartime experiences. His struggle to maintain his reputation amid a backdrop of increasing scrutiny mirrors the challenges faced by many in the medical field as they navigate the complexities of post-war recovery.
Era intersection: In 1949, Dr. Finch's motivations are intertwined with the heightened expectations on professionals to uphold integrity in a society still reeling from the repercussions of war.

### Captain Ivor Hale
Captain Ivor Hale is a relic of a bygone era, representing the burden of wartime decisions that continue to haunt veterans. His internal conflicts reflect the emotional scars left by war, resonating with a society that is gradually coming to terms with its past. Ivor's struggle for honor amidst societal changes mirrors the broader narrative of men seeking purpose in a world that no longer defines them by their service.
Era intersection: In 1949, Ivor grapples with the expectations of masculinity in a society that is slowly redefining gender roles post-war.

### Beatrice Quill
As an aspiring artist, Beatrice Quill embodies the aspirations and insecurities of a generation seeking to break free from the confines of traditional roles. Her struggle with jealousy and inadequacy reflects the societal pressures women face as they navigate their identities in a world emerging from the shadows of war. Beatrice's journey symbolizes the fight for creative expression and personal fulfillment in a time of uncertainty.
Era intersection: In 1949, Beatrice's artistic ambitions clash with societal expectations, highlighting the emerging dialogue around women's independence and self-worth.

### Sylvia Trent
Sylvia Trent navigates the treacherous waters of social standing in a post-war world, embodying the complexities of class and gender dynamics. Her manipulative tendencies reflect the lengths to which individuals will go to protect their status, mirroring broader societal anxieties about security and reputation. Sylvia's character showcases the darker side of ambition in a society still healing from the wounds of conflict.
Era intersection: In 1949, Sylvia's struggle for power amidst a backdrop of shifting social norms highlights the ongoing battle for women's influence in a male-dominated landscape.

## Character Voices

### Eleanor Voss (she/her/her)
Eleanor's voice carries a confident cadence, often laced with dry wit that reflects her journalistic background.
[comfortable] You know, the truth is like a good wine; it takes time to breathe before it reveals its full flavor.
[evasive] I wouldn't want to speculate; let's just say things aren't always as they seem.
[stressed] This is a mess. The more I dig, the more tangled this web becomes.
Humour: Eleanor's dry wit offers a refreshing perspective amidst the tension.

### Dr. Mallory Finch (he/him/his)
Dr. Finch's tone is measured and authoritative, often lacking warmth but conveying a sense of urgency.
[comfortable] In my professional opinion, this situation requires immediate attention.
[evasive] I believe it's best to focus on what we can control at this moment.
[stressed] I can't afford any more mistakes; my career hangs in the balance.

### Captain Ivor Hale (he/him/his)
Captain Hale speaks with a gravelly voice, blending bravado with vulnerability, reflecting his military past.
[comfortable] You can't unring the bell, can you? Life has a way of reminding us of our mistakes.
[evasive] I’d rather not dwell on the past; it’s best left buried.
[stressed] Every time I close my eyes, I see their faces. I can’t escape it.
Humour: His self-deprecating humor reveals a man wrestling with his past.

### Beatrice Quill (she/her/her)
Beatrice’s voice is lyrical and expressive, often infused with self-deprecating humor to mask her insecurities.
[comfortable] Art is subjective, but murder is not; let’s get to the heart of this.
[evasive] I wouldn’t dream of suggesting who might be involved; it’s all too complicated.
[stressed] What if this all unravels? My entire career could be at stake!
Humour: Beatrice's sardonic wit reflects her artistic sensibilities and inner struggles.

### Sylvia Trent (she/her/her)
Sylvia speaks with sophistication, her tone smooth yet layered with subtle condescension.
[comfortable] One must do what one must do; life is all about choices, isn't it?
[evasive] I prefer to let others draw their own conclusions; it's much more entertaining.
[stressed] Everything I've built could come crashing down if this gets out.
Humour: Her polite savagery adds a unique edge to her interactions.

## Location Registers (scene framing guides)

The Grand Dining Room: The Grand Dining Room feels charged with tension and anticipation, where the elegance of fine dining contrasts starkly with the dark events that have unfolded. Each flicker of candlelight casts long shadows, hinting at the secrets that linger among the lavish decor.. Camera angle: Entering the Grand Dining Room, one senses the oppressive air of dread, as if the very walls are holding their breath, awaiting the truth to be unearthed.. Era: As a space that once fostered camaraderie, the dining room now feels claustrophobic, haunted by the weight of betrayal and deceit.

The Hotel Lobby: The Hotel Lobby serves as a vibrant hub yet feels laden with unspoken fears and hidden agendas. The soft piano music and the scent of coffee create an inviting atmosphere, but the flickering shadows suggest a darker undercurrent of suspicion and tension among guests.. Camera angle: As one enters the lobby, the camera captures the bustling activity, yet zooms in on the anxious glances exchanged between guests, hinting at the secrets they each carry.. Era: The lobby reflects the post-war societal dynamics, where old norms clash with emerging identities.

Staff Quarters: The Staff Quarters feel like a hidden world, alive with whispered conversations and the hum of daily activities. Despite the mundane surroundings, an air of secrecy lingers, as staff navigate their roles beneath the surface of guest interactions.. Camera angle: Entering the staff quarters, the camera captures the cramped yet bustling corridor, revealing the dynamics of camaraderie and tension among the workers.. Era: This space reflects the hierarchical structure of post-war hotel life, where the divide between staff and guests remains stark.

Ocean View Room: The Ocean View Room is a sanctuary of solitude, where the sound of crashing waves creates a calming backdrop to internal reflection. Yet, the isolation also breeds anxiety, as the vast ocean serves as a reminder of the unknown lurking beyond the horizon.. Camera angle: The camera pans across the sweeping ocean views, then zooms in on the quiet unease etched on the occupant's face as they confront their inner turmoil.. Era: In a post-war world, this room symbolizes both comfort and the fragility of human connection, as guests grapple with their pasts.

## Humour guidance for this story position (first_turn)
Permission: forbidden
Rationale: The stakes are too high for humor in this critical moment.

## Reveal Groundwork (texture — do not explain, only plant)
- Plant one subtle observable beat related to: "The initial discovery of the poison in the drink the suspicions surrounding Dr". Do not explain significance yet.
- Plant one subtle observable beat related to: "Finch, who seems to be the most likely suspect". Do not explain significance yet.
- Plant one subtle observable beat related to: "Plant one subtle anomaly that can be re-read after the resolution.". Do not explain significance yet.

FAIR-PLAY AND INFERENCE CONTRACT:
- FAIR PLAY CLUE TIMING: Never combine clue discovery and detective deduction in the same chapter. If a clue is first revealed to the reader in chapter N, the detective may only analyze, deduce from, or act on that clue in chapter N+1 or later.
- FAIR PLAY INFORMATION PARITY: The reader must see all clues BEFORE the detective uses them in reasoning. If the detective performs a test or makes a deduction, every piece of evidence supporting that conclusion must have been shown to the reader in earlier chapters.
- FAIR PLAY REVELATION SPACING: In the discriminating test scene, the detective can ONLY use clues that were revealed to the reader at least 1 full chapter earlier. Never introduce new clues or withheld information during the test.
- FAIR PLAY CONFRONTATION: During the final confrontation/revelation, the detective cannot surprise the reader with facts. Every piece of evidence cited must have been visible to the reader in prior chapters.
- Never solve by withheld information. Keep reader-information parity with detective reasoning.
- False assumption in force: Hugo was poisoned at a time when everyone was accounted for.
- Hidden truth to progressively expose (compose in your own words from these elements): timing, poison, activation, occurred, drink, left, unattended
- Inference path checkpoints to dramatize clearly — compose ENTIRELY in your own sentences from these key terms (reproducing any briefing phrase verbatim FAILS validation):
  - Step 1: obs: thermometer, reads, eighty, degrees, fahrenheit, checked | corr: poison, activate, temperature | effect: narrows, timeline, poison, effective
  - Step 2: obs: glass, residue, sticky, substance, near, sunlit, area | corr: residue, indicates, poison, likely, beverage | effect: eliminates, idea, drink, harmless
  - Step 3: obs: witnesses, remember, seeing, hugo, drinking, alone, cleared | corr: suggests, indeed, poisoned, drink, left, alone | effect: narrows, suspect, opportunities, around, time, frame
- Discriminating test method: trap
- Discriminating test elements to dramatize (compose ENTIRELY in your own sentences from these — do NOT reproduce any briefing phrase verbatim): reenacting, drink, serving, process, checking, residue, various, glasses, compare, hugo
- Test must rely on already-shown clue IDs: clue_1, clue_3, clue_4, clue_early_1
- Fair-play rationale: Step 1: The thermometer reading and witness reports narrow the timeline of poison activation. Step 2: The sticky residue proves the drink was compromised, eliminating the idea that it was safe. Step 3: Witness recollections about Hugo drinking alone isolate the moment of poisoning.

## Character Reference

### Eleanor Voss (she/her — NEVER he/him)
Eleanor speaks with a confident cadence, often punctuating her observations with sardonic quips, revealing her investigative nature
She has a tendency to ask leading questions while maintaining an air of casual curiosity.
Haunted by the repercussions of her past article, Eleanor grapples with the fear that her pursuit of truth might lead her to hurt others again.
Voice colour: Eleanor Voss uses dry wit humour — let it surface in their dialogue where natural, not in every line.

### Dr. Mallory Finch (he/him — NEVER she/her)
Finch speaks in a measured, precise manner, often using medical jargon, which he occasionally softens with a touch of impatience when discussing his work
His tone is authoritative but lacks warmth, reflecting the weight of his secrets.
Dr. Finch is torn between his ambition to maintain his practice's reputation and the guilt of his unethical actions that could ruin lives.

### Captain Ivor Hale (he/him — NEVER she/her)
Captain Hale speaks with a gravelly voice, often filled with a mix of bravado and vulnerability
He tends to use military jargon, but his self-deprecating humor reveals a man wrestling with his past
His sentences are often punctuated with a wistful tone when he recalls the past.
Captain Hale is tormented by his past decisions and survivor's guilt, struggling with the notion of honor versus the reality of his actions.
Voice colour: Captain Ivor Hale uses self deprecating humour — let it surface in their dialogue where natural, not in every line.

### Beatrice Quill (she/her — NEVER he/him)
Beatrice often speaks in a lyrical, expressive manner, occasionally slipping into self-deprecating humor to mask her insecurities
Her speech is punctuated by vivid imagery, reflecting her artistic background, and she tends to use metaphor to convey her feelings.
Beatrice wrestles with her self-worth, torn between her passion for art and the fear that she will never be good enough.
Voice colour: Beatrice Quill uses sardonic humour — let it surface in their dialogue where natural, not in every line.

### Sylvia Trent (she/her — NEVER he/him)
Sylvia speaks with an air of sophistication, often using veiled language and double entendres
Her tone is smooth and persuasive, with a hint of condescension, as she expertly navigates social dynamics, always aware of her audience.
Sylvia is torn between her desire for power and the fear that her secrets will unravel, exposing her vulnerabilities.
Voice colour: Sylvia Trent uses polite savagery humour — let it surface in their dialogue where natural, not in every line.


## CHARACTER CONTRACTS (binding for this scene)
Each entry below constrains how this character must be written in this chapter.
These override generic style guidance when they conflict.

### Eleanor Voss[SHE]
Voice & mannerisms: Eleanor speaks with a confident cadence, often punctuating her observations with sardonic quips, revealing her investigative nature. She has a tendency to ask leading questions while maintaining an air of casual curiosity.
SIGNATURE TIC (use sparingly — this is Eleanor Voss's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "‘Curiosity killed the cat, but satisfaction brought it back.’"
Sample voice fragments (match this register and rhythm):
  [comfortable] "You know, the truth is like a good wine; it takes time to breathe before it reveals its full flavor."
  [evasive] "I wouldn't want to speculate; let's just say things aren't always as they seem."
Humour: dry wit — deploy occasionally (level 0.5)
FORBIDDEN phrase (never write for Eleanor Voss): "a surge of determination washed over her"
Act 2 behaviour contract: May show unease, evasion, or mild defensiveness when questioned. One behavioural tell is permitted. Internal conflict emerging: "Haunted by the repercussions of her past article, Eleanor grapples with the fear that her pursuit of truth might lead her to hurt others again."

### Dr. Mallory Finch[HE]
Voice & mannerisms: Dr. Finch speaks in a measured, precise manner, often using medical jargon, which he occasionally softens with a touch of impatience when discussing his work. His tone is authoritative but lacks warmth, reflecting the weight of his secrets.
SIGNATURE TIC (use sparingly — this is Dr. Mallory Finch's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "‘In my professional opinion…’"
Sample voice fragments (match this register and rhythm):
  [comfortable] "In my professional opinion, this situation requires immediate attention."
  [evasive] "I believe it's best to focus on what we can control at this moment."
Humour: none — this character plays it straight in all scenes
FORBIDDEN phrase (never write for Dr. Mallory Finch): "sighed deeply and felt a sense of peace"
Act 2 behaviour contract: May show unease, evasion, or mild defensiveness when questioned. One behavioural tell is permitted. Internal conflict emerging: "Dr. Finch is torn between his ambition to maintain his practice's reputation and the guilt of his unethical actions that could ruin lives."

### Captain Ivor Hale[HE]
Voice & mannerisms: Captain Hale speaks with a gravelly voice, often filled with a mix of bravado and vulnerability. He tends to use military jargon, but his self-deprecating humor reveals a man wrestling with his past. His sentences are often punctuated with a wistful tone when he recalls the past.
SIGNATURE TIC (use sparingly — this is Captain Ivor Hale's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "‘You can’t unring the bell, can you?’"
Sample voice fragments (match this register and rhythm):
  [comfortable] "You can't unring the bell, can you? Life has a way of reminding us of our mistakes."
  [evasive] "I’d rather not dwell on the past; it’s best left buried."
Humour: self deprecating — deploy occasionally (level 0.4)
FORBIDDEN phrase (never write for Captain Ivor Hale): "she knew with certainty she was right"
Act 2 behaviour contract: May show unease, evasion, or mild defensiveness when questioned. One behavioural tell is permitted. Internal conflict emerging: "Captain Hale is tormented by his past decisions and survivor's guilt, struggling with the notion of honor versus the reality of his actions."

### Beatrice Quill[SHE]
Voice & mannerisms: Beatrice often speaks in a lyrical, expressive manner, occasionally slipping into self-deprecating humor to mask her insecurities. Her speech is punctuated by vivid imagery, reflecting her artistic background, and she tends to use metaphor to convey her feelings.
SIGNATURE TIC (use sparingly — this is Beatrice Quill's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "‘Art is subjective, but murder is not.’"
Sample voice fragments (match this register and rhythm):
  [comfortable] "Art is subjective, but murder is not; let’s get to the heart of this."
  [evasive] "I wouldn’t dream of suggesting who might be involved; it’s all too complicated."
Humour: sardonic — deploy occasionally (level 0.5)
FORBIDDEN phrase (never write for Beatrice Quill): "palpable tension filled the room"
Act 2 behaviour contract: May show unease, evasion, or mild defensiveness when questioned. One behavioural tell is permitted. Internal conflict emerging: "Beatrice wrestles with her self-worth, torn between her passion for art and the fear that she will never be good enough."

### Sylvia Trent[SHE]
Voice & mannerisms: Sylvia speaks with an air of sophistication, often using veiled language and double entendres. Her tone is smooth and persuasive, with a hint of condescension, as she expertly navigates social dynamics, always aware of her audience.
SIGNATURE TIC (use sparingly — this is Sylvia Trent's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "‘One must do what one must do.’"
Sample voice fragments (match this register and rhythm):
  [comfortable] "One must do what one must do; life is all about choices, isn't it?"
  [evasive] "I prefer to let others draw their own conclusions; it's much more entertaining."
Humour: polite savagery — deploy occasionally (level 0.6)
FORBIDDEN phrase (never write for Sylvia Trent): "she felt a wave of unease"
Act 2 behaviour contract: May show unease, evasion, or mild defensiveness when questioned. One behavioural tell is permitted. Internal conflict emerging: "Sylvia is torn between her desire for power and the fear that her secrets will unravel, exposing her vulnerabilities."



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

This story takes place in January 1949 during winter.

Seasonal Atmosphere:
- Weather patterns: Overcast skies with heavy cloud cover, Frequent rain showers typical of the coastal climate, Strong sea breezes carrying the scent of salt and damp earth
- Daylight: Short daylight hours, with the sun rising around eight and setting by four-thirty in the afternoon, leaving long evening shadows.
- Seasonal activities: Indoor social events in the hotel, such as card games and dances, Frequent gatherings in the lounge to listen to live radio broadcasts, Coastal walks along the beach, wrapped in heavy coats against the chill
- Seasonal occasions: New Year's Day (January 1)
- Season: winter

Period Fashion (describe naturally):
- Men formal: Dark wool suits with narrow lapels, White dress shirts with stiff collars, Silk ties in muted colors
- Men casual: Tweed jackets with elbow patches, Wool sweaters in earth tones, Chinos for informal outings
- Men accessories: Fedoras or flat caps, Leather gloves, Wool scarves
- Women formal: Tea-length dresses with fitted waists and flared skirts, Blouses made of lightweight wool or silk, Long coats with fur collars
- Women casual: Knit sweaters with a modest neckline, Pleated skirts in dark colors, Tailored trousers for outings
- Women accessories: Cloche hats adorned with ribbons or flowers, Pearl necklaces, Gloves in soft leather or fabric

Cultural Context (reference naturally):
- Music/entertainment: 'Now Is the Hour' by Bing Crosby, 'Aba Daba Honeymoon' by Debbie Reynolds and Carleton Carpenter, Jazz music remains popular, with artists like Duke Ellington; Films: 'The Third Man' directed by Carol Reed, 'Adam's Rib' starring Spencer Tracy and Katharine Hepburn; Theatre: Broadway shows like 'South Pacific' garnering attention, Revivals of classic plays in local theaters; Radio: 'The Jack Benny Program' remains a favorite, 'Suspense' for thrilling mystery stories
- Typical prices: Bread loaf: four pence, Coal scuttle refill: one shilling sixpence, Taxi across town: two shillings
- Current events: The establishment of the North Atlantic Treaty Organization (NATO); Increasing tensions between the United States and the Soviet Union
- Literature: '1984' by George Orwell | 'The Catcher in the Rye' by J.D. Salinger | 'The Naked and the Dead' by Norman Mailer | [Mystery and detective fiction gaining traction] | [Realist fiction reflecting post-war anxieties] | [Science fiction exploring futuristic themes]
- Technology: The transistor being developed, paving the way for future electronics | Early computers like ENIAC beginning to emerge | Advancements in jet engine technology | Radios found in most homes, with some families owning early television sets | Telephones still predominantly landlines | Basic home appliances like toasters and washing machines becoming more common
- Daily life: Evenings spent at home listening to the radio, Weekly visits to the local cinema for new releases, Socializing at community events or clubs
- Social rituals: Sunday dinners with extended family, Weekly card nights among friends, Holiday gatherings focusing on food and storytelling

Atmospheric Details:
The air carries a chill, with the sound of waves crashing against the shore, accompanied by the distant echoes of laughter from hotel guests. The scent of damp wood and wet earth fills the ho
[truncated for prompt budget]

NON-NEGOTIABLE CHAPTER OBLIGATIONS — LOCKED EVIDENCE VALUES (VERBATIM REQUIRED):
The following measured values (times, amounts, measurements) are absolute ground truth. Every time this chapter describes, mentions, or alludes to one — no matter how briefly — it MUST use the exact phrase shown below, character for character. NO paraphrase, approximation, rounding, or synonym is permitted.

FAILURE EXAMPLE: if the locked value is "at thirteen minutes to midnight" and you write "just before midnight" or "around midnight" — that is a HARD FAIL. You must write "at thirteen minutes to midnight". Equally, if the locked value is written in words, such as "ten minutes past eleven", and you convert it to figure-based clock notation — that is also a HARD FAIL. Words stay as words; figure forms are forbidden for word-phrased facts.

CRITICAL — WORD-PHRASED VALUES: If the canonical value is written out in words (e.g. a time like "ten minutes past eleven", or an amount like "forty minutes"), reproduce those exact words. DO NOT convert to figure-based time notation, twenty-four-hour format, or any other numeric shorthand. Correct: "ten minutes past eleven". WRONG: figure-based clock notation or numeric shorthand.

Locked values:
  - The temperature required for the poison to become lethal: "eighty degrees"
  - The time the drink was left in the sun: "half past three in the afternoon"
  - The amount of poison administered in the drink: "two ounces"

If a value has no relevance to this chapter, omit it. But the moment you reference the underlying evidence, only the exact phrase above is acceptable.

⛔ CLUES TO SURFACE IN THESE CHAPTERS — mandatory:
The following evidence MUST be clearly observable to an attentive reader. Do not bury it in atmosphere or passing dialogue. Each clue must be concrete, specific, and noticeable:

• [clue_5] beatrice, quill, known, background, toxicology
  Category: behavioral | Criticality: essential | Supports inference step 2
  Points to: beatrice, culprit

• [clue_6] beatrice, quill, motive, related, inheritance
  Category: behavioral | Criticality: essential | Supports inference step 2
  Points to: beatrice, motive, strengthens, case

• [clue_early_1] residue, indicates, poison, likely, beverage
  Category: testimonial | Criticality: essential | Supports inference step 2
  Points to: drink, source, poison

For each clue above: an attentive reader should be able to find, record, and later use it to reason toward the solution.

═══ NARRATIVE STATE (read-only — do not contradict) ═══

LOCKED FACTS — use verbatim whenever this evidence is described:
  • The temperature required for the poison to become lethal: "eighty degrees"
  • The time the drink was left in the sun: "half past three in the afternoon"
  • The amount of poison administered in the drink: "two ounces"

CHARACTER PRONOUNS — never deviate from these:
  • Eleanor Voss: she/her/her
  • Dr. Mallory Finch: he/him/his
  • Captain Ivor Hale: he/him/his
  • Beatrice Quill: she/her/her
  • Sylvia Trent: she/her/her
  • Hugo Vane: he/him/his

CLUES ALREADY REVEALED TO READER: clue_mechanism_visibility_core, clue_core_contradiction_chain, clue_id_1, clue_1, clue_4, clue_9, clue_culprit_direct_beatrice_quill — do not reveal these as new information.

INVESTIGATION LOG — WHAT IS ESTABLISHED (do not re-establish, do not repeat):
• Evidence already established (reference only — do NOT restate or quote these; advance beyond them): poison, become, lethal | victim, drink, untouched, until, dinner | timing, drink, exposure, crucial | poison, likely, beverage | timing, drink, exposure, crucial | victim, likely, poisoned | direct, shows, beatrice, quill, means, opportunity
• Suspect cleared: Dr. Mallory Finch[HE] — His medical alibi during the time of serving drinks clears him.
• Suspect cleared: Captain Ivor Hale[HE] — His location was verified at the time of the incident by multiple witnesses.
• Suspect cleared: Sylvia Trent[SHE] — Her alibi is confirmed by her interactions with other guests.
⚠ The story must move FORWARD from this log. Any beat already listed above is forbidden from repeating.

⚠ THIS CHAPTER'S REQUIRED ADVANCE (first_turn): Examine physical evidence — find at least one new clue

CONTINUITY HANDOFF — previous chapter closing beat:
  • "Eleanor allowed herself a moment of dry relief, leaning against the bar and muttering, “Curiosity killed the cat, but satisfaction brought it back. ” The guests exchanged uneasy glances, their laughter brittle against the morning’s chill. She watched them clos..."
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
Known location profile anchors: The Azure Bay Hotel, The Grand Dining Room, The Hotel Lobby, Staff Quarters, Ocean View Room, the hotel dining room
LOCATION NAME CAPITALISATION (HARD REQUIREMENT — validated):
All named locations in your prose MUST use the EXACT capitalisation from the CML profiles.
Canonical forms: "The Azure Bay Hotel", "The Grand Dining Room", "The Hotel Lobby", "Staff Quarters", "Ocean View Room", "the hotel dining room"
Writing a location in lowercase (e.g. "drawing room" instead of "Drawing Room") is a validated error. Every time you mention a named location, copy its capitalisation from the list above.
- Chapter 4: OPENING STYLE (HARD): Start the VERY FIRST SENTENCE with a noun-phrase atmosphere — e.g. "The smell of damp stone in the cellar…" / "A chill from the landing…" / "The sound of the clock in the hall…". Pattern: "The/A [noun] of/in/from [place]…". Anchor opening in "the hotel dining room". The opening style above governs only your FIRST SENTENCE; the grounding below may land anywhere in the first 2 paragraphs (it need not be sentence one, and never conflicts with the chosen opening style). HARD REQUIREMENT for the first 2 paragraphs: (a) include 2+ sensory words — choose from smell/scent/odor/fragrance/sound/echo/silence/whisper/creak/cold/warm/damp/rough/smooth/glow/shadow/flicker/dim — and (b) include 1+ atmosphere/time word — choose from rain/wind/fog/storm/mist/thunder/evening/morning/night/dawn/dusk/lighting/weather/season/afternoon/midday/noon/midnight/twilight/sunrise/sunset/daylight/sunlight/overcast/cloudy/bright/dark/grey/pale/chill/crisp/drizzle/haze/lamplight/firelight. These are validated requirements, not style suggestions; missing them triggers a retry.

[⚠ INTERNAL QUALITY DIAGNOSTICS — DO NOT REPRODUCE ANY PART OF THIS SECTION IN YOUR STORY OUTPUT. These are private generator observations for your consideration only. Your narrative must read as if this section does not exist. Never include phrases from this block in character dialogue, narration, or description.]

PRIOR CHAPTER QUALITY OBSERVATIONS:
- Chapter 1 (score 96/100):
  Quality gaps noted: word density below preferred target (944/1000); scene grounding weakness
  Address in upcoming chapters: Increase chapter density with concrete investigation action and sensory-grounded beats; avoid recap-only padding. | Open next chapter with a named location anchor plus at least two sensory cues and one atmosphere marker.
- Chapter 3 (score 93/100):
  Quality gaps noted: word density below preferred target (874/1000); scene grounding weakness
  Address in upcoming chapters: Increase chapter density with concrete investigation action and sensory-grounded beats; avoid recap-only padding. | Open next chapter with a named location anchor plus at least two sensory cues and one atmosphere marker.
- Phrases to avoid (already overused in earlier chapters): "the clues were present but the truth", "clues were present but the truth remained".
[END INTERNAL DIAGNOSTICS]

⛔ ABSOLUTE PRONOUN LOCK — NO EXCEPTIONS

The following pronouns are locked facts, on the same level as character names
and hard-logic device values. Using the wrong pronoun is a continuity error,
not a style choice.

Canonical pronoun table (subject / object / possessive / reflexive):
  • Eleanor Voss: ALWAYS she/her/her/herself — NEVER he/him/his/himself
  • Dr. Mallory Finch: ALWAYS he/him/his/himself — NEVER she/her/herself
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
   WRONG: "Eleanor watched Finch; she crossed the room and he frowned." (ambiguous antecedent)
   RIGHT: "Eleanor watched Finch; Finch crossed the room and Eleanor frowned." (explicit)
9. In dialogue attribution, the pronoun refers to the SPEAKER
[truncated for prompt budget]

PROMPT BUDGET SUMMARY: budget=24000 tokens; fixed=12706; context=11150; dropped=[humour_guide, location_profiles, texture_pool, continuity_context]; truncated=[location_profiles, temporal_context, pronoun_accuracy]

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
4. Integrate at least two concrete era-grounded details per chapter from setting refinement signals: radio broadcasts in every room | early television in public lounges | basic radar systems for maritime navigation | party-line telephone systems | military encryption for sensitive communications | telegram services available at local post office.
5. Respect setting movement/access constraints in scene action and alibis: narrow hallways limiting movement | restricted access to private areas like staff quarters | oceanfront cliffs affecting evacuation routes | staff-only areas marked by clear signage | guest check-in procedures.
6. Sustain social coherence with this backdrop pressure: A group of hotel guests and staff are drawn together by the tension of post-war anxieties and the allure of a seaside retreat, only to find themselves ensnared in a deadly mystery that echoes the uncertainties of their time.
7. Maintain continuity around these socially central cast anchors where relevant: Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill, Sylvia Trent, Hugo Vane.
8. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Critical: Plot similarity 0.85 with 'The Mysterious Affair at Styles' (same delayed-action poisoning method).
9. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Critical: Solution similarity 0.85 with 'The Mysterious Affair at Styles' (similar false assumption about timing of poisoning).
10. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Moderate: Character similarity 0.70 with 'The Second Key' (similar cast structure and character roles).
11. STORY TO DATE ANTI-COPY RULE: The STORY TO DATE section below is provided for chronological and factual reference ONLY. You MUST NOT copy, lightly rephrase, or structurally echo any sentence or paragraph from prior chapters. Every sentence in this chapter must be original prose unique to this scene. Reusing even a clause from prior chapter text will cause this attempt to fail immediately.

CRITICAL PROSE REQUIREMENTS:

The CML specifies exact requirements for certain validation-critical scenes. You MUST include these elements at the specified positions.

**Discriminating Test Scene (Act 3, Scene 4):**
Required elements: Execute the discriminating test, Observe the sticky residue on the glasses, Link the residue back to Beatrice's drink serving

**Suspect Clearance Scenes:**
- Dr. Mallory Finch (Act 3, Scene 5): His medical alibi during the time of serving drinks clears him.
  Clues: clue_id_1, clue_id_2
- Captain Ivor Hale (Act 3, Scene 5): His location was verified at the time of the incident by multiple witnesses.
  Clues: clue_id_1, clue_id_2
- Sylvia Trent (Act 3, Scene 5): Her alibi is confirmed by her interactions with other guests.
  Clues: clue_id_1, clue_id_2

**Culprit Revelation Scene (Act 3, Scene 6):**
Method: Confrontation with evidence linking Beatrice to the poisoned drink.

**Clue Placement for These Chapters:**
- clue_core_elimination_chain must appear in Act 2, Scene 1 via Corroborated elimination

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
Investigation state at start: 7 clue(s) revealed to reader; approximately 0 unresolved suspect(s).
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
- Chapter 4:
  - STRUCTURAL ARCHETYPE — Chapter 4 must be: ALIBI_PROBE
      ✓ MUST contain: one alibi tested with a stated result
      ✗ MUST NOT contain: 
  - Word count: Target 1250 words. Achieve this through plot events, dialogue exchanges, and physical investigation — not through atmospheric repetition or extended internal reflection. Each 200-word segment should contain at minimum one concrete story event (a discovery, a conversation exchange, a physical action or movement). Padding with atmosphere alone is not acceptable.
  - Opening: Begin with a character action, spoken line, or clock/time marker — never a location name or location-description phrase.
  - Scene is set in: the hotel dining room — reference it naturally within the paragraph, never as your opening phrase.
  - Opening atmosphere (MANDATORY — validator enforced): the first paragraph MUST contain at least one of: rain / wind / fog / storm / mist / thunder / evening / morning / night / dawn / dusk / season / afternoon / midday / noon / midnight / twilight / sunrise / sunset / daylight / sunlight / overcast / cloudy / bright / dark / grey / pale / cold / warm / chill / crisp / damp / drizzle / haze / lamplight / firelight. A chapter that omits all of these from its opening paragraph will be rejected.
  - PARAGRAPH OPENER DIVERSITY (MANDATORY — validator enforced): No more than 2 paragraphs in this chapter may begin with "Eleanor" or "Eleanor's" as the first word. You must vary paragraph openings throughout: use sensory observations, another character's name or action, dialogue, object or sound details, or temporal markers. Opening 3 or more paragraphs with "Eleanor" will cause automated rejection.
  - ⛔ MECHANISM SPOILER BAN: Do NOT state how the crime device was manipulated — not the direction, not the magnitude, not who performed it. Characters may only observe that two sources of evidence disagree. The specific method, tamper amount, and perpetrator's action are ALL FORBIDDEN until the reveal. WRONG: "The culprit had altered the device by forty minutes to create a false alibi." RIGHT: "Two independent pieces of evidence gave contradictory readings — a discrepancy neither could yet explain."
  - Continuity bridge: in the first 120 words, visibly connect from the previous chapter's final beat. Carry forward one unresolved element (object, accusation, emotional pressure, or immediate physical action) from: "Eleanor allowed herself a moment of dry relief, leaning against the bar and muttering, “Curiosity killed the cat, but satisfaction brought it back. ” The guests exchanged uneasy glances, their laughter brittle against th...".
  - CLUE OBLIGATIONS — each clue below MUST be dramatized, but in YOUR OWN WORDS:
    Render each as something a character SEES, DOES, or SAYS on the page. The bracketed text is a
    DESCRIPTION of the evidence for you — do NOT transcribe it as narration. Copying a clue's
    description sentence verbatim into the prose FAILS validation.
    • mallory, finch, patient, shows, busy [clue_core_elimination_chain]
      Points to: narrowing, suspicion, towards, suspects
    • beatrice, credentials, reviewed [clue_5]
      ⛔ SPOILER EMBARGO (pre-reveal chapter): surface ONLY the surface anomaly a character can see/hear/find.
         Do NOT name who it implicates, state the tamper direction or magnitude, or explain the mechanism in this chapter.
         Present it as an unexplained discrepancy; the culprit and method are revealed later.
    • documents, regarding, inheritance [clue_6]
      ⛔ SPOILER EMBARGO (pre-reveal chapter): surface ONLY the surface anomaly a character can see/hear/find.
         Do NOT name who it implicates, state the tamper direction or magnitude, or explain the mechanism in this chapter.
         Present it as an unexplained discrepancy; the culprit and method are revealed later.
    • sticky, residue, analyzed [clue_early_1]
      Points to: drink, source, poison
  - Tonal contrast: include at least one beat of relief or ironic counterpoint. Do not sustain maximum tension for every paragraph.
  - CLUE DISCLOSURE RULE (Stage 2/4):
    Characters may establish access and opportunity but must NOT state the crime method or draw the final clue-to-culprit connection. Investigation without conclusion.
    WRONG: dialogue or narration that directly explains how the crime was committed before Stage 4.
    RIGHT: observation, physical reaction, and logical inference that leaves the mechanism just off-screen.
  - SUSPECT-PRESSURE MODE: do NOT resolve the case in this chapter. No confession, arrest, final accusation, definitive culprit declaration, or case-closed language. End with unresolved pressure: a contradiction, narrowed suspicion, motive pressure, or a new question.
  - ALIBI LOCK: Beatrice Quill's established alibi is "Dinner time". Do NOT place Beatrice Quill at any other location or in any other activity during the crime window. Any contradiction is a continuity error that triggers a retry.
  - TESTIMONY CONTINUITY: Beatrice Quill has already made statements in earlier chapters. Any time, location, or claim attributed to Beatrice Quill in THIS chapter must be consistent with those earlier statements. Do NOT introduce a new or different alibi claim — any contradiction is a continuity error.

- Tonal contrast required: the previous chapter was high-tension. This chapter must include at least one beat of relief, pause, or quiet observation.
- Locked fact phrase obligations:
  - If this batch mentions The temperature required for the poison to become lethal, write exactly: "eighty degrees".
  - If this batch mentions The time the drink was left in the sun, write exactly: "half past three in the afternoon".
  - If this batch mentions The amount of poison administered in the drink, write exactly: "two ounces".
- Seasonal vocabulary allow-list: winter, wintry, midwinter.
- Forbidden seasonal words: spring, summer, autumn.

⛔ PRONOUN TABLE — re-check after EVERY paragraph before writing the next:
    Eleanor Voss: she/her/her
    Dr. Mallory Finch: he/him/his
    Captain Ivor Hale: he/him/his
    Beatrice Quill: she/her/her
    Sylvia Trent: she/her/her
    Hugo Vane: he/him/his
  Any sentence containing a pronoun must agree with this table. Correct mismatches before moving on.

## CHAPTER OUTCOME CONTRACT (MANDATORY)
Batch chapters: 4-4.
Investigation state at start: 7 clue(s) revealed to reader; approximately 0 unresolved suspect(s).
Must change by end: Increase or complicate suspicion through a new pressure revelation — WITHOUT resolving the case: do NOT name, accuse, or extract a confession from the culprit, make an arrest, or declare the case closed (that is reserved for the final reveal).
Suspect pressure target(s): Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill, Sylvia Trent
Required new information: At least one fear/motive/lie/loyalty reveal with investigative consequence.
Forbidden reveals at this stage: No culprit resolution: no confession, no arrest, no 'case closed', no accusation ('I accuse'/'I name'), and never state 'the culprit/murderer/killer is/was …'. The accusation is reserved for the final reveal — build suspicion only.

FROZEN FACT STATE (DO NOT ALTER):
- Timeline anchor: January (winter).
- Month, season, weather, and time-of-year language in this batch must stay compatible with winter.
- Established timeline fact: The hotel clock stopped at a specific time.
- Established timeline fact: Witnesses confirm the dinner began at seven.
- If referenced, use exact phrase: "eighty degrees" (The temperature required for the poison to become lethal).
- If referenced, use exact phrase: "half past three in the afternoon" (The time the drink was left in the sun).
- If referenced, use exact phrase: "two ounces" (The amount of poison administered in the drink).

STORY TO DATE (REFERENCE ONLY — DO NOT COPY VERBATIM):
- Full prior chapter text is provided below for continuity, factual consistency, and reference accuracy.
- Use this to keep character voice, chronology, clue state, and location continuity aligned with earlier chapters.
- Do not quote, copy, or paraphrase these paragraphs too closely; write fresh prose that remains consistent with them.

--- BEGIN PRIOR CHAPTER 1 ---
Title: Chapter 1: The Spilled Truth
Eleanor Voss pressed her gloved hand against the polished walnut bar, the cold seeping through wool as she steadied herself. The morning was grey and damp, rain pattering against the tall windows of the bar area of the hotel, blurring the view of Brighton’s wintry coastline. The scent of stale tobacco mingled with the sharper tang of spilled spirits, and beneath the low murmur of anxious voices, silence seemed to pulse. On the floor, Hugo Vane lay sprawled, his body angled awkwardly beside a pool of liquid, the glass overturned and its contents darkening the carpet. The chill in the air felt sharper here, as if the room itself recoiled from the scene. Eleanor’s gaze lingered on Hugo, noting the absence of struggle in his expression, but the spilled drink told another story—one of abrupt interruption, not gentle sleep.

A thermometer, half-hidden behind the bar, caught Eleanor’s eye. She knelt, careful not to disturb the scene, and read the dial: eighty degrees. The reading seemed oddly precise, out of place in the midst of chaos. Nearby, a handful of guests clustered, their faces pale and drawn. One whispered, 'Dinner began at seven, didn’t it?' The statement hung in the air, an anchor in the uncertainty. Eleanor’s mind raced—if the drink had been untouched until dinner, and the thermometer showed eighty degrees, then the timing of the poison’s effect must be crucial. She recalled the medical report: the poison required a temperature of at least eighty degrees Fahrenheit to activate. The implication was unsettling; the drink could not have been lethal until it reached that threshold.

Eleanor straightened, her eyes scanning the room for further contradictions. She caught the nervous glance of Beatrice Quill, whose tea-length dress and cloche hat seemed almost too composed for the moment. Beatrice’s public identity as a creative free spirit was well known among the guests, but her connection to Hugo Vane was less clear—rumours of artistic collaboration, perhaps, or something more personal. Beatrice lingered near the bar, her fingers tracing the rim of an empty glass, a subtle tremor betraying her calm facade. Eleanor noted the gesture, filing it away. The investigator’s role had fallen to her, and she felt the weight of expectation in every glance. Yet, as she surveyed the scene, Eleanor’s confidence surfaced: 'Curiosity killed the cat, but satisfaction brought it back,' she murmured, a dry edge to her voice.

Captain Ivor Hale, the household steward and Hugo Vane’s trusted adviser, stood nearest the body. His posture was disciplined, but his hand tightened around his watch chain—a tell that did not escape Eleanor’s notice. Hale’s stoicism was legendary among the staff, yet the flicker of uncertainty in his gaze betrayed a deeper anxiety. Eleanor approached, her tone measured. 'You were here last night?' Hale nodded, his voice low. 'I oversaw the dinner, as always. Nothing seemed amiss.' The investigator’s immediate read: Hale’s surface composure masked a reluctance to discuss the events, his eyes darting toward the spilled drink as if it held secrets he preferred to ignore.

Dr. Mallory Finch, the hotel’s resident authority figure, entered with a brisk step, his wool suit immaculate despite the morning’s dampness. He knelt beside Hugo Vane, checking for signs of life with practiced detachment. 'He’s gone,' Finch said, rising slowly. 'It’s the drink, I suspect.' Eleanor watched Finch’s movements, noting the absence of hesitation—a man accustomed to crisis, but not immune to its emotional toll. Finch’s connection to Hugo was professional, yet his presence now carried the gravity of responsibility. Eleanor’s inference: Finch’s medical expertise would be invaluable, but his manner suggested he was already bracing for scrutiny.

Sylvia Trent, the manipulative matriarch, hovered near the doorway, her tailored coat and pearl necklace framing a face etched with concern. Sylvia’s reputation for orchestrating social gatherings was matched only by her ability to steer conversations away from uncomfortable truths. She glanced at Eleanor, her voice soft but insistent. 'Everyone saw Hugo with his drink during dinner. It was perfectly safe.' Eleanor caught the subtext—a push to preserve appearances, to deflect suspicion from the household. Sylvia’s surface behaviour was polished, but the slight tremor in her hand as she adjusted her gloves hinted at deeper unease. Eleanor’s provisional read: Sylvia was determined to maintain control, but the cracks in her composure were beginning to show.

The bar area of the hotel felt claustrophobic, the art deco fixtures casting elongated shadows across the floor. The rain intensified, drumming against the glass and muffling the sound of footsteps as guests retreated to the edges of the room. Eleanor moved closer to Hugo’s body, careful not to disturb the evidence. The spilled drink, the thermometer reading, and the dinner timeline formed a triangle of contradiction. If witnesses confirmed dinner began at seven, and the drink was untouched until then, how had the poison been activated? The requirement of eighty degrees for lethality suggested a deliberate manipulation—someone had ensured the conditions were met, but the method remained elusive.

Eleanor hesitated, feeling the weight of the atmosphere pressing in. The tension was palpable, each guest a potential suspect, each detail a possible clue. She allowed herself a moment of relief—a dry remark escaping her lips. 'If only murder were as straightforward as a crossword puzzle.' The guests offered nervous laughter, the sound brittle against the morning’s chill. Yet beneath the surface, Eleanor sensed the complexity of the case. The clues were present, but the truth remained hidden, waiting to be unearthed. As she prepared to begin her investigation in earnest, Eleanor knew the stakes were higher than mere reputation; the soul of the household depended on unraveling the deceptive dose that had claimed Hugo Vane’s life.
--- END PRIOR CHAPTER 1 ---

--- BEGIN PRIOR CHAPTER 2 ---
Title: Chapter 2: The Eighty Degree Threshold
"It’s colder than a banker’s heart this morning," Eleanor murmured, her voice barely rising above the persistent drizzle tapping against the tall windows of the bar area of the hotel. The scent of damp wool mingled with the sharper tang of spilled gin, and the chill seemed to seep through every surface. Rain blurred the view of Brighton’s wintry coast, casting the room in a pale, uncertain light. As Eleanor stepped closer to the scene, the bar’s art deco fixtures reflected a dull glow, their elegance diminished by the shadow of Hugo Vane’s body lying motionless beside the overturned glass. The silence was punctuated only by the nervous rustle of guests shifting in their seats, each glance darting toward the evidence—especially the thermometer on the bar, its needle fixed at eighty degrees.

Eleanor’s gaze drifted to the sticky residue clinging to the rim of the glass near Hugo Vane’s hand. The faint shimmer of the substance caught the morning light, and she noted how it stood out against the polished wood. Nearby, Captain Ivor Hale’s gravelly voice broke the hush. "Dinner started at seven. I made sure of it myself." The assertion was echoed by Sylvia Trent, whose gloved hand gestured delicately toward the bar. "Everyone saw Hugo with his drink then," Sylvia said, her tone smooth but edged with urgency. The contradiction was immediate—if the drink had been untouched until dinner, and the thermometer read eighty degrees, the timing of the poison’s effect was not just incidental, but critical. The sticky residue, the specific temperature, and the dinner timeline formed a web of confusion that Eleanor could not ignore.

Eleanor considered the implications. The sticky substance suggested the drink was compromised, likely with poison, and the thermometer’s reading—eighty degrees—was no accident. She recalled the medical report: the poison required a temperature of at least eighty degrees Fahrenheit to activate. If the drink was left untouched until dinner, the lethal effect could only have occurred once the temperature threshold was met. This detail narrowed the window of opportunity, but the method remained frustratingly obscure. The contradiction between the timeline and the physical evidence unsettled Eleanor, prompting her to look for further inconsistencies among the guests.

Dr. Mallory Finch knelt beside Hugo Vane, his movements precise and clinical. He examined the glass, his brow furrowing as he noted the sticky residue. "In my professional opinion," Dr. Finch said, his tone measured, "the poison would only become active at eighty degrees. That’s not a coincidence." Eleanor watched him carefully, noting the lack of warmth in his manner. Finch’s authority was unquestioned, but his detachment seemed to mask deeper anxieties. The doctor’s statement reinforced the importance of the thermometer and the timeline, but Finch’s eyes lingered on the bar as if searching for answers he dared not voice.

Captain Ivor Hale, still standing near the bar, adjusted his watch chain with a restless hand. His military posture remained intact, but the tension in his jaw betrayed his unease. "You can’t unring the bell, can you?" Hale muttered, his voice tinged with regret. Eleanor caught the wistful tone, recognizing it as a shield against vulnerability. Hale’s insistence on the dinner timeline was firm, yet his eyes lingered on the glass as if searching for absolution. Eleanor pressed him gently. "Did you notice anything unusual before dinner?" Hale hesitated, his gaze flickering to Beatrice Quill. "Nothing I’d care to dwell on," he replied, evading the question. His reluctance to elaborate left Eleanor with the sense that something was being left unsaid.

Beatrice Quill stood apart, her tea-length dress and cloche hat immaculate despite the morning’s dampness. She traced the rim of an empty glass with her finger, her expression a careful blend of composure and uncertainty. "Art is subjective, but murder is not," Beatrice said, her voice lyrical yet edged with sardonic wit. Eleanor noted the tremor in Beatrice’s hand, a sign of nerves beneath the surface. When Eleanor asked about Hugo’s drink, Beatrice deflected. "I wouldn’t dream of suggesting who might be involved; it’s all too complicated." The evasiveness was telling, and Eleanor wondered if Beatrice’s artistic temperament masked a deeper connection to the victim. The tension between Beatrice’s public persona and her private anxieties became more pronounced, shifting Eleanor’s suspicion.

Sylvia Trent hovered near the doorway, her tailored coat and pearl necklace framing her face in the dim morning light. She spoke with practiced sophistication, her words carefully chosen. "One must do what one must do; life is all about choices, isn’t it?" Sylvia’s polite savagery was evident, but the tremor in her hand as she adjusted her gloves betrayed her concern. Eleanor pressed her gently. "You seem particularly invested in the timeline, Sylvia." Sylvia’s smile was brittle. "I prefer to let others draw their own conclusions; it’s much more entertaining." The exchange exposed Sylvia’s desire to control the narrative, but her composure was beginning to crack under the pressure of suspicion.

The atmosphere in the bar area of the hotel grew heavier as Eleanor moved between the guests, each interview revealing new layers of contradiction and anxiety. The rain intensified, drumming against the glass and muffling the sound of footsteps. Eleanor’s mind raced, piecing together the clues: the sticky residue on the glass, the thermometer reading of eighty degrees, the dinner timeline confirmed by multiple witnesses. The contradictions were not just technical, but deeply personal—each suspect’s reaction revealed their relationship to Hugo Vane and their struggle to maintain composure. Eleanor allowed herself a moment of relief, a dry remark slipping from her lips. "If only murder were as straightforward as a crossword puzzle." The guests offered nervous laughter, the sound brittle against the morning’s chill. Yet beneath the surface, Eleanor sensed the complexity of the case. The clues were present, but the truth remained hidden, waiting to be unearthed.

As the morning wore on, Eleanor’s working theory shifted. The evidence pointed to a deliberate manipulation of the drink, but the method was still elusive. The contradictions among the guests—especially the conflict between the timeline and the physical evidence—suggested that appearances were deceiving. Eleanor resolved to press further, knowing that each interview had changed the landscape of suspicion. The soul of the household depended on unraveling the deceptive dose that had claimed Hugo Vane’s life, and Eleanor was determined to expose the truth, however tangled it might be.
--- END PRIOR CHAPTER 2 ---

--- BEGIN PRIOR CHAPTER 3 ---
Title: Chapter 3: Witness Statements
By midmorning, the bar area of the hotel was cloaked in a damp haze, lamplight flickering against the rain-streaked windows. Eleanor Voss reached for the edge of the bar, the surface cold beneath her glove, and scanned the scene with deliberate care. The scent of stale gin mingled with wet wool, and the sound of distant waves echoed faintly through the walls. She leaned closer to the sunlit patch where Hugo Vane’s body had been found, her gaze settling on a glass. The rim bore a sticky residue, its sheen catching the grey light, and the faint outline of fingerprints suggested it had been handled recently. A thermometer lay nearby, its needle unwavering at eighty degrees. The evidence was undeniable: the drink had reached the precise temperature required for the poison to become lethal.

Eleanor paused, her mind threading together the clues. The sticky residue hinted at tampering—something foreign had been added, and the thermometer’s reading confirmed the poison’s activation threshold. Yet the arrangement was peculiar. Why had the glass been left in the sunlit area, where warmth was most likely to elevate its contents to eighty degrees? She noted the contradiction, her suspicion deepening. This was no accident; someone had engineered the conditions. Still, the exact mechanism remained hidden, and Eleanor resisted the urge to jump to conclusions, holding back her theory for now.

Moving to the bar’s corner, Eleanor stooped beside Hugo Vane’s body, careful not to disturb the scene. The victim’s jaw was clenched, his fingers curled inward—a sign that convulsions had preceded his death. A faint mark marred his wrist, and his skin bore the pallor of someone who had suffered sudden trauma. Eleanor studied the wounds, her stomach tightening. Poison was the likely cause, but the method of delivery was still shrouded in uncertainty. She glanced at Dr. Mallory Finch, whose measured steps brought him to her side.

Dr. Mallory Finch adjusted his cufflinks, his tone steady. “In my professional opinion, the convulsions indicate a rapid onset. I would suspect a beverage as the vector, given the proximity of the glass.” Eleanor watched his expression, noting the absence of warmth. Finch’s words were precise, but his eyes darted to the thermometer as if wary of its implications. The doctor’s authority carried weight, but Eleanor sensed an underlying tension—perhaps the fear of being implicated, or the pressure of expectation.

Captain Ivor Hale stood near the bar, his wool suit damp from the morning’s drizzle. He fiddled with his watch chain, the gesture betraying a restless energy. “You can’t unring the bell, can you?” Hale said, his gravelly voice tinged with regret. “I oversaw the dinner. Everything was as it should be.” Eleanor caught the wistful tone, reading it as a mask for deeper anxieties. She pressed him gently, her voice casual but probing. “Did you see anything unusual before dinner, Captain?” Hale’s gaze lingered on the sticky glass. “Nothing I’d care to dwell on. Some things are best left unsaid.”

Beatrice Quill moved with quiet deliberation, her tea-length dress brushing the bar’s polished surface. She traced the rim of an empty glass, eyes distant. “Art is subjective, but murder is not,” Beatrice mused, her voice colored by sardonic wit. Eleanor watched her, noting a tremor in Beatrice’s hand—a hint of nerves beneath her composed exterior. When Eleanor inquired about Hugo’s drink, Beatrice offered a deflection. “I served the drinks, yes, but I left him alone after. The bar was crowded.” Her statement felt rehearsed, and Eleanor wondered if Beatrice’s creative persona concealed a more calculating nature.

Sylvia Trent, framed by the doorway, adjusted her pearl necklace with practiced poise. Her tailored coat was immaculate despite the wintry chill. “One must do what one must do; life is all about choices, isn’t it?” Sylvia’s tone was smooth, her words layered with polite savagery. Eleanor approached, careful to avoid direct confrontation. “You seem invested in the timeline, Sylvia.” Sylvia’s smile was brittle. “I prefer to let others draw their own conclusions. It’s much more entertaining.” Beneath the surface, Eleanor sensed Sylvia’s determination to steer the narrative, but the tremor in Sylvia’s hand betrayed her concern.

The murmur of conversation grew tense as Eleanor moved between the guests, each statement revealing new inconsistencies. The sticky residue on the glass, the thermometer’s unwavering reading of eighty degrees, and the signs of convulsion on Hugo Vane’s body formed a web of suspicion. Yet the method remained just out of reach; Eleanor’s mind raced through possible scenarios, resisting the urge to settle on any single theory. The contradictions were not just technical, but deeply personal—each guest’s reaction exposed hidden wounds and loyalties.

Eleanor allowed herself a moment of dry relief, leaning against the bar and muttering, “Curiosity killed the cat, but satisfaction brought it back.” The guests exchanged uneasy glances, their laughter brittle against the morning’s chill. She watched them closely, feeling the pressure of their gazes—each suspect hiding something, each testimony a mask. The clues were present, but the truth remained elusive. As Eleanor prepared to press further, she knew the investigation had shifted: prior clues now carried revised meanings, the implication of tampering was undeniable, and the landscape of suspicion had changed. Yet the final piece—the mechanism—remained concealed, waiting for a more decisive test.
--- END PRIOR CHAPTER 3 ---

[SCENE COMPLETENESS CONTRACTS — MANDATORY. Each contract below lists what you MUST enact in that chapter. Do not summarise or mention these labels in the prose — enact them organically.]
Chapter 4 (Act 2) completeness contract:
  PIVOT ELEMENT (MANDATORY — write this into the prose, shown not told): "Beatrice's admission of feeling belittled by Hugo."
  FACT ESTABLISHED (MANDATORY — reader must know this by chapter end): "Establishes that Beatrice had a motive related to Hugo's ridicule."

# Case Overview
Title: The Deceptive Dose
Era: 1940s
Setting: A mid-century seaside hotel with art deco influences
Crime: murder (delayed-action poisoning)
Culprit: Beatrice Quill
Victim: Hugo Vane
False assumption: Hugo was poisoned at a time when everyone was accounted for.
Cast: Eleanor Voss (she/her), Dr. Mallory Finch (he/him), Captain Ivor Hale (he/him), Beatrice Quill (she/her), Sylvia Trent (she/her), Hugo Vane (he/him)

Setting Lock: Keep all scenes and descriptions consistent with the stated setting (A mid-century seaside hotel with art deco influences). Do not introduce a different location type. Do not invent an alternative estate name. The only permitted name for this property is "A mid-century seaside hotel with art deco influences" — any other estate name (e.g., "Caldwell Manor", "Ashwood Hall", or any invented proper name) is a continuity error that will be caught and rejected.

⛔ PRONOUN LOCK (verify every sentence before writing):
• Eleanor Voss — she/her/her (NEVER he/him)
• Dr. Mallory Finch — he/him/his (NEVER she/her)
• Captain Ivor Hale — he/him/his (NEVER she/her)
• Beatrice Quill — she/her/her (NEVER he/him)
• Sylvia Trent — she/her/her (NEVER he/him)
• Hugo Vane — he/him/his (NEVER she/her)

Outline scenes:
[
  {
    "sceneNumber": 4,
    "act": 2,
    "title": "Exploring Motives",
    "setting": {
      "location": "the hotel dining room",
      "timeOfDay": "Afternoon",
      "atmosphere": "A mix of curiosity and dread fills the air."
    },
    "characters": [
      "Eleanor Voss",
      "Dr. Mallory Finch",
      "Captain Ivor Hale",
      "Beatrice Quill",
      "Sylvia Trent"
    ],
    "purpose": "Explore motives of the suspects.",
    "cluesRevealed": [
      "clue_5",
      "clue_6",
      "clue_early_1"
    ],
    "dramaticElements": {
      "conflict": "Motive discussions lead to heated debates.",
      "tension": "Eleanor senses the fear of exposure.",
      "microMomentBeats": [
        "Eleanor catches Beatrice's eye, a flicker of guilt visible."
      ]
    },
    "summary": "In the dining room, Eleanor questions the suspects about their relationships with Hugo. Dr. Finch reveals his frustration over Hugo's criticism of his practice, while Beatrice admits to feeling belittled by Hugo's comments about her artwork. Sylvia's demeanor is evasive, hinting at deeper secrets.",
    "beat": "motives",
    "estimatedWordCount": 1800,
    "pivotElement": "Beatrice's admission of feeling belittled by Hugo.",
    "factEstablished": "Establishes that Beatrice had a motive related to Hugo's ridicule.",
    "permittedBehavioursByAct": [
      {
        "characterName": "Eleanor Voss",
        "behaviour": "May show unease, evasion, or mild defensiveness when questioned."
      },
      {
        "characterName": "Dr. Mallory Finch",
        "behaviour": "May show unease, evasion, or mild defensiveness when questioned."
      },
      {
        "characterName": "Captain Ivor Hale",
        "behaviour": "May show unease, evasion, or mild defensiveness when questioned."
      },
      {
        "characterName": "Beatrice Quill",
        "behaviour": "May show unease, evasion, or mild defensiveness when questioned."
      },
      {
        "characterName": "Sylvia Trent",
        "behaviour": "May show unease, evasion, or mild defensiveness when questioned."
      }
    ],
    "redHerringPlacement": null,
    "emotionalRegister": "The activation temperature of the poison shifts the focus of the investigation.",
    "dominantCharacterNote": {
      "name": "Eleanor Voss",
      "voiceRegister": "Eleanor's voice carries a confident cadence, often laced with dry wit that reflects her journalistic background."
    },
    "humourGuidance": {
      "permission": "permitted",
      "character": "Eleanor Voss",
      "form": "dry_wit"
    },
    "eraTextureNote": "Short daylight hours limit social activities.; Frequent rain showers hinder outdoor gatherings.; Travel and communication still affected by post-war infrastructure.",
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
  Dr. Mallory Finch    | he/him/his/himself        | [fill in]     | [yes/no]
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
- Template linter: repeated long paragraph fingerprint detected. Rewrite repeated scaffold-like prose into chapter-specific language.
- Template linter: high n-gram overlap detected (0.70 >= 0.65). Rephrase this passage to avoid template leakage.

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

Attempt 2/3 — chapters 4 — 2 validation issue(s) to resolve:

═══ TEMPLATE LEAKAGE ERRORS (2) ═══
• Template linter: repeated long paragraph fingerprint detected. Rewrite repeated scaffold-like prose into chapter-specific language.
• Template linter: high n-gram overlap detected (0.70 >= 0.65). Rephrase this passage to avoid template leakage.

⛔ BANNED PARAGRAPH — DO NOT REPRODUCE ANY SENTENCE FROM THIS TEXT:
"sylvia trent framed by the doorway ... sylvia s hand betrayed her concern"

Every sentence in your response must be a sentence that could NOT appear in any of the above passages.
You may write about the same event, but from a different physical position, a different
sensory angle, or at a different moment in the scene. You may not preserve a single clause.

⛔ NEAR-DUPLICATE PASSAGE — your prose closely echoes this prior paragraph:
"beatrice quill moved with quiet deliberation ... persona concealed a more calculating nature"

Rewrite any paragraph that shares sentence structure or extended phrases with any of the above texts.
Different words for the same image are not sufficient — the sentence structure must also differ.

⛔ PRIOR CHAPTER DUPLICATION LOCK — 26 protected passage(s):
Your prose has been detected copying from an earlier chapter. Every paragraph listed below appears in a prior chapter and is COMPLETELY OFF-LIMITS. Do not reproduce, rephrase, or structurally echo any of them:

  • "Eleanor Voss pressed her gloved hand ... through wool as she steadied herself."
  • "A thermometer, half-hidden behind the bar, caught Eleanor’s eye."
  • "Eleanor straightened, her eyes scanning the room for further contradictions."
  • "Captain Ivor Hale, the household steward ... trusted adviser, stood nearest the body."
  • "Dr."
  • "Sylvia Trent, the manipulative matriarch, hovered ... framing a face etched with concern."
  • "The bar area of the hotel ... casting elongated shadows across the floor."
  • "Eleanor hesitated, feeling the weight of the atmosphere pressing in."
  • ""It’s colder than a banker’s heart ... the bar area of the hotel."
  • "Eleanor’s gaze drifted to the sticky ... the glass near Hugo Vane’s hand."
  • "Eleanor considered the implications."
  • "Dr."
  • "Captain Ivor Hale, still standing near ... watch chain with a restless hand."
  • "Beatrice Quill stood apart, her tea-length ... hat immaculate despite the morning’s dampness."
  • "Sylvia Trent hovered near the doorway, ... face in the dim morning light."
  • "The atmosphere in the bar area ... new layers of contradiction and anxiety."
  • "As the morning wore on, Eleanor’s working theory shifted."
  • "By midmorning, the bar area of ... lamplight flickering against the rain-streaked windows."
  • "Eleanor paused, her mind threading together the clues."
  • "Moving to the bar’s corner, Eleanor ... careful not to disturb the scene."
  • "Dr."
  • "Captain Ivor Hale stood near the ... suit damp from the morning’s drizzle."
  • "Beatrice Quill moved with quiet deliberation, ... dress brushing the bar’s polished surface."
  • "Sylvia Trent, framed by the doorway, ... her pearl necklace with practiced poise."
  • "The murmur of conversation grew tense ... guests, each statement revealing new inconsistencies."
  • "Eleanor allowed herself a moment of ... cat, but satisfaction brought it back."

Preserve continuity with the established story facts, but rebuild the phrasing from new sentence structures.
Keep the clue state, cast facts, and chapter obligations intact while making the prose read like a genuinely new draft.

═══ RETRY MICRO-PROMPTS (2) ═══
• REPAIR [template_overlap — attempt 2 — STRUCTURED REWRITE MODE]: Overlap detected; freeform retry mode is disabled for this chapter.
  Treat the prior draft as DISCARDED. Rebuild paragraph-by-paragraph in this order:
  Para 1: A named character performs a concrete physical action tied to this chapter's scene objective.
  Para 2: Introduce one scene-specific clue/observation through dialogue or direct sensory perception.
  Para 3+: Advance the conflict with chapter-specific consequences; vary sentence openings and clause structures.
  Do NOT preserve sentence skeletons from prior drafts. Every paragraph must use a distinct syntactic frame.
• WORD COUNT TARGET [template_overlap — attempt 2]: While rephrasing for uniqueness, you MUST write at least 1250 words.
  Do NOT shorten this chapter. A rewrite significantly shorter than 1250 words will fail validation.
  Expand with additional investigation beats, character reactions, or sensory detail — do not cut content to achieve variety.

Return corrected JSON for chapters 4. Edit only the sections that failed — keep all content that passed validation, and return the complete updated chapter JSON.


RETRY CLASS: template
ATTEMPT: 1/3
OFFENDING TEXT: repeated long paragraph fingerprint detected. Rewrite repeated scaffold-like prose into chapter-specific language.
MANDATORY FIXES:
- Resolve template issues before accepting this batch.
- Template linter: repeated long paragraph fingerprint detected. Rewrite repeated scaffold-like prose into chapter-specific language.
- Template linter: high n-gram overlap detected (0.70 >= 0.65). Rephrase this passage to avoid template leakage.
```
