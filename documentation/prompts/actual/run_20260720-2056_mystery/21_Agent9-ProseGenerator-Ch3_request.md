# Actual Prompt Record

- Run ID: `mystery-1784580961906`
- Project ID: ``
- Timestamp: `2026-07-20T21:02:31.183Z`
- Agent: `Agent9-ProseGenerator-Ch3`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4.1`
- Temperature: `0.42`
- Max Tokens: `4500`
- Attempt: `first`
- Prompt Hash: `bea16ecb38499d5a`

## Message 1 (role=system)

```text
NARRATIVE VOICE: Hugo Vane[HE] is the viewpoint character. Unanchored “she/her” or “he/him” without a nearby name refers to Hugo Vane. Default narrator pronoun: HE. Never default to “he/his” as the neutral narrator voice unless the POV character is male.

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
- MORAL COMPLEXITY REQUIREMENT: The mechanism of this crime carries a moral gray area: "The murderer acted out of a misguided sense of revenge against the victim, leading to a moral quandary about justifiable actions." — the culprit reveal and denouement MUST acknowledge this ambiguity. Do not let the ending feel clean or simple. Give the reader at least one moment of uncomfortable sympathy or moral doubt.

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
   - Eleanor Voss: Business Proprietor
   - Dr. Mallory Finch: Healer
   - Captain Ivor Hale: Authority Figure
   - Beatrice Quill: Young Idealist
   - Sylvia Trent: victim (DECEASED — does not appear in any scene, past tense only)
   - Hugo Vane: Creative
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

## Era: April 1940
Living in April 1940 means navigating the uncertainties of early spring, where overcast skies often bring intermittent rain showers. The backdrop of World War II looms large, with news of Germany's military advances creating a palpable tension among citizens. Daily life is punctuated by rationing, affecting everything from food to clothing, as communities come together in shared struggles. The scent of salt from the sea mingles with the aromas of freshly baked bread and damp earth, while the sounds of radios crackle with updates from the war front. As people gather in places like The Oceanic Retreat, the nostalgia for a peaceful past clashes with the harsh realities of the present, creating an emotional landscape ripe for intrigue.
Emotional register: A collective state of anxiety and resilience, as citizens grapple with the realities of war while clinging to hope for a brighter future.
Physical constraints: Rationing limits the availability of food and resources | Travel restrictions due to wartime regulations | Communication is often limited to radio broadcasts and printed news | Social gatherings are marked by a sense of formality and etiquette
Current tensions (weave into background texture): Germany's invasion of Denmark and Norway | The looming threat of air raids as The Blitz begins | Rationing affecting food and clothing supplies
Wartime context — Many men are enlisted in military service, leaving women to fill roles traditionally held by them.: Women's roles in society are evolving, with increased visibility in the workforce and community activism. Absence effect: The absence of loved ones creates a profound sense of loss, yet fosters solidarity among those remaining.

## Season Lock (mandatory — derived from April 1940)
Season: spring. Allowed vocabulary: spring, vernal, springtime
Forbidden seasonal words — never use in narration, dialogue, or metaphor: summer, autumn, winter and their adjectival forms.
Every weather description, atmosphere, and time-of-year reference must be consistent with spring.

## Story Theme
A complex web of jealousy and rivalry leads to deadly consequences, revealing the fragility of social standing and the lengths one will go to protect their secrets.

## Story Emotional Register
Dominant: The story is characterized by a tense emotional landscape, filled with anxiety and the weight of hidden truths.

Arc:
The story opens with the charity gala at The Oceanic Retreat, where the atmosphere is thick with both the scent of sea air and the tension of recent wartime memories. As guests mingle, the sudden and shocking collapse of Sylvia Trent shatters the facade of civility, plunging the gathering into chaos. The initial shock transforms into rising unease as Detective Hugo Vane begins to investigate, unveiling a tangled web of jealousy and rivalry among the guests. Early clues suggest a motive rooted in financial desperation and personal betrayal, yet each lead seems to point away from the truth, leaving both the characters and the audience in a state of confusion and dread.

Midway through the investigation, a fateful revelation shifts the course of the inquiry, as Vane discovers the connection between the menu item served to Sylvia and the rare poison used, leading to a confrontation of past relationships among the suspects. This new understanding challenges the investigator's assumptions and forces him to reconsider the motives of those he thought he knew. A subsequent pivot reveals that the emotional stakes are higher than anyone anticipated, intertwining personal grudges and financial ruin into a deadly cocktail of ambition and envy.

As the pressure mounts, the climax unfolds with a dramatic confrontation, where allegiances are tested, and the truth about Sylvia’s demise is finally laid bare. The emotional fallout from the resolution leaves each character grappling with their choices, as the cost of their secrets becomes painfully clear. In the aftermath, the weight of guilt and loss permeates the air, echoing the complexities of their relationships and the fragility of their social standing in the shadow of war. Ultimately, the characters are left to reckon with the consequences of their actions, highlighting the emotional toll that secrecy and betrayal can exact on.

## Emotional register at this point in the story
As the investigation begins, unease grows amid early clues that suggest hidden motives.

## Character Portraits (appearance & era)

### Eleanor Voss
Eleanor Voss stands at the intersection of privilege and desperation, navigating the social upheaval of the 1940s while grappling with her family's financial troubles. Her polished exterior hides a deep fear of exposure, as the threat of losing her status looms large amidst the wartime turbulence. As women increasingly step into roles traditionally held by men, Eleanor's struggles with financial dependency become even more pronounced, compelling her to protect her family's legacy at all costs.
Era intersection: Eleanor's private battle with financial ruin is exacerbated by the economic strain of wartime rationing, highlighting the fragility of her social standing.

### Dr. Mallory Finch
Dr. Mallory Finch embodies the conflicting emotions of a woman caught between her professional aspirations and a tumultuous past. As a physician, she faces the pressures of maintaining her reputation in a time when women are just beginning to carve out their roles in the workforce. The shadow of her past relationship with Sylvia complicates her professional life, reflecting the societal shifts that force women to navigate personal and professional landscapes with caution.
Era intersection: Mallory's struggle for autonomy in her career mirrors the broader societal changes, as women increasingly seek to assert themselves in male-dominated fields during wartime.

### Captain Ivor Hale
Captain Ivor Hale grapples with his wartime past, haunted by guilt and the fear of exposure. As a retired naval officer, he represents the traditional masculine ideals of leadership and honor, yet his secrets threaten to unravel the life he has built since the war. The societal expectations placed on men during this era create a pressure cooker for Ivor, as he navigates the complexities of maintaining his reputation in a changing world.
Era intersection: Ivor's internal conflict reflects the broader emotional turmoil of men returning from war, grappling with their identities as they seek to reintegrate into society.

### Beatrice Quill
Beatrice Quill represents the hopes and frustrations of a generation yearning for opportunity. As a waitress, she embodies the working-class struggle, feeling trapped in her circumstances while watching others thrive. The war's impact on social dynamics allows her to see glimpses of possibility, yet her envy toward Sylvia reveals the darker sides of aspiration in a time of upheaval. Beatrice's journey reflects the desire for change amidst the constraints of her social position.
Era intersection: Beatrice’s aspirations are shaped by the war's shifting dynamics, as women increasingly take on roles that challenge traditional expectations.

### Hugo Vane
Hugo Vane embodies the complexities of a writer navigating the darker aspects of human nature. As a detective and author, he finds himself drawn to the intricacies of human motives, striving to make sense of the chaos around him. The war influences his work, pushing him to explore themes of tragedy and resilience, while also questioning the morality of his fascination with suffering.
Era intersection: Hugo's literary pursuits mirror the societal challenges of the time, as writers grapple with the duality of creating art amidst the backdrop of war.

