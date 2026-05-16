# Actual Prompt Record

- Run ID: `mystery-1778789193419`
- Project ID: ``
- Timestamp: `2026-05-14T20:12:23.151Z`
- Agent: `Agent9-ProseGenerator-Ch5`
- Operation: `chat_request_full_prompt`
- Model: `GPT-4o-mini`
- Temperature: `0.42`
- Max Tokens: `4500`
- Attempt: `first`
- Prompt Hash: `4a0469a9464b810f`

## Message 1 (role=system)

```text
You are an expert prose writer for classic mystery fiction. Your role is to write compelling, atmospheric narrative chapters that read like a professionally published novel.

⛔ ABSOLUTE RULE — CHARACTER NAMES:
The ONLY characters who exist in this story are: Eleanor Voss (woman), Dr. Mallory Finch (man), Captain Ivor Hale (man), Beatrice Quill (woman).
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
- MORAL COMPLEXITY REQUIREMENT: The mechanism of this crime carries a moral gray area: "The murderer acted out of love and desperation, believing they were protecting a family member from ruin." — the culprit reveal and denouement MUST acknowledge this ambiguity. Do not let the ending feel clean or simple. Give the reader at least one moment of uncomfortable sympathy or moral doubt.


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

## Era: 1932-04
April 1932 unfolds in a muted palette of grays and greens across the English countryside, with the air heavy with moisture from frequent rain showers. The arrival of spring brings a mixture of anticipation and dread, as the Easter holiday approaches, yet the echoes of a struggling economy resonate throughout the estate. In the drawing rooms of the country house, the atmosphere is charged, with guests exchanging polite smiles that barely mask underlying tensions, their conversations often veering towards the precarious state of affairs both in England and abroad. The world outside is awakening, yet inside, secrets simmer like the brewing storm clouds overhead. Fashion in this spring of 1932 is a reflection of both tradition and modernity, with men donning tailored tweed suits complemented by sharp, geometric ties that hint at the Art Deco movement. Women, meanwhile, embrace the elegance of tea-length dresses adorned with floral motifs, their silhouettes softened by cloche hats and delicate pearls. As guests mingle at the estate, their attire speaks volumes of their social standing, with every stitch and accessory carefully chosen to project an image of refinement, albeit in the shadow of the economic downturn that looms over them all. Daily life in April is marked by a blend of routine and ritual. The scent of freshly baked bread from the kitchen mingles with the rich aroma of tea served during afternoon gatherings, where gossip flows as freely as the drink. As the sun reluctantly sets, bringing darkness to the estate, the sounds of laughter and the clinking of china fill the air, yet beneath the surface, the specter of class struggle is palpable. With the country grappling with rising unemployment and the threat of fascist ideologies creeping across Europe, the conversations at dinner tables are laced with anxiety, revealing the fragility of their social fabric.
Emotional register: Anxiety and tension permeate the social atmosphere, as individuals wrestle with the fear of financial ruin and the threat of societal upheaval.
Physical constraints: Domestic wiring frequently fails, leaving parts of the house dimly lit. | Petrol touring cars are parked haphazardly on the gravel drive, indicating the limited means of transportation. | Typewriters can be heard clacking in the study, as the reliance on written communication remains strong amidst economic distress.
Current tensions (weave into background texture): The Great Depression continues to exert pressure on the economy, increasing unemployment rates and leading to social unrest. | Political tensions rise as discussions of unemployment and welfare reform are debated in Parliament. | The ongoing London Economic Conference is being held, discussing recovery from the Great Depression.
Wartime context — Many families still bear the scars of past wars, with memories of service intermingling with current struggles.: The lingering effects of military service create a complex backdrop of honor and resentment within the community. Absence effect: The absence of men who have gone off to war has led to shifts in social dynamics and gender roles, creating further tension.

## Story Theme
In a world burdened by economic despair, the depths of human ambition and the darkness of deceit reveal the lengths one will go to secure their future.

## Story Emotional Register
Dominant: The journey unfolds with a consistent tension that escalates into a gripping climax.

Arc:
As the storm rages outside, the atmosphere at Ashcroft Manor is thick with unease, reflecting the secrets and tensions lurking among its inhabitants. It is in this charged environment that the body of a wealthy relative is discovered, setting off a chain of events that pulls the characters into a web of suspicion and deceit. Beatrice Quill, the sharp-witted detective, steps into the fray, her determination to uncover the truth intensifying as she delves into the lives of those closest to the victim. Initial clues point toward hidden motives, yet each lead is fraught with emotional cost, as long-buried secrets threaten to resurface and unravel the delicate fabric of their lives.

A pivotal moment occurs when the discrepancies surrounding the clock’s time become evident, redirecting Beatrice's investigation and raising doubts about the reliability of those she interrogates. As tensions mount and the stakes rise, the characters are forced to confront their own demons, leading to a revelation that recontextualizes their relationships and motives. The climax builds to a fever pitch, where accusations fly and the truth comes crashing down amidst the chaos, forcing each character to grapple with the consequences of their actions. In the resolution, the emotional toll of the events lingers, leaving Eleanor with a haunting realization of what she has sacrificed for her desires, while Beatrice reflects on the price of truth, and Ivor must confront the ghosts of his past. The manor stands silent, a testament to the darkness that lies beneath its opulent facade, as the characters emerge forever changed by the night’s events.

## Emotional register at this point in the story
A critical clue shifts the direction of the investigation.

## Character Portraits (appearance & era)

### Captain Ivor Hale
Captain Ivor Hale is a retired military officer whose stern exterior conceals a deep-seated resentment linked to the treatment of his late wife. The social hierarchies and class tensions of the 1930s weigh heavily on him, as he navigates a world that has moved on from his wife's service. His struggle to uphold honor while feeling overlooked reflects the broader societal conflicts arising from the class disparities exacerbated by the Great Depression.
Era intersection: Ivor's disillusionment with the family he served and his resentment towards their treatment of his late wife reveal the emotional toll of a society grappling with the fallout of war and economic hardship.

### Beatrice Quill
Beatrice Quill is an ambitious journalist with a tenacious spirit, driven by the desire for success in a competitive field. As economic despair grips the nation, her quest for truth often intertwines with personal vendettas, leading her to navigate a complex web of ambition and revenge. Her determination to uncover family secrets reflects the societal pressures of the era, where many must grapple with the ethics of their actions in a time of crisis.
Era intersection: Beatrice's ambition and personal motivations are heightened by the economic instability of the 1930s, as she seeks to carve out a name for herself while navigating the moral complexities of her profession.

## Character Voices

### Captain Ivor Hale (he/him/his)
Ivor's speech is direct and to the point, often devoid of embellishment.
[comfortable] Honor is all I have left; it's what defines me.
[evasive] I was just preparing for the charity event, nothing more.
[stressed] This family has lost all respect for the sacrifices made!
Humour: His blunt manner leaves little room for humor, but an unexpected sardonic remark may occasionally slip through.

### Beatrice Quill (she/her/her)
Beatrice speaks with a quick, lively cadence, often punctuating her observations with dry humor.
[comfortable] Every story has layers, just waiting to be peeled back, don't you agree?
[evasive] I simply arrived to gather the latest news—a journalist's duty!
[stressed] I won't let this opportunity slip through my fingers; it's now or never!
Humour: Her sardonic wit often shines through, making her conversations both engaging and sharp.

## Location Registers (scene framing guides)

The Library: Stepping into the library feels like entering a tomb of secrets, where every shadow seems to hold a whisper of what has transpired. The air is thick with tension, the disarray of books echoing the chaos of the crime, and the dim light creates a haunting atmosphere, urging one to uncover the truth hidden within these walls.. Camera angle: As the writer enters, a sense of foreboding looms, framing the room as both a sanctuary and a prison of untold stories.. Era: The musty scent of old books combined with the chill of the spring air captures a moment frozen in time, where the weight of history collides with the urgency of the present.

The Drawing Room: The drawing room pulses with a sense of foreboding, where laughter feels hollow and conversations hang heavy in the air. The opulence of the decor contrasts sharply with the underlying tension, as unspoken fears and hidden agendas simmer just beneath the surface, waiting for the right moment to explode.. Camera angle: The writer should approach this space with a sense of unease, capturing the duality of comfort and danger that permeates the atmosphere.. Era: The flickering candlelight adds an eerie glow, emphasizing the divide between the grandeur of the space and the fragility of the relationships within it.

The Servants' Hall: In the Servants' Hall, the atmosphere is one of quiet camaraderie amidst an undercurrent of tension. Here, the staff share whispered conversations, their faces worn from the burdens of service, yet their bonds provide a flicker of warmth in this cold and stark environment. The scent of hearty meals mingles with the lingering dampness of the manor, creating a comfort that stands in stark contrast to the looming drama above.. Camera angle: The writer should observe the staff with an empathetic lens, revealing the shared struggles and hidden resilience in their daily lives.. Era: The starkness of the hall reflects the rigid class structures of the time, where the divide between staff and family is palpable.

## Humour guidance for this story position (first_turn)
Permission: forbidden
Rationale: The tension is palpable, leaving no room for humor.

## Character Pressure
Captain Ivor Hale is approaching a point of breakdown. Stress and strain should be accumulating visibly — through behaviour, not statement. No confrontation yet.

## Reveal Groundwork (texture — do not explain, only plant)
- Plant one subtle observable beat related to: "The initial discovery of the body shifts the dynamics among the characters, leading to heightened suspicions regarding their motives". Do not explain significance yet.
- Plant one subtle observable beat related to: "The hidden-truth about the clock's tampering earlier conversations and interactions, casting doubt on the alibis presented". Do not explain significance yet.
- Plant one subtle observable beat related to: "Finally, the confrontation at the climax forces each character to confront their truths, altering their relationships and personal trajectories moving forward". Do not explain significance yet.

FAIR-PLAY AND INFERENCE CONTRACT (from CML logic):
- False assumption in force: The time of death is indicated by the clock in the study.
- Hidden truth to progressively expose: The clock was tampered with to misrepresent the actual time of death.
- Inference path checkpoints to dramatize clearly (observation -> correction -> effect):
  - Step 1: obs: The clock in the study shows ten minutes past eleven when found. | corr: The clock's time does not match the witness accounts of the time of death. | effect: Narrows the time of death to a later hour than the clock indicates.
  - Step 2: obs: A half-burnt candle found on the desk indicates the victim was alive later than the clock's time. | corr: The candle's burn time contradicts the clock's reading. | effect: Eliminates the clock's time as the true indicator of death.
  - Step 3: obs: Witnesses recall the last conversation with the victim occurred after the clock's indicated time. | corr: This indicates that the victim was alive longer than the clock suggests. | effect: Narrows the suspect pool by eliminating anyone who could not have been present at that later time.
- Discriminating test method: trap
- Discriminating test design constraint: Re-enact the clock's striking mechanism to show it was tampered with, revealing the true time of death.
- Test must rely on already-shown clue IDs: clue_1, clue_2, clue_3, clue_core_contradiction_chain, clue_mechanism_visibility_core
- Fair-play rationale: Step 1: The clock time and witness accounts (early) reveal a discrepancy. Step 2: The half-burnt candle (mid) indicates the victim was alive longer. Step 3: The re-enactment of the clock's striking mechanism (discriminating test) reveals the tampering.
- Never solve by withheld information. Keep reader-information parity with detective reasoning.

## Character Reference

### Captain Ivor Hale
Ivor's speech is direct and to the point, often devoid of embellishment
He rarely indulges in small talk and prefers to address matters with a no-nonsense attitude, though an unexpected sardonic remark can sometimes slip through.
Ivor is plagued by a moral struggle between his sense of honor and the resentment he feels toward a family that has long since moved on from his wife’s service. The death of the victim forces him to confront the ghosts of his past, raising questions about forgiveness and the importance of letting go.

### Beatrice Quill
Beatrice speaks with a quick, lively cadence, often punctuating her observations with dry humor
She has a knack for turning a phrase, using her wit to disarm those around her.
Beatrice grapples with the ethics of her profession, torn between her ambition and the potential consequences of her actions. The desire for revenge clashes with her journalistic integrity, leaving her in a moral quandary.


## CHARACTER CONTRACTS (binding for this scene)
Each entry below constrains how this character must be written in this chapter.
These override generic style guidance when they conflict.

### Captain Ivor Hale
Voice & mannerisms: Ivor's speech is direct and to the point, often devoid of embellishment. He rarely indulges in small talk and prefers to address matters with a no-nonsense attitude, though an unexpected sardonic remark can sometimes slip through.
Sample voice fragments (match this register and rhythm):
  [comfortable] "Honor is all I have left; it's what defines me."
  [evasive] "I was just preparing for the charity event, nothing more."
Humour: blunt — deploy occasionally (level 0.4)
FORBIDDEN phrase (never write for Captain Ivor Hale): "she chose her words with great care"
Act 2 behaviour contract: May show unease, evasion, or mild defensiveness when questioned. One behavioural tell is permitted. Internal conflict emerging: "Ivor is plagued by a moral struggle between his sense of honor and the resentment he feels toward a family that has long since moved on from his wife’s service. The death of the victim forces him to confront the ghosts of his past, raising questions about forgiveness and the importance of letting go."

### Beatrice Quill
Voice & mannerisms: Beatrice speaks with a quick, lively cadence, often punctuating her observations with dry humor. She has a knack for turning a phrase, using her wit to disarm those around her.
Sample voice fragments (match this register and rhythm):
  [comfortable] "Every story has layers, just waiting to be peeled back, don't you agree?"
  [evasive] "I simply arrived to gather the latest news—a journalist's duty!"
Humour: sardonic — deploy frequently (level 0.7)
FORBIDDEN phrase (never write for Beatrice Quill): "palpable tension filled the room"
Act 2 behaviour contract: May show unease, evasion, or mild defensiveness when questioned. One behavioural tell is permitted. Internal conflict emerging: "Beatrice grapples with the ethics of her profession, torn between her ambition and the potential consequences of her actions. The desire for revenge clashes with her journalistic integrity, leaving her in a moral quandary."



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
Little Middleton Manor looms over the surrounding countryside, a grand but isolated estate shrouded in secrets and whispers.

Key Locations Available:
- The Library (interior): Crime scene
- The Drawing Room (interior): Gathering space
- The Servants' Hall (interior): Gathering space for staff

Atmosphere: Tense and foreboding, reflecting underlying class struggles and personal secrets.
Weather: Overcast with intermittent rain, typical of the English countryside in autumn.

Era markers: Domestic wiring frequently fails, leaving parts of the house dimly lit. | Petrol touring cars parked haphazardly on the gravel drive. | Typewriters can be heard clacking in the study, composing letters of intrigue.

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
  - Visual: Shadows loom between the shelves, creating an eerie play of light and dark that seems to whisper secrets., The faded upholstery of a large armchair, its fabric worn and frayed, sits invitingly near a crackling fire.
  - Sounds: The soft rustle of pages turning is the only sound, mingling with the faint patter of rain against the window., Occasional creaks from the old wooden floorboards add to the sense of unease, as if the room itself is alive.
  - Scents: The musty scent of old books mixes with the faint aroma of polished wood, creating an atmosphere of nostalgia., A hint of smoke from the fireplace lingers in the air, adding warmth to the otherwise cold space.
  - Touch: The smooth, cool surface of the mahogany desk contrasts sharply with the rough texture of the aged carpet beneath., The heavy, leather-bound volumes feel solid in hand, their spines cracked from years of use.

The Drawing Room (interior):
  - Visual: The heavy drapes are drawn tight, blocking out the dreary light from outside and casting the room in a somber gloom., A large, ornate mirror hangs above the fireplace, its surface slightly tarnished, reflecting the room's somber atmosphere.
  - Sounds: The faint sound of a clock ticking fills the silence, a reminder of the passing time that weighs heavily on the occupants., Occasional laughter echoes from the adjoining rooms, creating a stark contrast to the oppressive atmosphere of the drawing room.
  - Scents: The air is thick with the scent of stale tobacco, remnants of conversations held in hushed tones., A faint floral fragrance lingers, perhaps from a vase of wilting flowers on the mantelpiece, adding to the sense of decay.
  - Touch: The plush velvet of the settees invites comfort, but the oppressive atmosphere makes it difficult to relax., The coolness of the marble fireplace contrasts with the warmth of the room, creating an unsettling juxtaposition.

The Servants' Hall (interior):
  - Visual: Faded wallpaper peels at the corners, revealing bare plaster beneath, and a large clock hangs on the wall, ticking away the minutes., The room is dimly lit, with a single gas
[truncated for prompt budget]

## Texture Pool
Draw on these as opportunities arise — you are not required to use them.

- April 1932 unfolds in a muted palette of grays and greens across the English countryside, with the air heavy with moisture from frequent rain showers
- The arrival of spring brings a mixture of anticipation and dread, as the Easter holiday approaches, yet the echoes of a struggling economy resonate throughout the estate
- In the drawing rooms of the country house, the atmosphere is charged, with guests exchanging polite smiles that barely mask underlying tensions, their conversations often veering towards the precarious state of affairs both in England and abroad
- The world outside is awakening, yet inside, secrets simmer like the brewing storm clouds overhead
- Fashion in this spring of 1932 is a reflection of both tradition and modernity, with men donning tailored tweed suits complemented by sharp, geometric ties that hint at the Art Deco movement

TEMPORAL CONTEXT:

This story takes place in April 1932 during spring.

Seasonal Atmosphere:
- Weather patterns: overcast skies, intermittent rain showers, cool breezes
- Daylight: Days are gradually lengthening, with twilight lingering well into the evening.
- Seasonal activities: spring gardening, Easter egg hunts, country walks amidst blooming flora
- Seasonal occasions: Easter Sunday (April 17, 1932)
- Season: spring

Period Fashion (describe naturally):
- Men formal: tweed three-piece suit, crisp white dress shirt, silk tie with geometric patterns
- Men casual: corduroy trousers, lightweight wool v-neck sweater, casual button-down shirt
- Men accessories: fedora hat, leather gloves, watch chain with a fob
- Women formal: tea-length dress with floral prints, tailored jacket with padded shoulders, cloche hat
- Women casual: ankle-length skirt with a blouse, light cardigan, simple cotton dress
- Women accessories: string of pearls, satin handbag, silk scarf

Cultural Context (reference naturally):
- Music/entertainment: 'Ain't She Sweet' by Milton Ager, 'My Blue Heaven' by Walter Donaldson, 'The Birth of the Blues' by Ray Henderson; Films: 'The Front Page', 'The Smiling Lieutenant'; Theatre: 'The Royal Family', 'The Green Pastures'; Radio: BBC Radio news broadcasts, variety shows featuring comedic sketches
- Typical prices: Loaf of bread: four pence, Pint of milk: two pence, Cinema ticket: one shilling
- Current events: The London Economic Conference is ongoing, discussing recovery from the Great Depression; Political tensions rise as discussions of unemployment and welfare reform are debated in Parliament
- Literature: 'Brave New World' by Aldous Huxley | 'Murder in the Cathedral' by T.S. Eliot | 'The Glass Key' by Dashiell Hammett | [mystery novels] | [social realism] | [political commentary]
- Technology: the radio broadcasting system becomes more common in homes | advancements in cinema technology with sound films | early developments in commercial aviation | typewriters in offices | electric lighting in homes, though often unreliable | petrol-driven cars for personal transport
- Daily life: visiting local markets, participating in church events, taking leisurely strolls in gardens
- Social rituals: afternoon tea gatherings, Sunday church attendance, family dinners on special occasions

Atmospheric Details:
The chill of the spring air carries the scent of damp earth and blooming wildflowers. The sound of rain pattering against the window, punctuated by the distant calls of birds returning from migration. A sense of unease permeates the estate, as shadows deepen with each passing hour, hinting at secrets lurking beneath the surface.

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
- Social commentary: Characters discuss current events n
[truncated for prompt budget]

NON-NEGOTIABLE CHAPTER OBLIGATIONS — LOCKED EVIDENCE PHRASES (VERBATIM REQUIRED):
The following physical evidence values are absolute ground truth. Every time this chapter describes, mentions, or alludes to the relevant evidence — no matter how briefly — it MUST use the exact phrase shown below, character for character. NO paraphrase, approximation, rounding, or synonym is permitted.

FAILURE EXAMPLE: if the locked value is "at thirteen minutes to midnight" and you write "just before midnight" or "around midnight" — that is a HARD FAIL. You must write "at thirteen minutes to midnight". Equally, if the locked value is written in words, such as "ten minutes past eleven", and you convert it to figure-based clock notation — that is also a HARD FAIL. Words stay as words; figure forms are forbidden for word-phrased facts.

CRITICAL — WORD-PHRASED VALUES: If the canonical value is written out in words (e.g. a time like "ten minutes past eleven", or an amount like "forty minutes"), reproduce those exact words. DO NOT convert to figure-based time notation, twenty-four-hour format, or any other numeric shorthand. Correct: "ten minutes past eleven". WRONG: figure-based clock notation or numeric shorthand.

Locked facts:
  - The exact time shown on the stopped clock face: "ten minutes past eleven"
  - The exact amount the clock was wound back: "thirty minutes"

If a locked fact has no relevance to this chapter, omit it. But the moment you reference the underlying evidence, only the exact phrase above is acceptable.

⛔ CLUES TO SURFACE IN THESE CHAPTERS — mandatory:
The following evidence MUST be clearly observable to an attentive reader. Do not bury it in atmosphere or passing dialogue. Each clue must be concrete, specific, and noticeable:

• [clue_core_elimination_chain] Eliminates Dr. Mallory Finch because he was seen at the hospital during the time of the murder.
  Category: testimonial | Criticality: essential | Supports inference step 2
  Points to: This confirms Dr. Mallory Finch's alibi.

For each clue above: an attentive reader should be able to find, record, and later use it to reason toward the solution.

═══ NARRATIVE STATE (read-only — do not contradict) ═══

LOCKED FACTS — use verbatim whenever this evidence is described:
  • The exact time shown on the stopped clock face: "ten minutes past eleven"
  • The exact amount the clock was wound back: "thirty minutes"

CHARACTER PRONOUNS — never deviate from these:
  • Eleanor Voss: she/her/her
  • Dr. Mallory Finch: he/him/his
  • Captain Ivor Hale: he/him/his
  • Beatrice Quill: she/her/her

CLUES ALREADY REVEALED TO READER: clue_1, clue_2, clue_core_contradiction_chain, clue_culprit_direct_eleanor_voss, clue_mechanism_visibility_core, clue_6, clue_8 — do not reveal these as new information.

CONTINUITY HANDOFF — previous chapter closing beat:
  • "As Beatrice stood to leave, a sense of unease settled in her stomach. The pieces of the puzzle were beginning to fit together, yet the picture remained obscured. The clock's time and the half-burnt candle were clues that pointed to a deeper mystery. Dr. Finch'..."
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
study, estate, corridor

✓ RULE: Continue using this location vocabulary. Maintain consistency with established setting type.
✓ Do NOT introduce new location types that contradict earlier chapters.

**Recent Chapter Summary (for narrative continuity):**
Chapter 2: Chapter 2: Witness Statement
  Events: "I just don't understand how it all happened," Eleanor Voss murmured, her voice trembling as she stood in the study of the Voss residence.
Chapter 3: Chapter 3: Contradictory Evidence
  Events: Beatrice stepped closer to the clock, her heart racing as she considered the implications of its frozen time.
Chapter 4: Chapter 4: Interview with Dr. Finch
  Events: The late afternoon light filtered through the windows of the local hospital, casting a muted glow over the busy, chaotic scene.

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
Known location profile anchors: Little Middleton Manor, The Library, The Drawing Room, The Servants' Hall, the local pub
LOCATION NAME CAPITALISATION (HARD REQUIREMENT — validated):
All named locations in your prose MUST use the EXACT capitalisation from the CML profiles.
Canonical forms: "Little Middleton Manor", "The Library", "The Drawing Room", "The Servants' Hall", "the local pub"
Writing a location in lowercase (e.g. "drawing room" instead of "Drawing Room") is a validated error. Every time you mention a named location, copy its capitalisation from the list above.
- Chapter 5: OPENING STYLE (HARD): Start the VERY FIRST SENTENCE with a temporal subordinate clause — e.g. "When [Name] entered…" / "After the last guest…" / "Before the household had stirred…" / "As the light faded…". Anchor opening in "the local pub". HARD REQUIREMENT for the first 2 paragraphs: (a) include 2+ sensory words — choose from smell/scent/sound/echo/silence/creak/whisper/cold/warm/damp/rough/smooth/glow/shadow/flicker/dim — and (b) include 1+ atmosphere/time word — choose from rain/wind/fog/storm/mist/thunder/evening/morning/night/dawn/dusk/season/afternoon/midday/noon/midnight/twilight/sunrise/sunset/daylight/sunlight/overcast/cloudy/bright/dark. These are validated requirements, not style suggestions; missing them triggers a retry.

[⚠ INTERNAL QUALITY DIAGNOSTICS — DO NOT REPRODUCE ANY PART OF THIS SECTION IN YOUR STORY OUTPUT. These are private generator observations for your consideration only. Your narrative must read as if this section does not exist. Never include phrases from this block in character dialogue, narration, or description.]

PRIOR CHAPTER QUALITY OBSERVATIONS:
- Chapter 3 (score 85/100):
  Quality gaps noted: word density below preferred target (615/1000); scene grounding weakness
  Address in upcoming chapters: Increase chapter density with concrete investigation action and sensory-grounded beats; avoid recap-only padding. | Open next chapter with a named location anchor plus at least two sensory cues and one atmosphere marker.
- Chapter 4 (score 96/100):
  Quality gaps noted: word density below preferred target (949/1000); scene grounding weakness
  Address in upcoming chapters: Increase chapter density with concrete investigation action and sensory-grounded beats; avoid recap-only padding. | Open next chapter with a named location anchor plus at least two sensory cues and one atmosphere marker.
- Phrases to avoid (already overused in earlier chapters): "mentioned hearing the clock strike the hour", "from a distant relative someone who had", "a distant relative someone who had been", "distant relative someone who had been watching", "we didn t comply with their demands", "didn t comply with their demands the", "the kind of motive that could drive", "kind of motive that could drive someone", "of motive that could drive someone to".
[END INTERNAL DIAGNOSTICS]

PROMPT BUDGET SUMMARY: budget=32000 tokens; fixed=10385; context=10392; dropped=[none]; truncated=[location_profiles, temporal_context]

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
8. Integrate at least two concrete era-grounded details per chapter from setting refinement signals: domestic wiring with frequent outages | petrol touring cars on county roads | typewriters standard in offices | party-line telephone exchange in rural areas | telegram service via nearest town office | airmail services available for urgent correspondence.
9. Respect setting movement/access constraints in scene action and alibis: manor layout creates natural barriers to movement between rooms | gardens provide limited visibility for outside observation | weather conditions can affect evidence collection and outdoor movement | certain areas of the manor are off-limits to staff and guests | restricted access to the estate's library and study where sensitive documents may be kept.
10. Sustain social coherence with this backdrop pressure: A family gathering for a contentious estate meeting amidst the Great Depression forces heirs, staff, and outsiders into a tense atmosphere where class tensions and hidden agendas collide.
11. Maintain continuity around these socially central cast anchors where relevant: Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill.
12. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Critical: Plot similarity 0.75 with 'The Mysterious Affair at Styles' (same temporal axis and false assumption about time of death)
13. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Moderate: Character similarity 0.70 with 'The Mysterious Affair at Styles' (similar character roles and dynamics)
14. STORY TO DATE ANTI-COPY RULE: The STORY TO DATE section below is provided for chronological and factual reference ONLY. You MUST NOT copy, lightly rephrase, or structurally echo any sentence or paragraph from prior chapters. Every sentence in this chapter must be original prose unique to this scene. Reusing even a clause from prior chapter text will cause this attempt to fail immediately.

CRITICAL PROSE REQUIREMENTS:

The CML specifies exact requirements for certain validation-critical scenes. You MUST include these elements at the specified positions.

**Discriminating Test Scene (Act 3, Scene 4):**
Required elements: Execute the discriminating test, Observe the culprit's reaction or result, Draw conclusion about guilt
Test type: mechanical re-enactment

**Suspect Clearance Scenes:**
- Dr. Mallory Finch (Act 3, Scene 5): Prove his alibi with witness statements
  Clues: clue_1, clue_2
- Captain Ivor Hale (Act 3, Scene 5): Eliminate him by showing he was elsewhere during the critical time
  Clues: clue_1, clue_2

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
  - Location anchor: the local pub.
  - Opening atmosphere (MANDATORY — validator enforced): the first paragraph MUST contain at least one of: rain / wind / fog / storm / mist / thunder / evening / morning / night / dawn / dusk / season / afternoon / midday / noon / midnight / twilight / sunrise / sunset / daylight / sunlight / overcast / cloudy / bright / dark. A chapter that omits all of these from its opening paragraph will be rejected.
  - Continuity bridge: in the first 120 words, visibly connect from the previous chapter's final beat. Carry forward one unresolved element (object, accusation, emotional pressure, or immediate physical action) from: "As Beatrice stood to leave, a sense of unease settled in her stomach. The pieces of the puzzle were beginning to fit together, yet the picture remained obscured. The clock's time and the half-burnt candle were clues that...".
  - CLUE OBLIGATIONS — mandatory prose elements (do NOT omit or bury):
    • Eliminates Dr. Mallory Finch because he was seen at the hospital during the time of the murder. [clue_core_elimination_chain]
      Points to: This confirms Dr. Mallory Finch's alibi.
  - Tonal contrast: include at least one beat of relief or ironic counterpoint. Do not sustain maximum tension for every paragraph.

- Tonal contrast required: the previous chapter was high-tension. This chapter must include at least one beat of relief, pause, or quiet observation.
- Locked fact phrase obligations:
  - If this batch mentions The exact time shown on the stopped clock face, write exactly: "ten minutes past eleven".
  - If this batch mentions The exact amount the clock was wound back, write exactly: "thirty minutes".
- Seasonal vocabulary allow-list: spring, vernal, springtime.
- Forbidden seasonal words: summer, autumn, winter.

FROZEN TIMELINE STATE (DO NOT ALTER):
- Timeline anchor: April (spring).
- Month, season, weather, and time-of-year language in this batch must stay compatible with spring.
- Established timeline fact: clock time shows ten minutes past eleven
- Established timeline fact: witness recalls hearing the clock strike the hour
- If referenced, use exact time phrase: "ten minutes past eleven" (The exact time shown on the stopped clock face).
- If referenced, use exact time phrase: "thirty minutes" (The exact amount the clock was wound back).

STORY TO DATE (REFERENCE ONLY — DO NOT COPY VERBATIM):
- Full prior chapter text is provided below for continuity, factual consistency, and reference accuracy.
- Use this to keep character voice, chronology, clue state, and location continuity aligned with earlier chapters.
- Do not quote, copy, or paraphrase these paragraphs too closely; write fresh prose that remains consistent with them.

--- BEGIN PRIOR CHAPTER 1 ---
Title: Chapter 1: Discovery
The morning light filtered through the heavy drapes of the study in the Voss residence, casting long shadows that danced across the polished mahogany desk. Outside, the overcast sky threatened rain, a fitting backdrop for the somber atmosphere within. Beatrice Quill stepped cautiously into the room, her senses heightened by the weight of the moment. The air was thick with an unsettling tension, a silence that pressed against her ears like a whisper of secrets yet to be unveiled. As she moved closer to the desk, her gaze fell upon the clock, its hands frozen in time, marking ten minutes past eleven. The sight sent a shiver down her spine, for it was a harbinger of the tragedy that had unfolded here just hours before.

Beatrice leaned closer, her breath catching as she took in the details. The clock in the study showed ten minutes past eleven when found. It was a stark reminder of the last moments of the victim's life, and the implications were chilling. If the clock was to be believed, the victim had died no later than this time, a fact that could unravel the carefully woven alibis of those who had been present. The evidence was damning, and Beatrice felt a surge of determination as she considered the ramifications. Each of the suspects had access to the victim, and this detail could be the key to unlocking the truth behind the murder.

Eleanor Voss stood nearby, her expression a mixture of disbelief and dread. She stared at the clock, her hands trembling as she recalled the last conversation with the victim, a conversation that now seemed to echo ominously in her mind. 'I can't believe this is happening,' Eleanor murmured, her voice barely above a whisper. 'What will become of us?' The weight of her words hung heavy in the air, a testament to the precariousness of her situation. Beatrice noted the way Eleanor's eyes darted toward the door, as if expecting someone to burst in and shatter the fragile calm that had settled over the room.

Beatrice turned her attention back to the clock, her mind racing with possibilities. The time it indicated was crucial, yet she couldn't shake the feeling that something was amiss. The clock's stillness felt almost deliberate, as if it had been tampered with to mislead. She recalled the witness accounts that had mentioned hearing the clock strike the hour, but now they seemed to contradict the very evidence before her. The implications were staggering; if the clock had been wound back, it could mean that the victim had been alive longer than anyone had assumed, and that opened a new avenue of inquiry. Who would benefit from such deception?

Eleanor's voice broke through her thoughts, laced with a hint of desperation. 'I was the last person to see her alive, you know. I... I can't help but think that I might be implicated in this.' Beatrice turned to her, noting the sheen of perspiration on Eleanor's brow. 'You mustn't jump to conclusions, Eleanor. We need to gather all the facts before making any assumptions.' Yet, as she spoke, Beatrice felt a gnawing unease. Eleanor's proximity to the victim and the circumstances of their last interaction painted a troubling picture. What had transpired in those final moments?

The clock's presence loomed large, a silent witness to the events that had transpired. Beatrice knew that the path to the truth would be fraught with obstacles, yet she felt a flicker of resolve ignite within her. She had come to uncover the story, to peel back the layers of deceit that shrouded the Voss residence. As she began to question Eleanor about the events leading up to the murder, the tension in the room thickened, each word exchanged a step deeper into the labyrinth of intrigue. 'Tell me everything you remember,' Beatrice urged, her pen poised over her notebook. 'Every detail could be vital.'

Eleanor hesitated, her eyes darting around the room as if searching for the right words. 'We were discussing family matters, the estate... there was talk of debts, of threats. She was worried, and I tried to reassure her. But I could see the fear in her eyes.' Beatrice noted the shift in Eleanor's demeanor, the way her hands clenched and unclenched at her sides. 'What kind of threats?' she pressed, sensing the gravity of the conversation. Eleanor's gaze fell to the floor, as if the weight of her secrets was too much to bear. 'There were whispers, rumors of financial ruin... and then there was that letter.'

The mention of the letter piqued Beatrice's interest. 'What letter?' she asked, her pen poised, ready to capture every word. Eleanor glanced up, her expression a mixture of fear and determination. 'It was from a distant relative, someone who had been watching our family closely. They threatened to expose our financial troubles if we didn't comply with their demands.' The revelation sent a jolt through Beatrice. This was the kind of motive that could drive someone to desperation, to commit unspeakable acts to protect their own. The pieces were beginning to spring into place, yet the picture remained obscured, shrouded in shadows and half-truths.

As Beatrice continued to question Eleanor, the atmosphere in the study shifted, the tension palpable. Every word exchanged felt like a step closer to the truth, yet the uncertainty lingered like a specter in the corner of the room. The clock, still frozen at ten minutes past eleven, served as a constant reminder of the urgency of their situation. With each tick of the second hand, the mystery deepened, and Beatrice knew that time was running out to uncover the truth behind the murder that had shattered the fragile peace of the Voss residence.
--- END PRIOR CHAPTER 1 ---

--- BEGIN PRIOR CHAPTER 2 ---
Title: Chapter 2: Witness Statement
"I just don't understand how it all happened," Eleanor Voss murmured, her voice trembling as she stood in the study of the Voss residence. The late morning light filtered through the heavy drapes, casting a soft glow that did little to dispel the anxious atmosphere. Outside, the rain began to spring, a steady patter against the window that mirrored the turmoil within. Beatrice Quill observed Eleanor closely, noting the way her hands fidgeted with the delicate fabric of her dress, as if seeking comfort in its familiar texture. The clock on the mantelpiece, frozen at ten minutes past eleven, seemed to mock them both, a silent witness to the tragedy that had unfolded just hours before.

As Beatrice stepped closer to the clock, she felt a chill run down her spine. The time shown on the stopped clock face was ten minutes past eleven, a detail that weighed heavily in the room. It was a stark reminder of the last moments of the victim's life, and Beatrice's mind raced with the implications. If the clock was to be believed, the victim had died no later than this time. Yet, Eleanor's account of the events leading up to the murder was already beginning to unravel, casting doubt on the clock's reliability. The witness accounts she had gathered mentioned hearing the clock strike the hour, but now they seemed to contradict the very evidence before her. What could it mean if the clock had been tampered with? Who would benefit from such deception?

Eleanor's brow furrowed as she struggled to recall the details of her last conversation with the victim. "We were discussing family matters, the estate... there was talk of debts, of threats. She was worried, and I tried to reassure her. But I could see the fear in her eyes," she said, her voice quivering slightly as she spoke. Beatrice noted the way Eleanor's gaze flickered toward the door, as if she feared someone might overhear. It was clear that the weight of the conversation still lingered in her mind, but the specifics were elusive. The tension in the room thickened, and Beatrice pressed on, determined to uncover the truth.

"What kind of threats?" Beatrice asked, her pen poised over her notebook. Eleanor hesitated, her fingers twisting the hem of her dress, a sign of her inner turmoil. "There were whispers, rumors of financial ruin... and then there was that letter," she finally admitted, a note of desperation creeping into her voice. The mention of the letter piqued Beatrice's interest. This was the kind of motive that could drive someone to desperation, to commit unspeakable acts to protect their own. Yet, as Eleanor spoke, Beatrice couldn't shake the feeling that something was amiss. The timeline of events was beginning to conflict with the evidence before her.

Eleanor continued, her voice barely above a whisper. "I was the last person to see her alive, you know. I... I can't help but think that I might be implicated in this." Beatrice turned to her, noting the sheen of perspiration on Eleanor's brow. "You mustn't jump to conclusions, Eleanor. We need to gather all the facts before making any assumptions," Beatrice urged, though her own unease was growing. The proximity of Eleanor to the victim and the circumstances of their last interaction painted a troubling picture. What had transpired in those final moments? The clock's presence loomed large, a silent witness to the events that had transpired.

As Eleanor recounted the details, Beatrice's mind raced with the implications of what she was hearing. "You mentioned the letter—what did it say?" she pressed, eager to extract every detail. Eleanor's eyes widened, and she swallowed hard before answering. "It was from a distant relative, someone who had been watching our family closely. They threatened to expose our financial troubles if we didn't comply with their demands." The revelation sent a jolt through Beatrice, as the pieces began to spring into place. This was the kind of motive that could lead to desperate actions. Yet, the more Eleanor spoke, the more Beatrice sensed inconsistencies in her account.

The tension in the room was palpable, each word exchanged a step deeper into the labyrinth of intrigue. Beatrice felt the weight of the moment pressing down on her, the urgency of the investigation driving her forward. As Eleanor's voice faltered, Beatrice seized the opportunity to clarify the timeline. "You said you were discussing family matters just before she died. Can you recall the exact time?" Eleanor hesitated, her brow furrowing in concentration. "I... I believe it was just after ten. But the clock... it was already broken, wasn't it?" Beatrice's heart raced at the implication. If Eleanor's memory was correct, it meant the clock's time was not just a mere coincidence; it was a crucial piece of evidence that could unravel the entire case.

The clock, with its hands frozen at ten minutes past eleven, became a focal point in Beatrice's mind. She needed to verify the timelines, to understand how Eleanor's recollections aligned—or misaligned—with the evidence. As Eleanor continued to speak, Beatrice made a mental note to gather further witness statements, to cross-reference the accounts and uncover the truth buried beneath layers of deceit. The rain outside intensified, a fitting backdrop to the storm brewing within the study. With each passing moment, Beatrice felt the urgency of the investigation grow, the stakes rising higher as she sought to untangle the web of lies that surrounded Eleanor and the victim.

Eleanor's voice trembled as she concluded her account, a mixture of fear and desperation etched on her features. Beatrice placed her notebook aside, her mind racing with the implications of what she had just heard. The discrepancies in Eleanor's timeline were troubling, and the clock's time did not match the witness accounts of the time of death. As the rain continued to spring, Beatrice knew that the path to the truth would be fraught with obstacles, yet she felt a flicker of resolve ignite within her. She had come to uncover the story, to peel back the layers of deceit that shrouded the Voss residence. The investigation had only just begun.
--- END PRIOR CHAPTER 2 ---

--- BEGIN PRIOR CHAPTER 3 ---
Title: Chapter 3: Contradictory Evidence
At one o'clock in the afternoon, the rain fell steadily against the windowpanes of the study of the Voss residence, creating a rhythmic backdrop to the tension that hung in the air. The damp scent of rain mingled with the musty odor of old books, filling the room with a sense of foreboding. Beatrice Quill stood near the desk, her gaze fixed on the clock, its hands eerily frozen at ten minutes past eleven. The stillness of the timepiece felt like a taunt, a reminder of the life that had been extinguished so close to this very spot. Eleanor Voss lingered nearby, her posture rigid, as if the weight of the moment pressed down upon her like a heavy shroud.

Beatrice stepped closer to the clock, her heart racing as she considered the implications of its frozen time. The clock's time did not match the witness accounts of the time of death, a detail that could unravel the carefully constructed narratives of those present. If the clock was indeed accurate, it suggested that the victim had died no later than ten minutes past eleven. Yet, the witness accounts had mentioned hearing the clock strike the hour, raising unsettling questions about its reliability. What if someone had tampered with it to create a false alibi? Who stood to gain from such deception?

Turning her attention back to the desk, Beatrice's eyes caught sight of a half-burnt candle, its wax dripped and hardened, a testament to the passage of time since the victim's last moments. The candle indicated that the victim had been alive later than the clock's time, a contradiction that deepened the mystery surrounding the case. Beatrice's mind raced, piecing together the implications of this new evidence. If the victim had indeed been alive longer than the clock suggested, it cast doubt on Eleanor's account of her final interactions with the deceased.

Eleanor's demeanor shifted as Beatrice pressed for clarity, her eyes darting away as if searching for an escape from the mounting scrutiny. 'I... I was just trying to help her,' Eleanor stammered, her voice barely above a whisper. 'We were discussing family matters, and I thought I could reassure her about our situation. But now... now I fear I might be implicated.' Beatrice noted the tremor in Eleanor's voice, the way her hands wrung the fabric of her dress as if seeking comfort in its familiar texture. The tension in the room thickened, and Beatrice sensed that Eleanor was hiding something crucial.

Beatrice took a step closer, her gaze unwavering. 'You mentioned threats, Eleanor. What exactly did you mean by that?' The question hung in the air, heavy with unspoken implications. Eleanor hesitated, her breath hitching as she considered her response. 'There were whispers about our financial troubles. A letter from a distant relative warned us of exposure if we didn't comply with their demands.' The admission sent a jolt through Beatrice, as the pieces of the puzzle began to align. This was the kind of motive that could drive someone to desperate actions, yet Eleanor's shifting gaze suggested there was more to the story.

As Eleanor continued to speak, Beatrice felt the urgency of the investigation grow. The clock's frozen hands and the half-burnt candle were more than mere objects; they were symbols of the tangled web of deceit that surrounded the Voss family. Each detail, each nuance of Eleanor's account, could hold the key to unraveling the truth. Beatrice's resolve solidified as she prepared to dig deeper, determined to confront the shadows that loomed over the case. The rain outside intensified, a fitting backdrop to the storm brewing within the study, as Beatrice steeled herself for the revelations yet to come.
--- END PRIOR CHAPTER 3 ---

--- BEGIN PRIOR CHAPTER 4 ---
Title: Chapter 4: Interview with Dr. Finch
The late afternoon light filtered through the windows of the local hospital, casting a muted glow over the busy, chaotic scene. The sounds of hurried footsteps and distant conversations filled the air, punctuated by the occasional wail of a patient or the clatter of medical equipment. Beatrice Quill stepped into the bustling corridor, her heart racing as she recalled the urgency of her investigation. Just hours earlier, Eleanor Voss had revealed her fears of being implicated in the murder of her relative, a revelation that weighed heavily on Beatrice's mind. The clock's frozen hands and the half-burnt candle in the study were more than mere objects; they were symbols of the tangled web of deceit surrounding the Voss family. Now, he needed to gather more information, and the doctor Finch was the next piece of the puzzle.

As Beatrice approached Dr. Finch's office, he noted the slight tremor in his hands, a reflection of the tension that had settled in his chest. He had heard whispers about the doctor’s past, his philanthropic efforts shadowed by a gambling addiction that had put him at odds with the very life he portrayed. The door creaked open, revealing Dr. Finch seated at his desk, surrounded by stacks of patient files. His brow furrowed as he looked up, a flicker of anxiety crossing his features. 'Ah, Miss Quill,' she said, her voice measured yet strained. 'What brings you here today?'

Beatrice took a seat across from her, her notebook poised and ready. 'I need to ask you about the time of the murder, Dr. Finch. You were attending to patients, correct?' He watched as he nodded, his hands shaking slightly as he fidgeted with a pen. 'Yes, yes, I was here at the hospital. I had a full schedule that day,' he replied, his eyes darting away from his. Beatrice noted the nervousness in her demeanor; it was a detail that could not be overlooked. 'Can you provide any specific times or names of patients you attended to during that period?'

Dr. Finch hesitated, his gaze dropping to the desk as he struggled to recall the details. 'I... I don’t have the records with me, but I assure you, I was busy. I wouldn’t have left my patients unattended.' Her voice was firm, yet Beatrice sensed an underlying tension. 'You understand the importance of this, don’t you? The clock in the study showed ten minutes past eleven when the victim was found, but I need to know if your alibi holds up. Witnesses mentioned hearing the clock strike the hour, which complicates matters.'

The doctor’s expression shifted, a flicker of panic crossing his face. 'I... I can’t be certain about the exact times. There were many patients, and I was preoccupied with their needs.' She rubbed the back of her neck, a gesture that only heightened Beatrice's suspicions. 'Dr. Finch, you must understand that the victim was alive longer than the clock suggests. This indicates that you may have had the opportunity to be involved in his death.'

His eyes widened at her accusation, and he leaned back in his chair, visibly shaken. 'I would never harm her! She was a dear friend, and I was only trying to help her through her troubles. I swear I was here, attending to my patients.' Beatrice leaned forward, her tone softening slightly. 'I believe you, but the inconsistencies in your story raise questions. If you were indeed here, we need to verify your alibi with the hospital staff. Can you recall anyone who might confirm your presence?'

Dr. Finch's hands shook slightly as he spoke about the victim, his voice trembling with emotion. 'I was with his just days before... he confided in me about his fears, his financial troubles. I tried to reassure him, but I could see the weight of it all was too much for him.' Beatrice noted the sincerity in her voice, yet the anxiety that underpinned her words made her question her reliability. 'You mentioned financial troubles. Was there anything specific that worried her? Any threats?'

The doctor swallowed hard, her gaze shifting to the floor. 'There were whispers about her estate, debts that were piling up. She was worried about what might happen if things didn’t turn around.' Beatrice's mind raced as she connected the dots. Eleanor had mentioned a letter from a distant relative, someone who had been watching their family closely. 'Did she ever mention who was behind these threats?' Beatrice pressed, sensing that the doctor might hold more information than she was willing to share.

'No, he didn’t specify,' Dr. Finch replied, his voice barely above a whisper. 'But I could see the fear in his eyes. It was palpable.' Beatrice noted the doctor’s anxious demeanor, which only intensified her suspicions. 'Dr. Finch, if you were truly here during the time of the murder, we need to establish your alibi. I will need to speak with the staff and patients to corroborate your story.'

As Beatrice stood to leave, a sense of unease settled in her stomach. The pieces of the puzzle were beginning to fit together, yet the picture remained obscured. The clock's time and the half-burnt candle were clues that pointed to a deeper mystery. Dr. Finch's anxious demeanor raised more questions than it answered, and Beatrice couldn't shake the feeling that there was more to uncover. 'Thank you for your time, Dr. Finch. I will be in touch,' he said, his voice steady despite the turmoil within. As she stepped back into the bustling corridor, Beatrice felt the weight of the investigation pressing down on her. The truth was out there, hidden beneath layers of deceit, and she was determined to find it.
--- END PRIOR CHAPTER 4 ---

[SCENE COMPLETENESS CONTRACTS — MANDATORY. Each contract below lists what you MUST enact in that chapter. Do not summarise or mention these labels in the prose — enact them organically.]
Chapter 5 (Act 2) completeness contract:
  PIVOT ELEMENT (MANDATORY — write this into the prose, shown not told): "Captain Hale's boastful yet defensive demeanor"
  FACT ESTABLISHED (MANDATORY — reader must know this by chapter end): "Establishes Captain Hale's alibi as potentially unreliable."

# Case Overview
Title: The Clock of Deceit
Era: 1930s
Setting: Little Middleton
Crime: murder (mechanical tampering)
Culprit: Eleanor Voss
False assumption: The time of death is indicated by the clock in the study.
Cast: Eleanor Voss (she/her), Dr. Mallory Finch (he/him), Captain Ivor Hale (he/him), Beatrice Quill (she/her)

Setting Lock: Keep all scenes and descriptions consistent with the stated setting (Little Middleton). Do not introduce a different location type.

Outline scenes:
[
  {
    "sceneNumber": 5,
    "act": 2,
    "title": "Captain Hale's Alibi",
    "setting": {
      "location": "the local pub",
      "timeOfDay": "Evening",
      "atmosphere": "Lively and raucous"
    },
    "characters": [
      "Beatrice Quill",
      "Captain Ivor Hale"
    ],
    "purpose": "Establish Captain Hale's alibi and motives",
    "cluesRevealed": [
      "clue_core_elimination_chain"
    ],
    "dramaticElements": {
      "conflict": "Captain Hale's bravado seems forced.",
      "tension": "Rumors swirl around his past.",
      "microMomentBeats": [
        "Captain Hale's laughter feels hollow as he recounts the evening."
      ]
    },
    "summary": "At the local pub, Beatrice confronts Captain Hale about his whereabouts during the murder. He boasts of his alibi but seems defensive when pressed, hinting at a troubled past.",
    "estimatedWordCount": 1800,
    "pivotElement": "Captain Hale's boastful yet defensive demeanor",
    "factEstablished": "Establishes Captain Hale's alibi as potentially unreliable.",
    "permittedBehavioursByAct": [
      {
        "characterName": "Captain Ivor Hale",
        "behaviour": "normal social behaviour; grief or confusion if appropriate"
      },
      {
        "characterName": "Beatrice Quill",
        "behaviour": "normal social behaviour; grief or confusion if appropriate"
      }
    ],
    "redHerringPlacement": null,
    "emotionalRegister": "New revelations create tension, forcing characters to confront their motives.",
    "dominantCharacterNote": {
      "name": "Captain Ivor Hale",
      "voiceRegister": "Ivor's speech is direct and to the point, often devoid of embellishment."
    },
    "humourGuidance": {
      "permission": "forbidden"
    },
    "eraTextureNote": "Domestic wiring frequently fails, leaving parts of the house dimly lit.; Petrol touring cars are parked haphazardly on the gravel drive, indicating the limited means of transportation.; Typewriters can be heard clacking in the study, as the reliance on written communication remains strong amidst economic distress.",
    "locationRegisterNote": ""
  }
]
```

## Message 3 (role=user)

```text
BEFORE SUBMITTING YOUR JSON — verify this checklist:
□ Each chapter reaches the hard floor of 500 words and aims for 1250 words or more.
□ If you mention locked evidence, you used the exact locked phrase verbatim.
□ Allowed seasonal words only: spring, vernal, springtime.
□ Forbidden seasonal words: summer, autumn, winter.
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
