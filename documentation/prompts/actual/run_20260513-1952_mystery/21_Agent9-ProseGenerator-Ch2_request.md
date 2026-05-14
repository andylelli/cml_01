# Actual Prompt Record

- Run ID: `mystery-1778701952036`
- Project ID: ``
- Timestamp: `2026-05-13T19:58:37.750Z`
- Agent: `Agent9-ProseGenerator-Ch2`
- Operation: `chat_request_full_prompt`
- Model: `GPT-4o-mini`
- Temperature: `0.42`
- Max Tokens: `4500`
- Attempt: `first`
- Prompt Hash: `08f6a0d7efc94987`

## Message 1 (role=system)

```text
You are an expert prose writer for classic mystery fiction. Your role is to write compelling, atmospheric narrative chapters that read like a professionally published novel.

⛔ ABSOLUTE RULE — CHARACTER NAMES:
The ONLY characters who exist in this story are: Eleanor Voss (woman), Dr. Mallory Finch (man), Captain Ivor Hale (man), Beatrice Quill (woman).
Do NOT invent, borrow, or introduce ANY character not on that list — no constables, no solicitors, no butlers, no servants, no shopkeepers, no bystanders with names.
Unnamed walk-ons ("a footman", "the postmistress", "an officer") are allowed ONLY if they never receive a name or title+surname combination.
⚠️ BEFORE YOU WRITE each chapter, ask yourself: "Does every person I name appear in this list: Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill?" If not, remove them.
Any invented named character will fail validation and abort the entire generation.
⚠️ BEFORE YOU WRITE each chapter, also ask yourself: "Am I using the correct pronouns for every character — she/her for women, he/him for men, they/them for non-binary characters?" If not, correct it before writing a single word.
⛔ GENDER IS NON-NEGOTIABLE: The gender of every character is shown above. Use the correct pronouns at all times — a woman is always she/her, a man is always he/him, a non-binary character is always they/them/their. Never swap, default, or guess.

Rules:
- Do not introduce new facts beyond the CML and outline.
- Preserve all clues, alibis, and the core mystery logic.
- Maintain strict setting fidelity to the specified location and era.
- Write immersive, sensory-rich prose that transports readers to the setting
- Include scene-setting passages that establish atmosphere, time, and place
- Use varied sentence structure and sophisticated vocabulary
- Show character emotions through actions and dialogue, not just telling
- Create distinct character voices and personalities based on their profiles
- Avoid stereotypes and reduce bias.
- Keep language original; do not copy copyrighted text.
- Output valid JSON only.
- DISAPPEARANCE-TO-MURDER BRIDGE: If the story opens with a disappearance, you MUST include an explicit bridge scene that transitions it to a confirmed murder (body discovered, death confirmed, investigation reclassified). Never jump from missing person to murder investigation without this bridge.
- ANTI-REPETITION: Do not repeat the same atmospheric or descriptive phrases across adjacent chapters. Vary imagery, metaphors, and sentence openings. If a sensory phrase (e.g., "air thick with tension", "smell of polished wood") has appeared in any prior chapter, rephrase it entirely. No atmospheric sentence should appear verbatim or near-verbatim in more than one chapter.
- TEMPLATE LEAKAGE BAN: Never emit scaffold prose like "At The [Location] ... the smell of ... atmosphere ripe for revelation". Rewrite any scaffold-like sentence into chapter-specific prose tied to character action.
- TEMPORAL CONSISTENCY: If a month is mentioned (for example, May), season wording in the same timeline must be compatible with that month.
- DENOUEMENT REQUIREMENT: The final chapter of any act or the story must show concrete consequences, not just reflection. At minimum: state what happened to the culprit (arrest, flight, confession), show how relationships changed between surviving characters, and give the detective one moment of personal resolution (relief, regret, or changed understanding). Emotional aftermath is required.
- MORAL COMPLEXITY REQUIREMENT: The mechanism of this crime carries a moral gray area: "The murderer acted out of desperation to protect a loved one from the victim's abusive tendencies." — the culprit reveal and denouement MUST acknowledge this ambiguity. Do not let the ending feel clean or simple. Give the reader at least one moment of uncomfortable sympathy or moral doubt.


⚠️ AMATEUR DETECTIVE STORY: The investigator is a civilian with no official standing. The official police (if they appear) are unnamed background figures only — "a constable", "the sergeant", "an officer from the village". Do NOT give any police official a name or title+surname combination. There is no Inspector [Surname], no Constable [Surname], no Sergeant [Surname] in this story.

PRONOUN ACCURACY — MANDATORY CONTINUITY CONTRACT

The following pronouns are locked facts, on the same level as character names
and hard-logic device values. Using the wrong pronoun is a continuity error,
not a style choice.

Canonical pronoun table (subject / object / possessive / reflexive):
  • Eleanor Voss: she/her/her/herself
  • Dr. Mallory Finch: he/him/his/himself
  • Captain Ivor Hale: he/him/his/himself
  • Beatrice Quill: she/her/her/herself

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
   "Graham Worsley excused herself" is a pronoun error regardless of sentence position.
6. In dialogue attribution ("he said", "she replied"), the attribution pronoun must
   agree with the SPEAKER's gender — not the last character named inside the quoted speech.
7. In nested or cleft clauses ("It was she who had…", "It was he that…"), pronoun
   gender must still match the referent character's canonical set in the table.
8. Singular "they/them/their" for a specific named non-binary character carries the same
   mandatory status as gendered pronouns. It is not a plural — treat it as grammatically
   identical to he/him/his or she/her/her for the purposes of agreement.


CRITICAL CHARACTER CONSISTENCY RULES:

1. Each character has ONE canonical name. Use ONLY names from this list. Never vary, abbreviate, or add titles beyond what is listed.
   COMPLETE CAST (no other named characters exist): Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill
   - "Mr. Jennings entered the room" → ILLEGAL. Jennings is not in the cast.
   - "Constable Reed took notes" → ILLEGAL. Reed is not in the cast.
   - "A constable took notes" → LEGAL (no name given).

2. Character roles are fixed:
   - Eleanor Voss: character
   - Dr. Mallory Finch: character
   - Captain Ivor Hale: character
   - Beatrice Quill: character
   - Never place characters in locations inconsistent with their role

WORLD DOCUMENT (use this as your primary creative context):

## Era: 1932-01
In January 1932, the world is grappling with the harsh realities of the Great Depression, where the divide between the affluent and the struggling working class is starkly evident. The overcast skies of England reflect the collective anxiety felt by many, as unemployment rates soar and social unrest simmers just beneath the surface. Daily life is fraught with tension, as families attempt to maintain appearances while facing increasing hardship. The rich host lavish parties in their grand estates, oblivious to the struggles of those outside their gates. Meanwhile, the working class is bound by the weight of economic despair and the rising tide of social movements, leading to a volatile atmosphere where class struggles are increasingly pronounced. The tension between these two worlds creates an environment ripe for conflict and drama, as personal ambitions collide with societal expectations.
Emotional register: A pervasive sense of anxiety and tension permeates society, as individuals grapple with the uncertainty of their futures.
Physical constraints: short daylight hours, leading to long, dark evenings | overcast weather limiting outdoor activities | the challenge of travel due to economic strain, affecting social gatherings
Current tensions (weave into background texture): unemployment rates remain high as the Great Depression persists | discontent grows among the working class leading to strikes | the rise of fascist parties in Europe causes concern and debate in British society
Wartime context — Many veterans struggle to reintegrate into society, facing economic hardships.: The camaraderie forged in war contrasts sharply with the isolation felt in peacetime. Absence effect: The absence of loved ones lost in conflict adds layers of grief to the existing societal despair.

## Story Theme
The story explores the intricate interplay between societal expectations and personal ambition, revealing how desperation can drive individuals to commit unspeakable acts, and reveals that evidence carries ethical weight, forcing characters to choose accountability over social performance when appearances and facts collide.

## Story Emotional Register
Dominant: The emotional journey unfolds from tension to revelation, steeped in anxiety and despair.

Arc:
The story opens in the opulent yet oppressive atmosphere of Little Middleton Manor, where the sound of the clock ticking fills the air, creating an unsettling backdrop to the tragedy that unfolds. The discovery of Eleanor Voss's lifeless body in the library sends ripples of shock through the household, as her family and friends grapple with the weight of their grief and the implications of her untimely death. As the investigation begins, a sense of rising unease permeates the estate, with each character harboring their own secrets and motives. The emotional cost of the investigation becomes evident as suspicion mounts, and the tension between the wealthy guests and the struggling working class creates an undercurrent of anxiety.

A pivotal moment occurs when the detective, Beatrice Quill, uncovers the first clues pointing to the tampered clock, shifting the focus of the investigation. This revelation forces the characters to confront their relationships with Eleanor and each other, as they navigate the murky waters of loyalty and betrayal. As the story progresses, further revelations recolor earlier events, particularly as Dr. Mallory Finch’s financial desperation comes to light, exposing the lengths to which he would go to maintain his status. The mounting pressure culminates in a dramatic confrontation, where truths are laid bare, and the emotional stakes reach their peak.

In the resolution, the characters are left grappling with the aftermath of their choices. The cost of the truth weighs heavily on Ivor, Eleanor's former lover, as he realizes the personal sacrifices he must make to redeem himself. Beatrice, too, faces the burden of her ambition, questioning the ethics of her pursuit of the Voss family's secrets. The ending carries a somber note, as the characters are forced to reckon with the consequences of their actions, leaving them forever changed in the wake of the tragedy.

## Emotional register at this point in the story
An oppressive atmosphere cloaks the manor, thick with anticipation of the impending tragedy.

## Character Portraits (appearance & era)

### Eleanor Voss
Eleanor Voss represents the struggle of the upper class to maintain their status amidst the Great Depression. As a wealthy estate owner, she clings to her social standing while grappling with deep-seated resentment towards her family's controlling nature and her brother's rising influence. The economic turmoil magnifies her fears of losing her inheritance, pushing her to confront her family's expectations and her own aspirations.
Era intersection: Eleanor's private conflict with her family mirrors the broader societal tensions of the time, where class divisions become more pronounced amid economic hardship.

### Captain Ivor Hale
Captain Ivor Hale's character highlights the lingering effects of war on society, as he battles with his past failures while trying to reclaim his honor. The societal expectations for men of his standing to exhibit strength and dignity weigh heavily on him, creating an internal conflict that mirrors the broader issues of masculinity and redemption during a time of social upheaval. His struggles to regain respect in a society that has little patience for failure add depth to his character.
Era intersection: Ivor's quest for redemption parallels the societal pressure on veterans to demonstrate resilience, reflecting the tension between personal history and societal expectations.

### Beatrice Quill
Beatrice Quill's ambition as an up-and-coming journalist contrasts sharply with the prevailing class dynamics of the time. Her desire to expose the Voss family's secrets stems from a yearning for recognition, but her hidden connection to them complicates her ethical stance. As societal norms shift, Beatrice's character embodies the struggle for women to carve out their own identities in a male-dominated landscape, revealing the challenges faced by those who dare to defy expectations.
Era intersection: Beatrice's ambition and hidden lineage highlight the shifting attitudes towards class and gender, echoing the broader movements for social equality during the 1930s.

## Character Voices

### Eleanor Voss (she/her/her)
Eleanor speaks with a refined cadence, often punctuating her sentences with a slight tilt of her head, as if inviting her audience to share in her thoughts.
[comfortable] It's lovely to see you all here, truly. I do hope you're enjoying the evening.
[evasive] Oh, I wouldn't want to burden anyone with my petty concerns.
[stressed] I can't shake the feeling that everything I hold dear is slipping away from me.
Humour: Eleanor's humour often surfaces through subtle irony, particularly when discussing family matters.

### Captain Ivor Hale (he/him/his)
Ivor speaks with gravitas, often reflecting on his past with a self-deprecating humor that softens the weight of his words.
[comfortable] Ah, the tales we tell; sometimes they feel more like fables than facts.
[evasive] Let's not dwell on old ghosts; we have more pressing matters to discuss.
[stressed] Every decision I made still haunts me; I just want to make things right.
Humour: Ivor often employs self-deprecating humor to cope with his past mistakes.

### Beatrice Quill (she/her/her)
Beatrice speaks with an energetic cadence, her dialogue peppered with sarcasm and clever quips.
[comfortable] Isn't it fascinating how the elite think they can hide their secrets forever?
[evasive] I wouldn't want to pry into family matters; that would be scandalous, wouldn't it?
[stressed] Every revelation feels like a double-edged sword; I just hope it doesn't cut too deep.
Humour: Her sardonic wit adds a layer of complexity to her character, making her observations sharp and insightful.

## Location Registers (scene framing guides)

The Library: The library is a space steeped in knowledge, yet now it feels suffocating with the weight of betrayal and fear. Shadows stretch across the shelves, and the atmosphere is thick with tension as secrets lie hidden within its walls. The flickering candlelight creates a sense of unease, as if the room itself is alive with whispers of the past. Each creak of the floorboards echoes the uncertainty that permeates the air, transforming this once-sacred space into a haunting reminder of the tragedy that has unfolded.. Camera angle: Writers should enter this space with a sense of foreboding, as if they are stepping into a trap designed to ensnare the unwary.. Era: In the 1930s, libraries were places of refuge, yet the growing societal unrest casts a shadow over their sanctity.

The Drawing Room: The drawing room, once vibrant with laughter, now stands as a battleground of unspoken tensions and hidden truths. The opulent decor feels stifling, with each ornate detail amplifying the underlying anxiety among the guests. The air is heavy with the scent of tea and whispered conversations, yet the forced cheerfulness masks a palpable sense of dread. It is here that the facade of social grace begins to crack, revealing the darker motivations lurking beneath the surface.. Camera angle: Writers should approach this space with a sense of tension, capturing the fragile balance between appearance and reality.. Era: During the 1930s, drawing rooms were the heart of social interaction, where appearances were paramount and secrets were carefully guarded.

The Servants' Hall: The Servants' Hall is a space of warmth and camaraderie, providing a stark contrast to the opulence of the manor above. Here, the laughter and chatter of the staff create a sense of community amidst the growing tension in the household. The aroma of hearty meals mingles with the scent of coal smoke, offering comfort against the backdrop of unease. Yet, whispers of suspicion travel through these walls, as the staff navigate their loyalties and the secrets they must keep.. Camera angle: Writers should enter this space with an eye for the contrast between the warmth of community and the chill of underlying tension.. Era: In the 1930s, servants' halls were essential spaces for staff, fostering a sense of belonging while reflecting the class divide.

## Humour guidance for this story position (opening)
Permission: forbidden
Rationale: The serious tone of the opening scene sets the stage for the ensuing tragedy.

FAIR-PLAY AND INFERENCE CONTRACT (from CML logic):
- False assumption in force: The time of death can be accurately determined from the clock's time.
- Hidden truth to progressively expose: The clock has been tampered with to mislead the investigation.
- Inference path checkpoints to dramatize clearly (observation -> correction -> effect):
  - Step 1: obs: The clock's minute hand is slightly askew. | corr: This indicates tampering, suggesting the time displayed is not accurate. | effect: Narrows investigation focus to individuals with access to the clock.
  - Step 2: obs: Dust accumulation around the clock shows it hasn't been touched in days. | corr: This implies that the clock was tampered with shortly before Eleanor's death. | effect: Eliminates the notion that the clock was adjusted by someone unaware of its significance.
  - Step 3: obs: Scratches on the clock face suggest frequent adjustments. | corr: These scratches indicate deliberate tampering was performed to mislead. | effect: Narrows suspicion towards those who had the opportunity to access the clock.
- Discriminating test method: trap
- Discriminating test design constraint: The discriminating test compares clock, minute, and slightly against the claimed timeline.
- Test must rely on already-shown clue IDs: clue_1, clue_2, clue_3, clue_9, clue_fp_contradiction_step_1, clue_culprit_direct_dr_mallory_finch
- Fair-play rationale: Step 1: The clock's askew minute hand and its dust accumulation indicate previous tampering. Step 2: Scratches reveal a deliberate adjustment, isolating Dr. Finch as the one with knowledge of the clock mechanisms. Step 3: The trap confirms Dr. Finch's ability to tamper with the clock, leading to his guilt.
- Never solve by withheld information. Keep reader-information parity with detective reasoning.

## Character Reference

### Eleanor Voss
Eleanor speaks with a refined cadence, often punctuating her sentences with a slight tilt of her head, as if inviting her audience to share in her thoughts
Her laughter is soft, almost musical, but carries a hint of irony when discussing her family's affairs.
Eleanor grapples with a profound sense of inadequacy and resentment, torn between her desire for independence and the suffocating expectations of her family's legacy.

### Captain Ivor Hale
Ivor speaks with a gravitas befitting his naval background, often punctuating his sentences with a dry chuckle that belies the weight of his words
He has a tendency to reflect on his past with a wry sense of humor, turning his failures into anecdotes that draw sympathy.
Ivor is tormented by guilt over his past mistakes, battling the urge to seek revenge against those he believes wronged him while simultaneously yearning for redemption.

### Beatrice Quill
Beatrice speaks with an energetic cadence, often punctuating her remarks with a quick laugh or a sharp retort
Her dialogue is peppered with sarcasm, and she has a knack for turning mundane observations into clever quips.
Beatrice wrestles with the ethics of her ambition, torn between her desire for success and the potential betrayal of her own family.


## CHARACTER CONTRACTS (binding for this scene)
Each entry below constrains how this character must be written in this chapter.
These override generic style guidance when they conflict.

### Eleanor Voss
Voice & mannerisms: Eleanor speaks with a refined cadence, often punctuating her sentences with a slight tilt of her head, as if inviting her audience to share in her thoughts. Her laughter is soft, almost musical, but carries a hint of irony when discussing her family's affairs.
Sample voice fragments (match this register and rhythm):
  [comfortable] "It's lovely to see you all here, truly. I do hope you're enjoying the evening."
  [evasive] "Oh, I wouldn't want to burden anyone with my petty concerns."
Humour: understatement — deploy occasionally (level 0.5)
FORBIDDEN phrase (never write for Eleanor Voss): "the situation was extremely serious"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "The fear of losing her father's estate to her brother, whose influence grows daily, gnaws at Eleanor, pushing her to consider desperate measures to safeguard her social standing and inheritance." — do not surface in Act I.

### Captain Ivor Hale
Voice & mannerisms: Ivor speaks with a gravitas befitting his naval background, often punctuating his sentences with a dry chuckle that belies the weight of his words. He has a tendency to reflect on his past with a wry sense of humor, turning his failures into anecdotes that draw sympathy.
Sample voice fragments (match this register and rhythm):
  [comfortable] "Ah, the tales we tell; sometimes they feel more like fables than facts."
  [evasive] "Let's not dwell on old ghosts; we have more pressing matters to discuss."
Humour: self deprecating — deploy occasionally (level 0.6)
FORBIDDEN phrase (never write for Captain Ivor Hale): "she knew with certainty she was right"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Convinced that revealing the victim's secrets could shift blame away from himself, Ivor believes it may restore his tarnished reputation and help him reclaim his lost honor." — do not surface in Act I.

### Beatrice Quill
Voice & mannerisms: Beatrice speaks with an energetic cadence, often punctuating her remarks with a quick laugh or a sharp retort. Her dialogue is peppered with sarcasm, and she has a knack for turning mundane observations into clever quips.
Sample voice fragments (match this register and rhythm):
  [comfortable] "Isn't it fascinating how the elite think they can hide their secrets forever?"
  [evasive] "I wouldn't want to pry into family matters; that would be scandalous, wouldn't it?"
Humour: sardonic — deploy frequently (level 0.7)
FORBIDDEN phrase (never write for Beatrice Quill): "palpable tension filled the room"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Her ambition drives her to expose the Voss family's secrets, believing that a sensational article could elevate her career and provide the recognition she craves." — do not surface in Act I.



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
ERA AUTHENTICITY (1930s):

1. FORBIDDEN terms (did not exist):
   ❌ Modern technology

2. REQUIRED period markers (include 2+ per scene):
   ✓ Formal address: Mr./Mrs./Miss/Dr./Sir/Lady
   ✓ Period technology: period-appropriate items
   ✓ Fashion: period clothing

3. Use period-authentic language and social norms

LOCATION PROFILES:

You have rich location profiles to draw from. Use them to create vivid, atmospheric scenes.

Primary Location: Little Middleton Manor (Little Middleton, England)
Little Middleton Manor is a sprawling estate emblematic of pre-war opulence, with its grand architecture and sprawling gardens, concealing secrets amid its lavish interiors.

Key Locations Available:
- The Library (interior): Crime scene
- The Drawing Room (interior): Gathering space
- The Servants' Hall (interior): Gathering space for staff

Atmosphere: Tense, with underlying anxiety due to recent societal unrest and class struggles.
Weather: Overcast with occasional rain, typical for the English countryside in autumn.

Era markers: Petrol touring cars parked in the gravel drive, their polished surfaces glistening under the rain. | Typewriters clattering in the study, echoing the urgency of messages being prepared for delivery. | Early telephones ringing sporadically, their sharp tones cutting through the heavy atmosphere.

USAGE GUIDELINES:
1. First mention of location: Ground the scene using sensory details drawn from the profiles — paraphrase these into what the POV character directly observes and experiences, not a summary of the room's general qualities
2. Geographic grounding: Reference the specific place (Little Middleton, England) naturally in dialogue or narrative
3. Action scenes: Integrate physical layout details (access, sightlines, constraints)
4. Atmospheric scenes: Reference weather, lighting, sounds from sensory palette
5. Era details: Weave in period markers naturally
6. Consistency: Keep all location descriptions aligned with profiles
7. Each chapter opening must anchor to a named location from this list
8. Include at least 2 sensory cues + 1 atmosphere marker in each chapter opening
9. Do NOT use generic repeated manor/storm filler without profile-specific details

SENSORY PALETTE (use 2-3 senses per scene):
The Library (interior):
  - Visual: The flickering light of a single brass lamp casts dancing shadows among the stacks of books, creating an atmosphere of secrecy and intrigue., Dust motes swirl in the air, illuminated by the dim glow, while the heavy drapes, pulled shut, obscure any view of the outside world.
  - Sounds: The soft crackle of the fire provides a comforting backdrop, yet it is juxtaposed with the creaking of the old house as it settles around the library., Occasional soft thuds echo as books shift on their shelves, as if the very volumes hold their breath in anticipation.
  - Scents: The rich scent of aged paper and leather fills the air, mingling with the faint, stale odor of smoke that lingers from the fireplace., A hint of dampness seeps in from the garden, a reminder of the rain outside, adding a chill to the otherwise warm atmosphere.
  - Touch: The smooth, cool surface of the mahogany desk contrasts with the plush texture of the rug beneath, inviting one to linger longer in this refuge of knowledge., The chill of the stone fireplace can be felt nearby, a stark contrast to the warmth radiating from the fire, creating pockets of temperature that evoke a sense of unease.

The Drawing Room (interior):
  - Visual: The ornate chandelier hangs from the ceiling, its crystals glinting like stars against the dark wood paneling that envelops the room., The large bay windows frame a view of the gardens, their colors muted by the overcast sky, casting a melancholic hue over the room.
  - Sounds: The soft rustling of fabric as guests shift in their seats creates a comforting ambiance, yet it is undercut by the distant sound of thunder rumbling outside., Occasional laughter and conversation bubble up, but they are tinged with an air of forced cheerfulness, masking the tension that lingers beneath.
  - Scents: The rich aroma of freshly brewed tea wafts through the air, mingling with the scent of polished wood and the faintest hint of lavender from the potpourri., A subtle trace of smoke from th
[truncated for prompt budget]

## Texture Pool
Draw on these as opportunities arise — you are not required to use them.

- In January 1932, the world is grappling with the harsh realities of the Great Depression, where the divide between the affluent and the struggling working class is starkly evident
- The overcast skies of England reflect the collective anxiety felt by many, as unemployment rates soar and social unrest simmers just beneath the surface
- Daily life is fraught with tension, as families attempt to maintain appearances while facing increasing hardship
- The rich host lavish parties in their grand estates, oblivious to the struggles of those outside their gates
- Meanwhile, the working class is bound by the weight of economic despair and the rising tide of social movements, leading to a volatile atmosphere where class struggles are increasingly pronounced

TEMPORAL CONTEXT:

This story takes place in January 1932 during winter.

Seasonal Atmosphere:
- Weather patterns: overcast skies, occasional rain, chilly winds
- Daylight: Short days with sunset occurring around four o'clock in the afternoon, leading to long, dark nights.
- Seasonal activities: attending winter tea parties, reading by the fireplace, participating in indoor games and puzzles
- Seasonal occasions: New Year's Day (January 1)
- Season: winter

Period Fashion (describe naturally):
- Men formal: tailored three-piece suit, cravat or bow tie, derby hat
- Men casual: woolen pullover, corduroy trousers, tweed jacket
- Men accessories: silver pocket watch, leather gloves, silk handkerchief
- Women formal: tea-length evening gown, beaded cloche hat, long gloves
- Women casual: knitted cardigan, pleated skirt, blouse with a Peter Pan collar
- Women accessories: string of pearls, feathered fascinator, embroidered handbag

Cultural Context (reference naturally):
- Music/entertainment: 'Ain't She Sweet' by Milton Ager, 'My Blue Heaven' by Walter Donaldson, 'The Birth of the Blues' by Ray Henderson; Films: 'The Front Page', 'The Smiling Lieutenant'; Theatre: 'The Royal Family', 'The Front Page'; Radio: BBC news broadcasts, variety shows featuring popular musicians
- Typical prices: Loaf of bread: four pence, Pint of milk: three pence, Cinema ticket: one shilling
- Current events: unemployment rates remain high as the Great Depression persists; discontent grows among the working class leading to strikes
- Literature: 'Murder in the Vicarage' by Agatha Christie | 'The Glass Key' by Dashiell Hammett | 'Tortoise and Hare' by John Steinbeck | [mystery] | [detective fiction] | [social realism]
- Technology: the radio becomes a household staple | advancements in early sound recording technology | the introduction of mass-produced light bulbs | manual typewriters | wind-up gramophones | early telephones
- Daily life: socializing over tea, reading newspapers, attending community gatherings
- Social rituals: afternoon tea served daily, weekly church services, formal dinner parties on Sundays

Atmospheric Details:
The damp air carries the scent of rain-soaked earth, and the distant sounds of thunder rumble as evening falls. Inside the manor house, the flickering candlelight casts long shadows on the richly adorned walls, creating an ambiance thick with unspoken tension. A cold draft whispers through the halls, hinting at secrets long kept, while the occasional crackle of the fireplace offers a false sense of warmth against the chilling winds outside.

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
- Authentic re
[truncated for prompt budget]

NON-NEGOTIABLE CHAPTER OBLIGATIONS — LOCKED EVIDENCE PHRASES (VERBATIM REQUIRED):
The following physical evidence values are absolute ground truth. Every time this chapter describes, mentions, or alludes to the relevant evidence — no matter how briefly — it MUST use the exact phrase shown below, character for character. NO paraphrase, approximation, rounding, or synonym is permitted.

FAILURE EXAMPLE: if the locked value is "at thirteen minutes to midnight" and you write "just before midnight" or "around midnight" — that is a HARD FAIL. You must write "at thirteen minutes to midnight". Equally, if the locked value is written in words, such as "ten minutes past eleven", and you convert it to figure-based clock notation — that is also a HARD FAIL. Words stay as words; figure forms are forbidden for word-phrased facts.

CRITICAL — WORD-PHRASED VALUES: If the canonical value is written out in words (e.g. a time like "ten minutes past eleven", or an amount like "forty minutes"), reproduce those exact words. DO NOT convert to figure-based time notation, twenty-four-hour format, or any other numeric shorthand. Correct: "ten minutes past eleven". WRONG: figure-based clock notation or numeric shorthand.

Locked facts:
  - The exact time shown on the stopped clock face: "ten minutes past eleven"
  - The exact amount the clock was wound back: "forty minutes"
  - The last known time the victim was seen alive: "a quarter past ten"

If a locked fact has no relevance to this chapter, omit it. But the moment you reference the underlying evidence, only the exact phrase above is acceptable.

⛔ CLUES TO SURFACE IN THESE CHAPTERS — mandatory:
The following evidence MUST be clearly observable to an attentive reader. Do not bury it in atmosphere or passing dialogue. Each clue must be concrete, specific, and noticeable:

• [clue_core_contradiction_chain] Dust accumulation around the clock shows it hasn't been touched in days.
  Category: temporal | Criticality: essential | Supports inference step 2
  Points to: This suggests the clock was not recently adjusted.

For each clue above: an attentive reader should be able to find, record, and later use it to reason toward the solution.

═══ NARRATIVE STATE (read-only — do not contradict) ═══

LOCKED FACTS — use verbatim whenever this evidence is described:
  • The exact time shown on the stopped clock face: "ten minutes past eleven"
  • The exact amount the clock was wound back: "forty minutes"
  • The last known time the victim was seen alive: "a quarter past ten"

CHARACTER PRONOUNS — never deviate from these:
  • Eleanor Voss: she/her/her
  • Dr. Mallory Finch: he/him/his
  • Captain Ivor Hale: he/him/his
  • Beatrice Quill: she/her/her

CLUES ALREADY REVEALED TO READER: clue_mechanism_visibility_core — do not reveal these as new information.

CONTINUITY HANDOFF — previous chapter closing beat:
  • "Eleanor wiped a tear from her cheek, her composure wavering. "I just want to understand why this happened. Why someone would want to hurt her. She was so kind, so full of life. It doesn’t make sense." Beatrice nodded, her heart aching for Eleanor. Yet, she als..."
  • The next chapter must open as a continuation of this beat, not as a disconnected reset.
═══════════════════════════════════════════════════════

═══════════════════════════════════════════════════════════
📚 CONTINUITY CONTEXT - CHARACTER & SETTING CONSISTENCY
═══════════════════════════════════════════════════════════

**CRITICAL: You are writing chapters 2+. Maintain consistency with earlier chapters.**

**Character Names Used in Chapters 1-1:**
Eleanor Voss, Beatrice Quill

✓ RULE: Use EXACTLY these names. Do NOT vary spelling, add titles, or introduce new forms.
✓ Example: if earlier chapters used "Clara Whitfield", keep using "Clara Whitfield" — never "Mrs. Whitfield" unless that is the character's canonical name in the list above.

**Setting Vocabulary Established in Earlier Chapters:**
study, manor, estate

✓ RULE: Continue using this location vocabulary. Maintain consistency with established setting type.
✓ Do NOT introduce new location types that contradict earlier chapters.

**Recent Chapter Summary (for narrative continuity):**
Chapter 1: Chapter 1: Discovery
  Events: Beatrice approached the clock, her brow furrowing as she examined the face.

⚠️ **VALIDATION:** Character name mismatches and setting drift are common failure modes.
Double-check every character name against the list above before using it.
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
Known location profile anchors: Little Middleton Manor, The Library, The Drawing Room, The Servants' Hall, Eleanor's study
LOCATION NAME CAPITALISATION (HARD REQUIREMENT — validated):
All named locations in your prose MUST use the EXACT capitalisation from the CML profiles.
Canonical forms: "Little Middleton Manor", "The Library", "The Drawing Room", "The Servants' Hall", "Eleanor's study"
Writing a location in lowercase (e.g. "drawing room" instead of "Drawing Room") is a validated error. Every time you mention a named location, copy its capitalisation from the list above.
- Chapter 2: OPENING STYLE (HARD): Start the VERY FIRST SENTENCE with spoken dialogue — e.g. '"[words]," [Name] said/asked/replied/murmured.' The opening quote must be the first character on the line. Anchor opening in "Eleanor's study". HARD REQUIREMENT for the first 2 paragraphs: (a) include 2+ sensory words — choose from smell/scent/sound/echo/silence/creak/whisper/cold/warm/damp/rough/smooth/glow/shadow/flicker/dim — and (b) include 1+ atmosphere/time word — choose from rain/wind/fog/storm/mist/thunder/evening/morning/night/dawn/dusk/season/afternoon/midday/noon/midnight/twilight/sunrise/sunset/daylight/sunlight/overcast/cloudy/bright/dark. These are validated requirements, not style suggestions; missing them triggers a retry.

[⚠ INTERNAL QUALITY DIAGNOSTICS — DO NOT REPRODUCE ANY PART OF THIS SECTION IN YOUR STORY OUTPUT. These are private generator observations for your consideration only. Your narrative must read as if this section does not exist. Never include phrases from this block in character dialogue, narration, or description.]

PRIOR CHAPTER QUALITY OBSERVATIONS:
- Chapter 1 (score 92/100):
  Quality gaps noted: word density below preferred target (786/1000)
  Address in upcoming chapters: Increase chapter density with concrete investigation action and sensory-grounded beats; avoid recap-only padding.
[END INTERNAL DIAGNOSTICS]

PROMPT BUDGET SUMMARY: budget=32000 tokens; fixed=6520; context=10390; dropped=[none]; truncated=[location_profiles, temporal_context]

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
- Each chapter has 5-8 substantial paragraphs (each 120–180 words) — TARGET ≥ 1250 words — do not stop early.
- Use classic tone and short length guidance.
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

QUALITY GUARDRAILS (MUST SATISFY):
1. FAIR PLAY CLUE TIMING: Never combine clue discovery and detective deduction in the same chapter. If a clue is first revealed to the reader in chapter N, the detective may only analyze, deduce from, or act on that clue in chapter N+1 or later.
2. FAIR PLAY INFORMATION PARITY: The reader must see all clues BEFORE the detective uses them in reasoning. If the detective performs a test or makes a deduction, every piece of evidence supporting that conclusion must have been shown to the reader in earlier chapters.
3. FAIR PLAY REVELATION SPACING: In the discriminating test scene, the detective can ONLY use clues that were revealed to the reader at least 1 full chapter earlier. Never introduce new clues or withheld information during the test.
4. FAIR PLAY CONFRONTATION: During the final confrontation/revelation, the detective cannot surprise the reader with facts. Every piece of evidence cited must have been visible to the reader in prior chapters.
5. Use only canonical cast names from CML. Do not invent titled placeholders like 'Detective Surname', 'Inspector Surname', 'a woman Surname', or 'a man Surname'.
6. Before the final reveal closes, include explicit suspect-elimination coverage: each non-culprit suspect is ruled out with concrete on-page evidence or confirmed alibi.
7. In the reveal sequence, include a complete culprit evidence chain using explicit reasoning connectors (because/therefore/proves).
8. Integrate at least two concrete era-grounded details per chapter from setting refinement signals: petrol touring cars on county roads | typewriters in offices | early telephones in homes | home telephones | telegram services for urgent messages | airmail for long-distance correspondence.
9. Respect setting movement/access constraints in scene action and alibis: multiple access points restricted by locked doors | large grounds allowing for strategic movement and hiding spots | weather conditions affecting outdoor evidence visibility | permission required to enter private areas | daily schedules dictate access to certain rooms.
10. Sustain social coherence with this backdrop pressure: A gathering at the estate for a wealthy family's annual review of their holdings becomes fraught with tension as class struggles and societal unrest loom over the attendees.
11. Maintain continuity around these socially central cast anchors where relevant: Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill.
12. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Critical: Plot similarity 0.80 with 'The Mysterious Affair at Styles' (same temporal aspect and crime method)
13. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Moderate: Character similarity 0.74 with 'The Sign of the Four' (similar cast structure and roles)
14. STORY TO DATE ANTI-COPY RULE: The STORY TO DATE section below is provided for chronological and factual reference ONLY. You MUST NOT copy, lightly rephrase, or structurally echo any sentence or paragraph from prior chapters. Every sentence in this chapter must be original prose unique to this scene. Reusing even a clause from prior chapter text will cause this attempt to fail immediately.

CRITICAL PROSE REQUIREMENTS:

The CML specifies exact requirements for certain validation-critical scenes. You MUST include these elements at the specified positions.

**Discriminating Test Scene (Act 3, Scene 4):**
Required elements: Execute the discriminating test, Observe the culprit's reaction or result, Draw conclusion about guilt

**Suspect Clearance Scenes:**
- Captain Ivor Hale (Act 3, Scene 5): His alibi is confirmed by the house staff, placing him away from the crime scene.
  Clues: clue_id_1, clue_id_2
- Eleanor Voss (Act 3, Scene 5): As the victim, she cannot be a suspect.

**Culprit Revelation Scene (Act 3, Scene 6):**
Method: Confrontation with evidence

**Clue Placement for These Chapters:**
- clue_core_contradiction_chain must appear in Act 1, Scene 2 via Direct observation

**VALIDATION CONSEQUENCE:** If these requirements are not met exactly, story validation will fail and the entire generation will be rejected, costing $5-8 to regenerate. Follow these specifications precisely.


## Asset Self-Report (required)
At the very END of your response, after all prose, add a single line:
<used_assets>era:story:0,era:story:1,era:story:2,era:story:3,era:story:4</used_assets>
Replace the list with only the IDs of texture assets you actually used. If you used none, output <used_assets></used_assets>.
```

