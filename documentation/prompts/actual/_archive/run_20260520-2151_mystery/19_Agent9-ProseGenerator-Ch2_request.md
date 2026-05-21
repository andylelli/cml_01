# Actual Prompt Record

- Run ID: `mystery-1779313878864`
- Project ID: ``
- Timestamp: `2026-05-20T21:56:12.097Z`
- Agent: `Agent9-ProseGenerator-Ch2`
- Operation: `chat_request_full_prompt`
- Model: `GPT-4o-mini`
- Temperature: `0.42`
- Max Tokens: `4500`
- Attempt: `first`
- Prompt Hash: `1e8212d841f5cc70`

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
- MORAL COMPLEXITY REQUIREMENT: The mechanism of this crime carries a moral gray area: "The murderer acted out of desperation, seeking justice for a past wrong committed against them by the victim." — the culprit reveal and denouement MUST acknowledge this ambiguity. Do not let the ending feel clean or simple. Give the reader at least one moment of uncomfortable sympathy or moral doubt.


⚠️ AMATEUR DETECTIVE STORY: The investigator is a civilian with no official standing. The official police (if they appear) are unnamed background figures only — "a constable", "the sergeant", "an officer from the village". Do NOT give any police official a name or title+surname combination. There is no Inspector [Surname], no Constable [Surname], no Sergeant [Surname] in this story.


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

## Era: 1936-01
The winter of January 1936 brings a chill that seeps into the very bones of Little Middleton, where the opulence of Middleton Manor stands as a stark reminder of past glories amidst the struggles of the present. The Great Depression casts a long shadow over society, with economic strains palpable in the air as estate owners and staff navigate a world fraught with uncertainty. Amidst the oppressive overcast skies, the residents grapple with class tensions, where the wealthy cling to their status while those serving them face increasing resentment. The manor, once a haven of grandeur, now echoes with the whispers of discontent, as every creak of the floorboards and flicker of candlelight seems to signify the unraveling of old certainties. Formal gatherings become a façade for underlying anxieties, and every interaction is colored by the awareness of financial instability, creating a brewing storm of emotions that is bound to erupt.
Emotional register: A collective sense of unease and anxiety permeates society as individuals navigate the pressures of class distinctions amidst economic hardship.
Physical constraints: Limited access to transportation during winter weather | Short daylight hours leading to earlier evenings | Communications hampered by economic conditions and social status | The necessity of formal attire for social events restricting comfort
Current tensions (weave into background texture): Political unrest in Europe with the rise of fascist regimes | Economic impact of the Great Depression felt even in affluent households | Growing class disparities fueling resentment among the working class
Wartime context — Many men, including Captain Ivor Hale, have returned from service, shaping their roles in society.: The camaraderie forged in wartime contrasts sharply with the social hierarchies they now face. Absence effect: The absence of fallen comrades continues to haunt the survivors, creating a complex emotional landscape.

## Story Theme
In a world where financial desperation and jealousy intertwine, the quest for truth reveals the fragility of human relationships and the lengths one might go to protect their interests.

## Story Emotional Register
Dominant: The story unfolds with a tense and claustrophobic atmosphere, reflecting the emotional turmoil of its characters.

Arc:
As the evening settles over Middleton Manor, a palpable tension hangs in the air, thickening with each tick of the clock that soon marks the tragic discovery of Eleanor Voss's lifeless body. The guests, once alive with laughter, are now ensnared in confusion and dread as they grapple with the reality of a murder among them. The initial shock gives way to rising unease as the investigation unfolds, revealing a tapestry of hidden debts, jealousy, and the fragile facades that each character presents. As Beatrice Quill navigates her own emotional turmoil, she becomes a witness to the growing suspicions that swirl around Dr.

Mallory Finch, whose quiet demeanor belies a fierce intensity. Midway through the investigation, a crucial piece of evidence—a small timing mechanism—forces the characters to reevaluate their assumptions, shifting the focus onto the very clock that marks their fate. The stakes heighten as emotional tensions explode, with revelations that recolor past events, leading to a heart-pounding confrontation where trust is shattered, and true motives are laid bare. In the climax, the characters find themselves at a crossroads, each facing the consequences of their actions as the truth behind the murder is finally unveiled. The resolution arrives, not with the satisfaction of justice served, but with emotional costs that linger long after the truth is known, leaving each character to reckon with their choices and the depths of their desires.

## Emotional register at this point in the story
The story begins with a tense atmosphere as the guests are unaware of the impending tragedy.

## Character Portraits (appearance & era)

### Eleanor Voss
Eleanor Voss embodies the tension of a woman striving to maintain appearances in the face of financial ruin, her charming social façade masking a deep-seated desperation for security. As a socialite in a decaying manor, she experiences the harsh realities of class disparity, feeling the weight of her family's legacy as it teeters on the brink of scandal. Her struggles are intensified by the era's economic challenges, where the pressure to uphold a gilded lifestyle clashes with her hidden debts and the threat of exposure.
Era intersection: Eleanor's financial desperation is exacerbated by the Great Depression, forcing her to confront the fragility of her social standing.

### Captain Ivor Hale
Captain Ivor Hale represents the gruff loyalty of a war veteran struggling with jealousy and unrequited feelings amidst a backdrop of class tensions. His role as a protector of Eleanor signifies the complex emotional ties forged during wartime, contrasting sharply with the social hierarchies that dictate their lives. As he grapples with his feelings for Eleanor, Ivor's character reflects the struggles of many men returning to a society that often undervalues their sacrifices.
Era intersection: Ivor's loyalty is shaped by his war service, illustrating the emotional scars carried into peacetime amidst shifting social dynamics.

### Beatrice Quill
Beatrice Quill embodies the silent struggles of the lower class, her unrequited love for the victim highlighting the emotional turmoil faced by those serving the elite. As a maid in the grand manor, she navigates a world where her voice is often unheard, reflecting the class disparities of the time. Her character arc symbolizes the growing resentment and desire for recognition among those in subservient roles, set against the backdrop of the economic challenges of the era.
Era intersection: Beatrice's predicament illustrates the limited agency of women in service roles during a time when class resentments were on the rise.

## Character Voices

### Eleanor Voss (she/her/her)
Eleanor speaks with a refined elegance, often punctuating her sentences with gentle laughter, revealing her social sophistication.
[comfortable] Oh, darling, isn’t it just the most delightful day for a gathering? I always find such joy in the company of good friends.
[evasive] Well, you know how it is, one must keep appearances, even if the roses are wilting a bit too soon.
[stressed] I—I mean, it's all perfectly manageable, isn't it? Just a little bump in the road, nothing to worry about.
Humour: Eleanor often employs understatement to mask her deeper anxieties.