## Character Voices

### Eleanor Voss (she/her/her)
Eleanor's speech is smooth and polished, often punctuated with a hint of sarcasm that belies her true emotions.
[comfortable] Ah, the beauty of art is in its imperfections. Isn't that what we all strive for?
[evasive] Oh, I'm sure Sylvia meant well. We all have our secrets, don’t we?
[stressed] I simply can't let anyone find out about my financial troubles. It would ruin everything!
Humour: Eleanor's humour often carries a tone of polite savagery, making her observations both insightful and cutting.

### Dr. Mallory Finch (she/her/her)
Mallory speaks with a calm demeanor, her tone often laced with dry humor that masks her inner turmoil.
[comfortable] Well, that's just a matter of perspective, isn't it?
[evasive] Sylvia's intentions were... complicated. I didn't think she'd go that far.
[stressed] If only I could have stopped her from revealing our past... it would have saved us both.
Humour: Mallory's dry wit adds depth to her character, often reflecting her complicated emotions.

### Captain Ivor Hale (he/him/his)
Ivor's voice carries a commanding tone, often infused with nautical metaphors that highlight his past.
[comfortable] In the heat of battle, one must always steer true, wouldn't you agree?
[evasive] Oh, I assure you, my past is just that—past. I prefer to keep the waters calm.
[stressed] I can't let my past actions surface. It would destroy everything I've built!
Humour: Ivor's observational humour often reflects his experiences, providing insight into his character.

### Beatrice Quill (she/her/her)
Beatrice's tone is lively and animated, often tinged with a hint of sarcasm.
[comfortable] Ain't life just a grand performance? I just want my moment on stage!
[evasive] Oh, I don't know what you're talking about. Sylvia and I were just... friends.
[stressed] I can't keep watching her live this glamorous life while I'm stuck here!
Humour: Beatrice's sardonic humour often reveals her frustrations and aspirations.

### Hugo Vane (he/him/his)
Hugo's speech is characterized by sharp wit and irony, reflecting his keen observations of human nature.
[comfortable] Ah, but the plot thickens, doesn't it? Life is but a series of twists.
[evasive] I wouldn't want to draw conclusions too quickly. The truth is often elusive.
[stressed] This case is more than just a story for me; it's a reflection of my own fears.
Humour: Hugo's dry wit provides a layer of complexity to his character as he navigates the unfolding mystery.

## Location Registers (scene framing guides)

Grand Lobby: The Grand Lobby feels like the heart of The Oceanic Retreat, buzzing with muted conversations and the distant sound of waves crashing against the shore. Guests exchange nervous glances, their laughter tinged with an undercurrent of tension as secrets linger in the air. The atmosphere is both inviting and foreboding, encapsulating the duality of social interaction during uncertain times.. Camera angle: As a writer enters, the emotional stance should reflect curiosity intermingled with caution, as if every word spoken carries weight.. Era: The war has shifted social dynamics, creating a space where tension is palpable amidst the elegance.

Dining Area: The Dining Area is a tableau of elegance, yet an undercurrent of unease permeates the room. The clinking of silverware and soft music create an inviting atmosphere, but the weight of unspoken truths hangs heavily in the air. Guests engage in hushed conversations, their laughter feeling strained as they navigate the tension of the evening, where every bite could reveal a secret or a betrayal.. Camera angle: Entering this space, the writer should capture the contrast between the beauty of the setting and the tension of the interactions.. Era: The war influences the menu, with rationing affecting the quality and availability of ingredients.

Ocean View Rooms: The Ocean View Rooms offer a deceptive sense of serenity, with the sound of waves crashing outside providing a false sense of calm. Within these walls, however, the weight of secrets and unfulfilled desires looms large. The vintage furnishings and soft textiles create an inviting atmosphere, yet the shadows lurking in corners suggest that all is not well in this tranquil retreat, making it a fitting stage for hidden truths.. Camera angle: As a writer enters, the emotional stance should be reflective, capturing the tension between the idyllic view and the darkness within.. Era: The war has altered the perception of safety, transforming these rooms into potential hiding places for both secrets and fears.

Staff Area: The Staff Area buzzes with a frenetic energy, filled with the scents of cooking and the sounds of chatter among the staff. It is a space of camaraderie and urgency, where the realities of service clash with the darker undercurrents of the hotel. The narrow corridor, cluttered with supplies, reflects the chaos of maintaining order amidst the tension that permeates the hotel, making it a hub of both activity and secrecy.. Camera angle: Entering this space, the writer should emphasize the contrast between the bustling activity and the hidden tensions that lie beneath.. Era: The pressures of wartime service intensify the workload for staff, creating an atmosphere charged with urgency.

## Humour guidance for this story position (early)
Permission: forbidden
Rationale: The seriousness of the investigation requires a focus on tension, leaving no room for humor.

## Reveal Groundwork (texture — do not explain, only plant)
- Plant one subtle observable beat related to: "The moment when Sylvia expresses her delight over the special dish the investigation, revealing her naivete about the true danger she faced". Do not explain significance yet.
- Plant one subtle observable beat related to: "Additionally, the interactions among the suspects at the gala, filled with veiled tensions, are now seen as more than mere social niceties, reflecting deeper motives". Do not explain significance yet.
- Plant one subtle observable beat related to: "Lastly, the tension-filled conversations in the staff area indicate the hidden knowledge that could unravel the truth, emphasizing the complexity of human relationships under pressure". Do not explain significance yet.

FAIR-PLAY AND INFERENCE CONTRACT:
- FAIR PLAY CLUE TIMING: Never combine clue discovery and detective deduction in the same chapter. If a clue is first revealed to the reader in chapter N, the detective may only analyze, deduce from, or act on that clue in chapter N+1 or later.
- FAIR PLAY INFORMATION PARITY: The reader must see all clues BEFORE the detective uses them in reasoning. If the detective performs a test or makes a deduction, every piece of evidence supporting that conclusion must have been shown to the reader in earlier chapters.
- FAIR PLAY REVELATION SPACING: In the discriminating test scene, the detective can ONLY use clues that were revealed to the reader at least 1 full chapter earlier. Never introduce new clues or withheld information during the test.
- FAIR PLAY CONFRONTATION: During the final confrontation/revelation, the detective cannot surprise the reader with facts. Every piece of evidence cited must have been visible to the reader in prior chapters.
- Never solve by withheld information. Keep reader-information parity with detective reasoning.
- False assumption in force: Sylvia died due to her existing health issues.
- Hidden truth to progressively expose (compose in your own words from these elements): true, cause, poison, undetectable
- Inference path checkpoints to dramatize clearly — compose ENTIRELY in your own sentences from these key terms (reproducing any briefing phrase verbatim FAILS validation):
  - Step 1: obs: menu, gala, lists, dish, containing, rare, poison, lemon, sauce | corr: indicates, potential, toxic, reaction, consumed, together | effect: narrows, investigation, dish, served, sylvia
  - Step 2: obs: witnesses, report, sylvia, expressing, delight, dish, before, death | corr: suggests, consumed, willingly, unaware, danger | effect: eliminates, idea, coerced, eating
  - Step 3: obs: mallory, finch, access, kitchen, medical, supplies | corr: indicates, acquired, poison, administered, detection | effect: narrows, culpability, mallory, finch
- Discriminating test method: trap
- Discriminating test elements to dramatize (compose ENTIRELY in your own sentences from these — do NOT reproduce any briefing phrase verbatim): discriminating, compares, reaction, contain, poison, claimed, timeline
- Test must rely on already-shown clue IDs: clue_1, clue_6, clue_mechanism_visibility_core, clue_early_1
- Fair-play rationale: Step 1: The menu (early) and witness statements (mid) reveal the toxic dish. Step 2: Sylvia's delight (mid) clarifies she was unaware of the danger, eliminating coercion. Step 3: Dr. Finch's access (early) leads to her as the prime suspect.

