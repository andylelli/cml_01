# Actual Prompt Record

- Run ID: `mystery-1784244374547`
- Project ID: ``
- Timestamp: `2026-07-16T23:35:49.986Z`
- Agent: `Agent9-ProseGenerator-Ch1`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4.1`
- Temperature: `0.42`
- Max Tokens: `4500`
- Attempt: `first`
- Prompt Hash: `d8f03ab0077a7318`

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
- MORAL COMPLEXITY REQUIREMENT: The mechanism of this crime carries a moral gray area: "The murderer acted out of desperation to protect a loved one, making their actions more sympathetic despite the crime." — the culprit reveal and denouement MUST acknowledge this ambiguity. Do not let the ending feel clean or simple. Give the reader at least one moment of uncomfortable sympathy or moral doubt.

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
   - Captain Ivor Hale: Secret Keeper
   - Beatrice Quill: Ambitious Rival
   - Sylvia Trent: Protective Matriarch
   - Hugo Vane: Cynical Observer
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
  Public identity anchor: local artist; detective 
  Connection to victim: childhood friends who drifted apart; Eleanor and Mallory grew up together but became distant due to differing life choices..
  Investigation relevance: is actively driving interviews and credibility checks in this scene.
  Suspicion/pressure cue seed: Personal redemption..
  Investigator read: include one immediate observational inference (gesture, gaze target, pause, object grip), but do not state guilt as fact.

- Captain Ivor Hale
  Public identity anchor: military officer; suspect 
  Connection to victim: secret love triangle with the victim; Mallory and Ivor are both in love with the same person, creating a volatile situation..
  Investigation relevance: access plausibility: high | alibi window: none.
  Suspicion/pressure cue seed: Romantic interest..
  Investigator read: include one immediate observational inference (gesture, gaze target, pause, object grip), but do not state guilt as fact.

- Beatrice Quill
  Public identity anchor: socialite; suspect 
  Connection to victim: directly affected by Dr. Mallory Finch's death and its fallout.
  Investigation relevance: access plausibility: medium | alibi window: none.
  Suspicion/pressure cue seed: Professional integrity..
  Investigator read: include one immediate observational inference (gesture, gaze target, pause, object grip), but do not state guilt as fact.

- Sylvia Trent
  Public identity anchor: hotel owner; suspect 
  Connection to victim: directly affected by Dr. Mallory Finch's death and its fallout.
  Investigation relevance: access plausibility: high | alibi window: none.
  Suspicion/pressure cue seed: Financial security..
  Investigator read: include one immediate observat
[truncated for prompt budget]

WORLD DOCUMENT (use this as your primary creative context):

## Era: 1942-03
Living through March 1942 is marked by a continuous tension, where the war influences every aspect of daily life. The overcast skies and intermittent rain reflect the gloomy atmosphere, while rationing pressures force people to adapt their lifestyles. The community is bound by shared secrets and whispers of espionage, creating an unsettling environment where trust is scarce. The scent of damp earth and the sound of distant thunder serve as constant reminders of the chaos beyond, while the flickering light of radios broadcasting war news heightens the sense of urgency and anxiety. Social gatherings often revolve around discussions of the ongoing conflict, reflecting the collective struggle for stability amidst uncertainty.
Emotional register: The dominant emotional state is one of anxiety and uncertainty, compounded by the burdens of war.
Physical constraints: Limited availability of goods due to war rationing. | Travel restrictions and increased scrutiny on movements. | Social gatherings are often tense and focused on war-related topics.
Current tensions (weave into background texture): The Battle of the Atlantic escalates, increasing U-boat threats. | The U.S. mobilizes for war, affecting community dynamics. | Rationing impacts daily life, leading to inflation and black markets.
Wartime context — Many men are enlisted, with women increasingly filling roles in factories and support services.: Communities rally together for support, yet tensions rise as class divides become more pronounced. Absence effect: The absence of loved ones in service creates an emotional void, heightening feelings of fear and loneliness.

## Story Theme
The story explores the intricate interplay between personal secrets and public personas against the backdrop of wartime tensions, revealing how deception can distort both perceptions and realities.

## Story Emotional Register
Dominant: The overall emotional character of the story is one of tension and revelation, marked by hidden truths and personal stakes.

Arc:
In the Grand Seaside Hotel, the atmosphere is charged with expectation as guests gather for an event, setting the stage for an unexpected tragedy. When Dr. Mallory Finch is discovered murdered, stabbed with a letter opener, the weight of the crime looms heavily over the attendees, their personal secrets intertwining with the investigation. Detective Eleanor Voss, determined to seek justice, delves into a web of deceit, uncovering clues that lead her down a path of rising unease.

Each piece of evidence reveals more about the characters than the murder itself, compelling Eleanor to confront her own hidden past with the victim. As the investigation deepens, a shocking revelation shifts the entire narrative, changing how she perceives her fellow suspects. The emergence of a crucial clue forces her to reevaluate everything she thought she knew, leading to a climactic confrontation where truths are unveiled and tensions reach a boiling point. In the aftermath, the emotional cost of the investigation weighs heavily on each character, leaving them to grapple with the consequences of their actions and the shadows of their pasts. The resolution offers a bittersweet closure, where personal redemption intertwines with the haunting memories of their shared experience, forever altering their lives.

## Emotional register at this point in the story
The opening scene is filled with anticipation and a sense of impending doom.

## Character Portraits (appearance & era)

### Eleanor Voss
Eleanor Voss, a local artist, navigates the complexities of her secret past against the backdrop of a society pressured by war. Her vibrant public persona contrasts sharply with her hidden guilt over her affair with Dr. Finch, making her a deeply conflicted character. The war's impact on community dynamics amplifies her fears of exposure and judgment, as the stakes of her personal redemption intertwine with the broader social anxieties of the time.
Era intersection: Eleanor's struggles reflect the shifting gender roles of the 1940s, where women's contributions are increasingly recognized, yet societal expectations remain rigid.

### Captain Ivor Hale
Captain Ivor Hale is a charismatic figure caught between his military duties and the haunting memories of his past with Dr. Finch. His charm masks deeper insecurities about his career and reputation, exacerbated by the pressures of wartime expectations. Ivor's internal conflict mirrors the tension of the era, where personal relationships are complicated by public personas, forcing him to navigate a treacherous landscape of loyalty and betrayal.
Era intersection: Ivor's struggles highlight the conflict between duty and desire that many men faced as they balanced personal relationships with their roles in a global conflict.

### Beatrice Quill
Beatrice Quill's glamorous façade hides a ruthless ambition driven by societal pressures to secure her status. As the investigation unfolds, her past actions threaten to unravel her carefully curated image, revealing the lengths to which she will go to maintain her position in a world reshaped by war. Her character embodies the complexities of female ambition during the 1940s, illustrating the challenges women faced in a rapidly changing social landscape.
Era intersection: Beatrice's ambition reflects the societal expectations of women during the war, as they navigated traditional roles while striving for independence and recognition.

### Sylvia Trent
Sylvia Trent, the strong-willed hotel owner, grapples with the ghosts of her past affair with Dr. Finch, which endangers her reputation and her business. The pressures of maintaining her hotel under the weight of wartime scrutiny intensify her internal struggles, forcing her to confront the consequences of her choices. Sylvia's character illustrates the dual burdens of professional ambition and personal guilt faced by women entrepreneurs in the 1940s.
Era intersection: Sylvia's experience reflects the challenges faced by women who sought to maintain their independence and authority during a time of significant societal upheaval.

### Hugo Vane
Hugo Vane is a sharp-tongued journalist whose cynical outlook on life masks insecurities intensified by the war's impact on journalism. As he navigates the murder investigation, he must confront his biases and the evolving role of women in society, challenging his views on power and influence. Hugo's character represents the struggle of traditional media figures to adapt to a rapidly changing landscape, where outdated beliefs are increasingly scrutinized.
Era intersection: Hugo's skepticism reflects the societal tensions of the 1940s, where changing norms around gender and race confronted established hierarchies.

## Character Voices

### Eleanor Voss (she/her/her)
Eleanor speaks with an artistic flair, her words flowing gracefully as she navigates complex emotions.
[comfortable] Ah, the beauty in chaos. It's like painting with shadows.
[evasive] I was simply caught up in the moment, you know how it is.
[stressed] This isn't just about the murder; it's about everything I've hidden!
Humour: Eleanor's dry wit often surfaces unexpectedly, adding depth to her character.

### Captain Ivor Hale (he/him/his)
Ivor's speech is confident and engaging, often laced with sardonic humor that masks his inner turmoil.
[comfortable] Ah, but what is life without a little risk?
[evasive] Let's not dwell on the past; it's better left untouched.
[stressed] I can’t let this scandal ruin everything I’ve worked for!
Humour: Ivor's sardonic humor adds complexity to his character, revealing his struggles beneath the surface.

### Beatrice Quill (she/her/her)
Beatrice's articulate speech is often laced with sharp wit, making her conversations engaging.
[comfortable] It's all about the presentation, darling; don't you agree?
[evasive] Oh, I wouldn't know anything about that; I was simply mingling.
[stressed] If they find out, my entire future is at stake!
Humour: Beatrice's polite savagery often reveals her true feelings in a veiled manner.

### Sylvia Trent (she/her/her)
Sylvia’s speech is direct and authoritative, often masking her vulnerabilities with dry humor.
[comfortable] Standards must be upheld, no matter the circumstances.
[evasive] I assure you, everything is under control here.
[stressed] If my past comes to light, it could destroy everything I've built!
Humour: Sylvia uses dry wit as a defense mechanism during tense discussions.

### Hugo Vane (he/him/his)
Hugo's sharp wit and cynical edge define his speech, often employing sarcasm.
[comfortable] The world is a stage, and we're all merely players.
[evasive] I’ve no time for trivial matters; let’s stick to the facts.
[stressed] This investigation is exposing more than just the murder!
Humour: Hugo's observational humor often highlights his insecurities in a changing world.

## Location Registers (scene framing guides)

Grand Lobby: The Grand Lobby feels heavy with secrets and tension, a gathering place where whispers of suspicion linger in the air. The scent of dampness and salt mingles with the murmurs of guests, creating an atmosphere thick with unease as the storm rages outside.. Camera angle: A writer entering this space should capture the contrast between the lobby's elegance and the underlying tension, setting the stage for a drama steeped in secrets.. Era: The overcast skies mirror the emotional turmoil of the characters within, heightening the sense of anticipation.

Private Balcony: The Private Balcony offers a moment of respite amidst the chaos, yet it feels charged with the weight of secrets and past encounters. The crashing waves below echo the turmoil within, creating an atmosphere of tension and anticipation as conversations unfold.. Camera angle: A writer should approach this location with a sense of intimacy, capturing the delicate balance between beauty and the looming threat of revelation.. Era: The isolation of this space emphasizes the characters' struggles to maintain their carefully constructed facades.

Library: The Library is a sanctuary of quiet contemplation, but it is also a place heavy with unspoken fears. The flickering firelight casts shadows that seem to whisper of secrets, creating an air of unease as guests confront their truths.. Camera angle: A writer should evoke a sense of nostalgia and tension, balancing the tranquility of the library with the storm brewing outside.. Era: This space reflects the societal pressures of the 1940s, where the pursuit of knowledge is intertwined with the burden of hidden pasts.

Dining Room: The Dining Room is alive with the sounds of clinking cutlery and soft conversations, yet an undertone of tension permeates the air. As guests dine, the looming threat of exposure hangs over them, turning the elegant setting into a battleground of secrets.. Camera angle: A writer should capture the juxtaposition of the dining room's elegance with the underlying tension, framing each character's response to the atmosphere.. Era: The war's impact is palpable in the way guests engage in hushed tones, reflecting the uncertainty of the times.

## Humour guidance for this story position (opening)
Permission: permitted
Characters who may be funny: Eleanor Voss
Permitted forms: dry_wit
Rationale: Eleanor's dry wit can subtly enhance the opening atmosphere.

FAIR-PLAY AND INFERENCE CONTRACT:
- FAIR PLAY CLUE TIMING: Never combine clue discovery and detective deduction in the same chapter. If a clue is first revealed to the reader in chapter N, the detective may only analyze, deduce from, or act on that clue in chapter N+1 or later.
- FAIR PLAY INFORMATION PARITY: The reader must see all clues BEFORE the detective uses them in reasoning. If the detective performs a test or makes a deduction, every piece of evidence supporting that conclusion must have been shown to the reader in earlier chapters.
- FAIR PLAY REVELATION SPACING: In the discriminating test scene, the detective can ONLY use clues that were revealed to the reader at least 1 full chapter earlier. Never introduce new clues or withheld information during the test.
- FAIR PLAY CONFRONTATION: During the final confrontation/revelation, the detective cannot surprise the reader with facts. Every piece of evidence cited must have been visible to the reader in prior chapters.
- Never solve by withheld information. Keep reader-information parity with detective reasoning.
- False assumption in force: The murderer was seen in the lobby at the time of the murder.
- Hidden truth to progressively expose (compose in your own words from these elements): true, location, murderer, elsewhere, hidden, sight
- Inference path checkpoints to dramatize clearly — compose ENTIRELY in your own sentences from these key terms (reproducing any briefing phrase verbatim FAILS validation):
  - Step 1: obs: witnesses, reported, seeing, figure, lobby, before, murder | corr: figure, seen, reflection, mirror, actual, murderer | effect: eliminates, suspect, seen, being, murderer
  - Step 2: obs: footprints, leading, away, mirror | corr: footprints, indicate, someone, exited, scene, being, seen | effect: narrows, suspects, access, lobby
  - Step 3: obs: angle, mirror, adjusted, evidenced, scratches, surface | corr: indicates, tampering, create, false, sightline | effect: points, premeditation, involving, knowledge, lobby, layout
- Discriminating test method: trap
- Discriminating test elements to dramatize (compose ENTIRELY in your own sentences from these — do NOT reproduce any briefing phrase verbatim): enacting, murder, scene, mirror, adjusted, original, position, reveals, true, sightline
- Test must rely on already-shown clue IDs: clue_core_contradiction_chain, clue_mechanism_visibility_core, clue_8
- Fair-play rationale: Step 1: The witness reports (early) clarify the reflection issue. Step 2: Footprint evidence (mid) points to the escape route. Step 3: Mirror tampering (discriminating test) exposes the setup.

## Character Reference

### Eleanor Voss (she/her — NEVER he/him)
Eleanor speaks with an artistic flair, often embellishing her thoughts with vivid imagery
Her speech flows gracefully, punctuated by occasional sharp observations that reveal her inner turmoil.
Eleanor grapples with guilt over her affair with the victim, fearing that the truth will destroy her standing in the community she cherishes.
Voice colour: Eleanor Voss uses dry wit humour — let it surface in their dialogue where natural, not in every line.

### Captain Ivor Hale (he/him — NEVER she/her)
Ivor speaks with a confident and engaging tone, often employing charm to disarm those around him
His dialogue is peppered with witty remarks and a subtle edge, reflecting his inner turmoil.
Ivor is torn between his desire to protect his military career and the lingering guilt over his past relationship with the victim, which threatens to surface.
Voice colour: Captain Ivor Hale uses sardonic humour — let it surface in their dialogue where natural, not in every line.

### Beatrice Quill (she/her — NEVER he/him)
Beatrice's speech is articulate and polished, often laced with sharp wit
She has a penchant for dramatic pauses and a flair for the theatrical, making her conversations engaging and memorable.
Beatrice grapples with the fear that her ambition has led her down a dark path, questioning whether her pursuit of wealth and status is worth the cost.
Voice colour: Beatrice Quill uses polite savagery humour — let it surface in their dialogue where natural, not in every line.

### Sylvia Trent (she/her — NEVER he/him)
Sylvia’s speech is direct and authoritative, reflecting her role as a hotel owner
She often employs dry humor to mask her vulnerabilities, using it as a defense mechanism when faced with uncomfortable truths.
Sylvia struggles with the guilt of her past affair, fearing that its revelation could destroy both her reputation and her hotel.
Voice colour: Sylvia Trent uses dry wit humour — let it surface in their dialogue where natural, not in every line.

### Hugo Vane (he/him — NEVER she/her)
Hugo's speech is characterized by a sharp wit and a cynical edge
He often employs sarcasm and irony, using humor as a defense mechanism against his insecurities.
Hugo struggles with his biases against women and the changing societal norms, fearing that his views will render him obsolete.
Voice colour: Hugo Vane uses observational humour — let it surface in their dialogue where natural, not in every line.


## CHARACTER CONTRACTS (binding for this scene)
Each entry below constrains how this character must be written in this chapter.
These override generic style guidance when they conflict.

### Eleanor Voss[SHE]
Voice & mannerisms: Eleanor speaks with an artistic flair, often embellishing her thoughts with vivid imagery. Her speech flows gracefully, punctuated by occasional sharp observations that reveal her inner turmoil.
SIGNATURE TIC (use sparingly — this is Eleanor Voss's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "Ah, the beauty in chaos."
Sample voice fragments (match this register and rhythm):
  [comfortable] "Ah, the beauty in chaos. It's like painting with shadows."
  [evasive] "I was simply caught up in the moment, you know how it is."
Humour: dry wit — deploy occasionally (level 0.5)
FORBIDDEN phrase (never write for Eleanor Voss): "a surge of determination washed over her"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "none" — do not surface in Act I.

### Captain Ivor Hale[HE]
Voice & mannerisms: Ivor speaks with a confident and engaging tone, often employing charm to disarm those around him. His dialogue is peppered with witty remarks and a subtle edge, reflecting his inner turmoil.
SIGNATURE TIC (use sparingly — this is Captain Ivor Hale's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "Ah, but what is life without a little risk?"
Sample voice fragments (match this register and rhythm):
  [comfortable] "Ah, but what is life without a little risk?"
  [evasive] "Let's not dwell on the past; it's better left untouched."
Humour: sardonic — deploy occasionally (level 0.6)
FORBIDDEN phrase (never write for Captain Ivor Hale): "palpable tension filled the room"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Fearing scandal from his past with the victim that could derail his career." — do not surface in Act I.

### Beatrice Quill[SHE]
Voice & mannerisms: Beatrice's speech is articulate and polished, often laced with sharp wit. She has a penchant for dramatic pauses and a flair for the theatrical, making her conversations engaging and memorable.
SIGNATURE TIC (use sparingly — this is Beatrice Quill's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "It's all about the presentation, darling."
Sample voice fragments (match this register and rhythm):
  [comfortable] "It's all about the presentation, darling; don't you agree?"
  [evasive] "Oh, I wouldn't know anything about that; I was simply mingling."
Humour: polite savagery — deploy frequently (level 0.7)
FORBIDDEN phrase (never write for Beatrice Quill): "she felt a wave of unease"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Desire to eliminate the victim, who posed a threat to her pursuit of a wealthy match." — do not surface in Act I.

### Sylvia Trent[SHE]
Voice & mannerisms: Sylvia’s speech is direct and authoritative, reflecting her role as a hotel owner. She often employs dry humor to mask her vulnerabilities, using it as a defense mechanism when faced with uncomfortable truths.
SIGNATURE TIC (use sparingly — this is Sylvia Trent's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "Standards must be upheld."
Sample voice fragments (match this register and rhythm):
  [comfortable] "Standards must be upheld, no matter the circumstances."
  [evasive] "I assure you, everything is under control here."
Humour: dry wit — deploy occasionally (level 0.4)
FORBIDDEN phrase (never write for Sylvia Trent): "a surge of determination washed over her"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Anger over the victim's intent to expose her past, which risks her hard-won reputation." — do not surface in Act I.

### Hugo Vane[HE]
Voice & mannerisms: Hugo's speech is characterized by a sharp wit and a cynical edge. He often employs sarcasm and irony, using humor as a defense mechanism against his insecurities.
SIGNATURE TIC (use sparingly — this is Hugo Vane's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "The world is a stage, and we're all merely players."
Sample voice fragments (match this register and rhythm):
  [comfortable] "The world is a stage, and we're all merely players."
  [evasive] "I’ve no time for trivial matters; let’s stick to the facts."
Humour: observational — deploy occasionally (level 0.5)
FORBIDDEN phrase (never write for Hugo Vane): "everyone could sense the atmosphere"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Threatened by the victim's influence on public opinion and desire to silence her." — do not surface in Act I.



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

Primary Location: The Grand Seaside Hotel (Brighton, England)
A grand seaside hotel with Art Deco elegance, shrouded in mystery and tension.

Key Locations Available:
- Grand Lobby (interior): Gathering space for guests
- Private Balcony (exterior): Secluded space for private conversations
- Library (interior): Quiet space for reading and reflection
- Dining Room (interior): Formal dining space for guests

Atmosphere (tonal cue only — do NOT reproduce this phrase verbatim in prose; translate into scene-specific, character-observed sensory language): Tense and uneasy, heightened by recent wartime experiences and rumors of espionage.
Weather: Overcast with intermittent rain, creating a moody, damp environment.

Era markers: Art Deco architecture and furnishings | Flickering gas lamps and radios broadcasting news | Heavy coats and rationed wartime clothing | Whispers of espionage and wartime secrets

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
Grand Lobby (interior):
  - Visual: gleaming marble floors, ornate chandeliers, plush velvet armchairs
  - Sounds: murmurs of conversation, footsteps on marble, crackling gas lamps
  - Scents: salt air mingling with dampness, tobacco smoke, freshly polished wood
  - Touch: cool marble underfoot, soft velvet upholstery

Private Balcony (exterior):
  - Visual: ocean waves crashing below, clouds swirling overhead, flower pots with coastal plants
  - Sounds: crashing waves, whistling wind, thunder rumbling in the distance
  - Scents: salty sea air, wet earth, fresh blooms
  - Touch: roughness of wrought iron railings, cool breeze against skin

Library (interior):
  - Visual: dark wood shelves lined with books, flickering firelight, plush armchairs
  - Sounds: crackling fireplace, soft rustle of pages, whispers of conversation
  - Scents: old leather and paper, smoky embers, dampness in the air
  - Touch: soft upholstery of armchairs, coolness of the stone floor

⛔ REFERENCE DATA — DO NOT TRANSCRIBE VERBATIM: The above profiles are structural guides only. Generate original prose that evokes these qualities; do not reproduce the exact phrasing or sentence structure of the profile paragraphs.

SCENE OPENING RULE: When opening a scene in a new location, write what the POV character directly observes and physically senses at that moment — not a general description of the room's qualities. The reader must feel present, not briefed. Sensory details must be observed by the character, not stated as fact about the place.

SENSORY WRITING TECHNIQUES:
- Opening p
[truncated for prompt budget]

## Texture Pool
Draw on these as opportunities arise — you are not required to use them.

- Living through March 1942 is marked by a continuous tension, where the war influences every aspect of daily life
- The overcast skies and intermittent rain reflect the gloomy atmosphere, while rationing pressures force people to adapt their lifestyles
- The community is bound by shared secrets and whispers of espionage, creating an unsettling environment where trust is scarce
- The scent of damp earth and the sound of distant thunder serve as constant reminders of the chaos beyond, while the flickering light of radios broadcasting war news heightens the sense of urgency and anxiety
- Social gatherings often revolve around discussions of the ongoing conflict, reflecting the collective struggle for stability amidst uncertainty.

TEMPORAL CONTEXT:

This story takes place in March 1942 during spring.

Seasonal Atmosphere:
- Weather patterns: overcast skies, intermittent rain, cool temperatures around 45°F
- Daylight: Days are gradually lengthening, with daylight lasting until about 6:30 PM.
- Seasonal activities: attending local theater productions, strolling through city parks to see early spring blooms, participating in community events to support war efforts
- Seasonal occasions: St. Patrick's Day (March 17)
- Season: spring

Period Fashion (describe naturally):
- Men formal: double-breasted navy suit, white dress shirt with a stiff collar, a tie featuring geometric patterns
- Men casual: tweed jacket with elbow patches, cotton trousers, button-up flannel shirt
- Men accessories: fedora hat, leather gloves, pocket watch
- Women formal: A-line dress with a cinched waist and knee-length hem, satin gloves, pearl necklace
- Women casual: blouse with puffed sleeves, high-waisted skirt, cardigan sweater
- Women accessories: cloche hat, silk scarf, nylon stockings

Cultural Context (reference naturally):
- Music/entertainment: Bing Crosby - 'White Christmas', Glenn Miller - 'In the Mood', Doris Day - 'Sentimental Journey'; Films: Casablanca, The Maltese Falcon; Theatre: The Glass Menagerie, The Man Who Came to Dinner; Radio: The Shadow, Gunsmoke
- Typical prices: Bread loaf: four pence, Movie ticket: one shilling, Newspaper: three pence
- Current events: The Battle of the Atlantic continues to escalate with increased U-boat activity; The United States begins to mobilize for war with troop deployments to Europe
- Literature: The Fountainhead by Ayn Rand | The Little Prince by Antoine de Saint-Exupéry | The Thin Man by Dashiell Hammett | [mystery] | [romantic fiction] | [war literature]
- Technology: the proximity fuse for artillery | early radar systems for spotting incoming aircraft | the first jet engine prototypes | battery-operated radios | manual typewriters | film cameras
- Daily life: attending neighborhood rallies for war support, volunteering for local charities, gathering at cafés to discuss news
- Social rituals: weekly family dinners, community dances to boost morale, tea parties to share rationing tips

Atmospheric Details:
The air is thick with the scent of wet earth and moss, a reminder of the rain that has swept through the city, leaving everything glistening under the muted light. Distant sounds of sirens and the low rumble of military vehicles passing by serve as a reminder of the ongoing war, creating an undercurrent of tension that fills the hotel lobby. The flickering light of a radio in the corner broadcasts news of the war, punctuated by the hushed conversations of guests discussing the latest rumors of espionage, heightening the atmosphere of unease.

FASHION INTEGRATION TECHNIQUES:
- First appearance: Describe outfit to establish class/personality
- Accessories: Gloves, hats, pocket watches, jewelry reveal status
- Time-specific: Different outfits for different times of day
- Character traits: Fastidious dresser vs rumpled appearance
- Action integration: "She tugged at her glove" or "He adjusted his tie"
- Weather appropriate: Overcoats in winter, light linen in summer

CULTURAL TOUCHSTONE INTEGRATION:
- Casual conversation: "Did you hear that new jazz record?" or "I saw the latest Chaplin film"
- Background details: R
[truncated for prompt budget]

NON-NEGOTIABLE CHAPTER OBLIGATIONS — LOCKED EVIDENCE VALUES (VERBATIM REQUIRED):
The following measured values (times, amounts, measurements) are absolute ground truth. Every time this chapter describes, mentions, or alludes to one — no matter how briefly — it MUST use the exact phrase shown below, character for character. NO paraphrase, approximation, rounding, or synonym is permitted.

FAILURE EXAMPLE: if the locked value is "at thirteen minutes to midnight" and you write "just before midnight" or "around midnight" — that is a HARD FAIL. You must write "at thirteen minutes to midnight". Equally, if the locked value is written in words, such as "ten minutes past eleven", and you convert it to figure-based clock notation — that is also a HARD FAIL. Words stay as words; figure forms are forbidden for word-phrased facts.

CRITICAL — WORD-PHRASED VALUES: If the canonical value is written out in words (e.g. a time like "ten minutes past eleven", or an amount like "forty minutes"), reproduce those exact words. DO NOT convert to figure-based time notation, twenty-four-hour format, or any other numeric shorthand. Correct: "ten minutes past eleven". WRONG: figure-based clock notation or numeric shorthand.

Locked values:
  - The angle of the mirror that creates the false reflection.: "thirty degrees"
  - The distance from the light source to the mirror.: "twenty feet"
  - The exact time of the murder, as indicated by the hotel clock.: "ten minutes past nine"
    ⛔ FORBIDDEN alternatives: "9:10", "9.10", "nine ten", "nine-ten", "nine past ten", "quarter past nine", "half past nine" — the ONLY acceptable form is "ten minutes past nine"

If a value has no relevance to this chapter, omit it. But the moment you reference the underlying evidence, only the exact phrase above is acceptable.

⛔ CLUES TO SURFACE IN THESE CHAPTERS — mandatory:
The following evidence MUST be clearly observable to an attentive reader. Do not bury it in atmosphere or passing dialogue. Each clue must be concrete, specific, and noticeable:

• [clue_mechanism_visibility_core] strategically, placed, mirror, lobby, created, false, visual, path, misleading, witnesses, murderer, location
  Category: spatial | Criticality: essential | Supports inference step 1
  Points to: mechanism, deception, regarding, murderer, location

For each clue above: an attentive reader should be able to find, record, and later use it to reason toward the solution.

═══ NARRATIVE STATE (read-only — do not contradict) ═══

LOCKED FACTS — use verbatim whenever this evidence is described:
  • The angle of the mirror that creates the false reflection.: "thirty degrees"
  • The distance from the light source to the mirror.: "twenty feet"
  • The exact time of the murder, as indicated by the hotel clock.: "ten minutes past nine"

CHARACTER PRONOUNS — never deviate from these:
  • Eleanor Voss: she/her/her
  • Dr. Mallory Finch: she/her/her
  • Captain Ivor Hale: he/him/his
  • Beatrice Quill: she/her/her
  • Sylvia Trent: she/her/her
  • Hugo Vane: he/him/his

INVESTIGATION LOG — WHAT IS ESTABLISHED (do not re-establish, do not repeat):
• Suspects still unresolved: Beatrice Quill[SHE], Sylvia Trent[SHE], Hugo Vane[HE]
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
Known location profile anchors: The Grand Seaside Hotel, Grand Lobby, Private Balcony, Library, Dining Room, the lobby of the Grand Seaside Hotel
LOCATION NAME CAPITALISATION (HARD REQUIREMENT — validated):
All named locations in your prose MUST use the EXACT capitalisation from the CML profiles.
Canonical forms: "The Grand Seaside Hotel", "Grand Lobby", "Private Balcony", "Library", "Dining Room", "the lobby of the Grand Seaside Hotel"
Writing a location in lowercase (e.g. "drawing room" instead of "Drawing Room") is a validated error. Every time you mention a named location, copy its capitalisation from the list above.
- Chapter 1: OPENING STYLE (HARD): Start the VERY FIRST SENTENCE with a named character performing a physical action or motion — e.g. "[Name] crossed the threshold…" / "[Name] set down the glass…" / "[Name] rose from the chair…". Anchor opening in "the lobby of the Grand Seaside Hotel". The opening style above governs only your FIRST SENTENCE; the grounding below may land anywhere in the first 2 paragraphs (it need not be sentence one, and never conflicts with the chosen opening style). HARD REQUIREMENT for the first 2 paragraphs: (a) include 2+ sensory words — choose from smell/scent/odor/fragrance/sound/echo/silence/whisper/creak/cold/warm/damp/rough/smooth/glow/shadow/flicker/dim — and (b) include 1+ atmosphere/time word — choose from rain/wind/fog/storm/mist/thunder/evening/morning/night/dawn/dusk/lighting/weather/season/afternoon/midday/noon/midnight/twilight/sunrise/sunset/daylight/sunlight/overcast/cloudy/bright/dark/grey/pale/chill/crisp/drizzle/haze/lamplight/firelight. These are validated requirements, not style suggestions; missing them triggers a retry.

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

PROMPT BUDGET SUMMARY: budget=24000 tokens; fixed=7624; context=12261; dropped=[none]; truncated=[first_appearance_contracts, location_profiles, temporal_context, pronoun_accuracy]

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
4. Integrate at least two concrete era-grounded details per chapter from setting refinement signals: radio broadcasting | early television sets | military radar systems | party-line telephones | long-distance calls with delays | military encryption methods.
5. Respect setting movement/access constraints in scene action and alibis: narrow hallways limiting movement | balconies with restricted access | stormy weather restricting outdoor access | restricted staff-only areas | guest room privacy protocols.
6. Sustain social coherence with this backdrop pressure: A tense gathering at a grand seaside hotel, where the specter of wartime anxiety and emerging Cold War tensions forces a disparate group of guests and staff to confront their secrets under the watchful eyes of a distorted reflection.
7. Maintain continuity around these socially central cast anchors where relevant: Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill, Sylvia Trent, Hugo Vane.
8. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Critical: Plot similarity 0.85 with 'The Second Key' (same spatial deception method and era)
9. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Moderate: Character similarity 0.75 with 'The Second Key' (mirrored roles of captain and doctor)

CRITICAL PROSE REQUIREMENTS:

The CML specifies exact requirements for certain validation-critical scenes. You MUST include these elements at the specified positions.

**Discriminating Test Scene (Act 3, Scene 4):**
Required elements: Execute the discriminating test, Observe the culprit's reaction or result, Draw conclusion about guilt
Test type: spatial deception

**Suspect Clearance Scenes:**
- Beatrice Quill (Act 3, Scene 5): Confirmed she was in the dining room at the time.
  Clues: Witness statement from dining guests., Access records.
- Hugo Vane (Act 3, Scene 5): Evidence shows he was in a meeting during the murder.
  Clues: Meeting logs., Witness testimonials.
- Sylvia Trent (Act 3, Scene 5): Alibi confirmed: none

**Culprit Revelation Scene (Act 3, Scene 6):**
Method: Confrontation with evidence

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
Suspect pressure target(s): Captain Ivor Hale, Beatrice Quill, Sylvia Trent, Hugo Vane
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
  - VICTIM IDENTITY LOCK (MANDATORY): name the victim as "Dr. Mallory Finch" in the discovery scene. After first mention, do not use unnamed placeholders such as "the victim" without naming Dr. Mallory Finch in the same paragraph.
  - Opening: Begin with a character action, spoken line, or clock/time marker — never a location name or location-description phrase.
  - Scene is set in: the lobby of the Grand Seaside Hotel — reference it naturally within the paragraph, never as your opening phrase.
  - Opening atmosphere (MANDATORY — validator enforced): the first paragraph MUST contain at least one of: rain / wind / fog / storm / mist / thunder / evening / morning / night / dawn / dusk / season / afternoon / midday / noon / midnight / twilight / sunrise / sunset / daylight / sunlight / overcast / cloudy / bright / dark / grey / pale / cold / warm / chill / crisp / damp / drizzle / haze / lamplight / firelight. A chapter that omits all of these from its opening paragraph will be rejected.
  - PARAGRAPH OPENER DIVERSITY (MANDATORY — validator enforced): No more than 2 paragraphs in this chapter may begin with "Eleanor" or "Eleanor's" as the first word. You must vary paragraph openings throughout: use sensory observations, another character's name or action, dialogue, object or sound details, or temporal markers. Opening 3 or more paragraphs with "Eleanor" will cause automated rejection.
  - INVESTIGATOR ESTABLISHMENT REQUIRED: Eleanor Voss must claim or be recognised as the investigator in this chapter. Establish Eleanor Voss as the detective-in-charge within the first two paragraphs — Eleanor Voss IS the investigator. Do NOT have any character suggest a "real" detective is still coming, or imply that authority has not yet been delegated. Eleanor Voss begins the investigation in this chapter.
  - ⛔ BODY DISCOVERY ORDER (MANDATORY — Chapter 1 only): the victim's body must be physically encountered or described within the first TWO paragraphs. Do NOT spend the opening paragraphs solely on clock examination, atmospheric setup, or character introductions before the body is found. Required Chapter 1 structure: atmosphere (one sentence max) → body/discovery → investigator reaction → suspects → first time-source contradiction.
  - ⛔ MECHANISM SPOILER BAN: Do NOT state how the crime device was manipulated — not the direction, not the magnitude, not who performed it. Characters may only observe that two sources of evidence disagree. The specific method, tamper amount, and perpetrator's action are ALL FORBIDDEN until the reveal. WRONG: "The culprit had altered the device by forty minutes to create a false alibi." RIGHT: "Two independent pieces of evidence gave contradictory readings — a discrepancy neither could yet explain."
  - CLUE OBLIGATIONS — each clue below MUST be dramatized, but in YOUR OWN WORDS:
    Render each as something a character SEES, DOES, or SAYS on the page. The bracketed text is a
    DESCRIPTION of the evidence for you — do NOT transcribe it as narration. Copying a clue's
    description sentence verbatim into the prose FAILS validation.
    • witnesses, reflection, lobby, mirror [clue_mechanism_visibility_core] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      ⛔ SPOILER EMBARGO (pre-reveal chapter): surface ONLY the surface anomaly a character can see/hear/find.
         Do NOT name who it implicates, state the tamper direction or magnitude, or explain the mechanism in this chapter.
         Present it as an unexplained discrepancy; the culprit and method are revealed later.
         Place this OBSERVATION in paragraph 1 or 2 (observation only — no inference about the culprit).
  - Tonal contrast: include at least one beat of relief or ironic counterpoint. Do not sustain maximum tension for every paragraph.
  - CLUE DISCLOSURE RULE (Stage 1/4):
    Characters may OBSERVE anomalies (wrong time, missing object, odd detail) but must NOT explain the mechanism, deduce the method, or name the culprit. Discovery and reaction only.
    WRONG: dialogue or narration that directly explains how the crime was committed before Stage 4.
    RIGHT: observation, physical reaction, and logical inference that leaves the mechanism just off-screen.
  - ALIBI LOCK: Captain Ivor Hale's established alibi is "none". Do NOT place Captain Ivor Hale at any other location or in any other activity during the crime window. Any contradiction is a continuity error that triggers a retry.
- Locked fact phrase obligations:
  - If this batch mentions The angle of the mirror that creates the false reflection., write exactly: "thirty degrees".
  - If this batch mentions The distance from the light source to the mirror., write exactly: "twenty feet".
  - If this batch mentions The exact time of the murder, as indicated by the hotel clock., write exactly: "ten minutes past nine".
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
Batch chapters: 1-1.
Investigation state at start: 0 clue(s) revealed to reader; approximately 3 unresolved suspect(s).
Must change by end: Introduce cast relevance and plant first clue while keeping culprit unresolved.
Suspect pressure target(s): Captain Ivor Hale, Beatrice Quill, Sylvia Trent, Hugo Vane
Required new information: First clue observation tied to suspect landscape.
Forbidden reveals at this stage: No culprit reveal. | No full murder mechanism explanation. | Do not state the direction, magnitude, or agent of any clock or device tampering. Characters may only observe that two time sources disagree. "The clock was wound back by forty minutes" must not appear before Chapter 3.

FROZEN FACT STATE (DO NOT ALTER):
- Timeline anchor: March (spring).
- Month, season, weather, and time-of-year language in this batch must stay compatible with spring.
- Established timeline fact: The murder occurred during dinner service.
- If referenced, use exact phrase: "thirty degrees" (The angle of the mirror that creates the false reflection.).
- If referenced, use exact phrase: "twenty feet" (The distance from the light source to the mirror.).
- If referenced, use exact phrase: "ten minutes past nine" (The exact time of the murder, as indicated by the hotel clock.).

STORY TO DATE (REFERENCE ONLY — DO NOT COPY VERBATIM):
- No previous chapter text exists yet for this batch.

[SCENE COMPLETENESS CONTRACTS — MANDATORY. Each contract below lists what you MUST enact in that chapter. Do not summarise or mention these labels in the prose — enact them organically.]
Chapter 1 (Act 1) completeness contract:
  PIVOT ELEMENT (MANDATORY — write this into the prose, shown not told): "The body of the victim lying on the lobby floor."
  FACT ESTABLISHED (MANDATORY — reader must know this by chapter end): "Establishes the victim was found in the lobby, indicating a public location with multiple witnesses."

# Case Overview
Title: Reflections of Deceit
Era: 1940s
Setting: Grand Seaside Hotel
Crime: murder (spatial deception)
Culprit: Captain Ivor Hale
Victim: Dr. Mallory Finch
False assumption: The murderer was seen in the lobby at the time of the murder.
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
      "location": "the lobby of the Grand Seaside Hotel",
      "timeOfDay": "Morning after the murder",
      "atmosphere": "Tense, with whispers of unease among hotel guests"
    },
    "characters": [
      "Eleanor Voss",
      "Dr. Mallory Finch",
      "Captain Ivor Hale",
      "Beatrice Quill",
      "Sylvia Trent",
      "Hugo Vane"
    ],
    "purpose": "Introduce the crime and detective",
    "cluesRevealed": [
      "clue_mechanism_visibility_core"
    ],
    "dramaticElements": {
      "conflict": "The tension between guests as the investigation begins",
      "tension": "The discovery of the victim's body adds urgency",
      "microMomentBeats": [
        "Eleanor's heart races as she steps into the lobby, feeling the weight of the atmosphere."
      ]
    },
    "summary": "As Eleanor Voss enters the lobby of the Grand Seaside Hotel, the air is thick with tension. She discovers the body of the unknown victim sprawled on the floor, and the shocked faces of Dr. Mallory Finch and Captain Ivor Hale loom nearby. A reflection in the lobby mirror causes her to question the statements of those present.",
    "beat": "gathering",
    "estimatedWordCount": 1800,
    "pivotElement": "The body of the victim lying on the lobby floor.",
    "factEstablished": "Establishes the victim was found in the lobby, indicating a public location with multiple witnesses.",
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
        "characterName": "Sylvia Trent",
        "behaviour": "Show normal social behaviour; grief or confusion if appropriate."
      },
      {
        "characterName": "Hugo Vane",
        "behaviour": "Show normal social behaviour; grief or confusion if appropriate."
      }
    ],
    "redHerringPlacement": null,
    "emotionalRegister": "The opening scene is filled with anticipation and a sense of impending doom.",
    "dominantCharacterNote": {
      "name": "Eleanor Voss",
      "voiceRegister": "Eleanor speaks with an artistic flair, her words flowing gracefully as she navigates complex emotions."
    },
    "humourGuidance": {
      "permission": "permitted",
      "character": "Eleanor Voss",
      "form": "dry_wit"
    },
    "eraTextureNote": "Limited availability of goods due to war rationing.; Travel restrictions and increased scrutiny on movements.; Social gatherings are often tense and focused on war-related topics.",
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
□ Chapter 1: the clue [clue_mechanism_visibility_core] (strategically, placed, mirror, lobby, created, false, visual, path, misleading, witnesses, murderer, location) is placed in the first 25% of the chapter, dramatized in your own words, followed by an explicit inference or suspicion paragraph.
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