### Captain Ivor Hale (he/him/his)
Ivor's voice is blunt and straightforward, often punctuated by self-deprecating remarks that reveal his insecurities.
[comfortable] Well, I may be grumpy, but I suppose that's just the charm of age, eh? Keeps the young ones on their toes!
[evasive] It’s nothing, really. Just a bit of old war fatigue. Hardly worth mentioning.
[stressed] I worry about Eleanor—she deserves better than a grumpy old soldier like me.
Humour: Ivor's self-deprecating humor often masks his deeper feelings of jealousy.

### Beatrice Quill (she/her/her)
Beatrice speaks softly and hesitantly, her words often trailing off as she grapples with her insecurities.
[comfortable] Um, I think the roses in the garden are blooming beautifully this time of year, if I may say so.
[evasive] Oh, it’s nothing, really, just... just a little misunderstanding between friends, I suppose.
[stressed] I—I just wish someone would notice me, you know? I feel invisible sometimes.
Humour: Beatrice's humor is nearly nonexistent, reflecting her timid nature.

## Location Registers (scene framing guides)

The Library: The library, heavy with dust and secrets, feels suffocating as the weight of the crime hangs in the air, amplifying the tension among those gathered. Each shadow seems to whisper of the hidden truths that linger, waiting to be uncovered.. Camera angle: As a writer enters this space, they should feel the oppressive atmosphere, sensing the unspoken fears and unresolved conflicts that permeate the room.. Era: During the 1930s, the library's opulence contrasts sharply with the rising tensions outside.

The Drawing Room: The drawing room exudes a false sense of warmth, with laughter and polite conversation masking the underlying anxieties of its occupants. The flickering candlelight casts dancing shadows, hinting at the secrets that lie just beneath the surface.. Camera angle: Entering this space, a writer should capture the juxtaposition of elegance and unease, where every smile conceals a deeper concern.. Era: The formality of social gatherings in the 1930s amplifies the tension, as every interaction is steeped in unspoken expectations.

The Servants' Hall: In the servants' hall, a sense of camaraderie exists amidst the unspoken tension, where whispers of discontent mingle with the aroma of hearty meals. The modest setting contrasts sharply with the opulence of the manor, reflecting the emotional struggles of those who serve.. Camera angle: Writers should approach this space with an understanding of the underlying power dynamics, capturing the quiet resilience of those within.. Era: The 1930s economic strains are palpable here, as the staff navigate their roles in a world of growing class disparities.

## Humour guidance for this story position (opening)
Permission: forbidden
Rationale: The opening scene is meant to set a serious tone, focusing on the impending tragedy.

FAIR-PLAY AND INFERENCE CONTRACT:
- FAIR PLAY CLUE TIMING: Never combine clue discovery and detective deduction in the same chapter. If a clue is first revealed to the reader in chapter N, the detective may only analyze, deduce from, or act on that clue in chapter N+1 or later.
- FAIR PLAY INFORMATION PARITY: The reader must see all clues BEFORE the detective uses them in reasoning. If the detective performs a test or makes a deduction, every piece of evidence supporting that conclusion must have been shown to the reader in earlier chapters.
- FAIR PLAY REVELATION SPACING: In the discriminating test scene, the detective can ONLY use clues that were revealed to the reader at least 1 full chapter earlier. Never introduce new clues or withheld information during the test.
- FAIR PLAY CONFRONTATION: During the final confrontation/revelation, the detective cannot surprise the reader with facts. Every piece of evidence cited must have been visible to the reader in prior chapters.
- Never solve by withheld information. Keep reader-information parity with detective reasoning.
- False assumption in force: Eleanor's death must have occurred after the last clock strike.
- Hidden truth to progressively expose: The clock was tampered with to mislead the timeline.
- Inference path checkpoints to dramatize clearly (observation -> correction -> effect):
  - Step 1: obs: The clock shows ten minutes past eleven when Eleanor is discovered. | corr: The tampering of the clock creates a false timeline regarding Eleanor's death. | effect: Narrows suspect pool by implicating Dr. Mallory Finch due to her access to the clock.
  - Step 2: obs: Witnesses mention the unusual warmth of the room where Eleanor was found. | corr: If Eleanor was murdered earlier, the room would not be warm, suggesting a recent death. | effect: Eliminates Captain Ivor Hale as he was not near the body shortly before the discovery.
  - Step 3: obs: A small timing mechanism is discovered near the clock. | corr: The mechanism indicates that the clock was wound back deliberately. | effect: Confirms Dr. Mallory Finch's motive and means to tamper with the clock.
- Discriminating test method: trap
- Discriminating test design constraint: A staged comparison of the clock's timing and the timing mechanism proves the clock was tampered with, revealing Dr. Finch's guilt.
- Test must rely on already-shown clue IDs: clue_1, clue_2, clue_3, clue_4, clue_culprit_direct_dr_mallory_finch
- Fair-play rationale: Step 1: The clock's time (early) and witness discrepancies (mid) let the reader suspect tampering. Step 2: The warmth of the room narrows the timeline (mid), eliminating Hale. Step 3: The mechanism's discovery confirms Finch's premeditation (discriminating test).

## Character Reference

### Eleanor Voss (she/her — NEVER he/him)
Eleanor speaks with a refined elegance, often punctuating her sentences with gentle laughter
She has a tendency to underplay her worries, using light-hearted remarks to divert attention from her underlying anxieties.
Beneath her polished exterior, Eleanor wrestles with feelings of inadequacy and fear of failure. The weight of her financial troubles gnaws at her conscience, leaving her torn between maintaining appearances and confronting the reality of her situation.

### Captain Ivor Hale (he/him — NEVER she/her)
Ivor speaks in a blunt, straightforward manner, often punctuating his sentences with dry humor
He has a tendency to self-deprecate, using humor to deflect from his insecurities and to mask his deeper feelings of inadequacy.
Ivor is torn between his loyalty to Eleanor and his jealousy of the victim. This internal conflict leaves him feeling isolated, as he grapples with his desire to protect her while battling his own insecurities.

### Beatrice Quill (she/her — NEVER he/him)
Beatrice speaks in a soft, hesitant tone, often trailing off as if unsure of her own words
Her sentences are punctuated by long pauses, and she has a tendency to avoid eye contact, which adds to her timid persona.
Beatrice is caught in a whirlwind of emotions, torn between her love for the victim and the bitterness of his rejection. This internal conflict manifests as a struggle for self-identity and the fear of never being seen or valued.


