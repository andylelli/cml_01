# Actual Prompt Record

- Run ID: `mystery-1778792768943`
- Project ID: ``
- Timestamp: `2026-05-14T21:10:49.108Z`
- Agent: `Agent9-ProseGenerator-Ch2`
- Operation: `chat_request_full_prompt`
- Model: `GPT-4o-mini`
- Temperature: `0.42`
- Max Tokens: `4500`
- Attempt: `first`
- Prompt Hash: `a71a916ca3aecf99`

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
- MORAL COMPLEXITY REQUIREMENT: The mechanism of this crime carries a moral gray area: "The culprit acted out of a misguided sense of justice, believing they were protecting a loved one from harm." — the culprit reveal and denouement MUST acknowledge this ambiguity. Do not let the ending feel clean or simple. Give the reader at least one moment of uncomfortable sympathy or moral doubt.


⚠️ AMATEUR DETECTIVE STORY: The investigator is a civilian with no official standing. The official police (if they appear) are unnamed background figures only — "a constable", "the sergeant", "an officer from the village". Do NOT give any police official a name or title+surname combination. There is no Inspector [Surname], no Constable [Surname], no Sergeant [Surname] in this story.

⛔ ABSOLUTE PRONOUN LOCK — NO EXCEPTIONS

The following pronouns are locked facts, on the same level as character names
and hard-logic device values. Using the wrong pronoun is a continuity error,
not a style choice.

Canonical pronoun table (subject / object / possessive / reflexive):
  • Eleanor Voss: ALWAYS she/her/her/herself — NEVER he/him/his/himself
  • Dr. Mallory Finch: ALWAYS he/him/his/himself — NEVER she/her/herself
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

## Era: 1936-12
In December 1936, the Great Depression casts a long shadow over England, where the wealthy elite maintain their status while the working class grapples with desperation. The chill of winter adds to the oppressive atmosphere, as overcast skies and frequent rain create a somber backdrop for social gatherings. The looming specter of war in Europe heightens anxieties, and tensions simmer beneath the surface during holiday festivities. Amidst this backdrop, families and friends come together, but the strain of economic hardship and class divides causes fractures in their relationships, revealing the fragility of trust and loyalty.
Emotional register: An undercurrent of anxiety and tension permeates society, as individuals navigate the complexities of class and personal relationships.
Physical constraints: Limited mobility due to harsh winter weather | Reliance on domestic telephones for communication | Travel restrictions due to economic conditions
Current tensions (weave into background texture): Rising class tensions due to economic disparity | Concerns over the political instability in Europe | The impact of the Great Depression on social structures
Wartime context — Increasing concerns about military actions in Europe, leading to a focus on preparedness.: Communities rally around local events and charity, reflecting the desire for solidarity amidst struggle. Absence effect: Men's potential enlistment heightens the anxiety around personal safety and the stability of family structures.

## Story Theme
The story explores the intersection of personal desires and social obligations, revealing how hidden motivations can lead to tragic consequences in a world burdened by class tensions.

## Story Emotional Register
Dominant: The story is characterized by a haunting tension that builds throughout.

Arc:
As the story begins, the atmosphere inside Middleton Manor is thick with foreboding, accentuated by the stormy weather. The sudden discovery of a murder in the library sends shockwaves through the gathering of guests, each harboring their own secrets and fears. Detective Eleanor Voss, keenly observant yet deeply affected by her feelings for Captain Hale, is drawn into the investigation. As she sifts through the initial clues, a sense of rising unease permeates the air—whispers of betrayal and jealousy emerge, and the stakes for everyone involved grow higher. Midway through the investigation, a pivotal revelation about the clock in the library shifts Eleanor's focus, forcing her to confront the intricate web of relationships and motives surrounding the murder.

This turning point colors previous events with new meaning, as alliances shift and suspicions deepen. The pressure mounts as the investigation reaches its climax, with Eleanor orchestrating a confrontation that reveals the true nature of the relationships at play. The resolution comes at a cost, leaving each character changed in the aftermath. Eleanor's quest for justice intertwines with her personal desires, and the truth, once unveiled, brings both closure and heartache. In the end, the emotional weight of the revelations lingers, as the characters grapple with the consequences of their choices, leaving them forever altered by the events at Middleton Manor.

## Emotional register at this point in the story
The opening sets a tone of foreboding, suggesting something sinister is lurking beneath the surface.

## Character Portraits (appearance & era)

### Eleanor Voss
Eleanor Voss, a governess, embodies the tension of the era, caught between her unrequited love for Captain Hale and her duty to the household. As the economic disparity deepens, her desire to prove herself as more than a caretaker drives her to seek justice for the murder that disrupts their lives.
Era intersection: Eleanor's longing for love and recognition intersects with the societal pressures of class and gender roles, making her journey one of personal empowerment against a backdrop of economic struggle.

### Dr. Mallory Finch
Dr. Mallory Finch represents the moral complexities of the time, as his public persona of a benevolent physician masks deep financial troubles. The weight of the Great Depression compels him to make questionable choices, highlighting the ethical dilemmas faced by those in his position.
Era intersection: Finch's struggle with financial desperation mirrors the broader economic challenges of the 1930s, illustrating how societal pressures can lead individuals to justify unethical behavior.

### Captain Ivor Hale
Captain Ivor Hale is a charming officer torn between societal expectations and his genuine feelings for Eleanor. His position in high society is threatened by the rising class tensions, forcing him to navigate the complexities of love and loyalty in an increasingly precarious world.
Era intersection: Hale's inner conflict reflects the societal pressures of his class, illustrating how personal desires can clash with the expectations of wealth and status during a time of economic uncertainty.

