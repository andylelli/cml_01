# Actual Prompt Record

- Run ID: `mystery-1784571763605`
- Project ID: ``
- Timestamp: `2026-07-20T18:29:47.508Z`
- Agent: `Agent9-ProseGenerator-Ch2`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4.1`
- Temperature: `0.42`
- Max Tokens: `4500`
- Attempt: `first`
- Prompt Hash: `1f610b85f76ae231`

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
- MORAL COMPLEXITY REQUIREMENT: The mechanism of this crime carries a moral gray area: "The culprit initially planned a harmless prank, but the situation escalated beyond their control, leading to unintended consequences." — the culprit reveal and denouement MUST acknowledge this ambiguity. Do not let the ending feel clean or simple. Give the reader at least one moment of uncomfortable sympathy or moral doubt.

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
   - Captain Ivor Hale: The Jilted Lover
   - Beatrice Quill: The Outsider
   - Sylvia Trent: The Observer
   - Hugo Vane: The Manipulator
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

## Era: June 1948
In June 1948, the world is still reeling from the effects of World War II, and the Cold War is just beginning to shape geopolitical landscapes. The social fabric is evolving, with women entering the workforce and class dynamics shifting. Families gather for tea and picnics by the sea, yet the weight of recent events lingers in conversations. The era is marked by rationing and economic recovery, but there is also a sense of anticipation as new technologies emerge and society grapples with the remnants of past conflicts.
Emotional register: A prevailing sense of unease and anticipation grips society as communities navigate the uncertainties of a post-war world.
Physical constraints: Travel is limited by rationed fuel and public transportation shortages. | Coastal fog can suddenly obscure visibility, isolating communities. | Communication is still heavily reliant on radio broadcasts and letters.
Current tensions (weave into background texture): The Berlin Blockade continues, increasing fears of conflict in Europe. | The United Nations General Assembly is convening, raising hopes for global cooperation. | Discussions around civil rights are gaining momentum, challenging traditional norms.
Wartime context — The aftermath of the war has left many veterans struggling to reintegrate into civilian life, facing challenges in employment and social acceptance.: Women are increasingly visible in the workforce, challenging traditional gender roles and societal expectations. Absence effect: The absence of loved ones lost in the war creates an emotional void, affecting family dynamics and relationships.

## Season Lock (mandatory — derived from June 1948)
Season: summer. Allowed vocabulary: summer, summery, midsummer
Forbidden seasonal words — never use in narration, dialogue, or metaphor: spring, autumn, winter and their adjectival forms.
Every weather description, atmosphere, and time-of-year reference must be consistent with summer.

## Story Theme
In a world where personal secrets intertwine with public facades, the pursuit of truth becomes a perilous journey that reveals the fragility of human connections and the consequences of deception.

## Story Emotional Register
Dominant: The story traverses a landscape of tension and emotional turmoil, culminating in a poignant confrontation with the past.

Arc:
The tale opens within the opulent confines of The Ocean View Hotel, a seaside retreat filled with laughter that quickly turns to horror when Dr. Mallory Finch is discovered dead, her life claimed by a mysterious poisoning. Eleanor Voss, a sharp-eyed journalist, is drawn into the investigation, her emotions a tangled web of concern for the victim and her own hidden past. As she begins to dig deeper, the air becomes thick with suspicion, and the guests' interactions reveal cracks in their carefully constructed facades. Initial clues lead her down a series of false paths, heightening her anxiety as she grapples with the emotional cost of her pursuit for truth.

A pivotal moment occurs when Eleanor discovers an unexpected connection between herself and the victim, shifting the investigation's focus and deepening her internal conflict. As revelations unfold, past relationships resurface, and the motives of the suspects grow increasingly complex. The tension mounts as Eleanor confronts each individual, uncovering their secrets while wrestling with her own emotions about the victim and the fiancé. The climax arrives in a fever pitch of confrontation, where the truth behind the poisoning is laid bare, revealing the lengths to which people will go to protect their interests and the fragility of human connections.

In the resolution, the emotional fallout is profound. Eleanor must reconcile her feelings for the victim's fiancé and the implications of the murder on her journalistic integrity. The other characters also face their own reckonings, as the cost of their secrets weighs heavily on their lives. Ultimately, the story closes with a somber reminder of the shadows that linger in our lives, and how the pursuit of truth can both liberate and devastate.

## Emotional register at this point in the story
The atmosphere is lively yet tinged with an undercurrent of tension as the guests enjoy their evening.

## Character Portraits (appearance & era)

### Eleanor Voss
Eleanor Voss embodies the spirit of a time marked by change, her role as a journalist allowing her to navigate the shifting social landscape. She represents the emerging voice of women in a post-war society, driven to uncover hidden truths while grappling with her own emotional conflicts.
Era intersection: Her hidden feelings for the victim's fiancé reflect the complexities of personal desires against the backdrop of societal expectations.

### Captain Ivor Hale
Captain Ivor Hale represents the enduring values of duty and honor in a world grappling with the consequences of war. His internal conflict over past relationships illustrates the emotional scars carried by those who served, navigating a landscape shaped by betrayal and heartbreak.
Era intersection: His past with the victim showcases the struggles of veterans reconciling their identities as they transition back to civilian life.

### Beatrice Quill
Beatrice Quill epitomizes the glamorous yet competitive nature of high society in the 1940s. As an ambitious journalist, she must navigate the treacherous waters of love and rivalry, reflecting the shifting gender dynamics and expectations of women in the workforce.
Era intersection: Her unrequited love for Ivor reveals the emotional challenges women face in a society that often prioritizes romantic competition over personal fulfillment.

### Sylvia Trent
Sylvia Trent, the diligent hotel manager, represents the backbone of post-war society, where women are stepping into leadership roles. Her commitment to maintaining the hotel's reputation amid chaos mirrors the broader societal struggle for stability and respect.
Era intersection: Her secret about the victim highlights the moral dilemmas faced by women in positions of authority during a time of upheaval.

## Character Voices

### Eleanor Voss (she/her/her)
Eleanor speaks with a measured tone, often punctuating her observations with a wry smile.
[comfortable] Ah, but isn’t that the question of the hour? With all this chaos, one wonders how the heart can remain unscathed.
[evasive] I suppose it’s just a matter of perspective. Some truths are better left unexamined, don’t you think?
[stressed] This investigation is spiraling out of control. How can I uncover the truth without exposing my own secrets?
Humour: Her dry wit often lightens the tension, even when the stakes are high.

### Captain Ivor Hale (he/him/his)
Ivor speaks with a commanding presence, often slipping into self-deprecating remarks.
[comfortable] Well, that’s one way to get your heart broken. Life has a funny way of playing tricks on us.
[evasive] I was merely passing time at the bar—nothing suspicious about that, is there?
[stressed] I can't shake this feeling of dread. What if my past catches up with me in the worst way?
Humour: His self-deprecating humour adds depth to his character, revealing his vulnerabilities.

### Beatrice Quill (she/her/her)
Beatrice speaks with a polished, playful tone, often lacing her dialogue with sharp wit.
[comfortable] Oh darling, life is simply too short for mediocrity. We must embrace the chaos, don’t you agree?
[evasive] I was at a charity event, darling. One can hardly be everywhere at once, can they?
[stressed] This is a disaster! If they discover my feelings for Ivor, I’ll be the laughingstock of society.
Humour: Her polite savagery sharpens the tension as she navigates her feelings for Ivor.

### Sylvia Trent (she/her/her)
Sylvia speaks with an air of authority, her tone calm and measured.
[comfortable] Let’s keep things in order, shall we? A little organization goes a long way in these trying times.
[evasive] I assure you, my focus is solely on maintaining the hotel's reputation.
[stressed] I can’t let this scandal ruin everything I’ve worked for. The stakes are too high.
Humour: Sylvia’s observational humour is subtle, often emerging in moments of tension.

## Location Registers (scene framing guides)

The Grand Lobby: The Grand Lobby is a hub of anxious energy, where the whispers of guests intertwine with the crackling radio broadcasts, creating an atmosphere rife with tension and unease.. Camera angle: As a writer entering this space, one might focus on the flickering candlelight casting shadows on concerned faces, amplifying the sense of impending danger.. Era: The elegance of the 1940s contrasts sharply with the underlying anxiety of recent events.

The Dining Saloon: The Dining Saloon buzzes with a mix of excitement and apprehension as guests enjoy their meals, the sound of clinking cutlery punctuated by hushed conversations filled with speculation.. Camera angle: The writer might capture the flickering candlelight and the worried glances exchanged between guests, hinting at the secrets they share.. Era: The post-war recovery is evident in the fine china and elegant decor, yet the tension is palpable.

The Guest Rooms: The Guest Rooms offer a sense of isolation, where secrets linger in the air, and the sound of distant waves crashing serves as a reminder of the chaos outside.. Camera angle: In this space, the writer might focus on the contrasts between the peaceful decor and the inner turmoil of the guests.. Era: These quaint rooms, adorned with vintage furnishings, reflect a longing for stability amidst uncertainty.

The Library: The Library is a sanctuary of quiet contemplation, yet the musty scent of old books mingles with an undercurrent of tension, reminding guests that secrets can be found within its pages.. Camera angle: Entering this space, the writer might highlight the interplay of light and shadow, suggesting the hidden narratives waiting to be uncovered.. Era: The dim lighting and rich wood furnishings convey a sense of history, echoing the weight of unspoken truths.

## Humour guidance for this story position (opening)
Permission: forbidden
Rationale: The initial crime sets a serious tone that does not allow for levity.

FAIR-PLAY AND INFERENCE CONTRACT:
- FAIR PLAY CLUE TIMING: Never combine clue discovery and detective deduction in the same chapter. If a clue is first revealed to the reader in chapter N, the detective may only analyze, deduce from, or act on that clue in chapter N+1 or later.
- FAIR PLAY INFORMATION PARITY: The reader must see all clues BEFORE the detective uses them in reasoning. If the detective performs a test or makes a deduction, every piece of evidence supporting that conclusion must have been shown to the reader in earlier chapters.
- FAIR PLAY REVELATION SPACING: In the discriminating test scene, the detective can ONLY use clues that were revealed to the reader at least 1 full chapter earlier. Never introduce new clues or withheld information during the test.
- FAIR PLAY CONFRONTATION: During the final confrontation/revelation, the detective cannot surprise the reader with facts. Every piece of evidence cited must have been visible to the reader in prior chapters.
- Never solve by withheld information. Keep reader-information parity with detective reasoning.
- False assumption in force: Dr. Mallory Finch had a heart condition that caused her sudden collapse.
- Hidden truth to progressively expose (compose in your own words from these elements): true, cause, death, slow, acting, poison, administered, hugo, vane
- Inference path checkpoints to dramatize clearly — compose ENTIRELY in your own sentences from these key terms (reproducing any briefing phrase verbatim FAILS validation):
  - Step 1: obs: witnesses, recall, finch, frequently, asking, refills, dinner | corr: indicates, consuming, significantly, larger, volume, drink, usual | effect: narrows, opportunity, others, tamper, drink, evening
  - Step 2: obs: faint, odor, almonds, detected, near, finch, table, collapse | corr: odor, suggests, presence, toxic, substance, typically, associated, poisoning | effect: eliminates, possibility, natural, causes, death
  - Step 3: obs: small, puncture, finch, glass, investigation | corr: indicates, drink, tampered, release, poison, gradually | effect: narrows, down, suspect, pool, access, glass
- Discriminating test method: trap
- Discriminating test elements to dramatize (compose ENTIRELY in your own sentences from these — do NOT reproduce any briefing phrase verbatim): discriminating, compares, dinner, drink, witness, claimed, timeline
- Test must rely on already-shown clue IDs: clue_mechanism_visibility_core, clue_culprit_direct_1, clue_6
- Fair-play rationale: Step 1: The witness accounts of Dr. Finch's drinking habits (early) and the almond smell (mid) point to deliberate poisoning. Step 2: The punctured glass (mid) confirms tampering, eliminating natural causes. Step 3: The discriminating test will reveal if the same method was used on other guests, confirming Hugo Vane's guilt.

## Character Reference

### Eleanor Voss (she/her — NEVER he/him)
Eleanor speaks with a measured tone, often punctuating her observations with a wry smile
She has a habit of asking rhetorical questions, drawing in her listener.
Eleanor grapples with her growing feelings for the fiancé, torn between her personal desires and her professional ethics.
Voice colour: Eleanor Voss uses dry wit humour — let it surface in their dialogue where natural, not in every line.

### Captain Ivor Hale (he/him — NEVER she/her)
Ivor speaks with a commanding presence but often slips into self-deprecating remarks, revealing a softer side
He uses military jargon occasionally, but his tone is warm and engaging.
Ivor struggles with feelings of betrayal and the desire for revenge, battling his emotions while maintaining his heroic facade.
Voice colour: Captain Ivor Hale uses self deprecating humour — let it surface in their dialogue where natural, not in every line.

### Beatrice Quill (she/her — NEVER he/him)
Beatrice speaks with a polished, playful tone, often lacing her dialogue with sharp wit
She enjoys wordplay and often turns phrases to her advantage.
Beatrice struggles with feelings of inadequacy and jealousy, torn between her affections for Ivor and her desire for social acceptance.
Voice colour: Beatrice Quill uses polite savagery humour — let it surface in their dialogue where natural, not in every line.

### Sylvia Trent (she/her — NEVER he/him)
Sylvia speaks with an air of authority, her tone calm and measured
She often observes situations carefully before responding, choosing her words with precision.
Sylvia is torn between her duty to protect the hotel's reputation and the moral obligation to reveal the truth about the victim.
Voice colour: Sylvia Trent uses observational humour — let it surface in their dialogue where natural, not in every line.


## CHARACTER CONTRACTS (binding for this scene)
Each entry below constrains how this character must be written in this chapter.
These override generic style guidance when they conflict.

### Eleanor Voss[SHE]
Voice & mannerisms: Eleanor speaks with a measured tone, often punctuating her observations with a wry smile. She has a habit of asking rhetorical questions, drawing in her listener.
SIGNATURE TIC (use sparingly — this is Eleanor Voss's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "Ah, but isn’t that the question of the hour?"
Sample voice fragments (match this register and rhythm):
  [comfortable] "Ah, but isn’t that the question of the hour? With all this chaos, one wonders how the heart can remain unscathed."
  [evasive] "I suppose it’s just a matter of perspective. Some truths are better left unexamined, don’t you think?"
Humour: dry wit — deploy occasionally (level 0.5)
FORBIDDEN phrase (never write for Eleanor Voss): "a surge of determination washed over her"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Desires to uncover the truth but fears her own involvement will be discovered." — do not surface in Act I.

### Captain Ivor Hale[HE]
Voice & mannerisms: Ivor speaks with a commanding presence but often slips into self-deprecating remarks, revealing a softer side. He uses military jargon occasionally, but his tone is warm and engaging.
SIGNATURE TIC (use sparingly — this is Captain Ivor Hale's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "Well, that’s one way to get your heart broken."
Sample voice fragments (match this register and rhythm):
  [comfortable] "Well, that’s one way to get your heart broken. Life has a funny way of playing tricks on us."
  [evasive] "I was merely passing time at the bar—nothing suspicious about that, is there?"
Humour: self deprecating — deploy occasionally (level 0.4)
FORBIDDEN phrase (never write for Captain Ivor Hale): "she knew with certainty she was right"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Bitter about the victim's betrayal; desires revenge for emotional pain." — do not surface in Act I.

### Beatrice Quill[SHE]
Voice & mannerisms: Beatrice speaks with a polished, playful tone, often lacing her dialogue with sharp wit. She enjoys wordplay and often turns phrases to her advantage.
SIGNATURE TIC (use sparingly — this is Beatrice Quill's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "Oh darling, life is simply too short for mediocrity."
Sample voice fragments (match this register and rhythm):
  [comfortable] "Oh darling, life is simply too short for mediocrity. We must embrace the chaos, don’t you agree?"
  [evasive] "I was at a charity event, darling. One can hardly be everywhere at once, can they?"
Humour: polite savagery — deploy occasionally (level 0.6)
FORBIDDEN phrase (never write for Beatrice Quill): "she felt a wave of unease"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Feels overlooked and seeks to eliminate her competition for Ivor's affection." — do not surface in Act I.

### Sylvia Trent[SHE]
Voice & mannerisms: Sylvia speaks with an air of authority, her tone calm and measured. She often observes situations carefully before responding, choosing her words with precision.
SIGNATURE TIC (use sparingly — this is Sylvia Trent's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "Let’s keep things in order, shall we?"
Sample voice fragments (match this register and rhythm):
  [comfortable] "Let’s keep things in order, shall we? A little organization goes a long way in these trying times."
  [evasive] "I assure you, my focus is solely on maintaining the hotel's reputation."
Humour: observational — deploy occasionally (level 0.4)
FORBIDDEN phrase (never write for Sylvia Trent): "everyone could sense the atmosphere"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Wants to keep the hotel's reputation intact and fears the victim's revelations." — do not surface in Act I.



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

Primary Location: The Azure Crest Hotel (Barmouth, Wales)
A grand seaside hotel perched on the rugged coastline, blending art deco elegance with coastal charm, now haunted by recent unsettling events.

Key Locations Available:
- The Grand Lobby (interior): Gathering space for guests
- The Dining Saloon (interior): Dining space for guests
- The Guest Rooms (interior): Private space for guests
- The Library (interior): Quiet space for reading and reflection

Atmosphere (tonal cue only — do NOT reproduce this phrase verbatim in prose; translate into scene-specific, character-observed sensory language): tense, as guests are on edge due to recent unsettling events in the area
Weather: overcast with occasional rain, typical for coastal regions in the fall

Era markers: radio broadcasts filling the lobby | rationed fuel affecting travel plans | women in service roles within the hotel

USAGE GUIDELINES:
1. First mention of location: Ground the scene using sensory details drawn from the profiles — paraphrase these into what the POV character directly observes and experiences, not a summary of the room's general qualities
2. Geographic grounding: Reference the specific place (Barmouth, Wales) naturally in dialogue or narrative
3. Action scenes: Integrate physical layout details (access, sightlines, constraints)
4. Atmospheric scenes: Reference weather, lighting, sounds from sensory palette
5. Era details: Weave in period markers naturally
6. Consistency: Keep all location descriptions aligned with profiles
7. OPENING GROUNDING (required, first 1-2 paragraphs of EVERY chapter): (a) name the specific location from this list, (b) give at least 2 concrete sensory details (sound, smell, temperature, texture, light/shadow), and (c) one time-of-day or weather/atmosphere detail — BEFORE advancing plot, clues, or the mechanism. Open on the setting and the people in it, not on the puzzle.
8. This matters most in pre-reveal chapters that withhold the mechanism: ground them in setting and character rather than rushing the investigation — a withheld chapter is not an empty one.
9. Do NOT use generic repeated manor/storm filler without profile-specific details; vary the opening location/sense each chapter

SENSORY PALETTE (use 2-3 senses per scene):
The Grand Lobby (interior):
  - Visual: gleaming marble floors, art deco chandeliers, polished brass fixtures
  - Sounds: hushed conversations, crackling radio broadcasts, footsteps on marble
  - Scents: damp wood and old leather, freshly polished furniture, faint perfume
  - Touch: cold marble underfoot, smooth brass handrails

The Dining Saloon (interior):
  - Visual: fine china and silverware, elegantly set tables, large windows overlooking the sea
  - Sounds: clinking of cutlery, soft chatter of guests, the distant roar of waves
  - Scents: aroma of hearty stew, freshly baked bread, cooked meats and vegetables
  - Touch: smooth tablecloths, cold silverware

The Guest Rooms (interior):
  - Visual: vintage floral wallpaper, quaint wooden furniture, sea views from windows
  - Sounds: the rustle of sheets, distant waves crashing, soft footsteps in the hallway
  - Scents: fresh linen, faint scent of lavender, mildew from the dampness
  - Touch: soft cotton sheets, cool wooden furniture

⛔ REFERENCE DATA — DO NOT TRANSCRIBE VERBATIM: The above profiles are structural guides only. Generate original prose that evokes these qualities; do not reproduce the exact phrasing or sentence structure of the profile paragraphs.

SCENE OPENING RULE: When opening a scene in a new location, write what the POV character directly observes and physically senses at that moment — not a general description of the room's qualities. The reader must feel present, not briefed. Sensory details must be observed by the character, not stated as fact about the place.

SENSORY WRITING TECHNIQUES:
- Ope
[truncated for prompt budget]

## Texture Pool
Draw on these as opportunities arise — you are not required to use them.

- In June 1948, the world is still reeling from the effects of World War II, and the Cold War is just beginning to shape geopolitical landscapes
- The social fabric is evolving, with women entering the workforce and class dynamics shifting
- Families gather for tea and picnics by the sea, yet the weight of recent events lingers in conversations
- The era is marked by rationing and economic recovery, but there is also a sense of anticipation as new technologies emerge and society grapples with the remnants of past conflicts.

TEMPORAL CONTEXT:

This story takes place in June 1948 during summer.

Seasonal Atmosphere:
- Weather patterns: overcast with occasional rain, cool breezes from the sea, humidity rising in the afternoons
- Daylight: Long summer days with daylight extending to nearly ten o'clock at night, but the coastal fog can roll in unexpectedly.
- Seasonal activities: beachcombing along the shore, evening dances at the hotel ballroom, seaside picnics with family
- Seasonal occasions: Father's Day (June 20)
- Season: summer

Period Fashion (describe naturally):
- Men formal: navy blue linen suit, lightweight cotton dress shirt, matching tie with geometric patterns
- Men casual: khaki shorts, short-sleeve plaid shirt, canvas slip-on shoes
- Men accessories: straw fedora, leather belt with brass buckle, sunglasses with round frames
- Women formal: floral tea-length dress with cap sleeves, lightweight cardigan, string of pearls
- Women casual: cotton sundress with a cinched waist, bloomers with a matching blouse, ballet flats
- Women accessories: wide-brimmed straw hat, colorful silk scarf, woven handbag

Cultural Context (reference naturally):
- Music/entertainment: Bing Crosby's 'Too-Ra-Loo-Ra-Loo-Ral', The Andrews Sisters' 'Rum and Coca-Cola', Nat King Cole's 'Nature Boy'; Films: 'The Treasure of the Sierra Madre', 'Key Largo'; Theatre: 'Annie Get Your Gun', 'South Pacific'; Radio: 'The Shadow', 'The Jack Benny Program'
- Typical prices: Loaf of bread: four pence, Coke: six pence, Taxi ride across town: two shillings
- Current events: the Berlin Blockade continues, increasing tensions in Europe; the first session of the United Nations General Assembly takes place
- Literature: 'The Naked and the Dead' by Norman Mailer | 'The Catcher in the Rye' by J.D. Salinger | 'A Streetcar Named Desire' by Tennessee Williams | [noir fiction] | [post-war literature] | [mystery and thriller]
- Technology: the transistor radio | early computers like ENIAC | development of jet propulsion technology | standard radio sets | black-and-white televisions | film cameras
- Daily life: strolling along the boardwalk, attending local fairs and summer festivals, visiting the local cinema for the latest film
- Social rituals: tea time in the afternoon, Sunday family dinners, evening social gatherings at the hotel

Atmospheric Details:
The salty breeze carries the scent of the ocean, mingling with the aroma of freshly prepared seafood from the hotel's kitchen. The sound of laughter and clinking glasses fills the air as guests mingle in the hotel's dimly lit lounge, their voices slightly muffled by the thick fog rolling in from the sea. The flickering light from vintage ceiling fans creates a warm, inviting glow, contrasting with the overcast sky outside, where rain occasionally patters against the windows.

FASHION INTEGRATION TECHNIQUES:
- First appearance: Describe outfit to establish class/personality
- Accessories: Gloves, hats, pocket watches, jewelry reveal status
- Time-specific: Different outfits for different times of day
- Character traits: Fastidious dresser vs rumpled appearance
- Action integration: "She tugged at her glove" or "He adjusted his tie"
- Weather appropriate: Overcoats in winter, light linen in summer

CULTURAL TOUCHSTONE INTEGRATION:
- Casual conversation: "Did you hear that new jazz record?" or "I saw the latest Chaplin film"
- B
[truncated for prompt budget]

NON-NEGOTIABLE CHAPTER OBLIGATIONS — LOCKED EVIDENCE VALUES (VERBATIM REQUIRED):
The following measured values (times, amounts, measurements) are absolute ground truth. Every time this chapter describes, mentions, or alludes to one — no matter how briefly — it MUST use the exact phrase shown below, character for character. NO paraphrase, approximation, rounding, or synonym is permitted.

FAILURE EXAMPLE: if the locked value is "at thirteen minutes to midnight" and you write "just before midnight" or "around midnight" — that is a HARD FAIL. You must write "at thirteen minutes to midnight". Equally, if the locked value is written in words, such as "ten minutes past eleven", and you convert it to figure-based clock notation — that is also a HARD FAIL. Words stay as words; figure forms are forbidden for word-phrased facts.

CRITICAL — WORD-PHRASED VALUES: If the canonical value is written out in words (e.g. a time like "ten minutes past eleven", or an amount like "forty minutes"), reproduce those exact words. DO NOT convert to figure-based time notation, twenty-four-hour format, or any other numeric shorthand. Correct: "ten minutes past eleven". WRONG: figure-based clock notation or numeric shorthand.

Locked values:
  - the victim's death occurred exactly thirty minutes after consuming the drink: "half past nine at night"
  - the amount of poison infused into the drink over the duration: "two ounces"
  - the time interval at which the victim was served refills: "every fifteen minutes"

If a value has no relevance to this chapter, omit it. But the moment you reference the underlying evidence, only the exact phrase above is acceptable.

⛔ CLUES TO SURFACE IN THESE CHAPTERS — mandatory:
The following evidence MUST be clearly observable to an attentive reader. Do not bury it in atmosphere or passing dialogue. Each clue must be concrete, specific, and noticeable:

• [clue_core_contradiction_chain] indicates, consuming, significantly, larger, volume, drink, usual
  Category: testimonial | Criticality: essential | Supports inference step 1
  Points to: contradicts, assumption, finch, health, issues

For each clue above: an attentive reader should be able to find, record, and later use it to reason toward the solution.

═══ NARRATIVE STATE (read-only — do not contradict) ═══

LOCKED FACTS — use verbatim whenever this evidence is described:
  • the victim's death occurred exactly thirty minutes after consuming the drink: "half past nine at night"
  • the amount of poison infused into the drink over the duration: "two ounces"
  • the time interval at which the victim was served refills: "every fifteen minutes"

CHARACTER PRONOUNS — never deviate from these:
  • Eleanor Voss: she/her/her
  • Dr. Mallory Finch: she/her/her
  • Captain Ivor Hale: he/him/his
  • Beatrice Quill: she/her/her
  • Sylvia Trent: she/her/her
  • Hugo Vane: he/him/his

CLUES ALREADY REVEALED TO READER: clue_mechanism_visibility_core — do not reveal these as new information.

INVESTIGATION LOG — WHAT IS ESTABLISHED (do not re-establish, do not repeat):
• Evidence already established (reference only — do NOT restate or quote these; advance beyond them): finch, drinking, habits, dinner
• Suspects still unresolved: Captain Ivor Hale[HE], Beatrice Quill[SHE], Sylvia Trent[SHE]
⚠ The story must move FORWARD from this log. Any beat already listed above is forbidden from repeating.

⚠ THIS CHAPTER'S REQUIRED ADVANCE (opening): Discover the body, confirm the victim, establish the scene. The victim is found dead. They do not speak, react, or gesture. This is their only physical appearance — in all subsequent chapters they exist only in past tense (memory, evidence, testimony).

CONTINUITY HANDOFF — previous chapter closing beat:
  • "Outside, the fog had thickened, obscuring the view of the sea and hemming the hotel in a cocoon of uncertainty. Within the dining room, the guests clustered together, each one acutely aware of the eyes upon them. The summer morning, meant to bring light and cl..."
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
dining room, corridor, lobby

✓ RULE: Continue using this location vocabulary. Maintain consistency with established setting type.
✓ Do NOT introduce new location types that contradict earlier chapters.

**Recent Chapter Summary (for narrative continuity):**
Chapter 1: Chapter 1: The Unsettling Silence
  Events: Eleanor’s breath caught.

⚠️ **VALIDATION:** Character name mismatches and setting drift are common failure modes.
Double-check every character name against the list above before using it.

**⏱ LOCKED TIME ANCHOR — use verbatim, do not paraphrase:**
Clock time (from the case ground truth): **"Dinner party time"**
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
Known location profile anchors: The Azure Crest Hotel, The Grand Lobby, The Dining Saloon, The Guest Rooms, The Library, the dining room of the seaside hotel
LOCATION NAME CAPITALISATION (HARD REQUIREMENT — validated):
All named locations in your prose MUST use the EXACT capitalisation from the CML profiles.
Canonical forms: "The Azure Crest Hotel", "The Grand Lobby", "The Dining Saloon", "The Guest Rooms", "The Library", "the dining room of the seaside hotel"
Writing a location in lowercase (e.g. "drawing room" instead of "Drawing Room") is a validated error. Every time you mention a named location, copy its capitalisation from the list above.
- Chapter 2: OPENING STYLE (HARD): Start the VERY FIRST SENTENCE with spoken dialogue — e.g. '"[words]," [Name] said/asked/replied/murmured.' The opening quote must be the first character on the line. Anchor opening in "the dining room of the seaside hotel". The opening style above governs only your FIRST SENTENCE; the grounding below may land anywhere in the first 2 paragraphs (it need not be sentence one, and never conflicts with the chosen opening style). HARD REQUIREMENT for the first 2 paragraphs: (a) include 2+ sensory words — choose from smell/scent/odor/fragrance/sound/echo/silence/whisper/creak/cold/warm/damp/rough/smooth/glow/shadow/flicker/dim — and (b) include 1+ atmosphere/time word — choose from rain/wind/fog/storm/mist/thunder/evening/morning/night/dawn/dusk/lighting/weather/season/afternoon/midday/noon/midnight/twilight/sunrise/sunset/daylight/sunlight/overcast/cloudy/bright/dark/grey/pale/chill/crisp/drizzle/haze/lamplight/firelight. These are validated requirements, not style suggestions; missing them triggers a retry.

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

PROMPT BUDGET SUMMARY: budget=24000 tokens; fixed=10029; context=11702; dropped=[none]; truncated=[location_profiles, temporal_context, pronoun_accuracy]

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
4. Integrate at least two concrete era-grounded details per chapter from setting refinement signals: radio broadcasts | early television sets | basic radar equipment | long-distance telephone calls | military-style coded messages | impact of WWII on society.
5. Respect setting movement/access constraints in scene action and alibis: narrow hallways limit movement | some areas are off-limits to guests | stormy weather can hinder outdoor access | staff-only areas include the kitchen and maintenance rooms | guest access limited to assigned floors.
6. Sustain social coherence with this backdrop pressure: An unsettling series of events at a seaside hotel draws together guests and staff, all grappling with the societal upheaval of WWII and the emerging Cold War, as tensions rise over a mysterious poisoning incident.
7. Maintain continuity around these socially central cast anchors where relevant: Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill, Sylvia Trent, Hugo Vane.
8. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Critical: Plot similarity 0.85 with 'The Mysterious Affair at Styles' (same crime type and method)
9. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Moderate: Setting similarity 0.90 with 'The Mysterious Affair at Styles' (similar era and location type)
10. STORY TO DATE ANTI-COPY RULE: The STORY TO DATE section below is provided for chronological and factual reference ONLY. You MUST NOT copy, lightly rephrase, or structurally echo any sentence or paragraph from prior chapters. Every sentence in this chapter must be original prose unique to this scene. Reusing even a clause from prior chapter text will cause this attempt to fail immediately.

CRITICAL PROSE REQUIREMENTS:

The CML specifies exact requirements for certain validation-critical scenes. You MUST include these elements at the specified positions.

**Discriminating Test Scene (Act 3, Scene 4):**
Required elements: Execute the discriminating test, Observe the guests' reactions, Draw conclusion about guilt
Test type: trap

**Suspect Clearance Scenes:**
- Captain Ivor Hale (Act 3, Scene 5): Confirmed alibi in the bar during the time of death.
  Clues: witness statements, bar tab records
- Beatrice Quill (Act 3, Scene 5): Evidence shows the note was unrelated to the murder.
  Clues: note analysis, witness statements
- Sylvia Trent (Act 3, Scene 5): Witnesses confirm she was not in the dining area at the time.
  Clues: witness accounts

**Culprit Revelation Scene (Act 3, Scene 6):**
Method: Confrontation with gathered evidence.

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
Investigation state at start: 1 clue(s) revealed to reader; approximately 3 unresolved suspect(s).
Must change by end: Increase or complicate suspicion through a new pressure revelation — WITHOUT resolving the case: do NOT name, accuse, or extract a confession from the culprit, make an arrest, or declare the case closed (that is reserved for the final reveal).
Suspect pressure target(s): Captain Ivor Hale, Beatrice Quill, Sylvia Trent
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
- Chapter 2:
  - STRUCTURAL ARCHETYPE — Chapter 2 must be: FIRST_CONTACT
      ✓ MUST contain: at least two suspect interviews
      ✗ MUST NOT contain: physical evidence discovery
  - Word count: Target 1250 words. Achieve this through plot events, dialogue exchanges, and physical investigation — not through atmospheric repetition or extended internal reflection. Each 200-word segment should contain at minimum one concrete story event (a discovery, a conversation exchange, a physical action or movement). Padding with atmosphere alone is not acceptable.
  - Opening: Begin with a character action, spoken line, or clock/time marker — never a location name or location-description phrase.
  - Scene is set in: the dining room of the seaside hotel — reference it naturally within the paragraph, never as your opening phrase.
  - Opening atmosphere (MANDATORY — validator enforced): the first paragraph MUST contain at least one of: rain / wind / fog / storm / mist / thunder / evening / morning / night / dawn / dusk / season / afternoon / midday / noon / midnight / twilight / sunrise / sunset / daylight / sunlight / overcast / cloudy / bright / dark / grey / pale / cold / warm / chill / crisp / damp / drizzle / haze / lamplight / firelight. A chapter that omits all of these from its opening paragraph will be rejected.
  - PARAGRAPH OPENER DIVERSITY (MANDATORY — validator enforced): No more than 2 paragraphs in this chapter may begin with "Eleanor" or "Eleanor's" as the first word. You must vary paragraph openings throughout: use sensory observations, another character's name or action, dialogue, object or sound details, or temporal markers. Opening 3 or more paragraphs with "Eleanor" will cause automated rejection.
  - ⛔ MECHANISM SPOILER BAN: Do NOT state how the crime device was manipulated — not the direction, not the magnitude, not who performed it. Characters may only observe that two sources of evidence disagree. The specific method, tamper amount, and perpetrator's action are ALL FORBIDDEN until the reveal. WRONG: "The culprit had altered the device by forty minutes to create a false alibi." RIGHT: "Two independent pieces of evidence gave contradictory readings — a discrepancy neither could yet explain."
  - Continuity bridge: in the first 120 words, visibly connect from the previous chapter's final beat. Carry forward one unresolved element (object, accusation, emotional pressure, or immediate physical action) from: "Outside, the fog had thickened, obscuring the view of the sea and hemming the hotel in a cocoon of uncertainty. Within the dining room, the guests clustered together, each one acutely aware of the eyes upon them. The sum...".
  - CLUE OBLIGATIONS — each clue below MUST be dramatized, but in YOUR OWN WORDS:
    Render each as something a character SEES, DOES, or SAYS on the page. The bracketed text is a
    DESCRIPTION of the evidence for you — do NOT transcribe it as narration. Copying a clue's
    description sentence verbatim into the prose FAILS validation.
    • witnesses, note, finch, drink, level, unusually [clue_core_contradiction_chain] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: contradicts, assumption, finch, health, issues
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
  - ALIBI LOCK: Hugo Vane's established alibi is "night of the murder". Do NOT place Hugo Vane at any other location or in any other activity during the crime window. Any contradiction is a continuity error that triggers a retry.
  - TESTIMONY CONTINUITY: Hugo Vane has already made statements in earlier chapters. Any time, location, or claim attributed to Hugo Vane in THIS chapter must be consistent with those earlier statements. Do NOT introduce a new or different alibi claim — any contradiction is a continuity error.
- Locked fact phrase obligations:
  - If this batch mentions the victim's death occurred exactly thirty minutes after consuming the drink, write exactly: "half past nine at night".
  - If this batch mentions the amount of poison infused into the drink over the duration, write exactly: "two ounces".
  - If this batch mentions the time interval at which the victim was served refills, write exactly: "every fifteen minutes".
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
Batch chapters: 2-2.
Investigation state at start: 1 clue(s) revealed to reader; approximately 3 unresolved suspect(s).
Must change by end: Increase or complicate suspicion through a new pressure revelation — WITHOUT resolving the case: do NOT name, accuse, or extract a confession from the culprit, make an arrest, or declare the case closed (that is reserved for the final reveal).
Suspect pressure target(s): Captain Ivor Hale, Beatrice Quill, Sylvia Trent
Required new information: At least one fear/motive/lie/loyalty reveal with investigative consequence.
Forbidden reveals at this stage: No culprit resolution: no confession, no arrest, no 'case closed', no accusation ('I accuse'/'I name'), and never state 'the culprit/murderer/killer is/was …'. The accusation is reserved for the final reveal — build suspicion only.

FROZEN FACT STATE (DO NOT ALTER):
- Timeline anchor: June (summer).
- Month, season, weather, and time-of-year language in this batch must stay compatible with summer.
- Established timeline fact: Dinner party time
- Established timeline fact: Time of death
- If referenced, use exact phrase: "half past nine at night" (the victim's death occurred exactly thirty minutes after consuming the drink).
- If referenced, use exact phrase: "two ounces" (the amount of poison infused into the drink over the duration).
- If referenced, use exact phrase: "every fifteen minutes" (the time interval at which the victim was served refills).

STORY TO DATE (REFERENCE ONLY — DO NOT COPY VERBATIM):
- Full prior chapter text is provided below for continuity, factual consistency, and reference accuracy.
- Use this to keep character voice, chronology, clue state, and location continuity aligned with earlier chapters.
- Do not quote, copy, or paraphrase these paragraphs too closely; write fresh prose that remains consistent with them.

--- BEGIN PRIOR CHAPTER 1 ---
Title: Chapter 1: The Unsettling Silence
A thin veil of coastal fog pressed against the tall windows as Eleanor Voss stepped into the dining room of the seaside hotel, her shoes clicking softly against the polished floorboards. The air was heavy with the lingering scent of last night’s roast and the sharper tang of something less familiar—bitter, almost medicinal. Dim morning light filtered through the mist, casting long shadows across the elegant table settings, which stood in silent witness to the night’s abrupt end. At the far end of the room, Dr. Mallory Finch sat slumped over her plate, her head bowed as if in exhausted prayer, a single arm stretched toward a glass that lay overturned on the linen, a dark stain spreading from its mouth.

Eleanor’s breath caught. For a heartbeat, she stood motionless, the hush broken only by the distant creak of a serving trolley in the corridor. She crossed the room, her gaze fixed on Dr. Mallory Finch’s still form, noting the unnatural pallor of her skin and the rigid set of her shoulders. The glass, lying on its side, exhaled a faint, acrid odor that prickled Eleanor’s nose—a detail that, even now, felt out of place among the remnants of a convivial dinner. She remembered, with a jolt, how Dr. Mallory Finch had called out for another refill more than once during the meal, her voice sharp above the hum of conversation. It had struck Eleanor as odd at the time, but she had dismissed it as mere impatience, the sort that sometimes accompanied Dr. Mallory Finch’s relentless pursuit of attention.

A cold draft snaked along the floor, stirring the hem of Eleanor’s floral dress as she leaned closer. The silence in the room was absolute, broken only by the muffled sound of rain tapping against the glass. Eleanor hesitated, her hand hovering above Dr. Mallory Finch’s shoulder, unwilling to disturb the tableau yet compelled by the gravity of her role. She had not expected to become the investigator, but in the absence of any official, the duty had fallen to her—an uncomfortable inheritance, yet one she would not shirk. Her own heart thudded with a mixture of dread and a journalist’s reluctant curiosity. The scene before her was not merely tragic; it was deeply, unmistakably wrong.

A faint, sweetish scent hovered above the tablecloth, mingling with the metallic tang of spilt wine. Eleanor’s gaze traveled from the glass to the pattern of droplets on the plate, then to the edge of Dr. Mallory Finch’s sleeve, which bore a faint, irregular stain. She glanced up, half-expecting the door to burst open with the arrival of a constable or a panicked guest, but the corridor remained empty, the tension in the air thickening with every passing moment. She forced herself to catalogue the details: the untouched bread roll, the knife askew beside the plate, the napkin crumpled in Dr. Mallory Finch’s lap. Each spoke of an evening interrupted, of a life abruptly severed.

Captain Ivor Hale entered next, his navy linen suit immaculate despite the hour, a faint shadow of stubble on his jaw. He paused in the doorway, his eyes narrowing as they took in the scene. The former officer’s bearing was rigid, but his hand trembled slightly as he adjusted his tie. He was known to be Dr. Mallory Finch’s confidant—some whispered, more than that. Now, his gaze flicked from the body to Eleanor, searching her face for answers she did not yet possess. Eleanor noted the tension in his jaw, the way his fingers flexed at his side, betraying a strain beneath the surface.

Beatrice Quill followed, her arrival heralded by the scrape of her chair and the rustle of her lightweight cardigan. The outsider among the guests, she had always seemed to hover at the periphery of conversation, her dark eyes observant and unreadable. She lingered just inside the doorway, arms folded across her chest, her lips pressed together in a line that suggested both anxiety and calculation. Beatrice’s connection to Dr. Mallory Finch was less clear, but Eleanor recalled a heated exchange between them the previous evening—something about a misattributed article, the sort of professional slight that could fester. Now, Beatrice’s gaze lingered on the overturned glass, and she seemed to shrink from the table, as if proximity alone might implicate her.

Sylvia Trent arrived with less ceremony, her pale dress blending with the grey light, her expression unreadable. She moved quietly, almost apologetically, her eyes darting from Eleanor to the body and back again. Sylvia was known as the observer—always present, rarely involved. Yet, as she took in the scene, her hands twisted the strap of her woven handbag, betraying a nervous energy she could not quite suppress. Eleanor wondered, not for the first time, what secrets Sylvia’s watchfulness concealed.

Hugo Vane appeared last, his stride brisk, his gaze coolly appraising. The manipulator, some called him, though never to his face. He paused just inside the threshold, surveying the room with a composure that bordered on indifference. Yet Eleanor noticed the faintest tightening around his eyes as he took in Dr. Mallory Finch’s form. Hugo’s presence seemed to draw the attention of the others, as if his opinion would set the tone for what followed. His voice, when it came, was low and precise. “Is it—has something happened?”

Eleanor straightened, her own voice steadier than she felt. “Dr. Mallory Finch is dead.” The words hung in the air, heavy and final. For a moment, no one moved. Then Captain Ivor Hale stepped forward, his composure cracking as he reached for the back of a chair, knuckles whitening. Beatrice Quill let out a soft gasp, her hand flying to her mouth. Sylvia Trent’s eyes brimmed with tears, though she blinked them away before they could fall. Hugo Vane, for his part, merely nodded, as if confirming a suspicion he had already entertained.

A hush descended, the only sound the faint patter of rain and the distant echo of a radio broadcast from the Grand Lobby—news of the Berlin Blockade, the world’s troubles intruding even here. Eleanor forced herself to focus, to see not just the tragedy but the puzzle it presented. She remembered, again, the repeated requests for refills—Dr. Mallory Finch’s voice, insistent, every fifteen minutes, as if thirst alone could explain such persistence. It was a detail that now seemed to shimmer with significance, though its meaning eluded her. She made a mental note to question the other guests about their recollections of the evening.

Captain Ivor Hale’s voice broke the silence. “She had a heart condition, didn’t she?” he asked, not quite meeting Eleanor’s gaze. “Perhaps it was simply… her time.” The suggestion hung between them, a lifeline for those who wished to believe in a merciful end rather than the alternative. Yet Eleanor could not shake the sense of wrongness, the way the glass lay askew, the odor that had no place at a summer dinner table.

She turned to the others, her eyes lingering on each in turn. “We mustn’t assume,” she said quietly. “Not until we understand what happened here. Dr. Mallory Finch was lively last night—argumentative, even. And now—” She gestured helplessly at the tableau. “Someone must have seen something. Heard something.”

Beatrice Quill shifted uncomfortably, her gaze darting to the door. “I—I remember her asking for more wine. Several times. She seemed… restless.”

Sylvia Trent’s voice was barely above a whisper. “She was laughing, just before. Then she coughed. I thought it was nothing.”

Hugo Vane, arms folded, regarded the room with a faint air of skepticism. “People collapse,” he said. “Especially those with weak hearts. Perhaps we are making more of this than we ought.”

Eleanor ignored the dismissal, her mind already cataloguing the details: the overturned glass, the sweetish odor, the pattern of requests for drink refills. She pressed her hand to the back of a chair, steadying herself, and allowed the silence to stretch. The rain intensified, drumming a steady rhythm against the windowpanes, as if marking time for the investigation that must now begin.

Outside, the fog had thickened, obscuring the view of the sea and hemming the hotel in a cocoon of uncertainty. Within the dining room, the guests clustered together, each one acutely aware of the eyes upon them. The summer morning, meant to bring light and clarity, had delivered instead a mystery—one Eleanor Voss was now bound to unravel, no matter the cost.
--- END PRIOR CHAPTER 1 ---

[SCENE COMPLETENESS CONTRACTS — MANDATORY. Each contract below lists what you MUST enact in that chapter. Do not summarise or mention these labels in the prose — enact them organically.]
Chapter 2 (Act 1) completeness contract:
  PIVOT ELEMENT (MANDATORY — write this into the prose, shown not told): "The conflicting statements regarding the timeline of the evening."
  FACT ESTABLISHED (MANDATORY — reader must know this by chapter end): "Establishes that the suspects' accounts of the evening differ significantly, raising suspicion."
  RED HERRING (MANDATORY — seed naturally, not flagged as false): [rh_2] Eleanor overhears Captain Hale mention Dr. Finch's medication, suggesting her health may have contributed to her collapse.

# Case Overview
Title: The Poisoned Tide
Era: 1940s
Setting: seaside hotel
Crime: murder (delayed-action poisoning)
Culprit: Hugo Vane
Victim: Dr. Mallory Finch
False assumption: Dr. Mallory Finch had a heart condition that caused her sudden collapse.
Cast: Eleanor Voss (she/her), Dr. Mallory Finch (she/her), Captain Ivor Hale (he/him), Beatrice Quill (she/her), Sylvia Trent (she/her), Hugo Vane (he/him)

Setting Lock: Keep all scenes and descriptions consistent with the stated setting (seaside hotel). Do not introduce a different location type. Do not invent an alternative estate name. The only permitted name for this property is "seaside hotel" — any other estate name (e.g., "Caldwell Manor", "Ashwood Hall", or any invented proper name) is a continuity error that will be caught and rejected.

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
    "title": "Initial Reactions",
    "setting": {
      "location": "the dining room of the seaside hotel",
      "timeOfDay": "Morning after the murder",
      "atmosphere": "Heavy with tension and uncertainty"
    },
    "characters": [
      "Eleanor Voss",
      "Captain Ivor Hale",
      "Beatrice Quill",
      "Sylvia Trent"
    ],
    "purpose": "Establish initial reactions and introduce suspects",
    "cluesRevealed": [
      "clue_core_contradiction_chain"
    ],
    "dramaticElements": {
      "conflict": "Suspects react defensively to the situation.",
      "tension": "Questions arise about the timeline of events.",
      "microMomentBeats": [
        "Beatrice fidgets with her necklace, avoiding eye contact with others."
      ]
    },
    "summary": "As the guests gather in the dining room, Eleanor observes their varied reactions. Captain Hale appears stoic, while Beatrice fidgets nervously. Sylvia tries to maintain composure, but her hands tremble. Eleanor notes the conflicting accounts of the evening's events, leading her to question the reliability of their statements.",
    "beat": "crime",
    "estimatedWordCount": 1500,
    "pivotElement": "The conflicting statements regarding the timeline of the evening.",
    "factEstablished": "Establishes that the suspects' accounts of the evening differ significantly, raising suspicion.",
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
        "characterName": "Beatrice Quill",
        "behaviour": "Show normal social behaviour; grief or confusion if appropriate."
      },
      {
        "characterName": "Sylvia Trent",
        "behaviour": "Show normal social behaviour; grief or confusion if appropriate."
      }
    ],
    "redHerringPlacement": {
      "redHerringId": "rh_2",
      "placementDetail": "Eleanor overhears Captain Hale mention Dr. Finch's medication, suggesting her health may have contributed to her collapse."
    },
    "emotionalRegister": "Unease grows as the investigation begins, revealing the complexity of human relationships.",
    "dominantCharacterNote": {
      "name": "Eleanor Voss",
      "voiceRegister": "Eleanor speaks with a measured tone, often punctuating her observations with a wry smile."
    },
    "humourGuidance": {
      "permission": "forbidden"
    },
    "eraTextureNote": "Travel is limited by rationed fuel and public transportation shortages.; Coastal fog can suddenly obscure visibility, isolating communities.; Communication is still heavily reliant on radio broadcasts and letters.",
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
□ Chapter 2: the clue [clue_core_contradiction_chain] (indicates, consuming, significantly, larger, volume, drink, usual) is placed in the first 25% of the chapter, dramatized in your own words, followed by an explicit inference or suspicion paragraph.
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
