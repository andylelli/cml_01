# Actual Prompt Record

- Run ID: `mystery-1784263668428`
- Project ID: ``
- Timestamp: `2026-07-17T04:54:45.131Z`
- Agent: `Agent9-ProseGenerator-Ch3`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4.1`
- Temperature: `0.42`
- Max Tokens: `4500`
- Attempt: `first`
- Prompt Hash: `1f15f7ad41dfb477`

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
- MORAL COMPLEXITY REQUIREMENT: The mechanism of this crime carries a moral gray area: "The impersonator had a desperate motive rooted in a tragic past, eliciting sympathy despite the crime." — the culprit reveal and denouement MUST acknowledge this ambiguity. Do not let the ending feel clean or simple. Give the reader at least one moment of uncomfortable sympathy or moral doubt.

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
   - Dr. Mallory Finch: Professional
   - Captain Ivor Hale: Military Veteran
   - Beatrice Quill: Social Climber
   - Sylvia Trent: Investigative Reporter
   - Hugo Vane: Manipulator
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
Living in January 1949, individuals navigate a period marked by the remnants of World War II, where social structures are shifting as women increasingly join the workforce. The coastal town feels the chill of winter, with dampness in the air and shadows looming over lives still recovering from the upheaval of war. The lingering effects of rationing and economic recovery create a sense of unease, with many grappling with their identities in a society still grappling with the past. Amidst this backdrop, social gatherings at places like the seaside hotel become spaces for both connection and tension, where secrets simmer beneath the surface and the specter of betrayal looms quietly in the corners of conversations.
Emotional register: A collective sense of tension and anticipation fills the air as people strive to maintain connections while navigating uncertainty.
Physical constraints: Limited access to public transportation due to post-war recovery. | Heavy winter weather restricting outdoor activities. | Rationing of goods affecting the availability of food and resources.
Current tensions (weave into background texture): Post-war economic recovery with inflation affecting daily life. | Increasing social opportunities for women challenging traditional gender roles. | Political tensions in Europe due to the onset of the Cold War.
Wartime context — Many veterans are adjusting back to civilian life, often struggling with the psychological impacts of their service.: The community is marked by a mix of camaraderie and unresolved grievances, as families reunite while also dealing with loss and change. Absence effect: The absence of those lost in the war creates a palpable void, influencing social dynamics and interpersonal relationships.

## Story Theme
In a world where authority can be disguised, the true identities of individuals can lead to tragic consequences, revealing the fragility of trust and the complexity of human relationships.

## Story Emotional Register
Dominant: A tense and suspenseful atmosphere permeates the narrative as secrets unravel and truths collide.

Arc:
The story begins at the Seaside Elegance Hotel, where the stormy weather sets a tense atmosphere, foreshadowing the murder of Eleanor Voss. As guests gather, the weight of her death lingers in the air, and the initial investigation unfolds amidst rising unease. Hugo Vane, the private investigator, is drawn into an intricate web of relationships and hidden motives, where the first clues hint at deeper secrets. As he delves deeper, the emotional cost of uncovering the truth weighs heavily upon him, revealing betrayals and lies. A pivotal moment occurs when the dynamics shift, forcing the investigation in a new direction as the alibis begin to crumble. The second turn comes with a revelation that recolors prior events, casting suspicion on those once thought innocent. The pressure mounts as Hugo confronts the suspects, leading to a climactic moment where truths are revealed, and loyalties are tested. In the resolution, the emotional costs for each character are laid bare, as the aftermath of the murder leaves scars that will shape their futures, echoing the fragility of trust and the consequences of deception.

The story opens: A tense atmosphere is established as the storm brews, foreshadowing the impending tragedy. As the investigation takes shape: The initial investigation begins, filled with confusion and uncertainty as guests become suspects. A first key turn arrives: A crucial clue alters the trajectory of the investigation, deepening the mystery. At the mid-point of the story: A revelation shifts the focus of suspicion, complicating the relationships further.

A second pivot reshapes the course: The mounting pressure leads to confrontations that unveil hidden truths. As tension reaches its height: Tensions peak as accusations fly and the emotional stakes rise for all involved. The climax brings the central question to a head: The true nature of the crime is revealed, forcing.

## Emotional register at this point in the story
The initial investigation begins, filled with confusion and uncertainty as guests become suspects.

## Character Portraits (appearance & era)

### Dr. Mallory Finch
Dr. Mallory Finch represents the changing roles of women in the medical field, caught between her professional dedication and a tumultuous personal life. Her involvement in a secret affair with Eleanor adds layers to her character, illustrating the emotional turmoil many women faced as they sought to balance societal expectations with personal desires. As a physician, Mallory's position offers her both respect and scrutiny, mirroring the duality of women's experiences in this transformative era.
Era intersection: Her secret relationship with Eleanor reflects the complexities of love and ambition, challenging the traditional norms of female relationships in the 1940s.

### Captain Ivor Hale
Captain Ivor Hale symbolizes the disillusionment of veterans struggling to find their place in a society that has moved on. His resentment toward Eleanor for not recognizing his military experience highlights the challenges faced by many returning servicemen as they grappled with their identities in a post-war world. Ivor’s bitterness and ambition intersect with the growing role of women in leadership, creating a tension that speaks to the shifting dynamics of power during this period.
Era intersection: Ivor's struggle for recognition within the hotel mirrors the broader changes in gender roles, as women like Eleanor rise to positions of authority.

### Beatrice Quill
Beatrice Quill embodies the ruthless ambition of women navigating the competitive social landscape of the 1940s. Her charm masks a darker side, as her blackmail of Eleanor reflects the lengths individuals will go to maintain their social standing. Beatrice's character illustrates the complexities of female relationships in a society where status and reputation are paramount, revealing the tension between ambition and morality during a time of recovery and transformation.
Era intersection: Her actions highlight the precarious nature of women's social power, emphasizing the risks they face in a world where their influence is both coveted and threatened.

### Hugo Vane
Hugo Vane personifies the tensions of upper-class men grappling with the consequences of their actions in a rapidly changing society. His financial fraud reflects the moral ambiguities that emerged during the post-war recovery, as individuals navigate the complexities of wealth and reputation. Hugo's character reveals the vulnerability of men whose power is threatened by the rise of women like Eleanor, highlighting the shifting dynamics within social hierarchies during this transformative era.
Era intersection: His fear of exposure parallels the struggles of many men during this time, as societal expectations shift and the consequences of past actions come to light.

## Character Voices

### Dr. Mallory Finch (she/her/her)
Dr. Mallory speaks with a calm, measured tone, often punctuating her sentences with dry observations.
[comfortable] You know, medicine is a fascinating field, full of surprises.
[evasive] Well, isn’t that just the way of things? One must adapt.
[stressed] I can't believe this is happening. I need to think clearly.
Humour: Mallory's dry wit adds complexity to her emotional struggles.

### Captain Ivor Hale (he/him/his)
Ivor speaks with a commanding presence, his words often laced with a sardonic edge.
[comfortable] You know how the sea can be, unpredictable yet beautiful.
[evasive] Let's not dwell on past mistakes; it's time to move forward.
[stressed] I didn’t mean for things to escalate like this!
Humour: Ivor's sardonic humour reflects his internal conflicts and frustrations.

### Beatrice Quill (she/her/her)
Beatrice speaks with a refined, melodic tone, often using elaborate phrases.
[comfortable] Oh, darling, how delightful to see you at this soirée!
[evasive] Well, isn't that just a little scandalous?
[stressed] I simply cannot bear the thought of my reputation faltering!
Humour: Beatrice's polite savagery adds a layer of intrigue to her character.

### Hugo Vane (he/him/his)
Hugo speaks in a direct, no-nonsense manner, often cutting to the chase.
[comfortable] Let's not beat around the bush; we need to discuss business.
[evasive] I have my reasons, but they’re not your concern.
[stressed] This situation is becoming untenable; we must act quickly!
Humour: Hugo's bluntness underscores his struggle with the situation.

## Location Registers (scene framing guides)

The Rooftop Terrace: The Rooftop Terrace feels both intimate and isolating, a beautiful yet haunting space where the echoes of laughter have turned to whispers of fear. Here, the crashing waves below serve as a reminder of the storm both outside and within the hearts of the guests, creating a chilling atmosphere that lingers long after the crime has occurred.. Camera angle: As a writer entering this space, one might focus on the stark contrast between the beauty of the night and the darkness of the crime, emphasizing the tension that permeates the air.. Era: The winter chill exacerbates the unease felt by the guests, adding a layer of discomfort.

Lobby Lounge: The Lobby Lounge is a hub of nervous energy, where guests gather beneath the warm glow of chandeliers, yet the air is thick with apprehension. The soft murmurs and laughter feel strained, as the weight of the recent tragedy casts a long shadow over what should be a place of comfort and connection.. Camera angle: Entering this space, a writer might capture the dichotomy of luxury and unease, highlighting the fragility of social interactions in such a charged atmosphere.. Era: The elegant decor contrasts sharply with the underlying tension of post-war recovery.

The Grand Dining Room: The Grand Dining Room envelops guests in a sense of opulence, yet the atmosphere is tinged with unease as secrets linger beneath the surface. The clinking of cutlery and soft laughter echo off the walls, masking the tension and uncertainty that accompany the recent events, creating an environment ripe for revelation.. Camera angle: A writer entering this space might focus on the contrast between the grand setting and the subtle undercurrents of anxiety among the guests.. Era: The formal dining experience reflects the social expectations of the era, adding pressure to maintain appearances.

Secluded Beach Access: The Secluded Beach Access feels both inviting and foreboding, a narrow path that leads to hidden encounters beneath the cliffs. The sound of crashing waves creates a sense of isolation, where secrets can flourish away from prying eyes, adding to the tension of the unfolding mystery.. Camera angle: As a writer, one might emphasize the duality of beauty and danger inherent in this space, capturing its enigmatic quality.. Era: The rugged beauty of the beach contrasts with the darkness of the events that transpire.

## Humour guidance for this story position (early)
Permission: forbidden
Rationale: The serious nature of the investigation overshadows any opportunity for humour.

## Reveal Groundwork (texture — do not explain, only plant)
- Plant one subtle observable beat related to: "Eleanor's murder serves as a catalyst, retroactively coloring Dr". Do not explain significance yet.
- Plant one subtle observable beat related to: "Mallory Finch's earlier interactions with her, revealing the depth of their secret relationship". Do not explain significance yet.
- Plant one subtle observable beat related to: "Beatrice's ambition is further exposed, as her blackmailing of Eleanor becomes more sinister in light of the murder". Do not explain significance yet.

FAIR-PLAY AND INFERENCE CONTRACT:
- FAIR PLAY CLUE TIMING: Never combine clue discovery and detective deduction in the same chapter. If a clue is first revealed to the reader in chapter N, the detective may only analyze, deduce from, or act on that clue in chapter N+1 or later.
- FAIR PLAY INFORMATION PARITY: The reader must see all clues BEFORE the detective uses them in reasoning. If the detective performs a test or makes a deduction, every piece of evidence supporting that conclusion must have been shown to the reader in earlier chapters.
- FAIR PLAY REVELATION SPACING: In the discriminating test scene, the detective can ONLY use clues that were revealed to the reader at least 1 full chapter earlier. Never introduce new clues or withheld information during the test.
- FAIR PLAY CONFRONTATION: During the final confrontation/revelation, the detective cannot surprise the reader with facts. Every piece of evidence cited must have been visible to the reader in prior chapters.
- Never solve by withheld information. Keep reader-information parity with detective reasoning.
- False assumption in force: The hotel manager was present during the murder, ensuring no one could leave or enter unnoticed.
- Hidden truth to progressively expose (compose in your own words from these elements): manager, left, unexpectedly, creating, window, murder
- Inference path checkpoints to dramatize clearly — compose ENTIRELY in your own sentences from these key terms (reproducing any briefing phrase verbatim FAILS validation):
  - Step 1: obs: witness, statements, incorrectly, claim, hotel, manager, present, murder | corr: manager, left, creating, window, murder | effect: narrows, suspect, pool, present
  - Step 2: obs: footprints, leading, away, scene, mismatch, size, suspect | corr: footprints, likely, planted, mislead, investigation | effect: eliminates, suspects, except, captain, hale, access
  - Step 3: obs: captain, hale, initials, near, murder, scene | corr: indicates, hale, present, involved, impersonation | effect: narrows, focus, captain, hale, primary, suspect
- Discriminating test method: trap
- Discriminating test elements to dramatize (compose ENTIRELY in your own sentences from these — do NOT reproduce any briefing phrase verbatim): discriminating, compares, witnes, timelin, statement, claimed, timeline
- Test must rely on already-shown clue IDs: clue_mechanism_visibility_core, clue_10, clue_culprit_direct_1
- Fair-play rationale: Step 1: Staff records and witness statements (early) allow the reader to establish the manager's absence. Step 2: Footprints and witness descriptions (mid) eliminate other suspects. Step 3: The hat's discovery (late) directly implicates Captain Hale, culminating in the discriminating test that confirms the disguise.

## Character Reference

### Dr. Mallory Finch (she/her — NEVER he/him)
Mallory speaks with a calm, measured tone, often punctuating her sentences with dry observations
Her speech reflects her medical background, occasionally slipping into technical jargon when discussing her work.
Mallory is torn between her professional composure and the emotional chaos stemming from her relationship with Eleanor, fearing the public fallout of their affair.
Voice colour: Dr. Mallory Finch uses dry wit humour — let it surface in their dialogue where natural, not in every line.

### Captain Ivor Hale (he/him — NEVER she/her)
Ivor speaks with a commanding presence, his words often laced with a sardonic edge
He has a tendency to use military jargon, especially when discussing his past experiences.
Ivor struggles with feelings of inadequacy and resentment, torn between his past accomplishments and present disappointments.
Voice colour: Captain Ivor Hale uses sardonic humour — let it surface in their dialogue where natural, not in every line.

### Beatrice Quill (she/her — NEVER he/him)
Beatrice speaks with a refined, melodic tone, often using elaborate phrases to convey her thoughts
She has a penchant for grand gestures and dramatic pauses, embellishing her stories.
Beatrice grapples with the fear of losing her social status and the lengths she is willing to go to protect it.
Voice colour: Beatrice Quill uses polite savagery humour — let it surface in their dialogue where natural, not in every line.

### Hugo Vane (he/him — NEVER she/her)
Hugo speaks in a direct, no-nonsense manner, often cutting to the chase without unnecessary embellishments
He has a habit of using business jargon, reflecting his background.
Hugo grapples with the fear of exposure and the potential collapse of his empire, torn between maintaining his façade and the risk of losing everything.


## CHARACTER CONTRACTS (binding for this scene)
Each entry below constrains how this character must be written in this chapter.
These override generic style guidance when they conflict.

### Dr. Mallory Finch[SHE]
Voice & mannerisms: Mallory speaks with a calm, measured tone, often punctuating her sentences with dry observations. Her speech reflects her medical background, occasionally slipping into technical jargon when discussing her work.
SIGNATURE TIC (use sparingly — this is Dr. Mallory Finch's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "Well, isn’t that just the way of things?"
Sample voice fragments (match this register and rhythm):
  [comfortable] "You know, medicine is a fascinating field, full of surprises."
  [evasive] "Well, isn’t that just the way of things? One must adapt."
Humour: dry wit — deploy occasionally (level 0.5)
FORBIDDEN phrase (never write for Dr. Mallory Finch): "a surge of determination washed over her"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Desperation over losing a key personal relationship and the potential public embarrassment could drive her to murder." — do not surface in Act I.

### Captain Ivor Hale[HE]
Voice & mannerisms: Ivor speaks with a commanding presence, his words often laced with a sardonic edge. He has a tendency to use military jargon, especially when discussing his past experiences.
SIGNATURE TIC (use sparingly — this is Captain Ivor Hale's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "You know how the sea can be."
Sample voice fragments (match this register and rhythm):
  [comfortable] "You know how the sea can be, unpredictable yet beautiful."
  [evasive] "Let's not dwell on past mistakes; it's time to move forward."
Humour: sardonic — deploy occasionally (level 0.4)
FORBIDDEN phrase (never write for Captain Ivor Hale): "palpable tension filled the room"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Ivor is bitter over Eleanor's refusal to support his promotion at the hotel, and an argument escalated to a breaking point." — do not surface in Act I.

### Beatrice Quill[SHE]
Voice & mannerisms: Beatrice speaks with a refined, melodic tone, often using elaborate phrases to convey her thoughts. She has a penchant for grand gestures and dramatic pauses, embellishing her stories.
SIGNATURE TIC (use sparingly — this is Beatrice Quill's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "Oh, darling, how scandalous!"
Sample voice fragments (match this register and rhythm):
  [comfortable] "Oh, darling, how delightful to see you at this soirée!"
  [evasive] "Well, isn't that just a little scandalous?"
Humour: polite savagery — deploy occasionally (level 0.6)
FORBIDDEN phrase (never write for Beatrice Quill): "she felt a wave of unease"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Beatrice could lose her status and connections if Eleanor were to expose her manipulations." — do not surface in Act I.

### Hugo Vane[HE]
Voice & mannerisms: Hugo speaks in a direct, no-nonsense manner, often cutting to the chase without unnecessary embellishments. He has a habit of using business jargon, reflecting his background.
SIGNATURE TIC (use sparingly — this is Hugo Vane's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "Let's not beat around the bush."
Sample voice fragments (match this register and rhythm):
  [comfortable] "Let's not beat around the bush; we need to discuss business."
  [evasive] "I have my reasons, but they’re not your concern."
Humour: blunt — deploy rarely (level 0.2)
FORBIDDEN phrase (never write for Hugo Vane): "she chose her words with great care"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Eleanor threatened to reveal his financial secrets, which would ruin his business and reputation." — do not surface in Act I.



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

- Living in January 1949, individuals navigate a period marked by the remnants of World War II, where social structures are shifting as women increasingly join the workforce
- The coastal town feels the chill of winter, with dampness in the air and shadows looming over lives still recovering from the upheaval of war
- The lingering effects of rationing and economic recovery create a sense of unease, with many grappling with their identities in a society still grappling with the past
- Amidst this backdrop, social gatherings at places like the seaside hotel become spaces for both connection and tension, where secrets simmer beneath the surface and the specter of betrayal looms quietly in the corners of conversations.

TEMPORAL CONTEXT:

This story takes place in January 1949 during winter.

Seasonal Atmosphere:
- Weather patterns: overcast skies, intermittent rain, cool temperatures around 40°F
- Daylight: Short days with twilight settling around 4:30 PM, leaving a lingering chill in the air as darkness envelops the streets early.
- Seasonal activities: indoor games and card tournaments, visits to local theaters for winter performances, enjoying hot drinks by the fireplace
- Seasonal occasions: New Year's Day
- Season: winter

Period Fashion (describe naturally):
- Men formal: dark wool suit with narrow lapels, crisp white dress shirt, silk tie in muted colors
- Men casual: tweed jacket, flannel trousers, corduroy cap
- Men accessories: leather gloves, classic fedora, pocket watch
- Women formal: vintage tea-length dress with a fitted bodice, silk scarf tied at the neck, peacoat for warmth
- Women casual: tweed skirt with a knitted sweater, woolen cardigan, ankle boots
- Women accessories: faux fur stole, beret, string of pearls

Cultural Context (reference naturally):
- Music/entertainment: Bing Crosby's 'White Christmas', Frank Sinatra's big band hits, The Andrews Sisters' harmonies; Films: 'The Third Man', 'All the King's Men'; Theatre: 'Death of a Salesman', 'A Streetcar Named Desire'; Radio: 'The Shadow', 'Suspense'
- Typical prices: Loaf of bread: four pence, Movie ticket: one shilling, Taxi fare across town: two shillings
- Current events: The establishment of NATO in April 1949; The beginning of the Cold War tensions in Europe
- Literature: '1984' by George Orwell | 'The Naked and the Dead' by Norman Mailer | 'The Catcher in the Rye' by J.D. Salinger | [mystery and detective fiction] | [literary fiction] | [social realism]
- Technology: the transistor radio | early computers for military use | the first commercial jet airliner prototypes | radio receivers in most homes | early television sets becoming more popular | household appliances like electric refrigerators
- Daily life: attending social clubs and dances, participating in community events, visiting local cafes for social gatherings
- Social rituals: afternoon tea with friends, formal dinner parties, weekly church services

Atmospheric Details:
The sound of rain gently tapping against the hotel windows, creating a rhythmic backdrop to whispered conversations. The faint aroma of wet wool and tobacco smoke lingers in the air, a reminder of the damp coastal weather. A low murmur of tension fills the lounge, where guests eye each other warily, their faces illuminated by the flickering glow of the fireplace.

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
-
[truncated for prompt budget]

NON-NEGOTIABLE CHAPTER OBLIGATIONS — LOCKED EVIDENCE VALUES (VERBATIM REQUIRED):
The following measured values (times, amounts, measurements) are absolute ground truth. Every time this chapter describes, mentions, or alludes to one — no matter how briefly — it MUST use the exact phrase shown below, character for character. NO paraphrase, approximation, rounding, or synonym is permitted.

FAILURE EXAMPLE: if the locked value is "at thirteen minutes to midnight" and you write "just before midnight" or "around midnight" — that is a HARD FAIL. You must write "at thirteen minutes to midnight". Equally, if the locked value is written in words, such as "ten minutes past eleven", and you convert it to figure-based clock notation — that is also a HARD FAIL. Words stay as words; figure forms are forbidden for word-phrased facts.

CRITICAL — WORD-PHRASED VALUES: If the canonical value is written out in words (e.g. a time like "ten minutes past eleven", or an amount like "forty minutes"), reproduce those exact words. DO NOT convert to figure-based time notation, twenty-four-hour format, or any other numeric shorthand. Correct: "ten minutes past eleven". WRONG: figure-based clock notation or numeric shorthand.

Locked values:
  - The time the witness claims they saw the suspect leaving.: "ten minutes past eleven"
    ⛔ FORBIDDEN alternatives: "11:10", "11.10", "eleven ten", "eleven-ten", "eleven past ten", "quarter past eleven", "half past eleven" — the ONLY acceptable form is "ten minutes past eleven"
  - The angle at which the reflection created the illusion of two people.: "thirty degrees"

If a value has no relevance to this chapter, omit it. But the moment you reference the underlying evidence, only the exact phrase above is acceptable.

EVIDENCE TO CONVEY IN YOUR OWN WORDS (NOT verbatim): weave each of these descriptive facts into the chapter as a COMPLETE, GRAMMATICAL observation by a character — surface the MEANING, never copy the phrasing word-for-word, and NEVER splice two evidence phrases together with an apostrophe or run two clauses together without a sentence break. If a fact has no relevance to this chapter, omit it.
  - The initials found on the hat that led to the identity confusion.: K.T.

⛔ CLUES TO SURFACE IN THESE CHAPTERS — mandatory:
The following evidence MUST be clearly observable to an attentive reader. Do not bury it in atmosphere or passing dialogue. Each clue must be concrete, specific, and noticeable:

• [clue_11] head, wound, victim, indicating, blunt, force, trauma
  Category: physical | Criticality: essential | Supports inference step 1
  Points to: manner, death, likely, blunt, force, trauma

• [clue_culprit_direct_captain_ivor_hale] direct, ties, captain, ivor, hale, mechanism, access, point, before, discriminating, excludes, competing
  Category: testimonial | Criticality: essential | Supports inference step 1
  Points to: direct, shows, captain, ivor, hale, means, opportunity, narrowing, solution, uniquely, toward, culprit

• [clue_10] Direct observation
  Category: structural | Placement: early (Act 1)
  Points to: what this observation reveals about the time or circumstances of the crime.

• [clue_hat_initials] Found near the scene
  Category: structural | Placement: early (Act 1)
  Points to: what this observation reveals about the time or circumstances of the crime.

• [clue_manager_absence] Direct observation
  Category: structural | Placement: early (Act 1)
  Points to: what this observation reveals about the time or circumstances of the crime.

For each clue above: an attentive reader should be able to find, record, and later use it to reason toward the solution.

═══ NARRATIVE STATE (read-only — do not contradict) ═══

LOCKED FACTS — use verbatim whenever this evidence is described:
  • The time the witness claims they saw the suspect leaving.: "ten minutes past eleven"
  • The angle at which the reflection created the illusion of two people.: "thirty degrees"
  • The initials found on the hat that led to the identity confusion.: "K.T."

CHARACTER PRONOUNS — never deviate from these:
  • Eleanor Voss: she/her/her
  • Dr. Mallory Finch: she/her/her
  • Captain Ivor Hale: he/him/his
  • Beatrice Quill: she/her/her
  • Sylvia Trent: she/her/her
  • Hugo Vane: he/him/his

CLUES ALREADY REVEALED TO READER: clue_mechanism_visibility_core, clue_10, clue_hat_initials, clue_core_contradiction_chain, clue_manager_absence — do not reveal these as new information.

INVESTIGATION LOG — WHAT IS ESTABLISHED (do not re-establish, do not repeat):
• Evidence already established (reference only — do NOT restate or quote these; advance beyond them): timeline, events, questionable | timeline, provided, witnesses, unreliable | manager, present, murder | manager, present, murder | timeline, provided, witnesses, unreliable
• Suspect cleared: Dr. Mallory Finch[SHE] — Hospital records confirm her whereabouts during the murder.
• Suspect cleared: Sylvia Trent[SHE] — Witness testimony reveals she was at the party.
• Suspect cleared: Beatrice Quill[SHE] — Beatrice’s alibi as a maid checked by other staff confirms her absence.
⚠ The story must move FORWARD from this log. Any beat already listed above is forbidden from repeating.

⚠ THIS CHAPTER'S REQUIRED ADVANCE (early): Interview each suspect — record their claimed whereabouts

CONTINUITY HANDOFF — previous chapter closing beat:
  • "He gathered his notes, the weight of the investigation settling anew on his shoulders. The conflicting statements about the hotel manager’s whereabouts had opened a chasm in the timeline, and Hugo knew that until it was bridged, suspicion would cling to every..."
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
Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill, Sylvia Trent, Hugo Vane

✓ RULE: Use EXACTLY these names. Do NOT vary spelling, add titles, or introduce new forms.
✓ Example: if earlier chapters used "Clara Whitfield", keep using "Clara Whitfield" — never "Mrs. Whitfield" unless that is the character's canonical name in the list above.

**Setting Vocabulary Established in Earlier Chapters:**
drawing room, corridor, lobby, lounge

✓ RULE: Continue using this location vocabulary. Maintain consistency with established setting type.
✓ Do NOT introduce new location types that contradict earlier chapters.

**Recent Chapter Summary (for narrative continuity):**
Chapter 1: Chapter 1: The Stopped Watch
  Events: Hugo Vane pressed his gloved hand to the cold brass handle, feeling the dampness of the night still clinging to the metal.
Chapter 2: Chapter 2: Contradictory Evidence
  Events: "You’re certain about the time?

⚠️ **VALIDATION:** Character name mismatches and setting drift are common failure modes.
Double-check every character name against the list above before using it.

**⏱ LOCKED TIME ANCHOR — use verbatim, do not paraphrase:**
Clock time (from the case ground truth): **"9:00 PM"**
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
Known location profile anchors: The Seaside Elegance Hotel, The Rooftop Terrace, Lobby Lounge, The Grand Dining Room, Secluded Beach Access, the hotel dining room
LOCATION NAME CAPITALISATION (HARD REQUIREMENT — validated):
All named locations in your prose MUST use the EXACT capitalisation from the CML profiles.
Canonical forms: "The Seaside Elegance Hotel", "The Rooftop Terrace", "Lobby Lounge", "The Grand Dining Room", "Secluded Beach Access", "the hotel dining room"
Writing a location in lowercase (e.g. "drawing room" instead of "Drawing Room") is a validated error. Every time you mention a named location, copy its capitalisation from the list above.
- Chapter 3: OPENING STYLE (HARD): Start the VERY FIRST SENTENCE with an explicit time marker — e.g. "That morning…" / "By the time dusk fell…" / "It was nearly four o'clock…" / "On the second day after the discovery…". Time must be in the first clause. Anchor opening in "the hotel dining room". The opening style above governs only your FIRST SENTENCE; the grounding below may land anywhere in the first 2 paragraphs (it need not be sentence one, and never conflicts with the chosen opening style). HARD REQUIREMENT for the first 2 paragraphs: (a) include 2+ sensory words — choose from smell/scent/odor/fragrance/sound/echo/silence/whisper/creak/cold/warm/damp/rough/smooth/glow/shadow/flicker/dim — and (b) include 1+ atmosphere/time word — choose from rain/wind/fog/storm/mist/thunder/evening/morning/night/dawn/dusk/lighting/weather/season/afternoon/midday/noon/midnight/twilight/sunrise/sunset/daylight/sunlight/overcast/cloudy/bright/dark/grey/pale/chill/crisp/drizzle/haze/lamplight/firelight. These are validated requirements, not style suggestions; missing them triggers a retry.

[⚠ INTERNAL QUALITY DIAGNOSTICS — DO NOT REPRODUCE ANY PART OF THIS SECTION IN YOUR STORY OUTPUT. These are private generator observations for your consideration only. Your narrative must read as if this section does not exist. Never include phrases from this block in character dialogue, narration, or description.]

PRIOR CHAPTER QUALITY OBSERVATIONS:
- Chapter 1 (score 96/100):
  Quality gaps noted: scene grounding weakness
  Address in upcoming chapters: Open next chapter with a named location anchor plus at least two sensory cues and one atmosphere marker.
- Chapter 2 (score 98/100):
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

PROMPT BUDGET SUMMARY: budget=24000 tokens; fixed=12406; context=11132; dropped=[humour_guide, location_profiles]; truncated=[location_profiles, temporal_context, pronoun_accuracy]

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
4. Integrate at least two concrete era-grounded details per chapter from setting refinement signals: radio broadcasting | early television sets | military radar technology | party-line telephones | long-distance calls | military encryption.
5. Respect setting movement/access constraints in scene action and alibis: narrow hallways limiting movement | restricted access to certain guest areas | secluded beach access requiring a key | staff-only areas for maintenance and service | guest room privacy policies.
6. Sustain social coherence with this backdrop pressure: A seaside hotel hosts a gathering of guests during a storm, where the pressures of post-war recovery and shifting gender roles create a tense atmosphere, complicating trust and identity.
7. Maintain continuity around these socially central cast anchors where relevant: Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill, Sylvia Trent, Hugo Vane.
8. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Critical: Plot similarity 0.80 with 'The Second Key' (same impersonation method and identity theme)
9. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Moderate: Character similarity 0.75 with 'The Second Key' (similar cast structure and roles)
10. STORY TO DATE ANTI-COPY RULE: The STORY TO DATE section below is provided for chronological and factual reference ONLY. You MUST NOT copy, lightly rephrase, or structurally echo any sentence or paragraph from prior chapters. Every sentence in this chapter must be original prose unique to this scene. Reusing even a clause from prior chapter text will cause this attempt to fail immediately.

CRITICAL PROSE REQUIREMENTS:

The CML specifies exact requirements for certain validation-critical scenes. You MUST include these elements at the specified positions.

**Discriminating Test Scene (Act 3, Scene 4):**
Required elements: Execute the discriminating test, Observe the culprit's reaction or result, Draw conclusion about guilt

**Suspect Clearance Scenes:**
- Dr. Mallory Finch (Act 3, Scene 5): Hospital records confirm her whereabouts during the murder.
  Clues: hospital records, witness testimonies
- Sylvia Trent (Act 3, Scene 5): Witness testimony reveals she was at the party.
  Clues: party attendance records, multiple witness accounts
- Beatrice Quill (Act 3, Scene 5): Beatrice’s alibi as a maid checked by other staff confirms her absence.
  Clues: staff schedules, witness statements

**Culprit Revelation Scene (Act 3, Scene 6):**
Method: Confrontation with evidence

**Clue Placement for These Chapters:**
- clue_10 must appear in Act 1, Scene 3 via Direct observation
- clue_11 must appear in Act 1, Scene 3 via Direct observation
- clue_culprit_direct_captain_ivor_hale must appear in Act 1, Scene 3 via Witness statement
- clue_hat_initials must appear in Act 1, Scene 3 via Found near the scene
- clue_manager_absence must appear in Act 1, Scene 3 via Direct observation

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
Investigation state at start: 5 clue(s) revealed to reader; approximately 0 unresolved suspect(s).
Must change by end: Increase or complicate suspicion through a new pressure revelation — WITHOUT resolving the case: do NOT name, accuse, or extract a confession from the culprit, make an arrest, or declare the case closed (that is reserved for the final reveal).
Suspect pressure target(s): Captain Ivor Hale, Dr. Mallory Finch, Beatrice Quill
Required new information: At least one fear/motive/lie/loyalty reveal with investigative consequence.
Forbidden reveals at this stage: No culprit resolution: no confession, no arrest, no 'case closed', no accusation ('I accuse'/'I name'), and never state 'the culprit/murderer/killer is/was …'. The accusation is reserved for the final reveal — build suspicion only.

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
  - Scene is set in: the hotel dining room — reference it naturally within the paragraph, never as your opening phrase.
  - Opening atmosphere (MANDATORY — validator enforced): the first paragraph MUST contain at least one of: rain / wind / fog / storm / mist / thunder / evening / morning / night / dawn / dusk / season / afternoon / midday / noon / midnight / twilight / sunrise / sunset / daylight / sunlight / overcast / cloudy / bright / dark / grey / pale / cold / warm / chill / crisp / damp / drizzle / haze / lamplight / firelight. A chapter that omits all of these from its opening paragraph will be rejected.
  - PARAGRAPH OPENER DIVERSITY (MANDATORY — validator enforced): No more than 2 paragraphs in this chapter may begin with "Hugo" or "Hugo's" as the first word. You must vary paragraph openings throughout: use sensory observations, another character's name or action, dialogue, object or sound details, or temporal markers. Opening 3 or more paragraphs with "Hugo" will cause automated rejection.
  - ⛔ MECHANISM SPOILER BAN: Do NOT state how the crime device was manipulated — not the direction, not the magnitude, not who performed it. Characters may only observe that two sources of evidence disagree. The specific method, tamper amount, and perpetrator's action are ALL FORBIDDEN until the reveal. WRONG: "The culprit had altered the device by forty minutes to create a false alibi." RIGHT: "Two independent pieces of evidence gave contradictory readings — a discrepancy neither could yet explain."
  - Continuity bridge: in the first 120 words, visibly connect from the previous chapter's final beat. Carry forward one unresolved element (object, accusation, emotional pressure, or immediate physical action) from: "He gathered his notes, the weight of the investigation settling anew on his shoulders. The conflicting statements about the hotel manager’s whereabouts had opened a chasm in the timeline, and Hugo knew that until it was...".
  - CLUE OBLIGATIONS — each clue below MUST be dramatized, but in YOUR OWN WORDS:
    Render each as something a character SEES, DOES, or SAYS on the page. The bracketed text is a
    DESCRIPTION of the evidence for you — do NOT transcribe it as narration. Copying a clue's
    description sentence verbatim into the prose FAILS validation.
    • witness, accounts, stating, manager, presence [clue_10] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: timeline, provided, witnesses, unreliable
      ↳ MANDATORY TWO-PARAGRAPH STRUCTURE (must appear in paragraphs 1 or 2 — no later):
         Paragraph 1: The POV character physically approaches or directly observes this evidence.
           The narration or dialogue explicitly states what is seen (use the exact locked phrase if one applies).
         Paragraph 2 (immediately following): The detective or POV character explicitly reasons
           about what this evidence implies — who it implicates, why it may be unreliable,
           or what inference it supports. This must be a separate full paragraph, not a sentence appended to Paragraph 1.
    • visible, head, injury, victim, body [clue_11] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: manner, death, likely, blunt, force, trauma
      ↳ MANDATORY TWO-PARAGRAPH STRUCTURE (must appear in paragraphs 1 or 2 — no later):
         Paragraph 1: The POV character physically approaches or directly observes this evidence.
           The narration or dialogue explicitly states what is seen (use the exact locked phrase if one applies).
         Paragraph 2 (immediately following): The detective or POV character explicitly reasons
           about what this evidence implies — who it implicates, why it may be unreliable,
           or what inference it supports. This must be a separate full paragraph, not a sentence appended to Paragraph 1.
    • witnesses, claiming, hotel, manager, presence [clue_culprit_direct_captain_ivor_hale] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      ⛔ SPOILER EMBARGO (pre-reveal chapter): surface ONLY the surface anomaly a character can see/hear/find.
         Do NOT name who it implicates, state the tamper direction or magnitude, or explain the mechanism in this chapter.
         Present it as an unexplained discrepancy; the culprit and method are revealed later.
         Place this OBSERVATION in paragraph 1 or 2 (observation only — no inference about the culprit).
    • hotel, records, showing, manager, departure, time [clue_hat_initials] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: manager, present, murder
      ↳ MANDATORY TWO-PARAGRAPH STRUCTURE (must appear in paragraphs 1 or 2 — no later):
         Paragraph 1: The POV character physically approaches or directly observes this evidence.
           The narration or dialogue explicitly states what is seen (use the exact locked phrase if one applies).
         Paragraph 2 (immediately following): The detective or POV character explicitly reasons
           about what this evidence implies — who it implicates, why it may be unreliable,
           or what inference it supports. This must be a separate full paragraph, not a sentence appended to Paragraph 1.
    • witness, accounts, stating, manager, presence [clue_manager_absence] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: timeline, provided, witnesses, unreliable
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
  - ALIBI LOCK: Captain Ivor Hale's established alibi is "10:00 PM to 10:30 PM". Do NOT place Captain Ivor Hale at any other location or in any other activity during the crime window. Any contradiction is a continuity error that triggers a retry.
  - TESTIMONY CONTINUITY: Captain Ivor Hale has already made statements in earlier chapters. Any time, location, or claim attributed to Captain Ivor Hale in THIS chapter must be consistent with those earlier statements. Do NOT introduce a new or different alibi claim — any contradiction is a continuity error.
- Locked fact phrase obligations:
  - If this batch mentions The time the witness claims they saw the suspect leaving., write exactly: "ten minutes past eleven".
  - If this batch mentions The angle at which the reflection created the illusion of two people., write exactly: "thirty degrees".
  - If this batch mentions The initials found on the hat that led to the identity confusion., write exactly: "K.T.".
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
Investigation state at start: 5 clue(s) revealed to reader; approximately 0 unresolved suspect(s).
Must change by end: Increase or complicate suspicion through a new pressure revelation — WITHOUT resolving the case: do NOT name, accuse, or extract a confession from the culprit, make an arrest, or declare the case closed (that is reserved for the final reveal).
Suspect pressure target(s): Captain Ivor Hale, Dr. Mallory Finch, Beatrice Quill
Required new information: At least one fear/motive/lie/loyalty reveal with investigative consequence.
Forbidden reveals at this stage: No culprit resolution: no confession, no arrest, no 'case closed', no accusation ('I accuse'/'I name'), and never state 'the culprit/murderer/killer is/was …'. The accusation is reserved for the final reveal — build suspicion only.

FROZEN FACT STATE (DO NOT ALTER):
- Timeline anchor: January (winter).
- Month, season, weather, and time-of-year language in this batch must stay compatible with winter.
- Established timeline fact: 9:00 PM
- Established timeline fact: 10:00 PM
- If referenced, use exact phrase: "ten minutes past eleven" (The time the witness claims they saw the suspect leaving.).
- If referenced, use exact phrase: "thirty degrees" (The angle at which the reflection created the illusion of two people.).
- If referenced, use exact phrase: "K.T." (The initials found on the hat that led to the identity confusion.).

STORY TO DATE (REFERENCE ONLY — DO NOT COPY VERBATIM):
- Full prior chapter text is provided below for continuity, factual consistency, and reference accuracy.
- Use this to keep character voice, chronology, clue state, and location continuity aligned with earlier chapters.
- Do not quote, copy, or paraphrase these paragraphs too closely; write fresh prose that remains consistent with them.

--- BEGIN PRIOR CHAPTER 1 ---
Title: Chapter 1: The Stopped Watch
Hugo Vane pressed his gloved hand to the cold brass handle, feeling the dampness of the night still clinging to the metal. The corridor beyond the entrance of The Seaside Elegance Hotel was shrouded in a grey morning haze, the faint scent of rain and seaweed drifting in from the battered coastline. A hush had settled over the lobby, broken only by the distant echo of a radio broadcast and the soft creak of floorboards underfoot. The storm had abated, but the air remained heavy, as if the building itself recoiled from what had transpired. At the threshold of the drawing room, Eleanor Voss lay sprawled on the polished parquet, her dark hair fanned across the rug, the pallor of her skin stark against the dim glow filtering through rain-streaked windows.

Hugo knelt beside Eleanor Voss, his breath catching in the chill. The stopped pocket watch, still clutched in her right hand, displayed the time: ten minutes past eleven. There was no mistaking the violence that had ended her life—a sharp wound at the temple, blood congealing in a dark crescent beneath her head. The silence pressed in, broken only by the faint tick of the grandfather clock in the hallway, which disagreed with the time on Eleanor’s watch by nearly an hour. Beyond the body, Captain Ivor Hale stood rigidly, his uniform immaculate, eyes fixed on the scene with a mixture of disbelief and something harder to name. Hugo’s own reflection hovered in the glass of the French doors: a man out of place, coat damp from the lingering drizzle, drawn into a tragedy he had not foreseen.

It was not simply the horror of the discovery that unsettled Hugo, but the contradictions that surfaced at once. Several guests insisted the hotel manager had been present in the lounge at the very moment the murder must have occurred. Their statements, delivered with the brittle certainty of those eager to be helpful, all converged on the same point: the manager was in the building, ensuring no one left or entered unnoticed. Yet as Hugo examined the staff logbook, a neat entry revealed the manager had signed out at nine forty-five, well before Eleanor’s death. The implication was immediate and troubling—a window of opportunity had opened, and someone had taken advantage.

Hugo straightened, the weight of responsibility settling on his shoulders. The stopped watch in Eleanor’s hand established a hard limit: she had died no later than ten minutes past eleven. This fact alone unraveled the comfortable fabric of the guests’ alibis, for three of them claimed to have seen the manager in the lounge at that very time. Either the witnesses were mistaken, or the manager’s absence had gone unnoticed, allowing the killer to slip by unchallenged. The contradiction was not a subtle one. Hugo’s mind began to trace the outline of a puzzle that would not yield to simple explanations.

Captain Ivor Hale, the hotel’s security consultant and a man whose bearing still echoed his naval career, hovered near the sideboard. His posture was disciplined, but his hand tightened around his watch chain as Hugo’s gaze met his. "You’ll want to speak to everyone, I suppose," Hale said, voice clipped, betraying a tension at odds with his outward composure. "No one left the lounge, not while I was there. The manager was keeping a close eye on things. Or so we all thought." There was a flicker of something in his expression—resentment, perhaps, or the memory of a quarrel unresolved. Hugo noted it, filing it away for later.

A faint sound drew Hugo’s attention to the hallway, where Beatrice Quill and Sylvia Trent lingered in the shadows, their faces pale above woolen scarves. The scent of wet wool mingled with the sharper tang of tobacco smoke from the lobby, where a half-finished cigarette smoldered in an ashtray. Dr. Mallory Finch was nowhere to be seen, but her absence was explained by the hospital’s urgent call earlier that morning. The guests exchanged uneasy glances, each measuring the others’ reactions, as if the truth might be found in a quiver of the lip or averted eyes.

Hugo rose, dusting his knees, and addressed the room. "Let’s not beat around the bush. Eleanor Voss is dead, and the evidence suggests she died no later than ten minutes past eleven. Yet the hotel records show the manager left at nine forty-five, and several of you claim to have seen him here after that. I’ll need each of you to recall exactly where you were, and with whom, from nine o’clock onward." His tone was brisk, businesslike, but the gravity of the moment was not lost on anyone.

Captain Ivor Hale’s lips thinned, but he nodded. "I was in the lounge until half past ten. After that, I went up to my room. If you’re suggesting someone slipped past while the manager was absent, you’ll need more than a logbook to prove it." He glanced at the stopped watch in Eleanor’s hand, then away. "You know how the sea can be—unpredictable, even in a place like this." The remark hung in the air, oddly out of place, and Hugo wondered if it was meant as a deflection or a warning.

A memory surfaced, unbidden: the night before, Eleanor had confided in Hugo that she’d glimpsed a shadowy figure lingering near the hotel’s rear entrance. She had laughed it off, but now the recollection gnawed at him—a possible intruder, or merely the product of nerves sharpened by the storm. The red herring was planted, subtle yet potent, and Hugo felt the investigation branching in directions he could not yet control.

The morning advanced, pale light filtering through the stained-glass transom, casting fractured patterns across the floor. The hotel’s Art Deco fixtures gleamed dully, their elegance diminished by the presence of death. Outside, the wind rattled the windowpanes, a reminder that the world beyond continued its indifferent course. Hugo surveyed the assembled guests—each a potential suspect, each with a reason to hide or reveal, each shaped by the peculiar pressures of post-war life. The rationing, the uncertainty, the shifting roles between men and women—all of it simmered beneath the surface.

He turned back to Eleanor’s body, the pocket watch still resting in her lifeless hand. The contradiction between the timepieces, the manager’s unexplained absence, and the tangle of unreliable witness accounts formed the opening moves of a game Hugo had no choice but to play. Somewhere in the interplay of fact and falsehood, the truth waited—cold, silent, and as implacable as the sea beyond the hotel’s battered cliffs.
--- END PRIOR CHAPTER 1 ---

--- BEGIN PRIOR CHAPTER 2 ---
Title: Chapter 2: Contradictory Evidence
"You’re certain about the time?" Hugo asked, his voice low but carrying across the expanse of the hotel lobby. The morning’s chill had not yet left the marble floor, and the scent of damp wool and polished wood hung in the air. Rain tapped softly against the tall windows, its rhythm interrupted by the clinking of china as a maid cleared away the remnants of breakfast. Shadows stretched long across the patterned carpet, cast by the pale winter light filtering through the glass. Hugo’s hand hovered over the open staff logbook on the reception desk, the neat signature of the hotel manager standing out: a departure logged at nine forty-five, not a minute later.

He traced the ink with his fingertip, mind circling the implications. The logbook entry was unambiguous—a hard exit, well before the time of Eleanor Voss’s death. Yet the witnesses, in their anxious eagerness, had insisted the manager was present at "ten minutes past eleven." The contradiction was not merely academic; it tore a hole in the fabric of the guests’ collective memory. Hugo’s eyes flicked from the page to the cluster of guests gathered near the fireplace, their faces caught between the glow of lamplight and the gloom of a wintry morning. If the manager had left so early, then the vigilant presence everyone relied upon was nothing more than a comforting illusion. Someone had moved unseen, and the window for murder had been wider than anyone wanted to admit.

Dr. Mallory Finch adjusted the cuff of her peacoat, her movements precise, as if measuring out the distance between herself and the others. "I was at the hospital until nearly midnight," she said, her tone calm, the faintest edge of irritation beneath the surface. "The staff can confirm it. I only returned when I heard the news." She kept her gaze fixed on Hugo, but her fingers toyed with a string of pearls at her neck, betraying a tremor she did not otherwise allow. The scent of antiseptic seemed to cling to her, incongruous amid the aroma of coffee and pastries. Hugo watched her carefully, noting not only her words but the practiced composure that had seen her through far worse than this.

Captain Ivor Hale stood apart, his stance rigid, the lines of his uniform as sharp as the set of his jaw. "Let’s not dwell on past mistakes; it’s time to move forward," he said, voice clipped, eyes narrowing as he surveyed the room. "I was in the lounge until half past ten, then retired to my quarters. If you’re implying I failed in my duties, you’ll need more than a discrepancy in the logbook." He glanced at the rain-streaked windows, jaw working as if he were biting back further words. The faint scent of tobacco clung to his jacket, and the glint of a military pin on his lapel caught the weak morning light. Hugo sensed the undercurrent of resentment—toward the dead woman, perhaps, or toward the shifting order that had left men like him stranded between past and present.

The guests, gathered in uneasy clusters, exchanged wary glances. The clatter of a dropped spoon rang out, sharp in the hush, and was quickly muffled by the soft murmur of conversation. Sylvia Trent, her notebook clutched to her chest, scribbled furiously, her eyes darting from one face to another. Beatrice Quill lingered near the tea trolley, her posture demure, but her gaze sharp as she watched the interplay of accusation and defense. The atmosphere was thick with suspicion, each word weighed and measured, each silence more telling than speech.

Hugo closed the logbook with a quiet snap, letting the sound settle. "Three of you maintain the manager was here at ten minutes past eleven. The records say otherwise. Either the manager’s signature is forged, or someone’s memory is playing tricks." He let the words hang, watching for the ripple of reaction. Dr. Mallory Finch’s lips pressed together, a fleeting expression of annoyance passing over her face before she smoothed it away. Captain Ivor Hale’s eyes narrowed, but he said nothing, his hands clasped behind his back in a gesture that spoke of old habits and unyielding pride.

The contradiction was now out in the open, a wedge driven between the comfort of shared certainty and the cold facts of the matter. Hugo felt the weight of it settle on the room. The storm outside had abated, but within these walls, the tension only grew. He wondered, not for the first time, whether the lies were deliberate or the product of fear. The war had taught them all to hide things—sometimes from others, sometimes from themselves.

A brief silence fell, broken only by the distant sound of the radio in the adjoining lounge. The announcer’s clipped tones drifted through the open door, a reminder that the world beyond the hotel’s walls marched on, indifferent to the private tragedies unfolding here. Hugo’s gaze lingered on Dr. Mallory Finch, noting the way she avoided his eyes, her attention fixed on the pattern of the carpet. It was not guilt, exactly, but something adjacent—a reluctance to be drawn further into the fray. Captain Ivor Hale, for his part, seemed to bristle at the implication that his authority might be questioned. The old order was shifting, and not everyone found the new arrangement to their liking.

Hugo let the silence stretch, then spoke quietly. "We’re left with a gap—an hour unaccounted for, and no one to vouch for the comings and goings in that time. I’ll need each of you to recall, in detail, what you saw and heard. Memory is a treacherous thing, especially on a night like last." He turned to Dr. Mallory Finch. "You say you were at the hospital. Did you see anyone as you returned? Anything unusual on the road or in the lobby?"

Dr. Mallory Finch’s reply was measured, but her eyes flickered. "Only the usual. The porter on duty, a guest complaining about the cold. If there was something amiss, I was too tired to notice." She hesitated, then added, "You know, medicine is a fascinating field, full of surprises. But even I can’t diagnose a lie from a distance." The dry edge of her wit returned, but Hugo caught the shadow of uncertainty beneath it. She was used to control, to certainty, and this situation offered neither.

Captain Ivor Hale’s response was less accommodating. "If you’re suggesting I was asleep at my post, you’re mistaken. I make it a point to know who comes and goes. But if the manager left early, that’s a failure above my pay grade." He shot a look at Hugo, half challenge, half plea. "You know how the sea can be—unpredictable, even for those who think they’ve mastered it." The words were meant to deflect, but Hugo heard the edge of defensiveness in them. Hale was not a man accustomed to doubt, and the uncertainty gnawed at him.

The tension in the room was punctuated by small, telling gestures: Beatrice Quill smoothing her skirt, Sylvia Trent tucking a stray strand of hair behind her ear, Dr. Mallory Finch’s fingers worrying at her pearls. Hugo watched them all, weighing each reaction, each silence. The contradiction in the manager’s timeline had done its work—the guests were unsettled, their certainties shaken.

Yet amid the unease, there was a moment of ironic relief. The radio, forgotten in the corner, crackled to life with a burst of static, followed by the strains of a cheerful waltz. For a fleeting moment, the music seemed to mock the gravity of the scene, a reminder that life—absurd, relentless—marched on. Hugo allowed himself a thin smile, more grimace than amusement, before returning to the task at hand.

He gathered his notes, the weight of the investigation settling anew on his shoulders. The conflicting statements about the hotel manager’s whereabouts had opened a chasm in the timeline, and Hugo knew that until it was bridged, suspicion would cling to every word, every alibi. He looked from Dr. Mallory Finch to Captain Ivor Hale, sensing that beneath their measured responses lay wounds and grievances yet to be revealed. The morning light grew no brighter, and the storm clouds beyond the windows threatened another downpour. Within the hotel, the real tempest was only beginning.
--- END PRIOR CHAPTER 2 ---

[SCENE COMPLETENESS CONTRACTS — MANDATORY. Each contract below lists what you MUST enact in that chapter. Do not summarise or mention these labels in the prose — enact them organically.]
Chapter 3 (Act 1) completeness contract:
  PIVOT ELEMENT (MANDATORY — write this into the prose, shown not told): "The head wound on the victim indicating blunt force trauma."
  FACT ESTABLISHED (MANDATORY — reader must know this by chapter end): "Confirms that Captain Hale was present before the murder, linking him to the victim."

# Case Overview
Title: The Illusion of Authority
Era: 1940s
Setting: a seaside hotel
Crime: murder (impersonation)
Culprit: Captain Ivor Hale
Victim: Eleanor Voss
False assumption: The hotel manager was present during the murder, ensuring no one could leave or enter unnoticed.
Cast: Eleanor Voss (she/her), Dr. Mallory Finch (she/her), Captain Ivor Hale (he/him), Beatrice Quill (she/her), Sylvia Trent (she/her), Hugo Vane (he/him)

Setting Lock: Keep all scenes and descriptions consistent with the stated setting (a seaside hotel). Do not introduce a different location type. Do not invent an alternative estate name. The only permitted name for this property is "a seaside hotel" — any other estate name (e.g., "Caldwell Manor", "Ashwood Hall", or any invented proper name) is a continuity error that will be caught and rejected.

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
    "title": "Initial Interrogations",
    "setting": {
      "location": "the hotel dining room",
      "timeOfDay": "Midday",
      "atmosphere": "A tense atmosphere as the detective conducts initial interrogations."
    },
    "characters": [
      "Hugo Vane",
      "Captain Ivor Hale",
      "Dr. Mallory Finch",
      "Beatrice Quill"
    ],
    "purpose": "Conduct initial interrogations and reveal early clues.",
    "cluesRevealed": [
      "clue_11",
      "clue_culprit_direct_captain_ivor_hale"
    ],
    "dramaticElements": {
      "conflict": "Suspects grow defensive as Hugo presses for answers.",
      "tension": "The atmosphere thickens with suspicion and fear.",
      "microMomentBeats": [
        "Beatrice's eyes dart nervously as she avoids Hugo's gaze."
      ]
    },
    "summary": "Hugo Vane interrogates the suspects in the dimly lit dining room. He learns that Eleanor saw Captain Hale entering the victim's room shortly before the murder, while a head wound indicating blunt force trauma is discovered on the body. The detective notes that Hale's initials are found on a hat near the scene.",
    "beat": "first_enquiries",
    "estimatedWordCount": 1800,
    "pivotElement": "The head wound on the victim indicating blunt force trauma.",
    "factEstablished": "Confirms that Captain Hale was present before the murder, linking him to the victim.",
    "permittedBehavioursByAct": [
      {
        "characterName": "Hugo Vane",
        "behaviour": "Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted."
      },
      {
        "characterName": "Eleanor Voss",
        "behaviour": "Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted."
      },
      {
        "characterName": "Captain Ivor Hale",
        "behaviour": "Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted."
      },
      {
        "characterName": "Dr. Mallory Finch",
        "behaviour": "Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted."
      },
      {
        "characterName": "Beatrice Quill",
        "behaviour": "Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted."
      }
    ],
    "redHerringPlacement": null,
    "emotionalRegister": "The initial investigation begins, filled with confusion and uncertainty as guests become suspects.",
    "dominantCharacterNote": {
      "name": "Eleanor Voss",
      "voiceRegister": "Eleanor speaks with a warm, inviting tone, often softening her voice when addressing uncomfortable topics."
    },
    "humourGuidance": {
      "permission": "forbidden"
    },
    "eraTextureNote": "Limited access to public transportation due to post-war recovery.; Heavy winter weather restricting outdoor activities.; Rationing of goods affecting the availability of food and resources.",
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
□ Chapter 3: the clue [clue_10] (witnesses, hotel, manager, present, minutes, past, eleven) is placed in the first 25% of the chapter, dramatized in your own words, followed by an explicit inference or suspicion paragraph.
□ Chapter 3: the clue [clue_11] (head, wound, victim, indicating, blunt, force, trauma) is placed in the first 25% of the chapter, dramatized in your own words, followed by an explicit inference or suspicion paragraph.
□ Chapter 3: the clue [clue_culprit_direct_captain_ivor_hale] (direct, ties, captain, ivor, hale, mechanism, access, point, before, discriminating, excludes, competing) is placed in the first 25% of the chapter, dramatized in your own words, followed by an explicit inference or suspicion paragraph.
□ Chapter 3: the clue [clue_hat_initials] (manager, left, nine, forty, five, creating, window, murder) is placed in the first 25% of the chapter, dramatized in your own words, followed by an explicit inference or suspicion paragraph.
□ Chapter 3: the clue [clue_manager_absence] (witnesses, hotel, manager, present, minutes, past, eleven) is placed in the first 25% of the chapter, dramatized in your own words, followed by an explicit inference or suspicion paragraph.
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