### Beatrice Quill
Beatrice Quill is a poised socialite grappling with insecurities about her engagement to Captain Hale. Her fears of losing him to Eleanor reveal the fragility of social status in an era where class divides are pronounced and personal relationships are fraught with tension.
Era intersection: Beatrice's struggle to maintain her engagement amidst economic hardship demonstrates the pressures faced by women in the 1930s as they navigate love, jealousy, and societal expectations.

## Character Voices

### Eleanor Voss (she/her/her)
Eleanor's voice is measured and articulate, often reflecting her scholarly pursuits and emotional depth.
[comfortable] I've always found solace in the pages of a good book, much like the comfort of a warm cup of tea.
[evasive] Oh, it's nothing really. Just a passing thought, hardly worth mentioning.
[stressed] I can't help but feel that the truth is slipping through my fingers like sand.
Humour: Eleanor employs dry wit, often using it to mask her deeper emotions.

### Dr. Mallory Finch (he/him/his)
Dr. Finch's voice is warm and gentle, often laced with self-deprecation.
[comfortable] You know, laughter is the best medicine, though I seem to have run out of both lately.
[evasive] Oh, I was just preoccupied with a rather tedious patient, nothing to concern yourself with.
[stressed] I fear that if the truth comes out, it could unravel everything I've worked for.
Humour: His self-deprecating humor serves to lighten the tension around his financial struggles.

### Captain Ivor Hale (he/him/his)
Ivor's voice carries a confident flair, often punctuated with sardonic wit.
[comfortable] Ah, the pleasure of a fine evening and good company; it makes all the troubles fade away.
[evasive] Why worry about the past? It's the future that holds the real intrigue, wouldn't you agree?
[stressed] I find myself caught between duty and desire, and it's a rather uncomfortable position to be in.
Humour: His sardonic humor often serves as a shield against the pressures of societal expectations.

### Beatrice Quill (she/her/her)
Beatrice's voice is elegant and refined, often with a pointed edge.
[comfortable] Darling, one must always put their best foot forward; it's a matter of reputation.
[evasive] Oh, I'm sure there's no need to dwell on such trivial matters; let's focus on the evening ahead.
[stressed] I simply cannot bear the thought of losing him to someone like her.
Humour: Beatrice employs polite savagery, using wit to mask her insecurities.

## Location Registers (scene framing guides)

Grand Entrance Hall: The Grand Entrance Hall feels both welcoming and foreboding, a place where guests gather yet secrets linger in the shadows.. Camera angle: As a writer enters this space, the focus should be on the contrast between the warmth of hospitality and the chill of concealed motives.. Era: The coldness of winter amplifies the sense of isolation as the wealthy entertain in opulence amidst a struggling society.

Library: The library is a sanctuary of knowledge, yet it holds an undercurrent of tension as secrets are whispered among the books.. Camera angle: A writer should capture the intimate atmosphere, highlighting the interplay of light and shadow that reflects the characters' hidden agendas.. Era: In an era where information is power, this space becomes a crucible for hidden truths and lies.

Drawing Room: The drawing room serves as the heart of social interaction, where laughter masks the tension of unspoken truths.. Camera angle: Entering this space, a writer should focus on the vibrant conversations and the underlying tension that simmers just below the surface.. Era: The societal pressures of the 1930s create an atmosphere where appearances are everything, and secrets can shatter the facade.

Master Bedroom: The master bedroom is a sanctuary of opulence yet holds a weight of expectation and unfulfilled desires.. Camera angle: A writer should approach this room with a sense of quiet introspection, exploring the emotional complexities hidden within its walls.. Era: The intimacy of this space contrasts sharply with the harsh realities faced by the characters outside its doors.

## Humour guidance for this story position (opening)
Permission: permitted
Rationale: The opening can establish character dynamics with light humor.

FAIR-PLAY AND INFERENCE CONTRACT (from CML logic):
- False assumption in force: The victim was alive at the time indicated by the clock.
- Hidden truth to progressively expose: The clock was actually tampered with, misrepresenting the true time of death.
- Inference path checkpoints to dramatize clearly (observation -> correction -> effect):
  - Step 1: obs: The clock in the library is cracked and shows the time as ten minutes past ten. | corr: The clock's appearance suggests it had been tampered with, indicating potential foul play. | effect: This narrows the investigation to those who had access to the library.
  - Step 2: obs: A faint smudge on the clock face indicates it was recently handled. | corr: The smudge suggests someone tampered with the clock shortly before the murder. | effect: This eliminates Beatrice Quill, who was observed in the kitchen at that time.
  - Step 3: obs: A half-open drawer contains a key that fits the clock mechanism. | corr: The presence of the key suggests that someone intentionally wound back the clock. | effect: This implicates Captain Ivor Hale, as he had the opportunity to access the library and tamper with the clock.
- Discriminating test method: trap
- Discriminating test design constraint: A staged confrontation where Captain Hale is asked to explain the tampering of the clock using the key found.
- Test must rely on already-shown clue IDs: clue_1, clue_2, clue_3, clue_6, clue_5
- Fair-play rationale: Step 1: The cracked clock and witness statements (early) indicate tampering. Step 2: The smudge on the clock face and Beatrice's alibi (mid) eliminate her. Step 3: The key in the drawer implicates Ivor Hale (late), leading to the confrontation.
- Never solve by withheld information. Keep reader-information parity with detective reasoning.

## Character Reference

