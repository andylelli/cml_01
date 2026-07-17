# Actual Prompt Record

- Run ID: `mystery-1784061663248`
- Project ID: ``
- Timestamp: `2026-07-14T20:50:35.219Z`
- Agent: `Agent9-ProseGenerator-Ch3`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4.1`
- Temperature: `0.64`
- Max Tokens: `4500`
- Attempt: `retry 1`
- Prompt Hash: `14eaae0873442c06`

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
- MORAL COMPLEXITY REQUIREMENT: The mechanism of this crime carries a moral gray area: "The murderer may have been driven by desperation to protect a loved one, complicating the morality of their actions." — the culprit reveal and denouement MUST acknowledge this ambiguity. Do not let the ending feel clean or simple. Give the reader at least one moment of uncomfortable sympathy or moral doubt.

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
   - Captain Ivor Hale: Disillusioned Veteran
   - Beatrice Quill: Ambitious Social Climber
   - Sylvia Trent: Creative Visionary
   - Hugo Vane: Cunning Businessman
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

## Era: February 1948
Living in February 1948 means navigating a landscape still haunted by the aftershocks of World War II, with the Cold War casting a long shadow over daily life. The air is thick with uncertainty, as families gather around crackling radios for news updates amidst the rising tensions in Europe. Fashion reflects a blend of elegance and practicality, with men in tailored suits and women in tea-length dresses, all while the specter of rationing looms. The coastal hotel, where our story unfolds, is emblematic of this time—a refuge for weary souls, yet layered with secrets and the weight of unspoken fears. Couples celebrate fleeting romance amid the backdrop of societal shifts, while the presence of fog symbolizes the obscured truths each character must confront.
Emotional register: A collective sense of anxiety and anticipation permeates the air.
Physical constraints: Fog limiting visibility and movement along coastal roads. | Rationing affecting food and supplies in the hotel. | Communication delays due to outdated technology.
Current tensions (weave into background texture): Rising tensions between the West and Soviet Union. | Continued economic struggles affecting daily life. | The effects of the Marshall Plan on European recovery.
Wartime context — Many characters are veterans or affected by wartime losses.: Women have stepped into roles traditionally held by men, challenging societal norms. Absence effect: The absence of loved ones lost to the war creates a haunting void.

## Season Lock (mandatory — derived from February 1948)
Season: winter. Allowed vocabulary: winter, wintry, midwinter
Forbidden seasonal words — never use in narration, dialogue, or metaphor: spring, summer, autumn and their adjectival forms.
Every weather description, atmosphere, and time-of-year reference must be consistent with winter.

## Story Theme
In a world shadowed by post-war anxieties, the quest for redemption reveals how the echoes of past choices shape our identities and relationships, and reveals that evidence carries ethical weight, forcing characters to choose accountability over social performance when appearances and facts collide.

## Story Emotional Register
Dominant: The story unfolds with a palpable tension that intertwines mystery and emotional turmoil.

Arc:
The narrative opens in the fog-shrouded lobby of The Ocean View Hotel, where the discovery of Dr. Mallory Finch's lifeless body sends shockwaves through the gathered guests. The atmosphere is heavy with shock and intrigue as Detective Eleanor Voss steps into the role of investigator, her own past failures looming in the background. As the investigation begins, initial clues emerge, but they lead to false leads, heightening the emotional cost for Eleanor as she juggles her guilt and her desire for justice.

A pivotal moment occurs when Eleanor uncovers a handwritten note in the victim's room, hinting at a clandestine meeting—an unexpected turn that shifts her focus and raises new questions about the relationships entwined in the hotel. The second turn comes when she learns of the gramophone's role in fabricating an alibi, transforming her understanding of the crime and the characters involved. The pressure mounts as Eleanor confronts each suspect, their secrets unearthing layers of deceit. The climax reveals the true culprit, forcing a confrontation that challenges not only Eleanor's investigative skills but her very sense of identity. In the resolution, the emotional costs of uncovering the truth weigh heavily on all characters—Eleanor grapples with her own redemption, while the others confront their hidden demons, leaving them forever changed by the echoes of their choices.

## Emotional register at this point in the story
Eleanor's investigation begins to uncover unsettling truths, raising her emotional stakes.

## Character Portraits (appearance & era)

### Eleanor Voss
Eleanor Voss navigates the post-war landscape as a travel writer, finding herself at a crossroads between her ambition and the shadows of her past. The war has reshaped the world around her, yet her personal battles with guilt and desire remain unchanged. In a society slowly reshuffling its norms, Eleanor’s quest for redemption resonates with many women seeking to redefine their identities.
Era intersection: Eleanor's struggles reflect the broader societal shifts of the 1940s, where women are increasingly taking on new roles while grappling with the remnants of traditional expectations.

### Captain Ivor Hale
Captain Ivor Hale is a war veteran haunted by his past, embodying the emotional scars left by conflict. His bitterness and unresolved grief create a tension that resonates with many men of his generation struggling to find their place in a world that has changed drastically. The societal shifts in gender roles are particularly jarring for him, as he grapples with feelings of loss and the burden of honor.
Era intersection: Ivor’s internal conflict mirrors the struggles of men returning from war, where the expectations of masculinity clash with the realities of a changing society.

### Hugo Vane
Hugo Vane embodies the cutthroat nature of post-war business, where ambition often leads to ethical compromises. His struggle to maintain his reputation in a competitive environment parallels the broader economic recovery efforts of the time, reflecting the anxieties of those striving to succeed in an uncertain landscape. The pressure of societal expectations weighs heavily on him, as he navigates the murky waters of morality.
Era intersection: Hugo’s character illustrates the challenges of post-war capitalism, where the past collides with the new realities of business ethics and personal accountability.

## Character Voices

### Eleanor Voss (she/her/her)
Eleanor speaks with a lilting cadence, often punctuating her observations with a sardonic twist.
[comfortable] Well, isn’t that just the icing on the cake? It’s a fine mess we’ve found ourselves in.
[evasive] Oh, I just happened to be in the right place at the right time. Nothing unusual about that.
[stressed] The weight of this investigation is heavier than I imagined; I can’t help but feel it’s all connected.
Humour: Eleanor's dry wit serves as both a shield and a means to deflect awkwardness.

### Captain Ivor Hale (he/him/his)
Ivor’s speech is clipped and direct, often tinged with bitterness.
[comfortable] It’s a hard life, isn’t it? You learn to cope or you don’t.
[evasive] I don’t see how my past matters now; the war is behind us.
[stressed] Memories can be ghosts, and they haunt me more than I’d like to admit.
Humour: Ivor's self-deprecating humor is a rare glimpse into his vulnerability.

### Hugo Vane (he/him/his)
Hugo speaks directly, often with a brusque tone that reflects his business acumen.
[comfortable] Let’s not beat around the bush; this is a matter of business.
[evasive] I don’t see the relevance of past dealings; we must look forward.
[stressed] The stakes are high, and I can’t afford any missteps.
Humour: His bluntness often masks an underlying anxiety about his standing.

## Location Registers (scene framing guides)

Grand Lobby: The Grand Lobby serves as the heart of the hotel, where guests mingle amid whispers of secrets and tension. The air is thick with anticipation, as each conversation hints at unspoken truths, creating an atmosphere ripe for intrigue.. Camera angle: A writer entering this space would feel the weight of history and the palpable tension among guests.. Era: The opulent decor contrasts sharply with the underlying anxiety of post-war life.

Dining Room: The Dining Room feels both indulgent and suffocating, where sumptuous meals are overshadowed by secrets simmering beneath the surface. Laughter mingles with tension, creating an environment charged with anticipation and unspoken fears.. Camera angle: A writer here would sense the contrast between opulence and the fragility of social bonds.. Era: The elegance of the setting is tainted by the underlying currents of suspicion.

Guest Room 312: Guest Room 312 offers a haven of introspection, where the gentle sounds of the sea evoke a sense of solitude. Yet, the room is layered with unease, as the walls seem to whisper the secrets of its occupants.. Camera angle: A writer would feel the intimate yet claustrophobic atmosphere, where every item holds meaning.. Era: The cozy decor belies the turmoil brewing within the characters.

Rooftop Terrace: The Rooftop Terrace presents a breathtaking yet vulnerable perspective, where the vast ocean mirrors the characters' internal struggles. The wind carries whispers of secrets, and the open space feels both liberating and fraught with tension.. Camera angle: A writer here would feel the raw energy of both nature and the characters’ concealed truths.. Era: The expansive views contrast with the confined emotions of the characters below.

## Humour guidance for this story position (early)
Permission: permitted
Characters who may be funny: Eleanor Voss
Permitted forms: dry_wit
Rationale: Eleanor's dry humor can surface as she navigates the investigation.

## Reveal Groundwork (texture — do not explain, only plant)
- Plant one subtle observable beat related to: "The moment Eleanor discovers the handwritten note her understanding of the victim's relationships". Do not explain significance yet.
- Plant one subtle observable beat related to: "The presence of the gramophone shifts suspicion and highlights the layers of deception among the suspects". Do not explain significance yet.
- Plant one subtle observable beat related to: "Plant one subtle anomaly that can be re-read after the resolution.". Do not explain significance yet.

FAIR-PLAY AND INFERENCE CONTRACT:
- FAIR PLAY CLUE TIMING: Never combine clue discovery and detective deduction in the same chapter. If a clue is first revealed to the reader in chapter N, the detective may only analyze, deduce from, or act on that clue in chapter N+1 or later.
- FAIR PLAY INFORMATION PARITY: The reader must see all clues BEFORE the detective uses them in reasoning. If the detective performs a test or makes a deduction, every piece of evidence supporting that conclusion must have been shown to the reader in earlier chapters.
- FAIR PLAY REVELATION SPACING: In the discriminating test scene, the detective can ONLY use clues that were revealed to the reader at least 1 full chapter earlier. Never introduce new clues or withheld information during the test.
- FAIR PLAY CONFRONTATION: During the final confrontation/revelation, the detective cannot surprise the reader with facts. Every piece of evidence cited must have been visible to the reader in prior chapters.
- Never solve by withheld information. Keep reader-information parity with detective reasoning.
- False assumption in force: The victim was alone in her room at the time of death.
- Hidden truth to progressively expose (compose in your own words from these elements): killer, present, used, recording, create, false, narrative, isolation
- Inference path checkpoints to dramatize clearly — compose ENTIRELY in your own sentences from these key terms (reproducing any briefing phrase verbatim FAILS validation):
  - Step 1: obs: gramophone, needle, still, groove, last, track | corr: indicates, recording, played, continuously, interrupted | effect: narrows, timeline, murder, recording, duration
  - Step 2: obs: handwritten, note, victim, room, suggested, meeting, minutes, past, eight | corr: note, implies, someone, expected, time, aligning, gramophone, playback | effect: eliminates, possibility, victim, alone
  - Step 3: obs: witnesses, recall, hearing, raised, voice, coinciding, gramophone, playback | corr: suggests, argument, took, place, indicating, presence, another, individual | effect: narrows, suspect, pool, access, victim, room
- Discriminating test method: trap
- Discriminating test elements to dramatize (compose ENTIRELY in your own sentences from these — do NOT reproduce any briefing phrase verbatim): playing, gramophone, recording, loud, volume, interrogating, suspects, observe, reactions, sound, timeline
- Test must rely on already-shown clue IDs: clue_2, clue_mechanism_visibility_core, clue_4, clue_early_1, clue_fp_contradiction_step_1
- Fair-play rationale: Step 1: The gramophone's needle position indicates it played continuously, and the note suggests a meeting at eight ten. Step 2: Witnesses heard an argument coinciding with the playback, eliminating the chance of isolation. Step 3: The trap test reveals contradictions in suspect statements.

## Character Reference

### Eleanor Voss (she/her — NEVER he/him)
Eleanor speaks with a lilting cadence, often punctuating her observations with a sardonic twist
She tends to use metaphors drawn from her travels, adding color to her conversations.
Eleanor grapples with guilt over her affair, questioning the moral implications of her choices while seeking redemption.
Voice colour: Eleanor Voss uses dry wit humour — let it surface in their dialogue where natural, not in every line.

### Captain Ivor Hale (he/him — NEVER she/her)
Captain Hale's speech is often clipped and direct, with a hint of bitterness
He uses military jargon and occasionally softens his tone when reminiscing about his past.
Captain Hale wrestles with the pain of his son's death, torn between seeking revenge and finding peace.

### Hugo Vane (he/him — NEVER she/her)
Hugo speaks with a directness that often borders on brusque
He is not one for pleasantries, preferring to get straight to the point, often laced with a hint of sarcasm.
Hugo wrestles with the consequences of his greed and the fear of losing everything he has built.
Voice colour: Hugo Vane uses blunt humour — let it surface in their dialogue where natural, not in every line.


## CHARACTER CONTRACTS (binding for this scene)
Each entry below constrains how this character must be written in this chapter.
These override generic style guidance when they conflict.

### Eleanor Voss[SHE]
Voice & mannerisms: Eleanor speaks with a lilting cadence, often punctuating her observations with a sardonic twist. She tends to use metaphors drawn from her travels, adding color to her conversations.
SIGNATURE TIC (use sparingly — this is Eleanor Voss's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "Well, isn’t that just the icing on the cake?"
Sample voice fragments (match this register and rhythm):
  [comfortable] "Well, isn’t that just the icing on the cake? It’s a fine mess we’ve found ourselves in."
  [evasive] "Oh, I just happened to be in the right place at the right time. Nothing unusual about that."
Humour: dry wit — deploy occasionally (level 0.5)
FORBIDDEN phrase (never write for Eleanor Voss): "a surge of determination washed over her"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Invited to the hotel for a seasonal writing retreat and to reconnect with the victim." — do not surface in Act I.

### Captain Ivor Hale[HE]
Voice & mannerisms: Captain Hale's speech is often clipped and direct, with a hint of bitterness. He uses military jargon and occasionally softens his tone when reminiscing about his past.
SIGNATURE TIC (use sparingly — this is Captain Ivor Hale's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "It’s a hard life, isn’t it?"
Sample voice fragments (match this register and rhythm):
  [comfortable] "It’s a hard life, isn’t it? You learn to cope or you don’t."
  [evasive] "I don’t see how my past matters now; the war is behind us."
Humour: self deprecating — deploy rarely (level 0.3)
FORBIDDEN phrase (never write for Captain Ivor Hale): "she knew with certainty she was right"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "The victim's words triggered memories of loss, making Ivor contemplate revenge." — do not surface in Act I.

### Hugo Vane[HE]
Voice & mannerisms: Hugo speaks with a directness that often borders on brusque. He is not one for pleasantries, preferring to get straight to the point, often laced with a hint of sarcasm.
SIGNATURE TIC (use sparingly — this is Hugo Vane's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "Let’s not beat around the bush."
Sample voice fragments (match this register and rhythm):
  [comfortable] "Let’s not beat around the bush; this is a matter of business."
  [evasive] "I don’t see the relevance of past dealings; we must look forward."
Humour: blunt — deploy occasionally (level 0.4)
FORBIDDEN phrase (never write for Hugo Vane): "she chose her words with great care"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Believed the victim would ruin his business prospects if she continued to investigate his practices." — do not surface in Act I.



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

Primary Location: The Ocean View Hotel (Brighton, England)
A grand seaside hotel boasting Art Deco elegance and sweeping ocean views, harboring secrets beneath its luxurious facade.

Key Locations Available:
- Grand Lobby (interior): Gathering space for guests
- Dining Room (interior): Dining space for guests
- Guest Room 312 (interior): Private space for guests
- Rooftop Terrace (exterior): Observation and relaxation space for guests

Atmosphere (tonal cue only — do NOT reproduce this phrase verbatim in prose; translate into scene-specific, character-observed sensory language): Tense and suspenseful, reflecting post-war uncertainties
Weather: Foggy with occasional rain, typical of coastal climates in the 1940s

Era markers: Art Deco architecture | Distant radio news broadcasts | Rationed wartime vehicles

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
  - Visual: gleaming chandeliers overhead, polished marble reflecting light, ornate Art Deco patterns
  - Sounds: crackling fireplace, soft murmurs of conversation, footsteps echoing on marble
  - Scents: freshly polished wood, salt air drifting in, warmth of the fireplace
  - Touch: smooth marble underfoot, soft upholstery of armchairs

Dining Room (interior):
  - Visual: crystal chandeliers overhead, white tablecloths adorned with silverware, large windows revealing the ocean
  - Sounds: clinking of cutlery, soft murmur of conversations, laughter ringing out
  - Scents: aromas of roasted meats, freshly baked pastries, hint of citrus from desserts
  - Touch: cool porcelain plates, smooth silverware in hand

Guest Room 312 (interior):
  - Visual: soft pastel wallpaper, framed seascape paintings, plush armchair by the window
  - Sounds: whispers of the wind, distant crashing of waves, soft ticking of a clock
  - Scents: fresh linen, hint of lavender, the scent of aging wood
  - Touch: soft cotton sheets, cool glass window panes

⛔ REFERENCE DATA — DO NOT TRANSCRIBE VERBATIM: The above profiles are structural guides only. Generate original prose that evokes these qualities; do not reproduce the exact phrasing or sentence structure of the profile paragraphs.

SCENE OPENING RULE: When opening a scene in a new location, write what the POV character directly observes and physically senses at that moment — not a general description of the room's qualities. The reader must feel present, not briefed. Sensory details must be observed by the character, not stated as fact about the place.

SENSORY WRITING TECHNIQUES:
- Opening
[truncated for prompt budget]

## Texture Pool
Draw on these as opportunities arise — you are not required to use them.

- Living in February 1948 means navigating a landscape still haunted by the aftershocks of World War II, with the Cold War casting a long shadow over daily life
- The air is thick with uncertainty, as families gather around crackling radios for news updates amidst the rising tensions in Europe
- Fashion reflects a blend of elegance and practicality, with men in tailored suits and women in tea-length dresses, all while the specter of rationing looms
- The coastal hotel, where our story unfolds, is emblematic of this time—a refuge for weary souls, yet layered with secrets and the weight of unspoken fears
- Couples celebrate fleeting romance amid the backdrop of societal shifts, while the presence of fog symbolizes the obscured truths each character must confront.

TEMPORAL CONTEXT:

This story takes place in February 1948 during winter.

Seasonal Atmosphere:
- Weather patterns: Foggy mornings with low visibility, Occasional drizzles and light rain, Chilly winds coming off the coast
- Daylight: Short days with sunlight peeking through thick clouds, dusk settling around 5 PM
- Seasonal activities: Strolling through the coastal promenade, wrapped in winter coats, Attending local theater performances indoors, Gathering around radios for the latest news and entertainment programs
- Seasonal occasions: Valentine's Day (February 14)
- Season: winter

Period Fashion (describe naturally):
- Men formal: Double-breasted wool suits in navy or charcoal, White dress shirts with wide collars, Fedoras and overcoats for evening outings
- Men casual: Tweed blazers paired with slacks, Knitted sweaters with crew necks, Chinos and loafers for a relaxed look
- Men accessories: Leather gloves and scarves for warmth, Pocket watches, Brimmed hats
- Women formal: Tea-length dresses with cinched waists and full skirts, Fur stoles and tailored jackets, High-neck blouses under fitted cardigans
- Women casual: Wool skirts paired with turtlenecks, Dresses with floral prints for daytime outings, Practical ankle boots
- Women accessories: Wide-brimmed hats adorned with ribbons, Elegant gloves, Pearl necklaces or brooches

Cultural Context (reference naturally):
- Music/entertainment: Nat King Cole's romantic ballads, Doris Day's upbeat tunes, Bing Crosby's classic standards; Films: The Treasure of the Sierra Madre (1948), The Red Shoes (1948); Theatre: Broadway shows like 'Annie Get Your Gun', Local productions of classic plays; Radio: Suspense dramas captivating evening listeners, Quiz shows gaining popularity
- Typical prices: Loaf of bread: four pence, A pint of milk: three pence, Taxi fare across town: two shillings
- Current events: Tensions rising in Eastern Europe with the onset of the Cold War; The Marshall Plan continuing to shape European recovery
- Literature: 1984 by George Orwell (published in 1949) | The Naked and the Dead by Norman Mailer (1948) | The Catcher in the Rye by J.D. Salinger (published in 1951) | [Post-war fiction exploring human resilience] | [Mystery and detective novels gaining traction] | [Science fiction reflecting Cold War anxieties]
- Technology: The transistor, paving the way for future electronics | The development of early computers like ENIAC | Advancements in aviation technology with jet propulsion | Radios as central entertainment in homes | Early television sets becoming more common in urban areas | Basic household appliances like refrigerators and washing machines
- Daily life: Gathering at local pubs for drinks and conversation, Attending community dances or social clubs, Watching films at the local cinema
- Social rituals: Sunday family dinners as a tradition, Community meetings addressing local issues, Valentine's Day celebrations with cards and small gifts

Atmospheric Details:
The sound of rain tapping against the fogged window panes adds a layer of tension to the air. The faint aroma of damp earth and woodsmoke mingles with the rich scent of cigars from the hotel's lounge. A distant radio crackles, broadcasting the latest news, punctuating the muffled conversations that linger in the smoke-filled rooms.

FASHION INTEGRATION TECHNIQUES:
- First appearance: De
[truncated for prompt budget]

NON-NEGOTIABLE CHAPTER OBLIGATIONS — LOCKED EVIDENCE VALUES (VERBATIM REQUIRED):
The following measured values (times, amounts, measurements) are absolute ground truth. Every time this chapter describes, mentions, or alludes to one — no matter how briefly — it MUST use the exact phrase shown below, character for character. NO paraphrase, approximation, rounding, or synonym is permitted.

FAILURE EXAMPLE: if the locked value is "at thirteen minutes to midnight" and you write "just before midnight" or "around midnight" — that is a HARD FAIL. You must write "at thirteen minutes to midnight". Equally, if the locked value is written in words, such as "ten minutes past eleven", and you convert it to figure-based clock notation — that is also a HARD FAIL. Words stay as words; figure forms are forbidden for word-phrased facts.

CRITICAL — WORD-PHRASED VALUES: If the canonical value is written out in words (e.g. a time like "ten minutes past eleven", or an amount like "forty minutes"), reproduce those exact words. DO NOT convert to figure-based time notation, twenty-four-hour format, or any other numeric shorthand. Correct: "ten minutes past eleven". WRONG: figure-based clock notation or numeric shorthand.

Locked values:
  - The exact time the gramophone was set to play, masking the moment of death.: "ten minutes past eight"
    ⛔ FORBIDDEN alternatives: "8:10", "8.10", "eight ten", "eight-ten", "eight past ten", "quarter past eight", "half past eight" — the ONLY acceptable form is "ten minutes past eight"
  - The thickness of the soundproof door, critical for understanding the acoustic isolation.: "two inches"

If a value has no relevance to this chapter, omit it. But the moment you reference the underlying evidence, only the exact phrase above is acceptable.

⛔ CLUES TO SURFACE IN THESE CHAPTERS — mandatory:
The following evidence MUST be clearly observable to an attentive reader. Do not bury it in atmosphere or passing dialogue. Each clue must be concrete, specific, and noticeable:

• [clue_culprit_direct_hugo_vane] direct, ties, hugo, vane, mechanism, access, point, before, discriminating, excludes, competing, suspect
  Category: testimonial | Criticality: essential | Supports inference step 1
  Points to: direct, shows, hugo, vane, means, opportunity, narrowing, solution, uniquely, toward, culprit, eligible

• [clue_fp_contradiction_step_1] gramophone, needle, still, groove, last, track
  Category: testimonial | Criticality: essential | Supports inference step 1
  Points to: indicates, recording, played, continuously, interrupted

• [clue_3] Direct observation
  Category: structural | Placement: early (Act 1)
  Points to: what this observation reveals about the time or circumstances of the crime.

For each clue above: an attentive reader should be able to find, record, and later use it to reason toward the solution.

═══ NARRATIVE STATE (read-only — do not contradict) ═══

LOCKED FACTS — use verbatim whenever this evidence is described:
  • The exact time the gramophone was set to play, masking the moment of death.: "ten minutes past eight"
  • The thickness of the soundproof door, critical for understanding the acoustic isolation.: "two inches"

CHARACTER PRONOUNS — never deviate from these:
  • Eleanor Voss: she/her/her
  • Dr. Mallory Finch: she/her/her
  • Captain Ivor Hale: he/him/his
  • Beatrice Quill: she/her/her
  • Sylvia Trent: she/her/her
  • Hugo Vane: he/him/his

CLUES ALREADY REVEALED TO READER: clue_mechanism_visibility_core, clue_1, clue_3 — do not reveal these as new information.

INVESTIGATION LOG — WHAT IS ESTABLISHED (do not re-establish, do not repeat):
• Evidence already established (reference only — do NOT restate or quote these; advance beyond them): gramophone, playing, continuously | meeting, expected, time, murder | manner, death, strangulation
• Suspects still unresolved: Captain Ivor Hale[HE], Sylvia Trent[SHE]
⚠ The story must move FORWARD from this log. Any beat already listed above is forbidden from repeating.

⚠ THIS CHAPTER'S REQUIRED ADVANCE (early): Interview each suspect — record their claimed whereabouts

CONTINUITY HANDOFF — previous chapter closing beat:
  • "As Eleanor prepared to leave, she caught one last look at Dr. Mallory Finch’s face, serene in death, the marks at her throat a stark reminder of the violence that had ended her life. The investigation had shifted: this was no longer a question of misfortune or..."
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
Eleanor Voss, Dr. Mallory Finch, Hugo Vane, Captain Ivor Hale, Beatrice Quill, Sylvia Trent

✓ RULE: Use EXACTLY these names. Do NOT vary spelling, add titles, or introduce new forms.
✓ Example: if earlier chapters used "Clara Whitfield", keep using "Clara Whitfield" — never "Mrs. Whitfield" unless that is the character's canonical name in the list above.

**Setting Vocabulary Established in Earlier Chapters:**
garden, corridor, lounge, lobby

✓ RULE: Continue using this location vocabulary. Maintain consistency with established setting type.
✓ Do NOT introduce new location types that contradict earlier chapters.

**Recent Chapter Summary (for narrative continuity):**
Chapter 1: Chapter 1: The Silent Groove
  Events: Inside, the room was cast in a pale, uncertain light.
Chapter 2: Chapter 2: Initial Reactions
  Events: "She wanted to see me at—look here," Eleanor said, her voice cutting through the dim hush as she stooped beside the writing desk.

⚠️ **VALIDATION:** Character name mismatches and setting drift are common failure modes.
Double-check every character name against the list above before using it.

**⏱ LOCKED TIME ANCHOR — use verbatim, do not paraphrase:**
Clock time (from the case ground truth): **"The gramophone's recording started at precisely ten minutes past eight."**
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
Known location profile anchors: The Ocean View Hotel, Grand Lobby, Dining Room, Guest Room 312, Rooftop Terrace, the victim's room in the Seaside Hotel
LOCATION NAME CAPITALISATION (HARD REQUIREMENT — validated):
All named locations in your prose MUST use the EXACT capitalisation from the CML profiles.
Canonical forms: "The Ocean View Hotel", "Grand Lobby", "Dining Room", "Guest Room 312", "Rooftop Terrace", "the victim's room in the Seaside Hotel"
Writing a location in lowercase (e.g. "drawing room" instead of "Drawing Room") is a validated error. Every time you mention a named location, copy its capitalisation from the list above.
- Chapter 3: OPENING STYLE (HARD): Start the VERY FIRST SENTENCE with an explicit time marker — e.g. "That morning…" / "By the time dusk fell…" / "It was nearly four o'clock…" / "On the second day after the discovery…". Time must be in the first clause. Anchor opening in "the victim's room in the Seaside Hotel". The opening style above governs only your FIRST SENTENCE; the grounding below may land anywhere in the first 2 paragraphs (it need not be sentence one, and never conflicts with the chosen opening style). HARD REQUIREMENT for the first 2 paragraphs: (a) include 2+ sensory words — choose from smell/scent/odor/fragrance/sound/echo/silence/whisper/creak/cold/warm/damp/rough/smooth/glow/shadow/flicker/dim — and (b) include 1+ atmosphere/time word — choose from rain/wind/fog/storm/mist/thunder/evening/morning/night/dawn/dusk/lighting/weather/season/afternoon/midday/noon/midnight/twilight/sunrise/sunset/daylight/sunlight/overcast/cloudy/bright/dark/grey/pale/chill/crisp/drizzle/haze/lamplight/firelight. These are validated requirements, not style suggestions; missing them triggers a retry.

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

PROMPT BUDGET SUMMARY: budget=24000 tokens; fixed=12636; context=10741; dropped=[humour_guide]; truncated=[location_profiles, temporal_context, pronoun_accuracy]

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
4. Integrate at least two concrete era-grounded details per chapter from setting refinement signals: radio broadcasting | early television | military radar | basic code-breaking devices | long-distance telephone calls | military-grade encrypted messages.
5. Respect setting movement/access constraints in scene action and alibis: narrow hallways restrict movement | limited access to certain areas like the roof and basement | weather conditions affecting outdoor access | Staff-only areas such as the kitchen and maintenance rooms | Guest rooms that are locked when unoccupied.
6. Sustain social coherence with this backdrop pressure: A seaside hotel hosts a gathering of war-weary guests and staff, where the tensions of post-war life and shifting gender roles create an environment ripe for intrigue and deception.
7. Maintain continuity around these socially central cast anchors where relevant: Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill, Sylvia Trent, Hugo Vane.
8. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Critical: Plot similarity 0.80 with 'The Second Key' (same era and identity manipulation theme)
9. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Moderate: Character similarity 0.74 with 'The Sign of the Four' (similar cast structure and dynamics)
10. STORY TO DATE ANTI-COPY RULE: The STORY TO DATE section below is provided for chronological and factual reference ONLY. You MUST NOT copy, lightly rephrase, or structurally echo any sentence or paragraph from prior chapters. Every sentence in this chapter must be original prose unique to this scene. Reusing even a clause from prior chapter text will cause this attempt to fail immediately.

CRITICAL PROSE REQUIREMENTS:

The CML specifies exact requirements for certain validation-critical scenes. You MUST include these elements at the specified positions.

**Discriminating Test Scene (Act 3, Scene 4):**
Required elements: Execute the discriminating test, Observe the culprit's reaction or result, Draw conclusion about guilt
Test type: trap

**Suspect Clearance Scenes:**
- Captain Ivor Hale (Act 3, Scene 5): His alibi is corroborated by multiple witnesses who saw him elsewhere.
  Clues: clue_id_1, clue_id_2
- Sylvia Trent (Act 3, Scene 5): She was busy cleaning rooms during the time of death.
  Clues: clue_id_1, clue_id_2

**Culprit Revelation Scene (Act 3, Scene 6):**
Method: Confrontation with evidence

**Identity Protection Rules:**
Character: Dr. Mallory Finch
- Before Act 3: refer as "the doctor"
- From Act 3 onward: refer as "Dr. Finch"

**Clue Placement for These Chapters:**
- clue_3 must appear in Act 1, Scene 3 via Direct observation
- clue_culprit_direct_hugo_vane must appear in Act 1, Scene 3 via Witness statement
- clue_fp_contradiction_step_1 must appear in Act 1, Scene 3 via Cross-check contradiction

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
Investigation state at start: 3 clue(s) revealed to reader; approximately 2 unresolved suspect(s).
Must change by end: Increase or complicate suspicion through a new pressure revelation — WITHOUT resolving the case: do NOT name, accuse, or extract a confession from the culprit, make an arrest, or declare the case closed (that is reserved for the final reveal).
Suspect pressure target(s): Hugo Vane, Captain Ivor Hale
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
  - Scene is set in: the victim's room in the Seaside Hotel — reference it naturally within the paragraph, never as your opening phrase.
  - Opening atmosphere (MANDATORY — validator enforced): the first paragraph MUST contain at least one of: rain / wind / fog / storm / mist / thunder / evening / morning / night / dawn / dusk / season / afternoon / midday / noon / midnight / twilight / sunrise / sunset / daylight / sunlight / overcast / cloudy / bright / dark / grey / pale / cold / warm / chill / crisp / damp / drizzle / haze / lamplight / firelight. A chapter that omits all of these from its opening paragraph will be rejected.
  - PARAGRAPH OPENER DIVERSITY (MANDATORY — validator enforced): No more than 2 paragraphs in this chapter may begin with "Eleanor" or "Eleanor's" as the first word. You must vary paragraph openings throughout: use sensory observations, another character's name or action, dialogue, object or sound details, or temporal markers. Opening 3 or more paragraphs with "Eleanor" will cause automated rejection.
  - ⛔ MECHANISM SPOILER BAN: Do NOT state how the crime device was manipulated — not the direction, not the magnitude, not who performed it. Characters may only observe that two sources of evidence disagree. The specific method, tamper amount, and perpetrator's action are ALL FORBIDDEN until the reveal. WRONG: "The culprit had altered the device by forty minutes to create a false alibi." RIGHT: "Two independent pieces of evidence gave contradictory readings — a discrepancy neither could yet explain."
  - Continuity bridge: in the first 120 words, visibly connect from the previous chapter's final beat. Carry forward one unresolved element (object, accusation, emotional pressure, or immediate physical action) from: "As Eleanor prepared to leave, she caught one last look at Dr. Mallory Finch’s face, serene in death, the marks at her throat a stark reminder of the violence that had ended her life. The investigation had shifted: this w...".
  - CLUE OBLIGATIONS — each clue below MUST be dramatized, but in YOUR OWN WORDS:
    Render each as something a character SEES, DOES, or SAYS on the page. The bracketed text is a
    DESCRIPTION of the evidence for you — do NOT transcribe it as narration. Copying a clue's
    description sentence verbatim into the prose FAILS validation.
    • visible, marks, victim, neck [clue_3] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: manner, death, strangulation
      ↳ MANDATORY TWO-PARAGRAPH STRUCTURE (must appear in paragraphs 1 or 2 — no later):
         Paragraph 1: The POV character physically approaches or directly observes this evidence.
           The narration or dialogue explicitly states what is seen (use the exact locked phrase if one applies).
         Paragraph 2 (immediately following): The detective or POV character explicitly reasons
           about what this evidence implies — who it implicates, why it may be unreliable,
           or what inference it supports. This must be a separate full paragraph, not a sentence appended to Paragraph 1.
    • gramophone, needle, resting, last, groove [clue_culprit_direct_hugo_vane] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      ⛔ SPOILER EMBARGO (pre-reveal chapter): surface ONLY the surface anomaly a character can see/hear/find.
         Do NOT name who it implicates, state the tamper direction or magnitude, or explain the mechanism in this chapter.
         Present it as an unexplained discrepancy; the culprit and method are revealed later.
         Place this OBSERVATION in paragraph 1 or 2 (observation only — no inference about the culprit).
    • gramophone, needle, resting, last, groove [clue_fp_contradiction_step_1] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: indicates, recording, played, continuously, interrupted
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
  - ALIBI LOCK: Hugo Vane's established alibi is "9:30 to 10:30 PM". Do NOT place Hugo Vane at any other location or in any other activity during the crime window. Any contradiction is a continuity error that triggers a retry.
  - TESTIMONY CONTINUITY: Hugo Vane has already made statements in earlier chapters. Any time, location, or claim attributed to Hugo Vane in THIS chapter must be consistent with those earlier statements. Do NOT introduce a new or different alibi claim — any contradiction is a continuity error.
- Locked fact phrase obligations:
  - If this batch mentions The exact time the gramophone was set to play, masking the moment of death., write exactly: "ten minutes past eight".
  - If this batch mentions The thickness of the soundproof door, critical for understanding the acoustic isolation., write exactly: "two inches".
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
Investigation state at start: 3 clue(s) revealed to reader; approximately 2 unresolved suspect(s).
Must change by end: Increase or complicate suspicion through a new pressure revelation — WITHOUT resolving the case: do NOT name, accuse, or extract a confession from the culprit, make an arrest, or declare the case closed (that is reserved for the final reveal).
Suspect pressure target(s): Hugo Vane, Captain Ivor Hale
Required new information: At least one fear/motive/lie/loyalty reveal with investigative consequence.
Forbidden reveals at this stage: No culprit resolution: no confession, no arrest, no 'case closed', no accusation ('I accuse'/'I name'), and never state 'the culprit/murderer/killer is/was …'. The accusation is reserved for the final reveal — build suspicion only.

FROZEN FACT STATE (DO NOT ALTER):
- Timeline anchor: February (winter).
- Month, season, weather, and time-of-year language in this batch must stay compatible with winter.
- Established timeline fact: The gramophone's recording started at precisely ten minutes past eight.
- Established timeline fact: Witnesses heard sounds from the victim's room at eight-thirty.
- If referenced, use exact phrase: "ten minutes past eight" (The exact time the gramophone was set to play, masking the moment of death.).
- If referenced, use exact phrase: "two inches" (The thickness of the soundproof door, critical for understanding the acoustic isolation.).

STORY TO DATE (REFERENCE ONLY — DO NOT COPY VERBATIM):
- Full prior chapter text is provided below for continuity, factual consistency, and reference accuracy.
- Use this to keep character voice, chronology, clue state, and location continuity aligned with earlier chapters.
- Do not quote, copy, or paraphrase these paragraphs too closely; write fresh prose that remains consistent with them.

--- BEGIN PRIOR CHAPTER 1 ---
Title: Chapter 1: The Silent Groove
A muffled knock echoed through the corridor, the sound swallowed almost at once by the thick, wintry fog pressing against the windowpanes of the victim's room in the Seaside Hotel. Eleanor Voss paused on the threshold, her gloved hand hovering above the tarnished brass handle, the chill of the morning seeping through her coat. The faint scent of damp wool and old lavender hung in the air, mingling with something sharper—an undercurrent of unease that prickled along her skin. The silence beyond the door was absolute, broken only by the distant, hollow call of a foghorn somewhere out at sea.

Inside, the room was cast in a pale, uncertain light. The heavy curtains had been drawn back just enough for a wan stripe of daylight to fall across the bed, illuminating the still form of Dr. Mallory Finch. She lay half-turned, one arm flung across the coverlet, her face composed in an expression that might have been sleep, had it not been for the unnatural stillness of her chest. The air was cold and close, thick with the lingering scent of last night's fire, now reduced to grey ash in the grate. On the far side of the room, the gramophone stood sentinel atop its polished cabinet, the record’s surface dull in the morning light. Its needle, Eleanor noticed at once, rested precisely in the groove of the last track—a detail so ordinary it might have been overlooked, were it not for the oppressive hush that filled the space.

Eleanor’s heart hammered in her chest, a drumbeat of disbelief and dread. She stepped forward, the soles of her shoes whispering against the threadbare rug, and forced herself to take in every detail. Dr. Mallory Finch—so recently alive, so formidable in committee meetings—was now a figure rendered mute by death. Eleanor’s gaze swept the room, cataloguing the jumble of objects: a half-drained teacup on the nightstand, a pair of spectacles folded with care atop a stack of correspondence, a silk scarf trailing from a chair. But it was the gramophone, its needle unmoved, that drew her back again and again, as if the machine itself mourned the loss of its audience.

A cough from the doorway broke her reverie. Hugo Vane stood there, his frame blocking what little light filtered through the fog. The property developer’s suit was immaculate, the crisp lines of his jacket at odds with the uncertainty in his eyes. He lingered just inside the room, hands thrust deep into his pockets, as if he might ward off the cold—or the reality of what he saw. His gaze flicked to the body, then away, settling instead on the gramophone. For a moment, he seemed about to speak, but thought better of it, jaw working in silence.

Eleanor cleared her throat, the sound startlingly loud. "Mr. Vane," she said, her voice steadier than she felt, "I take it you were the one who raised the alarm?" Her words hung in the air, brittle as icicles. She watched him carefully, noting the way his shoulders squared, the faint tremor in his left hand as he withdrew it from his pocket to adjust his cufflink.

Hugo Vane, property developer of some repute and a man whose dealings had always skirted the edge of propriety, did not meet her gaze. "Let’s not beat around the bush," he said, his tone clipped. "I came to discuss a matter with Dr. Finch. Found her like this. Thought it best not to touch anything." The words were brisk, but Eleanor caught the way his eyes lingered on the gramophone, as if the device might yet offer some explanation.

The room felt smaller with each passing moment, the walls closing in as the gravity of the scene asserted itself. Eleanor drew a careful breath, the cold air stinging her lungs. She moved to the gramophone, her fingers hovering above the polished wood. The machine was silent, but the needle’s position—resting in the groove of the last track—seemed to hum with significance. She stooped, examining the record. There was no sign of recent handling, no fingerprints in the dust, but the stillness of the needle was unmistakable. It suggested an ending, a final note struck and left to echo in the void.

Outside, the fog pressed against the window, turning the glass to a milky blur. The world beyond was reduced to shadow and suggestion, as if the hotel itself were adrift in some liminal space between night and day, life and death. Eleanor straightened, her mind already working through the implications. Dr. Mallory Finch had not died in the midst of activity, nor in the quiet of sleep. The gramophone’s silence was too pointed, its conclusion too abrupt. There was a story here, hidden in the hush.

Hugo Vane shifted his weight, the floorboard groaning beneath him. "You’re the one they call in for these things, aren’t you?" he said, his voice softer now, stripped of its earlier bravado. "The travel writer with a nose for trouble." There was a flicker of something—resentment, perhaps, or fear—before he masked it with a shrug. "I suppose you’ll want to know where I was last night. I was in the lounge from half past nine to half past ten. Plenty of people saw me."

Eleanor regarded him, her expression unreadable. "We’ll come to that," she replied, allowing just the faintest trace of her signature sardonic twist. "For now, I’d like you to tell me what brought you here this morning, and whether you noticed anything unusual before you entered the room." The question was simple, but the subtext was not: every word, every pause, every glance was a thread to be followed.

Hugo Vane hesitated, his eyes darting to the door as if weighing the wisdom of flight. "I had a letter—she wanted to see me about the hospital fund. I thought it odd, her asking for a meeting so early, but Dr. Finch was never one for small talk. When I arrived, the door was ajar. I called out, got no answer. That’s when I saw her." His voice faltered, and for a moment the mask slipped, revealing a rawness that did not sit easily on his features.

Eleanor let the silence stretch, the weight of the moment settling over them both. She glanced again at the gramophone, its presence an accusation. The needle, so precisely at rest, was a detail that refused to be ignored. Was it possible that Dr. Mallory Finch had been listening to music at the time of her death? Or had someone used the machine for another purpose entirely? The contradiction gnawed at her, a splinter in her mind.

She turned her attention to the rest of the room, noting the absence of any sign of struggle. The bedclothes were undisturbed, the rug unruffled. Yet the air was charged, as if the aftermath of violence lingered just out of sight. Eleanor crossed to the window, peering through the fogged glass at the indistinct shapes of the garden below. The world outside seemed impossibly distant, the hotel a pocket of suspended time.

Behind her, Hugo Vane cleared his throat again, the sound brittle. "If you’re thinking I had anything to do with this—" he began, but Eleanor cut him off with a raised hand. "I’m thinking only that Dr. Finch was not alone when she died. The evidence is here, if one knows where to look." She gestured to the gramophone, the needle’s position a silent witness.

The tension in the room was palpable, a current running beneath the veneer of civility. Eleanor felt it in the set of Hugo Vane’s jaw, the way his gaze slid away from hers, the restless movement of his hands. She filed each detail away, knowing that in a place like the Seaside Hotel, every gesture was a potential clue, every silence a possible confession.

A distant chime sounded from the hallway clock, muffled by the "two inches" of the room’s soundproof door. The noise was barely audible, yet it seemed to mark the passing of something irrevocable. Eleanor drew a steadying breath, her mind already mapping the next steps: the interviews to be conducted, the timelines to be reconstructed, the lies to be sifted from the truth.

For now, though, she allowed herself a single, unguarded moment of sorrow. Dr. Mallory Finch had been a force—unyielding, principled, often exasperating. Her absence left a hollow that no amount of rational inquiry could fill. But there was work to be done, and Eleanor Voss, for all her doubts and regrets, was the only one willing to do it.

She turned back to Hugo Vane, her resolve settling like a cloak around her shoulders. "Mr. Vane, I’ll need you to remain available for further questions. And please, don’t leave the hotel without informing me." Her tone left no room for argument. He nodded, the gesture stiff, and slipped from the room, leaving Eleanor alone with the silence, the fog, and the needle poised in its final groove.

Outside, the wind rose, rattling the windowpanes in their frames. The world beyond remained shrouded, but within the confines of the Seaside Hotel, the first threads of the mystery had begun to unravel. Eleanor Voss stood in the hush, the weight of responsibility settling upon her, and listened to the echoes left behind by Dr. Mallory Finch’s final, unfinished song.
--- END PRIOR CHAPTER 1 ---

--- BEGIN PRIOR CHAPTER 2 ---
Title: Chapter 2: Initial Reactions
"She wanted to see me at—look here," Eleanor said, her voice cutting through the dim hush as she stooped beside the writing desk. The air in the victim's room in the Seaside Hotel was thick with the scent of cold ash and the faint, metallic tang of fog that crept in through the window frame. Outside, the wind rattled the glass, a low, persistent complaint that seemed to underscore the heaviness of the morning. Eleanor’s gloved fingers hovered above a slip of paper, the handwriting unmistakably Dr. Mallory Finch’s: a brief note, the ink still dark, requesting a meeting at "ten minutes past eight." The words seemed to pulse with a private urgency, as if the page itself resisted her touch.

The implications of that note pressed in on Eleanor, sharper than the chill that seeped through the floorboards. Why had Dr. Mallory Finch summoned someone at such a precise hour? The specificity—"ten minutes past eight"—suggested an appointment, not a chance encounter. Eleanor’s mind raced through the possibilities: a clandestine meeting, a confrontation, or perhaps a final attempt at reconciliation. The note implied the presence of another, someone expected, someone who might have been the last to see Dr. Mallory Finch alive. It was not the sort of detail that could be dismissed as coincidence.

Drawing a careful breath, Eleanor turned her attention to the bed. The pale morning light, filtered by fog, fell across Dr. Mallory Finch’s throat, revealing a brutal truth. There, etched in stark relief against her skin, were the unmistakable marks of a ligature—red, angry, and cruelly precise. Eleanor’s hand trembled as she reached for the edge of the coverlet, the smooth wool rough beneath her fingertips. The silence in the room was broken only by the faint ticking of a clock on the mantel, each second a reminder that time had not stopped for the living.

A cold certainty settled in Eleanor’s chest. These marks were not the result of accident or self-harm; they bespoke violence, the deliberate act of another. The doctor had not simply slipped away in her sleep. Someone had been here, close enough to leave this evidence—close enough to kill. The realization narrowed Eleanor’s focus, transforming the room from a place of sorrow to a scene of crime. She felt the weight of responsibility shift, the investigation no longer a matter of tragic misfortune but of murder.

The door creaked open behind her, and a gust of damp air swept in, carrying with it the scent of rain and the faint echo of voices from the corridor. Captain Ivor Hale entered, his overcoat still flecked with droplets, the dark wool absorbing what little light the room offered. He paused just inside the threshold, his posture rigid, gaze sweeping the scene with a practiced coldness. The lines around his eyes deepened as he took in the body, the note, and the tension that hung in the air.

Captain Ivor Hale, the retired naval officer whose reputation for discipline preceded him, stood nearest the body. His hand, gloved and steady, tightened almost imperceptibly around the brim of his hat. "It’s a hard life, isn’t it?" he murmured, voice low, as if speaking to himself rather than the room. Yet there was a flicker of something beneath his composure—a shadow that passed over his features as his gaze lingered on the ligature marks. Eleanor watched him, noting the way his jaw set, the slight hesitation before he allowed himself to look directly at Dr. Mallory Finch.

Eleanor straightened, her own grief now tempered by a keen sense of observation. "Captain Hale," she said, "you knew Dr. Finch well. Did she mention anything about a meeting last night? Or anyone she was expecting?" The question was gentle, but the undercurrent was not lost on him. He met her eyes, his own expression unreadable for a moment before he replied.

"Dr. Finch kept her own counsel," Captain Ivor Hale said, his tone clipped. "She was not one for idle confidences. If she arranged a meeting, I was not privy to it. But she seemed…troubled, of late. Preoccupied." He hesitated, then added, "If you’re suggesting someone here meant her harm, you’ll find no shortage of candidates. War does things to people. Leaves them…unfinished." The bitterness in his voice was unmistakable, and Eleanor caught the way his hand flexed at his side, as if resisting the urge to reach for something lost.

Before Eleanor could press him further, Hugo Vane reappeared in the doorway, his face drawn, the lines of his suit sharp against the gloom. He lingered, arms folded, eyes darting between Eleanor and Captain Ivor Hale. "You’ll want to know who had business with Dr. Finch," Hugo Vane said, his tone brusque. "But you’ll find most of us did. She had a way of making enemies, even when she meant well." His words were deflective, but the tension in his stance betrayed more than he intended. Eleanor noted the way his gaze slid away from the body, settling instead on the gramophone as if seeking refuge in its silence.

The conversation twisted, each man’s words a shield against the implications of the scene. Eleanor pressed on, careful to keep her tone neutral. "Mr. Vane, did you see or hear anything unusual before you found her? Any voices, or movement in the corridor?"

Hugo Vane’s reply was measured, almost rehearsed. "Nothing that stands out. The hotel’s never quiet, not really—not with the wind and the fog. I heard the gramophone, but that’s nothing new. Dr. Finch liked her routines." Yet Eleanor caught the flicker of uncertainty in his eyes, the way his fingers drummed restlessly against his sleeve. There was more here, a fear or a lie lurking just beneath the surface.

Captain Ivor Hale’s presence seemed to amplify the pressure in the room. He moved closer to the bed, his gaze fixed on the ligature marks. "You’re certain this wasn’t an accident?" he asked, voice rough. Eleanor met his stare, holding it. "No. This was deliberate." The admission hung in the air, heavier than the fog pressing against the windows.

A silence fell, broken only by the distant sound of a radio drifting up from the lobby, the announcer’s clipped tones reporting on the latest in European affairs. The world outside continued, oblivious to the drama unfolding within these walls. Yet inside the victim's room in the Seaside Hotel, every gesture, every word, seemed charged with consequence.

Eleanor’s mind worked through the contradictions. The note—"ten minutes past eight"—tied the time of the meeting to the moment the gramophone had been set to play. The ligature marks confirmed violence. Yet both Captain Ivor Hale and Hugo Vane seemed determined to keep their true feelings hidden, their answers carefully constructed. The investigation was only beginning, but already the lines between truth and performance blurred.

She let her gaze linger on Captain Ivor Hale, watching for the smallest betrayal: a twitch of the mouth, a tightening of the jaw. He stood his ground, but Eleanor sensed a storm beneath the surface—a loyalty to Dr. Mallory Finch, perhaps, or a fear that the past would not stay buried. Hugo Vane, for his part, grew more defensive with each question, his bravado slipping as suspicion settled more heavily upon him.

For a moment, the tension broke as a shaft of pale light slipped through the fog, illuminating the gramophone’s polished surface. The ordinary object seemed almost mocking in its innocence, a silent witness to the violence that had occurred. Eleanor allowed herself a brief, ironic thought—if only machines could speak, perhaps the investigation would be simpler. But in their silence, they forced her to rely on the fallible testimony of the living.

The morning wore on, the cold deepening as the fire in the grate surrendered to ash. Eleanor gathered her notes, the slip of paper with its damning appointment time tucked carefully away. She would need to speak with others—Beatrice Quill, Sylvia Trent—but for now, the focus remained on the men in the room. Each bore the weight of secrets, and each, in turn, would be tested by the demands of the truth.

Eleanor Voss pressed on to the next concrete detail: Ligature marks around victim throat.

That detail shifted the reasoning. Eleanor Voss weighed Ligature marks around victim throat, and the trail bent toward Manner death strangulation.

As Eleanor prepared to leave, she caught one last look at Dr. Mallory Finch’s face, serene in death, the marks at her throat a stark reminder of the violence that had ended her life. The investigation had shifted: this was no longer a question of misfortune or natural causes. Murder had come to the Seaside Hotel, and with it, a reckoning none could escape.
--- END PRIOR CHAPTER 2 ---

[SCENE COMPLETENESS CONTRACTS — MANDATORY. Each contract below lists what you MUST enact in that chapter. Do not summarise or mention these labels in the prose — enact them organically.]
Chapter 3 (Act 1) completeness contract:
  PIVOT ELEMENT (MANDATORY — write this into the prose, shown not told): "The handwritten note suggesting a meeting at 'ten minutes past eight'."
  FACT ESTABLISHED (MANDATORY — reader must know this by chapter end): "Establishes that Hugo Vane had a reason to be in the victim's room at the time of death."

# Case Overview
Title: The Echoes of Identity
Era: 1940s
Setting: Seaside Hotel
Crime: murder (acoustic manipulation)
Culprit: Hugo Vane
Victim: Dr. Mallory Finch
False assumption: The victim was alone in her room at the time of death.
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
    "title": "Contradictory Evidence",
    "setting": {
      "location": "the victim's room in the Seaside Hotel",
      "timeOfDay": "Morning after the murder",
      "atmosphere": "Suspenseful and charged with tension"
    },
    "characters": [
      "Eleanor Voss",
      "Hugo Vane",
      "Captain Ivor Hale"
    ],
    "purpose": "Introduce contradictory evidence and establish motives",
    "cluesRevealed": [
      "clue_culprit_direct_hugo_vane",
      "clue_fp_contradiction_step_1"
    ],
    "dramaticElements": {
      "conflict": "Suspicions grow as characters defend their alibis.",
      "tension": "Hugo's nervousness raises further doubts.",
      "microMomentBeats": [
        "Eleanor catches Hugo's eye, sensing his unease."
      ]
    },
    "summary": "As the group discusses the implications of the discovery, Eleanor recalls a handwritten note found in the victim's room. The note suggests a meeting at 'ten minutes past eight', which contradicts Hugo's alibi. Tension mounts as they realize the implications of the gramophone's playback.",
    "beat": "first_enquiries",
    "estimatedWordCount": 1800,
    "pivotElement": "The handwritten note suggesting a meeting at 'ten minutes past eight'.",
    "factEstablished": "Establishes that Hugo Vane had a reason to be in the victim's room at the time of death.",
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
      }
    ],
    "redHerringPlacement": null,
    "emotionalRegister": "Eleanor's investigation begins to uncover unsettling truths, raising her emotional stakes.",
    "dominantCharacterNote": {
      "name": "Eleanor Voss",
      "voiceRegister": "Eleanor speaks with a lilting cadence, often punctuating her observations with a sardonic twist."
    },
    "humourGuidance": {
      "permission": "forbidden"
    },
    "eraTextureNote": "Fog limiting visibility and movement along coastal roads.; Rationing affecting food and supplies in the hotel.; Communication delays due to outdated technology.",
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
□ Chapter 3: the clue [clue_3] (ligature, marks, around, victim, throat) is placed in the first 25% of the chapter, dramatized in your own words, followed by an explicit inference or suspicion paragraph.
□ Chapter 3: the clue [clue_culprit_direct_hugo_vane] (direct, ties, hugo, vane, mechanism, access, point, before, discriminating, excludes, competing, suspect) is placed in the first 25% of the chapter, dramatized in your own words, followed by an explicit inference or suspicion paragraph.
□ Chapter 3: the clue [clue_fp_contradiction_step_1] (gramophone, needle, still, groove, last, track) is placed in the first 25% of the chapter, dramatized in your own words, followed by an explicit inference or suspicion paragraph.
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

## Message 4 (role=user)

```text
SINGLE-PASS RETRY CONTRACT
Goal: resolve every listed issue for chapter(s) 3 in this one retry.
Retry mode: TARGETED_REBUILD.
Attempt context: 2/3 | primary class: fair_play.
Why this mode: template failure detected; prior wording is likely harmful anchor.

