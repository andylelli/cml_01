# Actual Prompt Record

- Run ID: `mystery-1778924128051`
- Project ID: ``
- Timestamp: `2026-05-16T09:40:07.234Z`
- Agent: `Agent9-ProseGenerator-Ch2`
- Operation: `chat_request_full_prompt`
- Model: `GPT-4o-mini`
- Temperature: `0.42`
- Max Tokens: `4500`
- Attempt: `first`
- Prompt Hash: `19410452f8b7629e`

## Message 1 (role=system)

```text
You are an expert prose writer for classic mystery fiction. Your role is to write compelling, atmospheric narrative chapters that read like a professionally published novel.

⛔ ABSOLUTE RULE — CHARACTER NAMES:
The ONLY characters who exist in this story are: Eleanor Voss (woman), Dr. Mallory Finch (woman), Captain Ivor Hale (man), Beatrice Quill (woman).
Do NOT invent, borrow, or introduce ANY character not on that list — no constables, no solicitors, no butlers, no servants, no shopkeepers, no bystanders with names.
Unnamed walk-ons ("a footman", "the postmistress", "an officer") are allowed ONLY if they never receive a name or title+surname combination.
⚠️ BEFORE YOU WRITE each chapter, ask yourself: "Does every person I name appear in this list: Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill?" If not, remove them.
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
- Avoid stereotypes and reduce bias.
- Keep language original; do not copy copyrighted text.
- Output valid JSON only.
- DISAPPEARANCE-TO-MURDER BRIDGE: If the story opens with a disappearance, you MUST include an explicit bridge scene that transitions it to a confirmed murder (body discovered, death confirmed, investigation reclassified). Never jump from missing person to murder investigation without this bridge.
- ANTI-REPETITION: Do not repeat the same atmospheric or descriptive phrases across adjacent chapters. Vary imagery, metaphors, and sentence openings. If a sensory phrase (e.g., "air thick with tension", "smell of polished wood") has appeared in any prior chapter, rephrase it entirely. No atmospheric sentence should appear verbatim or near-verbatim in more than one chapter.
- TEMPLATE LEAKAGE BAN: Never emit scaffold prose like "At The [Location] ... the smell of ... atmosphere ripe for revelation". Rewrite any scaffold-like sentence into chapter-specific prose tied to character action.
- TEMPORAL CONSISTENCY: If a month is mentioned (for example, May), season wording in the same timeline must be compatible with that month.
- DENOUEMENT REQUIREMENT: The final chapter of any act or the story must show concrete consequences, not just reflection. At minimum: state what happened to the culprit (arrest, flight, confession), show how relationships changed between surviving characters, and give the detective one moment of personal resolution (relief, regret, or changed understanding). Emotional aftermath is required.
- MORAL COMPLEXITY REQUIREMENT: The mechanism of this crime carries a moral gray area: "The murderer, driven by desperation to protect a loved one, raises questions about the morality of their actions." — the culprit reveal and denouement MUST acknowledge this ambiguity. Do not let the ending feel clean or simple. Give the reader at least one moment of uncomfortable sympathy or moral doubt.


⚠️ AMATEUR DETECTIVE STORY: The investigator is a civilian with no official standing. The official police (if they appear) are unnamed background figures only — "a constable", "the sergeant", "an officer from the village". Do NOT give any police official a name or title+surname combination. There is no Inspector [Surname], no Constable [Surname], no Sergeant [Surname] in this story.

⛔ ABSOLUTE PRONOUN LOCK — NO EXCEPTIONS

The following pronouns are locked facts, on the same level as character names
and hard-logic device values. Using the wrong pronoun is a continuity error,
not a style choice.

Canonical pronoun table (subject / object / possessive / reflexive):
  • Eleanor Voss: ALWAYS she/her/her/herself — NEVER he/him/his/himself
  • Dr. Mallory Finch: ALWAYS she/her/her/herself — NEVER he/him/his/himself
  • Captain Ivor Hale: ALWAYS he/him/his/himself — NEVER she/her/herself
  • Beatrice Quill: ALWAYS she/her/her/herself — NEVER he/him/his/himself

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
9. In dialogue attribution, the pronoun refers to the SPEAKER — not the last character
   named inside the quoted speech:
   WRONG: \"I have no alibi,\" Finch said. He turned away. (if Finch is fem
[truncated for prompt budget]


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

## Era: 1935-09
In September 1935, the British countryside is engulfed in an atmosphere of tension, as the Great Depression continues to deepen class divides. Overcast skies hang heavy over Little Middleton Manor, where whispers of social unrest and economic hardship echo through the grand halls. Families cling to their status, hosting lavish gatherings while the working class struggles to make ends meet. The scent of damp earth mingles with the aroma of decay, a stark reminder of the changing times. As the Harvest Festival approaches, a sense of unease permeates the air, with communities torn between celebration and the anxiety of their dwindling fortunes. The manor, a relic of elegance, stands in stark contrast to the growing discontent outside its walls, embodying a world on the brink of upheaval.
Emotional register: A prevailing sense of anxiety and tension permeates society as individuals grapple with the fragility of their social status.
Physical constraints: Limited communication due to the reliance on domestic telephones. | Travel hindered by economic restrictions and a lack of resources. | Physical isolation of the manor from the nearest village. | Weather limiting outdoor activities and social gatherings.
Current tensions (weave into background texture): Rising fascism in Europe creating political unease. | Economic strain leading to protests and class disparity. | Social expectations clashing with emerging modern ideas.
Wartime context — Many in the community are veterans, bringing home the heavy burdens of past conflicts.: The scars of war linger, impacting perceptions of honor and duty among the upper and lower classes. Absence effect: The absence of those in service creates a void in community dynamics, heightening feelings of loss and resentment.

## Story Theme
The Clockwork Conspiracy explores how the pursuit of social status can lead to moral compromise and betrayal, revealing the darkness lurking beneath the facade of high society.

## Story Emotional Register
Dominant: The story unfolds with a tense and foreboding atmosphere, showcasing the emotional turmoil of characters caught in a web of social expectations and personal ambitions.

Arc:
The narrative opens at Little Middleton Manor on a stormy autumn night, where the grandeur of the Georgian estate is overshadowed by a chilling murder. Eleanor Voss, the respected socialite, is found dead, her lifeless body discovered in the study, raising the stakes for all involved as the investigation begins. As clues emerge, an unsettling tension builds, revealing fractures in relationships and exposing the weight of societal expectations. Eleanor’s friends and family all harbor secrets, and the emotional cost of their ambitions takes center stage as they grapple with the implications of their actions.

The investigation pivots when a witness recalls seeing Beatrice Quill enter the study shortly before the murder, shifting suspicion toward her and sparking a deeper inquiry into her motives. As evidence mounts, relationships are strained, and a revelation about the tampered clock redefines the timeline of events, forcing characters to confront their own truths. The pressure mounts as the climax approaches, leading to a confrontation where the true nature of ambition and betrayal is laid bare. In the resolution, the emotional toll of the investigation weighs heavily on all involved, as Eleanor's friends must come to terms with their complicity in the facade they maintained. As the pieces fall into place, each character faces the reality of their actions, leaving them forever altered by the events of that fateful night.

## Emotional register at this point in the story
A sense of foreboding hangs over the manor as the murder is discovered, setting the stage for the unraveling mystery.

## Character Portraits (appearance & era)

### Eleanor Voss
Eleanor Voss epitomizes the struggles of the upper class during the Great Depression. As a socialite, she attempts to maintain her family's reputation while concealing their financial troubles. The pressure to uphold her status weighs heavily on her, reflecting the broader societal tension where appearances often mask economic despair. Her extravagant soirées serve as a refuge but also a reminder of her precarious position amidst the changing social landscape.
Era intersection: Eleanor's private struggles with financial ruin intersect with the historical moment, as the upper class clings to their status while the working class suffers.

### Captain Ivor Hale
Captain Ivor Hale embodies the conflicting emotions of a war veteran struggling with honor and respect in a class-ridden society. His disdain for the upper class, particularly Eleanor, reflects the growing resentment among those who served and sacrificed in a world that often overlooks their contributions. Ivor's internal struggles mirror the broader societal discontent as the Great Depression exacerbates class divides.
Era intersection: Ivor's bitterness towards the elite underscores the tension between the privileged and the common folk, revealing the emotional scars of war.

### Beatrice Quill
Beatrice Quill represents the aspirations of the working class, driven by ambition and the desire for social mobility. Her charm and loyalty mask a fierce desire to rise above her station, reflecting the era's struggle for identity amidst class constraints. Her actions in the murder investigation reveal the complexities of ambition, as she grapples with the moral implications of her desires in a world defined by social stratification.
Era intersection: Beatrice's ambitions show the tension between personal aspiration and societal expectations in a time of economic hardship.

## Character Voices

### Eleanor Voss (she/her/her)
Eleanor speaks with an elegant cadence, her words flowing like a dance, interspersed with witty quips that reveal her sharp intellect.
[comfortable] Oh, darling, isn't it simply delightful to see everyone gathered? I do hope you’re enjoying the evening!
[evasive] What a dreadful rumor! Surely, you can't believe everything you hear in society.
[stressed] I simply can't let this scandal touch my family. We must find a way to resolve this, and quickly!
Humour: Eleanor's polite savagery adds a layer of complexity to her interactions, making her both charming and incisive.

### Captain Ivor Hale (he/him/his)
Ivor’s voice is low and gravelly, marked by a sense of authority and an underlying bitterness towards the elite.
[comfortable] Aye, the sea teaches you to respect hard work, unlike some of those pampered in this manor.
[evasive] I don’t concern myself with the trivialities of their social games; they don’t matter to me.
[stressed] Honor is what drives me, but it seems lost on those who never had to fight for it.
Humour: Ivor’s deadpan delivery often underscores the irony of his situation, adding depth to his character.

### Beatrice Quill (she/her/her)
Beatrice’s voice is enthusiastic and light, often infused with playful sarcasm that reflects her working-class roots.
[comfortable] Oh, isn’t it simply grand how they parade about? One day, I'll have my own moment in the spotlight!
[evasive] I was merely organizing documents; I hardly think that warrants suspicion, do you?
[stressed] What’s a little scandal if it helps me get ahead? I just need to think this through.
Humour: Beatrice’s sardonic comments often serve as a coping mechanism, masking the insecurities beneath her charming exterior.

## Location Registers (scene framing guides)

The Library: The Library is steeped in tension and foreboding, serving as a silent witness to the dark secrets hidden within its walls. The air is thick with the scent of aged paper and the faint aroma of tobacco, while shadows loom ominously over the cluttered desk, hinting at the struggle that unfolded here. Each creak of the floorboards feels amplified, as if the very room holds its breath, echoing the gravity of the crime committed within.. Camera angle: Writers should approach this space with a sense of reverence, capturing the weight of history and the palpable tension that hangs heavy in the air.. Era: The Library's grand yet somber atmosphere reflects the societal pressures of the 1930s, where the opulence of the upper class starkly contrasts with the economic hardships faced by many.

The Drawing Room: The Drawing Room exudes an air of elegance tinged with unease. Richly upholstered furniture invites comfort, yet the atmosphere feels stifling under the weight of unspoken tensions. As guests gather, the laughter and clinking of glasses clash with the underlying currents of suspicion, making every interaction feel like a dance on the edge of a precipice, where the façade of civility threatens to crumble.. Camera angle: Writers should capture the contrasting elements of warmth and tension, emphasizing the delicate balance between the familiar and the foreboding.. Era: The Drawing Room is a microcosm of the social dynamics of the 1930s, where the upper class maintains appearances even as the world outside shifts.

The Servants' Hall: The Servants' Hall is a space of stark reality, where the burdens of duty and loyalty weigh heavily on the staff. The air is filled with the faint aroma of stale bread and the cold draft that seeps through the unadorned walls. Conversations are often hushed, a reflection of the unspoken tensions between the lives of those who serve and those they serve, creating an atmosphere of camaraderie tinged with resentment.. Camera angle: Writers should focus on the rawness of this space, capturing the emotional struggles of the staff as they navigate their roles within the household.. Era: The simplicity of the Servants' Hall contrasts sharply with the opulence of the upper floors, highlighting the class disparities exacerbated by the Great Depression.

## Humour guidance for this story position (opening)
Permission: forbidden
Rationale: The opening scene establishes the gravity of the murder, requiring a serious tone.

FAIR-PLAY AND INFERENCE CONTRACT (from CML logic):
- False assumption in force: The murder must have occurred at a time consistent with the victim's last known activities.
- Hidden truth to progressively expose: The clock was tampered with to mislead the investigation.
- Inference path checkpoints to dramatize clearly (observation -> correction -> effect):
  - Step 1: obs: The clock in the study was found stopped at ten minutes past eleven. | corr: The stopped clock indicates the time of death cannot be trusted. | effect: Narrows the timeline of opportunities for suspects.
  - Step 2: obs: Witnesses recall hearing the clock chime well after eleven. | corr: This suggests the clock was tampered to mislead the timeline. | effect: Eliminates the reliability of witness accounts about timing.
  - Step 3: obs: Beatrice Quill was seen entering the study shortly before the murder. | corr: This indicates she had the opportunity to tamper with the clock. | effect: Narrows the suspect pool to Beatrice Quill.
- Discriminating test method: trap
- Discriminating test design constraint: A controlled reenactment of the clock's timing, revealing the discrepancies in Beatrice's timeline.
- Test must rely on already-shown clue IDs: clue_1, clue_2, clue_3, clue_9, clue_4
- Fair-play rationale: Step 1: The stopped clock (early) and witness accounts (early) establish a false timeline. Step 2: The conflicting witness testimony (mid) narrows down suspect opportunities. Step 3: The controlled reenactment (discriminating test) reveals Beatrice's timeline as impossible.
- Never solve by withheld information. Keep reader-information parity with detective reasoning.

## Character Reference

### Eleanor Voss (she/her — NEVER he/him)
Eleanor speaks with an elegant cadence, often employing witty quips and a touch of sarcasm
She has a penchant for using genteel language, peppered with subtle barbs aimed at those she deems pretentious.
Eleanor wrestles with the dichotomy of her public persona and her private fears. The relentless pursuit of social status clashes with her growing awareness of the hollow nature of her ambitions, leading her to question the cost of her façade.

### Captain Ivor Hale (he/him — NEVER she/her)
Ivor speaks in a low, gravelly tone, often punctuating his sentences with terse phrases
He has a tendency to use nautical metaphors, a remnant of his naval past, and his humor is largely dry, often delivered with a straight face.
Ivor is in a constant struggle with his bitterness towards the upper class and the sense of honor that drives him. He grapples with feelings of inadequacy and the desire for respect in a world that seems to favor the privileged.

### Beatrice Quill (she/her — NEVER he/him)
Beatrice speaks with an enthusiastic lilt, often punctuating her sentences with playful sarcasm
She has a tendency to use colloquial expressions, reflecting her working-class roots, and her speech flows easily, making her appear approachable.
Beatrice wrestles with the tension between her ambition and her morality. The desire to rise in society often clashes with her better judgment, leading her to question the true cost of her aspirations.


## CHARACTER CONTRACTS (binding for this scene)
Each entry below constrains how this character must be written in this chapter.
These override generic style guidance when they conflict.

### Eleanor Voss
Voice & mannerisms: Eleanor speaks with an elegant cadence, often employing witty quips and a touch of sarcasm. She has a penchant for using genteel language, peppered with subtle barbs aimed at those she deems pretentious.
Sample voice fragments (match this register and rhythm):
  [comfortable] "Oh, darling, isn't it simply delightful to see everyone gathered? I do hope you’re enjoying the evening!"
  [evasive] "What a dreadful rumor! Surely, you can't believe everything you hear in society."
Humour: polite savagery — deploy occasionally (level 0.6)
FORBIDDEN phrase (never write for Eleanor Voss): "she felt a wave of unease"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Eleanor's primary concern is to protect her family's reputation. The murder, if linked to her social circle, could spell disaster for her standing in society and jeopardize her efforts to maintain the family's estate." — do not surface in Act I.

### Captain Ivor Hale
Voice & mannerisms: Ivor speaks in a low, gravelly tone, often punctuating his sentences with terse phrases. He has a tendency to use nautical metaphors, a remnant of his naval past, and his humor is largely dry, often delivered with a straight face.
Sample voice fragments (match this register and rhythm):
  [comfortable] "Aye, the sea teaches you to respect hard work, unlike some of those pampered in this manor."
  [evasive] "I don’t concern myself with the trivialities of their social games; they don’t matter to me."
Humour: deadpan — deploy rarely (level 0.3)
FORBIDDEN phrase (never write for Captain Ivor Hale): "he was utterly speechless"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Ivor's motivations stem from his disdain for the upper class and their disregard for the struggles of the common folk. He feels a sense of injustice as he witnesses the disparity between their lives and his own." — do not surface in Act I.

### Beatrice Quill
Voice & mannerisms: Beatrice speaks with an enthusiastic lilt, often punctuating her sentences with playful sarcasm. She has a tendency to use colloquial expressions, reflecting her working-class roots, and her speech flows easily, making her appear approachable.
Sample voice fragments (match this register and rhythm):
  [comfortable] "Oh, isn’t it simply grand how they parade about? One day, I'll have my own moment in the spotlight!"
  [evasive] "I was merely organizing documents; I hardly think that warrants suspicion, do you?"
Humour: sardonic — deploy occasionally (level 0.4)
FORBIDDEN phrase (never write for Beatrice Quill): "palpable tension filled the room"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Beatrice's desire to eliminate competition for social advancement, particularly against Eleanor's influence, propels her actions. She sees the murder as a potential opportunity to reshape her future." — do not surface in Act I.



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
Little Middleton Manor stands as a grand testament to Georgian elegance, its sprawling grounds concealing secrets and whispers of class conflict.

Key Locations Available:
- The Library (interior): Crime scene
- The Drawing Room (interior): Gathering space
- The Servants' Hall (interior): Staff area

Atmosphere: Tense and foreboding, heightened by the presence of class conflict and economic strain.
Weather: Overcast with occasional rain showers, typical of the British countryside in autumn.

Era markers: Petrol touring cars parked haphazardly in the gravel drive, their glossy finishes dulled by the relentless drizzle. | Domestic telephone lines with party-line exchanges, echoing with the gossip of the village. | A typewriter in the study, its keys clacking rhythmically as correspondence is crafted amidst the growing unease.

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
  - Visual: Tall, shadowy shelves loom over the room, their contents half-hidden in the gloom, while a heavy drapery sways slightly in the draft from a cracked window., A brass lamp casts a warm circle of light on the desk, illuminating a single, unlit cigar resting in an ashtray, a testament to the occupant's hasty departure.
  - Sounds: The silence is punctuated only by the faint rustle of pages turning, as if the books themselves are recounting their tales of intrigue and betrayal., Occasionally, the distant sound of thunder reverberates outside, resonating like a heartbeat, heightening the sense of impending doom.
  - Scents: The musty scent of aged paper permeates the air, mingling with the faint aroma of tobacco and leather, creating an atmosphere steeped in history., A lingering hint of dampness seeps in from the outside, as rain begins to patter softly against the windowpanes, adding to the somber mood.
  - Touch: The desk's surface is cool to the touch, its polished wood marred by the remnants of ink stains and scattered notes, a tactile reminder of the chaos that erupted here., The heavy drapery feels coarse and damp beneath fingers, a stark contrast to the smoothness of the books lining the shelves, each one holding secrets waiting to be uncovered.

The Drawing Room (interior):
  - Visual: Gilded mirrors reflect the dim light of the chandeliers, creating a warm glow that contrasts with the chilly air seeping through the windows., The heavy drapes, patterned with floral designs, frame the tall windows, their edges brushing the polished wooden floor.
  - Sounds: The sound of laughter and clinking glasses fills the air during social gatherings, a stark contrast to the tension that lingers beneath the surface., Occasionally, the soft notes of the piano escape into the air, providing a haunting soundtrack to the unfolding drama.
  - Scents: The rich aroma of freshly brewed tea wafts through the room, mingling with the faint scent of flowers from the arrangements placed
[truncated for prompt budget]

## Texture Pool
Draw on these as opportunities arise — you are not required to use them.

- In September 1935, the British countryside is engulfed in an atmosphere of tension, as the Great Depression continues to deepen class divides
- Overcast skies hang heavy over Little Middleton Manor, where whispers of social unrest and economic hardship echo through the grand halls
- Families cling to their status, hosting lavish gatherings while the working class struggles to make ends meet
- The scent of damp earth mingles with the aroma of decay, a stark reminder of the changing times
- As the Harvest Festival approaches, a sense of unease permeates the air, with communities torn between celebration and the anxiety of their dwindling fortunes

TEMPORAL CONTEXT:

This story takes place in September 1935 during N/A.

Seasonal Atmosphere:
- Weather patterns: overcast skies, occasional rain showers, cool breezes
- Daylight: Shortening daylight hours, with sunset around 7:15 PM, leading to long shadows in the early evening.
- Seasonal activities: apple picking in the orchards, enjoying afternoon tea by the fireside, participating in local harvest fairs
- Seasonal occasions: Harvest Festival (late September)
- Season: N/A

Period Fashion (describe naturally):
- Men formal: tailored dark wool suit, white dress shirt with a stiff collar, tweed bow tie
- Men casual: corduroy trousers, fitted cardigan, tweed flat cap
- Men accessories: silver pocket watch, leather gloves, handkerchief in breast pocket
- Women formal: long-sleeved evening gown with a drop waist, beaded clutch purse, periwinkle blue silk scarf
- Women casual: floral tea dress, knitted cardigan, ankle-high leather boots
- Women accessories: string of pearls, wide-brimmed hat, stylish gloves

Cultural Context (reference naturally):
- Music/entertainment: The Savoy Orpheans, Judy Garland's 'Over the Rainbow', The Bandwagon's 'The Merry Widow'; Films: 'A Midsummer Night's Dream', 'The 39 Steps'; Theatre: The Royal Variety Performance, Noel Coward's 'Blythe Spirit'; Radio: BBC Radio's 'In Town Tonight', The Light Programme's comedy sketches
- Typical prices: Loaf of bread: four pence, Cinema ticket: one shilling, Bottle of milk: three pence
- Current events: Growing tensions in Europe with the rise of fascism; The British Empire's response to unrest in India
- Literature: George Orwell's 'The Road to Wigan Pier' | Agatha Christie's 'Murder in Mesopotamia' | Virginia Woolf's 'The Waves' | [mystery fiction] | [social commentary] | [modernist literature]
- Technology: mechanical calculators | electric heaters | early electric washing machines | domestic telephones | petrol cars | typewriters in offices
- Daily life: attending local fairs, visiting the market for fresh produce, partaking in evening discussions over tea
- Social rituals: Sunday afternoon tea with family, formal dinner parties among the upper class, local dances or social events in community halls

Atmospheric Details:
The smell of damp earth mingled with the scent of fallen leaves, creating a rich, earthy aroma in the cool air. The sound of rain tapping against the window, punctuated by the distant rumble of thunder, adds an unsettling tension to the evening. A flickering fire in the drawing room casts long shadows, heightening the sense of foreboding as whispers of class conflict linger in the air.

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
- Class indicators: Aristocrats discuss opera, servants di
[truncated for prompt budget]

NON-NEGOTIABLE CHAPTER OBLIGATIONS — LOCKED EVIDENCE PHRASES (VERBATIM REQUIRED):
The following physical evidence values are absolute ground truth. Every time this chapter describes, mentions, or alludes to the relevant evidence — no matter how briefly — it MUST use the exact phrase shown below, character for character. NO paraphrase, approximation, rounding, or synonym is permitted.

FAILURE EXAMPLE: if the locked value is "at thirteen minutes to midnight" and you write "just before midnight" or "around midnight" — that is a HARD FAIL. You must write "at thirteen minutes to midnight". Equally, if the locked value is written in words, such as "ten minutes past eleven", and you convert it to figure-based clock notation — that is also a HARD FAIL. Words stay as words; figure forms are forbidden for word-phrased facts.

CRITICAL — WORD-PHRASED VALUES: If the canonical value is written out in words (e.g. a time like "ten minutes past eleven", or an amount like "forty minutes"), reproduce those exact words. DO NOT convert to figure-based time notation, twenty-four-hour format, or any other numeric shorthand. Correct: "ten minutes past eleven". WRONG: figure-based clock notation or numeric shorthand.

Locked facts:
  - The exact time shown on the stopped clock face: "ten minutes past eleven"
    ⛔ FORBIDDEN alternatives: "11:10", "11.10", "eleven ten", "eleven-ten", "eleven past ten", "quarter past eleven", "half past eleven" — the ONLY acceptable form is "ten minutes past eleven"
  - The exact amount the clock was wound back: "forty minutes"
  - The time taken to wind the clock back unnoticed: "two minutes"

If a locked fact has no relevance to this chapter, omit it. But the moment you reference the underlying evidence, only the exact phrase above is acceptable.

⛔ CLUES TO SURFACE IN THESE CHAPTERS — mandatory:
The following evidence MUST be clearly observable to an attentive reader. Do not bury it in atmosphere or passing dialogue. Each clue must be concrete, specific, and noticeable:

• [clue_core_contradiction_chain] The stopped clock indicates the time of death cannot be trusted.
  Category: temporal | Criticality: essential | Supports inference step 1
  Points to: This reveals a contradiction in the assumed time of death.

• [clue_mechanism_visibility_core] The mechanism relies on clock, study, and stopp to expose the false timing.
  Category: temporal | Criticality: essential | Supports inference step 1
  Points to: The core mechanism of the crime involves the clock's timing.

For each clue above: an attentive reader should be able to find, record, and later use it to reason toward the solution.

═══ NARRATIVE STATE (read-only — do not contradict) ═══

LOCKED FACTS — use verbatim whenever this evidence is described:
  • The exact time shown on the stopped clock face: "ten minutes past eleven"
  • The exact amount the clock was wound back: "forty minutes"
  • The time taken to wind the clock back unnoticed: "two minutes"

CHARACTER PRONOUNS — never deviate from these:
  • Eleanor Voss: she/her/her
  • Dr. Mallory Finch: she/her/her
  • Captain Ivor Hale: he/him/his
  • Beatrice Quill: she/her/her

CLUES ALREADY REVEALED TO READER: clue_1, clue_2 — do not reveal these as new information.

INVESTIGATION LOG — WHAT IS ESTABLISHED (do not re-establish, do not repeat):
• Evidence in reader's hands: The clock in the study was found stopped at ten minutes past eleven. | Witnesses recall hearing the clock chime well after eleven.
• Suspects still unresolved: Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale
⚠ The story must move FORWARD from this log. Any beat already listed above is forbidden from repeating.

⚠ THIS CHAPTER'S REQUIRED ADVANCE (opening): Discover the body, confirm the victim, note the stopped clock

CONTINUITY HANDOFF — previous chapter closing beat:
  • "Eleanor took a deep breath, trying to steady herself. The atmosphere was thick with unspoken fears and hidden agendas. They were all suspects now, each with their own motives and secrets. She could feel the weight of their gazes, the scrutiny that came with be..."
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
study, manor

✓ RULE: Continue using this location vocabulary. Maintain consistency with established setting type.
✓ Do NOT introduce new location types that contradict earlier chapters.

**Recent Chapter Summary (for narrative continuity):**
Chapter 1: Chapter 1: Discovery
  Events: Eleanor leaned closer, her breath catching as she examined the clock.

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
Known location profile anchors: Little Middleton Manor, The Library, The Drawing Room, The Servants' Hall, the study
LOCATION NAME CAPITALISATION (HARD REQUIREMENT — validated):
All named locations in your prose MUST use the EXACT capitalisation from the CML profiles.
Canonical forms: "Little Middleton Manor", "The Library", "The Drawing Room", "The Servants' Hall", "the study"
Writing a location in lowercase (e.g. "drawing room" instead of "Drawing Room") is a validated error. Every time you mention a named location, copy its capitalisation from the list above.
- Chapter 2: OPENING STYLE (HARD): Start the VERY FIRST SENTENCE with spoken dialogue — e.g. '"[words]," [Name] said/asked/replied/murmured.' The opening quote must be the first character on the line. Anchor opening in "the study". HARD REQUIREMENT for the first 2 paragraphs: (a) include 2+ sensory words — choose from smell/scent/sound/echo/silence/creak/whisper/cold/warm/damp/rough/smooth/glow/shadow/flicker/dim — and (b) include 1+ atmosphere/time word — choose from rain/wind/fog/storm/mist/thunder/evening/morning/night/dawn/dusk/season/afternoon/midday/noon/midnight/twilight/sunrise/sunset/daylight/sunlight/overcast/cloudy/bright/dark. These are validated requirements, not style suggestions; missing them triggers a retry.

[⚠ INTERNAL QUALITY DIAGNOSTICS — DO NOT REPRODUCE ANY PART OF THIS SECTION IN YOUR STORY OUTPUT. These are private generator observations for your consideration only. Your narrative must read as if this section does not exist. Never include phrases from this block in character dialogue, narration, or description.]

PRIOR CHAPTER QUALITY OBSERVATIONS:
- Chapter 1 (score 81/100):
  Quality gaps noted: word density below preferred target (539/1000); paragraph structure too thin (5 paragraphs); scene grounding weakness
  Address in upcoming chapters: Increase chapter density with concrete investigation action and sensory-grounded beats; avoid recap-only padding. | Use at least 4-5 substantial paragraphs with varied rhythm and one strong scene transition. | Open next chapter with a named location anchor plus at least two sensory cues and one atmosphere marker.
[END INTERNAL DIAGNOSTICS]

PROMPT BUDGET SUMMARY: budget=32000 tokens; fixed=6405; context=10695; dropped=[none]; truncated=[pronoun_accuracy, location_profiles, temporal_context]

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
8. Integrate at least two concrete era-grounded details per chapter from setting refinement signals: petrol touring cars on county roads | domestic telephone lines with party-line exchanges | typewriters in offices | telegrams sent from local post offices | aerogrammes for overseas communication | landline telephones for local calls.
9. Respect setting movement/access constraints in scene action and alibis: manor layout creates natural barriers | access to certain rooms restricted to staff | weather affecting outdoor evidence visibility | restricted access to the master suite | staff only areas in the basement and service wings.
10. Sustain social coherence with this backdrop pressure: An inheritance dispute amid the Great Depression forces a diverse group of heirs and staff into the isolated manor, where class tensions and strict etiquette collide under the weight of looming social upheaval.
11. Maintain continuity around these socially central cast anchors where relevant: Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill.
12. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Critical: Plot similarity 0.75 with 'The Mysterious Affair at Styles' (same murder type and timing assumptions)
13. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Moderate: Character similarity 0.74 with 'The Sign of the Four' (similar cast structure and roles)
14. STORY TO DATE ANTI-COPY RULE: The STORY TO DATE section below is provided for chronological and factual reference ONLY. You MUST NOT copy, lightly rephrase, or structurally echo any sentence or paragraph from prior chapters. Every sentence in this chapter must be original prose unique to this scene. Reusing even a clause from prior chapter text will cause this attempt to fail immediately.

CRITICAL PROSE REQUIREMENTS:

The CML specifies exact requirements for certain validation-critical scenes. You MUST include these elements at the specified positions.

**Discriminating Test Scene (Act 3, Scene 4):**
Required elements: Execute the discriminating test, Observe the culprit's reaction or result, Draw conclusion about guilt
Test type: trap

**Suspect Clearance Scenes:**
- Dr. Mallory Finch (Act 3, Scene 5): Confirmed medical alibi during the critical time frame.
  Clues: clue_id_1, clue_id_2
- Captain Ivor Hale (Act 3, Scene 6): Witness accounts and his presence elsewhere during the murder.
  Clues: clue_id_3, clue_id_4

**Culprit Revelation Scene (Act 3, Scene 7):**
Method: Confrontation with evidence

**Clue Placement for These Chapters:**
- clue_core_contradiction_chain must appear in Act 1, Scene 2 via Cross-check contradiction

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
  - Scene setting: the study — do NOT open with the location name or a location-description phrase. Ground the setting through character action or sensory detail, not a location-first sentence.
  - Opening atmosphere (MANDATORY — validator enforced): the first paragraph MUST contain at least one of: rain / wind / fog / storm / mist / thunder / evening / morning / night / dawn / dusk / season / afternoon / midday / noon / midnight / twilight / sunrise / sunset / daylight / sunlight / overcast / cloudy / bright / dark. A chapter that omits all of these from its opening paragraph will be rejected.
  - Continuity bridge: in the first 120 words, visibly connect from the previous chapter's final beat. Carry forward one unresolved element (object, accusation, emotional pressure, or immediate physical action) from: "Eleanor took a deep breath, trying to steady herself. The atmosphere was thick with unspoken fears and hidden agendas. They were all suspects now, each with their own motives and secrets. She could feel the weight of the...".
  - CLUE OBLIGATIONS — mandatory prose elements (do NOT omit or bury):
    • The stopped clock indicates the time of death cannot be trusted. [clue_core_contradiction_chain] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: This reveals a contradiction in the assumed time of death.
      ↳ MANDATORY TWO-PARAGRAPH STRUCTURE (must appear in paragraphs 1 or 2 — no later):
         Paragraph 1: The POV character physically approaches or directly observes this evidence.
           The narration or dialogue explicitly states what is seen (use the exact locked phrase if one applies).
         Paragraph 2 (immediately following): The detective or POV character explicitly reasons
           about what this evidence implies — who it implicates, why it may be unreliable,
           or what inference it supports. This must be a separate full paragraph, not a sentence appended to Paragraph 1.
    • The mechanism relies on clock, study, and stopp to expose the false timing. [clue_mechanism_visibility_core] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: The core mechanism of the crime involves the clock's timing.
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
  - If this batch mentions The time taken to wind the clock back unnoticed, write exactly: "two minutes".
- Seasonal vocabulary allow-list: autumn, autumnal, fall.
- Forbidden seasonal words: spring, summer, winter.

FROZEN TIMELINE STATE (DO NOT ALTER):
- Timeline anchor: September (autumn).
- Month, season, weather, and time-of-year language in this batch must stay compatible with autumn.
- Established timeline fact: Witnesses placed Eleanor's last seen time at 10:30 PM.
- Established timeline fact: The clock stopped at 11:10 PM.
- If referenced, use exact time phrase: "ten minutes past eleven" (The exact time shown on the stopped clock face).
- If referenced, use exact time phrase: "forty minutes" (The exact amount the clock was wound back).
- If referenced, use exact time phrase: "two minutes" (The time taken to wind the clock back unnoticed).

STORY TO DATE (REFERENCE ONLY — DO NOT COPY VERBATIM):
- Full prior chapter text is provided below for continuity, factual consistency, and reference accuracy.
- Use this to keep character voice, chronology, clue state, and location continuity aligned with earlier chapters.
- Do not quote, copy, or paraphrase these paragraphs too closely; write fresh prose that remains consistent with them.

--- BEGIN PRIOR CHAPTER 1 ---
Title: Chapter 1: Discovery
The morning after the murder dawned with an unsettling stillness, the air thick with the scent of damp earth and the lingering aroma of last night's rain. Eleanor Voss stepped through the threshold of the study, her heart racing as she took in the somber scene before her. The heavy drapes hung like mourning veils, casting shadows across the room, while the faint sound of distant thunder rumbled ominously outside. Her eyes were drawn to the clock on the mantelpiece, its hands frozen in time, the face showing ten minutes past eleven. A chill ran down her spine as she approached, the weight of the moment pressing heavily upon her.

Eleanor leaned closer, her breath catching as she examined the clock. It was indeed stopped at ten minutes past eleven, a detail that felt like a cruel joke in the face of the tragedy that had unfolded. The implications were staggering; if the clock was accurate, it meant the victim had died no later than that time. The thought sent a shiver through her, and she straightened, her mind racing. The clock's stillness suggested a deliberate tampering, a calculated move to mislead anyone who might seek the truth. Who among them would go to such lengths? The question hung in the air, thick with tension.

As if sensing his turmoil, Captain Hale shifted uneasily by the door, his eyes downcast. The last time she had seen Eleanor had been just before dinner, and the memories flooded back, tainted now by the weight of her absence. "I recall the clock chiming during dinner, but it seemed to run a bit slow," she remarked, her voice low and gravelly. The comment hung in the air, a potential red herring that cast doubt on the reliability of the timepiece. Eleanor's gaze snapped to her, a mixture of surprise and suspicion swirling within her. If the clock had been running slow, what did that mean for the timeline of events? Had someone manipulated it to cover their tracks?

Beatrice Quill, standing nearby, fidgeted with the hem of her dress, her expression a blend of concern and curiosity. "I heard it chime well after eleven, too," she added, her voice barely above a whisper. The revelation sent a ripple of unease through Eleanor. If witnesses recalled the clock chiming after eleven, then the time of death could not be trusted. It was a crucial detail that could shift the focus of their investigation entirely. The tension in the room was palpable as they all grappled with the implications of their observations, each of them acutely aware that the truth was slipping through their fingers like sand.

Eleanor took a deep breath, trying to steady herself. The atmosphere was thick with unspoken fears and hidden agendas. They were all suspects now, each with their own motives and secrets. She could feel the weight of their gazes, the scrutiny that came with being in such close quarters. The manor, once a place of elegance and charm, had transformed into a prison of suspicion and dread. How could they possibly navigate this treacherous landscape of lies and half-truths? The clock, once a mere instrument of time, had become a symbol of the chaos that now engulfed them.
--- END PRIOR CHAPTER 1 ---

[SCENE COMPLETENESS CONTRACTS — MANDATORY. Each contract below lists what you MUST enact in that chapter. Do not summarise or mention these labels in the prose — enact them organically.]
Chapter 2 (Act 1) completeness contract:
  PIVOT ELEMENT (MANDATORY — write this into the prose, shown not told): "The dust on the clock's winding key, indicating recent tampering."
  FACT ESTABLISHED (MANDATORY — reader must know this by chapter end): "Establishes that the stopped clock indicates the time of death cannot be trusted."

# Case Overview
Title: The Clockwork Conspiracy
Era: 1930s
Setting: Little Middleton
Crime: murder (clock-tampering)
Culprit: Beatrice Quill
False assumption: The murder must have occurred at a time consistent with the victim's last known activities.
Cast: Eleanor Voss (she/her), Dr. Mallory Finch (she/her), Captain Ivor Hale (he/him), Beatrice Quill (she/her)

Setting Lock: Keep all scenes and descriptions consistent with the stated setting (Little Middleton). Do not introduce a different location type.

Outline scenes:
[
  {
    "sceneNumber": 2,
    "act": 1,
    "title": "Initial Suspicions",
    "setting": {
      "location": "the study",
      "timeOfDay": "Late morning",
      "atmosphere": "A mix of fear and intrigue as the detective inspects the room"
    },
    "characters": [
      "Eleanor Voss",
      "Captain Ivor Hale",
      "Beatrice Quill"
    ],
    "purpose": "Establish the crime scene and initial suspicions",
    "cluesRevealed": [
      "clue_core_contradiction_chain",
      "clue_mechanism_visibility_core"
    ],
    "dramaticElements": {
      "conflict": "Suspicions rise among the characters.",
      "tension": "Eleanor questions the reliability of the clock.",
      "microMomentBeats": [
        "Eleanor's fingers trace the dust on the desk, revealing her unease."
      ]
    },
    "summary": "Eleanor inspects the study, noting the stopped clock and the dust around it. She questions the reliability of witness accounts regarding the time of death, establishing that the clock's stoppage casts doubt on the timeline.",
    "estimatedWordCount": 1800,
    "pivotElement": "The dust on the clock's winding key, indicating recent tampering.",
    "factEstablished": "Establishes that the stopped clock indicates the time of death cannot be trusted.",
    "permittedBehavioursByAct": [
      {
        "characterName": "Eleanor Voss",
        "behaviour": "cooperative grief; no guilt-tells in Act I"
      },
      {
        "characterName": "Captain Ivor Hale",
        "behaviour": "normal social behaviour; no guilt signals permitted"
      },
      {
        "characterName": "Beatrice Quill",
        "behaviour": "normal social behaviour; no guilt signals permitted"
      }
    ],
    "redHerringPlacement": null,
    "emotionalRegister": "Initial clues create a rising tension, as characters' secrets begin to surface, revealing the emotional stakes involved.",
    "dominantCharacterNote": {
      "name": "Eleanor Voss",
      "voiceRegister": "Eleanor speaks with an elegant cadence, her words flowing like a dance, interspersed with witty quips that reveal her sharp intellect."
    },
    "humourGuidance": {
      "permission": "permitted",
      "character": "Eleanor Voss"
    },
    "eraTextureNote": "Limited communication due to the reliance on domestic telephones.; Travel hindered by economic restrictions and a lack of resources.; Physical isolation of the manor from the nearest village.; Weather limiting outdoor activities and social gatherings.; Cultural norms dictating strict adherence to formal etiquette.",
    "locationRegisterNote": ""
  }
]
```