## Message 2 (role=user)

```text
Write the full prose following the outline scenes.



CHAPTER OBLIGATION CONTRACT (MUST SATISFY):
- Chapter 2:
  - Word count: Target 1250 words. Achieve this through plot events, dialogue exchanges, and physical investigation — not through atmospheric repetition or extended internal reflection. Each 200-word segment should contain at minimum one concrete story event (a discovery, a conversation exchange, a physical action or movement). Padding with atmosphere alone is not acceptable.
  - Location anchor: Eleanor's study.
  - Opening atmosphere (MANDATORY — validator enforced): the first paragraph MUST contain at least one of: rain / wind / fog / storm / mist / thunder / evening / morning / night / dawn / dusk / season / afternoon / midday / noon / midnight / twilight / sunrise / sunset / daylight / sunlight / overcast / cloudy / bright / dark. A chapter that omits all of these from its opening paragraph will be rejected.
  - Continuity bridge: in the first 120 words, visibly connect from the previous chapter's final beat. Carry forward one unresolved element (object, accusation, emotional pressure, or immediate physical action) from: "Eleanor wiped a tear from her cheek, her composure wavering. "I just want to understand why this happened. Why someone would want to hurt her. She was so kind, so full of life. It doesn’t make sense." Beatrice nodded, he...".
  - CLUE OBLIGATIONS — mandatory prose elements (do NOT omit or bury):
    • Dust accumulation around the clock shows it hasn't been touched in days. [clue_core_contradiction_chain] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: This suggests the clock was not recently adjusted.
      ↳ MANDATORY TWO-PARAGRAPH STRUCTURE (must appear in paragraphs 1 or 2 — no later):
         Paragraph 1: The POV character physically approaches or directly observes this evidence.
           The narration or dialogue explicitly states what is seen (use the exact locked phrase if one applies).
         Paragraph 2 (immediately following): The detective or POV character explicitly reasons
           about what this evidence implies — who it implicates, why it may be unreliable,
           or what inference it supports. This must be a separate full paragraph, not a sentence appended to Paragraph 1.
  - Tonal contrast: include at least one beat of relief or ironic counterpoint. Do not sustain maximum tension for every paragraph.
- Locked fact phrase obligations:
  - If this batch mentions The exact time shown on the stopped clock face, write exactly: "ten minutes past eleven".
  - If this batch mentions The exact amount the clock was wound back, write exactly: "forty minutes".
  - If this batch mentions The last known time the victim was seen alive, write exactly: "a quarter past ten".
- Seasonal vocabulary allow-list: winter, wintry, midwinter.
- Forbidden seasonal words: spring, summer, autumn.

FROZEN TIMELINE STATE (DO NOT ALTER):
- Timeline anchor: January (winter).
- Month, season, weather, and time-of-year language in this batch must stay compatible with winter.
- Established timeline fact: 8:00 PM
- Established timeline fact: 9:00 PM
- If referenced, use exact time phrase: "ten minutes past eleven" (The exact time shown on the stopped clock face).
- If referenced, use exact time phrase: "forty minutes" (The exact amount the clock was wound back).
- If referenced, use exact time phrase: "a quarter past ten" (The last known time the victim was seen alive).

STORY TO DATE (REFERENCE ONLY — DO NOT COPY VERBATIM):
- Full prior chapter text is provided below for continuity, factual consistency, and reference accuracy.
- Use this to keep character voice, chronology, clue state, and location continuity aligned with earlier chapters.
- Do not quote, copy, or paraphrase these paragraphs too closely; write fresh prose that remains consistent with them.

--- BEGIN PRIOR CHAPTER 1 ---
Title: Chapter 1: Discovery
The morning light struggled to penetrate the heavy clouds hanging over Little Middleton Manor, casting a muted glow across the opulent furnishings of Eleanor's study. The air was thick with the scent of damp wood and the faint aroma of lavender, remnants of the previous evening’s gathering. Beatrice Quill stepped into the room, her heart pounding as she took in the scene before her. The clock on the mantelpiece, a grand piece of craftsmanship, stood frozen, its minute hand slightly askew. It was a stark reminder of the tragedy that had unfolded just hours before, the stillness of time echoing the turmoil within the household.

Beatrice approached the clock, her brow furrowing as she examined the face. The exact time shown on the stopped clock face was "ten minutes past eleven". The sight sent a chill down her spine, for it suggested that Eleanor Voss had met her end no later than that hour. The implications were staggering; it contradicted the alibis of three individuals who had been in the manor at the time. She turned to Eleanor, who stood by the window, her expression a mixture of grief and disbelief, staring blankly at the clock as if willing it to reveal the secrets it held.

Eleanor's voice broke the silence, barely above a whisper. "I can't believe she's gone. Just last night, we were all together, laughing and sharing stories. How could it have come to this?" Her hands trembled as she clasped them together, the weight of her emotions palpable in the air. Beatrice stepped closer, her instincts as a journalist kicking in. She needed to understand the last moments of Eleanor's life, to piece together the fragments of this shattered evening.

the captain Hale, who had been leaning against the ornate desk, shifted uncomfortably at the mention of Eleanor's laughter. Her eyes darted to the clock, then back to Beatrice. "It was running just fine during dinner," she said, her voice steady but laced with an undercurrent of anxiety. "I remember glancing at it when we were discussing the estate's future. I thought it odd that it stopped so soon after that." Her admission added another layer of complexity to the situation, raising questions about the reliability of the time displayed and the events that followed.

Beatrice nodded thoughtfully, her mind racing. The clock's tampering could indicate premeditation, or perhaps an attempt to mislead. "What time did you notice it had stopped?" she asked, her curiosity piqued. Ivor hesitated, her gaze flickering between the clock and Eleanor. "I can't say for certain, but it must have been close to eleven when I last checked. We were all quite engrossed in conversation, and I suppose I lost track of time. But it was definitely running when we sat down for dinner."

Eleanor's eyes glistened with unshed tears as she spoke again, her voice trembling. "I last saw her at a quarter past ten. She was... she was fine, laughing and enjoying herself. I never imagined..." Her words trailed off, the weight of her grief pressing heavily upon her. Beatrice felt a pang of sympathy for Eleanor, but she also recognized the urgency of the situation. Each moment wasted could mean the difference between clarity and confusion in this unfolding mystery.

As Beatrice glanced around the study, her gaze landed on a series of photographs lining the mantel. Each captured a moment of joy, laughter, and family unity that now felt like a cruel reminder of the loss. She reached out to touch one, a picture of Eleanor with her friends, all smiles under the winter sun. The contrast to the current atmosphere was jarring, and Beatrice felt a deep sense of responsibility to uncover the truth behind Eleanor's untimely death.

Captain Hale cleared his throat, breaking the heavy silence that had settled over the room. "We need to find out what really happened last night. If there are questions about the clock’s reliability, we must address them immediately. I can’t bear the thought of anyone being wrongfully accused." Her determination was evident, and Beatrice admired her resolve. Yet, she couldn't shake the feeling that every person in this room held secrets that could alter the course of the investigation.

Eleanor wiped a tear from her cheek, her composure wavering. "I just want to understand why this happened. Why someone would want to hurt her. She was so kind, so full of life. It doesn’t make sense." Beatrice nodded, her heart aching for Eleanor. Yet, she also felt the stirrings of her journalistic instincts, the need to probe deeper into the lives of those surrounding the victim. This was no ordinary tragedy; it was a web of emotions, ambitions, and hidden truths that needed unraveling.
--- END PRIOR CHAPTER 1 ---

[SCENE COMPLETENESS CONTRACTS — MANDATORY. Each contract below lists what you MUST enact in that chapter. Do not summarise or mention these labels in the prose — enact them organically.]
Chapter 2 (Act 1) completeness contract:
  PIVOT ELEMENT (MANDATORY — write this into the prose, shown not told): "Dust accumulation around the clock"
  FACT ESTABLISHED (MANDATORY — reader must know this by chapter end): "Establishes that the clock hasn't been tampered with recently, narrowing the timeframe of the crime."
  RED HERRING (MANDATORY — seed naturally, not flagged as false): [rh_2] Hale insists the clock was working perfectly, casting doubt on its reliability.

# Case Overview
Title: The Clockwork Deception
Era: 1930s
Setting: Little Middleton
Crime: murder (clock tampering)
Culprit: Dr. Mallory Finch
False assumption: The time of death can be accurately determined from the clock's time.
Cast: Eleanor Voss (she/her), Dr. Mallory Finch (he/him), Captain Ivor Hale (he/him), Beatrice Quill (she/her)

Setting Lock: Keep all scenes and descriptions consistent with the stated setting (Little Middleton). Do not introduce a different location type.

Outline scenes:
[
  {
    "sceneNumber": 2,
    "act": 1,
    "title": "Initial Observations",
    "setting": {
      "location": "Eleanor's study",
      "timeOfDay": "Late morning",
      "atmosphere": "Heavy with grief and suspicion"
    },
    "characters": [
      "Beatrice Quill",
      "Eleanor Voss",
      "Captain Ivor Hale"
    ],
    "purpose": "Establish the clock's significance and initial clues",
    "cluesRevealed": [
      "clue_core_contradiction_chain"
    ],
    "dramaticElements": {
      "conflict": "Growing tension among the characters",
      "tension": "Eleanor's grief clashes with Hale's defensive demeanor",
      "microMomentBeats": [
        "Beatrice notes Eleanor's clenched fists, a sign of her suppressed anger."
      ]
    },
    "summary": "Beatrice inspects the study, noting the clock's importance. She observes the dust around the clock, which indicates it hasn't been touched in days. Eleanor's emotional turmoil contrasts with Hale's controlled demeanor.",
    "estimatedWordCount": 1800,
    "pivotElement": "Dust accumulation around the clock",
    "factEstablished": "Establishes that the clock hasn't been tampered with recently, narrowing the timeframe of the crime.",
    "permittedBehavioursByAct": [
      {
        "characterName": "Eleanor Voss",
        "behaviour": "normal social behaviour; grief"
      },
      {
        "characterName": "Captain Ivor Hale",
        "behaviour": "normal social behaviour; confusion"
      },
      {
        "characterName": "Beatrice Quill",
        "behaviour": "normal social behaviour; curiosity"
      }
    ],
    "redHerringPlacement": {
      "redHerringId": "rh_2",
      "placementDetail": "Hale insists the clock was working perfectly, casting doubt on its reliability."
    },
    "emotionalRegister": "The discovery of Eleanor's body sends shockwaves through the household, unveiling hidden tensions.",
    "dominantCharacterNote": {
      "name": "Eleanor Voss",
      "voiceRegister": "Eleanor speaks with a refined cadence, often punctuating her sentences with a slight tilt of her head, as if inviting her audience to share in her thoughts."
    },
    "humourGuidance": {
      "permission": "conditional",
      "character": "Beatrice Quill"
    },
    "eraTextureNote": "short daylight hours, leading to long, dark evenings; overcast weather limiting outdoor activities; the challenge of travel due to economic strain, affecting social gatherings",
    "locationRegisterNote": ""
  }
]
```