## CHARACTER CONTRACTS (binding for this scene)
Each entry below constrains how this character must be written in this chapter.
These override generic style guidance when they conflict.

### Eleanor Voss[SHE]
Voice & mannerisms: Eleanor speaks with a refined elegance, often punctuating her sentences with gentle laughter. She has a tendency to underplay her worries, using light-hearted remarks to divert attention from her underlying anxieties.
Sample voice fragments (match this register and rhythm):
  [comfortable] "Oh, darling, isn’t it just the most delightful day for a gathering? I always find such joy in the company of good friends."
  [evasive] "Well, you know how it is, one must keep appearances, even if the roses are wilting a bit too soon."
Humour: understatement — deploy occasionally (level 0.4)
FORBIDDEN phrase (never write for Eleanor Voss): "the situation was extremely serious"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Fearing the loss of her beloved estate and the scandal that would ensue, Eleanor is driven to protect her family’s reputation at all costs. The thought of being exposed for her financial missteps fills her with dread, igniting a fierce determination to silence the threat posed by the victim." — do not surface in Act I.

### Captain Ivor Hale[HE]
Voice & mannerisms: Ivor speaks in a blunt, straightforward manner, often punctuating his sentences with dry humor. He has a tendency to self-deprecate, using humor to deflect from his insecurities and to mask his deeper feelings of inadequacy.
Sample voice fragments (match this register and rhythm):
  [comfortable] "Well, I may be grumpy, but I suppose that's just the charm of age, eh? Keeps the young ones on their toes!"
  [evasive] "It’s nothing, really. Just a bit of old war fatigue. Hardly worth mentioning."
Humour: self deprecating — deploy rarely (level 0.3)
FORBIDDEN phrase (never write for Captain Ivor Hale): "she knew with certainty she was right"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Ivor's conviction that the victim is unworthy of Eleanor's affection drives him to consider drastic measures, believing that removing the threat will restore harmony to their lives." — do not surface in Act I.

### Beatrice Quill[SHE]
Voice & mannerisms: Beatrice speaks in a soft, hesitant tone, often trailing off as if unsure of her own words. Her sentences are punctuated by long pauses, and she has a tendency to avoid eye contact, which adds to her timid persona.
Sample voice fragments (match this register and rhythm):
  [comfortable] "Um, I think the roses in the garden are blooming beautifully this time of year, if I may say so."
  [evasive] "Oh, it’s nothing, really, just... just a little misunderstanding between friends, I suppose."
Humour: deadpan — deploy rarely (level 0.2)
FORBIDDEN phrase (never write for Beatrice Quill): "he was utterly speechless"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "The pain of unrequited love has festered within Beatrice, leading her to harbor resentment towards the victim for his decision to marry someone else, a choice that has crushed her dreams." — do not surface in Act I.



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

Primary Location: Middleton Manor (Little Middleton, England)
Middleton Manor stands as a testament to faded opulence, a grand estate steeped in secrets and shadowed by the weight of its history.

Key Locations Available:
- The Library (interior): Crime scene
- The Drawing Room (interior): Gathering space
- The Servants' Hall (interior): Gathering space for staff

Atmosphere (tonal cue only — do NOT reproduce this phrase verbatim in prose; translate into scene-specific, character-observed sensory language): Tense, with an undercurrent of suspicion due to recent events
Weather: Overcast with occasional rain, typical for the season

Era markers: Petrol touring cars parked in the courtyard | Typewriters clacking in the study | Faded telegrams pinned to the notice board

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
  - Visual: Dust motes dancing in the dim light, Faded leather bindings on old tomes, A shattered glass lamp on the desk
  - Sounds: The rustle of pages turning, The echo of footsteps on the polished floor, The crackling of the empty hearth
  - Scents: Musty paper and leather, Cold ash lingering in the air, A hint of mildew from the damp
  - Touch: Worn leather armchair, Cool marble surface of the desk

The Drawing Room (interior):
  - Visual: Richly patterned rugs on polished wood floors, Gilded frames surrounding somber portraits, A grand chandelier hanging from the ceiling
  - Sounds: The soft murmur of conversation, The occasional clink of teacups, The distant sound of piano keys being played
  - Scents: Freshly brewed tea and scones, A hint of lavender from the potpourri, The faint scent of burning wood
  - Touch: Soft velvet upholstery of the sofas, The coolness of porcelain teacups

The Servants' Hall (interior):
  - Visual: Rough-hewn wooden beams overhead, Faded photographs on the walls, A cluttered sideboard with dishes
  - Sounds: The clatter of dishes being washed, Soft whispers among staff members, The crackle of the fireplace
  - Scents: The aroma of leftover stew, Wood smoke from the fire, A hint of linseed oil from furniture polish
  - Touch: The rough texture of the wooden table, Cool stone floor underfoot

⛔ REFERENCE DATA — DO NOT TRANSCRIBE VERBATIM: The above profiles are structural guides only. Generate original prose that evokes these qualities; do not reproduce the exact phrasing or sentence structure of the profile paragraphs.

SCENE OPENING RULE: When opening a scene in a new location, write what the POV character directly observes and physically senses at that moment — not a general description of the room's qualities. The reader must feel present, not briefed. Sensory details must be observed by the character, not stated as fact about the place.

SENSORY WRITING TECHNIQUES:
- Opening paragraphs: Lead with 2-3 sensory details to ground the scene
- Movement between locations: Note sensory changes (quiet study → noisy dining room)
- Emotional scenes: Use sensory details to rei
[truncated for prompt budget]

## Texture Pool
Draw on these as opportunities arise — you are not required to use them.

- The winter of January 1936 brings a chill that seeps into the very bones of Little Middleton, where the opulence of Middleton Manor stands as a stark reminder of past glories amidst the struggles of the present
- The Great Depression casts a long shadow over society, with economic strains palpable in the air as estate owners and staff navigate a world fraught with uncertainty
- Amidst the oppressive overcast skies, the residents grapple with class tensions, where the wealthy cling to their status while those serving them face increasing resentment
- The manor, once a haven of grandeur, now echoes with the whispers of discontent, as every creak of the floorboards and flicker of candlelight seems to signify the unraveling of old certainties
- Formal gatherings become a façade for underlying anxieties, and every interaction is colored by the awareness of financial instability, creating a brewing storm of emotions that is bound to erupt.

TEMPORAL CONTEXT:

This story takes place in January 1936 during winter.

Seasonal Atmosphere:
- Weather patterns: overcast with occasional rain, chilly winds, cloudy skies
- Daylight: Short days with limited sunlight; daylight wanes by four o'clock in the afternoon.
- Seasonal activities: hunting parties in the countryside, indoor games by the fireplace, winter ball at the estate
- Seasonal occasions: New Year's Day (January 1)
- Season: winter