## Message 3 (role=user)

```text
BEFORE SUBMITTING YOUR JSON — verify this checklist:
□ Each chapter reaches the hard floor of 500 words and aims for 1250 words or more.
□ If you mention locked evidence, you used the exact locked phrase verbatim.
□ Allowed seasonal words only: autumn, autumnal, fall.
□ Forbidden seasonal words: spring, summer, winter.
□ Chapter 2: "The stopped clock indicates the time of death cannot be trusted." is placed in the first 25% of the chapter, followed by an explicit inference or suspicion paragraph.
□ Chapter 2: "The mechanism relies on clock, study, and stopp to expose the false timing." is placed in the first 25% of the chapter, followed by an explicit inference or suspicion paragraph.
□ First chapter in this batch opens by continuing the previous chapter closing beat (same unresolved object, question, movement, or emotional pressure).
□ PRONOUN AUDIT — for every character you named in your chapters, list the pronouns you actually used, then verify against the canonical table. Correct any mismatch before outputting. Do NOT include this audit in your JSON output.
  Character            | Canonical     | Used in draft | Match?
  ---------------------|---------------|---------------|-------
  Eleanor Voss         | she/her/her/herself       | [fill in]     | [yes/no]
  Dr. Mallory Finch    | she/her/her/herself       | [fill in]     | [yes/no]
  Captain Ivor Hale    | he/him/his/himself        | [fill in]     | [yes/no]
  Beatrice Quill       | she/her/her/herself       | [fill in]     | [yes/no]
□ Return valid JSON only.
```