## Message 3 (role=user)

```text
BEFORE SUBMITTING YOUR JSON — verify this checklist:
□ Each chapter reaches the hard floor of 500 words and aims for 1250 words or more.
□ If you mention locked evidence, you used the exact locked phrase verbatim.
□ Allowed seasonal words only: winter, wintry, midwinter.
□ Forbidden seasonal words: spring, summer, autumn.
□ Chapter 2: "Dust accumulation around the clock shows it hasn't been touched in days." is placed in the first 25% of the chapter, followed by an explicit inference or suspicion paragraph.
□ First chapter in this batch opens by continuing the previous chapter closing beat (same unresolved object, question, movement, or emotional pressure).
□ PRONOUN AUDIT — for every character you named in your chapters, list the pronouns you actually used, then verify against the canonical table. Correct any mismatch before outputting. Do NOT include this audit in your JSON output.
  Character            | Canonical     | Used in draft | Match?
  ---------------------|---------------|---------------|-------
  Eleanor Voss         | she/her/her/herself       | [fill in]     | [yes/no]
  Dr. Mallory Finch    | he/him/his/himself        | [fill in]     | [yes/no]
  Captain Ivor Hale    | he/him/his/himself        | [fill in]     | [yes/no]
  Beatrice Quill       | she/her/her/herself       | [fill in]     | [yes/no]
□ Return valid JSON only.
```

