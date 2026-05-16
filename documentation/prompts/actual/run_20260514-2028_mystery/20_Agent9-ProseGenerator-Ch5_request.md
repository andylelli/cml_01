# Actual Prompt Record

- Run ID: `mystery-1778790488020`
- Project ID: ``
- Timestamp: `2026-05-14T20:32:51.442Z`
- Agent: `Agent9-ProseGenerator-Ch5`
- Operation: `chat_request_full_prompt`
- Model: `GPT-4o-mini`
- Temperature: `0.42`
- Max Tokens: `4500`
- Attempt: `first`
- Prompt Hash: `48af043385745b12`

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
- MORAL COMPLEXITY REQUIREMENT: The mechanism of this crime carries a moral gray area: "The culprit, driven by a desperate need to protect a loved one, invokes a sense of sympathy despite their heinous act." — the culprit reveal and denouement MUST acknowledge this ambiguity. Do not let the ending feel clean or simple. Give the reader at least one moment of uncomfortable sympathy or moral doubt.


⚠️ AMATEUR DETECTIVE STORY: The investigator is a civilian with no official standing. The official police (if they appear) are unnamed background figures only — "a constable", "the sergeant", "an officer from the village". Do NOT give any police official a name or title+surname combination. There is no Inspector [Surname], no Constable [Surname], no Sergeant [Surname] in this story.

PRONOUN ACCURACY — MANDATORY CONTINUITY CONTRACT

The following pronouns are locked facts, on the same level as character names
and hard-logic device values. Using the wrong pronoun is a continuity error,
not a style choice.

Canonical pronoun table (subject / object / possessive / reflexive):
  • Eleanor Voss: she/her/her/herself
  • Dr. Mallory Finch: she/her/her/herself
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

## Era: 1931-11
Life in November 1931 unfolds against the backdrop of a damp and chilly English autumn, where overcast skies and intermittent rain create a subdued atmosphere. The lingering effects of the Great Depression are palpable, as many families struggle to make ends meet, and social gatherings become charged with the weight of class tensions and economic despair. The aristocracy, once secure in their privilege, now finds their status challenged by the realities of a crumbling economy. The scent of rain-soaked earth mingles with the aroma of smoke from chimneys, creating a somber reminder of the hardships faced by many. Short days lead to early twilights, and the sound of rain pattering against windows fills the air, echoing the underlying discord among society's tiers. As the holiday season approaches, the mood shifts from festive to foreboding, with conversations about financial stability overshadowing the usual merriment.
Emotional register: A collective sense of unease permeates daily life, as uncertainty and desperation loom large.
Physical constraints: Limited transportation options due to economic hardship. | Restricted access to communication technologies, such as telephones. | Weather conditions hindering outdoor activities and gatherings.
Current tensions (weave into background texture): The economic ramifications of the Great Depression, leading to high unemployment rates. | Class disparity exacerbated by rising tensions between the wealthy and the working class. | Political unrest, with increasing support for extremist ideologies.
Wartime context — N/A: The societal fabric is frayed, with many returning veterans struggling to reintegrate into a changed world. Absence effect: Absent fathers and brothers create a palpable void in family dynamics, intensifying feelings of loss and instability.

## Story Theme
In a world where class divides are stark and personal ambitions run deep, the pursuit of truth often collides with the facades we create to protect ourselves.

## Story Emotional Register
Dominant: The emotional journey traverses from tension and foreboding to resolution and reflection.

Arc:
As the grand birthday celebration unfolds at Little Middleton Manor, the atmosphere is thick with anticipation and underlying tension. Guests mingle, unaware of the storm brewing beneath the surface, until the shocking discovery of Dr. Mallory Finch's lifeless body sends shockwaves through the gathering. Detective Eleanor Voss, respected yet grappling with her own biases, steps into the fray, determined to uncover the truth despite the mounting pressure and the chilling reality of the murder.

The initial investigation reveals the clock's tampered time, drawing attention to the unreliable nature of appearances and the chaos that lurks beneath the elegant facade. As Eleanor delves deeper, she confronts her own class struggles and the emotional toll of the case, leading to a pivotal revelation that shifts her perspective and the direction of the investigation. The gradual uncovering of secrets exposes the vulnerabilities and ambitions of the suspects, each entwined in their own web of motives. In the climactic moments, the tension reaches its peak as Eleanor confronts the real culprit, forcing the characters to reckon with the consequences of their choices. The resolution sees Eleanor coming to terms with her personal demons and the impact of the crime on the lives of all involved, leaving a lingering sense of unease and reflection in the wake of the truth.

## Emotional register at this point in the story
A pivotal revelation shifts the direction of the investigation.

## Character Portraits (appearance & era)

### Eleanor Voss
Eleanor Voss navigates the complexities of high society amid the economic strain of the Great Depression. Her charm serves as a vital asset, masking her hidden gambling addiction that threatens her reputation. The rigid class structure and the evolving societal landscape weigh heavily on her, as she grapples with the need to maintain her social standing while seeking the truth behind the murder at the manor. This tension between her public persona and private struggles reflects the broader societal anxieties of the time.
Era intersection: Her hidden struggles echo the collective uncertainty faced by many in the upper class as their traditional roles come under scrutiny.

### Dr. Mallory Finch
Dr. Mallory Finch embodies the pressures of a profession under threat as the Great Depression exacerbates class divides in healthcare. Her ambition has pushed her into morally gray areas, creating a precarious situation where her reputation hangs by a thread. The societal expectations for medical professionals in this era collide with her private secrets, reflecting the increasing scrutiny and moral dilemmas faced by individuals in positions of authority during a time of crisis.
Era intersection: Her struggles highlight the ethical conflicts that arise as societal standards shift in response to economic pressures.

### Captain Ivor Hale
Captain Ivor Hale, a relic of a bygone era, grapples with feelings of resentment as modernity challenges the values he holds dear. His military background offers him a sense of identity, yet the changing social landscape and the rise of new ideologies leave him feeling adrift. The stark class divisions and the economic turmoil of the 1930s amplify his internal conflict, as he navigates a world that seems to disregard the principles he fought to uphold.
Era intersection: His character serves as a reflection of the generational tensions that arise during periods of societal upheaval.

## Character Voices

### Eleanor Voss (she/her/her)
Eleanor's voice carries a refined grace, often laced with a playful undertone that belies her inner turmoil.
[comfortable] Isn't it delightful to gather like this, despite the weather? It makes for cozy conversations.
[evasive] Oh, I wouldn't worry too much about the clock; it has its quirks, as we all do.
[stressed] I can't let this scandal ruin everything I've worked for; I must find the truth before it's too late.
Humour: Her understated wit often adds a layer of charm to her conversations, though it's tinged with anxiety.

### Dr. Mallory Finch (she/her/her)
Dr. Finch speaks with a clinical precision, her voice betraying her underlying tension.
[comfortable] The advancements in women's health are truly remarkable; we are on the cusp of change.
[evasive] Those experiments were for the greater good, you see; sometimes sacrifices must be made.
[stressed] If anyone uncovers my past... I can't let it come to that; I will fight to protect my work!
Humour: Her dry wit emerges in moments of discomfort, revealing the complexities of her character.