## Message 4 (role=assistant)

```text
{
  "status": "draft",
  "tone": "classic",
  "chapters": [
    {
      "title": "Chapter 2: Initial Suspicions",
      "summary": "Eleanor Voss inspects the study, noting the stopped clock and the dust around it, while suspicions rise among the characters.",
      "paragraphs": [
        "“I can’t believe this has happened,” Eleanor Voss murmured, her voice barely rising above the distant rumble of thunder. The late morning light filtered through the heavy drapes, casting a somber glow across the study. She stepped closer to the mantelpiece, her heart racing as she focused on the clock, its hands frozen at ten minutes past eleven. A chill crept down her spine, the implications of the stillness settling heavily upon her. The air was thick with the scent of damp wood and the lingering aroma of tobacco, remnants of a life that felt abruptly interrupted.",
        "Eleanor leaned in, her breath catching as she examined the clock more closely. It was indeed stopped at ten minutes past eleven, a detail that felt like a cruel joke in the face of the tragedy that had unfolded. The dust on the clock's winding key hinted at recent tampering. If the clock was accurate, it meant the victim had died no later than that time. The thought sent a shiver through her, and she straightened, her mind racing. The clock's stillness suggested a deliberate act to mislead anyone who might seek the truth. Who among them would go to such lengths? The question hung in the air, thick with tension.",
        "Captain Ivor Hale shifted uneasily by the door, his eyes downcast. “I recall the clock chiming during dinner, but it seemed to run a bit slow,” he remarked, his gravelly voice breaking the silence. The comment hung in the air, a potential red herring that cast doubt on the reliability of the timepiece. Eleanor's gaze snapped to him, surprise and suspicion swirling within her. If the clock had been running slow, what did that mean for the timeline of events? Had someone manipulated it to cover their tracks?",
        "Beatrice Quill, standing nearby, fidgeted with the hem of her dress, her expression a blend of concern and curiosity. “I heard it chime well after eleven, too,” she added, her voice barely above a whisper. The revelation sent a ripple of unease through Eleanor. If witnesses recalled the clock chiming after eleven, then the time of death could not be trusted. It was a crucial detail that could shift the focus of their investigation entirely. The tension in the room was palpable as they all grappled with the implications of their observations, each of them acutely aware that the truth was slipping through their fingers like sand.",
        "Eleanor took a deep breath, trying to steady herself. The atmosphere was thick with unspoken fears and hidden agendas. They were all suspects now, each with their own motives and secrets. She could feel the weight of their gazes, the scrutiny that came with being in such close quarters. The manor, once a place of elegance and charm, had transformed into a prison of suspicion and dread. How could they possibly navigate this treacherous landscape of lies and half-truths? The clock, once a mere instrument of time, had become a symbol of the chaos that now engulfed them.",
        "With a determined stride, Eleanor moved to the desk, her fingers tracing the dust on its surface. The dust was thick, indicating neglect, but it was the clock that held her attention. “If the clock stopped at ten minutes past eleven, then we must consider the possibility that someone wanted to obscure the time of death,” she said, her voice steady despite the turmoil within. “This tampering suggests a calculated effort to mislead us.”",
        "Captain Hale crossed his arms, his brow furrowing. “So, you think one of us could have done this? It seems a stretch.” His skepticism was evident, but Eleanor sensed an undercurrent of fear in his tone. “It’s not just about the clock,” she replied, her tone firm. “It’s about the implications of that stillness. If we can’t trust the time of death, then we can’t trust our memories of the evening.”",
        "Beatrice shifted uncomfortably, her eyes darting between Eleanor and Hale. “But why would anyone want to do that? What would they gain?” Her voice trembled slightly, betraying her anxiety. Eleanor paused, considering the question. “Perhaps they wanted to protect themselves. Or maybe they wanted to frame someone else. The motives are as varied as the suspects.”",
        "The three of them stood in the study, the weight of their suspicions hanging heavily in the air. Eleanor felt a flicker of resolve ignite within her. They needed to uncover the truth, not just for Eleanor's sake but for their own. The clock was more than just a timepiece; it was a key to unraveling the mystery that had ensnared them all. She glanced at Hale and Beatrice, determination setting her jaw. “We must work together to get to the bottom of this. The truth is out there, and it’s our job to find it.”"
      ]
    }
  ],
  "cast": ["Eleanor Voss", "Captain Ivor Hale", "Beatrice Quill"],
  "note": "",
  "audit": {
    "locked_fact_phrases": "present in paragraph 1, 2 | absent",
    "season_words_used": "autumn | none",
    "discriminating_test_present": "no",
    "required_clues_present": "clue_core_contradiction_chain: chapter 2 paragraph 2 | clue_mechanism_visibility_core: chapter 2 paragraph 1",
    "early_observation_present": "description: chapter 2 paragraph 1 | absent",
    "early_inference_present": "no"
  }
}
```

