# Actual Prompt Record

- Run ID: `mystery-1784247524200`
- Project ID: ``
- Timestamp: `2026-07-17T00:29:01.410Z`
- Agent: `Agent9-ProseGenerator-Ch3`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4.1`
- Temperature: `0.42`
- Max Tokens: `4500`
- Attempt: `first`
- Prompt Hash: `e8763b8ebb7bfe42`

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
- MORAL COMPLEXITY REQUIREMENT: The mechanism of this crime carries a moral gray area: "The murderer believed they were protecting their loved one from an imminent betrayal, creating a tragic conflict between love and morality." — the culprit reveal and denouement MUST acknowledge this ambiguity. Do not let the ending feel clean or simple. Give the reader at least one moment of uncomfortable sympathy or moral doubt.

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
   - Captain Ivor Hale: Estranged Relative
   - Beatrice Quill: Bitter Outsider
   - Sylvia Trent: Manipulative Matriarch
   - Hugo Vane: Curious Observer
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

## Era: 1942 July
In the summer of 1942, life in Brighton is heavily influenced by the ongoing war and its impact on daily activities. The local community is in a state of unease as rationing continues to affect food supplies and basic goods, creating a sense of scarcity that permeates social interactions. People gather at the seaside hotel, seeking respite from the tensions of wartime, but the threat of espionage looms large, casting shadows over their gatherings. The atmosphere is thick with anticipation and anxiety as whispers of thefts and betrayal circulate, heightening the stakes for all involved.
Emotional register: A pervasive sense of anxiety and suspicion characterizes the collective mood as individuals navigate the uncertainties of wartime life.
Physical constraints: Limited transportation due to fuel rationing | Increased security checks and surveillance | Restricted access to certain goods and services
Current tensions (weave into background texture): Ongoing Allied operations in North Africa | Increased fears of espionage and thefts | Rationing impacting everyday life
Wartime context — Many men are serving overseas, leaving women to take on roles in factories and services.: Community solidarity emerges through shared struggles, but class tensions surface as traditional roles are challenged. Absence effect: The absence of loved ones creates a void, leading to heightened emotional fragility and a longing for connection.

## Season Lock (mandatory — derived from 1942 July)
Season: summer. Allowed vocabulary: summer, summery, midsummer
Forbidden seasonal words — never use in narration, dialogue, or metaphor: spring, autumn, winter and their adjectival forms.
Every weather description, atmosphere, and time-of-year reference must be consistent with summer.

## Story Theme
The complexities of human ambition and desire can lead to moral corruption and tragic consequences in the pursuit of personal gain, and reveals that evidence carries ethical weight, forcing characters to choose accountability over social performance when appearances and facts collide.

## Story Emotional Register
Dominant: A journey through tension and moral ambiguity.

Arc:
The story opens in The Seaside Grandeur Hotel on a stormy evening, where the air is thick with anticipation as guests gather for a charity event. The atmosphere is both elegant and foreboding, setting the stage for the shocking murder of Dr. Mallory Finch. As Detective Eleanor Voss begins her investigation, an unsettling unease permeates the hotel, with each clue leading to more questions and red herrings that heighten the emotional stakes.

The initial investigation reveals conflicting alibis and hidden motives, creating a web of suspicion among the suspects. A pivotal shift occurs when Eleanor discovers a crucial piece of evidence that redirects her suspicions toward Beatrice Quill, adding layers of complexity to the case. As more revelations surface, it becomes clear that each character is entangled in a web of ambition and desperation, forcing them to confront their own moral failings. The climax builds to a tense confrontation in the dining room, where the truth comes to light, but at a cost—Eleanor grapples with her own ambitions and the ethical implications of her pursuit of justice. In the resolution, the emotional toll on each character is profound, as the consequences of their actions resonate beyond the immediate tragedy, leaving them to navigate a world forever altered by their choices.

## Emotional register at this point in the story
Tension rises as the investigation begins, with conflicting alibis creating unease.

## Character Portraits (appearance & era)

### Eleanor Voss
Eleanor Voss is a woman caught between her passion for art and the harsh realities of financial instability. In the context of the war, her struggles with her gallery reflect the broader societal shifts, as women increasingly step into roles traditionally held by men. The weight of her desperation leads her to navigate the murky waters of morality in her quest for success.
Era intersection: Eleanor's ambition to save her gallery clashes with the wartime ethos of community and sacrifice.

### Captain Ivor Hale
Captain Ivor Hale's gruff demeanor masks deep-seated grievances stemming from family disputes exacerbated by the war. As a retired naval officer, he embodies the turmoil of men returning from service, grappling with their identities and the resentments that surface in the shadows of conflict. His character exemplifies the struggle for personal gain amidst societal upheaval.
Era intersection: Ivor's desire to reclaim his family's estate highlights the intersection of personal ambition and the broader themes of loss and betrayal in wartime.

### Beatrice Quill
Beatrice Quill's charm belies her resentment toward the wealthy patrons she serves at the hotel. As a young woman navigating the class divide during a time of upheaval, she grapples with her ambitions and frustrations against the backdrop of wartime scarcity. Her character illustrates the yearning for recognition in a society where status often overshadows merit.
Era intersection: Beatrice's struggles reflect the changing social dynamics as women seek empowerment in a world increasingly dominated by male privilege.

### Sylvia Trent
Sylvia Trent manipulates social dynamics to maintain her wealth and status, embodying the lengths to which individuals will go to secure their futures in a time of uncertainty. As a wealthy widow, she navigates the dual pressures of maintaining her lifestyle and dealing with the societal shifts that threaten her position. Her character reveals the darker aspects of ambition and moral compromise.
Era intersection: Sylvia's actions underscore the tensions between traditional roles and emerging opportunities for women during the war.

### Hugo Vane
Hugo Vane is a journalist who thrives on scandal, yet his own life is riddled with secrets that threaten to unravel his career. In the context of wartime, his character grapples with the ethical implications of his profession and the moral decay that accompanies the pursuit of truth. His story reflects the complexities of integrity in a world filled with deception.
Era intersection: Hugo's blackmail scheme highlights the moral compromises individuals make in the face of personal and societal pressures.

## Character Voices

### Eleanor Voss (she/her/her)
Eleanor speaks with an articulate tone, often peppering her dialogue with art references.
[comfortable] Ah, the art of conversation—so often a masterpiece and so rarely appreciated.
[evasive] I can't say I've seen anything out of the ordinary; perhaps it was merely a misunderstanding.
[stressed] This is all so overwhelming; I just need to focus on the gallery's future.
Humour: Her dry wit often surfaces in social situations, adding a layer of complexity to her character.

### Captain Ivor Hale (he/him/his)
Ivor's direct manner conveys the no-nonsense attitude of a military man.
[comfortable] War is hell, but family can be worse.
[evasive] I don't recall the details; it was a busy evening.
[stressed] I can't shake the feeling that I've been wronged, and I want justice.
Humour: His blunt humor often masks deeper vulnerabilities, reflecting his complex character.

### Beatrice Quill (she/her/her)
Beatrice's bright tone is often laced with sarcasm and bitterness.
[comfortable] Ah, the glamorous life of the rich—so hard to bear, really.
[evasive] I was just doing my job; nothing more to it.
[stressed] It's not fair! I've worked hard, but they always overlook me!
Humour: Her sardonic wit often reflects her frustrations with class disparities.

### Sylvia Trent (she/her/her)
Sylvia's language is polished and sophisticated, often laced with sharp wit.
[comfortable] Wealth may not buy happiness, but it certainly makes the misery more comfortable.
[evasive] I really don't think that's any of your concern.
[stressed] I can't afford to be seen as vulnerable; I have so much to lose!
Humour: Her polite savagery adds depth to her character, revealing her true feelings.

### Hugo Vane (he/him/his)
Hugo speaks with a sharp, analytical tone, often infused with dry humor.
[comfortable] The truth is a slippery fish, isn't it?
[evasive] I'd rather not disclose my sources; it's a matter of professional integrity.
[stressed] If my secret comes out, it could ruin everything I've built!
Humour: His observational humor often highlights the absurdities of the situations he finds himself in.

## Location Registers (scene framing guides)

Grand Lobby: The Grand Lobby pulses with an air of elegance tinged with unease, where whispers of suspicion float as freely as the salty breeze from the sea. Guests navigate this space with a mixture of excitement and trepidation, unaware of the secrets lurking just out of sight.. Camera angle: As a writer enters the Grand Lobby, the camera captures the delicate balance between opulence and anxiety, inviting exploration of hidden motives.. Era: The grandeur of the lobby starkly contrasts the underlying tension of wartime society.

Rooftop Terrace: The Rooftop Terrace offers breathtaking views marred by an undercurrent of tension, as the sound of crashing waves harmonizes with nervous laughter. The cool breeze feels refreshing yet charged with anticipation, hinting at the turbulent events about to unfold.. Camera angle: Entering the Rooftop Terrace, the camera captures the expansive horizon, but the growing clouds hint at the storm brewing in both the skies and the guests' hearts.. Era: The open space contrasts the confinement of the hotel’s interior, yet the looming threat of espionage overshadows its beauty.

Elegant Dining Room: The Elegant Dining Room exudes sophistication, yet the clinking of glasses and murmurs of conversation are laced with tension. Each bite of gourmet cuisine is shadowed by the unspoken fears of theft and betrayal, creating a palpable atmosphere of unease.. Camera angle: The camera captures the flickering candlelight, revealing a space filled with both celebration and suspicion, inviting exploration of the hidden dynamics at play.. Era: The opulence of the dining room serves as a stark reminder of the war's impact on everyday life, where luxury is tinged with anxiety.

Staff-Only Corridor: The Staff-Only Corridor is a stark, utilitarian space, echoing with the hurried footsteps of staff members. The oppressive atmosphere is thick with the scent of cleaning products and whispers of unease, as the staff navigate the tension that permeates the hotel.. Camera angle: As the camera moves through the dimly lit corridor, it captures the sense of urgency and anxiety, inviting the audience to delve into the hidden stories of the hotel staff.. Era: The corridor serves as a reminder of the divide between guests and staff, highlighting the class dynamics prevalent during the war.

## Humour guidance for this story position (early)
Permission: forbidden
Rationale: The investigation's initial stages are marked by tension and suspicion.

## Reveal Groundwork (texture — do not explain, only plant)
- Plant one subtle observable beat related to: "Earlier scenes where Eleanor interacts with Dr". Do not explain significance yet.
- Plant one subtle observable beat related to: "Finch reflect her desperation for success, deepening the emotional stakes of the murder". Do not explain significance yet.
- Plant one subtle observable beat related to: "Ivor's resentment during the investigation hints at his potential motives, suggesting a more complex web of relationships". Do not explain significance yet.

FAIR-PLAY AND INFERENCE CONTRACT:
- FAIR PLAY CLUE TIMING: Never combine clue discovery and detective deduction in the same chapter. If a clue is first revealed to the reader in chapter N, the detective may only analyze, deduce from, or act on that clue in chapter N+1 or later.
- FAIR PLAY INFORMATION PARITY: The reader must see all clues BEFORE the detective uses them in reasoning. If the detective performs a test or makes a deduction, every piece of evidence supporting that conclusion must have been shown to the reader in earlier chapters.
- FAIR PLAY REVELATION SPACING: In the discriminating test scene, the detective can ONLY use clues that were revealed to the reader at least 1 full chapter earlier. Never introduce new clues or withheld information during the test.
- FAIR PLAY CONFRONTATION: During the final confrontation/revelation, the detective cannot surprise the reader with facts. Every piece of evidence cited must have been visible to the reader in prior chapters.
- Never solve by withheld information. Keep reader-information parity with detective reasoning.
- False assumption in force: Dr. Finch was poisoned during the charity event by an unknown intruder.
- Hidden truth to progressively expose (compose in your own words from these elements): premeditated, close, acquaintance
- Inference path checkpoints to dramatize clearly — compose ENTIRELY in your own sentences from these key terms (reproducing any briefing phrase verbatim FAILS validation):
  - Step 1: obs: witnesses, report, finch, seen, taking, drink, shortly, before, collapsing | corr: suggests, poison, ingested, moment, linking, drink, directly, death | effect: narrows, opportunity, access, drink
  - Step 2: obs: drink, half, full, unusual, sediment, bottom | corr: sediment, matches, composition, delayed, action, tablet, indicating, ingested | effect: eliminates, possibility, finch, poisoned, leaving, dining, area
  - Step 3: obs: guests, recall, beatrice, quill, near, finch, took, drink | corr: indicates, opportunity, administer, poison | effect: narrows, suspicion, towards, beatrice, quill, potential, culprit
- Discriminating test method: trap
- Discriminating test elements to dramatize (compose ENTIRELY in your own sentences from these — do NOT reproduce any briefing phrase verbatim): reenacting, event, drink, tablet, composition, observing, quill, reactions
- Test must rely on already-shown clue IDs: clue_4, clue_8, clue_core_contradiction_chain, clue_fp_contradiction_step_1
- Fair-play rationale: Step 1 shows the drink was poisoned, step 2 confirms the sediment's origin, and step 3 places Beatrice Quill in a critical position during the incident.

## Character Reference

### Eleanor Voss (she/her — NEVER he/him)
Eleanor speaks with an articulate tone, often peppering her dialogue with art references and occasionally letting her sharp wit slip through, especially when the conversation turns to the absurdities of social life.
Eleanor grapples with feelings of inadequacy and fear of failure, which are exacerbated by her gallery's precarious financial state.
Voice colour: Eleanor Voss uses dry wit humour — let it surface in their dialogue where natural, not in every line.

### Captain Ivor Hale (he/him — NEVER she/her)
Ivor speaks in a direct, no-nonsense manner, often punctuating his statements with a dry chuckle or a sarcastic remark, reflecting his military upbringing.
Ivor struggles with feelings of betrayal and anger towards his family, grappling with the desire for revenge against the victim.
Voice colour: Captain Ivor Hale uses blunt humour — let it surface in their dialogue where natural, not in every line.

### Beatrice Quill (she/her — NEVER he/him)
Beatrice speaks with a bright, animated tone, often laced with sarcasm and a hint of bitterness, especially when discussing the wealthy patrons she serves.
Beatrice wrestles with her feelings of inadequacy and jealousy, struggling to find her place in a world that seems to favor the privileged.
Voice colour: Beatrice Quill uses sardonic humour — let it surface in their dialogue where natural, not in every line.

### Sylvia Trent (she/her — NEVER he/him)
Sylvia speaks with an air of sophistication, using eloquent and polished language, often laced with sharp wit that reveals her true feelings beneath a veneer of politeness.
Sylvia struggles with the moral implications of her manipulations, torn between her desire for wealth and the consequences of her actions.
Voice colour: Sylvia Trent uses polite savagery humour — let it surface in their dialogue where natural, not in every line.

### Hugo Vane (he/him — NEVER she/her)
Hugo speaks with a sharp, analytical tone, often peppering his observations with dry humor that reveals the absurdities of the situations he encounters.
Hugo grapples with the ethical implications of his blackmailing and the potential fallout if his secret comes to light.
Voice colour: Hugo Vane uses observational humour — let it surface in their dialogue where natural, not in every line.


## CHARACTER CONTRACTS (binding for this scene)
Each entry below constrains how this character must be written in this chapter.
These override generic style guidance when they conflict.

### Eleanor Voss[SHE]
Voice & mannerisms: Eleanor speaks with an articulate tone, often peppering her dialogue with art references and occasionally letting her sharp wit slip through, especially when the conversation turns to the absurdities of social life.
SIGNATURE TIC (use sparingly — this is Eleanor Voss's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "Ah, the art of conversation—so often a masterpiece and so rarely appreciated."
Sample voice fragments (match this register and rhythm):
  [comfortable] "Ah, the art of conversation—so often a masterpiece and so rarely appreciated."
  [evasive] "I can't say I've seen anything out of the ordinary; perhaps it was merely a misunderstanding."
Humour: dry wit — deploy occasionally (level 0.5)
FORBIDDEN phrase (never write for Eleanor Voss): "a surge of determination washed over her"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Eleanor was in discussions with the victim about a potential art exhibit, which could have saved her gallery." — do not surface in Act I.

### Captain Ivor Hale[HE]
Voice & mannerisms: Ivor speaks in a direct, no-nonsense manner, often punctuating his statements with a dry chuckle or a sarcastic remark, reflecting his military upbringing.
SIGNATURE TIC (use sparingly — this is Captain Ivor Hale's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "War is hell, but family can be worse."
Sample voice fragments (match this register and rhythm):
  [comfortable] "War is hell, but family can be worse."
  [evasive] "I don't recall the details; it was a busy evening."
Humour: blunt — deploy occasionally (level 0.4)
FORBIDDEN phrase (never write for Captain Ivor Hale): "she chose her words with great care"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Ivor stands to regain access to the family estate if the victim were out of the way." — do not surface in Act I.

### Beatrice Quill[SHE]
Voice & mannerisms: Beatrice speaks with a bright, animated tone, often laced with sarcasm and a hint of bitterness, especially when discussing the wealthy patrons she serves.
SIGNATURE TIC (use sparingly — this is Beatrice Quill's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "Ah, the glamorous life of the rich—so hard to bear, really."
Sample voice fragments (match this register and rhythm):
  [comfortable] "Ah, the glamorous life of the rich—so hard to bear, really."
  [evasive] "I was just doing my job; nothing more to it."
Humour: sardonic — deploy occasionally (level 0.6)
FORBIDDEN phrase (never write for Beatrice Quill): "palpable tension filled the room"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Beatrice feels slighted after being passed over for a promotion in favor of the victim's relative." — do not surface in Act I.

### Sylvia Trent[SHE]
Voice & mannerisms: Sylvia speaks with an air of sophistication, using eloquent and polished language, often laced with sharp wit that reveals her true feelings beneath a veneer of politeness.
SIGNATURE TIC (use sparingly — this is Sylvia Trent's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "Wealth may not buy happiness, but it certainly makes the misery more comfortable."
Sample voice fragments (match this register and rhythm):
  [comfortable] "Wealth may not buy happiness, but it certainly makes the misery more comfortable."
  [evasive] "I really don't think that's any of your concern."
Humour: polite savagery — deploy frequently (level 0.7)
FORBIDDEN phrase (never write for Sylvia Trent): "she felt a wave of unease"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Sylvia feared the victim would alter the will, cutting her out of a significant inheritance." — do not surface in Act I.

### Hugo Vane[HE]
Voice & mannerisms: Hugo speaks with a sharp, analytical tone, often peppering his observations with dry humor that reveals the absurdities of the situations he encounters.
SIGNATURE TIC (use sparingly — this is Hugo Vane's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "The truth is a slippery fish, isn't it?"
Sample voice fragments (match this register and rhythm):
  [comfortable] "The truth is a slippery fish, isn't it?"
  [evasive] "I'd rather not disclose my sources; it's a matter of professional integrity."
Humour: observational — deploy occasionally (level 0.4)
FORBIDDEN phrase (never write for Hugo Vane): "everyone could sense the atmosphere"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Hugo feared exposure of his blackmail scheme and wanted to eliminate the victim's influence." — do not surface in Act I.



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

- In the summer of 1942, life in Brighton is heavily influenced by the ongoing war and its impact on daily activities
- The local community is in a state of unease as rationing continues to affect food supplies and basic goods, creating a sense of scarcity that permeates social interactions
- People gather at the seaside hotel, seeking respite from the tensions of wartime, but the threat of espionage looms large, casting shadows over their gatherings
- The atmosphere is thick with anticipation and anxiety as whispers of thefts and betrayal circulate, heightening the stakes for all involved.

TEMPORAL CONTEXT:

This story takes place in July 1942 during summer.

Seasonal Atmosphere:
- Weather patterns: overcast skies with intermittent rain showers, humidity clinging to the air, mild coastal breezes
- Daylight: Long summer days with twilight extending well into the evening, creating a lingering light even after sunset at around nine o'clock.
- Seasonal activities: Beach outings despite the unpredictable weather, Local fairs showcasing wartime crafts and goods, Evening strolls along the boardwalk, dodging the occasional drizzle
- Seasonal occasions: Independence Day (July 4th) celebrated with parades and fireworks, though muted this year due to wartime restrictions.
- Season: summer

Period Fashion (describe naturally):
- Men formal: tweed suits with wide lapels, crisp white dress shirts, broad-brimmed fedoras
- Men casual: short-sleeved cotton shirts in pastel shades, lightweight linen trousers, deck shoes
- Men accessories: leather belts with brass buckles, suspenders in various colors, handkerchiefs tucked into pockets
- Women formal: tea-length dresses adorned with floral patterns, tailored suits with fitted jackets, elegant cloche hats
- Women casual: sundresses with lightweight cotton fabrics, capri pants paired with fitted blouses, stylish sandals
- Women accessories: string of pearls, vintage handbags, lacy gloves

Cultural Context (reference naturally):
- Music/entertainment: Glenn Miller's 'In the Mood', The Andrews Sisters' 'Boogie Woogie Bugle Boy', Bing Crosby's 'White Christmas'; Films: Casablanca, Mrs. Miniver; Theatre: Broadway shows featuring wartime themes, Local vaudeville performances; Radio: The Shadow, Amos 'n' Andy
- Typical prices: Loaf of bread: four pence, A pint of milk: three pence, Taxi across town: two shillings
- Current events: The Allied forces' ongoing operations in North Africa; Increased air raid drills in cities across the country
- Literature: The Maltese Falcon by Dashiell Hammett | The Glass Key by Dashiell Hammett | The Little Prince by Antoine de Saint-Exupéry | [detective novels] | [war fiction] | [romantic dramas]
- Technology: Radar technology advancing military strategy | Enhanced radio communication devices for wartime coordination | Early development of code-breaking machines | Portable radios as a staple in households | Basic television sets beginning to enter some urban homes
- Daily life: Attending community meetings to discuss war efforts, Participating in local charity drives, Gathering at soda fountains to enjoy refreshments
- Social rituals: Neighborhood watch groups forming to address theft concerns, Regular social gatherings to share news and support war efforts

Atmospheric Details:
The scent of damp earth after summer rain mingled with the salty air from the nearby coast, creating an almost suffocating humidity. The sound of distant thunder rumbles as patrons at the hotel exchange nervous glances, whispers of espionage dancing on the air. Faded posters of wartime propaganda cling to walls, while the flickering light of a radio casts shadows, hinting at secrets and stories untold.

FASHION INTEGRATION TECHNIQUES:
- First appearance: Describe outfit to establish class/personality
- Accessories: Gloves, hats, pocket watches, jewelry reveal status
- Time-specific: Different outfits for different times of day
- Character traits: Fastidious dresser vs
[truncated for prompt budget]

NON-NEGOTIABLE CHAPTER OBLIGATIONS — LOCKED EVIDENCE VALUES (VERBATIM REQUIRED):
The following measured values (times, amounts, measurements) are absolute ground truth. Every time this chapter describes, mentions, or alludes to one — no matter how briefly — it MUST use the exact phrase shown below, character for character. NO paraphrase, approximation, rounding, or synonym is permitted.

FAILURE EXAMPLE: if the locked value is "at thirteen minutes to midnight" and you write "just before midnight" or "around midnight" — that is a HARD FAIL. You must write "at thirteen minutes to midnight". Equally, if the locked value is written in words, such as "ten minutes past eleven", and you convert it to figure-based clock notation — that is also a HARD FAIL. Words stay as words; figure forms are forbidden for word-phrased facts.

CRITICAL — WORD-PHRASED VALUES: If the canonical value is written out in words (e.g. a time like "ten minutes past eleven", or an amount like "forty minutes"), reproduce those exact words. DO NOT convert to figure-based time notation, twenty-four-hour format, or any other numeric shorthand. Correct: "ten minutes past eleven". WRONG: figure-based clock notation or numeric shorthand.

Locked values:
  - The tablet takes thirty minutes to dissolve and release the poison.: "thirty minutes"
  - The victim consumed the drink at ten minutes past nine.: "ten minutes past nine"
    ⛔ FORBIDDEN alternatives: "9:10", "9.10", "nine ten", "nine-ten", "nine past ten", "quarter past nine", "half past nine" — the ONLY acceptable form is "ten minutes past nine"
  - The victim was scheduled to meet their betrayer at a quarter to ten.: "a quarter to ten"

If a value has no relevance to this chapter, omit it. But the moment you reference the underlying evidence, only the exact phrase above is acceptable.

⚠ CENTRAL CONTRADICTION (the heart of the mystery): the two locked values "ten minutes past nine" and "a quarter to ten" are NOT two separate facts — they are ONE contradiction (one is a staged appearance, the other the true state; the evidence determines which). If this chapter references both, you MUST present them AS A SINGLE CONTRAST joined by a contrast connective (but / yet / however / could only / whereas) — e.g. "the watch showed the one time, yet the evidence proved it could only have been the other" — making clear which reading is the appearance and which is the truth. NEVER state them as two flat, side-by-side truths — that makes the central clue read as if it contradicts itself.

⛔ CLUES TO SURFACE IN THESE CHAPTERS — mandatory:
The following evidence MUST be clearly observable to an attentive reader. Do not bury it in atmosphere or passing dialogue. Each clue must be concrete, specific, and noticeable:

• [clue_culprit_direct_beatrice_quill] direct, ties, beatrice, quill, mechanism, access, point, before, discriminating, excludes, competing, suspect
  Category: testimonial | Criticality: essential | Supports inference step 1
  Points to: direct, shows, beatrice, quill, means, opportunity, narrowing, solution, uniquely, toward, culprit, eligible

• [clue_fp_contradiction_step_1] witnesses, report, finch, seen, taking, drink, shortly, before, collapsing
  Category: temporal | Criticality: essential | Supports inference step 1
  Points to: suggests, poison, ingested, moment, linking, drink, directly, death

• [clue_fp_contradiction_step_2] drink, half, full, unusual, sediment, bottom
  Category: temporal | Criticality: essential | Supports inference step 2
  Points to: sediment, matches, composition, delayed, action, tablet, indicating, ingested

• [clue_id_3] Witness statements
  Category: structural | Placement: early (Act 1)
  Points to: what this observation reveals about the time or circumstances of the crime.

For each clue above: an attentive reader should be able to find, record, and later use it to reason toward the solution.

═══ NARRATIVE STATE (read-only — do not contradict) ═══

LOCKED FACTS — use verbatim whenever this evidence is described:
  • The tablet takes thirty minutes to dissolve and release the poison.: "thirty minutes"
  • The victim consumed the drink at ten minutes past nine.: "ten minutes past nine"
  • The victim was scheduled to meet their betrayer at a quarter to ten.: "a quarter to ten"

CHARACTER PRONOUNS — never deviate from these:
  • Eleanor Voss: she/her/her
  • Dr. Mallory Finch: she/her/her
  • Captain Ivor Hale: he/him/his
  • Beatrice Quill: she/her/her
  • Sylvia Trent: she/her/her
  • Hugo Vane: he/him/his

CLUES ALREADY REVEALED TO READER: clue_id_3, clue_mechanism_visibility_core, clue_core_contradiction_chain — do not reveal these as new information.

INVESTIGATION LOG — WHAT IS ESTABLISHED (do not re-establish, do not repeat):
• Evidence already established (reference only — do NOT restate or quote these; advance beyond them): method, poisoning, used, finch | method, poisoning, used, finch | timing, finch, poisoning
• Suspects still unresolved: Captain Ivor Hale[HE], Sylvia Trent[SHE], Hugo Vane[HE]
⚠ The story must move FORWARD from this log. Any beat already listed above is forbidden from repeating.

⚠ THIS CHAPTER'S REQUIRED ADVANCE (early): Interview each suspect — record their claimed whereabouts

CONTINUITY HANDOFF — previous chapter closing beat:
  • "The last of the guests drifted to the periphery of the room, their voices hushed and urgent. Eleanor lingered by the table, letting her gaze settle once more on Dr. Mallory Finch and the glass that had become the center of this gathering storm. She did not yet..."
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

═══════════════════════════════════════════════════════════
📚 CONTINUITY CONTEXT - CHARACTER & SETTING CONSISTENCY
═══════════════════════════════════════════════════════════

**CRITICAL: You are writing chapters 3+. Maintain consistency with earlier chapters.**

**Character Names Used in Chapters 1-2:**
Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill, Sylvia Trent, Hugo Vane

✓ RULE: Use EXACTLY these names. Do NOT vary spelling, add titles, or introduce new forms.
✓ Example: if earlier chapters used "Clara Whitfield", keep using "Clara Whitfield" — never "Mrs. Whitfield" unless that is the character's canonical name in the list above.

**Setting Vocabulary Established in Earlier Chapters:**
dining room

✓ RULE: Continue using this location vocabulary. Maintain consistency with established setting type.
✓ Do NOT introduce new location types that contradict earlier chapters.

**Recent Chapter Summary (for narrative continuity):**
Chapter 1: Chapter 1: The Glass in Her Hand
  Events: Eleanor knelt, her gloved fingers brushing the smooth marble as she steadied herself beside Dr.
Chapter 2: Chapter 2: Initial Confusion
  Events: Eleanor let her gaze drift over the glass and the residue swirling at its bottom, her senses sharpened by the uneasy atmosphere.

⚠️ **VALIDATION:** Character name mismatches and setting drift are common failure modes.
Double-check every character name against the list above before using it.

**⏱ LOCKED TIME ANCHOR — use verbatim, do not paraphrase:**
Clock time (from the case ground truth): **"charity event starts"**
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
Known location profile anchors: The Seaside Grandeur Hotel, Grand Lobby, Rooftop Terrace, Elegant Dining Room, Staff-Only Corridor, the grand dining room of the seaside hotel
LOCATION NAME CAPITALISATION (HARD REQUIREMENT — validated):
All named locations in your prose MUST use the EXACT capitalisation from the CML profiles.
Canonical forms: "The Seaside Grandeur Hotel", "Grand Lobby", "Rooftop Terrace", "Elegant Dining Room", "Staff-Only Corridor", "the grand dining room of the seaside hotel"
Writing a location in lowercase (e.g. "drawing room" instead of "Drawing Room") is a validated error. Every time you mention a named location, copy its capitalisation from the list above.
- Chapter 3: OPENING STYLE (HARD): Start the VERY FIRST SENTENCE with an explicit time marker — e.g. "That morning…" / "By the time dusk fell…" / "It was nearly four o'clock…" / "On the second day after the discovery…". Time must be in the first clause. Anchor opening in "the grand dining room of the seaside hotel". The opening style above governs only your FIRST SENTENCE; the grounding below may land anywhere in the first 2 paragraphs (it need not be sentence one, and never conflicts with the chosen opening style). HARD REQUIREMENT for the first 2 paragraphs: (a) include 2+ sensory words — choose from smell/scent/odor/fragrance/sound/echo/silence/whisper/creak/cold/warm/damp/rough/smooth/glow/shadow/flicker/dim — and (b) include 1+ atmosphere/time word — choose from rain/wind/fog/storm/mist/thunder/evening/morning/night/dawn/dusk/lighting/weather/season/afternoon/midday/noon/midnight/twilight/sunrise/sunset/daylight/sunlight/overcast/cloudy/bright/dark/grey/pale/chill/crisp/drizzle/haze/lamplight/firelight. These are validated requirements, not style suggestions; missing them triggers a retry.

[⚠ INTERNAL QUALITY DIAGNOSTICS — DO NOT REPRODUCE ANY PART OF THIS SECTION IN YOUR STORY OUTPUT. These are private generator observations for your consideration only. Your narrative must read as if this section does not exist. Never include phrases from this block in character dialogue, narration, or description.]

PRIOR CHAPTER QUALITY OBSERVATIONS:
- Chapter 1 (score 97/100):
  Quality gaps noted: scene grounding weakness
  Address in upcoming chapters: Open next chapter with a named location anchor plus at least two sensory cues and one atmosphere marker.
- Chapter 2 (score 97/100):
  Quality gaps noted: scene grounding weakness
  Address in upcoming chapters: Open next chapter with a named location anchor plus at least two sensory cues and one atmosphere marker.
- Phrases to avoid (already overused in earlier chapters): "lips pressed into a thin line".
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

PROMPT BUDGET SUMMARY: budget=24000 tokens; fixed=11650; context=11503; dropped=[humour_guide, location_profiles]; truncated=[location_profiles, temporal_context, pronoun_accuracy]

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
4. Integrate at least two concrete era-grounded details per chapter from setting refinement signals: radio broadcasting | early television sets | military radar | basic code-breaking machines | long-distance telephone calls | military-style encrypted messages.
5. Respect setting movement/access constraints in scene action and alibis: narrow hallways limiting mobility during emergencies | locked access to staff-only areas | designated emergency exits | staff-only areas restricted to employees | guest access limited to public spaces like the lobby and dining area.
6. Sustain social coherence with this backdrop pressure: A tense gathering at a seaside hotel for a charity event draws together a diverse group, all under the strain of post-war recovery and the looming threat of espionage.
7. Maintain continuity around these socially central cast anchors where relevant: Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill, Sylvia Trent, Hugo Vane.
8. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Critical: Plot similarity 0.80 with 'The Mysterious Affair at Styles' (same delayed-action poisoning method)
9. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Moderate: Character similarity 0.70 with 'The Second Key' (similar cast structure and roles)
10. STORY TO DATE ANTI-COPY RULE: The STORY TO DATE section below is provided for chronological and factual reference ONLY. You MUST NOT copy, lightly rephrase, or structurally echo any sentence or paragraph from prior chapters. Every sentence in this chapter must be original prose unique to this scene. Reusing even a clause from prior chapter text will cause this attempt to fail immediately.

CRITICAL PROSE REQUIREMENTS:

The CML specifies exact requirements for certain validation-critical scenes. You MUST include these elements at the specified positions.

**Discriminating Test Scene (Act 3, Scene 4):**
Required elements: Execute the discriminating test, Observe the culprit's reaction or result, Draw conclusion about guilt
Test type: Behavioral analysis

**Suspect Clearance Scenes:**
- Captain Ivor Hale (Act 3, Scene 5): Witness statements confirm he was not near the drink.
  Clues: clue_id_1, clue_id_2
- Hugo Vane (Act 3, Scene 5): Alibi corroborated by multiple witnesses.
  Clues: clue_id_3, clue_id_4
- Sylvia Trent (Act 3, Scene 5): Confirmed painting in her room at the time of the incident.
  Clues: clue_id_5, clue_id_6

**Culprit Revelation Scene (Act 3, Scene 6):**
Method: Confrontation with evidence gathered.

**Clue Placement for These Chapters:**
- clue_culprit_direct_beatrice_quill must appear in Act 1, Scene 3 via Witness statement
- clue_fp_contradiction_step_1 must appear in Act 1, Scene 3 via Cross-check contradiction
- clue_fp_contradiction_step_2 must appear in Act 1, Scene 3 via Cross-check contradiction
- clue_id_3 must appear in Act 1, Scene 3 via Witness statements

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
Investigation state at start: 3 clue(s) revealed to reader; approximately 3 unresolved suspect(s).
Must change by end: Reframe prior clue meaning and update suspect implications.
Suspect pressure target(s): Captain Ivor Hale, Beatrice Quill, Hugo Vane, Sylvia Trent
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
  - Opening: Begin with a character action, spoken line, or clock/time marker — never a location name or location-description phrase.
  - Scene is set in: the grand dining room of the seaside hotel — reference it naturally within the paragraph, never as your opening phrase.
  - Opening atmosphere (MANDATORY — validator enforced): the first paragraph MUST contain at least one of: rain / wind / fog / storm / mist / thunder / evening / morning / night / dawn / dusk / season / afternoon / midday / noon / midnight / twilight / sunrise / sunset / daylight / sunlight / overcast / cloudy / bright / dark / grey / pale / cold / warm / chill / crisp / damp / drizzle / haze / lamplight / firelight. A chapter that omits all of these from its opening paragraph will be rejected.
  - PARAGRAPH OPENER DIVERSITY (MANDATORY — validator enforced): No more than 2 paragraphs in this chapter may begin with "Eleanor" or "Eleanor's" as the first word. You must vary paragraph openings throughout: use sensory observations, another character's name or action, dialogue, object or sound details, or temporal markers. Opening 3 or more paragraphs with "Eleanor" will cause automated rejection.
  - Continuity bridge: in the first 120 words, visibly connect from the previous chapter's final beat. Carry forward one unresolved element (object, accusation, emotional pressure, or immediate physical action) from: "The last of the guests drifted to the periphery of the room, their voices hushed and urgent. Eleanor lingered by the table, letting her gaze settle once more on Dr. Mallory Finch and the glass that had become the center...".
  - CLUE OBLIGATIONS — each clue below MUST be dramatized, but in YOUR OWN WORDS:
    Render each as something a character SEES, DOES, or SAYS on the page. The bracketed text is a
    DESCRIPTION of the evidence for you — do NOT transcribe it as narration. Copying a clue's
    description sentence verbatim into the prose FAILS validation.
    • witnesses, recall, exact, moment, finch, drank, glass [clue_culprit_direct_beatrice_quill] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      ⛔ SPOILER EMBARGO (pre-reveal chapter): surface ONLY the surface anomaly a character can see/hear/find.
         Do NOT name who it implicates, state the tamper direction or magnitude, or explain the mechanism in this chapter.
         Present it as an unexplained discrepancy; the culprit and method are revealed later.
         Place this OBSERVATION in paragraph 1 or 2 (observation only — no inference about the culprit).
    • drink, shows, signs, foreign, substance, indicate, tampering [clue_fp_contradiction_step_1] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: suggests, poison, ingested, moment, linking, drink, directly, death
      ↳ MANDATORY TWO-PARAGRAPH STRUCTURE (must appear in paragraphs 1 or 2 — no later):
         Paragraph 1: The POV character physically approaches or directly observes this evidence.
           The narration or dialogue explicitly states what is seen (use the exact locked phrase if one applies).
         Paragraph 2 (immediately following): The detective or POV character explicitly reasons
           about what this evidence implies — who it implicates, why it may be unreliable,
           or what inference it supports. This must be a separate full paragraph, not a sentence appended to Paragraph 1.
    • drink, shows, signs, foreign, substance, indicate, tampering [clue_fp_contradiction_step_2] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: sediment, matches, composition, delayed, action, tablet, indicating, ingested
      ↳ MANDATORY TWO-PARAGRAPH STRUCTURE (must appear in paragraphs 1 or 2 — no later):
         Paragraph 1: The POV character physically approaches or directly observes this evidence.
           The narration or dialogue explicitly states what is seen (use the exact locked phrase if one applies).
         Paragraph 2 (immediately following): The detective or POV character explicitly reasons
           about what this evidence implies — who it implicates, why it may be unreliable,
           or what inference it supports. This must be a separate full paragraph, not a sentence appended to Paragraph 1.
    • drink, shows, signs, foreign, substance, indicate, tampering [clue_id_3] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: method, poisoning, used, finch
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
  - ALIBI LOCK: Beatrice Quill's established alibi is "evening of the crime". Do NOT place Beatrice Quill at any other location or in any other activity during the crime window. Any contradiction is a continuity error that triggers a retry.
  - TESTIMONY CONTINUITY: Beatrice Quill has already made statements in earlier chapters. Any time, location, or claim attributed to Beatrice Quill in THIS chapter must be consistent with those earlier statements. Do NOT introduce a new or different alibi claim — any contradiction is a continuity error.
- Locked fact phrase obligations:
  - If this batch mentions The tablet takes thirty minutes to dissolve and release the poison., write exactly: "thirty minutes".
  - If this batch mentions The victim consumed the drink at ten minutes past nine., write exactly: "ten minutes past nine".
  - If this batch mentions The victim was scheduled to meet their betrayer at a quarter to ten., write exactly: "a quarter to ten".
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
Batch chapters: 3-3.
Investigation state at start: 3 clue(s) revealed to reader; approximately 3 unresolved suspect(s).
Must change by end: Reframe prior clue meaning and update suspect implications.
Suspect pressure target(s): Captain Ivor Hale, Beatrice Quill, Hugo Vane, Sylvia Trent
Required new information: Earlier clue gets revised meaning with explicit theory update.
Forbidden reveals at this stage: Do not introduce decisive new evidence from nowhere.

FROZEN FACT STATE (DO NOT ALTER):
- Timeline anchor: July (summer).
- Month, season, weather, and time-of-year language in this batch must stay compatible with summer.
- Established timeline fact: charity event starts
- Established timeline fact: Dr. Finch's death
- If referenced, use exact phrase: "thirty minutes" (The tablet takes thirty minutes to dissolve and release the poison.).
- If referenced, use exact phrase: "ten minutes past nine" (The victim consumed the drink at ten minutes past nine.).
- If referenced, use exact phrase: "a quarter to ten" (The victim was scheduled to meet their betrayer at a quarter to ten.).

STORY TO DATE (REFERENCE ONLY — DO NOT COPY VERBATIM):
- Full prior chapter text is provided below for continuity, factual consistency, and reference accuracy.
- Use this to keep character voice, chronology, clue state, and location continuity aligned with earlier chapters.
- Do not quote, copy, or paraphrase these paragraphs too closely; write fresh prose that remains consistent with them.

--- BEGIN PRIOR CHAPTER 1 ---
Title: Chapter 1: The Glass in Her Hand
A sharp crack of thunder rattled the stained glass panes as Eleanor Voss strode into the grand dining room of the seaside hotel, the lingering scent of last night’s rain mingling with the aroma of stale coffee and polished wood. The morning light, pale and uncertain, filtered through the geometric Art Deco windows, casting angular shadows across the parquet floor. There, sprawled beneath the glimmer of a crystal chandelier, lay the lifeless body of Dr. Mallory Finch. Her tea-length dress, once immaculate, was now rumpled, and her hand, still clutching a half-drained glass, trembled faintly in the draught from an open window. The silence that followed Eleanor’s entrance was not the hush of reverence, but the brittle quiet of disbelief.

Eleanor knelt, her gloved fingers brushing the smooth marble as she steadied herself beside Dr. Mallory Finch. The glass in Finch’s hand caught the morning light, revealing a cloudy residue swirling at the bottom—an odd, chalky sediment that clung stubbornly to the crystal. The scent was wrong: beneath the sharp tang of spirits, something medicinal lingered, acrid and unfamiliar. Eleanor’s gaze narrowed. A drink left unfinished, with a foreign substance visible to the naked eye—this was no accident, nor the simple end of an evening’s excess.

She rose, her mind already assembling the tableau: Dr. Mallory Finch, respected and envied in equal measure, dead with a glass in her hand and a mystery at her lips. Eleanor’s thoughts flickered to the night before, to the charity event that had drawn Brighton’s finest to this seaside haven, and to the uneasy undercurrents that had run beneath the laughter and toasts. The presence of that residue suggested deliberate tampering—perhaps a tablet, dissolved slowly, releasing its contents over time. The implication was chilling: someone had meant for this to happen, and had chosen their moment with care.

A murmur rippled through the room as Captain Ivor Hale stepped forward, his uniform immaculate despite the strain etched into his features. He stood with the rigid posture of a man accustomed to command, yet his hand trembled as he adjusted his watch chain. "War is hell, but family can be worse," he muttered, not quite to himself, eyes fixed on Dr. Mallory Finch’s still form. Eleanor noted the way his gaze lingered on the glass—too long for mere curiosity, not long enough for genuine grief. The connection between Captain Ivor Hale and Dr. Mallory Finch was well known: she had been his physician, confidante, and, some whispered, his only true friend in this fractured household.

Beatrice Quill hovered near the entrance, her crisp uniform and sensible shoes at odds with the anxiety flickering in her eyes. As the hotel’s receptionist, she was used to the ebb and flow of guests, the endless demands and petty complaints, but this was beyond her experience. She twisted a strand of hair behind her ear, voice brittle as she addressed Eleanor. "I—I just came in to set the breakfast tables. I didn’t touch anything, I swear. Ah, the glamorous life of the rich—so hard to bear, really." The sarcasm rang hollow, and Eleanor caught the way Beatrice’s gaze darted from the glass to the gathering crowd, as if searching for an escape.

Sylvia Trent, draped in a tailored suit and pearls that caught the faint lamplight, swept into the room with the composure of someone accustomed to crisis. Her voice, cool and measured, cut through the murmurs. "Wealth may not buy happiness, but it certainly makes the misery more comfortable. I trust someone will see to it that the authorities are notified?" Yet her fingers, adorned with rings, clutched her handbag with unnecessary force. Sylvia’s connection to Dr. Mallory Finch was complicated—part benefactor, part rival, always watchful for any shift in fortune.

Hugo Vane, the journalist whose presence at the hotel was as much a source of gossip as his columns, lingered at the edge of the group. His notebook, half-concealed in his jacket, betrayed his professional instincts. "The truth is a slippery fish, isn’t it?" he remarked, voice low, eyes flicking from Eleanor to the glass in Dr. Mallory Finch’s hand. Hugo’s reputation for sniffing out scandal was well earned, but Eleanor suspected his interest here was more than professional. He watched the others with a predator’s patience, waiting for the first crack in their composure.

The storm outside had abated, leaving behind a damp chill that seeped into the bones. The guests, drawn by curiosity or dread, clustered in uneasy knots, their voices hushed and urgent. Eleanor straightened, feeling the weight of expectation settle on her shoulders. She was not the police, but in the absence of official authority, the room turned to her. She cleared her throat, her tone calm but edged with resolve. "I’ll need everyone to remain here until we understand what’s happened. Dr. Finch deserves at least that much respect."

As Eleanor surveyed the room, her mind catalogued the details: the glass with its residue, the unnatural stillness of Dr. Mallory Finch, the expressions—shock, fear, calculation—etched onto the faces around her. The war had taught them all to expect loss, but not like this, not within these walls. The elegant dining room, with its gleaming crystal and linen, had become a stage for tragedy. Outside, the sound of distant waves was barely audible above the tense silence.

The first questions pressed in: Who had been with Dr. Mallory Finch last? Who had access to her drink? The residue in the glass was not easily dismissed. It spoke of premeditation, of a method chosen for its subtlety—a tablet, perhaps, designed to dissolve over time, releasing its poison only when the moment was right. The phrase "thirty minutes" flickered unbidden through Eleanor’s thoughts, though she could not yet say why. She resolved to examine the timeline of the previous night, to trace the movement of every guest and every glass. There would be answers, but not yet.

A shaft of sunlight broke through the clouds, illuminating the scene with a clarity that felt almost cruel. Eleanor’s gaze returned to Dr. Mallory Finch, to the glass, to the residue that marked the boundary between accident and intent. She felt the eyes of the room upon her, waiting for her to name the shape of their fear. The investigation had begun, and with it, the unraveling of every secret the seaside hotel had tried to keep hidden.
--- END PRIOR CHAPTER 1 ---

--- BEGIN PRIOR CHAPTER 2 ---
Title: Chapter 2: Initial Confusion
"It’s not as though she was alone," Hugo Vane remarked, his voice cutting through the uneasy hush that lingered in the grand dining room of the seaside hotel. A faint echo clung to the high, gilded ceiling, and the air was still thick with the scent of damp linen from last night’s rain. Sunlight filtered through the tall windows, its glow blunted by the grey morning, illuminating Dr. Mallory Finch’s body slumped beside the long table. The half-full glass—its contents now clouded by a chalky sediment—rested in her pale hand, a silent challenge to those gathered.

Eleanor let her gaze drift over the glass and the residue swirling at its bottom, her senses sharpened by the uneasy atmosphere. She could hear the soft clatter of teacups from the sideboard and the low murmur of anxious voices. Several guests crowded near, their faces drawn and voices clipped. "I saw Dr. Finch take a sip just before she collapsed," Beatrice Quill insisted, her tone brittle. Captain Ivor Hale, arms folded and jaw tense, gave a curt nod. "Yes, it was right after she raised her glass. We were all there." But across the table, Sylvia Trent shook her head, pearls trembling against her collar. "No, she was alone for a moment. I distinctly remember. Everyone else had already turned away." The contradiction hung in the air, as tangible as the unfamiliar smell rising from the glass.

The accounts clashed, and Eleanor felt the weight of uncertainty settle around her. If Dr. Finch had drunk in company, any number of hands could have tampered with her drink. If alone, the circle of suspicion narrowed. The residue in the glass—so starkly visible—suggested something foreign had been added, an act of intent rather than chance. Yet the guests’ memories, clouded by shock or self-preservation, offered no consensus. Eleanor could not ignore the way Beatrice’s gaze kept flitting to the glass, then to the door, as if she hoped to vanish before more questions arose.

A sudden gust rattled the windows, and the flicker of candlelight across the polished wood lent the room an uneasy, almost funereal, pallor. Eleanor stepped back, letting her thoughts collect. The glass was more than a grim prop—it was a puzzle. The residue, so visible, might have dissolved slowly or been left by careless mixing, but she had no way to know which yet. She noted the way the liquid’s surface caught the light, a thin film glimmering atop the cloudy swirl. The very sight of it seemed to deepen the silence in the room.

Captain Ivor Hale broke the spell with a gruff, “This is all damned irregular. Finch was careful about her drinks. Never touched a drop unless she poured it herself.” His fingers drummed a restless pattern on the back of a velvet chair. Eleanor observed the twitch of muscle in his jaw, the effort it took for him to maintain composure. His voice, though steady, was edged with something raw—a mixture of anger and something more brittle. The old wounds between family and friend, perhaps, newly exposed by tragedy.

Sylvia Trent’s polished exterior did little to hide her impatience. “It’s hardly productive to dwell on what we did or didn’t see. The authorities will sort it out in due course. I, for one, have no intention of being detained here all morning." Yet her hand remained fixed to her handbag, knuckles blanching with each word. Eleanor saw the flicker of calculation in her eyes; the need to project control, even as the situation slipped inexorably beyond her reach.

From the far end of the table, Hugo Vane watched the proceedings with the detached interest of a man accustomed to the worst of human behavior. He scribbled notes in his battered book, his gaze darting between the glass and each speaker in turn. “So many stories, so little truth,” he murmured. “The truth is a slippery fish, isn’t it?” His words drew a glare from Beatrice, who seemed to shrink into herself for a moment before straightening, chin high.

Eleanor turned to Beatrice, her tone gentle but insistent. “You were here when Dr. Finch fell?” Beatrice’s lips pressed into a thin line. “I was setting the sideboard—heard her cough, turned, and she was already…” She trailed off, glancing toward the residue in the glass. “It’s not right. She always asked for fresh lemon, never left her drinks like that.” The bitterness in her voice bordered on accusation, though whether aimed at herself or another, Eleanor could not yet tell.

The conflicting statements sharpened Eleanor’s focus. The witnesses all agreed on the glass—its presence, the odd residue, the moment of collapse—but the specifics blurred at the edges. She realized that the significance of Dr. Finch drinking at “ten minutes past nine,” as some recalled, could not be separated from who had been present and when. The timeline, once clear, was now a tangle of partial memories and self-serving omissions.

A hush fell as Eleanor carefully lifted the glass, turning it in her gloved hand. The sediment clung stubbornly to the bottom, refusing to dissolve, as if taunting her with its opacity. The scent, sharp and medicinal, mingled with the remnants of spirits. She set the glass down, her mind returning again to the contradiction between recollection and reality. If the residue pointed to tampering, it also raised the possibility that someone in this very room had engineered the moment with chilling precision.

Over the next hour, the atmosphere in the grand dining room of the seaside hotel grew more fractious, the air punctuated by sharp exchanges and uneasy silences. The storm outside had given way to a pale, humid sunlight, but inside, tension gathered like mist. Eleanor moved among the guests, listening for the slip of truth between their practiced phrases, seeking the pattern in their discord. Each interview, each contradiction, sent her thoughts spiraling toward darker possibilities.

As the morning wore on, Eleanor found herself drawn repeatedly back to the half-full glass and the stubborn sediment at its base. It was at once the most obvious and the most elusive clue. The guests’ shifting stories had changed its meaning: what had seemed an accident of circumstance now felt deliberate, the residue a silent accusation. Eleanor understood that the glass was both evidence and metaphor—a vessel for secrets, its contents clouded, its surface deceptively clear.

Eleanor Voss pressed on to the next concrete detail. The record now held: Witnesses report finch seen taking drink; Slowly dissolving tablet placed finch drink.

Those details shifted the reasoning. Weighed against the rest, Witnesses report finch seen taking drink bent the trail toward Timing finch poisoning. Weighed against the rest, Slowly dissolving tablet placed finch drink bent the trail toward Method poisoning used finch.

The last of the guests drifted to the periphery of the room, their voices hushed and urgent. Eleanor lingered by the table, letting her gaze settle once more on Dr. Mallory Finch and the glass that had become the center of this gathering storm. She did not yet know the mechanism, nor the motive, but she felt the shape of the puzzle pressing in. The contradictions, the residue, the fear etched on each face—these were her palette now, and she would have to paint her way toward the truth.
--- END PRIOR CHAPTER 2 ---

[SCENE COMPLETENESS CONTRACTS — MANDATORY. Each contract below lists what you MUST enact in that chapter. Do not summarise or mention these labels in the prose — enact them organically.]
Chapter 3 (Act 1) completeness contract:
  PIVOT ELEMENT (MANDATORY — write this into the prose, shown not told): "Beatrice Quill's fidgeting hands as she tries to avoid eye contact."
  FACT ESTABLISHED (MANDATORY — reader must know this by chapter end): "Establishes Beatrice Quill's suspicious behavior and proximity to the victim at the time of death."

# Case Overview
Title: The Delayed Signal
Era: 1940s
Setting: A seaside hotel featuring Art Deco architecture
Crime: murder (delayed-action poisoning)
Culprit: Beatrice Quill
Victim: Dr. Mallory Finch
False assumption: Dr. Finch was poisoned during the charity event by an unknown intruder.
Cast: Eleanor Voss (she/her), Dr. Mallory Finch (she/her), Captain Ivor Hale (he/him), Beatrice Quill (she/her), Sylvia Trent (she/her), Hugo Vane (he/him)

Setting Lock: Keep all scenes and descriptions consistent with the stated setting (A seaside hotel featuring Art Deco architecture). Do not introduce a different location type. Do not invent an alternative estate name. The only permitted name for this property is "A seaside hotel featuring Art Deco architecture" — any other estate name (e.g., "Caldwell Manor", "Ashwood Hall", or any invented proper name) is a continuity error that will be caught and rejected.

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
    "title": "Suspect Identification",
    "setting": {
      "location": "the grand dining room of the seaside hotel",
      "timeOfDay": "Morning after the murder",
      "atmosphere": "Heightened tension as suspicion grows"
    },
    "characters": [
      "Eleanor Voss",
      "Captain Ivor Hale",
      "Beatrice Quill",
      "Hugo Vane",
      "Sylvia Trent"
    ],
    "purpose": "Identify suspects and establish contradictions",
    "cluesRevealed": [
      "clue_culprit_direct_beatrice_quill",
      "clue_fp_contradiction_step_1",
      "clue_fp_contradiction_step_2"
    ],
    "dramaticElements": {
      "conflict": "Accusations fly as guests defend themselves",
      "tension": "Eleanor senses a pattern of lies among the guests",
      "microMomentBeats": [
        "Eleanor's heart races as Beatrice fidgets nervously under scrutiny."
      ]
    },
    "summary": "Eleanor begins piecing together the events leading to Dr. Finch's death. Beatrice Quill stands out among the suspects, as witnesses recall her proximity to Finch just before he collapsed. Eleanor notes the discrepancies in the stories being told, heightening her suspicion.",
    "beat": "first_enquiries",
    "estimatedWordCount": 1250,
    "pivotElement": "Beatrice Quill's fidgeting hands as she tries to avoid eye contact.",
    "factEstablished": "Establishes Beatrice Quill's suspicious behavior and proximity to the victim at the time of death.",
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
        "characterName": "Captain Ivor Hale",
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
    "emotionalRegister": "Tension rises as the investigation begins, with conflicting alibis creating unease.",
    "dominantCharacterNote": {
      "name": "Eleanor Voss",
      "voiceRegister": "Eleanor speaks with an articulate tone, often peppering her dialogue with art references."
    },
    "humourGuidance": {
      "permission": "forbidden"
    },
    "eraTextureNote": "Limited transportation due to fuel rationing; Increased security checks and surveillance; Restricted access to certain goods and services",
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
□ Chapter 3: the clue [clue_culprit_direct_beatrice_quill] (direct, ties, beatrice, quill, mechanism, access, point, before, discriminating, excludes, competing, suspect) is placed in the first 25% of the chapter, dramatized in your own words, followed by an explicit inference or suspicion paragraph.
□ Chapter 3: the clue [clue_fp_contradiction_step_1] (witnesses, report, finch, seen, taking, drink, shortly, before, collapsing) is placed in the first 25% of the chapter, dramatized in your own words, followed by an explicit inference or suspicion paragraph.
□ Chapter 3: the clue [clue_fp_contradiction_step_2] (drink, half, full, unusual, sediment, bottom) is placed in the first 25% of the chapter, dramatized in your own words, followed by an explicit inference or suspicion paragraph.
□ Chapter 3: the clue [clue_id_3] (slowly, dissolving, tablet, placed, finch, drink, releasing, poison, certain, time) is placed in the first 25% of the chapter, dramatized in your own words, followed by an explicit inference or suspicion paragraph.
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