Period Fashion (describe naturally):
- Men formal: tailored three-piece suits in dark wool, bow ties or silk cravats, double-breasted overcoats
- Men casual: tweed jackets with elbow patches, corduroy trousers, knitted sweaters
- Men accessories: flat caps, leather gloves, walking sticks
- Women formal: tea-length dresses with dropped waists, long-sleeved evening gowns, fur-trimmed coats
- Women casual: tweed skirts with matching blouses, knitted cardigans, day dresses in floral patterns
- Women accessories: cloche hats, beaded evening bags, pearls or simple gold jewelry

Cultural Context (reference naturally):
- Music/entertainment: 'I Can't Get Started' by Bunny Berigan, 'The Way You Look Tonight' by Fred Astaire, 'Pennies from Heaven' by Bing Crosby; Films: 'Modern Times' directed by Charlie Chaplin, 'The Great Ziegfeld'; Theatre: 'The Royal Family' by George S. Kaufman, 'The Green Pastures'; Radio: The BBC Home Service broadcasting news and entertainment, variety shows like The Crazy Gang
- Typical prices: Loaf of bread: four pence, A bottle of milk: three pence, A taxi fare across town: two shillings
- Current events: Political unrest in Europe with the rise of fascist regimes; Recent elections in the UK showing increasing polarization
- Literature: 'Gone with the Wind' by Margaret Mitchell | 'The Maltese Falcon' by Dashiell Hammett | 'Of Mice and Men' by John Steinbeck | [detective fiction] | [social realism] | [historical narratives]
- Technology: the electric refrigerator becoming common in households | development of the first jet engine | advancements in radio technology | typewriters in homes and offices | phonographs for music playback | early model radios for news and entertainment
- Daily life: attending social gatherings at the estate, participating in local hunts, enjoying tea and conversation by the fire
- Social rituals: formal dinner parties with multiple courses, afternoon teas served with pastries, seasonal balls and dances

Atmospheric Details:
The scent of damp earth and woodsmoke hangs in the air, as the rain patters softly against the manor's windows. A chill permeates the grand hall, where shadows dance under flickering candlelight, creating an eerie ambiance. The distant sound of a hunting horn echoes through the misty countryside, stirring tension and anticipation among the guests.

FASHION INTEGRATION TECHNIQUES:
- First appearance: Describe outfit to establish class/personality
- Accessories: Gloves, hats, pocket watches, jewelry reveal status
- Time-specific: Different outfits for different times of day
- Character traits: Fastidious dresser vs rumpled appearance
- Action integration: "She tugged at her glove" or "He adjusted his tie"
- Weather appropriate: Overcoats in winter, light linen in summer

CULTURAL TOUCHSTONE INTEGRATION:
- Casual conversation: "Did you hear that new jazz record?" or "I saw the latest Chaplin film"
- Background d
[truncated for prompt budget]

NON-NEGOTIABLE CHAPTER OBLIGATIONS — LOCKED EVIDENCE PHRASES (VERBATIM REQUIRED):
The following physical evidence values are absolute ground truth. Every time this chapter describes, mentions, or alludes to the relevant evidence — no matter how briefly — it MUST use the exact phrase shown below, character for character. NO paraphrase, approximation, rounding, or synonym is permitted.

FAILURE EXAMPLE: if the locked value is "at thirteen minutes to midnight" and you write "just before midnight" or "around midnight" — that is a HARD FAIL. You must write "at thirteen minutes to midnight". Equally, if the locked value is written in words, such as "ten minutes past eleven", and you convert it to figure-based clock notation — that is also a HARD FAIL. Words stay as words; figure forms are forbidden for word-phrased facts.

CRITICAL — WORD-PHRASED VALUES: If the canonical value is written out in words (e.g. a time like "ten minutes past eleven", or an amount like "forty minutes"), reproduce those exact words. DO NOT convert to figure-based time notation, twenty-four-hour format, or any other numeric shorthand. Correct: "ten minutes past eleven". WRONG: figure-based clock notation or numeric shorthand.

Locked facts:
  - The exact time shown on the stopped clock face: "ten minutes past eleven"
    ⛔ FORBIDDEN alternatives: "11:10", "11.10", "eleven ten", "eleven-ten", "eleven past ten", "quarter past eleven", "half past eleven" — the ONLY acceptable form is "ten minutes past eleven"
  - The exact amount the clock was wound back: "forty minutes"
  - The temperature recorded in the room during the murder: "eighty degrees Fahrenheit"
  - The distance from the clock to the garden where the body was found: "twenty feet"

If a locked fact has no relevance to this chapter, omit it. But the moment you reference the underlying evidence, only the exact phrase above is acceptable.

⛔ CLUES TO SURFACE IN THESE CHAPTERS — mandatory:
The following evidence MUST be clearly observable to an attentive reader. Do not bury it in atmosphere or passing dialogue. Each clue must be concrete, specific, and noticeable:

• [clue_core_contradiction_chain] The tampering of the clock creates a false timeline regarding Eleanor's death.
  Category: temporal | Criticality: essential | Supports inference step 1
  Points to: The timeline of Eleanor's death is unreliable due to clock tampering.

For each clue above: an attentive reader should be able to find, record, and later use it to reason toward the solution.

═══ NARRATIVE STATE (read-only — do not contradict) ═══

LOCKED FACTS — use verbatim whenever this evidence is described:
  • The exact time shown on the stopped clock face: "ten minutes past eleven"
  • The exact amount the clock was wound back: "forty minutes"
  • The temperature recorded in the room during the murder: "eighty degrees Fahrenheit"
  • The distance from the clock to the garden where the body was found: "twenty feet"

CHARACTER PRONOUNS — never deviate from these:
  • Eleanor Voss: she/her/her
  • Dr. Mallory Finch: she/her/her
  • Captain Ivor Hale: he/him/his
  • Beatrice Quill: she/her/her

CLUES ALREADY REVEALED TO READER: clue_mechanism_visibility_core — do not reveal these as new information.

INVESTIGATION LOG — WHAT IS ESTABLISHED (do not re-establish, do not repeat):
• Evidence in reader's hands: The clock shows ten minutes past eleven when Eleanor is discovered.
• Suspects still unresolved: Eleanor Voss[SHE], Captain Ivor Hale[HE], Beatrice Quill[SHE]
⚠ The story must move FORWARD from this log. Any beat already listed above is forbidden from repeating.