### Eleanor Voss
Eleanor speaks in a measured, articulate manner, often punctuating her sentences with a thoughtful pause
She tends to use literary references, a nod to her scholarly pursuits, and occasionally lightens the mood with a sharp, observational comment that reveals her keen insight into the human heart.
Eleanor grapples with her feelings of inadequacy and jealousy, as well as the moral dilemma of whether to pursue her love for Hale at the expense of her integrity. She is torn between her duty to the household and her longing for a life where she is valued as more than just a governess.

### Dr. Mallory Finch
Finch speaks with a gentle cadence, often punctuating his sentences with self-deprecating remarks about his own shortcomings
He has a tendency to chuckle softly at his own expense, using humour to diffuse the tension that often accompanies his financial struggles.
Dr. Finch is torn between his ethical obligations as a physician and the desperation of his financial situation. He wrestles with guilt over his choices, fearing that his actions could lead to professional ruin and loss of respect.

### Captain Ivor Hale
Hale speaks with a confident flair, often employing a sardonic wit that disarms those around him
He has a tendency to punctuate his remarks with a knowing smile, a telltale sign of his playful nature, and he is adept at turning a serious conversation into light banter.
Hale grapples with the tension between societal expectations and his genuine feelings for Eleanor. Torn between duty and desire, he fears that following his heart could lead to ruin.

### Beatrice Quill
Beatrice speaks with an elegant cadence, often employing a playful yet pointed wit
She has a knack for delivering compliments that carry a sharp edge, and her laughter often dances between genuine amusement and veiled criticism.
Beatrice struggles with her feelings of inadequacy and jealousy, caught between her desire for love and the fear of being overshadowed by Eleanor. This internal struggle fuels her actions as she navigates the complexities of her relationships.


## CHARACTER CONTRACTS (binding for this scene)
Each entry below constrains how this character must be written in this chapter.
These override generic style guidance when they conflict.

### Eleanor Voss
Voice & mannerisms: Eleanor speaks in a measured, articulate manner, often punctuating her sentences with a thoughtful pause. She tends to use literary references, a nod to her scholarly pursuits, and occasionally lightens the mood with a sharp, observational comment that reveals her keen insight into the human heart.
Sample voice fragments (match this register and rhythm):
  [comfortable] "I've always found solace in the pages of a good book, much like the comfort of a warm cup of tea."
  [evasive] "Oh, it's nothing really. Just a passing thought, hardly worth mentioning."
Humour: dry wit — deploy occasionally (level 0.5)
FORBIDDEN phrase (never write for Eleanor Voss): "a surge of determination washed over her"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Eleanor feels abandoned and betrayed by Hale's engagement, which ignites a fierce desire to expose the truth behind the murder, hoping it will win back his affections." — do not surface in Act I.

### Dr. Mallory Finch
Voice & mannerisms: Dr. Finch speaks with a gentle cadence, often punctuating his sentences with self-deprecating remarks about his own shortcomings. He has a tendency to chuckle softly at his own expense, using humour to diffuse the tension that often accompanies his financial struggles.
Sample voice fragments (match this register and rhythm):
  [comfortable] "You know, laughter is the best medicine, though I seem to have run out of both lately."
  [evasive] "Oh, I was just preoccupied with a rather tedious patient, nothing to concern yourself with."
Humour: self deprecating — deploy rarely (level 0.3)
FORBIDDEN phrase (never write for Dr. Mallory Finch): "she knew with certainty she was right"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "His financial desperation has bred a quiet resentment towards the victim, who had funded a rival medical practice, leaving Finch feeling threatened and envious." — do not surface in Act I.

### Captain Ivor Hale
Voice & mannerisms: Hale speaks with a confident flair, often employing a sardonic wit that disarms those around him. He has a tendency to punctuate his remarks with a knowing smile, a telltale sign of his playful nature, and he is adept at turning a serious conversation into light banter.
Sample voice fragments (match this register and rhythm):
  [comfortable] "Ah, the pleasure of a fine evening and good company; it makes all the troubles fade away."
  [evasive] "Why worry about the past? It's the future that holds the real intrigue, wouldn't you agree?"
Humour: sardonic — deploy occasionally (level 0.6)
FORBIDDEN phrase (never write for Captain Ivor Hale): "palpable tension filled the room"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Caught in the midst of a love triangle, Hale faces the risk of public scandal that could tarnish his reputation and strain his personal relationships." — do not surface in Act I.

### Beatrice Quill
Voice & mannerisms: Beatrice speaks with an elegant cadence, often employing a playful yet pointed wit. She has a knack for delivering compliments that carry a sharp edge, and her laughter often dances between genuine amusement and veiled criticism.
Sample voice fragments (match this register and rhythm):
  [comfortable] "Darling, one must always put their best foot forward; it's a matter of reputation."
  [evasive] "Oh, I'm sure there's no need to dwell on such trivial matters; let's focus on the evening ahead."
Humour: polite savagery — deploy occasionally (level 0.4)
FORBIDDEN phrase (never write for Beatrice Quill): "she felt a wave of unease"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Her jealousy and desperation to secure her place in Hale's life drive her to consider drastic measures, as the thought of losing him to Eleanor is unbearable." — do not surface in Act I.



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
Middleton Manor is a sprawling estate steeped in tradition and secrets, where the past lingers in the shadows of its grand halls.

Key Locations Available:
- Grand Entrance Hall (interior): Gathering space
- Library (interior): Clue discovery
- Drawing Room (interior): Social gathering space
- Master Bedroom (interior): Restricted access area

Atmosphere: Tense and foreboding, reflecting underlying class tensions and personal secrets
Weather: Overcast with occasional rain, typical for the season