### Captain Ivor Hale (he/him/his)
Captain Hale's gravelly tone carries the weight of his past, often punctuated by sardonic observations.
[comfortable] Back in my day, we knew how to stand up for our values, not cower before the likes of them.
[evasive] Oh, the youth today... they’ll never understand the sacrifices we've made.
[stressed] This world is changing too fast; I fear for what it means for our future!
Humour: His sardonic remarks often mask a deeper discontent with the changing social landscape.

## Location Registers (scene framing guides)

Drawing Room: The drawing room exudes an air of elegance and tension, where laughter mingles with whispers of discontent, and every glance carries the weight of hidden truths.. Camera angle: As a writer enters, the emotional stakes rise, inviting them to explore the interplay between social grace and underlying discord.. Era: The room's luxurious decor reflects the fading glory of the aristocracy against the harsh realities of the Great Depression.

Library: The library offers a sanctuary filled with the scent of old books and secrets waiting to be uncovered, where the quiet rustle of pages turning echoes the tension of hidden motives.. Camera angle: Entering this room, a writer senses the weight of history pressing down on those who dare to explore its depths.. Era: This space becomes a battleground for conflicting ambitions in a time when knowledge is power.

Kitchen: The kitchen pulses with life and camaraderie, where the aroma of freshly baked bread mingles with laughter and gossip, yet an undercurrent of tension stirs amid the staff's interactions.. Camera angle: As a writer steps into this bustling space, they feel the warmth and joy of shared labor, contrasted with the looming shadows of unspoken class struggles.. Era: Here, the realities of class divisions are starkly visible, highlighting the disparities between the lives of the hosts and their servants.

Formal Gardens: The formal gardens are a deceptive paradise, where vibrant blooms and serene fountains mask the tensions brewing within the manor, inviting both contemplation and secrets.. Camera angle: The writer entering this space is drawn into a tranquil facade that belies the turmoil beneath, urging them to uncover the mysteries hidden among the flowers.. Era: In this setting, the beauty of nature contrasts sharply with the harsh realities of the era, becoming a metaphor for hidden truths.

## Humour guidance for this story position (mid)
Permission: permitted
Characters who may be funny: Beatrice Quill
Permitted forms: blunt
Rationale: Beatrice's bluntness can provide comic relief amidst the investigation's seriousness.

## Character Pressure
Dr. Mallory Finch is approaching a point of breakdown. Stress and strain should be accumulating visibly — through behaviour, not statement. No confrontation yet.

## Reveal Groundwork (texture — do not explain, only plant)
- Plant one subtle observable beat related to: "The discovery of the clock's tampering, previously dismissed as a trivial detail, now illuminates the true timeline of events, casting doubt on the initial assumptions about the murder". Do not explain significance yet.
- Plant one subtle observable beat related to: "Beatrice Quill's nervous behavior around the clock, once seen as innocent, now reveals her deeper involvement in the crime". Do not explain significance yet.
- Plant one subtle observable beat related to: "Eleanor Voss's struggle with her biases throughout the investigation takes on new meaning as her personal stakes become intertwined with the truth she seeks to uncover". Do not explain significance yet.

FAIR-PLAY AND INFERENCE CONTRACT (from CML logic):
- False assumption in force: The murder must have occurred exactly when the clock indicated.
- Hidden truth to progressively expose: The true time of death was manipulated by tampering with the clock.
- Inference path checkpoints to dramatize clearly (observation -> correction -> effect):
  - Step 1: obs: The clock shows 8:20 PM when checked after the murder. | corr: This indicates that the time of death is not accurately represented. | effect: Narrows the time of death to before 8:20 PM.
  - Step 2: obs: Guests recall hearing the clock strike at peculiar intervals. | corr: This suggests the clock's mechanism may be unreliable. | effect: Eliminates the reliability of the clock as a time reference.
  - Step 3: obs: A scratch is found on the clock's winding key. | corr: This implies tampering occurred prior to the murder. | effect: Narrows the suspect pool to those who had access to the clock.
- Discriminating test method: trap
- Discriminating test design constraint: A controlled demonstration of the clock's tampering using the scratch evidence.
- Test must rely on already-shown clue IDs: clue_1, clue_2, clue_3, clue_8, clue_4, clue_fp_contradiction_step_3
- Fair-play rationale: Step 1: The clock time (8:20 PM) and witness statements (last sighting of Dr. Finch) establish a false timeline. Step 2: Guest testimonies about the clock's striking confirm its unreliability. Step 3: The scratch on the winding key indicates tampering, isolating Beatrice Quill as the culprit in the trap.
- Never solve by withheld information. Keep reader-information parity with detective reasoning.

## Character Reference

### Eleanor Voss
Eleanor speaks with a refined cadence, often punctuating her observations with a soft chuckle
She has a penchant for elegant phrasing, yet when pressed, she slips into a more conversational tone, revealing a warmth that draws others in.
Eleanor wrestles with the tension between her public persona and her private struggles. The guilt of her gambling addiction shadows her every interaction, leaving her torn between maintaining her image and confronting her flaws.

### Dr. Mallory Finch
Finch speaks with a clinical precision, often peppering her dialogue with medical jargon that can be both enlightening and intimidating
She has a tendency to pause for emphasis, her words laced with a sharpness that reflects her intellect.
Dr. Finch grapples with a profound moral struggle, torn between her ambition and the ethical responsibility she knows she should uphold. Guilt gnaws at her, but the fear of losing everything she has built drives her to desperate measures.

### Captain Ivor Hale
Captain Hale speaks with a gravelly tone, his sentences often laced with a dry sarcasm
He has a tendency to punctuate his points with a raised eyebrow, and his speech carries a rhythm reminiscent of the sea, with pauses that give weight to his words.
Captain Hale is caught in a web of conflicting emotions, torn between his deep-rooted values and the undeniable changes in society. The resentment he harbors leads to a fear of losing his sense of purpose in a world that no longer seems to value his ideals.


## CHARACTER CONTRACTS (binding for this scene)
Each entry below constrains how this character must be written in this chapter.
These override generic style guidance when they conflict.

### Eleanor Voss
Voice & mannerisms: Eleanor speaks with a refined cadence, often punctuating her observations with a soft chuckle. She has a penchant for elegant phrasing, yet when pressed, she slips into a more conversational tone, revealing a warmth that draws others in.
Sample voice fragments (match this register and rhythm):
  [comfortable] "Isn't it delightful to gather like this, despite the weather? It makes for cozy conversations."
  [evasive] "Oh, I wouldn't worry too much about the clock; it has its quirks, as we all do."
Humour: understatement — deploy occasionally (level 0.5)
FORBIDDEN phrase (never write for Eleanor Voss): "the situation was extremely serious"
Act 2 behaviour contract: May show unease, evasion, or mild defensiveness when questioned. One behavioural tell is permitted. Internal conflict emerging: "Eleanor wrestles with the tension between her public persona and her private struggles. The guilt of her gambling addiction shadows her every interaction, leaving her torn between maintaining her image and confronting her flaws."