⚠ THIS CHAPTER'S REQUIRED ADVANCE (opening): Discover the body, confirm the victim, establish the scene. The victim is found dead. They do not speak, react, or gesture. This is their only physical appearance — in all subsequent chapters they exist only in past tense (memory, evidence, testimony).

CONTINUITY HANDOFF — previous chapter closing beat:
  • "Eleanor nodded slowly, still in shock. Beatrice could see the gears turning in her mind, the realization of the gravity of the situation beginning to sink in. 'I’ll gather the others,' Eleanor said, her voice barely above a whisper. 'But... what if they think..."
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
manor

✓ RULE: Continue using this location vocabulary. Maintain consistency with established setting type.
✓ Do NOT introduce new location types that contradict earlier chapters.

**Recent Chapter Summary (for narrative continuity):**
Chapter 1: Chapter 1: Discovery
  Events: Beatrice Quill stepped into the dimly lit room, the chill of the January morning clinging to her like a heavy cloak.

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
Known location profile anchors: Middleton Manor, The Library, The Drawing Room, The Servants' Hall, the scene
LOCATION NAME CAPITALISATION (HARD REQUIREMENT — validated):
All named locations in your prose MUST use the EXACT capitalisation from the CML profiles.
Canonical forms: "Middleton Manor", "The Library", "The Drawing Room", "The Servants' Hall", "the scene"
Writing a location in lowercase (e.g. "drawing room" instead of "Drawing Room") is a validated error. Every time you mention a named location, copy its capitalisation from the list above.
- Chapter 2: OPENING STYLE (HARD): Start the VERY FIRST SENTENCE with spoken dialogue — e.g. '"[words]," [Name] said/asked/replied/murmured.' The opening quote must be the first character on the line. Anchor opening in "the scene". HARD REQUIREMENT for the first 2 paragraphs: (a) include 2+ sensory words — choose from smell/scent/sound/echo/silence/creak/whisper/cold/warm/damp/rough/smooth/glow/shadow/flicker/dim — and (b) include 1+ atmosphere/time word — choose from rain/wind/fog/storm/mist/thunder/evening/morning/night/dawn/dusk/season/afternoon/midday/noon/midnight/twilight/sunrise/sunset/daylight/sunlight/overcast/cloudy/bright/dark. These are validated requirements, not style suggestions; missing them triggers a retry.

[⚠ INTERNAL QUALITY DIAGNOSTICS — DO NOT REPRODUCE ANY PART OF THIS SECTION IN YOUR STORY OUTPUT. These are private generator observations for your consideration only. Your narrative must read as if this section does not exist. Never include phrases from this block in character dialogue, narration, or description.]

PRIOR CHAPTER QUALITY OBSERVATIONS:
- Chapter 1 (score 97/100):
  Quality gaps noted: word density below preferred target (960/1000); scene grounding weakness
  Address in upcoming chapters: Increase chapter density with concrete investigation action and sensory-grounded beats; avoid recap-only padding. | Open next chapter with a named location anchor plus at least two sensory cues and one atmosphere marker.
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

PROMPT BUDGET SUMMARY: budget=32000 tokens; fixed=7102; context=10941; dropped=[none]; truncated=[location_profiles, temporal_context, pronoun_accuracy]

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

QUALITY GUIDELINES (strongly preferred):
1. Use only canonical cast names from CML. Do not invent titled placeholders like 'Detective Surname', 'Inspector Surname', 'a woman Surname', or 'a man Surname'.
2. Before the final reveal closes, include explicit suspect-elimination coverage: each non-culprit suspect is ruled out with concrete on-page evidence or confirmed alibi.
3. In the reveal sequence, include a complete culprit evidence chain using explicit reasoning connectors (because/therefore/proves).
4. Integrate at least two concrete era-grounded details per chapter from setting refinement signals: petrol touring cars on county roads | domestic wiring with frequent outages | typewriters standard in offices | party-line telephone exchanges common | telegrams sent via local offices | airmail services for urgent correspondence.
5. Respect setting movement/access constraints in scene action and alibis: Layout restricts movement to main halls and staircases | Access to certain rooms limited to staff only | Weather can impede outdoor investigation and evidence collection | Permissions required to enter private areas of the house | Daily routines dictate access to various rooms.
6. Sustain social coherence with this backdrop pressure: A mechanical clock-tampering incident during a tense family gathering at the manor reveals deep-seated class tensions and economic strain among the estate's residents amid the backdrop of the Great Depression.
7. Maintain continuity around these socially central cast anchors where relevant: Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill.
8. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Critical: Plot similarity 0.75 with 'The Mysterious Affair at Styles' (same mechanical method of death)
9. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Moderate: Setting similarity 0.90 with 'The Mysterious Affair at Styles' (same era and country manor setting)
10. STORY TO DATE ANTI-COPY RULE: The STORY TO DATE section below is provided for chronological and factual reference ONLY. You MUST NOT copy, lightly rephrase, or structurally echo any sentence or paragraph from prior chapters. Every sentence in this chapter must be original prose unique to this scene. Reusing even a clause from prior chapter text will cause this attempt to fail immediately.

CRITICAL PROSE REQUIREMENTS:

The CML specifies exact requirements for certain validation-critical scenes. You MUST include these elements at the specified positions.

**Discriminating Test Scene (Act 3, Scene 4):**
Required elements: Execute the discriminating test, Observe the culprit's reaction or result, Draw conclusion about guilt

**Suspect Clearance Scenes:**
- Captain Ivor Hale (Act 3, Scene 5): Proving he was away from the body before discovery.
  Clues: clue_2, clue_3
- Eleanor Voss (Act 3, Scene 5): Confirmed dead before the clock's tampering.
  Clues: clue_1, clue_3

**Culprit Revelation Scene (Act 3, Scene 6):**
Method: Confrontation with evidence

**Clue Placement for These Chapters:**
- clue_core_contradiction_chain must appear in Act 1, Scene 2 via Cross-check contradiction