Era markers: Domestic electric lighting illuminating the grand halls | Early telephones connecting distant family members | Typewriters clattering in the study as correspondence is crafted

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
Grand Entrance Hall (interior):
  - Visual: The ornate plasterwork on the ceiling is intricately detailed, showcasing the craftsmanship of a bygone era., Heavy velvet drapes frame the tall windows, their deep burgundy hue contrasting with the pale stone walls.
  - Sounds: The echo of footsteps reverberates against the high ceilings, creating an almost ghostly ambiance., Occasional whispers of the staff can be heard as they move about, their hushed tones blending into the atmosphere.
  - Scents: The faint scent of beeswax polish lingers in the air, mingling with the mustiness of the old wood., Distant hints of smoke from the fireplace provide a comforting yet melancholic backdrop.
  - Touch: The coolness of the marble floor contrasts sharply with the warmth of the woodwork, creating a sensory dichotomy., The heavy drapes feel thick and luxurious against the skin, a reminder of the wealth that permeates the manor.

Library (interior):
  - Visual: Rich mahogany furniture contrasts with the deep green wallpaper, creating an atmosphere of scholarly elegance., A large globe sits in one corner, its surface worn from years of curious hands tracing the paths of explorers.
  - Sounds: The soft rustle of pages turning is a gentle reminder of the knowledge contained within these walls., Occasionally, the creak of the floorboards punctuates the silence, as if the books themselves are whispering secrets.
  - Scents: The musty scent of old books fills the air, a comforting yet slightly oppressive reminder of time's passage., Hints of tobacco linger, remnants of discussions held in the flickering light of the hearth.
  - Touch: The smooth leather of the books feels cool to the touch, while the wooden shelves provide a sense of solidity and permanence., The warmth of the fireplace creates a cozy nook, inviting one to sink into a plush armchair and lose oneself in a world of words.

Drawing Room (interior):
  - Visual: Rich tapestries hang on the walls, their intricate patterns telling stories of the past., A grand piano stands in one corner, its polished surface reflecting the soft glow of the room's ambient lighting.
  - Sounds: The sound of laughter and conversat
[truncated for prompt budget]

## Texture Pool
Draw on these as opportunities arise — you are not required to use them.

- In December 1936, the Great Depression casts a long shadow over England, where the wealthy elite maintain their status while the working class grapples with desperation
- The chill of winter adds to the oppressive atmosphere, as overcast skies and frequent rain create a somber backdrop for social gatherings
- The looming specter of war in Europe heightens anxieties, and tensions simmer beneath the surface during holiday festivities
- Amidst this backdrop, families and friends come together, but the strain of economic hardship and class divides causes fractures in their relationships, revealing the fragility of trust and loyalty.

TEMPORAL CONTEXT:

This story takes place in December 1936 during winter.

Seasonal Atmosphere:
- Weather patterns: overcast with frequent rain, chilly temperatures around 35°F, damp and foggy evenings
- Daylight: Short days with sunset around 4 PM; twilight settles in quickly, casting long shadows over the estate.
- Seasonal activities: preparing for Christmas festivities, attending winter balls, gathering for local church services
- Seasonal occasions: Christmas, New Year's Eve
- Season: winter

Period Fashion (describe naturally):
- Men formal: three-piece wool suit, double-breasted overcoat, bowler hat
- Men casual: tweed sports jacket, corduroy trousers, knitted sweater
- Men accessories: silver pocket watch, leather gloves, silk scarf
- Women formal: floor-length evening gown with sequins, fur stole, cloche hat
- Women casual: wool cardigan, tea-length dress with a fitted waist, ankle boots
- Women accessories: beaded clutch purse, pearl necklace, embroidered handkerchief

Cultural Context (reference naturally):
- Music/entertainment: 'Pennies from Heaven' by Bing Crosby, 'The Way You Look Tonight' by Fred Astaire, 'Ain't She Sweet' by Milton Ager; Films: 'Modern Times' directed by Charlie Chaplin, 'The Great Ziegfeld'; Theatre: 'Anything Goes' starring Ethel Merman, 'On Your Toes'; Radio: The Jack Benny Program, The Shadow
- Typical prices: Loaf of bread: four pence, Butter: one shilling, Movie ticket: one shilling
- Current events: Hitler's reoccupation of the Rhineland intensifies fears of war; The Spanish Civil War escalates, drawing international attention
- Literature: 'Gone with the Wind' by Margaret Mitchell | 'The Maltese Falcon' by Dashiell Hammett | 'Of Mice and Men' by John Steinbeck | [mystery] | [historical fiction] | [social commentary]
- Technology: first practical use of radar | development of the electric refrigerator | improvements in sound recording technology | domestic telephones | electric lighting in homes | typewriters for correspondence
- Daily life: attending holiday parties, visiting local markets, participating in community charity events
- Social rituals: afternoon tea gatherings among the elite, Christmas caroling in neighborhoods, New Year's Eve parties with fireworks

Atmospheric Details:
The air carries a chill, mingling the scent of damp earth with the faint aroma of burning coal from nearby homes. Soft flickers of candlelight illuminate the grand dining room, casting long shadows on the intricately patterned wallpaper. Outside, the distant sound of a church bell tolls, echoing through the misty evening as laughter and chatter rise from the drawing room.

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
- Class indicators: Aristocrats dis
[truncated for prompt budget]