### Dr. Mallory Finch
Voice & mannerisms: Dr. Finch speaks with a clinical precision, often peppering her dialogue with medical jargon that can be both enlightening and intimidating. She has a tendency to pause for emphasis, her words laced with a sharpness that reflects her intellect.
Sample voice fragments (match this register and rhythm):
  [comfortable] "The advancements in women's health are truly remarkable; we are on the cusp of change."
  [evasive] "Those experiments were for the greater good, you see; sometimes sacrifices must be made."
Humour: dry wit — deploy occasionally (level 0.4)
FORBIDDEN phrase (never write for Dr. Mallory Finch): "a surge of determination washed over her"
Act 2 behaviour contract: May show unease, evasion, or mild defensiveness when questioned. One behavioural tell is permitted. Internal conflict emerging: "Dr. Finch grapples with a profound moral struggle, torn between her ambition and the ethical responsibility she knows she should uphold. Guilt gnaws at her, but the fear of losing everything she has built drives her to desperate measures."

### Captain Ivor Hale
Voice & mannerisms: Captain Hale speaks with a gravelly tone, his sentences often laced with a dry sarcasm. He has a tendency to punctuate his points with a raised eyebrow, and his speech carries a rhythm reminiscent of the sea, with pauses that give weight to his words.
Sample voice fragments (match this register and rhythm):
  [comfortable] "Back in my day, we knew how to stand up for our values, not cower before the likes of them."
  [evasive] "Oh, the youth today... they’ll never understand the sacrifices we've made."
Humour: sardonic — deploy rarely (level 0.3)
FORBIDDEN phrase (never write for Captain Ivor Hale): "palpable tension filled the room"
Act 2 behaviour contract: May show unease, evasion, or mild defensiveness when questioned. One behavioural tell is permitted. Internal conflict emerging: "Captain Hale is caught in a web of conflicting emotions, torn between his deep-rooted values and the undeniable changes in society. The resentment he harbors leads to a fear of losing his sense of purpose in a world that no longer seems to value his ideals."



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
Little Middleton Manor stands as a grand testament to the fading glory of the British aristocracy, its sprawling grounds and manicured gardens concealing secrets beneath their surface.

Key Locations Available:
- Drawing Room (interior): Gathering space
- Library (interior): Clue discovery
- Kitchen (interior): Clue discovery and staff interactions
- Formal Gardens (exterior): Clue discovery and isolation

Atmosphere: Tense and foreboding, reflecting underlying class tensions amidst the backdrop of economic hardship.
Weather: Overcast with intermittent rain, typical of the British countryside in autumn.

Era markers: Petrol automobiles crunching along gravel roads | Typewriters clicking in the study | Household telephones with rotary dials ringing unexpectedly

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
Drawing Room (interior):
  - Visual: Richly patterned drapes frame tall windows, through which the dim light filters in, casting a somber glow over the room., A grand piano sits in one corner, its polished surface reflecting the flickering candlelight, while a crystal chandelier sparkles overhead.
  - Sounds: The soft crackling of the fire dances in the background, interspersed with the occasional rustle of silk as guests shift in their seats., A distant clock ticks steadily, its sound echoing the unyielding passage of time within these walls.
  - Scents: The warm scent of burning wood mingles with the faint aroma of aged leather from the furniture, creating an inviting yet somber atmosphere., Hints of lavender from the potpourri placed strategically around the room add a delicate touch, masking the underlying mustiness of the manor.
  - Touch: The plush velvet of the armchairs invites guests to sink in, while the coolness of the marble busts contrasts sharply with the warmth of the fire., The smooth surface of the piano keys feels reassuringly familiar, a tactile reminder of the music that once filled the room.

Library (interior):
  - Visual: Sunlight streams through the bay window, illuminating the dust motes that dance in the air, creating a magical ambiance., Stacks of books, some dog-eared and others pristine, create a labyrinth of knowledge that invites exploration.
  - Sounds: The soft rustle of pages turning fills the air, accompanied by the gentle creaking of the wooden shelves as they settle., Occasionally, the distant sound of thunder rumbles, a reminder of the storm outside.
  - Scents: The rich scent of aged paper and leather bindings creates an intoxicating aroma that envelops the space., Hints of pipe tobacco linger, suggesting recent use and adding a personal touch to the atmosphere.
  - Touch: The smooth surface of the oak table feels cool to the touch, contrasting with the warmth of the sunlit room., The spines of the books, some rough and others smooth, provide a tactile exploration of history and knowledge.

Kitchen (interior):
  - Visual: Th
[truncated for prompt budget]

## Texture Pool
Draw on these as opportunities arise — you are not required to use them.

- Life in November 1931 unfolds against the backdrop of a damp and chilly English autumn, where overcast skies and intermittent rain create a subdued atmosphere
- The lingering effects of the Great Depression are palpable, as many families struggle to make ends meet, and social gatherings become charged with the weight of class tensions and economic despair
- The aristocracy, once secure in their privilege, now finds their status challenged by the realities of a crumbling economy
- The scent of rain-soaked earth mingles with the aroma of smoke from chimneys, creating a somber reminder of the hardships faced by many
- Short days lead to early twilights, and the sound of rain pattering against windows fills the air, echoing the underlying discord among society's tiers

TEMPORAL CONTEXT:

This story takes place in November 1931 during N/A.

Seasonal Atmosphere:
- Weather patterns: overcast skies, intermittent rain, chilly winds
- Daylight: Short days with twilight settling in by four o'clock; a damp chill permeates the air.
- Seasonal activities: hunting parties in the countryside, charity balls held in local halls, preparation for Christmas festivities
- Seasonal occasions: Guy Fawkes Night (November 5)
- Season: N/A

Period Fashion (describe naturally):
- Men formal: three-piece wool suit with waistcoat, tailored overcoat, silk tie
- Men casual: tweed jacket, flannel trousers, knitted jumper
- Men accessories: fedora hat, leather gloves, pocket watch
- Women formal: tea-length dress with a fitted waist, long-sleeved evening gown, cloche hat
- Women casual: sweater dress, tartan skirt, blouse with puffed sleeves
- Women accessories: string of pearls, silk scarf, suede gloves

Cultural Context (reference naturally):
- Music/entertainment: 'Ain't She Sweet' by Milton Ager, 'The Best Things in Life Are Free' by Ray Henderson, 'Happy Days Are Here Again' by Milton Ager; Films: 'Frankenstein' directed by James Whale, 'Murder in the Fleet' directed by Edward Sutherland; Theatre: 'The Royal Family' by George S. Kaufman and Edna Ferber, 'The Front Page' by Ben Hecht and Charles MacArthur; Radio: 'The Shadow' weekly mystery program, 'Amos 'n' Andy' sitcom
- Typical prices: Loaf of bread: four pence, Taxi fare across town: two shillings, Cinema ticket: one shilling
- Current events: Germany's economic instability post-Treaty of Versailles; the rise of the British Union of Fascists
- Literature: 'The Maltese Falcon' by Dashiell Hammett | 'Murder in the Cathedral' by T.S. Eliot | 'The Glass Key' by Dashiell Hammett | [mystery] | [noir fiction] | [modernist poetry]
- Technology: the electric washing machine | the radio broadcasting system's expansion | the introduction of the first mass-produced electric refrigerator | typewriters in offices | early household telephones | petrol automobiles
- Daily life: attending local fairs, participating in church events, gathering for tea parties
- Social rituals: afternoon tea among the upper classes, pub gatherings for the working class, charity events to support the needy