**VALIDATION CONSEQUENCE:** If these requirements are not met exactly, story validation will fail and the entire generation will be rejected. Follow these specifications precisely.


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
  - STRUCTURAL ARCHETYPE — Chapter 2 must be: FIRST_CONTACT
      ✓ MUST contain: at least two suspect interviews
      ✗ MUST NOT contain: physical evidence discovery
  - Word count: Target 1250 words. Achieve this through plot events, dialogue exchanges, and physical investigation — not through atmospheric repetition or extended internal reflection. Each 200-word segment should contain at minimum one concrete story event (a discovery, a conversation exchange, a physical action or movement). Padding with atmosphere alone is not acceptable.
  - Opening: Begin with a character action, spoken line, or clock/time marker — never a location name or location-description phrase.
  - Scene is set in: the scene — reference it naturally within the paragraph, never as your opening phrase.
  - Opening atmosphere (MANDATORY — validator enforced): the first paragraph MUST contain at least one of: rain / wind / fog / storm / mist / thunder / evening / morning / night / dawn / dusk / season / afternoon / midday / noon / midnight / twilight / sunrise / sunset / daylight / sunlight / overcast / cloudy / bright / dark / grey / pale / cold / warm / chill / crisp / damp / drizzle / haze / lamplight / firelight. A chapter that omits all of these from its opening paragraph will be rejected.
  - Continuity bridge: in the first 120 words, visibly connect from the previous chapter's final beat. Carry forward one unresolved element (object, accusation, emotional pressure, or immediate physical action) from: "Eleanor nodded slowly, still in shock. Beatrice could see the gears turning in her mind, the realization of the gravity of the situation beginning to sink in. 'I’ll gather the others,' Eleanor said, her voice barely abov...".
  - CLUE OBLIGATIONS — mandatory prose elements (do NOT omit or bury):
    • The tampering of the clock creates a false timeline regarding Eleanor's death. [clue_core_contradiction_chain] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: The timeline of Eleanor's death is unreliable due to clock tampering.
      ↳ MANDATORY TWO-PARAGRAPH STRUCTURE (must appear in paragraphs 1 or 2 — no later):
         Paragraph 1: The POV character physically approaches or directly observes this evidence.
           The narration or dialogue explicitly states what is seen (use the exact locked phrase if one applies).
         Paragraph 2 (immediately following): The detective or POV character explicitly reasons
           about what this evidence implies — who it implicates, why it may be unreliable,
           or what inference it supports. This must be a separate full paragraph, not a sentence appended to Paragraph 1.
  - Tonal contrast: include at least one beat of relief or ironic counterpoint. Do not sustain maximum tension for every paragraph.
  - CLUE DISCLOSURE RULE (Stage 1/4):
    Characters may OBSERVE anomalies (wrong time, missing object, odd detail) but must NOT explain the mechanism, deduce the method, or name the culprit. Discovery and reaction only.
    WRONG: dialogue or narration that directly explains how the crime was committed before Stage 4.
    RIGHT: observation, physical reaction, and logical inference that leaves the mechanism just off-screen.
  - ALIBI LOCK: Dr. Mallory Finch's established alibi is "10:00 PM to 11:30 PM". Do NOT place Dr. Mallory Finch at any other location or in any other activity during the crime window. Any contradiction is a continuity error that triggers a retry.
  - TESTIMONY CONTINUITY: Dr. Mallory Finch has already made statements in earlier chapters. Any time, location, or claim attributed to Dr. Mallory Finch in THIS chapter must be consistent with those earlier statements. Do NOT introduce a new or different alibi claim — any contradiction is a continuity error.
- Locked fact phrase obligations:
  - If this batch mentions The exact time shown on the stopped clock face, write exactly: "ten minutes past eleven".
  - If this batch mentions The exact amount the clock was wound back, write exactly: "forty minutes".
  - If this batch mentions The temperature recorded in the room during the murder, write exactly: "eighty degrees Fahrenheit".
  - If this batch mentions The distance from the clock to the garden where the body was found, write exactly: "twenty feet".
- Seasonal vocabulary allow-list: winter, wintry, midwinter.
- Forbidden seasonal words: spring, summer, autumn.

FROZEN FACT STATE (DO NOT ALTER):
- Timeline anchor: January (winter).
- Month, season, weather, and time-of-year language in this batch must stay compatible with winter.
- Established timeline fact: 11:00 PM (clock strike)
- Established timeline fact: 11:10 PM (time of discovery)
- If referenced, use exact phrase: "ten minutes past eleven" (The exact time shown on the stopped clock face).
- If referenced, use exact phrase: "forty minutes" (The exact amount the clock was wound back).
- If referenced, use exact phrase: "eighty degrees Fahrenheit" (The temperature recorded in the room during the murder).
- If referenced, use exact phrase: "twenty feet" (The distance from the clock to the garden where the body was found).

STORY TO DATE (REFERENCE ONLY — DO NOT COPY VERBATIM):
- Full prior chapter text is provided below for continuity, factual consistency, and reference accuracy.
- Use this to keep character voice, chronology, clue state, and location continuity aligned with earlier chapters.
- Do not quote, copy, or paraphrase these paragraphs too closely; write fresh prose that remains consistent with them.

--- BEGIN PRIOR CHAPTER 1 ---
Title: Chapter 1: Discovery
Beatrice Quill stepped into the dimly lit room, the chill of the January morning clinging to her like a heavy cloak. The air was thick with an unsettling silence, broken only by the faint sound of her own footsteps echoing against the polished wooden floor. A soft drizzle tapped against the windowpanes, creating a rhythm that felt dissonant against the gravity of the scene before her. In the centre of the room, Eleanor Voss stood frozen, her gaze locked onto the clock, which ominously displayed the time as 'ten minutes past eleven'. Beatrice’s heart raced as she took in the sight of Eleanor, her usually vibrant demeanor now replaced by a pallor that spoke of shock and disbelief.

As Beatrice approached, she felt the weight of the moment pressing down on her. The clock's hands were a cruel reminder of the time when life had still thrummed within the manor. 'Eleanor,' Beatrice said softly, her voice barely above a whisper. 'What happened here?' Eleanor's eyes flickered towards Beatrice, a mix of fear and confusion swirling within them. 'I—I don't know,' she stammered, her voice trembling. 'The clock struck just before we found her. It must be accurate.' Beatrice's mind raced; the clock's time was crucial for establishing the timeline of events. It was imperative to understand how long Eleanor had been lying there, lifeless, and what had transpired in those moments leading up to the discovery.

The room felt suffocating, the air thick with unspoken dread. Beatrice's gaze darted around, taking in the details that might provide answers. The body lay sprawled on the floor, an unsettling stillness enveloping it. A sense of urgency gripped Beatrice as she knelt beside Eleanor, her heart pounding in her chest. The clock, now a focal point of her investigation, seemed to mock her with its silent ticking. 'If the clock shows ten minutes past eleven, then...,' she murmured to herself, piecing together the fragments of the situation. The implications of this timing weighed heavily on her mind, and she knew she had to act quickly to unravel the mystery that had unfolded within these walls.