SOURCE OF TRUTH
- Do not preserve sentence structure from the failed draft; use the scene instructions and hard constraints as the source of truth.
- Hard constraints outrank the previous draft: cast/pronoun lock, locked facts, clue obligations, stage-mode rules, and chapter JSON shape.

PRIMARY FAILURES
- Chapter 3: the concealment mechanism is explained before the discriminating-test scene. Plant the physical clue (name the object/observation), but do NOT reveal HOW the trick worked — withhold the method/causal explanation until the discriminating-test scene or the final reveal.
- Template linter: repeated long paragraph fingerprint detected. Rewrite repeated scaffold-like prose into chapter-specific language.
- Template linter: high n-gram overlap detected (0.84 >= 0.65). Rephrase this passage to avoid template leakage.

REWRITE PLAN
- Treat the scene instructions, cast lock, clue obligations, and locked facts as the source of truth; do not preserve failing wording from the previous draft.
- Rewrite any paragraph touched by a failing issue as a fresh paragraph rather than patching a single sentence.

SUCCESS CHECKLIST
- Every listed issue below is resolved in this single attempt before you answer.
- Primary failure class cleared: fair_play.
- The revised chapter reads as a clean rewrite of the failing parts, not a lightly patched copy of the rejected draft.

OUTPUT RULES
- Return complete corrected JSON for chapter(s) 3 only.
- Do not explain what you changed.
- Do not leave one issue unresolved while fixing another.
- If two instructions conflict, prefer the one that clears the validator and preserves story logic.