Atmospheric Details:
The damp air carries the scent of wet earth and fallen leaves, mingling with the faint aroma of smoke from distant chimneys. The persistent drizzle creates a soft patter against the windows, each drop echoing the tension that lingers in the manor's dimly lit hallways. As evening descends, the flickering candlelight casts long shadows, heightening the sense of unease that permeates the gathering of guests.

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
- Social commentary: Characters disc
[truncated for prompt budget]

NON-NEGOTIABLE CHAPTER OBLIGATIONS — LOCKED EVIDENCE PHRASES (VERBATIM REQUIRED):
The following physical evidence values are absolute ground truth. Every time this chapter describes, mentions, or alludes to the relevant evidence — no matter how briefly — it MUST use the exact phrase shown below, character for character. NO paraphrase, approximation, rounding, or synonym is permitted.

FAILURE EXAMPLE: if the locked value is "at thirteen minutes to midnight" and you write "just before midnight" or "around midnight" — that is a HARD FAIL. You must write "at thirteen minutes to midnight". Equally, if the locked value is written in words, such as "ten minutes past eleven", and you convert it to figure-based clock notation — that is also a HARD FAIL. Words stay as words; figure forms are forbidden for word-phrased facts.

CRITICAL — WORD-PHRASED VALUES: If the canonical value is written out in words (e.g. a time like "ten minutes past eleven", or an amount like "forty minutes"), reproduce those exact words. DO NOT convert to figure-based time notation, twenty-four-hour format, or any other numeric shorthand. Correct: "ten minutes past eleven". WRONG: figure-based clock notation or numeric shorthand.

Locked facts:
  - The exact time shown on the stopped clock face: "ten minutes past eleven"
  - The exact amount the clock was wound back: "forty minutes"
  - The scheduled time the party was supposed to begin: "eight o'clock in the evening"
  - The time of the murder based on the clock's false reading: "a quarter past eleven"

If a locked fact has no relevance to this chapter, omit it. But the moment you reference the underlying evidence, only the exact phrase above is acceptable.

⛔ CLUES TO SURFACE IN THESE CHAPTERS — mandatory:
The following evidence MUST be clearly observable to an attentive reader. Do not bury it in atmosphere or passing dialogue. Each clue must be concrete, specific, and noticeable:

• [clue_5] Eliminates Eleanor Voss because she was seen in another room during the time of the murder.
  Category: testimonial | Criticality: essential | Supports inference step 2
  Points to: This confirms Eleanor Voss's alibi.

• [clue_6] Eliminates Captain Ivor Hale because he was out of town during the murder.
  Category: testimonial | Criticality: essential | Supports inference step 2
  Points to: This confirms Captain Ivor Hale's alibi.

For each clue above: an attentive reader should be able to find, record, and later use it to reason toward the solution.

═══ NARRATIVE STATE (read-only — do not contradict) ═══

LOCKED FACTS — use verbatim whenever this evidence is described:
  • The exact time shown on the stopped clock face: "ten minutes past eleven"
  • The exact amount the clock was wound back: "forty minutes"
  • The scheduled time the party was supposed to begin: "eight o'clock in the evening"
  • The time of the murder based on the clock's false reading: "a quarter past eleven"

CHARACTER PRONOUNS — never deviate from these:
  • Eleanor Voss: she/her/her
  • Dr. Mallory Finch: she/her/her
  • Captain Ivor Hale: he/him/his
  • Beatrice Quill: she/her/her

CLUES ALREADY REVEALED TO READER: clue_1, clue_mechanism_visibility_core, clue_2, clue_3, clue_core_contradiction_chain, clue_fp_contradiction_step_2, clue_4, clue_core_elimination_chain — do not reveal these as new information.

CONTINUITY HANDOFF — previous chapter closing beat:
  • "As they resumed their questioning, Eleanor felt a flicker of hope. They were closer to the truth than ever, and with each revelation, the pieces of the puzzle began to fall into place. But the deeper they delved, the more complicated the web of deception becam..."
  • The next chapter must open as a continuation of this beat, not as a disconnected reset.
═══════════════════════════════════════════════════════

═══════════════════════════════════════════════════════════
📚 CONTINUITY CONTEXT - CHARACTER & SETTING CONSISTENCY
═══════════════════════════════════════════════════════════

**CRITICAL: You are writing chapters 5+. Maintain consistency with earlier chapters.**

**Character Names Used in Chapters 1-4:**
Eleanor Voss, Beatrice Quill

✓ RULE: Use EXACTLY these names. Do NOT vary spelling, add titles, or introduce new forms.
✓ Example: if earlier chapters used "Clara Whitfield", keep using "Clara Whitfield" — never "Mrs. Whitfield" unless that is the character's canonical name in the list above.

**Setting Vocabulary Established in Earlier Chapters:**
drawing room, estate, library, manor

✓ RULE: Continue using this location vocabulary. Maintain consistency with established setting type.
✓ Do NOT introduce new location types that contradict earlier chapters.

**Recent Chapter Summary (for narrative continuity):**
Chapter 2: Chapter 2: The Clock's Chime
  Events: Eleanor's gaze shifted to Beatrice, whose eyes darted between the clock and her notepad.
Chapter 3: Chapter 3: Initial Suspicions
  Events: With a deep breath, Eleanor stepped closer to the mantelpiece, her gaze fixed on the clock.
Chapter 4: Chapter 4: Interrogating Beatrice
  Events: Eleanor turned her gaze to Beatrice, who was fidgeting with her notepad, her eyes darting nervously to the clock on the mantelpiece.

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
Known location profile anchors: Little Middleton Manor, Drawing Room, Library, Kitchen, Formal Gardens, the library of Eleanor Voss's estate
LOCATION NAME CAPITALISATION (HARD REQUIREMENT — validated):
All named locations in your prose MUST use the EXACT capitalisation from the CML profiles.
Canonical forms: "Little Middleton Manor", "Drawing Room", "Library", "Kitchen", "Formal Gardens", "the library of Eleanor Voss's estate"
Writing a location in lowercase (e.g. "drawing room" instead of "Drawing Room") is a validated error. Every time you mention a named location, copy its capitalisation from the list above.
- Chapter 5: OPENING STYLE (HARD): Start the VERY FIRST SENTENCE with a temporal subordinate clause — e.g. "When [Name] entered…" / "After the last guest…" / "Before the household had stirred…" / "As the light faded…". Anchor opening in "the library of Eleanor Voss's estate". HARD REQUIREMENT for the first 2 paragraphs: (a) include 2+ sensory words — choose from smell/scent/sound/echo/silence/creak/whisper/cold/warm/damp/rough/smooth/glow/shadow/flicker/dim — and (b) include 1+ atmosphere/time word — choose from rain/wind/fog/storm/mist/thunder/evening/morning/night/dawn/dusk/season/afternoon/midday/noon/midnight/twilight/sunrise/sunset/daylight/sunlight/overcast/cloudy/bright/dark. These are validated requirements, not style suggestions; missing them triggers a retry.