Eleanor's breath hitched as she finally broke the silence, her voice quavering. 'I was just in the other room when I heard a noise. I thought it was just the wind, but... I came back in here and found her like this.' Her words were punctuated by a shuddering breath, the reality of the situation crashing down upon her. Beatrice felt a pang of sympathy for the woman before her, yet she could not afford to let emotions cloud her judgment. The clock had struck, and now they were left to piece together the fragments of a shattered life. 'We need to call for help,' Beatrice said, her voice steady despite the turmoil within. 'But first, we must ensure that nothing is disturbed.'

Eleanor nodded, her eyes wide with fear. Beatrice's mind raced as she considered the implications of the scene. With every passing moment, the mystery deepened. The clock, the body, and the chilling atmosphere of the room all pointed to a locked room mystery that demanded her attention. She could feel the weight of the investigation settling upon her shoulders, and she steeled herself for the task ahead. Every suspect had access to the victim, and now it was up to her to unravel the truth hidden within these walls. As she stood, Beatrice's resolve hardened; she would not rest until the truth was uncovered, no matter how dark it might be.

The tension in the room was palpable as Beatrice took a step back, her eyes flicking to the clock once more. It was a cruel twist of fate that time had betrayed them in such a manner. 'Eleanor,' Beatrice said, her tone firm yet compassionate, 'I need you to think carefully. Did you notice anything unusual before you found her? Any strange sounds, or perhaps someone lingering in the shadows?' Eleanor shook her head, her expression a mixture of fear and confusion. 'No, nothing. Just the clock... and then silence.' Beatrice's mind whirled; the clock's timing could not be ignored. If it was indeed accurate, then it would narrow down the timeline significantly. But what if it had been tampered with? The thought sent a shiver down her spine.

As she began to survey the room more closely, Beatrice noted the warmth of the air, a stark contrast to the chill outside. It felt almost oppressive, as if the very walls were closing in on them. 'It’s strange,' she mused aloud, 'the room is unusually warm. If Eleanor had been dead for long, it would not feel like this.' A flicker of hope ignited within her; perhaps this detail could help establish a clearer timeline. She glanced back at Eleanor, who was still staring at the clock, her expression a mixture of disbelief and horror. 'We need to get to the bottom of this,' Beatrice said, her voice steady as she began to formulate a plan. 'I will need to speak with everyone who was here last night.'

Eleanor nodded slowly, still in shock. Beatrice could see the gears turning in her mind, the realization of the gravity of the situation beginning to sink in. 'I’ll gather the others,' Eleanor said, her voice barely above a whisper. 'But... what if they think I did it?' The fear in her eyes was palpable, and Beatrice placed a reassuring hand on her shoulder. 'We’ll find the truth, Eleanor. Just trust me.' As Eleanor moved to gather the others, Beatrice felt a surge of determination. She would not let fear dictate the course of this investigation. With the clock's hands frozen in time, she knew that every second counted in uncovering the truth behind Eleanor's tragic fate.
--- END PRIOR CHAPTER 1 ---

[SCENE COMPLETENESS CONTRACTS — MANDATORY. Each contract below lists what you MUST enact in that chapter. Do not summarise or mention these labels in the prose — enact them organically.]
Chapter 2 (Act 1) completeness contract:
  PIVOT ELEMENT (MANDATORY — write this into the prose, shown not told): "Captain Hale's insistence about his alibi."
  FACT ESTABLISHED (MANDATORY — reader must know this by chapter end): "Establishes a contradiction in timing that raises suspicion about Hale's alibi."
  RED HERRING (MANDATORY — seed naturally, not flagged as false): [rh_2] Captain Hale claims he was in the garden just before the discovery, leading others to believe he was innocent.

# Case Overview
Title: The Clock That Struck Too Late
Era: 1930s
Setting: Little Middleton
Crime: murder (mechanical tampering)
Culprit: Dr. Mallory Finch
False assumption: Eleanor's death must have occurred after the last clock strike.
Cast: Eleanor Voss (she/her), Dr. Mallory Finch (she/her), Captain Ivor Hale (he/him), Beatrice Quill (she/her)

Setting Lock: Keep all scenes and descriptions consistent with the stated setting (Little Middleton). Do not introduce a different location type. Do not invent an alternative estate name. The only permitted name for this property is "Little Middleton" — any other estate name (e.g., "Caldwell Manor", "Ashwood Hall", or any invented proper name) is a continuity error that will be caught and rejected.

⛔ PRONOUN LOCK (verify every sentence before writing):
• Eleanor Voss — she/her/her (NEVER he/him)
• Dr. Mallory Finch — she/her/her (NEVER he/him)
• Captain Ivor Hale — he/him/his (NEVER she/her)
• Beatrice Quill — she/her/her (NEVER he/him)