NON-NEGOTIABLE CHAPTER OBLIGATIONS — LOCKED EVIDENCE PHRASES (VERBATIM REQUIRED):
The following physical evidence values are absolute ground truth. Every time this chapter describes, mentions, or alludes to the relevant evidence — no matter how briefly — it MUST use the exact phrase shown below, character for character. NO paraphrase, approximation, rounding, or synonym is permitted.

FAILURE EXAMPLE: if the locked value is "at thirteen minutes to midnight" and you write "just before midnight" or "around midnight" — that is a HARD FAIL. You must write "at thirteen minutes to midnight". Equally, if the locked value is written in words, such as "ten minutes past eleven", and you convert it to figure-based clock notation — that is also a HARD FAIL. Words stay as words; figure forms are forbidden for word-phrased facts.

CRITICAL — WORD-PHRASED VALUES: If the canonical value is written out in words (e.g. a time like "ten minutes past eleven", or an amount like "forty minutes"), reproduce those exact words. DO NOT convert to figure-based time notation, twenty-four-hour format, or any other numeric shorthand. Correct: "ten minutes past eleven". WRONG: figure-based clock notation or numeric shorthand.

Locked facts:
  - The exact time shown on the stopped clock face: "ten minutes past eleven"
  - The exact amount the clock was wound back: "forty minutes"
  - The position of the drawer containing the winding key: "half-open"
  - The size of the crack on the clock's glass: "a quarter inch"

If a locked fact has no relevance to this chapter, omit it. But the moment you reference the underlying evidence, only the exact phrase above is acceptable.

⛔ CLUES TO SURFACE IN THESE CHAPTERS — mandatory:
The following evidence MUST be clearly observable to an attentive reader. Do not bury it in atmosphere or passing dialogue. Each clue must be concrete, specific, and noticeable:

• [clue_core_contradiction_chain] The clock's appearance suggests it had been tampered with, indicating potential foul play.
  Category: temporal | Criticality: essential | Supports inference step 1
  Points to: This contradicts the assumption that the clock was showing the correct time.

• [clue_mechanism_visibility_core] The mechanism relies on the clock, library, and crack to expose the false timing.
  Category: temporal | Criticality: essential | Supports inference step 1
  Points to: The clock's faulty timing mechanism is crucial to understanding the murder.

For each clue above: an attentive reader should be able to find, record, and later use it to reason toward the solution.

═══ NARRATIVE STATE (read-only — do not contradict) ═══

LOCKED FACTS — use verbatim whenever this evidence is described:
  • The exact time shown on the stopped clock face: "ten minutes past eleven"
  • The exact amount the clock was wound back: "forty minutes"
  • The position of the drawer containing the winding key: "half-open"
  • The size of the crack on the clock's glass: "a quarter inch"

CHARACTER PRONOUNS — never deviate from these:
  • Eleanor Voss: she/her/her
  • Dr. Mallory Finch: he/him/his
  • Captain Ivor Hale: he/him/his
  • Beatrice Quill: she/her/her

CLUES ALREADY REVEALED TO READER: clue_1, clue_2 — do not reveal these as new information.

CONTINUITY HANDOFF — previous chapter closing beat:
  • "In the ensuing silence, the gravity of their predicament settled upon them like a shroud. The library, once a place of refuge, had transformed into a stage for betrayal and deceit. Eleanor's mind raced as she considered the implications of the clock, the smudg..."
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
library, garden, manor

✓ RULE: Continue using this location vocabulary. Maintain consistency with established setting type.
✓ Do NOT introduce new location types that contradict earlier chapters.

**Recent Chapter Summary (for narrative continuity):**
Chapter 1: Chapter 1: Discovery
  Events: The morning after the murder brought a heavy overcast to the library, where the scent of damp earth mingled with the mustiness of the books.

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
Known location profile anchors: Middleton Manor, Grand Entrance Hall, Library, Drawing Room, Master Bedroom, the library
LOCATION NAME CAPITALISATION (HARD REQUIREMENT — validated):
All named locations in your prose MUST use the EXACT capitalisation from the CML profiles.
Canonical forms: "Middleton Manor", "Grand Entrance Hall", "Library", "Drawing Room", "Master Bedroom", "the library"
Writing a location in lowercase (e.g. "drawing room" instead of "Drawing Room") is a validated error. Every time you mention a named location, copy its capitalisation from the list above.
- Chapter 2: OPENING STYLE (HARD): Start the VERY FIRST SENTENCE with spoken dialogue — e.g. '"[words]," [Name] said/asked/replied/murmured.' The opening quote must be the first character on the line. Anchor opening in "the library". HARD REQUIREMENT for the first 2 paragraphs: (a) include 2+ sensory words — choose from smell/scent/sound/echo/silence/creak/whisper/cold/warm/damp/rough/smooth/glow/shadow/flicker/dim — and (b) include 1+ atmosphere/time word — choose from rain/wind/fog/storm/mist/thunder/evening/morning/night/dawn/dusk/season/afternoon/midday/noon/midnight/twilight/sunrise/sunset/daylight/sunlight/overcast/cloudy/bright/dark. These are validated requirements, not style suggestions; missing them triggers a retry.

[⚠ INTERNAL QUALITY DIAGNOSTICS — DO NOT REPRODUCE ANY PART OF THIS SECTION IN YOUR STORY OUTPUT. These are private generator observations for your consideration only. Your narrative must read as if this section does not exist. Never include phrases from this block in character dialogue, narration, or description.]

PRIOR CHAPTER QUALITY OBSERVATIONS:
- Chapter 1 (score 89/100):
  Quality gaps noted: word density below preferred target (752/1000); scene grounding weakness
  Address in upcoming chapters: Increase chapter density with concrete investigation action and sensory-grounded beats; avoid recap-only padding. | Open next chapter with a named location anchor plus at least two sensory cues and one atmosphere marker.