[⚠ INTERNAL QUALITY DIAGNOSTICS — DO NOT REPRODUCE ANY PART OF THIS SECTION IN YOUR STORY OUTPUT. These are private generator observations for your consideration only. Your narrative must read as if this section does not exist. Never include phrases from this block in character dialogue, narration, or description.]

PRIOR CHAPTER QUALITY OBSERVATIONS:
- Chapter 3 (score 92/100):
  Quality gaps noted: word density below preferred target (836/1000); scene grounding weakness
  Address in upcoming chapters: Increase chapter density with concrete investigation action and sensory-grounded beats; avoid recap-only padding. | Open next chapter with a named location anchor plus at least two sensory cues and one atmosphere marker.
- Chapter 4 (score 98/100):
  Quality gaps noted: word density below preferred target (993/1000)
  Address in upcoming chapters: Increase chapter density with concrete investigation action and sensory-grounded beats; avoid recap-only padding.
- Phrases to avoid (already overused in earlier chapters): "his gravelly voice cutting through the tension", "the drawing room of eleanor voss s", "drawing room of eleanor voss s estate", "mislead us about the time of death", "we mustn t lose sight of the", "mustn t lose sight of the facts", "to dr finch s memory to uncover", "dr finch s memory to uncover the", "finch s memory to uncover the truth", "to piece together the timeline before it".
[END INTERNAL DIAGNOSTICS]

PROMPT BUDGET SUMMARY: budget=32000 tokens; fixed=10332; context=10807; dropped=[none]; truncated=[location_profiles, temporal_context]

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
- Chapter numbering starts at 5 and increments by 1 per scene.
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
8. Integrate at least two concrete era-grounded details per chapter from setting refinement signals: petrol automobiles on gravel roads | typewriters in offices | early household telephones | party-line telephone systems | telegrams for urgent messages | airmail services available.
9. Respect setting movement/access constraints in scene action and alibis: layout includes restricted access to certain wings | hidden passageways may complicate movement | weather may affect outdoor evidence collection | specific permissions required to enter private areas | daily routines dictate movement patterns.
10. Sustain social coherence with this backdrop pressure: A gathering at the manor for a wealthy benefactor's birthday party becomes a pressure cooker of class tensions and economic strain, as guests and staff navigate the complexities of privilege and desperation amidst the backdrop of the Great Depression.
11. Maintain continuity around these socially central cast anchors where relevant: Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill.
12. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Critical: Plot similarity 0.75 with 'The Mysterious Affair at Styles' (same mechanical murder method and false assumption about timing)
13. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Moderate: Setting similarity 0.85 with 'The Mysterious Affair at Styles' (similar early 20th-century country manor setting)
14. STORY TO DATE ANTI-COPY RULE: The STORY TO DATE section below is provided for chronological and factual reference ONLY. You MUST NOT copy, lightly rephrase, or structurally echo any sentence or paragraph from prior chapters. Every sentence in this chapter must be original prose unique to this scene. Reusing even a clause from prior chapter text will cause this attempt to fail immediately.

CRITICAL PROSE REQUIREMENTS:

The CML specifies exact requirements for certain validation-critical scenes. You MUST include these elements at the specified positions.

**Discriminating Test Scene (Act 3, Scene 4):**
Required elements: Execute the discriminating test, Observe the culprit's reaction or result, Draw conclusion about guilt
Test type: trap

**Suspect Clearance Scenes:**
- Captain Ivor Hale (Act 3, Scene 5): Proving he lacked access to the clock during the time of death.
  Clues: Clue: Access records of the study
- Dr. Mallory Finch (Act 3, Scene 5): Victim's status as deceased.
  Clues: Clue: Time of death

**Culprit Revelation Scene (Act 3, Scene 6):**
Method: Confrontation with evidence

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
- Chapter 5:
  - Word count: Target 1250 words. Achieve this through plot events, dialogue exchanges, and physical investigation — not through atmospheric repetition or extended internal reflection. Each 200-word segment should contain at minimum one concrete story event (a discovery, a conversation exchange, a physical action or movement). Padding with atmosphere alone is not acceptable.
  - Location anchor: the library of Eleanor Voss's estate.
  - Opening atmosphere (MANDATORY — validator enforced): the first paragraph MUST contain at least one of: rain / wind / fog / storm / mist / thunder / evening / morning / night / dawn / dusk / season / afternoon / midday / noon / midnight / twilight / sunrise / sunset / daylight / sunlight / overcast / cloudy / bright / dark. A chapter that omits all of these from its opening paragraph will be rejected.
  - Continuity bridge: in the first 120 words, visibly connect from the previous chapter's final beat. Carry forward one unresolved element (object, accusation, emotional pressure, or immediate physical action) from: "As they resumed their questioning, Eleanor felt a flicker of hope. They were closer to the truth than ever, and with each revelation, the pieces of the puzzle began to fall into place. But the deeper they delved, the mor...".
  - CLUE OBLIGATIONS — mandatory prose elements (do NOT omit or bury):
    • Eliminates Eleanor Voss because she was seen in another room during the time of the murder. [clue_5]
      Points to: This confirms Eleanor Voss's alibi.
    • Eliminates Captain Ivor Hale because he was out of town during the murder. [clue_6]
      Points to: This confirms Captain Ivor Hale's alibi.
  - Tonal contrast: include at least one beat of relief or ironic counterpoint. Do not sustain maximum tension for every paragraph.
  - Sensory obligation — use at least two of: The muted light creates an almost eerie atmosphere, as shadows stretch across the room and the colors appear washed out., Dust motes hang in the air, illuminated by the faint light, giving the space an ethereal quality. | The silence is occasionally broken by the creaking of the shelves as if the books themselves are alive., The faint rustle of paper as a reader turns a page creates a sense of intimacy in the otherwise quiet room. | The scent of old books permeates the air, rich and inviting, yet tinged with the melancholic reminder of time’s passage.. Mood: pensive.
- Locked fact phrase obligations:
  - If this batch mentions The exact time shown on the stopped clock face, write exactly: "ten minutes past eleven".
  - If this batch mentions The exact amount the clock was wound back, write exactly: "forty minutes".
  - If this batch mentions The scheduled time the party was supposed to begin, write exactly: "eight o'clock in the evening".
  - If this batch mentions The time of the murder based on the clock's false reading, write exactly: "a quarter past eleven".
- Seasonal vocabulary allow-list: autumn, autumnal, fall.
- Forbidden seasonal words: spring, summer, winter.