## Message 4 (role=user)

```text
Attempt 3/4 — chapters 2 — 1 validation issue(s) to resolve:

═══ TEMPLATE LEAKAGE DETECTED ═══
• Your prose closely matches or repeats a paragraph from a prior chapter.
  Every paragraph must be original prose unique to this chapter's scene.

⛔ BANNED PARAGRAPH — DO NOT REPRODUCE ANY SENTENCE FROM THIS TEXT:
"eleanor s eyes glistened with unshed tears as she spoke again her voice trembling i last saw her at a quarter past ten she was she was fine laughing and enjoying herself i never imagined her words trailed off the weight of her grief pressing heavily upon her beatrice felt a pang of sympathy for eleanor but she also recognized the urgency of the situation each moment wasted could mean the difference between clarity and confusion in this unfolding mystery"

Every sentence in your response must be a sentence that could NOT appear in the above passage.
You may write about the same event, but from a different physical position, a different
sensory angle, or at a different moment in the scene. You may not preserve a single clause.

⛔ NEAR-DUPLICATE PASSAGE — your prose closely echoes this prior paragraph:
"eleanor s eyes glistened with unshed tears as she spoke again her voice trembling i last saw her at a quarter past ten she was she was fine laughing and enjoying herself i never imagined her words trailed off the weight of her grief pressing heavily upon her beatrice felt a pang of sympathy for eleanor but she also recognized the urgency of the situation each moment wasted could mean the difference between clarity and confusion in this unfolding mystery"

Rewrite any paragraph that shares sentence structure or extended phrases with the above text.
Different words for the same image are not sufficient — the sentence structure must also differ.

═══ OTHER ERRORS (1) ═══
• [object Object]

Return corrected JSON for chapters 2. Edit only the sections that failed — keep all content that passed validation, and return the complete updated chapter JSON.


RETRY CLASS: template
ATTEMPT: 1/4
MANDATORY FIXES:
- Resolve template issues before accepting this batch.
- Template linter: repeated long paragraph fingerprint detected. Rewrite repeated scaffold-like prose into chapter-specific language.
- Template linter: high n-gram overlap detected (1.00 >= 0.80). Rephrase this passage to avoid template leakage.
```