[END INTERNAL DIAGNOSTICS]

PROMPT BUDGET SUMMARY: budget=32000 tokens; fixed=6907; context=10685; dropped=[none]; truncated=[location_profiles, temporal_context]

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
8. Integrate at least two concrete era-grounded details per chapter from setting refinement signals: domestic electric lighting | early telephones in homes | typewriters for correspondence | party-line telephone systems | telegrams for urgent messages | airmail for long-distance correspondence.
9. Respect setting movement/access constraints in scene action and alibis: Geographical layout allows for limited movement in the upper floors due to narrow staircases | Access to the library and study is restricted to specific family members and guests | Weather can delay outdoor movement and impact evidence visibility in gardens | Certain areas, such as the master bedroom and private study, are off-limits without permission | Daily routines dictate the presence of staff in public areas during specific hours.
10. Sustain social coherence with this backdrop pressure: A family gathering at the manor for a will reading draws together heirs and staff, all under the strain of economic hardship and rising class tensions, creating a volatile atmosphere ripe for secrets and betrayal.
11. Maintain continuity around these socially central cast anchors where relevant: Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill.
12. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Critical: Plot similarity 0.75 with 'The Mysterious Affair at Styles' (same temporal axis and similar crime method)
13. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Moderate: Setting similarity 0.85 with 'The Mysterious Affair at Styles' (similar era and setting details)
14. RETRY MITIGATION: Strict obligation mode is active. Every required clue must be surfaced with concrete, observable prose before any deduction beat.
15. RETRY MITIGATION: Prioritize chronology and identity coherence over stylistic variation for this retry.
16. STORY TO DATE ANTI-COPY RULE: The STORY TO DATE section below is provided for chronological and factual reference ONLY. You MUST NOT copy, lightly rephrase, or structurally echo any sentence or paragraph from prior chapters. Every sentence in this chapter must be original prose unique to this scene. Reusing even a clause from prior chapter text will cause this attempt to fail immediately.

CRITICAL PROSE REQUIREMENTS:

The CML specifies exact requirements for certain validation-critical scenes. You MUST include these elements at the specified positions.

**Discriminating Test Scene (Act 3, Scene 4):**
Required elements: Execute the discriminating test, Observe the culprit's reaction or result, Draw conclusion about guilt

**Suspect Clearance Scenes:**
- Beatrice Quill (Act 3, Scene 5): Proving her alibi in the kitchen.
  Clues: clue_1, clue_2
- Dr. Mallory Finch (Act 3, Scene 5): Alibi confirmed: 9:00 PM to 10:00 PM

**Culprit Revelation Scene (Act 3, Scene 6):**
Method: Confrontation with evidence

**Clue Placement for These Chapters:**
- clue_core_contradiction_chain must appear in Act 1, Scene 2 via Cross-check contradiction

**VALIDATION CONSEQUENCE:** If these requirements are not met exactly, story validation will fail and the entire generation will be rejected, costing $5-8 to regenerate. Follow these specifications precisely.


## Asset Self-Report (required)
At the very END of your response, after all prose, add a single line:
<used_assets>era:story:0,era:story:1,era:story:2,era:story:3</used_assets>
Replace the list with only the IDs of texture assets you actually used. If you used none, output <used_assets></used_assets>.
```

## Message 2 (role=user)

```text
Write the full prose following the outline scenes.



CHAPTER OBLIGATION CONTRACT (MUST SATISFY):
- Chapter 2:
  - Word count: Target 1250 words. Achieve this through plot events, dialogue exchanges, and physical investigation — not through atmospheric repetition or extended internal reflection. Each 200-word segment should contain at minimum one concrete story event (a discovery, a conversation exchange, a physical action or movement). Padding with atmosphere alone is not acceptable.
  - Location anchor: the library.
  - Opening atmosphere (MANDATORY — validator enforced): the first paragraph MUST contain at least one of: rain / wind / fog / storm / mist / thunder / evening / morning / night / dawn / dusk / season / afternoon / midday / noon / midnight / twilight / sunrise / sunset / daylight / sunlight / overcast / cloudy / bright / dark. A chapter that omits all of these from its opening paragraph will be rejected.
  - Continuity bridge: in the first 120 words, visibly connect from the previous chapter's final beat. Carry forward one unresolved element (object, accusation, emotional pressure, or immediate physical action) from: "In the ensuing silence, the gravity of their predicament settled upon them like a shroud. The library, once a place of refuge, had transformed into a stage for betrayal and deceit. Eleanor's mind raced as she considered...".
  - CLUE OBLIGATIONS — mandatory prose elements (do NOT omit or bury):
    • The clock's appearance suggests it had been tampered with, indicating potential foul play. [clue_core_contradiction_chain] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: This contradicts the assumption that the clock was showing the correct time.
      ↳ MANDATORY TWO-PARAGRAPH STRUCTURE (must appear in paragraphs 1 or 2 — no later):
         Paragraph 1: The POV character physically approaches or directly observes this evidence.
           The narration or dialogue explicitly states what is seen (use the exact locked phrase if one applies).
         Paragraph 2 (immediately following): The detective or POV character explicitly reasons
           about what this evidence implies — who it implicates, why it may be unreliable,
           or what inference it supports. This must be a separate full paragraph, not a sentence appended to Paragraph 1.
    • The mechanism relies on the clock, library, and crack to expose the false timing. [clue_mechanism_visibility_core] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: The clock's faulty timing mechanism is crucial to understanding the murder.
      ↳ MANDATORY TWO-PARAGRAPH STRUCTURE (must appear in paragraphs 1 or 2 — no later):
         Paragraph 1: The POV character physically approaches or directly observes this evidence.
           The narration or dialogue explicitly states what is seen (use the exact locked phrase if one applies).
         Paragraph 2 (immediately following): The detective or POV character explicitly reasons
           about what this evidence implies — who it implicates, why it may be unreliable,
           or what inference it supports. This must be a separate full paragraph, not a sentence appended to Paragraph 1.
  - Tonal contrast: include at least one beat of relief or ironic counterpoint. Do not sustain maximum tension for every paragraph.
  - Sensory obligation — use at least two of: The room is bathed in a soft, diffused light that creates an intimate yet somber atmosphere., Shadows stretch across the floor, hinting at the weight of unspoken truths lingering in the air. | The silence is punctuated by the occasional flutter of a bird outside, an intrusion on the otherwise still air., The distant ticking of a clock serves as a reminder of the passing time, echoing like a heartbeat. | The scent of aged paper and leather mingles in the air, creating a heady atmosphere of knowledge.. Mood: uneasy stillness.