## Character Reference

### Eleanor Voss (she/her — NEVER he/him)
Eleanor speaks with a smooth, polished cadence, often punctuating her sentences with a slight laugh
She has a habit of using art jargon, which can make her sound pretentious, but her charm usually softens the blow.
Eleanor grapples with guilt over her family's legacy and fears that their secrets will not only ruin her but also tarnish the memory of those who came before her.
Voice colour: Eleanor Voss uses polite savagery humour — let it surface in their dialogue where natural, not in every line.

### Dr. Mallory Finch (she/her — NEVER he/him)
Mallory speaks with a calm, measured tone, often punctuating her observations with dry humor
She has a tendency to use medical jargon, which can make her sound clinical even in casual conversation.
Mallory is torn between her past feelings for Sylvia and the need to protect her career. She feels a profound sense of betrayal that clouds her judgment and complicates her emotions.
Voice colour: Dr. Mallory Finch uses dry wit humour — let it surface in their dialogue where natural, not in every line.

### Captain Ivor Hale (he/him — NEVER she/her)
Ivor speaks with a commanding tone, often punctuating his stories with dramatic pauses
He has a tendency to use nautical metaphors, adding flair to his storytelling.
Ivor is torn between his desire to protect his reputation and the guilt that gnaws at him, stemming from his wartime actions. He struggles with the moral implications of his past and its potential to destroy his present.
Voice colour: Captain Ivor Hale uses observational humour — let it surface in their dialogue where natural, not in every line.

### Beatrice Quill (she/her — NEVER he/him)
Beatrice speaks with a lively, animated tone, often punctuated by bursts of enthusiasm
She has a habit of flirting with sarcasm, especially when discussing her aspirations or the absurdities of her job.
Beatrice grapples with feelings of inadequacy and envy, torn between her aspirations and the reality of her circumstances. She struggles to find her own identity in the shadow of others.
Voice colour: Beatrice Quill uses sardonic humour — let it surface in their dialogue where natural, not in every line.

### Hugo Vane (he/him — NEVER she/her)
Hugo's speech is marked by a quick wit, often laced with irony
He has a tendency to make sharp observations about the human condition, using humor as a shield against the darkness he explores.
Hugo wrestles with the morality of his fascination with tragedy, questioning whether his pursuit of truth is a genuine quest for understanding or merely a means to fuel his creative endeavors.
Voice colour: Hugo Vane uses dry wit humour — let it surface in their dialogue where natural, not in every line.


## CHARACTER CONTRACTS (binding for this scene)
Each entry below constrains how this character must be written in this chapter.
These override generic style guidance when they conflict.