RETRY PHASE: 2 of 2 — QUALITY POLISH ONLY
Logic and contract requirements are already satisfied. This attempt fixes style/quality issues only.
REGRESSION GUARD: You must not introduce any new logic failures while fixing quality issues.
Specifically, do not alter: discriminating test logic, clue evidence sentences, character names or pronouns, alibi claims, or stage-mode outcomes.
If fixing a quality issue would require touching logic-sensitive text, rephrase the surrounding prose instead.

Attempt 2/3 — chapters 3 — 3 validation issue(s) to resolve:

═══ CHARACTER NAME ERRORS (1) ═══
• Chapter 3: the concealment mechanism is explained before the discriminating-test scene. Plant the physical clue (name the object/observation), but do NOT reveal HOW the trick worked — withhold the method/causal explanation until the discriminating-test scene or the final reveal.

✓ SOLUTION: The ONLY characters who exist are: Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill, Sylvia Trent, Hugo Vane
❌ You used one or more names that are NOT in the cast list above. Find every invented name and either replace it with a real cast member or cut the passage entirely.
✓ Do NOT introduce any new named character. Walk-on figures must remain anonymous ("a constable", "the footman") — never Mr./Mrs./Inspector [surname].

✓ Never use rank compounds as names (e.g., "Detective Inspector"). If needed, use anonymous role phrases only: "the detective", "an inspector".