- Locked fact phrase obligations:
  - If this batch mentions The exact time shown on the stopped clock face, write exactly: "ten minutes past eleven".
  - If this batch mentions The exact amount the clock was wound back, write exactly: "forty minutes".
  - If this batch mentions The position of the drawer containing the winding key, write exactly: "half-open".
  - If this batch mentions The size of the crack on the clock's glass, write exactly: "a quarter inch".
- Seasonal vocabulary allow-list: winter, wintry, midwinter.
- Forbidden seasonal words: spring, summer, autumn.

FROZEN TIMELINE STATE (DO NOT ALTER):
- Timeline anchor: December (winter).
- Month, season, weather, and time-of-year language in this batch must stay compatible with winter.
- Established timeline fact: 9:45 PM
- Established timeline fact: 10:05 PM
- If referenced, use exact time phrase: "ten minutes past eleven" (The exact time shown on the stopped clock face).
- If referenced, use exact time phrase: "forty minutes" (The exact amount the clock was wound back).
- If referenced, use exact time phrase: "a quarter inch" (The size of the crack on the clock's glass).

STORY TO DATE (REFERENCE ONLY — DO NOT COPY VERBATIM):
- Full prior chapter text is provided below for continuity, factual consistency, and reference accuracy.
- Use this to keep character voice, chronology, clue state, and location continuity aligned with earlier chapters.
- Do not quote, copy, or paraphrase these paragraphs too closely; write fresh prose that remains consistent with them.

--- BEGIN PRIOR CHAPTER 1 ---
Title: Chapter 1: Discovery
The morning after the murder brought a heavy overcast to the library, where the scent of damp earth mingled with the mustiness of the books. Raindrops streaked the tall windows, distorting the view of the garden outside, as Eleanor Voss stood frozen at the threshold. Her heart raced, a mix of dread and disbelief flooding her senses. The room, usually a sanctuary of knowledge, now felt like a tomb, shadows lurking in every corner. The flickering light from the fireplace cast an eerie glow, illuminating the scene before her. There, on the polished wooden floor, lay the lifeless body of Beatrice Quill, a vibrant socialite known for her sharp wit and grace, now reduced to a tragic figure whose presence had shattered the tranquility of Middleton Manor.

Eleanor stepped closer, her breath catching in her throat. The clock on the wall, cracked and ominous, showed the time as ten minutes past eleven. A quarter inch of glass was missing from its face, a stark reminder of the violence that had unfolded. She could hardly comprehend the implications of the scene before her. The clock's faulty timing mechanism was crucial to understanding the murder; it could easily mislead anyone trying to piece together the events of the night before. Who had tampered with it? And why? The very thought sent a shiver down her spine.

As she continued to examine the clock, a faint smudge on the clock face caught her eye, indicating it had been recently handled. This detail suggested tampering occurred shortly before the murder, raising questions about who had been in the library at that time. The implications were staggering; it seemed that someone had deliberately altered the clock's time, perhaps to conceal the true moment of death. Eleanor's mind raced as she considered the suspects, each of whom had access to the library. The weight of their secrets hung in the air, thick and suffocating.

Dr. Finch arrived moments later, his expression a mixture of shock and concern. "Eleanor, what have you found?" she asked, stepping into the room, her eyes immediately drawn to the body. The doctor knelt beside Beatrice, her hands steady as she assessed the situation. "This is dreadful. We must call the authorities at once," she said, her voice low and urgent. Eleanor nodded, her heart heavy with the knowledge that the clock's deceit could lead to a web of lies and accusations.

Captain Hale followed closely behind, his presence commanding yet laced with confusion. She glanced between Eleanor and the body, her brow furrowing. "What happened here?" she demanded, her voice rising slightly. "Why was no one alerted sooner?" Eleanor could feel the tension in the air, a palpable force that threatened to explode. She opened her mouth to respond but hesitated, knowing that the truth could unravel the fragile fabric of their lives. Instead, she offered a measured reply, "We must first understand what transpired before we can act."

Beatrice Quill entered next, her face pale and drawn. The sight of the body sent her into a momentary daze, and she clutched the doorframe for support. "Oh, dear God!" she gasped, her voice trembling. "Who could have done this?" The question hung in the air, heavy with implication. Eleanor exchanged a glance with Dr. Finch, who seemed equally unsettled. They were all trapped in this moment, bound by the shared horror of the scene before them.

As the reality of the situation sank in, Eleanor felt a wave of grief wash over her, mingling with the anxiety that had taken root in her chest. She lingered at the door, unguarded grief spilling into her expression, a stark contrast to the tension surrounding them. Each of them had secrets, motives that could intertwine with the tragedy that had unfolded. The clock's cracked face loomed large in her mind, a reminder of the fragility of their circumstances and the darkness that could lurk behind even the most polished of facades.

In the ensuing silence, the gravity of their predicament settled upon them like a shroud. The library, once a place of refuge, had transformed into a stage for betrayal and deceit. Eleanor's mind raced as she considered the implications of the clock, the smudge, and the body that lay before her. She knew that the truth was buried somewhere within the tangled web of relationships and lies that bound them all together. With a deep breath, she steeled herself for the task ahead, determined to uncover the secrets hidden within the walls of Middleton Manor.
--- END PRIOR CHAPTER 1 ---

[SCENE COMPLETENESS CONTRACTS — MANDATORY. Each contract below lists what you MUST enact in that chapter. Do not summarise or mention these labels in the prose — enact them organically.]
Chapter 2 (Act 1) completeness contract:
  PIVOT ELEMENT (MANDATORY — write this into the prose, shown not told): "The clock's cracked face becomes a point of contention"
  FACT ESTABLISHED (MANDATORY — reader must know this by chapter end): "Establishes that Dr. Finch was with the victim until ten, raising questions about the timing."

# Case Overview
Title: The Timed Deceit
Era: 1930s
Setting: Little Middleton, Yorkshire
Crime: murder (mechanical tampering)
Culprit: Captain Ivor Hale
False assumption: The victim was alive at the time indicated by the clock.
Cast: Eleanor Voss (she/her), Dr. Mallory Finch (he/him), Captain Ivor Hale (he/him), Beatrice Quill (she/her)

Setting Lock: Keep all scenes and descriptions consistent with the stated setting (Little Middleton, Yorkshire). Do not introduce a different location type.

Outline scenes:
[
  {
    "sceneNumber": 2,
    "act": 1,
    "title": "Initial Interrogation",
    "setting": {
      "location": "the library",
      "timeOfDay": "Late morning",
      "atmosphere": "Tension mounts as suspicions arise"
    },
    "characters": [
      "Eleanor Voss",
      "Dr. Mallory Finch",
      "Captain Ivor Hale",
      "Beatrice Quill"
    ],
    "purpose": "Establish alibis and initial suspicions",
    "cluesRevealed": [
      "clue_core_contradiction_chain",
      "clue_mechanism_visibility_core"
    ],
    "dramaticElements": {
      "conflict": "Accusations begin to fly",
      "tension": "Everyone's alibi is scrutinized",
      "microMomentBeats": [
        "Captain Hale's nervous glances betray his composure"
      ]
    },
    "summary": "As they wait for the authorities, Eleanor questions the others about their whereabouts. Dr. Finch claims to have been with the victim until ten, while Hale and Quill exchange nervous glances. The clock's cracked face becomes a point of contention.",
    "estimatedWordCount": 1800,
    "pivotElement": "The clock's cracked face becomes a point of contention",
    "factEstablished": "Establishes that Dr. Finch was with the victim until ten, raising questions about the timing.",
    "permittedBehavioursByAct": [
      {
        "characterName": "Eleanor Voss",
        "behaviour": "cooperative grief; no guilt-tells in Act I"
      },
      {
        "characterName": "Dr. Mallory Finch",
        "behaviour": "normal social behaviour; grief"
      },
      {
        "characterName": "Captain Ivor Hale",
        "behaviour": "normal social behaviour; confusion"
      },
      {
        "characterName": "Beatrice Quill",
        "behaviour": "normal social behaviour; shock"
      }
    ],
    "redHerringPlacement": null,
    "emotionalRegister": "The first investigation reveals the deep-seated tensions among the guests, creating a palpable sense of unease.",
    "dominantCharacterNote": {
      "name": "Eleanor Voss",
      "voiceRegister": "Eleanor's voice is measured and articulate, often reflecting her scholarly pursuits and emotional depth."
    },
    "humourGuidance": {
      "permission": "permitted"
    },
    "eraTextureNote": "Limited mobility due to harsh winter weather; Reliance on domestic telephones for communication; Travel restrictions due to economic conditions",
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
□ Chapter 2: "The clock's appearance suggests it had been tampered with, indicating potential foul play." is placed in the first 25% of the chapter, followed by an explicit inference or suspicion paragraph.
□ Chapter 2: "The mechanism relies on the clock, library, and crack to expose the false timing." is placed in the first 25% of the chapter, followed by an explicit inference or suspicion paragraph.
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
Attempt 3/6 — chapters 2 — 1 validation issue(s) to resolve:

═══ PROSE QUALITY ERRORS (1) ═══
• Chapter 2 marked non-convergent after attempt 2/6: continuity

✓ SOLUTION: Vary paragraph lengths (short, medium, long)
✓ Include sensory details and atmospheric description
✓ Ensure each chapter has substance (3+ paragraphs minimum)

Return corrected JSON for chapters 2. Edit only the sections that failed — keep all content that passed validation, and return the complete updated chapter JSON.


RETRY CLASS: continuity
ATTEMPT: 2/6
MANDATORY FIXES:
- Resolve continuity issues before accepting this batch.
- Character "Captain Ivor Hale" has incorrect pronouns. Should use he/him/his but found: her
MITIGATION MODE: tighten_obligation
```