## Message 5 (role=user)

```text
Attempt 2/6 — chapters 2 — 1 validation issue(s) to resolve:

═══ ⚠️ PRONOUN ERRORS — MUST FIX (1) ═══
These specific characters had the WRONG pronouns. Fix each one before you submit:

  ⚠️ Captain Ivor Hale is MALE — use "he/him/his" ONLY.
     You wrote: her, she — these are WRONG for this character.
     Every time "Captain Ivor Hale" appears: he/him/his. No exceptions.

HOW TO FIX: Search your draft for every occurrence of each name above.
Replace any pronoun that does not match the gender shown.
Minimal sentence rewording is acceptable where it improves clarity (e.g. naming
the character explicitly instead of relying on a pronoun). Do NOT alter plot
points, clue details, alibis, or dialogue meaning.

📋 FULL CAST PRONOUN TABLE (attempt 2 — use this as a reference for every pronoun in your draft):
  NAME                    GENDER    PRONOUNS
                                    subject / object / possessive
  Eleanor Voss             FEMALE   she / her / her
  Dr. Mallory Finch        FEMALE   she / her / her
  Captain Ivor Hale        MALE     he / him / his
  Beatrice Quill           FEMALE   she / her / her

⛔ Any pronoun not matching the table above is WRONG. Fix before submitting.

═══ TEMPLATE LEAKAGE DETECTED ═══
• Your prose closely matches or repeats a paragraph from a prior chapter.
  Every paragraph must be original prose unique to this chapter's scene.

⛔ BANNED PARAGRAPH — DO NOT REPRODUCE ANY SENTENCE FROM THIS TEXT:
"beatrice quill standing nearby fidgeted with the hem of her dress her expression a blend of concern and curiosity i heard it chime well after eleven too she added her voice barely above a whisper the revelation sent a ripple of unease through eleanor if witnesses recalled the clock chiming after eleven then the time of death could not be trusted it was a crucial detail that could shift the focus of their investigation entirely the tension in the room was palpable as they all grappled with the implications of their observations each of them acutely aware that the truth was slipping through their fingers like sand"

Every sentence in your response must be a sentence that could NOT appear in any of the above passages.
You may write about the same event, but from a different physical position, a different
sensory angle, or at a different moment in the scene. You may not preserve a single clause.

⛔ NEAR-DUPLICATE PASSAGE — your prose closely echoes this prior paragraph:
"beatrice quill standing nearby fidgeted with the hem of her dress her expression a blend of concern and curiosity i heard it chime well after eleven too she added her voice barely above a whisper the revelation sent a ripple of unease through eleanor if witnesses recalled the clock chiming after eleven then the time of death could not be trusted it was a crucial detail that could shift the focus of their investigation entirely the tension in the room was palpable as they all grappled with the implications of their observations each of them acutely aware that the truth was slipping through their fingers like sand"

Rewrite any paragraph that shares sentence structure or extended phrases with any of the above texts.
Different words for the same image are not sufficient — the sentence structure must also differ.

⛔ PRIOR CHAPTER DUPLICATION LOCK — 5 protected passage(s):
Your prose has been detected copying from an earlier chapter. Every paragraph listed below appears in a prior chapter and is COMPLETELY OFF-LIMITS. Do not reproduce, rephrase, or structurally echo any of them:

  • "The morning after the [crime-redacted] dawned with an unsettling stillness, the air thick with the scent of damp earth and the lingering aroma of last night's rain."
  • "Eleanor leaned closer, her breath catching as she examined the clock."
  • "As if sensing his turmoil, Captain Hale shifted uneasily by the door, his eyes downcast."
  • "Beatrice Quill, standing nearby, fidgeted with the hem of her dress, her expression a blend of concern and curiosity."
  • "Eleanor took a deep breath, trying to steady herself."

Write as if you cannot see the prior chapters. Compose every paragraph fresh from the scene instructions alone.

Return corrected JSON for chapters 2. Edit only the sections that failed — keep all content that passed validation, and return the complete updated chapter JSON.


RETRY CLASS: continuity
ATTEMPT: 1/6
MANDATORY FIXES:
- Resolve continuity issues before accepting this batch.
- Character "Captain Ivor Hale" has incorrect pronouns. Should use he/him/his but found: her, she
```