FROZEN TIMELINE STATE (DO NOT ALTER):
- Timeline anchor: November (autumn).
- Month, season, weather, and time-of-year language in this batch must stay compatible with autumn.
- Established timeline fact: 9:00 PM - Time of Death
- Established timeline fact: 8:20 PM - Clock Time
- If referenced, use exact time phrase: "ten minutes past eleven" (The exact time shown on the stopped clock face).
- If referenced, use exact time phrase: "forty minutes" (The exact amount the clock was wound back).
- If referenced, use exact time phrase: "eight o'clock in the evening" (The scheduled time the party was supposed to begin).
- If referenced, use exact time phrase: "a quarter past eleven" (The time of the murder based on the clock's false reading).

STORY TO DATE (REFERENCE ONLY — DO NOT COPY VERBATIM):
- Full prior chapter text is provided below for continuity, factual consistency, and reference accuracy.
- Use this to keep character voice, chronology, clue state, and location continuity aligned with earlier chapters.
- Do not quote, copy, or paraphrase these paragraphs too closely; write fresh prose that remains consistent with them.

--- BEGIN PRIOR CHAPTER 1 ---
Title: Chapter 1: Discovery
The damp morning air clung to the windows of the drawing room of Eleanor Voss's estate, streaked with rain that blurred the view of the manicured gardens beyond. Inside, the atmosphere was thick with tension, the soft crackling of the fire barely masking the unease that permeated the space. Eleanor Voss stood by the fireplace, her fingers nervously twisting the silk of her dress, the fabric cool against her skin. The muted light from the overcast sky filtered through the tall windows, casting a somber glow over the room, enhancing the sense of foreboding that had settled in since the news of the murder broke.

Across the room, the doctor Finch stared at the clock on the mantelpiece, its hands frozen at eight twenty in the evening. She felt her heart race as she recalled the last moments before the tragedy. The clock, once a reliable keeper of time, now seemed to mock her with its stillness. "It can't be right," she murmured, her voice barely above a whisper. The implications of that time weighed heavily on her mind, a grim reminder of the events that had unfolded. The clock showed eight twenty in the evening when checked after the murder.

Eleanor's gaze shifted to Dr. Finch, noting the tremor in her hands. "Mallory, what do you think this means?" she asked, her voice steady but laced with concern. The doctor hesitated, her brow furrowing as she processed the information. "If the clock is accurate, it suggests the murder occurred before the party even began," she replied, her tone clipped. "But we know that can't be the case. We were all here, and yet..." Her words trailed off, leaving an unsettling silence in their wake. The mechanism relies on clock, 8, and 20 to expose the false timing. It was a chilling thought, one that hinted at deeper mysteries yet to be uncovered.

the captain Hale, standing by the window, turned to face the two women, his expression a mixture of disbelief and frustration. "We need to consider the possibility that someone tampered with the clock," he suggested, his gravelly voice cutting through the tension. "If it was wound back, it could easily mislead us about the time of death. We must find out who had access to it before the murder occurred." His words hung in the air, a stark reminder of the complexities they faced in unraveling this mystery. The more they spoke, the more the room felt like a pressure cooker, each moment building upon the last.

Eleanor crossed her arms, a gesture of defiance against the rising tide of anxiety. "We cannot let fear dictate our actions, Captain. We must remain focused on the facts. Each of us was in this room, and yet, we all have our secrets. The question is, who among us had the most to gain from Dr. Finch's demise?" Her voice held a steely resolve, masking the turmoil that churned within her. The clock ticked ominously in the background, a constant reminder of the time slipping away as they grappled with the implications of their situation.

As they stood in the drawing room, the rain continued to patter against the windows, a steady rhythm that mirrored the tension in the air. Eleanor felt the weight of her responsibilities pressing down on her, the need to protect her reputation and uncover the truth driving her forward. She glanced at Dr. Finch, who appeared lost in thought, and then at Captain Hale, whose brow was furrowed in concentration. Each of them bore the burden of their own secrets, and the atmosphere crackled with unspoken words and hidden motives.

In that moment, Eleanor knew they were at a crossroads. The truth lay just beyond their grasp, shrouded in the fog of deception that surrounded them. With a deep breath, she steeled herself for what lay ahead. "We must act quickly. The longer we wait, the more likely it is that the truth will slip through our fingers. We need to investigate the clock and determine if it has been tampered with. Only then can we begin to unravel the web of lies that has ensnared us all."

Dr. Finch nodded, her resolve returning as she looked at Eleanor. "You're right. We mustn't lose sight of the facts. Let's examine the clock and see if we can uncover any evidence of tampering. We owe it to ourselves and to Dr. Finch's memory." Captain Hale stepped forward, determination etched on his face. "Then let us begin. Time is of the essence, and we cannot afford to let this mystery linger any longer."
--- END PRIOR CHAPTER 1 ---

--- BEGIN PRIOR CHAPTER 2 ---
Title: Chapter 2: The Clock's Chime
The distant sound of thunder rumbled ominously as Eleanor Voss stepped into the drawing room of her estate, the flickering candles creating an interplay of light and dark that enhanced the room's sense of mystery. She glanced at the clock on the mantelpiece, its hands frozen at ten minutes past eleven, a grim reminder of the tragedy that had unfolded. The air was thick with murmurs of disbelief and anxiety, the weight of the recent murder hanging heavily over the gathering. the doctor Finch and the captain Hale stood near the fireplace, their expressions a mixture of shock and concern. Beatrice Quill, a journalist, fidgeted with her notepad, glancing nervously at the clock as it struck erratically, the sound echoing through the room. It was as if the clock itself was mocking them, a cruel reminder of the uncertainty that now enveloped them all.

Eleanor's gaze shifted to Beatrice, whose eyes darted between the clock and her notepad. "Did you hear that?" Beatrice asked, her voice barely above a whisper. "The clock struck at peculiar intervals, didn’t it?" The words hung in the air, prompting a collective silence as the others exchanged glances. Captain Hale frowned, his brow furrowing as he considered the implications. "It’s not just the time that’s wrong. If the clock is striking oddly, it could mean we can’t trust its reading. It raises questions about the time of death," he said, his gravelly voice cutting through the tension. Dr. Finch nodded, her expression serious. "If it was tampered with, we could be misled about when Dr. Finch was killed. We need to investigate this further."

The atmosphere in the room shifted, the unease palpable as they began to question each other's alibis. Eleanor crossed her arms, her mind racing with possibilities. "We all have our secrets, but the question remains: who had the most to gain from Dr. Finch's demise?" Her voice held a steely resolve, masking the turmoil that churned within her. Beatrice, sensing the tension, cleared her throat. "I was in the library when I heard the clock strike. It was... unsettling, to say the least. I thought it was just a malfunction, but now I wonder if it means something more."

Captain Hale stepped closer to the clock, inspecting it with a critical eye. "If someone wound it back, they could easily manipulate the time to create an alibi. We need to find out who had access to this room before the murder occurred," he stated, his tone firm. Eleanor felt a knot tighten in her stomach. The implications of Hale's words were chilling. He had always prided himself on his ability to read people, but now, doubt crept into his mind. Who among them could be hiding such a dark secret? The weight of suspicion hung heavy in the air, and he could feel the tension crackling like static electricity.

As the group continued to discuss the clock's peculiar behavior, Eleanor felt a wave of relief wash over her when Beatrice offered a small, nervous laugh. "Well, at least we can all agree that this clock is as unreliable as our memories right now!" The attempt at humor lightened the mood for a moment, but the underlying tension remained. Eleanor seized the opportunity to steer the conversation back to the facts. "We need to focus on the evidence. If the clock is unreliable, we must gather all the information we can about our whereabouts during the time of the murder. We owe it to Dr. Finch's memory to uncover the truth."

Dr. Finch, still visibly shaken, nodded in agreement. "I remember the last moments before the tragedy. I was speaking with Eleanor when I heard the clock strike. It’s all a blur now, but I can’t shake the feeling that something is off. We mustn't lose sight of the facts, or we risk losing ourselves in this web of deception." Captain Hale's eyes narrowed as he considered his words. "Then let’s start with the facts. Who was where, and when? We need to piece together the timeline before it slips away from us."

As they began to recount their movements, Eleanor felt the weight of their collective anxiety pressing down on her. The drawing room, once a place of elegance and warmth, now felt like a cage, each tick of the clock echoing the urgency of their situation. The storm outside raged on, mirroring the turmoil within. The flickering candles cast long shadows, and the air was thick with unspoken fears. In that moment, Eleanor understood that the clock was more than just a timepiece; it was a symbol of their unraveling lives, a reminder that time was running out. They needed to act quickly, or the truth would remain forever shrouded in darkness.
--- END PRIOR CHAPTER 2 ---

--- BEGIN PRIOR CHAPTER 3 ---
Title: Chapter 3: Initial Suspicions
At midday, the rain continued to patter against the windows of the drawing room of Eleanor Voss's estate, each drop echoing the tension that hung in the air. The flickering candlelight cast dancing shadows across the richly patterned drapes, illuminating the faces of the gathered guests, their expressions a mixture of anxiety and disbelief. Eleanor stood at the center of the room, her heart racing as she recalled the clock's behavior just before the murder. The clock's hands, frozen at ten minutes past eleven, felt like a mocking reminder of the tragedy that had unfolded, and she could sense the weight of suspicion pressing down on her and her companions. The atmosphere was thick with unspoken fears, and Eleanor felt as if the walls were closing in around them.

With a deep breath, Eleanor stepped closer to the mantelpiece, her gaze fixed on the clock. "It shows ten minutes past eleven," she murmured, her voice steady despite the turmoil inside. "But we need to consider that the time of death is not accurately represented." The words hung in the air, a stark reminder of the implications that lay beneath the surface. If the clock was wrong, then their entire understanding of the timeline was flawed. The thought sent a shiver down her spine, and she turned to face the doctor Finch, whose expression mirrored her own unease.

Dr. Finch's brow furrowed as she processed Eleanor's statement. "If the clock is indeed inaccurate, it suggests that the murder occurred before the time it indicates. We were all here, and yet..." Her voice trailed off, leaving the room steeped in silence. The implications of that time weighed heavily on them all, a grim reminder of the events that had unfolded. Eleanor could feel the tension rising as they began to scrutinize their alibis. Who among them could be hiding a dark secret? The thought made her stomach churn.

the captain Hale, standing nearby, crossed his arms and regarded the clock with a critical eye. "We need to consider the possibility that someone tampered with it. If it was wound back, it could mislead us about the time of death," he said, his gravelly voice cutting through the tension. "We must find out who had access to this room before the murder occurred." Her words resonated with Eleanor, and she caught her breath, her mind racing as she realized the implications of the clock's behavior. They were all suspects now, each of them entangled in a web of suspicion and deceit.

Beatrice Quill, the journalist, fidgeted with her notepad, her eyes darting between the clock and the others. "I was in the library when I heard the clock strike. It was... unsettling, to say the least. I thought it was just a malfunction, but now I wonder if it means something more," she said, her voice quivering slightly. The others turned to her, their expressions a mix of curiosity and skepticism. Eleanor could see the doubt creeping into their minds, and she felt a pang of guilt. Could Beatrice be hiding something? The tension in the room was palpable, and Eleanor knew that they needed to confront their fears head-on.

As they continued to discuss the clock's peculiar behavior, Eleanor felt the weight of their collective anxiety pressing down on her. The drawing room, once a place of elegance and warmth, now felt like a cage, each tick of the clock echoing the urgency of their situation. The storm outside raged on, mirroring the turmoil within. She glanced at Dr. Finch, whose expression was one of deep contemplation, and then at Captain Hale, who seemed lost in thought. Each of them bore the burden of their own secrets, and the atmosphere crackled with unspoken words and hidden motives.

Eleanor's voice broke the silence. "We must focus on the facts. If the clock is unreliable, we need to gather all the information we can about our whereabouts during the time of the murder. We owe it to Dr. Finch's memory to uncover the truth," she said, her tone resolute. Dr. Finch nodded in agreement, her eyes glistening with unshed tears. "I remember the last moments before the tragedy. I was speaking with you, Eleanor, when I heard the clock strike. It’s all a blur now, but I can’t shake the feeling that something is off. We mustn't lose sight of the facts, or we risk losing ourselves in this web of deception."

Captain Hale's eyes narrowed as he considered the implications of their conversation. "Then let’s start with the facts. Who was where, and when? We need to piece together the timeline before it slips away from us," he said, his voice firm. Eleanor felt a knot tighten in her stomach. The implications of their discussion were chilling. The discrepancies in their alibis concerning the clock's behavior were becoming increasingly apparent, and she could sense the tension rising as they began to question each other's movements. Who among them could be trusted? The thought sent a shiver down her spine.
--- END PRIOR CHAPTER 3 ---

--- BEGIN PRIOR CHAPTER 4 ---
Title: Chapter 4: Interrogating Beatrice
The distant sound of thunder rumbled ominously as the afternoon light filtered into the drawing room of Eleanor Voss's estate, casting long shadows across the room. The flickering candles created an interplay of light and dark, enhancing the room's sense of mystery. Eleanor stood at the center, her heart racing as she recalled the implications of the clock's behavior. Captain Hale's voice still echoed in his mind, urging them to piece together the timeline before it slipped away. She felt the weight of scrutiny from the doctor Finch and Beatrice Quill, both of whom were now focused intently on her. The air was thick with tension, and Eleanor knew they needed to confront the truth about the clock and its secrets.

Eleanor turned her gaze to Beatrice, who was fidgeting with her notepad, her eyes darting nervously to the clock on the mantelpiece. "Beatrice," Eleanor began, her voice steady yet probing, "you were in the library when you heard the clock strike, correct? Can you tell us exactly what you were doing there?" Beatrice hesitated, her fingers trembling slightly as she clutched the notepad. "I was just... looking for some old articles for my next piece," she stammered, her voice barely above a whisper. Eleanor noted the tremor in Beatrice's voice, the way her eyes flickered away from the clock, and a knot of suspicion tightened in her stomach.

Dr. Finch, standing beside Eleanor, leaned forward with curiosity. "And when did you hear the clock strike, Beatrice? Was it before or after you left the library?" Beatrice's gaze dropped to the floor, her brow furrowing as she struggled to recall the details. "I... I think it was just after I left. But the clock was acting strangely, wasn’t it?" The nervousness in her tone was palpable, and Eleanor felt a flicker of doubt creeping into her mind. "Yes, it was," Eleanor replied, her voice firm. "But we need to focus on the facts. If the clock was tampered with, it could mean that someone is trying to mislead us about the time of death. We need to know who had access to it before the murder occurred."

Captain Hale stepped closer to the clock, his expression serious. "If someone wound it back, they could easily manipulate the time to create an alibi. We need to investigate this further," he stated, his gravelly voice cutting through the tension. Eleanor felt a rush of determination. They had to uncover the truth, and Beatrice's nervousness raised more questions than answers. "Beatrice, did you notice anything unusual about the clock when you were near it?" she pressed, her eyes locked on Beatrice's face, searching for any sign of deception.

Beatrice shifted uncomfortably, her voice trembling as she recounted her movements. "I... I just remember it striking, but I didn’t think much of it at the time. I thought it was just a malfunction." Her eyes darted to the clock again, and Eleanor caught the flicker of fear in her gaze. The atmosphere in the room grew heavier, and Eleanor felt the weight of their collective anxiety pressing down on her. "What if it wasn’t just a malfunction?" she asked, her voice low. "What if someone deliberately tampered with it?"

Eleanor stepped closer to the clock, examining it closely. As she did, her fingers brushed against the winding key, and she noticed a small scratch on its surface. "Look here," she said, her voice rising with urgency. "There’s a scratch on the clock's winding key. This suggests tampering may have occurred prior to the murder." Beatrice's eyes widened, and she took a step back, her expression shifting from nervousness to alarm. "I didn’t do anything to the clock!" she exclaimed, her voice rising defensively. "I swear!"

Eleanor felt a surge of adrenaline as she processed this new piece of evidence. "We need to determine how this scratch got here and who had access to the clock before the murder occurred. Your presence near the clock raises questions, Beatrice. We need the truth," she said, her tone firm yet measured. Beatrice opened her mouth to protest, but the words faltered as she glanced at Dr. Finch, who was watching her intently. The tension in the room was palpable, and Eleanor could feel the weight of suspicion settling heavily over them.

Just then, the distant rumble of thunder echoed outside, a reminder of the storm brewing beyond the walls of the manor. The flickering candlelight cast shadows that danced across Beatrice's face, revealing the conflict within her. Eleanor took a deep breath, her mind racing with possibilities. "We owe it to Dr. Finch's memory to uncover the truth. If you know something, Beatrice, now is the time to tell us. We can’t afford any more secrets." Beatrice's expression shifted, and for a moment, Eleanor thought she might break. But instead, Beatrice shook her head, her voice trembling as she replied, "I promise, I don’t know anything more!"

Eleanor exchanged a glance with Dr. Finch, whose brow furrowed in thought. The tension was thick, and Eleanor felt the urgency of their situation pressing down on her. They were running out of time, and the truth remained just out of reach. "We need to keep digging, to find out who had access to the clock and when. This scratch could be the key to unraveling this mystery," she said, her voice resolute. Beatrice nodded, her expression a mixture of fear and determination. The storm outside continued to rage, mirroring the turmoil within the drawing room as they prepared to confront the shadows of their past.

As they resumed their questioning, Eleanor felt a flicker of hope. They were closer to the truth than ever, and with each revelation, the pieces of the puzzle began to fall into place. But the deeper they delved, the more complicated the web of deception became. Eleanor steeled herself for what lay ahead, knowing that the clock was ticking and the truth was waiting to be uncovered.
--- END PRIOR CHAPTER 4 ---

[SCENE COMPLETENESS CONTRACTS — MANDATORY. Each contract below lists what you MUST enact in that chapter. Do not summarise or mention these labels in the prose — enact them organically.]
Chapter 5 (Act 2) completeness contract:
  PIVOT ELEMENT (MANDATORY — write this into the prose, shown not told): "The records of Captain Hale's absence"
  FACT ESTABLISHED (MANDATORY — reader must know this by chapter end): "Establishes that Captain Hale was not present during the murder."

# Case Overview
Title: The Clockwork Deception
Era: 1930s
Setting: Little Middleton
Crime: murder (mechanical)
Culprit: Beatrice Quill
False assumption: The murder must have occurred exactly when the clock indicated.
Cast: Eleanor Voss (she/her), Dr. Mallory Finch (she/her), Captain Ivor Hale (he/him), Beatrice Quill (she/her)

Setting Lock: Keep all scenes and descriptions consistent with the stated setting (Little Middleton). Do not introduce a different location type.

Outline scenes:
[
  {
    "sceneNumber": 5,
    "act": 2,
    "title": "Captain Hale's Alibi",
    "setting": {
      "location": "the library of Eleanor Voss's estate",
      "timeOfDay": "Late afternoon",
      "atmosphere": "A sense of urgency as evidence is examined"
    },
    "characters": [
      "Eleanor Voss",
      "Captain Ivor Hale",
      "Dr. Mallory Finch"
    ],
    "purpose": "Examine Captain Hale's alibi and access to the clock.",
    "cluesRevealed": [
      "clue_5",
      "clue_6"
    ],
    "dramaticElements": {
      "conflict": "Eleanor confronts Hale about his absence.",
      "tension": "Hale's alibi begins to crumble under scrutiny.",
      "microMomentBeats": [
        "Eleanor narrows her eyes, sensing that Hale's story doesn't add up."
      ]
    },
    "summary": "Eleanor confronts Captain Hale about his alibi, revealing he was out of town during the murder. As she examines the library for evidence, she realizes Hale had no access to the clock.",
    "estimatedWordCount": 1800,
    "pivotElement": "The records of Captain Hale's absence",
    "factEstablished": "Establishes that Captain Hale was not present during the murder.",
    "permittedBehavioursByAct": [
      {
        "characterName": "Eleanor Voss",
        "behaviour": "unease; mild defensiveness"
      },
      {
        "characterName": "Captain Ivor Hale",
        "behaviour": "normal social behaviour; defensive"
      },
      {
        "characterName": "Dr. Mallory Finch",
        "behaviour": "normal social behaviour; curious"
      }
    ],
    "redHerringPlacement": null,
    "emotionalRegister": "A pivotal revelation shifts the direction of the investigation.",
    "dominantCharacterNote": {
      "name": "Eleanor Voss",
      "voiceRegister": "Eleanor's voice carries a refined grace, often laced with a playful undertone that belies her inner turmoil."
    },
    "humourGuidance": {
      "permission": "permitted",
      "character": "Beatrice Quill",
      "form": "blunt"
    },
    "eraTextureNote": "Limited transportation options due to economic hardship.; Restricted access to communication technologies, such as telephones.; Weather conditions hindering outdoor activities and gatherings.",
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