═══ TEMPLATE LEAKAGE ERRORS (2) ═══
• Template linter: repeated long paragraph fingerprint detected. Rewrite repeated scaffold-like prose into chapter-specific language.
• Template linter: high n-gram overlap detected (0.84 >= 0.65). Rephrase this passage to avoid template leakage.

⛔ BANNED PARAGRAPH — DO NOT REPRODUCE ANY SENTENCE FROM THIS TEXT:
"the morning wore on the cold ... by the demands of the truth"

Every sentence in your response must be a sentence that could NOT appear in any of the above passages.
You may write about the same event, but from a different physical position, a different
sensory angle, or at a different moment in the scene. You may not preserve a single clause.

⛔ NEAR-DUPLICATE PASSAGE — your prose closely echoes this prior paragraph:
"for a moment the tension broke ... the fallible testimony of the living"

Rewrite any paragraph that shares sentence structure or extended phrases with any of the above texts.
Different words for the same image are not sufficient — the sentence structure must also differ.

⛔ PRIOR CHAPTER DUPLICATION LOCK — 38 protected passage(s):
Your prose has been detected copying from an earlier chapter. Every paragraph listed below appears in a prior chapter and is COMPLETELY OFF-LIMITS. Do not reproduce, rephrase, or structurally echo any of them:

  • "A muffled knock echoed through the ... victim's room in the Seaside Hotel."
  • "Inside, the room was cast in a pale, uncertain light."
  • "Eleanor’s heart hammered in her chest, a drumbeat of disbelief and dread."
  • "A cough from the doorway broke her reverie."
  • "Eleanor cleared her throat, the sound startlingly loud."
  • "Hugo Vane, property developer of some ... propriety, did not meet her gaze."
  • "The room felt smaller with each ... gravity of the scene asserted itself."
  • "Outside, the fog pressed against the ... the glass to a milky blur."
  • "Hugo Vane shifted his weight, the floorboard groaning beneath him."
  • "Eleanor regarded him, her expression unreadable."
  • "Hugo Vane hesitated, his eyes darting ... if weighing the wisdom of flight."
  • "Eleanor let the silence stretch, the ... the moment settling over them both."
  • "She turned her attention to the ... absence of any sign of struggle."
  • "Behind her, Hugo Vane cleared his throat again, the sound brittle."
  • "The tension in the room was ... running beneath the veneer of civility."
  • "A distant chime sounded from the ... inches" of the room’s soundproof door."
  • "For now, though, she allowed herself a single, unguarded moment of sorrow."
  • "She turned back to Hugo Vane, ... like a cloak around her shoulders."
  • "Outside, the wind rose, rattling the windowpanes in their frames."
  • ""She wanted to see me at—look ... she stooped beside the writing desk."
  • "The implications of that note pressed ... chill that seeped through the floorboards."
  • "Drawing a careful breath, Eleanor turned her attention to the bed."
  • "A cold certainty settled in Eleanor’s chest."
  • "The door creaked open behind her, ... echo of voices from the corridor."
  • "Captain Ivor Hale, the retired naval ... preceded him, stood nearest the body."
  • "Eleanor straightened, her own grief now ... by a keen sense of observation."
  • ""Dr."
  • "Before Eleanor could press him further, ... his suit sharp against the gloom."
  • "The conversation twisted, each man’s words ... against the implications of the scene."
  • "Hugo Vane’s reply was measured, almost rehearsed."
  • "Captain Ivor Hale’s presence seemed to amplify the pressure in the room."
  • "A silence fell, broken only by ... on the latest in European affairs."
  • "Eleanor’s mind worked through the contradictions."
  • "She let her gaze linger on ... mouth, a tightening of the jaw."
  • "For a moment, the tension broke ... fog, illuminating the gramophone’s polished surface."
  • "The morning wore on, the cold ... in the grate surrendered to ash."
  • "That detail shifted the reasoning."
  • "As Eleanor prepared to leave, she caught one last look at Dr."

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

Return corrected JSON for chapters 3. Edit only the sections that failed — keep all content that passed validation, and return the complete updated chapter JSON.


RETRY CLASS: fair_play
ATTEMPT: 1/3
OFFENDING TEXT: repeated long paragraph fingerprint detected. Rewrite repeated scaffold-like prose into chapter-specific language.
MANDATORY FIXES:
- Resolve fair_play issues before accepting this batch.
- Chapter 3: the concealment mechanism is explained before the discriminating-test scene. Plant the physical clue (name the object/observation), but do NOT reveal HOW the trick worked — withhold the method/causal explanation until the discriminating-test scene or the final reveal.
- Template linter: repeated long paragraph fingerprint detected. Rewrite repeated scaffold-like prose into chapter-specific language.
- Template linter: high n-gram overlap detected (0.84 >= 0.65). Rephrase this passage to avoid template leakage.
```
