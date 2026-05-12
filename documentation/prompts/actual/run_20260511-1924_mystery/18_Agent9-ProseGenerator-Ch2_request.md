# Actual Prompt Record

- Run ID: `mystery-1778527480857`
- Project ID: ``
- Timestamp: `2026-05-11T19:30:09.783Z`
- Agent: `Agent9-ProseGenerator-Ch2`
- Operation: `chat_request_full_prompt`
- Model: `GPT-4o-mini`
- Temperature: `0.42`
- Max Tokens: `4500`
- Attempt: `first`
- Prompt Hash: `330f65d3675a604a`

## Message 1 (role=system)

```text
You are an expert prose writer for classic mystery fiction. Your role is to write compelling, atmospheric narrative chapters that read like a professionally published novel.

⛔ ABSOLUTE RULE — CHARACTER NAMES:
The ONLY characters who exist in this story are: Eleanor Voss (woman), Dr. Mallory Finch, Captain Ivor Hale (man), Beatrice Quill (woman).
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
- MORAL COMPLEXITY REQUIREMENT: The mechanism of this crime carries a moral gray area: "The murderer believed they were protecting a loved one from the victim's harmful intentions, complicating the morality of their actions." — the culprit reveal and denouement MUST acknowledge this ambiguity. Do not let the ending feel clean or simple. Give the reader at least one moment of uncomfortable sympathy or moral doubt.


⚠️ AMATEUR DETECTIVE STORY: The investigator is a civilian with no official standing. The official police (if they appear) are unnamed background figures only — "a constable", "the sergeant", "an officer from the village". Do NOT give any police official a name or title+surname combination. There is no Inspector [Surname], no Constable [Surname], no Sergeant [Surname] in this story.

PRONOUN ACCURACY — MANDATORY CONTINUITY CONTRACT
⚠ NON-BINARY CAST — SINGULAR THEY/THEM/THEIR ⚠
FORBIDDEN for Dr. Mallory Finch: she / her / herself / he / him / his / himself. Use only: they / them / their / themselves.
These are SINGULAR pronouns for ONE individual — not a group.
Example: "Dr. Mallory Finch adjusted their collar as they crossed the room." — correct.
Example: "Dr. Mallory Finch adjusted her collar as she crossed the room." — WRONG.


The following pronouns are locked facts, on the same level as character names
and hard-logic device values. Using the wrong pronoun is a continuity error,
not a style choice.

Canonical pronoun table (subject / object / possessive / reflexive):
  • Eleanor Voss: she/her/her/herself
  • Dr. Mallory Finch: they/them/their/themselves
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

## Era: 1933 April
April 1933 arrives with a cool, damp chill that permeates the English countryside, the air heavy with the scent of fresh earth and blooming flowers. Overcast skies often cast a gloomy pall over the estate, with occasional rain showers pattering against the windows of the grand manor house. The days grow longer, bringing a hint of warmth that invites families to engage in springtime activities, from preparing their gardens for planting to hosting Easter celebrations filled with egg hunts in the sprawling grounds. However, beneath the surface of these seasonal joys lies a tension, as discussions of societal shifts and political unrest loom large over the upper classes. Fashion in April 1933 reflects the elegance and restraint of the era, with men donning tailored three-piece suits crafted from light wool and women embracing knee-length dresses adorned with floral patterns. Cloche hats and tailored jackets are prominent, signaling a refinement that echoes the strict social hierarchies of the time. Accessories such as bowler hats for men and string pearls for women are common, each detail meticulously chosen to reflect one’s status. The influence of Art Deco is palpable, both in fashion and architecture, juxtaposing modernity with tradition in the manor's decor.
Emotional register: A collective anxiety permeates society, driven by economic uncertainty and escalating political tensions.
Physical constraints: Limited transportation options due to economic constraints. | Communication methods are slower, relying on letters and telegrams. | Access to resources is restricted by class and economic status.
Current tensions (weave into background texture): Political discussions surrounding fascism in Europe are intensifying. | The Great Depression continues to strain the economy and social relationships. | Class tensions are rising within communities, influencing social dynamics.
Wartime context — Though not currently engaged in active service, many families still feel the aftershocks of prior conflicts.: Communities remain tight-knit but are increasingly divided by class and financial disparity. Absence effect: The lack of a stable economy amplifies feelings of vulnerability and distrust among residents.

## Season Lock (mandatory — derived from 1933 April)
Season: spring. Allowed vocabulary: spring, vernal, springtime
Forbidden seasonal words — never use in narration, dialogue, or metaphor: summer, autumn, winter and their adjectival forms.
Every weather description, atmosphere, and time-of-year reference must be consistent with spring.

## Story Theme
In a world where class divisions and personal secrets collide, the quest for truth unravels the intricate web of human emotion and ambition, and reveals that evidence carries ethical weight, forcing characters to choose accountability over social performance when appearances and facts collide.

## Story Emotional Register
Dominant: The emotional journey is one of tension, revelation, and ultimately, catharsis.

Arc:
The story opens in the grand setting of Little Middleton Manor, where the air is thick with anticipation and the weight of societal expectations. Eleanor Voss, the diligent hostess, navigates the complexities of her family's legacy while hiding her own emotional scars tied to the victim. As tension rises, the murder of Eleanor becomes a catalyst for the unveiling of hidden truths, forcing each character to confront their past and their motivations. The first turn occurs when Dr. Mallory Finch's alibi begins to crumble under scrutiny, revealing the layers of ambition and resentment that plague their conscience.

Simultaneously, Captain Ivor Hale grapples with his own demons, torn between preserving his family’s honor and seeking revenge for old grievances. As the investigation unfolds, the second turn brings a pivotal moment when Beatrice Quill's aspirations clash with the reality of her financial burdens, creating a palpable sense of urgency. The emotional stakes escalate, leading to the climax where the truth surrounding the clock's manipulation is revealed, exposing the intricate web of deceit and ambition that has ensnared them all. Finally, resolution comes as the characters find a sense of closure, albeit tinged with regret, as they navigate the aftermath of the tragedy, learning that the quest for truth often reveals more than they are prepared to confront. The emotional register at the end resonates with a bittersweet acceptance, highlighting the complexities of human relationships amidst the backdrop of societal change.

## Emotional register at this point in the story
A sense of anticipation fills the air, setting the stage for the unfolding drama.

## Character Portraits (appearance & era)

### Eleanor Voss
Eleanor Voss embodies the tension of the era, as her role as a respected community member conflicts with her hidden past and the pressures of maintaining her family's reputation. The economic strains and societal expectations weigh heavily on her, pushing her to confront unresolved emotions tied to the victim's death.
Era intersection: Eleanor's struggle for closure amid rising class tensions reflects the broader societal anxieties of 1933, where personal and public lives intertwine.

### Dr. Mallory Finch
Dr. Mallory Finch's ambition and desperation are heightened by the financial strains of the Great Depression. As a physician, they navigate the expectations of their position while grappling with a personal vendetta that complicates their professional facade. Their aspirations are tightly woven into the fabric of the estate's social dynamics.
Era intersection: Mallory's plight underscores the conflict between personal ambition and moral integrity during a time of economic hardship.

### Captain Ivor Hale
Captain Ivor Hale represents the traditional values of honor and duty, yet he is also a product of his time, harboring resentments that threaten to unravel his reputation. The class struggles and personal conflicts surrounding the victim reflect the tensions brewing within society.
Era intersection: Ivor's internal battles resonate with the societal expectations of the 1930s, where personal grievances intersect with broader class issues.

### Beatrice Quill
Beatrice Quill's whimsical spirit is undercut by the financial burdens inherited from her father. Her aspirations to be a writer are stifled by the looming threat of poverty, reflecting the struggles of many in her social class during the Great Depression.
Era intersection: Beatrice's journey highlights the creative aspirations of the era, which struggle against the harsh realities of economic constraints.

## Character Voices

### Eleanor Voss (she/her/her)
Eleanor speaks with a measured cadence, often punctuating her observations with dry humor that hints at her intelligence and wit.
[comfortable] You know, I often find that a good book can offer the best company during gloomy days.
[evasive] Ah, the clock? I'm sure it's just a minor inconvenience; it has been around for ages.
[stressed] This is all too much. I can’t help but feel the weight of our family’s past pressing down on me.
Humour: Eleanor's dry wit surfaces in her observations, providing a glimpse of her inner thoughts.

### Dr. Mallory Finch (they/them/their)
Mallory speaks with a confident, almost theatrical flair, often employing sarcasm to mask their insecurities.
[comfortable] Isn't it fascinating how the body works? A mere tickle in the throat can lead to a grand catastrophe!
[evasive] Oh, those rumors? Simply the byproduct of idle minds and too much time on their hands.
[stressed] What if this all leads back to me? No, no, I must stay calm and collected.
Humour: Mallory's sardonic humor often serves as a shield against their underlying anxiety.

### Captain Ivor Hale (he/him/his)
Ivor speaks with a commanding presence, often punctuating his tales with self-deprecating humor that belies his tough exterior.
[comfortable] Back in my day, we navigated storms with little more than a compass and sheer determination.
[evasive] The past? A ship long sailed; I prefer to keep my focus on the horizon ahead.
[stressed] This situation reminds me of the perilous waters we once faced. I fear it may end poorly.
Humour: Ivor often employs self-deprecating humor, using it to mask his deeper frustrations.

### Beatrice Quill (she/her/her)
Beatrice speaks with a whimsical cadence, often punctuating her thoughts with observations that reveal her eccentricity.
[comfortable] Life's a story, isn't it? Full of unexpected twists and turns, much like my latest manuscript.
[evasive] Oh, I was merely wandering, lost in thought. Nothing to concern yourself about!
[stressed] I simply cannot bear the thought of losing everything I’ve worked so hard for!
Humour: Beatrice's observational humor brings a lightness to her otherwise burdensome reality.

## Location Registers (scene framing guides)

Drawing Room: The drawing room feels heavy with unspoken tension, as laughter and polite conversation mask the underlying anxieties of its inhabitants. The ornate decor and flickering lamps create an atmosphere that is both inviting and oppressive, a place where secrets linger just beneath the surface.. Camera angle: As a writer, entering this room evokes a sense of foreboding, as if each detail holds a secret waiting to be uncovered.. Era: The strict social hierarchies of the 1930s heighten the sense of expectation and propriety in this space.

Library: The library, with its towering shelves and dark wood paneling, invites exploration but also feels like a tomb of forgotten stories. Each dust-laden book holds the potential for revelation, adding to the tension of the unfolding mystery.. Camera angle: Writers entering this room should feel the weight of history pressing down, as if the walls themselves are whispering secrets.. Era: The neglect of this once-vibrant space reflects the broader societal decline amid the economic struggles of the era.

Cellar: The cellar is thick with an oppressive atmosphere, its dark corners hiding secrets that threaten to be unearthed. The dampness and shadows create a sense of unease, amplifying the mystery surrounding the events that have transpired.. Camera angle: Entering this space should evoke a sense of trepidation, as if the very air is charged with the weight of unspoken truths.. Era: The cellar serves as a stark reminder of the hidden struggles and forgotten histories that echo the broader societal tensions of the time.

Formal Gardens: The formal gardens, once a sanctuary of beauty, now reflect decay and neglect. The muted colors and overgrown paths evoke a sense of isolation, creating a backdrop for clandestine meetings and whispered secrets amid the lingering scent of damp earth.. Camera angle: Writers should enter this space with a sense of melancholy, aware that beneath the surface lies a world of secrets waiting to be discovered.. Era: The gardens' decline mirrors the social and economic struggles of the time, highlighting the disparity between appearance and reality.

## Humour guidance for this story position (opening)
Permission: forbidden
Rationale: The opening scene sets a serious tone, establishing the murder mystery that unfolds.

FAIR-PLAY AND INFERENCE CONTRACT (from CML logic):
- False assumption in force: The clock accurately reflected the time of death.
- Hidden truth to progressively expose: The clock was tampered with to mislead investigators.
- Inference path checkpoints to dramatize clearly (observation -> correction -> effect):
  - Step 1: obs: The clock in the study shows the hands pointing to eleven. | corr: The clock cannot be trusted as it was tampered with. | effect: Narrows the investigation to the clock's alteration.
  - Step 2: obs: A note found near the clock reads 'ten minutes past eleven'. | corr: This indicates a deliberate attempt to mislead regarding the time of death. | effect: Narrows suspicion to Dr. Mallory Finch, who had access to the clock.
  - Step 3: obs: Witnesses heard the clock striking the hour wrongly. | corr: The inconsistency suggests foul play regarding the time of death. | effect: Eliminates Beatrice Quill, who was not present in the clock room.
- Discriminating test method: trap
- Discriminating test design constraint: A controlled reenactment is staged where the clock is set to show the correct time and Dr. Finch's actions are scrutinized.
- Test must rely on already-shown clue IDs: clue_1, clue_2, clue_3, clue_6, clue_4
- Fair-play rationale: Step 1: The clock's incorrect striking and the dusty hands (early) reveal tampering. Step 2: The note near the clock (mid) indicates intentional deception. Step 3: The reenactment demonstrates the clock's manipulation (discriminating test).
- Never solve by withheld information. Keep reader-information parity with detective reasoning.

## Character Reference

### Eleanor Voss
Eleanor speaks with a measured cadence, often punctuating her observations with dry humor that hints at her intelligence and wit
She tends to use literary references in conversation, revealing her background as a teacher.
Eleanor is torn between her longing for closure and the guilt she feels for not having confronted the victim earlier about their shared past, fearing that the truth might shatter the façade of her respectable life.

### Dr. Mallory Finch
Mallory speaks with a confident, almost theatrical flair, often employing sarcasm to mask their insecurities
They have a tendency to over-explain medical concepts, revealing their desire to impress others.
Mallory grapples with the tension between their ambition and their ethical standards, questioning whether their desire for wealth is worth the potential moral compromise.

### Captain Ivor Hale
Ivor speaks with a commanding presence, often punctuating his tales with self-deprecating humor that belies his tough exterior
He has a penchant for nautical metaphors, which he uses to draw parallels with his life experiences.
Ivor struggles with the bitterness that comes from his past feud, torn between the desire for revenge and the recognition that such feelings may ultimately undermine his integrity.

### Beatrice Quill
Beatrice speaks with a whimsical cadence, often punctuating her thoughts with observations that reveal her eccentricity
She has a tendency to use metaphors and analogies that reflect her artistic nature.
Beatrice struggles with feelings of inadequacy and the fear that her dreams may be stifled by her financial burdens, leading her to question her worth as a writer.



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
Little Middleton Manor is an expansive estate steeped in tradition, where the echoes of class tensions and political unease reverberate through its grand halls.

Key Locations Available:
- Drawing Room (interior): Gathering space
- Library (interior): Clue discovery
- Cellar (interior): Crime scene
- Formal Gardens (exterior): Clue discovery, Isolation

Atmosphere: Tense due to underlying class tensions and recent political discussions regarding fascism.
Weather: Cool and overcast with occasional rain showers typical of the English countryside in autumn.

Era markers: Petrol touring cars navigating the muddy lanes of the estate. | Typewriters clacking away in the study, sending out letters that will never arrive. | Electricity flickering intermittently, leaving the manor in moments of darkness.

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
  - Visual: The flickering gas lamps cast a warm, yellow glow that contrasts sharply with the cold light streaming through the windows., A grand piano, its keys covered in dust, stands silently in the corner, a relic of happier gatherings.
  - Sounds: The soft creak of the floorboards as guests shift uncomfortably in their seats, each sound amplified in the stillness., Occasional whispers drift through the room, laced with tension as conversations turn to hushed tones.
  - Scents: The lingering scent of polished wood mingles with the faint aroma of tobacco smoke, remnants of a conversation long past., A hint of mildew clings to the air, a reminder of the dampness that seeps into the manor from the outside.
  - Touch: The upholstery feels worn and frayed beneath fingers, the fabric cool to the touch as if it has absorbed the chill of the autumn air., The weight of the heavy drapes is palpable, their texture coarse against skin, creating a barrier between the outside world and the secrets within.

Library (interior):
  - Visual: The dim light from a single gas lamp casts a warm glow over the room, illuminating the spines of books that seem to whisper forgotten tales., A large bay window overlooks the gardens, its glass fogged with moisture, creating a barrier between the outside world and the secrets within.
  - Sounds: The soft rustle of pages turning echoes in the stillness, as if the books themselves are alive and yearning to be read., The distant sound of rain pattering against the window creates a rhythmic backdrop, enhancing the sense of isolation.
  - Scents: The rich aroma of old paper and leather permeates the air, evoking a sense of nostalgia for the stories contained within the volumes., A faint scent of mildew lingers, a reminder of the dampness that has seeped into the room over the years.
  - Touch: The rough texture of the book spines feels familiar beneath fingertips, their surfaces cool and slightly clammy from the humidity., The polished surface of the oak table is smooth yet cold, a star
[truncated for prompt budget]

## Texture Pool
Draw on these as opportunities arise — you are not required to use them.

- April 1933 arrives with a cool, damp chill that permeates the English countryside, the air heavy with the scent of fresh earth and blooming flowers
- Overcast skies often cast a gloomy pall over the estate, with occasional rain showers pattering against the windows of the grand manor house
- The days grow longer, bringing a hint of warmth that invites families to engage in springtime activities, from preparing their gardens for planting to hosting Easter celebrations filled with egg hunts in the sprawling grounds
- However, beneath the surface of these seasonal joys lies a tension, as discussions of societal shifts and political unrest loom large over the upper classes
- Fashion in April 1933 reflects the elegance and restraint of the era, with men donning tailored three-piece suits crafted from light wool and women embracing knee-length dresses adorned with floral patterns

TEMPORAL CONTEXT:

This story takes place in April 1933 during spring.

Seasonal Atmosphere:
- Weather patterns: cool and overcast, occasional rain showers, occasional bursts of sunshine
- Daylight: Days are gradually lengthening, with daylight extending into the evening hours, sunset occurring around 7:30 PM.
- Seasonal activities: spring gardening preparation, Easter egg hunts, attending local fairs and markets
- Seasonal occasions: Easter Sunday (April 16, 1933)
- Season: spring

Period Fashion (describe naturally):
- Men formal: tailored three-piece suits in light wool or tweed, double-breasted blazers, crisp white dress shirts with high stiff collars
- Men casual: lightweight cotton trousers, knit cardigans, sailor-style shirts
- Men accessories: bowler hats, leather gloves, pocket watches
- Women formal: knee-length dresses with dropped waists and floral patterns, tailored jackets with peplum details, cloche hats adorned with ribbons
- Women casual: sundresses in pastel colors, lightweight cardigans, two-piece suits with knee-length skirts
- Women accessories: string of pearls, silk scarves, embroidered handbags

Cultural Context (reference naturally):
- Music/entertainment: Benny Goodman, Duke Ellington, Ella Fitzgerald; Films: King Kong, Duck Soup; Theatre: The Front Page, Of Mice and Men; Radio: The Shadow, Amos 'n' Andy
- Typical prices: Loaf of bread: four pence, A pint of milk: three pence, A round trip on the bus: one shilling
- Current events: political discussions surrounding fascism in Europe; the rise of the National Socialist German Workers' Party in Germany
- Literature: The Glass Key by Dashiell Hammett | Murder in the Cathedral by T.S. Eliot | The Maltese Falcon by Dashiell Hammett | [mystery] | [detective fiction] | [social commentary literature]
- Technology: the electric refrigerator | the radio broadcasting system | the first practical use of the electric washing machine | typewriters | phonographs | automobiles
- Daily life: strolling in local parks, attending social teas, participating in church services
- Social rituals: formal Sunday dinners, afternoon tea gatherings, charity events at the local hall

Atmospheric Details:
The scent of damp earth mingles with the fresh blooms of spring, creating a refreshing yet tense ambiance. The sound of distant thunder rolls softly as families gather for evening meals, their conversations punctuated by the occasional clink of silverware. Candles flicker against the backdrop of overcast skies, casting long shadows in the manor house as secrets simmer just beneath the surface.

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
- Authentic ref
[truncated for prompt budget]

NON-NEGOTIABLE CHAPTER OBLIGATIONS — LOCKED EVIDENCE PHRASES (VERBATIM REQUIRED):
The following physical evidence values are absolute ground truth. Every time this chapter describes, mentions, or alludes to the relevant evidence — no matter how briefly — it MUST use the exact phrase shown below, character for character. NO paraphrase, approximation, rounding, or synonym is permitted.

FAILURE EXAMPLE: if the locked value is "at thirteen minutes to midnight" and you write "just before midnight" or "around midnight" — that is a HARD FAIL. You must write "at thirteen minutes to midnight". Equally, if the locked value is written in words, such as "ten minutes past eleven", and you convert it to figure-based clock notation — that is also a HARD FAIL. Words stay as words; figure forms are forbidden for word-phrased facts.

CRITICAL — WORD-PHRASED VALUES: If the canonical value is written out in words (e.g. a time like "ten minutes past eleven", or an amount like "forty minutes"), reproduce those exact words. DO NOT convert to figure-based time notation, twenty-four-hour format, or any other numeric shorthand. Correct: "ten minutes past eleven". WRONG: figure-based clock notation or numeric shorthand.

Locked facts:
  - The exact time shown on the stopped clock face: "ten minutes past eleven"
  - The exact amount the clock was wound back: "forty minutes"

If a locked fact has no relevance to this chapter, omit it. But the moment you reference the underlying evidence, only the exact phrase above is acceptable.

⛔ CLUES TO SURFACE IN THESE CHAPTERS — mandatory:
The following evidence MUST be clearly observable to an attentive reader. Do not bury it in atmosphere or passing dialogue. Each clue must be concrete, specific, and noticeable:

• [clue_2] A note found near the clock reads 'ten minutes past eleven'.
  Category: temporal | Criticality: essential | Supports inference step 1
  Points to: The time discrepancy noted in the evidence.

For each clue above: an attentive reader should be able to find, record, and later use it to reason toward the solution.

═══ NARRATIVE STATE (read-only — do not contradict) ═══

LOCKED FACTS — use verbatim whenever this evidence is described:
  • The exact time shown on the stopped clock face: "ten minutes past eleven"
  • The exact amount the clock was wound back: "forty minutes"

CHARACTER PRONOUNS — never deviate from these:
  • Eleanor Voss: she/her/her
  • Dr. Mallory Finch: they/them/their
  • Captain Ivor Hale: he/him/his
  • Beatrice Quill: she/her/her

CLUES ALREADY REVEALED TO READER: clue_1 — do not reveal these as new information.

CONTINUITY HANDOFF — previous chapter closing beat:
  • "As they moved about the study, Eleanor felt a strange sense of camaraderie forming among them, despite the circumstances. They were united in their quest for answers, each driven by their own motives and fears. The clock, a symbol of time's relentless march, s..."
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
study

✓ RULE: Continue using this location vocabulary. Maintain consistency with established setting type.
✓ Do NOT introduce new location types that contradict earlier chapters.

**Recent Chapter Summary (for narrative continuity):**
Chapter 1: Chapter 1: Discovery
  Events: The morning after the murder dawned with a heavy stillness that settled over the Finch residence like a shroud.

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
Known location profile anchors: Little Middleton Manor, Drawing Room, Library, Cellar, Formal Gardens, the study of the Finch residence
LOCATION NAME CAPITALISATION (HARD REQUIREMENT — validated):
All named locations in your prose MUST use the EXACT capitalisation from the CML profiles.
Canonical forms: "Little Middleton Manor", "Drawing Room", "Library", "Cellar", "Formal Gardens", "the study of the Finch residence"
Writing a location in lowercase (e.g. "drawing room" instead of "Drawing Room") is a validated error. Every time you mention a named location, copy its capitalisation from the list above.
- Chapter 2: OPENING STYLE (HARD): Start the VERY FIRST SENTENCE with spoken dialogue — e.g. '"[words]," [Name] said/asked/replied/murmured.' The opening quote must be the first character on the line. Anchor opening in "the study of the Finch residence". HARD REQUIREMENT for the first 2 paragraphs: (a) include 2+ sensory words — choose from smell/scent/sound/echo/silence/creak/whisper/cold/warm/damp/rough/smooth/glow/shadow/flicker/dim — and (b) include 1+ atmosphere/time word — choose from rain/wind/fog/storm/mist/thunder/evening/morning/night/dawn/dusk/season/afternoon/midday/noon/midnight/twilight/sunrise/sunset/daylight/sunlight/overcast/cloudy/bright/dark. These are validated requirements, not style suggestions; missing them triggers a retry.

[⚠ INTERNAL QUALITY DIAGNOSTICS — DO NOT REPRODUCE ANY PART OF THIS SECTION IN YOUR STORY OUTPUT. These are private generator observations for your consideration only. Your narrative must read as if this section does not exist. Never include phrases from this block in character dialogue, narration, or description.]

PRIOR CHAPTER QUALITY OBSERVATIONS:
- Chapter 1 (score 94/100):
  Quality gaps noted: word density below preferred target (895/1000); scene grounding weakness
  Address in upcoming chapters: Increase chapter density with concrete investigation action and sensory-grounded beats; avoid recap-only padding. | Open next chapter with a named location anchor plus at least two sensory cues and one atmosphere marker.
[END INTERNAL DIAGNOSTICS]

PROMPT BUDGET SUMMARY: budget=32000 tokens; fixed=6277; context=9933; dropped=[none]; truncated=[location_profiles, temporal_context]

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
8. Integrate at least two concrete era-grounded details per chapter from setting refinement signals: petrol touring cars on county roads | domestic wiring with frequent outages | typewriters in use for correspondence | party-line telephone exchanges common in rural areas | telegrams available via local post offices | airmail services for urgent correspondence.
9. Respect setting movement/access constraints in scene action and alibis: Layout includes restricted access to certain areas such as the library and cellar | Weather can impact movement, with muddy paths after rain limiting access | Isolation due to distance from the nearest town affects communication and assistance | Permissions required to enter private areas of the house | Daily schedules dictate when certain areas are accessible.
10. Sustain social coherence with this backdrop pressure: A looming inheritance dispute amidst the Great Depression forces the estate's residents and staff to confront their class roles while political tensions heighten the atmosphere of mistrust.
11. Maintain continuity around these socially central cast anchors where relevant: Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill.
12. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Critical: Plot similarity 0.75 with 'The Mysterious Affair at Styles' (same premeditated murder + unknown victim)
13. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Critical: Setting similarity 0.90 with 'The Mysterious Affair at Styles' (same era and country manor setting)
14. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Moderate: Structural similarity 0.80 with 'The Mysterious Affair at Styles' (similar cast size and constraints)

CRITICAL PROSE REQUIREMENTS:

The CML specifies exact requirements for certain validation-critical scenes. You MUST include these elements at the specified positions.

**Discriminating Test Scene (Act 3, Scene 4):**
Required elements: Execute the discriminating test, Observe the culprit's reaction or result, Draw conclusion about guilt

**Suspect Clearance Scenes:**
- Beatrice Quill (Act 3, Scene 5): Proven absence in the clock room during the time of death.
  Clues: Witnesses confirm her whereabouts.
- Captain Ivor Hale (Act 3, Scene 5): Established alibi during the time of the murder.
  Clues: Confirmed by multiple witnesses.

**Culprit Revelation Scene (Act 3, Scene 6):**
Method: Confrontation with evidence.

**Clue Placement for These Chapters:**
- clue_2 must appear in Act 1, Scene 2 via Found note

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
  - Location anchor: the study of the Finch residence.
  - Opening atmosphere (MANDATORY — validator enforced): the first paragraph MUST contain at least one of: rain / wind / fog / storm / mist / thunder / evening / morning / night / dawn / dusk / season / afternoon / midday / noon / midnight / twilight / sunrise / sunset / daylight / sunlight / overcast / cloudy / bright / dark. A chapter that omits all of these from its opening paragraph will be rejected.
  - Continuity bridge: in the first 120 words, visibly connect from the previous chapter's final beat. Carry forward one unresolved element (object, accusation, emotional pressure, or immediate physical action) from: "As they moved about the study, Eleanor felt a strange sense of camaraderie forming among them, despite the circumstances. They were united in their quest for answers, each driven by their own motives and fears. The clock...".
  - CLUE OBLIGATIONS — mandatory prose elements (do NOT omit or bury):
    • A note found near the clock reads 'ten minutes past eleven'. [clue_2] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: The time discrepancy noted in the evidence.
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
- Seasonal vocabulary allow-list: spring, vernal, springtime.
- Forbidden seasonal words: summer, autumn, winter.

FROZEN TIMELINE STATE (DO NOT ALTER):
- Timeline anchor: April (spring).
- Month, season, weather, and time-of-year language in this batch must stay compatible with spring.
- Established timeline fact: The clock striking eleven
- Established timeline fact: Witness reports of the time
- If referenced, use exact time phrase: "ten minutes past eleven" (The exact time shown on the stopped clock face).
- If referenced, use exact time phrase: "forty minutes" (The exact amount the clock was wound back).

STORY TO DATE (REFERENCE ONLY — DO NOT COPY VERBATIM):
- Full prior chapter text is provided below for continuity, factual consistency, and reference accuracy.
- Use this to keep character voice, chronology, clue state, and location continuity aligned with earlier chapters.
- Do not quote, copy, or paraphrase these paragraphs too closely; write fresh prose that remains consistent with them.

--- BEGIN PRIOR CHAPTER 1 ---
Title: Chapter 1: Discovery
The morning after the murder dawned with a heavy stillness that settled over the Finch residence like a shroud. In the study, the air felt thick with unspoken tension, punctuated only by the distant sound of rain pattering against the windowpanes. Eleanor Voss crossed the threshold, her heart racing as she took in the scene before her. the doctor Finch stood at the center of the room, their brow furrowed in concentration, while the captain Hale and Beatrice Quill hovered nearby, their expressions a mix of concern and confusion. The clock on the mantelpiece, a grand old timepiece, caught Eleanor's eye, its hands pointed firmly at eleven, a stark reminder of the tragedy that had unfolded just hours before.

Eleanor stepped closer, her gaze fixed on the clock. The hands pointed to eleven, a detail that seemed to scream for attention. 'It appears time has stopped for more than just the clock,' she murmured, her voice barely above a whisper. The sight of it sent a chill down her spine, a tangible representation of the life that had been so abruptly extinguished. She could almost feel the weight of time pressing down on her, each tick echoing the unresolved questions that hung in the air. Dr. Finch, noticing her fixation, cleared their throat, drawing her attention. 'It’s peculiar, isn’t it? The clock shows the hands pointing to eleven, yet I distinctly remember it striking just before the incident.'

Eleanor turned to Dr. Finch, her brow furrowing. 'You mean to say it was tampered with?' The implication hung heavy in the air, and she could see the tension ripple through the room. Dr. Finch nodded slowly, their expression grave. 'Yes, it’s possible. If someone wanted to mislead us about the time of death, they could have easily wound it back. But why? And who would go to such lengths?' The question lingered, unanswered, as the gravity of their situation settled over them like the damp chill from outside. Every suspect in the room had access to the victim, each with their own motives and secrets, complicating the investigation further.

Captain Hale, his demeanor shifting from concern to determination, stepped forward. 'We must consider every possibility. This is not just a matter of time; it’s about the truth. If the clock was indeed tampered with, it could change everything we thought we knew.' Her voice held a commanding presence, and Eleanor felt a flicker of hope that perhaps they could uncover the truth together. Beatrice, who had been silent until now, chimed in, her voice trembling slightly. 'But what if the truth is something we are not prepared to face? What if it implicates one of us?' The question hung in the air, a dark cloud casting a shadow over their gathering.

Eleanor felt her heart race at the thought. The very idea that one of them could be involved in such a heinous act was almost too much to bear. 'We must focus on the facts,' she urged, trying to keep her voice steady. 'The clock is a clue, and we need to understand its significance. If it was wound back, how much time did it lose?' She turned to Dr. Finch, seeking their insight. 'You mentioned it could have been wound back. How far?' Dr. Finch took a deep breath, their fingers brushing against the polished wood of the clock. 'I would estimate it could have been wound back by around forty minutes. That would place the time of death significantly earlier than we initially believed.'

The implications of Dr. Finch's words sank in, and Eleanor felt a wave of nausea wash over her. 'So, if the clock was tampered with, it could suggest that someone wanted to create an alibi or mislead the investigation entirely.' The room fell silent, each person lost in their thoughts, the weight of suspicion settling heavily around them. The tension was palpable, and Eleanor could feel the air crackling with unspoken accusations. As they awaited the arrival of the local constable, the atmosphere grew increasingly charged, the sense of anticipation thickening with each passing moment. It was a locked room mystery, and the truth seemed as elusive as the morning mist outside.

Eleanor glanced at the clock once more, its hands frozen in time, a silent witness to the events that had transpired. She could sense the urgency in the air, the need to uncover the truth before it slipped away like the fleeting moments of their lives. 'We must act quickly,' she said, her voice firm. 'We need to gather all the evidence we can before the constable arrives. Every detail matters.' Dr. Finch nodded in agreement, their earlier confidence returning. 'I will assist you. Together, we can piece together the puzzle of what happened here.' With a shared sense of purpose, the four of them began to examine the room, each searching for clues that might lead them closer to the truth.

As they moved about the study, Eleanor felt a strange sense of camaraderie forming among them, despite the circumstances. They were united in their quest for answers, each driven by their own motives and fears. The clock, a symbol of time's relentless march, served as a reminder that they were racing against the clock, not just to solve a murder, but to confront the shadows of their own pasts that lingered just out of sight.
--- END PRIOR CHAPTER 1 ---

# Case Overview
Title: The Clockwork Conspiracy
Era: 1930s
Setting: Little Middleton
Crime: murder (premeditated)
Culprit: Dr. Mallory Finch
False assumption: The clock accurately reflected the time of death.
Cast: Eleanor Voss (she/her), Dr. Mallory Finch (they/them), Captain Ivor Hale (he/him), Beatrice Quill (she/her)

⚠ PRONOUN REMINDER: Dr. Mallory Finch use they/them/their (singular). Never write she/her or he/him for these characters.

Setting Lock: Keep all scenes and descriptions consistent with the stated setting (Little Middleton). Do not introduce a different location type.

Outline scenes:
[
  {
    "sceneNumber": 2,
    "act": 1,
    "title": "The Note",
    "setting": {
      "location": "the study of the Finch residence",
      "timeOfDay": "Shortly after the discovery",
      "atmosphere": "Anxious and chaotic as details unfold"
    },
    "characters": [
      "Eleanor Voss",
      "Dr. Mallory Finch",
      "Beatrice Quill",
      "Captain Ivor Hale"
    ],
    "purpose": "Establish the timeline of events and introduce key evidence",
    "cluesRevealed": [
      "clue_2"
    ],
    "dramaticElements": {
      "conflict": "Tension rises as suspicions deepen",
      "tension": "The note suggests a deliberate deception",
      "microMomentBeats": [
        "Beatrice's hands tremble as she picks up the note."
      ]
    },
    "summary": "As Eleanor inspects the room, she discovers a note near the clock reading 'ten minutes past eleven.' The guests react with confusion, and Eleanor senses a deliberate attempt to mislead the investigation.",
    "estimatedWordCount": 1800,
    "emotionalRegister": "Tension mounts as secrets begin to surface, complicating the investigation.",
    "dominantCharacterNote": {
      "name": "Eleanor Voss",
      "voiceRegister": "Eleanor speaks with a measured cadence, often punctuating her observations with dry humor that hints at her intelligence and wit."
    },
    "humourGuidance": {
      "permission": "permitted",
      "character": "Dr. Mallory Finch"
    },
    "eraTextureNote": "Limited transportation options due to economic constraints.; Communication methods are slower, relying on letters and telegrams.; Access to resources is restricted by class and economic status.",
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
□ Chapter 2: "A note found near the clock reads 'ten minutes past eleven'." is placed in the first 25% of the chapter, followed by an explicit inference or suspicion paragraph.
□ First chapter in this batch opens by continuing the previous chapter closing beat (same unresolved object, question, movement, or emotional pressure).
□ PRONOUN AUDIT — for every character you named in your chapters, list the pronouns you actually used, then verify against the canonical table. Correct any mismatch before outputting. Do NOT include this audit in your JSON output.
  Character            | Canonical     | Used in draft | Match?
  ---------------------|---------------|---------------|-------
  Eleanor Voss         | she/her/her/herself       | [fill in]     | [yes/no]
  Dr. Mallory Finch    | they/them/their/themselves | [fill in]     | [yes/no]
  Captain Ivor Hale    | he/him/his/himself        | [fill in]     | [yes/no]
  Beatrice Quill       | she/her/her/herself       | [fill in]     | [yes/no]
□ Return valid JSON only.
```