### Eleanor Voss[SHE]
Voice & mannerisms: Eleanor speaks with a smooth, polished cadence, often punctuating her sentences with a slight laugh. She has a habit of using art jargon, which can make her sound pretentious, but her charm usually softens the blow.
SIGNATURE TIC (use sparingly — this is Eleanor Voss's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "Ah, the beauty of art is in its imperfections."
Sample voice fragments (match this register and rhythm):
  [comfortable] "Ah, the beauty of art is in its imperfections. Isn't that what we all strive for?"
  [evasive] "Oh, I'm sure Sylvia meant well. We all have our secrets, don’t we?"
Humour: polite savagery — deploy occasionally (level 0.6)
FORBIDDEN phrase (never write for Eleanor Voss): "she felt a wave of unease"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "The victim, Sylvia, posed a significant threat to Eleanor's carefully curated life, threatening to expose a family secret that could unravel everything she has worked to maintain. The stakes are high, and Eleanor's desperation to secure her family's fortune is palpable." — do not surface in Act I.

### Dr. Mallory Finch[SHE]
Voice & mannerisms: Mallory speaks with a calm, measured tone, often punctuating her observations with dry humor. She has a tendency to use medical jargon, which can make her sound clinical even in casual conversation.
SIGNATURE TIC (use sparingly — this is Dr. Mallory Finch's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "Well, that's just a matter of perspective, isn't it?"
Sample voice fragments (match this register and rhythm):
  [comfortable] "Well, that's just a matter of perspective, isn't it?"
  [evasive] "Sylvia's intentions were... complicated. I didn't think she'd go that far."
Humour: dry wit — deploy occasionally (level 0.5)
FORBIDDEN phrase (never write for Dr. Mallory Finch): "a surge of determination washed over her"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Sylvia's intention to disclose their affair threatens Mallory's career and reputation, leaving her feeling cornered and resentful." — do not surface in Act I.

### Captain Ivor Hale[HE]
Voice & mannerisms: Ivor speaks with a commanding tone, often punctuating his stories with dramatic pauses. He has a tendency to use nautical metaphors, adding flair to his storytelling.
SIGNATURE TIC (use sparingly — this is Captain Ivor Hale's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "In the heat of battle, one must always steer true."
Sample voice fragments (match this register and rhythm):
  [comfortable] "In the heat of battle, one must always steer true, wouldn't you agree?"
  [evasive] "Oh, I assure you, my past is just that—past. I prefer to keep the waters calm."
Humour: observational — deploy occasionally (level 0.4)
FORBIDDEN phrase (never write for Captain Ivor Hale): "everyone could sense the atmosphere"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "He believes Sylvia possesses documents that could reveal his past misdeeds, threatening to destroy the reputation he has built since retirement." — do not surface in Act I.

### Beatrice Quill[SHE]
Voice & mannerisms: Beatrice speaks with a lively, animated tone, often punctuated by bursts of enthusiasm. She has a habit of flirting with sarcasm, especially when discussing her aspirations or the absurdities of her job.
SIGNATURE TIC (use sparingly — this is Beatrice Quill's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "Ain't life just a grand performance?"
Sample voice fragments (match this register and rhythm):
  [comfortable] "Ain't life just a grand performance? I just want my moment on stage!"
  [evasive] "Oh, I don't know what you're talking about. Sylvia and I were just... friends."
Humour: sardonic — deploy occasionally (level 0.5)
FORBIDDEN phrase (never write for Beatrice Quill): "palpable tension filled the room"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "She resented Sylvia for flaunting wealth and privilege, believing that her own family ties should have afforded her the same opportunities." — do not surface in Act I.

### Hugo Vane[HE]
Voice & mannerisms: Hugo's speech is marked by a quick wit, often laced with irony. He has a tendency to make sharp observations about the human condition, using humor as a shield against the darkness he explores.
SIGNATURE TIC (use sparingly — this is Hugo Vane's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "Ah, but the plot thickens, doesn't it?"
Sample voice fragments (match this register and rhythm):
  [comfortable] "Ah, but the plot thickens, doesn't it? Life is but a series of twists."
  [evasive] "I wouldn't want to draw conclusions too quickly. The truth is often elusive."
Humour: dry wit — deploy occasionally (level 0.5)
FORBIDDEN phrase (never write for Hugo Vane): "a surge of determination washed over her"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "His fascination with the darker aspects of human nature fuels his desire to uncover the truth, as he seeks to understand the motives behind the crime." — do not surface in Act I.



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

- Living in April 1940 means navigating the uncertainties of early spring, where overcast skies often bring intermittent rain showers
- The backdrop of World War II looms large, with news of Germany's military advances creating a palpable tension among citizens
- Daily life is punctuated by rationing, affecting everything from food to clothing, as communities come together in shared struggles
- The scent of salt from the sea mingles with the aromas of freshly baked bread and damp earth, while the sounds of radios crackle with updates from the war front
- As people gather in places like The Oceanic Retreat, the nostalgia for a peaceful past clashes with the harsh realities of the present, creating an emotional landscape ripe for intrigue.

TEMPORAL CONTEXT:

This story takes place in April 1940 during spring.

Seasonal Atmosphere:
- Weather patterns: overcast skies with intermittent rain showers, cool breezes from the coast, occasional bursts of sunshine breaking through clouds
- Daylight: Days are growing longer, with daylight extending until around 7:30 PM.
- Seasonal activities: Spring cleaning in households and hotels, Local flower shows featuring blooming daffodils and tulips, Weekend picnics in parks as the weather begins to warm
- Seasonal occasions: Easter Sunday: April 14, 1940
- Season: spring

Period Fashion (describe naturally):
- Men formal: double-breasted suits in navy or gray wool, white dress shirts with stiff collars, fedoras or snap-brim hats
- Men casual: tweed jackets with elbow patches, lightweight chinos or slacks, knit ties in bold patterns
- Men accessories: silk pocket squares, leather gloves, silver cufflinks
- Women formal: tea-length dresses with cinched waists and full skirts, blouses with puffed sleeves paired with tailored skirts, tailored suits in pastel colors for evening events
- Women casual: comfortable cardigans over floral blouses, ankle-length skirts with matching belts, simple cotton dresses for day wear
- Women accessories: berets or cloche hats, string pearls, leather handbags

Cultural Context (reference naturally):
- Music/entertainment: Glenn Miller's 'In the Mood', Bing Crosby's 'I'll Be Seeing You', The Andrews Sisters' 'Boogie Woogie Bugle Boy'; Films: The Great Dictator (released in 1940), The Grapes of Wrath (released in 1940); Theatre: The original Broadway production of 'Pal Joey', Revival of 'The Royal Family'; Radio: The Jack Benny Program, Fibber McGee and Molly
- Typical prices: Loaf of bread: four pence, Pint of milk: three pence, Cinema ticket: one shilling
- Current events: Germany invades Denmark and Norway as part of its expansion strategy; The Blitz begins to loom over Britain as air raids increase
- Literature: The Grapes of Wrath by John Steinbeck | The Maltese Falcon by Dashiell Hammett | For Whom the Bell Tolls by Ernest Hemingway | [Detective fiction and mystery novels] | [Political thrillers reflecting current events] | [Romantic fiction with strong female protagonists]
- Technology: Radar technology for detecting enemy aircraft | Advances in radio communication for military use | Development of early models of the television set | Radios in homes and public places for news broadcasts | Typewriters for business and personal use | Basic cameras for personal photography
- Daily life: Gathering for radio broadcasts of news updates, Participating in community fundraisers for war efforts, Attending local flower shows and exhibitions
- Social rituals: Afternoon tea as a social custom among women, Weekly church services bringing communities together

Atmospheric Details:
The scent of rain-soaked earth mingles with fresh blooms as spring continues to unfold. Laughter and the clinking of glasses echo from the hotel bar, yet a tension lurks in the air. The low hum of radios broadcasting news updates punctuates conversations, reminding everyone of the turmoil beyond the coastal town.

FASHION INTEGRATION TECHNIQUES:
- First appearance: Describe outfit to establish class/personality
- Accessories: Gloves, hats, pocket watches, jewelry reveal status
- Time-specific: Different outfits for diffe
[truncated for prompt budget]

NON-NEGOTIABLE CHAPTER OBLIGATIONS — LOCKED EVIDENCE VALUES (VERBATIM REQUIRED):
The following measured values (times, amounts, measurements) are absolute ground truth. Every time this chapter describes, mentions, or alludes to one — no matter how briefly — it MUST use the exact phrase shown below, character for character. NO paraphrase, approximation, rounding, or synonym is permitted.

FAILURE EXAMPLE: if the locked value is "at thirteen minutes to midnight" and you write "just before midnight" or "around midnight" — that is a HARD FAIL. You must write "at thirteen minutes to midnight". Equally, if the locked value is written in words, such as "ten minutes past eleven", and you convert it to figure-based clock notation — that is also a HARD FAIL. Words stay as words; figure forms are forbidden for word-phrased facts.

CRITICAL — WORD-PHRASED VALUES: If the canonical value is written out in words (e.g. a time like "ten minutes past eleven", or an amount like "forty minutes"), reproduce those exact words. DO NOT convert to figure-based time notation, twenty-four-hour format, or any other numeric shorthand. Correct: "ten minutes past eleven". WRONG: figure-based clock notation or numeric shorthand.

Locked values:
  - The exact amount of poison used in the dish.: "two ounces"
  - The time at which the victim was declared dead.: "ten minutes past nine"
    ⛔ FORBIDDEN alternatives: "9:10", "9.10", "nine ten", "nine-ten", "nine past ten", "quarter past nine", "half past nine" — the ONLY acceptable form is "ten minutes past nine"

If a value has no relevance to this chapter, omit it. But the moment you reference the underlying evidence, only the exact phrase above is acceptable.

EVIDENCE TO CONVEY IN YOUR OWN WORDS (NOT verbatim): weave each of these descriptive facts into the chapter as a COMPLETE, GRAMMATICAL observation by a character — surface the MEANING, never copy the phrasing word-for-word, and NEVER splice two evidence phrases together with an apostrophe or run two clauses together without a sentence break. If a fact has no relevance to this chapter, omit it.
  - The victim consumed this specific dish shortly before death.: the special crab dish

⛔ CLUES TO SURFACE IN THESE CHAPTERS — mandatory:
The following evidence MUST be clearly observable to an attentive reader. Do not bury it in atmosphere or passing dialogue. Each clue must be concrete, specific, and noticeable:

• [clue_1] indicates, potential, toxic, reaction, consumed, together
  Category: behavioral | Criticality: essential | Supports inference step 1
  Points to: dish, lethal, combined, lemon, sauce

• [clue_6] mechanism, relies, poison, contain, lemon, expose, false, timing
  Category: physical | Criticality: essential | Supports inference step 1
  Points to: dish, cause, death

• [clue_5] Direct observation
  Category: structural | Placement: early (Act 1)
  Points to: what this observation reveals about the time or circumstances of the crime.

• [clue_culprit_direct_dr_mallory_finch] Witness statement
  Category: structural | Placement: early (Act 1)
  Points to: what this observation reveals about the time or circumstances of the crime.

• [clue_early_1] Direct observation of the menu.
  Category: structural | Placement: early (Act 1)
  Points to: what this observation reveals about the time or circumstances of the crime.

• [clue_mid_1] Witness statements about Sylvia's delight.
  Category: structural | Placement: early (Act 1)
  Points to: what this observation reveals about the time or circumstances of the crime.

For each clue above: an attentive reader should be able to find, record, and later use it to reason toward the solution.

═══ NARRATIVE STATE (read-only — do not contradict) ═══

LOCKED FACTS — use verbatim whenever this evidence is described:
  • The victim consumed this specific dish shortly before death.: "the special crab dish"
  • The exact amount of poison used in the dish.: "two ounces"
  • The time at which the victim was declared dead.: "ten minutes past nine"

CHARACTER PRONOUNS — never deviate from these:
  • Eleanor Voss: she/her/her
  • Dr. Mallory Finch: she/her/her
  • Captain Ivor Hale: he/him/his
  • Beatrice Quill: she/her/her
  • Sylvia Trent: she/her/her
  • Hugo Vane: he/him/his

CLUES ALREADY REVEALED TO READER: clue_mechanism_visibility_core, clue_early_1, clue_mid_1, clue_core_contradiction_chain, clue_5 — do not reveal these as new information.

INVESTIGATION LOG — WHAT IS ESTABLISHED (do not re-establish, do not repeat):
• Evidence already established (reference only — do NOT restate or quote these; advance beyond them): dish, served, gala, contained, rare, poison | dish, lethal, combined, lemon, sauce | dish, cause, death | sylvia, consumed, dish, willingly, unaware, danger | sudden, death, suspicious
• Suspect cleared: Eleanor Voss[SHE] — Corroborated alibi with multiple witnesses.
• Suspect cleared: Captain Ivor Hale[HE] — His behavior was linked to past traumas, not the murder.
• Suspect cleared: Beatrice Quill[SHE] — Alibi confirmed: 8:00 PM to 9:30 PM
⚠ The story must move FORWARD from this log. Any beat already listed above is forbidden from repeating.

⚠ THIS CHAPTER'S REQUIRED ADVANCE (early): Interview each suspect — record their claimed whereabouts

CONTINUITY HANDOFF — previous chapter closing beat:
  • "Hugo paused, allowing the silence to settle. The investigation had only begun, yet the stakes were already clear. The guests, each grappling with their own secrets and anxieties, faced the prospect of scrutiny. Hugo’s role as investigator required him to balan..."
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
dining room, kitchen

✓ RULE: Continue using this location vocabulary. Maintain consistency with established setting type.
✓ Do NOT introduce new location types that contradict earlier chapters.

**Recent Chapter Summary (for narrative continuity):**
Chapter 1: Chapter 1: The Morning After
  Events: Eleanor Voss stood frozen beside Sylvia Trent, her eyes glazed with shock as she stared at the lifeless body.
Chapter 2: Chapter 2: Investigation Begins
  Events: Hugo weighed the testimony, noting the discrepancy.

⚠️ **VALIDATION:** Character name mismatches and setting drift are common failure modes.
Double-check every character name against the list above before using it.

**⏱ LOCKED TIME ANCHOR — use verbatim, do not paraphrase:**
Clock time (from the case ground truth): **"8:00 PM"**
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
Known location profile anchors: The Oceanic Retreat, Grand Lobby, Dining Area, Ocean View Rooms, Staff Area, the dining room of the seaside hotel
LOCATION NAME CAPITALISATION (HARD REQUIREMENT — validated):
All named locations in your prose MUST use the EXACT capitalisation from the CML profiles.
Canonical forms: "The Oceanic Retreat", "Grand Lobby", "Dining Area", "Ocean View Rooms", "Staff Area", "the dining room of the seaside hotel"
Writing a location in lowercase (e.g. "drawing room" instead of "Drawing Room") is a validated error. Every time you mention a named location, copy its capitalisation from the list above.
- Chapter 3: OPENING STYLE (HARD): Start the VERY FIRST SENTENCE with an explicit time marker — e.g. "That morning…" / "By the time dusk fell…" / "It was nearly four o'clock…" / "On the second day after the discovery…". Time must be in the first clause. Anchor opening in "the dining room of the seaside hotel". The opening style above governs only your FIRST SENTENCE; the grounding below may land anywhere in the first 2 paragraphs (it need not be sentence one, and never conflicts with the chosen opening style). HARD REQUIREMENT for the first 2 paragraphs: (a) include 2+ sensory words — choose from smell/scent/odor/fragrance/sound/echo/silence/whisper/creak/cold/warm/damp/rough/smooth/glow/shadow/flicker/dim — and (b) include 1+ atmosphere/time word — choose from rain/wind/fog/storm/mist/thunder/evening/morning/night/dawn/dusk/lighting/weather/season/afternoon/midday/noon/midnight/twilight/sunrise/sunset/daylight/sunlight/overcast/cloudy/bright/dark/grey/pale/chill/crisp/drizzle/haze/lamplight/firelight. These are validated requirements, not style suggestions; missing them triggers a retry.

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

PROMPT BUDGET SUMMARY: budget=24000 tokens; fixed=11898; context=12094; dropped=[humour_guide, location_profiles]; truncated=[location_profiles, temporal_context, pronoun_accuracy]

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
4. Integrate at least two concrete era-grounded details per chapter from setting refinement signals: ubiquitous radios | early television sets | basic radar systems | long-distance telephone calls | military encryption | telegrams.
5. Respect setting movement/access constraints in scene action and alibis: limited access to the beach during storms | restricted areas such as staff-only zones | narrow hallways reducing movement | staff-only areas | guest room privacy.
6. Sustain social coherence with this backdrop pressure: A gathering at a seaside hotel for a charity event draws together a diverse cast, each grappling with the societal shifts of post-war life and the personal stakes of their intertwined pasts.
7. Maintain continuity around these socially central cast anchors where relevant: Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill, Sylvia Trent, Hugo Vane.
8. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Critical: Plot similarity 0.85 with 'The Mysterious Affair at Styles' (same crime type and method)
9. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Moderate: Setting similarity 0.80 with 'The Mysterious Affair at Styles' (same era and hotel setting)
10. STORY TO DATE ANTI-COPY RULE: The STORY TO DATE section below is provided for chronological and factual reference ONLY. You MUST NOT copy, lightly rephrase, or structurally echo any sentence or paragraph from prior chapters. Every sentence in this chapter must be original prose unique to this scene. Reusing even a clause from prior chapter text will cause this attempt to fail immediately.

CRITICAL PROSE REQUIREMENTS:

The CML specifies exact requirements for certain validation-critical scenes. You MUST include these elements at the specified positions.

**Discriminating Test Scene (Act 3, Scene 4):**
Required elements: Execute the discriminating test, Observe the reactions of the guests, Draw conclusions about the dish's role in the murder
Test type: controlled dinner reenactment

**Suspect Clearance Scenes:**
- Eleanor Voss (Act 3, Scene 5): Corroborated alibi with multiple witnesses.
  Clues: clue_id_1, clue_id_2
- Captain Ivor Hale (Act 3, Scene 5): His behavior was linked to past traumas, not the murder.
  Clues: clue_id_3, clue_id_4
- Beatrice Quill (Act 3, Scene 5): Alibi confirmed: 8:00 PM to 9:30 PM

**Culprit Revelation Scene (Act 3, Scene 6):**
Method: Confrontation with evidence of the poison.

**Clue Placement for These Chapters:**
- clue_1 must appear in Act 1, Scene 3 via Cross-check contradiction
- clue_5 must appear in Act 1, Scene 3 via Direct observation
- clue_6 must appear in Act 1, Scene 3 via Direct observation
- clue_culprit_direct_dr_mallory_finch must appear in Act 1, Scene 3 via Witness statement
- clue_early_1 must appear in Act 1, Scene 3 via Direct observation of the menu.
- clue_mid_1 must appear in Act 1, Scene 3 via Witness statements about Sylvia's delight.

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
Investigation state at start: 5 clue(s) revealed to reader; approximately 0 unresolved suspect(s).
Must change by end: Reframe prior clue meaning and update suspect implications.
Suspect pressure target(s): Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill
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
- Chapter 3:
  - STRUCTURAL ARCHETYPE — Chapter 3 must be: EVIDENCE
      ✓ MUST contain: new physical clue discovered
      ✗ MUST NOT contain: formal accusation
  - Word count: Target 1250 words. Achieve this through plot events, dialogue exchanges, and physical investigation — not through atmospheric repetition or extended internal reflection. Each 200-word segment should contain at minimum one concrete story event (a discovery, a conversation exchange, a physical action or movement). Padding with atmosphere alone is not acceptable.
  - Opening: Begin with a character action, spoken line, or clock/time marker — never a location name or location-description phrase.
  - Scene is set in: the dining room of the seaside hotel — reference it naturally within the paragraph, never as your opening phrase.
  - Opening atmosphere (MANDATORY — validator enforced): the first paragraph MUST contain at least one of: rain / wind / fog / storm / mist / thunder / evening / morning / night / dawn / dusk / season / afternoon / midday / noon / midnight / twilight / sunrise / sunset / daylight / sunlight / overcast / cloudy / bright / dark / grey / pale / cold / warm / chill / crisp / damp / drizzle / haze / lamplight / firelight. A chapter that omits all of these from its opening paragraph will be rejected.
  - PARAGRAPH OPENER DIVERSITY (MANDATORY — validator enforced): No more than 2 paragraphs in this chapter may begin with "Hugo" or "Hugo's" as the first word. You must vary paragraph openings throughout: use sensory observations, another character's name or action, dialogue, object or sound details, or temporal markers. Opening 3 or more paragraphs with "Hugo" will cause automated rejection.
  - Continuity bridge: in the first 120 words, visibly connect from the previous chapter's final beat. Carry forward one unresolved element (object, accusation, emotional pressure, or immediate physical action) from: "Hugo paused, allowing the silence to settle. The investigation had only begun, yet the stakes were already clear. The guests, each grappling with their own secrets and anxieties, faced the prospect of scrutiny. Hugo’s ro...".
  - CLUE OBLIGATIONS — each clue below MUST be dramatized, but in YOUR OWN WORDS:
    Render each as something a character SEES, DOES, or SAYS on the page. The bracketed text is a
    DESCRIPTION of the evidence for you — do NOT transcribe it as narration. Copying a clue's
    description sentence verbatim into the prose FAILS validation.
    • menu, details, ingredients, dish [clue_1] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: dish, lethal, combined, lemon, sauce
      ↳ MANDATORY TWO-PARAGRAPH STRUCTURE (must appear in paragraphs 1 or 2 — no later):
         Paragraph 1: The POV character physically approaches or directly observes this evidence.
           The narration or dialogue explicitly states what is seen (use the exact locked phrase if one applies).
         Paragraph 2 (immediately following): The detective or POV character explicitly reasons
           about what this evidence implies — who it implicates, why it may be unreliable,
           or what inference it supports. This must be a separate full paragraph, not a sentence appended to Paragraph 1.
    • witnesses, recall, sylvia, condition, prior, meal [clue_5] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: sudden, death, suspicious
      ↳ MANDATORY TWO-PARAGRAPH STRUCTURE (must appear in paragraphs 1 or 2 — no later):
         Paragraph 1: The POV character physically approaches or directly observes this evidence.
           The narration or dialogue explicitly states what is seen (use the exact locked phrase if one applies).
         Paragraph 2 (immediately following): The detective or POV character explicitly reasons
           about what this evidence implies — who it implicates, why it may be unreliable,
           or what inference it supports. This must be a separate full paragraph, not a sentence appended to Paragraph 1.
    • dish, ingredients, listed, menu [clue_6] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: dish, cause, death
      ↳ MANDATORY TWO-PARAGRAPH STRUCTURE (must appear in paragraphs 1 or 2 — no later):
         Paragraph 1: The POV character physically approaches or directly observes this evidence.
           The narration or dialogue explicitly states what is seen (use the exact locked phrase if one applies).
         Paragraph 2 (immediately following): The detective or POV character explicitly reasons
           about what this evidence implies — who it implicates, why it may be unreliable,
           or what inference it supports. This must be a separate full paragraph, not a sentence appended to Paragraph 1.
    • gala, menu, available, guests, view [clue_culprit_direct_dr_mallory_finch] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      ⛔ SPOILER EMBARGO (pre-reveal chapter): surface ONLY the surface anomaly a character can see/hear/find.
         Do NOT name who it implicates, state the tamper direction or magnitude, or explain the mechanism in this chapter.
         Present it as an unexplained discrepancy; the culprit and method are revealed later.
         Place this OBSERVATION in paragraph 1 or 2 (observation only — no inference about the culprit).
    • menu, details, ingredients, dish [clue_early_1] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: dish, lethal, combined, lemon, sauce
      ↳ MANDATORY TWO-PARAGRAPH STRUCTURE (must appear in paragraphs 1 or 2 — no later):
         Paragraph 1: The POV character physically approaches or directly observes this evidence.
           The narration or dialogue explicitly states what is seen (use the exact locked phrase if one applies).
         Paragraph 2 (immediately following): The detective or POV character explicitly reasons
           about what this evidence implies — who it implicates, why it may be unreliable,
           or what inference it supports. This must be a separate full paragraph, not a sentence appended to Paragraph 1.
    • dish, ingredients, listed, menu [clue_mid_1] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: dish, cause, death
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
  - ALIBI LOCK: Dr. Mallory Finch's established alibi is "8:00 PM to 9:15 PM". Do NOT place Dr. Mallory Finch at any other location or in any other activity during the crime window. Any contradiction is a continuity error that triggers a retry.
  - TESTIMONY CONTINUITY: Dr. Mallory Finch has already made statements in earlier chapters. Any time, location, or claim attributed to Dr. Mallory Finch in THIS chapter must be consistent with those earlier statements. Do NOT introduce a new or different alibi claim — any contradiction is a continuity error.
- Locked fact phrase obligations:
  - If this batch mentions The victim consumed this specific dish shortly before death., write exactly: "the special crab dish".
  - If this batch mentions The exact amount of poison used in the dish., write exactly: "two ounces".
  - If this batch mentions The time at which the victim was declared dead., write exactly: "ten minutes past nine".
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
Investigation state at start: 5 clue(s) revealed to reader; approximately 0 unresolved suspect(s).
Must change by end: Reframe prior clue meaning and update suspect implications.
Suspect pressure target(s): Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill
Required new information: Earlier clue gets revised meaning with explicit theory update.
Forbidden reveals at this stage: Do not introduce decisive new evidence from nowhere.

FROZEN FACT STATE (DO NOT ALTER):
- Timeline anchor: April (spring).
- Month, season, weather, and time-of-year language in this batch must stay compatible with spring.
- Established timeline fact: 8:00 PM
- Established timeline fact: 9:30 PM
- If referenced, use exact phrase: "the special crab dish" (The victim consumed this specific dish shortly before death.).
- If referenced, use exact phrase: "two ounces" (The exact amount of poison used in the dish.).
- If referenced, use exact phrase: "ten minutes past nine" (The time at which the victim was declared dead.).

STORY TO DATE (REFERENCE ONLY — DO NOT COPY VERBATIM):
- Full prior chapter text is provided below for continuity, factual consistency, and reference accuracy.
- Use this to keep character voice, chronology, clue state, and location continuity aligned with earlier chapters.
- Do not quote, copy, or paraphrase these paragraphs too closely; write fresh prose that remains consistent with them.

--- BEGIN PRIOR CHAPTER 1 ---
Title: Chapter 1: The Morning After
Hugo Vane stepped into the dining room of the seaside hotel, his shoes echoing softly against the polished floor as the morning’s pale light filtered through rain-speckled windows. The air was thick with the scent of damp linen and the faint aroma of yesterday’s bread, mingling uneasily with the salty tang drifting in from the Channel. The atmosphere was strained, every guest’s posture rigid as if bracing against the chill that had settled overnight. On the table nearest the window, Sylvia Trent lay motionless, her head turned at an unnatural angle, the delicate pearls of her necklace scattered across the white linen. The silence was broken only by the distant murmur of a radio, its news bulletin muffled by the closed doors and the uneasy hush that had fallen over the room.

Eleanor Voss stood frozen beside Sylvia Trent, her eyes glazed with shock as she stared at the lifeless body. Dr. Mallory Finch hovered nearby, her fingers fidgeting with the edge of her sleeve, while Captain Ivor Hale maintained a disciplined posture, his hand tightening around his watch chain. Beatrice Quill lingered at the threshold, her gaze darting between the corpse and the guests, her expression unreadable. Hugo Vane, recognized by the others as the investigator, took in the scene with a measured glance, noting the stopped clock above the mantle—its hands fixed at ten minutes past nine. The time seemed to contradict the recollections of those present, and Hugo Vane’s mind began to sift through the implications.

The menu from the previous evening’s gala lay open on the sideboard, its pages still smudged with traces of lemon sauce. Hugo Vane approached, careful not to disturb the scattered papers, and read the list of dishes—among them, the special crab dish, described as accompanied by a rare lemon-infused sauce. The inclusion of such an unusual ingredient caught Hugo Vane’s attention, especially given the circumstances of Sylvia Trent’s death. The menu, available for all guests to view, seemed innocuous at first glance, but Hugo Vane sensed there was more beneath its surface. He glanced at Dr. Mallory Finch, whose professional detachment appeared strained, and wondered if the menu held a clue to the mechanism of the crime.

Hugo Vane’s gaze lingered on the details of the ingredients, noting how the combination of crab and lemon sauce could potentially provoke a toxic reaction if consumed together. The possibility unsettled him; it suggested that the dish itself might have played a role in Sylvia Trent’s demise, rather than any external force. He recalled the conversations from the previous night, the laughter that had seemed forced, and the way Sylvia Trent had praised the crab dish before retiring. The implication was clear: the meal, rather than an overt act of violence, could have been the channel for the fatal event.

The mechanism of the crime began to take shape in Hugo Vane’s mind. The poison—if present—would have relied on the lemon sauce to expose a false timing, masking the true cause of death. The menu’s details, the stopped clock, and the scattered pearls all formed a tableau of contradiction. Hugo Vane resisted the urge to leap to conclusions, instead cataloguing the evidence and the emotional responses of the guests. The tension in the room was palpable, every glance and gesture a potential clue.

Eleanor Voss broke the silence with a voice that trembled, though she attempted to steady it with a practiced laugh. "Sylvia had been feeling unwell in the days leading up to the gala," Eleanor said, her hand resting lightly on the back of a chair. "She mentioned headaches—nothing serious, but perhaps it was more than she let on." The remark hung in the air, seeding doubt and offering a convenient explanation for the tragedy. Hugo Vane noted the red herring, aware that such statements could easily mislead the investigation.

Dr. Mallory Finch stepped forward, her tone clinical yet tinged with concern. "I saw Sylvia last night, just before the dinner. She seemed perfectly lucid, if a bit tired. If there was something wrong, she didn’t say." Mallory’s fingers continued their restless dance, betraying her inner turmoil. Captain Ivor Hale, ever the authority figure, cleared his throat and spoke with measured gravity. "In the heat of battle, one must always steer true. Sylvia was a formidable woman—her passing leaves us all adrift." The nautical metaphor drew a faint nod from Hugo Vane, who recognized the captain’s attempt to impose order on chaos.

Beatrice Quill, still hovering near the door, finally found her voice. "Ain't life just a grand performance? Sylvia always took center stage, even when she didn’t mean to." Her words were tinged with envy, but her eyes betrayed a flicker of genuine sorrow. Hugo Vane observed the interplay of grief and rivalry, noting how each guest’s reaction revealed layers of connection and suspicion.

Hugo Vane moved closer to the body, careful not to disturb the scene. The pearls, the menu, the stopped clock—all pointed toward a carefully orchestrated event. Yet the contradictions persisted: the time of death fixed at ten minutes past nine, the dish served shortly before, and the guests’ conflicting accounts. Hugo Vane’s mind raced through the possibilities, cataloguing every detail as the investigation began. The spring morning outside felt distant, its promise of renewal overshadowed by the gravity of the crime.

The room remained tense as Hugo Vane addressed the group. "We must consider every possibility," he said, his voice steady but edged with urgency. "Sylvia Trent died no later than ten minutes past nine—that much is clear. The menu, the ingredients, and the timing all warrant scrutiny. Until we understand the mechanism, we must not rule out any explanation." The guests exchanged uneasy glances, the weight of suspicion settling over them like the drizzle beyond the windows.

As the morning wore on, the dining room of the seaside hotel became a crucible of secrets and anxieties. Hugo Vane, now firmly established as the investigator, began his methodical inquiry, aware that the truth would not reveal itself easily. The springtime light flickered across the polished surfaces, illuminating the contradictions and the wounds that lay beneath. The investigation had begun, and nothing would ever be the same.
--- END PRIOR CHAPTER 1 ---

--- BEGIN PRIOR CHAPTER 2 ---
Title: Chapter 2: Investigation Begins
"She was positively glowing last night," Beatrice Quill said, her voice breaking the uneasy silence that lingered in the dining room of the seaside hotel. Rain tapped faintly against the windowpanes, the sound mingling with the low hum of a radio somewhere beyond the closed doors. The morning light, filtered through grey clouds, cast a pallor over the white tablecloths and the scattered remnants of the previous evening's gala. Hugo Vane stood at the head of the table, notebook in hand, as he listened to Beatrice's recollection. Sylvia Trent, remembered for her vivacity, had been seen laughing and chatting just hours before her death. Beatrice's words, delivered with a hint of defensiveness, seemed to contradict Eleanor Voss's earlier suggestion that Sylvia had been unwell.

Hugo weighed the testimony, noting the discrepancy. If Sylvia Trent had appeared healthy and spirited before dinner, her sudden demise after the meal could not be easily attributed to lingering illness. The abruptness of her death, paired with the absence of visible distress beforehand, suggested something more sinister. Hugo observed Beatrice's posture—shoulders squared, gaze unwavering—as if she wished to distance herself from the tragedy. The implication was clear: Sylvia's condition prior to the meal raised questions about the true cause of her death.

"I distinctly recall Sylvia praising the crab dish," Eleanor Voss interjected, her tone polished but edged with a nervous laugh. "She said it was the highlight of the evening." The menu from the gala, still open on the sideboard, listed the special crab dish with lemon sauce—a detail Hugo had already catalogued. Eleanor's recollection was echoed by Captain Ivor Hale, who nodded gravely. "She was delighted, no doubt about it. I saw her reach for a second helping," he said, his hand tightening around his watch chain. The guests’ memories converged on the meal, painting a picture of Sylvia consuming the dish willingly, unaware of any danger. The contradiction was unsettling: a woman in apparent good health, expressing delight over her dinner, only to be found dead within hours.

Hugo considered the implications. If Sylvia had eaten the special crab dish with enthusiasm, it meant she had not suspected any risk. The absence of coercion or hesitation pointed away from foul play at the moment of consumption. Yet the timing—her death fixed at ten minutes past nine—aligned too closely with the serving of the meal for coincidence. Hugo’s mind worked through the possibilities, careful not to leap to conclusions. The evidence suggested that the dish, rather than external violence, might have been the channel for the fatal event. Still, Hugo kept his reasoning guarded, aware that the mechanism remained elusive.

Dr. Mallory Finch stood apart from the others, her fingers nervously adjusting the rim of her glasses. When Hugo approached, she spoke with measured calm, though her voice betrayed a tremor. "I saw Sylvia before dinner. She seemed perfectly lucid—no sign of distress. If there was anything wrong, she hid it well." Mallory’s clinical detachment faltered as she glanced at the body, then at Hugo. The spring morning outside felt distant, its promise of renewal overshadowed by the gravity of the scene. Hugo noted Mallory’s avoidance of eye contact, a subtle signal of discomfort. He pressed gently, "You were in the kitchen during the meal, correct?" Mallory nodded, her reply clipped. "Yes, I was overseeing preparations. Routine, nothing unusual."

Captain Ivor Hale, ever the authority figure, stepped forward. His voice carried the weight of command, but his words were carefully chosen. "In the heat of battle, one must always steer true. Sylvia was a formidable woman—her passing leaves us all adrift." The nautical metaphor drew a faint nod from Hugo, who recognized the captain’s attempt to impose order on chaos. Yet Hugo sensed that beneath Hale’s composure lay a deeper anxiety. Hale’s hand lingered on his pocket watch, as if measuring the passage of time against the fixed moment of Sylvia’s death. Hugo asked, "Did you notice anything unusual about the dish or the service last night?" Hale paused, his gaze drifting to the menu. "Nothing I can recall. The meal seemed ordinary, though the lemon sauce was rather sharp."

Eleanor Voss, her composure wavering, leaned against the back of a chair. "Sylvia was always so particular about her food. If anything had been amiss, she would have noticed." The remark, delivered with a practiced laugh, seemed to mask a deeper uncertainty. Hugo observed Eleanor’s hands—one gloved, the other bare—resting lightly on the linen. Her attempt to deflect suspicion was subtle, but Hugo caught the tension in her voice. He pressed, "You mentioned earlier that Sylvia had headaches. Do you believe they played a role in her death?" Eleanor hesitated, then replied, "Perhaps. But she was in excellent spirits last night. It’s difficult to say." The ambiguity in Eleanor’s answer only deepened the mystery.

Beatrice Quill, still lingering near the door, shifted her weight and looked away. "Ain't life just a grand performance? I just want my moment on stage," she muttered, her tone tinged with sarcasm. Hugo noted the envy beneath her words, the frustration of a woman trapped in circumstances she could not control. Beatrice’s relationship with Sylvia—rivalrous yet tinged with genuine sorrow—added another layer of complexity to the investigation. Hugo asked, "Did you see Sylvia after dinner?" Beatrice shook her head. "No, I was busy clearing tables. I didn’t think anything was wrong." Her denial was emphatic, but Hugo sensed that Beatrice’s resentment toward Sylvia might have colored her recollection.

The air in the dining room grew heavier as the guests’ statements accumulated. Each account seemed to raise more questions than answers. Hugo catalogued the contradictions: Sylvia’s apparent good health before dinner, her delight in the special crab dish, the abruptness of her death. The menu from the gala, listing the crab dish with lemon sauce, became the pivot point of the inquiry. Hugo’s mind circled the evidence, searching for the thread that would unravel the mystery. The springtime drizzle outside provided a muted counterpoint to the tension within, as if nature itself recoiled from the events unfolding.

Hugo paused, allowing the silence to settle. The investigation had only begun, yet the stakes were already clear. The guests, each grappling with their own secrets and anxieties, faced the prospect of scrutiny. Hugo’s role as investigator required him to balance empathy with skepticism, to see through the polished facades and polite evasions. He resolved to pursue every lead, aware that the truth would not reveal itself easily. The dining room of the seaside hotel, with its rain-streaked windows and lingering scent of last night’s bread, became a crucible for the unfolding drama. As Hugo prepared for the next round of questioning, he wondered which of the guests would crack first, and what secrets lay beneath the surface.
--- END PRIOR CHAPTER 2 ---

[SCENE COMPLETENESS CONTRACTS — MANDATORY. Each contract below lists what you MUST enact in that chapter. Do not summarise or mention these labels in the prose — enact them organically.]
Chapter 3 (Act 1) completeness contract:
  PIVOT ELEMENT (MANDATORY — write this into the prose, shown not told): "The conflicting statements about Sylvia's health and the dish served."
  FACT ESTABLISHED (MANDATORY — reader must know this by chapter end): "Establishes that the dish and its ingredients may have contributed to the poisoning, raising further questions about the suspects' motives."

# Case Overview
Title: A Delayed Demise
Era: 1940s
Setting: Seaside Hotel
Crime: murder (delayed-action poisoning)
Culprit: Dr. Mallory Finch
Victim: Sylvia Trent
False assumption: Sylvia died due to her existing health issues.
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
    "title": "Initial Suspicions",
    "setting": {
      "location": "the dining room of the seaside hotel",
      "timeOfDay": "Early afternoon",
      "atmosphere": "The atmosphere is thick with suspicion and fear."
    },
    "characters": [
      "Hugo Vane",
      "Eleanor Voss",
      "Dr. Mallory Finch",
      "Captain Ivor Hale",
      "Beatrice Quill"
    ],
    "purpose": "Deepen the investigation and reveal contradictions.",
    "cluesRevealed": [
      "clue_1",
      "clue_6"
    ],
    "dramaticElements": {
      "conflict": "Accusations begin to fly as guests defend their innocence.",
      "tension": "The stakes rise as the detective narrows down the suspects.",
      "microMomentBeats": [
        "Captain Hale clenches his fists, visibly agitated by the accusations being thrown around."
      ]
    },
    "summary": "Hugo Vane continues his inquiries, revealing that the dish served to Sylvia contained a rare poison when paired with lemon sauce. The guests' conflicting statements about Sylvia's health and their own behaviors raise suspicions. Tension escalates as accusations fly, and the detective begins to discern who may have had the motive to harm Sylvia.",
    "beat": "first_enquiries",
    "estimatedWordCount": 1800,
    "pivotElement": "The conflicting statements about Sylvia's health and the dish served.",
    "factEstablished": "Establishes that the dish and its ingredients may have contributed to the poisoning, raising further questions about the suspects' motives.",
    "permittedBehavioursByAct": [
      {
        "characterName": "Hugo Vane",
        "behaviour": "Show normal social behaviour; grief or confusion if appropriate."
      },
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
      }
    ],
    "redHerringPlacement": null,
    "emotionalRegister": "As the investigation begins, unease grows amid early clues that suggest hidden motives.",
    "dominantCharacterNote": {
      "name": "Eleanor Voss",
      "voiceRegister": "Eleanor's speech is smooth and polished, often punctuated with a hint of sarcasm that belies her true emotions."
    },
    "humourGuidance": {
      "permission": "forbidden"
    },
    "eraTextureNote": "Rationing limits the availability of food and resources; Travel restrictions due to wartime regulations; Communication is often limited to radio broadcasts and printed news; Social gatherings are marked by a sense of formality and etiquette; The presence of military personnel in public spaces alters social dynamics",
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
□ Chapter 3: the clue [clue_1] (indicates, potential, toxic, reaction, consumed, together) is placed in the first 25% of the chapter, dramatized in your own words, followed by an explicit inference or suspicion paragraph.
□ Chapter 3: the clue [clue_5] (witnesses, reported, seeing, sylvia, looking, healthy, before, dinner) is placed in the first 25% of the chapter, dramatized in your own words, followed by an explicit inference or suspicion paragraph.
□ Chapter 3: the clue [clue_6] (mechanism, relies, poison, contain, lemon, expose, false, timing) is placed in the first 25% of the chapter, dramatized in your own words, followed by an explicit inference or suspicion paragraph.
□ Chapter 3: the clue [clue_culprit_direct_dr_mallory_finch] (direct, ties, mallory, finch, mechanism, access, point, before, discriminating, excludes, competing, suspect) is placed in the first 25% of the chapter, dramatized in your own words, followed by an explicit inference or suspicion paragraph.
□ Chapter 3: the clue [clue_early_1] (indicates, potential, toxic, reaction, consumed, together) is placed in the first 25% of the chapter, dramatized in your own words, followed by an explicit inference or suspicion paragraph.
□ Chapter 3: the clue [clue_mid_1] (mechanism, relies, poison, contain, lemon, expose, false, timing) is placed in the first 25% of the chapter, dramatized in your own words, followed by an explicit inference or suspicion paragraph.
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