Outline scenes:
[
  {
    "sceneNumber": 2,
    "act": 1,
    "title": "Initial Investigation",
    "setting": {
      "location": "the scene",
      "timeOfDay": "Late morning after the discovery",
      "atmosphere": "Tense, with whispers and speculation among the household staff"
    },
    "characters": [
      "Beatrice Quill",
      "Eleanor Voss",
      "Captain Ivor Hale"
    ],
    "purpose": "Establish initial clues and witness dynamics",
    "cluesRevealed": [
      "clue_core_contradiction_chain"
    ],
    "dramaticElements": {
      "conflict": "Tension rises as suspects begin to clash over their stories.",
      "tension": "Captain Hale insists he was nowhere near the victim before the discovery.",
      "microMomentBeats": [
        "Beatrice's heart races as she senses the underlying tension between Eleanor and Hale."
      ]
    },
    "summary": "Beatrice begins her investigation, questioning Eleanor and Captain Hale about their whereabouts. As they recount their stories, a contradiction arises regarding the clock's timing, leading Beatrice to suspect foul play.",
    "estimatedWordCount": 1800,
    "pivotElement": "Captain Hale's insistence about his alibi.",
    "factEstablished": "Establishes a contradiction in timing that raises suspicion about Hale's alibi.",
    "permittedBehavioursByAct": [
      {
        "characterName": "Eleanor Voss",
        "behaviour": "normal social behaviour; grief or confusion if appropriate"
      },
      {
        "characterName": "Captain Ivor Hale",
        "behaviour": "normal social behaviour; no guilt signals permitted"
      }
    ],
    "redHerringPlacement": {
      "redHerringId": "rh_2",
      "placementDetail": "Captain Hale claims he was in the garden just before the discovery, leading others to believe he was innocent."
    },
    "emotionalRegister": "A sense of confusion and dread emerges as the guests confront the reality of Eleanor's murder.",
    "dominantCharacterNote": {
      "name": "Eleanor Voss",
      "voiceRegister": "Eleanor speaks with a refined elegance, often punctuating her sentences with gentle laughter, revealing her social sophistication."
    },
    "humourGuidance": {
      "permission": "forbidden"
    },
    "eraTextureNote": "Limited access to transportation during winter weather; Short daylight hours leading to earlier evenings; Communications hampered by economic conditions and social status; The necessity of formal attire for social events restricting comfort; Surrounding woodlands making travel difficult in the harsh winter",
    "locationRegisterNote": ""
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
□ Chapter 2: "The tampering of the clock creates a false timeline regarding Eleanor's death." is placed in the first 25% of the chapter, followed by an explicit inference or suspicion paragraph.
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
      "title": "Chapter 2: Initial Investigation",
      "summary": "Beatrice Quill begins her investigation into Eleanor's murder, questioning both Eleanor and Captain Hale. As tensions rise, contradictions regarding the clock's timing emerge, leading to suspicions about Hale's alibi.",
      "paragraphs": [
        "‘I’ll gather the others,’ Eleanor said, her voice barely above a whisper. The chill of the January morning hung in the air, a stark contrast to the warmth of the room where Eleanor had just discovered the body. Beatrice Quill felt the tension thickening around them, the weight of unspoken fears pressing down like the damp mist outside. She could sense the urgency in Eleanor's demeanor as the woman moved to gather the others, her steps hesitant and fraught with dread. The clock loomed ominously on the wall, its hands frozen at 'ten minutes past eleven', a cruel reminder of the moment when life had slipped away from the victim. The room felt heavy with silence, the only sound the distant patter of rain against the window, echoing the turmoil in Beatrice's heart.",
        "As Beatrice stood by the clock, she couldn't shake the feeling that something was amiss. The air was unusually warm, a stark contradiction to the chill outside, and it gnawed at her instincts. If Eleanor had been dead for any length of time, the room would not feel like this. The clock's time was crucial; it had struck just before they found her, and yet, a nagging doubt crept into Beatrice's mind. Had the clock been tampered with? The thought sent a shiver down her spine. She took a deep breath, steeling herself for the task ahead. ‘We need to speak with everyone who was here last night,’ she murmured to herself, determination replacing her initial shock.",
        "The drawing room felt suffocating as Beatrice awaited the arrival of the other guests. She could hear the soft rustle of fabric as Eleanor moved through the manor, gathering the others. The tension in the air was palpable, and Beatrice's heart raced as she sensed the underlying tension between Eleanor and Captain Hale. When they finally entered the room, Beatrice's gaze flicked between them, noting the way Eleanor's hands trembled slightly while Hale's expression remained stoic, as if he were bracing himself for an impending storm.",
        "‘Captain Hale,’ Beatrice began, her voice steady despite the turmoil within, ‘I need to understand your whereabouts last night. Can you recount your movements for me?’ Hale met her gaze, his brow furrowing slightly as he considered her question. ‘I was in the garden just before the discovery,’ he replied, his tone firm. ‘I stepped outside for some fresh air, you know how it gets in these old houses. I came back in shortly after the clock struck.’ Beatrice noted the way he emphasized the clock, as if trying to anchor his alibi with its chime. But something about his story felt off, and she couldn't help but wonder how long he had truly been outside.",
        "‘And you didn’t see anyone else while you were out there?’ Beatrice pressed, her instincts urging her to dig deeper. Hale shook his head, the flicker of uncertainty in his eyes betraying his confidence. ‘No, it was quiet. Just the wind and the rain. I didn’t think anything of it at the time.’ Beatrice felt a knot tighten in her stomach. His insistence about his alibi seemed rehearsed, almost too convenient given the circumstances. She glanced at Eleanor, who was watching Hale with a mixture of confusion and fear, as if she were trying to decipher the truth hidden behind his words.",
        "‘Eleanor,’ Beatrice turned her attention back to the woman, ‘can you tell me what you were doing when you heard the noise that led you back into the room?’ Eleanor's gaze dropped to the floor, her fingers twisting nervously at the hem of her dress. ‘I was... I was in the sitting room, just reading. I thought I heard something, but I didn’t think much of it at first. When I came back in, I found her...’ Her voice trailed off, and Beatrice could see the pain etched on her face. It was clear that the shock of the situation was still settling in.",
        "‘And you didn’t see Captain Hale when you returned?’ Beatrice asked, her eyes narrowing slightly. Eleanor shook her head, her expression one of bewilderment. ‘No, I didn’t see him until after I found her. I thought he was still outside.’ Beatrice felt her heart race as the pieces began to fall into place. The timeline was beginning to unravel, and the implications were staggering. If Hale had indeed been in the garden just before the discovery, how could he account for the warmth of the room? It was as if time itself had been manipulated, and she needed to get to the bottom of it.",
        "‘We need to consider the possibility that the clock may not be accurate,’ Beatrice said, her voice firm. ‘If it shows 'ten minutes past eleven' when Eleanor was discovered, then we must question what really happened in the time leading up to that moment.’ The tension in the room thickened as both Eleanor and Hale exchanged glances, their expressions revealing the flicker of doubt that had begun to settle between them. Beatrice felt the weight of their uncertainty, and she knew that the investigation was only just beginning."
      ]
    }
  ],
  "cast": ["Eleanor Voss", "Dr. Mallory Finch", "Captain Ivor Hale", "Beatrice Quill"],
  "note": "",
  "audit": {
    "locked_fact_phrases": "present in paragraph 1 | absent",
    "season_words_used": "winter | none",
    "discriminating_test_present": "no",
    "required_clues_present": "clue_core_contradiction_chain: chapter 2 paragraph 1 | absent",
    "early_observation_present": "description: chapter 2 paragraph 1 (first 25%) | yes",
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
     You wrote: she, her — these are WRONG for this character.
     Every time "Captain Ivor Hale" appears: he/him/his. No exceptions.
     Exact sentences to fix:
       → "The tension in the air was palpable, and Beatrice's heart raced as she sensed the underlying tension between Eleanor and Captain Hale."
       → "‘Captain Hale,’ Beatrice began, her voice steady despite the turmoil within, ‘I need to understand your whereabouts last night."
       → "She glanced at Eleanor, who was watching Hale with a mixture of confusion and fear, as if he were trying to decipher the truth hidden behind his words."

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

Return corrected JSON for chapters 2. Edit only the sections that failed — keep all content that passed validation, and return the complete updated chapter JSON.


RETRY CLASS: continuity
ATTEMPT: 1/6
MANDATORY FIXES:
- Resolve continuity issues before accepting this batch.
- Character "Captain Ivor Hale" has incorrect pronouns. Should use he/him/his but found: she, her
```
