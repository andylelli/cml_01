# Actual Prompt Record

- Run ID: `mystery-1783972181080`
- Project ID: ``
- Timestamp: `2026-07-13T19:58:47.774Z`
- Agent: `Agent9-ProseGenerator-Ch1`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4.1`
- Temperature: `0.42`
- Max Tokens: `4500`
- Attempt: `first`
- Prompt Hash: `0eb993740ada625c`

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
- MORAL COMPLEXITY REQUIREMENT: The mechanism of this crime carries a moral gray area: "The culprit, driven by a desperate need to protect their reputation, may elicit sympathy despite their violent actions." — the culprit reveal and denouement MUST acknowledge this ambiguity. Do not let the ending feel clean or simple. Give the reader at least one moment of uncomfortable sympathy or moral doubt.

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
   - Captain Ivor Hale: Authority Figure
   - Beatrice Quill: Insider/Staff
   - Sylvia Trent: Elite Outsider
   - Hugo Vane: Creative Outsider
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
  Public identity anchor: Travel Journalist; detective 
  Connection to victim: Eleanor suspects Dr. Finch's past connection to the victim holds dark secrets.; Eleanor once interviewed Dr. Finch, who revealed little about her personal life, raising Eleanor's suspicions..
  Investigation relevance: is actively driving interviews and credibility checks in this scene.
  Suspicion/pressure cue seed: Desire for justice.
  Investigator read: include one immediate observational inference (gesture, gaze target, pause, object grip), but do not state guilt as fact.

- Captain Ivor Hale
  Public identity anchor: Retired Naval Officer; suspect 
  Connection to victim: Dr. Finch is wary of Captain Hale's judgment due to their respective backgrounds.; They once argued about the ethics of wartime medicine at a community gathering..
  Investigation relevance: access plausibility: high | alibi window: From ten to eleven | opportunity channel: The beach access from the hotel.
  Suspicion/pressure cue seed: Short temper when discussing Dr. Finch.
  Investigator read: include one immediate observational inference (gesture, gaze target, pause, object grip), but do not state guilt as fact.

- Beatrice Quill
  Public identity anchor: Hotel Receptionist; suspect 
  Connection to victim: Dr. Finch mentors Beatrice, but resents her naivety.; Beatrice often seeks Dr. Finch's guidance in her personal life, deepening their connection..
  Investigation relevance: access plausibility: medium | alibi window: Last seen at dinner until quarter to eleven | opportunity channel: Dining room access.
  Suspicion/pressure cue seed: Nervousness when questioned.
  Investigator read: include one immediate observational inference (gesture, gaze target, paus
[truncated for prompt budget]

WORLD DOCUMENT (use this as your primary creative context):

## Era: 1949-September
In September 1949, life in coastal England is marked by the lingering shadows of World War II. The aftermath of the war has reshaped social hierarchies, creating a blend of aspirations and anxieties among the population. The weather reflects the somber mood, with overcast skies and intermittent rain showers creating a sense of uncertainty. The economy is in recovery, but inflation is creeping into everyday life, making the simple act of shopping a nervous affair. Social expectations remain rigid, with traditional gender roles still influencing daily life, yet the presence of women in the workforce is reshaping societal norms. With the Cold War beginning to cast its shadow, tensions are palpable as families strive to rebuild their lives amidst the backdrop of changing social dynamics and the specter of past traumas.
Emotional register: A dominant sense of anxiety mixed with a yearning for stability permeates the collective consciousness.
Physical constraints: Rationing still affects daily life, limiting access to goods. | Travel is constrained by fuel shortages and high costs. | Communication is limited, with many relying on handwritten letters or the radio. | Public spaces are subject to social etiquette, restricting open discourse.
Current tensions (weave into background texture): The Cold War is intensifying, causing anxiety about global relations. | Women are increasingly entering the workforce, challenging traditional gender roles. | Class tensions are rising as communities grapple with loss and recovery from the war.
Wartime context — Many returning veterans are struggling to reintegrate into civilian life.: Communities are fractured by loss, with families grappling with absent loved ones. Absence effect: The absence of fathers, brothers, and sons looms large, creating a pervasive sense of grief.

## Season Lock (mandatory — derived from 1949-September)
Season: autumn. Allowed vocabulary: autumn, autumnal, fall
Forbidden seasonal words — never use in narration, dialogue, or metaphor: spring, summer, winter and their adjectival forms.
Every weather description, atmosphere, and time-of-year reference must be consistent with autumn.

## Story Theme
Amid the tides of change in post-war England, the dark undercurrents of personal motives and hidden truths emerge as characters confront their pasts in a deadly game of deceit.

## Story Emotional Register
Dominant: The emotional journey oscillates between tension and revelation, culminating in a profound exploration of truth and consequence.

Arc:
The story opens with the oppressive atmosphere of the Tidal Trap Hotel, where the murder of Dr. Mallory Finch casts a long shadow over the guests. The initial shock of the crime weighs heavily on everyone, and the sense of foreboding sets the stage for the investigation to unfold. As Eleanor Voss begins to piece together the fragments of the case, the rising unease grows; each clue leads her deeper into a web of deception, with false leads and emotional costs that threaten her own stability.

The pressure mounts as she navigates the complex relationships among the suspects, revealing their hidden motives and personal stakes. A pivotal moment arises when new evidence shifts the direction of her investigation, forcing her to reconsider all she thought she knew. As the climax approaches, the tension reaches a boiling point, culminating in a dramatic confrontation that lays bare the truth behind the murder. The resolution brings a bittersweet closure; while justice is served, the emotional toll on each character is profound, leaving them to grapple with the revelations and their own personal demons. In the end, the cost of uncovering the truth resonates deeply, reminding them all that the tides of change come with both clarity and chaos.

## Emotional register at this point in the story
The weight of the initial crime creates an atmosphere of dread and uncertainty.

## Character Portraits (appearance & era)

### Eleanor Voss
Eleanor Voss stands at the intersection of social change and personal ambition. As a travel journalist, she embodies the post-war desire for independence, but her quest for truth is haunted by her past traumas. The shifting societal roles for women resonate with her struggle for recognition in a male-dominated field, making her determined to uncover the truth behind the murder at the hotel.
Era intersection: Her ambition to reclaim her professional identity reflects the broader societal transitions happening in the wake of the war.

### Captain Ivor Hale
Captain Ivor Hale embodies the traditional male figure grappling with the post-war realities of financial instability and personal shame. His stoic demeanor masks a history of gambling debts tied to the victim, highlighting the pressures faced by returning veterans. As he confronts the consequences of his past, he reflects the broader societal anxieties surrounding honor and reputation in a rapidly changing world.
Era intersection: His internal conflict mirrors the struggles of many veterans trying to reconcile their pasts with their present.

### Beatrice Quill
Beatrice Quill, the charming hotel receptionist, illustrates the emotional turmoil of unrequited love within the rigid social structures of post-war England. Her obsession with the victim reveals the personal stakes that intertwine with societal expectations, as she navigates the blurred lines between affection and desperation in a world where women are often relegated to secondary roles.
Era intersection: Her struggle with unrequited love highlights the emotional costs of social expectations on women.

### Sylvia Trent
Sylvia Trent, a glamorous socialite, embodies the desire for status amidst a backdrop of financial insecurity. Her fear of exposure related to her past financial troubles reflects the precarious nature of social standing in post-war society. As she grapples with maintaining appearances, her character illustrates the tensions between personal ambition and societal judgment.
Era intersection: Her narrative showcases the pressures of social conformity and the fear of disgrace that women faced during this time.

### Hugo Vane
Hugo Vane represents the creative spirit at odds with moral integrity in a post-war landscape. As an eccentric author, he navigates the fine line between inspiration and exploitation, revealing the ethical dilemmas faced by artists during this era. His struggles with using others’ lives for his work echo the broader cultural shifts towards consumerism and individualism.
Era intersection: His internal conflict highlights the moral ambiguities artists faced as society shifted in the aftermath of the war.

## Character Voices

### Eleanor Voss (she/her/her)
Eleanor's voice is inquisitive and warm, often laced with a hint of dry humor that reflects her observational nature.
[comfortable] It's intriguing how people reveal themselves in moments of stress, isn't it?
[evasive] Well, I wouldn't want to jump to conclusions without all the facts, would I?
[stressed] This is all so overwhelming; I just need to find the truth.
Humour: Eleanor often uses her observational humor to navigate tense situations.

### Captain Ivor Hale (he/him/his)
Ivor's voice is direct and authoritative, often reflecting his military background with clipped tones.
[comfortable] In the service, we learned to face our challenges head-on.
[evasive] I was merely observing from a distance; there’s no need to overcomplicate this.
[stressed] The stakes are too high; I cannot afford to have my past come to light.
Humour: Ivor's humor is blunt, often serving as a shield against his insecurities.

### Beatrice Quill (she/her/her)
Beatrice's speech is heartfelt and tinged with sadness, often revealing her emotional struggles.
[comfortable] I just wanted to make him happy; is that so wrong?
[evasive] I was busy with guests; I hardly had time to notice anything else.
[stressed] This situation is spiraling out of control; I can't let them find out.
Humour: Beatrice's self-deprecating humor often emerges in her attempts to cope with her heartbreak.

### Sylvia Trent (she/her/her)
Sylvia's voice exudes sophistication, with a sharp undertone that hints at her cunning nature.
[comfortable] One must always keep up appearances, don't you think?
[evasive] I wouldn’t want to disclose anything that might jeopardize our reputations.
[stressed] If only they knew what lurked beneath the surface of this facade.
Humour: Sylvia often employs polite savagery in her conversations, masking her true feelings.

### Hugo Vane (he/him/his)
Hugo's speech is whimsical and sardonic, often meandering as he expresses his thoughts.
[comfortable] Ah, the absurdity of existence! It's all rather delightful, isn't it?
[evasive] Well, let's not dwell on the details; they can be quite tedious.
[stressed] This investigation threatens my very existence as an author!
Humour: Hugo's sardonic wit often serves as a coping mechanism for his anxiety.

## Location Registers (scene framing guides)

Grand Lobby: In the Grand Lobby, the air is thick with tension and unspoken secrets, as guests navigate the undercurrents of suspicion while trying to maintain their composure amidst the chaos.. Camera angle: As a writer enters this space, the camera captures the interplay of light and shadow, reflecting the hidden truths lurking just beneath the surface.. Era: The opulence of the Art Deco design clashes with the emotional turmoil of the post-war period.

Dining Area: The Dining Area buzzes with an uneasy energy, where laughter mingles with whispers, and each meal becomes a stage for hidden agendas and unspoken fears.. Camera angle: The camera lingers on the flickering candlelight, emphasizing the delicate balance between celebration and tension.. Era: The elegance of the setting contrasts sharply with the emotional stakes at play among the guests.

Guest Rooms: In the Guest Rooms, a sense of isolation pervades, as each character confronts their inner demons, wrapped in the tangible weight of their secrets.. Camera angle: The camera captures the contrast between the beautifully adorned rooms and the turmoil within each occupant.. Era: The vintage decor evokes nostalgia while simultaneously highlighting the characters' emotional struggles.

Oceanfront Balcony: The Oceanfront Balcony offers a breathtaking yet perilous view, where the churning sea mirrors the inner turbulence of the characters grappling with their choices.. Camera angle: The camera pans over the waves, emphasizing the duality of beauty and danger inherent in the setting.. Era: The harsh coastal winds serve as a reminder of the unpredictability of life in this era.

## Humour guidance for this story position (opening)
Permission: forbidden
Rationale: The opening scene establishes a serious tone, making humor inappropriate.

FAIR-PLAY AND INFERENCE CONTRACT:
- FAIR PLAY CLUE TIMING: Never combine clue discovery and detective deduction in the same chapter. If a clue is first revealed to the reader in chapter N, the detective may only analyze, deduce from, or act on that clue in chapter N+1 or later.
- FAIR PLAY INFORMATION PARITY: The reader must see all clues BEFORE the detective uses them in reasoning. If the detective performs a test or makes a deduction, every piece of evidence supporting that conclusion must have been shown to the reader in earlier chapters.
- FAIR PLAY REVELATION SPACING: In the discriminating test scene, the detective can ONLY use clues that were revealed to the reader at least 1 full chapter earlier. Never introduce new clues or withheld information during the test.
- FAIR PLAY CONFRONTATION: During the final confrontation/revelation, the detective cannot surprise the reader with facts. Every piece of evidence cited must have been visible to the reader in prior chapters.
- Never solve by withheld information. Keep reader-information parity with detective reasoning.
- False assumption in force: Dr. Mallory Finch drowned at the time indicated by the hotel clock.
- Hidden truth to progressively expose (compose in your own words from these elements): true, timing, tide, impossible, drown, time
- Inference path checkpoints to dramatize clearly — compose ENTIRELY in your own sentences from these key terms (reproducing any briefing phrase verbatim FAILS validation):
  - Step 1: obs: tide, schedule, shows, high, half, past, eleven | corr: finch, drowned, time, indicated, witnesses, high, tide | effect: narrows, potential, time, death, eliminating, claim, drowning, before, high, tide
  - Step 2: obs: captain, hale, watch, stopped, twenty, minutes, past, eleven | corr: captain, hale, watch, stopped, twenty, minutes, past, eleven, claim, finch, last, sighting | effect: eliminates, captain, hale, claim, being, finch, until, before, high, tide
  - Step 3: obs: witness, statements, contain, discrepancies, time, finch, last, sighting | corr: conflicting, accounts, witnesses, indicate, cognitive, bias, emotional, stress | effect: narrows, credibility, witnesses, claim, seen, finch, alive, shortly, before, drowning
- Discriminating test method: trap
- Discriminating test elements to dramatize (compose ENTIRELY in your own sentences from these — do NOT reproduce any briefing phrase verbatim): tide, schedule, times, claimed, hale, witnesses, reveal, inconsistencies
- Test must rely on already-shown clue IDs: clue_core_contradiction_chain, clue_mechanism_visibility_core, clue_6, clue_early_1
- Fair-play rationale: Step 1: The tide schedule (early) and witness accounts (mid) allow the reader to establish the timeline. Step 2: Hale's stopped watch reveals discrepancies in his alibi. Step 3: Witness contradictions expose cognitive bias, leading to the realization that Hale's timeline is impossible.

## Character Reference

### Eleanor Voss (she/her — NEVER he/him)
Speaks with a mix of enthusiasm and caution, often asking probing questions that reflect her curiosity
Occasionally punctuates her observations with dry humor.
Struggles with feelings of inadequacy and jealousy, questioning whether her pursuit of the truth is driven by integrity or a desire for validation.
Voice colour: Eleanor Voss uses observational humour — let it surface in their dialogue where natural, not in every line.

### Captain Ivor Hale (he/him — NEVER she/her)
Speaks in a direct, authoritative manner, often using military jargon
His words are clipped and precise, but there's a hint of weariness in his tone.
Ivor is torn between his sense of honor and the shame of his financial indiscretions, struggling to reconcile his past with his present.
Voice colour: Captain Ivor Hale uses blunt humour — let it surface in their dialogue where natural, not in every line.

### Beatrice Quill (she/her — NEVER he/him)
Speaks with an earnest warmth, often punctuating her sentences with nervous laughter
Her tone is often tinged with sadness, revealing her inner turmoil.
Beatrice struggles with the pain of unrequited love and the fear that her emotions could lead her down a dark path.

### Sylvia Trent (she/her — NEVER he/him)
Speaks with an air of sophistication, often using elaborate vocabulary
Her tone is smooth, but there's an underlying sharpness to her words that hints at her true nature.
Sylvia grapples with the fear that her past financial troubles will come to light, jeopardizing her social status and self-worth.
Voice colour: Sylvia Trent uses polite savagery humour — let it surface in their dialogue where natural, not in every line.

### Hugo Vane (he/him — NEVER she/her)
Speaks in a whimsical, digressive manner, often punctuating his sentences with dry humor and sarcasm
His tone is lively, reflecting his creative spirit.
Hugo grapples with the morality of using others' lives for his art, fearing the consequences of his actions could lead to ruin.
Voice colour: Hugo Vane uses sardonic humour — let it surface in their dialogue where natural, not in every line.


## CHARACTER CONTRACTS (binding for this scene)
Each entry below constrains how this character must be written in this chapter.
These override generic style guidance when they conflict.

### Eleanor Voss[SHE]
Voice & mannerisms: Speaks with a mix of enthusiasm and caution, often asking probing questions that reflect her curiosity. Occasionally punctuates her observations with dry humor.
SIGNATURE TIC (put a version of this in Eleanor Voss's mouth at least once, and never in anyone else's): "‘Isn’t it fascinating how people reveal themselves?’"
Sample voice fragments (match this register and rhythm):
  [comfortable] "It's intriguing how people reveal themselves in moments of stress, isn't it?"
  [evasive] "Well, I wouldn't want to jump to conclusions without all the facts, would I?"
Humour: observational — deploy occasionally (level 0.5)
FORBIDDEN phrase (never write for Eleanor Voss): "everyone could sense the atmosphere"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Desires to find the truth about the murder to vindicate her own credibility as a journalist." — do not surface in Act I.

### Captain Ivor Hale[HE]
Voice & mannerisms: Speaks in a direct, authoritative manner, often using military jargon. His words are clipped and precise, but there's a hint of weariness in his tone.
SIGNATURE TIC (put a version of this in Captain Ivor Hale's mouth at least once, and never in anyone else's): "‘In the service, we learned to face our challenges head-on.’"
Sample voice fragments (match this register and rhythm):
  [comfortable] "In the service, we learned to face our challenges head-on."
  [evasive] "I was merely observing from a distance; there’s no need to overcomplicate this."
Humour: blunt — deploy occasionally (level 0.4)
FORBIDDEN phrase (never write for Captain Ivor Hale): "she chose her words with great care"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Would have benefited from the victim's death by concealing financial failures linked to past ventures." — do not surface in Act I.

### Beatrice Quill[SHE]
Voice & mannerisms: Speaks with an earnest warmth, often punctuating her sentences with nervous laughter. Her tone is often tinged with sadness, revealing her inner turmoil.
SIGNATURE TIC (put a version of this in Beatrice Quill's mouth at least once, and never in anyone else's): "‘I just wanted to make him happy.’"
Sample voice fragments (match this register and rhythm):
  [comfortable] "I just wanted to make him happy; is that so wrong?"
  [evasive] "I was busy with guests; I hardly had time to notice anything else."
Humour: self deprecating — deploy rarely (level 0.3)
FORBIDDEN phrase (never write for Beatrice Quill): "she knew with certainty she was right"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Desperation and heartbreak leading to a violent confrontation." — do not surface in Act I.

### Sylvia Trent[SHE]
Voice & mannerisms: Speaks with an air of sophistication, often using elaborate vocabulary. Her tone is smooth, but there's an underlying sharpness to her words that hints at her true nature.
SIGNATURE TIC (put a version of this in Sylvia Trent's mouth at least once, and never in anyone else's): "‘One must always keep up appearances.’"
Sample voice fragments (match this register and rhythm):
  [comfortable] "One must always keep up appearances, don't you think?"
  [evasive] "I wouldn’t want to disclose anything that might jeopardize our reputations."
Humour: polite savagery — deploy occasionally (level 0.4)
FORBIDDEN phrase (never write for Sylvia Trent): "she felt a wave of unease"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Fear of social ruin if the truth about her financial dealings with the victim comes to light." — do not surface in Act I.

### Hugo Vane[HE]
Voice & mannerisms: Speaks in a whimsical, digressive manner, often punctuating his sentences with dry humor and sarcasm. His tone is lively, reflecting his creative spirit.
SIGNATURE TIC (put a version of this in Hugo Vane's mouth at least once, and never in anyone else's): "‘Ah, the absurdity of existence!’"
Sample voice fragments (match this register and rhythm):
  [comfortable] "Ah, the absurdity of existence! It's all rather delightful, isn't it?"
  [evasive] "Well, let's not dwell on the details; they can be quite tedious."
Humour: sardonic — deploy occasionally (level 0.6)
FORBIDDEN phrase (never write for Hugo Vane): "palpable tension filled the room"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Desires to eliminate the victim to avoid a lawsuit for defamation and to keep his research a secret." — do not surface in Act I.



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

Primary Location: The Tidal Trap Hotel (Brighton, England)
A grand Art Deco hotel perched precariously on the cliffs of Brighton, the Tidal Trap Hotel is both a sanctuary and a potential trap for its guests.

Key Locations Available:
- Grand Lobby (interior): Gathering space for guests
- Dining Area (interior): Clue discovery and social interaction
- Guest Rooms (interior): Private spaces for guests, potential hiding places for clues
- Oceanfront Balcony (exterior): Potential escape route or place for clandestine meetings

Atmosphere (tonal cue only — do NOT reproduce this phrase verbatim in prose; translate into scene-specific, character-observed sensory language): Tense and suspenseful, with a sense of impending revelation
Weather: Overcast with intermittent rain, typical of a coastal climate in the fall

Era markers: Art Deco architectural elements | Radio broadcasts filling the air | Rationed fuel impacting travel | Military presence in the area

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
  - Visual: gleaming marble floors, geometric Art Deco patterns, tall potted palms
  - Sounds: murmurs of conversation, footsteps on polished stone, clinking of glasses
  - Scents: freshly polished wood, faint perfume and cologne, salt air wafting in
  - Touch: smooth marble underfoot, cool metal of handrails

Dining Area (interior):
  - Visual: gleaming silverware on crisp linen, colorful floral centerpieces, steam rising from covered dishes
  - Sounds: clinking of plates and glasses, distant laughter and conversation, soft strains of classical music
  - Scents: savory aromas of roasted meats, freshly baked bread, scent of rich sauces simmering
  - Touch: smoothness of fine china, weight of silverware in hand

Guest Rooms (interior):
  - Visual: vintage wallpaper with floral patterns, heavy drapes framing the windows, ornate wooden furniture
  - Sounds: the distant crash of waves, whispers of conversations from the hallway, the creak of floorboards
  - Scents: the scent of fresh linens, the mustiness of old wood, the aroma of perfume lingering
  - Touch: softness of plush bedding, coolness of marble-topped tables

⛔ REFERENCE DATA — DO NOT TRANSCRIBE VERBATIM: The above profiles are structural guides only. Generate original prose that evokes these qualities; do not reproduce the exact phrasing or sentence structure of the profile paragraphs.

SCENE OPENING RULE: When opening a scene in a new location, write what the POV character directly observes and physically senses
[truncated for prompt budget]

## Texture Pool
Draw on these as opportunities arise — you are not required to use them.

- In September 1949, life in coastal England is marked by the lingering shadows of World War II
- The aftermath of the war has reshaped social hierarchies, creating a blend of aspirations and anxieties among the population
- The weather reflects the somber mood, with overcast skies and intermittent rain showers creating a sense of uncertainty
- The economy is in recovery, but inflation is creeping into everyday life, making the simple act of shopping a nervous affair
- Social expectations remain rigid, with traditional gender roles still influencing daily life, yet the presence of women in the workforce is reshaping societal norms

TEMPORAL CONTEXT:

This story takes place in September 1949 during N/A.

Seasonal Atmosphere:
- Weather patterns: overcast skies, intermittent rain showers, cool breezes from the coast
- Daylight: Days are shortening, with daylight fading by 7:30 PM, casting a gray hue over the landscape.
- Seasonal activities: visiting local fall fairs, harvesting apples at orchards, taking evening strolls along the coast
- Seasonal occasions: Labor Day (first Monday of September)
- Season: N/A

Period Fashion (describe naturally):
- Men formal: double-breasted navy suit, crisp white dress shirt, silk tie with geometric patterns
- Men casual: tweed sports jacket, khaki slacks, button-up flannel shirt
- Men accessories: fedora hat, leather gloves, silver cufflinks
- Women formal: tea-length floral dress, tailored blazer, pearl necklace
- Women casual: ankle-length skirt, blouse with puffed sleeves, cardigan sweater
- Women accessories: wide-brimmed hat, silk scarf, string of pearls

Cultural Context (reference naturally):
- Music/entertainment: 'The Tennessee Waltz' by Patti Page, 'Cry' by Johnnie Ray, 'Aba Daba Honeymoon' by Debbie Reynolds and Carleton Carpenter; Films: 'All the King's Men', 'The Third Man'; Theatre: 'Death of a Salesman' by Arthur Miller, 'The Glass Menagerie' by Tennessee Williams; Radio: 'Suspense' radio program, 'The Jack Benny Program'
- Typical prices: Loaf of bread: four pence, Movie ticket: one shilling, Bottle of milk: one shilling
- Current events: The United States is solidifying its position in the Cold War; The first issue of 'The Saturday Evening Post' after WWII features a cover by Norman Rockwell
- Literature: 'The Catcher in the Rye' by J.D. Salinger | '1984' by George Orwell | 'The Old Man and the Sea' by Ernest Hemingway | [mystery] | [thriller] | [post-war fiction]
- Technology: the transistor radio | the first commercially available microwave oven | early models of the television set | manual typewriters | film cameras | phonographs
- Daily life: attending local community events, reading in cafes, taking weekend road trips
- Social rituals: Sunday family dinners, weekly bingo nights at the local hall

Atmospheric Details:
The scent of wet earth hangs in the air, mixed with the briny tang from the nearby ocean, creating an unsettling atmosphere. The sound of rain tapping against the hotel windows harmonizes with distant thunder, amplifying the tension of the unfolding mystery. Dim light from the hotel lobby casts long shadows, creating an eerie ambiance as guests whisper behind closed doors.

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
- Authentic references: Use actual songs,
[truncated for prompt budget]

NON-NEGOTIABLE CHAPTER OBLIGATIONS — LOCKED EVIDENCE VALUES (VERBATIM REQUIRED):
The following measured values (times, amounts, measurements) are absolute ground truth. Every time this chapter describes, mentions, or alludes to one — no matter how briefly — it MUST use the exact phrase shown below, character for character. NO paraphrase, approximation, rounding, or synonym is permitted.

FAILURE EXAMPLE: if the locked value is "at thirteen minutes to midnight" and you write "just before midnight" or "around midnight" — that is a HARD FAIL. You must write "at thirteen minutes to midnight". Equally, if the locked value is written in words, such as "ten minutes past eleven", and you convert it to figure-based clock notation — that is also a HARD FAIL. Words stay as words; figure forms are forbidden for word-phrased facts.

CRITICAL — WORD-PHRASED VALUES: If the canonical value is written out in words (e.g. a time like "ten minutes past eleven", or an amount like "forty minutes"), reproduce those exact words. DO NOT convert to figure-based time notation, twenty-four-hour format, or any other numeric shorthand. Correct: "ten minutes past eleven". WRONG: figure-based clock notation or numeric shorthand.

Locked values:
  - The time of high tide on the night of the murder.: "half past eleven"
    ⛔ FORBIDDEN alternatives: "11:30", "11.30", "eleven thirty", "eleven-thirty", "eleven past thirty", "quarter past eleven" — the ONLY acceptable form is "half past eleven"
  - The time at which the victim's watch stopped.: "twenty minutes past eleven"
    ⛔ FORBIDDEN alternatives: "11:20", "11.20", "eleven twenty", "eleven-twenty", "eleven past twenty", "quarter past eleven", "half past eleven" — the ONLY acceptable form is "twenty minutes past eleven"
  - The last time the victim was seen alive by witnesses.: "a quarter to eleven"

If a value has no relevance to this chapter, omit it. But the moment you reference the underlying evidence, only the exact phrase above is acceptable.

⛔ CLUES TO SURFACE IN THESE CHAPTERS — mandatory:
The following evidence MUST be clearly observable to an attentive reader. Do not bury it in atmosphere or passing dialogue. Each clue must be concrete, specific, and noticeable:

• [clue_mechanism_visibility_core] Witness statement
  Category: structural | Placement: early (Act 1)
  Points to: what this observation reveals about the time or circumstances of the crime.

For each clue above: an attentive reader should be able to find, record, and later use it to reason toward the solution.

═══ NARRATIVE STATE (read-only — do not contradict) ═══

LOCKED FACTS — use verbatim whenever this evidence is described:
  • The time of high tide on the night of the murder.: "half past eleven"
  • The time at which the victim's watch stopped.: "twenty minutes past eleven"
  • The last time the victim was seen alive by witnesses.: "a quarter to eleven"

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
Known location profile anchors: The Tidal Trap Hotel, Grand Lobby, Dining Area, Guest Rooms, Oceanfront Balcony, the seaside hotel
LOCATION NAME CAPITALISATION (HARD REQUIREMENT — validated):
All named locations in your prose MUST use the EXACT capitalisation from the CML profiles.
Canonical forms: "The Tidal Trap Hotel", "Grand Lobby", "Dining Area", "Guest Rooms", "Oceanfront Balcony", "the seaside hotel"
Writing a location in lowercase (e.g. "drawing room" instead of "Drawing Room") is a validated error. Every time you mention a named location, copy its capitalisation from the list above.
- Chapter 1: OPENING STYLE (HARD): Start the VERY FIRST SENTENCE with a named character performing a physical action or motion — e.g. "[Name] crossed the threshold…" / "[Name] set down the glass…" / "[Name] rose from the chair…". Anchor opening in "the seaside hotel". The opening style above governs only your FIRST SENTENCE; the grounding below may land anywhere in the first 2 paragraphs (it need not be sentence one, and never conflicts with the chosen opening style). HARD REQUIREMENT for the first 2 paragraphs: (a) include 2+ sensory words — choose from smell/scent/odor/fragrance/sound/echo/silence/whisper/creak/cold/warm/damp/rough/smooth/glow/shadow/flicker/dim — and (b) include 1+ atmosphere/time word — choose from rain/wind/fog/storm/mist/thunder/evening/morning/night/dawn/dusk/lighting/weather/season/afternoon/midday/noon/midnight/twilight/sunrise/sunset/daylight/sunlight/overcast/cloudy/bright/dark/grey/pale/chill/crisp/drizzle/haze/lamplight/firelight. These are validated requirements, not style suggestions; missing them triggers a retry.

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

PROMPT BUDGET SUMMARY: budget=24000 tokens; fixed=7621; context=11943; dropped=[none]; truncated=[first_appearance_contracts, location_profiles, temporal_context, pronoun_accuracy]

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
4. Integrate at least two concrete era-grounded details per chapter from setting refinement signals: radio broadcasting | early television sets | military radar equipment | manual typewriters | long-distance telephone calls | military-style encrypted messages.
5. Respect setting movement/access constraints in scene action and alibis: narrow hallways limiting movement | oceanfront location affecting evacuation routes | balconies overlooking the sea providing limited escape options | restricted access to staff-only areas | guest room privacy regulations.
6. Sustain social coherence with this backdrop pressure: A gathering at a seaside hotel for a post-war reunion forces a diverse group of guests and staff to confront their shared traumas while navigating the complexities of class and gender dynamics in a changing world.
7. Maintain continuity around these socially central cast anchors where relevant: Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill, Sylvia Trent, Hugo Vane.
8. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Critical: Plot similarity 0.75 with 'The Second Key' (same crime method of drowning and similar setting dynamics)
9. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Moderate: Character similarity 0.80 with 'The Second Key' (similar character roles and dynamics)

CRITICAL PROSE REQUIREMENTS:

The CML specifies exact requirements for certain validation-critical scenes. You MUST include these elements at the specified positions.

**Discriminating Test Scene (Act 3, Scene 4):**
Required elements: Execute the discriminating test, Observe the culprit's reaction or result, Draw conclusion about guilt

**Suspect Clearance Scenes:**
- Beatrice Quill (Act 3, Scene 5): Witness testimony confirms she was in the dining room during the time of the murder.
  Clues: clue_id_1, clue_id_2
- Sylvia Trent (Act 3, Scene 5): Evidence shows she was working in another area of the hotel at the time.
  Clues: clue_id_3, clue_id_4
- Hugo Vane (Act 3, Scene 5): Confirmed alibi from other guests that he was not by the tide at the time.
  Clues: clue_id_5, clue_id_6

**Culprit Revelation Scene (Act 3, Scene 6):**
Method: Confrontation with evidence

**Clue Placement for These Chapters:**
- clue_mechanism_visibility_core must appear in Act 1, Scene 1 via Witness statement

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
Suspect pressure target(s): Captain Ivor Hale, Beatrice Quill, Hugo Vane, Sylvia Trent
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
- STYLE HARD-BAN: NEVER use these phrase families: "clock tower at quarter past three", "near the clock tower at quarter past", "showed quarter past three when the body", "in the formal gardens during the murder". Any occurrence triggers rejection/retry.
- STYLE SOFT-BAN: avoid these stock phrases and rewrite them if they appear in draft text: "lips pressed into a thin line", "the household runs smoothly when every cog", "the pressures upon this household are many", "the doctor [Surname] (use Dr. Surname or 'the doctor', never role + bare surname)", "the captain [Surname] (use Captain Surname or 'the captain', never role + bare surname)", "the inspector [Surname] (use Inspector Surname or 'the inspector', never role + bare surname)", "the sergeant [Surname] (use Sergeant Surname or 'the sergeant', never role + bare surname)", "the constable [Surname] (use Constable Surname or 'the constable', never role + bare surname)", "the gentleman [Surname] (use Mr. Surname or 'the gentleman', never role + bare surname)".
- STYLE WATCHLIST: keep these patterns varied and scene-specific: "quarter past three", "three fifteen", "the old bell striking three fifteen", "the chimes echoed just after three-fifteen".
- Chapter 1:
  - STRUCTURAL ARCHETYPE — Chapter 1 must be: DISCOVERY
      ✓ MUST contain: body found / victim identified
      ✗ MUST NOT contain: formal accusation or interrogation
  - Word count: Target 1250 words. Achieve this through plot events, dialogue exchanges, and physical investigation — not through atmospheric repetition or extended internal reflection. Each 200-word segment should contain at minimum one concrete story event (a discovery, a conversation exchange, a physical action or movement). Padding with atmosphere alone is not acceptable.
  - VICTIM IDENTITY LOCK (MANDATORY): name the victim as "Dr. Mallory Finch" in the discovery scene. After first mention, do not use unnamed placeholders such as "the victim" without naming Dr. Mallory Finch in the same paragraph.
  - Opening: Begin with a character action, spoken line, or clock/time marker — never a location name or location-description phrase.
  - Scene is set in: the seaside hotel — reference it naturally within the paragraph, never as your opening phrase.
  - Opening atmosphere (MANDATORY — validator enforced): the first paragraph MUST contain at least one of: rain / wind / fog / storm / mist / thunder / evening / morning / night / dawn / dusk / season / afternoon / midday / noon / midnight / twilight / sunrise / sunset / daylight / sunlight / overcast / cloudy / bright / dark / grey / pale / cold / warm / chill / crisp / damp / drizzle / haze / lamplight / firelight. A chapter that omits all of these from its opening paragraph will be rejected.
  - PARAGRAPH OPENER DIVERSITY (MANDATORY — validator enforced): No more than 2 paragraphs in this chapter may begin with "Eleanor" or "Eleanor's" as the first word. You must vary paragraph openings throughout: use sensory observations, another character's name or action, dialogue, object or sound details, or temporal markers. Opening 3 or more paragraphs with "Eleanor" will cause automated rejection.
  - INVESTIGATOR ESTABLISHMENT REQUIRED: Eleanor Voss must claim or be recognised as the investigator in this chapter. Establish Eleanor Voss as the detective-in-charge within the first two paragraphs — Eleanor Voss IS the investigator. Do NOT have any character suggest a "real" detective is still coming, or imply that authority has not yet been delegated. Eleanor Voss begins the investigation in this chapter.
  - ⛔ BODY DISCOVERY ORDER (MANDATORY — Chapter 1 only): the victim's body must be physically encountered or described within the first TWO paragraphs. Do NOT spend the opening paragraphs solely on clock examination, atmospheric setup, or character introductions before the body is found. Required Chapter 1 structure: atmosphere (one sentence max) → body/discovery → investigator reaction → suspects → first time-source contradiction.
  - ⛔ MECHANISM SPOILER BAN: Do NOT state how the crime device was manipulated — not the direction, not the magnitude, not who performed it. Characters may only observe that two sources of evidence disagree. The specific method, tamper amount, and perpetrator's action are ALL FORBIDDEN until the reveal. WRONG: "The culprit had altered the device by forty minutes to create a false alibi." RIGHT: "Two independent pieces of evidence gave contradictory readings — a discrepancy neither could yet explain."
  - CLUE OBLIGATIONS — each clue below MUST be dramatized, but in YOUR OWN WORDS:
    Render each as something a character SEES, DOES, or SAYS on the page. The bracketed text is a
    DESCRIPTION of the evidence for you — do NOT transcribe it as narration. Copying a clue's
    description sentence verbatim into the prose FAILS validation.
    • tide, schedule, shows, high, half, past, eleven [clue_mechanism_visibility_core] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      ⛔ SPOILER EMBARGO (pre-reveal chapter): surface ONLY the surface anomaly a character can see/hear/find.
         Do NOT name who it implicates, state the tamper direction or magnitude, or explain the mechanism in this chapter.
         Present it as an unexplained discrepancy; the culprit and method are revealed later.
         Place this OBSERVATION in paragraph 1 or 2 (observation only — no inference about the culprit).
  - Tonal contrast: include at least one beat of relief or ironic counterpoint. Do not sustain maximum tension for every paragraph.
  - CLUE DISCLOSURE RULE (Stage 1/4):
    Characters may OBSERVE anomalies (wrong time, missing object, odd detail) but must NOT explain the mechanism, deduce the method, or name the culprit. Discovery and reaction only.
    WRONG: dialogue or narration that directly explains how the crime was committed before Stage 4.
    RIGHT: observation, physical reaction, and logical inference that leaves the mechanism just off-screen.
  - ALIBI LOCK: Captain Ivor Hale's established alibi is "From ten to eleven". Do NOT place Captain Ivor Hale at any other location or in any other activity during the crime window. Any contradiction is a continuity error that triggers a retry.
- Locked fact phrase obligations:
  - If this batch mentions The time of high tide on the night of the murder., write exactly: "half past eleven".
  - If this batch mentions The time at which the victim's watch stopped., write exactly: "twenty minutes past eleven".
  - If this batch mentions The last time the victim was seen alive by witnesses., write exactly: "a quarter to eleven".
- Seasonal vocabulary allow-list: autumn, autumnal, fall.
- Forbidden seasonal words: spring, summer, winter.

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
Suspect pressure target(s): Captain Ivor Hale, Beatrice Quill, Hugo Vane, Sylvia Trent
Required new information: First clue observation tied to suspect landscape.
Forbidden reveals at this stage: No culprit reveal. | No full murder mechanism explanation. | Do not state the direction, magnitude, or agent of any clock or device tampering. Characters may only observe that two time sources disagree. "The clock was wound back by forty minutes" must not appear before Chapter 3.

FROZEN FACT STATE (DO NOT ALTER):
- Timeline anchor: September (autumn).
- Month, season, weather, and time-of-year language in this batch must stay compatible with autumn.
- Established timeline fact: Last sighting of Dr. Finch
- Established timeline fact: High tide schedule
- If referenced, use exact phrase: "half past eleven" (The time of high tide on the night of the murder.).
- If referenced, use exact phrase: "twenty minutes past eleven" (The time at which the victim's watch stopped.).
- If referenced, use exact phrase: "a quarter to eleven" (The last time the victim was seen alive by witnesses.).

STORY TO DATE (REFERENCE ONLY — DO NOT COPY VERBATIM):
- No previous chapter text exists yet for this batch.

[SCENE COMPLETENESS CONTRACTS — MANDATORY. Each contract below lists what you MUST enact in that chapter. Do not summarise or mention these labels in the prose — enact them organically.]
Chapter 1 (Act 1) completeness contract:
  PIVOT ELEMENT (MANDATORY — write this into the prose, shown not told): "The body of Dr. Mallory Finch washed ashore, face down in the surf."
  FACT ESTABLISHED (MANDATORY — reader must know this by chapter end): "Establishes the victim died no later than eleven past eleven, contradicting three suspects' alibis."

# Case Overview
Title: The Tidal Trap
Era: 1940s
Setting: Seaside Hotel
Crime: murder (drowning)
Culprit: Captain Ivor Hale
Victim: Dr. Mallory Finch
False assumption: Dr. Mallory Finch drowned at the time indicated by the hotel clock.
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
    "sceneNumber": 1,
    "act": 1,
    "title": "Discovery",
    "setting": {
      "location": "the seaside hotel",
      "timeOfDay": "Morning after the murder",
      "atmosphere": "Tense household awaiting the detective's arrival"
    },
    "characters": [
      "Eleanor Voss",
      "Captain Ivor Hale",
      "Dr. Mallory Finch",
      "Beatrice Quill",
      "Hugo Vane",
      "Sylvia Trent"
    ],
    "purpose": "Introduce the crime and detective",
    "cluesRevealed": [],
    "dramaticElements": {
      "conflict": "Locked room mystery established",
      "tension": "Every suspect had access to the victim",
      "microMomentBeats": [
        "Eleanor stares at the ocean, remembering the last time she saw Dr. Finch."
      ]
    },
    "summary": "The morning sun casts a harsh light as the guests gather in the hotel lobby, anxious about the detective’s arrival. They are soon drawn to the beach where the body of Dr. Mallory Finch is discovered, lifeless and cold. The shock ripples through the group as they realize the implications of the tragedy.",
    "beat": "gathering",
    "estimatedWordCount": 1250,
    "pivotElement": "The body of Dr. Mallory Finch washed ashore, face down in the surf.",
    "factEstablished": "Establishes the victim died no later than eleven past eleven, contradicting three suspects' alibis.",
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
    "emotionalRegister": "The weight of the initial crime creates an atmosphere of dread and uncertainty.",
    "dominantCharacterNote": {
      "name": "Eleanor Voss",
      "voiceRegister": "Eleanor's voice is inquisitive and warm, often laced with a hint of dry humor that reflects her observational nature."
    },
    "humourGuidance": {
      "permission": "forbidden"
    },
    "eraTextureNote": "Rationing still affects daily life, limiting access to goods.; Travel is constrained by fuel shortages and high costs.; Communication is limited, with many relying on handwritten letters or the radio.; Public spaces are subject to social etiquette, restricting open discourse.; Curfews may still linger in certain areas due to post-war anxieties.",
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
□ Allowed seasonal words only: autumn, autumnal, fall.
□ Forbidden seasonal words: spring, summer, winter.
□ Chapter 1: the clue [clue_mechanism_visibility_core] (mechanism, relies, schedule, eleven, drown, expose, false, timing) is placed in the first 25% of the chapter, dramatized in your own words, followed by an explicit inference or suspicion paragraph.
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
